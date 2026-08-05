# Thẻ Cổng 1 hiện ngôn ngữ máy ở khối Coverage + gap-probe

*2026-08-05 · phát hiện bởi owner khi duyệt Cổng 1 `delta-verify-repin` ·
đã kiểm chứng root cause trong phiên, chưa sửa (out-of-scope vòng đang chạy).*

**Triệu chứng:** khối "Độ phủ AC" trên thẻ in `**S — sự kiện re-pin**` nguyên
dấu sao và cắt cụt giữa câu ("AC-6 (sha vào"); khối "Phản biện context sạch"
in nguyên văn cell bảng gap-probe (backtick, tên eval, tên file) — vi phạm
luật ngôn-ngữ-mặt-người (phép thử xoá-tên-máy fail).

**Root cause (source `scripts/gate-card.js`, mirror acceptance-gate 1.31.0):**

1. Dòng ~188: `covLines` lọc `/^-\s+\S/` trên từng DÒNG — bullet markdown
   hard-wrap 80 cột bị vứt phần nối dòng → câu cụt. Cần join dòng-nối vào
   bullet trước khi lọc.
2. Dòng ~273/~277: render bằng `esc()` thuần, KHÔNG đi qua tầng
   card-plain — trong khi AC (`willText`) và quyết định (`plDec`) ĐÃ có
   đường plain-language. Lớp lỗi: **hai block sinh sau tầng card-plain
   không được nối vào tầng đó** — khi sửa phải quét mọi block render text
   contract/ledger/probe thô (Coverage, gap-probe rows, decLine fallback),
   không chỉ vá một khối.

**Hình dạng fix đề xuất:** (a) parser bullet biết dòng-nối; (b) mở rộng
schema card-plain cho coverage + probe (hoặc lột markdown + viết lại bằng
tiếng sản phẩm ở writer); RED-test bằng contract có bullet wrap + `**` —
thẻ phải hiện câu TRỌN VẸN không dấu máy. Test theo luật thước-gắn-vật:
fixture do code sinh từ chính contract thật, không viết tay.
