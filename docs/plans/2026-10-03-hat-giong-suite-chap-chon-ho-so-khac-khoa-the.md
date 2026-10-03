# Hạt giống — suite toàn kho chập chờn ở hồ sơ KHÁC khoá thẻ chưa ký được của mọi vòng

**Ngày:** 2026-10-03 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T3 (đọc nhãn cạnh gãy ở `lib/nhan-canh-gay.cjs`).
Gốc: crm/_acceptance/muc-tieu-va-kr — run-log lượt 5–8 (02/10 21:27Z → 03/10 03:38Z) và sổ
`d-20261002T235907Z-26`; câu hỏi ở trần lượt 03/10 03:38Z.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Ca thật

Sau khi AC-11 thu hẹp, mọi eval của vòng đạt từ lượt 5 (E14: 27 xanh, 14 đỏ sẵn ở nhánh gốc,
0 hồi quy). Bốn lượt tiếp theo (5–8, cộng khoảng 3,5 giờ máy) không chạm mã sản phẩm; mỗi lượt bị
khoá bởi một thứ không thuộc vòng:

| Lượt | Chặn bởi |
|---|---|
| 5 | suite `bun run test` thoát 1 ở `tro-ly-okr-nguon-khoa.spec.ts` (hồ sơ đã ký khác) |
| 6 | phép đo màn của `ux-lai-thu-8c-okr/E15` đỏ dưới tải; chạy riêng trên máy yên xanh 131/131 |
| 7 | tác tử chạy suite toàn kho chết |
| 8 | hai tác tử chết; suite toàn kho lại đỏ ở `nguon-khoa` (đỏ 3/5 lượt) |

Đường nền đầu vòng chạy suite MỘT lần, đúng lúc ca chập chờn xanh, nên không ghi nó là «đỏ từ
trước vòng». Suite thoát 1 bị phân loại như vật hỏng → thẻ khoá, không có ô ký trên cạnh gãy.

## Lỗ

Khối ĐỊNH VỊ (K8): việc chỉ tự sinh từ *sai hợp đồng* và *hệ thống chết* (thử lại một lần); mọi
nhãn khác lên thẻ ở cổng đã có. Một ca chập chờn của hồ sơ khác, đỏ cả ở nhánh gốc, là nhãn — nhưng
kit không có đường đọc nó thành nhãn, nên nó sinh lượt. Cùng lớp với E14: vòng chịu trách nhiệm
sức khoẻ của cả kho.

## Ý (chưa phải cam kết)

Nhãn «đỏ từ trước vòng» cho dòng `SUITE-*` khi cùng lệnh đã đỏ ở nhánh gốc trong chính sổ của
vòng (đường nền hoặc baseline) — đọc bằng `lib/nhan-canh-gay.cjs`, mở ô ký trên cạnh gãy như ca mù.
Cân trên mọi kho: kho có suite xanh ổn định nhận thẻ y hệt. Nghiệm đúng tầng vẫn là kho sửa ca
chập chờn của chính hồ sơ ấy (crm đang làm, 03/10).

## Ngưỡng mở (đang đếm: 1)

≥1 vòng nữa ở bất kỳ kho nào có ≥2 lượt chấm liên tiếp mà mọi eval của hợp đồng đạt, chỉ bị chặn
bởi dòng `SUITE-*` hoặc tác tử chết. Đếm: run-log của vòng — lượt có `failed_evals` rỗng mà verdict
khác PASS.
