#!/usr/bin/env node
// road-map-de-dung.test.mjs — hồ sơ road-map-de-dung (vòng RD1), ca RD-<n> = AC-n. Mỗi eval ghim đúng dòng «PASS: RD-…».
//
// Kho thử do CODE sinh trong lượt (thư mục tạm, git init, commit). Bản chụp crm onehub do tests/scripts/chup-crm-onehub.mjs
// chụp từ git của crm vào fixtures/lo-trinh/crm-onehub-1017/ (sha ghi ở nguon.json). BỘ MÁY CŨ = `git archive v2.32.0 scripts lib
// skills` (trọn thư mục). Mỗi ca đỏ chạy CHÍNH hàm đo trên BẢN SAO của vật (trọn scripts lib skills) với nhát tiêm khớp ĐÚNG một
// lần, SAU khi bản lành xanh, và ghim thông điệp. Mọi đường dẫn suy từ vị trí tệp này. Chọn ca: RD_CASES=RD-1,RD-1-do.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const FX = path.join(HERE, 'fixtures', 'lo-trinh');
const CRM = path.join(FX, 'crm-onehub-1017');
const HO = path.join(KIT, '_acceptance', 'road-map-de-dung');
const TMP = mkdtempSync(path.join(tmpdir(), 'rd1-'));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.RD_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.includes(id);
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...o });
let n = 0;

