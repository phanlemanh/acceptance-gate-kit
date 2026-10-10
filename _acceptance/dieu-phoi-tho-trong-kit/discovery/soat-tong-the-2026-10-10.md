# Soát tổng thể kit + Điều phối – Thợ + Lộ trình (10/10)

Chủ kho yêu cầu: xem lại tổng thể kit hiện nay cùng các hạng mục dự kiến (workflow Điều phối – Thợ, lộ
trình), bảo đảm liền mạch, không phá nền sẵn có, giữ trải nghiệm người dùng kit, và tìm chỗ thiếu.

Ba phiên context sạch, chạy song song, chỉ đọc, mỗi phát hiện dẫn tệp:dòng:
- **Nền engine** — 10 phát hiện (4 cao). Đã kiểm, không va: tệp đợt nằm trong `.acceptance-runs/` (gitignore,
  ngoài vùng mã 6, ngoài `stale_files`); DP1 không chạm engine trước mốc 14/10 của crm; CLI không ghi tệp lộ
  trình; bảy lệnh khoá của ADR 0002 không đổi.
- **Trải nghiệm người dùng kit** — 10 phát hiện (3 cao). Điểm nên giữ: mọi thứ trong tệp, một bên viết, lệnh
  chạy lại được; lộ trình là kế hoạch, đợt là lát thi công; chính sách hạn mức chốt một lần.
- **Chỗ còn thiếu** — 12 phát hiện (7 cao) và ba câu chỉ chủ kho trả lời được.

Gộp còn 16 vấn đề; quyết định và hàng nhận ở spec workflow §16. Năm vấn đề rơi vào DP1 đã thành AC-8 đến
AC-12 (sổ `d-20261010T001216Z-8`). Hàng mới DP7 (feature-loop biết mình trong đợt) vào lộ trình kit.
