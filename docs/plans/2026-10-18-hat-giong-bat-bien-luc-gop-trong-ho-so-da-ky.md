# Hạt giống — bất biến «lúc gộp» không được nằm trong hồ sơ đã ký

Gốc: crm-onehub/_acceptance/ve-sinh-do-san-onehub/ — E18 `vs_ghim_xanh` của hồ sơ ĐÃ KÝ: «mọi dòng ghim của 7 hồ sơ ở sha
có cây trùng HEAD + pre-merge sạch». Báo trên crm-onehub#375 (M5, 17/10 18:33Z), chuyển qua Điều phối MacBook Pro.
Ô liên quan: `_acceptance/ho-so-da-ky-giu-tuoi/` (K-A) — ghi ở mục Out of scope của ô ấy.

## Chuyện gì xảy ra

E18 là một bất biến **lúc gộp** (đúng tại thời điểm vòng vệ sinh gộp), nhưng nó sống trong `evals.yaml` của một hồ sơ
ĐÃ KÝ. Sau khi ký, mọi vòng chạm 7 hồ sơ ấy đều phải ghim lại vệ sinh, và E18 đòi trạng thái của 7 hồ sơ kia — nên
đêm 17/10 tạo vòng tròn với E16 của DH2: E16 cần vệ sinh đã ghim → vệ sinh cần E18 xanh → E18 cần DH2 PASS. M5 gỡ
tạm bằng sửa E16 (vật của DH2).

## Giao với K-A tới đâu

- K-A (phạm vi đã ký 17/10) giúp MỘT phần: lệnh giữ tươi ghi E18 đỏ thành dòng nền đỏ và quy về PR gây ra; vòng khác
  chạm vệ sinh được đi tiếp với nhãn «đỏ sẵn trên nền» nếu E18 đỏ đúng ca, đúng thông điệp.
- K-A KHÔNG gỡ gốc: một eval mà chân lý của nó chỉ đúng tại lúc gộp sẽ đỏ lại ở mọi lần ghim sau, nhãn chỉ che chặn
  chứ không làm hồ sơ tươi. Nghiệm đúng tầng là một luật cho bên viết hồ sơ: bất biến lúc gộp không vào `evals.yaml`
  của hồ sơ sẽ ký (nó thuộc lưới trước-gộp hay CI của chính PR), hoặc eval ấy tự khai `status: not-run` sau ký với
  con trỏ thay thế.

## Ngưỡng mở ô

≥ 1 ca thứ hai (kho bất kỳ) mà một eval của hồ sơ đã ký đỏ ở lần ghim lại chỉ vì nó đo trạng thái của hồ sơ KHÁC lúc
gộp — sau ngày crm cài mốc chứa K-A (khi đó nhãn đã có mà vòng vẫn vấp thì đây là lỗ riêng, không phải lỗ của K-A).
Phía crm có thể đi trước bằng F35 (sửa chính E18 của hồ sơ vệ sinh) — đó là vật của kho, không cần vòng kit.
