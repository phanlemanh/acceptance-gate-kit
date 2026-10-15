---
schema_version: 1
feature: Kho cam kết có lộ trình thì vòng không thuộc hàng nào bị chặn mở, theo lựa chọn từng kho
slug: kho-cam-ket-co-lo-trinh
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm hooks/acceptance-evidence-gate.js, lib/ (bộ đọc mới), scripts/pre-merge-check.sh — t3_paths
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-16-kho-cam-ket-co-lo-trinh-design.md
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: kho-cam-ket-co-lo-trinh

## Context

Nấc 4 của ADR 0025 (chặn theo lựa chọn từng kho) kèm nấc 3 (mở vòng từ mô tả thì máy tự thêm hàng), hàng RM5. Số đo
trước (ô cơ hội): từ 10/10, 13/40 hồ sơ mới của kit và 11/49 của crm không thuộc hàng nào, và cờ nấc 1 không thấy
chúng vì đã đóng. Vòng thêm MỘT bộ đọc `lib/chan-lo-trinh.cjs` (bật? · nối? · mới?) cho ba bên gọi: hook ghi tệp
(lúc mở), lưới trước-merge (lúc gộp), lệnh `lo-trinh.mjs --them-hang` (nấc 3). Kho không bật: 0 byte.

«Kho bật» = `enabledPlugins["road-map@<marketplace>"] === true` ở `.claude/settings.json` (khoá rút từ
`.claude-plugin/marketplace.json` của cây — đúng `khoaBat`/`docBat` của RM4) VÀ `lo_trinh.chan: true` trong
`_acceptance/config.yaml`. Kho thử trong mọi ca do code sinh trong lượt (thư mục tạm, `git init`, `config.yaml` khai
`lo_trinh.tep`, tệp lộ trình ghi bằng `ghiLoTrinh`, settings dựng theo ca). «Bộ máy gốc» = `git archive <gốc so>
hooks lib scripts skills commands feature-loop road-map .claude-plugin` bung trong lượt, gốc so đọc từ
`_acceptance/kho-cam-ket-co-lo-trinh/goc-so`. Hook được gọi đúng như harness gọi: JSON PreToolUse qua stdin.

## Criteria

