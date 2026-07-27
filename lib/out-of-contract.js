'use strict';
// Đọc kết quả scope-triage từ `review-findings.md` cho thẻ Cổng 2.
//
// Vì sao ở đây chứ không phải một key trong card-plain.json: thẻ chỉ render
// những gì SCRIPT đọc được từ artifact — cùng luật với gap-probe. Một key overlay
// do model tự điền là thứ có thể quên, điền sai, hoặc (như round 1 của chính
// feature này) được khai trong chỉ dẫn mà không renderer nào đọc, nên khối biến
// mất im lặng trong khi manifest vẫn quảng cáo là có.
//
// Nguồn: `_acceptance/<slug>/review-findings.md` do S4 sinh. Thiếu file, hoặc
// file thế hệ cũ không có heading nào → mọi trường rỗng: thẻ render như trước,
// không cờ, không lỗi.

const HEAD_OUT = /^##\s+Ngoài hợp đồng/;
const HEAD_UNCLASSIFIED = /^##\s+Chưa phân loại/;
const HEAD_ANY = /^##\s+/;
// Dòng cờ cụm do S4 ghi nguyên văn; ⚠ ở đầu là dấu phân biệt với dòng "n-a".
const CLUSTER_RE = /^⚠\s*Cụm ngoài vùng phủ:\s*(.+)$/;

// Mỗi finding mở đầu bằng `- **<title>**`; các dòng `key: value` thụt vào sau đó
// thuộc về nó. Chỉ rút những trường thẻ cần — detail dài thuộc về gói text, không
// thuộc về thẻ quyết định.
function parseFindings(lines) {
  const out = [];
  let cur = null;
  for (const raw of lines) {
    const title = /^-\s+\*\*(.+?)\*\*\s*$/.exec(raw);
    if (title) {
      if (cur) out.push(cur);
      cur = { title: title[1], file: '', severity: '', proposal: '' };
      continue;
    }
    if (!cur) continue;
    const kv = /^\s+(file|severity|Đề xuất|proposal)\s*:\s*(.+?)\s*$/.exec(raw);
    if (!kv) continue;
    const k = kv[1];
    const v = kv[2].replace(/^`|`$/g, '');
    if (k === 'file') cur.file = v;
    else if (k === 'severity') cur.severity = v;
    else cur.proposal = v;
  }
  if (cur) out.push(cur);
  return out;
}

function sectionLines(lines, headRe) {
  const start = lines.findIndex(l => headRe.test(l));
  if (start < 0) return null;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex(l => HEAD_ANY.test(l));
  return end < 0 ? rest : rest.slice(0, end);
}

// text = nội dung review-findings.md (chuỗi rỗng khi thiếu file).
// → { present, findings: [{title,file,severity,proposal}], unclassified: bool, cluster: string|null }
function parse(text) {
  if (typeof text !== 'string' || !text.trim()) {
    return { present: false, findings: [], unclassified: false, cluster: null };
  }
  const lines = text.split(/\r?\n/);
  const outLines = sectionLines(lines, HEAD_OUT);
  const unclassified = lines.some(l => HEAD_UNCLASSIFIED.test(l));
  const clusterLine = lines.map(l => CLUSTER_RE.exec(l.trim())).find(Boolean);
  return {
    // present = file có mặt VÀ có ít nhất một heading của scope-triage. File thế
    // hệ cũ (chỉ liệt kê findings phẳng) cho false → nhánh backward.
    present: outLines !== null || unclassified,
    findings: outLines ? parseFindings(outLines) : [],
    unclassified,
    cluster: clusterLine ? clusterLine[1].trim() : null,
  };
}

module.exports = { parse };
