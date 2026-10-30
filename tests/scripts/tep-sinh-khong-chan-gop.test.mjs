// tep-sinh-khong-chan-gop.test.mjs — hồ sơ tep-sinh-khong-chan-gop (hàng TC3), ca TS-<n> = AC-n của hợp đồng. Mỗi eval của
// evals.yaml ghim đúng dòng «PASS: TS-…» của tệp này.
//
// Kho thử do CODE sinh trong lượt (git init trong thư mục tạm; hồ sơ và tệp lộ trình viết theo khuôn bên đọc) rồi vẽ bằng
// CHÍNH scripts/product-map.mjs của bộ máy đang đo, chạy bằng tiến trình con với --root kho thử. Khối bật rút NGUYÊN VĂN từ
// khối GITATTR-TEP-SINH của GUIDE.md trong cây đang đo: dòng thuộc tính ghi vào .gitattributes, dòng lệnh chạy trong kho
// thử. git thật gộp thật. Ca đỏ chạy CHÍNH hàm đo trên BẢN SAO bị tiêm (trọn `scripts` + `lib` cho mã; chuỗi khối cho
// khối bật), SAU khi bản lành xanh trên cùng fixture, kiểm nhát tiêm khớp đúng một lần, và ghim thông điệp. «Bản ghim» =
// `git archive <SHA_GHIM> scripts lib` bung trong lượt. Mọi đường suy từ vị trí tệp này. Không ca nào ghi vào cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const SHA_GHIM = 'c0cf637f88fa33a4f30ade8cd1ec68212dd2fa26';
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'ts-tc3-')));
const TEP_LT = 'docs/plan/lo-trinh.json';
const SINH = ['LO-TRINH.html', 'PRODUCT-MAP.md'];
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.TS_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-'));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let seq = 0;
// Cô lập khỏi cấu hình git của máy chấm: cấu hình toàn cục là một tệp do ca tạo (chỉ danh tính + tắt ký), không đọc
// cấu hình hệ thống. Mọi tiến trình con (git, product-map, lệnh của khối) chạy với ENV này.
const CFG_TOAN_CUC = path.join(TMP, 'gitconfig-co-lap');
writeFileSync(CFG_TOAN_CUC, '[user]\n\tname = t\n\temail = t@t\n[commit]\n\tgpgsign = false\n[init]\n\tdefaultBranch = chinh\n');
const ENV = { ...process.env, GIT_CONFIG_GLOBAL: CFG_TOAN_CUC, GIT_CONFIG_NOSYSTEM: '1',
  GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' };
const moi = ten => { const d = path.join(TMP, `${ten}-${++seq}`); mkdirSync(d, { recursive: true }); return d; };
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: ENV }).trim();
const gitMa = (d, ...a) => spawnSync('git', ['-C', d, ...a], { encoding: 'utf8', env: ENV }).status;
const doc = p => readFileSync(p, 'utf8');

// ── Khối bật (bên viết: GUIDE.md) ───────────────────────────────────────────────
const KHOI = 'GITATTR-TEP-SINH';
const rutKhoi = txt => {
  const m = String(txt).match(new RegExp(`<!-- <<<${KHOI} -->\\n([\\s\\S]*?)<!-- ${KHOI}>>> -->`));
  if (!m) throw new Error(`không rút được khối ${KHOI}`);
  const dong = m[1].split('\n').map(x => x.trim()).filter(x => x && !x.startsWith('```'));
  return { thuocTinh: dong.filter(x => /^\S+\s+merge=\S+$/.test(x)), lenh: dong.filter(x => x.startsWith('git config ')) };
};
const KHOI_THAT = doc(path.join(KIT, 'GUIDE.md'));
const tiem = (txt, cu, moiTxt) => {
  const n = txt.split(cu).length - 1;
  if (n !== 1) throw new Error(`nhát tiêm khớp ${n} lần: ${JSON.stringify(cu.slice(0, 60))}`);
  return txt.replace(cu, moiTxt);
};

