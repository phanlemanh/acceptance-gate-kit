// repin-lane-dung-lai-model.test.mjs — ca bền của hồ sơ eval-goi-model-that-khong-chay (hàng G3): làn ghim
// lại dùng lại kết quả eval model thật khi băm năm lớp đầu vào không đổi. Ca LIB-* đo thư viện thuần; ca
// AC<n>-* chạy CHÍNH repin-lane.mjs --write trên kho thử code-sinh (gia-lan-fixture.mjs). Bộ đếm số lần chạy
// mỗi lệnh ghi ra thư mục NGOÀI kho. Bảng lớp và bảng lý do RÚT từ khối marker của bên viết.
//   GG_CASES=AC1-im node tests/scripts/repin-lane-dung-lai-model.test.mjs
import path from 'node:path';
import fs from 'node:fs';
import { boKiem, ok, ROOT, mkKho } from './gia-lan-fixture.mjs';

const LIB = process.env.GG_LIB_DUNG_LAI || path.join(ROOT, 'feature-loop', 'scripts', 'lib', 'dung-lai-model.mjs');
const L = await import(LIB);

const ALL = ['LIB-van-tay-het-gio', 'LIB-van-tay-thoat', 'LIB-van-tay-rong', 'LIB-goi-ten', 'LIB-bien-shell', 'LIB-chon-nguon', 'LIB-bam-tung-lop', 'LIB-khoi-marker',
  'AC1-im',
  'AC2-lop-lenh', 'AC2-lop-paths', 'AC2-lop-ho-so', 'AC2-lop-goi-ten', 'AC2-lop-van-tay', 'AC2-ma-tran', 'AC2-dh-config', 'AC2-dh-thu-muc', 'AC2-dh-cd',
  'AC3-sat-han', 'AC3-qua-han', 'AC3-tuong-lai',
  'AC4-ma-tran', 'AC4-van-tay-thoat', 'AC4-van-tay-rong', 'AC4-ep', 'AC4-allow-dirty', 'AC4-khong-paths', 'AC4-paths-khong-chung', 'AC4-bien-shell',
  'AC4-chua-commit-sua', 'AC4-chua-commit-moi', 'AC4-lenh-da-chay', 'AC4-hai-eval-model', 'AC4-eval-thuong',
  'AC5-dan-phang', 'AC5-moi-nhat', 'AC5-dong-cu',
  'AC6-lech',
  'AC7-song', 'AC8-song', 'AC9-khuon-dung-lai', 'AC10-dem'];
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
await ca('LIB-chon-nguon', 'chọn nguồn — 10 hàng viết trước (rác, không ts, mới nhất, hoà giờ, dàn phẳng, tương lai, hạn, đổi băm, chưa có, lệch)', async () => {
  const now = Date.parse('2026-10-11T00:00:00Z');
  const ngay = L.NGAY_MS;
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
  r = q([chay('r1', now - ngay), { kind: 'finding', run_id: 'f1', ts: iso(now), evals_exit: { E1: 9 }, evals_hash: { E1: H } }]);
  ok(r.nguon && r.nguon.run_id === 'r1', `dòng kind: finding đổi kết quả chọn nguồn: ${JSON.stringify(r)}`);
  r = q([chay('r1', now - ngay), chay('r2', now - ngay)]);
  ok(r.nguon.run_id === 'r2', `hoà giờ (hai lượt cùng giây) → dòng sau trong sổ thắng: ${r.nguon && r.nguon.run_id}`);
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

// ── Kho thử của các ca làn: E1 model (lệnh gọi tên tools/e1.sh nằm NGOÀI paths), E2 thường, lệnh dấu vân tay
// đếm số lần chạy và in model-id — mọi tệp đếm/điều khiển nằm NGOÀI kho ($GG_DAU), không vào băm.
export const E1_SH = 'echo ran >> "$GG_DAU/E1.txt"\nexit $(cat "$GG_DAU/E1-exit" 2>/dev/null || echo 0)\n';
export const VT_SH = 'echo x >> "$GG_DAU/van-tay.txt"\n[ -f "$GG_DAU/vt-rong" ] && exit 0\ncat "$GG_DAU/model-id" 2>/dev/null || echo m1\nexit $(cat "$GG_DAU/vt-exit" 2>/dev/null || echo 0)\n';
export const CFG = '  model_evals: [feat/E1]\n  model_carry_cmd: "sh van-tay.sh"\n';
export function mkG3({ config = CFG, e1 = {}, them = [], files = {}, lane, agRoot } = {}) {
  return mkKho({
    config, lane, agRoot,
    evals: [{ id: 'E1', cmd: 'rang_e1', sh: e1.sh || 'sh tools/e1.sh', paths: e1.paths === undefined ? ['src/a.txt'] : e1.paths }, { id: 'E2', cmd: 'rang_e2' }, ...them],
    files: { 'tools/e1.sh': E1_SH, 'tools/khac.txt': 'k\n', 'src/a.txt': 'a\n', 'van-tay.sh': VT_SH, ...files },
  });
}
// Một lượt ghim lại có ghi rồi commit (như luồng thật: pin được commit trước lượt kế).
export function lanCommit(k, args = [], o) {
  const r = k.lane(['--write', ...args], o);
  if (r.status === 0) { k.git('add', '-A'); k.git('commit', '-qm', 'repin'); }
  return r;
}
export const pins = (k) => k.docLog().filter(l => l.kind === 'repin');

await ca('AC1-im', 'đầu vào không đổi → lượt 2 không gọi model, nói ra ở bốn chỗ', async () => {
  const k = mkG3();
  const r1 = lanCommit(k);
  ok(r1.status === 0, `lượt 1 mã ${r1.status}\n${r1.stderr}`);
  const p1 = pins(k).pop();
  ok(p1.evals_hash && /^[0-9a-f]{64}$/.test(p1.evals_hash.E1), `lượt 1 không ghi băm: ${JSON.stringify(p1)}`);
  const r2 = lanCommit(k);
  ok(r2.status === 0, `lượt 2 mã ${r2.status}\n${r2.stderr}`);
  ok(k.dem('E1.txt') === 1, `ghim: gọi model khi đầu vào không đổi — E1 chạy ${k.dem('E1.txt')} lần`);
  ok(k.dem('E2.txt') === 2, `E2 chạy ${k.dem('E2.txt')} lần, mong 2`);
  const p2 = pins(k).pop();
  ok(p2.evals_carry && p2.evals_carry.E1 === p1.run_id, `ghim: dùng lại im — evals_carry ${JSON.stringify(p2.evals_carry)}`);
  ok(p2.evals_exit.E1 === p1.evals_exit.E1 && p2.evals_hash.E1 === p1.evals_hash.E1, `mã/băm lệch: ${JSON.stringify(p2)}`);
  ok(p2.tong_ket.model_goi === 0 && p2.tong_ket.model_carry === 1, `tổng kết ${JSON.stringify(p2.tong_ket)}`);
  ok(k.docReport().includes(`dùng lại theo băm đầu vào (không gọi model): E1←${p1.run_id}`), 'ghim: dùng lại im — section thiếu hậu tố');
  ok(/feat E1: dùng lại theo băm [0-9a-f]{8} từ /.test(r2.stderr), `ghim: dùng lại im — stderr thiếu dòng dùng lại`);
  ok(/eval model thật: gọi 0, carry 1/.test(r2.stderr), 'ghim: dùng lại im — tổng kết không đếm carry');
  ok(k.dem('van-tay.txt') === 2, `lệnh dấu vân tay chạy ${k.dem('van-tay.txt')} lần trong hai lượt, mong 2`);
});

// ── tiện ích ca làn ──────────────────────────────────────────────────────────
const ghi = (k, rel, nd) => { const f = path.join(k.root, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, nd); };
const them = (k, rel, nd) => fs.appendFileSync(path.join(k.root, rel), nd);
const commit = (k, msg = 'doi') => { k.git('add', '-A'); try { k.git('commit', '-qm', msg); } catch { /* không có gì đổi */ } };
const dau = (k, ten, nd) => fs.writeFileSync(path.join(k.dau, ten), nd);
const boDau = (k, ten) => fs.rmSync(path.join(k.dau, ten), { force: true });
const xanh = (r, ten) => ok(r.status === 0, `${ten}: mã ${r.status}\n${r.stderr.split('\n').slice(-12).join('\n')}`);
// Sửa `ts` của dòng `repin` cuối (do làn ghi) rồi commit — dòng vẫn là vật writer sinh, chỉ lùi tuổi.
// tatCa: lùi MỌI dòng `repin` (khi dòng cuối chỉ là dòng dùng lại, nguồn thật nằm ở dòng trước).
function datTs(k, tsIso, { tatCa = false } = {}) {
  const f = path.join(k.ws, 'run-log.jsonl');
  const dong = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean);
  const vt = dong.map((l, i) => (JSON.parse(l).kind === 'repin' ? i : -1)).filter(i => i >= 0);
  ok(vt.length, 'không có dòng repin để lùi tuổi');
  for (const i of tatCa ? vt : [vt[vt.length - 1]]) { const o = JSON.parse(dong[i]); o.ts = tsIso; dong[i] = JSON.stringify(o); }
  fs.writeFileSync(f, dong.join('\n') + '\n'); commit(k, 'lui ts');
}
const NGAY = L.NGAY_MS;
const iso = (ms) => new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z');
const khongDungLai = (r, lyDo) => new RegExp(`feat E1: không dùng lại — ${lyDo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(r.stderr);

// ── AC-2: năm lớp — mỗi ca đổi ĐÚNG một byte ở ĐÚNG một lớp ──────────────────
const LOP_CA = {
  'lệnh đã giải': { id: 'AC2-lop-lenh', doi: (k) => { const f = '_acceptance/config.yaml'; const t = fs.readFileSync(path.join(k.root, f), 'utf8'); ok(t.includes('rang_e1: "sh tools/e1.sh"'), 'không thấy lệnh E1 trong config'); ghi(k, f, t.replace('rang_e1: "sh tools/e1.sh"', 'rang_e1: "sh  tools/e1.sh"')); } },
  'tệp khớp paths': { id: 'AC2-lop-paths', doi: (k) => ghi(k, 'src/a.txt', 'b\n') },
  'cây hồ sơ': { id: 'AC2-lop-ho-so', doi: (k) => them(k, '_acceptance/feat/contract.md', ' ') },
  'tệp lệnh gọi tên': { id: 'AC2-lop-goi-ten', e1: { sh: 'cd tools && sh e1.sh' }, doi: (k) => them(k, 'tools/e1.sh', '\n') },
  'dấu vân tay môi trường': { id: 'AC2-lop-van-tay', doi: (k) => dau(k, 'model-id', 'm2\n') },
};
for (const [ten, c] of Object.entries(LOP_CA)) {
  await ca(c.id, `lớp «${ten}» đổi một byte → E1 chạy lại, «băm đổi»`, async () => {
    const k = mkG3({ e1: c.e1 || {} });
    xanh(lanCommit(k), 'lượt 1');
    const h1 = pins(k).pop().evals_hash.E1;
    c.doi(k); commit(k);
    const r = lanCommit(k); xanh(r, 'lượt 2');
    const p = pins(k).pop();
    ok(k.dem('E1.txt') === 2, `ghim: lớp ${ten} không vào băm — E1 chạy ${k.dem('E1.txt')} lần`);
    ok(p.evals_hash.E1 !== h1 && !p.evals_carry, `băm/carry lượt 2: ${JSON.stringify(p)}`);
    ok(khongDungLai(r, L.LY_DO_NGUON.bamDoi), `stderr thiếu «không dùng lại — băm đổi»`);
  });
}
await ca('AC2-ma-tran', 'số ca lớp = số lớp rút từ khối CARRY-INPUT-LAYERS', async () => {
  const lop = rutKhoi('CARRY-INPUT-LAYERS');
  ok(lop.length === Object.keys(LOP_CA).length && lop.every(t => LOP_CA[t]), `số ô lệch: khối ${JSON.stringify(lop)}, ca ${JSON.stringify(Object.keys(LOP_CA))}`);
});
// Độ đặc hiệu: đổi thứ KHÔNG phải đầu vào → vẫn dùng lại.
const DAC_HIEU = [
  ['AC2-dh-config', 'đổi khoá khác của config.yaml', {}, (k) => them(k, '_acceptance/config.yaml', '# doi khac\n')],
  ['AC2-dh-thu-muc', 'lệnh nêu tên thư mục «test» → đổi test/khac.txt', { sh: 'sh tools/e1.sh test' }, (k) => ghi(k, 'test/khac.txt', 'k2\n'), { 'test/khac.txt': 'k\n' }],
  ['AC2-dh-cd', 'tệp dưới thư mục đối số cd mà lệnh không nêu', { sh: 'cd tools && sh e1.sh' }, (k) => ghi(k, 'tools/khac.txt', 'k2\n')],
];
for (const [id, ten, e1, doi, files] of DAC_HIEU) {
  await ca(id, `${ten} → vẫn dùng lại`, async () => {
    const k = mkG3({ e1, files: files || {} });
    xanh(lanCommit(k), 'lượt 1');
    doi(k); commit(k);
    const r = lanCommit(k); xanh(r, 'lượt 2');
    ok(k.dem('E1.txt') === 1 && pins(k).pop().evals_carry, `ghim: băm kéo cả thư mục — E1 chạy ${k.dem('E1.txt')} lần\n${r.stderr.split('\n').filter(l => /feat E1/.test(l)).join('\n')}`);
  });
}

// ── AC-3: hạn 7 ngày ─────────────────────────────────────────────────────────
for (const [id, lui, mongChay, lyDo] of [
  ['AC3-sat-han', 7 * NGAY - 60000, 1, null],
  ['AC3-qua-han', 7 * NGAY + 60000, 2, L.LY_DO_NGUON.quaHan],
  ['AC3-tuong-lai', -3600000, 2, L.LY_DO_NGUON.chuaCo],
]) {
  await ca(id, `nguồn lùi ${Math.round(lui / 60000)} phút → E1 chạy ${mongChay} lần`, async () => {
    const k = mkG3();
    xanh(lanCommit(k), 'lượt 1');
    datTs(k, iso(Date.now() - lui));
    const r = lanCommit(k); xanh(r, 'lượt 2');
    ok(k.dem('E1.txt') === mongChay, `${mongChay === 2 ? 'ghim: dùng lại nguồn quá hạn' : 'không dùng lại nguồn còn hạn'} — E1 chạy ${k.dem('E1.txt')} lần`);
    if (lyDo) ok(khongDungLai(r, lyDo), `stderr thiếu «${lyDo}»`);
  });
}

// ── AC-4: lý do luôn chạy — một ca mỗi lý do của khối CARRY-LY-DO-CHAY ─────────
async function luonChay(k, lyDo, { args2 = [], truocLuot2 = () => {}, ghiPin = true, ghim = '' } = {}) {
  xanh(lanCommit(k), 'lượt 1');
  truocLuot2(k);
  const r = ghiPin ? lanCommit(k, args2) : k.lane(args2);
  xanh(r, 'lượt 2');
  ok(k.dem('E1.txt') === 2, `${ghim ? `ghim: ${ghim} — ` : ''}E1 chạy ${k.dem('E1.txt')} lần, mong 2 (lý do «${lyDo}»)`);
  if (ghiPin) ok(!pins(k).pop().evals_carry, `lượt 2 vẫn có evals_carry (lý do «${lyDo}»)`);
  ok(khongDungLai(r, lyDo), `stderr thiếu «feat E1: không dùng lại — ${lyDo}»\n${r.stderr.split('\n').filter(l => /feat E1/.test(l)).join('\n')}`);
}
const LD = L.LY_DO_CHAY;
const CA_LY_DO = {
  [LD.vanTayThoat]: 'AC4-van-tay-thoat', [LD.vanTayHetGio]: 'LIB-van-tay-het-gio', [LD.vanTayRong]: 'AC4-van-tay-rong', [LD.ep]: 'AC4-ep',
  [LD.allowDirty]: 'AC4-allow-dirty', [LD.khongPaths]: 'AC4-khong-paths', [LD.pathsKhongChung]: 'AC4-paths-khong-chung', [LD.bienShell]: 'AC4-bien-shell',
  [LD.chuaCommit]: 'AC4-chua-commit-sua', [LD.lenhDaChay]: 'AC4-lenh-da-chay',
};
await ca('AC4-ma-tran', 'mỗi lý do của khối CARRY-LY-DO-CHAY có ≥ 1 ca', async () => {
  const khoi = rutKhoi('CARRY-LY-DO-CHAY');
  const thieu = khoi.filter(t => !CA_LY_DO[t] || !ALL.includes(CA_LY_DO[t]));
  ok(!thieu.length, `số ô lệch: lý do không ca nào phủ — ${thieu.join(' · ')}`);
});
await ca('AC4-van-tay-thoat', 'lệnh dấu vân tay thoát 3', () => luonChay(mkG3(), LD.vanTayThoat, { truocLuot2: (k) => dau(k, 'vt-exit', '3'), ghim: 'dùng lại khi không biết model' }));
await ca('AC4-van-tay-rong', 'lệnh dấu vân tay in rỗng', () => luonChay(mkG3(), LD.vanTayRong, { truocLuot2: (k) => dau(k, 'vt-rong', '1') }));
await ca('AC4-ep', 'cờ --chay-lai-model', () => luonChay(mkG3(), LD.ep, { args2: ['--chay-lai-model'] }));
await ca('AC4-allow-dirty', 'làn chạy --allow-dirty với src/a.txt sửa dở', () => luonChay(mkG3(), LD.allowDirty, { args2: ['--allow-dirty'], truocLuot2: (k) => ghi(k, 'src/a.txt', 'dở\n') }));
await ca('AC4-khong-paths', 'eval không khai paths', () => luonChay(mkG3({ e1: { paths: null } }), LD.khongPaths));
await ca('AC4-paths-khong-chung', 'paths trỏ tệp không có', () => luonChay(mkG3({ e1: { paths: ['khong/co/tep.txt'] } }), LD.pathsKhongChung));
await ca('AC4-bien-shell', 'lệnh có biến shell', () => luonChay(mkG3({ e1: { sh: 'sh tools/e1.sh $HOME' } }), LD.bienShell));
await ca('AC4-chua-commit-sua', 'tệp theo dõi trong cây hồ sơ sửa dở', () => luonChay(mkG3(), LD.chuaCommit, { truocLuot2: (k) => them(k, '_acceptance/feat/contract.md', ' '), ghiPin: false, ghim: 'dùng lại trên cây bẩn' }));
await ca('AC4-chua-commit-moi', 'tệp chưa theo dõi trong cây hồ sơ', () => luonChay(mkG3(), LD.chuaCommit, { truocLuot2: (k) => ghi(k, '_acceptance/feat/nhap.md', 'x\n'), ghiPin: false, ghim: 'dùng lại trên cây bẩn' }));
await ca('AC4-lenh-da-chay', 'lệnh E1 trùng nguyên văn lệnh suite', async () => {
  const k = mkKho({
    config: CFG, suiteCmd: 'sh tools/e1.sh',
    evals: [{ id: 'E1', cmd: 'rang_e1', sh: 'sh tools/e1.sh', paths: ['src/a.txt'] }, { id: 'E2', cmd: 'rang_e2' }],
    files: { 'tools/e1.sh': E1_SH, 'src/a.txt': 'a\n', 'van-tay.sh': VT_SH },
  });
  xanh(lanCommit(k), 'lượt 1');
  const r = lanCommit(k); xanh(r, 'lượt 2');
  ok(k.dem('E1.txt') === 2, `lệnh chạy ${k.dem('E1.txt')} lần trong hai lượt, mong 2 (một lần mỗi lượt, qua suite)`);
  ok(!pins(k).pop().evals_carry, 'lượt 2 vẫn có evals_carry');
  ok(khongDungLai(r, LD.lenhDaChay), `stderr thiếu «${LD.lenhDaChay}»`);
});
await ca('AC4-hai-eval-model', 'hai eval model → lệnh dấu vân tay chạy MỘT lần mỗi lượt; cả hai dùng lại', async () => {
  const k = mkG3({
    config: '  model_evals: [feat/E1, feat/E3]\n  model_carry_cmd: "sh van-tay.sh"\n',
    them: [{ id: 'E3', cmd: 'rang_e3', sh: 'sh tools/e3.sh', paths: ['src/a.txt'] }],
    files: { 'tools/e3.sh': 'echo ran >> "$GG_DAU/E3.txt"\n' },
  });
  xanh(lanCommit(k), 'lượt 1'); xanh(lanCommit(k), 'lượt 2');
  ok(k.dem('van-tay.txt') === 2, `lệnh dấu vân tay chạy ${k.dem('van-tay.txt')} lần trong hai lượt, mong 2`);
  ok(k.dem('E1.txt') === 1 && k.dem('E3.txt') === 1, `E1 ${k.dem('E1.txt')} · E3 ${k.dem('E3.txt')}, mong 1 · 1`);
  ok(JSON.stringify(Object.keys(pins(k).pop().evals_carry || {})) === '["E1","E3"]', `evals_carry ${JSON.stringify(pins(k).pop().evals_carry)}`);
});
await ca('AC4-eval-thuong', 'E2 (không thuộc model_evals) chạy mọi lượt, không bao giờ có băm', async () => {
  const k = mkG3();
  xanh(lanCommit(k), 'lượt 1'); xanh(lanCommit(k), 'lượt 2');
  ok(k.dem('E2.txt') === 2, `E2 chạy ${k.dem('E2.txt')} lần`);
  ok(pins(k).every(p => !p.evals_hash || !('E2' in p.evals_hash)), 'E2 có trong evals_hash');
  ok(!/feat E2: (dùng lại|không dùng lại)/.test(k.lane([]).stderr), 'E2 có dòng dùng lại');
});

// ── AC-5: chọn nguồn ─────────────────────────────────────────────────────────
await ca('AC5-dan-phang', 'lượt 3 dùng lại trỏ lượt 1 (nơi E1 thật sự chạy), không trỏ lượt 2', async () => {
  const k = mkG3();
  xanh(lanCommit(k), 'lượt 1'); xanh(lanCommit(k), 'lượt 2'); xanh(lanCommit(k), 'lượt 3');
  const [p1, p2, p3] = pins(k);
  ok(p3.evals_carry && p3.evals_carry.E1 === p1.run_id && p3.evals_carry.E1 !== p2.run_id, `ghim: chuỗi dùng lại không dàn phẳng — ${JSON.stringify(p3.evals_carry)} (lượt 1 ${p1.run_id}, lượt 2 ${p2.run_id})`);
});
await ca('AC5-moi-nhat', 'lượt 2 chạy thật bằng --chay-lai-model → lượt 3 dùng lại từ lượt 2', async () => {
  const k = mkG3();
  xanh(lanCommit(k), 'lượt 1'); xanh(lanCommit(k, ['--chay-lai-model']), 'lượt 2'); xanh(lanCommit(k), 'lượt 3');
  const [, p2, p3] = pins(k);
  ok(p3.evals_carry && p3.evals_carry.E1 === p2.run_id, `nguồn ${JSON.stringify(p3.evals_carry)}, mong ${p2.run_id}`);
});
await ca('AC5-dong-cu', 'pin ghi khi khoá vắng (không băm) rồi bật khoá → «chưa có nguồn cùng băm»', async () => {
  const k = mkG3({ config: '  model_evals: [feat/E1]\n' });
  xanh(lanCommit(k), 'lượt 1');
  ok(!pins(k).pop().evals_hash, 'khoá vắng mà có evals_hash');
  const f = path.join(k.root, '_acceptance', 'config.yaml');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('  model_evals: [feat/E1]\n', '  model_evals: [feat/E1]\n  model_carry_cmd: "sh van-tay.sh"\n'));
  commit(k, 'bat khoa');
  const r = lanCommit(k); xanh(r, 'lượt 2');
  ok(k.dem('E1.txt') === 2, `E1 chạy ${k.dem('E1.txt')} lần`);
  ok(khongDungLai(r, L.LY_DO_NGUON.chuaCo), 'stderr thiếu «chưa có nguồn cùng băm»');
});

// ── AC-6: carry_lech ─────────────────────────────────────────────────────────
await ca('AC6-lech', 'cùng băm mà mã khác → carry_lech ở repin-do; chặn dùng lại tới khi băm đổi', async () => {
  const k = mkG3();
  xanh(lanCommit(k), 'lượt 1');
  datTs(k, iso(Date.now() - 8 * NGAY));
  dau(k, 'E1-exit', '1');
  const r2 = k.lane(['--write']);
  ok(r2.status === 1, `lượt 2 phải đỏ, mã ${r2.status}`);
  const d = k.docLog().filter(l => l.kind === 'repin-do').pop();
  ok(d && JSON.stringify(d.carry_lech) === '["E1"]' && /^[0-9a-f]{64}$/.test((d.evals_hash || {}).E1 || ''), `repin-do ${JSON.stringify(d)}`);
  ok(/carry_lech: E1/.test(r2.stderr.trim().split('\n').pop()), `tổng kết: ${r2.stderr.trim().split('\n').pop()}`);
  commit(k, 'dau do'); boDau(k, 'E1-exit');
  xanh(lanCommit(k), 'lượt 3');
  const r4 = lanCommit(k); xanh(r4, 'lượt 4');
  ok(k.dem('E1.txt') === 4, `ghim: dùng lại sau carry_lech — E1 chạy ${k.dem('E1.txt')} lần sau bốn lượt, mong 4`);
  ok(khongDungLai(r4, L.LY_DO_NGUON.lech), 'stderr lượt 4 thiếu «cùng băm từng cho kết quả khác»');
  ghi(k, 'src/a.txt', 'b\n'); commit(k);
  xanh(lanCommit(k), 'lượt 5'); xanh(lanCommit(k), 'lượt 6');
  ok(k.dem('E1.txt') === 5, `đổi băm rồi: E1 chạy ${k.dem('E1.txt')} lần sau sáu lượt, mong 5 (lượt 6 dùng lại)`);
});

// ── AC-7 vế sống: khoá vắng ──────────────────────────────────────────────────
const BA_KHOA = ['evals_hash', 'evals_carry', 'carry_lech'];
await ca('AC7-song', 'khoá vắng: ba lượt không khoá mới, E1 chạy 3, vân tay 0, tập khoá = khoá khai trừ ba khoá', async () => {
  const a = mkG3({ config: '  model_evals: [feat/E1]\n' });
  const b = mkG3();
  for (let i = 0; i < 3; i += 1) { xanh(lanCommit(a), `A lượt ${i + 1}`); xanh(lanCommit(b), `B lượt ${i + 1}`); }
  const pa = pins(a), pb = pins(b);
  ok(pa.every(p => BA_KHOA.every(x => !(x in p))), `ghim: khoá vắng mà dòng đổi — ${JSON.stringify(pa.map(p => Object.keys(p)))}`);
  ok(a.dem('E1.txt') === 3 && a.dem('van-tay.txt') === 0, `E1 ${a.dem('E1.txt')} · vân tay ${a.dem('van-tay.txt')}`);
  ok(pa.every(p => p.tong_ket.model_carry === 0), 'model_carry khác 0 khi khoá vắng');
  pa.forEach((p, i) => {
    const ka = Object.keys(p).join(','), kb = Object.keys(pb[i]).filter(x => !BA_KHOA.includes(x)).join(',');
    ok(ka === kb, `lượt ${i + 1}: khoá vắng ${ka} · khoá khai trừ ba khoá ${kb}`);
  });
});

// ── AC-8 vế sống: bên đọc của cây đang kiểm đọc pin dùng lại ─────────────────
await ca('AC8-song', 'recheck-evidence đọc pin có dùng lại → 0; sửa evals_exit.E1 → khác 0, nêu E1', async () => {
  const { spawnSync } = await import('node:child_process');
  const k = mkG3();
  xanh(lanCommit(k), 'lượt 1'); xanh(lanCommit(k), 'lượt 2');
  ok(pins(k).pop().evals_carry, 'lượt 2 không dùng lại — ca không đo được điều nó hứa');
  const rc = () => spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), path.join(k.ws, 'evidence-report.md')], { encoding: 'utf8' });
  const r1 = rc();
  ok(r1.status === 0, `bên đọc từ chối pin dùng lại: ${r1.status}\n${r1.stdout}${r1.stderr}`);
  const f = path.join(k.ws, 'run-log.jsonl');
  const dong = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean);
  const i = dong.map(l => JSON.parse(l).kind).lastIndexOf('repin');
  const o = JSON.parse(dong[i]); o.evals_exit.E1 = 1; dong[i] = JSON.stringify(o); fs.writeFileSync(f, dong.join('\n') + '\n');
  const r2 = rc();
  ok(r2.status !== 0 && /E1/.test(r2.stdout + r2.stderr), `bên đọc không đọc dòng: mã ${r2.status}\n${r2.stdout}${r2.stderr}`);
});

// ── AC-9: khoá writer thật ⊆ khuôn REPIN-TEMPLATE, đúng thứ tự ─────────────────
const SKILL = process.env.GG_SKILL || path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
function khoaKhuon(kind) {
  const m = fs.readFileSync(SKILL, 'utf8').match(/<!-- <<<REPIN-TEMPLATE -->\s*```\n([\s\S]*?)```\s*<!-- REPIN-TEMPLATE>>> -->/);
  ok(m, 'không thấy marker REPIN-TEMPLATE');
  const dong = m[1].split('\n').find(l => l.includes(`"kind":"${kind}"`));
  ok(dong, `khuôn không có dòng mẫu kind ${kind}`);
  return Object.keys(JSON.parse(dong.replace(/"<[^">]*>"/g, '"x"').replace(/<[^>]*>/g, 'x')));
}
function soKhuon(writer, khuon, ten) {
  const ngoai = writer.filter(x => !khuon.includes(x));
  ok(!ngoai.length, `ghim: khoá ngoài khuôn — ${ten} ghi ${ngoai.join(', ')}`);
  const vt = writer.map(x => khuon.indexOf(x));
  ok(vt.every((v, i) => i === 0 || v > vt[i - 1]), `thứ tự khoá ${ten} lệch khuôn: ${writer.join(',')}`);
}
await ca('AC9-khuon-dung-lai', 'dòng repin (băm, dùng lại) và repin-do (băm, carry_lech) của writer thật ⊆ khuôn, đúng thứ tự', async () => {
  const cfg = `${CFG}  repin_retry: 1\n  repin_budget_min: 5\n  repin_cost_cmd: 'echo 1'\n  repin_ci_blank_env: [K]\n`;
  const k = mkG3({ config: cfg });
  xanh(lanCommit(k, [], { env: { K: 'x' } }), 'lượt 1'); xanh(lanCommit(k, [], { env: { K: 'x' } }), 'lượt 2');
  const p = pins(k).pop();
  ok(p.evals_hash && p.evals_carry && p.suites_env && p.tong_ket, `fixture không bật đủ khoá: ${Object.keys(p).join(',')}`);
  soKhuon(Object.keys(p), khoaKhuon('repin'), 'repin');
  datTs(k, iso(Date.now() - 8 * NGAY), { tatCa: true }); dau(k, 'E1-exit', '1');
  const rd = k.lane(['--write'], { env: { K: 'x' } });
  ok(rd.status === 1, `lượt lệch không đỏ: mã ${rd.status}\n${rd.stderr.split('\n').filter(l => /feat E1|TỔNG/.test(l)).join('\n')}`);
  const d = k.docLog().filter(l => l.kind === 'repin-do').pop();
  ok(d.evals_hash && d.carry_lech, `repin-do thiếu khoá: ${Object.keys(d).join(',')}`);
  soKhuon(Object.keys(d), khoaKhuon('repin-do'), 'repin-do');
});

// ── AC-10: script đếm của đường đo ───────────────────────────────────────────
const DEM = process.env.GG_DEM || path.join(ROOT, 'feature-loop', 'scripts', 'dem-dung-lai-model.mjs');
await ca('AC10-dem', 'đếm trên run-log do làn thật ghi: tổng, nhãn hai lượt lệch, nguồn không có', async () => {
  const { spawnSync } = await import('node:child_process');
  const k = mkG3();
  xanh(lanCommit(k), 'lượt 1 (chạy)'); xanh(lanCommit(k), 'lượt 2 (dùng lại)');
  // (a) lệch khi không tệp git nào đổi ngoài sổ làn ghi
  datTs(k, iso(Date.now() - 8 * NGAY), { tatCa: true }); dau(k, 'E1-exit', '1');
  ok(k.lane(['--write']).status === 1, 'lượt 3 (lệch a) không đỏ'); commit(k, 'dau do a'); boDau(k, 'E1-exit');
  xanh(lanCommit(k), 'lượt 4 (chạy lại, xanh)');
  // (b) lệch sau khi đổi một tệp ngoài mọi lớp của băm
  ghi(k, 'lib/x.txt', 'x2\n'); commit(k, 'doi lib/x.txt'); dau(k, 'E1-exit', '1');
  ok(k.lane(['--write']).status === 1, 'lượt 5 (lệch b) không đỏ'); commit(k, 'dau do b');
  const lech = k.docLog().filter(l => Array.isArray(l.carry_lech));
  ok(lech.length === 2, `fixture: ${lech.length} lượt lệch, mong 2`);
  // dòng repin trỏ nguồn không có (sửa từ dòng làn ghi)
  const f = path.join(k.ws, 'run-log.jsonl');
  const p2 = pins(k)[1];
  fs.appendFileSync(f, JSON.stringify({ ts: p2.ts, kind: 'repin', run_id: 'repin-gia', sha: p2.sha, evals_exit: { E1: 0 }, evals_carry: { E1: 'repin-khong-co' } }) + '\n');
  const r = spawnSync(process.execPath, [DEM, '--root', k.root], { encoding: 'utf8' });
  ok(r.status === 0, `script thoát ${r.status}: ${r.stderr}`);
  const o = r.stdout;
  const tong = (o.match(/^TỔNG — model_goi (\d+) · model_carry (\d+) · carry_lech (\d+)$/m) || []).slice(1).map(Number);
  ok(tong.length === 3, `không thấy dòng tổng:\n${o}`);
  ok(tong[2] === 2, `ghim: carry_lech đếm thiếu — ${tong[2]}, mong 2`);
  ok(tong[0] === 4 && tong[1] === 1, `model_goi ${tong[0]} (mong 4) · model_carry ${tong[1]} (mong 1)`);
  ok(/^feat\/E1: dùng lại 2 · carry_lech 2$/m.test(o), `thiếu dòng của E1 (dùng lại 2 = lượt 2 + dòng trỏ nguồn không có):\n${o}`);
  const nhan = o.split('\n').filter(l => l.startsWith('carry_lech feat/E1 @ '));
  ok(nhan.length === 2, `số dòng nhãn lệch ${nhan.length}`);
  ok(/: lệch không tất định$/.test(nhan[0]), `lượt (a): ${nhan[0]}`);
  ok(/: nghi thiếu đầu vào: lib\/x\.txt$/.test(nhan[1]), `ghim: không tách nguyên nhân lệch — lượt (b): ${nhan[1]}`);
  ok(/^nguồn không có: feat\/E1 → repin-khong-co$/m.test(o), `thiếu dòng nguồn không có:\n${o}`);
  const sai = spawnSync(process.execPath, [DEM, '--root', path.join(k.root, 'khong-co')], { encoding: 'utf8' });
  ok(sai.status === 2, `--root sai phải thoát 2, nhận ${sai.status}`);
});

ket();
