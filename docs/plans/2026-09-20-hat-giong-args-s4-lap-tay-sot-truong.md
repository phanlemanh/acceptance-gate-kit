# Hạt giống — Args S4 đi qua tay phiên lái thì sót trường; Workflow cần nhận tệp

**Ngày:** 2026-09-20 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2
(`feature-loop/workflows/acceptance-verify.js` + SKILL feature-loop S4#1).
**Sinh từ:** hồ sơ `_acceptance/ghim-lai-noi-ra-o-khong-do/` — hai lượt chấm liên tiếp
(20/09) phiên lái lắp args sót một trường KHÁC NHAU mỗi lần.

## Lỗ

`s4-args.mjs` sinh trọn tệp args (≈37 KB) đúng theo `S4-ARGS-CLAUSE` — nhưng công cụ
Workflow chỉ nhận `args` INLINE, không nhận đường dẫn tệp. Phiên lái phải đọc tệp rồi
chép lại vào lời gọi, và khi tệp đổi giữa hai lượt thì chép lại từ hai lần in khác nhau.
Kết quả đo:

| Lượt | Trường sót | Hệ quả (workflow tự khai ở `logs`) |
|---|---|---|
| round 2 | `ngoaiVatFiles` | «lọc ngoài-vật chạy bằng MẪU glob cho MỌI đường dẫn (đường đọc-cũ)» |
| round 3 | `diffFiles` | «không phân biệt được miền, mọi đường dẫn đi đường MẪU» |

`boNgoaiVat = 0` cả hai lượt nên không mục nào bị bỏ oan — nhưng «lắp tay» chính là lớp
lỗi mà `S4-ARGS-CLAUSE` cấm, và nó tái diễn ở chỗ script không thể phòng: sau khi script
đã sinh xong.

## Việc

Một trong hai, rẻ trước:

- Workflow script nhận `argsPath` và tự `readFileSync` — tệp là nguồn, lời gọi chỉ mang
  con trỏ (đóng hẳn lớp «chép tay»); hoặc
- `s4-args.mjs` in thêm một dòng `args_hash` và workflow so băm của args nhận được với băm
  trong tệp — sót trường thì BLOCKED có tên, không chạy đường đọc-cũ lặng.

## Ngưỡng mở ô

Đã đạt (2/2 lượt). Mở kèm khi có vòng khác chạm `acceptance-verify.js` hoặc `s4-args.mjs`.
