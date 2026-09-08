---
slug: gom-duc-ket-2-10-0
at: 2026-09-08T14:22:16Z
verdict: findings
p0: 0
p1: 4
p2: 1
claims_input: 10 claim (advisory)
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | E8b ghim số đếm tay lên cây sống của kit (tập đổi theo mỗi hồ sơ mới); Notes cho phép sửa thước sau khi thấy số | Hồ sơ kế thêm vào _acceptance → TB dịch → E8b đỏ vì hạ tầng ở recheck-all / ghim lại; số lệch → sửa expected theo vật | loop-health --at <sha> đọc qua git show; đối chiếu chứng-một-lần tại sha cố định | fixed: AC-8(b) + E8b neo `--at 8caa9998` (tập bất biến); số tay sai chỉ được sửa kèm entry fix nêu nguyên nhân |
| P1 | evals | E5b hardcode đường dẫn máy tác giả + ba cây tiêu thụ đang giữa vòng; số nghĩa vụ 16/2/9 sống | CI/máy khác → cây vắng → exit 3 đỏ vì hạ tầng; oneflow ghim lại → số đổi → đỏ không do vật | tách: bất biến thường trực (W8-token 0 ở cây có mặt, SKIP có tên) + số đo là chứng-một-lần | fixed: AC-5(e) + E5b: --dev-root mặc định thư mục cha, SKIP có tên, chỉ ghim W8-token = 0; số nghĩa vụ/W6 chỉ IN, ghi ở bằng chứng + Notes |
| P1 | design | K4 paths tĩnh, không bắc cầu qua require/import; không khai giới hạn + ngưỡng | Hồ sơ khai paths thiếu file được require → đổi file đó → pre-merge nói tươi → bằng chứng tự dối | SP7 mở rộng một tầng require, HOẶC Known limit + câu dặn ở Staleness guard + ngưỡng | fixed: Known limit K4 ở Notes kèm ngưỡng đang đếm (≥1 hồ sơ tươi-giả → mở rộng staleScope); AC-6(f) thêm câu dặn liệt file được require |
| P1 | contract | AC-9(c) acRef số ít — nhiều eval khác criterion cùng khớp một file thì gán sai | acceptance-verify.js nằm trong paths của E3/E9/E10 → finding K8 dán nhãn AC-3, E10 không chạy lại | acRef = TẬP criterion khớp sắp theo id; W38 thêm ca hai eval | fixed: AC-9(c) + E9 (acRef "AC-1, AC-2", 8 assert) |
| P2 | contract | K3 đưa "-" vào lớp ký tự từ → ghép gạch nối tiếng Việt (check-lại, thẻ-cổng-2) làm mù W6; số ≤10 không tách nguyên nhân | Criteria viết «check-lại» → W6 im dù đúng từ Avoid; Cổng Phạm vi duyệt K3 trong khi răng mòn | allowlist định danh ASCII thay lớp ký tự; PV2 thêm chiều «vẫn phải kêu» | fixed: AC-5(b) định danh = hai bên gạch đều ASCII alnum; PV2 ba chiều (ui-check im · check-lại kêu · pre-merge khớp) |
