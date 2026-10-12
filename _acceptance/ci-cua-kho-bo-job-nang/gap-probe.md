---
slug: ci-cua-kho-bo-job-nang
at: 2026-10-11T14:58:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

# Phản biện context sạch — ci-cua-kho-bo-job-nang

Một tác tử tươi đọc đúng sáu tệp (design · contract · evals · sổ quyết định · bài học từ feature trước · ô cơ
hội), không đọc mã kho. Đã sửa artifact theo từng dòng; không phản biện lại (một lượt).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design · contract | Đoạn GUIDE dùng `if: needs.hang-pr.outputs.cham_vat != 'false'` không có hàm trạng thái — GitHub ngầm ghép `success()`, nên câu «đầu ra vắng vì bất cứ lý do gì thì job vẫn chạy» sai; AC-10 chỉ kiểm chuỗi có mặt nên đóng dấu đúng lỗi này | Job `hang-pr` đỏ (lấy kit hỏng, runner lỗi, lỗi nối dây thoát 2) → job `test` bị BỎ QUA, job bỏ qua báo «Success» kể cả check bắt buộc → PR chạm vật gộp được không test, đúng ngưỡng CHẾT của ô | `if:` của job test chứa `!cancelled()` cùng `cham_vat != 'false'`; bảng bốn hàng; chiều đỏ gỡ `!cancelled() &&` | fixed: design §2.5 đổi đoạn mẫu thành `${{ !cancelled() && … != 'false' }}` + bảng bốn hàng; AC-10/E11 đòi cả hai vế trên cùng một dòng `if:` + chiều đỏ ghim «hang-pr hỏng thì test bị bỏ»; giới hạn đã khai: ca đo hình biểu thức, không chạy GitHub |
| P1 | contract · evals | Chiều đỏ AC-3 khai đầu ra `hang=T1` trong khi diff có `_acceptance/config.yaml` thì cổng xếp `ho-so` — đột biến khai sai đầu ra, cùng lớp [evals-sat-le-doc-du#F1] | Bản đột biến ở ca 1 ra `ho-so`/`false`, không phải `T1` → AC-3-do đỏ oan trên vật đúng, người làm bẻ vật hoặc nới phép so | Đột biến ca 1 và ca 3 ra `ho-so`/`false`; đối chứng nguyên vẹn `khong-ro`/`true`; ca 2 không đổi bit, không dùng làm chiều đỏ | fixed: AC-3 và E3 sửa đúng như thước đo đề xuất |
| P1 | contract · evals | AC-8 chỉ so bản đầy đủ với bản cắt marker, cả hai là bản SAU khi sửa — không bắt dòng bị sửa ngoài vùng marker | Người làm đổi một dòng có sẵn ngoài marker (echo sang stderr, `exit 1` → `exit 2`) cho bẫy chạy được; hai bản cùng mang chỗ sửa, AC-8 vẫn xanh trong khi cổng không cờ ở mọi kho đã đổi | So bản cắt với tệp cổng ở commit cố định; chiều đỏ sửa một chữ ngoài marker | fixed: thêm vế lịch sử AC-8-lich-su — mọi commit không-gộp của vòng (tìm bằng `git log --grep` slug) có bản cắt marker bằng bản cắt của commit cha; chiều đỏ trên kho mẫu cha = tệp ở `d9d1f3a6`. Không so thẳng HEAD với `d9d1f3a6` vì mệnh đề đó sai sau commit kế của vòng khác (bất biến phải còn đúng sau 50 commit) |
| P1 | design · evals | Design §2.3 bước 1 tuyên một LỚP mở (mọi lối dừng trước khối phân loại → `khong-ro`, thoát 0) mà AC-4 chỉ lấy mẫu hai lối, không đột biến tổng quát | Một lối dừng hay chỗ hỏng `set -u` ngoài hai mẫu làm chế độ thoát 1 không in ba dòng → job đỏ → (cùng P0) test bị bỏ; E4 vẫn xanh | Hai đột biến chèn trước khối phân loại: `exit 1` · biến chưa khai; mỗi bản ra `khong-ro`/`true`/`khong-phan-loai-duoc`, mã 0, một `::warning` | fixed: AC-4 và E4 thêm ca AC-4-do với đúng hai đột biến, ghim «lối dừng thoát khác 0» |
| P2 | contract | Quan hệ ⟺ của AC-2 ở hàng T3 chưa định nghĩa đủ (tệp T3 vừa khớp `t3_paths` vừa ngoài `t1_skip_globs`) | Cổng in cả non-T1 lẫn T3 paths cho hàng T3 → vế «T2 ⟺ non-T1» sai trên hai hàng T3, hoặc người viết nới phép so thành «có chứa» | Mỗi hàng ghi TẬP loại `VIOLATION [PR]` mong đợi, so tập, 8 khẳng định | fixed: AC-2 và E2 đổi sang so tập viết trước theo hạng (T1 ↔ rỗng · T2 ↔ {non-T1} · T3 ↔ {T3 paths}) |
