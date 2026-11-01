## Trong hợp đồng

- **Hình dạng 5 — tuyên quét LỚP «paths không đọc được» nhưng ma trận TV4 chỉ có điểm-case ngoặc nhọn; bốn phần tử còn lại của lớp không có ô**
  AC: AC-4
  file: `tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs:156`
  severity: medium
  source: measurement
  detail: AC-4 (card-plain.json, evals.yaml E4) hứa cả lớp: «khi máy không đọc được phép đo ấy đo gì — vẫn xét lại». Vật định nghĩa lớp ấy bằng một bộ đóng năm phần tử ở lib/evidence-core.cjs:592 `/^(\.\.\/|\/)|[\s\\{}]/`, chú thích ngay trên dòng đó cũng liệt kê đủ: `/…`, `../…`, khoảng trắng, `\`, `{a,b}`. Ma trận viết trước O_PHU (dòng 156–166) chỉ có một ô cho bộ này (`ngoac-nhon`). Không có ô nào cho paths bắt đầu bằng `/`, bắt đầu bằng `../`, chứa khoảng trắng, hay chứa `\`. Số assert (7) vì vậy không bằng số phần tử của lớp, trái mẫu P105. Tôi đã đo chiều đỏ: trên một bản sao cây (git archive HEAD), thu regex còn `/[{}]/` rồi chạy `TV4 TV4-doi-chung` thì ra «PASS: TV4 paths-phu-chu 7/7 · PASS: TV4-doi-chung paths-khong-phu 3/3 · Results: 2 passed, 0 failed». Tức là gỡ bốn trong năm chốt mà eval E4 vẫn xanh. Đây không phải đột biến vô hại: với `paths: ["../_acceptance/old/opportunity.md"]` hay `["/abs/…"]`, hàm `phu` so không khớp, nên opportunity.md bị xếp vào tệp chữ và hồ sơ cũ thoát lượt xét bằng chứng cũ. AC-4 cấm đúng hành vi này. Chốt «tệp có chữ mà không mục nào» ở dòng 588 cũng không có ô riêng (chưa đo đột biến).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Đổi tên một tệp vật thành tệp chữ thì vật bị xoá không hiện ra, nên bước kiểm bằng chứng cũ bị bỏ qua mà không báo**
  Người dùng thấy gì: Nếu một PR vừa đổi tên một tệp bằng chứng của hồ sơ thành tệp ghi chú, hệ thống có thể coi đó là chỉ sửa chữ và bỏ qua việc kiểm bằng chứng cũ mà không báo. Trường hợp này hiếm, vì tên mới phải trùng đúng hai tệp chữ.
  Căn cứ: Hậu quả nhẹ vì ca rất hiếm, không mất dữ liệu, và lần ghim lại kế tiếp sẽ bắt được; sửa sau cũng không đắt nên ghi giới hạn là đủ.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
