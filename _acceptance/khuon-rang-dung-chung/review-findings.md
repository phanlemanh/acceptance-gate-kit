## Trong hợp đồng

Không có finding nào map được vào AC ở vòng này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Sweep KR1s bỏ sót call-site `bad` của chốt 1 (kr_vi_phan) — trigger tương ứng là dead code**
  Người dùng thấy gì: Một phần nhỏ của bộ kiểm thử tự động chưa quét hết mọi tình huống lỗi có thể xảy ra, nên có một đường lỗi hiếm chưa được xác nhận là luôn bị phát hiện. Rủi ro thực tế thấp vì lưới kiểm tra khác đã chặn được phần lớn tình huống này.
  file: `tests/scripts/rang-khuon.test.mjs:51`
  severity: medium
  Đề xuất: known-limits

- **Design doc hứa «mọi mutant đi qua kr_vi_phan» nhưng 3/4 mutant trong rang.sh viết lại không đi**
  Người dùng thấy gì: Tài liệu thiết kế mô tả rộng hơn những gì hợp đồng yêu cầu; không AC nào bắt buộc mọi mutant phải đi qua đúng một cơ chế kiểm tra cụ thể.
  file: `docs/superpowers/specs/2026-08-30-khuon-rang-dung-chung-design.md:42`
  severity: medium
  Đề xuất: known-limits

- **Gán biến A chết ngay trước khi bị ghi đè (dấu vết debug còn sót)**
  Người dùng thấy gì: Có một dòng mã thừa, vô hại, còn sót lại từ lúc phát triển — không làm thay đổi kết quả hay hành vi của sản phẩm, chỉ hơi khó đọc cho người bảo trì sau này.
  file: `_acceptance/khuon-rang-dung-chung/rang.sh:102`
  severity: low
  Đề xuất: known-limits

- **Red-direction carry check false-greens when mutant s4-args crashes (exit ignored, empty output passes)**
  Người dùng thấy gì: Một phép kiểm tra nội bộ dùng để chứng minh tính năng hoạt động đúng có thể báo 'đạt' ngay cả khi bước đang được kiểm tra bị lỗi nặng thay vì chạy đúng — nghĩa là bằng chứng cho trường hợp này chưa đáng tin tuyệt đối, dù các kiểm tra khác vẫn bảo vệ được kết quả chung.
  file: `_acceptance/khuon-rang-dung-chung/rang.sh:105`
  severity: medium
  Đề xuất: known-limits

- **KR4.1 test payload is destructive to the real repo exactly when the guard under test regresses**
  Người dùng thấy gì: Một trong các bài kiểm thử tự động, nếu đúng lúc cơ chế mà nó đang canh gác bị suy yếu ở lần sửa sau, có nguy cơ vô tình xoá mất một liên kết quan trọng của kho mã nguồn đang chạy bài kiểm đó. Ngay lúc này cơ chế bảo vệ vẫn hoạt động nên không có tác động, nhưng đây là rủi ro cần lưu ý cho các lần sửa đổi sau.
  file: `tests/scripts/rang-khuon.test.mjs:107`
  severity: medium
  Đề xuất: known-limits

- **Tuyên quét LỚP nhưng ma trận thiếu phần tử: grep sweep bỏ sót call-site `bad` của kr_vi_phan**
  Người dùng thấy gì: Bộ kiểm thử tự động tuyên bố sẽ thử lỗi ở mọi vị trí có thể, nhưng trên thực tế bỏ sót một vị trí thuộc một trong ba chốt bảo vệ chính. Khả năng phát hiện lỗi ở đúng vị trí đó chưa được xác nhận bằng máy, dù cơ chế bảo vệ khác vẫn có tác dụng phần nào.
  file: `tests/scripts/rang-khuon.test.mjs:51`
  severity: high
  Đề xuất: known-limits

- **Chiều đỏ không round-trip qua bộ đọc của chính lưới: KR6.4 chép công thức khác thay vì làm đỏ assert đang canh**
  Người dùng thấy gì: Một bài kiểm thử tự động dùng công thức kiểm tra riêng để tự chứng minh nó 'phát hiện được lỗi', thay vì dùng đúng cơ chế thật đang bảo vệ sản phẩm — nên bằng chứng cho trường hợp này chưa chắc phản ánh đúng khả năng phát hiện thật sự, dù bản thân danh sách hàm dùng chung vẫn hoạt động đúng.
  file: `tests/scripts/rang-khuon.test.mjs:134`
  severity: high
  Đề xuất: known-limits

- **Assertion âm-tính không phân biệt được với hạ-tầng-nổ: chiều đỏ carry nhận mutant CRASH làm 'bắt được'**
  Người dùng thấy gì: Một phép kiểm tra dùng để chứng minh tính năng phân biệt được hai phiên bản có thể vô tình báo 'đã phân biệt được' ngay cả khi bước đang kiểm tra bị lỗi hoàn toàn thay vì chạy đúng — bằng chứng cho đúng trường hợp này chưa hoàn toàn đáng tin, dù kết quả chung của tính năng không bị ảnh hưởng.
  file: `_acceptance/khuon-rang-dung-chung/rang.sh:105`
  severity: high
  Đề xuất: known-limits

- **Ô ma trận E1 thiếu ghim thông điệp: KR1.1 nhận mọi FAILED làm bằng chứng cho hình hỏng (1)**
  Người dùng thấy gì: Một bài kiểm thử tự động xác nhận có lỗi xảy ra nhưng không xác nhận đó có đúng là loại lỗi mà nó tuyên bố đang kiểm tra hay không — nên nếu có một lỗi khác xảy ra ở cùng bước, bài kiểm thử vẫn báo 'đạt' mà không phân biệt được hai trường hợp.
  file: `tests/scripts/rang-khuon.test.mjs:33`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

- **Chiều đỏ carry-ma-thuc-thi: hạ tầng hỏng cho cùng màu xanh với bắt-được-lỗi**
  file: `_acceptance/khuon-rang-dung-chung/rang.sh:104`
  severity: high
  source: conventions
  detail: Ca chiều đỏ cuối của chân carry-ma-thuc-thi chạy `chay "$MUT/feature-loop/scripts/s4-args.mjs"` KHÔNG kiểm exit status (khác hẳn các ô (a)/(b)/(c) ở dòng 83/86/90 đều dùng `chay ... && [ ... ]`), rồi assert `[ "$(carried)" != "0" ]`. Nếu bản tiêm KHÔNG chạy được (node crash, bản sao thiếu file, đường sai — đúng lớp hạ-tầng-hỏng), `chay` đã `rm -f a.json` nên `carried()` (dòng 80) require file vắng → node exit 1, stdout RỖNG; `[ "" != "0" ]` là TRUE → in `ok "chiều đỏ: ... CARRY OAN"` — xanh oan. Vi phạm trực diện invariant số 1 của CLAUDE.md («Assertion âm-tính-một-mình là assertion không sống» — không phân biệt được 'bắt đúng lỗi' với 'chưa bao giờ chạy') và mỉa mai là vi phạm chính AC-1 của hồ sơ này («hạ tầng hỏng không được cho cùng màu với đạt»). Sửa tối thiểu: `chay "$MUT/..." && [ "$(carried)" != "0" ] && ok ... || bad ...` hoặc assert a.json tồn tại trước khi đếm.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).