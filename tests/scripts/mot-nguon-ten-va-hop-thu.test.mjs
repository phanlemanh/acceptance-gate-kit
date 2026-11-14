// mot-nguon-ten-va-hop-thu.test.mjs — hồ sơ goi-cheo-loi-dieu-phoi, ca GN-<n> (AC-9; eval E9 ghim đúng các dòng
// «PASS: GN-…» của tệp này).
//
// Hai răng một nguồn:
//   GN-1  bảng tên `lib/ho-goi.cjs` ≡ `.claude-plugin/marketplace.json` — cùng tên theo cùng thứ tự, cùng tập mang dấu
//         bật-theo-lựa-chọn, cùng tên chợ. Bảng là nguồn tên ở bản cài không mang tệp khai chợ (bố cục plugins/<tên>/).
//   GN-2  hộp thư `scripts/hop-thu/<tệp>` ≡ `dieu-phoi/scripts/<tệp>` từng byte, cho bốn tệp dùng chung. Bản của điều
//         phối là bản gốc; sửa nó thì chép sang lõi.
// Ca đỏ («-do-…») chạy CHÍNH hàm so trên BẢN SAO (thư mục tạm chứa đúng các tệp hai răng đọc, chép từ cây đang kiểm),
// SAU khi bản sao lành xanh, tiêm đúng một nhát (nhát không áp → ca tự FAIL) và ghim thông điệp. Mọi đường suy từ vị trí
// tệp này; không ca nào ghi vào cây kit.
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const TMP = realpathSync(mkdtempSync(path.join(tmpdir(), 'mot-nguon-ten-')));
const require = createRequire(import.meta.url);
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const only = (process.env.GN_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => !only.length || only.some(o => id === o || id.startsWith(o + '-'));

export const HOP_THU = ['hinh-dang.mjs', 'cau-hinh.mjs', 'dot.mjs', 'cua-tin-hieu.mjs'];
const DAU_LUA_CHON = 'bat-theo-lua-chon';

// GN-1 — trả mảng lỗi (rỗng = khớp). `goc` = gốc một cây có `.claude-plugin/marketplace.json` và `lib/ho-goi.cjs`.
export function soBangTen(goc) {
  const tepBang = path.join(goc, 'lib', 'ho-goi.cjs');
  if (!existsSync(tepBang)) return ['thiếu lib/ho-goi.cjs'];
  let mk;
  try { mk = JSON.parse(readFileSync(path.join(goc, '.claude-plugin', 'marketplace.json'), 'utf8')); }
  catch (e) { return [`không đọc được .claude-plugin/marketplace.json: ${e.message}`]; }
  delete require.cache[require.resolve(tepBang)];
  const B = require(tepBang);
  const loi = [];
  const tenCho = (mk.plugins || []).map(p => p.name);
  const tenBang = Object.keys(B.GOI || {});
  for (const t of tenCho) if (!tenBang.includes(t)) loi.push(`bảng tên thiếu ${t}`);
  for (const t of tenBang) if (!tenCho.includes(t)) loi.push(`bảng tên thừa ${t}`);
  if (!loi.length && tenCho.join(',') !== tenBang.join(',')) loi.push(`lệch thứ tự: chợ ${tenCho.join(',')} · bảng ${tenBang.join(',')}`);
  for (const p of mk.plugins || []) {
    const chon = Array.isArray(p.tags) && p.tags.includes(DAU_LUA_CHON);
    if (B.GOI && B.GOI[p.name] && Boolean(B.GOI[p.name].luaChon) !== chon) loi.push(`lệch bật-theo-lựa-chọn: ${p.name}`);
  }
  if (B.CHO !== mk.name) loi.push(`lệch tên chợ: bảng ${B.CHO} · chợ ${mk.name}`);
  return loi;
}

// GN-2 — trả mảng lỗi (rỗng = khớp từng byte).
export function soHopThu(goc) {
  const loi = [];
  for (const f of HOP_THU) {
    const a = path.join(goc, 'scripts', 'hop-thu', f);
    const b = path.join(goc, 'dieu-phoi', 'scripts', f);
    if (!existsSync(a)) { loi.push(`thiếu scripts/hop-thu/${f}`); continue; }
    if (!existsSync(b)) { loi.push(`thiếu dieu-phoi/scripts/${f}`); continue; }
    if (!readFileSync(a).equals(readFileSync(b))) loi.push(`hop-thu/${f} khác dieu-phoi/scripts/${f} — chép lại: cp dieu-phoi/scripts/${f} scripts/hop-thu/${f}`);
  }
  return loi;
}

let soBanSao = 0;
function banSao() {
  const d = path.join(TMP, `kit-${++soBanSao}`);
  for (const rel of ['.claude-plugin/marketplace.json', 'lib/ho-goi.cjs',
    ...HOP_THU.map(f => `scripts/hop-thu/${f}`), ...HOP_THU.map(f => `dieu-phoi/scripts/${f}`)]) {
    const nguon = path.join(KIT, rel);
    if (!existsSync(nguon)) continue;
    mkdirSync(path.dirname(path.join(d, rel)), { recursive: true });
    cpSync(nguon, path.join(d, rel));
  }
  return d;
}
function tiem(goc, rel, doi) {
  const p = path.join(goc, rel); const truoc = readFileSync(p, 'utf8'); const sau = doi(truoc);
  if (sau === truoc) throw new Error(`nhát phá không áp: ${rel}`);
  writeFileSync(p, sau);
}
const coChua = (loi, can) => loi.some(l => l.includes(can));

// Ca đỏ: bản sao lành phải xanh trước, rồi nhát phá phải cho ĐÚNG thông điệp ghim.
function do_(id, ham, nhat, ghim) {
  if (!want(id)) return;
  try {
    const d = banSao();
    const lanh = ham(d);
    if (lanh.length) return bad(id, `bản sao lành chưa xanh: ${lanh.join(' · ')}`);
    nhat(d);
    const loi = ham(d);
    if (coChua(loi, ghim)) ok(id, `đỏ đúng: ${loi.find(l => l.includes(ghim))}`);
    else bad(id, `không đỏ đúng «${ghim}» — được: ${loi.join(' · ') || '(xanh)'}`);
  } catch (e) { bad(id, String(e.message || e)); }
}

const sua = (rel, f) => d => tiem(d, rel, f);
const suaJson = f => sua('.claude-plugin/marketplace.json', t => JSON.stringify(f(JSON.parse(t)), null, 2) + '\n');

if (want('GN-1')) { const l = soBangTen(KIT); l.length ? bad('GN-1', l.join(' · ')) : ok('GN-1', 'bảng tên ≡ marketplace.json'); }
do_('GN-1-do-them', soBangTen, suaJson(j => ({ ...j, plugins: [...j.plugins, { name: 'goi-moi', source: './goi-moi' }] })), 'bảng tên thiếu goi-moi');
do_('GN-1-do-dau', soBangTen, suaJson(j => ({ ...j, plugins: j.plugins.map(p => p.name === 'feature-loop' ? { ...p, tags: [DAU_LUA_CHON] } : p) })), 'lệch bật-theo-lựa-chọn: feature-loop');
do_('GN-1-do-cho', soBangTen, suaJson(j => ({ ...j, name: 'cho-khac' })), 'lệch tên chợ');
if (want('GN-2')) { const l = soHopThu(KIT); l.length ? bad('GN-2', l.join(' · ')) : ok('GN-2', `hộp thư ≡ dieu-phoi/scripts (${HOP_THU.length} tệp)`); }
do_('GN-2-do', soHopThu, sua('scripts/hop-thu/dot.mjs', t => t + ' '), 'hop-thu/dot.mjs khác dieu-phoi/scripts/dot.mjs');

console.log(`\nGN Results: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
