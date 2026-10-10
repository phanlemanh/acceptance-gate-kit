---
schema_version: 1
feature: Phiên thợ biết mình đang trong đợt — feature-loop nhận biết đợt bằng một lệnh chỉ đọc, chờ lượt S4 không thành câu hỏi, xong hàng thì tự mở hàng kế của dãy, quyền merge theo thẻ khởi tạo; kho không có đợt không đổi byte nào
slug: dieu-phoi-feature-loop-trong-dot
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, config, docs]
status: approved
design_doc: docs/superpowers/specs/2026-10-11-dieu-phoi-feature-loop-trong-dot-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-10T23:44:10Z
---

# Acceptance Contract: dieu-phoi-feature-loop-trong-dot

## Context

Hàng DP7 của ô dù `dieu-phoi-tho-trong-kit` (Cổng Đáng build 09/10, timebox 07/11), `dung_tren: [DP1]`, mốc
25/10. Thiết kế chung đã duyệt 10/10: `docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md` §16
hàng T7 và T15 (phần DP7). Thiết kế thi công và tám chỗ chọn: design doc ở frontmatter.

Gốc: crm `_acceptance/dieu-phoi-hai-tang` — đợt `sau-14-10`, thợ hỏi chủ kho bằng chữ mà bảng chờ người không
thấy (luật 52, P2 đứng ~2 giờ, P3 ~1,5 giờ).

Thuật ngữ:
- **thư mục đợt** = đích của symlink `<gốc kho chính>/.acceptance-runs/dieu-phoi-hien-tai`.
- **bản lõi của đợt** = `<thư mục đợt>/loi/` — mã gói mà `chay` chép vào lúc chạy bộ phát lịch (DP1 AC-11).
- **dãy của phiên** = kết quả `phienCuaCwd(hang-viec.json, cwd)`: dãy có worktree chứa cwd.
- **kho thử** = kho git do chính ca kiểm dựng trong thư mục tạm.
- **đã thông** = trạng thái hợp đồng `signed-off`, `machine-cleared` hoặc `da-cham-boi-thuc-te`.

## Criteria

