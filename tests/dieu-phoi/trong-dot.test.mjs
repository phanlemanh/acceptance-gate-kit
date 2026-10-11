// trong-dot.test.mjs — các ca của hồ sơ dieu-phoi-feature-loop-trong-dot (tên ca bắt đầu «DP7-»).
// Kho thử, worktree của dãy (`git worktree add`) và đợt do chính ca dựng trong thư mục tạm NGOÀI cây kit:
// đợt mở bằng CLI thật (`mo`, `pha`), hàng kế do một nhịp THẬT của bộ phát lịch (`motNhip`) ghi, rồi đọc
// bằng `tho` / `trong-dot.mjs` thật. Mọi đường suy từ vị trí tệp này. Mỗi phép đo có cặp hai chiều trên
// cùng fixture: bản lành xanh trước, bản bị tiêm đỏ sau, ghim thông điệp.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DAY_TEP = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(DAY_TEP, '..', '..');
const GOI = path.join(KIT, 'dieu-phoi');
const FL = path.join(KIT, 'feature-loop');

// Tập trạng thái hợp đồng (DP7-03 het-hang, DP7-04) rút từ lib của CÂY ĐANG KIỂM, không chép tay.
const WR = createRequire(import.meta.url)(path.join(KIT, 'lib', 'workspace-record.cjs'));
const ENUM_STATUS = WR.NAV_RULES['contract.md'].status.enum;
const DA_THONG_KIT = [...WR.DA_THONG_CONG_2, ...WR.DA_DONG_THUC_TE];

// Khoá máy của ca nằm trong thư mục tạm — đặt TRƯỚC mọi lần nạp mô-đun của gói.
const MAY_TAM = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'dp7-may-')));
process.env.DIEU_PHOI_MAY_DIR = MAY_TAM;

