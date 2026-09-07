---
slug: glob-hai-sao-khop-goc-kho
at: 2026-09-07T21:05:00Z
verdict: findings
p0: 0
p1: 1
p2: 3
---

# Gap-probe — phản biện ngữ cảnh sạch (S1, one-pass)

Critic tươi, input 5 file: design doc · contract · evals · decisions · claims
xuyên feature (input 5). Không có opportunity.md (ô mở từ hồ sơ phát hiện,
owner gọi tên 08/09).

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | Vế «không đổi ngữ nghĩa» nêu đích danh `docs/**` (a3) và Coverage khai tên đích danh (a1), nhưng Core chỉ đo `*.md` (AC-6). Không AC/eval nào cho glob KHÔNG chứa `**/` đi qua bộ sinh biến thể nguyên vẹn — nửa lời hứa không có thước. | Dev tách tại `**` thay vì `**/`: `docs/**` sinh `docs/` và `docs/**/` — bash đã kiểm `case docs/a.md in docs/**/)` KHÔNG khớp. Mọi consumer dùng mặc định `docs/**` bị stale mỗi commit tài liệu — đúng bệnh vòng này chữa, đổi da. GL01–GL09 toàn xanh vì không ca nào có glob a1/a3. | GL10 cùng khuôn: `t1_skip_globs: ["docs/**", "CHANGELOG.md"]`, đổi `docs/a.md`, `docs/x/y.md`, `CHANGELOG.md` → sạch; đối chứng đỏ cùng ca: `docs2/a.md` → stale. | fixed: thêm AC-10 + E10 (GL10); Core ghim thêm ô a1·b1·c1 và a3·b2/b3·c1 |
| P2 | evals | E9 chỉ ghim 2 trong 3 mệnh đề của AC-9; thiếu mệnh đề «`*` vượt `/`» — đúng điểm ledger approach buộc «khác gitignore ở điểm đó và phải ghi vào GUIDE». | Dòng GUIDE bỏ câu `*` vượt `/` → GL09 xanh, AC-9 chưa đủ, điểm lệch gitignore không được khai. | E9 thêm mảnh thứ ba trên CÙNG hàng bảng: `*` đứng riêng đi cùng «vượt `/`»; 3 assert = 3 mệnh đề. | fixed: E9 sửa thành 3 mảnh trên cùng hàng |
| P2 | evals | E8 không ghim NGUỒN bản sao `scripts/`+`lib/` là cây đang kiểm suy từ vị trí script — hình dạng (4) đã dẫm ở s4-scope-triage (hardcode ROOT so với checkout tác giả). | Bản sao dựng từ ROOT ghim cứng trỏ worktree khác đã có fix: GL08 ba dòng PASS đủ trong khi cây đang kiểm chưa có `glob_variants`. | Dòng «PASS: GL08-src»: nguồn bản sao suy từ `$0`, `cmp` với `scripts/pre-merge-check.sh` của cây đang kiểm trước khi đột biến. | fixed: E8 thêm dòng PASS GL08-src (4 dòng) |
| P2 | design | Core khai ô a4·b1·c3 nhưng AC-7 đổi `auth/x.js` (một cấp, b2). Ô gốc-không-`/` ở nơi gọi T3 chưa có ca; nhãn ô sai. | Gate 1 tin đường dẫn gốc đã đo ở cả c1 và c3; nếu nhánh T3 có bước lọc riêng trước `match_globs`, file gốc tại T3 đi đường khác mà không ca nào đỏ. | GL07 thêm `t3_paths: ["**/auth/**", "**/Dockerfile"]` và file đổi `Dockerfile` gốc → VIOLATION T3 kèm `Dockerfile`. | fixed: AC-7/E7 thêm `Dockerfile` gốc; ô a4·b1·c3 nay có ca thật |
