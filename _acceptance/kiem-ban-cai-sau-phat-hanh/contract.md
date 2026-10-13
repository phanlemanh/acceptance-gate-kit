---
schema_version: 1
feature: Mỗi bản kit vừa cắt được cài đúng tag vào một kho giả lập sạch và chạy thử một vòng chạm (tác tử chấm, thẻ cổng, lưới trước-gộp, gói dieu-phoi) trước khi phát tới kho thật; bản cài thiếu thư mục gói hay khác tag thì đỏ
slug: kiem-ban-cai-sau-phat-hanh
owner: phanlemanh@gmail.com
risk_tier: T2               # máy suy: scripts/kiem-ban-cai.mjs mới + ca đo + _acceptance/config.yaml + CHANGELOG/GUIDE — không chạm lib/**, hooks/**, pre-merge-check.sh, recheck-evidence.cjs
surfaces: [cli, docs]
design_doc: docs/superpowers/specs/2026-10-13-kiem-ban-cai-sau-phat-hanh-design.md
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-12T23:29:16Z
---

# Acceptance Contract: kiem-ban-cai-sau-phat-hanh

## Context

Hàng KC1 của lộ trình kit, vòng meta duy nhất giữa 2.28 và mốc kế (chủ kho gọi tên 12/10). Mốc 2.27 phát tới
kho thật một bản cài thiếu `feature-loop/agents/` (A1 chưa chạy sống: 38 lượt / 17 hồ sơ ghi `loai-tac-tu-vang`)
và một bản «2.27.0» là main 294b29d chứ không phải tag. Đo 13/10: chợ plugin của kit là kiểu thư mục trỏ bản
checkout, bộ đệm khoá theo số — `update` báo «đã mới nhất» mà giữ nội dung cũ. Vòng này dựng một lệnh cài
ĐÚNG ref vào cấu hình Claude cách ly + kho giả lập sạch do code sinh, chạy một vòng chạm từ bản cài, và cắm nó
vào mọi lượt chấm của kit. Ô: `_acceptance/kiem-ban-cai-sau-phat-hanh/opportunity.md`.

## Criteria

