# Review Findings: cham-khong-tu-dot-luot (round 2)

## Trong hợp đồng

- **Nhánh khoan dung «câu dịch OOS-n nằm trong khoá scope» của AC-6 chưa được dựng; card-plain.scope bị bỏ qua mà không có cờ**
  file: `scripts/gate-card.js:792`
  severity: medium
  source: conventions
  AC: AC-6
  AC-6 trong hợp đồng hứa: «mục có dòng dịch (khoá `OOS-n` trong `scope` HOẶC trong `wont_do` — bộ đọc khoan dung hình crm) dùng câu dịch». Mã chỉ đọc `pl.wont_do`: `scopeText = x => pmap(pl.wont_do, x.id) || …`, và `dichLac` cũng chỉ quét `pl.wont_do` (dòng 794). Ngoài ra không chỗ nào trong gate-card.js đọc `pl.scope`. Vì vậy một card-plain.json đặt `scope: [{id:'OOS-1',p:…}]` sẽ ra thẻ chỉ có chữ hợp đồng, không có cờ «dòng dịch không khớp mục nào». Các ca CK-AC6* chỉ thử đường `wont_do`, nên E6 xanh mà không chạm vào lời hứa này. Hai vế này cũng đang mâu thuẫn nhau: `scope` không nằm trong danh sách đóng CARD-PLAIN-KEYS (P147), nên nếu dựng nhánh đọc này thì phải thêm khoá vào khuôn. Nếu không dựng thì phải sửa chữ AC-6 và ghi quyết định, không được để evidence báo AC-6 ĐẠT trên một vế chưa làm.

- **Out-of-scope translations under the `scope` key are silently ignored, which contradicts the reader contract in AC-6**
  file: `scripts/gate-card.js:792`
  severity: medium
  source: bugs
  AC: AC-6
  The contract text for AC-6 (_acceptance/cham-khong-tu-dot-luot/contract.md:42) says an out-of-scope item uses its translation when an `OOS-n` key is present 'trong `scope` HOẶC trong `wont_do`' (in `scope` OR in `wont_do`); the tolerant reader is meant to accept the crm shape. The code reads only `wont_do`: `scopeText = x => pmap(pl.wont_do, x.id) || stripMd(x.text)`. The unmatched-translation check `dichLac` also scans only `pl.wont_do`. A card-plain.json that puts `{id:'OOS-n', p}` under `scope` has every translation dropped: the card falls back to the raw contract text and no yellow flag appears, because `scope` is never checked for unmatched ids. The reviewer gets no sign that the translations were lost. Fix: also look up `pl.scope` in scopeText, and include `pl.scope` ids in the `dichLac` check. (Bản diễn đạt khác của cùng phát hiện t2 ở trên.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Cổng 2 vẫn để scope_plain thay hết các mục OOS, trái với nghĩa mới của khuôn**
  Người dùng thấy gì: Ở màn hình xác nhận bằng chứng (Cổng thứ hai), người duyệt có thể chỉ thấy một câu tóm tắt chung thay vì đầy đủ từng mục đã cắt hoặc hoãn, nên dễ bỏ sót phần cần giữ lại.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: new-contract

- **Cắt outputTail của lệnh PASS còn 3 dòng thì giờ gần như chỉ còn dòng trống và dấu __EXIT**
  Người dùng thấy gì: Với các bước kiểm tra đã đạt, phần tóm tắt kết quả cuối cùng có thể bị mất trong báo cáo bằng chứng, khiến người đọc báo cáo không thấy được dòng tổng kết thật của bước đó.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Khung bọc báo mktemp hỏng thành mã thoát 1 của sản phẩm, không tự xưng là hạ tầng**
  Người dùng thấy gì: Nếu môi trường chạy gặp trục trặc tạm thời hiếm gặp, hệ thống có thể báo lượt kiểm tra thất bại như lỗi thật của sản phẩm thay vì báo đây là sự cố hạ tầng, khiến một lượt bị mất oan mà không do lỗi của tính năng.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **nhanLyDo còn nhánh chết và tham số laEval không dùng sau khi đổi sang «lý do không rỗng → mu»**
  Người dùng thấy gì: Không ảnh hưởng người dùng — đây chỉ là phần mã còn sót lại chưa dọn dẹp sau khi đổi logic phân loại.
  file: `lib/nhan-canh-gay.cjs`
  severity: low
  Đề xuất: wont-fix

- **The exit-code wrapper always reports success to the Bash tool, so a failing command can pass when the marker line is missing**
  Người dùng thấy gì: Một bước chạy lệnh có thể báo thành công với công cụ điều phối ngay cả khi lệnh đó thực sự thất bại, nếu dòng đánh dấu kết quả bị cắt hoặc thiếu; điều này có thể khiến một lượt lẽ ra phải dừng lại vì lỗi thật lại được cho qua như thể mọi thứ ổn.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 1 (đo CHỈ DẪN/nhãn PASS thay vì ĐẦU RA): expected của E2 trong evals.yaml vẫn mô tả hàng 7 cũ, trái với assert đang chạy**
  Người dùng thấy gì: Phần mô tả kỳ vọng của một phép kiểm tự động chưa được cập nhật theo đúng thay đổi mới nhất, có thể khiến người đọc báo cáo sau này hiểu nhầm điều phép kiểm đang thực sự bảo đảm, dù kết quả kiểm tra hiện tại vẫn đúng.
  file: `_acceptance/cham-khong-tu-dot-luot/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): CK-AC5 vế «rác → bỏ trường» xanh rỗng khi không có mốc PROVENANCE**
  Người dùng thấy gì: Một phép kiểm tự động có thể báo đạt ngay cả khi không thực sự kiểm tra được điều nó tuyên bố kiểm tra, nếu dữ liệu đầu vào có hình dạng bất thường — nghĩa là một số trường hợp lỗi thật có thể lọt qua mà không ai biết.
  file: `tests/scripts/ckdl-cham.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).