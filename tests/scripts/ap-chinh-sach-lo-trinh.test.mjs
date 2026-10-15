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

// ═══ CA MỚI THÊM TRÊN DÒNG NÀY ═══

console.log(`\nResults: ${pass} passed, ${fail} failed (ap-chinh-sach-lo-trinh)`);
process.exit(fail ? 1 : 0);