// ── Bộ máy: cây đang đo, bản sao bị tiêm, bản ghim ──────────────────────────────
const banSao = (tiems = []) => {
  const d = moi('may');
  cpSync(path.join(KIT, 'scripts'), path.join(d, 'scripts'), { recursive: true });
  cpSync(path.join(KIT, 'lib'), path.join(d, 'lib'), { recursive: true });
  for (const [tep, cu, m] of tiems) writeFileSync(path.join(d, tep), tiem(doc(path.join(d, tep)), cu, m));
  return d;
};
let _ghim = null;
const banGhim = () => {
  if (_ghim) return _ghim;
  const d = moi('ghim');
  const tar = path.join(TMP, 'ghim.tar');
  execFileSync('git', ['-C', KIT, 'archive', '-o', tar, SHA_GHIM, 'scripts', 'lib'], { env: ENV });
  execFileSync('tar', ['-xf', tar, '-C', d]);
  return (_ghim = d);
};
const ve = (may, goc, ...them) => spawnSync(process.execPath, [path.join(may, 'scripts', 'product-map.mjs'), '--root', goc, ...them], { encoding: 'utf8', env: ENV });
const veOk = (may, goc) => { const r = ve(may, goc); if (r.status !== 0) throw new Error(`vẽ thoát ${r.status}: ${r.stderr.slice(0, 200)}`); };

// ── Kho thử ─────────────────────────────────────────────────────────────────────
const HD = slug => `---\nschema_version: 1\nfeature: viec ${slug}\nslug: ${slug}\nowner: x@y.z\nrisk_tier: T2\nsurfaces: [cli]\nstatus: approved\napproved_by: M\napproved_at: 2026-09-01T00:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n`;
const CFG = coLoTrinh => `schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\n${coLoTrinh ? `lo_trinh:\n  tep: ${TEP_LT}\n` : ''}`;
const ghiLT = (goc, c1, c2) => {
  mkdirSync(path.join(goc, path.dirname(TEP_LT)), { recursive: true });
  writeFileSync(path.join(goc, TEP_LT), JSON.stringify({ schema: 1, ten: 'Lộ trình thử', moc: [], hang: [
    { ma: 'H1', cau_giao: c1, slug: 'h-mot' }, { ma: 'H2', cau_giao: c2, slug: 'h-hai' }], chan_troi: [], da_bac: [] }, null, 2) + '\n');
};
const hoSo = (goc, slug) => { mkdirSync(path.join(goc, '_acceptance', slug), { recursive: true }); writeFileSync(path.join(goc, '_acceptance', slug, 'contract.md'), HD(slug)); };
// thuocTinh: null = không .gitattributes; mảng = các dòng ghi vào .gitattributes. lenh: các dòng chạy trong kho.
const khoGoc = ({ thuocTinh = null, lenh = [], coLoTrinh = true, may = KIT } = {}) => {
  const g = moi('kho');
  git(g, 'init', '-q', '-b', 'chinh');
  mkdirSync(path.join(g, '_acceptance'), { recursive: true });
  writeFileSync(path.join(g, '_acceptance', 'config.yaml'), CFG(coLoTrinh));
  if (coLoTrinh) ghiLT(g, 'Việc một', 'Việc hai');
  hoSo(g, 'goc-viec');
  if (thuocTinh) writeFileSync(path.join(g, '.gitattributes'), thuocTinh.join('\n') + '\n');
  for (const l of lenh) execFileSync('bash', ['-c', l], { cwd: g, stdio: 'ignore', env: ENV });
  veOk(may, g); git(g, 'add', '-A'); git(g, 'commit', '-qm', 'goc');
  return g;
};
// Hai nhánh: `a` và `chinh` mỗi bên đổi một nguồn (kieu), vẽ lại, commit. Trả bản vẽ ở đỉnh a.
const KIEU = {
  'ho-so': [g => hoSo(g, 'a-viec'), g => hoSo(g, 'b-viec')],
  'hang-khac': [g => ghiLT(g, 'Việc một sửa', 'Việc hai'), g => ghiLT(g, 'Việc một', 'Việc hai sửa')],
  'cung-hang': [g => ghiLT(g, 'Việc một bên a', 'Việc hai'), g => ghiLT(g, 'Việc một bên chính', 'Việc hai')],
};
const haiNhanh = (g, kieu, may = KIT) => {
  const [suaA, suaC] = KIEU[kieu];
  git(g, 'checkout', '-qb', 'a'); suaA(g); veOk(may, g); git(g, 'add', '-A'); git(g, 'commit', '-qm', 'a');
  const dinhA = Object.fromEntries(SINH.map(t => [t, doc(path.join(g, t))]));
  git(g, 'checkout', '-q', 'chinh'); suaC(g); veOk(may, g); git(g, 'add', '-A'); git(g, 'commit', '-qm', 'chinh');
  const dinhC = Object.fromEntries(SINH.map(t => [t, doc(path.join(g, t))]));
  git(g, 'checkout', '-q', 'a');
  return { dinhA, dinhC };
};
const gop = g => {
  const ma = gitMa(g, 'merge', 'chinh', '--no-edit');
  const xd = git(g, 'diff', '--name-only', '--diff-filter=U').split('\n').filter(Boolean).sort();
  return { ma, xd };
};

