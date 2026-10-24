// Ca đo của hồ sơ dieu-phoi-sua-truoc-dot-thu (năm lỗi CHẶN-THỬ của gói dieu-phoi). Tên ca bắt đầu «SDT-». Kho
// thử do mã sinh, có worktree LIÊN KẾT thật cho từng dãy; đợt dựng bằng `mo` thật từ gói đợt khai qua cấu hình;
// nhịp bộ phát lịch là `motNhip` thật (io giả chỉ cho sysctl/ps/`git show origin`); nhịp sống do hook thật ghi.
// Đường suy từ vị trí tệp. Mỗi ca đỏ chạy CHÍNH hàm đo trên bản sao bị tiêm, SAU khi bản lành xanh trên cùng
// fixture, kiểm bước tiêm đã áp, và ghim dấu hiệu của đúng lỗi được tiêm. Tệp tự mang hàm dựng kho như các tệp
// ca khác của gói (không nạp chéo tệp ca — nạp là chạy lại ca của tệp ấy).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DAY_TEP = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(DAY_TEP, '..', '..');
const GOI = path.join(KIT, 'dieu-phoi');
const SLUG = 'dieu-phoi-sua-truoc-dot-thu';
const NHANH = `vong/${SLUG}`;
// Trạng thái hợp đồng «đã thông Cổng Bằng chứng» rút từ lib của CÂY ĐANG KIỂM, không chép chữ (khuôn DP7).
const DA_KY = createRequire(import.meta.url)(path.join(KIT, 'lib', 'workspace-record.cjs')).DA_THONG_CONG_2[0];

// Khoá máy của ca nằm trong thư mục tạm — đặt TRƯỚC mọi lần nạp mô-đun của gói.
const MAY_TAM = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'sdt-may-')));
process.env.DIEU_PHOI_MAY_DIR = MAY_TAM;

