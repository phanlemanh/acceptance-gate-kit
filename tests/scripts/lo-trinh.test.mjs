// lo-trinh.test.mjs — hồ sơ viec-ke-theo-plan (lát 1 lộ trình vào kit), ca LT-01…LT-13.
// Mỗi eval của evals.yaml ghim đúng dòng «PASS: LT-…» của tệp này.
//
// Kho thử do CODE sinh trong lượt (git init trong thư mục tạm, hồ sơ dựng bằng hàm `hoSo`). Tệp ý
// định là INPUT người viết, nên ba lộ trình thật nằm ở fixtures/lo-trinh/*.json (rút từ nguồn,
// khối `_nguon` ghi số đo của nguồn). Ca đỏ chạy trên BẢN SAO của vật (`banSao`) với nhát tiêm
// được kiểm đúng một lần thay, SAU khi bản lành xanh trên cùng fixture; thông điệp ghim.
// Mọi đường dẫn suy từ vị trí tệp này. Không ca nào ghi vào cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, rmSync, statSync, readdirSync } from 'node:fs';
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
  'cho-duyet': (s) => ({ 'contract.md': HD(s, 'draft') }),
  'dang-dung': (s, t) => ({ 'contract.md': HD(s, 'approved', t) }),
  'da-ship': (s) => ({ 'contract.md': HD(s, 'signed-off'), 'evidence-report.md': EV(s) }),
  'cho-nghiem-thu': (s) => ({ 'contract.md': HD(s, 'signed-off'), 'evidence-report.md': EV(s), 'opportunity.md': OPP('decided', 'build') }),
  'da-nghiem-thu': (s) => ({ 'contract.md': HD(s, 'signed-off'), 'evidence-report.md': EV(s), 'opportunity.md': OPP('decided', 'build'), 'uat-session.md': UAT(s) }),
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
      ['scripts/lo-trinh.mjs', '  if (tep == null) return null;\n  const { loi, data } = docTep(root, tep);', "  if (tep == null) return { tep: '(vắng)', loi: 'giả', kq: null };\n  const { loi, data } = docTep(root, tep);"],
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
  // Slug dự kiến CÓ tự khai: bảng design §Trạng thái nói không cờ — không có hồ sơ nào để «khác».
  const dkk = kq.dong.find(x => x.ma === 'du-kien-khai');
  if (dkk.chu !== 'Chưa mở' || dkk.co.length) sai.push(`slug dự kiến có tự khai: ${JSON.stringify(dkk)}`);
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
    const mut = banSao([['scripts/lo-trinh.mjs', 'if (coHoSo && khaiChuan && khaiChuan !== chu)', 'if (!tinTheoLoi && khaiChuan && khaiChuan !== chu)']]);
    const sai = lt04(path.join(mut, 'scripts'));
    const g = sai.find(s => s.startsWith('slug dự kiến có tự khai:') && s.includes('tệp khai khác hồ sơ: khai Đã giao, hồ sơ Chưa mở'));
    if (g) ok('LT-04-do2', `bản sao so lời khai khi không có hồ sơ → đỏ: «${g.slice(0, 120)}»`); else bad('LT-04-do2', `phép đo không bắt: ${JSON.stringify(sai)}`);
  } catch (e) { bad('LT-04-do2', loi(e)); }
}
if (want('LT-04-do')) {
  try {
    const mut = banSao([['scripts/lo-trinh.mjs', 'chu = TEN[xep(slug).key];', "chu = xep(slug).key === 'dang-dung' ? 'Đang chạy' : TEN[xep(slug).key];"]]);
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
const coTrang = html => { const i = html.indexOf('<h2>Cờ</h2>'); return [...html.slice(i).matchAll(/<li class="co">([^<]*)<\/li>/g)].map(m => m[1].replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')); };
if (want('LT-05')) {
  try {
    const r = LT05(); const kq = phan(r).kq; const html = LT.renderTrang(kq, 'docs/lo-trinh.json'); const sai = [];
    const mong = ['hàng r1: tệp khai khác hồ sơ: khai Đã giao, hồ sơ Đang làm'];
    if (!deq(kq.co, mong)) sai.push(`cờ ${JSON.stringify(kq.co)}`);
    if (kq.dong[0].chu !== 'Đang làm') sai.push(`r1 in «${kq.dong[0].chu}»`);
    if (!html.includes('tự khai: đã lên onehub')) sai.push('trang không in «tự khai: đã lên onehub»');
    if (kq.tuKhaiNgoai !== 1) sai.push(`tuKhaiNgoai ${kq.tuKhaiNgoai}`);
    if (sai.length) bad('LT-05', sai.join(' ; ')); else ok('LT-05', `hàng lệch có đúng cờ «${mong[0]}», hàng trùng 0 cờ, hàng ngoài từ vựng in «tự khai: …»`);
  } catch (e) { bad('LT-05', loi(e)); }
}
if (want('LT-05-the')) {
  try {
    const r = LT05(); node([PM, '--root', r]);
    const html = readFileSync(path.join(r, 'LO-TRINH.html'), 'utf8');
    const j = JSON.parse(quet(r, { ACCEPTANCE_TODAY: '2026-10-02' }).stdout); const sai = [];
    if (!deq(j.loTrinh.co, coTrang(html))) sai.push(`thẻ ${JSON.stringify(j.loTrinh.co)} != trang ${JSON.stringify(coTrang(html))}`);
    const m = html.match(/(\d+) hàng tự khai ngoài từ vựng — không so được với hồ sơ/);
    if (!m || Number(m[1]) !== j.loTrinh.tuKhaiNgoai) sai.push(`dòng ngoài từ vựng trang ${m && m[1]} != thẻ ${j.loTrinh.tuKhaiNgoai}`);
    if (sai.length) bad('LT-05-the', sai.join(' ; ')); else ok('LT-05-the', `thẻ và trang cùng một danh sách cờ (${j.loTrinh.co.length}) và cùng số tự khai ngoài từ vựng (${j.loTrinh.tuKhaiNgoai})`);
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
    if (/<script|src=|href="?https?:/i.test(a)) sai.push('trang có script hoặc tài nguyên ngoài');
    if (a.includes(new Date().toISOString().slice(0, 10))) sai.push('trang chứa ngày chạy');
    if (!a.includes('&lt;b&gt;&amp;&quot;') || a.includes('<b>&"')) sai.push('câu giao không được escape');
    const c = node([PM, '--root', r, '--check']);
    if (c.status !== 0 || !c.stdout.includes('LO-TRINH.html khớp tệp ý định và hồ sơ.')) sai.push(`--check exit ${c.status}: ${c.stdout} ${c.stderr}`);
    if (sai.length) bad('LT-06', sai.join(' ; ')); else ok('LT-06', 'hai lần vẽ cùng byte, không script/tài nguyên ngoài/ngày chạy, escape đúng, --check khớp');
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
    if (!html.includes(ly.replace(/&/g, '&amp;'))) sai.push(`trang không nêu «${ly}»`);
    const s = quet(r); const j = JSON.parse(s.stdout);
    if (!j.loTrinh || !String(j.loTrinh.loi).includes(ly)) sai.push(`loTrinh.loi «${j.loTrinh && j.loTrinh.loi}»`);
    if (/\n\s+at /.test(s.stderr)) sai.push('start-scan stderr có stack trace');
    if (sai.length) bad(`LT-08 ${ten}`, sai.join(' ; ')); else ok(`LT-08 ${ten}`, `product-map exit 0, trang và thẻ cùng nêu «${ly}»`);
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
    if (!html.includes('Hàng sống qua Cổng Đáng: <b>2/3</b>')) sai.push('trang không in 2/3');
    const i = html.indexOf('<h2>Vòng ngoài lộ trình</h2>'); const khoi = html.slice(i, html.indexOf('<h2>', i + 5));
    if (!khoi.includes('<code>ngoai1</code>') || !khoi.includes('<code>ngoai2</code>') || khoi.includes('class="co"')) sai.push('khối vòng ngoài lộ trình sai');
    if (!html.includes('Mùa OKR') || !html.includes('x9 — Trùng với hàng 2')) sai.push('thiếu mốc hoặc mục đã bác');
    if (kq.co.length) sai.push(`có cờ ${JSON.stringify(kq.co)}`);
    if (sai.length) bad('LT-11', sai.join(' ; ')); else ok('LT-11', 'vòng ngoài lộ trình [ngoai1, ngoai2] không cờ; mốc và đã bác đủ; hàng sống qua Cổng Đáng 2/3 (slug trỏ hai lần đếm một)');
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
  for (const d of ['scripts', 'lib']) cpSync(path.join(KIT, d), path.join(v, d), { recursive: true });
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
    const thieu = ['không khớp mẫu', 'mọi mã thoát khác 0', 'mô tả việc'].filter(c => !doan.includes(c));
    if (!thieu.length) ok('LT-18-luat', 'đoạn S0 nói đối số không khớp mẫu và mọi mã thoát khác 0 là mô tả việc'); else bad('LT-18-luat', `đoạn S0 thiếu: ${thieu.join(', ')}`);
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

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (lo-trinh)`);
process.exit(fail ? 1 : 0);
