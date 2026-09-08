# Tổng kết vòng `lop-bang-chung-nhin-thay` — số đo thật, 08/09/2026

Vòng đầy đủ từ phát hiện lỗ tới merge (PR #158, `8caa9998`). Mọi con số dưới đây
**đo từ bản ghi phiên**, không ước lượng: token rút từ trường `usage` của từng lượt
gọi model trong `~/.claude/projects/<repo>/<phiên>.jsonl` và các bản ghi phiên phụ;
thời gian rút từ `git log`; lượt gọi người đếm từ chính bản ghi phiên.

## 1. Vật đã giao

Luật gương của `(cross-layer)`: hợp đồng có **mặt người nhìn** (`ui`; alias `web`,
`web-ui`; không tính `mobile`) phải có ≥1 eval `ui-check` khai `layer: ui-observed`.
Bằng chứng lớp mã (vitest/DOM, axe-core) không trả nghĩa vụ này.

| Vật | Nơi |
|---|---|
| Một nguồn cho «mặt người nhìn» + alias + tiền tố descope + CLI `classify` | `lib/lop-nhin-thay.cjs` (mới) |
| Cảnh báo W8: nghĩa vụ · nhãn lạc chỗ · token surface lạ | `scripts/eval-coverage-lint.js` |
| Cờ Cổng Phạm vi + `--extract ui_observed`; Cổng Bằng chứng đọc **báo cáo** | `scripts/gate-card.js` |
| NOTE trước merge kèm `approved_at` + ngưỡng đếm (chưa chặn) | `scripts/pre-merge-check.sh` |
| Luật ở bảy văn bản nghi thức + marker `UI-CHECK-BLOCK-TEMPLATE` | SKILL/references/CONTEXT |

32 file, +2 520 / −21 dòng; riêng mã và luật: 16 file, +669 / −20. Ca đo mới: 391 dòng.
Hợp đồng 6 AC / 6 eval; sổ quyết định 16 entry; run-log 42 dòng.

## 2. Token — 578 triệu, và 93% là đọc lại

| Nơi tiêu thụ | Lượt gọi model | Tổng token | Tỉ lệ |
|---|---:|---:|---:|
| Phiên chính (điều phối, viết mã, dựng thẻ) | 624 | 356 221 480 | 61,6% |
| S4 vòng 1 (`wf_3bdd6980-42f`, gồm một lần sập + resume) | 940 | 92 921 695 | 16,1% |
| S4 vòng 3 (`wf_a58a085a-cf4`, gồm một lần sập + resume) | 783 | 76 498 806 | 13,2% |
| S4 vòng 2 (`wf_ac8ebe0c-496`) | 433 | 43 865 936 | 7,6% |
| Agent lẻ (gap-probe · hình · hội đồng ×3 · ba làn ghim lại) | 83 | 8 586 712 | 1,5% |
| **Tổng** | **2 863** | **578 094 629** | |

Cấu phần của tổng đó:

| Loại token | Số lượng | Tỉ lệ |
|---|---:|---:|
| Đọc lại từ cache (`cache_read`) | 539 375 191 | 93,30% |
| Ghi cache (`cache_creation`) | 37 128 089 | 6,42% |
| **Sinh ra** (`output`) | **1 556 061** | **0,27%** |
| Nhập tươi (`input`) | 35 288 | 0,006% |

**Token KHÔNG phải đọc lại — phần thật sự mới: 38 719 438** (input + output + ghi cache).

Theo model:

| Model | Lượt | Tổng token |
|---|---:|---:|
| Fable 5.1 (phiên chính + judge/refute) | 1 137 | 412 333 980 |
| Sonnet 5 (verifier, review, agent lẻ) | 1 469 | 143 014 903 |
| Haiku 4.5 (lệnh máy) | 231 | 15 496 076 |
| Opus 5 (hội đồng bốn giọng) | 14 | 7 249 670 |

Phần thuộc riêng vòng này ở phiên chính (cắt tại lúc mở nhánh): **338 908 486** token
trên 509 lượt gọi — tức 17,3 triệu token *trước* vòng là của phần điều tra nguyên nhân.

**Chỗ tiền đi:** ngữ cảnh trung bình mỗi lượt gọi ở phiên chính là **571 483** token,
đỉnh **942 417** lúc 16:41. Một phiên duy nhất kéo gần 13 tiếng thì mỗi lượt gọi phải
đọc lại toàn bộ hội thoại; 327 triệu token cache-read ở phiên chính là cái giá của
việc không chia phiên, không phải của việc làm nhiều.

## 3. Thời gian

| Mốc | Giờ VN | sha |
|---|---|---|
| Ba artifact S1 | 04:54 | `507e1911` |
| Cổng Phạm vi ký | 05:03 | `3ee9f1f2` |
| Kế hoạch (Gate 1.5) | 05:10 | `28597a6b` |
| Code xong → `implemented` | 06:32 | `6e44514d` |
| S4 vòng 1 PASS | 09:35 | `20f9bacb` |
| S4 vòng 2 REJECT | 10:22 | `ef6a521f` |
| S4 vòng 3 PASS | 13:52 | `05162d41` |
| Lượt sửa chỉ-TRỪ (sau hội đồng) | 14:44 | `dbe8615d` |
| **Chữ ký Cổng Bằng chứng** | **15:15** | `cd0fa488` |
| Merge PR #158 | 16:41 | `8caa9998` |

- **Làm-xong → quyết-được: 8 giờ 43 phút** (06:32 → 15:15).
- Tổng vòng: 11 giờ 47 phút.
- Trong đó **≈4,5 giờ chờ hạn mức phiên** (hai lần, reset 08:30 và 13:30) — 38% thời gian
  vòng là máy đứng im vì hạ tầng, không phải vì việc.

## 4. Lượt gọi người — 15, trần T3 là 4

Đếm từ bản ghi phiên, bỏ khối skill và lệnh `/model`:

| Loại | Số | Chi tiết |
|---|---:|---|
| Cổng thiết kế | 3 | Cổng Phạm vi · Gate 1.5 (dán `/goal`) · Cổng Bằng chứng |
| Dừng theo luật | 1 | STOP-PATCHING nổ ở vòng 3 → hội đồng, người chọn đường |
| Chạm danh tính | 2 | «Manh Phan», «xác nhận» — hai nguồn tên lệch nhau |
| Hạ tầng | 2 | «Try again» ×2 sau khi workflow sập vì hạn mức phiên |
| Bàn giao S5 | 2 | chọn merge · bấm merge PR |
| Người tự kiểm / giục | 5 | «Kiểm tra các agent», «Phân tích và đề xuất lại», «tiếp tục», «Kiểm tra và đề xuất», «Đồng ý gật tiếp tục» |

**Vòng bị hạ tầng đốt lượt chấm: 5** — hai lần workflow sập ở bước cuối
(`prov.enforcement_mode` null khi agent xuất-xứ chết vì hạn mức), ba lần phải ghim lại
vì phiên khác đẩy thẳng `main` chạm `tests/`.

## 5. Ba nhát cắt gọi tên cho cửa sổ kế

Luật (c) của CLAUDE.md đòi mỗi mốc phát hành nêu ít nhất một chỗ cắt. Ba chỗ, xếp theo
số đo ở trên:

1. **Chia phiên theo giai đoạn.** 327 triệu token cache-read của phiên chính đến từ một
   phiên 13 tiếng. S1, S3, điều phối S4 và các cổng có thể là bốn phiên; mỗi lần cắt bỏ
   phần hội thoại không còn cần đọc lại. Đây là nhát cắt lớn nhất và không đụng luật nào.
2. **Phòng thủ null ở `acceptance-verify.js`.** Agent xuất-xứ chết → `prov` null →
   `TypeError` giết cả vòng thay vì trả BLOCKED có tên. Đốt 2 vòng hôm nay. Ô đã ghi
   trong sổ quyết định (`type: revisit`, S4-r1).
3. **Luật stale đang tính cả `tests/`.** Mỗi lần nhánh chính đổi một fixture là hồ sơ
   đã ký hoá stale và phải ghim lại — ba lần trong một ngày. Mỗi eval đã khai `paths:`;
   dùng chính nó để thu phạm vi stale là việc meta, chờ owner gọi tên.

## 6. Nợ đã khai (không phải cắt, là giới hạn có tên)

Bảy mục trong Known limits của hợp đồng, kèm ngưỡng đang đếm: hai lỗi độ chặt phép đo
(mutant lint chưa ghim dấu hiệu bản sao đã chạy · LNT6 đo chuỗi thay quan hệ) và năm mục
nhỏ. Ngưỡng: lần đầu một hồ sơ có mặt người nhìn ở repo tiêu thụ ship không frame mà cả
ba răng đều im → mở hợp đồng T2 docs+tests. Hạn: trước mốc 2.10.0.

## 7. Lần sau — xếp theo số đo, không theo cảm giác

Mọi con số «dự kiến» đều bị vượt (token, giờ, lượt gọi người). Ba chỗ rò dưới đây giải
thích gần hết khoảng vượt; mỗi chỗ ghi nó đốt bao nhiêu và ai cắt được.

| # | Chỗ rò | Đốt bao nhiêu (đo) | Cắt bằng gì | Ai quyết |
|---|---|---|---|---|
| 1 | **Một phiên 13 tiếng, mỗi lượt gọi đọc lại ~571K ngữ cảnh** — kể cả những lượt chỉ để nhận thông báo nền hay nói «đang chờ» | 327M cache-read ở phiên chính (57% tổng); ước lượng ≥1/3 số lượt gọi là lượt thức dậy không sinh việc | Chia phiên theo giai đoạn (điều tra · S1–Gate 1 · S3 · S4-điều-phối · Gate 2–S5), mỗi phiên bắt đầu từ hồ sơ trên đĩa, không từ hội thoại. Khi chờ tiến trình nền: MỘT lượt chờ chặn, không đặt thêm lượt canh song song (hôm nay nhiều tác vụ đánh thức máy hai lần cho cùng một sự kiện) | Máy, ngay lần sau — không đụng luật |
| 2 | **Ba round S4 thay vì một** — rà soát đối kháng round 2 và 3 chỉ tìm lỗi ở *phép đo tôi tự viết* (fixture chép khuôn bên đọc · assert chuỗi thay quan hệ · một điểm-case cho lớp hai phần tử · âm-tính-một-mình · ref `main` di động) — đúng danh sách «thước phải gắn vào vật» trong CLAUDE.md | Round 2 + 3 = 120M token, ~4 giờ, 2 lượt gọi người | Trước khi khai `implemented`, chạy một bước tự-soi phép đo ở S3 theo đúng sáu hình dạng đã có tên (máy đọc test mới, không đọc code sản phẩm). Kit đã có gap-probe cho artifact S1; chưa có gương của nó cho test S3 | Kit (meta) — chờ owner gọi tên; hoặc máy tự làm bằng một prompt nội bộ trước S4, không cần sửa kit |
| 3 | **Hạn mức phiên giữa vòng** + workflow sập thay vì BLOCKED sạch | ~4,5 giờ đứng im (38% thời gian vòng), 2 lượt «Try again», 2 lần resume | Phòng thủ null ở `acceptance-verify.js` (ô đã ghi); và xếp S4 nặng vào đầu cửa sổ hạn mức thay vì cuối | Kit (meta) cho phần null; máy cho phần xếp lịch |

Ba chỗ nhỏ hơn, mỗi chỗ một lượt gọi người:

- **Danh tính lệch hai nguồn** (`git config user.name` ≠ `signoff.approvers`) → 2 chạm. Đồng bộ một lần, hoặc chạy lệnh cổng với `--as "Manh Phan"`.
- **Bàn giao S5 hỏi menu ba lối** trong khi nếp kit là PR. Mặc định PR, chỉ hỏi khi owner nói khác → −1 lượt.
- **Phiên khác đẩy thẳng `main` chạm `tests/`** → 3 lần ghim lại (~50 phút làn máy). Khi hai phiên cùng làm trên kit: thoả thuận cửa sổ merge, hoặc thu phạm vi stale theo `paths:` của eval (meta, chờ owner).

Điều KHÔNG nên cắt: hội đồng bốn giọng ở vòng 3 (7,2M token Opus, 1 lượt gọi người). Nó
đảo đúng khuyến nghị sai của máy («mở round 4») và tiết kiệm một round ~70M token. Đó là
lượt gọi người đúng thiết kế: đánh-đổi chỉ người biết.

**Nếu chỉ làm một việc:** chia phiên (chỗ 1). Nó không cần sửa luật, không cần owner gọi
tên, và cắt phần lớn nhất của hoá đơn.

## 8. Các repo khác có gặp cùng chuyện không — quét toàn máy 08/09

Câu hỏi của owner: «làm sao biết repo khác khi chạy kit có gặp các ca này, và mẫu nào lặp
lại?». Kit để lại vết ở từng hồ sơ (`## Iterations`, run-log `repin`, sổ `fix` theo round,
gap-probe, review-findings) và ở bản ghi phiên. Quét cả hai, khử trùng theo remote git.

**Hồ sơ trong repo** (repo gốc, không tính worktree):

| Repo | Hồ sơ | TB round | ≥5 round | Ghim lại | `fix` S4 | gap-probe P0/P1/P2 | Finding «Hình dạng» | Finding từ vựng |
|---|---:|---:|---:|---:|---:|---|---:|---:|
| artifact-platform | 192 | 2,94 | 11 (tới 10 round) | 3 | 125 | 13/44/20 | 18 | 0 |
| acceptance-gate-kit | 55 | 3,31 | 4 | 277 | 141 | 48/156/89 | 37 | 10 |
| oneflow | 40 | 2,10 | 2 | 112 | 77 | 41/82/21 | 24 | 0 |
| crm | 27 | 3,00 | 3 (tới 9) | 34 | 33 | 33/58/9 | 21 | 1 |
| media-library | 13 | 4,86 | 2 (8 và 11 round) | 0 | 8 | 2/21/9 | 4 | 0 |
| map | 14 | 2,00 | 0 | 46 | 24 | 13/15/2 | 0 | 0 |
| policy-graph-hub | 7 | 1,60 | 0 | 10 | 26 | 11/14/5 | 18 | 0 |

**Bản ghi phiên** (mọi phiên đã lưu trên máy, tính cả agent):

| Repo | Phiên | Tổng token | Output | Cache-read |
|---|---:|---:|---:|---:|
| oneflow | 47 | 22,5 tỉ | 63,0M | 95% |
| acceptance-gate-kit | 39 | 5,9 tỉ | 22,9M | 94% |
| aes | 14 | 3,5 tỉ | 14,8M | 96% |
| map | 8 | 3,4 tỉ | 9,2M | 96% |
| artifact-platform | 13 | 3,4 tỉ | 9,6M | 96% |
| floorplanstudio | 14 | 3,0 tỉ | 12,8M | 95% |
| policy-graph-hub | 4 | 2,8 tỉ | 9,5M | 94% |

Hạn mức phiên đâm vào workflow/agent: **110 lần** trên máy (kit 87, oneflow 14), dồn vào
các giờ 04h, 10h, 13h, 14h, 23h; mốc reset hay gặp 13:30 (55 lần), 22:00 (51), 08:30 (27).
Workflow sập kiểu `prov.enforcement_mode` null: **24 lần** trên máy. Người gõ «Try
again»: 10 lần.

Lint từ vựng chạy sống hôm nay: kit 127 dòng W6 (`thẻ`×27, `hook`×20, `engine`×17,
`test`×13); artifact-platform 36 (một chữ `cửa`); crm 17; oneflow/map/PGH 0 vì không có
`CONTEXT.md`. Nhánh token-lạ của W8 vừa ship hôm nay: artifact-platform **140** dòng
(`media-library`, `pipeline`, `db`, `video-plugin`…), oneflow 15, crm 4 — trong khi nhánh
nghĩa vụ thật chỉ 16 / 2 / 9. Tức tôi vừa ship thêm một máy bắt-từ đúng lớp mục 7.

**Năm mẫu lặp ở mọi repo, không riêng vòng này**

1. Nhiều round S4 là chuẩn, không phải ngoại lệ: trung bình 2–3,3 round; hồ sơ 5–11 round có ở
   ba repo; sổ `fix` theo round: 125 (AP), 141 (kit), 77 (oneflow).
2. Finding lớp phép-đo («Hình dạng») xuất hiện ở mọi repo có làn rà soát: kit 37, oneflow 24,
   crm 21, AP 18, PGH 18 → bước tự-soi phép đo ở S3 (mục 7, chỗ 2) có neo ngoài kit.
3. Cache-read 94–98% ở MỌI repo: phiên dài một mạch là thói quen chung, không phải sự cố hôm
   nay. oneflow 22,5 tỉ token cho 63 triệu chữ sinh ra.
4. Hạn mức phiên và cú sập null là hệ thống: 110 lần và 24 lần, không phải hai lần hôm nay.
5. Lint từ vựng kêu ở quy mô không ai xử: 127 dòng trên chính kit. Luật mà bị bỏ qua hàng
   loạt là luật đang đo sai chỗ, và W8-token vừa thêm cùng lớp.

**Kit chưa có công cụ nào tổng hợp các số này.** `claim-scan.mjs` gom bài học xuyên hồ sơ
cho S1; `wf-usage.mjs` đo token từng round nhưng chỉ 45 hồ sơ có `usage-report.md`; kế
hoạch `loop-health.sh` (audit 28/07) chưa bao giờ dựng. Hai script ad-hoc của phiên này
(`sweep.mjs`, `tokproj.mjs`) là bản nháp của nó.

## 9. Thước đo có đang đo sai mục đích không — soi lại bằng vật giao

Câu hỏi của owner: «có việc nào không làm bàn giao tốt hơn, tin cậy hơn, mà tốn thời gian,
và nguyên nhân là chính thước đo và kiểm tra — tức đo sai mục đích?». Phép thử: mỗi cơ chế
kiểm, hỏi nó có đổi **vật giao cho người dùng** (mã, luật, chữ họ đọc) hay chỉ đổi **cái
thước** (test, fixture, bằng chứng).

**Ba bằng chứng «sai mục đích»**

1. **Sáu eval máy không đo tính năng.** `## Analyst` của báo cáo ghi: E1–E6 «pass trên cả
   HEAD và baseline — harness xác nhận chạy được nhưng chưa phân biệt được». `cmd` của cả
   sáu eval là *cả suite* (4 × plugins, 2 × scripts), nên mỗi round trả 8–14 phút cho một
   phép đo xanh ở cả hai cây; thứ duy nhất phân biệt được là verifier tìm dòng
   `PASS: [LNT…]` trong stdout. Suite chạy cỡ 10 lần trong vòng (S3, ba round S4, ba làn
   ghim lại, hai lần trên cây gộp) ≈ 2 giờ máy cho cùng một thông tin.
2. **Hai trong ba lượt vá chỉ sửa thước.** Vá round 1 đổi fixture (test); vá round 2 đổi
   assert (test); chỉ lượt chỉ-TRỪ mới đổi vật giao (bốn câu luật sai + gỡ một test). Nguyên
   nhân cấu trúc: hợp đồng viết AC dưới dạng *mô tả ca kiểm* («chạy lint… stdout có…»),
   nên «trong hợp đồng» ≡ «về cái thước». Luật triage đẩy finding trong hợp đồng vào vòng
   vá, finding ngoài hợp đồng ra Known limits → **vòng lặp tối ưu cái thước, còn bốn lỗi hành
   vi thật của sản phẩm** (thẻ bỏ qua descope khi thiếu evals · NOTE nêu sai nguyên nhân ·
   descope không `id` bị coi là vắng · regex chú thích lệch) **đi thẳng ra Known limits, không
   ai sửa**. 36 finding, 6 trong hợp đồng — cả 6 về độ chặt phép đo.
3. **Ba lần ghim lại vì `tests/` đổi ở upstream**: 51 phút làn máy, 0 thông tin về vật (mã
   không đổi). Luật stale đo «cây đổi», không đo «rủi ro đổi».

**Cái gì đã tăng tin cậy thật** — đều là kiểm **lời-khai-đối-chiếu-thực-tại**: gap-probe F1
(Cổng Bằng chứng đọc báo cáo, không đọc bản khai — đổi hành vi thẻ), rà soát bắt câu «hook
đã bắt screenshot» sai so với mã, mutant `&&`→`||` ở `uiPassed`, hội đồng bác round 4.
Cái gì tốn giờ mà không đổi vật — đều là kiểm **chữ-đối-chiếu-danh-sách** hoặc
**cây-đối-chiếu-sha**: W6, W8-token, LM20 baseline, stale theo cây, suite làm eval.

**Luật rút ra, một câu:** thước đúng mục đích khi nó so *điều đã hứa* với *điều máy làm*;
thước sai mục đích khi nó so *chữ* với *danh sách* hoặc *cây* với *sha*. Ba việc cụ thể:
viết AC theo hành vi công cụ, không theo ca kiểm (để lỗi hành vi rơi vào «trong hợp đồng»);
`cmd` của eval là ca của tính năng (`LNT_CASES=… node …`), suite chỉ ở `suite_keys`; stale
thu theo `paths:`.
