// msbv-cau-noi.test.mjs — hồ sơ mot-so-ba-ve, làn cầu nối (AC-5). Tên ca = tên AC.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const CN = path.join(ROOT, 'scripts', 'cau-noi-ruling.mjs');
const FIX = readFileSync(path.join(HERE, 'fixtures', 'msbv-progress-superpowers.md'), 'utf8');

// Ma trận viết TRƯỚC cau-noi-ruling.mjs: một phần tử cho MỖI đoạn Ruling của fixture, đúng thứ tự,
// chữ chép nguyên văn theo quy tắc cắt của kế hoạch Task 3 Step 4 — NHÃN («Vì sao:», «Vì sao lật:»,
// «Sai thì tốn:», «Giá nếu sai:», «cost if wrong:», có dấu hay không) thắng dấu « — »; không có nhãn
// vì-sao thì cắt theo « — »; «parked — <finding> — Ruling: …» thành «KHÔNG sửa: <finding>», type revisit.
const KY_VONG = [
  {"dau": "Ruling 1: nội dung t", "decision": "nội dung trung tính 1.", "why": "nội dung trung tính 2.", "cost_if_wrong": "nội dung trung tính 3.", "type": "approach"},
  {"dau": "Ruling 2: nội dung t", "decision": "nội dung trung tính 4.", "why": "nội dung trung tính 5`.", "cost_if_wrong": "nội dung trung tính 6.", "type": "approach"},
  {"dau": "Ruling 3: nội dung t", "decision": "nội dung trung tính 7 — nội dung trung tính 8`.", "why": "nội dung trung tính 9.", "cost_if_wrong": "nội dung trung tính 10) — nội dung trung tính 11.", "type": "approach"},
  {"dau": "Ruling 4: nội dung t", "decision": "nội dung trung tính 12`.", "why": "nội dung trung tính 13.", "cost_if_wrong": "nội dung trung tính 14`.", "type": "approach"},
  {"dau": "Task 2: Ruling: nội ", "decision": "nội dung trung tính 15).", "why": "nội dung trung tính 16 — nội dung trung tính 17.", "cost_if_wrong": "nội dung trung tính 18.", "type": "approach"},
  {"dau": "Task 2: Ruling: nội ", "decision": "nội dung trung tính 19.", "why": "nội dung trung tính 20`.", "cost_if_wrong": "nội dung trung tính 21.", "type": "approach"},
  {"dau": "Task 4: Ruling: nội ", "decision": "nội dung trung tính 39»", "why": "nội dung trung tính 40 — nội dung trung tính 41.", "cost_if_wrong": "nội dung trung tính 42.", "type": "approach"},
  {"dau": "Task 4: Ruling: nội ", "decision": "nội dung trung tính 43", "why": "nội dung trung tính 44.", "cost_if_wrong": "nội dung trung tính 45.", "type": "approach"},
  {"dau": "Task 5+6: Ruling: nộ", "decision": "nội dung trung tính 60.", "why": "nội dung trung tính 61.", "cost_if_wrong": "nội dung trung tính 62.", "type": "approach"},
  {"dau": "Task 5+6: Ruling: nộ", "decision": "nội dung trung tính 63 — nội dung trung tính 64).", "why": "nội dung trung tính 65 — nội dung trung tính 66.", "cost_if_wrong": "nội dung trung tính 67.", "type": "approach"},
  {"dau": "Task 7: Ruling (làm ", "decision": "nội dung trung tính 70.", "why": "nội dung trung tính 71.", "cost_if_wrong": "nội dung trung tính 72.", "type": "approach"},
  {"dau": "Task 5+6: Ruling: nộ", "decision": "nội dung trung tính 76", "why": "nội dung trung tính 77.", "cost_if_wrong": "nội dung trung tính 78.", "type": "approach"},
  {"dau": "Task 7: Ruling: nội ", "decision": "nội dung trung tính 81.", "why": "nội dung trung tính 82 — nội dung trung tính 83.", "cost_if_wrong": "nội dung trung tính 84.", "type": "approach"},
  {"dau": "Final: Ruling: noi d", "decision": "noi dung trung tinh 102", "why": "noi dung trung tinh 103.", "cost_if_wrong": "noi dung trung tinh 104.", "type": "approach"},
  {"dau": "Final: Ruling: noi d", "decision": "noi dung trung tinh 105", "why": "noi dung trung tinh 106.", "cost_if_wrong": null, "type": "approach"},
  {"dau": "Final: Ruling: noi d", "decision": "noi dung trung tinh 107", "why": "noi dung trung tinh 108.", "cost_if_wrong": null, "type": "approach"},
  {"dau": "Final: parked — noi ", "decision": "KHÔNG sửa: noi dung trung tinh 109)", "why": "noi dung trung tinh 110 — noi dung trung tinh 111.", "cost_if_wrong": "noi dung trung tinh 112.", "type": "revisit"},
  {"dau": "Final: parked — noi ", "decision": "KHÔNG sửa: noi dung trung tinh 113)", "why": "noi dung trung tinh 114.", "cost_if_wrong": "noi dung trung tinh 115.", "type": "revisit"},
  {"dau": "Final: parked — noi ", "decision": "KHÔNG sửa: noi dung trung tinh 116", "why": "noi dung trung tinh 117.", "cost_if_wrong": "noi dung trung tinh 118.", "type": "revisit"},
  {"dau": "S4: Ruling: noi dung", "decision": "noi dung trung tinh 119.", "why": "noi dung trung tinh 120 — noi dung trung tinh 121.", "cost_if_wrong": "noi dung trung tinh 122.", "type": "approach"},
  {"dau": "Ruling: nội dung tru", "decision": "nội dung trung tính 123", "why": "nội dung trung tính 124 nội dung trung tính 125 nội dung trung tính 126.", "cost_if_wrong": "nội dung trung tính 127.", "type": "approach"},
  {"dau": "Ruling: nội dung tru", "decision": "nội dung trung tính 128 nội dung trung tính 129 nội dung trung tính 130", "why": "nội dung trung tính 131 nội dung trung tính 132 nội dung trung tính 133.", "cost_if_wrong": "nội dung trung tính 134.", "type": "approach"},
  {"dau": "Ruling: nội dung tru", "decision": "nội dung trung tính 135 nội dung trung tính 136 nội dung trung tính 137).", "why": null, "cost_if_wrong": "nội dung trung tính 138.", "type": "approach"},
  {"dau": "Ruling: dùng khoá cũ", "decision": "dùng khoá cũ", "why": "khớp nếp kho", "cost_if_wrong": "một lần đổi tên", "type": "approach"},
  {"dau": "Final: Ruling: giữ hà", "decision": "giữ hành vi X mà người soát gạt ra", "why": "hợp đồng không nói", "cost_if_wrong": "một vòng sửa nếu sai", "type": "approach"},
  {"dau": "Task 3: parked — tên", "decision": "KHÔNG sửa: tên biến viết tắt khó đọc", "why": "giữ nguyên vì cùng nếp tệp bên cạnh", "cost_if_wrong": null, "type": "revisit"}
];

