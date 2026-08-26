# Review Findings: design-pass-nac-khong-dong-bo (round 5)

## Trong hợp đồng

- **Assertion âm-tính-một-mình: ba mutant của DP10 kết luận từ «chuỗi vắng» mà không kiểm bản sao có chạy nổi không**
  file: `tests/plugins/design-pass-nac.test.mjs:320`
  severity: high
  AC: AC-14
  Ba mutant trong DP10 chỉ khẳng định MỘT CHIỀU ÂM trên `out` của bản sao gate-card đã bị tiêm, và không hề đụng tới `status`/`err` mà `render()` đã trả sẵn:

  - m1 (dòng 320–324): `if (m1.out.includes(labelsOf('nac-1'))) errs.push('m1: ...')` — mutant «đạt» khi nhãn VẮNG.
  - m-neu-ten (dòng 331–334): `if (coNacFlag(mTen.out).some(...)) errs.push(...)` — «đạt» khi cờ VẮNG phần nêu tên.
  - m-proto (dòng 384–388): `if (coNacFlag(mProto.out).some(t => t.includes('không nhận diện được'))) errs.push(...)` — «đạt» khi cờ VẮNG.

  Bản sao chết vì bất kỳ lý do nào (tiêm hỏng cú pháp, thiếu file trong bản chép, node ném) cho stdout RỖNG, tức mọi chuỗi đều vắng, tức cả ba mutant in xanh trong khi chưa hề chạy được nhánh chúng định đo. Chân `if (after === before) throw` ở `render()` chỉ chứng minh lệnh tiêm ĐỔI được một dòng, không chứng minh bản sao sau khi tiêm còn CHẠY được.

  Đã chứng thực trên vật: thay đúng chuỗi thay-thế của m1 bằng một mảnh không phải JavaScript (`'this is not valid javascript at all ###;'`) rồi chạy `DP_CASES=DP10` → vẫn in `PASS: [DP10] ... + 6 mutant do dung ve`. Làm tương tự cho m-neu-ten và m-proto cùng lượt → cũng vẫn PASS. So sánh: m2 (dòng 325–328), m3 (337–341), m-esc (400–403) đều khẳng định chiều DƯƠNG (đòi thấy một chuỗi cụ thể) nên miễn nhiễm; DP13 m2 (dòng 434–439) đã làm đúng bằng cách ghim kim `DP13-M2-CHET-CO-Y` trong stderr — cùng file, cùng lớp, ba chỗ này sót.

  (nguồn: measurement — AC-14 cấm rõ ràng "assertion âm-tính-một-mình" trong ca đo; finding chứng minh bằng thực nghiệm ba mutant của DP10 vẫn báo PASS ngay cả khi bản sao bị tiêm mã không hợp lệ hoàn toàn — đúng hình dạng AC-14 cấm.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Chữ ký Cổng 2 của owner bị vòng máy r5 xoá khỏi evidence-report — hợp đồng vẫn signed-off nhưng không còn chữ ký ở đâu**
  Người dùng thấy gì: Chữ ký phê duyệt của người có thể bị máy tự xoá mất khi chạy lại một vòng kiểm tra sau đó, khiến hồ sơ vẫn hiển thị là 'đã ký' nhưng thực ra không còn ai đứng tên duyệt, và ngày hoàn tất bị suy đoán sai thay vì lấy đúng ngày người ký.
  file: `_acceptance/design-pass-nac-khong-dong-bo/evidence-report.md`
  severity: high
  Đề xuất: new-contract (mở thành đề xuất/feature riêng — cần một quy tắc bảo toàn `human_signoff`/`approved_by` khi máy dựng lại evidence-report ở vòng sau)

- **Khoá `options:` điền nửa vời bị nuốt thành «không có bộ phương án» — sửa-theo-LỚP chưa trọn so với `reaction:` ngay cạnh**
  Người dùng thấy gì: Nếu người dùng mở phần chọn hướng khác nhưng quên điền đường dẫn tới bộ phương án (bỏ sót một ô trong khuôn ghi chú), thẻ trình cho người duyệt sẽ hiển thị y hệt trường hợp không hề mở phần đó — người duyệt mất khả năng nhận ra có một bước bị bỏ dở.
  file: `scripts/gate-card.js:297`
  severity: medium
  Đề xuất: new-contract (mở thành đề xuất/feature riêng — thêm cờ vàng "options: có khoá mà chưa điền" cùng hình dạng với `reaction:`)

- **Khoá `divergence:` không có bộ đọc nào — lời hứa «không có đường bỏ im lặng» của bước phân kỳ không có răng**
  Người dùng thấy gì: Nếu một phiên xoá mất dòng ghi 'có cân nhắc hướng khác hay bỏ qua' khỏi sổ phiên của mình, hiện không có cảnh báo tự động nào phát hiện việc đó — người duyệt phải tự kiểm bằng mắt, đúng như hợp đồng đã khai trước.
  file: `skills/design-pass/SKILL.md:268`
  severity: medium
  Đề xuất: known-limits (ghi nhận giới hạn đã biết, chấp nhận khi ship — AC-6 đã khai giới hạn này ở vế văn xuôi)

- **CONTEXT.md không cập nhật: danh sách ổ cắm nay thiếu sót và ba trục sổ phiên mới không có mục từ**
  Người dùng thấy gì: Tài liệu thuật ngữ nội bộ của kit chưa được cập nhật để liệt kê đúng và đủ các khái niệm mới vừa thêm (một ổ cắm thiết kế, và các khoá mới trong sổ phiên); người mở rộng kit sau này có thể tra cứu nhầm hoặc dùng sai từ.
  file: `CONTEXT.md:65`
  severity: medium
  Đề xuất: known-limits (ghi nhận giới hạn đã biết, chấp nhận khi ship — không AC nào ràng buộc nội dung CONTEXT.md)

- **Evidence report: 7 eval ghi `baseline: green` trong khi `cannot_run: true`, và dòng Analyst mở đầu bằng "none" nuốt mất cảnh báo Cổng 2**
  Người dùng thấy gì: Bảy phép đo máy chưa chạy được ở vòng này bị ghi nhãn trùng với nhãn dùng cho 'đã chạy nhưng không phân biệt được lỗi' — và vì một câu ghi chú vô tình bắt đầu bằng từ 'none', cảnh báo lẽ ra phải hiện trên thẻ duyệt cho người ký đã biến mất hoàn toàn. Người ký có thể không biết bảy phép đo đó chưa từng chứng minh được gì.
  file: `_acceptance/design-pass-nac-khong-dong-bo/evidence-report.md:147`
  severity: medium
  Đề xuất: new-contract (mở thành đề xuất/feature riêng — sửa quy ước ghi `baseline: n-a` khi cannot_run, và sửa logic thẻ để không bị chuỗi "none" đầu câu nuốt cảnh báo)

- **evals.yaml E1 tuyên "MA TRẬN 6 MUTANT" nhưng liệt m1..m8, mâu thuẫn với hợp đồng MUTANT-MATRIX (E1=8)**
  Người dùng thấy gì: Mô tả bằng lời của một phép đo máy ghi sai số lượng kịch bản lỗi được thử (nói 6 nhưng thực ra thử 8) — người đọc nhanh phần này khi duyệt có thể đếm nhầm và không nhận ra phép đo thực ra làm nhiều hơn những gì được ghi.
  file: `_acceptance/design-pass-nac-khong-dong-bo/evals.yaml:52`
  severity: medium
  Đề xuất: known-limits (ghi nhận giới hạn đã biết, chấp nhận khi ship — lỗi diễn đạt tài liệu, không phải AC thất bại; cùng lớp lỗi đã sửa một lần ở commit 8706e8f9)

- **gate-card.js `--extract` nay phát HTML entity bên trong mảng máy-đọc `design_pass.flags`**
  Người dùng thấy gì: Khi một công cụ khác đọc lại dữ liệu thô của thẻ duyệt, vài ký tự đặc biệt người dùng gõ vào (ví dụ dấu ngoặc nhọn) bị đổi dạng thay vì giữ nguyên văn — hiện chưa ảnh hưởng ai vì chưa có công cụ nào đọc dữ liệu này, nhưng nếu có sau này sẽ đọc sai giá trị gốc.
  file: `scripts/gate-card.js:324`
  severity: low
  Đề xuất: known-limits (ghi nhận giới hạn đã biết, chấp nhận khi ship — chưa có consumer sản xuất nào đọc `design_pass.flags` hiện nay)

- **Tuyên quét LỚP nhưng chỉ có điểm-case: lưới (h) khoá kế thừa duyệt trọn Object.prototype ở trục nấc, trục ngữ cảnh chỉ thử đúng một khoá**
  Người dùng thấy gì: Phép kiểm máy tuyên bố đã thử toàn bộ các giá trị đặc biệt nguy hiểm trên cả hai loại thông tin trong sổ phiên, nhưng thực tế chỉ thử đầy đủ trên một loại; loại còn lại chỉ thử đúng một trường hợp. Nếu sau này có thay đổi chỉ chặn được đúng trường hợp đó mà bỏ lọt các trường hợp khác, phép kiểm vẫn báo xanh dù lỗ hổng vẫn còn.
  file: `tests/plugins/design-pass-nac.test.mjs:380`
  severity: medium
  Đề xuất: known-limits (ghi nhận giới hạn đã biết, chấp nhận khi ship — không thuộc ba hình dạng lỗi AC-14 liệt kê cụ thể)

⚠ Cụm ngoài vùng phủ: 4/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/design-pass-nac-khong-dong-bo/evidence-report.md, CONTEXT.md, _acceptance/design-pass-nac-khong-dong-bo/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
