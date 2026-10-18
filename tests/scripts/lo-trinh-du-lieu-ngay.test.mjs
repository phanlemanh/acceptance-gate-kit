// lo-trinh-du-lieu-ngay.test.mjs — hồ sơ lo-trinh-du-lieu-ngay-du-kien (hàng RM6c), ca ND-<n> = AC-n của hợp đồng. Mỗi eval của
// evals.yaml ghim đúng dòng «PASS: ND-…» của tệp này.
//
// Kho thử do CODE sinh trong lượt (git init thư mục tạm, commit ghim ngày; «hôm nay» ghim bằng ACCEPTANCE_TODAY; hồ sơ dựng
// bằng tests/scripts/lo-trinh-kho-thu.mjs). Giá trị mong đợi viết sẵn trong ca — trừ phép so «khối == trang», nơi chữ trang
// rút từ HTML của CÙNG lần vẽ là chính thứ được so. Hai vai «gốc» tách nhau:
//   BỘ ĐỌC GỐC — hàm docDuLieu rút từ `git archive <gốc so> scripts` (gốc so: _acceptance/<slug>/goc-so), băm ghim = bản
//   chép của crm; hàm không đổi theo lịch sử nên vai này không trôi.
//   BỘ MÁY NỀN — `git archive <merge-base HEAD với origin/main|main> scripts lib skills commands road-map` (trọn thư mục);
//   merge-base trùng HEAD (vòng đã gộp) thì nền là chính cây đang kiểm, và dòng PASS nói ra.
// Ca đỏ chạy CHÍNH hàm đo trên BẢN SAO của vật (nhát tiêm khớp đúng một lần), SAU khi bản lành xanh trên cùng dữ liệu, và
// ghim thông điệp. Mọi đường dẫn suy từ vị trí tệp này. Không ca nào ghi vào cây kit.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const SLUG = 'lo-trinh-du-lieu-ngay-du-kien';
const GOC = readFileSync(path.join(KIT, '_acceptance', SLUG, 'goc-so'), 'utf8').trim();
const BAM_DOC_GOC = '081c13c3e674ad5cf2f8e37d7f3e88cd14a8a465ff0ddcc2431ee812946a3321';
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'nd-')));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.ND_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-') || id.startsWith(o + ' '));
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 4).join(' | ');
const git = (d, ...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const deq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const KT = await import(pathToFileURL(path.join(HERE, 'lo-trinh-kho-thu.mjs')).href);

const TEP = 'docs/lo-trinh.json';
const D = '2026-10-20';
const dongGM = o => JSON.stringify({ ts: '2026-10-20T00:00:00Z', kind: 'gio-may', ...o }) + '\n';
function ghiHoSo(r, hoSo) {
  for (const [slug, s] of Object.entries(hoSo)) {
    const d = path.join(r, '_acceptance', slug); mkdirSync(d, { recursive: true });
    for (const [f, t] of Object.entries(KT.HO_SO[s.hinh](slug, s.tier || 'T2'))) writeFileSync(path.join(d, f), t);
    if (s.gm) writeFileSync(path.join(d, 'run-log.jsonl'), dongGM(s.gm));
    if (s.duBao) writeFileSync(path.join(d, 'du-bao.json'), JSON.stringify(s.duBao, null, 2) + '\n');
  }
}
let khoN = 0;
function kho({ data, hoSo = {} }) {
  const r = path.join(TMP, `kho-${++khoN}`); mkdirSync(r, { recursive: true });
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

// ── Bộ máy: bản sao có nhát tiêm, bộ máy gốc (chỉ để rút bộ đọc + vẽ trang đời trước), bộ máy nền (merge-base) ──────────
let bsN = 0;
function banSao(tiem = []) {
  const c = path.join(TMP, `bs-${++bsN}`);
  for (const d of ['scripts', 'lib', 'skills', 'commands', 'feature-loop', 'road-map', '.claude-plugin']) if (existsSync(path.join(KIT, d))) cpSync(path.join(KIT, d), path.join(c, d), { recursive: true });
  for (const f of ['GUIDE.md']) if (existsSync(path.join(KIT, f))) cpSync(path.join(KIT, f), path.join(c, f));
  for (const [tep, cu, moi] of tiem) {
    const p = path.join(c, tep); const s = readFileSync(p, 'utf8'); const n = s.split(cu).length - 1;
    if (n !== 1) throw new Error(`nhát tiêm vào ${tep} khớp ${n} lần (cần 1): ${cu.slice(0, 70)}`);
    writeFileSync(p, s.replace(cu, moi));
  }
  return c;
}
const bung = (sha, ten) => {
  const d = path.join(TMP, ten); mkdirSync(d, { recursive: true });
  const tar = execFileSync('git', ['-C', KIT, 'archive', '--format=tar', sha, 'scripts', 'lib', 'skills', 'commands', 'road-map'], { maxBuffer: 1 << 28 });
  execFileSync('tar', ['-x', '-C', d], { input: tar });
  if (!existsSync(path.join(d, 'scripts', 'lo-trinh.mjs'))) throw new Error(`bộ máy ${sha} không bung được scripts/lo-trinh.mjs`);
  return d;
};
let gocDir = null; const banGoc = () => (gocDir ||= bung(GOC, 'goc-so'));
let nenCache = null;
function banNen() {
  if (nenCache) return nenCache;
  const chinh = ['origin/main', 'main'].find(r => spawnSync('git', ['-C', KIT, 'rev-parse', '--verify', '--quiet', r]).status === 0);
  if (!chinh) throw new Error('nền so: không tìm được nhánh chính (origin/main | main) để tính merge-base');
  const mb = git(KIT, 'merge-base', 'HEAD', chinh); const head = git(KIT, 'rev-parse', 'HEAD');
  // road-map-de-dung (RD1): bên so là cây TẮT RD1 (KIT_TAT), nên nền chứa RD1 (vòng đã gộp, hay mọi nhánh cắt sau RD1) cũng đi
  // qua CÙNG phép tắt — so cùng trạng thái. Nền trước RD1 không có khối để tắt thì giữ nguyên. Nhận biết bằng khối RD1 có trong nền.
  const goc = mb === head ? KIT : bung(mb, 'nen');
  const coRD1 = readFileSync(path.join(goc, 'scripts', 'lo-trinh.mjs'), 'utf8').includes('export function luatChiPhatTrien(');
  nenCache = { dir: coRD1 ? tatRD1(goc) : goc, goc, sha: mb, trungHead: mb === head, tatRD1: coRD1 };
  return nenCache;
}
const ghiChuNen = () => { const n = banNen(); return (n.trungHead ? `nền so trùng HEAD ${n.sha.slice(0, 8)} — vòng đã gộp` : `nền so merge-base ${n.sha.slice(0, 8)}`) + (n.tatRD1 ? ' · nền tắt RD1 như bên so' : ''); };

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
const tenNgan = async m => (await nap(KIT)).LT.tenNganMoc(m);

// ── Đọc trang và khối ───────────────────────────────────────────────────────────────────────────────────────────────
const KHOI_RE = /<script type="application\/json" id="lo-trinh-du-lieu">([\s\S]*?)<\/script>/;
const khoi = html => { const m = String(html).match(KHOI_RE); return m ? JSON.parse(m[1]) : null; };
const khoiTho = html => (String(html).match(KHOI_RE) || [])[1] ?? null;
const ngoaiKhoi = html => String(html).replace(KHOI_RE, '');
const datKhoi = (html, o) => String(html).replace(KHOI_RE, () => `<script type="application/json" id="lo-trinh-du-lieu">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`);
const giaiMa = s => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const escAttr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Ô giờ máy trang in cho việc mã `ma` (lộ trình thứ i): chữ của <span class="gm"> trong hàng bảng, hoặc null.
const gmTrang = (html, ma, i = 1) => {
  const tr = String(html).match(new RegExp(`<tr id="lt${i}-h-${escRe(String(ma).replace(/[^A-Za-z0-9_-]/g, '_'))}">([\\s\\S]*?)</tr>`));
  if (!tr) return undefined;
  const s = tr[1].match(/<span class="gm">([^<]*)<\/span>/); return s ? giaiMa(s[1]) : null;
};
// Dòng mốc trang in: phần «· <giờ máy> · <dự báo>» và cờ quá tải.
const mocTrang = (html, ten) => {
  const li = String(html).match(new RegExp(`<li data-ngay="[^"]*" data-ten="${escRe(escAttr(ten))}"[^>]*>([\\s\\S]*?)</li>`));
  if (!li) return undefined;
  const nho = [...li[1].matchAll(/<span class="mu nho">· ([^<]*)<\/span>/g)].map(m => giaiMa(m[1])).find(t => t.startsWith('~') || t.startsWith('dự báo lúc bắt đầu')) || null;
  const dk = nho && nho.includes('dự báo lúc bắt đầu') ? `dự báo lúc bắt đầu${nho.split('dự báo lúc bắt đầu')[1]}` : null;
  const gio = nho && !nho.startsWith('dự báo lúc bắt đầu') ? nho.split(' · dự báo lúc bắt đầu')[0] : null;
  const qt = (li[1].match(/<span class="co-o">(mốc quá tải[^<]*)<\/span>/) || [])[1];
  return { gio, dk, quaTai: qt ? giaiMa(qt) : null };
};
// MA TRẬN TOÀN PHẦN «khối == trang»: mỗi hàng (chu, co) và mỗi mốc (giờ máy, dự kiến, quá tải) — null khi và chỉ khi trang
// không in. Trả { sai, so } — `so` là số ô đã so, ca đặt cạnh tổng viết sẵn.
function maTran(html) {
  const k = khoi(html); const sai = []; let so = 0;
  if (!k) return { sai: ['trang không có khối dữ liệu'], so };
  k.lo_trinh.forEach((t, li) => {
    for (const h of t.hang || []) {
      const tr = gmTrang(html, h.ma, li + 1); if (tr === undefined) { sai.push(`trang không có hàng ${h.ma}`); continue; }
      const g = h.gio_may ?? null;
      so += 1; if ((g ? g.chu : null) !== tr) sai.push(`chữ giờ máy của khối lệch trang: ${h.ma} (khối «${g ? g.chu : null}», trang «${tr}»)`);
      const nhan = tr ? (tr.split(' · ')[0].match(/\((máy ước[^)]*)\)$/) || [])[1] || null : null;
      so += 1;
      if ((g ? g.co : null) !== nhan) sai.push(nhan && !(g && g.co) ? `cờ số đo chưa đủ vắng: ${h.ma}` : `cờ của khối lệch trang: ${h.ma} (khối «${g ? g.co : null}», trang «${nhan}»)`);
    }
    for (const m of t.moc || []) {
      const tr = mocTrang(html, m.ten); if (tr === undefined) { sai.push(`trang không có mốc ${m.ten}`); continue; }
      so += 1; if ((m.gio_may ? m.gio_may.chu : null) !== tr.gio) sai.push(`giờ máy mốc lệch trang: ${m.ten} (khối «${m.gio_may ? m.gio_may.chu : null}», trang «${tr.gio}»)`);
      so += 1; if ((m.du_kien ? m.du_kien.chu : null) !== tr.dk) sai.push(`ngày dự kiến khối lệch trang: ${m.ten} (khối «${m.du_kien ? m.du_kien.chu : null}», trang «${tr.dk}»)`);
      so += 1; if ((m.qua_tai ?? null) !== tr.quaTai) sai.push(`cờ quá tải khối lệch trang: ${m.ten}`);
    }
  });
  return { sai, so };
}
const kiemMaTran = (html, soMuon) => { const { sai, so } = maTran(html); return so === soMuon ? sai : [...sai, `ma trận so ${so} ô, cần ${soMuon}`]; };

const chayCa = async (id, f, kit = KIT) => { try { const s = await f(kit); if (s.length) bad(id, s.join(' ; ')); else return true; } catch (e) { bad(id, loi(e)); } return false; };
const chayDo = async (id, f, tiem, ghim, moTa) => {
  try {
    const lanh = await f(KIT); if (lanh.length) { bad(id, `bản lành chưa xanh — không tin được chiều đỏ: ${lanh[0]}`); return; }
    const s = await f(banSao(tiem)); const g = s.find(m => m.includes(ghim));
    if (g) ok(id, `${moTa}: hàm đo trả «${g.slice(0, 120)}»`); else bad(id, `không bắt (cần «${ghim}»): ${JSON.stringify(s).slice(0, 300)}`);
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
const LT_MJS = 'scripts/lo-trinh.mjs';

// ═══ ND-1 (AC-1): giờ máy từng hàng ═══════════════════════════════════════════════════════════════════════════════════
const nd1Data = { schema: 1, ten: 'Kế hoạch thử', moc: [], hang: [
  H('A', { hang: 'T2', gio_may: 6 }), H('B', { hang: 'T2', gio_may: [3, 5] }), H('C', { hang: 'T2', gio_may: 'nhiều' }), H('E', { hang: 'T3' }), H('F')] };
let nd1Kho = null; const khoNd1 = () => (nd1Kho ||= kho({ data: nd1Data }));
const nd1 = async kit => {
  const html = await ve(kit, khoNd1()); const k = khoi(html); const sai = [];
  if (!k) return ['trang không có khối dữ liệu'];
  const hang = Object.fromEntries(k.lo_trinh[0].hang.map(h => [h.ma, h.gio_may]));
  const muon = { A: [6, 6, 'khai', null], B: [3, 5, 'khai', null], C: [4, 7, 'luat', 'máy ước'], E: [7, 10, 'luat', 'máy ước'], F: [4, 7, 'luat', 'máy ước, chưa khai hạng'] };
  for (const [ma, [thap, cao, nguon, co]] of Object.entries(muon)) {
    const g = hang[ma]; if (!g) { sai.push(`hàng ${ma}: gio_may vắng`); continue; }
    if (!deq([g.thap, g.cao, g.nguon], [thap, cao, nguon])) sai.push(`hàng ${ma}: [thap,cao,nguon] ${JSON.stringify([g.thap, g.cao, g.nguon])} ≠ ${JSON.stringify([thap, cao, nguon])}`);
    if (g.co !== co) sai.push(co && !g.co ? `cờ số đo chưa đủ vắng: ${ma}` : `hàng ${ma}: co «${g.co}» ≠ «${co}»`);
    if (g.phan_tram_tuan !== null || g.phan_tram_chu !== 'chưa ước (0/5 vòng đo)') sai.push(`hàng ${ma}: phần trăm ${JSON.stringify([g.phan_tram_tuan, g.phan_tram_chu])}`);
  }
  return [...kiemMaTran(html, 10), ...sai];
};
if (want('ND-1')) { if (await chayCa('ND-1', nd1)) ok('ND-1', 'năm hàng: chu == ô giờ máy trang in, [thap,cao,nguon] và cờ đúng dãy viết sẵn; ma trận 10/10 ô'); }
const nd1KhongPhanTich = async kit => {
  const M = await nap(kit); const r = khoNd1();
  const t = M.LT.phanTich({ root: r, classify: M.PM.classify, sections: M.PM.SECTIONS });
  if (!t || !t.kq || !t.kq._gm) return ['đối chứng: phân tích kho không gắn lớp giờ máy'];
  delete t.kq._gm;
  let html; try { html = M.LT.renderTrang(t.kq, t.tep); } catch (e) { return [`renderTrang ném: ${e.message}`]; }
  const k = khoi(html); if (!k) return ['trang không có khối'];
  const conGio = k.lo_trinh[0].hang.filter(h => h.gio_may !== null).map(h => h.ma);
  return conGio.length ? [`hàng vẫn mang gio_may khi không qua phân tích kho: ${conGio.join(', ')}`] : (k.lo_trinh[0].hang.length === 5 ? [] : ['đối chứng: không đủ năm hàng']);
};
if (want('ND-1-khong-phan-tich')) { if (await chayCa('ND-1-khong-phan-tich', nd1KhongPhanTich)) ok('ND-1-khong-phan-tich', 'lối vẽ không lớp giờ máy: mọi gio_may null, không ném'); }
const nd1TrangGiu = async kit => {
  const nen = banNen().dir; const r = khoNd1();
  const a = await ve(nen, r); const b = await ve(nen, r);
  if (a !== b) return ['đối chứng dương: bộ máy nền vẽ hai lần khác nhau'];
  const moi = await ve(kit, r);
  return ngoaiKhoi(moi) === ngoaiKhoi(a) ? [] : ['phần trang ngoài khối dữ liệu lệch bộ máy nền'];
};
if (want('ND-1-trang-giu')) { if (await chayCa('ND-1-trang-giu', nd1TrangGiu, KIT_TAT())) ok('ND-1-trang-giu', `phần trang ngoài khối giống từng byte bộ máy nền (${ghiChuNen()})`); }
// Chiều đỏ của bước tắt RD1 trên nền (sửa 18/10 khi chính RD1 vào main làm nền chứa RD1): bỏ bước tắt — so cây tắt với nền
// NGUYÊN — thì ca trang phải ĐỎ đúng thông điệp. Nền trước RD1 không có gì để tắt: ca nói ra và không đếm là đạt.
if (want('ND-1-nen-tat-do')) {
  const n = banNen();
  if (!n.tatRD1) console.log(`  BỎ QUA: ND-1-nen-tat-do — nền ${n.sha.slice(0, 8)} trước RD1, không có bước tắt để phá`);
  else {
    const lanh = await nd1TrangGiu(KIT_TAT());
    if (lanh.length) bad('ND-1-nen-tat-do', `bản lành chưa xanh — không tin được chiều đỏ: ${lanh[0]}`);
    else {
      const giu = n.dir; n.dir = n.goc; let s; try { s = await nd1TrangGiu(KIT_TAT()); } finally { n.dir = giu; }
      if (s.includes('phần trang ngoài khối dữ liệu lệch bộ máy nền')) ok('ND-1-nen-tat-do', `bỏ bước tắt RD1 trên nền ${n.sha.slice(0, 8)}: hàm đo trả «${s[0]}»`);
      else bad('ND-1-nen-tat-do', `không bắt (cần «phần trang ngoài khối dữ liệu lệch bộ máy nền»): ${JSON.stringify(s)}`);
    }
  }
}
if (want('ND-1-do')) await chayDo('ND-1-do', nd1, [[LT_MJS, 'chu: gioMayChu(u), co:', 'chu: `${GM.khoangVN(u.khoang)} giờ máy`, co:']], 'chữ giờ máy của khối lệch trang: C', 'bản sao bỏ nhãn nguồn khỏi chữ của khối');

// ═══ ND-2 (AC-2): nguồn số đo và cờ số đo chưa đủ ════════════════════════════════════════════════════════════════════
const sauVong = pts => Object.fromEntries([3, 4, 5, 6, 8, 2].map((g, i) => [`s${i + 1}`, { hinh: 'da-ship', tier: 'T2', gm: { gio_may: g, gio_cho: 1, phan_tram_tuan: pts[i] ?? null } }]));
const nd2Data = { schema: 1, ten: 'K', moc: [], hang: [H('G', { hang: 'T2' }), H('H', { hang: 'T3' }), H('K', { hang: 'T2', gio_may: 6 })] };
const nd2Kho = {}; const khoNd2 = pts => (nd2Kho[pts.join()] ||= kho({ data: nd2Data, hoSo: sauVong(pts) }));
const nd2 = async kit => {
  const html = await ve(kit, khoNd2([2, 3, 4, 5, 6])); const k = khoi(html); if (!k) return ['trang không có khối'];
  const g = Object.fromEntries(k.lo_trinh[0].hang.map(h => [h.ma, h.gio_may])); const sai = [];
  const muon = {
    G: { nguon: 'do', co: null, chu: '3–6 giờ máy (theo 6 vòng đo) · ~4 % hạn mức tuần', phan_tram_tuan: 4 },
    H: { nguon: 'luat', co: 'máy ước', chu: '7–10 giờ máy (máy ước) · ~4 % hạn mức tuần' },
    K: { nguon: 'khai', co: null },
  };
  for (const [ma, m] of Object.entries(muon)) for (const [kh, v] of Object.entries(m)) {
    const thuc = g[ma] ? g[ma][kh] : undefined;
    if (thuc !== v) sai.push(kh === 'co' && v && !thuc ? `cờ số đo chưa đủ vắng: ${ma}` : `hàng ${ma}: ${kh} «${thuc}» ≠ «${v}»`);
  }
  return [...kiemMaTran(html, 6), ...sai];
};
if (want('ND-2')) { if (await chayCa('ND-2', nd2)) ok('ND-2', 'G theo 6 vòng đo không cờ · H máy ước có cờ · K khai không cờ; ma trận 6/6 ô'); }
const nd2Thieu = async kit => {
  const html = await ve(kit, khoNd2([2, 3, 4, 5])); const k = khoi(html); if (!k) return ['trang không có khối'];
  const g = k.lo_trinh[0].hang.find(h => h.ma === 'G').gio_may;
  return [...kiemMaTran(html, 6), ...(g.phan_tram_tuan === null && g.phan_tram_chu === 'chưa ước (4/5 vòng đo)' ? [] : [`G phần trăm ${JSON.stringify([g.phan_tram_tuan, g.phan_tram_chu])}`])];
};
if (want('ND-2-thieu-phan-tram')) { if (await chayCa('ND-2-thieu-phan-tram', nd2Thieu)) ok('ND-2-thieu-phan-tram', 'bốn vòng có %: G «chưa ước (4/5 vòng đo)», phan_tram_tuan null'); }
if (want('ND-2-do')) await chayDo('ND-2-do', nd2, [[LT_MJS, "co: u.nguon === 'luat' ? u.nhan || null : null,", 'co: null,']], 'cờ số đo chưa đủ vắng: H', 'bản sao luôn ghi cờ rỗng');

// ═══ ND-3 (AC-3): giờ máy từng mốc ═══════════════════════════════════════════════════════════════════════════════════
const nd3Data = { schema: 1, ten: 'K',
  moc: [{ ten: 'M', ngay: '2026-10-22', loai: 'phat-hanh', hang: ['P', 'Q', 'R'] }, { ten: 'N', ngay: '2026-10-25', hang: ['S'] }],
  hang: [H('P', { hang: 'T2', gio_may: 5 }), H('Q', { hang: 'T3' }), H('R', { hang: 'T2', slug: 'r' }), H('S', { hang: 'T2', slug: 's' })] };
let nd3Kho = null;
const nd3 = async kit => {
  const html = await ve(kit, nd3Kho ||= kho({ data: nd3Data, hoSo: { r: { hinh: 'da-ship' }, s: { hinh: 'da-ship' } } }));
  const k = khoi(html); if (!k) return ['trang không có khối'];
  const moc = Object.fromEntries(k.lo_trinh[0].moc.map(m => [m.ten, m])); const sai = [];
  const gm = moc.M && moc.M.gio_may;
  if (!gm || !deq([gm.thap, gm.cao, gm.chu], [15.5, 20, '~15,5–20 giờ máy'])) sai.push(`mốc M gio_may ${JSON.stringify(gm)}, cần [15.5, 20, «~15,5–20 giờ máy»]`);
  if (!moc.N || moc.N.gio_may !== null) sai.push(`mốc N hết việc mở mà gio_may ${JSON.stringify(moc.N && moc.N.gio_may)}`);
  return [...kiemMaTran(html, 14), ...sai];
};
if (want('ND-3')) { if (await chayCa('ND-3', nd3)) ok('ND-3', 'mốc M «~15,5–20 giờ máy» == dòng mốc trang in; mốc N hết việc → null; ma trận 14/14 ô'); }
if (want('ND-3-do')) await chayDo('ND-3-do', nd3, [[LT_MJS, 'chu: x.gio.chu, phan_tram_tuan', "chu: `~${GM.khoangVN(GM.tongMoc(m, ganMoc(m).map(ma => kq.dong.find(d => String(d._nhan) === ma)).filter(Boolean), kq._gm.uoc).khoang)} giờ máy`, phan_tram_tuan"]], 'giờ máy mốc lệch trang: M', 'bản sao cộng cả hàng đã giao vào tổng của khối');

// ═══ ND-4 (AC-4): ngày dự kiến và cờ quá tải từng mốc ════════════════════════════════════════════════════════════════
const MOC4 = [
  { ten: 'M', ngay: '2026-10-22', hang: ['A'] }, { ten: 'P', ngay: '2026-10-30', hang: ['B'] },
  { ten: 'Q', ngay: '2026-11-05', hang: ['C'] }, { ten: 'R', ngay: '2026-11-10', hang: ['D', 'E'] }];
const nd4Data = { schema: 1, ten: 'K', moc: MOC4, hang: ['A', 'B', 'C', 'D', 'E'].map(ma => H(ma, { hang: 'T2', slug: ma.toLowerCase() })) };
const db4 = async (ma, mocI, ngayTinh, hoanTat) => ({ ngay_tinh: ngayTinh, hang: { ma, gio_may: [4, 7], phan_tram: null },
  moc: { ten: await tenNgan(MOC4[mocI]), bat_dau: ngayTinh, hoan_tat: hoanTat, gio_may: [5, 8.5], gio_cho: 0, gio_cho_do: false, muc_tieu: MOC4[mocI].ngay, hang: MOC4[mocI].hang } });
let nd4KhoR = null;
const khoNd4 = async () => (nd4KhoR ||= kho({ data: nd4Data, hoSo: {
  a: { hinh: 'dang-dung', duBao: await db4('A', 0, '2026-10-18', '2026-10-23') },
  b: { hinh: 'dang-dung', duBao: await db4('B', 1, '2026-10-19', '2026-10-25') },
  c: { hinh: 'dang-dung' },
  d: { hinh: 'dang-dung' },
  e: { hinh: 'dang-dung', duBao: await db4('E', 3, '2026-10-19', '2026-11-02') },
} }));
const nd4 = async kit => {
  const html = await ve(kit, await khoNd4()); const k = khoi(html); if (!k) return ['trang không có khối'];
  const m = Object.fromEntries(k.lo_trinh[0].moc.map(x => [x.ten, x])); const sai = [];
  if (!deq(m.M && m.M.du_kien, { ngay_tinh: '2026-10-18', hoan_tat: '2026-10-23', chu: 'dự báo lúc bắt đầu (18/10): hoàn tất 23/10' })) sai.push(`mốc M du_kien ${JSON.stringify(m.M && m.M.du_kien)}`);
  if (!m.M || m.M.qua_tai !== 'mốc quá tải: dự kiến 23/10, mục tiêu 22/10') sai.push(`mốc M qua_tai «${m.M && m.M.qua_tai}»`);
  if (!m.P || !m.P.du_kien || m.P.du_kien.hoan_tat !== '2026-10-25' || m.P.qua_tai !== null) sai.push(`mốc P ${JSON.stringify(m.P && [m.P.du_kien, m.P.qua_tai])}`);
  if (!m.Q || m.Q.du_kien !== null) sai.push('ngày dự kiến bịa: Q'); if (m.Q && m.Q.qua_tai !== null) sai.push('mốc Q có cờ quá tải khi chưa đóng băng');
  if (!m.R || !m.R.du_kien || m.R.du_kien.hoan_tat !== '2026-11-02') sai.push(`mốc R (lai) du_kien ${JSON.stringify(m.R && m.R.du_kien)}`);
  return [...kiemMaTran(html, 22), ...sai];
};
if (want('ND-4')) { if (await chayCa('ND-4', nd4)) ok('ND-4', 'M dự kiến 23/10 + quá tải · P không quá tải · Q chưa đóng băng → null · R lai lấy dự báo có mặt; ma trận 22/22 ô'); }
if (want('ND-4-do')) await chayDo('ND-4-do', nd4, [[LT_MJS, 'du_kien: x.duKien || null,', "du_kien: x.duKien || (chuoi(m.ngay) ? { ngay_tinh: null, hoan_tat: chuoi(m.ngay), chu: 'x' } : null),"]], 'ngày dự kiến bịa: Q', 'bản sao điền ngày mục tiêu cho mốc chưa đóng băng');
if (want('ND-4-do lai')) await chayDo('ND-4-do lai', nd4, [[LT_MJS, 'du_kien: x.duKien || null,', 'du_kien: (() => { const h = ganMoc(m).map(ma => kq.dong.find(d => String(d._nhan) === ma)).find(d => d && d.hoSo); return h && kq._gm && kq._gm.duBao.some(b => b.slug === h.hoSo) ? x.duKien || null : null; })(),']], 'ngày dự kiến khối lệch trang: R', 'bản sao để khối đọc dự báo của hồ sơ mở sớm nhất');

// ═══ ND-5 (AC-5): tất định — khác hôm nay, khác múi giờ ══════════════════════════════════════════════════════════════
const veCli = (kit, r, today, tz) => {
  const x = spawnSync(process.execPath, [path.join(kit, 'scripts', 'product-map.mjs'), '--root', r], { encoding: 'utf8', env: { ...process.env, ACCEPTANCE_TODAY: today, TZ: tz } });
  if (x.status !== 0) throw new Error(`product-map thoát ${x.status}: ${(x.stderr || '').slice(0, 200)}`);
  return readFileSync(path.join(r, 'LO-TRINH.html'), 'utf8');
};
const nd5 = async kit => {
  const r = await khoNd4();
  const a = khoiTho(veCli(kit, r, '2026-10-20', 'Asia/Ho_Chi_Minh')); const b = khoiTho(veCli(kit, r, '2026-11-30', 'America/Los_Angeles'));
  git(r, 'checkout', '-q', '--', '.'); spawnSync('git', ['-C', r, 'clean', '-qfd']);
  const o = a && JSON.parse(a); if (!o || !o.lo_trinh[0].moc.some(m => m.du_kien)) return ['đối chứng: khối không có du_kien nào khác null'];
  return a === b ? [] : ['khối đổi theo hôm nay'];
};
if (want('ND-5')) { if (await chayCa('ND-5', nd5)) ok('ND-5', 'vẽ 20/10 Hồ Chí Minh và 30/11 Los Angeles: hai khối giống từng byte (có du_kien khác null)'); }
const nd5Check = async kit => {
  const r = kho({ data: nd4Data, hoSo: {} }); ghiHoSo(r, { a: { hinh: 'dang-dung', duBao: await db4('A', 0, '2026-10-18', '2026-10-23') } });
  veCli(kit, r, '2026-10-20', 'Asia/Ho_Chi_Minh'); git(r, 'add', '-A'); git(r, 'commit', '-qm', 'trang');
  const x = spawnSync(process.execPath, [path.join(kit, 'scripts', 'product-map.mjs'), '--root', r, '--check'], { encoding: 'utf8', env: { ...process.env, ACCEPTANCE_TODAY: '2026-11-30', TZ: 'America/Los_Angeles' } });
  return x.status === 0 ? [] : [`--check thoát ${x.status}: ${((x.stderr || '') + (x.stdout || '')).slice(0, 200)}`];
};
if (want('ND-5-check')) { if (await chayCa('ND-5-check', nd5Check)) ok('ND-5-check', 'trang commit ngày 20/10, --check ngày 30/11 khác múi giờ thoát 0'); }
if (want('ND-5-do')) await chayDo('ND-5-do', nd5, [[LT_MJS, 'du_kien: x.duKien || null,', "du_kien: x.duKien ? { ...x.duKien, chu: x.duKien.chu + (process.env.ACCEPTANCE_TODAY || '') } : null,"]], 'khối đổi theo hôm nay', 'bản sao để khối đọc hôm nay');

// ═══ ND-6 / ND-7 (AC-6, AC-7): đọc-cũ hai chiều ═════════════════════════════════════════════════════════════════════
const BON = [['hang', 'gio_may'], ['moc', 'gio_may'], ['moc', 'du_kien'], ['moc', 'qua_tai']];
const boBon = d => { const o = JSON.parse(JSON.stringify(d)); for (const t of o.lo_trinh || []) { for (const h of t.hang || []) delete h.gio_may; for (const m of t.moc || []) { delete m.gio_may; delete m.du_kien; delete m.qua_tai; } } return o; };
const rutDocGoc = () => {
  const s = readFileSync(path.join(banGoc(), 'scripts', 'lo-trinh.mjs'), 'utf8');
  const a = s.indexOf('export function docDuLieu(html) {'); const b = s.indexOf('\n}\n', a);
  if (a < 0 || b < 0) throw new Error('bộ máy gốc không có hàm docDuLieu');
  const txt = s.slice(a, b + 3); const bam = createHash('sha256').update(txt).digest('hex');
  return { bam, f: new Function(`${txt.replace(/^export /, '')}\nreturn docDuLieu;`)() };
};
const timLech = (a, b, duong = []) => {
  if (deq(a, b)) return null;
  if (a && b && typeof a === 'object' && typeof b === 'object' && Array.isArray(a) === Array.isArray(b)) {
    if (Array.isArray(a) && a.length !== b.length) return duong;
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { const r = timLech(a[k], b[k], [...duong, k]); if (r) return r; }
  }
  return duong;
};
const tenLech = duong => { const chu = duong.filter(x => !/^\d+$/.test(x)); return chu.slice(-2).join('.'); };
const nd6 = trangCu => async kit => {
  const M = await nap(kit); const r = await khoNd4(); const html = await trangCu(kit, r);
  const raw = khoi(html); if (!raw) return ['đối chứng: trang đời trước không có khối'];
  if (raw.lo_trinh.some(t => t.hang.some(h => 'gio_may' in h))) return ['đối chứng: trang đời trước đã có khoá gio_may'];
  let x; try { x = M.LT.docDuLieu(html); } catch (e) { return [`bộ đọc mới ném: ${e.message}`]; }
  if (!x.duLieu) return [`bộ đọc mới không đọc được: ${x.canhBao.join(' · ')}`];
  const sai = [];
  for (const t of x.duLieu.lo_trinh) { for (const h of t.hang) if (h.gio_may !== null) sai.push(`hàng ${h.ma}: gio_may không null`); for (const m of t.moc) for (const k of ['gio_may', 'du_kien', 'qua_tai']) if (m[k] !== null) sai.push(`mốc ${m.ten}: ${k} không null`); }
  if (x.canhBao.length !== 1 || !x.canhBao[0].includes('chưa có giờ máy và ngày dự kiến')) sai.push(x.canhBao.length ? `cảnh báo ${JSON.stringify(x.canhBao)}` : 'trang đời trước không cờ');
  const { f } = rutDocGoc(); const cu = f(html).duLieu;
  if (!deq(boBon(x.duLieu), boBon(cu))) sai.push(`khoá khác lệch bộ đọc gốc ở ${timLech(boBon(x.duLieu), boBon(cu)).join('.')}`);
  return sai;
};
const trangGoc = async (kit, r) => ve(banGoc(), r);
const trangXoaKhoa = async (kit, r) => { const h = await ve(kit, r); return datKhoi(h, boBon(khoi(h))); };
if (want('ND-6')) { if (await chayCa('ND-6', nd6(trangGoc), KIT_TAT())) ok('ND-6', `trang bộ máy ${GOC}: bộ đọc mới điền null, đúng một cờ «chưa có giờ máy và ngày dự kiến», khoá khác == bộ đọc gốc`); }
if (want('ND-6-xoa-khoa')) { if (await chayCa('ND-6-xoa-khoa', nd6(trangXoaKhoa))) ok('ND-6-xoa-khoa', 'trang mới xoá bốn khoá: bộ đọc mới điền null + đúng một cờ'); }
const nd6Moi = async kit => { const M = await nap(kit); const x = M.LT.docDuLieu(await ve(kit, await khoNd4())); return x.duLieu && x.canhBao.length === 0 ? [] : [`trang mới: ${JSON.stringify(x.canhBao)}`]; };
if (want('ND-6-trang-moi')) { if (await chayCa('ND-6-trang-moi', nd6Moi)) ok('ND-6-trang-moi', 'trang mới: bộ đọc mới 0 cảnh báo'); }
if (want('ND-6-do')) await chayDo('ND-6-do', nd6(trangXoaKhoa), [[LT_MJS, 'if (thieuGio) canhBao.push(', 'if (false) canhBao.push(']], 'trang đời trước không cờ', 'bản sao bỏ cờ trang đời trước');

const nd7Bam = async () => { const { bam } = rutDocGoc(); return bam === BAM_DOC_GOC ? [] : [`bộ đọc gốc không phải bản chép của crm (băm ${bam})`]; };
if (want('ND-7-bam')) { if (await chayCa('ND-7-bam', nd7Bam)) ok('ND-7-bam', `hàm docDuLieu của ${GOC} băm ${BAM_DOC_GOC.slice(0, 12)}… == bản chép crm`); }
const nd7 = async kit => {
  const { bam, f } = rutDocGoc(); if (bam !== BAM_DOC_GOC) return ['bộ đọc gốc không phải bản chép của crm'];
  const r = await khoNd4(); const moi = await ve(kit, r); const nen = await ve(banNen().dir, r);
  let x; try { x = f(moi); } catch (e) { return [`bộ đọc gốc ném trên trang mới: ${e.message}`]; }
  const sai = [];
  if (!x.duLieu) return [`bộ đọc gốc không đọc được trang mới: ${x.canhBao.join(' · ')}`];
  if (x.canhBao.length) sai.push(`bộ đọc gốc cảnh báo khuôn mới: ${x.canhBao.join(' · ')}`);
  if (x.duLieu.phien_ban !== 2) sai.push(`phien_ban ${x.duLieu.phien_ban}, cần 2`);
  const coKhoa = khoi(moi).lo_trinh[0].moc.some(m => 'du_kien' in m); if (!coKhoa) sai.push('đối chứng: trang mới không mang khoá du_kien');
  const a = boBon(x.duLieu); const b = boBon(f(nen).duLieu);
  if (!deq(a, b)) sai.push(`khoá bản 2 đổi: ${tenLech(timLech(a, b))}`);
  return sai;
};
if (want('ND-7')) { if (await chayCa('ND-7', nd7, KIT_TAT())) ok('ND-7', `bộ đọc gốc (bản crm) đọc trang mới: 0 cảnh báo, phiên bản 2, bỏ bốn khoá mới == trang bộ máy nền (${ghiChuNen()})`); }
if (want('ND-7-do')) await chayDoTat('ND-7-do', nd7, [[LT_MJS, 'hang: ganMoc(m), con_viec: conViecMoc(m, kq),', "hang: [...ganMoc(m), 'ZZ'], con_viec: conViecMoc(m, kq),"]], 'khoá bản 2 đổi: moc.hang', 'bản sao thêm phần tử vào danh sách việc của mốc');
if (want('ND-7-do phien-ban')) await chayDoTat('ND-7-do phien-ban', nd7, [[LT_MJS, 'export const PHIEN_BAN_DU_LIEU = 2;', 'export const PHIEN_BAN_DU_LIEU = 3;']], 'bộ đọc gốc cảnh báo khuôn mới', 'bản sao tăng phiên bản khuôn');

// ═══ ND-8 (AC-8): tài liệu == mã, bộ đọc tự đủ ═══════════════════════════════════════════════════════════════════════
const TL = kit => path.join(kit, 'skills', 'acceptance', 'references', 'lo-trinh-du-lieu.md');
const khoiMd = (txt, ten) => { const m = String(txt).match(new RegExp(`<!-- <<<${ten} -->\\n\`\`\`[a-z]*\\n([\\s\\S]*?)\`\`\`\\n<!-- ${ten}>>> -->`)); return m ? m[1] : null; };
const soTap = (cap, ma, tl) => [...ma.filter(k => !tl.includes(k)).map(k => `cấp ${cap}: mã so tài liệu thiếu ${k}`), ...tl.filter(k => !ma.includes(k)).map(k => `cấp ${cap}: tài liệu thừa ${k}`)];
const nd8 = async kit => {
  const M = await nap(kit); const KM = M.LT.KHUON_DU_LIEU; const sai = [];
  for (const cap of ['gio_may', 'gio_may_moc', 'du_kien']) if (!Array.isArray(KM[cap])) sai.push(`KHUON_DU_LIEU thiếu cấp ${cap}`);
  const txt = existsSync(TL(kit)) ? readFileSync(TL(kit), 'utf8') : '';
  const b = khoiMd(txt, 'LO-TRINH-DU-LIEU-KHOA'); if (b == null) return [...sai, 'tài liệu thiếu khối LO-TRINH-DU-LIEU-KHOA'];
  const tl = {}; for (const l of b.split('\n').filter(Boolean)) { const m = l.match(/^([a-z_]+)\.([a-z_]+) — /); if (!m) { sai.push(`dòng khoá lạ: «${l}»`); continue; } (tl[m[1]] ||= []).push(m[2]); }
  for (const cap of new Set([...Object.keys(KM), ...Object.keys(tl)])) sai.push(...soTap(cap, KM[cap] || [], tl[cap] || []));
  // Bảng khoá bên trong bộ đọc: khối rỗng mọi cấp → bộ đọc điền đủ khoá của từng cấp.
  const html = await ve(kit, await khoNd4());
  const rongHet = { khuon: 'lo-trinh-du-lieu', phien_ban: 2, lo_trinh: [{ hang_ke: {}, tien_do: {}, can_sua: [{}], hang: [{ gio_may: {}, tom_tat: {} }], moc: [{ gio_may: {}, du_kien: {} }], da_bac: [{}] }] };
  let tach; try { tach = new Function(`return (${M.LT.docDuLieu.toString()});`)(); } catch (e) { return [...sai, `không dựng được bản chép rời: ${e.message}`]; }
  let d; try { d = tach(datKhoi(html, rongHet)).duLieu; } catch (e) { return [...sai, `bản chép rời ném: ${e.message}`]; }
  const L = d.lo_trinh[0]; const h = L.hang[0]; const m = L.moc[0];
  const cap = { goc: d, lo_trinh: L, hang_ke: L.hang_ke, tien_do: L.tien_do, can_sua: L.can_sua[0], hang: h, moc: m, da_bac: L.da_bac[0], tom_tat: h.tom_tat, moi_nguoi: h.tom_tat && h.tom_tat.moi_nguoi, chu_kho: h.tom_tat && h.tom_tat.chu_kho, gio_may: h.gio_may, gio_may_moc: m.gio_may, du_kien: m.du_kien };
  const lech = Object.entries(cap).filter(([c, o]) => !o || !deq(Object.keys(o).sort(), [...(KM[c] || [])].sort())).map(([c]) => c);
  if (lech.length) sai.push(`bảng khoá trong docDuLieu lệch KHUON_DU_LIEU — ${lech.join(', ')}`);
  for (const [ten, trang] of [['trang mới', html], ['trang đời trước', datKhoi(html, boBon(khoi(html)))]]) if (!deq(tach(trang), M.LT.docDuLieu(trang))) sai.push(`bản chép rời lệch bản mô-đun: ${ten}`);
  const bang = (txt.split('## Đọc khoan dung')[1] || '').split('\n## ')[0];
  if (!bang.split('\n').some(l => l.startsWith('|') && l.includes('gio_may'))) sai.push('bảng «Đọc khoan dung» không có dòng cho trang thiếu gio_may');
  return sai;
};
if (want('ND-8')) { if (await chayCa('ND-8', nd8)) ok('ND-8', 'tài liệu == KHUON_DU_LIEU mọi cấp (có gio_may, gio_may_moc, du_kien); bảng trong bộ đọc == KHUON; bản chép rời == bản mô-đun'); }
// Chiều đỏ của ND-8 phải là lệch DUY NHẤT: nhát tiêm còn làm hỏng chỗ khác thì không chứng được đã bắt đúng lỗi được tiêm.
const nd8Duy = async kit => { const s = await nd8(kit); return s.length > 1 ? [`lệch không duy nhất (${s.length} lệch)`] : s; };
if (want('ND-8-do tai-lieu')) await chayDo('ND-8-do tai-lieu', nd8Duy, [['skills/acceptance/references/lo-trinh-du-lieu.md', 'du_kien.hoan_tat — ngày hoàn tất dự kiến YYYY-MM-DD\n', '']], 'cấp du_kien: mã so tài liệu thiếu hoan_tat', 'bản sao tài liệu bỏ dòng du_kien.hoan_tat');
if (want('ND-8-do bang-khoa')) await chayDo('ND-8-do bang-khoa', nd8Duy, [[LT_MJS, "    du_kien: ['ngay_tinh', 'hoan_tat', 'chu'],\n", '']], 'bảng khoá trong docDuLieu lệch KHUON_DU_LIEU — du_kien', 'bản sao bộ đọc bỏ cấp du_kien');

try { rmSync(TMP, { recursive: true, force: true }); } catch { /* bỏ */ }
console.log(`\nResults: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
