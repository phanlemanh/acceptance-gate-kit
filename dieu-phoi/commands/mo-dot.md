---
description: Mở một đợt Điều phối – Thợ bằng một lệnh — dựng thư mục đợt từ gói đợt của kho, trình thẻ khởi tạo, rồi (khi người duyệt) chạy bộ phát lịch, giăng Monitor, lịch 30′, nhóm thanh bên và chip cho từng dãy.
argument-hint: <tên đợt> [--goi <thư mục gói đợt>]
---

Phiên gọi lệnh này trở thành **phiên giám sát** của đợt. Mọi phần tính được do CLI của gói làm; phiên
chỉ làm việc mà chỉ công cụ của app làm được. Lệnh chạy lại được: chẩn đoán trước, làm đúng phần thiếu,
chẩn đoán lại. CLI: `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" <lệnh con>`, chạy ở gốc kho.

<!-- <<<CHU-QUYET-CUA-NGUOI -->
Chữ quyết chỉ nhận từ người gõ: chữ duyệt thẻ khởi tạo, chữ `build` cho từng hàng chờ Cổng Đáng, và
quyền tự merge. Máy CHÉP đúng chữ người đã gõ vào `decided_by` của ô và vào `--ly-do` của lệnh `pha`;
máy không bao giờ tự sinh chữ ấy, không điền sẵn chữ quyết vào dòng mời.
Kết lượt chờ người bằng chữ thường, không qua nút: lượt có trang thẻ (`card.html`; Cổng Bằng chứng thêm `evidence-page.html`) thì gửi trang ấy bằng công cụ gửi tệp của phiên (`SendUserFile`), phiên không có công cụ ấy thì in đường dẫn trang; dòng lệnh hay dòng trả lời mẫu nằm trong một khối `` ```text ``, chép đúng như thẻ in — ô thẻ để `___` thì giữ `___`, máy không tự điền chữ quyết; hộp «bước kế» của app (`wrap_up`) ở lượt này chỉ mang phần tóm tắt, không câu hỏi và không nút, vì app bỏ nút mở đầu «/» hay «!» hoặc chứa «@», cắt tin của nút ở 300 ký tự, và bỏ nút khuyến nghị thì mất luôn câu hỏi.
<!-- CHU-QUYET-CUA-NGUOI>>> -->

Các bước, đúng thứ tự:

1. **Chẩn đoán.** `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" chan-doan --json --mo $ARGUMENTS`
   (`--mo <tên>` cho chẩn đoán biết đợt sắp mở; `--goi` trong đối số đi kèm nguyên). Có đợt khác đang
   chạy → nói một dòng và DỪNG. Đợt cùng tên đã mở → đi tiếp từ mục đầu tiên còn `thieu`; không còn mục nào
   `thieu` mà phiên này chưa làm bước 6 → làm từ bước 6. Chưa có đợt
   và mục `goi-dot` là `thieu` → DỪNG NGAY, TRƯỚC khi gọi `mo`, và nói đúng việc khai trong `viec`: thêm
   khoá `dieu_phoi.goi_dot` vào `_acceptance/config.yaml` của kho (hoặc gọi lại với `--goi`); không mở
   đợt dựng tay thay.
2. **Mở.** `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" mo $ARGUMENTS --phien <mã phiên này>`.
   Mã phiên này là mã app `local_…` mà công cụ phiên của app trả — đánh thức nhắn giám sát bằng mã ấy; máy tự ghi mã CLI
   của phiên (biến `CLAUDE_CODE_SESSION_ID`) vào vai để đọc nhịp. Ngoài app (không có công cụ phiên) dùng mã CLI.
   Mỗi dòng cảnh báo `mo:` in ra (ví dụ không đọc được tệp lộ trình) → nói lại nguyên văn. Chẩn đoán lại
   (không cần `--mo` nữa). `hang-viec.json` của đợt chưa có khoá `muc_tieu` → thêm một câu mục tiêu đợt bằng
   tiếng sản phẩm (chuỗi; lấy từ gói đợt hay câu chủ kho giao đợt) — dòng đầu của khung đợt đọc nó, vắng thì
   khung hiện cờ vàng «chưa khai mục tiêu đợt».