const canDon = [MAY_TAM];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = (tienTo = 'dp7-') => {
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
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, env: ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

// Danh sách tệp (đường tương đối → băm) của một cây, bỏ .git. Dùng cho «không ghi byte nào».
function anhCay(goc) {
  const ra = new Map();
  const di = (d) => {
    for (const ten of fs.readdirSync(d).sort()) {
      if (ten === '.git') continue;
      const p = path.join(d, ten);
      const st = fs.lstatSync(p);
      const rel = path.relative(goc, p);
      if (st.isSymbolicLink()) ra.set(rel, `L ${fs.readlinkSync(p)}`);
      else if (st.isDirectory()) { ra.set(rel, 'D'); di(p); }
      else ra.set(rel, crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'));
    }
  };
  di(goc);
  return ra;
}
const khacCay = (truoc, sau) => [...new Set([...truoc.keys(), ...sau.keys()])].filter((k) => truoc.get(k) !== sau.get(k)).sort();

function khoThu(tienTo = 'dp7-kho-') {
  const d = tam(tienTo);
  git(d, 'init', '-q', '-b', 'main');
  git(d, 'commit', '-q', '--allow-empty', '-m', 'goc');
  return d;
}

// Worktree THẬT của một dãy. `cho`: 'canh' (thư mục tạm cạnh kho) · 'trong' (.claude/worktrees/ của kho).
function themWorktree(kho, id, cho = 'canh') {
  const dich = cho === 'trong' ? path.join(kho, '.claude', 'worktrees', id.toLowerCase()) : path.join(tam(`dp7-wt-${id}-`), 'wt');
  fs.mkdirSync(path.dirname(dich), { recursive: true });
  git(kho, 'worktree', 'add', '-q', '-b', `day-${id}-${path.basename(path.dirname(dich))}`, dich);
  return fs.realpathSync(dich);
}

const CLI = (gocGoi = GOI) => path.join(gocGoi, 'scripts', 'dieu-phoi.mjs');
function chayCli(cwd, doiSo, { gocGoi = GOI } = {}) {
  const r = spawnSync(process.execPath, [CLI(gocGoi), ...doiSo], { cwd, env: ENV, encoding: 'utf8' });
  return { ma: r.status, out: r.stdout, err: r.stderr };
}
const nap = (gocGoi, tep) => import(`${path.join(gocGoi, 'scripts', tep)}?v=${Math.random()}`);

// Một đợt mở từ gói bằng CLI thật. `hang` mặc định: một hàng A trên P1. `wt`: worktree từng dãy đã có
// (mặc định tạo P1, P2 cạnh kho). `pha`: dang-chay (mặc định) · nhap.
function dungDot({ hang = null, wt = null, pha = 'dang-chay', gocGoi = GOI, tuMerge = null } = {}) {
  const kho = khoThu();
  const w = wt ? wt(kho) : { P1: themWorktree(kho, 'P1'), P2: themWorktree(kho, 'P2') };
  const dirGoi = path.join(kho, 'goi', 'dot-thu');
  ghiJ(path.join(dirGoi, 'dieu-phoi.config.json'), docJ(path.join(GOI, 'scripts', 'mau', 'dieu-phoi.config.json')));
  ghiJ(path.join(dirGoi, 'hang-viec.json'), {
    dot: '',
    day: Object.entries(w).map(([id, worktree]) => ({ id, worktree })),
    hang: hang ?? [{ ma: 'A', slug: 'hang-a', day: 'P1', uu_tien: 1 }],
    ngoai_hang_merge: [],
  });
  ghiT(path.join(dirGoi, 'LUAT-rieng.md'), '# Luật riêng của kho thử\n');
  ghiT(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\ndieu_phoi:\n  goi_dot: goi/dot-{ten}\n');
  const mo = chayCli(kho, ['mo', 'thu'], { gocGoi });
  assert.equal(mo.ma, 0, `mo thu: ${mo.err}`);
  if (pha === 'dang-chay') {
    const p = chayCli(kho, ['pha', 'dang-chay', '--boi', 't', ...(tuMerge ? ['--tu-merge', tuMerge] : [])], { gocGoi });
    assert.equal(p.ma, 0, `pha dang-chay: ${p.err}`);
  }
  const dot = fs.realpathSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  return { kho, dot, w };
}

// io giả của một nhịp: sức khoẻ lành, gh rỗng; `git show origin/main:_acceptance/<slug>/contract.md` trả
// trạng thái theo bảng `tren` (vắng → không có tệp).
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
function tho(cwd, { gocGoi = GOI, slug = null } = {}) {
  const r = chayCli(cwd, ['tho', '--json', ...(slug ? ['--slug', slug] : [])], { gocGoi });
  assert.equal(r.ma, 0, `tho: ${r.err}`);
  return JSON.parse(r.out);
}
const hopDong = (goc, slug, st) => ghiT(path.join(goc, '_acceptance', slug, 'contract.md'), `---\nslug: ${slug}\nstatus: ${st}\n---\n`);
const oCoHoi = (goc, slug, { stage = 'decided', decision = '' } = {}) =>
  ghiT(path.join(goc, '_acceptance', slug, 'opportunity.md'), `---\nslug: ${slug}\nstage: ${stage}\ndecision: ${decision}\n---\n`);
const chepGoi = () => {
  const sao = path.join(tam('dp7-goi-'), 'dieu-phoi');
  fs.cpSync(GOI, sao, { recursive: true });
  return sao;
};
const tiem = (p, cu, moi) => { // cu: chuỗi hoặc RegExp
  const goc = fs.readFileSync(p, 'utf8');
  const sau = goc.replace(cu, moi);
  assert.notEqual(sau, goc, `bước tiêm không áp được vào ${path.basename(p)}`);
  fs.writeFileSync(p, sau);
};

// ---------- DP7-02: lệnh tho — khoá, chỉ đọc, ngoài dãy, không đợt (AC-2, E2) ----------
const KHOA_THO = ['day', 'dot', 'hang_ke', 'luat', 'pha', 'thu_muc', 'trong_dot', 'tu_merge', 'viec_ke'];

async function kiemTho(gocGoi) {
  const { kho, dot, w } = dungDot({ gocGoi });
  oCoHoi(kho, 'hang-a', { decision: 'build' });
  await nhip(dot, { gocGoi });
  const truoc = anhCay(dot);
  const kq = tho(w.P1, { gocGoi });
  const loi = [];
  const moi = khacCay(truoc, anhCay(dot));
  if (moi.length) loi.push(`tho ghi vào thư mục đợt: ${moi.join(', ')}`);
  const khoa = Object.keys(kq).filter((k) => k !== 'ly_do').sort();
  if (khoa.join(',') !== KHOA_THO.join(',')) loi.push(`tập khoá [${khoa}] cần [${KHOA_THO}]`);
  if (!kq.hang_ke || !['slug', 'moi', 'quyet'].every((k) => k in kq.hang_ke)) loi.push('hang_ke thiếu slug/moi/quyet');
  if (!(path.isAbsolute(kq.luat ?? '') && kq.luat.endsWith('LUAT.md') && fs.existsSync(kq.luat))) loi.push(`luat không phải đường LUAT.md có thật: ${kq.luat}`);
  const tiep = docJ(path.join(dot, 'tiep', 'P1.json'));
  if (kq.hang_ke?.slug !== tiep.hang) loi.push(`hang_ke.slug ${kq.hang_ke?.slug} ≠ tiep ${tiep.hang}`);
  if (kq.day !== 'P1' || kq.trong_dot !== true) loi.push(`day/trong_dot sai: ${kq.day} ${kq.trong_dot}`);
  return { loi, kq, kho };
}

test('DP7-02 khoa-du', async () => {
  const { loi, kq } = await kiemTho(GOI);
  console.log(`  khoá: ${Object.keys(kq).sort().join(', ')} · viec_ke ${kq.viec_ke}`);
  assert.deepEqual(loi, []);
});

test('DP7-02 ngoai-day', async () => {
  const { kho } = dungDot();
  assert.deepEqual(tho(kho), { trong_dot: false, ly_do: 'khong-phai-tho' });
});

test('DP7-02 khong-dot', () => {
  const kho = khoThu();
  assert.deepEqual(tho(kho), { trong_dot: false, ly_do: 'khong-dot' });
});

test('DP7-02-do ghi', async () => {
  const sao = chepGoi();
  const p = path.join(sao, 'scripts', 'tho.mjs');
  tiem(p, "import path from 'node:path';", "import fs from 'node:fs';\nimport path from 'node:path';");
  tiem(p, '  const tiep = docJson(', "  fs.writeFileSync(path.join(thuMuc, 'tho-ghi.json'), '{}');\n  const tiep = docJson(");
  const { loi } = await kiemTho(sao);
  assert.ok(loi.some((l) => l.includes('tho-ghi.json')), `phải nêu tệp mới tho-ghi.json: ${loi.join(' | ')}`);
});

// ---------- DP7-03: việc kế của thợ — ma trận đầu vào (AC-3, E3) ----------
// Mỗi hàng: tên · hàng của đợt · dựng trước nhịp · dựng sau nhịp · --slug · viec_ke mong · mẩu ly_do mong (null =
// không xét). Năm hàng gác quyết (vang · discovery · park · kill · iterate) dựng ô build TRƯỚC nhịp rồi đổi ô SAU
// nhịp: từ hồ sơ dieu-phoi-sua-truoc-dot-thu (B1) bộ phát lịch của đợt mở từ gói không giao hàng chưa quyết build,
// nên gác `bao-giam-sat` của thợ là lưới cho ca quyết đổi sau khi nhịp đã ghi tiep/ — ca đo đúng ca ấy.
const A = { ma: 'A', slug: 'hang-a', day: 'P1', uu_tien: 1 };
const oBuild = ({ kho }) => oCoHoi(kho, 'hang-a', { decision: 'build' });
const MA_TRAN_KE = [
  { ten: 'chi-hop-dong', dung: ({ kho }) => hopDong(kho, 'hang-a', 'draft'), mong: 'mo-hang' },
  { ten: 'o-build', dung: ({ kho }) => oCoHoi(kho, 'hang-a', { decision: 'build' }), mong: 'mo-hang' },
  { ten: 'o-build-chi-o-worktree', dung: ({ w }) => oCoHoi(w.P1, 'hang-a', { decision: 'build' }), mong: 'mo-hang' },
  { ten: 'khong-ma', hang: [{ slug: 'viec-x', day: 'P1' }], dung: () => {}, mong: 'mo-hang' },
  { ten: 'vang', dung: oBuild, sauNhip: ({ kho }) => fs.rmSync(path.join(kho, '_acceptance', 'hang-a'), { recursive: true }), mong: 'bao-giam-sat', lyDo: 'hang-a' },
  { ten: 'discovery', dung: oBuild, sauNhip: ({ kho }) => oCoHoi(kho, 'hang-a', { stage: 'discovery' }), mong: 'bao-giam-sat', lyDo: 'hang-a' },
  { ten: 'park', dung: oBuild, sauNhip: ({ kho }) => oCoHoi(kho, 'hang-a', { decision: 'park' }), mong: 'bao-giam-sat', lyDo: 'park' },
  { ten: 'kill', dung: oBuild, sauNhip: ({ kho }) => oCoHoi(kho, 'hang-a', { decision: 'kill' }), mong: 'bao-giam-sat', lyDo: 'kill' },
  { ten: 'iterate', dung: oBuild, sauNhip: ({ kho }) => oCoHoi(kho, 'hang-a', { decision: 'iterate' }), mong: 'bao-giam-sat', lyDo: 'iterate' },
  { ten: 'slug-trung-tiep', dung: ({ kho }) => oCoHoi(kho, 'hang-a', { decision: 'build' }), slug: 'hang-a', mong: 'cho-nhip', lyDo: 'hang-a' },
  { ten: 'nghi', dung: ({ kho }) => assert.equal(chayCli(kho, ['hang', 'nghi', 'P1']).ma, 0), mong: 'cho', lyDo: 'nghi' },
  {
    ten: 'cho-phu-thuoc',
    hang: [{ ma: 'A', slug: 'hang-a', day: 'P2' }, { ma: 'B', slug: 'hang-b', day: 'P1', sau: ['A'] }],
    dung: ({ kho }) => oCoHoi(kho, 'hang-b', { decision: 'build' }),
    mong: 'cho',
    lyDo: 'phu-thuoc',
  },
  { ten: 'tam-dung', dung: ({ kho }) => assert.equal(chayCli(kho, ['pha', 'tam-dung', '--boi', 't']).ma, 0), mong: 'cho', lyDo: 'tam-dung' },
  { ten: 'het-hang', dung: ({ w }) => hopDong(w.P1, 'hang-a', WR.DA_THONG_CONG_2[0]), mong: 'xong' },
];

async function kiemMaTranKe(gocGoi) {
  const loi = [];
  const thay = new Set();
  let chay = 0;
  for (const h of MA_TRAN_KE) {
    const ctx = dungDot({ hang: h.hang ?? [A], gocGoi });
    h.dung(ctx);
    await nhip(ctx.dot, { gocGoi });
    if (h.sauNhip) h.sauNhip(ctx);
    const kq = tho(ctx.w.P1, { gocGoi, slug: h.slug ?? null });
    chay++;
    thay.add(kq.viec_ke);
    if (kq.viec_ke !== h.mong) {
      loi.push(kq.viec_ke === 'mo-hang' ? `${h.ten} mở được` : `${h.ten}: viec_ke ${kq.viec_ke} (mong ${h.mong})`);
    } else if (h.lyDo && !(kq.ly_do ?? '').includes(h.lyDo)) loi.push(`${h.ten}: ly_do «${kq.ly_do}» thiếu «${h.lyDo}»`);
  }
  return { loi, thay, chay };
}

test('DP7-03 ma-tran', async () => {
  const { loi, chay } = await kiemMaTranKe(GOI);
  console.log(`  số hàng chạy: ${chay} / độ dài ma trận: ${MA_TRAN_KE.length}`);
  assert.equal(chay, MA_TRAN_KE.length);
  assert.equal(MA_TRAN_KE.length, 14);
  assert.deepEqual(loi, []);
});

test('DP7-03 tap-viec-ke', async () => {
  const { VIEC_KE } = await nap(GOI, 'tho.mjs');
  const { thay } = await kiemMaTranKe(GOI);
  assert.deepEqual([...thay].sort(), [...VIEC_KE].sort());
});

test('DP7-03-do bo-quyet', async () => {
  const sao = chepGoi();
  tiem(path.join(sao, 'scripts', 'tho.mjs'), 'const q = quyetCua(gocKhoChinh(cwd), day, hang);', "const q = { tt: 'da-quyet' };");
  const { loi } = await kiemMaTranKe(sao);
  assert.ok(loi.includes('park mở được'), `phải nêu «park mở được»: ${loi.join(' | ')}`);
});

test('DP7-03-do chi-chan-park', async () => {
  const sao = chepGoi();
  tiem(path.join(sao, 'scripts', 'tho.mjs'), "if (q.tt === 'da-quyet') return ra('mo-hang');", "if (q.tt === 'da-quyet' || (q.tt === 'khong-build' && q.decision !== 'park')) return ra('mo-hang');");
  const { loi } = await kiemMaTranKe(sao);
  assert.ok(loi.includes('kill mở được'), `phải nêu «kill mở được»: ${loi.join(' | ')}`);
  assert.ok(!loi.includes('park mở được'), 'bản tiêm vẫn chặn park');
});


// ---------- DP7-05: quyền tự merge theo thẻ khởi tạo (AC-5, E5) ----------
const dieuKhien = (dot) => docJ(path.join(dot, 'dieu-khien.json'));

for (const [chu, giaTri] of [['co', true], ['khong', false]]) {
  test(`DP7-05 ${chu}`, () => {
    const { kho, dot, w } = dungDot({ tuMerge: chu });
    assert.equal(dieuKhien(dot).tu_merge, giaTri);
    assert.equal(chayCli(kho, ['pha', 'tam-dung', '--boi', 't']).ma, 0);
    assert.equal(chayCli(kho, ['pha', 'dang-chay', '--boi', 't']).ma, 0);
    assert.equal(dieuKhien(dot).tu_merge, giaTri, 'tu_merge phải sống qua tam-dung → dang-chay không cờ');
    assert.equal(tho(w.P1).tu_merge, giaTri);
  });
}

test('DP7-05 vang', () => {
  const { dot, w } = dungDot();
  assert.equal('tu_merge' in dieuKhien(dot), false);
  assert.equal(tho(w.P1).tu_merge, null);
});

test('DP7-05-do gia-tri-sai', () => {
  const { kho, dot } = dungDot({ pha: 'nhap' });
  const p = path.join(dot, 'dieu-khien.json');
  const truoc = fs.readFileSync(p);
  const r = chayCli(kho, ['pha', 'dang-chay', '--boi', 't', '--tu-merge', 'maybe']);
  assert.equal(r.ma, 1);
  assert.match(r.err, /maybe/);
  assert.deepEqual(fs.readFileSync(p), truoc);
});

test('DP7-05-do sai-pha', () => {
  const { kho, dot } = dungDot();
  const p = path.join(dot, 'dieu-khien.json');
  const truoc = fs.readFileSync(p);
  const r = chayCli(kho, ['pha', 'tam-dung', '--boi', 't', '--tu-merge', 'co']);
  assert.equal(r.ma, 1);
  assert.match(r.err, /--tu-merge chỉ đặt khi chuyển sang dang-chay/);
  assert.deepEqual(fs.readFileSync(p), truoc);
});

test('DP7-05 mo-dot-md', () => {
  const t = fs.readFileSync(path.join(GOI, 'commands', 'mo-dot.md'), 'utf8');
  const iKhoi = t.indexOf('<!-- CHU-QUYET-CUA-NGUOI>>> -->');
  const dong = t.split('\n').find((d) => /^5\. \*\*Chạy\.\*\*/.test(d)) ?? '';
  const iDong = t.indexOf(dong);
  assert.ok(dong.includes('pha dang-chay') && dong.includes('--tu-merge'), `bước 5 phải gọi pha dang-chay kèm --tu-merge: «${dong}»`);
  assert.ok(iKhoi >= 0 && iDong > iKhoi, 'bước 5 phải đứng sau khối CHU-QUYET-CUA-NGUOI');
});

// ---------- DP7-04: hàng đã thông bước sang hàng kế (AC-4, E4) ----------
const HAI_HANG = [
  { ma: 'A', slug: 'hang-a', day: 'P1', uu_tien: 1 },
  { ma: 'B', slug: 'hang-b', day: 'P1', uu_tien: 2 },
];

async function kiemTrangThai(gocGoi) {
  const loi = [];
  for (const st of ENUM_STATUS) {
    const { kho, dot, w } = dungDot({ hang: HAI_HANG, gocGoi });
    oCoHoi(kho, 'hang-b', { decision: 'build' });
    hopDong(w.P1, 'hang-a', st);
    await nhip(dot, { gocGoi });
    const tiep = docJ(path.join(dot, 'tiep', 'P1.json'));
    const thong = DA_THONG_KIT.includes(st);
    if (thong) {
      if (tiep.hang !== 'hang-b') loi.push(`${st}: A vẫn đang làm (tiep ${tiep.hang})`);
      else {
        const kq = tho(w.P1, { gocGoi, slug: 'hang-a' });
        if (kq.viec_ke !== 'mo-hang' || kq.hang_ke.slug !== 'hang-b') loi.push(`${st}: tho ra ${kq.viec_ke} ${kq.hang_ke.slug}`);
      }
    } else if (tiep.hang !== 'hang-a') loi.push(`${st}: A rời hàng đang làm sớm (tiep ${tiep.hang})`);
  }
  return loi;
}

test('DP7-04 ma-tran-trang-thai', async () => {
  console.log(`  số ô: ${ENUM_STATUS.length} (${ENUM_STATUS.join(', ')})`);
  assert.deepEqual(await kiemTrangThai(GOI), []);
});

test('DP7-04 nhanh-chinh', async () => {
  const hang = [{ ma: 'A', slug: 'hang-a', day: 'P2' }, { ma: 'B', slug: 'hang-b', day: 'P1', sau: ['A'] }];
  const { kho, dot, w } = dungDot({ hang });
  oCoHoi(kho, 'hang-b', { decision: 'build' });
  await nhip(dot, { tren: { 'hang-a': 'machine-cleared' } });
  assert.equal(docJ(path.join(dot, 'tiep', 'P1.json')).hang, 'hang-b');
  assert.equal(tho(w.P1).viec_ke, 'mo-hang');
});

// «Xong» cùng nghĩa với trang lộ trình: classify của product-map + DA_GIAO_O của lo-trinh, trên hồ sơ THẬT của
// cây đang kiểm (một hồ sơ không hỏng mỗi trạng thái); trạng thái chưa có hồ sơ thật → hồ sơ tối thiểu.
async function kiemTapKit(daThong) {
  const { classify } = await import(path.join(KIT, 'scripts', 'product-map.mjs'));
  const { DA_GIAO_O } = await import(path.join(KIT, 'scripts', 'lo-trinh.mjs'));
  const goc = path.join(KIT, '_acceptance');
  const theoTrangThai = new Map();
  for (const slug of fs.readdirSync(goc).sort()) {
    const p = path.join(goc, slug, 'contract.md');
    if (!fs.existsSync(p)) continue;
    const st = /^status:[ \t]*(\S+)/m.exec(fs.readFileSync(p, 'utf8'))?.[1];
    if (!st || theoTrangThai.has(st)) continue;
    const k = classify(path.join(goc, slug), slug);
    if (k.key !== 'hong') theoTrangThai.set(st, { nguon: slug, key: k.key });
  }
  const loi = [];
  const nguon = [];
  for (const st of ENUM_STATUS) {
    let o = theoTrangThai.get(st);
    if (!o) {
      const dir = path.join(tam('dp7-hs-'), 'x');
      ghiT(path.join(dir, 'contract.md'), `---\nslug: x\nfeature: x\nrisk_tier: T2\nstatus: ${st}\n---\n`);
      o = { nguon: 'tối thiểu', key: classify(dir, 'x').key };
    }
    nguon.push(`${st}←${o.nguon}:${o.key}`);
    if (o.key === 'hong') loi.push(`${st}: hồ sơ hỏng, không so được`);
    else if (DA_GIAO_O.includes(o.key) !== daThong.includes(st)) loi.push(`${st}: trang lộ trình ${DA_GIAO_O.includes(o.key) ? 'đã giao' : 'chưa giao'}, gói ${daThong.includes(st) ? 'đã thông' : 'chưa thông'}`);
  }
  return { loi, nguon };
}

test('DP7-04 tap-kit', async () => {
  const { DA_THONG } = await nap(GOI, 'phat-lich.mjs');
  const t = fs.readFileSync(path.join(GOI, 'scripts', 'phat-lich.mjs'), 'utf8');
  assert.match(t, /\/\/ <<<DA-THONG\nexport const DA_THONG = \[[^\n]*\];\n\/\/ DA-THONG>>>/, 'DA_THONG phải nằm giữa marker DA-THONG');
  const { loi, nguon } = await kiemTapKit(DA_THONG);
  console.log(`  số ô so: ${nguon.length} / enum ${ENUM_STATUS.length} · ${nguon.join(' · ')}`);
  assert.equal(nguon.length, ENUM_STATUS.length);
  assert.deepEqual(loi, []);
});

test('DP7-04-do tap-kit', async () => {
  // Bản chép bị tiêm: tập đã thông thiếu machine-cleared.
  const { loi } = await kiemTapKit(DA_THONG_KIT.filter((s) => s !== 'machine-cleared'));
  assert.ok(loi.some((l) => l.startsWith('machine-cleared: trang lộ trình đã giao')), `phải nêu machine-cleared lệch: ${loi.join(' | ')}`);
});

test('DP7-04-do bo-machine-cleared', async () => {
  const sao = chepGoi();
  tiem(path.join(sao, 'scripts', 'phat-lich.mjs'), "'machine-cleared', 'da-cham-boi-thuc-te'", "'da-cham-boi-thuc-te'");
  const loi = await kiemTrangThai(sao);
  assert.ok(loi.some((l) => l.startsWith('machine-cleared: A vẫn đang làm')), `phải nêu «A vẫn đang làm»: ${loi.join(' | ')}`);
});

// ---------- DP7-07: chờ người một danh sách (AC-7, E7) ----------
// Yêu cầu can-nguoi do bên viết máy của gói ghi khi gói có (`ghiYeuCau`); gói chưa có thì dựng đúng các tên
// trường mà dòng «Yêu cầu» của LUAT.md vừa sinh khai — rút rỗng là đỏ.
async function ghiCanNguoi(gocGoi, dot, cwdDay, phien) {
  const tepGhi = path.join(gocGoi, 'scripts', 'ghi.mjs');
  if (fs.existsSync(tepGhi)) {
    const { ghiYeuCau } = await import(`${tepGhi}?v=${Math.random()}`);
    return ghiYeuCau(cwdDay, { loai: 'can-nguoi', hang: 'hang-b', noiDung: { cau_hoi: 'chọn a hay b?' } });
  }
  const luat = fs.readFileSync(path.join(dot, 'LUAT.md'), 'utf8');
  const truong = /yeu-cau\/<phiên>-<số>\.json` = `\{([^}]*)\}`/.exec(luat)?.[1]?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];
  if (truong.length === 0) assert.fail('LUAT.md không có khuôn yêu cầu');
  const giaTri = { phien, loai: 'can-nguoi', hang: 'hang-b', noi_dung: { cau_hoi: 'chọn a hay b?' }, luc: new Date().toISOString() };
  const du = Object.fromEntries(truong.map((k) => [k, giaTri[k]]));
  const p = path.join(dot, 'yeu-cau', `${phien}-1.json`);
  ghiJ(p, du);
  return p;
}

async function kiemChoNguoi(gocGoi) {
  const loi = [];
  const hang = [{ ma: 'A', slug: 'hang-a', day: 'P1' }, { ma: 'B', slug: 'hang-b', day: 'P2' }];
  const { kho, dot, w } = dungDot({ hang, gocGoi });
  const { xuLyChoNguoi } = await nap(gocGoi, 'hook-cho-nguoi.mjs');
  assert.equal(xuLyChoNguoi({ hook_event_name: 'Notification', notification_type: 'idle_prompt', message: 'chờ anh', cwd: w.P1, session_id: 's1' }), 'ghi');
  await ghiCanNguoi(gocGoi, dot, w.P2, 'P2');
  await nhip(dot, { gocGoi });
  const tt = docJ(path.join(dot, 'trang-thai.json'));
  const ds = tt.cho_nguoi ?? [];
  const p2 = ds.find((c) => c.phien === 'P2');
  if (!p2) loi.push('can-nguoi không lên bảng');
  else if (p2.loai !== 'can-nguoi') loi.push(`mục P2 loai ${p2.loai}`);
  if (ds.length !== 2) loi.push(`cho_nguoi có ${ds.length} mục, cần 2`);
  const xem = chayCli(kho, ['xem'], { gocGoi }).out;
  const dongCho = xem.split('\n').filter((d) => d.trim().startsWith('chờ người '));
  if (dongCho.length !== 2) loi.push(`xem in ${dongCho.length} dòng «chờ người», cần 2`);
  const dem = () => JSON.parse(chayCli(kho, ['dem', '--json'], { gocGoi }).out).goi_chu_kho.tong;
  if (dem() !== 2) loi.push(`dem đếm ${dem()} lần gọi chủ kho, cần 2`);
  return { loi, kho, dot, dem };
}

test('DP7-07 luat-co-loai', () => {
  const { dot } = dungDot();
  const luat = fs.readFileSync(path.join(dot, 'LUAT.md'), 'utf8');
  for (const loai of ['can-nguoi', 'hang-moi']) assert.ok(luat.includes(`\`${loai}\``), `LUAT.md phải liệt «${loai}» trong các loại yêu cầu`);
});

