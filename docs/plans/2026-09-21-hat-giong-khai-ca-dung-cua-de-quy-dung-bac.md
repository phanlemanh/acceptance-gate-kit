# Hạt giống — Khai ca dừng của đệ quy ở đúng bậc: bậc nào là TIÊN ĐỀ, và nói tên nó ra

**Ngày:** 2026-09-21 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** thiết kế
(chưa phải T-nào — nó đổi hình dạng cổng, không đổi một script).
Gốc: crm/_acceptance/thuoc-khai-dung-tieng — K8 + §4.1 + §4.6 của
`crm:docs/findings/2026-09-20-retro-hang-muc-khai-dung-tieng.md`.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

> Tác giả retro xếp mục này **nặng hơn bảy mục kia cộng lại**: không có ca dừng thì mọi cải
> thiện khác chỉ làm vòng lặp chạy mượt hơn, không làm nó **dừng**.

## Lỗ

Một luật đúng — «phép đo chưa từng đỏ thì không chứng minh gì» — áp lên một sản phẩm **81 dòng**
sinh ra đệ quy: mỗi phép đo cần một cặp hai chiều; mỗi cặp cần một bản sao cây, một máy chủ, một
vật thử; mỗi thứ ấy lại cần phép đo của nó.

**Không bậc nào trong chuỗi được khai là đủ.** Kết quả cộng dồn, không ai quyết:

| vùng | dòng | tỉ lệ so sản phẩm |
|---|---|---|
| Sản phẩm | +81 / −25 | 1× |
| Bộ đo | +4 622 / −189 | **57×** |
| Tổng không-phải-sản-phẩm | **+9 320** | **115×** |

Và khi trần nổ, `s4-args` in ba lối — **lối 3 là «mở vòng có chủ ngữ là thước»**, tức chính cái
vòng vừa đóng. Máy chỉ đường quay lại đúng cái nó đang cố thoát (§4.6). 44 giờ, 96 commit, 12
lượt chấm, ≥6,6 M token, và hạng mục **vẫn chưa xong**.

## Vì sao đây là lỗ CỦA KIT, không phải lỗ của kho

Kit đã có ca dừng **cho chính nó**: luật (a) trong `CLAUDE.md` — «bộ đo được máy kiểm MỘT tầng;
lưới thường trực là trần; KHÔNG mở vòng đo-thước-của-thước». Luật ấy chính là một tiên đề có
tên, và nó đã cứu kit khỏi vòng meta thứ sáu (tiền lệ `khuon-rang-dung-chung`, park 30/08).

Nhưng đó là luật **của người-sửa-kit**, sống trong `CLAUDE.md` của kho này. **Engine không trao
khái niệm ấy cho kho tiêu thụ.** Một kho trống nhận kit về sẽ nhận «mọi phép đo cần chiều đỏ» mà
không nhận «bậc nào được phép dừng» — đúng lớp lỗi đã đo hai lần ngày 19/09 theo chiều ngược
lại (luật của kho rò vào khuôn giao đi).

## Việc

Trao **khái niệm**, không trao hình dạng hẹp: hợp đồng (hoặc Cổng Đáng) khai được một dòng
«bậc N là tiên đề của vòng này» — bậc ấy được chứng minh bằng đối chứng dương + thông điệp ghim,
và **KHÔNG mở vòng đo bậc N+1**. Vượt bậc đã khai = **giới hạn có tên** ghi vào Known limits,
KHÔNG phải vi phạm trần, KHÔNG phải lối «mở vòng có chủ ngữ là thước».

Đồng thời gỡ lối 3 khỏi bảng lối thoát khi trần nổ, hoặc buộc nó mang ngân sách lượt chấm chốt
trước (đã có hạt giống 19/09:
`docs/plans/2026-09-19-hat-giong-vong-meta-vat-la-rang-ngan-sach-luot-cham.md`).

Cặp ở kho tiêu thụ là R1: khai ngân sách thước theo cỡ vật ngay tại Cổng Đáng («vật ~80 dòng →
trần thước ~400 dòng»). Tỉ lệ 57:1 không ai quyết — nó cộng dồn; một dòng ở Cổng Đáng buộc dừng
sớm hơn nhiều.

## Ngưỡng mở ô

Neo đã đủ mạnh (một hạng mục 44 giờ chưa xong ở kho tiêu thụ). Nhưng đây là **meta-work** — luật
đóng băng: mở khi owner gọi tên, sau mốc phát hành gần nhất được một kho tiêu thụ NHẬN. Tới lúc
đó đây là SỔ.
