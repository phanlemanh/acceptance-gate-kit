# Hạt giống — ba chỗ tích luỹ không có đường ra

**Ngày:** 2026-08-21 · **Trạng thái:** hạt giống, chờ Cổng 0 · **Hạng dự kiến:**
T2 (hai câu trong luật sinh eval + một nếp xếp ca kiểm + một bước CI; không
chạm lưới trước-merge, không chạm lưới ghi-lúc-viết, không chạm hồ sơ đã ký).
**Sinh từ:** phiên dọn repo 21/08 — gói A (worktree · nhánh · pack · rác render)
đã xong cùng ngày; file này là phần còn lại, phần cần một hồ sơ.

> Chữ trong file này là NGUỒN. Chưa có hình; nếu hồ sơ mở, hình đáng vẽ là ba
> đường cong tích luỹ «khoá config · dòng file kiểm · con số suite» trước/sau
> (tầng 2, vào `figures/` của hồ sơ) — chỉ vẽ nếu nó rút ngắn khoảnh khắc quyết.

## 0. Tóm tắt một đoạn

Kit có ba chỗ mà **mỗi hồ sơ đi qua đều để lại một lớp, và không có luật nào
lấy lớp đó đi**: (a) `_acceptance/config.yaml` nhận răng của từng hồ sơ —
51 → 187 dòng trong bốn tuần, 57/63 khoá là răng của 16 hồ sơ đã đóng, chạy lại
hôm nay **15/50 đỏ**; (b) `tests/plugins/run-tests.sh` nhận mọi ca kiểm mới vào
một file đánh số toàn cục — 149 → 10 482 dòng trong bảy tuần, một trong năm
commit của repo chạm nó, hai nhánh song song đã đụng số phải đánh lại; (c) lời
hứa «6 suite xanh» trong GUIDE/README trong khi CI chạy 4 và config khai 5.
Cả ba đều là **trạng thái, không phải sự cố**: hôm nay không chặn ai, nhưng mỗi
chiến dịch re-pin, mỗi cặp phiên song song, mỗi người mới đọc GUIDE đều trả phí.
Đề xuất: **ba câu TRỪ** — răng của hồ sơ sống trong hồ sơ (không vào config),
ca mới của hồ sơ sống trong file của hồ sơ (không vào file chung), và một con số
suite duy nhất (CI chạy đúng danh sách GUIDE nói). Không thêm skill, không thêm
nghi thức, không di chuyển ca cũ, không chạm hồ sơ đã ký.

## 1. Ba lỗ — bằng chứng trên nguồn

### 1a. `config.yaml` là nghĩa địa răng

| Số đo (21/08, main `32819eae`) | Giá trị |
|---|---|
| Dòng `config.yaml` 26/07 → 03/08 → 14/08 → 21/08 | 51 → 90 → 134 → **187** |
| Khoá executor | 63, trong đó **57** trỏ vào `_acceptance/<slug>/*.sh` của **16 hồ sơ** (50 đã ký, 2 `verified`) |
| Răng đó chạy lại trên main hôm nay (bỏ 7 khoá chạy trọn suite) | **15 đỏ / 50**, 1 treo >90 s, 1 lỗi bash (`luu-kho-rang.sh:379` biến chưa khai) |

Vì sao chúng vào config: luật sinh eval bắt **«lệnh đặc thù repo PHẢI là
`config:` — không hardcode»** (`skills/acceptance/SKILL.md` mục 3;
`references/eval-executors.md` mục 6). Luật đó đúng cho repo tiêu thụ (kit không
biết lệnh test của đội), nhưng răng của một hồ sơ **không đặc thù repo — nó đặc
thù hồ sơ**, sống tại `_acceptance/<slug>/rang.sh`, đường dẫn ổn định từ gốc.
Mỗi răng đều tự khai «không vào suite vĩnh viễn» rồi nằm vào file cấu hình vĩnh
viễn — mâu thuẫn ngay trong một dòng chú thích.

