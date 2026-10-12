// Hồ sơ trang-thai-dot-dieu-phoi-tho (DP6b) — ca KH-01…KH-04: CLI `xem --json`, `xem` không đổi byte, hàm vẽ thuần
// `khung.mjs` và `chuXem`. Kho thử do code sinh: kho git tạm + đợt chép từ fixture dot-crm-0910 (đợt thật crm,
// 8 đơn chờ, khoá s4 của P5) — cùng cách dựng `dungDotCu` của mo-dot.test. Mỗi phép đo là một hàm trả danh sách
// lỗi trên MỘT gốc gói, nên ca đỏ chạy CHÍNH phép đo đó trên bản sao bị tiêm, sau khi gói thật xanh trên cùng fixture.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(DAY, '..', '..');
const GOI = path.join(KIT, 'dieu-phoi');
const FIXTURE = path.join(DAY, 'fixtures', 'dot-crm-0910');
// Bản cũ của AC-3: commit cố định (đỉnh main khi hồ sơ mở), không merge-base sống.
const BAN_CU = 'f59d9547';
const TZ = 'Asia/Ho_Chi_Minh';

const canDon = [];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = (tienTo) => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tienTo)));
  canDon.push(d);
  return d;
};
const docJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ghiJ = (p, du) => fs.writeFileSync(p, `${JSON.stringify(du, null, 2)}\n`);
const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT'));
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, env: ENV, stdio: ['ignore', 'pipe', 'ignore'] });

function khoGit(tienTo = 'kh-kho-') {
  const kho = tam(tienTo);
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  return kho;
}

// Đợt «sau-14-10» chép từ fixture; `nhip: false` bỏ trang-thai.json (đợt chưa có nhịp); `sua(tt)` đổi trạng thái
// trước khi ghi; `canhBao` thêm .claude/settings.json còn hook gọi bản lõi chép tay (dòng `cảnh báo:` của `xem`).
function khoDot({ nhip = true, sua = null, canhBao = false, boHangViec = false } = {}) {
  const kho = khoGit();
  const dot = path.join(kho, '.acceptance-runs', 'dieu-phoi-sau-14-10');
  fs.cpSync(FIXTURE, dot, { recursive: true });
  const tatCa = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? tatCa(path.join(d, e.name)) : [path.join(d, e.name)]));
  for (const p of tatCa(dot)) {
    const t = fs.readFileSync(p, 'utf8');
    if (t.includes('@KHO@')) fs.writeFileSync(p, t.split('@KHO@').join(kho));
  }
  for (const d of docJ(path.join(dot, 'hang-viec.json')).day) if (path.isAbsolute(d.worktree)) fs.mkdirSync(d.worktree, { recursive: true });
  fs.mkdirSync(path.join(kho, '.claude', 'worktrees', 'wt-3', 'con'), { recursive: true });
  fs.mkdirSync(path.join(kho, '.claude', 'worktrees', 'khac'), { recursive: true });
  const pTt = path.join(dot, 'trang-thai.json');
  if (!nhip) fs.rmSync(pTt);
  else if (sua) ghiJ(pTt, sua(docJ(pTt)));
  if (boHangViec) fs.rmSync(path.join(dot, 'hang-viec.json'));
  if (canhBao) {
    fs.mkdirSync(path.join(kho, '.claude'), { recursive: true });
    ghiJ(path.join(kho, '.claude', 'settings.json'), { hooks: { PostToolUse: [{ matcher: '*', hooks: [{ type: 'command', command: 'node scripts/dieu-phoi/hook-nhip.mjs' }] }] } });
  }
  fs.symlinkSync(dot, path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  return { kho, dot: fs.realpathSync(dot) };
}

const chayCli = (gocGoi, cwd, doiSo) => {
  const r = spawnSync(process.execPath, [path.join(gocGoi, 'scripts', 'dieu-phoi.mjs'), ...doiSo], { cwd, env: { ...ENV, TZ }, encoding: 'utf8' });
  return { ma: r.status, out: r.stdout, err: r.stderr };
};
const nap = (gocGoi, tep) => import(`${pathToFileURL(path.join(gocGoi, 'scripts', tep)).href}?v=${Math.random()}`);

// Bản sao gói với một chỗ tiêm; ném khi chuỗi cần thay không có (bước tiêm phải áp được).
function banSao(tep, cu, moi) {
  const sao = path.join(tam('kh-goi-'), 'dieu-phoi');
  fs.cpSync(GOI, sao, { recursive: true });
  const p = path.join(sao, 'scripts', tep);
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace(cu, moi);
  if (tiem === goc) throw new Error(`bước tiêm không áp được ở ${tep}: ${cu}`);
  fs.writeFileSync(p, tiem);
  return sao;
}

