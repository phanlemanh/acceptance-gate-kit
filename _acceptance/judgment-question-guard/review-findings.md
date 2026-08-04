## Trong hợp đồng

### Phép đo tồn kho viết lại luật `inputs` YẾU HƠN engine — đúng lớp lỗi mà chính quyết định S4-r1 tuyên đã đóng
- file: `tests/workflows/acceptance-verify.test.mjs:1045`
- severity: high
- source: conventions
- AC: AC-14
- rationale: AC-14 đòi bảng field bắt buộc phải rút từ marker trong engine chứ không được chép tay sang test; finding chỉ ra đúng hai vị từ về `inputs` nằm ngoài marker, bị chép tay và lệch engine ở cả hai nhánh, nên assurance của AC-14 không còn đúng cho trường hợp này.

Marker `EVAL-REQUIRED-FIELDS` được mở rộng ở S4-r1 để test rút CẢ bảng lẫn hai vị từ rồi "áp y nguyên", vì bản trước tự viết lại luật yếu hơn. Nhưng hai luật về `inputs` vẫn NẰM NGOÀI marker và vẫn bị test viết lại — lần này lệch theo cả hai chiều:

1. Nhánh HARD: engine (`acceptance-verify.js:275-278`) chặn `inputs` khi `!Array.isArray(e.inputs)` HOẶC `e.inputs.some(isBlankStr)`. Scan chỉ kiểm vế đầu (`!Array.isArray`) — bỏ hẳn vế phần-tử-rỗng.
2. Nhánh SOFT: engine tính `ungroundedIds` bằng `!Array.isArray(e.inputs) || !e.inputs.length` (`acceptance-verify.js:305`), scan lại dùng `badStrArray(e.inputs)` (dòng 1046) — hàm này còn true cho mảng có phần tử rỗng.

Kịch bản fail: một workspace khai `inputs:` với một mục list rỗng/chỉ khoảng trắng (rất dễ xảy ra khi YAML có dòng `- ` treo hoặc quote hỏng). Scan phân nó vào `soft` → assert dòng 1054 `hard.length === 0` VẪN XANH, tức phép đo báo "0 phơi nhiễm chặn cứng"; lần chạy S4 thật thì eval đó BLOCKED cả round. Chính assert này là căn cứ duy nhất đóng finding P0-2 của gap-probe ("phơi nhiễm thật = 0"), nên nó xanh-giả là căn cứ đó mất giá trị. Ca đột biến ở dòng 1058-1070 không bắt được vì chỉ tiêm `criterion` rỗng.

Lối xử: đưa cả hai vị từ `inputs` (hard-shape và ungrounded) vào trong marker rồi để scan rút y nguyên, giống ba vị từ kia.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Tồn kho thật có 0 eval `ui-check` — luật khắt khe nhất của guard chưa từng gặp một eval do người viết**
  Người dùng thấy gì: Phần kiểm tra tự động hiện chưa từng thấy qua một ví dụ thật của loại kiểm tra giao diện khắt khe nhất, nên nếu sau này có nhóm khai loại đó theo cách khác thường, hệ thống có thể chặn hoặc bỏ sót mà chưa ai từng thử trước.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Sanity counter của scan đếm FILE, không đếm eval — parser hỏng một file vẫn cho xanh**
  Người dùng thấy gì: Nếu một hồ sơ chấp nhận trong tương lai viết các mục theo thứ tự khác thường, phần kiểm tra tự động có thể âm thầm bỏ sót toàn bộ hồ sơ đó mà vẫn báo mọi thứ ổn.
  file: `tests/workflows/acceptance-verify.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Guard fail-closed chặn đúng bộ design eval mà chính kit sinh ra (thiếu criterion/expected/steps)**
  Người dùng thấy gì: Với các tính năng có màn hình giao diện, bước tự động sinh câu hỏi kiểm tra thiết kế theo đúng hướng dẫn hiện tại của công cụ có thể tạo ra các mục thiếu thông tin bắt buộc, khiến toàn bộ vòng kiểm tra bị chặn đứng và người dùng phải tự sửa tay trước khi làm tiếp — lặp lại mỗi lần bước sinh câu hỏi đó chạy.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: high
  Đề xuất: new-contract

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).