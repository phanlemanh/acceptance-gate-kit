---
schema_version: 1
feature: Kiểm bản cài sau thẻ phân biệt lệch mã với lệch chỉ ở tệp không chạy, chỉ lệnh lấy thẻ khi bản clone thiếu thẻ, và in cho mỗi bản ghi cây phụ lệch số một lối sửa chạy được
slug: kiem-ban-cai-loi-sua-chay-duoc
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/kiem-ban-cai.mjs + tests/scripts + một khoá _acceptance/config.yaml — không chạm lib/**, hooks/**, lưới trước-merge
surfaces: [cli]
design_doc: _acceptance/kiem-ban-cai-loi-sua-chay-duoc/design.md
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-29T02:35:00Z
---

# Acceptance Contract: kiem-ban-cai-loi-sua-chay-duoc

## Context

Gốc: onehub-invest/_acceptance/nang-kit-2-34-0/ — lần nhận 2.34.0 (25/10) vấp ba chỗ của lệnh kiểm bản cài ở chế độ
máy thật: lệch chỉ ở ba tệp không chạy sau thẻ đọc thành ĐỎ; bản clone thiếu thẻ chỉ nói «ref không có»; lời khuyên
cho bản ghi cây phụ không chạy được. Hạt giống `docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md`
mục 7, 8 và `docs/plans/2026-10-17-hat-giong-cap-nhat-plugin-cay-phu-nham-ban-ghi-goc.md`. Thiết kế: `design.md` (L1–L8).

Mọi ca chạy `node scripts/kiem-ban-cai.mjs --may` (trừ AC-3, ở bước giải ref) với `CLAUDE_CONFIG_DIR` là một cấu hình
giả do ca dựng: sổ cài `plugins/installed_plugins.json` khuôn `version: 2` và bộ đệm cài là `git archive` của ref từ một
kho kit thu nhỏ do ca dựng (chợ và `plugin.json` chép từ HEAD của kit, kèm một tệp mẫu ở mỗi vùng `scripts/`, `docs/`,
`_acceptance/`, `LO-TRINH.html`, gắn thẻ `v<số>`). «Ba mẫu không chạy» là `docs/**`, `_acceptance/**`, `LO-TRINH.html`
tính theo đường từ gốc kho.

## Criteria

- AC-1: Given kho kit thu nhỏ có MỘT commit sau thẻ cùng số — sửa một tệp dưới `docs/`, xoá một tệp dưới `_acceptance/`,
  thêm một tệp dưới `_acceptance/`, sửa `LO-TRINH.html` — và bản ghi gốc trỏ bộ đệm là `git archive` của commit ấy, mang
  `gitCommitSha` của commit ấy (khác sha thẻ), When chạy `--may --ref <thẻ>`, Then thoát 0; không dòng nào bắt đầu
  `[kiem-ban-cai] ĐỎ`; có đúng một dòng `[kiem-ban-cai] VÀNG may:` chứa «lệch chỉ ở tệp không chạy» và tên cả bốn tệp;
  dòng TỔNG KẾT bắt đầu «ĐẠT» và đếm bản ghi ấy là ĐẠT. Đối chứng dương chạy trước trên cùng kho: bộ đệm là `git archive`
  của thẻ → thoát 0, không dòng «lệch chỉ ở tệp không chạy».
- AC-2: Given (a) commit sau thẻ của AC-1 thêm một tệp `scripts/` bị sửa, (b) chỉ tệp `scripts/` ấy lệch, (c) mỗi một
  tệp mã có tên giống mẫu bị sửa — `scripts/docs/x.mjs`, `skills/a/docs/b.md`, `feature-loop/LO-TRINH.html`, When chạy
  `--may --ref <thẻ>`, Then (a) thoát 1, dòng `ĐỎ may:` có «khác tag: 1 tệp» và tên tệp `scripts/`, danh sách «khác tag»
  không kể bốn tệp của AC-1, bốn tệp ấy vẫn được gọi tên ở một vế riêng; (b) thoát 1, không vế «tệp không chạy»; (c) mỗi
  ca thoát 1 với tên tệp ấy trong «khác tag». Ba mẫu ca dùng là ba mẫu của tiêu chí bật hàng TC4, ghi trong ca — không
  đọc lại từ hằng của lệnh. Chiều đỏ của bộ lọc: hai bản sao lệnh bị tiêm (khớp mẫu bằng «chứa» thay vì neo gốc kho ·
  hằng thêm `skills/`) — ca (c) chạy trên mỗi bản sao phải ĐỎ (bộ ca bắt được), trên lệnh thật phải xanh.
- AC-3: Given một bản clone `--no-tags` của kho kit thu nhỏ (remote `origin` trỏ kho có thẻ), When chạy `--may --ref <thẻ>
  --root <bản clone>`, Then thoát 2; dòng TỔNG KẾT chứa «KHÔNG CHẠY ĐƯỢC», «ref không có: <thẻ>» và một lệnh
  `git -C <bản clone> fetch --tags origin`; ca chạy ĐÚNG lệnh in ra bằng `bash -c` rồi chạy lại lệnh kiểm → không còn
  «ref không có» và dòng TỔNG KẾT bắt đầu «ĐẠT». Chiều đỏ: bản clone đã gỡ mọi remote → thoát 2, dòng TỔNG KẾT nói
  «không có remote» và KHÔNG chứa «fetch»; ref dạng sha không có → câu cũ «ref không có: <sha>», không chứa «fetch».
- AC-4: Given kho tiêu thụ giả (git) có một worktree liên kết; bản ghi gốc khớp thẻ; bản ghi cây phụ cùng gói mang số
  cũ và bộ đệm cũ, When chạy `--may --ref <thẻ>`, Then thoát 0; có một dòng `[kiem-ban-cai] VÀNG cay-phu:` gọi tên đường
  cây phụ và đường gốc, kèm «lệnh sửa:» theo sau là một lệnh; không dòng «khác số» nào đếm bản ghi ấy; ca chạy ĐÚNG lệnh
  in ra bằng `bash -c` rồi chạy lại → không còn dòng `cay-phu`, dòng TỔNG KẾT bắt đầu «ĐẠT» và số bản ghi ĐẠT tăng đúng 1;
  sổ sau sửa khác sổ trước ĐÚNG bốn trường `installPath`, `version`, `gitCommitSha`, `lastUpdated` của bản ghi cây phụ,
  bằng bốn trường của bản ghi gốc. Sao lưu: sau khi áp có đúng một tệp sao lưu cạnh sổ, băm bằng băm sổ chụp TRƯỚC khi
  áp; chép nó đè lên sổ thì sổ trở lại đúng từng byte. Chiều đỏ: hai bản sao lệnh bị tiêm (bỏ sao lưu · ghi sổ rồi mới
  sao lưu) — ca sao lưu chạy trên mỗi bản sao phải ĐỎ.
- AC-5: Given như AC-4 nhưng bản ghi cây phụ mang CÙNG số của thẻ và trỏ một bộ đệm lệch một tệp `scripts/`, When chạy
  `--may --ref <thẻ>`, Then thoát 1; không dòng nào có «cài lại ở» kể đường cây phụ ấy; có dòng `VÀNG cay-phu:` kèm
  «lệnh sửa:» cho nó; áp đúng lệnh in ra rồi chạy lại → thoát 0, dòng TỔNG KẾT bắt đầu «ĐẠT».
- AC-6: Given (a) bản ghi cây phụ lệch số mà bản ghi gốc CŨNG mang số cũ, (b) bản ghi phạm vi dự án của một kho khác (không
  phải cây phụ) mang số cũ, (c) bản ghi cây phụ lệch số mà gốc KHÔNG có bản ghi nào của gói, cùng một bản ghi khớp thẻ ở
  phạm vi người dùng, When chạy `--may --ref <thẻ>`, Then (a) có dòng `VÀNG cay-phu:` chứa «nâng bản ghi gốc trước» và
  KHÔNG chứa «lệnh sửa:»; (b) và (c) không dòng `cay-phu` nào kể chúng, chúng được đếm ở dòng «khác số … chưa nâng» như
  trước vòng; không dòng nào chứa «lệnh sửa:»; mã thoát bằng mã thoát của cùng sổ khi bỏ ba bản ghi (a), (b), (c).
- AC-7: Given sổ cài thêm hai bản ghi có `projectPath` trỏ thư mục đã xoá (một cùng số thẻ, một số cũ), When chạy
  `--may --ref <thẻ>`, Then có đúng một dòng `[kiem-ban-cai] VÀNG mo-coi:` đếm «2 bản ghi trỏ thư mục đã xoá», gọi tên
  hai đường, kèm «lệnh dọn:»; hai bản ghi ấy không có mặt ở dòng nào khác; số bản ghi ĐẠT bằng số khi không có chúng;
  dòng TỔNG KẾT có «2 bản ghi mồ côi». Áp đúng lệnh dọn rồi chạy lại → không còn dòng `mo-coi`, mọi bản ghi khác của sổ
  giữ nguyên từng trường; tệp sao lưu băm bằng sổ trước khi áp và phục hồi được đúng từng byte. Chiều đỏ: bản sao lệnh
  bỏ sao lưu của lệnh dọn — ca sao lưu phải ĐỎ.
- AC-8: Given mọi cấu hình giả của AC-1…AC-7, When chạy `--may` (trước khi ca áp lệnh nào), Then băm sổ cài và danh sách
  tên · cỡ · mtime dưới `plugins/` trước và sau mỗi lần chạy bằng nhau — lệnh kiểm không ghi gì; mọi lệnh sửa, lệnh dọn
  chỉ nằm trong đầu ra. Độ nhạy: ghi một byte vào sổ của một bản sao làm phép so đổi.
- AC-9: Given AC-4 dựng lại với thư mục cấu hình và đường cây phụ chứa dấu cách và một nháy đơn, When áp lệnh sửa in
  ra bằng `bash -c` và bằng `zsh -c` (zsh vắng → ca in «BỎ QUA: LS-9 zsh», không xanh im), Then cả hai thoát 0 và lần chạy
  lại không còn dòng `cay-phu`.
- AC-10: Given trọn bộ ca KB của hồ sơ `kiem-ban-cai-sau-phat-hanh` (`tests/scripts/kiem-ban-cai.ca.mjs`, cần CLI
  `claude`) cộng ca mới KB-13 — chế độ kho giả lập với nguồn cài lệch CHỈ một tệp `docs/` → thoát 1, dòng `ĐỎ khop-tag`
  có tên tệp ấy (chế độ kho giả lập giữ nghiêm, design L3; cùng hình lệch ở `--may` ra vàng — AC-1), When chạy sau thay
  đổi, Then mọi ca PASS, gồm KB-4, KB-7, KB-10, KB-11 đời trước.

## Coverage

Quét bằng `morphological-scan` preset test-matrix (sổ: dòng «Quét độ phủ…», thay dòng bỏ quét). Chân sản phẩm: hai hạt
giống và hồ sơ `kiem-ban-cai-sau-phat-hanh` [SUY-TỪ-REPO: docs/plans/2026-10-17-hat-giong-cap-nhat-plugin-cay-phu-nham-ban-ghi-goc.md].
Chân ngành: [NGÀNH: brew doctor] — mỗi cảnh báo kèm lệnh sửa chạy được cho đúng chỗ hỏng. Thước CE: lịch sử vấp thật —
13/10 (v2.28.0 lệch 22 mục), 17/10 (14 bản ghi cây phụ, 61 mồ côi), 25/10 (ba tệp sau thẻ) — cộng phản biện bối cảnh sạch.

- Trục A — vùng tệp lệch trong bộ đệm: không lệch · chỉ ba mẫu (sửa · xoá · thêm) · ba mẫu + tệp mã · chỉ tệp mã · tệp mã
  tên giống mẫu → AC-1, AC-2
- Trục B — chế độ × ref: `--may` thẻ có · thẻ thiếu có remote · thẻ thiếu không remote · sha không có · kho giả lập lệch
  tài liệu → AC-3, AC-10
- Trục C — loại bản ghi: gốc khớp · cây phụ lệch số (gốc khớp · gốc cũ · gốc không bản ghi) · cây phụ cùng số bộ đệm lệch ·
  kho khác lệch số · mồ côi (cùng số · số cũ) · phạm vi người dùng → AC-4, AC-5, AC-6, AC-7
- Trục D — áp lối sửa: lệnh sửa · lệnh dọn · lệnh lấy thẻ · sao lưu (băm · phục hồi) · đường có dấu cách và nháy đơn ·
  bash · zsh → AC-3, AC-4, AC-5, AC-7, AC-9
- Cross-cutting: chỉ đọc → AC-8 · hành vi đời trước → AC-10
- Later: sổ khối lượng lớn (hàng trăm bản ghi — đo phút, không đo đúng sai) · `projectPath` là thư mục con của cây phụ ·
  ổ chưa gắn trông như mồ côi (đường đảo: tệp sao lưu — AC-7).
- Never: vỏ Windows — kit chỉ chạy trên vỏ POSIX.

## Out of scope

- Sửa tầng phát hành để `main` sau thẻ không chạm gốc gói, hoặc đổi chợ sang ref thẻ (design L1).
- Khoan dung «tệp không chạy» ở chế độ kho giả lập (design L3).
- Lệnh kiểm tự áp lệnh sửa hay lệnh dọn — lệnh vẫn chỉ đọc (ghi chú hàng TC4).
- Dọn bộ đệm `plugins/cache/` của bản ghi mồ côi.
- Sửa GUIDE §7.2 cho khớp đầu ra mới (sổ: dòng «chỉ khai thêm một tệp ngoài vùng»).

## Đường đo

- Ngưỡng của ô cơ hội («sổ cài và bộ đệm dựng bằng code: …»): số từ dòng `PASS:`/`FAIL:` của
  `node tests/scripts/kiem-ban-cai-loi-sua.test.mjs` · AC-1 (vàng có tên), AC-2 (đối chứng đỏ), AC-3 (lệnh lấy thẻ),
  AC-4 (lệnh sửa → chạy lại ĐẠT), AC-7 (khối mồ côi riêng).
- Reality: lần nhận kit kế tiếp ở một kho có cây phụ — số lần phải chép tay sổ cài, đọc từ ghi chú nhận kit · ngoài AC.

## Notes

- Ca đo: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs` (ca `LS-<n>` = AC-n), khoá `executors.test.kiem_ban_cai_loi_sua`.
  Không cần CLI `claude` — chế độ `--may` không gọi nó — nên tệp mang đuôi `.test.mjs` và chạy trong mảnh mjs của CI.
- Cỡ vòng: 10 tiêu chí.
- Bảng dự báo năm dòng: design §4.
