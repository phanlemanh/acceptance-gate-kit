# Review findings: ten-may-mot-luat (round 2)

## Trong hợp đồng

Không có finding nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Comment on tmml_e6 says it pins the exact pass count, but the command checks only a lower bound**
  Người dùng thấy gì: Một dòng ghi chú trong tệp cấu hình mô tả phép kiểm nói nó khoá đúng số ca qua, trong khi thực tế chỉ đòi tối thiểu 69. Người dùng không thấy gì khác đi; chỉ người bảo trì có thể hiểu nhầm.
  Căn cứ: Chỉ là câu chữ mô tả lệch, không ảnh hưởng hành vi hay dữ liệu của người dùng, và sửa lại sau bất cứ lúc nào cũng rẻ.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
