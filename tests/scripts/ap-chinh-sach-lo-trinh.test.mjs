// ap-chinh-sach-lo-trinh.test.mjs — hồ sơ ap-chinh-sach-lo-trinh (hàng RM2, vòng 2 của gói road-map), ca AP-<n> = AC-n
// của hợp đồng (AC-11 ở ap-chinh-sach-lo-trinh-crm.mjs). Mỗi eval của evals.yaml ghim đúng dòng «PASS: AP-…» của tệp này.
//
// Kho thử do CODE sinh trong lượt (git init trong thư mục tạm, commit ghim ngày bằng GIT_COMMITTER_DATE/GIT_AUTHOR_DATE,
// hồ sơ dựng theo hình dạng ô bản đồ). Giá trị mong đợi viết sẵn trong ca, không rút từ đầu ra của hàm đang đo.
// «Bộ máy gốc» = `git archive <gốc so> scripts lib skills commands road-map`, gốc so đọc từ
// _acceptance/ap-chinh-sach-lo-trinh/goc-so. Ca đỏ chạy CHÍNH hàm đo trên BẢN SAO của vật (nhát tiêm khớp đúng một lần),
// SAU khi bản lành xanh trên cùng kho thử, và ghim thông điệp. Mọi đường dẫn suy từ vị trí tệp này. Không ca nào ghi vào
// cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, realpathSync, statSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const GOC = readFileSync(path.join(KIT, '_acceptance', 'ap-chinh-sach-lo-trinh', 'goc-so'), 'utf8').trim();
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'ap-')));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.AP_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-'));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...o });
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const bam = p => (existsSync(p) ? createHash('sha256').update(readFileSync(p)).digest('hex') : null);

// ── Hồ sơ theo ô bản đồ — rút từ mô-đun dựng kho thử DÙNG CHUNG (cùng cách ca RS-*) ─────────────────────────────────
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
};
const TEP = 'docs/lo-trinh.json';
const SO = 'docs/lo-trinh.so.jsonl';
let khoN = 0;
const commitNgay = (r, ngay, tin) => {
  const env = { ...process.env, GIT_AUTHOR_DATE: `${ngay}T12:00:00Z`, GIT_COMMITTER_DATE: `${ngay}T12:00:00Z` };
  execFileSync('git', ['-C', r, 'add', '-A'], { env }); execFileSync('git', ['-C', r, 'commit', '-qm', tin, '--allow-empty'], { env });
  return git(r, 'rev-parse', 'HEAD');
};
const ghiTep = (r, d, tep = TEP) => { const p = path.join(r, tep); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, typeof d === 'string' ? d : JSON.stringify(d, null, 2) + '\n'); };
const ghiHoSo = (r, hoSo) => {
  for (const [slug, spec] of Object.entries(hoSo)) {
    const [hinh, ma] = Array.isArray(spec) ? spec : [spec];
    const d = path.join(r, '_acceptance', slug); mkdirSync(d, { recursive: true });
    for (const [f, t] of Object.entries(HO_SO[hinh](slug, ma))) writeFileSync(path.join(d, f), t);
  }
};
// `phienBan`: [{ ngay, data, nhan }] — mỗi phần tử MỘT commit ghim ngày; `cfg` null = không khai lộ trình;
// `chuaCommit`: ghi tệp lộ trình SAU commit (tệp chưa từng vào git); `tep`: danh sách tệp khai (mặc định một tệp).
function kho({ phienBan = [], data = null, hoSo = {}, cfg = undefined, ten = null, chuaCommit = false, them = {} } = {}) {
  const r = path.join(TMP, ten || `kho-${++khoN}`); mkdirSync(r, { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'Người Thử');
  mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  const khoi = cfg !== undefined ? (cfg || '') : `lo_trinh:\n  tep: ${TEP}\n`;
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), `schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\n${khoi}`);
  ghiHoSo(r, hoSo);
  for (const [p, t] of Object.entries(them)) ghiTep(r, t, p);
  const pb = phienBan.length ? phienBan : [{ ngay: '2026-09-01', data, nhan: 'c1' }];
  const sha = {};
  pb.forEach((v, i) => { if (v.data != null && !chuaCommit) ghiTep(r, v.data); sha[v.nhan || `c${i + 1}`] = commitNgay(r, v.ngay, `pb ${i}`); });
  if (chuaCommit) ghiTep(r, pb[pb.length - 1].data);
  return { r, sha };
}
const H = (ma, o = {}) => ({ ma, cau_giao: `«câu giao ${ma}»`, ...o });

