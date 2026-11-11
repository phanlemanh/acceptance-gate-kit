## Trong hợp đồng

- **Đối chứng dương (biến `lanh`) bỏ sót TB0, trong khi evals.yaml E3 nói ca TB-do chỉ chạy khi vật lành xanh**
  file: `tests/design-eval/tier-b-loi-doc.test.mjs:246`
  severity: low
  AC: AC-3
  detail: `lanh` gộp nguon, tb1, tb2, cauCu, loiGoi, cong nhưng không xét kết quả TB0 (ma trận bộ quét thật so với ma trận viết trước). Nếu bộ quét lành lệch ma trận, TB-do-2 và TB-do-6 vẫn chạy `chayMaTran` trên bản bị phá và có thể xanh, trái invariant «bản nguyên vẹn phải XANH trước khi tin bản bị tiêm là ĐỎ». TB1 nằm trong `lanh` nên ảnh hưởng hẹp, nhưng khoảng hở có thật.
  source: conventions

- **TB5/TB-do-14 checks only the failing side against the gate, with no passing control and no pinned message**
  file: `tests/design-eval/tier-b-loi-doc.test.mjs:428`
  severity: medium
  AC: AC-6
  detail: kiemCong chỉ kiểm `!r.consistencyFailure` sau khi gọi `cong.evaluateEvidence(baoCao('PASS', h5), {})`. Không có bước chứng minh evaluateEvidence trả consistencyFailure=null trên báo cáo sạch dựng cùng cách (ví dụ hàng `PASS | 0`), và không ghim thông điệp lỗi nói về mã 5. Nếu cổng từ chối mọi báo cáo do baoCao dựng vì lý do khác, TB5 và TB-do-14 vẫn xanh. Vi phạm luật «assertion âm-tính-một-mình» (CLAUDE.md); chú thích dòng 415 tự nhận có đối chứng dương nhưng chỉ có determineEnforce, không đo việc từ chối.
  source: bugs

- **The healthy-baseline gate for the TB-do cases leaves out TB0 (the scan matrix)**
  file: `tests/design-eval/tier-b-loi-doc.test.mjs:464`
  severity: low
  AC: AC-3
  detail: `lanh` không gồm TB0 (kiểm ma trận 10 ô với `mong`). TB-do-2 và TB-do-6 gọi chayMaTran trên bản bộ quét đã sửa, vẫn chạy và có thể PASS khi bộ quét lành đã lệch ma trận. Trái chú thích «vật lành phải xanh trên cùng fixture trước khi tin màu đỏ» và lời khai E3. Cả bộ vẫn đỏ vì TB0 được đếm, nên khoảng hở nằm ở độ tin của các dòng TB-do.
  source: bugs

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Chú thích khoá `tier_b_loi_doc` trong config đã cũ: liệt kê TB0…TB3 và TB-do-1…9, trong khi tệp ca có TB0…TB5 và TB-do-1…14**
  Người dùng thấy gì: Dòng ghi chú mô tả phạm vi phép kiểm đang liệt kê thiếu một số ca, nên người đọc có thể hiểu sai phép kiểm này bao gồm những gì. Kết quả kiểm thật không bị ảnh hưởng.
  Căn cứ: Hậu quả nhẹ: chỉ là ghi chú lỗi thời, không làm sai kết quả hay mất dữ liệu, và sửa sau rất rẻ.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **Rows that write no exit code let a PASS report carry a BLOCKED design block past the evidence gate**
  Người dùng thấy gì: Một báo cáo tự xưng đạt vẫn có thể lọt qua cổng dù phần kiểm thiết kế ghi là chưa đo được và không kèm mã lỗi. Chỉ trường hợp chưa đo được khi đòi đo đủ mới bị chặn.
  Căn cứ: Hậu quả vừa: báo cáo có thể nhận đạt sai ở ca hiếm, nhưng người ký vẫn thấy dòng chặn trên báo cáo, và sửa đòi đổi cổng bằng chứng nên đắt hơn phạm vi vòng này.
  file: `skills/acceptance/references/design-ui-check.md`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 — fixture VIẾT TAY đúng khuôn bên đọc ở TB5 (không rút từ khuôn viết có marker), nên vế đối chứng theo từng hàng chỉ lặp lại chính đầu vào**
  Người dùng thấy gì: Báo cáo mẫu dùng để thử cổng được viết tay theo đúng dạng cổng đọc, nên nếu khuôn báo cáo thật đổi dạng thì phép thử có thể vẫn xanh dù báo cáo thật đã khác.
  Căn cứ: Hậu quả nhẹ đến vừa: chỉ làm phép thử kém nhạy khi khuôn đổi, người dùng không mất dữ liệu, và cổng thật vẫn chạy ở vế từ chối.
  file: `tests/design-eval/tier-b-loi-doc.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
