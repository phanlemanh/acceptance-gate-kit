# Review findings — release-2-6-0 (vòng chấm 1)

Người soi: phiên tươi độc lập, context sạch. Cây: c5689fb6.

## Đã kiểm

**(1) Mỗi AC có đường chứng thật không**

- Đọc `contract.md`, `evals.yaml`, rồi mở `scratchpad/v-plugins.log` dòng
  568–582. P200 in đủ **bảy dòng vế** mà E1/E2/E6 ghim (`acceptance-gate hop
  semver: 2.6.0` · `feature-loop hop semver: 2.6.0` · `diagram-design hop
  semver: 2.7.0` · `hai plugin cung so: 2.6.0` · `GUIDE khop so DOC TU
  manifest` · `mo ta acceptance-gate co muc v2.6.0` · `muc v2.6.0 cua
  feature-loop TU khai cap`) **và năm dòng `[chieu do]`** — cả năm đột biến
  chạy thật, mỗi cái ghim đúng câu, cộng đối chứng dương bản-sao-nguyên-vẹn.
  AC-1 · AC-2 · AC-6 có chiều đỏ SỐNG, không phải khẳng định âm-tính-một-mình.
- Đọc mã P200 tại chỗ (`tests/plugins/run-tests.sh:10504–10627`): mọi số đọc
  từ manifest, một lối thoát duy nhất, bản sao code-sinh.
- **AC-6 — nội dung mô tả:** eval E6 CHỈ đo *sự tồn tại* của mục `v2.6.0` và
  *sự tồn tại* của chuỗi `acceptance-gate >= 2.6.0` trong đúng đoạn cắt. Nó
  KHÔNG đo được các vế văn xuôi «người dùng nhận gì». Đây là **giới hạn đã
  khai** ngay trong AC-6 và trong `evals.yaml` — không phải chỗ giấu. Vì thế
  tôi đọc trực tiếp `git diff bb73217d..HEAD` và **chạy thật** `gate-card.js`
  trên fixture dựng tại chỗ (`ykill` stage=decided/decision=kill · `yhong`
  stage=bogus · `ycho` stage=discovery): ra đúng `gate-card: ý đã đóng` ·
  `gate-card: hồ sơ hỏng — stage không nhận diện được: bogus` ·
  `gate-card: hồ sơ chưa có contract.md` (đúng DECLARED LIMIT mà mục v2.6.0
  khai). Xem finding **F2** cho vế (2) của cùng mục đó.

**(2) `run-log.jsonl` có trung thực không**

- `sha` của cả 8 dòng = `c5689fb6b9a462e600e31122c212d0956ad0f00e` =
  `git rev-parse HEAD` ✓.
- `ts` là **giờ bắt đầu**, không phải giờ kết thúc (E3 ts 11:28:09Z, mtime
  `v-E3.log` 11:29:34Z; plugins ts 11:29:47Z, mtime `v-plugins.log` 11:34:08Z).
  Mọi lượt chạy bắt đầu SAU commit c5689fb6 (11:27:56Z) — đúng nếp
  «commit trước, verify sau» ✓.
- `cmd` của E3/E3b/E3c/E3d khớp từng ký tự với `_acceptance/config.yaml`
  (`executors.test.*`) ✓. E3e KHÔNG khớp — xem **F7**.
- Bốn dòng E1/E2/E3c/E6 dùng chung một lượt chạy plugins (cùng `ts`, cùng
  `cmd`, khác `run_id`): **hợp lệ, đã khai trước** trong `evals.yaml` E3c
  («cùng lượt chạy với E1/E2/E6, không tốn lượt») và là nếp dedupe-cmd của
  S4. Không phải ghi khống.
- `_acceptance/release-2-6-0/run-log.jsonl` **chưa được commit** (`git status`
  cho `?? `), và nó KHÔNG nằm trong `.gitignore` — xem **F8**.

**(3) Bốn eval AC-3 có phải assertion âm-tính-một-mình không** — kiểm bằng
tay trên BẢN SAO, không đụng cây thật:

