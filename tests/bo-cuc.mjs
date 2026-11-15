// bo-cuc.mjs — bộ dịch đường của bộ kiểm (hồ sơ phan-du-bo-cuc-moi, design §2). Đầu vào luôn là một đường viết theo bố
// cục PHẲNG (hoặc dạng `plugins/<gói>/…` mà luật bước 6 của kịch bản chuyển nhà sinh ra) cộng MỘT cây; đầu ra là đường
// của chính thứ ấy ở cây ấy. Bố cục đọc từ vật của chính cây: `.claude-plugin/marketplace.json` (gói nào ở thư mục nào)
// và `lib/ho-goi.cjs` của gói lõi (tên plugin theo vai). Hằng duy nhất là bảng bố cục phẳng đã đóng băng
// `tests/fixtures/bo-cuc-phang.json`.
//
// Ba kiểu cây:
//   { thuMuc }        một thư mục gốc kho (cây đang đứng, bản bung, kho mới dựng tạm)
//   { kho, ref }      một commit, đọc bằng `git -C <kho> show <ref>:<đường>`
//   { goiGoc, vai }   bản sao gốc MỘT plugin (bộ đệm cài, lớp CI chép sang kho tiêu thụ): không có tiền tố gói, đường
//                     ra là đường từ gốc gói; tên cũ/mới đọc từ `.claude-plugin/plugin.json` (+ bảng tên nếu gói mang)
//
// Chuẩn hoá hai chiều: dạng `plugins/<x>/…` được đưa về vai trước (đảo bảng đổi tên tệp), rồi mới dịch xuôi tới cây
// đích, nên duong(duong(p, c), c) === duong(p, c). Cây thiếu tệp khai chợ → lỗi có tên, KHÔNG lùi lặng về phẳng.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..');
const BANG = JSON.parse(readFileSync(path.join(HERE, 'fixtures', 'bo-cuc-phang.json'), 'utf8'));
const MARKETPLACE = '.claude-plugin/marketplace.json';
const PLUGIN_JSON = '.claude-plugin/plugin.json';
const BANG_TEN = 'lib/ho-goi.cjs';
const VAI_LOI = 'loi';
const GLOB = /[*?[{]/;
const DUNG = 'cách dùng: node tests/bo-cuc.mjs duong <rel> [--thu-muc <dir> | --kho <dir> --ref <ref>]';

const loi = m => new Error(`bo-cuc: ${m}`);
const tenPhangCuaVai = vai => Object.keys(BANG.goi_phang).find(k => BANG.goi_phang[k] === vai);
// Tên plugin chỉ có ở bố cục mới (dispatch, roadmap, knowledge): khác tên phẳng của cùng vai.
const laTenMoi = t => {
  const vai = BANG.ten_moi[t];
  const cu = vai && tenPhangCuaVai(vai);
  return Boolean(cu) && cu !== t;
};

// ── Đọc vật của một cây ─────────────────────────────────────────────────────────────────────────────────────────────
function docTep(cay, rel) {
  if (cay.thuMuc || cay.goiGoc) {
    const p = path.join(cay.thuMuc || cay.goiGoc, rel);
    return existsSync(p) ? readFileSync(p, 'utf8') : null;
  }
  const r = spawnSync('git', ['-C', cay.kho, 'show', `${cay.ref}:${rel}`], { encoding: 'utf8', maxBuffer: 1 << 26 });
  return r.status === 0 ? r.stdout : null;
}

function napBangTen(src, nhan) {
  const m = { exports: {} };
  try { vm.runInNewContext(src, { module: m, exports: m.exports }, { filename: nhan }); }
  catch (e) { throw loi(`không nạp được bảng tên ${nhan}: ${e.message}`); }
  return m.exports.GOI || null;
}

const vaiTheoTen = (ten, GOI) => GOI?.[ten]?.vai ?? BANG.ten_moi[ten] ?? BANG.goi_phang[ten];

function chuanNguon(source, nhan) {
  if (typeof source !== 'string') throw loi(`${nhan}: source không phải chuỗi đường: ${JSON.stringify(source)}`);
  return source.replace(/^\.\//, '').replace(/\/+$/, '') || '.';
}

function docCho(cay, nhan) {
  const txt = docTep(cay, MARKETPLACE);
  if (txt === null) throw loi(`${nhan} không có ${MARKETPLACE}`);
  let mk;
  try { mk = JSON.parse(txt); } catch (e) { throw loi(`${nhan}: ${MARKETPLACE} không phải JSON: ${e.message}`); }
  return (mk.plugins || []).map(p => ({ ten: p.name, nguon: chuanNguon(p.source, nhan) }));
}

// Bảng tên nằm ở gói lõi — tìm ở gốc từng gói khai trong chợ (gói nào mang `lib/ho-goi.cjs`).
function timBangTen(cay, muc) {
  for (const m of muc) {
    const rel = path.posix.join(m.nguon, BANG_TEN);
    const src = docTep(cay, rel);
    if (src !== null) return napBangTen(src, rel);
  }
  return null;
}

function boCucKho(cay, nhan) {
  const muc = docCho(cay, nhan);
  const GOI = timBangTen(cay, muc);
  const goc = {}; const ten = {};
  for (const m of muc) {
    const vai = vaiTheoTen(m.ten, GOI);
    if (!vai) throw loi(`${nhan}: mục chợ «${m.ten}» không rõ vai`);
    goc[vai] = m.nguon;
    const tuBang = GOI && Object.keys(GOI).find(k => GOI[k].vai === vai);
    ten[vai] = GOI ? (tuBang ?? m.ten) : (tenPhangCuaVai(vai) ?? m.ten);
  }
  const phang = muc.every(m => m.nguon === '.' || m.nguon in BANG.goi_phang);
  return { phang, goc, ten };
}

function boCucGoi(cay) {
  const txt = docTep(cay, PLUGIN_JSON);
  if (txt === null) throw loi(`${cay.goiGoc} không có ${PLUGIN_JSON}`);
  let ten;
  try { ten = JSON.parse(txt).name; } catch (e) { throw loi(`${cay.goiGoc}: ${PLUGIN_JSON} không phải JSON: ${e.message}`); }
  const src = docTep(cay, BANG_TEN);
  const GOI = src === null ? null : napBangTen(src, path.join(cay.goiGoc, BANG_TEN));
  if (vaiTheoTen(ten, GOI) !== cay.vai) throw loi(`${cay.goiGoc}: plugin «${ten}» không mang vai «${cay.vai}»`);
  const phang = ![ten, ...Object.keys(GOI || {})].some(laTenMoi);
  return { phang, goc: { [cay.vai]: '.' }, ten: { [cay.vai]: ten } };
}

const DEM = new Map(); // { kho, ref } → bố cục; khoá theo sha nên ref di động (HEAD) không trả bản cũ
function boCucRef(cay) {
  const r = spawnSync('git', ['-C', cay.kho, 'rev-parse', '--verify', '--quiet', `${cay.ref}^{commit}`], { encoding: 'utf8' });
  if (r.status !== 0) throw loi(`${cay.ref} không phải commit ở ${cay.kho}`);
  const sha = r.stdout.trim();
  const khoa = `${cay.kho}\0${sha}`;
  if (!DEM.has(khoa)) DEM.set(khoa, boCucKho({ kho: cay.kho, ref: sha }, cay.ref));
  return DEM.get(khoa);
}

export function boCuc(cay) {
  if (cay && cay.goiGoc && cay.vai) return boCucGoi(cay);
  if (cay && cay.thuMuc) return boCucKho(cay, cay.thuMuc);
  if (cay && cay.kho && cay.ref) return boCucRef(cay);
  throw loi(`cây phải là { thuMuc } · { kho, ref } · { goiGoc, vai } — được ${JSON.stringify(cay)}`);
}

// ── Dịch ────────────────────────────────────────────────────────────────────────────────────────────────────────────
function kiemRel(rel) {
  const bad = typeof rel !== 'string' || rel === '' || path.posix.isAbsolute(rel) || path.win32.isAbsolute(rel)
    || rel.split(/[\\/]/).includes('..');
  if (bad) throw loi(`chỉ nhận đường tương đối gốc kho: ${rel}`);
  return rel.replace(/^(\.\/)+/, '');
}

const khop = (trong, k) => trong === k || trong.startsWith(`${k}/`);
function doiTen(vai, trong, chieu) {
  for (const [cu, moi] of Object.entries(BANG.doi_ten_tep[vai] || {})) {
    const [tu, toi] = chieu === 'xuoi' ? [cu, moi] : [moi, cu];
    if (khop(trong, tu)) return toi + trong.slice(tu.length);
  }
  return trong;
}

let GOI_DANG; // bảng tên của cây đang chạy (vắng tệp khai chợ ở đây là hợp lệ — bảng đóng băng đã đủ)
function goiDangChay() {
  if (GOI_DANG === undefined) {
    const cay = { thuMuc: KIT };
    GOI_DANG = docTep(cay, MARKETPLACE) === null ? null : timBangTen(cay, docCho(cay, KIT));
  }
  return GOI_DANG;
}

// Đường phẳng hoặc `plugins/<x>/…` → { vai, trong } (trong = đường từ gốc gói, tên tệp phẳng); null = không thuộc gói nào.
function phanTich(s) {
  const seg = s.split('/');
  if (seg[0] === 'plugins' && seg.length >= 2) {
    const vai = vaiTheoTen(seg[1], goiDangChay());
    return vai ? { vai, trong: doiTen(vai, seg.slice(2).join('/'), 'nguoc') } : null;
  }
  if (seg[0] in BANG.goi_phang) return { vai: BANG.goi_phang[seg[0]], trong: seg.slice(1).join('/') };
  if (BANG.thu_muc_loi.includes(seg[0]) || BANG.tep_loi.includes(s)) return { vai: VAI_LOI, trong: s };
  return null;
}

const ghep = (goc, trong) => (goc === '.' ? (trong || '.') : (trong ? `${goc}/${trong}` : goc));
const nhanCay = cay => cay.thuMuc || cay.goiGoc || cay.ref;

export function duong(rel, cay) {
  const s = kiemRel(rel);
  const b = boCuc(cay);
  const p = phanTich(s);
  if (cay.goiGoc) {
    if (!p || p.vai !== cay.vai) throw loi(`${rel} không thuộc gói vai «${cay.vai}» của ${cay.goiGoc}`);
    return ghep('.', b.phang ? p.trong : doiTen(p.vai, p.trong, 'xuoi'));
  }
  if (!p) return s;
  if (b.phang) return ghep(p.vai === VAI_LOI ? '.' : tenPhangCuaVai(p.vai), p.trong);
  const goc = b.goc[p.vai];
  if (goc === undefined) throw loi(`${nhanCay(cay)} không có gói vai «${p.vai}» trong ${MARKETPLACE}`);
  return ghep(goc, doiTen(p.vai, p.trong, 'xuoi'));
}

export function tep(rel, cay) {
  const d = duong(rel, cay);
  if (cay.thuMuc || cay.goiGoc) return path.join(cay.thuMuc || cay.goiGoc, d);
  return `${cay.ref}:${d}`;
}

export function gocGoi(cay, vai) {
  if (cay && cay.goiGoc) {
    if (vai !== cay.vai) throw loi(`${cay.goiGoc} là gói vai «${cay.vai}», không phải «${vai}»`);
    return cay.goiGoc;
  }
  if (!cay || !cay.thuMuc) throw loi(`gocGoi chỉ nhận { thuMuc } — được ${JSON.stringify(cay)}`);
  const goc = boCuc(cay).goc[vai];
  if (goc === undefined) throw loi(`${cay.thuMuc} không có gói vai «${vai}» trong ${MARKETPLACE}`);
  return path.join(cay.thuMuc, goc);
}

export function tenGoi(cay, vai) {
  const ten = boCuc(cay).ten[vai];
  if (ten === undefined) throw loi(`${nhanCay(cay)} không có gói vai «${vai}»`);
  return ten;
}

export function pathspec(rel, cay) {
  if (!cay || !cay.kho || !cay.ref) throw loi(`pathspec chỉ nhận { kho, ref } — được ${JSON.stringify(cay)}`);
  const d = duong(rel, cay);
  const seg = d.split('/');
  const i = seg.findIndex(x => GLOB.test(x));
  const phanThu = (i < 0 ? seg : seg.slice(0, i)).join('/');
  const r = spawnSync('git', ['-C', cay.kho, 'cat-file', '-e', `${cay.ref}:${phanThu}`], { stdio: 'ignore' });
  if (r.status !== 0) throw loi(`pathspec rỗng ở ${cay.ref}: ${d}`);
  return d;
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
function docCo(co) {
  const BIET = new Set(['--thu-muc', '--kho', '--ref']);
  const ra = {};
  for (let i = 0; i < co.length; i += 2) {
    if (!BIET.has(co[i])) throw loi(`cờ lạ: ${co[i]} — ${DUNG}`);
    if (co[i + 1] === undefined || co[i + 1].startsWith('--')) throw loi(`${co[i]} thiếu giá trị — ${DUNG}`);
    ra[co[i]] = co[i + 1];
  }
  if (ra['--thu-muc'] && (ra['--kho'] || ra['--ref'])) throw loi(`--thu-muc không đi cùng --kho/--ref — ${DUNG}`);
  if (Boolean(ra['--kho']) !== Boolean(ra['--ref'])) throw loi(`--kho và --ref phải đi cùng nhau — ${DUNG}`);
  if (ra['--thu-muc']) return { thuMuc: path.resolve(ra['--thu-muc']) };
  if (ra['--kho']) return { kho: path.resolve(ra['--kho']), ref: ra['--ref'] };
  return { thuMuc: KIT };
}

function cli(argv) {
  const [lenh, rel, ...co] = argv;
  if (lenh !== 'duong' || rel === undefined) throw loi(DUNG);
  process.stdout.write(`${duong(rel, docCo(co))}\n`);
}

const laChinh = () => {
  try { return Boolean(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url)); }
  catch { return false; }
};
if (laChinh()) {
  try { cli(process.argv.slice(2)); }
  catch (e) { process.stderr.write(`${e.message}\n`); process.exit(2); }
}
