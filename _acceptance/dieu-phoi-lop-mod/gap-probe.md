---
slug: dieu-phoi-lop-mod
at: 2026-10-11T02:52:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

# Phản biện context sạch — dieu-phoi-lop-mod

Một tác tử tươi đọc đúng năm tệp: design doc, contract, evals, sổ quyết định, và bài học từ feature trước
(claim-scan, advisory). Không đọc mã. Một lượt, không phản biện lại sau khi sửa.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals | Số ô của chiều đỏ E1, E2 gõ tay và mâu thuẫn với chính ma trận (E1 ghi 5 ô cho đột biến gỡ timeout trong khi ma trận có 11; E2 ghi 3 ô node --check trong khi tối thiểu 4) — cùng lớp [d-20261010T135556Z-8] và [evals-sat-le-doc-du#F1] | Vật đúng mà ca đột biến so bằng nhau với con số sai → not ok, lượt chấm đỏ oan; hoặc người làm tỉa ma trận cho khớp số, bỏ đúng những ô cờ mang giá trị mà H2 cần đo | Tập ô kỳ vọng của mỗi đột biến rút bằng code từ ma trận, kiểm 0 < số < tổng trước khi so | fixed: AC-1, AC-2, E1, E2 — tập ô đỏ rút bằng code từ ma trận theo token của vỏ bọc hay cờ bị đột biến, in số, kiểm 0 < số < tổng; design §4 C1 ghi luật này |
| P1 | design, contract, evals | Ma trận AC-1 chỉ phủ 11 trên 29 dạng cờ mà chính design §4 C1 liệt kê, thiếu cả `timeout -k`, `caffeinate -t`, `caffeinate -w` (cờ mang giá trị) và `env -P`, `env -v` mà Coverage chân ngành tự trích | `caffeinate -t 3600 node …/repin-lane.mjs --write` bị khai sai là cờ trần → `3600` đọc thành tên lệnh → null → hook cho qua khi P2 giữ khoá s4, hai S4 chồng nhau; E1 vẫn xanh | Ma trận liệt đủ mọi dạng của danh sách, số assert = số ô; thêm đột biến khai `caffeinate -t` là cờ trần | fixed: design §4 C1 thành bảng đóng 41 dạng của 8 vỏ bọc (thêm `-f`, `-p`, `env -P`, `env -v`, `--split-string=`, dạng trần), nguồn man page; AC-1 = 41 × 3 + 3 nguyên văn + 2 chuỗi lồng = 128 ô; đột biến (b) `caffeinate -t` cờ trần |
| P1 | contract, evals | Đường mod gọi CLI chỉ đo qua `process.run` giả trả dữ liệu mẫu bất kể argv và cwd; kịch bản 4 (`node` chạy được trên desktop) không có hàng trong bảng và không tiêu chí nào có nhánh «không gọi được» | App desktop mở từ GUI có PATH tối giản → `process.run` lỗi ENOENT, hoặc chạy ở cwd khác → `{"dot":null}`: dải không bao giờ vẽ trên desktop mà E7, E8, E8b, E9 vẫn xanh | Stub ghi argv và cwd, so bằng nhau; đột biến bỏ cwd phải đỏ; thêm hàng kịch bản 4 và tiêu chí cho nhánh không gọi được | fixed: design C3 truyền `cwd` tường minh, lỗi gọi CLI hiện một dòng trên dải, thêm nhánh dự phòng đọc tệp bằng `$.fs` + `moHinh` khi đo thấy `node` không chạy được; AC-8, E8b thêm ca `goi-cli`, `loi-cli`, đột biến `bo-cwd`; AC-6, E6 thêm hàng 5 và ca `hang-5` |
| P1 | contract, evals | Nhật ký thăm dò ghi vào scratchpad — ngoài `paths` của E6 và `inputs` của E6b, bị dọn trước lượt chấm; E6 chỉ kiểm dòng trích có tồn tại; nhánh «không tới» không có đối chứng dương rằng hộp quyền của tác tử Workflow đã thật sự hiện; nhánh «không đo» chỉ kiểm một dòng README | Bảng trích một dòng permission_prompt của chính phiên cha → E6 PASS, README ghi «C2 phủ», crm bỏ luật 52 mà K3b vẫn mù; hoặc auto mode không hỏi `eval true` → không hộp nào hiện → «không tới» xanh rỗng | Nhật ký vào `evidence/`; parse dòng trích theo kịch bản; nhánh kết luận đòi đối chứng dương; nhánh «không đo» kiểm đủ hai dòng giới hạn | fixed: design §6 — mod ghi thẳng `evidence/tham-do.jsonl`, mỗi kịch bản có dòng mở/đóng, đối chứng dương cho câu 1 (tool.call mang agentId bị người từ chối), không có thì chạy lại một lần với lệnh khác rồi ghi «không đo được»; AC-6, E6 (ca `doi-chung-cau-1`, cửa sổ kịch bản), E6b đọc thêm tham-do.jsonl |
| P2 | evals | Ca DP6-05 nang-cap là assertion âm-tính-một-mình trên fixture viết tay đúng khuôn bên đọc | Bộ phát lịch mới ném khi khoá sổ vắng → nhịp chết, 0 dòng, ca xanh; đợt thật nâng gói giữa chừng thì Monitor không bao giờ thức | Dựng đợt bằng bản merge-base, kiểm nhịp bản mới thoát 0 và tiến, rồi đối chứng dương trên cùng đợt | fixed: AC-5, E5 — đợt dựng và chạy nhịp bằng bản merge-base (git archive trọn `dieu-phoi/`), nhịp bản mới thoát 0 với `nhip_cuoi` tiến, rồi tệp chờ người mới của P3 phải sinh đúng 1 dòng mang `can_phan` |

Ghi chú của người phản biện, đã xử lý cùng lượt: E8 dùng hai số khác nhau (2 đơn, 1 chờ người) và so BẰNG cả dòng
dải viết sẵn thay vì ghim tiền tố; ca ghim `TZ`; E3 dựng kho thử dưới thư mục có dấu cách và `$`, lời chặn bọc
đường bằng `nhayDon` [viec-ke-theo-plan#F1]; E7 «xem-cu» lấy trọn `dieu-phoi/` của merge-base (luật P150). Người
phản biện không lật dòng sổ nào.
