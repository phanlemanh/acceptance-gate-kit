## Trong hợp đồng

(không có phát hiện nào ánh xạ được vào AC ở lượt chấm này.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **contract.md tự mâu thuẫn trong CÙNG một đoạn: vẫn khai «tiêu chí AC-5 đo đúng kết quả ấy» sau khi AC-5 đã bị gỡ**
  Người dùng thấy gì: Văn bản hợp đồng tự mâu thuẫn về việc chiến dịch ghim lại còn được đo hay không, có thể khiến người duyệt ở lượt sau hiểu nhầm là phạm vi chưa bị thu hẹp.
  file: `_acceptance/release-2-16-0/contract.md`
  severity: medium
  Đề xuất: known-limits

- **rang-cua-so.mjs còn khai hai mã thoát 6/7 và cờ --chan viec-va mà thân đã gỡ; comment config.yaml còn hứa «một răng mới cho chiến dịch ghim lại»**
  Người dùng thấy gì: Tài liệu mô tả trong công cụ kiểm tra vẫn nhắc tới một chế độ kiểm đã bị gỡ, có thể khiến người đọc sau lầm tưởng công cụ còn hỗ trợ chế độ đó.
  file: `_acceptance/release-2-16-0/rang-cua-so.mjs`
  severity: low
  Đề xuất: known-limits

- **rang-so-tang.sh: nhánh «commit gốc, không có cha» là code chết — `git rev-parse <sha>^` thoát 128 nhưng vẫn in chuỗi ra stdout và mã nuốt lỗi ấy**
  Người dùng thấy gì: Trong một tình huống hiếm — bản ghi đầu tiên của lịch sử, không có bản trước đó — công cụ kiểm số phiên bản có thể báo nhầm là lỗi hạ tầng thay vì xử lý đúng; tình huống này chưa xảy ra ở lần phát hành hiện tại.
  file: `_acceptance/release-2-16-0/rang-so-tang.sh`
  severity: medium
  Đề xuất: wont-fix

- **rang-so-tang.sh: neo vẫn buộc vào THỨ TỰ COMMIT — lời khai «cha mang số CŨ ở cả hai thứ tự» sai, thứ tự nâng-số-trước cho ĐỎ GIẢ mã 3**
  Người dùng thấy gì: Cách xác định phiên bản trước của công cụ kiểm số phụ thuộc vào thứ tự các bước được ghi vào lịch sử thay đổi; nếu tương lai đổi thứ tự đó, công cụ có thể báo nhầm một lần tăng số hợp lệ là chưa hoàn tất, dù ở lần phát hành này nó vẫn đúng.
  file: `_acceptance/release-2-16-0/rang-so-tang.sh`
  severity: medium
  Đề xuất: known-limits

- **contract.md còn hai câu khai AC-5 ĐANG đo chiến dịch ghim lại, sau khi owner đã gỡ AC-5**
  Người dùng thấy gì: Hai câu trong hợp đồng vẫn khẳng định có một tiêu chí đang đo kết quả chiến dịch ghim lại dù tiêu chí đó đã bị gỡ khỏi phạm vi, khiến người đọc có thể tin nhầm là vẫn còn phép đo tự động cho phần đó.
  file: `_acceptance/release-2-16-0/contract.md`
  severity: medium
  Đề xuất: known-limits

- **rang-cua-so.mjs: khối chú thích đầu tệp còn khai mã thoát 6/7 và chân `viec-va` mà mã từ chối bằng mã 8**
  Người dùng thấy gì: Ghi chú trong công cụ kiểm tra còn liệt kê các trường hợp lỗi thuộc một chế độ đã bị gỡ, có thể gây hiểu nhầm cho người đọc bảng lỗi ở lần kiểm tiếp theo.
  file: `_acceptance/release-2-16-0/rang-cua-so.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — xanh không tái chạy được: evidence-report còn hai dòng PASS cho eval đã bị gỡ (E5/AC-5, E8/AC-8)**
  Người dùng thấy gì: Báo cáo bằng chứng đã ký vẫn ghi 'đạt' cho hai tiêu chí đã bị gỡ khỏi phạm vi, khiến báo cáo không còn khớp với hợp đồng cuối cùng và khó dùng lại làm căn cứ cho lần kiểm tiếp theo.
  file: `_acceptance/release-2-16-0/evidence-report.md`
  severity: high
  Đề xuất: wont-fix

- **Hình dạng 1 — đo/khai CHỈ DẪN thay vì ĐẦU RA: header rang-cua-so.mjs còn khai chân `viec-va` và mã 6, 7 không còn tồn tại**
  Người dùng thấy gì: Tài liệu trong công cụ kiểm tra mô tả một cơ chế kiểm tra không còn tồn tại, có thể khiến người đọc sau tin nhầm là công cụ còn hoạt động theo cách đã bị gỡ.
  file: `_acceptance/release-2-16-0/rang-cua-so.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 — hợp đồng khai có tiêu chí đo chiến dịch ghim lại, trong khi không eval nào đo nó**
  Người dùng thấy gì: Một câu trong hợp đồng vẫn quảng cáo có phép đo tự động cho kết quả chiến dịch ghim lại dù phép đo đó đã bị gỡ, có thể khiến người đọc tin nhầm vào một con số không còn được kiểm chứng.
  file: `_acceptance/release-2-16-0/contract.md`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — neo của rang-so-tang.sh là một PROXY theo thứ tự commit, không phải quan hệ «số trước mốc»; chú thích khai sai là đúng ở mọi thứ tự**
  Người dùng thấy gì: Cách xác định phiên bản trước của công cụ kiểm số chỉ đúng với một số cách sắp xếp các bước ghi vào lịch sử thay đổi, không đúng với mọi cách; ở một cách sắp xếp khác trong tương lai, công cụ có thể báo nhầm là bước tăng số hợp lệ chưa chạy.
  file: `_acceptance/release-2-16-0/rang-so-tang.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — `paths` của E4 không phủ đầu vào của chính phép đo, nên carry-forward giữ được PASS cũ ở đúng ca E4 sinh ra để bắt**
  Người dùng thấy gì: Cơ chế tránh chạy lại một phép kiểm không tính hết toàn bộ phạm vi dữ liệu mà phép kiểm đó thực sự xét, nên ở một lượt kiểm tương lai có nguy cơ hiển thị kết quả cũ dù có thay đổi mới lẽ ra phải được phát hiện.
  file: `_acceptance/release-2-16-0/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Bằng chứng không tự phân biệt bản: rang-so-tang.sh — răng DUY NHẤT bị sửa thân ở mốc này — không có dấu bản răng**
  Người dùng thấy gì: Công cụ kiểm số phiên bản không ghi lại dấu vết bản thân nó đã chạy, khác với hai công cụ kiểm khác cùng bộ, nên nếu công cụ này từng bị sửa sai, người đọc báo cáo sau khó biết chắc bản nào đã thực sự chạy.
  file: `_acceptance/release-2-16-0/rang-so-tang.sh`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/12 lỗi rơi vào file không bộ đo nào phủ (_acceptance/release-2-16-0/evidence-report.md, _acceptance/release-2-16-0/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
