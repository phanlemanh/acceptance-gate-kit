// repin-lane-dung-lai-model.test.mjs — ca bền của hồ sơ eval-goi-model-that-khong-chay (hàng G3): làn ghim
// lại dùng lại kết quả eval model thật khi băm năm lớp đầu vào không đổi. Ca LIB-* đo thư viện thuần; ca
// AC<n>-* chạy CHÍNH repin-lane.mjs --write trên kho thử code-sinh (gia-lan-fixture.mjs). Bộ đếm số lần chạy
// mỗi lệnh ghi ra thư mục NGOÀI kho. Bảng lớp và bảng lý do RÚT từ khối marker của bên viết.
//   GG_CASES=AC1-im node tests/scripts/repin-lane-dung-lai-model.test.mjs
import path from 'node:path';
import fs from 'node:fs';
import { boKiem, ok, ROOT } from './gia-lan-fixture.mjs';

const LIB = process.env.GG_LIB_DUNG_LAI || path.join(ROOT, 'feature-loop', 'scripts', 'lib', 'dung-lai-model.mjs');
const L = await import(LIB);

const ALL = ['LIB-van-tay-het-gio', 'LIB-van-tay-thoat', 'LIB-van-tay-rong', 'LIB-goi-ten', 'LIB-bien-shell', 'LIB-chon-nguon', 'LIB-bam-tung-lop', 'LIB-khoi-marker'];
const { ca, ket } = boKiem(ALL);

// Khối marker của bên viết — rút từ tệp thư viện, rút rỗng là ĐỎ.
export function rutKhoi(ten, file = LIB) {
  const m = fs.readFileSync(file, 'utf8').match(new RegExp(`// <<<${ten}\\n([\\s\\S]*?)// ${ten}>>>`));
  ok(m, `không thấy khối ${ten}`);
  const ds = [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]);
  ok(ds.length, `ghim: rút rỗng — khối ${ten} không có mục nào`);
  return ds;
}

await ca('LIB-khoi-marker', 'ba khối marker rút được và khớp hằng xuất ra', async () => {
  const lop = rutKhoi('CARRY-INPUT-LAYERS');
  ok(JSON.stringify(lop) === JSON.stringify(L.LOP_BAM), `khối lớp lệch hằng: ${JSON.stringify(lop)}`);
  const chay = rutKhoi('CARRY-LY-DO-CHAY');
  ok(JSON.stringify(chay) === JSON.stringify(Object.values(L.LY_DO_CHAY)), 'khối lý do chạy lệch hằng');
  const nguon = rutKhoi('CARRY-LY-DO-NGUON');
  ok(JSON.stringify(nguon) === JSON.stringify(Object.values(L.LY_DO_NGUON)), 'khối lý do nguồn lệch hằng');
  ok(L.HAN_NGAY === 7, `hạn ${L.HAN_NGAY}, hứa 7`);
  ok(L.HET_GIO_VAN_TAY_MS === 60000, `trần vân tay ${L.HET_GIO_VAN_TAY_MS}, hứa 60000`);
});

await ca('LIB-van-tay-het-gio', 'lệnh dấu vân tay quá trần → ok:false, lý do hết giờ, trả trong ≤ 3 s', async () => {
  const t = Date.now();
  const r = await L.chayVanTay('sleep 5; echo m1', { cwd: ROOT, env: process.env, timeoutMs: 500 });
  const ms = Date.now() - t;
  ok(!r.ok, `ghim: lệnh dấu vân tay không có trần — ok sau ${ms} ms`);
  ok(r.lyDo.startsWith(L.LY_DO_CHAY.vanTayHetGio), `lý do «${r.lyDo}»`);
  ok(ms <= 3000, `ghim: lệnh dấu vân tay không có trần — trả sau ${ms} ms`);
});
await ca('LIB-van-tay-thoat', 'lệnh dấu vân tay thoát 3 → ok:false, lý do thoát khác 0 kèm mã', async () => {
  const r = await L.chayVanTay('echo m1; exit 3', { cwd: ROOT, env: process.env });
  ok(!r.ok && r.lyDo.startsWith(L.LY_DO_CHAY.vanTayThoat) && /3/.test(r.lyDo), `kết quả ${JSON.stringify(r)}`);
});
await ca('LIB-van-tay-rong', 'lệnh in rỗng → ok:false; lệnh in nội dung → ok:true, dấu là băm (không chứa nội dung)', async () => {
  const r = await L.chayVanTay('printf "  \\n"', { cwd: ROOT, env: process.env });
  ok(!r.ok && r.lyDo === L.LY_DO_CHAY.vanTayRong, `kết quả ${JSON.stringify(r)}`);
  const r2 = await L.chayVanTay('echo bi-mat-model-xyz', { cwd: ROOT, env: process.env });
  ok(r2.ok && /^[0-9a-f]{64}$/.test(r2.dau) && !JSON.stringify(r2).includes('bi-mat'), `dấu lộ nội dung: ${JSON.stringify(r2)}`);
  const r3 = await L.chayVanTay('echo bi-mat-model-xyy', { cwd: ROOT, env: process.env });
  ok(r3.dau !== r2.dau, 'đổi một byte đầu ra mà dấu không đổi');
});

