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

// ── Hook: gọi như harness gọi ─────────────────────────────────────────────────────────────────────────────
function chayHook(kit, goc, lenh, env = {}) {
  const fp = lenh.rel ? lenh.file : path.join(goc, lenh.file);
  const ti = lenh.tool === 'Edit' ? { file_path: fp, old_string: lenh.old, new_string: lenh.moi } : { file_path: fp, content: lenh.content };
  const input = JSON.stringify({ tool_name: lenh.tool, tool_input: ti });
  const e = { ...process.env, HOME, ...env }; if (!('ACCEPTANCE_GATE_BYPASS' in env)) delete e.ACCEPTANCE_GATE_BYPASS;
  const r = spawnSync(process.execPath, [path.join(kit, 'hooks', 'acceptance-evidence-gate.js')], { input, encoding: 'utf8', cwd: goc, env: e });
  return { ma: r.status, out: r.stdout, err: r.stderr };
}
const W = (file, content) => ({ tool: 'Write', file, content });
const OPP_CU = opp(null);
const BON_LENH = [
  { ten: 'Write contract.md mới không nối', l: W('_acceptance/x/contract.md', HOP_DONG), mo: true },
  { ten: 'Write opportunity.md mới không mã', l: W('_acceptance/x/opportunity.md', opp(null)), mo: true },
  { ten: 'Write opportunity.md mới có mã thật', l: W('_acceptance/x/opportunity.md', opp('A1')), mo: false },
  { ten: 'Edit opportunity.md của hồ sơ cũ', l: { tool: 'Edit', file: '_acceptance/cu/opportunity.md', old: '## Vấn đề', moi: '## Vấn đề & ai gặp' }, mo: false },
];
const khoBon = (goi, chan, them = '') => kho({ goi, chan, hoSo: { cu: { 'opportunity.md': OPP_CU } }, ...(them ? { cfg: cfgCua({ chan, them }) } : {}) });
const coDongChan = (r, slug) => ['lo_trinh.chan', slug, '/feature-loop:feature-loop', `--them-hang --slug ${slug}`].every(t => r.err.includes(t));