- AC-1: Given ba kho thử nằm NGOÀI cây kit — (a) không có symlink đợt, (b) có đợt nhưng cwd không thuộc dãy nào, (c) có đợt và cwd nằm trong worktree của dãy `P1`, worktree tạo bằng `git worktree add` ở ba hình dạng (trong `.claude/worktrees/` của kho chính, cạnh kho chính, và chính kho chính làm dãy) — When chạy `node <gói feature-loop>/scripts/trong-dot.mjs --root <cwd>` với cwd là kho thử, Then (a) và (b) thoát 0 với stdout và stderr RỖNG, và băm cây kho cùng cây thư mục đợt trước == sau; (c) ở cả ba hình dạng thoát 0 và stdout là MỘT dòng JSON có `trong_dot: true`, `day: "P1"`, đúng là đầu ra của `<thư mục đợt>/loi/dieu-phoi.mjs tho --json` chạy cùng cwd. Chiều đỏ thứ hai: bản sao script giải gốc kho bằng `git rev-parse --show-toplevel` → hình dạng worktree cạnh kho chính đỏ, nêu «không thấy đợt». Đợt mà bản lõi không có lệnh `tho` (bản sao lõi đã gỡ lệnh) hoặc không có `loi/` → thoát 0, stdout đúng một dòng bắt đầu `trong-dot:` nêu tên đợt. Tên symlink mà script dò bằng hằng `TEN_LIEN_KET` của `dieu-phoi/scripts/dot.mjs` (ca so hai chuỗi). Chiều đỏ: bản sao script đọc sai tên symlink → ca (c) đỏ nêu «không thấy đợt».
- AC-2: Given một đợt do `mo` + `pha dang-chay` thật dựng và bộ phát lịch thật đã chạy một nhịp, When chạy `tho --json` từ worktree của dãy `P1`, Then JSON có đủ khoá `trong_dot`, `dot`, `thu_muc`, `day`, `luat` (đường tuyệt đối tới `LUAT.md` có thật), `pha`, `tu_merge`, `hang_ke` (`slug`, `moi`, `quyet`) và `viec_ke`; `hang_ke.slug` bằng `hang` trong `tiep/P1.json` do bộ phát lịch ghi. Lệnh không ghi byte nào (băm thư mục đợt trước == sau). Từ cwd ngoài mọi dãy → `{"trong_dot":false,"ly_do":"khong-phai-tho"}`; kho không đợt → `{"trong_dot":false,"ly_do":"khong-dot"}`; cả hai thoát 0.
- AC-3: Given một đợt ở `dang-chay` với dãy `P1`, When dựng lần lượt từng hàng của ma trận đầu vào viết sẵn (14 hàng, mỗi hàng ghim `viec_ke` và mẩu `ly_do`) và chạy `tho --json [--slug <s>]`, Then: hàng kế mang `ma` có `contract.md` (không có ô) → `mo-hang`; mang `ma`, có ô `decision: build` (không có hợp đồng) → `mo-hang`; ô ấy chỉ nằm ở worktree của dãy → `mo-hang`; hàng kế KHÔNG mang `ma` (hàng phát sinh giám sát đã thêm) và chưa có gì trong `_acceptance/` → `mo-hang`; mang `ma` mà `_acceptance/<slug>/` vắng → `bao-giam-sat`; ô `stage: discovery` chưa có `decision` → `bao-giam-sat`; ô `decision` `park`, `kill`, `iterate` (ba hàng) → `bao-giam-sat` với `ly_do` nêu slug và quyết; `tiep/P1.json` còn trỏ đúng slug truyền qua `--slug` → `cho-nhip`; dãy nghỉ → `cho`; chờ phụ thuộc chưa gộp → `cho`; pha `tam-dung` → `cho`; dãy hết hàng → `xong`. Ca in số hàng == độ dài ma trận. Tập `viec_ke` thu được bằng đúng hằng `VIEC_KE` của `tho.mjs` (so tập). Trạng thái quyết đọc bằng `trangThaiQuyet` của `the.mjs` (một nguồn với thẻ khởi tạo). Chiều đỏ: bản sao `tho.mjs` chỉ chặn `park` → hàng `kill` ra `mo-hang`, ca nêu «kill mở được».
- AC-4: Given một đợt hai hàng nối tiếp trên dãy `P1` (hàng B `sau: [A]`), When hợp đồng hàng A ở mỗi trạng thái của tập trạng thái hợp đồng của kit và chạy một nhịp bộ phát lịch thật, Then hàng A `signed-off`, `machine-cleared`, `da-cham-boi-thuc-te` trong worktree của dãy → tiến độ `ky` và `tiep/P1.json` trỏ hàng B khi B không chờ phụ thuộc gộp, và `tho --json --slug A` trả `viec_ke: mo-hang` với `hang_ke.slug` == B (B có ô `decision: build`); trên nhánh chính → `gop` và B mở được; mọi trạng thái khác → A vẫn là hàng đang làm. Tập «đã thông» của gói bằng `DA_THONG_CONG_2` của `lib/workspace-record.cjs` cộng `da-cham-boi-thuc-te`, và là tập con của enum `status` ở cùng tệp (ca so tập). Chiều đỏ: bản sao bỏ `machine-cleared` khỏi tập → ca `machine-cleared` đỏ nêu «A vẫn đang làm».
- AC-5: Given một đợt ở `nhap`, When chạy `pha dang-chay --tu-merge co` (hoặc `khong`), Then `dieu-khien.json` có `tu_merge: true` (hoặc `false`), giữ nguyên qua `pha tam-dung` rồi `pha dang-chay` không cờ, và `tho --json` trả cùng giá trị; giá trị khác `co`/`khong` → thoát 1 nêu giá trị sai, tệp byte-bằng; `--tu-merge` kèm chuyển sang pha khác `dang-chay` → thoát 1, tệp byte-bằng; đợt không có trường (đợt cũ, hoặc mở không cờ) → `tho` trả `tu_merge: null`. Thân `dieu-phoi/commands/mo-dot.md` bước 5 truyền `--tu-merge` theo chữ người gõ, nằm sau câu khai chữ quyết.
- AC-6: Given một đợt mà khoá `s4` thuộc dãy khác (hoặc trống chưa cấp), When hook `chan-s4` chặn một lời gọi S4 từ worktree của dãy `P2`, Then mã thoát 2 và lời chặn giữ nguyên tiền tố cũ (các ca DP1 đang ghim vẫn xanh) rồi thêm câu nêu tên dãy `P2`, chữ «chờ lượt», rằng không hỏi người và không chấm lại, và trỏ `LUAT.md` của đợt; cùng lời gọi từ cwd ngoài mọi dãy → lời chặn đúng bằng bản trước thay đổi (so chuỗi).
- AC-7: Given một đợt do `mo` thật dựng, có một tệp `cho-nguoi/P1.json` (hook thật ghi) và một yêu cầu `can-nguoi` của `P2` chưa có `tra-loi` — yêu cầu do bên viết máy của gói ghi khi gói có (`ghiYeuCau`), còn khi chưa có thì dựng theo đúng tên trường rút từ dòng «Yêu cầu» trong `LUAT.md` vừa sinh (rút rỗng → đỏ) — và `LUAT.md` ấy liệt cả `can-nguoi` lẫn `hang-moi` trong các loại yêu cầu, When chạy một nhịp bộ phát lịch thật, Then `trang-thai.json.cho_nguoi` có hai mục (`P1` và `P2`, mục `P2` mang `loai: can-nguoi`), `xem` in hai dòng «chờ người», và `dem --json` đếm hai lần gọi chủ kho; nhịp thứ hai không đếm thêm; ghi `tra-loi` cho yêu cầu thì nhịp kế bỏ mục `P2` khỏi danh sách.
- AC-8 (judgment): Given `feature-loop/skills/feature-loop/SKILL.md`, When đọc khối giữa marker `TRONG-DOT`, Then khối (i) chạy lệnh nhận biết ở S0 kể cả khi resume, và nói rõ không in gì → bỏ qua trọn khối; (ii) trong đợt: hàng chưa có ô → yêu cầu `hang-moi` cho giám sát thay cho thẻ Cổng Đáng; brainstorm không mở hỏi đáp, trả lời từ ô + câu giao + LUAT.md, câu chỉ người biết đi qua yêu cầu `can-nguoi` trước khi hỏi; không in GOAL-TEMPLATE; (iii) S4, ghim lại, đường nền: xin lượt rồi chờ bằng lệnh nền, lời chặn `chan-s4` là chờ lượt — không BLOCKED, không hỏi người, không tung lượt, không đếm round; (iv) S5 theo `tu_merge` (null = không tự merge) rồi làm đúng từng giá trị `viec_ke`; (v) không chép cách ghi vào thư mục đợt mà trỏ LUAT.md; (vi) không đổi bảng cổng — khó-đảo vẫn là câu hỏi cho người. Kèm phép máy: mỗi phần tử `VIEC_KE` xuất hiện trong khối đúng một lần dạng `` `<giá trị>` → ``; và dòng lệnh nhận biết RÚT từ khối, thay `$WORKFLOWS_DIR` bằng thư mục `workflows/` của gói feature-loop, chạy với cwd là kho thử NGOÀI cây kit, cho đúng kết quả của AC-1 (a) và (c) (round-trip). Chiều đỏ: bản sao khối thiếu một giá trị → ca nêu giá trị đó; bản sao khối dùng đường tương đối theo gốc kho (`node feature-loop/scripts/…`) → ca nêu «không chạy được ngoài kho kit».
- AC-9: Given kho kit và một kho trống không có đợt, When so cây trước và sau thay đổi, Then với kho không đợt: `trong-dot.mjs` không in gì và không ghi gì (AC-1 a); mọi khối marker khác của SKILL feature-loop (GOAL-TEMPLATE, S5-SHIP-DEFAULT, S0-MO-O, REPIN-TEMPLATE…) byte-bằng bản `origin/main` lúc cắt nhánh; không script nào của feature-loop ngoài `trong-dot.mjs` đổi; hook của gói ở kho không đợt vẫn thoát 0 không in gì (ca DP1-02 xanh).
- AC-10: Given cây sau thay đổi, When chạy suite `tests/dieu-phoi/**` và suite plugins của kit, Then mọi ca DP1 và DP2 xanh nguyên tên, không ca nào bị sửa thân; ca mới mang tên `DP7-*`.
- AC-11: Given README của gói `dieu-phoi`, When đọc, Then có mục «Phiên thợ trong đợt» nêu: lệnh `tho`, cờ `--tu-merge`, năm giá trị `viec_ke`, và việc feature-loop tự nhận biết đợt — không lặp lại cách ghi vào thư mục đợt (trỏ `LUAT.md`).

