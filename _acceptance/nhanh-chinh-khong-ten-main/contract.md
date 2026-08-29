---
schema_version: 1
feature: Nhánh chính không tên main — phép dò phải dò được, không chết ở tên đầu
slug: nhanh-chinh-khong-ten-main
owner: manh@mstar.vn
risk_tier: T2
surfaces: [cli]
status: verified
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
- AC-7: Given cây có hình dạng của bộ CI — clone `--single-branch`, ref cục bộ của nhánh chính VẮNG dù remote vẫn khai tên nó, When chạy `s4-args.mjs` không truyền `--diff-base`, Then: (ô 1) nếu KHÔNG ref nào của nhánh chính giải được (cả `<tên>` lẫn `origin/<tên>`) → câu CÓ HƯỚNG DẪN, KHÔNG phải «lệnh git thất bại»; (ô 2) nếu `origin/<tên>` còn → giải qua ref đó, mốc BẰNG `git merge-base origin/<tên> HEAD` độc lập.
- AC-6: Given repo CÓ remote trả lời được và remote khai nhánh chính NGOÀI bốn tên dự phòng (vd `phat-trien`), When chạy `s4-args.mjs` không truyền `--diff-base`, Then script giải đúng tên đó và `diffBase` BẰNG `git merge-base phat-trien HEAD` độc lập; và script ghi lại NGUỒN giải được tên nhánh (`remote` hay `fallback`) VÀO ĐẦU RA (trường `mainBranchInfo` của tệp args, và một dòng khai trên đầu ra lỗi chuẩn) để phép đo đọc được từ vật được giao chứ không đo lại fixture — hai đường cho cùng kết quả trên repo tên `main` nên không có trường này thì không đo được.

- AC-8: Given remote KHAI một tên nhánh chính mà cây hiện tại không giải được (cả `<tên>` lẫn `origin/<tên>` đều vắng) trong khi một tên khác trong danh sách dự phòng vẫn sống, When chạy `s4-args.mjs` không truyền `--diff-base`, Then script KHÔNG được nhận tên khác đó: nó thoát khác 0, nêu ĐÚNG tên remote đã khai và chỉ lối `--diff-base`, không sinh tệp — mốc so sánh sai lặng lẽ nguy hiểm hơn một lỗi kêu to.

## Coverage

Quét theo hai trục rời rạc; tích hai trục đủ vì hành vi chỉ phân nhánh theo
(nguồn biết tên nhánh) × (vai của lệnh git).

- Trục nguồn biết tên nhánh chính: remote trả lời (AC-6) | remote khai tên mà ref cục bộ vắng — hình dạng CI (AC-7) | không remote + tên thuộc bốn tên quen (AC-1 — chạy THẬT cả bốn, danh sách rút từ marker `MAIN-BRANCH-CANDIDATES`) | không remote + tên lạ (AC-2). Ô «remote treo» KHÔNG có tiêu chí trong vòng này — xem giới hạn đã khai ở Notes. [thước CE: bốn nhánh mà đoạn mã dò thật sự phân biệt được, đọc từ khối marker `PROBE-REGION` trong `s4-args.mjs`]
- Trục vai của lệnh git: đọc bắt buộc (AC-3) | dò (AC-1, AC-2, AC-6, AC-7, AC-8).
- Trục «remote khai gì»: không khai → được dò tên quen (AC-1, AC-2) | khai và giải được (AC-6, AC-7 ô 2) | khai mà KHÔNG giải được → cấm đoán (AC-8). [thước CE: ba nhánh mà khối dò phân biệt bằng biến `remoteDeclared`] [thước CE: hai vai do chính hợp đồng exit-code của script khai ở đầu file]

## Đường đo

Ngưỡng khai ở opportunity.md → truy thành tiêu chí:

- «Fixture nhánh `master`, không remote: sinh trọn args với mốc so sánh đúng, không cần khai tay» — AC-1 (mốc đo bằng QUAN HỆ với `git merge-base` chạy độc lập, không so chuỗi cứng).
- «Ca nhánh lạ: câu có hướng dẫn, không phải vết đổ» — AC-2.
- Đường remote (phổ biến nhất ở repo tiêu thụ) có phép đo riêng — AC-6; hình dạng cây của bộ CI — AC-7; cấm-đoán-sang-tên-khác — AC-8 (hồi quy do chính vòng này đẻ ra ở r1/r2, đóng ở r4).
- «Cửa chết: phải hạ lời khai trong SKILL cho khớp mã» — chặn bởi AC-1 + AC-2 (lời khai SKILL đúng trở lại nhờ vật, không nhờ sửa chữ).

## Out of scope

- KHÔNG đổi nghĩa `git()` cho các phép đọc bắt buộc khác trong script (AC-3 là chốt giữ).
- KHÔNG thêm cờ mới cho người dùng — `--diff-base` đã là lối thoát có sẵn và đã được nêu trong thông điệp.
- KHÔNG đụng ô `baseline-127-tin-hieu-phan-biet` (đã ký, đi vòng riêng).
- KHÔNG mở rộng sang các lệnh git ở nơi khác trong kit (`pre-merge-check.sh`, các cửa chặn tự động) — vòng này chỉ chạm bước chuẩn bị args.

## Notes

- **THU PHẠM VI (owner quyết tại S4-r2, 29/08).** Hai tiêu chí bị rút khỏi vòng
  này vì phép đo cho chúng thuộc đúng lớp đang hỏng, trong khi thứ chúng bảo vệ
  là lớp phụ:
  - *Trần thời gian cho lệnh hỏi remote* — mã VẪN có trần (10 giây, hằng
    `REMOTE_TIMEOUT_MS`), nhưng vòng này KHÔNG khai tiêu chí cho nó: ca đo phụ
    thuộc cách mạng của máy chạy (nơi chặn kết nối thì nó xanh kể cả khi trần bị
    gỡ) và không có chiều đỏ thật. GIỚI HẠN ĐÃ KHAI: trần tồn tại nhưng chưa có
    phép đo sống canh nó.
  - *Vùng dò chỉ được gọi hàm dò* — mã VẪN đúng (marker `PROBE-REGION`, hai lời
    gọi đều là hàm dò), nhưng ca đo là danh sách cấm một phần tử trên không gian
    mở: viết lại lời gọi theo dạng khác là lọt. GIỚI HẠN ĐÃ KHAI: không có lưới
    chặn hồi quy cho hình dạng này.
  - Cả hai đi vào ô `khuon-rang-dung-chung` (mở cùng lượt) — lời giải đúng tầng
    là khuôn răng dùng chung, không phải thêm ca cho riêng hồ sơ này.

- Hạng T2: `feature-loop/scripts/s4-args.mjs` và `tests/**` ngoài `t1_skip_globs`, ngoài `t3_paths`.
- Fixture phải do code sinh trong chính lần chạy và đường dẫn suy từ vị trí script (luật fixture của kit); ca so mốc phải là QUAN HỆ với `git merge-base`, không hằng chuỗi.
