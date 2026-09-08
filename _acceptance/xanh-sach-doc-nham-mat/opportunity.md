---
schema_version: 1
slug: xanh-sach-doc-nham-mat
feature: Luật xanh-sạch đọc mục «Ngoài hợp đồng» của BÁO CÁO, không đọc làn phản biện — hồ sơ có 13 phát hiện vẫn qua như sạch
owner: phanlemanh@gmail.com
stage: discovery
decision:
decided_by:
decided_at:
---

## Vấn đề & ai gặp

Điều kiện xanh-sạch T2 là danh sách đóng sáu mục, trong đó hai mục là «**Known
limits** hiện diện và rỗng» và «**Ngoài hợp đồng** hiện diện và rỗng». Cả
`pre-merge-check.sh` lẫn thẻ Cổng 2 đọc hai mục đó **trong `evidence-report.md`**.

Nhưng findings của làn rà soát sống ở một tệp KHÁC: `review-findings.md`. Hai tệp
do cùng một lượt Workflow sinh ra, và không có gì buộc chúng khớp nhau.

Ca thật: kho `crm-onehub`, hồ sơ `nang-tran-trang-danh-ba`, vòng chấm 3 ngày
08/09 bằng kit 2.8.0.

- `evidence-report.md`: `verdict: PASS`, mục **Known limits** RỖNG, mục **Ngoài
  hợp đồng** RỖNG.
- `review-findings.md` cùng lượt: **13 mục** dưới tiêu đề «Ngoài hợp đồng —
  người quyết ở Gate 2», trong đó có mục nặng «README khai sai phạm vi xử lý DỮ
  LIỆU CÁ NHÂN sau khi nới tầng lộ số».
- `pre-merge-check.sh --slug nang-tran-trang-danh-ba`: **clean**.
- Thẻ Cổng 2: «máy đi tiếp — cửa veto còn mở», **không có nút ký**.

Nghĩa là một hồ sơ 13 phát hiện đi qua đường xanh-sạch, không chữ ký người, và
lưới trước merge không chặn. Thẻ có render 13 mục ở khối «việc của anh», nên
người NGỒI ĐỌC THẺ vẫn thấy; nhưng đường máy-đi-tiếp được thiết kế để KHÔNG cần
người ngồi đọc. Hai lớp nói ngược nhau, và lớp quyết định đường đi là lớp mù.

**Người trả giá:** chủ hồ sơ. Đường xanh-sạch tồn tại để bỏ một cổng khi bằng
chứng tự đứng vững. Ở đây bằng chứng KHÔNG tự đứng vững, mà cổng vẫn bị bỏ.

Đối xứng với chip `the-cong-2-giau-loi-trong-hop-dong` (thẻ không có làn cho lỗi
TRONG hợp đồng chưa sửa). Chip này là mặt kia: **báo cáo rỗng trong khi làn phản
biện đầy**, và hậu quả nặng hơn vì nó chạm chính điều kiện đi-tiếp-không-người.

## Ngả sửa (chưa quyết)

1. Điều kiện xanh-sạch đọc CẢ HAI tệp: mục «Ngoài hợp đồng» rỗng ở báo cáo mà
   `review-findings.md` có mục nào thì KHÔNG sạch.
2. Hoặc buộc lượt Workflow ghi findings vào cả hai chỗ, và thêm một luật lưới
   đối chiếu số mục giữa hai tệp — lệch là VIOLATION có tên.
3. Dù chọn ngả nào, thẻ nên nói ra khi hai tệp lệch, thay vì render 13 mục ở
   khối việc-của-người trong khi đầu thẻ ghi «máy đã đi tiếp».

Phép đo hai chiều bắt buộc: một hồ sơ mẫu có báo cáo rỗng và `review-findings.md`
rỗng → xanh-sạch, lưới clean; một hồ sơ mẫu có báo cáo rỗng và
`review-findings.md` một mục → KHÔNG xanh-sạch, lưới nêu VIOLATION ghim số mục.
