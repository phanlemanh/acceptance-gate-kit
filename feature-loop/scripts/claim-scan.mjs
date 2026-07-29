#!/usr/bin/env node
// claim-scan — dẫn xuất claim máy-đọc-được từ _acceptance/*/decisions.jsonl
// (fix|descope) + gap-probe.md (verdict: findings). Index là VIEW: nguồn sự
// thật vẫn là file gốc append-only; không persist, không drift.
// Pipeline cố định: parse → lọc loại → exclude-self → dedupe → sort → cap → serialize.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';

const USAGE = 'usage: claim-scan --root <dir> --slug <slug> [--json]';
const CAP = 10, TRUNC = 250;
const ID_RE = /^(d-[0-9TZ]+-[0-9]+|[a-z0-9-]+#F[0-9]+)$/;

function parseArgs(argv) {
  const a = { json: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--root') a.root = argv[++i];
    else if (argv[i] === '--slug') a.slug = argv[++i];
    else if (argv[i] === '--json') a.json = true;
    else return null;
  }
  if (!a.root || !a.slug) return null;
  return a;
}
const cut = (s) => { s = String(s ?? '').trim(); return s.length > TRUNC ? s.slice(0, TRUNC) + '…' : s; };

function ledgerClaims(file, slug, warn) {
  const out = []; let bad = 0;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    let e; try { e = JSON.parse(line); } catch { bad++; continue; }
    if (e.type !== 'fix' && e.type !== 'descope') continue;
    out.push({ id: e.id, source: 'ledger', slug, kind: e.type, stage: e.stage ?? null,
      sev: null, at: e.at ?? null, claim: cut(e.decision), lesson: cut(e.impact),
      pointer: `_acceptance/${slug}/decisions.jsonl`,
      ...(Array.isArray(e.serves) && e.serves.length ? { serves: e.serves } : {}) });
  }
  if (bad) warn(`claim-scan: skipped ${bad} malformed lines in ${file}`);
  return out;
}

function probeClaims(file, slug, warn) {
  const text = readFileSync(file, 'utf8');
  const fm = /^---\n([\s\S]*?)\n---/.exec(text);
  const meta = {}; if (fm) for (const l of fm[1].split('\n')) {
    const m = /^([a-z0-9_]+):\s*(.*)$/.exec(l.trim()); if (m) meta[m[1]] = m[2];
  }
  if (meta.verdict !== 'findings') return [];
  if (!meta.at) { warn(`claim-scan: skipped ${file} (missing at)`); return []; }
  const sect = /## Findings([\s\S]*)/.exec(text);
  if (!sect) { warn(`claim-scan: skipped ${file} (malformed table)`); return []; }
  const rows = sect[1].split('\n').filter(l => l.trim().startsWith('|'));
  const out = []; let n = 0; let malformed = false;
  for (const line of rows.slice(2)) { // bỏ header + separator
    const cells = line.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
    if (cells.length !== 6) { malformed = true; continue; }
    n++;
    const [sev, , gap, fail, , disp] = cells;
    out.push({ id: `${slug}#F${n}`, source: 'gap-probe', slug, kind: 'finding', stage: 'S1',
      sev: /^P[0-2]$/.test(sev) ? sev : null, at: meta.at, claim: cut(`${gap} — ${fail}`),
      lesson: cut(disp), pointer: `_acceptance/${slug}/gap-probe.md` });
  }
  if (malformed) warn(`claim-scan: skipped ${file} (malformed table)`);
  return out;
}

export function scan(root, slug, warn = (m) => console.error(m)) {
  const accDir = path.join(root, '_acceptance');
  let claims = [];
  if (existsSync(accDir)) for (const name of readdirSync(accDir).sort()) {
    if (name === slug) continue; // exclude-self
    const d = path.join(accDir, name);
    if (!statSync(d).isDirectory()) continue;
    const led = path.join(d, 'decisions.jsonl');
    if (existsSync(led)) claims.push(...ledgerClaims(led, name, warn));
    const gp = path.join(d, 'gap-probe.md');
    if (existsSync(gp)) claims.push(...probeClaims(gp, name, warn));
  }
  const seen = new Set();
  claims = claims.filter(c => ID_RE.test(c.id) && !seen.has(c.id) && seen.add(c.id));
  const rank = (s) => ({ P0: 0, P1: 1, P2: 2 })[s] ?? 3;
  claims.sort((a, b) => rank(a.sev) - rank(b.sev) || String(b.at).localeCompare(String(a.at)));
  return claims.slice(0, CAP);
}

function toMarkdown(claims) {
  if (!claims.length) return '';
  return ['## Bài học từ feature trước (advisory)', '',
    ...claims.map(c => `- [${c.id}] (${c.slug} · ${c.stage ?? c.sev ?? '-'} · ${c.kind}) ${c.claim} — ${c.lesson}`),
    ''].join('\n');
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  const a = parseArgs(process.argv.slice(2));
  if (!a) { console.error(USAGE); process.exit(2); }
  if (!existsSync(a.root) || !statSync(a.root).isDirectory()) {
    console.error(`claim-scan: root not found: ${a.root}\n${USAGE}`); process.exit(2);
  }
  const claims = scan(a.root, a.slug);
  process.stdout.write(a.json ? JSON.stringify({ claims }, null, 2) + '\n' : toMarkdown(claims));
}
