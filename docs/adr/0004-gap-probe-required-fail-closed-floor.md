# ADR 0004 — `gap_probe: required` có sàn fail-CLOSED

Khi luật gap-probe **không cưỡng chế được** — vắng `node`, thiếu
`lib/gap-probe.js`, chạy không `--base`, hoặc `git diff` thoát khác 0 —
`pre-merge-check.sh` ở mode `required` phát đúng một dòng marker máy-đọc
`GAP-PROBE: NOT ENFORCED reason=<lý do>` rồi tính đó là VIOLATION và chặn merge;
`advisory` chỉ in marker kèm NOTE, `off` im hoàn toàn. Phương án bị loại là cái
đang có trong contract v3 lúc soạn: in NOTE rồi exit 0 — và eval `E15` khi đó ghim
nguyên văn "exit không đổi", tức đóng đinh vế fail-open vào bằng chứng. Lý do
loại: kênh "NOTE rồi exit 0" đã giết contract v1 của chính feature này (ledger
`d-114`: hook in NOTE ra stderr rồi exit 0, mà hợp đồng `PreToolUse` loại bỏ
stderr khi exit 0 — thông điệp không tới ai), và một cổng tự hạ chuẩn đúng lúc nó
đang mù là định nghĩa của false-green mà kit sinh ra để chặn. Trade-off nhận về
là thật và đã trả ngay: CI image thiếu `node`, hay bất kỳ lối gọi nào quên
`--base`, chuyển từ "im lặng cho qua" thành lỗi cứng — job `gate` của chính kit
đỏ vĩnh viễn ngay khi sàn landing, phải vá bằng commit riêng `ead1c84` (CI luôn
truyền base: PR → `origin/base_ref`, push → `HEAD~1`). Chọn sửa CI chứ không
miễn trừ nhánh không-base, vì miễn trừ đó lại đúng là lỗ vừa bịt. Consumer chưa
sẵn sàng vẫn có đường lùi: `advisory` và `off` giữ nguyên hành vi cũ.

Ledger: `d-20260726T213100Z-128`. Răng: `GPM18a/b/c`, `GPM19a-f`, `GPM13b`,
`GPM15c` (tests/scripts) và `P35` (tests/plugins, buộc CI luôn truyền base).
