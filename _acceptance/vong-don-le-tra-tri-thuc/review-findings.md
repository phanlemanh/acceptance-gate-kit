# Review findings: vong-don-le-tra-tri-thuc (round 1)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Bộ xếp căn cứ (xetCanCu) ném lỗi khi khối tri_thuc khai sai, làm sập thẻ Cổng Phạm vi và lệnh --dem**
  Người dùng thấy gì: Nếu người dùng gõ sai phần khai kho tri thức trong cấu hình, thẻ Cổng Phạm vi và lệnh đếm sập hẳn thay vì chỉ báo một dòng đỏ. Trước vòng này cùng lỗi cấu hình chỉ làm một dòng đỏ.
  Căn cứ: Chỉ xảy ra khi cấu hình bị gõ sai, không mất dữ liệu và sửa cấu hình rồi chạy lại là hết, nhưng đây là lùi so với trước vòng và sửa rất rẻ nên đáng làm thành việc riêng.
  file: `scripts/tri-thuc-tra.cjs`
  severity: medium
  Đề xuất: new-contract

- **Lệnh đếm nhận căn cứ trỏ sổ hồ sơ trước bằng đường tep thô, lệch cách chuẩn hoá đường của bộ xếp (chuanTep)**
  Người dùng thấy gì: Nếu bước thiết kế ghi tay đường dẫn tới sổ hồ sơ trước theo kiểu lạ (có ./ ở đầu), dòng căn cứ vẫn được nhận nhưng không được tính vào con số đo tri thức, nên con số có thể thấp hơn thực tế.
  Căn cứ: Chỉ làm con số đo thấp đi ở một cách ghi hiếm, không chặn ai và không mất dữ liệu; đường ghi chuẩn do lệnh tra in ra không bị ảnh hưởng.
  file: `scripts/can-cu-s1.cjs`
  severity: low
  Đề xuất: known-limits

- **xetCanCu now calls giaiGoc before checking cfg.loi, so a broken tri_thuc block crashes the bộ xếp and the Gate 1 card instead of marking the line red**
  Người dùng thấy gì: Một lỗi gõ trong phần khai tri thức của cấu hình làm thẻ Cổng Phạm vi và lệnh đếm dừng với báo lỗi kỹ thuật, người ký không xem được thẻ. Bản cũ chỉ đánh dấu đỏ đúng dòng bị ảnh hưởng.
  Căn cứ: Người ký bị chặn khỏi thẻ cho tới khi sửa cấu hình, nhưng không mất dữ liệu và tự gỡ được bằng cách sửa lỗi gõ rồi chạy lại; sửa chỉ cần một kiểm tra sớm.
  file: `scripts/tri-thuc-tra.cjs`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 3 (lời hứa là QUAN HỆ, phép đo không phân biệt được): TD-7 không đo được luật «căn cứ trỏ sổ của chính hồ sơ thì đếm 0»; bản tiêm tháo hai chốt cùng lúc nên không quy được về luật nào**
  Người dùng thấy gì: Hệ thống đếm đúng, nhưng bài kiểm chưa chứng riêng được luật loại sổ của chính hồ sơ: nếu sau này luật đó bị phá mà chốt kia còn, bài kiểm vẫn xanh nên có thể không ai hay.
  Căn cứ: Không ảnh hưởng người dùng hôm nay vì hành vi đúng; rủi ro chỉ là một hồi quy tương lai lọt qua bài kiểm, và bổ sung ca đối chứng sau này rẻ.
  file: `tests/scripts/vong-don-le-tra-tri-thuc.test.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 3 (lời hứa là QUAN HỆ, phép đo trùng thứ tự chữ cái): TD-2 «dòng gate1 đứng trước dòng S1 cùng điểm» đúng sẵn nhờ tên hồ sơ, không nhờ luật «lời người xếp trước»**
  Người dùng thấy gì: Khi tra sổ hồ sơ trước, lời người quyết ở cổng đang được xếp lên trước đúng như hứa, nhưng bài kiểm chưa chứng được điều đó độc lập nên một hồi quy sau này có thể không bị bắt.
  Căn cứ: Hiện không có sai lệch với người dùng; chỉ là độ chắc của bài kiểm thấp hơn mong muốn, và thêm một ca đối chứng sau này rẻ.
  file: `tests/scripts/vong-don-le-tra-tri-thuc.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
