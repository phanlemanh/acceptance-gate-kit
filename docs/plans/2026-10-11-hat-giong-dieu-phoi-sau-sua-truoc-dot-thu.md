# Hạt giống — hai lỗ của việc giao hàng theo quyết sau vòng sửa trước đợt thử

Gốc: `_acceptance/dieu-phoi-sua-truoc-dot-thu/` (lượt chấm 1 ngày 11/10/2026, Cổng Bằng chứng ký 11/10 —
Ngoài-1, Ngoài-3, owner: mở hợp đồng mới). Hạt giống là SỔ, không phải ô: chỉ mở thành ô khi có neo ngoài —
một đợt thử thật (crm ~26/10, OneFlow ~27/10) vấp đúng lỗ. Gộp theo lớp: cả hai là hệ quả của B1 (đợt mở từ gói
chỉ giao hàng đã quyết build) mà vòng không đặc tả.

## Lỗ

1. **Dãy chờ chữ build im lặng (Ngoài-1).** `chonHangKe` (`dieu-phoi/scripts/lich.mjs`) trả
   `{hang: null, cho: 'cong-dang'}`; sự kiện `hang-ke` không mang `can_phan`, hành động `khong-hang` là `du`
   trong chẩn đoán, và việc chờ không đọc `tiep/` — nên một hàng người chưa gõ build đứng yên mà không mặt nào
   báo người, trừ một dòng ở `tiep-tuc` dạng đủ. Hướng: lý do `cong-dang` lên khối việc chờ của giám sát (mặt đã
   có), không thêm lượt gọi.
2. **Hàng kế lật khi người ghi build muộn (Ngoài-3).** Hàng chỉ là `dang` khi worktree đã có `contract.md`; thợ
   đang ở S0 của hàng B mà người ghi build cho hàng A ưu tiên cao hơn thì nhịp kế đổi `tiep/` sang A — phiên
   thợ chết thì `tiep-tuc` mời mở A, việc dở của B bị bỏ rơi. Hướng: giữ hàng đã giao (`tiep.hang`, `moi`) khi
   nó còn `chua` và đã quyết.

## Ngưỡng mở ô

Một đợt thử thật gặp đúng một trong hai lỗ (hàng đứng ở `cong-dang` mà không ai biết, hay một dãy bỏ dở hàng vì
hàng kế lật) — khi đó ô mang `Gốc:` trỏ hồ sơ của đợt thử ấy.