function ck1(kit) {
  const goc = kho({ hoSo: {} });
  for (const c of BON_LENH.slice(0, 2)) {
    const r = chayHook(kit, goc, c.l);
    if (r.ma !== 2 || !coDongChan(r, 'x')) throw new Error(`hồ sơ ngoài lộ trình lọt hook — «${c.ten}»: mã ${r.ma}, stderr ${JSON.stringify(r.err.slice(0, 160))}`);
    if (existsSync(path.join(goc, '_acceptance', 'x'))) throw new Error('thư mục x bị tạo');
  }
  // Review Focus 1, 2, 4: Edit trên tệp vắng · đường dẫn tương đối · tệp lộ trình hỏng.
  const r1 = chayHook(kit, goc, { tool: 'Edit', file: '_acceptance/x/opportunity.md', old: 'a', moi: 'b' });
  if (r1.ma !== 0 || r1.err.includes('lo_trinh.chan')) throw new Error(`Edit trên tệp vắng bị chặn: ${r1.ma}`);
  const r2 = chayHook(kit, goc, { ...W('_acceptance/x/contract.md', HOP_DONG), rel: true });
  if (r2.ma !== 2 || !coDongChan(r2, 'x')) throw new Error(`hồ sơ ngoài lộ trình lọt hook — đường dẫn tương đối: mã ${r2.ma}`);
  const hong = kho({ tepLt: '{ hỏng' });
  const r3 = chayHook(kit, hong, W('_acceptance/x/contract.md', HOP_DONG));
  if (r3.ma !== 2 || !r3.err.includes('không phải JSON')) throw new Error(`hồ sơ ngoài lộ trình lọt hook — tệp lộ trình hỏng: mã ${r3.ma}`);
  return 'hai lệnh mở hồ sơ bị chặn với hai lối ra; Edit tệp vắng qua; đường tương đối chặn; tệp lộ trình hỏng chặn có tên';
}
function ck3(kit) {
  const goc = kho({ hoSo: { cu: { 'contract.md': HOP_DONG.replace('slug: x', 'slug: cu') }, cu2: { 'opportunity.md': OPP_CU } } });
  const lenh = [
    W('_acceptance/cu/contract.md', HOP_DONG.replace('slug: x', 'slug: cu')), W('_acceptance/cu/opportunity.md', OPP_CU), W('_acceptance/cu/design-pass.md', '# d\n'),
    { tool: 'Edit', file: '_acceptance/cu/contract.md', old: '# x', moi: '# cu' },
    W('_acceptance/cu2/contract.md', HOP_DONG.replace('slug: x', 'slug: cu2')), W('_acceptance/cu2/opportunity.md', OPP_CU),
    { tool: 'Edit', file: '_acceptance/cu2/opportunity.md', old: '## Vấn đề', moi: '## Vấn đề mới' }, W('_acceptance/cu2/design-pass.md', '# d\n'),
    W('_acceptance/x/design-pass.md', '# d\n'),
  ];
  for (const l of lenh) {
    const r = chayHook(kit, goc, l);
    if (r.ma !== 0 || r.err.includes('lo_trinh.chan')) throw new Error(`hồ sơ cũ bị chặn — ${l.tool} ${l.file}: mã ${r.ma}`);
  }
  const d = chayHook(kit, goc, W('_acceptance/x/contract.md', HOP_DONG));
  if (d.ma !== 2) throw new Error(`đối chứng dương: Write contract.md của x phải bị chặn, nhận ${d.ma}`);
  return `${lenh.length} lệnh vào hồ sơ cũ / tệp phụ qua; đối chứng dương chặn`;
}
function ck4(kit) {
  const goc0 = bayGoc(); let n = 0;
  for (const g of GOI) for (const c of CHAN) for (const b of BON_LENH) {
    const goc = khoBon(g, c); n += 1;
    const r = chayHook(kit, goc, b.l);
    const bat = g === 'du-an' && c === 'true'; const sai = g === 'du-an' && c === '"co"';
    if (bat) {
      if (b.mo && (r.ma !== 2 || !coDongChan(r, 'x'))) throw new Error(`ô bật, «${b.ten}»: mong chặn, nhận ${r.ma}`);
      if (!b.mo && r.ma !== 0) throw new Error(`ô bật, «${b.ten}»: mong qua, nhận ${r.ma} ${r.err.slice(0, 120)}`);
    } else if (sai) {
      if (b.l.tool === 'Write' && (r.ma !== 2 || !r.err.includes(CAU_KHOA_SAI))) throw new Error(`ô khoá sai, «${b.ten}»: mong chặn nêu khoá, nhận ${r.ma}`);
      if (b.l.tool === 'Edit' && r.ma !== 0) throw new Error(`ô khoá sai, Edit: mong qua, nhận ${r.ma}`);
    } else {
      const r0 = chayHook(goc0, goc, b.l);
      if (r.ma !== r0.ma || r.out !== r0.out || r.err !== r0.err) {
        const tep = b.l.file.endsWith('opportunity.md') ? 'opportunity.md' : 'contract.md';
        if (g === 'local') throw new Error(`phạm vi local không được bật chặn — ô (${g}, ${c}) «${b.ten}»`);
        throw new Error(`kho không bật đổi hành vi ở ${tep} — ô (${g}, ${c}) «${b.ten}»: ${r.ma}/${r0.ma}`);
      }
    }
  }
  if (n !== 64) throw new Error(`ma trận chạy ${n} lần, cần 64`);
  return '64 lần: chỉ ô bật chặn hai lệnh mở hồ sơ; khoá sai chặn có tên; 14 ô × 4 lệnh giống từng byte bộ máy gốc';
}
function ck4ChinhSach(kit) {
  const off = chayHook(kit, khoBon('du-an', 'true', 'enforcement: off'), BON_LENH[0].l);
  if (off.ma !== 0 || off.err.includes('lo_trinh.chan')) throw new Error(`enforcement off: ${off.ma}`);
  const by = chayHook(kit, khoBon('du-an', 'true'), BON_LENH[0].l, { ACCEPTANCE_GATE_BYPASS: '1' });
  if (by.ma !== 0) throw new Error(`BYPASS: ${by.ma}`);
  const warn = chayHook(kit, khoBon('du-an', 'true', 'enforcement: warn'), BON_LENH[0].l);
  if (warn.ma !== 0 || !warn.err.includes('lo_trinh.chan')) throw new Error(`enforcement warn: ${warn.ma}`);
  return 'off → qua im · BYPASS → qua · warn → qua kèm dòng chặn';
}

