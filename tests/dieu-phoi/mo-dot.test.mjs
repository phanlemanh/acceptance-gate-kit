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
