---
schema_version: 1
feature: Phát hành kit 2.9.0 — đóng số cho ba vòng sửa của cửa sổ 2.8→2.9 (PR 146 inputs-tinh-tu-goc-kho · 149 co-qua-timebox-nhom-da-xong · 151 thuoc-khai-mot-dang-do-mot-neo), bộ audit 05/09 + giấy phép MIT, và bộ tài liệu playbook 07/09 — để repo tiêu thụ nhận bộ máy theo mốc có chủ đích
slug: release-2-9-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản GUIDE + một khoá config workspace + hồ sơ + bản đồ — không dính t3_paths, không đổi mã cổng
surfaces: [cli]
status: verified
design_doc:
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-07T10:43:47Z
---

# Acceptance Contract: release-2-9-0

## Context

Kể từ mốc 2.8.0 (`cd94d004`, 03/09 22:31 UTC) tới `0226edde` (07/09 17:41 UTC),
**mười ba PR** gộp vào `main` (`git log --merges --grep='Merge pull request' cd94d004..0226edde` = 13;
`--merges` trần đếm 17 vì có bốn lượt gộp nhánh nội bộ). Ba trong số đó là **vòng sửa** — cả ba đều T2:

- `inputs-tinh-tu-goc-kho` (#146, 05/09) — ca thật từ kho crm: `s4-args.mjs` giải
  `inputs` của eval judgment theo thư mục hồ sơ trong khi skill viết theo gốc kho,
  hội đồng đọc file rỗng. Ký với năm giới hạn sau khi owner nâng phạm vi hai mục
  ở Cổng Bằng chứng vòng 2 (AC-7/AC-8, S3 mở lại, vòng 3).
- `co-qua-timebox-nhom-da-xong` (#149, 06/09) — CI đỏ trên `main` tại RT13: cờ
  `qua-timebox` không cắt qua nhóm «đã xong». Đi **làn V trọn vòng** — không
  chữ ký người nào, hồ sơ dừng ở `status: verified`.
- `thuoc-khai-mot-dang-do-mot-neo` (#151, 06/09) — hai finding HIGH ngoài hợp
  đồng của #149 thành hồ sơ riêng: răng lane có chiều đỏ sống, P86 so quan hệ.
  Bảy vòng chấm, dừng-vá ở vòng 2, hết trần ở vòng 3, owner **thu phạm vi**;
  ký với ba nợ có tên.

Mười PR còn lại không phải vòng: #142 chiến dịch ghim lại mốc 2.8.0 · #143 ô
Cổng Đáng `vong-la-mot-ket-qua` (ký build 04/09) · #144 audit tài liệu 05/09 +
ADR 0013 · #145 LICENSE thuần MIT + NOTICE · #147 chip sổ vấp crm · #148 hạt
giống «việc kế theo plan» · #150 vẽ lại bản đồ · #152 bộ tài liệu playbook 07/09
(bốn hạt giống + bốn ô discovery) · #153 handoff đổi máy · #154 luật nới 07/09
«vế không CỘNG tạm ngưng» vào `CLAUDE.md` (owner tự quyết câu hỏi treo của handoff §6,
cùng ngày; có ngày + ba vế không đổi + điều kiện thu hồi).

Diff của mốc, ngoài `_acceptance/`, `docs/` và bản đồ, là **mười chín file** (cặp +/− đọc từ `git diff --numstat cd94d004..0226edde`):

- **Ba file hành vi máy chạy:** `feature-loop/scripts/s4-args.mjs` (+31/−2:
  `resolveJudgmentInput` — inputs tính từ gốc kho, vắng hoặc là thư mục → exit 2
  gọi tên, miễn trừ có khai cho `evidence/**` của chính hồ sơ) ·
  `scripts/start-scan.mjs` (+15/−5: cờ `qua-timebox` tính TRƯỚC lối phán quyết
  giá trị và gắn vào cả ba lối «đã xong») · `feature-loop/skills/feature-loop/SKILL.md`
  (một câu ở khoản S4 args: luật gốc-kho).
- **Hai file skill bên đọc:** `skills/acceptance/SKILL.md` (luật 3b) ·
  `skills/acceptance/references/eval-executors.md` (ví dụ + đoạn luật một gốc).
- **Hai manifest:** `license` Proprietary → MIT (#145); mốc này bump `version`
  và thêm mục `v2.9.0`.
- **Một file luật:** `CLAUDE.md` (+15/−0: luật nới 07/09 — #154).
- **Sáu file văn bản:** `GUIDE.md` (§0 «Bốn cổng người» thành nguồn có marker
  `GATE-MODEL`; ngân sách lượt gọi người; §7.1 gỡ câu chết) · `README.md` (bản
  chép EN + mục Licence) · `QUICKSTART.md` (bản chép VI; repo public) ·
  `feature-loop/README.md` (bốn cổng thay «2 điểm dừng») · `LICENSE` · `NOTICE`.
- **Một hồ sơ bác:** `.out-of-scope/doi-chieu-playbook-ai-native.md`.
- **Bốn file lưới trong nhà:** `tests/plugins/run-tests.sh` (+186: P86 GATE-MODEL
  so quan hệ, 14 đột biến) · `tests/plugins/ra-co-ten.test.mjs` (RT13: 7 fixture
  + 3 mutant) · `tests/scripts/s4-args-judgment-inputs.test.mjs` (mới) ·
  `tests/scripts/fixtures/routing-baseline.txt` (+5: hai dòng chữ ký #146/#151).

Không đổi schema, không cần migrate. Không file nào trong `t3_paths`; cả ba vòng
đi T2. Mốc này thêm MỘT khoá config workspace (`executors.script.p200_cat_so`) để
eval của hồ sơ mốc ghim đúng ca P200 thay vì mã thoát trọn suite — khoá vĩnh
viễn, không phải răng riêng (Ngoài-6 của 2.8.0).

Người dùng kit nhận gì (đọc trong diff manifest, mục v2.9.0):

1. **Hội đồng không còn đọc file rỗng.** `inputs` của eval judgment tính từ
   GỐC KHO, cùng gốc với `paths`; input vắng trên đĩa hoặc là thư mục → bước
   sinh args dừng, exit 2 gọi tên eval + file, in luôn cách viết lại nếu file có
   ở đường cũ theo hồ sơ. Miễn trừ duy nhất, có khai một dòng: `evidence/**`
   của chính hồ sơ đang chấm (eval giao diện cùng vòng sinh ra). Skill acceptance
   (luật 3b) và tài liệu eval-executors nói cùng một luật.
2. **Lệnh /start không làm biến mất việc quá hạn.** Cờ `qua-timebox` cắt qua
   cả nhóm «đã xong» (park/bác · archived · đã có phán quyết giá trị).
3. **Mô hình cổng có MỘT nguồn:** GUIDE §0 với khối `tsv` máy đọc; README (EN)
   và QUICKSTART (VI) là bản chép, P86 giữ khớp và gọi tên bản lệch — và P86 nay
   đo đúng vật được giao (chiều đỏ của răng lane chạy trên cây hôm nay; ngân
   sách mốc phát hành so QUAN HỆ với bảng nguồn, không hỏi chữ số có mặt).
4. **Mở thật dưới MIT** — LICENSE thuần MIT, hai cây vendor khai ở NOTICE (ADR
   0013), repo public, hai manifest `license: MIT`.

Source input: `git log cd94d004..0226edde` · ba hồ sơ vòng sửa (`decisions.jsonl`
+ `run-log.jsonl` + evidence-report) · `gh run list` ba nhánh · nếp phát hành
`_acceptance/release-2-8-0/` · handoff 07/09 §4.1 (owner gật thứ tự: «phát hành
2.9.0 làn V» là việc số 1).

## Ba dòng số North Star của mốc (luật (c), lần đếm thứ năm)

Cửa sổ đếm: `cd94d004` (2.8.0) → `0226edde`. **Ba vòng kit, cả ba meta, T2** —
**vượt trần một-vòng-meta của luật (b)**; đó là lý do việc kế duy nhất còn đúng
luật là gom về mốc, không mở ô nào nữa trước mốc. Không vòng sản phẩm nào ở kho
tiêu thụ được quan sát trong cửa sổ này từ repo này.

| Hồ sơ | Vòng chấm | Lượt gọi người (vết) | Hạ-tầng-kit đốt lượt chấm | Làm-xong → quyết-được (giờ VN) |
|---|---|---|---|---|
| `inputs-tinh-tu-goc-kho` (#146) | 3 (r1 BLOCKED `cannot_run` suite plugins rồi chạy lại cùng vòng → REJECT · r2 PASS · r3 PASS sau mở lại S3) | **cổng luật (c): 2** — Cổng Bằng chứng vòng 2 `06:20Z` (nâng phạm vi Ngoài-3/4) và vòng 3 `07:19Z` (ký); Cổng Phạm vi làn V = 0 · dừng-vá: 0 | 1 (r1 lượt đầu: suite plugins `cannot_run`, chạy lại cùng vòng) | S3 xong `c210e327` 09:01 → ký `54cec058` 14:19 = **5h18**; trên cây cuối `631461e7` 13:23 → 14:19 = **56'** |
| `co-qua-timebox-nhom-da-xong` (#149) | 3 (r1 PASS · r2 REJECT · r3 PASS) | **0** — làn V ở cả hai cổng, `human_signoff` rỗng, merge ở `status: verified`; owner gõ «merge» không đếm (nếp 2.7.0) | 1 (r1 xanh vì args được chỉnh ngoài đường máy ở lượt dispatch — bằng chứng E6 chưa đi qua s4-args; r2 bắt đúng, gốc là bộ giải config đọc theo dòng không gỡ `\"`) | S3 xong `8428f30c` 11:14 → máy thông `52579f91` 13:13 = **1h59** |
| `thuoc-khai-mot-dang-do-mot-neo` (#151) | 7 (r1 REJECT · r2 REJECT → dừng-vá · r3 BLOCKED + cùng lớp lần 3 → hết trần · r4 PENDING · r5 PASS · r6 REJECT · r7 PENDING-JUDGMENT, `triage_failed`) | **cổng luật (c): 1** (Cổng Bằng chứng `13:00Z`, chín mục Ngoài ghi liên tiếp mỗi phút — máy ghi một lượt) · **dừng-vá có thiết kế: 2** (STOP-PATCHING `09:30Z` → owner đổi khuôn; hết trần `10:20Z` → owner thu phạm vi) | 2 (r3: một agent chết ở lệnh P86 · r6: E8 đỏ là nhiễu — agent verify sửa cây trong lúc chạy, sổ `12:02Z`) | S3 xong `d99c1a28` 15:04 → ký `206e0d63` 21:50 = **6h46**; trên cây cuối `19abfcd7` 19:47 → 21:50 = **2h03** |

- **Số lần gọi người / vòng kit: 2 · 0 · 1 ở cổng luật (c) — cả ba DƯỚI trần T2
  (3); cộng 2 lượt dừng-vá có thiết kế ở #151 (STOP-PATCHING-CLAUSE và trần ba
  vòng bắt trình người, luật (c) không đếm vào ba cổng).** Tổng lượt owner có vết
  trong repo: **5 trên ba vòng**. Lượt hạ tầng phiên (owner gõ «Try again», phiên
  chết) **chưa đếm** — vết hội thoại, không nằm trong repo này; cùng giới hạn
  2.5.0→2.8.0.
- **Chạm / lượt: 1** ở cả ba lượt cổng luật (c) — đọc từ sổ: #151 chín mục Ngoài +
  cắt/hoãn + Treo ghi `13:00Z→13:09Z` mỗi phút một mục (máy dịch một câu gộp);
  #146 vòng 3 «đồng ý như khuyến nghị» một entry. Lượt dừng-vá: owner phát ngôn
  một chữ («đổi khuôn», «thu phạm vi») — 1 chạm. Dán dòng /goal ở Cổng 1 (số
  hứa đo ở mốc này từ 2.8.0): **không đo được** — cả ba vòng đi làn V ở Cổng
  Phạm vi, không có lượt Cổng 1 nào để đếm; số đó trượt sang mốc kế lần thứ hai.
- **Vòng bị hạ-tầng-kit đốt lượt chấm: 4/13** — #146 r1 (suite `cannot_run`),
  #149 r1 (xanh giả vì args chỉnh ngoài đường máy), #151 r3 (agent chết) và r6 (nhiễu agent sửa
  cây). Không lượt nào là lỗi vật.
- **CI đỏ hậu-chữ-ký: 3** (số mà 2.8.0 gọi tên với mục tiêu 0) — #146 commit
  chữ ký `54cec058` đỏ, xanh lại ở ghim lại `760a8704`; #151 commit chữ ký
  `206e0d63` đỏ, commit dòng định tuyến `6d478c80` đỏ, xanh lại ở ghim lại
  `120d9346`. Đọc từ `gh run list` của hai nhánh. Cùng một vòng khép kín 2.8.0
  đã khai (Ngoài-7): thêm dòng định tuyến sau khi ký → hồ sơ hoá cũ → ghim lại.
  Bài học «thêm dòng TRƯỚC, cùng commit chữ ký» của 2.8.0 **không được lặp ở
  #146 lẫn #151** — lời dặn trong Known limits không tới được vòng sau; đúng
  lớp «dặn-bằng-lời làm nghiệm» mà CLAUDE.md cấm.
- **Hai quan sát cùng họ với chỗ cắt gọi tên:** (a) #149 đi làn V trọn vòng với
  hai mục «Known limits» / «Ngoài hợp đồng» **rỗng** trong evidence-report — bằng
  chứng «xanh-sạch» được thoả bằng sự VẮNG MẶT của dữ liệu, đúng bẫy Ngoài-3 của
  2.8.0, nay đã nổ thật ở một hồ sơ merge; (b) #151 ký ở `PENDING-JUDGMENT` với
  `triage_failed: true` — người ký đọc trọn danh sách findings thay máy, đúng
  thiết kế nhưng là lượt đọc dài nhất cửa sổ.

### Chỗ cắt gọi tên cho cửa sổ kế (luật (c) bắt buộc)

**Ô «Đường lùi phải sống»** — kế thừa nợ Ngoài-4 của #140 (cửa sổ 2.8→2.9 không
trả được vì tiêu ba vòng sửa), gom năm mục cùng câu hỏi *làn máy-đi-trước có đường
lùi thật không?*: (a) lời mời cổng in «veto: lý do» mà lệnh ký không nhận · (b) ô kết
`machine-cleared` có bộ đọc, chưa có đường ghi (#149 là ca thật: merge ở
`verified`, không ai phân biệt được với «chờ ký») · (c) «không soi lại được» là
NOTE kể cả chế độ nghiêm · (d) làn V thoát phép kiểm bằng-chứng-cũ · (e) lệnh ký
không chạy suite → CI đỏ hậu-chữ-ký (3 ở cửa sổ này, mục tiêu 0). Gom hai ô
discovery đang lẻ (`lan-may-thong-duong-ghi` · `lan-v-thoat-kiem-stale`) và hai
mục «mở hợp đồng mới» của #151 (Ngoài-2: Known limits rỗng bỏ mời ký — chính (b)
+ bẫy 2.8.0 · Ngoài-4: `s4-args.json` commit lệch với `evals.yaml`). Cắt hai
lát: lát 1 = đường ghi (a, b) · lát 2 = fail-open ở chốt (c, d, e). Số đếm cho
cửa sổ kế: CI đỏ hậu-chữ-ký/mốc (3 → 0) và số hồ sơ merge với hai mục rỗng (1 → 0).
Hồ sơ nguồn: `docs/findings/2026-09-07-tong-hop-hat-giong-va-o.md` §2 lớp I.

Giới hạn của số này, khai thẳng: bộ đếm «lần gọi người» vẫn **đếm tay từ vết**
(commit + sổ + `gh run list`) — cùng giới hạn 2.5.0→2.8.0; lượt ngoài thiết kế
do hạ tầng phiên không đếm được từ repo này.

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.9.0`), `diagram-design` hợp semver (giữ `2.7.0`, không đổi kể từ mốc trước).
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy đủ bốn suite, Then cả bốn XANH và `product-map --check` khớp.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.9.0` và mục `v2.9.0` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.9.0` — đo trên đoạn cắt từ `v2.9.0`, sửa hay dời câu sang mục lịch sử KHÔNG được tính. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-8-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff) [thước CE: tám mốc trước đã dùng thật] · Trục B · hành trình hồ sơ (bằng chứng | biên merge) [thước CE: `xanh_sach_check` + ADR 0012]. Ô Core → AC-1 · AC-2 · AC-3 · AC-6; không ô mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận bộ máy theo mốc, không có phiên đo (cùng căn cứ với release-2-3-0→2-8-0). Ngưỡng #140 («0 lượt ngoài thiết kế do phiên dừng giữa đoạn máy») và số «dán /goal có thành một chạm» vẫn chưa đo được ở cửa sổ này (không vòng nào có lượt Cổng 1) — đo ở vòng ĐẦU TIÊN có Cổng 1 người dưới skill ≥ 2.8.0.

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/`) — mốc phát hành KHÔNG dựng răng (§7.1; bài học ba mốc 2.0.0/2.1.0/2.2.0).
- **Dựng răng riêng cho mốc.** Canh bằng ca VĨNH VIỄN P200 (mọi số đọc từ manifest, 5 đột biến + đối chứng dương) — cùng nếp 2.3.0→2.8.0. Khoá `p200_cat_so` chỉ KHOANH ca đó, không thêm phép đo.
- Nâng số `diagram-design` — không đổi kể từ mốc trước.
- **Chữ ký Cổng Phạm vi.** Mốc phát hành T2 đi làn V (tiền lệ 2.5.0→2.8.0). Người xuất hiện MỘT lần, ở Cổng Bằng chứng.
- Đếm lượt hạ tầng phiên (owner gõ «Try again») — vết hội thoại không nằm trong repo này.
- Ghim lại các hồ sơ đã ký đang hoá cũ vì cửa sổ này — §7.1: chiến dịch ghim lại là việc SAU khi mốc merge.
- Mở ô «Đường lùi phải sống» — chờ owner gọi tên sau mốc (luật Giới hạn CHIỀU RỘNG (b)); mốc này chỉ GỌI TÊN.

## Notes

- Known limits: AC-1 ghim literal `2.9.0` — cố ý, số của một mốc là hằng của mốc đó; P200 vẫn đọc từ manifest (nếp từ 2.6.0).
- Known limits: chữ ký mốc này sẽ kéo một dòng bản ghi mốc định tuyến (LM20 chỉ ghim hồ sơ đã chốt) — thêm TRƯỚC khi commit chữ ký, cùng commit. Hai vòng #146/#151 của cửa sổ này đã KHÔNG làm thế và trả 3 CI đỏ; mốc này là lần thử thứ hai của lời dặn 2.8.0.
- Known limits: E1/E2/E6 ghim dòng «P200 OK (… 5/5 dot bien …)» và «PASS: P200 …» của chính ca (khoá `p200_cat_so` lọc dòng có chữ P200, mã thoát của suite qua `pipefail`) nhưng bằng chứng KHÔNG chứa đủ bảy dòng vế `P200 VE:` — cỗ máy verify chỉ giữ ba dòng cuối mỗi lệnh (giới hạn có tên của #151). Hồ sơ phân biệt được «P200 xanh, 5/5 đột biến chạy» với «suite xanh»; từng vế vẫn do P200 canh trong nhà.
- Known limits: ba dòng số đếm tay từ commit + sổ + `gh run list`; lượt hạ tầng phiên không đếm được.
