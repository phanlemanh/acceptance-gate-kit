// Hồ sơ danh-thuc-doc-nhip-dung-ma (hàng TC1): đánh thức và chẩn đoán đọc nhịp sống của giám sát đúng mã phiên.
// Mã app («local_gs», biến CLAUDE_CODE_HOST_SESSION_ID) và mã CLI («c-gs», session_id của hook, biến
// CLAUDE_CODE_SESSION_ID) LUÔN khác nhau ở đây — chỗ bộ ca DP3 mù vì dùng một chuỗi cho cả hai.
// Kho thử, đợt (`mo` thật từ gói đợt khai qua cấu hình), hook PostToolUse (lệnh rút từ hooks.json) và CLI chạy thật
// trong lượt. Mọi tiến trình con chạy với môi trường đã xoá hai biến thừa kế rồi mới thêm biến của ca. Mốc so là sha
// GHIM dưới đây, rút bằng `git archive` trọn thư mục gói. Đường dẫn suy từ vị trí tệp.
//   node --test --test-name-pattern=TC1-03 tests/dieu-phoi/danh-thuc-ma-phien.test.mjs
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MA_TRAN_THUC } from './ma-tran-thuc.mjs';
import { caNghi } from './hai-moi-truong.mjs';
import { caDoiThanLichSu, docTai, goiTai } from './ca-doi-than.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(DAY, '..', '..');
const GOI = path.join(KIT, 'dieu-phoi');
export const SHA_MOC = '45e9f2cf13d104aa4b1a2321a0026c4b739f8914';
// Sha lượt chấm 3 của chính hồ sơ này (run-log) — mốc cuối CỐ ĐỊNH của TC1-06 và TC1-09 (hồ sơ trao-vai-va-do-sau-gop):
// hai ca so lịch sử giữa hai sha, không đọc cây làm việc, nên không đỏ giả khi main trôi sau gộp.
export const SHA_TC1_CHAM = 'e208665fba6bbf3069b2d079c64448b8010ac180';
const APP = 'local_gs';
const CLI_ID = 'c-gs';
const PHUT = 60_000;
const BIEN = ['CLAUDE_CODE_HOST_SESSION_ID', 'CLAUDE_CODE_SESSION_ID'];

