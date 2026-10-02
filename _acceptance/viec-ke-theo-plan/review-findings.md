# Review findings: viec-ke-theo-plan (round 1)

## Trong hợp đồng

- **The «tệp khai khác hồ sơ» flag fires on planned-slug rows that have no hồ sơ, against the design table**
  file: `scripts/lo-trinh.mjs:133`
  severity: low
  AC: AC-4
  source: bugs
  detail: The condition `!tinTheoLoi && khaiChuan && khaiChuan !== chu` is true for every row that has a slug, including rows whose `_acceptance/<slug>/` directory does not exist (chu = «Chưa mở») and rows with an invalid slug. The design doc limits this flag to rows that have both a slug and a directory, and its table says a planned slug gets no flag (`Cờ: không — slug dự kiến là hợp lệ`). Reproduced: {ma:'1',slug:'x',trang_thai:'Đã giao'} with no `_acceptance/x/` gives the flag «hàng 1: tệp khai khác hồ sơ: khai Đã giao, hồ sơ Chưa mở», which names a hồ sơ that does not exist. Fix: gate the comparison on `coHoSo`. Lý do vào hợp đồng: AC-4 nói không điều kiện hàng slug dự kiến chưa có thư mục in «Chưa mở» và KHÔNG cờ; finding cho thấy hàng như vậy vẫn bị gắn cờ lệch khi có tự khai.

- **Hình dạng 4 (âm-tính-một-mình, không ghim thông điệp): LT-12-kho chỉ đòi exit khác 0, còn «thông điệp ghim» là chữ viết sẵn**
  file: `tests/scripts/lo-trinh.test.mjs:557`
  severity: medium
  AC: AC-12
  source: measurement
  detail: Dòng 557–558: `const x = chayS0('node scripts/lo-trinh.mjs --root . --hang 9b', LT12()); if (lanh.status === 0 && x.status !== 0) ok('LT-12-kho', '... «lệnh S0 không chạy được ở kho tiêu thụ»')`. Ca có đối chứng dương (`lanh`), nhưng vế đỏ chỉ đòi `x.status !== 0` và không đọc stderr. Chuỗi mà E12 gọi là «thông điệp ghim» nằm sẵn trong lời gọi ok(), không ai so nó với đầu ra thật. Mọi lý do khiến lệnh thoát khác 0 đều cho cùng màu xanh: thiếu mô-đun, sai cờ, `--root` hỏng, lỗi cú pháp. Thêm nữa, lệnh đỏ là một chuỗi gõ tay, không rút từ `khoiS0()`, nên nó không phải «bản sao khối» như E12 mô tả. Nếu khối S0 trong SKILL đổi hình mà vẫn chạy được thì ca này không liên quan gì tới khối đó. Hai đòi hỏi của luật «assertion âm-tính-một-mình» chỉ được đáp một (có đối chứng dương, không ghim thông điệp): cần ghim stderr thật, ví dụ /Cannot find module .*scripts\/lo-trinh\.mjs/. Lý do vào hợp đồng: AC-12 đòi chiều đỏ của bản sao đường tương đối phải đỏ kèm thông điệp ghim; phép đo hiện chỉ đòi thoát khác 0 nên chưa chứng minh được vế đó.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Gate-close commits stage only PRODUCT-MAP.md, so the LO-TRINH.html written in the same pass is left out and CI --check fails**
  Người dùng thấy gì: Kho nào khai lộ trình rồi duyệt hoặc ký một vòng thì trang lộ trình được vẽ lại nhưng không vào commit đóng cổng. Kiểm tra trên PR sẽ báo đỏ ở mỗi lần đóng cổng cho đến khi người ta tự thêm trang đó vào tay.
  file: `scripts/product-map.mjs`
  severity: high
  Đề xuất: new-contract

- **P99 mutant copy extends a hand-written file list instead of copying whole directories**
  Người dùng thấy gì: Một phép thử cũ của kit có thể báo đỏ nhầm khi sau này thêm một script mới, dù tính năng không hỏng. Người dùng cuối không bị ảnh hưởng, chỉ người bảo trì mất công tìm nguyên nhân.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Scalar `dung_tren` (or `moc[].hang`) is silently dropped, so a row that depends on unfinished work can become the next row with no flag**
  Người dùng thấy gì: Nếu chủ kho gõ nhầm phần phụ thuộc của một hàng thành một chữ thay vì một danh sách, hàng đó vẫn được gợi ý làm việc kế tiếp dù hàng nó phải chờ chưa xong, và không có cảnh báo nào. Mốc khai sai kiểu cũng làm mất thông báo hàng trễ.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: new-contract

- **Free-text `/feature-loop` arguments break the S0 roadmap-row command (unquoted `<mã>`), and the resulting exit 2 has no handling rule**
  Người dùng thấy gì: Khi người dùng gõ một mô tả dài thay vì mã hàng để bắt đầu vòng, bước nhận hàng có thể báo lỗi lạ thay vì coi đó là mô tả công việc. Họ phải gõ lại hoặc tự hiểu lỗi.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: new-contract

- **An invalid slug that escapes `_acceptance/` is still read for the «sống qua Cổng Đáng» count**
  Người dùng thấy gì: Một hàng có tên hồ sơ không hợp lệ vẫn có thể làm con số «hàng sống qua Cổng Đáng» đếm một tệp nằm ngoài thư mục hồ sơ, trong khi chính hàng đó bị gắn cờ không hợp lệ. Số trên trang có thể lệch nhẹ trong ca khai sai cố ý.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): LT-07 kết luận «tệp không bị ghi» mà không kiểm bốn lệnh có thật sự chạy tới chỗ đọc tệp**
  Người dùng thấy gì: Phép kiểm «kit không sửa tệp ý định» có thể báo xanh dù một trong các lệnh chết sớm trước khi đọc tệp. Cam kết kit không ghi vào tệp của chủ kho vẫn được giữ, chỉ là bằng chứng yếu hơn mức lý tưởng.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): ô hồ sơ của «crm OKR thật» do tay khai trong `_nguon.ho_so`, cờ lệch ở hàng 7n do chính fixture dựng ra**
  Người dùng thấy gì: Dữ liệu mẫu mô phỏng lộ trình thật của kho crm được dựng tay, nên việc trang đọc đúng trên mẫu chưa chứng minh đọc đúng trên lộ trình thật. Chỉ khi kho thật chuyển sang tệp mới biết chắc.
  file: `tests/scripts/fixtures/lo-trinh/crm-okr.json`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (chỉ đòi «có mặt» trong khi lời hứa là quan hệ): LT-09-crm chỉ đòi hangKe khác null và đang xanh trên một hàng mà bộ đọc tự gắn cờ hỏng**
  Người dùng thấy gì: Trên lộ trình mẫu của kho crm, hàng được gợi ý làm kế tiếp có thể là một hàng còn thiếu câu giao, tức hàng chưa sẵn sàng. Gợi ý vẫn xuất hiện nhưng chưa chắc là lựa chọn tốt nhất.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
