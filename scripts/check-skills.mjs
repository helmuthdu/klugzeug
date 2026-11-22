#!/usr/bin/env node
// Validates every klugzeug skill and the shared files it depends on.
//   - frontmatter: spec-valid name equal to the directory, a bounded description, known fields only
//   - context budget: SKILL.md words, and SKILL.md plus the contract it always reads
//   - references: every cited `references/...` or `../<skill>/...` path exists, and every file in
//     references/ is cited by its SKILL.md (one level deep, no orphans)
//   - shared copies: regular files identical to shared/, present exactly where cited
//   - vocabulary: bracket markers and plan statuses are the ones the contract defines
//   - profile keys: every key row in the onboard template is read as **Key** outside onboard
// `--fix` rewrites the shared copies from shared/ before checking.
// Exits 1 on any failure so install.sh can refuse to link a broken set.

import { copyFileSync, existsSync, lstatSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS = join(ROOT, 'skills');
const SHARED = join(ROOT, 'shared');
const CONTRACT = join(SHARED, 'contract.md');
const PROFILE_TEMPLATE = join(SKILLS, 'kz-onboard', 'references', 'profile-template.md');
const SHARED_FILES = ['contract.md', 'browser-verification.md'];

const MAX_DESCRIPTION = 400;
const MAX_SKILL_WORDS = 800;
const MAX_ACTIVATION_WORDS = 2000;
const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const FRONTMATTER_FIELDS = new Set([
  'name',
  'description',
  'license',
  'compatibility',
  'metadata',
  'allowed-tools',
  'argument-hint',
  'disable-model-invocation',
]);
const MARKERS = new Set(['BLOCKED', 'VERIFY', 'DEFERRED', 'VULN', 'CONCERN']);

const errors = [];
const fail = (message) => errors.push(message);
const read = (path) => readFileSync(path, 'utf8');
const words = (text) => text.split(/\s+/).filter(Boolean).length;
const rel = (path) => path.slice(ROOT.length + 1);

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const pair = line.match(/^([^:\s][^:]*):\s*(.*)$/);
    if (pair) fields[pair[1].trim()] = pair[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return { fields, body: text.slice(match[0].length) };
}

function markdownFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((entry) => entry.endsWith('.md'))
    .map((entry) => join(dir, entry));
}

const skillNames = [];
for (const entry of readdirSync(SKILLS, { withFileTypes: true })) {
  if (entry.isDirectory()) skillNames.push(entry.name);
  else fail(`skills/${entry.name} is not a directory; skills must be folders`);
}
if (skillNames.length === 0) fail('no skills found under skills/');
for (const file of SHARED_FILES) if (!existsSync(join(SHARED, file))) fail(`shared/${file} is missing`);

// A skill needs a shared copy when its SKILL.md or another reference cites it.
function citesShared(dir, file) {
  const needle = `\`references/${file}\``;
  const sources = [join(dir, 'SKILL.md'), ...markdownFiles(join(dir, 'references'))];
  return sources.some((path) => !path.endsWith(`/${file}`) && existsSync(path) && read(path).includes(needle));
}

if (process.argv.includes('--fix')) {
  for (const name of skillNames) {
    const dir = join(SKILLS, name);
    for (const file of SHARED_FILES) {
      const copy = join(dir, 'references', file);
      if (!citesShared(dir, file) || !existsSync(join(SHARED, file))) continue;
      const stat = lstatSync(copy, { throwIfNoEntry: false });
      if (stat && !stat.isFile()) continue;
      if (stat && read(copy) === read(join(SHARED, file))) continue;
      copyFileSync(join(SHARED, file), copy);
      console.log(`check-skills: wrote ${rel(copy)}`);
    }
  }
}

function syncCopy(name, file) {
  const copy = join(SKILLS, name, 'references', file);
  const source = join(SHARED, file);
  if (!lstatSync(copy, { throwIfNoEntry: false })) return fail(`${name}: references/${file} is missing; run --fix`);
  if (!lstatSync(copy).isFile()) return fail(`${name}: references/${file} must be a regular file`);
  if (existsSync(source) && read(copy) !== read(source)) fail(`${name}: references/${file} differs from shared/${file}; run --fix`);
}

