import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function withFixture(run) {
  const root = mkdtempSync(join(tmpdir(), 'klugzeug-skills-test-'));
  try {
    mkdirSync(join(root, 'scripts'));
    cpSync(join(ROOT, 'scripts', 'check-skills.mjs'), join(root, 'scripts', 'check-skills.mjs'));
    cpSync(join(ROOT, 'shared'), join(root, 'shared'), { recursive: true, verbatimSymlinks: true });
    cpSync(join(ROOT, 'skills'), join(root, 'skills'), { recursive: true, verbatimSymlinks: true });
    run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function check(root, ...args) {
  return spawnSync(process.execPath, [join(root, 'scripts', 'check-skills.mjs'), ...args], { encoding: 'utf8' });
}

function edit(path, change) {
  writeFileSync(path, change(readFileSync(path, 'utf8')));
}

function assertFails(root, pattern) {
  const result = check(root);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, pattern);
}

test('the repository passes its own checks', () => {
  const result = spawnSync(process.execPath, [join(ROOT, 'scripts', 'check-skills.mjs')], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('reports profile keys that no rule reads', () => {
  withFixture((root) => {
    edit(join(root, 'skills', 'kz-review', 'references', 'perf.md'), (text) => text.replaceAll('**Bundle budget**', 'Bundle budget'));
    assertFails(root, /profile key "Bundle budget" is not read/);
  });
});

test('reports shared reference copies that differ from their source, and --fix repairs them', () => {
  withFixture((root) => {
    const contract = join(root, 'skills', 'kz-build', 'references', 'contract.md');
    edit(contract, (text) => `${text}\nChanged copy\n`);
    assertFails(root, /kz-build: references\/contract\.md differs from shared\/contract\.md/);
    const fixed = check(root, '--fix');
    assert.equal(fixed.status, 0, fixed.stdout + fixed.stderr);
    assert.equal(readFileSync(contract, 'utf8'), readFileSync(join(root, 'shared', 'contract.md'), 'utf8'));
  });
});

test('rejects shared references that cannot be packaged independently', () => {
  withFixture((root) => {
    const contract = join(root, 'skills', 'kz-build', 'references', 'contract.md');
    unlinkSync(contract);
    symlinkSync('../../../shared/contract.md', contract);
    assertFails(root, /kz-build: references\/contract\.md must be a regular file/);
  });
});

test('reports reference files that SKILL.md does not cite', () => {
  withFixture((root) => {
    writeFileSync(join(root, 'skills', 'kz-docs', 'references', 'unused.md'), '# Unused\n');
    assertFails(root, /kz-docs: references\/unused\.md is not cited by SKILL\.md/);
  });
});

test('reports cited files and sibling skills that do not exist', () => {
  withFixture((root) => {
    edit(join(root, 'skills', 'kz-plan', 'SKILL.md'), (text) => text.replace('`../kz-review/SKILL.md`', '`../kz-reviewer/SKILL.md`'));
    assertFails(root, /kz-plan: cites sibling skill "kz-reviewer", which does not exist/);
    edit(join(root, 'skills', 'kz-build', 'SKILL.md'), (text) => `${text}\nSee \`references/missing.md\`.\n`);
    assertFails(root, /kz-build: cited file does not exist: references\/missing\.md/);
  });
});

test('reports markers and plan statuses outside the contract vocabulary', () => {
  withFixture((root) => {
    edit(join(root, 'skills', 'kz-test', 'SKILL.md'), (text) => `${text}\nMark it [TODO] and \`— SHIPPED\`.\n`);
    const result = check(root);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /unknown marker \[TODO\]/);
    assert.match(result.stderr, /unknown plan status "— SHIPPED"/);
  });
});

test('enforces spec-valid frontmatter', () => {
  withFixture((root) => {
    edit(join(root, 'skills', 'kz-docs', 'SKILL.md'), (text) => text.replace('name: kz-docs', 'name: kz-docs\ntrigger: always'));
    assertFails(root, /kz-docs: unknown frontmatter field "trigger"/);
  });
});

test('rejects unknown frontmatter keys with underscores', () => {
  withFixture((root) => {
    edit(join(root, 'skills', 'kz-docs', 'SKILL.md'), (text) => text.replace('name: kz-docs', 'name: kz-docs\ntrigger_name: always'));
    assertFails(root, /kz-docs: unknown frontmatter field "trigger_name"/);
  });
});

test('enforces the SKILL.md word budget', () => {
  withFixture((root) => {
    edit(join(root, 'skills', 'kz-deliver', 'SKILL.md'), (text) => `${text}\n${'word '.repeat(900)}\n`);
    assertFails(root, /kz-deliver: SKILL\.md body is \d+ words/);
  });
});

test('independently packaged skills contain their required shared references', () => {
  const output = mkdtempSync(join(tmpdir(), 'klugzeug-skills-package-'));
  try {
    for (const entry of readdirSync(join(ROOT, 'skills'), { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const source = join(ROOT, 'skills', entry.name);
      const dest = join(output, entry.name);
      cpSync(source, dest, {
        recursive: true,
        filter(path) {
          if (!lstatSync(path).isSymbolicLink()) return true;
          const target = relative(source, realpathSync(path));
          return target !== '..' && !target.startsWith(`..${sep}`) && !isAbsolute(target);
        },
      });
      assert.ok(existsSync(join(dest, 'references', 'contract.md')), `${entry.name} is missing its contract`);
      if (existsSync(join(source, 'references', 'browser-verification.md'))) {
        assert.ok(existsSync(join(dest, 'references', 'browser-verification.md')), `${entry.name} is missing browser verification`);
      }
    }
  } finally {
    rmSync(output, { recursive: true, force: true });
  }
});
