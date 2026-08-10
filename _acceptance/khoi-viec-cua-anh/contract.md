---
schema_version: 1
feature: Khối "👉 VIỆC CỦA ANH" — thành phần cứng máy-sinh của khuôn trình-người (thẻ cổng + lời-mời-cổng)
slug: khoi-viec-cua-anh
owner: phanlemanh@gmail.com
risk_tier: T2      # đụng scripts/gate-card.js + SKILL/references — không khớp t1_skip_globs, không khớp t3_paths
surfaces: [cli]
status: implemented
approved_by: Manh Phan
approved_at: 2026-08-10
time_human_minutes: {gate1: 0}   # owner tuyên không đo phút — 0 có chủ đích
---

# Acceptance Contract: khoi-viec-cua-anh

## Context

Lời-gọi-hành-động của máy với owner không rõ: việc-cần-làm rải giữa thân bài,
câu tu từ lẫn câu hỏi thật, không nói trả-lời-dạng-gì (sổ vấp 2026-08-10, hành
vi owner #8 — ví dụ thật: 6 quyết trả lời đủ mà dòng tick park đầu thẻ bị sót).
Chip ② kit 2.1 (owner duyệt 10/08): khối "👉 VIỆC CỦA ANH" thành thành phần
CỨNG máy-sinh ở (a) thẻ cổng — mọi mode đang có của `scripts/gate-card.js`, và
(b) khuôn lời-mời-cổng single-source có marker trong bản luật ngôn ngữ mặt
người, các vòng lặp chép nguyên văn (pattern LOOP-PICTURE-CLAUSE).

Source input: docs/research/so-vap-trien-khai.md dòng 64 + đề bài ② kit 2.1
(docs/findings/2026-08-10-reflect-lon-khep-gd2.md mục 9).

## Criteria

- AC-1: Given một hồ sơ có contract `status: draft` hoặc `approved`, When
  render thẻ Cổng 1 bằng `gate-card.js`, Then cuối thẻ (trước hàng nút) có
  khối máy-sinh mở đầu đúng chuỗi `👉 VIỆC CỦA ANH` chứa đúng MỘT mục
  duyệt-hay-trả mang đủ 3 vế làm-gì / ở-đâu / trả-lời-dạng-gì, và một dòng
  `Trả lời mẫu` gộp nằm trên MỘT dòng ở dạng KHUÔN CÓ CHỖ TRỐNG — máy KHÔNG
  điền sẵn lựa chọn thay người.
- AC-2: Given hồ sơ Cổng 2 verdict PASS hoặc PENDING-JUDGMENT có ≥1 việc-người
  ở CẢ BỐN loại (finding ngoài-hợp-đồng · judgment chưa override · phạm vi
  cắt/hoãn · quyết định treo chưa phê), When render thẻ Cổng 2, Then khối
  liệt kê TỪNG việc máy đã đếm — đủ cả bốn loại, judgment theo mã eval,
  ngoài-hợp-đồng theo nhãn thứ tự — mỗi mục đủ 3 vế, và dòng `Trả lời mẫu`
  gộp MỘT dòng nêu đủ các mã/nhãn đang hiện ở dạng KHUÔN CÓ CHỖ TRỐNG (một
  chỗ trống mỗi mục) — máy KHÔNG điền sẵn verdict, đề xuất hay chữ đồng-ý/Ký
  thay người.
- AC-3: Given hồ sơ Cổng 2 verdict REJECT hoặc BLOCKED hoặc verdict lạ, When
  render thẻ, Then khối ghi rõ `không cần làm gì` kèm một câu nói máy đang làm
  gì tiếp theo đúng verdict, và KHÔNG chứa mục nào đòi người trả lời.
- AC-4: Given hồ sơ Cổng 2 verdict PASS mà máy không đếm được việc-người nào
  (không judgment nợ, không ngoài-hợp-đồng, không phạm vi cắt, không quyết
  định treo), When render thẻ, Then khối vẫn hiện với đúng MỘT mục ký-hay-trả
  đủ 3 vế — khối không rỗng, không biến mất.
- AC-5: Given câu điều khoản mời-cổng đặt MỘT chỗ giữa cặp marker
  `GATE-INVITE-CLAUSE` trong `human-facing-language.md` và danh sách mặt
  mời-cổng NGUỒN giữa cặp marker `GATE-INVITE-SITES`, When so với mọi bên chép
  — sáu site nguồn (vòng lặp hai harness, skill acceptance hai harness, lệnh
  thẻ Claude, skill thẻ Codex) CỘNG mọi bản dựng dưới `plugins/` và overlay
  cùng đuôi đường dẫn được SUY ra từ mặt phẳng, Then mọi lần xuất hiện ở mọi
  bên KHỚP TỪNG KÝ TỰ và bản dựng không thiếu bản chép nào so với nguồn của
  nó — khuôn lời-mời có đúng một nguồn, và phép đo không bỏ sót gói phát hành.
- AC-6: Given bản luật `human-facing-language.md`, When đọc khối marker
  `YOUR-MOVE-BLOCK-TEMPLATE`, Then khuôn khai đủ NĂM chuẩn: mỗi mục 3 vế
  làm-gì/ở-đâu/trả-lời-dạng-gì · câu mẫu trả-lời-gộp MỘT dòng · câu mẫu là
  KHUÔN DẠNG có chỗ trống, máy KHÔNG BAO GIỜ điền sẵn lựa chọn thay người ·
  tin chỉ-báo ghi rõ "không cần làm gì" · cấm câu tu từ mang dấu hỏi (mọi dấu
  hỏi trong tin thuộc một mục việc có dạng trả lời khai sẵn).
- AC-7 (judgment): Given khối trên ba mode thẻ và khuôn lời-mời, When một
  người quyết không đọc code xem chúng, Then người đó hiểu ngay phải làm gì,
  ở đâu, trả lời dạng gì — đúng sáu luật N1–N6, không câu tu từ mang dấu hỏi.

## Coverage

Ma trận viết-trước 2 trục (mặt trình × thành phần chuẩn khối) — đủ khi mỗi mặt
có AC và mỗi thành phần có chỗ cưỡng chế (script render hoặc khuôn marker):

- Trục mặt trình: thẻ Cổng 1 (AC-1) · thẻ Cổng 2 ký được (AC-2, AC-4) · thẻ
  Cổng 2 không ký được (AC-3) · tin mời-cổng của hai vòng lặp + skill
  acceptance + lệnh thẻ (AC-5).
- Trục thành phần: 3 vế (AC-1/2/4/6) · mẫu gộp một dòng (AC-1/2/6) ·
  chỉ-báo "không cần làm gì" (AC-3/6) · cấm-dấu-hỏi (AC-6/7).
- Thước "đủ": mọi ô của ma trận có ít nhất một AC máy-đo (trừ hàng cấm-dấu-hỏi
  trên thẻ — script không sinh câu hỏi tu từ, chốt bằng AC-7 judgment).
  Bỏ quét morphological-scan theo ledger (spec ngoài đã chốt scope — đề bài
  chip ② liệt đủ mặt và thành phần).

## Out of scope

- 6 lệnh cổng người (`approve`/`signoff`/`acceptance-init`/`acceptance-status`/
  `acceptance-report`/`start`): không đổi một chữ (ADR 0002; một-lượt-gõ là
  chip ③).
- Card mode mới cho Cổng 0 / Cổng Giá trị (UAT) — chip ⑦.
- Key overlay mới trong `card-plain.json` (`CARD-PLAIN-KEYS` là danh sách
  đóng, P147 canh) — khối là máy-sinh thuần, không qua lớp dịch.
- KPI số đo "owner trả lời nhanh hơn" — không đo trong chip này.
- Thẻ không-ký-được KHÔNG gánh việc hỏi người khi máy bất lực (BLOCKED mà
  khắc phục cần người): thẻ là tin chỉ-báo tĩnh, ghi "không cần làm gì" + máy
  đang làm gì tiếp; khi máy cần người quyết, lời-gọi đi qua TIN NHẮN của
  phiên — tin đó chịu chuẩn khối qua khuôn lời-mời (AC-5/AC-6), không qua
  thẻ. Khai có ý thức theo soi mốc 1 của B.

## Notes

- Mobile backend target: n/a (kit CLI, không surface mobile).
