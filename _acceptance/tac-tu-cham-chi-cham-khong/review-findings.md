# Review findings: tac-tu-cham-chi-cham-khong (round 3)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **AT3 compares every lane's prompts, the run-log and all opts against fixed tag v2.26.0, so any later legitimate engine change turns the suite red**
  Người dùng thấy gì: Phép kiểm «lượt sạch không đổi» khoá cứng vào bản phát hành 2.26.0. Lần tới có ai sửa lời dặn của bộ chấm một cách chính đáng, bộ kiểm sẽ báo đỏ dù không có lỗi thật, và người sửa phải nâng mốc so. Điều này đã được khai là giới hạn đã biết.
  file: `tests/workflows/tac-tu-cham-hep.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Owner-facing card text and figure still say the machine reverts the tree itself, which the descope removed**
  Người dùng thấy gì: Thẻ và hình minh hoạ trình cho người ký vẫn nói máy tự trả cây về như cũ, trong khi sau lần thu hẹp phạm vi máy không còn làm vậy mà phiên phải tự hoàn lại. Người ký có thể hiểu sai máy làm gì thay họ, nên cần sửa chữ trước khi tin thẻ.
  file: `_acceptance/tac-tu-cham-chi-cham-khong/card-plain.json`
  severity: high
  Đề xuất: known-limits

- **AT6 (and AT5) put the pinned FAIL label on every failure, so the mutant check in rang.sh cannot tell a crash from the targeted defect**
  Người dùng thấy gì: Phép thử «bước sau-lượt không đổi cây» có thể báo đỏ đúng chữ dù nguyên nhân chỉ là bước đó bị hỏng chứ không phải cây bị đổi. Người đọc kết quả đỏ khó biết máy bắt đúng lỗi hay chỉ bị sự cố khác. Đã khai là giới hạn đã biết.
  file: `tests/scripts/ghi-boi-tac-tu-cham.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **A `--transcript` path that does not exist is dropped silently and the line blames a missing transcript**
  Người dùng thấy gì: Nếu phiên truyền sai đường dẫn ghi chép của lượt chấm, hệ thống chỉ báo là không tìm thấy ghi chép chứ không nói đường dẫn nào sai. Người dùng vẫn thấy lượt này là chưa đọc được nên không bị kết luận sai, chỉ khó biết nguyên nhân.
  file: `feature-loop/scripts/thuoc-vat.mjs`
  severity: low
  Đề xuất: known-limits

- **Any `git commit` by a grading agent, in any repo, is blamed for every commit made during the round**
  Người dùng thấy gì: Nếu tác tử chấm dựng một kho tạm ở nơi khác và commit ở đó, hệ thống vẫn quy cho nó mọi commit của lượt, kể cả commit do chính phiên làm. Phiên có thể bị dẫn đến hoàn lại việc của chính mình và số lượt bị tính là tác tử ghi bị thổi phồng.
  file: `feature-loop/scripts/lib/ghi-boi.mjs`
  severity: medium
  Đề xuất: known-limits

- **`git -C <other dir>` pathspecs are resolved against the main repo and blamed as writes**
  Người dùng thấy gì: Khi tác tử chấm làm việc ở một bản sao khác của kho rồi sửa tệp trùng tên, hệ thống có thể quy nhầm tệp của kho chính cho nó. Hậu quả là dòng ghi nhận chỉ sai hướng cho phiên khi hoàn lại, chứ máy không tự đổi cây.
  file: `feature-loop/scripts/lib/ghi-boi.mjs`
  severity: low
  Đề xuất: known-limits

- **Hinh dang 4 (assertion am-tinh khong ghim dung thong diep): moi loi AT6 deu mang nhan «khong doi cay», nen dong ghim cua chieu do khong phan biet duoc loi**
  Người dùng thấy gì: Mọi kiểu hỏng của phép thử «không đổi cây» đều mang cùng một nhãn, nên một phép thử đỏ chưa chắc chứng minh cây bị đổi. Đây là cùng giới hạn đã khai ở finding trước về độ chính xác của phép thử đỏ.
  file: `tests/scripts/ghi-boi-tac-tu-cham.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
