---
slug: kho-tri-thuc-va-lint
at: 2026-10-24T03:40:00Z
verdict: findings
p0: 0
p1: 4
p2: 1
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design | Thiết kế tự mâu thuẫn về cách giải đường kho riêng; AC-2 chỉ đo bằng nhau | Giải ra ~/crm-onehub-nguon sai chỗ mà KT-2 vẫn xanh | Ghim giá trị tuyệt đối, worktree lồng sâu | fixed: design giải bằng resolve(gốc checkout chính, duong); AC-2 và E2 ghim realpath, worktree .claude/worktrees/x |
| P1 | contract | Mã lỗi nhiều vế mà ma trận mỗi mã một vế; chiều đỏ KT-3 không ghim mã | Chỉ cài vế băm lệch, tệp raw thiếu dòng vẫn xanh | Ma trận theo vế, mutant theo vế | fixed: AC-4 mười một hàng theo vế, AC-5 mười một mutant, E3 ghim trang-thieu-nguon |
| P1 | design | ma-khong-co-trang không định nghĩa cách đọc bản phạm vi; fixture viết tay | Bản phạm vi thật khác khuôn, lint im mãi | Dùng bộ đọc docPhamVi của cat-luot; fixture là bản sao bản phạm vi thật | fixed: design dùng docPhamVi, nối qua dot, hai lối --pham-vi và tự dò; AC-4 dùng bản sao pham-vi-tri-thuc-2410 |
| P1 | evals | Không eval chạy trọn suite plugins dù thêm gói thứ sáu vào marketplace | Khối khác duyệt marketplace đỏ, lộ ra ở lần cắt số | Chạy trọn suite plugins | fixed: AC-10 trọn suite, thêm E10b executors.test.plugins |
| P2 | evals | Chiều im AC-8 đo trên kho không khối, không chứng thước đỏ được | product-map require tri-thuc, kho chép thiếu tệp chết | Bản sao xoá tệp tri thức + mutant chèn require | fixed: AC-8 và E8 chạy trên bản sao đã xoá tệp, mutant chèn require |
