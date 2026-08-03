## Trong hợp đồng

Không có finding nào ánh xạ được vào AC ở round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **configList silently returns [] when the key line carries a trailing comment — diverges from pre-merge bash reader**
  Người dùng thấy gì: Nếu tệp cấu hình loại-trừ có thêm một dòng ghi chú ngay sau tên mục cấu hình, công cụ kiểm tra bản đồ sản phẩm có thể báo "đạt" dù một thay đổi đã thực sự xoá mất bản đồ sản phẩm — nghĩa là một số thay đổi lẽ ra phải bị chặn có thể lọt qua kiểm tra tự động mà không ai để ý.
  file: `lib/workspace-record.js:150`
  severity: medium
  Đề xuất: known-limits — ghi nhận như hạn chế đã biết, cho phép ship kèm cảnh báo; theo dõi sửa cho phép comment tuỳ chọn sau dấu hai chấm trên dòng khoá (regex dạng `:(\s*(#.*)?)$`) và bổ sung hình dạng đó (comment trên KEY line, không chỉ trên ITEM line) vào bộ HINH của case P130, đồng thời áp cùng sửa cho bản mirror `plugins/acceptance-gate/lib/workspace-record.js`.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).