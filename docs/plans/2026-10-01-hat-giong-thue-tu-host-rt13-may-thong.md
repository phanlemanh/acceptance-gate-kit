# Hạt giống — thuế tự-host: mỗi vòng tới «máy thông» phải khai tay vào RT13 rồi ghim lại một hồ sơ đã ký

**Ngày:** 2026-10-01 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: acceptance-gate-kit/_acceptance/thuoc-biet-truoc-khong-phan-duoc/ — đo trong vòng này và
vòng chị em `nghi-van-mang-co-qua-han` (PR #232), cùng ngày 01/10.

## Hình dạng

Ca RT13 (`tests/plugins/ra-co-ten.test.mjs`) so ô của mọi hồ sơ giữa bộ quét thẻ khởi động
hiện hành và bản bộ quét ĐÓNG BĂNG tại mốc `cb38ea01`; mọi khác biệt phải được khai tay trong
khối `KHAC-BIET-DOC-CU` của hồ sơ đã ký `ra-co-ten-lam-va-trao`. Bản mốc không biết trạng thái
`machine-cleared` (sinh sau mốc) — nó báo «status không nhận diện được» → ô `ho-so-hong`. Nên mỗi
hồ sơ mới đi tới «máy thông» ở kho kit đẻ ra:

1. một dòng khai tay `<slug> ho-so-hong da-giao-may-thong-…` vào hợp đồng của một hồ sơ ĐÃ KÝ;
2. và vì chạm hồ sơ đó, lưới trước-merge coi bằng chứng của nó là cũ → một lượt ghim lại
   (`repin-lane.mjs`, trọn bộ suite, ~15–20 phút máy).

Hai hồ sơ máy-thông có sẵn (`co-qua-timebox-nhom-da-xong`, `ghim-lai-tren-lop-cu`) lọt vì status
của chúng vẫn ghi `verified`; mọi vòng sau 2.19 (status ghi `machine-cleared`) đều dính.

## Số đo hôm nay

- Hai vòng ngày 01/10 × mỗi vòng 1 dòng khai + 1 lượt ghim lại `ra-co-ten-lam-va-trao`.
- PR #232 đỏ HAI lần liên tiếp vì đúng việc này: lần 1 RT13 (commit «máy thông» đổi ô sau lượt
  chấm, chưa khai), lần 2 job gate (dòng khai làm bằng chứng `ra-co-ten-lam-va-trao` thành cũ).
- Lượt chấm xanh không bắt được cả hai: lượt chấm chạy TRƯỚC commit «máy thông».

## Dạng nghiệm đúng tầng (chưa chọn)

- Bản mốc của RT13 nhận `machine-cleared` như `verified` (bóc riêng một bản bộ quét «mốc + bảng
  trạng thái hiện hành»), để trạng thái sinh sau mốc không thành khác biệt.
- Hoặc khối khai sống ở một tệp không thuộc hồ sơ đã ký (vd `tests/plugins/fixtures/`), để khai
  không kéo hồ sơ nào vào phép kiểm bằng chứng cũ.

Cả hai là đổi thước của một hồ sơ đã ký → việc meta, theo luật chiều rộng (b) chỉ mở khi owner gọi tên.

## Ngưỡng mở ô (đang đếm)

Vòng THỨ BA ở kho kit phải khai vào khối + ghim lại `ra-co-ten-lam-va-trao` chỉ vì sang «máy thông».
Đếm: `git log --oneline` trên hợp đồng của hồ sơ `ra-co-ten-lam-va-trao`, tìm commit khai một dòng
`ho-so-hong da-giao-may-thong` — hôm nay 2 (hai vòng ngày 01/10).
