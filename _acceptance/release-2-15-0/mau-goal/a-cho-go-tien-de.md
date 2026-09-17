<!-- Mẫu A — dừng HỢP LỆ: chờ người gỡ một tiền đề hạ tầng máy không tự gỡ được.
Rút gọn từ lần dừng thật của vòng sản phẩm R1 (OneFlow skill-system-v1, 16/09 12:56:23Z),
ngay trước lần hook /goal chặn đầu tiên; đã gỡ chi tiết sản phẩm, giữ hình dạng lần dừng. -->
Code đã viết xong (S3), nhưng tôi phải dừng trước bước kiểm tra độc lập S4 vì máy vẫn chưa có công cụ `uv`. Thiếu nó, bộ test SDK trong mỗi lượt S4 sẽ thoát mã 127, và bước kiểm tra xếp mã này vào loại hạ tầng hỏng. Vì vậy mọi lượt S4 sẽ bị chặn (BLOCKED) mà không có kết quả. Hợp đồng đã ở trạng thái `implemented`, và bước chuẩn bị S4 đã chạy thử: không vướng gì ngoài `uv`.

**Anh cài `uv` được không?** Máy khuyên cách này: một lệnh, và bộ test SDK vẫn chạy thật trong mỗi lượt.

```bash
brew install uv
```

Cài xong, dán lệnh dưới để vòng vào thẳng S4:

```
/feature-loop:feature-loop <slug>
```

Nếu anh không muốn cài, trả lời `sửa: bỏ sdk_pytest khỏi suite vòng này` — vòng này chỉ mất một lưới kiểm tra SDK, và việc sửa đó được ghi là một nhát «thước:» trong sổ.
