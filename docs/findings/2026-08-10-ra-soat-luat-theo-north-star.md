# Rà soát luật kit theo North Star — bảng xung đột và xử lý

*2026-08-10 · Soạn: phiên B theo yêu cầu owner ("rà soát các luật đang xung
đột với North Star"). Đối tượng: bất biến CLAUDE.md · luật charter tái lập ·
nghi thức vận hành đang chạy. Thước rà: North Star (sản phẩm đến người dùng ·
kit hỗ trợ Claude · giờ-kit là chi phí · rẻ-thì-làm · lõi bất khả nhượng).*

## Kết quả: KHÔNG luật nào sai ở tầng Ý ĐỊNH — xung đột nằm ở tầng THI HÀNH

Phát hiện quan trọng nhất của đợt rà: mọi bất biến CLAUDE.md đều *phục vụ*
North Star về ý định; các xung đột thật đều là **cách thi hành đắt hơn mức
cần** — và tất cả đã có tên trong sổ vấp/spec 2.1. Bảng đầy đủ:

## 1 · GIỮ NGUYÊN — thuộc lõi hoặc đã tự chứng minh giá

| Luật | Vì sao khớp North Star |
|---|---|
| Khoá 6 thao tác cổng người (ADR 0002) | Lõi bất khả nhượng "chữ ký người" — chặn 3 mưu vô ý trong 1 tuần |
| Đối chứng dương + assertion-âm-tính-là-chết | Lõi "không-bịa-bằng-chứng" — nền của mọi cú tự-bắt-xanh-giả |
| Thước gắn vào vật được giao | Cùng lõi trên; là thứ bắt 8 phép đo không-thể-đỏ |
| Đổi schema phải có đường đọc-cũ, không bắt consumer migrate | Chính là "đường-đảo-rẻ" — cứu ta ở vụ P06 |
| Kit không chứa product context | Giữ kit nhỏ = giữ chi phí thấp |
| Đóng băng lab + bugfix-only + ngân sách ≤2 vòng | Bảo vệ trực tiếp giờ-sản-phẩm |
| ADR 1-đoạn / out-of-scope files | Tài liệu rẻ, chống lặp tranh luận |
| Nguồn-sự-thật + mirror sync P30 | Tự động, rẻ, bảo vệ consumer |

## 2 · XUNG ĐỘT THI HÀNH — luật đúng, giá sai; xếp 2.1 (đã có đề bài trong sổ vấp)

| Luật/nghi thức | Xung đột với North Star | Xử lý 2.1 |
|---|---|---|
| `time_human_minutes` hỏi tại mọi cổng | Món 1a đã chết cùng 2.0.0; dữ liệu đã tuyên không-đáng-tin mà vẫn thu | Bỏ hỏi; config opt-out |
| Nghi thức cổng 3–4 lượt gõ, buộc đúng phiên | Thuế lên owner không thêm gram chống-giả nào | Một-lượt-gõ + `--repo` (hành vi #1/#4/#7) |
| Lint từ vựng W6 chạy tại khoảnh khắc cổng, lộ 1–3 từ/lượt | Ăn 5 lượt sửa-chạy-lại đúng lúc người cần quyết | Soi một-lần-đủ-danh-sách, ngoài khoảnh khắc cổng |
| Lưới staleness coi công-cụ/comment/liên-tính-năng đều là "mã đổi" | 4 re-pin/1 feature = thuế người cho thay đổi 0-hành-vi | Máy phân biệt loại thay đổi (tiền lệ comment-only đã có proof-khuôn) |
| Self-host: mọi việc chạm engine → nghi thức T3 trọn bộ | Bugfix đổi-tên-file phình thành 15 eval + 3 vòng (sổ vấp 31) | Nghi-thức-tương-xứng-cỡ-việc, khai TRƯỚC |
| acceptance-init không dặn "chép xong re-pin" | Mọi consumer nâng kit đều vấp | Một đoạn docs (đường docs, không miễn trừ) |

## 3 · GĐ4 — quyết bằng SỐ lấy mẫu, không quyết bây giờ

| Ứng viên | Số hiện có | Câu hỏi GĐ4 |
|---|---|---|
| Tháp P-suite lồng nhau (P42/P45 ~25', runner...) | Cổng kit bắt 0/4 lỗi chặn-phát-hành; chân độc lập bắt 4/4 | Tầng nào đáng tiền theo bảng giá-trị-theo-tầng |
| Gate 1.5 riêng cho T3 | Vòng 2: qua với 0 thay đổi (giá trị đến từ B-review, không từ cổng) | Gộp vào Cổng 1 hay lấy mẫu |
| Codex twin (≈1/2 bề mặt bảo trì) | Usage chưa đo (khảo sát đội chưa trả lời đủ) | Mothball nếu usage = 0 |
| Chân judge/panel cho eval thuần máy | Vòng 2: 0 eval judgment nào đổi kết cục ngoài E10b | Giữ cho AC đọc-hiểu, bỏ cho AC máy-đo? |

## 4 · Khoảng trống North Star chưa có luật che (ứng viên luật MỚI — chỉ khi rẻ)

- **Chiều-đỏ-phải-CHẠY-trước-khi-khai** — 8 phép đo không-thể-đỏ/1 feature;
  hiện là lời dặn trong đề bài, chưa là câu bắt buộc trong khuôn eval.
  Ứng viên rẻ: một câu trong evals-template + một ô trong gap-probe.
- **Số-trong-hồ-sơ-phải-đo-tại-commit-ghi** — lớp số-chép-lại 2 lần; ứng viên
  rẻ: lời dặn trong khuôn report (không thêm cơ chế).
- **Suite phải in số-ca-chạy/kỳ-vọng** — ba-lớp-che-xanh; đã xếp 2.1 (runner).

*Cả ba đi qua phép thử tỉ-lệ-đo-được: lớp 1 tỉ lệ 8/feature (cao, đáng);
lớp 2 tỉ lệ 2/tuần (đáng một lời dặn); lớp 3 đã có sự cố cấp hệ (đáng).*
