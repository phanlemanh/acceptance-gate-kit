// lo-trinh.test.mjs — hồ sơ viec-ke-theo-plan (lát 1 lộ trình vào kit), ca LT-01…LT-18, và hồ sơ
// lo-trinh-tren-du-lieu-that (vòng sửa trên dữ liệu thật), ca LT-70…LT-84; trang-lo-trinh-doc-mot-phut,
// LT-90…LT-100; xuat-du-lieu-lo-trinh (khối dữ liệu máy đọc, hàng X1), LT-110…LT-120;
// lo-trinh-cat-luot (răng phủ, nhịp, skill cắt lượt, bước kế), LT-130…LT-141; vong-la-mot-ket-qua
// (khoảng cỡ một nguồn, cờ cỡ + dáng câu giao, đồng hồ cỡ), LT-142…LT-150; trang-ho-so-mot-viec
// (trang hồ sơ một việc + khối dữ liệu bản 2 + bỏ một cặp «», hàng X2), LT-151…LT-162; lo-trinh-chi-viec-
// phat-trien (mốc ngoài trong bảng phủ, bốn cờ vận hành/dữ liệu giả, SKILL tách vận hành, hàng S3b), LT-163…LT-171.
// Mỗi eval của evals.yaml ghim đúng dòng «PASS: LT-…» của tệp này.
//
// Kho thử do CODE sinh trong lượt (git init trong thư mục tạm, hồ sơ dựng bằng hàm `hoSo`). Tệp ý
// định là INPUT người viết, nên ba lộ trình thật nằm ở fixtures/lo-trinh/*.json (rút từ nguồn,
// khối `_nguon` ghi số đo của nguồn). Ca đỏ chạy trên BẢN SAO của vật (`banSao`) với nhát tiêm
// được kiểm đúng một lần thay, SAU khi bản lành xanh trên cùng fixture; thông điệp ghim.
// Mọi đường dẫn suy từ vị trí tệp này. Không ca nào ghi vào cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, appendFileSync, readFileSync, existsSync, cpSync, rmSync, statSync, readdirSync, realpathSync } from 'node:fs';
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
// moc-la-chien-dich AC-7: JSON của --mo-o mang thêm moc/ten_phien/nhom SAU hai khoá cũ — các ca LT-73/74/75 giữ lời hứa về hai khoá
// cũ (thứ tự + giá trị) bằng cách rút đúng hai khoá đầu; ba khoá mới do moc-chien-dich.test.mjs (MC-7) đo.
const hoMoi = out => { try { const j = JSON.parse(out); return JSON.stringify(Object.fromEntries(Object.entries(j).slice(0, 2))); } catch { return out.trim(); } };
// Script CHẠY ĐƯỢC trên trang: mọi thẻ <script trừ ĐÚNG MỘT khối dữ liệu `type="application/json"` của
// hồ sơ xuat-du-lieu-lo-trinh (trình duyệt không chạy khối đó). Hai khối dữ liệu → đếm thừa, vẫn đỏ.
const soScriptChay = h => (h.match(/<script/g) || []).length - Math.min(1, (h.match(/<script type="application\/json" id="lo-trinh-du-lieu">/g) || []).length);

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
// Hồ sơ moc-la-chien-dich (nấc 1 ADR 0025) thêm hai cờ vàng ở `phanTichKho` — đổi CÓ CHỦ Ý. Các ca so «giống
// bộ máy đời trước» của hồ sơ đã ký so bộ máy cũ với CÂY TẮT ĐÚNG hai khối cờ đó (bản sao, nhát tiêm khớp một
// lần), nên lời hứa gốc «mọi thứ khác không đổi» giữ nguyên nghĩa; hai khối mới do moc-chien-dich.test.mjs đo.
// ra-soat-lo-trinh (hàng RM1) thêm nhát thứ ba: tắt khối rà soát trên thẻ start — các ca so «giống bộ máy đời trước» so với
// cây tắt đúng ba khối mới, lời hứa gốc (phần còn lại không đổi) giữ nguyên nghĩa.
const TAT_MC = [['scripts/lo-trinh.mjs', 'if (docDuoc.some(t => t.kq.moc.length)) {', 'if (false) {'],
  ['scripts/lo-trinh.mjs', 'if (!daNoi.has(s) && NHOM_MO.includes(', 'if (false && NHOM_MO.includes('],
  ['scripts/lo-trinh.mjs', 'ds.forEach((t, i) => { if (rs[i] && rs[i].de_xuat.length) t.raSoat = rs[i].de_xuat; if (rs[i] && rs[i].canh_bao) t.raSoatCanh = rs[i].canh_bao; });', 'ds.forEach((t, i) => { if (false) t.raSoat = rs[i].de_xuat; });'],
  // lo-trinh-gio-may (hàng RM6) thêm nhát thứ tư: tắt phần giờ máy (cột, dòng đếm, dòng mốc) — giờ máy hiện mặc định ở mọi kho.
  ['scripts/lo-trinh.mjs', 'for (const t of docDuoc) gangGioMay(t.kq, doVong, duBaoDs);', 'for (const t of []) gangGioMay(t.kq, doVong, duBaoDs);'],
  // lo-trinh-du-lieu-ngay-du-kien (hàng RM6c) thêm nhát thứ năm: bỏ bốn khoá giờ máy khỏi khối dữ liệu (chúng có mặt — null —
  // cả khi lớp giờ máy tắt); trang mẫu đã ký của hồ sơ khác giữ nguyên, khoá mới do lo-trinh-du-lieu-ngay.test.mjs đo.
  ['scripts/lo-trinh.mjs', 'id="${ID_DU_LIEU}">${JSON.stringify(o).replace', "id=\"${ID_DU_LIEU}\">${JSON.stringify(o, (k, v) => (['gio_may', 'du_kien', 'qua_tai'].includes(k) ? undefined : v)).replace"]];
const tatCache = new Map();
// road-map-de-dung (RD1) đổi CÓ CHỦ Ý trang, khối dữ liệu, bản xem chữ, thẻ khởi động và giờ máy: các ca «giống bộ máy đời trước»
// so trên cây TẮT thêm đúng các khối RD1 (tests/scripts/tat-rd1.mjs, tự kiểm bằng ca RD-tat) — áp trước, rồi tới năm nhát TAT_MC.
const { tatRD1 } = await import(pathToFileURL(path.join(HERE, 'tat-rd1.mjs')).href);
const tatMC = goc => { if (!tatCache.has(goc)) tatCache.set(goc, banSao(TAT_MC, goc === KIT ? tatRD1(KIT) : goc)); return tatCache.get(goc); };

