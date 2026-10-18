// moc-chien-dich.test.mjs — hồ sơ moc-la-chien-dich (hàng MC1; nấc 1 ADR 0025 + tên phiên/nhóm theo mốc), ca MC-<n> =
// AC-n của hợp đồng (AC-5 còn phần bảng dịch ở LT-97 của lo-trinh.test.mjs; AC-10 ở moc-chien-dich-crm.mjs).
// Mỗi eval của evals.yaml ghim đúng dòng «PASS: MC-…» của tệp này.
//
// Kho thử do CODE sinh trong lượt (git init trong thư mục tạm, hồ sơ dựng theo hình dạng ô bản đồ). Giá trị mong đợi
// viết sẵn trong ca, không rút từ đầu ra của bộ vẽ. «Bộ máy gốc» = `git archive f4e717bf scripts lib skills` (gốc vòng)
// bung trong lượt. Ca đỏ chạy CHÍNH hàm đo trên BẢN SAO của vật (nhát tiêm khớp đúng một lần), SAU khi bản lành xanh
// trên cùng kho thử, và ghim thông điệp. Mọi đường dẫn suy từ vị trí tệp này. Không ca nào ghi vào cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, rmSync, readdirSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const GOC_VONG = 'f4e717bf';
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'moc-chien-dich-')));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.MC_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + ' ') || id.startsWith(o + '-'));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...o });
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const SKILL_REL = path.join('feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const CAU_A = 'đang làm mà chưa thuộc mốc nào — gắn việc này vào một mốc của kế hoạch';
const cauB = s => `hồ sơ ${s} đang mở mà không thuộc việc nào trong kế hoạch — thêm việc cho nó, hoặc ghi mã việc vào hồ sơ`;
const CAU_C = 'Kho chưa khai lộ trình — việc mở ở đây không thuộc kế hoạch hay mốc nào; khai bằng khoá lo_trinh.tep trong _acceptance/config.yaml';

// ── Hồ sơ theo ô bản đồ — rút từ mô-đun dựng kho thử DÙNG CHUNG (lo-trinh-kho-thu.mjs, đã khai gạch ở hai lưới luật của
// kho: chữ trạng thái và khuôn ô ngưỡng), không chép khuôn vào tệp này. Năm hình dạng mô-đun chưa có dựng bằng một
// phép thay đúng một chỗ trên hình dạng có sẵn — thay không khớp thì ném (ca đỏ có tên).
const KT = await import(pathToFileURL(path.join(HERE, 'lo-trinh-kho-thu.mjs')).href);
const thay1 = (t, cu, moi) => { if (t.split(cu).length !== 2) throw new Error(`khuôn hồ sơ đổi: «${cu.slice(0, 40)}» khớp ${t.split(cu).length - 1} lần`); return t.replace(cu, moi); };
const oppQuyet = (dec, ma) => { let o = KT.HO_SO['can-nhac']()['opportunity.md'];
  o = thay1(o, 'stage: discovery\ndecision: \ndecided_by: \ndecided_at: \n', `stage: decided\ndecision: ${dec}\ndecided_by: M\ndecided_at: 2026-09-01T00:00:00Z\n`);
  return ma ? thay1(o, '\nstage:', `\nlo_trinh_ma: ${ma}\nstage:`) : o; };
const HO_SO = {
  ...KT.HO_SO,
  'sap-mo': (s, ma) => ({ 'opportunity.md': oppQuyet('build', ma) }),
  'xep-lai': () => ({ 'opportunity.md': oppQuyet('park') }),
  'da-bac': () => ({ 'opportunity.md': oppQuyet('kill') }),
  'da-nghiem-thu': s => ({ ...KT.HO_SO['cho-nghiem-thu'](s), 'uat-session.md': `---\nschema_version: 1\nslug: ${s}\nfeature: viec ${s}\nowner: x@y.z\nstage: held\nverdict: release\ndecided_by: M\ndecided_at: 2026-09-03T00:00:00Z\n---\n` }),
  'hong': s => ({ 'contract.md': thay1(KT.HO_SO['cho-duyet'](s)['contract.md'], 'status: draft', 'status: khong-co-trang-thai-nay') }),
};
let khoN = 0;
// `tep`: {đường: data} · `cfg`: khối lo_trinh (null = không khai) · `hoSo`: {slug: hình | [hình, mã lo_trinh_ma]}.
function kho({ tep = {}, cfg = undefined, hoSo = {}, ten = null } = {}) {
  const r = path.join(TMP, ten || `kho-${++khoN}`); mkdirSync(r, { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'x');
  mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  const tepKhai = Object.keys(tep);
  const khoi = cfg !== undefined ? cfg : (tepKhai.length === 1 ? `lo_trinh:\n  tep: ${tepKhai[0]}\n` : tepKhai.length ? `lo_trinh:\n  tep:\n${tepKhai.map(t => `    - ${t}\n`).join('')}` : '');
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), `schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\n${khoi || ''}`);
  for (const [slug, spec] of Object.entries(hoSo)) {
    const [hinh, ma] = Array.isArray(spec) ? spec : [spec];
    const d = path.join(r, '_acceptance', slug); mkdirSync(d, { recursive: true });
    for (const [f, t] of Object.entries(HO_SO[hinh](slug, ma))) writeFileSync(path.join(d, f), t);
  }
  for (const [t, d] of Object.entries(tep)) { const p = path.join(r, t); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, JSON.stringify(d, null, 2) + '\n'); }
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'kho thu');
  return r;
}
// Bản clone KHÔNG mang cấu hình cục bộ của kho gốc — đặt danh tính ngay khi tạo, để ca commit được trên máy không có
// danh tính git toàn cục (runner CI; tái hiện: GIT_CONFIG_GLOBAL=/dev/null + user.useConfigOnly=true — run 38578722278).
const clone = r => { const c = path.join(TMP, `clone-${++khoN}`); execFileSync('git', ['clone', '-q', r, c]);
  git(c, 'config', 'user.email', 'x@y.z'); git(c, 'config', 'user.name', 'x'); return c; };
const H = (ma, o = {}) => ({ ma, cau_giao: `«câu giao ${ma}»`, ...o });

