'use strict';
// Đọc mục «## Trong hợp đồng» của review-findings.md cho thẻ Cổng Bằng chứng và trang bằng chứng.
//
// Vì sao có tệp này: lượt chấm chỉ tự trả lại khi lỗi trong hợp đồng ở mức nặng. Lỗi mức vừa để phán quyết là PASS và
// chỉ nằm ở mục này, mà trước đây không bề mặt nào đọc nó, nên thẻ ghi «máy đã xong — ký nhanh» trong khi người ký không
// thấy lỗi (_acceptance/do-tuong-phan-lab-oklab lượt chấm 2, lỗi AC-10). Cùng luật với mục ngoài hợp đồng: cái gì phải
// hiện trên thẻ thì script đọc từ vật, không qua khoá overlay do mô hình điền.
//
// Không sống ở lib/ (t3_paths): chỉ hai bề mặt trình bày dùng, không phán quyết gì.
//
// Khuôn bên VIẾT là IC-ITEM-TEMPLATE của feature-loop/workflows/acceptance-verify.js; ca TL-9 cho khuôn đó đi qua
// đúng bộ đọc này. Mục do bản kit trước viết không có dòng «Người dùng thấy gì» — vẫn đọc được, xem cauNguoiDoc.

const HEAD_IN = /^##\s+Trong hợp đồng/;
const HEAD_ANY = /^##\s+/;
// Nhận cả `- **t**` lẫn `- **t** (r1)`: bộ đọc mục ngoài hợp đồng từng giấu 14/15 mục vì chỉ nhận một dạng.
const MUC_RE = /^[-*]\s+\*\*(.+?)\*\*(?:\s+\(.*\))?\s*$/;
const TRUONG_RE = /^\s+(Người dùng thấy gì|file|severity|AC|detail)\s*:\s*(.*?)\s*$/;
// Mục có chữ mà đọc ra 0 lỗi: hỏi hình dạng của một mục ĐỊNH viết (in đậm, gạch đầu dòng, dòng khoá thụt lề), không
// liệt kê các câu «không có» — danh sách trắng trên không gian mở đã thủng ở bộ đọc ngoài hợp đồng.
const TRIED_RE = /\*\*|^[-*]\s|^\s+\S[^:]*:\s*\S/;

function sectionLines(lines) {
  const start = lines.findIndex(l => HEAD_IN.test(l));
  if (start < 0) return null;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex(l => HEAD_ANY.test(l));
  return end < 0 ? rest : rest.slice(0, end);
}

// text = nội dung review-findings.md (rỗng khi thiếu tệp).
// → { findings: [{ title, plain, file, severity, ac, detail }], suspect_empty }
// suspect_empty: mục có dấu hiệu lỗi mà máy không đọc được trọn — bề mặt phải kêu, không được coi là «không có lỗi».
function parse(text) {
  const rong = { findings: [], suspect_empty: false };
  if (typeof text !== 'string' || !text.trim()) return rong;
  const lines = sectionLines(text.split(/\r?\n/));
  if (!lines) return rong;
  const findings = [];
  let cur = null, lacKhuon = false;
  for (const raw of lines) {
    const m = MUC_RE.exec(raw);
    if (m) {
      cur = { title: m[1], plain: '', file: '', severity: '', ac: '', detail: '' };
      findings.push(cur);
      continue;
    }
    if (/^[-*]\s/.test(raw)) { lacKhuon = true; continue; }
    if (!cur) continue;
    const kv = TRUONG_RE.exec(raw);
    if (!kv) continue;
    const v = kv[2].replace(/^`|`$/g, '').trim();
    const khoa = { 'Người dùng thấy gì': 'plain', file: 'file', severity: 'severity', AC: 'ac', detail: 'detail' }[kv[1]];
    cur[khoa] = v;
  }
  return { findings, suspect_empty: lacKhuon || (findings.length === 0 && lines.some(l => TRIED_RE.test(l))) };
}

const MUC_DO = { critical: 'nặng', high: 'nặng', medium: 'vừa', low: 'nhẹ' };
const mucDo = s => MUC_DO[String(s || '').toLowerCase()] || (s ? String(s) : 'chưa rõ');

// Câu người ký đọc. Tiêu đề và chi tiết là văn kỹ thuật, không bao giờ lấp chỗ trống ở đây: hồ sơ cũ không có câu
// tiếng sản phẩm thì in chính lời tiêu chí người đã duyệt ở Cổng Phạm vi.
const THIEU_MO_TA = 'chưa có mô tả cho người đọc';
function cauNguoiDoc(f, critText) {
  if (f.plain) return f.plain;
  const tieuChi = critText && f.ac ? critText[f.ac] : '';
  return tieuChi ? `(${THIEU_MO_TA}) Tiêu chí bị chạm: «${tieuChi}»` : `(${THIEU_MO_TA} — xem chi tiết ở trang bằng chứng)`;
}

const nhan = i => `Trong-${i + 1}`;
const dauDong = (f, i) => `${nhan(i)} · mức ${mucDo(f.severity)}${f.ac ? ' · tiêu chí ' + f.ac : ''}`;
const conLoi = x => x.findings.length > 0 || x.suspect_empty;
const TIEU_DE = n => `Lỗi trong hợp đồng còn mở (${n})`;
const HE_QUA = 'Máy chưa sửa các lỗi này. Ký là chấp nhận giao kèm chúng; trả lại thì máy sửa rồi chấm lại.';
const MSG_SUSPECT = 'mục «Trong hợp đồng» có dấu hiệu lỗi mà máy không đọc ra đủ — sai khuôn, có thể còn lỗi chưa hiện ở đây; soi review-findings.md trước khi ký';

module.exports = { parse, cauNguoiDoc, mucDo, nhan, dauDong, conLoi, TIEU_DE, HE_QUA, MSG_SUSPECT };
