// chup-ho-so-da-thong.mjs — chụp cây `_acceptance/<slug>/` của mọi hồ sơ ĐÃ THÔNG
// Cổng Bằng chứng, để một làn chạy executor biết nó có chạm sử liệu đã thông cổng không.
//
// Vì sao tồn tại (crm-onehub, 16/09/2026): `evidence/ve-that.json` của một hồ sơ
// đã ký bị ghi đè sau MỖI lượt chạy phép đo — mất ~450 dòng so với bản đã
// ký, ở mọi worktree — vì script đo ghi tạo phẩm thẳng vào `evidence/` của hồ sơ
// và spec đó nằm trong suite của mọi vòng. Không răng nào của kit thấy: làn ghim
// lại chỉ đòi cây SẠCH NGOÀI `_acceptance/`, recheck chỉ đọc báo cáo. Luật (mục
// «Where a run writes its artifacts» trong skills/acceptance/references/eval-executors.md): sau
// khi thông Cổng Bằng chứng, `_acceptance/<slug>/**` là sử liệu chỉ đọc với mọi
// lượt chạy lại; cập nhật nó là một bước có dòng quyết định, không là tác dụng phụ.
//
// Chụp = băm nội dung + mtime + cỡ của từng tệp (symlink: băm đích trỏ, không đi
// theo). mtime đứng cạnh băm có chủ đích: một executor ghi lại ĐÚNG byte cũ vẫn là
// một executor ghi vào hồ sơ đã thông cổng — hôm nay trùng byte là may, không phải luật.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

// Hai trạng thái «đã thông Cổng Bằng chứng» KHÔNG viết ở đây. Nguồn duy nhất là
// DA_THONG_CONG_2 của lib/workspace-record.cjs (gói acceptance-gate); tệp này thuộc
// gói feature-loop nên không nạp thẳng — làn ghim lại nạp bộ máy qua bảng AG-ENGINE
// rồi TRUYỀN mảng vào, cùng khuôn với frontmatterField. Chép mảng ra đây là hai bản
// phải giữ đồng bộ (owner veto 17/09, sổ ra-co-ten-lam-va-trao); thiếu mảng thì
// hàm dừng có tên, không lặng lẽ chụp 0 hồ sơ rồi báo «0 tệp bị chạm».
//
// frontmatterField: hàm đọc frontmatter của bộ máy (lib/evidence-core.cjs) — làn
// truyền vào để bên đọc status là MỘT, không viết bộ đọc YAML thứ hai ở đây.
export function hoSoDaThong(root, frontmatterField, daThongCong2) {
  if (!Array.isArray(daThongCong2) || daThongCong2.length === 0)
    throw new Error('hoSoDaThong: thiếu mảng trạng thái đã thông cổng — làn phải truyền DA_THONG_CONG_2 của lib/workspace-record.cjs, không chép');
  const acc = path.join(root, '_acceptance');
  let names;
  try { names = fs.readdirSync(acc, { withFileTypes: true }); } catch { return []; }
  const out = [];
  for (const d of names) {
    if (!d.isDirectory()) continue;
    let txt;
    try { txt = fs.readFileSync(path.join(acc, d.name, 'contract.md'), 'utf8'); } catch { continue; }
    const st = String(frontmatterField(txt, 'status') || '').trim().toLowerCase();
    if (daThongCong2.includes(st)) out.push(d.name);
  }
  return out.sort();
}

function dauVet(abs, st) {
  const h = createHash('sha256');
  h.update(st.isSymbolicLink() ? `symlink:${fs.readlinkSync(abs)}` : fs.readFileSync(abs));
  return `${h.digest('hex')} ${st.mtimeMs} ${st.size}`;
}

// Trả Map<đường dẫn tương đối gốc kho, dấu vết>. Đọc hỏng một tệp → dấu vết mang
// lỗi (không bỏ tệp): một tệp biến mất khỏi ảnh chụp phải hiện thành «xoá», không
// được lặng thành «không có gì để so».
export function chup(root, slugs) {
  const snap = new Map();
  const walk = (abs, rel) => {
    let entries;
    try { entries = fs.readdirSync(abs, { withFileTypes: true }); } catch (e) { snap.set(rel + '/', `loi-doc-thu-muc ${e.code || e.message}`); return; }
    for (const e of entries) {
      const a = path.join(abs, e.name);
      const r = `${rel}/${e.name}`;
      if (e.isDirectory()) { walk(a, r); continue; }
      try { snap.set(r, dauVet(a, fs.lstatSync(a))); } catch (err) { snap.set(r, `loi-doc ${err.code || err.message}`); }
    }
  };
  for (const s of slugs) walk(path.join(root, '_acceptance', s), `_acceptance/${s}`);
  return snap;
}

