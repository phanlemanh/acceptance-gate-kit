---
schema_version: 1
feature: Phát hành kit 2.1.0 — gom hai hồ sơ TRỪ 16/08 (tin mời cổng thôi form · cổng chặn nhầm chỗ) + luật hình về một mốc, và đưa skill diagram-design vào marketplace như plugin thứ ba (vendor có pin, skin sống trong repo tiêu thụ) — để repo tiêu thụ nhận luật mới có chủ đích trước khi đợt 3 đo M1/M2
slug: release-2-1-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 3 manifest + marketplace + GUIDE/README + gói vendor + P196 + docs — không dính t3_paths
surfaces: [cli]
status: verified
approved_by: ""
approved_at: ""
veto_state: mo
veto_opened_at: 2026-08-16T14:35:32Z
---

# Acceptance Contract: release-2-1-0

## Context

Repo tiêu thụ đang chạy plugin **2.0.0** — bản không có gì của 16/08: tin mời
cổng không còn form (#57), làn V qua biên merge + ADR 0012 gỡ lớp
chứng-minh-chữ-ký (#59), luật hình DIAGRAM-RULE (#58). Đề bài đợt 3 (§1) đặt
release này làm **bước 0** và **phép đo M1 đầu tiên**: hồ sơ T2 xanh-sạch, phải
đi trọn làn V qua biên merge với 0 lượt gọi owner ngoài bấm merge.

Owner gật thêm (16/08, sau rà soát đối kháng 6 finding): **gộp plugin
`diagram-design` vào cùng mốc** để đồng đội cài một lần — kho skill cá nhân là
NGUỒN (upstream cathrynlavery MIT + bản vá cục bộ), thư mục `diagram-design/`
trong kit là **bản pin** (NOTICE ghi commit + tree-hash, CI so lại, không sửa
tay); **skin sống trong REPO** (`docs/reference/diagram-skin.md`, khuôn đóng
`DIAGRAM-SKIN-TEMPLATE`), không trong gói — vì gói dùng chung mọi repo, mọi
máy. Bản vá kho skill (LOCAL-PATCHES #7) đã commit `f205bac` trước hồ sơ này.

Hồ sơ **không đổi một dòng engine cổng** — chỉ đóng số cho engine đã ký ở #57
và #59, cộng một gói phân phối mới đứng ngoài `skills/ lib/ scripts/ hooks/`.

Source input: đề bài đợt 3 `docs/plans/2026-08-16-de-bai-dot3-nghiem-tren-vat-that.md`
§1 · quyết định owner «gộp chung một mốc» + 6 finding rà soát (transcript 16/08).

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate`
  và `feature-loop` mang `version: 2.1.0` với đoạn v2.1.0 nói đúng bốn vế
  (mời cổng một câu · làn V ở lưới như hook · ADR 0012 · gói diagram-design),
  vế tương thích feature-loop trỏ `acceptance-gate >= 2.1.0`; `diagram-design`
  mang version semver và `license: MIT`.
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó
  ghi đúng ba số ĐỌC TỪ ba manifest (một nguồn), không lệch.
- AC-3: Given cây đã sửa, When chạy đủ bốn suite, Then cả bốn XANH; số ca đọc
  từ chính suite: scripts = dòng «Results:» cuối · plugins = số dòng PASS
  (146 = 145 + P196 mới) · hooks · workflows như trước.
- AC-4: Given hồ sơ này với `veto_state: mo`, When lưới trước-merge chạy, Then
  NOTE cửa-veto có tên `release-2-1-0`, NOTE làn V có tên hồ sơ, KHÔNG
  VIOLATION nhóm veto/Gate-1 mang tên hồ sơ này. (Vế «CI clean với
  `human_signoff` rỗng» KHÔNG đứng trong Then — nó là SỐ ĐO M1 ghi ở Notes:
  đường đi khi E7 trả UNCERTAIN khai ở AC-7; gap-probe P1.)
- AC-5: Given diff của nhánh release so với base, When lọc qua allowlist ĐÓNG
  khai MỘT chỗ trong bộ răng (contract trỏ eval, không khai lại): 3 manifest ·
  marketplace · GUIDE · README · PRODUCT-MAP · `_acceptance/config.yaml` ·
  `_acceptance/release-2-1-0/*` · `diagram-design/*` ·
  `docs/reference/DIAGRAM-RULE.md` · `docs/reference/diagram-skin.md` ·
  `tests/plugins/run-tests.sh` · `docs/plans/*` · `docs/findings/*` — Then
  KHÔNG file nào ngoài allowlist; diff rỗng cũng đỏ; VÀ hai ràng buộc âm cho
  hai file «rộng»: `tests/plugins/run-tests.sh` chỉ có dòng THÊM (0 dòng
  xoá/sửa ngoài khối P196 — không sửa được P32/khoá cổng qua tests);
  `_acceptance/config.yaml` chỉ THÊM khoá `executors.script.*` (không đụng
  `risk_tiers`, `signoff`, `enforcement`, `recheck`) — mỗi chân có mutant.
- AC-6: Given gói `diagram-design/`, When P196 chạy, Then layout plugin đúng
  (`.claude-plugin/plugin.json` MIT semver · `skills/diagram-design/SKILL.md`
  · 2 lệnh · NOTICE + vendor-sync + tree-hash) · entry marketplace có ·
  **tree-hash tính lại == NOTICE** — canh DRIFT giữa cây và NOTICE (mutant đổi
  1 byte → đỏ) · **hash đổi mà version plugin không đổi → đỏ** (so với
  origin/main khi base có gói; VÀ một mutant ngay lượt này qua CHÍNH hàm so
  với cặp base giả) · **marker skin trong gói = `default`** (mutant
  `default-confirmed` → đỏ) · 0 symlink · gói KHÔNG có `hooks/`, `.mcp.json`,
  thư mục top-level ngoài {`.claude-plugin`, `skills`, `commands`} + 3 file
  {NOTICE, vendor-sync.sh, tree-hash.sh} · gói chứa `DIAGRAM-SKIN-TEMPLATE` và
  §0 trỏ `docs/reference/diagram-skin.md`. **Known-limit khai trước (gap-probe
  P1):** kho skill là repo riêng tư, CI không fetch được, nên «sửa tay rồi chạy
  lại tree-hash để cập nhật NOTICE» là ca răng KHÔNG canh được — chốt còn lại là
  luật văn trong NOTICE + review PR; P196 canh drift, không canh sửa tay.
- AC-7 (judgment): Given agent phiên sạch KHÔNG TOOL nạp inline §0 SKILL.md +
  khối DIAGRAM-SKIN-TEMPLATE + đề ca `hoi-dong/ca-E7.md` (3 ca: repo có file
  skin custom ở toplevel git, cwd sâu · repo không có file + có tokens.css ·
  người chọn default), When giám khảo chấm theo `giam-khao/dap-an-E7.md` (ô
  nhị phân có neo, trích nguyên văn), Then 3/3: đọc đúng file ở toplevel,
  không hỏi khi đã có, không lấy gì trong skill làm nguồn quyết định (neo §0:
  «Nothing else is consulted» + «Never write skin state into this skill's own
  files»); không có thì hỏi MỘT câu có khuyến nghị; ghi file vào REPO theo
  khuôn, không bao giờ ghi vào skill. Đề ca mô tả TRẠNG THÁI REPO, không mô tả
  nội dung skill (chống mớm). Inputs tách: agent = [§0 + khối TEMPLATE], giám
  khảo = [đáp án + đề ca]. **Đường đi khi UNCERTAIN (gap-probe P1):** chạy lại
  hội đồng ĐÚNG MỘT lần với đề ca không đổi; còn UNCERTAIN → hồ sơ RỜI làn
  xanh-sạch, mời owner ký, và M1 ghi = 1 lượt — đó là dữ liệu, không phải
  FAIL; cấm chạy lại tới khi xanh.
- AC-8: Given `docs/reference/DIAGRAM-RULE.md` §5 và `README.md`, When đọc,
  Then §5 hướng dẫn cài plugin (`claude plugin install diagram-design@…`), nói
  rõ nguồn/bản pin/skin-trong-repo và **dặn gỡ symlink cũ** (đường đọc-cũ:
  hai skill trùng tên → trigger đôi); README có dòng cài; kit có
  `docs/reference/diagram-skin.md` (default-confirmed) làm vật mẫu.

## Coverage

- Trục vật: manifest (AC-1) | tài liệu số (AC-2) | suite (AC-3) | làn V trên
  vật thật (AC-4) | diff-allowlist (AC-5) | gói vendor (AC-6) | hành vi §0
  (AC-7) | hướng dẫn cài + vật mẫu skin (AC-8). Bỏ quét hình thái: không gian
  là danh sách file diff đóng (entry descope).
- Hồ sơ có ĐÚNG MỘT lời hứa hành vi (§0 đọc skin từ repo) → một eval judgment
  chấm bằng hội đồng phiên sạch; PASS của hội đồng đủ cho T2 (không UNCERTAIN)
  nên đường xanh-sạch vẫn mở.

## Out of scope

- KHÔNG đổi một dòng nào trong `skills/acceptance`, `feature-loop/skills`,
  `commands/`, `lib/`, `hooks/`, `scripts/` — hồ sơ chỉ đóng số cho engine đã
  ký; đổi ở đây là lách cổng của #57/#59.
- KHÔNG re-pin hồ sơ cũ trong hồ sơ này — chiến dịch re-pin theo release chạy
  SAU merge (chính sách 7.1); riêng #59 đã ghim tới `d1dd3c5`.
- KHÔNG sửa tay gói `diagram-design/` — mọi sửa ở kho skill rồi vendor-sync;
  đó là ĐIỀU KIỆN của bất biến «kit là engine», và P196 canh.
- KHÔNG đổi DIAGRAM-RULE của repo OneHub trong hồ sơ này (repo khác) — việc
  kế: OneHub đổi §5 thành con trỏ về kit + cài plugin, ghi ở đề bài đợt 3 bước 0.
- Cập nhật plugin ở repo tiêu thụ + gỡ symlink cá nhân: SAU merge, việc của
  bước 0 đợt 3.
- Gói `acceptance-gate` (source `./`) chép trọn repo nên cache của nó nay có
  thêm 2,8 MB gói diagram-design — known-limit của cách marketplace hoạt động,
  không sửa ở đây (đường sửa: `.claudeignore`/khai `files` nếu harness hỗ trợ).

## Notes

- Đường đảo: revert PR; đồng đội đã cài diagram-design thì uninstall một lệnh.
- **Số đo M1 (đợt 3, bước 0):** hồ sơ này chạy làn V — số lượt owner gọi
  ngoài bấm merge ghi vào sổ quyết định (entry `revisit`, stage `gate2`) khi
  đóng; vế «CI clean với `human_signoff` rỗng» được đọc từ log CI của PR và ghi
  vào cùng entry. Đích: 0.
