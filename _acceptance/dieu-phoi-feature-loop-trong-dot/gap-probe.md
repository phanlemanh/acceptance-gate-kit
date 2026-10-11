---
slug: dieu-phoi-feature-loop-trong-dot
at: 2026-10-10T23:44:10Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

# Gap-probe — dieu-phoi-feature-loop-trong-dot

Phản biện context sạch: một tác tử mới chỉ đọc design doc, contract, evals, sổ quyết định và tệp bài học
(claim-scan, input thứ 5, advisory). Không đọc mã, không đọc hội thoại brainstorm.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | E8 chỉ đo chuỗi có mặt («trong-dot.mjs --root .» có trong khối, tệp tồn tại ở cây kit) trong khi lời hứa là round-trip chạy được ở kho tiêu thụ [lan-ghim-lai-theo-paths#F1] | Khối viết đường theo gốc kho; ở crm script nằm trong cache gói nên node thoát khác 0 ở S0 — kho không đợt bị in lỗi, kho có đợt không bao giờ bật khối | Rút dòng lệnh từ khối, thay `$WORKFLOWS_DIR`, chạy ở kho thử ngoài cây kit; chiều đỏ đường tương đối | fixed: AC-8 + E8 «DP7-08 lenh-chay-duoc» và mutant «duong-tuong-doi»; design §4 ghi đường qua `$WORKFLOWS_DIR` |
| P1 | design | Nguồn quyết của hàng kế chỉ xét ô riêng của slug; hàng chạy dưới ô dù (mẫu sổ d-…-2) không có ô riêng nên luôn ra bao-giam-sat | Đợt của chính kit: hàng kế DP3/DP4 không có `_acceptance/<slug>/` → thợ không bao giờ tự mở hàng kế; AC-4 không kiểm `viec_ke` của B | Thêm hàng ma trận cho hàng không ô riêng; AC-4 assert `viec_ke` của B == mo-hang | fixed: design chỗ chọn 5 nêu hàng ô dù được mở ô ở thẻ khởi tạo (spec §14 chỗ nối 2) và hàng không mã là đã quyết; AC-3 thêm hàng «khong-ma» và «o-build-chi-o-worktree»; AC-4 + E4 assert `tho --slug A` ra mo-hang/B |
| P2 | evals | Ma trận E3 đếm 5 = số đầu ra, không phải số tình huống đầu vào; thiếu kill, iterate, chờ phụ thuộc, tách «chỉ hồ sơ» khỏi «ô build» | Bản chỉ chặn park vẫn qua; bản đòi cả hợp đồng lẫn ô vẫn qua | Ma trận đầu vào có tên ~12 hàng, ghim viec_ke + ly_do, mutant «chỉ chặn park» | fixed: AC-3 + E3 ma trận đầu vào 14 hàng có tên, mutant «chi-chan-park» |
| P2 | evals | E1/E2 không ghim hình dạng worktree thật; chỉ so tên symlink, không so cách giải gốc kho chính | Bản giải gốc bằng `--show-toplevel` xanh trên thư mục con thường, đỏ trên worktree thật — mọi thợ đọc thành «không đợt» | Ba hình dạng `git worktree add`; mutant `--show-toplevel` | fixed: AC-1 + E1 ba hình dạng worktree do code sinh, mutant «show-toplevel»; design §2 ghi giải bằng `--git-common-dir` |
| P2 | evals | E7 dựng yêu cầu can-nguoi đúng khuôn bên đọc (viết tay), không round-trip từ bên viết; không AC đo LUAT.md có `can-nguoi`, `hang-moi` | LUAT.md lệch tên trường hoặc thiếu `hang-moi` → thợ ghi tệp bộ phát lịch bỏ qua, câu hỏi không lên bảng (đúng lỗi luật 52) mà E7 vẫn xanh | Rút ví dụ từ LUAT.md do `mo` sinh, ghi, chạy nhịp thật; rút rỗng → đỏ | fixed: AC-7 + E7 «luat-co-loai»; yêu cầu do `ghiYeuCau` thật ghi khi gói có (DP3), chưa có thì tên trường rút từ dòng «Yêu cầu» của LUAT.md vừa sinh, rút rỗng → đỏ |
