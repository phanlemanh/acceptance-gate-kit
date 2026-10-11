# Hạt giống — ca «nguyên vẹn / chiều im» của hồ sơ đã ký neo vào merge-base sống

Gốc: `_acceptance/dieu-phoi-doi-tai-khoan/` (DP4 phải sửa ca của ba hồ sơ đã ký trong cùng một vòng) · sổ
revisit: DP2 `d-20261011T040855Z-45`, DP3 `d-20261011T040855Z-29` và `d-20261011T032328Z-28`, DP7
`d-20261011T043240Z-23` · commit `8c92fb3a` (DP3-11, sửa trong DP7) · `932e9220` (DP2-15, DP3-13) ·
`ff99e33b` (DP7-10, E9). Hạt giống là SỔ, không phải ô: chỉ mở thành ô khi có neo ngoài (ngưỡng ở cuối).

## Lỗ

Một ca lời thề của PR — «PR này không đổi tệp X» hay «khuôn cũ còn đọc được» — lấy bản so bằng
`git merge-base HEAD origin/main`. Mốc đó dời mỗi lần gộp, nên:

- trên `main` sau khi gộp, merge-base là chính HEAD → ca so cây với chính nó, **xanh rỗng**;
- trên nhánh của vòng sau, merge-base là `main` đã có PR → vòng sau sửa HỢP LỆ tệp X (kèm sổ revisit) thì ca
  **đỏ oan**, dù PR gốc không đổi gì.

Đo được 5 ca trong 3 hồ sơ, mỗi vòng tự vá một kiểu: DP2-15, DP3-13 (ca DP1 nguyên vẹn), DP3-11 (khuôn
LUAT.md cũ), DP7-10 (ca DP1/DP2 nguyên vẹn), E9 của DP7 (`dp7-chieu-im.mjs`: khối SKILL, script, hooks.json).
Hồ sơ DP7 đã tự khai đúng lỗ này ở Known limits (Ngoài-1, Ngoài-7, Ngoài-8) trước khi nó nổ trên nhánh DP4.
Ca **so với bản nhánh chính** (DP3-03 hàng g, DP2 `kitTaiMergeBase`, DP4-08 `khong-ban-giao`, DP7-06) là
hình dạng khác — giữ merge-base là đúng, chỉ khuôn fixture phải lấy từ chính bản đem ra so (DP7-06).

## Hướng (nghiệm đúng tầng)

1. **Một hàm dùng chung «mốc của PR #N»** trong `tests/dieu-phoi/` — trả `{ base, moi }` là hai cha của commit
   gộp PR (tìm theo tiêu đề, không gõ sha); chưa gộp thì rơi về merge-base với cây làm việc. Ba bản chép hiện
   có (`mo-dot.test.mjs`, `tiep-tuc.test.mjs`, `trong-dot.test.mjs` + `dp7-chieu-im.mjs`) gọi về nó.
2. **Một ca quét** cấm `merge-base HEAD` trần trong tệp ca của hồ sơ đã ký, trừ chỗ gọi qua hàm ở (1) hoặc
   ca so-với-nhánh-chính có khai. Ca quét có cặp hai chiều: bản sao tệp ca thêm một dòng merge-base trần → đỏ
   nêu tệp; cây thật → im.

Không dựng trong DP4 (ngoài phạm vi hợp đồng; Điều phối M5 quyết 11/10).

Ngưỡng mở ô: ≥1 ca mới cùng lớp xuất hiện sau DP4 (một vòng phải sửa ca «nguyên vẹn / chiều im» của hồ sơ
đã ký vì mốc merge-base dời), có commit sửa làm neo.
