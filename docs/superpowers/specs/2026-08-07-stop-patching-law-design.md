# stop-patching-law — luật dừng-vá khi khuôn giải sai

**Ngày:** 2026-08-07 · **Slug:** `stop-patching-law` · **Tier:** T2 ·
**Nguồn:** ba vòng liên tiếp cùng một hình dạng (card-text-fidelity 4 vòng,
codex-script-packaging 4 vòng, measure-teeth-cleanup 3 vòng).

## Vấn đề

Chỉ dẫn hiện có **trần 3 vòng** — một cơ chế cứng để không chạy vô hạn. Nó
không phải chẩn đoán: nó dừng ta *sau khi* đã tiêu ba vòng, và không nói gì
về việc **khuôn giải có sai hay không**.

Ba vòng gần nhất đều kết thúc cùng một cách: lỗi mỗi vòng phần lớn là lỗi
**mới do bản sửa vòng trước sinh ra**, không phải lỗi cũ chưa sửa; và lời giải
cuối cùng luôn là **đổi khuôn hoặc thu phạm vi**, không phải vá thêm. Trong cả
ba, dấu hiệu đã đủ rõ **từ cuối vòng hai** — nhưng không có mệnh đề nào bảo
dừng, nên vòng ba vẫn chạy và vẫn hỏng cùng kiểu.

## Luật (một mệnh đề, đặt ngay trước trần-3-vòng)

Cuối mỗi vòng sửa, trước khi dispatch vòng kế: so lớp lỗi vòng này với vòng
trước. **Nếu vòng sửa thứ hai vẫn sinh lỗi CÙNG LỚP với vòng một → khuôn giải
sai.** DỪNG, không dispatch vòng ba; trình người ba đường: **đổi khuôn** ·
**thu phạm vi** · **ship với giới hạn đã biết**. Vá tiếp là lựa chọn phải được
người chọn tường minh, không phải mặc định.

"Cùng lớp" = cùng tên trong sổ lớp lỗi (đo-chuỗi-thay-quan-hệ, hạ-thước,
fail-open, đếm-rồi-vứt, hằng-đúng, tautology…), **không phải** cùng dòng mã
hay cùng phép đo.

## Vì sao đặt ở chỉ dẫn chứ không phải chốt máy

Đây chính là kết luận của vòng dọn nợ vừa xong: chốt tự cưỡng chế lại cần chốt
cho chính nó. Phân loại "cùng lớp" là việc đọc-và-phán, không phải việc đếm.
Nơi nó sống được là chỉ dẫn + phản biện Cổng 1 + vòng soi S4.

## Out of scope

- Chốt máy phát hiện "cùng lớp" tự động.
- Đổi trần 3 vòng (giữ nguyên — hai cơ chế khác nhau, bổ sung cho nhau).
- Sửa bất kỳ phép đo nào đang có.