// ---------- KH-01 · AC-1 ----------
const THEM = ['day_cua_cwd', 'canh_bao', 'mui_gio_phut'];
async function kiemXemJson(gocGoi) {
  const loi = [];
  const { kho, dot } = khoDot();
  const { moHinh } = await nap(GOI, 'mo-hinh.mjs');
  const { docNhomKeHoach } = await nap(GOI, 'nguon-hang.mjs');
  // So với moHinh SAU khi qua JSON: khoá mang undefined (vd `link` của dãy không có phiên) không đi qua dây được.
  const mong = JSON.parse(JSON.stringify(moHinh(docJ(path.join(dot, 'trang-thai.json')), { nhom: docNhomKeHoach(kho), hangViec: docJ(path.join(dot, 'hang-viec.json')) })));
  const wt = (...a) => path.join(kho, '.claude', 'worktrees', ...a);
  const hang = [
    ['(a) gốc kho', kho, null],
    ['(b) worktree P3', wt('wt-3'), 'P3'],
    ['(c) thư mục con của P3', wt('wt-3', 'con'), 'P3'],
    ['(d) worktree ngoài dãy', wt('khac'), null],
  ];
  for (const [ten, cwd, day] of hang) {
    const r = chayCli(gocGoi, cwd, ['xem', '--json']);
    const dong = r.out.split('\n').filter(Boolean);
    let kq = null;
    try {
      kq = JSON.parse(dong[0]);
    } catch {}
    console.log(`  KH-01 ${ten} · day_cua_cwd mong ${day} · thực ${kq?.day_cua_cwd}`);
    if (r.ma !== 0 || r.err !== '' || dong.length !== 1 || !kq) {
      loi.push(`${ten}: mã ${r.ma}, stderr «${r.err.trim()}», ${dong.length} dòng`);
      continue;
    }
    if (!(THEM[0] in kq) || kq.day_cua_cwd !== day) loi.push(`${ten}: day_cua_cwd ${JSON.stringify(kq.day_cua_cwd)} ≠ ${day}`);
    if (kq.canh_bao !== null) loi.push(`${ten}: canh_bao ${kq.canh_bao}`);
    if (kq.mui_gio_phut !== 420) loi.push(`${ten}: mui_gio_phut ${kq.mui_gio_phut} ≠ 420`);
    const lot = Object.fromEntries(Object.entries(kq).filter(([k]) => !THEM.includes(k)));
    try {
      assert.deepStrictEqual(lot, mong);
    } catch {
      loi.push(`${ten}: mô hình khác moHinh của cùng tệp`);
    }
  }
  console.log(`  KH-01 số assert: ${hang.length}`);
  return loi;
}

test('KH-01 xem-json', async () => {
  assert.deepEqual(await kiemXemJson(GOI), []);
});

test('KH-01-do bo-day-cua-cwd', async () => {
  const sao = banSao('dieu-phoi.mjs', 'day_cua_cwd: phienCuaCwd(hangViec, cwd), ', '');
  const loi = await kiemXemJson(sao);
  assert.ok(loi.some((l) => l.startsWith('(b)') && l.includes('day_cua_cwd')), loi.join(' | '));
});

// ---------- KH-02 · AC-2 ----------
function kiemXemJsonBien(gocGoi) {
  const loi = [];
  const khongDot = khoGit();
  const a = chayCli(gocGoi, khongDot, ['xem', '--json']);
  if (!(a.out === '{"dot":null}\n' && a.ma === 0 && a.err === '')) loi.push(`(a) kho không đợt: mã ${a.ma}, stdout ${JSON.stringify(a.out)}, stderr «${a.err.trim()}»`);
  const ngoai = tam('kh-ngoai-git-');
  const b = chayCli(gocGoi, ngoai, ['xem', '--json']);
  if (!(b.out === '{"dot":null}\n' && b.ma === 0 && b.err === '')) loi.push(`(b) ngoài git: mã ${b.ma}, stdout ${JSON.stringify(b.out)}, stderr «${b.err.trim()}»`);
  const c = chayCli(gocGoi, khoDot({ nhip: false }).kho, ['xem', '--json']);
  let kc = null;
  try {
    kc = JSON.parse(c.out);
  } catch {}
  if (!(c.ma === 0 && kc?.dot === 'sau-14-10' && kc?.pha === 'dang-chay' && kc?.chua_co_nhip === true)) loi.push(`(c) chưa có nhịp: mã ${c.ma}, ${c.out.trim()}`);
  const hong = khoDot();
  fs.writeFileSync(path.join(hong.dot, 'trang-thai.json'), '{hỏng');
  const d = chayCli(gocGoi, hong.kho, ['xem', '--json']);
  if (!(d.ma === 1 && d.err.startsWith('dieu-phoi: ') && d.out === '')) loi.push(`(d) tệp hỏng: mã ${d.ma}, stderr «${d.err.trim()}», stdout ${JSON.stringify(d.out)}`);
  const e = chayCli(gocGoi, khoDot({ boHangViec: true }).kho, ['xem', '--json']);
  let ke = null;
  try {
    ke = JSON.parse(e.out);
  } catch {}
  if (!(e.ma === 0 && ke && ke.day_cua_cwd === null)) loi.push(`(e) thiếu hang-viec.json: mã ${e.ma}, «${e.err.trim()}»`);
  console.log('  KH-02 số assert: 5');
  return loi;
}

