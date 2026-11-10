# Review findings: doc-jsx-va-ban-do-hong (round 1)

## Trong hợp đồng

- **AC-2 và E2 hứa mỗi nhánh bỏ qua có một nhát tiêm, nhưng hai nhánh chú thích `//` không có hàng và không có nhát tiêm**
  file: tests/scripts/doc-jsx-va-ban-do-hong.test.mjs:23
  severity: medium
  AC: AC-2
  source: bugs
  detail: Contract AC-2 ghi «mỗi nhánh bỏ qua của bộ quét có một nhát tiêm riêng làm đỏ đúng hàng của nó», và gap-probe đánh dấu đã sửa lỗi «xoá một nhánh bỏ qua mà ca đo vẫn xanh». NHAT_DJ2 chỉ tiêm chú thích `/* */` (ban-do-khuon.cjs dòng 324 và 354). Hai nhánh `//` ở dòng 325 (trong biểu thức, kèm chốt `s[j - 1] !== ':'`) và dòng 355 (cấp thẻ) không có nhát tiêm, và HANG_DJ2 cùng các fixture DJ-1, DJ-3, DJ-4, DJ-5 không có thẻ nào chứa `//`. Xoá hai nhánh đó thì không ca nào có đầu vào để đỏ, nên E2 vẫn PASS dù mệnh đề AC-2 không đúng; `<K a={x} // a > b\n title="x">` khi đó sẽ bị đọc sai mà không bị bắt. Nhánh chuỗi cấp thẻ dòng 356 cũng không có nhát tiêm riêng, tuy hàng khe-trong-chuoi có đầu vào chạm nó. Hướng sửa: thêm hàng và nhát tiêm cho từng nhánh `//`, hoặc thu hẹp câu chữ AC-2 và E2. Kết luận này từ đọc mã; lượt chạy đột biến thực tế bị từ chối quyền.

- **Hình dạng 5 (tuyên quét LỚP, chỉ có điểm-case): «mỗi nhánh bỏ qua có một nhát tiêm riêng» nhưng ba nhánh không có nhát nào**
  file: tests/scripts/doc-jsx-va-ban-do-hong.test.mjs:23
  severity: high
  AC: AC-2
  source: measurement
  detail: AC-2 của contract.md hứa «mỗi nhánh bỏ qua của bộ quét có một nhát tiêm riêng làm đỏ đúng hàng của nó», và phần Coverage hứa «bảng E2 giữ một đại diện cho mỗi nhánh bỏ qua». NHAT_DJ2 (dòng 23-34) không có nhát nào cho ba nhánh của scripts/ban-do-khuon.cjs: chú thích `//` trong biểu thức (dòng 325), chú thích `//` cấp thẻ (dòng 355), chuỗi cấp thẻ (dòng 356). Hai nhánh `//` còn không có hàng nào: HANG_DJ2 (dòng 127-152) không chứa `//`, nên xoá hai dòng 325 và 355 thì DJ-2 vẫn xanh. Nhánh chuỗi cấp thẻ có hàng khe-trong-chuoi nhưng không có nhát tiêm; ba nhát DJ-2-chuoi, DJ-2-nhay, DJ-2-le đều sửa cuoiNgoac, không chạm docTheMo. Danh sách nhát được liệt kê tay, không rút từ một bảng nhánh viết trước, nên lời hứa «mỗi nhánh» không được đo. Kết luận này truy tĩnh từ code, chưa chạy thử đột biến vì lệnh chạy trên bản sao bị từ chối quyền.

- **Hình dạng 5 (thiếu đối chiếu số assert = số phần tử, mẫu P105): «số hàng» đếm lại từ chính ma trận nên luôn khớp**
  file: tests/scripts/doc-jsx-va-ban-do-hong.test.mjs:156
  severity: medium
  AC: AC-2
  source: measurement
  detail: Dòng 156 in `HANG_DJ2.length`, dòng 292 in `LOI_MAT_NHOM.length * 2`, dòng 330 in `LOI_KHONG_MAT.length * 3 + 2`. Cả ba in trước vòng lặp và tính từ chính mảng, không đếm phép so đã chạy. Trong tệp không có hằng 24, 8 hay 11 nào đối chiếu, nên xoá một hàng thì ca vẫn PASS và thoát 0; con số viết sẵn chỉ nằm trong văn xuôi `expected` của evals.yaml. E2 còn ghi «số phép so = số hàng» mà code không đo vế «số phép so». Kho đã ghi đúng lỗi này: tests/scripts/eval-thay-boi.test.mjs:216 («hai vế cùng rút từ MA_TRAN nên xoá một hàng vẫn xanh») và tests/scripts/bang-ngoai-n.test.mjs:305 («chốt chết»).

- **Hình dạng 5 (điểm-case thay cho lớp): hàng «ngoặc hụt» của DJ-4 không đi qua nhánh ngoặc hụt, chỉ xanh vì thẻ nằm cuối tệp**
  file: tests/scripts/doc-jsx-va-ban-do-hong.test.mjs:199
  severity: medium
  AC: AC-4
  source: measurement
  detail: Hàng dùng `manThe('<TrangThaiMau a={ x title="x">c</TrangThaiMau>')`, mà manThe bọc thẻ trong `function The() { return ...; }`. Truy tĩnh: cuoiNgoac gặp `}` của thân hàm, về 0 và trả vị trí hợp lệ, nên `if (k < 0) return null` (ban-do-khuon.cjs:358) không chạy. docTheMo sau đó đi hết tệp và trả null ở dòng 365, đúng lối ra của hàng «hết tệp». Hai hàng đo một đường, và nhánh ngoặc không khớp không có ca nào. Kết quả «không đo được» cũng phụ thuộc vị trí: thêm sau thẻ một dòng có `>` (ví dụ `export const y = () => 1;`) thì docTheMo dừng ở `>` đó, trả thẻ «đọc được» và bước chấm báo thiếu khe title, trái AC-4 («ngoặc nhọn hụt … không có dòng thiếu khe»). Fixture chỉ lấy đúng một vị trí không lộ hiện tượng này.