if (want('CK-1')) {
  if (await chayCa('CK-1', () => ck1(KIT)) && want('CK-1-do')) {
    const m = banSao([['hooks/acceptance-evidence-gate.js', "const chan = luatChanLoTrinh(path.resolve(filePath), (ti.content || '').toString(), !isContract);", 'const chan = null;']]);
    await chayDo('CK-1-do', () => ck1(m), 'hồ sơ ngoài lộ trình lọt hook');
  }
}
if (want('CK-3')) {
  if (await chayCa('CK-3', () => ck3(KIT)) && want('CK-3-do')) {
    const m = banSao([['hooks/acceptance-evidence-gate.js', '  if (!L.laHoSoMoi(root, slug)) return null;\n', '']]);
    await chayDo('CK-3-do', () => ck3(m), 'hồ sơ cũ bị chặn');
  }
}
if (want('CK-4')) {
  const xanh = await chayCa('CK-4', () => ck4(KIT));
  await chayCa('CK-4-chinh-sach', () => ck4ChinhSach(KIT));
  if (xanh && want('CK-4-do')) {
    const m = banSao([['lib/chan-lo-trinh.cjs', "  const t = docTho(path.join(root, '.claude', 'settings.json'));", "  const t = docTho(path.join(root, '.claude', 'settings.json')) ?? docTho(path.join(root, '.claude', 'settings.local.json'));"]]);
    await chayDo('CK-4-do', () => ck4(m), 'phạm vi local không được bật chặn');
  }
  if (xanh && want('CK-4-do2')) {
    const m = banSao([['hooks/acceptance-evidence-gate.js', '  if (!tt.bat) return null;', '  if (!tt.bat && !laOpp) return null;']]);
    await chayDo('CK-4-do2', () => ck4(m), 'kho không bật đổi hành vi ở opportunity.md');
  }
}

