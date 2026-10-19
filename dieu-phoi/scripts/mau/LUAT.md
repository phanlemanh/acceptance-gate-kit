# Luật đợt <tên>

Phiên giám sát là phiên duy nhất được sửa tệp này. Các phiên thợ đọc nó trước S1.

## Cách xin tài nguyên
Mọi lần ghi vào thư mục đợt đi qua lệnh con của lõi đợt, chạy bằng Bash từ worktree của dãy — không dùng
công cụ ghi tệp (thư mục đợt nằm ngoài worktree). Lệnh con kiểm khuôn trước khi ghi; sai thì thoát 1 và
nói lý do. `<thư mục đợt>` là đường trong lời ghi danh của chip.
- Ghi danh (việc đầu tiên của phiên mở từ chip, trước S1): `node <thư mục đợt>/loi/dieu-phoi.mjs ghi-danh <dãy>`
  từ worktree của chip — ghi worktree của phiên vào dãy; chưa ghi danh thì mọi lệnh dưới đây báo «không thuộc
  dãy nào».
- Xin lượt: `node <thư mục đợt>/loi/dieu-phoi.mjs xin <loại> [--uoc-phut <n>] [--mo-merge]`;
  `loại` ∈ `s4`, `ghim-lai`, `duong-nen`, `merge`. Rồi chờ bằng lệnh nền
  `until jq -e '.phien=="<dãy>"' <thư mục đợt>/khoa/<tài nguyên>/chu.json >/dev/null 2>&1; do sleep 15; done`.
- Nhả lượt: `node <thư mục đợt>/loi/dieu-phoi.mjs nha <tài nguyên>`.
- Việc nền dài khi đang giữ khoá: chạy qua lệnh bọc. Chép đúng dòng lệnh bọc mà hook in sẵn khi
  chặn — nó mang đường tuyệt đối tới `giu-nhip.mjs` của bản gói đang cài, ví dụ
  `node <gói dieu-phoi>/scripts/giu-nhip.mjs -- node <đường>/repin-lane.mjs --root . --slug <slug> --write`.
  Lệnh bọc chạm tín hiệu sống của khoá mỗi phút tới khi lệnh con thoát, rồi trả đúng mã thoát của
  nó. Không bọc thì trong lúc anh chờ không có lời gọi công cụ nào, tín hiệu sống cũ dần, và khoá bị
  thu hồi giữa chừng. Hook chặn lệnh nặng chạy nền chưa bọc và in sẵn dòng lệnh đã bọc để chép.
- Yêu cầu: `node <thư mục đợt>/loi/dieu-phoi.mjs yeu-cau <loại> [--chan] [--hang <slug>] [--tep a,b]
  [--noi-dung '<json>']` — lệnh in mã yêu cầu `<dãy>-<số>`; trả lời ở `tra-loi/<mã>.json`. Loại:
  `cham-tep` (đòi `--tep`), `viec-phu`, `hang-moi`, `chuyen-hang`, `s4-gom`, `gia-han`, `can-nguoi`, `khac`.
- Gia hạn: yêu cầu `gia-han` với `--noi-dung '{"uoc_phut":<n>,"tai_nguyen":"<tài nguyên>"}'`. `uoc_phut` là số phút xin thêm;
  `tai_nguyen` (`s4`, `duong-nen`, `merge`) bắt buộc khi đang giữ nhiều khoá. Máy duyệt khi phiên đang
  giữ đúng khoá đó và ước trong trần; được duyệt (bởi máy hay giám sát) thì hạn thuê kéo dài đúng số
  phút đó, tính từ hạn còn lại (hạn đã qua thì tính từ lúc áp).
- Hàng kế: đọc `tiep/<phiên>.json`.
- Không tự gọi `spawn_task`: việc phụ đi qua yêu cầu `viec-phu`.

<!-- <<<LUAT-CHAN -->
Việc phụ (`viec-phu`) hay việc mới (`hang-moi`) KHÔNG chặn việc anh đang làm → máy trả ngay «đã ghi, xử ở mốc khép»
và ghi ý vào cửa tín hiệu của kho; anh làm tiếp việc đang làm, không chờ ai. Chỉ khai `--chan` khi không đi tiếp được
nếu thiếu nó — yêu cầu ấy mới lên giám sát phán ngay:
`node <thư mục đợt>/loi/dieu-phoi.mjs yeu-cau viec-phu --chan --noi-dung '{"tieu_de":"<việc>"}'`
Lỡ gửi không `--chan` mà thật ra đang bị chặn → gửi lại cùng ý kèm `--chan`. Kho chưa khai cửa tín hiệu thì mọi việc
phụ, việc mới vẫn lên giám sát như cũ.
<!-- LUAT-CHAN>>> -->