// Bản sao của vật: trọn scripts lib skills commands feature-loop road-map .claude-plugin; nhát tiêm thay ĐÚNG một lần.
let bsN = 0;
function banSao(tiem = [], goc = KIT) {
  const c = path.join(TMP, `bs-${++bsN}`);
  for (const d of ['scripts', 'lib', 'skills', 'commands', 'feature-loop', 'road-map', '.claude-plugin', 'tests', '_acceptance/ap-chinh-sach-lo-trinh/nen']) if (existsSync(path.join(goc, d))) cpSync(path.join(goc, d), path.join(c, d), { recursive: true });
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
  const d = path.join(TMP, 'goc-so'); mkdirSync(d, { recursive: true });
  const tar = execFileSync('git', ['-C', KIT, 'archive', '--format=tar', GOC, 'scripts', 'lib', 'skills', 'commands', 'road-map'], { maxBuffer: 1 << 28 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  if (!existsSync(path.join(d, 'scripts', 'lo-trinh.mjs'))) throw new Error(`bộ máy gốc ${GOC} không bung được scripts/lo-trinh.mjs`);
  return (gocDir = d);
}
const LT = kit => path.join(kit, 'scripts', 'lo-trinh.mjs');
const chay = (kit, r, today, args) => node([LT(kit), '--root', r, ...args], { env: { ...process.env, ACCEPTANCE_TODAY: today } });
const rsJson = (kit, r, today) => { const x = chay(kit, r, today, ['--ra-soat', '--json']);
  if (x.status !== 0) throw new Error(`--ra-soat --json của ${kit} thoát ${x.status}: ${x.stderr.slice(0, 200)}`); return JSON.parse(x.stdout); };
const apJson = (kit, r, today) => { const x = chay(kit, r, today, ['--ap', '--json']);
  if (x.status !== 0) throw new Error(`--ap --json thoát ${x.status}: ${x.stderr.slice(0, 200)}`); return JSON.parse(x.stdout); };
const apGhi = (kit, r, today) => chay(kit, r, today, ['--ap', '--write']);
const apGhiOk = (kit, r, today) => { const x = apGhi(kit, r, today); if (x.status !== 0) throw new Error(`--ap --write ngày ${today} thoát ${x.status}: ${x.stderr.slice(0, 300)}`); return x; };
const docSo = (r, so = SO) => (existsSync(path.join(r, so)) ? readFileSync(path.join(r, so), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : []);
const docLT = (r, tep = TEP) => JSON.parse(readFileSync(path.join(r, tep), 'utf8'));
const quet = (kit, r, today) => {
  const x = node([path.join(kit, 'scripts', 'start-scan.mjs'), '--root', r], { env: { ...process.env, ACCEPTANCE_TODAY: today } });
  if (x.status !== 0) throw new Error(`start-scan của ${kit} thoát ${x.status}: ${x.stderr.slice(0, 200)}`);
  return x.stdout;
};
const chuanKit = (s, kit) => [realpathSync(kit), kit].reduce((x, g) => x.split(g).join('<kit>'), s);
const chayCa = async (id, f, kit = KIT) => { try { const s = await f(kit); if (s.length) bad(id, s.join(' ; ')); else return true; } catch (e) { bad(id, loi(e)); } return false; };
const chayDo = async (id, f, tiem, ghim, moTa) => {
  try {
    const lanh = await f(KIT); if (lanh.length) { bad(id, `bản lành chưa xanh — không tin được chiều đỏ: ${lanh[0]}`); return; }
    const s = await f(banSao(tiem)); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm đo trả «${g.slice(0, 110)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 260)}`);
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
const daySo = so => so.map(d => `${d.loai} ${d.ma} ${d.ngay}`);

let napN = 0;
const nap = async kit => ({
  LT: await import(pathToFileURL(path.join(kit, 'scripts', 'lo-trinh.mjs')).href + `?v=${++napN}`),
  PM: await import(pathToFileURL(path.join(kit, 'scripts', 'product-map.mjs')).href + `?v=${napN}`),
});
const ve = async (kit, r, today) => {
  const cu = process.env.ACCEPTANCE_TODAY; process.env.ACCEPTANCE_TODAY = today;
  try { const M = await nap(kit); return M.LT.veTrang({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS }); }
  finally { if (cu === undefined) delete process.env.ACCEPTANCE_TODAY; else process.env.ACCEPTANCE_TODAY = cu; }
};
const giaiMa = s => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const chuTron = s => giaiMa(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const coTrang = html => [...html.matchAll(/<ul class="co-ds">([\s\S]*?)<\/ul>/g)].flatMap(u => [...u[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => chuTron(m[1])));
const trangThaiSach = r => git(r, 'status', '--porcelain');

// ═══ AP-1 (AC-1): chính sách đọc từ mốc chiến dịch đang chạy ════════════════════════════════════════════════════
const HN1 = '2026-10-15';
const MOC_AP1 = (bB = { tu_ap: true, tuoi_ngay: 20 }) => [
  { ten: 'A', ngay: '2026-09-01', loai: 'phat-hanh', chinh_sach: { tu_ap: true }, hang: [] },
  { ten: 'B', ngay: '2026-10-18', loai: 'phat-hanh', chinh_sach: bB, hang: [] },
  { ten: 'C', ngay: '2026-10-25', loai: 'phat-hanh', chinh_sach: { tu_ap: false }, hang: [] },
  { ten: 'N', ngay: '2026-10-20', loai: 'ngoai', ai: 'M', chinh_sach: { tu_ap: true }, hang: [] },
];
const DATA_AP1 = bB => ({ schema: 1, chinh_sach: { tuoi_ngay: 30, tran_ke_tiep: 2 }, moc: MOC_AP1(bB), hang: [H('K25')] });
async function ap1(kit) {
  const sai = []; const { r } = kho({ phienBan: [{ ngay: '2026-09-20', data: DATA_AP1() }] });
  const j = apJson(kit, r, HN1)[0];
  const ten = String(j.chien_dich || '').split(' ')[0];
  if (ten !== 'B') sai.push(`chiến dịch đang chạy: ${ten || '(không có)'}, cần B`);
  const mong = { tu_ap: true, tuoi_ngay: 20, tran_ke_tiep: 2, nhip_ngay: 1, tran_ap: 5 };
  if (!deq(j.chinh_sach, mong)) sai.push(`chính sách hiệu lực ${JSON.stringify(j.chinh_sach)}, cần ${JSON.stringify(mong)}`);
  const rs = rsJson(kit, r, HN1)[0].de_xuat;
  if (!rs.some(m => m.ma === 'K25' && m.luat === 'tuoi')) sai.push(`hàng tuổi 25 không mang luật tuổi với ngưỡng 20 của chiến dịch: ${JSON.stringify(rs)}`);
  const co = coTrang(await ve(kit, r, HN1)).filter(c => c.includes('chính sách chỉ khai ở mốc phát hành'));
  if (co.length !== 1 || !co[0].includes('N 20/10')) sai.push(`cờ mốc không phải phát hành: ${JSON.stringify(co)}`);
  return sai;
}
if (want('AP-1') && await chayCa('AP-1', ap1)) ok('AP-1', 'chiến dịch = mốc phát hành gần nhất phía trước (B); chính sách hiệu lực mốc thắng tệp, tu_ap chỉ từ mốc; tuổi 20 áp vào rà soát; mốc ngoai khai chính sách → đúng một cờ');
if (want('AP-1-do')) await chayDo('AP-1-do', ap1, [['scripts/lo-trinh.mjs', 'if (!best || ngay < best.ngay) best = { m, i, ngay };', 'if (!best || ngay > best.ngay) best = { m, i, ngay };']], 'chiến dịch đang chạy: C, cần B', 'bản sao chọn mốc xa nhất');
if (want('AP-1-cung-ngay') && await chayCa('AP-1-cung-ngay', async kit => {
  const data = { schema: 1, moc: [{ ten: 'P', ngay: '2026-10-18', loai: 'phat-hanh', chinh_sach: { tu_ap: false }, hang: [] }, { ten: 'Q', ngay: '2026-10-18', loai: 'phat-hanh', chinh_sach: { tu_ap: true }, hang: [] }], hang: [H('X')] };
  const j = apJson(kit, kho({ data }).r, HN1)[0];
  return j.chien_dich === 'P 18/10' && j.chinh_sach && j.chinh_sach.tu_ap === false ? [] : [`hai mốc cùng ngày: ${JSON.stringify(j)}`];
})) ok('AP-1-cung-ngay', 'hai mốc phát hành cùng ngày → mốc đứng trước trong tệp (P, không bật)');
if (want('AP-1-sai-kieu') && await chayCa('AP-1-sai-kieu', async kit => {
  const sai = []; const { r } = kho({ phienBan: [{ ngay: '2026-09-20', data: DATA_AP1({ tu_ap: 'true', tuoi_ngay: 20 }) }] });
  const co = coTrang(await ve(kit, r, HN1)).filter(c => c.includes('chính sách tu_ap phải là true hoặc false'));
  if (co.length !== 1) sai.push(`cờ tu_ap sai kiểu: ${JSON.stringify(co)}`);
  const b0 = bam(path.join(r, TEP)); const x = apGhi(kit, r, HN1);
  if (x.status !== 0) sai.push(`--ap --write thoát ${x.status}`);
  if (existsSync(path.join(r, SO))) sai.push('chính sách mốc sai kiểu mà máy vẫn ghi sổ');
  if (bam(path.join(r, TEP)) !== b0) sai.push('chính sách mốc sai kiểu mà tệp lộ trình đổi');
  return sai;
})) ok('AP-1-sai-kieu', 'tu_ap "true" → đúng một cờ, không sổ, tệp không đổi');
// Ba kho không bật: không chính sách · chính sách tệp không tu_ap · chỉ mốc đã qua bật. Mỗi kho có đề xuất thật.
const KHONG_BAT = {
  'khong-chinh-sach': { schema: 1, moc: [{ ten: 'Qua', ngay: '2026-09-01', loai: 'phat-hanh', hang: ['M1'] }, { ten: 'Toi', ngay: '2026-11-01', loai: 'phat-hanh', hang: [] }], hang: [H('M1'), H('X', { trang_thai: 'xếp lại' })] },
  'tep-khong-tu-ap': { schema: 1, chinh_sach: { tuoi_ngay: 30 }, moc: [{ ten: 'Qua', ngay: '2026-09-01', loai: 'phat-hanh', hang: ['M1'] }], hang: [H('M1'), H('K40')] },
  'chi-moc-qua': { schema: 1, moc: [{ ten: 'Qua', ngay: '2026-09-01', loai: 'phat-hanh', chinh_sach: { tu_ap: true }, hang: ['M1'] }], hang: [H('M1')] },
};
async function ap1KhongBat(kit) {
  const sai = [];
  for (const [ten, data] of Object.entries(KHONG_BAT)) {
    const { r } = kho({ phienBan: [{ ngay: '2026-09-05', data }] });
    const x = apGhi(kit, r, HN1);
    if (x.status !== 0) sai.push(`${ten}: --ap --write thoát ${x.status}`);
    if (trangThaiSach(r)) sai.push(`kho không bật tự áp mà máy ghi sổ (${ten}): ${trangThaiSach(r)}`);
    for (const args of [['--ra-soat'], ['--ra-soat', '--json']]) {
      const a = chay(kit, r, HN1, args); const b = chay(banGoc(), r, HN1, args);
      if (a.status !== 0 || b.status !== 0 || !b.stdout) { sai.push(`đối chứng gốc không chạy: ${ten} ${args.join(' ')} (${a.status}/${b.status})`); continue; }
      if (chuanKit(a.stdout, kit) !== chuanKit(b.stdout, banGoc())) sai.push(`${ten} ${args.join(' ')}: khác bộ máy gốc`);
    }
  }
  return sai;
}
if (want('AP-1-khong-bat') && await chayCa('AP-1-khong-bat', ap1KhongBat)) ok('AP-1-khong-bat', 'ba kho không bật: --ap --write không ghi gì; --ra-soat chữ + JSON giống từng byte bộ máy gốc');

if (want('AP-1-do2')) await chayDo('AP-1-do2', ap1KhongBat, [['scripts/lo-trinh.mjs', 'tu_ap: !!(csM && csM.tu_ap),', 'tu_ap: !!((csM && csM.tu_ap) || csT),']], 'kho không bật tự áp mà máy ghi sổ', 'bản sao đọc tu_ap từ khối của tệp');

// ═══ AP-2 (AC-2): nhịp báo trước → áp, trần, huỷ, đổi ══════════════════════════════════════════════════════════
const D20 = '2026-10-20'; const D21 = '2026-10-21'; const D22 = '2026-10-22'; const D23 = '2026-10-23'; const D24 = '2026-10-24';
const TOI = (cs = {}) => ({ ten: 'Toi', ngay: '2026-10-30', loai: 'phat-hanh', chinh_sach: { tu_ap: true, tuoi_ngay: 30, ...cs }, hang: [] });
const QUA = (hang, ten = 'Qua') => ({ ten, ngay: '2026-09-15', loai: 'phat-hanh', hang });
const DATA_2 = tran => ({ schema: 1, moc: [QUA(['Y']), TOI({ tran_ap: tran })], hang: [H('X'), H('Y'), H('Z', { slug: 'z-bac' })] });
const dayDx = so => so.map(d => `${d.loai} ${d.ma} ${d.de_xuat} ${d.ngay}`);
const viPham = so => [...so.filter(d => d.loai === 'ap' && so.some(b => b.loai === 'bao-truoc' && b.ma === d.ma && b.ngay === d.ngay)).map(d => `áp trước nhịp: ${d.ma}`),
  ...so.filter(d => d.loai === 'ap' && d.ma === 'Y').map(() => 'áp hàng đã có hồ sơ mở: Y')];
async function ap2(kit, tran = 2) {
  const sai = []; const { r } = kho({ hoSo: { 'z-bac': 'da-bac' }, data: DATA_2(tran) }); const tep = path.join(r, TEP);
  const b0 = bam(tep); apGhiOk(kit, r, D20);
  if (bam(tep) !== b0) sai.push('ngày báo trước mà tệp lộ trình đổi');
  const so20 = docSo(r);
  const mong20 = ['bao-truoc X 2026-10-20', 'bao-truoc Y 2026-10-20', 'bao-truoc Z 2026-10-20'];
  if (!deq(daySo(so20).filter(x => x.startsWith('bao-truoc')), mong20) || so20.some(d => d.loai === 'bao-truoc' && d.ap_tu !== D21)) sai.push(`sổ ngày báo trước: ${JSON.stringify(daySo(so20))}`);
  const bs = bam(path.join(r, SO)); apGhi(kit, r, D20);
  if (bam(path.join(r, SO)) !== bs) sai.push('chạy lại cùng ngày mà sổ đổi');
  commitNgay(r, D20, 'ngay 20');
  ghiHoSo(r, { 'y-mo': ['sap-mo', 'Y'] }); commitNgay(r, D21, 'Y mo');
  apGhiOk(kit, r, D21); commitNgay(r, D21, 'ap 21'); apGhiOk(kit, r, D22);
  const so = docSo(r); sai.push(...viPham(so));
  const mong = tran === 2 ? [...mong20, 'ap X 2026-10-21', 'huy Y 2026-10-21', 'ap Z 2026-10-21'] : [...mong20, 'ap X 2026-10-21', 'huy Y 2026-10-21', 'ap Z 2026-10-22'];
  if (!deq(daySo(so), mong)) sai.push(`dãy sổ ${JSON.stringify(daySo(so))}, cần ${JSON.stringify(mong)}`);
  return sai;
}
if (want('AP-2') && await chayCa('AP-2', k => ap2(k, 2))) ok('AP-2', 'ngày 20: tệp không đổi, ba báo trước áp từ 21; chạy lại cùng ngày sổ không đổi; ngày 21: áp X, Z (trần 2), Y có hồ sơ mở → huỷ; ngày 22: không thêm dòng');
if (want('AP-2-tran-1') && await chayCa('AP-2-tran-1', k => ap2(k, 1))) ok('AP-2-tran-1', 'trần 1: ngày 21 áp đúng X (thứ tự hàng), ngày 22 áp Z');
if (want('AP-2-do')) await chayDo('AP-2-do', k => ap2(k, 2), [['scripts/lo-trinh.mjs', 'if (!cho) { baoTruoc(e); continue; }', "if (!cho) { const ket = apMot(data, e, cdI, today); doi = true; soAp += 1; moi.push({ ngay: today, loai: 'ap', ma, de_xuat: e.de_xuat, luat: e.luat, can_cu: e.can_cu, ...ket, lenh_tra_lai: LENH_TRA_LAI(ma) }); baoTruoc(e); continue; }"]], 'áp trước nhịp: X', 'bản sao áp ngay ngày báo trước');
if (want('AP-2-do2')) await chayDo('AP-2-do2', k => ap2(k, 2), [['scripts/lo-trinh.mjs', 'for (const [ma, c] of P.cho) if (!coDeXuat.has(ma)) huy(c);', "for (const [ma, c] of P.cho) if (!coDeXuat.has(ma)) { const ket = apMot(data, c, cdI, today); doi = true; moi.push({ ngay: today, loai: 'ap', ma, de_xuat: c.de_xuat, luat: c.luat, can_cu: c.can_cu, ...ket, lenh_tra_lai: LENH_TRA_LAI(ma) }); }"]], 'áp hàng đã có hồ sơ mở: Y', 'bản sao không kiểm đề xuất còn nguyên');
async function ap2tran(kit) {
  const data = { schema: 1, moc: [TOI({ tran_ap: 2 })], hang: [H('X'), H('W'), H('Z', { slug: 'z-bac' })] };
  const { r } = kho({ hoSo: { 'z-bac': 'da-bac' }, data });
  apGhiOk(kit, r, D20); apGhiOk(kit, r, D21);
  const n = docSo(r).filter(d => d.loai === 'ap' && d.ngay === D21).length;
  return n === 2 ? [] : [`áp ${n}, trần 2`];
}
if (want('AP-2-do3')) await chayDo('AP-2-do3', ap2tran, [['scripts/lo-trinh.mjs', ' || soAp >= cs.tran_ap', '']], 'áp 3, trần 2', 'bản sao bỏ trần');
async function ap2doi(kit) {
  const sai = []; const { r } = kho({ data: { schema: 1, moc: [TOI()], hang: [H('X')] } }); const tep = path.join(r, TEP);
  apGhiOk(kit, r, D20); commitNgay(r, D20, 'ngay 20');
  mkdirSync(path.join(r, '_acceptance', 'x-bac'), { recursive: true }); writeFileSync(path.join(r, '_acceptance', 'x-bac', 'opportunity.md'), oppQuyet('kill', 'X')); commitNgay(r, D21, 'X bac');
  const b = bam(tep); apGhiOk(kit, r, D21);
  if (bam(tep) !== b) sai.push('ngày đề xuất đổi mà tệp đổi');
  for (const d of docSo(r)) if (d.loai === 'ap' && d.ngay === D21) sai.push(`áp đề xuất chưa báo trước: ${d.ma} ${d.de_xuat}`);
  commitNgay(r, D21, 'ap 21'); apGhiOk(kit, r, D22);
  const mong = ['bao-truoc X cho-dieu-kien 2026-10-20', 'huy X cho-dieu-kien 2026-10-21', 'bao-truoc X bac 2026-10-21', 'ap X bac 2026-10-22'];
  if (!deq(dayDx(docSo(r)), mong)) sai.push(`dãy sổ ${JSON.stringify(dayDx(docSo(r)))}, cần ${JSON.stringify(mong)}`);
  const lt = docLT(r); if (!lt.da_bac || lt.da_bac.at(-1).ma !== 'X') sai.push(`X không là mục cuối da_bac: ${JSON.stringify(lt.da_bac)}`);
  return sai;
}
if (want('AP-2-doi') && await chayCa('AP-2-doi', ap2doi)) ok('AP-2-doi', 'đề xuất đổi (chờ điều kiện → bác) giữa nhịp: huỷ cũ + báo trước mới, tệp không đổi ngày 21, áp bác ngày 22');
if (want('AP-2-do4')) await chayDo('AP-2-do4', ap2doi, [['scripts/lo-trinh.mjs', 'if (cho.de_xuat !== e.de_xuat || cho.luat !== e.luat) { huy(cho); baoTruoc(e); continue; }', '']], 'áp đề xuất chưa báo trước: X bac', 'bản sao chỉ so mã khi áp');
if (want('AP-2-ngay-sai') && await chayCa('AP-2-ngay-sai', async kit => {
  const { r } = kho({ data: { schema: 1, moc: [TOI()], hang: [H('X')] } }); const x = apGhi(kit, r, '15/10/2026');
  return x.status === 2 && x.stderr.includes('ACCEPTANCE_TODAY phải dạng YYYY-MM-DD') && !existsSync(path.join(r, SO)) ? [] : [`ngày sai dạng: thoát ${x.status} «${x.stderr.trim()}»`];
})) ok('AP-2-ngay-sai', 'ngày sai dạng → thoát 2 có tên, không sổ');

// ═══ AP-3 (AC-3): ba hành động, đích đúng, không hàng nào biến mất ═════════════════════════════════════════════
const DATA_3 = () => ({ schema: 1,
  moc: [{ ten: 'QuaA', ngay: '2026-09-15', loai: 'phat-hanh', hang: ['M', 'L'] }, { ten: 'Toi', ngay: '2026-10-30', loai: 'phat-hanh', chinh_sach: { tu_ap: true, tuoi_ngay: 30 }, hang: ['K1'] }],
  hang: [H('M'), H('T'), H('L', { trang_thai: 'Xếp lại sau', ly_do: 'lý do cũ' }), H('B', { slug: 'b-bac' }), H('K1')],
  chan_troi: [{ ma: 'H0', cau_giao: '«câu giao H0»', ly_do: 'có sẵn' }] });
const SAU_3 = { schema: 1,
  moc: [{ ten: 'QuaA', ngay: '2026-09-15', loai: 'phat-hanh', hang: [] }, { ten: 'Toi', ngay: '2026-10-30', loai: 'phat-hanh', chinh_sach: { tu_ap: true, tuoi_ngay: 30 }, hang: ['K1', 'M'] }],
  hang: [H('M'), H('K1')],
  chan_troi: [{ ma: 'H0', cau_giao: '«câu giao H0»', ly_do: 'có sẵn' },
    { ma: 'T', cau_giao: '«câu giao T»', ly_do: '50 ngày chưa ai sửa (lần cuối 01/09/2026)', mo_lai_khi: 'chủ kho trả lại, hoặc căn cứ đổi', tu_ap: { ngay: D21 } },
    { ma: 'L', cau_giao: '«câu giao L»', trang_thai: 'Xếp lại sau', ly_do: 'lý do cũ', ly_do_may: 'kế hoạch tự khai «Xếp lại sau»', mo_lai_khi: 'chủ kho trả lại, hoặc căn cứ đổi', tu_ap: { ngay: D21 } }],
  da_bac: [{ ma: 'B', cau_giao: '«câu giao B»', slug: 'b-bac', ly_do: 'hồ sơ b-bac đã bác', tu_ap: { ngay: D21 } }] };
const tapMa = d => new Set(['hang', 'chan_troi', 'da_bac'].flatMap(k => (d[k] || []).map(x => x.ma)));
async function ap3(kit) {
  const sai = []; const { r } = kho({ hoSo: { 'b-bac': 'da-bac' }, data: DATA_3() });
  apGhiOk(kit, r, D20); commitNgay(r, D20, 'ngay 20'); apGhiOk(kit, r, D21);
  const sau = docLT(r); const truoc = tapMa(DATA_3()); const con = tapMa(sau);
  const mat = [...truoc].filter(m => !con.has(m)); if (mat.length) sai.push(`hàng biến mất: ${mat.join(', ')}`);
  const ct = (sau.chan_troi || []).map(x => x.ma); if (ct.slice(-2).join() !== 'T,L') sai.push(`mục máy không ở cuối chan_troi: ${ct.join(', ')}`);
  if (JSON.stringify(sau) !== JSON.stringify(SAU_3)) sai.push(`tệp sau áp khác đối tượng viết sẵn: ${JSON.stringify(sau).slice(0, 300)}`);
  return sai;
}
if (want('AP-3') && await chayCa('AP-3', ap3)) ok('AP-3', 'M cuối hàng của mốc đang chạy, rời mốc cũ; T, L hai mục cuối «chờ điều kiện» (L giữ lý do cũ, câu máy ở ly_do_may); B cuối «đã bác»; tệp BẰNG đối tượng viết sẵn; tập mã không đổi');
if (want('AP-3-do')) await chayDo('AP-3-do', ap3, [['scripts/lo-trinh.mjs', '  data[khoi].push(mucMay(hangGoc, e, ngay, khoi));\n', '']], 'hàng biến mất: T', 'bản sao xoá hàng thay vì chuyển');
if (want('AP-3-do2')) await chayDo('AP-3-do2', ap3, [['scripts/lo-trinh.mjs', 'data[khoi].push(mucMay(', 'data[khoi].unshift(mucMay(']], 'mục máy không ở cuối chan_troi', 'bản sao chèn đầu mảng');
if (want('AP-3-khong-moc') && await chayCa('AP-3-khong-moc', async kit => {
  const sai = []; const { r } = kho({ data: { schema: 1, moc: [{ ten: 'Cu', ngay: '2026-09-15', loai: 'phat-hanh', chinh_sach: { tu_ap: true }, hang: ['Q'] }], hang: [H('Q')] } });
  const b = bam(path.join(r, TEP)); apGhiOk(kit, r, D20); apGhiOk(kit, r, D21);
  if (bam(path.join(r, TEP)) !== b || existsSync(path.join(r, SO))) sai.push('không còn chiến dịch phía trước mà máy vẫn ghi');
  const j = apJson(kit, r, D21)[0];
  if (!(j.canh_bao || []).some(c => c.includes('không có mốc chiến dịch phía trước'))) sai.push(`không cảnh báo: ${JSON.stringify(j)}`);
  return sai;
})) ok('AP-3-khong-moc', 'chiến dịch bật tự áp đã qua, không có chiến dịch phía trước: tệp không đổi, JSON cảnh báo «không có mốc chiến dịch phía trước»');
if (want('AP-3-hai-moc') && await chayCa('AP-3-hai-moc', async kit => {
  const sai = []; const data = { schema: 1, moc: [QUA(['R'], 'QuaA'), QUA(['X0', 'R'], 'QuaB'), TOI()], hang: [H('X0', { trang_thai: 'Đã giao' }), H('R')] };
  const { r } = kho({ data }); const goc = readFileSync(path.join(r, TEP), 'utf8');
  apGhiOk(kit, r, D20); apGhiOk(kit, r, D21);
  const sau = docLT(r);
  if (sau.moc[0].hang.includes('R') || sau.moc[1].hang.includes('R') || sau.moc[2].hang.at(-1) !== 'R') sai.push(`một mã ở hai mốc đã qua: ${JSON.stringify(sau.moc.map(m => m.hang))}`);
  const x = chay(kit, r, D21, ['--tra-lai', 'R', '--write']);
  if (x.status !== 0) sai.push(`trả lại thoát ${x.status}: ${x.stderr}`);
  else if (readFileSync(path.join(r, TEP), 'utf8') !== goc) sai.push('trả lại không khôi phục đủ hai mốc');
  return sai;
})) ok('AP-3-hai-moc', 'mã ở hai mốc đã qua: dời gỡ khỏi cả hai; trả lại khôi phục cả hai, tệp về đúng byte');

// ═══ AP-4 (AC-4): bộ ghi giữ byte ════════════════════════════════════════════════════════════════════════════
// Phép ngược ĐỘC LẬP của ca (không gọi traLai): từ tệp sau áp + dòng `ap` của sổ dựng lại tệp trước, so từng byte.
function nguoc(sau, so) {
  const d = JSON.parse(JSON.stringify(sau));
  for (const a of [...so].reverse().filter(x => x.loai === 'ap')) {
    if (a.dich.khoi === 'moc') { const h = d.moc[a.dich.chi_so].hang; h.splice(h.lastIndexOf(a.ma), 1); }
    else { const ds = d[a.dich.khoi]; ds.splice(ds.findIndex(x => x.ma === a.ma), 1); if (a.tao_khoi && !ds.length) delete d[a.dich.khoi]; d.hang.splice(a.vi_tri.chi_so, 0, a.hang_goc); }
    for (const v of a.vi_tri.moc) d.moc[v.chi_so].hang.splice(v.vt, 0, a.ma);
  }
  return JSON.stringify(d, null, 2) + '\n';
}
const khoaDeQuy = (o, ra = []) => { if (o && typeof o === 'object') { if (!Array.isArray(o)) ra.push(Object.keys(o).join(',')); for (const v of Object.values(o)) khoaDeQuy(v, ra); } return ra; };
async function ap4(kit) {
  const sai = [];
  const data = JSON.parse(git(KIT, 'show', `${GOC}:docs/plans/lo-trinh-kit.json`));
  data._x_goc = 1; data.hang[0].x_la = 'x'; data.moc[0].x_moc = { a: { b: 1 } };
  const ung = data.moc.map((m, i) => ({ m, i })).filter(({ m }) => m.loai === 'phat-hanh' && m.ngay >= D20).sort((a, b) => a.m.ngay.localeCompare(b.m.ngay) || a.i - b.i)[0];
  ung.m.chinh_sach = { tu_ap: true, tran_ap: 1 };
  const { r } = kho({ data }); const goc = readFileSync(path.join(r, TEP), 'utf8');
  apGhiOk(kit, r, D20); apGhiOk(kit, r, D21);
  const sau = readFileSync(path.join(r, TEP), 'utf8'); const so = docSo(r);
  if (!so.some(d => d.loai === 'ap')) return ['không có lần áp nào — ca không đo được gì'];
  if (sau === goc) sai.push('có dòng áp mà tệp không đổi');
  if (sau !== JSON.stringify(JSON.parse(sau), null, 2) + '\n' || !sau.endsWith('}\n') || sau.endsWith('\n\n')) sai.push('byte ngoài phần dời đổi (tệp sau áp không ở dạng chuẩn)');
  if (nguoc(JSON.parse(sau), so) !== goc) sai.push('byte ngoài phần dời đổi');
  const truocK = khoaDeQuy(JSON.parse(goc)); const sauK = khoaDeQuy(JSON.parse(nguoc(JSON.parse(sau), so)));
  if (!deq(truocK, sauK)) sai.push('thứ tự khoá đổi');
  const p = JSON.parse(sau); if (p._x_goc !== 1 || !p.moc[0].x_moc || p.hang.every(h => h.x_la === undefined) && !(p.chan_troi || []).concat(p.da_bac || []).some(h => h.x_la)) sai.push('khoá lạ mất');
  return sai;
}
if (want('AP-4') && await chayCa('AP-4', ap4)) ok('AP-4', 'tệp lộ trình kit + khoá lạ ở gốc, hàng, mốc, object lồng: phép ngược độc lập từ sổ ra đúng từng byte tệp trước; tệp sau ở dạng chuẩn, một dòng cuối; thứ tự khoá và khoá lạ giữ');
if (want('AP-4-do')) await chayDo('AP-4-do', ap4, [['scripts/lo-trinh.mjs', 'writeFileSync(t, JSON.stringify(data, null, 2)', 'writeFileSync(t, JSON.stringify(data, null, 4)']], 'byte ngoài phần dời đổi', 'bản sao ghi thụt 4 dấu cách');
const DATA_4 = () => ({ schema: 1, moc: [TOI()], hang: [H('X')] });
const KHONG_CHUAN = {
  'thut-4': () => JSON.stringify(DATA_4(), null, 4) + '\n',
  'thieu-dong-cuoi': () => JSON.stringify(DATA_4(), null, 2),
  'bom': () => '﻿' + JSON.stringify(DATA_4(), null, 2) + '\n',
  'khoa-so': () => JSON.stringify({ ...DATA_4(), tu_vung: { b: 'Đã giao', 1: 'Đã giao' } }, null, 2).replace('"1": "Đã giao",\n    "b": "Đã giao"', '"b": "Đã giao",\n    "1": "Đã giao"') + '\n',
};
async function ap4TuChoi(kit) {
  const sai = [];
  for (const [ca, tao] of Object.entries(KHONG_CHUAN)) {
    const { r } = kho({ data: DATA_4() }); ghiTep(r, tao()); commitNgay(r, '2026-09-01', ca);
    const p = path.join(r, TEP); const b = bam(p); const mt = statSync(p).mtimeMs;
    const x = apGhi(kit, r, D20);
    if (x.status !== 2 || !x.stderr.includes(`tệp lộ trình không ở dạng chuẩn — máy không ghi: ${TEP}`) || bam(p) !== b || statSync(p).mtimeMs !== mt || existsSync(path.join(r, SO))) sai.push(`ghi đè tệp không chuẩn: ${ca} (thoát ${x.status})`);
  }
  const { r } = kho({ data: DATA_4() }); const x = apGhi(kit, r, D20);
  if (x.status !== 0 || !existsSync(path.join(r, SO))) sai.push(`đối chứng dương: tệp chuẩn mà không áp được (thoát ${x.status})`);
  return sai;
}
if (want('AP-4-tu-choi') && await chayCa('AP-4-tu-choi', ap4TuChoi)) ok('AP-4-tu-choi', 'bốn tệp không chuẩn (thụt 4 · thiếu dòng cuối · BOM · khoá dạng số) → thoát 2 có tên, tệp và sổ không đổi; tệp chuẩn → áp được');
if (want('AP-4-do2')) await chayDo('AP-4-do2', ap4TuChoi, [['scripts/lo-trinh.mjs', 'if (!chuan && ghi) return', 'if (false && !chuan && ghi) return']], 'ghi đè tệp không chuẩn: thut-4', 'bản sao bỏ điều kiện trước');

// ═══ AP-5 (AC-5): sổ tất định, gộp sạch, đứt giữa chừng ════════════════════════════════════════════════════════
const KHOA_AP = ['ngay', 'loai', 'ma', 'de_xuat', 'luat', 'can_cu', 'vi_tri', 'dich', 'hang_goc', 'lenh_tra_lai'];
async function ap5(kit) {
  const sai = []; const { r } = kho({ hoSo: { 'b-bac': 'da-bac' }, data: DATA_3() });
  const hai = ['a', 'b'].map(n => { const c = path.join(TMP, `clone-${n}-${++khoN}`); execFileSync('git', ['clone', '-q', r, c]); git(c, 'config', 'user.email', 'x@y.z'); git(c, 'config', 'user.name', 'Người Thử'); git(c, 'checkout', '-qb', `nhanh-${n}`);
    apGhiOk(kit, c, D20); commitNgay(c, D20, `${n} 20`); apGhiOk(kit, c, D21); commitNgay(c, D21, `${n} 21`); return c; });
  if (bam(path.join(hai[0], TEP)) !== bam(path.join(hai[1], TEP)) || bam(path.join(hai[0], SO)) !== bam(path.join(hai[1], SO))) sai.push('sổ hai máy khác byte');
  for (const d of docSo(hai[0]).filter(x => x.loai === 'ap')) {
    const thieu = KHOA_AP.filter(k => d[k] === undefined); if (thieu.length) sai.push(`dòng ap ${d.ma} thiếu ${thieu.join(', ')}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.ngay)) sai.push(`dòng ap ${d.ma}: ngay «${d.ngay}» không phải YYYY-MM-DD`);
  }
  hai5 = hai;
  return sai;
}
let hai5 = null;
async function ap5gop() {
  if (!hai5) return ['AP-5 chưa dựng hai bản clone'];
  git(hai5[0], 'fetch', '-q', hai5[1], 'nhanh-b');
  const m = spawnSync('git', ['-C', hai5[0], 'merge', '--no-edit', 'FETCH_HEAD'], { encoding: 'utf8' });
  return m.status === 0 && !/CONFLICT/.test(m.stdout + m.stderr) ? [] : [`gộp hai nhánh xung đột: ${m.stdout}${m.stderr}`];
}
if (want('AP-5') && await chayCa('AP-5', ap5)) ok('AP-5', 'hai bản clone áp ngày 20 rồi 21 trên nhánh riêng: tệp và sổ cùng byte; dòng ap đủ khoá, ngày không giờ; gộp nhánh thoát 0 không xung đột');
if (want('AP-5-gop') && await chayCa('AP-5-gop', ap5gop)) ok('AP-5-gop', 'gộp nhánh của bản clone thứ hai vào bản thứ nhất: thoát 0, không đánh dấu xung đột');
if (want('AP-5-do')) await chayDo('AP-5-do', ap5, [['scripts/lo-trinh.mjs', "moi.push({ ngay: today, loai: 'ap', ma,", "moi.push({ ngay: new Date().toISOString(), loai: 'ap', ma,"]], 'sổ hai máy khác byte', 'bản sao ghi giờ vào ngày');
if (want('AP-5-dut') && await chayCa('AP-5-dut', async kit => {
  const sai = []; const { r } = kho({ hoSo: { 'b-bac': 'da-bac' }, data: DATA_3() });
  const c = path.join(TMP, `clone-dut-${++khoN}`); execFileSync('git', ['clone', '-q', r, c]);
  apGhiOk(kit, r, D20); apGhiOk(kit, c, D20);
  const dut = banSao([['scripts/lo-trinh.mjs', 'ghiSo(root, t.tep, moi);\n      if (doi)', 'ghiSo(root, t.tep, moi); process.exit(0);\n      if (doi)']]);
  const b = bam(path.join(r, TEP)); apGhiOk(dut, r, D21);
  if (bam(path.join(r, TEP)) !== b) return ['bản sao đứt mà tệp đã đổi — ca không dựng được tình huống đứt'];
  apGhiOk(kit, r, D21); apGhiOk(kit, c, D21);
  const so = docSo(r); for (const ma of ['M', 'T', 'L', 'B']) { const n = so.filter(d => d.loai === 'ap' && d.ma === ma).length; if (n !== 1) sai.push(`${ma}: ${n} dòng ap sau khi chạy lại`); }
  if (bam(path.join(r, TEP)) !== bam(path.join(c, TEP))) sai.push('tệp sau khi chạy lại khác lần chạy không đứt');
  return sai;
})) ok('AP-5-dut', 'đứt sau khi ghi sổ, trước khi ghi tệp: chạy lại cùng ngày đổi tệp đúng một lần, mỗi mã một dòng ap, tệp bằng lần chạy không đứt');
if (want('AP-5-so-hong') && await chayCa('AP-5-so-hong', async kit => {
  const sai = []; const { r } = kho({ data: { schema: 1, moc: [TOI()], hang: [H('X')] } });
  apGhiOk(kit, r, D20); writeFileSync(path.join(r, SO), readFileSync(path.join(r, SO), 'utf8') + '{bad\n');
  const j = apJson(kit, r, D21)[0];
  if (!(j.canh_bao || []).some(c => c.includes('sổ tự áp có 1 dòng không đọc được'))) sai.push(`không cảnh báo sổ hỏng: ${JSON.stringify(j)}`);
  const b = bam(path.join(r, TEP)); const bs = bam(path.join(r, SO)); apGhiOk(kit, r, D21);
  if (bam(path.join(r, TEP)) !== b || bam(path.join(r, SO)) !== bs) sai.push('sổ hỏng mà máy vẫn ghi');
  return sai;
})) ok('AP-5-so-hong', 'sổ có một dòng hỏng: JSON cảnh báo, máy không ghi gì vào tệp đó');

