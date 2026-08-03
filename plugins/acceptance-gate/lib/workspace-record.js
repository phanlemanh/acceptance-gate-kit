// workspace-record.js — LUẬT DUY NHẤT trả lời "hồ sơ của slug này có hỏng
// không", dùng chung bởi MỌI bên đọc `_acceptance/<slug>/`.
//
// Vì sao một chỗ: bản đồ sản phẩm và bộ quét vào phiên là hai READER của cùng
// một bộ hồ sơ. Ở S4-r1 chúng đã trôi khỏi nhau ngay lần đầu ra mắt — cùng một
// `uat-session.md` mất frontmatter, bộ quét gọi là hỏng còn bản đồ xếp vào
// "Đã ship — chờ phiên nghiệm thu". Hai kết luận trái nhau về cùng một sự thật
// là false-green đúng nghĩa, và vá riêng từng bên chỉ dời chỗ trôi. Ai thêm
// bên đọc thứ ba thì gọi hàm này, đừng chép luật.
const { frontmatterField } = require('./evidence-core.js');
const { readFileSync } = require('node:fs');

// ĐỌC hồ sơ — ENOENT (file vắng) là tin bình thường; MỌI lỗi khác là sự thật
// phải nêu tên. Nuốt chung một rọ biến "mất quyền đọc" thành "không có file",
// và slug bị phân ô theo artifact bên cạnh: bản đồ từng xếp một việc mất quyền
// đọc contract.md vào "Sắp mở vòng" trong khi bộ quét gọi nó là hỏng (S4-r14,
// dựng lại được bằng chmod 000). Ngữ nghĩa đọc là MỘT PHẦN của luật đọc hồ sơ,
// nên nó ở đây chứ không phải một `read` cục bộ trong từng reader.
function readRecord(p) {
  try { return { t: readFileSync(p, 'utf8'), err: null }; }
  catch (e) { return e.code === 'ENOENT' ? { t: null, err: null } : { t: null, err: e }; }
}

const ioReason = err => `không đọc được (${err.code})`;

// Luật khoá theo (FILE, FIELD) chứ không theo tên field trần: `stage` là HAI
// enum khác nhau — `discovery|decided|archived` trong opportunity.md và
// `scheduled|held` trong uat-session.md. Bảng khoá theo tên trần thì người sau
// thêm cặp uat/stage vào sẽ gắn nhầm enum của opportunity và bắn "hồ sơ hỏng"
// lên MỌI phiên nghiệm thu hợp lệ, ở cả hai reader cùng lúc (S4-r3).
//
//   required  — file có mặt thì khoá phải ĐỌC ĐƯỢC (null = frontmatter hỏng
//               hoặc thiếu hẳn key, cả hai là hồ sơ hỏng).
//   allowEmpty— giá trị RỖNG là trạng thái hợp lệ (khoá cố ý để trống tới lúc
//               người ký). Rỗng ở khoá không allowEmpty là hồ sơ hỏng, không
//               phải khoảng trống vô hại.
const NAV_RULES = {
  'contract.md': {
    status: { enum: ['draft', 'approved', 'implemented', 'verified', 'signed-off'], required: true },
  },
  'opportunity.md': {
    stage: { enum: ['discovery', 'decided', 'archived'], required: true },
    decision: { enum: ['build', 'iterate', 'park', 'kill'], allowEmpty: true },
  },
  'uat-session.md': {
    verdict: { enum: ['release', 'iterate', 'kill'], required: true, allowEmpty: true },
    stage: { enum: ['scheduled', 'held'], allowEmpty: true },
  },
};

// Hai file NÀY là bằng chứng một slug tồn tại. Chỉ có `uat-session.md` mà
// thiếu cả hai là hồ sơ hỏng — KHÔNG được lọt qua rồi biến mất khỏi mọi ô
// (hồi quy S4-r3: bản vá gộp luật đã xoá mất nhánh này).
const ANCHOR_FILES = ['contract.md', 'opportunity.md'];

const NAV_FIELDS = Object.entries(NAV_RULES)
  .flatMap(([file, fields]) => Object.keys(fields).map(field => [file, field]));