// Bản sao của vật: trọn scripts lib skills feature-loop của `goc`; nhát tiêm phải thay ĐÚNG một lần.
let bsN = 0;
function banSao(tiem = [], goc = KIT) {
  const c = path.join(TMP, `bs-${++bsN}`);
  for (const d of ['scripts', 'lib', 'skills', 'feature-loop']) if (existsSync(path.join(goc, d))) cpSync(path.join(goc, d), path.join(c, d), { recursive: true });
  for (const [tep, cu, moi] of tiem) {
    const p = path.join(c, tep); const s = readFileSync(p, 'utf8'); const n = s.split(cu).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm vào ${tep} khớp ${n} lần (cần 1): ${cu.slice(0, 60)}`);
    writeFileSync(p, s.replace(cu, moi));
  }
  return c;
}
let gocDir = null;
function banGoc() {
  if (gocDir) return gocDir;
  const d = path.join(TMP, 'goc-vong'); mkdirSync(d, { recursive: true });
  const tar = execFileSync('git', ['-C', KIT, 'archive', '--format=tar', GOC_VONG, 'scripts', 'lib', 'skills'], { maxBuffer: 1 << 28 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  if (!existsSync(path.join(d, 'scripts', 'lo-trinh.mjs'))) throw new Error(`bộ máy gốc ${GOC_VONG} không bung được scripts/lo-trinh.mjs`);
  return (gocDir = d);
}
let napN = 0;
const nap = async kit => ({
  LT: await import(pathToFileURL(path.join(kit, 'scripts', 'lo-trinh.mjs')).href + `?v=${++napN}`),
  PM: await import(pathToFileURL(path.join(kit, 'scripts', 'product-map.mjs')).href + `?v=${napN}`),
});
const phan = (M, r) => M.LT.phanTichKho({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS });
const ve = (M, r) => M.LT.veTrang({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS });
const quet = (kit, r) => {
  const x = node([path.join(kit, 'scripts', 'start-scan.mjs'), '--root', r], { env: { ...process.env, ACCEPTANCE_TODAY: '2026-10-14' } });
  if (x.status !== 0) throw new Error(`start-scan của ${kit} thoát ${x.status}: ${x.stderr.slice(0, 200)}`);
  return JSON.parse(x.stdout);
};
// JSON quét, bỏ đường bộ máy (dòng «vẽ bằng: node <bộ máy>/…») để hai bộ máy so được.
const chuanKit = (o, kit) => JSON.parse([realpathSync(kit), kit].reduce((x, g) => x.split(g).join('<kit>'), JSON.stringify(o)));
const giaiMa = s => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const chuTron = s => giaiMa(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const coTrang = html => [...html.matchAll(/<ul class="co-ds">([\s\S]*?)<\/ul>/g)].flatMap(u => [...u[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => chuTron(m[1])));
// Ô trạng thái từng hàng: [mã, chữ ô] đọc từ HTML.
const hangTrang = html => [...html.matchAll(/<tr id="[^"]+"><td data-nhan="Mã">([^<]*)<\/td>([\s\S]*?)<\/tr>/g)].map(m => [giaiMa(m[1]), chuTron(m[2])]);
const chayCa = async (id, f, kit = KIT) => { try { const s = await f(kit); if (s.length) bad(id, s.join(' ; ')); else return true; } catch (e) { bad(id, loi(e)); } return false; };
const chayDo = async (id, f, tiem, ghim, moTa) => {
  try {
    const lanh = await f(KIT); if (lanh.length) { bad(id, `bản lành chưa xanh — không tin được chiều đỏ: ${lanh[0]}`); return; }
    const s = await f(banSao(tiem)); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm đo trả «${g.slice(0, 110)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 220)}`);
  } catch (e) { bad(id, loi(e)); }
};