- AC-1: Given kho thử bật chặn, hồ sơ `x` chưa có trên đĩa và không hàng nào nối nó, When hook nhận lệnh Write tạo `_acceptance/x/contract.md`, và (ca riêng) Write tạo `_acceptance/x/opportunity.md` không có `lo_trinh_ma`, Then cả hai thoát 2, stderr nêu `x`, «lo_trinh.chan», lệnh `/feature-loop:feature-loop <mã>` và lệnh `--them-hang --slug x`; không tệp nào được ghi. Chiều đỏ: bản sao hook bỏ luật → hai ca FAIL ghim «hồ sơ ngoài lộ trình lọt hook».
- AC-2: Given kho thử bật chặn và ma trận nối viết trước — hàng mang `slug: x` · `opportunity.md` có sẵn ghi `lo_trinh_ma` của hàng có thật · `opportunity.md` ĐANG ghi mang `lo_trinh_ma` có thật · `lo_trinh_ma` trỏ mã không có · `lo_trinh_tep` trỏ tệp không khai · hàng mang `slug` của hồ sơ khác — When hook nhận lệnh Write tạo tệp mở hồ sơ, Then ba ca đầu thoát 0; ba ca sau thoát 2, ca mã sai nêu đúng mã; và với mọi ca, sau khi ghi tệp đang chờ vào một bản sao của kho thử, phán «nối» của `lib/chan-lo-trinh.cjs` BẰNG phán của `phanTichKho` trên bản sao ấy (hồ sơ không nằm trong `ngoaiLoTrinh`, không mang cờ mã sai) — đối chứng dương: `x` có mặt trong tập hồ sơ `phanTichKho` thấy ở cả 6 ca. Chiều đỏ: bản sao bộ đọc bỏ nhánh `lo_trinh_ma` → ca hai FAIL ghim «bộ đọc chặn lệch bản đồ lộ trình».
- AC-3: Given kho thử bật chặn có hồ sơ `cu` không nối, đã có `contract.md` (một ca) hoặc chỉ có `opportunity.md` (ca khác), When hook nhận Write/Edit vào `contract.md`, `opportunity.md` và `design-pass.md` của `cu`, và Write tạo `_acceptance/x/design-pass.md` của hồ sơ mới `x`, Then mọi ca thoát 0 không in dòng chặn nào. Chiều đỏ: bản sao coi mọi tệp `_acceptance/*/` là mở hồ sơ → ca `cu` FAIL ghim «hồ sơ cũ bị chặn».
- AC-4: Given ma trận viết trước gói {không settings · `settings.json` true · CHỈ `settings.local.json` true · `settings.json` false} × khoá {vắng · `false` · `true` · `"co"`}, HOME trỏ thư mục thử có `~/.claude/settings.json` bật gói, và bốn lệnh ghi viết trước {Write tạo `contract.md` của hồ sơ mới không nối · Write tạo `opportunity.md` mới không có `lo_trinh_ma` · Write tạo `opportunity.md` mới có `lo_trinh_ma` có thật · Edit `opportunity.md` của hồ sơ cũ}, When hook nhận từng lệnh (64 lần chạy), Then ở ô (`settings.json` true, `true`) hai lệnh đầu thoát 2 với dòng chặn của AC-1, hai lệnh sau thoát 0; ở ô (`settings.json` true, `"co"`) hai lệnh đầu thoát 2 với stderr nêu «lo_trinh.chan phải là true hoặc false»; 14 ô còn lại × bốn lệnh thoát và in giống từng byte bộ máy gốc trên cùng kho thử; ô chặn với `enforcement: off` hoặc `ACCEPTANCE_GATE_BYPASS=1` thoát 0, với `enforcement: warn` thoát 0 và stderr còn dòng chặn. Chiều đỏ: bản sao đọc thêm `settings.local.json` → ô chỉ-local FAIL ghim «phạm vi local không được bật chặn»; bản sao áp luật `opportunity.md` khi gói không bật → FAIL ghim «kho không bật đổi hành vi ở opportunity.md».
- AC-5: Given kho thử có nhánh `main` và nhánh việc thêm hồ sơ `moi` không nối + hồ sơ `noi` có hàng + sửa hồ sơ `cu` (có sẵn ở `main`, không nối), When chạy `scripts/pre-merge-check.sh --base main` của cây trên kho thử bật chặn, Then mã thoát khác 0 và stdout có ĐÚNG một dòng `VIOLATION [moi]: hồ sơ mới không thuộc hàng lộ trình nào (lo_trinh.chan)`, không dòng nào nêu `noi` hay `cu`; cùng nhánh ở kho không bật → không dòng nào chứa «lo_trinh.chan» và mã thoát BẰNG bộ máy gốc; kho bật mà xoá `lib/chan-lo-trinh.cjs` → đúng một dòng `NOTE` chứa «luật chặn lộ trình NOT ENFORCED». Chiều đỏ: bản sao lưới bỏ lời gọi → ca bật FAIL ghim «hồ sơ ngoài lộ trình lọt lưới trước-merge».
- AC-6: Given mọi kho trên máy có `_acceptance/config.yaml` dưới `KHO_GOC` (mặc định `~/dev`, ca tự dò, ≥ 1; không dò được → thoát 2 nêu đường — mù, không xanh), When trên bản sao `git archive HEAD` của từng kho kèm `.claude/` đang có, chạy hook với bốn lệnh ghi của AC-4, chạy `lib/chan-lo-trinh.cjs --root <kho> --base HEAD`, và chạy `lo-trinh.mjs --them-hang`, Then ở mọi kho không bật: hook cho stdout + stderr + mã thoát giống bộ máy gốc, bộ đọc in rỗng thoát 0, `--them-hang` thoát 1 và băm cây trước = sau. Ca in danh sách kho đã đo và số kho bật.
- AC-7: Given kho thử bật chặn, tệp lộ trình dạng chuẩn có hai hàng, When chạy NGUYÊN VĂN khối `S0-THEM-HANG` của SKILL feature-loop (thay `<slug>` = `sua-loi-dang-nhap`, câu giao «Sửa lỗi đăng nhập khi mất mạng»), Then thoát 0; tệp có đúng ba hàng, hàng thứ ba BẰNG `{ma, cau_giao, slug, vi_sao}` viết sẵn (ngày từ `ACCEPTANCE_TODAY`), hai hàng đầu giữ nguyên, `dangChuan` true, `kiemKhuon(…).co` rỗng; sau đó hook cho qua Write tạo `contract.md` của `sua-loi-dang-nhap`; `phanTichKho` xếp hồ sơ ấy vào hàng mới; chạy NGUYÊN VĂN khối `S0-MO-O` với mã `sua-loi-dang-nhap` thì JSON có `moi: false`, `hoSo` = slug, và không `opportunity.md` nào được tạo (resume, không Cổng Đáng); vẽ lại + commit thì `product-map.mjs --check` thoát 0. Chiều đỏ: bản sao bỏ trường `slug` khỏi hàng thêm → hook bước sau FAIL ghim «hàng máy thêm không nối hồ sơ».
- AC-8: Given kho thử bật chặn, When chạy `--them-hang` trên các ca viết trước — tệp không ở dạng chuẩn · đã có hàng mã `x` · đã có hàng `slug: x` · stdin rỗng · slug sai mẫu · khoá `lo_trinh.chan: "co"` · câu giao chứa `$(touch CANH)`, backtick `touch CANH2`, nháy đơn và nháy kép (chạy qua khối `S0-THEM-HANG` nguyên văn) — Then sáu ca đầu thoát 2, stderr nêu lý do (ca khoá nêu «lo_trinh.chan phải là true hoặc false»), băm tệp lộ trình trước = sau; ca ký tự đặc biệt thoát 0, `cau_giao` BẰNG chuỗi nhập nguyên văn, và `CANH`, `CANH2` không tồn tại. Chiều đỏ: bản sao bỏ phép kiểm `dangChuan` → ca không chuẩn FAIL ghim «ghi đè tệp lộ trình không chuẩn».
- AC-9: Given cây đang kiểm, When rút khối `S0-THEM-HANG` và `S0-THEM-HANG-THOAT` của SKILL feature-loop, `INIT-CI-COPY-LIST` của `commands/acceptance-init.md`, mục chặn của `road-map/README.md` và GUIDE, Then bảng mã thoát có ĐÚNG tập {0, 1, 2} và mỗi mã có một ca của AC-6/7/8 cho ra nó (round-trip); danh sách chép có `lib/chan-lo-trinh.cjs` mang dấu `[only-if-declared: lo_trinh]`; README và GUIDE nêu khoá `lo_trinh.chan`, điều kiện gói ở phạm vi kho, cách tắt (xoá khoá hoặc `false`) và giới hạn «tệp ghi bằng Bash né hook — lưới trước-merge bắt»; khuôn `config.yaml` trong lệnh khởi tạo kho KHÔNG có khoá `chan` (vắng = tắt). Chiều đỏ: bản sao bảng thêm mã 3 → FAIL «mã 3 không ca nào cho ra».