Vì sao chúng chết: đối chứng dương **neo vào `origin/main`** (mốc di chuyển).
Sau khi hồ sơ merge, `origin/main == HEAD`, kim về 0 ở cả hai đầu, và chính
răng tự kết luận đúng: «needle này chưa bao giờ tồn tại, phép đo không sống»
(`cat-hinh-thuc-rang.sh`, 29 phép đo ĐỎ). Hồ sơ 1c đã tìm ra nếp đúng —
**mốc bất biến `BASE-1C` đọc từ contract** — nhưng nếp đó chưa thành luật, nên
mọi hồ sơ sau vẫn tự chọn.

Máy đã sẵn sàng cho đường dẫn: `lib/evidence-core.cjs` `isAuthenticVerifier`
chấp nhận **hai dạng** — `config:<key>` *hoặc* đường dẫn script `.sh/.js/.mjs/.py`
(thử tương đối theo thư mục file, theo gốc git, theo cwd). Lưới ghi-lúc-viết và
recheck trước-merge đều đi qua chính hàm này. **Không cần mã mới** ở phía kiểm.

### 1b. Một file kiểm 10 482 dòng, đánh số toàn cục

| Số đo | Giá trị |
|---|---|
| Dòng `tests/plugins/run-tests.sh` 02/07 → 30/07 → 05/08 → 21/08 | 149 → 1 464 → 6 371 → **10 482** |
| Commit chạm file này / tổng commit từ 01/07 | **240 / 1 240** |
| Đụng số ca giữa nhánh song song | `0f8cb7b0` đánh lại P102–114 → P115–127; sổ vấp moi-noi-vong-trao ghi lần hai |
| Thời gian trong CI | 2 m 14 / 3 m 40 của job `tests` |
| Răng hồ sơ **chạy lại trọn suite** 2 phút chỉ để đọc một dòng | **11 script** (`p194-rang.sh`, `so-ca.sh`, `rang-veto.sh`, `ccnc-rang.sh`…) |

Số ca P1…P200 là **không gian tên dùng chung** giữa mọi nhánh đang mở: hai hồ
sơ song song đều lấy «số kế tiếp» và đụng nhau lúc merge — đúng hình dạng lỗi
mà North Star đặt tên: chi phí nhân theo số vòng chạy song song. Kit đã có tiền
lệ thoát: các ca `CS6`, `W25`, `TE16c`, `DV5` đặt tên theo **chủ đề**, không
theo số chung — nhưng cũng chưa thành luật.

`ONLY_BLOCK` (chạy một khối) không cứu được thời gian răng: ~46 khối viết thẳng
không đi qua `run()` nên vẫn chạy, một lượt «lọc» vẫn ~3 phút (known-limit
measure-teeth-cleanup, ghi ngay trong đầu file).

### 1c. Ba con số cho một thứ

| Nguồn | Nói gì |
|---|---|
| `GUIDE.md:964-989`, `README.md:187,212` | «6 suite»: hooks scripts plugins design-eval workflows skills |
| `.github/workflows/gate.yml` job `tests` | chạy **4**: scripts hooks plugins workflows |
| `_acceptance/config.yaml` `feature_loop.suite_keys` | **5** khoá (4 suite + product_map) |

Hai suite lẻ (`design-eval` 6 ca, `skills`) vẫn **xanh** hôm nay nhưng không ai
chạy từ 20/07. `design-eval` T06 là chân canh `scripts/design-scan.js` khớp bản
dựng — một lời hứa có răng đang không được bấm. Lời hứa «6 suite xanh» trong
checklist bảo trì (GUIDE §10 mục D) là lời hứa **không ai kiểm** — đúng định
nghĩa bằng chứng tự dối, ở chính tài liệu dạy người bảo trì.

## 2. Kiểm bằng first principles từ North Star

| Nguyên tố | Lỗ | Người hưởng cụ thể | Kết |
|---|---|---|---|
| ② Bằng chứng không tự dối | 1a: 15 răng đỏ nằm im trong config; 1c: «6 suite xanh» không ai bấm | Người chạy **chiến dịch re-pin mỗi release** (răng chết nổ đúng lúc đó, không phải lúc viết); người bảo trì đọc GUIDE §10 | **Trượt** — lấp bằng TRỪ |
| ③ Đảo-rẻ là mặt sau của khoảnh khắc quyết | 1b: đụng số ca = một lượt sửa tay + một vòng S4 thừa cho **mỗi cặp** phiên song song | Hai phiên A/B chạy song song (nếp giao thức liên-phiên) | **Trượt** — chi phí nhân theo N |
| ① Ý định chốt trước | không chạm | — | — |

