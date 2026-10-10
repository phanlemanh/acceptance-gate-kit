// mo-dot.test.mjs — các ca của hồ sơ dieu-phoi-mo-dot-mot-lenh (tên ca bắt đầu «DP2-»).
// Kho thử do chính ca dựng (git init trong thư mục tạm); mọi đường suy từ vị trí tệp này. Mỗi phép đo có
// cặp hai chiều trên cùng fixture: bản lành xanh trước, bản bị tiêm đỏ sau, ghim thông điệp.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(DAY, '..', '..');
const GOI = path.join(KIT, 'dieu-phoi');

// Khoá máy của ca nằm trong thư mục tạm — đặt TRƯỚC mọi lần nạp mô-đun của gói.
const MAY_TAM = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'dp2-may-')));
process.env.DIEU_PHOI_MAY_DIR = MAY_TAM;

const canDon = [MAY_TAM];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = (tienTo = 'dp2-') => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tienTo)));
  canDon.push(d);
  return d;
};
const chep = (nguon, dich) => fs.cpSync(nguon, dich, { recursive: true });
const docJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ghiJ = (p, du) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(du, null, 2)}\n`);
};
const ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT'));
const bam = (p) => (fs.existsSync(p) ? crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') : 'vang');
function bamCay(goc) {
  const h = crypto.createHash('sha256');
  const di = (d) => {
    for (const ten of fs.readdirSync(d).sort()) {
      if (d === goc && ten === '.git') continue;
      const p = path.join(d, ten);
      const st = fs.lstatSync(p);
      const rel = path.relative(goc, p);
      if (st.isSymbolicLink()) h.update(`L ${rel} ${fs.readlinkSync(p)}\n`);
      else if (st.isDirectory()) { h.update(`D ${rel}\n`); di(p); }
      else h.update(`F ${rel} `).update(fs.readFileSync(p)).update('\n');
    }
  };
  di(goc);
  return h.digest('hex');
}

function khoThu(tienTo = 'dp2-kho-') {
  const d = tam(tienTo);
  const git = (...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd: d, env: ENV, stdio: 'ignore' });
  git('init', '-q', '-b', 'main');
  git('commit', '-q', '--allow-empty', '-m', 'goc');
  return d;
}

const CLI = (gocGoi = GOI) => path.join(gocGoi, 'scripts', 'dieu-phoi.mjs');
function chayCli(cwd, doiSo, { gocGoi = GOI, env = {} } = {}) {
  const r = spawnSync(process.execPath, [CLI(gocGoi), ...doiSo], { cwd, env: { ...ENV, ...env }, encoding: 'utf8' });
  return { ma: r.status, out: r.stdout, err: r.stderr };
}

// Gói đợt thử: cấu hình từ khuôn của gói, hai dãy P1/P2 (worktree là thư mục tạm), hai hàng A/B.
function goiThu(kho, { thuMuc = 'goi/dot-thu', hang = null, cfgThem = {} } = {}) {
  const dir = path.join(kho, thuMuc);
  const w1 = tam('dp2-w1-');
  const w2 = tam('dp2-w2-');
  ghiJ(path.join(dir, 'dieu-phoi.config.json'), { ...docJ(path.join(GOI, 'scripts', 'mau', 'dieu-phoi.config.json')), ...cfgThem });
  ghiJ(path.join(dir, 'hang-viec.json'), {
    dot: '',
    day: [{ id: 'P1', worktree: w1 }, { id: 'P2', worktree: w2 }],
    hang: hang ?? [
      { ma: 'A', slug: 'hang-a', day: 'P1', uu_tien: 1 },
      { ma: 'B', slug: 'hang-b', day: 'P2', uu_tien: 1 },
    ],
    ngoai_hang_merge: [],
  });
  fs.writeFileSync(path.join(dir, 'LUAT-rieng.md'), '# Luật riêng của kho thử\n- luật 1\n');
  return { dir, w1, w2 };
}
const khaiGoi = (kho, mau = 'goi/dot-{ten}') => {
  fs.mkdirSync(path.join(kho, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(kho, '_acceptance', 'config.yaml'), `schema_version: 1\ndieu_phoi:\n  goi_dot: ${mau}\n`);
};
const thuMucDot = (kho) => fs.realpathSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));

// ---------- DP2-02: mở đợt từ gói (AC-2, E2) ----------
test('DP2-02 mo-tu-goi', () => {
  const kho = khoThu();
  const { dir } = goiThu(kho);
  khaiGoi(kho);
  const r = chayCli(kho, ['mo', 'thu', '--phien', 's-giam-sat']);
  assert.equal(r.ma, 0, r.err);
  const dot = thuMucDot(kho);
  const goiCfg = docJ(path.join(dir, 'dieu-phoi.config.json'));
  const goiHv = docJ(path.join(dir, 'hang-viec.json'));
  assert.deepEqual(docJ(path.join(dot, 'dieu-phoi.config.json')), { ...goiCfg, goc_kho: kho });
  assert.deepEqual(docJ(path.join(dot, 'hang-viec.json')), { ...goiHv, dot: 'thu' });
  const khuon = fs.readFileSync(path.join(GOI, 'scripts', 'mau', 'LUAT.md'), 'utf8');
  const luat = fs.readFileSync(path.join(dot, 'LUAT.md'), 'utf8');
  assert.ok(luat.startsWith(khuon.replace(/\s*$/, '')), 'LUAT.md phải mở bằng khuôn của gói');
  assert.ok(luat.endsWith('# Luật riêng của kho thử\n- luật 1\n'), 'LUAT.md phải kết bằng nguyên văn LUAT-rieng.md');
  const vai = docJ(path.join(dot, 'vai.json'));
  assert.equal(vai.giam_sat.phien, 's-giam-sat');
  assert.deepEqual(vai.day.map((d) => d.id), goiHv.day.map((d) => d.id));
  const dk = docJ(path.join(dot, 'dieu-khien.json'));
  assert.equal(dk.pha, 'nhap');
  assert.equal(dk.nguon_goi, dir);
});

test('DP2-02 chay-lai', () => {
  const kho = khoThu();
  goiThu(kho);
  khaiGoi(kho);
  assert.equal(chayCli(kho, ['mo', 'thu']).ma, 0);
  const dot = thuMucDot(kho);
  const truoc = bamCay(dot);
  const r = chayCli(kho, ['mo', 'thu']);
  assert.equal(r.ma, 0, r.err);
  assert.equal(r.out.trim(), 'đợt thu đã mở');
  assert.equal(bamCay(dot), truoc, 'chạy lại không được đổi tệp nào');
});

test('DP2-02 co-goi-thang', () => {
  const kho = khoThu();
  goiThu(kho);
  khaiGoi(kho);
  const { dir: khac } = goiThu(kho, { thuMuc: 'goi/khac', hang: [{ ma: 'Z', slug: 'hang-z', day: 'P1' }] });
  const r = chayCli(kho, ['mo', 'thu', '--goi', 'goi/khac']);
  assert.equal(r.ma, 0, r.err);
  const dot = thuMucDot(kho);
  assert.deepEqual(docJ(path.join(dot, 'hang-viec.json')).hang.map((h) => h.ma), ['Z']);
  assert.equal(docJ(path.join(dot, 'dieu-khien.json')).nguon_goi, khac);
});

test('DP2-02-do thieu-tep', () => {
  const kho = khoThu();
  const { dir } = goiThu(kho);
  khaiGoi(kho);
  // Đối chứng dương trên CÙNG gói ở một kho khác: gói lành thì mở được.
  const kho2 = khoThu();
  chep(dir, path.join(kho2, 'goi', 'dot-thu'));
  khaiGoi(kho2);
  assert.equal(chayCli(kho2, ['mo', 'thu']).ma, 0, 'đối chứng: gói lành phải mở được');
  fs.rmSync(path.join(dir, 'LUAT-rieng.md'));
  const r = chayCli(kho, ['mo', 'thu']);
  assert.equal(r.ma, 1);
  assert.match(r.err, /LUAT-rieng\.md/);
  assert.equal(fs.existsSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-thu')), false, 'không được dựng thư mục đợt');
  assert.equal(fs.existsSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai')), false, 'không được dựng symlink');
});

// Review Focus 2: hang-viec.json của gói sai khuôn → từ chối trước khi dựng gì.
test('DP2-02 goi-sai-khuon', () => {
  const kho = khoThu();
  const { dir } = goiThu(kho);
  khaiGoi(kho);
  const p = path.join(dir, 'hang-viec.json');
  ghiJ(p, { ...docJ(p), day: {} });
  const r = chayCli(kho, ['mo', 'thu']);
  assert.equal(r.ma, 1);
  assert.match(r.err, /hang-viec\.json: day phải là danh sách/);
  assert.equal(fs.existsSync(path.join(kho, '.acceptance-runs')), false);
});

// Review Focus 3: tên trùng một đợt đã đóng (thư mục còn, symlink gỡ) → không đè sổ cũ.
test('DP2-02 ten-trung-dot-da-dong', () => {
  const kho = khoThu();
  goiThu(kho);
  khaiGoi(kho);
  assert.equal(chayCli(kho, ['mo', 'thu']).ma, 0);
  assert.equal(chayCli(kho, ['dong']).ma, 0);
  const cu = path.join(kho, '.acceptance-runs', 'dieu-phoi-thu');
  const truoc = bamCay(cu);
  const r = chayCli(kho, ['mo', 'thu']);
  assert.equal(r.ma, 1);
  assert.match(r.err, /đợt thu còn thư mục cũ/);
  assert.equal(bamCay(cu), truoc);
});

// ---------- DP2-03: không gói → đợt dựng tay (AC-3, E3 — vế chẩn đoán ở Task 3) ----------
test('DP2-03 dung-tay', () => {
  const kho = khoThu();
  const r = chayCli(kho, ['mo', 'thu']);
  assert.equal(r.ma, 0, r.err);
  const dk = docJ(path.join(thuMucDot(kho), 'dieu-khien.json'));
  assert.equal(dk.pha, 'dang-chay');
  assert.equal(dk.nguon_goi, null);
});

// Vế chẩn đoán của AC-3: cùng hàm, hai kho — dựng tay → goi-dot thiếu; có gói → goi-dot đủ.
const mucCua = (kho, muc) => JSON.parse(chayCli(kho, ['chan-doan', '--json']).out).find((m) => m.muc === muc);

test('DP2-03 chan-doan-goi-dot', () => {
  const tay = khoThu();
  assert.equal(chayCli(tay, ['mo', 'thu']).ma, 0);
  const t = mucCua(tay, 'goi-dot');
  assert.equal(t.trang_thai, 'thieu');
  assert.match(t.viec, /dieu_phoi\.goi_dot/);
  const coGoi = khoThu();
  goiThu(coGoi);
  khaiGoi(coGoi);
  assert.equal(chayCli(coGoi, ['mo', 'thu']).ma, 0);
  assert.equal(mucCua(coGoi, 'goi-dot').trang_thai, 'du');
});

// ---------- DP2-06: khung chẩn đoán (AC-6, E6) ----------
const MUC_TOI_THIEU = ['co-dot', 'pha', 'phat-lich', 'goi-dot', 'hang-viec', 'vai'];

test('DP2-06 khung', () => {
  const kho = khoThu();
  goiThu(kho);
  khaiGoi(kho);
  assert.equal(chayCli(kho, ['mo', 'thu']).ma, 0);
  const r = chayCli(kho, ['chan-doan', '--json']);
  assert.equal(r.ma, 0, r.err);
  const ds = JSON.parse(r.out);
  assert.ok(Array.isArray(ds));
  for (const m of ds) {
    assert.deepEqual(Object.keys(m).sort(), ['muc', 'trang_thai', 'viec']);
    assert.ok(['du', 'thieu', 'khong-ap'].includes(m.trang_thai), `${m.muc}: ${m.trang_thai}`);
  }
  for (const m of MUC_TOI_THIEU) assert.ok(ds.some((x) => x.muc === m), `thiếu mục ${m}`);
});

test('DP2-06 khong-dot', () => {
  const kho = khoThu();
  const truoc = bamCay(kho);
  const r = chayCli(kho, ['chan-doan', '--json']);
  assert.equal(r.ma, 0, r.err);
  const ds = JSON.parse(r.out);
  assert.deepEqual(ds.filter((m) => m.trang_thai === 'thieu').map((m) => m.muc), ['co-dot']);
  assert.equal(bamCay(kho), truoc, 'chẩn đoán không được ghi tệp nào');
});

test('DP2-06-do hang-viec-hong', () => {
  const kho = khoThu();
  goiThu(kho);
  khaiGoi(kho);
  assert.equal(chayCli(kho, ['mo', 'thu']).ma, 0);
  assert.equal(mucCua(kho, 'hang-viec').trang_thai, 'du', 'đối chứng dương');
  const p = path.join(thuMucDot(kho), 'hang-viec.json');
  ghiJ(p, { ...docJ(p), hang: 'sai' });
  const m = mucCua(kho, 'hang-viec');
  assert.equal(m.trang_thai, 'thieu');
  assert.match(m.viec, /hang phải là danh sách/);
});

// ---------- DP2-07: đổi kế hoạch trong đợt (AC-7, E7) ----------
// Đợt đang chạy: dãy P1 có A (ưu tiên 1) và C (ưu tiên 2), dãy P2 có B.
function dotDangChay() {
  const kho = khoThu('dp2-kh-');
  goiThu(kho, {
    hang: [
      { ma: 'A', slug: 'hang-a', day: 'P1', uu_tien: 1 },
      { ma: 'C', slug: 'hang-c', day: 'P1', uu_tien: 2 },
      { ma: 'B', slug: 'hang-b', day: 'P2', uu_tien: 1 },
    ],
  });
  khaiGoi(kho);
  assert.equal(chayCli(kho, ['mo', 'thu']).ma, 0);
  assert.equal(chayCli(kho, ['pha', 'dang-chay']).ma, 0);
  return { kho, dot: thuMucDot(kho) };
}
const soNhatKy = (dot) => {
  const dong = fs.readFileSync(path.join(dot, 'LUAT.md'), 'utf8').split('\n');
  const i = dong.findIndex((d) => d.trim() === '## Nhật ký');
  return dong.slice(i + 1).filter((d) => d.startsWith('- ')).length;
};
const BON_TEP = ['hang-viec.json', 'dieu-khien.json', 'LUAT.md', 'su-kien.jsonl'];
const bamBon = (dot) => BON_TEP.map((f) => bam(path.join(dot, f))).join('|');

// Năm lệnh viết sẵn: [đối số CLI, kiểm trường đổi].
const NAM_LENH = [
  [['hang', 'day-len', 'C', '--truoc', 'A'], (dot) => docJ(path.join(dot, 'hang-viec.json')).hang.find((h) => h.ma === 'C').uu_tien === 0],
  [['hang', 'them', 'viec phu moi', '--day', 'P2'], (dot) => docJ(path.join(dot, 'hang-viec.json')).hang.some((h) => h.slug === 'viec-phu-moi' && h.day === 'P2')],
  [['hang', 'nghi', 'P2'], (dot) => docJ(path.join(dot, 'hang-viec.json')).day.find((d) => d.id === 'P2').nghi === true],
  [['pha', 'tam-dung', '--ly-do', 'nghi trua'], (dot) => docJ(path.join(dot, 'dieu-khien.json')).pha === 'tam-dung'],
  [['pha', 'dang-chay'], (dot) => docJ(path.join(dot, 'dieu-khien.json')).pha === 'dang-chay'],
];

test('DP2-07 doi-ke-hoach', () => {
  const { kho, dot } = dotDangChay();
  for (const [doiSo, dung] of NAM_LENH) {
    const nk = soNhatKy(dot);
    const sk = suKien(dot).length;
    const r = chayCli(kho, doiSo);
    assert.equal(r.ma, 0, `${doiSo.join(' ')}: ${r.err}`);
    assert.ok(dung(dot), `${doiSo.join(' ')}: trường không đổi đúng`);
    assert.equal(soNhatKy(dot), nk + 1, `${doiSo.join(' ')}: Nhật ký phải thêm đúng 1 dòng`);
    assert.equal(suKien(dot).length, sk + 1, `${doiSo.join(' ')}: phải thêm đúng 1 sự kiện`);
  }
});

test('DP2-07 ap-nhip-ke', async () => {
  const { taoVong } = await nap(GOI, 'phat-lich.mjs');
  process.env.DIEU_PHOI_MAY_DIR = tam('dp2-may07-');
  const { kho, dot } = dotDangChay();
  const gio = Date.now();
  await taoVong(dot, ioGia(gio), () => gio)();
  assert.equal(docJ(path.join(dot, 'tiep', 'P1.json')).hang, 'hang-a', 'đối chứng: trước khi đổi, A là hàng kế của P1');
  assert.equal(chayCli(kho, ['hang', 'day-len', 'C', '--truoc', 'A']).ma, 0);
  assert.equal(chayCli(kho, ['hang', 'nghi', 'P2']).ma, 0);
  await taoVong(dot, ioGia(gio + 1000), () => gio + 1000)();
  assert.equal(docJ(path.join(dot, 'tiep', 'P1.json')).hang, 'hang-c');
  const p2 = docJ(path.join(dot, 'tiep', 'P2.json'));
  assert.equal(p2.hang, null);
  assert.equal(p2.cho, 'nghi');
});

test('DP2-07 chay-lai', () => {
  const { kho, dot } = dotDangChay();
  for (const [doiSo] of NAM_LENH) {
    assert.equal(chayCli(kho, doiSo).ma, 0, doiSo.join(' '));
    const sau1 = bamBon(dot);
    const r = chayCli(kho, doiSo);
    assert.equal(r.ma, 0, `${doiSo.join(' ')} lần hai: ${r.err}`);
    assert.equal(bamBon(dot), sau1, `${doiSo.join(' ')}: lần hai không được đổi tệp nào`);
  }
});

test('DP2-07-do ma-la', () => {
  const { kho, dot } = dotDangChay();
  assert.equal(chayCli(kho, ['hang', 'day-len', 'C', '--truoc', 'A']).ma, 0, 'đối chứng: mã có thật thì chạy');
  const truoc = bamBon(dot);
  const r = chayCli(kho, ['hang', 'day-len', 'KHONG-CO', '--truoc', 'A']);
  assert.equal(r.ma, 1);
  assert.match(r.err, /KHONG-CO/);
  assert.equal(bamBon(dot), truoc);
});

// ---------- DP2-08: nguồn hàng từ lộ trình (AC-8, E8) ----------
const TEP_LT = 'docs/lo-trinh.json';
function khoCoLoTrinh() {
  const kho = khoThu('dp2-lt-');
  ghiJ(path.join(kho, TEP_LT), {
    schema: 1,
    ten: 'Lộ trình thử',
    moc: [{ ten: 'Mốc một', ngay: '2026-10-25', hang: ['A', 'B'] }],
    hang: [
      { ma: 'A', slug: 'hang-a-tu-lo-trinh', cau_giao: '«Việc A»' },
      { ma: 'B', cau_giao: '«Đóng gói Điều phối – Thợ vào kit để chạy được ở kho thứ hai»' },
      { ma: 'C', slug: 'hang-c', cau_giao: '«Việc C»' },
    ],
  });
  fs.mkdirSync(path.join(kho, '_acceptance'), { recursive: true });
  fs.writeFileSync(
    path.join(kho, '_acceptance', 'config.yaml'),
    `schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\nlo_trinh:\n  tep: ${TEP_LT}\ndieu_phoi:\n  goi_dot: goi/dot-{ten}\n`,
  );
  return kho;
}
// Gói chỉ khai phần thi công theo mã (không slug) + một hàng khai tay K có slug.
const goiTheoMa = (kho, nguon) =>
  goiThu(kho, {
    hang: [
      { ma: 'A', day: 'P1', uu_tien: 1 },
      { ma: 'B', day: 'P2', uu_tien: 1 },
      { slug: 'viec-khai-tay', day: 'P1', uu_tien: 5 },
    ],
    cfgThem: { nguon_hang: nguon },
  });
const LT_KIT = path.join(KIT, 'scripts', 'lo-trinh.mjs');

export async function kiemRoundTrip(gocGoi, kho) {
  const kit = await import(LT_KIT);
  const goi = await nap(gocGoi, 'nguon-hang.mjs');
  const data = docJ(path.join(kho, TEP_LT));
  const theoKit = kit.kiemKhuon(data).hang.map((r) => `${r._ma}:${r.slug || kit.suySlug(r.cau_giao)}`).sort();
  const theoGoi = goi.docHangLoTrinh(kho, data.hang.map((r) => `${TEP_LT}:${r.ma}`)).hang.map((h) => `${h.ma}:${h.slug}`).sort();
  const loi = [];
  for (const x of theoKit) if (!theoGoi.includes(x)) loi.push(`lệch slug: kit có ${x}, gói có [${theoGoi.join(', ')}]`);
  return { loi, theoKit, theoGoi };
}

test('DP2-08 round-trip', async () => {
  const kho = khoCoLoTrinh();
  const { loi, theoKit } = await kiemRoundTrip(GOI, kho);
  console.log(`  (ma:slug) theo kit: ${theoKit.join(' · ')}`);
  assert.deepEqual(loi, []);
  // Nhóm kế hoạch: trang do product-map.mjs THẬT của cây dựng; bản chép docDuLieu của gói == bản gốc.
  const r = spawnSync(process.execPath, [path.join(KIT, 'scripts', 'product-map.mjs'), '--root', kho], { encoding: 'utf8', env: ENV });
  assert.equal(r.status, 0, r.stderr);
  const html = fs.readFileSync(path.join(kho, 'LO-TRINH.html'), 'utf8');
  const kit = await import(LT_KIT);
  const goi = await nap(GOI, 'nguon-hang.mjs');
  const nhomKit = new Map(kit.docDuLieu(html).duLieu.lo_trinh.flatMap((t) => t.hang.map((h) => [h.ma, h.nhom_trang_thai])));
  const nhomGoi = goi.docNhomKeHoach(kho);
  assert.ok(nhomKit.size >= 3, 'trang phải mang đủ ba hàng');
  assert.deepEqual([...nhomGoi.entries()].sort(), [...nhomKit.entries()].sort());
});

test('DP2-08 mo-tu-lo-trinh', () => {
  const kho = khoCoLoTrinh();
  goiTheoMa(kho, [`${TEP_LT}:A`, `${TEP_LT}:B`]);
  const r = chayCli(kho, ['mo', 'thu']);
  assert.equal(r.ma, 0, r.err);
  assert.equal(r.err, '', 'không được có cảnh báo khi đọc được lộ trình');
  const hang = docJ(path.join(thuMucDot(kho), 'hang-viec.json')).hang;
  const theoMa = hang.filter((h) => h.ma);
  assert.deepEqual(theoMa.map((h) => [h.ma, h.slug]), [['A', 'hang-a-tu-lo-trinh'], ['B', 'dong-goi-dieu-phoi-tho-vao']]);
  assert.ok(hang.every((h) => !('cau_giao' in h)), 'không được chép câu giao');
});

test('DP2-08 theo-moc', () => {
  const kho = khoCoLoTrinh();
  goiTheoMa(kho, [`${TEP_LT}@2026-10-25`]);
  const r = chayCli(kho, ['mo', 'thu']);
  assert.equal(r.ma, 0, r.err);
  assert.deepEqual(docJ(path.join(thuMucDot(kho), 'hang-viec.json')).hang.filter((h) => h.ma).map((h) => h.ma), ['A', 'B']);
});

test('DP2-08-do vang-tep', () => {
  const kho = khoCoLoTrinh();
  goiTheoMa(kho, [`${TEP_LT}:A`]);
  fs.rmSync(path.join(kho, TEP_LT));
  const r = chayCli(kho, ['mo', 'thu']);
  assert.equal(r.ma, 0, r.err);
  const dongLoi = r.err.split('\n').filter(Boolean);
  assert.equal(dongLoi.length, 1, `đúng một dòng: ${r.err}`);
  assert.match(dongLoi[0], /docs\/lo-trinh\.json/);
  assert.deepEqual(docJ(path.join(thuMucDot(kho), 'hang-viec.json')).hang.map((h) => h.slug), ['viec-khai-tay']);
});

test('DP2-08-do lech-slug', async () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  const kho = khoCoLoTrinh();
  assert.deepEqual((await kiemRoundTrip(sao, kho)).loi, [], 'đối chứng dương: bản sao lành');
  const p = path.join(sao, 'scripts', 'nguon-hang.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace(/\.normalize\('NFD'\)\.replace\(\/\[[^\]]+\]\/g, ''\)/, '');
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const { loi } = await kiemRoundTrip(sao, kho);
  assert.ok(loi.some((l) => l.includes('B:')), `phải nêu mã B: ${loi.join(' | ')}`);
});

// ---------- DP2-09: thẻ khởi tạo và thẻ đóng đợt (AC-9, E9) ----------
// Ma trận viết sẵn: năm hàng mang mã, mỗi hàng một trạng thái hồ sơ; kỳ vọng ở cột cuối.
const MA_TRAN_THE = [
  ['a', 'hang-a', (d) => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nstage: decided\ndecision: build\n---\n'), 'da-quyet'],
  ['b', 'hang-b', (d) => fs.writeFileSync(path.join(d, 'contract.md'), '---\nstatus: draft\n---\n'), 'da-quyet'],
  ['c', 'hang-c', null, 'cho'],
  ['d', 'hang-d', (d) => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nstage: discovery                # discovery | decided\ndecision:                     # build | park\n---\n'), 'cho'],
  ['e', 'hang-e', (d) => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nstage: decided\ndecision: park\n---\n'), 'canh-bao'],
];

function khoTheThu() {
  const kho = khoThu('dp2-the-');
  goiThu(kho, { hang: MA_TRAN_THE.map(([ma, slug], i) => ({ ma: ma.toUpperCase(), slug, day: i % 2 ? 'P2' : 'P1' })) });
  khaiGoi(kho);
  for (const [, slug, dung] of MA_TRAN_THE) {
    if (!dung) continue;
    const d = path.join(kho, '_acceptance', slug);
    fs.mkdirSync(d, { recursive: true });
    dung(d);
  }
  assert.equal(chayCli(kho, ['mo', 'thu']).ma, 0);
  return kho;
}

export async function kiemTheKhoiTao(gocGoi, kho) {
  const { theKhoiTao } = await nap(gocGoi, 'the.mjs');
  const the = theKhoiTao(kho);
  const loi = [];
  let soAssert = 0;
  for (const [, slug, , can] of MA_TRAN_THE) {
    soAssert++;
    const laCho = the.cho_cong_dang.includes(slug);
    const laCanhBao = the.canh_bao.some((c) => c.slug === slug);
    const thuc = laCho ? 'cho' : laCanhBao ? 'canh-bao' : 'da-quyet';
    if (thuc !== can) loi.push(`${slug}: ${thuc}, cần ${can}`);
  }
  const hoiCan = ['quyen-tu-merge', ...MA_TRAN_THE.filter((r) => r[3] === 'cho').map((r) => `build:${r[1]}`)];
  if (JSON.stringify(the.hoi) !== JSON.stringify(hoiCan)) loi.push(`hoi = ${JSON.stringify(the.hoi)}`);
  if (!the.may_di_tiep.includes('uu-tien') || !the.may_di_tiep.includes('lan-v')) loi.push('may_di_tiep thiếu uu-tien/lan-v');
  return { loi, soAssert, the };
}

test('DP2-09 khoi-tao', async () => {
  const kho = khoTheThu();
  const { loi, soAssert, the } = await kiemTheKhoiTao(GOI, kho);
  console.log(`  số hàng ma trận: ${soAssert} · chờ Cổng Đáng: ${the.cho_cong_dang.join(', ')}`);
  assert.equal(soAssert, MA_TRAN_THE.length);
  assert.deepEqual(loi, []);
  assert.deepEqual(the.day.map((d) => d.id), ['P1', 'P2']);
});

test('DP2-09 dong', async () => {
  const { theDong } = await nap(GOI, 'the.mjs');
  const { kho } = dotDangChay();
  assert.equal(chayCli(kho, ['hang', 'them', 'viec phat sinh', '--day', 'P1']).ma, 0);
  assert.equal(chayCli(kho, ['hang', 'day-len', 'C', '--truoc', 'A']).ma, 0);
  const the = theDong(kho);
  assert.deepEqual(the.hang_phat_sinh, ['viec-phat-sinh']);
  assert.deepEqual(the.lop_phu.map((l) => [l.hang, l.truoc]), [['hang-c', 'hang-a']]);
});

test('DP2-09-do', async () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  const kho = khoTheThu();
  assert.deepEqual((await kiemTheKhoiTao(sao, kho)).loi, [], 'đối chứng dương: bản sao lành');
  const p = path.join(sao, 'scripts', 'the.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace("  if (fs.existsSync(path.join(dir, 'contract.md'))) return { tt: 'da-quyet' };\n", '');
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const { loi } = await kiemTheKhoiTao(sao, kho);
  assert.ok(loi.some((l) => l.startsWith('hang-b:')), `phải nêu hang-b: ${loi.join(' | ')}`);
});

test('DP2-09-do thu-muc', async () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  const kho = khoTheThu();
  assert.deepEqual((await kiemTheKhoiTao(sao, kho)).loi, [], 'đối chứng dương: bản sao lành');
  const p = path.join(sao, 'scripts', 'the.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const neo = "  const dir = path.join(gocKho, '_acceptance', slug);\n";
  const tiem = goc.replace(neo, `${neo}  if (fs.existsSync(dir)) return { tt: 'da-quyet' };\n`);
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const { loi } = await kiemTheKhoiTao(sao, kho);
  assert.ok(loi.some((l) => l.startsWith('hang-d:')), `phải nêu hang-d: ${loi.join(' | ')}`);
});

// ---------- DP2-10: khoá S4 cấp máy (AC-10, E10) ----------
// Một kho có đợt mở từ gói, đang chạy, dãy P1 có đơn s4.
function khoDonS4(tienTo, gocGoi = GOI) {
  const kho = khoThu(tienTo);
  const { w1 } = goiThu(kho);
  khaiGoi(kho);
  assert.equal(chayCli(kho, ['mo', 'thu'], { gocGoi }).ma, 0);
  assert.equal(chayCli(kho, ['pha', 'dang-chay'], { gocGoi }).ma, 0);
  const dot = thuMucDot(kho);
  ghiDon(dot, 'P1', 's4', w1);
  return { kho, dot };
}
const capS4 = (dot) => suKien(dot).filter((e) => e.loai === 'cap' && e.tai_nguyen === 's4').length;
const chuMay = (may) => (fs.existsSync(path.join(may, 's4', 'chu.json')) ? docJ(path.join(may, 's4', 'chu.json')) : null);

async function nhip(gocGoi, dot) {
  const { taoVong } = await nap(gocGoi, 'phat-lich.mjs');
  const gio = Date.now();
  await taoVong(dot, ioGia(gio), () => gio)();
}

export async function kiemHaiKho(gocGoi) {
  const may = tam('dp2-may10-');
  process.env.DIEU_PHOI_MAY_DIR = may;
  const A = khoDonS4('dp2-ka-', gocGoi);
  const B = khoDonS4('dp2-kb-', gocGoi);
  const loi = [];
  await nhip(gocGoi, A.dot);
  if (capS4(A.dot) !== 1) loi.push('A phải được cấp s4');
  if (chuMay(may)?.kho !== A.kho) loi.push(`khoá máy phải ghi kho A, đang ghi ${chuMay(may)?.kho}`);
  await nhip(gocGoi, B.dot);
  if (capS4(A.dot) === 1 && capS4(B.dot) === 1) loi.push('hai kho cùng giữ s4');
  else if (capS4(B.dot) !== 0) loi.push('B không được cấp s4 khi A đang giữ khoá máy');
  if (docJ(path.join(B.dot, 'trang-thai.json')).cho_may !== A.kho) loi.push('trang-thai của B phải ghi cho_may = kho A');
  fs.rmSync(path.join(A.dot, 'khoa', 's4'), { recursive: true, force: true });
  await nhip(gocGoi, A.dot);
  if (chuMay(may) !== null) loi.push('A nhả khoá kho thì nhịp kế của A phải nhả khoá máy');
  await nhip(gocGoi, B.dot);
  if (capS4(B.dot) !== 1) loi.push('A nhả rồi thì B phải được cấp s4');
  return { loi, may, A, B };
}

test('DP2-10 hai-kho', async () => {
  assert.deepEqual((await kiemHaiKho(GOI)).loi, []);
});

test('DP2-10 thu-hoi', async () => {
  process.env.DIEU_PHOI_MAY_DIR = tam('dp2-may10b-');
  const A = khoDonS4('dp2-ka-');
  const B = khoDonS4('dp2-kb-');
  await nhip(GOI, A.dot);
  fs.rmSync(path.join(A.kho, '.acceptance-runs'), { recursive: true, force: true });
  await nhip(GOI, B.dot);
  const thuHoi = suKien(B.dot).filter((e) => e.loai === 'thu-hoi-may');
  assert.equal(thuHoi.length, 1);
  assert.equal(thuHoi[0].kho, A.kho);
  assert.equal(capS4(B.dot), 1);
});

test('DP2-10 dong-khi-giu', async () => {
  const may = tam('dp2-may10c-');
  process.env.DIEU_PHOI_MAY_DIR = may;
  const A = khoDonS4('dp2-ka-');
  const B = khoDonS4('dp2-kb-');
  await nhip(GOI, A.dot);
  await nhip(GOI, B.dot);
  assert.equal(capS4(B.dot), 0, 'đối chứng: A còn mở và còn giữ thì B không được cấp');
  const r = chayCli(A.kho, ['dong'], { env: { DIEU_PHOI_MAY_DIR: may } });
  assert.equal(r.ma, 0, r.err);
  assert.equal(chuMay(may), null, '`dong` của A phải nhả khoá máy');
  await nhip(GOI, B.dot);
  assert.equal(capS4(B.dot), 1);
  // Biến thể: thư mục đợt còn, symlink của kho A bị gỡ bằng tay (bộ phát lịch A đã dừng).
  const may2 = tam('dp2-may10d-');
  process.env.DIEU_PHOI_MAY_DIR = may2;
  const A2 = khoDonS4('dp2-ka2-');
  const B2 = khoDonS4('dp2-kb2-');
  await nhip(GOI, A2.dot);
  fs.rmSync(path.join(A2.kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  await nhip(GOI, B2.dot);
  const th = suKien(B2.dot).filter((e) => e.loai === 'thu-hoi-may');
  assert.equal(th.length, 1);
  assert.equal(th[0].kho, A2.kho);
  assert.match(th[0].ly_do, /đã đóng/);
  assert.equal(capS4(B2.dot), 1);
});

test('DP2-10 dung-tay-khong-cham', async () => {
  const may = tam('dp2-may10e-');
  process.env.DIEU_PHOI_MAY_DIR = may;
  const kho = khoThu('dp2-tay-');
  assert.equal(chayCli(kho, ['mo', 'thu']).ma, 0);
  const dot = thuMucDot(kho);
  const w = tam('dp2-wt-');
  ghiJ(path.join(dot, 'hang-viec.json'), { dot: 'thu', day: [{ id: 'P1', worktree: w }], hang: [], ngoai_hang_merge: [] });
  ghiDon(dot, 'P1', 's4', w);
  await nhip(GOI, dot);
  assert.equal(capS4(dot), 1, 'đợt dựng tay vẫn cấp s4 như bản cũ');
  assert.equal(fs.existsSync(path.join(may, 's4')), false, 'đợt dựng tay không chạm khoá máy');
});

test('DP2-10-do bo-khoa-may', async () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  assert.deepEqual((await kiemHaiKho(sao)).loi, [], 'đối chứng dương: bản sao lành');
  const p = path.join(sao, 'scripts', 'phat-lich.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace("    if (taiNguyen === 's4' && may.ap) {", "    if (false) {");
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const { loi } = await kiemHaiKho(sao);
  assert.ok(loi.includes('hai kho cùng giữ s4'), `phải nêu «hai kho cùng giữ s4»: ${loi.join(' | ')}`);
});

// ---------- DP2-12: một hàm mô hình cho xem và bảng đợt (AC-12, E12) ----------
function dotCoTrangThai() {
  const kho = khoCoLoTrinh();
  goiTheoMa(kho, [`${TEP_LT}:A`, `${TEP_LT}:B`]);
  assert.equal(chayCli(kho, ['mo', 'thu']).ma, 0);
  const r = spawnSync(process.execPath, [path.join(KIT, 'scripts', 'product-map.mjs'), '--root', kho], { encoding: 'utf8', env: ENV });
  assert.equal(r.status, 0, r.stderr);
  const dot = thuMucDot(kho);
  const tt = {
    dot: 'thu',
    pha: 'tam-dung',
    trang_thai: 'dang-chay',
    nhip_cuoi: '2026-10-10T08:00:00.000Z',
    suc_khoe: { lyDo: [], canNguoi: null },
    khoa: [{ tai_nguyen: 's4', phien: 'P2', han_thue_den: '2026-10-10T09:30:00.000Z' }],
    hang_cho: [{ phien: 'P1', loai: 'merge', luc: '2026-10-10T08:01:00.000Z' }],
    cho_nguoi: [{ phien: 'P1', loai: 'idle_prompt', tin: 'Ký giúp lượt này?', luc: '2026-10-10T08:02:00.000Z' }],
    day: [
      { id: 'P1', hang: 'hang-a-tu-lo-trinh', tien_do: 'dang', cho: null },
      { id: 'P2', hang: 'dong-goi-dieu-phoi-tho-vao', tien_do: 'chua', cho: null },
    ],
  };
  ghiJ(path.join(dot, 'trang-thai.json'), tt);
  return { kho, dot, tt };
}

export async function kiemHaiBeMat(gocGoi, kho, dot, tt) {
  const { moHinh } = await nap(gocGoi, 'mo-hinh.mjs');
  const { veBang } = await nap(gocGoi, 'bang.mjs');
  const { docNhomKeHoach } = await nap(gocGoi, 'nguon-hang.mjs');
  const tuyChon = { nhom: docNhomKeHoach(kho), hangViec: docJ(path.join(dot, 'hang-viec.json')) };
  const m = moHinh(tt, tuyChon);
  const giaTri = [
    m.pha,
    ...m.khoa.flatMap((k) => [k.tai_nguyen, k.phien]),
    ...m.hang_cho.map((h) => h.phien),
    ...m.cho_nguoi.map((c) => c.tin),
    ...m.day.flatMap((d) => [d.hang, d.nhom_ke_hoach]),
  ];
  const loi = [];
  if (!m.day.some((d) => d.nhom_ke_hoach)) loi.push('fixture hỏng: không hàng nào có nhóm kế hoạch');
  const r = chayCli(kho, ['xem'], { gocGoi });
  if (r.ma !== 0) loi.push(`xem thoát ${r.ma}: ${r.err}`);
  const html = veBang(tt, tuyChon);
  for (const v of giaTri) {
    if (v == null) continue;
    if (!r.out.includes(v)) loi.push(`xem thiếu «${v}»`);
    if (!html.includes(v)) loi.push(`bảng đợt thiếu «${v}»`);
  }
  return { loi, giaTri };
}

test('DP2-12 mot-ham', async () => {
  const { kho, dot, tt } = dotCoTrangThai();
  const { loi, giaTri } = await kiemHaiBeMat(GOI, kho, dot, tt);
  console.log(`  giá trị so: ${giaTri.filter((v) => v != null).join(' · ')}`);
  assert.deepEqual(loi, []);
});

test('DP2-12-do lech', async () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  const { kho, dot, tt } = dotCoTrangThai();
  assert.deepEqual((await kiemHaiBeMat(sao, kho, dot, tt)).loi, [], 'đối chứng dương: bản sao lành');
  const p = path.join(sao, 'scripts', 'dieu-phoi.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace(/  else dong = veXem\(moHinh\([^\n]*\n/, "  else dong = `đợt ${tt.dot} · ${tt.trang_thai} · khoá ${tt.khoa.map((k) => `${k.tai_nguyen}:${k.phien}`).join(' ')} · chờ lượt ${tt.hang_cho.length}`;\n");
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const { loi } = await kiemHaiBeMat(sao, kho, dot, tt);
  assert.ok(loi.some((l) => l.startsWith('xem thiếu «tam-dung»')), `phải nêu giá trị lệch: ${loi.join(' | ')}`);
});

// ---------- DP2-04: bảng chuyển pha (AC-4, E4) ----------
const PHA4 = ['nhap', 'dang-chay', 'tam-dung', 'dang-dong'];
const DUOC = new Set(['nhap>dang-chay', 'dang-chay>tam-dung', 'tam-dung>dang-chay', 'dang-chay>dang-dong', 'tam-dung>dang-dong']);

export async function kiemBangChuyen(tepPha) {
  const { datPha, khoiTaoPha } = await import(`${tepPha}?v=${Math.random()}`);
  const loi = [];
  let soO = 0;
  for (const tu of PHA4) {
    for (const sang of PHA4) {
      soO++;
      const d = tam('dp2-pha-');
      khoiTaoPha(d, { pha: tu, nguonGoi: '/goi' });
      const p = path.join(d, 'dieu-khien.json');
      const truoc = bam(p);
      const lsTruoc = docJ(p).lich_su.length;
      const o = `${tu} → ${sang}`;
      if (tu === sang) {
        const kq = datPha(d, sang, { boi: 't', lyDo: 'x' });
        if (kq.doi !== false || bam(p) !== truoc) loi.push(`${o}: cùng pha phải là việc không làm gì`);
      } else if (DUOC.has(`${tu}>${sang}`)) {
        datPha(d, sang, { boi: 't', lyDo: 'ly do' });
        const dk = docJ(p);
        if (dk.pha !== sang || dk.dat_boi !== 't' || dk.ly_do !== 'ly do' || !dk.dat_luc || dk.lich_su.length !== lsTruoc + 1) loi.push(`${o}: ghi sai`);
      } else {
        let ma = null;
        try { datPha(d, sang, { boi: 't' }); } catch (e) { ma = e.message; }
        if (!ma || !ma.includes(o)) loi.push(`${o}: phải bị từ chối nêu «${o}» (được: ${ma})`);
        if (bam(p) !== truoc) loi.push(`${o}: tệp đổi dù bị từ chối`);
      }
    }
  }
  return { loi, soO };
}

test('DP2-04 bang-chuyen', async () => {
  const { loi, soO } = await kiemBangChuyen(path.join(GOI, 'scripts', 'pha.mjs'));
  console.log(`  số ô: ${soO} (5 cho phép + 4 cùng pha + 7 từ chối)`);
  assert.equal(soO, 16);
  assert.deepEqual(loi, []);
});

test('DP2-04-do bo-bang', async () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  const p = path.join(sao, 'scripts', 'pha.mjs');
  assert.deepEqual((await kiemBangChuyen(p)).loi, [], 'đối chứng dương: bản sao lành');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace("if (!(CHUYEN[cu.pha] ?? []).includes(sang)) throw", 'if (false) throw');
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const { loi } = await kiemBangChuyen(p);
  assert.ok(loi.some((l) => l.startsWith('dang-dong → nhap')), `phải nêu «dang-dong → nhap»: ${loi.join(' | ')}`);
});

// ---------- DP2-05: bộ phát lịch theo pha (AC-5, E5) ----------
// io giả của một nhịp: chuỗi sức khoẻ lành, gh/git trả rỗng (tuỳ chọn: contract signed-off cho một slug).
const ioGia = (nowMs, { goi = [], kyTren = [] } = {}) => ({
  nowMs: () => nowMs,
  chay: (cmd, args = []) => {
    goi.push([cmd, ...args].join(' '));
    if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 0.00M  free = 1.00M';
    if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
    if (cmd === 'sysctl') return '{ 1.00 1.00 1.00 }';
    if (cmd === 'ps') return '102400 node\n';
    if (cmd === 'gh') return '[]';
    if (cmd === 'git' && args[0] === 'show') {
      const m = /_acceptance\/([^/]+)\/contract\.md$/.exec(args[1] ?? '');
      if (m && kyTren.includes(m[1])) return 'status: signed-off\n';
      throw new Error('khong co');
    }
    return '';
  },
});
const suKien = (dot) => {
  const p = path.join(dot, 'su-kien.jsonl');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).map((d) => JSON.parse(d)) : [];
};
const ghiDon = (dot, phien, loai, worktree) =>
  ghiJ(path.join(dot, 'xin', `${phien}-${loai}.json`), { phien, slug: `h-${phien}`, loai, luc: new Date().toISOString(), worktree });
const nap = (gocGoi, tep) => import(`${path.join(gocGoi, 'scripts', tep)}?v=${Math.random()}`);

// Một đợt mở từ gói, đặt pha, có đơn merge (P1) và s4 (P2); một nhịp; trả tài nguyên được cấp.
async function capTheoPha(gocGoi, pha) {
  const { taoVong } = await nap(gocGoi, 'phat-lich.mjs');
  const { datPha } = await nap(gocGoi, 'pha.mjs');
  const kho = khoThu('dp2-pha-kho-');
  const { w1, w2 } = goiThu(kho);
  khaiGoi(kho);
  assert.equal(chayCli(kho, ['mo', 'thu'], { gocGoi }).ma, 0);
  const dot = thuMucDot(kho);
  if (pha !== 'nhap') datPha(dot, 'dang-chay', { boi: 't' });
  if (pha === 'tam-dung' || pha === 'dang-dong') datPha(dot, pha, { boi: 't' });
  ghiDon(dot, 'P1', 'merge', w1);
  ghiDon(dot, 'P2', 's4', w2);
  const gio = Date.now();
  await taoVong(dot, ioGia(gio), () => gio)();
  const cap = suKien(dot).filter((e) => e.loai === 'cap').map((e) => e.tai_nguyen).sort();
  return { cap, tt: docJ(path.join(dot, 'trang-thai.json')), dot, kho };
}

const BANG_CAP = { 'dang-chay': ['merge', 's4'], nhap: [], 'tam-dung': [], 'dang-dong': ['merge'] };

async function kiemCapTheoPha(gocGoi) {
  const loi = [];
  for (const [pha, can] of Object.entries(BANG_CAP)) {
    process.env.DIEU_PHOI_MAY_DIR = tam('dp2-may05-');
    const { cap, tt } = await capTheoPha(gocGoi, pha);
    if (cap.join(',') !== can.join(',')) loi.push(`${pha}: cấp [${cap}] cần [${can}]`);
    if (tt.pha !== pha) loi.push(`${pha}: trang-thai.pha = ${tt.pha}`);
  }
  return loi;
}

test('DP2-05 cap-theo-pha', async () => {
  assert.deepEqual(await kiemCapTheoPha(GOI), []);
});

// Dựng fixture đợt cũ crm (dot-crm-0910 của DP1) vào một kho thử — chép lại cách dựng của dong-goi.test.
export function dungDotCu() {
  const kho = khoThu('dp2-cu-');
  const dot = path.join(kho, '.acceptance-runs', 'dieu-phoi-sau-14-10');
  chep(path.join(DAY, 'fixtures', 'dot-crm-0910'), dot);
  const tatCa = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? tatCa(path.join(d, e.name)) : [path.join(d, e.name)]));
  const ke = kho.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const p of tatCa(dot)) {
    const t = fs.readFileSync(p, 'utf8');
    if (!t.includes('@KHO@')) continue;
    const moi = t.split('@KHO@').join(kho);
    for (const m of moi.matchAll(new RegExp(`"(${ke}[^"]*)"`, 'g'))) fs.mkdirSync(m[1], { recursive: true });
    fs.writeFileSync(p, moi);
  }
  for (const tn of fs.readdirSync(path.join(dot, 'khoa'))) {
    const pn = path.join(dot, 'khoa', tn, 'nhip');
    if (fs.existsSync(pn)) {
      const l = new Date(fs.readFileSync(pn, 'utf8').trim());
      if (!Number.isNaN(l.getTime())) fs.utimesSync(pn, l, l);
    }
  }
  fs.symlinkSync(dot, path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai'));
  return { kho, dot: fs.realpathSync(dot), chup: Date.parse(docJ(path.join(dot, 'trang-thai.json')).nhip_cuoi) };
}