// ── Hàm đo ─────────────────────────────────────────────────────────────────────
// TS-1: kho bật đủ theo khối → gộp không dừng, bản vẽ = bản nhánh a. Trả danh sách lỗi.
const kiemGopKhongDung = khoiTxt => {
  const k = rutKhoi(khoiTxt); const loiDs = []; const kho = {};
  for (const kieu of ['ho-so', 'hang-khac']) {
    const g = khoGoc({ thuocTinh: k.thuocTinh, lenh: k.lenh });
    const { dinhA, dinhC } = haiNhanh(g, kieu);
    const doi = kieu === 'ho-so' ? SINH : ['LO-TRINH.html'];
    for (const t of doi) if (dinhA[t] === dinhC[t]) throw new Error(`fixture ${kieu}: hai nhánh cùng bản ${t}`);
    const r = gop(g);
    if (r.ma !== 0) loiDs.push(`${kieu}: xung đột: ${r.xd.join(', ')}`);
    else if (!SINH.every(t => doc(path.join(g, t)) === dinhA[t])) loiDs.push(`${kieu}: bản vẽ sau gộp không phải bản nhánh a`);
    kho[kieu] = { g, ma: r.ma };
  }
  return { loiDs, kho };
};

// TS-2: sau gộp, --check chưa vẽ lại đỏ đúng tệp; vẽ lại thì xanh.
const kiemCheck = (kho, may) => {
  const loiDs = [];
  const h = kho['ho-so'].g; const k = kho['hang-khac'].g;
  const rH = ve(may, h, '--check');
  if (!(rH.status === 1 && rH.stderr.includes('PRODUCT-MAP.md lệch') && rH.stderr.includes('LO-TRINH.html lệch')))
    loiDs.push(`ho-so: --check thoát ${rH.status}, stderr ${JSON.stringify(rH.stderr.slice(0, 160))}`);
  const rK = ve(may, k, '--check');
  if (rK.status === 0) loiDs.push('hang-khac: --check xanh trên bản vẽ cũ');
  else if (!(rK.status === 1 && rK.stderr.includes('LO-TRINH.html lệch') && !rK.stderr.includes('PRODUCT-MAP.md lệch') && rK.stdout.includes('PRODUCT-MAP.md khớp')))
    loiDs.push(`hang-khac: --check thoát ${rK.status}, stderr ${JSON.stringify(rK.stderr.slice(0, 160))}`);
  for (const [kieu, g] of [['ho-so', h], ['hang-khac', k]]) {
    veOk(may, g);
    const r = ve(may, g, '--check');
    if (r.status !== 0) loiDs.push(`${kieu}: vẽ lại mà --check thoát ${r.status}`);
  }
  const ban = doc(path.join(h, 'PRODUCT-MAP.md'));
  if (!(ban.includes('`a-viec`') && ban.includes('`b-viec`'))) loiDs.push('ho-so: bản đồ vẽ lại thiếu A hay B');
  return loiDs;
};

// TS-4: kho bật, hai nhánh sửa cùng hàng → xung đột ở nguồn, không ở tệp sinh.
const kiemNguon = khoiTxt => {
  const k = rutKhoi(khoiTxt);
  const g = khoGoc({ thuocTinh: k.thuocTinh, lenh: k.lenh });
  haiNhanh(g, 'cung-hang');
  const r = gop(g);
  if (r.ma === 0) return ['xung đột nguồn bị nuốt'];
  if (!deq(r.xd, [TEP_LT])) return [`xung đột ${JSON.stringify(r.xd)}, cần ["${TEP_LT}"]`];
  return [];
};

// TS-5: khối có đúng hai dòng thuộc tính + một lệnh; .gitattributes của kit chứa mọi dòng thuộc tính.
const kiemKitTuBat = (khoiTxt, gitattr) => {
  const k = rutKhoi(khoiTxt); const loiDs = [];
  if (!deq(k.thuocTinh, ['PRODUCT-MAP.md merge=tep-sinh', 'LO-TRINH.html merge=tep-sinh'])) loiDs.push(`khối có dòng thuộc tính ${JSON.stringify(k.thuocTinh)}`);
  if (!deq(k.lenh, ['git config merge.tep-sinh.driver true'])) loiDs.push(`khối có dòng lệnh ${JSON.stringify(k.lenh)}`);
  const co = new Set(String(gitattr).split('\n').map(x => x.trim().replace(/\s+/g, ' ')));
  for (const d of k.thuocTinh) if (!co.has(d)) loiDs.push(`.gitattributes thiếu: ${d}`);
  return loiDs;
};