const canDon = [];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = (tienTo = 'tc1-') => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tienTo)));
  canDon.push(d);
  return d;
};
const docJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ghiJ = (p, du) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(du, null, 2));
};
export const moiTruongSach = (them = {}) => ({
  ...Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT' && !BIEN.includes(k))),
  ...them,
});
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, env: moiTruongSach(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const nap = (gocGoi, tep) => import(`${path.join(gocGoi, 'scripts', tep)}?v=${Math.random()}`);

function chayCli(cwd, doiSo, { gocGoi = GOI, env = {} } = {}) {
  const r = spawnSync(process.execPath, [path.join(gocGoi, 'scripts', 'dieu-phoi.mjs'), ...doiSo], { cwd, env: moiTruongSach(env), encoding: 'utf8' });
  return { ma: r.status, out: r.stdout, err: r.stderr };
}
function lenhHook(gocGoi) {
  const hj = docJ(path.join(gocGoi, 'hooks', 'hooks.json'));
  return hj.hooks.PostToolUse[0].hooks[0].command.split('${CLAUDE_PLUGIN_ROOT}').join(gocGoi);
}
function hookNhip(sessionId, { cwd, nowMs, gocGoi = GOI, env = {} }) {
  const r = spawnSync('sh', ['-c', lenhHook(gocGoi)], { cwd, env: moiTruongSach({ DIEU_PHOI_NOW_MS: String(nowMs), ...env }), input: JSON.stringify({ cwd, session_id: sessionId }), encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
}

// Kho thử + worktree P1 + gói đợt + đợt «thu» mở bằng `mo --phien <maVai>` với môi trường `envMo`. Đợt để ở pha `nhap`:
// `tiep-tuc` không khởi bộ phát lịch thật (kho thử không có origin — bộ phát lịch ghi `fetch-loi` thành việc chờ và tiến
// trình nền chạy tiếp sau ca). Đánh thức và chẩn đoán không đọc pha để quyết.
function khoDot({ gocGoi = GOI, maVai = APP, envMo = {} } = {}) {
  const kho = tam('tc1-kho-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const w1 = path.join(tam('tc1-wt-'), 'p1');
  git(kho, 'worktree', 'add', '-q', '-b', 'p1', w1);
  const dir = path.join(kho, 'goi', 'dot-thu');
  ghiJ(path.join(dir, 'dieu-phoi.config.json'), docJ(path.join(gocGoi, 'scripts', 'mau', 'dieu-phoi.config.json')));
  ghiJ(path.join(dir, 'hang-viec.json'), { dot: '', day: [{ id: 'P1', worktree: fs.realpathSync(w1) }], hang: [{ ma: 'A', slug: 'hang-a', day: 'P1', uu_tien: 1 }], ngoai_hang_merge: [] });
  fs.writeFileSync(path.join(dir, 'LUAT-rieng.md'), '# Luật riêng\n');
  fs.mkdirSync(path.join(kho, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\ndieu_phoi:\n  goi_dot: goi/dot-{ten}\n');
  const mo = chayCli(kho, ['mo', 'thu', '--phien', maVai], { gocGoi, env: envMo });
  assert.equal(mo.ma, 0, mo.err);
  return { kho, dot: fs.realpathSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai')), w1: fs.realpathSync(w1) };
}

// Bản gói ở sha ghim, trọn thư mục (một lần mỗi lượt).
let banMoc = null;
function goiMoc() {
  if (banMoc) return banMoc;
  const d = tam('tc1-moc-');
  execFileSync('sh', ['-c', `git -C "${KIT}" archive ${SHA_MOC} dieu-phoi | tar -x -C "${d}"`], { env: moiTruongSach() });
  banMoc = path.join(d, 'dieu-phoi');
  assert.ok(fs.existsSync(path.join(banMoc, 'scripts', 'danh-thuc.mjs')), 'bản gói ở sha ghim không rút được');
  return banMoc;
}
// Bản sao gói đã tiêm: mỗi cặp [cũ, mới] trên tệp `tep` phải áp được.
function saoTiem(tep, ...cap) {
  const d = path.join(tam('tc1-sao-'), 'dieu-phoi');
  fs.cpSync(GOI, d, { recursive: true });
  const p = path.join(d, 'scripts', tep);
  let s = fs.readFileSync(p, 'utf8');
  for (const [cu, moi] of cap) {
    assert.ok(s.includes(cu), `bước tiêm không áp được trên ${tep}: ${cu.slice(0, 60)}`);
    s = s.split(cu).join(moi);
  }
  fs.writeFileSync(p, s);
  return d;
}

const ioGia = (nowMs) => ({
  nowMs: () => nowMs,
  chay: (cmd, args = []) => {
    if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 0.00M  free = 1.00M';
    if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
    if (cmd === 'sysctl') return '{ 1.00 1.00 1.00 }';
    if (cmd === 'ps') return '102400 node\n';
    if (cmd === 'gh') return '[]';
    if (cmd === 'git' && args[0] === 'show') throw new Error('khong co');
    return '';
  },
});
// Bộ phát lịch thật ghi một sự kiện can_phan: thư mục khoá rỗng quá 60″ bị thu hồi.
async function canPhanThat(dot, gocGoi) {
  const d = path.join(dot, 'khoa', 'merge');
  fs.mkdirSync(d, { recursive: true });
  const cu = new Date(Date.now() - 5 * PHUT);
  fs.utimesSync(d, cu, cu);
  const { taoVong } = await nap(gocGoi, 'phat-lich.mjs');
  await taoVong(dot, ioGia(Date.now()), () => Date.now())();
}
const yeuCau = (dot, T0) => ghiJ(path.join(dot, 'yeu-cau', 'P1-1.json'), { phien: 'P1', loai: 'khac', hang: 'hang-a', noi_dung: {}, luc: new Date(T0).toISOString() });

// Ma trận DP3-09 với mã vai `maVai`, mã CLI `maCli`; `vaiCli` = vai ghi phien_cli (mo có biến CLI), `hookApp` = hook
// có biến app. Trả [{hang, can, kq}] và đầu ra chẩn đoán của hàng đầu khi `chanDoan`.
async function chayMaTran({ gocGoi = GOI, maVai, maCli, vaiCli, hookApp, doiHang = null }) {
  const ra = [];
  for (const goc of MA_TRAN_THUC) {
    const [hang, can, thucPhut, nhipPhut, viec] = doiHang?.[goc[0]] ?? goc;
    const T0 = Date.now();
    let kho;
    let dot = null;
    let w1 = null;
    if (viec === 'khong-dot') {
      kho = tam('tc1-trong-');
      git(kho, 'init', '-q', '-b', 'main');
      git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
    } else {
      ({ kho, dot, w1 } = khoDot({ gocGoi, maVai, envMo: vaiCli ? { CLAUDE_CODE_SESSION_ID: maCli } : {} }));
      assert.equal(chayCli(kho, ['tiep-tuc', '--phien', maVai, '--nhe'], { gocGoi, env: { DIEU_PHOI_NOW_MS: String(T0 - thucPhut * PHUT) } }).ma, 0);
      if (nhipPhut != null) hookNhip(maCli, { cwd: kho, nowMs: T0 - nhipPhut * PHUT, gocGoi, env: hookApp ? { CLAUDE_CODE_HOST_SESSION_ID: maVai } : {} });
      if (viec === 'yeu-cau') yeuCau(dot, T0);
      if (viec === 'su-kien') await canPhanThat(dot, gocGoi);
    }
    const r = chayCli(kho, ['danh-thuc', '--json'], { gocGoi, env: { DIEU_PHOI_NOW_MS: String(T0 + 1000) } });
    assert.equal(r.ma, 0, r.err);
    ra.push({ hang, can, kq: JSON.parse(r.out), kho, dot, w1 });
  }
  return ra;
}
const loiMaTran = (kq) => kq.flatMap((r) => {
  if (r.kq.hanh_dong === r.can) return [];
  if (r.can === 'nhan-giam-sat' && r.kq.hanh_dong === 'bao-chu-kho') return [`(${r.hang}): nhịp tươi của giám sát mà vẫn báo chủ kho`];
  return [`(${r.hang}): ${r.kq.hanh_dong}, cần ${r.can}`];
});
const BIEN_THE = {
  'chi-phien-cli': { vaiCli: true, hookApp: false },
  'chi-ma-app': { vaiCli: false, hookApp: true },
  'ca-hai': { vaiCli: true, hookApp: true },
};
async function baBienThe(gocGoi = GOI) {
  const ra = {};
  for (const [ten, bt] of Object.entries(BIEN_THE)) ra[ten] = await chayMaTran({ gocGoi, maVai: APP, maCli: CLI_ID, ...bt });
  return ra;
}

// ---------- TC1-01: hook ghi ma_app (AC-1, E1) ----------
test('TC1-01 hook-ghi-ma-app', () => {
  const { kho, dot } = khoDot();
  hookNhip(CLI_ID, { cwd: kho, nowMs: Date.now(), env: { CLAUDE_CODE_HOST_SESSION_ID: APP } });
  const n = docJ(path.join(dot, 'song', `${CLI_ID}.json`));
  assert.equal(n.ma_app, APP);
  assert.equal(n.phien, CLI_ID);
});

test('TC1-01 khong-bien', () => {
  // Môi trường tiến trình con sạch: không mang hai biến thừa kế của phiên chạy test.
  const env = spawnSync('sh', ['-c', 'env'], { env: moiTruongSach(), encoding: 'utf8' }).stdout;
  for (const b of BIEN) assert.ok(!env.split('\n').some((d) => d.startsWith(`${b}=`)), `môi trường con còn ${b}`);
  const { kho, dot } = khoDot();
  const p = path.join(dot, 'song', `${CLI_ID}.json`);
  const boLuc = ({ luc: _l, ...x }) => x;
  hookNhip(CLI_ID, { cwd: kho, nowMs: Date.now(), gocGoi: goiMoc() });
  const cu = boLuc(docJ(p));
  for (const [nhan, them] of [['vắng', {}], ['sai khuôn', { CLAUDE_CODE_HOST_SESSION_ID: 'a b' }]]) {
    fs.rmSync(p);
    hookNhip(CLI_ID, { cwd: kho, nowMs: Date.now(), env: them });
    const moi = docJ(p);
    assert.equal('ma_app' in moi, false, `biến ${nhan}: tệp nhịp không được có ma_app`);
    assert.deepEqual(boLuc(moi), cu, `biến ${nhan}: các khoá còn lại phải giống bản ở sha ghim`);
  }
});

// ---------- TC1-02: vai ghi phien_cli (AC-2, E2) ----------
async function kiemVaiHaiMa(gocGoi = GOI) {
  const loi = [];
  const gsCua = (dot) => docJ(path.join(dot, 'vai.json')).giam_sat;
  const a = khoDot({ gocGoi, envMo: { CLAUDE_CODE_SESSION_ID: CLI_ID } });
  if (gsCua(a.dot).phien_cli !== CLI_ID) loi.push(`vai thiếu phien_cli ${CLI_ID} (mo)`);
  const b = khoDot({ gocGoi });
  if ('phien_cli' in gsCua(b.dot)) loi.push('mo không biến CLI mà vai có phien_cli');
  const tt = chayCli(b.kho, ['tiep-tuc', '--phien', APP, '--json'], { gocGoi, env: { CLAUDE_CODE_SESSION_ID: CLI_ID } });
  if (tt.ma !== 0) loi.push(`tiep-tuc thoát ${tt.ma}: ${tt.err}`);
  if (gsCua(b.dot).phien_cli !== CLI_ID) loi.push(`vai thiếu phien_cli ${CLI_ID} (tiep-tuc cùng mã app)`);
  if (gsCua(b.dot).phien !== APP) loi.push('tiep-tuc đổi mã app của vai');
  return loi;
}
test('TC1-02 vai-hai-ma', async () => {
  assert.deepEqual(await kiemVaiHaiMa(), []);
  const hang = [['vắng', {}], ['sai khuôn', { CLAUDE_CODE_SESSION_ID: 'a b' }], ['trùng mã app', { CLAUDE_CODE_SESSION_ID: APP }]];
  console.log(`  số hàng: ${hang.length}`);
  for (const [nhan, env] of hang) {
    const { dot } = khoDot({ envMo: env });
    assert.equal('phien_cli' in docJ(path.join(dot, 'vai.json')).giam_sat, false, `biến ${nhan}: không được ghi phien_cli`);
  }
});
test('TC1-02-do bo-phien-cli', async () => {
  assert.deepEqual(await kiemVaiHaiMa(), [], 'đối chứng dương: bản lành xanh');
  const sao = saoTiem('vai.mjs', ['? { phien_cli: phienCli } : {}', '? {} : {}']);
  const loi = await kiemVaiHaiMa(sao);
  assert.ok(loi.includes(`vai thiếu phien_cli ${CLI_ID} (mo)`), `phải nêu vai thiếu phien_cli: ${loi.join(' | ')}`);
});

// ---------- TC1-03: ma trận đánh thức hai mã (AC-3, E3) ----------
test('TC1-03 ma-tran-hai-ma', async () => {
  const trung = await chayMaTran({ maVai: 's-gs', maCli: 's-gs', vaiCli: false, hookApp: false });
  assert.deepEqual(loiMaTran(trung), [], 'ma trận mã-trùng phải xanh');
  const kq = await baBienThe();
  for (const [ten, ds] of Object.entries(kq)) {
    console.log(`  ${ten} · số hàng: ${ds.length} · ${ds.map((r) => `${r.hang}=${r.kq.hanh_dong}`).join(' ')}`);
    assert.equal(ds.length, MA_TRAN_THUC.length);
    assert.deepEqual(ds.map((r) => r.kq.hanh_dong), trung.map((r) => r.kq.hanh_dong), `biến thể ${ten} lệch ma trận mã-trùng`);
    for (const h of ['b', 'g']) assert.equal(ds.find((r) => r.hang === h).kq.phien, APP, `${ten} (${h}): nhắn phải bằng mã app`);
  }
});
test('TC1-03-do go-ma-app', async () => {
  const lanh = await baBienThe();
  assert.deepEqual(Object.values(lanh).flatMap(loiMaTran), [], 'đối chứng dương: bản lành xanh');
  const sao = saoTiem('song.mjs', ['...(laMaPhien(maApp) ? { ma_app: maApp } : {})', '']);
  const kq = await baBienThe(sao);
  assert.deepEqual(loiMaTran(kq['chi-ma-app']), ['(b): nhịp tươi của giám sát mà vẫn báo chủ kho', '(g): nhịp tươi của giám sát mà vẫn báo chủ kho']);
  assert.deepEqual(loiMaTran(kq['chi-phien-cli']), []);
  assert.deepEqual(loiMaTran(kq['ca-hai']), []);
});
test('TC1-03-do bo-doc-phien-cli', async () => {
  const sao = saoTiem('song.mjs', ['  if (laMaPhien(phienCli)) xet(docMot(path.join(d, `${phienCli}.json`)));\n', '']);
  const kq = await baBienThe(sao);
  assert.deepEqual(loiMaTran(kq['chi-phien-cli']), ['(b): nhịp tươi của giám sát mà vẫn báo chủ kho', '(g): nhịp tươi của giám sát mà vẫn báo chủ kho']);
  assert.deepEqual(loiMaTran(kq['chi-ma-app']), []);
  assert.deepEqual(loiMaTran(kq['ca-hai']), []);
});

// ---------- TC1-04: chẩn đoán hook-phien hai mã (AC-4, E4) ----------
function hookPhien(kho, phien, gocGoi = GOI) {
  const r = chayCli(kho, ['chan-doan', '--json', '--chi-tiet', '--phien', phien], { gocGoi });
  assert.equal(r.ma, 0, r.err);
  return JSON.parse(r.out).find((m) => m.muc === 'hook-phien').trang_thai;
}
function kiemHookPhien(gocGoi = GOI) {
  const loi = [];
  const { kho, dot } = khoDot({ gocGoi, envMo: { CLAUDE_CODE_SESSION_ID: CLI_ID } });
  hookNhip(CLI_ID, { cwd: kho, nowMs: Date.now(), gocGoi });
  for (const ph of [APP, CLI_ID]) if (hookPhien(kho, ph, gocGoi) !== 'du') loi.push(`hook-phien --phien ${ph}: thieu dù có nhịp`);
  fs.rmSync(path.join(dot, 'song'), { recursive: true, force: true });
  for (const ph of [APP, CLI_ID]) if (hookPhien(kho, ph, gocGoi) !== 'thieu') loi.push(`hook-phien --phien ${ph}: du dù không nhịp`);
  return loi;
}
test('TC1-04 hook-phien-hai-ma', () => {
  assert.deepEqual(kiemHookPhien(), []);
});
test('TC1-04-do ghep-ten', () => {
  const sao = saoTiem('chan-doan.mjs', ['else if (nhipCuaPhien(thuMuc, { phien, phienCli }))', "else if (fs.existsSync(path.join(thuMuc, 'song', `${phien}.json`)))"]);
  assert.deepEqual(kiemHookPhien(sao), [`hook-phien --phien ${APP}: thieu dù có nhịp`]);
});

// ---------- TC1-05: hook chưa nạp — tự báo và thang leo (AC-5, E5) ----------
const HOOK = 'không có hook của gói';
function tiepTucJson(kho, doiSo, gocGoi = GOI, nowMs = Date.now()) {
  const r = chayCli(kho, ['tiep-tuc', '--phien', APP, '--json', ...doiSo], { gocGoi, env: { CLAUDE_CODE_SESSION_ID: CLI_ID, DIEU_PHOI_NOW_MS: String(nowMs) } });
  assert.equal(r.ma, 0, r.err);
  return JSON.parse(r.out);
}
function kiemTuBao(gocGoi = GOI) {
  const loi = [];
  const { kho, dot } = khoDot({ gocGoi, envMo: { CLAUDE_CODE_SESSION_ID: CLI_ID } });
  for (const doiSo of [[], ['--nhe']]) {
    const kq = tiepTucJson(kho, doiSo, gocGoi);
    if (kq.hook_thieu !== true || !String(kq.hook_thieu_cau).includes('hook của gói chưa nạp trong phiên này')) loi.push('tiep-tuc không báo hook chưa nạp');
  }
  if (!docJ(path.join(dot, 'vai.json')).giam_sat.hook_thieu_luc) loi.push('vai không ghi hook_thieu_luc');
  return [...new Set(loi)];
}
const THANG = [[5, 'khong'], [50, 'nhan-giam-sat'], [90, 'bao-chu-kho']];
function kiemThang(gocGoi = GOI) {
  const loi = [];
  for (const [phut, can] of THANG) {
    const T0 = Date.now();
    const { kho, dot } = khoDot({ gocGoi, envMo: { CLAUDE_CODE_SESSION_ID: CLI_ID } });
    tiepTucJson(kho, ['--nhe'], gocGoi, T0 - phut * PHUT);
    yeuCau(dot, T0);
    const r = chayCli(kho, ['danh-thuc', '--json'], { gocGoi, env: { DIEU_PHOI_NOW_MS: String(T0 + 1000) } });
    const kq = JSON.parse(r.out);
    const chu = `${kq.cau} ${kq.ly_do}`;
    if (kq.hanh_dong !== can) loi.push(`(${phut}′): ${kq.hanh_dong}, cần ${can}`);
    else if (can !== 'khong' && (!chu.includes(HOOK) || chu.includes('không có nhịp sống'))) loi.push(`(${phut}′): câu thiếu «${HOOK}»`);
    else if (can === 'nhan-giam-sat' && (kq.phien !== APP || !kq.cau.includes('/dieu-phoi:tiep-tuc'))) loi.push(`(${phut}′): nhắn sai mã hay thiếu lệnh`);
  }
  return loi;
}
test('TC1-05 hook-chua-nap', () => {
  assert.deepEqual(kiemTuBao(), []);
  console.log(`  số hàng: ${THANG.length}`);
  assert.deepEqual(kiemThang(), []);
  // Đối chứng: có nhịp trước lời gọi → không hook_thieu; hàng d của DP3-09 vẫn câu cũ.
  const T0 = Date.now();
  const { kho, dot } = khoDot({ envMo: { CLAUDE_CODE_SESSION_ID: CLI_ID } });
  hookNhip(CLI_ID, { cwd: kho, nowMs: T0 - 50 * PHUT });
  const kq = tiepTucJson(kho, ['--nhe'], GOI, T0 - 50 * PHUT);
  assert.equal('hook_thieu' in kq, false);
  yeuCau(dot, T0);
  const d = JSON.parse(chayCli(kho, ['danh-thuc', '--json'], { env: { DIEU_PHOI_NOW_MS: String(T0 + 1000) } }).out);
  assert.equal(d.hanh_dong, 'bao-chu-kho');
  assert.match(d.ly_do, /không có nhịp sống/);
  // Review Focus: lần sau thấy nhịp thì xoá dấu; đổi giám sát không mang dấu sang.
  const b = khoDot({ envMo: { CLAUDE_CODE_SESSION_ID: CLI_ID } });
  tiepTucJson(b.kho, []);
  assert.ok(docJ(path.join(b.dot, 'vai.json')).giam_sat.hook_thieu_luc);
  hookNhip(CLI_ID, { cwd: b.kho, nowMs: Date.now() });
  tiepTucJson(b.kho, []);
  assert.equal('hook_thieu_luc' in docJ(path.join(b.dot, 'vai.json')).giam_sat, false, 'thấy nhịp thì xoá hook_thieu_luc');
  const c = khoDot({ envMo: { CLAUDE_CODE_SESSION_ID: CLI_ID } });
  tiepTucJson(c.kho, []);
  assert.equal(chayCli(c.kho, ['tiep-tuc', '--phien', 'local_moi', '--json'], {}).ma, 0);
  assert.equal('hook_thieu_luc' in docJ(path.join(c.dot, 'vai.json')).giam_sat, false, 'giám sát mới không mang dấu của phiên cũ');
});
test('TC1-05-do bo-bao', () => {
  assert.deepEqual(kiemTuBao(), [], 'đối chứng dương');
  const sao = saoTiem('tiep-tuc.mjs', ['  return { hook_thieu: true, hook_thieu_cau: CAU_HOOK_THIEU };\n', '  return {};\n']);
  assert.ok(kiemTuBao(sao).includes('tiep-tuc không báo hook chưa nạp'));
});
test('TC1-05-do bo-thang', () => {
  assert.deepEqual(kiemThang(), [], 'đối chứng dương');
  const sao = saoTiem('danh-thuc.mjs', ['  if (!nhip && gs?.hook_thieu_luc) {', '  if (false) {']);
  assert.deepEqual(kiemThang(sao), ['(50′): bao-chu-kho, cần nhan-giam-sat', `(90′): câu thiếu «${HOOK}»`]);
});

// ---------- TC1-06: đường đọc-cũ giống từng byte bản ở sha ghim (AC-6, E6) ----------
// Nhiễu của kho thử (đường tạm, sha commit theo giờ) thay bằng nhãn; hành vi giữ nguyên.
const chuanHoa = (s, r) => s.split(r.kho).join('<KHO>').split(r.dot ?? '\0').join('<DOT>').split(path.dirname(r.w1 ?? '\0')).join('<WT>')
  .replace(/[0-9a-f]{40}/g, '<SHA>').replace(/@ [0-9a-f]{7}\b/g, '@ <SHA7>');
async function dauRaDocCu(gocGoi, doiHang = null) {
  const ds = await chayMaTran({ gocGoi, maVai: CLI_ID, maCli: CLI_ID, vaiCli: false, hookApp: false, doiHang });
  const ra = ds.map((r) => [`danh-thuc ${r.hang}`, JSON.stringify(r.kq)]);
  const a = ds.find((r) => r.hang === 'a');
  const cd = chayCli(a.kho, ['chan-doan', '--json', '--chi-tiet', '--phien', CLI_ID], { gocGoi, env: { DIEU_PHOI_NOW_MS: String(Date.now()) } });
  ra.push(['chan-doan', chuanHoa(cd.out, a).replace(/"luc":"[^"]*"/g, '"luc":"<LUC>"')]);
  return ra;
}
const lechNhau = (x, y) => x.flatMap(([ten, v], i) => (y[i]?.[1] === v ? [] : [ten]));
test('TC1-06 doc-cu-tung-byte', async (t) => {
  const goiCham = goiTai(KIT, SHA_TC1_CHAM);
  if (!goiCham) return t.skip(`sha chấm TC1 ${SHA_TC1_CHAM.slice(0, 12)} không có trong lịch sử`);
  canDon.push(path.dirname(goiCham));
  const moi = await dauRaDocCu(goiCham);
  const cu = await dauRaDocCu(goiMoc());
  console.log(`  số đầu ra so: ${moi.length} (gói tại ${SHA_TC1_CHAM.slice(0, 12)} so với ${SHA_MOC.slice(0, 12)})`);
  assert.equal(moi.length, 8);
  assert.deepEqual(lechNhau(moi, cu), []);
  // Đối chứng dương của phép so: đổi một hàng ở một bên → lệch đúng hàng ấy.
  const doi = await dauRaDocCu(goiCham, { d: ['d', 'bao-chu-kho', 5, 50, 'yeu-cau'] });
  assert.deepEqual(lechNhau(doi, cu).filter((x) => x.startsWith('danh-thuc')), ['danh-thuc d']);
});

// ---------- TC1-07: dòng vàng vai mã app đời trước (AC-7, E7) ----------
async function vaiMa(gocGoi, { phienCli }) {
  const { kho, dot, w1 } = khoDot();
  const { ghiVai } = await nap(phienCli ? GOI : goiMoc(), 'vai.mjs');
  ghiVai(dot, { phien: APP, worktree: kho, day: [{ id: 'P1', worktree: w1 }], ...(phienCli ? { phienCli } : {}) });
  hookNhip(CLI_ID, { cwd: kho, nowMs: Date.now() });
  const r = chayCli(kho, ['chan-doan', '--json', '--chi-tiet', '--phien', APP], { gocGoi });
  return { ma: r.ma, muc: JSON.parse(r.out).filter((m) => m.viec.includes('vai giữ mã app nhưng nhịp chưa mang mã app')) };
}
test('TC1-07 vang-ma-app', async () => {
  const moi = await vaiMa(GOI, { phienCli: null });
  assert.equal(moi.muc.length, 1);
  assert.match(moi.muc[0].viec, /\/dieu-phoi:tiep-tuc/);
  assert.equal(moi.ma, (await vaiMa(goiMoc(), { phienCli: null })).ma, 'mã thoát bằng bản ở sha ghim');
  assert.equal((await vaiMa(GOI, { phienCli: CLI_ID })).muc.length, 0, 'đối chứng: vai có phien_cli thì không có dòng');
});

// ---------- TC1-08: lời dặn ba lệnh (AC-8, E8) ----------
// Quan hệ theo TỪNG dòng: mỗi dòng mang `--phien <mã phiên này>` nằm trong một bước đánh số (dòng mở bằng «<số>. ») và
// chính bước ấy phải nói «mã app `local_…`»; mỗi tệp còn phải có câu «máy tự ghi mã CLI». `<mã phiên ngắn>` (phiên lịch
// 30′, chỉ đọc hạn mức) không thuộc lời hứa.
const LENH = ['tiep-tuc.md', 'ban-giao.md', 'mo-dot.md'];
const DAU_BUOC = /^\d+\. /;
export function thieuLoiDan(vanBan) {
  const loi = [];
  let soDong = 0;
  for (const [ten, s] of Object.entries(vanBan)) {
    const dong = s.split('\n');
    if (!s.includes('máy tự ghi mã CLI')) loi.push(`${ten}: thiếu câu «máy tự ghi mã CLI»`);
    dong.forEach((d, i) => {
      if (!d.includes('--phien <mã phiên này>')) return;
      soDong++;
      let dau = i;
      while (dau > 0 && !DAU_BUOC.test(dong[dau])) dau--;
      let cuoi = i + 1;
      while (cuoi < dong.length && !DAU_BUOC.test(dong[cuoi]) && !/^#{1,6} /.test(dong[cuoi])) cuoi++;
      if (!dong.slice(dau, cuoi).join('\n').includes('mã app `local_…`')) loi.push(`${ten}:${i + 1}: bước có --phien không nói mã app`);
    });
  }
  return { loi, soDong };
}
const vanBanHienTai = () => Object.fromEntries(LENH.map((t) => [t, fs.readFileSync(path.join(GOI, 'commands', t), 'utf8')]));
test('TC1-08 loi-dan', () => {
  const { loi, soDong } = thieuLoiDan(vanBanHienTai());
  console.log(`  số dòng --phien <mã phiên này>: ${soDong}`);
  assert.equal(soDong, 6, 'ma trận viết trước: 6 dòng (tiep-tuc 15, 18, 56 · ban-giao 14, 29 · mo-dot 26 — số dòng đổi theo tệp, số đếm thì không)');
  assert.deepEqual(loi, []);
});
test('TC1-08-do ban-cu', () => {
  const vb = Object.fromEntries(LENH.map((t) => [t, git(KIT, 'show', `${SHA_MOC}:dieu-phoi/commands/${t}`)]));
  const { loi, soDong } = thieuLoiDan(vb);
  assert.equal(soDong, 6);
  assert.deepEqual(loi.filter((l) => l.includes('thiếu câu')), LENH.map((t) => `${t}: thiếu câu «máy tự ghi mã CLI»`));
  assert.equal(loi.filter((l) => l.includes('không nói mã app')).length, 6, `mọi dòng --phien ở bản cũ phải đỏ: ${loi.join(' | ')}`);
});
test('TC1-08-do bo-mot-buoc', () => {
  const vb = vanBanHienTai();
  assert.deepEqual(thieuLoiDan(vb).loi, [], 'đối chứng dương');
  const cu = '   (mã app `local_…` như bước 1; mã CLI cũng nhận).\n';
  assert.ok(vb['tiep-tuc.md'].includes(cu), 'bước tiêm không áp được');
  vb['tiep-tuc.md'] = vb['tiep-tuc.md'].replace(cu, '');
  const { loi } = thieuLoiDan(vb);
  assert.equal(loi.length, 1);
  assert.match(loi[0], /^tiep-tuc\.md:\d+: bước có --phien không nói mã app$/);
});

// ---------- TC1-09: ca đã có đổi thân phải có tên trong sổ (AC-9, E9) ----------
// Hai đầu cố định (SHA_MOC → SHA_TC1_CHAM), sổ đọc tại SHA_TC1_CHAM — bộ đọc chung ca-doi-than.mjs (hồ sơ
// trao-vai-va-do-sau-gop). Không đọc cây làm việc: vòng sau đổi thân ca DP3 không làm ca này đỏ.
const SO_TC1 = '_acceptance/danh-thuc-doc-nhip-dung-ma/decisions.jsonl';
export const caKhaiTrongSo = (soText) => (soText ?? '').split('\n').filter(Boolean).flatMap((d) => {
  try {
    const o = JSON.parse(d);
    return o.type === 'fix' && Array.isArray(o.ca_doi_than) ? o.ca_doi_than : [];
  } catch {
    return [];
  }
}).sort();
test('TC1-09 than-ca-doi', (t) => {
  const kq = caDoiThanLichSu(KIT, SHA_MOC, SHA_TC1_CHAM);
  if (kq.boQua) return t.skip(kq.boQua);
  console.log(`  ca đổi thân ${SHA_MOC.slice(0, 12)}..${SHA_TC1_CHAM.slice(0, 12)}: ${kq.ds.join(' · ') || '(không)'}`);
  assert.deepEqual(kq.ds, caKhaiTrongSo(docTai(KIT, SHA_TC1_CHAM, SO_TC1)));
  // Đối chứng dương: tiêm một khoảng trắng vào thân ca DP3-02 30-giay ở bản đọc tại mốc cuối → hàm nêu đúng tên ca ấy.
  const f = 'tests/dieu-phoi/tiep-tuc.test.mjs';
  const tiem = (sha, p) => {
    const v = docTai(KIT, sha, p);
    return sha === SHA_TC1_CHAM && p === f ? v.replace("test('DP3-02 30-giay', () => {\n", "test('DP3-02 30-giay', () => {\n \n") : v;
  };
  assert.notEqual(tiem(SHA_TC1_CHAM, f), docTai(KIT, SHA_TC1_CHAM, f), 'bước tiêm không áp được');
  assert.deepEqual(caDoiThanLichSu(KIT, SHA_MOC, SHA_TC1_CHAM, { doc: tiem }).ds.filter((x) => !kq.ds.includes(x)), ['DP3-02 30-giay']);
});

// ---------- TC1-09 hai-moi-truong-so: phép so của script hai môi trường (AC-9, E9b) ----------
test('TC1-09 hai-moi-truong-so', () => {
  const lan = (ok, hong = []) => ({ ok: new Set(ok), hong: new Set(hong) });
  assert.deepEqual(caNghi(lan(['A', 'B']), lan(['A', 'B'])), [], 'đối chứng dương: cùng tập, không đỏ → không nghi');
  assert.deepEqual(caNghi(lan(['A', 'B']), lan(['A'], ['B'])), ['B'], 'xanh một bên, đỏ bên kia → nghi đúng ca');
  assert.deepEqual(caNghi(lan(['A']), lan(['A', 'C'])), ['C'], 'chỉ có ở một bên → nghi');
  assert.deepEqual(caNghi(lan(['A'], ['D']), lan(['A'], ['D'])), ['D'], 'đỏ cả hai → vẫn nghi (không lọt vì «cùng tập»)');
});