test('DP7-07 mot-danh-sach', async () => {
  const { loi } = await kiemChoNguoi(GOI);
  assert.deepEqual(loi, []);
});

test('DP7-07 nhip-hai', async () => {
  const { loi, dot, dem } = await kiemChoNguoi(GOI);
  assert.deepEqual(loi, []);
  await nhip(dot);
  assert.equal(dem(), 2, 'nhịp thứ hai không được đếm thêm');
});

test('DP7-07 tra-loi', async () => {
  const { loi, dot } = await kiemChoNguoi(GOI);
  assert.deepEqual(loi, []);
  const ten = fs.readdirSync(path.join(dot, 'yeu-cau')).find((f) => f.startsWith('P2-') && f.endsWith('.json'));
  ghiJ(path.join(dot, 'tra-loi', ten), { ket_qua: 'duyet', boi: 'giam-sat', ly_do: 'chọn a', luc: new Date().toISOString() });
  await nhip(dot);
  const ds = docJ(path.join(dot, 'trang-thai.json')).cho_nguoi;
  assert.deepEqual(ds.map((c) => c.phien), ['P1']);
});

test('DP7-07-do chi-tep', async () => {
  const sao = chepGoi();
  tiem(path.join(sao, 'scripts', 'phat-lich.mjs'), '    ...choNguoiYeuCau(thuMuc, lienKetCua),\n', '');
  const { loi } = await kiemChoNguoi(sao);
  assert.ok(loi.includes('can-nguoi không lên bảng'), `phải nêu «can-nguoi không lên bảng»: ${loi.join(' | ')}`);
});

