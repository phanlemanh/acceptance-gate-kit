// Hồ sơ khung-dot-dinh-vi (ADR 0027 bước a–b) — ca KD-1…KD-9: câu giám sát chờ chủ kho (lệnh `hoi`/`hoi-xong`), bộ đếm
// «cần anh» một hàm, khung định vị (`chuKhung`, `xem --khung`, `xem --json --khung`), `xem`/`xem --json` không đổi byte.
// Kho thử do code sinh: kho git tạm + đợt chép từ fixture dot-crm-0910 (cùng cách dựng của khung.test.mjs); câu giám sát
// ghi bằng CLI thật; tệp chờ người do hook thật ghi rồi bộ phát lịch thật dựng trạng thái. Mỗi phép đo là một hàm trả
// danh sách lỗi trên MỘT gốc gói, nên ca đỏ chạy CHÍNH phép đo đó trên bản sao trọn thư mục dieu-phoi bị tiêm, sau khi
// gói thật xanh trên cùng fixture, và bước tiêm phải áp được.
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
const LO_TRINH_KIT = path.join(KIT, 'docs', 'plans', 'lo-trinh-kit.json');
// Bản cũ của AC-4 và AC-9: đỉnh nhánh chính khi hồ sơ mở — commit cố định, không merge-base sống.
const BAN_CU = '4918210d';
const TZ = 'Asia/Ho_Chi_Minh';
const DAI_CHUAN = 'Đợt sau-14-10 · dang-chay · S4: P5 → 07:47 · chờ lượt 8 · cần anh';

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
const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT' && k !== 'DIEU_PHOI_NOW_MS'));
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, env: ENV, stdio: ['ignore', 'pipe', 'ignore'] });

function khoGit() {
  const kho = tam('kd-kho-');
  git(kho, 'init', '-q', '-b', 'main');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  return kho;
}

// Đợt «sau-14-10» chép từ fixture. `nhip: false` bỏ trang-thai.json; `sua(tt)` đổi trạng thái; `suaHv(hv)` đổi
// hang-viec.json; `suaCfg(cfg)` đổi cấu hình đợt; `canhBao` thêm settings còn hook bản cũ; `loTrinh` = {tep: object}
// ghi các tệp lộ trình vào kho thử (đường tương đối gốc kho).
function khoDot({ nhip = true, sua = null, suaHv = null, suaCfg = null, canhBao = false, loTrinh = {} } = {}) {
  const kho = khoGit();
  const dot = path.join(kho, '.acceptance-runs', 'dieu-phoi-sau-14-10');
  fs.cpSync(FIXTURE, dot, { recursive: true });
  const tatCa = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? tatCa(path.join(d, e.name)) : [path.join(d, e.name)]));
  for (const p of tatCa(dot)) {
    const t = fs.readFileSync(p, 'utf8');
    if (t.includes('@KHO@')) fs.writeFileSync(p, t.split('@KHO@').join(kho));
  }
  for (const d of docJ(path.join(dot, 'hang-viec.json')).day) if (path.isAbsolute(d.worktree)) fs.mkdirSync(d.worktree, { recursive: true });
  const pTt = path.join(dot, 'trang-thai.json');
  if (!nhip) fs.rmSync(pTt);
  else if (sua) ghiJ(pTt, sua(docJ(pTt)));
  if (suaHv) ghiJ(path.join(dot, 'hang-viec.json'), suaHv(docJ(path.join(dot, 'hang-viec.json'))));
  if (suaCfg) ghiJ(path.join(dot, 'dieu-phoi.config.json'), suaCfg(docJ(path.join(dot, 'dieu-phoi.config.json'))));
  for (const [tep, du] of Object.entries(loTrinh)) {
    fs.mkdirSync(path.dirname(path.join(kho, tep)), { recursive: true });
    ghiJ(path.join(kho, tep), du);
  }
  if (canhBao) {
    fs.mkdirSync(path.join(kho, '.claude'), { recursive: true });
    ghiJ(path.join(kho, '.claude', 'settings.json'), { hooks: { PostToolUse: [{ matcher: '*', hooks: [{ type: 'command', command: 'node scripts/dieu-phoi/hook-nhip.mjs' }] }] } });
  }
  fs.symlinkSync(dot, path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  return { kho, dot: fs.realpathSync(dot) };
}

const chayCli = (gocGoi, cwd, doiSo, { nowMs = null, input = undefined } = {}) => {
  const env = { ...ENV, TZ };
  if (nowMs != null) env.DIEU_PHOI_NOW_MS = String(nowMs);
  const r = spawnSync(process.execPath, [path.join(gocGoi, 'scripts', 'dieu-phoi.mjs'), ...doiSo], { cwd, env, encoding: 'utf8', input });
  return { ma: r.status, out: r.stdout, err: r.stderr };
};
const nap = (gocGoi, tep) => import(`${pathToFileURL(path.join(gocGoi, 'scripts', tep)).href}?v=${Math.random()}`);
const suKienTho = (dot) => (fs.existsSync(path.join(dot, 'su-kien.jsonl')) ? fs.readFileSync(path.join(dot, 'su-kien.jsonl'), 'utf8') : '');
const suKien = (dot) => suKienTho(dot).split('\n').filter(Boolean).map((d) => JSON.parse(d));

// Bản sao TRỌN thư mục gói với các chỗ tiêm [tệp, cũ, mới]; ném khi chuỗi cần thay không có (bước tiêm phải áp được).
function banSao(...tiem) {
  const sao = path.join(tam('kd-goi-'), 'dieu-phoi');
  fs.cpSync(GOI, sao, { recursive: true });
  for (const [tep, cu, moi] of tiem) {
    const p = path.join(sao, 'scripts', tep);
    const goc = fs.readFileSync(p, 'utf8');
    if (!goc.includes(cu)) throw new Error(`bước tiêm không áp được vào ${tep}: ${cu.slice(0, 60)}`);
    fs.writeFileSync(p, goc.replace(cu, moi));
  }
  return sao;
}