- AC-1: Given cấu hình Claude thật của máy (`installed_plugins.json` và `known_marketplaces.json` dưới `~/.claude/plugins/`), When chạy `node scripts/kiem-ban-cai.mjs --ref HEAD` rồi `--may --ref HEAD`, Then hai tệp ấy tồn tại, khác rỗng, và băm trước/sau bằng nhau, cùng danh sách tên · cỡ · mtime dưới `plugins/cache/` và `plugins/marketplaces/` của cấu hình thật bằng nhau (phép chụp chứng được độ nhạy: chạm một byte trong bản sao tạm thì ảnh chụp khác); mọi lệnh `claude plugin` của chế độ giả lập chạy dưới `CLAUDE_CONFIG_DIR` tạm; kho giả lập là thư mục tạm do code sinh (`git init -b main`, `_acceptance/config.yaml`, một hồ sơ) và bị dọn khi xong (không còn trên đĩa trừ khi có `--giu`).
- AC-2: Given nguồn cài là `git archive` nguyên vẹn của HEAD, When chạy `--ref HEAD`, Then thoát 0; đủ tám dòng `ĐẠT` theo đúng thứ tự `so-phien-ban · khop-tag · thu-muc-goi · tac-tu-cham · hook-goi · the-cong · luoi-truoc-gop · dieu-phoi`; dòng `so-phien-ban` nêu ĐÚNG các gói của `.claude-plugin/marketplace.json` tại ref, mỗi gói kèm số đọc từ `plugin.json` của nó; dòng cuối `[kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8`.
- AC-3: Given nguồn cài là bản sao HEAD bỏ thư mục `feature-loop/agents/`, When chạy `--ref HEAD --nguon-cai <bản sao>`, Then thoát 1; dòng `ĐỎ thu-muc-goi` chứa «THIẾU thư mục gói: feature-loop/agents»; dòng `ĐỎ tac-tu-cham` chứa «tác tử chấm vắng trong bản cài: feature-loop:cham-lenh»; dòng TỔNG KẾT bắt đầu «ĐỎ» và kể tên hai mục ấy; và hai bản sao khác — `agents/cham-lenh.md` mang `name: sai-ten` · `agents/cham-doc.md` mang `tools:` có `Edit` — mỗi bản cho `ĐỎ tac-tu-cham` nêu đúng tệp ấy và nguyên nhân («name không khớp» · «tác tử chấm cầm bút: Edit»); đối chứng dương AC-2 xanh trong cùng lượt chạy ca.
- AC-4: Given nguồn cài là bản sao HEAD mà một tệp (`scripts/gate-card.js`) có thêm một dòng chú thích, When chạy `--ref HEAD --nguon-cai <bản sao>`, Then thoát 1; dòng `ĐỎ khop-tag` chứa «bản cài khác tag» và tên `acceptance-gate:scripts/gate-card.js`; dòng `thu-muc-goi` vẫn `ĐẠT` (hai lớp lỗi không lẫn nhau); tệp có trong bản cài mà KHÔNG có trong cây của ref (thừa) không làm đỏ — chúng hiện thành dòng `VÀNG khop-tag` nêu số tệp/thư mục thừa.
- AC-5: Given năm bản sao HEAD, mỗi bản phá đúng một mắt của vòng chạm — `scripts/gate-card.js` thoát 1 ngay dòng đầu · `scripts/pre-merge-check.sh` thoát 0 ngay dòng đầu (lưới câm) · `scripts/pre-merge-check.sh` thoát 1 ngay dòng đầu (lưới chặn tất) · `dieu-phoi/scripts/dieu-phoi.mjs` thoát 1 ngay dòng đầu · `hooks/hooks.json` thêm một lệnh trỏ `${CLAUDE_PLUGIN_ROOT}/hooks/khong-co.js`, When chạy kiểm với từng bản làm nguồn cài, Then mỗi lượt thoát 1 và dòng ĐỎ đúng mục của mắt bị phá (`the-cong` · `luoi-truoc-gop` với «lưới không chặn hồ sơ phạm luật» · `luoi-truoc-gop` với «kho lành bị chặn» · `dieu-phoi` · `hook-goi` nêu `hooks/khong-co.js`), các mục chạm khác `ĐẠT`.
- AC-6: Given tag phát hành mới nhất mà HEAD chứa (`git describe --tags --abbrev=0 --match 'v*'` — hôm nay `v2.28.0` = 72eb55f3), When chạy `node scripts/kiem-ban-cai.mjs --ref <tag ấy>`, Then thoát 0 và dòng cuối `[kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — <tag> (<sha8>) cài đúng tag`.
- AC-7: Given một cấu hình Claude giả (`CLAUDE_CONFIG_DIR` tạm) mà `feature-loop` được cài từ nguồn lệch một tệp rồi «cập nhật» theo đường cũ (`marketplace update` + `plugin update`) sang nguồn đúng của HEAD, When chạy `--may --ref HEAD` với cấu hình ấy, Then thoát 1 và có dòng `ĐỎ may:` cho `feature-loop@acceptance-gate-kit` chứa «khác tag» (ca M5 tái hiện); sau khi gỡ rồi cài lại, cùng lệnh thoát 0 với dòng `ĐẠT may:` «khớp»; một bản ghi mang số khác số của ref in dòng `VÀNG may:` «khác số» mà không đổi mã thoát; và bản cài lấy từ một bản checkout thật của HEAD (`git worktree`) có thêm một tệp chưa theo dõi và một tệp bị bỏ qua → `ĐẠT may:` «khớp» kèm số tệp thừa, còn cùng bản checkout sửa một tệp đang theo dõi → `ĐỎ may:` «khác tag».
- AC-8: Given (a) `PATH` là một thư mục tạm chỉ chứa liên kết tới `node` và `git` (ca khẳng định `claude` vắng dưới PATH ấy trước khi chạy), (b) ref không tồn tại, When chạy `--ref …`, Then thoát 2; dòng TỔNG KẾT chứa «KHÔNG CHẠY ĐƯỢC» kèm nguyên nhân (a) «không tìm thấy lệnh claude» (b) «ref không có»; không dòng nào bắt đầu `ĐẠT` hay `TỔNG KẾT: ĐẠT`.
- AC-9: Given `_acceptance/config.yaml` của kit, When đọc bằng bộ đọc config của kit, Then `executors.test.kiem_ban_cai` = `node tests/scripts/kiem-ban-cai.ca.mjs`, `executors.test.kiem_ban_cai_moc` = `node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc`, và `feature_loop.suite_keys` chứa `executors.test.kiem_ban_cai_moc` mà KHÔNG chứa `executors.test.kiem_ban_cai`; và trên các bản sao kit do code sinh (`git archive HEAD` → kho git tạm, commit gốc trên `main`, nhánh `f`) chạy CHÍNH tệp ca của bản sao với `--chi-luot-moc`: (im) `f` chỉ sửa một tệp tài liệu, số giữ nguyên → đúng một dòng `BỎ QUA: KB — không phải lượt cắt mốc`, thoát 0, không có dòng «cấu hình cách ly» (không cài gì); (đỏ) `f` đổi số trong `.claude-plugin/plugin.json` và xoá `feature-loop/agents/` → thoát 1, có «tác tử chấm vắng trong bản cài» nêu `feature-loop:cham-lenh` và «TỔNG KẾT: ĐỎ» (cây cắt mốc đã mất thư mục thì bản cài khớp cây ấy — lớp lỗi A1 bị mục tác tử chấm bắt); (đối chứng dương) `f` chỉ đổi số → thoát 0, «TỔNG KẾT: ĐẠT 8/8»; (không dò) bản sao không có nhánh `main` → hàm nhận diện trả «chạy trọn»; và (judgment) CHANGELOG mục chưa phát hành + GUIDE nói người cắt mốc chạy `--ref v<số>` sau khi cắt tag, máy nhận chạy `--may --ref v<số>` sau khi cài (thay khối lệnh `node -e` của bước 3 mục A1), đọc dòng TỔNG KẾT chứ không đọc mã thoát một mình, và khai các giới hạn của design §4.

