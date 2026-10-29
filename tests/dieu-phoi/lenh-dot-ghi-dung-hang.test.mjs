// Hồ sơ lenh-dot-ghi-dung-hang (hàng TC2): lệnh của đợt ghi đúng hàng. Ca TC2-<n> = AC-<n>.
// Kho thử do code sinh trong lượt: git init + một kho «origin» trần, nhánh chính đẩy lên origin nên `origin/main` có thật;
// worktree mỗi dãy; đợt mở bằng `mo` thật từ gói đợt khai qua cấu hình. CLI `dieu-phoi.mjs` chạy thật bằng tiến trình con;
// bộ phát lịch chạy thật một nhịp (`motNhip`) với git thật trên kho thử và số đo máy giả — `tiep/<dãy>.json` do chính bên
// viết sinh. Ca đỏ («-do») tiêm vào bản sao TRỌN thư mục gói SAU khi bản lành xanh trên cùng fixture, kiểm nhát tiêm khớp
// đúng một lần, ghim thông điệp. Mốc so là sha GHIM dưới đây, rút bằng `git archive` trọn thư mục gói. Đường dẫn suy từ
// vị trí tệp.
//   node --test --test-name-pattern=TC2-01 tests/dieu-phoi/lenh-dot-ghi-dung-hang.test.mjs
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(DAY, '..', '..');
const GOI = path.join(KIT, 'dieu-phoi');
export const SHA_MOC = '12701df6c841a4c78871e5303a950d02d5d6bf77';
const SLUG_BAY = 'mot-hai-ba-bon-nam-sau-bay';
const BIEN = ['CLAUDE_CODE_HOST_SESSION_ID', 'CLAUDE_CODE_SESSION_ID'];
// Trạng thái đã ký đọc từ bộ phát lịch (một nguồn với gói), không viết trần trong ca.
const { DA_THONG } = await import(pathToFileURL(path.join(GOI, 'scripts', 'phat-lich.mjs')).href);
const DA_KY = DA_THONG[0];

