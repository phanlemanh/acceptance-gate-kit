---
slug: findings-section-boundary
at: 2026-07-29T11:05:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Gap-probe — findings-section-boundary

Critic context sạch (agent tươi, 5 input — input thứ 5 = 10 bài học từ các
feature trước qua claim-scan). Cross-check: AC↔eval đủ, không AC mồ côi ·
mọi GWT đo được (AC-10 judgment là chủ đích) · 4 trục Coverage có AC — lỗ ô
R×S nêu ở P1-1 · (cross-layer) không áp, CLI-only. **2/5 finding cite bài
học xuyên-feature.**

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract + evals | Không AC nào buộc bảng luật trong marker phải là thứ `section()` THẬT SỰ đọc — AC-5 đo văn bản, AC-1/2/3 đo hành vi, không có phép nối hai đầu | Implementer để khối marker như comment trang trí rồi hardcode tên `Findings` trong thân hàm: E5 xanh, E1/E2 xanh, E6 xanh, E7 xanh — bảng là single-source GIẢ, sửa bảng không đổi hành vi. Đúng lớp đo-chỉ-dẫn-thay-vì-đầu-ra repo đã dẫm 4 round | Đột biến Ô BẢNG trong bản sao code-sinh rồi chạy gate-card qua bản sao đó: hàng ma phải XUẤT HIỆN; bản nguyên vẹn cùng harness cho 0 hàng ma | fixed: thêm AC-12 + E12 (FSB8) |
| P0 | evals | 4 đối chứng đột biến (E5/E6/E7/E9) kết luận chỉ từ "assert đỏ" — không ghim thông điệp, không có đối chứng dương cùng harness; AC-9 vá lỗi vacuous của PH8 nhưng chỉ ghim nửa âm | Bản sao trong tmp không resolve được `require('../lib/md-section.js')` → runner exit khác 0 → test đọc là "đột biến bị bắt" → XANH trong khi logic phát hiện chưa từng chạy. Cùng hình dạng với [claim-scan-parser-hardening#F1] | Sửa theo LỚP cả 4 case: expected ghi chuỗi lỗi NGUYÊN VĂN khi đột biến + bản nguyên vẹn cùng harness phải XANH; AC-9 thêm vế dương | fixed: 4 expected siết (E5/E6/E7/E9) |
| P1 | contract + evals | Ô R×S `evidence-page` × section-BẢNG bỏ trống — AC-1/2 chỉ chạy gate-card, AC-4 chỉ đo văn xuôi | evidence-page vẫn nuốt bảng đuôi qua đường khác: thẻ sạch nhưng trang evidence Cổng 2 có hàng ma; E4 xanh vì chỉ đếm AC. Đúng hình dạng [gap-probe-presence-hook#F1] | Hoặc AC hành vi trên chính fixture E1, hoặc Out of scope nêu tên kèm CE grep call-site | fixed: Out of scope ghim ô R×S + assert call-site vào AC-6/E6 |
| P1 | contract + evals | AC-11/E11 chỉ đo DRIFT (`sync --check`), không AC nào CHẠY bản mirror có require mới | `lib/md-section.js` vào mirror sai chỗ/bị rsync bỏ qua → mọi eval cây-nguồn xanh 11/11; consumer cài plugin gọi gate-card → `Cannot find module`, thẻ không render | Smoke DƯƠNG trên bản mirror: chạy `plugins/acceptance-gate/scripts/gate-card.js --extract`, assert exit 0 + đúng số AC | fixed: AC-11 mở rộng + E14 |
| P1 | contract + evals | AC-8 tuyên bố cả 4 suite nhưng E8 chỉ chạy `plugins` — không eval nào chạy suite hooks | Hook parse cùng section đỏ sau đổi ranh giới nhưng không executor nào chạm; evidence ghi AC-8 PASS trong khi một phần tư lưới chưa chạy | Thêm eval chạy `config:executors.test.hooks`, ghim số case > 0 | fixed: thêm E13 |
