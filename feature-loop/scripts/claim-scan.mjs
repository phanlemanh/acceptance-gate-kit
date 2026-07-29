#!/usr/bin/env node
// claim-scan — dẫn xuất claim máy-đọc-được từ _acceptance/*/decisions.jsonl
// (fix|descope) + gap-probe.md (verdict: findings). Index là VIEW: nguồn sự
// thật vẫn là file gốc append-only; không persist, không drift.
// Pipeline cố định: parse → lọc loại → exclude-self → dedupe → sort → cap → serialize.
import { readdirSync, readFileSync, existsSync, statSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
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
    // Entry rỗng ruột (thiếu decision/impact) = malformed — emit claim text
    // rỗng là câm-lặng kiểu khác (parser-hardening PH5).
    if (!e.decision || !e.impact) { bad++; continue; }
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
  // Frontmatter không đọc được (mất ---, thiếu key verdict) phải PHÂN BIỆT
  // với verdict hợp lệ ≠ findings — trước đây cả hai cùng im lặng (PH4).
  if (!fm || !('verdict' in meta)) {
    warn(`claim-scan: skipped ${file} (unreadable frontmatter)`);
    return [];
  }
  // Verdict ngoài enum của SKILL (clean|findings|probe-failed) là data lỗi,
  // không phải bỏ-qua-chủ-đích — typo "findigns" từng nuốt cả file câm (S4-r1).
  if (!['clean', 'findings', 'probe-failed'].includes(meta.verdict)) {
    warn(`claim-scan: skipped ${file} (unknown verdict)`);
    return [];
  }
  if (meta.verdict !== 'findings') return [];
  if (!meta.at) { warn(`claim-scan: skipped ${file} (missing at)`); return []; }
  // Capture DỪNG ở heading kế tiếp BẤT KỂ cấp (#..######) — chỉ dừng ở h2
  // vẫn để "### Notes"/"# Appendix" lọt vào capture và sinh claim ma
  // (finding HIGH S4-r1 của parser-hardening; gốc: HIGH round 3 V1).
  const sect = /## Findings([\s\S]*?)(?=\n#{1,6} |$)/.exec(text);
  if (!sect) { warn(`claim-scan: skipped ${file} (malformed table)`); return []; }
  const rows = sect[1].split('\n').filter(l => l.trim().startsWith('|'));
  const out = []; let badRows = 0;
  rows.slice(2).forEach((line, idx) => { // bỏ header + separator
    const n = idx + 1; // vị trí hàng VẬT LÝ trong bảng — id phải trỏ đúng hàng
    // người mở gap-probe.md sẽ đọc, kể cả khi hàng trước đó hỏng (S4-r1)
    const cells = line.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
    if (cells.length !== 6) { badRows++; return; }
    const [sev, , gap, fail, , disp] = cells;
    out.push({ id: `${slug}#F${n}`, source: 'gap-probe', slug, kind: 'finding', stage: 'S1',
      sev: /^P[0-2]$/.test(sev) ? sev : null, at: meta.at, claim: cut(`${gap} — ${fail}`),
      lesson: cut(disp), pointer: `_acceptance/${slug}/gap-probe.md` });
  });
  // Thông điệp per-row: "(malformed table)" chỉ dành cho nhánh bỏ CẢ FILE ở
  // trên — hàng lành vẫn được giữ thì phải nói đúng là bỏ N hàng (S4-r1).
  if (badRows) warn(`claim-scan: skipped ${badRows} malformed rows in ${file}`);
  // verdict: findings mà section không có hàng dữ liệu nào = nhánh câm thứ ba
  // không có tên — file hứa findings phải có ≥1 hàng (S4-r1 parser-hardening).
  if (!out.length && !badRows) warn(`claim-scan: skipped ${file} (malformed table)`);
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
  // Lớp câm-lặng đã đóng (parser-hardening): mọi đường drop đều có tiếng,
  // trừ hai bỏ-qua-chủ-đích có tên trong design — (a) verdict hợp lệ ≠
  // findings, (b) dedupe id trùng trong CÙNG slug.
  const invalidBySlug = new Map();
  const firstSlugOf = new Map();
  const kept = [];
  for (const c of claims) {
    if (!ID_RE.test(String(c.id ?? ''))) {
      invalidBySlug.set(c.slug, (invalidBySlug.get(c.slug) ?? 0) + 1);
      continue;
    }
    if (firstSlugOf.has(c.id)) {
      if (firstSlugOf.get(c.id) !== c.slug)
        warn(`claim-scan: duplicate id ${c.id} across features (kept first)`);
      continue; // cùng slug: dedupe im lặng chủ đích
    }
    firstSlugOf.set(c.id, c.slug);
    kept.push(c);
  }
  for (const [s, n] of invalidBySlug)
    warn(`claim-scan: dropped ${n} claims with invalid id in ${s}`);
  claims = kept;
  const rank = (s) => ({ P0: 0, P1: 1, P2: 2 })[s] ?? 3;
  // at thiếu/không phải chuỗi → xếp CUỐI nhóm cùng sev, không phải đầu:
  // String(null) = "null" thắng mọi ISO date theo lexicographic (finding S4-r2).
  const atKey = (c) => (typeof c.at === 'string' ? c.at : '');
  const byKey = (a, b) => rank(a.sev) - rank(b.sev) || atKey(b).localeCompare(atKey(a));
  claims.sort(byKey);
  // Cap 10 với SÀN ĐA DẠNG NGUỒN: mọi finding gap-probe đều mang sev còn
  // ledger thì không, nên top-10 thuần sev sẽ đuổi sạch bài học ledger
  // (CS9 bắt trên corpus thật). Mỗi nguồn có ứng viên giữ tối thiểu
  // min(3, số nó có) slot; phần còn lại theo thứ tự sort toàn cục.
  const FLOOR = 3;
  const picked = [];
  for (const src of ['ledger', 'gap-probe']) {
    for (const c of claims.filter(c => c.source === src).slice(0, FLOOR)) picked.push(c);
  }
  for (const c of claims) {
    if (picked.length >= CAP) break;
    if (!picked.includes(c)) picked.push(c);
  }
  return picked.slice(0, CAP).sort(byKey);
}

function toMarkdown(claims) {
  if (!claims.length) return '';
  return ['## Bài học từ feature trước (advisory)', '',
    ...claims.map(c => `- [${c.id}] (${c.slug} · ${c.stage ?? c.sev ?? '-'} · ${c.kind}) ${c.claim} — ${c.lesson}`),
    ''].join('\n');
}

// fileURLToPath + realpathSync CẢ HAI vế (không phải URL.pathname): pathname
// còn percent-encoding (khoảng trắng → %20), và ESM loader canonicalize
// symlink (macOS /var → /private/var) còn argv[1] thì không — vế nào lệch
// cũng làm isMain=false → CLI thành no-op exit 0, fail-open không phân biệt
// được với corpus rỗng (finding S4-r1).
const isMain = (() => {
  if (!process.argv[1]) return false;
  try { return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url)); }
  catch { return false; }
})();
if (isMain) {
  const a = parseArgs(process.argv.slice(2));
  if (!a) { console.error(USAGE); process.exit(2); }
  if (!existsSync(a.root) || !statSync(a.root).isDirectory()) {
    console.error(`claim-scan: root not found: ${a.root}\n${USAGE}`); process.exit(2);
  }
  const claims = scan(a.root, a.slug);
  process.stdout.write(a.json ? JSON.stringify({ claims }, null, 2) + '\n' : toMarkdown(claims));
}
