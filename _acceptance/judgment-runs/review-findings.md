## Trong hợp đồng

- **Cờ cảnh báo ô-inert bị nuốt hoàn toàn khi dòng đầu của ## Variance còn là placeholder {{…}}**
  file: `scripts/gate-card.js:388`
  severity: high
  AC: AC-14
  detail: Guard `if (lines.length && !/^\{\{/.test(lines[0]))` đặt ở cấp KHỐI, nên chỉ cần DÒNG ĐẦU của section `## Variance` còn nguyên placeholder của template (`{{eval ids with mixed pass_rate + their pass_rate, or "none — …"}}`) là cả hai cờ — kể cả câu cảnh báo inert do máy tính sẵn ở dòng sau — bị bỏ qua im lặng. Đây đúng lớp lỗi mà feature judgment-runs sinh ra để diệt: cảnh báo đi tới mặt người ký biến mất không báo lỗi.

  Đã tái hiện: dựng workspace fixture với `## Variance` = [dòng 1: placeholder `{{…}}`, dòng 2: câu `Field khai mà máy không dùng: E10 khai \`runs: 3\` …`] rồi chạy `node scripts/gate-card.js --slug rt` → `grep -c "Field khai"` trả về 0 (không cờ vàng nào). Bỏ dòng placeholder đi thì cờ vàng xuất hiện.

  Gốc: placeholder là thuộc tính CỦA TỪNG DÒNG (dòng phương-sai chưa điền), không phải của cả section — chính comment ngay trên đó đã nói "Tách theo DÒNG, KHÔNG theo vị trí chuỗi" nhưng guard `{{` vẫn còn ở cấp khối. Cách sửa cùng tinh thần: lọc placeholder theo dòng (`lines.filter(l => !/^\{\{/.test(l))`) trước khi tách inert/rest, hoặc chỉ áp guard `{{` cho nhánh `rest`. Câu inert do JS sinh không bao giờ bắt đầu bằng `{{` nên nó không cần guard này.

  WI6 trong tests/workflows/acceptance-verify.test.mjs kiểm cả hai thứ tự note-trước/note-sau nhưng KHÔNG có ca placeholder, nên lỗ này lọt qua cả test lẫn mutation-check. Bản mirror plugins/acceptance-gate/scripts/gate-card.js giống hệt (cùng dòng).
  source: bugs

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Reader chỉ khớp inert-note khi dòng KHÔNG có trang trí markdown — bullet/bold làm cờ vàng biến thành cờ đỏ sai nhãn**
  Người dùng thấy gì: Nếu người viết báo cáo trình bày câu cảnh báo bằng gạch đầu dòng hay chữ đậm thay vì chép đúng nguyên văn, thẻ quyết định có thể hiện nhầm đây là lỗi lệch kết quả (cờ đỏ) thay vì đúng bản chất 'trường khai mà máy không dùng' (cờ vàng), khiến người ký hiểu sai nguyên nhân.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Lớp "runs khai mà máy không dùng" mới quét nửa: runs sai kiểu / ngoài dải trên test/script vẫn im lặng**
  Người dùng thấy gì: Nếu ai đó khai số lần chạy (runs) bằng giá trị sai kiểu, số 0, số âm, hoặc vượt quá 10 trên eval loại test/script, hệ thống tự sửa âm thầm sang giá trị khác mà không báo cho người ký — báo cáo có thể ghi số lần chạy khác với những gì đã khai mà không ai biết.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract

- **Câu inert chỉ khác một tiền tố (vd gạch đầu dòng markdown) là bị dán nhãn SAI thành cờ đỏ phương-sai, mất cờ vàng**
  Người dùng thấy gì: Nếu người viết báo cáo thêm gạch đầu dòng trước câu cảnh báo 'trường khai mà máy không dùng' khi chép vào báo cáo, thẻ quyết định sẽ hiện nhầm thành cảnh báo lệch kết quả (đỏ) còn cờ vàng đúng bản chất thì biến mất — người ký nhận sai tín hiệu và không thấy cảnh báo thật.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Không có phép kiểm nào bảo đảm câu inertNote thật sự lọt vào evidence-report — mất câu là mất im lặng**
  Người dùng thấy gì: Không có gì bảo đảm câu cảnh báo 'trường khai mà máy không dùng' thực sự xuất hiện trong báo cáo cuối cùng — nếu AI viết báo cáo bỏ sót hoặc viết lại câu này, người ký ở Cổng 2 sẽ không thấy cảnh báo đó mà không có dấu hiệu gì báo rằng nó đã bị mất.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