- AC-10: Given cấu hình Claude giả mà MỌI bản ghi của chợ kit mang số khác số của ref (máy nhận chưa có bản mới — vd cài từ nguồn có `plugin.json` số 0.0.1), When chạy `--may --ref HEAD`, Then thoát 1 và dòng cuối bắt đầu `[kiem-ban-cai] TỔNG KẾT: ĐỎ` chứa «không bản ghi nào mang số của» ref; và trên cùng cấu hình, cài thêm một gói đúng số của ref mà nguồn riêng không chứa tệp đã sửa (dieu-phoi) → cùng lệnh thoát 0 (đối chứng dương: luật chỉ đỏ khi KHÔNG bản ghi nào được so).
- AC-11: Given (a) `--root` không kèm giá trị, (b) một nguồn cài mà `.claude-plugin/marketplace.json` tại ref không phải JSON (bản sao kit có commit làm hỏng tệp ấy), (c) sổ cài `installed_plugins.json` của cấu hình giả không phải JSON, When chạy lệnh kiểm, Then mỗi ca thoát 2 và dòng cuối chứa «TỔNG KẾT: KHÔNG CHẠY ĐƯỢC» kèm nguyên nhân; không ca nào thoát 1 hay in vết ngăn xếp không có dòng TỔNG KẾT; và lỗi bất ngờ khác trong lệnh (không thuộc loại đã gọi tên) cũng đi đường thoát 2 với dòng TỔNG KẾT nêu thông điệp lỗi.
- AC-12: Given nguồn cài là bản sao HEAD mà `feature-loop/.claude-plugin/plugin.json` mang số khác số tại ref, When chạy `--ref HEAD --nguon-cai <bản sao>`, Then thoát 1; dòng `ĐỎ so-phien-ban` chứa «feature-loop: cài <số bản sao>, ref <số tại ref>»; dòng ấy KHÔNG dựng từ cùng nguồn số với lệnh — ca so với số đọc từ `git show HEAD:feature-loop/.claude-plugin/plugin.json` và số viết sẵn của bản sao.

## Coverage

Bỏ quét bằng `morphological-scan` — sổ `d-20261012T231539Z-1` (ý định chủ kho đã liệt kê đủ bốn mắt chạm và hai lớp đỏ). Trục
ghi tay, mỗi giá trị có ca:

- Trục A — nguồn cài: tag nguyên vẹn · HEAD nguyên vẹn · thiếu thư mục · lệch một tệp · lệch số → AC-2, AC-3, AC-4, AC-6, AC-7
- Trục B — mắt chạm: tác tử chấm (vắng · sai tên · cầm bút) · thẻ cổng · lưới trước-gộp (câm · chặn tất) · gói dieu-phoi · hook của gói → AC-2, AC-3, AC-5
- Trục C — chế độ: kho giả lập · máy thật (khớp · khác tag · khác số · checkout thật có tệp ngoài git) → AC-2, AC-7
- Trục D — không chạy được: thiếu CLI · ref không có → AC-8
- Nâng phạm vi ở Cổng Bằng chứng lượt 1 (sổ gate2): máy nhận chưa có bản mới → AC-10 · lỗi bất ngờ đi đường «không chạy được» → AC-11 · ca đỏ của mục số phiên bản → AC-12
- Cross-cutting: không chạm máy thật → AC-1 · răng phát hành chỉ ở lượt cắt mốc (khoá suite có cổng số phiên bản: bằng · khác · không dò được) + lời dặn sau-tag → AC-9

## Đường đo

- Mốc 2.29.0 cắt với kiểm bản cài XANH trên tag · số từ: dòng TỔNG KẾT của `kiem-ban-cai.mjs --ref v2.29.0`, dán
  vào hồ sơ `release-2-29-0`; và khoá `kiem_ban_cai_moc` chạy TRỌN (không phải dòng BỎ QUA) và xanh trong lượt
  chấm mốc · AC-2, AC-6, AC-9.
