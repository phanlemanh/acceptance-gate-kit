#!/usr/bin/env node
// run-log-minted — AC-7 của hồ sơ vu-trang-goal-luc-goi-ten: kiểm run-log của vòng chấm
// CUỐI khớp HỢP ĐỒNG CỦA BÊN VIẾT (feature-loop/workflows/acceptance-verify.js), không
// khớp một hình dạng chuỗi tự đoán. Bên viết có HAI nhánh run_id (S4-r1 bắt):
//   · verifier nhặt được run_id thật từ stdout → dùng nguyên;
//   · rỗng → đúc `minted-<slug>-<evalId>-r<n>` hoặc `minted-<slug>-SUITE-<khoá>-r<n>`.
// Và mỗi LẦN GỌI workflow một ts (`invokedAt`) — vòng chạy lại cùng round có nhiều ts.
// Nên vết máy-giữ đọc được từ run-log là: mọi dòng eval có run_id KHÁC RỖNG (đúc hoặc
// verifier khai), mọi dòng cùng round cùng `sha`, và tập id đọc qua CHÍNH bộ đọc
// dùng chung lib/eval-yaml.js (không mọc bản parser thứ ba). Vết mạnh hơn nằm ở
// usage-report.md do wf-usage.mjs sinh từ transcript workflow — script kiểm nó có mục
// «S4 round <k>» (--usage). Chạy LÚC TRÌNH CỔNG 2, sau khi main loop append run-log;
// KHÔNG là eval (eval chạy trước khi run-log tồn tại → fail-open; gap-probe vòng 2).
//
// Thoát 1 + thông điệp ghim: «chua co run-log — AC-7 CHUA do» · «run_id rong: <evalId>» ·
// «run_id doi id ngoai evals.yaml: <id>» · «sha lech trong mot vong» · «usage-report thieu muc S4».
// Thoát 0: «AC-7 OK: <n> dong, vong r<k>, <t> lan goi (ts), sha <7>».
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

// Tập id qua CHÍNH bộ đọc dùng chung — thân block `expected: >` không được quét key.
const require = createRequire(import.meta.url);
const { parseEvals } = require(path.join(root, 'lib', 'eval-yaml.js'));
const evP = path.join(ws, 'evals.yaml');
const ids = existsSync(evP) ? parseEvals(readFileSync(evP, 'utf8'), []).map(e => e.id).filter(Boolean) : [];
if (!ids.length) { console.log('evals.yaml khong co id nao — AC-7 CHUA do'); process.exit(1); }

const lines = readFileSync(logP, 'utf8').split(/\r?\n/).filter(l => l.trim());
const rows = []; for (const l of lines) { try { rows.push(JSON.parse(l)); } catch { /* dòng hỏng đếm ở dưới */ } }
const broken = lines.length - rows.length;
const evalRows = rows.filter(r => r.evalId && !r.kind);
if (!evalRows.length) { console.log('run-log khong co dong eval nao — AC-7 CHUA do'); process.exit(1); }
const lastRound = Math.max(...evalRows.map(r => Number(r.round) || 0));
const last = evalRows.filter(r => (Number(r.round) || 0) === lastRound);
// (1) run_id khác rỗng ở mọi dòng.
const empty = last.filter(r => !String(r.run_id || '').trim());
if (empty.length) { console.log(`run_id rong: ${empty.map(r => r.evalId).join(', ')} (vong r${lastRound})`); process.exit(1); }
// (2) dòng eval (không phải SUITE) phải trỏ id có trong evals.yaml — đọc từ evalId, không đoán từ chuỗi run_id.
const la = last.filter(r => !String(r.evalId).startsWith('SUITE-') && !ids.includes(String(r.evalId)));
if (la.length) { console.log(`run_id doi id ngoai evals.yaml: ${la.map(r => r.evalId + '→' + r.run_id).join(', ')}`); process.exit(1); }
// (3) cùng round cùng sha (bên viết ghi invokedSha cho mọi dòng của một lần gọi; vòng chạy lại cùng round vẫn cùng cây).
const shas = new Set(last.map(r => r.sha).filter(Boolean));
if (shas.size > 1) { console.log(`sha lech trong mot vong: r${lastRound} co ${shas.size} sha — cung round phai cung cay`); process.exit(1); }
const tsN = new Set(last.map(r => r.ts)).size;
// (4) --usage: vết transcript của workflow — usage-report.md có mục S4 round k.
if (has('--usage')) {
  const uP = path.join(ws, 'usage-report.md');
  const u = existsSync(uP) ? readFileSync(uP, 'utf8') : '';
  if (!new RegExp(`S4 round ${lastRound}\\b`).test(u)) { console.log(`usage-report thieu muc S4 round ${lastRound} — khong co vet transcript workflow`); process.exit(1); }
}
console.log(`AC-7 OK: ${last.length} dong, vong r${lastRound}, ${tsN} lan goi (ts), sha ${[...shas][0] ? String([...shas][0]).slice(0, 7) : '(khong)'}${broken ? ` (bo qua ${broken} dong hong)` : ''}`);
