---
slug: nhay-don-nhan-doi
at: 2026-10-17T22:58:00Z
verdict: findings
p0: 0
p1: 2
p2: 3
---

# Gap-probe — nhay-don-nhan-doi

Phản biện context sạch, một lượt, tác tử tươi chỉ đọc design + contract + evals + sổ quyết định + bài học xuyên
feature (claim-scan). Sửa xong artifact không probe lại.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | contract | AC-5 không nói lệnh eval đi qua `cmd: config:<khoá>` rồi tới `config.yaml` — đúng đường repin-lane:255 gây E9=2 | Fixture ghi scalar thẳng vào `cmd:` của evals.yaml → hoặc đi đường parseEvals đã descope (127, AC-5 không bao giờ xanh), hoặc xanh mà nhánh `config:` của làn chưa từng chạy đầu-cuối | AC-5/E5: eval `cmd: config:executors.script.<khoá>`, khoá mang scalar crm; khẳng định evals.yaml kho mẫu không chứa `''`; đối chứng nháy kép cùng đường | fixed: AC-5, E5 và design ghi rõ đường `config:`; thêm khẳng định evals.yaml không chứa `''` và đối chứng nháy kép cùng đường |
| P1 | evals | E7 chỉ ghim tiền tố «DO BG10x:»; không đối chứng dương ở sha lịch sử | Phần hỗ trợ `e.yaml` hay s4-args nằm ở commit vá → ở sha commit ca BG10d/e đỏ vì hạ tầng, E7 đọc thành «đỏ vì vật» — xanh giả lời hứa TDD | Ghim đủ thông điệp vật từng chân; đối chứng nháy kép XANH ở sha lịch sử; khẳng định fixture ở sha đó đã nhận `e.yaml` | fixed: AC-6/E7 bốn khẳng định ở sha lịch sử (chưa vá · fixture có e.yaml · ghim vật đủ ba chân và vắng ghim hạ tầng · HEAD xanh); mỗi chân khứ hồi chạy đối chứng nháy kép trước với thông điệp hạ tầng riêng; fixture đi cùng commit ca |
| P2 | design | Bán kính chỉ grep 16 config.yaml trong khi cổng chung còn phục vụ frontmatter, carry-plan, evalListsOf | Một kho có frontmatter/cmd nháy đơn mang `''` đổi phán quyết sau khi nâng mốc mà vật không đổi (ngưỡng B9) | Grep mở rộng sang `_acceptance/**` của 16 kho, ghi lệnh + số | fixed: đo lại trên mọi `*.md`/`*.yaml` dưới `_acceptance/**` — 20 `expected:` (không qua cổng) + 2 khoá config; lệnh và kết luận ghi vào design |
| P2 | design | Không phân tích bộ bóc chú thích chạy trước `unquoteScalar` xử lý `''` thế nào | Bộ bóc cắt hỏng ô `'it''s'  # ghi chu` / `'a '' # b'` → BG10a đỏ lượt đầu, phạm vi «một dòng» sai | Thêm dòng «đã rà» có căn cứ hoặc ô đo riêng | fixed: design thêm dòng — bốn hàm tiền xử lý đã hiểu `''`; đo trên mã hiện tại hai ô ra `it''s` và `a '' # b` (chỉ thiếu bước gỡ) |
| P2 | evals | E5 đo chuỗi stderr thay vì bản ghi làn mà crm đọc lại | Làn in stderr đúng nhưng ghi run-log sai → E5 xanh | Đọc dòng `kind: repin` của run-log, `evals_exit.E1 === 0` theo trường | fixed: AC-5/E5 chạy `--write` và so `evals_exit` theo trường JSON; stderr chỉ là thông tin phụ |