## Coverage

Quét theo preset entity-feature, thực thể = một lần mở hồ sơ ở một kho. Chân sản phẩm `[SUY-TỪ-REPO:
hooks/acceptance-evidence-gate.js, scripts/lo-trinh.mjs, scripts/lo-trinh-khoi-tao.mjs (RM4), scripts/pre-merge-check.sh]`
+ số đo 16/10 trên kit và crm (ô cơ hội); chân ngành `[NGÀNH: branch protection «require linked issue» — chặn ở lúc
gộp, cho qua khi có liên kết]` `[CE chưa kiểm chứng]`.

- Trục A — cam kết của kho: gói {vắng · kho · chỉ local · người dùng} × khoá {vắng · false · true · sai kiểu} × chính sách hook {strict · warn · off · bypass}  [thước CE: `docBat` RM4] → AC-4, AC-6
- Trục B — cách nối: hàng mang slug · ô cơ hội mang mã · mã sai · tệp sai · slug của hồ sơ khác  [thước CE: `suyTrangThai`] → AC-2
- Trục C — tuổi hồ sơ: mới · có ô cơ hội cũ · có hợp đồng cũ · tệp phụ của hồ sơ mới  [thước CE: tập tệp hook soi] → AC-1, AC-3
- Trục D — đường ghi: Write qua hook · Bash né hook (→ lưới trước-merge) · gộp nhánh  [thước CE: hai chỗ đặt răng] → AC-1, AC-5
- Trục E — nấc 3: thêm được · tệp không chuẩn · trùng · stdin rỗng/độc · kho không bật  [thước CE: `ghiLoTrinh`/`dangChuan` RM2] → AC-7, AC-8
- Trục F — lời khai: khối SKILL · danh sách chép CI · README/GUIDE  [thước CE: khối máy đọc] → AC-9

