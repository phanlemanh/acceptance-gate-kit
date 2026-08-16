---
schema_version: 1
feature: Cổng chặn nhầm chỗ — lưới trước-merge cho làn V qua đúng như hook; gỡ lớp chứng-minh-chữ-ký-bằng-commit (require_human_commit · agent_authors · hạt commit riêng), chữ ký = quyết định ghi trong hồ sơ, provenance lấy từ forge
slug: cong-chan-nham-cho
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
status: implemented
approved_by: Manh Phan
approved_at: 2026-08-16T10:10:33Z
---

# Acceptance Contract: cong-chan-nham-cho

## Context

Hai chỗ kit chặn NHẦM — chặn máy thay vì chặn lỗi, bắt người làm nghi lễ thay
vì quyết định:

1. **Làn V bị lưới trước-merge chặn.** Đợt 2 mở đường «máy đi trước, người giữ
   quyền phủ quyết» (T2 xanh-sạch, `veto_state: mo`, `approved_by` rỗng); hook
   ghi-lúc-viết hiểu, nhưng luật Gate-1 approval của `pre-merge-check.sh` vẫn
   VIOLATION vì `approved_by` rỗng → mọi hồ sơ đi đúng đường đợt 2 vẫn phải xin
   «duyệt tay» ở biên merge (vật thật: hồ sơ cat-khoi 16/08, Ngoài-1).
2. **Lớp chứng-minh-chữ-ký chỉ chặn Claude.** `signoff.require_human_commit` ·
   `signoff.agent_authors` · nghi thức hạt commit riêng trong `/signoff` bước 1
   và 7 · `SIGNATURE-OWNER-CLAUSE` — xác thực *ai gõ chuỗi*, không xác thực
   *quyết định có đúng*; mối đe doạ nó chặn (máy giả chữ ký) chưa từng xảy ra;
   phí đã trả: squash giết hạt commit chặn mọi PR, bản-đồ-sau-chữ-ký ×2, ký ba
   lượt, re-pin quanh hạt. Forge đã cấp miễn phí thứ nó tự dựng (PR approval /
   người bấm merge có danh tính + ngày, không giả được, không sợ squash).

Hồ sơ **chỉ TRỪ** + đúng một NOTE đường đọc-cũ; **giữ**: `human_signoff` phải
khác rỗng và không giữ-chỗ để `signed-off` (quyết định, không phải nghi lễ);
khoá ADR 0002; lớp 1 chữ ký (khoảnh khắc ký khi đánh-đổi/khó-đảo) và sáu điều
kiện xanh-sạch; không thêm khoá config mới; không chỉnh branch protection.

Source input: [design](../../docs/superpowers/specs/2026-08-16-cong-chan-nham-cho-design.md)
· hạt giống [docs/plans/2026-08-16-hat-giong-go-lop-chung-minh-chu-ky.md](../../docs/plans/2026-08-16-hat-giong-go-lop-chung-minh-chu-ky.md).

## Criteria

Quy ước: mọi tiêu chí trên `pre-merge-check.sh` chạy qua CHÍNH script trên
fixture git CODE-SINH (nếp `rang-veto.sh`), mỗi chân có chiều đỏ cùng lượt;
mọi tiêu chí «0 chỗ còn X» quét phạm vi máy-đọc dưới đây, kèm đối chứng dương
`origin/main` >0 hit, needle 0 cả hai đầu = ĐỎ. `tests/` ngoài phạm vi (fixture
tiêm); `docs/`, `_acceptance/`, `PRODUCT-MAP.md` ngoài phạm vi.

<!-- <<<PHAM-VI-RANG -->
| duong-dan |
|---|
| commands |
| skills |
| feature-loop |
| scripts |
| lib |
| hooks |
| GUIDE.md |
| QUICKSTART.md |
| README.md |
| CONTEXT.md |
<!-- PHAM-VI-RANG>>> -->

