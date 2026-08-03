// workspace-record.js — LUẬT DUY NHẤT trả lời "hồ sơ của slug này có hỏng
// không", dùng chung bởi MỌI bên đọc `_acceptance/<slug>/`.
//
// Vì sao một chỗ: bản đồ sản phẩm và bộ quét vào phiên là hai READER của cùng
// một bộ hồ sơ. Ở round 1 của S4 chúng đã trôi khỏi nhau ngay lần đầu ra mắt —
// cùng một `uat-session.md` mất frontmatter, bộ quét gọi là hỏng còn bản đồ
// xếp vào "Đã ship — chờ phiên nghiệm thu". Hai kết luận trái nhau về cùng
// một sự thật là false-green đúng nghĩa, và vá riêng từng bên chỉ dời chỗ
// trôi. Ai thêm bên đọc thứ ba thì gọi hàm này, đừng chép luật.
const { frontmatterField } = require('./evidence-core.js');

// Enum của các field ĐIỀU HƯỚNG — thứ quyết định slug nằm ô nào.
const NAV_ENUMS = {
  status: ['draft', 'approved', 'implemented', 'verified', 'signed-off'],
  stage: ['discovery', 'decided', 'archived'],
  decision: ['build', 'iterate', 'park', 'kill'],
  verdict: ['release', 'iterate', 'kill'],
};

// File CÓ MẶT thì field này phải ĐỌC ĐƯỢC: null = frontmatter hỏng hoặc thiếu
// hẳn key, và cả hai đều là hồ sơ hỏng — không phải "chưa tới lúc điền".
const REQUIRED_BY_FILE = {
  'contract.md': ['status'],
  'opportunity.md': ['stage'],
  'uat-session.md': ['verdict'],
};

// Hai field cố ý để TRỐNG cho tới lúc người ký. Rỗng ở đây là trạng thái hợp
// lệ; rỗng ở `status`/`stage` là hồ sơ hỏng, không phải khoảng trống vô hại.
const ALLOW_EMPTY = new Set(['decision', 'verdict']);

// Mọi cặp (file, field) điều hướng, theo thứ tự soi.
const NAV_FIELDS = [
  ['contract.md', 'status'],
  ['opportunity.md', 'stage'],
  ['opportunity.md', 'decision'],
  ['uat-session.md', 'verdict'],
];

function fieldProblem(file, txt, field) {
  const raw = frontmatterField(txt, field);
  if (raw == null) {
    return (REQUIRED_BY_FILE[file] || []).includes(field)
      ? { file, reason: `frontmatter không đọc được hoặc thiếu ${field}` }
      : null;
  }
  if (raw === '') {
    return ALLOW_EMPTY.has(field)
      ? null
      : { file, reason: `${field} không nhận diện được: (rỗng)` };
  }
  if (!NAV_ENUMS[field].includes(raw.toLowerCase()))
    return { file, reason: `${field} không nhận diện được: ${raw}` };
  return null;
}

// texts: { 'contract.md': string|null, 'opportunity.md': ..., 'uat-session.md': ... }
// Trả { file, reason } cho vấn đề ĐẦU TIÊN gặp, hoặc null nếu hồ sơ đọc được.
function recordProblem(texts) {
  const present = NAV_FIELDS.filter(([file]) => texts[file] != null);
  if (!present.length) return { file: '(hồ sơ)', reason: 'không có contract.md lẫn opportunity.md' };
  for (const [file, field] of present) {
    const p = fieldProblem(file, texts[file], field);
    if (p) return p;
  }
  return null;
}

// Giá trị điều hướng đã chuẩn hoá (chữ thường, '' khi vắng) — chỉ gọi SAU khi
// recordProblem trả null, lúc đó mọi giá trị đều đọc được và hợp enum.
function navValues(texts) {
  const pick = (file, field) => {
    const txt = texts[file];
    if (txt == null) return '';
    const raw = frontmatterField(txt, field);
    return raw == null ? '' : raw.toLowerCase();
  };
  return {
    status: pick('contract.md', 'status'),
    stage: pick('opportunity.md', 'stage'),
    decision: pick('opportunity.md', 'decision'),
    verdict: pick('uat-session.md', 'verdict'),
  };
}

module.exports = { NAV_ENUMS, NAV_FIELDS, recordProblem, navValues, fieldProblem };
