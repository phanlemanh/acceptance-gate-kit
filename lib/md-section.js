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
const SECTION_BOUNDARY = { Findings: 'any-heading', default: 'same-or-higher' };

function boundaryFor(heading) {
  return SECTION_BOUNDARY[heading] || SECTION_BOUNDARY.default;
}

// Các dòng nằm dưới heading `## <h>` (h2..h6), cắt theo luật của chính section đó.
function section(t, h) {
  const rule = boundaryFor(h);
  const out = [];
  let inS = false, lvl = 0;
  const re = new RegExp('^#{2,6}\\s+' + h + '\\b', 'i');
  for (const l of String(t == null ? '' : t).split('\n')) {
    const m = l.match(/^(#{1,6})\s/);
    if (m) {
      if (re.test(l)) { inS = true; lvl = m[1].length; continue; }
      if (inS && (rule === 'any-heading' || m[1].length <= lvl)) { inS = false; continue; }
    }
    if (inS) out.push(l);
  }
  return out;
}

module.exports = { SECTION_BOUNDARY, boundaryFor, section };
