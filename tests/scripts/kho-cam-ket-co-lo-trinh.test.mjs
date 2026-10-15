// kho-cam-ket-co-lo-trinh.test.mjs — hồ sơ kho-cam-ket-co-lo-trinh (hàng RM5, nấc 4 + nấc 3 của ADR 0025), ca CK-<n> =
// AC-n của hợp đồng (AC-6 ở kho-cam-ket-co-lo-trinh-cac-kho.mjs). Mỗi eval của evals.yaml ghim đúng dòng «PASS: CK-…».
//
// Kho thử do CODE sinh trong lượt (git init trong thư mục tạm, config khai lo_trinh.tep, tệp lộ trình ghi bằng
// `ghiLoTrinh` của cây). Khoá bật rút từ .claude-plugin/marketplace.json của cây; HOME trỏ thư mục thử có
// ~/.claude/settings.json bật gói (phạm vi người dùng không được tính). Hook gọi bằng JSON PreToolUse qua stdin như
// harness gọi. «Bộ máy gốc» = `git archive <gốc so> hooks lib scripts skills commands feature-loop road-map
// .claude-plugin` bung trong lượt, gốc so đọc từ _acceptance/kho-cam-ket-co-lo-trinh/goc-so. Ca đỏ chạy CHÍNH hàm đo trên
// BẢN SAO của vật (mỗi nhát tiêm khớp đúng một lần), SAU khi bản lành xanh trên cùng kho thử, và ghim thông điệp. Mọi
// đường dẫn suy từ vị trí tệp này. Không ca nào ghi vào cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, realpathSync, readdirSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const SLUG_HS = 'kho-cam-ket-co-lo-trinh';
const GOC = readFileSync(path.join(KIT, '_acceptance', SLUG_HS, 'goc-so'), 'utf8').trim();
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'ck-rm5-')));
const TEP_LT = 'docs/plan/lo-trinh.json';
const CAU_KHOA_SAI = 'lo_trinh.chan phải là true hoặc false';
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.CK_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-'));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...o });
const HOME = path.join(TMP, 'home'); mkdirSync(path.join(HOME, '.claude'), { recursive: true });
let seq = 0;