Ba giả định dễ tự lừa đã kiểm:

- *Đây có phải trạm thu phí không?* — **Không thêm lần gọi người nào.** Ba câu
  đều là luật cho máy lúc S1/S3; người không thấy cổng mới.
- *Có phải CỘNG không?* — 1a và 1b là **TRỪ**: bớt một đích ghi (config.yaml),
  bớt một không gian tên chung (số ca). 1c là **làm lời hứa có thật**: hoặc CI
  chạy đủ 6, hoặc GUIDE thôi hứa 6 — hạt giống khuyến nghị vế đầu (xem §3c),
  vì hai suite lẻ đang xanh và rẻ (vài giây).
- *Có di chuyển ca cũ / khoá cũ không?* — **Không.** 57 khoá cũ và 10 482 dòng
  cũ để nguyên; luật chỉ áp cho hồ sơ **kế tiếp**. Khoá cũ xử ở chiến dịch
  re-pin release kế, cùng lượt với việc chạm `_acceptance/<slug>/` vốn đã stale.

## 3. Đề xuất — ba câu TRỪ, mỗi câu một vật

### 3a. Răng của hồ sơ sống trong hồ sơ

Sửa **hai câu** luật sinh eval (`SKILL.md` mục 3 · `eval-executors.md` mục 6):

> Lệnh **đặc thù repo** (suite, build, dev server) PHẢI là `config:` — không
> hardcode. Lệnh **đặc thù hồ sơ** (răng sống tại `_acceptance/<slug>/`) PHẢI
> là **đường dẫn từ gốc repo** (`cmd: _acceptance/<slug>/rang.sh --chan x`) —
> **không thêm khoá vào `config.yaml`**. Răng hồ sơ neo đối chứng dương vào
> **mốc bất biến** khai trong contract (`BASE-<slug>` — nếp 1c), **không** neo
> `origin/main`; răng chết sau merge là hệ quả chấp nhận được, răng **đỏ** sau
> merge là lỗi neo.

Phía thi hành: S4 (`acceptance-verify.js`) nhận `cmd` đã resolve từ skill —
đường dẫn đi qua nguyên vẹn; `ref` ghi vào verifier là chính đường dẫn, và
`evidence-core` chấp nhận nó (§1a). Cần kiểm round-trip một lần (xem §4).

### 3b. Ca mới của hồ sơ sống trong file của hồ sơ

`tests/plugins/run-tests.sh` thêm **một vòng lặp** ở cuối (trước dòng
`Results:`): `for f in tests/plugins/cases/*.sh; do . "$f"; done`. Ca của hồ sơ
kế tiếp viết vào `tests/plugins/cases/<slug>.sh`, dùng chính `run()`/`pass()`/
`fail()` của file cha, **đặt tên theo slug** (`TKDDL-1`, không `P201`). Stdout
giữ **nguyên định dạng** (`  PASS: …`, `Results: …`) để mọi răng đang grep dòng
ca (`so-ca.sh`, `p194-rang.sh`, `rang-mnvt.sh`) không biết gì đã đổi.

Không chia file cũ. Không đánh lại số. `ONLY_BLOCK` hoạt động y nguyên trên ca
trong `cases/` vì chúng đi qua `run()`. Chỗ duy nhất phải biết: ca tự-soi P198
đọc `RUN_TESTS_SELF` — cần đọc thêm `cases/*.sh` (một dòng glob), và **chính
P198 là chiều đỏ** cho việc quên dòng đó.

### 3c. Một con số suite

CI job `tests` thêm **hai bước** (`design-eval`, `skills`; vài giây), và
`feature_loop.suite_keys` **không** thêm (vòng verify mỗi round không cần hai
suite không chạm engine). GUIDE/README giữ nguyên câu «6 suite» — câu đó
**thành thật** thay vì bị sửa. Một ca vĩnh viễn nhỏ, đo **quan hệ** chứ không
đo từ vựng: *danh sách suite trong câu lệnh mẫu GUIDE §10 ⊆ các bước
`bash tests/<t>/run-tests.sh` trong `gate.yml`*. Nếu Cổng 0 chọn vế ngược (thôi
hứa 6), ca này vẫn đúng: nó đo sự khớp, không đo con số.