// ── Lưới trước-merge trên lớp CI chép theo INIT-CI-COPY-LIST (rút trong lượt) ───────────────────────────────
const khoiMd = (txt, ten) => { const m = String(txt).match(new RegExp(`<!-- <<<${ten} -->\\n([\\s\\S]*?)<!-- ${ten}>>> -->`)); return m ? m[1] : null; };
function mucCI(kit) {
  const b = khoiMd(readFileSync(path.join(kit, 'commands', 'acceptance-init.md'), 'utf8'), 'INIT-CI-COPY-LIST');
  if (b == null) throw new Error('không rút được khối INIT-CI-COPY-LIST');
  const ra = [];
  for (const d of b.split('\n')) {
    const x = d.match(/`\$\{CLAUDE_PLUGIN_ROOT\}\/([^`]+)` → `([^`]+)`/); if (!x) continue;
    const dk = d.match(/\[only-if-declared: (\w+)\]/);
    if (dk && dk[1] !== 'lo_trinh') continue;
    ra.push({ nguon: x[1], dich: path.posix.join(x[2], path.posix.basename(x[1])) });
  }
  return ra;
}
function chepCI(kit, goc, boQua = []) {
  for (const m of mucCI(kit)) {
    if (boQua.includes(m.dich) || !existsSync(path.join(kit, m.nguon))) continue;
    mkdirSync(path.dirname(path.join(goc, m.dich)), { recursive: true }); cpSync(path.join(kit, m.nguon), path.join(goc, m.dich), { recursive: true });
  }
}
// main: hồ sơ cu (không nối) + hàng N1 mang slug noi · nhánh viec: thêm moi (không nối) + noi, sửa cu.
function khoNhanh(chan) {
  const goc = kho({ chan, hang: [{ ma: 'A1', cau_giao: 'Một' }, { ma: 'N1', cau_giao: 'Có hàng', slug: 'noi' }], hoSo: { cu: { 'contract.md': HOP_DONG.replace('slug: x', 'slug: cu') } } });
  git(goc, 'checkout', '-qb', 'viec');
  for (const s of ['moi', 'noi']) { mkdirSync(path.join(goc, '_acceptance', s), { recursive: true }); writeFileSync(path.join(goc, '_acceptance', s, 'contract.md'), HOP_DONG.replace('slug: x', `slug: ${s}`)); }
  writeFileSync(path.join(goc, '_acceptance', 'cu', 'contract.md'), HOP_DONG.replace('slug: x', 'slug: cu').replace('# x', '# cu sửa'));
  git(goc, 'add', '-A'); git(goc, 'commit', '-qm', 'viec');
  return goc;
}
function chayLuoi(kit, goc, { boQua = [], base = 'main' } = {}) {
  const d = banSaoKho(goc); chepCI(kit, d, boQua);
  const r = spawnSync('bash', [path.join(d, 'scripts', 'pre-merge-check.sh'), d, ...(base ? ['--base', base] : [])], { encoding: 'utf8', env: { ...process.env, HOME }, maxBuffer: 64 * 1024 * 1024 });
  return { ma: r.status, out: (r.stdout || '').split(d).join('<KHO>') };
}
const VI_MOI = 'VIOLATION [moi]: hồ sơ mới không thuộc hàng lộ trình nào (lo_trinh.chan)';
function ck5(kit) {
  const r = chayLuoi(kit, khoNhanh('true'));
  const dong = r.out.split('\n');
  if (dong.filter(x => x === VI_MOI).length !== 1) throw new Error(`hồ sơ ngoài lộ trình lọt lưới trước-merge — mã ${r.ma}, dòng chặn: ${JSON.stringify(dong.filter(x => x.includes('lo_trinh.chan')))}`);
  if (dong.some(x => x.includes('lo_trinh.chan') && /\[(noi|cu)\]/.test(x))) throw new Error('lưới chấm nhầm hồ sơ noi/cu');
  if (r.ma === 0) throw new Error('lưới thoát 0 dù có VIOLATION');
  return `mã ${r.ma}; đúng một dòng VIOLATION [moi]; noi và cu không bị chấm`;
}
function ck5Tat(kit) {
  const goc = khoNhanh(null);
  const r = chayLuoi(kit, goc); const r0 = chayLuoi(bayGoc(), goc);
  if (!/^pre-merge-check: rules ran=\d+ declared-off=\d+ expected=\d+$/m.test(r0.out)) throw new Error('đối chứng: bản gốc không chạy tới dòng sổ luật — phép so rỗng nghĩa');
  if (r.out.includes('lo_trinh.chan')) throw new Error('kho không bật mà lưới in dòng lo_trinh.chan');
  if (r.ma !== r0.ma || r.out !== r0.out) throw new Error(`kho không bật: đầu ra lưới khác bộ máy gốc (mã ${r.ma}/${r0.ma})`);
  return `kho không bật: stdout + mã (${r.ma}) giống từng byte bộ máy gốc`;
}
function ck5ThieuLib(kit) {
  const r = chayLuoi(kit, khoNhanh('true'), { boQua: ['lib/chan-lo-trinh.cjs'] });
  const n = r.out.split('\n').filter(x => x.startsWith('NOTE') && x.includes('luật chặn lộ trình NOT ENFORCED')).length;
  if (n !== 1) throw new Error(`thiếu lib: ${n} dòng NOTE NOT ENFORCED (cần 1)`);
  const k = chayLuoi(kit, khoNhanh('true'), { base: null });
  if (k.out.split('\n').filter(x => x.startsWith('NOTE') && x.includes('luật chặn lộ trình NOT ENFORCED')).length !== 1) throw new Error('không base: thiếu dòng NOTE NOT ENFORCED');
  return 'thiếu lib → một NOTE; không base → một NOTE';
}
if (want('CK-5')) {
  const xanh = await chayCa('CK-5', () => ck5(KIT));
  await chayCa('CK-5-tat', () => ck5Tat(KIT));
  await chayCa('CK-5-thieu-lib', () => ck5ThieuLib(KIT));
  if (xanh && want('CK-5-do')) {
    const m = banSao([['scripts/pre-merge-check.sh', '_clt="$(node "$CLT_LIB" --root "$ROOT" --base "$BASE_SHA" 2>&1)"; _clt_rc=$?', '_clt=""; _clt_rc=0']]);
    await chayDo('CK-5-do', () => ck5(m), 'hồ sơ ngoài lộ trình lọt lưới trước-merge');
  }
}