## Mời người ở cuối lượt
Kết lượt chờ người bằng chữ thường, không qua nút: lượt có trang thẻ (`card.html`; Cổng Bằng chứng thêm `evidence-page.html`) thì gửi trang ấy bằng công cụ gửi tệp của phiên (`SendUserFile`), phiên không có công cụ ấy thì in đường dẫn trang; dòng lệnh hay dòng trả lời mẫu nằm trong một khối `` ```text ``, chép đúng như thẻ in — ô thẻ để `___` thì giữ `___`, máy không tự điền chữ quyết; hộp «bước kế» của app (`wrap_up`) ở lượt này chỉ mang phần tóm tắt, không câu hỏi và không nút, vì app bỏ nút mở đầu «/» hay «!» hoặc chứa «@», cắt tin của nút ở 300 ký tự, và bỏ nút khuyến nghị thì mất luôn câu hỏi.

<!-- <<<LUAT-TIN -->
## Giao tiếp — khẩu lệnh và vòng mở

Mỗi yêu cầu giữa các phiên là một vòng mở; máy giữ vòng, không ai phải nhớ. Ở đây `tin` nghĩa là
`node <thư mục đợt>/loi/tin.mjs`, chạy bằng Bash từ worktree của mình. Anh chỉ nói điều chỉ anh biết; máy điền phần còn lại.

Khẩu lệnh: `GIAO` · `HỎI` · `BÁO` · `NHẬN` · `XONG` · `KẸT` · `TRẢ` · `HUỶ` · `MỞ LẠI`

| Nấc | Nghĩa | Ai làm | Máy giữ bằng |
|---|---|---|---|
| 0 · Đã nói | lời có mã, được ghi | người gửi, một câu | `tin GIAO`, `tin HỎI`, `tin BÁO` sinh mã |
| 1 · Đã tới | lời nằm trong hộp người nhận | máy | dòng trong hộp tin của đợt |
| 2 · Đã nghe | lời đã vào phiên người nhận | máy | hook đưa tin vào phiên, ghi «đã đến» |
| 3 · Đã hiểu | người nhận nói lại điều sẽ giao bằng lời mình | người nhận, một câu | câu «sẽ giao» đặt cạnh ý định, đưa về người giao |
| 4 · Đã đáp | người nhận lên tiếng | người nhận | `tin NHẬN`; hook dừng chặn một lần nếu quên |
| 5 · Đã hứa | nhận kèm hạn xong | máy điền hạn | hạn xong từ giờ máy của hàng; quá hạn lên bảng |
| 6 · Đang làm / kẹt | tiến độ hoặc chỗ vướng | người nhận khi kẹt | `tin KẸT` |
| 7 · Đã giao | báo xong kèm sản phẩm thật | người nhận, không gõ thêm | `tin XONG` tự đính sha, nhánh, PR khi chắc |
| 8 · Chấp nhận | người giao thấy sản phẩm đạt ý định | máy | im lặng sau khi lời xong đã đến phiên người giao; `tin MỞ LẠI` khi không đạt |

| Khi | Anh gõ | Máy làm thay |
|---|---|---|
| giao việc | `tin GIAO <dãy hoặc G> "<một câu ý định>"` | điền Kết quả, Ranh giới, Quyền, Điểm phải hỏi, Báo về, Hạn xong |
| hỏi | `tin HỎI <dãy hoặc G> "<câu hỏi>" --chan` (bỏ `--chan` khi không chặn) | sinh mã, đánh dấu chặn |
| nhận việc | `tin NHẬN <mã> "sẽ giao <một câu bằng lời của mình>"` | đưa câu ấy về người giao, chép hạn xong |
| xong việc | `tin XONG <mã>` (câu hỏi thì kèm câu trả lời) | đính sha, nhánh, PR; không chắc thì đòi `--vat` |
| vướng | `tin KẸT <mã> "<cần gì, từ ai>"` | giữ vòng mở, báo người giao |
| không phải việc mình | `tin TRẢ <mã> "<lý do>" --chuyen <ai>` | đóng vòng phía mình |
| sản phẩm chưa đạt (người giao) | `tin MỞ LẠI <mã> "<vì sao>"` trong 24 giờ | kéo vòng về người nhận, hạn mới |
| xem vòng đang mở | `tin so` | sổ theo tuổi, nấc, mức quá hạn |
| cần im một lúc | `tin tat`, rồi `tin bat` | tắt tin tự đến và chặn kết lượt cho worktree này |

Luật vòng mở:
- Máy chỉ đọc dòng đầu của tin; thân tin không bao giờ quyết loại tin.
- Vòng đóng khi người giao chấp nhận (im lặng sau khi lời báo xong đã đến phiên người giao), hoặc bằng `TRẢ`, `HUỶ`.
  `NHẬN` và `KẸT` không đóng vòng.
- `BÁO` không mở vòng; không ai phải đáp.
- Biên nhận trong một nhịp: quá hạn 30′ máy nhắc một lần, quá hạn lần hai thì vòng lên bảng đợt.
- Không kết lượt khi còn việc giao cho mình chưa nhận: hook dừng chặn MỘT lần, lần sau cho qua và ghi lên sổ.

Phải HỎI (khai `--chan`): sắp chạm ngoài ranh giới · đổi lời một tiêu chí đã ký · việc khó đảo (gộp, cắt bản, xoá,
đẩy lên kho khác) · hai nguồn nói trái nhau · lệnh giai đoạn trái với trạng thái git. Câu hỏi gửi giám sát trước.

Không hỏi: mọi thứ suy được từ ý định cộng luật đã khai cộng chính sách chủ kho — đặt tên, thứ tự việc trong vùng của
mình, chọn giữa hai cách đều đảo được. Tự quyết và ghi sổ.
<!-- LUAT-TIN>>> -->

## Thứ tự gộp khi tranh chấp

## Nhật ký
