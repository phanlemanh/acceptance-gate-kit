# Bản phạm vi — khuôn (đầu vào của skill cắt lượt)

> Một bản phạm vi là MỘT tệp markdown trong git của kho (đường do kho chọn, ví dụ
> `docs/plan/pham-vi-<đợt>.md`), commit TRƯỚC hoặc CÙNG PR với các hàng cắt từ nó. Không có trong git
> thì răng phủ không có gì để so (đo 06/10 trên crm: bản phạm vi lượt cắt 04/10 nằm ở thư mục chạy cục
> bộ, 16 số hở không phân xử được).
>
> Phần máy đọc là khối giữa hai marker dưới đây: ba dòng đầu khai đợt, dáng cắt và nguồn; mỗi dòng
> `- \`<mã>\` — <một dòng mô tả>` là một mã. Dòng khác (tiêu đề, văn giải thích, trích dẫn) bộ đọc bỏ
> qua; dòng bắt đầu bằng `- \`` mà sai khuôn thì bộ đọc báo lỗi kèm số dòng, không bỏ lặng.
>
> - `dot` — tên đợt, viết liền không dấu cách (ví dụ `okr-1410`). Mỗi hàng và mỗi mục chân trời cắt từ
>   bản này mang đúng giá trị này ở trường `dot`.
> - `dang` — `chuoi` (chuỗi tính năng: mỗi hàng đứng trên dữ liệu thật của hàng trước) hoặc `lan-va`
>   (làn vá: gói lỗi theo màn hay vùng sản phẩm, các hàng chạy song song).
> - `nguon` — bản phạm vi đến từ đâu: đội sản phẩm, một khảo sát, Core của quét hình thái.
>
> Mẫu dưới đây chạy được: bộ đọc của `scripts/cat-luot.mjs` rút khối này trong ca đo và phải đọc ra
> đúng ba khoá và năm mã.

<!-- <<<PHAM-VI-MA -->
```
dot: mau-1
dang: chuoi
nguon: đội sản phẩm gửi qua cửa tín hiệu ngày 01/11

- `A1` — người phụ trách KR thấy số tuần trước điền sẵn
- `A2` — gửi cập nhật tuần trong một màn
- `A3` — nhắc buổi sáng dẫn thẳng vào màn cập nhật
- `B1` — xuất báo cáo quý ra bảng tính
- `B2` — đổi giao diện màn báo cáo cho điện thoại
```
<!-- PHAM-VI-MA>>> -->
