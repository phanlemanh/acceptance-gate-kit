// Hồ sơ trao-vai-va-do-sau-gop (hàng TC1b): trao vai giám sát không mang mã CLI của phiên trao, lời dặn chẩn đoán khớp
// hành vi, và hai phép đo của TC1 không đỏ giả khi cây làm việc trôi. Kho thử, đợt (`mo` thật), hook (lệnh rút từ
// hooks.json) và CLI chạy thật; mọi tiến trình con chạy với môi trường đã xoá hai biến mã phiên rồi mới thêm biến của ca.
// Mỗi ca đỏ chạy CHÍNH hàm đo trên bản sao bị tiêm, sau khi bản lành xanh, kiểm bước tiêm đã áp, ghim thông điệp.
//   node --test --test-name-pattern=TC1b-03 tests/dieu-phoi/trao-vai.test.mjs
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { caDoiThanLichSu, goiTai, khoiCa, khoiCaCu } from './ca-doi-than.mjs';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(DAY, '..', '..');
const GOI = path.join(KIT, 'dieu-phoi');
const SHA_MOC = '45e9f2cf13d104aa4b1a2321a0026c4b739f8914';
const SHA_TC1_CHAM = 'e208665fba6bbf3069b2d079c64448b8010ac180';
const SHA_TC1_DINH = '8df32d1c1f90c7a8323e1fa1c5546b28e3626f92';
const PHUT = 60_000;
const BIEN = ['CLAUDE_CODE_HOST_SESSION_ID', 'CLAUDE_CODE_SESSION_ID'];