await ca('LIB-goi-ten', 'tệp lệnh gọi tên — bảng viết trước 6 hàng (gốc, cd, nháy lồng, =, ./, thư mục không kéo)', async () => {
  const tep = new Set(['tools/e1.sh', 'tools/khac.txt', 'apps/agent/test/x.spec.ts', 'apps/agent/a.ts', 'setup.ts', 'a.mjs', 'e1.sh']);
  const bang = [
    ['sh tools/e1.sh', ['tools/e1.sh']],
    ['cd tools && sh e1.sh', ['e1.sh', 'tools/e1.sh']],
    ['bun run test -- "cd apps/agent && bun test test/x.spec.ts"', ['apps/agent/test/x.spec.ts']],
    ['node --preload=./setup.ts a.mjs', ['a.mjs', 'setup.ts']],
    ['sh ./tools/e1.sh', ['tools/e1.sh']],
    ['ls tools && cat apps/agent', []],
  ];
  ok(bang.length === 6, 'số ô lệch');
  for (const [cmd, mong] of bang) {
    const r = L.tepGoiTen(cmd, tep);
    ok(JSON.stringify(r) === JSON.stringify(mong), `«${cmd}» → ${JSON.stringify(r)}, mong ${JSON.stringify(mong)}`);
  }
});
await ca('LIB-bien-shell', 'biến hoặc thay thế lệnh của shell nhận ra; gán biến đầu lệnh thì không', async () => {
  ok(L.coBienShell('cd "$APP" && bun test'), '$APP');
  ok(L.coBienShell('sh `which x`'), 'backtick');
  ok(L.coBienShell('echo $(date)'), '$(…)');
  ok(!L.coBienShell('GG_CASES=a,b node t.mjs'), 'gán biến bị nhận nhầm');
});

