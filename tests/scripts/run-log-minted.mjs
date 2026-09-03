#!/usr/bin/env node
// run-log-minted — AC-7 của hồ sơ vu-trang-goal-luc-goi-ten: kiểm run-log của vòng chấm
// CUỐI khớp HỢP ĐỒNG CỦA BÊN VIẾT (feature-loop/workflows/acceptance-verify.js), không
// khớp một hình dạng chuỗi tự đoán. Bên viết có HAI nhánh run_id (S4-r1 bắt):
//   · verifier nhặt được run_id thật từ stdout → dùng nguyên;
//   · rỗng → đúc `minted-<slug>-<evalId>-r<n>` hoặc `minted-<slug>-SUITE-<khoá>-r<n>`;
// và ghi dòng `{evalId, kind:'vang-mat'}` KHÔNG run_id cho eval mà agent chết/skip (S4-r2
// bắt: bộ lọc `!r.kind` từng làm eval vắng mặt tàng hình). Mỗi LẦN GỌI workflow một ts.
// Vết máy-giữ đọc được: MỌI id trong evals.yaml có ĐÚNG MỘT dòng eval ở vòng cuối, run_id
// khác rỗng (vang-mat = rỗng → đỏ), evalId thuộc tập id đọc qua CHÍNH lib/eval-yaml.js,
// cùng round cùng sha (khi bên viết ghi sha), dòng hỏng JSON = đỏ (script cổng, không báo
// cáo). Vết mạnh hơn: usage-report.md do wf-usage.mjs sinh từ transcript — --usage đòi đúng
// heading bên viết in (`### <title> — <wf_run> (<n> agent, …)`), không phải chuỗi ở đâu đó.
// Chạy LÚC TRÌNH CỔNG 2, sau khi main loop append run-log; KHÔNG là eval.
//
// Thoát 1 + thông điệp ghim: «chua co run-log — AC-7 CHUA do» · «dong run-log hong JSON: <n>» ·
// «thieu dong eval: <id>» · «run_id rong: <evalId>» · «run_id doi id ngoai evals.yaml: <id>» ·
// «hai dong cho mot eval: <id>» · «sha lech trong mot vong» · «usage-report thieu muc S4 round k
// do wf-usage sinh». Thoát 0: «AC-7 OK: <n> dong, vong r<k>, <t> lan goi (ts), sha <7>».
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const arg = k => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : ''; };
const has = k => process.argv.includes(k);
const slug = arg('--slug'), root = path.resolve(arg('--root') || '.');
if (!slug) { console.error('dung: run-log-minted.mjs --slug <slug> [--root <repo>] [--usage]'); process.exit(2); }
const ws = path.join(root, '_acceptance', slug);
const logP = path.join(ws, 'run-log.jsonl');
if (!existsSync(logP)) { console.log(`chua co run-log — AC-7 CHUA do (${path.relative(root, logP)})`); process.exit(1); }

const require = createRequire(import.meta.url);
const { parseEvals } = require(path.join(root, 'lib', 'eval-yaml.js'));
const evP = path.join(ws, 'evals.yaml');
const ids = existsSync(evP) ? parseEvals(readFileSync(evP, 'utf8'), []).map(e => e.id).filter(Boolean) : [];
if (!ids.length) { console.log('evals.yaml khong co id nao — AC-7 CHUA do'); process.exit(1); }

const lines = readFileSync(logP, 'utf8').split(/\r?\n/).filter(l => l.trim());
const rows = []; let broken = 0;
for (const l of lines) { try { rows.push(JSON.parse(l)); } catch { broken++; } }
// Dòng hỏng = vết không đọc được → đỏ (script cổng, không phải báo cáo).
if (broken) { console.log(`dong run-log hong JSON: ${broken} — vet khong doc duoc, AC-7 CHUA do`); process.exit(1); }
// Dòng eval = có evalId và (không kind, hoặc kind 'vang-mat' của bên viết). Dòng memo (baseline/panel/round-tally) bỏ.
const isEval = r => r.evalId && (!r.kind || r.kind === 'vang-mat');
const evalRows = rows.filter(isEval);
if (!evalRows.length) { console.log('run-log khong co dong eval nao — AC-7 CHUA do'); process.exit(1); }
const lastRound = Math.max(...evalRows.map(r => Number(r.round) || 0));
const last = evalRows.filter(r => (Number(r.round) || 0) === lastRound);
// (0) MỌI id của evals.yaml có ĐÚNG MỘT dòng ở vòng cuối — vắng là đỏ, trùng là đỏ (đối chiếu ngược tập id).
const byId = new Map(); for (const r of last) { const k = String(r.evalId); byId.set(k, (byId.get(k) || 0) + 1); }
const missing = ids.filter(id => !byId.has(id));
if (missing.length) { console.log(`thieu dong eval: ${missing.join(', ')} (vong r${lastRound})`); process.exit(1); }
const dup = ids.filter(id => byId.get(id) > 1);
if (dup.length) { console.log(`hai dong cho mot eval: ${dup.join(', ')} (vong r${lastRound})`); process.exit(1); }
// (1) run_id khác rỗng — dòng vang-mat của bên viết KHÔNG có run_id → chính là ca này.
const empty = last.filter(r => !String(r.run_id || '').trim());
if (empty.length) { console.log(`run_id rong: ${empty.map(r => r.evalId + (r.kind ? ` (${r.kind})` : '')).join(', ')} (vong r${lastRound})`); process.exit(1); }
// (2) dòng eval (không phải SUITE) phải trỏ id có trong evals.yaml.
const la = last.filter(r => !String(r.evalId).startsWith('SUITE-') && !ids.includes(String(r.evalId)));
if (la.length) { console.log(`run_id doi id ngoai evals.yaml: ${la.map(r => r.evalId + '→' + r.run_id).join(', ')}`); process.exit(1); }
// (3) cùng round cùng sha — chỉ khi bên viết có ghi sha (invokedSha vắng → không có gì để so, nói rõ).
const shas = new Set(last.map(r => r.sha).filter(Boolean));
if (shas.size > 1) { console.log(`sha lech trong mot vong: r${lastRound} co ${shas.size} sha — cung round phai cung cay`); process.exit(1); }
const tsN = new Set(last.map(r => r.ts)).size;
// (4) --usage: heading do wf-usage.mjs in — `### <title> — <wf_run> (<n> agent, …)` với title chứa «S4 round k».
if (has('--usage')) {
  const uP = path.join(ws, 'usage-report.md');
  const u = existsSync(uP) ? readFileSync(uP, 'utf8') : '';
  const RXU = new RegExp(`^### [^\\n]*\\bS4 round ${lastRound}\\b[^\\n]* — wf_[0-9a-f-]+ \\(\\d+ agent, `, 'm');
  if (!RXU.test(u)) { console.log(`usage-report thieu muc S4 round ${lastRound} do wf-usage sinh (heading «### … — wf_… (n agent, …)») — khong co vet transcript workflow`); process.exit(1); }
}
console.log(`AC-7 OK: ${last.length} dong, vong r${lastRound}, ${tsN} lan goi (ts), sha ${shas.size ? String([...shas][0]).slice(0, 7) : '(ben viet khong ghi)'}`);
