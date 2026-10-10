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