function fieldProblem(file, txt, field) {
  const rule = (NAV_RULES[file] || {})[field];
  if (!rule) return null;
  const raw = frontmatterField(txt, field);
  if (raw == null)
    return rule.required ? { file, reason: `frontmatter không đọc được hoặc thiếu ${field}` } : null;
  if (raw === '')
    return rule.allowEmpty ? null : { file, reason: `${field} không nhận diện được: (rỗng)` };
  if (!rule.enum.includes(raw.toLowerCase()))
    return { file, reason: `${field} không nhận diện được: ${raw}` };
  return null;
}

// ĐIỀU KIỆN TIÊU THỤ — luật DUY NHẤT trả lời "trạng thái này DÙNG hồ sơ nào".
//
// Vì sao ở đây chứ không để mỗi reader tự suy: bảng enum đã gom về một chỗ ở
// S4-r3 nhưng điều kiện tiêu thụ thì vẫn chép đôi, nên hai bên tiếp tục trôi
// khỏi nhau ở r12 (bản đồ soi opportunity.md trên lối bộ quét không đọc) và ở
// r13 (bộ quét bỏ qua stage của phiên nghiệm thu, bỏ qua decision lạ khi stage
// chưa `decided`). Gom LUẬT mà để lại ĐIỀU KIỆN GỌI LUẬT là gom một nửa: cùng
// một bảng enum áp lên hai tập hồ sơ khác nhau vẫn ra hai kết luận khác nhau.
//
// Doctrine (start-scan-hardening, học qua 4 round): hồ sơ nào trạng thái hiện
// tại KHÔNG dùng thì lỗi của nó không được quyết định ô của slug.
//   contract.md    — luôn tiêu thụ, nó quyết định mọi lối.
//   uat-session.md — chỉ khi hợp đồng đã ký.
//   opportunity.md — chỉ khi KHÔNG có hợp đồng (còn ở khám phá), HOẶC đã ký mà
//                    phiên nghiệm thu chưa chốt verdict (lúc đó mới dò đường A).
function usesUat(contractTxt) {
  if (contractTxt == null) return false;
  return (frontmatterField(contractTxt, 'status') || '').toLowerCase() === 'signed-off';
}

function usesOpportunity(contractTxt, uatTxt) {
  if (contractTxt == null) return true;
  if (!usesUat(contractTxt)) return false;
  return !(uatTxt != null && frontmatterField(uatTxt, 'verdict'));
}

// Nhận NGUYÊN văn 3 file đã đọc, trả đúng tập được tiêu thụ (file bị loại →
// null). Bên đọc nào cần đọc lười thì gọi thẳng usesUat/usesOpportunity để
// quyết định có mở file hay không, rồi vẫn đi qua hàm này — một đường duy nhất.
function consumedTexts({ contract = null, opportunity = null, uat = null }) {
  const u = usesUat(contract) ? uat : null;
  return {
    'contract.md': contract,
    'opportunity.md': usesOpportunity(contract, u) ? opportunity : null,
    'uat-session.md': u,
  };
}

// texts: { 'contract.md': string|null, 'opportunity.md': ..., 'uat-session.md': ... }
// Trả { file, reason } cho vấn đề ĐẦU TIÊN gặp, hoặc null nếu hồ sơ đọc được.
function recordProblem(texts) {
  if (ANCHOR_FILES.every(f => texts[f] == null))
    return { file: '(workspace)', reason: 'không có contract.md lẫn opportunity.md' };
  for (const [file, field] of NAV_FIELDS) {
    if (texts[file] == null) continue;
    const p = fieldProblem(file, texts[file], field);
    if (p) return p;
  }
  return null;
}

// Giá trị điều hướng đã chuẩn hoá (chữ thường, '' khi vắng) — chỉ gọi SAU khi
// recordProblem trả null, lúc đó mọi giá trị đều đọc được và hợp enum.
// `stage` ở đây là stage của OPPORTUNITY (thứ quyết định ô); stage của phiên
// nghiệm thu không tham gia phân ô nên không trả ra, tránh lẫn hai enum.
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

module.exports = {
  NAV_RULES, NAV_FIELDS, ANCHOR_FILES,
  recordProblem, navValues, fieldProblem,
  usesUat, usesOpportunity, consumedTexts,
  readRecord, ioReason,
};
