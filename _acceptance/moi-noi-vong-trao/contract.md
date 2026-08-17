---
schema_version: 1
feature: Mối nối Vòng TRAO — nhật-ký-vấp của lái-thử người-lạ thành bằng chứng vào phiên nghiệm thu; ngưỡng nghiệm thu hiện ở Cổng Phạm vi; S5 bàn giao sang Vòng TRAO thay vì kết thúc; chữ spec + bộ hình đi cùng
slug: moi-noi-vong-trao
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-08-17T03:10:40Z
---

# Acceptance Contract: moi-noi-vong-trao

## Context

Vòng TRAO của Workflow v2 chưa chạy trọn lần nào; hai mối nối vào/ra của
feature-loop với Vòng HIỂU và Vòng TRAO hiện do trí nhớ phiên giữ, và điều
kiện vào phiên nghiệm thu «sản phẩm bấm được» là lời khai. Hồ sơ này làm ba
việc rẻ, đảo bằng một revert: (a) thẻ Cổng Phạm vi in ngưỡng nghiệm thu đã
khai ở Cổng Đáng — hoặc nói sự kiện «không có hồ sơ cơ hội → ship thẳng»;
(b) `uat-session` §0 đọc nhật-ký-vấp của lái-thử làm bằng chứng, vắng thì cờ
vàng không chặn, có CHẶN thì dừng; (c) feature-loop S5 in một dòng bàn giao
sang Vòng TRAO khi vòng có hồ sơ cơ hội. Kèm khuôn nhật-ký-vấp một chỗ có
marker, chữ spec, và bộ sáu hình. Không lưu trường đường đi, không chèn câu
vào hợp đồng, không gạch điều khoản §5 của đề bài lái-thử, không chạm `lib/`.

Source input: [design](../../docs/superpowers/specs/2026-08-17-moi-noi-vong-trao-design.md)
· rà soát North Star 17/08 trong phiên · [docs/lai-thu-nguoi-la.md](../../docs/lai-thu-nguoi-la.md).

## Criteria

- AC-1: Given một workspace có `contract.md` ở trạng thái draft và một
  `opportunity.md` cùng thư mục có section «Ngưỡng chết / ngưỡng UAT» với nội
  dung, When render thẻ Cổng Phạm vi, Then thẻ hiện khối «Ngưỡng nghiệm thu
  (đã khai ở Cổng Đáng)» chứa nguyên văn từng dòng của section và câu «vòng
  này sẽ có phiên nghiệm thu sau khi giao»; `--extract` trả
  `uat_threshold.section_present: true` và `lines` đúng số dòng.
- AC-2: Given workspace có `opportunity.md` nhưng section ngưỡng RỖNG (có
  heading, không dòng nội dung) hoặc THIẾU heading, When render thẻ Cổng Phạm
  vi, Then thẻ hiện cờ vàng «hồ sơ cơ hội chưa khai ngưỡng» và KHÔNG hiện khối
  ngưỡng; `--extract` trả `uat_threshold.opportunity_present: true`, và
  `section_present: true, lines: []` cho ca rỗng · `section_present: false,
  lines: []` cho ca thiếu; When workspace KHÔNG có `opportunity.md` (kể cả hồ
  sơ đời cũ), Then thẻ hiện một dòng sự kiện «không có hồ sơ cơ hội → ship
  thẳng, không phiên nghiệm thu», không cờ, không lỗi, `--extract` trả
  `opportunity_present: false`. Ma trận 4 trạng thái × 2 mặt (HTML · extract)
  viết trước, mỗi ô một assert có tên.
- AC-3: Given khuôn `stranger-drive-template.md` trong references có khối
  `STRANGER-FRONTMATTER-TEMPLATE`, When rút bằng máy tập khoá backtick mà
  `skills/uat-session/SKILL.md` §0–§1 đọc từ nhật-ký-vấp, Then tập đó ⊆ tập
  khoá frontmatter của khuôn (QUAN HỆ, không danh sách chép tay), và tập §0
  đọc chứa ít nhất `chan`, `slug`, `ran_at`; `docs/lai-thu-nguoi-la.md` trỏ
  tới khuôn. Chiều đỏ hai phía: đổi khoá trong khuôn HOẶC trong SKILL đều đỏ.
- AC-4: Given phiên `uat-session` mở trên slug đã ký, When
  `_acceptance/<slug>/stranger-drive.md` có `chan: 0` VÀ `slug` khớp slug
  phiên VÀ `ran_at` không cũ hơn `verified_at` của `evidence-report.md`, Then
  phiên coi điều kiện «sản phẩm bấm được» là THOẢ BẰNG BẰNG CHỨNG và nói một
  dòng (ván, biến thể); When `chan > 0`, Then phiên DỪNG, nêu vấp CHẶN, và chỉ
  đường quay lại («chạy lại lái-thử để CHẶN về 0» — docs/lai-thu-nguoi-la.md);
  When file vắng, frontmatter không đọc được, `slug` lệch, hoặc `ran_at` cũ
  hơn lần chấm máy cuối, Then phiên đi tiếp với CỜ VÀNG nói rõ LÝ DO CÓ TÊN
  (chưa lái-thử · không đọc được · nhật-ký của vòng khác · nhật-ký cũ hơn bản
  chấm) — không chặn, không hỏi. (judgment)