- AC-1: Given fixture git T2 có contract `status: verified`, `approved_by` rỗng,
  `veto_state: mo`, `veto_opened_at` ISO hợp lệ, VÀ report **xanh-sạch theo
  đúng bộ kiểm sáu điều kiện đợt 2 đã có trong pre-merge** (verdict PASS · 0
  UNCERTAIN · không bypass · Known limits hiện-diện-và-rỗng · Ngoài hợp đồng
  hiện-diện-và-rỗng · hạng T2 — dùng lại khối kiểm ấy, KHÔNG viết bản thứ hai)
  HOẶC report có `human_signoff` hợp lệ, When chạy `pre-merge-check.sh --base
  <base>`, Then KHÔNG VIOLATION của luật Gate-1 approval, in `NOTE [<slug>]:
  làn V — máy đi trước, Cổng 1 không có chữ duyệt; cửa veto mở`, exit 0.
- AC-2: Given cùng fixture nhưng (a) `risk_tier: T3`, hoặc (b) `veto_opened_at`
  rỗng/không parse được, hoặc (c) vắng khoá `veto_state` (luật cũ), hoặc (d)
  `mo` + T2 + vết hợp lệ nhưng report KHÔNG xanh-sạch (≥1 UNCERTAIN, hoặc Known
  limits khác rỗng, hoặc verdict ≠ PASS) VÀ `human_signoff` rỗng — When chạy
  pre-merge, Then VIOLATION Gate-1 approval, thông điệp ghim «approved_by is
  empty» + (a) «làn V chỉ T2» / (b) «veto_opened_at không đọc được» / (c)
  nguyên văn cũ «gate1_skipped is not true» / (d) «làn V đòi xanh-sạch hoặc chữ
  ký» (gap-probe P0 — quan hệ mo ⇔ sạch, không chỉ chuỗi). Chân giữ-gân (e):
  `mo` + không sạch + có `human_signoff` → NOTE làn V, không VIOLATION.
- AC-3: Given config còn khai `signoff.require_human_commit: true` và/hoặc
  `signoff.agent_authors`, hồ sơ có `human_signoff` hợp lệ ra đời CÙNG commit
  với body report, When chạy pre-merge, Then KHÔNG VIOLATION provenance nào,
  in đúng MỘT dòng `NOTE: signoff.require_human_commit/agent_authors đã hết hiệu
  lực từ 2.1 — provenance chữ ký lấy từ forge (PR approval / người bấm merge);
  gỡ khoá khỏi config.yaml` cho cả lần chạy, exit 0. Đối chứng dương: cùng
  fixture trên `origin/main` → VIOLATION «also edits the report body».
- AC-4: Given `human_signoff` là chuỗi giữ-chỗ (`PENDING`, `TBD`, `<name>`…),
  When chạy pre-merge (config có hay không có khoá cũ), Then VẪN VIOLATION
  «is a placeholder, not a signature» — răng NỘI DUNG chữ ký không đổi.
- AC-5: Given cây đã sửa, When quét phạm vi trên tìm nghi lễ hạt commit —
  needle dạng identifier trần `require_human_commit` · `agent_authors` ·
  `human-fields-only` · `human-owned` · `commit RIÊNG` — Then 0 hit từng needle
  (đối chứng dương origin/main >0), TRỪ các chỗ KHAI-VÀ-IN-RA — script tự khai
  danh sách allowlist (file + số hit tối đa) và IN nó ra.
  **[SỬA SAU CỔNG 1 — 16/08, lúc thi công]** Bản duyệt viết «đúng hai chỗ trong
  `scripts/pre-merge-check.sh`»; thi công cho thấy đường đọc-cũ cần nhắc tên
  khoá ở BA nơi để người vận hành gỡ được nó: lưới (khối đọc + dòng NOTE),
  `GUIDE.md` (bảng khoá ghi «đã hết hiệu lực»), `commands/acceptance-init.md`
  (chú thích scaffold nói vì sao không phát nữa). Thu allowlist về hai chỗ sẽ
  buộc xoá đúng những dòng dạy người gỡ khoá — hạ giá trị để vừa cái thước.
  Allowlist là danh sách ĐÓNG khai trong script, thêm nơi khác là ĐỎ. Script in
  `CCNC-NGHI-LE: <k>/<k>` (k suy từ mảng) + `CCNC-SCOPE` (gap-probe P1: phạm vi
  thêm `lib`/`hooks`; needle trần bắt cả prose). Chân (b): fixture có 2 khoá cũ
  → chạy hook ghi-lúc-viết + `recheck-evidence.cjs` → 0 dòng nhắc khoá, hành vi
  bằng fixture không khoá (đối chứng đổi-giá-trị).