// ---------- DP7-06: lời chặn S4 trong dãy là «chờ lượt» (AC-6, E6) ----------
// Bản base = merge-base của HEAD với origin/main (vắng → main) của CÂY ĐANG KIỂM, lấy TRỌN thư mục scripts
// bằng git archive (không chép danh sách tệp tay).
function goiBase() {
  let base;
  try {
    base = git(KIT, 'merge-base', 'HEAD', 'origin/main').trim();
  } catch {
    base = git(KIT, 'merge-base', 'HEAD', 'main').trim();
  }
  const dich = tam('dp7-base-');
  const tar = execFileSync('git', ['archive', base, 'dieu-phoi/scripts'], { cwd: KIT, env: ENV });
  execFileSync('tar', ['-x', '-C', dich], { input: tar });
  return { base, goi: path.join(dich, 'dieu-phoi') };
}
const s4Workflow = (cwd) => JSON.stringify({ hook_event_name: 'PreToolUse', session_id: 's', cwd, tool_name: 'Workflow', tool_input: { scriptPath: '/x/acceptance-verify.js' } });

async function haiLoiChan() {
  const { dot, w, kho } = dungDot();
  ghiJ(path.join(dot, 'khoa', 's4', 'chu.json'), { phien: 'P1', worktree: w.P1, loai: 's4', han_thue_den: new Date(Date.now() + 3600e3).toISOString() });
  const { goi, base } = goiBase();
  const moi = await nap(GOI, 'hook-chan-s4.mjs');
  const cu = await nap(goi, 'hook-chan-s4.mjs');
  return { dot, base, trong: [moi.chayHook(s4Workflow(w.P2)), cu.chayHook(s4Workflow(w.P2))], ngoai: [moi.chayHook(s4Workflow(kho)), cu.chayHook(s4Workflow(kho))] };
}