3. **Thẻ khởi tạo.** `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" the khoi-tao --json`. Trình
   bằng tiếng sản phẩm: bảng dãy và hàng; mục máy đi tiếp có cửa phản đối (ưu tiên khi tranh chấp, làn V);
   mục cảnh báo (hàng có ô đã quyết khác `build` — không vào đợt). Thẻ có `han_muc` → in một dòng thông tin
   «ngưỡng hạn mức: báo trước <bao_truoc_pct>% · bàn giao <ban_giao_pct>%», kèm chỗ sửa (`dieu-phoi.config.json`
   của gói đợt), không thành câu hỏi. Câu hỏi cho người CHỈ gồm `hoi`:
   quyền tự merge, và mỗi hàng `build:<slug>` chờ Cổng Đáng. Với mỗi hàng chờ, mở ô `stage: discovery`
   trước bằng bộ ghi lộ trình của acceptance-gate: giải đường gói bằng `resolve-plugin.mjs` của feature-loop
   (`--plugin acceptance-gate --require scripts/lo-trinh.mjs`, như bước 1 của
   `/acceptance-gate:acceptance-card`) thành `$AG`, rồi
   `node "$AG/scripts/lo-trinh.mjs" --root . --hang '<tệp>:<mã>' --mo-o --owner "$(git config user.email)"`.
4. **Chờ người duyệt.** Một câu hỏi đóng kèm một dòng trả lời mẫu, ô chữ quyết để trống. Người gõ
   `build <slug…>` thì ghi `decision: build`, `decided_by` = tên người gõ, `decided_at` vào từng ô, đúng
   chữ người gõ.
5. **Chạy.** `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" pha dang-chay --boi <tên người duyệt> --tu-merge <co|khong theo chữ người gõ> --ly-do "<chữ duyệt nguyên văn>"`,
   rồi `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" chay`. Người không nói gì về quyền tự merge thì
   bỏ cờ `--tu-merge`: phiên thợ đọc là không tự merge (bấm merge là của người).
6. **Việc của app.** Giăng Monitor (timeout 30′):
   `tail -n0 -F <thư mục đợt>/su-kien.jsonl | grep --line-buffered '"can_phan":true'`. Tạo lịch 30′ theo
   khuôn dưới — cùng khuôn với `/dieu-phoi:tiep-tuc`, nên đợt mở bằng lệnh này cũng bàn giao chủ động khi gần
   hết hạn mức.
<!-- <<<LICH-30 -->
   Mỗi lần lịch 30′ chạy: gọi `get_usage` rồi
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" han-muc --nguon get-usage --phien <mã phiên ngắn> --doc '<kết quả>'`,
   rồi `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" danh-thuc --json`
   rồi làm đúng `hanh_dong` — `nhan-giam-sat`: gửi tin liên phiên tới phiên `phien` với nguyên văn `cau` ·
   `bao-chu-kho`: đẩy thông báo cho chủ kho với nguyên văn `cau` · `khong`: không làm gì.
<!-- LICH-30>>> -->
   Dựng nhóm «Đợt <tên>» ở thanh bên, ghim phiên này. Chạy
   `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" chan-doan --json --chi-tiet` rồi mở chip cho đúng các
   dãy có mục `day:<id>` mang `chi_tiet.hanh_dong` là `mo-chip`, kèm nguyên văn `chi_tiet.ghi_danh` (thư mục
   đợt, mã dãy, «đọc LUAT.md trước S1», lệnh `/feature-loop:feature-loop <slug hàng kế của dãy>`). Dãy
   `khong-hang` (nghỉ, hết hàng, chờ phụ thuộc hay Cổng Đáng) không mở chip.
7. **Chẩn đoán lại.** `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" chan-doan --json --chi-tiet`. Dãy
   mang hành động `mo-chip` là chờ người bấm chip vừa mở ở bước 6 — mục ấy `du`, không mở lại. Không còn mục
   `thieu` → báo người đúng một dòng: «đợt <tên> chạy · k dãy cần bấm chip», k = số mục `day:*` mang
   `mo-chip`. Còn mục thiếu → làm tiếp mục đó, không báo xong.
