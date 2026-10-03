# Review findings: loi-moi-tran-luot-loi-song-co-gia (round 2)

## Trong hợp đồng

Không có phát hiện nào ánh xạ được vào một AC ở round này. Phát hiện mức high của round 1 (AC-1, hàng 6 chỉ đo nửa «SUITE-*») đã được xử lý bằng hàng 6b và đột biến bo-loc-ngoai-evals.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Phần expected của E1 vẫn ghi «chín hàng» trong khi ma trận nay có mười hàng**
  Người dùng thấy gì: Ghi chú mô tả bộ kiểm nói «chín trường hợp» nhưng thực tế đã kiểm mười. Thẻ gửi cho người ký vẫn đúng, chỉ người đọc hồ sơ kiểm có thể thấy hai con số lệch nhau.
  file: `_acceptance/loi-moi-tran-luot-loi-song-co-gia/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Mutant LT-dot-bien-bo-loc-ngoai-evals passes even when the 6b fixture is broken**
  Người dùng thấy gì: Khi chạy riêng phép thử tự kiểm này, nó có thể báo «đạt» dù dữ liệu thử đã hỏng. Người dùng thẻ không bị ảnh hưởng; chỉ làm người bảo trì tin nhầm vào một dấu xanh khi chạy lẻ.
  file: `tests/scripts/lmtl-the.test.mjs`
  severity: low
  Đề xuất: known-limits

- **E1 expected still says a nine-row matrix, but the test now has ten rows (6b added)**
  Người dùng thấy gì: Ghi chú mô tả bộ kiểm nói chín trường hợp trong khi đã kiểm mười, và phép đếm tự kiểm không thể phát hiện lệch này. Thẻ cho người ký vẫn đúng, chỉ phần hồ sơ kiểm có thể làm người đọc bối rối.
  file: `_acceptance/loi-moi-tran-luot-loi-song-co-gia/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Phút của một lượt lấy dòng thuoc-vat CUỐI CÙNG của lượt đó, trong khi SKILL mới bảo chạy lại thuoc-vat --write ở điểm dừng, nên số phút bị thổi phồng** (r1)
  Người dùng thấy gì: Khi người ký cân nhắc lối «chấm thêm một lượt», con số «khoảng N phút máy» trên thẻ có thể lớn hơn thực tế, vì tính cả thời gian phiên viết báo cáo sau khi lượt đã xong. Người ký có thể bỏ lối rẻ vì tưởng nó đắt hơn thật.
  file: `scripts/loi-ra-tran-luot.cjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/3 lỗi rơi vào file không bộ đo nào phủ (_acceptance/loi-moi-tran-luot-loi-song-co-gia/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
