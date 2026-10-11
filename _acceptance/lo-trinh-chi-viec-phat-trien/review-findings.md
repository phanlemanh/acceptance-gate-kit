# Review findings: lo-trinh-chi-viec-phat-trien (round 1)

## Trong hợp đồng

- **Hình dạng 3 — LT-169 chỉ kiểm chữ có mặt cho vế «luật 2 nói dung_tren chỉ trỏ hàng»; luật 2 cũ cũng qua**
  AC: AC-7
  file:line: tests/scripts/lo-trinh.test.mjs:3423
  severity: medium
  source: measurement
  detail: Ở dòng 3423, assert chỉ đòi `sau[1].includes('dung_tren') && sau[1].includes('hàng')`. AC-7 hứa một điều về ý nghĩa: luật 2 nói `dung_tren` CHỈ trỏ hàng. Luật 2 ở SKILL tại 9b11cc66 («Hàng sau đứng trên dữ liệu thật của hàng trước (`dung_tren`) — chỉ khi…») đã có sẵn cả hai chữ. Đã chạy thử: trong một bản sao cây, đặt lại đúng câu luật 2 cũ rồi chạy LT_CASES=LT-169 → vẫn PASS. Một câu nói ngược ý, ví dụ «`dung_tren` trỏ hàng hoặc mốc», cũng qua. Vế này không có chiều đỏ: LT-169-do và LT-169-do-khuon không tiêm vào luật 2, nên nó không phân biệt được SKILL mới với SKILL trước vòng.

- **Hình dạng 3 — LT-164/LT-171 không kiểm dòng [cho-van-hanh] nêu ĐÚNG mốc mà hàng đứng trên**
  AC: AC-2
  file:line: tests/scripts/lo-trinh.test.mjs:3238
  severity: medium
  source: measurement
  detail: Hợp đồng E2/AC-2 hứa dòng `lỗi: hàng R [cho-van-hanh]` «nêu mốc và hai lối». Dòng 3238 chỉ kiểm tiền tố `lỗi: hàng R2 [cho-van-hanh]` cùng hai cụm chữ cố định «sinh dữ liệu giả» và «chân trời». Hai cụm này lấy từ câu khuyên viết sẵn, mốc nào cũng in ra y nguyên. Không chỗ nào kiểm nhãn mốc trong dòng khớp với đích `dung_tren` của hàng. Ca moc-cu-khong-dot có hai mốc ngoài, đích thật là «crm cài kit». LT-171 (dòng 3497) cũng chỉ kiểm `hàng R1 [` mà không kiểm «V2». Đã chạy thử một biến thể đổi `.map(nhanMoc)` thành `.map(() => nhanMoc(moc.find(laNgoai)))`, tức luôn in mốc ngoài đầu tiên: LT-164, LT-164 kho-tai-lieu và LT-171 đều vẫn PASS.