test('DP7-06 trong-day', async () => {
  const { dot, base, trong: [moi, cu] } = await haiLoiChan();
  console.log(`  base ${base.slice(0, 12)} · lời chặn: ${moi.loi}`);
  assert.equal(moi.ma, 2);
  assert.ok(moi.loi.startsWith(cu.loi), `phải giữ nguyên tiền tố cũ «${cu.loi}»`);
  for (const chu of ['P2', 'chờ lượt', 'không hỏi người', 'không chấm lại', path.join(dot, 'LUAT.md')]) assert.ok(moi.loi.includes(chu), `lời chặn thiếu «${chu}»`);
});

test('DP7-06 ngoai-day', async () => {
  const { ngoai: [moi, cu] } = await haiLoiChan();
  assert.equal(moi.ma, 2);
  assert.equal(moi.loi, cu.loi);
});

// ---------- DP7-01: trong-dot.mjs nhận biết đợt, kho không đợt im (AC-1, E1) ----------
const TRONG_DOT = path.join(FL, 'scripts', 'trong-dot.mjs');
function chayTrongDot(script, cwd, slug = null) {
  const r = spawnSync(process.execPath, [script, '--root', cwd, ...(slug ? ['--slug', slug] : [])], { cwd, env: ENV, encoding: 'utf8' });
  return { ma: r.status, out: r.stdout, err: r.stderr };
}
// Ba hình dạng worktree của dãy P1, mỗi hình dạng một đợt riêng, lõi chép bằng chepLoi THẬT.
const HINH_DANG = {
  trong: (kho) => ({ P1: themWorktree(kho, 'P1', 'trong') }),
  canh: (kho) => ({ P1: themWorktree(kho, 'P1', 'canh') }),
  chinh: (kho) => ({ P1: fs.realpathSync(kho) }),
};
async function dotCoLoi(wt) {
  const ctx = dungDot({ wt });
  oCoHoi(ctx.kho, 'hang-a', { decision: 'build' });
  const { chepLoi } = await nap(GOI, 'dieu-phoi.mjs');
  chepLoi(ctx.dot);
  await nhip(ctx.dot);
  return ctx;
}
async function kiemNhanBiet(script) {
  const loi = [];
  for (const [ten, wt] of Object.entries(HINH_DANG)) {
    const { dot, w } = await dotCoLoi(wt);
    const r = chayTrongDot(script, w.P1);
    if (r.ma !== 0) { loi.push(`${ten}: thoát ${r.ma} ${r.err}`); continue; }
    if (r.out === '') { loi.push(`${ten}: không thấy đợt`); continue; }
    const dong = r.out.split('\n').filter(Boolean);
    const loiCua = spawnSync(process.execPath, [path.join(dot, 'loi', 'dieu-phoi.mjs'), 'tho', '--json'], { cwd: w.P1, env: ENV, encoding: 'utf8' }).stdout;
    let kq = null;
    try { kq = JSON.parse(dong[0]); } catch { kq = null; }
    if (dong.length !== 1 || !kq || kq.trong_dot !== true || kq.day !== 'P1') loi.push(`${ten}: đầu ra lạ «${r.out}»`);
    else if (r.out !== loiCua) loi.push(`${ten}: khác đầu ra tho của bản lõi`);
  }
  return loi;
}

