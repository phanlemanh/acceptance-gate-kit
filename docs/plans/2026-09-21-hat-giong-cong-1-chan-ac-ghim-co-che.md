# Hạt giống — Lint Cổng 1 chặn AC ghim cơ chế (tên tệp, byte, tên hàm) thay vì ghim tính chất

**Ngày:** 2026-09-21 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2
(`scripts/eval-coverage-lint.js` hoặc lint Cổng 1 cạnh nó).
Gốc: crm/_acceptance/ho-so-khai-dung-tieng — K3 + §4.4 của
`crm:docs/findings/2026-09-20-retro-hang-muc-khai-dung-tieng.md`.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Lỗ

AC-11 của `ho-so-khai-dung-tieng` viết: «chân đo **NGUYÊN TRẠNG** … vẫn xanh». Nó ghim **byte
của một tệp** làm tiêu chí nghiệm thu, trong khi điều nó muốn bảo vệ là một **tính chất**: «phép
đo cũ vẫn cho cùng kết luận».

Hậu quả đo được: một bản vá một chữ (`networkidle0` → `load`) làm E1/E10 của vòng đã ký xanh
thật — và **phá AC-11 của vòng bên cạnh**. Hai lời hứa cãi nhau, không lời nào sai. Tức **cải
thiện thước = vi phạm hợp đồng**, một trạng thái không có lối ra hợp lệ.

Chỗ lỗi không nằm ở lượt chấm. Nó nằm ở **Cổng 1**: câu AC ấy lẽ ra bị chặn lúc duyệt, chứ
không phải bị phát hiện ở lượt chấm thứ tư.

## Việc

Lint Cổng 1 cảnh báo (hoặc chặn, nếu đo được tỉ lệ dương tính giả thấp) khi một AC chứa con trỏ
tới cơ chế: đường dẫn tệp có đuôi, «nguyên trạng / không đổi / giữ byte», tên hàm. Gợi câu thay
thế dạng tính chất: «phép đo X cho cùng kết luận trên vật Y».

Chiều đặc hiệu bắt buộc (luật hai chiều, 14/09): AC hợp lệ có nhắc tên tệp như **ngữ cảnh** —
ví dụ «trên màn `ho-so-ke-hoach`» — phải **IM**.

## Ngưỡng mở ô

Chưa đo trên kit; ở crm đã có một ca thật làm hỏng một vòng. Mở khi: ≥1 AC của chính kit rơi vào
mâu thuẫn «sửa thước = vi phạm AC», hoặc khi owner gọi tên. Đi kèm R2 bên kho tiêu thụ (quy ước
viết AC) — luật ở kho, răng ở kit.