// Hồ sơ road-map-de-dung (RD1) đổi CÓ CHỦ Ý trang, khối dữ liệu, bản xem chữ, thẻ khởi động và giờ máy. Các ca so «giống bộ máy
// gốc»/«khuôn viết sẵn» dưới đây chạy trên bản TẮT đúng các khối RD1 (tests/scripts/tat-rd1.mjs, tự kiểm bằng ca RD-tat) — lời
// hứa gốc (phần còn lại không đổi) giữ nguyên nghĩa; khối mới do road-map-de-dung.test.mjs đo. Chiều đỏ: nhát tiêm áp SAU bộ tắt.
const { tatRD1 } = await import(pathToFileURL(path.join(HERE, 'tat-rd1.mjs')).href);
const KIT_TAT = () => tatRD1(KIT);
const chayDoTat = async (id, f, tiem, ghim, moTa) => {
  try {
    const lanh = await f(KIT_TAT()); if (lanh.length) { bad(id, `bản lành (tắt RD1) chưa xanh — không tin được chiều đỏ: ${lanh[0]}`); return; }
    const s = await f(tatRD1(KIT, tiem)); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm đo trả «${g.slice(0, 110)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 260)}`);
  } catch (e) { bad(id, loi(e)); }
};

// ═══ MC-1 (AC-1): cờ việc đang mở ngoài mốc — ma trận viết sẵn ═══════════════════════════════════
const TT_1 = ['chua', 'can-nhac', 'sap-mo', 'cho-duyet', 'dang-dung', 'da-ship', 'xep-lai', 'da-bac', 'hong'];
const MONG_1 = ['can-nhac-n', 'sap-mo-n', 'cho-duyet-n', 'dang-dung-n', 'LM'].sort();
let kho1 = null;
const KHO_1 = () => kho1 || (kho1 = (() => {
  const hang = []; const hoSo = {}; const trongMoc = [];
  for (const t of TT_1) for (const m of ['m', 'n']) {
    const ma = `${t}-${m}`; hang.push(H(ma, { slug: `s-${ma}` }));
    if (t !== 'chua') hoSo[`s-${ma}`] = t;
    if (m === 'm') trongMoc.push(ma);
  }
  hang.push(H('LM')); hoSo['nhan-qua-ma'] = ['sap-mo', 'LM'];                 // hồ sơ nhận qua lo_trinh_ma, slug khác mã
  hang.push(H('KS')); hoSo['ks-1'] = ['sap-mo', 'KS']; hoSo['ks-2'] = ['dang-dung', 'KS']; // hai hồ sơ cùng nhận → không suy được
  hoSo['ks-2'] = ['sap-mo', 'KS'];
  return kho({ ten: 'kho-mc1', tep: { 'docs/lo-trinh.json': { schema: 1, ten: 'Một', moc: [{ ten: 'M1', ngay: '2026-11-01', hang: trongMoc }], hang } }, hoSo });
})());
async function mc1(kit) {
  const M = await nap(kit); const r = KHO_1(); const sai = [];
  const html = ve(M, r); const d = M.LT.docDuLieu(html).duLieu; const lt = d.lo_trinh[0];
  const tuCo = [...new Set(coTrang(html).filter(x => x.endsWith(CAU_A)).map(x => x.split(' — ')[0]))].sort();
  const tuO = hangTrang(html).filter(([, o]) => o.includes(CAU_A)).map(([ma]) => ma).sort();
  const tuCan = lt.can_sua.filter(c => c.chu === CAU_A).map(c => c.ma).sort();
  const tuHang = lt.hang.filter(h => h.co.includes(CAU_A)).map(h => h.ma).sort();
  const coHoSo = new Set(lt.hang.filter(h => h.ho_so).map(h => h.ma));
  for (const [ten, ds] of [['mục cần sửa', tuCo], ['ô hàng', tuO], ['can_sua', tuCan], ['hang[].co', tuHang]]) {
    for (const ma of ds.filter(x => !MONG_1.includes(x))) sai.push(coHoSo.has(ma) ? `${ten}: hàng có cờ ngoài tập viết sẵn: ${ma}` : `hàng chưa có hồ sơ bị cờ: ${ma} (${ten})`);
    for (const ma of MONG_1.filter(x => !ds.includes(x))) sai.push(ma === 'LM' ? `hàng nhận qua lo_trinh_ma không bị cờ: LM (${ten})` : `${ten}: thiếu cờ ở ${ma}`);
  }
  if (lt.hang.length !== 20) sai.push(`đối chứng: kho thử có ${lt.hang.length} hàng, cần 20`);
  return sai;
}
if (want('MC-1') && await chayCa('MC-1', mc1)) ok('MC-1', `20 hàng: đúng năm hàng [${MONG_1.join(', ')}] mang cờ ở mục cần sửa == ô hàng == can_sua == hang[].co`);
if (want('MC-1-do')) await chayDo('MC-1-do', mc1, [['scripts/lo-trinh.mjs', 'if (!d.coHoSo || !tenMo.has(d.chu)', 'if ((!tenMo.has(d.chu) && d.chu !== CHUA_MO)']], 'hàng chưa có hồ sơ bị cờ:', 'bản sao bỏ điều kiện «có hồ sơ»');
if (want('MC-1-do2')) await chayDo('MC-1-do2', mc1, [['scripts/lo-trinh.mjs', 'if (!d.coHoSo || !tenMo.has(d.chu)', 'if (!d.coHoSo || !d.slug || !tenMo.has(d.chu)']], 'hàng nhận qua lo_trinh_ma không bị cờ: LM', 'bản sao chỉ xét hồ sơ theo thư mục slug');

// ═══ MC-2 (AC-2): cấp kho + như cũ cho kho không dùng mốc ════════════════════════════════════════
let kho2 = null;
const KHO_2 = () => kho2 || (kho2 = kho({ tep: {
  'docs/a.json': { schema: 1, ten: 'A', moc: [{ ten: 'MA', ngay: '2026-11-01', hang: ['A1'] }], hang: [H('A1', { slug: 'a1' })] },
  'docs/b.json': { schema: 1, ten: 'B', hang: [H('B1', { slug: 'b1' })] } }, hoSo: { a1: 'dang-dung', b1: 'dang-dung' } }));
async function mc2(kit) {
  const M = await nap(kit); const k = phan(M, KHO_2()); const sai = [];
  const b = k.cacTep.find(t => t.tep === 'docs/b.json').kq; const a = k.cacTep.find(t => t.tep === 'docs/a.json').kq;
  if (!b.dong[0].coHang.some(c => c === 'hàng B1: đang mở vòng mà chưa thuộc mốc nào')) sai.push(`hàng của lộ trình không mốc không bị cờ: B1 (${JSON.stringify(b.dong[0].coHang)})`);
  if (a.dong[0].coHang.length) sai.push(`hàng A1 thuộc mốc mà có cờ ${JSON.stringify(a.dong[0].coHang)}`);
  return sai;
}
if (want('MC-2') && await chayCa('MC-2', mc2)) ok('MC-2', 'kho hai lộ trình (A có mốc, B 0 mốc): B1 đang dựng ngoài mốc mang cờ, A1 trong mốc không');
if (want('MC-2-do')) await chayDo('MC-2-do', mc2, [['scripts/lo-trinh.mjs', 'if (docDuoc.some(t => t.kq.moc.length)) {\n    for (const t of docDuoc) {', '{\n    for (const t of docDuoc.filter(t => t.kq.moc.length)) {']], 'hàng của lộ trình không mốc không bị cờ: B1', 'bản sao xét «dùng mốc» theo từng lộ trình');

// MC-2-byte: ba kho «như cũ» — trang, JSON quét start, ô cơ hội của --mo-o giống TỪNG BYTE bộ máy gốc.
const KHO_2B = {
  'mot-lo-trinh-0-moc': () => kho({ tep: { 'docs/lo-trinh.json': { schema: 1, ten: 'Một', hang: [H('R1', { slug: 'r1' }), H('R2', { slug: 'r2' }), H('R3')] } }, hoSo: { r1: 'dang-dung', r2: 'da-ship' } }),
  'khong-khai': () => kho({ cfg: null, hoSo: { q1: 'dang-dung' } }),
  'mot-lo-trinh-0-moc-co-ho-so-mo': () => kho({ tep: { 'docs/lo-trinh.json': { schema: 1, ten: 'Một', hang: [H('R1', { slug: 'r1' }), H('R3', { slug: 'r3' })] } }, hoSo: { r1: 'sap-mo' } }),
};
// Đầu ra của một bộ máy trên bản clone của kho: trang, JSON quét (bỏ đúng khoá mới loTrinhChuaKhai), ô cơ hội của R3.
function dauRa(kit, r, coLoTrinh) {
  const c = clone(r); const ra = {};
  const v = node([path.join(kit, 'scripts', 'product-map.mjs'), '--root', c]); if (v.status !== 0) throw new Error(`đối chứng gốc không chạy: ${kit === KIT ? 'cây' : 'gốc'} product-map thoát ${v.status}`);
  const j = quet(kit, c); delete j.loTrinhChuaKhai; ra.quet = JSON.stringify(chuanKit(j, kit)).split(c).join('<kho>');
  if (coLoTrinh) {
    ra.trang = existsSync(path.join(c, 'LO-TRINH.html')) ? readFileSync(path.join(c, 'LO-TRINH.html'), 'utf8') : '';
    const m = node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', c, '--hang', 'R3', '--mo-o', '--owner', 'x@y.z']);
    if (m.status !== 0) throw new Error(`đối chứng gốc không chạy: ${kit === KIT ? 'cây' : 'gốc'} --mo-o thoát ${m.status}: ${m.stderr.slice(0, 120)}`);
    const slug = JSON.parse(m.stdout).hoSo; const p = path.join(c, '_acceptance', slug, 'opportunity.md');
    ra['opportunity.md'] = existsSync(p) ? readFileSync(p, 'utf8') : '';
  }
  return ra;
}
const GM_BO = await import(pathToFileURL(path.join(HERE, 'lo-trinh-gio-may-bo.mjs')).href);
async function mc2byte(kit) {
  const sai = [];
  for (const [ten, f] of Object.entries(KHO_2B)) {
    const r = f(); const coLT = ten !== 'khong-khai';
    const g = dauRa(banGoc(), r, coLT); const m = dauRa(kit, r, coLT);
    for (const [ben, o] of [['gốc', g], ['cây', m]]) for (const [tep, noi] of Object.entries(o)) {
      // Mã viết sẵn phải có trong tệp so: JSON quét mang hàng kế (R1 khi hồ sơ r1 chưa bắt đầu, R3 khi không) hoặc hồ sơ q1.
      const can = tep === 'quet' ? (!coLT ? 'q1' : ten.endsWith('co-ho-so-mo') ? 'R1' : 'R3') : 'R3';
      if (!noi || !noi.includes(can)) sai.push(`đối chứng gốc không chạy: ${ben} ${tep} (${ten}) rỗng hoặc thiếu «${can}»`);
    }
    // Giờ máy (hồ sơ lo-trinh-gio-may) hiện mặc định: trang so sau khi bỏ ĐÚNG phần giờ máy, đối chứng là trang cây có cột ấy.
    if (coLT && !GM_BO.coGioMayTrang(m.trang)) sai.push(`đối chứng: trang cây (${ten}) thiếu cột giờ máy`);
    for (const tep of Object.keys(g)) if (g[tep] !== (tep === 'trang' ? GM_BO.boGioMayTrang(m[tep]) : m[tep])) sai.push(`khác bộ máy gốc: ${tep} (${ten})`);
  }
  return sai;
}
if (want('MC-2-byte') && await chayCa('MC-2-byte', mc2byte, KIT_TAT())) ok('MC-2-byte', `ba kho (0 mốc · không khai · 0 mốc có hồ sơ mở): trang, JSON quét start, ô cơ hội giống từng byte bộ máy ${GOC_VONG} (đối chứng: hai bên thoát 0, tệp khác rỗng, có mã hàng)`);
if (want('MC-2-byte-do')) await chayDoTat('MC-2-byte-do', mc2byte, [['scripts/lo-trinh.mjs', "    '', '## Vấn đề & ai gặp', '',", "    '', '## Vấn đề & ai gặp ', '',"]], 'khác bộ máy gốc: opportunity.md', 'bản sao chèn một byte vào ô cơ hội');

// ═══ MC-3 (AC-3): hồ sơ đang mở không thuộc việc nào ═══════════════════════════════════════════
const O_3 = ['can-nhac', 'sap-mo', 'cho-duyet', 'dang-dung', 'da-ship', 'cho-nghiem-thu', 'da-nghiem-thu', 'xep-lai', 'da-bac', 'hong'];
const MONG_3 = ['o-can-nhac', 'o-sap-mo', 'o-cho-duyet', 'o-dang-dung'];
let kho3 = null;
const KHO_3 = () => kho3 || (kho3 = kho({ ten: 'kho-mc3', tep: { 'docs/lo-trinh.json': { schema: 1, ten: 'Một', hang: [H('A'), H('Z')] } },
  hoSo: { ...Object.fromEntries(O_3.map(o => [`o-${o}`, o])), 'noi-ma': ['sap-mo', 'A'] } }));
const khoiNgoai = html => { const i = html.indexOf('hồ sơ không thuộc kế hoạch nào</summary>'); if (i < 0) return []; const k = html.slice(i, html.indexOf('</details>', i)); return [...k.matchAll(/<code>([^<]+)<\/code>/g)].map(m => m[1]); };
async function mc3(kit) {
  const M = await nap(kit); const r = KHO_3(); const sai = []; const html = ve(M, r); const d = M.LT.docDuLieu(html).duLieu;
  const laB = x => /^hồ sơ (\S+) đang mở mà không thuộc việc nào trong kế hoạch — /.exec(x);
  const tuCo = coTrang(html).map(laB).filter(Boolean).map(m => m[1]).sort();
  const tuCan = d.lo_trinh[0].can_sua.map(c => laB(c.chu)).filter(Boolean).map(m => m[1]).sort();
  for (const [ten, ds] of [['mục cần sửa', tuCo], ['can_sua', tuCan]]) {
    for (const s of ds.filter(x => !MONG_3.includes(x))) sai.push(`hồ sơ đã đóng bị cờ: ${s} (${ten})`);
    for (const s of MONG_3.filter(x => !ds.includes(x))) sai.push(`${ten}: thiếu cờ cho ${s}`);
  }
  for (const s of MONG_3) if (!coTrang(html).includes(cauB(s))) sai.push(`trang không có câu đích «${cauB(s)}»`);
  const ngoaiMoi = khoiNgoai(html); const ngoaiGoc = khoiNgoai(ve(await nap(banGoc()), r));
  if (ngoaiMoi.length !== 10 || !deq(ngoaiMoi, ngoaiGoc)) sai.push(`khối hồ sơ ngoài kế hoạch: cây ${JSON.stringify(ngoaiMoi)} · gốc ${JSON.stringify(ngoaiGoc)}`);
  return sai;
}
if (want('MC-3') && await chayCa('MC-3', mc3)) ok('MC-3', `mười hồ sơ ngoài kế hoạch: đúng [${MONG_3.join(', ')}] mang cờ (mục cần sửa == can_sua); khối cuối trang liệt đủ mười, bằng bộ máy gốc; hồ sơ nối qua lo_trinh_ma không cờ`);
if (want('MC-3-do')) await chayDo('MC-3-do', mc3, [['scripts/lo-trinh.mjs', "if (!daNoi.has(s) && NHOM_MO.includes(classify(path.join(root, '_acceptance', s), s).key))", 'if (!daNoi.has(s))']], 'hồ sơ đã đóng bị cờ:', 'bản sao coi mọi hồ sơ ngoài kế hoạch là đang mở');
async function mc3hai(kit) {
  const M = await nap(kit); const sai = [];
  const r = kho({ tep: { 'docs/a.json': { schema: 1, ten: 'A', hang: [H('A1')] }, 'docs/b.json': { schema: 1, ten: 'B', hang: [H('B1')] } }, hoSo: { o1: 'dang-dung' } });
  const k = phan(M, r); const dem = k.cacTep.map(t => t.kq.co.filter(c => c.startsWith('hồ sơ o1 đang mở')).length);
  if (!deq(dem, [1, 0])) sai.push(`cờ hồ sơ o1 theo lộ trình [a, b]: ${JSON.stringify(dem)} (cần [1, 0])`);
  return sai;
}
if (want('MC-3-hai-lo-trinh') && await chayCa('MC-3-hai-lo-trinh', mc3hai)) ok('MC-3-hai-lo-trinh', 'kho hai lộ trình: cờ hồ sơ o1 hiện đúng một lần, ở lộ trình đầu');

// ═══ MC-4 (AC-4): kho chưa khai lộ trình → một dòng trên thẻ start ══════════════════════════════
async function mc4(kit) {
  const sai = [];
  const r = kho({ cfg: null, hoSo: { q1: 'dang-dung' } }); const j = quet(kit, r); const g = quet(banGoc(), r);
  if (j.loTrinh !== null) sai.push(`kho thiếu khoá: loTrinh ${JSON.stringify(j.loTrinh)}`);
  if (j.loTrinhChuaKhai !== CAU_C) sai.push(`kho thiếu khoá: loTrinhChuaKhai ${JSON.stringify(j.loTrinhChuaKhai)}`);
  const jj = { ...j }; delete jj.loTrinhChuaKhai;
  if (JSON.stringify(chuanKit(jj, kit)) !== JSON.stringify(chuanKit(g, banGoc()))) sai.push('kho thiếu khoá: JSON quét khác bộ máy gốc ngoài khoá mới');
  // Kho có khoá: khoá VẮNG HẲN (không phải null) và cả JSON quét giống bộ máy gốc — bên đọc so deepEqual (DP2-11) không lệch.
  const r2 = kho({ tep: { 'docs/lo-trinh.json': { schema: 1, hang: [H('A')] } } }); const j2 = quet(kit, r2);
  if ('loTrinhChuaKhai' in j2) sai.push(`kho có khai lộ trình nhận cờ chưa khai: ${JSON.stringify(j2.loTrinhChuaKhai)}`);
  if (JSON.stringify(chuanKit(j2, kit)) !== JSON.stringify(chuanKit(quet(banGoc(), r2), banGoc()))) sai.push('kho có khai: JSON quét khác bộ máy gốc');
  const md = readFileSync(path.join(KIT, 'commands', 'start.md'), 'utf8');
  const khoi = (md.match(/<!-- <<<START-LO-TRINH -->([\s\S]*?)<!-- START-LO-TRINH>>> -->/) || [])[1] || '';
  if (!/`loTrinhChuaKhai`[\s\S]{0,120}nguyên văn/.test(khoi)) sai.push('thân lệnh start (khối START-LO-TRINH) không gọi tên loTrinhChuaKhai kèm «nguyên văn»');
  return sai;
}
if (want('MC-4') && await chayCa('MC-4', mc4, KIT_TAT())) ok('MC-4', 'kho thiếu khoá: loTrinh null + đúng một câu cờ, mọi khoá khác bằng bộ máy gốc; kho có khoá: khoá vắng hẳn, JSON quét bằng bộ máy gốc; thân start gọi tên khoá');
if (want('MC-4-do')) await chayDoTat('MC-4-do', mc4, [['scripts/start-scan.mjs', 'cfgRead.err || cfgRead.t == null || tepLoTrinh != null ? null', 'cfgRead.err || cfgRead.t == null ? null']], 'kho có khai lộ trình nhận cờ chưa khai', 'bản sao bộ quét bỏ điều kiện «thiếu khoá»');
if (want('MC-4-do2')) await chayDoTat('MC-4-do2', mc4, [['scripts/start-scan.mjs', '  ...(loTrinhChuaKhai ? { loTrinhChuaKhai } : {}),', '  loTrinhChuaKhai,']], 'kho có khai lộ trình nhận cờ chưa khai: null', 'bản sao bộ quét luôn in khoá (kể cả null)');

// ═══ MC-5 (AC-5): chỉ cảnh báo — --check xanh, thẻ start chỉ tăng số cờ ═════════════════════════
async function mc5(kit) {
  const sai = [];
  for (const [ten, f, moi] of [['mc1', KHO_1, 5], ['mc3', KHO_3, 4]]) {
    const c = clone(f()); const v = node([path.join(kit, 'scripts', 'product-map.mjs'), '--root', c]);
    if (v.status !== 0) { sai.push(`${ten}: vẽ thoát ${v.status}`); continue; }
    git(c, 'add', '-A'); git(c, 'commit', '-qm', 've', '--allow-empty');
    const html = readFileSync(path.join(c, 'LO-TRINH.html'), 'utf8');
    const soMoi = coTrang(html).filter(x => x.endsWith(CAU_A) || / đang mở mà không thuộc việc nào trong kế hoạch — /.test(x)).length;
    if (soMoi !== moi) { sai.push(`${ten}: trang không có cờ để thử (${soMoi}/${moi})`); continue; }
    const k = node([path.join(kit, 'scripts', 'product-map.mjs'), '--root', c, '--check']);
    if (k.status !== 0) sai.push(`${ten}: --check thoát ${k.status} khi trang có ${soMoi} cờ: ${(k.stderr || k.stdout).slice(0, 120)}`);
    const dm = quet(kit, c).loTrinh.dong; const dg = quet(banGoc(), c).loTrinh.dong;
    const so = ds => { const l = ds.find(x => /^Lộ trình có \d+ cờ/.test(x)); return l ? Number(l.match(/có (\d+) cờ/)[1]) : 0; };
    if (so(dm) - so(dg) !== moi) sai.push(`${ten}: dòng đếm cờ của thẻ start tăng ${so(dm) - so(dg)}, cần ${moi}`);
    // ra-soat-lo-trinh (hàng RM1): khối rà soát là dòng mới CÓ CHỦ Ý của thẻ start — bỏ đúng khối đó ở bên mới trước khi so;
    // lời hứa gốc của MC-5 (không dòng nào khác đổi) giữ nguyên nghĩa.
    const laRaSoat = x => /^Rà soát: \d+ đề xuất — /.test(x) || /^  [·…] /.test(x);
    const bo = ds => ds.filter(x => !/^Lộ trình có \d+ cờ/.test(x) && !laRaSoat(x)).map(x => [realpathSync(kit), kit, realpathSync(banGoc()), banGoc()].reduce((y, g) => y.split(g).join('<kit>'), x));
    if (!deq(bo(dm), bo(dg))) sai.push(`${ten}: dòng khác của thẻ start đổi: ${JSON.stringify(bo(dm))} / ${JSON.stringify(bo(dg))}`);
  }
  return sai;
}
if (want('MC-5') && await chayCa('MC-5', mc5, KIT_TAT())) ok('MC-5', 'kho MC-1 (5 cờ) và MC-3 (4 cờ): --check thoát 0 trên trang có cờ; thẻ start chỉ tăng đúng số cờ mới, không dòng nào khác đổi');

// ═══ MC-6 (AC-6): tenChienDich — ma trận viết sẵn ═══════════════════════════════════════════════
// Thứ tự trong tệp CÓ CHỦ Ý: m2 (sớm hơn) đứng TRƯỚC m1 — luật «mốc đứng cuối tệp» chọn sai cho B2 (chiều đỏ MC-6-do).
const MOC_6 = { m2: { ten: 'Sớm hơn — một', ngay: '2026-10-20', hang: ['B2'] },
  m1: { ten: 'R2 lên production (tạm — chốt lại sau)', ngay: '2026-10-31', hang: ['A', 'B2', 'C2'] }, m3: { ten: 'Cùng ngày: thứ hai', ngay: '2026-10-31', hang: ['C2'] },
  mtn: { ten: 'Rất dài không cần đọc', ten_ngan: 'Mốc gọn', ngay: '2026-12-01', hang: ['TN'] },
  mch: { ten: 'Chấm phẩy; phần sau', ngay: '2026-11-02', hang: ['CP'] }, mhc: { ten: 'Hai chấm: phần sau', ngay: '2026-11-03', hang: ['HC'] },
  mng: { ten: 'Không ngày đúng', ngay: 'quý 4', hang: ['NG'] }, mgach: { ten: 'Tinh chỉnh sau hai đợt thử (số đặt lúc cắt) — sửa', ngay: '2026-11-05', hang: ['MC1'] } };
const ML = Object.values(MOC_6);
const MA_TRAN_6 = [
  ['ten-ngan-mot-moc', { hang: { ma: 'A', ten_ngan: 'Thành viên vào', ten: 'Dài', cau_giao: 'x' }, kho: 'crm' }, { moc: 'R2 lên production 31/10', ten_phien: 'A · Thành viên vào (crm)', nhom: 'R2 lên production 31/10' }],
  ['chi-ten', { hang: { ma: 'A', ten: 'Tên đủ', cau_giao: 'x' }, kho: 'crm' }, { moc: 'R2 lên production 31/10', ten_phien: 'A · Tên đủ (crm)', nhom: 'R2 lên production 31/10' }],
  ['cau-giao-bay-tu', { hang: { ma: 'A', cau_giao: '«một hai ba bốn năm sáu bảy»' }, kho: 'k' }, { moc: 'R2 lên production 31/10', ten_phien: 'A · một hai ba bốn năm sáu… (k)', nhom: 'R2 lên production 31/10' }],
  ['cau-giao-ba-tu', { hang: { ma: 'A', cau_giao: 'một hai ba' }, kho: 'k' }, { moc: 'R2 lên production 31/10', ten_phien: 'A · một hai ba (k)', nhom: 'R2 lên production 31/10' }],
  ['khong-moc', { hang: { ma: 'Q', ten_ngan: 'Lẻ' }, kho: 'k' }, { moc: null, ten_phien: 'Q · Lẻ (k)', nhom: null }],
  ['hai-moc-khac-ngay', { hang: { ma: 'B2', ten_ngan: 'b' }, kho: 'k' }, { moc: 'Sớm hơn 20/10', ten_phien: 'B2 · b (k)', nhom: 'Sớm hơn 20/10' }],
  ['hai-moc-cung-ngay', { hang: { ma: 'C2', ten_ngan: 'c' }, kho: 'k' }, { moc: 'R2 lên production 31/10', ten_phien: 'C2 · c (k)', nhom: 'R2 lên production 31/10' }],
  ['moc-ten-ngan', { hang: { ma: 'TN', ten_ngan: 't' }, kho: 'k' }, { moc: 'Mốc gọn 01/12', ten_phien: 'TN · t (k)', nhom: 'Mốc gọn 01/12' }],
  ['dau-cham-phay', { hang: { ma: 'CP', ten_ngan: 't' }, kho: 'k' }, { moc: 'Chấm phẩy 02/11', ten_phien: 'CP · t (k)', nhom: 'Chấm phẩy 02/11' }],
  ['dau-hai-cham', { hang: { ma: 'HC', ten_ngan: 't' }, kho: 'k' }, { moc: 'Hai chấm 03/11', ten_phien: 'HC · t (k)', nhom: 'Hai chấm 03/11' }],
  ['ngay-sai-dang', { hang: { ma: 'NG', ten_ngan: 't' }, kho: 'k' }, { moc: 'Không ngày đúng', ten_phien: 'NG · t (k)', nhom: 'Không ngày đúng' }],
  ['gach-va-ngoac', { hang: { ma: 'MC1', ten_ngan: 'Mốc là chiến dịch' }, kho: 'acceptance-gate-kit' }, { moc: 'Tinh chỉnh sau hai đợt thử 05/11', ten_phien: 'MC1 · Mốc là chiến dịch (acceptance-gate-kit)', nhom: 'Tinh chỉnh sau hai đợt thử 05/11' }],
  ['ba-lo-trinh-ten-ngan', { hang: { ma: 'A', ten_ngan: 'x' }, kho: 'crm', nhieuLoTrinh: true, loTrinh: { ten_ngan: 'OKR', ten: 'Dài dòng' }, tep: 'docs/plan/lo-trinh-okr.json' }, { moc: 'R2 lên production 31/10', ten_phien: 'A · x (crm)', nhom: 'OKR · R2 lên production 31/10' }],
  ['ba-lo-trinh-ten', { hang: { ma: 'A', ten_ngan: 'x' }, kho: 'crm', nhieuLoTrinh: true, loTrinh: { ten: 'Việc và Dự án' }, tep: 'docs/plan/lo-trinh-viec-du-an.json' }, { moc: 'R2 lên production 31/10', ten_phien: 'A · x (crm)', nhom: 'Việc và Dự án · R2 lên production 31/10' }],
  ['ba-lo-trinh-ten-tep', { hang: { ma: 'A', ten_ngan: 'x' }, kho: 'crm', nhieuLoTrinh: true, loTrinh: {}, tep: 'docs/plan/lo-trinh-kho-tai-lieu.json' }, { moc: 'R2 lên production 31/10', ten_phien: 'A · x (crm)', nhom: 'kho-tai-lieu · R2 lên production 31/10' }],
  ['ba-lo-trinh-khong-moc', { hang: { ma: 'Q', ten_ngan: 'x' }, kho: 'crm', nhieuLoTrinh: true, loTrinh: { ten: 'OKR' }, tep: 'a.json' }, { moc: null, ten_phien: 'Q · x (crm)', nhom: null }],
];
async function mc6(kit) {
  const M = await nap(kit); const sai = []; let chay = 0;
  for (const [ten, vao, mong] of MA_TRAN_6) {
    chay += 1; const x = M.LT.tenChienDich({ moc: ML, ...vao });
    const nhan = { moc: x.moc ? x.moc.ten_ngan : null, ten_phien: x.ten_phien, nhom: x.nhom };
    if (!deq(nhan, mong)) sai.push(`${ten}: nhận mốc ${JSON.stringify(nhan.moc)} · ${JSON.stringify(nhan)} (cần ${JSON.stringify(mong)})`);
  }
  // tenKho trên thư mục không phải kho git → tên thư mục gốc.
  const d = path.join(TMP, 'khong-git', 'ten-thu-muc'); mkdirSync(d, { recursive: true });
  chay += 1; if (M.LT.tenKho(d) !== 'ten-thu-muc') sai.push(`khong-git: tenKho «${M.LT.tenKho(d)}»`);
  if (chay !== MA_TRAN_6.length + 1 || chay < 17) sai.push(`số ca chạy ${chay}, ma trận ${MA_TRAN_6.length + 1}`);
  return sai;
}
if (want('MC-6') && await chayCa('MC-6', mc6)) ok('MC-6', `${MA_TRAN_6.length + 1} ca viết sẵn: tên ngắn hàng · mốc (không · một · hai khác ngày · cùng ngày · ten_ngan · — · ( · ; · : · ngày sai) · một/ba lộ trình · không phải kho git`);
if (want('MC-6-do')) await chayDo('MC-6-do', mc6, [['scripts/lo-trinh.mjs', 'co.sort((a, b) => chuoi(a.m.ngay).localeCompare(chuoi(b.m.ngay)) || a.i - b.i);', 'co.sort((a, b) => b.i - a.i);']], 'hai-moc-khac-ngay: nhận mốc', 'bản sao chọn mốc đứng cuối tệp');

// ═══ MC-7 (AC-7): khối S0-MO-O chạy nguyên văn in mốc · tên phiên · nhóm ═══════════════════════════
const khoiSkill = (ten, txt) => { const m = txt.match(new RegExp(`<!-- <<<${ten} -->\\n\`\`\`\\n([\\s\\S]*?)\\n\`\`\`\\n<!-- ${ten}>>> -->`)); if (!m) throw new Error(`SKILL thiếu khối ${ten}`); return m[1]; };
// HOME giả có cache acceptance-gate mang bản sao scripts lib skills của bộ máy `kit` (bộ giải gói tìm ở đó).
const homeCache = new Map();
const homeCua = kit => { if (homeCache.has(kit)) return homeCache.get(kit); const h = path.join(TMP, `home-${homeCache.size}`);
  const v = path.join(h, '.claude', 'plugins', 'cache', 'acceptance-gate-kit', 'acceptance-gate', '9.9.9');
  for (const d of ['scripts', 'lib', 'skills']) cpSync(path.join(kit, d), path.join(v, d), { recursive: true }); homeCache.set(kit, h); return h; };
