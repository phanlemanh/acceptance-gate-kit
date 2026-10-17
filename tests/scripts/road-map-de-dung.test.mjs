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
const XUAT = process.argv.includes('--xuat-mau');
const want = id => !XUAT && (!only.length || only.includes(id));
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

// ═══ AC-8: luật «chỉ việc phát triển» trên mọi lần đọc tệp — trang · bản xem chữ · thẻ khởi động ═══
const napLT = async kit => ({ LT: await import(pathToFileURL(path.join(kit, 'scripts', 'lo-trinh.mjs')).href + `?v=${++n}`), PM: await import(pathToFileURL(path.join(kit, 'scripts', 'product-map.mjs')).href + `?v=${n}`) });
const HOM_NAY = process.env.ACCEPTANCE_TODAY || '2026-10-20';
const chuTron = h => String(h).replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
// Ba mặt của cùng một kho: dòng «Cần sửa» trên trang, dòng «!» của --xem, dòng «!» của thẻ khởi động.
async function baMat(kit, r) {
  const M = await napLT(kit);
  const html = M.LT.veTrang({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS });
  const trang = [...html.matchAll(/<ul class="co-ds">([\s\S]*?)<\/ul>/g)].flatMap(u => [...u[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => chuTron(m[1])));
  const x = node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', r, '--xem'], { env: { ...process.env, ACCEPTANCE_TODAY: HOM_NAY } });
  const xem = x.stdout.split('\n').filter(l => l.startsWith('  ! ')).map(l => l.slice(4));
  const the = (M.LT.loTrinhThe({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS, today: HOM_NAY })?.dong || []).filter(l => l.startsWith('  ! ')).map(l => l.slice(4));
  return { html, trang, xem, the, xemExit: x.status };
}
const CO5 = ['moc-ngoai-da-bo', 'moc-chua-khai-loai', 'dung-tren-moc', 'du-lieu-sai-gia-tri', 'thieu-hang-sinh-gia'];
const MAU_CO = { 'moc-ngoai-da-bo': /mốc là việc của người — không còn là mốc/, 'moc-chua-khai-loai': /mốc chưa khai loại:/, 'dung-tren-moc': /việc đứng chờ một mốc thay vì một việc:/,
  'du-lieu-sai-gia-tri': /việc khai du_lieu sai:/, 'thieu-hang-sinh-gia': /việc đo trên dữ liệu giả mà không đứng trực tiếp/ };
const coCua = ds => CO5.filter(c => ds.some(l => MAU_CO[c].test(l)));
const H8 = (ma, o = {}) => ({ ma, cau_giao: `«việc ${ma}»`, ...o });
const SACH = () => ({ schema: 1, hang: [H8('A'), H8('S', { du_lieu: 'sinh-gia' }), H8('G', { du_lieu: 'gia', dung_tren: ['S'] }), H8('B', { dung_tren: ['A'] })],
  moc: [{ ten: 'Phát hành 1', ngay: '2026-11-01', loai: 'phat-hanh', hang: ['A', 'B'] }] });
const RD8_GHIM = 'luật chỉ việc phát triển không chạy khi đọc tệp';
async function rd8(kit) {
  const sai = [];
  const lanh = await baMat(kit, kho({ tep: { 'docs/plan/lo-trinh.json': SACH() } }));
  if (coCua([...lanh.trang, ...lanh.xem, ...lanh.the]).length) sai.push(`đối chứng: tệp sạch vẫn có cờ ${JSON.stringify(coCua([...lanh.trang, ...lanh.xem, ...lanh.the]))}`);
  // Ma trận viết sẵn: [tên ca, biến đổi tệp sạch, cờ mong, cụm nêu tên phải có].
  const CA = [['moc-ngoai', d => d.moc.push({ ten: 'Nhân sự gửi danh sách', ngay: '2026-10-25', loai: 'ngoai', ai: 'Nhân sự' }), 'moc-ngoai-da-bo', 'Nhân sự gửi danh sách 25/10'],
    ['moc-khong-loai', d => d.moc.push({ ten: 'Phiên nghiệm thu', ngay: '2026-11-13', hang: ['A'] }), 'moc-chua-khai-loai', 'Phiên nghiệm thu 13/11'],
    ['dung-tren-ma-moc', d => { d.moc[0].ma = 'M1'; d.hang[3].dung_tren = ['M1']; }, 'dung-tren-moc', 'B → «Phát hành 1 01/11»'],
    ['dung-tren-ten-moc', d => { d.hang[3].dung_tren = ['Phát hành 1'.normalize('NFD')]; }, 'dung-tren-moc', 'B → «Phát hành 1 01/11»'],
    ['du-lieu-sai', d => { d.hang[0].du_lieu = 'that'; }, 'du-lieu-sai-gia-tri', 'A ("that")'],
    ['gia-khong-tren-sinh', d => { d.hang[2].dung_tren = ['A']; }, 'thieu-hang-sinh-gia', ': G']];
  for (const [ten, bien, co, cum] of CA) {
    const d = SACH(); bien(d); const b = await baMat(kit, kho({ tep: { 'docs/plan/lo-trinh.json': d } }));
    const mat = { trang: b.trang.filter(l => MAU_CO[co].test(l)), xem: b.xem.filter(l => MAU_CO[co].test(l)), the: b.the.filter(l => MAU_CO[co].test(l)) };
    const ok1 = Object.values(mat).every(v => v.length === 1) && mat.trang[0] === mat.xem[0] && mat.xem[0] === mat.the[0] && mat.trang[0].includes(cum);
    const khac = coCua([...b.trang, ...b.xem, ...b.the]).filter(c => c !== co);
    const khongCo = b.trang.filter(l => l.includes('không có việc')).length;
    if (Object.values(mat).every(v => !v.length)) { sai.push(`${ten}: ${RD8_GHIM} (trang · bản xem · thẻ đều không có dòng [${co}])`); continue; }
    if (!ok1 || khac.length || b.xemExit !== lanh.xemExit || khongCo) sai.push(`${ten}: trang ${JSON.stringify(mat.trang)} · xem ${JSON.stringify(mat.xem)} · thẻ ${JSON.stringify(mat.the)} (cần một dòng chung chứa «${cum}»), cờ khác ${JSON.stringify(khac)}, exit --xem ${b.xemExit}, dòng «mã không có» ${khongCo}`);
  }
  console.log(`    · RD-8 ma trận ${CA.length} ca`);
  if (CA.length !== 6) sai.push(`ma trận ${CA.length} ca, hợp đồng hứa 6`);
  return sai;
}
if (want('RD-8') && await chayCa('RD-8', rd8)) ok('RD-8', '6/6 ca: mỗi luật một dòng cờ có tên, cùng chữ ở trang · bản xem chữ · thẻ khởi động; mã thoát không đổi; không kèm dòng «mã không có»');
if (want('RD-8-im')) {
  try { const b = await baMat(KIT, kho({ tep: { 'docs/plan/lo-trinh.json': SACH() } })); const c = coCua([...b.trang, ...b.xem, ...b.the]);
    c.length ? bad('RD-8-im', `tệp sạch có cờ ${JSON.stringify(c)}`) : ok('RD-8-im', 'tệp sạch: 0 dòng của năm cờ ở cả ba mặt'); } catch (e) { bad('RD-8-im', loi(e)); }
}
async function rd8crm(kit) {
  const sai = []; const fx = f => JSON.parse(readFileSync(path.join(CRM, f), 'utf8'));
  const truoc = fx('okr-truoc-466.json'); const M = await napLT(kit);
  const bon = truoc.moc.filter(m => !String(m.loai ?? '').trim()).map(m => M.LT.tenNganMoc(m));
  const a = await baMat(kit, kho({ tep: { 'docs/plan/lo-trinh.json': truoc } })); const la = a.trang.find(l => MAU_CO['moc-chua-khai-loai'].test(l)) || '';
  if (bon.length !== 4 || !la.startsWith(`${bon.length} mốc chưa khai loại: ${bon.join(', ')} —`)) sai.push(`trước #466: cần bốn mốc ${JSON.stringify(bon)}, dòng «${la}»`);
  for (const [f, k] of [['okr.json', fx('okr.json').moc.filter(m => m.loai === 'ngoai').length], ['kho-tai-lieu.json', fx('kho-tai-lieu.json').moc.filter(m => m.loai === 'ngoai').length]]) {
    const b = await baMat(kit, kho({ tep: { 'docs/plan/lo-trinh.json': fx(f) } })); const l = b.trang.find(x => MAU_CO['moc-ngoai-da-bo'].test(x)) || '';
    console.log(`    · RD-8-crm ${f}: ${k} mốc ngoài tính từ tệp`);
    if (!k || !l.startsWith(`${k} mốc là việc của người`)) sai.push(`${f}: cần «${k} mốc là việc của người», có «${l.slice(0, 80)}»`);
  }
  return sai;
}
if (want('RD-8-crm') && await chayCa('RD-8-crm', rd8crm)) ok('RD-8-crm', 'crm trước #466: dòng mốc chưa khai loại nêu đúng bốn mốc; onehub b74ec7eae: dòng mốc ngoài nêu đúng 17 (OKR) và 1 (Kho tài liệu) tính từ tệp');
if (want('RD-8-do')) await chayDo('RD-8-do', rd8, [['scripts/lo-trinh.mjs', '    kq.co.push(...luatChiPhatTrien(data));\n', '']], RD8_GHIM, 'bản sao bộ đọc chung không gọi luật');

// ═══ AC-5 · AC-7 · AC-11: khối Mốc đọc bằng tên, một mô hình hiển thị cho ba mặt ════════════════════
// Bộ đọc CHỮ NHÌN THẤY của khối Mốc: bỏ thẻ và thuộc tính; trong <details> đang đóng chỉ <summary> nhìn thấy. Mỗi mốc là một
// <li data-ngay> của <ol class="moc">; việc chưa giao = summary trong <div class="viec"> của mốc; việc đã giao chỉ là số đếm.
function chuNhinThayMoc(html) {
  const ra = [];
  for (const ol of [...String(html).matchAll(/<ol class="moc"[^>]*>([\s\S]*?)<\/ol>/g)].map(m => m[1])) {
    for (const seg of ol.split(/<li data-ngay=/).slice(1)) {
      const s = seg;
      const ten = chuTron((s.match(/<b>([\s\S]*?)<\/b>/) || [])[1] || '');
      const vis = chuTron(s.replace(/<\/summary>[\s\S]*?<\/details>/g, '</summary>'));
      const c = vis.match(/còn (\d+)\/(\d+) việc/); const du = vis.match(/đã giao đủ (\d+) việc/);
      const viec = [...s.matchAll(/<summary>([\s\S]*?)<\/summary>|<div class="dong">([\s\S]*?)<\/div>/g)].map(m => (m[1] ?? m[2])).map(t0 => ({ 1: t0 })).map(m => {
        const t = m[1]; const tenV = chuTron((t.match(/<span class="ten">([\s\S]*?)<\/span>/) || [])[1] || ''); const tt = chuTron((t.match(/<span class="tt[^"]*">([\s\S]*?)<\/span>/) || [])[1] || '');
        const ma = chuTron((t.match(/class="ma"[^>]*>([\s\S]*?)<\/(?:a|span)>/) || [])[1] || ''); const chu = chuTron(t);
        return { ten: tenV, tt, ma, maTruoc: !!(ma && tenV && chu.indexOf(ma) < chu.indexOf(tenV)) };
      }).filter(v => v.ten || v.ma);
      ra.push({ ten, con: c ? +c[1] : (du ? 0 : null), tong: c ? +c[2] : (du ? +du[1] : null), viec });
    }
  }
  return ra;
}
// Bỏ ĐÚNG một cặp «» bao trọn câu (cặp mở đầu chỉ đóng ở ký tự cuối) — «» bên trong câu giữ nguyên. Viết độc lập với bộ đọc.
const boNgoac = s => {
  const t = String(s ?? '').trim(); if (!t.startsWith('«') || !t.endsWith('»')) return t;
  let sau = 0; for (let i = 0; i < t.length; i++) { if (t[i] === '«') sau += 1; else if (t[i] === '»') { sau -= 1; if (sau === 0 && i < t.length - 1) return t; } }
  return sau === 0 ? t.slice(1, -1).trim() : t;
};
// Đáp án tính từ TỆP (luật crm: việc thuộc mốc đầu tiên theo ngày liệt nó; tên = câu giao bỏ «», vắng thì ten_ngan → ten → mã);
// trạng thái lấy từ chữ ô Trạng thái của cùng lần phân tích.
async function dapAnMoc(kit, r, data, tep = 'docs/plan/lo-trinh.json') {
  const M = await napLT(kit); const k = M.LT.phanTichKho({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS });
  const kq = k.cacTep.find(t => t.tep === tep).kq;
  const chu = new Map(kq.dong.map(d => [String(d._nhan), d.chu])); const giao = x => kq.daGiao.has(chu.get(x));
  const hang = new Map((data.hang || []).map((h, i) => [String(h.ma || `#${i + 1}`), h])); const daCo = new Set(); const ra = [];
  const mocs = [...(data.moc || [])].map((m, i) => ({ m, i })).sort((a, b) => String(a.m.ngay ?? '').localeCompare(String(b.m.ngay ?? '')) || a.i - b.i).map(x => x.m);
  for (const m of mocs) {
    const v = (Array.isArray(m.hang) ? m.hang : []).map(String).filter(x => hang.has(x) && !daCo.has(x) && (daCo.add(x), true));
    if (!v.length) continue;
    const mo = v.filter(x => !giao(x));
    ra.push({ ten: String(m.ten), con: mo.length, tong: v.length, viec: mo.map(x => { const h = hang.get(x); return { ten: boNgoac(h.cau_giao) || String(h.ten_ngan || h.ten || x).trim(), tt: chu.get(x), ma: x }; }) });
  }
  return { moc: ra, chua_hen: [...hang.keys()].filter(x => !daCo.has(x)).length };
}
function soMoc(doc, mong) {
  const sai = []; let o = 0;
  if (doc.length !== mong.length) sai.push(`số mốc hiện ${doc.length} ≠ ${mong.length}`);
  for (const m of mong) {
    const d = doc.find(x => x.ten === m.ten); if (!d) { sai.push(`mốc «${m.ten}» không có trên trang`); continue; }
    o += 1; if (d.con !== m.con || d.tong !== m.tong) sai.push(`mốc «${m.ten}»: «còn ${d.con}/${d.tong}» ≠ còn ${m.con}/${m.tong}`);
    for (const v of m.viec) {
      o += 1; const dv = d.viec.find(x => x.ma === v.ma);
      if (!dv) { sai.push(`mốc «${m.ten}»: thiếu việc ${v.ma}`); continue; }
      if (dv.ten !== v.ten || dv.tt !== v.tt) sai.push(`mốc «${m.ten}» việc ${v.ma}: «${dv.ten} — ${dv.tt}» ≠ «${v.ten} — ${v.tt}»`);
      if (dv.maTruoc) sai.push(`mốc «${m.ten}» việc ${v.ma}: mã đứng trước tên`);
    }
  }
  return { sai, o };
}
const veTrang = async (kit, r) => { const M = await napLT(kit); return M.LT.veTrang({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS }); };
const fxCrm = f => JSON.parse(readFileSync(path.join(CRM, f), 'utf8'));
let khoCrmR = null; const khoCrm = () => khoCrmR || (khoCrmR = kho({ tep: { 'docs/plan/lo-trinh-okr.json': fxCrm('okr.json'), 'docs/plan/lo-trinh-kho-tai-lieu.json': fxCrm('kho-tai-lieu.json'), 'docs/plan/lo-trinh-viec-du-an.json': fxCrm('viec-du-an.json') } }));
async function rd5crm(kit, kitDap = KIT) {
  const r = khoCrm(); const html = await veTrang(kit, r); const doc = chuNhinThayMoc(html); const sai = []; let o = 0; let tong = 0;
  // Trang nhiều lộ trình: mỗi <ol class="moc"> một lộ trình, theo thứ tự khai.
  const ols = [...html.matchAll(/<ol class="moc"[^>]*>[\s\S]*?<\/ol>/g)].map(m => chuNhinThayMoc(m[0]));
  const TEP = ['lo-trinh-okr', 'lo-trinh-kho-tai-lieu', 'lo-trinh-viec-du-an'];
  for (const [i, t] of TEP.entries()) {
    const d = await dapAnMoc(kitDap, r, fxCrm(['okr.json', 'kho-tai-lieu.json', 'viec-du-an.json'][i]), `docs/plan/${t}.json`);
    tong += d.moc.length + d.moc.reduce((a, m) => a + m.viec.length, 0);
    const x = soMoc(ols[i] || [], d.moc); o += x.o; sai.push(...x.sai.map(m => `${t}: ${m}`));
  }
  console.log(`    · RD-5 bản chụp onehub: ${o}/${tong} ô so, ${tong} tính từ tệp (${doc.length} mốc trên trang)`);
  if (!tong) sai.push('đối chứng: đáp án rỗng');
  return sai;
}
if (want('RD-5') && await chayCa('RD-5', rd5crm)) ok('RD-5', 'bản chụp crm onehub: mỗi mốc hiện «còn k/n việc» đúng số, mỗi việc chưa giao «tên — trạng thái», mã sau tên; số ô so == tính từ tệp');
async function rd5kt(kit) {
  const data = { schema: 1, hang: [H8('A', { trang_thai: 'Đã giao' }), H8('B', { trang_thai: 'Đang làm', ten_ngan: 'Bê' }), H8('C'), { ma: 'D', ten_ngan: 'Đê ngắn' }, H8('E', { cau_giao: '«Việc «trong» ngoặc»' })],
    moc: [{ ten: 'Mốc Một', ngay: '2026-11-01', loai: 'phat-hanh', hang: ['A', 'B', 'C'] }, { ten: 'Mốc Hai', ngay: '2026-11-08', loai: 'han', hang: ['C', 'D', 'X9'] }, { ten: 'Mốc Ba', ngay: '2026-11-09', loai: 'phat-hanh', hang: [] }] };
  const r = kho({ tep: { 'docs/plan/lo-trinh.json': data } }); const doc = chuNhinThayMoc(await veTrang(kit, r));
  const d = await dapAnMoc(KIT, r, data); const x = soMoc(doc, d.moc);
  console.log(`    · RD-5 kho thử: ${x.o} ô so`);
  return x.sai;
}
if (want('RD-5-kho-thu') && await chayCa('RD-5-kho-thu', rd5kt)) ok('RD-5-kho-thu', 'kho thử: đã giao · đang làm · chưa mở · không câu giao · ngoặc trong câu; việc thuộc mốc đầu; mã lạ bỏ; mốc không việc không hiện');
if (want('RD-5-cu-do')) {
  try { const lanh = await rd5crm(KIT); if (lanh.length) bad('RD-5-cu-do', `bản lành chưa xanh: ${lanh[0]}`);
    else { const s = await rd5crm(boMayCu(), KIT); const g = s.find(m => /mốc «[^»]+»/.test(m)); g ? ok('RD-5-cu-do', `bộ máy v2.32.0 trên cùng bản chụp: «${g.slice(0, 140)}» (+${s.length - 1} lỗi khác)`) : bad('RD-5-cu-do', `bộ đọc không bắt trang cũ: ${JSON.stringify(s).slice(0, 200)}`); }
  } catch (e) { bad('RD-5-cu-do', loi(e)); }
}
async function rd5ten(kit, f, k) {
  const r = kho({ tep: { 'docs/plan/lo-trinh.json': fxCrm(f) } });
  const li = ((await raSoatKho(kit, r, HOM_NAY))[0].canh_bao || []).filter(l => l.includes('việc chưa có tên ngắn'));
  const ds = fxCrm(f).hang; const mong = ds.some(h => String(h.ten_ngan ?? '').trim()) ? ds.filter(h => !String(h.ten_ngan ?? '').trim()).length : 0;
  if (mong !== k) return [`đối chứng: ${f} có ${mong} hàng thiếu ten_ngan (kho có dùng tên ngắn), ca hứa ${k}`];
  if (!k) return li.length ? [`${f}: đủ tên mà vẫn có dòng ${JSON.stringify(li)}`] : [];
  const html = await veTrang(kit, r); if (html.includes('việc chưa có tên ngắn')) return [`${f}: dòng tên ngắn lên trang`];
  return li.length === 1 && li[0].startsWith(`${k} việc chưa có tên ngắn — tên phiên đang rút gọn tên việc: `) ? [] : [`${f}: rà soát ${JSON.stringify(li)}, cần đúng một dòng «${k} việc chưa có tên ngắn — …»`];
}
if (want('RD-5-ten-ngan') && await chayCa('RD-5-ten-ngan', kit => rd5ten(kit, 'kho-tai-lieu.json', 11))) ok('RD-5-ten-ngan', 'Kho tài liệu crm (dùng tên ngắn ở 6/17 việc): đúng một dòng «11 việc chưa có tên ngắn — …» ở khối Rà soát, không lên trang');
if (want('RD-5-ten-ngan-im') && await chayCa('RD-5-ten-ngan-im', kit => rd5ten(kit, 'okr.json', 0))) ok('RD-5-ten-ngan-im', 'OKR crm đủ tên ngắn: không dòng nào');
if (want('RD-5-ten-ngan-khong-dung') && await chayCa('RD-5-ten-ngan-khong-dung', async kit => { const r = kho({ tep: { 'docs/plan/lo-trinh.json': { schema: 1, hang: [H8('A'), H8('B')] } } }); const li = ((await raSoatKho(kit, r, HOM_NAY))[0].canh_bao || []).filter(l => l.includes('tên ngắn')); return li.length ? [`kho không dùng tên ngắn vẫn bị nhắc: ${JSON.stringify(li)}`] : []; })) ok('RD-5-ten-ngan-khong-dung', 'kho chưa từng dùng tên ngắn: không bị nhắc');
if (want('RD-5-do')) await chayDo('RD-5-do', rd5kt, [['scripts/lo-trinh.mjs', 'const dau = `<span class="ten">', 'const dau = `${ma} <span class="ten">']], 'mã đứng trước tên', 'bản sao in mã trước tên');

// AC-7 vế máy: ba tệp mẫu cho giám khảo do code sinh từ bản chụp; vẽ lại trong lượt phải giống từng byte tệp đã commit.
async function sinhMau(kit) {
  const html = await veTrang(kit, khoCrm()); const ols = [...html.matchAll(/<ol class="moc"[^>]*>[\s\S]*?<\/ol>/g)].map(m => chuNhinThayMoc(m[0]));
  const TEN = ['OKR', 'Kho tài liệu', 'Việc và Dự án'];
  const dong = []; const tatCa = [];
  ols.forEach((ds, i) => { dong.push(`Lộ trình ${TEN[i]}`); for (const m of ds) { tatCa.push({ lo: TEN[i], ...m }); dong.push(`  ${m.ten} — ${m.con ? `còn ${m.con}/${m.tong} việc` : `đã giao đủ ${m.tong} việc`}`); for (const v of m.viec) dong.push(`    • ${v.ten} — ${v.tt} (${v.ma})`); } });
  const ba = [...tatCa].sort((a, b) => b.con - a.con || a.lo.localeCompare(b.lo) || a.ten.localeCompare(b.ten)).slice(0, 3);
  const cau = `# Ba câu cho giám khảo (máy chọn: ba mốc còn nhiều việc nhất)\n\n${ba.map((m, i) => `${i + 1}. Lộ trình ${m.lo}, mốc «${m.ten}»: còn làm những gì, mỗi việc xong chưa?`).join('\n')}\n`;
  const dap = JSON.stringify({ nguon: 'tests/scripts/fixtures/lo-trinh/crm-onehub-1017 (crm onehub b74ec7eae)', cau: ba.map(m => ({ lo_trinh: m.lo, moc: m.ten, con: m.con, tong: m.tong, viec: m.viec.map(v => ({ ten: v.ten, trang_thai: v.tt })) })) }, null, 1) + '\n';
  return { 'trang-moi.txt': dong.join('\n') + '\n', 'cau-hoi-trang.md': cau, 'dap-an-trang.json': dap };
}
if (process.argv.includes('--xuat-mau')) { for (const [f, t] of Object.entries(await sinhMau(KIT))) writeFileSync(path.join(HO, 'mau', f), t); console.log('đã xuất ba tệp mẫu vào _acceptance/road-map-de-dung/mau/'); process.exit(0); }
async function rd7(kit, doc = f => readFileSync(path.join(HO, 'mau', f), 'utf8')) {
  const moi = await sinhMau(kit); return Object.entries(moi).filter(([f, t]) => doc(f) !== t).map(([f]) => `tệp mẫu cũ: ${f}`);
}
if (want('RD-7-tuoi') && await chayCa('RD-7-tuoi', rd7)) ok('RD-7-tuoi', 'vẽ lại trong lượt: trang-moi.txt, cau-hoi-trang.md, dap-an-trang.json giống từng byte tệp đã commit');
if (want('RD-7-tuoi-do')) {
  try { const lanh = await rd7(KIT); if (lanh.length) bad('RD-7-tuoi-do', `bản lành chưa xanh: ${lanh[0]}`);
    else { const s = await rd7(KIT, f => { const t = readFileSync(path.join(HO, 'mau', f), 'utf8'); return f === 'trang-moi.txt' ? t.replace('—', '-') : t; }); const g = s.find(m => m === 'tệp mẫu cũ: trang-moi.txt'); g ? ok('RD-7-tuoi-do', `bản sao lệch một ký tự: «${g}»`) : bad('RD-7-tuoi-do', JSON.stringify(s)); }
  } catch (e) { bad('RD-7-tuoi-do', loi(e)); }
}

// AC-11: một mô hình hiển thị — khối == trang == bản xem chữ.
const DATA11 = () => ({ schema: 1, hang: [H8('A', { ten_ngan: 'Ây' }), H8('B'), H8('C'), H8('D'), H8('E'), { ma: 'F', ten_ngan: 'Ép ngắn' }],
  moc: [{ ten: 'M1', ngay: '2026-11-01', loai: 'phat-hanh', hang: ['A', 'B'] }, { ten: 'M2', ngay: '2026-11-08', loai: 'phat-hanh', hang: ['B', 'C', 'F'] },
    { ten: 'M3', ngay: '2026-11-15', loai: 'han', hang: [] }, { ten: 'V', ngay: '2026-11-20', loai: 'ngoai', hang: ['D'] }, { ten: 'M4', ngay: '2026-11-22', loai: 'phat-hanh', hang: ['Z9'] }] });
const khoiCua = html => JSON.parse((String(html).match(/<script type="application\/json" id="lo-trinh-du-lieu">([\s\S]*?)<\/script>/) || [])[1].replace(/\\u003c/g, '<'));
// Danh tính mốc so ba mặt = tên rút gọn (bản xem chữ in tên mốc cắt ở « — », trang và khối in đủ) — cùng hàm tenNganMoc của bộ đọc.
let rutTen = t => t;
const tapKhoi = lo => { const h = new Map(lo.hang.map(x => [x.ma, x])); return lo.moc.filter(m => m.hien).map(m => `${rutTen(m.ten)}|${m.con_lai}/${m.viec_hien.length}|${m.viec_hien.filter(x => h.get(x).nhom_trang_thai !== 'da-giao').map(x => `${h.get(x).ten_hien_thi}~${h.get(x).trang_thai}~${x}`).join(';')}`).concat(`chua-hen:${lo.chua_hen_moc.length}`); };
const tapTrang = (html, lo) => { const ds = chuNhinThayMoc(html); const n = ((chuTron(html).match(/(\d+) việc chưa hẹn mốc/) || [])[1]) || '0'; return ds.map(m => `${rutTen(m.ten)}|${m.con}/${m.tong}|${m.viec.map(v => `${v.ten}~${v.tt}~${v.ma}`).join(';')}`).concat(`chua-hen:${n}`); };
function tapXem(out, lo) {
  const l = out.split('\n'); const i = l.indexOf('Mốc:'); if (i < 0) return [];
  const ra = []; let cur = null;
  for (const x of l.slice(i + 1)) {
    if (!x.startsWith('  ')) break;
    let m = x.match(/^  · (.+?) \d\d\/\d\d — (?:còn (\d+)\/(\d+) việc|đã giao đủ (\d+) việc)$/);
    if (m) { cur = { ten: m[1], con: m[2] ? +m[2] : 0, tong: m[3] ? +m[3] : +m[4], v: [] }; ra.push(cur); continue; }
    m = x.match(/^      – (.+) \((.+?)\) \[(.+)\]$/); if (m && cur) { cur.v.push(`${m[1]}~${m[2]}~${m[3]}`); continue; }
    m = x.match(/^  · (\d+) việc chưa hẹn mốc$/); if (m) { cur = null; ra.push({ chua: m[1] }); }
  }
  const chua = (ra.find(x => x.chua) || { chua: '0' }).chua;
  return ra.filter(x => !x.chua).map(x => `${x.ten}|${x.con}/${x.tong}|${x.v.join(';')}`).concat(`chua-hen:${chua}`);
}
async function rd11(kit) {
  const sai = []; const r = kho({ tep: { 'docs/plan/lo-trinh.json': DATA11() } }); const html = await veTrang(kit, r); const lo = khoiCua(html).lo_trinh[0];
  const h = new Map(lo.hang.map(x => [x.ma, x]));
  const MONG = { ten: { A: '«việc A»', F: 'Ép ngắn' }, moc: { M1: [true, ['A', 'B'], 2], M2: [true, ['C', 'F'], 2], M3: [false, [], 0], V: [true, ['D'], 1], M4: [false, [], 0] }, chua: ['E'] };
  if (h.get('A').ten_hien_thi !== 'việc A' || h.get('F').ten_hien_thi !== 'Ép ngắn') sai.push(`ten_hien_thi A «${h.get('A').ten_hien_thi}» F «${h.get('F').ten_hien_thi}»`);
  for (const [t, [hien, viec, con]] of Object.entries(MONG.moc)) { const m = lo.moc.find(x => x.ten === t); if (!m || m.hien !== hien || JSON.stringify(m.viec_hien) !== JSON.stringify(viec) || m.con_lai !== con) sai.push(`mốc ${t}: ${JSON.stringify(m && { hien: m.hien, viec_hien: m.viec_hien, con_lai: m.con_lai })} ≠ ${JSON.stringify({ hien, viec, con })}`); }
  if (JSON.stringify(lo.chua_hen_moc) !== JSON.stringify(MONG.chua)) sai.push(`chua_hen_moc ${JSON.stringify(lo.chua_hen_moc)} ≠ ${JSON.stringify(MONG.chua)}`);
  // Review Focus: tệp không khối moc → mọi việc chưa hẹn mốc, không ném.
  const r0 = kho({ tep: { 'docs/plan/lo-trinh.json': { schema: 1, hang: [H8('A'), H8('B')] } } }); const lo0 = khoiCua(await veTrang(kit, r0)).lo_trinh[0];
  if (JSON.stringify(lo0.chua_hen_moc) !== '["A","B"]') sai.push(`không mốc: chua_hen_moc ${JSON.stringify(lo0.chua_hen_moc)}`);
  return sai;
}
if (want('RD-11') && await chayCa('RD-11', rd11)) ok('RD-11', 'khối: ten_hien_thi (câu giao, vắng thì tên ngắn), viec_hien theo mốc đầu, hien, con_lai, chua_hen_moc đúng kỳ vọng viết sẵn; mã lạ bỏ; không mốc → mọi việc chưa hẹn');
async function baTap(kit, r) {
  { const M = await napLT(kit); rutTen = t => M.LT.tenNganMoc({ ten: t, ngay: '' }); }
  const html = await veTrang(kit, r); const k = khoiCua(html);
  const x = node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', r, '--xem'], { env: { ...process.env, ACCEPTANCE_TODAY: HOM_NAY } });
  const ols = [...html.matchAll(/<section id="lt\d+">[\s\S]*?<\/section>/g)].map(m => m[0]).filter(sec => /<h3>Mốc/.test(sec) || /việc chưa hẹn mốc/.test(sec));
  const phanXem = x.stdout.split(/\n(?=Lộ trình .+ \(.+\):$)/m);
  return k.lo_trinh.map((lo, i) => ({ khoi: tapKhoi(lo), trang: tapTrang(ols[i] || '', lo), xem: tapXem(phanXem[i] || x.stdout, lo) }));
}
async function rd11ba(kit, r = kho({ tep: { 'docs/plan/lo-trinh.json': DATA11() } }), nhan = 'kho thử') {
  const sai = []; let n2 = 0;
  for (const [i, t] of (await baTap(kit, r)).entries()) {
    n2 += t.khoi.length;
    if (JSON.stringify(t.trang) !== JSON.stringify(t.khoi)) { const j = t.khoi.findIndex((v, k) => v !== t.trang[k]); sai.push(`${nhan} lộ trình ${i + 1}: trang lệch khối ở phần tử ${j} — trang «${String(t.trang[j]).slice(0, 200)}» · khối «${String(t.khoi[j]).slice(0, 200)}»`); }
    if (JSON.stringify(t.xem) !== JSON.stringify(t.khoi)) { const j = t.khoi.findIndex((v, k) => v !== t.xem[k]); sai.push(`${nhan} lộ trình ${i + 1}: bản xem lệch khối ở phần tử ${j} — xem «${String(t.xem[j]).slice(0, 200)}» · khối «${String(t.khoi[j]).slice(0, 200)}»`); }
  }
  console.log(`    · RD-11 ${nhan}: ${n2} phần tử so ba mặt`);
  return sai;
}
if (want('RD-11-ba-mat') && await chayCa('RD-11-ba-mat', kit => rd11ba(kit))) ok('RD-11-ba-mat', 'kho thử: tập (mốc hiện, việc chưa giao, tên, trạng thái, số chưa hẹn mốc) của trang == khối == bản xem chữ');
if (want('RD-11-crm') && await chayCa('RD-11-crm', kit => rd11ba(kit, khoCrm(), 'bản chụp onehub'))) ok('RD-11-crm', 'bản chụp crm onehub (ba lộ trình): trang == khối == bản xem chữ');
async function rd11cu() {
  const html = await veTrang(boMayCu(), kho({ tep: { 'docs/plan/lo-trinh.json': DATA11() } })); const M = await napLT(KIT); const { duLieu, canhBao } = M.LT.docDuLieu(html);
  const sai = []; const lo = duLieu.lo_trinh[0]; const c = canhBao.filter(x => x.includes('khối chưa mang mô hình hiển thị'));
  if (c.length !== 1) sai.push(`cờ «khối chưa mang mô hình hiển thị»: ${c.length} — ${JSON.stringify(canhBao)}`);
  if (JSON.stringify(lo.chua_hen_moc) !== '[]' || lo.hang.some(h => h.ten_hien_thi !== null) || lo.moc.some(m => m.hien !== null || m.con_lai !== null || JSON.stringify(m.viec_hien) !== '[]')) sai.push('khoá mới không rỗng/null ở trang cũ');
  return sai;
}
if (want('RD-11-doc-cu') && await chayCa('RD-11-doc-cu', rd11cu)) ok('RD-11-doc-cu', 'bộ đọc mẫu đọc trang bộ máy v2.32.0: khoá mới null/rỗng + đúng một cờ vàng «khối chưa mang mô hình hiển thị»');
if (want('RD-11-do')) await chayDo('RD-11-do', kit => rd11ba(kit), [['scripts/lo-trinh.mjs', 'const mocs = mocTheoNgay(kq).filter(m => mh.moc.get(m).hien);', 'const mocs = mocTheoNgay(kq);']], 'trang lệch khối', 'bản sao trang vẽ cả mốc không có việc');
if (want('RD-11-do2')) await chayDo('RD-11-do2', kit => rd11ba(kit), [['scripts/lo-trinh.mjs', 'ra.push(`      – ${tenHienThi(d)} (${d.chu}) [${x}]`)', 'ra.push(`      – ${chuoi(d.cau_giao) || CHUA_CAU} (${d.chu}) [${x}]`)']], 'bản xem lệch khối', 'bản sao bản xem dùng câu giao thay tên hiển thị');

// ═══ AC-9: rà soát mốc đã qua ngày, chưa ghi ngày khép ══════════════════════════════════════════════
const GOM9 = /^(\d+) mốc đã qua ngày, chưa ghi ngày khép: /;
async function raSoatKho(kit, r, today) { const M = await napLT(kit); const k = M.LT.phanTichKho({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS }); return M.LT.raSoat({ root: r, cacTep: k.cacTep, sections: M.PM.SECTIONS, today }); }
async function rd9(kit) {
  const sai = []; let o = 0; const T = '2026-10-20';
  const LOAI = ['phat-hanh', 'han-cung', 'su-kien']; const NGAY = { qua: '2026-10-10', toi: '2026-10-30' }; const THAT = { co: '2026-10-11', khong: null };
  const HANG = { 'khong-hang': [], 'da-giao': ['G'], 'con-hang': ['C'] };
  // Bảng kỳ vọng VIẾT SẴN: ô nào vào dòng gom (đã qua · không that · không việc mở).
  const VAO = new Set(LOAI.flatMap(l => ['khong-hang', 'da-giao'].map(h => `${l}|qua|khong|${h}`)));
  for (const l of LOAI) for (const [nq, ng] of Object.entries(NGAY)) for (const [nt, th] of Object.entries(THAT)) for (const [nh, hg] of Object.entries(HANG)) {
    const o9 = `${l}|${nq}|${nt}|${nh}`; o += 1;
    const data = { schema: 1, hang: [H8('G', { trang_thai: 'Đã giao' }), H8('C')], moc: [{ ten: 'Mốc thử', ngay: ng, loai: l, hang: hg, ...(th ? { that: th } : {}) }] };
    const r = kho({ tep: { 'docs/plan/lo-trinh.json': data } });
    const moi = (await raSoatKho(kit, r, T))[0]; const cu = (await raSoatKho(boMayCu(), r, T))[0];
    const them = (moi.canh_bao || []).filter(c => !(cu.canh_bao || []).includes(c));
    const vao = them.some(c => GOM9.test(c) && c.includes('Mốc thử 10/10'));
    if (vao !== VAO.has(o9) || them.length !== (VAO.has(o9) ? 1 : 0)) sai.push(`${o9}: dòng thêm ${JSON.stringify(them)} (kỳ vọng ${VAO.has(o9) ? 'một dòng gom' : 'không'})`);
    if (JSON.stringify(moi.de_xuat) !== JSON.stringify(cu.de_xuat)) sai.push(`${o9}: đề xuất lệch bộ máy cũ`);
  }
  console.log(`    · RD-9 ${o}/36 ô (bảng kỳ vọng viết sẵn, ${VAO.size} ô vào dòng gom)`);
  if (o !== 36 || VAO.size !== 6) sai.push(`ma trận ${o} ô, ${VAO.size} ô vào — hợp đồng hứa 36 và 6`);
  // Gom: sáu mốc vào → một dòng, năm tên rồi «…».
  const sau = { schema: 1, hang: [H8('A')], moc: [1, 2, 3, 4, 5, 6].map(i => ({ ten: `Mốc ${i}`, ngay: `2026-10-0${i}`, loai: 'phat-hanh', hang: [] })) };
  const g = ((await raSoatKho(kit, kho({ tep: { 'docs/plan/lo-trinh.json': sau } }), T))[0].canh_bao || []).filter(c => GOM9.test(c));
  if (g.length !== 1 || g[0] !== '6 mốc đã qua ngày, chưa ghi ngày khép: Mốc 1 01/10, Mốc 2 02/10, Mốc 3 03/10, Mốc 4 04/10, Mốc 5 05/10, …') sai.push(`gom sáu mốc: ${JSON.stringify(g)}`);
  return sai;
}
if (want('RD-9') && await chayCa('RD-9', rd9)) ok('RD-9', '36/36 ô: đúng sáu ô «đã qua · không that · không việc mở» vào một dòng gom; ô còn việc và mọi ô khác: rà soát bằng bộ máy v2.32.0; sáu mốc → năm tên rồi «…»');
async function rd9trang(kit) {
  const r = kho({ tep: { 'docs/plan/lo-trinh.json': { schema: 1, hang: [H8('A')], moc: [{ ten: 'Mốc X', ngay: '2026-10-05', loai: 'phat-hanh', hang: [] }, { ten: 'Mốc Y', ngay: '2026-10-25', loai: 'phat-hanh', hang: [] }] } } });
  const ve1 = ngay => node(['--input-type=module', '-e', `const LT = await import(${JSON.stringify(pathToFileURL(path.join(kit, 'scripts', 'lo-trinh.mjs')).href)}); const PM = await import(${JSON.stringify(pathToFileURL(path.join(kit, 'scripts', 'product-map.mjs')).href)}); process.stdout.write(LT.veTrang({ root: ${JSON.stringify(r)}, classify: PM.classify, sections: PM.SECTIONS }));`], { env: { ...process.env, ACCEPTANCE_TODAY: ngay } }).stdout;
  const a = ve1('2026-10-10'); const b = ve1('2026-10-30'); const sai = [];
  const ra = [(await raSoatKho(kit, r, '2026-10-10'))[0].canh_bao || [], (await raSoatKho(kit, r, '2026-10-30'))[0].canh_bao || []].map(x => x.find(c => GOM9.test(c)) || '');
  if (!ra[0].startsWith('1 mốc') || !ra[1].startsWith('2 mốc')) sai.push(`đối chứng: hai ngày phải cho hai tập mốc khác nhau — ${JSON.stringify(ra)}`);
  if (!a || a !== b) sai.push('trang đổi theo hôm nay');
  if (a.includes('mốc đã qua ngày, chưa ghi ngày khép')) sai.push('trang mang dòng gom của rà soát');
  return sai;
}
if (want('RD-9-trang') && await chayCa('RD-9-trang', rd9trang)) ok('RD-9-trang', 'hai «hôm nay» cho hai tập mốc quá ngày khác nhau: trang giống từng byte và không mang dòng gom');
async function rd9crm(kit) {
  const sai = []; const T = '2026-10-17'; const data = fxCrm('okr-ra-soat-1017.json'); const r = kho({ tep: { 'docs/plan/lo-trinh.json': data } });
  const M = await napLT(kit); const k = M.LT.phanTichKho({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS }); const kq = k.cacTep[0].kq;
  const rs = (await raSoatKho(kit, r, T))[0]; const gom = (rs.canh_bao || []).find(c => GOM9.test(c)) || ''; const ngoai = kq.co.map(c => M.LT.dichCo(c)).find(d => d.ten === 'moc-ngoai-da-bo')?.chu || '';
  const chu = new Map(kq.dong.map(d => [String(d._nhan), d.chu]));
  const qua = data.moc.filter(m => /^\d{4}-\d{2}-\d{2}$/.test(m.ngay || '') && m.ngay < T && !m.that && (m.loai === 'ngoai' || (m.hang || []).filter(x => chu.has(x)).every(x => kq.daGiao.has(chu.get(x)))));
  if (!qua.length) return ['tập mốc quá ngày chưa khép rỗng — bản chụp không đo được gì'];
  for (const m of qua) {
    const t = M.LT.tenNganMoc(m); const o = [ngoai.includes(t), gom.includes(t)].filter(Boolean).length;
    console.log(`    · RD-9-crm «${t}» (${m.loai}) → ${ngoai.includes(t) ? 'cờ mốc ngoài' : gom.includes(t) ? 'dòng gom AC-9' : 'KHÔNG DÒNG NÀO'}`);
    if (o !== 1) sai.push(`«${t}» rơi vào ${o} dòng`);
  }
  return sai;
}
if (want('RD-9-crm') && await chayCa('RD-9-crm', rd9crm)) ok('RD-9-crm', 'bản hạt giống crm onehub b1666c3ac: mỗi mốc quá ngày chưa khép rơi vào đúng một dòng (cờ mốc ngoài hoặc dòng gom)');
if (want('RD-9-do')) await chayDo('RD-9-do', rd9, [['scripts/lo-trinh.mjs', " && chuoi(m.ngay) < today && !chuoi(m.that)\n", " && chuoi(m.ngay) < today\n"]], '|qua|co|', 'bản sao bỏ điều kiện «không that»');

// ═══ AC-10: giờ máy nối tiếp theo làn + cân trên năm kho ══════════════════════════════════════════
const xem = (kit, r, today = '2026-10-20') => node([path.join(kit, 'scripts', 'lo-trinh.mjs'), '--root', r, '--xem'], { env: { ...process.env, ACCEPTANCE_TODAY: today } });
const dongGM = out => out.split('\n').filter(l => /^  · .+: (bắt đầu ~|không tính được)/.test(l)).map(l => l.slice(4));
const batDau = (l, t) => ((l.find(x => x.startsWith(`${t} `) || x.startsWith(`${t}:`)) || '').match(/bắt đầu ~(\d\d\/\d\d)/) || [])[1];
const hoanTat = (l, t) => ((l.find(x => x.startsWith(`${t} `) || x.startsWith(`${t}:`)) || '').match(/hoàn tất dự kiến (\d\d\/\d\d)/) || [])[1];
const G = (ma, o = {}) => H8(ma, { gio_may: 6, ...o });
async function rd10(kit) {
  const sai = [];
  // M1 đủ dài để tràn sang ngày sau (sáu việc × 6 giờ máy) — «bắt đầu M2» chỉ trùng «hoàn tất M1» khi thật sự nối.
  const data = { schema: 1, hang: [G('A'), G('B'), G('A2'), G('B2'), G('A3'), G('B3'), G('C'), G('D')], moc: [{ ten: 'M2', ngay: '2026-10-25', loai: 'phat-hanh', hang: ['C'] }, { ten: 'M1', ngay: '2026-10-20', loai: 'phat-hanh', hang: ['A', 'B', 'A2', 'B2', 'A3', 'B3'] }, { ten: 'MX', loai: 'han', hang: ['D'] }] };
  const lCu = dongGM(xem(KIT, kho({ tep: { 'docs/plan/lo-trinh.json': data } })).stdout);
  if (hoanTat(lCu, 'M1') === '20/10') sai.push(`đối chứng: M1 không tràn sang ngày sau — ${JSON.stringify(lCu)}`);
  const l = dongGM(xem(kit, kho({ tep: { 'docs/plan/lo-trinh.json': data } })).stdout);
  if (!hoanTat(l, 'M1') || batDau(l, 'M2') !== hoanTat(l, 'M1')) sai.push(`M2 không nối sau M1: M1 hoàn tất ${hoanTat(l, 'M1')}, M2 bắt đầu ${batDau(l, 'M2')} — ${JSON.stringify(l)}`);
  if (l.length !== 3 || !l[2].startsWith('MX') || batDau(l, 'MX') !== hoanTat(l, 'M2')) sai.push(`mốc không ngày phải đứng cuối làn, bắt đầu sau M2 — ${JSON.stringify(l)}`);
  // Phụ thuộc ngược ngày (lượt chấm 1, AC-10 «ràng buộc dung_tren»): việc của mốc SỚM đứng trên việc của mốc MUỘN — mốc muộn phải
  // chạy trước trong làn, mốc sớm bắt đầu đúng ngày mốc muộn hoàn tất (không bao giờ xong trước thứ nó dựa vào).
  const nguoc = { schema: 1, hang: [G('A', { dung_tren: ['B'] }), G('B'), G('B2'), G('B3'), G('B4'), G('B5')], moc: [{ ten: 'Sớm', ngay: '2026-10-22', loai: 'phat-hanh', hang: ['A'] }, { ten: 'Muộn', ngay: '2026-10-30', loai: 'phat-hanh', hang: ['B', 'B2', 'B3', 'B4', 'B5'] }] };
  const ln = dongGM(xem(kit, kho({ tep: { 'docs/plan/lo-trinh.json': nguoc } })).stdout);
  if (!hoanTat(ln, 'Muộn') || hoanTat(ln, 'Muộn') === '20/10' || batDau(ln, 'Sớm') !== hoanTat(ln, 'Muộn') || batDau(ln, 'Muộn') !== '20/10') sai.push(`phụ thuộc ngược ngày: Sớm bắt đầu ${batDau(ln, 'Sớm')}, Muộn ${batDau(ln, 'Muộn')}→${hoanTat(ln, 'Muộn')} — ${JSON.stringify(ln)}`);
  // Review Focus: hai mốc cùng ngày giữ thứ tự tệp, ổn định giữa hai lần chạy.
  const cung = { schema: 1, hang: [G('A'), G('B')], moc: [{ ten: 'Một', ngay: '2026-10-22', loai: 'han', hang: ['A'] }, { ten: 'Hai', ngay: '2026-10-22', loai: 'han', hang: ['B'] }] };
  const rc = kho({ tep: { 'docs/plan/lo-trinh.json': cung } }); const a = dongGM(xem(kit, rc).stdout); const b = dongGM(xem(kit, rc).stdout);
  if (JSON.stringify(a) !== JSON.stringify(b) || batDau(a, 'Hai') !== hoanTat(a, 'Một')) sai.push(`cùng ngày: ${JSON.stringify(a)}`);
  return sai;
}
if (want('RD-10') && await chayCa('RD-10', rd10)) ok('RD-10', 'M1 (D) và M2 (D+5) độc lập: M2 bắt đầu đúng ngày M1 hoàn tất; mốc không ngày đứng cuối làn; việc mốc sớm đứng trên việc mốc muộn → mốc muộn chạy trước, mốc sớm bắt đầu khi nó xong; cùng ngày giữ thứ tự tệp, ổn định');
async function rd10mot(kit) {
  const r = kho({ tep: { 'docs/plan/lo-trinh.json': { schema: 1, hang: [G('A')], moc: [{ ten: 'Một', ngay: '2026-10-22', loai: 'phat-hanh', hang: ['A'] }] } } });
  const moi = dongGM(xem(kit, r).stdout); const cu0 = dongGM(xem(boMayCu(), r).stdout);
  return JSON.stringify(moi) === JSON.stringify(cu0.map(x => x + ' (máy chạy 24/24 — chưa đo nhịp ngày)')) && moi.length === 1 ? [] : [`một mốc: mới ${JSON.stringify(moi)} · cũ ${JSON.stringify(cu0)}`];
}
if (want('RD-10-mot-moc') && await chayCa('RD-10-mot-moc', rd10mot)) ok('RD-10-mot-moc', 'một mốc: dòng giờ máy bằng bộ máy v2.32.0 cộng đúng nhãn «(máy chạy 24/24 — chưa đo nhịp ngày)»');
async function rd10hai(kit) {
  const r = kho({ tep: { 'docs/plan/a.json': { schema: 1, ten: 'A', hang: [G('A1')], moc: [{ ten: 'MA', ngay: '2026-10-22', loai: 'han', hang: ['A1'] }] }, 'docs/plan/b.json': { schema: 1, ten: 'B', hang: [G('B1')], moc: [{ ten: 'MB', ngay: '2026-10-23', loai: 'han', hang: ['B1'] }] } } });
  const x = xem(kit, r).stdout; const l = dongGM(x);
  return batDau(l, 'MA') === '20/10' && batDau(l, 'MB') === '20/10' && x.includes('Giờ máy theo mốc (mỗi lộ trình một làn, tính riêng):') ? [] : [`hai lộ trình: ${JSON.stringify(l)}`];
}
if (want('RD-10-hai-lo-trinh') && await chayCa('RD-10-hai-lo-trinh', rd10hai)) ok('RD-10-hai-lo-trinh', 'hai lộ trình cùng kho, mỗi lộ trình một mốc độc lập: cả hai bắt đầu hôm nay; tiêu đề nói «mỗi lộ trình một làn, tính riêng»');
if (want('RD-10-do')) await chayDo('RD-10-do', rd10, [['scripts/gio-may.mjs', 'let bd = Math.max(r._bd, lan);', 'let bd = r._bd;']], 'M2 không nối sau M1', 'bản sao giữ bắt đầu = hôm nay');
if (want('RD-10-do-phu')) await chayDo('RD-10-do-phu', rd10, [['scripts/gio-may.mjs', 'r._phu.every(j => daXep.has(j) || !conLaiMoc.includes(j))', 'true']], 'phụ thuộc ngược ngày', 'bản sao xếp làn chỉ theo ngày');
// RD-10-kho: năm kho — mọi khác biệt giữa bộ máy mới và v2.32.0 thuộc tập kỳ vọng.
const chuanTrang = h => String(h ?? '').replace(/<style>[\s\S]*?<\/style>/g, '').replace(/<script type="application\/json"[\s\S]*?<\/script>/g, '')
  .replace(/<h3>Mốc[\s\S]*?(?=<h3>|<\/section>)/g, '').replace(/<h3 id="lt\d+-co">Cần sửa trong kế hoạch \(\d+\)<\/h3><ul class="co-ds">[\s\S]*?<\/ul>/g, '')
  .replace(/<a href="#lt\d+-co">\d+ chỗ cần sửa<\/a>|<span class="khong">Không có chỗ nào cần sửa<\/span>/g, '').replace(/\n+/g, '\n');
// Tập kỳ vọng tính ĐỘC LẬP từ tệp lộ trình (không gọi lớp hiển thị mới): khối Mốc (dapAnMoc), cờ của luật chỉ việc phát
// triển (năm luật viết lại ở đây), dòng tên ngắn (AC-5) và dòng gom mốc quá ngày (AC-9). Dòng giờ máy: cùng tập mốc, cùng giờ
// máy và phần trăm; chỉ NGÀY được dời (luật làn — đo ở RD-10) và thêm đúng nhãn 24/24.
const NHOM_CO = [['moc-ngoai-da-bo', /^(\d+) mốc là việc của người/], ['moc-chua-khai-loai', /^(\d+) mốc chưa khai loại/], ['dung-tren-moc', /^(\d+) việc đứng chờ một mốc/],
  ['du-lieu-sai-gia-tri', /^(\d+) việc khai du_lieu sai/], ['thieu-hang-sinh-gia', /^(\d+) việc đo trên dữ liệu giả mà không/], ['ten-ngan', /^(\d+) việc chưa có tên ngắn/], ['moc-qua-ngay', /^(\d+) mốc đã qua ngày, chưa ghi ngày khép/]];
async function kyVongXem(kitCu, r, data, today) {
  const M = await napLT(kitCu); const k = M.LT.phanTichKho({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS }); const kq = k.cacTep[0].kq;
  const chu = new Map(kq.dong.map(d => [String(d._nhan), d.chu])); const giao = x => chu.has(x) && kq.daGiao.has(chu.get(x));
  const hang = (data.hang || []).filter(h => h && typeof h === 'object'); const moc = (data.moc || []).filter(m => m && typeof m === 'object');
  const ma = new Map(hang.map(h => [String(h.ma ?? '').trim(), h])); const nfc = x => String(x ?? '').normalize('NFC').trim();
  const co = new Map();
  const dat = (ten, n) => { if (n) co.set(ten, n); };
  dat('moc-ngoai-da-bo', new Set(moc.filter(m => m.loai === 'ngoai').map(m => nfc(m.ten))).size);
  dat('moc-chua-khai-loai', new Set(moc.filter(m => !String(m.loai ?? '').trim()).map(m => nfc(m.ten))).size);
  const cho = new Set(); for (const h of hang) for (const x of (Array.isArray(h.dung_tren) ? h.dung_tren : []).map(v => String(v).trim())) if (!ma.has(x) && moc.some(m => String(m.ma ?? '').trim() === x || nfc(m.ten) === nfc(x))) cho.add(`${h.ma}|${x}`);
  dat('dung-tren-moc', cho.size);
  dat('du-lieu-sai-gia-tri', hang.filter(h => h.du_lieu !== undefined && !['sinh-gia', 'gia'].includes(h.du_lieu)).length);
  dat('thieu-hang-sinh-gia', hang.filter(h => h.du_lieu === 'gia' && !(Array.isArray(h.dung_tren) ? h.dung_tren : []).some(x => (ma.get(String(x).trim()) || {}).du_lieu === 'sinh-gia')).length);
  if (hang.some(h => String(h.ten_ngan ?? '').trim())) dat('ten-ngan', new Set(hang.filter(h => !String(h.ten_ngan ?? '').trim()).map(h => String(h.ma))).size);
  dat('moc-qua-ngay', moc.filter(m => /^\d{4}-\d{2}-\d{2}$/.test(m.ngay || '') && m.ngay < today && !String(m.that ?? '').trim() && m.loai !== 'ngoai' && (m.hang || []).map(String).filter(x => chu.has(x)).every(giao)).length);
  const am = await dapAnMoc(kitCu, r, data, 'docs/plan/lo-trinh.json'); const theoTen = new Map(moc.map(m => [String(m.ten), m]));
  const dongMoc = am.moc.length || am.chua_hen ? ['Mốc:', ...am.moc.flatMap(m => [`  · ${M.LT.tenNganMoc(theoTen.get(m.ten))} — ${m.con ? `còn ${m.con}/${m.tong} việc` : `đã giao đủ ${m.tong} việc`}`, ...m.viec.map(v => `      – ${v.ten} (${v.tt}) [${v.ma}]`)]), ...(am.chua_hen ? [`  · ${am.chua_hen} việc chưa hẹn mốc`] : [])] : [];
  return { co, dongMoc };
}
const boNgayGM = l => l.replace(/bắt đầu ~\d\d\/\d\d/, 'bắt đầu ~N').replace(/hoàn tất dự kiến \d\d\/\d\d/g, 'hoàn tất dự kiến N').replace(/ \(quá tải — dự kiến \d\d\/\d\d, mục tiêu \d\d\/\d\d\)/, '').replace(' (máy chạy 24/24 — chưa đo nhịp ngày)', '');
const LA_GM = l => /^  · .+: (bắt đầu ~|không tính được)/.test(l);
// Khối dữ liệu: bỏ đúng năm khoá của mô hình hiển thị (AC-11) thì phải bằng khối bộ máy cũ (trừ số phiên bản bộ vẽ).
const boKhoaMoi = o => { const c = JSON.parse(JSON.stringify(o)); delete c.nguon; for (const t of c.lo_trinh || []) { delete t.chua_hen_moc; for (const h of t.hang || []) delete h.ten_hien_thi; for (const m of t.moc || []) { delete m.hien; delete m.viec_hien; delete m.con_lai; } } return c; };
async function rd10kho(kit) {
  const sai = []; const TODAY = '2026-10-20';
  const KHO = { kit: { 'docs/plan/lo-trinh.json': JSON.parse(readFileSync(path.join(KIT, 'docs', 'plans', 'lo-trinh-kit.json'), 'utf8')) },
    'crm-okr': { 'docs/plan/lo-trinh.json': fxCrm('okr.json') }, 'crm-kho-tai-lieu': { 'docs/plan/lo-trinh.json': fxCrm('kho-tai-lieu.json') },
    'crm-viec-du-an': { 'docs/plan/lo-trinh.json': fxCrm('viec-du-an.json') }, oneflow: { 'docs/plan/lo-trinh.json': JSON.parse(readFileSync(path.join(FX, 'oneflow.json'), 'utf8')) } };
  for (const [ten, tep] of Object.entries(KHO)) {
    const r = kho({ tep }); const data = tep['docs/plan/lo-trinh.json']; const a = await veTrang(boMayCu(), r); const b = await veTrang(kit, r);
    if (chuanTrang(a) !== chuanTrang(b)) { const ca = chuanTrang(a); const cb = chuanTrang(b); let i = 0; while (ca[i] === cb[i]) i += 1; sai.push(`${ten}: trang khác ngoài vùng kỳ vọng — cũ ${JSON.stringify(ca.slice(Math.max(0, i - 20), i + 160))} · mới ${JSON.stringify(cb.slice(Math.max(0, i - 20), i + 160))}`); }
    const ka = boKhoaMoi(khoiCua(a)); const kb = boKhoaMoi(khoiCua(b)); delete ka.phien_ban; delete kb.phien_ban;
    // «Cần sửa» của khối: mục mới (ma null) mỗi nhóm cờ của luật chỉ việc phát triển một mục, số đúng tệp — rồi bỏ chúng mà so.
    const { co: coK } = await kyVongXem(boMayCu(), r, data, '2026-10-20'); const NAM = NHOM_CO.slice(0, 5);
    const moiCS = (kb.lo_trinh[0].can_sua || []).filter(c => c.ma === null && NAM.some(([, re]) => re.test(c.chu)));
    const thayCS = moiCS.map(c => { const g = NAM.find(([, re]) => re.test(c.chu)); return `${g[0]}=${c.chu.match(g[1])[1]}`; }).sort();
    const kyCS = [...coK].filter(([t]) => NAM.some(([n]) => n === t)).map(([t, n]) => `${t}=${n}`).sort();
    if (JSON.stringify(thayCS) !== JSON.stringify(kyCS)) sai.push(`${ten}: «Cần sửa» của khối: kỳ vọng ${JSON.stringify(kyCS)} · thấy ${JSON.stringify(thayCS)}`);
    kb.lo_trinh[0].can_sua = (kb.lo_trinh[0].can_sua || []).filter(c => !moiCS.includes(c));
    if (JSON.stringify(ka) !== JSON.stringify(kb)) { const lech = []; const di = (x, y, p) => { if (JSON.stringify(x) === JSON.stringify(y)) return; if (x && y && typeof x === 'object' && typeof y === 'object') { for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) di(x[k], y[k], `${p}.${k}`); } else lech.push(`${p}: ${JSON.stringify(x)?.slice(0, 80)} → ${JSON.stringify(y)?.slice(0, 80)}`); }; di(ka, kb, ''); sai.push(`${ten}: khối dữ liệu khác bộ máy cũ ngoài năm khoá mô hình hiển thị — ${lech.length} chỗ: ${lech.slice(0, 4).join(' · ')}`); }
    const xa = xem(boMayCu(), r, TODAY).stdout.split('\n'); const xb = xem(kit, r, TODAY).stdout.split('\n');
    const { co, dongMoc } = await kyVongXem(boMayCu(), r, data, TODAY);
    const them = xb.filter(l => !xa.includes(l)); const bot = xa.filter(l => !xb.includes(l));
    // Cờ: mỗi dòng «  ! » mới thuộc đúng một nhóm, số đầu dòng == số tính từ tệp; mọi nhóm kỳ vọng có đúng một dòng.
    const thayCo = new Map(); const la = [];
    for (const l of them.filter(x => x.startsWith('  ! '))) { const c = l.slice(4); const g = NHOM_CO.find(([, re]) => re.test(c)); if (!g) { la.push(l); continue; } thayCo.set(g[0], [...(thayCo.get(g[0]) || []), +c.match(g[1])[1]]); }
    for (const [t, n] of co) if (JSON.stringify(thayCo.get(t)) !== JSON.stringify([n])) la.push(`cờ ${t}: kỳ vọng [${n}] · thấy ${JSON.stringify(thayCo.get(t) || [])}`);
    for (const t of thayCo.keys()) if (!co.has(t)) la.push(`cờ ${t} không có trong kỳ vọng`);
    // Khối Mốc: đúng từng dòng, đúng thứ tự.
    const iM = xb.indexOf('Mốc:'); const thayMoc = iM < 0 ? [] : [xb[iM], ...xb.slice(iM + 1).filter((l, j, arr) => arr.slice(0, j + 1).every(x => /^  · |^      – /.test(x)))];
    if (JSON.stringify(thayMoc) !== JSON.stringify(dongMoc)) la.push(`khối Mốc: kỳ vọng ${dongMoc.length} dòng · thấy ${thayMoc.length}`);
    // Giờ máy: cùng tập mốc; bỏ ngày và nhãn 24/24 thì từng dòng bằng dòng cũ; dòng mới mang đúng nhãn.
    const gmA = xa.filter(LA_GM); const gmB = xb.filter(LA_GM);
    if (JSON.stringify(gmA.map(boNgayGM).sort()) !== JSON.stringify(gmB.map(boNgayGM).sort()) || gmB.some(l => !l.endsWith(' (máy chạy 24/24 — chưa đo nhịp ngày)'))) la.push(`giờ máy: ${gmA.length} dòng cũ · ${gmB.length} dòng mới, khác ngoài ngày/nhãn`);
    const ngoai = [...them.filter(l => !l.startsWith('  ! ') && !LA_GM(l) && !thayMoc.includes(l) && !/^Giờ máy theo mốc/.test(l)), ...bot.filter(l => !LA_GM(l) && !/^Giờ máy theo mốc/.test(l)).map(l => `(mất) ${l}`)];
    la.push(...ngoai);
    console.log(`    · RD-10-kho ${ten}: «Cần sửa» của khối thêm ${moiCS.length} · cờ kỳ vọng ${JSON.stringify([...co])} · thấy ${JSON.stringify([...thayCo])} · khối Mốc kỳ vọng ${dongMoc.length}/thấy ${thayMoc.length} dòng · giờ máy ${gmA.length}→${gmB.length} · ngoài tập kỳ vọng ${la.length}`);
    if (la.length) sai.push(`${ten}: ${JSON.stringify(la.slice(0, 3))}`);
  }
  // Kho không khai lo_trinh: không đổi một byte.
  const r0 = path.join(TMP, `khong-lt-${++n}`); mkdirSync(path.join(r0, '_acceptance'), { recursive: true }); execFileSync('git', ['init', '-q', r0]);
  writeFileSync(path.join(r0, '_acceptance', 'config.yaml'), 'schema_version: 1\n');
  const p0 = xem(boMayCu(), r0); const p1 = xem(kit, r0); const v0 = await veTrang(boMayCu(), r0); const v1 = await veTrang(kit, r0);
  console.log(`    · RD-10-kho không lo_trinh: --xem thoát ${p0.status}/${p1.status}, trang ${v0 === null ? 'null' : 'có'}/${v1 === null ? 'null' : 'có'}`);
  if (p0.status !== p1.status || p0.stdout !== p1.stdout || p0.stderr !== p1.stderr || v0 !== v1) sai.push('kho không khai lo_trinh: đầu ra khác bộ máy cũ');
  return sai;
}
if (want('RD-10-kho') && await chayCa('RD-10-kho', rd10kho)) ok('RD-10-kho', 'năm kho (kit · crm ba lộ trình · oneflow) + kho không lo_trinh: trang ngoài khối Mốc/Cần sửa/khối dữ liệu/CSS giống từng byte bộ máy v2.32.0; bản xem và khối dữ liệu chỉ khác ở dòng thuộc tập kỳ vọng tính từ tệp (khối Mốc, cờ luật chỉ việc phát triển, dòng tên ngắn, dòng gom mốc quá ngày, giờ máy chỉ dời ngày); kho không lo_trinh không đổi');
if (want('RD-10-kho-do')) await chayDo('RD-10-kho-do', rd10kho, [['scripts/lo-trinh.mjs', 'co.push(`cờ moc-ngoai-da-bo: ${new Set(ngoai).size} mốc là việc', 'co.push(`cờ moc-ngoai-da-bo: ${new Set(ngoai).size + 1} mốc là việc']], 'cờ moc-ngoai-da-bo: kỳ vọng', 'bản sao đếm thừa một mốc ngoài');

// ═══ RD-tat: bộ nhát tắt dùng chung cho các ca «giống bộ máy gốc» của hồ sơ đã ký ═══════════════════
const { tatRD1 } = await import(pathToFileURL(path.join(HERE, 'tat-rd1.mjs')).href);
async function rdTat(kit) {
  const sai = []; const tat = tatRD1(kit); const cu0 = boMayCu();
  const KHO_TAT = { crm: khoCrm(), 'kho-thu': kho({ tep: { 'docs/plan/lo-trinh.json': DATA11() } }), 'ra-soat': kho({ tep: { 'docs/plan/lo-trinh.json': fxCrm('okr-ra-soat-1017.json') } }) };
  for (const [ten, r] of Object.entries(KHO_TAT)) {
    if (await veTrang(tat, r) !== await veTrang(cu0, r)) sai.push(`${ten}: trang bản tắt khác v2.32.0`);
    if (xem(tat, r).stdout !== xem(cu0, r).stdout) sai.push(`${ten}: bản xem chữ bản tắt khác v2.32.0`);
    // Lệnh «xem» trên thẻ in đường của chính bộ máy — chuẩn hoá về KIT trước khi so.
    const the = async k => { const M = await napLT(k); return JSON.stringify(M.LT.loTrinhThe({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS, today: HOM_NAY })?.dong).split(k).join('KIT'); };
    { const x = JSON.parse(await the(tat)); const y = JSON.parse(await the(cu0)); const i = x.findIndex((l, k) => l !== y[k]); if (i >= 0 || x.length !== y.length) sai.push(`${ten}: thẻ khởi động bản tắt khác v2.32.0 ở dòng ${i}: «${x[i]}» ≠ «${y[i]}»`); }
  }
  return sai;
}
if (want('RD-tat') && await chayCa('RD-tat', rdTat)) ok('RD-tat', 'bản tắt đúng các khối RD1 (27 nhát, mỗi nhát khớp một lần): trang · bản xem chữ · thẻ khởi động giống từng byte v2.32.0 trên crm thật, kho thử, bản hạt giống rà soát');

console.log(`\nRD Results: ${pass} PASS · ${fail} FAIL`);
process.exit(fail ? 1 : 0);
