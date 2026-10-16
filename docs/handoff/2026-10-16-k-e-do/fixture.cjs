// K-E: hồ sơ khuôn 2.28 do CODE sinh từ khuôn của chính v2.28.0 → đọc bằng lib 2.28 và lib HEAD.
// argv: newLib oldLib oldAcceptanceVerify.js oldSignoff.md
const fs = require('fs');
const NEW = require(process.argv[2]), OLD = require(process.argv[3]);
const AV = fs.readFileSync(process.argv[4], 'utf8'), SG = fs.readFileSync(process.argv[5], 'utf8');
// Khuôn mục — rút OOC-ITEM-TEMPLATE của acceptance-verify.js v2.28.0.
const tm = /<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)OOC-ITEM-TEMPLATE>>>/.exec(AV);
if (!tm) throw new Error('không rút được OOC-ITEM-TEMPLATE');
const TPL = tm[1].replace(/\\n/g, '\n').replace(/\\`/g, '`');
// Khoá round-tally — rút ROUND-TALLY-SCHEMA + tallyLine (ts, round, kind) của cùng tệp.
if (!/kind: 'round-tally'/.test(AV) || !/ts: \(args/.test(AV)) throw new Error('khuôn round-tally 2.28 đổi');
// Dòng sổ gate2 — rút dạng {"id":"d-<UTC>-<n>",...,"stage":"gate2","at":"<ISO>",...} của signoff.md v2.28.0.
const gm = /`(\{"id":"d-<UTC>-<n>","type":"veto","stage":"gate2","at":"<ISO>"[^`]*\})`/.exec(SG);
if (!gm) throw new Error('không rút được khuôn dòng gate2 của signoff 2.28');
const muc = i => TPL.replace('{title}', `Lỗi thử số ${i}`).replace('{plain}', `Người dùng thấy lỗi ${i}`)
  .replace('{file}', `src/a${i}.js:${i}`).replace('{severity}', 'minor').replace('{proposal}', 'known-limits');
const findings = ['## Ngoài hợp đồng — người quyết ở Gate 2', '', 'Câu mở.', '', muc(1), muc(2), muc(3), ''].join('\n');
const tally = ts => JSON.stringify({ ts, round: 1, kind: 'round-tally', verdict: 'PASS', expected: 3, returned: 3, blocked: 0 });
const idOf = (iso, n) => 'd-' + iso.replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z') + '-' + n;
const dong = (idIso, at, n) => JSON.parse(gm[1].replace('d-<UTC>-<n>', idOf(idIso, n)).replace('<ISO>', at)
  .replace('"type":"veto"', '"type":"decision"').replace('<lý do nguyên văn>', 'Ngoài-1: ghi Known limits; Ngoài-2: ghi Known limits; Ngoài-3: ghi Known limits')
  .replace('<tên>', 'manh').replace('<ISO>', at));
const ROUND = '2026-09-21T22:28:28Z';
const ca = [
  ['DC (đối chứng dương): ký SAU lượt chấm, at ISO đủ giờ Z', [dong('2026-09-21T22:38:41Z', '2026-09-21T22:38:41Z', 8)], [ROUND], []],
  ['ĐN (độ nhạy): ký TRƯỚC một lượt chấm sau', [dong('2026-09-21T20:00:00Z', '2026-09-21T20:00:00Z', 8)], [ROUND], ['Ngoài-1', 'Ngoài-2', 'Ngoài-3']],
  ['at +07:00 đủ giờ, sau lượt chấm', [dong('2026-09-21T22:38:41Z', '2026-09-22T05:38:41+07:00', 8)], [ROUND], []],
  ['at chỉ NGÀY (nửa đêm +07:00), id sau lượt chấm — ca lệch giả đo được ở kho tiêu thụ', [dong('2026-09-21T22:38:41Z', '2026-09-22T00:00:00+07:00', 8)], [ROUND], []],
  ['at chỉ NGÀY trần «2026-09-22», id sau lượt chấm', [dong('2026-09-21T22:38:41Z', '2026-09-22', 8)], [ROUND], []],
  ['run-log không round-tally (hồ sơ trước 29/08)', [dong('2026-09-21T22:38:41Z', '2026-09-22', 8)], [], []],
];
let hong = 0;
for (const [ten, dongs, rounds, mongMoi] of ca) {
  const l = dongs.map(x => JSON.stringify(x)).join('\n'), r = rounds.map(tally).join('\n');
  const o = OLD.mucChuaDinhTuyen(findings, l).chua, w = NEW.mucChuaDinhTuyen(findings, l, r).chua;
  if (OLD.parse(findings).findings.length !== 3) throw new Error('fixture không ra 3 mục — khuôn hỏng');
  const ok = w.join() === mongMoi.join();
  if (!ok) hong++;
  console.log(`${ok ? 'ĐÚNG' : 'SAI '} | ${ten}\n       2.28 chưa định tuyến: [${o}] · HEAD: [${w}] · mong HEAD: [${mongMoi}]`);
}
console.log(`\n${hong} / ${ca.length} ca HEAD đọc khác mong đợi`);
