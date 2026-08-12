---
slug: luu-kho-codex-va-nghi-le-design
at: 2026-08-12T07:49:15Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Gap-probe: luu-kho-codex-va-nghi-le-design

Critic context sạch (subagent tươi) chạy TRƯỚC Cổng 1, đọc đúng ba input —
`contract.md` + `evals.yaml` + file bài-học xuyên feature — cấm đọc mã nguồn.
Soi theo ba hướng nguy của hồ sơ xoá vật: vật xoá mà không ai đo sự vắng, vật
giữ mà không có đối chứng giữ-gân, và tham chiếu sống sót sau khi định nghĩa đã
gỡ.

Critic xác nhận hai chỗ mạnh: ma trận needle của E4 và mảng vật của E2/E10 đều
viết trước và đếm suy từ mảng; mọi bản đột biến chép NGƯỢC từ mốc nên không có
fixture viết tay. Nhưng nó tìm ra **hai lỗ P0 đủ sức làm cả bộ xanh trong khi
vật hỏng**, và một lỗ P1 khiến **không tồn tại trạng thái cây nào cho cả bộ
xanh** — loại lỗ chỉ lộ ra khi có người đọc lại hợp đồng bằng con mắt không
dính vào lúc soạn.

Toàn bộ 5 finding định đoạt **one-pass, TRƯỚC Cổng 1**. Bốn cái nhận nguyên;
một cái nhận KẾT LUẬN nhưng bác CƠ CHẾ — ghi rõ ở dưới.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract + evals | Từ vựng MIRROR vắng khỏi lưới quét (`sync-plugin-packages`, `mirror_sync`, `plugins/`, `P30`), phạm vi quét bỏ sót `CLAUDE.md` + `.github/`, và clause cuối AC-9 ("CLAUDE.md không còn tuyên bố bất biến mirror") không nằm trong mảng của E10 lẫn eval nào khác | Gỡ `plugins/` + script sync (E10 xanh) nhưng để nguyên đoạn bất biến trong `CLAUDE.md` bắt "chạy sync và commit mirror, P30 chặn drift". 14/14 xanh, hai cổng duyệt; sau merge mọi phiên đọc `CLAUDE.md` rồi đi tìm mirror không tồn tại | Mảng needle mở lên 11 phần tử, phạm vi quét thêm CLAUDE.md và .github, mỗi needle hai chân HEAD=0 và mốc>0, đếm suy từ mảng | **fixed (pre-Gate-1):** mảng needle của AC-4 lên **11** (thêm 4 từ vựng mirror + `.agents`), phạm vi quét thêm `CLAUDE.md` + `.github/`; tách **AC-9b** + **E10b** riêng cho clause `CLAUDE.md` với đối chứng dương 4 hit ở mốc. Thêm `.agents` vì đường dẫn đó KHÔNG chứa chuỗi `codex` — needle theo tên thương hiệu mù với nó |
| P0 | evals | E7 ghim SÀN `n ≥ 671` cho suite `scripts` trong khi hồ sơ làm suite đó TEO; contract không chứa số nào (671/54/62 chỉ sống trong evals), E12 nói "trừ đúng số case P30" mà không số nào được khai | S4 đo ra ví dụ 664. E7 đỏ vì THƯỚC sai chứ không vì vật hỏng; đường thoát rẻ nhất là hạ 671 xuống số vừa đo — hạ-thước-cho-vừa-vật — và sau khi hạ, phép đo mất hẳn khả năng bắt "gỡ nhầm một thư mục test", tức mất lý do nó tồn tại | Khai cả bốn cặp số vào contract và assert ĐẲNG THỨC sau = trước trừ số assert đã đếm, đỏ ghim so-ca-lech-ky-vong | **fixed (pre-Gate-1) — nhận KẾT LUẬN, BÁC CƠ CHẾ.** Critic quy cho `tests/codex/` + `tests/design-loop/` bị tính vào suite `scripts`; kiểm trên vật cho thấy KHÔNG phải: hai thư mục đó có runner riêng. Cơ chế thật là `tests/scripts/run-tests.sh:1390-1406` gọi THẲNG hai script của `design-loop` qua **7 assert** (`DSC01-03`, `SG1-4`). Sửa theo cơ chế thật: khai cả bốn cặp số vào contract và đổi E7 sang ĐẲNG THỨC `664 = 671 − 7`. Nếu vá theo cơ chế critic nêu, con số sẽ sai và eval đỏ oan ở S4 |
| P1 | contract | AC-4 (0 hit needle) và AC-6 (10 vật giữ byte-equal mốc, "ngoại lệ: không có") phủ lên nhau mà chưa ai kiểm giao điểm rỗng; Coverage chỉ khai đã kiểm 2 trong 10 vật | Một vật giữ chứa chuỗi `design-loop` → **không tồn tại trạng thái cây nào cho cả bộ xanh**: sửa file thì E6 đỏ, giữ nguyên thì E4 đỏ. S4 kẹt vòng, lối thoát rẻ nhất là nới một AC sau khi đã thấy số — hạ thước sau chữ ký | Chạy giao điểm needle × đường-dẫn-giữ TRƯỚC Cổng 1, ghi kết quả vào Coverage cho cả 10 vật, miễn trừ nào cũng phải khai lý do từng file trước khi đo | **fixed (pre-Gate-1):** chạy đúng 6 needle trên đúng 10 đường dẫn. Giao **KHÁC RỖNG**, đúng như critic dự đoán, và phán quyết là MỘT-NỬA-MỘT-NỬA: `ux-ui-craft/SKILL.md:289` là danh từ chung ("a design-loop" = một vòng lặp thiết kế) → **miễn trừ 1 dòng**; `ux-ui-craft/references/layout-craft.md:121` là **tham chiếu SỐNG** trỏ đúng plugin và đúng `design-static-check` sắp chết → **PHẠM VI PHẢI SỬA, không phải miễn trừ**. `ux-ui-craft` ra khỏi mảng byte-equal (còn 9/9) và có chân riêng; miễn trừ kèm **E4b ĐỎ-NGOÀI-DANH-SÁCH** vì allowlist không có chân đó biến fail-loud thành fail-silent |
| P1 | contract + evals | AC-10 gọi tên hai script nhưng E11 chỉ CHẠY `product-map`; `start-scan.mjs` chỉ nằm trong `paths`, mà `paths` không phải một thao tác | Nhánh đọc Codex trong `start-scan.mjs` gỡ nửa chừng, còn một lượt đọc `.agents/plugins/marketplace.json` trên đường dẫn đã vắng. 14/14 xanh, Cổng 2 ký; lỗi chỉ nổ khi người thật gõ lệnh khởi động ở repo tiêu thụ | Thêm một eval CHẠY script thật trên cây đã gỡ và ghim đúng câu đầu ra thành công, thêm needle .agents để đo theo đường dẫn thay vì theo tên | **fixed (pre-Gate-1):** thêm **E11b** CHẠY THẬT `start-scan.mjs` và ghim đúng câu đầu ra thành công; `.agents` vào mảng needle của AC-4 để mọi lối vào vật Codex bị đo theo ĐƯỜNG DẪN, không theo tên thương hiệu |
| P1 | contract + evals | Mốc `truoc-luu-kho-2026-08` là chân duy nhất của cả lời hứa hoàn-tác lẫn MỌI đối chứng dương, nhưng không AC nào đòi đẩy nó lên remote; E1 chỉ assert quan hệ TỔ-TIÊN trong khi AC-1 hứa "commit ngay TRƯỚC" | Mốc đặt local, không push. Cả bộ xanh ở máy tác giả, ký, merge. Sau merge mốc không tồn tại trên remote: đường-đảo-rẻ biện minh cho việc xoá ~194 file không còn với ai khác; hai ADR ghim sha không ai resolve nổi; mọi lần verify lại đỏ vĩnh viễn theo chính luật fail-closed | Assert mốc có trên remote đúng sha và là cha trực tiếp của commit gỡ đầu tiên, hai chân đều đỏ-ghim-thông-điệp riêng | **fixed (pre-Gate-1):** AC-1 + E1 thêm hai chân — mốc phải có trên remote đúng sha (`git ls-remote --tags origin`, đỏ ghim "chua day len remote"), và phải là **CHA TRỰC TIẾP** của commit gỡ đầu tiên (`git rev-list` giữa hai cái phải rỗng), không nhận quan hệ tổ-tiên |

## Ghi chú của phiên thi hành

Ba điều đáng giữ lại từ vòng này:

1. **Lỗ nguy hiểm nhất không phải "thiếu một phép đo" mà là "hai lời hứa mâu
   thuẫn nhau"** — nó không đỏ ở Cổng 1, nó đỏ ở giữa S4, đúng lúc rẻ nhất là
   hạ thước. Từ nay hồ sơ nào vừa có tiêu chí XOÁ vừa có tiêu chí GIỮ trên
   cùng một cây thì phải chạy giao điểm TRƯỚC khi trình cổng.
2. **Không nhận nguyên văn phản biện.** Critic đúng kết luận P0 thứ hai nhưng
   sai cơ chế; vá theo cơ chế nó nêu thì con số sai và eval đỏ oan ở S4. Phản
   biện là đầu vào để đi kiểm trên vật, không phải phán quyết.
3. **Miễn trừ phải sinh đôi với một ca ĐỎ ngoài danh sách**, nếu không nó là
   cách yên tĩnh nhất để tắt một cái lưới.
