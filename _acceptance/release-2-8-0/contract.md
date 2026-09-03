---
schema_version: 1
feature: Phát hành kit 2.8.0 — đóng số cho vòng «vũ trang /goal lúc gọi tên» (#140), để repo tiêu thụ nhận thẻ Cổng 1 in sẵn dòng /goal và skill feature-loop vũ trang ở mọi lượt người đứng trước đoạn máy, theo mốc có chủ đích
slug: release-2-8-0
owner: manh.phan@onemount.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản GUIDE + workspace hồ sơ + bản đồ — không dính t3_paths, không đổi mã cổng
surfaces: [cli]
status: implemented
design_doc:
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-03T13:09:38Z
---

# Acceptance Contract: release-2-8-0

## Context

Kể từ mốc 2.7.0 (`f265b475`, 02/09 21:41 UTC) tới `30ae6850` (03/09 13:04 UTC),
**đúng MỘT vòng đã ký** — vòng meta duy nhất của cửa sổ, owner «gọi tên» 03/09:

- `vu-trang-goal-luc-goi-ten` (#140, 03/09, T2) — ký với giới hạn sau thu phạm vi
  ở trần ba vòng chấm (owner quyết «thu phạm vi + đổi khuôn nhỏ»). Bằng chứng
  ghim `e8f6caa9` (ghim lại lần 1 sau dòng bản ghi mốc hậu-chữ-ký).

Hai PR khác trong cửa sổ không phải vòng: #138 chiến dịch ghim lại mốc 2.7.0
(2 làn + 3 dòng thuật `acceptance-card.md`, răng khong-ve-the-ma bắt), #139 một
dòng luật (c) CLAUDE.md (trần T3 = 4, owner đọc ở dòng ký 2.7.0).

Diff của mốc, ngoài `_acceptance/`, `docs/` và bản đồ, là **mười hai file**:

- **Bốn file hành vi người dùng gặp:** `scripts/gate-card.js` (+18/−2: hằng
  `GOAL_TEMPLATE` bản chép thứ ba, `goal_line` trong `--extract`, `<div
  class="mach goal">` kề ngay sau dòng lệnh duyệt trên thẻ Cổng 1) ·
  `commands/acceptance-card.md` (bên đọc: khoá thứ tư `goal_line` + câu dẫn;
  3 dòng thuật MSG_* từ #138) · `feature-loop/skills/feature-loop/SKILL.md`
  (điểm vũ trang S1#1 · S1#5 không-phải-cổng · S1#7 gap-probe đồng bộ · Gate 1.5
  kèm /goal · bất biến dừng gọi tên báo-rồi-ngừng) · `GUIDE.md` (mục /goal: ba
  thời điểm, làn V T2 không chạm UI, brainstorm không hỏi → chưa phủ, ba bản).
- **Một file luật:** `CLAUDE.md` (luật (c): trần T3 = 4 — #139).
- **Bảy file lưới trong nhà:** `tests/plugins/run-tests.sh` (P85 ba bản ba chiều
  đỏ · P85b GOAL-ARM 15 vế) · `tests/plugins/asserts-da-go.txt` ·
  `tests/scripts/gate-card-goal.test.mjs` (mới, 7 ca GL00–GL05) ·
  `tests/scripts/gate-card-lmcms.test.mjs` (LM13/LM20 chỉ ghim hồ sơ đã chốt) ·
  `tests/scripts/gate-fixture.mjs` (mới, fixture chung) ·
  `tests/scripts/fixtures/routing-baseline.txt` · `sweep-baseline.txt` (dời từ
  hồ sơ đã ký `loi-moi-cong-may-sinh` ra chỗ đúng) — repo tiêu thụ không chạy
  suite của kit.

Không đổi schema, không cần migrate. Không file nào trong `t3_paths`; vòng #140
đi T2, Cổng Phạm vi làn V.

Người dùng kit nhận gì (đọc trong diff manifest, mục v2.8.0):

1. Thẻ Cổng 1 in **lệnh /goal thành MỘT dòng** (khuôn sáu dòng gộp lại, đã thay
   slug) ngay dưới dòng lệnh duyệt điền sẵn, và thẻ dặn dán dòng đó CÙNG câu trả
   lời — duyệt Cổng 1 đồng thời vũ trang máy chạy tới cổng kế trong cùng lượt.
   Dán là thứ thứ hai phải gõ; thẻ cho sẵn chữ, còn nó có thành một chạm hay
   không thì ba dòng số mốc kế đo, không phải mốc này. Thẻ đỏ (rơi bậc /
   g1Blocked) vẫn in; thẻ Cổng 2 không in.
2. Skill feature-loop in khối đó ở **mỗi câu xin duyệt thiết kế** của brainstorm,
   Cổng 1 và Gate 1.5; bất biến dừng gọi tên «tiến trình nền báo xong → đi tiếp
   cùng lượt; báo-rồi-ngừng là dừng ngoài thiết kế».
3. Khuôn GOAL-TEMPLATE **ba bản chép**, P85 giữ bằng nhau từng ký tự sau khi cắt
   hai đầu, ba chiều đỏ mỗi chiều gọi tên bản lệch.
4. Bản ghi mốc định tuyến/cờ vàng **dời ra `tests/scripts/fixtures/`** và chỉ ghim
   hồ sơ đã chốt — hết thuế ghim lại hồ sơ đã ký mỗi khi hồ sơ khác đổi trạng
   thái; thuế còn lại là MỘT dòng mỗi chữ ký mới (mốc này trả một lần: CI đỏ
   LM20 ngay sau chữ ký #140, sổ cái `vu-trang-goal-luc-goi-ten#29`).

Source input: `git log f265b475..30ae6850` · hồ sơ
`_acceptance/vu-trang-goal-luc-goi-ten/` (evidence-report Known limits 1–7) ·
nếp phát hành `_acceptance/release-2-7-0/` · owner phát ngôn «merge» rồi
«2.8.0» 03/09.

## Ba dòng số North Star của mốc (luật (c), lần đếm thứ tư)

Cửa sổ đếm: `f265b475` (2.7.0) → `30ae6850`. **Một vòng kit, meta, T2.** Vòng
sản phẩm quan sát được ở kho tiêu thụ trong cùng cửa sổ: Radar
`luoi-phai-thuc-su-do` (T2, ký 03/09 15:37 giờ VN). Cache plugin của Radar ở
2.7.0 và lượt cài xong sáng 03/09, trước khi vòng mở 12:13 — **suy từ mốc cài,
không có vết trong hồ sơ Radar**, nên không dùng vòng này làm phép đo cho thẻ 2.7.

| Hồ sơ | Loại | Vòng chấm | Lượt gọi người (vết) | Hạ-tầng-kit đốt lượt | Làm-xong → quyết-được |
|---|---|---|---|---|---|
| `vu-trang-goal-luc-goi-ten` (#140) | **meta**, T2 | 4 (r1 BLOCKED công cụ cắt suite · r2 PENDING triage hỏng, chết vì hạn mức phiên · r3 REJECT lớp bản ghi mốc · r4 PASS sau thu phạm vi) | **cổng luật (c): 2** (Cổng Đáng «gọi tên» `de9a4b78` · Cổng Bằng chứng `28533e99`; Cổng Phạm vi làn V `2cc7c140` = 0) · **lượt có thiết kế nhưng ngoài ba cổng: 1** (dừng-vá ở trần → «Thu phạm vi + đổi khuôn nhỏ», sổ 5001 — STOP-PATCHING-CLAUSE bắt trình người, luật (c) không đếm nó) · **hạ tầng phiên: 2** (owner gõ «Try again» hai lần: một lượt máy bị cắt giữa chừng, một lần Workflow r2 chết vì hạn mức phiên — vết hội thoại, không trong repo) · giao hàng «merge» 1, không đếm (nếp 2.7.0) | 2 (r1 · r2) | S3 xong `d96fd3ff` 11:30 → ký 19:38 = **8h08**; trên cây cuối `d9911565` 17:56 → 19:38 = **1h42** (giờ VN) |
| Radar `luoi-phai-thuc-su-do` | sản phẩm, kho tiêu thụ, T2 | 2 (r1 REJECT lưới-meta · r2 PASS) — đọc từ `run-log.jsonl` của Radar | Cổng 1 ký `80cf61b` 12:20 · Cổng 2 ký `65d2847` 15:37 với 10 mục Ngoài ghi liên tiếp mỗi phút một mục (23:00Z→23:09Z — máy ghi một lượt, không phải người quyết mười lượt) — **2 trong thiết kế có vết**; ngoài thiết kế **chưa đếm** (vết hội thoại ngoài repo này) | chưa đếm | S3 xong `88f5b9c` 13:15 → ký 15:37 = **2h22** |

- **Số lần gọi người / vòng kit: 2 ở cổng luật (c) (trần T2 là 3 — DƯỚI trần),
  cộng 1 lượt dừng-vá có thiết kế và 2 lượt hạ tầng phiên; tổng 5 lượt owner.**
  Không xếp lượt dừng-vá vào «trong thiết kế» cho vừa trần: luật (c) định nghĩa
  3 = đúng ba cổng (Đáng · Phạm vi · Bằng chứng), còn dừng-vá là lượt do
  STOP-PATCHING-CLAUSE sinh ra — có thiết kế nhưng không nằm trong ba cổng ấy.
  Hai lượt hạ tầng phiên (lượt máy bị cắt · hạn mức phiên) đều KHÔNG phải máy tự
  dừng «báo rồi ngừng» — đúng thứ vòng #140 nhắm; mục tiêu «0 ngoài thiết kế»
  vẫn chưa đạt, và phần chưa đạt nằm ngoài tầm /goal (goal không cứu phiên chết).
- **Chạm / lượt: 1** ở cả ba lượt có thiết kế (Cổng 2: một câu gộp chép nguyên).
  Chưa đo: dán dòng /goal ở Cổng 1 là thứ thứ hai phải gõ trong cùng lượt — vòng
  này không có lượt Cổng 1 nào để đo (đi làn V), nên số đó thuộc mốc kế.
- **Vòng bị hạ-tầng-kit đốt lượt chấm: 2/4** — r1 (công cụ cắt suite, đúng
  TOOL-KILL-RULE → BLOCKED) và r2 (hạn mức phiên; resume được). Cả hai không
  phải lỗi vật.
- Radar dưới thẻ 2.7.0: hai quan sát cùng lớp với sổ cái kit — (a) commit
  `96b5de3` «điền mục Ngoài hợp đồng của báo cáo — mục rỗng»: mục do máy để rỗng
  trong evidence-report trong khi thẻ đọc `review-findings.md`; (b) dấu thời gian
  sổ quyết định Cổng 2 (`23:00Z`) đứng SAU commit chữ ký (`08:37Z`) — lớp
  «at sau commit» tái phát lần 4, nay ở kho tiêu thụ. Ghi để mốc kế đếm, không
  kết luận ở đây.

### Chỗ cắt gọi tên cho cửa sổ kế (luật (c) bắt buộc)

**Họ fail-open trong phép đo + bước hậu-chữ-ký** — ô Ngoài-4 của #140 (owner
chốt «mở hợp đồng mới» ở Cổng 2): LM13/LM20 lọc «đã chốt» đứng trước răng bắt
sập · P85b vòng kiểm vị trí bỏ qua vế ngoài VI_TRI · settled() nuốt lỗi đọc ·
lệnh signoff không chạy suite scripts sau khi ghi chữ ký (CI đỏ một lần mỗi chữ
ký mới, sổ cái #29). Số: 1 CI đỏ hậu-chữ-ký/mốc này, mục tiêu 0.
Ứng viên thứ hai, chưa mở: **mục «Ngoài hợp đồng» của evidence-report do máy
điền từ `review-findings.md`** — pre-merge đọc mục đó (rỗng → «xanh-sạch, không
mời ký») trong khi thẻ đọc file kia (6 mục, mời ký); Radar vấp cùng chỗ
(`96b5de3`). Hai bộ đọc lệch về cùng hồ sơ.

Giới hạn của số này, khai thẳng: bộ đếm «lần gọi người» vẫn **đếm tay từ vết**
(commit + sổ + hội thoại) — cùng giới hạn 2.5.0→2.7.0; lượt ngoài thiết kế của
vòng Radar không đếm được từ repo này.

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.8.0`), `diagram-design` hợp semver (giữ `2.7.0`, không đổi kể từ mốc trước).
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy đủ bốn suite, Then cả bốn XANH và `product-map --check` khớp.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.8.0` và mục `v2.8.0` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.8.0` — đo trên đoạn cắt từ `v2.8.0`, sửa hay dời câu sang mục lịch sử KHÔNG được tính. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-7-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff) [thước CE: bảy mốc trước đã dùng thật] · Trục B · hành trình hồ sơ (bằng chứng | biên merge) [thước CE: `xanh_sach_check` + ADR 0012]. Ô Core → AC-1 · AC-2 · AC-3 · AC-6; không ô mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc, không có phiên đo (cùng căn cứ với release-2-3-0→2-7-0). Ngưỡng của #140 («0 lượt ngoài thiết kế do phiên dừng giữa đoạn máy») đo ở vòng ĐẦU TIÊN chạy dưới skill 2.8.0 ở kho tiêu thụ — mốc KẾ.

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/`) — mốc phát hành KHÔNG dựng răng (§7.1; bài học ba mốc 2.0.0/2.1.0/2.2.0).
- **Dựng răng riêng cho mốc.** Canh bằng ca VĨNH VIỄN P200 (mọi số đọc từ manifest, 5 đột biến + đối chứng dương) — cùng nếp 2.3.0→2.7.0.
- Nâng số `diagram-design` — không đổi kể từ mốc trước.
- **Chữ ký Cổng Phạm vi.** Mốc phát hành T2 đi làn V (tiền lệ 2.5.0→2.7.0). Người xuất hiện MỘT lần, ở Cổng Bằng chứng.
- Đếm tay lượt ngoài thiết kế cho vòng Radar — vết hội thoại không nằm trong repo này.
- Ghim lại các hồ sơ đã ký đang hoá cũ (`loi-moi-cong-may-sinh` + con trỏ thay thế cho hai bản ghi mốc đã dời) — §7.1: chiến dịch ghim lại là việc SAU khi mốc merge.
- Ô Ngoài-4 của #140 và mục «Ngoài hợp đồng» máy điền — chờ owner gọi tên, luật Giới hạn CHIỀU RỘNG.

## Notes

- Known limits: AC-1 ghim literal `2.8.0` — cố ý, số của một mốc là hằng của mốc đó; P200 vẫn đọc từ manifest (nếp từ 2.6.0).
- Known limits: chữ ký mốc này sẽ kéo một dòng bản ghi mốc định tuyến (LM20 chỉ ghim hồ sơ đã chốt) — thêm TRƯỚC khi commit chữ ký, cùng commit, để không lặp CI đỏ của #140.
- Known limits: hai quan sát Radar (mục Ngoài hợp đồng rỗng · at sau commit) là đọc từ commit/sổ của kho tiêu thụ, không phải phép đo của repo này.
- Known limits: mốc này KHÔNG có phiên phản biện context sạch độc lập — bộ phân loại an toàn của harness quá tải suốt lượt dựng hồ sơ nên không gọi được phiên tươi (cùng giới hạn #1 của 2.7.0, lần này do hạ tầng). Bù lại: phiên thi công tự soi sáu lớp lỗi tái phát và tự sửa sáu chỗ (bảng ở `gap-probe.md`), và S4 chạy qua Workflow `acceptance-verify` — có agent soi + agent phản bác độc lập trên cùng cây, thứ 2.7.0 không có.
