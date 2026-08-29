---
schema_version: 1
feature: Nhánh chính không tên main — phép dò phải dò được, không chết ở tên đầu
slug: nhanh-chinh-khong-ten-main
owner: manh@mstar.vn
risk_tier: T2
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-08-29T15:10:00Z
---

# Acceptance Contract: nhanh-chinh-khong-ten-main

## Context

`s4-args.mjs` có một cửa fail-closed (`git()`) bắt lỗi rồi THOÁT tiến trình —
đúng cho phép đọc bắt buộc. Nhưng vòng dò tên nhánh chính lại gọi chính cửa đó
bên trong `try/catch`, mà thoát-tiến-trình không ném, nên nhánh `catch` là mã
chết: bốn tên dự phòng chỉ còn hiệu lực cho tên đầu. Repo tiêu thụ dùng
`master` (không remote, hoặc remote không với được) vì thế dừng ngay với thông
điệp sai — trong khi SKILL đã cấm soạn args tay, nên đó là ngõ cụt. Lời khai
trong SKILL («dò remote → dự phòng main/master/develop/trunk») nay sai với vật.

Source input: opportunity.md (Cổng Đáng build — Manh Phan 2026-08-29); phát
hiện gốc ở Cổng Bằng chứng PR #123 (Ngoài-1/Ngoài-4).

## Criteria

- AC-1: Given một repo có nhánh chính tên `master`, KHÔNG có remote, When chạy `s4-args.mjs --slug <slug> --root <repo>` không truyền `--diff-base`, Then script sinh trọn tệp args với `diffBase` BẰNG kết quả `git merge-base master HEAD` chạy độc lập — không đòi khai nhánh bằng tay.
- AC-2: Given một repo mà nhánh chính không thuộc bốn tên dự phòng (vd `phat-trien`) và không có remote, When chạy `s4-args.mjs` không truyền `--diff-base`, Then script thoát khác 0 với ĐÚNG câu có hướng dẫn («không nhận diện được nhánh chính … truyền `--diff-base`»), KHÔNG phải thông điệp «lệnh git thất bại» và KHÔNG phải vết đổ của tiến trình.
- AC-3: Given phép ĐỌC BẮT BUỘC vẫn hỏng (vd `--diff-base` trỏ ref không tồn tại), When chạy `s4-args.mjs`, Then hành vi fail-closed giữ nguyên: thoát mã 2, thông điệp nêu tên phần hỏng, không sinh tệp — bản vá cho phép dò KHÔNG được nới lỏng cửa đọc.
- AC-4: Given `s4-args.mjs` sau vòng này, When đọc mã nguồn, Then hai vai của lệnh git nằm ở HAI hàm có tên riêng (đọc-bắt-buộc thoát-có-tên · dò trả rỗng), và mọi phép dò tên nhánh/remote đi qua hàm dò — không phép dò nào gọi cửa fail-closed trong `try/catch` (hình dạng mã chết đã nổ).
- AC-5: Given lệnh hỏi remote (lệnh có mạng, chạy mỗi lần sinh args), When remote treo hoặc không với được, Then bước chuẩn bị args không treo theo: lệnh có trần thời gian và ca hỏng rơi về đường dò tên quen.
- AC-6: Given repo CÓ remote trả lời được và remote khai nhánh chính NGOÀI bốn tên dự phòng (vd `phat-trien`), When chạy `s4-args.mjs` không truyền `--diff-base`, Then script giải đúng tên đó và `diffBase` BẰNG `git merge-base phat-trien HEAD` độc lập; và script ghi lại NGUỒN giải được tên nhánh (`remote` hay `fallback`) để phép đo phân biệt được hai đường — hai đường cho cùng kết quả trên repo tên `main` nên không có trường này thì không đo được.

## Coverage

Quét theo hai trục rời rạc; tích hai trục đủ vì hành vi chỉ phân nhánh theo
(nguồn biết tên nhánh) × (vai của lệnh git).

- Trục nguồn biết tên nhánh chính: remote trả lời (AC-6) | không remote + tên thuộc bốn tên quen (AC-1 — chạy THẬT cả bốn, danh sách rút từ marker `MAIN-BRANCH-CANDIDATES`) | không remote + tên lạ (AC-2) | remote treo/không với được (AC-5). [thước CE: bốn nhánh mà đoạn mã dò thật sự phân biệt được, đọc từ khối marker `PROBE-REGION` trong `s4-args.mjs`]
- Trục vai của lệnh git: đọc bắt buộc (AC-3) | dò (AC-1, AC-2, AC-4). [thước CE: hai vai do chính hợp đồng exit-code của script khai ở đầu file]

## Đường đo

Ngưỡng khai ở opportunity.md → truy thành tiêu chí:

- «Fixture nhánh `master`, không remote: sinh trọn args với mốc so sánh đúng, không cần khai tay» — AC-1 (mốc đo bằng QUAN HỆ với `git merge-base` chạy độc lập, không so chuỗi cứng).
- «Ca nhánh lạ: câu có hướng dẫn, không phải vết đổ» — AC-2.
- Đường remote (phổ biến nhất ở repo tiêu thụ) có phép đo riêng — AC-6.
- «Cửa chết: phải hạ lời khai trong SKILL cho khớp mã» — chặn bởi AC-1 + AC-2 (lời khai SKILL đúng trở lại nhờ vật, không nhờ sửa chữ).

## Out of scope

- KHÔNG đổi nghĩa `git()` cho các phép đọc bắt buộc khác trong script (AC-3 là chốt giữ).
- KHÔNG thêm cờ mới cho người dùng — `--diff-base` đã là lối thoát có sẵn và đã được nêu trong thông điệp.
- KHÔNG đụng ô `baseline-127-tin-hieu-phan-biet` (đã ký, đi vòng riêng).
- KHÔNG mở rộng sang các lệnh git ở nơi khác trong kit (`pre-merge-check.sh`, các cửa chặn tự động) — vòng này chỉ chạm bước chuẩn bị args.

## Notes

- Hạng T2: `feature-loop/scripts/s4-args.mjs` và `tests/**` ngoài `t1_skip_globs`, ngoài `t3_paths`.
- Fixture phải do code sinh trong chính lần chạy và đường dẫn suy từ vị trí script (luật fixture của kit); ca so mốc phải là QUAN HỆ với `git merge-base`, không hằng chuỗi.