- Dựng bản sao độc lập: `git clone --no-hardlinks` → `git checkout c5689fb6`.
- **Đối chứng dương:** bản nguyên vẹn XANH trước — `tests/scripts` exit 0
  «793 passed, 0 failed» (khớp `v-E3.log`), `tests/hooks` exit 0 «60 passed»
  (khớp `v-E3b.log`), `tests/workflows` exit 0 «all workflow tests passed»
  (khớp `v-E3d.log`), `product-map --check` exit 0.
- **Chiều đỏ E3e:** sửa `PRODUCT-MAP.md` (`release-2-6-0` → `release-2-6-0-XX`)
  → `node scripts/product-map.mjs --root . --check` **exit 1**, in «PRODUCT-MAP.md
  lệch với hồ sơ xưởng». Chiều đỏ có thật ✓.
  (Ghi luôn để không ai nhầm: đột biến ĐẦU của tôi — đổi tên file trong
  PRODUCT-MAP.md — cho exit 0; phép đo chỉ canh quan hệ bản-đồ↔hồ-sơ-xưởng,
  không canh đường dẫn script.)
- **Chiều đỏ E3/E3b/E3c/E3d:** ba suite mang chiều đỏ NỘI TẠI đọc được trong
  log (`SELF02` đối chứng dương, `ARM13-mut`, `MM1m mutant xoá → đỏ`,
  `P200` 5 đột biến, `P201` mutant). Nên «suite XANH» không rỗng nghĩa —
  NẾU suite thật sự chạy trên cây này. Cái thiếu là bằng chứng nối màu xanh
  với cây: xem **F8**.
- Ghi chú tái lập: `v-E3.log` trùng **byte-for-byte** với `scripts.log`,
  `scripts-r2.log`, `s-fig.log` (cùng md5 `9dce3d6b…`) — output suite hoàn
  toàn tất định, nên một log chép lại từ lượt trước không phân biệt được với
  lượt chạy mới. Đây chính là lý do **F8**.

**(4) «Ba dòng số» và phần đọc NGƯỠNG CẮT KIT** — đối chiếu `git log` 01/09
và `docs/findings/2026-09-01-ba-dong-so-vong-cong-dang.md`:

- `10:39 implemented` = `1fb60a42` 10:39:50 ✓ · `13:16 thu phạm vi` =
  `1f199dc7` 13:16:10 ✓ · `14:50 ký` = `02d55597` 14:50:19 ✓ → **4h11** và
  **1h34** đúng.
- «findings ghi 5 — chốt lúc 13:20» = `b480dbb8` 13:20:06, TRƯỚC chữ ký
  14:50 ✓. Việc đếm lại thành **6** là sửa ĐÚNG HƯỚNG (sai số cũ có lợi cho
  kit) và tái lập được từ `git log`.
- Câu miễn trừ «vượt trên một vòng meta» đã bị CẮT khỏi hợp đồng ✓ — nhưng
  còn nguyên ở nguồn được dẫn: **F9**.
- Chọn mẫu số: xem **F10** (hai vế đọc trên hai tập vòng khác nhau) và
  **F11** (cửa sổ đếm neo vào commit bump, không vào mốc gộp).
- «27 lượt eval xanh trọn ở cả hai vòng»: **F3** — không tái lập được.
- «cờ `coverageCluster` bật cả hai vòng»: **chưa kiểm được** — không có
  artifact máy nào trong `_acceptance/cong-dang-co-cua/` mang chuỗi đó; lời
  khai chỉ tồn tại trong file findings. Ghi thành **F16**.

**(5) Mục v2.6.0 trong hai manifest vs `git diff bb73217d..HEAD`**

- «FIVE refusal cases apart instead of three» ✓ — diff thêm đúng hai hằng vào
  khối marker `NO-DOSSIER-GUARD` (3→5), thân lệnh `commands/acceptance-card.md`
  đổi «Ba ca» → «NĂM ca» và có đúng năm dòng thuật.
- «Type the name of an idea that was parked or killed → «y da dong»» ✓ chạy
  thật, ra đúng câu.
- «An opportunity file whose stage the machine cannot read → «ho so hong» and
  names the exact field» ✓ chạy thật, in «stage không nhận diện được: bogus».
- «DECLARED LIMIT … an opportunity still WAITING at the Worth Gate still falls
  through to the «no contract yet» wording» ✓ chạy thật, đúng như khai.
