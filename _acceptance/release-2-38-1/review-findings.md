## Trong hợp đồng

- **Hình dạng 3 — lời hứa là QUAN HỆ với Context nhưng một vế là hằng gõ tay (E4 / rel2381_cua_so)**
  file: `_acceptance/config.yaml:899`
  severity: medium
  AC: AC-4
  detail: AC-4 và `expected` của E4 (evals.yaml:94-95) hứa tập hồ sơ được ký suy từ kho BẰNG «tập kể trong Context». Khoá `rel2381_cua_so` lại truyền slug bằng tay: `scripts/rel-cua-so.sh c8fa5a65 t3-can-ho-so-arm`. Trong rel-cua-so.sh, `mong=$(printf '%s\n' "$@" | sort -u)` chỉ lấy tham số dòng lệnh; script và khoá đều không đọc `_acceptance/release-2-38-1/contract.md`. Hệ quả: sửa mục Context (contract.md:25-26) thành kể hai hồ sơ, hoặc xoá hẳn câu đó, E4 vẫn in «XANH: hai tập bằng nhau» và thoát 0. Vế được so là bản chép thứ hai trong config, không phải Context, nên quan hệ mà AC-4 hứa không được đo. Chính đầu script ghi lý do nó tồn tại là lời kể tay của hợp đồng từng sai (2.17.0: kể 2, thật 3). Đối chiếu E8: lop-chep-doi.sh rút cả hai vế từ nguồn (INIT-CI-COPY-LIST và gạch trong CHANGELOG). Hiện Context có kể đúng slug này, nên đây là lỗ của phép đo, chưa phải kết quả sai.
  rationale: AC-4 đòi tập hồ sơ được ký suy từ kho BẰNG danh sách kể trong Context, và Context nói rõ là không chép tay; phép đo không đọc Context nên không chứng minh được AC-4.
  source: measurement

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 3 — lời hứa «chỉ đổi số, như CHANGELOG kể» là QUAN HỆ nhưng phép đo chỉ so danh sách tên tệp (E7 / rel2381_goi_doi)**
  Người dùng thấy gì: Kiểm tra chỉ xác nhận bốn gói có đổi tệp thông tin, không xác nhận chúng chỉ đổi số phiên bản. Một gói (feature-loop) thực ra còn đổi cả phần mô tả, nên lời ghi chú phát hành có thể nói hẹp hơn thực tế.
  Căn cứ: Hậu quả nhẹ: chỉ là lời ghi chú phát hành nói hơi hẹp, không mất hay lộ dữ liệu của người dùng; sửa lại phép đo sau này rẻ và không ảnh hưởng bản đã phát hành.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