- **Hình dạng 4 — LT-164-do-kep ghim «mã không có», chữ nằm sẵn trong khuôn thông điệp của mọi ca DO**
  AC: AC-2
  file:line: tests/scripts/lo-trinh.test.mjs:3256
  severity: low
  source: measurement
  detail: Khuôn thông điệp hỏng của vòng DO trong lt164 là `${ten}: exit …, cờ …, dòng mã không có ${kc.length}`. Chữ «mã không có» nằm sẵn trong khuôn, kể cả khi kc.length = 0. Thông điệp hỏng của ca im moc-khong-ngoai cũng kèm dòng «đứng trên mã không có: M9». Nên chữ ghim 'mã không có' của LT-164-do-kep khớp với bất kỳ ca nào của lt164 bị đỏ, không chứng được lỗi in kép. Đầu ra thật: «theo-ma: exit 1, cờ ["lỗi: hàng R2 [cho-van-hanh]…» khớp nhờ nhãn tĩnh. Chữ ghim phân biệt được phải là «dòng mã không có 1».

- **Hình dạng 3 — LT-167 chỉ đếm số dòng gom cho hai cờ, không kiểm số hàng k và mã được liệt**
  AC: AC-5
  file:line: tests/scripts/lo-trinh.test.mjs:3345
  severity: low
  source: measurement
  detail: AC-5 hứa mỗi cờ có đúng một dòng `cảnh báo: [<cờ>] <k> hàng ngoài đợt …` liệt các mã. Mới chỉ cờ cho-van-hanh được kiểm k = 10 và tám mã C rồi «…» (dòng 3348–3349). Với thieu-hang-sinh-gia (G1, G2) và du-lieu-sai-gia-tri (S1, S2), dòng 3345 chỉ đòi `g.length === 1`, tức có một dòng. Không kiểm k = 2 hay mã nào được liệt. Một biến thể gom sót G2 (dòng in «1 hàng … — G1») vẫn qua.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **A blank or null `dung_tren` entry gets blamed on an unrelated mốc ngoài that has no `ma`**
  Người dùng thấy gì: Khi một hàng trong lộ trình có chỗ «đứng trên» để trống, hệ thống vẫn báo lỗi nhưng có thể gán nhầm sang một việc vận hành không liên quan. Người cắt lộ trình có thể sửa sai chỗ, nhưng không có lỗi nào bị lọt qua.
  file: `scripts/cat-luot.mjs`
  severity: medium
  Đề xuất: known-limits

- **Two new red-side checks look only at exit code 1 and never pin the expected message**
  Người dùng thấy gì: Hai phép kiểm chỉ xác nhận «có báo đỏ» mà không xác nhận báo đỏ vì đúng lý do. Nếu sau này lỗi khác gây đỏ thay thế, phép kiểm vẫn xanh và không ai biết lỗi cũ đã mất.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **E6's written formula for the expected count is not what the LT-168 check computes**
  Người dùng thấy gì: Câu mô tả cách giám khảo tính số dòng cảnh báo thêm không khớp với cách phép đo thật tính. Hôm nay kết quả vẫn trùng nên không sai số liệu, nhưng giám khảo đọc công thức có thể hiểu lệch.
  file: `_acceptance/lo-trinh-chi-viec-phat-trien/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **A milestone of the current batch with a malformed `hang` passes with exit 0, and the skill's own classifier tells the session not to fix it**
  Người dùng thấy gì: Nếu phiên cắt lộ trình khai sai chỗ gắn việc cho một việc vận hành của đợt mình, hệ thống chỉ cảnh báo mờ và còn khuyên bỏ qua. Việc vận hành đó có thể mang ngày sai mà không ai bị chặn.
  file: `scripts/cat-luot.mjs`
  severity: medium
  Đề xuất: known-limits

- **An empty or null `dung_tren` entry is misreported as waiting on an operations milestone when any such milestone has no `ma`**
  Người dùng thấy gì: Một chỗ «đứng trên» để trống có thể bị báo thành đang chờ một việc vận hành chưa từng nhắc tới. Người đọc được chỉ sai hướng sửa, lỗi thật vẫn bị chặn.
  file: `scripts/cat-luot.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — LT-171-do ghim «K2», chữ luôn có trong khuôn thông điệp lỗi (bảng phủ in đủ 11 mã)**
  Người dùng thấy gì: Phép kiểm «bỏ một mã khỏi bảng phủ thì phải báo đỏ» dùng một chữ ghim luôn xuất hiện trong thông báo. Nó có thể xanh nhầm khi lỗi đến từ nguyên nhân khác, nên bằng chứng ít sắc hơn vẻ ngoài.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — LT-167 đối chứng «vào đợt» chỉ kết luận từ mã thoát 1, không ghim thông điệp**
  Người dùng thấy gì: Khi chuyển các hàng sang đợt đang cắt, phép kiểm chỉ xác nhận hệ thống báo đỏ mà không xác nhận cả ba loại lỗi đều đỏ. Nếu một loại bị hạ xuống cảnh báo thì có thể không ai nhận ra.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