// TS-6: thư mục rỗng không làm bản vẽ lệch bản đã commit.
const khoRong = (may = KIT) => {
  const g = khoGoc({ may }); hoSo(g, 'hai-viec'); veOk(may, g); git(g, 'add', '-A'); git(g, 'commit', '-qm', 'hai');
  mkdirSync(path.join(g, '_acceptance', 'rong'));
  mkdirSync(path.join(g, '_acceptance', 'rong2', 'figures'), { recursive: true });
  return g;
};
const kiemRong = may => {
  const g = khoRong(may); const loiDs = [];
  const r = ve(may, g, '--check');
  veOk(may, g);
  const map = doc(path.join(g, 'PRODUCT-MAP.md')); const trang = doc(path.join(g, 'LO-TRINH.html'));
  if (/`rong2?`/.test(map)) loiDs.push('rong được xếp Hồ sơ hỏng');
  if (/\brong2?\b/.test(trang)) loiDs.push('rong được đếm ngoài lộ trình');
  if (!loiDs.length && (r.status !== 0 || git(g, 'status', '--porcelain'))) loiDs.push(`--check thoát ${r.status}, cây đổi: ${git(g, 'status', '--porcelain')}`);
  return loiDs;
};

// TS-7: đường đọc-cũ — bản ghim và bản đang đo vẽ giống từng byte trên ba kho.
const HANG7 = ['lo-trinh', 'khong-lo-trinh', 'tep-la'];
const kho7 = (ten, may) => {
  const g = khoGoc({ coLoTrinh: ten !== 'khong-lo-trinh', may });
  hoSo(g, 'hai-viec');
  if (ten === 'tep-la') { mkdirSync(path.join(g, '_acceptance', 'la')); writeFileSync(path.join(g, '_acceptance', 'la', 'ghi-chu.txt'), 'x\n'); }
  return g;
};
const banVe = (may, g) => { veOk(may, g); return SINH.map(t => existsSync(path.join(g, t)) ? doc(path.join(g, t)) : null); };
const kiemDocCu = (moiMay, cuMay) => HANG7.filter(ten => {
  const g = kho7(ten, KIT);
  return !deq(banVe(cuMay, g), banVe(moiMay, g));
});

