'use strict';
// Ranh giới section markdown — luật PER-SECTION, khai MỘT chỗ: bảng dưới đây.
//
// Vì sao KHÔNG một-luật-duy-nhất (cả hai chiều đều có lỗi đã xảy ra thật):
//   • section BẢNG (`Findings`) mà giữ sub-heading làm content → bảng nằm dưới
//     `### Notes` lọt vào, sinh finding/claim MA có id citable (S4 round 1 của
//     claim-scan-parser-hardening; thẻ Cổng 1 hiện lỗi không tồn tại).
//   • section VĂN XUÔI (`Criteria`) mà dừng ở MỌI heading → mọi AC sau
//     `### nhóm phụ` rơi khỏi thẻ → human duyệt trên thẻ cụt (false-green).
//
// <<<SECTION-BOUNDARY-TABLE
//   Findings -> any-heading
//   default -> same-or-higher
// SECTION-BOUNDARY-TABLE>>>
// Bảng trên LÀ nguồn runtime: parse chính văn bản file này, không chép tay
// xuống hằng số — nếu chép tay, bảng thành comment trang trí và "single-source"
// là giả (sửa bảng không đổi hành vi). Gap-probe S1 xếp lỗ đó P0.
const fs = require('fs');
const BOUNDARY_TABLE_RE = /<<<SECTION-BOUNDARY-TABLE\n([\s\S]*?)SECTION-BOUNDARY-TABLE>>>/;

function parseBoundaryTable(src) {
  const m = BOUNDARY_TABLE_RE.exec(src);
  if (!m) throw new Error('KHONG rut duoc bang SECTION-BOUNDARY-TABLE');
  const out = {};
  for (const l of m[1].split('\n')) {
    const mm = l.match(/^\s*\/\/\s*([A-Za-z ]+?)\s*->\s*(any-heading|same-or-higher)\s*$/);
    if (mm) out[mm[1].trim()] = mm[2];
  }
  if (!out.default) throw new Error('KHONG rut duoc bang SECTION-BOUNDARY-TABLE: thieu dong default');
  return out;
}

const SECTION_BOUNDARY = parseBoundaryTable(fs.readFileSync(__filename, 'utf8'));

function boundaryFor(heading) {
  return SECTION_BOUNDARY[heading] || SECTION_BOUNDARY.default;
}

// Các dòng nằm dưới heading `## <h>` (h2..h6), cắt theo luật của chính section đó.
// sectionLines: như section() nhưng giữ SỐ DÒNG (1-based). Ai cần chỉ ra "dòng
// nào" — vd bộ dò mù criterion của lib/ac-line.cjs phải liệt số dòng bỏ sót cho
// người duyệt — phải đi qua đây, KHÔNG tự duyệt lại: luật ranh giới per-section
// nằm ở bảng marker trên đầu file này, hai bản duyệt sẽ trôi khỏi nhau.
function sectionLines(t, h) {
  const rule = boundaryFor(h);
  const out = [];
  let inS = false, lvl = 0;
  const re = new RegExp('^#{2,6}\\s+' + h + '\\b', 'i');
  String(t == null ? '' : t).split('\n').forEach((l, i) => {
    const m = l.match(/^(#{1,6})\s/);
    if (m) {
      const lv = m[1].length;
      if (re.test(l)) { inS = true; lvl = lv; return; }
      if (inS) {
        // any-heading: MỌI heading (kể cả h1) đóng section — chặn bảng ma.
        // same-or-higher: chỉ h2..h6 mới là ranh giới; dòng `# guidance` là
        // CONTENT (template evidence-report đặt `# Non-discriminating evals:`
        // ngay dưới ## Analyst / ## Variance — coi nó là boundary sẽ nuốt mất
        // hai cờ đỏ Gate 2, đúng lớp false-green mà feature này đi đóng).
        if (rule === 'any-heading') { inS = false; return; }
        if (lv >= 2 && lv <= lvl) { inS = false; return; }
      }
    }
    if (inS) out.push({ no: i + 1, l });
  });
  return out;
}

// section() giữ NGUYÊN chữ ký cũ (mảng nội dung dòng) — mọi call site hiện có
// không phải đổi. Nó là một lớp mỏng trên sectionLines: MỘT phép duyệt duy nhất.
function section(t, h) { return sectionLines(t, h).map(x => x.l); }

// Dòng của một mục MANG CHỮ cho người đọc (hồ sơ cong-nguoi-doc-du-nguon).
// Gạch đầu dòng được ưu tiên; CHỈ khi mục không có gạch nào mới lấy dòng thường,
// và bỏ hàng phân cách của bảng vì nó không mang chữ. Ô khuôn `{{…}}` chưa điền
// không phải nội dung.
//
// VÌ SAO ở đây chứ không nội tuyến trong thẻ: 29 trên 244 hợp đồng có mục Coverage
// viết bằng BẢNG hoặc văn xuôi từng bị thẻ đọc ra rỗng rồi nổi cờ «chưa có section
// Coverage» trên một mục CÓ THẬT. Nếu luật này sống trong thẻ thì phép đo bán kính
// phải cài lại nó, và khi đó phép đo cho CÙNG một số trên mọi lớp — tức đo VĂN.
function contentLines(lines) {
  // Nhánh GẠCH ĐẦU DÒNG giữ NGUYÊN hành vi đã có: dòng bọc 80 cột được NỐI vào
  // gạch đang mở, dòng trắng đóng gạch, prose trước gạch đầu tiên bị bỏ. Lọc theo
  // TỪNG DÒNG sẽ cắt cụt câu giữa chừng — lớp lỗi findings 05/08, ca P146 canh.
  const raws = (lines || []).map(l => String(l == null ? '' : l));
  const gach = [];
  let mo = false;
  for (const l of raws) {
    if (/^\s*-\s+\S/.test(l)) { gach.push(l.trim().replace(/^-\s+/, '')); mo = true; }
    else if (!l.trim()) mo = false;
    else if (mo && !/^\s*#{1,6}\s/.test(l)) gach[gach.length - 1] += ' ' + l.trim();
  }
  const coGach = gach.filter(l => !/\{\{/.test(l));
  if (coGach.length) return coGach;
  // Không gạch nào: mục viết bằng BẢNG hoặc văn xuôi. Bỏ hàng phân cách của bảng
  // vì nó không mang chữ cho người đọc.
  return raws.filter(l => l.trim() && !/\{\{/.test(l) && !/^\s*\|?\s*:?-{2,}/.test(l));
}

module.exports = { SECTION_BOUNDARY, BOUNDARY_TABLE_RE, parseBoundaryTable, boundaryFor, section, sectionLines, contentLines };
