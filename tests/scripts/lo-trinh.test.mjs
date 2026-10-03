// lo-trinh.test.mjs — hồ sơ viec-ke-theo-plan (lát 1 lộ trình vào kit), ca LT-01…LT-18, và hồ sơ
// lo-trinh-tren-du-lieu-that (vòng sửa trên dữ liệu thật), ca LT-70…LT-84.
// Mỗi eval của evals.yaml ghim đúng dòng «PASS: LT-…» của tệp này.
//
// Kho thử do CODE sinh trong lượt (git init trong thư mục tạm, hồ sơ dựng bằng hàm `hoSo`). Tệp ý
// định là INPUT người viết, nên ba lộ trình thật nằm ở fixtures/lo-trinh/*.json (rút từ nguồn,
// khối `_nguon` ghi số đo của nguồn). Ca đỏ chạy trên BẢN SAO của vật (`banSao`) với nhát tiêm
// được kiểm đúng một lần thay, SAU khi bản lành xanh trên cùng fixture; thông điệp ghim.
// Mọi đường dẫn suy từ vị trí tệp này. Không ca nào ghi vào cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, rmSync, statSync, readdirSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const FX = path.join(HERE, 'fixtures', 'lo-trinh');
const TMP = mkdtempSync(path.join(tmpdir(), 'lo-trinh-'));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.LT_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + ' '));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const sha = p => createHash('sha256').update(readFileSync(p)).digest('hex');
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...o });
const LO = path.join(KIT, 'scripts', 'lo-trinh.mjs');
const PM = path.join(KIT, 'scripts', 'product-map.mjs');
const SCAN = path.join(KIT, 'scripts', 'start-scan.mjs');
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

if (!existsSync(LO)) {
  console.log(`  FAIL: LT — scripts/lo-trinh.mjs không tồn tại (${LO})`);
  console.log('\nResults: 0 passed, 1 failed (lo-trinh)');
  process.exit(1);
}
const LT = await import(pathToFileURL(LO).href);
const PMM = await import(pathToFileURL(PM).href);

// ── Hồ sơ theo ô bản đồ — dựng bằng code, mỗi khoá một hình dạng tối thiểu hợp lệ ──
const OPP = (stage, decision, nguong = 'xong') => `---\nschema_version: 1\nslug: x\nfeature: viec x\nowner: x@y.z\nstage: ${stage}\ndecision: ${decision}\ndecided_by: ${decision ? 'M' : ''}\ndecided_at: ${decision ? '2026-09-01T00:00:00Z' : ''}\n---\n\n## Vấn đề & ai gặp\n\nNgười dùng X.\n\n## Ngưỡng chết / ngưỡng UAT\n\n- Câu hỏi phép đo trả lời: ${nguong === 'xong' ? 'có giảm không' : '…'}\n- Kết quả nào là SỐNG: ${nguong === 'xong' ? 'giảm một nửa' : '…'}\n- Kết quả nào là CHẾT: ${nguong === 'xong' ? 'không giảm' : '…'}\n- Timebox: ${nguong === 'xong' ? 'một tháng' : '…'}\n`;
const HD = (slug, status, tier = 'T2') => `---\nschema_version: 1\nfeature: viec ${slug}\nslug: ${slug}\nowner: x@y.z\nrisk_tier: ${tier}\nsurfaces: [cli]\nstatus: ${status}\napproved_by: M\napproved_at: 2026-09-01T00:00:00Z\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n- x\n- y\n`;
const EV = slug => `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nhuman_signoff: M 2026-09-02\n---\n\n## Evidence\n`;
const UAT = slug => `---\nschema_version: 1\nslug: ${slug}\nfeature: viec ${slug}\nowner: x@y.z\nstage: held\nverdict: release\ndecided_by: M\ndecided_at: 2026-09-03T00:00:00Z\n---\n`;
const HO_SO = {
  'can-nhac': (d) => ({ 'opportunity.md': OPP('discovery', '', 'mo') }),
  'sap-mo': () => ({ 'opportunity.md': OPP('decided', 'build') }),
  'sap-mo-iterate': () => ({ 'opportunity.md': OPP('decided', 'iterate') }),
  'xep-lai': () => ({ 'opportunity.md': OPP('decided', 'park') }),
  'da-bac': () => ({ 'opportunity.md': OPP('decided', 'kill') }),
  'cho-duyet': (s, t) => ({ 'contract.md': HD(s, 'draft', t) }),
  'dang-dung': (s, t) => ({ 'contract.md': HD(s, 'approved', t) }),
  'da-ship': (s, t) => ({ 'contract.md': HD(s, 'signed-off', t), 'evidence-report.md': EV(s) }),
  'cho-nghiem-thu': (s, t) => ({ 'contract.md': HD(s, 'signed-off', t), 'evidence-report.md': EV(s), 'opportunity.md': OPP('decided', 'build') }),
  'da-nghiem-thu': (s, t) => ({ 'contract.md': HD(s, 'signed-off', t), 'evidence-report.md': EV(s), 'opportunity.md': OPP('decided', 'build'), 'uat-session.md': UAT(s) }),
  'hong': (s) => ({ 'contract.md': HD(s, 'khong-co-trang-thai-nay') }),
};
// Ô bản đồ mong đợi của từng hình dạng — viết TRƯỚC, không rút từ code.
const O_MONG = { 'can-nhac': 'can-nhac', 'sap-mo': 'sap-mo', 'sap-mo-iterate': 'sap-mo', 'xep-lai': 'xep-lai', 'da-bac': 'da-bac', 'cho-duyet': 'cho-duyet', 'dang-dung': 'dang-dung', 'da-ship': 'da-ship', 'cho-nghiem-thu': 'cho-nghiem-thu', 'da-nghiem-thu': 'da-nghiem-thu', 'hong': 'hong' };
const TEN_O = Object.fromEntries(PMM.SECTIONS);

