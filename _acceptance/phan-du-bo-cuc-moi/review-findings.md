# Review findings: phan-du-bo-cuc-moi (round 1)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Ứng viên gốc gói lõi viết cứng tên plugin và lùi về so chuỗi con trên dữ liệu ngoài**
  Người dùng thấy gì: Ở một kho có thư mục tên gần giống gói lõi mà không có gói lõi thật, việc kiểm lại báo cáo đã ký có thể tìm công cụ kiểm ở nhầm thư mục và bỏ qua cảnh báo thiếu công cụ.
  Căn cứ: Chỉ xảy ra ở kho có cách đặt tên thư mục hiếm, hậu quả là một cảnh báo bị mất chứ không mất dữ liệu, và người dùng đổi tên thư mục là tránh được.
  file: `scripts/recheck-evidence.cjs`
  severity: low
  Đề xuất: known-limits

- **Nhánh dự phòng của khoaBat nhận nhầm kho tiêu thụ tự là một plugin thành bản cài gói lõi**
  Người dùng thấy gì: Ở một kho tự là plugin và cài tính năng lộ trình từ chợ tên khác, luật chặn lộ trình có thể tắt lặng lẽ dù kho đã bật chặn, nên việc đáng bị chặn lại được đi qua.
  Căn cứ: Hiếm gặp vì cần kho vừa là plugin vừa bật luật chặn, nhưng khi xảy ra thì luật tắt mà không báo, nên cần ghi rõ để người dùng biết mà kiểm tay.
  file: `lib/chan-lo-trinh.cjs`
  severity: low
  Đề xuất: known-limits

- **The fourth verifier candidate only exists in recheck-evidence, so the PreToolUse hook and the CI re-check now give different answers**
  Người dùng thấy gì: Ở kho đặt gói lõi trong thư mục con, cùng một báo cáo bằng chứng qua được bước kiểm lại ở CI nhưng lại bị chặn khi phiên làm việc ghi hoặc sửa nó, nên người dùng bị chặn khó hiểu.
  Căn cứ: Người dùng bị chặn nhầm ở đúng kho dùng bố cục mới, không tự gỡ được vì hai nơi cho hai đáp án khác nhau, và sửa cần chạm lõi dùng chung nên đáng làm thành việc riêng.
  file: `scripts/recheck-evidence.cjs`
  severity: medium
  Đề xuất: new-contract

- **The new khoaBat fallback branch assumes a repo with .claude-plugin/plugin.json and no marketplace.json is always the new-layout kit install. A consumer repo that is itself a plugin breaks that assumption**
  Người dùng thấy gì: Ở kho tự là plugin, luật chặn lộ trình có thể tắt lặng lẽ hoặc báo lỗi thiếu tệp dù kho cấu hình đúng, nên người dùng tưởng được chặn mà thực ra không.
  Căn cứ: Chỉ ảnh hưởng nhóm kho hiếm có hình dạng này, không mất dữ liệu, và người dùng có thể tránh bằng cách chép đủ tệp bảng tên hoặc kiểm tay luật chặn.
  file: `lib/chan-lo-trinh.cjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert «có mặt» thay cho QUAN HỆ): GUI-B2 chỉ rút mục vá thừa ở HEAD, không so với bản gốc nên không đo «mục do diff của vòng làm thừa»**
  Người dùng thấy gì: Danh sách mục vá thừa gửi cho kho giao hàng hôm nay đúng, nhưng cách rút danh sách chưa chứng minh được rằng chỉ những mục do vòng này làm thừa mới được liệt kê.
  Căn cứ: Kết quả hiện tại không sai và không ảnh hưởng người dùng; rủi ro chỉ xuất hiện nếu dữ liệu đổi sau này, và người đọc kiểm lại được bằng cách chạy so bản gốc.
  file: `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (không có đối chứng dương cho phía tham chiếu): phép so «túi HEAD ⊇ túi bản gốc» vẫn PASS 0/0 khi lượt chạy phía bố cục cũ hỏng hoặc không in ca nào**
  Người dùng thấy gì: Nếu lượt chạy bản gốc hỏng im lặng, bước kiểm không-mất-ca-nào có thể báo xanh mà thực chất không so gì, nên một ca bị mất có thể lọt qua.
  Căn cứ: Hiện chưa gây sai kết quả nào và lỗi hạ tầng như vậy thường lộ ra ở các bước khác, nên ghi lại để người ký biết giới hạn là đủ.
  file: `_acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
