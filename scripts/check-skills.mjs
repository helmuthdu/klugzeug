#!/usr/bin/env node
// Validates every klugzeug skill and the shared files it depends on.
//   - SKILL.md exists; frontmatter has name (== directory) and description
//   - SKILL.md stays within the line budget (progressive disclosure)
//   - every `references/...` or `~/.agents/klugzeug/...` path named in SKILL.md, its references/, or shared/ exists
//   - every key in shared/contract.md "## Profile keys" has a row in the onboard profile template
// Exits 1 on any failure so install.sh can refuse to link a broken set.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS = join(ROOT, 'skills');
const SHARED = join(ROOT, 'shared');
const PROFILE_TEMPLATE = join(SKILLS, 'onboard', 'references', 'profile-template.md');
const MAX_LINES = 110;
const MAX_DESCRIPTION = 400;
const SHARED_FILES = ['contract.md', 'browser-verification.md'];

const errors = [];
const fail = (message) => errors.push(message);

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split('\n')) {
    const pair = line.match(/^([a-z-]+):\s*(.*)$/);
    if (pair) fields[pair[1]] = pair[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return fields;
}

function checkSkill(name) {
  const dir = join(SKILLS, name);
  const file = join(dir, 'SKILL.md');
  if (!existsSync(file)) {
    fail(`${name}: missing SKILL.md`);
    return;
  }
  const text = readFileSync(file, 'utf8');
  const fields = parseFrontmatter(text);
  if (!fields) {
    fail(`${name}: SKILL.md has no frontmatter block`);
    return;
  }
  if (fields.name !== name) fail(`${name}: frontmatter name "${fields.name}" must equal directory name`);
  if (!fields.description) fail(`${name}: frontmatter description is missing`);
  else if (fields.description.length > MAX_DESCRIPTION)
    fail(`${name}: description is ${fields.description.length} characters (max ${MAX_DESCRIPTION})`);

  const lines = text.split('\n').length;
  if (lines > MAX_LINES) fail(`${name}: SKILL.md is ${lines} lines (budget ${MAX_LINES}); move detail to references/`);

  const referencesDir = join(dir, 'references');
  const sources = [text];
  if (existsSync(referencesDir)) {
    for (const entry of readdirSync(referencesDir)) {
      if (entry.endsWith('.md')) sources.push(readFileSync(join(referencesDir, entry), 'utf8'));
    }
  }
  checkRefs(name, dir, sources);
}

function checkRefs(label, dir, sources) {
  const refs = new Set();
  for (const source of sources) {
    for (const match of source.matchAll(/`(references\/[\w./-]+\.md)`/g)) refs.add(match[1]);
    for (const match of source.matchAll(/`~\/\.agents\/klugzeug\/([\w./-]+\.md)`/g)) refs.add(`shared:${match[1]}`);
  }
  for (const ref of refs) {
    const path = ref.startsWith('shared:') ? join(SHARED, ref.slice(7)) : join(dir, ref);
    if (!existsSync(path) || !statSync(path).isFile()) fail(`${label}: referenced file does not exist: ${ref}`);
  }
}

for (const file of SHARED_FILES) {
  const path = join(SHARED, file);
  if (!existsSync(path)) fail(`shared/${file} is missing`);
  else checkRefs(`shared/${file}`, SHARED, [readFileSync(path, 'utf8')]);
}

// Profile keys are the contract's canonical vocabulary. The onboard template must carry a row for
// each one (`| Key | ... |`), so `onboard` never writes a profile that skills cannot read.
function profileKeys(contract) {
  const lines = contract.split('\n');
  const start = lines.indexOf('## Profile keys');
  if (start === -1) return null;
  const keys = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith('## ')) break;
    if (!line.startsWith('- ')) continue;
    for (const match of line.matchAll(/\*\*(.+?)\*\*:/g)) keys.push(match[1]);
  }
  return keys;
}

function checkProfileKeys() {
  const keys = profileKeys(readFileSync(join(SHARED, 'contract.md'), 'utf8'));
  if (!keys) return fail('shared/contract.md has no "## Profile keys" section');
  if (keys.length === 0) return fail('shared/contract.md "## Profile keys" lists no keys');
  if (!existsSync(PROFILE_TEMPLATE)) return fail('skills/onboard/references/profile-template.md is missing');
  const template = readFileSync(PROFILE_TEMPLATE, 'utf8');
  for (const key of keys) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`^\\|\\s*${escaped}\\s*\\|`, 'm').test(template)) {
      fail(`profile-template.md has no row for profile key "${key}"`);
    }
  }
}

checkProfileKeys();

const entries = readdirSync(SKILLS, { withFileTypes: true });
const skillNames = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
for (const entry of entries) {
  if (!entry.isDirectory()) fail(`skills/${entry.name} is not a directory; skills must be folders`);
}
if (skillNames.length === 0) fail('no skills found under skills/');
for (const name of skillNames) checkSkill(name);

if (errors.length > 0) {
  console.error(`check-skills: ${errors.length} problem(s)`);
  for (const message of errors) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(`check-skills: ${skillNames.length} skills and ${SHARED_FILES.length} shared files OK`);
