# Review findings — ma-so-quyet-dinh-duy-nhat (S4 round 1, một reviewer tươi trên diff `origin/main...HEAD`)

## Trong hợp đồng

- **Khuôn `DEC-ID-RECIPE` hỏng khi câu có dấu nháy đơn** · severity: high · AC-1
  Câu như `sua loi user's config` (hoặc lý do veto nguyên văn của người) làm shell báo lỗi trích dẫn và không ghi được dòng nào; DK07 không bắt vì chỉ thay `<slug>`, không điền câu thật.
  → **Đã sửa cùng round:** phần JSON của lệnh chuyển sang heredoc có nháy (`<<'JSON'`), mọi ký tự trong câu ghi nguyên văn; DK13 ghi câu thật mang nháy đơn, `%`, `$HOME`, backtick, `\"` dưới bash và zsh; đột biến bỏ nháy heredoc → `$HOME` bị mở rộng, backtick bị chạy → đỏ với giá trị ghim.

## Ngoài hợp đồng

## Đã kiểm thấy đúng (reviewer)

- `decKey`/`decKeys` đúng qua dấu niêm Cổng 1: `decsApproved`/`decsProvisional` là lát cắt của cùng mảng `ledger.entries`, khoá tra theo danh tính đối tượng (DK12, đột biến đổi thứ tự đỏ).
- Đường đọc-cũ: overlay mã trần của mã trùng bị bỏ qua, mã duy nhất vẫn dịch, thông điệp stderr khớp chữ hợp đồng (DK03).
- Guard overlay sai dạng: phần tử null và object thay mảng đều ra thẻ, gỡ guard sập với TypeError (DK09).
- Các ca đột biến DK06, DK08, DK10, DK11, DK12 đều có đối chứng dương trên cùng fixture và thông điệp ghim.
- Khuôn `DEC-PLAIN-ITEM-TEMPLATE` nói đúng rằng trường `id` của overlay mang giá trị `key` (DK11).
- Danh sách đóng `CARD-PLAIN-KEYS` không đổi (chỉ thêm trường lồng `key`), P147 xanh; `lop-nhin-thay.test.mjs` và `gate-card-lmcms.test.mjs` xanh trọn.

## Ghi chú reviewer — không tính là finding

- Dòng tóm tắt «Seal» trong SKILL feature-loop (không đổi trong diff) còn viết `{"id":"d-...",...}` thay vì trỏ khối `DEC-ID-RECIPE` — reviewer ghi «vô hại về chữ, không phải lỗi»; AC-8 chỉ đòi approve.md/signoff.md.
- `scripts/gate-card.js` dài 1063 dòng từ trước; diff chỉ thêm ~22 dòng ròng.