let khoN = 0;
function kho({ data = null, hoSo = {}, tep = 'docs/lo-trinh.json', khoa = true, raw = null, cfgThem = '', t1 = ['PRODUCT-MAP.md', 'LO-TRINH.html'] } = {}) {
  const r = path.join(TMP, `kho-${++khoN}`); mkdirSync(r, { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'x');
  mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'),
    `schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n${t1.map(g => `    - "${g}"\n`).join('')}${khoa ? `lo_trinh:\n  tep: ${tep}   # tệp ý định của kho\n` : ''}${cfgThem}`);
  for (const [slug, spec] of Object.entries(hoSo)) {
    const [hinh, tier] = Array.isArray(spec) ? spec : [spec];
    const d = path.join(r, '_acceptance', slug); mkdirSync(d, { recursive: true });
    for (const [f, t] of Object.entries(HO_SO[hinh](slug, tier))) writeFileSync(path.join(d, f), t);
  }
  if (data != null || raw != null) {
    const p = path.join(r, tep); mkdirSync(path.dirname(p), { recursive: true });
    writeFileSync(p, raw != null ? raw : JSON.stringify(data, null, 2) + '\n');
  }
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'kho thu');
  return r;
}
const phan = (r, classify = PMM.classify) => LT.phanTich({ root: r, classify, sections: PMM.SECTIONS });
const quet = (r, env = {}, kit = KIT) => {
  const x = node([path.join(kit, 'scripts', 'start-scan.mjs'), '--root', r], { env: { ...process.env, ...env } });
  if (x.status !== 0) throw new Error(`start-scan exit ${x.status}: ${x.stderr}`);
  return x;
};
const oBanDo = (md, slug) => { let h = null; for (const l of md.split('\n')) { const m = l.match(/^## (.+)$/); if (m) h = m[1]; else if (h && l.includes(`\`${slug}\``)) return h; } return null; };
const H = (ma, o = {}) => ({ ma, cau_giao: `«câu giao ${ma}»`, ...o });
let bsN = 0;
// Bản sao của vật: trọn scripts lib skills (cây đang kiểm), nhát tiêm phải thay ĐÚNG một lần.
function banSao(tiem = [], goc = KIT) {
  const c = path.join(TMP, `bs-${++bsN}`);
  for (const d of ['scripts', 'lib', 'skills']) cpSync(path.join(goc, d), path.join(c, d), { recursive: true });
  for (const [tep, cu, moi] of tiem) {
    const p = path.join(c, tep); const s = readFileSync(p, 'utf8');
    const n = s.split(cu).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm vào ${tep} khớp ${n} lần (cần 1): ${cu.slice(0, 60)}`);
    writeFileSync(p, s.replace(cu, moi));
  }
  return c;
}

// ── LT-01: ổ cắm vắng thì im ──────────────────────────────────────────────────
// Hàm đo của LT-01 trên MỘT cây `goc` (cây đang kiểm, hoặc bản sao bị tiêm cho chiều đỏ): trả danh
// sách lỗi. Chiều đỏ chạy lại CHÍNH hàm này — thông điệp ghim rút từ đầu ra của nó, không gán sẵn.
const STUB_LT = ['KHOA', 'TEP_TRANG', 'CHUA_MO', 'KHONG_SUY', 'TIN_THEO_LOI', 'DA_GIAO_O', 'CHUA_LAM_O'].map(n => `export const ${n} = undefined;`).join('\n') + '\n'
  + ['khoaTuConfig', 'docKhoa', 'docTep', 'kiemKhuon', 'suyTrangThai', 'hangTre', 'renderLoi', 'renderTrang', 'phanTich', 'veTrang', 'loTrinhThe']
    .map(n => `export function ${n}() { throw new Error('LO-TRINH-GOI-KHI-VANG'); }`).join('\n') + '\n';
function lt01(goc) {
  const hs = { a1: 'sap-mo', a2: 'dang-dung', a3: 'da-ship', a4: 'can-nhac' };
  const stub = banSao([], goc); writeFileSync(path.join(stub, 'scripts', 'lo-trinh.mjs'), STUB_LT);
  const sai = [];
  // B là bản CLONE của A: cùng commit nên cùng giờ commit — hai kho dựng riêng lệch giây khi máy chậm và
  // `since` của ô cân nhắc khác nhau, đỏ vì bàn đo chứ không vì vật (đo được trong suite 03/10).
  const A = kho({ khoa: false, hoSo: hs }); const B = path.join(TMP, `clone-${++khoN}`); execFileSync('git', ['clone', '-q', A, B]);
  const scan = (r, k) => { const x = node([path.join(k, 'scripts', 'start-scan.mjs'), '--root', r]); return x.status === 0 ? JSON.parse(x.stdout) : { loi: x.stderr }; };
  const jA = scan(A, goc); const jB = scan(B, stub);
  if (jA.loTrinh !== null) sai.push(`loTrinh khác null: ${JSON.stringify(jA.loTrinh)}`);
  const boGit = j => ({ ...j, git: null });
  if (!deq(boGit(jA), boGit(jB))) sai.push('JSON start-scan của cây đang kiểm khác bản có mô-đun thay thế');
  for (const [r, k] of [[A, goc], [B, stub]]) {
    const w = node([path.join(k, 'scripts', 'product-map.mjs'), '--root', r]);
    if (w.status !== 0) sai.push(`product-map ghi exit ${w.status} (${k === goc ? 'cây' : 'bản thay'}): ${w.stderr.slice(0, 200)}`);
    const c = node([path.join(k, 'scripts', 'product-map.mjs'), '--root', r, '--check']);
    if (c.status !== 0) sai.push(`--check exit ${c.status}: ${c.stderr.slice(0, 200)}`);
    if (existsSync(path.join(r, 'LO-TRINH.html'))) sai.push('trang sinh khi ổ cắm vắng');
  }
  const mA = existsSync(path.join(A, 'PRODUCT-MAP.md')) ? readFileSync(path.join(A, 'PRODUCT-MAP.md'), 'utf8') : null;
  const mB = existsSync(path.join(B, 'PRODUCT-MAP.md')) ? readFileSync(path.join(B, 'PRODUCT-MAP.md'), 'utf8') : null;
  if (mA !== mB) sai.push('PRODUCT-MAP.md khác nhau giữa hai bản');
  // Đối chứng dương: kho CÓ khoá với bản thay phải ném — chứng minh bản thay thật sự được nạp.
  const C = kho({ hoSo: hs, data: { schema: 1, hang: [H('1')] } });
  const x = node([path.join(stub, 'scripts', 'product-map.mjs'), '--root', C]);
  if (x.status === 0 || !/LO-TRINH-GOI-KHI-VANG/.test(x.stderr)) sai.push(`đối chứng dương: bản thay không ném trên kho có khoá (exit ${x.status})`);
  return sai;
}
if (want('LT-01')) {
  try {
    const sai = lt01(KIT);
    if (sai.length) bad('LT-01', sai.join(' ; '));
    else ok('LT-01', 'kho không khai: bản đồ và JSON quét giống từng byte với bản có mô-đun lộ trình bị thay bằng bản ném lỗi, loTrinh null, không trang; kho có khoá thì bản thay ném');
  } catch (e) { bad('LT-01', loi(e)); }
}
if (want('LT-01-do')) {
  try {
    const mut = banSao([
      ['scripts/product-map.mjs', 'if (tepLoTrinh != null) {', 'if (true) {'],
      ['scripts/lo-trinh.mjs', '  if (khai == null) return null;\n  const nhan = docNhan(root);', "  if (khai == null) return { cacTep: [{ tep: '(vắng)', loi: 'giả', kq: null }], nhan: [] };\n  const nhan = docNhan(root);"],
    ]);
    const sai = lt01(mut);
    const g = sai.find(m => m === 'trang sinh khi ổ cắm vắng');
    if (g) ok('LT-01-do', `bản sao luôn vẽ trang: hàm đo LT-01 chạy lại trả «${g}»`); else bad('LT-01-do', `hàm đo không bắt: ${JSON.stringify(sai)}`);
  } catch (e) { bad('LT-01-do', loi(e)); }
}

// ── LT-02: kiểm khuôn ────────────────────────────────────────────────────────
if (want('LT-02')) {
  try {
    const data = { schema: 1, hang: [H('a', { hang: 'T2', tu_do: { k: [1, 2] } }), { cau_giao: 'y' }, { ma: 'c' }, H('d'), H('a', { cau_giao: 'dup' })] };
    const k = LT.kiemKhuon(data);
    const sai = [];
    if (!deq(k.hang.map(h => h._nhan), ['a', '#2', 'c', 'd', 'a'])) sai.push(`thứ tự ${k.hang.map(h => h._nhan)}`);
    if (!deq(k.hang[0].tu_do, { k: [1, 2] })) sai.push('trường tự do mất');
    const mong = ['hàng #2 thiếu ma', 'hàng c thiếu cau_giao', 'mã trùng: a'];
    if (!deq(k.co, mong)) sai.push(`cờ ${JSON.stringify(k.co)} != ${JSON.stringify(mong)}`);
    if (sai.length) bad('LT-02', sai.join(' ; ')); else ok('LT-02', `đúng ba cờ ${JSON.stringify(mong)}; hàng thiếu hang không cờ; trường tự do giữ nguyên`);
  } catch (e) { bad('LT-02', loi(e)); }
}

// ── LT-03: ba lộ trình thật ──────────────────────────────────────────────────
const docFx = n => JSON.parse(readFileSync(path.join(FX, `${n}.json`), 'utf8'));
const demThieu = co => co.filter(c => / thiếu (ma|cau_giao)$/.test(c)).length;
for (const n of ['crm-okr', 'crm-kho-tai-lieu', 'oneflow']) {
  if (!want(`LT-03 ${n}`)) continue;
  try {
    const f = docFx(n); const k = LT.kiemKhuon(f); const g = f._nguon; const sai = [];
    if (k.hang.length !== g.so_hang) sai.push(`số hàng ${k.hang.length} != ${g.so_hang}`);
    for (const t of g.truong_tu_do) if (!k.hang.some(h => h[t] !== undefined && deq(h[t], f.hang.find(x => x[t] !== undefined)?.[t]))) sai.push(`trường tự do ${t} mất`);
    if (demThieu(k.co) !== g.thieu_bat_buoc) sai.push(`cờ thiếu ${demThieu(k.co)} != ${g.thieu_bat_buoc}`);
    const trung = k.co.filter(c => c.startsWith('mã trùng: ')).map(c => c.slice(10));
    if (!deq(trung, g.ma_trung)) sai.push(`mã trùng ${JSON.stringify(trung)} != ${JSON.stringify(g.ma_trung)}`);
    if (sai.length) bad(`LT-03 ${n}`, sai.join(' ; '));
    else ok(`LT-03 ${n}`, `${k.hang.length} hàng, ${g.truong_tu_do.length} trường tự do còn nguyên, ${g.thieu_bat_buoc} ô bắt buộc thiếu, mã trùng ${JSON.stringify(g.ma_trung)} — đúng như nguồn`);
  } catch (e) { bad(`LT-03 ${n}`, loi(e)); }
}
if (want('LT-03-do')) {
  try {
    const f = docFx('crm-kho-tai-lieu'); const truoc = LT.kiemKhuon(f).co;
    const ban = JSON.parse(JSON.stringify(f)); const h = ban.hang.find(x => x.cau_giao); delete h.cau_giao;
    const sau = LT.kiemKhuon(ban).co;
    const moi = sau.filter(c => !truoc.includes(c));
    if (demThieu(sau) === demThieu(truoc) + 1 && moi.length === 1 && moi[0] === `hàng ${h.ma} thiếu cau_giao`) ok('LT-03-do', `bản sao xoá cau_giao hàng ${h.ma} → đúng một cờ mới «${moi[0]}»`);
    else bad('LT-03-do', `cờ mới ${JSON.stringify(moi)}`);
  } catch (e) { bad('LT-03-do', loi(e)); }
}

// ── LT-04: trạng thái = tiêu đề ô của bản đồ ─────────────────────────────────
const KHOA_O = ['can-nhac', 'sap-mo', 'cho-duyet', 'dang-dung', 'cho-nghiem-thu', 'da-ship', 'da-nghiem-thu', 'xep-lai', 'da-bac', 'hong'];
function lt04(kitScripts = null) {
  const hoSo = Object.fromEntries(KHOA_O.map(k => [`s-${k}`, k]));
  const hang = [...KHOA_O.map(k => H(k, { slug: `s-${k}` })), H('du-kien', { slug: 'chua-co-ho-so' }), H('du-kien-khai', { slug: 'chua-co-2', trang_thai: 'Đã giao' }), H('tin-trong'), H('tin-khai', { trang_thai: 'Đã giao' })];
  const r = kho({ hoSo, data: { schema: 1, hang } });
  let kq;
  if (kitScripts) {
    const x = node(['--input-type=module', '-e', `const L=await import(${JSON.stringify(pathToFileURL(path.join(kitScripts, 'lo-trinh.mjs')).href)});const P=await import(${JSON.stringify(pathToFileURL(path.join(kitScripts, 'product-map.mjs')).href)});const p=L.phanTich({root:${JSON.stringify(r)},classify:P.classify,sections:P.SECTIONS});console.log(JSON.stringify(p.kq.dong.map(d=>({ma:d._ma,chu:d.chu,co:d.coHang,tin:d.tinTheoLoi}))));`]);
    if (x.status !== 0) throw new Error(x.stderr);
    kq = { dong: JSON.parse(x.stdout) };
  } else kq = { dong: phan(r).kq.dong.map(d => ({ ma: d._ma, chu: d.chu, co: d.coHang, tin: d.tinTheoLoi })) };
  const md = PMM.renderProductMap(r);
  const sai = [];
  for (const k of KHOA_O) {
    const d = kq.dong.find(x => x.ma === k); const o = oBanDo(md, `s-${k}`);
    if (o !== TEN_O[O_MONG[k]]) sai.push(`fixture: s-${k} vào ô «${o}», mong «${TEN_O[O_MONG[k]]}»`);
    if (d.chu !== o) sai.push(`slug s-${k}: trang «${d.chu}», bản đồ «${o}»`);
  }
  const dk = kq.dong.find(x => x.ma === 'du-kien');
  if (dk.chu !== 'Chưa mở' || dk.co.length || dk.tin) sai.push(`slug dự kiến: ${JSON.stringify(dk)}`);
  // Slug dự kiến CÓ tự khai «Đã giao»: lát 1 nói không cờ; vòng lo-trinh-tren-du-lieu-that AC-2 thay
  // vế đó — «Không suy được» + ĐÚNG MỘT cờ «tự khai … mà không có hồ sơ», không cờ so lời khai.
  const dkk = kq.dong.find(x => x.ma === 'du-kien-khai');
  if (dkk.chu !== 'Không suy được' || !deq(dkk.co, ['hàng du-kien-khai: tự khai Đã giao mà không có hồ sơ chua-co-2'])) sai.push(`slug dự kiến có tự khai: ${JSON.stringify(dkk)}`);
  const t1 = kq.dong.find(x => x.ma === 'tin-trong'); if (t1.chu !== 'Chưa mở' || !t1.tin) sai.push(`không slug không khai: ${JSON.stringify(t1)}`);
  const t2 = kq.dong.find(x => x.ma === 'tin-khai'); if (t2.chu !== 'Đã giao' || !t2.tin) sai.push(`không slug khai Đã giao: ${JSON.stringify(t2)}`);
  return sai;
}
if (want('LT-04')) {
  try { const sai = lt04(); if (sai.length) bad('LT-04', sai.join(' ; ')); else ok('LT-04', `mười ô: chữ trạng thái == tiêu đề mục bản đồ vẽ cùng lượt; slug dự kiến «Chưa mở» không cờ; không slug «Chưa mở»/«Đã giao» kèm tin theo lời`); }
  catch (e) { bad('LT-04', loi(e)); }
}
if (want('LT-04-do2')) {
  try {
    // Chiều đỏ của vế «slug dự kiến có tự khai → không cờ»: bản sao so lời khai cả khi KHÔNG có hồ sơ.
    const mut = banSao([['scripts/lo-trinh.mjs', 'if (coHoSo && khaiChuan && nhomCua(khaiChuan) !== nhomCua(chu))', 'if (!tinTheoLoi && khaiChuan && nhomCua(khaiChuan) !== nhomCua(chu))']]);
    const sai = lt04(path.join(mut, 'scripts'));
    const g = sai.find(s => s.startsWith('slug dự kiến có tự khai:') && s.includes('tệp khai khác hồ sơ: khai Đã giao, hồ sơ Không suy được'));
    if (g) ok('LT-04-do2', `bản sao so lời khai khi không có hồ sơ → đỏ: «${g.slice(0, 120)}»`); else bad('LT-04-do2', `phép đo không bắt: ${JSON.stringify(sai)}`);
  } catch (e) { bad('LT-04-do2', loi(e)); }
}
if (want('LT-04-do')) {
  try {
    const mut = banSao([['scripts/lo-trinh.mjs', 'chu = TEN[xep(hoSo).key];', "chu = xep(hoSo).key === 'dang-dung' ? 'Đang chạy' : TEN[xep(hoSo).key];"]]);
    const sai = lt04(path.join(mut, 'scripts'));
    const g = sai.find(s => s === 'slug s-dang-dung: trang «Đang chạy», bản đồ «Đang làm»');
    if (g) ok('LT-04-do', `bản sao đổi chữ một ô → đỏ: «${g}»`); else bad('LT-04-do', `phép đo không bắt: ${JSON.stringify(sai)}`);
  } catch (e) { bad('LT-04-do', loi(e)); }
}

// ── LT-05: tự khai lệch hồ sơ ────────────────────────────────────────────────
const LT05 = () => kho({
  hoSo: { r1: 'dang-dung', r2: 'da-ship', r3: 'can-nhac', khac: 'cho-duyet' },
  data: { schema: 1, hang: [H('r1', { slug: 'r1', trang_thai: 'Đã giao' }), H('r2', { slug: 'r2', trang_thai: 'đã giao' }), H('r3', { slug: 'r3', trang_thai: 'đã lên onehub' })] },
});
// Danh sách chỗ lệch của trang (trang-lo-trinh-doc-mot-phut: khối «Cờ» cũ thành «Cần sửa trong kế hoạch»,
// câu đã dịch) — chữ từng ô, bỏ thẻ HTML.
const coTrang = html => { const u = html.match(/<ul class="co-ds">([\s\S]*?)<\/ul>/); return u ? [...u[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')) : []; };
const coDich = c => { const d = LT.dichCo(c); return d.ma != null ? `${d.ma} — ${d.chu}` : d.chu; };
if (want('LT-05')) {
  try {
    const r = LT05(); const kq = phan(r).kq; const html = LT.renderTrang(kq, 'docs/lo-trinh.json'); const sai = [];
    const mong = ['hàng r1: tệp khai khác hồ sơ: khai Đã giao, hồ sơ Đang làm'];
    if (!deq(kq.co, mong)) sai.push(`cờ ${JSON.stringify(kq.co)}`);
    if (kq.dong[0].chu !== 'Đang làm') sai.push(`r1 in «${kq.dong[0].chu}»`);
    // trang-lo-trinh-doc-mot-phut: chữ trang đổi sang tiếng sản phẩm (con trỏ thay thế ở hợp đồng của vòng đó).
    if (!html.includes('kế hoạch ghi «đã lên onehub» — máy không hiểu trạng thái này')) sai.push('trang không in «kế hoạch ghi «đã lên onehub» — máy không hiểu trạng thái này»');
    if (kq.tuKhaiNgoai !== 1) sai.push(`tuKhaiNgoai ${kq.tuKhaiNgoai}`);
    if (sai.length) bad('LT-05', sai.join(' ; ')); else ok('LT-05', `hàng lệch có đúng cờ «${mong[0]}», hàng trùng 0 cờ, hàng ngoài từ vựng in «kế hoạch ghi «…» — máy không hiểu trạng thái này»`);
  } catch (e) { bad('LT-05', loi(e)); }
}
if (want('LT-05-the')) {
  try {
    const r = LT05(); node([PM, '--root', r]);
    const html = readFileSync(path.join(r, 'LO-TRINH.html'), 'utf8');
    const j = JSON.parse(quet(r, { ACCEPTANCE_TODAY: '2026-10-02' }).stdout); const sai = [];
    const ct = coTrang(html); const nCo = j.loTrinh.co.length;
    if (!deq(j.loTrinh.co.map(coDich), ct.slice(0, nCo))) sai.push(`thẻ ${JSON.stringify(j.loTrinh.co)} != trang ${JSON.stringify(ct)}`);
    const la = ct.slice(nCo).map(x => x.match(/ở (\d+) việc — máy không hiểu trạng thái này/));
    if (la.some(x => !x) || la.reduce((n, x) => n + Number(x[1]), 0) !== j.loTrinh.tuKhaiNgoai) sai.push(`hàng ghi trạng thái lạ trên trang ${JSON.stringify(ct.slice(nCo))} != thẻ ${j.loTrinh.tuKhaiNgoai}`);
    if (sai.length) bad('LT-05-the', sai.join(' ; ')); else ok('LT-05-the', `thẻ và trang cùng một danh sách cờ (${j.loTrinh.co.length}, trang in bản dịch) và cùng số hàng ghi trạng thái ngoài từ vựng (${j.loTrinh.tuKhaiNgoai})`);
  } catch (e) { bad('LT-05-the', loi(e)); }
}
function khoCrm() {
  const f = docFx('crm-okr'); const { _nguon, ...data } = f;
  return { r: kho({ data, hoSo: _nguon.ho_so }), f };
}
if (want('LT-05-crm')) {
  try {
    const { r, f } = khoCrm(); const kq = phan(r).kq; const sai = [];
    const bang = {};
    for (const d of kq.dong) if (d.tuKhai) { const k = `${d.tuKhai} → ${d.khaiNgoai ? 'ngoài từ vựng' : 'khớp ô'}`; bang[k] = (bang[k] || 0) + 1; }
    console.log('    bảng từ vựng tự khai (crm OKR):'); for (const [k, n] of Object.entries(bang).sort()) console.log(`      ${k}: ${n}`);
    if (kq.tuKhaiNgoai !== f._nguon.tu_khai_ngoai) sai.push(`ngoài từ vựng ${kq.tuKhaiNgoai} != ${f._nguon.tu_khai_ngoai}`);
    // Cùng nguồn KHÔNG có khối tu_vung: số ngoài từ vựng là số đo của nguồn thật.
    const { _nguon: _g, tu_vung: _t, ...tho } = f;
    const kq2 = phan(kho({ data: tho, hoSo: f._nguon.ho_so })).kq;
    if (kq2.tuKhaiNgoai !== f._nguon.tu_khai_ngoai_khong_tu_vung) sai.push(`không tu_vung: ngoài từ vựng ${kq2.tuKhaiNgoai} != ${f._nguon.tu_khai_ngoai_khong_tu_vung}`);
    const lech = kq.co.filter(c => c.includes('tệp khai khác hồ sơ'));
    if (!lech.some(c => c.startsWith(`hàng ${f._nguon.hang_lech_mau}:`))) sai.push(`không có cờ lệch cho hàng ${f._nguon.hang_lech_mau}: ${JSON.stringify(lech)}`);
    if (sai.length) bad('LT-05-crm', sai.join(' ; ')); else ok('LT-05-crm', `crm OKR thật: ${f._nguon.tu_khai_ngoai_khong_tu_vung} hàng tự khai ngoài từ vựng khi chưa khai tu_vung, ${kq.tuKhaiNgoai} khi có (ghim); cờ lệch ở hàng ${f._nguon.hang_lech_mau}`);
  } catch (e) { bad('LT-05-crm', loi(e)); }
}
if (want('LT-05-tuvung')) {
  try {
    const r = kho({ hoSo: { r1: 'dang-dung', r2: 'da-ship' }, data: { schema: 1, tu_vung: { 'đã lên onehub': 'Đã giao', 'x': 'Xong rồi' }, hang: [H('r1', { slug: 'r1', trang_thai: 'đã lên onehub' }), H('r2', { slug: 'r2', trang_thai: 'Đã lên OneHub' })] } });
    const kq = phan(r).kq;
    const mong = ['tu_vung: «x» trỏ «Xong rồi» — không phải tên trạng thái', 'hàng r1: tệp khai khác hồ sơ: khai đã lên onehub (Đã giao), hồ sơ Đang làm'];
    if (deq(kq.co, mong) && kq.tuKhaiNgoai === 0) ok('LT-05-tuvung', 'khối tu_vung của kho quy đổi chữ riêng sang trạng thái kit: hàng lệch có cờ, hàng khớp (khác hoa thường) không cờ, đích sai có cờ');
    else bad('LT-05-tuvung', `cờ ${JSON.stringify(kq.co)} ngoài ${kq.tuKhaiNgoai}`);
  } catch (e) { bad('LT-05-crm', loi(e)); }
}
if (want('LT-05-im')) {
  try {
    const r = LT05(); const truoc = phan(r).kq.dong.map(d => d.coHang);
    const p = path.join(r, '_acceptance', 'khac', 'contract.md'); writeFileSync(p, readFileSync(p, 'utf8').replace('status: draft', 'status: approved'));
    const sau = phan(r).kq.dong.map(d => d.coHang);
    // Đối chứng dương: đổi hồ sơ CÓ hàng trỏ (r2 → approved) thì cờ phải đổi.
    const p2 = path.join(r, '_acceptance', 'r2', 'contract.md'); writeFileSync(p2, readFileSync(p2, 'utf8').replace('status: signed-off', 'status: approved'));
    const sau2 = phan(r).kq.dong.map(d => d.coHang);
    if (deq(truoc, sau) && !deq(sau, sau2)) ok('LT-05-im', 'đổi hồ sơ không hàng nào trỏ: cờ mọi hàng giữ nguyên; đổi hồ sơ có hàng trỏ: cờ đổi');
    else bad('LT-05-im', `truoc ${JSON.stringify(truoc)} sau ${JSON.stringify(sau)} sau2 ${JSON.stringify(sau2)}`);
  } catch (e) { bad('LT-05-im', loi(e)); }
}

// ── LT-06: trang tất định + --check ──────────────────────────────────────────
const LT06 = () => kho({ hoSo: { p1: 'dang-dung', p2: 'da-ship' }, data: { schema: 1, ten: 'Thử <trang>', moc: [{ ten: 'M1', ngay: '2026-10-01', hang: ['1'] }], hang: [H('1', { slug: 'p1' }), H('2', { slug: 'p2', cau_giao: '<b>&"' }), H('3', { dung_tren: ['2'] })], da_bac: [{ ma: 'x', ly_do: 'trùng' }] } });
if (want('LT-06')) {
  try {
    const r = LT06(); const sai = [];
    node([PM, '--root', r]); const a = readFileSync(path.join(r, 'LO-TRINH.html'), 'utf8');
    node([PM, '--root', r]); const b = readFileSync(path.join(r, 'LO-TRINH.html'), 'utf8');
    if (a !== b) sai.push('hai lần vẽ khác byte');
    // trang-lo-trinh-doc-mot-phut: một script nội tuyến duy nhất (số ngày tới mốc lúc xem); tài nguyên ngoài vẫn cấm.
    if (/ src=|href="?https?:/i.test(a) || (a.match(/<script/g) || []).length > 1) sai.push('trang có tài nguyên ngoài hoặc hơn một script');
    if (a.includes(new Date().toISOString().slice(0, 10))) sai.push('trang chứa ngày chạy');
    if (!a.includes('&lt;b&gt;&amp;&quot;') || a.includes('<b>&"')) sai.push('câu giao không được escape');
    const c = node([PM, '--root', r, '--check']);
    if (c.status !== 0 || !c.stdout.includes('LO-TRINH.html khớp tệp ý định và hồ sơ.')) sai.push(`--check exit ${c.status}: ${c.stdout} ${c.stderr}`);
    if (sai.length) bad('LT-06', sai.join(' ; ')); else ok('LT-06', 'hai lần vẽ cùng byte, không tài nguyên ngoài/ngày chạy, một script nội tuyến, escape đúng, --check khớp');
  } catch (e) { bad('LT-06', loi(e)); }
}
if (want('LT-06-do')) {
  try {
    const ca = {
      'sua-byte': r => { const p = path.join(r, 'LO-TRINH.html'); writeFileSync(p, readFileSync(p, 'utf8').replace('</main>', '</main> ')); },
      'doi-ho-so': r => { const p = path.join(r, '_acceptance', 'p1', 'contract.md'); writeFileSync(p, readFileSync(p, 'utf8').replace('status: approved', 'status: draft')); },
      'xoa-trang': r => rmSync(path.join(r, 'LO-TRINH.html')),
    };
    const sai = [];
    for (const [ten, pha] of Object.entries(ca)) {
      const r = LT06(); node([PM, '--root', r]);
      const lanh = node([PM, '--root', r, '--check']); if (lanh.status !== 0) { sai.push(`${ten}: bản lành không xanh`); continue; }
      if (ten === 'doi-ho-so') { node([PM, '--root', r]); const pm = readFileSync(path.join(r, 'PRODUCT-MAP.md'), 'utf8'); pha(r); writeFileSync(path.join(r, 'PRODUCT-MAP.md'), pm); }
      else pha(r);
      const c = node([PM, '--root', r, '--check']);
      if (c.status !== 1 || !c.stderr.includes('LO-TRINH.html') || !c.stderr.includes('--root')) sai.push(`${ten}: exit ${c.status} stderr «${c.stderr.trim()}»`);
    }
    if (sai.length) bad('LT-06-do', sai.join(' ; ')); else ok('LT-06-do', 'sửa byte · đổi hồ sơ có hàng trỏ · xoá trang: --check exit 1, nêu LO-TRINH.html và lệnh vẽ lại');
  } catch (e) { bad('LT-06-do', loi(e)); }
}
if (want('LT-06-mau')) {
  try {
    const x = node([path.join(HERE, 'lo-trinh-mau.mjs'), '--check']);
    if (x.status === 0) ok('LT-06-mau', 'trang mẫu cho hội đồng == bản vẽ lại trong lượt'); else bad('LT-06-mau', `exit ${x.status}: ${x.stderr || x.stdout}`);
  } catch (e) { bad('LT-06-mau', loi(e)); }
}

// ── LT-07: tệp ý định không bị ghi ───────────────────────────────────────────
function lt07(kit) {
  const r = kho({ hoSo: { q: 'dang-dung' }, data: { schema: 1, hang: [H('9b', { slug: 'q' })] } });
  const p = path.join(r, 'docs', 'lo-trinh.json');
  const sai = []; let truoc = [sha(p), statSync(p).mtimeMs];
  const LENH = [['vẽ', ['product-map.mjs', '--root', r]], ['--check', ['product-map.mjs', '--root', r, '--check']], ['quét start', ['start-scan.mjs', '--root', r]], ['--hang', ['lo-trinh.mjs', '--root', r, '--hang', '9b']]];
  for (const [ten, [tep, ...a]] of LENH) {
    node([path.join(kit, 'scripts', tep), ...a]);
    const sau = [sha(p), statSync(p).mtimeMs];
    if (!deq(truoc, sau)) { sai.push(`tệp ý định bị ghi sau lệnh ${ten}`); truoc = sau; }
  }
  return sai;
}
if (want('LT-07')) {
  try { const sai = lt07(KIT); if (!sai.length) ok('LT-07', 'sha256 + mtime của tệp ý định bằng nhau trước/sau từng lệnh trong bốn lệnh'); else bad('LT-07', sai.join(' ; ')); }
  catch (e) { bad('LT-07', loi(e)); }
}
if (want('LT-07-do')) {
  try {
    const mut = banSao([['scripts/lo-trinh.mjs', '  if (txt.charCodeAt(0) === 0xfeff) txt = txt.slice(1);', "  require('node:fs').writeFileSync(dich, txt + ' ');\n  if (txt.charCodeAt(0) === 0xfeff) txt = txt.slice(1);"]]);
    const sai = lt07(mut); const g = sai.find(m => m.startsWith('tệp ý định bị ghi sau lệnh'));
    if (g) ok('LT-07-do', `bản sao ghi lại tệp sau khi đọc: hàm đo LT-07 chạy lại trả «${g}»`); else bad('LT-07-do', `hàm đo không bắt: ${JSON.stringify(sai)}`);
  } catch (e) { bad('LT-07-do', loi(e)); }
}

// ── LT-08: lỗi tệp hiện rõ, không đỏ ─────────────────────────────────────────
const CA08 = {
  vang: { o: { khoa: true }, ly: 'tệp ý định không tồn tại: docs/lo-trinh.json' },
  'json-hong': { o: { raw: '{ "schema": 1, ' }, ly: 'tệp ý định không phải JSON hợp lệ' },
  'thoat-goc': { o: { tep: '../ngoai.json' }, ly: 'tệp ý định phải nằm trong kho: ../ngoai.json' },
  'khong-object': { o: { raw: '[1, 2]' }, ly: 'gốc tệp ý định phải là một object' },
};
for (const [ten, { o, ly }] of Object.entries(CA08)) {
  if (!want(`LT-08 ${ten}`)) continue;
  try {
    const r = kho({ hoSo: { a: 'sap-mo' }, ...o }); const sai = [];
    const w = node([PM, '--root', r]);
    if (w.status !== 0) sai.push(`product-map ghi exit ${w.status}`);
    if (/\n\s+at /.test(w.stderr)) sai.push('stderr có stack trace');
    const html = existsSync(path.join(r, 'LO-TRINH.html')) ? readFileSync(path.join(r, 'LO-TRINH.html'), 'utf8') : '';
    if (!html.includes(LT.dichLoi(ly).replace(/&/g, '&amp;'))) sai.push(`trang không nêu «${LT.dichLoi(ly)}»`);
    const s = quet(r); const j = JSON.parse(s.stdout);
    if (!j.loTrinh || !String(j.loTrinh.loi).includes(ly)) sai.push(`loTrinh.loi «${j.loTrinh && j.loTrinh.loi}»`);
    if (/\n\s+at /.test(s.stderr)) sai.push('start-scan stderr có stack trace');
    if (sai.length) bad(`LT-08 ${ten}`, sai.join(' ; ')); else ok(`LT-08 ${ten}`, `product-map exit 0, thẻ nêu «${ly}», trang nêu bản tiếng sản phẩm`);
  } catch (e) { bad(`LT-08 ${ten}`, loi(e)); }
}
if (want('LT-08 bom')) {
  try {
    const r = kho({ raw: '﻿' + JSON.stringify({ schema: 1, hang: [H('1')] }) });
    const j = JSON.parse(quet(r).stdout);
    if (j.loTrinh && j.loTrinh.loi === null && j.loTrinh.tinTheoLoi.tong === 1) ok('LT-08 bom', 'tệp có BOM đọc như tệp thường'); else bad('LT-08 bom', JSON.stringify(j.loTrinh));
  } catch (e) { bad('LT-08 bom', loi(e)); }
}
if (want('LT-08 slug-thoat')) {
  try {
    const r = kho({ data: { schema: 1, hang: [H('1', { slug: '../../etc' })] } }); const kq = phan(r).kq;
    if (kq.dong[0].chu === 'Chưa mở' && deq(kq.co, ['hàng 1: slug không hợp lệ: ../../etc'])) ok('LT-08 slug-thoat', 'slug thoát thư mục → «Chưa mở» + cờ slug không hợp lệ, không đọc ngoài _acceptance');
    else bad('LT-08 slug-thoat', JSON.stringify({ chu: kq.dong[0].chu, co: kq.co }));
  } catch (e) { bad('LT-08 slug-thoat', loi(e)); }
}
if (want('LT-08-lanh')) {
  try { const r = kho({ data: { schema: 1, hang: [H('1')] } }); const j = JSON.parse(quet(r).stdout); if (j.loTrinh && j.loTrinh.loi === null) ok('LT-08-lanh', 'tệp lành: loTrinh.loi null'); else bad('LT-08-lanh', JSON.stringify(j.loTrinh)); }
  catch (e) { bad('LT-08-lanh', loi(e)); }
}

// ── LT-09: hàng kế, hàng trễ, tin theo lời, khoá thẻ ─────────────────────────
// Ma trận viết trước: mỗi biến thể đặt hàng V lên đầu, theo sau là hàng dự phòng F (chưa mở, không
// đứng trên ai). Ghim hàng kế mong đợi.
const F = H('F', { slug: 'f-du-kien' });
const MA_TRAN = {
  'khong-slug-khong-tu-khai': { hang: [H('V'), F], ke: 'V' },
  'khong-slug-tu-khai-ngoai-da-giao': { hang: [H('V', { trang_thai: 'Đang làm' }), F], ke: 'F' },
  'slug-du-kien': { hang: [H('V', { slug: 'v-chua-co' }), F], ke: 'V' },
  'o-can-nhac': { hang: [H('V', { slug: 'v' }), F], hoSo: { v: 'can-nhac' }, ke: 'V' },
  'o-sap-mo': { hang: [H('V', { slug: 'v' }), F], hoSo: { v: 'sap-mo' }, ke: 'V' },
  'o-dang-lam': { hang: [H('V', { slug: 'v' }), F], hoSo: { v: 'dang-dung' }, ke: 'F' },
  'dung-tren-chua-giao': { hang: [H('V', { dung_tren: ['D'] }), H('D', { slug: 'd' }), F], hoSo: { d: 'dang-dung' }, ke: 'F' },
  'dung-tren-da-giao': { hang: [H('V', { dung_tren: ['G'] }), H('G', { slug: 'g' }), F], hoSo: { g: 'da-ship' }, ke: 'V' },
  'ma-la': { hang: [H('V', { dung_tren: ['ZZ'] }), F], ke: 'F', co: 'hàng V: đứng trên mã không có: ZZ' },
  'vong': { hang: [H('A', { dung_tren: ['B'] }), H('B', { dung_tren: ['A'] }), F], ke: 'F', co: 'đứng trên tạo vòng: A → B → A' },
  'khong-hang-nao': { hang: [H('V', { slug: 'v' })], hoSo: { v: 'dang-dung' }, ke: null },
  'khong-slug-tu-khai-khong-quy-doi': { hang: [H('V', { trang_thai: 'xong' }), F], ke: 'F' },
  'dung-tren-tu-khai-quy-doi-da-giao': { hang: [H('V', { dung_tren: ['X'] }), H('X', { trang_thai: 'xong' }), F], tuVung: { xong: 'Đã giao' }, ke: 'V' },
};
for (const [ten, c] of Object.entries(MA_TRAN)) {
  if (!want(`LT-09 ${ten}`)) continue;
  try {
    const r = kho({ hoSo: c.hoSo || {}, data: { schema: 1, ...(c.tuVung ? { tu_vung: c.tuVung } : {}), hang: c.hang } });
    const j = JSON.parse(quet(r, { ACCEPTANCE_TODAY: '2026-10-02' }).stdout).loTrinh; const sai = [];
    const ke = j.hangKe ? j.hangKe.ma : null;
    if (ke !== c.ke) sai.push(`hàng kế ${ke} != ${c.ke}`);
    if (c.co && !j.co.includes(c.co)) sai.push(`thiếu cờ «${c.co}»: ${JSON.stringify(j.co)}`);
    if (sai.length) bad(`LT-09 ${ten}`, sai.join(' ; ')); else ok(`LT-09 ${ten}`, `hàng kế ${ke}${c.co ? `, cờ «${c.co}»` : ''}`);
  } catch (e) { bad(`LT-09 ${ten}`, loi(e)); }
}
const LT09M = () => kho({ hoSo: { g: 'da-ship' }, data: { schema: 1, moc: [{ ten: 'M-tre', ngay: '2026-10-01', hang: ['F'] }, { ten: 'M-xong', ngay: '2026-09-01', hang: ['G'] }], hang: [H('G', { slug: 'g' }), F, H('T1'), H('T2', { trang_thai: 'Đã giao' })] } });
if (want('LT-09-tre')) {
  try { const j = JSON.parse(quet(LT09M(), { ACCEPTANCE_TODAY: '2026-10-02' }).stdout).loTrinh; const mong = [{ ma: 'F', moc: 'M-tre', ngay: '2026-10-01' }]; if (deq(j.hangTre, mong)) ok('LT-09-tre', `sau mốc: hàng trễ ${JSON.stringify(mong)}; mốc của hàng đã giao không tính`); else bad('LT-09-tre', JSON.stringify(j.hangTre)); }
  catch (e) { bad('LT-09-tre', loi(e)); }
}
if (want('LT-09-truoc-moc')) {
  try { const j = JSON.parse(quet(LT09M(), { ACCEPTANCE_TODAY: '2026-09-15' }).stdout).loTrinh; if (deq(j.hangTre, [])) ok('LT-09-truoc-moc', 'trước mốc: hàng trễ rỗng'); else bad('LT-09-truoc-moc', JSON.stringify(j.hangTre)); }
  catch (e) { bad('LT-09-truoc-moc', loi(e)); }
}
if (want('LT-09-tin')) {
  try { const j = JSON.parse(quet(LT09M()).stdout).loTrinh; if (deq(j.tinTheoLoi, { n: 2, tong: 4 })) ok('LT-09-tin', 'tin theo lời {n:2, tong:4}'); else bad('LT-09-tin', JSON.stringify(j.tinTheoLoi)); }
  catch (e) { bad('LT-09-tin', loi(e)); }
}
if (want('LT-09-crm')) {
  try { const { r } = khoCrm(); const j = JSON.parse(quet(r, { ACCEPTANCE_TODAY: '2026-10-02' }).stdout).loTrinh; if (j.hangKe && j.hangKe.ma) ok('LT-09-crm', `crm OKR thật: hàng kế ${j.hangKe.ma} — ${j.hangKe.cauGiao.slice(0, 60)}`); else bad('LT-09-crm', `hàng kế null: ${JSON.stringify(j).slice(0, 300)}`); }
  catch (e) { bad('LT-09-crm', loi(e)); }
}
if (want('LT-09-khoa')) {
  try {
    const md = readFileSync(path.join(KIT, 'commands', 'start.md'), 'utf8');
    const blk = (md.match(/<!-- <<<START-SCAN-KEYS\n([\s\S]*?)START-SCAN-KEYS>>> -->/) || [])[1] || '';
    const khai = new Set(blk.split(/\s+/).filter(t => t.startsWith('loTrinh.')));
    const j = JSON.parse(quet(LT09M(), { ACCEPTANCE_TODAY: '2026-10-02' }).stdout).loTrinh;
    const that = new Set();
    const di = (v, p) => {
      if (Array.isArray(v)) { if (v.length && typeof v[0] === 'object') di(v[0], `${p}[]`); else that.add(p); }
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) di(x, `${p}.${k}`);
      else that.add(p);
    };
    di(j, 'loTrinh');
    const thieu = [...that].filter(k => !khai.has(k)); const thua = [...khai].filter(k => !that.has(k));
    if (!khai.size) bad('LT-09-khoa', 'khối START-SCAN-KEYS không khai khoá loTrinh nào');
    else if (thieu.length || thua.length) bad('LT-09-khoa', `thiếu trong khối ${JSON.stringify(thieu)} · thừa ${JSON.stringify(thua)}`);
    else ok('LT-09-khoa', `${that.size} đường khoá loTrinh.* khớp hai chiều với khối START-SCAN-KEYS`);
  } catch (e) { bad('LT-09-khoa', loi(e)); }
}

// ── LT-10: ca biên crm ───────────────────────────────────────────────────────
if (want('LT-10')) {
  try {
    const r = kho({ hoSo: { chung: 'dang-dung', x8a: 'cho-duyet', x8c: 'da-ship', doi: ['dang-dung', 'T3               # chạm src/lib — đổi hạng giữa đường'] },
      data: { schema: 1, hang: [...['k1', 'k2', 'k3', 'k4', 'k5'].map(m => H(m, { slug: 'chung' })), H('8a', { slug: 'x8a' }), H('8c', { slug: 'x8c' }), H('9b', { slug: 'doi', hang: 'T2' })] } });
    let goi = 0; const dem = (d, s) => { if (s === 'chung') goi += 1; return PMM.classify(d, s); };
    const kq = phan(r, dem).kq; const sai = [];
    const chung = new Set(kq.dong.filter(d => d.slug === 'chung').map(d => d.chu));
    if (chung.size !== 1) sai.push(`năm hàng chung slug ra ${chung.size} chữ`);
    if (goi !== 1) sai.push(`classify gọi ${goi} lần cho slug chung`);
    const c8a = kq.dong.find(d => d._ma === '8a').chu; const c8c = kq.dong.find(d => d._ma === '8c').chu;
    if (c8a !== TEN_O['cho-duyet'] || c8c !== TEN_O['da-ship']) sai.push(`tách: 8a «${c8a}» 8c «${c8c}»`);
    const coHang = kq.co.filter(c => c.includes('hạng tệp'));
    if (!deq(coHang, ['hàng 9b: hạng tệp T2, hồ sơ T3'])) sai.push(`cờ hạng ${JSON.stringify(coHang)}`);
    if (kq.co.some(c => /trùng slug/.test(c))) sai.push('có cờ trùng slug');
    if (sai.length) bad('LT-10', sai.join(' ; ')); else ok('LT-10', 'năm hàng một slug cùng chữ (classify gọi 1 lần), hai hàng tách mang ô riêng, đúng một cờ «hàng 9b: hạng tệp T2, hồ sơ T3»');
  } catch (e) { bad('LT-10', loi(e)); }
}
if (want('LT-10-im')) {
  try {
    const r = kho({ hoSo: { op: 'sap-mo', t2: ['dang-dung', 'T2  # chú thích cuối dòng'] }, data: { schema: 1, hang: [H('a', { slug: 'op', hang: 'T2' }), H('b', { slug: 't2', hang: 'T2' })] } });
    const kq = phan(r).kq;
    if (!kq.co.some(c => c.includes('hạng tệp'))) ok('LT-10-im', 'hồ sơ chỉ có cơ hội: 0 cờ hạng; hợp đồng «T2  # …» với hàng T2: 0 cờ hạng'); else bad('LT-10-im', JSON.stringify(kq.co));
  } catch (e) { bad('LT-10-im', loi(e)); }
}

// ── LT-11: vòng ngoài lộ trình, mốc, đã bác, sống qua Cổng Đáng ─────────────
if (want('LT-11')) {
  try {
    const r = kho({ hoSo: { b1: 'sap-mo', it: 'sap-mo-iterate', pk: 'xep-lai', ngoai1: 'dang-dung', ngoai2: 'can-nhac' },
      data: { schema: 1, moc: [{ ten: 'Mùa OKR', ngay: '2026-12-07', loai: 'han', hang: ['1'] }], hang: [H('1', { slug: 'b1' }), H('1b', { slug: 'b1' }), H('2', { slug: 'it' }), H('3', { slug: 'pk' })], da_bac: [{ ma: 'x9', ly_do: 'Trùng với hàng 2' }] } });
    const kq = phan(r).kq; const html = LT.renderTrang(kq, 'docs/lo-trinh.json'); const sai = [];
    if (!deq(kq.ngoaiLoTrinh, ['ngoai1', 'ngoai2'])) sai.push(`ngoài lộ trình ${JSON.stringify(kq.ngoaiLoTrinh)}`);
    if (!deq(kq.songQuaCongDang, { k: 2, n: 3 })) sai.push(`sống qua Cổng Đáng ${JSON.stringify(kq.songQuaCongDang)}`);
    // trang-lo-trinh-doc-mot-phut: số «sống qua Cổng Đáng» ở lớp phân tích (trên), trang không in; vòng
    // ngoài lộ trình thành khối gập «N hồ sơ không thuộc kế hoạch nào».
    const i = html.indexOf('hồ sơ không thuộc kế hoạch nào</summary>'); const khoi = i < 0 ? '' : html.slice(i, html.indexOf('</details>', i));
    if (!/<summary>2 hồ sơ không thuộc kế hoạch nào<\/summary>/.test(html) || !khoi.includes('<code>ngoai1</code>') || !khoi.includes('<code>ngoai2</code>') || khoi.includes('co-ds')) sai.push('khối hồ sơ ngoài kế hoạch sai');
    if (!html.includes('Mùa OKR') || !html.includes('x9 — Trùng với hàng 2')) sai.push('thiếu mốc hoặc mục đã bác');
    if (kq.co.length) sai.push(`có cờ ${JSON.stringify(kq.co)}`);
    if (sai.length) bad('LT-11', sai.join(' ; ')); else ok('LT-11', 'vòng ngoài lộ trình [ngoai1, ngoai2] không cờ, trang gập «2 hồ sơ không thuộc kế hoạch nào»; mốc và đã bác đủ; hàng sống qua Cổng Đáng 2/3 (slug trỏ hai lần đếm một)');
  } catch (e) { bad('LT-11', loi(e)); }
}

// ── LT-12: feature-loop S0 nhận một hàng ─────────────────────────────────────
const SKILL = path.join(KIT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const khoiS0 = () => {
  const m = readFileSync(SKILL, 'utf8').match(/<!-- <<<S0-NHAN-HANG -->\n[\s\S]*?```\n([^\n]+)\n```[\s\S]*?<!-- S0-NHAN-HANG>>> -->/);
  if (!m) throw new Error('không thấy khối S0-NHAN-HANG (một dòng lệnh trong rào ```) trong SKILL feature-loop');
  return m[1];
};
// Gốc bộ giải gói đặt như harness đặt: HOME tạm có cache acceptance-gate-kit/acceptance-gate/<ver>
// mang bản sao scripts + lib của cây đang kiểm (dirent symlink không được bộ giải tính là thư mục).
const homeGia = (() => { let h = null; return () => {
  if (h) return h;
  h = path.join(TMP, 'home'); const v = path.join(h, '.claude', 'plugins', 'cache', 'acceptance-gate-kit', 'acceptance-gate', '9.9.9');
  for (const d of ['scripts', 'lib', 'skills']) cpSync(path.join(KIT, d), path.join(v, d), { recursive: true });
  return h; }; })();
const chayS0 = (lenh, r) => spawnSync('bash', ['-c', lenh], { cwd: r, encoding: 'utf8', env: { ...process.env, HOME: homeGia(), WORKFLOWS_DIR: path.join(KIT, 'feature-loop', 'workflows') } });
const LT12 = () => kho({ data: { schema: 1, hang: [H('9b', { vi_sao: 'vì sao 9b', hang: 'T3', slug: 'tro-ly-okr-de-xuat', bat_khi: 'mười hai ca thật', dung_tren: ['9a'] }), H('9a')] } });
if (want('LT-12')) {
  try {
    const r = LT12(); if (existsSync(path.join(r, 'scripts', 'lo-trinh.mjs'))) throw new Error('kho fixture không được có scripts/lo-trinh.mjs');
    const x = chayS0(khoiS0().replace('<mã>', '9b'), r); const sai = [];
    if (x.status !== 0) sai.push(`exit ${x.status}: ${x.stderr.trim()}`);
    else {
      const j = JSON.parse(x.stdout);
      const mong = { ma: '9b', cau_giao: '«câu giao 9b»', vi_sao: 'vì sao 9b', hang: 'T3', slug: 'tro-ly-okr-de-xuat', bat_khi: 'mười hai ca thật', dung_tren: ['9a'] };
      for (const [k, v] of Object.entries(mong)) if (!deq(j[k], v)) sai.push(`${k}: ${JSON.stringify(j[k])}`);
    }
    if (sai.length) bad('LT-12', sai.join(' ; ')); else ok('LT-12', 'lệnh rút nguyên văn từ khối S0-NHAN-HANG chạy ở kho fixture không có scripts/lo-trinh.mjs: đủ bảy trường đúng giá trị');
  } catch (e) { bad('LT-12', loi(e)); }
}
if (want('LT-12-do')) {
  try {
    const sai = [];
    const a = chayS0(khoiS0().replace('<mã>', '9z'), LT12());
    if (a.status !== 1 || !a.stderr.includes('không có hàng')) sai.push(`mã lạ: exit ${a.status} «${a.stderr.trim()}»`);
    const b = chayS0(khoiS0().replace('<mã>', '9b'), kho({ khoa: false }));
    if (b.status !== 1 || !b.stderr.includes('kho chưa khai lo_trinh.tep')) sai.push(`vắng khoá: exit ${b.status} «${b.stderr.trim()}»`);
    if (sai.length) bad('LT-12-do', sai.join(' ; ')); else ok('LT-12-do', 'mã lạ exit 1 «không có hàng»; vắng khoá exit 1 «kho chưa khai lo_trinh.tep»');
  } catch (e) { bad('LT-12-do', loi(e)); }
}
if (want('LT-12-kho')) {
  try {
    const khoi = khoiS0();
    const lanh = chayS0(khoi.replace('<mã>', '9b'), LT12());
    // Bản sao CỦA KHỐI (không gõ tay): bỏ bước giải gói, gọi đường tương đối — đúng một chỗ thay.
    const CU = 'node "$AG/scripts/lo-trinh.mjs"';
    if (khoi.split(CU).length !== 2) throw new Error(`khối S0 không chứa đúng một «${CU}» để tiêm`);
    const ban = khoi.slice(khoi.indexOf(CU)).replace(CU, 'node scripts/lo-trinh.mjs').replace('<mã>', '9b');
    const x = chayS0(ban, LT12());
    const ghim = /Cannot find module .*scripts\/lo-trinh\.mjs/;
    if (lanh.status === 0 && x.status !== 0 && ghim.test(x.stderr)) ok('LT-12-kho', `bản sao khối dùng đường tương đối đỏ ở kho fixture (lệnh S0 không chạy được ở kho tiêu thụ): «${(x.stderr.match(ghim) || [''])[0].slice(0, 90)}»`);
    else bad('LT-12-kho', `lành exit ${lanh.status}, tương đối exit ${x.status}, stderr «${x.stderr.trim().slice(0, 160)}»`);
  } catch (e) { bad('LT-12-kho', loi(e)); }
}

// ── LT-13: khuôn mẫu ─────────────────────────────────────────────────────────
const TPL = path.join(KIT, 'skills', 'acceptance', 'references', 'lo-trinh-template.json');
if (want('LT-13')) {
  try {
    const d = JSON.parse(readFileSync(TPL, 'utf8')); const k = LT.kiemKhuon(d); const sai = [];
    if (k.co.length) sai.push(`cờ ${JSON.stringify(k.co)}`);
    const BAY = ['ma', 'cau_giao', 'vi_sao', 'hang', 'dung_tren', 'slug', 'bat_khi'];
    if (!k.hang.some(h => BAY.every(f => h[f] !== undefined))) sai.push('không hàng nào đủ bảy trường');
    if (!k.hang.some(h => Object.keys(h).some(f => !BAY.includes(f) && !f.startsWith('_') && f !== 'trang_thai'))) sai.push('không có trường tự do');
    if (!k.moc.length || !k.daBac.length) sai.push('khuôn thiếu mốc hoặc đã bác');
    if (sai.length) bad('LT-13', sai.join(' ; ')); else ok('LT-13', 'khuôn mẫu: 0 cờ, có hàng đủ bảy trường, có trường tự do, có mốc và đã bác');
  } catch (e) { bad('LT-13', loi(e)); }
}
if (want('LT-13-do')) {
  try {
    const d = JSON.parse(readFileSync(TPL, 'utf8')); d.hang[0].cau_giao_cu = d.hang[0].cau_giao; delete d.hang[0].cau_giao;
    const co = LT.kiemKhuon(d).co;
    if (deq(co, [`hàng ${d.hang[0].ma} thiếu cau_giao`])) ok('LT-13-do', `bản sao khuôn đổi tên cau_giao → đúng một cờ «${co[0]}»`); else bad('LT-13-do', JSON.stringify(co));
  } catch (e) { bad('LT-13-do', loi(e)); }
}

// ── LT-16: lệnh đóng cổng đưa trang lộ trình vào commit ─────────────────────
// Khối MAP-STAGE rút NGUYÊN VĂN từ từng thân; chạy với AG = cây đang kiểm; commit; clone SẠCH rồi
// --check trên clone — đúng hình dạng CI thấy, không phải cây làm việc còn tệp chưa commit.
// Mốc = BƯỚC GHI trường của cổng trong từng thân (không phải lần đầu tên trường được nhắc).
const THAN = {
  approve: ['commands/approve.md', '- Edit the contract frontmatter — `status: approved`'],
  signoff: ['commands/signoff.md', '**7a — ghi trường người.**'],
  observed: ['commands/observed.md', '**Đặt `status: da-cham-boi-thuc-te`**'],
  'uat-session': ['skills/uat-session/SKILL.md', 'Người ký điền `verdict`'],
};
const MAP_RE = /<!-- <<<MAP-STAGE -->\n```(?:bash)?\n([^\n]+)\n```\n<!-- MAP-STAGE>>> -->/;
const khoiMap = txt => { const m = txt.match(MAP_RE); if (!m) throw new Error('không thấy khối MAP-STAGE (một dòng lệnh trong rào ```)'); return m[1]; };
// Chạy khối như harness: thay chữ ${CLAUDE_PLUGIN_ROOT} bằng gốc gói (cây đang kiểm), và AG KHÔNG có
// trong môi trường — khối phải tự lấy gốc gói, không dựa vào một biến người gọi gán sẵn.
const bash = (lenh, cwd) => { const env = { ...process.env }; delete env.AG; delete env.CLAUDE_PLUGIN_ROOT;
  return spawnSync('bash', ['-c', lenh.split('${CLAUDE_PLUGIN_ROOT}').join(KIT)], { cwd, encoding: 'utf8', env }); };
function lt16(lenh, khai = true) {
  const r = kho({ khoa: khai, hoSo: { p1: 'dang-dung' }, data: khai ? { schema: 1, hang: [H('1', { slug: 'p1' })] } : null });
  // Trạng thái ban đầu đã commit (cả hai view), như kho thật đã đóng cổng trước đó.
  node([PM, '--root', r]); git(r, 'add', '-A'); git(r, 'commit', '-qm', 'view ban dau');
  // Cổng ghi trường của nó: hồ sơ có hàng trỏ đổi trạng thái, và thân cổng đưa hồ sơ vào commit.
  const hd = path.join(r, '_acceptance', 'p1', 'contract.md'); writeFileSync(hd, readFileSync(hd, 'utf8').replace('status: approved', 'status: draft'));  // đổi Ô bản đồ (Đang làm → Chờ duyệt phạm vi), không chỉ đổi status trong cùng ô
  git(r, 'add', '_acceptance');
  const x = bash(lenh, r);
  const staged = git(r, 'diff', '--cached', '--name-only').split('\n').filter(Boolean).sort();
  git(r, 'commit', '-qm', 'dong cong');
  const cl = path.join(TMP, `clone-${++khoN}`); execFileSync('git', ['clone', '-q', r, cl]);
  const c = node([PM, '--root', cl, '--check']);
  return { x, staged, c };
}
for (const [ten, [rel]] of Object.entries(THAN)) {
  if (!want(`LT-16 ${ten}`)) continue;
  try {
    const { x, c } = lt16(khoiMap(readFileSync(path.join(KIT, rel), 'utf8')));
    if (x.status === 0 && c.status === 0) ok(`LT-16 ${ten}`, 'khối MAP-STAGE nguyên văn: commit đóng cổng mang trang lộ trình, --check trên clone sạch xanh');
    else bad(`LT-16 ${ten}`, `khối exit ${x.status} «${x.stderr.trim().slice(0, 120)}» · --check clone exit ${c.status} «${c.stderr.trim().slice(0, 160)}»`);
  } catch (e) { bad(`LT-16 ${ten}`, loi(e)); }
}
if (want('LT-16-giong')) {
  try {
    const k = Object.entries(THAN).map(([t, [rel]]) => [t, khoiMap(readFileSync(path.join(KIT, rel), 'utf8'))]);
    const khac = k.filter(([, l]) => l !== k[0][1]).map(([t]) => t);
    if (!khac.length) ok('LT-16-giong', `bốn thân mang cùng một khối: «${k[0][1].slice(0, 70)}…»`); else bad('LT-16-giong', `khối khác ở: ${khac.join(', ')}`);
  } catch (e) { bad('LT-16-giong', loi(e)); }
}
const thuTu = (ten, txt, moc) => {
  const i = txt.indexOf(moc), j = txt.indexOf('<!-- <<<MAP-STAGE -->');
  if (i < 0) return `thân ${ten}: không thấy mốc bước ghi «${moc}»`;
  if (txt.indexOf(moc, i + 1) >= 0) return `thân ${ten}: mốc bước ghi «${moc}» xuất hiện hơn một lần`;
  return (j < 0 || j < i) ? `thân ${ten}: khối MAP-STAGE không đứng sau bước ghi ${moc}` : null;
};
if (want('LT-16-thu-tu')) {
  try {
    const sai = Object.entries(THAN).map(([t, [rel, moc]]) => thuTu(t, readFileSync(path.join(KIT, rel), 'utf8'), moc)).filter(Boolean);
    // Chiều đỏ: bản sao thân signoff đặt khối NGAY TRƯỚC bước ghi — cùng hàm đo phải trả lỗi nêu tên thân.
    const sg = readFileSync(path.join(KIT, THAN.signoff[0]), 'utf8'); const m = sg.match(MAP_RE)[0];
    const bo = sg.replace(m, ''); const k = bo.indexOf(THAN.signoff[1]);
    const doi = thuTu('signoff', bo.slice(0, k) + m + '\n' + bo.slice(k), THAN.signoff[1]);
    if (!sai.length && doi && doi.startsWith('thân signoff:')) ok('LT-16-thu-tu', `bốn khối đứng sau bước ghi trường của cổng; bản sao đặt khối ngay trước bước ghi → «${doi}»`);
    else bad('LT-16-thu-tu', `${JSON.stringify(sai)} · đỏ: ${doi}`);
  } catch (e) { bad('LT-16-thu-tu', loi(e)); }
}
if (want('LT-16-ag')) {
  try {
    const that = khoiMap(readFileSync(path.join(KIT, THAN.approve[0]), 'utf8'));
    const DAU = 'AG="${AG:-${CLAUDE_PLUGIN_ROOT}}" && ';
    if (that.split(DAU).length !== 2) throw new Error('khối không chứa đúng một phần tự lấy gốc gói để tiêm');
    const lanh = lt16(that); const hong = lt16(that.replace(DAU, ''));
    const ghim = /Cannot find module .*scripts\/product-map\.mjs/;
    if (lanh.x.status === 0 && hong.x.status !== 0 && ghim.test(hong.x.stderr)) ok('LT-16-ag', `bản sao bỏ phần tự lấy gốc gói, AG không gán: đỏ «${(hong.x.stderr.match(ghim) || [''])[0].slice(0, 80)}»`);
    else bad('LT-16-ag', `lành ${lanh.x.status}, hỏng ${hong.x.status} «${hong.x.stderr.trim().slice(0, 140)}»`);
  } catch (e) { bad('LT-16-ag', loi(e)); }
}
if (want('LT-16-khong-khai')) {
  try {
    const { x, staged, c } = lt16(khoiMap(readFileSync(path.join(KIT, THAN.approve[0]), 'utf8')), false);
    const view = staged.filter(f => !f.startsWith('_acceptance/'));
    if (x.status === 0 && deq(view, ['PRODUCT-MAP.md']) && c.status === 0) ok('LT-16-khong-khai', 'kho không khai: khối thoát 0, commit chỉ mang PRODUCT-MAP.md');
    else bad('LT-16-khong-khai', `exit ${x.status} staged ${JSON.stringify(staged)} check ${c.status}`);
  } catch (e) { bad('LT-16-khong-khai', loi(e)); }
}
if (want('LT-16-do')) {
  try {
    const that = khoiMap(readFileSync(path.join(KIT, THAN.approve[0]), 'utf8'));
    const lanh = lt16(that);
    const DUOI = ' && if [ -f LO-TRINH.html ]; then git add -- LO-TRINH.html; fi';
    if (that.split(DUOI).length !== 2) throw new Error('khối không chứa đúng một đoạn đưa LO-TRINH.html để tiêm');
    const hong = lt16(that.replace(DUOI, ''));
    if (lanh.c.status === 0 && hong.c.status === 1 && hong.c.stderr.includes('LO-TRINH.html')) ok('LT-16-do', `bản sao khối chỉ đưa bản đồ: --check trên clone đỏ «${hong.c.stderr.trim().slice(0, 90)}»`);
    else bad('LT-16-do', `lành ${lanh.c.status}, hỏng ${hong.c.status} «${hong.c.stderr.trim().slice(0, 120)}»`);
  } catch (e) { bad('LT-16-do', loi(e)); }
}
if (want('LT-16-mien-tru')) {
  try {
    const sai = [];
    for (const [g, mong] of [['LO-TRINH.html', 0], ['**/LO-TRINH.html', 0], ['*.html', 0], ['docs/*.html', 1]]) {
      const r = kho({ hoSo: {}, data: { schema: 1, hang: [H('1')] }, t1: ['PRODUCT-MAP.md', g] });
      node([PM, '--root', r]);
      const c = node([PM, '--root', r, '--check']);
      if (c.status !== mong) sai.push(`${g}: exit ${c.status} (mong ${mong}) «${c.stderr.trim().slice(0, 120)}»`);
      if (mong === 1 && !(c.stderr.includes('t1_skip_globs') && c.stderr.includes('LO-TRINH.html'))) sai.push(`${g}: thông điệp không nêu t1_skip_globs và LO-TRINH.html «${c.stderr.trim()}»`);
    }
    if (sai.length) bad('LT-16-mien-tru', sai.join(' ; ')); else ok('LT-16-mien-tru', 'LO-TRINH.html, **/LO-TRINH.html, *.html phủ → xanh; docs/*.html không phủ → đỏ nêu t1_skip_globs');
  } catch (e) { bad('LT-16-mien-tru', loi(e)); }
}

// ── LT-17: trường phụ thuộc / mốc sai kiểu ────────────────────────────────────
function lt17(kitScripts) {
  const r = kho({ data: { schema: 1, moc: [{ ten: 'M1', ngay: '2026-10-01', hang: 'F' }, { ten: 'M2', ngay: '2026-10-01', hang: ['F'] }],
    hang: [H('A', { dung_tren: 'F' }), H('B', { dung_tren: 5 }), H('C', { dung_tren: { x: 1 } }), F] } });
  const x = node([path.join(kitScripts, 'start-scan.mjs'), '--root', r], { env: { ...process.env, ACCEPTANCE_TODAY: '2026-10-02' } });
  if (x.status !== 0) return [`start-scan exit ${x.status}: ${x.stderr.slice(0, 160)}`];
  const j = JSON.parse(x.stdout).loTrinh; const sai = [];
  const mong = ['hàng A: dung_tren phải là một mảng', 'hàng B: dung_tren phải là một mảng', 'hàng C: dung_tren phải là một mảng', 'mốc M1: hang phải là một mảng'];
  if (!deq(j.co, mong)) sai.push(`cờ ${JSON.stringify(j.co)}`);
  if (j.hangKe && ['A', 'B', 'C'].includes(j.hangKe.ma)) sai.push(`hàng kế là hàng có dung_tren sai kiểu: ${j.hangKe.ma}`);
  else if (!j.hangKe || j.hangKe.ma !== 'F') sai.push(`hàng kế ${JSON.stringify(j.hangKe)} != F`);
  if (!deq(j.hangTre, [{ ma: 'F', moc: 'M2', ngay: '2026-10-01' }])) sai.push(`hàng trễ ${JSON.stringify(j.hangTre)}`);
  return sai;
}
if (want('LT-17')) {
  try { const sai = lt17(path.join(KIT, 'scripts')); if (!sai.length) ok('LT-17', 'ba dung_tren sai kiểu + một mốc sai kiểu: đúng bốn cờ, hàng kế là F, mốc đúng kiểu vẫn cho hàng trễ'); else bad('LT-17', sai.join(' ; ')); }
  catch (e) { bad('LT-17', loi(e)); }
}
if (want('LT-17-do')) {
  try {
    const mut = banSao([['scripts/lo-trinh.mjs', "    if (d.dung_tren !== undefined && !Array.isArray(d.dung_tren)) return false;\n", '']]);
    const sai = lt17(path.join(mut, 'scripts')); const g = sai.find(m => m.startsWith('hàng kế là hàng có dung_tren sai kiểu'));
    if (g) ok('LT-17-do', `bản sao bỏ luật đủ điều kiện: hàm đo LT-17 chạy lại trả «${g}»`); else bad('LT-17-do', `hàm đo không bắt: ${JSON.stringify(sai)}`);
  } catch (e) { bad('LT-17-do', loi(e)); }
}

// ── LT-18: S0 không bao giờ đưa chữ tự do vào shell ───────────────────────────
const mauS0 = () => { const m = readFileSync(SKILL, 'utf8').match(/<!-- <<<S0-MA-HANG-RE -->\n```\n([^\n]+)\n```\n<!-- S0-MA-HANG-RE>>> -->/); if (!m) throw new Error('không thấy khối S0-MA-HANG-RE trong SKILL feature-loop'); return new RegExp(m[1]); };
// Bộ chạy đúng luật SKILL: đối số khớp mẫu thì chạy khối tra, ngược lại là mô tả việc — không lệnh nào.
const chayLuatS0 = (doiSo, khoi, re, r) => (re.test(doiSo) ? { chay: true, x: chayS0(khoi.replace('<mã>', doiSo), r) } : { chay: false });
const moTaDoc = c => `bỏ \`touch ${c}-1\` khỏi script (dọn; tạm) $(touch ${c}-2) "x" 'y' $HOME nhé`;
if (want('LT-18')) {
  try {
    const re = mauS0(); const khoi = khoiS0(); const sai = [];
    for (const n of ['crm-okr', 'crm-kho-tai-lieu', 'oneflow']) for (const h of docFx(n).hang) if (!re.test(String(h.ma))) sai.push(`mã ${h.ma} (${n}) không khớp mẫu`);
    const c = path.join(TMP, 'canh-18'); const moTa = moTaDoc(c);
    if (re.test(moTa)) sai.push('mẫu khớp cả mô tả có ký tự shell');
    const r = LT12(); const kq = chayLuatS0(moTa, khoi, re, r);
    if (kq.chay || existsSync(`${c}-1`) || existsSync(`${c}-2`)) sai.push('mô tả đã đi vào shell');
    const ma = chayLuatS0('9b', khoi, re, r);
    if (!ma.chay || ma.x.status !== 0 || JSON.parse(ma.x.stdout).ma !== '9b') sai.push(`9b: ${ma.x && ma.x.status} ${ma.x && ma.x.stderr}`);
    if (sai.length) bad('LT-18', sai.join(' ; ')); else ok('LT-18', 'mẫu khớp mọi mã của ba lộ trình thật, không khớp mô tả có backtick/$(...); không tệp canh nào được tạo; 9b vẫn tra được');
  } catch (e) { bad('LT-18', loi(e)); }
}
if (want('LT-18-luat')) {
  try {
    const t = readFileSync(SKILL, 'utf8'); const i = t.indexOf('<!-- <<<S0-MA-HANG-RE -->'); const doan = t.slice(Math.max(0, i - 1500), t.indexOf('<!-- S0-NHAN-HANG>>> -->') + 30);
    // Từ lo-trinh-tren-du-lieu-that: mã thoát nào là «mô tả việc» do bảng S0-MO-O-THOAT nói (LT-76
    // bang-thoat đo bảng đó); đoạn này chỉ còn giữ vế «không khớp mẫu thì là mô tả việc».
    const thieu = ['không khớp mẫu', 'mô tả việc', 'S0-MO-O-THOAT'].filter(c => !doan.includes(c));
    if (!thieu.length) ok('LT-18-luat', 'đoạn S0 nói đối số không khớp mẫu là mô tả việc, mã thoát theo bảng S0-MO-O-THOAT'); else bad('LT-18-luat', `đoạn S0 thiếu: ${thieu.join(', ')}`);
  } catch (e) { bad('LT-18-luat', loi(e)); }
}
if (want('LT-18-do')) {
  try {
    const khoi = khoiS0(); if (khoi.split("'<mã>'").length !== 2) throw new Error('khối S0 không có đúng một \'<mã>\' trong nháy đơn để tiêm');
    const c = path.join(TMP, 'canh-18do'); const r = LT12();
    chayLuatS0(moTaDoc(c), khoi.replace("'<mã>'", '"<mã>"'), /^.+$/, r);
    if (existsSync(`${c}-1`) || existsSync(`${c}-2`)) ok('LT-18-do', 'bản sao mẫu nhận-mọi-thứ + nháy kép: tệp canh bị tạo — lệnh trong mô tả đã chạy thật');
    else bad('LT-18-do', 'bản sao nhận-mọi-thứ mà không tệp canh nào được tạo — phép đo không chứng được chiều đỏ');
  } catch (e) { bad('LT-18-do', loi(e)); }
}

// ═══ Vòng sửa lo-trinh-tren-du-lieu-that (LT-70..LT-80) ═══════════════════════════════════════
// Hồ sơ _acceptance/lo-trinh-tren-du-lieu-that/. Bộ vẽ «bản trước vòng» = `git archive` của commit
// gốc vòng (CI checkout fetch-depth 0); không resolve được thì ca FAIL, không bỏ qua.
const GOC_VONG = 'e4a399ed';
let gocDir = null;
function banGoc() {
  if (gocDir) return gocDir;
  const d = path.join(TMP, 'goc-vong'); mkdirSync(d, { recursive: true });
  const tar = execFileSync('git', ['-C', KIT, 'archive', '--format=tar', GOC_VONG, 'scripts', 'lib', 'skills'], { maxBuffer: 1 << 28 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  return (gocDir = d);
}
const napLT = async kit => ({
  LT: await import(pathToFileURL(path.join(kit, 'scripts', 'lo-trinh.mjs')).href + `?v=${++bsN}`),
  PM: await import(pathToFileURL(path.join(kit, 'scripts', 'product-map.mjs')).href + `?v=${bsN}`),
});
const phanBang = (M, r) => M.LT.phanTich({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS });
// Kho nhiều tệp / có hồ sơ nhận hàng: config lo_trinh viết tay theo ca, `nhan` chèn `lo_trinh_ma`
// (và `lo_trinh_tep`) vào ô cơ hội CÓ SẴN của hình dạng hồ sơ.
function khoX({ cfg = '', tepData = {}, hoSo = {}, nhan = {}, t1 } = {}) {
  const r = kho({ khoa: false, hoSo, cfgThem: cfg, ...(t1 ? { t1 } : {}) });
  for (const [t, d] of Object.entries(tepData)) {
    const p = path.join(r, t); mkdirSync(path.dirname(p), { recursive: true });
    writeFileSync(p, typeof d === 'string' ? d : JSON.stringify(d, null, 2) + '\n');
  }
  for (const [sl, n] of Object.entries(nhan)) {
    const p = path.join(r, '_acceptance', sl, 'opportunity.md'); const t = readFileSync(p, 'utf8');
    if (!t.includes('\nstage:')) throw new Error(`hồ sơ ${sl} không có ô cơ hội để ghi lo_trinh_ma`);
    writeFileSync(p, t.replace('\nstage:', `\nlo_trinh_ma: ${n.ma}\n${n.tep ? `lo_trinh_tep: ${n.tep}\n` : ''}stage:`));
  }
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'kho X', '--allow-empty');
  return r;
}
const mot = (tep = 'docs/lo-trinh.json') => `lo_trinh:\n  tep: ${tep}\n`;
// Vẽ bằng bộ vẽ của `kit` trên một bản CLONE của kho (hai bộ vẽ không giẫm lên nhau); trả trang,
// bản đồ, và đường thực thi thật của bộ vẽ (để chứng bên «cũ» chạy từ thư mục giải nén).
function veBang(kit, r) {
  const c = path.join(TMP, `ve-${++khoN}`); execFileSync('git', ['clone', '-q', r, c]);
  const pm = path.join(kit, 'scripts', 'product-map.mjs');
  const x = node([pm, '--root', c]);
  if (x.status !== 0) throw new Error(`bộ vẽ ${kit} exit ${x.status}: ${x.stderr.slice(0, 200)}`);
  const rd = f => (existsSync(path.join(c, f)) ? readFileSync(path.join(c, f), 'utf8') : null);
  return { trang: rd('LO-TRINH.html'), map: rd('PRODUCT-MAP.md'), pm: realpathSync(pm) };
}
// Lớp phân tích của bộ máy `kit` trên kho r — phần mọi đời đều có: trạng thái từng hàng, cờ, hàng kế,
// vòng ngoài lộ trình. Hồ sơ trang-lo-trinh-doc-mot-phut thay vế «trang giống từng byte bộ vẽ trước
// vòng» (lớp vẽ đổi chủ ý) bằng vế này; đường đọc là con trỏ thay thế ở hợp đồng của vòng đó.
const loiPhan = async (kit, r) => { const kq = phanBang(await napLT(kit), r).kq; return JSON.stringify({ dong: kq.dong.map(d => [d._nhan, d.chu, !!d.tinTheoLoi, d.coHang]), co: kq.co, hangKe: kq.hangKe && [kq.hangKe.ma, kq.hangKe.cauGiao], ngoai: kq.ngoaiLoTrinh }); };
const NHOM_MONG = { 'cho-nghiem-thu': 'G', 'da-ship': 'G', 'da-nghiem-thu': 'G', 'cho-duyet': 'L', 'dang-dung': 'L', 'can-nhac': 'C', 'sap-mo': 'C' };
const nhomTen = (ten, TEN) => { if (ten === LT.CHUA_MO) return 'C'; const k = Object.keys(TEN).find(x => TEN[x] === ten); return (k && NHOM_MONG[k]) || `riêng:${ten}`; };

// ── LT-70: so lời khai theo nhóm — ma trận toàn phần ─────────────────────────
const LOAI_TRU_70 = { 'ngoai-pham-vi': 'ô này sinh từ .out-of-scope/, không phải thư mục _acceptance/ — không hàng nào trỏ được' };
const TU_VUNG_70 = { 'đã lên onehub': 'Đã giao', 'đang dựng': 'Đang làm', 'chưa đụng': 'Chưa mở' };
async function lt70(kit) {
  const M = await napLT(kit); const TEN = Object.fromEntries(M.PM.SECTIONS);
  const khoa = M.PM.SECTIONS.map(([k]) => k);
  const truc = khoa.filter(k => !LOAI_TRU_70[k]);
  if (truc.length + Object.keys(LOAI_TRU_70).length !== khoa.length || !truc.every(k => HO_SO[k])) throw new Error(`trục hồ sơ ${truc.length} + loại trừ ${Object.keys(LOAI_TRU_70).length} != ${khoa.length} khoá SECTIONS, hoặc thiếu hình dạng HO_SO`);
  const nhan = [...M.PM.SECTIONS.map(([, t]) => t), LT.CHUA_MO, LT.KHONG_SUY];
  const loi = [...nhan.map(t => ({ khai: t, chuan: t === LT.KHONG_SUY ? null : t })), ...Object.entries(TU_VUNG_70).map(([w, t]) => ({ khai: w, chuan: t }))];
  const hang = []; const mong = [];
  let i = 0;
  for (const o of truc) for (const l of loi) { const ma = `r${++i}`; hang.push(H(ma, { slug: `o-${o}`, trang_thai: l.khai })); mong.push({ ma, o, l }); }
  const r = kho({ data: { schema: 1, tu_vung: TU_VUNG_70, hang }, hoSo: Object.fromEntries(truc.map(o => [`o-${o}`, o])) });
  const kq = phanBang(M, r).kq; const sai = [];
  for (const { ma, o, l } of mong) {
    const d = kq.dong.find(x => x._ma === ma);
    if (d.chu !== TEN[O_MONG[o]]) { sai.push(`${ma}: ô ${d.chu} != ${TEN[O_MONG[o]]}`); continue; }
    const coCo = d.coHang.find(c => c.includes('tệp khai khác hồ sơ'));
    const muon = l.chuan != null && nhomTen(l.chuan, TEN) !== nhomTen(TEN[o], TEN);
    if (!!coCo !== muon) sai.push(`(«${l.khai}», «${TEN[o]}») cờ ${coCo ? 'có' : 'không'} — mong ${muon ? 'có' : 'không'}`);
    else if (coCo && !(coCo.includes(l.khai) && coCo.includes(TEN[o]))) sai.push(`(«${l.khai}», «${TEN[o]}») cờ thiếu chữ: ${coCo}`);
  }
  return { sai, n: mong.length, tich: `${truc.length}×${loi.length}` };
}
if (want('LT-70')) {
  try {
    const { sai, n, tich } = await lt70(KIT);
    if (sai.length) bad('LT-70', sai.slice(0, 6).join(' ; ')); else ok('LT-70', `${n} cặp (${tich}, loại trừ ${Object.keys(LOAI_TRU_70).join(',')}): cờ ⟺ khác nhóm, cờ nêu cả chữ khai lẫn chữ hồ sơ`);
  } catch (e) { bad('LT-70', loi(e)); }
}
if (want('LT-70-do')) {
  try {
    const { sai } = await lt70(banSao([['scripts/lo-trinh.mjs', 'nhomCua(khaiChuan) !== nhomCua(chu)', 'khaiChuan !== chu']]));
    const g = sai.find(m => m.startsWith('(«Đã giao», «Đã giao — chờ phiên nghiệm thu»)'));
    if (g) ok('LT-70-do', `bản sao so đúng chữ: hàm đo LT-70 trả «${g}»`); else bad('LT-70-do', `không bắt: ${JSON.stringify(sai.slice(0, 4))}`);
  } catch (e) { bad('LT-70-do', loi(e)); }
}
if (want('LT-70-do2')) {
  try {
    const { sai } = await lt70(banSao([['scripts/lo-trinh.mjs', "export const CHUA_LAM_O = ['can-nhac', 'sap-mo'];", "export const CHUA_LAM_O = ['can-nhac', 'sap-mo', 'xep-lai'];"]]));
    const g = sai.find(m => m.startsWith('(«Chưa mở», «Xếp lại sau»)'));
    if (g) ok('LT-70-do2', `bản sao xếp xep-lai vào chưa làm: hàm đo LT-70 trả «${g}»`); else bad('LT-70-do2', `không bắt: ${JSON.stringify(sai.slice(0, 4))}`);
  } catch (e) { bad('LT-70-do2', loi(e)); }
}

// ── LT-71: tự khai đã giao/đang làm mà không có hồ sơ ───────────────────────
async function lt71(kit) {
  const M = await napLT(kit);
  const r = kho({ data: { schema: 1, hang: [
    H('A', { slug: 'a-vang', trang_thai: 'Đã giao' }), H('B', { slug: 'b-vang', trang_thai: 'Đang làm' }),
    H('E', { dung_tren: ['A'] }), H('C', { slug: 'c-vang', trang_thai: 'Chưa mở' }), H('D', { slug: 'd-vang' })] } });
  const kq = phanBang(M, r).kq; const sai = []; const d = m => kq.dong.find(x => x._ma === m);
  for (const [m, c] of [['A', LT.KHONG_SUY], ['B', LT.KHONG_SUY], ['C', LT.CHUA_MO], ['D', LT.CHUA_MO]]) if (d(m).chu !== c) sai.push(`${m}: ${d(m).chu} != ${c}`);
  const mong = ['hàng A: tự khai Đã giao mà không có hồ sơ a-vang', 'hàng B: tự khai Đang làm mà không có hồ sơ b-vang'];
  if (!deq(kq.co, mong)) sai.push(`cờ ${JSON.stringify(kq.co)}`);
  if (kq.hangKe?.ma !== 'C') sai.push(`hàng kế ${kq.hangKe?.ma} (mong C)`);
  return sai;
}
if (want('LT-71')) {
  try { const sai = await lt71(KIT); if (sai.length) bad('LT-71', sai.join(' ; ')); else ok('LT-71', 'A, B «Không suy được» + đúng một cờ mỗi hàng; C, D «Chưa mở» không cờ; hàng kế C, không phải A hay E'); } catch (e) { bad('LT-71', loi(e)); }
}
if (want('LT-71-do')) {
  try {
    const sai = await lt71(banSao([['scripts/lo-trinh.mjs', "      if (khaiChuan && ['da-giao', 'dang-lam'].includes(nhomCua(khaiChuan))) {", '      if (false) {']]));
    const g = sai.find(m => m.startsWith('hàng kế A'));
    if (g) ok('LT-71-do', `bản sao bỏ nhánh không-hồ-sơ: hàm đo LT-71 trả «${g}»`); else bad('LT-71-do', `không bắt: ${JSON.stringify(sai)}`);
  } catch (e) { bad('LT-71-do', loi(e)); }
}

// ── LT-72: crm OKR với bảng ô hồ sơ chụp từ crm thật ────────────────────────
// Số mong đợi ghi ở opportunity.md TRƯỚC khi có mã (đo 03/10): 4 thiếu câu giao · 1 mã trùng · 2 lệch
// nhóm ở 9c, D · hàng «1» tự khai đã giao mà không có hồ sơ.
async function lt72(kit) {
  const M = await napLT(kit); const f = docFx('crm-okr'); const { _nguon, ...data } = f;
  if (!_nguon.ho_so_onehub) throw new Error('fixture thiếu _nguon.ho_so_onehub — chạy tests/scripts/lo-trinh-chup-crm.mjs');
  const kq = phanBang(M, kho({ data, hoSo: _nguon.ho_so_onehub })).kq; const sai = []; const TEN = Object.fromEntries(M.PM.SECTIONS);
  const ke = kq.hangKe ? kq.dong.find(x => x._nhan === kq.hangKe.ma) : null;
  if (!ke) sai.push('hàng kế: không có');
  else {
    if (ke._nhan === '1') sai.push('hàng kế 1');
    const khai = ke.tuKhai ? ((data.tu_vung || {})[ke.tuKhai] || ke.tuKhai) : null;
    const tuVung = new Map([...M.PM.SECTIONS.map(([, t]) => t), LT.CHUA_MO].map(t => [t.toLowerCase(), t]));
    if (nhomTen(ke.chu, TEN) !== 'C' || (khai && nhomTen(tuVung.get(khai.toLowerCase()) || '?', TEN) !== 'C')) sai.push(`hàng kế ${ke._nhan} không thuộc nhóm chưa làm (${ke.chu}, khai ${ke.tuKhai})`);
  }
  const dem = re => kq.co.filter(c => re.test(c));
  if (dem(/ thiếu cau_giao$/).length !== 4) sai.push(`thiếu câu giao ${dem(/ thiếu cau_giao$/).length} != 4`);
  if (dem(/^mã trùng/).length !== 1) sai.push(`mã trùng ${dem(/^mã trùng/).length} != 1`);
  const lech = dem(/tệp khai khác hồ sơ/);
  if (lech.length !== 2 || !deq(lech.map(c => c.split(':')[0]).sort(), ['hàng 9c', 'hàng D'])) sai.push(`cờ khác hồ sơ thừa ${lech.length - 2}: ${JSON.stringify(lech.map(c => c.split(':')[0]))}`);
  const ks = dem(/mà không có hồ sơ/);
  if (ks.length !== 1 || !ks[0].startsWith('hàng 1:')) sai.push(`tự khai không hồ sơ ${JSON.stringify(ks)}`);
  if (kq.co.length !== 8) sai.push(`tổng ${kq.co.length} != 8`);
  return { sai, ke: ke && ke._nhan };
}
if (want('LT-72')) {
  try { const { sai, ke } = await lt72(KIT); if (sai.length) bad('LT-72', sai.join(' ; ')); else ok('LT-72', `crm OKR (ô hồ sơ chụp từ crm onehub): hàng kế ${ke}, cờ 4 thiếu câu giao · 1 mã trùng · 2 lệch nhóm (9c, D) · 1 hàng «1» không hồ sơ = 8`); } catch (e) { bad('LT-72', loi(e)); }
}
if (want('LT-72-do')) {
  try {
    const { sai } = await lt72(banGoc());
    const a = sai.find(m => m === 'hàng kế 1'); const b = sai.find(m => m.startsWith('cờ khác hồ sơ thừa 11'));
    if (a && b) ok('LT-72-do', `bộ đọc lát 1 (${GOC_VONG}) trên cùng kho: «${a}» · «${b.slice(0, 40)}»`); else bad('LT-72-do', `không bắt: ${JSON.stringify(sai)}`);
  } catch (e) { bad('LT-72-do', loi(e)); }
}

// ── LT-73: nối hai chiều qua lo_trinh_ma ────────────────────────────────────
const CA_73 = {
  'mot-nguoi-nhan': () => ({ k: khoX({ cfg: mot(), tepData: { 'docs/lo-trinh.json': { schema: 1, hang: [H('X'), H('Y')] } }, hoSo: { c: 'cho-nghiem-thu' }, nhan: { c: { ma: 'X' } } }),
    kiem: (kq, sai, TEN) => { const d = kq.dong[0]; if (d.chu !== TEN['cho-nghiem-thu'] || d.tinTheoLoi) sai.push(`X ${d.chu} tinTheoLoi ${d.tinTheoLoi}`); if (kq.tinTheoLoi.n !== 1) sai.push(`tin theo lời ${kq.tinTheoLoi.n} != 1`); if (kq.ngoaiLoTrinh.includes('c')) sai.push('c vẫn ở vòng ngoài'); if (kq.co.length) sai.push(`cờ ${JSON.stringify(kq.co)}`); } }),
  'nhieu-nguoi-nhan': () => ({ k: khoX({ cfg: mot(), tepData: { 'docs/lo-trinh.json': { schema: 1, hang: [H('X')] } }, hoSo: { c2: 'cho-nghiem-thu', c1: 'sap-mo' }, nhan: { c1: { ma: 'X' }, c2: { ma: 'X' } } }),
    // Vòng trả lượt 1 (AC-15): nhiều hồ sơ nhận thì kit không chọn hộ — «Không suy được», không tin theo lời.
    kiem: (kq, sai) => { if (!deq(kq.co, ['hàng X được nhiều hồ sơ nhận: c1, c2'])) sai.push(`cờ ${JSON.stringify(kq.co)}`); if (kq.dong[0].tinTheoLoi || kq.dong[0].chu !== LT.KHONG_SUY) sai.push(`X ${kq.dong[0].chu}`); } }),
  'ho-so-ghi-ma-khac': () => ({ k: khoX({ cfg: mot(), tepData: { 'docs/lo-trinh.json': { schema: 1, hang: [H('X', { slug: 's' }), H('M')] } }, hoSo: { s: 'cho-nghiem-thu' }, nhan: { s: { ma: 'M' } } }),
    kiem: (kq, sai, TEN) => { if (!deq(kq.co, ['hàng X trỏ hồ sơ s nhưng hồ sơ ghi hàng M'])) sai.push(`cờ ${JSON.stringify(kq.co)}`); if (kq.dong[0].chu !== TEN['cho-nghiem-thu']) sai.push(`X ${kq.dong[0].chu}`); } }),
  'ho-so-khac-nhan-S-co': () => ({ k: khoX({ cfg: mot(), tepData: { 'docs/lo-trinh.json': { schema: 1, hang: [H('X', { slug: 's' })] } }, hoSo: { s: 'sap-mo', c: 'cho-nghiem-thu' }, nhan: { c: { ma: 'X' } } }),
    kiem: (kq, sai, TEN) => { if (!deq(kq.co, ['hàng X trỏ hồ sơ s nhưng hồ sơ c nhận hàng này'])) sai.push(`cờ ${JSON.stringify(kq.co)}`); if (kq.dong[0].chu !== TEN['sap-mo']) sai.push(`X ${kq.dong[0].chu}`); } }),
  'ho-so-khac-nhan-S-vang': () => ({ k: khoX({ cfg: mot(), tepData: { 'docs/lo-trinh.json': { schema: 1, hang: [H('X', { slug: 's-vang' })] } }, hoSo: { c: 'cho-nghiem-thu' }, nhan: { c: { ma: 'X' } } }),
    kiem: (kq, sai, TEN) => { if (!deq(kq.co, ['hàng X trỏ hồ sơ s-vang nhưng hồ sơ c nhận hàng này'])) sai.push(`cờ ${JSON.stringify(kq.co)}`); if (kq.dong[0].chu !== TEN['cho-nghiem-thu']) sai.push(`X ${kq.dong[0].chu}`); } }),
  'gop-S-vang-khai-da-giao-C-nhan': () => ({ k: khoX({ cfg: mot(), tepData: { 'docs/lo-trinh.json': { schema: 1, hang: [H('X', { slug: 's-vang', trang_thai: 'Đã giao' })] } }, hoSo: { c: 'cho-nghiem-thu' }, nhan: { c: { ma: 'X' } } }),
    kiem: (kq, sai, TEN, r) => {
      if (kq.dong[0].chu !== TEN['cho-nghiem-thu']) sai.push(`X ${kq.dong[0].chu}`);
      if (!deq(kq.dong[0].coHang, ['hàng X trỏ hồ sơ s-vang nhưng hồ sơ c nhận hàng này'])) sai.push(`cờ hàng ${JSON.stringify(kq.dong[0].coHang)}`);
      const x = node([LO, '--root', r, '--hang', 'X', '--mo-o']);
      if (x.status !== 0 || x.stdout.trim() !== '{"hoSo":"c","moi":false}') sai.push(`--mo-o exit ${x.status} «${x.stdout.trim()}» ${x.stderr.trim()}`);
    } }),
  'ma-khong-co-hang': () => ({ k: khoX({ cfg: mot(), tepData: { 'docs/lo-trinh.json': { schema: 1, hang: [H('A')] } }, hoSo: { c: 'sap-mo' }, nhan: { c: { ma: 'Z' } } }),
    kiem: (kq, sai) => { if (!deq(kq.co, ['hồ sơ c ghi lo_trinh_ma Z — không có hàng Z'])) sai.push(`cờ ${JSON.stringify(kq.co)}`); } }),
  'tep-khong-khai': () => ({ k: khoX({ cfg: mot(), tepData: { 'docs/lo-trinh.json': { schema: 1, hang: [H('A')] } }, hoSo: { c: 'sap-mo' }, nhan: { c: { ma: 'A', tep: 'docs/khac.json' } } }),
    kiem: (kq, sai) => { if (!deq(kq.co, ['hồ sơ c ghi lo_trinh_tep docs/khac.json — kho không khai tệp đó'])) sai.push(`cờ ${JSON.stringify(kq.co)}`); if (!kq.dong[0].tinTheoLoi) sai.push('A bị nhận qua tệp không khai'); } }),
};
const KHO_73_KT = () => kho({ hoSo: { a: 'da-ship', b: 'dang-dung' }, data: { schema: 1, moc: [{ ten: 'm1', ngay: '2026-11-01', hang: ['A'] }], hang: [H('A', { slug: 'a', trang_thai: 'Đã giao', hang: 'T2' }), H('B', { slug: 'b' }), H('N'), H('C', { slug: 'c-vang' })] } });
async function lt73(kit) {
  const M = await napLT(kit); const TEN = Object.fromEntries(M.PM.SECTIONS); const hong = [];
  for (const [ten, f] of Object.entries(CA_73)) {
    const { k, kiem } = f(); const sai = [];
    try { kiem(phanBang(M, k).kq, sai, TEN, k); } catch (e) { sai.push(loi(e)); }
    hong.push({ ten, sai });
  }
  return hong;
}
if (want('LT-73')) {
  try {
    for (const { ten, sai } of await lt73(KIT)) if (sai.length) bad(`LT-73 ${ten}`, sai.join(' ; ')); else ok(`LT-73 ${ten}`);
  } catch (e) { bad('LT-73', loi(e)); }
}
if (want('LT-73 khong-truong')) {
  try {
    const r = KHO_73_KT(); const moi = await loiPhan(KIT, r); const cu = await loiPhan(banGoc(), r);
    if (moi === cu && JSON.parse(moi).dong.length === 4) ok('LT-73 khong-truong', `không hồ sơ nào ghi lo_trinh_ma: lớp phân tích giống hệt bộ máy ${GOC_VONG} (4 hàng)`);
    else bad('LT-73 khong-truong', `lớp phân tích khác bộ máy ${GOC_VONG}: ${moi.slice(0, 120)} / ${cu.slice(0, 120)}`);
  } catch (e) { bad('LT-73 khong-truong', loi(e)); }
}
if (want('LT-73-do')) {
  try {
    const hong = await lt73(banSao([['scripts/lo-trinh.mjs', 'const nhan = docNhan(root);', 'const nhan = [];']]));
    const g = hong.find(h => h.ten === 'mot-nguoi-nhan' && h.sai.length);
    if (g) ok('LT-73-do', `bản sao bỏ quét lo_trinh_ma: hàm đo LT-73 hỏng ca «${g.ten}» (${g.sai[0].slice(0, 60)})`); else bad('LT-73-do', 'không bắt');
  } catch (e) { bad('LT-73-do', loi(e)); }
}
if (want('LT-73-khong-truong-do')) {
  try {
    const r = KHO_73_KT(); const mut = banSao([['scripts/lo-trinh.mjs', "const ke = dong.find(d => chuaLam.has(d.chu) && duDieuKien(d)) || null;", 'const ke = dong[0] || null;']]);
    const moi = await loiPhan(mut, r); const cu = await loiPhan(banGoc(), r);
    if (moi !== cu) ok('LT-73-khong-truong-do', 'bản sao đổi luật hàng kế: phép so lớp phân tích của khong-truong ĐỎ'); else bad('LT-73-khong-truong-do', 'phép so không bắt hàng kế khác');
  } catch (e) { bad('LT-73-khong-truong-do', loi(e)); }
}

// ── LT-74: mở việc từ hàng — ô cơ hội đúng khuôn ────────────────────────────
const OPP_TPL = path.join(KIT, 'skills', 'acceptance', 'references', 'opportunity-template.md');
const khoiTpl = (txt, ten) => { const m = txt.match(new RegExp(`<!-- <<<${ten} -->\\n([\\s\\S]*?)<!-- ${ten}>>> -->`)); if (!m) throw new Error(`khuôn thiếu khối ${ten}`); return m[1]; };
const khoaFm = txt => { const fm = txt.split('\n---')[0].replace(/^[\s\S]*?---\n/, ''); return [...fm.matchAll(/^\s*([A-Za-z_]+):/gm)].map(m => m[1]); };
const fmCua = (txt, k) => { const m = txt.match(new RegExp(`^${k}:[ \\t]*(.*?)[ \\t]*(#.*)?$`, 'm')); return m ? m[1].trim() : undefined; };
// Ô chỉ chờ Cổng Đáng khi ĐỦ bốn dòng ngưỡng (lib/nguong-o-co-hoi.cjs); máy đề xuất hạn chỉ khi hàng
// gắn một mốc có ngày — không mốc thì Timebox «…» và ô ở đang cân nhắc.
const KHO_74 = (batKhi = true, moc = true) => kho({ data: { schema: 1, ...(moc ? { moc: [{ ten: 'm-lt', ngay: '2026-11-30', hang: ['7n'] }] } : {}), hang: [H('7n', { slug: 'no-sau-7', vi_sao: 'vì sao 7n', ...(batKhi ? { bat_khi: 'crm có ba phiên thật' } : {}) })] } });
const sha74 = r => sha(path.join(r, 'docs', 'lo-trinh.json'));
function lt74(kit, batKhi, moc = true) {
  const r = KHO_74(batKhi, moc); const vaoCong = batKhi && moc; const truoc = sha74(r); const sai = [];
  const x = node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', r, '--hang', '7n', '--mo-o', '--owner', 'x@y.z']);
  if (x.status !== 0) return { sai: [`exit ${x.status}: ${x.stderr.trim()}`] };
  if (x.stdout.trim() !== '{"hoSo":"no-sau-7","moi":true}') sai.push(`stdout «${x.stdout.trim()}»`);
  const p = path.join(r, '_acceptance', 'no-sau-7', 'opportunity.md'); if (!existsSync(p)) return { sai: [...sai, 'không có tệp'] };
  const t = readFileSync(p, 'utf8'); const tpl = readFileSync(path.join(kit, 'skills', 'acceptance', 'references', 'opportunity-template.md'), 'utf8');
  const can = khoaFm(khoiTpl(tpl, 'OPP-FRONTMATTER-TEMPLATE').replace(/^```yaml\n/, '')); const co = khoaFm(t);
  const thieu = can.filter(k => !co.includes(k)); if (thieu.length) sai.push(`thiếu khoá khuôn ${thieu}`);
  if (!t.startsWith('---\n')) sai.push('tệp không bắt đầu bằng ---');
  for (const [k, v] of [['stage', 'discovery'], ['decision', ''], ['feature', '«câu giao 7n»'], ['lo_trinh_ma', '7n'], ['lo_trinh_tep', 'docs/lo-trinh.json'], ['owner', 'x@y.z']]) if (fmCua(t, k) !== v) sai.push(`${k}: «${fmCua(t, k)}»`);
  const tien = khoiTpl(tpl, 'OPP-DE-XUAT-PREFIX').trim();
  const song = (t.match(/^- Kết quả nào là SỐNG:(.*)$/m) || [])[1];
  if (batKhi ? song?.trim() !== `${tien} crm có ba phiên thật` : song?.trim() !== '…') sai.push(`SỐNG «${song}»`);
  const han = (t.match(/^- Timebox:(.*)$/m) || [])[1];
  if (vaoCong ? han?.trim() !== `${tien} 2026-11-30 (mốc m-lt)` : han?.trim() !== '…') sai.push(`Timebox «${han}»`);
  const j = JSON.parse(quet(r, {}, kit).stdout);
  const oCong = j.groups.gates.some(g => g.slug === 'no-sau-7' && g.gate === 'dang'); const oCan = j.groups.considering.some(g => (g.name || g.slug) === 'no-sau-7' || g.slug === 'no-sau-7');
  if (vaoCong ? !oCong : !oCan) sai.push(`bộ quét xếp sai: cổng ${oCong} cân nhắc ${oCan}`);
  const M = { LT, PM: PMM }; const d = phanBang(M, r).kq.dong[0]; if (!d.coHoSo) sai.push('bộ vẽ chưa coi hàng đã có hồ sơ');
  if (sha74(r) !== truoc) sai.push('tệp ý định bị ghi');
  return { sai, t };
}
for (const [ten, bk, mc] of [['co-bat-khi', true, true], ['bat-khi-khong-moc', true, false], ['khong-bat-khi', false, true]]) if (want(`LT-74 ${ten}`)) {
  try { const { sai } = lt74(KIT, bk, mc); if (sai.length) bad(`LT-74 ${ten}`, sai.join(' ; ')); else ok(`LT-74 ${ten}`, `--mo-o ghi đúng khuôn (khoá ⊇ OPP-FRONTMATTER-TEMPLATE), ${bk && mc ? 'bốn dòng ngưỡng mang tiền tố đề xuất (SỐNG = bat_khi, Timebox = ngày mốc), bộ quét xếp chờ Cổng Đáng' : bk ? 'SỐNG đề xuất, Timebox «…» vì hàng không gắn mốc, bộ quét xếp đang cân nhắc' : 'SỐNG «…», bộ quét xếp đang cân nhắc'}; tệp ý định giữ nguyên`); } catch (e) { bad(`LT-74 ${ten}`, loi(e)); }
}
if (want('LT-74-do')) {
  try {
    const goc = khoiTpl(readFileSync(OPP_TPL, 'utf8'), 'OPP-DE-XUAT-PREFIX');
    const mut = banSao([['skills/acceptance/references/opportunity-template.md', `<!-- <<<OPP-DE-XUAT-PREFIX -->\n${goc}`, `<!-- <<<OPP-DE-XUAT-PREFIX -->\n${goc.replace(goc.trim(), '[gợi ý]')}`]]);
    const r = KHO_74(true); const x = node([path.join(mut, 'scripts', 'lo-trinh.mjs'), '--root', r, '--hang', '7n', '--mo-o']);
    const t = existsSync(path.join(r, '_acceptance', 'no-sau-7', 'opportunity.md')) ? readFileSync(path.join(r, '_acceptance', 'no-sau-7', 'opportunity.md'), 'utf8') : '';
    if (x.status === 0 && /^- Kết quả nào là SỐNG: \[gợi ý\] /m.test(t)) ok('LT-74-do', 'bản sao khuôn đổi tiền tố: tệp ghi mang «[gợi ý]» — writer đọc khuôn lúc chạy'); else bad('LT-74-do', `exit ${x.status} ${x.stderr.trim()} — tệp «${(t.match(/^- Kết quả nào là SỐNG:.*$/m) || [''])[0]}»`);
  } catch (e) { bad('LT-74-do', loi(e)); }
}

// ── LT-75: --mo-o không ghi khi không được ghi ──────────────────────────────
const chupAcc = r => { const ra = []; const di = d => { for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) { const p = path.join(d, e.name); if (e.isDirectory()) di(p); else ra.push(`${path.relative(r, p)} ${sha(p)}`); } }; di(path.join(r, '_acceptance')); return ra.join('\n'); };
if (want('LT-75')) {
  const CA = {
    'da-co-ho-so': () => { const r = kho({ hoSo: { s1: 'sap-mo' }, data: { schema: 1, hang: [H('1', { slug: 's1' })] } }); return { r, a: ['--hang', '1', '--mo-o'], kiem: x => (x.status === 0 && x.stdout.trim() === '{"hoSo":"s1","moi":false}' ? null : `exit ${x.status} «${x.stdout.trim()}»`), giu: true }; },
    'dich-da-co': () => { const r = kho({ data: { schema: 1, hang: [H('1')] } }); mkdirSync(path.join(r, '_acceptance', 'da-co'), { recursive: true }); writeFileSync(path.join(r, '_acceptance', 'da-co', 'ghi-chu.md'), 'x\n'); return { r, a: ['--hang', '1', '--mo-o', '--slug', 'da-co'], kiem: x => (x.status === 2 && x.stderr.includes(path.join('_acceptance', 'da-co')) ? null : `exit ${x.status} «${x.stderr.trim()}»`), giu: true }; },
    'thieu-slug': () => { const r = kho({ data: { schema: 1, hang: [{ ma: '1', cau_giao: 'Đặt OKR cho Bộ phận trong CRM ngay bây giờ' }] } }); return { r, a: ['--hang', '1', '--mo-o'], kiem: x => (x.status === 0 && x.stdout.trim() === '{"hoSo":"dat-okr-cho-bo-phan-trong","moi":true}' && existsSync(path.join(r, '_acceptance', 'dat-okr-cho-bo-phan-trong', 'opportunity.md')) ? null : `exit ${x.status} «${x.stdout.trim()}» ${x.stderr.trim()}`), giu: false }; },
  };
  for (const [ten, f] of Object.entries(CA)) {
    try {
      const { r, a, kiem, giu } = f(); const truoc = chupAcc(r); const x = node([LO, '--root', r, ...a]); const sai = [];
      const k = kiem(x); if (k) sai.push(k);
      const doi = chupAcc(r) !== truoc;
      if (giu && doi) sai.push('cây _acceptance/ đổi'); if (!giu && !doi) sai.push('đối chứng dương: ca ghi mà cây không đổi — phép so không có răng');
      if (sai.length) bad(`LT-75 ${ten}`, sai.join(' ; ')); else ok(`LT-75 ${ten}`, giu ? 'không ghi byte nào' : 'slug suy từ câu giao, cây đổi đúng một thư mục');
    } catch (e) { bad(`LT-75 ${ten}`, loi(e)); }
  }
}

// ── LT-76: S0 mở việc từ hàng — khối chạy nguyên văn + bảng mã thoát ─────────
const khoiSkill = (ten, txt = readFileSync(SKILL, 'utf8')) => { const m = txt.match(new RegExp(`<!-- <<<${ten} -->\\n\`\`\`\\n([\\s\\S]*?)\\n\`\`\`\\n<!-- ${ten}>>> -->`)); if (!m) throw new Error(`SKILL thiếu khối ${ten}`); return m[1]; };
const bangThoat = txt => { const b = khoiSkill('S0-MO-O-THOAT', txt); const ra = {}; for (const l of b.split('\n')) { const m = l.match(/^(\d+)\s*→\s*(.+)$/); if (m) ra[m[1]] = m[2].trim(); } return ra; };
const BANG_MONG = { 0: 'theo moi', 1: 'mô tả việc', 2: 'dừng', 3: 'dừng' };
const kiemBang = txt => { const b = bangThoat(txt); const sai = []; for (const [k, v] of Object.entries(BANG_MONG)) if (!(b[k] || '').startsWith(v)) sai.push(`${k} → «${b[k]}» (mong «${v}…»)`); if (Object.keys(b).length !== 4) sai.push(`bảng có ${Object.keys(b).length} dòng`); return sai; };
if (want('LT-76')) {
  const CA = {
    'ma-mot-tep': () => ({ r: kho({ data: { schema: 1, hang: [H('7n', { slug: 'n7' })] } }), ma: '7n', mong: x => x.status === 0 && JSON.parse(x.stdout).moi === true }),
    'ma-hai-tep': () => ({ r: khoX({ cfg: 'lo_trinh:\n  tep:\n    - docs/a.json\n    - docs/b.json\n', tepData: { 'docs/a.json': { schema: 1, hang: [H('7n')] }, 'docs/b.json': { schema: 1, hang: [H('7n')] } } }), ma: '7n', mong: x => x.status === 3, giu: true }),
    'da-co-ho-so': () => ({ r: kho({ hoSo: { n7: 'sap-mo' }, data: { schema: 1, hang: [H('7n', { slug: 'n7' })] } }), ma: '7n', mong: x => x.status === 0 && x.stdout.trim() === '{"hoSo":"n7","moi":false}', giu: true }),
    'khong-slug': () => ({ r: kho({ data: { schema: 1, hang: [{ ma: '7n', cau_giao: 'Nợ sau lượt bảy' }] } }), ma: '7n', mong: x => x.status === 0 && JSON.parse(x.stdout).hoSo === 'no-sau-luot-bay' }),
    'ma-khong-ton-tai': () => ({ r: kho({ data: { schema: 1, hang: [H('7n')] } }), ma: '9z', mong: x => x.status === 1, giu: true }),
  };
  let khoi; try { khoi = khoiSkill('S0-MO-O'); } catch (e) { bad('LT-76', loi(e)); }
  if (khoi) for (const [ten, f] of Object.entries(CA)) {
    try {
      const { r, ma, mong, giu } = f(); const truoc = chupAcc(r);
      const x = chayS0(khoi.replace("'<mã>'", `'${ma}'`), r); const sai = [];
      if (!mong(x)) sai.push(`exit ${x.status} «${x.stdout.trim()}» ${x.stderr.trim().slice(0, 160)}`);
      if (giu && chupAcc(r) !== truoc) sai.push('cây _acceptance/ đổi');
      if (sai.length) bad(`LT-76 ${ten}`, sai.join(' ; ')); else ok(`LT-76 ${ten}`, `khối S0-MO-O chạy nguyên văn: exit ${x.status}`);
    } catch (e) { bad(`LT-76 ${ten}`, loi(e)); }
  }
  try { const sai = kiemBang(readFileSync(SKILL, 'utf8')); if (sai.length) bad('LT-76 bang-thoat', sai.join(' ; ')); else ok('LT-76 bang-thoat', 'bảng S0-MO-O-THOAT: 0 theo moi · 1 mô tả việc · 2, 3 dừng'); } catch (e) { bad('LT-76 bang-thoat', loi(e)); }
  try {
    const re = new RegExp(khoiSkill('S0-MA-HANG-RE').trim()); const sai = [];
    for (const v of ['7n', 'docs/a.json:7n', '9b']) if (!re.test(v)) sai.push(`từ chối «${v}»`);
    for (const v of ['7 n', "7'n", '7"n', '7`n', '$(x)', '7(n)', 'a:b:c']) if (re.test(v)) sai.push(`nhận «${v}»`);
    if (sai.length) bad('LT-76 mau', sai.join(' ; ')); else ok('LT-76 mau', 'mẫu nhận <mã> và <tệp>:<mã>, từ chối khoảng trắng · nháy · backtick · $( · ngoặc');
  } catch (e) { bad('LT-76 mau', loi(e)); }
}
if (want('LT-76-do')) {
  try {
    const t = readFileSync(SKILL, 'utf8'); const b = khoiSkill('S0-MO-O-THOAT', t); const l3 = b.split('\n').find(l => /^3\s*→/.test(l));
    if (!l3) throw new Error('bảng không có dòng 3');
    const sai = kiemBang(t.replace(l3, '3 → mô tả việc'));
    const g = sai.find(m => m.startsWith('3 →'));
    if (g) ok('LT-76-do', `bản sao bảng gộp 3 vào mô tả việc: hàm đo trả «${g}»`); else bad('LT-76-do', `không bắt: ${JSON.stringify(sai)}`);
  } catch (e) { bad('LT-76-do', loi(e)); }
}

// ── LT-77: khoá nhiều tệp + trang một tệp giữ byte ─────────────────────────
if (want('LT-77 dang')) {
  try {
    const K = createRequire(import.meta.url)(path.join(KIT, 'scripts', 'lo-trinh-khoa.cjs')); const sai = [];
    const ab = { tep: ['docs/a.json', 'docs/b.json'], co: [] };
    const ca = [
      ['chuỗi', 'lo_trinh:\n  tep: docs/a.json   # chú thích\n', { tep: ['docs/a.json'], co: [] }],
      ['khối', 'lo_trinh:\n  tep:\n    - docs/a.json\n    - "docs/b.json"  # b\n', ab],
      ['dòng', "lo_trinh:\n  tep: [docs/a.json, 'docs/b.json']\n", ab],
      ['lặp', 'lo_trinh:\n  tep:\n    - docs/a.json\n    - docs/a.json\n    - docs/b.json\n', { tep: ['docs/a.json', 'docs/b.json'], co: ['tệp lộ trình khai hai lần: docs/a.json'] }],
      ['khối khác', 'khac:\n  tep: x.json\nlo_trinh:\n  tep: docs/a.json\nsau:\n  tep: y.json\n', { tep: ['docs/a.json'], co: [] }],
      ['chỉ khối khác', 'khac:\n  tep: x.json\n', null],
      ['rỗng', 'lo_trinh:\n  tep: []\n', null],
    ];
    for (const [ten, cfg, mong] of ca) { const v = K.cacTepTuConfig(`schema_version: 1\n${cfg}`); if (!deq(v, mong)) sai.push(`${ten}: ${JSON.stringify(v)}`); }
    if (K.khoaTuConfig('lo_trinh:\n  tep:\n    - docs/a.json\n    - docs/b.json\n') !== 'docs/a.json') sai.push('khoaTuConfig không trả phần tử đầu');
    if (sai.length) bad('LT-77 dang', sai.join(' ; ')); else ok('LT-77 dang', `${ca.length} dạng khai: chuỗi · khối · dòng cùng mảng; lặp gộp + cờ; khoá tep của khối khác không đọc nhầm`);
  } catch (e) { bad('LT-77 dang', loi(e)); }
}
const KHO_77 = (them = false) => kho({ hoSo: { a: 'da-ship' }, data: { schema: 1, moc: [{ ten: 'm', ngay: '2026-12-01', hang: ['A'] }], hang: [H('A', { slug: 'a', trang_thai: 'Đã giao' }), H('B'), ...(them ? [H('C2')] : [])] } });
async function lt77(kit) {
  const r1 = KHO_77(); const a = await loiPhan(kit, r1); const b = await loiPhan(banGoc(), r1);
  const sai = [];
  if (a !== b) sai.push('một tệp: lớp phân tích khác bản trước vòng');
  const r2 = KHO_77(true); const a2 = await loiPhan(kit, r2); const b2 = await loiPhan(banGoc(), r2);
  if (a2 === a || a2 !== b2) sai.push('đối chứng dương: thêm hàng mà hai bản không cùng đổi');
  if (veBang(kit, r1).trang == null) sai.push('một tệp: không có trang');
  return sai;
}
if (want('LT-77 mot-tep-byte')) {
  try { const sai = await lt77(KIT); if (sai.length) bad('LT-77 mot-tep-byte', sai.join(' ; ')); else ok('LT-77 mot-tep-byte', `kho một tệp: lớp phân tích giống hệt bộ máy ${GOC_VONG}, trang được vẽ; thêm hàng thì hai bản cùng đổi`); } catch (e) { bad('LT-77 mot-tep-byte', loi(e)); }
}
if (want('LT-77-do')) {
  try {
    const sai = await lt77(banSao([['scripts/lo-trinh.mjs', "const ke = dong.find(d => chuaLam.has(d.chu) && duDieuKien(d)) || null;", 'const ke = dong[0] || null;']]));
    const g = sai.find(m => m.startsWith('một tệp:'));
    if (g) ok('LT-77-do', `bản sao đổi luật hàng kế: «${g}»`); else bad('LT-77-do', `không bắt: ${JSON.stringify(sai)}`);
  } catch (e) { bad('LT-77-do', loi(e)); }
}

// ── LT-78: hai lộ trình ─────────────────────────────────────────────────────
const CFG_AB = 'lo_trinh:\n  tep:\n    - docs/a.json\n    - docs/b.json\n';
const DATA_A = { schema: 1, ten: 'Lộ trình A', hang: [H('1', { slug: 'a1' }), H('2')] };
const DATA_B = { schema: 1, ten: 'Lộ trình B', hang: [H('1'), H('3')] };
// Mục i của trang (trang-lo-trinh-doc-mot-phut): thẻ i ở đầu trang + section lt<i>.
const mucCua = (html, i) => { const t = [...html.matchAll(/<section class="the">[\s\S]*?<\/section>/g)][i - 1]; const m = html.match(new RegExp(`<section id="lt${i}">[\\s\\S]*?</section>`)); return t && m ? t[0] + m[0] : null; };
if (want('LT-78')) {
  try {
    const r = khoX({ cfg: CFG_AB, tepData: { 'docs/a.json': DATA_A, 'docs/b.json': DATA_B }, hoSo: { a1: 'da-ship' } });
    const sai = [];
    const v = veBang(KIT, r); const s1 = mucCua(v.trang || '', 1); const s2 = mucCua(v.trang || '', 2);
    if (!s1 || !s2 || v.trang.indexOf('<section id="lt1">') > v.trang.indexOf('<section id="lt2">')) sai.push('trang không có hai mục theo thứ tự');
    else { if (!s1.includes('Lộ trình A') || !s1.includes('>2</a> — ')) sai.push('mục A sai hàng kế'); if (!s2.includes('Lộ trình B') || !s2.includes('>1</a> — ')) sai.push('mục B sai hàng kế'); }
    const kq = LT.phanTichKho({ root: r, classify: PMM.classify, sections: PMM.SECTIONS });
    if (!deq(kq.cacTep.map(t => t.kq.hangKe.ma), ['2', '1'])) sai.push(`hàng kế từng tệp ${JSON.stringify(kq.cacTep.map(t => t.kq?.hangKe?.ma))}`);
    const rh = khoX({ cfg: CFG_AB, tepData: { 'docs/a.json': DATA_A, 'docs/b.json': '{ hỏng' }, hoSo: { a1: 'da-ship' } });
    const vh = veBang(KIT, rh); const h1 = mucCua(vh.trang || '', 1); const h2 = mucCua(vh.trang || '', 2);
    if (h1 !== s1) sai.push('tệp b hỏng làm đổi mục a'); if (!h2 || !h2.includes('Không đọc được kế hoạch')) sai.push('mục b không mang câu lỗi');
    const j = JSON.parse(quet(r).stdout);
    if (j.loTrinh?.ds?.length !== 2) sai.push(`ds ${j.loTrinh?.ds?.length}`);
    else if (j.loTrinh.ds[0].hangKe.thamSo !== 'docs/a.json:2') sai.push(`thamSo ${j.loTrinh.ds[0].hangKe.thamSo}`);
    const x = node([LO, '--root', r, '--hang', '1']);
    if (x.status !== 3 || !x.stderr.includes('docs/a.json') || !x.stderr.includes('docs/b.json')) sai.push(`--hang 1 exit ${x.status} «${x.stderr.trim()}»`);
    const y = node([LO, '--root', r, '--hang', 'docs/a.json:1']);
    if (y.status !== 0 || JSON.parse(y.stdout).slug !== 'a1') sai.push(`--hang docs/a.json:1 exit ${y.status} «${y.stdout.trim()}»`);
    if (sai.length) bad('LT-78', sai.join(' ; ')); else ok('LT-78', 'hai mục theo thứ tự khai, mỗi mục hàng kế riêng; tệp b hỏng không đổi mục a; ds 2; mã chung thoát 3 nêu hai tệp; <tệp>:<mã> chọn đúng');
  } catch (e) { bad('LT-78', loi(e)); }
}

// ── LT-79: dòng thẻ máy dựng sẵn ────────────────────────────────────────────
const D79 = { schema: 1, moc: [{ ten: 'm1', ngay: '2026-01-01', hang: ['B'] }, { ten: 'm2', ngay: '2026-12-01', hang: [] }], hang: [H('A', { slug: 'a' }), H('B')] };
const DONG_79 = r => ['Hàng kế: B — «câu giao B»', 'Hàng trễ: B (mốc m1, 2026-01-01) (1/2 mốc không gắn hàng nào)', 'Tin theo lời: 1/2 hàng'];
if (want('LT-79')) {
  const PMP = path.join(KIT, 'scripts', 'product-map.mjs');
  const CA = {
    'trang-co': () => { const r = kho({ hoSo: { a: 'da-ship' }, data: D79 }); node([PM, '--root', r]); return { r, mong: [...DONG_79(r), `Trang lộ trình: [LO-TRINH.html](${path.join(r, 'LO-TRINH.html')})`] }; },
    'trang-vang': () => { const r = kho({ hoSo: { a: 'da-ship' }, data: D79 }); return { r, mong: [...DONG_79(r), `Trang lộ trình chưa được vẽ — vẽ bằng: \`node ${PMP} --root .\``] }; },
    'ban-do-chua-bat': () => { const r = kho({ hoSo: { a: 'da-ship' }, data: D79, t1: ['LO-TRINH.html'] }); node([PM, '--root', r]); return { r, mong: [...DONG_79(r), `Trang lộ trình: [LO-TRINH.html](${path.join(r, 'LO-TRINH.html')})`, '⚠ Lộ trình đã khai nhưng bản đồ sản phẩm chưa bật — bốn lệnh đóng cổng sẽ không vẽ lại trang; bật bằng hai dòng trong `_acceptance/config.yaml`'] }; },
    'moc-khong-hang': () => { const r = kho({ hoSo: { a: 'da-ship' }, data: { ...D79, moc: [{ ten: 'm1', ngay: '2026-01-01', hang: ['B'] }] } }); node([PM, '--root', r]); return { r, mong: ['Hàng kế: B — «câu giao B»', 'Hàng trễ: B (mốc m1, 2026-01-01)', 'Tin theo lời: 1/2 hàng', `Trang lộ trình: [LO-TRINH.html](${path.join(r, 'LO-TRINH.html')})`] }; },
  };
  for (const [ten, f] of Object.entries(CA)) {
    try {
      const { r, mong } = f(); const j = JSON.parse(quet(r, { ACCEPTANCE_TODAY: '2026-10-03' }).stdout);
      if (deq(j.loTrinh?.dong, mong)) ok(`LT-79 ${ten}`, `${mong.length} dòng đúng từng chữ`); else bad(`LT-79 ${ten}`, `${JSON.stringify(j.loTrinh?.dong)} != ${JSON.stringify(mong)}`);
    } catch (e) { bad(`LT-79 ${ten}`, loi(e)); }
  }
  try {
    const t = readFileSync(path.join(KIT, 'commands', 'start.md'), 'utf8'); const sai = [];
    const k = (t.match(/<!-- <<<START-LO-TRINH -->([\s\S]*?)<!-- START-LO-TRINH>>> -->/) || [])[1] || '';
    if (!k.includes('in nguyên') || !k.includes('`loTrinh.dong`')) sai.push('START-LO-TRINH không nói in nguyên `loTrinh.dong`');
    const b4 = t.slice(t.indexOf('4. **MỘT câu hỏi chọn'), t.indexOf('5. Lệnh KHÔNG tự làm nội dung'));
    if (!b4.includes('/feature-loop:feature-loop <hangKe.thamSo>')) sai.push('bước 4 không có dòng chọn hàng kế dẫn tới /feature-loop:feature-loop <hangKe.thamSo>');
    if (sai.length) bad('LT-79 than-start', sai.join(' ; ')); else ok('LT-79 than-start', 'thân /start in nguyên loTrinh.dong; bước 4 có dòng chọn hàng kế');
  } catch (e) { bad('LT-79 than-start', loi(e)); }
}

// ── LT-80: bản đồ trỏ trang; kho không khai giữ byte ───────────────────────
function lt80(kit) {
  const sai = [];
  const rk = kho({ hoSo: { a: 'da-ship' }, data: { schema: 1, hang: [H('A', { slug: 'a' })] } });
  const vk = veBang(kit, rk); const n = vk.map.split('\n').filter(l => l.includes('[LO-TRINH.html](LO-TRINH.html)')).length;
  if (n !== 1) sai.push(`kho khai: ${n} dòng liên kết`);
  const rv = kho({ khoa: false, hoSo: { a: 'da-ship', b: 'sap-mo' } });
  const moi = veBang(kit, rv); const cu = veBang(banGoc(), rv);
  if (!cu.pm.startsWith(realpathSync(banGoc()))) sai.push(`bên cũ chạy từ ${cu.pm}`);
  if (moi.map !== cu.map) sai.push('kho không khai: PRODUCT-MAP.md khác bản trước vòng');
  if (moi.map.includes('LO-TRINH.html')) sai.push('kho không khai: bản đồ nhắc LO-TRINH.html');
  const sc = (k, r) => { const x = node([path.join(k, 'scripts', 'start-scan.mjs'), '--root', r]); if (x.status !== 0) throw new Error(`start-scan ${k} exit ${x.status}`); return { ...JSON.parse(x.stdout), git: null }; };
  if (!deq(sc(kit, rv), sc(banGoc(), rv))) sai.push('kho không khai: JSON quét khác bản trước vòng');
  return sai;
}
if (want('LT-80')) {
  try { const sai = lt80(KIT); if (sai.length) bad('LT-80', sai.join(' ; ')); else ok('LT-80', `kho khai: một dòng liên kết tới LO-TRINH.html; kho không khai: bản đồ + JSON quét giống từng byte bộ ${GOC_VONG}`); } catch (e) { bad('LT-80', loi(e)); }
}
if (want('LT-80-do')) {
  try {
    const sai = lt80(banSao([['scripts/product-map.mjs', 'if (coLoTrinh) lines.push(', 'if (true) lines.push(']]));
    const g = sai.find(m => m.startsWith('kho không khai: PRODUCT-MAP.md khác'));
    if (g) ok('LT-80-do', `bản sao luôn thêm dòng liên kết: «${g}»`); else bad('LT-80-do', `không bắt: ${JSON.stringify(sai)}`);
  } catch (e) { bad('LT-80-do', loi(e)); }
}

// ═══ Vòng trả lượt 1 (Cổng Bằng chứng 03/10, owner «trả»): LT-81..LT-84 ═══════════════════════════
// ── LT-81: khối config khoan dung với chú thích sát lề, dòng trống, CRLF ──────
const CA_81 = [
  ['chú thích sát lề trước tep', 'lo_trinh:\n  tep: docs/a.json\n', 'lo_trinh:\n# tệp ý định\n  tep: docs/a.json\n'],
  ['chú thích sát lề sau tep', 'lo_trinh:\n  tep: docs/a.json\nsau: 1\n', 'lo_trinh:\n  tep: docs/a.json\n# hết khối\nsau: 1\n'],
  ['dòng trống', 'lo_trinh:\n  tep: docs/a.json\n', 'lo_trinh:\n\n  tep: docs/a.json\n'],
  ['CRLF', 'lo_trinh:\n  tep: docs/a.json\n', 'lo_trinh:\r\n# x\r\n  tep: docs/a.json\r\n'],
  ['chú thích giữa danh sách khối', 'lo_trinh:\n  tep:\n    - docs/a.json\n    - docs/b.json\n', 'lo_trinh:\n  tep:\n    - docs/a.json\n# b là lộ trình phụ\n\n    - docs/b.json\n'],
];
function lt81(khoaPath) {
  const K = createRequire(import.meta.url)(khoaPath); const sai = [];
  const { resolveConfigKey } = createRequire(import.meta.url)(path.join(KIT, 'lib', 'evidence-core.cjs'));
  for (const [ten, goc, bien] of CA_81) {
    const a = K.cacTepTuConfig(`schema_version: 1\n${goc}`); const b = K.cacTepTuConfig(`schema_version: 1\n${bien}`);
    if (!deq(a, b)) { sai.push(`${ten}: ${JSON.stringify(b)} != ${JSON.stringify(a)}`); continue; }
    if (b && b.tep.length === 1) {
      const chung = String(resolveConfigKey(`schema_version: 1\n${bien}`, 'lo_trinh.tep') ?? '').trim().replace(/^["']|["']$/g, '');
      if (chung !== b.tep[0]) sai.push(`${ten}: bộ đọc chung «${chung}» != «${b.tep[0]}»`);
    }
  }
  return sai;
}
if (want('LT-81')) {
  try { const sai = lt81(path.join(KIT, 'scripts', 'lo-trinh-khoa.cjs')); if (sai.length) bad('LT-81', sai.join(' ; ')); else ok('LT-81', `${CA_81.length} hình dạng khối (chú thích sát lề · dòng trống · CRLF · chú thích giữa danh sách) đọc như bản sạch; ca một tệp khớp bộ đọc chung`); } catch (e) { bad('LT-81', loi(e)); }
}
if (want('LT-81-do')) {
  try {
    const mut = banSao([['scripts/lo-trinh-khoa.cjs', '    if (/^\\s*(#.*)?$/.test(l)) continue; // chú thích và dòng trống không cắt khối\n', '']]);
    const sai = lt81(path.join(mut, 'scripts', 'lo-trinh-khoa.cjs'));
    const g = sai.find(m => m.startsWith('chú thích sát lề'));
    if (g) ok('LT-81-do', `bản sao bỏ bước bỏ qua chú thích: «${g.slice(0, 90)}»`); else bad('LT-81-do', `không bắt: ${JSON.stringify(sai)}`);
  } catch (e) { bad('LT-81-do', loi(e)); }
}

// ── LT-82: mã trùng trong một tệp — kit không chọn hộ ───────────────────────
if (want('LT-82')) {
  try {
    const r = kho({ data: { schema: 1, hang: [H('T', { trang_thai: 'Đang làm' }), H('T'), H('U')] } }); const sai = [];
    const j = JSON.parse(quet(r).stdout).loTrinh;
    if (j.ds[0].hangKe?.ma !== 'T' || j.ds[0].hangKe.thamSo !== null) sai.push(`hangKe ${JSON.stringify(j.ds[0].hangKe)}`);
    const truoc = chupAcc(r);
    for (const a of [['--hang', 'T'], ['--hang', 'T', '--mo-o', '--slug', 'tt']]) {
      const x = node([LO, '--root', r, ...a]);
      if (x.status !== 3 || !x.stderr.includes('mã T trùng trong docs/lo-trinh.json')) sai.push(`${a.join(' ')}: exit ${x.status} «${x.stderr.trim()}»`);
    }
    if (chupAcc(r) !== truoc) sai.push('cây _acceptance/ đổi');
    const y = node([LO, '--root', r, '--hang', 'U', '--mo-o', '--slug', 'uu']);
    if (y.status !== 0 || chupAcc(r) === truoc) sai.push(`đối chứng dương: --mo-o U exit ${y.status}, cây ${chupAcc(r) === truoc ? 'không đổi' : 'đổi'}`);
    if (sai.length) bad('LT-82', sai.join(' ; ')); else ok('LT-82', 'hàng kế mã trùng không thành lựa chọn mở (thamSo null); tra và mở thoát 3 «mã T trùng trong …», không ghi byte nào; mã đơn vẫn mở được');
  } catch (e) { bad('LT-82', loi(e)); }
}

// ── LT-83: nhiều hồ sơ nhận — không là hàng kế, không mở thêm ──────────────
const KHO_83 = () => khoX({ cfg: mot(), tepData: { 'docs/lo-trinh.json': { schema: 1, hang: [H('X', { slug: 'x-vang' }), H('Y')] } }, hoSo: { c1: 'sap-mo', c2: 'cho-nghiem-thu' }, nhan: { c1: { ma: 'X' }, c2: { ma: 'X' } } });
async function lt83(kit) {
  const M = await napLT(kit); const r = KHO_83(); const kq = phanBang(M, r).kq; const sai = [];
  const x = kq.dong[0];
  if (x.chu !== LT.KHONG_SUY) sai.push(`X ${x.chu}`);
  if (!deq(kq.co, ['hàng X được nhiều hồ sơ nhận: c1, c2'])) sai.push(`cờ ${JSON.stringify(kq.co)}`);
  if (kq.hangKe?.ma === 'X') sai.push('hàng kế X');
  const truoc = chupAcc(r); const m = node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', r, '--hang', 'X', '--mo-o']);
  if (m.status !== 2 || !m.stderr.includes('c1') || !m.stderr.includes('c2')) sai.push(`--mo-o exit ${m.status} «${m.stderr.trim()}»`);
  if (chupAcc(r) !== truoc) sai.push('cây _acceptance/ đổi');
  return sai;
}
if (want('LT-83')) {
  try { const sai = await lt83(KIT); if (sai.length) bad('LT-83', sai.join(' ; ')); else ok('LT-83', 'hàng hai hồ sơ nhận: «Không suy được» + một cờ, không là hàng kế; lệnh mở thoát 2 nêu c1, c2, không ghi gì'); } catch (e) { bad('LT-83', loi(e)); }
}
if (want('LT-83-do')) {
  try {
    const sai = await lt83(banSao([['scripts/lo-trinh.mjs', 'chu = KHONG_SUY; // nhiều-người-nhận', 'chu = CHUA_MO; // nhiều-người-nhận']]));
    const g = sai.find(m => m === 'hàng kế X');
    if (g) ok('LT-83-do', `bản sao bỏ nhánh nhiều-người-nhận: «${g}»`); else bad('LT-83-do', `không bắt: ${JSON.stringify(sai)}`);
  } catch (e) { bad('LT-83-do', loi(e)); }
}

// ── LT-84: khối S0 mở việc chạy được khi máy không khai email git ─────────
function homeTu(kit) {
  const h = path.join(TMP, `home-${++bsN}`); const v = path.join(h, '.claude', 'plugins', 'cache', 'acceptance-gate-kit', 'acceptance-gate', '9.9.9');
  for (const d of ['scripts', 'lib', 'skills']) cpSync(path.join(kit, d), path.join(v, d), { recursive: true });
  return h;
}
function lt84(kit) {
  const r = kho({ data: { schema: 1, hang: [H('7n', { slug: 'n7' })] } }); git(r, 'config', '--unset', 'user.email');
  const env = { ...process.env, HOME: homeTu(kit), GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null', WORKFLOWS_DIR: path.join(KIT, 'feature-loop', 'workflows') };
  const em = spawnSync('git', ['config', 'user.email'], { cwd: r, encoding: 'utf8', env });
  if (em.stdout.trim() !== '') throw new Error(`đối chứng: git config user.email vẫn in «${em.stdout.trim()}»`);
  const x = spawnSync('bash', ['-c', khoiSkill('S0-MO-O').replace("'<mã>'", "'7n'")], { cwd: r, encoding: 'utf8', env });
  const sai = [];
  if (x.status !== 0) sai.push(`exit ${x.status} «${x.stderr.trim()}»`);
  else {
    if (JSON.parse(x.stdout).moi !== true) sai.push(`stdout ${x.stdout.trim()}`);
    const t = readFileSync(path.join(r, '_acceptance', 'n7', 'opportunity.md'), 'utf8');
    if (!/^owner:[ \t]*$/m.test(t)) sai.push(`owner «${(t.match(/^owner:.*$/m) || [''])[0]}»`);
  }
  return sai;
}
if (want('LT-84')) {
  try { const sai = lt84(KIT); if (sai.length) bad('LT-84', sai.join(' ; ')); else ok('LT-84', 'không email git: khối S0-MO-O thoát 0, ô cơ hội ghi owner rỗng'); } catch (e) { bad('LT-84', loi(e)); }
}
if (want('LT-84-do')) {
  try {
    const sai = lt84(banSao([['scripts/lo-trinh.mjs', "if (v == null || (v === '' && a[i] !== '--owner') || v.startsWith('--'))", "if (v == null || v === '' || v.startsWith('--'))"]]));
    const g = sai.find(m => m.startsWith('exit 2'));
    if (g) ok('LT-84-do', `bản sao từ chối --owner rỗng: «${g.slice(0, 90)}»`); else bad('LT-84-do', `không bắt: ${JSON.stringify(sai)}`);
  } catch (e) { bad('LT-84-do', loi(e)); }
}

// ═══ Vòng trang-lo-trinh-doc-mot-phut (LT-90..LT-100) ═════════════════════════════════════════
// Hồ sơ _acceptance/trang-lo-trinh-doc-mot-phut/. Trang đọc bằng regex trên HTML máy sinh; kho năm
// trạng thái dựng bằng lo-trinh-kho-thu.mjs (fixture crm + hồ sơ sinh trong lượt). Đo trên Chrome ở
// xem-trang-lo-trinh.test.mjs (LTT-*).
const KT = await import(pathToFileURL(path.join(HERE, 'lo-trinh-kho-thu.mjs')).href);
const veM = (M, r) => M.LT.veTrang({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS });
const giaiMa = s => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const chuTron = s => giaiMa(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const cacThe = html => [...html.matchAll(/<section class="the">([\s\S]*?)<\/section>/g)].map(m => m[1]);
const mucLT = (html, i) => { const m = html.match(new RegExp(`<section id="lt${i}">([\\s\\S]*?)</section>`)); return m ? m[1] : null; };
const cacId = html => new Set([...html.matchAll(/ id="([^"]+)"/g)].map(m => m[1]));
const NHAN_THE = ['Làm tiếp', 'Cần sửa trong kế hoạch', 'Mốc kế tiếp', 'Tiến độ'];
// Các hàng của một mục, đọc từ HTML: [id, mã, câu việc giao].
const hangMuc = muc => [...(muc || '').matchAll(/<tr id="([^"]+)"><td data-nhan="Mã">([^<]*)<\/td>(?:<td data-nhan="Việc giao">([\s\S]*?)<\/td>)?/g)].map(m => [m[1], giaiMa(m[2]), chuTron(m[3] || '')]);
// Neo của hàng ĐẦU mang mã (liên kết từ chỗ cần sửa), và neo của hàng kế (mã + câu giao — mã trùng thì
// không lấy hàng đầu).
const neoDau = (muc, ma) => (hangMuc(muc).find(h => h[1] === String(ma)) || [])[0];
const neoKe = (muc, ma, cau) => { const c = hangMuc(muc).filter(h => h[1] === String(ma)); return ((c.length > 1 ? c.find(h => h[2].startsWith(cau)) : c[0]) || [])[0]; };
// Hàng ghi trạng thái ngoài bảng từ, gom theo từ: [từ, [nhãn hàng]] theo thứ tự gặp.
const muaKhai = kq => { const g = new Map(); for (const d of kq.dong) if (d.khaiNgoai) { if (!g.has(d.tuKhai)) g.set(d.tuKhai, []); g.get(d.tuKhai).push(String(d._nhan)); } return [...g]; };
const cauKhai = ([w, ma]) => `kế hoạch ghi «${w}» ở ${ma.length} việc — máy không hiểu trạng thái này, thêm từ này vào bảng từ trạng thái (việc ${ma.join(', ')})`;
const khoKT = {}; const khoTT = ten => (khoKT[ten] ||= KT.dungKho(ten, path.join(TMP, 'kt')));
const phanKho = (M, r) => M.LT.phanTichKho({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS });
const chayCa = async (id, f, kit = KIT) => { try { const s = await f(kit); if (s.length) bad(id, s.join(' ; ')); else return true; } catch (e) { bad(id, loi(e)); } return false; };
const chayDo = async (id, f, tiem, ghim, moTa) => {
  try {
    const s = await f(banSao(tiem)); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm đo trả «${g.slice(0, 110)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 200)}`);
  } catch (e) { bad(id, loi(e)); }
};

// ── LT-90: thẻ đầu trang ────────────────────────────────────────────────────
async function lt90(kit) {
  const M = await napLT(kit); const sai = [];
  const KHO_90 = { 'ma-trung-ke': () => kho({ data: { schema: 1, hang: [H('T', { cau_giao: '«một»', trang_thai: 'Đã giao' }), H('T', { cau_giao: '«hai»' })] } }),
    'khong-ma': () => kho({ data: { schema: 1, hang: [{ cau_giao: '«việc chưa đặt mã»' }] } }) };
  for (const ten of ['hai-lo-trinh', 'loi-tep', 'rong', 'ma-trung-ke', 'khong-ma']) {
    const r = KHO_90[ten] ? KHO_90[ten]() : khoTT(ten); const html = veM(M, r); const ids = cacId(html); const k = phanKho(M, r);
    const j = JSON.parse(quet(r, { ACCEPTANCE_TODAY: '2026-10-03' }, kit).stdout).loTrinh;
    const the = cacThe(html);
    if (the.length !== k.cacTep.length) { sai.push(`${ten}: ${the.length} thẻ cho ${k.cacTep.length} lộ trình`); continue; }
    k.cacTep.forEach((t, i) => {
      const c = the[i]; const tc = chuTron(c); const ma = `${ten} thẻ ${i + 1}`;
      if (t.loi) { if (!tc.includes(`Không đọc được kế hoạch ${t.tep}`) || c.includes('class="o')) sai.push(`${ma}: thẻ lỗi sai «${tc.slice(0, 80)}»`); return; }
      const nhan = [...c.matchAll(/<span class="nhan">([^<]*)<\/span>/g)].map(m => m[1]);
      if (!deq(nhan, NHAN_THE)) sai.push(`${ma}: nhãn ${JSON.stringify(nhan)}`);
      const d = j.ds[i];
      if (d.hangKe) {
        const a = c.match(/<span class="ke"><a href="#([^"]+)">/); const neo = neoKe(mucLT(html, i + 1), d.hangKe.ma, d.hangKe.cauGiao);
        if (!a || !neo || a[1] !== neo) sai.push(`${ma}: liên kết hàng kế «${a && a[1]}» != neo của hàng kế «${neo}»`);
        const l = c.match(/<span class="lenh">([^<]*)<\/span>/); const co = l ? giaiMa(l[1]) : null;
        const mong = d.hangKe.thamSo ? `/feature-loop:feature-loop ${d.hangKe.thamSo}` : null;
        if (co !== mong) sai.push(`${ma}: lệnh «${co}» != thamSo «${mong}»`);
        if (!mong && !/Mã này trùng trong kế hoạch|Việc này chưa có mã/.test(tc)) sai.push(`${ma}: không lệnh mà không nói vì sao`);
      }
      const nco = t.kq.co.length + muaKhai(t.kq).length; const m = tc.match(/(\d+) chỗ cần sửa/);
      if (nco ? !(m && Number(m[1]) === nco && c.includes(`href="#lt${i + 1}-co"`) && ids.has(`lt${i + 1}-co`)) : !tc.includes('Không có chỗ nào cần sửa')) sai.push(`${ma}: số chỗ cần sửa ${m && m[1]} != ${nco}`);
      const tong = t.kq.dong.length; const td = tc.match(/(\d+)\/(\d+) đã giao · (\d+) đang làm · (\d+) chưa bắt đầu(?: · (\d+) xếp lại hoặc chưa rõ)?/);
      if (tong === 0) { if (!tc.includes('Kế hoạch chưa có việc nào')) sai.push(`${ma}: kế hoạch rỗng mà thẻ không nói «Kế hoạch chưa có việc nào»`); }
      else if (!td || Number(td[2]) !== tong || Number(td[1]) + Number(td[3]) + Number(td[4]) + Number(td[5] || 0) !== tong) sai.push(`${ma}: tiến độ «${td && td[0]}» cho ${tong} hàng`);
    });
    if (ten === 'ma-trung-ke' && !(the[0].includes('href="#lt1-h-T-2">T</a> — «hai»') && chuTron(the[0]).includes('Mã này trùng trong kế hoạch'))) sai.push(`ma-trung-ke: thẻ không chỉ hàng T thứ hai «${chuTron(the[0]).slice(0, 120)}»`);
    if (ten === 'khong-ma' && !chuTron(the[0]).includes('Việc này chưa có mã')) sai.push(`khong-ma: thẻ «${chuTron(the[0]).slice(0, 120)}»`);
  }
  return sai;
}
if (want('LT-90') && await chayCa('LT-90', lt90)) ok('LT-90', 'hai lộ trình · tệp hỏng · kế hoạch rỗng · mã trùng · việc không mã: một thẻ mỗi lộ trình, bốn nhãn đúng thứ tự, liên kết hàng kế == neo của CHÍNH hàng kế, lệnh == thamSo thẻ start (không lệnh thì nói vì sao), số chỗ cần sửa == cờ + hàng ghi trạng thái lạ, tiến độ cộng đủ, thẻ lỗi chỉ câu lỗi');
if (want('LT-90-do')) await chayDo('LT-90-do', lt90, [['scripts/lo-trinh.mjs', 'const lenh = thamSoKe(kq, t.tep, nhieu);', 'const lenh = thamSoKe(kq, t.tep, false);']], '!= thamSo', 'bản sao in mã trơn khi nhiều tệp');

// ── LT-91: danh sách chỗ lệch ───────────────────────────────────────────────
async function lt91(kit) {
  const M = await napLT(kit); const sai = [];
  for (const ten of ['hai-lo-trinh', 'loi-tep']) {
    const r = khoTT(ten); const html = veM(M, r); const ids = cacId(html); const k = phanKho(M, r);
    k.cacTep.forEach((t, i) => {
      if (t.loi) return; const muc = mucLT(html, i + 1); const ma = `${ten} lộ trình ${i + 1}`;
      if (muc == null) { sai.push(`${ma}: không có mục`); return; }
      const ds = muc.match(/<ul class="co-ds">([\s\S]*?)<\/ul>/);
      const li = ds ? [...ds[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1]) : [];
      const mong = [...t.kq.co.map(c => { const d = M.LT.dichCo(c); return [d.ma, d.ma != null ? `${d.ma} — ${d.chu}` : d.chu]; }), ...muaKhai(t.kq).map(g => [null, cauKhai(g)])];
      if (li.length !== mong.length) { sai.push(`${ma}: ${li.length} chỗ cần sửa trên trang, cần ${mong.length} (cờ + hàng ghi trạng thái lạ)`); return; }
      if (li.length && muc.indexOf('class="co-ds"') > muc.indexOf('Việc còn mở')) sai.push(`${ma}: danh sách chỗ cần sửa đứng sau bảng việc`);
      li.forEach((x, n) => {
        const [mh, can] = mong[n];
        if (chuTron(x) !== can) sai.push(`${ma} chỗ cần sửa ${n + 1}: «${chuTron(x)}» != «${can}»`);
        const a = x.match(/^<a href="#([^"]+)">[\s\S]*<\/a>$/); const neo = mh != null ? neoDau(muc, mh) : null;
        if (neo && !(a && a[1] === neo)) sai.push(`${ma} chỗ cần sửa ${n + 1}: liên kết «${a && a[1]}» != neo hàng ${mh} «${neo}»`);
      });
    });
  }
  return sai;
}
if (want('LT-91') && await chayCa('LT-91', lt91)) ok('LT-91', 'mỗi mục: chỗ cần sửa == cờ dịch theo đúng thứ tự + mỗi từ trạng thái lạ (gom các hàng ghi nó), mỗi chỗ có hàng là liên kết bọc trọn ô tới neo của ĐÚNG hàng đó, đứng trước bảng việc');
if (want('LT-91-do')) await chayDo('LT-91-do', lt91, [['scripts/lo-trinh.mjs', 'kq.co.map(c => moCo(i, c, theoNhan))', 'kq.co.slice(1).map(c => moCo(i, c, theoNhan))']], 'chỗ cần sửa trên trang', 'bản sao bỏ một cờ khi vẽ');

// ── LT-92: bảng việc còn mở / đã giao ───────────────────────────────────────
const KHO_92 = () => kho({ hoSo: { g: 'da-ship', l: 'dang-dung' }, data: { schema: 1, hang: [H('A', { slug: 'g', hang: 'T2' }), H('B', { slug: 'l', dung_tren: ['A'] }), H('C', { dung_tren: ['B'] }), H('D')] } });
async function lt92(kit) {
  const M = await napLT(kit); const sai = []; const r = KHO_92(); const html = veM(M, r); const ids = cacId(html);
  const kq = phanKho(M, r).cacTep[0].kq; const muc = mucLT(html, 1) || '';
  const iMo = muc.indexOf('Việc còn mở'); const iDt = muc.indexOf('<details>');
  const bangMo = muc.slice(iMo, iDt > iMo ? iDt : undefined); const bangXong = iDt > 0 ? muc.slice(iDt, muc.indexOf('</details>', iDt)) : '';
  const maTu = s => [...s.matchAll(/<tr id="lt1-h-([^"]+)"/g)].map(m => m[1]).sort();
  const mong = f => kq.dong.filter(f).map(d => String(d._ma || d._nhan)).sort();
  if (!deq(maTu(bangMo), mong(d => !kq.daGiao.has(d.chu)))) sai.push(`bảng còn mở ${JSON.stringify(maTu(bangMo))}`);
  if (!deq(maTu(bangXong), mong(d => kq.daGiao.has(d.chu)))) sai.push(`bảng đã giao ${JSON.stringify(maTu(bangXong))}`);
  if (maTu(bangMo).length + maTu(bangXong).length !== kq.dong.length) sai.push('hai bảng không cộng đủ mọi hàng');
  if (!/<details><summary>1 việc đã giao<\/summary>/.test(muc)) sai.push('thiếu <details> «1 việc đã giao» (không mở sẵn)');
  const b = bangMo.match(/<tr id="lt1-h-B">([\s\S]*?)<\/tr>/);
  if (!b || !b[1].includes('<a href="#lt1-h-A">A</a>') || !ids.has('lt1-h-A')) sai.push('«Cần xong trước» của B không là liên kết tới A');
  if (!(bangMo.match(/<tr id="lt1-h-C">[\s\S]*?<\/tr>/) || [''])[0].includes('theo ghi chép, chưa có hồ sơ')) sai.push('hàng C không ghi «theo ghi chép, chưa có hồ sơ»');
  const th = [...bangMo.matchAll(/<th>([^<]*)<\/th>/g)].map(m => m[1]);
  if (th.includes('Vì sao') || th.includes('Bật khi') || !th.includes('Mã') || !th.includes('Trạng thái')) sai.push(`cột ${JSON.stringify(th)}`);
  return sai;
}
if (want('LT-92') && await chayCa('LT-92', lt92)) ok('LT-92', 'bảng còn mở == hàng chưa giao, <details> «1 việc đã giao» == hàng đã giao, cộng đủ; Cần xong trước là liên kết; hàng không hồ sơ ghi «theo ghi chép, chưa có hồ sơ»; cột rỗng bỏ, Mã/Trạng thái giữ');
if (want('LT-92-do')) await chayDo('LT-92-do', lt92, [['scripts/lo-trinh.mjs', 'const mo = kq.dong.filter(d => !kq.daGiao.has(d.chu));', 'const mo = kq.dong;']], 'bảng còn mở', 'bản sao không gập hàng đã giao');

// ── LT-93: hồ sơ không thuộc kế hoạch nào — một lần ─────────────────────────
async function lt93(kit) {
  const M = await napLT(kit); const sai = [];
  const r = khoTT('hai-lo-trinh'); const html = veM(M, r);
  // Đếm độc lập lớp phân tích: thư mục hồ sơ trừ slug mọi tệp kế hoạch trỏ.
  const troi = new Set(['docs/plan/lo-trinh-okr.json', 'docs/plan/lo-trinh-kho-tai-lieu.json'].flatMap(t => JSON.parse(readFileSync(path.join(r, t), 'utf8')).hang.map(h => h && h.slug).filter(Boolean)));
  const ngoai = readdirSync(path.join(r, '_acceptance'), { withFileTypes: true }).filter(e => e.isDirectory() && !troi.has(e.name)).map(e => e.name);
  for (const s of ngoai) { const n = html.split(`<code>${s}</code>`).length - 1; if (n !== 1) { sai.push(`${s} xuất hiện ${n} lần`); break; } }
  const m = html.match(/<details><summary>(\d+) hồ sơ không thuộc kế hoạch nào<\/summary>/);
  if (!m || Number(m[1]) !== ngoai.length) sai.push(`tiêu đề khối ${m && m[1]} != ${ngoai.length}`);
  if (m && html.indexOf(m[0]) < html.lastIndexOf('</section>')) sai.push('khối không nằm cuối trang');
  if (veM(M, khoTT('khong-co')).includes('không thuộc kế hoạch nào')) sai.push('kho không có hồ sơ ngoài kế hoạch mà vẫn có khối');
  return sai;
}
if (want('LT-93') && await chayCa('LT-93', lt93)) ok('LT-93', 'mọi hồ sơ không lộ trình nào trỏ (đếm độc lập từ thư mục và tệp kế hoạch) xuất hiện đúng một lần, trong <details> cuối trang có số đúng; kho không có thì không có khối');
if (want('LT-93-do')) await chayDo('LT-93-do', lt93, [['scripts/lo-trinh.mjs', "  P.push('</section>');\n  return P.join('\\n');", "  P.push(khoiNgoai(kq.ngoaiLoTrinh), '</section>');\n  return P.join('\\n');"]], 'xuất hiện 3 lần', 'bản sao in khối ở mỗi lộ trình (hai lộ trình + cuối trang)');

// ── LT-94: dải mốc tĩnh ─────────────────────────────────────────────────────
async function lt94(kit) {
  const M = await napLT(kit); const sai = [];
  const r = kho({ hoSo: { g: 'da-ship' }, data: { schema: 1, moc: [{ ten: 'Tới', ngay: '2026-11-15', hang: ['B'] }, { ten: 'Qua', ngay: '2026-09-01', hang: ['A'] }, { ten: 'Rời', ngay: '2026-10-03' }], hang: [H('A', { slug: 'g' }), H('B')] } });
  const html = veM(M, r); const ol = (html.match(/<ol class="moc"[\s\S]*?<\/ol>/) || [''])[0];
  const ngay = [...ol.matchAll(/<li data-ngay="([^"]+)"/g)].map(m => m[1]);
  if (!deq(ngay, ['2026-09-01', '2026-10-03', '2026-11-15'])) sai.push(`thứ tự mốc ${JSON.stringify(ngay)}`);
  const li = [...ol.matchAll(/<li [\s\S]*?<\/li>/g)].map(m => m[0]);
  if (li.filter(x => x.includes('chưa gắn việc')).length !== 1 || !li[1].includes('chưa gắn việc')) sai.push('nhãn «chưa gắn việc» không đúng một mốc Rời');
  if (!html.includes('1/3 mốc chưa gắn việc nào')) sai.push('tiêu đề không ghi «1/3 mốc chưa gắn việc nào»');
  if (!deq(li.map(x => x.includes(' data-con-viec')), [false, false, true])) sai.push(`đánh dấu mốc còn việc ${JSON.stringify(li.map(x => x.includes(' data-con-viec')))} (cần chỉ mốc Tới: việc B chưa giao; Qua: việc A đã giao)`);
  if (!html.includes('<span id="lt1-moc-ke">Xem dải mốc bên dưới.</span>')) sai.push('ô thẻ không có chữ dự phòng khi tắt script');
  const h = new Date(); const p2 = x => String(x).padStart(2, '0');
  for (const s of [h.toISOString().slice(0, 10), `${p2(h.getDate())}/${p2(h.getMonth() + 1)}/${h.getFullYear()}`]) if (!['2026-10-03', '03/10/2026'].includes(s) && html.includes(s)) sai.push(`trang chứa ngày chạy ${s}`);
  if (/ src=|href="?https?:/i.test(html) || (html.match(/<script/g) || []).length !== 1) sai.push('trang có tài nguyên ngoài hoặc hơn một script');
  return sai;
}
if (want('LT-94') && await chayCa('LT-94', lt94)) ok('LT-94', 'dải mốc sắp theo ngày, chỉ mốc gắn việc chưa giao mang dấu còn việc, mốc không gắn việc mang nhãn, tiêu đề «1/3 mốc chưa gắn việc nào», ô thẻ có chữ dự phòng, không ngày chạy, một script nội tuyến, không tài nguyên ngoài');

// ── LT-95: hai đồng hồ, một trang ───────────────────────────────────────────
function veDuoiDongHo(kit, r, ngay) {
  const pre = path.join(TMP, `dong-ho-${ngay}.mjs`);
  writeFileSync(pre, `const T = new Date('${ngay}T09:00:00').getTime(); const D = Date; globalThis.Date = class extends D { constructor(...a) { super(...(a.length ? a : [T])); } static now() { return T; } };\n`);
  const c = path.join(TMP, `dh-${++khoN}`); execFileSync('git', ['clone', '-q', r, c]);
  const x = node(['--import', pathToFileURL(pre).href, path.join(kit, 'scripts', 'product-map.mjs'), '--root', c]);
  if (x.status !== 0) throw new Error(`bộ vẽ dưới đồng hồ ${ngay} exit ${x.status}: ${x.stderr.slice(0, 200)}`);
  return readFileSync(path.join(c, 'LO-TRINH.html'), 'utf8');
}
const KHO_95 = () => kho({ hoSo: { g: 'da-ship' }, data: { schema: 1, moc: [{ ten: 'Qua', ngay: '2026-09-01', hang: ['B'] }, { ten: 'Tới', ngay: '2026-12-01', hang: ['A'] }, { ten: 'Rời', ngay: '2026-10-04' }], hang: [H('A', { slug: 'g' }), H('B')] } });
async function lt95(kit) {
  const r = KHO_95(); const a = veDuoiDongHo(kit, r, '2026-10-03'); const b = veDuoiDongHo(kit, r, '2026-10-06');
  if (!a.length || !b.length) return ['trang rỗng'];
  if (a === b) return [];
  let i = 0; while (a[i] === b[i]) i++;
  return [`hai đồng hồ cho hai trang khác nhau, lệch ở byte ${i}: «${a.slice(i, i + 30)}» / «${b.slice(i, i + 30)}»`];
}
if (want('LT-95') && await chayCa('LT-95', lt95)) ok('LT-95', 'kho có mốc đã qua, mốc tới và mốc nằm giữa hai đồng hồ — vẽ dưới đồng hồ 03/10 và 06/10: hai trang giống từng byte (cả hai tiến trình thoát 0, trang khác rỗng)');
if (want('LT-95-do')) await chayDo('LT-95-do', lt95, [['scripts/lo-trinh.mjs', '<main>\\n${than.join', '<main>\\n<p>${new Date().toLocaleDateString(\'vi-VN\')}</p>\\n${than.join']], 'lệch ở byte', 'bản sao chèn ngày vẽ');

// ── LT-96: nhãn cột trên từng ô ─────────────────────────────────────────────
async function lt96(kit) {
  const M = await napLT(kit); const sai = []; const html = veM(M, khoTT('hai-lo-trinh'));
  const bangs = [...html.matchAll(/<table>([\s\S]*?)<\/table>/g)].map(m => m[1]);
  if (!bangs.length) return ['không có bảng'];
  for (const [n, b] of bangs.entries()) {
    const th = [...b.matchAll(/<th>([^<]*)<\/th>/g)].map(m => m[1]); const hang = [...b.matchAll(/<tr id="[^"]+">([\s\S]*?)<\/tr>/g)];
    if (!th.length || !hang.length) { sai.push(`bảng ${n + 1}: không đọc được tiêu đề cột hoặc hàng`); continue; }
    for (const tr of hang) {
      const dn = [...tr[1].matchAll(/<td data-nhan="([^"]*)">/g)].map(m => m[1]);
      if (!deq(dn, th)) { const x = dn.findIndex((v, k) => v !== th[k]); sai.push(`bảng ${n + 1}: cột «${th[x]}» mang nhãn «${dn[x]}»`); break; }
    }
  }
  return sai;
}
if (want('LT-96') && await chayCa('LT-96', lt96)) ok('LT-96', 'mọi ô của mọi bảng mang data-nhan đúng tiêu đề cột');
if (want('LT-96-do')) await chayDo('LT-96-do', lt96, [['scripts/lo-trinh.mjs', '<td data-nhan="${n}">', '<td data-nhan="${n === \'Mã\' ? \'Mã số\' : n}">']], 'cột «Mã»', 'bản sao gán nhãn lệch cột Mã');

// ── LT-97: bảng dịch câu cờ — ma trận viết sẵn từng dạng ────────────────────
// Mỗi hàng: tên dạng (khớp CO_DICH), cách kích, câu ĐÍCH viết tay (mã — câu, hoặc câu không mã).
// Câu đích KHÔNG rút từ bảng dịch; giá trị (mã, lời khai, ô, slug, hạng) nằm sẵn trong câu.
const TEN_O_97 = Object.fromEntries(PMM.SECTIONS);
const MA_TRAN_97 = [
  ['thieu-truong', () => kho({ data: { schema: 1, hang: [{ ma: 'A' }] } }), 'A — chưa có câu mô tả việc giao'],
  ['dung-tren-mang', () => kho({ data: { schema: 1, hang: [H('A', { dung_tren: 'B' })] } }), 'A — ô «cần xong trước» phải là danh sách'],
  ['khong-object', () => kho({ data: { schema: 1, hang: ['x', H('A')] } }), 'việc thứ 1 không đúng dạng'],
  ['khoi-hang', () => kho({ data: { schema: 1, hang: {} } }), 'danh sách việc phải là một mảng'],
  ['ma-trung', () => kho({ data: { schema: 1, hang: [H('T'), H('T')] } }), 'hai việc cùng mã T — đổi mã một trong hai'],
  ['moc-mang', () => kho({ data: { schema: 1, moc: [{ ten: 'M1', ngay: '2026-11-01', hang: 'A' }], hang: [H('A')] } }), 'mốc M1 — danh sách việc gắn mốc phải là một mảng'],
  ['khoi-tu-vung', () => kho({ data: { schema: 1, tu_vung: [], hang: [H('A')] } }), 'bảng từ trạng thái phải là một object'],
  ['tu-vung-tro', () => kho({ data: { schema: 1, tu_vung: { 'xong rồi': 'Hoàn tất' }, hang: [H('A')] } }), 'từ «xong rồi» trỏ «Hoàn tất» — không phải tên trạng thái'],
  ['slug-sai', () => kho({ data: { schema: 1, hang: [H('A', { slug: 'Sai Slug' })] } }), 'A — tên hồ sơ «Sai Slug» không hợp lệ'],
  ['nhieu-nhan', () => CA_73['nhieu-nguoi-nhan']().k, 'X — nhiều hồ sơ cùng nhận việc này: c1, c2'],
  ['nhan-khac', () => CA_73['ho-so-khac-nhan-S-co']().k, 'X — kế hoạch ghi hồ sơ s nhưng hồ sơ c nhận việc này'],
  ['ghi-hang-khac', () => CA_73['ho-so-ghi-ma-khac']().k, 'X — kế hoạch ghi hồ sơ s nhưng hồ sơ đó ghi việc M'],
  ['tu-khai-khong-ho-so', () => kho({ data: { schema: 1, hang: [H('A', { slug: 'vang', trang_thai: 'Đã giao' })] } }), 'A — kế hoạch ghi «Đã giao» nhưng chưa có hồ sơ vang'],
  ['khai-khac', () => kho({ hoSo: { s: 'dang-dung' }, data: { schema: 1, tu_vung: { xong: 'Đã giao' }, hang: [H('A', { slug: 's', trang_thai: 'xong' })] } }), `A — kế hoạch ghi «xong», thực tế «${TEN_O_97['dang-dung']}»`],
  ['hang-khac', () => kho({ hoSo: { s: ['dang-dung', 'T3'] }, data: { schema: 1, hang: [H('A', { slug: 's', hang: 'T2' })] } }), 'A — kế hoạch ghi hạng T2, thực tế hạng T3'],
  ['dung-tren-khong-co', () => kho({ data: { schema: 1, hang: [H('A', { dung_tren: ['Z'] })] } }), 'A — cần xong trước Z nhưng kế hoạch không có việc Z'],
  ['vong', () => kho({ data: { schema: 1, hang: [H('A', { dung_tren: ['B'] }), H('B', { dung_tren: ['A'] })] } }), 'thứ tự «cần xong trước» tạo vòng: A → B → A'],
  ['ho-so-tep', () => CA_73['tep-khong-khai']().k, 'hồ sơ c ghi kế hoạch docs/khac.json — kho không khai kế hoạch đó'],
  ['ho-so-ma', () => CA_73['ma-khong-co-hang']().k, 'hồ sơ c ghi việc Z — kế hoạch không có việc Z'],
  ['khai-hai-lan', () => kho({ khoa: false, data: { schema: 1, hang: [H('A')] }, cfgThem: 'lo_trinh:\n  tep:\n    - docs/lo-trinh.json\n    - docs/lo-trinh.json\n' }), 'kế hoạch docs/lo-trinh.json được khai hai lần trong cấu hình'],
];
const CAM_CO = ['cau_giao', 'dung_tren', 'lo_trinh_', 'tu_vung', 'tự khai', 'tệp khai khác hồ sơ', 'đứng trên', 'tệp ý định'];
const CAM_TRANG = ['tin theo lời', 'câu giao', 'hàng kế', 'Hàng kế', 'Vòng ngoài lộ trình', 'Cổng Đáng', 'tệp ý định', 'Cờ'];
// Chữ trang ngoài <code> và lệnh mở — đo trên trang dựng từ fixture crm (dữ liệu kho thử của ma trận
// mang chữ «câu giao …» do helper H sinh, không phải chữ của trang).
const chuNgoaiMa = html => chuTron(html.replace(/<style>[\s\S]*?<\/style>|<script>[\s\S]*?<\/script>|<code>[\s\S]*?<\/code>|<span class="lenh">[\s\S]*?<\/span>|<title>[\s\S]*?<\/title>/g, ' '));
async function lt97(kit) {
  const M = await napLT(kit); const sai = [];
  const ma = readFileSync(path.join(kit, 'scripts', 'lo-trinh.mjs'), 'utf8'); const khoa = readFileSync(path.join(kit, 'scripts', 'lo-trinh-khoa.cjs'), 'utf8');
  const soMa = (ma.match(/(?:co|coHang)\.push\(\s*[`']/g) || []).length + (ma.match(/dat\([^,]+,\s*`/g) || []).length + (khoa.match(/const c = `/g) || []).length;
  let phat = 0;
  for (const [ten, kich, dich] of MA_TRAN_97) {
    const r = kich(); const html = veM(M, r); const k = phanKho(M, r);
    const tho = k.cacTep.flatMap(t => (t.kq ? t.kq.co : []));
    if (tho.some(c => M.LT.dichCo(c).ten === ten)) phat += 1;
    const li = [...html.matchAll(/<ul class="co-ds">([\s\S]*?)<\/ul>/g)].flatMap(u => [...u[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => chuTron(m[1])));
    if (!li.includes(dich)) sai.push(`${ten}: trang không có «${dich}» (có ${JSON.stringify(li).slice(0, 160)})`);
    for (const x of li) for (const cam of CAM_CO) if (x.includes(cam)) sai.push(`${ten}: chỗ lệch còn «${cam}»: «${x}»`);
  }
  for (const ten of ['hai-lo-trinh', 'loi-tep', 'khong-co', 'rong']) { const ngoai = chuNgoaiMa(veM(M, khoTT(ten))); for (const cam of CAM_TRANG) if (ngoai.includes(cam)) sai.push(`${ten}: chữ trang còn «${cam}»`); }
  const so = [soMa, MA_TRAN_97.length, M.LT.CO_DICH.length, phat];
  if (!so[0] || new Set(so).size !== 1) sai.push(`số dạng: mã ${so[0]} · ma trận ${so[1]} · bảng dịch ${so[2]} · kho thử phát ${so[3]}`);
  console.log(`    · LT-97 số dạng: mã ${so[0]} · ma trận ${so[1]} · bảng dịch ${so[2]} · kho thử phát ${so[3]}`);
  return [...new Set(sai)];
}
if (want('LT-97') && await chayCa('LT-97', lt97)) ok('LT-97', `${MA_TRAN_97.length} dạng cờ: số dạng mã == ma trận == bảng dịch == kho thử phát; mỗi dạng ra đúng câu đích viết tay, không còn chữ máy; chữ trang không còn cụm nội bộ`);
if (want('LT-97-do')) await chayDo('LT-97-do', lt97, [['scripts/lo-trinh.mjs', "  { ten: 'ma-trung', re: /^mã trùng: (.+)$/, ra: m => ({ ma: null, chu: `hai việc cùng mã ${m[1]} — đổi mã một trong hai` }) },\n", '']], 'ma-trung: trang không có', 'bản sao xoá dòng dịch ma-trung');
if (want('LT-97-do2')) await chayDo('LT-97-do2', lt97, [['scripts/lo-trinh.mjs', 'chu: `kế hoạch ghi «${m[2]}», thực tế «${m[4]}»`', 'chu: `kế hoạch ghi «${m[4]}», thực tế «${m[2]}»`']], 'khai-khac: trang không có', 'bản sao đảo hai nhóm của dòng khai-khac');

// ── LT-98: tệp hỏng chỉ tắt thẻ và mục của nó ───────────────────────────────
async function lt98(kit) {
  const M = await napLT(kit); const sai = []; const html = veM(M, khoTT('loi-tep')); const the = cacThe(html);
  if (the.length !== 2) return [`${the.length} thẻ`];
  if ((the[0].match(/<span class="nhan">/g) || []).length !== 4) sai.push('thẻ OKR không đủ bốn dòng');
  if (!chuTron(the[1]).includes('Không đọc được kế hoạch docs/plan/hong.json') || !chuTron(the[1]).includes('tệp kế hoạch không phải JSON hợp lệ')) sai.push(`thẻ tệp hỏng «${chuTron(the[1]).slice(0, 100)}»`);
  if (!(mucLT(html, 1) || '').includes('Việc còn mở')) sai.push('mục OKR không có bảng việc');
  if (!(mucLT(html, 2) || '').includes('Không đọc được kế hoạch docs/plan/hong.json')) sai.push('mục tệp hỏng không có câu lỗi');
  return sai;
}
if (want('LT-98') && await chayCa('LT-98', lt98)) ok('LT-98', 'tệp hỏng: thẻ và mục của nó nêu lỗi bằng tiếng người; lộ trình kia đủ bốn dòng thẻ và bảng việc');

// ── LT-99: trang mẫu hội đồng + ảnh gắn băm ─────────────────────────────────
if (want('LT-99-mau')) {
  try {
    const x = node([path.join(HERE, 'lo-trinh-mau-trang.mjs'), '--check']);
    if (x.status === 0) ok('LT-99-mau', 'trang mẫu hội đồng == bản vẽ lại trong lượt; mau/anh.json: ảnh chụp từ đúng trang, băm ảnh khớp'); else bad('LT-99-mau', `exit ${x.status}: ${(x.stderr || x.stdout).trim()}`);
  } catch (e) { bad('LT-99-mau', loi(e)); }
}
if (want('LT-99-do')) {
  try {
    const MT = await import(pathToFileURL(path.join(HERE, 'lo-trinh-mau-trang.mjs')).href);
    const d = path.join(TMP, 'mau-sao'); cpSync(MT.MAU, d, { recursive: true });
    if (MT.kiemAnh(d).length) throw new Error(`bản sao lành không khớp: ${MT.kiemAnh(d).join(' ; ')}`);
    const p = path.join(d, MT.TRANG); writeFileSync(p, readFileSync(p, 'utf8').replace('</main>', '</main> '));
    const s = MT.kiemAnh(d); const g = s.find(m => m.startsWith('ảnh chụp từ trang khác'));
    if (g) ok('LT-99-do', `đổi một byte trang mẫu sau khi chụp: «${g.slice(0, 90)}»`); else bad('LT-99-do', `không bắt: ${JSON.stringify(s)}`);
  } catch (e) { bad('LT-99-do', loi(e)); }
}

// ── LT-100: lớp phân tích không đổi so với 2.21.0 ───────────────────────────
let goc2210 = null;
function bo2210() {
  if (goc2210) return goc2210;
  const d = path.join(TMP, 'goc-2210'); mkdirSync(d, { recursive: true });
  execFileSync('tar', ['-x', '-C', d], { input: execFileSync('git', ['-C', KIT, 'archive', '--format=tar', 'v2.21.0', 'scripts', 'lib', 'skills'], { maxBuffer: 1 << 28 }) });
  return (goc2210 = d);
}
// Kết quả lớp phân tích, bỏ Set (daGiao) cho JSON ổn định.
const phanJson = (M, r) => JSON.stringify(phanKho(M, r), (k, v) => (v instanceof Set ? [...v] : v));
async function lt100(kit) {
  const B = await napLT(bo2210()); const M = await napLT(kit); const sai = [];
  for (const ten of ['hai-lo-trinh', 'loi-tep', 'khong-co']) {
    const r = khoTT(ten);
    const kb = phanKho(B, r); const km = phanKho(M, r);
    if (!km.cacTep.some(t => t.kq && t.kq.dong.length)) sai.push(`${ten}: đối chứng — cây đang kiểm không có hàng nào`);
    if (phanJson(B, r) !== phanJson(M, r)) {
      const lech = km.cacTep.flatMap((t, i) => (t.kq ? t.kq.dong.filter((d, n) => JSON.stringify(d) !== JSON.stringify(kb.cacTep[i]?.kq?.dong[n])).map(d => `${t.tep}:${d._nhan} (${d.chu})`) : []));
      sai.push(`${ten}: lớp phân tích khác 2.21.0 — hàng lệch ${lech.slice(0, 4).join(', ') || '(không ở hàng)'}`);
    }
    const jb = JSON.parse(quet(r, { ACCEPTANCE_TODAY: '2026-10-03' }, bo2210()).stdout).loTrinh;
    const jm = JSON.parse(quet(r, { ACCEPTANCE_TODAY: '2026-10-03' }, kit).stdout).loTrinh;
    // Dòng «vẽ bằng: node <bộ máy>/scripts/product-map.mjs» mang đường của bộ máy chạy — thay bằng <kit>.
    const bo = (j, k) => [realpathSync(k), k].reduce((x, g) => x.split(g).join('<kit>'), JSON.stringify({ ...j, trang: null }));
    if (bo(jb, bo2210()) !== bo(jm, kit)) sai.push(`${ten}: loTrinh của JSON quét khác 2.21.0`);
  }
  return sai;
}
if (want('LT-100') && await chayCa('LT-100', lt100)) ok('LT-100', 'hai lộ trình · tệp hỏng · không chỗ lệch: phanTichKho và loTrinh của JSON quét giống hệt bộ máy v2.21.0 (git archive trọn thư mục)');
if (want('LT-100-do')) await chayDo('LT-100-do', lt100, [['scripts/lo-trinh.mjs', "export const CHUA_MO = 'Chưa mở';", "export const CHUA_MO = 'Chưa bắt đầu';"]], 'hàng lệch docs/plan/lo-trinh-okr.json:', 'bản sao đổi chữ trạng thái «Chưa mở» của lớp phân tích');


rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (lo-trinh)`);
process.exit(fail ? 1 : 0);