const canDon = [MAY_TAM];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = (tienTo = 'sdt-') => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tienTo)));
  canDon.push(d);
  return d;
};
const docJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ghiJ = (p, du) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(du, null, 2)}\n`);
};
const ghiT = (p, s) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
};
const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT'));
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, env: ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const CLI = (gocGoi = GOI) => path.join(gocGoi, 'scripts', 'dieu-phoi.mjs');
function chayCli(cwd, doiSo, { gocGoi = GOI, env = {} } = {}) {
  const r = spawnSync(process.execPath, [CLI(gocGoi), ...doiSo], { cwd, env: { ...ENV, ...env }, encoding: 'utf8' });
  return { ma: r.status, out: r.stdout, err: r.stderr };
}
const nap = (gocGoi, tep) => import(`${path.join(gocGoi, 'scripts', tep)}?v=${Math.random()}`);
const chepGoi = () => {
  const sao = path.join(tam('sdt-goi-'), 'dieu-phoi');
  fs.cpSync(GOI, sao, { recursive: true });
  return sao;
};
// Ca đỏ: đối chứng dương chạy trên một bản sao lành, bản tiêm là bản sao KHÁC cùng nội dung. Nhịp bộ phát lịch chạy
// trong tiến trình ca nên mô-đun đã nạp ở lượt đối chứng nằm trong bộ nhớ đệm của ESM — tiêm vào cùng đường thì
// lượt sau vẫn chạy mô-đun cũ (đo 11/10 ở SDT-04-do the-doc-park).
async function doHaiBan(kiem, tep, cu, moi) {
  assert.deepEqual(await kiem(chepGoi()), [], 'đối chứng dương: bản sao lành');
  const sao = chepGoi();
  tiem(path.join(sao, 'scripts', tep), cu, moi);
  return kiem(sao);
}
const tiem = (p, cu, moi) => {
  const goc = fs.readFileSync(p, 'utf8');
  const sau = goc.replace(cu, moi);
  assert.notEqual(sau, goc, `bước tiêm không áp được vào ${path.basename(p)}`);
  fs.writeFileSync(p, sau);
};

function khoThu(tienTo = 'sdt-kho-') {
  const d = tam(tienTo);
  git(d, 'init', '-q', '-b', 'main');
  git(d, 'commit', '-q', '--allow-empty', '-m', 'goc');
  return d;
}
function themWorktree(kho, id) {
  const dich = path.join(tam(`sdt-wt-${id}-`), 'wt');
  git(kho, 'worktree', 'add', '-q', '-b', `day-${id}-${path.basename(path.dirname(dich))}`, dich);
  return fs.realpathSync(dich);
}

// Một đợt mở từ gói bằng CLI thật, giám sát `s-gs`, hai dãy P1 và P2 có worktree thật.
function dungDot({ hang, gocGoi = GOI, pha = 'dang-chay' }) {
  const kho = khoThu();
  const w = { P1: themWorktree(kho, 'P1'), P2: themWorktree(kho, 'P2') };
  const dirGoi = path.join(kho, 'goi', 'dot-thu');
  ghiJ(path.join(dirGoi, 'dieu-phoi.config.json'), docJ(path.join(GOI, 'scripts', 'mau', 'dieu-phoi.config.json')));
  ghiJ(path.join(dirGoi, 'hang-viec.json'), {
    dot: '',
    day: Object.entries(w).map(([id, worktree]) => ({ id, worktree })),
    hang,
    ngoai_hang_merge: [],
  });
  ghiT(path.join(dirGoi, 'LUAT-rieng.md'), '# Luật riêng của kho thử\n');
  ghiT(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\ndieu_phoi:\n  goi_dot: goi/dot-{ten}\n');
  const mo = chayCli(kho, ['mo', 'thu', '--phien', 's-gs'], { gocGoi });
  assert.equal(mo.ma, 0, `mo thu: ${mo.err}`);
  if (pha === 'dang-chay') {
    const p = chayCli(kho, ['pha', 'dang-chay', '--boi', 't'], { gocGoi });
    assert.equal(p.ma, 0, `pha dang-chay: ${p.err}`);
  }
  const dot = fs.realpathSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  return { kho, dot, w };
}

// io giả của một nhịp: sức khoẻ lành; `git show origin/main:_acceptance/<slug>/contract.md` trả trạng thái theo
// bảng `tren` (vắng → không có tệp). Mọi phần còn lại của nhịp là mã thật của gói.
const ioGia = (nowMs, { tren = {} } = {}) => ({
  nowMs: () => nowMs,
  chay: (cmd, args = []) => {
    if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 0.00M  free = 1.00M';
    if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
    if (cmd === 'sysctl') return '{ 1.00 1.00 1.00 }';
    if (cmd === 'ps') return '102400 node\n';
    if (cmd === 'gh') return '[]';
    if (cmd === 'git' && args[0] === 'show') {
      const m = /_acceptance\/([^/]+)\/contract\.md$/.exec(args[1] ?? '');
      if (m && tren[m[1]]) return `---\nstatus: ${tren[m[1]]}\n---\n`;
      throw new Error('khong co');
    }
    return '';
  },
});
async function nhip(dot, { gocGoi = GOI, tren = {} } = {}) {
  const { motNhip } = await nap(gocGoi, 'phat-lich.mjs');
  await motNhip(dot, ioGia(Date.now(), { tren }));
}

// Chạy CHÍNH lệnh hook PostToolUse của gói, rút từ hooks.json (thay ${CLAUDE_PLUGIN_ROOT}).
function hookNhip(dauVao, { cwd, nowMs, gocGoi = GOI }) {
  const hj = docJ(path.join(gocGoi, 'hooks', 'hooks.json'));
  const lenh = hj.hooks.PostToolUse[0].hooks[0].command.split('${CLAUDE_PLUGIN_ROOT}').join(gocGoi);
  const r = spawnSync('sh', ['-c', lenh], { cwd, env: { ...ENV, DIEU_PHOI_NOW_MS: String(nowMs) }, input: JSON.stringify({ cwd, ...dauVao }), encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
}
const GIO = Date.parse('2026-10-11T08:00:00Z');
const ENV_GIO = { DIEU_PHOI_NOW_MS: String(GIO) };
const oCoHoi = (goc, slug, { stage = 'decided', decision = '' } = {}) =>
  ghiT(path.join(goc, '_acceptance', slug, 'opportunity.md'), `---\nslug: ${slug}\nstage: ${stage}\ndecision: ${decision}\n---\n`);
const hopDong = (goc, slug, st) => ghiT(path.join(goc, '_acceptance', slug, 'contract.md'), `---\nslug: ${slug}\nstatus: ${st}\n---\n`);
const chanDoan = (kho, them, gocGoi) => {
  const r = chayCli(kho, ['chan-doan', '--json', ...them], { gocGoi, env: ENV_GIO });
  assert.equal(r.ma, 0, r.err);
  return r.out;
};

// ---------- SDT-01: dãy mo-chip là «chờ người bấm chip», không phải thiếu (AC-1, E1 — lỗi D4) ----------
const HAI_DAY = [
  { ma: 'A', slug: 'hang-a', day: 'P1', uu_tien: 1 },
  { ma: 'B', slug: 'hang-b', day: 'P2', uu_tien: 1 },
];

// Đúng trạng thái sau bước 6 của mo-dot: đợt chạy, bộ phát lịch sống, nhịp đã ghi tiep/, giám sát có nhịp sống và
// đã ghi một lần đọc mức dùng (khuôn đợt khai `han_muc` từ DP4 — lịch 30′ gọi `get_usage` rồi `han-muc`), hai dãy
// chưa ai bấm chip (không nhịp sống).
async function kiemChoBam(gocGoi) {
  const { kho, dot } = dungDot({ hang: HAI_DAY, gocGoi });
  for (const h of HAI_DAY) oCoHoi(kho, h.slug, { decision: 'build' });
  await nhip(dot, { gocGoi });
  const { giuPid } = await nap(gocGoi, 'phat-lich.mjs');
  assert.equal(giuPid(dot), true, 'giuPid của bộ phát lịch ghi pid tiến trình ca');
  hookNhip({ session_id: 's-gs' }, { cwd: kho, nowMs: GIO, gocGoi });
  const doc = { windows: [
    { label: '5-hour limit', percentUsed: 20, resetsAt: new Date(GIO + 3 * 3600_000).toISOString() },
    { label: 'Weekly · all models', percentUsed: 10, resetsAt: new Date(GIO + 72 * 3600_000).toISOString() },
  ] };
  const hm = chayCli(kho, ['han-muc', '--nguon', 'get-usage', '--phien', 's-gs', '--doc', JSON.stringify(doc)], { gocGoi, env: ENV_GIO });
  assert.equal(hm.ma, 0, `han-muc: ${hm.err}`);
  const tron1 = chanDoan(kho, [], gocGoi);
  const tron2 = chanDoan(kho, [], gocGoi);
  const ct = JSON.parse(chanDoan(kho, ['--chi-tiet'], gocGoi));
  const loi = [];
  for (const m of JSON.parse(tron1).filter((x) => x.trang_thai === 'thieu')) {
    loi.push(m.muc.startsWith('day:') ? `${m.muc} thieu — bước 7 mở chip lần hai` : `${m.muc} thieu: ${m.viec}`);
  }
  if (tron1 !== tron2) loi.push('hai lần chạy trơn cho đầu ra khác nhau');
  for (const h of HAI_DAY) {
    const m = ct.find((x) => x.muc === `day:${h.day}`);
    if (!m) {
      loi.push(`thiếu mục day:${h.day}`);
      continue;
    }
    if (m.chi_tiet?.hanh_dong !== 'mo-chip') loi.push(`day:${h.day}: hành động ${m.chi_tiet?.hanh_dong}, cần mo-chip`);
    if (!m.viec.includes('chờ người bấm chip')) loi.push(`day:${h.day}: viec thiếu «chờ người bấm chip»`);
    if (!(m.chi_tiet?.ghi_danh ?? '').includes(`/feature-loop:feature-loop ${h.slug}`)) loi.push(`day:${h.day}: ghi_danh thiếu ${h.slug}`);
  }
  const k = ct.filter((x) => x.chi_tiet?.hanh_dong === 'mo-chip').length;
  if (k !== 2) loi.push(`số dãy mo-chip ${k}, cần 2`);
  return { loi, ct, k };
}

test('SDT-01 cho-bam-chip', async () => {
  const { loi, ct, k } = await kiemChoBam(GOI);
  console.log(`  mục: ${ct.map((m) => `${m.muc}=${m.trang_thai}`).join(' ')} · k=${k}`);
  assert.deepEqual(loi, []);
});

const BANG_CAN = {
  khong: 'du',
  'mo-chip': 'du',
  'khong-hang': 'du',
  'nhan-giang-lai': 'thieu',
  'worktree-mat': 'thieu',
  'cho-nguoi': 'thieu',
  'chua-biet': 'thieu',
};
async function kiemBang(gocGoi) {
  const { HANH_DONG, TRANG_THAI_HANH_DONG: bang = {} } = await nap(gocGoi, 'tiep-tuc.mjs');
  const loi = [];
  const khoa = Object.keys(bang).sort();
  const hd = Object.values(HANH_DONG).sort();
  if (khoa.join(',') !== hd.join(',')) loi.push(`tập khoá bảng [${khoa}] ≠ HANH_DONG [${hd}]`);
  for (const [k, v] of Object.entries(BANG_CAN)) if (bang[k] !== v) loi.push(`${k}: ${bang[k]}, cần ${v}`);
  return { loi, bang, hd };
}

test('SDT-01 bang-trang-thai', async () => {
  const { loi, bang, hd } = await kiemBang(GOI);
  console.log(`  HANH_DONG: ${hd.join(', ')} · bảng: ${Object.entries(bang).map(([k, v]) => `${k}=${v}`).join(' ')}`);
  assert.equal(Object.keys(BANG_CAN).length, 7);
  assert.deepEqual(loi, []);
});

test('SDT-01-do mo-chip-thieu', async () => {
  const loi = await doHaiBan(async (g) => (await kiemChoBam(g)).loi, 'tiep-tuc.mjs', "'mo-chip': 'du',", "'mo-chip': 'thieu',");
  assert.ok(loi.includes('day:P1 thieu — bước 7 mở chip lần hai'), `phải nêu day:P1: ${loi.join(' | ')}`);
});

test('SDT-01-do nhan-giang-lai-du', async () => {
  const loi = await doHaiBan(async (g) => (await kiemBang(g)).loi, 'tiep-tuc.mjs', "'nhan-giang-lai': 'thieu',", "'nhan-giang-lai': 'du',");
  assert.ok(loi.some((l) => l.startsWith('nhan-giang-lai:')), `phải nêu nhan-giang-lai: ${loi.join(' | ')}`);
  assert.equal(loi.length, 1, `chỉ nêu đúng hành động bị tiêm: ${loi.join(' | ')}`);
});

// ---------- SDT-03: lời ghi danh đọc đúng tiep/ và nghi (AC-3, E3 — lỗi D1) ----------
const A1 = { ma: 'A', slug: 'hang-a', day: 'P1', uu_tien: 1 };
const nghiP1 = ({ kho }, gocGoi) => assert.equal(chayCli(kho, ['hang', 'nghi', 'P1'], { gocGoi }).ma, 0);
export const MA_TRAN_D1 = [
  { ten: '(a)', hang: [A1], dung: ({ w }) => hopDong(w.P1, 'hang-a', DA_KY), nhip: true, can: 'khong-hang', lyDo: 'xong', daKy: ['hang-a'] },
  { ten: '(b)', hang: [A1], dung: (c, g) => { oCoHoi(c.kho, 'hang-a', { decision: 'build' }); nghiP1(c, g); }, nhip: true, can: 'khong-hang', lyDo: 'nghi' },
  {
    ten: '(c)',
    hang: [{ ma: 'A', slug: 'hang-a', day: 'P2', uu_tien: 1 }, { ma: 'B', slug: 'hang-b', day: 'P1', uu_tien: 1, sau: ['A'] }],
    dung: ({ kho }) => oCoHoi(kho, 'hang-b', { decision: 'build' }),
    nhip: true,
    can: 'khong-hang',
    lyDo: 'phu-thuoc',
  },
  {
    ten: '(d)',
    hang: [A1, { ma: 'B', slug: 'hang-b', day: 'P1', uu_tien: 2 }],
    dung: ({ kho, w }) => { hopDong(w.P1, 'hang-a', DA_KY); oCoHoi(kho, 'hang-b', { decision: 'build' }); },
    nhip: true,
    can: 'mo-chip',
    ghiDanh: 'hang-b',
    daKy: ['hang-a'],
  },
  { ten: '(e)', hang: [A1], dung: () => {}, nhip: false, can: 'mo-chip', ghiDanh: 'hang-a' },
  { ten: '(f)', hang: [A1], dung: nghiP1, nhip: false, can: 'khong-hang', lyDo: 'nghi' },
  { ten: '(g)', hang: [A1], dung: () => {}, nhip: true, tiep: { hang: null, cho: 'cong-dang' }, can: 'khong-hang', lyDo: 'cong-dang' },
];

async function kiemMaTranD1(gocGoi) {
  const loi = [];
  const ra = [];
  for (const h of MA_TRAN_D1) {
    const ctx = dungDot({ hang: h.hang, gocGoi });
    h.dung(ctx, gocGoi);
    if (h.nhip) await nhip(ctx.dot, { gocGoi });
    if (h.tiep) {
      const ke = docJ(path.join(ctx.dot, 'tiep', 'P1.json')).ke;
      assert.deepEqual(ke, h.tiep, `${h.ten}: đối chứng đầu vào — nhịp thật phải ghi ${JSON.stringify(h.tiep)}`);
    }
    hookNhip({ session_id: 's-gs' }, { cwd: ctx.kho, nowMs: GIO, gocGoi });
    const cd = JSON.parse(chanDoan(ctx.kho, ['--chi-tiet'], gocGoi)).find((m) => m.muc === 'day:P1');
    const tt = chayCli(ctx.kho, ['tiep-tuc', '--phien', 's-gs', '--nhe', '--json'], { gocGoi, env: ENV_GIO });
    // tiep-tuc chạy lại bộ phát lịch (tiến trình tách rời) khi đợt đang chạy — dừng nó, kẻo nó còn ghi vào kho thử
    // lúc bước dọn xoá thư mục tạm (ENOTEMPTY, đo 11/10).
    chayCli(ctx.kho, ['dung'], { gocGoi });
    assert.equal(tt.ma, 0, tt.err);
    const kh = JSON.parse(tt.out).ke_hoach.find((k) => k.day === 'P1');
    const hd = cd?.chi_tiet?.hanh_dong ?? null;
    ra.push(`${h.ten}=${hd}${cd?.chi_tiet?.ly_do ? `(${cd.chi_tiet.ly_do})` : ''}`);
    if (hd !== h.can) loi.push(`${h.ten}: ${hd}, cần ${h.can}`);
    if (kh?.hanh_dong !== hd) loi.push(`${h.ten}: tiep-tuc ${kh?.hanh_dong} ≠ chan-doan ${hd}`);
    const gd = cd?.chi_tiet?.ghi_danh ?? '';
    for (const s of h.daKy ?? []) if (new RegExp(`feature-loop ${s}(\\s|$)`).test(gd)) loi.push(`${h.ten} mời làm lại ${s}`);
    if (h.can === 'khong-hang') {
      if (cd?.chi_tiet?.ly_do !== h.lyDo) loi.push(`${h.ten}: lý do ${cd?.chi_tiet?.ly_do}, cần ${h.lyDo}`);
      if (cd?.trang_thai !== 'du') loi.push(`${h.ten}: khong-hang phải là du, đang ${cd?.trang_thai}`);
    }
    if (h.ghiDanh && !gd.includes(`/feature-loop:feature-loop ${h.ghiDanh}`)) loi.push(`${h.ten}: ghi danh thiếu ${h.ghiDanh}`);
  }
  return { loi, ra };
}

test('SDT-03 ma-tran-het-hang', async () => {
  const { loi, ra } = await kiemMaTranD1(GOI);
  console.log(`  số hàng ma trận: ${ra.length} · ${ra.join(' ')}`);
  assert.equal(ra.length, MA_TRAN_D1.length);
  assert.equal(MA_TRAN_D1.length, 7);
  assert.deepEqual(loi, []);
});

const hangCua = (loi) => [...new Set(loi.map((l) => /^\(([a-g])\)/.exec(l)?.[1]).filter(Boolean))].sort();
const d1TrenBanSao = (cu, moi) => doHaiBan(async (g) => (await kiemMaTranD1(g)).loi, 'lich.mjs', cu, moi);

test('SDT-03-do roi-uu-tien', async () => {
  const loi = await d1TrenBanSao(
    "if (tiep) return tiep.hang ? { hang: tiep.hang } : { hang: null, ly_do: tiep.xong ? 'xong' : tiep.cho ?? 'cho' };",
    'if (tiep?.hang) return { hang: tiep.hang };',
  );
  assert.ok(loi.includes('(a) mời làm lại hang-a'), `phải nêu (a) mời làm lại: ${loi.join(' | ')}`);
});

test('SDT-03-do bo-nghi', async () => {
  const loi = await d1TrenBanSao("  if (hangViec.day?.find((d) => d.id === id)?.nghi === true) return { hang: null, ly_do: 'nghi' };\n", '');
  assert.deepEqual(hangCua(loi), ['f'], `chỉ nêu (f): ${loi.join(' | ')}`);
});

test('SDT-03-do chi-phu-thuoc', async () => {
  const loi = await d1TrenBanSao('if (tiep) return', "if (tiep && (tiep.hang || tiep.xong || ['nghi', 'phu-thuoc'].includes(tiep.cho))) return");
  assert.deepEqual(hangCua(loi), ['g'], `chỉ nêu (g): ${loi.join(' | ')}`);
});

// ---------- SDT-04: bộ phát lịch chỉ giao hàng đã quyết build (AC-4, E4 — lỗi B1) ----------
const A = { ma: 'A', slug: 'hang-a', day: 'P1', uu_tien: 1 };
const B = { ma: 'B', slug: 'hang-b', day: 'P1', uu_tien: 2 };
const KHUON_O = path.join(KIT, 'skills', 'acceptance', 'references', 'opportunity-template.md');
// Ô của hàng A do CHÍNH bộ ghi của `lo-trinh.mjs --mo-o` sinh từ khuôn thật của kit (writer → quyetCua → tiep).
async function oTuBoGhi(goc, { build = false } = {}) {
  const { dungCoHoi } = await import(path.join(KIT, 'scripts', 'lo-trinh.mjs'));
  let o = dungCoHoi({ khuon: fs.readFileSync(KHUON_O, 'utf8'), hang: { ma: 'A', cau_giao: 'Hàng A của đợt thử' }, tep: 'docs/lo-trinh.json', tenLoTrinh: 'thử', slug: 'hang-a', owner: 't@t' });
  if (build) {
    // Bước 4 của mo-dot: ghi chữ build người gõ vào dòng `decision:` — giữ chú thích sau giá trị của khuôn.
    const sau = o.replace(/^decision:[ \t]*(?=#|$)/m, 'decision: build   ');
    assert.notEqual(sau, o, 'bước ghi build không áp được vào ô do bộ ghi sinh');
    o = sau;
  }
  ghiT(path.join(goc, '_acceptance', 'hang-a', 'opportunity.md'), o);
}
const voiB = (dung) => async (c) => { oCoHoi(c.kho, 'hang-b', { decision: 'build' }); await dung(c); };
const keA = { hang: 'hang-a', moi: true };
const keB = { hang: 'hang-b', moi: true };
export const MA_TRAN_B1 = [
  { ten: 'o-build', hang: [A, B], dung: voiB(({ kho }) => oCoHoi(kho, 'hang-a', { decision: 'build' })), ke: keA },
  { ten: 'o-bo-ghi-build', hang: [A, B], dung: voiB(({ kho }) => oTuBoGhi(kho, { build: true })), ke: keA },
  { ten: 'o-bo-ghi-nguyen', hang: [A, B], dung: voiB(({ kho }) => oTuBoGhi(kho)), ke: keB, canhBao: true },
  { ten: 'o-build-worktree', hang: [A, B], dung: voiB(({ w }) => oCoHoi(w.P1, 'hang-a', { decision: 'build' })), ke: keA },
  { ten: 'hop-dong', hang: [A, B], dung: voiB(({ kho }) => hopDong(kho, 'hang-a', 'draft')), ke: keA },
  { ten: 'khong-ma', hang: [{ slug: 'viec-x', day: 'P1', uu_tien: 1 }, B], dung: voiB(() => {}), ke: { hang: 'viec-x', moi: true } },
  { ten: 'vang', hang: [A, B], dung: voiB(() => {}), ke: keB, canhBao: true },
  { ten: 'discovery', hang: [A, B], dung: voiB(({ kho }) => oCoHoi(kho, 'hang-a', { stage: 'discovery' })), ke: keB, canhBao: true },
  { ten: 'park', hang: [A, B], dung: voiB(({ kho }) => oCoHoi(kho, 'hang-a', { decision: 'park' })), ke: keB, canhBao: true },
  { ten: 'kill', hang: [A, B], dung: voiB(({ kho }) => oCoHoi(kho, 'hang-a', { decision: 'kill' })), ke: keB, canhBao: true },
  { ten: 'iterate', hang: [A, B], dung: voiB(({ kho }) => oCoHoi(kho, 'hang-a', { decision: 'iterate' })), ke: keB, canhBao: true },
  { ten: 'chi-a-park', hang: [A], dung: ({ kho }) => oCoHoi(kho, 'hang-a', { decision: 'park' }), ke: { hang: null, xong: true }, canhBao: true },
  { ten: 'chi-a-vang', hang: [A], dung: () => {}, ke: { hang: null, cho: 'cong-dang' }, canhBao: true },
];

async function kiemMaTranB1(gocGoi) {
  const loi = [];
  const ra = [];
  for (const h of MA_TRAN_B1) {
    const ctx = dungDot({ hang: h.hang, gocGoi });
    await h.dung(ctx);
    await nhip(ctx.dot, { gocGoi });
    const ke = docJ(path.join(ctx.dot, 'tiep', 'P1.json')).ke;
    const the = JSON.parse(chayCli(ctx.kho, ['the', 'khoi-tao', '--json'], { gocGoi }).out);
    const canh = new Set([...the.canh_bao.map((c) => c.slug), ...the.cho_cong_dang]);
    ra.push({ ten: h.ten, ke, canh: [...canh] });
    if (JSON.stringify(ke) !== JSON.stringify(h.ke)) {
      loi.push(ke.hang === 'hang-a' && h.ke.hang !== 'hang-a' ? `${h.ten} được giao` : `${h.ten}: tiep ${JSON.stringify(ke)}, cần ${JSON.stringify(h.ke)}`);
    }
    if (ke.hang && canh.has(ke.hang)) loi.push(`${h.ten}: thẻ cảnh báo ${ke.hang} mà tiep giao nó`);
    if (h.canhBao && !canh.has('hang-a')) loi.push(`thẻ thôi cảnh báo ${h.ten}`);
  }
  return { loi, ra };
}

// Một lượt ma trận trên gói thật dùng chung cho hai ca dưới (mỗi lượt dựng 13 kho).
let b1Goc = null;
const b1TrenGoi = () => (b1Goc ??= kiemMaTranB1(GOI));

test('SDT-04 ma-tran-quyet', async () => {
  const { loi, ra } = await b1TrenGoi();
  console.log(`  số hàng ma trận: ${ra.length} · ${ra.map((r) => `${r.ten}=${r.ke.hang ?? (r.ke.xong ? 'xong' : r.ke.cho)}`).join(' ')}`);
  assert.equal(ra.length, MA_TRAN_B1.length);
  assert.equal(MA_TRAN_B1.length, 13);
  assert.deepEqual(loi.filter((l) => !l.includes('thẻ')), []);
});

test('SDT-04 the-va-tiep', async () => {
  const { loi, ra } = await b1TrenGoi();
  const coCanh = ra.filter((r) => MA_TRAN_B1.find((h) => h.ten === r.ten).canhBao);
  console.log(`  tập cảnh báo của thẻ: ${coCanh.map((r) => `${r.ten}:${r.canh.length}`).join(' ')}`);
  assert.equal(coCanh.length, 8);
  assert.deepEqual(loi.filter((l) => l.includes('thẻ')), []);
});

const b1TrenBanSao = (tep, cu, moi) => doHaiBan(async (g) => (await kiemMaTranB1(g)).loi, tep, cu, moi);

test('SDT-04-do khong-bang-quyet', async () => {
  // Hồ sơ ky-den-gop: lời gọi mang thêm hàm trùng tệp (đối số thứ năm) — nhát tiêm chỉ bỏ bảng quyết, giữ hàm ấy.
  const loi = await b1TrenBanSao('phat-lich.mjs', 'chonHangKe(hangViec, day.id, tienDo, quyet, trung)', 'chonHangKe(hangViec, day.id, tienDo, null, trung)');
  assert.ok(loi.includes('park được giao'), `phải nêu park được giao: ${loi.join(' | ')}`);
});

test('SDT-04-do the-doc-park', async () => {
  const loi = await b1TrenBanSao('the.mjs', "if (decision === 'build') return { tt: 'da-quyet' };", "if (decision === 'build' || decision === 'park') return { tt: 'da-quyet' };");
  assert.ok(loi.includes('park được giao'), `bộ phát lịch đọc cùng hàm — phải nêu park được giao: ${loi.join(' | ')}`);
  assert.ok(loi.includes('thẻ thôi cảnh báo park'), `thẻ đọc cùng hàm — phải nêu thẻ thôi cảnh báo park: ${loi.join(' | ')}`);
});

// Đường đọc-cũ của B1: đợt cũ crm (fixture dot-crm-0910 của DP1 — đợt dựng tay, 69 hàng đều mang mã, không ô nào)
// không bị lọc theo quyết. Dựng fixture vào kho thử đúng cách của DP2-05 dot-cu (`@KHO@` → kho, worktree rỗng).
function dungDotCu() {
  const kho = khoThu('sdt-cu-');
  const dot = path.join(kho, '.acceptance-runs', 'dieu-phoi-sau-14-10');
  fs.cpSync(path.join(DAY_TEP, 'fixtures', 'dot-crm-0910'), dot, { recursive: true });
  const tatCa = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? tatCa(path.join(d, e.name)) : [path.join(d, e.name)]));
  const ke = kho.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Hồ sơ ky-den-gop: ca này đo đường đọc-cũ của B1 (không lọc theo quyết), không đo lịch biết tệp. Hàng của bản chụp
  // khai vùng tệp trùng nhau giữa các dãy (chính lớp lỗi lịch biết tệp sinh ra để chặn) nên lịch đổi hàng kế ở bốn dãy;
  // bỏ `ranh_gioi` khỏi bản chép để phép so tách được hai luật. Lịch biết tệp có ca riêng ở loi/trung-tep.test.mjs.
  const pHv = path.join(dot, 'hang-viec.json');
  const hvCu = JSON.parse(fs.readFileSync(pHv, 'utf8'));
  for (const h of hvCu.hang) delete h.ranh_gioi;
  fs.writeFileSync(pHv, JSON.stringify(hvCu, null, 2));
  for (const p of tatCa(dot)) {
    const t = fs.readFileSync(p, 'utf8');
    if (!t.includes('@KHO@')) continue;
    const moi = t.split('@KHO@').join(kho);
    for (const m of moi.matchAll(new RegExp(`"(${ke}[^"]*)"`, 'g'))) fs.mkdirSync(m[1], { recursive: true });
    fs.writeFileSync(p, moi);
  }
  fs.symlinkSync(dot, path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  return { dot: fs.realpathSync(dot), chup: Date.parse(docJ(path.join(dot, 'trang-thai.json')).nhip_cuoi) };
}
async function kiemDotCu(gocGoi) {
  const { dot, chup } = dungDotCu();
  assert.equal(fs.existsSync(path.join(dot, 'dieu-khien.json')), false, 'fixture phải là đợt cũ (không dieu-khien.json)');
  const { motNhip } = await nap(gocGoi, 'phat-lich.mjs');
  const { chonHangKe } = await nap(gocGoi, 'lich.mjs');
  await motNhip(dot, ioGia(chup + 60_000));
  const hv = docJ(path.join(dot, 'hang-viec.json'));
  // Worktree của dãy rỗng và `git show origin` không có tệp → tiến độ mọi hàng là `chua`; kỳ vọng = chonHangKe
  // KHÔNG bảng quyết trên đúng tiến độ ấy.
  const td = new Map(hv.hang.map((h) => [h.slug, 'chua']));
  const loi = [];
  for (const d of hv.day) {
    const ke = docJ(path.join(dot, 'tiep', `${d.id}.json`)).ke;
    const can = chonHangKe(hv, d.id, td);
    if (JSON.stringify(ke) !== JSON.stringify(can)) loi.push(`đợt cũ bị lọc: ${d.id} ${JSON.stringify(ke)}, cần ${JSON.stringify(can)}`);
  }
  return { loi, soDay: hv.day.length, soHang: hv.hang.length, coMa: hv.hang.filter((h) => h.ma).length };
}