// S4-r1 (finding trong hợp đồng, AC-3/AC-5): hàng không còn trong danh sách việc hay không có mã thì máy không đụng tệp;
// nhánh khôi phục chỉ làm lại khi tệp còn đúng byte trước lần ghi (người sửa sau khi ghi thì máy không đè).
const DATA_XT = () => ({ schema: 1, moc: [TOI({ tuoi_ngay: 30, tran_ap: 1 })], hang: [H('A'), H('B'), H('C')] });
async function ap5XoaTay(kit) {
  const sai = []; const { r } = kho({ data: DATA_XT() });
  apGhiOk(kit, r, D20); apGhiOk(kit, r, D21);
  const d = docLT(r); const ap = docSo(r).find(x => x.loai === 'ap'); if (!ap) return ['không có lần áp nào — ca không đo được gì'];
  d.chan_troi = d.chan_troi.filter(x => x.ma !== ap.ma); ghiTep(r, d);
  const truoc = readFileSync(path.join(r, TEP), 'utf8'); const nAp = docSo(r).filter(x => x.loai === 'ap').length;
  apGhiOk(kit, r, D21);
  const sau = docLT(r);
  const mat = ['B', 'C', 'A'].filter(m => m !== ap.ma && !tapMa(sau).has(m)); if (mat.length) sai.push(`hàng biến mất: ${mat.join(', ')}`);
  if ((sau.chan_troi || []).some(x => x.ma === undefined)) sai.push('mục không mã trong chan_troi');
  if (readFileSync(path.join(r, TEP), 'utf8') !== truoc) sai.push(`máy làm lại lần áp đè lên sửa tay: tệp đổi sau khi người xoá mục ${ap.ma}`);
  if (docSo(r).filter(x => x.loai === 'ap').length !== nAp) sai.push('thêm dòng ap khi chạy lại cùng ngày');
  return sai;
}
if (want('AP-5-xoa-tay') && await chayCa('AP-5-xoa-tay', ap5XoaTay)) ok('AP-5-xoa-tay', 'người xoá mục máy vừa chuyển rồi chạy lại cùng ngày: không hàng nào biến mất, không mục rỗng mã, máy không làm lại lần áp');
if (want('AP-5-xoa-tay-do')) await chayDo('AP-5-xoa-tay-do', ap5XoaTay, [['scripts/lo-trinh.mjs', 'd.tep_truoc === bamGoc && ', ''], ['scripts/lo-trinh.mjs', '  if (idx < 0) return null;\n', '']], 'hàng biến mất', 'bản sao bỏ cả kiểm băm lẫn kiểm vị trí hàng (như trước S4-r1)');
async function ap5DuaVe(kit) {
  const { r } = kho({ data: DATA_XT() });
  apGhiOk(kit, r, D20); apGhiOk(kit, r, D21);
  const ap = docSo(r).find(x => x.loai === 'ap'); const d = docLT(r); const muc = d.chan_troi.find(x => x.ma === ap.ma);
  d.chan_troi = d.chan_troi.filter(x => x !== muc); d.hang.push(ap.hang_goc); ghiTep(r, d);
  const truoc = readFileSync(path.join(r, TEP), 'utf8'); apGhiOk(kit, r, D21);
  return readFileSync(path.join(r, TEP), 'utf8') === truoc ? [] : [`người đưa ${ap.ma} về danh sách việc cùng ngày mà máy dời lại`];
}
if (want('AP-5-dua-ve') && await chayCa('AP-5-dua-ve', ap5DuaVe)) ok('AP-5-dua-ve', 'người tự đưa hàng vừa bị dời về danh sách việc trong cùng ngày: máy không dời lại');
if (want('AP-5-dua-ve-do')) await chayDo('AP-5-dua-ve-do', ap5DuaVe, [['scripts/lo-trinh.mjs', 'd.tep_truoc === bamGoc && ', '']], 'mà máy dời lại', 'bản sao làm lại lần áp bất kể tệp đã đổi');
if (want('AP-3-khong-ma') && await chayCa('AP-3-khong-ma', async kit => {
  const sai = []; const data = { schema: 1, moc: [TOI({ tuoi_ngay: undefined, tran_ke_tiep: 0 })], hang: [H('B'), { cau_giao: '«việc chưa có mã»' }, H('C')] };
  const { r } = kho({ data }); apGhiOk(kit, r, D20); apGhiOk(kit, r, D21);
  const sau = docLT(r);
  if (!sau.hang.some(h => h.ma === undefined)) sai.push('hàng không mã biến mất');
  if ((sau.chan_troi || []).some(x => x.ma === undefined)) sai.push('mục không mã trong chan_troi');
  const con = [...tapMa(sau)].filter(Boolean).sort().join(); if (con !== 'B,C') sai.push(`hàng biến mất: tập mã còn ${con}`);
  if (!(apJson(kit, r, D21)[0].canh_bao || []).some(c => c.includes('không có mã trong danh sách việc'))) sai.push('không cảnh báo hàng không mã');
  return sai;
})) ok('AP-3-khong-ma', 'hàng không có mã mà luật trần đề xuất: máy không áp, cảnh báo; các hàng khác dời đúng, không mục rỗng mã');

