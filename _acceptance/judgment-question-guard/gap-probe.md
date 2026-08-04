---
slug: judgment-question-guard
at: 2026-08-04T12:05:00Z
verdict: findings
p0: 2
p1: 2
p2: 1
claims_input: ok
---

# Phản biện context sạch — judgment-question-guard

Critic fresh-context, 5 input (design · contract · evals · decisions · claims
xuyên feature). One-pass: sửa artifact xong KHÔNG probe lại.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract | Trục D chỉ phủ nhánh HỎNG-KHUÔN (AC-5/6/7). Nhánh thứ hai của quyết định hai-mức — judgment `inputs` vắng/rỗng → UNCERTAIN cơ học (AC-9) — không AC nào bắt nó sống qua 3 cửa hậu. AC-9 chỉ mô tả đường fan-out tươi. | Người làm cài guard theo lối tự nhiên nhất: eval đã có panel trong `carriedPanels` thì bỏ qua vòng chèn UNCERTAIN vì "đã có panel rồi". Mọi eval xanh — E5 chỉ thử carried với eval hỏng khuôn, E9 chỉ thử fan-out tươi. Kết quả: judgment eval `inputs: []` đã ăn panel PASS 3/3 giả round trước sẽ carry nguyên PASS sang round sau, không bao giờ bị nhìn lại — ĐÚNG kịch bản E6 motion-floor mà feature này sinh ra để đóng. | AC-9b: nhánh UNCERTAIN phải sống qua carriedPanels + dryRun; panel carried KHÔNG ghi đè; đối chứng dương `inputs` có phần tử thật → carried dùng lại nguyên vẹn. | **fixed:** thêm AC-13 + eval E14 |
| P0 | design + contract | Đường đọc-cũ chỉ mở cho ĐÚNG MỘT field (`inputs`); 7 field còn lại BLOCK cứng, mà khảo sát tồn kho chỉ có cho `question`. Không AC nào chạy evals THẬT của workspace đã ký qua guard. Chính Notes thừa nhận diff stale-cascade TOÀN BỘ workspace cũ → mọi workspace sẽ bị re-verify qua guard mới. Lý do MỚI ngoài cột impact của ledger: cột đó chỉ cân nhắc gate-card-ac-visibility và riêng `inputs`, chưa cân nhắc phơi nhiễm do stale-cascade toàn bộ tồn kho. | Guard đòi `expected` non-blank mọi ui-check, `criterion` non-blank mọi eval. Mọi eval xanh vì fixture test tự dựng đủ field. Sang S5, chiến dịch re-verify hàng loạt biến mọi workspace cũ thiếu một field thành BLOCKED — bắt migrate hàng loạt dưới chân feature đã ký, đúng thứ bất biến "đổi schema phải có đường đọc-cũ" cấm. | AC tồn kho: cho TẤT CẢ `_acceptance/*/evals.yaml` thật đi qua đúng bảng field của guard; hoặc 0 ca BLOCKED, hoặc mỗi ca đỏ phải khai miễn trừ tường minh. | **fixed:** ĐO NGAY tại S1 trước khi trình cổng — kết quả 0 ca block cứng / 2 ca hạ UNCERTAIN (đúng E11+E12 gate-card-ac-visibility đã biết), tức phơi nhiễm thật = 0. Rồi biến chính phép đo đó thành AC-14 + eval E15 làm guard thường trực, đọc bảng field qua marker chứ không chép tay |
| P1 | contract + evals | AC-10 chốt tính CHÍNH DANH của fixture ("dump `calls[].prompt`, không chép tay") bằng câu chữ trong AC, không bằng phép đo máy nào. Không eval nào ghim `evidence/judge-prompt.txt` được SINH trong chính lần chạy. | Người làm chép tay một prompt lý tưởng vào file đó, hoặc dump một lần rồi sau còn sửa chuỗi prompt trong script mà không dump lại. Hội đồng E10 đọc file, thấy câu "chỉ đọc input đã liệt kê" nên PASS. Không phép đo máy nào chạm file, mọi eval xanh, mà prompt THẬT vẫn để ngỏ đường tự cứu — hình dạng (2) trong 4 hình dạng đã dẫm ghi ở CLAUDE.md. | Eval máy: xoá file trước khi chạy, chạy script qua harness, assert file tồn tại và BẰNG ĐÚNG prompt judge của chính lần chạy; đột biến: đổi chuỗi prompt trong bản sao code-sinh → nội dung dump phải đổi theo. | **fixed:** thêm AC-15 + eval E16 |
| P1 | design + contract | Thiết kế đòi return BLOCKED cùng shape với guard args ở `:55` để routing skill chạy nguyên vẹn — nhưng không AC nào đo shape đó. Mọi Then của AC-1..AC-8 dừng ở `verdict` và `blocked[].reason` bên trong script. | Người làm return gọn `{ verdict, blocked }`. E1-E8 xanh vì chỉ đọc hai key đó. Nhưng downstream đọc tiếp `panels`/`failedEvals`/`failedCommands` để định tuyến: nhánh BLOCKED ném lỗi hoặc dựng trang trông sạch cho một lần chạy chưa verify gì. | Siết Then AC-1: assert đối tượng trả về có ĐỦ key của shape `:55` đúng kiểu. | **fixed:** siết AC-1 (thêm vế shape) + expected của E1 |
| P2 | contract + evals | Thước AC-8 khai bằng ĐẾM trên không gian id có tiền tố lồng nhau (E1 ⊂ E11/E12/E13). Đếm không phân biệt được tập nào. | Guard gom lỗi theo nhóm executor rồi chỉ nêu eval đầu mỗi nhóm: bộ hỏng {E1, E11} mà reason chỉ nêu E11. Assert đếm bằng substring thấy "E1" (khớp bên trong "E11") và "E11" → 2 == 2, E8 XANH, trong khi lời hứa "sửa một lượt" bị vi phạm ngay ca đầu. | Đổi Then từ ĐẾM sang BẰNG TẬP, trích id theo ranh giới token; ca đo cố ý dùng cặp id lồng tiền tố để phép đo tự chứng minh nó phân biệt được. | **fixed:** viết lại AC-8 (bằng tập + ranh giới token + cặp E1/E11) + expected của E8 |

## Ghi chú

Cả 5 finding được sửa thẳng vào artifact, 0 finding đẩy `human-gate1`. P0 thứ
hai được xử bằng cách ĐO tồn kho thật ngay tại S1 (`inventory-probe.mjs`) thay
vì chỉ thêm một AC hứa sẽ đo — kết quả 0 phơi nhiễm, và phép đo trở thành AC
thường trực để lần sửa bảng field sau không âm thầm mở lại lỗ.