// ── Bộ máy: cây đang đo, bản gốc, bản sao có nhát tiêm ──────────────────────────────────────────────────
const MA = ['hooks', 'lib', 'scripts', 'skills', 'commands', 'feature-loop', 'road-map', '.claude-plugin'];
let GOC_DIR = null;
function bayGoc() {
  if (GOC_DIR) return GOC_DIR;
  const d = path.join(TMP, 'goc'); mkdirSync(d, { recursive: true });
  const tar = execFileSync('git', ['-C', KIT, 'archive', GOC, ...MA], { maxBuffer: 256 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  return (GOC_DIR = d);
}
function banSao(tiem) {
  const d = path.join(TMP, `mut${++seq}`);
  for (const m of MA) cpSync(path.join(KIT, m), path.join(d, m), { recursive: true });
  for (const [f, cu, moi] of tiem) {
    const p = path.join(d, f); const t = readFileSync(p, 'utf8'); const n = t.split(cu).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm vào ${f} khớp ${n} lần (cần 1): ${cu.slice(0, 70)}`);
    writeFileSync(p, t.split(cu).join(moi));
  }
  return d;
}
const khoaBat = kit => {
  const j = JSON.parse(readFileSync(path.join(kit, '.claude-plugin', 'marketplace.json'), 'utf8'));
  const p = j.plugins.find(x => x.name === 'road-map');
  if (!p) throw new Error('marketplace.json không có gói road-map');
  return `${p.name}@${j.name}`;
};
const KHOA = khoaBat(KIT);
writeFileSync(path.join(HOME, '.claude', 'settings.json'), JSON.stringify({ enabledPlugins: { [KHOA]: true } }));
const LT = await import(pathToFileURL(path.join(KIT, 'scripts', 'lo-trinh.mjs')).href);
const PM = await import(pathToFileURL(path.join(KIT, 'scripts', 'product-map.mjs')).href);
const libCua = kit => createRequire(import.meta.url)(path.join(kit, 'lib', 'chan-lo-trinh.cjs'));

// ── Kho thử ─────────────────────────────────────────────────────────────────────────────────────────────
// goi: 'khong' | 'du-an' | 'local' | 'tat' · chan: undefined | 'false' | 'true' | '"co"' · hang: mảng hàng · hoSo: {slug: {tep: nd}}
function cfgCua({ chan, them = '' } = {}) {
  return ['schema_version: 1', 'risk_tiers:', '  t1_skip_globs:', '    - "docs/**"', '    - "LO-TRINH.html"', '    - "PRODUCT-MAP.md"',
    'lo_trinh:', `  tep: ${TEP_LT}`, ...(chan == null ? [] : [`  chan: ${chan}`]), them, ''].join('\n');
}
function kho({ goi = 'du-an', chan = 'true', hang = [{ ma: 'A1', cau_giao: 'Việc một' }, { ma: 'A2', cau_giao: 'Việc hai' }], hoSo = {}, cfg = null, tepLt = null } = {}) {
  const goc = path.join(TMP, `k${++seq}`, 'kho'); mkdirSync(path.join(goc, '_acceptance'), { recursive: true });
  git(goc, 'init', '-q', '-b', 'main'); git(goc, 'config', 'user.email', 't@t'); git(goc, 'config', 'user.name', 't');
  writeFileSync(path.join(goc, '_acceptance', 'config.yaml'), cfg ?? cfgCua({ chan }));
  const set = (f, v) => { mkdirSync(path.join(goc, '.claude'), { recursive: true }); writeFileSync(path.join(goc, '.claude', f), JSON.stringify(v, null, 2)); };
  if (goi === 'du-an') set('settings.json', { enabledPlugins: { [KHOA]: true } });
  if (goi === 'local') set('settings.local.json', { enabledPlugins: { [KHOA]: true } });
  if (goi === 'tat') set('settings.json', { enabledPlugins: { [KHOA]: false } });
  mkdirSync(path.join(goc, path.dirname(TEP_LT)), { recursive: true });
  if (tepLt != null) writeFileSync(path.join(goc, TEP_LT), tepLt);
  else LT.ghiLoTrinh(path.join(goc, TEP_LT), { schema: 1, ten: 'Lộ trình thử', moc: [], hang, chan_troi: [], da_bac: [] });
  for (const [s, tep] of Object.entries(hoSo)) for (const [f, nd] of Object.entries(tep)) {
    mkdirSync(path.join(goc, '_acceptance', s), { recursive: true }); writeFileSync(path.join(goc, '_acceptance', s, f), nd);
  }
  git(goc, 'add', '-A'); git(goc, 'commit', '-qm', 'khoi', '--allow-empty');
  return goc;
}
const opp = (ma, tep = null) => ['---', 'schema_version: 1', 'slug: x', 'stage: discovery', ...(ma ? [`lo_trinh_ma: ${ma}`] : []), ...(tep ? [`lo_trinh_tep: ${tep}`] : []), '---', '', '## Vấn đề', ''].join('\n');
const HOP_DONG = '---\nschema_version: 1\nslug: x\nstatus: draft\napproved_by:\n---\n\n# x\n';
function banSaoKho(goc) { const d = path.join(TMP, `bs${++seq}`); cpSync(goc, d, { recursive: true }); return d; }
function bam(goc) {
  const h = createHash('sha256'); const di = d => {
    for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (e.name === '.git') continue; const p = path.join(d, e.name);
      if (e.isDirectory()) di(p); else h.update(path.relative(goc, p) + '\0').update(readFileSync(p)).update('\0');
    }
  }; di(goc); return h.digest('hex');
}

// Phán «nối» của bản đồ lộ trình trên một kho (cây đang đo): hồ sơ không thuộc ngoaiLoTrinh và không mang cờ mã sai.
function banDo(root, slug) {
  const k = LT.phanTichKho({ root, classify: PM.classify, sections: PM.SECTIONS });
  const thay = new Set(readdirSync(path.join(root, '_acceptance'), { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name));
  const ngoai = new Set(k.cacTep.flatMap(t => (t.kq ? t.kq.ngoaiLoTrinh : [])));
  const co = k.cacTep.flatMap(t => (t.kq ? t.kq.co : []));
  const maSai = co.some(c => c.startsWith(`hồ sơ ${slug} ghi lo_trinh_ma`) || c.startsWith(`hồ sơ ${slug} ghi lo_trinh_tep`));
  return { coMat: thay.has(slug), noi: !ngoai.has(slug) && !maSai };
}

// ── CK-2: nối — sáu ca, đối chiếu với bản đồ ─────────────────────────────────────────────────────────────
const CA_NOI = [
  { ten: 'hàng mang slug x', hang: [{ ma: 'A1', cau_giao: 'Một', slug: 'x' }], san: {}, ghi: ['contract.md', HOP_DONG], mong: true },
  { ten: 'ô cơ hội sẵn có mã thật', hang: null, san: { 'opportunity.md': opp('A1') }, ghi: ['contract.md', HOP_DONG], mong: true },
  { ten: 'ô cơ hội đang ghi mang mã thật', hang: null, san: {}, ghi: ['opportunity.md', opp('A2')], mong: true },
  { ten: 'mã không có', hang: null, san: {}, ghi: ['opportunity.md', opp('Z9')], mong: false, ma: 'Z9' },
  { ten: 'lo_trinh_tep không khai', hang: null, san: {}, ghi: ['opportunity.md', opp('A1', 'docs/khac.json')], mong: false },
  { ten: 'hàng mang slug hồ sơ khác', hang: [{ ma: 'A1', cau_giao: 'Một', slug: 'khac' }], san: {}, ghi: ['contract.md', HOP_DONG], mong: false },
];
function ck2(lib) {
  let coMat = 0;
  for (const c of CA_NOI) {
    const goc = kho({ ...(c.hang ? { hang: c.hang } : {}), hoSo: Object.keys(c.san).length ? { x: c.san } : {} });
    const dangGhi = c.ghi[0] === 'opportunity.md' ? c.ghi[1] : null;
    const r = lib.noi(goc, 'x', { opportunityDangGhi: dangGhi });
    // Bản đồ chỉ thấy hồ sơ trên đĩa: ghi tệp chờ vào BẢN SAO rồi mới hỏi nó.
    const bs = banSaoKho(goc); mkdirSync(path.join(bs, '_acceptance', 'x'), { recursive: true });
    writeFileSync(path.join(bs, '_acceptance', 'x', c.ghi[0]), c.ghi[1]);
    const bd = banDo(bs, 'x');
    if (bd.coMat) coMat += 1;
    if (r.noi !== c.mong) throw new Error(`bộ đọc chặn lệch bản đồ lộ trình — ca «${c.ten}»: bộ đọc ${r.noi}, mong ${c.mong}`);
    if (bd.noi !== r.noi) throw new Error(`bộ đọc chặn lệch bản đồ lộ trình — ca «${c.ten}»: bộ đọc ${r.noi}, bản đồ ${bd.noi}`);
    if (c.ma && r.ma !== c.ma) throw new Error(`ca «${c.ten}»: mã sai phải là ${c.ma}, nhận ${r.ma}`);
  }
  if (coMat !== CA_NOI.length) throw new Error(`bản đồ chỉ thấy x ở ${coMat}/${CA_NOI.length} ca — phép so rỗng nghĩa`);
  return `${CA_NOI.length} ca, bộ đọc BẰNG bản đồ; x có mặt ở ${coMat}/${CA_NOI.length}`;
}

// ── CK-4 (phần bộ đọc): ma trận bật + đối chiếu với bộ đọc của RM4 ─────────────────────────────────────────
const GOI = ['khong', 'du-an', 'local', 'tat'];
const CHAN = [null, 'false', 'true', '"co"'];  // null = khoá vắng
async function ck4Lib(lib) {
  const RM4 = await import(pathToFileURL(path.join(KIT, 'scripts', 'lo-trinh-khoi-tao.mjs')).href);
  let o = 0;
  for (const g of GOI) for (const c of CHAN) {
    const goc = kho({ goi: g, chan: c }); o += 1;
    const tt = lib.trangThaiChan(goc);
    const mong = g === 'du-an' ? (c === 'true' ? { bat: true } : c === '"co"' ? { loi: CAU_KHOA_SAI } : { bat: false }) : { bat: false };
    if (JSON.stringify(tt) !== JSON.stringify(mong)) throw new Error(`ô (${g}, ${c}): ${JSON.stringify(tt)} ≠ ${JSON.stringify(mong)}`);
    const k1 = lib.khoaBat(); const k2 = RM4.khoaBat(path.join(KIT, '.claude-plugin', 'marketplace.json'));
    if (k1 !== k2) throw new Error(`khoá bật lệch RM4: ${k1} ≠ ${k2}`);
    if (lib.docBat(goc, k1).bat !== RM4.docBat(goc, k2).bat) throw new Error(`docBat lệch RM4 ở ô (${g}, ${c})`);
  }
  if (o !== 16) throw new Error(`ma trận chạy ${o} ô, cần 16`);
  // Gốc lồng (Review Focus 3): _acceptance nằm dưới pkg/.
  const lo = path.join(TMP, `long${++seq}`, 'pkg'); mkdirSync(path.join(lo, '_acceptance', 'x'), { recursive: true });
  writeFileSync(path.join(lo, '_acceptance', 'config.yaml'), 'schema_version: 1\n');
  if (lib.gocKho(path.join(lo, '_acceptance', 'x')) !== lo) throw new Error('gốc lồng: gocKho không trả pkg/');
  return '16 ô bật đúng; khoaBat/docBat BẰNG bộ đọc RM4; gốc lồng đúng';
}

const chayCa = async (id, f) => { try { const m = await f(); ok(id, m); return true; } catch (e) { bad(id, loi(e)); return false; } };
const chayDo = async (id, f, ghim) => {
  try { await f(); bad(id, `bản sao vẫn xanh — mong đỏ với «${ghim}»`); }
  catch (e) { const m = String(e.message || e); if (m.includes(ghim)) ok(id, `đỏ đúng: ${ghim}`); else bad(id, `đỏ sai thông điệp: ${m.slice(0, 200)}`); }
};

const LIB = libCua(KIT);
if (want('CK-2')) {
  if (await chayCa('CK-2', () => ck2(LIB)) && want('CK-2-do')) {
    const m = banSao([['lib/chan-lo-trinh.cjs', '  const ma = opp ? boNhay(frontmatterField(opp, \'lo_trinh_ma\')) : \'\';', "  const ma = '';"]]);
    await chayDo('CK-2-do', () => ck2(libCua(m)), 'bộ đọc chặn lệch bản đồ lộ trình');
  }
}
if (want('CK-4-lib')) await chayCa('CK-4-lib', () => ck4Lib(LIB));

// __CA_SAU__

rmSync(TMP, { recursive: true, force: true });
console.log(`kho-cam-ket-co-lo-trinh: ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
