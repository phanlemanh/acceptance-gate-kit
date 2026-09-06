---
slug: co-qua-timebox-nhom-da-xong
at: 2026-09-06T04:06:12Z
verdict: findings
p0: 0
p1: 3
p2: 2
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract + evals | Coverage tuyên ma trận đóng 3 lối × 2 chiều nhưng AC-3 không có vế chưa-hạn và fixture chỉ phủ 4/6 ô; archived chưa hạn và release chưa hạn không ai đo | Lối archived/verdict tính cờ bằng biểu thức khác vị từ → chưa hạn vẫn mang cờ mà iii-b xanh vì không có fixture; (iii) trên cây thật cũng xanh nếu hôm ấy không có hồ sơ như thế — xanh-không-chạy | Thêm fixture ar-chua và rl-chua; 6 ô = 6 assert; AC-3 thêm vế chưa hạn | **fixed:** bảy fixture (6 ô + kill), AC-2/AC-3 có vế chưa hạn, E2/E3 ghim `✗` |
| P1 | design + evals | Chỉ một mutant (lối park/bác); hai lối còn lại không có chiều đỏ; fixture không khoá ô trước khi soi cờ nên fixture rơi nhầm ô vẫn xanh nhờ cờ của ô khác | Fixture parse lệch rơi vào nhóm đang chạy (nơi cờ đã có) → token ✓ xuất hiện cả ở scanner chưa vá lẫn đã vá | Assert ô trước, cờ sau; một mutant mỗi lối | **fixed:** phép soi khoá `grp/stateKey` trước; ba mutant pk-qua · ar-qua · rl-qua; AC-5 và E5 sửa theo. Khi thi công, chính phép soi khoá-ô bắt được một lỗi thật: lối phán quyết không đọc cơ hội nên không có văn bản để tính cờ — sửa bằng đọc riêng cho cờ |
| P1 | design vs evals | Design khai một khoá config trong khi evals dùng ba; câu tóm tắt PASS trong design khác token evals ghim (cùng lớp release-2-8-0 F1: chữ khai ≠ chuỗi máy in) | Implementer theo design → bốn ô đỏ giả; hoặc theo evals → design thành tài liệu sai đã ký | Design liệt đủ khoá và nêu NGUYÊN VĂN câu tóm tắt | **fixed:** design nêu đúng chuỗi nối thêm vào PASS của RT13 và hai khoá config (khoá changelog bỏ vì kho không có CHANGELOG.md, AC-7/E7 gỡ) |
| P2 | evals (E4) | Assertion âm tính «không có `cờ qua-timebox thiếu`» chỉ có nghĩa khi cây thật còn hồ sơ quá hạn; E4 không ghim token dương | PR khác dời Timebox của baseline-127 → (iii) không có hồ sơ để so, E4 PASS rỗng | RT13 in số và tên hồ sơ quá hạn; E4 ghim n ≥ 1 và tên | **fixed:** (iii) in `iii: n hồ sơ quá hạn trên cây thật (tên)`; E4 ghim n ≥ 1 và `baseline-127-tin-hieu-phan-biet`, khai rõ n = 0 thì không phải bằng chứng |
| P2 | evals (E6) | Vế «không sinh lại bản đồ» không có phép đo; paths E6 thiếu file test nơi (ii) sống | `--check` bị nối thêm bước vẽ lại → bản đồ đổi trong lượt verify mà E6 vẫn PASS | Assert `git status --porcelain PRODUCT-MAP.md` rỗng; thêm file test vào paths | **fixed:** khoá `cqt_o_khong_doi` thêm `test -z "$(git status --porcelain PRODUCT-MAP.md)"`; paths E6 thêm file test |