const canDon = [];
after(() => {
  for (const d of canDon) fs.rmSync(d, { recursive: true, force: true });
});
const tam = (tienTo = 'tc2-') => {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), tienTo)));
  canDon.push(d);
  return d;
};
const docJ = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ghiJ = (p, du) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(du, null, 2));
};
const moiTruongSach = () => Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_') && k !== 'NODE_TEST_CONTEXT' && !BIEN.includes(k)));
const git = (cwd, ...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, env: moiTruongSach(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
let soNap = 0;
const nap = (gocGoi, tep) => import(pathToFileURL(path.join(gocGoi, 'scripts', tep)).href + `?v=${++soNap}`);

function chayCli(cwd, doiSo, { gocGoi = GOI } = {}) {
  const r = spawnSync(process.execPath, [path.join(gocGoi, 'scripts', 'dieu-phoi.mjs'), ...doiSo], { cwd, env: moiTruongSach(), encoding: 'utf8' });
  return { ma: r.status, out: r.stdout, err: r.stderr };
}

// Kho thử + origin trần + worktree mỗi dãy + đợt «thu» mở bằng `mo` thật. `hang` = các hàng của hang-viec.json; `loTrinh`
// (tuỳ chọn) = tệp lộ trình ở gốc kho, `nguon` = nguon_hang của gói.
function khoDot({ day = ['P1', 'P2'], hang, loTrinh = null, nguon = null }) {
  const kho = tam('tc2-kho-');
  const goc = tam('tc2-origin-');
  git(goc, 'init', '-q', '--bare', '-b', 'main');
  git(kho, 'init', '-q', '-b', 'main');
  if (loTrinh) ghiJ(path.join(kho, 'lo-trinh.json'), loTrinh);
  git(kho, 'add', '-A');
  git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
  git(kho, 'remote', 'add', 'origin', goc);
  git(kho, 'push', '-q', '-u', 'origin', 'main');
  const w = {};
  const cha = tam('tc2-wt-');
  for (const id of day) {
    w[id] = path.join(cha, id.toLowerCase());
    git(kho, 'worktree', 'add', '-q', '-b', id.toLowerCase(), w[id]);
    w[id] = fs.realpathSync(w[id]);
  }
  const dir = path.join(kho, 'goi', 'dot-thu');
  const cfg = docJ(path.join(GOI, 'scripts', 'mau', 'dieu-phoi.config.json'));
  ghiJ(path.join(dir, 'dieu-phoi.config.json'), nguon ? { ...cfg, nguon_hang: nguon } : cfg);
  ghiJ(path.join(dir, 'hang-viec.json'), { dot: '', day: day.map((id) => ({ id, worktree: w[id] })), hang, ngoai_hang_merge: [] });
  fs.writeFileSync(path.join(dir, 'LUAT-rieng.md'), '# Luật riêng\n');
  fs.mkdirSync(path.join(kho, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(kho, '_acceptance', 'config.yaml'), 'schema_version: 1\ndieu_phoi:\n  goi_dot: goi/dot-{ten}\n');
  const mo = chayCli(kho, ['mo', 'thu', '--phien', 'local_gs']);
  assert.equal(mo.ma, 0, mo.err);
  return { kho, dot: fs.realpathSync(path.join(kho, '.acceptance-runs', 'dieu-phoi-hien-tai')), w };
}

const hopDong = (slug, status, tier = 'T2') => `---\nschema_version: 1\nslug: ${slug}\nrisk_tier: ${tier}\nstatus: ${status}\n---\n\n# ${slug}\n`;
function datHopDong(goc, slug, text) {
  fs.mkdirSync(path.join(goc, '_acceptance', slug), { recursive: true });
  fs.writeFileSync(path.join(goc, '_acceptance', slug, 'contract.md'), text);
}
// Hợp đồng lên nhánh chính: commit ở checkout chính rồi đẩy origin — worktree thấy `origin/main` mới qua ref chung.
function lenNhanhChinh(kho, slug, text) {
  datHopDong(kho, slug, text);
  git(kho, 'add', '-A', '_acceptance');
  git(kho, 'commit', '-q', '-m', `gop ${slug}`);
  git(kho, 'push', '-q', 'origin', 'main');
}

// Một nhịp bộ phát lịch thật: git thật trên kho thử, số đo máy giả.
async function motNhipThat(t, gocGoi = GOI) {
  const { motNhip } = await nap(gocGoi, 'phat-lich.mjs');
  const io = {
    nowMs: () => Date.now(),
    chay: (cmd, args = [], opts = {}) => {
      if (cmd === 'git') return execFileSync('git', args, { cwd: t.kho, env: moiTruongSach(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], ...opts });
      if (cmd === 'sysctl' && args[0] === 'vm.swapusage') return 'total = 24576.00M  used = 0.00M  free = 1.00M';
      if (cmd === 'sysctl' && args.includes('kern.memorystatus_vm_pressure_level')) return '1';
      if (cmd === 'sysctl') return '{ 1.00 1.00 1.00 }';
      if (cmd === 'ps') return '102400 node\n';
      if (cmd === 'gh') return '[]';
      return '';
    },
  };
  await motNhip(t.dot, io);
  return (id) => docJ(path.join(t.dot, 'tiep', `${id}.json`));
}

// Bản gói ở sha ghim, trọn thư mục (một lần mỗi lượt).
let banMoc = null;
function goiMoc() {
  if (banMoc) return banMoc;
  const d = tam('tc2-moc-');
  execFileSync('sh', ['-c', `git -C "${KIT}" archive ${SHA_MOC} dieu-phoi | tar -x -C "${d}"`], { env: moiTruongSach() });
  banMoc = path.join(d, 'dieu-phoi');
  assert.ok(fs.existsSync(path.join(banMoc, 'scripts', 'ghi.mjs')), 'bản gói ở sha ghim không rút được');
  return banMoc;
}
// Bản sao gói đã tiêm: mỗi cặp [cũ, mới] trên tệp `tep` phải khớp đúng một lần.
function saoTiem(tep, ...cap) {
  const d = path.join(tam('tc2-sao-'), 'dieu-phoi');
  fs.cpSync(GOI, d, { recursive: true });
  const p = path.join(d, 'scripts', tep);
  let s = fs.readFileSync(p, 'utf8');
  for (const [cu, moi] of cap) {
    assert.equal(s.split(cu).length - 1, 1, `nhát tiêm phải khớp đúng một lần ở ${tep}: ${cu.slice(0, 60)}`);
    s = s.replace(cu, moi);
  }
  fs.writeFileSync(p, s);
  return d;
}
const slugDon = (t, id, loai) => {
  const p = path.join(t.dot, 'xin', `${id}-${loai}.json`);
  return fs.existsSync(p) ? docJ(p).slug : null;
};
const nhatKy = (t) => fs.readFileSync(path.join(t.dot, 'LUAT.md'), 'utf8').split('\n').filter((d) => d.startsWith('- 20'));
const suKien = (t) => (fs.existsSync(path.join(t.dot, 'su-kien.jsonl')) ? fs.readFileSync(path.join(t.dot, 'su-kien.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map((x) => JSON.parse(x)) : []);

// ---------- TC2-01: đơn xin không cờ mang hàng đang chấm (AC-1, E1) ----------
// Hàng không mang `ma` là hàng giám sát thêm — đã quyết (the.mjs `quyetCua`), nên bộ phát lịch giao được không cần ô.
const HANG_AB = [
  { slug: 'hang-a', day: 'P1', uu_tien: 1 },
  { slug: 'hang-b', day: 'P1', uu_tien: 2 },
];
const HANG_ABX = [...HANG_AB, { slug: 'hang-x', day: 'P2', uu_tien: 1 }];
// Sáu hàng viết sẵn: [tên, dựng, slug đơn cần, tiep cần, hàng của đợt?]. `tiep` do nhịp bộ phát lịch thật sinh.
const MA_TRAN_XIN = [
  ['a', (t) => datHopDong(t.w.P1, 'hang-a', hopDong('hang-a', DA_KY)), 'hang-a'],
  ['b', (t) => datHopDong(t.w.P1, 'hang-b', hopDong('hang-b', 'implemented')), 'hang-b'],
  ['c', (t) => { lenNhanhChinh(t.kho, 'hang-a', hopDong('hang-a', DA_KY)); datHopDong(t.w.P1, 'hang-a', hopDong('hang-a', DA_KY)); datHopDong(t.w.P1, 'hang-b', hopDong('hang-b', 'draft')); }, 'hang-b'],
  ['d', (t) => datHopDong(t.w.P1, 'hang-a', hopDong('hang-a', 'verified')), 'hang-a'],
  ['e', (t) => { datHopDong(t.w.P1, 'hang-a', hopDong('hang-a', DA_KY)); datHopDong(t.w.P1, 'hang-b', hopDong('hang-b', 'implemented')); }, 'hang-b'],
  ['f', (t) => datHopDong(t.w.P1, 'hang-x', hopDong('hang-x', DA_KY)), 'hang-a', HANG_ABX],
];
async function chayMaTranXin(gocGoi = GOI) {
  const loi = [];
  const ra = [];
  for (const [ten, dung, can, hang] of MA_TRAN_XIN) {
    const t = hang ? khoDot({ hang }) : khoDot({ day: ['P1'], hang: HANG_AB });
    dung(t);
    const ke = (await motNhipThat(t))('P1').hang;
    const r = chayCli(t.w.P1, ['xin', 's4'], { gocGoi });
    const co = slugDon(t, 'P1', 's4');
    ra.push({ ten, ke, co, ma: r.ma });
    if (co !== can) loi.push(`(${ten}): đơn mang ${co}, cần ${can}`);
  }
  return { loi, ra };
}
test('TC2-01 xin-dung-hang', async () => {
  const { loi, ra } = await chayMaTranXin();
  console.log(`  số hàng: ${ra.length} · ${ra.map((x) => `${x.ten}: tiep ${x.ke} → đơn ${x.co}`).join(' · ')}`);
  assert.equal(ra.length, MA_TRAN_XIN.length);
  assert.deepEqual(ra.map((x) => x.ke), ['hang-b', 'hang-b', 'hang-b', 'hang-a', 'hang-b', 'hang-a'], 'tiep do bộ phát lịch sinh lệch ma trận');
  assert.deepEqual(loi, []);
});
test('TC2-01-do ve-slug-ke', async () => {
  assert.deepEqual((await chayMaTranXin()).loi, []);
  const sao = saoTiem('ghi.mjs', ['slug: slug ?? slugCuaDon(thuMuc, hangViec, day, loai)', 'slug: slug ?? slugKeCua(thuMuc, hangViec, day.id)']);
  assert.deepEqual((await chayMaTranXin(sao)).loi, ['(a): đơn mang hang-b, cần hang-a']);
});
test('TC2-01-do gop-bac', async () => {
  assert.deepEqual((await chayMaTranXin()).loi, []);
  const sao = saoTiem('ghi.mjs', ['for (const trangThai of bac) {', 'for (const trangThai of [bac.flat()]) {']);
  assert.deepEqual((await chayMaTranXin(sao)).loi, ['(e): đơn mang null, cần hang-b']);
});
test('TC2-01-do bo-loc-day', async () => {
  assert.deepEqual((await chayMaTranXin()).loi, []);
  const sao = saoTiem('ghi.mjs', ['for (const h of (hangViec.hang ?? []).filter((x) => x.day === day.id)) {', 'for (const h of hangViec.hang ?? []) {']);
  assert.deepEqual((await chayMaTranXin(sao)).loi, ['(f): đơn mang hang-x, cần hang-a']);
});

// ---------- TC2-02: loại lượt, --slug và nhiều ứng viên (AC-2, E2) ----------
async function dotHangA() {
  const t = khoDot({ day: ['P1'], hang: HANG_AB });
  datHopDong(t.w.P1, 'hang-a', hopDong('hang-a', DA_KY));
  await motNhipThat(t);
  return t;
}
test('TC2-02 loai-luot', async () => {
  const t = await dotHangA();
  const ra = [['ghim-lai'], ['merge'], ['s4', '--slug', 'hang-b'], ['duong-nen']].map((a) => {
    const r = chayCli(t.w.P1, ['xin', ...a]);
    assert.equal(r.ma, 0, r.err);
    return slugDon(t, 'P1', a[0]);
  });
  assert.deepEqual(ra, ['hang-a', 'hang-a', 'hang-b', 'hang-b']);
  // Hàng (e): A đã ký chờ gộp, B đang chấm — s4 mang B, ghim-lai và merge mang A.
  const e = khoDot({ day: ['P1'], hang: HANG_AB });
  datHopDong(e.w.P1, 'hang-a', hopDong('hang-a', DA_KY));
  datHopDong(e.w.P1, 'hang-b', hopDong('hang-b', 'implemented'));
  await motNhipThat(e);
  assert.deepEqual(['s4', 'ghim-lai', 'merge'].map((l) => (chayCli(e.w.P1, ['xin', l]), slugDon(e, 'P1', l))), ['hang-b', 'hang-a', 'hang-a']);
});
const HANG_ABC = [...HANG_AB, { slug: 'hang-c', day: 'P1', uu_tien: 3 }];
async function xetNhieuUngVien(gocGoi = GOI) {
  const t = khoDot({ day: ['P1'], hang: HANG_ABC });
  datHopDong(t.w.P1, 'hang-a', hopDong('hang-a', DA_KY));
  datHopDong(t.w.P1, 'hang-c', hopDong('hang-c', DA_KY));
  await motNhipThat(t);
  const r = chayCli(t.w.P1, ['xin', 's4'], { gocGoi });
  const loi = [];
  if (slugDon(t, 'P1', 's4') !== null) loi.push('hai ứng viên mà vẫn ghi đơn');
  else if (r.ma !== 1 || !['hang-a', 'hang-c', '--slug'].every((x) => r.err.includes(x))) loi.push(`từ chối sai lời: mã ${r.ma}, ${r.err.trim()}`);
  return { t, loi };
}
test('TC2-02 nhieu-ung-vien', async () => {
  const { t, loi } = await xetNhieuUngVien();
  assert.deepEqual(loi, []);
  fs.rmSync(path.join(t.w.P1, '_acceptance', 'hang-c'), { recursive: true });
  const r = chayCli(t.w.P1, ['xin', 's4']);
  assert.equal(r.ma, 0, r.err);
  assert.equal(slugDon(t, 'P1', 's4'), 'hang-a');
});
test('TC2-02-do lay-dau', async () => {
  assert.deepEqual((await xetNhieuUngVien()).loi, []);
  const sao = saoTiem('ghi.mjs', ['if (ung.length > 1) throw new Error(', 'if (ung.length > 1) return ung[0]; if (false) throw new Error(']);
  assert.deepEqual((await xetNhieuUngVien(sao)).loi, ['hai ứng viên mà vẫn ghi đơn']);
});

// ---------- TC2-03 / TC2-04: hang them nhận mã hay slug của lộ trình (AC-3, AC-4; E3, E4) ----------
const LO_TRINH = {
  schema: 1,
  hang: [
    { ma: 'A', cau_giao: 'hàng a', slug: 'hang-a' },
    { ma: 'F12', cau_giao: 'một hai ba bốn năm sáu bảy', slug: SLUG_BAY, vung: ['app/f12/**'] },
  ],
};
const dotLoTrinh = () => khoDot({ hang: [{ ma: 'A', slug: 'hang-a', day: 'P1', uu_tien: 1, tep: 'lo-trinh.json' }], loTrinh: LO_TRINH, nguon: ['lo-trinh.json:A'] });
const hangMoiP2 = (t) => docJ(path.join(t.dot, 'hang-viec.json')).hang.filter((h) => h.day === 'P2');
async function xetThemLoTrinh(gocGoi = GOI) {
  const loi = [];
  for (const khoa of ['F12', SLUG_BAY]) {
    const t = dotLoTrinh();
    const truoc = nhatKy(t).length;
    const r = chayCli(t.kho, ['hang', 'them', khoa, '--day', 'P2'], { gocGoi });
    if (r.ma !== 0) { loi.push(`${khoa}: thoát ${r.ma} ${r.err.trim()}`); continue; }
    const [h, ...du] = hangMoiP2(t);
    if (du.length) loi.push(`${khoa}: thêm ${du.length + 1} hàng`);
    if (h?.slug !== SLUG_BAY) loi.push(`${khoa}: slug ${h?.slug}, cần ${SLUG_BAY}`);
    else if (h.ma !== 'F12' || JSON.stringify(h.ranh_gioi) !== '["app/f12/**"]') loi.push(`${khoa}: ma ${h.ma}, ranh_gioi ${JSON.stringify(h.ranh_gioi)}`);
    if (nhatKy(t).length !== truoc + 1) loi.push(`${khoa}: ${nhatKy(t).length - truoc} dòng Nhật ký`);
    const { docHangViec } = await nap(GOI, 'hinh-dang.mjs');
    try { docHangViec(t.dot); } catch (e) { loi.push(`${khoa}: hang-viec lệch khuôn — ${e.message}`); }
  }
  return loi;
}
test('TC2-03 them-theo-lo-trinh', async () => {
  assert.deepEqual(await xetThemLoTrinh(), []);
  // `--ranh-gioi` thắng `vung` của lộ trình; slug và mã vẫn của lộ trình.
  const t = dotLoTrinh();
  assert.equal(chayCli(t.kho, ['hang', 'them', 'F12', '--day', 'P2', '--ranh-gioi', 'app/khac/**']).ma, 0);
  assert.deepEqual(hangMoiP2(t).map((h) => [h.slug, h.ma, h.ranh_gioi]), [[SLUG_BAY, 'F12', ['app/khac/**']]]);
});
test('TC2-03-do bo-tra-lo-trinh', async () => {
  assert.deepEqual(await xetThemLoTrinh(), []);
  const sao = saoTiem('hang.mjs', ['const lt = goc ? null : hangLoTrinh(thuMuc, khoa);', 'const lt = null;']);
  const loi = await xetThemLoTrinh(sao);
  assert.ok(loi.includes(`F12: slug f12, cần ${SLUG_BAY}`), JSON.stringify(loi));
});

const CAU_TU_DO = 'Sửa nút xuất báo cáo cho mọi trang quản trị';
const SLUG_NGOAI = 'tam-chin-muoi-muoi-mot-muoi-hai-ba';
// Ba hàng viết sẵn: [đối số, bên so]. «moc» = hàng mới so bằng hàng do bản gói ở sha ghim thêm; chuỗi = slug cần.
const MA_TRAN_NGOAI = [[CAU_TU_DO, 'moc'], [SLUG_NGOAI, SLUG_NGOAI], ['Z9', 'moc']];
async function xetNgoaiLoTrinh(gocGoi = GOI) {
  const loi = [];
  for (const [khoa, so] of MA_TRAN_NGOAI) {
    const t = dotLoTrinh();
    const r = chayCli(t.kho, ['hang', 'them', khoa, '--day', 'P2'], { gocGoi });
    if (r.ma !== 0) { loi.push(`${khoa}: thoát ${r.ma}`); continue; }
    const moi = hangMoiP2(t);
    if (so === 'moc') {
      const m = dotLoTrinh();
      assert.equal(chayCli(m.kho, ['hang', 'them', khoa, '--day', 'P2'], { gocGoi: goiMoc() }).ma, 0);
      if (JSON.stringify(moi) !== JSON.stringify(hangMoiP2(m))) loi.push(`${khoa}: lệch bản ở sha ghim — ${JSON.stringify(moi)} ≠ ${JSON.stringify(hangMoiP2(m))}`);
    } else if (moi[0]?.slug !== so) loi.push(moi[0]?.slug?.split('-').length === 6 ? 'slug bị cắt còn sáu từ' : `${khoa}: slug ${moi[0]?.slug}`);
    const nk = nhatKy(t).length;
    const sk = suKien(t).length;
    const lai = chayCli(t.kho, ['hang', 'them', khoa, '--day', 'P2'], { gocGoi });
    if (!lai.out.includes('không đổi gì') || nhatKy(t).length !== nk || suKien(t).length !== sk) loi.push(`${khoa}: lần hai vẫn đổi`);
  }
  return loi;
}
test('TC2-04 ngoai-lo-trinh', async () => {
  const loi = await xetNgoaiLoTrinh();
  console.log(`  số hàng: ${MA_TRAN_NGOAI.length}`);
  assert.deepEqual(loi, []);
});
test('TC2-04-do cat-slug', async () => {
  assert.deepEqual(await xetNgoaiLoTrinh(), []);
  const sao = saoTiem('hang.mjs', ['(LA_SLUG.test(khoa) ? khoa : suySlug(khoa))', 'suySlug(khoa)']);
  assert.deepEqual(await xetNgoaiLoTrinh(sao), ['slug bị cắt còn sáu từ']);
});

// ---------- TC2-05 / TC2-06: hang chay-lai (AC-5, AC-6; E5, E6) ----------
const HANG_P2 = [
  { slug: 'hang-a', day: 'P1', uu_tien: 1 },
  { slug: 'hang-c', day: 'P2', uu_tien: 1 },
];
async function xetChayLai(gocGoi = GOI) {
  const loi = [];
  const t = khoDot({ hang: HANG_P2 });
  const p = path.join(t.dot, 'hang-viec.json');
  const truocNghi = fs.readFileSync(p, 'utf8');
  assert.equal(chayCli(t.kho, ['hang', 'nghi', 'P2']).ma, 0);
  const nghi = (await motNhipThat(t))('P2');
  assert.equal(nghi.cho, 'nghi', `nhịp sau nghi: ${JSON.stringify(nghi)}`);
  const nk = nhatKy(t);
  const sk = suKien(t).length;
  const r = chayCli(t.kho, ['hang', 'chay-lai', 'P2'], { gocGoi });
  if (r.ma !== 0) return [`chay-lai thoát ${r.ma}: ${r.err.trim()}`];
  if (docJ(p).day.find((d) => d.id === 'P2').nghi === true) return ['P2 vẫn nghỉ sau chay-lai'];
  if (fs.readFileSync(p, 'utf8') !== truocNghi) loi.push('hang-viec.json khác bản trước nghi');
  const moiNk = nhatKy(t).filter((d) => !nk.includes(d)); // Nhật ký ghi dòng mới lên đầu
  if (moiNk.length !== 1 || !moiNk[0].includes('cho P2 chạy lại')) loi.push(`Nhật ký mới: ${JSON.stringify(moiNk)}`);
  const moiSk = suKien(t).slice(sk);
  if (moiSk.length !== 1 || moiSk[0].loai !== 'doi-ke-hoach' || moiSk[0].kieu !== 'chay-lai' || moiSk[0].day !== 'P2') loi.push(`sự kiện mới: ${JSON.stringify(moiSk)}`);
  const ke = (await motNhipThat(t))('P2');
  if (ke.hang !== 'hang-c') loi.push(`tiep P2 sau chay-lai: ${JSON.stringify(ke)}`);
  const nk2 = nhatKy(t).length;
  const sk2 = suKien(t).length;
  const lai = chayCli(t.kho, ['hang', 'chay-lai', 'P2'], { gocGoi });
  if (!lai.out.includes('không đổi gì') || nhatKy(t).length !== nk2 || suKien(t).length !== sk2) loi.push('lần hai vẫn đổi');
  return loi;
}
test('TC2-05 chay-lai', async () => {
  assert.deepEqual(await xetChayLai(), []);
});
test('TC2-05-do khong-go-nghi', async () => {
  assert.deepEqual(await xetChayLai(), []);
  const sao = saoTiem('hang.mjs', ['  delete d.nghi;\n', '']);
  assert.deepEqual(await xetChayLai(sao), ['P2 vẫn nghỉ sau chay-lai']);
});

function bamThuMuc(goc) {
  const h = createHash('sha256');
  const di = (d) => {
    for (const ten of fs.readdirSync(d).sort()) {
      const p = path.join(d, ten);
      const st = fs.lstatSync(p);
      if (st.isSymbolicLink()) h.update(`L ${ten} ${fs.readlinkSync(p)}\n`);
      else if (st.isDirectory()) { h.update(`D ${ten}\n`); di(p); }
      else h.update(`F ${ten}\n`).update(fs.readFileSync(p));
    }
  };
  di(goc);
  return h.digest('hex');
}
test('TC2-06 chay-lai-bien', () => {
  const t = khoDot({ hang: HANG_P2 });
  const bam = bamThuMuc(t.dot);
  const vang = chayCli(t.kho, ['hang', 'chay-lai', 'P9']);
  assert.equal(vang.ma, 1, vang.out);
  assert.match(vang.err, /không có dãy P9/);
  assert.equal(bamThuMuc(t.dot), bam, 'chay-lai dãy vắng đổi thư mục đợt');
  const chua = chayCli(t.kho, ['hang', 'chay-lai', 'P1']);
  assert.equal(chua.ma, 0, chua.err);
  assert.match(chua.out, /không đổi gì/);
  const dung = chayCli(t.kho, ['hang']);
  assert.notEqual(dung.ma, 0);
  assert.match(dung.err, /chay-lai <P>/);
  assert.equal(chayCli(t.kho, ['hang', 'nghi', 'P1']).ma, 0);
  const doi = chayCli(t.kho, ['hang', 'chay-lai', 'P1']);
  assert.equal(doi.ma, 0, doi.err);
  assert.match(doi.out, /đã đổi/);
});

// ---------- TC2-07: hồ sơ T1 đã gộp không còn là hàng đang làm (AC-7, E7) ----------
const HANG_TU = [
  { slug: 'hang-t', day: 'P1', uu_tien: 1 },
  { slug: 'hang-u', day: 'P1', uu_tien: 2 },
];
const hopDongT = (tier) => `---\nschema_version: 1\nslug: hang-t\nrisk_tier: ${tier}      # chú thích của kho\nstatus: draft      # ${tier}: không qua cổng\n---\n`;
// Ba hàng viết sẵn: [tên, dựng, tiep cần].
const MA_TRAN_T1 = [
  ['t1-tren-nhanh-chinh', (t) => { lenNhanhChinh(t.kho, 'hang-t', hopDongT('T1')); datHopDong(t.w.P1, 'hang-t', hopDongT('T1')); }, 'hang-u'],
  ['t1-chi-worktree', (t) => datHopDong(t.w.P1, 'hang-t', hopDongT('T1')), 'hang-t'],
  ['t2-tren-nhanh-chinh', (t) => { lenNhanhChinh(t.kho, 'hang-t', hopDongT('T2')); datHopDong(t.w.P1, 'hang-t', hopDongT('T2')); }, 'hang-t'],
];
async function xetT1(gocGoi = GOI) {
  const loi = [];
  for (const [ten, dung, can] of MA_TRAN_T1) {
    const t = khoDot({ day: ['P1'], hang: HANG_TU });
    dung(t);
    const ke = (await motNhipThat(t, gocGoi))('P1').hang;
    if (ke !== can) loi.push(ten === 't1-tren-nhanh-chinh' ? 'hồ sơ T1 đã gộp vẫn là hàng đang làm' : `${ten}: tiep ${ke}, cần ${can}`);
  }
  return loi;
}
test('TC2-07 t1-da-gop', async () => {
  const loi = await xetT1();
  console.log(`  số hàng: ${MA_TRAN_T1.length}`);
  assert.deepEqual(loi, []);
});
test('TC2-07-do bo-ve-t1', async () => {
  assert.deepEqual(await xetT1(), []);
  const sao = saoTiem('phat-lich.mjs', ["  return text.match(/^risk_tier:\\s*(\\S+)/m)?.[1] === 'T1';", '  return false;']);
  assert.deepEqual(await xetT1(sao), ['hồ sơ T1 đã gộp vẫn là hàng đang làm']);
});

// ---------- TC2-08: đường đọc-cũ giống bản ở sha ghim (AC-8, E8) ----------
const BO_GIO = new Set(['luc', 'ts', 'cap_luc', 'han_thue_den', 'nhip_cuoi']);
const chuanHoa = (t, s) => {
  let x = s;
  for (const [goc, the] of [[t.dot, '<DOT>'], ...Object.entries(t.w).map(([id, p]) => [p, `<W-${id}>`]), [t.kho, '<KHO>']]) x = x.split(goc).join(the);
  return x;
};
const boGio = (o) => (Array.isArray(o) ? o.map(boGio) : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).filter(([k]) => !BO_GIO.has(k)).map(([k, v]) => [k, boGio(v)])) : o);
function chup(t, tep) {
  const ra = {};
  for (const f of tep) {
    const p = path.join(t.dot, f);
    if (!fs.existsSync(p)) { ra[f] = null; continue; }
    const s = chuanHoa(t, fs.readFileSync(p, 'utf8'));
    ra[f] = f.endsWith('.jsonl') ? s.trim().split('\n').filter(Boolean).map((d) => boGio(JSON.parse(d))) : boGio(JSON.parse(s));
  }
  return ra;
}
// Năm hàng viết sẵn: [tên, chạy(t, gocGoi), tệp so].
const MA_TRAN_CU = [
  ['xin-co-slug', async (t, g) => { await motNhipThat(t, g); chayCli(t.w.P1, ['xin', 's4', '--slug', 'hang-a'], { gocGoi: g }); }, ['xin/P1-s4.json']],
  ['xin-khong-ho-so', async (t, g) => { await motNhipThat(t, g); chayCli(t.w.P1, ['xin', 's4'], { gocGoi: g }); }, ['xin/P1-s4.json']],
  ['them-hang-co-san', async (t, g) => { chayCli(t.kho, ['hang', 'them', 'hang-a', '--day', 'P2'], { gocGoi: g }); }, ['hang-viec.json', 'su-kien.jsonl']],
  ['nghi', async (t, g) => { chayCli(t.kho, ['hang', 'nghi', 'P2'], { gocGoi: g }); }, ['hang-viec.json', 'su-kien.jsonl']],
  ['nhip-khong-t1', async (t, g) => { datHopDong(t.w.P1, 'hang-a', hopDong('hang-a', 'implemented')); await motNhipThat(t, g); }, ['tiep/P1.json', 'tiep/P2.json']],
];
async function soDocCu(gocMoi = GOI) {
  const moc = goiMoc();
  assert.ok(!fs.readFileSync(path.join(moc, 'scripts', 'hang.mjs'), 'utf8').includes('choChayLai'), 'bản ở sha ghim đã có vật của vòng — không phải bản cũ');
  const lech = [];
  for (const [ten, chay, tep] of MA_TRAN_CU) {
    const [a, b] = [khoDot({ hang: HANG_P2 }), khoDot({ hang: HANG_P2 })];
    await chay(a, moc);
    await chay(b, gocMoi);
    const [ca, cb] = [chup(a, tep), chup(b, tep)];
    assert.ok(Object.values(ca).some((v) => v !== null), `${ten}: không tệp nào để so`);
    if (JSON.stringify(ca) !== JSON.stringify(cb)) { lech.push(ten); if (process.env.TC2_GO) console.log(ten, JSON.stringify(ca), '\n', JSON.stringify(cb)); }
  }
  return lech;
}
test('TC2-08 doc-cu', async () => {
  console.log(`  số hàng: ${MA_TRAN_CU.length} · bản cũ: ${path.join(goiMoc(), 'scripts', 'dieu-phoi.mjs')}`);
  assert.deepEqual(await soDocCu(), []);
});
test('TC2-08-do doi-su-kien-nghi', async () => {
  assert.deepEqual(await soDocCu(), []);
  const sao = saoTiem('hang.mjs', ["{ kieu: 'nghi', day }", "{ kieu: 'nghi', day, tiem: 1 }"]);
  assert.deepEqual(await soDocCu(sao), ['nghi']);
});

// ---------- TC2-09: lời dặn (AC-9, E9) ----------
const LOI_DAN = {
  'dieu-phoi/README.md': ['`hang chay-lai <dãy>` là lệnh ngược của `hang nghi`', '`xin s4` lấy slug theo thứ tự `--slug` → hồ sơ đang chấm → hồ sơ đã thông chưa gộp → `tiep`', '`hang them` nhận mã hay slug của lộ trình'],
};
export function kiemLoiDan(doc) {
  const loi = [];
  const phang = (s) => s.replace(/\s+/g, ' ');
  for (const [tep, cau] of Object.entries(LOI_DAN)) {
    const s = phang(doc(tep));
    for (const c of cau) if (!s.includes(c)) loi.push(`${tep}: thiếu «${c}»`);
  }
  const tt = 'dieu-phoi/commands/tiep-tuc.md';
  const dong = doc(tt).split('\n').filter((d) => d.includes('`hang nghi`'));
  if (!dong.length || dong.some((d) => !d.includes('hang chay-lai'))) loi.push(`${tt}: chỗ nhắc \`hang nghi\` thiếu \`hang chay-lai\``);
  return loi;
}
const docCay = (f) => fs.readFileSync(path.join(KIT, f), 'utf8');
test('TC2-09 loi-dan', () => {
  assert.deepEqual(kiemLoiDan(docCay), []);
  // Ba biến thể README, mỗi biến thể gỡ đúng một câu: lỗi nêu đúng câu ấy, hai câu kia im.
  for (const c of LOI_DAN['dieu-phoi/README.md']) {
    const doc = (f) => (f === 'dieu-phoi/README.md' ? docCay(f).replace(/\s+/g, ' ').split(c).join('') : docCay(f));
    assert.deepEqual(kiemLoiDan(doc), [`dieu-phoi/README.md: thiếu «${c}»`]);
  }
});
test('TC2-09-do ban-moc', () => {
  const loi = kiemLoiDan((f) => execFileSync('git', ['-C', KIT, 'show', `${SHA_MOC}:${f}`], { encoding: 'utf8', env: moiTruongSach() }));
  assert.deepEqual([...new Set(loi.map((l) => l.split(':')[0]))], ['dieu-phoi/README.md', 'dieu-phoi/commands/tiep-tuc.md']);
});