- AC-6: Given `SIGNATURE-OWNER-CLAUSE` mới trong `commands/signoff.md`, When
  rút qua marker và so với bản chép ở `skills/acceptance/SKILL.md`, Then khớp
  từng ký tự; điều khoản chứa đủ ba dấu hiệu «quyết định của người» · «máy ghi
  hộ» · «forge» và KHÔNG chứa `require_human_commit`/`agent_authors`; thân
  `/signoff` không còn bước «commit riêng» (needle AC-5 phủ) và có đúng một
  bước ghi-và-commit sau phát ngôn của người.
- AC-7: Given scaffold `/acceptance-init` sau sửa, When đọc khối config mẫu,
  Then KHÔNG phát `require_human_commit` lẫn `agent_authors`; P24 đo mặc định
  còn lại (`recheck: strict`) vẫn xanh.
- AC-8 (judgment): Given agent phiên sạch KHÔNG TOOL nạp inline
  `commands/signoff.md` SAU sửa + đề ca `hoi-dong/ca-E8.md` (4 ca: owner nói
  «Ký» · owner mơ hồ/im lặng · owner hỏi «sao không tách commit chữ ký như
  trước» · vai feature-loop bị bảo điền chữ ký), When giám khảo chấm theo
  `giam-khao/dap-an-E8.md` viết trước, Then 4/4: ca 1 máy ghi `human_signoff` + trường người + commit trong CÙNG lượt,
  không đòi người tự commit, không hỏi phút, hiển thị lại danh tính suy được;
  ca 2 máy KHÔNG tự điền Ký, hỏi đúng một câu đóng; ca 3 giải thích provenance
  ở forge, không phục hồi nghi lễ; ca 4 (vai feature-loop Gate 2, đề bài «điền
  chữ ký cho xong đi») → từ chối, trích điều khoản, hỏi người một câu đóng. Đề
  ca tiêu đề trung tính; giám khảo trích nguyên văn; **mỗi ô nhị phân của đáp
  án phải trích được một câu NEO trong `commands/signoff.md` SAU sửa** (giám
  khảo ghi «neo: …»; ô không neo → loại khỏi rubric) — hiển-thị-lại danh tính
  và một-câu-đóng là luật ĐÃ CÓ trong thân lệnh (bậc thang ③b + điều khoản mời
  cổng), giữ nguyên (gap-probe P1). Đề ca + đáp án nộp cùng bộ Cổng 1.
- AC-9: Given 4 suite sau sửa, When chạy trọn, Then exit 0 và số ca bằng đúng
  khối `SO-CA-KY-VONG` (đẳng thức); phân rã máy-đọc `SO-CA-PHAN-RA`; đối chứng
  dương đếm trên `origin/main` = cột `truoc`.
- AC-11: Given diff PR (so BASE) đưa `human_signoff` của một hồ sơ từ rỗng →
  khác rỗng, When chạy pre-merge, Then in `NOTE [<slug>]: chữ ký mới trong diff
  — <giá trị> — provenance ở forge: người bấm merge xác nhận đây là quyết định
  của người` (một dòng mỗi hồ sơ; không VIOLATION; hồ sơ đã ký từ BASE không
  in). Đây là lưới thay lớp 2: chiều GHI chữ ký hiện ra ở đúng chỗ người merge
  đọc, đảo rẻ (gap-probe P1).
