---
slug: release-2-3-0
at: 2026-08-22T02:40:00Z
verdict: findings
p0: 0
p1: 1
p2: 3
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals E3c | Vế «ba bộ ca PD/VC/DD chạy trong suite plugins» không ghim dòng nào; thiếu `output` | Một bộ ca bị bỏ qua lặng → suite vẫn exit 0 → AC-3 ký tin lưới ba hồ sơ đã chạy | Ghim ba dòng chốt cuối mỗi bộ «PASS: [PD11]» «PASS: [VC8]» «PASS: [DD7]», thêm `output` | fixed: E3c ghim ba chốt + output |
| P2 | contract feature · d-4401 · manifest v2.3.0 | Context kê BẢY hồ sơ nhưng ba chỗ viết «sáu / six» | Changelog duy nhất của kit nói sai phạm vi ngay câu mở | Số ở câu mở = số slug trong Context | fixed: «bảy / seven» ở cả ba chỗ |
| P2 | evals E1 | expected chứa chiều đỏ «chạy tay» không executor nào chạy | Verifier viện dẫn bước chưa chạy (tự dối) hoặc ghi UNCERTAIN → trạm thu phí | Xoá câu — P200 đã có 5 đột biến + đối chứng dương | fixed: E1 chỉ nói chiều đỏ sống trong P200 (lần chạy tay 22/08 ghi ở Analyst, không làm bằng chứng eval) |
| P2 | contract Coverage | trích id d-4401 (gộp hồ sơ) thay vì d-4402 (bỏ coverage-scan) | Lần theo id không thấy căn cứ bỏ quét | id phải trỏ entry descope «bỏ coverage-scan» | fixed: trỏ d-4402 |
