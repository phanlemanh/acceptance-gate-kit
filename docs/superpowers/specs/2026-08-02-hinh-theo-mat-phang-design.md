# Design — Hình chọn theo mặt phẳng, không theo định dạng

**Slug:** `hinh-theo-mat-phang` · **Tier:** T2 · **Ngày:** 2026-08-02
**Sửa lỗi của:** `ngon-ngu-mat-nguoi` (ký 2026-08-01) — luật N5 ghim sai lớp.

## 1. Vì sao có feature này (nguyên nhân thật, quan sát trực tiếp)

Luật N5 nói *"hình trước, chữ là chú thích"*. Bản thi hành ghim khuôn hình bằng
một khối `mermaid`. Ngay lượt đầu áp luật vào việc thật, tôi dán một khối
`mermaid` vào khung hội thoại và tưởng mình đang tuân luật — **khung hội thoại
không vẽ mermaid**, nên thứ người dùng nhận được là một khối mã. Owner nhìn ra
ngay: *"Mermaid không hiển thị được dạng chart mà vẫn hiển thị dạng code."*

Khối mã ở chỗ đáng lẽ là hình **tệ hơn cả không có hình**: nó chiếm chỗ của một
cái bảng đọc được, và nó làm người viết yên tâm rằng mình đã tuân luật.

**Lớp lỗi:** luật ghim **ĐỊNH DẠNG** (`mermaid`) trong khi điều cần ghim là
**KẾT QUẢ** (người nhận nhìn thấy hình). Ghim định dạng thì luật đúng ở đúng một
mặt phẳng và sai ở mọi mặt phẳng còn lại — mà mặt phẳng thì đổi theo ngữ cảnh,
không đổi theo ý người viết luật.

Quyết của owner (2026-08-02): *"vẽ ở đâu thì phụ thuộc vào mặt phẳng và bối
cảnh"* — và với khung hội thoại đang dùng thì mặc định là **vẽ thẳng vào hội
thoại**.

## 2. Kiến trúc — thêm một bảng tra, giữ nguyên phần đang đúng

Phần N5 đang đúng và KHÔNG đụng tới: **ngưỡng kích hoạt** (từ ba bước nối tiếp
hoặc từ hai nhánh rẽ trở lên thì bắt buộc có hình). Ngưỡng vẫn đếm được, vẫn
độc lập với mặt phẳng.

Phần sai là câu trả lời cho *"hình đó vẽ bằng gì"*. Thay một định dạng cứng
bằng một **bảng tra theo mặt phẳng**, đặt một chỗ có marker như mọi khuôn khác:

```
skills/acceptance/references/human-facing-language.md
  ├─ Ngưỡng kích hoạt N5            ← GIỮ NGUYÊN
  ├─ <<<DECISION-DIAGRAM-SURFACES>>>  ← MỚI: bảng tra mặt phẳng → cách vẽ
  ├─ Phép thử một câu                 ← MỚI: người nhận có NHÌN THẤY hình không
  └─ <<<DECISION-DIAGRAM-TEMPLATE>>>  ← GIỮ, nhưng ghi rõ là ví dụ cho MỘT mặt phẳng
```

Bốn mặt phẳng kit thật sự chạm, mỗi cái một cách vẽ:

| Mặt phẳng đang trình | Vẽ bằng | Khi nào |
|---|---|---|
| Khung hội thoại | hình vẽ nội tuyến của phiên | **mặc định** — người quyết thấy ngay trong luồng đọc |
| Panel bên / file mở được | trang HTML gửi kèm | cần soi lâu, cần cuộn (thẻ cổng, trang bằng chứng) |
| Terminal thuần | hình bằng ký tự trong khối mã | chốt cuối — xấu nhưng luôn chạy |
| Tài liệu trong kho | khối `mermaid` | khi hình sống trong `.md` mà kho render được |

**Vì sao vẫn giữ khối `mermaid`:** nó đúng cho mặt phẳng tài liệu, và kit đã có
5 sơ đồ mermaid trong `GUIDE.md` chạy tốt. Sai lầm không phải là mermaid, sai
lầm là **coi mermaid là câu trả lời duy nhất**. Nên nó xuống một hàng trong bảng
và được ghi rõ là ví dụ cho một mặt phẳng.

**Phép thử một câu** (rẻ như hai phép thử kia): *thứ người nhận nhìn thấy có
phải là HÌNH không?* Dán khối mã vào mặt phẳng không vẽ được nó → câu trả lời là
KHÔNG. Đây là phép thử người tự làm được trong một giây, không cần đo bằng máy.

## 3. Kiểm chứng — đo gì và không đo được gì

| Đo được bằng máy | Không đo được bằng máy |
|---|---|
| Bảng tra có mặt, bọc marker, ≥3 mặt phẳng, có hàng hội thoại và hàng đó là mặc định | Agent CÓ THẬT SỰ chọn đúng cách vẽ lúc chạy |
| Phép thử một câu có mặt, nêu rõ khối-mã-ở-mặt-phẳng-không-vẽ-được là KHÔNG đạt | Hình vẽ ra có dễ hiểu không |
| Khối ví dụ được ghi rõ là ví dụ cho một mặt phẳng, không phải định dạng bắt buộc | |
| Hai bản vòng lặp gọi bảng tra theo tên, không ghim một định dạng | |
| Cặp marker mới duy nhất trên toàn kho | |

Case mới **P97**, cộng nới ba phép đo có sẵn: `P93` (thêm marker mới vào bộ đếm
cặp toàn kho), `P90` (ghim câu mới trong hai bản vòng lặp), `P92` (khối ví dụ
phải mang nhãn mặt phẳng).

Mọi case theo bất biến kho: bản nguyên vẹn XANH trước, rồi đột biến, ghim đúng
thông điệp. Vùng quét và cách đếm cặp marker tái dùng nguyên của `P93` — bốn
vòng của feature trước đã trả giá để có nó, không dựng lại.

## 4. Known limits

1. Bảng tra liệt kê **bốn mặt phẳng kit đang chạm**. Mặt phẳng thứ năm (ví dụ
   một công cụ chat khác) sẽ không có hàng, và luật im lặng ở đó. Chấp nhận: mở
   rộng bảng rẻ hơn nhiều so với đoán trước.
2. Vẫn không đo được hành vi thật lúc chạy — cùng giới hạn đã ghi ở feature
   trước. Dấu hiệu đọc ở vòng sau: số lần người duyệt lại bắt được "khối mã ở
   chỗ đáng lẽ là hình".
