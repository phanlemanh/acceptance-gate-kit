# Review findings: dai-tom-tat-dem-dung-vi-sao-tron

## Trong hợp đồng

- **New «Vì sao:» rule in the reference doc is broader than the code: a paragraph that contains «Gốc:» but has no « — <lý do>» keeps its prefix and is expanded into a list**
  file: skills/acceptance/references/lo-trinh-du-lieu.md:87
  severity: low
  AC: AC-10
  source: conventions
  detail: The sentence added this round says that any paragraph opening with «Vì sao:» keeps only the text after the prefix, on both the strip and the evidence page, and is never expanded into a list or joined with an attached list. It names «Vì sao: Gốc: <con trỏ> — <lý do>» as one included case. The code in scripts/ho-so-tom-tat.cjs (viSaoTu, lines 158-162) strips the prefix in only two cases: (1) the paragraph matches /^Vì sao:\s*Gốc:\s*\S+…\s+—\s+(.+)$/; (2) the paragraph opens with «Vì sao:» and contains no «Gốc:» anywhere. Every other «Vì sao:» paragraph falls through to viSaoCua / viSaoDuCua(k,i,null), which keep the prefix and do expand a câu dẫn into a list. Measured by calling viSaoTu directly: (a) «Vì sao: Gốc: crm/_acceptance/a» returns «Vì sao: Gốc: crm/_acceptance/a» for both the strip and the page (prefix kept); (b) «Vì sao: xem Gốc: crm/_acceptance/a, ba chỗ hở:» followed by «- một.» and «- hai.» returns «Vì sao: xem Gốc: …, ba chỗ hở: một · hai», with page muc [«một.», «hai.»]. The doc says this case must not be expanded. This shape can occur because lo-trinh.mjs --mo-o (line 791) writes «Vì sao: ${hang.vi_sao}» verbatim. hang.vi_sao is free text (doc line 82), and the kit's own anchor rule (^Gốc:\s*\S+/_acceptance/...) does not require « — lý do». No real case was found in the local kit or crm opportunity.md files (0 «Gốc:» without a dash), so the impact today is theoretical. The risk is to this round: E10 is a judgment eval that asks «Có câu nào mâu thuẫn mã không?» of exactly this doc and this code, and this sentence is new. A judge who finds the mismatch can fail E10 again. Fix either way: narrow the doc sentence to the two shapes the code handles, or make the code strip «Vì sao:» for every paragraph that opens with it.
  căn cứ phạm vi: AC-10 đòi mô tả ô vi_sao trong tài liệu khối dữ liệu «không câu nào mâu thuẫn mã»; câu mới nói mọi đoạn mở bằng «Vì sao:» đều bỏ tiền tố và không mở thành danh sách, trong khi mã chỉ làm vậy ở hai dạng.

