# Sổ phát hiện — lan-may-song-qua-bo-phan-loai

Hồ sơ chạy **10 vòng nghiệm thu**. Luật dừng-vá bật **ba lần**. Sổ này ghi trạng
thái **hiện tại**; toàn văn từng vòng nằm trong `decisions.jsonl` và trong nhật ký
ghim của nhánh.

## Trong hợp đồng

(rỗng — mọi phát hiện trong hợp đồng đã đóng, mỗi cái có phá thử trên vật thật)

## Ngoài hợp đồng — người quyết ở Gate 2

(rỗng — mọi phát hiện ngoài hợp đồng đã đóng ở các vòng sau, không món nào chuyển
thành hạn chế đã biết)

## Đã đóng — theo LỚP, không theo từng cái

Mỗi dòng là một **lớp lỗi** chứ không phải một chỗ; chỗ nào cũng có phá thử trên
vật thật trước khi tuyên đóng.

1. **Văn mô tả phép đo khai hành vi của bộ đo, không gì đối chiếu** — đóng ở vòng 3
   bằng cách bỏ HẲN lời khai: văn chỉ còn nói chạy gì · thấy gì là đạt · phép đo cài
   ở đâu. Điều kiện sống một chỗ duy nhất là bảng vế trong mã.
2. **Mồi nhử gõ tay là bản chép thứ hai của điều kiện** — đóng ở vòng 4: gỡ 15 chuỗi
   mồi, phép thử ngược nay sinh TỪ CHÍNH biểu thức của bộ kiểm.
3. **Nhánh có thật thiếu chiều đỏ** — đóng ở vòng 4: bốn nhánh dùng chung khai một
   chỗ (đọc hỏng cấu hình · khoá không giải được · danh sách rỗng · thiếu/trùng mốc
   neo).
4. **Xanh mà chưa từng chạy** — đóng ở vòng 5: một ca có điều kiện tự bỏ qua thân
   nó khi bộ kiểm gọi riêng; nay mọi ca in dòng đạt của chính nó, và mỗi lượt
   nghiệm thu đều kiểm lại điều đó.
5. **Vế chết hằng đúng** — đóng ở vòng 6: một «chiều đỏ» chép lại biểu thức của thứ
   nó canh thay vì gọi thứ ấy, nên không đời nào sai.
6. **Phạm vi lời hứa để mở** — đóng ở vòng 7–8: hợp đồng nay nêu đích danh phạm vi,
   và phép đo RÚT phạm vi từ hợp đồng thay vì giữ bản chép tay.
7. **Cửa hậu mang-kết-quả-cũ-sang** — đóng ở vòng 9–10: khai phạm vi tệp của phép đo
   cho engine nay phủ trọn tập tệp phép đo thật sự đọc.
8. **Thước ghim vào trình bày** — đóng rải: ngắt dòng, thụt lề YAML, thứ tự mảng.

## Món ĐÃ CẮT (không phải đã đóng)

**Lưới tự-khai-lời-báo** dựng ở vòng 4 để canh «mọi nhánh đều có chiều đỏ» — owner
CẮT ở vòng 5. Hai lý do: lời nó hứa là phủ định phổ quát trên văn xuôi mã nguồn,
không thuộc loại chứng được; và bản thân nó xanh mà chưa từng chạy. Cái giá đã
nhận và ghi thành hạn chế số 6 trong hồ sơ bằng chứng: **nhánh sinh sau này không
được canh tự động.**