// ═══ AP-6 (AC-6): trả lại · ghim · bỏ ghim ══════════════════════════════════════════════════════════════════
const DATA_6 = () => ({ schema: 1, moc: [QUA(['M']), { ...TOI(), hang: ['K1'] }], hang: [H('M'), H('T'), H('K1')] }); // K1 ở mốc đang chạy: không đề xuất
const lenhNg = (kit, r, today, lenh, ma) => chay(kit, r, today, [`--${lenh}`, ma, '--write']);
async function ap6(kit) {
  const sai = []; const { r } = kho({ data: DATA_6() }); const p = path.join(r, TEP); const goc = bam(p);
  apGhiOk(kit, r, D20); commitNgay(r, D20, '20'); apGhiOk(kit, r, D21); commitNgay(r, D21, '21');
  if (bam(p) === goc) return ['không có lần áp nào — ca không đo được gì'];
  for (const ma of ['T', 'M']) { const x = lenhNg(kit, r, D21, 'tra-lai', ma); if (x.status !== 0) sai.push(`trả lại ${ma} thoát ${x.status}: ${x.stderr}`); }
  commitNgay(r, D21, 'tra lai');
  if (bam(p) !== goc) sai.push('trả lại T và M mà tệp không về đúng byte trước lần áp');
  const n0 = docSo(r).length; apGhiOk(kit, r, D22); commitNgay(r, D22, '22');
  for (const d of docSo(r).slice(n0)) if (d.loai === 'bao-truoc' && ['T', 'M'].includes(d.ma)) sai.push(`máy báo trước lại đề xuất vừa trả: ${d.ma} ${d.luat}`);
  const tl = docSo(r).filter(d => d.loai === 'tra-lai');
  if (tl.length !== 2 || tl.some(d => d.boi !== 'Người Thử')) sai.push(`dòng tra-lai: ${JSON.stringify(tl)}`);
  return sai;
}
if (want('AP-6') && await chayCa('AP-6', ap6)) ok('AP-6', 'trả lại T và M: tệp về đúng byte trước lần áp; ngày kế không báo trước lại đề xuất vừa trả; dòng tra-lai mang tên người');
if (want('AP-6-do')) await chayDo('AP-6-do', ap6, [['scripts/lo-trinh.mjs', '      if (!cho && tl && tl.de_xuat === e.de_xuat && tl.luat === e.luat) continue;\n', '']], 'máy báo trước lại đề xuất vừa trả: M moc-qua-ngay', 'bản sao bỏ luật chặn đề xuất vừa trả');
if (want('AP-6-doi') && await chayCa('AP-6-doi', async kit => {
  const { r } = kho({ data: DATA_6() });
  apGhiOk(kit, r, D20); commitNgay(r, D20, '20'); apGhiOk(kit, r, D21); commitNgay(r, D21, '21');
  lenhNg(kit, r, D21, 'tra-lai', 'T'); commitNgay(r, D21, 'tra');
  mkdirSync(path.join(r, '_acceptance', 't-bac'), { recursive: true }); writeFileSync(path.join(r, '_acceptance', 't-bac', 'opportunity.md'), oppQuyet('kill', 'T')); commitNgay(r, D22, 'T bac');
  const n0 = docSo(r).length; apGhiOk(kit, r, D22);
  const moi = docSo(r).slice(n0).filter(d => d.loai === 'bao-truoc' && d.ma === 'T');
  return moi.length === 1 && moi[0].de_xuat === 'bac' ? [] : [`đề xuất đổi sau khi trả lại mà không báo trước mới: ${JSON.stringify(moi)}`];
})) ok('AP-6-doi', 'trả lại T (chờ điều kiện), sau đó hồ sơ T bị bác → báo trước mới «bác»');
async function ap6ghim(kit) {
  const sai = []; const LTm = await import(pathToFileURL(LT(kit)).href + `?g=${++napN}`);
  const { r } = kho({ data: DATA_6() }); const p = path.join(r, TEP);
  apGhiOk(kit, r, D20); commitNgay(r, D20, '20'); apGhiOk(kit, r, D21); commitNgay(r, D21, '21');
  lenhNg(kit, r, D21, 'tra-lai', 'M'); commitNgay(r, D21, 'tra M');
  const tuoi = () => { const t = LTm.tuoiHang(r, TEP).theoMa; return JSON.stringify(['M', 'T'].map(m => t.get(m))); };
  const b = bam(p); const t0 = tuoi();
  const g = lenhNg(kit, r, D22, 'ghim', 'M'); if (g.status !== 0) sai.push(`ghim thoát ${g.status}: ${g.stderr}`);
  commitNgay(r, D22, 'ghim M');
  if (bam(p) !== b) sai.push('lệnh ghim đổi tệp lộ trình');
  if (tuoi() !== t0) sai.push(`ghim đặt lại tuổi hàng: ${t0} → ${tuoi()}`);
  const n0 = docSo(r).length; apGhiOk(kit, r, D23); apGhiOk(kit, r, D24);
  if (docSo(r).slice(n0).some(d => d.ma === 'M')) sai.push('hàng ghim vẫn có dòng tự áp');
  const bg = lenhNg(kit, r, D24, 'bo-ghim', 'M'); if (bg.status !== 0) sai.push(`bỏ ghim thoát ${bg.status}`);
  const n1 = docSo(r).length; apGhiOk(kit, r, D24);
  if (docSo(r).slice(n1).some(d => d.ma === 'M' && d.loai === 'bao-truoc')) sai.push('bỏ ghim mà máy báo trước lại đúng đề xuất vừa trả');
  // (e) ghim một hàng đang có báo trước chờ → đúng một dòng huỷ.
  const k2 = kho({ data: { schema: 1, moc: [TOI()], hang: [H('X')] } }).r;
  apGhiOk(kit, k2, D20); lenhNg(kit, k2, D20, 'ghim', 'X'); apGhiOk(kit, k2, D20);
  const hx = docSo(k2).filter(d => d.loai === 'huy' && d.ma === 'X').length; if (hx !== 1) sai.push(`ghim hàng đang báo trước: ${hx} dòng huỷ`);
  const gb = docSo(r).filter(d => ['ghim', 'bo-ghim'].includes(d.loai)); if (gb.length !== 2 || gb.some(d => d.boi !== 'Người Thử')) sai.push(`dòng ghim/bỏ ghim: ${JSON.stringify(gb)}`);
  return sai;
}
if (want('AP-6-ghim') && await chayCa('AP-6-ghim', ap6ghim)) ok('AP-6-ghim', 'ghim chỉ ghi sổ: tệp không đổi, tuổi hàng không đổi, không dòng tự áp nào cho hàng ghim; bỏ ghim không mở lại đề xuất vừa trả; ghim hàng đang báo trước → một dòng huỷ');
if (want('AP-6-do2')) await chayDo('AP-6-do2', ap6ghim, [['scripts/lo-trinh.mjs', "  ghiSo(root, tep, [{ ngay: today, loai: bo ? 'bo-ghim' : 'ghim', ma, boi }]);\n", "  ghiSo(root, tep, [{ ngay: today, loai: bo ? 'bo-ghim' : 'ghim', ma, boi }]);\n  { const p = path.join(root, tep); const d = JSON.parse(readFileSync(p, 'utf8')); for (const h of d.hang) if (h.ma === ma) h.ghim = { ngay: today }; ghiLoTrinh(p, d); }\n"]], 'lệnh ghim đổi tệp lộ trình', 'bản sao ghi khoá ghim lên hàng');
if (want('AP-6-tu-choi') && await chayCa('AP-6-tu-choi', async kit => {
  const sai = []; const { r } = kho({ data: DATA_6() }); const p = path.join(r, TEP);
  apGhiOk(kit, r, D20); commitNgay(r, D20, '20'); apGhiOk(kit, r, D21);
  const x1 = lenhNg(kit, r, D21, 'tra-lai', 'K1');
  if (x1.status !== 2 || !x1.stderr.includes('không có lần áp nào của K1 để trả lại')) sai.push(`trả lại mã chưa áp: thoát ${x1.status} «${x1.stderr.trim()}»`);
  const d = docLT(r); d.chan_troi.find(x => x.ma === 'T').ly_do = 'người sửa tay'; ghiTep(r, d); const b = bam(p);
  const x2 = lenhNg(kit, r, D21, 'tra-lai', 'T');
  if (x2.status !== 2 || !x2.stderr.includes('hàng đã đổi sau khi máy áp — trả lại bằng tay') || bam(p) !== b) sai.push(`trả lại mục đã sửa tay: thoát ${x2.status} «${x2.stderr.trim()}»`);
  return sai;
})) ok('AP-6-tu-choi', 'trả lại mã chưa từng áp → thoát 2 có tên; mục máy chuyển đã bị sửa tay → thoát 2 «hàng đã đổi sau khi máy áp», tệp không đổi');

