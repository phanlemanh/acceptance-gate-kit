// lo-trinh-gio-may.test.mjs — hồ sơ lo-trinh-gio-may (hàng RM6), ca GM-<n> = AC-n của hợp đồng. Mỗi eval của evals.yaml ghim
// đúng dòng «PASS: GM-…» của tệp này (GM-6-that được phép in «SKIP: GM-6-that — …» khi máy không có bản ghi phiên).
//
// Kho thử và bản ghi phiên giả do CODE sinh trong lượt (git init trong thư mục tạm; «hôm nay» ghim bằng ACCEPTANCE_TODAY; bản
// ghi phiên trỏ bằng CLAUDE_PROJECTS_DIR; tệp đọc hạn mức trỏ bằng HAN_MUC_TEP). Giá trị mong đợi viết sẵn trong ca. «Bộ máy
// gốc» = `git archive <gốc so> scripts lib skills commands road-map`, gốc so đọc từ _acceptance/lo-trinh-gio-may/goc-so. Ca đỏ
// chạy CHÍNH hàm đo trên BẢN SAO của vật (nhát tiêm khớp đúng một lần), SAU khi bản lành xanh trên cùng dữ liệu, và ghim
// thông điệp. Mọi đường dẫn suy từ vị trí tệp này. Không ca nào ghi vào cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, realpathSync, statSync, utimesSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const GOC = readFileSync(path.join(KIT, '_acceptance', 'lo-trinh-gio-may', 'goc-so'), 'utf8').trim();
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'gm-')));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.GM_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-'));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...o });
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const bam = p => (existsSync(p) ? createHash('sha256').update(readFileSync(p)).digest('hex') : null);
const KT = await import(pathToFileURL(path.join(HERE, 'lo-trinh-kho-thu.mjs')).href);

