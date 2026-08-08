---
slug: consumer-copy-cjs
at: 2026-08-08T15:22:51Z
verdict: findings
p0: 0
p1: 3
p2: 3
---

# Phản biện context sạch — consumer-copy-cjs

Bộ AC này tốt hơn mặt bằng chung rõ rệt: chiều đỏ có đối chứng dương (AC-4/CE7),
sanity counter được ghim tường minh ở E6/E7/E8, và AC-5 đo QUAN HỆ thay vì danh
sách cứng. Không có lỗ nào ở mức merge-là-false-green-mới (P0 = 0). Nhưng có ba
lỗ P1 cùng một mẫu: **lời hứa mạnh nhất của bộ này lại đứng trên chân yếu nhất**
— vế phá-vật của AC-5 chỉ chạy tay một lần, 2/3 luật chỉ được chứng minh NẠP
được chứ chưa chứng minh CHẤM thật ở consumer, và giả định "plugin cache không
có `type`" là khẳng định không thước. Tất cả đều có lớp đỡ khác nên không chặn
merge, nhưng phải có disposition trước Cổng 1.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals.yaml E5 / AC-5 | Sanity floor cho **tập-dùng** không được ghim (chỉ ghim ≥7 cho tập-khai CE1), và vế phá-vật "xoá mục → ĐỎ" chỉ **chạy tay 2026-08-08**, không nằm trong lần chạy nào — trái luật "fixture do code sinh trong chính lần chạy" | Extractor tập-dùng hỏng (grep chỉ bắt `require(` mà bỏ lối `node <lib>` shell-invoke, hoặc path sai) → tập-dùng = ∅ → ∅ ⊆ tập-khai luôn xanh; lần sau thêm file chép mới mà quên khai, CE2 vẫn xanh — đúng lại bug gốc gap-probe.js. Lớp đỡ còn lại: CE5 in NOT ENFORCED trong sim | Hỏi: "nếu tôi làm rỗng tập-dùng, CE2 có đỏ không?" — hiện tại theo artifact là KHÔNG | **fixed** (cùng ngày): CE2m mutant chạy TRONG mỗi lần chạy (bỏ lib/gap-probe.cjs khỏi tập-khai → quan hệ đỏ ghim tên); sanity tập-dùng đã có sẵn (used.size ≥ 7 trong CE2) |
| P1 | contract.md AC-2 / evals E2 | Trong 3 luật vendored, chỉ **recheck** có vế should-FIRE ở consumer (AC-3). `gap-probe` và `ac-line` chỉ được chứng minh **nạp được** (.cjs load, không ReferenceError) — chưa chứng minh **chấm thật** trong repo ESM. `rules ran=3` là self-report từ vựng của chính pre-merge | Một luật load xong nhưng mis-grade trong môi trường consumer (đường dẫn tương đối, cwd khác xưởng) → in `ran=3`, không NOT ENFORCED, mọi eval xanh — "chết-mà-im" phiên bản mềm, đúng lớp AC-3 tự cảnh báo | Nghi thức CLAUDE.md: phá vật thật trong bản sao — tiêm một vi phạm gap-probe/ac-line vào sim, luật có đỏ đúng thông điệp không? Chưa AC nào hỏi câu này | **fixed** (cùng ngày): CE5b — xoá gap-probe.md trong sim → pre-merge (required) exit 1 + VIOLATION đúng thông điệp, chứng minh luật vendored CẮN ở consumer chứ không chỉ NẠP |
| P1 | contract.md Notes + decisions d-ccc2 | Quyết định giữ `.js` cho hooks + 5 scripts đứng trên khẳng định "chạy trong cây kit / plugin cache, nơi không có `package.json` khai `type`" — **không phép đo nào kiểm khẳng định này**, và d-ccc2 chỉ đỡ nhánh "sau này thêm vào danh sách chép" | Consumer cài plugin repo-local (kit tự-host chính là mẫu này) hoặc cache nằm dưới một cây có `type: module` → `hooks/acceptance-evidence-gate.js` chết ReferenceError câm lặng — chính xác lớp lỗi bug này sinh ra để giết, và không AC nào đỏ | Đo một lần: file .js trong nhóm giữ-đuôi có nằm dưới package.json khai `type` ở bất kỳ layout cài đặt được hỗ trợ nào không | **known-limit + revisit** (entry d-20260808T1210Z-ccc3): hook không nằm trong danh sách chép, đo cache-layout ngoài phạm vi bugfix đóng băng; rủi ro ghi lại cho owner quyết ở vòng sau |
| P2 | evals E1/E3 | Nguồn gốc "hồ sơ lành" không ghim: nếu evidence-report fixture **viết tay theo khuôn reader** thì rơi lớp writer/reader drift (bài học s4-scope-triage #2/#3) | Fixture tay lệch khỏi khuôn writer thật → recheck exit ≠ 0 vì schema chứ không vì module → chủ yếu rủi ro đỏ-oan, false-green khó xảy ra nên chỉ P2 | Fixture phải sinh từ writer thật hoặc chép từ workspace đã ký, có ghi rõ trong expected | **accepted-P2**: fixture do code test sinh trong lần chạy; chiều đỏ-oan tự lộ (CE3 fail nếu khuôn lệch reader) — không thêm cơ chế dưới lệnh đóng băng |
| P2 | contract.md Coverage trục `type` | Trục khai 2 giá trị nhưng thực chạy 2/3: `module` (sim) và **vắng** (cây kit); `"type": "commonjs"` tường minh không chạy ở đâu | `.cjs` an toàn về mặt spec Node ở cả 3 giá trị nên rủi ro rất thấp — ghi để trục Coverage khớp thực tế đo | Một dòng trong sim đổi type=commonjs rồi chạy lại CE3 là đóng trục | **accepted-P2**: spec Node coi vắng-type ≡ commonjs cho .js; ca vắng-type (cây kit, 4 suite) đại diện đủ; sửa chữ Coverage nếu owner muốn ở Gate 1 |
| P2 | contract.md Out-of-scope (floorplanstudio 766634b) + AC-9 | Lời hứa "ghi nhắc trong báo cáo" cho floorplanstudio không có AC nào cưỡng chế; và E9 nói "7 manifest" nhưng không nói rõ có **marketplace.json** — kênh mà `plugin update` của đội thật sự đọc — hay không | Merge xong quên nhắc → floorplanstudio nhận 1.39.1 đè lên bản vá cục bộ .cjs của họ, xung đột câm; hoặc 7 manifest bump mà marketplace không bump → đội không thấy update. Lớp đỡ: E13 (P04/P22/P181) | Đối chiếu danh sách 7 manifest trong checks/manifest-bump.sh với tập file `plugin update` đọc | **accepted-P2**: nhắc parity floorplanstudio nằm ở báo cáo cuối phiên + mục 2 handoff; cưỡng chế thuộc repo tiêu thụ, ngoài quyền kho kit |
