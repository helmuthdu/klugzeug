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

function check(root) {
  return spawnSync(process.execPath, [join(root, 'scripts', 'check-skills.mjs')], { encoding: 'utf8' });
}

test('reports profile keys that no rule reads', () => {
  withFixture((root) => {
    const perf = join(root, 'skills', 'review', 'references', 'perf.md');
    writeFileSync(perf, readFileSync(perf, 'utf8').replaceAll('**Bundle budget**', 'Bundle budget'));
    const result = check(root);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /profile key "Bundle budget" is not read/);
  });
});

test('reports shared reference copies that differ from their source', () => {
  withFixture((root) => {
    const contract = join(root, 'skills', 'build', 'references', 'contract.md');
    writeFileSync(contract, `${readFileSync(contract, 'utf8')}\nChanged copy\n`);
    const result = check(root);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /build: references\/contract\.md differs from shared\/contract\.md/);
  });
});

test('rejects shared references that cannot be packaged independently', () => {
  withFixture((root) => {
    const contract = join(root, 'skills', 'build', 'references', 'contract.md');
    unlinkSync(contract);
    symlinkSync('../../../shared/contract.md', contract);
    const result = check(root);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /build: references\/contract\.md must be a regular file/);
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
        assert.ok(
          existsSync(join(dest, 'references', 'browser-verification.md')),
          `${entry.name} is missing browser verification`,
        );
      }
    }
  } finally {
    rmSync(output, { recursive: true, force: true });
  }
});
