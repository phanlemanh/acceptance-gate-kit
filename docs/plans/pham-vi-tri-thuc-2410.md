# Bản phạm vi — tầng tri thức theo LLM Wiki (24/10)

Chủ kho phát hiện 24/10: lộ trình không mang bối cảnh nghiên cứu và thảo luận tới vòng làm việc, ở cả ba kho đang cắt
lượt (kit, crm-onehub, onehub-invest). Chủ kho chốt cùng ngày: dùng khái niệm LLM Wiki, đổi ở tầng kit, tri thức phục
vụ mọi vòng feature-loop chứ không chỉ cắt lượt, và đưa phần này vào lượt cắt của kit. Thiết kế, số đo trên ba kho và
đối chiếu luật kit: `docs/findings/2026-10-24-tang-tri-thuc-llm-wiki.md`.

Bản đã qua một lượt phản biện context sạch (mục 7 của tài liệu thiết kế): bỏ bước ghi ngược quyết định và hai tệp
`index.md`/`log.md` được commit, ghim theo băm nội dung thay sha, thêm răng riêng tư cho kho công khai.

Nhóm A là kho tri thức và lint, B là ghi tri thức, C là tra và nạp ở bước thiết kế, D là cắt lượt nối tri thức, E là
thảo luận trong vòng, F là phần chờ điều kiện.

<!-- <<<PHAM-VI-MA -->
```
dot: tri-thuc-2410
dang: chuoi
nguon: docs/findings/2026-10-24-tang-tri-thuc-llm-wiki.md

- `A1` — kho khai tri_thuc (thư mục trong kho, cờ công khai, kho riêng đi kèm giải theo checkout chính); khuôn luật kho, frontmatter trang và mô tả raw là khối marker một nguồn; lệnh khởi tạo in dòng khai thư mục tri thức vào t1_skip_globs
- `A2` — lint máy sáu lỗi cấu trúc của kho tri thức, chỉ đọc, chiều đỏ ghim từng lỗi, lối vào /tri-thuc:kiem
- `A3` — đường trỏ ghim theo băm nội dung (<kho>:<đường>#<băm>), phân giải được ở mọi worktree, từ chối kho riêng chưa có ở remote
- `B1` — lệnh /tri-thuc:ghi lưu raw bất biến kèm băm, viết hay sửa trang wiki, commit, in đường trỏ
- `B2` — ghi tri thức nhận năm loại nguồn: trích phiên chat, artifact, issue, tệp chỉ có ở một máy, tệp đã có trong kho
- `B3` — kho công khai: raw không bao giờ vào kho tiêu thụ; chưa có nơi riêng mà nguồn nhạy cảm thì dừng, hỏi người
- `C1` — vòng từ hàng lộ trình chọn trang theo mã của hàng cùng trang nền chung
- `C3` — dòng sổ «đã tra tri thức» ở bước thiết kế; thẻ Cổng Phạm vi chỉ hiện cờ khi thiếu, lệch băm hay không đọc được; thiếu thì máy tự gỡ
- `C4` — máy không đọc được kho tri thức thì gắn nhãn «không đọc được ở đây», không chặn; tự clone khi có remote và quyền
- `C5` — căn cứ ở bước thiết kế trỏ trang tri thức bằng con trỏ băm, không chở câu trích từ kho riêng; bộ xếp căn cứ nhận dạng này
- `D1` — nguồn của bản phạm vi là trang tri thức qua đường trỏ băm; liên kết ngoài và tệp chưa vào kho bị răng phủ từ chối
- `D2` — ô mở từ hàng ghi dòng «Nguồn:» gồm trang nền, trang đợt và trang mang mã; hàng không thuộc đợt nào giữ ô nguyên từng chữ
- `C2` — vòng đơn lẻ tra trang theo mô tả cùng trang nền chung
- `E1` — bộ tra đọc sổ quyết định của mọi hồ sơ, nên lời người ở cổng của vòng trước tới vòng sau mà không chép sang trang
- `F1` — hỏi tự do trên tri thức, câu trả lời đáng giữ đề xuất thành trang
- `F2` — lint nghĩa: trang trái nhau, trang cũ, hợp đồng trái nghiên cứu
- `F3` — tra theo nghĩa thay cho tìm chữ
- `F4` — bản đồ tri thức cho người xem (/tri-thuc:xem)
- `F5` — tri thức của chính kit
- `F6` — răng quét trang tóm ở kho công khai tìm lời nguyên văn và dữ liệu nội bộ
```
<!-- PHAM-VI-MA>>> -->
