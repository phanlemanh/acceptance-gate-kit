#!/usr/bin/env node
// round-tally-read.mjs — bộ đọc dòng `kind: round-tally` trong run-log.jsonl.
// Là NỬA ĐỌC của cặp writer/reader (writer: acceptance-verify.js, AC-9 hồ sơ
// cham-dung-cay-dung-cho-dung); phép đếm 5-vòng-kế của opportunity đọc số qua
// đây thay vì khảo cổ.
//
// S4-r2 ĐỔI KHUÔN (owner chốt 29/08) — hai luật của cặp viết/đọc:
//   1. KHUÔN Ở MỘT CHỖ: khối `ROUND-TALLY-SCHEMA` trong acceptance-verify.js là
//      nguồn duy nhất; file này RÚT nó lúc chạy thay vì gõ lại danh sách khoá.
//      Bản trước gõ tay `[['round','number'], …]` nên khi bên viết sinh
//      `round: null` (lượt hỏng trước khi biết round) thì hai bên trôi khỏi nhau.
//   2. DÒNG HỎNG ≠ TỆP HỎNG: một dòng sai khuôn không được làm câm cả hồ sơ.
//      run-log là append-only, nên fail-closed-toàn-tệp biến MỘT lượt hỏng thành
//      mất vĩnh viễn phép đếm — đúng lúc cần đếm nhất. Nay dòng hỏng đi vào
//      `malformed[]` có tên, dòng lành vẫn trả về, và mã thoát vẫn khác 0 để
//      không ai đọc nhầm là sạch.
//
//   node round-tally-read.mjs --run-log <path> [--run-log <path>...] [--wf <path>]
//
// stdout: JSON {tallies: [...], malformed: [{file, line, why}]}
// exit 0 = mọi dòng tally đọc được · exit 2 = có dòng hỏng (dữ liệu lành VẪN in)
// exit 3 = usage/không rút được khuôn
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const files = [];
let wfPath = path.join(HERE, '..', 'workflows', 'acceptance-verify.js');
{
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 1) {
    const f = argv[i];
    if (f !== '--run-log' && f !== '--wf') { console.error(`round-tally-read: cờ không nhận diện được: ${f}\nusage: round-tally-read.mjs --run-log <path> [--run-log <path>...] [--wf <path>]`); process.exit(3); }
    if (!argv[i + 1] || argv[i + 1].startsWith('--')) { console.error(`round-tally-read: ${f} thiếu giá trị`); process.exit(3); }
    if (f === '--run-log') files.push(argv[i + 1]); else wfPath = argv[i + 1];
    i += 1;
  }
}
if (!files.length) { console.error('round-tally-read: cần ít nhất một --run-log'); process.exit(3); }

// ── Khuôn rút TỪ NGUỒN của bên viết, không gõ lại ─────────────────────────
const FIELDS = (() => {
  let src;
  try { src = fs.readFileSync(wfPath, 'utf8'); } catch { console.error(`round-tally-read: không đọc được nguồn khuôn ${wfPath}`); process.exit(3); }
  const lines = src.split('\n');
  const a = lines.findIndex(l => l.includes('<<<ROUND-TALLY-SCHEMA'));
  const b = lines.findIndex(l => l.includes('ROUND-TALLY-SCHEMA>>>'));
  if (a === -1 || b === -1 || b <= a) { console.error(`round-tally-read: không rút được khối ROUND-TALLY-SCHEMA trong ${wfPath} — bên viết đổi khuôn, KHÔNG đoán`); process.exit(3); }
  const body = lines.slice(a + 1, b).join('\n');
  const out = {};
  for (const m of body.matchAll(/"(\w+)":\s*([a-z|]+)/g)) out[m[1]] = m[2].split('|');
  // `kind` là hằng nhận dạng, không phải trường dữ liệu cần kiểu
  delete out.kind;
  if (!Object.keys(out).length) { console.error(`round-tally-read: khối ROUND-TALLY-SCHEMA rỗng trong ${wfPath}`); process.exit(3); }
  return out;
})();
const okType = (v, types) => types.some(t => (t === 'null' ? v === null : typeof v === t));

const tallies = [];
const malformed = [];
for (const f of files) {
  let text;
  try { text = fs.readFileSync(f, 'utf8'); } catch { malformed.push({ file: f, line: 0, why: 'không đọc được tệp' }); continue; }
  let n = 0;
  for (const raw of text.split('\n')) {
    if (!raw.trim()) continue;
    n += 1;
    let l; try { l = JSON.parse(raw); } catch { continue; } // dòng khác hỏng JSON không thuộc việc của bộ đọc này
    if (!l || l.kind !== 'round-tally') continue;
    const bad = Object.entries(FIELDS).filter(([k, types]) => !okType(l[k], types)).map(([k, types]) => `${k} (cần ${types.join('|')})`);
    if (bad.length) { malformed.push({ file: f, line: n, why: `khoá sai khuôn: ${bad.join(', ')}` }); continue; }
    const rec = { file: f };
    for (const k of Object.keys(FIELDS)) rec[k] = l[k];
    if (l.sha) rec.sha = l.sha;
    if (l.ts) rec.ts = l.ts;
    tallies.push(rec);
  }
}
process.stdout.write(JSON.stringify({ tallies, malformed }, null, 2) + '\n');
if (malformed.length) {
  console.error(`round-tally-read: ${malformed.length} dòng tally sai khuôn (dữ liệu lành vẫn in ở stdout — dòng hỏng KHÔNG làm câm cả hồ sơ): ${malformed.map(m => `${m.file}:${m.line} ${m.why}`).join(' ; ')}`);
  process.exit(2);
}