const TEP = 'docs/lo-trinh.json';
const D = '2026-10-20';
const EV = (slug, ky) => `---\nschema_version: 1\nfeature_slug: ${slug}\nverdict: PASS\nhuman_signoff: M ${ky}\n---\n`;
const dongGM = o => JSON.stringify({ ts: '2026-10-20T00:00:00Z', kind: 'gio-may', ...o }) + '\n';
// hồ sơ: { slug: { hinh, tier, ky?, gm?: {...}, duBao?: {...}, ma? } }
function ghiHoSo(r, hoSo) {
  for (const [slug, s] of Object.entries(hoSo)) {
    const d = path.join(r, '_acceptance', slug); mkdirSync(d, { recursive: true });
    for (const [f, t] of Object.entries(KT.HO_SO[s.hinh](slug, s.tier || 'T2'))) writeFileSync(path.join(d, f), t);
    if (s.ky) writeFileSync(path.join(d, 'evidence-report.md'), EV(slug, s.ky));
    if (s.gm) writeFileSync(path.join(d, 'run-log.jsonl'), dongGM(s.gm));
    if (s.duBao) writeFileSync(path.join(d, 'du-bao.json'), JSON.stringify(s.duBao, null, 2) + '\n');
  }
}
let khoN = 0;
function kho({ data, hoSo = {}, ten = null }) {
  const r = path.join(TMP, ten || `kho-${++khoN}`); mkdirSync(r, { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main', r]); git(r, 'config', 'user.email', 'x@y.z'); git(r, 'config', 'user.name', 'Người Thử');
  mkdirSync(path.join(r, '_acceptance'), { recursive: true });
  writeFileSync(path.join(r, '_acceptance', 'config.yaml'), `schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n    - "LO-TRINH.html"\nlo_trinh:\n  tep: ${TEP}\n`);
  mkdirSync(path.join(r, 'docs'), { recursive: true }); writeFileSync(path.join(r, TEP), JSON.stringify(data, null, 2) + '\n');
  ghiHoSo(r, hoSo);
  const env = { ...process.env, GIT_AUTHOR_DATE: '2026-10-01T12:00:00Z', GIT_COMMITTER_DATE: '2026-10-01T12:00:00Z' };
  execFileSync('git', ['-C', r, 'add', '-A'], { env }); execFileSync('git', ['-C', r, 'commit', '-qm', 'c1'], { env });
  return r;
}
const H = (ma, o = {}) => ({ ma, cau_giao: `câu giao ${ma}`, ...o });

let bsN = 0;
function banSao(tiem = []) {
  const c = path.join(TMP, `bs-${++bsN}`);
  for (const d of ['scripts', 'lib', 'skills', 'commands', 'feature-loop', 'road-map', '.claude-plugin']) if (existsSync(path.join(KIT, d))) cpSync(path.join(KIT, d), path.join(c, d), { recursive: true });
  for (const f of ['GUIDE.md']) if (existsSync(path.join(KIT, f))) cpSync(path.join(KIT, f), path.join(c, f));
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
const chay = (kit, r, today, args, env = {}) => node([LT(kit), '--root', r, ...args], { env: { ...process.env, ACCEPTANCE_TODAY: today, ...env } });
const chayCa = async (id, f, kit = KIT) => { try { const s = await f(kit); if (s.length) bad(id, s.join(' ; ')); else return true; } catch (e) { bad(id, loi(e)); } return false; };
const chayDo = async (id, f, tiem, ghim, moTa) => {
  try {
    const lanh = await f(KIT); if (lanh.length) { bad(id, `bản lành chưa xanh — không tin được chiều đỏ: ${lanh[0]}`); return; }
    const s = await f(banSao(tiem)); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm đo trả «${g.slice(0, 110)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 260)}`);
  } catch (e) { bad(id, loi(e)); }
};
let napN = 0;
const nap = async kit => ({
  LT: await import(pathToFileURL(path.join(kit, 'scripts', 'lo-trinh.mjs')).href + `?v=${++napN}`),
  PM: await import(pathToFileURL(path.join(kit, 'scripts', 'product-map.mjs')).href + `?v=${napN}`),
});
const ve = async (kit, r, today = D) => {
  const cu = process.env.ACCEPTANCE_TODAY; process.env.ACCEPTANCE_TODAY = today;
  try { const M = await nap(kit); return M.LT.veTrang({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS }); }
  finally { if (cu === undefined) delete process.env.ACCEPTANCE_TODAY; else process.env.ACCEPTANCE_TODAY = cu; }
};
const giaiMa = s => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const chuTron = s => giaiMa(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const coTrang = html => [...html.matchAll(/<ul class="co-ds">([\s\S]*?)<\/ul>/g)].flatMap(u => [...u[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => chuTron(m[1])));
const oGio = html => [...html.matchAll(/<td data-nhan="Giờ máy">([^<]*)/g)].map(m => giaiMa(m[1]));
const oPt = html => [...html.matchAll(/<td data-nhan="Giờ máy">[^<]*<div class="mu nho">% hạn mức tuần: ([^<]*)<\/div>/g)].map(m => giaiMa(m[1]));
const liMoc = (html, ten) => { const m = html.match(new RegExp(`<li data-ngay="[^"]*" data-ten="${ten.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/"/g, '&quot;')}"[^>]*>([\\s\\S]*?)</li>`)); return m ? chuTron(m[1]) : null; };
const tenNgan = async (kit, m) => (await nap(kit)).LT.tenNganMoc(m);

// ═══ GM-1 (AC-1): khoá gio_may + đường đọc-cũ ════════════════════════════════════════════════════════════════════════
const gm1Data = { schema: 1, ten: 'Kế hoạch thử', moc: [], hang: [
  H('A', { hang: 'T2', gio_may: 6 }), H('B', { hang: 'T2', gio_may: [3, 5] }), H('C', { hang: 'T2', gio_may: 'nhiều' }),
  H('D', { hang: 'T2', gio_may: [5, 3] }), H('E', { hang: 'T3' }), H('F')] };
const gm1 = async kit => {
  const r = kho({ data: gm1Data }); const html = await ve(kit, r); const sai = [];
  const muon = ['6', '3–5', '4–7 (máy ước)', '4–7 (máy ước)', '7–10 (máy ước)', '4–7 (máy ước, chưa khai hạng)'];
  if (!deq(oGio(html), muon)) sai.push(`ô giờ máy ${JSON.stringify(oGio(html))} ≠ ${JSON.stringify(muon)}`);
  const co = coTrang(html).filter(c => c.includes('ô «giờ máy» phải là số giờ dương hoặc cặp [thấp, cao]'));
  for (const ma of ['C', 'D']) if (co.filter(c => c.startsWith(`${ma} `)).length !== 1) sai.push(`gio_may sai kiểu mà không cờ: ${ma}`);
  if (co.length !== 2) sai.push(`cờ gio_may ${co.length}, cần 2: ${JSON.stringify(co)}`);
  const M = await nap(kit); const { kq } = M.LT.phanTich({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS });
  for (const ma of ['C', 'D']) if (!kq.co.includes(`hàng ${ma}: gio_may phải là số giờ dương hoặc cặp [thấp, cao]`)) sai.push(`lớp phân tích thiếu cờ hàng ${ma}`);
  const dem = (html.match(/4\/6 hàng máy tự ước giờ máy — khai gio_may trên hàng để ghi đè/g) || []).length;
  if (dem !== 1) sai.push(`dòng đếm máy ước xuất hiện ${dem} lần, cần 1`);
  return sai;
};
if (want('GM-1')) { if (await chayCa('GM-1', gm1)) ok('GM-1', 'sáu ô giờ máy đúng dãy, hai cờ C/D, một dòng 4/6 máy ước'); }
if (want('GM-1-do')) await chayDo('GM-1-do', gm1, [['scripts/gio-may.mjs', 'if (so(v) && v > 0) return [v, v];', "if ((so(v) && v > 0) || typeof v === 'string') return [Number(v) || 1, Number(v) || 1];"]], 'gio_may sai kiểu mà không cờ: C', 'bản sao nhận chuỗi');

// Đọc-cũ: kho không khoá gio_may, không hồ sơ đo — các lệnh khác giống từng byte bộ máy gốc; khối dữ liệu trang không đổi.
const docCuData = { schema: 1, ten: 'Kế hoạch cũ', moc: [{ ten: 'Phát hành 1', ngay: '2026-10-25', loai: 'phat-hanh', hang: ['A', 'B'] }], hang: [H('A', { hang: 'T2', slug: 'viec-a' }), H('B', { hang: 'T3' }), H('C')] };
const docCuHoSo = { 'viec-a': { hinh: 'dang-dung' }, 'ngoai': { hinh: 'da-ship' } };
const khoiDuLieu = html => (html.match(/<script type="application\/json" id="lo-trinh-du-lieu">([\s\S]*?)<\/script>/) || [])[1];
if (want('GM-1-doc-cu') && await chayCa('GM-1-doc-cu', async kit => {
  const sai = []; const goc = banGoc();
  const so = (ten, f) => { const a = f(kit, 'moi'); const b = f(goc, 'goc'); if (b.st !== 0 || !b.out) sai.push(`đối chứng gốc không chạy: ${ten}`); if (a.st !== b.st || a.out !== b.out) sai.push(`${ten} khác bộ máy gốc: ${a.out.slice(0, 120)} ≠ ${b.out.slice(0, 120)}`); };
  const r = kho({ data: docCuData, hoSo: docCuHoSo });
  for (const [ten, args] of [['--ra-soat', ['--ra-soat']], ['--ra-soat --json', ['--ra-soat', '--json']], ['--ap --json', ['--ap', '--json']]]) so(ten, k => { const x = chay(k, r, D, args); return { st: x.status, out: x.stdout || (ten === '--ra-soat' ? '(rỗng)' : '') }; });
  so('--mo-o', (k, ben) => { const rr = kho({ data: docCuData, hoSo: docCuHoSo, ten: `${ben}-${khoN}/kho-mo` }); const x = chay(k, rr, D, ['--hang', 'C', '--mo-o', '--owner', 'x@y.z', '--slug', 'viec-c']);
    return { st: x.status, out: x.stdout + readFileSync(path.join(rr, '_acceptance', 'viec-c', 'opportunity.md'), 'utf8') }; });
  const a = khoiDuLieu(await ve(kit, r)); const b = khoiDuLieu(await ve(goc, r));
  if (!b) sai.push('đối chứng gốc không chạy: khối dữ liệu trang'); else if (a !== b) sai.push('khối dữ liệu máy đọc của trang khác bộ máy gốc');
  return sai;
})) ok('GM-1-doc-cu', '--ra-soat (chữ, JSON), --ap --json, --mo-o (stdout + ô) và khối dữ liệu trang giống từng byte bộ máy gốc');

if (want('GM-1-nang-kit') && await chayCa('GM-1-nang-kit', async kit => {
  const sai = []; const r = kho({ data: docCuData, hoSo: docCuHoSo });
  const pm = k => path.join(k, 'scripts', 'product-map.mjs');
  const g = node([pm(banGoc()), '--root', r]); if (g.status !== 0 || !existsSync(path.join(r, 'LO-TRINH.html'))) return [`đối chứng gốc không chạy: vẽ trang bằng bộ máy gốc thoát ${g.status}`];
  execFileSync('git', ['-C', r, 'add', '-A']); execFileSync('git', ['-C', r, 'commit', '-qm', 'trang cũ']);
  const c1 = node([pm(kit), '--root', r, '--check']);
  if (c1.status === 0) sai.push('bộ máy mới --check xanh trên trang cũ — trang không đổi');
  if (!c1.stderr.includes('LO-TRINH.html lệch với tệp ý định và hồ sơ — chạy:')) sai.push(`--check không nói câu vẽ lại có sẵn: ${c1.stderr.slice(0, 200)}`);
  const v = node([pm(kit), '--root', r]); if (v.status !== 0) sai.push(`vẽ lại thoát ${v.status}`);
  const c2 = node([pm(kit), '--root', r, '--check']); if (c2.status !== 0) sai.push(`--check sau khi vẽ lại thoát ${c2.status}: ${c2.stderr.slice(0, 200)}`);
  return sai;
})) ok('GM-1-nang-kit', 'trang cũ + bộ máy mới: --check báo lệch đúng câu có sẵn; vẽ lại thì xanh');

// ═══ GM-2 (AC-2): ước theo số đo khi đủ năm vòng ════════════════════════════════════════════════════════════════════
const sauVong = (pts) => Object.fromEntries([3, 4, 5, 6, 8, 2].map((g, i) => [`s${i + 1}`, { hinh: 'da-ship', tier: 'T2', gm: { gio_may: g, gio_cho: 1, phan_tram_tuan: pts[i] ?? null } }]));
const gm2Data = { schema: 1, ten: 'K', moc: [], hang: [H('X', { hang: 'T2' }), H('Y', { hang: 'T3' })] };
const gm2 = (pts, them = {}) => async kit => {
  const html = await ve(kit, kho({ data: gm2Data, hoSo: { ...sauVong(pts), ...them } }));
  return { gio: oGio(html), pt: oPt(html) };
};
if (want('GM-2')) { if (await chayCa('GM-2', async kit => {
  const { gio, pt } = await gm2([2, 3, 4, 5, 6])(kit); const sai = [];
  if (!deq(gio, ['3–6 (theo 6 vòng đo)', '7–10 (máy ước)'])) sai.push(`ô giờ máy ${JSON.stringify(gio)}`);
  if (pt[0] !== '~4 %') sai.push(`% hàng T2 «${pt[0]}», cần «~4 %»`);
  return sai;
})) ok('GM-2', 'T2 «3–6 (theo 6 vòng đo)», T3 «7–10 (máy ước)», % «~4 %»'); }
if (want('GM-2-thieu-phan-tram') && await chayCa('GM-2-thieu-phan-tram', async kit => {
  const { pt } = await gm2([2, 3, 4, 5])(kit); return pt[0] === 'chưa ước (4/5 vòng đo)' ? [] : [`ô % «${pt[0]}»`];
})) ok('GM-2-thieu-phan-tram', 'bốn vòng có % → «chưa ước (4/5 vòng đo)»');
const gm2ChuaGiao = async kit => {
  const { gio } = await gm2([2, 3, 4, 5, 6], { s7: { hinh: 'dang-dung', tier: 'T2', gm: { gio_may: 100, gio_cho: 1 } } })(kit);
  return gio[0] === '3–6 (theo 6 vòng đo)' ? [] : [`hồ sơ chưa giao vào phép ước: s7 (ô «${gio[0]}»)`];
};
if (want('GM-2-chua-giao') && await chayCa('GM-2-chua-giao', gm2ChuaGiao)) ok('GM-2-chua-giao', 'hồ sơ đo mà chưa giao không vào phép ước');
if (want('GM-2-do')) await chayDo('GM-2-do', gm2ChuaGiao, [['scripts/gio-may.mjs', 'const giao = doVong.filter(v => v.daGiao);', 'const giao = doVong;']], 'hồ sơ chưa giao vào phép ước: s7', 'bản sao đếm cả hồ sơ chưa giao');

// ═══ GM-3 (AC-3): tổng mốc trên trang, tất định, dự báo đóng băng, cắt bản một lần ═════════════════════════════════
const mocM = { ten: 'Phát hành M — bản thử', ngay: '2026-10-22', loai: 'phat-hanh', hang: ['P', 'Q', 'R'] };
const gm3Data = { schema: 1, ten: 'K', moc: [mocM], hang: [H('P', { hang: 'T2', gio_may: 5, slug: 'p' }), H('Q', { hang: 'T3' }), H('R', { hang: 'T2', slug: 'r' })] };
const gm3Kho = async (kit, dongBang) => {
  const hoSo = { r: { hinh: 'da-ship' } };
  if (dongBang) hoSo.p = { hinh: 'dang-dung', duBao: { ngay_tinh: '2026-10-15', hang: { ma: 'P', gio_may: [5, 5], phan_tram: null },
    moc: { ten: await tenNgan(KIT, mocM), bat_dau: '2026-10-15', hoan_tat: '2026-10-23', gio_may: [15.5, 20], gio_cho: 0, gio_cho_do: false, muc_tieu: '2026-10-22', hang: ['P', 'Q', 'R'] } } };
  return kho({ data: gm3Data, hoSo });
};
const gm3 = async kit => { const li = liMoc(await ve(kit, await gm3Kho(kit, false)), mocM.ten) || ''; const m = li.match(/~([\d,]+–[\d,]+) giờ máy/);
  return m && m[1] === '15,5–20' ? [] : [`tổng mốc ${m ? m[1] : '(không có)'}, cần 15,5–20 — dòng «${li.slice(0, 160)}»`]; };
if (want('GM-3')) { if (await chayCa('GM-3', gm3)) ok('GM-3', 'mốc M «~15,5–20 giờ máy» (5 + 7–10 + gộp 2×1–1,5 + cắt bản 1,5–2)'); }
const gm3TatDinh = async kit => { const r = await gm3Kho(kit, true); const a = await ve(kit, r, '2026-10-20'); const b = await ve(kit, r, '2026-11-30');
  return a === b ? [] : ['trang đổi theo hôm nay']; };
if (want('GM-3-tat-dinh') && await chayCa('GM-3-tat-dinh', gm3TatDinh)) ok('GM-3-tat-dinh', 'trang vẽ với hai ngày hôm nay giống từng byte');
if (want('GM-3-dong-bang') && await chayCa('GM-3-dong-bang', async kit => {
  const html = await ve(kit, await gm3Kho(kit, true)); const li = liMoc(html, mocM.ten) || ''; const sai = [];
  if (!li.includes('dự báo lúc bắt đầu (15/10): hoàn tất 23/10')) sai.push(`dòng mốc thiếu dự báo đóng băng: «${li.slice(0, 200)}»`);
  const co = (html.match(/mốc quá tải: dự kiến 23\/10, mục tiêu 22\/10/g) || []).length; if (co !== 1) sai.push(`cờ quá tải ${co} lần, cần 1`);
  return sai;
})) ok('GM-3-dong-bang', 'dòng mốc mang dự báo đóng băng 15/10 → 23/10 và đúng một cờ «mốc quá tải: dự kiến 23/10, mục tiêu 22/10»');
const mocM2 = { ten: 'Phát hành M′', ngay: '2026-10-30', loai: 'phat-hanh', hang: ['K', 'T'] };
const gm3CatBan = async kit => {
  const html = await ve(kit, kho({ data: { schema: 1, ten: 'K', moc: [mocM2], hang: [H('K', { nhom: 'phat-hanh' }), H('T', { hang: 'T2', gio_may: 5 })] } }));
  const li = liMoc(html, mocM2.ten) || ''; const m = li.match(/~([\d,]+–[\d,]+) giờ máy/);
  return m && m[1] === '7,5–8,5' ? [] : [`cắt bản đếm hai lần: M′ (tổng ${m ? m[1] : '(không có)'}, cần 7,5–8,5)`];
};
if (want('GM-3-cat-ban') && await chayCa('GM-3-cat-ban', gm3CatBan)) ok('GM-3-cat-ban', 'mốc phát hành có hàng cắt bản: «~7,5–8,5 giờ máy», cắt bản đếm một lần');
if (want('GM-3-do')) await chayDo('GM-3-do', gm3, [['scripts/gio-may.mjs', 'k = cong(cong(k, kd), BANG_LUAT.gop);', 'k = cong(k, kd);']], 'tổng mốc 13,5–17, cần 15,5–20', 'bản sao bỏ gộp');
if (want('GM-3-do2')) await chayDo('GM-3-do2', gm3TatDinh, [['scripts/lo-trinh.mjs', '  const muc = chuoi(m.ngay);\n  const tre = db', '  const muc = process.env.ACCEPTANCE_TODAY || chuoi(m.ngay);\n  const tre = db']], 'trang đổi theo hôm nay', 'bản sao đọc hôm nay khi vẽ');
if (want('GM-3-do3')) await chayDo('GM-3-do3', gm3CatBan, [['scripts/gio-may.mjs', 'if (u.laCatBan) { coCatBan = true; k = cong(k, kd); continue; }', 'if (u.laCatBan) { k = cong(k, kd); continue; }']], 'cắt bản đếm hai lần: M′', 'bản sao cộng cắt bản cấp mốc dù có hàng cắt bản');

// ═══ GM-4 (AC-4): dòng ngày dự kiến ở --xem ════════════════════════════════════════════════════════════════════════
const M1 = { ten: 'Mốc một', ngay: '2026-10-20', hang: ['A1', 'A2', 'A3'] };
const M2 = { ten: 'Mốc hai', ngay: '2026-10-25', hang: ['B1', 'W'] };
const M3 = { ten: 'Mốc không ngày', hang: ['C1'] };
const gm4Data = (them = []) => ({ schema: 1, ten: 'K', moc: [M1, M2, ...them], hang: [
  H('A1', { hang: 'T3', slug: 'a1' }), H('A2', { hang: 'T3' }), H('A3', { hang: 'T3' }), H('B1', { hang: 'T2', dung_tren: ['A1'] }),
  H('W', { hang: 'T2', slug: 'w' }), H('C1', { hang: 'T2' }), H('Z', { hang: 'T2' })] });
const gm4HoSo = (them = {}) => ({ w: { hinh: 'dang-dung', gm: { gio_may: 3, gio_cho: 1 } }, ...them });
const xemGM = (x) => { const l = x.stdout.split('\n'); const i = l.indexOf('Giờ máy theo mốc:'); return i < 0 ? [] : l.slice(i + 1).filter(s => s.startsWith('  · ')).map(s => s.slice(4)); };
const gm4 = async kit => {
  const r = kho({ data: gm4Data(), hoSo: gm4HoSo() }); const x = chay(kit, r, D, ['--xem']); const sai = [];
  if (x.status !== 0) return [`--xem thoát ${x.status}: ${x.stderr.slice(0, 200)}`];
  const t1 = await tenNgan(KIT, M1); const t2 = await tenNgan(KIT, M2);
  const muon = [
    `${t1}: bắt đầu ~20/10 · ~24–34,5 giờ máy · % hạn mức tuần chưa ước (0/5 vòng đo) · hoàn tất dự kiến 21/10 · mục tiêu 20/10 (quá tải — dự kiến 21/10, mục tiêu 20/10) (chưa có giờ chờ đo)`,
    `${t2}: bắt đầu ~21/10 · ~7–14 giờ máy · % hạn mức tuần chưa ước (0/5 vòng đo) · hoàn tất dự kiến 21/10 · mục tiêu 25/10 (chưa có giờ chờ đo)`];
  const ra = xemGM(x);
  if (ra.length && ra[1] && ra[1].includes('bắt đầu ~20/10')) sai.push('M2 bắt đầu D, cần sau M1');
  if (ra[1] && ra[1].includes('~10–17 giờ máy')) sai.push('hàng đang dở tính lại phần đã làm');
  if (!deq(ra, muon)) sai.push(`dòng giờ máy ${JSON.stringify(ra)} ≠ ${JSON.stringify(muon)}`);
  if (git(r, 'status', '--porcelain')) sai.push('--xem ghi tệp');
  return sai;
};
if (want('GM-4')) { if (await chayCa('GM-4', gm4)) ok('GM-4', 'hai dòng khuôn đúng từng chữ: M1 quá tải, M2 bắt đầu sau M1, hàng đang dở tính 1–4, chưa có giờ chờ đo'); }
if (want('GM-4-do-du') && await chayCa('GM-4-do-du', async kit => {
  const r = kho({ data: gm4Data(), hoSo: gm4HoSo({ g1: { hinh: 'da-ship', gm: { gio_may: 5, gio_cho: 2 } }, g2: { hinh: 'da-ship', gm: { gio_may: 5, gio_cho: 4 } } }) });
  const ra = xemGM(chay(kit, r, D, ['--xem'])); const t2 = await tenNgan(KIT, M2);
  const muon = `${t2}: bắt đầu ~21/10 · ~7–14 giờ máy · % hạn mức tuần chưa ước (0/5 vòng đo) · hoàn tất dự kiến 22/10 · mục tiêu 25/10`;
  return ra[1] === muon ? [] : [`dòng M2 «${ra[1]}» ≠ «${muon}»`];
})) ok('GM-4-do-du', 'có vòng đo: giờ chờ = trung vị 3 giờ, M2 hoàn tất 22/10, không nhãn «chưa có giờ chờ đo»');
if (want('GM-4-khong-ngay') && await chayCa('GM-4-khong-ngay', async kit => {
  const r = kho({ data: gm4Data([M3]), hoSo: gm4HoSo() }); const ra = xemGM(chay(kit, r, D, ['--xem'])); const t3 = await tenNgan(KIT, M3);
  const muon = `${t3}: bắt đầu ~20/10 · ~5–8,5 giờ máy · % hạn mức tuần chưa ước (0/5 vòng đo) · hoàn tất dự kiến 20/10 (chưa có giờ chờ đo)`;
  return ra.includes(muon) ? [] : [`thiếu dòng «${muon}» trong ${JSON.stringify(ra)}`];
})) ok('GM-4-khong-ngay', 'mốc không ngày: dòng không vế mục tiêu, không cờ quá tải');
if (want('GM-4-do')) await chayDo('GM-4-do', gm4, [['scripts/gio-may.mjs', 'if (t.hoanTatGio > batDau) batDau = t.hoanTatGio;', 'if (false) batDau = t.hoanTatGio;']], 'M2 bắt đầu D, cần sau M1', 'bản sao bỏ phụ thuộc');
if (want('GM-4-do2')) await chayDo('GM-4-do2', gm4, [['scripts/gio-may.mjs', 'if (!d.dangDo || !d.hoSo) return u.khoang;', 'return u.khoang;']], 'hàng đang dở tính lại phần đã làm', 'bản sao tính đủ hàng đang dở');

// ═══ GM-5 (AC-5): đóng băng dự báo lúc --mo-o ══════════════════════════════════════════════════════════════════════
const moO = (kit, r, ma, slug) => chay(kit, r, D, ['--hang', ma, '--mo-o', '--owner', 'x@y.z', ...(slug ? ['--slug', slug] : [])]);
if (want('GM-5')) { if (await chayCa('GM-5', async kit => {
  const sai = []; const goc = banGoc();
  const rm = kho({ data: gm4Data(), hoSo: gm4HoSo(), ten: `moi-${khoN}/kho-gm5` }); const rg = kho({ data: gm4Data(), hoSo: gm4HoSo(), ten: `goc-${khoN}/kho-gm5` });
  const a = moO(kit, rm, 'A1'); const b = moO(goc, rg, 'A1');
  if (b.status !== 0 || !b.stdout) sai.push('đối chứng gốc không chạy: --mo-o của bộ máy gốc');
  if (a.stdout !== b.stdout) sai.push(`stdout --mo-o khác bộ máy gốc: ${a.stdout} ≠ ${b.stdout}`);
  const oc = p => readFileSync(path.join(p, '_acceptance', 'a1', 'opportunity.md'), 'utf8');
  if (oc(rm) !== oc(rg)) sai.push('ô cơ hội khác bộ máy gốc');
  const p = path.join(rm, '_acceptance', 'a1', 'du-bao.json'); if (!existsSync(p)) return [...sai, 'không có du-bao.json'];
  const muon = { ngay_tinh: '2026-10-20', hang: { ma: 'A1', gio_may: [7, 10], phan_tram: null },
    moc: { ten: await tenNgan(KIT, M1), bat_dau: '2026-10-20', hoan_tat: '2026-10-21', gio_may: [24, 34.5], gio_cho: 0, gio_cho_do: false, muc_tieu: '2026-10-20', hang: ['A1', 'A2', 'A3'] } };
  const co = JSON.parse(readFileSync(p, 'utf8')); if (!deq(co, muon)) sai.push(`du-bao.json ${JSON.stringify(co)} ≠ ${JSON.stringify(muon)}`);
  return sai;
})) ok('GM-5', 'du-bao.json bằng đối tượng viết sẵn; stdout và ô cơ hội giống từng byte bộ máy gốc'); }
const gm5ChayLai = async kit => {
  const r = kho({ data: gm4Data(), hoSo: gm4HoSo() }); const x = moO(kit, r, 'A1'); if (x.status !== 0) return [`--mo-o lần một thoát ${x.status}`];
  const p = path.join(r, '_acceptance', 'a1', 'du-bao.json'); const h = bam(p); const t = statSync(p).mtimeMs;
  await new Promise(res => setTimeout(res, 20));
  const y = moO(kit, r, 'A1'); if (y.status !== 0) return [`--mo-o lần hai thoát ${y.status}`];
  return bam(p) === h && statSync(p).mtimeMs === t ? [] : ['dự báo đóng băng bị ghi đè'];
};
if (want('GM-5-chay-lai') && await chayCa('GM-5-chay-lai', gm5ChayLai)) ok('GM-5-chay-lai', 'chạy --mo-o lần hai: băm và mtime du-bao.json không đổi');
if (want('GM-5-khong-moc') && await chayCa('GM-5-khong-moc', async kit => {
  const r = kho({ data: gm4Data(), hoSo: gm4HoSo() }); const x = moO(kit, r, 'Z', 'viec-z'); if (x.status !== 0) return [`--mo-o thoát ${x.status}`];
  const o = JSON.parse(readFileSync(path.join(r, '_acceptance', 'viec-z', 'du-bao.json'), 'utf8'));
  return deq(Object.keys(o), ['ngay_tinh', 'hang']) ? [] : [`khoá du-bao.json ${JSON.stringify(Object.keys(o))}`];
})) ok('GM-5-khong-moc', 'hàng không gắn mốc: du-bao.json chỉ có ngay_tinh và hang');
if (want('GM-5-do')) await chayDo('GM-5-do', gm5ChayLai, [['scripts/lo-trinh.mjs', "  if (d && d.hoSo) { process.stdout.write(", "  if (d && d.hoSo) { try { writeFileSync(path.join(root, '_acceptance', d.hoSo, GM.DU_BAO_TEP), '{}\\n'); } catch {} process.stdout.write("]], 'dự báo đóng băng bị ghi đè', 'bản sao ghi lại tệp dự báo khi hàng đã có hồ sơ');

// ═══ GM-6 (AC-6) / GM-7 (AC-7): đo vòng từ bản ghi phiên ═══════════════════════════════════════════════════════════
const ISO = (base, phut) => new Date(base + phut * 60e3).toISOString();
const ev = (base, phut, o = {}) => JSON.stringify({ timestamp: ISO(base, phut), type: 'user', ...o });
const msg = (base, phut, id, model, u) => JSON.stringify({ timestamp: ISO(base, phut), type: 'assistant', message: { id, model, usage: u } });
// Bản ghi giả theo đúng hình thư mục Claude Code đã thấy trên máy 15/10 (<dự án>/<mã>.jsonl + <dự án>/<mã>/subagents/*.jsonl).
// `base` = mốc 0 phút (decided_at của ô = base). Trả { projects, den }.
function banGhi(slug, base, { songSong = false, truocCuaSo = false } = {}) {
  const P = path.join(TMP, `projects-${++khoN}`); const pj = path.join(P, 'proj1'); const sub = path.join(pj, 's1', 'subagents');
  mkdirSync(sub, { recursive: true }); mkdirSync(path.join(P, 'proj2'), { recursive: true });
  const cham = `đọc _acceptance/${slug}/contract.md`;
  let main; let a1; let a2 = null; let den;
  if (!songSong) {
    main = [ev(base, 60, { cham }), msg(base, 65, 'm1', 'claude-opus-5-5', { input_tokens: 10, output_tokens: 100, cache_read_input_tokens: 1000, cache_creation_input_tokens: 50 }),
      msg(base, 65, 'm1', 'claude-opus-5-5', { input_tokens: 10, output_tokens: 100, cache_read_input_tokens: 1000, cache_creation_input_tokens: 50 }),
      ev(base, 70), ev(base, 120), msg(base, 128, 'm2', 'claude-opus-5-5', { output_tokens: 200 })];
    a1 = [ev(base, 80), msg(base, 85, 'm3', 'claude-sonnet-5-5', { input_tokens: 5, output_tokens: 30 })];
    den = base + 130 * 60e3;
  } else {
    main = [ev(base, 60, { cham }), msg(base, 65, 'm1', 'claude-opus-5-5', { output_tokens: 100 }), ev(base, 70), ev(base, 75), ev(base, 80)];
    a1 = [ev(base, 60), msg(base, 65, 'm3', 'claude-sonnet-5-5', { output_tokens: 10 }), ev(base, 70), ev(base, 75), ev(base, 80)];
    a2 = [ev(base, 60), msg(base, 65, 'm5', 'claude-haiku-5-5', { output_tokens: 1 }), ev(base, 70), ev(base, 75), ev(base, 80)];
    den = base + 90 * 60e3;
  }
  if (truocCuaSo) main.unshift(msg(base, -10, 'm0', 'claude-opus-5-5', { output_tokens: 5000 }));
  writeFileSync(path.join(pj, 's1.jsonl'), main.join('\n') + '\n');
  writeFileSync(path.join(sub, 'agent-1.jsonl'), a1.join('\n') + '\n');
  if (a2) writeFileSync(path.join(sub, 'agent-2.jsonl'), a2.join('\n') + '\n');
  writeFileSync(path.join(P, 'proj2', 's2.jsonl'), [ev(base, 60, { noi: 'việc khác' }), msg(base, 90, 'm4', 'claude-opus-5-5', { output_tokens: 999 })].join('\n') + '\n');
  const mt = new Date(Math.max(den, Date.now())); for (const f of [path.join(pj, 's1.jsonl'), path.join(sub, 'agent-1.jsonl'), path.join(P, 'proj2', 's2.jsonl'), ...(a2 ? [path.join(sub, 'agent-2.jsonl')] : [])]) utimesSync(f, mt, mt);
  return { projects: P, den };
}
const BASE6 = Date.parse('2026-10-20T00:00:00Z');
function khoVong(slug, base) {
  const r = kho({ data: { schema: 1, ten: 'K', moc: [], hang: [] } });
  const d = path.join(r, '_acceptance', slug); mkdirSync(d, { recursive: true });
  writeFileSync(path.join(d, 'opportunity.md'), `---\nschema_version: 1\nslug: ${slug}\nstage: decided\ndecision: build\ndecided_by: M\ndecided_at: ${new Date(base).toISOString().replace('.000Z', 'Z')}\n---\n`);
  writeFileSync(path.join(d, 'run-log.jsonl'), '{"kind":"khac"}\n');
  return r;
}
const DV = kit => path.join(kit, 'scripts', 'do-vong.mjs');
const doVong = (kit, r, slug, P, den, { ghi = false, hanMuc = path.join(TMP, 'khong-co-han-muc.jsonl') } = {}) =>
  node([DV(kit), '--root', r, '--slug', slug, ...(den ? ['--den', new Date(den).toISOString()] : []), ...(ghi ? ['--write'] : [])], { env: { ...process.env, CLAUDE_PROJECTS_DIR: P, HAN_MUC_TEP: hanMuc } });
const TOKEN6 = { 'claude-opus-5-5': { vao: 10, ra: 300, doc_dem: 1000, ghi_dem: 50 }, 'claude-sonnet-5-5': { vao: 5, ra: 30, doc_dem: 0, ghi_dem: 0 } };
const gm6 = async kit => {
  const r = khoVong('vong', BASE6); const { projects, den } = banGhi('vong', BASE6);
  const x = doVong(kit, r, 'vong', projects, den, { ghi: true }); if (x.status !== 0) return [`do-vong thoát ${x.status}: ${x.stderr}`];
  const dong = readFileSync(path.join(r, '_acceptance', 'vong', 'run-log.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)).filter(o => o.kind === 'gio-may');
  if (dong.length !== 1) return [`run-log có ${dong.length} dòng gio-may, cần 1`];
  const o = dong[0]; const sai = [];
  if (o.gio_may !== 0.55) sai.push(`gio_may ${o.gio_may}, cần 0.55`);
  if (o.gio_cho !== 1.62) sai.push(`gio_cho ${o.gio_cho}, cần 1.62`);
  if (o.token && o.token['claude-opus-5-5'] && o.token['claude-opus-5-5'].ra === 400) sai.push('token ra 2×, cần 1×');
  if (o.token && o.token['claude-opus-5-5'] && o.token['claude-opus-5-5'].ra >= 999) sai.push('bản ghi lạ vào phép đo');
  if (!deq(o.token, TOKEN6)) sai.push(`token ${JSON.stringify(o.token)} ≠ ${JSON.stringify(TOKEN6)}`);
  if (!deq(o.nguon, ['proj1/s1.jsonl', 'proj1/s1/subagents/agent-1.jsonl'])) { sai.push(`nguon ${JSON.stringify(o.nguon)}`); if (Array.isArray(o.nguon) && o.nguon.some(n => n.includes('proj2'))) sai.push('bản ghi lạ vào phép đo'); }
  return sai;
};
if (want('GM-6')) { if (await chayCa('GM-6', gm6)) ok('GM-6', 'một dòng gio-may: 0,55 giờ máy · 1,62 giờ chờ · token theo model × loại · nguồn đúng hai bản ghi'); }
const gm6SongSong = async kit => {
  const r = khoVong('vong', BASE6); const { projects, den } = banGhi('vong', BASE6, { songSong: true, truocCuaSo: true });
  const x = doVong(kit, r, 'vong', projects, den); if (x.status !== 0) return [`do-vong thoát ${x.status}`];
  const o = JSON.parse(x.stdout); const sai = [];
  if (o.gio_may !== 0.33) sai.push(o.gio_may > 0.9 ? 'giờ máy cộng trùng tác tử song song' : `gio_may ${o.gio_may}, cần 0.33`);
  const muon = { 'claude-haiku-5-5': { vao: 0, ra: 1, doc_dem: 0, ghi_dem: 0 }, 'claude-opus-5-5': { vao: 0, ra: 100, doc_dem: 0, ghi_dem: 0 }, 'claude-sonnet-5-5': { vao: 0, ra: 10, doc_dem: 0, ghi_dem: 0 } };
  if (!deq(o.token, muon)) sai.push(o.token && o.token['claude-opus-5-5'] && o.token['claude-opus-5-5'].ra >= 5000 ? 'sự kiện ngoài cửa sổ vào phép đo' : `token ${JSON.stringify(o.token)}`);
  return sai;
};
if (want('GM-6-song-song') && await chayCa('GM-6-song-song', gm6SongSong)) ok('GM-6-song-song', 'ba bản ghi chồng giờ: 0,33 giờ máy (hợp khoảng); sự kiện trước ngày quyết không vào token');
if (want('GM-6-mu') && await chayCa('GM-6-mu', async kit => {
  const r = khoVong('khac', BASE6); const { projects, den } = banGhi('vong', BASE6);
  const x = doVong(kit, r, 'khac', projects, den); if (x.status !== 0) return [`do-vong thoát ${x.status}`];
  const o = JSON.parse(x.stdout);
  return o.nguon === 'khong-co-ban-ghi' && o.gio_may === null && o.token === null ? [] : [`dòng ${x.stdout.slice(0, 200)}`];
})) ok('GM-6-mu', 'không bản ghi chạm hồ sơ: nguon khong-co-ban-ghi, giờ và token null, thoát 0');
if (want('GM-6-khong-ghi') && await chayCa('GM-6-khong-ghi', async kit => {
  const r = khoVong('vong', BASE6); const { projects, den } = banGhi('vong', BASE6); const p = path.join(r, '_acceptance', 'vong', 'run-log.jsonl'); const h = bam(p);
  const x = doVong(kit, r, 'vong', projects, den); if (x.status !== 0 || !x.stdout.includes('"gio-may"')) return [`do-vong thoát ${x.status} hoặc không in dòng`];
  return bam(p) === h ? [] : ['không --write mà run-log đổi'];
})) ok('GM-6-khong-ghi', 'không --write: in dòng, run-log không đổi byte');
if (want('GM-6-do')) await chayDo('GM-6-do', gm6, [['scripts/do-vong.mjs', 'if (x.t < tu || x.t > den || thay.has(x.ma)) continue;', 'if (x.t < tu || x.t > den) continue;']], 'token ra 2×, cần 1×', 'bản sao đếm lời nhắn lặp hai lần');
if (want('GM-6-do2')) await chayDo('GM-6-do2', gm6, [['scripts/do-vong.mjs', 'const cham = phienDoc.filter(p => p.ban.some(b => b.cham));', 'const cham = phienDoc;']], 'bản ghi lạ vào phép đo', 'bản sao đếm phiên không chạm hồ sơ');
if (want('GM-6-do3')) await chayDo('GM-6-do3', gm6SongSong, [['scripts/do-vong.mjs', 'const gioMay = gioHoatDong(ev);', 'const gioMay = ban.reduce((a, b) => a + gioHoatDong(b.ev.filter(t => t >= tuMs && t <= denMs)), 0);']], 'giờ máy cộng trùng tác tử song song', 'bản sao cộng giờ từng bản ghi');
if (want('GM-6-do4')) await chayDo('GM-6-do4', gm6SongSong, [['scripts/do-vong.mjs', 'const tm = congToken(ban.flatMap(b => b.loi), tuMs, denMs);', 'const tm = congToken(ban.flatMap(b => b.loi), -Infinity, denMs);']], 'sự kiện ngoài cửa sổ vào phép đo', 'bản sao bỏ cắt cửa sổ');
// Vế bản ghi THẬT (round-trip với bên viết thật — Claude Code): chạy trên thư mục bản ghi của máy với hồ sơ của chính vòng này.
if (want('GM-6-that')) {
  try {
    const x = node([DV(KIT), '--root', KIT, '--slug', 'lo-trinh-gio-may'], { env: { ...process.env, HAN_MUC_TEP: path.join(TMP, 'khong-co.jsonl') } });
    const o = x.status === 0 ? JSON.parse(x.stdout) : null;
    if (!o || o.nguon === 'khong-co-ban-ghi') console.log('  SKIP: GM-6-that — không đọc được ở đây: không có bản ghi phiên của vòng');
    else {
      const sai = [];
      if (!o.nguon.some(n => n.split('/').length === 2)) sai.push('không có bản ghi phiên chính');
      if (!o.nguon.some(n => n.includes('/subagents/'))) sai.push('không có bản ghi tác tử con');
      if (!(o.gio_may > 0)) sai.push(`gio_may ${o.gio_may}`);
      const ra = Object.values(o.token || {}).reduce((a, t) => a + t.ra, 0); if (!(ra > 0)) sai.push('token ra 0');
      for (const [m, t] of Object.entries(o.token || {})) if (!(t.vao + t.ra + t.doc_dem + t.ghi_dem > 0)) sai.push(`model ${m} có lời nhắn mà token 0`);
      if (sai.length) bad('GM-6-that', sai.join(' ; ')); else ok('GM-6-that', `bản ghi thật: ${o.nguon.length} bản ghi, ${o.gio_may} giờ máy, ${ra} token ra`);
    }
  } catch (e) { bad('GM-6-that', loi(e)); }
}

const hanMucTep = (ds) => { const p = path.join(TMP, `han-muc-${++khoN}.jsonl`); writeFileSync(p, ds.map(o => JSON.stringify(o)).join('\n') + (ds.length ? '\n' : '')); return p; };
const DL = '2026-10-26T02:00:00.000Z';
const doc2 = (pt1, pt2, dl2 = DL) => [{ ts: '2026-10-20T00:30:00.000Z', phan_tram: pt1, dat_lai: DL }, { ts: '2026-10-20T02:05:00.000Z', phan_tram: pt2, dat_lai: dl2 }];
const gm7Chay = async (kit, ds) => { const r = khoVong('vong', BASE6); const { projects, den } = banGhi('vong', BASE6); const x = doVong(kit, r, 'vong', projects, den, { hanMuc: hanMucTep(ds) }); if (x.status !== 0) throw new Error(`do-vong thoát ${x.status}`); return JSON.parse(x.stdout); };
// Token quy đổi viết sẵn (giá $/1M: Opus 5.5 4/20/0,2/5 · Sonnet 5.5 2/10/0,2/2,5). Vòng: opus (10·4 + 300·20 + 1000·0,2 + 50·5) +
// sonnet (5·2 + 30·10) = 6800 → 0,0068. Cả máy giữa 00:30–02:05: vòng trừ m2 (02:08) = opus 2490 + sonnet 310, cộng phiên khác
// 999·20 = 19980 → 22780 → 0,02278. % = 10 × 0,0068 / 0,02278 = 2,985… → 2,99.
if (want('GM-7')) { if (await chayCa('GM-7', async kit => {
  const o = await gm7Chay(kit, doc2(20, 30)); const sai = [];
  if (o.phan_tram_tuan !== 2.99) sai.push(`phan_tram_tuan ${o.phan_tram_tuan}, cần 2.99`);
  if (!(typeof o.ty_le === 'number')) sai.push('thiếu ty_le');
  if (!deq(o.khoang_doc, { tu: '2026-10-20T00:30:00.000Z', den: '2026-10-20T02:05:00.000Z', phan_tram: [20, 30] })) sai.push(`khoang_doc ${JSON.stringify(o.khoang_doc)}`);
  return sai;
})) ok('GM-7', 'hai lần đọc 20 % → 30 %: phan_tram_tuan 2,99 kèm ty_le và khoảng đọc'); }
const LYDO = {
  khac: 'hai lần đọc hạn mức khác mốc đặt lại (đổi tài khoản hoặc sang tuần mới) — % không quy đổi được',
  giam: 'phần trăm hạn mức giảm giữa hai lần đọc (đổi tài khoản) — % không quy đổi được',
  mot: 'chưa đủ hai lần đọc hạn mức tuần — % không quy đổi được',
};
const gm7Loai = async kit => {
  const sai = [];
  for (const [ten, ds, ly] of [['khác mốc đặt lại', doc2(20, 30, '2026-11-02T02:00:00.000Z'), LYDO.khac], ['% giảm', doc2(30, 20), LYDO.giam], ['một lần đọc', doc2(20, 30).slice(0, 1), LYDO.mot]]) {
    const o = await gm7Chay(kit, ds);
    if (o.phan_tram_tuan !== null) sai.push(ten === 'khác mốc đặt lại' ? 'tỉ lệ qua hai tài khoản' : `${ten}: phan_tram_tuan ${o.phan_tram_tuan}`);
    else if (o.ly_do !== ly) sai.push(`${ten}: ly_do «${o.ly_do}»`);
  }
  return sai;
};
if (want('GM-7-loai') && await chayCa('GM-7-loai', gm7Loai)) ok('GM-7-loai', 'ba ca loại: phan_tram_tuan null, ly_do đúng ba câu viết sẵn');
if (want('GM-7-doc') && await chayCa('GM-7-doc', async kit => {
  const sai = []; const p = path.join(TMP, `doc-${++khoN}.jsonl`); const env = { ...process.env, HAN_MUC_TEP: p };
  const x = node([DV(kit), '--doc-han-muc', '23', '--dat-lai', '2026-10-26T02:00:00Z'], { env });
  const ds = existsSync(p) ? readFileSync(p, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
  if (x.status !== 0 || ds.length !== 1 || ds[0].phan_tram !== 23 || ds[0].dat_lai !== '2026-10-26T02:00:00.000Z') sai.push(`ghi lần đọc: thoát ${x.status}, ${JSON.stringify(ds)}`);
  for (const [v, dl, ghim] of [['-5', '2026-10-26T02:00:00Z', '--doc-han-muc phải là phần trăm 0..100'], ['120', '2026-10-26T02:00:00Z', '--doc-han-muc phải là phần trăm 0..100'], ['23', 'abc', '--dat-lai phải là thời điểm ISO']]) {
    const y = node([DV(kit), '--doc-han-muc', v, '--dat-lai', dl], { env });
    if (y.status !== 2 || !y.stderr.includes(ghim)) sai.push(`${v} ${dl}: thoát ${y.status}, «${y.stderr.trim()}»`);
  }
  const sau = readFileSync(p, 'utf8').split('\n').filter(Boolean).length; if (sau !== 1) sai.push(`giá trị sai vẫn ghi: ${sau} dòng`);
  return sai;
})) ok('GM-7-doc', '--doc-han-muc 23 thêm đúng một dòng; -5, 120, ISO hỏng → thoát 2 nêu cờ, không ghi');
if (want('GM-7-do')) await chayDo('GM-7-do', gm7Loai, [['scripts/do-vong.mjs', '  if (a.dat_lai !== b.dat_lai) return { ly_do: LY_DO.khacMoc, khoang };\n', '']], 'tỉ lệ qua hai tài khoản', 'bản sao nhận cặp khác mốc đặt lại');

// ═══ GM-8 (AC-8): đo lệch ═══════════════════════════════════════════════════════════════════════════════════════════
const MM = { ten: 'Mốc M', ngay: '2026-10-21', loai: 'phat-hanh', hang: ['A', 'B', 'C'] };
const MN = { ten: 'Mốc N', ngay: '2026-10-30', hang: ['E'] };
const gm8Data = { schema: 1, ten: 'K', moc: [MM, MN], hang: [H('A', { hang: 'T2', slug: 'a' }), H('B', { hang: 'T2', slug: 'b' }), H('C', { hang: 'T2', slug: 'c' }), H('E', { hang: 'T2' })] };
const gm8HoSo = async ({ dongBang = true, thieuDo = false } = {}) => {
  const ten = await tenNgan(KIT, MM);
  const db = (ngay, hoanTat, gio, hang) => ({ ngay_tinh: ngay, hang: { ma: 'x', gio_may: gio, phan_tram: null }, moc: { ten, bat_dau: ngay, hoan_tat: hoanTat, gio_may: [10, 20], gio_cho: 0, gio_cho_do: false, muc_tieu: '2026-10-21', hang } });
  return {
    a: { hinh: 'da-ship', ky: '2026-10-18', gm: { gio_may: 5, gio_cho: 2, phan_tram_tuan: 3 }, ...(dongBang ? { duBao: db('2026-10-15', '2026-10-19', [4, 7], ['A', 'B']) } : {}) },
    b: { hinh: 'da-ship', ky: '2026-10-19', ...(thieuDo ? {} : { gm: { gio_may: 6, gio_cho: 1 } }), ...(dongBang ? { duBao: db('2026-10-17', '2026-10-20', [5, 6], ['A', 'B', 'C']) } : {}) },
    c: { hinh: 'da-ship', ky: '2026-10-20', gm: thieuDo ? { nguon: 'khong-co-ban-ghi', gio_may: null, gio_cho: null } : { gio_may: 4, gio_cho: 0.5, phan_tram_tuan: 2 } },
  };
};
const gm8 = async kit => {
  const r = kho({ data: gm8Data, hoSo: await gm8HoSo() }); const x = chay(kit, r, D, ['--do-lech']); const t = await tenNgan(KIT, MM);
  if (x.status !== 0) return [`--do-lech thoát ${x.status}: ${x.stderr}`];
  const muon = [`${t}: dự báo 19/10 (đóng băng 15/10) · khép thật 20/10 · lệch 1 ngày · 1 hàng thêm sau đóng băng`, '  giờ chờ: ước 0 (đo được lúc đóng băng: không) · đo 3,5',
    '  A: ước 4–7 giờ máy · đo 5 giờ máy · ~3 % hạn mức tuần', '  B: ước 5–6 giờ máy · đo 6 giờ máy · % hạn mức tuần chưa đo', '  C: ước 4–7 giờ máy · đo 4 giờ máy · ~2 % hạn mức tuần', '  3/3 vòng có số đo'];
  const ra = x.stdout.split('\n').filter(Boolean); const sai = [];
  if (ra[0] && ra[0].includes('đóng băng 17/10')) sai.push('dự báo không phải bản đóng băng');
  if (!deq(ra, muon)) sai.push(`đầu ra ${JSON.stringify(ra)} ≠ ${JSON.stringify(muon)}`);
  if (git(r, 'status', '--porcelain')) sai.push('--do-lech ghi tệp');
  return sai;
};
if (want('GM-8')) { if (await chayCa('GM-8', gm8)) ok('GM-8', 'khối đo lệch đúng từng chữ: dự báo đóng băng sớm nhất, lệch 1 ngày, 1 hàng thêm, giờ chờ, ba hàng ước-so-đo'); }
const gm8ThieuDo = async kit => {
  const r = kho({ data: gm8Data, hoSo: await gm8HoSo({ thieuDo: true }) }); const ra = chay(kit, r, D, ['--do-lech']).stdout.split('\n').filter(Boolean);
  const can = ['  B: thiếu số đo', '  C: thiếu số đo', '  1/3 vòng có số đo']; const thieu = can.filter(c => !ra.includes(c));
  return thieu.length ? [ra.includes('  B: thiếu số đo') ? `thiếu ${JSON.stringify(thieu)}` : 'vòng thiếu số đo bị giấu'] : [];
};
if (want('GM-8-thieu-do') && await chayCa('GM-8-thieu-do', gm8ThieuDo)) ok('GM-8-thieu-do', 'hàng không dòng đo và hàng không có bản ghi: «thiếu số đo» + «1/3 vòng có số đo»');
if (want('GM-8-chua-dong-bang') && await chayCa('GM-8-chua-dong-bang', async kit => {
  const r = kho({ data: gm8Data, hoSo: await gm8HoSo({ dongBang: false }) }); const ra = chay(kit, r, D, ['--do-lech']).stdout.split('\n').filter(Boolean);
  const muon = `${await tenNgan(KIT, MM)}: chưa đóng băng dự báo — không đo được lệch`; return deq(ra, [muon]) ? [] : [`đầu ra ${JSON.stringify(ra)}`];
})) ok('GM-8-chua-dong-bang', 'mốc khép không du-bao.json: «chưa đóng băng dự báo — không đo được lệch»');
if (want('GM-8-do')) await chayDo('GM-8-do', gm8, [['scripts/lo-trinh.mjs', '.sort((a, b) => a.ngay_tinh.localeCompare(b.ngay_tinh) || a.slug.localeCompare(b.slug));', '.sort((a, b) => b.ngay_tinh.localeCompare(a.ngay_tinh) || a.slug.localeCompare(b.slug));']], 'dự báo không phải bản đóng băng', 'bản sao lấy dự báo mới nhất');
if (want('GM-8-do2')) await chayDo('GM-8-do2', gm8ThieuDo, [['scripts/lo-trinh.mjs', "if (!v || typeof v.gio_may !== 'number') { ra.push(`  ${d._nhan}: thiếu số đo`); continue; }", "if (!v || typeof v.gio_may !== 'number') continue;"]], 'vòng thiếu số đo bị giấu', 'bản sao bỏ hàng thiếu đo');

// ═══ GM-9 (AC-9): khối S4-DO-VONG của SKILL + tài liệu ═════════════════════════════════════════════════════════════
const gm9 = async kit => {
  const sai = []; const skill = readFileSync(path.join(kit, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8');
  const khoi = [...skill.matchAll(/<!-- <<<S4-DO-VONG -->([\s\S]*?)<!-- S4-DO-VONG>>> -->/g)];
  if (khoi.length !== 1) return [`SKILL có ${khoi.length} khối S4-DO-VONG, cần 1`];
  const lenh = khoi[0][1].split('\n').map(s => s.trim()).filter(s => s.startsWith('node '));
  if (lenh.length !== 3) sai.push(`khối có ${lenh.length} dòng lệnh, cần 3`);
  if (lenh.filter(l => l.includes('--doc-han-muc')).length !== 2) sai.push('khối không có hai dòng đọc hạn mức');
  const ghi = lenh.find(l => l.includes('do-vong.mjs') && !l.includes('--doc-han-muc'));
  if (!ghi) return [...sai, 'khối không có dòng do-vong'];
  // Chạy chính dòng rút từ khối (thay $AG và <slug>) trên kho thử có bản ghi lệch về quá khứ gần (để «bây giờ» nằm sau cửa sổ).
  const base = Date.now() - 3 * 3600e3; const r = khoVong('vong', base); const { projects } = banGhi('vong', base);
  const cmd = ghi.replace(/\$AG|"\$AG"/g, kit).replace(/"([^"]*)"/g, '$1').replace(/<slug>/g, 'vong').replace(/\s+#.*$/, '');
  spawnSync('bash', ['-c', cmd], { cwd: r, encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECTS_DIR: projects, HAN_MUC_TEP: path.join(TMP, 'khong.jsonl') } });
  const dong = readFileSync(path.join(r, '_acceptance', 'vong', 'run-log.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)).filter(o => o.kind === 'gio-may');
  if (dong.length !== 1) sai.push('khối S4-DO-VONG không ghi dòng gio-may');
  else if (dong[0].gio_may !== 0.55 || !deq(dong[0].token, TOKEN6)) sai.push(`dòng gio-may từ khối: ${JSON.stringify(dong[0]).slice(0, 200)}`);
  const xem = readFileSync(path.join(kit, 'road-map', 'commands', 'xem.md'), 'utf8');
  if (!xem.includes('Giờ máy theo mốc') || !xem.includes('quá tải')) sai.push('xem.md không nêu khối giờ máy và cờ quá tải');
  const guide = readFileSync(path.join(KIT, 'GUIDE.md'), 'utf8');
  if (!guide.includes('`gio_may`') || !guide.includes('hàng thiếu khoá: máy tự ước')) sai.push('GUIDE không nêu khoá gio_may và đường đọc-cũ');
  return sai;
};
if (want('GM-9')) { if (await chayCa('GM-9', gm9)) ok('GM-9', 'khối S4-DO-VONG ba dòng; dòng rút từ khối ghi đúng dòng gio-may; xem.md và GUIDE nêu khoá'); }
if (want('GM-9-do')) await chayDo('GM-9-do', gm9, [['feature-loop/skills/feature-loop/SKILL.md', 'do-vong.mjs" --root . --slug <slug> --write', 'do-vong.mjs" --root . --slug <slug>']], 'khối S4-DO-VONG không ghi dòng gio-may', 'bản sao khối thiếu --write');

try { rmSync(TMP, { recursive: true, force: true }); } catch { /* bỏ */ }
console.log(`\nResults: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