// ── Chuẩn hoá so với bộ máy ĐỜI TRƯỚC hàng X2 (hồ sơ trang-ho-so-mot-viec) ─────────────────────────
// Hàng X2 đổi CÓ CHỦ Ý hai thứ: câu giao in ra đã bỏ đúng một cặp «» bao trọn câu, và lớp phân tích mang
// thêm `tomTat` + `_cauGiaoGoc`. Các ca so «giống bộ máy trước vòng» của hồ sơ đã ký đi qua ĐÚNG phép
// chuẩn hoá dưới đây ở cả hai bên — lời hứa gốc của từng ca (phần còn lại không đổi) giữ nguyên nghĩa.
// Phép bỏ ngoặc rút từ CHÍNH mô-đun của cây (không chép tay luật).
const HS_X2 = createRequire(import.meta.url)(path.join(KIT, 'scripts', 'ho-so-tom-tat.cjs'));
const escX2 = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Trang: mọi câu giao bọc trọn của các tệp kế hoạch trong kho r → bản đã bỏ ngoặc (bên cũ in câu gốc).
function cauGiaoKho(r) {
  const cau = [];
  for (const f of readdirSync(r, { recursive: true }).map(String).filter(f => /\.json$/.test(f) && !f.includes('node_modules') && !f.startsWith('.git'))) {
    try { const d = JSON.parse(readFileSync(path.join(r, f), 'utf8')); for (const h of Array.isArray(d.hang) ? d.hang : []) if (h && typeof h.cau_giao === 'string') cau.push(h.cau_giao); } catch (_) { /* không phải tệp kế hoạch */ }
  }
  return [...new Set(cau)].sort((a, b) => b.length - a.length);
}
// `ma` = cách câu hiện trong văn bản: HTML (thoát &<>") hoặc chuỗi JSON (thoát như JSON.stringify).
const thayCauX2 = (txt, r, ma) => { let o = txt; for (const c of cauGiaoKho(r)) { const b = HS_X2.boNgoacNgoai(c); if (b !== c) o = o.split(ma(c)).join(ma(b)); } return o; };
const trangX2 = (html, r) => (html == null ? html : thayCauX2(html, r, escX2));
const jsonX2 = (txt, r) => thayCauX2(txt, r, c => JSON.stringify(c).slice(1, -1));
// Dữ liệu: bỏ khoá chỉ hàng X2 có, và bỏ ngoặc mọi chuỗi ở cả hai bên.
const duLieuX2 = v => JSON.parse(JSON.stringify(v, (k, x) => (k === 'tomTat' || k === '_cauGiaoGoc' || k === 'tom_tat' ? undefined : x instanceof Set ? [...x] : typeof x === 'string' ? HS_X2.boNgoacNgoai(x) : x)));

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
    // moc-la-chien-dich AC-3: hồ sơ «khac» đang dựng mà không hàng nào trỏ nay mang cờ hồ-sơ-ngoài-kế-hoạch.
    const mong = ['hàng r1: tệp khai khác hồ sơ: khai Đã giao, hồ sơ Đang làm', 'hồ sơ khac đang mở mà không thuộc việc nào trong kế hoạch'];
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
    if (/ src=|href="?https?:/i.test(a) || soScriptChay(a) > 1) sai.push('trang có tài nguyên ngoài hoặc hơn một script');
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
    const x = node([path.join(HERE, 'lo-trinh-mau.mjs'), '--check'], { env: { ...process.env, LO_TRINH_MAY: tatMC(KIT) } });
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
    // moc-la-chien-dich AC-1/AC-3 thay vế «vòng ngoài lộ trình không cờ» của ca này: kho dùng mốc → hàng 1b, 2 có
    // hồ sơ đang mở ngoài mốc; ngoai1 (đang dựng), ngoai2 (cân nhắc) là hồ sơ đang mở không thuộc việc nào.
    const mong11 = ['hàng 1b: đang mở vòng mà chưa thuộc mốc nào', 'hàng 2: đang mở vòng mà chưa thuộc mốc nào', 'hồ sơ ngoai1 đang mở mà không thuộc việc nào trong kế hoạch', 'hồ sơ ngoai2 đang mở mà không thuộc việc nào trong kế hoạch'];
    if (!deq(kq.co, mong11)) sai.push(`cờ ${JSON.stringify(kq.co)}`);
    if (sai.length) bad('LT-11', sai.join(' ; ')); else ok('LT-11', 'vòng ngoài lộ trình [ngoai1, ngoai2] mang cờ hồ sơ ngoài kế hoạch, 1b + 2 cờ ngoài mốc (moc-la-chien-dich), trang gập «2 hồ sơ không thuộc kế hoạch nào»; mốc và đã bác đủ; hàng sống qua Cổng Đáng 2/3 (slug trỏ hai lần đếm một)');
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
// Kho đã chép bộ vẽ vào scripts/ (lớp chép CI) thì bộ vẽ của kho thắng bản gói: CI của kho chạy --check bằng
// bản chép, nên vẽ lại bằng bản gói khác phiên bản là trang lệch (ca thật: crm-onehub 80464092f, khối dữ liệu
// LO-TRINH.html thiếu «mốc hiện» khi gói cài 2.32.0 cũ hơn bản chép). Hai bộ vẽ giả ký tên vào PRODUCT-MAP.md,
// nên phép đo đọc thẳng ai đã vẽ; gói giả đứng thay ${CLAUDE_PLUGIN_ROOT} như harness thay.
const VE_GIA = ten => `import { writeFileSync } from 'node:fs';\nwriteFileSync('PRODUCT-MAP.md', 've-boi: ${ten}\\n');\n`;
function lt16Ban(lenh, coBanKho) {
  const r = kho({ hoSo: { p1: 'dang-dung' }, data: { schema: 1, hang: [H('1', { slug: 'p1' })] } });
  const goi = path.join(TMP, `goi-gia-${++khoN}`); mkdirSync(path.join(goi, 'scripts'), { recursive: true });
  writeFileSync(path.join(goi, 'scripts', 'product-map.mjs'), VE_GIA('ban-goi'));
  if (coBanKho) { mkdirSync(path.join(r, 'scripts'), { recursive: true }); writeFileSync(path.join(r, 'scripts', 'product-map.mjs'), VE_GIA('ban-kho')); }
  const env = { ...process.env }; delete env.AG; delete env.CLAUDE_PLUGIN_ROOT;
  const x = spawnSync('bash', ['-c', lenh.split('${CLAUDE_PLUGIN_ROOT}').join(goi)], { cwd: r, encoding: 'utf8', env });
  const ve = existsSync(path.join(r, 'PRODUCT-MAP.md')) ? readFileSync(path.join(r, 'PRODUCT-MAP.md'), 'utf8').trim() : '';
  const staged = git(r, 'diff', '--cached', '--name-only').split('\n').includes('PRODUCT-MAP.md');
  return { x, ve, staged };
}
const UU_TIEN_KHO = 'PMAP=scripts/product-map.mjs && { [ -f "$PMAP" ] || PMAP="$AG/scripts/product-map.mjs"; } && node "$PMAP"';
if (want('LT-16-ban-kho')) {
  try {
    const that = khoiMap(readFileSync(path.join(KIT, THAN.signoff[0]), 'utf8'));
    const lanh = lt16Ban(that, true);
    if (!(lanh.x.status === 0 && lanh.ve === 've-boi: ban-kho' && lanh.staged)) bad('LT-16-ban-kho', `khối MAP-STAGE vẽ bằng bản của gói dù kho có scripts/product-map.mjs — exit ${lanh.x.status} «${lanh.ve}» staged ${lanh.staged} stderr «${lanh.x.stderr.trim().slice(0, 140)}»`);
    else {
      if (that.split(UU_TIEN_KHO).length !== 2) throw new Error(`khối không chứa đúng một «${UU_TIEN_KHO}» để tiêm`);
      const hong = lt16Ban(that.replace(UU_TIEN_KHO, 'node "$AG/scripts/product-map.mjs"'), true);
      if (hong.ve === 've-boi: ban-goi') ok('LT-16-ban-kho', 'kho có scripts/product-map.mjs khác gói → khối vẽ bằng bản kho; bản sao khối luôn gọi bản gói → vẽ bằng bản gói');
      else bad('LT-16-ban-kho', `bản sao khối luôn gọi bản gói mà PRODUCT-MAP.md vẫn «${hong.ve}» — phép đo không phân biệt được hai bộ vẽ`);
    }
  } catch (e) { bad('LT-16-ban-kho', loi(e)); }
}
if (want('LT-16-ban-goi')) {
  try {
    const that = khoiMap(readFileSync(path.join(KIT, THAN.signoff[0]), 'utf8'));
    const lanh = lt16Ban(that, false);
    if (!(lanh.x.status === 0 && lanh.ve === 've-boi: ban-goi' && lanh.staged)) bad('LT-16-ban-goi', `khối MAP-STAGE không rơi về bộ vẽ của gói khi kho thiếu scripts/product-map.mjs — exit ${lanh.x.status} «${lanh.ve}» staged ${lanh.staged} stderr «${lanh.x.stderr.trim().slice(0, 140)}»`);
    else {
      if (that.split(UU_TIEN_KHO).length !== 2) throw new Error(`khối không chứa đúng một «${UU_TIEN_KHO}» để tiêm`);
      const hong = lt16Ban(that.replace(UU_TIEN_KHO, 'node scripts/product-map.mjs'), false);
      const ghim = /Cannot find module .*scripts\/product-map\.mjs/;
      if (hong.x.status !== 0 && ghim.test(hong.x.stderr)) ok('LT-16-ban-goi', `kho không có bản chép → khối vẽ bằng bản gói; bản sao khối bỏ đường rơi về gói → đỏ «${(hong.x.stderr.match(ghim) || [''])[0].slice(0, 80)}»`);
      else bad('LT-16-ban-goi', `bản sao khối bỏ đường rơi về gói mà không đỏ đúng lỗi thiếu bộ vẽ — exit ${hong.x.status} «${hong.x.stderr.trim().slice(0, 140)}»`);
    }
  } catch (e) { bad('LT-16-ban-goi', loi(e)); }
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
  const r = kho({ data: { schema: 1, moc: [{ ten: 'M1', ngay: '2026-10-01', loai: 'phat-hanh', hang: 'F' }, { ten: 'M2', ngay: '2026-10-01', loai: 'phat-hanh', hang: ['F'] }],
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
const loiPhan = async (kit, r) => { const kq = phanBang(await napLT(kit), r).kq; return JSON.stringify(duLieuX2({ dong: kq.dong.map(d => [d._nhan, d.chu, !!d.tinTheoLoi, d.coHang]), co: kq.co, hangKe: kq.hangKe && [kq.hangKe.ma, kq.hangKe.cauGiao], ngoai: kq.ngoaiLoTrinh })); };
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
  // RD1 (luật chỉ việc phát triển) thêm cờ gom có chủ ý — đo ở road-map-de-dung.test.mjs; tổng ở đây đếm cờ đời trước.
  const coCu = kq.co.filter(c => !(M.LT.CO_PHAT_TRIEN || []).some(t => c.startsWith(`cờ ${t}:`)));
  if (coCu.length !== 8) sai.push(`tổng ${coCu.length} != 8`);
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
      if (x.status !== 0 || hoMoi(x.stdout) !== '{"hoSo":"c","moi":false}') sai.push(`--mo-o exit ${x.status} «${x.stdout.trim()}» ${x.stderr.trim()}`);
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
    const r = KHO_73_KT(); const moi = await loiPhan(tatMC(KIT), r); const cu = await loiPhan(banGoc(), r);
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
  if (hoMoi(x.stdout) !== '{"hoSo":"no-sau-7","moi":true}') sai.push(`stdout «${x.stdout.trim()}»`);
  const p = path.join(r, '_acceptance', 'no-sau-7', 'opportunity.md'); if (!existsSync(p)) return { sai: [...sai, 'không có tệp'] };
  const t = readFileSync(p, 'utf8'); const tpl = readFileSync(path.join(kit, 'skills', 'acceptance', 'references', 'opportunity-template.md'), 'utf8');
  const can = khoaFm(khoiTpl(tpl, 'OPP-FRONTMATTER-TEMPLATE').replace(/^```yaml\n/, '')); const co = khoaFm(t);
  const thieu = can.filter(k => !co.includes(k)); if (thieu.length) sai.push(`thiếu khoá khuôn ${thieu}`);
  if (!t.startsWith('---\n')) sai.push('tệp không bắt đầu bằng ---');
  for (const [k, v] of [['stage', 'discovery'], ['decision', ''], ['feature', 'câu giao 7n'], ['lo_trinh_ma', '7n'], ['lo_trinh_tep', 'docs/lo-trinh.json'], ['owner', 'x@y.z']]) if (fmCua(t, k) !== v) sai.push(`${k}: «${fmCua(t, k)}»`);
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
    'da-co-ho-so': () => { const r = kho({ hoSo: { s1: 'sap-mo' }, data: { schema: 1, hang: [H('1', { slug: 's1' })] } }); return { r, a: ['--hang', '1', '--mo-o'], kiem: x => (x.status === 0 && hoMoi(x.stdout) === '{"hoSo":"s1","moi":false}' ? null : `exit ${x.status} «${x.stdout.trim()}»`), giu: true }; },
    'dich-da-co': () => { const r = kho({ data: { schema: 1, hang: [H('1')] } }); mkdirSync(path.join(r, '_acceptance', 'da-co'), { recursive: true }); writeFileSync(path.join(r, '_acceptance', 'da-co', 'ghi-chu.md'), 'x\n'); return { r, a: ['--hang', '1', '--mo-o', '--slug', 'da-co'], kiem: x => (x.status === 2 && x.stderr.includes(path.join('_acceptance', 'da-co')) ? null : `exit ${x.status} «${x.stderr.trim()}»`), giu: true }; },
    'thieu-slug': () => { const r = kho({ data: { schema: 1, hang: [{ ma: '1', cau_giao: 'Đặt OKR cho Bộ phận trong CRM ngay bây giờ' }] } }); return { r, a: ['--hang', '1', '--mo-o'], kiem: x => (x.status === 0 && hoMoi(x.stdout) === '{"hoSo":"dat-okr-cho-bo-phan-trong","moi":true}' && existsSync(path.join(r, '_acceptance', 'dat-okr-cho-bo-phan-trong', 'opportunity.md')) ? null : `exit ${x.status} «${x.stdout.trim()}» ${x.stderr.trim()}`), giu: false }; },
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
    'da-co-ho-so': () => ({ r: kho({ hoSo: { n7: 'sap-mo' }, data: { schema: 1, hang: [H('7n', { slug: 'n7' })] } }), ma: '7n', mong: x => { if (x.status !== 0) return false; const j = JSON.parse(x.stdout); // moc-la-chien-dich AC-7: thêm moc/ten_phien/nhom, hai khoá cũ giữ nguyên chỗ
      return deq(Object.keys(j).slice(0, 2), ['hoSo', 'moi']) && j.hoSo === 'n7' && j.moi === false; }, giu: true }),
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
  // RD1: so trên cây tắt đúng các khối RD1 (mốc chưa khai loại nay thêm cờ gom — đổi có chủ ý, đo ở road-map-de-dung.test.mjs).
  try { const sai = await lt77(tatMC(KIT)); if (sai.length) bad('LT-77 mot-tep-byte', sai.join(' ; ')); else ok('LT-77 mot-tep-byte', `kho một tệp: lớp phân tích giống hệt bộ máy ${GOC_VONG}, trang được vẽ; thêm hàng thì hai bản cùng đổi`); } catch (e) { bad('LT-77 mot-tep-byte', loi(e)); }
}
if (want('LT-77-do')) {
  try {
    const sai = await lt77(banSao([['scripts/lo-trinh.mjs', "const ke = dong.find(d => chuaLam.has(d.chu) && duDieuKien(d)) || null;", 'const ke = dong[0] || null;']], tatMC(KIT)));
    const g = sai.find(m => m === 'một tệp: lớp phân tích khác bản trước vòng');
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
// RD1 (luật chỉ việc phát triển, 17/10): mốc chưa khai loại lên thẻ thành một dòng `  ! ` — đổi có chủ ý, đo ở road-map-de-dung.test.mjs.
const CAU_LOAI_79 = k => `  ! ${k} — mốc phát triển khai loai (phat-hanh, han, han-cung, su-kien); việc của người không còn là mốc (luật 17/10)`;
const DONG_79 = r => ['Hàng kế: B — câu giao B', 'Hàng trễ: B (mốc m1, 2026-01-01) (1/2 mốc không gắn hàng nào)', 'Tin theo lời: 1/2 hàng', 'Lộ trình có 1 cờ — xem trang lộ trình', CAU_LOAI_79('2 mốc chưa khai loại: m1 01/01, m2 01/12')];
if (want('LT-79')) {
  const PMP = path.join(KIT, 'scripts', 'product-map.mjs');
  const CA = {
    'trang-co': () => { const r = kho({ hoSo: { a: 'da-ship' }, data: D79 }); node([PM, '--root', r]); return { r, mong: [...DONG_79(r), `Trang lộ trình: [LO-TRINH.html](${path.join(r, 'LO-TRINH.html')})`] }; },
    'trang-vang': () => { const r = kho({ hoSo: { a: 'da-ship' }, data: D79 }); return { r, mong: [...DONG_79(r), `Trang lộ trình chưa được vẽ — vẽ bằng: \`node ${PMP} --root .\``] }; },
    'ban-do-chua-bat': () => { const r = kho({ hoSo: { a: 'da-ship' }, data: D79, t1: ['LO-TRINH.html'] }); node([PM, '--root', r]); return { r, mong: [...DONG_79(r), `Trang lộ trình: [LO-TRINH.html](${path.join(r, 'LO-TRINH.html')})`, '⚠ Lộ trình đã khai nhưng bản đồ sản phẩm chưa bật — bốn lệnh đóng cổng sẽ không vẽ lại trang; bật bằng hai dòng trong `_acceptance/config.yaml`'] }; },
    'moc-khong-hang': () => { const r = kho({ hoSo: { a: 'da-ship' }, data: { ...D79, moc: [{ ten: 'm1', ngay: '2026-01-01', hang: ['B'] }] } }); node([PM, '--root', r]); return { r, mong: ['Hàng kế: B — câu giao B', 'Hàng trễ: B (mốc m1, 2026-01-01)', 'Tin theo lời: 1/2 hàng', 'Lộ trình có 1 cờ — xem trang lộ trình', CAU_LOAI_79('1 mốc chưa khai loại: m1 01/01'), `Trang lộ trình: [LO-TRINH.html](${path.join(r, 'LO-TRINH.html')})`] }; },
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
  // moc-la-chien-dich AC-4: kho không khai nay mang khoá loTrinhChuaKhai (một câu cờ — MC-4 đo); bỏ đúng khoá đó trước khi so.
  const sc = (k, r) => { const x = node([path.join(k, 'scripts', 'start-scan.mjs'), '--root', r]); if (x.status !== 0) throw new Error(`start-scan ${k} exit ${x.status}`); const { loTrinhChuaKhai, ...j } = JSON.parse(x.stdout); return { ...j, git: null }; };
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
const hangMuc = muc => [...(muc || '').matchAll(/<tr id="([^"]+)"><td data-nhan="Mã">([^<]*)<\/td>(?:<td data-nhan="Việc giao">([\s\S]*?)<\/td>)?[\s\S]*?<span class="tt[^"]*">([^<]*)<\/span>/g)].map(m => [m[1], giaiMa(m[2]), chuTron(m[3] || ''), giaiMa(m[4])]);
const TEN_CHUA = new Set([LT.CHUA_MO, ...LT.CHUA_LAM_O.map(k => Object.fromEntries(PMM.SECTIONS)[k])]);
// Neo của hàng ĐẦU mang mã (liên kết từ chỗ cần sửa), và neo của hàng kế (mã + câu giao — mã trùng thì
// không lấy hàng đầu).
const neoDau = (muc, ma) => (hangMuc(muc).find(h => h[1] === String(ma)) || [])[0];
// Hàng kế đọc từ bảng: cùng mã, cùng câu, trạng thái thuộc nhóm chưa làm (luật chọn hàng kế viết lại ở đây).
const neoKe = (muc, ma, cau) => { const c = hangMuc(muc).filter(h => h[1] === String(ma)); return ((c.length > 1 ? c.find(h => h[2].startsWith(cau) && TEN_CHUA.has(h[3])) : c[0]) || [])[0]; };
// Hàng ghi trạng thái ngoài bảng từ, gom theo từ: [từ, [nhãn hàng]] theo thứ tự gặp.
const muaKhai = kq => { const g = new Map(); for (const d of kq.dong) if (d.khaiNgoai) { if (!g.has(d.tuKhai)) g.set(d.tuKhai, []); g.get(d.tuKhai).push(String(d._nhan)); } return [...g]; };
const cauKhai = ([w, ma]) => `kế hoạch ghi «${w}» ở ${ma.length} việc — máy không hiểu trạng thái này, thêm từ này vào bảng từ trạng thái (việc ${ma.join(', ')})`;
const khoKT = {}; const khoTT = ten => (khoKT[ten] ||= KT.dungKho(ten, path.join(TMP, 'kt')));
const phanKho = (M, r) => M.LT.phanTichKho({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS });
const chayCa = async (id, f, kit = KIT) => { try { const s = await f(kit); if (s.length) bad(id, s.join(' ; ')); else return true; } catch (e) { bad(id, loi(e)); } return false; };
// Chiều đỏ: bản lành (cây đang kiểm) PHẢI xanh trước, rồi CHÍNH hàm đo chạy trên bản sao bị tiêm.
const chayDo = async (id, f, tiem, ghim, moTa) => {
  try {
    const lanh = await f(KIT); if (lanh.length) { bad(id, `bản lành chưa xanh — không tin được chiều đỏ: ${lanh[0]}`); return; }
    const s = await f(banSao(tiem)); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm đo trả «${g.slice(0, 110)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 200)}`);
  } catch (e) { bad(id, loi(e)); }
};
// RD1 (road-map-de-dung) đổi CÓ CHỦ Ý khối Mốc của trang (mô hình hiển thị chung) và lớp cờ: các ca so «bộ máy đời trước» /
// «khối == trang theo khuôn cũ» chạy trên cây tắt đúng các khối RD1 — lành và đỏ cùng một gốc; hành vi mới đo ở road-map-de-dung.test.mjs.
const chayCaTat = (id, f) => chayCa(id, f, tatRD1(KIT));
const chayDoTat = async (id, f, tiem, ghim, moTa) => {
  try {
    const goc = tatRD1(KIT); const lanh = await f(goc); if (lanh.length) { bad(id, `bản lành chưa xanh — không tin được chiều đỏ: ${lanh[0]}`); return; }
    const s = await f(banSao(tiem, goc)); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm đo trả «${g.slice(0, 110)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 200)}`);
  } catch (e) { bad(id, loi(e)); }
};

// ── LT-90: thẻ đầu trang ────────────────────────────────────────────────────
async function lt90(kit) {
  const M = await napLT(kit); const sai = [];
  const KHO_90 = { 'ma-trung-ke': () => kho({ data: { schema: 1, hang: [H('T', { cau_giao: '«một»', trang_thai: 'Đã giao' }), H('T', { cau_giao: '«hai»' })] } }),
    'ma-trung-dang-lam': () => kho({ hoSo: { s: 'dang-dung' }, data: { schema: 1, hang: [H('T', { cau_giao: '«x»', slug: 's' }), H('T', { cau_giao: '«x»' })] } }),
    'khong-ma': () => kho({ data: { schema: 1, hang: [{ cau_giao: '«việc chưa đặt mã»' }] } }) };
  for (const ten of ['hai-lo-trinh', 'loi-tep', 'rong', 'ma-trung-ke', 'ma-trung-dang-lam', 'khong-ma']) {
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
      const tong = t.kq.dong.length; const td = tc.match(/(\d+)\/(\d+) đã giao · (\d+) đang làm · (\d+) chưa bắt đầu(?: · (\d+) việc khác \(xếp lại, đã bác hoặc trạng thái chưa rõ\))?/);
      if (tong === 0) { if (!tc.includes('Kế hoạch chưa có việc nào')) sai.push(`${ma}: kế hoạch rỗng mà thẻ không nói «Kế hoạch chưa có việc nào»`); }
      else if (!td || Number(td[2]) !== tong || Number(td[1]) + Number(td[3]) + Number(td[4]) + Number(td[5] || 0) !== tong) sai.push(`${ma}: tiến độ «${td && td[0]}» cho ${tong} hàng`);
    });
    if (ten === 'ma-trung-ke' && !(the[0].includes('href="#lt1-h-T-2">T</a> — hai') && chuTron(the[0]).includes('Mã này trùng trong kế hoạch'))) sai.push(`ma-trung-ke: thẻ không chỉ hàng T thứ hai «${chuTron(the[0]).slice(0, 120)}»`);
    if (ten === 'ma-trung-dang-lam' && !the[0].includes('href="#lt1-h-T-2">T</a> — x')) sai.push(`ma-trung-dang-lam: thẻ không chỉ hàng T thứ hai (hàng đầu đang làm) «${(the[0].match(/<span class="ke">[\s\S]*?<\/span>/) || [''])[0]}»`);
    if (ten === 'khong-ma' && !chuTron(the[0]).includes('Việc này chưa có mã')) sai.push(`khong-ma: thẻ «${chuTron(the[0]).slice(0, 120)}»`);
  }
  return sai;
}
if (want('LT-90') && await chayCa('LT-90', lt90)) ok('LT-90', 'hai lộ trình · tệp hỏng · kế hoạch rỗng · mã trùng (hàng đầu đã giao / đang làm) · việc không mã: một thẻ mỗi lộ trình, bốn nhãn đúng thứ tự, liên kết hàng kế == neo của CHÍNH hàng kế, lệnh == thamSo thẻ start (không lệnh thì nói vì sao), số chỗ cần sửa == cờ + hàng ghi trạng thái lạ, tiến độ cộng đủ, thẻ lỗi chỉ câu lỗi');
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
  if (/ src=|href="?https?:/i.test(html) || soScriptChay(html) !== 1) sai.push('trang có tài nguyên ngoài hoặc hơn một script');
  return sai;
}
if (want('LT-94-do')) await chayDoTat('LT-94-do', lt94, [['scripts/lo-trinh.mjs', 'const mocs = [...kq.moc].sort((a, b) => chuoi(a.ngay).localeCompare(chuoi(b.ngay)));', 'const mocs = [...kq.moc];']], 'thứ tự mốc', 'bản sao không sắp mốc theo ngày');
if (want('LT-94') && await chayCaTat('LT-94', lt94)) ok('LT-94', 'dải mốc sắp theo ngày, chỉ mốc gắn việc chưa giao mang dấu còn việc, mốc không gắn việc mang nhãn, tiêu đề «1/3 mốc chưa gắn việc nào», ô thẻ có chữ dự phòng, không ngày chạy, một script nội tuyến, không tài nguyên ngoài');

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
const PP = o => ({ ten: 'P', ngay: '2026-11-01', loai: 'phat-hanh', hang: [], ...o });
const MA_TRAN_97 = [
  ['thieu-truong', () => kho({ data: { schema: 1, hang: [{ ma: 'A' }] } }), 'A — chưa có câu mô tả việc giao'],
  ['dung-tren-mang', () => kho({ data: { schema: 1, hang: [H('A', { dung_tren: 'B' })] } }), 'A — ô «cần xong trước» phải là danh sách'],
  ['phu-mang', () => kho({ data: { schema: 1, hang: [H('A', { phu: 'X1' })] } }), 'A — ô «mã đã phủ» phải là danh sách'],
  ['khoi-chan-troi', () => kho({ data: { schema: 1, chan_troi: {}, hang: [H('A')] } }), 'danh sách chờ điều kiện phải là một mảng'],
  ['chan-troi-object', () => kho({ data: { schema: 1, chan_troi: ['x'], hang: [H('A')] } }), 'mục chờ điều kiện thứ 1 không đúng dạng'],
  ['khong-object', () => kho({ data: { schema: 1, hang: ['x', H('A')] } }), 'việc thứ 1 không đúng dạng'],
  ['khoi-hang', () => kho({ data: { schema: 1, hang: {} } }), 'danh sách việc phải là một mảng'],
  ['ma-trung', () => kho({ data: { schema: 1, hang: [H('T'), H('T')] } }), 'hai việc cùng mã T — đổi mã một trong hai'],
  // road-map-de-dung (AC-8): năm cờ luật «chỉ việc phát triển» — câu đích viết tay (bốn chỗ đến rút từ BON_CHO_DEN chỉ ở cờ mốc ngoài).
  ['moc-ngoai-da-bo', () => kho({ data: { schema: 1, moc: [{ ten: 'Đào tạo bộ phận', ngay: '2026-11-02', loai: 'ngoai' }], hang: [H('A')] } }), `1 mốc là việc của người — không còn là mốc (luật 17/10): Đào tạo bộ phận 02/11; ${LT.CAU_BON_CHO}`],
  ['moc-chua-khai-loai', () => kho({ data: { schema: 1, moc: [{ ten: 'Phiên nghiệm thu', ngay: '2026-11-13', hang: ['A'] }], hang: [H('A')] } }), '1 mốc chưa khai loại: Phiên nghiệm thu 13/11 — mốc phát triển khai loai (phat-hanh, han, han-cung, su-kien); việc của người không còn là mốc (luật 17/10)'],
  ['dung-tren-moc', () => kho({ data: { schema: 1, moc: [PP({ ma: 'M1', hang: ['A'] })], hang: [H('A'), H('B', { dung_tren: ['M1'] })] } }), '1 việc đứng chờ một mốc thay vì một việc: B → «P 01/11» — «cần xong trước» chỉ trỏ việc; việc của người không còn là mốc (luật 17/10)'],
  ['du-lieu-sai-gia-tri', () => kho({ data: { schema: 1, hang: [H('A', { du_lieu: 'that' })] } }), '1 việc khai du_lieu sai: A ("that") — chỉ nhận "sinh-gia" (việc sinh dữ liệu giả có nhãn) hoặc "gia" (việc đo trên dữ liệu giả)'],
  ['thieu-hang-sinh-gia', () => kho({ data: { schema: 1, hang: [H('A', { du_lieu: 'gia' })] } }), '1 việc đo trên dữ liệu giả mà không đứng trực tiếp trên việc sinh dữ liệu giả: A'],
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
  // moc-la-chien-dich (nấc 1 ADR 0025): hai dạng cờ vàng.
  ['ngoai-moc', () => kho({ hoSo: { s: 'dang-dung' }, data: { schema: 1, moc: [{ ten: 'M1', ngay: '2026-11-01', hang: ['B'] }], hang: [H('A', { slug: 's' }), H('B')] } }), 'A — đang làm mà chưa thuộc mốc nào — gắn việc này vào một mốc của kế hoạch'],
  ['ho-so-ngoai-ke-hoach', () => kho({ hoSo: { c: 'dang-dung' }, data: { schema: 1, hang: [H('A')] } }), 'hồ sơ c đang mở mà không thuộc việc nào trong kế hoạch — thêm việc cho nó, hoặc ghi mã việc vào hồ sơ'],
  // ra-soat-lo-trinh: ba dạng cờ khuôn của chính sách rà soát.
  ['chinh-sach-object', () => kho({ data: { schema: 1, chinh_sach: [], hang: [H('A')] } }), 'chính sách rà soát phải là một object'],
  ['chinh-sach-tuoi', () => kho({ data: { schema: 1, chinh_sach: { tuoi_ngay: 0 }, hang: [H('A')] } }), 'chính sách tuoi_ngay phải là số nguyên dương'],
  ['chinh-sach-tran', () => kho({ data: { schema: 1, chinh_sach: { tran_ke_tiep: -1 }, hang: [H('A')] } }), 'chính sách tran_ke_tiep phải là số nguyên không âm'],
  // ap-chinh-sach-lo-trinh: năm dạng cờ khuôn của chính sách tự áp trên mốc chiến dịch.
  ['cs-moc-loai', () => kho({ data: { schema: 1, moc: [{ ten: 'N', ngay: '2026-11-01', loai: 'ngoai', chinh_sach: { tu_ap: true }, hang: [] }], hang: [H('A')] } }), 'chính sách chỉ khai ở mốc phát hành: N 01/11'],
  ['cs-moc-object', () => kho({ data: { schema: 1, moc: [PP({ chinh_sach: [] })], hang: [H('A')] } }), 'chính sách tự áp của mốc P 01/11 phải là một object'],
  ['cs-moc-tu-ap', () => kho({ data: { schema: 1, moc: [PP({ chinh_sach: { tu_ap: 'x' } })], hang: [H('A')] } }), 'chính sách tu_ap phải là true hoặc false (mốc P 01/11)'],
  ['cs-moc-duong', () => kho({ data: { schema: 1, moc: [PP({ chinh_sach: { nhip_ngay: 0 } })], hang: [H('A')] } }), 'chính sách nhip_ngay phải là số nguyên dương (mốc P 01/11)'],
  ['cs-moc-tran', () => kho({ data: { schema: 1, moc: [PP({ chinh_sach: { tran_ke_tiep: -1 } })], hang: [H('A')] } }), 'chính sách tran_ke_tiep phải là số nguyên không âm (mốc P 01/11)'],
  // lo-trinh-gio-may: khoá giờ máy trên hàng sai dạng.
  ['gio-may-sai', () => kho({ data: { schema: 1, hang: [H('A', { gio_may: 'nhiều' })] } }), 'A — ô «giờ máy» phải là số giờ dương hoặc cặp [thấp, cao]'],
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
if (want('LT-98-do')) await chayDo('LT-98-do', lt98, [['scripts/lo-trinh.mjs', '...cacTep.map((t, i) => mucLoTrinh(i + 1, t)),', '...cacTep.map((t, i) => mucLoTrinh(i + 1, cacTep.find(x => x.loi) || t)),']], 'mục OKR không có bảng việc', 'bản sao để một tệp hỏng tắt mọi mục');
if (want('LT-98') && await chayCa('LT-98', lt98)) ok('LT-98', 'tệp hỏng: thẻ và mục của nó nêu lỗi bằng tiếng người; lộ trình kia đủ bốn dòng thẻ và bảng việc');

// ── LT-99: trang mẫu hội đồng + ảnh gắn băm ─────────────────────────────────
if (want('LT-99-mau')) {
  try {
    const x = node([path.join(HERE, 'lo-trinh-mau-trang.mjs'), '--check'], { env: { ...process.env, LO_TRINH_MAY: tatMC(KIT) } });
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
const phanJson = (M, r) => JSON.stringify(duLieuX2(phanKho(M, r)));
async function lt100(kit) {
  const B = await napLT(bo2210()); kit = tatMC(kit); const M = await napLT(kit); const sai = [];
  for (const ten of ['hai-lo-trinh', 'loi-tep', 'khong-co']) {
    const r = khoTT(ten);
    const kb = phanKho(B, r); const km = phanKho(M, r);
    if (!km.cacTep.some(t => t.kq && t.kq.dong.length)) sai.push(`${ten}: đối chứng — cây đang kiểm không có hàng nào`);
    if (phanJson(B, r) !== phanJson(M, r)) {
      const lech = km.cacTep.flatMap((t, i) => (t.kq ? t.kq.dong.filter((d, n) => JSON.stringify(duLieuX2(d)) !== JSON.stringify(duLieuX2(kb.cacTep[i]?.kq?.dong[n] ?? null))).map(d => `${t.tep}:${d._nhan} (${d.chu})`) : []));
      sai.push(`${ten}: lớp phân tích khác 2.21.0 — hàng lệch ${lech.slice(0, 4).join(', ') || '(không ở hàng)'}`);
    }
    const jb = JSON.parse(quet(r, { ACCEPTANCE_TODAY: '2026-10-03' }, bo2210()).stdout).loTrinh;
    const jm = JSON.parse(quet(r, { ACCEPTANCE_TODAY: '2026-10-03' }, kit).stdout).loTrinh;
    // Dòng «vẽ bằng: node <bộ máy>/scripts/product-map.mjs» mang đường của bộ máy chạy — thay bằng <kit>.
    const bo = (j, k) => jsonX2([realpathSync(k), k].reduce((x, g) => x.split(g).join('<kit>'), JSON.stringify(duLieuX2({ ...j, trang: null }))), r);
    if (bo(jb, bo2210()) !== bo(jm, kit)) { const x = bo(jb, bo2210()), y = bo(jm, kit); let i = 0; while (x[i] === y[i]) i++; sai.push(`${ten}: loTrinh của JSON quét khác 2.21.0 ở ký tự ${i}: «${x.slice(Math.max(0, i - 40), i + 40)}» / «${y.slice(Math.max(0, i - 40), i + 40)}»`); }
  }
  return sai;
}
if (want('LT-100') && await chayCa('LT-100', lt100)) ok('LT-100', 'hai lộ trình · tệp hỏng · không chỗ lệch: phanTichKho và loTrinh của JSON quét giống hệt bộ máy v2.21.0 (git archive trọn thư mục)');
if (want('LT-100-do')) await chayDo('LT-100-do', lt100, [['scripts/lo-trinh.mjs', "export const CHUA_MO = 'Chưa mở';", "export const CHUA_MO = 'Chưa bắt đầu';"]], 'hàng lệch docs/plan/lo-trinh-okr.json:', 'bản sao đổi chữ trạng thái «Chưa mở» của lớp phân tích');


// ═══ Vòng xuat-du-lieu-lo-trinh (LT-110..LT-120) ═══════════════════════════════════════════════
// Hồ sơ _acceptance/xuat-du-lieu-lo-trinh/ (hàng X1). Trang mang một khối dữ liệu máy đọc; các ca dưới
// đọc khối bằng JSON.parse của chính ca (không gọi bộ vẽ) và đọc TRANG bằng bộ đọc HTML độc lập viết
// lại ở đây bằng regex — hai bên phải khớp. Bộ vẽ «trước vòng» = `git archive` commit gốc vòng.
const GOC_X1 = '7e965b54';
let gocX1Dir = null;
function banGocX1() {
  if (gocX1Dir) return gocX1Dir;
  const d = path.join(TMP, 'goc-x1'); mkdirSync(d, { recursive: true });
  execFileSync('tar', ['-x', '-C', d], { input: execFileSync('git', ['-C', KIT, 'archive', '--format=tar', GOC_X1, 'scripts', 'lib', 'skills'], { maxBuffer: 1 << 28 }) });
  return (gocX1Dir = d);
}
const KHOI_RE = /<script type="application\/json" id="lo-trinh-du-lieu">([\s\S]*?)<\/script>/;
const khoiCua = html => { const m = String(html).match(KHOI_RE); return m ? JSON.parse(m[1]) : null; };
const datKhoi = (html, o) => html.replace(KHOI_RE, () => `<script type="application/json" id="lo-trinh-du-lieu">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`);
const goKhoi = html => html.replace(/<script type="application\/json" id="lo-trinh-du-lieu">[\s\S]*?<\/script>\n/, '');
// Bảng khoá VIẾT SẴN, chép từ bảng «Khuôn dữ liệu» của design doc 2026-10-08 — không rút từ mã.
const KHUON_VIET_SAN = {
  goc: ['khuon', 'phien_ban', 'nguon', 'lo_trinh', 'ngoai_lo_trinh'],
  // Cùng bản 2 (hồ sơ road-map-de-dung, AC-11): mô hình hiển thị chung — lo_trinh.chua_hen_moc, hang.ten_hien_thi,
  // moc.hien|viec_hien|con_lai — bảng viết sẵn từ design doc 2026-10-17 của vòng đó (mục Mô hình hiển thị chung).
  lo_trinh: ['tep', 'ten', 'loi', 'hang_ke', 'can_sua', 'tien_do', 'hang', 'moc', 'da_bac', 'chua_hen_moc'],
  hang_ke: ['ma', 'cau_giao', 'lenh'],
  can_sua: ['ma', 'chu'],
  tien_do: ['tong', 'da_giao', 'dang_lam', 'chua_bat_dau', 'khac'],
  // Cùng bản 2 (hồ sơ lo-trinh-du-lieu-ngay-du-kien, RM6c): hang.gio_may, moc.gio_may|du_kien|qua_tai — bảng viết sẵn từ
  // design doc 2026-10-16 của vòng đó (mục Phương án).
  hang: ['ma', 'cau_giao', 'hang', 'nhom', 'dung_tren', 'trang_thai', 'nhom_trang_thai', 'ho_so', 'theo_loi', 'co', 'bat_khi', 'vi_sao', 'tom_tat', 'gio_may', 'ten_hien_thi'],
  moc: ['ten', 'ngay', 'hang', 'con_viec', 'gio_may', 'du_kien', 'qua_tai', 'hien', 'viec_hien', 'con_lai'],
  da_bac: ['ma', 'ly_do'],
  gio_may: ['thap', 'cao', 'nguon', 'chu', 'co', 'phan_tram_tuan', 'phan_tram_chu'],
  gio_may_moc: ['thap', 'cao', 'chu', 'phan_tram_tuan', 'phan_tram_chu'],
  du_kien: ['ngay_tinh', 'hoan_tat', 'chu'],
  // Bản 2 (hồ sơ trang-ho-so-mot-viec): bảng viết sẵn từ design doc 2026-10-11 của vòng đó.
  tom_tat: ['moi_nguoi', 'chu_kho'],
  moi_nguoi: ['da_giao', 'vi_sao', 'trang_thai', 'ngay', 'production', 'do_gi', 'ket_qua', 'chua_lam', 'ai_quyet'],
  chu_kho: ['tieu_chi', 'phep_do', 'luot_cham', 'token', 'quyet_dinh_may', 'quyet_dinh_nguoi', 'ma'],
};
const tapBang = (a, b) => [...a].sort().join('|') === [...b].sort().join('|');
const lechTap = (a, b) => [...a.filter(x => !b.includes(x)).map(x => `+${x}`), ...b.filter(x => !a.includes(x)).map(x => `-${x}`)].join(' ');

// Kho thử của vòng: ba lộ trình (đủ khối · JSON hỏng · 0 hàng) + một hồ sơ ngoài kế hoạch. HO_SO_X1 là
// bảng «hàng → hồ sơ nhận» biết trước lúc dựng.
const T_A = 'docs/plan/a.json'; const T_HONG = 'docs/plan/hong.json'; const T_RONG = 'docs/plan/rong.json';
const HO_SO_X1 = { A1: 'h-ship', A3: 'h-nhan' };
const DATA_X1 = {
  schema: 1, ten: 'Lộ trình A',
  moc: [{ ten: 'M1', ngay: '2030-01-10', hang: ['A6'] }, { ten: 'M0', ngay: '2020-01-01', hang: ['A1'] }, { ten: 'Trống', ngay: '2030-05-05' }],
  hang: [
    H('A1', { slug: 'h-ship', nhom: 'okr', hang: 'T2', bat_khi: 'khi xong', vi_sao: 'vì cần' }),
    H('A2', { trang_thai: 'Đang làm', nhom: 'okr' }),
    H('A3', { nhom: 'kho' }),
    H('A4', { trang_thai: 'xong lâu rồi' }),
    H('A5', { slug: 'h-vang', trang_thai: 'Đã giao' }),
    H('A6', { dung_tren: ['A1'] }),
    H('A7', { dung_tren: ['ZZ'] }),
  ],
  da_bac: [{ ma: 'B9', ly_do: 'không ai cần' }],
};
const CFG_X1 = `lo_trinh:\n  tep:\n    - ${T_A}\n    - ${T_HONG}\n    - ${T_RONG}\n`;
const KHO_110 = () => khoX({ cfg: CFG_X1, tepData: { [T_A]: DATA_X1, [T_HONG]: '{ "schema": 1, "hang": [ ', [T_RONG]: { schema: 1, ten: 'Rỗng', hang: [] } },
  hoSo: { 'h-ship': 'da-ship', 'h-nhan': 'sap-mo', 'h-ngoai': 'dang-dung' }, nhan: { 'h-nhan': { ma: 'A3', tep: T_A } } });

// ── Bộ đọc HTML độc lập: những gì người xem thấy trên trang ─────────────────
function docTrang(html) {
  const nTep = cacThe(html).length; const ra = [];
  for (let i = 1; i <= nTep; i++) {
    const sec = mucLT(html, i) || ''; const the = cacThe(html)[i - 1]; const tc = chuTron(the);
    if (sec.includes('<p class="loi">')) { ra.push({ loi: chuTron((sec.match(/<p class="loi">([\s\S]*?)<\/p>/) || [])[1] || '') }); continue; }
    const hang = [...sec.matchAll(/<tr id="[^"]+">([\s\S]*?)<\/tr>/g)].map(m => {
      const tt = (m[1].match(/<td data-nhan="Trạng thái">([\s\S]*?)<\/td>/) || [])[1] || '';
      return { ma: giaiMa((m[1].match(/<td data-nhan="Mã">([^<]*)<\/td>/) || [])[1] || ''), chu: giaiMa((tt.match(/<span class="tt[^"]*">([^<]*)<\/span>/) || [])[1] || ''),
        theo_loi: tt.includes('theo ghi chép, chưa có hồ sơ'), co: [...tt.matchAll(/<span class="co-o">([^<]*)<\/span>/g)].map(x => giaiMa(x[1])) };
    });
    const ke = the.match(/<span class="ke"><a href="#[^"]+">([^<]*)<\/a> — ([^<]*)<\/span>/); const lenh = the.match(/<span class="lenh">([^<]*)<\/span>/);
    const coDs = ((sec.match(/<ul class="co-ds">([\s\S]*?)<\/ul>/) || [])[1] || '');
    const td = tc.match(/(\d+)\/(\d+) đã giao · (\d+) đang làm · (\d+) chưa bắt đầu(?: · (\d+) việc khác)?/);
    const moc = [...sec.matchAll(/<li data-ngay="([^"]*)" data-ten="([^"]*)"( data-con-viec)?>([\s\S]*?)<\/li>/g)].map(m => {
      const v = chuTron(m[4]).match(/· việc (.+)$/); return { ngay: giaiMa(m[1]), ten: giaiMa(m[2]), con_viec: !!m[3], hang: v ? v[1].split(', ') : [] };
    });
    const bac = ((sec.match(/<h3>Đã bác<\/h3><ul>([\s\S]*?)<\/ul>/) || [])[1] || '');
    ra.push({
      loi: null, hang,
      hang_ke: ke ? { ma: giaiMa(ke[1]), cau_giao: giaiMa(ke[2]), lenh: lenh ? giaiMa(lenh[1]) : null } : null,
      can_sua: [...coDs.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => chuTron(m[1])),
      tien_do: td ? { tong: +td[2], da_giao: +td[1], dang_lam: +td[3], chua_bat_dau: +td[4], khac: +(td[5] || 0) } : (tc.includes('Kế hoạch chưa có việc nào') ? { tong: 0, da_giao: 0, dang_lam: 0, chua_bat_dau: 0, khac: 0 } : null),
      moc, da_bac: [...bac.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => chuTron(m[1])),
    });
  }
  const ng = html.match(/<details><summary>\d+ hồ sơ không thuộc kế hoạch nào<\/summary>[\s\S]*?<ul>([\s\S]*?)<\/ul><\/details>/);
  return { lo: ra, ngoai: ng ? [...ng[1].matchAll(/<code>([^<]*)<\/code>/g)].map(m => giaiMa(m[1])) : [] };
}
// Bản chiếu tham chiếu (chỉ đọc khối) so với trang. `hoSoMong` = bảng hàng → hồ sơ biết trước (hoặc
// null khi kho không có bảng đó). Trả [lỗi, đếm theo loại].
function soKhoiTrang(html, hoSoMong = null) {
  const k = khoiCua(html); const t = docTrang(html); const sai = []; const dem = {};
  const cong = (loai, n = 1) => { dem[loai] = (dem[loai] || 0) + n; };
  if (!k) return [['trang không có khối dữ liệu'], dem];
  if (k.lo_trinh.length !== t.lo.length) sai.push(`số lộ trình: khối ${k.lo_trinh.length} · trang ${t.lo.length}`);
  k.lo_trinh.forEach((L, i) => {
    const P = t.lo[i]; if (!P) return; const ten = `lộ trình ${i + 1}`;
    if (P.loi != null || L.loi != null) { if (!(P.loi && L.loi && P.loi.includes(L.loi))) sai.push(`${ten}: lỗi tệp khối «${L.loi}» · trang «${P.loi}»`); else cong('loi'); return; }
    const theoMa = rows => { const m = new Map(); for (const r of rows) { if (!m.has(r.ma)) m.set(r.ma, []); m.get(r.ma).push(JSON.stringify([r.chu, r.theo_loi, r.co])); } for (const v of m.values()) v.sort(); return m; };
    const mk = theoMa(L.hang.map(h => ({ ma: h.ma, chu: h.trang_thai, theo_loi: h.theo_loi, co: h.co }))); const mp = theoMa(P.hang);
    for (const ma of new Set([...mk.keys(), ...mp.keys()])) {
      const a = mk.get(ma) || []; const b = mp.get(ma) || [];
      if (!b.length) sai.push(`${ten}: hàng ${ma} có trong khối, không có trên trang`);
      else if (!a.length) sai.push(`${ten}: hàng ${ma} có trên trang, không có trong khối`);
      else if (JSON.stringify(a) !== JSON.stringify(b)) sai.push(`${ten}: hàng ${ma} khối ${a.join(' / ')} · trang ${b.join(' / ')}`);
      else cong('hang');
    }
    for (const h of L.hang) { if (h.theo_loi) cong('theo_loi'); if (h.co.length) cong('co', h.co.length); }
    const nh = { tong: L.hang.length, da_giao: 0, dang_lam: 0, chua_bat_dau: 0, khac: 0 };
    for (const h of L.hang) nh[h.nhom_trang_thai.replace(/-/g, '_')] = (nh[h.nhom_trang_thai.replace(/-/g, '_')] ?? NaN) + 1;
    if (!deq(nh, P.tien_do) || !deq(L.tien_do, P.tien_do)) sai.push(`${ten}: tiến độ — nhóm từng hàng ${JSON.stringify(nh)} · khối ${JSON.stringify(L.tien_do)} · trang ${JSON.stringify(P.tien_do)}`); else cong('tien_do');
    if (!deq(L.hang_ke, P.hang_ke)) sai.push(`${ten}: hàng kế khối ${JSON.stringify(L.hang_ke)} · trang ${JSON.stringify(P.hang_ke)}`); else if (L.hang_ke) cong('hang_ke');
    const cs = L.can_sua.map(c => (c.ma != null ? `${c.ma} — ${c.chu}` : c.chu));
    if (!deq(cs, P.can_sua)) sai.push(`${ten}: chỗ cần sửa khối ${JSON.stringify(cs)} · trang ${JSON.stringify(P.can_sua)}`); else cong('can_sua', cs.length);
    const mm = L.moc.map(m => ({ ngay: m.ngay, ten: m.ten, con_viec: m.con_viec, hang: m.hang }));
    if (!deq(mm, P.moc)) sai.push(`${ten}: mốc khối ${JSON.stringify(mm)} · trang ${JSON.stringify(P.moc)}`); else cong('moc', mm.length);
    const bb = L.da_bac.map(b => `${b.ma} — ${b.ly_do}`);
    if (!deq(bb, P.da_bac)) sai.push(`${ten}: đã bác khối ${JSON.stringify(bb)} · trang ${JSON.stringify(P.da_bac)}`); else cong('da_bac', bb.length);
    if (hoSoMong && i === 0) for (const h of L.hang) { const mong = hoSoMong[h.ma] || null; if (h.ho_so !== mong) sai.push(`${ten}: hàng ${h.ma} ho_so khối «${h.ho_so}» · kho thử dựng «${mong}»`); else if (mong) cong('ho_so'); }
  });
  if (!deq(k.ngoai_lo_trinh, t.ngoai)) sai.push(`ngoai_lo_trinh: khối ${JSON.stringify(k.ngoai_lo_trinh)} · trang ${JSON.stringify(t.ngoai)}`); else cong('ngoai', t.ngoai.length);
  return [sai, dem];
}

// ── LT-110: khối có mặt, đúng khuôn ─────────────────────────────────────────
async function lt110(kit) {
  const M = await napLT(kit); const sai = []; const html = veM(M, KHO_110());
  const n = (html.match(/id="lo-trinh-du-lieu"/g) || []).length; if (n !== 1) return [`${n} khối dữ liệu trên trang`];
  let k; try { k = khoiCua(html); } catch (e) { return [`khối không parse được: ${e.message}`]; }
  if (k.khuon !== 'lo-trinh-du-lieu' || k.phien_ban !== 2) sai.push(`khuon/phien_ban «${k.khuon}»/${k.phien_ban}`);
  if (!deq(k.nguon, [T_A, T_HONG, T_RONG])) sai.push(`nguon ${JSON.stringify(k.nguon)}`);
  const KM = M.LT.KHUON_DU_LIEU || {};
  for (const cap of Object.keys(KHUON_VIET_SAN)) if (!tapBang(KM[cap] || [], KHUON_VIET_SAN[cap])) sai.push(`khuôn trong mã cấp ${cap} lệch bảng viết sẵn: ${lechTap(KM[cap] || [], KHUON_VIET_SAN[cap])}`);
  const kiem = (o, cap, noi) => { if (o == null) return; const ks = Object.keys(o); if (!tapBang(ks, KHUON_VIET_SAN[cap])) sai.push(`${noi}: khoá ${cap} lệch khuôn: ${lechTap(ks, KHUON_VIET_SAN[cap])}`); };
  kiem(k, 'goc', 'gốc');
  k.lo_trinh.forEach((L, i) => {
    kiem(L, 'lo_trinh', `lộ trình ${i + 1}`); kiem(L.hang_ke, 'hang_ke', `lộ trình ${i + 1}`); kiem(L.tien_do, 'tien_do', `lộ trình ${i + 1}`);
    for (const [arr, cap] of [[L.hang, 'hang'], [L.moc, 'moc'], [L.da_bac, 'da_bac'], [L.can_sua, 'can_sua']]) (arr || []).forEach((x, j) => kiem(x, cap, `lộ trình ${i + 1} ${cap}[${j}]`));
    (L.hang || []).forEach((x, j) => { if (x && x.tom_tat) { kiem(x.tom_tat, 'tom_tat', `hang[${j}]`); kiem(x.tom_tat.moi_nguoi, 'moi_nguoi', `hang[${j}]`); kiem(x.tom_tat.chu_kho, 'chu_kho', `hang[${j}]`); } });
  });
  const [a, h, r] = k.lo_trinh;
  if (!a || !a.hang.length || !a.moc.length || !a.da_bac.length || !a.can_sua.length || !a.hang_ke) sai.push('đối chứng: lộ trình A thiếu một loại dữ liệu');
  if (!h || !String(h.loi || '').includes('tệp kế hoạch') || h.hang.length || h.moc.length || h.can_sua.length || h.da_bac.length) sai.push(`tệp hỏng: ${JSON.stringify(h).slice(0, 160)}`);
  if (!r || r.loi !== null || r.hang_ke !== null || !deq(r.tien_do, { tong: 0, da_giao: 0, dang_lam: 0, chua_bat_dau: 0, khac: 0 }) || r.hang.length) sai.push(`tệp 0 hàng: ${JSON.stringify(r).slice(0, 160)}`);
  return sai;
}
if (want('LT-110') && await chayCa('LT-110', lt110)) ok('LT-110', 'ba lộ trình (đủ · hỏng · 0 hàng): đúng một khối, parse được, khoá từng cấp == khuôn mã == bảng viết sẵn từ design');
if (want('LT-110-do')) await chayDo('LT-110-do', lt110, [['scripts/lo-trinh.mjs', 'trang_thai: d.chu, nhom_trang_thai: nhomTienDo(d.chu, kq, nhom), ho_so:', 'trang_thai: d.chu, ho_so:']], 'nhom_trang_thai', 'bản sao bỏ khoá nhom_trang_thai khỏi hàng');

// ── LT-111: bản chiếu tham chiếu khớp trang 100 % ──────────────────────────
// Ma trận nhóm VIẾT SẴN theo khoá ô (từ DA_GIAO_O/DANG_LAM_O/CHUA_LAM_O của design viec-ke-theo-plan),
// tên rút từ SECTIONS; ô không dựng được bằng HO_SO nằm trong danh sách loại trừ có lý do.
const NHOM_X1 = { 'cho-nghiem-thu': 'da-giao', 'da-ship': 'da-giao', 'da-nghiem-thu': 'da-giao', 'cho-duyet': 'dang-lam', 'dang-dung': 'dang-lam', 'can-nhac': 'chua-bat-dau', 'sap-mo': 'chua-bat-dau', 'xep-lai': 'khac', 'da-bac': 'khac', 'hong': 'khac' };
const LOAI_TRU_X1 = { 'ngoai-pham-vi': 'ô sinh từ .out-of-scope/, không phải thư mục _acceptance/ — không hàng nào trỏ được' };
async function lt111kho(kit) { const M = await napLT(kit); const [sai, dem] = soKhoiTrang(veM(M, KHO_110()), HO_SO_X1); for (const l of ['hang', 'theo_loi', 'co', 'tien_do', 'hang_ke', 'can_sua', 'moc', 'da_bac', 'ngoai', 'ho_so', 'loi']) if (!dem[l]) sai.push(`đối chứng: 0 mục loại ${l} được so`); console.log(`    · LT-111 kho-thu số mục so: ${JSON.stringify(dem)}`); return sai; }
async function lt111crm(kit) { const M = await napLT(kit); const [sai, dem] = soKhoiTrang(veM(M, khoTT('hai-lo-trinh'))); if (!(dem.hang > 20)) sai.push(`đối chứng: chỉ ${dem.hang} hàng được so`); console.log(`    · LT-111 crm-okr số mục so: ${JSON.stringify(dem)}`); return sai; }
async function lt111nhom(kit) {
  const M = await napLT(kit); const TEN = Object.fromEntries(M.PM.SECTIONS); const sai = [];
  const khoa = M.PM.SECTIONS.map(([k]) => k).filter(k => !LOAI_TRU_X1[k]);
  if (khoa.length + Object.keys(LOAI_TRU_X1).length !== M.PM.SECTIONS.length) sai.push('loại trừ không thuộc SECTIONS');
  const hoSo = {}; const hang = [];
  for (const k of khoa) { if (!HO_SO[k] || !(k in NHOM_X1)) { sai.push(`ô ${k} không có hình dạng hồ sơ hay nhóm viết sẵn`); continue; } hoSo[`n-${k}`] = k; hang.push(H(`N-${k}`, { slug: `n-${k}` })); }
  hang.push(H('N-chua-mo')); hang.push(H('N-khong-suy', { slug: 'n-vang', trang_thai: 'Đã giao' }));
  const mong = { ...Object.fromEntries(khoa.map(k => [TEN[k], NHOM_X1[k]])), [M.LT.CHUA_MO]: 'chua-bat-dau', [M.LT.KHONG_SUY]: 'khac' };
  const r = khoX({ cfg: mot('docs/n.json'), tepData: { 'docs/n.json': { schema: 1, hang } }, hoSo });
  const html = veM(M, r); const k = khoiCua(html);
  if (!k || !k.lo_trinh[0]) return ['không có khối'];
  const thay = new Set();
  for (const h of k.lo_trinh[0].hang) {
    thay.add(h.trang_thai);
    if (!(h.trang_thai in mong)) sai.push(`hàng ${h.ma}: chữ trạng thái lạ «${h.trang_thai}»`);
    else if (h.nhom_trang_thai !== mong[h.trang_thai]) sai.push(`hàng ${h.ma}: nhóm khối ${h.nhom_trang_thai} · nhóm viết sẵn ${mong[h.trang_thai]} (${h.trang_thai})`);
  }
  for (const c of Object.keys(mong)) if (!thay.has(c)) sai.push(`ma trận: không hàng nào mang «${c}»`);
  const [s2] = soKhoiTrang(html); sai.push(...s2);
  console.log(`    · LT-111 nhom ma trận ${Object.keys(mong).length} chữ × 1 hàng: ${Object.entries(mong).map(([c, n]) => `${c}→${n}`).join(' · ')}`);
  return sai;
}
// Chiều đỏ trên TRANG lành: sửa khối rồi chạy CHÍNH hàm so.
async function lt111DoTrang(id, sua, ghim, moTa) {
  try {
    const M = await napLT(tatRD1(KIT)); const html = veM(M, KHO_110());
    const [lanh] = soKhoiTrang(html, HO_SO_X1); if (lanh.length) { bad(id, `bản lành chưa xanh: ${lanh[0]}`); return; }
    const k = khoiCua(html); sua(k); const [s] = soKhoiTrang(datKhoi(html, k), HO_SO_X1); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm so trả «${g.slice(0, 110)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 200)}`);
  } catch (e) { bad(id, loi(e)); }
}
if (want('LT-111 kho-thu') && await chayCaTat('LT-111 kho-thu', lt111kho)) ok('LT-111 kho-thu', 'mọi hàng (chữ · theo lời · cờ), hàng kế + lệnh, chỗ cần sửa, tiến độ, mốc, đã bác, hồ sơ ngoài kế hoạch: khối == trang; ho_so == bảng dựng');
if (want('LT-111 crm-okr') && await chayCaTat('LT-111 crm-okr', lt111crm)) ok('LT-111 crm-okr', 'fixture crm OKR + kho tài liệu: khối == trang ở mọi loại mục');
if (want('LT-111 nhom') && await chayCa('LT-111 nhom', lt111nhom)) ok('LT-111 nhom', 'ma trận toàn phần chữ trạng thái × nhóm: từng hàng đúng nhóm viết sẵn, khối == trang');
if (want('LT-111-do bo-hang')) await lt111DoTrang('LT-111-do bo-hang', k => { k.lo_trinh[0].hang = k.lo_trinh[0].hang.filter(h => h.ma !== 'A6'); }, 'hàng A6 có trên trang, không có trong khối', 'xoá hàng A6 khỏi khối');
if (want('LT-111-do doi-trang-thai')) await lt111DoTrang('LT-111-do doi-trang-thai', k => { k.lo_trinh[0].hang.find(h => h.ma === 'A1').trang_thai = 'Đang làm'; }, 'hàng A1 khối', 'đổi trạng thái A1 trong khối');
if (want('LT-111-do ngoai-rong')) await lt111DoTrang('LT-111-do ngoai-rong', k => { k.ngoai_lo_trinh = []; }, 'ngoai_lo_trinh', 'rút rỗng hồ sơ ngoài kế hoạch');
if (want('LT-111-do co-chua-dich')) await lt111DoTrang('LT-111-do co-chua-dich', k => { k.lo_trinh[0].hang.find(h => h.ma === 'A7').co = ['hàng A7: đứng trên mã không có: ZZ']; }, 'hàng A7', 'thay cờ A7 bằng câu gốc chưa dịch');
if (want('LT-111-do doi-nhom')) await chayDo('LT-111-do doi-nhom', lt111nhom, [['scripts/lo-trinh.mjs', "nhom.dangLam.has(chu) ? 'dang-lam'", "(nhom.dangLam.has(chu) || chu === 'Sắp mở vòng') ? 'dang-lam'"]], 'nhóm khối dang-lam · nhóm viết sẵn chua-bat-dau', 'bản sao xếp «Sắp mở vòng» vào đang làm');

// ── LT-112: gỡ khối thì trang giống từng byte bản trước vòng ────────────────
const BUOC_KE_DONG = /<div class="mu nho">bước kế: [^<]*<\/div>/;
const BUOC_KE_DONG_G = new RegExp(BUOC_KE_DONG.source, 'g');
async function lt112(kit) {
  const r = KHO_110(); const moi = veBang(tatMC(kit), r).trang; let cu = veBang(banGocX1(), r).trang;
  if (!moi || !cu) return [`trang vắng: mới ${!!moi} · cũ ${!!cu}`];
  if (!KHOI_RE.test(moi)) return ['đối chứng: trang mới không có khối'];
  // Vòng lo-trinh-cat-luot (gộp sau X1) thêm dòng «bước kế» cho hàng có hồ sơ — phần đổi CỦA vòng ấy,
  // gỡ đích danh trước khi so, để lời hứa của X1 (khối là chỗ khác DUY NHẤT) giữ nguyên nghĩa.
  if (!BUOC_KE_DONG.test(moi)) return ['đối chứng: trang mới không có dòng bước kế nào để gỡ'];
  const g = goKhoi(moi).replace(BUOC_KE_DONG_G, ''); cu = trangX2(cu, r); if (g === cu) return [];
  let i = 0; while (g[i] === cu[i]) i++;
  const tu = Math.max(0, i - 12);
  return [`gỡ khối vẫn khác bản ${GOC_X1} ở byte ${i}: «${g.slice(tu, i + 30)}» / «${cu.slice(tu, i + 30)}»`];
}
if (want('LT-112') && await chayCaTat('LT-112', lt112)) ok('LT-112', `ba lộ trình (đủ · hỏng · 0 hàng): gỡ khối và dòng bước kế → giống từng byte trang bộ vẽ ${GOC_X1} vẽ`);
if (want('LT-112-do')) await chayDoTat('LT-112-do', lt112, [['scripts/lo-trinh.mjs', '<span class="nhan">Làm tiếp</span>', '<span class="nhan">Làm kế</span>']], 'Làm kế', 'bản sao đổi nhãn hiển thị «Làm tiếp»');

// ── LT-113: kho không khai lộ trình không đổi gì ───────────────────────────
function lt113(kit) {
  const r = kho({ khoa: false, hoSo: { a1: 'sap-mo', a2: 'da-ship' } }); const sai = [];
  const chay = k => { const c = path.join(TMP, `k113-${++khoN}`); execFileSync('git', ['clone', '-q', r, c]); const pm = path.join(k, 'scripts', 'product-map.mjs');
    const w = node([pm, '--root', c]); const ck = node([pm, '--root', c, '--check']);
    return { w: w.status, ck: ck.status, st: git(c, 'status', '--porcelain', '--untracked-files=all').split('\n').filter(Boolean), map: existsSync(path.join(c, 'PRODUCT-MAP.md')) ? readFileSync(path.join(c, 'PRODUCT-MAP.md'), 'utf8') : null, trang: existsSync(path.join(c, 'LO-TRINH.html')) }; };
  const a = chay(kit); const b = chay(banGocX1());
  if (a.w !== 0 || a.ck !== 0) sai.push(`ghi/--check exit ${a.w}/${a.ck}`);
  if (a.trang) sai.push('LO-TRINH.html sinh khi kho không khai lộ trình');
  if (!deq(a.st, ['?? PRODUCT-MAP.md'])) sai.push(`tệp đổi ${JSON.stringify(a.st)}`);
  if (a.map == null || a.map !== b.map) sai.push(`PRODUCT-MAP.md khác bản ${GOC_X1}`);
  return sai;
}
if (want('LT-113') && await chayCa('LT-113', lt113)) ok('LT-113', `kho không khai: không trang, chỉ PRODUCT-MAP.md đổi, bản đồ == bản ${GOC_X1}`);
if (want('LT-113-do')) await chayDo('LT-113-do', lt113, [['scripts/product-map.mjs', 'if (trang != null) { writeFileSync(pagePath, trang); console.log(pagePath); }', "writeFileSync(pagePath, trang || ''); if (trang != null) { console.log(pagePath); }"]], 'LO-TRINH.html', 'bản sao luôn ghi LO-TRINH.html');

// ── LT-114: không tệp mới, miễn trừ cũ đủ ──────────────────────────────────
function lt114(kit) {
  const r = kho({ hoSo: { s1: 'dang-dung' }, data: { schema: 1, hang: [H('S1', { slug: 's1' }), H('S2')] } }); const sai = [];
  const pm = path.join(kit, 'scripts', 'product-map.mjs');
  const w1 = node([pm, '--root', r]); if (w1.status !== 0) return [`lượt vẽ đầu exit ${w1.status}`];
  const moi1 = git(r, 'status', '--porcelain', '--untracked-files=all').split('\n').filter(Boolean).map(l => l.replace(/^\s*\S+\s+/, '')).sort();
  if (!deq(moi1, ['LO-TRINH.html', 'PRODUCT-MAP.md'])) sai.push(`tệp sinh ở lượt vẽ đầu: ${moi1.join(', ')}`);
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 've');
  for (const [f, t] of Object.entries(HO_SO['da-ship']('s1'))) writeFileSync(path.join(r, '_acceptance', 's1', f), t);
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'ho so doi o');
  const w2 = node([pm, '--root', r]); if (w2.status !== 0) return [`lượt vẽ lại exit ${w2.status}`];
  const st = git(r, 'status', '--porcelain', '--untracked-files=all').split('\n').filter(Boolean).map(l => l.replace(/^\s*\S+\s+/, '')).sort();
  if (!deq(st, ['LO-TRINH.html', 'PRODUCT-MAP.md'])) sai.push(`tệp đổi khi vẽ lại: ${st.join(', ')}`);
  const ck = node([pm, '--root', r, '--check']);
  if (ck.status !== 0 || /t1_skip_globs/.test(ck.stderr)) sai.push(`--check exit ${ck.status}: ${ck.stderr.slice(0, 160)}`);
  return sai;
}
if (want('LT-114') && await chayCa('LT-114', lt114)) ok('LT-114', 'hồ sơ đổi ô rồi vẽ lại: chỉ LO-TRINH.html và PRODUCT-MAP.md đổi, --check xanh với miễn trừ sẵn có');
if (want('LT-114-do')) await chayDo('LT-114-do', lt114, [['scripts/product-map.mjs', 'if (trang != null) { writeFileSync(pagePath, trang); console.log(pagePath); }', "if (trang != null) { writeFileSync(pagePath, trang); writeFileSync(pagePath.replace(/html$/, 'json'), '{}'); console.log(pagePath); }"]], 'LO-TRINH.json', 'bản sao ghi thêm LO-TRINH.json');

// ── LT-115: --check canh cả khối ───────────────────────────────────────────
if (want('LT-115')) {
  try {
    const r = kho({ hoSo: { s1: 'dang-dung' }, data: { schema: 1, hang: [H('S1', { slug: 's1' })] } });
    const ck = () => node([PM, '--root', r, '--check']); const CAU = 'LO-TRINH.html lệch với tệp ý định và hồ sơ';
    if (node([PM, '--root', r]).status !== 0) throw new Error('lượt vẽ đầu đỏ');
    const c0 = ck(); if (c0.status !== 0) throw new Error(`đối chứng dương: trang vừa vẽ --check exit ${c0.status}: ${c0.stderr.slice(0, 120)}`);
    for (const [f, t] of Object.entries(HO_SO['da-ship']('s1'))) writeFileSync(path.join(r, '_acceptance', 's1', f), t);
    const c1 = ck(); if (c1.status === 1 && c1.stderr.includes(CAU)) ok('LT-115 ho-so-doi', `hồ sơ đổi ô, không vẽ lại: exit 1 «${CAU}»`); else bad('LT-115 ho-so-doi', `exit ${c1.status} «${c1.stderr.slice(0, 120)}»`);
    node([PM, '--root', r]); if (ck().status !== 0) throw new Error('vẽ lại sau hồ sơ đổi mà --check vẫn đỏ');
    const p = path.join(r, 'LO-TRINH.html'); const html = readFileSync(p, 'utf8'); const k = khoiCua(html); k.lo_trinh[0].hang[0].cau_giao += 'x';
    writeFileSync(p, datKhoi(html, k));
    const c2 = ck(); if (c2.status === 1 && c2.stderr.includes(CAU)) ok('LT-115 sua-khoi', `một chữ trong khối sửa tay: exit 1 «${CAU}»`); else bad('LT-115 sua-khoi', `exit ${c2.status}`);
    node([PM, '--root', r]); const c3 = ck(); if (c3.status === 0) ok('LT-115 ve-lai', 'vẽ lại: --check exit 0'); else bad('LT-115 ve-lai', `exit ${c3.status}`);
  } catch (e) { bad('LT-115', loi(e)); }
}

// ── LT-116: tất định — không giờ chạy, không múi giờ ───────────────────────
function veTZ(kit, r, tz, ngay) {
  const pre = path.join(TMP, `dh116-${++khoN}.mjs`);
  writeFileSync(pre, `const T = new Date('${ngay}T23:30:00Z').getTime(); const D = Date; globalThis.Date = class extends D { constructor(...a) { super(...(a.length ? a : [T])); } static now() { return T; } };\n`);
  const c = path.join(TMP, `tz-${++khoN}`); execFileSync('git', ['clone', '-q', r, c]);
  const x = node(['--import', pathToFileURL(pre).href, path.join(kit, 'scripts', 'product-map.mjs'), '--root', c], { env: { ...process.env, TZ: tz } });
  if (x.status !== 0) throw new Error(`vẽ TZ=${tz} exit ${x.status}`);
  return readFileSync(path.join(c, 'LO-TRINH.html'), 'utf8');
}
async function lt116(kit) {
  const r = KHO_110(); const a = veTZ(kit, r, 'UTC', '2026-10-08'); const b = veTZ(kit, r, 'Pacific/Kiritimati', '2026-10-09'); const sai = [];
  if (a !== b) { let i = 0; while (a[i] === b[i]) i++; sai.push(`hai lượt vẽ khác nhau ở byte ${i}: «${a.slice(i, i + 40)}»`); }
  // Ngày mốc khai + ngày ghi TRONG hồ sơ của kho (dải tóm tắt bản 2 mang ngày của hồ sơ — hàng X2): ngày
  // CHẠY vẫn là ngày lạ.
  const ngayKhai = new Set([...DATA_X1.moc.map(m => m.ngay), ...readdirSync(path.join(r, '_acceptance'), { recursive: true }).map(String).filter(f => /\.(md|jsonl|yaml)$/.test(f)).flatMap(f => readFileSync(path.join(r, '_acceptance', f), 'utf8').match(/\d{4}-\d{2}-\d{2}/g) || [])]);
  const m = a.match(KHOI_RE); const la = [...new Set(((m && m[1]) || '').match(/\d{4}-\d{2}-\d{2}/g) || [])].filter(d => !ngayKhai.has(d));
  if (!m) sai.push('không có khối'); if (la.length) sai.push(`khối mang ngày lạ ${la.join(', ')}`);
  return sai;
}
if (want('LT-116') && await chayCa('LT-116', lt116)) ok('LT-116', 'vẽ dưới hai đồng hồ, hai múi giờ: giống từng byte; khối chỉ mang ngày mốc kế hoạch khai');
if (want('LT-116-do')) await chayDo('LT-116-do', lt116, [['scripts/lo-trinh.mjs', 'return { khuon: ID_DU_LIEU, phien_ban: PHIEN_BAN_DU_LIEU,', 'return { ve_luc: new Date().toISOString(), khuon: ID_DU_LIEU, phien_ban: PHIEN_BAN_DU_LIEU,']], 'ngày lạ', 'bản sao ghi giờ vẽ vào khối');

// ── LT-117: chữ cắt thẻ trong ý định không phá trang ───────────────────────
const XAU_117 = 'a</script><script>x()</script><!--b--></SCRIPT ></sCrIpT\u2028c\u2029"d"';
async function lt117(kit) {
  const M = await napLT(kit); const sai = [];
  const r = kho({ data: { schema: 1, hang: [H('X', { cau_giao: XAU_117, vi_sao: `vì ${XAU_117}` })] } }); const html = veM(M, r);
  const m = html.match(KHOI_RE); if (!m) return ['không có khối'];
  const conLt = [...m[1].matchAll(/<[^<]{0,9}/g)].map(x => x[0]);
  if (conLt.length) sai.push(`khối còn ${conLt.length} ký tự < ở ${conLt.map(x => `«${x}»`).join(' ')}`);
  const n = (html.match(/<script/gi) || []).length; if (n !== 2) sai.push(`số thẻ <script trên trang ${n} ≠ 2`);
  let k = null; try { k = JSON.parse(m[1]); } catch (e) { sai.push(`khối không parse: ${e.message}`); }
  const h = k && k.lo_trinh[0].hang[0];
  if (h && (h.cau_giao !== XAU_117 || h.vi_sao !== `vì ${XAU_117}`)) sai.push(`chuỗi đọc lại khác gốc: «${JSON.stringify(h.cau_giao).slice(0, 80)}»`);
  if (!html.includes('&lt;/script&gt;')) sai.push('ô hiển thị không còn thoát chữ');
  return sai;
}
if (want('LT-117') && await chayCa('LT-117', lt117)) ok('LT-117', 'câu giao chứa </script> (mọi hoa thường), <!--, U+2028/2029, nháy: khối không còn <, đúng hai thẻ script, đọc lại đúng chuỗi gốc');
if (want('LT-117-do')) await chayDo('LT-117-do', lt117, [['scripts/lo-trinh.mjs', ".replace(/</g, '\\\\u003c')", '']], 'thẻ <script', 'bản sao bỏ bước thoát <');
if (want('LT-117-do chu-thuong')) await chayDo('LT-117-do chu-thuong', lt117, [['scripts/lo-trinh.mjs', ".replace(/</g, '\\\\u003c')", ".replace(/<\\/script/g, '\\\\u003c/script').replace(/<!--/g, '\\\\u003c!--')"]], '</SCRIPT', 'bản sao chỉ thoát </script và <!-- chữ thường');

// ── LT-118: bộ đọc mẫu khoan dung ──────────────────────────────────────────
async function lt118(kit) {
  const M = await napLT(kit); const B = await napLT(banGocX1()); const r = KHO_110();
  const tot = veM(M, r); const cu = veM(B, r); const sai = {};
  const doc = h => { try { return M.LT.docDuLieu(h); } catch (e) { return { nem: e.message }; } };
  const k = khoiCua(tot); const ca = {
    'dung-khuon': [tot, x => x.canhBao.length === 0 && deq(x.duLieu, k)],
    'trang-cu': [cu, x => x.duLieu === null && x.canhBao.length === 1 && x.canhBao[0].includes('trang chưa mang dữ liệu')],
    'json-hong': [tot.replace(KHOI_RE, '<script type="application/json" id="lo-trinh-du-lieu">{oops</script>'), x => x.duLieu === null && x.canhBao.length === 1 && x.canhBao[0].includes('không phải JSON hợp lệ')],
    'khuon-la': [datKhoi(tot, { khuon: 'khac', phien_ban: 1 }), x => x.duLieu === null && x.canhBao.length === 1 && x.canhBao[0].includes('«khac»')],
    'phien-ban-moi': [datKhoi(tot, (() => { const o = JSON.parse(JSON.stringify(k)); o.phien_ban = M.LT.PHIEN_BAN_DU_LIEU + 1; o.la = 1; delete o.lo_trinh[0].hang[0].co; delete o.lo_trinh[0].tien_do; return o; })()),
      x => x.duLieu && x.canhBao.length === 1 && x.canhBao[0].includes('mới hơn bộ đọc') && x.duLieu.la === 1 && deq(x.duLieu.lo_trinh[0].hang[0].co, []) && x.duLieu.lo_trinh[0].tien_do.tong === 0],
  };
  if (KHOI_RE.test(cu)) sai.dau = 'đối chứng: trang bản cũ đã có khối';
  for (const [ten, [html, dat]] of Object.entries(ca)) { const x = doc(html); if (x.nem) sai[ten] = `ném: ${x.nem}`; else if (!dat(x)) sai[ten] = `kết quả ${JSON.stringify(x).slice(0, 140)}`; }
  // Bản CHÉP RỜI của hàm (không còn phạm vi mô-đun — đúng thứ kho tiêu thụ chép): năm ca cho đúng kết quả
  // của bản trong mô-đun, và bảng khoá bên trong hàm == KHUON_DU_LIEU (khoá nó điền khi mọi khoá vắng).
  let tach = null;
  try { tach = new Function(`return (${M.LT.docDuLieu.toString()});`)(); } catch (e) { sai['chep-roi'] = `không dựng được bản chép rời: ${e.message}`; }
  if (tach) {
    for (const [ten, [html]] of Object.entries(ca)) { let a; try { a = tach(html); } catch (e) { a = { nem: e.message }; } const b = doc(html); if (!deq(a, b)) { sai['chep-roi'] = `ca ${ten}: bản chép rời ${JSON.stringify(a).slice(0, 120)} · bản mô-đun ${JSON.stringify(b).slice(0, 60)}`; break; } }
    const rongHet = { khuon: 'lo-trinh-du-lieu', phien_ban: 1, lo_trinh: [{ hang_ke: {}, tien_do: {}, can_sua: [{}], hang: [{}], moc: [{}], da_bac: [{}] }] };
    let d = null; try { d = tach(datKhoi(tot, rongHet)).duLieu; } catch (e) { sai['chep-roi'] ||= `bản chép rời ném: ${e.message}`; }
    const L = d && d.lo_trinh[0]; const KM = M.LT.KHUON_DU_LIEU;
    const cap = { goc: d, lo_trinh: L, hang_ke: L && L.hang_ke, tien_do: L && L.tien_do, can_sua: L && L.can_sua[0], hang: L && L.hang[0], moc: L && L.moc[0], da_bac: L && L.da_bac[0] };
    const lech = Object.entries(cap).filter(([c, o]) => !o || !tapBang(Object.keys(o), KM[c])).map(([c, o]) => `${c}: ${o ? lechTap(Object.keys(o), KM[c]) : 'vắng'}`);
    if (lech.length) sai['bang-khoa'] = `bảng khoá trong docDuLieu lệch KHUON_DU_LIEU — ${lech.join(' ; ')}`;
  }
  return sai;
}
if (want('LT-118')) {
  try {
    const s = await lt118(KIT); if (s.dau) bad('LT-118', s.dau);
    for (const ten of ['dung-khuon', 'trang-cu', 'json-hong', 'khuon-la', 'phien-ban-moi', 'chep-roi', 'bang-khoa']) if (want(`LT-118 ${ten}`)) { if (s[ten]) bad(`LT-118 ${ten}`, s[ten]); else ok(`LT-118 ${ten}`, 'đúng dữ liệu + đúng cảnh báo, không ném'); }
  } catch (e) { bad('LT-118', loi(e)); }
}
if (want('LT-118-do')) await chayDo('LT-118-do', async k => Object.entries(await lt118(k)).map(([t, m]) => `${t}: ${m}`), [['scripts/lo-trinh.mjs', 'if (Number(o.phien_ban) > PHIEN_BAN) canhBao.push(', "if (Number(o.phien_ban) > PHIEN_BAN) throw new Error('khuon moi'); if (false) canhBao.push("]], 'phien-ban-moi', 'bản sao bộ đọc ném khi khuôn mới hơn');
if (want('LT-118-do chep-roi')) await chayDo('LT-118-do chep-roi', async k => Object.entries(await lt118(k)).map(([t, m]) => `${t}: ${m}`), [['scripts/lo-trinh.mjs', "const ID = 'lo-trinh-du-lieu'; const PHIEN_BAN = 2;", "const ID = 'lo-trinh-du-lieu'; const PHIEN_BAN = PHIEN_BAN_DU_LIEU;"]], 'chep-roi', 'bản sao bộ đọc gọi một ký hiệu ngoài hàm');
if (want('LT-118-do bang-khoa')) await chayDo('LT-118-do bang-khoa', async k => Object.entries(await lt118(k)).map(([t, m]) => `${t}: ${m}`), [['scripts/lo-trinh.mjs', "    hang: ['ma', 'cau_giao', 'hang', 'nhom', 'dung_tren', 'trang_thai', 'nhom_trang_thai', 'ho_so',", "    hang: ['ma', 'cau_giao', 'hang', 'nhom', 'dung_tren', 'trang_thai', 'nhom_trang_thai',"]], 'ho_so', 'bản sao bảng khoá trong bộ đọc bỏ ho_so');

// ── LT-119: tài liệu kho tiêu thụ == khuôn trong mã ─────────────────────────
const TL = p => path.join(p, 'skills', 'acceptance', 'references', 'lo-trinh-du-lieu.md');
const khoiMd = (txt, ten) => { const m = String(txt).match(new RegExp(`<!-- <<<${ten} -->\\n\`\`\`[a-z]*\\n([\\s\\S]*?)\`\`\`\\n<!-- ${ten}>>> -->`)); return m ? m[1] : null; };
async function lt119(kit) {
  const M = await napLT(kit); const sai = [];
  const b = khoiMd(existsSync(TL(kit)) ? readFileSync(TL(kit), 'utf8') : '', 'LO-TRINH-DU-LIEU-KHOA'); if (b == null) return ['tài liệu thiếu khối LO-TRINH-DU-LIEU-KHOA'];
  const tl = {}; for (const l of b.split('\n').filter(Boolean)) { const m = l.match(/^([a-z_]+)\.([a-z_]+) — /); if (!m) { sai.push(`dòng khoá lạ: «${l}»`); continue; } (tl[m[1]] ||= []).push(m[2]); }
  const KM = M.LT.KHUON_DU_LIEU;
  for (const cap of new Set([...Object.keys(KM), ...Object.keys(tl)])) if (!tapBang(KM[cap] || [], tl[cap] || [])) sai.push(`cấp ${cap}: mã so tài liệu ${lechTap(KM[cap] || [], tl[cap] || [])}`);
  if (!readFileSync(path.join(KIT, 'GUIDE.md'), 'utf8').includes('references/lo-trinh-du-lieu.md')) sai.push('GUIDE.md không trỏ references/lo-trinh-du-lieu.md');
  return sai;
}
if (want('LT-119') && await chayCa('LT-119', lt119)) ok('LT-119', 'bảng khoá trong tài liệu kho tiêu thụ == KHUON_DU_LIEU ở mọi cấp; GUIDE trỏ tài liệu');
if (want('LT-119-do tai-lieu')) await chayDo('LT-119-do tai-lieu', lt119, [['skills/acceptance/references/lo-trinh-du-lieu.md', 'hang.ho_so — tên hồ sơ nghiệm thu đang nhận việc, hoặc null\n', '']], 'ho_so', 'bản sao tài liệu bỏ dòng khoá ho_so');
if (want('LT-119-do ma')) await chayDo('LT-119-do ma', lt119, [['scripts/lo-trinh.mjs', "\n  hang: ['ma',", "\n  hang: ['thu_nghiem', 'ma',"]], 'thu_nghiem', 'bản sao mã thêm khoá thu_nghiem');

// ── LT-120: luật so ngày của tài liệu == script của trang ───────────────────
// Script nội tuyến của CHÍNH trang chạy trong vm (DOM tối giản dựng từ các li của dải mốc) dưới một
// đồng hồ cố định và một múi giờ, trong một tiến trình con; luật của tài liệu chạy trên khối với «hôm
// nay» = ngày lịch địa phương của cùng đồng hồ. Hàng trễ so thêm với hangTre của lớp phân tích.
const CHAY_120 = `import vm from 'node:vm'; import { readFileSync } from 'node:fs';
const [html, luat, khoanh] = [readFileSync(process.argv[2], 'utf8'), readFileSync(process.argv[3], 'utf8'), process.argv[4]];
const T = Date.parse(khoanh); const D0 = Date; class FD extends D0 { constructor(...a) { super(...(a.length ? a : [T])); } static now() { return T; } }
const g = s => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const ols = [...html.matchAll(/<ol class="moc" data-the="([^"]*)">([\\s\\S]*?)<\\/ol>/g)].map(m => {
  const lis = [...m[2].matchAll(/<li data-ngay="([^"]*)" data-ten="([^"]*)"( data-con-viec)?>/g)].map(l => { const cls = new Set(); const con = { textContent: '' };
    return { cls, a: { 'data-ngay': g(l[1]), 'data-ten': g(l[2]) }, cv: !!l[3], getAttribute(k) { return this.a[k] ?? null; }, hasAttribute(k) { return k === 'data-con-viec' ? this.cv : k in this.a; }, querySelector() { return con; }, classList: { add: c => cls.add(c) } }; });
  return { lis, getAttribute: () => m[1], querySelectorAll: () => lis };
});
const document = { querySelectorAll: () => ols, getElementById: () => ({ textContent: '' }) };
const script = [...html.matchAll(/<script>([\\s\\S]*?)<\\/script>/g)].pop()[1];
vm.runInNewContext(script, { document, Date: FD });
const trang = ols.flatMap(o => o.lis.filter(l => l.cls.has('tre')).map(l => l.a['data-ten']));
const k = JSON.parse(html.match(/<script type="application\\/json" id="lo-trinh-du-lieu">([\\s\\S]*?)<\\/script>/)[1]);
const n = new FD(); const homNay = n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0');
const f = new Function(luat + '\\nreturn { mocQuaConViec, viecTre };')();
const L = k.lo_trinh[0];
console.log(JSON.stringify({ homNay, trang, thamChieu: L.moc.filter(m => f.mocQuaConViec(m, homNay)).map(m => m.ten), viecTre: f.viecTre(L, homNay) }));
`;
const KHO_120 = () => kho({ hoSo: { y: 'da-ship' }, data: { schema: 1, moc: [{ ten: 'Mốc Một', ngay: '2030-03-15', hang: ['X'] }, { ten: 'Mốc Xong', ngay: '2030-03-10', hang: ['Y'] }], hang: [H('X'), H('Y', { slug: 'y' })] } });
async function lt120(kit) {
  const M = await napLT(kit); const r = KHO_120(); const html = veM(M, r); const kq = phanBang(M, r).kq; const sai = [];
  const luat = khoiMd(existsSync(TL(kit)) ? readFileSync(TL(kit), 'utf8') : '', 'LO-TRINH-DU-LIEU-LUAT-NGAY'); if (luat == null) return ['tài liệu thiếu khối LO-TRINH-DU-LIEU-LUAT-NGAY'];
  const ph = path.join(TMP, `t120-${++khoN}.html`); const pl = path.join(TMP, `l120-${khoN}.js`); const pr = path.join(TMP, 'chay-120.mjs');
  writeFileSync(ph, html); writeFileSync(pl, luat); writeFileSync(pr, CHAY_120);
  const duong = {}; const bang = [];
  // Sáu ca chính: trưa giờ địa phương của ngày trước mốc · đúng ngày mốc · ngày sau mốc, ở mỗi múi giờ —
  // «hôm nay» của người xem PHẢI là đúng ngày đó (ca tự kiểm). Hai ca biên: cùng một khoảnh khắc 20:00Z
  // ngày mốc là ngày mốc ở UTC và ngày sau mốc ở UTC+7.
  const CA = [];
  for (const ngay of ['2030-03-14', '2030-03-15', '2030-03-16']) { CA.push([`${ngay}T12:00:00Z`, 'UTC', ngay]); CA.push([`${ngay}T05:00:00Z`, 'Asia/Ho_Chi_Minh', ngay]); }
  CA.push(['2030-03-15T20:00:00Z', 'UTC', '2030-03-15'], ['2030-03-15T20:00:00Z', 'Asia/Ho_Chi_Minh', '2030-03-16']);
  for (const [khoanh, tz, mong] of CA) {
    const x = node([pr, ph, pl, khoanh], { env: { ...process.env, TZ: tz } });
    if (x.status !== 0) { sai.push(`${ngay} ${tz}: tiến trình con exit ${x.status} ${x.stderr.slice(0, 120)}`); continue; }
    const o = JSON.parse(x.stdout); bang.push(`${khoanh.slice(5, 16)}/${tz}→${o.homNay}:[${o.trang}]`);
    if (o.homNay !== mong) sai.push(`đồng hồ ${khoanh} ở ${tz}: hôm nay ${o.homNay}, ca cần ${mong}`);
    if (!tapBang(o.trang, o.thamChieu)) sai.push(`hôm nay ${o.homNay} (${tz}): trang tô ${JSON.stringify(o.trang)} · luật tài liệu ${JSON.stringify(o.thamChieu)} — lệch ở mốc ${[...o.trang.filter(t => !o.thamChieu.includes(t)), ...o.thamChieu.filter(t => !o.trang.includes(t))].join(', ')}`);
    const kit2 = M.LT.hangTre(kq, o.homNay).map(h => h.ma);
    if (!tapBang([...new Set(kit2)], o.viecTre)) sai.push(`hôm nay ${o.homNay}: việc trễ luật tài liệu ${JSON.stringify(o.viecTre)} · lớp phân tích ${JSON.stringify(kit2)}`);
    if (o.trang.includes('Mốc Một') && mong === '2030-03-16') duong[tz] = true;
    if (o.trang.includes('Mốc Xong')) sai.push(`hôm nay ${o.homNay}: mốc đã xong bị tô còn việc`);
  }
  for (const tz of ['UTC', 'Asia/Ho_Chi_Minh']) if (!duong[tz]) sai.push(`đối chứng dương: ngày sau mốc ở ${tz} trang không tô «Mốc Một»`);
  console.log(`    · LT-120 tám ca: ${bang.join(' · ')}`);
  return sai;
}
if (want('LT-120') && await chayCa('LT-120', lt120)) ok('LT-120', 'ba ngày quanh mốc × hai múi giờ (trưa địa phương) + hai ca biên cùng khoảnh khắc: mốc trang tô «đã qua, còn việc» == luật so ngày của tài liệu; việc trễ == lớp phân tích');
if (want('LT-120-do')) await chayDo('LT-120-do', lt120, [['skills/acceptance/references/lo-trinh-du-lieu.md', 'moc.ngay < homNay && moc.con_viec', 'moc.ngay <= homNay && moc.con_viec']], 'lệch ở mốc Mốc Một', 'bản sao tài liệu đổi «trước» thành «trước hoặc bằng»');

// ═══ Vòng lo-trinh-cat-luot (LT-130..LT-141) ═══════════════════════════════════════════════════
// Hồ sơ _acceptance/lo-trinh-cat-luot/ (lát 2, hàng L2): răng phủ + nhịp (scripts/cat-luot.mjs), skill
// cắt lượt, dòng bước kế trên trang. Bản phạm vi thử sinh bằng `vietPV`, rút khuôn dòng từ khối mẫu
// PHAM-VI-MA của chính tệp khuôn (round-trip writer/reader). Bộ vẽ «trước vòng» = git archive 83a9a991 (nhánh chính lúc gộp,
// đã có khối dữ liệu của X1, chưa có bước kế — vòng gộp sau cập nhật mốc so, ghi ở Notes hợp đồng).
const GOC_L2 = '83a9a991';
let gocL2Dir = null;
function banGocL2() {
  if (gocL2Dir) return gocL2Dir;
  const d = path.join(TMP, 'goc-l2'); mkdirSync(d, { recursive: true });
  execFileSync('tar', ['-x', '-C', d], { input: execFileSync('git', ['-C', KIT, 'archive', '--format=tar', GOC_L2, 'scripts', 'lib', 'skills'], { maxBuffer: 1 << 28 }) });
  return (gocL2Dir = d);
}
const khoiMdL2 = (txt, ten) => { const m = String(txt).match(new RegExp(`<!-- <<<${ten} -->\\n\`\`\`[a-z]*\\n([\\s\\S]*?)\`\`\`\\n<!-- ${ten}>>> -->`)); return m ? m[1] : null; };
const KHUON_PV = kit => readFileSync(path.join(kit, 'skills', 'acceptance', 'references', 'pham-vi-template.md'), 'utf8');
const napCL = async kit => import(pathToFileURL(path.join(kit, 'scripts', 'cat-luot.mjs')).href + `?v=${++bsN}`);
// Dòng mã mẫu của khuôn → hàm ghi: thay mã và mô tả, giữ nguyên mọi ký tự khung.
function vietPV({ dot, dang = 'chuoi', nguon = 'kho thử', ma }, kit = KIT) {
  const khoi = khoiMdL2(KHUON_PV(kit), 'PHAM-VI-MA'); if (khoi == null) throw new Error('khuôn bản phạm vi thiếu khối PHAM-VI-MA');
  const mau = khoi.split('\n').find(l => l.startsWith('- `')); const m = mau.match(/^(- `)[^`]*(` — ).*$/);
  if (!m) throw new Error(`dòng mã mẫu của khuôn không đọc được: ${mau}`);
  return `# Bản phạm vi thử\n\ndot: ${dot}\ndang: ${dang}\nnguon: ${nguon}\n\n${ma.map(([c, t]) => `${m[1]}${c}${m[2]}${t || `mô tả ${c}`}`).join('\n')}\n`;
}
// Kho thử có bản phạm vi + tệp lộ trình (đã commit trừ khi `chuaAdd`).
function khoCL({ pv, lt, chuaAdd = [] }) {
  const r = kho({ data: lt, tep: 'docs/plan/lo-trinh.json' });
  if (pv != null) { mkdirSync(path.join(r, 'docs', 'plan'), { recursive: true }); writeFileSync(path.join(r, 'docs', 'plan', 'pham-vi.md'), pv); }
  if (pv != null && !chuaAdd.includes('pv')) { git(r, 'add', '-A'); git(r, 'commit', '-qm', 'pham vi'); }
  if (chuaAdd.includes('lt')) { git(r, 'rm', '-q', '--cached', 'docs/plan/lo-trinh.json'); git(r, 'commit', '-qm', 'go lt'); }
  return r;
}
const chayCL = (kit, r, args) => node([path.join(kit, 'scripts', 'cat-luot.mjs'), '--root', r, ...args]);
const rang = (kit, r) => chayCL(kit, r, ['--pham-vi', 'docs/plan/pham-vi.md', '--lo-trinh', 'docs/plan/lo-trinh.json']);
const dongLoi = x => x.stdout.split('\n').filter(l => l.startsWith('lỗi: '));
const MA6 = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'].map(c => [c]);
const LT_GOC = () => ({ schema: 1, hang: [H('R1', { dot: 'd1', phu: ['P1', 'P2'] }), H('R2', { dot: 'd1', phu: ['P3', 'P4'], dung_tren: ['R1'] })],
  chan_troi: [{ ma: 'H1', dot: 'd1', cau_giao: '«việc sau»', ly_do: 'chờ dữ liệu thật', phu: ['P5', 'P6'] }] });

// ── LT-130: bộ đọc bản phạm vi ──────────────────────────────────────────────
async function lt130(kit) {
  const C = await napCL(kit); const sai = [];
  const khoi = khoiMdL2(KHUON_PV(kit), 'PHAM-VI-MA'); if (khoi == null) return ['khuôn thiếu khối PHAM-VI-MA'];
  const mongMa = [...khoi.matchAll(/^- `([^`]+)`/gm)].map(m => m[1]);
  const a = C.docPhamVi(khoi);
  if (!mongMa.length) sai.push('đối chứng: khối mẫu không có mã nào');
  if (!deq(a.ma.map(x => x.ma), mongMa) || a.loi.length || a.dot !== 'mau-1' || a.dang !== 'chuoi' || !a.nguon) sai.push(`khối mẫu: ${JSON.stringify({ dot: a.dot, dang: a.dang, ma: a.ma.map(x => x.ma), loi: a.loi })}`);
  const dongMau = khoi.split('\n').find(l => l.startsWith('- `'));
  const CA = {
    'ma-trung': [khoi + dongMau + '\n', 'mã trùng trong bản phạm vi: A1'],
    'thieu-gach': [khoi + '- `Z9` mô tả không có gạch\n', `dòng sai khuôn ${khoi.split('\n').length}: - \`Z9\` mô tả không có gạch`],
    'ma-rong': [khoi + '- `` — mô tả\n', 'dòng sai khuôn'],
    'dang-la': [khoi.replace('dang: chuoi', 'dang: khac'), 'dang «khac»'],
  };
  for (const [ten, [txt, ghim]] of Object.entries(CA)) { const x = C.docPhamVi(txt); if (!x.loi.some(l => l.includes(ghim))) sai.push(`${ten}: không báo «${ghim}» — ${JSON.stringify(x.loi)}`); }
  const r = khoCL({ pv: '# rỗng\n\ndot: d1\ndang: chuoi\n', lt: LT_GOC() });
  const x = rang(kit, r); if (x.status !== 2 || !/không đọc ra mã nào/.test(x.stderr)) sai.push(`không mã: exit ${x.status} «${x.stderr.trim()}»`);
  return sai;
}
if (want('LT-130') && await chayCa('LT-130', lt130)) ok('LT-130', 'khối mẫu PHAM-VI-MA đọc ra đúng ba khoá + mọi mã của khối; mã trùng · dòng thiếu gạch · mã rỗng · dang lạ đều báo; không mã → thoát 2');
if (want('LT-130-do')) await chayDo('LT-130-do', lt130, [['scripts/cat-luot.mjs', "if (!m || !m[1].trim()) { loi.push(`dòng sai khuôn ${i + 1}: ${dong.trim()}`); return; }", 'if (!m || !m[1].trim()) return;']], 'dòng sai khuôn', 'bản sao bộ đọc bỏ lặng dòng sai khuôn');

// ── LT-131: răng phủ — ma trận toàn phần ─────────────────────────────────────
const MA_TRAN_131 = {
  vang: [lt => { lt.chan_troi[0].phu = ['P5']; }, ['mã P6 không ở hàng hay mục chờ điều kiện nào']],
  'hai-hang': [lt => { lt.hang[1].phu.push('P1'); }, ['mã P1 ở hai chỗ', 'hàng R1', 'hàng R2']],
  'hang-chan-troi': [lt => { lt.chan_troi[0].phu.push('P3'); }, ['mã P3 ở hai chỗ', 'hàng R2', 'chờ điều kiện H1']],
  'ma-la': [lt => { lt.hang[0].phu.push('Q9'); }, ['hàng R1 phủ mã Q9']],
  'chua-cat': [lt => { for (const h of lt.hang) delete h.dot; lt.chan_troi = []; }, ['chưa cắt', '6 mã']],
};
const IM_131 = { 'khac-dot': lt => { lt.hang.push(H('R9', { dot: 'd0', phu: ['P1'] })); }, 'khong-dot': lt => { lt.hang.push(H('R8', { phu: ['P1'] })); } };
async function lt131(kit) {
  const sai = []; const pv = vietPV({ dot: 'd1', ma: MA6 });
  const x0 = rang(kit, khoCL({ pv, lt: LT_GOC() }));
  const bang = x0.stdout.split('\n').filter(l => /^ {2}\S+ → /.test(l));
  if (x0.status !== 0 || bang.length !== 6 || !bang.includes('  P1 → hàng R1') || !bang.includes('  P6 → chờ điều kiện H1')) return [`đối chứng dương: exit ${x0.status}, bảng ${JSON.stringify(bang)} ${x0.stderr.trim()}`];
  let so = 0;
  for (const [ten, [sua, ghim]] of Object.entries(MA_TRAN_131)) {
    so += 1; const lt = LT_GOC(); sua(lt); const x = rang(kit, khoCL({ pv, lt })); const l = dongLoi(x);
    if (x.status !== 1 || l.length !== 1 || !ghim.every(g => l[0].includes(g))) sai.push(`${ten}: exit ${x.status}, lỗi ${JSON.stringify(l)}`);
  }
  for (const [ten, sua] of Object.entries(IM_131)) { const lt = LT_GOC(); sua(lt); const x = rang(kit, khoCL({ pv, lt })); if (x.status !== 0) sai.push(`${ten}: exit ${x.status}, lỗi ${JSON.stringify(dongLoi(x))}`); }
  if (so !== Object.keys(MA_TRAN_131).length || so !== 5) sai.push(`ma trận đo ${so} ca, cần 5`);
  console.log(`    · LT-131 ma trận: ${so} ca đỏ (${Object.keys(MA_TRAN_131).join(', ')}) + ${Object.keys(IM_131).length} ca im`);
  return sai;
}
if (want('LT-131') && await chayCa('LT-131', lt131)) ok('LT-131', 'đủ phủ → bảng 6 dòng; 5 ca đỏ mỗi ca đúng một dòng lỗi nêu mã/chỗ (chưa cắt nén một dòng); khác đợt · không dot → im');
if (want('LT-131-do')) await chayDo('LT-131-do', lt131, [['scripts/cat-luot.mjs', 'const trongDot = r => chuoi(r.dot) === pv.dot;', 'const trongDot = r => true;']], 'khac-dot', 'bản sao răng đếm mọi mục bất kể đợt');

// ── LT-132: chân trời có lý do ──────────────────────────────────────────────
async function lt132(kit) {
  const sai = []; const pv = vietPV({ dot: 'd1', ma: MA6 });
  for (const [ten, v] of [['vang', undefined], ['trang', '  ']]) {
    const lt = LT_GOC(); if (v === undefined) delete lt.chan_troi[0].ly_do; else lt.chan_troi[0].ly_do = v;
    const x = rang(kit, khoCL({ pv, lt })); if (x.status !== 1 || !dongLoi(x).some(l => l.includes('chờ điều kiện H1: thiếu ly_do'))) sai.push(`${ten}: không báo «chờ điều kiện H1: thiếu ly_do» — exit ${x.status} ${JSON.stringify(dongLoi(x))}`);
  }
  const x = rang(kit, khoCL({ pv, lt: LT_GOC() })); if (x.stdout.includes('thiếu ly_do')) sai.push('đối chứng: có lý do mà vẫn báo thiếu ly_do');
  return sai;
}
if (want('LT-132') && await chayCa('LT-132', lt132)) ok('LT-132', 'chân trời cùng đợt thiếu hoặc rỗng ly_do → thoát 1 nêu H1; có lý do → im');
if (want('LT-132-do')) await chayDo('LT-132-do', lt132, [['scripts/cat-luot.mjs', "  for (const c of ct) if (!chuoi(c.ly_do)) loi.push(`chờ điều kiện ${chuoi(c.ma) || '?'}: thiếu ly_do`);\n", '']], 'ly_do', 'bản sao bỏ luật lý do chân trời');

// ── LT-133: khuôn lộ trình — trong đợt đỏ, ngoài đợt cảnh báo ───────────────
async function lt133(kit) {
  const M = await napLT(kit); const sai = []; const pv = vietPV({ dot: 'd1', ma: MA6 });
  const hangMa = (lt, ma) => lt.hang.find(h => h.ma === ma);
  const HONG = {
    'thieu-cau-giao': (lt, ma) => { delete hangMa(lt, ma).cau_giao; },
    'ma-trung': (lt, ma, dot) => { lt.hang.push(H(ma, { dot })); },
    'dung-tren-chuoi': (lt, ma) => { hangMa(lt, ma).dung_tren = 'R1'; },
    'dung-tren-khong-co': (lt, ma) => { hangMa(lt, ma).dung_tren = ['Z']; },
  };
  for (const [ten, sua] of Object.entries(HONG)) {
    for (const trong of [true, false]) {
      // Trong đợt: làm hỏng hàng R2 (đợt d1). Ngoài đợt: làm hỏng hàng R6 của đợt «cu», đợt d1 nguyên vẹn.
      const lt = LT_GOC(); if (!trong) lt.hang.push(H('R5', { dot: 'cu' }), H('R6', { dot: 'cu', dung_tren: ['R5'] }));
      const dich = trong ? 'R2' : 'R6'; sua(lt, dich, trong ? 'd1' : 'cu');
      const mong = M.LT.kiemKhuon(lt).co.filter(c => c.includes(`hàng ${dich}`) || c === `mã trùng: ${dich}`);
      if (ten === 'dung-tren-khong-co') mong.push(`hàng ${dich}: đứng trên mã không có: Z`);
      const x = rang(kit, khoCL({ pv, lt })); const nhom = trong ? 'lỗi: ' : 'cảnh báo: ';
      const ma = trong ? 1 : 0;
      if (!mong.length) { sai.push(`${ten} ${trong ? 'trong' : 'ngoài'} đợt: đối chứng — không có cờ mong đợi`); continue; }
      const thieu = mong.filter(c => !x.stdout.includes(nhom + c));
      if (x.status !== ma || thieu.length) sai.push(`${ten} ${trong ? 'trong' : 'ngoài'} đợt: exit ${x.status}, thiếu ${JSON.stringify(thieu)} — ${x.stdout.split('\n').filter(l => /^(lỗi|cảnh báo)/.test(l)).join(' | ').slice(0, 200)}`);
    }
  }
  const k1 = M.LT.kiemKhuon({ hang: [H('A', { phu: 'X1' })] }).co; if (!k1.includes('hàng A: phu phải là một mảng')) sai.push(`phu chuỗi: ${JSON.stringify(k1)}`);
  const k2 = M.LT.kiemKhuon({ hang: [H('A')], chan_troi: ['x'] }).co; if (!k2.includes('chan_troi #1 không phải object')) sai.push(`chan_troi: ${JSON.stringify(k2)}`);
  const tpl = JSON.parse(readFileSync(path.join(kit, 'skills', 'acceptance', 'references', 'lo-trinh-template.json'), 'utf8'));
  if (M.LT.kiemKhuon(tpl).co.length || !tpl.hang.some(h => Array.isArray(h.phu) && h.dot) || !Array.isArray(tpl.chan_troi) || !tpl.chan_troi.length) sai.push('khuôn lộ trình: cần 0 cờ, ≥1 hàng có phu+dot, khối chan_troi');
  const C = await napCL(kit); const kp = C.kiemPhu(C.docPhamVi(khoiMdL2(KHUON_PV(kit), 'PHAM-VI-MA')), tpl);
  if (kp.loi.length || kp.bang.some(b => !b.cho)) sai.push(`hai khuôn không phủ nhau: ${JSON.stringify(kp.loi)}`);
  return sai;
}
if (want('LT-133') && await chayCa('LT-133', lt133)) ok('LT-133', 'bốn hỏng khuôn ở hàng cùng đợt → thoát 1 in nguyên văn cờ; ở hàng đợt khác → cảnh báo, thoát 0; phu/chan_troi sai kiểu có cờ; hai khuôn mẫu phủ nhau, 0 cờ');
if (want('LT-133-do')) await chayDo('LT-133-do', lt133, [['scripts/lo-trinh.mjs', "    if (r.phu !== undefined && !Array.isArray(r.phu)) co.push(`hàng ${nhan}: phu phải là một mảng`);\n", '']], 'phu', 'bản sao kiemKhuon bỏ luật phu');

// ── LT-134: chỉ nhận tệp có trong git ───────────────────────────────────────
async function lt134(kit) {
  const sai = []; const pv = vietPV({ dot: 'd1', ma: MA6 });
  const a = khoCL({ pv, lt: LT_GOC(), chuaAdd: ['pv'] }); const x = rang(kit, a);
  if (x.status !== 2 || !x.stderr.includes('bản phạm vi phải là tệp có trong git') || x.stdout.includes('bảng phủ')) sai.push(`pv-chua-add: exit ${x.status} «${x.stderr.trim()}»`);
  git(a, 'add', '-A'); git(a, 'commit', '-qm', 'add'); const x2 = rang(kit, a); if (x2.status !== 0) sai.push(`đối chứng: sau commit exit ${x2.status} ${x2.stderr.trim()}`);
  const b = khoCL({ pv, lt: LT_GOC(), chuaAdd: ['lt'] }); const y = rang(kit, b);
  if (y.status !== 2 || !y.stderr.includes('tệp lộ trình phải là tệp có trong git')) sai.push(`lt-chua-add: exit ${y.status} «${y.stderr.trim()}»`);
  const c = khoCL({ pv, lt: LT_GOC() }); const ngoai = path.join(TMP, `pv-ngoai-${++khoN}.md`); writeFileSync(ngoai, pv);
  const z = chayCL(kit, c, ['--pham-vi', ngoai, '--lo-trinh', 'docs/plan/lo-trinh.json']);
  if (z.status !== 2 || !z.stderr.includes('bản phạm vi phải là tệp có trong git')) sai.push(`ngoai-kho: exit ${z.status} «${z.stderr.trim()}»`);
  return sai;
}
if (want('LT-134') && await chayCa('LT-134', lt134)) ok('LT-134', 'bản phạm vi / tệp lộ trình chưa add hoặc ngoài kho → thoát 2 nêu câu, không bảng phủ; sau commit chạy được');
if (want('LT-134-do')) await chayDo('LT-134-do', lt134, [['scripts/cat-luot.mjs', 'if (!trongGit(tepPv)) thoat(2,', 'if (false) thoat(2,']], 'pv-chua-add', 'bản sao bỏ kiểm git của bản phạm vi');

// ── LT-135: luật ngày và mốc ────────────────────────────────────────────────
async function lt135(kit) {
  const sai = []; const pv = vietPV({ dot: 'd1', ma: MA6 });
  const ngay = (lt, a, b) => { lt.hang[0].ngay = a; lt.hang[1].ngay = b; return lt; };
  const CA = {
    'nguoc-thu-tu': [ngay(LT_GOC(), '2026-11-10', '2026-11-05'), 1, 'hàng R2: ngày 2026-11-05 sớm hơn ngày 2026-11-10 của hàng R1'],
    'qua-moc': [Object.assign(ngay(LT_GOC(), '2026-11-01', '2026-11-25'), { moc: [{ ten: 'M', ngay: '2026-11-20', hang: ['R2'] }] }), 1, 'hàng R2: ngày 2026-11-25 muộn hơn mốc «M» 2026-11-20'],
    'thieu-ngay': [ngay(LT_GOC(), '', '2026-11-05'), 0, null],
    'dung-thu-tu': [Object.assign(ngay(LT_GOC(), '2026-11-01', '2026-11-05'), { moc: [{ ten: 'M', ngay: '2026-11-20', hang: ['R2'] }] }), 0, null],
  };
  for (const [ten, [lt, ma, ghim]] of Object.entries(CA)) {
    const x = rang(kit, khoCL({ pv, lt }));
    if (x.status !== ma || (ghim && !dongLoi(x).some(l => l.includes(ghim)))) sai.push(`${ten}: exit ${x.status} ${JSON.stringify(dongLoi(x))}`);
  }
  const lt = LT_GOC(); lt.hang.push(H('C1', { dot: 'cu', ngay: '2026-12-01' }), H('C2', { dot: 'cu', dung_tren: ['C1'], ngay: '2026-11-01' })); lt.moc = [{ ten: 'Cũ', ngay: '2026-10-01', hang: ['C1'] }];
  const y = rang(kit, khoCL({ pv, lt }));
  if (y.status !== 0 || !y.stdout.includes('cảnh báo: hàng C2: ngày 2026-11-01 sớm hơn') || !y.stdout.includes('cảnh báo: hàng C1: ngày 2026-12-01 muộn hơn mốc')) sai.push(`ngoai-dot: exit ${y.status} ${y.stdout.split('\n').filter(l => /^(lỗi|cảnh báo)/.test(l)).join(' | ')}`);
  return sai;
}
async function lt135crm(kit) {
  const { _nguon, ...okr } = JSON.parse(readFileSync(path.join(FX, 'crm-okr.json'), 'utf8')); void _nguon;
  if (okr.hang.some(h => h && ['XN1', 'XN2'].includes(h.ma))) return ['đối chứng: mã thử XN1/XN2 đã có trong lộ trình crm'];
  okr.hang.push(H('XN1', { dot: 'moi', phu: ['M1'] }), H('XN2', { dot: 'moi', phu: ['M2'], dung_tren: ['XN1'] }));
  const x = rang(kit, khoCL({ pv: vietPV({ dot: 'moi', ma: [['M1'], ['M2']] }), lt: okr }));
  const cb = x.stdout.split('\n').filter(l => l.startsWith('cảnh báo: ')).length;
  console.log(`    · LT-135 crm-okr: ${okr.hang.length} hàng, ${cb} dòng cảnh báo từ hàng cắt tay`);
  return x.status === 0 && !dongLoi(x).length ? [] : [`exit ${x.status} ${JSON.stringify(dongLoi(x)).slice(0, 200)}`];
}
if (want('LT-135') && await chayCa('LT-135', lt135)) ok('LT-135', 'ngược thứ tự · quá mốc → thoát 1 nêu hàng và hai ngày; thiếu ngày · đúng thứ tự → 0; hàng ngoài đợt lệch → cảnh báo, thoát 0');
if (want('LT-135 crm-okr') && await chayCa('LT-135 crm-okr', lt135crm)) ok('LT-135 crm-okr', 'lộ trình OKR thật của crm + một đợt mới sạch → thoát 0, 0 lỗi');
if (want('LT-135-do')) await chayDo('LT-135-do', lt135, [['scripts/cat-luot.mjs', 'if (NGAY_RE.test(nt) && n < nt)', 'if (NGAY_RE.test(nt) && n > nt)']], 'dung-thu-tu', 'bản sao đảo phép so ngày');

// ── LT-136: nhịp đo từ hồ sơ ────────────────────────────────────────────────
const HD_NHIP = (tier, { approved, veto }) => `---\nschema_version: 1\nfeature: x\nslug: x\nowner: x@y.z\nrisk_tier: ${tier}\nsurfaces: [cli]\nstatus: signed-off\napproved_by: ${approved ? 'M' : ''}\napproved_at: ${approved ? `${approved}T03:00:00Z` : ''}\n${veto ? `veto_state: mo\nveto_opened_at: ${veto}T03:00:00Z\n` : ''}---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n`;
const EV_NHIP = ky => `---\nschema_version: 2\nfeature_slug: x\nverdict: PASS\nhuman_signoff: ${ky}\n---\n`;
const congNgay = (d, n) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 864e5).toISOString().slice(0, 10);
async function lt136(kit) {
  const sai = []; const r = kho({ khoa: false });
  const HS = [['t2-a', 'T2', 2, 'approved'], ['t2-b', 'T2', 4, 'approved'], ['t2-c', 'T2', 9, 'veto'], ['t3-a', 'T3', 3, 'approved'], ['t3-b', 'T3', 7, 'approved']];
  for (const [s, tier, n, kieu] of HS) { const d = path.join(r, '_acceptance', s); mkdirSync(d, { recursive: true }); const dau = '2026-09-01';
    writeFileSync(path.join(d, 'contract.md'), HD_NHIP(tier, kieu === 'veto' ? { veto: dau } : { approved: dau })); writeFileSync(path.join(d, 'evidence-report.md'), EV_NHIP(`Manh Phan ${congNgay(dau, n)}`)); }
  for (const [s, ky] of [['thieu-ngay', 'Manh Phan'], ['chua-ky', '']]) { const d = path.join(r, '_acceptance', s); mkdirSync(d, { recursive: true }); writeFileSync(path.join(d, 'contract.md'), HD_NHIP('T2', { approved: '2026-09-01' })); writeFileSync(path.join(d, 'evidence-report.md'), EV_NHIP(ky)); }
  const tv = a => { const b = [...a].sort((x, y) => x - y); const g = b.length >> 1; return b.length % 2 ? b[g] : (b[g - 1] + b[g]) / 2; };
  const mong = h => { const a = HS.filter(x => x[1] === h).map(x => x[2]); return { n: a.length, trung_vi: tv(a) }; };
  const x = chayCL(kit, r, ['--nhip']); let j = null; try { j = JSON.parse(x.stdout); } catch { return [`--nhip không ra JSON: exit ${x.status} ${x.stderr.trim()}`]; }
  for (const h of ['T2', 'T3']) if (!deq(j.hang[h], mong(h))) sai.push(`${h}: ${JSON.stringify(j.hang[h])} ≠ ${JSON.stringify(mong(h))}`);
  if (j.bo_qua !== 1 || j.tong !== 6) sai.push(`bo_qua ${j.bo_qua} (cần 1) · tong ${j.tong} (cần 6)`);
  const e = JSON.parse(chayCL(kit, kho({ khoa: false }), ['--nhip']).stdout);
  if (!['T1', 'T2', 'T3'].every(h => deq(e.hang[h], { n: 0 }))) sai.push(`kho rỗng: ${JSON.stringify(e.hang)}`);
  return sai;
}
async function lt136that(kit) {
  const x = chayCL(kit, KIT, ['--nhip']); const j = JSON.parse(x.stdout);
  console.log(`    · LT-136 kho-that: T2 n ${j.hang.T2.n} trung vị ${j.hang.T2.trung_vi} · T3 n ${j.hang.T3.n} · bo_qua ${j.bo_qua}/${j.tong}`);
  return j.hang.T2.n >= 10 && j.bo_qua * 2 <= j.tong ? [] : [`kho thật: T2 n ${j.hang.T2.n}, bo_qua ${j.bo_qua}/${j.tong}`];
}
if (want('LT-136') && await chayCa('LT-136', lt136)) ok('LT-136', 'trung vị theo hạng == tính từ ngày dựng; veto_opened_at làm mốc đầu ở làn V; thiếu ngày ký → bỏ qua; kho rỗng → n 0');
if (want('LT-136 kho-that') && await chayCa('LT-136 kho-that', lt136that)) ok('LT-136 kho-that', 'hồ sơ đã ký thật của kit: T2 n ≥ 10, bỏ qua ≤ một nửa');
if (want('LT-136-do')) await chayDo('LT-136-do', lt136, [['scripts/cat-luot.mjs', " || ngayDau(frontmatterField(c, 'veto_opened_at'))", '']], 'T2', 'bản sao bỏ nhánh veto_opened_at');
if (want('LT-136-do dinh-dang')) await chayDo('LT-136-do dinh-dang', lt136that, [['scripts/cat-luot.mjs', "const ngayDau = s => { const m = String(s ?? '').match(/\\d{4}-\\d{2}-\\d{2}/);", "const ngayDau = s => { const m = String(s ?? '').match(/\\d{2}\\/\\d{2}\\/\\d{4}/);"]], 'bo_qua', 'bản sao bộ đọc ngày đòi DD/MM/YYYY');

// ── LT-137: răng không ghi gì ───────────────────────────────────────────────
function chupCay(r) { const ra = {}; const di = d => { for (const e of readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) di(p); else ra[path.relative(r, p)] = sha(p); } }; di(r); return ra; }
async function lt137(kit) {
  const sai = []; const r = khoCL({ pv: vietPV({ dot: 'd1', ma: MA6 }), lt: LT_GOC() });
  const doi = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(f => a[f] !== b[f]);
  // Lượt xanh: chụp trước/sau CHÍNH lượt đó.
  const truoc = chupCay(r); const x = rang(kit, r); const sau1 = chupCay(r);
  if (x.status !== 0) sai.push(`đối chứng: lượt xanh exit ${x.status}`);
  const d1 = doi(truoc, sau1); if (d1.length) sai.push(`tệp đổi sau lượt xanh: ${d1.join(', ')}`);
  // Lượt đỏ + nhịp trên cùng kho sau khi commit tệp lộ trình hỏng phủ.
  const lt = LT_GOC(); lt.chan_troi = [];
  writeFileSync(path.join(r, 'docs', 'plan', 'lo-trinh.json'), JSON.stringify(lt)); git(r, 'commit', '-qam', 'do'); const truoc2 = chupCay(r);
  if (!doi(sau1, truoc2).length) sai.push('đối chứng: commit ca đỏ không đổi cây');
  const y = rang(kit, r); chayCL(kit, r, ['--nhip']); const sau = chupCay(r);
  if (y.status !== 1) sai.push(`đối chứng: lượt đỏ exit ${y.status}`);
  const moi = doi(truoc2, sau); if (moi.length) sai.push(`tệp đổi sau lượt đỏ và nhịp: ${moi.join(', ')}`);
  if (git(r, 'status', '--porcelain', '--untracked-files=all')) sai.push(`git status: ${git(r, 'status', '--porcelain')}`);
  return sai;
}
if (want('LT-137') && await chayCa('LT-137', lt137)) ok('LT-137', 'ba lượt (xanh · đỏ · nhịp): băm mọi tệp kể cả .git không đổi, git status rỗng');
if (want('LT-137-do')) await chayDo('LT-137-do', lt137, [['scripts/cat-luot.mjs', "  process.stdout.write(ra.join('\\n') + '\\n');", "  process.stdout.write(ra.join('\\n') + '\\n'); (await import('node:fs')).writeFileSync(path.join(root, 'bang-phu.txt'), ra.join('\\n'));"]], 'bang-phu.txt', 'bản sao răng ghi bảng phủ ra tệp');

// ── LT-138: skill — lệnh chạy nguyên văn, sáu luật, hai dáng, thứ tự ─────────
async function lt138(kit) {
  const sai = []; const sk = readFileSync(path.join(kit, 'skills', 'cat-luot', 'SKILL.md'), 'utf8');
  const lenh = ten => { const b = khoiMdL2(sk, ten); if (b == null) throw new Error(`SKILL thiếu khối ${ten}`); return b.trim(); };
  const env = { ...process.env, CLAUDE_PLUGIN_ROOT: kit }; delete env.AG;
  const chay = (r, ten) => spawnSync('bash', ['-c', lenh(ten).replace('<bản phạm vi>', 'docs/plan/pham-vi.md').replace('<tệp lộ trình>', 'docs/plan/lo-trinh.json')], { cwd: r, encoding: 'utf8', env });
  const pv = vietPV({ dot: 'd1', ma: MA6 }); const lt = LT_GOC(); const lt2 = LT_GOC(); lt2.chan_troi = [];
  const a = chay(khoCL({ pv, lt }), 'CAT-LUOT-RANG'); const b = chay(khoCL({ pv, lt: lt2 }), 'CAT-LUOT-RANG'); const c = chay(khoCL({ pv, lt }), 'CAT-LUOT-NHIP');
  if (a.status !== 0) sai.push(`CAT-LUOT-RANG ca xanh exit ${a.status} «${a.stderr.trim()}»`);
  if (b.status !== 1) sai.push(`CAT-LUOT-RANG ca đỏ exit ${b.status} «${b.stderr.trim()}»`);
  try { if (c.status !== 0 || !JSON.parse(c.stdout).hang) throw new Error(); } catch { sai.push(`CAT-LUOT-NHIP exit ${c.status} «${c.stderr.trim()}»`); }
  const sau = lenh('CAT-LUOT-SAU-LUAT').split('\n').filter(Boolean);
  if (sau.length !== 6 || !sau.every((l, i) => l.startsWith(`${i + 1}. `))) sai.push(`CAT-LUOT-SAU-LUAT: ${sau.length} dòng`);
  for (const t of ['`chuoi`', '`lan-va`', 'morphological-scan']) if (!sk.includes(t)) sai.push(`SKILL thiếu ${t}`);
  const b4 = sk.slice(sk.indexOf('## Bước 4')); const vt = ['**Ghi hàng**', '**Chạy răng:**', '**Xanh mới mở PR**'].map(t => b4.indexOf(t));
  if (vt.some(v => v < 0) || !(vt[0] < vt[1] && vt[1] < vt[2])) sai.push(`thứ tự bước 4: ${JSON.stringify(vt)}`);
  return sai;
}
if (want('LT-138') && await chayCa('LT-138', lt138)) ok('LT-138', 'khối lệnh răng và nhịp của SKILL chạy nguyên văn (xanh 0 · đỏ 1 · nhịp JSON); sáu luật đánh số; hai dáng; Core quét hình thái; ghi hàng → răng → mở PR');
if (want('LT-138-do')) await chayDo('LT-138-do', lt138, [['skills/cat-luot/SKILL.md', '--root . --pham-vi <bản phạm vi>', '--root . --pham_vi <bản phạm vi>']], 'CAT-LUOT-RANG', 'bản sao SKILL gõ sai cờ lệnh răng');

// ── LT-139: bước kế — ma trận toàn phần các ô ───────────────────────────────
// Bảng VIẾT SẴN (design doc §4), khoá là ô bản đồ; null = ô không có bước kế.
const BUOC_KE_MONG = { 'can-nhac': 'quyết có làm hay không', 'sap-mo': 'mở vòng', 'cho-duyet': 'duyệt phạm vi', 'dang-dung': 'làm và chấm', 'cho-nghiem-thu': 'lái thử và phiên nghiệm thu', 'hong': 'sửa hồ sơ', 'da-ship': null, 'da-nghiem-thu': null, 'xep-lai': null, 'da-bac': null };
const LOAI_TRU_139 = { 'ngoai-pham-vi': 'ô sinh từ .out-of-scope/, không phải thư mục _acceptance/ — không hàng nào trỏ được' };
async function lt139(kit) {
  const M = await napLT(kit); const sai = []; const o = M.PM.SECTIONS.map(([k]) => k).filter(k => !LOAI_TRU_139[k]);
  if (o.length + Object.keys(LOAI_TRU_139).length !== M.PM.SECTIONS.length || o.some(k => !(k in BUOC_KE_MONG) || !HO_SO[k])) return [`ma trận ô lệch SECTIONS: ${o.filter(k => !(k in BUOC_KE_MONG) || !HO_SO[k]).join(', ')}`];
  const hoSo = Object.fromEntries(o.map(k => [`h-${k}`, k]));
  const r = kho({ hoSo, data: { schema: 1, hang: [...o.map(k => H(`O-${k}`, { slug: `h-${k}` })), H('KHONG')] } });
  const html = veM(M, r); const bang = [];
  for (const k of [...o, null]) {
    const ma = k ? `O-${k}` : 'KHONG'; const tr = html.match(new RegExp(`<tr id="[^"]+"><td data-nhan="Mã">${ma}</td>[\\s\\S]*?</tr>`));
    if (!tr) { sai.push(`không thấy hàng ${ma}`); continue; }
    const dong = [...tr[0].matchAll(/<div class="mu nho">bước kế: ([^<]*)<\/div>/g)].map(m => giaiMa(m[1]));
    const mong = k ? BUOC_KE_MONG[k] : null; bang.push(`${k || 'không hồ sơ'}→${dong[0] || '—'}`);
    if (mong == null ? dong.length !== 0 : !deq(dong, [mong])) sai.push(`${k || 'không hồ sơ'}: dòng bước kế ${JSON.stringify(dong)} ≠ ${JSON.stringify(mong)}`);
  }
  console.log(`    · LT-139 ma trận ${o.length} ô + 1 hàng không hồ sơ: ${bang.join(' · ')}`);
  return sai;
}
if (want('LT-139') && await chayCa('LT-139', lt139)) ok('LT-139', 'mỗi ô bản đồ: đúng một dòng bước kế theo bảng viết sẵn, ô không bước kế 0 dòng; hàng không hồ sơ 0 dòng');
if (want('LT-139-do')) await chayDo('LT-139-do', lt139, [['scripts/lo-trinh.mjs', "'cho-nghiem-thu': 'lái thử và phiên nghiệm thu',", "'cho-nghiem-thu': 'chờ nghiệm thu',"]], 'cho-nghiem-thu', 'bản sao đổi câu bước kế của ô cho-nghiem-thu');

// ── LT-140/141: kho không khai · kho khai mà không hàng nào có hồ sơ ─────────
async function lt140(kit) {
  const sai = []; const r = kho({ khoa: false, hoSo: { a1: 'sap-mo', a2: 'da-ship', a3: 'cho-nghiem-thu' } });
  const moi = veBang(kit, r); const cu = veBang(banGocL2(), r);
  if (moi.trang != null) sai.push('LO-TRINH.html sinh khi kho không khai lộ trình');
  if (moi.map == null || moi.map !== cu.map) sai.push(`PRODUCT-MAP.md khác bản ${GOC_L2}`);
  // moc-la-chien-dich AC-4: bỏ đúng khoá loTrinhChuaKhai (MC-4 đo) trước khi so với bộ vẽ cũ.
  const sc = k => { const { loTrinhChuaKhai, ...j } = JSON.parse(quet(r, { ACCEPTANCE_TODAY: '2026-10-09' }, k).stdout); return JSON.stringify({ ...j, git: null }); };
  if (sc(kit) !== sc(banGocL2())) sai.push(`JSON quét start khác bản ${GOC_L2}`);
  return sai;
}
const GM_BO = await import(pathToFileURL(path.join(HERE, 'lo-trinh-gio-may-bo.mjs')).href);
async function lt141(kit) {
  const r = kho({ data: { schema: 1, moc: [{ ten: 'M', ngay: '2026-12-01', hang: ['B'] }], hang: [H('A'), H('B', { dung_tren: ['A'], trang_thai: 'Đang làm' })] } });
  const moiGoc = veBang(kit, r).trang; const cuGoc = veBang(banGocL2(), r).trang;
  if (!moiGoc || !cuGoc) return ['trang vắng'];
  // Hàng X2 (trang-ho-so-mot-viec): phần nhìn thấy so sau khi bỏ ngoặc câu giao ở bên cũ; khối so theo
  // dữ liệu (bỏ khoá tom_tat và số phiên bản — hai thứ duy nhất bản 2 thêm), không theo byte.
  // lo-trinh-gio-may (RM6): giờ máy hiện mặc định — gỡ ĐÚNG phần giờ máy (mô-đun bỏ dùng chung với RS-6, MC-2-byte, AP-8).
  if (!GM_BO.coGioMayTrang(moiGoc)) return ['đối chứng: trang mới không có cột giờ máy để gỡ'];
  const moi = GM_BO.boGioMayTrang(goKhoi(moiGoc)); const cu = trangX2(goKhoi(cuGoc), r);
  // lo-trinh-du-lieu-ngay-du-kien (RM6c): khối mang thêm bốn khoá giờ máy — gỡ đúng bốn khoá ấy trước khi so.
  if (!GM_BO.coKhoiGioMay(moiGoc)) return ['đối chứng: khối dữ liệu mới thiếu khoá giờ máy để gỡ'];
  const kd = h => { const d = LT.docDuLieu(GM_BO.boKhoiGioMay(h)).duLieu; return d && JSON.stringify(duLieuX2({ ...d, phien_ban: null })); };
  if (kd(moiGoc) !== kd(cuGoc)) return ['khối dữ liệu khác bộ vẽ cũ (ngoài tom_tat và số phiên bản)'];
  if (moi === cu) return [];
  let i = 0; while (moi[i] === cu[i]) i++; const tu = Math.max(0, i - 12);
  return [`lệch ở byte ${i}: «${moi.slice(tu, i + 30)}» / «${cu.slice(tu, i + 30)}»`];
}
if (want('LT-140') && await chayCa('LT-140', lt140)) ok('LT-140', `kho không khai: không trang, bản đồ và JSON quét == bộ vẽ ${GOC_L2}`);
if (want('LT-141') && await chayCaTat('LT-141', lt141)) ok('LT-141', `kho khai, không hàng nào có hồ sơ: trang == bộ vẽ ${GOC_L2} từng byte`);
if (want('LT-141-do')) await chayDoTat('LT-141-do', lt141, [['scripts/lo-trinh.mjs', "buocKeCua = d => (d.coHoSo ? BUOC_KE[khoaO.get(d.chu)] || null : null);", "buocKeCua = d => (BUOC_KE[khoaO.get(d.chu)] || BUOC_KE['sap-mo']);"]], 'lệch ở byte', 'bản sao in bước kế cho cả hàng không hồ sơ');


// ═══ trang-ho-so-mot-viec (hàng X2): LT-151…LT-162 (LT-150 thuộc vong-la-mot-ket-qua — ca đầu của vòng này mang mã LT-162) ═══════════════════════════════════════════════
// Trang hồ sơ một việc (evidence-page.js) + dải tóm tắt trong khối dữ liệu lộ trình bản 2 + bỏ một cặp
// «» quanh câu giao. Kho thử do code sinh: ô cơ hội do CHÍNH `lo-trinh.mjs --mo-o` ghi (bộ viết thật),
// rồi thêm vật của một vòng đã giao. Giá trị mong đợi viết sẵn ở BANG_150 lúc dựng, không rút từ đầu ra.
const GOC_X2 = '65a01f4c';
let gocX2Dir = null;
function banGocX2() {
  if (gocX2Dir) return gocX2Dir;
  const d = path.join(TMP, 'goc-x2'); mkdirSync(d, { recursive: true });
  execFileSync('tar', ['-x', '-C', d], { input: execFileSync('git', ['-C', KIT, 'archive', '--format=tar', GOC_X2, 'scripts', 'lib', 'skills'], { maxBuffer: 1 << 28 }) });
  return (gocX2Dir = d);
}
const SL = 'ho-so-du';
const AC_150 = [['AC-1', 'Given kho có hồ sơ, When mở trang, Then thấy dải.'], ['AC-2', 'Given dải, When đọc, Then đủ chín ô.'], ['AC-3', 'Given sổ, When lọc, Then đúng nhãn.']];
const OOS_150 = ['Không làm ô gọi máy.', 'Không sửa tệp kế hoạch.'];
const KL_150 = 'Chưa đo trên điện thoại cũ.';
const LY_DO_150 = 'lý do thật ở đây, một câu đủ.';
const so150 = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
// Sổ 6 dòng đọc được + 1 dòng hỏng. Nhãn mong đợi viết tay theo luật của design doc.
const SO_150 = sha => [
  { id: 'd-1', type: 'approach', stage: 'S1', at: '2026-10-01T01:00:00Z', decision: 'Chọn một mô-đun.', why: 'Hai bộ đọc trôi.', cost_if_wrong: 'Dời tệp.' },
  { id: 'd-2', type: 'descope', stage: 'S1', at: '2026-10-01T02:00:00Z', decision: 'KHÔNG làm ô đếm lượt.', why: 'Chưa có máy đếm.', cost_if_wrong: 'Thêm sau.' },
  { id: 'd-3', type: 'seal', gate: 1, at: '2026-10-02T00:00:00Z' },
  { id: 'd-4', type: 'fix', stage: 'S3', at: '2026-10-03T00:00:00Z', decision: 'Đổi thứ tự.', why: 'Plan lệch.', cost_if_wrong: 'Một lượt.' },
  { id: 'd-5', type: 'revisit', stage: 'gate2', at: '2026-10-05T00:00:00Z', decision: 'Xem lại sau một tháng.', why: 'Chưa có số.', cost_if_wrong: 'Không.', decided_by: 'M', decided_at: '2026-10-05T00:00:00Z' },
  { id: 'd-6', type: 'thuc-te', stage: 'thuc-te', at: '2026-10-08T00:00:00Z', by: 'M', build_sha: sha, decision: 'Đang chạy ở prod.' },
];
const NHAN_150 = { 'd-1': 'Máy', 'd-2': 'Máy', 'd-3': 'Người', 'd-4': 'Máy', 'd-5': 'Người', 'd-6': 'Người' };
const USAGE_150 = '# Usage\n\n### S3 — wf_a (4 agent, 1,000 out-tok)\n\n### S4 round 1 — wf_b (10 agent, 20,000 out-tok)\n\n### S4 round 2 — wf_c (8 agent, 12,500 out-tok)\n';
const USAGE_LT1 = '### S4 round 1 — wf_87b08f92-5c4 (35 agent, 61,782 out-tok)\n\n### S4 round 2 — wf_7acc15cb-a6e (34 agent, 47,602 out-tok)\n\n### S4 round 3 — wf_cc4b9e33-2b1 (28 agent, 30,969 out-tok)\n';
const UAT_150 = `---\nschema_version: 1\nslug: ${SL}\nstage: held\nverdict: release\ndecided_by: M\ndecided_at: 2026-10-09T10:00:00Z\n---\n\n## Số đo thật đặt cạnh ngưỡng\n\n| Thước | Ngưỡng đã khai | Số đo được | SỐNG/CHẾT |\n|---|---|---|---|\n| Nhanh | ≤ 1 phút | 50 giây | SỐNG |\n| Không hỏi | 0 câu | 0 | SỐNG |\n| Điện thoại | đọc được | chưa đọc | CHẾT |\n\n## Quyết định Cổng Giá trị\n\n- **verdict = release**\n`;
const NGUONG_150 = '## Ngưỡng chết / ngưỡng UAT\n\n- Câu hỏi phép đo trả lời: có nhanh hơn không\n- Kết quả nào là SỐNG: dưới một phút\n- Kết quả nào là CHẾT: quá hai phút\n- Timebox: 2026-11-01\n';
// Kho thử «đủ»: hai hàng (X có hồ sơ, Y không) + một hàng Z để làm «việc kế». Trả { r, sha }.
function kho150({ gop = true, uat = true, thucTe = true, acThem = false, soImpact = false } = {}) {
  const data = { schema: 1, ten: 'Lộ trình thử', hang: [
    { ma: 'X', slug: SL, cau_giao: '«Việc X có trang hồ sơ»', vi_sao: `Gốc: crm/_acceptance/a — ${LY_DO_150}`, bat_khi: 'đọc «một» phút' },
    { ma: 'Y', cau_giao: '«A» và «B»', vi_sao: 'vì «Y»' },
    { ma: 'Z', cau_giao: '«câu Z»', dung_tren: [] },
  ] };
  const r = kho({ data });
  const mo = node([LO, '--root', r, '--hang', 'X', '--mo-o', '--slug', SL, '--owner', 'x@y.z']);
  if (mo.status !== 0) throw new Error(`--mo-o exit ${mo.status}: ${mo.stderr}`);
  const d = path.join(r, '_acceptance', SL);
  // Phiên thật sau --mo-o: thêm đoạn «Người gặp», chốt ngưỡng, ký Cổng Đáng.
  let opp = readFileSync(path.join(d, 'opportunity.md'), 'utf8');
  opp = opp.replace(/## Ngưỡng chết \/ ngưỡng UAT[\s\S]*?(?=\n## |$)/, NGUONG_150).replace(/^decided_by:[^\n]*/m, 'decided_by: M').replace(/^decided_at:[^\n]*/m, 'decided_at: 2026-09-30T00:00:00Z')
    .replace(/(## Vấn đề & ai gặp\n[\s\S]*?)(\n## )/, `$1\n**Người gặp:** chủ kho đọc hồ sơ.\n$2`);
  if (!opp.includes('**Người gặp:**') || !opp.includes('Timebox: 2026-11-01')) throw new Error('ô cơ hội của --mo-o không đúng hình dạng mong đợi');
  writeFileSync(path.join(d, 'opportunity.md'), opp);
  const acs = acThem ? [...AC_150, ['AC-4', 'Given thêm, When đọc, Then có AC-4.']] : AC_150;
  mkdirSync(path.join(r, 'docs'), { recursive: true }); writeFileSync(path.join(r, 'docs', 'x-design.md'), '# thiết kế\n');
  writeFileSync(path.join(d, 'contract.md'), `---\nschema_version: 1\nfeature: «Việc X có trang hồ sơ»\nslug: ${SL}\nowner: x@y.z\nrisk_tier: T2\nsurfaces: [cli]\ndesign_doc: docs/x-design.md\nstatus: signed-off\napproved_by: M\napproved_at: 2026-10-02T00:00:00Z\n---\n\n## Context\n\nĐoạn bối cảnh của hợp đồng.\n\n## Criteria\n\n${acs.map(([i, c]) => `- ${i}: ${c}`).join('\n')}\n\n## Out of scope\n\n${OOS_150.map(x => `- ${x}`).join('\n')}\n`);
  writeFileSync(path.join(d, 'evals.yaml'), `schema_version: 1\nevals:\n${acs.map(([i], k) => `  - id: E${k + 1}\n    criterion: ${i}\n    executor: test\n    cmd: config:executors.test.x\n`).join('')}`);
  writeFileSync(path.join(d, 'usage-report.md'), USAGE_150);
  if (uat) writeFileSync(path.join(d, 'uat-session.md'), UAT_150);
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'vong X');
  const sha = git(r, 'rev-parse', 'HEAD');
  const so = SO_150(sha).filter(x => thucTe || x.type !== 'thuc-te').map(x => (soImpact && x.why ? (() => { const y = { ...x, impact: x.why }; delete y.why; delete y.cost_if_wrong; return y; })() : x));
  writeFileSync(path.join(d, 'decisions.jsonl'), so.map(x => JSON.stringify(x)).join('\n') + '\n{hong\n');
  writeFileSync(path.join(d, 'evidence-report.md'), `---\nschema_version: 2\nfeature_slug: ${SL}\nverdict: PASS\nverified_by: fresh-context verification subagent\nenforcement_mode: strict\nbypass_used: false\nverified_commit: ${sha}\nhuman_signoff: M 2026-10-06\n---\n\n# Evidence Report: ${SL}\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n${acs.map(([i], k) => `| E${k + 1} | ${i} | test | PASS |`).join('\n')}\n\n## Evidence\n\n${acs.map((_, k) => `- eval: E${k + 1}\n  run_id: r-${k + 1}\n  exit_code: 0\n  verified_at: 2026-10-05T00:00:00Z\n  output: |\n    PASS: ca ${k + 1}`).join('\n')}\n\n## Known limits\n\n- ${KL_150}\n\n## Ngoài hợp đồng\n\n## Iterations\n\n- r1: PASS\n`);
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'bang chung X');
  if (gop) {
    git(r, 'checkout', '-qb', 'nhanh-phu', 'HEAD~1'); writeFileSync(path.join(r, 'phu.txt'), 'x\n'); git(r, 'add', '-A'); git(r, 'commit', '-qm', 'phu');
    git(r, 'checkout', '-q', 'main'); git(r, 'merge', '--no-ff', '-q', '-m', 'Merge pull request #7 from x/vong', 'nhanh-phu');
  }
  return { r, sha };
}
const BANG_150 = (sha, tt) => ({
  da_giao: ['Việc X có trang hồ sơ', 'contract.md'], vi_sao: [LY_DO_150, 'opportunity.md'], trang_thai: [tt, 'contract.md'],
  ngay: ['2026-10-08', 'contract.md'], production: [`đã chạy ở production — bản dựng ${sha.slice(0, 7)}, quan sát 2026-10-08, M`, 'decisions.jsonl'],
  do_gi: ['có nhanh hơn không — hạn 2026-11-01', 'opportunity.md'], ket_qua: ['release (2026-10-09) · 2/3 thước SỐNG', 'uat-session.md'],
  // Vế đầu đổi ở hồ sơ dai-tom-tat-doc-dung AC-5 («ngoài hợp đồng» là nhãn finding Cổng Bằng chứng).
  chua_lam: ['2 mục để ngoài phạm vi · 1 giới hạn đã biết', 'contract.md'], ai_quyet: ['Cổng Đáng: M · Cổng Phạm vi: M · Cổng Bằng chứng: M', 'contract.md'],
});
const CK_150 = sha => ({ tieu_chi: 3, phep_do: 3, luot_cham: 2, token: 33500, quyet_dinh_may: 3, quyet_dinh_nguoi: 3, ma: sha });
const O_150 = ['da_giao', 'vi_sao', 'trang_thai', 'ngay', 'production', 'do_gi', 'ket_qua', 'chua_lam', 'ai_quyet'];
const boEsc = s => String(s).replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
// Bộ đọc HTML ĐỘC LẬP của ca: rút dải, dòng chủ kho, mục gập — không gọi mô-đun.
const daiCua = h => [...h.matchAll(/<div class="o" data-o="(\w+)" data-nguon="([^"]*)"><div class="hoi">[^<]*<\/div><div class="tra">([\s\S]*?)<\/div><\/div>/g)].map(m => ({ k: m[1], nguon: boEsc(m[2]), tra: boEsc(m[3]) }));
const ckCua = h => Object.fromEntries([...h.matchAll(/<span data-k="(\w+)">[^<]*<b>([\s\S]*?)<\/b><\/span>/g)].map(m => [m[1], boEsc(m[2])]));
const mucCua150 = (h, id) => { const m = h.match(new RegExp(`<details class="muc" id="${id}"><summary>([^<]*)</summary><div class="noi">([\\s\\S]*?)</div></details>`)); return m ? { ten: m[1], than: m[2] } : null; };
// Vẽ trang hồ sơ bằng evidence-page.js của `kit` trên gốc `r` (như người gọi thật); trả { html, x }.
function trangHoSo(kit, r, slug = SL, env = {}) {
  const x = node([path.join(kit, 'scripts', 'evidence-page.js'), '--root', r, '--slug', slug], { env: { ...process.env, ...env } });
  const p = path.join(r, '_acceptance', slug, 'evidence-page.html');
  return { html: x.status === 0 && existsSync(p) ? readFileSync(p, 'utf8') : null, x };
}
const trangLoTrinh = async (kit, r) => { const M = await napLT(kit); return veM(M, r); };
const hangKhoi = (html, ma, kit) => { const d = LT.docDuLieu(html).duLieu; return d && d.lo_trinh[0].hang.find(h => h.ma === ma); };

// ── LT-162: dải chín ô ────────────────────────────────────────────────────
async function lt162(kit) {
  const { r, sha } = kho150(); const sai = [];
  const { html, x } = trangHoSo(kit, r); if (!html) return [`evidence-page exit ${x.status}: ${x.stderr.slice(0, 200)}`];
  const lo = await trangLoTrinh(kit, r); const hx = hangKhoi(lo, 'X'); if (!hx) return ['trang lộ trình không có hàng X'];
  const B = BANG_150(sha, hx.trang_thai); const dai = daiCua(html);
  if (!deq(dai.map(o => o.k), O_150)) sai.push(`thứ tự ô ${JSON.stringify(dai.map(o => o.k))}`);
  for (const o of dai) { const [v, n] = B[o.k] || []; if (o.tra !== v) sai.push(`ô ${o.k}: «${o.tra.slice(0, 80)}» ≠ «${String(v).slice(0, 80)}»`); if (o.nguon !== n) sai.push(`ô ${o.k}: nguồn «${o.nguon}» ≠ «${n}»`); }
  if (!hx.trang_thai) sai.push('hàng X không có chữ trạng thái');
  if (/gọi người/i.test(html)) sai.push('trang có chữ «gọi người»');
  return sai;
}
if (want('LT-162') && await chayCa('LT-162', lt162)) ok('LT-162', 'chín ô đúng thứ tự, đúng giá trị viết sẵn và đúng tệp nguồn; trạng thái == chữ hàng trên trang lộ trình; không ô gọi người');
if (want('LT-162 vi-sao-that')) {
  try {
    const HS = createRequire(import.meta.url)(path.join(KIT, 'scripts', 'ho-so-tom-tat.cjs'));
    const d = path.join(KIT, '_acceptance', 'trang-ho-so-mot-viec'); const t = HS.tomTatHoSo(d);
    const cg = t.dai.moi_nguoi.da_giao; const v = t.dai.moi_nguoi.vi_sao || '';
    if (!v || /^(Gốc:|Mở từ hàng|>)/.test(v) || v === cg) bad('LT-162 vi-sao-that', `vi_sao «${v.slice(0, 90)}»`);
    else ok('LT-162 vi-sao-that', `ô cơ hội thật của hồ sơ này: vi_sao = «${v.slice(0, 50)}…»`);
  } catch (e) { bad('LT-162 vi-sao-that', loi(e)); }
}
if (want('LT-162-do')) await chayDo('LT-162-do', lt162, [['scripts/ho-so-tom-tat.cjs', "if (mo) return catTran(tachCau(tron(mo[1].trim())), ' ');", 'if (mo) continue;']], 'ô vi_sao', 'bản sao bỏ qua đoạn «Vì sao: Gốc: … — lý do»');

// ── LT-151: mục gập hứa · thiết kế · giới hạn ───────────────────────────
async function lt151(kit, acThem = false) {
  const { r } = kho150({ acThem }); const sai = [];
  const { html, x } = trangHoSo(kit, r); if (!html) return [`evidence-page exit ${x.status}: ${x.stderr.slice(0, 200)}`];
  const MONG = { 'vi-sao': 'Vì sao làm', 'da-hua': 'Đã hứa', 'thiet-ke': 'Thiết kế', 'gioi-han': 'Giới hạn và ngoài hợp đồng' };
  for (const [id, ten] of Object.entries(MONG)) { const m = mucCua150(html, id); if (!m || m.ten !== ten) sai.push(`mục ${id}: tiêu đề «${m && m.ten}» ≠ «${ten}»`); }
  const acs = acThem ? [...AC_150, ['AC-4', 'Given thêm, When đọc, Then có AC-4.']] : AC_150;
  const hua = [...html.matchAll(/<li data-ac="([^"]+)"><b>[^<]*<\/b> — ([^<]*)<\/li>/g)].map(m => [m[1], boEsc(m[2])]);
  for (const [i, c] of acs) { const h = hua.find(y => y[0] === i); if (!h) sai.push(`«Đã hứa» thiếu ${i}`); else if (!c.includes(h[1].replace(/\.$/, ''))) sai.push(`${i}: «${h[1]}»`); }
  if (hua.length !== acs.length) sai.push(`«Đã hứa» ${hua.length} dòng ≠ ${acs.length}`);
  const gh = [...html.matchAll(/<li data-loai="(ngoai|gioi-han)">([^<]*)<\/li>/g)].map(m => boEsc(m[2]));
  if (!deq(gh, [...OOS_150, KL_150])) sai.push(`«Giới hạn và ngoài hợp đồng» ${JSON.stringify(gh)}`);
  if (!/<p class="mono" data-design-doc>docs\/x-design\.md<\/p>/.test(html)) sai.push('«Thiết kế» không trỏ docs/x-design.md');
  return sai;
}
if (want('LT-151') && await chayCa('LT-151', k => lt151(k))) ok('LT-151', 'bốn mục gập đúng tiêu đề; «Đã hứa» đủ mọi AC kèm câu; giới hạn + ngoài hợp đồng nguyên văn; thiết kế trỏ design_doc');
if (want('LT-151-do')) await chayDo('LT-151-do', k => lt151(k, true), [['scripts/ho-so-tom-tat.cjs', '    acs,\n', '    acs: acs.slice(0, 3),\n']], 'AC-4', 'bản sao mô-đun chỉ đọc ba AC đầu');

// ── LT-152: dòng thời gian quyết định ────────────────────────────────────
// Bàn lọc: chạy script nội tuyến CỦA TRANG trên một DOM tối giản dựng từ chính HTML (nút data-loc, li
// data-loai) rồi bấm «Người» — đếm li còn hiện.
function locNguoi(html) {
  const mk = (attrs) => { const a = { ...attrs }; const ev = {}; return { a, hidden: false, getAttribute: k => (k in a ? a[k] : null), setAttribute: (k, v) => { a[k] = String(v); }, addEventListener: (t, f) => { ev[t] = f; }, click() { ev.click && ev.click(); }, classList: { add() {}, remove() {} } }; };
  const nut = [...html.matchAll(/<button class="btn" data-loc="([^"]+)"/g)].map(m => mk({ 'data-loc': m[1] }));
  const li = [...html.matchAll(/<li data-loai="(nguoi|may)" data-id="([^"]*)">/g)].map(m => mk({ 'data-loai': m[1], 'data-id': m[2] }));
  const document = { querySelectorAll: s => (s === '[data-loc]' ? nut : s === '[data-dong-thoi-gian] li' ? li : []) };
  const js = (html.match(/<script>([\s\S]*?)<\/script>/) || [])[1]; if (!js) throw new Error('trang không có script nội tuyến');
  new Function('document', 'setInterval', 'clearInterval', js)(document, () => 0, () => {});
  const b = nut.find(n => n.a['data-loc'] === 'nguoi'); if (!b) throw new Error('không có nút lọc Người'); b.click();
  return { con: li.filter(l => !l.hidden), nguoi: li.filter(l => l.a['data-loai'] === 'nguoi'), pressed: b.a['aria-pressed'] };
}
async function lt152(kit, ca = 'kho-thu') {
  const sai = [];
  if (ca === 'kho-thu') {
    const { r } = kho150(); const { html, x } = trangHoSo(kit, r); if (!html) return [`evidence-page exit ${x.status}`];
    const li = [...html.matchAll(/<li data-loai="(nguoi|may)" data-id="([^"]*)"><b>([^<]*)<\/b>/g)].map(m => ({ loai: m[1], id: m[2], ngay: m[3] }));
    if (li.length !== 6) sai.push(`dòng thời gian ${li.length} dòng ≠ 6`);
    if (!deq(li.map(l => l.ngay), [...li.map(l => l.ngay)].sort())) sai.push('dòng thời gian không tăng dần theo ngày');
    for (const l of li) { const mong = NHAN_150[l.id]; const co = l.loai === 'nguoi' ? 'Người' : 'Máy'; if (co !== mong) sai.push(`dòng ${l.id}: nhãn ${co}, mong ${mong}`); }
    const ck = ckCua(html); if (ck.quyet_dinh_may !== '3' || ck.quyet_dinh_nguoi !== '3') sai.push(`dải chủ kho máy ${ck.quyet_dinh_may} · người ${ck.quyet_dinh_nguoi} ≠ 3 · 3`);
    if (!/<span class="vang" data-so-hong>1 dòng sổ không đọc được<\/span>/.test(html)) sai.push('dải không báo «1 dòng sổ không đọc được»');
    const l = locNguoi(html); if (l.con.length !== 3 || l.con.some(y => y.a['data-loai'] !== 'nguoi') || l.pressed !== 'true') sai.push(`lọc Người còn ${l.con.length} dòng`);
  } else {
    // Sổ hình dạng LT1 của crm: 16 dòng revisit gate2 có decided_by, 26 dòng máy S1..S4 (đếm tay ở ô cơ hội).
    const { r } = kho150(); const d = path.join(r, '_acceptance', SL);
    const KIEU = [['approach', 'S1', 6], ['descope', 'S1', 5], ['revisit', 'S1', 1], ['revisit', 'S2', 2], ['approach', 'S2', 2], ['fix', 'S3', 5], ['revisit', 'S3', 1], ['fix', 'S4-r1', 1], ['revisit', 'S4-r2', 1], ['approach', 'S4-r2', 1], ['fix', 'S4-r2', 1]];
    const dong = []; let n = 0;
    for (const [type, stage, k] of KIEU) for (let i = 0; i < k; i++) dong.push({ id: `d-${++n}`, type, stage, at: `2026-10-0${1 + Math.floor(n / 10)}T00:${String(n).padStart(2, '0')}:00Z`, decision: `máy ${n}`, why: 'v', cost_if_wrong: 'c' });
    for (let i = 0; i < 16; i++) dong.push({ id: `d-${++n}`, type: 'revisit', stage: 'gate2', at: `2026-10-09T01:${String(i).padStart(2, '0')}:00Z`, decision: `người ${i}`, why: 'v', cost_if_wrong: 'c', decided_by: 'Manh Phan', decided_at: '2026-10-10T00:00:00Z' });
    writeFileSync(path.join(d, 'decisions.jsonl'), dong.map(o => JSON.stringify(o)).join('\n') + '\n');
    const { html, x } = trangHoSo(kit, r); if (!html) return [`evidence-page exit ${x.status}`];
    const ck = ckCua(html); if (ck.quyet_dinh_may !== '26' || ck.quyet_dinh_nguoi !== '16') sai.push(`sổ LT1: máy ${ck.quyet_dinh_may} · người ${ck.quyet_dinh_nguoi} ≠ 26 · 16`);
    const l = locNguoi(html); if (l.con.length !== 16) sai.push(`lọc Người trên sổ LT1 còn ${l.con.length} ≠ 16`);
  }
  return sai;
}
if (want('LT-152 kho-thu') && await chayCa('LT-152 kho-thu', k => lt152(k, 'kho-thu'))) ok('LT-152 kho-thu', 'sáu dòng tăng dần, nhãn Máy/Người đúng luật (decided_by · seal · thuc-te), dải 3 · 3, báo 1 dòng hỏng, lọc Người còn 3');
if (want('LT-152 lt1') && await chayCa('LT-152 lt1', k => lt152(k, 'lt1'))) ok('LT-152 lt1', 'sổ hình dạng LT1: máy 26 · người 16, lọc Người còn 16');
if (want('LT-152-do')) await chayDo('LT-152-do', k => lt152(k, 'kho-thu'), [['scripts/ho-so-tom-tat.cjs', "|| d.type === 'seal' || d.type === 'thuc-te'", "|| d.type === 'thuc-te'"]], 'dòng d-3', 'bản sao luật coi seal là máy');

// ── LT-153: phần bằng chứng giữ nguyên + tài nguyên ──────────────────────
const doanBC = (h, het) => { const a = h.indexOf('<h2>Các eval</h2>'); const b = a < 0 ? -1 : h.indexOf(het, a); return a < 0 || b < 0 ? null : h.slice(a, b); };
async function lt153(kit, ca = 'kho-thu') {
  const { r } = kho150(); const sai = []; const d = path.join(r, '_acceptance', SL);
  if (ca === 'lt1') writeFileSync(path.join(d, 'usage-report.md'), USAGE_LT1);
  const { html, x } = trangHoSo(kit, r); if (!html) return [`evidence-page exit ${x.status}`];
  const ck = ckCua(html);
  if (ca === 'lt1') { if (ck.luot_cham !== '3' || ck.token !== '140.353') sai.push(`LT1: ${ck.luot_cham} lượt · ${ck.token} token ≠ 3 · 140.353`); return sai; }
  // Bản cũ vẽ trên bản CLONE (không ghi đè trang của bản mới).
  const c = path.join(TMP, `clone150-${++khoN}`); execFileSync('git', ['clone', '-q', r, c]); cpSync(d, path.join(c, '_acceptance', SL), { recursive: true });
  const cu = trangHoSo(banGocX2(), c); if (!cu.html) return [`bộ vẽ ${GOC_X2} exit ${cu.x.status}: ${cu.x.stderr.slice(0, 160)}`];
  const a = doanBC(html, '\n</div></details>'); const b = doanBC(cu.html, '\n<div class="foot">');
  if (a == null || b == null) sai.push(`không cắt được đoạn bằng chứng (mới ${a != null}, cũ ${b != null})`);
  else if (a !== b) { let i = 0; while (a[i] === b[i]) i++; sai.push(`đoạn bằng chứng lệch bản ${GOC_X2} ở byte ${i}: «${a.slice(Math.max(0, i - 20), i + 30)}» / «${b.slice(Math.max(0, i - 20), i + 30)}»`); }
  const rows = [...(html.match(/<table data-tai-nguyen>[\s\S]*?<\/table>/) || [''])[0].matchAll(/<tr><td>([^<]*)<\/td><td>(\d+)<\/td><td>([^<]*)<\/td><\/tr>/g)].map(m => [m[1], m[2], m[3]]);
  if (!deq(rows, [['S3', '4', '1.000'], ['S4 round 1', '10', '20.000'], ['S4 round 2', '8', '12.500']])) sai.push(`tài nguyên ${JSON.stringify(rows)}`);
  if (ck.luot_cham !== '2') sai.push(`lượt chấm ${ck.luot_cham} ≠ 2`);
  if (ck.token !== '33.500') sai.push(`token ${ck.token} ≠ 33.500 (tổng ba dòng)`);
  return sai;
}
if (want('LT-153') && await chayCa('LT-153', k => lt153(k))) ok('LT-153', `phần bằng chứng giống từng byte bộ vẽ ${GOC_X2}; tài nguyên ba khối, 2 lượt chấm, tổng 33.500`);
if (want('LT-153 lt1') && await chayCa('LT-153 lt1', k => lt153(k, 'lt1'))) ok('LT-153 lt1', 'báo cáo token số LT1 → 3 lượt chấm, 140.353 token');
if (want('LT-153-do')) await chayDo('LT-153-do', k => lt153(k), [['scripts/ho-so-tom-tat.cjs', 'usage.khoi.reduce((a, k) => a + k.token, 0)', 'usage.khoi.filter(k => /^S4\\b/.test(k.ten)).reduce((a, k) => a + k.token, 0)']], 'token', 'bản sao chỉ cộng khối lượt chấm');

// ── LT-154: giao · giá trị · production ──────────────────────────────────
async function lt154(kit, ca) {
  const sai = [];
  if (ca === 'du') {
    const { r, sha } = kho150(); const { html, x } = trangHoSo(kit, r); if (!html) return [`exit ${x.status}`];
    const g = mucCua150(html, 'giao'); const gt = mucCua150(html, 'gia-tri');
    if (!g || !g.than.includes(sha) || !g.than.includes('2026-10-06') || !/<span data-pr>PR #7<\/span>/.test(g.than)) sai.push(`«Giao» ${g && boEsc(g.than).slice(0, 160)}`);
    // Quan hệ, không chuỗi có mặt: (1) mỗi ngưỡng của ô cơ hội (NGUONG_150) hiện ĐÚNG «nhãn: giá trị»;
    // (2) mỗi hàng bảng số đo == đúng hàng của phiên nghiệm thu (thước · ngưỡng đã khai · số đo · kết luận).
    const nguong = gt ? [...gt.than.matchAll(/<li data-nguong>([^<]*)<\/li>/g)].map(m => boEsc(m[1])) : [];
    const nguongMong = NGUONG_150.split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2));
    if (!deq(nguong, nguongMong)) sai.push(`«Giá trị» ngưỡng ${JSON.stringify(nguong)} ≠ ô cơ hội ${JSON.stringify(nguongMong)}`);
    const hang = gt ? [...gt.than.matchAll(/<tr>((?:<td>[^<]*<\/td>)+)<\/tr>/g)].map(m => [...m[1].matchAll(/<td>([^<]*)<\/td>/g)].map(x => boEsc(x[1]))) : [];
    const hangMong = UAT_150.split('\n').filter(l => /^\| (Nhanh|Không hỏi|Điện thoại) \|/.test(l)).map(l => l.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()));
    if (!deq(hang, hangMong)) sai.push(`«Giá trị» hàng số đo ${JSON.stringify(hang)} ≠ phiên nghiệm thu ${JSON.stringify(hangMong)}`);
    const p = daiCua(html).find(o => o.k === 'production'); if (!p || p.tra !== `đã chạy ở production — bản dựng ${sha.slice(0, 7)}, quan sát 2026-10-08, M`) sai.push(`production «${p && p.tra}»`);
  } else if (ca === 'vang') {
    const { r } = kho150({ gop: false, uat: false, thucTe: false }); const { html, x } = trangHoSo(kit, r); if (!html) return [`exit ${x.status}`];
    const dai = Object.fromEntries(daiCua(html).map(o => [o.k, o.tra]));
    if (!/<span data-pr>chưa gộp<\/span>/.test(html)) sai.push('«Giao» không in «chưa gộp»');
    if (dai.ket_qua !== 'chưa đo') sai.push(`ket_qua «${dai.ket_qua}»`);
    const gt = mucCua150(html, 'gia-tri'); if (!gt || (gt.than.match(/chưa đo/g) || []).length !== 4) sai.push(`«Giá trị» ${gt && boEsc(gt.than).slice(0, 120)}`);
    if (dai.production !== 'chưa ghi quan sát production') sai.push(`production «${dai.production}»`);
  } else {
    const { r } = kho150();
    const t = path.join(TMP, `khong-git-${++khoN}`); mkdirSync(path.join(t, '_acceptance'), { recursive: true });
    cpSync(path.join(r, '_acceptance'), path.join(t, '_acceptance'), { recursive: true });
    const a = trangHoSo(kit, t); if (!a.html || a.x.stderr || !/<span data-pr>chưa gộp<\/span>/.test(a.html)) sai.push(`không .git: exit ${a.x.status}, stderr «${a.x.stderr.slice(0, 80)}»`);
    const ev = path.join(r, '_acceptance', SL, 'evidence-report.md'); writeFileSync(ev, readFileSync(ev, 'utf8').replace(/verified_commit: \w+/, `verified_commit: ${'f'.repeat(40)}`));
    const b = trangHoSo(kit, r); if (!b.html || b.x.stderr || !/<span data-pr>chưa gộp<\/span>/.test(b.html)) sai.push(`sha lạ: exit ${b.x.status}, stderr «${b.x.stderr.slice(0, 80)}»`);
  }
  return sai;
}
if (want('LT-154 du') && await chayCa('LT-154 du', k => lt154(k, 'du'))) ok('LT-154 du', '«Giao» mã + ngày ký + PR #7; «Giá trị» ngưỡng cạnh số đo; production từ dòng thuc-te');
if (want('LT-154 vang') && await chayCa('LT-154 vang', k => lt154(k, 'vang'))) ok('LT-154 vang', 'không gộp · không phiên nghiệm thu · không quan sát → «chưa gộp» · «chưa đo» · «chưa ghi quan sát production»');
if (want('LT-154-do')) await chayDo('LT-154-do', k => lt154(k, 'du'), [['scripts/evidence-page.js', "P.push(muc('gia-tri', 'Giá trị', (CT.nguong.length ?", "P.push(muc('gia-tri', 'Giá trị', (CT.nguong.length && !CT.uatBang ?"]], '«Giá trị» ngưỡng', 'bản sao bỏ ngưỡng ô cơ hội khi đã có phiên nghiệm thu');
if (want('LT-154 khong-git') && await chayCa('LT-154 khong-git', k => lt154(k, 'khong-git'))) ok('LT-154 khong-git', 'gốc không có .git và mã lạ → «chưa gộp», thoát 0, stderr rỗng');

// ── LT-155: đường đọc-cũ, tất định, hồ sơ thật ───────────────────────────
const chuaCoCua = h => new Set([...h.matchAll(/<span class="vang">chưa có — ([^<]*)<\/span>/g)].map(m => boEsc(m[1])));
async function lt155(kit, ca) {
  const sai = [];
  if (ca === 'ma-tran') {
    const goc = kho150(); const g = trangHoSo(kit, goc.r); if (!g.html) return [`bản đủ exit ${g.x.status}`];
    if (chuaCoCua(g.html).size) sai.push(`bản đủ đã có chỗ «chưa có»: ${[...chuaCoCua(g.html)].join(', ')}`);
    const GO = { 'opportunity.md': `_acceptance/${SL}/opportunity.md`, 'decisions.jsonl': `_acceptance/${SL}/decisions.jsonl`, 'usage-report.md': `_acceptance/${SL}/usage-report.md`, 'docs/x-design.md': 'docs/x-design.md', 'evals.yaml': `_acceptance/${SL}/evals.yaml` };
    let n = 0;
    for (const [ten, rel] of Object.entries(GO)) { const { r } = kho150(); rmSync(path.join(r, rel)); const t = trangHoSo(kit, r); n += 1; if (!t.html) { sai.push(`gỡ ${ten}: exit ${t.x.status}`); continue; } const s = [...chuaCoCua(t.html)]; if (!deq(s, [ten])) sai.push(`gỡ ${ten}: chỗ «chưa có» nêu ${JSON.stringify(s)}`); }
    const im = kho150({ soImpact: true }); const t = trangHoSo(kit, im.r); n += 1;
    if (!t.html) sai.push(`sổ impact: exit ${t.x.status}`); else { if (chuaCoCua(t.html).size) sai.push('sổ impact: có chỗ «chưa có»'); if (!t.html.includes('Hai bộ đọc trôi.')) sai.push('sổ impact: dòng sổ không hiện câu impact'); }
    if (n !== 6) sai.push(`số ca đo ${n} ≠ 6`);
  } else if (ca === 'tat-dinh') {
    const { r } = kho150(); const a = trangHoSo(kit, r, SL, { TZ: 'UTC' }).html; const b = trangHoSo(kit, r, SL, { TZ: 'Asia/Ho_Chi_Minh' }).html;
    if (!a || a !== b) sai.push('hai lần vẽ khác byte (TZ khác)');
    if (a && /(src|href)="http/i.test(a)) sai.push('trang có src/href tới http');
  } else if (ca === 'that') {
    const t = path.join(TMP, `that-${++khoN}`); mkdirSync(t, { recursive: true });
    cpSync(path.join(KIT, '_acceptance'), path.join(t, '_acceptance'), { recursive: true, filter: s => !/\.(png|jpe?g|webp|gif)$/i.test(s) });
    let n = 0;
    for (const s of readdirSync(path.join(t, '_acceptance'))) {
      if (!existsSync(path.join(t, '_acceptance', s, 'evidence-report.md'))) continue;
      n += 1; const x = node([path.join(kit, 'scripts', 'evidence-page.js'), '--root', t, '--slug', s]);
      if (x.status !== 0 || /TypeError|ReferenceError/.test(x.stderr)) sai.push(`${s}: exit ${x.status} ${x.stderr.slice(0, 120)}`);
    }
    if (n <= 100) sai.push(`chỉ ${n} hồ sơ có báo cáo (cần > 100)`);
    if (!sai.length) console.log(`    · ${n} hồ sơ`);
  } else {
    const { r } = kho150(); rmSync(path.join(r, '_acceptance', SL, 'evidence-report.md'));
    const x = node([path.join(kit, 'scripts', 'evidence-page.js'), '--root', r, '--slug', SL]);
    if (x.status !== 2 || !x.stderr.includes('no evidence-report.md')) sai.push(`không báo cáo: exit ${x.status}, stderr «${x.stderr.slice(0, 80)}»`);
  }
  return sai;
}
if (want('LT-155 ma-tran') && await chayCa('LT-155 ma-tran', k => lt155(k, 'ma-tran'))) ok('LT-155 ma-tran', '5 ca gỡ một tệp + sổ impact: thoát 0, «chưa có» nêu đúng tệp đã gỡ');
if (want('LT-155 tat-dinh') && await chayCa('LT-155 tat-dinh', k => lt155(k, 'tat-dinh'))) ok('LT-155 tat-dinh', 'hai lần vẽ (TZ khác) cùng byte; không tài nguyên mạng');
if (want('LT-155 that') && await chayCa('LT-155 that', k => lt155(k, 'that'))) ok('LT-155 that', 'mọi hồ sơ có báo cáo của kit: 0 ca lỗi');
if (want('LT-155 khong-bao-cao') && await chayCa('LT-155 khong-bao-cao', k => lt155(k, 'khong-bao-cao'))) ok('LT-155 khong-bao-cao', 'hồ sơ không báo cáo vẫn thoát 2 như trước');

// ── LT-156: khối bản 2 mang dải ──────────────────────────────────────────
async function lt156(kit) {
  const { r, sha } = kho150(); const sai = [];
  const M = await napLT(kit); const lo = veM(M, r); const k = M.LT.docDuLieu(lo); if (!k.duLieu) return [`khối không đọc được: ${k.canhBao}`];
  if (k.duLieu.phien_ban !== 2) sai.push(`phien_ban ${k.duLieu.phien_ban} ≠ 2`);
  const hx = k.duLieu.lo_trinh[0].hang.find(h => h.ma === 'X'); const hy = k.duLieu.lo_trinh[0].hang.find(h => h.ma === 'Y');
  if (!hx || !hx.tom_tat) return [...sai, 'hàng X không có tom_tat'];
  if (!deq(Object.keys(hx.tom_tat), ['moi_nguoi', 'chu_kho'])) sai.push(`khoá tom_tat ${Object.keys(hx.tom_tat)}`);
  if (!deq(Object.keys(hx.tom_tat.moi_nguoi), O_150)) sai.push(`khoá moi_nguoi ${Object.keys(hx.tom_tat.moi_nguoi)}`);
  if (!deq(Object.keys(hx.tom_tat.chu_kho), Object.keys(CK_150(sha)))) sai.push(`khoá chu_kho ${Object.keys(hx.tom_tat.chu_kho)}`);
  if (JSON.stringify(hx.tom_tat).match(/goi_nguoi/)) sai.push('khối có khoá gọi người');
  const { html } = trangHoSo(kit, r); if (!html) return [...sai, 'trang hồ sơ không vẽ được'];
  const dai = Object.fromEntries(daiCua(html).map(o => [o.k, o.tra])); let cap = 0;
  for (const o of O_150) { cap += 1; if (hx.tom_tat.moi_nguoi[o] !== dai[o]) sai.push(`hàng X, khoá ${o}: khối «${hx.tom_tat.moi_nguoi[o]}» ≠ trang «${dai[o]}»`); }
  const ck = ckCua(html); const sang = { token: v => so150(v), ma: v => v.slice(0, 7) };
  for (const [o, v] of Object.entries(hx.tom_tat.chu_kho)) { cap += 1; if ((sang[o] || String)(v) !== ck[o]) sai.push(`hàng X, khoá ${o}: khối ${v} ≠ trang ${ck[o]}`); }
  for (const [o, v] of Object.entries(CK_150(sha))) if (hx.tom_tat.chu_kho[o] !== v) sai.push(`hàng X, khoá ${o}: ${hx.tom_tat.chu_kho[o]} ≠ viết sẵn ${v}`);
  if (hx.tom_tat.moi_nguoi.trang_thai !== hx.trang_thai) sai.push('tom_tat.trang_thai ≠ trang_thai của hàng');
  if (!hy || hy.tom_tat !== null) sai.push(`hàng Y tom_tat ${hy && JSON.stringify(hy.tom_tat)}`);
  for (const kh of ['ma', 'cau_giao', 'hang', 'nhom', 'dung_tren', 'trang_thai', 'nhom_trang_thai', 'ho_so', 'theo_loi', 'co', 'bat_khi', 'vi_sao']) if (!(kh in hx)) sai.push(`hàng X mất khoá bản 1 ${kh}`);
  if (!sai.length) console.log(`    · ${cap} cặp so`);
  return sai;
}
if (want('LT-156') && await chayCa('LT-156', lt156)) ok('LT-156', 'khối bản 2: tom_tat hai nhóm khoá, mỗi giá trị == ô cùng tên trên trang hồ sơ và == bảng viết sẵn; hàng không hồ sơ null; khoá bản 1 giữ');
if (want('LT-156-do')) await chayDo('LT-156-do', lt156, [['scripts/ho-so-tom-tat.cjs', 'usage.khoi.reduce((a, k) => a + k.token, 0)', 'usage.khoi.reduce((a, k) => a + k.tac_tu, 0)']], 'khoá token', 'bản sao mô-đun đếm tác tử thay token');

// ── LT-157: đọc hai chiều ────────────────────────────────────────────────
const chepRoi = src => { const i = src.indexOf('export function docDuLieu'); if (i < 0) throw new Error('nguồn không có docDuLieu'); let j = src.indexOf('{', i); let sau = 0; for (; j < src.length; j++) { if (src[j] === '{') sau++; else if (src[j] === '}') { sau--; if (!sau) break; } } return new Function(`return (${src.slice(i + 7, j + 1)});`)(); };
async function lt157(kit, ca) {
  const { r } = kho150(); const sai = []; const M = await napLT(kit);
  const moi = veM(M, r); const cu = veBang(banGocX2(), r).trang; if (!cu) return ['bộ vẽ gốc không ra trang'];
  if (ca === 'moi-doc-cu') {
    const x = M.LT.docDuLieu(cu);
    if (!x.duLieu) sai.push(`không đọc được trang bản 1: ${x.canhBao}`);
    else { if (x.duLieu.lo_trinh[0].hang.some(h => h.tom_tat !== null)) sai.push('trang bản 1 có hàng tom_tat khác null'); if (x.canhBao.length !== 1 || !x.canhBao[0].includes('khuôn bản 1')) sai.push(`cảnh báo ${JSON.stringify(x.canhBao)}`); }
  } else if (ca === 'cu-doc-moi') {
    const docCu = chepRoi(readFileSync(path.join(banGocX2(), 'scripts', 'lo-trinh.mjs'), 'utf8'));
    let a; try { a = docCu(moi); } catch (e) { return [`bộ đọc bản 1 ném: ${e.message}`]; }
    const b = M.LT.docDuLieu(moi).duLieu;
    if (!a.duLieu) return [`bộ đọc bản 1 trả null: ${a.canhBao}`];
    if (a.canhBao.length !== 1 || !a.canhBao[0].includes('mới hơn bộ đọc')) sai.push(`cảnh báo bộ đọc cũ ${JSON.stringify(a.canhBao)}`);
    const KC = (await napLT(banGocX2())).LT.KHUON_DU_LIEU;
    for (const k of KC.goc) if (k !== 'phien_ban' && !deq(a.duLieu[k], b[k]) && k !== 'lo_trinh') sai.push(`gốc.${k} lệch`);
    a.duLieu.lo_trinh.forEach((t, i) => { for (const k of KC.lo_trinh) if (k !== 'hang' && !deq(t[k], b.lo_trinh[i][k])) sai.push(`lo_trinh.${k} lệch`); t.hang.forEach((h, j) => { for (const k of KC.hang) if (!deq(h[k], b.lo_trinh[i].hang[j][k])) sai.push(`hang ${h.ma}.${k} lệch`); }); });
  } else {
    const tach = chepRoi(readFileSync(path.join(kit, 'scripts', 'lo-trinh.mjs'), 'utf8'));
    for (const [ten, h] of [['moi', moi], ['cu', cu]]) if (!deq(tach(h), M.LT.docDuLieu(h))) sai.push(`bản chép rời ≠ bản mô-đun trên trang ${ten}`);
  }
  return sai;
}
// LT-157 khoa-vang (Cổng Bằng chứng lượt 2, Ngoài-2 + Ngoài-3, nâng vào AC-8): khối thiếu trường đọc ra
// RỖNG THEO KIỂU đúng như bộ đọc bản 1 thật (rút từ commit gốc) ở mọi khoá bản 1; dải vắng một nhóm
// thì nhóm đó là object toàn null. So quan hệ với bộ đọc cũ, không viết tay giá trị.
async function lt157vang(kit) {
  const sai = []; const M = await napLT(kit);
  const docCu = chepRoi(readFileSync(path.join(banGocX2(), 'scripts', 'lo-trinh.mjs'), 'utf8'));
  const KC = (await napLT(banGocX2())).LT.KHUON_DU_LIEU;
  const khoi = o => `<script type="application/json" id="lo-trinh-du-lieu">${JSON.stringify(o)}</script>`;
  for (const pb of [1, 2]) {
    const o = { khuon: 'lo-trinh-du-lieu', phien_ban: pb, lo_trinh: [{ tien_do: { tong: 1 }, hang_ke: {}, hang: [{ cau_giao: 'x', ...(pb === 2 ? { tom_tat: { chu_kho: {} } } : {}) }], can_sua: [{}], moc: [{}], da_bac: [{}] }] };
    const a = docCu(khoi(o)).duLieu; const b = M.LT.docDuLieu(khoi(o)).duLieu;
    const L = i => [a.lo_trinh[0], b.lo_trinh[0]][i];
    for (const [cap, lay] of [['tien_do', t => t.tien_do], ['hang_ke', t => t.hang_ke], ['hang', t => t.hang[0]], ['can_sua', t => t.can_sua[0]], ['moc', t => t.moc[0]], ['da_bac', t => t.da_bac[0]]])
      for (const k of KC[cap]) if (!deq(lay(L(0))[k], lay(L(1))[k])) sai.push(`bản ${pb}: ${cap}.${k} cũ ${JSON.stringify(lay(L(0))[k])} ≠ mới ${JSON.stringify(lay(L(1))[k])}`);
    if (pb === 2) {
      const t = L(1).hang[0].tom_tat;
      for (const [cap, khoa] of [['moi_nguoi', M.LT.KHUON_DU_LIEU.moi_nguoi], ['chu_kho', M.LT.KHUON_DU_LIEU.chu_kho]]) {
        const x = t && t[cap];
        if (!x || typeof x !== 'object' || !khoa.every(k => k in x && x[k] === null)) sai.push(`tom_tat.${cap} vắng đọc ra ${JSON.stringify(x)} — cần object toàn null`);
      }
    }
  }
  return sai;
}
if (want('LT-157 khoa-vang') && await chayCa('LT-157 khoa-vang', lt157vang)) ok('LT-157 khoa-vang', 'khối thiếu trường: mọi khoá bản 1 == bộ đọc bản 1 thật (rỗng theo kiểu); nhóm dải vắng → object toàn null');
if (want('LT-157-do theo-ten')) await chayDo('LT-157-do theo-ten', lt157vang, [['scripts/lo-trinh.mjs', "const rong = (k, cap) => (ODON.includes(cap) ? null :", "const rong = (k, cap) => ([...KHUON.moi_nguoi, ...KHUON.chu_kho].includes(k) ? null :"]], 'tien_do.da_giao', 'bản sao xét ô dải theo tên trường');
if (want('LT-157-do nhom-vang')) await chayDo('LT-157-do nhom-vang', lt157vang, [['scripts/lo-trinh.mjs', "  const NUL = ['ten', 'loi', 'hang_ke', 'lenh', 'ho_so', 'tom_tat', 'moi_nguoi', 'chu_kho', 'gio_may', 'du_kien', 'qua_tai', 'ten_hien_thi', 'hien', 'con_lai'];", "  const NUL = ['ten', 'loi', 'hang_ke', 'lenh', 'ho_so', 'tom_tat', 'gio_may', 'du_kien', 'qua_tai', 'ten_hien_thi', 'hien', 'con_lai'];"], ['scripts/lo-trinh.mjs', "h.tom_tat[cap] == null || typeof h.tom_tat[cap] !== 'object' ? {}", "h.tom_tat[cap] == null ? {}"]], 'tom_tat.moi_nguoi', 'bản sao để nhóm dải vắng thành chuỗi rỗng');
if (want('LT-157 moi-doc-cu') && await chayCa('LT-157 moi-doc-cu', k => lt157(k, 'moi-doc-cu'))) ok('LT-157 moi-doc-cu', `bộ đọc mới đọc trang bộ vẽ ${GOC_X2}: tom_tat null mọi hàng, một cảnh báo «khuôn bản 1»`);
if (want('LT-157 cu-doc-moi') && await chayCa('LT-157 cu-doc-moi', k => lt157(k, 'cu-doc-moi'))) ok('LT-157 cu-doc-moi', 'bản chép rời bộ đọc bản 1 đọc trang bản 2: mọi khoá bản 1 bằng bộ đọc mới, một cảnh báo «mới hơn bộ đọc»');
if (want('LT-157 chep-roi') && await chayCa('LT-157 chep-roi', k => lt157(k, 'chep-roi'))) ok('LT-157 chep-roi', 'bản chép rời docDuLieu == bản trong mô-đun trên trang mới và cũ');

// ── LT-158: tài liệu bản 2 ───────────────────────────────────────────────
async function lt158(kit) {
  const sai = await lt119(kit);
  const t = existsSync(TL(kit)) ? readFileSync(TL(kit), 'utf8') : '';
  for (const c of ['phiên bản 2', 'khuôn bản 1']) if (!t.includes(c)) sai.push(`tài liệu không nói «${c}»`);
  const KM = (await napLT(kit)).LT.KHUON_DU_LIEU; for (const c of ['tom_tat', 'moi_nguoi', 'chu_kho']) if (!KM[c]) sai.push(`khuôn trong mã thiếu cấp ${c}`);
  return sai;
}
if (want('LT-158') && await chayCa('LT-158', lt158)) ok('LT-158', 'bảng khoá bản 2 của tài liệu == khuôn trong mã (cả tom_tat · moi_nguoi · chu_kho); tài liệu nói phiên bản 2 + cách đọc trang bản 1');
if (want('LT-158-do tai-lieu')) await chayDo('LT-158-do tai-lieu', lt158, [['skills/acceptance/references/lo-trinh-du-lieu.md', 'moi_nguoi.ket_qua — ', 'moi_nguoi.ketqua_bo — ']], 'ket_qua', 'bản sao tài liệu bỏ dòng moi_nguoi.ket_qua');
if (want('LT-158-do ma')) await chayDo('LT-158-do ma', lt158, [['scripts/lo-trinh.mjs', "\n  chu_kho: [", "\n  chu_kho: ['thu_x', "]], 'thu_x', 'bản sao khuôn thêm khoá thu_x');

// ── LT-159: bỏ đúng một cặp «» ───────────────────────────────────────────
const MA_TRAN_159 = [['«A»', 'A'], ['«A» và «B»', '«A» và «B»'], ['««A» b»', '«A» b'], ['A', 'A'], ['«»', ''], ['', ''], ['«A', '«A']];
async function lt159(kit, ca) {
  const sai = []; const HS = createRequire(import.meta.url)(path.join(kit, 'scripts', 'ho-so-tom-tat.cjs'));
  if (ca === 'ham') {
    for (const [vao, ra] of MA_TRAN_159) if (HS.boNgoacNgoai(vao) !== ra) sai.push(`ca «${vao}» → «${HS.boNgoacNgoai(vao)}» ≠ «${ra}»`);
    const crm = JSON.parse(readFileSync(path.join(FX, 'cau-giao-crm.json'), 'utf8')).cau;
    if (crm.length !== 12) sai.push(`fixture crm ${crm.length} câu ≠ 12`);
    for (const c of crm) { const o = HS.boNgoacNgoai(c); const dem = s => (s.match(/[«»]/g) || []).length; if (o !== c.slice(1, -1) || dem(o) !== dem(c) - 2) sai.push(`câu crm «${c.slice(0, 40)}» → «${o.slice(0, 40)}»`); }
    if (!sai.length) console.log(`    · ${MA_TRAN_159.length + crm.length} ca`);
  } else {
    const { r } = kho150(); const M = await napLT(kit); const lo = veM(M, r); const d = M.LT.docDuLieu(lo).duLieu;
    const h = id => d.lo_trinh[0].hang.find(x => x.ma === id);
    if (h('X').cau_giao !== 'Việc X có trang hồ sơ') sai.push(`khối hang X «${h('X').cau_giao}»`);
    if (h('Y').cau_giao !== '«A» và «B»') sai.push(`khối hang Y «${h('Y').cau_giao}»`);
    const hk = d.lo_trinh[0].hang_ke; if (!hk || hk.cau_giao !== h(hk.ma).cau_giao) sai.push(`hang_ke «${hk && hk.cau_giao}» ≠ câu của hàng`);
    if (h('X').bat_khi !== 'đọc «một» phút' || h('Y').vi_sao !== 'vì «Y»') sai.push('vi_sao/bat_khi bị đổi');
    const hien = lo.replace(/<script type="application\/json"[\s\S]*?<\/script>/, '');
    if (hien.includes('«Việc X có trang hồ sơ»') || !hien.includes('Việc X có trang hồ sơ')) sai.push('ô câu giao X trên trang lộ trình còn «»');
    if (hien.includes('«câu Z»')) sai.push('câu Z trên trang lộ trình còn «»');
    if (!hien.includes('«A» và «B»')) sai.push('câu Y bị cắt dấu');
    const { html } = trangHoSo(kit, r); if (!html || !html.includes('<h1>Việc X có trang hồ sơ</h1>')) sai.push('tiêu đề trang hồ sơ còn «» hoặc vắng');
    const mo = node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', r, '--hang', 'Z', '--mo-o', '--slug', 'viec-z', '--owner', 'x@y.z']);
    const opp = mo.status === 0 ? readFileSync(path.join(r, '_acceptance', 'viec-z', 'opportunity.md'), 'utf8') : '';
    const f = (opp.match(/^feature:\s*(.*)$/m) || [])[1]; if (!f || /«/.test(f) || !f.includes('câu Z')) sai.push(`--mo-o feature «${f}» (exit ${mo.status})`);
  }
  return sai;
}
if (want('LT-159 ham') && await chayCa('LT-159 ham', k => lt159(k, 'ham'))) ok('LT-159 ham', 'ma trận bảy ca + mười hai câu crm: bỏ đúng một cặp bao trọn, «» bên trong giữ');
if (want('LT-159 cho-in') && await chayCa('LT-159 cho-in', k => lt159(k, 'cho-in'))) ok('LT-159 cho-in', 'trang lộ trình · khối · trang hồ sơ · --mo-o in câu đã bỏ ngoặc; «A» và «B» giữ; vi_sao/bat_khi giữ chữ gốc');
if (want('LT-159-do')) await chayDo('LT-159-do', k => lt159(k, 'ham'), [['scripts/ho-so-tom-tat.cjs', "if (t.length < 2 || t[0] !== '«' || t[t.length - 1] !== '»') return t;", "return t.replace(/^«(.*)»$/, '$1');"]], 'ca ««A» và «B»»', 'bản sao bỏ ký tự đầu-cuối không xét cặp');

// ── LT-160: khuôn mẫu không «», tệp kế hoạch không bị đụng ───────────────
async function lt160(kit) {
  const sai = []; const tpl = JSON.parse(readFileSync(path.join(kit, 'skills', 'acceptance', 'references', 'lo-trinh-template.json'), 'utf8'));
  const cau = (tpl.hang || []).map(h => [h.ma, h.cau_giao]).filter(x => typeof x[1] === 'string');
  if (!cau.length) sai.push('khuôn không có câu giao nào'); for (const [m, c] of cau) if (c.startsWith('«')) sai.push(`khuôn hàng ${m} còn bọc «»`);
  const { r } = kho150(); const p = path.join(r, 'docs', 'lo-trinh.json'); const truoc = sha(p);
  await trangLoTrinh(kit, r); node([path.join(kit, 'scripts', 'product-map.mjs'), '--root', r]); node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', r, '--hang', 'Z', '--mo-o', '--slug', 'z2', '--owner', 'x@y.z']);
  if (sha(p) !== truoc) sai.push('tệp kế hoạch đổi sau khi vẽ + mở ô');
  return sai;
}
if (want('LT-160') && await chayCa('LT-160', lt160)) ok('LT-160', 'khuôn mẫu hàng không câu nào bọc «»; tệp kế hoạch giữ nguyên băm sau vẽ + mở ô');
if (want('LT-160-do')) await chayDo('LT-160-do', lt160, [['skills/acceptance/references/lo-trinh-template.json', '"cau_giao": "Trưởng nhóm mở trang X', '"cau_giao": "«Trưởng nhóm mở trang X']], 'còn bọc', 'bản sao khuôn bọc lại một câu');

// ── LT-161: `--check` không đỏ vì dải tóm tắt, vẫn đỏ vì mọi thứ khác ───────
// Dải đọc nội dung hồ sơ; một dòng sổ mới sau lượt vẽ không được làm CI của mọi kho đỏ. Ba ca trên CÙNG
// kho đã vẽ: (a) thêm dòng sổ → --check 0 «khớp» · (b) sửa chữ nhìn thấy → 1 «lệch» · (c) sửa trạng thái
// một hàng TRONG khối → 1 «lệch».
async function lt161(kit) {
  const sai = []; const pm = path.join(kit, 'scripts', 'product-map.mjs');
  const dung = () => { const { r } = kho150(); const w = node([pm, '--root', r]); if (w.status !== 0) throw new Error(`vẽ exit ${w.status}: ${w.stderr.slice(0, 120)}`); return r; };
  const ck = r => node([pm, '--root', r, '--check']);
  const ra = dung(); appendFileSync(path.join(ra, '_acceptance', SL, 'decisions.jsonl'), JSON.stringify({ id: 'd-moi', type: 'fix', stage: 'S4-r1', at: '2026-10-10T00:00:00Z', decision: 'thêm', why: 'v', cost_if_wrong: 'c' }) + '\n');
  const a = ck(ra); if (a.status !== 0 || !a.stdout.includes('LO-TRINH.html khớp')) sai.push(`thêm một dòng sổ mà --check exit ${a.status}: ${(a.stderr || a.stdout).slice(0, 120)}`);
  const rb = dung(); const pb = path.join(rb, 'LO-TRINH.html'); writeFileSync(pb, readFileSync(pb, 'utf8').replace('Việc X có trang hồ sơ', 'Việc X khác'));
  const b = ck(rb); if (b.status !== 1 || !b.stderr.includes('LO-TRINH.html lệch')) sai.push(`sửa chữ nhìn thấy mà --check exit ${b.status}`);
  const rc = dung(); const pc = path.join(rc, 'LO-TRINH.html'); const h = readFileSync(pc, 'utf8');
  const hc = h.replace(/("ma":"X","cau_giao":"[^"]*","hang":"[^"]*","nhom":"[^"]*","dung_tren":\[[^\]]*\],"trang_thai":")[^"]*"/, '$1Đang làm"');
  if (hc === h) sai.push('đối chứng: không sửa được trạng thái hàng X trong khối');
  writeFileSync(pc, hc); const c = ck(rc); if (c.status !== 1 || !c.stderr.includes('LO-TRINH.html lệch')) sai.push(`sửa trạng thái trong khối mà --check exit ${c.status}`);
  return sai;
}
if (want('LT-161') && await chayCa('LT-161', lt161)) ok('LT-161', 'thêm dòng sổ sau lượt vẽ: --check khớp; sửa chữ nhìn thấy hoặc trạng thái trong khối: --check lệch');
if (want('LT-161-do chat')) await chayDo('LT-161-do chat', lt161, [['scripts/lo-trinh.mjs', 'export const trangKhop = (coSan, veLai) => coSan === veLai || (', 'export const trangKhop = (coSan, veLai) => coSan === veLai || false && (']], 'thêm một dòng sổ', 'bản sao so từng byte cả dải');
if (want('LT-161-do long')) await chayDo('LT-161-do long', lt161, [['scripts/lo-trinh.mjs', "if (h && typeof h === 'object' && 'tom_tat' in h) h.tom_tat = null;", "if (h && typeof h === 'object') { h.tom_tat = null; h.trang_thai = ''; }"]], 'sửa trạng thái trong khối', 'bản sao bỏ qua cả trạng thái hàng');
// ═══ Vòng vong-la-mot-ket-qua (LT-142..LT-150) ═══════════════════════════════════════════════════
// Hồ sơ _acceptance/vong-la-mot-ket-qua/ (hàng S3): khoảng cỡ một nguồn (khối CAT-LUOT-CO của SKILL),
// tám cờ cỡ + dáng câu giao (`kiemCo`), đồng hồ cỡ (`--co`). Khoảng trong mọi bảng kỳ vọng RÚT từ khối
// của SKILL trong ca, không chép số. usage-report của kho thử sinh bằng CHÍNH wf-usage.mjs (bên ghi
// thật), tiêu đề rút từ dòng `--title` của Feature Loop SKILL. Răng «gốc» = git archive 68951cef.
const GOC_S3 = '68951cef';
const gocS3Dir = {};
function banGocS3(sha) {
  if (gocS3Dir[sha]) return gocS3Dir[sha];
  const d = path.join(TMP, `goc-${sha}`); mkdirSync(d, { recursive: true });
  execFileSync('tar', ['-x', '-C', d], { input: execFileSync('git', ['-C', KIT, 'archive', '--format=tar', sha, 'scripts', 'lib', 'skills'], { maxBuffer: 1 << 28 }) });
  return (gocS3Dir[sha] = d);
}
const SKILL_CL = kit => path.join(kit, 'skills', 'cat-luot', 'SKILL.md');
const khoangCua = async kit => (await napCL(kit)).napKhoang(SKILL_CL(kit));
// Hàng một đợt: mặc định đúng dáng nền, cỡ trong mục tiêu, mỗi hàng gánh một mã riêng.
const HC = (ma, o = {}) => ({ ma, cau_giao: `«việc ${ma} chạy đúng»`, dot: 'd1', phu: [`P-${ma}`], vai: 'nen', bat_khi: 'đo được', tieu_chi: 9, ...o });
// Kho thử từ danh sách hàng; bản phạm vi = mọi mã `phu` của hàng cùng đợt d1.
function khoCo(hang, them = {}) {
  const ma = hang.filter(r => r.dot === 'd1').flatMap(r => r.phu || []).map(c => [c]);
  return khoCL({ pv: vietPV({ dot: 'd1', ma }), lt: { schema: 1, hang, ...them } });
}
const dongCua = (x, ma) => x.stdout.split('\n').filter(l => l.includes(`hàng ${ma} [`));
const coCuaDong = l => (l.match(/\[([a-z-]+)\]/) || [])[1];

// ── LT-142: khoảng cỡ một nguồn ──────────────────────────────────────────────
async function lt142(kit) {
  const sai = []; const C = await napCL(kit);
  const r = khoCo([HC('R11', { tieu_chi: 11 })]);
  const x = rang(kit, r);
  if (x.status !== 0 || !dongCua(x, 'R11').some(l => l.startsWith('cảnh báo: hàng R11 [tren-muc-tieu]'))) sai.push(`đối chứng: gói lành, hàng 11 → exit ${x.status} ${JSON.stringify(dongCua(x, 'R11'))}`);
  // Khối có chú thích cuối dòng vẫn đọc đúng (Review Focus 1).
  const chu = banSao([['skills/cat-luot/SKILL.md', 'tach_tu: 13\n', 'tach_tu: 13   # từ 13 phải tách\n']], kit);
  const xc = rang(chu, r); if (xc.status !== 0 || !dongCua(xc, 'R11').some(l => l.includes('[tren-muc-tieu]'))) sai.push(`đối chứng: khối có chú thích → exit ${xc.status} «${xc.stderr.trim()}»`);
  const sua = banSao([['skills/cat-luot/SKILL.md', 'cho_phep_den: 12\ntach_tu: 13\n', 'cho_phep_den: 10\ntach_tu: 11\n']], kit);
  const y = rang(sua, r);
  if (y.status !== 1 || !dongCua(y, 'R11').some(l => l.startsWith('lỗi: hàng R11 [can-tach]'))) sai.push(`khối sửa không đổi cờ: exit ${y.status} ${JSON.stringify(dongCua(y, 'R11'))}`);
  // Ma trận khối hỏng — viết sẵn: [tên ca, biến đổi khối, khoá phải được gọi tên].
  const thay = (cu, moi) => k => k.replace(cu, moi);
  // Cụm ghim RIÊNG của nhánh kiểm mà ca đại diện (S4-r1 t9: tên khoá trần trùng thông điệp nhánh khác).
  const CA = [['vang-khoi', null, 'thiếu khối CAT-LUOT-CO'],
    ...C.KHOA_CO.map(kh => [`thieu-${kh}`, k => k.split('\n').filter(l => !l.startsWith(`${kh}:`)).join('\n'), `thiếu khoá ${kh}`]),
    ['muc-tieu-0', thay('muc_tieu: 8-10', 'muc_tieu: 0-10'), 'muc_tieu «0-10» phải là'], ['tran-0', thay('tran_luot_cham: 3', 'tran_luot_cham: 0'), 'tran_luot_cham «0» phải là số nguyên dương'],
    ['it-chu', thay('it_du_lieu_duoi: 10', 'it_du_lieu_duoi: abc'), 'it_du_lieu_duoi «abc» phải là số nguyên dương'], ['muc-tieu-nguoc', thay('muc_tieu: 8-10', 'muc_tieu: 10-8'), 'muc_tieu «10-8» ngược'],
    ['cho-phep-nho', thay('cho_phep_den: 12', 'cho_phep_den: 9'), 'cho_phep_den 9 nhỏ hơn cuối muc_tieu'], ['tach-ho', thay('tach_tu: 13', 'tach_tu: 14'), 'khoảng hở'], ['tach-chong', thay('tach_tu: 13', 'tach_tu: 12'), 'khoảng chồng']];
  const KHOI_RE = /(<!-- <<<CAT-LUOT-CO -->\n```[a-z]*\n)([\s\S]*?)(```\n<!-- CAT-LUOT-CO>>> -->)/;
  for (const [ten, bien, khoa] of CA) {
    const c = banSao([], kit); const p = SKILL_CL(c); const sk = readFileSync(p, 'utf8');
    if (!KHOI_RE.test(sk)) return ['SKILL không có khối CAT-LUOT-CO để dựng ca hỏng'];
    const moi = bien ? sk.replace(KHOI_RE, (m, a, k, b) => a + bien(k) + b) : sk.replace(KHOI_RE, '');
    if (moi === sk) { sai.push(`${ten}: biến đổi không đổi khối`); continue; }
    writeFileSync(p, moi);
    const z = rang(c, r);
    if (z.status !== 2 || !z.stderr.includes(khoa) || z.stdout.includes('bảng phủ')) sai.push(`${ten}: exit ${z.status}, stderr «${z.stderr.trim().slice(0, 120)}», cần «${khoa}»`);
  }
  console.log(`    · LT-142 ma trận khối hỏng: ${CA.length} ca`);
  if (CA.length !== 13) sai.push(`ma trận ${CA.length} ca, hợp đồng hứa 13`);
  return sai;
}
if (want('LT-142') && await chayCa('LT-142', lt142)) ok('LT-142', 'khoảng đọc từ khối SKILL: gói lành hàng 11 → tren-muc-tieu; khối sửa → can-tach; 13 khối hỏng → thoát 2 nêu khoá');
if (want('LT-142-do-nhanh')) await chayDo('LT-142-do-nhanh', lt142, [['scripts/co-hop-dong.cjs', 'if (c < cuoi) loi.push(`khoá cho_phep_den ${c} nhỏ hơn cuối muc_tieu ${cuoi}`);\n    else if', 'if']], 'cho-phep-nho', 'bản sao gỡ nhánh cho_phep_den nhỏ hơn mục tiêu');
if (want('LT-142-do')) await chayDo('LT-142-do', lt142, [['scripts/cat-luot.mjs', 'let khoang; try { khoang = napKhoang(); } catch (e) { thoat(2, e.message); }', 'const khoang = { muc_tieu: [8, 10], cho_phep_den: 12, tach_tu: 13, tran_luot_cham: 3, it_du_lieu_duoi: 10 };']], 'khối sửa không đổi cờ', 'bản sao nướng khoảng thành hằng');

// ── LT-143: ma trận cỡ dự kiến ───────────────────────────────────────────────
async function lt143(kit) {
  const sai = []; const k = await khoangCua(kit); const [dau, cuoi] = k.muc_tieu;
  const mong = v => {
    if (v === undefined) return ['chua-uoc-tieu-chi', 'cảnh báo'];
    if (!(Number.isInteger(v) && v > 0)) return ['tieu-chi-sai-kieu', 'lỗi'];
    if (v >= k.tach_tu) return ['can-tach', 'lỗi'];
    if (v > cuoi) return ['tren-muc-tieu', 'cảnh báo'];
    if (v < dau) return ['duoi-muc-tieu', 'cảnh báo'];
    return null;
  };
  const MT = [...Array.from({ length: 16 }, (_, i) => [`C${i + 1}`, i + 1]), ['CV', undefined], ['CS1', '9'], ['CS2', 9.5], ['CS3', 0], ['CS4', -3]];
  const hang = MT.map(([ma, v]) => { const r = HC(ma); if (v === undefined) delete r.tieu_chi; else r.tieu_chi = v; return r; });
  const x = rang(kit, khoCo(hang)); const COC = ['can-tach', 'tren-muc-tieu', 'duoi-muc-tieu', 'tieu-chi-sai-kieu', 'chua-uoc-tieu-chi'];
  if (x.status !== 1) sai.push(`đợt có lỗi cỡ: exit ${x.status}`);
  for (const [ma, v] of MT) {
    const ds = dongCua(x, ma).filter(l => COC.includes(coCuaDong(l))); const m = mong(v);
    if (!m) { if (ds.length) sai.push(`hàng ${ma} (${v}): không cờ cỡ mà có ${JSON.stringify(ds)}`); continue; }
    if (ds.length !== 1 || !ds[0].startsWith(`${m[1]}: hàng ${ma} [${m[0]}]: `)) { sai.push(`hàng ${ma} (${v}): cần ${m[1]} [${m[0]}], có ${JSON.stringify(ds)}`); continue; }
    // Số nêu trong CÂU cờ (phần sau «]: », không tính mã hàng) phải bằng đúng tieu_chi của hàng (S4-r1 t8).
    const cau = ds[0].slice(ds[0].indexOf(']: ') + 3);
    const soCau = Number.isInteger(v) && v > 0 ? Number((cau.match(/dự kiến (\d+) tiêu chí/) || [])[1]) : null;
    if (Number.isInteger(v) && v > 0 ? soCau !== v : (v !== undefined && !cau.includes(`tieu_chi ${JSON.stringify(v)}`))) sai.push(`hàng ${ma} (${v}): câu cờ nêu sai số «${cau.slice(0, 60)}»`);
  }
  console.log(`    · LT-143 ma trận: ${MT.length} phần tử (16 cỡ + thiếu + 4 sai kiểu)`);
  if (MT.length !== 21) sai.push(`ma trận ${MT.length}, hợp đồng hứa 21`);
  const y = rang(kit, khoCo([HC('K8', { tieu_chi: dau }), HC('K9', { tieu_chi: dau + 1 }), HC('K10', { tieu_chi: cuoi })]));
  if (y.status !== 0 || /\[(can-tach|tren-muc-tieu|duoi-muc-tieu|tieu-chi-sai-kieu|chua-uoc-tieu-chi)\]/.test(y.stdout)) sai.push(`đối chứng: đợt chỉ trong mục tiêu → exit ${y.status}`);
  return sai;
}
if (want('LT-143') && await chayCa('LT-143', lt143)) ok('LT-143', '21 phần tử cỡ (1…16, thiếu, bốn sai kiểu) mỗi hàng đúng cờ, đúng mức, nêu con số; đợt chỉ trong mục tiêu → 0');
if (want('LT-143-do-so')) await chayDo('LT-143-do-so', lt143, [['scripts/cat-luot.mjs', '`dự kiến ${v} tiêu chí — từ ${k.tach_tu}', '`dự kiến ${k.tach_tu} tiêu chí — từ ${k.tach_tu}']], 'hàng C14', 'bản sao in ngưỡng tách thay số của hàng');
if (want('LT-143-do')) await chayDo('LT-143-do', lt143, [['scripts/cat-luot.mjs', 'else if (v >= k.tach_tu)', 'else if (v > k.tach_tu)']], 'hàng C13', 'bản sao so > ở ngưỡng tách');

// ── LT-144: gộp hàng nhỏ cùng nhóm ───────────────────────────────────────────
async function lt144(kit) {
  const sai = [];
  const gopCua = (x, ma) => dongCua(x, ma).filter(l => l.includes('[duoi-muc-tieu]')).join(' | ');
  const a = rang(kit, khoCo([HC('A', { tieu_chi: 4, nhom: 'g' }), HC('B', { tieu_chi: 5, nhom: 'g' })]));
  if (!gopCua(a, 'A').includes('gộp được với B (tổng 9)') || !gopCua(a, 'B').includes('gộp được với A (tổng 9)')) sai.push(`ca dương: «${gopCua(a, 'A')}» / «${gopCua(a, 'B')}»`);
  const CA = { 'khac-nhom': [HC('A', { tieu_chi: 4, nhom: 'g' }), HC('B', { tieu_chi: 5, nhom: 'h' })],
    'vuot-tong': [HC('A', { tieu_chi: 6, nhom: 'g' }), HC('B', { tieu_chi: 7, nhom: 'g' })],
    'khac-dot': [HC('A', { tieu_chi: 4, nhom: 'g' }), HC('B', { tieu_chi: 5, nhom: 'g', dot: 'd2' })],
    'nhom-vang': [HC('A', { tieu_chi: 4 }), HC('B', { tieu_chi: 5 })] };
  for (const [ten, hang] of Object.entries(CA)) { const g = gopCua(rang(kit, khoCo(hang)), 'A'); if (!g) sai.push(`${ten}: hàng A mất dòng dưới mục tiêu`); else if (g.includes('gộp được với')) sai.push(`${ten}: hàng A vẫn được mời gộp «${g}»`); }
  return sai;
}
if (want('LT-144') && await chayCa('LT-144', lt144)) ok('LT-144', 'hai hàng 4 + 5 cùng nhóm → mỗi dòng nêu gộp được với hàng kia (tổng 9); khác nhóm · vượt tổng · khác đợt · nhóm vắng → không mời gộp');
if (want('LT-144-do')) await chayDo('LT-144-do', lt144, [['scripts/cat-luot.mjs', 'chuoi(x.r.nhom) === chuoi(r.nhom) && ', '']], 'khac-nhom', 'bản sao bỏ điều kiện cùng nhóm');

// ── LT-145: hai dáng câu giao ────────────────────────────────────────────────
async function lt145(kit) {
  const sai = []; const VAI = 'Trưởng phòng ban';
  const MT = [
    ['mo-cau', { vai: VAI, cau_giao: `${VAI} mở trang OKR và thấy KR trễ` }, null],
    ['dau-va-hoa', { vai: VAI.toLowerCase(), cau_giao: `«${VAI} mở trang OKR và thấy KR trễ»` }, null],
    ['nfd-nfc', { vai: VAI.normalize('NFD'), cau_giao: `«${VAI.normalize('NFC')} mở trang và thấy KR»` }, null],
    ['giua-cau', { vai: VAI, cau_giao: `«Mở trang, ${VAI} thấy KR trễ»` }, ['vai-khong-mo-cau', 'lỗi']],
    ['vang-trong-cau', { vai: 'Kế toán', cau_giao: `«${VAI} mở trang và thấy KR»` }, ['vai-khong-mo-cau', 'lỗi']],
    ['nen-co-nguong', { vai: 'nen', bat_khi: 'mười lượt không nhân đôi' }, null],
    ['nen-thieu-nguong', { vai: 'nen', bat_khi: undefined }, ['nen-thieu-bat-khi', 'lỗi']],
    ['nen-nguong-trang', { vai: 'nen', bat_khi: '   ' }, ['nen-thieu-bat-khi', 'lỗi']],
    ['thieu-vai', { vai: undefined }, ['chua-khai-dang-giao', 'cảnh báo']],
  ];
  const DANG = ['vai-khong-mo-cau', 'nen-thieu-bat-khi', 'chua-khai-dang-giao'];
  for (const [ten, o, m] of MT) {
    const r = HC('V', o); for (const f of ['vai', 'bat_khi']) if (r[f] === undefined) delete r[f];
    const x = rang(kit, khoCo([r])); const ds = dongCua(x, 'V').filter(l => DANG.includes(coCuaDong(l)));
    const thoat = m && m[1] === 'lỗi' ? 1 : 0;
    if (!m ? ds.length : (ds.length !== 1 || !ds[0].startsWith(`${m[1]}: hàng V [${m[0]}]`))) sai.push(`${ten}: cần ${m ? `${m[1]} [${m[0]}]` : 'không cờ'}, có ${JSON.stringify(ds)}`);
    if (x.status !== thoat) sai.push(`${ten}: exit ${x.status}, cần ${thoat}`);
  }
  console.log(`    · LT-145 ma trận: ${MT.length} ca`);
  if (MT.length !== 9) sai.push(`ma trận ${MT.length}, hợp đồng hứa 9`);
  return sai;
}
if (want('LT-145') && await chayCa('LT-145', lt145)) ok('LT-145', '9 ca dáng câu giao: vai mở câu (không dấu · có dấu và khác hoa · NFD/NFC) im; vai giữa câu · vai vắng trong câu · nền thiếu ngưỡng (vắng · trắng) đỏ; thiếu vai vàng');
if (want('LT-145-do')) await chayDo('LT-145-do', lt145, [['scripts/cat-luot.mjs', '.startsWith(chuanCau(vai))', '.includes(chuanCau(vai))']], 'giua-cau', 'bản sao so «có trong câu» thay «mở câu»');

// ── LT-146: hàng ngoài đợt gom một dòng mỗi cờ ───────────────────────────────
async function lt146(kit) {
  const sai = [];
  const ngoai = Array.from({ length: 10 }, (_, i) => { const r = HC(`N${i + 1}`, { dot: i % 2 ? 'd2' : undefined, vai: undefined }); delete r.vai; if (r.dot === undefined) delete r.dot; return r; });
  ngoai[0].tieu_chi = 20; ngoai[1].tieu_chi = 'x'; delete ngoai[2].tieu_chi;
  ngoai.push(HC('V1', { dot: 'd2', vai: 'Kế toán', cau_giao: '«Trưởng nhóm thấy»' }), HC('V2', { dot: 'd2', vai: 'nen', bat_khi: '' }));
  const CO6 = { 'can-tach': 1, 'tieu-chi-sai-kieu': 1, 'chua-uoc-tieu-chi': 1, 'vai-khong-mo-cau': 1, 'nen-thieu-bat-khi': 1, 'chua-khai-dang-giao': 10 };
  const x = rang(kit, khoCo([HC('S1'), ...ngoai]));
  if (x.status !== 0) sai.push(`hàng ngoài đợt làm đổi mã thoát: ${x.status}`);
  for (const [co, k] of Object.entries(CO6)) {
    const ds = x.stdout.split('\n').filter(l => l.startsWith(`cảnh báo: [${co}]`));
    if (ds.length !== 1 || !ds[0].startsWith(`cảnh báo: [${co}] ${k} hàng ngoài đợt d1 — `)) sai.push(`[${co}]: cần đúng một dòng gom ${k} hàng, có ${JSON.stringify(ds)}`);
  }
  const ck = x.stdout.split('\n').find(l => l.startsWith('cảnh báo: [chua-khai-dang-giao]')) || '';
  if (!ck.endsWith(', …') || (ck.match(/\bN\d+\b/g) || []).length !== 8) sai.push(`dòng 10 hàng không liệt 8 mã rồi «…»: «${ck}»`);
  const tung = x.stdout.split('\n').filter(l => /^cảnh báo: hàng (N|V)\d+ \[/.test(l));
  if (tung.length) sai.push(`cờ hàng ngoài đợt không gom một dòng: ${tung.slice(0, 2).join(' | ')}`);
  const vao = ngoai.map(r => ({ ...r, dot: 'd1' }));
  const y = rang(kit, khoCo([HC('S1'), ...vao])); if (y.status !== 1) sai.push(`đối chứng: cùng hàng chuyển vào đợt → exit ${y.status}`);
  return sai;
}
if (want('LT-146') && await chayCa('LT-146', lt146)) ok('LT-146', 'sáu cờ ở hàng ngoài đợt (khác đợt · không dot) → thoát 0, mỗi cờ đúng một dòng vàng gom, 10 hàng liệt 8 mã rồi «…»; chuyển vào đợt → thoát 1');
if (want('LT-146-do')) await chayDo('LT-146-do', lt146, [['scripts/cat-luot.mjs', 'for (const { r, nhan } of ngoai) for (const [co] of coCuaHang(r, k)) if (!CO_CHI_TRONG_DOT.has(co)) { if (!gom.has(co)) gom.set(co, []); gom.get(co).push(nhan); }', 'for (const { r, nhan } of ngoai) for (const [co, cau] of coCuaHang(r, k)) canhBao.push(`hàng ${nhan} [${co}]: ${cau}`);']], 'một dòng', 'bản sao in theo từng hàng');

// ── LT-147: đường đọc-cũ — răng gốc vs răng mới, trang không đổi byte ────────
const tachDong = s => s.split('\n').filter(Boolean);
const chuChoDieuKien = t => String(t).replace(/hay chân trời nào/g, 'hay mục chờ điều kiện nào').replace(/chân trời/g, 'chờ điều kiện');
async function lt147(kit) {
  const sai = []; const C = await napCL(kit); const goc = banGocS3(GOC_S3);
  const tplGoc = JSON.parse(git(KIT, 'show', `${GOC_S3}:skills/acceptance/references/lo-trinh-template.json`));
  const maMau = [...(tplGoc.hang || []), ...(tplGoc.chan_troi || [])].filter(r => r.dot === 'mau-1').flatMap(r => r.phu || []);
  const moi = [{ ma: 'Z1', dot: 'moi-1', phu: ['Z1a'], cau_giao: '«Trưởng nhóm mở trang và thấy việc tuần này»', vai: 'Trưởng nhóm', tieu_chi: 9 },
    { ma: 'Z2', dot: 'moi-1', phu: ['Z2a'], cau_giao: '«Lệnh đồng bộ không nhân đôi bản ghi»', vai: 'nen', bat_khi: 'mười lượt không đổi', tieu_chi: 8 }];
  const cong = d => ({ ...d, hang: [...(d.hang || []), ...moi] });
  const KHO = { 'khuon-goc': [tplGoc, vietPV({ dot: 'mau-1', ma: maMau.map(c => [c]) })],
    'kit-that': [cong(JSON.parse(readFileSync(path.join(KIT, 'docs', 'plans', 'lo-trinh-kit.json'), 'utf8'))), vietPV({ dot: 'moi-1', ma: [['Z1a'], ['Z2a']] })],
    'crm-okr': [cong(JSON.parse(readFileSync(path.join(FX, 'crm-okr.json'), 'utf8'))), vietPV({ dot: 'moi-1', ma: [['Z1a'], ['Z2a']] })] };
  let coThem = 0;
  for (const [ten, [lt, pv]] of Object.entries(KHO)) {
    // ra-soat-lo-trinh: chữ «chân trời» đổi CÓ CHỦ Ý thành «chờ điều kiện» — bên đời trước đi qua đúng phép đổi chữ này
    // trước khi so; lời hứa gốc (dòng không vàng không đổi) giữ nguyên nghĩa.
    const r = khoCL({ pv, lt }); const a0 = rang(goc, r); const a = { ...a0, stdout: chuChoDieuKien(a0.stdout) }; const b = rang(kit, r);
    const khongVang = x => tachDong(x.stdout).filter(l => !l.startsWith('cảnh báo:'));
    if (a.status !== b.status) sai.push(`${ten}: mã thoát gốc ${a.status} ≠ mới ${b.status} — ${tachDong(b.stdout).filter(l => l.startsWith('lỗi:')).slice(0, 2).join(' | ')}`);
    if (!deq(khongVang(a), khongVang(b))) sai.push(`${ten}: dòng không vàng lệch — mới thêm ${JSON.stringify(khongVang(b).filter(l => !khongVang(a).includes(l)).slice(0, 2))}`);
    const cu = tachDong(a.stdout); const them = tachDong(b.stdout).filter(l => { const i = cu.indexOf(l); if (i >= 0) { cu.splice(i, 1); return false; } return true; });
    for (const l of them) if (!l.startsWith('cảnh báo:') || !C.CO_TEN.some(co => l.includes(`[${co}]`))) sai.push(`${ten}: dòng thêm không phải cờ vàng có tên «${l}»`);
    coThem += them.length; console.log(`    · LT-147 ${ten}: exit ${b.status}, ${them.length} dòng vàng thêm`);
  }
  if (!coThem) sai.push('đối chứng: không kho nào có dòng vàng thêm — cờ đọc-cũ không in');
  const hang = [{ ma: 'A', cau_giao: '«Trưởng nhóm mở trang»', vai: 'Trưởng nhóm', tieu_chi: 9 }, { ma: 'B', cau_giao: '«đồng bộ»', vai: 'nen', tieu_chi: 14, dung_tren: ['A'] }];
  const tCo = veBang(kit, kho({ data: { schema: 1, hang } })).trang;
  const tKhong = veBang(kit, kho({ data: { schema: 1, hang: hang.map(({ vai, tieu_chi, ...r }) => r) } })).trang;
  if (!tCo || tCo !== tKhong) sai.push('trang lộ trình lệch byte khi hàng mang vai/tieu_chi');
  return sai;
}
if (want('LT-147') && await chayCa('LT-147', lt147)) ok('LT-147', `ba lộ trình đời trước (khuôn ${GOC_S3} · kit thật · crm-okr): răng gốc và mới cùng mã thoát, cùng dòng không vàng, chỉ thêm cờ vàng có tên; trang không đổi byte`);
if (want('LT-147-do')) await chayDo('LT-147-do', lt147, [['scripts/cat-luot.mjs', "const CO_LOI = new Set(['can-tach', 'tieu-chi-sai-kieu', 'vai-khong-mo-cau', 'nen-thieu-bat-khi']);", "const CO_LOI = new Set(['can-tach', 'tieu-chi-sai-kieu', 'vai-khong-mo-cau', 'nen-thieu-bat-khi', 'chua-khai-dang-giao']);"]], 'chua-khai-dang-giao', 'bản sao coi thiếu vai trong đợt là lỗi');
if (want('LT-147-do-trang')) await chayDo('LT-147-do-trang', lt147, [['scripts/lo-trinh.mjs', 'cau_giao: `${esc(chuoi(d.cau_giao))}', 'cau_giao: `${esc(chuoi(d.cau_giao))}${d.vai ? ` (${esc(chuoi(d.vai))})` : \'\'}']], 'lệch byte', 'bản sao bộ vẽ in vai');

// ── LT-148/149: đồng hồ cỡ ───────────────────────────────────────────────────
const WF_USAGE = path.join(KIT, 'feature-loop', 'scripts', 'wf-usage.mjs');
// Tiêu đề lượt chấm RÚT từ dòng --title của Feature Loop SKILL (bên ghi), thay N bằng số lượt.
const TIEU_DE_S4 = (() => { const m = readFileSync(path.join(KIT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8').match(/--title "<[^">]*?(S4 round N)[^">]*>"/); return m ? m[1] : null; })();
const tranGia = () => { const d = path.join(TMP, `wf-${++khoN}`); mkdirSync(d, { recursive: true }); writeFileSync(path.join(d, 'agent-aaaa1111.jsonl'), JSON.stringify({ type: 'user', timestamp: '2026-10-01T00:00:00.000Z', message: { role: 'user', content: '[wf-label: machine:x]' } }) + '\n' + JSON.stringify({ type: 'assistant', timestamp: '2026-10-01T00:00:05.000Z', message: { id: 'm1', model: 'claude-haiku-5-5', role: 'assistant', usage: { input_tokens: 1, output_tokens: 2 } } }) + '\n'); return d; };
function usageThat(soLuot, them = []) {
  const d = tranGia(); let out = '';
  const ghi = t => { const x = node([WF_USAGE, d, '--md', '--title', t]); if (x.status !== 0) throw new Error(`wf-usage exit ${x.status}: ${x.stderr}`); out += x.stdout; };
  for (const t of them) ghi(t);
  for (let i = 1; i <= soLuot; i++) ghi(TIEU_DE_S4.replace('N', String(i)));
  return out;
}
const HDC = ({ status, tc, dang = 'gach', ngay = '2026-10-01T00:00:00Z', veto = '' }) => {
  const ac = Array.from({ length: tc }, (_, i) => (dang === 'gach' ? `- AC-${i + 1}: Given a, When b, Then c${i}.` : `### AC-${i + 1} — nhãn ${i}\n\nGiven a, When b, Then c${i}.\n`)).join('\n');
  return `---\nschema_version: 1\nfeature: x\nslug: x\nowner: x@y.z\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\napproved_by: M\napproved_at: ${ngay}\n${veto ? `veto_opened_at: ${veto}\n` : ''}---\n\n## Criteria\n\n${tc ? ac : 'Chưa có tiêu chí nào — văn xuôi.'}\n\n## Out of scope\n\n- x\n- y\n`;
};
function khoDongHo(hs) {
  const r = kho({ khoa: false });
  for (const [slug, o] of Object.entries(hs)) {
    const d = path.join(r, '_acceptance', slug); mkdirSync(d, { recursive: true }); writeFileSync(path.join(d, 'contract.md'), HDC(o));
    if (o.luot != null || o.them) writeFileSync(path.join(d, 'usage-report.md'), usageThat(o.luot || 0, o.them || []));
  }
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'ho so'); return r;
}
const coJ = (kit, r, them = []) => { const x = chayCL(kit, r, ['--co', ...them]); if (x.status !== 0) throw new Error(`--co exit ${x.status}: ${x.stderr}`); return JSON.parse(x.stdout); };
// Tính tay trong ca từ bảng hồ sơ đã dựng — độc lập với mã của script.
function tinhTay(hs, k, { tu = null } = {}) {
  const GIAO = ['signed-off', 'machine-cleared', 'da-cham-boi-thuc-te'];
  const chot = Object.values(hs).filter(o => o.status !== 'draft' && o.tc > 0 && (!tu || ((o.ngay || o.veto || '').slice(0, 10) && (o.ngay || o.veto).slice(0, 10) >= tu)));
  const giao = o => GIAO.includes(o.status) && o.luot > 0;
  const tk = ds => (ds.length ? { n: ds.length, luot_tb: Math.round(100 * ds.reduce((s, o) => s + o.luot, 0) / ds.length) / 100, cham_tran_pt: Math.round(100 * ds.filter(o => o.luot >= k.tran_luot_cham).length / ds.length) } : { n: 0 });
  const [dau, cuoi] = k.muc_tieu; const nhom = [[1, dau - 1], [dau, cuoi], [cuoi + 1, k.cho_phep_den], [k.tach_tu, 999]].map(([a, b]) => { const g = chot.filter(o => o.tc >= a && o.tc <= b); return { n_chot: g.length, ...tk(g.filter(giao)), it: g.filter(giao).length < k.it_du_lieu_duoi }; });
  const g = chot.filter(o => o.tc >= dau && o.tc <= k.cho_phep_den);
  return { nhom, trong: chot.length ? { n_chot: chot.length, n_trong: g.length, pt_tong: Math.round(100 * g.length / chot.length), ...tk(g.filter(giao)) } : null };
}
const HS148 = { 's-draft': { status: 'draft', tc: 9 }, 's-approved15': { status: 'approved', tc: 15, dang: 'tieu-de' }, 's-a': { status: 'signed-off', tc: 9, luot: 1 },
  's-b': { status: 'machine-cleared', tc: 11, dang: 'tieu-de', luot: 3 }, 's-c': { status: 'da-cham-boi-thuc-te', tc: 4, luot: 2 }, 's-d': { status: 'signed-off', tc: 9, luot: 0, them: ['S3'] },
  's-e': { status: 'signed-off', tc: 0, luot: 1 }, 's-f': { status: 'signed-off', tc: 14, luot: 4 }, 's-g': { status: 'verified', tc: 8 } };
async function lt148(kit) {
  const sai = []; const k = await khoangCua(kit);
  if (!TIEU_DE_S4) return ['không rút được tiêu đề «S4 round N» từ dòng --title của Feature Loop SKILL'];
  const r = khoDongHo(HS148); const truoc = chupCay(r); const j = coJ(kit, r); const sau = chupCay(r);
  const n = Object.keys(truoc).length; console.log(`    · LT-148 băm ${n} tệp trước/sau --co`);
  if (!n) sai.push('đối chứng: băm 0 tệp');
  const doi = [...new Set([...Object.keys(truoc), ...Object.keys(sau)])].filter(f => truoc[f] !== sau[f]);
  if (doi.length) sai.push(`tệp đổi sau --co: ${doi.join(', ')}`);
  if (git(r, 'status', '--porcelain', '--untracked-files=all')) sai.push(`git status sau --co: ${git(r, 'status', '--porcelain')}`);
  const tay = tinhTay(HS148, k);
  j.nhom.forEach((g, i) => { const t = tay.nhom[i]; const co = { n_chot: g.n_chot, n: g.n, luot_tb: g.luot_tb, cham_tran_pt: g.cham_tran_pt, it: g.it_du_lieu }; const mg = { n_chot: t.n_chot, n: t.n, luot_tb: t.luot_tb, cham_tran_pt: t.cham_tran_pt, it: t.it };
    if (!deq(co, mg)) sai.push(`nhóm ${g.ten}: ${JSON.stringify(co)} ≠ tính tay ${JSON.stringify(mg)}`); if (g.n === 0 && 'luot_tb' in g) sai.push(`nhóm ${g.ten} n=0 vẫn mang luot_tb`); });
  const tk = j.trong_khoang; const pick = o => ({ n_chot: o.n_chot, n_trong: o.n_trong, pt_tong: o.pt_tong, n: o.n, luot_tb: o.luot_tb, cham_tran_pt: o.cham_tran_pt });
  if (!deq(pick(tk), pick(tay.trong))) sai.push(`trong_khoang pt_tong/cham_tran_pt: ${JSON.stringify(pick(tk))} ≠ tính tay ${JSON.stringify(pick(tay.trong))}`);
  const boMong = { chua_chot: 1, khong_doc_tieu_chi: 1, chua_giao: 2, khong_luot_cham: 1 };
  if (!deq(j.bo_qua, boMong)) sai.push(`bo_qua ${JSON.stringify(j.bo_qua)} ≠ ${JSON.stringify(boMong)} — hồ sơ khai tiêu chí bằng tiêu đề có bị bỏ?`);
  const rong = coJ(kit, kho({ khoa: false })); if (!rong.trong_khoang.chua_do_duoc || Object.keys(rong.trong_khoang).some(x => x.endsWith('_pt'))) sai.push(`kho không hồ sơ: ${JSON.stringify(rong.trong_khoang)}`);
  const tran = path.join(TMP, `tran-${++khoN}`); mkdirSync(tran); execFileSync('git', ['init', '-q', tran]);
  const t2 = coJ(kit, tran); if (!t2.trong_khoang.chua_do_duoc) sai.push('kho không có _acceptance/ không ra chua_do_duoc');
  // Hồ sơ thật của kit, CHÉP ra thư mục tạm (chỉ hợp đồng + báo cáo chi phí) — bản đột biến ghi tệp
  // không bao giờ chạm cây kit.
  const chep = path.join(TMP, `kit-ho-so-${++khoN}`);
  for (const e of readdirSync(path.join(KIT, '_acceptance'), { withFileTypes: true })) if (e.isDirectory()) for (const f of ['contract.md', 'usage-report.md']) { const p = path.join(KIT, '_acceptance', e.name, f); if (existsSync(p)) { mkdirSync(path.join(chep, '_acceptance', e.name), { recursive: true }); cpSync(p, path.join(chep, '_acceptance', e.name, f)); } }
  const that = coJ(kit, chep);
  // Bộ đọc khớp khuôn bên ghi: hồ sơ «không đọc được tiêu chí» phải ĐÚNG là hồ sơ không khai mã nào theo
  // khuôn hợp đồng (`AC-<số>`, gạch đầu dòng hoặc tiêu đề) — đếm độc lập bằng regex khuôn trong ca. Hồ sơ
  // khai mã chữ (AC-A…) là ngoài khuôn, bị bỏ có tên; hồ sơ khai đúng khuôn mà bị bỏ là bộ đọc hẹp.
  const KHUON_MA = /^\s*(?:#{2,6}\s+)?(?:[-*]\s+)?\*{0,2}\s*AC-\d+\b/m;
  const ngoaiKhuon = readdirSync(path.join(chep, '_acceptance')).filter(sl => { const c = readFileSync(path.join(chep, '_acceptance', sl, 'contract.md'), 'utf8'); const st = (c.match(/^status:\s*(\S+)/m) || [])[1]; return st && st !== 'draft' && !KHUON_MA.test(c); });
  console.log(`    · LT-148 cây kit: n_chot ${that.trong_khoang.n_chot}, khong_doc_tieu_chi ${that.bo_qua.khong_doc_tieu_chi}, hồ sơ khai mã ngoài khuôn ${ngoaiKhuon.length} (${ngoaiKhuon.join(', ') || '—'})`);
  if (!(that.trong_khoang.n_chot >= 50) || that.bo_qua.khong_doc_tieu_chi !== ngoaiKhuon.length) sai.push(`cây kit thật: n_chot ${that.trong_khoang.n_chot}, khong_doc_tieu_chi ${that.bo_qua.khong_doc_tieu_chi} ≠ ${ngoaiKhuon.length} hồ sơ ngoài khuôn — hồ sơ khai tiêu chí bằng tiêu đề có bị bỏ?`);
  return sai;
}
if (want('LT-148') && await chayCa('LT-148', lt148)) ok('LT-148', 'đồng hồ trên 9 hồ sơ dựng bằng bên ghi thật: bốn nhóm == tính tay, pt_tong trên mọi vòng đã chốt, bo_qua đúng từng lý do; kho rỗng → chua_do_duoc; không ghi tệp nào; cây kit thật đọc trọn');
if (want('LT-148-do')) await chayDo('LT-148-do', lt148, [['scripts/cat-luot.mjs', 'const tc = new Set(parseACBlock(c).map(a => a.id)).size;', "const tc = (c.match(/^- AC-/gm) || []).length;"]], 'tiêu đề', 'bản sao đếm tiêu chí bằng mẫu «- AC-»');
if (want('LT-148-do-ghi')) await chayDo('LT-148-do-ghi', lt148, [['scripts/cat-luot.mjs', "    process.stdout.write(JSON.stringify(dongHoCo(root, { khoang, tu, loTrinh }), null, 2) + '\\n');", "    (await import('node:fs')).writeFileSync(path.join(root, 'co.json'), '{}'); process.stdout.write(JSON.stringify(dongHoCo(root, { khoang, tu, loTrinh }), null, 2) + '\\n');"]], 'co.json', 'bản sao ghi một tệp trước khi in');
if (want('LT-148-do-song-sot')) await chayDo('LT-148-do-song-sot', lt148, [['scripts/cat-luot.mjs', 'pt_tong: phanTram(g.length, chot.length)', 'pt_tong: phanTram(g.filter(x => x.luot != null).length, chot.filter(x => x.luot != null).length)']], 'pt_tong', 'bản sao tính tỉ lệ trên vòng đã giao');

const HS149 = { 't-truoc': { status: 'signed-off', tc: 9, luot: 1, ngay: '2026-09-20T00:00:00Z' }, 't-dung': { status: 'signed-off', tc: 9, luot: 3, ngay: '2026-10-01T08:00:00Z' },
  't-sau': { status: 'approved', tc: 16, ngay: '2026-10-05T00:00:00Z' }, 't-veto': { status: 'machine-cleared', tc: 11, luot: 2, ngay: '', veto: '2026-10-03T00:00:00Z' },
  't-khong': { status: 'signed-off', tc: 9, luot: 1, ngay: '' } };
async function lt149(kit) {
  const sai = []; const k = await khoangCua(kit); const MOC = '2026-10-01';
  const r = khoDongHo(HS149);
  const ltTep = path.join(r, 'docs', 'lt.json'); mkdirSync(path.dirname(ltTep), { recursive: true });
  writeFileSync(ltTep, JSON.stringify({ schema: 1, hang: [{ ma: 'A', slug: 't-sau', tieu_chi: 9 }, { ma: 'B', slug: 't-dung', tieu_chi: 9 }, { ma: 'C', slug: 'khong-co', tieu_chi: 9 }, { ma: 'D', slug: 't-truoc', tieu_chi: 9 }] }));
  const j = coJ(kit, r, ['--tu', MOC, '--lo-trinh', 'docs/lt.json']);
  const tay = tinhTay(HS149, k, { tu: MOC }); const pick = o => ({ n_chot: o.n_chot, n_trong: o.n_trong, pt_tong: o.pt_tong, n: o.n, cham_tran_pt: o.cham_tran_pt });
  if (!deq(pick(j.trong_khoang), pick(tay.trong))) sai.push(`trong_khoang ${JSON.stringify(pick(j.trong_khoang))} ≠ tính tay ${JSON.stringify(pick(tay.trong))} (hồ sơ chỉ có veto_opened_at có được đếm?)`);
  if (j.bo_qua.khong_ngay_chot !== 1) sai.push(`khong_ngay_chot ${j.bo_qua.khong_ngay_chot} ≠ 1`);
  const dk = j.du_kien || {}; const mong = [{ ma: 'A', slug: 't-sau', du_kien: 9, that: 16 }, { ma: 'B', slug: 't-dung', du_kien: 9, that: 9 }];
  if (!deq(dk.hang, mong) || dk.n !== 2 || dk.vuot_cho_phep !== 1) sai.push(`du_kien ${JSON.stringify(dk)} — cần hai mục, vuot_cho_phep 1`);
  const sau = coJ(kit, r, ['--tu', '2027-01-01']); if (!sau.trong_khoang.chua_do_duoc) sai.push(`mốc sau mọi hồ sơ: ${JSON.stringify(sau.trong_khoang)}`);
  const x = chayCL(kit, r, ['--co', '--tu', '11/10/2026']); if (x.status !== 2 || !x.stderr.includes('11/10/2026')) sai.push(`--tu sai khuôn: exit ${x.status} «${x.stderr.trim()}»`);
  return sai;
}
if (want('LT-149') && await chayCa('LT-149', lt149)) ok('LT-149', '--tu đếm đúng ba hồ sơ (đúng ngày · sau · chỉ veto), một hồ sơ không ngày; tỉ lệ == tính tay; --lo-trinh so cỡ khai với thật, vượt 1; mốc sau → chua_do_duoc; ngày sai khuôn → 2');
if (want('LT-149-do')) await chayDo('LT-149-do', lt149, [['scripts/cat-luot.mjs', " || ngayDau(frontmatterField(c, 'veto_opened_at'))", '']], 'veto', 'bản sao bỏ nhánh veto_opened_at');
if (want('LT-149-do-du-kien')) await chayDo('LT-149-do-du-kien', lt149, [['scripts/cat-luot.mjs', 'that: theoSlug.get(chuoi(r.slug)).tc', 'that: r.tieu_chi']], 'vuot_cho_phep', 'bản sao lấy số thật bằng số khai');

// ── LT-150: skill và khuôn ───────────────────────────────────────────────────
async function lt150(kit) {
  const sai = []; const C = await napCL(kit); const sk = readFileSync(SKILL_CL(kit), 'utf8');
  const lenh = khoiMdL2(sk, 'CAT-LUOT-CO-LENH'); if (lenh == null) return ['SKILL thiếu khối CAT-LUOT-CO-LENH'];
  const env = { ...process.env, CLAUDE_PLUGIN_ROOT: kit }; delete env.AG;
  const r = khoDongHo({ 's-a': { status: 'signed-off', tc: 9, luot: 1 } });
  const x = spawnSync('bash', ['-c', lenh.trim()], { cwd: r, encoding: 'utf8', env });
  try { if (x.status !== 0 || !Array.isArray(JSON.parse(x.stdout).nhom)) throw new Error(); } catch { sai.push(`CAT-LUOT-CO-LENH exit ${x.status} «${x.stderr.trim().slice(0, 120)}»`); }
  const sau = (khoiMdL2(sk, 'CAT-LUOT-SAU-LUAT') || '').split('\n').filter(Boolean);
  if (sau.length !== 6) sai.push(`sáu luật: ${sau.length} dòng`);
  if (!/vai/.test(sau[0] || '') || !/nền/.test(sau[0] || '')) sai.push(`luật 1 không nêu hai dáng: «${sau[0]}»`);
  if (!(sau[3] || '').includes('CAT-LUOT-CO')) sai.push(`luật 4 không trỏ khối khoảng: «${sau[3]}»`);
  const bang = khoiMdL2(sk.replace(/<!-- <<<CAT-LUOT-BANG-CO -->\n/, '<!-- <<<CAT-LUOT-BANG-CO -->\n```\n').replace(/\n<!-- CAT-LUOT-BANG-CO>>> -->/, '\n```\n<!-- CAT-LUOT-BANG-CO>>> -->'), 'CAT-LUOT-BANG-CO');
  const ten = new Set([...(bang || '').matchAll(/^\| `([a-z-]+)` \|/gm)].map(m => m[1])); const co = new Set(C.CO_TEN);
  const thieu = [...co].filter(t => !ten.has(t)); const thua = [...ten].filter(t => !co.has(t));
  if (thieu.length || thua.length) sai.push(`bảng cờ của SKILL lệch danh sách cờ: thiếu ${thieu.join(', ') || '—'} · thừa ${thua.join(', ') || '—'}`);
  const tpl = JSON.parse(readFileSync(path.join(kit, 'skills', 'acceptance', 'references', 'lo-trinh-template.json'), 'utf8'));
  if (!tpl.hang.some(h => typeof h.vai === 'string' && h.vai && h.vai !== 'nen')) sai.push('khuôn thiếu hàng dáng có vai');
  if (!tpl.hang.some(h => h.vai === 'nen')) sai.push('khuôn thiếu hàng vai: nen');
  if (tpl.hang.some(h => h.dot === 'mau-1' && !Number.isInteger(h.tieu_chi))) sai.push('hàng đợt mẫu thiếu tieu_chi');
  // Bảng phủ ba chỗ (hồ sơ lo-trinh-chi-viec-phat-trien AC-7 thay vế này): mã của đợt mẫu gồm cả mốc ngoài.
  const maMau = [...tpl.hang, ...(tpl.chan_troi || []), ...(tpl.moc || [])].filter(h => h.dot === 'mau-1').flatMap(h => h.phu || []);
  const y = rang(kit, khoCL({ pv: vietPV({ dot: 'mau-1', ma: maMau.map(c => [c]) }, kit), lt: tpl }));
  const vl = tachDong(y.stdout).filter(l => l.startsWith('lỗi:') || l.startsWith('cảnh báo:'));
  if (y.status !== 0 || vl.length) sai.push(`răng trên đợt mẫu: exit ${y.status}, ${JSON.stringify(vl.slice(0, 3))}`);
  return sai;
}
if (want('LT-150') && await chayCa('LT-150', lt150)) ok('LT-150', 'lệnh đồng hồ của SKILL chạy nguyên văn ra JSON; sáu luật nêu hai dáng và khối khoảng; bảng cờ == danh sách cờ; khuôn có hàng mỗi dáng, đợt mẫu 0 lỗi 0 cảnh báo');
if (want('LT-150-do')) await chayDo('LT-150-do', lt150, [['skills/cat-luot/SKILL.md', '| `chua-uoc-tieu-chi` | thiếu `tieu_chi` | cảnh báo |\n', '']], 'chua-uoc-tieu-chi', 'bản sao SKILL bỏ một dòng bảng cờ');
if (want('LT-150-do-khuon')) await chayDo('LT-150-do-khuon', lt150, [['skills/acceptance/references/lo-trinh-template.json', '"vai": "nen",', '"vai": "Người duyệt",']], 'nen', 'bản sao khuôn bỏ hàng vai: nen');


// ═══ lo-trinh-chi-viec-phat-trien (hàng S3b): LT-163…LT-171 ═════════════════════════════════════
// Luật 17/10 (hồ sơ road-map-de-dung, ADR 0026) bỏ mốc ngoài: LT-163 (chỗ phủ mốc ngoài), LT-166 (lap/tu_phuc_vu), LT-169
// (SKILL + khuôn mốc ngoài) và LT-171 (đáp án mẫu có mốc ngoài) THAY BỞI RD-1, RD-3, RD-4-dap-an của
// tests/scripts/road-map-de-dung.test.mjs. Ca còn lại giữ ý, đồ thử dùng mốc ngoài của lộ trình cắt trước luật (đợt d0). Kho thử do code
// sinh (khoCL), bản phạm vi bằng hàm ghi vietPV. Răng «gốc» = git archive 9b11cc66 (nhánh chính lúc mở vòng).
const GOC_S3B = '9b11cc66';
// Mốc ngoài sạch của đợt d1, gánh mã `P-<ma>`.
// Mốc ngoài của lộ trình cắt TRƯỚC luật 17/10 (đợt d0) — lượt cắt đợt d1 chỉ gom một dòng vàng cho nó.
const MN = (ma, o = {}) => ({ ma, ten: `việc vận hành ${ma}`, ngay: '2026-10-20', loai: 'ngoai', ai: 'Nhân sự', dot: 'd0', phu: [], ...o });
// Mã của đợt d1 mà các mục (hàng · chân trời · mốc) gánh — bản phạm vi của kho thử.
const maCua = d => [...new Set([...(d.hang || []), ...(d.chan_troi || []), ...(d.moc || [])].filter(x => x && x.dot === 'd1' && Array.isArray(x.phu)).flatMap(x => x.phu))];
const khoS3b = (d, ma = maCua(d)) => khoCL({ pv: vietPV({ dot: 'd1', ma: ma.map(c => [c]) }), lt: { schema: 1, ...d } });
const dongCo = (x, co) => x.stdout.split('\n').filter(l => l.includes(`[${co}]`));
const dongLoiS = x => x.stdout.split('\n').filter(l => l.startsWith('lỗi:'));
const vangLoi = x => x.stdout.split('\n').filter(l => /^(lỗi|cảnh báo):/.test(l));

// ── LT-164: cờ cho-van-hanh ─────────────────────────────────────────────────
const TEN_V1 = 'Phòng ban dùng thật hai tuần';
async function lt164(kit) {
  const sai = [];
  const goc = () => ({ hang: [HC('R1'), HC('R2')], moc: [MN('V1', { ten: TEN_V1 })], chan_troi: [] });
  // [tên ca, biến đổi, nhãn mốc dòng cờ phải nêu — đúng đích dung_tren của hàng, không phải mốc ngoài nào khác]
  const DO = [['theo-ma', d => { d.hang[1].dung_tren = ['V1']; }, 'V1'],
    ['theo-ten', d => { d.hang[1].dung_tren = [TEN_V1.normalize('NFD')]; }, 'V1'],
    ['moc-cu-khong-dot', d => { d.moc.push({ ten: 'crm cài kit', ngay: '2026-10-15', loai: 'ngoai', ai: 'crm' }); d.hang[1].dung_tren = ['crm cài kit']; }, 'crm cài kit']];
  for (const [ten, bien, nhan] of DO) {
    const d = goc(); bien(d); const x = rang(kit, khoS3b(d));
    const c = dongCo(x, 'cho-van-hanh'); const kc = x.stdout.split('\n').filter(l => l.includes('hàng R2: đứng trên mã không có'));
    if (x.status !== 1 || c.length !== 1 || !c[0].startsWith(`lỗi: hàng R2 [cho-van-hanh]: đứng chờ mốc vận hành «${nhan}» —`) || !c[0].includes('sinh dữ liệu giả') || !c[0].includes('chờ điều kiện') || kc.length)
      sai.push(`${ten}: exit ${x.status}, cờ ${JSON.stringify(c)} (cần mốc «${nhan}»), dòng-mã-không-có=${kc.length}`);
  }
  const IM = [['moc-khong-ngoai', d => { d.moc.push({ ma: 'M9', ten: 'Phát hành 2.27', ngay: '2026-11-01', loai: 'phat-hanh' }); d.hang[1].dung_tren = ['M9']; },
      x => x.status === 1 && x.stdout.includes('hàng R2: đứng trên mã không có: M9')],
    ['moc-hang', d => { d.moc[0].hang = ['R1', 'R2']; }, x => x.status === 0],
    ['chan-troi-mo-lai', d => { d.chan_troi.push({ ma: 'H1', dot: 'd1', cau_giao: '«sửa góp ý»', ly_do: 'phạm vi biết sau mốc', mo_lai_khi: 'Mốc V1 xong', phu: ['P-H1'] }); }, x => x.status === 0]];
  for (const [ten, bien, dung] of IM) {
    const d = goc(); bien(d); const x = rang(kit, khoS3b(d));
    if (!dung(x) || dongCo(x, 'cho-van-hanh').length) sai.push(`${ten}: exit ${x.status} — ${vangLoi(x).slice(0, 2).join(' | ')}`);
  }
  // Review Focus 1: mã vừa là mã hàng vừa là ma của một mốc ngoài (đợt khác) → hàng thắng.
  const h = goc(); h.moc.push({ ...MN('R1'), dot: 'd2', phu: [] }); h.hang[1].dung_tren = ['R1'];
  const y = rang(kit, khoS3b(h)); if (y.status !== 0 || dongCo(y, 'cho-van-hanh').length) sai.push(`hang-thang: exit ${y.status} — ${vangLoi(y).slice(0, 2).join(' | ')}`);
  return sai;
}
if (want('LT-164') && await chayCa('LT-164', lt164)) ok('LT-164', 'ba ca đứng trên mốc ngoài (ma · ten NFD · mốc cũ không đợt) → một dòng [cho-van-hanh] hai lối, không dòng «mã không có»; ba đối chứng im; mã hàng thắng mã mốc');
if (want('LT-164-do')) await chayDo('LT-164-do', lt164, [['scripts/cat-luot.mjs', '(chuoi(m.ma) === x || nfc(m.ten) === nfc(x))', '(chuoi(m.ma) === x)']], 'theo-ten', 'bản sao chỉ so ma của mốc');
if (want('LT-164-do-kep')) await chayDo('LT-164-do-kep', lt164, [['scripts/cat-luot.mjs', 'if (!theoMa.has(x) && !laMocNgoai(x))', 'if (!theoMa.has(x))']], 'dòng-mã-không-có=1', 'bản sao vẫn in «đứng trên mã không có» cho mục trỏ mốc');
if (want('LT-164-do-nhan')) await chayDo('LT-164-do-nhan', lt164, [['scripts/cat-luot.mjs', '.map(x => mocNgoaiCua(moc, x)).filter(Boolean).map(nhanMoc)', '.map(x => mocNgoaiCua(moc, x)).filter(Boolean).map(() => nhanMoc(moc.find(laNgoai)))']], 'cần mốc «crm cài kit»', 'bản sao luôn nêu mốc ngoài đầu tiên');

// LT-164 kho-tai-lieu: bản chụp lộ trình Kho tài liệu thật của crm (29/09), dựng thành đợt `ktl` bằng code.
async function lt164ktl(kit) {
  const sai = []; const f = JSON.parse(readFileSync(path.join(FX, 'crm-kho-tai-lieu.json'), 'utf8'));
  const VH = { ct: 'Mọi phòng ban', cb: 'Chủ kho' };
  const dung = theoLuat => {
    const moc = []; const hang = []; const chan_troi = [];
    for (const h of f.hang) {
      const dt = Array.isArray(h.dung_tren) ? h.dung_tren : [];
      // Luật 17/10: việc của người (ct, cb) ra khỏi kho — không mục nào, không vào bản phạm vi; cách cũ (S3b) là mốc ngoài.
      if (h.ma in VH) { if (!theoLuat) moc.push({ ma: h.ma, ten: h.cau_giao, loai: 'ngoai', ai: VH[h.ma], dot: 'ktl', phu: [h.ma], ...(dt.length ? { hang: dt } : {}) }); continue; }
      if (theoLuat && h.ma === 'l5') { chan_troi.push({ ma: 'l5', dot: 'ktl', cau_giao: h.cau_giao, ly_do: 'Phạm vi chỉ biết sau đợt dùng thật', mo_lai_khi: 'Đợt dùng thật của mọi phòng ban xong (việc của người — Ra khỏi kho ct)', phu: ['l5'] }); continue; }
      const giu = theoLuat ? dt.filter(x => !(x in VH)) : dt;
      hang.push({ ma: h.ma, cau_giao: h.cau_giao, vai: 'nen', bat_khi: 'đo được', tieu_chi: 9, dot: 'ktl', phu: [h.ma], ...(giu.length ? { dung_tren: giu } : {}) });
    }
    return { schema: 1, ten: f.ten, moc: [...(f.moc || []), ...moc], hang, chan_troi };
  };
  const pv = vietPV({ dot: 'ktl', ma: f.hang.map(h => [h.ma]) }); const pvLuat = vietPV({ dot: 'ktl', ma: f.hang.filter(h => !(h.ma in VH)).map(h => [h.ma]) });
  const mong = f.hang.filter(h => !(h.ma in VH) && (h.dung_tren || []).some(x => x in VH)).map(h => h.ma).sort();
  console.log(`    · LT-164 kho-tai-lieu: hàng đứng trên ct/cb trong bản chụp = ${mong.join(', ')}`);
  if (!mong.length) sai.push('đối chứng: bản chụp không có hàng nào đứng trên ct/cb');
  const cu = rang(kit, khoCL({ pv, lt: dung(false) }));
  const coCu = dongCo(cu, 'cho-van-hanh').map(l => (l.match(/hàng (\S+) \[cho-van-hanh\]/) || [])[1]).sort();
  if (cu.status !== 1 || !deq(coCu, mong)) sai.push(`cách cũ: exit ${cu.status}, hàng mang cờ ${JSON.stringify(coCu)} ≠ ${JSON.stringify(mong)}`);
  const moi = rang(kit, khoCL({ pv: pvLuat, lt: dung(true) }));
  if (moi.status !== 0 || /\b(ct|cb) →/.test(moi.stdout) || dongCo(moi, 'cho-van-hanh').length) sai.push(`theo luật: exit ${moi.status} — ${vangLoi(moi).slice(0, 3).join(' | ')}`);
  return sai;
}
if (want('LT-164 kho-tai-lieu') && await chayCa('LT-164 kho-tai-lieu', lt164ktl)) ok('LT-164 kho-tai-lieu', 'bản chụp Kho tài liệu crm: cách cũ (mốc ngoài) đỏ đúng tập hàng đứng trên ct/cb; cắt theo luật 17/10 xanh, ct và cb ra khỏi kho');

// ── LT-165: dữ liệu giả có nhãn — du_lieu ──────────────────────────────────
async function lt165(kit) {
  const sai = [];
  const nen = () => [HC('SG', { du_lieu: 'sinh-gia' }), HC('SGK', { du_lieu: 'sinh-gia', dot: 'd2', phu: ['P-SGK'] }), HC('T'), HC('G', { du_lieu: 'gia', dung_tren: ['SG'] })];
  // Ma trận viết sẵn: [tên ca, du_lieu + dung_tren của hàng X, cờ mong (null = không cờ)].
  const CA = [['gia-tren-sinh', { du_lieu: 'gia', dung_tren: ['SG'] }, null], ['gia-tren-sinh-khac-dot', { du_lieu: 'gia', dung_tren: ['SGK'] }, null],
    ['gia-khong-tren', { du_lieu: 'gia' }, 'thieu-hang-sinh-gia'], ['gia-tren-thuong', { du_lieu: 'gia', dung_tren: ['T'] }, 'thieu-hang-sinh-gia'],
    ['gia-bac-cau', { du_lieu: 'gia', dung_tren: ['G'] }, 'thieu-hang-sinh-gia'], ['sinh-gia', { du_lieu: 'sinh-gia' }, null],
    ['that', { du_lieu: 'that' }, 'du-lieu-sai-gia-tri'], ['Gia', { du_lieu: 'Gia' }, 'du-lieu-sai-gia-tri'],
    ['rong', { du_lieu: '' }, 'du-lieu-sai-gia-tri'], ['so-1', { du_lieu: 1 }, 'du-lieu-sai-gia-tri'], ['vang', {}, null]];
  for (const [ten, o, co] of CA) {
    const x = rang(kit, khoS3b({ hang: [...nen(), HC('X', o)] }));
    const cx = x.stdout.split('\n').filter(l => /\[(du-lieu-sai-gia-tri|thieu-hang-sinh-gia)\]/.test(l));
    const gt = co === 'du-lieu-sai-gia-tri' ? `du_lieu ${JSON.stringify(o.du_lieu)}` : '';
    const dung = co ? x.status === 1 && cx.length === 1 && cx[0].startsWith(`lỗi: hàng X [${co}]`) && cx[0].includes(gt) : x.status === 0 && !cx.length;
    if (!dung) sai.push(`${ten}: exit ${x.status}, ${JSON.stringify(cx)}${co ? ` — cần [${co}]${gt ? ` «${gt}»` : ''}` : ''}`);
  }
  console.log(`    · LT-165 ma trận ${CA.length} ca`);
  if (CA.length !== 11) sai.push(`ma trận ${CA.length} ca, hợp đồng hứa 11`);
  return sai;
}
if (want('LT-165') && await chayCa('LT-165', lt165)) ok('LT-165', '11 ca du_lieu: gia trên hàng sinh (cùng · khác đợt) im; thiếu hàng sinh (không đứng · hàng thường · bắc cầu) đỏ; giá trị lạ (that · Gia · rỗng · 1) đỏ nêu giá trị; sinh-gia và vắng im');
if (want('LT-165-do')) await chayDo('LT-165-do', lt165, [['scripts/cat-luot.mjs', 'const coHangSinh = dt => dt.some(x => (theoMa.get(x) || {}).du_lieu === DL_SINH);', 'const coHangSinh = function f(dt, s = new Set()) { return dt.some(x => { const h = theoMa.get(x) || {}; if (h.du_lieu === DL_SINH) return true; if (s.has(x)) return false; s.add(x); return f(Array.isArray(h.dung_tren) ? h.dung_tren : [], s); }); };']], 'gia-bac-cau', 'bản sao nhận bắc cầu');
if (want('LT-165-do-kieu')) await chayDo('LT-165-do-kieu', lt165, [['scripts/cat-luot.mjs', 'if (r.du_lieu !== undefined && !DU_LIEU.includes(r.du_lieu))', 'if (r.du_lieu !== undefined && !DU_LIEU.includes(String(r.du_lieu).toLowerCase()))']], 'Gia', 'bản sao so không phân biệt hoa thường');

// ── LT-167: ba cờ hàng ở hàng ngoài đợt ─────────────────────────────────────
async function lt167(kit) {
  const sai = [];
  const ngoai = (ma, o) => { const r = HC(ma, { phu: [`P-${ma}`], ...o }); if (ma.endsWith('2') || ma.endsWith('4') || ma.endsWith('6') || ma.endsWith('8') || ma.endsWith('0')) delete r.dot; else r.dot = 'd2'; return r; };
  const NHOM = [...Array.from({ length: 10 }, (_, i) => ngoai(`C${i + 1}`, { dung_tren: ['V1'] })),
    ngoai('G1', { du_lieu: 'gia' }), ngoai('G2', { du_lieu: 'gia', dung_tren: ['R1'] }), ngoai('S1', { du_lieu: 'that' }), ngoai('S2', { du_lieu: 7 })];
  const nen = [HC('R1'), HC('SG', { du_lieu: 'sinh-gia' })];
  const x = rang(kit, khoS3b({ hang: [...nen, ...NHOM], moc: [MN('V1')] }));
  // [cờ, dòng gom viết sẵn — k và mã liệt rút từ NHOM đã dựng] (cờ 10 hàng kiểm riêng dưới).
  for (const [co, mong] of [['thieu-hang-sinh-gia', 'cảnh báo: [thieu-hang-sinh-gia] 2 hàng ngoài đợt d1 — G1, G2'], ['du-lieu-sai-gia-tri', 'cảnh báo: [du-lieu-sai-gia-tri] 2 hàng ngoài đợt d1 — S1, S2'], ['cho-van-hanh', null]]) {
    const g = x.stdout.split('\n').filter(l => l.startsWith(`cảnh báo: [${co}]`));
    if (g.length !== 1 || (mong && g[0] !== mong)) sai.push(`[${co}]: ${JSON.stringify(g)}${mong ? ` — cần «${mong}»` : ''}`);
  }
  const g10 = x.stdout.split('\n').find(l => l.startsWith('cảnh báo: [cho-van-hanh] 10 hàng ngoài đợt')) || '';
  if (!g10.endsWith(', …') || (g10.match(/C\d+/g) || []).length !== 8) sai.push(`dòng 10 hàng: «${g10}»`);
  if (x.status !== 0 || /^cảnh báo: hàng (C|G|S)\d+ \[/m.test(x.stdout)) sai.push(`ngoài đợt: exit ${x.status} hoặc in theo từng hàng — ${vangLoi(x).slice(0, 3).join(' | ')} — cần một dòng mỗi cờ`);
  const vao = NHOM.map(r => ({ ...r, dot: 'd1' }));
  const y = rang(kit, khoS3b({ hang: [...nen, ...vao], moc: [MN('V1')] }));
  const loiVao = new Set(dongLoiS(y).map(l => (l.match(/^lỗi: hàng (\S+) \[(cho-van-hanh|thieu-hang-sinh-gia|du-lieu-sai-gia-tri)\]/) || [])[1]).filter(Boolean));
  if (y.status !== 1 || !NHOM.every(r => loiVao.has(r.ma))) sai.push(`vào đợt: exit ${y.status}, hàng mang cờ lỗi ${[...loiVao].length}/${NHOM.length}`);
  // Đối chứng im: hàng ngoài đợt KHÔNG mang trường mới.
  const im = Array.from({ length: 10 }, (_, i) => ngoai(`K${i + 1}`, {}));
  const z = rang(kit, khoS3b({ hang: [...nen, ...im], moc: [MN('V1')] }));
  const ba = z.stdout.split('\n').filter(l => /\[(cho-van-hanh|thieu-hang-sinh-gia|du-lieu-sai-gia-tri)\]/.test(l));
  if (z.status !== 0 || ba.length) sai.push(`đối chứng im (hàng ngoài đợt không trường mới): exit ${z.status}, ${JSON.stringify(ba)}`);
  return sai;
}
if (want('LT-167') && await chayCa('LT-167', lt167)) ok('LT-167', 'ba cờ ở 14 hàng ngoài đợt → thoát 0, một dòng gom mỗi cờ, 10 hàng liệt 8 mã rồi «…»; vào đợt → thoát 1; hàng ngoài đợt không trường mới im');
if (want('LT-167-do-gom')) await chayDo('LT-167-do-gom', lt167, [['scripts/cat-luot.mjs', 'for (const [co] of coS3b(r)) if (!CO_CHI_TRONG_DOT.has(co)) { if (!gom.has(co)) gom.set(co, []); gom.get(co).push(nhan); }', 'for (const [co] of coS3b(r)) if (!CO_CHI_TRONG_DOT.has(co)) { if (!gom.has(co)) gom.set(co, []); if (nhan !== \'G2\') gom.get(co).push(nhan); }']], 'G1, G2', 'bản sao gom sót một hàng');
if (want('LT-167-do')) await chayDo('LT-167-do', lt167, [['scripts/cat-luot.mjs', 'for (const [co] of coS3b(r)) if (!CO_CHI_TRONG_DOT.has(co)) { if (!gom.has(co)) gom.set(co, []); gom.get(co).push(nhan); }', 'for (const [co, cau] of coS3b(r)) canhBao.push(`hàng ${nhan} [${co}]: ${cau}`);']], 'một dòng', 'bản sao in theo từng hàng');
if (want('LT-167-do-vang')) await chayDo('LT-167-do-vang', lt167, [['scripts/cat-luot.mjs', 'for (const [co] of coS3b(r)) if', 'for (const [co] of coS3b({ ...r, du_lieu: r.du_lieu === undefined ? \'vang\' : r.du_lieu })) if']], 'đối chứng im', 'bản sao coi du_lieu vắng là sai chỉ ở nhánh ngoài đợt');

// ── LT-168: đường đọc-cũ — răng gốc 9b11cc66 vs răng mới, trang không đổi byte ─
// Kỳ vọng dòng thêm tính ĐỘC LẬP từ dữ liệu: mỗi cờ hàng mới có ≥ 1 hàng ngoài đợt → một dòng gom.
function kyVongThem(lt, dot) {
  const nfcT = s => String(s ?? '').normalize('NFC').trim();
  const hang = (Array.isArray(lt.hang) ? lt.hang : []).filter(r => r && typeof r === 'object' && nfcT(r.dot) !== dot);
  const maH = new Set((lt.hang || []).filter(r => r && r.ma).map(r => nfcT(r.ma)));
  const mocN = (lt.moc || []).filter(m => m && nfcT(m.loai) === 'ngoai');
  const theoMa = new Map((lt.hang || []).filter(r => r && r.ma).map(r => [nfcT(r.ma), r]));
  const cho = hang.some(r => (Array.isArray(r.dung_tren) ? r.dung_tren : []).some(x => !maH.has(nfcT(x)) && mocN.some(m => nfcT(m.ma) === nfcT(x) || nfcT(m.ten) === nfcT(x))));
  const sai = hang.some(r => r.du_lieu !== undefined && !['sinh-gia', 'gia'].includes(r.du_lieu));
  const thieu = hang.some(r => r.du_lieu === 'gia' && !(Array.isArray(r.dung_tren) ? r.dung_tren : []).some(x => (theoMa.get(nfcT(x)) || {}).du_lieu === 'sinh-gia'));
  // Luật 17/10 (road-map-de-dung): mốc ngoài ngoài đợt đang cắt → một dòng gom [moc-ngoai-da-bo].
  const ngoaiDot = mocN.some(m => nfcT(m.dot) !== dot);
  return [cho, sai, thieu, ngoaiDot].filter(Boolean).length;
}
async function lt168(kit) {
  const sai = []; const C = await napCL(kit); const goc = banGocS3(GOC_S3B);
  const tplGoc = JSON.parse(git(KIT, 'show', `${GOC_S3B}:skills/acceptance/references/lo-trinh-template.json`));
  const maMau = [...(tplGoc.hang || []), ...(tplGoc.chan_troi || [])].filter(r => r.dot === 'mau-1').flatMap(r => r.phu || []);
  const moi = [{ ma: 'Z1', dot: 'moi-1', phu: ['Z1a'], cau_giao: '«Trưởng nhóm mở trang và thấy việc tuần này»', vai: 'Trưởng nhóm', tieu_chi: 9 },
    { ma: 'Z2', dot: 'moi-1', phu: ['Z2a'], cau_giao: '«Lệnh đồng bộ không nhân đôi bản ghi»', vai: 'nen', bat_khi: 'mười lượt không đổi', tieu_chi: 8 }];
  const cong = d => ({ ...d, hang: [...(d.hang || []), ...moi] }); const fx = f => JSON.parse(readFileSync(path.join(FX, f), 'utf8'));
  const pvMoi = vietPV({ dot: 'moi-1', ma: [['Z1a'], ['Z2a']] });
  const KHO = { 'khuon-goc': [tplGoc, vietPV({ dot: 'mau-1', ma: maMau.map(c => [c]) }), 'mau-1'],
    'kit-that': [cong(JSON.parse(readFileSync(path.join(KIT, 'docs', 'plans', 'lo-trinh-kit.json'), 'utf8'))), pvMoi, 'moi-1'],
    'crm-okr': [cong(fx('crm-okr.json')), pvMoi, 'moi-1'], 'crm-kho-tai-lieu': [cong(fx('crm-kho-tai-lieu.json')), pvMoi, 'moi-1'], 'oneflow': [cong(fx('oneflow.json')), pvMoi, 'moi-1'] };
  for (const [ten, [lt, pv, dot]] of Object.entries(KHO)) {
    // ra-soat-lo-trinh: bên đời trước qua phép đổi chữ «chân trời» → «chờ điều kiện» (như LT-147) trước khi so.
    const r = khoCL({ pv, lt }); const a0 = rang(goc, r); const a = { ...a0, stdout: chuChoDieuKien(a0.stdout) }; const b = rang(kit, r);
    const khongVang = x => x.stdout.split('\n').filter(Boolean).filter(l => !l.startsWith('cảnh báo:'));
    if (a.status !== b.status) sai.push(`${ten}: mã thoát gốc ${a.status} ≠ mới ${b.status}`);
    if (!deq(khongVang(a), khongVang(b))) sai.push(`${ten}: dòng không vàng lệch — mới thêm ${JSON.stringify(khongVang(b).filter(l => !khongVang(a).includes(l)).slice(0, 2))}`);
    const cu = a.stdout.split('\n').filter(Boolean); const them = b.stdout.split('\n').filter(Boolean).filter(l => { const i = cu.indexOf(l); if (i >= 0) { cu.splice(i, 1); return false; } return true; });
    for (const l of them) if (!l.startsWith('cảnh báo:') || !C.CO_TEN.some(co => l.includes(`[${co}]`))) sai.push(`${ten}: dòng thêm không phải cờ vàng có tên «${l}»`);
    const ky = kyVongThem(lt, dot);
    console.log(`    · LT-168 ${ten}: exit ${b.status}, dòng thêm ${them.length}, kỳ vọng ${ky}`);
    if (them.length !== ky) sai.push(`${ten}: dòng thêm ${them.length}, kỳ vọng ${ky} — ${JSON.stringify(them.slice(0, 2))}`);
  }
  const hang = [{ ma: 'A', cau_giao: '«Trưởng nhóm mở trang»', vai: 'Trưởng nhóm', tieu_chi: 9, du_lieu: 'gia', dung_tren: ['S'] }, { ma: 'S', cau_giao: '«dữ liệu mẫu»', vai: 'nen', tieu_chi: 8, du_lieu: 'sinh-gia' }];
  const moc = [{ ma: 'V1', ten: 'Nhân sự gửi danh sách', ngay: '2026-10-20', loai: 'ngoai', ai: 'Nhân sự', dot: 'd1', phu: ['X1'], lap: true, tu_phuc_vu: 'A', hang: ['A'] }];
  const tCo = veBang(kit, kho({ data: { schema: 1, hang, moc } })).trang;
  const tKhong = veBang(kit, kho({ data: { schema: 1, hang: hang.map(({ du_lieu, ...r }) => r), moc: moc.map(({ ma, dot, phu, lap, tu_phuc_vu, ...m }) => m) } })).trang;
  if (!tCo || tCo !== tKhong) sai.push('trang lộ trình lệch byte khi mốc/hàng mang trường lượt cắt mới');
  return sai;
}
if (want('LT-168') && await chayCa('LT-168', lt168)) ok('LT-168', `năm lộ trình đời trước (khuôn ${GOC_S3B} · kit · crm-okr · crm-kho-tai-lieu · oneflow): răng gốc và mới cùng mã thoát, cùng dòng không vàng, số dòng thêm == kỳ vọng tính độc lập; trang không đổi byte`);
if (want('LT-168-do')) await chayDo('LT-168-do', lt168, [['scripts/cat-luot.mjs', 'if (r.du_lieu !== undefined && !DU_LIEU.includes(r.du_lieu))', 'if (!DU_LIEU.includes(r.du_lieu))']], 'mã thoát', 'bản sao coi du_lieu vắng là sai giá trị');
if (want('LT-168-do-them')) await chayDo('LT-168-do-them', lt168, [['scripts/cat-luot.mjs', 'for (const [co] of coS3b(r)) if', 'for (const [co] of coS3b({ ...r, du_lieu: r.du_lieu === undefined ? \'vang\' : r.du_lieu })) if']], 'kỳ vọng 0', 'bản sao coi du_lieu vắng là sai chỉ ở nhánh ngoài đợt');
if (want('LT-168-do-trang')) await chayDo('LT-168-do-trang', lt168, [['scripts/lo-trinh.mjs', 'cau_giao: `${esc(chuoi(d.cau_giao))}', 'cau_giao: `${esc(chuoi(d.cau_giao))}${d.du_lieu ? ` (${esc(chuoi(d.du_lieu))})` : \'\'}']], 'lệch byte', 'bản sao bộ vẽ in du_lieu');


// ── LT-170: Ngoài-1 — khối CAT-LUOT-CANH-BAO xếp từng dòng cảnh báo ─────────
const CAU_CU_CANH_BAO = 'Dòng `cảnh báo:` nói về hàng ngoài đợt này';
async function lt170(kit) {
  const sai = []; const sk = readFileSync(SKILL_CL(kit), 'utf8');
  const khoi = khoiMdL2(sk, 'CAT-LUOT-CANH-BAO'); if (khoi == null) return ['SKILL thiếu khối CAT-LUOT-CANH-BAO'];
  const m = khoi.match(/^cua-dot: (.+)$/m); if (!m) return ['khối CAT-LUOT-CANH-BAO thiếu dòng «cua-dot: <biểu thức>»'];
  let re; try { re = new RegExp(m[1].trim()); } catch (e) { return [`biểu thức cua-dot hỏng: ${e.message}`]; }
  const bo = (r, ...k) => { for (const x of k) delete r[x]; return r; };
  const hang = [HC('A4', { tieu_chi: 4, nhom: 'g' }), HC('A5', { tieu_chi: 5, nhom: 'g' }), HC('B11', { tieu_chi: 11 }), bo(HC('C0'), 'tieu_chi'), bo(HC('D0'), 'vai'),
    HC('N1', { dot: 'd2', phu: ['Q1'], tieu_chi: 20 }), HC('N2', { dot: 'd2', phu: ['Q2'], dung_tren: ['ZZ'] }), HC('N3', { dot: 'd2', phu: ['Q3'], ngay: '2026-12-01' }), { ma: 'N4', dot: 'd2', vai: 'nen', bat_khi: 'x', tieu_chi: 9, phu: ['Q4'] }];
  const moc = [MN('V1'), { ten: 'Mốc phát hành', ngay: '2026-11-01', loai: 'phat-hanh', hang: ['N3'] }];
  const x = rang(kit, khoS3b({ hang, moc }));
  const trongDot = new Set(['A4', 'A5', 'B11', 'C0', 'D0']);
  const vang = x.stdout.split('\n').filter(l => l.startsWith('cảnh báo:'));
  // Sự thật tính từ dữ liệu kho: chủ ngữ của dòng (hàng/mốc <mã>) thuộc đợt hay không; dòng gom luôn ngoài đợt.
  const that = l => { const s = (l.match(/^cảnh báo: (?:hàng|mốc) ([^\s:]+)/) || [])[1]; return !!s && trongDot.has(s); };
  let dung = 0; let nCua = 0; let nNgoai = 0;
  for (const l of vang) { const t = that(l); if (t) nCua += 1; else nNgoai += 1; if (re.test(l) === t) dung += 1; else sai.push(`xếp nhầm (${t ? 'của đợt' : 'ngoài đợt'}): «${l}»`); }
  console.log(`    · LT-170 xếp đúng ${dung}/${vang.length} dòng cảnh báo (của đợt ${nCua}, ngoài đợt ${nNgoai})`);
  for (const c of ['duoi-muc-tieu', 'tren-muc-tieu', 'chua-uoc-tieu-chi', 'chua-khai-dang-giao']) if (!vang.some(l => that(l) && l.includes(`[${c}]`))) sai.push(`đối chứng: kho thử không ra cảnh báo của đợt [${c}]`);
  if (!vang.some(l => l.startsWith('cảnh báo: [can-tach]')) || !vang.some(l => l.includes('hàng N2: đứng trên mã không có')) || !vang.some(l => l.includes('hàng N3: ngày')) || !vang.some(l => l.includes('hàng N4 thiếu cau_giao')))
    sai.push(`đối chứng: kho thử thiếu một loại cảnh báo ngoài đợt — ${JSON.stringify(vang.filter(l => !that(l)))}`);
  if (!vang.some(l => l.includes('gộp được với'))) sai.push('đối chứng: không có gợi ý gộp của đợt');
  if (sk.includes(CAU_CU_CANH_BAO)) sai.push(`câu cũ «${CAU_CU_CANH_BAO}» còn ở SKILL`);
  if (!git(KIT, 'show', `${GOC_S3B}:skills/cat-luot/SKILL.md`).includes(CAU_CU_CANH_BAO)) sai.push(`đối chứng dương: câu cũ không có ở SKILL tại ${GOC_S3B}`);
  return sai;
}
if (want('LT-170') && await chayCa('LT-170', lt170)) ok('LT-170', 'biểu thức của khối CAT-LUOT-CANH-BAO xếp đúng mọi dòng cảnh báo (bốn loại của đợt · bốn loại ngoài đợt + dòng gom mốc ngoài); câu cũ «mọi cảnh báo là ngoài đợt» đã rời SKILL');
if (want('LT-170-do')) await chayDo('LT-170-do', lt170, [['skills/cat-luot/SKILL.md', 'cua-dot: ^cảnh báo: (hàng|mốc) .+? \\[[a-z-]+\\]:', 'cua-dot: ^cảnh báo: ']], '[can-tach] 1 hàng ngoài đợt', 'bản sao SKILL coi mọi dòng cảnh báo là của đợt');
if (want('LT-170-do-cau')) await chayDo('LT-170-do-cau', lt170, [['skills/cat-luot/SKILL.md', '<!-- CAT-LUOT-CANH-BAO>>> -->', `<!-- CAT-LUOT-CANH-BAO>>> -->\n${CAU_CU_CANH_BAO} (cắt tay đời trước): ghi vào mô tả PR.`]], 'câu cũ', 'bản sao SKILL giữ câu cũ');



rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (lo-trinh)`);
process.exit(fail ? 1 : 0);
