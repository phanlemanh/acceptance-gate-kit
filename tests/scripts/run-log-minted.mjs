#!/usr/bin/env node
// run-log-minted — AC-7 của hồ sơ vu-trang-goal-luc-goi-ten: vết máy-giữ cho nếp
// «S4 đi qua Workflow, không agent tay». Workflow acceptance-verify đúc run_id dạng
// `minted-<slug>-<id>-r<n>` (id = eval id trong evals.yaml, hoặc `SUITE-<khoá executor>`)
// và MỘT ts cho cả vòng; run-log chạy tay mang hình dạng khác (vd `lmcms-E1-r1`,
// nhiều ts). Chạy LÚC TRÌNH CỔNG 2, sau khi Workflow đã append — không phải eval
// (eval chạy trước khi run-log tồn tại → fail-open; gap-probe vòng 2).
//
// Thoát 1 + thông điệp ghim: «chua co run-log — AC-7 CHUA do» · «run_id khong do
// workflow duc: <id>» · «hai ts trong mot vong». Thoát 0: «AC-7 OK: <n> dong, vong r<k>, 1 ts».
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const arg = k => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : ''; };
const slug = arg('--slug'), root = path.resolve(arg('--root') || '.');
if (!slug) { console.error('dung: run-log-minted.mjs --slug <slug> [--root <repo>]'); process.exit(2); }
const ws = path.join(root, '_acceptance', slug);
const logP = path.join(ws, 'run-log.jsonl');
if (!existsSync(logP)) { console.log(`chua co run-log — AC-7 CHUA do (${path.relative(root, logP)})`); process.exit(1); }

// Tập id hợp lệ RÚT từ evals.yaml của chính hồ sơ (không gõ literal) — thiếu evals thì không có gì để đối chiếu.
const evP = path.join(ws, 'evals.yaml');
const ids = existsSync(evP) ? [...readFileSync(evP, 'utf8').matchAll(/^\s*-\s*id:\s*(\S+)/gm)].map(m => m[1]) : [];
if (!ids.length) { console.log('evals.yaml khong co id nao — AC-7 CHUA do'); process.exit(1); }

const lines = readFileSync(logP, 'utf8').split(/\r?\n/).filter(l => l.trim());
const rows = [];
for (const l of lines) { try { rows.push(JSON.parse(l)); } catch { /* dòng hỏng: bỏ, đếm ở dưới */ } }
const broken = lines.length - rows.length;
const evalRows = rows.filter(r => r.evalId && r.run_id);
if (!evalRows.length) { console.log('run-log khong co dong eval nao — AC-7 CHUA do'); process.exit(1); }
const lastRound = Math.max(...evalRows.map(r => Number(r.round) || 0));
const last = evalRows.filter(r => (Number(r.round) || 0) === lastRound);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const RX = new RegExp(`^minted-${esc(slug)}-(?:${ids.map(esc).join('|')}|SUITE-[A-Za-z0-9_]+)-r\\d+$`);
const bad = last.filter(r => !RX.test(String(r.run_id)));
if (bad.length) { console.log(`run_id khong do workflow duc: ${bad.map(r => r.run_id).join(', ')} (vong r${lastRound}, ${bad.length}/${last.length} dong)`); process.exit(1); }
const ts = new Set(last.map(r => r.ts));
if (ts.size !== 1) { console.log(`hai ts trong mot vong: r${lastRound} co ${ts.size} ts khac nhau — workflow duc MOT ts/vong`); process.exit(1); }
console.log(`AC-7 OK: ${last.length} dong, vong r${lastRound}, 1 ts${broken ? ` (bo qua ${broken} dong hong)` : ''}`);