test('SDT-04 dot-cu', async () => {
  const { loi, soDay, soHang, coMa } = await kiemDotCu(GOI);
  console.log(`  đợt cũ crm: ${soDay} dãy · ${soHang} hàng (${coMa} mang mã) · lệch: ${loi.length}`);
  assert.ok(soHang > 0 && coMa === soHang, 'fixture phải có hàng, mọi hàng mang mã');
  assert.deepEqual(loi, []);
});

test('SDT-04-do loc-moi-dot', async () => {
  const loi = await doHaiBan(async (g) => (await kiemDotCu(g)).loi, 'phat-lich.mjs', 'dk.nguon_goi ? cfg.goc_kho : null', 'cfg.goc_kho');
  assert.ok(loi.length > 0 && loi.every((l) => l.startsWith('đợt cũ bị lọc:')), `bản sao lọc mọi đợt phải nêu dãy bị lọc: ${loi.join(' | ')}`);
});

// ---------- SDT-07: ca đã ký đổi thân phải có tên trong sổ (AC-7, E7) ----------
const TEP_KY = ['tests/dieu-phoi/dong-goi.test.mjs', 'tests/dieu-phoi/mo-dot.test.mjs', 'tests/dieu-phoi/tiep-tuc.test.mjs', 'tests/dieu-phoi/trong-dot.test.mjs', 'tests/dieu-phoi/doi-tai-khoan.test.mjs', 'tests/dieu-phoi/loi'];
const RE_PR = new RegExp(`\\tMerge pull request #\\d+ from \\S+/${NHANH.replace(/\//g, '\\/')}$`);

