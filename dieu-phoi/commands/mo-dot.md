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
<!-- CHU-QUYET-CUA-NGUOI>>> -->

Các bước, đúng thứ tự:

1. **Chẩn đoán.** `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" chan-doan --json`. Có đợt
   khác đang chạy → nói một dòng và DỪNG. Đợt cùng tên đã mở → đi tiếp từ mục đầu tiên còn `thieu`.
2. **Mở.** `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" mo $ARGUMENTS --phien <mã phiên này>`.
   Chẩn đoán lại. Mục `goi-dot` là `thieu` → DỪNG và nói đúng việc khai: thêm khoá
   `dieu_phoi.goi_dot` vào `_acceptance/config.yaml` của kho (hoặc gọi lại với `--goi`); không mở đợt
   dựng tay thay. Mỗi dòng cảnh báo `mo:` in ra (ví dụ không đọc được tệp lộ trình) → nói lại nguyên văn.
3. **Thẻ khởi tạo.** `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" the khoi-tao --json`. Trình
   bằng tiếng sản phẩm: bảng dãy và hàng; mục máy đi tiếp có cửa phản đối (ưu tiên khi tranh chấp, làn V);
   mục cảnh báo (hàng có ô đã quyết khác `build` — không vào đợt). Câu hỏi cho người CHỈ gồm `hoi`:
   quyền tự merge, và mỗi hàng `build:<slug>` chờ Cổng Đáng. Với mỗi hàng chờ, mở ô `stage: discovery`
   trước bằng bộ ghi lộ trình của acceptance-gate: giải đường gói bằng `resolve-plugin.mjs` của feature-loop
   (`--plugin acceptance-gate --require scripts/lo-trinh.mjs`, như bước 1 của
   `/acceptance-gate:acceptance-card`) thành `$AG`, rồi
   `node "$AG/scripts/lo-trinh.mjs" --root . --hang '<tệp>:<mã>' --mo-o --owner "$(git config user.email)"`.
4. **Chờ người duyệt.** Một câu hỏi đóng kèm một dòng trả lời mẫu, ô chữ quyết để trống. Người gõ
   `build <slug…>` thì ghi `decision: build`, `decided_by` = tên người gõ, `decided_at` vào từng ô, đúng
   chữ người gõ.
5. **Chạy.** `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" pha dang-chay --boi <tên người duyệt> --ly-do "<chữ duyệt nguyên văn>"`,
   rồi `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" chay`.
6. **Việc của app.** Giăng Monitor (timeout 30′):
   `tail -n0 -F <thư mục đợt>/su-kien.jsonl | grep --line-buffered '"can_phan":true'`. Tạo lịch 30′ đọc
   `trang-thai.json` của đợt và in một dòng. Dựng nhóm «Đợt <tên>» ở thanh bên, ghim phiên này. Mở chip
   cho từng dãy kèm lời ghi danh: thư mục đợt, mã dãy, ranh giới, «đọc LUAT.md trước S1», và lệnh
   `/feature-loop:feature-loop <slug hàng kế của dãy>`.
7. **Chẩn đoán lại.** Không còn mục `thieu` → báo người đúng một dòng: «đợt <tên> chạy · k dãy cần bấm
   chip». Còn mục thiếu → làm tiếp mục đó, không báo xong.