let pass = 0, fail = 0;
const ca = (n, f) => { try { f(); pass++; console.log(`PASS: ${n} `); } catch (e) { fail++; console.log(`FAIL: ${n} — ${e.message}`); } };
const die = m => { throw new Error(m); };
const kho = (slug = 'ho-so-mau', ws = '2026-09-19-ho-so-mau', progress = FIX) => {
  const r = mkdtempSync(path.join(tmpdir(), 'msbv-cn-'));
  mkdirSync(path.join(r, '_acceptance', slug), { recursive: true });
  writeFileSync(path.join(r, '_acceptance', slug, 'decisions.jsonl'), '');
  const w = path.join(r, '.superpowers', 'sdd', ws); mkdirSync(w, { recursive: true });
  if (progress !== null) writeFileSync(path.join(w, 'progress.md'), progress);
  return { r, w, L: path.join(r, '_acceptance', slug, 'decisions.jsonl') };
};
const chay = (r, w, extra = [], cn = CN) => spawnSync('node', [cn, '--root', r, '--workspace', w, '--write', ...extra], { encoding: 'utf8' });
const so = L => readFileSync(L, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const soRuling = () => FIX.split('\n').filter(l => /\bRuling\b[^:\n]*:/.test(l) && !/minor \(deferred\)/.test(l)).length;

ca('MS-AC5-ma-tran', () => {
  if (KY_VONG.length !== soRuling()) die(`ma tran co ${KY_VONG.length} hang, fixture co ${soRuling()} doan Ruling`);
  const { r, w, L } = kho(); const x = chay(r, w);
  if (x.status !== 0) die('exit ' + x.status + ' ' + x.stderr);
  const d = so(L);
  if (d.length !== KY_VONG.length) die(`so co ${d.length} dong, ky vong ${KY_VONG.length}`);
  KY_VONG.forEach((k, i) => {
    const o = d[i];
    for (const f of ['decision', 'why', 'cost_if_wrong']) if ((o[f] ?? null) !== k[f]) die(`hang «${k.dau}» ${f}:\n  got : ${o[f]}\n  want: ${k[f]}`);
    if (o.type !== k.type || o.stage !== 'S3' || o.source !== 'superpowers') die(`hang «${k.dau}» type/stage/source sai`);
    if (!/^d-\d{8}T\d{6}Z-\d+$/.test(o.id)) die('id sai khuon: ' + o.id);
  });
  if (new Set(d.map(o => o.source_ref)).size !== d.length) die('source_ref trung');
  if (d.some(o => /minor \(deferred\)/.test(o.decision))) die('dong minor vao so');
  const vangGia = d.filter(o => !o.cost_if_wrong).length;
  if (vangGia !== KY_VONG.filter(k => k.cost_if_wrong === null).length) die('so hang vang gia lech ma tran');
});

ca('MS-AC5-lap', () => {
  const { r, w, L } = kho(); chay(r, w); const n1 = so(L).length;
  if (n1 !== KY_VONG.length) die(`doi chung duong: lan dau phai gat ${KY_VONG.length} dong, duoc ${n1}`);
  chay(r, w);
  if (so(L).length !== n1) die(`chay lan hai them ${so(L).length - n1} dong`);
});

ca('MS-AC5-slug', () => {
  const a = kho(); const x = spawnSync('node', [CN, '--root', a.r, '--workspace', a.w, '--write'], { encoding: 'utf8' });
  if (x.status !== 0 || so(a.L).length === 0) die('khong suy duoc slug tu ten workspace');
  const b = kho('ho-so-that', 'ten-la-khong-co-ngay', FIX.replace('_acceptance/ho-so-mau/', '_acceptance/ho-so-that/'));
  const y = chay(b.r, b.w); if (y.status !== 0 || so(b.L).length === 0) die('khong suy duoc slug tu dong contract trong ledger');
  const c = kho('khac', 'ten-la', FIX.replace('_acceptance/ho-so-mau/contract.md', 'khong-co.md'));
  const z = chay(c.r, c.w);
  if (z.status !== 2 || !z.stderr.includes('không suy được hồ sơ')) die(`ky vong exit 2 «không suy được hồ sơ», duoc ${z.status} ${z.stderr}`);
});

ca('MS-AC5-rong', () => {
  for (const p of [null, '# SDD ledger\n\nTask 1: complete (commits a..b)\n']) {
    const { r, w, L } = kho(undefined, undefined, p); const x = chay(r, w);
    if (x.status !== 0 || !x.stderr.includes('không có ruling để gặt') || so(L).length) die(`ca ${p === null ? 'vang tep' : '0 ruling'}: exit ${x.status} ${x.stderr}`);
  }
});

ca('MS-AC5-dot-bien', () => {
  const ban = mutate => { const d = mkdtempSync(path.join(tmpdir(), 'msbv-cnm-')); cpSync(path.join(ROOT, 'scripts'), path.join(d, 'scripts'), { recursive: true }); cpSync(path.join(ROOT, 'lib'), path.join(d, 'lib'), { recursive: true }); const p = path.join(d, 'scripts', 'cau-noi-ruling.mjs'); const s = readFileSync(p, 'utf8'); const m = mutate(s); if (m === s) die('kim khong khop'); writeFileSync(p, m); return p; };
  const p1 = ban(s => s.replace('if (daCo.has(ref)) continue;', ''));
  const a = kho(); chay(a.r, a.w, [], p1); chay(a.r, a.w, [], p1);
  if (so(a.L).length !== 2 * KY_VONG.length) die('dot bien bo dedupe khong co tac dung');
  console.log(`    · chieu do: bo so source_ref → «gặt lặp nhân đôi: ${so(a.L).length}» (bat duoc)`);
  // Kim đặt TRƯỚC nhóm «(?:», không phải trước cả biểu thức: «/X|(?:…)\s*:/» vẫn khớp nhãn qua nhánh
  // thứ hai nên đột biến không đổi gì; «/X(?:…)\s*:/» thì không bao giờ khớp (bản so khớp đã hạ chữ thường).
  const p2 = ban(s => s.replace('const NHAN_GIA = /(?:', 'const NHAN_GIA = /KHONG-BAO-GIO-KHOP(?:'));
  const b = kho(); chay(b.r, b.w, [], p2);
  if (so(b.L)[0].cost_if_wrong === KY_VONG[0].cost_if_wrong) die('dot bien bo nhan gia khong co tac dung');
  console.log('    · chieu do: bo nhan lam dau cat → «hàng Ruling 1 mất cost» (bat duoc)');
});

console.log(`Results: ${pass} passed, ${fail} failed (msbv-cau-noi)`);
process.exit(fail ? 1 : 0);
