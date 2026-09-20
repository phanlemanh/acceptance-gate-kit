---
slug: ghim-lai-noi-ra-o-khong-do
at: 2026-09-20T08:20:00Z
verdict: findings
p0: 2
p1: 2
p2: 1
claims_input: ok
---

# Phản biện context sạch — ghim-lai-noi-ra-o-khong-do

**Lượt 2 (sau khi owner trả lại ở Cổng Bằng chứng và yêu cầu nâng phạm vi).**
Critic context sạch, đọc 5 input (contract · evals · design §7 · decisions · tệp ca —
tệp ca được đọc vì AC-10 nói về chính nó). One-pass: mọi finding sửa thẳng vào artifact.

Lượt 1 (0 P0 · 4 P1 · 1 P2) ở `git show` của commit hồ sơ Cổng Phạm vi đầu tiên; cả năm
đã sửa và không lặp lại ở lượt này.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | test | AC-10/GN13 đo RESIDUE sau một lượt chạy trọn vẹn, không đo HÀNH VI GHI; mutant chỉ tái lập biến thể DỄ (khôi phục `bak + '\n'`, lệch byte) chứ không phải lớp thật owner trả lại (`finally write(X, bak)` khôi phục Y HỆT) | Giữ nguyên lối bị cấm trong judge GN05 → `git status` trước/sau giống hệt → GN13 in PASS. Hai đường hỏng contract nêu (đua với E12 chạy song song; `finally` không chạy khi bị giết) không xảy ra trong lượt GN13 tự chạy, nên phép đo không bao giờ quan sát được lớp lỗi | Chụp (sha256, size, mtime_ns) mọi tệp nguồn mutant với tới, so trước/sau — mtime bắt được cả khôi phục y hệt. Mutant BẮT BUỘC là hình dạng khôi-phục-y-hệt và phải ĐỎ | fixed: GN13 viết lại — `chupNguon`/`soChupNguon` theo bộ ba băm+size+mtime; mutant nay là `finally write(GUIDE, bak)` y hệt, đã chứng ĐỎ |
| P0 | test | `GNRO_SKIP_MUTANTS` đọc thẳng env, không bắt tay, không tag kết quả, không đổi mã thoát; `GNRO_ROOT` cho trỏ phép đo sang cây khác | Xuất `GNRO_SKIP_MUTANTS=1` ở khoá executor/CI/tiến trình cha → 13/13 in PASS, thoát 0, 0 mutant chạy, mọi eval vẫn khớp ghim «đúng một dòng mang GNxx». GN13 nặng hơn: con kế thừa env nên ba ca không tiêm gì, cây dĩ nhiên không đổi, AC-10 xanh mà chưa đo gì | Chỉ bỏ chiều đỏ khi có bắt tay nội bộ do chính tệp ca đặt; lượt bỏ chiều đỏ nối hậu tố `[KHONG CHIEU DO]` và thoát khác 0 | fixed: hằng `BAT_TAY` nội bộ; env sai giá trị → in câu có tên và thoát 3; lượt bỏ chiều đỏ luôn thoát 1 + hậu tố trên dòng kết quả |
| P1 | test | `git status --porcelain` chỉ trả mã trạng thái nên phép so phụ thuộc cây sạch/bẩn; nhánh khôi phục dùng `git checkout --` trên cả nhóm | Chạy khi `GUIDE.md` đang sửa dở (trạng thái thường trực của chính vòng này): mutant ghi rồi khôi phục lệch → trước và sau đều ` M GUIDE.md` → GN13 XANH và cây bị bỏ hỏng. Chiều ngược: `git checkout` cả nhóm XOÁ sửa đổi chưa commit của người đang làm | So bằng băm nội dung (độc lập trạng thái git, đo được trên cây bẩn); khôi phục chỉ ghi lại đúng tệp thực sự đổi từ bản đã chụp | fixed: cùng bản vá P0-1 — so băm, và khôi phục ghi lại từ `ref.noiDung` đúng tệp bị chạm, không `git checkout` nhóm |
| P1 | contract | AC-8 đặt đối chứng dương trên fixture `[ui]` nhưng phép so chiều im chạy trên fixture `[api]` mà không vế nào đòi vế đó khác 0 | `parseACs` chỉ nhận id `AC-<số>`, mà ma trận dùng id chữ → mọi W im → `nay = cu = 0`: phép so chiều im lại là hằng đúng theo cách khác, trong khi `demUi > 0` vẫn xanh nên không cảnh báo nào nổ | Dựng fixture `[api]` sao cho bản mốc in ≥1 dòng rồi khẳng định `cu > 0`, không thì ĐỎ ghim «phep so chieu im khong co luc» | fixed: fixture `[api]` nay mang một tiêu chí NGƯỠNG id số (`AC-1`, `< 200ms`) không có ca dưới-ngưỡng → W1 nổ; ca đòi `cu > 0`. Vế «hai hồ sơ phải khác số» của bản trước đã GỠ — nó ngẫu nhiên, kêu oan khi hai bên tình cờ cùng số |
| P2 | contract | AC-10 khoá cứng ba ca và năm đường dẫn; tệp ca, `carry-plan.mjs`, `lib/*.cjs` nằm ngoài tầm canh | Thêm ca GN14 hoặc mutant mới ghi vào `lib/evidence-core.cjs`: GN13 xanh vĩnh viễn vì tệp/ca ấy không có trong danh sách — đúng lớp «đừng ghim con số thành danh sách đóng» của CLAUDE.md | Suy danh sách ca từ vật (`CASES.filter(c => c.mutants?.length && c.id !== 'GN13')`); canh mọi tệp git-theo-dõi dưới `scripts/`, `lib/`, `feature-loop/`, `tests/` và `GUIDE.md` | fixed: cả hai danh sách nay SUY TỪ VẬT — ca từ `CASES`, tệp từ `git ls-files` trên năm vùng nguồn |
