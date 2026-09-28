# ADR 0021 — Ba vế một câu: một sổ quyết định, viết cho người ký, không lớp dịch thứ hai

2026-09-29 · owner phê đích danh một CỘNG (ADR 0018) sau khi đọc so sánh hai sổ trong
phiên kit, không có vòng đang mở nên phê bằng ADR. **Số đo:** vòng crm
`tro-ly-okr-de-xuat` (28/09) chạy S3 dưới superpowers 6.4.1; khối «Rulings I made» in
**11** ruling, **4** mang mã sổ của kit (d-13 · d-14 · d-17 · d-18), **7** chỉ sống trong
chat — trong đó một ruling đổi thành phần dùng chung `packages/ui` Item mà Cổng 2 không
thấy. Luật bằng lời của feature-loop («đổi hướng so với kế hoạch → append `fix`/`descope`»,
SKILL dòng 188) đạt **36 %**. Ledger của superpowers (`.superpowers/sdd/<plan>/progress.md`)
bị gitignore và skill tự `rm -rf` ở Finish, nên sau khi vòng khép repo tiêu thụ không còn
dòng nào để lật lại. Cùng lúc, kit đang viết một quyết định **hai lần**: dòng máy trong
`decisions.jsonl` (`decision` nhét «vì sao» sau dấu gạch, `impact` trộn «được gì» với
«rủi ro» với «cách lùi») rồi câu dịch trong `card-plain.json.decisions_plain` để người
ký đọc được. **Quyết, ba vế:** (1) **MỘT sổ** — `_acceptance/<slug>/decisions.jsonl` là
nơi duy nhất quyết định sống; ledger của superpowers là vật tạm, kit đọc chứ không nuôi.
(2) **Ba vế một câu** — mỗi dòng sổ mang ba trường, mỗi trường đúng một câu:
`decision` (quyết gì) · `why` (vì sao) · `cost_if_wrong` (sai thì tốn gì); `decision` và
`cost_if_wrong` viết cho người ký, không tên biến, không mã eval trần; `why` được trỏ
tệp và mã eval vì đó là chỗ lần vết. Thẻ Cổng 1 và Cổng 2 in đúng một dòng
«quyết gì — vì sao — sai thì tốn gì», cùng hình với khối superpowers đã cho thấy là đọc
được. Dòng có đủ ba vế thì lớp `decisions_plain` không còn việc; dòng cũ chỉ có `impact`
render như hôm nay qua lớp dịch hoặc chữ gốc — đường đọc-cũ, không migrate. (3) **Cầu
nối máy cuối S3** — trước khi superpowers xoá workspace, feature-loop đọc mọi dòng
`Ruling:` và append vào sổ dạng provisional `stage: S3`, cắt ba vế theo đúng khuôn
«— Vì sao: … Sai thì tốn: …» mà ledger thật đã viết; không có ledger hay khuôn lạ → im
và một dòng cờ vàng, không chặn. Không thêm lượt gọi người: dòng rơi vào khối Treo sẵn
có của Cổng 2. **Trade-off nhận có tên:** kit đọc một tệp của bên thứ ba không có hợp
đồng khuôn — superpowers đổi tên thư mục hay khuôn dòng thì cầu nối im; đổi lấy việc
ruling không còn chết cùng workspace; cái giá được khai bằng chính chiều im có cờ vàng và
một ca đo dùng ledger do superpowers sinh, không viết tay. **Vì sao khó đảo:** đây là
schema của một artifact mà mọi repo tiêu thụ đang ghi mỗi vòng; quay lại hai trường là
một lần migrate thứ hai trên sổ của người khác. **Không làm:** bỏ JSON sang văn xuôi như
superpowers (mất `id` và `supersedes` là mất chính khả năng lật lại sau nhiều tháng);
thêm trường thứ tư (ba câu là đủ cho một phút đọc). Hồ sơ: `_acceptance/mot-so-ba-ve/`.