Sửa `gate.yml` theo hướng **thêm bước kiểm** là đổi hành vi cổng → đi trong hồ
sơ này, không đi đường miễn trừ «bảo trì CI thuần» (chú thích t1_skip 15/08
nói rõ ranh giới).

**Không làm:** không tách file 10 482 dòng · không đánh lại số · không dời 57
khoá cũ · không thêm executor `cases` vào config · không đụng `uat-session`,
`gate-card`, lưới trước-merge · không xoá hai suite lẻ (chúng xanh và có răng
thật).

## 4. Chiều đỏ — thước gắn vào vật, ma trận viết trước

Ba vật, mỗi vật một bộ ba **R+ / R− / R0**, fixture **code sinh trong chính
lần chạy**, đi qua **chính** hàm kiểm mà cổng dùng:

| Vật | R+ (đối chứng dương) | R− (chiều đỏ, ghim đúng thông điệp) | R0 (cô lập lớp) |
|---|---|---|---|
| 3a · evidence-report qua `evidence-core` | eval `cmd: _acceptance/<slug>/rang.sh --chan x` với script tồn tại → verifier hợp lệ, `resolved:` là đường dẫn tuyệt đối | cùng eval, script không tồn tại → `verifier script not found. raw: …` | eval `cmd: config:executors.test.plugins` → vẫn resolve qua config như cũ |
| 3a · đẳng thức khoá config | `số khoá executor (trước hồ sơ) == (sau hồ sơ)` — nếp so-ca, đo trên bản khai máy-đọc trong contract | bản sao config bị tiêm thêm một khoá `rang_*` → răng đỏ ghim `so khoa lech: N -> N+1` | — |
| 3b · stdout suite plugins | `cases/<slug>.sh` có 1 ca PASS → `Results: all plugin tests passed`, số dòng `  PASS:` = cũ + 1 | cùng file, ca trả FAIL → suite exit 1, dòng `  FAIL: <tên>` ghim đúng | bản sao suite gỡ vòng lặp `cases/` → **P198** đỏ («ca trong cases/ không được nạp»), không phải xanh im lặng |
| 3c · quan hệ GUIDE ⊆ gate.yml | cây thật → ca xanh | bản sao `gate.yml` gỡ bước `design-eval` → ca đỏ ghim `suite trong GUIDE khong co trong CI: design-eval` | bản sao GUIDE rút xuống 4 suite → ca **vẫn xanh** (quan hệ ⊆, không ghim con số) |

R0 của 3b là chân quan trọng nhất: không có nó, một ngày nào đó ai đó «dọn»
vòng lặp `cases/` và mọi ca của mọi hồ sơ sau biến mất **mà suite vẫn xanh** —
đúng lớp «luật-đang-tắt» trong sổ ba-lớp-che-màu-xanh.

Đường đo cho **hành vi** (máy có thật sự viết `cmd:` đường dẫn ở S1 không, có
thật sự mở `cases/<slug>.sh` ở S3 không) **cố tình KHÔNG mở** — theo đúng
khuyến nghị hạt giống 15/08: mã tiền định trước; hội đồng phiên sạch chỉ mở
nếu hồ sơ thứ hai sau luật vẫn thêm khoá vào config. Răng đẳng-thức-khoá (3a
hàng 2) đã đủ làm người thấy ngay trên thẻ Cổng 2.

## 5. Vấp dự đoán, ghi trước để hồ sơ khỏi tìm lại

- **Resolve `cmd` trong skill feature-loop.** Skill build `args.evals` với
  `cmd` (đã resolve) + `ref` (gốc). Với đường dẫn, `ref == cmd`. Kiểm bằng ca
  thuần trong suite `workflows` (harness vm-realm), không bằng cách chạy một
  vòng thật — đó chính là lý do suite `workflows` tồn tại.
- **Đường dẫn tương đối trong răng.** `evidence-core` thử ba gốc (thư mục file,
  gốc git, cwd); S4 chạy lệnh từ gốc repo. Răng tự suy `ROOT` từ vị trí script
  (luật «suy từ vị trí script, không hardcode») — mọi răng 1c/veto/tkddl đã làm
  thế, chép nếp.
