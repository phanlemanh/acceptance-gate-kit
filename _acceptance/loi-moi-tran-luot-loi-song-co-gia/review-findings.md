# Review findings: loi-moi-tran-luot-loi-song-co-gia (round 1)

## Trong hợp đồng

- **Hình dạng 5 (tuyên quét LỚP nhưng chỉ có điểm-case): hàng (6) của ma trận AC-1 chỉ đo nửa SUITE-*, bỏ hẳn nửa «id ngoài evals.yaml»**
  file:line: `tests/scripts/lmtl-the.test.mjs:134`
  severity: high
  AC: AC-1
  source: measurement
  detail: AC-1 (contract.md dòng 34) khai hàng (6) là «`SUITE-*` VÀ id ngoài `evals.yaml` không vào `lap`». Ma trận H của LT-AC1-lap chỉ có hàng `['6 SUITE khong vao lap', LOG.suite, ...]`, và mọi sổ fixture (LOG.*) chỉ chứa E1–E3 cộng SUITE-*. EVALS_YAML luôn khai đủ E1–E3, nên không hàng nào có dòng eval với id vắng trong evals.yaml. Vế `coKhoa(evalMeta, o.evalId)` trong `laEvalHopDong` (scripts/loi-ra-tran-luot.cjs:28) vì thế không bị phép đo nào chạm tới. Đột biến `bo-loc-id` (dòng 301) thay CẢ biểu thức bằng `return true`, nên nó đỏ nhờ vế SUITE. Một đột biến chỉ gỡ vế `coKhoa(...)`, hoặc đảo vế đó, vẫn xanh trên cả chín hàng. Ca tuyên ma trận «số assert = số hàng», nhưng một phần tử đã khai của lớp không có assert nào.
  rationale: AC-1 khai đích danh hàng (6) gồm cả «id ngoài evals.yaml không vào lap» và cam kết số assert = số hàng; phép đo chỉ phủ nửa SUITE-*, nên một vế đã khai của AC-1 không có bằng chứng đo.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Phút của một lượt lấy dòng thuoc-vat CUỐI CÙNG của lượt đó, trong khi SKILL mới bảo chạy lại thuoc-vat --write ở điểm dừng, nên số phút bị thổi phồng**
  Người dùng thấy gì: Khi người ký cân nhắc lối «chấm thêm một lượt», con số «khoảng N phút máy» trên thẻ có thể lớn hơn thực tế, vì tính cả thời gian phiên viết báo cáo sau khi lượt đã xong. Người ký có thể bỏ lối rẻ vì tưởng nó đắt hơn thật.
  file: `scripts/loi-ra-tran-luot.cjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (số assert = số phần tử là assert chết): phép đếm của LT-AC7 và các kiểm `n !== H.length` đúng theo cấu trúc, không bao giờ đỏ**
  Người dùng thấy gì: Một số phép kiểm tự động của thẻ Lối ra không thể báo đỏ dù thiếu sót, nhưng từng trường hợp thật vẫn được kiểm riêng nên người dùng không nhận thẻ sai vì điều này. Chi phí sửa lớn hơn rủi ro hiện có.
  file: `tests/scripts/lmtl-the.test.mjs`
  severity: medium
  Đề xuất: wont-fix

- **Hình dạng 4 (âm tính một mình): kiểm đột biến chỉ ghim TÊN HÀNG, không ghim thông điệp, và không có đối chứng dương trên bản sao**
  Người dùng thấy gì: Bộ kiểm tự động của thẻ Lối ra có thể báo «đã bắt đúng lỗi» ngay cả khi thẻ thật ra bị hỏng hẳn, nên màu xanh của nó chưa đáng tin hoàn toàn. Hiện chưa có trường hợp nào làm người ký nhận thẻ sai.
  file: `tests/scripts/lmtl-the.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
