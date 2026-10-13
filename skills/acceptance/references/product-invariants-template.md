# Luật sản phẩm của kho — khuôn `PRODUCT-INVARIANTS.md`

> Hồ sơ `bat-bien-san-pham`, ADR 0024. Tệp đặt ở **gốc kho tiêu thụ**, tên cố định
> `PRODUCT-INVARIANTS.md`. Tệp là **của kho**: chủ kho viết và sửa bằng commit riêng; máy
> **không bao giờ** sửa nó — máy chỉ đề nghị trong hồ sơ vòng. Kho không có tệp thì kit không
> đổi gì: không dòng nạp, không cờ, thẻ y nguyên.

## Kit làm gì với tệp này

- **Bước thiết kế** (S1 của vòng) đọc trọn tệp, ghi một dòng nạp kèm phiên bản tệp. Lựa chọn theo
  một luật trỏ câu luật làm căn cứ; lựa chọn trái một luật thành câu hỏi «Phạm luật SP-n» trên thẻ
  Cổng Phạm vi.
- **Lượt chấm** soi phần mã mới thêm của vòng theo `Dấu hiệu` của từng luật; chỗ chạm hiện thành khối
  «Luật sản phẩm bị chạm» trên thẻ Cổng Bằng chứng, và vòng không đi tiếp khi chưa có người.
- **Bộ tìm lỗi** ở lượt chấm đọc `CLAUDE.md` của kho, không đọc tệp này. Muốn bộ tìm lỗi thấy luật,
  thêm một dòng trỏ vào `CLAUDE.md`, ví dụ: «Luật sản phẩm của kho: `PRODUCT-INVARIANTS.md` — nêu mã
  `SP-<số>` khi một thay đổi trái luật.» Mục ngoài hợp đồng nhắc một mã có trong tệp sẽ mang nhãn luật
  trên thẻ.

## Hình dạng một luật

Mỗi luật là một khối bắt đầu bằng tiêu đề cấp hai `## SP-<số> · <câu luật>`, theo sau là các dòng
trường. Phần ngoài các khối `## SP-` (lời dẫn, mục «Sản phẩm là gì») là văn tự do của kho — bộ đọc bỏ
qua.

- **Mức** (bắt buộc): `thường` hoặc `khó đảo`. Luật khó đảo luôn mang nhãn khó-đảo trên thẻ.
- **Chủ luật** (bắt buộc): người quyết khi luật bị phạm.
- **Giữ bằng**: tên test hoặc lint giữ luật; chưa có thì `giữ bằng mắt`.
- **Dấu hiệu** (tuỳ chọn): biểu thức chính quy JavaScript, trong backtick, khớp một dòng mã mới thêm
  trái luật. Không biên dịch được, hoặc khớp cả chuỗi rỗng, thì khối đó sai khuôn. Bỏ dòng này khi luật
  không viết được thành dấu hiệu — luật vẫn được nạp ở bước thiết kế.
- **Phạm vi** (tuỳ chọn): danh sách glob trong backtick, cách nhau bằng dấu phẩy — dấu hiệu chỉ tính ở
  tệp khớp. Vắng = mọi tệp ngoài `_acceptance/`.
- **Vì sao**: một câu.

Mã có dạng cố định `SP-<số>`, không trùng. Khối thiếu Chủ luật, mức lạ, mã trùng hay dấu hiệu hỏng thì
bị bỏ và thẻ Cổng Phạm vi nêu một cờ vàng gọi tên khối; các luật còn lại vẫn đọc.

Khối dưới đây là nguồn DUY NHẤT của hình dạng — bộ kiểm rút đúng khối này để dựng tệp thử, nên đổi
nhãn ở đây mà không đổi bộ đọc (`scripts/luat-san-pham.cjs`) là ca đo đỏ.

<!-- <<<PRODUCT-INVARIANTS-TEMPLATE -->
```markdown
## SP-{so} · {cau}

- Mức: {muc}
- Chủ luật: {chu}
- Giữ bằng: {giu}
- Dấu hiệu: `{dau_hieu}`
- Phạm vi: {pham_vi}
- Vì sao: {vi_sao}
```
<!-- PRODUCT-INVARIANTS-TEMPLATE>>> -->