- **Câu kiểm-bằng-nội-dung** «grep "MSG_O_DA_DONG" and "MSG_HO_SO_HONG" in
  scripts/gate-card.js» ✓ — có thật ở dòng 81/82 (khai) và 116/132/141 (dùng).
  Lỗi của mốc 2.5.0 (câu grep trỏ chuỗi không tồn tại) KHÔNG tái phát.
- «one helper was declared 87 lines below its first call» ✓ — tôi chạy CHÍNH
  bộ quét SELF01 lên cây `bb73217d`: kết quả đúng một dòng,
  `nothas (khai dong 1254, goi dong 1167)` → **87 dòng, MỘT hàm, MỘT assert**.
  Con số trong manifest ĐÚNG; chỗ khác trong cùng cây thì không — **F1**.
- Vế (2) «What the consumer receives» — **F2**.
- Mục v2.6.0 của `feature-loop` «NOTHING CHANGES in this package» ✓ —
  `git diff --name-only bb73217d..313962e0 -- feature-loop/` rỗng.
- «diagram-design giữ 2.7.0, không đổi kể từ mốc trước» ✓ —
  `git show bb73217d:diagram-design/.claude-plugin/plugin.json` = 2.7.0.

**(6) Hai hình trong `figures/`**

- Chạy hai cổng thẩm mỹ mà `index.md` khai: `check_label_occlusion.py` và
  `check_overflow.py` trên CẢ HAI hình → **4/4 exit 0** ✓ (lời khai đúng).
- **Số cổng:** H1 vẽ đúng **bốn** hộp cổng người (Cổng Đáng · Cổng Phạm vi ·
  Cổng Bằng chứng · Cổng Giá trị) + **ba** hộp máy, khớp `index.md`; cổng thứ
  năm (Gate 1.5, T3) cố ý để ngoài và có khai ✓. Hai đường đứt «T2: ĐI TIẾP»
  và «T2 XANH-SẠCH» khớp `feature-loop/skills/feature-loop/SKILL.md` khối
  «Bất biến dừng» ✓.
- **Thời điểm trên timeline H2:** 09:09 ✓ (`eb4c8b20` 09:09:39) · ≈10:40 ✓
  (`1fb60a42` 10:39:50) · 11:34 ≈ (`8e34b7da` 11:35:04) · 13:16 ✓
  (`1f199dc7` 13:16:10) · 14:50 ✓ (`02d55597` 14:50:19). Một chấm lệch:
  **F13**.
- **Câu «máy tự chèn»:** `index.md` trích «MỌI ranh giới stage khác: đi tiếp
  NGAY, không hỏi *chạy S4 nhé?*» — có thật, nguyên văn, trong
  `feature-loop/skills/feature-loop/SKILL.md:10` ✓.
- Một lệch nhỏ giữa lời hợp đồng và `index.md` về nguồn của H1: **F14**.

**(7) Mệnh đề không chứng được mà đang trình như đã chứng** — F1 · F2 · F3 ·
F4 · F6 · F16.

**Đột biến phụ đã chạy (ngoài hợp đồng, xem mục cuối):** đổi giá trị hằng
`MSG_O_DA_DONG` trong `scripts/gate-card.js` mà KHÔNG sửa thân lệnh →
**cả bốn suite vẫn exit 0**; xoá dòng thuật khỏi `commands/acceptance-card.md`
mà KHÔNG sửa hằng → **scripts + plugins vẫn exit 0**. Cùng đột biến đó chạy
`_acceptance/khong-ve-the-ma/rang.sh --chan round-trip` → **exit 1, 6 fail**
(đối chứng dương: bản nguyên vẹn 17 pass / 0 fail).

**Chưa kiểm được:** (a) cờ `coverageCluster` của vòng `cong-dang-co-cua`
(không có artifact máy) · (b) con số «~6,2 triệu token · 87 agent» trong file
findings · (c) vòng ở kho tiêu thụ `crm` — nằm ngoài kho này, chỉ có lời khai.

## Findings