const chayS0 = (kit, ma, cwd) => spawnSync('bash', ['-c', khoiSkill('S0-MO-O', readFileSync(path.join(kit, SKILL_REL), 'utf8')).replace("'<mã>'", `'${ma}'`)],
  { cwd, encoding: 'utf8', env: { ...process.env, HOME: homeCua(kit), WORKFLOWS_DIR: path.join(kit, 'feature-loop', 'workflows') } });
const LT_7 = { schema: 1, ten: 'Một', moc: [{ ten: 'M1 — chiến dịch', ngay: '2026-11-01', hang: ['MA', 'DA'] }], hang: [H('MA', { ten_ngan: 'Có mốc' }), H('NA', { ten_ngan: 'Không mốc' }), H('DA', { slug: 'da', ten_ngan: 'Đã có' })] };
async function mc7(kit) {
  const M = await nap(kit); const sai = [];
  const goc = path.join(TMP, `mc7-${++khoN}`); mkdirSync(goc, { recursive: true });
  const r = kho({ ten: path.join(path.basename(goc), 'kho-chinh'), tep: { 'docs/lo-trinh.json': LT_7 }, hoSo: { da: 'sap-mo' } });
  for (const [ten, ma, moi] of [['moi-co-moc', 'MA', true], ['moi-khong-moc', 'NA', false], ['da-co-ho-so', 'DA', null]]) {
    const x = chayS0(kit, ma, r); let j = null; try { j = JSON.parse(x.stdout); } catch { /* sai dưới */ }
    if (x.status !== 0 || !j) { sai.push(`${ten}: exit ${x.status} «${x.stdout.trim()}» ${x.stderr.trim().slice(0, 160)}`); continue; }
    const mong = M.LT.tenChienDich({ hang: LT_7.hang.find(h => h.ma === ma), moc: LT_7.moc, loTrinh: LT_7, tep: 'docs/lo-trinh.json', nhieuLoTrinh: false, kho: 'kho-chinh' });
    if (!deq(Object.keys(j), ['hoSo', 'moi', 'moc', 'ten_phien', 'nhom'])) sai.push(`${ten}: khoá ${JSON.stringify(Object.keys(j))}`);
    if (j.moi !== (moi === null ? false : true)) sai.push(`${ten}: moi ${j.moi}`);
    if (!deq({ moc: j.moc, ten_phien: j.ten_phien, nhom: j.nhom }, mong)) sai.push(`${ten}: ${JSON.stringify(j)} ≠ tenChienDich ${JSON.stringify(mong)}`);
    if (moi === false && (j.nhom !== null || j.moc !== null)) sai.push(`${ten}: hàng không mốc mà nhom/moc ${j.nhom}/${JSON.stringify(j.moc)}`);
  }
  // Worktree tên khác + thư mục con: tên kho vẫn là kho chính.
  const wt = path.join(goc, 'wt-khac'); git(r, 'worktree', 'add', '-q', wt, '-b', 'wt');
  const x = chayS0(kit, 'NA', wt); let j = null; try { j = JSON.parse(x.stdout); } catch { /* sai dưới */ }
  if (!j || !j.ten_phien.endsWith('(kho-chinh)')) sai.push(`tên kho theo worktree: ${j ? (j.ten_phien.match(/\(([^)]*)\)$/) || [])[1] : `exit ${x.status} ${x.stderr.slice(0, 120)}`}`);
  const con = path.join(wt, 'docs'); if (M.LT.tenKho(con) !== 'kho-chinh') sai.push(`tên kho theo worktree: ${M.LT.tenKho(con)} (thư mục con)`);
  return sai;
}
if (want('MC-7') && await chayCa('MC-7', mc7)) {
  for (const t of ['moi-co-moc', 'moi-khong-moc', 'da-co-ho-so', 'worktree']) ok(`MC-7 ${t}`, 'khối S0-MO-O chạy nguyên văn: hoSo, moi + moc/ten_phien/nhom == tenChienDich trên cùng hàng, kho «kho-chinh»');
}
if (want('MC-7 worktree-do')) await chayDo('MC-7 worktree-do', mc7, [['scripts/lo-trinh.mjs', "['-C', root, 'rev-parse', '--path-format=absolute', '--git-common-dir']", "['-C', root, 'rev-parse', '--show-toplevel']"],
  ['scripts/lo-trinh.mjs', 'if (d) return path.basename(path.dirname(d));', 'if (d) return path.basename(d);']], 'tên kho theo worktree: wt-khac', 'bản sao lấy tên theo gốc cây làm việc');