// ═══ AP-7 (AC-7): ba lệnh khoá — CỘNG chủ kho duyệt ở Cổng Phạm vi ═════════════════════════════════════════════
const khoiP32 = goc => { const t = readFileSync(path.join(goc, 'tests', 'plugins', 'run-tests.sh'), 'utf8'); const i = t.indexOf('run "P32 ');
  const j = t.indexOf("<<'PY'\n", i); const k = t.indexOf('\nPY\n', j); if (i < 0 || j < 0 || k < 0) throw new Error('không rút được khối P32'); return t.slice(j + 7, k + 1); };
const chayP32 = goc => spawnSync('python3', ['-', goc], { input: khoiP32(KIT), encoding: 'utf8' });
const tenTrong = (txt, bien) => { const m = txt.match(new RegExp(`${bien} = \\[([^\\]]*)\\]`)); return m ? [...m[1].matchAll(/"([a-z-]+)"/g)].map(x => x[1]) : null; };
const fm = t => t.split('\n---')[0];
const LENH_KHOA = { ghim: 'RM-GHIM-LENH', 'bo-ghim': 'RM-BO-GHIM-LENH', 'tra-lai': 'RM-TRA-LAI-LENH' };
if (want('AP-7') && await chayCa('AP-7', async kit => {
  const sai = [];
  for (const n of Object.keys(LENH_KHOA)) if (!/^disable-model-invocation: true$/m.test(fm(readFileSync(path.join(kit, 'road-map', 'commands', `${n}.md`), 'utf8')))) sai.push(`${n}.md không khoá`);
  if (/disable-model-invocation/.test(fm(readFileSync(path.join(kit, 'road-map', 'commands', 'xem.md'), 'utf8')))) sai.push('xem.md bị khoá');
  const k = khoiP32(kit); const rm = tenTrong(k, 'LOCKED_ROAD_MAP'); const lk = tenTrong(k, 'LOCKED');
  if (!deq(rm, ['ghim', 'bo-ghim', 'tra-lai'])) sai.push(`LOCKED_ROAD_MAP = ${JSON.stringify(rm)}`);
  if (!k.includes('"road-map" / "commands"')) sai.push('P32 không đọc road-map/commands');
  const lkGoc = tenTrong(git(KIT, 'show', `${GOC}:tests/plugins/run-tests.sh`), 'LOCKED');
  if (!lkGoc || lkGoc.length !== 7 || !deq(lk, lkGoc)) sai.push(`LOCKED của acceptance-gate đổi: ${JSON.stringify(lk)} ≠ ${JSON.stringify(lkGoc)}`);
  const adr = readFileSync(path.join(kit, 'docs', 'adr', '0002-human-gate-invocation-lock.md'), 'utf8');
  for (const n of Object.keys(LENH_KHOA)) if (!adr.includes(`\`${n}\``)) sai.push(`ADR 0002 thiếu ${n}`);
  return sai;
})) ok('AP-7', 'ba lệnh ghim/bo-ghim/tra-lai khoá, xem mở; P32 có LOCKED_ROAD_MAP đọc road-map/commands; LOCKED bảy tên như bộ máy gốc; ADR 0002 nêu ba tên');
if (want('AP-7-lenh') && await chayCa('AP-7-lenh', async kit => {
  const sai = [];
  const dung = () => { const { r } = kho({ data: DATA_6() }); apGhiOk(kit, r, D20); apGhiOk(kit, r, D21); return r; };
  for (const [n, khoi] of Object.entries(LENH_KHOA)) {
    const t = readFileSync(path.join(kit, 'road-map', 'commands', `${n}.md`), 'utf8');
    const m = t.match(new RegExp(`<!-- <<<${khoi} -->\\n\`\`\`\\n([\\s\\S]*?)\\n\`\`\`\\n<!-- ${khoi}>>> -->`)); if (!m) { sai.push(`${n}: không rút được khối ${khoi}`); continue; }
    const ma = n === 'tra-lai' ? 'T' : 'M';
    const a = dung(); const b = dung();
    if (n === 'bo-ghim') for (const r of [a, b]) chay(kit, r, D21, ['--ghim', ma, '--write']);
    const x = spawnSync('bash', ['-c', m[1].replace("'<mã>'", `'${ma}'`)], { cwd: a, encoding: 'utf8', env: { ...process.env, AG: kit, ACCEPTANCE_TODAY: D21 } });
    const y = chay(kit, b, D21, [`--${n}`, ma, '--write']);
    if (x.status !== 0 || y.status !== 0) { sai.push(`${n}: lệnh thoát ${x.status}/${y.status} ${x.stderr}`); continue; }
    if (bam(path.join(a, TEP)) !== bam(path.join(b, TEP)) || bam(path.join(a, SO)) !== bam(path.join(b, SO))) sai.push(`${n}: dòng lệnh của tệp lệnh ra khác lời gọi thẳng`);
  }
  return sai;
})) ok('AP-7-lenh', 'dòng lệnh rút từ ba tệp lệnh (kho không có bản chép → $AG) ra cùng tệp + sổ như gọi thẳng');
async function ap7do(kit) { const x = chayP32(kit); return x.status === 0 ? [] : [`P32 đỏ: ${(x.stderr || '').trim().split('\n').pop()}`]; }
if (want('AP-7-do')) await chayDo('AP-7-do', ap7do, [['road-map/commands/ghim.md', 'disable-model-invocation: true\n', '']], 'road-map/commands/ghim.md', 'bản sao gỡ khoá ghim.md');
if (want('AP-7-do2')) await chayDo('AP-7-do2', ap7do, [['road-map/commands/xem.md', 'argument-hint: (không đối số)\n', 'argument-hint: (không đối số)\ndisable-model-invocation: true\n']], 'xem.md', 'bản sao khoá xem.md');

