---
slug: rang-phep-do-viec-cua-anh
at: 2026-08-11T00:16:40Z
verdict: findings
p0: 1
p1: 3
p2: 1
---

# Gap-probe: rang-phep-do-viec-cua-anh

Critic context sạch (subagent tươi), input: contract + evals + spec gốc
(review-findings round 3 của khoi-viec-cua-anh) + thân P188/P189 hiện tại +
bố cục bản luật. Toàn bộ finding là lỗ đo-lường trong phạm vi đã chốt; không
lật quyết định nào. Định đoạt one-pass: cả 5 sửa thẳng vào contract/evals
trước Cổng 1; hai giả định của critic (plugins/ không có gói feature-loop;
layout pre-3caee05) đã đối chiếu bằng vật thật (ls plugins/ + git show
3caee05) trước khi nhận.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | evals E1+E2 | Mọi needle E1/E2 khai ban đầu («PASS: P189», «thieu luat chi-bao», «cam cau tu tu») ĐÃ có sẵn trong stdout hôm nay — mutant replace-toàn-cục cũ đột biến CẢ luật LẪN clause nên checker cũ vẫn đỏ; eval không phân biệt được bản-vá với bản-hiện-tại | Thi công chỉ thêm print + giữ mutant cũ → E1/E2 xanh mà vùng đo y nguyên, lỗ round 3 còn nguyên | Chạy needle trên stdout suite CHƯA vá: tất cả match → eval không răng | fixed: E1 ghim dòng sanity quan hệ "SANITY-CO-LAP-LUAT-*: clause con nguyen trong ban dot bien" (assert rút-clause-qua-marker trên bản đột biến); E2 ghim "CO-LAP-CLAUSE-OK: marker … da vang …" — cả hai chuỗi chưa tồn tại trong stdout trước vá |
| P1 | contract AC-4 + evals E4 | Đối chứng dương ghim số SAI: khai «8 lần xuất hiện» trong khi cây thật có 10 ở 6 site nguồn (+5 bản suy ra = 15) | Assert count==8 đỏ oan trên cây thật, hoặc đếm động in 10 mà lời khai hợp đồng không kiểm được | grep anchor trên 6 site = 10 | fixed: AC-4/E4 sửa thành 10 nguồn + 5 suy ra (15 lượt kiểm); E7 in số bản từng site làm vết |
| P1 | contract AC-4 + evals E4 | Mutant ranh-giới-câu không ghim vào HÌNH DẠNG 3caee05 thật (clause DÒNG RIÊNG giữa hai nửa câu «the verdict + hook»/«are unchanged.»), và «đầu khối» không định nghĩa — nếu hiểu đầu-khối = đầu-dòng thì hình dạng lịch sử xanh vĩnh viễn | Implementer dựng mutant chèn-giữa-dòng rẻ hơn → luật yếu vẫn bắt mutant đó → E4 xanh mà lỗ lịch sử chưa vá | Dựng lại layout pre-3caee05 rồi hỏi luật có đỏ không | fixed: AC-4/E4 ghim mutant = tái tạo đích danh layout pre-3caee05; đầu-khối := đầu file / dòng liền trước là dòng TRẮNG |
| P1 | evals E5 | «git diff xác nhận không đổi» không ghim BASE — sau commit thi công, diff working-tree rỗng → chốt xanh chân không | Lỡ sửa gate-card.js/clause rồi commit → E5 vẫn xanh, điều-kiện-DỪNG của đề bài bị vi phạm không ai thấy | Sửa 1 byte + commit rồi chạy đúng lệnh cũ — không đỏ | fixed: tách E7 script no-vat-that-drift.sh so với origin/main tường minh (byte-equal khuôn+clause qua git show, chỗ đặt theo số dòng, diff name-only); E7 đã khai sinh: đối chứng dương xanh + phá-thử dịch-1-dòng đỏ đúng "cho dat clause DOI ([90] -> [91])" |
| P2 | contract AC-3 + evals E3 | Bẫy PAIR-hai-cha: plugins/acceptance-gate/skills/acceptance/SKILL.md là bản suy ra của CẢ skills/acceptance/ LẪN codex/.../acceptance/ (cùng đuôi) — chọn nạn nhân skills/acceptance làm thieu_ban kêu → sanity «luật cũ im» đỏ → cám dỗ nới sanity (hạ thước) | Sanity đỏ liên tục → nới sanity thay vì đổi nạn nhân | Chạy thieu_ban trên đột biến skills/acceptance: PAIR trỏ cha codex (2) > 1 → kêu | fixed: E3 ghim nạn nhân feature-loop/skills/feature-loop/SKILL.md (0 bản suy ra dưới plugins/ — đã ls xác nhận không có gói feature-loop Claude) + CẤM nới sanity |

Các hướng đã soi không thấy lỗ (critic kiểm bằng vật): format manifest
`<path> <số>` an toàn với parser split()+endswith(".md"); P188 là reader duy
nhất của GATE-INVITE-SITES; codex/ không mang bản chép human-facing-language
nên AC-6 phủ đủ; mọi chiều đỏ chạy trên bản sao/chuỗi in-memory; luật ranh
giới (với định nghĩa đầu-khối đã chốt) không đỏ oan trên cả 10+5 lần xuất
hiện thật — đối chiếu từng ngữ cảnh, kể cả 2 lần giữa-dòng trong feature-loop
SKILL.md (trước kết «.», sau mở chữ hoa «Đính»).