// Mã thoát của lệnh không đổi: bốn đối số cho 0 · 1 · 2 · 3 ở cả gốc lẫn cây.
async function mc7thoat(kit) {
  const sai = [];
  const r = kho({ tep: { 'docs/a.json': { schema: 1, hang: [H('X'), H('T')] }, 'docs/b.json': { schema: 1, hang: [H('T')] } } });
  for (const [a, mong] of [[['--hang', 'docs/a.json:X'], 0], [['--hang', 'ZZ'], 1], [['--hang'], 2], [['--hang', 'T'], 3]]) {
    const g = node([path.join(banGoc(), 'scripts', 'lo-trinh.mjs'), '--root', r, ...a]).status; const m = node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', r, ...a]).status;
    if (g !== mong || m !== mong) sai.push(`${a.join(' ')}: gốc ${g} · cây ${m} (cần ${mong})`);
  }
  return sai;
}
if (want('MC-7 ma-thoat') && await chayCa('MC-7 ma-thoat', mc7thoat)) ok('MC-7 ma-thoat', 'bốn đối số: mã thoát 0 · 1 · 2 · 3 bằng bộ máy gốc');

// ═══ MC-8 (AC-8): dòng «Mốc:» trong ô cơ hội ═══════════════════════════════════════════════════
async function mc8(kit) {
  const M = await nap(kit); const sai = [];
  const r = kho({ tep: { 'docs/lo-trinh.json': { schema: 1, moc: [{ ten: 'M1', ngay: '2026-11-01', hang: ['MA'] }], hang: [H('MA', { slug: 'ma' }), H('NA', { slug: 'na' })] } } });
  for (const [ma, mong] of [['MA', l => l === 'Mốc: M1 — 01/11/2026.'], ['NA', l => l.startsWith('Mốc: chưa gắn — ')]]) {
    const c = clone(r); const cg = clone(r);
    const x = node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', c, '--hang', ma, '--mo-o', '--owner', 'x@y.z']);
    const y = node([path.join(banGoc(), 'scripts', 'lo-trinh.mjs'), '--root', cg, '--hang', ma, '--mo-o', '--owner', 'x@y.z']);
    if (x.status !== 0 || y.status !== 0) { sai.push(`${ma}: thoát cây ${x.status} · gốc ${y.status}`); continue; }
    const slug = ma.toLowerCase(); const dong = readFileSync(path.join(c, '_acceptance', slug, 'opportunity.md'), 'utf8').split('\n');
    const i = dong.findIndex(l => l.startsWith('Mở từ hàng ')); const moc = dong.filter(l => l.startsWith('Mốc:'));
    if (i < 0 || !mong(dong[i + 1] || '') || moc.length !== 1) sai.push(`${ma}: dòng sau «Mở từ hàng» «${dong[i + 1]}», ${moc.length} dòng Mốc:`);
    const kc = M.PM.classify(path.join(c, '_acceptance', slug), slug).key; const kg = M.PM.classify(path.join(cg, '_acceptance', slug), slug).key;
    if (kc !== kg) sai.push(`${ma}: ô bản đồ cây ${kc} · gốc ${kg}`);
  }
  return sai;
}
if (want('MC-8') && await chayCa('MC-8', mc8)) ok('MC-8', 'ô cơ hội: «Mốc: M1 — 01/11/2026.» / «Mốc: chưa gắn — …» ngay sau dòng «Mở từ hàng»; ô bản đồ bằng bộ máy gốc');