// Mốc so của «phần vòng này tự đổi». Commit gộp PR của nhánh có trong lịch sử HEAD → từ điểm rẽ hai cha tới cha-2
// (khuôn neo lịch sử DP7-10); không có → từ merge-base với nhánh chính tới HEAD. Commit gộp `main` VÀO nhánh
// không bao giờ được chọn: nó mang thay đổi của vòng khác.
export function mocSo(goc, reGop = RE_PR) {
  const dong = git(goc, 'log', '--merges', '--format=%H%x09%s', 'HEAD').split('\n').find((l) => reGop.test(l));
  if (dong) {
    const m = dong.split('\t')[0];
    return { tu: git(goc, 'merge-base', `${m}^1`, `${m}^2`), toi: git(goc, 'rev-parse', `${m}^2`), cach: 'commit gộp PR' };
  }
  for (const n of ['origin/main', 'main']) {
    try {
      return { tu: git(goc, 'merge-base', 'HEAD', n), toi: git(goc, 'rev-parse', 'HEAD'), cach: `merge-base ${n}` };
    } catch {}
  }
  throw new Error('không tìm được mốc so (không có commit gộp PR của nhánh, không có main)');
}

const noiDungTai = (goc, sha, p) => {
  const r = spawnSync('git', ['show', `${sha}:${p}`], { cwd: goc, env: ENV, encoding: 'utf8', maxBuffer: 1 << 28 });
  return r.status === 0 ? r.stdout : null;
};
const tepTai = (goc, sha, p) => {
  const r = spawnSync('git', ['ls-tree', '-r', '--name-only', sha, '--', p], { cwd: goc, env: ENV, encoding: 'utf8' });
  return r.status === 0 ? r.stdout.split('\n').filter((f) => f.endsWith('.mjs')) : [];
};
// Khối của một ca = từ dòng sau khi ca trước khép tới dòng `});` khép ca này: mảng/hàm dựng nằm ngay trên một ca
// thuộc về ca ấy. Phần trước ca đầu là «(đầu <tệp>)».
export function khoiCa(text, tep) {
  const ra = new Map();
  if (text == null) return ra;
  const dong = text.split('\n');
  let dau = 0;
  for (let i = 0; i < dong.length; i++) {
    const m = /^test\((['"`])(.+?)\1/.exec(dong[i]);
    if (!m) continue;
    if (!ra.size && dau === 0 && i > 0) ra.set(`(đầu ${tep})`, dong.slice(0, i).join('\n'));
    let j = i;
    while (j < dong.length && !/^\}\);\s*$/.test(dong[j])) j++;
    ra.set(m[2], dong.slice(dau, j + 1).join('\n'));
    dau = j + 1;
    i = j;
  }
  return ra;
}
export function caDoiThan(goc, { tu, toi }, ds = TEP_KY) {
  const ra = [];
  for (const p of ds) {
    const cacTep = [...new Set([...tepTai(goc, tu, p), ...tepTai(goc, toi, p)])].sort();
    for (const f of cacTep) {
      const cu = khoiCa(noiDungTai(goc, tu, f), path.basename(f));
      const moi = khoiCa(noiDungTai(goc, toi, f), path.basename(f));
      for (const [ten, than] of cu) if (moi.get(ten) !== than) ra.push(ten);
    }
  }
  return ra;
}
export function thieuSo(ten, soText) {
  const fix = soText.split('\n').filter(Boolean).flatMap((d) => {
    try {
      const o = JSON.parse(d);
      return o.type === 'fix' ? [`${o.decision} ${o.why} ${o.cost_if_wrong ?? o.impact ?? ''}`] : [];
    } catch {
      return [];
    }
  });
  return ten.filter((t) => !fix.some((f) => f.includes(t))).map((t) => `${t} chưa có dòng sổ`);
}
const SO = path.join(KIT, '_acceptance', SLUG, 'decisions.jsonl');

test('SDT-07 doi-than-co-ten', () => {
  const moc = mocSo(KIT);
  const ds = caDoiThan(KIT, moc);
  console.log(`  mốc (${moc.cach}): ${moc.tu.slice(0, 12)}..${moc.toi.slice(0, 12)} · ca đổi thân: ${ds.join(' · ')}`);
  assert.ok(ds.length > 0, 'danh sách ca đổi thân rỗng — mốc so hỏng hoặc vòng chưa đổi ca nào');
  assert.deepEqual(thieuSo(ds, fs.readFileSync(SO, 'utf8')), []);
});

test('SDT-07-do so-thieu-ten', () => {
  const ds = caDoiThan(KIT, mocSo(KIT));
  const so = fs.readFileSync(SO, 'utf8');
  assert.deepEqual(thieuSo(ds, so), [], 'đối chứng dương: sổ thật đủ tên');
  const saoSo = so.split('\n').filter((d) => !d.includes(ds[0])).join('\n');
  assert.notEqual(saoSo, so, 'bước bỏ dòng sổ không áp được');
  assert.ok(thieuSo(ds, saoSo).includes(`${ds[0]} chưa có dòng sổ`), `phải nêu ${ds[0]}`);
});

// Kho git tạm hai chiều gộp: nhánh đổi ca X, main đổi ca Y; gộp main vào nhánh; rồi gộp PR nhánh vào main.
function khoHaiChieu() {
  const kho = khoThu('sdt-moc-');
  const p = path.join(kho, 'tests', 'dieu-phoi', 'mo-dot.test.mjs');
  const viet = (x, y) => ghiT(p, `test('X', () => {\n  ${x}();\n});\n\ntest('Y', () => {\n  ${y}();\n});\n`);
  viet('a', 'b');
  git(kho, 'add', '-A');
  git(kho, 'commit', '-q', '-m', 'hai ca');
  git(kho, 'checkout', '-q', '-b', NHANH);
  viet('a2', 'b');
  git(kho, 'commit', '-q', '-am', 'nhanh doi X');
  git(kho, 'checkout', '-q', 'main');
  viet('a', 'b2');
  git(kho, 'commit', '-q', '-am', 'main doi Y');
  git(kho, 'checkout', '-q', NHANH);
  git(kho, 'merge', '-q', '--no-edit', 'main');
  return kho;
}
function kiemChonMoc(reGop) {
  const kho = khoHaiChieu();
  const buoc = [];
  const tren = (ten) => {
    const moc = mocSo(kho, reGop);
    const ds = caDoiThan(kho, moc, ['tests/dieu-phoi/mo-dot.test.mjs']);
    buoc.push({ ten, cach: moc.cach, ds });
  };
  tren('nhánh sau khi gộp main');
  git(kho, 'checkout', '-q', 'main');
  git(kho, 'merge', '-q', '--no-ff', '-m', `Merge pull request #1 from t/${NHANH}`, NHANH);
  tren('main sau khi gộp PR');
  return buoc;
}

test('SDT-07 chon-moc', () => {
  const buoc = kiemChonMoc(RE_PR);
  console.log(`  ${buoc.map((b) => `${b.ten} (${b.cach}): [${b.ds}]`).join(' · ')}`);
  for (const b of buoc) assert.deepEqual(b.ds, ['X'], `${b.ten}: danh sách phải đúng ca của nhánh`);
});

test('SDT-07-do moc-moi-commit-gop', () => {
  assert.ok(kiemChonMoc(RE_PR).every((b) => b.ds.join() === 'X'), 'đối chứng dương: bộ chọn đúng');
  const buoc = kiemChonMoc(new RegExp(NHANH.replace(/\//g, '\\/')));
  const lot = buoc.filter((b) => b.ds.includes('Y'));
  assert.ok(lot.length > 0, `bộ chọn nhận mọi commit gộp phải làm Y lọt vào danh sách: ${JSON.stringify(buoc)}`);
});

// ---------- SDT-02: thân lệnh người theo đúng đầu ra CLI (AC-2, E2 — lỗi D4) ----------
function doanBuoc(md, n) {
  const dong = md.split('\n');
  const i = dong.findIndex((d) => d.startsWith(`${n}. `));
  if (i < 0) return '';
  let j = i + 1;
  while (j < dong.length && !/^\d+\. /.test(dong[j]) && !/^\*\*Dạng/.test(dong[j])) j++;
  return dong.slice(i, j).join('\n');
}
export function dieuKienLenh(moDot, tiepTuc) {
  return [
    ['mo-dot.md bước 6 nêu --chi-tiet', doanBuoc(moDot, 6).includes('--chi-tiet')],
    ['mo-dot.md bước 6 nêu mo-chip', doanBuoc(moDot, 6).includes('mo-chip')],
    ['mo-dot.md bước 6 nêu ghi_danh', doanBuoc(moDot, 6).includes('ghi_danh')],
    ['mo-dot.md bước 7 nêu mo-chip', doanBuoc(moDot, 7).includes('mo-chip')],
    ['mo-dot.md bước 7 nêu chờ người bấm', doanBuoc(moDot, 7).includes('chờ người bấm')],
    ['mo-dot.md bước 7 nêu không mở lại', doanBuoc(moDot, 7).includes('không mở lại')],
    ['mo-dot.md bước 1 nêu chưa làm bước 6', doanBuoc(moDot, 1).includes('chưa làm bước 6')],
    ['tiep-tuc.md bước 5 nêu mo-chip', doanBuoc(tiepTuc, 5).includes('mo-chip')],
  ];
}
const docLenh = (ten) => fs.readFileSync(path.join(GOI, 'commands', ten), 'utf8');

test('SDT-02 lenh-nguoi', () => {
  const nay = dieuKienLenh(docLenh('mo-dot.md'), docLenh('tiep-tuc.md'));
  const moc = mocSo(KIT);
  const cu = dieuKienLenh(noiDungTai(KIT, moc.tu, 'dieu-phoi/commands/mo-dot.md'), noiDungTai(KIT, moc.tu, 'dieu-phoi/commands/tiep-tuc.md'));
  const giuNguyen = cu.filter(([, ok]) => ok).map(([t]) => t);
  console.log(`  ${nay.length} điều kiện ở HEAD: ${nay.map(([t, ok]) => `${ok ? '✓' : '✗'} ${t}`).join(' · ')}`);
  console.log(`  ở mốc ${moc.tu.slice(0, 12)}: đỏ ${cu.filter(([, ok]) => !ok).length}/${cu.length} · giữ nguyên: [${giuNguyen.join(', ')}]`);
  assert.deepEqual(nay.filter(([, ok]) => !ok).map(([t]) => t), []);
  assert.deepEqual(giuNguyen, [], 'mọi điều kiện của vòng phải ĐỎ trên thân lệnh trước vòng');
});

test('SDT-02-do buoc-7-cu', () => {
  const moDot = docLenh('mo-dot.md');
  const tiepTuc = docLenh('tiep-tuc.md');
  assert.deepEqual(dieuKienLenh(moDot, tiepTuc).filter(([, ok]) => !ok), [], 'đối chứng dương: thân lệnh hiện tại');
  const cu7 = doanBuoc(noiDungTai(KIT, mocSo(KIT).tu, 'dieu-phoi/commands/mo-dot.md'), 7);
  const sao = moDot.replace(doanBuoc(moDot, 7), cu7);
  assert.notEqual(sao, moDot, 'bước thay bước 7 không áp được');
  const hong = dieuKienLenh(sao, tiepTuc).filter(([, ok]) => !ok).map(([t]) => t);
  assert.ok(hong.length > 0 && hong.every((t) => t.startsWith('mo-dot.md bước 7')), `phải nêu mo-dot.md bước 7: ${hong.join(' | ')}`);
});

// ---------- SDT-08: tài liệu nói đúng luật mới (AC-8, E8) ----------
function khoiContext(ctx, ten) {
  const i = ctx.indexOf(`**${ten}**`);
  if (i < 0) return '';
  const j = ctx.indexOf('\n**', i + ten.length + 4);
  return ctx.slice(i, j < 0 ? undefined : j);
}
export function kiemTaiLieu(readme, ctx) {
  const loi = [];
  if (!readme.includes('cong-dang')) loi.push('README thiếu cong-dang');
  if (!readme.includes('khong-hang')) loi.push('README thiếu khong-hang');
  if (!readme.includes('đã quyết build')) loi.push('README thiếu «đã quyết build»');
  // Trọn gạch đầu dòng `bao-giam-sat`: dòng đầu cộng các dòng nối thụt hai cách.
  const dong = readme.split('\n');
  const i = dong.findIndex((d) => d.startsWith('- `bao-giam-sat`'));
  let j = i + 1;
  while (i >= 0 && j < dong.length && dong[j].startsWith('  ')) j++;
  const bgs = i < 0 ? '' : dong.slice(i, j).join(' ');
  if (!bgs.includes('sau nhịp')) loi.push('README: dòng bao-giam-sat không nêu quyết đổi sau nhịp');
  if (!khoiContext(ctx, 'Hàng kế của dãy').includes('đã quyết build')) loi.push('CONTEXT «Hàng kế của dãy» thiếu «đã quyết build»');
  return loi;
}
const README = () => fs.readFileSync(path.join(GOI, 'README.md'), 'utf8');
const CONTEXT = () => fs.readFileSync(path.join(KIT, 'CONTEXT.md'), 'utf8');

test('SDT-08 tai-lieu', () => {
  const loi = kiemTaiLieu(README(), CONTEXT());
  console.log(`  5 điều kiện tài liệu · thiếu: [${loi.join(', ')}]`);
  assert.deepEqual(loi, []);
});

test('SDT-08-do bo-cong-dang', () => {
  assert.deepEqual(kiemTaiLieu(README(), CONTEXT()), [], 'đối chứng dương');
  const sao = README().replaceAll('cong-dang', '');
  assert.notEqual(sao, README(), 'bước bỏ cong-dang không áp được');
  assert.deepEqual(kiemTaiLieu(sao, CONTEXT()), ['README thiếu cong-dang']);
});

// ---------- SDT-05: một khuôn lịch 30′ cho hai lệnh (AC-5, E5 — lỗi E2, DP4 Ngoài-2) ----------
const khoiLich = (md) => /<!-- <<<LICH-30 -->\n([\s\S]*?)<!-- LICH-30>>> -->/.exec(md ?? '')?.[1] ?? null;
const gon = (s) => (s ?? '').replace(/\s+/g, ' ');
const CAU_LICH_CU = 'đọc `trang-thai.json` của đợt và in một dòng';
export function kiemLich(moDot, tiepTuc, moDotCu) {
  const loi = [];
  const a = khoiLich(moDot);
  const b = khoiLich(tiepTuc);
  if (a == null) loi.push('mo-dot.md: thiếu khối LICH-30');
  if (b == null) loi.push('tiep-tuc.md: thiếu khối LICH-30');
  if (a != null && b != null && a !== b) loi.push('mo-dot.md: khối LICH-30 lệch tiep-tuc.md');
  for (const [ten, khoi] of [['mo-dot.md', a], ['tiep-tuc.md', b]]) {
    for (const can of ['get_usage', 'han-muc --nguon get-usage', 'danh-thuc --json']) if (khoi != null && !khoi.includes(can)) loi.push(`${ten}: khối LICH-30 thiếu ${can}`);
  }
  if (!gon(moDotCu).includes(CAU_LICH_CU)) loi.push('đối chứng: câu lịch cũ không có ở mo-dot.md của mốc so — phép vắng-mặt không chứng gì');
  if (gon(moDot).includes(CAU_LICH_CU)) loi.push('mo-dot.md: còn câu dựng lịch cũ (chỉ đọc trang-thai.json)');
  return loi;
}
const moDotTaiMoc = () => noiDungTai(KIT, mocSo(KIT).tu, 'dieu-phoi/commands/mo-dot.md');

test('SDT-05 lich-30', () => {
  const loi = kiemLich(docLenh('mo-dot.md'), docLenh('tiep-tuc.md'), moDotTaiMoc());
  console.log(`  khối LICH-30: mo-dot ${khoiLich(docLenh('mo-dot.md'))?.length ?? 0} ký tự · tiep-tuc ${khoiLich(docLenh('tiep-tuc.md'))?.length ?? 0} ký tự · lỗi: [${loi.join(', ')}]`);
  assert.deepEqual(loi, []);
});

test('SDT-05-do thieu-han-muc', () => {
  const moDot = docLenh('mo-dot.md');
  assert.deepEqual(kiemLich(moDot, docLenh('tiep-tuc.md'), moDotTaiMoc()), [], 'đối chứng dương');
  const khoi = khoiLich(moDot);
  const sao = moDot.replace(khoi, khoi.split('\n').filter((d) => !d.includes('han-muc')).join('\n'));
  assert.notEqual(sao, moDot, 'bước bỏ câu han-muc không áp được');
  const loi = kiemLich(sao, docLenh('tiep-tuc.md'), moDotTaiMoc());
  assert.ok(loi.includes('mo-dot.md: khối LICH-30 lệch tiep-tuc.md'), `phải nêu khối lệch: ${loi.join(' | ')}`);
});

// ---------- SDT-06: thẻ khởi tạo thôi hỏi khẩu vị hạn mức (AC-6, E6 — lỗi E1, DP4 Ngoài-1) ----------
const HM = { bao_truoc_pct: 70, ban_giao_pct: 85, cho_ban_giao_phut: 15, cho_dat_lai_phut: 30 };
async function kiemKhongHoi(gocGoi) {
  const { kho, dot } = dungDot({ hang: HAI_DAY, gocGoi, pha: 'nhap' });
  const p = path.join(dot, 'dieu-phoi.config.json');
  ghiJ(p, { ...docJ(p), han_muc: HM });
  const r = chayCli(kho, ['the', 'khoi-tao', '--json'], { gocGoi });
  assert.equal(r.ma, 0, r.err);
  const the = JSON.parse(r.out);
  const loi = [];
  for (const h of the.hoi) if (!/^(quyen-tu-merge|build:.+)$/.test(h)) loi.push(`hoi ${h} không có lối ghi`);
  if (JSON.stringify(the.han_muc) !== JSON.stringify(HM)) loi.push(`han_muc ${JSON.stringify(the.han_muc)}, cần ${JSON.stringify(HM)}`);
  const b3 = doanBuoc(docLenh('mo-dot.md'), 3);
  if (!b3.includes('han_muc') || !b3.includes('dieu-phoi.config.json')) loi.push('mo-dot.md bước 3: thiếu dòng thông tin ngưỡng han_muc và chỗ sửa dieu-phoi.config.json');
  return { loi, hoi: the.hoi };
}

test('SDT-06 khong-hoi-khau-vi', async () => {
  const { loi, hoi } = await kiemKhongHoi(GOI);
  console.log(`  hoi: ${JSON.stringify(hoi)}`);
  assert.deepEqual(loi, []);
});

test('SDT-06-do them-lai', async () => {
  const loi = await doHaiBan(async (g) => (await kiemKhongHoi(g)).loi, 'the.mjs', "hoi: ['quyen-tu-merge', ", "hoi: ['quyen-tu-merge', 'khau-vi-han-muc', ");
  assert.ok(loi.includes('hoi khau-vi-han-muc không có lối ghi'), `phải nêu khau-vi-han-muc: ${loi.join(' | ')}`);
});