// ── Ca ─────────────────────────────────────────────────────────────────────────
let kho1 = null;
if (want('TS-1') || want('TS-2')) {
  try {
    const { loiDs, kho } = kiemGopKhongDung(KHOI_THAT); kho1 = kho;
    // Đối chứng của fixture: cùng hai nhánh, không .gitattributes → git dừng ở tệp sinh (hàng nào gộp sạch sẵn thì
    // ca TS-1 không chứng gì).
    for (const kieu of ['ho-so', 'hang-khac']) {
      const g = khoGoc(); haiNhanh(g, kieu); const r = gop(g);
      if (r.ma === 0) throw new Error(`đối chứng ${kieu}: không .gitattributes mà gộp sạch — fixture không chứng gì`);
    }
    if (loiDs.length) bad('TS-1 gop-khong-dung', loiDs.join(' · '));
    else ok('TS-1 gop-khong-dung', 'số hàng: 2');
  } catch (e) { bad('TS-1 gop-khong-dung', loi(e)); }
}
if (want('TS-1-do')) {
  try {
    const lanh = kiemGopKhongDung(KHOI_THAT).loiDs;
    if (lanh.length) throw new Error(`bản lành đỏ: ${lanh.join(' · ')}`);
    const hong = kiemGopKhongDung(tiem(KHOI_THAT, 'LO-TRINH.html merge=tep-sinh\n', '')).loiDs;
    const mong = ['ho-so: xung đột: LO-TRINH.html', 'hang-khac: xung đột: LO-TRINH.html'];
    if (deq(hong, mong)) ok('TS-1-do thieu-dong'); else bad('TS-1-do thieu-dong', `${JSON.stringify(hong)} ≠ ${JSON.stringify(mong)}`);
  } catch (e) { bad('TS-1-do thieu-dong', loi(e)); }
}
if (want('TS-2')) {
  try {
    if (!kho1) throw new Error('TS-1 chưa dựng kho');
    const l = kiemCheck(kho1, KIT);
    if (l.length) bad('TS-2 check-dung-tep', l.join(' · ')); else ok('TS-2 check-dung-tep');
  } catch (e) { bad('TS-2 check-dung-tep', loi(e)); }
}
if (want('TS-2-do')) {
  try {
    const lanh = kiemCheck(kiemGopKhongDung(KHOI_THAT).kho, KIT);
    if (lanh.length) throw new Error(`bản lành đỏ: ${lanh.join(' · ')}`);
    const may = banSao([['scripts/product-map.mjs', 'const ketThuc = code => {\n    if (trang != null) {', 'const ketThuc = code => {\n    if (false) {']]);
    const hong = kiemCheck(kiemGopKhongDung(KHOI_THAT).kho, may);
    const mong = ['hang-khac: --check xanh trên bản vẽ cũ'];
    if (deq(hong, mong)) ok('TS-2-do bo-so-trang'); else bad('TS-2-do bo-so-trang', `${JSON.stringify(hong)} ≠ ${JSON.stringify(mong)}`);
  } catch (e) { bad('TS-2-do bo-so-trang', loi(e)); }
}
if (want('TS-3')) {
  try {
    const k = rutKhoi(KHOI_THAT);
    const hang = { 'khong-thuoc-tinh': { thuocTinh: null }, 'chua-cau-hinh': { thuocTinh: k.thuocTinh } };
    // Chứng lớp cô lập có tác dụng: driver nằm ở một cấu hình toàn cục GIẢ (như máy chấm từng chạy khối với --global) —
    // đọc bằng tệp ấy thì thấy, đọc bằng ENV của ca thì không.
    const GIA = path.join(TMP, 'gitconfig-gia'); writeFileSync(GIA, '[merge "tep-sinh"]\n\tdriver = true\n');
    const loiDs = [];
    for (const [ten, o] of Object.entries(hang)) {
      const g = khoGoc(o);
      if (spawnSync('git', ['-C', g, 'config', '--get', 'merge.tep-sinh.driver'], { env: { ...ENV, GIT_CONFIG_GLOBAL: GIA } }).status !== 0)
        throw new Error(`${ten}: cấu hình giả không đọc được — phép chứng cô lập không chạy`);
      if (gitMa(g, 'config', '--get', 'merge.tep-sinh.driver') === 0) throw new Error(`${ten}: kho thử đã có cấu hình driver`);
      haiNhanh(g, 'ho-so'); const r = gop(g);
      if (!(r.ma === 1 && deq(r.xd, SINH))) loiDs.push(`${ten}: gộp thoát ${r.ma}, xung đột ${JSON.stringify(r.xd)}`);
    }
    if (loiDs.length) bad('TS-3 khong-bat-nhu-cu', loiDs.join(' · ')); else ok('TS-3 khong-bat-nhu-cu', 'số hàng: 2');
  } catch (e) { bad('TS-3 khong-bat-nhu-cu', loi(e)); }
}
if (want('TS-4')) {
  try { const l = kiemNguon(KHOI_THAT); if (l.length) bad('TS-4 nguon-van-xung-dot', l.join(' · ')); else ok('TS-4 nguon-van-xung-dot'); }
  catch (e) { bad('TS-4 nguon-van-xung-dot', loi(e)); }
}
if (want('TS-4-do')) {
  try {
    const lanh = kiemNguon(KHOI_THAT); if (lanh.length) throw new Error(`bản lành đỏ: ${lanh.join(' · ')}`);
    const hong = kiemNguon(tiem(KHOI_THAT, 'LO-TRINH.html merge=tep-sinh\n', 'LO-TRINH.html merge=tep-sinh\n*.json merge=tep-sinh\n'));
    if (deq(hong, ['xung đột nguồn bị nuốt'])) ok('TS-4-do nuot-nguon'); else bad('TS-4-do nuot-nguon', JSON.stringify(hong));
  } catch (e) { bad('TS-4-do nuot-nguon', loi(e)); }
}
const GA = existsSync(path.join(KIT, '.gitattributes')) ? doc(path.join(KIT, '.gitattributes')) : '';
if (want('TS-5')) {
  try { const l = kiemKitTuBat(KHOI_THAT, GA); if (l.length) bad('TS-5 kit-tu-bat', l.join(' · ')); else ok('TS-5 kit-tu-bat'); }
  catch (e) { bad('TS-5 kit-tu-bat', loi(e)); }
}
if (want('TS-5-do')) {
  try {
    const lanh = kiemKitTuBat(KHOI_THAT, GA); if (lanh.length) throw new Error(`bản lành đỏ: ${lanh.join(' · ')}`);
    const hong = kiemKitTuBat(KHOI_THAT, tiem(GA, 'LO-TRINH.html merge=tep-sinh\n', ''));
    const mong = ['.gitattributes thiếu: LO-TRINH.html merge=tep-sinh'];
    if (deq(hong, mong)) ok('TS-5-do thieu-dong-kit'); else bad('TS-5-do thieu-dong-kit', JSON.stringify(hong));
  } catch (e) { bad('TS-5-do thieu-dong-kit', loi(e)); }
}
const TIEM_BAN_DO = ['scripts/product-map.mjs', '      if (!coTepTrongCay(path.join(acc, entry.name))) continue;\n', ''];
const TIEM_TRANG = ['scripts/lo-trinh.mjs', ' && coTepTrongCay(path.join(acc, e.name))', ''];
if (want('TS-6')) {
  try {
    const loiDs = kiemRong(KIT);
    // Đối chứng: thư mục có một tệp lạ vẫn là «Hồ sơ hỏng», và giống bản ghim từng byte.
    const g = khoRong(); mkdirSync(path.join(g, '_acceptance', 'la')); writeFileSync(path.join(g, '_acceptance', 'la', 'ghi-chu.txt'), 'x\n');
    const moiBan = banVe(KIT, g)[1];
    if (!moiBan.includes('`la` — không đọc được hồ sơ')) loiDs.push('thư mục có tệp lạ không còn là Hồ sơ hỏng');
    rmSync(path.join(g, '_acceptance', 'rong'), { recursive: true }); rmSync(path.join(g, '_acceptance', 'rong2'), { recursive: true });
    if (banVe(banGhim(), g)[1] !== moiBan) loiDs.push('bản đồ có tệp lạ khác bản ghim');
    if (loiDs.length) bad('TS-6 thu-muc-rong', loiDs.join(' · ')); else ok('TS-6 thu-muc-rong');
  } catch (e) { bad('TS-6 thu-muc-rong', loi(e)); }
}
if (want('TS-6-do')) {
  try {
    const lanh = kiemRong(KIT); if (lanh.length) throw new Error(`bản lành đỏ: ${lanh.join(' · ')}`);
    const h1 = kiemRong(banSao([TIEM_BAN_DO]));
    if (deq(h1, ['rong được xếp Hồ sơ hỏng'])) ok('TS-6-do loc-ban-do'); else bad('TS-6-do loc-ban-do', JSON.stringify(h1));
    const h2 = kiemRong(banSao([TIEM_TRANG]));
    if (deq(h2, ['rong được đếm ngoài lộ trình'])) ok('TS-6-do loc-trang'); else bad('TS-6-do loc-trang', JSON.stringify(h2));
  } catch (e) { bad('TS-6-do', loi(e)); }
}
if (want('TS-7')) {
  try {
    const cu = banGhim();
    if (doc(path.join(cu, 'lib', 'workspace-record.cjs')).includes('coTepTrongCay')) throw new Error('bản ghim đã có coTepTrongCay — sha ghim sai');
    const lech = kiemDocCu(KIT, cu);
    if (lech.length) bad('TS-7 duong-doc-cu', `lệch: ${JSON.stringify(lech)}`); else ok('TS-7 duong-doc-cu', `số hàng: ${HANG7.length}`);
  } catch (e) { bad('TS-7 duong-doc-cu', loi(e)); }
}
if (want('TS-7-do')) {
  try {
    const cu = banGhim();
    const lanh = kiemDocCu(KIT, cu); if (lanh.length) throw new Error(`bản lành đỏ: ${JSON.stringify(lanh)}`);
    const hong = kiemDocCu(banSao([['scripts/product-map.mjs', "    '# Bản đồ sản phẩm',\n", "    '# Bản đồ sản phẩm', 'x',\n"]]), cu);
    if (deq(hong, HANG7)) ok('TS-7-do lech'); else bad('TS-7-do lech', JSON.stringify(hong));
  } catch (e) { bad('TS-7-do lech', loi(e)); }
}

rmSync(TMP, { recursive: true, force: true });
console.log(`tep-sinh-khong-chan-gop: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