test('DP7-01 khong-dot', () => {
  const kho = khoThu();
  const truoc = anhCay(kho);
  const r = chayTrongDot(TRONG_DOT, kho);
  assert.deepEqual([r.ma, r.out, r.err], [0, '', '']);
  assert.deepEqual(khacCay(truoc, anhCay(kho)), []);
});

test('DP7-01 khong-phai-tho', async () => {
  const { kho, dot } = await dotCoLoi(null);
  const truoc = anhCay(dot);
  const r = chayTrongDot(TRONG_DOT, kho);
  assert.deepEqual([r.ma, r.out, r.err], [0, '', '']);
  assert.deepEqual(khacCay(truoc, anhCay(dot)), []);
});

test('DP7-01 tho', async () => {
  console.log(`  số hình dạng: ${Object.keys(HINH_DANG).length} (${Object.keys(HINH_DANG).join(', ')})`);
  assert.equal(Object.keys(HINH_DANG).length, 3);
  assert.deepEqual(await kiemNhanBiet(TRONG_DOT), []);
});

test('DP7-01 loi-cu', async () => {
  const { dot, w } = await dotCoLoi(null);
  tiem(path.join(dot, 'loi', 'dieu-phoi.mjs'), /\n {6}tho: \(\) => [^\n]*/, '');
  const cu = chayTrongDot(TRONG_DOT, w.P1);
  assert.equal(cu.ma, 0);
  assert.match(cu.out, /^trong-dot: lõi của đợt thu chưa có lệnh tho[^\n]*\n$/);
  fs.rmSync(path.join(dot, 'loi'), { recursive: true });
  const vang = chayTrongDot(TRONG_DOT, w.P1);
  assert.equal(vang.ma, 0);
  assert.match(vang.out, /^trong-dot: đợt thu chưa có bản lõi[^\n]*\n$/);
});

test('DP7-01 ten-lien-ket', async () => {
  const fl = await import(`${TRONG_DOT}?v=${Math.random()}`);
  const { TEN_LIEN_KET } = await nap(GOI, 'dot.mjs');
  assert.equal(fl.TEN_LIEN_KET, TEN_LIEN_KET);
});

for (const [ten, cu, moi] of [
  ['sai-ten', "'dieu-phoi-hien-tai'", "'dieu-phoi-khac'"],
  ['show-toplevel', "['rev-parse', '--path-format=absolute', '--git-common-dir']", "['rev-parse', '--show-toplevel', '--path-format=absolute']"],
]) {
  test(`DP7-01-do ${ten}`, async () => {
    const sao = path.join(tam('dp7-fl-'), 'trong-dot.mjs');
    fs.copyFileSync(TRONG_DOT, sao);
    tiem(sao, cu, moi);
    if (ten === 'show-toplevel') tiem(sao, 'path.dirname(chung)', 'path.join(chung, "x")');
    const loi = await kiemNhanBiet(sao);
    assert.ok(loi.some((l) => l === 'canh: không thấy đợt'), `phải nêu «canh: không thấy đợt»: ${loi.join(' | ')}`);
  });
}

