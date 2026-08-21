## Trong hợp đồng

### 1. `khongCanNguoi` trả `lan-v-mo` cả khi người đã duyệt Cổng 1 — lệch với định nghĩa trạng thái trong commands/start.md và spec
- file: `scripts/khong-can-nguoi.mjs:86`
- severity: low
- AC: AC-2
- detail: Thứ tự nhánh: `vMo` (veto_state=mo có vết, T2) được kiểm TRƯỚC `approvedBy`, nên hồ sơ có `approved_by` điền tên VÀ `veto_state: mo` hợp lệ vẫn được gán `lan-v-mo`. commands/start.md:93 và docs/specs/2026-08-03 định nghĩa `xanh-sach` = «người đã duyệt Cổng 1», `lan-v-mo` = «Cổng 1 máy đóng». Bảng sự-thật LV4 không có ô nào kết hợp approvedBy≠'' với mo-vet-ok (hàng `vang` có approvedBy, hàng `mo-vet-ok` thì approvedBy rỗng) nên lệch này không được đo. Dòng đếm gộp trên thẻ /start sẽ đếm sai «M còn cửa veto mở» vs «N máy đi tiếp không ký».
- rationale: AC-2 quy định tường minh: khi Cổng 1 do người đóng (approved_by có tên) thì state phải là xanh-sach «bất kể có khoá veto_state: mo hay không, có vết hay không»; finding cho thấy máy quét làm ngược lại đúng ca này.

### 2. Chân cay-that đọc human_signoff không bóc comment → hồ sơ chưa ký bị bỏ qua im lặng
- file: `_acceptance/lan-v-khong-phai-cho-ky/rang.sh:143`
- severity: low
- AC: AC-7
- detail: Dòng 143 đọc `human_signoff` rồi chỉ `tr -d '[:space:]'`, không cắt `#comment` như dòng `st` ngay trên (`sed 's/[[:space:]#].*$//'`). Khuôn canonical evidence-report-template.md dòng 132 là `human_signoff:          # Gate 2 — human writes ...` → sig = `#Gate2—humanwrites...` ≠ rỗng → `continue` → hồ sơ bị LOẠI khỏi phép so máy-quét⇔lưới, trong khi máy quét (frontmatterField bóc comment, đã chạy thử trả '') coi nó là CHƯA ký và vẫn xếp ô. Kết quả: vùng đo của chân cay-that thu hẹp im lặng với mọi báo cáo còn giữ dòng khuôn; chỉ sàn `so>=2` mới kêu, và chỉ khi số còn lại < 2. Cùng lớp: `human_signoff: ""` (nháy rỗng) cũng bị coi là đã ký. Sửa: áp cùng bộ lọc `sed 's/[[:space:]#].*$//'` + bóc nháy cho `sig`, hoặc đọc bằng chính lib/evidence-core.cjs.
- rationale: rang.sh là phần cài đặt phép đo «chân cây thật» của AC-7 (so máy quét với lưới trên mọi hồ sơ verified chưa ký, sàn ≥2); lỗi không bóc comment khiến hồ sơ chưa ký bị loại âm thầm khỏi tập so sánh, làm hẹp phạm vi mà AC-7 tuyên bố đã phủ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **evidence-report.md đặt H1 trước khối frontmatter — bộ đọc chuẩn của kit không đọc được verdict, hồ sơ bị xếp «Hồ sơ hỏng»**
  Người dùng thấy gì: Báo cáo bằng chứng nộp lần này bị lỗi định dạng khiến hệ thống đọc nhầm thành 'hồ sơ hỏng' thay vì hiển thị đúng kết quả duyệt — người xem bảng trạng thái sẽ không thấy hồ sơ này ở đúng chỗ.
  file: `_acceptance/lan-v-khong-phai-cho-ky/evidence-report.md`
  severity: high
  Đề xuất: known-limits

- **PRODUCT-MAP.md commit trong diff lệch với hồ sơ xưởng tại HEAD — `product-map --check` đỏ, CI gate (P126) đỏ**
  Người dùng thấy gì: Bảng theo dõi tiến độ sản phẩm hiện đang lệch với thực tế vì chưa được vẽ lại cùng lúc với báo cáo lần này — điều này có thể chặn việc gộp mã cho tới khi bảng được cập nhật hoặc được chấp nhận là hạn chế đã biết.
  file: `PRODUCT-MAP.md`
  severity: high
  Đề xuất: known-limits

- **H1 «# Known limits» có nội dung vẫn được coi là «rỗng» → xanh-sạch giả**
  Người dùng thấy gì: Nếu ai đó ghi mục 'Còn hạn chế' bằng kiểu tiêu đề khác với quy ước thường dùng, hệ thống có thể hiểu nhầm là không còn hạn chế gì và coi hồ sơ đã xong, trong khi thực ra vẫn còn vấn đề chưa xử lý.
  file: `scripts/khong-can-nguoi.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 2 — fixture evidence-report.md viết tay đúng khuôn bên đọc, không round-trip từ khuôn writer**
  Người dùng thấy gì: Bộ kiểm thử tự động cho tính năng này dùng dữ liệu mẫu viết tay thay vì sinh từ đúng khuôn báo cáo thật; nếu khuôn báo cáo thật đổi sau này, bộ kiểm thử có thể không phát hiện và vẫn báo 'ổn' dù thực tế đã lệch.
  file: `tests/plugins/lan-v.test.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/6 lỗi rơi vào file không bộ đo nào phủ (_acceptance/lan-v-khong-phai-cho-ky/evidence-report.md, PRODUCT-MAP.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