// ── Nấc 3: khối S0-THEM-HANG rút NGUYÊN VĂN từ SKILL feature-loop ─────────────────────────────────────────────
const SKILL = kit => readFileSync(path.join(kit, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8');
const lenhKhoi = (kit, ten) => {
  const b = khoiMd(SKILL(kit), ten); if (b == null) throw new Error(`không rút được khối ${ten}`);
  const m = b.match(/```\n([\s\S]*?)```/); if (!m) throw new Error(`khối ${ten} không có khối lệnh`);
  return m[1].replace(/^AG=\$\(.*?\) && /, `AG='${kit}' && `);
};
const maThay = new Set();
function chayThemHang(kit, goc, slug, cau) {
  const l = lenhKhoi(kit, 'S0-THEM-HANG').split("'<slug>'").join(`'${slug}'`).split('<mô tả>').join(cau);
  const r = spawnSync('bash', ['-c', l], { encoding: 'utf8', cwd: goc, env: { ...process.env, HOME, ACCEPTANCE_TODAY: '2026-10-20' } });
  maThay.add(r.status); return r;
}
const docLt = goc => JSON.parse(readFileSync(path.join(goc, TEP_LT), 'utf8'));
const S7 = 'sua-loi-dang-nhap'; const CAU7 = 'Sửa lỗi đăng nhập khi mất mạng';
function ck7(kit) {
  const goc = kho(); const truoc = docLt(goc).hang;
  const r = chayThemHang(kit, goc, S7, CAU7);
  if (r.status !== 0) throw new Error(`khối S0-THEM-HANG thoát ${r.status}: ${r.stderr}`);
  const d = docLt(goc); const txt = readFileSync(path.join(goc, TEP_LT), 'utf8');
  if (d.hang.length !== 3) throw new Error(`tệp có ${d.hang.length} hàng, cần 3`);
  const h = chayHook(kit, goc, W(`_acceptance/${S7}/contract.md`, HOP_DONG.replace('slug: x', `slug: ${S7}`)));
  if (h.ma !== 0) throw new Error(`hàng máy thêm không nối hồ sơ — hook chặn hợp đồng: ${h.err.slice(0, 200)}`);
  const mong = { ma: S7, cau_giao: CAU7, slug: S7, vi_sao: 'Máy thêm khi mở vòng từ mô tả, 2026-10-20' };
  if (JSON.stringify(d.hang[2]) !== JSON.stringify(mong)) throw new Error(`hàng thêm ${JSON.stringify(d.hang[2])} ≠ ${JSON.stringify(mong)}`);
  if (JSON.stringify(d.hang.slice(0, 2)) !== JSON.stringify(truoc)) throw new Error('hai hàng đầu bị đổi');
  if (!LT.dangChuan(txt)) throw new Error('tệp sau khi thêm không ở dạng chuẩn');
  const co = LT.kiemKhuon(d).co; if (co.length) throw new Error(`kiemKhuon có cờ: ${co.join('; ')}`);
  writeFileSync(path.join(goc, '_acceptance', S7, 'contract.md'), HOP_DONG.replace('slug: x', `slug: ${S7}`));
  const k = LT.phanTichKho({ root: goc, classify: PM.classify, sections: PM.SECTIONS });
  const dong = k.cacTep[0].kq.dong.find(x => x._ma === S7);
  if (!dong || dong.hoSo !== S7) throw new Error(`hàng máy thêm không nối hồ sơ — bản đồ: ${JSON.stringify(dong && dong.hoSo)}`);
  const mo = spawnSync('bash', ['-c', lenhKhoi(KIT, 'S0-MO-O').split("'<mã>'").join(`'${S7}'`)], { encoding: 'utf8', cwd: goc, env: { ...process.env, HOME } });
  let j; try { j = JSON.parse(mo.stdout); } catch { throw new Error(`S0-MO-O không in JSON: ${mo.stderr}`); }
  if (j.moi !== false || j.hoSo !== S7) throw new Error(`mở lại bằng slug: ${mo.stdout}`);
  if (existsSync(path.join(goc, '_acceptance', S7, 'opportunity.md'))) throw new Error('mở lại bằng slug sinh ô cơ hội');
  node([path.join(kit, 'scripts', 'product-map.mjs'), '--root', goc]); git(goc, 'add', '-A'); git(goc, 'commit', '-qm', 'them');
  const c = node([path.join(kit, 'scripts', 'product-map.mjs'), '--root', goc, '--check']);
  if (c.status !== 0) throw new Error(`product-map --check thoát ${c.status}: ${c.stdout}${c.stderr}`);
  return 'thêm đúng một hàng; tệp chuẩn; hook cho qua hợp đồng; bản đồ nối hàng; mở lại bằng slug = tiếp tục; --check xanh';
}
const CA_TU_CHOI = [
  { ten: 'tệp không dạng chuẩn', dung: () => kho({ tepLt: JSON.stringify({ schema: 1, ten: 'T', moc: [], hang: [{ ma: 'A1', cau_giao: 'Một' }], chan_troi: [], da_bac: [] }) }), slug: 'x', cau: 'Câu', ghim: 'không ở dạng chuẩn' },
  { ten: 'đã có hàng mã x', dung: () => kho({ hang: [{ ma: 'x', cau_giao: 'Một' }] }), slug: 'x', cau: 'Câu', ghim: 'đã có hàng mang mã hay slug x' },
  { ten: 'đã có hàng slug x', dung: () => kho({ hang: [{ ma: 'B1', cau_giao: 'Một', slug: 'x' }] }), slug: 'x', cau: 'Câu', ghim: 'đã có hàng mang mã hay slug x' },
  { ten: 'stdin rỗng', dung: () => kho(), slug: 'x', cau: '', ghim: 'câu giao rỗng' },
  { ten: 'slug sai mẫu', dung: () => kho(), slug: 'X Y', cau: 'Câu', ghim: 'slug không hợp lệ' },
  { ten: 'khoá chan sai giá trị', dung: () => kho({ chan: '"co"' }), slug: 'x', cau: 'Câu', ghim: CAU_KHOA_SAI },
];
function ck8(kit) {
  let n = 0;
  for (const c of CA_TU_CHOI) {
    const goc = c.dung(); const truoc = createHash('sha256').update(readFileSync(path.join(goc, TEP_LT))).digest('hex'); n += 1;
    const r = node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', goc, '--them-hang', '--slug', c.slug], { input: c.cau, env: { ...process.env, HOME } });
    maThay.add(r.status);
    const sau = createHash('sha256').update(readFileSync(path.join(goc, TEP_LT))).digest('hex');
    if (c.ten === 'tệp không dạng chuẩn' && sau !== truoc) throw new Error('ghi đè tệp lộ trình không chuẩn');
    if (r.status !== 2 || !r.stderr.includes(c.ghim)) throw new Error(`ca «${c.ten}»: mã ${r.status}, stderr ${JSON.stringify(r.stderr.slice(0, 160))}`);
    if (sau !== truoc) throw new Error(`ca «${c.ten}»: tệp lộ trình bị đổi`);
  }
  if (n !== 6) throw new Error(`chạy ${n} ca, cần 6`);
  return '6 ca thoát 2 nêu nguyên nhân, tệp lộ trình nguyên byte';
}
function ck8KyTu(kit) {
  const goc = kho(); const cau = 'Sửa $(touch CANH) và `touch CANH2` \'đơn\' "kép"';
  const r = chayThemHang(kit, goc, 'ky-tu', cau);
  if (r.status !== 0) throw new Error(`thoát ${r.status}: ${r.stderr}`);
  const h = docLt(goc).hang.find(x => x.ma === 'ky-tu');
  if (!h || h.cau_giao !== cau) throw new Error(`câu giao ghi sai: ${JSON.stringify(h && h.cau_giao)}`);
  for (const t of ['CANH', 'CANH2']) if (existsSync(path.join(goc, t)) || existsSync(path.join(process.cwd(), t))) throw new Error(`tệp ${t} bị tạo — câu giao bị chạy như lệnh`);
  return 'câu giao ghi nguyên văn; không lệnh nào trong câu bị chạy';
}
if (want('CK-7')) {
  if (await chayCa('CK-7', () => ck7(KIT)) && want('CK-7-do')) {
    const m = banSao([['scripts/lo-trinh.mjs', 'data.hang.push({ ma: slugMoi, cau_giao: cau, slug: slugMoi, vi_sao:', 'data.hang.push({ ma: slugMoi, cau_giao: cau, vi_sao:']]);
    await chayDo('CK-7-do', () => ck7(m), 'hàng máy thêm không nối hồ sơ');
  }
}
if (want('CK-8')) {
  const xanh = await chayCa('CK-8', () => ck8(KIT));
  await chayCa('CK-8-ky-tu', () => ck8KyTu(KIT));
  if (xanh && want('CK-8-do')) {
    const m = banSao([['scripts/lo-trinh.mjs', '    if (!dangChuan(txt)) bail(', '    if (false) bail(']]);
    await chayDo('CK-8-do', () => ck8(m), 'ghi đè tệp lộ trình không chuẩn');
  }
}

// ── CK-9: lời khai — bảng mã thoát round-trip, dòng chép CI, README/GUIDE, khuôn cấu hình ────────────────────
function ck9(kit) {
  const b = khoiMd(SKILL(kit), 'S0-THEM-HANG-THOAT'); if (b == null) throw new Error('không rút được khối S0-THEM-HANG-THOAT');
  const ma = new Set(b.split('\n').map(x => x.match(/^(\d+) →/)).filter(Boolean).map(m => Number(m[1])));
  const cho = new Set();
  cho.add(chayThemHang(kit, kho(), 'ck9-them', 'Một câu').status);            // bật → 0
  cho.add(chayThemHang(kit, kho({ chan: null }), 'ck9-tat', 'Một câu').status); // không bật → 1
  cho.add(chayThemHang(kit, kho({ hang: [{ ma: 'ck9-trung', cau_giao: 'Có' }] }), 'ck9-trung', 'Một câu').status); // trùng → 2
  for (const m of ma) if (!cho.has(m)) throw new Error(`mã ${m} không ca nào cho ra`);
  for (const m of cho) if (!ma.has(m)) throw new Error(`ca cho ra mã ${m} mà bảng không có`);
  if ([...ma].sort().join() !== '0,1,2') throw new Error(`bảng mã ${[...ma].sort()} ≠ {0,1,2}`);
  const ds = khoiMd(readFileSync(path.join(kit, 'commands', 'acceptance-init.md'), 'utf8'), 'INIT-CI-COPY-LIST') || '';
  if (ds.split('\n').filter(x => x.includes('lib/chan-lo-trinh.cjs') && x.includes('[only-if-declared: lo_trinh]')).length !== 1) throw new Error('danh sách chép CI thiếu dòng lib/chan-lo-trinh.cjs [only-if-declared: lo_trinh]');
  for (const f of ['road-map/README.md', 'GUIDE.md']) {
    const t = readFileSync(path.join(kit, f), 'utf8');
    for (const y of ['lo_trinh.chan', '--scope project', 'lưới trước-merge']) if (!t.includes(y)) throw new Error(`${f} thiếu «${y}»`);
    if (!/false|xoá/.test(t)) throw new Error(`${f} không nói cách tắt`);
  }
  const yaml = readFileSync(path.join(kit, 'commands', 'acceptance-init.md'), 'utf8').match(/```yaml\n([\s\S]*?)```/);
  if (!yaml) throw new Error('không rút được khối cấu hình mẫu');
  if (/^\s*chan:/m.test(yaml[1])) throw new Error('khuôn cấu hình mẫu có khoá chan — mặc định phải là vắng');
  return 'bảng mã {0,1,2} khớp hai chiều với ca; dòng chép CI; README + GUIDE; khuôn cấu hình không khoá chan';
}
if (want('CK-9')) {
  if (await chayCa('CK-9', () => ck9(KIT)) && want('CK-9-do')) {
    const m = banSao([['feature-loop/skills/feature-loop/SKILL.md', '2 → dừng: in nguyên thông điệp (tệp lệch khuôn, đã có hàng, câu rỗng, khoá sai giá trị)\n', '2 → dừng: in nguyên thông điệp (tệp lệch khuôn, đã có hàng, câu rỗng, khoá sai giá trị)\n3 → giả.\n']]);
    await chayDo('CK-9-do', () => ck9(m), 'mã 3 không ca nào cho ra');
  }
}


// ── CK-4-settings-hong (S4 lượt 1, AC-6): .claude/settings.json không phải JSON ────────────────────────────────
// Kho CHƯA khai chặn (khoá vắng / false) → hook bốn lệnh ghi giống từng byte bộ máy gốc + bộ đọc im; kho khai chặn → chặn
// lệnh mở hồ sơ, nêu settings.json.
function ck4SettingsHong(kit) {
  const goc0 = bayGoc(); let n = 0;
  const hong = goc => { writeFileSync(path.join(goc, '.claude', 'settings.json'), `{ "enabledPlugins": { "${KHOA}": true }, }`); git(goc, 'commit', '-qam', 'hong'); };
  for (const c of [null, 'false']) {
    const goc = khoBon('du-an', c); hong(goc);
    for (const b of BON_LENH) {
      n += 1; const r = chayHook(kit, goc, b.l); const r0 = chayHook(goc0, goc, b.l);
      if (r.ma !== r0.ma || r.out !== r0.out || r.err !== r0.err) throw new Error(`kho không bật bị chặn vì settings.json hỏng — khoá ${c}, «${b.ten}»: ${r.ma}/${r0.ma} ${r.err.slice(0, 120)}`);
    }
    const l = node([path.join(kit, 'lib', 'chan-lo-trinh.cjs'), '--root', goc, '--base', 'HEAD']);
    if (l.status !== 0 || l.stdout !== '') throw new Error(`kho không bật bị chặn vì settings.json hỏng — bộ đọc thoát ${l.status} «${l.stdout.trim()}»`);
  }
  const goc = khoBon('du-an', 'true'); hong(goc);
  const r = chayHook(kit, goc, BON_LENH[0].l);
  if (r.ma !== 2 || !r.err.includes('settings.json')) throw new Error(`kho khai chặn mà settings.json hỏng: mong chặn nêu settings.json, nhận ${r.ma}`);
  if (n !== 8) throw new Error(`chạy ${n} lệnh, cần 8`);
  return 'khoá vắng/false: 8 lệnh hook giống bộ máy gốc, bộ đọc im; khoá true: chặn nêu settings.json';
}
if (want('CK-4-settings-hong')) {
  if (await chayCa('CK-4-settings-hong', () => ck4SettingsHong(KIT)) && want('CK-4-settings-hong-do')) {
    const DONG = "  if (v === undefined || v === '' || v === 'false') return { bat: false };\n";
    const m = banSao([['lib/chan-lo-trinh.cjs', DONG + '  let b;\n', '  let b;\n'], ['lib/chan-lo-trinh.cjs', '  if (!b.bat) return { bat: false };\n', '  if (!b.bat) return { bat: false };\n' + DONG]]);
    await chayDo('CK-4-settings-hong-do', () => ck4SettingsHong(m), 'kho không bật bị chặn vì settings.json hỏng');
  }
}


rmSync(TMP, { recursive: true, force: true });
console.log(`kho-cam-ket-co-lo-trinh: ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
