# Review findings: dai-tom-tat-dem-dung-vi-sao-tron

## Trong hợp đồng

- **Doc rule (1) for «Vì sao: Gốc: … — <lý do>» still disagrees with the code when the «…» part contains an em dash with no spaces around it**
  file: skills/acceptance/references/lo-trinh-du-lieu.md:87
  severity: low
  AC: AC-10
  source: conventions
  detail: The round-2 fix narrowed the moi_nguoi.vi_sao sentence to "the two forms the code handles". Form (1) now says: «Vì sao: Gốc: <con trỏ> … — <lý do>» (with « — » spaced on both sides) takes the text after the first « — ». The code (scripts/ho-so-tom-tat.cjs, viSaoTu, line 158) matches `/^Vì sao:\s*Gốc:\s*\S+(?:\s+[^—]*?)?\s+—\s+(.+)$/`. The `[^—]*?` part rejects ANY em dash between the pointer and the separator, spaced or not. So when the free text «…» contains a range such as «AC-3—AC-5» or «(2026—10)», the regex fails. The paragraph also contains «Gốc:», so form (2) does not apply either, and the paragraph falls through to viSaoCua / viSaoDuCua(k,i,null). That path keeps the whole paragraph, prefix and pointer included. Reproduced on HEAD by calling viSaoTu directly. Input «Vì sao: Gốc: crm/_acceptance/x mục AC-3—AC-5 — lý do thật.» returns the full line for both the strip and the page ({doan:'Vì sao: Gốc: … — lý do thật.', muc:[]}). The doc predicts «lý do thật.». A related gap: «Vì sao: <chữ> Gốc: … — …», where «Gốc:» is not right after the prefix, has both «Gốc:» and « — ». None of the three doc clauses covers it: form (1) needs «Gốc:» first, form (2) needs no «Gốc:», and the đoạn-thường clause names only the case with no « — ». The code treats it as a đoạn thường. Real-data impact today is zero: all 24 vi_sao rows of docs/plans/lo-trinh-kit.json that contain «Gốc:» behave as the doc says (23 stripped; S3, with no em dash, keeps the prefix). The finding is reported because this sentence was rewritten this round specifically to make E10 / AC-10 («không câu nào mâu thuẫn mã») pass, and a judge can still produce a counter-example. Cheapest fix on the doc side: state that the «…» between the pointer and the separator must not contain an em dash. Alternatively, say that every other «Vì sao: … Gốc: …» paragraph is a đoạn thường, not only the ones without « — ».
  căn cứ phạm vi: AC-10 đòi mô tả ô vi_sao trong tài liệu khối dữ liệu «không câu nào mâu thuẫn mã»; finding chỉ ra một câu của đúng tài liệu đó (dạng 1 của «Vì sao: Gốc: …») mà mã xử lý khác ở đầu vào có dấu gạch dài không khoảng cách, và các vòng trước đã chấm AC-10 trên chính lớp lệch này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 3 (assert «chuỗi có mặt» trong khi lời hứa là quan hệ): DD-8 ca (g) không phân biệt được trang cắt tiền tố «Vì sao: Gốc: … —» với trang in nguyên dòng (r2)**
  Người dùng thấy gì: Nếu sau này trang hồ sơ đầy đủ lỡ in thừa phần đầu «Vì sao: Gốc: …» trước lý do thật, bộ kiểm tự động hiện tại vẫn báo xanh nên lỗi này sẽ không tự bị bắt. Hôm nay trang vẫn hiện đủ lý do; chỉ là không có gì giữ cho nó gọn như tài liệu mô tả.
  file: `tests/scripts/dai-tom-tat-dem-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc, không round-trip writer→reader): mọi ca DD-8 ghi đè mục «Vấn đề & ai gặp» mà --mo-o sinh, ca (g) chép tay dạng «Vì sao: Gốc: … — …» (r2)**
  Người dùng thấy gì: Bộ kiểm chưa thử với ô cơ hội do chính lệnh mở ô sinh ra. Nếu dòng câu giao tự sinh lọt vào ô «Vì sao», người đọc dải sẽ thấy câu giao thay cho lý do thật mà bộ kiểm vẫn xanh.
  file: `tests/scripts/dai-tom-tat-dem-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **DD-2-do ghim «8» tự thoả: chính câu báo lỗi đã chứa sẵn số 8 nên ca không chứng được bản tiêm đếm đôi (r1)**
  Người dùng thấy gì: Phép thử «cố tình làm hỏng rồi xem bộ kiểm có báo đỏ» cho lỗi đếm đôi giới hạn có thể vẫn báo xanh dù lỗi bị tiêm vào không phải lỗi đếm đôi. Sản phẩm vẫn đếm đúng; chỉ là bằng chứng «bộ kiểm biết bắt đúng lỗi này» yếu hơn vẻ ngoài.
  file: `tests/scripts/dai-tom-tat-dem-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Đường đo --hien-tai mục (iv) chỉ so câu cuối, bỏ vế «mục cuối» mà hợp đồng khai và DD-9 vẫn làm (r1)**
  Người dùng thấy gì: Lệnh đọc ngưỡng nghiệm thu trên kho crm chỉ kiểm câu cuối của lý do làm, chưa kiểm mục cuối của danh sách đi kèm. Nếu trang hồ sơ sau này làm rơi cả danh sách, lệnh này vẫn báo «sống»; chỉ bộ ca chính chạy trên bản ghim mới bắt được.
  file: `tests/scripts/dai-tom-tat-sau-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Ca chiều đỏ của dai-tom-tat-sau-kho chạy mà không đòi bản lành xanh trước (thiếu đối chứng dương) (r1)**
  Người dùng thấy gì: Hai phép thử «làm hỏng bản sao rồi xem báo đỏ» không kiểm trước rằng bản nguyên vẹn đang xanh, nên trong ca xấu chúng có thể báo «bắt được» khi lỗi thật đã có sẵn từ trước. Kết quả tổng vẫn đỏ, chỉ nguyên nhân hiển thị có thể sai.
  file: `tests/scripts/dai-tom-tat-sau-kho.mjs`
  severity: low
  Đề xuất: wont-fix