## Đường đo

Mỗi dòng ngưỡng của ô cơ hội trỏ đúng một lệnh:
- «0 hồ sơ mới không nối lọt vào nhánh chính»: `node lib/chan-lo-trinh.cjs --root <kho> --base <commit bật khoá>` —
  mỗi dòng in là một hồ sơ lọt (AC-5 bảo đảm lệnh và khuôn dòng).
- «Lần máy tự gỡ»: số hàng của tệp lộ trình có `vi_sao` mở đầu «Máy thêm khi mở vòng từ mô tả» (AC-7 bảo đảm dấu ấy;
  nấc 3 không ghi sổ `.so.jsonl` — ô cơ hội đã sửa theo).
- «Chủ kho tắt khoá» (vế CHẾT): `git log -S 'chan:' --format='%h %ad' -- _acceptance/config.yaml` sau commit bật khoá —
  commit đổi `lo_trinh.chan` khỏi `true` hoặc xoá khoá.
- «Lượt gọi người do chặn»: đếm tay như dòng 2 luật (c), chỉ tính lượt mà thông điệp chặn «lo_trinh.chan» xuất hiện
  trong phiên ngay trước lượt gọi — giới hạn đã khai: máy không tách được lượt này.
- Kho thật: tới 19/11 chưa kho nào bật → «chưa đọc được ở đây». AC-6 đo phía không-đổi trên mọi kho của máy.

## Out of scope

- Câu «gắn mốc nào» trên thẻ Cổng Phạm vi cho hàng máy thêm — cờ nấc 1 ở thẻ khởi động đã hiện.
- Bật chặn cho kit hay crm — mỗi kho tự bật bằng một dòng khoá.
- Hook riêng trong gói `road-map`, lệnh `/road-map:bat-chan` — khoá một dòng đủ; lệnh mới là lệnh khoá (ADR 0002 + P32).
- Miễn trừ theo loại hồ sơ (cắt bản, sự cố) — nấc 3 cho mọi loại một hàng, 0 lượt người.
- Nấc 3 ở kho có lộ trình mà không bật chặn — đổi mặc định cho mọi kho có lộ trình (luật 26/09).
- Ghi nấc 3 vào sổ tự áp `.so.jsonl` — bộ đọc `phatLai` của RM2 không biết loại dòng ấy.

## Notes

- CỘNG (ADR 0018) duyệt đích danh bằng chữ ký Cổng Phạm vi: khoá `lo_trinh.chan` · luật mới trong
  `hooks/acceptance-evidence-gate.js` (thêm `opportunity.md` vào tập tệp soi) · `lib/chan-lo-trinh.cjs` · luật mới trong
  `scripts/pre-merge-check.sh` · cờ `--them-hang` của `lo-trinh.mjs` · khối `S0-THEM-HANG` của SKILL feature-loop · mục
  chép CI `[only-if-declared: lo_trinh]`.
- Phụ thuộc RM4 (`docBat`, `khoaBat`) — PR #362 chưa gộp lúc mở vòng; nhánh dựng cắt từ `origin/main` nếu đã gộp, không
  thì từ đỉnh nhánh RM4.
- `lib/chan-lo-trinh.cjs`, `scripts/pre-merge-check.sh`, `scripts/lo-trinh.mjs` nằm trong danh sách chép CI → ghi chú
  phát hành nêu «chép lại».