// ═══ AP-8 (AC-8): lệnh xem thành bản đồ + RM1 Ngoài-3 ══════════════════════════════════════════════════════════
const xemLenh = kit => { const t = readFileSync(path.join(kit, 'road-map', 'commands', 'xem.md'), 'utf8');
  const m = t.match(/<!-- <<<RM-XEM-LENH -->\n```\n([^\n]+)\n```\n<!-- RM-XEM-LENH>>> -->/); if (!m) throw new Error('xem.md thiếu khối RM-XEM-LENH'); return m[1]; };
const chayXem = (kit, r, today) => spawnSync('bash', ['-c', xemLenh(kit)], { cwd: r, encoding: 'utf8', env: { ...process.env, AG: kit, ACCEPTANCE_TODAY: today } });
function kho8(kit) {
  const data = { schema: 1, moc: [QUA(['M1', 'M2']), { ...TOI(), hang: ['K1'] }],
    hang: [H('G1', { slug: 'g1' }), H('G2', { slug: 'g2' }), H('G3', { slug: 'g3' }), H('D1', { slug: 'd1' }), H('D2', { slug: 'd2' }), H('M1'), H('M2'), H('T1'), H('K1'), H('B1', { slug: 'b1-bac' })] };
  const { r } = kho({ hoSo: { g1: 'da-ship', g2: 'da-ship', g3: 'da-ship', d1: 'dang-dung', d2: 'dang-dung' }, data });
  apGhiOk(kit, r, D20); chay(kit, r, D20, ['--ghim', 'T1', '--write']); apGhiOk(kit, r, D20); commitNgay(r, D20, '20');
  ghiHoSo(r, { 'b1-bac': 'da-bac' }); commitNgay(r, D21, 'B1 bac');
  apGhiOk(kit, r, D21); chay(kit, r, D21, ['--tra-lai', 'M2', '--write']); commitNgay(r, D21, '21');
  return r;
}
const MONG_8 = [
  'Xong 3 · Đang dở 2 · Kế 4',
  'Đang dở:',
  '  · D1 — câu giao D1 (Đang làm)',
  '  · D2 — câu giao D2 (Đang làm)',
  'Kế: M1 — câu giao M1',
  '  · M2 — câu giao M2',
  '  · T1 — câu giao T1',
  '  · K1 — câu giao K1',
  'Rà soát: 3 đề xuất — 1 dời mốc · 1 chờ điều kiện · 1 bác',
  '  · M2 — dời mốc: mốc «Qua» đã qua ngày 15/09/2026',
  '  · T1 — chờ điều kiện: 50 ngày chưa ai sửa (lần cuối 01/09/2026) (ghim — máy không tự áp)',
  '  · B1 — bác: hồ sơ b1-bac đã bác',
  'Tự áp — chiến dịch Toi 30/10: tuổi 30 · trần kế tiếp — · nhịp 1 ngày · trần áp 5/ngày',
  '  · B1 — sẽ bác từ 22/10/2026: hồ sơ b1-bac đã bác',
  '  · M1 — đã dời mốc 21/10/2026 — trả lại: /road-map:tra-lai M1',
];
const GM_BO = await import(pathToFileURL(path.join(HERE, 'lo-trinh-gio-may-bo.mjs')).href);
async function ap8(kit) {
  const sai = []; const r = kho8(kit); const x = chayXem(kit, r, D21);
  if (x.status !== 0) return [`lệnh xem thoát ${x.status}: ${x.stderr}`];
  // Giờ máy (hồ sơ lo-trinh-gio-may): khối «Giờ máy theo mốc» hiện mặc định — so phần còn lại; đối chứng là khối có mặt.
  const tho = x.stdout.split('\n').filter(Boolean); if (!tho.includes('Giờ máy theo mốc:')) sai.push('đối chứng: bản đồ thiếu khối giờ máy');
  const dong = GM_BO.boGioMayXem(tho);
  if (!deq(dong, MONG_8)) sai.push(`bản đồ khác khối viết sẵn: ${JSON.stringify(dong)}`);
  const ghi = trangThaiSach(r); if (ghi) sai.push(`lệnh xem ghi tệp: ${ghi.split('\n').map(l => l.slice(3)).join(', ')}`);
  return sai;
}
if (want('AP-8') && await chayCa('AP-8', ap8, KIT_TAT())) ok('AP-8', 'dòng lệnh rút từ xem.md in đúng khối viết sẵn: đếm · đang dở · kế · rà soát (hàng ghim có hậu tố) · tự áp (báo trước, đã áp kèm lệnh trả lại, chính sách); thoát 0, không ghi tệp');
if (want('AP-8-do')) await chayDoTat('AP-8-do', ap8, [['scripts/lo-trinh.mjs', '  return ra;\n}\n\n// Trả lại MỘT lần áp', "  writeFileSync(path.join(root, '_xem.tmp'), 'x');\n  return ra;\n}\n\n// Trả lại MỘT lần áp"]], 'lệnh xem ghi tệp: _xem.tmp', 'bản sao để lệnh xem ghi tệp');
if (want('AP-8-khong-bat') && await chayCa('AP-8-khong-bat', async kit => {
  const { r } = kho({ phienBan: [{ ngay: '2026-09-05', data: KHONG_BAT['khong-chinh-sach'] }] });
  const x = chayXem(kit, r, HN1); const sai = [];
  if (x.status !== 0 || !x.stdout.includes('Rà soát:')) sai.push(`lệnh xem thoát ${x.status}`);
  if (x.stdout.includes('Tự áp')) sai.push('kho không bật mà có khối Tự áp');
  const a = chay(kit, r, HN1, ['--ra-soat']); const b = chay(banGoc(), r, HN1, ['--ra-soat']);
  if (!b.stdout || chuanKit(a.stdout, kit) !== chuanKit(b.stdout, banGoc())) sai.push('--ra-soat khác bộ máy gốc');
  return sai;
})) ok('AP-8-khong-bat', 'kho không bật: bản đồ không có khối Tự áp; --ra-soat giống từng byte bộ máy gốc');
const CANH_CHUA = 'không đọc được tuổi hàng — luật tuổi không chạy (tệp lộ trình chưa từng commit)';
async function ap8chua(kit) {
  const sai = []; const { r } = kho({ chuaCommit: true, data: { schema: 1, chinh_sach: { tuoi_ngay: 30 }, hang: [H('K')] } });
  const j = rsJson(kit, r, HN1)[0];
  if (!(j.canh_bao || []).includes(CANH_CHUA)) sai.push(`tệp chưa commit mà không cảnh báo: ${JSON.stringify(j)}`);
  const n1 = chayXem(kit, r, HN1).stdout.split('\n').filter(l => l.includes(CANH_CHUA)).length;
  const n2 = quet(kit, r, HN1).split('\n').filter(l => l.includes(CANH_CHUA)).length;
  if (n1 !== 1 || n2 !== 1) sai.push(`tệp chưa commit mà không cảnh báo đúng một dòng: xem ${n1} · thẻ ${n2}`);
  return sai;
}
if (want('AP-8-chua-commit') && await chayCa('AP-8-chua-commit', ap8chua)) ok('AP-8-chua-commit', 'tệp lộ trình chưa từng commit: JSON, lệnh xem và thẻ khởi động cảnh báo đúng một dòng (RM1 Ngoài-3)');
if (want('AP-8-do2')) await chayDo('AP-8-do2', ap8chua, [['scripts/lo-trinh.mjs', "  if (!soCommit && existsSync(path.join(root, tep))) return { cut, theoMa, hong: 'tệp lộ trình chưa từng commit' };\n", '']], 'tệp chưa commit mà không cảnh báo', 'bản sao bỏ cảnh báo tệp chưa commit');

