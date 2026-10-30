# Review findings — ky-den-gop (round 3)

## Trong hợp đồng

(không có finding nào map vào AC ở round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

(không có mục mới ở round này; các mục mang từ round trước do máy tự chèn kèm nhãn round)

- **pr-san-sang tự dựng lại luật «vật đổi sau lượt chấm» thay vì dùng bộ phân loại một nguồn phan-loai.mjs (r1)**
  Người dùng thấy gì: Nếu ai đó sửa bộ thước đo sau lượt chấm, PR vẫn được chuyển sang sẵn sàng như thể không có gì đổi. Ngược lại, một chỉnh sửa tài liệu thuần có thể làm máy từ chối chuyển PR một cách oan.
  Căn cứ: Hậu quả nhẹ đến vừa: không mất dữ liệu, người ký vẫn là chốt cuối trước khi gộp, và chỉ lệch ở hai biên hiếm gặp; sửa lại về sau không tốn kém.
  file: `feature-loop/scripts/pr-san-sang.mjs`
  severity: medium
  Đề xuất: known-limits

- **PR-SAN-SANG đổi mặc định cho mọi kho tiêu thụ: đẩy nhánh và chuyển PR sẵn sàng trước chữ ký, với lời bảo đảm chỉ đúng khi kho đã nối lưới trước-gộp (r1)**
  Người dùng thấy gì: Ở kho chưa bật lưới kiểm trước khi gộp, một PR đã xanh có thể bị gộp trước khi người ký xác nhận. Nhánh cũng được đẩy lên máy chủ sớm hơn trước.
  Căn cứ: Việc này đã được khai công khai trong hợp đồng và chỉ xảy ra ở kho chưa nối lưới; người tự bấm gộp vẫn là người chủ động, nên chấp nhận và ghi lại là hợp lý, còn đổi mặc định theo từng kho để vòng sau.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **gop: lỗi của `gh pr merge` (nhánh bị bảo vệ đòi bản mới nhất, đầu nhánh đổi) làm mất sự kiện `gop` và trả thoát 1 «chặn» thay vì 4 «lối cũ» (r1)**
  Người dùng thấy gì: Khi GitHub từ chối lệnh gộp (ví dụ nhánh bảo vệ đòi bản mới nhất), lần gộp hỏng không được ghi vào số đo và giám sát bị báo là gặp chặn thay vì được hướng dẫn cập nhật nhánh rồi thử lại.
  Căn cứ: Không mất dữ liệu và không gộp nhầm gì cả; người chỉ thấy một báo lỗi sai nhãn và số đo thiếu vài lần hỏng, thử lại là xong, sửa sau không đắt.
  file: `dieu-phoi/scripts/gop.mjs`
  severity: medium
  Đề xuất: known-limits

- **pr-san-sang không chặn được việc đẩy thẳng nhánh chính khi thiếu --base (r1)**
  Người dùng thấy gì: Nếu chạy lệnh chuyển PR sẵn sàng mà đang đứng trên nhánh chính và quên khai nhánh đích, máy có thể đẩy thẳng lên nhánh chính.
  Căn cứ: Chỉ xảy ra khi gọi sai tay; kho có bảo vệ nhánh chính sẽ từ chối và quy trình bình thường luôn truyền nhánh đích, nên rủi ro thấp và vá sau rẻ.
  file: `feature-loop/scripts/pr-san-sang.mjs`
  severity: low
  Đề xuất: known-limits

- **Main-branch CI check for the fast-merge path treats 'no runs yet' and 'in progress' as not red (r1)**
  Người dùng thấy gì: Khi nhánh chính vừa nhận commit mà kiểm tra chưa kịp khởi chạy, máy coi như nhánh chính không đỏ và gộp ngay, nên một PR có thể chồng lên đỉnh sắp đỏ.
  Căn cứ: Chủ kho đã chấp nhận rủi ro này ở hạng I và CI nhánh chính vẫn bắt lỗi lọt qua; người gộp vẫn xem lại được, sửa sau không đắt.
  file: `dieu-phoi/scripts/gop.mjs`
  severity: low
  Đề xuất: known-limits

- **pr-san-sang silently skips the 'vật đổi sau lượt chấm' check when the evidence report has no verified_commit (r1)**
  Người dùng thấy gì: Nếu báo cáo bằng chứng không ghi commit đã chấm, máy bỏ qua phép kiểm «vật có đổi sau lượt chấm không» và vẫn chuyển PR sang sẵn sàng.
  Căn cứ: Báo cáo do chính máy sinh nên thiếu trường này hiếm gặp, người ký vẫn là chốt cuối trước khi gộp, và vá sau rẻ.
  file: `feature-loop/scripts/pr-san-sang.mjs`
  severity: low
  Đề xuất: known-limits

- **xetGop reports every git show error as 'hồ sơ chưa ký' (r1)**
  Người dùng thấy gì: Khi máy không đọc được hồ sơ vì lỗi hạ tầng, thợ vẫn được báo là «hồ sơ chưa ký», dễ làm mất thời gian đi tìm nhầm nguyên nhân.
  Căn cứ: Kết quả vẫn là chặn gộp nên không có gộp nhầm hay mất dữ liệu; chỉ lời giải thích sai, thử lại là rõ, sửa sau rẻ.
  file: `dieu-phoi/scripts/gop.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): DG-2 tự viết sự kiện `cap` có `don: 'ghim-lai'` thay vì để bộ phát lịch ghi ra (r1)**
  Người dùng thấy gì: Số «ghim lại sau ký» trong báo cáo đợt có thể ra 0 mà bộ kiểm vẫn xanh nếu sau này khâu ghi dữ liệu bị hỏng.
  Căn cứ: Bản dựng hiện tại ghi đúng nên người dùng chưa thấy số sai; đây là lỗ hổng của thước đo, bắt được khi đối chiếu số đo với đợt thật và bổ sung ca sau rẻ.
  file: `tests/dieu-phoi/loi/do-gop.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): C-6 dựng tay ngữ cảnh `{nhanhLoi, nhanhCua}` cho xetYeuCau, chỗ phat-lich nối hai khoá này không được đo (r1)**
  Người dùng thấy gì: Nếu sau này khâu nối báo lỗi dò nhánh bị gỡ nhầm, máy có thể lại tự duyệt yêu cầu chạm tệp lúc gh lỗi mà bộ kiểm vẫn xanh.
  Căn cứ: Hiện bản dựng nối đúng nên người dùng chưa bị ảnh hưởng; chỉ là thước còn mù một chỗ và bổ sung ca nối sau rẻ.
  file: `tests/dieu-phoi/loi/trung-tep.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): C-10 tự viết trang-thai.json cho `hang them` thay vì lấy bản bộ phát lịch ghi (r1)**
  Người dùng thấy gì: Cảnh báo «trùng tệp với PR mở» khi thêm hàng chưa từng được kiểm với dữ liệu do bộ phát lịch thật ghi ra, nên có thể lặng lẽ không hiện nếu hai bên lệch nhau.
  Căn cứ: Cảnh báo chỉ là gợi ý thêm cho giám sát, không chặn việc nào và không mất dữ liệu; thiếu cảnh báo thì người vẫn tự kiểm được, bổ sung ca sau rẻ.
  file: `tests/dieu-phoi/loi/trung-tep.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
