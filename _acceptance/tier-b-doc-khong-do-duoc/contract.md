---
schema_version: 1
feature: Quy trình Tier B có lối đọc cho kết quả không đo được, kèm phép kiểm máy gắn bên viết với bên đọc
slug: tier-b-doc-khong-do-duoc
owner: phanlemanh@gmail.com
risk_tier: T2               # tài liệu Tier B, một tệp ca trong tests/design-eval, config.yaml — không chạm hooks, lib, scripts/pre-merge-check.sh, scripts/recheck-evidence.cjs
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-11-10-tier-b-doc-khong-do-duoc-design.md
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-11-10T15:58:37Z
---

# Acceptance Contract: tier-b-doc-khong-do-duoc

## Context

Mục Ngoài-6 của hồ sơ `do-tuong-phan-lab-oklab`, người ký chọn «mở hợp đồng mới» ở Cổng Bằng chứng 10/11/2026. Bộ quét trong
trình duyệt đã có kết quả thứ tư `KHONG-DO-DUOC` với mã 0, hoặc 5 khi đòi đo đủ, còn quy trình Tier B vẫn chỉ biết ba kết quả và
hai mã. Tác tử đọc theo tài liệu không có lối ghi đúng và có thể ghi thành đạt.

Thuật ngữ:
- **bộ quét** = `scripts/design-scan.js`, gọi `window.__impeccableDesignScan` trong trang.
- **bảng đọc** = khối giữa cặp marker `TIER-B-DOC-KET-QUA` trong `skills/acceptance/references/design-ui-check.md`.
- **cặp** = (`verdict`, `exit_intent`) bộ quét trả về.
- **ma trận** = năm tình huống (đạt, từ chối, trang trộn đo được và không đo được, không đo được, thiếu bộ dò) × hai chế độ
  (mặc định, `requireMeasured: true`), 10 ô, viết trước trong tệp ca.
- **nhát phá** = đổi đúng một chỗ trên bản sao trong bộ nhớ rồi chạy lại chính hàm đo.

## Criteria

- AC-1: Given bộ quét thật chạy trong jsdom trên ma trận, When đối chiếu với bảng đọc và với tập kết quả khai trong nguồn bộ quét,
  Then tập cặp bộ quét phát ra bằng đúng tập hàng của bảng theo cả hai chiều, gồm (`KHONG-DO-DUOC`, 0) và (`KHONG-DO-DUOC`, 5), mỗi
  cặp có đúng một hàng, và nguồn bộ quét không khai kết quả hay mã nào ngoài ma trận.
- AC-2: Given bảng đọc, khuôn báo cáo bằng chứng và công thức gọi bộ quét, When xét từng hàng và từng lời gọi, Then năm hàng khớp bảng
  mong đợi viết trước: kết quả ghi thuộc tập của khuôn, hai hàng `KHONG-DO-DUOC` ghi `BLOCKED`, chỉ hàng bộ quét báo đạt mới ghi
  `PASS`, cột mã chép đúng `exit_intent` hoặc để trống, mã 0 không đứng cạnh kết quả khác `PASS`; cả hai lời gọi trong công thức, chạy
  thật trên trang không đo được, trả mã 5; và các câu đọc cũ chỉ biết ba kết quả không còn trong quy trình.
- AC-3: Given mười bốn nhát phá (gỡ hàng mã 5 · bộ quét đổi mã 5 thành 7 · không đo được ghi đạt · thêm hàng thừa · mất khối bảng · bộ
  quét báo đạt khi không đo được · khuôn báo cáo bỏ BLOCKED · mã 0 cạnh kết quả không đạt · câu đọc cũ quay lại · hàng từ chối ghi chặn
  · hàng đạt ghi chặn · bộ quét thêm nhánh kết quả mới · công thức bỏ cờ đòi đo đủ · cổng bằng chứng thôi từ chối báo cáo đạt mang mã 5),
  When chạy lại chính hàm đo sau khi vật lành xanh trên cùng ma trận, Then phép đo đỏ với đúng thông điệp ghim của từng nhát.
- AC-4: Given chỉ tệp `design-ui-check.md`, When người đọc gặp `KHONG-DO-DUOC` với mã 0 hoặc 5, Then đọc được phải ghi `BLOCKED`
  kèm lý do nêu số phát hiện và mã nguyên nhân, không ghi đạt, biết khi nào có mã 5, biết kết quả tác tử chấm đặt cờ không chạy được
  với trường mã khác 0, và biết lối ra là sửa màu hoặc thu phạm vi có tên. (judgment)
- AC-5: Given bộ `tests/design-eval/run-tests.sh` với jsdom đã cài, When chạy như job CI `design-eval`, Then bộ thử mới nằm trong
  lượt chạy và cả bộ xanh.
- AC-6: Given báo cáo dựng từ từng hàng của bảng đọc, When đưa qua bộ kiểm của cổng bằng chứng thật, Then hàng ghi `BLOCKED` không bị
  đưa vào luật của báo cáo đạt, hàng ghi `PASS` có; và cùng khối mang mã 5 mà báo cáo tự xưng đạt thì bị từ chối.

## Coverage

Bỏ quét không gian: quyết định `bỏ coverage-scan` trong `decisions.jsonl`. Không gian có hai trục hữu hạn. Tình huống × chế độ do AC-1
đo và đối chiếu với tập kết quả khai trong nguồn bộ quét. Kênh đọc (báo cáo, tác tử chấm) do AC-4 và AC-6 đo.

## Out of scope

- Mã của bộ quét, cổng bằng chứng, tầng `script` và luồng chấm S4 không đổi.
- Đổi cách tầng `script` hay bộ quét chọn mã; vòng này chỉ đổi lời gọi trong công thức Tier B.
- Các mục Ngoài-n khác của hồ sơ `do-tuong-phan-lab-oklab`, gồm câu «PASS nghĩa là mọi màu đã được đo», đã có quyết định riêng.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

Một trang có màu bộ dò chưa đọc được sẽ giữ Tier B ở BLOCKED cho tới khi sửa màu hoặc thu phạm vi. Đó là chủ ý: không có lối đạt
khi chưa đo được.