// ═══ AP-9 (AC-9): thẻ khởi động — dòng «Tự áp» ═══════════════════════════════════════════════════════════════
const theDong = (kit, r, today) => JSON.parse(quet(kit, r, today)).loTrinh.dong;
if (want('AP-9') && await chayCa('AP-9', async kit => {
  const sai = []; const { r } = kho({ data: { schema: 1, moc: [QUA(['M1']), TOI({ tran_ap: 1 })], hang: [H('M1'), H('T1'), H('X2')] } });
  apGhiOk(kit, r, D20); commitNgay(r, D20, '20'); apGhiOk(kit, r, D21); commitNgay(r, D21, '21');
  const dong = theDong(kit, r, D21);
  const MONG = ['Tự áp: 2 báo trước (áp từ 21/10/2026) · 1 đã áp 7 ngày qua',
    '  · T1 — sẽ chờ điều kiện từ 21/10/2026: 49 ngày chưa ai sửa (lần cuối 01/09/2026)', // căn cứ chụp lúc báo trước (20/10)
    '  · X2 — sẽ chờ điều kiện từ 21/10/2026: 49 ngày chưa ai sửa (lần cuối 01/09/2026)', // căn cứ chụp lúc báo trước (20/10)
    '  · M1 — đã dời mốc 21/10/2026 — trả lại: /road-map:tra-lai M1'];
  const i = dong.findIndex(d => d.startsWith('Rà soát:')); const j = dong.indexOf(MONG[0]);
  if (j < 0) return [`thiếu dòng tổng tự áp: ${JSON.stringify(dong)}`];
  if (!deq(dong.slice(j, j + 4), MONG)) sai.push(`dòng tự áp khác viết sẵn: ${JSON.stringify(dong.slice(j, j + 4))}`);
  if (i < 0 || j !== i + 3) sai.push(`dòng tự áp không đứng ngay sau khối rà soát (rà soát ở ${i}, tự áp ở ${j})`);
  if (dong.filter(d => d.startsWith('Tự áp:')).length !== 1) sai.push('dòng tổng tự áp không duy nhất');
  if (trangThaiSach(r)) sai.push(`thẻ khởi động ghi tệp: ${trangThaiSach(r)}`);
  return sai;
}, KIT_TAT())) ok('AP-9', 'thẻ khởi động: đúng một dòng «Tự áp: 2 báo trước (áp từ 21/10/2026) · 1 đã áp 7 ngày qua» + ba dòng chi tiết, ngay sau khối rà soát; không ghi tệp');
const KHO_9 = {
  'khong-khai': () => kho({ cfg: null, data: { schema: 1, hang: [H('A')] } }).r,
  'khong-moc': () => kho({ data: { schema: 1, hang: [H('A'), H('B')] } }).r,
  'moc-chua-toi': () => kho({ data: { schema: 1, moc: [{ ten: 'Toi', ngay: '2026-11-30', loai: 'phat-hanh', hang: ['A'] }], hang: [H('A'), H('B')] } }).r,
};
async function ap9byte(kit) {
  const sai = [];
  for (const [ten, tao] of Object.entries(KHO_9)) {
    const r = tao(); let a; let b;
    try { a = quet(kit, r, D20); b = quet(banGoc(), r, D20); } catch (e) { sai.push(`đối chứng gốc không chạy: ${ten} ${loi(e)}`); continue; }
    if (!a || !b) { sai.push(`đối chứng gốc không chạy: ${ten}`); continue; }
    if (chuanKit(a, kit) !== chuanKit(b, banGoc())) sai.push(`thẻ khác bộ máy gốc: ${ten}`);
  }
  return sai;
}
if (want('AP-9-byte') && await chayCa('AP-9-byte', ap9byte, KIT_TAT())) ok('AP-9-byte', 'ba kho không bật, không đề xuất: thẻ khởi động giống từng byte bộ máy gốc');
if (want('AP-9-do')) await chayDoTat('AP-9-do', ap9byte, [['scripts/lo-trinh.mjs', '    if (!t.tuAp) return t.nhacChinhSach ?', '    if (!t.tuAp) t.tuAp = { bao_truoc: [], da_ap: [] };\n    if (!t.tuAp) return t.nhacChinhSach ?']], 'thẻ khác bộ máy gốc: khong-moc', 'bản sao in dòng tổng không điều kiện');
if (want('AP-9-nhac') && await chayCa('AP-9-nhac', async kit => {
  const sai = []; const NHAC = '  ! chiến dịch Toi 30/10 chưa khai chính sách tự áp — chỉ cờ';
  const co = kho({ data: { schema: 1, moc: [QUA(['M1']), { ten: 'Toi', ngay: '2026-10-30', loai: 'phat-hanh', hang: [] }], hang: [H('M1')] } }).r;
  const khong = kho({ data: { schema: 1, moc: [{ ten: 'Toi', ngay: '2026-10-30', loai: 'phat-hanh', hang: ['M1'] }], hang: [H('M1')] } }).r;
  const n1 = theDong(kit, co, D20).filter(d => d === NHAC).length; const n2 = theDong(kit, khong, D20).filter(d => d.includes('chưa khai chính sách tự áp')).length;
  if (n1 !== 1) sai.push(`có đề xuất mà ${n1} dòng nhắc`); if (n2 !== 0) sai.push(`không đề xuất mà ${n2} dòng nhắc`);
  return sai;
})) ok('AP-9-nhac', 'chiến dịch đang chạy chưa khai tu_ap: có đề xuất → đúng một dòng nhắc; không đề xuất → không dòng nào');

