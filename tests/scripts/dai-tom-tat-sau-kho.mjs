// dai-tom-tat-sau-kho.mjs — hồ sơ dai-tom-tat-dem-dung-vi-sao-tron, ca DD-7 / DD-9: ô «chưa làm gì» và mục
// «Vì sao làm» trên dữ liệu THẬT của sáu kho. KHÔNG mang đuôi .test.mjs: cần sáu kho trên máy (KHO_<TÊN> hoặc
// ~/dev/<tên>; kit = cây chứa tệp này) nên không vào suite — kho hay mã vắng thì ĐỎ nêu tên kho, không bỏ qua.
//
// Bản chụp: `git archive <mã ghim> _acceptance` của từng kho vào thư mục tạm — không ghi gì vào kho nào. Bộ đọc
// base = cây bd8163dc (đỉnh vòng dai-tom-tat-doc-dung), bộ vẽ tiền-trần = 7f65e5a0 (trước khi ô vì sao có trần):
// cả hai `git archive` TRỌN thư mục scripts lib skills. Bộ đếm và bộ dò khối giới hạn trong tệp này viết ĐỘC LẬP
// (không require scripts/ho-so-tom-tat.cjs): phân lớp từng dòng rồi đếm chuỗi mục.
//
//   node tests/scripts/dai-tom-tat-sau-kho.mjs                          → DD-7, DD-7-base, DD-7-do, DD-9, DD-9-do, DD-9-do-tran2
//   node tests/scripts/dai-tom-tat-sau-kho.mjs --hien-tai crm=<gốc kho>  → đường đo của ngưỡng nghiệm thu (mục Đường
//       đo của hợp đồng): đọc cây HIỆN TẠI của kho, in bốn số (i)–(iv), thoát 0 khi cả bốn bằng 0.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, readdirSync, existsSync, statSync, cpSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const req = createRequire(import.meta.url);
const { section } = req(path.join(KIT, 'lib', 'md-section.cjs'));
const BASE_SHA = 'bd8163dcf46f04dff8d5f1ab21a4f1a5a1556767';
const TIEN_SHA = '7f65e5a0277929b32663b44becf51c300dabfac0';
const KHO = [
  ['kit', BASE_SHA], ['crm', '4c440ab17f2129470e2b9eaefd9dd2260688a7d8'], ['radar', '0d355f36e41638fcefe9f379ef52ce1912a7cf4f'],
  ['oneflow', '93b0129cf1c8bd991d26ea753a8b28de1785fb1d'], ['artifact-platform', '92fc58a3e2baefe0a479c7a2efe2c91212858be7'],
  ['media-library', '75f4bf4a252624cf062b25e94852452972b030db'],
];
const goc = ten => (ten === 'kit' ? KIT : process.env[`KHO_${ten.toUpperCase().replace(/-/g, '_')}`] || path.join(homedir(), 'dev', ten));
const TMP = mkdtempSync(path.join(tmpdir(), 'dai-tom-tat-sau-kho-'));
let pass = 0; let fail = 0;
const ok = (id, m = '') => { pass += 1; console.log(`  PASS: ${id}${m ? ` — ${m}` : ''}`); };
const bad = (id, m) => { fail += 1; console.log(`  FAIL: ${id} — ${m}`); };
const ketThuc = () => { rmSync(TMP, { recursive: true, force: true }); console.log(`\nResults: ${pass} passed, ${fail} failed (dai-tom-tat-sau-kho)`); process.exit(fail ? 1 : 0); };
const loi = e => String((e && (e.stack || e.message)) || e).split('\n').slice(0, 3).join(' | ');
const doc = p => { try { return readFileSync(p, 'utf8'); } catch (_) { return null; } };
function giai(repo, sha, dich, thuMuc) {
  mkdirSync(dich, { recursive: true });
  const tar = execFileSync('git', ['-C', repo, 'archive', '--format=tar', sha, ...thuMuc], { maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'pipe'] });
  execFileSync('tar', ['-x', '-C', dich], { input: tar, maxBuffer: 1 << 30 });
}
const veGH = v => String(v || '').replace(/^.*? · /, '');