## Coverage

Quét bằng skill `morphological-scan`, preset test-matrix — bảng đủ ở design doc §5.

- Chân sản phẩm: [SUY-TỪ-REPO: docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md] §16 T7, T15 và [SUY-TỪ-REPO: dieu-phoi/scripts/].
- Chân ngành: [NGÀNH: GitHub Actions concurrency groups — job chờ khoá ở «pending», không «failed»] cho AC-6; [NGÀNH: GitHub merge queue / auto-merge — quyền tự gộp do người cấp trước] cho AC-5.

Trục:
- Trục A · ngữ cảnh kho: không đợt | đợt, phiên không thuộc dãy | đợt lõi cũ (không `tho`, không `loi/`) | đợt + dãy. [thước CE: ba nhánh `timThuMucDot`, `phienCuaCwd`, có/không `loi/`]
- Trục B · chỗ của vòng: S0 nhận hàng | S1 brainstorm | S4/ghim lại/đường nền | S5 ship + hàng kế. [thước CE: bảng stage của SKILL feature-loop]
- Trục C · hàng kế: mở được | chưa quyết/không build | chờ (nghỉ, phụ thuộc, pha) | dãy xong | nhịp chưa cập nhật. [thước CE: các nhánh trả của `chonHangKe` + Ngoài-18 của DP2]
- Trục D · quyền tự merge: có | không | vắng. [thước CE: thẻ khởi tạo `hoi: quyen-tu-merge`]