- **Hình dạng 4 (âm-tính-một-mình): «tệp thẻ dở không được đếm theo khuôn» không có đối chứng dương, không có nhát tiêm ghim thông điệp**
  file: tests/scripts/doc-jsx-va-ban-do-hong.test.mjs:211
  severity: medium
  AC: AC-4
  source: measurement
  detail: `if (theoKhuon(kit, kho).includes(TEP_THE)) loi.push(...)` là phép đo duy nhất của vế «không được đếm theo khuôn» trong AC-4 và E4. theoKhuon chỉ được gọi ở đây, và không ca nào khẳng định một thẻ lành tại cùng TEP_THE, trên cùng khoKhe, có nằm trong theo_khuon. Nếu danh sách luôn rỗng thì phép đo vẫn xanh. DJ-4-do chỉ ghim thông điệp «thẻ dở không báo không đo» của dòng 210, nên thông điệp «được đếm theo khuôn» không có chiều đỏ nào.

- **Hình dạng 3 (quan hệ giữa các giá trị bị đo bằng hằng): «mỗi lỗi đúng một dòng stderr» chỉ thử với một lỗi**
  file: tests/scripts/doc-jsx-va-ban-do-hong.test.mjs:336
  severity: low
  AC: AC-7
  source: measurement
  detail: AC-7 hứa quan hệ số dòng báo = số lỗi («mỗi lỗi đúng một dòng stderr»). Dòng 336 ghim `d.length !== 1` trên fixture LOI_KHONG_MAT, mà mỗi hàng chỉ có đúng một lỗi, nên vế quan hệ thu về hằng 1. Nếu s4-args chỉ in lỗi đầu (`bd.sai.slice(0, 1)` thay vòng `for (const s of bd.sai)`) thì ca này vẫn xanh, và DJ-7-do không tiêm hướng đó.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Khoá nhan_dien có mặt nhưng rỗng vẫn làm nhóm mất khỏi lưới mà không có lỗi nào, s4-args không dừng**
  Người dùng thấy gì: Nếu tệp bản đồ của một nhóm có mục nhận diện nhưng để trống, nhóm đó vẫn biến khỏi lưới mà không ai được báo. Hệ thống trả lời là không chạm nhóm nào và vẫn cho qua.
  Căn cứ: Nhóm mất khỏi lưới trong im lặng là lỗi nặng vì người dùng không có dấu hiệu nào để tự phát hiện, nhưng chỉ xảy ra khi ai đó cố tình để trống mục này và kho hiện tại không có nhóm nào như vậy, nên nên xử lý trong một hợp đồng riêng.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: new-contract

- **E1, E5, E7 chạy bước chấm nhưng paths không khai scripts/design-floor-khuon.mjs, nên có thể bị mang màu xanh cũ**
  Người dùng thấy gì: Khi chỉ sửa đúng tệp của bước chấm, một vài bằng chứng cũ có thể được mang sang thay vì chạy lại. Hồi quy thật vẫn bị bộ kiểm thử chung bắt ở mỗi lượt.
  Căn cứ: Hậu quả nhẹ vì lỗi thật vẫn bị phát hiện bằng đường khác, không mất dữ liệu, và sửa lại sau rất rẻ khi cần.
  file: `_acceptance/doc-jsx-va-ban-do-hong/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **nhan_dien có khoá nhưng rỗng vẫn làm nhóm mất khỏi lưới mà không báo gì**
  Người dùng thấy gì: Nhóm có mục nhận diện để trống sẽ biến khỏi lưới và hệ thống vẫn báo là không chạm nhóm nào. Người dùng không nhận được cảnh báo nào.
  Căn cứ: Mất nhóm trong im lặng là hậu quả nặng, nhưng cần ai đó để trống mục này và hiện không nhóm nào như vậy, nên gom cùng t1 vào một hợp đồng riêng.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 5 (tuyên quét LỚP, chỉ có điểm-case): lớp «lỗi làm mất nhóm» chỉ có bốn hàng, bỏ giá trị nhan_dien không đọc được**
  Người dùng thấy gì: Nếu mục nhận diện của một nhóm có giá trị không dùng được, nhóm vẫn biến khỏi lưới mà không có cảnh báo. Bộ kiểm thử hiện chỉ thử bốn kiểu lỗi đã biết.
  Căn cứ: Hậu quả giống t1 là nhóm mất trong im lặng, nhưng cần một kiểu nhập sai hiếm gặp, nên đề xuất gom vào hợp đồng mới thay vì sửa ngoài hợp đồng.
  file: `tests/scripts/doc-jsx-va-ban-do-hong.test.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): khối eval khuôn EV_KHUON không rút từ bên viết goiYEval**
  Người dùng thấy gì: Nếu sau này cách sinh khối đánh giá đổi định dạng, hệ thống có thể từ chối khối thật mà bộ kiểm thử vẫn báo xanh. Người dùng sẽ gặp lỗi lúc sinh tham số.
  Căn cứ: Hậu quả nhẹ và dễ tự gỡ vì hệ thống dừng rõ ràng chứ không lặng lẽ sai, và chỉ xảy ra khi định dạng đổi trong tương lai.
  file: `tests/scripts/doc-jsx-va-ban-do-hong.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
