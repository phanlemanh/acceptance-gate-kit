## Trong hợp đồng

### khong-can-nguoi.mjs --write/--check không nhận dòng `status: verified` có comment đuôi — đúng hình dạng mà contract-template.md của kit sinh ra
- file: `scripts/khong-can-nguoi.mjs:122`
- severity: high
- AC: AC-8
- source: bugs

Khối CLI đọc status qua `frontmatterField` (bóc comment `#`) nên `status` = 'verified', nhưng bước ghi dùng `contract.replace(/^status:[ \t]*verified[ \t]*$/m, 'status: machine-cleared')` — regex đòi dòng KẾT THÚC ngay sau `verified`, không cho comment đuôi. Khuôn hợp đồng của chính kit `skills/acceptance/references/contract-template.md:43` in `status: {status}            # draft | approved | implemented | verified | signed-off | machine-cleared — …`, và hồ sơ thật giữ comment đó (vd `_acceptance/cong-dang-co-cua/contract.md:8`: `status: signed-off  # draft | approved | …`). Tái hiện: fixture.mjs '{}' rồi đổi dòng thành `status: verified   # ghi chú` → `--check` in `chưa đủ: không tìm được dòng status: verified`, exit 2, dù đủ sáu điều kiện xanh-sạch. Hệ quả: cửa ghi DUY NHẤT của ô kết machine-cleared (AC-8, SKILL feature-loop hàng `verified`: «exit 2 = còn cần người → Gate 2») thất bại với lý do sai trên mọi hợp đồng sinh từ khuôn, máy rẽ sang mời ký — chính lượt gọi người mà hồ sơ này đi cắt. Fixture của răng (fixture.mjs contractText) viết `status: ${c.status}` không comment nên E8 không thấy. Sửa: regex cho phép `([ \t]*#.*)?$` và giữ nguyên phần comment khi thay, hoặc thay đúng token giá trị trên dòng frontmatterField đã khớp.

Rationale: AC-8 hứa: đủ sáu điều kiện xanh-sạch thì --write phải đổi đúng dòng status thành machine-cleared và thoát 0; finding cho thấy trên đúng khuôn hợp đồng mà kit tự sinh (status có comment đuôi), --write từ chối ghi và thoát 2 dù sáu điều kiện đều đạt — AC-8 thất bại trên đường thành công đã hứa.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Bỏ mốc REPIN_EVALS_SINCE + bỏ guard phạm vi diff mâu thuẫn hai bất biến CLAUDE.md chưa được sửa**
  Người dùng thấy gì: Tài liệu nội bộ hướng dẫn đội có thể mâu thuẫn nhau, khiến người đọc sau dễ hiểu nhầm quy tắc dự án — nhưng không ảnh hưởng gì tới tính năng hay dữ liệu người dùng.
  file: `docs/adr/0014-lan-ghim-lai-chay-lai-eval-cua-ho-so.md`
  severity: medium
  Đề xuất: known-limits

- **E6 `veto-ghi` dùng `origin/main` (mốc trôi) làm bản base — sau merge chân đỏ vĩnh viễn và chặn mọi lần ghim lại của chính hồ sơ**
  Người dùng thấy gì: Bài kiểm nội bộ dùng một mốc code có thể tự đổi theo thời gian, nên ngay sau khi việc này được gộp vào, chính bài kiểm có thể tự báo lỗi giả — đội phải mất công xử lý cảnh báo sai; không ảnh hưởng người dùng cuối.
  file: `_acceptance/duong-lui-phai-song/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **pre-merge-check.sh vẫn đọc `r.note` sau khi lib bỏ nhánh sử liệu — reader lệch khuôn trả về của nguồn luật**
  Người dùng thấy gì: Không có tác động thấy được tới người dùng; chỉ là một dòng mã thừa vô hại còn sót lại trong công cụ kiểm tra nội bộ.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: wont-fix

- **Hàng `verified` của feature-loop chỉ ánh xạ exit 2 của khong-can-nguoi.mjs; exit 3 và ca im lặng exit 0 không ghi bị bỏ trống rồi commit «contract nay machine-cleared»**
  Người dùng thấy gì: Nếu mô hình bỏ qua đúng bước kiểm tra được dặn trong tài liệu hướng dẫn, hồ sơ có thể bị đánh dấu xong sai mà không ai phát hiện ngay — rủi ro này đã được biết và chấp nhận, chưa có cơ chế máy chặn tuyệt đối.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Khối DLPS-LAN-V-STALE chỉ chạy khi DIFF_READY=1 — không có --base thì làn V thoát hẳn kiểm hoá-cũ/pin-ma và in xanh-sạch, trong khi hồ sơ có chữ ký cùng lượt vẫn bị VIOLATION**
  Người dùng thấy gì: Khi ai đó chạy lệnh kiểm bằng tay mà không chỉ rõ nhánh gốc để so sánh, công cụ có thể báo 'sạch' cho một hồ sơ đang dùng bằng chứng đã cũ thay vì cảnh báo — cần một việc riêng để xử lý đường chạy tay này.
  file: `scripts/pre-merge-check.sh`
  severity: medium
  Đề xuất: new-contract

- **Đường dẫn/base trôi theo checkout tác giả: chiều đỏ E6 so với `origin/main` (ref động) thay vì sha ghim — đỏ oan ngay sau khi merge**
  Người dùng thấy gì: Bài kiểm nội bộ so sánh với một nhánh code có thể tự đổi theo thời gian, nên ngay sau khi việc này được gộp vào, chính bài kiểm có thể tự báo lỗi giả — đội phải xử lý cảnh báo sai; không ảnh hưởng người dùng cuối.
  file: `_acceptance/duong-lui-phai-song/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Tuyên quét LỚP nhưng chỉ có điểm-case: E2 «ma trận 5 ô khai trước, Số assert = 5» và E8 «ma trận 5 fixture» không có số phần tử khai trước — bớt ô vẫn xanh im lặng**
  Người dùng thấy gì: Bài kiểm nội bộ có thể không phát hiện nếu ai đó vô tình bỏ sót một trường hợp cần kiểm — rủi ro nội bộ, không ảnh hưởng người dùng cuối.
  file: `_acceptance/duong-lui-phai-song/rang.sh`
  severity: medium
  Đề xuất: known-limits