// ---------- DP7-08: khối TRONG-DOT của SKILL feature-loop (AC-8, E8) ----------
const SKILL = path.join(FL, 'skills', 'feature-loop', 'SKILL.md');
const khoiTrongDot = (t) => {
  const m = [...t.matchAll(/<!-- <<<TRONG-DOT -->\n([\s\S]*?)<!-- TRONG-DOT>>> -->/g)];
  return m.length === 1 ? m[0][1] : null;
};
// Dòng lệnh nhận biết RÚT từ khối: đoạn trong backtick đầu tiên có «trong-dot.mjs».
const lenhTrongKhoi = (khoi) => /`([^`]*trong-dot\.mjs[^`]*)`/.exec(khoi)?.[1] ?? null;

async function kiemKhoi(tepSkill) {
  const loi = [];
  const khoi = khoiTrongDot(fs.readFileSync(tepSkill, 'utf8'));
  if (khoi === null) return ['SKILL phải có đúng một cặp marker TRONG-DOT'];
  const { VIEC_KE } = await nap(GOI, 'tho.mjs');
  for (const v of VIEC_KE) {
    const n = khoi.split(`\`${v}\` →`).length - 1;
    if (n !== 1) loi.push(`${v}: ${n} dòng hướng dẫn, cần 1`);
  }
  const lenh = lenhTrongKhoi(khoi);
  if (!lenh) return [...loi, 'khối không có dòng lệnh trong-dot.mjs'];
  const chay = (cwd) => spawnSync('bash', ['-c', lenh.replaceAll('$WORKFLOWS_DIR', path.join(FL, 'workflows'))], { cwd, env: ENV, encoding: 'utf8' });
  const khong = chay(khoThu());
  if (khong.status !== 0 || khong.stdout !== '') loi.push(`không chạy được ngoài kho kit (kho không đợt: thoát ${khong.status}, «${khong.stdout}${khong.stderr}»)`);
  const { w } = await dotCoLoi(null);
  const co = chay(w.P1);
  let kq = null;
  try { kq = JSON.parse(co.stdout); } catch { kq = null; }
  if (co.status !== 0 || kq?.day !== 'P1') loi.push(`không chạy được ngoài kho kit (đợt + dãy P1: thoát ${co.status}, «${co.stdout}${co.stderr}»)`);
  return loi;
}

test('DP7-08 khoi-co-mat', () => {
  assert.notEqual(khoiTrongDot(fs.readFileSync(SKILL, 'utf8')), null, 'SKILL phải có đúng một cặp marker TRONG-DOT');
});

const laLoiLenh = (l) => l.startsWith('không chạy được') || l.startsWith('khối không có dòng lệnh');
test('DP7-08 viec-ke', async () => {
  assert.deepEqual((await kiemKhoi(SKILL)).filter((l) => !laLoiLenh(l)), []);
});

test('DP7-08 lenh-chay-duoc', async () => {
  assert.deepEqual((await kiemKhoi(SKILL)).filter(laLoiLenh), []);
});

for (const [ten, cu, moi, mong] of [
  ['thieu-gia-tri', /\n *- `cho-nhip` →[^\n]*/, '', 'cho-nhip'],
  ['duong-tuong-doi', 'node "$WORKFLOWS_DIR/../scripts/trong-dot.mjs"', 'node feature-loop/scripts/trong-dot.mjs', 'không chạy được ngoài kho kit'],
]) {
  test(`DP7-08-do ${ten}`, async () => {
    const sao = path.join(tam('dp7-skill-'), 'SKILL.md');
    fs.copyFileSync(SKILL, sao);
    tiem(sao, cu, moi);
    const loi = await kiemKhoi(sao);
    assert.ok(loi.some((l) => l.startsWith(mong)), `phải nêu «${mong}»: ${loi.join(' | ')}`);
  });
}

// ---------- DP7-10, DP7-11: ca DP1/DP2 nguyên vẹn; README (AC-10, AC-11) ----------
// Lời hứa của VÒNG DP7 («không đụng ca DP1/DP2») neo vào LỊCH SỬ, không vào merge-base sống (sửa 11/10 ở
// nhánh X2 theo lệnh Điều phối MacBook Pro, cùng mẫu DP3-11 @8c92fb3a; M5 có quyền đảo): merge-base(HEAD,
// origin/main) dời theo nhánh, nên sau khi DP7 gộp, mọi vòng SAU chạm hợp lệ ba đường dẫn này đều vấp. Phép
// đo đúng: tìm commit gộp DP7 vào main rồi so phần nhánh DP7 tự đổi — từ điểm rẽ của hai cha tới cha-2.
const DP12_TEP = ['tests/dieu-phoi/dong-goi.test.mjs', 'tests/dieu-phoi/mo-dot.test.mjs', 'tests/dieu-phoi/loi'];
const gitK = (...a) => execFileSync('git', a, { cwd: KIT, env: ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const DP12_MSG = 'ca DP1/DP2 đã bị sửa so với merge-base';
const dp12Doi = (tu, toi) => spawnSync('git', ['diff', '--quiet', tu, toi, '--', ...DP12_TEP], { cwd: KIT, env: ENV }).status;
// Cách neo lịch sử: [điểm rẽ, cha-2] của commit gộp nhánh vong/dieu-phoi-feature-loop-trong-dot vào main.
const dp12NeoLichSu = () => {
  const dong = gitK('log', '--merges', '--format=%H%x09%s', 'HEAD').split('\n')
    .find((l) => /\tMerge pull request #\d+ from \S+\/vong\/dieu-phoi-feature-loop-trong-dot$/.test(l));
  assert.ok(dong, 'không tìm được commit gộp vong/dieu-phoi-feature-loop-trong-dot vào main trong lịch sử của HEAD');
  const m = dong.split('\t')[0];
  return [gitK('merge-base', `${m}^1`, `${m}^2`), `${m}^2`];
};
// Cách lấy merge-base SỐNG (khuôn cũ của ca này), dựng lại trên mốc LỊCH SỬ để chiều đỏ không mất khi nhánh
// gộp: mốc = cha của commit gần nhất chạm hợp lệ mo-dot.test.mjs (X2 bỏ «» ở DP2-11) — so tới HEAD.
const dp12MergeBaseSong = () => {
  const c = gitK('log', '-1', '--format=%H', '-S', 'boNgoacNgoai', '--', 'tests/dieu-phoi/mo-dot.test.mjs');
  assert.ok(c, 'không tìm được commit X2 chạm mo-dot.test.mjs');
  return [`${c}^`, 'HEAD'];
};
const kiemDp12 = (lay) => { const [tu, toi] = lay(); return dp12Doi(tu, toi) === 0 ? [] : [`${DP12_MSG} (${tu.slice(0, 12)}..${toi.slice(0, 12)})`]; };

test('DP7-10 dp12-nguyen', () => {
  const [tu, toi] = dp12NeoLichSu();
  console.log(`  vòng DP7: ${tu.slice(0, 12)}..${toi.slice(0, 12)} · git diff --quiet ${DP12_TEP.join(' ')}`);
  assert.deepEqual(kiemDp12(dp12NeoLichSu), []);
});

// Chiều đỏ của chính phép đo: cách so với một mốc trước một vòng KHÁC chạm hợp lệ ba đường dẫn phải ĐỎ đúng
// thông điệp — đối chứng dương là ca DP7-10 ngay trên (neo lịch sử, XANH trên cùng cây).
test('DP7-10-do merge-base-song', () => {
  assert.deepEqual(kiemDp12(dp12NeoLichSu), [], 'đối chứng dương: neo lịch sử phải xanh trên cùng cây');
  const loi = kiemDp12(dp12MergeBaseSong);
  assert.ok(loi.some((l) => l.startsWith(DP12_MSG)), `cách lấy merge-base sống phải đỏ: ${loi.join(' | ')}`);
});

async function kiemReadme(tep) {
  const t = fs.readFileSync(tep, 'utf8');
  const m = /\n## Phiên thợ trong đợt\n([\s\S]*?)(?=\n## |$)/.exec(t);
  if (!m) return ['README thiếu mục «Phiên thợ trong đợt»'];
  const muc = m[1];
  const { VIEC_KE } = await nap(GOI, 'tho.mjs');
  const loi = [];
  for (const chu of ['tho', '--tu-merge', 'LUAT.md', ...VIEC_KE.map((v) => `\`${v}\``)]) if (!muc.includes(chu)) loi.push(`mục thiếu ${chu.replaceAll('`', '')}`);
  for (const cam of ['xin/', 'yeu-cau/']) if (muc.includes(cam)) loi.push(`mục lặp cách ghi: ${cam}`);
  return loi;
}

test('DP7-11 readme', async () => {
  assert.deepEqual(await kiemReadme(path.join(GOI, 'README.md')), []);
});

test('DP7-11-do', async () => {
  const sao = path.join(tam('dp7-readme-'), 'README.md');
  fs.copyFileSync(path.join(GOI, 'README.md'), sao);
  tiem(sao, /\n- `cho-nhip` —[^\n]*/, '');
  const loi = await kiemReadme(sao);
  assert.ok(loi.includes('mục thiếu cho-nhip'), `phải nêu «cho-nhip»: ${loi.join(' | ')}`);
});

// ---------- DP7-12: nguồn hàng hai lộ trình trùng mã — khoá (tệp, mã) (AC-12, E12) ----------
function khoHaiLoTrinh() {
  const kho = khoThu('dp7-lt-');
  ghiJ(path.join(kho, 'a.json'), { schema: 1, ten: 'A', moc: [{ ten: 'M', ngay: '2026-10-25', hang: ['X'] }], hang: [{ ma: 'X', slug: 'x-tu-a', cau_giao: '«X ở a»' }] });
  ghiJ(path.join(kho, 'b.json'), { schema: 1, ten: 'B', moc: [], hang: [{ ma: 'X', slug: 'x-tu-b', cau_giao: '«X ở b»' }] });
  ghiT(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\ndieu_phoi:\n  goi_dot: goi/dot-{ten}\n');
  return kho;
}
function goiNguon(kho, hang, nguon) {
  const dir = path.join(kho, 'goi', 'dot-thu');
  ghiJ(path.join(dir, 'dieu-phoi.config.json'), { ...docJ(path.join(GOI, 'scripts', 'mau', 'dieu-phoi.config.json')), nguon_hang: nguon });
  ghiJ(path.join(dir, 'hang-viec.json'), { dot: '', day: [{ id: 'P1', worktree: themWorktree(kho, 'P1') }], hang, ngoai_hang_merge: [] });
  ghiT(path.join(dir, 'LUAT-rieng.md'), '# Luật riêng\n');
}
const hangCuaDot = (kho) => docJ(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai', 'hang-viec.json')).hang;

async function kiemHaiTep(gocGoi) {
  const { docHangLoTrinh } = await nap(gocGoi, 'nguon-hang.mjs');
  const { hang, loi } = docHangLoTrinh(khoHaiLoTrinh(), ['a.json:X', 'b.json:X']);
  const ra = [];
  if (loi) ra.push(`loi: ${loi}`);
  for (const tep of ['a.json', 'b.json']) if (!hang.some((h) => h.tep === tep && h.ma === 'X')) ra.push(`mất ${tep}:X`);
  return { ra, hang };
}

test('DP7-12 hai-tep', async () => {
  const { ra, hang } = await kiemHaiTep(GOI);
  assert.deepEqual(ra, []);
  assert.deepEqual(hang, [{ ma: 'X', slug: 'x-tu-a', tep: 'a.json' }, { ma: 'X', slug: 'x-tu-b', tep: 'b.json' }]);
});

test('DP7-12 mo-hai-tep', () => {
  const kho = khoHaiLoTrinh();
  goiNguon(kho, [{ ma: 'X', tep: 'a.json', day: 'P1' }, { ma: 'X', tep: 'b.json', day: 'P1' }], ['a.json:X', 'b.json:X']);
  const r = chayCli(kho, ['mo', 'thu']);
  assert.equal(r.ma, 0, r.err);
  assert.equal(r.err, '');
  assert.deepEqual(hangCuaDot(kho).map((h) => [h.tep, h.ma, h.slug]), [['a.json', 'X', 'x-tu-a'], ['b.json', 'X', 'x-tu-b']]);
});

test('DP7-12 khai-lap', async () => {
  const { docHangLoTrinh } = await nap(GOI, 'nguon-hang.mjs');
  const { hang } = docHangLoTrinh(khoHaiLoTrinh(), ['a.json:X', 'a.json@2026-10-25']);
  assert.deepEqual(hang, [{ ma: 'X', slug: 'x-tu-a', tep: 'a.json' }]);
});

test('DP7-12 khong-tep-mo-ho', () => {
  const kho = khoHaiLoTrinh();
  goiNguon(kho, [{ ma: 'X', day: 'P1' }, { slug: 'viec-tay', day: 'P1' }], ['a.json:X', 'b.json:X']);
  const r = chayCli(kho, ['mo', 'thu']);
  assert.equal(r.ma, 0, r.err);
  const dong = r.err.split('\n').filter((d) => /\bX\b/.test(d));
  assert.equal(dong.length, 1, `cần đúng một dòng nêu X: ${r.err}`);
  assert.ok(dong[0].includes('a.json') && dong[0].includes('b.json'), dong[0]);
  assert.deepEqual(hangCuaDot(kho).filter((h) => h.ma === 'X'), [], 'không được gán slug đoán cho hàng X');
});

test('DP7-12-do khoa-ma', async () => {
  const sao = chepGoi();
  tiem(path.join(sao, 'scripts', 'nguon-hang.mjs'), 'const khoa = `${n.tep}\\u0000${m}`;', 'const khoa = m;');
  const { ra } = await kiemHaiTep(sao);
  assert.ok(ra.includes('mất b.json:X'), `phải nêu «mất b.json:X»: ${ra.join(' | ')}`);
});