// ── Bộ máy: cây đang kiểm, bản sao bị tiêm, bộ máy cũ v2.32.0 ─────────────────────────────────────
function banSao(tiem = [], goc = KIT) {
  const c = path.join(TMP, `bs-${++n}`);
  for (const d of ['scripts', 'lib', 'skills']) cpSync(path.join(goc, d), path.join(c, d), { recursive: true });
  for (const [tep, cu, moi] of tiem) {
    const p = path.join(c, tep); const s = readFileSync(p, 'utf8'); const k = s.split(cu).length - 1;
    if (k !== 1) throw new Error(`nhát tiêm vào ${tep} khớp ${k} lần (cần 1): ${cu.slice(0, 60)}`);
    writeFileSync(p, s.replace(cu, moi));
  }
  return c;
}
let cu = null;
function boMayCu() {
  if (cu) return cu;
  const d = path.join(TMP, 'v2.32.0'); mkdirSync(d, { recursive: true });
  execFileSync('tar', ['-x', '-C', d], { input: execFileSync('git', ['-C', KIT, 'archive', '--format=tar', 'v2.32.0', 'scripts', 'lib', 'skills'], { maxBuffer: 1 << 28 }) });
  return (cu = d);
}
const chayCa = async (id, f, kit = KIT) => { try { const s = await f(kit); if (s.length) bad(id, s.join(' ; ')); else return true; } catch (e) { bad(id, loi(e)); } return false; };
// Chiều đỏ: bản lành (cây đang kiểm) PHẢI xanh trước, rồi CHÍNH hàm đo chạy trên bản sao bị tiêm.
const chayDo = async (id, f, tiem, ghim, moTa) => {
  try {
    const lanh = await f(KIT); if (lanh.length) { bad(id, `bản lành chưa xanh — không tin được chiều đỏ: ${lanh[0]}`); return; }
    const s = await f(banSao(tiem)); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm đo trả «${g.slice(0, 120)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 240)}`);
  } catch (e) { bad(id, loi(e)); }
};

// ── Kho thử ────────────────────────────────────────────────────────────────────────────────────────
function kho({ tep = { 'docs/plan/lo-trinh.json': { schema: 1, hang: [] } }, them = {} } = {}) {
  const r = path.join(TMP, `kho-${++n}`); mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'x');
  const ds = Object.keys(tep);
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), `schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\nlo_trinh:\n  tep:\n${ds.map(t => `    - ${t}\n`).join('')}`);
  for (const [t, d] of Object.entries({ ...tep, ...them })) {
    const p = path.join(r, t); mkdirSync(path.dirname(p), { recursive: true });
    writeFileSync(p, typeof d === 'string' ? d : JSON.stringify(d, null, 2) + '\n');
  }
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'kho thu');
  return r;
}
const vietPV = (dot, ma) => `# Bản phạm vi thử\n\ndot: ${dot}\ndang: chuoi\nnguon: kho thử\n\n${ma.map(c => `- \`${c}\` — mô tả ${c}`).join('\n')}\n`;
const rang = (kit, r) => node([path.join(kit, 'scripts', 'cat-luot.mjs'), '--root', r, '--pham-vi', 'docs/plan/pham-vi.md', '--lo-trinh', 'docs/plan/lo-trinh.json']);
const khoCL = (lt, ma) => kho({ tep: { 'docs/plan/lo-trinh.json': { schema: 1, ...lt } }, them: { 'docs/plan/pham-vi.md': vietPV('d1', ma) } });
const dong = (x, dau) => x.stdout.split('\n').filter(l => l.startsWith(dau));
const HC = (ma, o = {}) => ({ ma, cau_giao: `«việc ${ma} chạy đúng»`, dot: 'd1', phu: [`P-${ma}`], vai: 'nen', bat_khi: 'đo được', tieu_chi: 9, ...o });
const MN = (ma, o = {}) => ({ ma, ten: `việc vận hành ${ma}`, ngay: '2026-10-20', loai: 'ngoai', ai: 'Nhân sự', dot: 'd1', phu: [`P-${ma}`], ...o });

// ═══ AC-1: cắt lượt theo luật 17/10 — không mốc ngoài, bảng phủ hai chỗ ═══════════════════════════
const BON_CHO = ['ngày của mốc phát triển', 'ô cơ hội', 'Ra khỏi kho', 'Chờ điều kiện'];
async function rd1(kit) {
  const sai = [];
  const C = await import(pathToFileURL(path.join(kit, 'scripts', 'cat-luot.mjs')).href + `?v=${++n}`);
  if (C.CO_TEN.includes('van-hanh-lap-chua-tu-phuc-vu') || !C.CO_TEN.includes('moc-ngoai-da-bo')) sai.push(`CO_TEN ${JSON.stringify(C.CO_TEN)}`);
  // Đối chứng dương: hàng + Chờ điều kiện, không mốc ngoài → thoát 0, bảng phủ chỉ hai chỗ.
  const lanh = () => ({ hang: [HC('R1')], chan_troi: [{ ma: 'H1', dot: 'd1', cau_giao: '«việc sau»', ly_do: 'chờ', mo_lai_khi: 'khi khác', phu: ['P-H1'] }], moc: [] });
  const x = rang(kit, khoCL(lanh(), ['P-R1', 'P-H1']));
  if (x.status !== 0 || x.stdout.includes('mốc ngoài')) sai.push(`đối chứng: exit ${x.status} — ${dong(x, 'lỗi:').slice(0, 2).join(' | ')}`);
  // Ma trận viết sẵn: [tên, lộ trình, mã bản phạm vi, mã thoát, các cụm ghim phải có trong đầu ra].
  const CA = [
    ['chi-moc-ngoai', () => ({ ...lanh(), moc: [MN('V1')] }), ['P-R1', 'P-H1', 'P-V1'], 1, ['lỗi: mốc V1 [moc-ngoai-da-bo]:', ...BON_CHO, 'mã P-V1 không ở hàng hay mục chờ điều kiện nào']],
    ['moc-ngoai-va-hang', () => { const d = lanh(); d.hang[0].phu.push('P-V1'); d.moc = [MN('V1')]; return d; }, ['P-R1', 'P-H1', 'P-V1'], 1, ['lỗi: mốc V1 [moc-ngoai-da-bo]:', 'P-V1 → hàng R1']],
    ['chi-da-bac', () => ({ ...lanh(), da_bac: [{ ma: 'X1', dot: 'd1', phu: ['P-X1'], ly_do: 'vận hành' }] }), ['P-R1', 'P-H1', 'P-X1'], 1, ['mã P-X1 không ở hàng hay mục chờ điều kiện nào']],
    ['moc-ngoai-ngoai-dot', () => ({ ...lanh(), moc: [MN('V9', { dot: 'd2', phu: ['P-V9'] })] }), ['P-R1', 'P-H1'], 0, ['cảnh báo: [moc-ngoai-da-bo] 1 mốc ngoài đợt d1']],
    ['hang-cho-moc-ngoai', () => { const d = lanh(); d.hang.push(HC('R2', { dung_tren: ['V8'] })); d.moc = [MN('V8', { dot: 'd2', phu: [] })]; return d; }, ['P-R1', 'P-R2', 'P-H1'], 1, ['lỗi: hàng R2 [cho-van-hanh]:']],
    ['phat-hanh-mang-phu', () => ({ ...lanh(), moc: [{ ma: 'M1', ten: 'Phát hành', ngay: '2026-11-01', loai: 'phat-hanh', dot: 'd1', phu: ['P-R1'] }] }), ['P-R1', 'P-H1'], 1, ['mốc M1: mang mã của bản phạm vi']],
    ['dot-chi-moc-ngoai', () => ({ hang: [], chan_troi: [], moc: [MN('V1')] }), ['P-V1'], 1, ['đợt d1 chưa cắt']],
  ];
  for (const [ten, lt, ma, thoat, ghim] of CA) {
    const y = rang(kit, khoCL(lt(), ma)); const thieu = ghim.filter(g => !y.stdout.includes(g));
    if (y.status !== thoat || thieu.length) sai.push(`${ten}: exit ${y.status} (cần ${thoat}), thiếu ${JSON.stringify(thieu)} — ${y.stdout.split('\n').filter(l => /^(lỗi|cảnh báo):/.test(l)).slice(0, 3).join(' | ')}`);
    if (y.stdout.includes('→ mốc ngoài')) sai.push(`${ten}: bảng phủ còn chỗ «mốc ngoài»`);
  }
  console.log(`    · RD-1 ma trận ${CA.length} ca`);
  if (CA.length !== 7) sai.push(`ma trận ${CA.length} ca, hợp đồng hứa 7`);
  return sai;
}
if (want('RD-1') && await chayCa('RD-1', rd1)) ok('RD-1', '7/7 ca: mốc ngoài trong đợt → lỗi nêu bốn chỗ đến, không tính phủ; da_bac không là chỗ phủ; ngoài đợt gom một dòng; bảng phủ hai chỗ');
if (want('RD-1-do')) await chayDo('RD-1-do', async kit => (await rd1(kit)).map(s => s.includes('chi-moc-ngoai') ? `mã tính phủ ở mốc ngoài — ${s}` : s),
  [['scripts/cat-luot.mjs', '  const mocPhu = [];', '  const mocPhu = mocDot.filter(m => laNgoai(m) && Array.isArray(m.phu));']], 'mã tính phủ ở mốc ngoài', 'bản sao vẫn tính phủ cho mốc ngoài');
if (want('RD-1-do2')) await chayDo('RD-1-do2', async kit => (await rd1(kit)).map(s => s.includes('moc-ngoai-ngoai-dot') ? `mốc ngoài lọt lượt cắt — ${s}` : s),
  [['scripts/cat-luot.mjs', "  for (const m of mocNgoaiDot)", "  for (const m of [])"]], 'mốc ngoài lọt lượt cắt', 'bản sao không gom mốc ngoài ngoài đợt');

// ═══ AC-3: SKILL + khuôn + từ điển + ADR theo luật 17/10 ═══════════════════════════════════════════
const khoiMd = (txt, ten) => { const m = String(txt).match(new RegExp(`<!-- <<<${ten} -->\\n\`\`\`[a-z]*\\n([\\s\\S]*?)\`\`\`\\n<!-- ${ten}>>> -->`)); return m ? m[1] : null; };
const khoiBang = (txt, ten) => { const m = String(txt).match(new RegExp(`<!-- <<<${ten} -->\\n([\\s\\S]*?)<!-- ${ten}>>> -->`)); return m ? m[1] : null; };
async function rd3(kit) {
  const sai = []; const doc = (...p) => readFileSync(path.join(kit, ...p), 'utf8');
  const sk = doc('skills', 'cat-luot', 'SKILL.md');
  const vh = khoiMd(sk, 'CAT-LUOT-VAN-HANH'); if (vh == null) return ['SKILL thiếu khối CAT-LUOT-VAN-HANH'];
  for (const c of ['`ngay` của chính mốc phát triển', '`opportunity.md`', 'observed', '«Ra khỏi kho»', 'mục chờ điều kiện, `mo_lai_khi`'])
    if (!vh.includes(c)) sai.push(`khối VAN-HANH thiếu «${c}»`);
  if (/thành MỐC NGOÀI|mục `moc` có `loai: ngoai`/.test(vh)) sai.push('khối VAN-HANH còn dạy tạo mốc ngoài');
  const b1 = sk.slice(sk.indexOf('## Bước 1'), sk.indexOf('## Bước 2'));
  if (!/chỉ mục PHÁT TRIỂN thành dòng mã/.test(b1) || !b1.includes('«Ra khỏi kho»')) sai.push('bước 1 không dặn chỉ chép mã phát triển');
  const C = await import(pathToFileURL(path.join(kit, 'scripts', 'cat-luot.mjs')).href + `?v=${++n}`);
  const bang = khoiBang(sk, 'CAT-LUOT-BANG-CO') || '';
  const ten = [...bang.matchAll(/^\| `([a-z-]+)` \|/gm)].map(m => m[1]).sort();
  if (JSON.stringify(ten) !== JSON.stringify([...C.CO_TEN].sort())) sai.push(`bảng cờ ${JSON.stringify(ten)} ≠ CO_TEN ${JSON.stringify([...C.CO_TEN].sort())}`);
  const lt = JSON.parse(doc('skills', 'acceptance', 'references', 'lo-trinh-template.json'));
  const ngoai = (lt.moc || []).filter(m => m.loai === 'ngoai');
  if (ngoai.length) sai.push(`khuôn còn mốc ngoài: ${ngoai.map(m => m.ma || m.ten).join(', ')}`);
  const pv = khoiMd(doc('skills', 'acceptance', 'references', 'pham-vi-template.md'), 'PHAM-VI-MA'); if (pv == null) return [...sai, 'khuôn bản phạm vi thiếu khối PHAM-VI-MA'];
  const r = kho({ tep: { 'docs/plan/lo-trinh.json': lt }, them: { 'docs/plan/pham-vi.md': pv } });
  const lenh = khoiMd(sk, 'CAT-LUOT-RANG'); if (lenh == null) return [...sai, 'SKILL thiếu khối CAT-LUOT-RANG'];
  const cmd = lenh.trim().replace('<bản phạm vi>', 'docs/plan/pham-vi.md').replace('<tệp lộ trình>', 'docs/plan/lo-trinh.json');
  const x = spawnSync('bash', ['-c', cmd], { cwd: r, encoding: 'utf8', env: { ...process.env, AG: kit } });
  const dl = x.stdout.split('\n').filter(l => /^(lỗi|cảnh báo):/.test(l));
  if (x.status !== 0 || dl.length) sai.push(`răng trên đợt mẫu: exit ${x.status}, ${dl.length} dòng lỗi/cảnh báo — ${dl.slice(0, 2).join(' | ')} ${x.stderr.slice(0, 200)}`);
  const ctx = doc('CONTEXT.md'); const mn = ctx.slice(ctx.indexOf('**Mốc ngoài**'), ctx.indexOf('**Mốc ngoài**') + 900);
  if (!mn.includes('đã bỏ') || !mn.includes('ADR 0026')) sai.push('CONTEXT.md mục «Mốc ngoài» chưa ghi đã bỏ + ADR 0026');
  const adr = readdirSafe(path.join(kit, 'docs', 'adr')).find(f => f.startsWith('0026-'));
  const at = adr ? readFileSync(path.join(kit, 'docs', 'adr', adr), 'utf8') : '';
  for (const c of ['mất chỗ chung xem ngày của người', 'răng không bắt được việc vận hành bị quên']) if (!at.includes(c)) sai.push(`ADR 0026 thiếu «${c}»`);
  return sai;
}
function readdirSafe(d) { try { return execFileSync('ls', [d], { encoding: 'utf8' }).split('\n').filter(Boolean); } catch { return []; } }
// Bản sao cho chiều đỏ của RD-3 phải mang cả CONTEXT.md và docs/adr (bên đọc ở gốc kit).
async function rd3Do() {
  const c = banSao(); cpSync(path.join(KIT, 'CONTEXT.md'), path.join(c, 'CONTEXT.md')); cpSync(path.join(KIT, 'docs', 'adr'), path.join(c, 'docs', 'adr'), { recursive: true });
  const p = path.join(c, 'skills', 'acceptance', 'references', 'lo-trinh-template.json'); const lt = JSON.parse(readFileSync(p, 'utf8'));
  lt.moc.push({ ma: 'V1', ten: 'Nhân sự gửi danh sách', ngay: '2026-11-03', loai: 'ngoai', ai: 'Nhân sự', dot: 'mau-1', phu: [] });
  writeFileSync(p, JSON.stringify(lt, null, 2) + '\n');
  return rd3(c);
}
if (want('RD-3') && await chayCa('RD-3', rd3)) ok('RD-3', 'khối VAN-HANH bốn chỗ đến, bước 1 chỉ chép mã phát triển, bảng cờ == CO_TEN, khuôn 0 mốc ngoài, răng trên đợt mẫu 0 lỗi 0 cảnh báo, CONTEXT + ADR 0026');
if (want('RD-3-do')) {
  try {
    const lanh = await rd3(KIT); if (lanh.length) bad('RD-3-do', `bản lành chưa xanh: ${lanh[0]}`);
    else { const s = await rd3Do(); const g = s.find(m => m.includes('khuôn còn mốc ngoài: V1')); g ? ok('RD-3-do', `bản sao khuôn giữ mốc V1: «${g}»`) : bad('RD-3-do', `không bắt: ${JSON.stringify(s)}`); }
  } catch (e) { bad('RD-3-do', loi(e)); }
}

// ═══ AC-4 (vế máy): đáp án mẫu đi qua răng, mọi mục đầu vào ở đúng một trong hai nơi ════════════════
const dapAn = () => JSON.parse(readFileSync(path.join(HO, 'mau', 'dap-an.json'), 'utf8'));
const maDauVao = () => [...readFileSync(path.join(HO, 'mau', 'dau-vao-crm.md'), 'utf8').matchAll(/^- `([^`]+)` — /gm)].map(m => m[1]);
async function rd4(kit, da = dapAn()) {
  const sai = []; const dv = maDauVao();
  const r = kho({ tep: { 'docs/plan/lo-trinh.json': da.lo_trinh }, them: { 'docs/plan/pham-vi.md': vietPV(da.pham_vi.dot, da.pham_vi.ma) } });
  const x = rang(kit, r); const dl = dong(x, 'lỗi:');
  if (x.status !== 0 || dl.length) sai.push(`răng: exit ${x.status} — ${dl.slice(0, 2).join(' | ')}`);
  const rk = (da.ra_khoi_kho || []).map(m => m.muc); const pv = da.pham_vi.ma;
  const hai = pv.filter(m => rk.includes(m)); if (hai.length) sai.push(`mục ở cả bản phạm vi lẫn Ra khỏi kho: ${hai.join(', ')}`);
  const thieu = dv.filter(m => !pv.includes(m) && !rk.includes(m)); if (thieu.length) sai.push(`mục đầu vào không có chỗ: ${thieu.join(', ')}`);
  const la = [...pv, ...rk].filter(m => !dv.includes(m)); if (la.length) sai.push(`mục không có trong đầu vào: ${la.join(', ')}`);
  const lt = da.lo_trinh; const coHang = (lt.hang || []).some(h => (h.phu || []).length); const coCho = (lt.chan_troi || []).some(c => (c.phu || []).length);
  if (!coHang || !coCho || !rk.length || !(da.ra_khoi_kho || []).some(m => m.moc_nhan_han)) sai.push('đáp án thiếu ít nhất một nơi (hàng · chờ điều kiện · ra khỏi kho · mốc nhận hạn)');
  if ((lt.moc || []).some(m => m.loai === 'ngoai')) sai.push('đáp án còn mốc ngoài');
  console.log(`    · RD-4 ${pv.length + rk.length}/${dv.length} mục có chỗ`);
  return sai;
}
if (want('RD-4-dap-an') && await chayCa('RD-4-dap-an', rd4)) ok('RD-4-dap-an', 'đáp án qua răng thoát 0; mọi mục đầu vào ở đúng một trong bản phạm vi / Ra khỏi kho; đủ bốn nơi');
if (want('RD-4-dap-an-do')) {
  try {
    const lanh = await rd4(KIT); if (lanh.length) bad('RD-4-dap-an-do', `bản lành chưa xanh: ${lanh[0]}`);
    else { const da = dapAn(); da.ra_khoi_kho = da.ra_khoi_kho.filter(m => m.muc !== 'K8'); const s = await rd4(KIT, da); const g = s.find(m => m.includes('mục đầu vào không có chỗ'));
      g ? ok('RD-4-dap-an-do', `bản sao đáp án bỏ K8 khỏi Ra khỏi kho: «${g}»`) : bad('RD-4-dap-an-do', `không bắt: ${JSON.stringify(s)}`); }
  } catch (e) { bad('RD-4-dap-an-do', loi(e)); }
}

console.log(`\nRD Results: ${pass} PASS · ${fail} FAIL`);
process.exit(fail ? 1 : 0);