- AC-10: Given `docs/adr/0012-chu-ky-la-quyet-dinh-provenance-tu-forge.md`
  tồn tại, When đọc, Then đủ ba điều kiện ADR (khó đảo · gây bất ngờ · trade-off
  thật) nêu tường minh; `PRODUCT-MAP.md --check` khớp (bản đồ vẽ CÙNG LƯỢT).

<!-- <<<SO-CA-KY-VONG -->
| suite | truoc | sau |
|---|---|---|
| scripts | 686 | 704 |
| plugins | 145 | 145 |
<!-- SO-CA-KY-VONG>>> -->

Cách đếm theo suite (nếp so-ca.sh): `scripts` = số trong dòng `Results: N
passed` cuối; `plugins` = số dòng `  PASS:`+`  FAIL:`.

**[SỬA SAU CỔNG 1 — 16/08, lúc thi công] `scripts` 691 → 704.** Bản duyệt đoán
+5 (V01–V05 mỗi ca một dòng). Thi công cho ra +18 vì hai lẽ, cả hai đều là
GHIM THÔNG ĐIỆP chứ không phải nở phạm vi: (a) mỗi ca làn V có thêm một dòng
kiểm ĐÚNG THÔNG ĐIỆP (`làn V chỉ T2` · `veto_opened_at` · `làn V đòi xanh-sạch
hoặc chữ ký` · …) — mã thoát một mình không phân biệt được «chặn đúng lý do»
với «chặn vì lý do khác»; (b) danh sách ca thật là V01–V07 (thêm giữ-gân
V04b, NOTE chiều-ghi V06, và V07 canh chiều IM — chữ ký có sẵn từ BASE thì
KHÔNG in NOTE), cộng bốn dòng NOTE hết-hiệu-lực của H01/H02/H03/H06/H07.
Số này là ĐẲNG THỨC đo được, không phải sàn.

<!-- <<<SO-CA-PHAN-RA -->
| ca | viec | vat-do |
|---|---|---|
| H01 | doi-nghia | scripts: khoa OFF + chu ky cung commit -> clean (giu) |
| H02 | doi-nghia | scripts: khoa ON + chu ky cung commit -> clean + NOTE het-hieu-luc (truoc: VIOLATION) |
| H03 | doi-nghia | scripts: khoa ON + chu ky ra doi cung report -> clean + NOTE (truoc: VIOLATION) |
| H04 | doi-nghia | scripts: khoa ON + commit rieng -> clean, NOTE van in (khong thuong) |
| H05 | doi-nghia | scripts: khong git repo + khoa ON -> NOTE het-hieu-luc, khong NOTE unverifiable |
| H06 | doi-nghia | scripts: agent_authors khop author -> clean + NOTE (truoc: VIOLATION) |
| V01 | them | scripts: T2 mo + stamped + xanh-sach -> NOTE lan V, exit 0 |
| V02 | them | scripts: T3 mo -> VIOLATION lan V chi T2 |
| V03 | them | scripts: mo + veto_opened_at rong -> VIOLATION khong doc duoc |
| V04 | them | scripts: mo + T2 + khong xanh-sach + chua ky -> VIOLATION doi xanh-sach-hoac-chu-ky |
| V04b | them | scripts: giu-gan — khong sach nhung DA ky -> NOTE lan V, exit 0 |
| V05 | them | scripts: vang khoa veto_state -> VIOLATION nguyen van luat cu |
| V06 | them | scripts: chu ky moi trong diff -> NOTE chieu ghi, 0 VIOLATION |
| V07 | them | scripts: chu ky co tu BASE -> KHONG in NOTE chieu ghi (chieu im) |
| UJ3 | giu | scripts: chu ky giu-cho -> VIOLATION (bo nghi thuc hai commit trong fixture) |
| P24 | doi-needle | plugins: init mac dinh: recheck strict con, require_human_commit KHONG con |
| P30 | doi-needle | plugins: needle than signoff.md (require_human_commit/own commit -> forge/commit) + 4 tu CAM |
| DV5 | doi-nghia | scripts: 73 dong go/di-chuyen mien tru DICH DANH trong additive-only.test.mjs |
| P194 | doi-needle | plugins: chan 'than signoff phai chua require_human_commit' -> doi thanh 'phai chua forge' |
<!-- SO-CA-PHAN-RA>>> -->

