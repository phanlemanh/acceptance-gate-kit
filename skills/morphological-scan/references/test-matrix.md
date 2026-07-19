# Preset: Test matrix / QA coverage

Dùng khi cần độ phủ test cho một feature hoặc release — bản chất là combinatorial testing.

## Trục

1. **Surface / platform** — mọi surface đang chạy của sản phẩm, lấy từ Product Context; thêm browser chính nếu là web. (vd marketplace 2 phía: web khách, web agent, mobile app, API)
2. **Actor / role × quyền** — mỗi role trong Product Context, và bắt buộc kèm case *bị từ chối quyền* (permission-denied path là nhánh hay bị sót nhất).
3. **Trạng thái dữ liệu** — rỗng | 1 bản ghi | điển hình | biên (max length, ký tự đặc biệt, unicode/ngôn ngữ của thị trường — vd VN: tiếng Việt có dấu) | khối lượng lớn | hỏng/thiếu field.
4. **Môi trường / mạng** — bình thường | chậm | mất mạng giữa chừng | API phụ thuộc fail | retry / double-submit.

## Cross-cutting

Timezone & định dạng ngày giờ theo thị trường trong Product Context; i18n; concurrent edit (2 người sửa 1 bản ghi); idempotency cho mọi action ghi.

## Thước CE

Spec + lịch sử bug 6 tháng gần nhất của module — mỗi bug cũ là một giá trị trục đã bị sót lần trước, đưa ngược vào trục.

## Pareto

Không gian > ~50 ca → dùng **pairwise** thay vì full tích Descartes: đảm bảo mỗi *cặp* giá trị xuất hiện ít nhất 1 lần. Full matrix chỉ dành cho luồng tiền và luồng pháp lý.
