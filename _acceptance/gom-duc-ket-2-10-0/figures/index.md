# Hình tại điểm quyết định — Cổng Phạm vi gom-duc-ket-2-10-0

| Điểm | Đếm (ngưỡng N5: ≥3 bước nối tiếp hoặc ≥2 nhánh rẽ) | Hình |
|---|---|---|
| K4 luật stale theo paths (sổ: một eval thiếu paths → luật cũ; thiếu node/lib → luật cũ) | 3 nhánh rẽ (đủ paths · thiếu paths · thiếu node/lib) × 2 loại file đổi | cần hình: `stale-theo-paths` |
| K7 triage theo tác hại (máy tính inPaths → agent phán harm → máy nâng inContract → thẻ xếp) | 4 bước nối tiếp + 2 nhánh (behavior/measure) | cần hình: `triage-tac-hai` |
| K2 bậc thang danh tính mới (--as → cổng trước cùng người → git config → approvers một tên → CẠN hỏi) | 5 nấc nối tiếp | cần hình: `bac-thang-danh-tinh` |
| K6 dòng lượt-gọi-người đếm tay | 1 nhánh | dưới ngưỡng: 1 |
| Gộp một hợp đồng thay vì tách | 2 nhánh nhưng đã quyết bởi owner | dưới ngưỡng: quyết định người, không phải máy |
| Bỏ brainstorm Q&A | 1 nhánh | dưới ngưỡng: 1 |

## Đề bài từng hình (≤5 dòng)

### stale-theo-paths (flowchart)
Nút: «file đổi sau verified_commit» → «trong _acceptance/ hoặc t1?» (có → bỏ qua) → «hồ sơ đủ paths ở MỌI eval máy/ui? (node+lib có?)» (không → luật cũ: mọi file còn lại = stale) (có → «file khớp ∪paths?» có → STALE · không → không stale). Nhãn bằng chữ; AC-6.

### triage-tac-hai (flowchart)
Nút: finding thật → máy tính «file ∈ ∪paths?» → agent phán «harm: behavior | measure» → nếu behavior ∧ inPaths → inContract=true, acRef = criterion eval khớp → vòng VÁ; ngược lại luật cũ (AC đích danh → vá; không → Ngoài hợp đồng, thẻ xếp behavior trước measure). AC-9.

### bac-thang-danh-tinh (flowchart dọc, 5 nấc)
`--as` → cổng trước cùng hồ sơ (chỉ khi tác giả commit approved_by == git user.name) → `git config user.name` → `signoff.approvers` đúng một tên → CẠN: hỏi một câu. Mọi nấc có tên → GHI THẲNG + một dòng «với danh tính … (từ <nguồn>)», người sửa bằng một câu. AC-4.
