# Thiết kế — lan-ghim-lai-giu-tron-loi-loi

Ngày 03/10/2026 · hạng T2 · ô `_acceptance/lan-ghim-lai-giu-tron-loi-loi/` (Cổng Đáng ký 02/10;
phạm vi bổ sung (a) ký 03/10 cùng chạm ở Cổng Đáng `lan-ghim-lai-theo-paths`).

## Ý định (chốt ở Cổng Đáng)

Khi làn ghim lại đỏ, phiên điều phối chẩn đoán được từ nhật ký làn mà không phải chạy lại toàn
kho; chi phí lượt đỏ và thời lượng mỗi làn hiện trong sổ. Không đổi nghĩa xanh/đỏ.

## Ba thay đổi, cùng một tệp `feature-loop/scripts/repin-lane.mjs`

1. **Lời lỗi trọn.** `runCmd` gặp lệnh thoát khác 0 → ghi TRỌN stdout + stderr (theo thứ tự
   nhận, mỗi luồng một khối có nhãn) ra
   `.acceptance-runs/<slug đầu>/repin-<run_id>/<NN>-<nhãn>.log`, in đường dẫn tương đối gốc kho +
   30 dòng cuối như hôm nay. Lệnh xanh → không tạo tệp nào. Thư mục theo quy ước có sẵn
   (`eval-executors.md` «Where a run writes its artifacts»), thêm `.acceptance-runs/` vào
   `.gitignore` của kit (kit tự vi phạm quy ước của mình — đo 03/10).
2. **Dấu lượt đỏ.** Làn đỏ (suite đỏ · eval lệch kỳ vọng · chạm hồ sơ đã thông cổng) → TRƯỚC khi
   thoát 1, append vào run-log CỦA TỪNG slug một dòng
   `{"ts","kind":"repin-do","run_id","sha","suites_exit","evals_exit","lenh_do":[{"cmd","exit","log"}],"cham":[…],"wall_s","so_lenh","tai":{…}}`.
   Không dòng `kind: repin`, không chạm `evidence-report.md`. Thông điệp đỏ đổi «không ghi gì»
   thành «không ghi pin — để dấu lượt đỏ ở run-log».
   Tên loại `repin-do` được chọn để KHÔNG khớp so khớp `"kind":"repin"` nguyên văn của
   `loop-health.mjs`, `recheck-evidence.cjs`, `evidence-core.cjs` (đo 03/10: mọi bộ đọc sổ lọc theo
   loại riêng của nó).
3. **Thời lượng (việc (a)).** Dòng `kind: repin` xanh và dòng `repin-do` mang `wall_s` (giây, một
   số lẻ, từ lúc bắt đầu suite đầu tới lúc eval cuối xong) và `so_lenh` (số lệnh KHÁC NHAU thực
   chạy — sau gộp lệnh trùng). Khuôn `REPIN-TEMPLATE` trong SKILL feature-loop thêm hai khoá
   (ca LN5 giữ script ↔ khuôn khớp).

## Dòng tự xưng của bàn đo (`tai`)

`{"load1","load5","ncpu","mem_free_mb","swap_used_mb","nen"}` — `os.loadavg()`, `os.cpus().length`,
`os.freemem()`; swap: macOS `sysctl -n vm.swapusage` (trường `used =`), Linux `/proc/meminfo`
(`SwapTotal − SwapFree`); không đọc được → `null` và `nen` ghi lý do. Đọc tải KHÔNG BAO GIỜ được
làm sập làn: mọi lỗi nuốt về `null`. Bộ đọc là mô-đun riêng `feature-loop/scripts/tai-may.mjs`
(hàm `docTai()` + hàm thuần `swapTuMeminfo(text)`), nguồn đọc là hằng đầu tệp — để răng gọi trực tiếp
và tiêm «nguồn không tồn tại» trong bản sao trên cả hai nền (phản biện 03/10, P1).

`lenh_do[].log` là đường TƯƠNG ĐỐI GỐC KHO (`--root`); eval lệch kỳ vọng mà thoát 0 và ca chạm hồ sơ
không có nhật ký → `log: null` kèm `ly_do` (`lech-ky-vong` · `cham-ho-so`).

Dòng `tai` chỉ ghi khi làn đỏ (mục đích: số cho nhát đã hoãn «chạy lại rồi đi tiếp có cờ»); dòng
xanh không mang `tai` (đủ `wall_s`).

## Không đổi

Mã thoát của làn ở mọi ca (0 · 1 · 2 · 3). Bộ đọc 2.20 (pre-merge, recheck, thẻ, loop-health,
nhãn cạnh gãy) không sửa — đã đo im với cả dòng loại mới lẫn hai khoá mới (giả định 1 của ô, 03/10).

## Kiểm thử

Bộ răng hồ sơ `rang.sh` + `rang/*.mjs`, kho fixture code-sinh, pin do writer thật ghi; bản base cho
vi phân lấy trọn `scripts lib feature-loop` bằng `git archive` tại merge-base.
