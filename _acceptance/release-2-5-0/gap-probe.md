# Gap-probe — release-2-5-0 (context sạch, một lượt)

- ran_at: 2026-08-30T05:20:00Z
- input: contract.md + evals.yaml + decisions.jsonl (mốc phát hành, không design-doc — nếp 2-3-0/2-4-0)

## Findings

1. (P2 — đã sửa) Bảng «Ba dòng số» trộn số đếm-máy (tally #123/#125) với số sổ-tay
   (ba hồ sơ trước cơ chế tally) → mỗi ô đã ghi rõ nguồn đếm ngay trong ngoặc,
   không để người đọc tưởng cả cột cùng độ tin.
2. (P2 — đã sửa) AC-6 bản nháp chép «sáu vế + hai điều nói thật» từ khuôn 2-4-0
   trong khi mốc này có năm hồ sơ + một bộ ca đo → sửa thành «các vế
   người-dùng-nhận-gì», đo vẫn trên đoạn cắt từ v2.5.0.
3. (P3 — ghi nhận, không chặn) Dòng số «làm-xong→ký» của ba hồ sơ đầu là «trong
   ngày» theo vết commit, không có timestamp máy — đúng giới hạn đã khai trong
   hợp đồng; bộ đếm chỉ đủ dữ liệu từ cơ chế tally (#123) về sau.
4. (P3 — ghi nhận) Consumer nhận một NOTE mỗi lần chạy nếu còn khoá signoff cũ
   trong config — hành vi từ 2.1.0, không đổi ở mốc này.

## Disposition

- P0: 0 · P1: 0 · P2: 2 (đã sửa trong chính lượt viết hợp đồng) · P3: 2 (ghi nhận).