- **The new «Vì sao:» rule in the doc contradicts the code when a «Vì sao: Gốc: …» paragraph has no « — »; the kit's own roadmap has a row like this**
  file: skills/acceptance/references/lo-trinh-du-lieu.md:87
  severity: medium
  AC: AC-10
  source: bugs
  detail: The sentence added this round says: «Đoạn mở bằng «Vì sao:» (kể cả «Vì sao: Gốc: <con trỏ> — <lý do>» của --mo-o) chỉ lấy phần chữ sau tiền tố — không mở câu dẫn thành danh sách, không kèm gạch dính liền — ở cả ô này lẫn trang hồ sơ». The code only does this in two cases (scripts/ho-so-tom-tat.cjs, viSaoTu, lines 158-161): (1) the paragraph matches `^Vì sao:\s*Gốc:\s*\S+(?:\s+[^—]*?)?\s+—\s+(.+)$`, which needs an em dash « — »; (2) the paragraph starts with «Vì sao:» and contains no «Gốc:» at all. Any other paragraph that starts with «Vì sao:» and contains «Gốc:» goes to viSaoCua / viSaoDuCua(k,i,null). There it keeps the whole paragraph, prefix included, expands a lead sentence «…:» into a list (dải) and carries glued bullets (trang). That is the exact opposite of the new sentence. Reproduced on this tree: viSaoTu of an opportunity with «Vì sao: Gốc: crm/_acceptance/a (ba ca đã gặp):\n- Ca một.\n- Ca hai.» gives dải «Vì sao: Gốc: crm/_acceptance/a (ba ca đã gặp): Ca một · Ca hai» and trang {doan:'Vì sao: Gốc: …:', muc:['Ca một.','Ca hai.']}. The shape exists in real data. Row S3 (vong-la-mot-ket-qua) of the kit's own docs/plans/lo-trinh-kit.json has vi_sao «Gốc: media-library/_acceptance/ban-dieu-khien-curator (13 hồ sơ …). Số đo …», which has only en dashes and no « — ». lo-trinh.mjs --mo-o (line 791) writes it as «Vì sao: ${vi_sao}», and running viSaoTu on that row prints dải «Vì sao: Gốc: media-library/_acceptance/ban-dieu-khien-curator (13 hồ sơ …» with the prefix and pointer in the cell. A consuming repo that relies on the doc would expect only the reason text. This is the doc-vs-code contradiction that AC-10/E10 asks about, re-introduced by the round-1 fix. Fix either side: narrow the doc to the two forms the code handles (an em-dash «Gốc: … — …», or «Vì sao:» with no «Gốc:»), or make the code strip «Vì sao:» for every paragraph that starts with it.
  căn cứ phạm vi: Cùng câu tài liệu ở dòng 87 với mục trên: mô tả hành vi ô vi_sao rộng hơn mã, nên mâu thuẫn mã mà AC-10 cấm, và dạng gây mâu thuẫn có thật ở một hàng lộ trình của chính kit.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 3 (assert «chuỗi có mặt» trong khi lời hứa là quan hệ): DD-8 ca (g) không phân biệt được trang cắt tiền tố «Vì sao: Gốc: … —» với trang in nguyên dòng**
  Người dùng thấy gì: Nếu sau này trang hồ sơ đầy đủ lỡ in thừa phần đầu «Vì sao: Gốc: …» trước lý do thật, bộ kiểm tự động hiện tại vẫn báo xanh nên lỗi này sẽ không tự bị bắt. Hôm nay trang vẫn hiện đủ lý do; chỉ là không có gì giữ cho nó gọn như tài liệu mô tả.
  file: `tests/scripts/dai-tom-tat-dem-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc, không round-trip writer→reader): mọi ca DD-8 ghi đè mục «Vấn đề &amp; ai gặp» mà --mo-o sinh, ca (g) chép tay dạng «Vì sao: Gốc: … — …»**
  Người dùng thấy gì: Bộ kiểm chưa thử với ô cơ hội do chính lệnh mở ô sinh ra. Nếu dòng câu giao tự sinh lọt vào ô «Vì sao», người đọc dải sẽ thấy câu giao thay cho lý do thật mà bộ kiểm vẫn xanh.
  file: `tests/scripts/dai-tom-tat-dem-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **DD-2-do ghim «8» tự thoả: chính câu báo lỗi đã chứa sẵn số 8 nên ca không chứng được bản tiêm đếm đôi (r1 · tệp đã đổi)**
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

- **Hình dạng 4 (không ghim đúng thông điệp): chiều đỏ DD-2-do và DD-5-do-bao-cao ghim một chữ có sẵn trong khuôn thông điệp của chính ca (r1 · tệp đã đổi)**
  Người dùng thấy gì: Hai phép thử «cố tình làm hỏng rồi xem báo đỏ» (đếm đôi giới hạn, và nguồn hỏng là báo cáo) ghim vào một chữ mà câu báo lỗi luôn tự in ra, nên chúng có thể báo «bắt được» cho bất kỳ lỗi nào. Sản phẩm không sai; chỉ là bằng chứng chiều đỏ lỏng hơn vẻ ngoài.
  file: `tests/scripts/dai-tom-tat-dem-dung.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng đếm cả phần tử không được so): DD-9 tính «câu dẫn so mục cuối» trước khi so và bỏ qua im lặng khi bộ tách trả null (r1)**
  Người dùng thấy gì: Phép đo trên sáu kho báo «19 hồ sơ đã kiểm mục cuối» trong khi thực ra chỉ 18 được so, một hồ sơ crm mà bộ tách của phép đo không tách được bị bỏ qua vẫn được tính. Cùng lớp: lỗi ném ra bị nuốt, và lệnh đọc ngưỡng chỉ kiểm câu cuối. Sản phẩm không sai; con số phép đo tự khai cao hơn thực tế.
  file: `tests/scripts/dai-tom-tat-sau-kho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture không round-trip từ writer thật): khối ghim lại của ca DD-3 (f) rút từ khuôn tài liệu SKILL, không từ repin-lane.mjs (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép thử khối «ghim lại» lấy mẫu từ tài liệu hướng dẫn chứ không từ chính công cụ sinh ra khối đó. Nếu công cụ đổi chữ tiêu đề mà tài liệu giữ nguyên, phép thử vẫn xanh còn báo cáo thật có thể bị đếm lẫn khối ghim lại vào số giới hạn.
  file: `tests/scripts/dai-tom-tat-dem-dung.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
