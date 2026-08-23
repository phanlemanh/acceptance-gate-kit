# Review findings — lenh-in-ra-phai-bam-duoc (S4 round 1, một reviewer tươi trên diff `origin/main..HEAD`)

## Trong hợp đồng

- **`/uat-session <slug>` (gạch chéo, không tiền tố) lọt cả hai regex của LB2** · severity: medium · AC-2
  → **Đã sửa cùng round:** `uat-session` vào `BARE_NAMES`; look-ahead thêm `.` (không ăn `…/uat-session.md`); ca chèn `/uat-session <slug>` → đỏ.
- **`naReason` nuốt Analyst hỗn hợp «n-a …; E4, E5: baseline cũng xanh»** · severity: medium · AC-4
  → **Đã sửa cùng round:** phần sau `n-a` có mệnh đề mở bằng mã eval (`[;\n]\s*[A-Z]{1,3}\d+`) → là phân tích thật → đỏ như cũ; LB4 ghim ca (c').
- **AC-4 trạng thái (c) rỗng/vắng section không có ca đo** · severity: low · AC-4 → **Đã sửa:** LB4 thêm `run('')` và evidence không có `## Analyst`.
- **Contract nói «12 file», thước quét 13** · severity: low · AC-2 → **Đã sửa:** 13 ở contract/evals/message; `FILES.length === 13` assert.

## Ngoài hợp đồng — người quyết ở Gate 2

- **QUICKSTART/README/GUIDE còn 45 token trần — mặt người đầu tiên owner chép** (QUICKSTART 11 · README 14 · GUIDE 20)
  Người dùng thấy gì: đây chính là chỗ gõ lệnh đầu tiên (`/acceptance-init`, `/start`, `/feature-loop <mô tả>` ở QUICKSTART) rồi thấy «không bấm được».
  severity: medium · ngoài hợp đồng (AC-2 khai danh sách 13 file; ba file gốc không nằm trong — cùng lớp AC-7b chip A: vũ trụ là danh sách, không phải «mọi tài liệu»).
  Đề xuất: hồ sơ kế thêm 3 file vào `FILES` (đối chứng dương đổi số → khai ở sổ). **Máy khuyên làm ngay sau chữ ký** — rẻ (regex đã có), và là mặt người đầu tiên.
- **«ở cả hai harness» nay sai nghĩa** (`skills/uat-session/SKILL.md:100`) · severity: low — Codex đã lưu kho (ADR 0008); «bốn thân (…) ở cả hai harness» → «hai thân».
- **Câu nói với MÁY dùng dạng slash của người** (`feature-loop SKILL:103,219` «invoke `/acceptance-gate:acceptance-card`») · severity: low — Skill tool nhận `acceptance-gate:acceptance-card` không gạch; bản cũ còn xa tên tool hơn, model vẫn bỏ gạch. Nếu muốn chặt: câu invoke dùng tên không gạch, câu in cho người dùng cột bảng.

## Đã kiểm thấy đúng (reviewer)

- Đọc đủ 65 chỗ đổi: không câu nào đổi nghĩa; khối GATE-ONESHOT-CLAUSE khớp 6/6 site.
- LB2 đối chứng dương đo cùng hàm, chỉ đổi `readFn`; đếm độc lập từng file trên origin/main ra đúng 65.
- LB5 so tập chữ sau khi lột tag, cùng `esc` hai bản; đối chứng dương baseline=3 + glossary=1 có thật.
- Toàn suite plugins trên nhánh xanh; 26 literal thước cũ trong run-tests.sh không đụng file đã đổi.
