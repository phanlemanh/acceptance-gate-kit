## Trong hợp đồng

- **Dấu `/` đã thoát trong regex bị coi là mở chú thích, S4 bỏ sót hex thô thật mà vẫn thoát 0**
  file: `scripts/design-floor-s4.mjs:66`
  severity: medium
  AC: AC-10
  source: bugs
  detail: Điều kiện ở dòng 66 và dòng 68 chỉ xét ký tự liền trước thuộc `[\w/.*-]` hoặc `[\w:/]`, không loại `\`. Bộ lọc cũng không biết regex literal, nên `\/*` và `\//` trong regex JS/TS bị hiểu là mở chú thích. Chạy trực tiếp boChuThich: (1) a.ts `s.replace(/\/*$/, "");` rồi `const c = "#123456";` rồi `/** doc */`: `#123456` mất, vì mọi thứ đến `*/` kế tiếp bị xoá, dù nhiều dòng; (2) a.tsx `u.replace(/\//g, "-"); const c = "#123456";`: mất hex cùng dòng; (3) a.tsx `/^https?:\/\//; const c = "#123456";`: mất hex cùng dòng. Cùng lớp lỗi với chữ JSX ngay sau `>`: `<code>/*</code>` rồi mã rồi `/* real */` cũng xoá phần mã ở giữa. Vòng lặp S4 không còn thấy các hex này và không có dấu hiệu gì, trái lời khai ở dòng 31-32 («chỉ được bỏ sót chú thích, không được bỏ sót mã») và AC-10 («không được cắt quá tay»). Ca S4-CHU-THICH không có regex nào chứa `\/`.
  rationale: AC-10 đòi bộ lọc không cắt quá tay và mã hex thô thật trong tệp vẫn bị chặn; finding cho thấy hex thật bị xoá nhầm.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Lượt sửa này thêm 7 ca làm hỏng kết quả mong đợi của E9a: evals vẫn ghim 40/40, bộ ca thật ra 47/47**
  Người dùng thấy gì: Bảng kiểm nghiệm ghi sai số ca đạt nên có thể báo đỏ dù sản phẩm vẫn đúng, gây nhầm lẫn cho người đọc kết quả. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ lệch một con số trong tài liệu kiểm nghiệm, không ảnh hưởng người dùng và sửa lại rất rẻ khi có dịp.
  file: `_acceptance/do-tuong-phan-lab-oklab/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Lớp phủ gradient trong suốt trên gradient của body được hoà với trắng tự đặt, gây từ chối oan (hồi quy, bản sửa vòng 1 còn hở)**
  Người dùng thấy gì: Trang có nền gradient tối kèm lớp phủ gradient trong suốt, chữ trắng đọc rõ, vẫn có thể bị từ chối nhầm là thiếu tương phản. Người làm trang phải tự xem lại và bỏ qua cảnh báo.
  Căn cứ: Lỗi chỉ gây từ chối nhầm chứ không cho lọt trang xấu, người dùng nhận ra ngay và có đường vòng, nhưng mẫu trang này khá phổ biến nên nên ghi lại.
  file: `lib/design-bundle.mjs`
  severity: high
  Đề xuất: known-limits

- **Nền đặc trong suốt trên ảnh hoặc gradient của body được hoà với trắng tự đặt, gây từ chối oan (hồi quy)**
  Người dùng thấy gì: Thẻ kính mờ đặt trên nền ảnh hoặc nền gradient có thể bị báo thiếu tương phản dù chữ vẫn đọc tốt. Trang bị chặn nhầm cho đến khi người làm trang xử lý tay.
  Căn cứ: Chỉ gây chặn nhầm, không làm lọt lỗi và không mất dữ liệu; nhưng kiểu thẻ kính mờ trên ảnh rất hay gặp nên đáng ghi rõ cho người dùng biết.
  file: `lib/design-bundle.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 - Assertion âm tính không ghim đúng đối tượng: chiều đỏ ghim tên ca bằng tiền tố nên ca khác đỏ thay vẫn tính là đạt**
  Người dùng thấy gì: Bộ kiểm thử có thể coi một nhát phá là đã bị bắt trong khi thực ra ca khác đỏ thay, nên độ tin cậy của phép thử hơi thấp hơn vẻ ngoài. Người dùng sản phẩm không thấy gì.
  Căn cứ: Chưa có kết quả sai nào xảy ra và chỉ ảnh hưởng độ chắc của phép thử nội bộ, nên chấp nhận ghi lại và sửa khi chỉnh bộ thử.
  file: `tests/design-eval/mau-lab-do.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 - Tuyên quét lớp nhưng chỉ có điểm-case: bộ lọc chú thích khai năm loại tệp có thẻ, ca kiểm không có .astro dù đó là nhánh mã riêng**
  Người dùng thấy gì: Việc bỏ qua chú thích trong tệp .astro chưa được kiểm thử, nên nếu nhánh này sai thì chú thích có thể bị báo nhầm hoặc hex thật bị bỏ sót mà không ai biết. Hiện chưa rõ kho đích có dùng loại tệp này không.
  Căn cứ: Rủi ro chỉ có khi kho đích dùng loại tệp này, chưa thấy lỗi thật, và thêm ca kiểm sau này rẻ.
  file: `tests/design-floor/moc-s3-s4.mjs`
  severity: medium
  Đề xuất: known-limits

- **Quy trình Tier B chưa có lối đọc verdict mới KHONG-DO-DUOC và exit_intent 5 (r1)**
  Người dùng thấy gì: Khi bộ kiểm báo một màu không đo được, người hoặc tác tử đọc theo tài liệu hướng dẫn có thể hiểu nhầm là đạt và ghi kết quả sai.
  Căn cứ: Hậu quả là kết luận sai ở khâu đọc, không mất dữ liệu; sửa tài liệu rẻ nhưng cần một việc riêng vì ngoài hợp đồng này.
  file: `skills/acceptance/references/design-ui-check.md`
  severity: high
  Đề xuất: new-contract

- **Câu khẳng định «PASS ở cả hai tầng nghĩa là mọi màu đã được đo» là sai với hành vi đã khai (r1)**
  Người dùng thấy gì: Một câu trong tài liệu hứa rằng kết quả đạt nghĩa là mọi màu đã được đo, trong khi vài kiểu màu vẫn bị bỏ qua, nên người đọc có thể tin quá mức.
  Căn cứ: Chỉ là lời văn hơi quá tay, không làm sai kết quả của bộ kiểm; ghi rõ giới hạn là đủ, sửa câu về sau cũng rẻ.
  file: `skills/acceptance/references/design-ui-check.md`
  severity: medium
  Đề xuất: known-limits

- **Nền trong suốt nằm trên gradient được đo như nền đục, cho đạt sai (r1 · tệp đã đổi)**
  Người dùng thấy gì: Chữ trên một nền nửa trong suốt đặt lên nền chuyển màu có thể bị báo đạt dù thực tế khó đọc.
  Căn cứ: Chỉ bỏ sót một kiểu trang hiếm và người dùng vẫn thấy được khi xem lại trang; sửa kéo theo thiết kế lại cách đo nền xếp lớp nên khá đắt.
  file: `lib/design-bundle.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 - Tuyên quét lớp nhưng thiếu ma trận toàn phần: trục alpha và trục cách viết số chỉ kê điểm-case, không có lý do bỏ (r1)**
  Người dùng thấy gì: Một số tổ hợp cách viết màu và độ trong suốt chưa có phép thử riêng nên chưa được kiểm chứng riêng lẻ.
  Căn cứ: Các tổ hợp này đi chung đường xử lý với những ca đã có nên rủi ro thấp; bổ sung ca hoặc ghi lý do bỏ là việc nhẹ làm sau.
  file: `_acceptance/do-tuong-phan-lab-oklab/evals.yaml`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
