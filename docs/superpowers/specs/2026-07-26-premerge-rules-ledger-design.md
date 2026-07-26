# Sổ luật-đã-chạy: `clean` phải được CHỨNG MINH, không phải mặc định — thiết kế

**Ngày:** 2026-07-26 · **Slug:** `premerge-rules-ledger` · **Tier:** T3

## Vấn đề — đo trên 6 round S4 của feature trước

Bốn bản vá liên tiếp cùng vùng parse của `pre-merge-check.sh`, mỗi cái đúng
từng cái một mà tổng không hội tụ:

| Round | Lỗ | Bản vá |
|---|---|---|
| 4 | cờ lạ nuốt thành ROOT → `clean`, exit 0 | chặn `--*` |
| 5 | `-no-t1-escape` một gạch lọt | mở rộng `-*` |
| 6 | `--base --no-t1-escape` nuốt cờ làm GIÁ TRỊ | chặn `-*` ở vị trí giá trị |
| 6 | glob bỏ dotfile → `plugins/.x/` miễn trừ không ai so | `find` thay glob |

Chữ ký chung: **blacklist trên không gian đầu vào mở** — mỗi biên vá xong lại
có biên kế bên, vì danh sách "thứ có thể sai" là vô hạn. Và mọi lỗ vi phạm
CÙNG một bất biến:

> **Tín hiệu `clean` chỉ được phép phát khi các luật thật sự đã chạy.**

Hiện `clean` là *mặc định* — script chạy tới cuối mà `violations == 0` thì in
`clean`, bất kể các khối luật có thực thi hay bị trượt qua vì đầu vào hỏng,
biến rỗng, hay một `continue` đặt sai. Mọi lỗ tương lai cùng lớp (chưa nghĩ
ra được) đều sẽ biểu hiện y hệt: `clean`, exit 0.

## Giải pháp — một điểm nghẽn ở ĐẦU RA

Đảo mặc định: `clean` phải được **chứng minh bằng sổ**.

1. **Sổ luật (rules ledger).** Danh sách các khối luật của script là ĐÓNG và
   biết trước lúc parse xong config: `per-slug` (evidence/signoff/verdict/
   staleness/recheck cho TỪNG slug đã liệt kê) · `gap-probe-scope` ·
   `t1-escape`. Mỗi khối khi chạy trọn ghi một dòng vào sổ:
   `ran <tên>`; khi tắt CÓ khai báo (marker `NOT ENFORCED`, `gap_probe: off`,
   `--no-t1-escape`) ghi `declared-off <tên>`.
2. **Điểm nghẽn duy nhất, trước khi kết luận.** Trước dòng `clean`/`blocked`:
   `expected == ran + declared-off`, từng tên khớp từng tên. Lệch → in
   `VIOLATION [ledger]: luật <tên> không chạy và không khai tắt` và exit 2.
   KHÔNG có đường nào khác in `clean`.
3. **Dòng tổng kết máy-đọc** (ghim nguyên văn, cùng doctrine marker ADR 0004):
   `pre-merge-check: rules ran=<n> declared-off=<m> expected=<k>` — `k` TÍNH TỪ
   EXPECTED, độc lập với n+m (in `n+m` là tautology tự khớp, không bao giờ
   hiển thị lệch được); lần `VIOLATION [ledger]` vẫn in dòng này với
   `n+m != k` làm bằng chứng. CI grep
   được, người đọc log thấy được cổng đầy đủ đến đâu.

Vì sao cái này bắt được **cả lỗ chưa nghĩ ra**: nó không cần biết đầu vào hỏng
*kiểu gì*. ROOT sai, base nuốt cờ, `continue` lạc, biến rỗng dưới `set -u`,
khối bị comment nhầm — tất cả đều làm một tên thiếu trong sổ, và điểm nghẽn
từ chối kết luận.

### Đã loại: vá tiếp vòng parse (blacklist thứ năm)

Ba tín hiệu ngừng vá đều đã bật: bản vá thứ tư cùng vùng; bất biến chỉ sống
trong comment/test chứ cấu trúc không cưỡng chế; và một phần lỗ nằm ngoài tầm
diff (bản script đã vendor). Vá thêm là lặp lại đúng vòng round 4→6.

### Đã loại (phạm vi này): chuyển parse sang Node

Đúng hướng về chất liệu (argv là mảng đóng) nhưng là phẫu thuật lớn hơn nhiều
— `pre-merge-check.sh` phải chạy được trên máy consumer không đảm bảo node ở
bước parse (chính AC-14 của gap-probe cho phép vắng node ở mode advisory).
Ghi `Out of scope`, cân nhắc lại sau khi sổ luật chạy ổn một thời gian.

## Ranh giới

- KHÔNG đổi hành vi của bất kỳ luật nào — chỉ thêm sổ và điểm nghẽn.
- KHÔNG thêm cờ mới. KHÔNG đổi format marker hiện có.
- Lối ra sớm `no _acceptance/ — nothing to check` GIỮ nguyên (repo chưa cài
  kit là trạng thái hợp lệ) — nhưng nó phải in đúng thông điệp đó, và ROOT đã
  được kiểm tồn tại từ round 6.
- Bản vendored cũ ở consumer: ngoài tầm (biên phân phối) — đã có cảnh báo
  version-floor trong tài liệu từ feature trước.