Phân loại:
- **Core:** A × nhận biết → AC-1, AC-2 · C đủ năm nhánh → AC-3 · hàng đã thông bước sang hàng kế → AC-4 · D → AC-5 · B=S4 → AC-6 · chờ người một danh sách → AC-7 · khối SKILL → AC-8 · A=không đợt × mọi B → AC-9 · không vỡ DP1/DP2 → AC-10 · tài liệu → AC-11.
- **Later:**
  - Đếm chạm theo vòng trong năm dòng số của mốc (T15 vế «theo vòng») — mốc phát hành đếm tay như cũ.
  - Hook tự bắt câu hỏi cuối lượt của thợ — DP6 «tự bắt việc chờ người».
  - Hai dãy cùng nhận một slug (Ngoài-19) — hạt giống sau DP2.
- **Never:**
  - Phiên giám sát × S5: giám sát không chạy feature-loop trên hàng của dãy.

## Out of scope

- Cách ghi vào thư mục đợt (lệnh con CLI `xin`, `nha`, `yeu-cau`), nhịp sống `song/`, `tiep-tuc` — DP3.
- Bàn giao tài khoản và hạn mức — DP4. Lớp mod — DP6.
- Năm lỗ còn lại của hạt giống sau DP2 (Ngoài-3, 4, 16, 17, 19) và ba lỗ còn lại của hạt giống lõi crm (mục
  1–3): không vá ở hàng này. Hàng này chỉ tiêu mục 4 của hạt giống lõi crm (AC-4) và phía thợ của Ngoài-18
  (AC-3: thợ không mở hàng chưa quyết build; bộ phát lịch vẫn có thể ghi nó vào `tiep/`).
- Đổi `GOAL-TEMPLATE`, `S5-SHIP-DEFAULT` hay bảng cổng của SKILL.

## Notes

- Hành vi của model trong một đợt thật (brainstorm không hỏi, chờ lượt không hỏi, tự mở hàng kế) không đọc
  được ở đây: AC-8 đo chữ của khối, không đo phiên chạy nó. Nhãn: *không đọc được ở đây* — reality đọc ở đợt
  thử crm (~26/10) và OneFlow (~27/10), ngưỡng: ≥1 lần một thợ trong đợt thử hỏi người ngoài yêu cầu
  `can-nguoi`, hoặc dừng ở chặn S4.