test('DP2-05 dot-cu', async () => {
  const { taoVong } = await nap(GOI, 'phat-lich.mjs');
  const { dot, chup } = dungDotCu();
  assert.equal(fs.existsSync(path.join(dot, 'dieu-khien.json')), false, 'fixture phải là đợt cũ (không dieu-khien.json)');
  const sau = chup + 60_000;
  await taoVong(dot, ioGia(sau), () => sau)();
  assert.equal(docJ(path.join(dot, 'trang-thai.json')).pha, 'dang-chay');
  assert.deepEqual(suKien(dot).filter((e) => e.loai === 'loi-nhip').map((e) => e.ly_do), []);
  assert.deepEqual(suKien(dot).filter((e) => e.loai === 'hang-gop'), [], 'đợt nâng cấp không được đếm vống hàng đã gộp');
});

test('DP2-05-do bo-pha', async () => {
  const sao = path.join(tam(), 'dieu-phoi');
  chep(GOI, sao);
  assert.deepEqual(await kiemCapTheoPha(sao), [], 'đối chứng dương: bản sao lành');
  const p = path.join(sao, 'scripts', 'phat-lich.mjs');
  const goc = fs.readFileSync(p, 'utf8');
  const tiem = goc.replace('    if (!choPhepTheoPha(pha, taiNguyen)) continue;\n', '');
  assert.notEqual(tiem, goc, 'bước tiêm không áp được');
  fs.writeFileSync(p, tiem);
  const loi = await kiemCapTheoPha(sao);
  assert.ok(loi.some((l) => l.startsWith('nhap:')), `phải nêu «nhap»: ${loi.join(' | ')}`);
});