// So hai ảnh chụp. Trả [{ tep, doi }] sắp theo đường dẫn; doi ∈
// 'đổi nội dung' | 'ghi lại, cùng nội dung' | 'thêm' | 'xoá'.
export function soChup(truoc, sau) {
  const out = [];
  for (const [tep, v] of truoc) {
    if (!sau.has(tep)) { out.push({ tep, doi: 'xoá' }); continue; }
    const w = sau.get(tep);
    if (w === v) continue;
    out.push({ tep, doi: v.split(' ')[0] === w.split(' ')[0] ? 'ghi lại, cùng nội dung' : 'đổi nội dung' });
  }
  for (const tep of sau.keys()) if (!truoc.has(tep)) out.push({ tep, doi: 'thêm' });
  return out.sort((a, b) => (a.tep < b.tep ? -1 : a.tep > b.tep ? 1 : 0));
}

// ── Thước CHỈ-ĐỌC trong lượt chấm (nhan-trang-thai-va-reality AC-3, Đ1) ─────────
// Phanh thay cho trần nhát: thước của hồ sơ đang chấm không được đổi NỘI DUNG giữa
// lúc sinh args và lúc lượt chấm xong. Tập thước = `_acceptance/config.yaml` ·
// `_acceptance/<slug>/evals.yaml` · mọi tệp dưới `_acceptance/<slug>/rang/` · mọi tệp
// git đang theo dõi khớp mẫu test của kho (`doRes`, từ DO_GLOBS của lib/phan-loai.mjs —
// bên gọi truyền vào, không chép mẫu ở đây). Chỉ BĂM NỘI DUNG, không mtime: bộ chạy
// test có quyền chạm mtime, không có quyền đổi byte của thước. Tệp vắng thì bỏ — vắng
// trước, có sau là «thêm».
export function chupThuoc(root, slug, doRes) {
  if (!Array.isArray(doRes)) throw new Error('chupThuoc: thiếu mẫu test kho (doRes) — bên gọi truyền DO_GLOBS đã biên dịch');
  const tep = new Set();
  const co = rel => fs.existsSync(path.join(root, rel));
  if (co('_acceptance/config.yaml')) tep.add('_acceptance/config.yaml');
  if (co(`_acceptance/${slug}/evals.yaml`)) tep.add(`_acceptance/${slug}/evals.yaml`);
  const walk = (abs, rel) => {
    let es; try { es = fs.readdirSync(abs, { withFileTypes: true }); } catch { return; }
    for (const e of es) { if (e.isDirectory()) walk(path.join(abs, e.name), `${rel}/${e.name}`); else tep.add(`${rel}/${e.name}`); }
  };
  walk(path.join(root, '_acceptance', slug, 'rang'), `_acceptance/${slug}/rang`);
  const ls = execFileSync('git', ['-C', root, 'ls-files', '-z'], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  for (const f of ls.split('\0')) if (f && doRes.some(re => re.test(f))) tep.add(f);
  const out = {};
  for (const rel of [...tep].sort()) {
    const abs = path.join(root, rel);
    let h;
    try { const st = fs.lstatSync(abs); h = createHash('sha256').update(st.isSymbolicLink() ? `symlink:${fs.readlinkSync(abs)}` : fs.readFileSync(abs)).digest('hex'); }
    catch (e) { h = `vang ${e.code || e.message}`; }
    if (!h.startsWith('vang ENOENT')) out[rel] = h;
  }
  return out;
}

// So hai ảnh chụp thước (object {rel: băm}). Trả [{ tep, doi }] sắp theo đường;
// doi ∈ 'đổi nội dung' | 'thêm' | 'xoá'. Cùng băm = không đổi, dù mtime đổi.
export function soThuoc(truoc, sau) {
  const out = [];
  for (const [tep, h] of Object.entries(truoc)) {
    if (!(tep in sau)) out.push({ tep, doi: 'xoá' });
    else if (sau[tep] !== h) out.push({ tep, doi: 'đổi nội dung' });
  }
  for (const tep of Object.keys(sau)) if (!(tep in truoc)) out.push({ tep, doi: 'thêm' });
  return out.sort((a, b) => (a.tep < b.tep ? -1 : a.tep > b.tep ? 1 : 0));
}