const dongRepin = (o) => Object.assign({ kind: 'repin', sha: 'a'.repeat(40) }, o);
await ca('LIB-chon-nguon', 'chọn nguồn — 9 hàng viết trước (rác, không ts, mới nhất, dàn phẳng, tương lai, hạn, đổi băm, chưa có, lệch)', async () => {
  const now = Date.parse('2026-10-11T00:00:00Z');
  const ngay = 86400000;
  const iso = (ms) => new Date(ms).toISOString();
  const laDat = (x) => x === 0;
  const H = 'h'.repeat(64), K = 'k'.repeat(64);
  const chay = (run, ts, bam = H, exit = 0) => dongRepin({ run_id: run, ts: iso(ts), evals_exit: { E1: exit }, evals_hash: { E1: bam } });
  const q = (dong, bam = H) => L.chonNguon({ dong, id: 'E1', bam, nowMs: now, laDat });
  let r;
  r = q([null, { kind: 'repin' }, chay('r1', now - ngay)]);
  ok(r.nguon && r.nguon.run_id === 'r1', `rác: ${JSON.stringify(r)}`);
  r = q([dongRepin({ run_id: 'r0', evals_exit: { E1: 0 }, evals_hash: { E1: H } })]);
  ok(r.lyDo === L.LY_DO_NGUON.chuaCo, `không ts: ${JSON.stringify(r)}`);
  r = q([chay('r1', now - 3 * ngay), chay('r2', now - ngay)]);
  ok(r.nguon.run_id === 'r2', `mới nhất: ${r.nguon && r.nguon.run_id}`);
  r = q([chay('r1', now - 3 * ngay), dongRepin({ run_id: 'r2', ts: iso(now - ngay), evals_exit: { E1: 0 }, evals_hash: { E1: H }, evals_carry: { E1: 'r1' } })]);
  ok(r.nguon.run_id === 'r1', `ghim: chuỗi dùng lại không dàn phẳng — ${r.nguon && r.nguon.run_id}`);
  r = q([chay('r1', now + 60000)]);
  ok(r.lyDo === L.LY_DO_NGUON.chuaCo, `tương lai: ${JSON.stringify(r)}`);
  r = q([chay('r1', now - 7 * ngay + 60000)]);
  ok(r.nguon && r.nguon.run_id === 'r1', `7 ngày trừ 1 phút: ${JSON.stringify(r)}`);
  r = q([chay('r1', now - 7 * ngay - 60000)]);
  ok(r.lyDo === L.LY_DO_NGUON.quaHan, `ghim: dùng lại nguồn quá hạn — ${JSON.stringify(r)}`);
  r = q([chay('r1', now - ngay, K)]);
  ok(r.lyDo === L.LY_DO_NGUON.bamDoi, `đổi băm: ${JSON.stringify(r)}`);
  r = q([chay('r1', now - 2 * ngay), dongRepin({ kind: 'repin-do', lan_id: 'r2', ts: iso(now - ngay), evals_exit: { E1: 1 }, evals_hash: { E1: H }, carry_lech: ['E1'] }), chay('r3', now - 60000)]);
  ok(r.lyDo === L.LY_DO_NGUON.lech, `ghim: dùng lại sau carry_lech — ${JSON.stringify(r)}`);
  ok(L.phatHienLech({ dong: [chay('r1', now - 8 * ngay)], id: 'E1', bam: H, exit: 1 }), 'lệch không nhận ra');
  ok(!L.phatHienLech({ dong: [chay('r1', now - 8 * ngay)], id: 'E1', bam: H, exit: 0 }), 'cùng mã mà báo lệch');
  ok(!L.phatHienLech({ dong: [chay('r1', now - 8 * ngay, K)], id: 'E1', bam: H, exit: 1 }), 'khác băm mà báo lệch');
  const dong = L.docRunLog('{"kind":"repin"}\nrác\n\n{"kind":"eval"}\n');
  ok(dong.length === 2, `docRunLog bỏ dòng hỏng: ${dong.length}`);
});

await ca('LIB-bam-tung-lop', 'đổi mỗi lớp (rút từ khối) → băm khác; cùng đầu vào → cùng băm', async () => {
  const blob = new Map([['src/a.txt', 'b1'], ['_acceptance/feat/evals.yaml', 'b2'], ['tools/e1.sh', 'b3']]);
  const goc = { id: 'E1', lenh: 'sh tools/e1.sh', paths: ['src/a.txt'], hoSo: ['_acceptance/feat/evals.yaml'], goiTen: ['tools/e1.sh'], vanTay: 'v1', blob };
  const h0 = L.bamDauVao(goc);
  ok(/^[0-9a-f]{64}$/.test(h0) && L.bamDauVao({ ...goc, blob: new Map(blob) }) === h0, 'cùng đầu vào khác băm');
  const doi = {
    'lệnh đã giải': { lenh: 'sh tools/e1.sh ' },
    'tệp khớp paths': { blob: new Map([...blob, ['src/a.txt', 'b1x']]) },
    'cây hồ sơ': { blob: new Map([...blob, ['_acceptance/feat/evals.yaml', 'b2x']]) },
    'tệp lệnh gọi tên': { blob: new Map([...blob, ['tools/e1.sh', 'b3x']]) },
    'dấu vân tay môi trường': { vanTay: 'v2' },
  };
  const lop = rutKhoi('CARRY-INPUT-LAYERS');
  ok(lop.length === Object.keys(doi).length, `số ô lệch: ${lop.length} lớp, ma trận ${Object.keys(doi).length}`);
  for (const ten of lop) {
    ok(doi[ten], `lớp «${ten}» không có ca`);
    ok(L.bamDauVao({ ...goc, ...doi[ten] }) !== h0, `ghim: lớp ${ten} không vào băm`);
  }
});

ket();
