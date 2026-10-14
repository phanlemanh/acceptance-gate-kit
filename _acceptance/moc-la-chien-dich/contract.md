---
schema_version: 1
feature: Mỗi vòng thuộc một mốc — lộ trình cắm cờ vàng cho việc đang mở mà chưa thuộc mốc nào, và lúc mở vòng máy in tên phiên cùng nhóm thanh bên của mốc đó
slug: moc-la-chien-dich
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/lo-trinh.mjs + feature-loop/skills/feature-loop/SKILL.md (S0) + test + lộ trình kit — không chạm lib/**, hooks/**, lưới trước-merge, dieu-phoi/
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-14-moc-la-chien-dich-design.md
status: draft
---

# Acceptance Contract: moc-la-chien-dich

## Context

Chủ kho gọi tên 14/10 (vòng sửa kit duy nhất của cửa sổ sau 2.30.0; CỘNG — duyệt đích danh ở Cổng Phạm vi). Gốc:
`crm/_acceptance/tin-hieu-tu-ve-kho/` (`BAN-GIAO.md`). Lộ trình và mốc là kế hoạch tổng; mỗi mốc là một chiến dịch;
thanh bên là mỏ neo của chiến dịch đang chạy. Vòng làm hai phần trên CÙNG lớp phân tích lộ trình: nấc 1 của ADR 0025
(PR #351, chủ kho duyệt 14/10) — ba cờ vàng: kho chưa khai lộ trình · hồ sơ đang mở không thuộc việc nào · việc
đang mở không thuộc mốc nào — và một hàm sinh tên phiên + tên nhóm thanh bên mà lệnh mở việc in ra. Luật, số đo
trước và phương án bị loại: design doc.

Kho thử trong mọi ca do code sinh trong lượt (thư mục tạm, `git init`, hồ sơ dựng theo hình dạng ô của bản đồ). Giá
trị mong đợi viết sẵn trong ca, không rút từ đầu ra của bộ vẽ. «Bộ máy gốc» = `scripts lib skills` lấy bằng
`git archive f4e717bf` (gốc vòng) trong lượt.

## Criteria

- AC-1: Given kho thử dùng mốc có ma trận hàng viết sẵn — trạng thái {chưa có hồ sơ · cân nhắc · sắp mở · chờ duyệt · đang dựng · đã giao · xếp lại · đã bác · hỏng} × {thuộc một mốc · không thuộc mốc nào}, cộng hai hàng không thuộc mốc: một hàng có hồ sơ nhận qua `lo_trinh_ma` (slug hồ sơ khác mã hàng, như MC1 của kit) và một hàng «không suy được» (hai hồ sơ cùng nhận), When vẽ trang lộ trình, Then ĐÚNG năm hàng (cân nhắc, sắp mở, chờ duyệt, đang dựng — không thuộc mốc — và hàng nhận qua `lo_trinh_ma`) mang câu «đang làm mà chưa thuộc mốc nào — gắn việc này vào một mốc của kế hoạch» ở cả mục «Cần sửa trong kế hoạch», ô trạng thái của hàng và khối dữ liệu (`can_sua`, `hang[].co`); tập mã mang cờ BẰNG tập viết sẵn, mười lăm hàng còn lại không mang. Chiều đỏ: bản sao bỏ điều kiện «có hồ sơ» → ca đỏ nêu mã hàng chưa có hồ sơ bị cờ; bản sao chỉ xét hồ sơ theo thư mục slug → ca đỏ nêu mã hàng nhận qua `lo_trinh_ma`.
- AC-2: Given kho thử dùng hai lộ trình — lộ trình A có mốc, lộ trình B không có mốc nào, mỗi bên một hàng đang dựng không thuộc mốc — When vẽ trang, Then hàng của B CŨNG mang cờ (kho dùng mốc là phán đoán cấp kho); và Given kho thử khai một lộ trình không mốc mà mọi hồ sơ đang mở đều thuộc một hàng, When vẽ trang, chạy thẻ start và mở ô từ hàng, Then trang, dòng thẻ start và ô cơ hội giống TỪNG BYTE đầu ra của bộ máy gốc trên cùng kho thử — sau đối chứng dương: ở mỗi kho và mỗi bên, lệnh thoát 0 và tệp so có mặt, khác rỗng, chứa mã hàng viết sẵn (thiếu → ca đỏ «đối chứng gốc không chạy: <bên> <tệp>»). Chiều đỏ: bản sao xét «dùng mốc» theo từng lộ trình → ca đỏ nêu hàng của B; bản sao chèn một byte vào ô cơ hội của kho không mốc → ca so byte đỏ nêu tệp.
- AC-3: Given kho thử khai lộ trình có ma trận hồ sơ KHÔNG thuộc hàng nào — một hồ sơ mỗi ô bản đồ {cân nhắc · sắp mở · chờ duyệt · đang dựng · đã giao · chờ nghiệm thu · đã nghiệm thu · xếp lại · đã bác · hỏng} — cộng một hồ sơ đang dựng nối hàng qua `lo_trinh_ma`, When vẽ trang lộ trình, Then ĐÚNG bốn hồ sơ (cân nhắc, sắp mở, chờ duyệt, đang dựng) mang câu «hồ sơ <tên> đang mở mà không thuộc việc nào trong kế hoạch — thêm việc cho nó, hoặc ghi mã việc vào hồ sơ» ở mục «Cần sửa trong kế hoạch» và `can_sua` của khối, đúng một lần cho cả kho (kho hai lộ trình: ở lộ trình đầu), khối «hồ sơ không thuộc kế hoạch nào» cuối trang vẫn liệt kê đủ như cũ; hồ sơ nối qua `lo_trinh_ma` và bảy hồ sơ đã đóng không mang cờ. Chiều đỏ: bản sao coi mọi hồ sơ ngoài kế hoạch là đang mở → ca đỏ nêu hồ sơ đã giao bị cờ.
- AC-4: Given kho thử có `_acceptance/config.yaml` mà thiếu khoá `lo_trinh.tep`, và kho thử có khoá đó, When chạy bộ quét thẻ start và dựng thẻ theo thân lệnh start, Then kho thiếu khoá nhận đúng MỘT dòng cờ vàng «Kho chưa khai lộ trình — việc mở ở đây không thuộc kế hoạch hay mốc nào; khai bằng khoá lo_trinh.tep trong _acceptance/config.yaml» (khoá dữ liệu mới của bộ quét, `loTrinh` vẫn `null`), mọi dòng khác của thẻ giống TỪNG BYTE bộ máy gốc; ở kho có khoá, dòng đó vắng. Chiều đỏ: bản sao bộ quét bỏ điều kiện «thiếu khoá» → ca đỏ nêu kho có khoá nhận dòng.
- AC-5: Given các kho thử của AC-1 và AC-3 đã vẽ lại trang và commit, When chạy `product-map.mjs --root <kho> --check` và đếm bảng dịch câu cờ, Then `--check` thoát 0 dù trang có cờ mới (ca đếm cờ trên trang trước khi tin mã thoát), dòng đếm cờ của thẻ start tăng đúng bằng số cờ mới so với bộ máy gốc và không dòng nào khác của thẻ đổi; và số chỗ phát cờ trong mã == số dòng ma trận ca LT-97 == số dòng `CO_DICH` == số dạng kho thử phát (tăng hai so với gốc vòng), mỗi dạng mới ra đúng câu đích viết tay, không câu nào chứa cụm nội bộ của danh sách cấm.
- AC-6: Given ma trận viết sẵn cho hàm `tenChienDich` — tên ngắn hàng (`ten_ngan` · chỉ `ten` · chỉ câu giao bảy từ có «» · câu giao ba từ), mốc (không mốc · một mốc · hai mốc khác ngày · hai mốc cùng ngày · mốc có `ten_ngan` · tên mốc có « — » · có « (» · có «; » · có «: » · ngày không đúng dạng), kho một lộ trình và kho ba lộ trình (tên lộ trình `ten_ngan` · `ten` · chỉ tên tệp), và `tenKho` trên thư mục không phải kho git — When gọi hàm, Then mỗi ca trả ĐÚNG bộ ba `{moc, ten_phien, nhom}` viết sẵn (vd `R2a · Thành viên vào (crm)` / `OKR · R2 lên production 31/10`; một lộ trình: `Tinh chỉnh sau hai đợt thử 05/11`; không mốc: `nhom: null`, `moc: null`). Chiều đỏ: bản sao chọn mốc đứng cuối tệp thay vì ngày sớm nhất → ca «hai mốc khác ngày» đỏ, nêu tên mốc nhận được.
- AC-7: Given kho thử có ba hàng (một thuộc mốc chưa có hồ sơ · một không mốc chưa có hồ sơ · một thuộc mốc đã có hồ sơ), When chạy NGUYÊN VĂN khối `S0-MO-O` của SKILL feature-loop cho từng hàng, Then JSON in ra có `hoSo`, `moi` như trước VÀ ba khoá `moc`, `ten_phien`, `nhom` mà giá trị BẰNG đúng `tenChienDich` gọi trên cùng hàng (round-trip, kể cả nhánh `moi: false`); tên kho trong `ten_phien` là tên thư mục của kho thử — kể cả khi lệnh chạy từ một worktree (`git worktree add` ra thư mục tên khác) và từ một thư mục con của worktree: vẫn là tên thư mục kho chính viết sẵn (chiều đỏ: bản sao lấy tên theo gốc cây làm việc → ca đỏ nêu tên worktree); mã thoát của bốn ca của bảng `S0-MO-O-THOAT` không đổi.
- AC-8: Given kho thử dùng mốc, When mở ô từ một hàng thuộc mốc và từ một hàng không thuộc mốc, Then ô cơ hội có đúng một dòng ngay sau dòng «Mở từ hàng …»: `Mốc: <tên mốc> — <dd/mm/yyyy>.` hoặc `Mốc: chưa gắn — …`; và ô vẫn qua bộ phân loại ngưỡng của bản đồ như trước (cùng ô bản đồ với bộ máy gốc). Kho không dùng mốc: không có dòng `Mốc:` (phần bằng-byte thuộc AC-2).
- AC-9: Given SKILL feature-loop, When rút khối máy đọc `S0-TEN-CHIEN-DICH`, Then tập khoá trong khối BẰNG tập khoá lệnh mở việc in thêm (`moc`, `ten_phien`, `nhom`), khối mang luật máy đọc cho ca `nhom` rỗng là «không xếp nhóm», và đoạn S0 gọi tên cả hai việc: đặt tên phiên bằng `ten_phien`, xếp vào nhóm `nhom`. Chiều đỏ: bản sao SKILL bỏ một khoá khỏi khối → ca đỏ nêu khoá thiếu; bản sao mã thêm một khoá → ca đỏ nêu khoá thừa; bản sao SKILL bỏ luật ca rỗng → ca đỏ «thiếu luật nhom null».
- AC-10: Given bản sao `_acceptance/` + `docs/plan/` của crm ở `1997da85` (bung bằng `git archive` trong lượt; crm vắng trên máy → thoát 2 nêu đường, không xanh) và cây kit, When phân tích bằng bộ máy gốc và bộ máy của cây, Then số cờ mỗi lộ trình đổi đúng như dự báo: OKR 12 → 26 (thêm F8, F23, F24, F26 «chưa thuộc mốc» và mười hồ sơ đang mở không thuộc việc nào — danh sách viết sẵn trong ca từ số đo 14/10) · Kho tài liệu 2 → 2 · Việc và Dự án 4 → 5 (thêm DA0c), không cờ cũ nào mất; và `tenChienDich` cho một hàng OKR thuộc mốc «R2 lên production» trả `nhom` = `OKR · R2 lên production 31/10`, `ten_phien` = `<mã> · <ten_ngan của hàng> (crm)`.
- AC-11: Given lộ trình kit ở HEAD, When phân tích và vẽ lại trang, Then hàng MC1 thuộc đúng một mốc (ngày 2026-11-05), lộ trình kit có 0 cờ «chưa thuộc mốc» và tập cờ «hồ sơ đang mở không thuộc việc nào» BẰNG tập hồ sơ ngoài kế hoạch mà ô bản đồ thuộc nhóm đang làm hoặc chưa bắt đầu, do ca tự đếm độc lập (≥ 1 — số đo 14/10 là 15; ca in tập), `tenChienDich` cho MC1 trả `ten_phien` = `MC1 · Mốc là chiến dịch (acceptance-gate-kit)` (chuỗi viết sẵn, không rút từ hàm) và `nhom` = `Tinh chỉnh sau hai đợt thử 05/11`, và `product-map.mjs --check` của cây thoát 0.

## Coverage

Quét bằng `morphological-scan` (preset entity-feature, thực thể = một hàng lộ trình lúc có hồ sơ đang mở) — bản đầy
đủ ở `_acceptance/moc-la-chien-dich/coverage-scan.md`. Chân sản phẩm `[SUY-TỪ-REPO: scripts/lo-trinh.mjs]` + số đo
14/10 trên crm; chân ngành `[NGÀNH: GitHub Issues — no:milestone]`, `[NGÀNH: Linear — Project milestones]`,
`[NGÀNH: Jira — Fix Version]` (thiếu mốc là cờ/bộ lọc, không chặn).

- Trục A — trạng thái việc/hồ sơ: chưa có hồ sơ · chưa bắt đầu có hồ sơ · đang làm · đã giao · đóng khác  [thước CE: ba danh sách ô trong scripts/lo-trinh.mjs + ô bản đồ] → AC-1, AC-3
- Trục B — liên kết: hồ sơ không thuộc việc nào · việc không thuộc mốc · một mốc · nhiều mốc  [thước CE: khoá `moc[].hang`, `lo_trinh_ma`, ADR 0025 nấc 1] → AC-1, AC-3, AC-6
- Trục C — kho: không khai · khai không mốc · một lộ trình có mốc · nhiều lộ trình  [thước CE: sáu kho tiêu thụ đo 14/10] → AC-2, AC-4, AC-6, AC-10, AC-11
- Trục D — mặt hiện: trang · khối dữ liệu · thẻ start · `--check` · lệnh mở việc · ô cơ hội · SKILL S0  [thước CE: các bên đọc `kq.co` và `--mo-o` liệt bằng grep 14/10] → AC-1, AC-3, AC-4, AC-5, AC-7, AC-8, AC-9

## Đường đo

- Câu hỏi của ngưỡng («người còn phải hỏi hiện trạng sau lần đổi kế?») — số từ dòng 2 luật (c) của hồ sơ mốc kế (đếm tay, như mọi mốc); vòng này bảo đảm vật để nhóm thanh bên theo mốc tồn tại: AC-7, AC-9, AC-11.
- «Mọi vòng mở sau ngày gộp có nhóm theo mốc do máy sinh» — số đọc ở hồ sơ mốc kế: phiên mở từ hàng thuộc mốc sau ngày gộp đang nằm trong nhóm thanh bên có tên bằng `nhom` / tổng phiên mở từ hàng thuộc mốc (đếm tay trên thanh bên của mỗi máy). Vòng này bảo đảm GIÁ TRỊ tên (AC-6, AC-7) và chỉ dẫn (AC-9); việc phiên có thật sự đặt tên và xếp nhóm là cạnh *mù* — xem Notes. Số hàng mở mà chưa thuộc mốc và hồ sơ mở không thuộc việc nào: AC-1, AC-3, AC-10.

## Out of scope

- Bản đồ hiện trạng ba cột (Đã xong · Đang dở · Kế tiếp) và trường «bước kế» máy đọc — phần còn lại của hạt giống #350, mở khi ngưỡng của nó đạt.
- Chip gói `dieu-phoi` dùng `tenChienDich` — vùng M5; vòng này chỉ export hàm làm chỗ nối, không chạm `dieu-phoi/`.
- Cờ riêng cho hàng thuộc ≥2 mốc (đo 14/10: 0 hàng ở bốn lộ trình) — vòng này lấy mốc ngày sớm nhất.
- Chặn mở vòng, đổi mã thoát, hay ghi vào tệp lộ trình của kho — kit chỉ đọc và chỉ cảnh báo.
- Đóng/xoá nhóm thanh bên khi mốc qua.
- Nấc 2 (khởi tạo kho tạo sẵn tệp lộ trình) và nấc 4 (chặn) của ADR 0025 — đi cùng plugin «mặt» `lo-trinh` ở vòng meta đã gọi tên trước cho cửa sổ kế.
- Nấc 3 của ADR 0025 (mở vòng từ mô tả tự do thì máy thêm hàng vào tệp lộ trình) — máy khuyên dời sang vòng plugin `lo-trinh` cùng nấc 2; chủ kho chọn ở Cổng Phạm vi (Hỏi-3).

## Notes

- Mù (Thước↔Vật): công cụ đặt tên phiên và xếp nhóm thanh bên của app desktop không gọi được trong lượt chấm, nên không eval nào chứng rằng phiên THẬT SỰ được xếp. Reality đọc ở hồ sơ mốc kế bằng số ở «Đường đo» dòng 2. Phiên mở vòng này (MC1) đã tự đặt tên «MC1 · Mốc là chiến dịch (kit)» và xếp vào nhóm «Kit · Tinh chỉnh sau hai đợt thử 05/11» bằng tay lúc mở — trước khi có hàm.