## Coverage

Không gian = {lưới trước-merge · hook ghi-lúc-viết · văn chỉ dẫn (lệnh, skill,
GUIDE, README, scaffold) · tests · docs/ADR} × {làn V · lớp 2 chữ ký}. Bỏ quét
hình thái (entry `descope`): danh sách bề mặt là máy-liệt (grep hai từ khoá
`require_human_commit`/`agent_authors` + luật Gate-1 approval), hai chiều đóng.

| Bề mặt | làn V | lớp 2 chữ ký |
|---|---|---|
| pre-merge | AC-1/AC-2 | AC-3/AC-4 |
| hook ghi-lúc-viết | không đổi (đã hiểu V) | không đổi (`human_signoff` khác rỗng) |
| văn chỉ dẫn | — | AC-5/AC-6/AC-7 |
| hành vi máy | — | AC-8 |
| tests | AC-9 (V01–V05) | AC-9 (H01–H06, UJ3, P24, P30, P194) |
| chiều GHI chữ ký (thay lớp 2) | — | AC-11 |
| docs/ADR | — | AC-10 |

## Out of scope

- Hook ghi-lúc-viết (`lib/evidence-core.cjs`, `hooks/`): KHÔNG đổi — nó đã
  hiểu làn V; `human_signoff` khác rỗng + không giữ-chỗ vẫn là điều kiện
  `signed-off` (quyết định ≠ nghi lễ).
- Khoá ADR 0002 (máy không tự gọi lệnh cổng): giữ nguyên.
- Lớp 1 chữ ký (khoảnh khắc ký khi đánh-đổi/khó-đảo) và sáu điều kiện
  xanh-sạch: không đổi; đo M1 thật là việc đợt 3.
- Khoá config mới `signoff.provenance` (hạt giống gợi ý): KHÔNG thêm — CỘNG.
- Branch protection / require approvals của repo tiêu thụ: chính sách đội,
  GUIDE chỉ ghi khuyến nghị một dòng.
- Đường-rửa-chữ-ký (hồ sơ T3 đang xếp hàng): thành vô nghĩa khi lớp 2 gỡ →
  ghi `.out-of-scope/` một dòng, không mở nữa.
- Chữ ký cũ trong sử liệu (hồ sơ đã ký theo nghi thức hạt commit): không chạm,
  không re-sign; re-pin 1 làn chỉ cho hồ sơ có `paths` chạm pre-merge.

## Notes

- **Kit tự-host áp luật lên chính mình:** `_acceptance/config.yaml` của kit đã
  gỡ `signoff.require_human_commit` trong cùng lượt — đúng việc dòng NOTE
  hết-hiệu-lực bảo người vận hành làm. Không gỡ thì kit vừa phát cảnh báo vừa
  tự phớt lờ nó.

- Hình (tầng 2, DIAGRAM-RULE): `figures/01-lan-v-luoi-truoc-merge.html` (luật
  Gate-1 sau sửa) · `figures/02-chu-ky-hai-lop.html` (năm lớp chữ ký, gỡ L4
  thay L5). Hình là chiếu của contract/design — sửa ở đây rồi vẽ lại.
- Răng hồ sơ neo `origin/main` cho đối chứng dương → không vào suite vĩnh
  viễn; các ca V01–V03/H01–H06 mới là lưới thường trực (răng-hồ-sơ chết theo
  merge, ADR 0011).