// ═══ AP-10 (AC-10): mở việc thì tự áp + thước dời tay trừ theo sổ ══════════════════════════════════════════════
const moO = (kit, r, today, ma) => chay(kit, r, today, ['--hang', ma, '--mo-o', '--owner', 'x@y.z']);
async function ap10(kit) {
  const sai = []; const { r } = kho({ data: { schema: 1, moc: [TOI()], hang: [H('X'), H('H')] } });
  apGhiOk(kit, r, D20); commitNgay(r, D20, '20');
  const x = moO(kit, r, D21, 'H'); if (x.status !== 0) return [`--mo-o thoát ${x.status}: ${x.stderr}`];
  const j = JSON.parse(x.stdout);
  if (!deq(j.ap, { bao_truoc: 0, da_ap: 1, huy: 1 })) sai.push(`khoá ap ${JSON.stringify(j.ap)}, cần {bao_truoc:0, da_ap:1, huy:1}`);
  const so = docSo(r);
  if (so.some(d => d.loai === 'ap' && d.ma === 'H')) sai.push('áp hàng đang mở: H');
  if (so.filter(d => d.loai === 'huy' && d.ma === 'H').length !== 1) sai.push('hàng đang mở không có đúng một dòng huỷ');
  const lt = docLT(r); if (!lt.hang.some(h => h.ma === 'H') || (lt.chan_troi || []).at(-1)?.ma !== 'X') sai.push(`tệp sau mở việc: ${JSON.stringify(lt)}`);
  if (!existsSync(path.join(r, '_acceptance', j.hoSo, 'opportunity.md'))) sai.push('ô cơ hội của H không được tạo');
  return sai;
}
if (want('AP-10') && await chayCa('AP-10', ap10)) ok('AP-10', 'mở việc H: áp X trước khi mở ô, H giữ chỗ cũ + một dòng huỷ, JSON mang ap {0,1,1}, ô cơ hội được tạo');
if (want('AP-10-do')) await chayDo('AP-10-do', ap10, [['scripts/lo-trinh.mjs', 'ghi: true, hangMo: ma })[0];', 'ghi: true, hangMo: null })[0];']], 'áp hàng đang mở: H', 'bản sao áp cả hàng đang mở');
if (want('AP-10-byte') && await chayCa('AP-10-byte', async kit => {
  const sai = []; const { r } = kho({ data: { schema: 1, moc: [{ ten: 'Toi', ngay: '2026-10-30', loai: 'phat-hanh', hang: ['A'] }, QUA(['B'])], hang: [H('A'), H('B')] } });
  const ra = kit2 => { const x = moO(kit2, r, D20, 'A'); const j = JSON.parse(x.stdout || '{}'); const o = j.hoSo ? readFileSync(path.join(r, '_acceptance', j.hoSo, 'opportunity.md'), 'utf8') : null;
    if (j.hoSo) rmSync(path.join(r, '_acceptance', j.hoSo), { recursive: true }); return { st: x.status, out: chuanKit(x.stdout, kit2), o }; };
  const g = ra(banGoc()); const m = ra(kit);
  if (g.st !== 0 || !g.o) sai.push('đối chứng gốc không chạy: --mo-o của bộ máy gốc');
  if (m.st !== g.st || m.out.replace(chuanKit(kit, kit), '') !== g.out.replace(chuanKit(banGoc(), banGoc()), '') || m.o !== g.o) sai.push(`--mo-o ở kho không bật khác bộ máy gốc: ${m.out} ≠ ${g.out}`);
  if (trangThaiSach(r)) sai.push(`kho không bật mà mở việc ghi thêm: ${trangThaiSach(r)}`);
  return sai;
})) ok('AP-10-byte', 'kho không bật: stdout và ô cơ hội của --mo-o giống từng byte bộ máy gốc, không tệp nào khác đổi');
if (want('AP-10-skill') && await chayCa('AP-10-skill', async kit => {
  const t = readFileSync(path.join(kit, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8');
  const m = t.match(/<!-- <<<S0-AP-COMMIT -->\n```\n([^\n]+)\n```\n<!-- S0-AP-COMMIT>>> -->/);
  const DN = await import(pathToFileURL(path.join(kit, '_acceptance', 'ap-chinh-sach-lo-trinh', 'nen', 'do-nen.mjs')).href + `?s=${++napN}`);
  if (!m) return ['SKILL feature-loop thiếu khối S0-AP-COMMIT'];
  return m[1] === `${DN.TIEU_DE_MAY}: <n> hàng — <YYYY-MM-DD>` ? [] : [`tiêu đề trong SKILL «${m[1]}» khác hằng của thước «${DN.TIEU_DE_MAY}»`];
})) ok('AP-10-skill', 'khối S0-AP-COMMIT của SKILL ghim tiêu đề «lo-trinh(may-ap): <n> hàng — <ngày>», tiền tố trùng hằng của thước');
const doNen = (kit, r) => { const x = node([path.join(kit, '_acceptance', 'ap-chinh-sach-lo-trinh', 'nen', 'do-nen.mjs'), r, 'HEAD', TEP]);
  if (x.status !== 0) throw new Error(`do-nen thoát ${x.status}: ${x.stderr.slice(0, 200)}`); return JSON.parse(x.stdout).tong; };
const doiTay = (r, ma, tu, den) => { const d = docLT(r); const a = d.moc.find(m => m.ten === tu); a.hang.splice(a.hang.indexOf(ma), 1); d.moc.find(m => m.ten === den).hang.push(ma); ghiTep(r, d); };
async function ap10thuoc(kit) {
  const { r } = kho({ data: { schema: 1, moc: [QUA(['A', 'M1', 'M2']), TOI({ tran_ap: 1 })], hang: [H('A'), H('M1'), H('M2')] } });
  doiTay(r, 'A', 'Qua', 'Toi'); commitNgay(r, '2026-10-19', 'docs(lo-trinh): dời A bằng tay');
  apGhiOk(kit, r, D20); commitNgay(r, D20, 'bao truoc');
  apGhiOk(kit, r, D21); commitNgay(r, D21, 'lo-trinh(may-ap): 1 hàng — 2026-10-21');
  apGhiOk(kit, r, D22); commitNgay(r, D22, 'feat: gop squash cua mot PR');
  const t = doNen(kit, r);
  return t.doi === 1 && t.may === 2 ? [] : [`lớp dời ${t.doi}, cần 1 (máy ${t.may}, cần 2)`];
}
if (want('AP-10-thuoc') && await chayCa('AP-10-thuoc', ap10thuoc)) ok('AP-10-thuoc', 'ba commit (dời tay · máy áp có tiêu đề · máy áp mất tiêu đề như gộp squash): thước đếm lớp dời 1, phần máy 2');
if (want('AP-10-do2')) await chayDo('AP-10-do2', ap10thuoc, [['_acceptance/ap-chinh-sach-lo-trinh/nen/do-nen.mjs', 'const tay = [...maDoi].filter(m => !may.has(m));', "const tay = sh('log', '-1', '--format=%s', s).startsWith(TIEU_DE_MAY) ? [] : [...maDoi];"]], 'lớp dời 2, cần 1', 'bản sao thước trừ theo tiêu đề commit');
if (want('AP-10-tron') && await chayCa('AP-10-tron', async kit => {
  const { r } = kho({ data: { schema: 1, moc: [QUA(['A', 'M1']), TOI()], hang: [H('A'), H('M1')] } });
  chay(kit, r, D20, ['--ghim', 'A', '--write']); apGhiOk(kit, r, D20); commitNgay(r, D20, 'bao truoc');
  apGhiOk(kit, r, D21); doiTay(r, 'A', 'Qua', 'Toi'); commitNgay(r, D21, 'lo-trinh(may-ap): 1 hàng — 2026-10-21');
  const t = doNen(kit, r);
  return t.doi === 1 ? [] : [`commit lẫn máy áp + dời tay: lớp dời ${t.doi}, cần 1`];
})) ok('AP-10-tron', 'một commit vừa có phần máy áp (khớp sổ) vừa có một lần dời tay: thước đếm lớp dời 1');

// ═══ CA MỚI THÊM TRÊN DÒNG NÀY ═══

console.log(`\nResults: ${pass} passed, ${fail} failed (ap-chinh-sach-lo-trinh)`);
process.exit(fail ? 1 : 0);
