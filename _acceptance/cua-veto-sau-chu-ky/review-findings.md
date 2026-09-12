## Trong hợp đồng

- **signoffState() nuốt im lỗi parse frontmatter → hai bộ đọc kết luận ngược nhau**
  file: `scripts/start-scan.mjs:151`
  severity: medium
  AC: AC-6
  detail: `signoffState()` gọi `frontmatterField(t,'human_signoff')`; hàm này TRẢ null khi khối frontmatter không có dấu `---` ĐÓNG (regex `/^---\r?\n([\s\S]*?)\r?\n---/` trong lib/evidence-core.cjs:279). Dòng 152 `(raw || '')` gộp null (parse hỏng) vào cùng một nhánh với «khoá rỗng», rồi dòng 153 trả `{signed:false, warn:''}` — warn RỖNG, đúng thứ khối chú thích ở dòng 130-136 hứa là «không nuốt im».

    Bộ đọc bash `front_field` (scripts/pre-merge-check.sh:388) dùng awk đọc tới `---` kế HOẶC EOF, nên nó ĐỌC ĐƯỢC chữ ký trong cùng file đó. Hai bên vì thế nói ngược nhau.

    Đo thật (repo fixture code-sinh, một hồ sơ `veto_state: mo` + evidence-report.md có `---` mở mà không đóng, chữ ký `human_signoff: Manh Phan 2026-09-11`):
    - lưới: `NOTE [a-khong-dong-fence]: làn V — ... cửa veto đã đóng bằng chữ ký`, và slug VẮNG khỏi dòng tổng `cửa veto đang mở`.
    - máy quét: `{"slug":"a-khong-dong-fence","humanSignoff":false,"signoffWarn":""}` và slug CÓ trong `vetoOpenUnsigned`.

    Đây là vi phạm đúng đẳng thức mà hồ sơ tuyên (CONTEXT.md dòng 195-196 «Ba bộ đọc nói cùng vị từ này»; AC-6 / CVS3 assert `tenDongTong(lưới) === vetoOpenUnsigned`). Ma trận 78 ô không có ô nào thiếu `---` đóng nên phép đo không soi tới. Cách chữa tối thiểu: phân biệt `raw === null` (frontmatter không parse được → warn nêu lý do) với `raw === ''`.
  source: bugs

## Ngoài hợp đồng

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hai bộ đọc lệch vị từ ở lớp ĐỌC KHOÁ — máy quét nhận `Human_signoff:` / `human_signoff =`, lưới thì không; ma trận 78 ô không có trục này**
  Người dùng thấy gì: Nếu tên ký được viết hơi khác chuẩn (chữ hoa đầu dòng, hoặc dùng dấu bằng thay vì dấu hai chấm), lưới kiểm tra trước khi gộp mã và màn hình /start có thể kết luận khác nhau về việc hồ sơ đó đã được ký hay chưa.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Chú thích khai «nhánh cũ không còn tới được» là SAI — vế `[ -n "$_vsig" ]` vẫn nổ, và nó là vị từ LỎNG hơn `signoff_that`**
  Người dùng thấy gì: Một dòng ghi chú trong mã nói một đoạn xử lý cũ đã hết tác dụng, nhưng thực ra nó vẫn chạy; nếu sau này ai đó xoá đoạn đó theo đúng lời ghi chú, cách xử lý các hồ sơ ký kiểu giữ-chỗ có thể âm thầm đổi khác mà không ai để ý.
  file: `scripts/pre-merge-check.sh`
  severity: medium
  Đề xuất: known-limits

- **Eval `cvsck_ca_thuong_truc` buộc kết quả AC vào mã thoát của TOÀN BỘ suite scripts**
  Người dùng thấy gì: Bài kiểm tra tự động cho tính năng này đôi khi có thể báo lỗi ngay cả khi lỗi thật nằm ở một phần khác không liên quan, khiến người đọc kết quả hiểu nhầm là tính năng bị hỏng trong khi nó vẫn hoạt động đúng.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **Bảng khoá lệch: frontmatterField khớp khoá không phân biệt hoa/thường và nhận `=`, front_field thì không**
  Người dùng thấy gì: Cùng vấn đề như trên: nếu tên khoá chữ ký được viết hơi khác chuẩn, hai công cụ kiểm tra có thể kết luận trái ngược nhau về việc hồ sơ đã được duyệt hay chưa.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (LỚP, 4 chỗ): chiều đỏ chạy pre-merge trên bản sao rồi kết luận từ VẮNG MẶT, không có đối chứng dương rằng bản sao còn chạy**
  Người dùng thấy gì: Một số bài kiểm tra tự động dùng để đảm bảo tính năng này không bị hỏng về sau có thể tự báo "đạt" ngay cả khi bản sao dùng để kiểm tra bị lỗi và không chạy được gì cả — nghĩa là chúng chưa thật sự bảo vệ được tính năng như tưởng.
  file: `_acceptance/cua-veto-sau-chu-ky/chan-giu-cho.mjs`
  severity: high
  Đề xuất: new-contract

- **Chiều đỏ của chan-van-ban đo một BẢN SAO của phép đo, không đo chính phép đo — và bản sao đã trôi**
  Người dùng thấy gì: Một bài kiểm tra tự động dùng để bảo vệ tài liệu liên quan lại tự chép lại nội dung cần kiểm thay vì đọc đúng tài liệu thật, nên khi tài liệu gốc thay đổi mà quên cập nhật, bài kiểm tra vẫn báo "đạt" nhầm.
  file: `_acceptance/cua-veto-sau-chu-ky/chan-van-ban.mjs`
  severity: medium
  Đề xuất: new-contract

⚠ Cụm ngoài vùng phủ: 3/7 lỗi rơi vào file không bộ đo nào phủ (_acceptance/config.yaml, _acceptance/cua-veto-sau-chu-ky/chan-giu-cho.mjs, _acceptance/cua-veto-sau-chu-ky/chan-van-ban.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