// ═══ MC-9 (AC-9): khối S0-TEN-CHIEN-DICH của SKILL == khoá lệnh in thêm ═══════════════════════════
async function mc9(kit) {
  const sai = []; const txt = readFileSync(path.join(kit, SKILL_REL), 'utf8');
  let khoi; try { khoi = khoiSkill('S0-TEN-CHIEN-DICH', txt); } catch (e) { return [String(e.message)]; }
  const khoa = ((khoi.match(/^khoa:\s*(.+)$/m) || [])[1] || '').trim().split(/\s+/).filter(Boolean);
  if (!/^nhom-rong:\s*khong-xep\s*$/m.test(khoi)) sai.push('thiếu luật nhom null (dòng nhom-rong: khong-xep)');
  const r = kho({ tep: { 'docs/lo-trinh.json': { schema: 1, moc: [{ ten: 'M', ngay: '2026-11-01', hang: ['A'] }], hang: [H('A', { slug: 'a' })] } } });
  const x = node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', clone(r), '--hang', 'A', '--mo-o', '--owner', 'x']);
  const y = node([path.join(banGoc(), 'scripts', 'lo-trinh.mjs'), '--root', clone(r), '--hang', 'A', '--mo-o', '--owner', 'x']);
  const them = Object.keys(JSON.parse(x.stdout)).filter(k => !Object.keys(JSON.parse(y.stdout)).includes(k));
  for (const k of khoa.filter(k => !them.includes(k))) sai.push(`khối có khoá lệnh không in: ${k}`);
  for (const k of them.filter(k => !khoa.includes(k))) sai.push(`lệnh in khoá ngoài khối: ${k}`);
  for (const k of ['moc', 'ten_phien', 'nhom']) if (!khoa.includes(k)) sai.push(`khối thiếu khoá: ${k}`);
  const i = txt.indexOf('<!-- <<<S0-TEN-CHIEN-DICH -->'); const doan = txt.slice(Math.max(0, i - 1500), i);
  if (!/đặt tên phiên bằng đúng `ten_phien`/.test(doan) || !/nhóm tên đúng bằng `nhom`/.test(doan)) sai.push('đoạn S0 không gọi tên việc đặt tên phiên bằng ten_phien / xếp nhóm bằng nhom');
  return sai;
}
if (want('MC-9') && await chayCa('MC-9', mc9)) ok('MC-9', 'khối S0-TEN-CHIEN-DICH: {moc, ten_phien, nhom} == khoá lệnh in thêm so với gốc; luật nhom-rong: khong-xep; đoạn S0 gọi tên hai việc');
if (want('MC-9-do')) await chayDo('MC-9-do', mc9, [[SKILL_REL, 'khoa: moc ten_phien nhom\n', 'khoa: moc ten_phien\n']], 'khối thiếu khoá: nhom', 'bản sao SKILL bỏ nhom khỏi khối');
if (want('MC-9-do2')) await chayDo('MC-9-do2', mc9, [['scripts/lo-trinh.mjs', '    ten_phien: `${chuoi(hang.ma)} · ', '    x_thu: 1,\n    ten_phien: `${chuoi(hang.ma)} · ']], 'lệnh in khoá ngoài khối: x_thu', 'bản sao mã thêm khoá x_thu');
if (want('MC-9-do3')) await chayDo('MC-9-do3', mc9, [[SKILL_REL, 'nhom-rong: khong-xep\n', '']], 'thiếu luật nhom null', 'bản sao SKILL bỏ luật ca nhom rỗng');