// ── Bộ đếm / bộ dò ĐỘC LẬP ────────────────────────────────────────────────
// Phân lớp dòng: T (trắng) · H (tiêu đề) · M (mục: lề, loại gạch/số, chữ) · C (dòng thụt) · V (văn ở lề 0).
const DAU = /^(?:\*\*)?\s*(?:known[ -]limits?|giới hạn đã biết|hạn chế đã biết)(?![\w-])/i;
const RONG = s => /^[*_\s]*(?:none|không có|không)\.?[*_\s]*$/i.test(String(s).replace(/\*\*/g, '').trim());
function lop(l) {
  if (!l.trim()) return { k: 'T' };
  if (/^\s*#{1,6}\s/.test(l)) return { k: 'H', cap: l.match(/^\s*(#+)/)[1].length };
  const m = l.match(/^(\s*)([-*]|\d+[.)])\s+(.*)$/);
  if (m) return { k: 'M', le: m[1].length, loai: /\d/.test(m[2]) ? 's' : 'g', chu: m[3] };
  return /^\s/.test(l) ? { k: 'C' } : { k: 'V' };
}
// Đơn vị của một thân khối: chuỗi mục (cùng lề + loại, dòng trắng xen được; dòng C và dòng V liền ngay sau mục
// thuộc mục) · đoạn (V liền nhau) · tiêu đề. Dừng ở `dung(dòng)`; mot = khối không biên: dừng sau chuỗi mục đầu.
function donVi(L, i, dung, mot) {
  const u = []; let cur = null; let truocTrang = true;
  for (let j = i; j < L.length; j++) {
    const l = L[j]; if (dung(l)) break; const c = lop(l);
    if (c.k === 'T') { truocTrang = true; continue; }
    if (c.k === 'H') { u.push({ k: 'H' }); cur = null; truocTrang = false; continue; }
    if (c.k === 'M') {
      if (cur && cur.k === 'D' && c.le === cur.le && c.loai === cur.loai) { cur.muc.push(c.chu); truocTrang = false; continue; }
      if (cur && cur.k === 'D' && c.le > cur.le) { truocTrang = false; continue; }
      if (mot && u.some(x => x.k === 'D')) break;
      cur = { k: 'D', le: c.le, loai: c.loai, muc: [c.chu] }; u.push(cur); truocTrang = false; continue;
    }
    if (c.k === 'C' && cur && cur.k === 'D') { truocTrang = false; continue; }
    if (c.k === 'V' && cur && cur.k === 'D' && !truocTrang) continue;
    if (cur && cur.k === 'P' && !truocTrang) { truocTrang = false; continue; }
    if (mot && u.some(x => x.k === 'D')) break;
    cur = { k: 'P', chu: l.trim() }; u.push(cur); truocTrang = false;
  }
  return u;
}
// Một thân khối → số mục, hoặc null (nhiều nhóm / tiêu đề con / nhiều đoạn).
function demThan(u, coRanh) {
  if (u.some(x => x.k === 'H')) return null;
  const D = u.filter(x => x.k === 'D'); const P = u.filter(x => x.k === 'P');
  if (!u.length) return 0;
  if (u[0].k === 'P' && RONG(u[0].chu)) return u.length === 1 || !coRanh ? 0 : null;
  if (coRanh) { if (D.length === 1) return D[0].muc.filter(c => !RONG(c)).length; if (D.length > 1) return null; return P.length === 1 ? 1 : null; }
  if (u[0].k === 'D') return u[0].muc.filter(c => !RONG(c)).length;
  if (u[1] && u[1].k === 'D') return u[1].muc.filter(c => !RONG(c)).length;
  return u.length === 1 ? 1 : null;
}
function demNotes(hd) {
  if (hd == null) return 0;
  const L = section(hd, 'Notes'); let so = 0; let hong = false; const da = new Set();
  const laTD = l => /^\s*#{1,6}\s/.test(l);
  for (let i = 0; i < L.length; i++) {
    if (da.has(i)) continue; const l = L[i]; const c = lop(l);
    const dauDoan = i === 0 || !L[i - 1].trim() || laTD(L[i - 1]);
    const laDauTD = c.k === 'H' && DAU.test(l.replace(/^\s*#+\s+/, ''));
    const laDauVan = c.k === 'V' && dauDoan && DAU.test(l.trim());
    if (laDauTD || laDauVan) {
      let j = i + 1; let dau = l.replace(/^\s*#+\s+/, '').trim();
      if (laDauVan) while (j < L.length && lop(L[j]).k === 'V') dau += ' ' + L[j++].trim();
      for (let k = i; k < j; k++) da.add(k);
      if (laDauTD) {
        // Khối tiêu đề: tới tiêu đề cùng hoặc cao cấp hơn; mọi dòng trong khối thuộc khối.
        let ket = L.length; for (let k = j; k < L.length; k++) { const x = lop(L[k]); if (x.k === 'H' && x.cap <= c.cap) { ket = k; break; } }
        const n = demThan(donVi(L.slice(0, ket), j, () => false, false), true);
        if (n == null) hong = true; else so += n;
        for (let k = j; k < ket; k++) da.add(k);
        continue;
      }
      const tr = dau.replace(/\*\*/g, '');
      const sau = /:/.test(tr) ? tr.replace(/^\s*(?:known[ -]limits?|giới hạn đã biết|hạn chế đã biết)[^:]*:\s*/i, '').trim() : '';
      const het = viTriHet(L, j);
      if (sau) {
        // Đầu đoạn mang câu: danh sách ngay sau → các mục; không → chính nó là một.
        let k = j; while (k < L.length && !L[k].trim()) k++;
        if (k < L.length && lop(L[k]).k === 'M') { so += donVi(L, k, laTD, true)[0].muc.filter(x => !RONG(x)).length; for (let q = k; q < het; q++) da.add(q); }
        else if (!RONG(sau)) so += 1;
        continue;
      }
      const n = demThan(donVi(L, j, laTD, true), false);
      if (n == null) hong = true; else so += n;
      for (let q = j; q < het; q++) da.add(q);
      continue;
    }
    // Gạch giới hạn trơn ở lề 0 (không thuộc khối nào): gạch con lồng là các giới hạn, không thì chính nó là một.
    const g = l.match(/^[-*]\s+(.*)$/);
    if (!g || !DAU.test(g[1])) continue;
    const con = []; let lec = null;
    for (let k = i + 1; k < L.length; k++) {
      const x = L[k]; if (!x.trim()) continue; if (/^\S/.test(x)) break;
      const cg = x.match(/^(\s+)(?:[-*]|\d+[.)])\s+(.*)$/);
      if (cg && (lec == null || cg[1].length <= lec)) { lec = cg[1].length; con.push(cg[2]); }
    }
    if (con.length) so += con.filter(x => !RONG(x)).length;
    else { const s2 = g[1].replace(/\*\*/g, '').replace(/^\s*(?:known[ -]limits?|giới hạn đã biết|hạn chế đã biết)[^:]*:\s*/i, '').trim(); if (!RONG(s2)) so += 1; }
  }
  return hong ? null : so;
}
// Khối đầu đoạn (không biên) kết sau chuỗi mục đầu tiên — vị trí dòng ngay sau nó (để không đọc lại mục).
function viTriHet(L, j) {
  let k = j; let thayD = false; let truocTrang = true;
  for (; k < L.length; k++) {
    const c = lop(L[k]);
    if (c.k === 'H') break;
    if (c.k === 'T') { truocTrang = true; continue; }
    if (c.k === 'M') { thayD = true; truocTrang = false; continue; }
    if ((c.k === 'C' || c.k === 'V') && thayD && !truocTrang) continue;
    if (thayD) break;
    truocTrang = false;
  }
  return k;
}
function demBaoCao(bc) {
  if (bc == null) return 0;
  const L = section(bc, 'Known limits'); const het = L.findIndex(l => /^#{2,6}\s+Re-pin\b/.test(l));
  const u = donVi(het < 0 ? L : L.slice(0, het), 0, () => false, false);
  return demThan(u, true);
}
// Vế giới hạn mà bộ đếm độc lập mong: nguồn nhiều mục hơn; một nguồn không đọc được → «chưa đọc được».
function veDocLap(dir) {
  const hd = doc(path.join(dir, 'contract.md')); const bc = doc(path.join(dir, 'evidence-report.md'));
  const n = demNotes(hd); const b = demBaoCao(bc);
  if (n == null || b == null) return { chuaDoc: true, nguon: [n == null && 'hợp đồng', b == null && 'báo cáo'].filter(Boolean).join(' và ') };
  return { so: Math.max(n, b) };
}

// ── dựng ──────────────────────────────────────────────────────────────────
const base = path.join(TMP, 'base'); const tien = path.join(TMP, 'tien');
try { giai(KIT, BASE_SHA, base, ['scripts', 'lib', 'skills']); giai(KIT, TIEN_SHA, tien, ['scripts', 'lib', 'skills']); }
catch (e) { bad('DD-7', `không dựng được bộ đọc base/tiền-trần từ kit: ${String(e.message).split('\n')[0]}`); ketThuc(); }
const moDun = kit => req(path.join(kit, 'scripts', 'ho-so-tom-tat.cjs'));
const HS = { cay: moDun(KIT), base: moDun(base), tien: moDun(tien) };

const args = process.argv.slice(2);
const hienTai = args.indexOf('--hien-tai');
function hoSoCua(acc) { return existsSync(acc) ? readdirSync(acc).sort().filter(s => { try { return statSync(path.join(acc, s)).isDirectory(); } catch (_) { return false; } }) : []; }

// Trang hồ sơ của một bộ vẽ → nội dung mục «Vì sao làm» (bộ đọc HTML độc lập, `</li>`/`</p>` thành khoảng trắng).
const boEsc = s => String(s).replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
function viSaoTrang(kit, root, slug) {
  const x = spawnSync(process.execPath, [path.join(kit, 'scripts', 'evidence-page.js'), '--root', root, '--slug', slug], { encoding: 'utf8', maxBuffer: 1 << 26 });
  if (x.status !== 0) return null;
  const h = doc(path.join(root, '_acceptance', slug, 'evidence-page.html')) || '';
  const m = h.match(/<details class="muc" id="vi-sao"><summary>[^<]*<\/summary><div class="noi">([\s\S]*?)<\/div><\/details>/);
  return m ? boEsc(m[1].replace(/<\/(li|p)>/g, ' ')) : null;
}
// So CHỨA trên chuỗi chỉ gồm chữ cái (bỏ số, dấu câu, dấu nhấn, dấu mở mục ở CẢ HAI phía) — không đoán đâu là dấu
// mở mục: một phép chuẩn hoá đoán «52.» cuối câu là mục đánh số đã làm thước kêu sai ở hai trang thật.
const kyTu = s => String(s).normalize('NFC').toLowerCase().replace(/[^\p{L}]/gu, '');
const chuan = s => String(s).replace(/\s+/g, ' ').trim();
const cauCuoi = s => { const c = chuan(s).split(/(?<=[.!?…])\s+/).filter(Boolean); return c[c.length - 1] || ''; };
// Mục cuối của danh sách theo sau câu dẫn, tách ĐỘC LẬP từ tệp nguồn: tìm câu dẫn, lấy dòng mục cuối liền sau.
function mucCuoi(dir, dan) {
  for (const tep of ['opportunity.md', 'contract.md']) {
    const t = doc(path.join(dir, tep)); if (!t) continue;
    const L = t.split('\n'); const duoi = kyTu(dan).slice(-25);
    const i = L.findIndex((l, k) => kyTu(L.slice(Math.max(0, k - 3), k + 1).join(' ')).endsWith(duoi));
    if (i < 0) continue;
    let k = i + 1; while (k < L.length && !L[k].trim()) k++;
    let cuoi = null;
    for (; k < L.length; k++) {
      const l = L[k]; if (!l.trim()) { let n = k + 1; while (n < L.length && !L[n].trim()) n++; if (n < L.length && /^\s*([-*]|\d+[.)])\s|^\s*\|/.test(L[n])) { k = n - 1; continue; } break; }
      if (/^\s*\|/.test(l)) { if (!/^[\s|:-]*$/.test(l)) cuoi = l.replace(/^\s*\|/, '').split('|')[0]; continue; }
      const m = l.match(/^\s*(?:[-*]|\d+[.)])\s+(.*)$/); if (m && !/^\s{2,}/.test(l)) { cuoi = m[1]; continue; }
      if (cuoi != null && /^\s/.test(l)) continue;
      break;
    }
    if (cuoi != null) return kyTu(cuoi).slice(0, 40);
  }
  return null;
}

const CD = 'chưa đọc được';
// Vế rút gọn để so với SOI: «N» · «N+» (có cờ nhắc sai khuôn) · «chưa đọc được».
const gon = v => (/chưa đọc được — khối giới hạn/.test(v) ? CD : /chưa đọc được — Notes/.test(v) ? 'nhắc' : (v.match(/^(\d+) giới hạn/) || [])[1] + (/Notes còn chỗ nhắc/.test(v) ? '+' : ''));

if (hienTai >= 0) {
  // ── Đường đo của ngưỡng nghiệm thu: cây hiện tại của một kho ───────────
  const [ten, root] = String(args[hienTai + 1] || '').split('=');
  if (!ten || !root || !existsSync(path.join(root, '_acceptance'))) { console.log(`--hien-tai <tên>=<gốc kho>: không thấy ${root}/_acceptance`); process.exit(2); }
  const acc = path.join(root, '_acceptance'); const so = { i: [], ii: [], iii: [], iv: [] };
  for (const slug of hoSoCua(acc)) {
    const d = path.join(acc, slug); if (!existsSync(path.join(d, 'contract.md'))) continue;
    const moi = veGH(HS.cay.tomTatHoSo(d).dai.moi_nguoi.chua_lam); const cu = veGH(HS.base.tomTatHoSo(d).dai.moi_nguoi.chua_lam); const dl = veDocLap(d);
    const g = gon(moi); const sm = g === 'nhắc' ? '0' : String(g).replace('+', ''); const gc = gon(cu); const sc = gc === 'nhắc' ? '0' : String(gc).replace('+', '');
    if (!dl.chuaDoc && sm !== String(dl.so)) so.i.push(`${slug} «${moi}» ≠ ${dl.so}`);
    if (dl.chuaDoc && !/chưa đọc được — khối giới hạn/.test(moi)) so.ii.push(`${slug} «${moi}»`);
    // Đổi so với base mà bộ đếm độc lập lại đồng ý với bản CŨ: đổi không giải thích được.
    if (moi !== cu && !dl.chuaDoc && sc === String(dl.so) && sm !== sc) so.iii.push(slug);
  }
  const tam = path.join(TMP, 'hien-tai'); cpSync(acc, path.join(tam, '_acceptance'), { recursive: true });
  for (const slug of hoSoCua(path.join(tam, '_acceptance'))) {
    const d = path.join(tam, '_acceptance', slug); let v; try { v = HS.cay.tomTatHoSo(d).dai.moi_nguoi.vi_sao; } catch (_) { continue; }
    if (!v || !v.endsWith('…') || !existsSync(path.join(d, 'evidence-report.md'))) continue;
    const ref = HS.tien.tomTatHoSo(d).dai.moi_nguoi.vi_sao; const tr = viSaoTrang(KIT, tam, slug);
    if (tr == null || !kyTu(tr).includes(kyTu(cauCuoi(ref)))) so.iv.push(slug);
  }
  console.log(`(i) số giới hạn ≠ bộ đếm độc lập: ${so.i.length}${so.i.length ? ` — ${so.i.slice(0, 5).join('; ')}` : ''}`);
  console.log(`(ii) khối nhiều nhóm mà ô không nói «chưa đọc được»: ${so.ii.length}${so.ii.length ? ` — ${so.ii.slice(0, 5).join('; ')}` : ''}`);
  console.log(`(iii) đổi ô so với base mà bộ dò không gán cơ chế: ${so.iii.length}`);
  console.log(`(iv) trang thiếu câu cuối của «Vì sao»: ${so.iv.length}${so.iv.length ? ` — ${so.iv.slice(0, 5).join('; ')}` : ''}`);
  rmSync(TMP, { recursive: true, force: true });
  process.exit(so.i.length + so.ii.length + so.iii.length + so.iv.length ? 1 : 0);
}

// ── bản chụp sáu kho ──────────────────────────────────────────────────────
const CHUP = path.join(TMP, 'chup');
for (const [ten, sha] of KHO) {
  try { giai(goc(ten), sha, path.join(CHUP, ten), ['_acceptance']); }
  catch (e) { bad('DD-7', `kho ${ten}: không dựng được bản chụp ${sha.slice(0, 8)} từ ${goc(ten)} — ${String(e.message).split('\n')[0]}`); }
}
if (fail) ketThuc();
const HO_SO = KHO.flatMap(([ten]) => hoSoCua(path.join(CHUP, ten, '_acceptance')).map(slug => ({ ten, slug, dir: path.join(CHUP, ten, '_acceptance', slug) })));

// Tập hồ sơ đổi ô viết sẵn (đo 12/10, do-truoc.md) — 91 hồ sơ.
const DOI = `
kit: card-text-fidelity cat-hinh-thuc codex-script-packaging cong-dang-co-cua cong-nguoi-doc-du-nguon design-pass-nac-khong-dong-bo do-tin-tram-phan-loai ghim-lai-noi-ra-o-khong-do gom-duc-ket-2-10-0 ho-so-nghi khoi-tim-loi-tra-phi-theo-vat lan-may-song-qua-bo-phan-loai loi-moi-cong-may-sinh measure-teeth-cleanup nen-cong-cu-gan-bang-lenh-con nen-cong-cu-lenh-shell release-2-10-0 release-2-14-0 release-2-15-0 release-2-16-0 release-2-17-0 release-2-18-0 release-2-18-1 release-2-18-2 release-2-18-3 release-2-18-4 release-2-18-5 release-2-19-0 release-2-20-0 release-2-6-0 release-2-7-0 release-2-9-0 start-bang-dieu-khien thuoc-co-cua thuoc-khai-mot-dang-do-mot-neo
crm: agent-builder-noi-tieng-viet auto-pr-thoi-do-o-ban-re bo-dung-khong-ket cai-dat-con-lai-noi-tieng-viet chan-lai-component-ra-man chu-mac-dinh-thu-vien-ngoai cua-so-tro-chuyen-noi-tieng-viet dieu-phoi-30-ngay-dau duong-proto-cho-design-pass hinh-cua-luoi khang-dinh-microsoft-co-rang lenh-chung-khong-an-cache-doi luoi-day-do-that man-xin-quyen-co-rang noi-zalo-cho-nguoi-moi quyen-luot-mang-theo tat-preview-agent-okr thuoc-cache-het-doi-tuong tiep-thi-tuyen-doi-tac toan-canh-okr tong-quan-va-khung-noi-tieng-viet
radar: bo-hinh-loi bon-vai-va-be-mat bon-vai-va-quyen do-dung-cai-da-hua doc-mang-v0 dot-0a-nhin-duoc duong-ghi-cham-sang duong-ghi-mot-luat-va-noi-ra hai-man-phai-noi-duoc loi-thoai-va-cam-nguon luoi-phai-thuc-su-do may-chu-va-lop-ngu-nghia mo-hinh-cam-duoc o1 quet-lop-phai-dem-duoc reui-khoa-cau-do reui-khoa-pro reui-setup thuoc-do-phai-in-nhan vo-bon-nhom xuong-du-lieu-mau
oneflow: cong-tu-canh-minh director-wire-shape hai-duong-chay-mot-venv kho-khoa-toan-ven mo-hoa-b01 o-do-chay-0-ca-van-xanh roadmap-drift-guard scan-scope-diagnostics scan-with-block-imports skill-system-v1
media-library: cua-nguon-thong-nhat duyet-tai-cho lai-lo-tai-cho tiktok-external-ref
`.trim().split('\n').flatMap(l => { const [ten, ds] = l.split(':'); return ds.trim().split(/\s+/).map(s => `${ten}/${s}`); });
// Hồ sơ đã SOI TAY (do-truoc.md): [kho/slug, vế cũ, vế mới].
const SOI = [
  ['kit/card-text-fidelity', '1', '6'], ['kit/codex-script-packaging', '1', '3'], ['kit/gom-duc-ket-2-10-0', '1', '8'],
  ['kit/do-tin-tram-phan-loai', '8+', '7'], ['kit/release-2-14-0', '9+', '8'], ['kit/release-2-15-0', '17', '12'],
  ['kit/release-2-20-0', '1', '7'], ['kit/cong-dang-co-cua', '1', '5'], ['kit/cat-hinh-thuc', '1', CD], ['kit/ho-so-nghi', '2', CD],
  ['kit/measure-teeth-cleanup', '1', CD], ['kit/start-bang-dieu-khien', '2+', CD], ['kit/cong-nguoi-doc-du-nguon', '2+', CD],
  ['crm/toan-canh-okr', '28', '14'], ['crm/chan-lai-component-ra-man', '7', '4'], ['crm/thuoc-cache-het-doi-tuong', '5', '3'],
  ['crm/tiep-thi-tuyen-doi-tac', '2+', '27'], ['crm/duong-proto-cho-design-pass', '1', '13'], ['crm/hinh-cua-luoi', '1', '6'],
  ['crm/auto-pr-thoi-do-o-ban-re', '63', CD], ['crm/tong-quan-va-khung-noi-tieng-viet', '26+', CD], ['crm/bo-dung-khong-ket', '8', CD],
  ['radar/vo-bon-nhom', '8', '4'], ['radar/doc-mang-v0', '32', CD], ['radar/may-chu-va-lop-ngu-nghia', '24', CD],
  ['oneflow/kho-khoa-toan-ven', '11', '7'], ['oneflow/o-do-chay-0-ca-van-xanh', '12', '7'], ['oneflow/roadmap-drift-guard', '4', CD],
  ['oneflow/mo-hoa-b01', '22', CD], ['oneflow/director-wire-shape', '9+', CD],
];
function soSau(kitCay) {
  const M = moDun(kitCay); const doi = []; const sai = []; let giong = 0; const nhom = { so: 0, cd: 0, co: 0 };
  for (const h of HO_SO) {
    if (!existsSync(path.join(h.dir, 'contract.md'))) continue;
    const cu = veGH(HS.base.tomTatHoSo(h.dir).dai.moi_nguoi.chua_lam); const moi = veGH(M.tomTatHoSo(h.dir).dai.moi_nguoi.chua_lam);
    const ma = `${h.ten}/${h.slug}`;
    if (cu === moi) { giong += 1; if (DOI.includes(ma)) sai.push(`${ma}: ô không đổi («${moi}») mà danh sách ghi sẵn nói có đổi`); continue; }
    doi.push(ma); if (!DOI.includes(ma)) sai.push(`${ma}: ô đổi «${cu}» → «${moi}» mà không có trong danh sách ghi sẵn`);
    const dl = veDocLap(h.dir); const gm = gon(moi); const soMoi = gm === 'nhắc' ? '0' : String(gm).replace('+', '');
    if (dl.chuaDoc) { nhom.cd += 1; if (moi !== `giới hạn đã biết: chưa đọc được — khối giới hạn ở ${dl.nguon} không theo khuôn`) sai.push(`${ma}: bộ dò độc lập thấy khối nhiều nhóm (${dl.nguon}) mà ô «${moi}»`); }
    else {
      if (soMoi !== String(dl.so)) sai.push(`${ma}: ô «${moi}» ≠ bộ đếm độc lập ${dl.so}`);
      const gc = gon(cu); if (/\+$/.test(gc) && !/\+$/.test(gm) && gc.replace('+', '') === soMoi) nhom.co += 1; else nhom.so += 1;
    }
  }
  for (const ma of DOI) if (!doi.includes(ma) && !sai.some(s => s.startsWith(ma))) sai.push(`${ma}: có trong danh sách ghi sẵn mà không thấy hồ sơ`);
  for (const [ma, , moiMong] of SOI) { const h = HO_SO.find(x => `${x.ten}/${x.slug}` === ma); const v = h && gon(veGH(M.tomTatHoSo(h.dir).dai.moi_nguoi.chua_lam)); if (v !== moiMong) sai.push(`${ma} (soi tay): «${v}» ≠ «${moiMong}»`); }
  return { doi, sai, giong, nhom };
}

try {
  const r = soSau(KIT);
  const theoKho = Object.fromEntries(KHO.map(([t]) => [t, r.doi.filter(m => m.startsWith(`${t}/`)).length]));
  console.log(`    · đổi theo kho: ${JSON.stringify(theoKho)} · giống từng ký tự: ${r.giong} · nhóm: ${r.nhom.so} đúng số · ${r.nhom.cd} chưa đọc được · ${r.nhom.co} chỉ bỏ cờ vàng`);
  const cd = SOI.filter(x => x[2] === CD).length;
  if (r.nhom.cd !== 15) r.sai.push(`nhóm «chưa đọc được» ${r.nhom.cd}, cần 15`);
  if (r.doi.length !== DOI.length) r.sai.push(`đổi ${r.doi.length} hồ sơ, danh sách ghi sẵn ${DOI.length}`);
  if (r.sai.length) bad('DD-7', r.sai.slice(0, 8).join(' ; ')); else ok('DD-7', `${r.doi.length} hồ sơ đổi == danh sách ghi sẵn; ${r.giong} hồ sơ khác giống từng ký tự; mọi đổi khớp bộ đếm/bộ dò độc lập; 15/15 nhiều nhóm nói «chưa đọc được»; ${SOI.length} hồ sơ soi tay đúng (${cd} chưa đọc được)`);
  const saiB = [];
  for (const [ma, cuMong] of SOI) { const h = HO_SO.find(x => `${x.ten}/${x.slug}` === ma); const v = h && gon(veGH(HS.base.tomTatHoSo(h.dir).dai.moi_nguoi.chua_lam)); if (v !== cuMong) saiB.push(`${ma} (base): «${v}» ≠ «${cuMong}»`); }
  if (saiB.length) bad('DD-7-base', saiB.slice(0, 6).join(' ; ')); else ok('DD-7-base', `bộ đọc base bd8163dc cho đúng ${SOI.length} giá trị cũ — phép đo phân biệt hai bản`);
  // Chiều đỏ: bản sao tách dòng tiếp thụt lề thành mục riêng.
  const bs = path.join(TMP, 'bs-tach'); for (const d of ['scripts', 'lib', 'skills']) cpSync(path.join(KIT, d), path.join(bs, d), { recursive: true });
  const p = path.join(bs, 'scripts', 'ho-so-tom-tat.cjs'); const s = readFileSync(p, 'utf8'); const cu = "    muc[muc.length - 1] += ' ' + l.trim(); da.add(j); j++;\n";
  if (s.split(cu).length !== 2) bad('DD-7-do', 'nhát tiêm không khớp đúng một lần');
  else {
    writeFileSync(p, s.replace(cu, "    if (thut(l) > le) { muc.push(l.trim()); da.add(j); j++; continue; }\n" + cu));
    const rd = soSau(bs); const g = rd.sai.find(x => /≠ bộ đếm độc lập|không có trong danh sách/.test(x));
    if (g) ok('DD-7-do', `bản sao tách dòng tiếp thành mục: phép so trả «${g.slice(0, 120)}»`); else bad('DD-7-do', `không bắt: ${JSON.stringify(rd.sai.slice(0, 3))}`);
  }
} catch (e) { bad('DD-7', loi(e)); }

// ── DD-9: «Vì sao làm» trên dữ liệu thật ───────────────────────────────────
function soTrang(kitVe, chi) {
  const sai = []; let co = 0; let soSanh = 0;
  for (const h of chi) {
    const ref = HS.tien.tomTatHoSo(h.dir).dai.moi_nguoi.vi_sao; if (!ref) continue;
    const root = path.join(CHUP, h.ten); const tr = viSaoTrang(kitVe, root, h.slug); if (tr == null) { sai.push(`${h.ten}/${h.slug}: trang không vẽ được`); continue; }
    co += 1; const t = kyTu(tr); const c = cauCuoi(ref);
    if (!t.includes(kyTu(c))) { sai.push(`${h.ten}/${h.slug}: trang thiếu câu cuối «${c.slice(0, 50)}» (dài hơn 400 vẫn chưa đủ)`); continue; }
    if (/:$/.test(chuan(ref))) { soSanh += 1; const mc = mucCuoi(h.dir, ref); if (mc && !t.includes(mc)) sai.push(`${h.ten}/${h.slug}: trang thiếu mục cuối «${mc}» sau câu dẫn`); }
  }
  return { sai, co, soSanh };
}
try {
  let lech = 0; const coTran = [];
  for (const h of HO_SO) {
    let a, b; try { a = HS.cay.tomTatHoSo(h.dir).dai.moi_nguoi.vi_sao; b = HS.base.tomTatHoSo(h.dir).dai.moi_nguoi.vi_sao; } catch (_) { continue; }
    if (a !== b) lech += 1;
    if (a && a.endsWith('…') && existsSync(path.join(h.dir, 'evidence-report.md'))) coTran.push(h);
  }
  const vsCoTran = HO_SO.filter(h => { try { const v = HS.cay.tomTatHoSo(h.dir).dai.moi_nguoi.vi_sao; return v && v.endsWith('…'); } catch (_) { return false; } }).length;
  const r = soTrang(KIT, coTran);
  console.log(`    · ô vi_sao có trần: ${vsCoTran} hồ sơ (${coTran.length} có báo cáo nên có trang) · trang so câu cuối: ${r.co} · câu dẫn so mục cuối: ${r.soSanh}`);
  const sai = [...r.sai];
  if (lech) sai.push(`${lech} hồ sơ ô vi_sao của dải khác base`);
  if (vsCoTran < 301) sai.push(`chỉ ${vsCoTran} hồ sơ có ô vi_sao kết «…», cần ≥ 301`);
  // Khuôn khối: bản chụp crm kèm tệp lộ trình, vẽ bằng hai bản.
  const crm = path.join(TMP, 'crm-ve'); giai(goc('crm'), KHO[1][1], crm, ['_acceptance', 'docs/plan']);
  const { docDuLieu } = await import(pathToFileURL(path.join(KIT, 'scripts', 'lo-trinh.mjs')).href);
  const khuon = kit => {
    const x = spawnSync(process.execPath, [path.join(kit, 'scripts', 'product-map.mjs'), '--root', crm], { encoding: 'utf8', maxBuffer: 1 << 28 });
    if (x.status !== 0) throw new Error(`product-map exit ${x.status}: ${x.stderr.slice(0, 160)}`);
    const html = readFileSync(path.join(crm, 'LO-TRINH.html'), 'utf8'); const raw = JSON.parse(html.match(/<script type="application\/json" id="lo-trinh-du-lieu">([\s\S]*?)<\/script>/)[1]);
    if (!docDuLieu(html).duLieu) throw new Error('docDuLieu không đọc được khối');
    const k = new Set(); for (const t of raw.lo_trinh) for (const hh of t.hang) if (hh.tom_tat) for (const nh of ['moi_nguoi', 'chu_kho']) for (const [o, v] of Object.entries(hh.tom_tat[nh] || {})) k.add(`${nh}.${o}:${v === null ? 'null' : typeof v}`);
    return JSON.stringify({ phien_ban: raw.phien_ban, khoa: [...k].sort() });
  };
  const kc = khuon(KIT); const kb = khuon(base);
  if (kc !== kb) sai.push(`khuôn khối crm khác: ${kc.slice(0, 120)} ≠ ${kb.slice(0, 120)}`);
  if (sai.length) bad('DD-9', sai.slice(0, 6).join(' ; ')); else ok('DD-9', `ô vi_sao của dải giống base ở mọi hồ sơ; ${r.co} trang chứa câu cuối của đoạn trước-trần, ${r.soSanh} câu dẫn đủ mục cuối; khuôn khối crm bằng nhau`);
  // Chiều đỏ 1: trang của bộ đọc base (mục gập in ô có trần).
  const rb = soTrang(base, coTran); const g1 = rb.sai.find(x => x.includes('câu cuối'));
  if (g1) ok('DD-9-do', `trang của base bd8163dc: phép so trả «${g1.slice(0, 110)}»`); else bad('DD-9-do', `không bắt: ${JSON.stringify(rb.sai.slice(0, 2))}`);
  // Chiều đỏ 2: trần thứ hai lớn hơn mọi ca DD-8 (đoạn dài nhất của ca DD-8 là 754 ký tự).
  const TRAN2 = 800; const dai = coTran.filter(h => { const v = HS.cay.tomTatHoSo(h.dir).chiTiet.viSao; return v && v.doan.length > TRAN2; });
  const bs = path.join(TMP, 'bs-tran2'); for (const d of ['scripts', 'lib', 'skills']) cpSync(path.join(KIT, d), path.join(bs, d), { recursive: true });
  const p = path.join(bs, 'scripts', 'evidence-page.js'); const s = readFileSync(p, 'utf8'); const cu = '<p>${esc(CT.viSao.doan)}</p>';
  if (s.split(cu).length !== 2) bad('DD-9-do-tran2', 'nhát tiêm không khớp đúng một lần');
  else if (!dai.length) bad('DD-9-do-tran2', `không hồ sơ thật nào có đoạn lý do dài hơn ${TRAN2} — chiều đỏ không có ca`);
  else {
    writeFileSync(p, s.replace(cu, `<p>\${esc(CT.viSao.doan.length > ${TRAN2} ? CT.viSao.doan.slice(0, CT.viSao.doan.lastIndexOf('. ', ${TRAN2}) + 1) : CT.viSao.doan)}</p>`));
    const r2 = soTrang(bs, dai); const g2 = r2.sai.find(x => x.includes('câu cuối'));
    if (g2) ok('DD-9-do-tran2', `${dai.length} hồ sơ thật có đoạn lý do dài hơn ${TRAN2}; bản sao cắt ở ${TRAN2}: phép so trả «${g2.slice(0, 100)}»`); else bad('DD-9-do-tran2', `không bắt: ${JSON.stringify(r2.sai.slice(0, 2))}`);
  }
} catch (e) { bad('DD-9', loi(e)); }
ketThuc();