- **Đầu đoạn giới hạn không có dấu «:» mà mang nội dung, đứng một mình: ô in «0 giới hạn đã biết» và không bật cờ vàng (r1)**
  Người dùng thấy gì: Nếu hồ sơ ghi giới hạn bằng một câu đơn mở bằng «Known limits —» mà không có dấu hai chấm và không có gì theo sau, ô sẽ báo «0 giới hạn đã biết» dù hồ sơ có nhắc giới hạn, và không có cờ cảnh báo. Bản trước báo 1. Hiện chưa kho nào dính nên chưa sai hồ sơ nào.
  file: `scripts/ho-so-tom-tat.cjs`
  severity: medium
  Đề xuất: new-contract

- **Khối giới hạn viết bằng bảng bị đọc thành MỘT đoạn: in «1 giới hạn đã biết» và trang liệt một dòng bảng bị nối dính (r1)**
  Người dùng thấy gì: Khi mục giới hạn của hồ sơ chỉ là một bảng, ô báo «1 giới hạn đã biết» và trang hồ sơ in cả bảng thành một dòng dính, thay vì nói «chưa đọc được». Hiện chưa hồ sơ thật nào dính, và bản trước cũng sai theo chiều khác.
  file: `scripts/ho-so-tom-tat.cjs`
  severity: medium
  Đề xuất: known-limits

- **Phép đo sáu kho nuốt ngoại lệ của mô-đun đang kiểm: hồ sơ làm mô-đun ném lỗi bị bỏ qua lặng lẽ ở DD-9 và ở vế (iv) của --hien-tai (r1)**
  Người dùng thấy gì: Nếu bộ đọc mới hỏng và ném lỗi trên vài hồ sơ, phép đo trên sáu kho sẽ lặng lẽ bỏ qua những hồ sơ đó và vẫn báo xanh. Hiện không hồ sơ nào trong 735 hồ sơ thật gây lỗi nên chưa ảnh hưởng ai, nhưng lưới này chưa chặn được hồi quy về sau.
  file: `tests/scripts/dai-tom-tat-sau-kho.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (không ghim đúng thông điệp): chiều đỏ DD-2-do và DD-5-do-bao-cao ghim một chữ có sẵn trong khuôn thông điệp của chính ca (r1)**
  Người dùng thấy gì: Hai phép thử «cố tình làm hỏng rồi xem báo đỏ» (đếm đôi giới hạn, và nguồn hỏng là báo cáo) ghim vào một chữ mà câu báo lỗi luôn tự in ra, nên chúng có thể báo «bắt được» cho bất kỳ lỗi nào. Sản phẩm không sai; chỉ là bằng chứng chiều đỏ lỏng hơn vẻ ngoài.
  file: `tests/scripts/dai-tom-tat-dem-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng đếm cả phần tử không được so): DD-9 tính «câu dẫn so mục cuối» trước khi so và bỏ qua im lặng khi bộ tách trả null (r1)**
  Người dùng thấy gì: Phép đo trên sáu kho báo «19 hồ sơ đã kiểm mục cuối» trong khi thực ra chỉ 18 được so, một hồ sơ crm mà bộ tách của phép đo không tách được bị bỏ qua vẫn được tính. Cùng lớp: lỗi ném ra bị nuốt, và lệnh đọc ngưỡng chỉ kiểm câu cuối. Sản phẩm không sai; con số phép đo tự khai cao hơn thực tế.
  file: `tests/scripts/dai-tom-tat-sau-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture không round-trip từ writer thật): khối ghim lại của ca DD-3 (f) rút từ khuôn tài liệu SKILL, không từ repin-lane.mjs (r1)**
  Người dùng thấy gì: Phép thử khối «ghim lại» lấy mẫu từ tài liệu hướng dẫn chứ không từ chính công cụ sinh ra khối đó. Nếu công cụ đổi chữ tiêu đề mà tài liệu giữ nguyên, phép thử vẫn xanh còn báo cáo thật có thể bị đếm lẫn khối ghim lại vào số giới hạn.
  file: `tests/scripts/dai-tom-tat-dem-dung.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