const canDon = [];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
});
const tam = (tienTo = 'tc1b-') => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tienTo)));
  canDon.push(d);
  return d;
};
const docJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ghiJ = (p, du) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(du, null, 2));
};
const moiTruongSach = (them = {}) => ({
  ...Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT' && !BIEN.includes(k))),
  ...them,
});
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, env: moiTruongSach(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
function chayCli(cwd, doiSo, { gocGoi = GOI, env = {} } = {}) {
  const r = spawnSync(process.execPath, [path.join(gocGoi, 'scripts', 'dieu-phoi.mjs'), ...doiSo], { cwd, env: moiTruongSach(env), encoding: 'utf8' });
  return { ma: r.status, out: r.stdout, err: r.stderr };
}
function hookNhip(sessionId, { cwd, nowMs, gocGoi = GOI, env = {} }) {
  const lenh = docJ(path.join(gocGoi, 'hooks', 'hooks.json')).hooks.PostToolUse[0].hooks[0].command.split('${CLAUDE_PLUGIN_ROOT}').join(gocGoi);
  const r = spawnSync('sh', ['-c', lenh], { cwd, env: moiTruongSach({ DIEU_PHOI_NOW_MS: String(nowMs), ...env }), input: JSON.stringify({ cwd, session_id: sessionId }), encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
}
// Kho thử + worktree P1 + gói đợt + đợt «thu» mở bằng `mo --phien <maVai>`; pha `nhap` (không khởi bộ phát lịch thật).
function khoDot({ gocGoi = GOI, maVai, envMo = {} }) {
  const kho = tam('tc1b-kho-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  const w1 = path.join(tam('tc1b-wt-'), 'p1');
  git(kho, 'worktree', 'add', '-q', '-b', 'p1', w1);
  const dir = path.join(kho, 'goi', 'dot-thu');
  ghiJ(path.join(dir, 'dieu-phoi.config.json'), docJ(path.join(gocGoi, 'scripts', 'mau', 'dieu-phoi.config.json')));
  ghiJ(path.join(dir, 'hang-viec.json'), { dot: '', day: [{ id: 'P1', worktree: fs.realpathSync(w1) }], hang: [{ ma: 'A', slug: 'hang-a', day: 'P1', uu_tien: 1 }], ngoai_hang_merge: [] });
  fs.writeFileSync(path.join(dir, 'LUAT-rieng.md'), '# Luật riêng\n');
  fs.mkdirSync(path.join(kho, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\ndieu_phoi:\n  goi_dot: goi/dot-{ten}\n');
  const mo = chayCli(kho, ['mo', 'thu', '--phien', maVai], { gocGoi, env: envMo });
  assert.equal(mo.ma, 0, mo.err);
  return { kho, dot: fs.realpathSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai')) };
}
function saoTiem(tep, cu, moi) {
  const d = path.join(tam('tc1b-sao-'), 'dieu-phoi');
  fs.cpSync(GOI, d, { recursive: true });
  const p = path.join(d, 'scripts', tep);
  const s = fs.readFileSync(p, 'utf8');
  assert.ok(s.includes(cu), `bước tiêm không áp được trên ${tep}`);
  fs.writeFileSync(p, s.split(cu).join(moi));
  return d;
}
const gsCua = (dot) => docJ(path.join(dot, 'vai.json')).giam_sat;

// ---------- TC1b-01, TC1b-02: trao vai (AC-1, AC-2) ----------
function kiemTraoVai(gocGoi = GOI) {
  const loi = [];
  const { kho, dot } = khoDot({ gocGoi, maVai: 'local_a', envMo: { CLAUDE_CODE_SESSION_ID: 'c-a' } });
  const r = chayCli(kho, ['vai', '--giam-sat', 'local_x', '--phien', 'local_a'], { gocGoi, env: { CLAUDE_CODE_SESSION_ID: 'c-a' } });
  if (r.ma !== 0) return [`vai thoát ${r.ma}: ${r.err}`];
  const gs = gsCua(dot);
  if (gs.phien !== 'local_x') loi.push(`vai không đổi sang local_x (${gs.phien})`);
  if ('phien_cli' in gs) loi.push(`giám sát mới mang mã CLI của phiên trao (${gs.phien_cli})`);
  const T0 = Date.now();
  hookNhip('c-a', { cwd: kho, nowMs: T0 - 2 * PHUT, gocGoi, env: { CLAUDE_CODE_HOST_SESSION_ID: 'local_a' } });
  const v = docJ(path.join(dot, 'vai.json'));
  ghiJ(path.join(dot, 'vai.json'), { ...v, giam_sat: { ...v.giam_sat, thuc_luc: new Date(T0 - 50 * PHUT).toISOString() } });
  ghiJ(path.join(dot, 'yeu-cau', 'P1-1.json'), { phien: 'P1', loai: 'khac', hang: 'hang-a', noi_dung: {}, luc: new Date(T0).toISOString() });
  const d = JSON.parse(chayCli(kho, ['danh-thuc', '--json'], { gocGoi, env: { DIEU_PHOI_NOW_MS: String(T0 + 1000) } }).out);
  if (d.hanh_dong !== 'bao-chu-kho') loi.push(`đánh thức ${d.hanh_dong} — nhịp của phiên trao bị tính cho giám sát mới`);
  return loi;
}
test('TC1b-01 trao-vai', () => {
  assert.deepEqual(kiemTraoVai(), []);
});
test('TC1b-01-do bo-null', () => {
  assert.deepEqual(kiemTraoVai(), [], 'đối chứng dương');
  const sao = saoTiem('dieu-phoi.mjs', "nhanVaiGiamSat(thuMuc, { phien: co['giam-sat'], worktree: cwd, phienCli: co['giam-sat'] === co.phien ? undefined : null })", "nhanVaiGiamSat(thuMuc, { phien: co['giam-sat'], worktree: cwd })");
  const loi = kiemTraoVai(sao);
  assert.ok(loi.includes('giám sát mới mang mã CLI của phiên trao (c-a)'), loi.join(' | '));
  assert.ok(loi.includes('đánh thức nhan-giam-sat — nhịp của phiên trao bị tính cho giám sát mới'), loi.join(' | '));
});
test('TC1b-02 tu-nhan-lai', () => {
  const hang = [['có biến', { CLAUDE_CODE_SESSION_ID: 'c-a' }], ['môi trường đã xoá hai biến', {}]];
  console.log(`  số hàng: ${hang.length}`);
  for (const [nhan, env] of hang) {
    const { kho, dot } = khoDot({ maVai: 'local_a', envMo: { CLAUDE_CODE_SESSION_ID: 'c-a' } });
    assert.equal(chayCli(kho, ['vai', '--giam-sat', 'local_a', '--phien', 'local_a'], { env }).ma, 0);
    assert.equal(gsCua(dot).phien_cli, 'c-a', `${nhan}: tự nhận lại phải giữ phien_cli`);
  }
});

// ---------- TC1b-03: mục giam-sat với ba mã (AC-3) ----------
const MA_TRAN_GS = [
  ['local_gs', 'du', null],
  ['c-gs', 'thieu', /mã CLI của giám sát hiện tại.*local_gs/],
  ['la', 'thieu', /giám sát hiện tại là local_gs/],
];
function kiemGiamSat(gocGoi = GOI) {
  const loi = [];
  const { kho } = khoDot({ gocGoi, maVai: 'local_gs', envMo: { CLAUDE_CODE_SESSION_ID: 'c-gs' } });
  hookNhip('c-gs', { cwd: kho, nowMs: Date.now(), gocGoi, env: { CLAUDE_CODE_HOST_SESSION_ID: 'local_gs' } });
  for (const [ph, can, mau] of MA_TRAN_GS) {
    const m = JSON.parse(chayCli(kho, ['chan-doan', '--json', '--chi-tiet', '--phien', ph], { gocGoi }).out).find((x) => x.muc === 'giam-sat');
    if (m.trang_thai !== can) loi.push(`${ph}: ${m.trang_thai}, cần ${can}`);
    else if (mau && !mau.test(m.viec)) loi.push(ph === 'c-gs' ? 'mã CLI bị mời nhận vai' : `${ph}: câu lệch «${m.viec}»`);
  }
  return loi;
}
test('TC1b-03 giam-sat-ba-ma', () => {
  console.log(`  số hàng: ${MA_TRAN_GS.length}`);
  assert.deepEqual(kiemGiamSat(), []);
});
test('TC1b-03-do bo-nhanh-cli', () => {
  assert.deepEqual(kiemGiamSat(), [], 'đối chứng dương');
  const sao = saoTiem('chan-doan.mjs', "  else if (phien === vai?.giam_sat?.phien_cli)", "  else if (false)");
  assert.deepEqual(kiemGiamSat(sao), ['mã CLI bị mời nhận vai']);
});

// ---------- TC1b-04: lời dặn bước 5 (AC-4) ----------
export function buoc5MoiMaCli(vanBan) {
  const dong = vanBan.split('\n');
  const i = dong.findIndex((d) => d.startsWith('5. '));
  let j = i + 1;
  while (j < dong.length && !/^\d+\. /.test(dong[j])) j++;
  const buoc = dong.slice(i, j).join('\n');
  return [...(buoc.includes('mã CLI cũng nhận') ? ['bước 5 còn mời mã CLI'] : []), ...(buoc.includes('mã app `local_…`') ? [] : ['bước 5 thiếu mã app'])];
}
test('TC1b-04 buoc-5', () => {
  assert.deepEqual(buoc5MoiMaCli(fs.readFileSync(path.join(GOI, 'commands', 'tiep-tuc.md'), 'utf8')), []);
  assert.deepEqual(buoc5MoiMaCli(git(KIT, 'show', `${SHA_TC1_DINH}:dieu-phoi/commands/tiep-tuc.md`)), ['bước 5 còn mời mã CLI'], 'đối chứng: bản ở đỉnh TC1');
});

// ---------- TC1b-05, TC1b-07: không đọc cây làm việc (AC-5, AC-7) ----------
// Worktree tạm ở HEAD; đổi thân DP3-02 30-giay, sổ TC1 và một câu viec của chan-doan.mjs TRONG đó.
function worktreeTroi() {
  const w = path.join(tam('tc1b-troi-'), 'w');
  git(KIT, 'worktree', 'add', '-q', '--detach', w, 'HEAD');
  after(() => spawnSync('git', ['worktree', 'remove', '--force', w], { cwd: KIT, env: moiTruongSach() }));
  const sua = (p, cu, moi) => {
    const f = path.join(w, p);
    const s = fs.readFileSync(f, 'utf8');
    assert.ok(s.includes(cu), `bước đổi cây không áp được trên ${p}`);
    fs.writeFileSync(f, s.replace(cu, moi));
  };
  sua('tests/dieu-phoi/tiep-tuc.test.mjs', "test('DP3-02 30-giay', () => {\n", "test('DP3-02 30-giay', () => {\n \n");
  fs.appendFileSync(path.join(w, '_acceptance/danh-thuc-doc-nhip-dung-ma/decisions.jsonl'), '{"type":"fix","ca_doi_than":["X"]}\n');
  sua('dieu-phoi/scripts/chan-doan.mjs', "'gọi với --phien để kiểm hook của phiên này'", "'(đổi trên cây làm việc)'");
  return w;
}
const MODULE = path.join(DAY, 'ca-doi-than.mjs');
async function saoModule(cu, moi) {
  const d = tam('tc1b-mod-');
  const s = fs.readFileSync(MODULE, 'utf8');
  assert.ok(s.includes(cu), 'bước tiêm không áp được trên ca-doi-than.mjs');
  const p = path.join(d, 'ca-doi-than.mjs');
  fs.writeFileSync(p, s.split(cu).join(moi));
  return import(pathToFileURL(p).href);
}
test('TC1b-05 khong-doc-cay', async () => {
  const w = worktreeTroi();
  const kq = caDoiThanLichSu(w, SHA_MOC, SHA_TC1_CHAM);
  assert.deepEqual(kq.ds, ['(đầu tiep-tuc.test.mjs)', 'DP3-09 ma-tran']);
  const m = await saoModule('    const moi = tach(doc(den, f), path.basename(f));', "    const moi = tach(fs.readFileSync(path.join(goc, f), 'utf8'), path.basename(f));");
  assert.ok(m.caDoiThanLichSu(w, SHA_MOC, SHA_TC1_CHAM).ds.includes('DP3-02 30-giay'), 'bản đọc cây làm việc phải lộ ca đổi trên cây');
});
test('TC1b-05 sha-vang', () => {
  assert.deepEqual(caDoiThanLichSu(KIT, SHA_MOC, '0000000000000000000000000000000000000001'), { boQua: 'sha 000000000000 không có trong lịch sử' });
});
test('TC1b-07 khong-doc-cay', async () => {
  const w = worktreeTroi();
  const g = goiTai(w, SHA_TC1_CHAM);
  canDon.push(path.dirname(g));
  assert.ok(!fs.readFileSync(path.join(g, 'scripts', 'chan-doan.mjs'), 'utf8').includes('(đổi trên cây làm việc)'), 'gói so phải là bản tại sha chấm');
  const m = await saoModule("  execFileSync('sh', ['-c', `git -C \"${goc}\" archive ${sha} ${thuMuc} | tar -x -C \"${d}\"`], { env: ENV });", "  fs.cpSync(path.join(goc, thuMuc), path.join(d, thuMuc), { recursive: true });");
  const g2 = m.goiTai(w, SHA_TC1_CHAM);
  canDon.push(path.dirname(g2));
  assert.ok(fs.readFileSync(path.join(g2, 'scripts', 'chan-doan.mjs'), 'utf8').includes('(đổi trên cây làm việc)'), 'bản chép cây làm việc phải lộ câu đổi');
});

// ---------- TC1b-06: bộ tách khối (AC-6) ----------
const VAN_BAN = [
  "import x from 'x';",
  "test('A', () => assert.ok(1));",
  "test('B', () => {",
  '  assert.ok(2);',
  '});',
  "for (const n of ['C1', 'C2', 'C3']) {",
  '  test(`${n}`, () => {',
  '    assert.ok(n);',
  '  });',
  '}',
  "test('D', () => {",
  '  assert.ok(4);',
  '});',
].join('\n');
test('TC1b-06 tach-khoi', () => {
  const moi = khoiCa(VAN_BAN, 'v.mjs');
  assert.ok(['A', 'B', '${n}', 'D'].every((k) => moi.has(k)), `thiếu khoá: ${[...moi.keys()].join(',')}`);
  assert.ok(!moi.get('A').includes("test('B'"), 'thân A nuốt B');
  const cu = khoiCaCu(VAN_BAN, 'v.mjs');
  const khac = ['A', 'B', 'D'].filter((k) => cu.get(k) !== moi.get(k));
  console.log(`  bộ cũ khác bộ mới ở: ${khac.join(', ')}`);
  assert.ok(khac.length > 0 && cu.get('A')?.includes("test('B'"), 'bộ cũ phải nuốt B vào A — đối chứng cho chiều đỏ');
});
