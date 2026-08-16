# Chữ ký Cổng 2 là QUYẾT ĐỊNH ghi trong hồ sơ; provenance lấy từ forge

Từ 2026-08-16 kit **gỡ lớp chứng-minh-chữ-ký-bằng-lịch-sử-commit**: hai khoá
`signoff.require_human_commit` và `signoff.agent_authors` hết hiệu lực (còn
khai thì pre-merge nhắc một dòng, không chặn), nghi thức «chữ ký phải nằm
commit riêng chỉ-trường-người» biến khỏi `/signoff`, SKILL, GUIDE, README,
QUICKSTART và scaffold. Chữ ký nay là điều **người phát ngôn** («Ký» / «Trả
lại»), máy ghi hộ vào `evidence-report.md` rồi commit một lượt như mọi commit
khác; **ai chịu trách nhiệm thì đọc ở forge** — người approve / bấm merge PR —
và lưới trước-merge in một dòng «chữ ký mới trong diff — `<tên> <ngày>`» khi
chữ ký xuất hiện lần đầu trong diff PR, để chỗ đó không vô hình với người
merge. Ba lớp còn lại KHÔNG đổi: khoảnh khắc ký khi có đánh-đổi/khó-đảo, nội
dung chữ ký phải thật (khác rỗng, không giữ-chỗ — chốt `placeholder_signoff`
nguyên vẹn), và khoá model-invocation không cho máy tự gọi lệnh cổng (ADR
0002). **Khó đảo:** đội đã quen nghi thức và niềm tin «chữ ký có chuỗi chứng
cứ git» khó dựng lại sau khi gỡ. **Gây bất ngờ:** một người đọc lịch sử repo
sẽ thấy chữ ký nằm chung commit với thân báo cáo — trước đây là VIOLATION.
**Trade-off thật:** mất chuỗi chứng cứ trong git, đổi lấy provenance của forge
(không giả được, không vỡ vì squash) cộng một dòng NOTE đọc trong một giây;
điều kiện để vế «forge» đúng là repo nhiều người phải bật require-approval —
repo một người thì người bấm merge chính là người chịu trách nhiệm, và đó vẫn
đúng nghĩa. Vì sao gỡ: lớp ấy xác thực *ai gõ chuỗi*, không xác thực *quyết
định có đúng*; mối đe doạ nó chặn (máy giả chữ ký người) chưa từng xảy ra
trong sổ vấp, trong khi phí thì đã trả nhiều lần — squash-merge giết hạt commit
và chặn MỌI PR (sự cố thật 10/08), bản-đồ-sau-chữ-ký lặp hai lần, ký ba lượt ở
chip ③, và một hồ sơ T3 «đường-rửa-chữ-ký» phải xếp hàng chỉ để bảo trì chính
nghi thức này. Bản dài + hình: `docs/plans/2026-08-16-hat-giong-go-lop-chung-minh-chu-ky.md`
· `_acceptance/cong-chan-nham-cho/figures/02-chu-ky-hai-lop.html`.
