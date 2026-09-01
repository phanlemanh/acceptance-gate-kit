# Ba dòng số — vòng `cong-dang-co-cua` (meta), 2026-09-01

> **Việc phải làm ở mốc 2.6.0:** kéo file này vào hồ sơ phát hành. Charter
> 30/08 đòi mỗi mốc đếm tay ba dòng số, và ngưỡng CẮT KIT đọc chính chúng.
> Ghi ở đây vì chưa có hồ sơ phát hành nào mở — đừng để số nằm trong log chat.

## Ba dòng số

| Dòng | Vòng này |
|---|---|
| Thời gian *làm-xong → quyết-được* | không đo được — vòng chưa tới Cổng Bằng chứng, đã thu phạm vi ở dừng-vá |
| **Số lần gọi người / vòng** | **5** (ký Cổng Đáng · duyệt Cổng Phạm vi · cho chạy S4 · gật phạm vi + vòng 2 · quyết dừng-vá) |
| Số vòng bị hạ-tầng-kit đốt lượt chấm | **1** — vòng ở kho tiêu thụ `crm` ngày 01/09, chính là thứ mở phiên này |

Ngưỡng owner khai 30/08: **>3 lượt gọi người/vòng** → mở phiên quyết cắt kit.
Vòng này **vượt**, ở mức 5, và vượt trên một vòng **meta** — loại vòng không có
neo ngoài, giá trị không chạm người dùng cho tới bản phát hành.

## Số phụ, cùng chiều

- **34 phát hiện qua hai vòng chấm. 0 do phép đo máy bắt.** 27 lượt chạy eval
  xanh trọn ở cả hai vòng (`failedEvals` rỗng, `failedCommands` rỗng); mọi lỗi
  đều do rà soát đối kháng tìm ra.
- **Cụm lỗi lớn nhất nằm trong MÃ ĐO**, không nằm trong sản phẩm: r1 11/18,
  r2 8/16 rơi vào `_acceptance/*/rang.sh` và `tests/scripts/run-tests.sh`. Cờ
  `coverageCluster` bật ở CẢ HAI vòng.
- **~6,2 triệu token · 87 agent** cho hai vòng chấm.
- **Bốn lần thước tự dối**, đều do chính phép đo bắt trong lúc thi công: gọi hàm
  trong vùng chết · chứng-minh-lệnh-tiêm bằng đếm byte (hai chuỗi dài bằng nhau)
  · ca tự-canh quét sai file · và **bốn assertion của lưới thường trực chưa bao
  giờ chạy** (một thuộc hồ sơ đã ký).

## Đọc số này thế nào

Một vòng là mẫu **n = 1**. Nó KHÔNG đủ để cắt kit, và phiên quyết đó là của
owner, mở theo lịch của owner. Nhưng ba điều nó nói đã đủ rõ để không quên:

1. **Bộ răng viết-tay-theo-hồ-sơ không tự trả phí.** 127 assert xanh không phân
   biệt được cây lành với cây hỏng ở bất kỳ lỗi nào trong 34 lỗi; và chính chúng
   là bề mặt lỗi lớn nhất của vòng.
2. **Giá trị thật của vòng đến từ rà soát đối kháng**, thứ không cần bộ răng
   riêng cho từng hồ sơ.
3. **Lớp lỗi tái phát qua hai vòng liên tiếp** — cờ-người-dùng-xuyên-chốt ·
   hai-nguồn-cho-một-luật · đối-chứng-chép-công-thức — nên khuôn sai chứ không
   phải chi tiết sai. Ô `khuon-rang-dung-chung` (park 30/08) là chỗ lớp đó
   thuộc về, và chính nó cũng đã không hội tụ qua hai vòng S4.

Hồ sơ đầy đủ: `_acceptance/cong-dang-co-cua/` (hợp đồng thu phạm vi ·
`evidence-report.md` r2 · `review-findings.md` · `discovery/LAY-VE-LAN-THE.md`).
Bản r1 lấy ở commit `d90af7d2`. Cây ghim còn nguyên làn thẻ: `528caaa8`.
