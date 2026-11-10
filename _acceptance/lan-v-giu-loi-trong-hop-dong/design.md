# Thiết kế: làn V giữ lại hồ sơ còn lỗi trong hợp đồng

Ngày 10/11/2026. Hạng T3 vì chạm `lib/**` và `scripts/pre-merge-check.sh`. Bản sửa đã có trên nhánh `fix/lan-v-loi-trong-hop-dong`, commit `1c82e2cc`; hồ sơ này mở cho bản ấy theo luật PR đổi code T3 phải có hồ sơ được cổng chấm (hồ sơ `t3-can-ho-so-arm`).

## Vấn đề

Làn V cho hồ sơ T2 đi tiếp không chữ ký khi bằng chứng xanh-sạch. Lượt chấm chỉ tự trả lại khi lỗi trong hợp đồng ở mức nặng. Lỗi mức vừa và nhẹ đi cùng phán quyết PASS và chỉ nằm ở mục «Trong hợp đồng» của `review-findings.md`, mà sáu điều kiện xanh-sạch không đọc mục này. Kết cục: hồ sơ có lỗi được máy thông qua và không ai phải đọc lỗi.

Đã đo trên hồ sơ thật ngày 10/11: 162 hồ sơ T2 PASS trong kit có 18 hồ sơ còn lỗi thật (5 hồ sơ chỉ mức nhẹ) và 11 hồ sơ khuôn cũ máy không đọc đủ. Bốn hồ sơ machine-cleared của kit không có lỗi. Kho khác có ba hồ sơ machine-cleared bị bộ đọc gọi tên: `onehub-quy-hang/va-e7-loi-that-cap-han`, `onehub-invest/s03-null-byte`, `onehub-invest/test-anh-mau-co-manifest`.

Đo lại theo trạng thái ngày 10/11, trên kit, `onehub-quy-hang`, `onehub-invest`, `onehub-inventory`:

| Nhóm hồ sơ | Còn lỗi | Sai khuôn | Sạch |
|---|---|---|---|
| Đã ký | 57 | 26 | 435 |
| Máy đã thông qua, chưa ký | 1 | 2 | 37 |
| Đã chấm, chưa ký (`verified`) | 0 | 0 | 2 |

Hồ sơ đã ký không đi qua luật này. Nhóm giá phải trả là hai dòng dưới.

## Cách làm

Thêm một vế vào đuôi luật xanh-sạch, ở cả hai bản dựng: `xanh_sach_check` (lưới trước gộp) và `xanhSach` (máy quét). Hai bản phải giữ bằng nhau, phép LV5 đo điều này.

- Bộ đọc: `loiTrongHopDong` và `lyDoTrongHopDong` trong `lib/out-of-contract.cjs`, cạnh bộ đọc mục ngoài hợp đồng. Trả lời ba khả năng: không có lỗi · có N lỗi, gọi tên `Trong-1…N` · có chữ mà không đọc ra đủ.
- Mức lỗi không tham gia phán quyết.
- Hồ sơ đã `machine-cleared` là lời khai có từ trước, chỉ bị xét lại khi có đổi trong PR, cùng cách của gap-probe. Hồ sơ `verified` chưa ký không được miễn; đây là câu hỏi cho chủ kho, đo được 0 hồ sơ chịu ảnh hưởng hôm nay.
- Bộ đọc không chạy được thì lưới chặn, ghi rõ fail-closed.
- Vế mới đứng ở đuôi hàm, theo tiền lệ vế hai của mục ngoài hợp đồng, không vào khối `EVIDENCE-XANH-SACH-BLOCK`, nên các phép round-trip giữ nguyên.

## Không đổi

Đường người ký không đổi: có chữ ký thì lưới không hỏi xanh-sạch. Sáu điều kiện cũ giữ nguyên.

## Rủi ro

- Lưới quét mọi hồ sơ khi không lọc slug. Nếu áp vế mới cho cả hồ sơ cũ thì ba hồ sơ machine-cleared ở kho khác làm đỏ mọi PR của kho đó. Miễn trừ theo PR đóng lỗ này; AC-10 đo trên kho thật. Đo thử ngày 10/11 trên bốn kho: bản vá không thêm vi phạm nào so với bản trước.
- Khuôn cũ bị coi là chưa đọc được nên bị giữ, trong phạm vi nói ở câu hỏi trên. Đổi lại không có đường đi qua bằng cách viết sai khuôn.

## Phần còn phải làm ở bước thực thi

Bản sửa đã xong; bước thực thi chỉ thêm phép đo: chín tình huống mới của ma trận, ca bộ đọc hỏng ở cả hai bản dựng, phép đọc trên hồ sơ thật, phép phá thử từng vế và phép đối chiếu trên kho thật.