- **Phép đo chỉ chạy trên máy tác giả: `sed -i ''` (cú pháp BSD) ×7 trong rang.sh trong khi CI là ubuntu-latest**
  Người dùng thấy gì: Bài kiểm nội bộ có thể chạy sai trên máy chủ kiểm tra tự động khác hệ điều hành với máy tác giả, khiến kết quả kiểm ở đó không đáng tin — không ảnh hưởng gì tới người dùng sản phẩm.
  file: `_acceptance/duong-lui-phai-song/rang.sh`
  severity: low
  Đề xuất: known-limits

- **Expected của E3 hứa một assertion không tồn tại trong răng: «LV5 chứa ca kl-h1-co (grep dòng ma trận)» — chân h1-rong không grep lan-v.test.mjs**
  Người dùng thấy gì: Không ảnh hưởng người dùng; chỉ là một mô tả trong hồ sơ kiểm tra nội bộ hứa nhiều hơn những gì phép kiểm đó thực sự chạy.
  file: `_acceptance/duong-lui-phai-song/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Đo chỉ dẫn thay vì round-trip: lệnh `khong-can-nguoi.mjs --write --root . --slug <slug>` chép tay làm regex ở 3 chỗ, không rút từ CLI hay marker**
  Người dùng thấy gì: Nếu công cụ dòng lệnh đổi tên một tuỳ chọn trong tương lai, tài liệu hướng dẫn có thể dạy sai mà bài kiểm không phát hiện — rủi ro nội bộ, không ảnh hưởng người dùng hiện tại.
  file: `tests/workflows/skill-claims.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Fixture chép tay danh sách vendored (LIBS + 2 script) trong khi INIT-CI-COPY-LIST đã có marker và consumer-esm.test.mjs đã rút từ marker**
  Người dùng thấy gì: Nếu danh sách file cần sao chép của bộ máy tăng thêm trong tương lai, bài kiểm nội bộ có thể không phát hiện thiếu sót — rủi ro nội bộ, không ảnh hưởng người dùng.
  file: `_acceptance/duong-lui-phai-song/fixture.mjs`
  severity: low
  Đề xuất: known-limits

- **Đối chứng dương của KHUÔN (chân `fixture-song`) không được nối vào eval nào — «mọi chân sau dựa vào hai chiều này» nhưng nó không bao giờ chạy trong vòng**
  Người dùng thấy gì: Không có tác động tới người dùng; một đoạn kiểm tra nội bộ được viết ra nhưng chưa từng thực sự chạy trong vòng này.
  file: `_acceptance/duong-lui-phai-song/rang.sh`
  severity: low
  Đề xuất: wont-fix

- **Assert «chuỗi có mặt» trong khi expected E7 hứa QUAN HỆ: GRAMMAR phải khai «veto: <lý do>» KÈM điều kiện máy-đi-trước — test chỉ grep 'để yên' bất kỳ đâu trong khối**
  Người dùng thấy gì: Bài kiểm nội bộ có thể không phát hiện nếu hai phần nội dung liên quan bị tách sai chỗ trong tài liệu — rủi ro nội bộ về độ chặt của phép kiểm, không ảnh hưởng người dùng ngay bây giờ.
  file: `_acceptance/duong-lui-phai-song/rang.sh`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/14 lỗi rơi vào file không bộ đo nào phủ (docs/adr/0014-lan-ghim-lai-chay-lai-eval-cua-ho-so.md, _acceptance/duong-lui-phai-song/evals.yaml, _acceptance/duong-lui-phai-song/fixture.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.