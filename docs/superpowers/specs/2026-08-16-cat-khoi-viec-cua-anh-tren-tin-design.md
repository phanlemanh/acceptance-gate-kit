# Cắt khối 👉 VIỆC CỦA ANH khỏi TIN mời cổng — chỉ TRỪ

*Hồ sơ `cat-khoi-viec-cua-anh-tren-tin` · T2 · 2026-08-16 · owner gật hai lượt
trong phiên (phân tích → framing lại → «ok, mở hồ sơ cắt»).*

## Đề bài (tiếng người)

Trước chip ② (10/08) máy mời cổng như đồng nghiệp: một dòng tình hình, **một
câu hỏi đóng có tư thế** («push + PR nhé — hay để local?»), «ok» là đủ, và nói
luôn máy làm gì tiếp. Từ khi khối 👉 thành thành phần cứng, tin mời cổng thành
**form**: N mục × 3 vế + «Trả lời mẫu (điền vào chỗ trống)», mã Ngoài-/E-/Treo-,
ô trống không có tư thế, khối là điểm cụt. Ví dụ thật owner dán 16/08: 5 quyết
định lồng «nếu chọn làm…» + hỏi phút — thứ ③b đã bỏ. Hình dạng được chép, ý thì
không.

Chẩn đoán (memory `khoi-viec-cua-anh-thanh-form`): khối là **bảo hiểm cho MỘT
tin viết dở** (sổ vấp #8, đảo-rẻ) mà trả phí ở mọi tin từ đó; luật «cấm câu tu
từ mang dấu hỏi» phạt đúng câu mẫu tốt của owner; phép đo P185–P190 chỉ giữ
hình dạng (họ B), không phép đo nào hỏi «một quyết định? có ngả khuyên? «ok»
đủ?». Sai gốc: **tưởng tin mời cổng cần một khuôn.** Không thay khuôn — bỏ khuôn.

## Làm gì (TRỪ)

| # | Vật | Việc |
|---|---|---|
| 1 | `skills/acceptance/references/human-facing-language.md` §«Khối 👉 VIỆC CỦA ANH» | Gỡ `YOUR-MOVE-BLOCK-TEMPLATE` + luật đi kèm (3 vế · câu mẫu · cấm-dấu-hỏi). Thay bằng section ngắn «Mời cổng như đồng nghiệp hỏi» gồm: điều khoản MỘT câu (`GATE-INVITE-CLAUSE`, giữ marker + sites để một-cây-nguồn) và hai luật âm giữ nguyên nghĩa: máy không viết sẵn câu trả lời của người (ADR 0002) · máy không hỏi phút. |
| 2 | 5 bản chép `GATE-INVITE-CLAUSE` (`skills/acceptance/SKILL.md` ×2 · `commands/acceptance-card.md` ×1 · `feature-loop/skills/feature-loop/SKILL.md` ×2) | Chép nguyên văn câu mới (round-trip P188 giữ). Câu bọc quanh («RỒI hỏi đúng 1 câu…», «TIN NHẮN trình thẻ cũng phải kết bằng khối đó») sửa cho hết nhắc khối. |
| 3 | `GATE-ONESHOT-CLAUSE` (nguồn + 6 thân lệnh) | Bỏ vế cuối «tin mời cổng kết bằng đúng MỘT khối 👉 … tin chỉ-báo không đeo khối» → thay bằng «Đầu ra theo bản luật ngôn ngữ mặt người.» (P193 round-trip giữ; neo test cũ đổi theo). |
| 4 | `feature-loop/.../SKILL.md` dòng 10 (bất biến dừng) | «không khối 👉, không câu hỏi» → «không câu hỏi». |
| 5 | `tests/plugins/run-tests.sh` | Gỡ P189 (khuôn 5 chuẩn) và ca cô-lập-clause của nó; đổi neo P193 dòng 9497; giữ P185/186/187/190 (thẻ) và P188/P191/P192/P194. Số ca suite khai trước trong contract. |
| 6 | `scripts/gate-card.js` | CHỈ sửa comment trỏ template (dòng 350, 506) — hành vi render giữ nguyên. |
| 7 | `PRODUCT-MAP.md` | Vẽ lại CÙNG LƯỢT với thay đổi (bài học ×2). |

Câu điều khoản mới (bản gốc duy nhất, chép nguyên văn):

> Mời cổng như đồng nghiệp hỏi: một câu hỏi đóng, nói ngả máy khuyên và vì sao, người trả lời một chữ là đủ, rồi nói máy làm gì tiếp; không khuôn, không ô trống, không mã bắt buộc — máy không viết sẵn câu trả lời của người và không hỏi phút.

## KHÔNG làm (Out of scope, có tên)

- **Thẻ HTML cả hai cổng** (`gate-card.js` render, kể cả dòng «Trả lời mẫu» và mã Ngoài-/E-/Treo-): là danh sách máy-đếm + đường nhập cho ngữ pháp câu gộp; đổi nó kéo P191/P192/P194 và `GATE-ONESHOT-SLOTS` — quyết định riêng, revisit khi hồ sơ ngữ pháp. Ghi `revisit`.
- **`GATE-ONESHOT-GRAMMAR` + SLOTS**: giữ làm đầu vào được chấp nhận; chỉ thôi *dạy* trong tin.
- **Chữ ký lớp 2**: hạt giống riêng `docs/plans/2026-08-16-hat-giong-go-lop-chung-minh-chu-ky.md` (T3).
- **Script drift của hồ sơ cũ** (`no-vat-that-drift.sh` ②b · `no-ben-viet-drift.sh` ③ · `no-vat-cam-drift.sh` ③b · `rang-1c.sh` 1c) đọc marker template: chúng khai trước «không vào suite vĩnh viễn, chết theo merge»; hồ sơ 1c/③b có `paths` chạm bản luật → stale theo diff PR → **re-pin 1 làn** trước merge (nếp đã có).

## Đo bằng gì

- Lớp MÁY (họ A, có chiều đỏ, đối chứng dương `origin/main`): răng đo sự VẮNG
  MẶT của 6 needle khuôn (template · 3 vế · cấm-dấu-hỏi · Trả lời mẫu · khối 👉
  · kết bằng đúng MỘT khối) trên phạm vi khai máy-đọc; điều khoản mới đúng MỘT
  câu, không chứa {khối, vế, chỗ trống, Trả lời mẫu, YOUR-MOVE} (từ cấm suy từ
  chính câu — «khuôn» có trong câu nên không cấm); BA luật âm còn mặt: không
  viết sẵn câu trả lời · không hỏi phút · **tin chỉ-báo không hỏi** (thay chỗ
  «tin chỉ-báo không đeo khối» — gap-probe); suite plugins xanh với số ca khai
  trước + phân rã ca gỡ/giữ; P188/P193 round-trip nguồn→bản chép chạy trên câu
  mới.
- Lớp HÀNH VI (judgment): **hội đồng phiên sạch theo giao thức 1c** — agent
  không tool nạp inline bản luật SAU sửa + 3 ca (mời Cổng 1 · mời Cổng 2 có
  một mục ngoài hợp đồng + ký · tin chỉ-báo giữa vòng · thêm ca chống-a-dua:
  owner hỏi «sao không có khối như mọi khi»); đáp án viết TRƯỚC ở `giam-khao/`,
  chấm theo HÀNH VI (một câu hỏi đóng · có ngả khuyên · «ok» đủ · nói việc kế ·
  không ô trống/không mã bắt buộc), không theo vị trí chữ.

## Vì sao không phải «đổi khuôn tốt hơn»

Đề xuất đầu của phiên là một khuôn mới («👉 — <câu>? Mặc định: … «ok» = …»).
Owner bác: vẫn là tiếng máy. Ghi lại làm lớp lỗi: **trả lời vấn đề-về-khuôn bằng
một khuôn khác.** Câu điều khoản trên cố ý mô tả *hành vi* (hỏi như đồng
nghiệp), không cho *hình dạng*.