let banCu = null;
function layBanCu() {
  if (banCu) return banCu;
  const d = tam('kd-cu-');
  const tar = execFileSync('git', ['-C', KIT, 'archive', BAN_CU, 'dieu-phoi'], { env: ENV, maxBuffer: 64 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  banCu = path.join(d, 'dieu-phoi');
  return banCu;
}

// Bộ phát lịch thật, một nhịp, với io giả của máy (cùng khuôn ioGia của doi-tai-khoan.test). `gop` = slug đã gộp.
const ioGia = (nowMs, gop = []) => ({
  nowMs: () => nowMs,
  chay: (cmd, args = []) => {
    if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 0.00M  free = 1.00M';
    if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
    if (cmd === 'sysctl') return '{ 1.00 1.00 1.00 }';
    if (cmd === 'ps') return '102400 node\n';
    if (cmd === 'gh') return '[]';
    if (cmd === 'git' && args[0] === 'show') {
      const s = gop.find((x) => String(args[1]).includes(`_acceptance/${x}/contract.md`));
      if (s) return '---\nstatus: signed-off\n---\n';
      throw new Error('khong co');
    }
    return '';
  },
});
async function motNhip(gocGoi, dot, nowMs, gop = []) {
  const { taoVong } = await nap(gocGoi, 'phat-lich.mjs');
  await taoVong(dot, ioGia(nowMs, gop), () => nowMs)();
}
// Hook chờ người THẬT, lệnh rút từ hooks.json của gói.
function hookChoNguoi(gocGoi, cwd, loai) {
  const hj = docJ(path.join(gocGoi, 'hooks', 'hooks.json'));
  const lenh = hj.hooks.Notification[0].hooks[0].command.split('${CLAUDE_PLUGIN_ROOT}').join(gocGoi);
  return spawnSync('sh', ['-c', lenh], { cwd, env: ENV, input: JSON.stringify({ cwd, hook_event_name: 'Notification', notification_type: loai, message: 'Claude needs your permission' }), encoding: 'utf8' });
}
const chup = (dot) => Date.parse(docJ(path.join(dot, 'trang-thai.json')).nhip_cuoi);

// Lệnh lọc của Monitor giám sát, rút NGUYÊN VĂN từ README của gói.
function locMonitor() {
  const m = fs.readFileSync(path.join(GOI, 'README.md'), 'utf8').match(/grep --line-buffered '([^']+)'/);
  if (!m) throw new Error('README không còn lệnh lọc Monitor');
  return m[1];
}
const dongLot = (dot) => {
  const r = spawnSync('grep', ['--line-buffered', locMonitor(), path.join(dot, 'su-kien.jsonl')], { encoding: 'utf8' });
  return r.stdout.split('\n').filter(Boolean);
};

// ---------- KD-1 · AC-1 ----------
async function kiemGhiHoi(gocGoi) {
  const loi = [];
  const { kho, dot } = khoDot();
  const a = chayCli(gocGoi, kho, ['hoi', '--cau', 'Xác nhận chẩn đoán thước VK8 gãy vì VK6', '--phien', 'gs-1']);
  const CAU_B = "Câu có 'nháy' $HOME và `backtick` — xong chưa?";
  const b = chayCli(gocGoi, kho, ['hoi', '--cau', '-'], { input: CAU_B });
  const id = (r) => (r.ma === 0 ? (r.out.match(/^hoi: (h-\S+)\n$/) ?? [])[1] : undefined);
  if (!id(a)) loi.push(`hoi đối số: mã ${a.ma} «${a.out.trim()}» ${a.err.trim()}`);
  if (!id(b)) loi.push(`hoi stdin: mã ${b.ma} «${b.out.trim()}» ${b.err.trim()}`);
  const hoi = suKien(dot).filter((e) => e.loai === 'hoi-chu-kho');
  if (hoi.length !== 2) loi.push(`sổ có ${hoi.length} dòng hoi-chu-kho, mong 2`);
  const mong = [[id(a), 'Xác nhận chẩn đoán thước VK8 gãy vì VK6', 'gs-1'], [id(b), CAU_B, null]];
  mong.forEach(([i, cau, phien], k) => {
    const e = hoi[k];
    if (!e || e.id !== i || e.cau !== cau || e.phien !== phien || e.can_phan !== false) loi.push(`dòng ${k + 1}: ${JSON.stringify(e)}`);
  });
  // Đối chứng dương: một tệp chờ người do hook thật ghi → bộ phát lịch thật phát `cho-nguoi` mang can_phan:true.
  const t0 = chup(dot);
  await motNhip(gocGoi, dot, t0 + 60_000);
  hookChoNguoi(gocGoi, path.join(kho, '.claude', 'worktrees', 'wt-1'), 'permission_prompt');
  await motNhip(gocGoi, dot, t0 + 120_000);
  const lot = dongLot(dot);
  const lotHoi = lot.filter((d) => d.includes('"loai":"hoi-chu-kho"')).length;
  const lotCho = lot.filter((d) => d.includes('"loai":"cho-nguoi"')).length;
  console.log(`  KD-1 Monitor lọt: hoi-chu-kho ${lotHoi} · cho-nguoi ${lotCho}`);
  if (lotCho !== 1) loi.push(`đối chứng: Monitor lọt ${lotCho} dòng cho-nguoi, mong 1`);
  if (lotHoi !== 0) loi.push('Monitor lọt câu giám sát');
  const truoc = suKienTho(dot);
  const rong = chayCli(gocGoi, kho, ['hoi', '--cau', '']);
  if (rong.ma !== 2 || suKienTho(dot) !== truoc) loi.push(`câu rỗng: mã ${rong.ma}, sổ ${suKienTho(dot) === truoc ? 'không đổi' : 'ĐỔI'}`);
  return loi;
}
test('KD-1 ghi-cau-giam-sat', async () => {
  assert.deepEqual(await kiemGhiHoi(GOI), []);
});
test('KD-1-do monitor-lot', async () => {
  assert.deepEqual(await kiemGhiHoi(GOI), [], 'đối chứng dương: gói lành phải xanh');
  const sao = banSao(['hoi.mjs', 'phien, can_phan: false });\n  return id;', 'phien, can_phan: true });\n  return id;']);
  const loi = await kiemGhiHoi(sao);
  assert.ok(loi.includes('Monitor lọt câu giám sát'), `KD-1-do: ${loi.join(' | ')}`);
  console.log('  KD-1-do: Monitor lọt câu giám sát');
});

// ---------- KD-2 · AC-2 ----------
async function kiemDong(gocGoi) {
  const loi = [];
  const { kho, dot } = khoDot();
  const now = Date.parse('2026-10-28T07:00:00.000Z');
  const ia = chayCli(gocGoi, kho, ['hoi', '--cau', 'câu A'], { nowMs: now }).out.trim().replace(/^hoi: /, '');
  const ib = chayCli(gocGoi, kho, ['hoi', '--cau', 'câu B'], { nowMs: now }).out.trim().replace(/^hoi: /, '');
  if (!ia || ia === ib) loi.push(`hai câu cùng giây: «${ia}» «${ib}»`);
  const x = chayCli(gocGoi, kho, ['hoi-xong', ia]);
  const xong = suKien(dot).filter((e) => e.loai === 'hoi-chu-kho-xong');
  if (x.ma !== 0 || xong.length !== 1 || xong[0].id !== ia || xong[0].can_phan !== false) loi.push(`đóng câu mở: mã ${x.ma} ${JSON.stringify(xong)}`);
  const { hoiMo } = await nap(gocGoi, 'hoi.mjs');
  const mo = hoiMo(dot).map((h) => h.id);
  if (JSON.stringify(mo) !== JSON.stringify([ib])) loi.push(`câu mở sau khi đóng: ${JSON.stringify(mo)}`);
  for (const [ten, ma] of [['đóng hai lần', ia], ['mã chưa từng có', 'h-20261028T070000Z-99']]) {
    const truoc = suKienTho(dot);
    const r = chayCli(gocGoi, kho, ['hoi-xong', ma]);
    if (r.ma !== 2 || !r.err.includes(ma) || suKienTho(dot) !== truoc) loi.push(ten === 'mã chưa từng có' ? 'đóng mã lạ không bị từ chối' : `${ten}: mã ${r.ma} «${r.err.trim()}»`);
  }
  return loi;
}
test('KD-2 dong-cau', async () => {
  assert.deepEqual(await kiemDong(GOI), []);
});
test('KD-2-do dong-ma-la', async () => {
  assert.deepEqual(await kiemDong(GOI), [], 'đối chứng dương: gói lành phải xanh');
  const sao = banSao(['hoi.mjs', 'if (!hoiMo(thuMuc).some((h) => h.id === id)) throw', 'if (false) throw']);
  const loi = await kiemDong(sao);
  assert.ok(loi.includes('đóng mã lạ không bị từ chối'), `KD-2-do: ${loi.join(' | ')}`);
  console.log('  KD-2-do: đóng mã lạ không bị từ chối');
});

// ---------- KD-3 · AC-3 ----------
// Dải và khung đọc stdout THẬT của `xem --json --khung`; dòng dải mong đợi viết TRỌN tay.
const soDai = (s) => Number((String(s).match(/cần anh (\d+)$/) ?? [])[1]);
const soKhung = (k) => Number((String(k).match(/^CẦN ANH: (\d+)$/m) ?? [])[1]);
async function kiemDem(gocGoi) {
  const loi = [];
  const { veDai, chuKhung } = await nap(gocGoi, 'khung.mjs');
  const { kho, dot } = khoDot();
  const t0 = Date.parse('2026-10-28T04:00:00.000Z');
  const ba = t0 + 3 * 3600_000;
  const id = chayCli(gocGoi, kho, ['hoi', '--cau', 'Xác nhận chẩn đoán thước VK8 gãy vì VK6'], { nowMs: t0 }).out.trim().replace(/^hoi: /, '');
  const doc = () => {
    const r = chayCli(gocGoi, kho, ['xem', '--json', '--khung']);
    if (r.ma !== 0) throw new Error(`xem --json --khung mã ${r.ma}: ${r.err}`);
    return JSON.parse(r.out);
  };
  let kq = doc();
  let dai = veDai(kq);
  let khung = chuKhung(kq, { bayGio: ba });
  if (dai !== `${DAI_CHUAN} 1`) loi.push(`cần anh ${soDai(dai)} khi sổ còn 1 câu treo`);
  if (soKhung(khung) !== 1) loi.push(`khung CẦN ANH ${soKhung(khung)} khi sổ còn 1 câu treo`);
  const dongCau = khung.split('\n').find((d) => d.includes('Xác nhận chẩn đoán thước VK8 gãy vì VK6'));
  if (!dongCau || !dongCau.includes('— ở phiên giám sát')) loi.push(`dòng câu giám sát: «${dongCau}»`);
  else if (!dongCau.endsWith('— 3 giờ trước')) loi.push('câu treo không có tuổi');
  // Thêm tệp chờ người do hook thật ghi + lời báo sức khoẻ, qua bộ phát lịch thật.
  const tc = chup(dot);
  await motNhip(gocGoi, dot, tc + 60_000);
  hookChoNguoi(gocGoi, path.join(kho, '.claude', 'worktrees', 'wt-1'), 'permission_prompt');
  await motNhip(gocGoi, dot, tc + 120_000);
  const pTt = path.join(dot, 'trang-thai.json');
  ghiJ(pTt, { ...docJ(pTt), suc_khoe: { ...docJ(pTt).suc_khoe, canNguoi: 'RSS 9 GB ở một tiến trình' } });
  kq = doc();
  dai = veDai(kq);
  khung = chuKhung(kq, { bayGio: ba });
  if (soDai(dai) !== 3 || soKhung(khung) !== 3) loi.push(`ba nguồn: dải ${soDai(dai)} · khung ${soKhung(khung)}, mong 3`);
  chayCli(gocGoi, kho, ['hoi-xong', id]);
  kq = doc();
  dai = veDai(kq);
  khung = chuKhung(kq, { bayGio: ba });
  if (soDai(dai) !== 2 || soKhung(khung) !== 2) loi.push(`sau khi đóng: dải ${soDai(dai)} · khung ${soKhung(khung)}, mong 2`);
  console.log(`  KD-3 số assert: 6 · dải cuối «${dai}»`);
  return loi;
}
test('KD-3 dem-can-anh', async () => {
  assert.deepEqual(await kiemDem(GOI), []);
});
test('KD-3-do cau-treo-khong-dem', async () => {
  assert.deepEqual(await kiemDem(GOI), [], 'đối chứng dương: gói lành phải xanh');
  const sao = banSao(['khung.mjs', 'for (const h of kq.hoi_chu_kho ?? []) ra.push', 'for (const h of [] ?? []) ra.push']);
  const loi = await kiemDem(sao);
  assert.ok(loi.includes('cần anh 0 khi sổ còn 1 câu treo'), `KD-3-do: ${loi.join(' | ')}`);
  console.log('  KD-3-do: cần anh 0 khi sổ còn 1 câu treo');
});
test('KD-3-do2 cau-treo-khong-tuoi', async () => {
  const sao = banSao(['khung.mjs', "dong.push(`  · ${c.la_gi} — ở ${c.o}${t ? ` — ${t}` : ''}`);", 'dong.push(`  · ${c.la_gi} — ở ${c.o}`);']);
  const loi = await kiemDem(sao);
  assert.ok(loi.includes('câu treo không có tuổi'), `KD-3-do2: ${loi.join(' | ')}`);
  console.log('  KD-3-do2: câu treo không có tuổi');
});

// ---------- KD-4 · AC-4 ----------
// Kho thứ năm mang lộ trình THẬT của kit: mỗi dãy của fixture nhận một hàng lộ trình có mã (tep + ma), đợt khai mục
// tiêu, trạng thái có hàng đã gộp — đúng những thứ khung đọc, để phép so bắt được dữ liệu khung rò vào `xem --json`.
const TEP_KIT = 'docs/plans/lo-trinh-kit.json';
function khoLoTrinhKit({ mucTieu = 'Gom bảy hàng vỏ khu trước mốc 31/10', gop = true } = {}) {
  const lt = docJ(LO_TRINH_KIT);
  const hangLt = lt.hang.filter((h) => h.ma && h.slug);
  return khoDot({
    loTrinh: { [TEP_KIT]: lt },
    suaHv: (hv) => {
      const day = new Map(hv.day.map((d, i) => [d.id, hangLt[i]]));
      return { ...hv, ...(mucTieu ? { muc_tieu: mucTieu } : {}), hang: [...hv.hang.filter((h) => !day.has(h.day)), ...[...day].filter(([, r]) => r).map(([id, r]) => ({ ma: r.ma, slug: r.slug, tep: TEP_KIT, day: id }))] };
    },
    sua: (tt) => {
      const ds = docJ(LO_TRINH_KIT).hang.filter((h) => h.ma && h.slug);
      return { ...tt, day: tt.day.map((d, i) => ({ ...d, hang: ds[i]?.slug ?? d.hang })), ...(gop ? { gop_da_bao: [ds[0].slug, ds[1].slug] } : {}) };
    },
  });
}
function khoaThem(moi, cu, tien = '') {
  if (moi === null || typeof moi !== 'object') return [];
  if (Array.isArray(moi)) return moi.flatMap((x, i) => khoaThem(x, Array.isArray(cu) ? cu[i] : undefined, `${tien}[]`));
  return Object.keys(moi).flatMap((k) => (cu && typeof cu === 'object' && k in cu ? khoaThem(moi[k], cu[k], `${tien}${tien ? '.' : ''}${k}`) : [`${tien}${tien ? '.' : ''}${k}`]));
}
async function kiemKhongDoi(gocGoi) {
  const loi = [];
  const cu = layBanCu();
  const daiMoi = (await nap(gocGoi, 'khung.mjs')).veDai;
  const daiCu = (await nap(cu, 'khung.mjs')).veDai;
  const hang = [
    ['(a) có nhịp', khoDot().kho],
    ['(b) chưa có nhịp', khoDot({ nhip: false }).kho],
    ['(c) không đợt', khoGit()],
    ['(d) có cảnh báo', khoDot({ canhBao: true }).kho],
    ['(e) lộ trình thật', khoLoTrinhKit().kho],
  ];
  for (const [ten, kho] of hang) {
    for (const lenh of [['xem'], ['xem', '--json']]) {
      const moi = chayCli(gocGoi, kho, lenh);
      const goc = chayCli(cu, kho, lenh);
      if (moi.ma === goc.ma && moi.out === goc.out && moi.err === goc.err) continue;
      let them = [];
      try {
        them = [...new Set(khoaThem(JSON.parse(moi.out), JSON.parse(goc.out)))];
      } catch {}
      loi.push(lenh.length === 2 ? (them.length ? `${ten}: xem --json đổi byte: ${them.join(', ')}` : `${ten}: xem --json đổi byte khi không có câu`) : `${ten}: xem đổi byte`);
    }
    const j = chayCli(gocGoi, kho, ['xem', '--json']);
    if (j.ma === 0 && daiMoi(JSON.parse(j.out)) !== daiCu(JSON.parse(chayCli(cu, kho, ['xem', '--json']).out))) loi.push(`${ten}: dải đổi`);
  }
  console.log(`  KD-4 số assert: ${hang.length * 3}`);
  // Đối chứng: một câu treo làm `xem --json` khác bản cũ; kho lộ trình thật có tên việc trên khung.
  const { kho: kA } = khoDot();
  chayCli(gocGoi, kA, ['hoi', '--cau', 'câu thử']);
  if (chayCli(gocGoi, kA, ['xem', '--json']).out === chayCli(cu, kA, ['xem', '--json']).out) loi.push('đối chứng: câu treo không làm xem --json khác');
  const { kho: kE } = khoLoTrinhKit();
  const kq = JSON.parse(chayCli(gocGoi, kE, ['xem', '--json', '--khung']).out || '{}');
  const ten0 = docJ(LO_TRINH_KIT).hang.find((h) => h.ma && h.slug);
  const { chuKhung } = await nap(gocGoi, 'khung.mjs');
  if (!chuKhung(kq, { bayGio: Date.now() }).includes(`(${ten0.ma}) ·`)) loi.push(`đối chứng: khung kho lộ trình thật không có việc mang mã ${ten0.ma}`);
  return loi;
}
test('KD-4 xem-khong-doi', async () => {
  assert.deepEqual(await kiemKhongDoi(GOI), []);
});
test('KD-4-do khoa-rong', async () => {
  assert.deepEqual(await kiemKhongDoi(GOI), [], 'đối chứng dương: gói lành phải xanh');
  const sao = banSao(['dieu-phoi.mjs', '...(hoi.length ? { hoi_chu_kho: hoi } : {})', 'hoi_chu_kho: hoi']);
  const loi = await kiemKhongDoi(sao);
  assert.ok(loi.some((l) => l.startsWith('(a)') && l.includes('xem --json đổi byte') && l.includes('hoi_chu_kho')), `KD-4-do: ${loi.join(' | ')}`);
  console.log('  KD-4-do: xem --json đổi byte khi không có câu');
});
test('KD-4-do2 ten-ro-vao-xem-json', async () => {
  const sao = banSao(['dieu-phoi.mjs', 'const khungKhoa = khung ?', 'const khungKhoa = true ?']);
  const loi = await kiemKhongDoi(sao);
  assert.ok(loi.some((l) => l.startsWith('(e)') && /xem --json đổi byte: .*\bten\b/.test(l)), `KD-4-do2: ${loi.join(' | ')}`);
  console.log('  KD-4-do2: xem --json đổi byte: ten');
});

// ---------- KD-5 · AC-5 ----------
// Trạng thái phủ mọi giá trị tiến độ, một dãy nghỉ, đợt chưa khai mục tiêu (cờ vàng).
function khoMoiTrangThai() {
  const tienDo = ['dang', 'chua', 'ky', 'gop', 'xong', 'cho', 'dang', 'dang', 'dang'];
  return khoDot({
    sua: (tt) => ({ ...tt, day: tt.day.map((d, i) => ({ ...d, tien_do: tienDo[i], hang: tienDo[i] === 'xong' ? null : d.hang })) }),
    suaHv: (hv) => ({ ...hv, day: hv.day.map((d) => (d.id === 'P8' ? { ...d, nghi: true } : d)) }),
  });
}
// Chữ cấm do code sinh: mọi khoá (đệ quy) của object `xem --json --khung` thật + giá trị trạng thái rút từ bảng nguồn
// của gói. Loại trừ đóng hai từ cũng là chữ Việt.
const LOAI_TRU = ['xong', 'cho'];
async function chuCam(gocGoi, kqs) {
  const khoa = new Set();
  const di = (o) => {
    if (Array.isArray(o)) o.forEach(di);
    else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) {
      khoa.add(k);
      di(v);
    }
  };
  kqs.forEach(di);
  const { TIEN_DO, LOAI_CHO } = await nap(gocGoi, 'khung.mjs');
  const { PHA } = await nap(gocGoi, 'pha.mjs');
  const gia = [...Object.keys(TIEN_DO ?? {}), ...Object.keys(LOAI_CHO ?? {}), 'dang-chay', 'giam-tai', 'can-nguoi', ...(PHA ?? [])];
  return [...new Set([...khoa, ...gia])].filter((w) => !LOAI_TRU.includes(w));
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const timChuCam = (chu, cam) => [...cam.filter((w) => new RegExp(`(^|[^\\p{L}\\p{N}_])${esc(w)}($|[^\\p{L}\\p{N}_])`, 'u').test(chu)), ...(chu.includes('khoá s4:') ? ['khoá s4:'] : [])];
async function kiemKhung(gocGoi) {
  const loi = [];
  const { chuKhung } = await nap(gocGoi, 'khung.mjs');
  const { kho } = khoMoiTrangThai();
  const now = Date.parse('2026-10-10T01:00:00.000Z');
  const kq = JSON.parse(chayCli(gocGoi, kho, ['xem', '--json', '--khung']).out || '{}');
  const khung = chuKhung(kq, { bayGio: now });
  const dong = khung.split('\n');
  if (!dong[0]?.startsWith('Đợt sau-14-10 — ')) loi.push('khung in chữ xem');
  if (!dong[1]?.startsWith('Tiến độ: xong ')) loi.push(`dòng 2: «${dong[1]}»`);
  if (!dong[2]?.startsWith('CẦN ANH: ')) loi.push(`dòng 3: «${dong[2]}»`);
  const iViec = dong.indexOf('Việc:');
  const viec = iViec > 2 ? dong.slice(iViec + 1).filter((d) => d.startsWith('  ')) : [];
  const ids = docJ(path.join(FIXTURE, 'trang-thai.json')).day.map((d) => d.id).filter((x) => x !== 'P8');
  if (JSON.stringify(viec.map((d) => d.split(' · ')[0].trim())) !== JSON.stringify(ids)) loi.push(`dòng việc: ${JSON.stringify(viec.map((d) => d.split(' · ')[0]))}`);
  const x = chayCli(gocGoi, kho, ['xem', '--khung'], { nowMs: now });
  if (x.out.replace(/\n$/, '') !== khung) loi.push('xem --khung khác chuKhung');
  const cam = await chuCam(gocGoi, [kq, JSON.parse(chayCli(gocGoi, khoLoTrinhKit().kho, ['xem', '--json', '--khung']).out || '{}')]);
  for (const w of timChuCam(khung, cam)) loi.push(`khung in chữ máy: ${w}`);
  // Đối chứng dương: quét bắt chuỗi tiêm.
  const tiem = timChuCam(`${khung}\nx hang_cho y dang-chay`, cam);
  if (!(tiem.includes('hang_cho') && tiem.includes('dang-chay'))) loi.push(`đối chứng: quét không bắt chuỗi tiêm (${tiem.join(',')})`);
  console.log(`  KD-5 chữ cấm sinh: ${cam.length} · loại trừ: ${LOAI_TRU.join(', ')}`);
  return loi;
}
test('KD-5 khung-dinh-vi', async () => {
  assert.deepEqual(await kiemKhung(GOI), []);
});
test('KD-5-do khung-in-chu-xem', async () => {
  assert.deepEqual(await kiemKhung(GOI), [], 'đối chứng dương: gói lành phải xanh');
  const sao = banSao(['khung.mjs', 'export function chuKhung(kq, { bayGio = Number.isFinite(kq?.bay_gio) ? kq.bay_gio : Date.now() } = {}) {\n', "import { chuXem as __y } from './mo-hinh.mjs';\nexport function chuKhung(kq, { bayGio = Date.now() } = {}) {\n  if (kq && kq.dot) return __y(kq);\n"]);
  const loi = await kiemKhung(sao);
  assert.ok(loi.includes('khung in chữ xem'), `KD-5-do: ${loi.join(' | ')}`);
  console.log('  KD-5-do: khung in chữ xem');
});
test('KD-5-do2 khung-in-chu-may', async () => {
  const sao = banSao(['khung.mjs', "TIEN_DO[d.tien_do] ?? (d.hang ? 'đang làm' : 'rảnh')", 'd.tien_do']);
  const loi = await kiemKhung(sao);
  assert.ok(loi.includes('khung in chữ máy: dang'), `KD-5-do2: ${loi.join(' | ')}`);
  console.log('  KD-5-do2: khung in chữ máy: dang');
});

// ---------- KD-6 · AC-6 ----------
// Lộ trình tạm do code sinh: K3c có ten_ngan, V2d chỉ ten, E6 chỉ câu giao dài; hàng thi công mang tep + ma; hàng
// của P8 bỏ mã. Tên mong đợi viết tay.
const TEP_TAM = 'docs/plans/lo-trinh-tam.json';
const CAU_DAI = 'Bảng quyết định của đợt ghi đủ người quyết lúc quyết và đường đảo của từng mục';
function khoTen({ coLoTrinh = true } = {}) {
  const lt = { schema: 1, ten: 'tạm', hang: [{ ma: 'K3c', ten_ngan: 'Vỏ khu Mục tiêu', cau_giao: 'x' }, { ma: 'V2d', ten: 'Sổ quyết định đợt', cau_giao: 'y' }, { ma: 'E6', cau_giao: CAU_DAI }] };
  return khoDot({
    loTrinh: coLoTrinh ? { [TEP_TAM]: lt } : {},
    suaHv: (hv) => ({ ...hv, hang: hv.hang.map((h) => (['K3c', 'V2d', 'E6'].includes(h.ma) ? { ...h, tep: TEP_TAM } : h.slug === 't581' ? { slug: h.slug, day: h.day } : h)) }),
    sua: (tt) => ({ ...tt, cho_nguoi: [{ phien: 'P1', loai: 'permission_prompt', tin: 'x', luc: '2026-10-10T00:20:00.000Z', link: 'claude://x/9' }] }),
  });
}
const MA_TRAN = /^[A-Za-z0-9._-]+$/;
function quetChiMa(khung) {
  const ra = [];
  const dong = khung.split('\n');
  const iViec = dong.indexOf('Việc:');
  for (const d of dong.slice(iViec + 1).filter((x) => x.startsWith('  '))) {
    const ten = d.split(' · ')[1]?.trim();
    if (ten && MA_TRAN.test(ten)) ra.push(`là gì chỉ có mã: ${ten}`);
  }
  for (const d of dong.filter((x) => x.startsWith('  · '))) {
    const ten = d.slice(4).split(' — ')[0].trim();
    if (MA_TRAN.test(ten)) ra.push(`là gì chỉ có mã: ${ten}`);
  }
  return ra;
}
async function kiemTen(gocGoi) {
  const loi = [];
  const { chuKhung } = await nap(gocGoi, 'khung.mjs');
  const doc = (kho) => chuKhung(JSON.parse(chayCli(gocGoi, kho, ['xem', '--json', '--khung']).out || '{}'), { bayGio: Date.parse('2026-10-10T01:00:00.000Z') });
  const khung = doc(khoTen().kho);
  const mong = [['P1', 'Vỏ khu Mục tiêu (K3c)'], ['P2', 'Sổ quyết định đợt (V2d)'], ['P3', 'Bảng quyết định của đợt ghi… (E6)'], ['P8', 't581 (chưa có tên trong lộ trình)'], ['P4', 'F10 (chưa có tên trong lộ trình)']];
  for (const [id, ten] of mong) if (!khung.split('\n').some((d) => d.startsWith(`  ${id} · ${ten} · `))) loi.push(`${id}: mong «${ten}»`);
  if (!khung.includes('  · Vỏ khu Mục tiêu (K3c) — xin quyền — ở dãy P1')) loi.push('CẦN ANH của P1 không mang tên việc');
  loi.push(...quetChiMa(khung));
  // Đối chứng: không lộ trình → mọi dòng mang cờ, vẫn không dòng nào chỉ có mã.
  const khong = doc(khoTen({ coLoTrinh: false }).kho);
  if (!khong.includes('  P1 · K3c (chưa có tên trong lộ trình) · ')) loi.push('đối chứng: P1 không lộ trình thiếu cờ');
  loi.push(...quetChiMa(khong).map((l) => `(không lộ trình) ${l}`));
  return loi;
}
test('KD-6 ten-viec', async () => {
  assert.deepEqual(await kiemTen(GOI), []);
});
test('KD-6-do chi-co-ma', async () => {
  assert.deepEqual(await kiemTen(GOI), [], 'đối chứng dương: gói lành phải xanh');
  const sao = banSao(['khung.mjs', "  if (d.ten) return d.ma ? `${d.ten} (${d.ma})` : d.ten;\n  return `${d.ma ?? d.hang} (chưa có tên trong lộ trình)`;", '  return d.ma ?? d.hang;']);
  const loi = await kiemTen(sao);
  assert.ok(loi.includes('là gì chỉ có mã: K3c'), `KD-6-do: ${loi.join(' | ')}`);
  console.log('  KD-6-do: là gì chỉ có mã: K3c');
});
// Round-trip trên bên viết thật: tệp lộ trình của kit (do các lượt cắt và phiên thật viết), nguồn hàng qua nguon_hang.
test('KD-6b ten-viec-lo-trinh-that', async () => {
  const lt = docJ(LO_TRINH_KIT);
  const coMa = lt.hang.filter((h) => h.ma);
  const { docTenViec } = await nap(GOI, 'nguon-hang.mjs');
  const kho = khoGit();
  fs.mkdirSync(path.join(kho, 'docs', 'plans'), { recursive: true });
  ghiJ(path.join(kho, TEP_KIT), lt);
  const hv = { dot: 'x', day: [{ id: 'P1', worktree: '/x' }], hang: coMa.map((h, i) => ({ ma: h.ma, slug: `s${i}`, day: 'P1' })) };
  const ten = docTenViec(kho, hv, coMa.map((h) => `${TEP_KIT}:${h.ma}`));
  const coTenNgan = coMa.filter((h) => h.ten_ngan).length;
  console.log(`  KD-6b: hàng có mã có ten_ngan ${coTenNgan}/${coMa.length} · có tên hiển thị ${ten.size}/${coMa.length}`);
  const thieu = coMa.filter((h, i) => !ten.get(`s${i}`) && (h.ten_ngan || h.ten || h.cau_giao)).map((h) => h.ma);
  assert.deepEqual(thieu, [], 'hàng có tên trong lộ trình mà khung không tra được');
  const { kho: kE } = khoLoTrinhKit();
  const { chuKhung } = await nap(GOI, 'khung.mjs');
  const khung = chuKhung(JSON.parse(chayCli(GOI, kE, ['xem', '--json', '--khung']).out), { bayGio: Date.now() });
  assert.deepEqual(quetChiMa(khung), []);
});

// ---------- KD-7 · AC-7 ----------
const BAY = Date.parse('2026-10-28T07:00:00.000Z');
const MA_TRAN_GIO = [
  ['20 giây', new Date(BAY - 20_000).toISOString(), 420, 'vừa xong'],
  ['5 phút', new Date(BAY - 5 * 60_000).toISOString(), 420, '5 phút trước'],
  ['3 giờ', new Date(BAY - 3 * 3600_000).toISOString(), 420, '3 giờ trước'],
  ['30 giờ', new Date(BAY - 30 * 3600_000).toISOString(), 420, 'hôm qua 08:00'],
  ['4 ngày', new Date(BAY - 4 * 86400_000).toISOString(), 420, '24/10 14:00'],
  ['hạn +420', '2026-10-28T07:47:30.085Z', 420, 'tới 14:47'],
  ['hạn 0', '2026-10-28T07:47:30.085Z', 0, 'tới 07:47'],
  ['hạn -300', '2026-10-28T07:47:30.085Z', -300, 'tới 02:47'],
];
async function kiemGio(gocGoi) {
  const loi = [];
  const { tuongDoi, chuKhung } = await nap(gocGoi, 'khung.mjs');
  for (const [ten, iso, lech, mong] of MA_TRAN_GIO) {
    const s = tuongDoi(iso, { bayGio: BAY, lechPhut: lech });
    if (s !== mong) loi.push(`${ten}: «${s}» ≠ «${mong}»`);
  }
  const { kho } = khoDot();
  chayCli(gocGoi, kho, ['hoi', '--cau', 'câu thử giờ']);
  const khung = chuKhung(JSON.parse(chayCli(gocGoi, kho, ['xem', '--json', '--khung']).out || '{}'), { bayGio: Date.now() });
  if ([/\d{4}-\d{2}-\d{2}T/, /\.\d{3}Z/, /\dZ\b/].some((re) => re.test(khung))) loi.push('khung in giờ ISO');
  console.log(`  KD-7 số assert ma trận: ${MA_TRAN_GIO.length} + quét khung`);
  return loi;
}
test('KD-7 gio-dia-phuong', async () => {
  assert.deepEqual(await kiemGio(GOI), []);
});
test('KD-7-do gio-iso', async () => {
  assert.deepEqual(await kiemGio(GOI), [], 'đối chứng dương: gói lành phải xanh');
  const sao = banSao(['khung.mjs', 'export function tuongDoi(iso, { bayGio, lechPhut = 0 } = {}) {\n', 'export function tuongDoi(iso, { bayGio, lechPhut = 0 } = {}) {\n  if (iso) return String(iso);\n']);
  const loi = await kiemGio(sao);
  assert.ok(loi.includes('khung in giờ ISO'), `KD-7-do: ${loi.join(' | ')}`);
  console.log('  KD-7-do: khung in giờ ISO');
});

// ---------- KD-8 · AC-8 ----------
// Ma trận viết trước: 8 dãy × nhóm mong đợi, trên object khung của kho thử rồi đổi các khối trạng thái.
const DAY_8 = [
  ['D1', { hang: 'a', tien_do: 'dang' }, 'đang chấm'],
  ['D2', { hang: 'b', tien_do: 'dang' }, 'chờ'],
  ['D3', { hang: 'c', tien_do: 'dang' }, 'chờ'],
  ['D4', { hang: 'd', tien_do: 'ky' }, 'chờ'],
  ['D5', { hang: null, tien_do: 'cho', cho: 'e' }, 'chờ'],
  ['D6', { hang: null, tien_do: 'xong' }, 'rảnh'],
  ['D7', { hang: 'g', tien_do: 'dang' }, 'đang làm'],
  ['D8', { hang: 'h', tien_do: 'dang', nghi: true }, null],
];
async function kiemNhom(gocGoi) {
  const loi = [];
  const { nhomDay, chuKhung } = await nap(gocGoi, 'khung.mjs');
  const goc = JSON.parse(chayCli(gocGoi, khoDot().kho, ['xem', '--json', '--khung']).out || '{}');
  const kq = {
    ...goc,
    day: DAY_8.map(([id, d]) => ({ id, ...d })),
    khoa: [{ tai_nguyen: 's4', phien: 'D1', han: '2026-10-10T00:47:30.085Z' }],
    cho_nguoi: [{ phien: 'D1', loai: 'idle_prompt', tin: 'x', luc: null }, { phien: 'D2', loai: 'permission_prompt', tin: 'x', luc: null }],
    hang_cho: [{ phien: 'D3', loai: 's4', luc: null, cho: null }],
    can_nguoi: null,
    hoi_chu_kho: undefined,
    so_hang: 9,
    da_gop: 2,
  };
  for (const [id, , mong] of DAY_8) {
    const n = nhomDay(kq.day.find((d) => d.id === id), kq);
    if (n !== mong) loi.push(id === 'D1' ? 'dãy giữ s4 không vào đang chấm' : `${id}: «${n}» ≠ «${mong}»`);
  }
  const tien = chuKhung(kq, { bayGio: Date.now() }).split('\n')[1];
  if (tien !== 'Tiến độ: xong 2/9 · đang làm 1 · đang chấm 1 · chờ 4 · rảnh 1') loi.push(`dòng tiến độ: «${tien}»`);
  console.log(`  KD-8 số assert: ${DAY_8.length + 1}`);
  return loi;
}
test('KD-8 tien-do', async () => {
  assert.deepEqual(await kiemNhom(GOI), []);
});
test('KD-8-do thu-tu-nhom', async () => {
  assert.deepEqual(await kiemNhom(GOI), [], 'đối chứng dương: gói lành phải xanh');
  const sao = banSao(
    ['khung.mjs', "  if ((kq.khoa ?? []).some((k) => k.tai_nguyen === 's4' && k.phien === d.id)) return 'đang chấm';\n", ''],
    ['khung.mjs', "  if (!d.hang) return 'rảnh';", "  if ((kq.khoa ?? []).some((k) => k.tai_nguyen === 's4' && k.phien === d.id)) return 'đang chấm';\n  if (!d.hang) return 'rảnh';"],
  );
  const loi = await kiemNhom(sao);
  assert.ok(loi.includes('dãy giữ s4 không vào đang chấm'), `KD-8-do: ${loi.join(' | ')}`);
  console.log('  KD-8-do: dãy giữ s4 không vào đang chấm');
});

// ---------- KD-9 · AC-9 ----------
async function kiemDocCu(gocGoi) {
  const loi = [];
  const { chuKhung } = await nap(gocGoi, 'khung.mjs');
  const { kiemHangViec } = await nap(gocGoi, 'hinh-dang.mjs');
  const { kho } = khoDot();
  const soHang = docJ(path.join(FIXTURE, 'hang-viec.json')).hang.length;
  // (a) stdout `xem --json` của bản cũ: không tên việc, không mục tiêu, không số hàng.
  let khung;
  try {
    khung = chuKhung(JSON.parse(chayCli(layBanCu(), kho, ['xem', '--json']).out), { bayGio: Date.now() });
  } catch (e) {
    loi.push(`(a) ném: ${e.message}`);
    khung = '';
  }
  const dong = khung.split('\n');
  for (const tien of ['Đợt ', 'Tiến độ: ', 'CẦN ANH: ', 'Việc:']) if (!dong.some((d) => d.startsWith(tien))) loi.push(`(a) thiếu khối «${tien.trim()}»`);
  if (!dong.some((d) => d.includes('chi tiết máy: /dieu-phoi:xem'))) loi.push('(a) thiếu dòng cuối');
  if (!dong[0]?.includes('⚠ chưa khai mục tiêu đợt')) loi.push('thiếu cờ mục tiêu');
  if (!dong[1]?.startsWith('Tiến độ: xong —/— ⚠')) loi.push(`(a) dòng tiến độ: «${dong[1]}»`);
  if (!dong.some((d) => d.includes('(chưa có tên trong lộ trình)'))) loi.push('(a) dòng việc thiếu cờ tên');
  // (b) trạng thái không gop_da_bao (fixture), bản mới → «xong —/<số hàng> ⚠».
  const b = chuKhung(JSON.parse(chayCli(gocGoi, kho, ['xem', '--json', '--khung']).out), { bayGio: Date.now() }).split('\n')[1];
  if (!b.startsWith(`Tiến độ: xong —/${soHang} ⚠`)) loi.push(`(b) «${b}»`);
  // (c) muc_tieu chuỗi; (d) muc_tieu sai kiểu.
  const { kho: kc, dot: dc } = khoDot({ suaHv: (hv) => ({ ...hv, muc_tieu: 'Gom bảy hàng vỏ khu' }) });
  const c = chuKhung(JSON.parse(chayCli(gocGoi, kc, ['xem', '--json', '--khung']).out), { bayGio: Date.now() }).split('\n')[0];
  if (c !== 'Đợt sau-14-10 — Gom bảy hàng vỏ khu') loi.push(`(c) «${c}»`);
  try {
    kiemHangViec(docJ(path.join(dc, 'hang-viec.json')));
  } catch (e) {
    loi.push(`(c) kiemHangViec từ chối muc_tieu chuỗi: ${e.message}`);
  }
  try {
    kiemHangViec({ ...docJ(path.join(dc, 'hang-viec.json')), muc_tieu: 7 });
    loi.push('(d) muc_tieu là số không bị từ chối');
  } catch (e) {
    if (!e.message.includes('muc_tieu')) loi.push(`(d) thông điệp không nêu muc_tieu: ${e.message}`);
  }
  return loi;
}
test('KD-9 doc-cu', async () => {
  assert.deepEqual(await kiemDocCu(GOI), []);
});
test('KD-9-do thieu-co-muc-tieu', async () => {
  assert.deepEqual(await kiemDocCu(GOI), [], 'đối chứng dương: gói lành phải xanh');
  const sao = banSao(['khung.mjs', '`${CO} chưa khai mục tiêu đợt`', "''"]);
  const loi = await kiemDocCu(sao);
  assert.ok(loi.includes('thiếu cờ mục tiêu'), `KD-9-do: ${loi.join(' | ')}`);
  console.log('  KD-9-do: thiếu cờ mục tiêu');
});
