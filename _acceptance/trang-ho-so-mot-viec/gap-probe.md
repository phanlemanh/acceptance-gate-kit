---
slug: trang-ho-so-mot-viec
at: 2026-10-11T00:20:00Z
verdict: findings
p0: 1
p1: 4
p2: 0
---

# Phản biện context sạch — trang-ho-so-mot-viec

Một tác tử tươi đọc design + contract + evals + sổ quyết định + bài học xuyên feature (claim-scan) +
ô cơ hội; không đọc mã. Một lượt, không phản biện lại sau khi sửa.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals | E12 đòi sáu câu trả lời được trên màn đầu, nhưng dải chín ô không có ô «hứa gì», còn «quyết gì» chỉ có ô ai ký; AC-12 và E12 nói khác nhau | Vật đúng design mà người chấm trung thực ghi FAIL, hoặc người chấm dễ dãi đọc `da_giao` thành «hứa gì» — cùng hình dạng [loc-paths-dong-mac-dinh#F1] | Bảng «sáu câu → ô/mục có tên» trong design; E12 chấm theo bảng | fixed: design thêm bảng «Sáu câu → chỗ trả lời»; AC-12 và E12 chấm đúng bảng đó (mục gập mở bằng một phím được tính) |
| P1 | design | Ô `vi_sao` lấy đoạn đầu mục «Vấn đề & ai gặp», trong khi ô cơ hội đời mới mở mục đó bằng dòng neo `Gốc:`; kho thử viết tay đúng khuôn bên đọc | Trên hồ sơ thật, ô «vì sao» in con trỏ `Gốc: crm/…` thay cho lý do, E1 vẫn xanh | Ô cơ hội của kho thử do bộ viết thật (`--mo-o`) sinh; ca trên hồ sơ thật của chính vòng | fixed: luật bỏ đoạn neo/trích/«Mở từ hàng»/câu giao vào design; AC-1 + E1 dùng `--mo-o` thật và thêm ca `vi-sao-that` trên ô cơ hội của chính hồ sơ này |
| P1 | evals | Số LT1 (26/16, 3 lượt, 140.353) chỉ đo trên bản sao do code dựng đúng khuôn bộ đọc | Sổ LT1 thật có dòng lệch luật, trang ra số khác mà E3/E4 vẫn xanh | Bước máy trên bản sao LT1 thật so bốn số | fixed: AC-12 + E12 thêm bước máy gọi mô-đun trên LT1 thật (bung từ crm) và so 26/16/3/140353; phần «báo cáo token do bộ ghi thật sinh» rejected: bộ ghi đọc bản ghi phiên Workflow, không dựng được trong ca — LT1 thật là đầu ra của chính bộ ghi đó |
| P1 | design | Tra số PR bằng git không khai hành vi khi gốc không phải kho git hoặc mã không có trong kho | E12 vẽ trên thư mục bung từ `git archive` (không `.git`) thì hỏng; CI clone nông đỏ | Ca «không git» + luật «git lỗi → chưa gộp» | fixed: design ghi luật; AC-5 + E5 thêm ca `khong-git` (không `.git` · sha lạ → «chưa gộp», thoát 0, stderr rỗng) |
| P1 | contract | Giả định 2 của ô cơ hội đòi quét hồ sơ kit + crm, AC-6 chỉ quét kit, không dòng `descope` | Một dòng hồ sơ crm làm mô-đun ném lỗi, crm nhận mốc thì vỡ trang — cùng lớp [lan-ghim-lai-theo-paths#F1] | Quét mọi hồ sơ có báo cáo của crm qua `git archive` | fixed: AC-12 + E12 bung trọn `_acceptance/` crm ở `10063a25e` và chạy bộ vẽ trên mọi hồ sơ có báo cáo, 0 ca lỗi (máy chấm chạy trên máy có kho crm; CI của kit không có crm) |