- 0 lỗi «khác tag»/«thiếu thư mục gói» tới kho thật · số từ: dòng `ĐỎ may:` của `--may --ref v2.29.0` chạy ở
  máy nhận đầu tiên (crm, Mac Studio) sau khi cài — đếm 0 là SỐNG · AC-7.
- Tác tử chấm sống ở bản cài · số từ: `grep -c '"kind":"loai-tac-tu-vang"' _acceptance/<slug>/run-log.jsonl`
  trước/sau lượt chấm đầu tiên ở kho nhận — không tăng · reality, ngoài AC (design §4).

## Out of scope

- Đổi chợ plugin của kit từ kiểu thư mục sang kiểu git — đổi mặc định của mọi máy (sổ `d-20261012T231539Z-5`).
- Mở phiên Claude thật để nạp tác tử chấm (tốn lượt model, cấu hình cách ly không đăng nhập) — đo tĩnh, giới hạn khai.
- Chạy kiểm trên CI GitHub — runner không có CLI `claude`.
- Ba hạt giống 13/10: KK-8 ném lỗi khi cây bẩn · ca Chrome của xem-trang-lo-trinh chập chờn · thẻ cổng đổi chữ khi dựng song song — không trace thẳng về ý định cài-đúng-tag.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ca đo: `tests/scripts/kiem-ban-cai.ca.mjs` (ca `KB-<n>` = AC-n), khoá `executors.test.kiem_ban_cai` (luôn chạy trọn —
  eval của hồ sơ này) và `executors.test.kiem_ban_cai_moc` (cổng số phiên bản — vào suite_keys);
  đuôi `.ca.mjs` để không lọt vào các mảnh `*.test.mjs` của CI. Mọi nguồn cài bị tiêm dựng từ `git archive HEAD`
  trong lượt; đường dẫn suy từ vị trí tệp ca; mỗi ca đỏ chạy SAU khi KB-2 (bản lành) xanh trong cùng lượt và
  ghim thông điệp.
- Cỡ vòng: 12 tiêu chí — trong khung 8–12 (AC-10…12 nâng phạm vi ở Cổng Bằng chứng lượt 1).
- Bảng dự báo năm dòng (design §3): làm-xong→quyết-được = · lượt gọi người = · vòng bị hạ tầng đốt lượt chấm ↓ ·
  token máy = · phút máy/lượt chấm: vòng thường = (+<1 s), lượt cắt mốc ↑ ~1–2′. Điều kiện tin cậy: đường verdict
  không đổi thành phần.
- Giới hạn đã khai (gap-probe P1 thứ hai, hoãn): hồ sơ của kho giả lập do `kiem-ban-cai.mjs` của HEAD viết theo khuôn
  `schema_version: 1` tối thiểu, không do bên-viết của bản cài sinh — kho khách khởi tạo hồ sơ bằng phiên Claude điền
  khuôn chữ, không có bộ sinh máy để gọi. Khuôn giữ tối thiểu để bản cài của tag cũ vẫn đọc được; HEAD đổi khuôn mà
  tag cũ không đọc được thì KB-6 ĐỎ (không im). Ngưỡng mở ô: ≥1 lần KB-6 đỏ vì khuôn hồ sơ giả lập, không vì bản cài.
- Known limits (Cổng Bằng chứng lượt 1, Ngoài-2): chú thích đầu `evals.yaml` nói khoá `kiem_ban_cai` nằm trong suite_keys —
  thật ra khoá `kiem_ban_cai_moc` mới nằm ở đó (cấu hình và ca KB-9 đúng).
- Known limits (Ngoài-4): ảnh chụp KB-1 bỏ tệp đánh dấu `.in_use`, nên nếu chế độ máy thật quay lại gọi CLI (làm mới
  `.in_use`) thì KB-1 vẫn xanh; ca cũng không kiểm kết quả của lượt `--may` trong KB-1. Nội dung bản cài thật không đổi.
- Known limits (Ngoài-6): mục tác tử chấm ĐẠT khi workflow đã cài không gọi tên loại tác tử nào (đổi cách khai tên thì
  mục không kiểm gì mà vẫn xanh).
- Known limits (Ngoài-7): câu OOS-3 trên thẻ Cổng Phạm vi từng nói kiểm chạy ở mọi lượt chấm — đã sửa trong
  `card-plain.json` trước khi trình Cổng Bằng chứng; thẻ Cổng Phạm vi đã trình 13/10 sáng mang câu cũ.