test('KH-02 xem-json-bien', () => {
  assert.deepEqual(kiemXemJsonBien(GOI), []);
});

test('KH-02-do khong-dot-rong', () => {
  const sao = banSao('dieu-phoi.mjs', 'if (!thuMuc) return { dot: null };', 'if (!thuMuc) return {};');
  const loi = kiemXemJsonBien(sao);
  assert.ok(loi.some((l) => l.startsWith('(a)') && l.includes('{}')), loi.join(' | '));
});

// ---------- KH-03 · AC-3 ----------
let banCu = null;
function layBanCu() {
  if (banCu) return banCu;
  const d = tam('kh-cu-');
  const tar = execFileSync('git', ['-C', KIT, 'archive', BAN_CU, 'dieu-phoi'], { env: ENV, maxBuffer: 64 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  banCu = path.join(d, 'dieu-phoi');
  return banCu;
}
function kiemXemKhongDoi(gocGoi) {
  const loi = [];
  const cu = layBanCu();
  const hang = [
    ['(a) có nhịp', khoDot().kho],
    ['(b) chưa có nhịp', khoDot({ nhip: false }).kho],
    ['(c) không đợt', khoGit()],
    ['(d) có cảnh báo', khoDot({ canhBao: true }).kho],
  ];
  for (const [ten, kho] of hang) {
    const moi = chayCli(gocGoi, kho, ['xem']);
    const goc = chayCli(cu, kho, ['xem']);
    const bang = moi.ma === goc.ma && moi.out === goc.out && moi.err === goc.err;
    console.log(`  KH-03 ${ten} · ${bang ? 'bằng nhau' : 'KHÁC'}`);
    if (!bang) {
      const a = moi.out.split('\n');
      const b = goc.out.split('\n');
      const i = a.findIndex((x, k) => x !== b[k]);
      loi.push(`${ten}: HEAD «${a[i] ?? moi.err.trim()}» ≠ bản cũ «${b[i] ?? goc.err.trim()}»`);
    }
    if (ten.startsWith('(d)') && !moi.out.split('\n').some((x) => x.startsWith('cảnh báo:'))) loi.push('(d) đối chứng: không có dòng «cảnh báo:»');
  }
  return loi;
}

test('KH-03 xem-khong-doi', () => {
  assert.deepEqual(kiemXemKhongDoi(GOI), []);
});

test('KH-03-do doi-chu', () => {
  const sao = banSao('mo-hinh.mjs', '· chờ lượt ${m.hang_cho.length}', '· cho luot ${m.hang_cho.length}');
  const loi = kiemXemKhongDoi(sao);
  assert.ok(loi.some((l) => l.startsWith('(a)') && l.includes('cho luot')), loi.join(' | '));
});

// ---------- KH-04 · AC-4 ----------
// Chuỗi mong đợi chép từ thiết kế §2.2 và hợp đồng AC-4 — viết tay, không rút từ mã.
const HAN = '2026-10-10T00:47:30.085Z';
const goc = (them = {}) => ({
  dot: 'sau-14-10', pha: 'dang-chay', giam_tai: false, can_nguoi: null,
  khoa: [{ tai_nguyen: 's4', phien: 'P5', han: HAN }], hang_cho: [{}, {}], cho_nguoi: [],
  day: [{ id: 'P3', hang: 't173', tien_do: 'dang' }], cho_may: null, day_cua_cwd: null, mui_gio_phut: 420, ...them,
});
const MA_TRAN_DAI = [
  ['(a)', { dot: null }, {}, (s) => s === null, 'null'],
  ['(b)', { loi: 'thoát 1' }, {}, (s) => s === 'khung: không đọc được đợt', 'khung: không đọc được đợt'],
  ['(c)', { dot: 'sau-14-10', pha: 'dang-chay', chua_co_nhip: true }, {}, (s) => s === 'Đợt sau-14-10 · dang-chay · chưa có nhịp', 'Đợt sau-14-10 · dang-chay · chưa có nhịp'],
  ['(d)', goc(), {}, (s) => s.includes('S4: P5 → 07:47'), 'chứa S4: P5 → 07:47'],
  ['(e)', goc({ khoa: [] }), {}, (s) => s.includes('S4: trống'), 'chứa S4: trống'],
  ['(f)', goc({ khoa: [], cho_may: 'kho-khac' }), {}, (s) => s.includes('S4: chờ khoá máy'), 'chứa S4: chờ khoá máy'],
  ['(g)', goc({ giam_tai: true }), {}, (s) => s.startsWith('GIẢM TẢI · '), 'mở đầu GIẢM TẢI · '],
  ['(h)', goc({ day_cua_cwd: 'P3' }), {}, (s) => s.endsWith(' · Dãy P3: t173 · dang'), 'kết thúc · Dãy P3: t173 · dang'],
  ['(i)', goc(), { cot: 40 }, (s) => s.length === 40 && s.endsWith('…'), 'dài 40, cuối …'],
  ['(j)', goc({ cho_nguoi: [{}, {}], can_nguoi: 'RSS 9 GB' }), {}, (s) => s.includes('cần anh 3'), 'chứa cần anh 3'],
  ['(k)', goc({ mui_gio_phut: 0 }), {}, (s) => s.includes('S4: P5 → 00:47'), 'chứa S4: P5 → 00:47'],
  ['(l)', goc({ mui_gio_phut: -300 }), {}, (s) => s.includes('S4: P5 → 19:47'), 'chứa S4: P5 → 19:47'],
];

async function kiemVeDai(gocGoi) {
  const loi = [];
  const { veDai } = await nap(gocGoi, 'khung.mjs');
  const { chuXem, veXem } = await nap(gocGoi, 'mo-hinh.mjs');
  let n = 0;
  for (const [ten, kq, tuy, dat, mo] of MA_TRAN_DAI) {
    n += 1;
    let s;
    try {
      s = veDai(kq, tuy);
    } catch (e) {
      s = `ném: ${e.message}`;
    }
    if (!(s !== undefined && (s === null ? dat(null) : typeof s === 'string' && dat(s)))) loi.push(`${ten}: «${s}» — mong ${mo}`);
  }
  const coNhip = goc();
  const MA_TRAN_XEM = [
    ['(m)', { dot: null }, 'không có đợt nào đang chạy'],
    ['(n)', { dot: 'sau-14-10', pha: 'dang-chay', chua_co_nhip: true, canh_bao: null }, 'chưa có nhịp nào · pha dang-chay'],
    ['(o)', { ...coNhip, trang_thai: 'dang-chay', nhip_cuoi: 'x', canh_bao: null }, null],
    ['(p)', { ...coNhip, trang_thai: 'dang-chay', nhip_cuoi: 'x', canh_bao: 'cảnh báo: hai bản' }, null],
  ];
  for (const [ten, kq, mong] of MA_TRAN_XEM) {
    n += 1;
    const s = chuXem(kq);
    const m = ten === '(o)' ? veXem(kq) : ten === '(p)' ? `${veXem(kq)}\ncảnh báo: hai bản` : mong;
    if (s !== m) loi.push(`${ten}: «${s}» ≠ «${m}»`);
  }
  console.log(`  KH-04 số assert ma trận: ${n}`);
  // Review Focus 2 và 5: cột quá hẹp, hạn khoá không phải ngày.
  const hep = veDai(goc(), { cot: 3 });
  if (!(typeof hep === 'string' && hep.length <= 3)) loi.push(`(phụ) cột 3: «${hep}»`);
  const khongHan = veDai(goc({ khoa: [{ tai_nguyen: 's4', phien: 'P5', han: null }] }));
  if (!(khongHan.includes('S4: P5') && !khongHan.includes('NaN'))) loi.push(`(phụ) hạn vắng: «${khongHan}»`);
  return loi;
}

// Round-trip dải: đầu vào là stdout THẬT của `xem --json` trên kho thử; dòng mong đợi viết TRỌN tay (8 đơn chờ,
// 0 việc chờ người đếm tay từ trang-thai.json của fixture).
const R1 = 'Đợt sau-14-10 · dang-chay · S4: P5 → 07:47 · chờ lượt 8 · cần anh 0';
async function kiemRoundTripDai(gocGoi) {
  const loi = [];
  const { veDai } = await nap(gocGoi, 'khung.mjs');
  const wt3 = (kho) => path.join(kho, '.claude', 'worktrees', 'wt-3');
  const hang = [
    ['(R1)', () => khoDot().kho, R1],
    ['(R2)', () => wt3(khoDot().kho), `${R1} · Dãy P3: t173 · dang`],
    ['(R3)', () => khoDot({ nhip: false }).kho, 'Đợt sau-14-10 · dang-chay · chưa có nhịp'],
    ['(R4)', () => khoDot({ sua: (tt) => ({ ...tt, trang_thai: 'giam-tai' }) }).kho, `GIẢM TẢI · ${R1}`],
    ['(R5)', () => khoDot({ sua: (tt) => ({ ...tt, khoa: [], cho_may: 'kho-khac' }) }).kho, 'Đợt sau-14-10 · dang-chay · S4: chờ khoá máy · chờ lượt 8 · cần anh 0'],
  ];
  for (const [ten, cwd, mong] of hang) {
    const r = chayCli(GOI, cwd(), ['xem', '--json']);
    const s = r.ma === 0 ? veDai(JSON.parse(r.out)) : `CLI mã ${r.ma}`;
    if (s !== mong) loi.push(`${ten}: «${s}» ≠ «${mong}»`);
  }
  console.log(`  KH-04 số assert round-trip dải: ${hang.length}`);
  return loi;
}

test('KH-04 ve-dai', async () => {
  assert.deepEqual(await kiemVeDai(GOI), []);
});

test('KH-04 round-trip-dai', async () => {
  assert.deepEqual(await kiemRoundTripDai(GOI), []);
});

test('KH-04 round-trip-xem', async () => {
  const { chuXem } = await nap(GOI, 'mo-hinh.mjs');
  const loi = [];
  const hang = [
    ['(R6) có nhịp', khoDot().kho],
    ['(R7) chưa có nhịp', khoDot({ nhip: false }).kho],
    ['(R8) có cảnh báo', khoDot({ canhBao: true }).kho],
  ];
  for (const [ten, kho] of hang) {
    const j = chayCli(GOI, kho, ['xem', '--json']);
    const x = chayCli(GOI, kho, ['xem']);
    if (chuXem(JSON.parse(j.out)) !== x.out.replace(/\n$/, '')) loi.push(`${ten}: chuXem ≠ stdout của xem`);
  }
  const khong = khoGit();
  const x = chayCli(GOI, khong, ['xem']);
  if (`dieu-phoi: ${chuXem({ dot: null })}` !== x.err.replace(/\n$/, '')) loi.push(`(R9) không đợt: «${x.err.trim()}»`);
  console.log('  KH-04 số assert round-trip xem: 4');
  assert.deepEqual(loi, []);
});

test('KH-04 khung-khong-import', () => {
  const nguon = fs.readFileSync(path.join(GOI, 'scripts', 'khung.mjs'), 'utf8');
  assert.ok(!/^\s*import\b/m.test(nguon), 'khung.mjs có dòng import');
});

// Ca đỏ: bản sao khung.mjs bị tiêm, chạy lại CHÍNH phép đo.
test('KH-04-do bo-giam-tai', async () => {
  const sao = banSao('khung.mjs', 'if (kq.giam_tai) s = `GIẢM TẢI · ${s}`;', '');
  const loi = [...(await kiemVeDai(sao)), ...(await kiemRoundTripDai(sao))];
  assert.ok(loi.some((l) => l.startsWith('(g)')) && loi.some((l) => l.startsWith('(R4)')), loi.join(' | '));
});

test('KH-04-do sai-khoa-cho', async () => {
  const sao = banSao('khung.mjs', 'chờ lượt ${(kq.hang_cho ?? []).length}', 'chờ lượt ${(kq.cho_nguoi ?? []).length}');
  const loi = await kiemRoundTripDai(sao);
  assert.ok(loi.some((l) => l.startsWith('(R1)')), loi.join(' | '));
});

test('KH-04-do gio-may', async () => {
  const sao = banSao('khung.mjs', 'const d = new Date(ms + (Number(lechPhut) || 0) * 60000);', 'const d = new Date(ms); d.getUTCHours = d.getHours; d.getUTCMinutes = d.getMinutes;');
  const loi = await kiemVeDai(sao);
  assert.ok(loi.some((l) => l.startsWith('(k)') || l.startsWith('(l)')), loi.join(' | '));
});
