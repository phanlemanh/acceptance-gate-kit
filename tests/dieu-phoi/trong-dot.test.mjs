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
const tiem = (p, cu, moi) => {
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
// Mỗi hàng: tên · hàng của đợt · dựng trước nhịp · --slug · viec_ke mong · mẩu ly_do mong (null = không xét).
const A = { ma: 'A', slug: 'hang-a', day: 'P1', uu_tien: 1 };
const MA_TRAN_KE = [
  { ten: 'chi-hop-dong', dung: ({ kho }) => hopDong(kho, 'hang-a', 'draft'), mong: 'mo-hang' },
  { ten: 'o-build', dung: ({ kho }) => oCoHoi(kho, 'hang-a', { decision: 'build' }), mong: 'mo-hang' },
  { ten: 'o-build-chi-o-worktree', dung: ({ w }) => oCoHoi(w.P1, 'hang-a', { decision: 'build' }), mong: 'mo-hang' },
  { ten: 'khong-ma', hang: [{ slug: 'viec-x', day: 'P1' }], dung: () => {}, mong: 'mo-hang' },
  { ten: 'vang', dung: () => {}, mong: 'bao-giam-sat', lyDo: 'hang-a' },
  { ten: 'discovery', dung: ({ kho }) => oCoHoi(kho, 'hang-a', { stage: 'discovery' }), mong: 'bao-giam-sat', lyDo: 'hang-a' },
  { ten: 'park', dung: ({ kho }) => oCoHoi(kho, 'hang-a', { decision: 'park' }), mong: 'bao-giam-sat', lyDo: 'park' },
  { ten: 'kill', dung: ({ kho }) => oCoHoi(kho, 'hang-a', { decision: 'kill' }), mong: 'bao-giam-sat', lyDo: 'kill' },
  { ten: 'iterate', dung: ({ kho }) => oCoHoi(kho, 'hang-a', { decision: 'iterate' }), mong: 'bao-giam-sat', lyDo: 'iterate' },
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
  { ten: 'het-hang', dung: ({ w }) => hopDong(w.P1, 'hang-a', 'signed-off'), mong: 'xong' },
];

async function kiemMaTranKe(gocGoi) {
  const loi = [];
  const thay = new Set();
  let chay = 0;
  for (const h of MA_TRAN_KE) {
    const ctx = dungDot({ hang: h.hang ?? [A], gocGoi });
    h.dung(ctx);
    await nhip(ctx.dot, { gocGoi });
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
