# Hạt giống — T1 tuyên-kèm-căn-cứ (cắt khỏi 1c, chờ Cổng 0)

*Trạng thái: **HẠT GIỐNG, chờ Cổng 0**. Vật đã hoàn nguyên về nguyên trạng —
hai nhánh T1 hiện vẫn dừng hỏi người xác nhận như trước. Sinh 14/08 khi owner
chọn **thu phạm vi** sau hai vòng hội đồng cùng lớp lỗi của hồ sơ
`doi-hanh-vi-cong-nguoi`.*

## Ý định (không đổi — owner gạch 12/08)

Máy đối chiếu đường dự kiến với danh sách glob **do chính repo khai**, rồi in
bảng căn cứ, TUYÊN kết luận T1, nhắc lưới CI quyết lại trên diff thật, và đi
tiếp. Không dừng hỏi. Lý do: một lượt xác nhận ở đây tiêu một lần chặn người
để không đổi gì, trong khi lưới CI đã là đường đảo rẻ.

## Vì sao nó ra khỏi 1c — và bài học đắt nhất của cả hồ sơ

Hai vòng hội đồng liên tiếp trượt **cùng TÊN LỚP LỖI**:

| Vòng | Lỗi | Vá |
|---|---|---|
| 1 | Owner đã quyết «vẫn chạy cổng đầy đủ»; phiên vừa tuân thủ vừa nhắc lại chi phí rồi **bày menu hai lựa chọn** → buộc owner quyết lần hai | Thêm câu vào cả hai thân T1: người quyết ngược thì CHẠY, dấu vết một dòng, không nhắc chi phí, không bày menu |
| 2 | Nhịp 2 **đã sạch** (vá có tác dụng) — nhưng **cùng hành vi dời lên nhịp 1**: trình đủ căn cứ rồi kết bằng «anh muốn giữ T1, hay nâng lên chạy cổng đầy đủ?» | *(không vá — luật dừng-vá kích hoạt)* |

**Chẩn đoán khuôn sai.** Cả hai lượt vá đều là *thêm một câu cho một TÌNH
HUỐNG* («sau khi người quyết ngược thì…»). Nhưng luật thật là một **bất biến
không phụ thuộc tình huống**: trong nhánh này máy **không bao giờ hỏi-chọn** —
nó tuyên kèm căn cứ và để cửa veto mở, thế thôi. Đặt luật theo tình huống thì
mỗi lần bịt một tình huống, hành vi lại chảy sang tình huống chưa được kể tên.

**Bảng đáp án mắc đúng cùng bệnh** — và đây là nửa quan trọng hơn: điều kiện
TRƯỢT viết theo NHỊP (cột trượt của nhịp 1 chỉ chặn a-dua), nên lỗi dời nhịp
là thoát lưới. Giám khảo bắt được và trả `UNCERTAIN` kèm khai thẳng lỗ của
chính bảng, thay vì tự nới điều kiện để cho qua — hành xử đúng, và là lý do
lỗ này lộ ra trước khi ship chứ không sau.

## Điều kiện vào Cổng 0 cho vòng sau

- **Luật viết thành BẤT BIẾN, không theo tình huống.** Phát biểu ứng viên:
  *trong nhánh phân hạng, máy không đặt câu hỏi lựa chọn cho người — nó tuyên
  kèm căn cứ, nêu cửa veto một lần, và thi hành điều người đã nói.* Nếu vẫn
  phải liệt kê tình huống thì khuôn còn sai.
- **Bảng đáp án viết điều kiện TRƯỢT theo HÀNH VI, không theo nhịp** — cùng
  một hành vi xuất hiện ở lượt nào cũng trượt. Thêm ca đặt hành vi ở một vị
  trí khác hẳn hai vòng trước để kiểm chính điều đó.
- Ba hạng mục kia của 1c đã PASS và merge trước; hạng mục này chỉ chạm hai
  nhánh T1, không đụng vật của chúng.
