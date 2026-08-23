---
schema_version: 1
feature: Ba tài liệu đầu-tay (QUICKSTART · README · GUIDE) vào vũ trụ quét lệnh — 52 token trần đổi sang dạng bấm được, cùng bảng COMMAND-NAMES và cùng ca LB2
slug: lenh-tran-tai-lieu-dau-tay
owner: phanlemanh@gmail.com
risk_tier: T2               # 3 tài liệu gốc (t1_skip_globs) + tests/plugins/lenh-bam-duoc.test.mjs — không chạm lib/**, scripts/, hook, lưới
surfaces: [cli]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-08-23T00:33:06Z
---

# Acceptance Contract: lenh-tran-tai-lieu-dau-tay

## Context

Chip D (#93) đưa 13 file bàn giao về dạng lệnh bấm được, nhưng vũ trụ quét là danh sách khai
tường minh nên **QUICKSTART.md (12) · README.md (19) · GUIDE.md (21) = 52 token trần** nằm ngoài —
đã khai ở Known limits của chip D và owner ký chấp nhận. Ba file này là mặt người **đầu tiên**:
người mới của đội chép lệnh ở đây trước cả khi thấy thẻ. Hồ sơ này chỉ mở rộng vũ trụ của ca LB2
đã có răng, không thêm cơ chế.

Source input: Known limits + `review-findings.md` của `_acceptance/lenh-in-ra-phai-bam-duoc` (finding ngoài hợp đồng #1); owner gật 22/08 «Mở luôn».

## Criteria

- AC-1: Given `tests/plugins/lenh-bam-duoc.test.mjs`, When đọc `FILES`, Then nó có **đúng 16** phần tử — 13 cũ cộng `QUICKSTART.md`, `README.md`, `GUIDE.md`; phép đo assert đủ 16 file có mặt trên cây (vắng một file → đỏ nêu tên), và ca LB2 chạy trên **cả 16**.
- AC-2: Given ba tài liệu đầu-tay sau hồ sơ, When quét bằng chính hàm của LB2, Then **0** token trần (`/start`, `/approve`, `/signoff`, `/acceptance-card`, `/acceptance-init`, `/acceptance-status`, `/acceptance-report`, `/feature-loop`, `/uat-session`) và **0** chỗ `uat-session` không tiền tố; mọi token `/<plugin>:<tên>` rút ra đều ⊆ cột «Lệnh bấm được» của bảng `COMMAND-NAMES`. Đối chứng dương **không neo mốc git di động** (S4-r1 hồ sơ này: `origin/main` sau khi chip D merge đã là bản mới, đối chứng dương kiểu đó tự chết): với **từng** file trong 16 file, tiêm `/start` + `uat-session <slug>` vào bản sao rồi quét → phải thấy đúng ở đúng file (đọc hụt một file là xanh giả); cộng ngưỡng dưới cố định «≥ 100 token có tiền tố» chống sửa-bằng-cách-xoá-câu. Chiều đỏ: bản sao chèn lại một token trần vào từng file trong ba tài liệu đầu-tay → đỏ nêu **đúng file:dòng**.
- AC-3: Given `GUIDE.md` sau hồ sơ, When đọc, Then các lệnh **không phải slash-command của harness** giữ nguyên: khối `GUIDE-PLUGIN-DECLARE` vẫn có đúng số lệnh `claude plugin marketplace add`/`install` như trước (máy đếm, so với `origin/main`), và dòng «Khớp phiên bản» không đổi. Chiều đỏ: bản sao đổi một lệnh `claude plugin` thành dạng slash → đỏ.
- AC-4: Given bốn suite của kho và `product-map --check`, When chạy sau hồ sơ, Then tất cả XANH — đặc biệt ca P200 (mốc phát hành) và P131/P167 vốn ghim chuỗi trong GUIDE không được đỏ vì lần đổi này.

## Coverage

- Bỏ coverage-scan — không gian AC là «ba file × (token trần | token có tiền tố ⊆ bảng | lệnh không-phải-slash giữ nguyên)», đã liệt trọn trong ma trận của chip D và chỉ đổi vũ trụ (entry d-20260822T170100Z-4602).

## Đường đo

- bỏ đường-đo — hồ sơ không có hồ sơ cơ hội riêng (nhánh con của chip D đã ký); ngưỡng sống/chết đo chung ở ván lái-thử kế của chip D («0 lần gõ lại tay») (entry d-20260822T170200Z-4603).

## Out of scope

- Không đổi tên lệnh, không thêm lệnh, không alias — chỉ đổi DẠNG in.
- Không đụng lệnh `claude plugin …` trong GUIDE §5.1 (không phải slash-command) — AC-3 canh.
- Không quét `docs/**` (sử liệu) — vũ trụ vẫn là danh sách khai tường minh, nay 16 file.
- Không chạm `lib/**`, `scripts/`, hook, lưới trước-merge.
