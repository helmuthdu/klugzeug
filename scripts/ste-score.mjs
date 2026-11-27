#!/usr/bin/env node
// Counts finding-line metrics for STE experiment exports.
// Usage: node scripts/ste-score.mjs [file ...]

import { readFileSync } from 'node:fs';

const FILLER = /\b(basically|simply|very|might|probably|perhaps|seems)\b/gi;

function scoreFile(path) {
  const text = readFileSync(path, 'utf8');
  const findings = text.split('\n').filter((line) => /^\[(Critical|High|Medium|Low)\]/.test(line));
  const lengths = findings.map((l) => l.length);
  const median =
    lengths.length === 0
      ? 0
      : [...lengths].sort((a, b) => a - b)[Math.floor(lengths.length / 2)];
  return {
    file: path,
    findings: findings.length,
    medianLen: median,
    maxLen: lengths.length ? Math.max(...lengths) : 0,
    fillers: (findings.join(' ').match(FILLER) ?? []).length,
    verify: (findings.join(' ').match(/\[VERIFY\]/g) ?? []).length,
  };
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('ste-score: pass one or more markdown files');
  process.exit(2);
}

for (const file of files) console.log(JSON.stringify(scoreFile(file)));