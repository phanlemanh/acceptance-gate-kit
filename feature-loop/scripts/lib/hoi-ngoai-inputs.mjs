// hoi-ngoai-inputs.mjs — bộ dò MỘT NGUỒN: câu hỏi của eval judgment có đòi thứ
// hội đồng không đọc được không (diff của lượt · chạy lệnh). Hội đồng chỉ đọc
// đúng các tệp trong `inputs` (lời giao việc ở acceptance-verify.js, từ 04/08),
// nên câu hỏi kiểu đó có phán quyết biết trước: UNCERTAIN, bất kể vật.
//
// Hai bộ đọc nạp module này, không bộ nào giữ bản sao khuôn:
//   · feature-loop/scripts/s4-args.mjs — răng: khớp → exit 2, không sinh args;
//   · docs/findings/assets/2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs — lệnh
//     đếm ngưỡng trên mọi kho (chặn oan · sót).
//
// Hai khuôn chép NGUYÊN VĂN từ script quét của bản ghi phát hiện (commit
// a2db0fad), đã đo trên 434 eval judgment của 10 kho: 17 ca, 17/17 đúng. Bản
// đầu từng bắt nhầm «Trên app QC đang chạy:» nên «Run/Chạy» phải đi kèm backtick.
// KHÔNG miễn khi `inputs` có tệp tên «diff»: tệp diff làm tay là lịch sử đóng
// băng — mã đổi mà tệp không đổi thì bộ nhớ hội đồng (P3, băm inputs) mang phán
// quyết cũ sang mã mới (đo: một tệp diff 500 dòng chỉ có --stat giữ hội đồng UNCERTAIN hai lượt).
//
// Giới hạn đã khai (hồ sơ thuoc-biet-truoc-khong-phan-duoc, Notes): `\b` là ranh
// giới ASCII nên «Đọc diff» trần (chữ đầu có dấu, không từ khoá kèm) lọt; tiếng
// Anh chỉ phủ «read diff», «git diff», «Run: `». Ngưỡng đếm bằng script quét.
export const DIFF_REQ = /\bgit\s+(-C\s+\S+\s+)?diff\b|\bdiffBase\b|\.\.\.\s*HEAD\b|\bdiff\b[^.\n]{0,25}\b(lượt|luot|PR|round|nhánh|nhanh|branch|HEAD|commit)\b|\b(nhìn|nhin|đọc|doc|read|so)\s+(bản\s+)?diff\b/i;
export const CMD_REQ = /(^|\s)(Run|Chạy|Chay)\s*:?\s*`|\bgrep\s+-|\bgit\s+-C\b/i;

// Câu hỏi → đoạn khớp đầu tiên (đã cắt khoảng trắng) hoặc null. Hai bước chuẩn
// hoá trước khi dò, cùng một lý do: bộ đọc evals trả giá trị THÔ.
//  · Gộp khoảng trắng: `question: >` là khối GẤP — xuống dòng trong nguồn là dấu
//    cách trong nghĩa, mà khuôn có `[^.\n]` nên «diff của⏎lượt» sẽ lọt.
//  · Bóc MỘT cặp nháy bao ngoài: giá trị một dòng `question: "Run: `…` …"` tới đây
//    còn nguyên nháy, và nháy đứng trước «Run» làm `(^|\s)` không khớp.
// Đo 01/10 trên 434 eval judgment của 10 kho: cả hai bước cùng ra 17 ca như bản
// đo gốc — không thêm, không mất (hồ sơ thuoc-biet-truoc-khong-phan-duoc).
export function hoiNgoaiInputs(question) {
  const q = String(question == null ? '' : question).replace(/\s+/g, ' ').trim().replace(/^(["'])(.*)\1$/, '$2');
  const m = q.match(DIFF_REQ) || q.match(CMD_REQ);
  return m ? m[0].trim() : null;
}