// ═══ MC-11 (AC-11): lộ trình kit ở cây ═══════════════════════════════════════════════════════════
async function mc11(kit) {
  const M = await nap(kit); const sai = [];
  const d = JSON.parse(readFileSync(path.join(KIT, 'docs', 'plans', 'lo-trinh-kit.json'), 'utf8'));
  const moc = d.moc.filter(m => (m.hang || []).includes('MC1'));
  // Mốc của MC1 đổi 15/10: chuyển từ «Tinh chỉnh sau hai đợt thử» 05/11 sang «Phát hành 2.31.0» 16/10 trong PR mốc
  // (điều phối M5 quyết 07:00Z sau khi hỏi MacBook Pro trên kit #308) — Known limit Ngoài-9 của hồ sơ này, sửa ca ở mốc.
  if (moc.length !== 1 || moc[0].ngay !== '2026-10-16') sai.push(`MC1 thuộc ${moc.length} mốc ${JSON.stringify(moc.map(m => m.ngay))}`);
  const k = phan(M, KIT); const kq = k.cacTep[0].kq;
  const coA = kq.co.filter(c => / đang mở vòng mà chưa thuộc mốc nào$/.test(c)); if (coA.length) sai.push(`lộ trình kit có cờ ngoài mốc: ${JSON.stringify(coA)}`);
  // Tự đếm độc lập: thư mục hồ sơ không hàng nào trỏ (slug, hồ sơ nhận) và không tự ghi lo_trinh_ma, ô bản đồ đang mở.
  const troi = new Set(kq.dong.flatMap(x => [x.slug, x.hoSo]).filter(Boolean)); const nhan = new Set(M.LT.docNhan(KIT).map(n => n.slug));
  const mo = new Set([...M.LT.DANG_LAM_O, ...M.LT.CHUA_LAM_O]);
  const tu = readdirSync(path.join(KIT, '_acceptance'), { withFileTypes: true }).filter(e => e.isDirectory() && !troi.has(e.name) && !nhan.has(e.name))
    .map(e => e.name).filter(s => mo.has(M.PM.classify(path.join(KIT, '_acceptance', s), s).key)).sort();
  const coB = kq.co.map(c => /^hồ sơ (\S+) đang mở mà không thuộc việc nào trong kế hoạch$/.exec(c)).filter(Boolean).map(m => m[1]).sort();
  if (!tu.length) sai.push('đối chứng: tự đếm ra 0 hồ sơ đang mở ngoài kế hoạch');
  if (!deq(coB, tu)) sai.push(`cờ hồ sơ ngoài kế hoạch ${JSON.stringify(coB)} ≠ tự đếm ${JSON.stringify(tu)}`);
  const h = d.hang.find(x => x.ma === 'MC1');
  const t = M.LT.tenChienDich({ hang: h, moc: d.moc, loTrinh: d, tep: 'docs/plans/lo-trinh-kit.json', nhieuLoTrinh: false, kho: M.LT.tenKho(KIT) });
  if (t.ten_phien !== 'MC1 · Mốc là chiến dịch (acceptance-gate-kit)') sai.push(`ten_phien «${t.ten_phien}»`);
  if (t.nhom !== 'Phát hành 2.31.0 16/10') sai.push(`nhom «${t.nhom}»`);
  console.log(`    · MC-11 hồ sơ đang mở ngoài kế hoạch (${tu.length}): ${tu.join(', ')}`);
  return sai;
}
if (want('MC-11') && await chayCa('MC-11', mc11)) ok('MC-11', 'MC1 thuộc đúng mốc 2026-10-16; 0 cờ ngoài mốc; cờ hồ sơ ngoài kế hoạch == tự đếm; tên phiên/nhóm viết sẵn');

rmSync(TMP, { recursive: true, force: true });
console.log(`\nResults: ${pass} passed, ${fail} failed (moc-chien-dich)`);
process.exit(fail ? 1 : 0);