- **Mốc bất biến `BASE-<slug>`.** Khai trong contract theo đúng khối có marker
  mà `rang-1c.sh:55` đang đọc (`khoi BASE-1C`) — không viết bộ đọc thứ hai
  (lớp «tự viết parser thứ ba», Đợt 1 W-spec).
- **Ca tự-soi P198 và răng `siet-rang`** đọc thân file chạy suite để đột biến
  bản sao. Sau 3b, «thân suite» = file cha + `cases/*.sh`; răng nào chép bản
  sao phải chép **cả thư mục** (lớp «lọc theo đuôi là blacklist» — chép trọn,
  đừng liệt kê).
- **Đẳng thức số ca** (`so-ca.sh`, AC-11 của luu-kho) đếm dòng `  PASS:` —
  ca trong `cases/` in cùng khuôn nên đếm đúng; nhưng **đừng** để `cases/` in
  thêm dòng `Results:` thứ hai — răng `results-last` lấy dòng cuối.
- **Hồ sơ này tự áp luật của nó**: ca của chính nó là `cases/<slug-này>.sh` đầu
  tiên, và răng của nó khai bằng đường dẫn. Nếu hồ sơ này phải thêm một khoá
  vào config để chạy được, luật sai — dừng và viết lại, đừng miễn trừ.
- **Bản vá dở trong worktree cũ**: `luu-kho-rang.sh` có một bản sửa chưa
  commit (13/08, chân đo tag remote theo ref thay vì grep sha trần) — lưu ở
  scratchpad phiên 21/08. Không thuộc hồ sơ này (hồ sơ luu-kho đã ký), ghi để
  chiến dịch re-pin kế biết có lời giải sẵn.

## 6. Điều cố tình không làm

Không dọn `docs/handoff/` (12 file hết hạn, 0 liên kết từ tài liệu vào) và 3
spec của bản song sinh Codex (`codex-native-parity`, `model-switchpoint`,
`design-lane-switches`) trong hồ sơ này — chúng là T1 thuần, có thể đi một PR
docs riêng bất kỳ lúc nào; trộn vào đây chỉ làm diff hồ sơ khó đọc · không gộp
hai thư mục plan/spec (`docs/plans` người · `docs/superpowers` máy) — tách có
nghĩa, 48 liên kết vào, gộp là đổi tên không đổi chất · không tách CI thành ma
trận song song (tiết kiệm ~1 phút, không phải nút thắt) · không sửa GUIDE theo
kiểu đổi tên mục «(1.11.0)…» — đó là một hồ sơ viết lại tài liệu, không phải
dọn.

## Nguồn

- North Star + ba nguyên tố + luật «chỉ TRỪ không CỘNG»: `CLAUDE.md`,
  `docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md`.
- Luật sinh ra lỗ 1a: `skills/acceptance/SKILL.md` mục 3;
  `skills/acceptance/references/eval-executors.md` mục 6.
- Máy đã chấp nhận đường dẫn: `lib/evidence-core.cjs` `isAuthenticVerifier`.
- Nếp mốc bất biến: `_acceptance/doi-hanh-vi-cong-nguoi/rang-1c.sh:5-61`.
- Răng chết minh hoạ: `_acceptance/cat-hinh-thuc/cat-hinh-thuc-rang.sh` (neo
  `origin/main`, 29 ĐỎ trên main 21/08).
- Không gian tên số ca + đánh lại: commit `0f8cb7b0`; `tests/plugins/run-tests.sh:1-35`
  (`run()`, `ONLY_BLOCK`, known-limit 46 khối inline).
- Ba con số suite: `GUIDE.md:964-989`, `README.md:187-212`,
  `.github/workflows/gate.yml` job `tests`, `_acceptance/config.yaml`
  `feature_loop.suite_keys`.
- Chính sách re-pin theo release: `GUIDE.md` §7.1.
- Sổ ba-lớp-che-màu-xanh, lọc-theo-đuôi-là-blacklist, tự-viết-parser-thứ-ba —
  sổ nhớ phiên.
