#!/usr/bin/env node
// Bộ đo hồ sơ design-floor-moc-s0-s1 (FL4): lệnh bậc S0, lệnh S1, khối thẻ «Sàn thiết kế», hai khối SKILL.
// Kho fixture M0–M3, chỉ mục tri thức và tệp khoá đều do mã sinh trong chính lượt chạy; khối tri_thuc của tệp khoá fixture
// rút từ bên VIẾT thật (khoiTriThuc của lib/khoa.mjs). Mỗi nhãn chạy chiều xanh trên cây thật rồi đột biến cùng nhãn trên
// bản sao lệnh — đột biến phải làm đúng ca đỏ với đúng thông điệp ghim.
// Dùng: node tests/design-floor/moc-s0-s1.mjs [--chi BAC,BAC-HONG,TT,TT-LECH,RP,FL,THE,GHI,SKILL,TT-THAT]
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path, { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { khoiTriThuc } from './lib/khoa.mjs';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const TMP = mkdtempSync(join(tmpdir(), 'df-moc-'));
const KHOA_THAT = JSON.parse(readFileSync(join(KIT, 'design-floor', 'upstream.lock.json'), 'utf8'));
const SLUG = 'vd';
const bam = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');

// ── fixture ───────────────────────────────────────────────────────────────────────────────────────────
const TOKENS = JSON.stringify({ color: { muted: { $type: 'color', $value: '#888888' }, ink: { $type: 'color', $value: '#111111' } } });
const REG = JSON.stringify({ version: '0.1.0', components: [{ name: 'Page header/Default', category: 'layout', markup: '<header></header>', tokensUsed: ['color.ink'] }] });
const BANG = '| Slot | Rung | Use | Reason |\n|---|---|---|---|\n';
const PLAN_DAT = `## Screen: Home\nPattern: none — single screen\n\n${BANG}| header | 3 | Page header/Default | — |\n| tint | 6 | color.muted | — |\n`;
const PLAN_TRUOT = `## Screen: Home\nPattern: none — single screen\n\n${BANG}| header | 3 | Ghost header | — |\n`;
const FLOW_DAT = JSON.stringify({ screens: [{ id: 'a' }, { id: 'b', terminal: true }], transitions: [{ id: 't1', from: 'a', to: 'b', trigger: 'ON_CLICK' }], entryPoints: [{ id: 'e', screen: 'a' }] });
// Đỏ thật: màn b là ngõ cụt (không terminal, không lối ra) và c treo — lint phải thấy lỗi.
const FLOW_TRUOT = JSON.stringify({ screens: [{ id: 'a' }, { id: 'b' }], transitions: [{ id: 't1', from: 'a', to: 'b', trigger: 'ON_CLICK' }, { id: 't2', from: 'a', to: 'c', trigger: 'ON_CLICK' }], entryPoints: [{ id: 'e', screen: 'a' }] });
const CHU_KHOP = 'reuse registry-lookup contrast focus flow';

let dem = 0;
function kho({ globs = ['web/**'], khop = true, tokens = 'design/t.json', registry = 'design/r.json', niem = null, coTokens = true, coReg = true, hoSo = {} } = {}) {
  const R = join(TMP, `kho-${++dem}`);
  mkdirSync(join(R, '_acceptance', SLUG), { recursive: true });
  mkdirSync(join(R, 'web'));
  mkdirSync(join(R, 'design'));
  writeFileSync(join(R, khop ? 'web/a.html' : 'design/a.html'), '<html></html>\n');
  if (coTokens) writeFileSync(join(R, 'design/t.json'), TOKENS);
  if (coReg) writeFileSync(join(R, 'design/r.json'), REG);
  let cfg = '';
  if (globs) cfg += `design:\n  surface_globs: [${globs.map((g) => `"${g}"`).join(', ')}]\n`;
  if (tokens || registry || niem) {
    cfg += 'design_floor:\n';
    if (tokens) cfg += `  tokens: ${tokens}\n`;
    if (registry) cfg += `  registry: ${registry}\n`;
    if (niem) cfg += `  niem_phong: "${niem}"\n`;
  }
  writeFileSync(join(R, '_acceptance', 'config.yaml'), cfg);
  const hs = { 'contract.md': `---\nfeature: vd\n---\n${CHU_KHOP}\n`, ...hoSo };
  for (const [ten, noi] of Object.entries(hs)) if (noi !== null) writeFileSync(join(R, '_acceptance', SLUG, ten), noi);
  execFileSync('git', ['init', '-q'], { cwd: R });
  execFileSync('git', ['add', '-A'], { cwd: R });
  return R;
}
const M = {
  M0: () => kho({ globs: null, tokens: null, registry: null }),
  M1: (o = {}) => kho({ tokens: null, registry: null, ...o }),
  M2: (o = {}) => kho(o),
  M3: (o = {}) => kho({ niem: '2026-10-27 chu kho', ...o }),
};

// Chỉ mục tri thức fixture: sáu mục, điểm với CHU_KHOP = delta 4 · alpha 2 · beta 2 · gamma 1 · eps 1 · omega 0.
function triThucFixture() {
  const G = mkdtempSync(join(TMP, 'tt-'));
  mkdirSync(join(G, 'knowledge'));
  const muc = [['alpha', ['reuse', 'registry-lookup', 'zeta']], ['beta', ['contrast', 'focus']], ['gamma', ['flow']],
    ['delta', ['reuse', 'contrast', 'flow', 'registry-lookup']], ['eps', ['focus']], ['omega', ['nomatch-tag']]];
  const entries = muc.map(([id, when], i) => {
    writeFileSync(join(G, 'knowledge', `${id}.md`), `# ${id}\n${'x'.repeat(100 * (i + 1))}\n`);
    return { id, path: `knowledge/${id}.md`, description: id, when };
  });
  writeFileSync(join(G, 'knowledge', 'index.json'), `${JSON.stringify({ version: 1, entries }, null, 2)}\n`);
  const khoa = { ...KHOA_THAT, tri_thuc: khoiTriThuc(G) };
  const k = join(G, 'khoa.json');
  writeFileSync(k, JSON.stringify(khoa));
  return { G, khoa: k };
}

// ── chạy ─────────────────────────────────────────────────────────────────────────────────────────────
function chay(kit, ten, args, cwd, env = {}) {
  const r = spawnSync(process.execPath, [join(kit, 'scripts', ten), ...args], { cwd, encoding: 'utf8', env: { ...process.env, ...env } });
  return { ec: r.status, out: r.stdout || '', err: r.stderr || '' };
}
const bac = (kit, R) => chay(kit, 'design-floor-bac.mjs', ['--root', R], R);
const s1 = (kit, R, env) => chay(kit, 'design-floor-s1.mjs', ['--root', R, '--slug', SLUG], R, env);
const ketS1 = (R) => JSON.parse(readFileSync(join(R, '_acceptance', SLUG, 'design-floor.json'), 'utf8'));

// Bản sao kit cho đột biến: mọi thư mục là liên kết, riêng scripts/ là thư mục thật chứa liên kết từng tệp; tệp bị
// đột biến được chép rồi sửa. `sua` = [tệp, [chuỗi cũ, chuỗi mới]...]; chuỗi cũ phải có (không thì đột biến hỏng).
function kitDotBien(tep, ...cap) {
  const K = mkdtempSync(join(TMP, 'kit-'));
  for (const d of ['lib', 'design-floor', 'skills', 'feature-loop', 'commands', 'hooks', 'tests', 'docs']) if (existsSync(join(KIT, d))) symlinkSync(join(KIT, d), join(K, d));
  for (const f of ['CONTEXT.md', 'package.json']) if (existsSync(join(KIT, f))) symlinkSync(join(KIT, f), join(K, f));
  mkdirSync(join(K, 'scripts'));
  for (const f of readdirSync(join(KIT, 'scripts'))) if (f !== tep) symlinkSync(join(KIT, 'scripts', f), join(K, 'scripts', f));
  let noi = readFileSync(join(KIT, 'scripts', tep), 'utf8');
  for (const [cu, moi] of cap) {
    if (!noi.includes(cu)) throw new Error(`đột biến hỏng: không thấy «${cu.slice(0, 60)}» trong ${tep}`);
    noi = noi.split(cu).join(moi);
  }
  writeFileSync(join(K, 'scripts', tep), noi);
  return K;
}

// ── ca ───────────────────────────────────────────────────────────────────────────────────────────────
// Mỗi ca: (kit) → null khi đạt, chuỗi thông điệp khi đỏ.
const CA = {
  'BAC-M0': (kit) => { const r = bac(kit, M.M0()); return r.ec === 0 && r.out === '' ? null : `BAC-M0: thoát ${r.ec}, in «${r.out.trim()}», mong im lặng thoát 0`; },
  'BAC-M1': (kit) => kiemBac(kit, M.M1(), 'M1'),
  'BAC-M2': (kit) => kiemBac(kit, M.M2(), 'M2'),
  'BAC-M3': (kit) => kiemBac(kit, M.M3(), 'M3'),
  'BAC-HONG': (kit) => {
    const ca = [
      ['niem_phong thiếu tokens', M.M3({ tokens: null }), 'M1', 'design_floor.tokens chưa khai', M.M3()],
      ['tokens trỏ tệp vắng', M.M2({ coTokens: false }), 'M1', 'design_floor.tokens trỏ tệp không có', M.M2()],
      ['tokens có mà registry vắng', M.M2({ registry: null }), 'M1', 'design_floor.registry chưa khai', M.M2()],
      ['surface_globs không khớp', M.M1({ khop: false }), 'M0', 'design.surface_globs không khớp', M.M1()],
    ];
    for (const [ten, R, mong, lyDo, lanh] of ca) {
      const j = JSON.parse(chay(kit, 'design-floor-bac.mjs', ['--root', R, '--json'], R).out);
      if (j.bac !== mong || !j.ly_do.includes(lyDo)) return `BAC-HONG: ${ten} ra ${j.bac} «${j.ly_do}», mong ${mong} gọi tên «${lyDo}»`;
      const jl = JSON.parse(chay(kit, 'design-floor-bac.mjs', ['--root', lanh, '--json'], lanh).out);
      if (jl.bac === mong) return `BAC-HONG: đối chứng hỏng — kho lành của ca «${ten}» cũng ra ${jl.bac}`;
    }
    return null;
  },
  'TT-CHON': (kit) => {
    const { G, khoa } = triThucFixture();
    const R = M.M2();
    s1(kit, R, { DESIGN_FLOOR_TRI_THUC: G, DESIGN_FLOOR_KHOA: khoa });
    const t = ketS1(R).tri_thuc;
    if (t.tep.length > 2) return `TT-CHON: ${t.tep.length} tệp, trần 2`;
    const ids = t.tep.map((x) => x.id).join(',');
    if (ids !== 'delta,alpha') return `TT-CHON: chọn ${ids || '(không)'}, mong delta,alpha`;
    const tok = (p) => Math.ceil(statSync(join(G, p)).size / 4);
    if (t.chi_muc.token !== tok('knowledge/index.json')) return `TT-CHON: token chỉ mục ${t.chi_muc.token} ≠ ${tok('knowledge/index.json')}`;
    for (const x of t.tep) if (x.token !== tok(x.path)) return `TT-CHON: token ${x.path} ${x.token} ≠ ${tok(x.path)}`;
    return null;
  },
  'TT-KHONG': (kit) => {
    const { G, khoa } = triThucFixture();
    const R = M.M2({ hoSo: { 'contract.md': '---\nfeature: vd\n---\nchữ thuần tiếng Việt, không thẻ nào\n' } });
    s1(kit, R, { DESIGN_FLOOR_TRI_THUC: G, DESIGN_FLOOR_KHOA: khoa });
    const t = ketS1(R).tri_thuc;
    return t.trang_thai === 'doc-duoc' && t.tep.length === 0 && t.chi_muc ? null : `TT-KHONG: ${t.trang_thai} · ${t.tep.length} tệp, mong chỉ chỉ mục`;
  },
  'TT-LECH': (kit) => kiemLech(kit, (G) => writeFileSync(join(G, 'knowledge', 'delta.md'), 'sửa một byte\n'), 'knowledge/delta.md', 'TT-LECH'),
  'TT-LECH-CHI-MUC': (kit) => kiemLech(kit, (G) => writeFileSync(join(G, 'knowledge', 'index.json'), `${readFileSync(join(G, 'knowledge', 'index.json'), 'utf8')} `), 'knowledge/index.json', 'TT-LECH-CHI-MUC'),
  'TT-VANG': (kit) => {
    const R = M.M2({ hoSo: { 'reuse-plan.md': PLAN_DAT } });
    const rong = mkdtempSync(join(TMP, 'tmpdir-'));
    s1(kit, R, { DESIGN_FLOOR_KHONG_MANG: '1', DESIGN_FLOOR_CACHE: join(rong, 'khong-co'), TMPDIR: rong, DESIGN_FLOOR_TRI_THUC: '' });
    const j = ketS1(R);
    if (j.tri_thuc.trang_thai !== 'khong-doc' || !j.dong.some((d) => d.includes('không đọc được ở đây'))) return `TT-VANG: tri thức ${j.tri_thuc.trang_thai}, mong «không đọc được ở đây»`;
    return j.reuse_plan ? null : 'TT-VANG: kiểm kế hoạch dùng lại không chạy khi tri thức vắng';
  },
  'RP-DAT': (kit) => { const j = s1Voi(kit, M.M2({ hoSo: { 'reuse-plan.md': PLAN_DAT } })); return j.dong.includes('Kế hoạch dùng lại: đạt') ? null : `RP-DAT: ${dongCua(j, 'Kế hoạch dùng lại')}`; },
  'RP-TRUOT': (kit) => { const j = s1Voi(kit, M.M2({ hoSo: { 'reuse-plan.md': PLAN_TRUOT } })); return j.dong.includes('Kế hoạch dùng lại: trượt (1 tên)') ? null : `RP-TRUOT: ${dongCua(j, 'Kế hoạch dùng lại')}`; },
  'RP-M1': (kit) => {
    const ghiLai = join(TMP, `goi-${++dem}.log`);
    const vo = join(TMP, `vo-${dem}.mjs`);
    writeFileSync(vo, `import { appendFileSync } from 'node:fs';\nappendFileSync(${JSON.stringify(ghiLai)}, process.argv.slice(2).join(' ') + '\\n');\nconsole.log('{}');\n`);
    const soGoi = () => (existsSync(ghiLai) ? readFileSync(ghiLai, 'utf8').trim().split('\n').filter(Boolean).length : 0);
    const R1 = M.M1({ hoSo: { 'reuse-plan.md': PLAN_DAT } });
    const j1 = s1Voi(kit, R1, { DESIGN_FLOOR_UI: vo });
    if (!j1.dong.includes('Kế hoạch dùng lại: chưa khai nguồn — không kiểm')) return `RP-M1: ${dongCua(j1, 'Kế hoạch dùng lại')}`;
    if (soGoi() !== 0) return `RP-M1: kho M1 gọi bản gói ${soGoi()} lần`;
    s1Voi(kit, M.M2({ hoSo: { 'reuse-plan.md': PLAN_DAT } }), { DESIGN_FLOOR_UI: vo });
    return soGoi() >= 1 ? null : 'RP-M1: đối chứng hỏng — vỏ ghi lại không thấy lời gọi nào ở kho M2';
  },
  'FL-DAT': (kit) => { const j = s1Voi(kit, M.M2({ hoSo: { 'flow.json': FLOW_DAT } })); return j.dong.includes('Luồng: đạt') ? null : `FL-DAT: ${dongCua(j, 'Luồng')}`; },
  'FL-TRUOT': (kit) => {
    const j = s1Voi(kit, M.M2({ hoSo: { 'flow.json': FLOW_TRUOT } }));
    return j.flow && j.flow.ket === 'truot' && j.flow.n > 0 && j.dong.includes(`Luồng: trượt (${j.flow.n} lỗi)`) ? null : `FL-TRUOT: ${dongCua(j, 'Luồng')}`;
  },
  'FL-VANG': (kit) => {
    const j = s1Voi(kit, M.M2());
    return j.dong.some((d) => /^(Luồng|Kế hoạch dùng lại):/.test(d)) ? `FL-VANG: có dòng khi hồ sơ không có tệp — ${j.dong.join(' | ')}` : null;
  },
  'THE-KHOI': (kit) => {
    const R = hoSoThe();
    const truoc = theExtract(kit, R);
    const dong = ['Bậc kho: M2 — nguồn a · b', 'Tri thức thiết kế: chỉ mục (10 token) + knowledge/x.md (5 token)', 'Luồng: trượt (2 lỗi)'];
    writeFileSync(join(R, '_acceptance', 'design-floor-moc-s0-s1', 'design-floor.json'), JSON.stringify({ schema: 1, bac: 'M2', dong }));
    const sau = theExtract(kit, R);
    const html = theHtml(kit, R);
    if (!html.includes('<div class="lab">Sàn thiết kế (thông tin, không cần trả lời)</div>')) return 'THE-KHOI: thiếu khối Sàn thiết kế';
    for (const d of dong) if (!html.includes(d.replace(/&/g, '&amp;').replace(/</g, '&lt;'))) return `THE-KHOI: thiếu dòng «${d}»`;
    if (JSON.stringify(truoc.routing) !== JSON.stringify(sau.routing)) return `THE-KHOI: routing đổi ${JSON.stringify(truoc.routing.hoi)} → ${JSON.stringify(sau.routing.hoi)}`;
    return null;
  },
  'THE-M0': (kit) => {
    const R = hoSoThe();
    const goc = gocNhanhChinh();
    const a = theHtml(goc, R);
    const b = theHtml(kit, R);
    return a === b ? null : 'THE-M0: thẻ đổi khi không có design-floor.json';
  },
  'GHI-CHI': (kit) => {
    const R = M.M2({ hoSo: { 'reuse-plan.md': PLAN_DAT, 'flow.json': FLOW_DAT, 'usage-report.md': '# usage\n' } });
    const truoc = chup(R);
    const r = s1Voi(kit, R, {}, true);
    const sau = chup(R);
    const hs = `_acceptance/${SLUG}/`;
    for (const [f, h] of sau) {
      if (f === `${hs}design-floor.json`) continue;
      if (f === `${hs}usage-report.md`) continue;
      if (truoc.get(f) !== h) return `GHI-CHI: tệp ngoài phạm vi ghi: ${f}`;
    }
    if (!sau.has(`${hs}design-floor.json`)) return 'GHI-CHI: không ghi design-floor.json';
    const them = readFileSync(join(R, hs, 'usage-report.md'), 'utf8').slice('# usage\n'.length).split('\n').filter(Boolean);
    if (them.length !== 1 || !/token/.test(them[0])) return `GHI-CHI: usage-report thêm ${them.length} dòng «${them.join(' | ')}», mong một dòng mang token`;
    return r ? null : 'GHI-CHI: lệnh không chạy';
  },
  'GHI-M0': (kit) => {
    const R = M.M0();
    const truoc = chup(R);
    const r = s1(kit, R);
    const sau = chup(R);
    if (sau.size !== truoc.size || [...sau].some(([f, h]) => truoc.get(f) !== h)) return 'GHI-M0: kho M0 bị ghi';
    if (r.ec !== 0 || r.out !== '') return `GHI-M0: thoát ${r.ec}, in «${r.out.trim()}»`;
    const R2 = M.M2();
    s1(kit, R2, { DESIGN_FLOOR_KHONG_MANG: '1', TMPDIR: mkdtempSync(join(TMP, 'tmpdir-')), DESIGN_FLOOR_CACHE: join(TMP, 'khong-co') });
    return existsSync(join(R2, '_acceptance', SLUG, 'design-floor.json')) ? null : 'GHI-M0: đối chứng hỏng — kho M2 cũng không ghi';
  },
  'SKILL-S0': (kit, skill) => kiemSkill(kit, skill, 'DESIGN-FLOOR-S0', 'design-floor-bac.mjs', ['--root', '.']),
  'SKILL-S1': (kit, skill) => kiemSkill(kit, skill, 'DESIGN-FLOOR-S1', 'design-floor-s1.mjs', ['--root', '.', '--slug', SLUG]),
  'TT-THAT': (kit, khoaPath) => {
    const khoa = JSON.parse(readFileSync(khoaPath, 'utf8'));
    const R = M.M2();
    s1(kit, R, { DESIGN_FLOOR_KHOA: khoaPath, DESIGN_FLOOR_TRI_THUC: '' });
    const j = ketS1(R);
    const goc = j.tri_thuc.goc;
    if (!goc) return /^lệch băm /.test(j.tri_thuc.ly_do) ? `TT-THAT: ${j.tri_thuc.ly_do}` : `TT-THAT: không tải được — ${j.tri_thuc.ly_do}`;
    if (path.resolve(goc).startsWith(path.resolve(R))) return `TT-THAT: bộ đệm nằm trong cây kho: ${goc}`;
    for (const t of [khoa.tri_thuc.chi_muc, ...khoa.tri_thuc.tep]) if (bam(join(goc, t.path)) !== t.sha256) return `TT-THAT: lệch băm ${t.path}`;
    if (j.tri_thuc.trang_thai !== 'doc-duoc' || j.tri_thuc.tep.length > 2) return `TT-THAT: ${j.tri_thuc.trang_thai} · ${j.tri_thuc.tep.length} tệp`;
    return null;
  },
};

function kiemBac(kit, R, mong) {
  const r = bac(kit, R);
  const m = /^design-floor: bậc (M\d) — (.+)$/.exec(r.out.trim());
  if (r.ec !== 0 || !m) return `BAC-${mong}: thoát ${r.ec}, in «${r.out.trim()}»`;
  return m[1] === mong ? null : `BAC-${mong}: ra ${m[1]}, mong ${mong}`;
}
function kiemLech(kit, pha, tenTep, id) {
  const { G, khoa } = triThucFixture();
  const lanh = M.M2();
  s1(kit, lanh, { DESIGN_FLOOR_TRI_THUC: G, DESIGN_FLOOR_KHOA: khoa });
  if (ketS1(lanh).tri_thuc.tep.length !== 2) return `${id}: đối chứng hỏng — bản lành không trỏ hai tệp`;
  pha(G);
  const R = M.M2({ hoSo: { 'reuse-plan.md': PLAN_DAT, 'flow.json': FLOW_DAT } });
  s1(kit, R, { DESIGN_FLOOR_TRI_THUC: G, DESIGN_FLOOR_KHOA: khoa });
  const j = ketS1(R);
  const d = j.dong.find((x) => x.startsWith('Tri thức thiết kế:')) || '';
  if (!d.includes('không đọc được ở đây') || !d.includes(tenTep)) return `${id}: «${d}», mong «không đọc được ở đây» gọi tên ${tenTep}`;
  if (j.tri_thuc.tep.length) return `${id}: vẫn trỏ ${j.tri_thuc.tep.length} tệp`;
  return j.reuse_plan && j.flow ? null : `${id}: hai kiểm còn lại không chạy`;
}
function s1Voi(kit, R, env = {}, tho = false) {
  const { G, khoa } = triThucFixture();
  const r = s1(kit, R, { DESIGN_FLOOR_TRI_THUC: G, DESIGN_FLOOR_KHOA: khoa, ...env });
  if (tho) return r.ec === 0;
  return existsSync(join(R, '_acceptance', SLUG, 'design-floor.json')) ? ketS1(R) : { dong: [`(không có design-floor.json — thoát ${r.ec} ${r.err.trim()})`] };
}
const dongCua = (j, dau) => j.dong.find((d) => d.startsWith(dau)) || `(không có dòng ${dau}: ${j.dong.join(' | ')})`;
function chup(R) {
  const ra = new Map();
  const di = (d) => {
    for (const f of readdirSync(join(R, d))) {
      if (f === '.git') continue;
      const rel = d ? `${d}/${f}` : f;
      if (statSync(join(R, rel)).isDirectory()) di(rel);
      else ra.set(rel, bam(join(R, rel)));
    }
  };
  di('');
  return ra;
}

// Hồ sơ cho thẻ: bản sao hồ sơ của chính vòng (không design-floor.json) + config kit, ở một gốc tạm.
function hoSoThe() {
  const R = mkdtempSync(join(TMP, 'the-'));
  mkdirSync(join(R, '_acceptance'));
  cpSync(join(KIT, '_acceptance', 'config.yaml'), join(R, '_acceptance', 'config.yaml'));
  cpSync(join(KIT, '_acceptance', 'design-floor-moc-s0-s1'), join(R, '_acceptance', 'design-floor-moc-s0-s1'), { recursive: true });
  for (const f of ['design-floor.json', 'evidence-report.md', 'review-findings.md']) rmSync(join(R, '_acceptance', 'design-floor-moc-s0-s1', f), { force: true });
  return R;
}
function theHtml(kit, R) {
  const r = spawnSync(process.execPath, [join(kit, 'scripts', 'gate-card.js'), '--root', R, '--slug', 'design-floor-moc-s0-s1', '--gate', '1'], { encoding: 'utf8' });
  return (r.stdout || '').split(kit).join('<KIT>');
}
function theExtract(kit, R) {
  const r = spawnSync(process.execPath, [join(kit, 'scripts', 'gate-card.js'), '--root', R, '--slug', 'design-floor-moc-s0-s1', '--gate', '1', '--extract'], { encoding: 'utf8' });
  return JSON.parse(r.stdout);
}
// Bản gốc: scripts + lib + skills của điểm rẽ khỏi nhánh chính, lấy TRỌN thư mục (git archive).
let gocCache = null;
function gocNhanhChinh() {
  if (gocCache) return gocCache;
  let base;
  for (const ref of ['origin/main', 'main']) {
    try { base = execFileSync('git', ['merge-base', 'HEAD', ref], { cwd: KIT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); break; } catch { /* thử ref kế */ }
  }
  if (!base) throw new Error('không tìm được điểm rẽ khỏi nhánh chính');
  const G = mkdtempSync(join(TMP, 'goc-'));
  const tar = execFileSync('git', ['archive', base, 'scripts', 'lib', 'skills'], { cwd: KIT, maxBuffer: 1 << 28 });
  execFileSync('tar', ['-x', '-C', G], { input: tar });
  gocCache = G;
  return G;
}

function kiemSkill(kit, skillPath, khoiTen, tepLenh, doiSo) {
  const md = readFileSync(skillPath, 'utf8');
  const a = md.indexOf(`<!-- <<<${khoiTen} -->`);
  const b = md.indexOf(`<!-- ${khoiTen}>>> -->`);
  const id = khoiTen === 'DESIGN-FLOOR-S0' ? 'SKILL-S0' : 'SKILL-S1';
  if (a < 0 || b < a) return `${id}: thiếu khối ${khoiTen}`;
  const m = /```\n([\s\S]*?)\n```/.exec(md.slice(a, b));
  if (!m || !m[1].includes(`scripts/${tepLenh}`)) return `${id}: khối ${khoiTen} không gọi scripts/${tepLenh}`;
  const lenh = m[1].trim()
    .replace('"$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs"', JSON.stringify(join(kit, 'feature-loop', 'scripts', 'resolve-plugin.mjs')))
    .replace('--plugin acceptance-gate', `--plugin acceptance-gate --root ${JSON.stringify(kit)}`)
    .replace("'<slug>'", SLUG);
  const { G, khoa } = triThucFixture();
  const env = { ...process.env, DESIGN_FLOOR_TRI_THUC: G, DESIGN_FLOOR_KHOA: khoa };
  const A = M.M2();
  const B = M.M2();
  const quaKhoi = spawnSync('bash', ['-c', lenh], { cwd: A, encoding: 'utf8', env });
  const truc = spawnSync(process.execPath, [join(kit, 'scripts', tepLenh), ...doiSo], { cwd: B, encoding: 'utf8', env });
  const chuan = (s) => (s || '').split(A).join('<K>').split(B).join('<K>');
  if (quaKhoi.status !== 0) return `${id}: lệnh rút từ khối thoát ${quaKhoi.status}: ${(quaKhoi.stderr || '').trim().split('\n')[0]}`;
  if (!quaKhoi.stdout.trim() || chuan(quaKhoi.stdout) !== chuan(truc.stdout)) return `${id}: đầu ra qua khối «${quaKhoi.stdout.trim()}» ≠ gọi trực tiếp «${truc.stdout.trim()}»`;
  return null;
}

// ── nhãn: chiều xanh + đột biến ─────────────────────────────────────────────────────────────────────
const SKILL = join(KIT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const NHAN = {
  BAC: { xanh: ['BAC-M0', 'BAC-M1', 'BAC-M2', 'BAC-M3'], dot: [['BAC-DOT', () => kitDotBien('design-floor-bac.mjs', ['} else if (niemPhong) {', '} else if (false) {']), 'BAC-M3', 'BAC-M3: ra M2, mong M3']] },
  'BAC-HONG': { xanh: ['BAC-HONG'], dot: [] },
  TT: { xanh: ['TT-CHON', 'TT-KHONG'], dot: [['TT-DOT', () => kitDotBien('design-floor-s1.mjs', ['const TRAN_TEP = 2;', 'const TRAN_TEP = 5;']), 'TT-CHON', 'TT-CHON: 5 tệp, trần 2']] },
  'TT-LECH': { xanh: ['TT-LECH', 'TT-LECH-CHI-MUC', 'TT-VANG'], dot: [] },
  RP: { xanh: ['RP-DAT', 'RP-TRUOT', 'RP-M1'], dot: [['RP-DOT', () => kitDotBien('design-floor-s1.mjs', ['const argv = hd.lenh[lenh].argv.map(', "const argv = hd.lenh[lenh].argv.filter((a, i, all) => a !== '--tokens' && all[i - 1] !== '--tokens').map("]), 'RP-DAT', 'RP-DAT: Kế hoạch dùng lại: không đo được (mã 4)']] },
  FL: { xanh: ['FL-DAT', 'FL-TRUOT', 'FL-VANG'], dot: [] },
  THE: {
    xanh: ['THE-KHOI', 'THE-M0'],
    dot: [
      ['THE-DOT', () => kitDotBien('gate-card.js', ['if (sanTk) P.push(', 'if (false) P.push(']), 'THE-KHOI', 'THE-KHOI: thiếu khối Sàn thiết kế'],
      ['THE-DOT-KHUNG', () => kitDotBien('gate-card.js', ['if (sanTk) P.push(`<div class="lab">Sàn thiết kế (thông tin, không cần trả lời)</div><div class="grp gnot">${sanTk.dong', 'P.push(`<div class="lab">Sàn thiết kế (thông tin, không cần trả lời)</div><div class="grp gnot">${(sanTk ? sanTk.dong : [])']), 'THE-M0', 'THE-M0: thẻ đổi khi không có design-floor.json'],
    ],
  },
  GHI: {
    xanh: ['GHI-CHI', 'GHI-M0'],
    dot: [
      ['GHI-DOT', () => kitDotBien('design-floor-s1.mjs', ["  writeFileSync(path.join(hs, 'design-floor.json')", "  appendFileSync(path.join(root, '_acceptance', 'config.yaml'), '# dot\\n');\n  writeFileSync(path.join(hs, 'design-floor.json')"]), 'GHI-CHI', 'GHI-CHI: tệp ngoài phạm vi ghi: _acceptance/config.yaml'],
      ['GHI-DOT-M0', () => kitDotBien('design-floor-s1.mjs', ["  if (bac.bac === 'M0') return null;\n", '']), 'GHI-M0', 'GHI-M0: kho M0 bị ghi'],
    ],
  },
  SKILL: { xanh: ['SKILL-S0', 'SKILL-S1'], dot: [['SKILL-DOT', () => ({ skill: boKhoi(SKILL, 'DESIGN-FLOOR-S1') }), 'SKILL-S1', 'SKILL-S1: thiếu khối DESIGN-FLOOR-S1']] },
  'TT-THAT': { xanh: ['TT-THAT'], dot: [['TT-THAT-DOT', () => ({ khoa: khoaSuaBam() }), 'TT-THAT', 'TT-THAT: lệch băm']] },
};
function boKhoi(p, ten) {
  const md = readFileSync(p, 'utf8');
  const a = md.indexOf(`<!-- <<<${ten} -->`);
  const b = md.indexOf(`<!-- ${ten}>>> -->`) + `<!-- ${ten}>>> -->`.length;
  if (a < 0) throw new Error(`đột biến hỏng: SKILL không có khối ${ten}`);
  const q = join(TMP, `SKILL-${++dem}.md`);
  writeFileSync(q, md.slice(0, a) + md.slice(b));
  return q;
}
function khoaSuaBam() {
  const k = structuredClone(KHOA_THAT);
  k.tri_thuc.tep[0].sha256 = '0'.repeat(64);
  const q = join(TMP, `khoa-${++dem}.json`);
  writeFileSync(q, JSON.stringify(k));
  return q;
}

function chayCa(id, kit = KIT, them = {}) {
  try {
    if (id.startsWith('SKILL-')) return CA[id](kit, them.skill || SKILL);
    if (id === 'TT-THAT') return CA[id](kit, them.khoa || join(KIT, 'design-floor', 'upstream.lock.json'));
    return CA[id](kit);
  } catch (e) {
    return `${id}: ca hỏng — ${String(e.message).split('\n')[0]}`;
  }
}

const argv = process.argv.slice(2);
const iChi = argv.indexOf('--chi');
const chi = iChi >= 0 ? argv[iChi + 1].split(',') : Object.keys(NHAN);
let hong = 0;
for (const nhan of chi) {
  const n = NHAN[nhan];
  if (!n) { console.log(`FAIL: nhãn lạ ${nhan}`); hong++; continue; }
  if (nhan === 'TT-THAT' && process.env.DESIGN_FLOOR_KHONG_MANG) { console.log('SKIP: TT-THAT (không mạng)'); continue; }
  for (const id of n.xanh) {
    const loi = chayCa(id);
    if (loi) { console.log(`FAIL: ${loi}`); hong++; } else console.log(`PASS: ${id}`);
  }
  for (const [ten, dung, ca, ghim] of n.dot) {
    let loi;
    try {
      const d = dung();
      loi = typeof d === 'string' ? chayCa(ca, d) : chayCa(ca, KIT, d);
    } catch (e) {
      loi = `đột biến không dựng được — ${e.message}`;
    }
    if (loi && loi.startsWith(ghim)) console.log(`PASS: ${ten} — đỏ đúng «${loi}»`);
    else { console.log(`FAIL: ${ten} — mong ca ${ca} đỏ «${ghim}…», được ${loi ? `«${loi}»` : 'XANH'}`); hong++; }
  }
}
rmSync(TMP, { recursive: true, force: true });
console.log(hong ? `moc-s0-s1: ĐỎ ${hong}` : 'moc-s0-s1: XANH');
process.exit(hong ? 1 : 0);
