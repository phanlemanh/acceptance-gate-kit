# Hạt giống — luật «hết giờ không phải trượt» cho đường kiểm chạy độc lập

**Ngày:** 2026-08-18 · **Trạng thái:** hạt giống, chờ Cổng 1 · **Hạng dự kiến:** T2
**Sinh từ:** việc-của-người tại Cổng 2 của `het-gio-khong-phai-truot` (owner chốt
18/08: tách thành việc riêng, không nâng phạm vi bản đang ký).

## Giá trị cho người dùng

Khi chạy nghiệm thu bằng **đường độc lập** — bộ kỹ năng `acceptance` gọi thẳng,
không qua vòng lặp tính năng — một lệnh kiểm chạy lâu bị hệ thống ngắt giữa
chừng sẽ được báo là **sự cố hạ tầng để chạy lại**, thay vì bị đọc thành «sản
phẩm hỏng» rồi bắt người sửa một lỗi không có thật.

## Vì sao là việc riêng

Bản `het-gio-khong-phai-truot` (ký 18/08) đặt luật vào **ba nhánh của vòng lặp
tính năng**: nhánh dòng lệnh, nhánh giao diện, nhánh đối chứng — tất cả đều nằm
trong bộ điều phối `feature-loop/workflows/acceptance-verify.js`, nơi có một lớp
phòng thủ bằng mã (`normKill`) chặn kết-quả-bị-ngắt trước khi nó thành phán
quyết.

Đường độc lập không đi qua bộ điều phối đó. Bước VERIFY của `skills/acceptance/SKILL.md`
(Phase 3, mục 2 — `test`/`script`: «run the resolved config: command. Capture
exit code + last 10 output lines») dặn một phiên tươi chạy đúng những lệnh ấy
và ghi mã thoát thẳng vào hồ sơ bằng chứng. Ở đó:

- không có một chữ nào về trần thời gian của công cụ (kiểm chứng: tìm
  `timeout` · `600000` · `killedByTool` trong `skills/acceptance/SKILL.md` và
  toàn bộ `references/` → 0 kết quả, đo tại vòng 4 ngày 18/08);
- không có lớp phòng thủ bằng mã nào chặn phía sau, vì lane này không đi qua
  workflow.

Nghĩa là repo tiêu thụ chạy nghiệm thu theo đường này vẫn dính **đúng sự cố gốc**:
bộ kiểm nặng ~108 s bị công cụ ngắt ở ~118 s dưới tải → mã thoát của công cụ
được ghi như mã thoát của lệnh → từ chối oan.

## Phạm vi dự kiến

Trong: bước VERIFY của bộ kỹ năng `acceptance` (chỉ dẫn cho phiên tươi) + khuôn
hồ sơ bằng chứng nếu cần một chỗ khai «bị ngắt». Ngoài: mọi thứ đã ký ở bản
trước; trần thời gian của công cụ; việc tự chạy lại lệnh bị ngắt.

## Tiêu chí nháp (chốt lại ở Cổng 1)

1. Chỉ dẫn VERIFY của đường độc lập mang **cùng một luật** với vòng lặp tính
   năng — xin đủ giờ cho lệnh kiểm, và lệnh bị công cụ ngắt thì KHÔNG được ghi
   như lỗi của sản phẩm.
2. Luật ấy có **một nguồn duy nhất**: hai đường cùng đọc một bản, không chép tay
   hai bản rồi trôi khỏi nhau (bài học đã trả giá: hai bản chép của một luật
   trong cùng kho từng lệch nhau).
3. Hồ sơ bằng chứng của đường độc lập nói được «lượt kiểm này không chạy xong vì
   hạ tầng» — người đọc phân biệt được với «sản phẩm trượt».

## Đường đo dự kiến

Phép đo phải đo **đầu ra thật**, không đo chỉ dẫn: rút luật từ nguồn chung rồi
kiểm cả hai đường cùng mang nó, và một chiều đỏ chạy thật (gỡ luật khỏi một
đường → phép đo phải kêu, đúng đường đó thôi). Bài học từ bản trước: đếm nhánh
bằng danh sách viết cứng là chỗ hở — nên đóng không gian bằng cách rút danh sách
nhánh từ chính nguồn.

## Đã biết trước, đừng dẫm lại

- Đừng dựng thêm một phép-đo-canh-phép-đo trong hồ sơ: ba vòng liền ở bản trước
  cho thấy nó tự đẻ lỗ cùng họ, và owner đã chốt gỡ.
- Bên **viết** ra lời khai «tôi bị ngắt» vẫn chưa có bộ đo hành vi ở bản trước
  (Known limit 2). Nếu vòng này muốn đóng nốt, bộ đo hội đồng phiên sạch là nếp
  sẵn có của kho.