function checkSkill(name) {
  const dir = join(SKILLS, name);
  const file = join(dir, 'SKILL.md');
  if (!existsSync(file)) return fail(`${name}: missing SKILL.md`);
  const text = read(file);
  const parsed = parseFrontmatter(text);
  if (!parsed) return fail(`${name}: SKILL.md has no frontmatter block`);
  const { fields, body } = parsed;

  if (fields.name !== name) fail(`${name}: frontmatter name "${fields.name}" must equal the directory name`);
  if (!NAME_PATTERN.test(name) || name.length > 64) fail(`${name}: name must be 1-64 lowercase letters, digits, and single hyphens`);
  if (!fields.description) fail(`${name}: frontmatter description is missing`);
  else if (fields.description.length > MAX_DESCRIPTION)
    fail(`${name}: description is ${fields.description.length} characters (max ${MAX_DESCRIPTION})`);
  for (const key of Object.keys(fields)) if (!FRONTMATTER_FIELDS.has(key)) fail(`${name}: unknown frontmatter field "${key}"`);

  const skillWords = words(body);
  if (skillWords > MAX_SKILL_WORDS) fail(`${name}: SKILL.md body is ${skillWords} words (max ${MAX_SKILL_WORDS}); move detail to references/`);
  if (existsSync(CONTRACT)) {
    const activation = skillWords + words(read(CONTRACT));
    if (activation > MAX_ACTIVATION_WORDS)
      fail(`${name}: SKILL.md plus contract is ${activation} words (max ${MAX_ACTIVATION_WORDS})`);
  }

  const referenceFiles = markdownFiles(join(dir, 'references'));
  const sources = [text, ...referenceFiles.filter((path) => existsSync(path)).map(read)];
  for (const source of sources) {
    for (const [, ref] of source.matchAll(/`(references\/[\w.-]+\.md)`/g)) {
      if (!existsSync(join(dir, ref)) || !statSync(join(dir, ref)).isFile()) fail(`${name}: cited file does not exist: ${ref}`);
    }
    for (const [, skill, path] of source.matchAll(/`\.\.\/([a-z0-9-]+)\/([\w./<>-]+)`/g)) {
      if (!skillNames.includes(skill)) fail(`${name}: cites sibling skill "${skill}", which does not exist`);
      else if (!path.includes('<') && !existsSync(join(SKILLS, skill, path))) fail(`${name}: cited file does not exist: ../${skill}/${path}`);
    }
  }

  // A placeholder such as `references/<lens>.md` covers files whose bare name SKILL.md names in backticks or bold.
  const placeholder = /`references\/<[\w-]+>\.md`/.test(text);
  for (const path of referenceFiles) {
    const entry = path.slice(path.lastIndexOf('/') + 1);
    const base = entry.replace(/\.md$/, '');
    const named = text.includes(`\`references/${entry}\``);
    const covered = placeholder && (text.includes(`\`${base}\``) || text.includes(`**${base}**`));
    if (!named && !covered) fail(`${name}: references/${entry} is not cited by SKILL.md`);
  }

  for (const shared of SHARED_FILES) {
    if (shared === 'contract.md' || citesShared(dir, shared)) syncCopy(name, shared);
  }
}

for (const name of skillNames) checkSkill(name);

// Markers and plan statuses are a closed vocabulary defined by the contract.
function contractStatuses(contract) {
  const line = contract.split('\n').find((text) => text.startsWith('- Item status'));
  return new Set([...(line ?? '').matchAll(/`— ([A-Z][A-Z ]*[A-Z])`/g)].map((match) => match[1]));
}

function checkVocabulary() {
  if (!existsSync(CONTRACT)) return fail('shared/contract.md is missing');
  const statuses = contractStatuses(read(CONTRACT));
  if (statuses.size === 0) fail('shared/contract.md defines no plan item statuses');
  const files = [...SHARED_FILES.map((file) => join(SHARED, file))];
  for (const name of skillNames) files.push(join(SKILLS, name, 'SKILL.md'), ...markdownFiles(join(SKILLS, name, 'references')));
  for (const path of files.filter((file) => existsSync(file))) {
    const text = read(path);
    for (const [, marker] of text.matchAll(/\[([A-Z]{3,})(?:[ \]])/g)) {
      if (!MARKERS.has(marker)) fail(`${rel(path)}: unknown marker [${marker}]`);
    }
    for (const [, status] of text.matchAll(/`— ([A-Z][A-Z ]*[A-Z])`/g)) {
      if (!statuses.has(status)) fail(`${rel(path)}: unknown plan status "— ${status}"`);
    }
  }
}

checkVocabulary();

// Profile keys: the onboard template's `| Key | Value |` tables are the canonical list. A key that
// no rule reads as **Key** outside onboard changes no behaviour.
function profileKeys(template) {
  const keys = [];
  let inKeyTable = false;
  for (const line of template.split('\n')) {
    if (!line.startsWith('|')) {
      inKeyTable = false;
      continue;
    }
    const cell = line.split('|')[1].trim();
    if (cell === 'Key') inKeyTable = true;
    else if (inKeyTable && !/^-+$/.test(cell)) keys.push(cell);
  }
  return keys;
}

function checkProfileKeys() {
  if (!existsSync(PROFILE_TEMPLATE)) return fail('skills/kz-onboard/references/profile-template.md is missing');
  const keys = profileKeys(read(PROFILE_TEMPLATE));
  if (keys.length === 0) return fail('profile-template.md lists no profile keys');
  const sources = SHARED_FILES.map((file) => join(SHARED, file));
  for (const name of skillNames.filter((skill) => skill !== 'kz-onboard')) {
    sources.push(join(SKILLS, name, 'SKILL.md'));
    sources.push(...markdownFiles(join(SKILLS, name, 'references')).filter((path) => !SHARED_FILES.some((file) => path.endsWith(`/${file}`))));
  }
  const text = sources.filter((path) => existsSync(path)).map(read).join('\n');
  for (const key of keys) if (!text.includes(`**${key}**`)) fail(`profile key "${key}" is not read by any rule outside onboard`);
}

checkProfileKeys();

if (errors.length > 0) {
  console.error(`check-skills: ${errors.length} problem(s)`);
  for (const message of errors) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(`check-skills: ${skillNames.length} skills and ${SHARED_FILES.length} shared files OK`);