- AC-5: Given feature-loop tới S5 sau khi PR mở, When workspace có
  `opportunity.md`, Then thân skill bảo phiên in ĐÚNG MỘT DÒNG bàn giao nêu
  «lái-thử người-lạ» rồi «phiên nghiệm thu» kèm lệnh `uat-session <slug>`;
  When không có, Then in một dòng đóng vòng «ship thẳng»; và S0 nêu đọc
  `opportunity.md` làm input thứ nhất của brainstorm S1. (judgment)
- AC-6: Given spec `docs/specs/workflow-v2-spec.md` sau sửa, When đọc §2.3,
  §2.4, Chương 3, Chương 4, Then §2.3 gọi lái-thử là «thì ĐO-máy» của nhịp
  TRAO, hàng A của bảng định tuyến chứa «lái-thử», Chương 3 có dòng «lái-thử
  không có hàng», Chương 4 nhắc nhật-ký-vấp song diện; và đề bài
  `docs/plans/2026-08-13-de-bai-lai-thu-nguoi-la.md` §5 vẫn chứa nguyên câu
  «Cấm leo thang trước số liệu».
- AC-7: Given bộ hình `docs/diagrams/workflow-v2-*.html` (6 file) và mục lục
  `workflow-v2-bo-hinh.md`, When kiểm, Then đủ 6 file, mục lục liệt đủ 6, hình
  chuỗi vật chứng và vòng đời một việc mang chữ «ĐỀ XUẤT» trong eyebrow và
  colophon, và colophon hai hình đó nêu ĐIỀU KIỆN GỠ DẤU («cho tới khi guard
  có trong mã — hồ sơ thi hành guard gỡ dấu, không phải hồ sơ này»); mọi hình
  có colophon.

## Coverage

Quét bằng morphological-scan (preset test-matrix), 3 trục:
- Trục A · bề mặt nối: thẻ Cổng Phạm vi | uat-session §0 | feature-loop S5 |
  khuôn nhật-ký-vấp | spec | bộ hình [thước CE: 7 mục owner chốt 17/08 +
  spec §2.2/2.3/2.4]
- Trục B · hồ sơ cơ hội cùng slug: có+ngưỡng có nội dung | có+ngưỡng rỗng/thiếu
  | không có | đời cũ [thước CE: ma trận consumedTexts trong lib/workspace-record
  + tolerant-reader (ngành: schema-evolution)]
- Trục C · nhật-ký-vấp: vắng | chan=0 | chan>0 | frontmatter hỏng [thước CE:
  ba nhánh §0 + nếp «lỗi phải có tên»; ngành: release-readiness gate — điều
  kiện vào là bằng chứng hoặc cờ nói rõ thiếu]
- Ô Core → AC-1..7; Later/Never ở Out of scope. Đủ-để-bắt-đầu: ván
  refine-editor (máy B) là nguồn CE thật đưa ngược vào trước khi ký.

## Out of scope

- Trường `route:` trong hợp đồng — bản sao đồng bộ, suy khi đọc.
- Câu Notes máy tự ghi vào hợp đồng — máy điền lời khai của người.
- Gạch điều khoản §5 đề bài lái-thử; sửa engine/công cụ lái-thử; gói Playwright.
- Chặn CI khi ngưỡng↔Notes mâu thuẫn; thẻ Cổng Bằng chứng nhắc lái-thử;
  `/start` hiện số CHẶN — Later, chờ ván thật.
- Sửa `lib/**` — không hàm mới.
- Chiều về: số đo sau ship append vào `opportunity.md` — chờ Vòng TRAO chạy
  thật một lần.

## Notes

- Đường đọc-cũ: hồ sơ không `opportunity.md` = hàng «ship thẳng»; workspace
  không `stranger-drive.md` = cờ vàng; không migrate.
- Lớp HÀNH VI (AC-4, AC-5) chấm bằng hội đồng phiên sạch theo giao thức 1c:
  agent hành động không tool, nhận inline; đáp án viết trước ở `giam-khao/`;
  đề ca ở `hoi-dong/`.
- Chân răng `rang-mnvt.sh` không vào suite vĩnh viễn (nếp hồ sơ), riêng P198
  (thẻ ngưỡng) vào `tests/plugins` vĩnh viễn vì là hành vi sản phẩm.
- Điều kiện «ký sau khi đọc mục lỗ-kit của phiên máy B (refine-editor)» —
  owner MIỄN ngày 18/08 khi quyết merge; số liệu vòng đó vẫn là đầu vào cho
  hồ sơ kế. Ghi ở Known limits của báo cáo bằng chứng.
- Known limits (5 mục) là năm phát hiện ngoài hợp đồng của vòng chấm 3, owner
  xếp Known limits khi quyết merge.
