# Hạt giống — làn máy thoát phép kiểm bằng-chứng-cũ (27/08)

Ô đề nghị: `_acceptance/lan-v-thoat-kiem-stale/`

Phát hiện ngoài hợp đồng ở vòng 4 của `thuoc-nhan-de-khoi`. **Không sửa lẫn
vào hồ sơ đó** — đây là lỗi engine, phạm vi toàn kit, cần chiều đỏ riêng.

## Vấp

Cổng trước-merge có hai lưới độc lập: lưới **xanh-sạch** (đủ sáu điều kiện thì
máy đi tiếp, không mời ký) và lưới **bằng-chứng-cũ** (mã đổi sau khi verify thì
phải chạy lại). Trong `scripts/pre-merge-check.sh`, nhánh xanh-sạch `continue`
**trước** khối kiểm bằng-chứng-cũ. Hệ quả: mọi hồ sơ đi làn máy đều **thoát
hoàn toàn** phép kiểm thứ hai.

Đo thật trên cây ngày 27/08 (chạy `bash scripts/pre-merge-check.sh`):

- **63 hồ sơ** bị bắt `VIOLATION … evidence is stale`.
- `thuoc-nhan-de-khoi` — đi làn máy, xanh-sạch — **không có dòng nào**, chỉ in
  `NOTE … xanh-sạch — máy đi tiếp, KHÔNG mời ký`, trong khi
  `git diff --name-only <verified_commit>` của nó trả về 3 file ngoài
  `_acceptance/` và ngoài `t1_skip_globs` (gồm chính cái script nó đang chứng).

Cùng lần chạy: `tool-kill-duong-doc-lap` và `vao-co-o-ra-co-ten` — đã có chữ ký
— đều bị bắt stale. Chỉ hồ sơ máy-thông là lọt.

## Vì sao đáng một ô

Đây là **máy tin nhầm chính nó ở tầng cổng**, đúng tim nguyên tố «bằng chứng
không tự dối». Làn máy tồn tại được là nhờ lời hứa *máy đi trước nhưng lưới
vẫn canh*; lỗ này vô hiệu một nửa lời hứa đó cho cả **21 hồ sơ** đang mở cửa
veto. Và nó im lặng: cổng in màu xanh, không ai biết phép kiểm đã không chạy.

Lớp lỗi đã có tên trong sổ: **cổng chặn nhầm chỗ** (thứ tự nhánh làm một lưới
không bao giờ tới lượt).

## Vấp thứ hai, cùng họ — ngăn «ngoài hợp đồng» bốc hơi

Vòng 3 của cùng hồ sơ phân loại **8 finding** vào ngăn *ngoài hợp đồng*, nhưng
`evidence-report.md` do bước tổng hợp sinh ra có section `## Ngoài hợp đồng`
**rỗng**. Cổng đọc «Ngoài hợp đồng rỗng» → tính là xanh-sạch → hồ sơ đủ điều
kiện đi tiếp mà **không ai nhìn 8 mục đó**.

Hai vấp này khác chỗ hỏng (một ở cổng, một ở bước tổng hợp) nhưng cùng một hậu
quả: điều kiện xanh-sạch được thoả bằng **sự vắng mặt của dữ liệu**, chứ không
bằng sự sạch thật.

## Đề bài khi mở ô

1. Nhánh xanh-sạch phải chạy phép kiểm bằng-chứng-cũ **trước** khi `continue`.
   Chiều đỏ: dựng hồ sơ làn-máy xanh-sạch có `verified_commit` cũ → cổng phải
   `VIOLATION`; bản nguyên vẹn phải xanh.
2. Ngăn *ngoài hợp đồng* trong báo cáo phải mang đúng số mục mà bước phân loại
   trả về. Chiều đỏ: kết quả có N mục ngoài hợp đồng mà báo cáo rỗng → đỏ.
3. Xét thêm: điều kiện «rỗng» ở mọi lưới xanh-sạch nên đo *hiện-diện-và-rỗng*,
   không phải *vắng-mặt* — vắng mặt là chưa biết, không phải sạch.

Nguồn: `_acceptance/thuoc-nhan-de-khoi/review-findings.md` (vòng 3 + 4).
