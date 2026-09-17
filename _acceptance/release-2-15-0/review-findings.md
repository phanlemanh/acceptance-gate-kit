## Trong hợp đồng

(rỗng — không có phát hiện nào ánh xạ được vào AC nào của hợp đồng.)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **vatDaONhanhGoc không nhìn verdict: bằng chứng REJECT/BLOCKED cũng được coi là «vật đã ở nhánh gốc» và được mời «đóng theo quan sát»**
  Người dùng thấy gì: Một vòng việc đã bị máy chấm rớt (bằng chứng ghi kết quả không đạt) vẫn có thể được hệ thống tự nhận nhầm là đã xong xuôi ổn thoả, và mời người chỉ cần đóng sổ chứ không cần xem lại.
  file: `scripts/start-scan.mjs:203`
  severity: medium
  Đề xuất: known-limits

- **Lối «chấm lại» dựa vào một câu dặn bằng lời; state machine của feature-loop vẫn đưa `approved` sang S3, và giới hạn khai không có ngưỡng đếm**
  Người dùng thấy gì: Nếu người dùng bỏ qua bước cập nhật trạng thái bằng tay rồi chấm lại trực tiếp, hệ thống có thể lại tính nhầm một việc đã xong và đã lên bản chính là việc còn dang dở, lặp lại sự cố từng xảy ra trước đây — đây là giới hạn đã được biết và chấp nhận, không phải lỗi của lần phát hành này.
  file: `commands/start.md:208`
  severity: medium
  Đề xuất: known-limits

- **Lối «đóng theo quan sát» đẩy việc ghi hồ sơ sang người ở lượt kế, không có trường đích, và dòng thẻ không bao giờ tắt**
  Người dùng thấy gì: Sau khi người dùng chọn 'đóng, không chấm lại' cho một việc, lời nhắc đó vẫn cứ hiện lại ở lần mở phiên kế tiếp vì hệ thống chưa có chỗ lưu lại quyết định ấy.
  file: `commands/start.md:210`
  severity: low
  Đề xuất: known-limits

- **metaOpen dựng lại bản sao y hệt helper git `q` đã có trong cùng tệp**
  Người dùng thấy gì: Không ảnh hưởng tới người dùng — đây chỉ là một đoạn mã bên trong bị lặp lại hai lần, gây khó bảo trì về sau nhưng không đổi bất kỳ kết quả nào người dùng thấy.
  file: `scripts/start-scan.mjs:633`
  severity: low
  Đề xuất: wont-fix

- **vatDaONhanhGoc checks 'is an ancestor of HEAD', not 'merged into the main branch', and ignores the verdict. A re-approved round gets mislabelled 'vật đã nằm trong nhánh gốc'**
  Người dùng thấy gì: Nếu một vòng việc được mở lại và chấm trên nhánh làm việc riêng của nó, hệ thống có thể hiểu nhầm là việc đó đã vào nhánh chính, và mời người đóng sổ một việc thực ra vẫn còn dở hoặc từng bị từ chối.
  file: `scripts/start-scan.mjs:203`
  severity: medium
  Đề xuất: known-limits

- **rang-cua-so.mjs viec-meta leg: its anchor is relative to the tree's version, so the signed release record's eval goes permanently red**
  Người dùng thấy gì: Một phép kiểm dùng để bảo đảm hồ sơ phát hành cũ không bị xáo trộn có thể tự báo lỗi giả ở các đợt phát hành kế tiếp dù không có gì thực sự sai, khiến người vận hành phải tốn công điều tra một cảnh báo không thật mỗi đợt phát hành sau này.
  file: `_acceptance/release-2-15-0/rang-cua-so.mjs:62`
  severity: medium
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).