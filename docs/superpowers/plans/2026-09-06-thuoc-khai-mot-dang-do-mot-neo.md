# Plan — thuoc-khai-mot-dang-do-mot-neo

Nguồn: `docs/superpowers/specs/2026-09-06-thuoc-khai-mot-dang-do-mot-neo-design.md`
Hợp đồng: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/contract.md` (T2, làn V, 10 AC).

Luật chung cho mọi task: một phép đo MỚI chỉ tính xong khi có cặp hai chiều trên CÙNG fixture —
vật lành thì xanh, phá vật thật trong bản sao thì đỏ với thông điệp ghim. Verify per-task phải
chứa lượt phá thử.

## Task 1 — Vật A: tách `check_lane` thành hai vế, thêm ba ca mới

- **Files:** `_acceptance/inputs-tinh-tu-goc-kho/rang.sh`
- **Làm:** ba hằng mốc (`MOC_KY=9b3d6f64…`, `MOC_GOP=1765b550…`, và `REL_WF` sẵn có).
  `lane_song(repo)` so `REL_WF` tại HEAD với bản tại `MOC_KY` → đỏ ghim `lane hội đồng đã đổi`.
  `tap_file(repo, base, tip)` liệt kê file mã đổi trong khoảng → đỏ ghim `tập file mã đổi ≠ {…}`.
  Cả hai kiểm mốc có mặt trước, thiếu → đỏ ghim `mốc đã neo không có trong kho`.
  Nhóm `lane-doc-khong-doi` chạy: đối chứng dương hai vế · chiều đỏ 1 (clone sửa workflow) ·
  chiều đỏ 2 (kho giả dựng tại chỗ, gọi `tap_file` với hằng của chính kho giả) · chiều đỏ 3
  (kho không có mốc) · ca hai-lượt-một-kết-quả (clone detached ở commit khác, so đầu ra từng byte).
- **Phục vụ:** E1, E2, E3, E4, E5.
- **Verify:** `bash _acceptance/inputs-tinh-tu-goc-kho/rang.sh --chan lane-doc-khong-doi` xanh;
  rồi phá thử: sửa tạm `acceptance-verify.js` trong cây làm việc → đối chứng dương vế lane phải ĐỎ.
- **independent:** false (Task 3 đọc kết quả).

## Task 2 — Vật B: P86 trích số rồi so quan hệ

- **Files:** `tests/plugins/run-tests.sh`
- **Làm:** thay vòng `if so not in khoi` bằng `doc_ngan_sach(khoi, lang)` trả `(luot, t3, ship)`
  qua ba biểu thức bám ngữ cảnh cho mỗi ngôn ngữ; vế không khớp → trả tên vế thiếu.
  `kiem` khẳng định `luot == len(ids) - 1` · `t3 == luot + 1` · `ship == 1`, mỗi dòng đỏ NÊU SỐ THẬT.
  Câu VE in số từ biến: `P86 VE: ngan sach doc duoc VI 3/4/1 · EN 3/4/1`.
  Thêm bốn mutant: `ngan sach luot 3->9` · `tran T3 4->5` · `xoa ve moc phat hanh` ·
  `them cong nhung giu ngan sach`. Giữ nguyên năm mutant cũ.
- **Phục vụ:** E6, E7, E8, E9.
- **Verify:** `ONLY_BLOCK=P86 bash tests/plugins/run-tests.sh` xanh và in đủ chín dòng MUTANT;
  rồi phá thử ngoài suite: đổi `≤3 lượt/vòng` → `≤9` trên cả hai bản chép, P86 phải ĐỎ (trước khi
  vá ca này XANH — đó là bằng chứng chiều đỏ mới sinh ra).
- **independent:** true so với Task 1 (khác file, khác vật).

## Task 3 — Không hồi quy và ô đo phụ

- **Files:** không sửa; chỉ chạy.
- **Làm:** bốn suite của kho, `product-map.mjs --root . --check`, bảy nhóm còn lại của `rang.sh`.
- **Phục vụ:** E9, E10, E11.
- **Verify:** tất cả exit 0; `product-map --check` in `khớp hồ sơ xưởng.`
- **independent:** false (chạy sau hai task trên).