| # | Mức | Chỗ | Vấn đề | Bằng chứng | Đề xuất |
|---|---|---|---|---|---|
| F1 | **high** | `tests/scripts/run-tests.sh:1105–1106` vs `:4113–4123`; `decisions.jsonl` entry `d-20260901T103000Z-7002` | Cùng MỘT file ship hai lời khai ngược nhau về cùng một sự thật: dòng 1105–1106 nói «~160 dòng phía trên» và «**BỐN** assert âm-tính KHÔNG BAO GIỜ CHẠY»; dòng 4119–4122 nói chính hai con số đó SAI và «Đừng dựng lại con số bốn». Sổ quyết định 7002 khai đã «sửa theo LỚP ở hai bề mặt sống: mục v2.6.0 của manifest + bình luận vĩnh viễn trong tests/scripts/run-tests.sh» — bề mặt thứ hai mới sửa MỘT trong HAI chỗ, ngay trong cùng file | Chạy chính bộ quét SELF01 lên cây `bb73217d`: ra đúng một dòng `nothas (khai dong 1254, goi dong 1167)` → 87 dòng, MỘT hàm, MỘT assert. `grep -n "BỐN\|~160 dòng" tests/scripts/run-tests.sh` → 1105, 1106 vẫn nguyên | Sửa dòng 1105–1106 về «87 dòng · MỘT assert (GM02-phanbiet)», hoặc thay bằng con trỏ tới khối ĐÍNH CHÍNH ở SELF01. Và sửa entry 7002 cho khớp phạm vi đã sửa thật — lời khai «sửa theo LỚP» là thứ người ký tin để KHÔNG kiểm lại |
| F2 | **high** | `.claude-plugin/plugin.json` mục v2.6.0, vế (2) + `contract.md` dòng 34–35 | Vế (2) của «What the consumer receives» mô tả bộ đo NỘI BỘ của kit — lưới thường trực `tests/scripts/run-tests.sh` và bộ răng `_acceptance/khong-ve-the-ma/rang.sh`. Repo tiêu thụ không chạy suite của kit và không có `_acceptance/` của kit; không dòng hành vi nào người dùng thấy đổi. Hợp đồng còn khẳng định «Ba thứ trong mốc này đều là thứ người dùng gặp bằng tay, không phải việc-trong-nhà» — sai với vế (2). Gap-probe đã nêu đúng điều này (P1, dòng 19 của `gap-probe.md`) và KHÔNG có entry sổ quyết định nào xử lý | `git diff bb73217d..HEAD --stat`: vế (2) chỉ chạm `tests/scripts/run-tests.sh` (+102/−0 dòng test) và `_acceptance/khong-ve-the-ma/rang.sh`. Phép thử xoá-tên-máy: bỏ tên file đi thì câu không còn nói được người dùng gặp gì | Tách vế (2) ra khỏi «What the consumer receives», dán nhãn «việc trong nhà của kit — không đổi hành vi bạn thấy»; sửa câu «ba thứ … người dùng gặp bằng tay» trong Context. Đây là mốc sinh ra để đọc North Star — đếm việc-trong-nhà vào cột giá-trị-chạm-người-dùng làm mờ đúng thước đó |
| F3 | medium | `contract.md` dòng 94 («27 lượt eval xanh trọn ở cả hai vòng») + findings 01/09 dòng 21 | Con số 27 không tái lập được từ artifact. `_acceptance/cong-dang-co-cua/run-log.jsonl` có **24** dòng eval ở r1+r2 (r1: 13, r2: 11 — hai dòng còn lại là `kind: baseline`, không có `exit_code`), **tất cả exit 0**. `evidence-report.md` lại ghi «14 phép đo máy» (r1) và «12 chạy lại + 2 mang sang» (r2) → 28. Ba cách đếm cho 24 / 26 / 28, không cách nào cho 27 | `node` đọc `run-log.jsonl`: `{"1":{n:14,fail:1},"2":{n:12,fail:1},"3":{n:8,fail:0}}`; hai «fail» là dòng baseline không mang `exit_code` | Mệnh đề LÕI («0 phát hiện do phép đo máy bắt») ĐÚNG và tái lập được — giữ. Con số 27 thì hoặc nêu cách đếm ngay tại chỗ, hoặc thay bằng «mọi dòng eval trong run-log r1+r2 đều exit 0 (24 dòng)» |
| F4 | medium | `contract.md` dòng 27–29 | «Toàn bộ diff chạm engine của mốc này là **ba file**» — sai trong chính cửa sổ hợp đồng khai. Còn hai file nữa ngoài `_acceptance/` và `docs/` | `git diff --name-only bb73217d..313962e0 \| grep -vE '^(_acceptance\|docs)/'` → `.claude-plugin/plugin.json`, `PRODUCT-MAP.md`, `commands/acceptance-card.md`, `scripts/gate-card.js`, `tests/scripts/run-tests.sh` — **năm**. `plugin.json` bị sửa ở `e883f466`, tức ghi chú của một bản ĐÃ PHÁT HÀNH (v2.5.0) được viết lại trong cửa sổ này | Bỏ chữ «Toàn bộ», hoặc viết «ba file mã, cộng manifest và bản đồ máy sinh» — và nói rõ mục v2.5.0 đã ship bị sửa lại |
| F5 | medium | `contract.md` frontmatter + `decisions.jsonl` cả 11 dòng không-seal | Dấu thời gian là số tròn và nằm SAU commit chứa chúng. Sáu entry đầu `at=09:30:00Z`, commit sinh chúng `9e11533c` = 09:19:15Z (sau 11 phút). Năm entry sửa P0/P1 `at=10:30:00Z`, commit sinh chúng `f73a4ea5` = 09:50:15Z (**sau 40 phút**). `veto_opened_at` cũng là 09:30:00Z tròn. Gap-probe nêu lớp này (P1, dòng 22) và nói nó đã là P1 của mốc 2.5.0 — **bản sửa của chính vòng này tái phạm đúng lớp đó** | `git log --format='%h %cI' -S'd-20260901T103000Z-7001' -- _acceptance/release-2-6-0/decisions.jsonl` → `f73a4ea5 2026-09-01T16:50:15+07:00` = 09:50:15Z < 10:30:00Z | Điền `at` thật (hoặc một mốc nhỏ hơn thời điểm commit) cho mọi entry. Lớp đã tái phát hai mốc liên tiếp — đừng sửa bằng lời dặn nữa, biến thành phép đo (`at` ≤ committer date của commit chứa dòng) |
| F6 | medium | `decisions.jsonl` entry `d-20260901T093000Z-6006` | Lời khai «lớp đã quét: 3 hồ sơ lệch khuôn (release-2-5-0 3/3 · dac-ta-ux-vat-hoa-cau-truc 1/17 · hồ sơ này 5/5)» không tái lập được ở cả ba vế | Quét toàn `_acceptance/*/decisions.jsonl`: thiếu `decision` (lớp nghiêm) CHỈ ở `release-2-5-0` 3/3 — `dac-ta-ux-vat-hoa-cau-truc` **0**. Lớp kề (thiếu `impact`) rơi vào `release-2-2-0` 11/21, `release-2-4-0` 11/13, `ra-co-ten-lam-va-trao` 5/32 — **không hồ sơ nào được nhắc**. «hồ sơ này 5/5» trong khi file nay có 12 dòng | Sửa entry thành lời khai tái lập được: nêu hình dạng đã quét, tập kết quả, và nói rõ lớp kề (thiếu `impact`) có xét hay không. Lời khai «đã quét lớp» là thứ người ký dùng để KHÔNG quét lại |
| F7 | medium | `evals.yaml` E3e vs `run-log.jsonl` dòng 4 vs `_acceptance/config.yaml` | Eval khai `node scripts/product-map.mjs --check`; run-log ghi `node scripts/product-map.mjs --root . --check`; config khai khoá `executors.script.product_map` = `"node scripts/product-map.mjs --root . --check"`. **Lệnh được ghi vào sổ chạy không phải lệnh eval khai.** Ba nơi viết một phép đo | `sed` trên `_acceptance/config.yaml` dòng 83 · `evals.yaml:51` · `run-log.jsonl` dòng 4 | Đổi E3e sang `cmd: config:executors.script.product_map` — cùng nếp với bốn eval kia, và hết lệch giữa eval và sổ chạy |
| F8 | medium | `evals.yaml` E3/E3b/E3d `evidence_required` + vị trí log + `run-log.jsonl` chưa commit | Ba eval này chỉ ghim `run_id, exit_code, verifier, verified_at` — **không ghim `output`**. Bằng chứng duy nhất nối «suite XANH» với cây này là một dòng máy tự khai. Log thật (`v-*.log`) nằm trong scratchpad của phiên, NGOÀI kho; và `run-log.jsonl` còn chưa được commit dù không bị `.gitignore` | `v-E3.log` trùng md5 với `scripts.log`/`scripts-r2.log`/`s-fig.log` — output tất định, nên một log chép lại không phân biệt được với lượt chạy mới. `git status --porcelain` → `?? _acceptance/release-2-6-0/run-log.jsonl` | Thêm `output` vào `evidence_required` của E3/E3b/E3d và ghim dòng «Results: N passed, 0 failed» (793 · 60 · 44) vào hồ sơ bằng chứng — con số đó tôi tái lập được trên bản sao sạch, nên nó là neo rẻ và thật. Commit `run-log.jsonl` cùng lượt |
| F9 | medium | `docs/findings/2026-09-01-ba-dong-so-vong-cong-dang.md` dòng 16–17 | Nguồn mà mục «Ba dòng số» dẫn vẫn mang nguyên định ngữ miễn trừ «và vượt trên một vòng **meta** — loại vòng không có neo ngoài…» mà hợp đồng (dòng 82–87) tuyên đã CẮT vì nó là «hạ thước cho vừa vật». Hợp đồng không cảnh báo rằng nguồn nó dẫn mang cách đọc đã bị bác. Nó cũng còn mang con số «bốn assertion … chưa bao giờ chạy» (F1) | `sed -n '16,17p'` và `'30,31p'` file findings | Sổ quyết định 7002 đã khai chính sách «findings là biên bản có ngày, KHÔNG viết lại» — chính sách đó hợp lý, nhưng phải trả giá bằng MỘT dòng đính chính ở đầu file findings (hoặc một dòng trong hợp đồng nói rõ nguồn mang hai chỗ đã bị thay). Không thì ai mở nguồn sẽ đọc đúng hai thứ vừa bị bác |
| F10 | medium | `contract.md` bảng «Đọc ngưỡng CẮT KIT» | Hai vế của cùng một ngưỡng đọc trên hai tập vòng khác nhau, và tập của vế 2 không được khai. Vế 1 lấy mẫu = «vòng sản phẩm» và đếm được 1 (vòng `crm`). Vế 2 («trung bình >3 lần gọi người/vòng», luật 30/08 KHÔNG có định ngữ) lại tính trên MỘT vòng meta duy nhất và bỏ hẳn vòng `crm` ra khỏi mẫu | `contract.md` dòng 77–80: cột «Đọc được gì» của hai hàng dùng hai tập vòng khác nhau mà không nói | Khai thẳng mẫu của vế 2: «tính trên mọi vòng kit trong cửa sổ = 1 vòng; vòng `crm` ở kho tiêu thụ không có bộ đếm nên không vào mẫu». Lệch này KHÔNG có lợi cho kit (thêm vòng vào mẫu nhiều khả năng vẫn >3), nên chỉ là chỗ không tái lập được — nhưng ngưỡng owner khai trước thì mẫu phải nói ra |
| F11 | low | `contract.md` dòng 53 «Cửa sổ đếm: `bb73217d` (2.5.0) → `313962e0`. **Một vòng.**» | `bb73217d` là commit BUMP SỐ của 2.5.0, không phải mốc gộp — cửa sổ nuốt luôn phần đuôi của chính hồ sơ `release-2-5-0` (S4-r1 `30865e2f`, S4-r2 `9bd6b2ed`, gap-probe, và chữ ký Cổng Bằng chứng `6657c39e` 30/08 14:37). Ai chạy lại đúng lệnh trong Source input sẽ đếm ra HAI vòng ký | `git log --format='%h %cI %s' bb73217d..HEAD` — 9 commit của hồ sơ `release-2-5-0` nằm trong cửa sổ | Neo vào mốc gộp `4861d9fd` (merge #128), hoặc giữ neo và nói rõ vì sao vòng `release-2-5-0` không tính. Hướng lệch bất lợi cho kit (thêm một vòng rẻ hạ trung bình), nên không phải lách — chỉ là không tái lập được |
| F12 | low | `contract.md` bảng Ba dòng số, ô «Làm-xong → quyết-được 4h11» | Nguồn được dẫn ghi thẳng dòng này là «không đo được — vòng chưa tới Cổng Bằng chứng». Hợp đồng đưa số mà không nói vì sao ghi đè nguồn | Ba mốc tra được từ `git log` (10:39:50 · 13:16:10 · 14:50:19) nên con số **ĐÚNG** — chỉ là không nối với nguồn | Thêm nửa câu «đo lại sau chữ ký, thay dòng không-đo-được của findings chốt lúc 13:20; nguồn: git log» |
| F13 | low | `figures/h2-sau-luot-goi-nguoi.html` | Chấm «Duyệt Cổng Phạm vi · 09:42» — `git log` cho `028cd41e` 09:43:22. Lệch ~1 phút. Ngoài ra tên lượt thứ tư khác nhau giữa hai bề mặt: hình ghi «Rút phạm vi vòng 1», hợp đồng ghi «gật phạm vi + vòng 2» (cùng mốc 11:34, cùng sự kiện) | So chuỗi `<text>` rút từ hình với `git log --format='%h %cI %s'` ngày 01/09 | Sửa 09:42 → 09:43; thống nhất MỘT tên cho lượt thứ tư giữa hình và hợp đồng (hình là chiếu, chữ là nguồn) |
| F14 | low | `contract.md` dòng 48–51 vs `figures/index.md` | Hợp đồng viết «Hình là chiếu của **mục này**» (mục Ba dòng số) cho CẢ HAI hình, trong khi `index.md` khai nguồn của H1 là `feature-loop/…/SKILL.md` · `CLAUDE.md` · `PRODUCT-MAP.md` — không phải mục Ba dòng số. H2 thì đúng | `figures/index.md`, dòng «Nguồn chữ» của H1 | Sửa câu trong hợp đồng thành «H2 là chiếu của mục này; H1 là chiếu của bất-biến-dừng trong SKILL — nguồn ghi trong `figures/index.md`» |
| F15 | low | `contract.md` AC-1 | AC-1 nêu literal `2.6.0` nhưng KHÔNG phép đo máy nào ghim literal đó — P200 cố ý đọc mọi số TỪ manifest (nếp đúng, đã dùng thật năm mốc). Một cây quên bump vẫn in «P200 OK» và vẫn «hai plugin cùng số». Đã khai trong comment đầu `evals.yaml`, chưa khai trong hợp đồng | `tests/plugins/run-tests.sh:10519–10523` giải thích vì sao cố ý bỏ «số đã tăng so với base» | Nêu thành MỘT dòng Known limits khi ký — không thêm răng. Hợp đồng hiện chưa có mục Known limits nào dù AC-6 và `evals.yaml` đều trỏ tới «Known limits» |
| F16 | low | `contract.md` dòng 96–97 | «cờ `coverageCluster` bật cả hai vòng» trình như đã chứng («đã chứng trong hồ sơ 01/09»), nhưng không artifact máy nào trong `_acceptance/cong-dang-co-cua/` mang chuỗi đó — lời khai chỉ tồn tại trong file findings | `grep -rn "coverageCluster" _acceptance/cong-dang-co-cua/` → rỗng | Trỏ tới artifact thật (bản chụp kết quả scope-triage của r1/r2), hoặc hạ giọng thành «hồ sơ 01/09 ghi nhận» thay vì «đã chứng» |
| F17 | low | `gap-probe.md` + `decisions.jsonl` | Ba P0 đã đóng (7001 · 7002 · 7003) và hai P1 đã đóng (7004 · 7005). Còn **3 P1 và 6 P2** ở trạng thái `proposed`, không entry sổ quyết định nào chấp nhận hay từ chối. Ba trong số đó là F2 · F5 · F6 ở bảng này — tức chúng sống sót vào vòng chấm | `gap-probe.md` dòng 19–27 vs `decisions.jsonl` | Mỗi P1 còn lại cần một entry (accepted / rejected + lý do) trước chữ ký, để thẻ Cổng Bằng chứng không hiện «phản biện còn mục chưa xử» |

## Ngoài hợp đồng

**N1 — Bất biến «MỘT nguồn của NĂM thông điệp» không nằm trong lưới thường
trực.** `scripts/gate-card.js:75–79` khai: «thân lệnh chép nguyên văn và phép
đo RÚT từ đây (không gõ literal), nên đổi chữ ở đây mà quên thân lệnh là **ĐỎ
ngay**, không trôi âm thầm.» Bất biến đó CÓ THẬT nhưng chỉ được canh bởi
`_acceptance/khong-ve-the-ma/rang.sh --chan round-trip` — răng của một hồ sơ
ĐÃ KÝ, không thuộc bốn suite và không thuộc eval của mốc này.

Đo được (trên bản sao, không đụng cây thật):

- Đối chứng dương: `rang.sh --chan round-trip` trên bản nguyên vẹn →
  **17 pass, 0 fail**, exit 0.
- Đột biến (đổi giá trị `MSG_O_DA_DONG` trong `gate-card.js`, KHÔNG sửa thân
  lệnh) → `rang.sh` **exit 1, 11 pass / 6 fail**, ghim đúng câu «khong co dong
  thuat nao chua «gate-card: XX» — hai ben da troi khoi nhau».
- Cùng đột biến đó: `tests/scripts` **exit 0** · `tests/hooks` **exit 0** ·
  `tests/workflows` **exit 0** · `tests/plugins` **exit 0**.
- Đột biến ngược (xoá dòng thuật khỏi `commands/acceptance-card.md`, KHÔNG sửa
  hằng): `tests/scripts` **exit 0** · `tests/plugins` **exit 0**.

Nghĩa là một PR sau này chạm `gate-card.js` hoặc `acceptance-card.md` mà không
chạm hồ sơ `khong-ve-the-ma` sẽ thấy bốn suite xanh trong khi hai bên đã trôi
khỏi nhau. Đây đúng hình dạng ADR 0011 nói tới (răng hồ sơ là lớp rẻ; bảo đảm
dài hạn phải vào lưới thường trực) và mốc này vừa mở rộng khối marker từ 3 lên
5 mà chưa nâng tầng. **Không thuộc bốn AC** — ghi để owner biết khi cân
`khuon-rang-dung-chung`.

**N2 — `_acceptance/release-2-6-0/run-log.jsonl` chưa commit tại c5689fb6.** Đã
gộp vào F8 vì nó chạm đường chứng của AC-3; nhắc lại ở đây vì nó cũng là trạng
thái kho, không phải khuyết tật của tiêu chí.

## Known limits đề xuất

1. **Các vế văn xuôi «người dùng nhận gì» của mục v2.6.0 không có thước máy** —
   E6 chỉ đo sự tồn tại của mục `v2.6.0` và của câu khai cặp; nội dung do
   reviewer đọc trong diff. (Đã khai sẵn trong AC-6; nên hiện thành dòng
   Known limits khi ký — hợp đồng hiện KHÔNG có mục Known limits nào.)
2. **Literal `2.6.0` của AC-1 không có thước máy** — P200 cố ý đọc mọi số từ
   manifest, nên một cây quên bump vẫn xanh; chỉ diff 3 dòng của PR bắt được.
   (F15)
3. **Bộ đếm «lần gọi người» vẫn đếm tay từ vết hội thoại** — mốc thứ hai liên
   tiếp mang giới hạn này; con số nuôi ngưỡng CẮT KIT là số người đếm, không
   phải số máy đo. (Hợp đồng đã khai; giữ nguyên.)
4. **Vế «≥2/5 vòng sản phẩm bị hạ tầng đốt» đọc trên cỡ mẫu n = 1** — tỉ lệ
   quan sát 100%, mẫu 1/5. Mẫu của vế thứ hai chưa được khai. (F10)
5. **E3/E3b/E3d không ghim `output`** — «suite XANH» dựa vào một dòng sổ chạy
   máy tự khai; log gốc nằm ngoài kho. Tôi đã tái lập độc lập trên bản sao
   sạch (793 · 60 · 44 · «all workflow tests passed» · product-map exit 0),
   nhưng hồ sơ tự nó chưa mang neo đó. (F8)
6. **Bất biến một-nguồn của năm thông điệp chỉ được canh ngoài lưới thường
   trực** — bốn suite mù với việc hai bên trôi khỏi nhau. (N1)
