# Thước có cửa — thiết kế vòng meta của cửa sổ 2.15 → 2.16

> Ô: `_acceptance/thuoc-co-cua/opportunity.md` (owner ký Cổng Đáng 17/09, build).
> Căn cứ: `docs/findings/2026-09-17-ra-ha-tang-23-lop.md` ·
> `2026-09-17-boi-canh-truoc-va-sau-R.md` §6 · `2026-09-17-quan-sat-r1-ba-dinh.md` ·
> `2026-09-16-truy-nguyen-thuoc-khong-co-cua.md` · hồ sơ mốc 2.15.0 Notes §3 §4.
> Hạng T3 (chạm `lib/`). Không chạm UI — bỏ đặc tả UX và design-pass có tên trong sổ.

## 0. Một đoạn

Kit canh vật và lời, hụt thước: sửa thước không có tên, không được đếm, không có trần; và
không bước nào kiểm hạ tầng đo trước khi chấm, nên tường lộ ở S4 (R1: 2/3 lượt chấm bị hạ
tầng chặn, 4/8 câu gọi người là hạ tầng). Vòng này làm hai câu và một cửa — *đứng được trước
khi chấm* · *chạy không đè nhau* · *cửa cho thước* — cộng ba lỗi đúng/sai mở đầu. Phạm vi đầy
đủ owner đã chốt là 21 tiêu chí; khuôn hợp đồng trần 15. Hợp đồng vì thế viết theo đúng thứ tự
ưu tiên owner giao (A → đường nền → lệnh suite tuần tự → D → phần còn lại của B, C) và **cắt
sau D**; phần đuôi có tên ở §7, owner kéo lại được ở Cổng Phạm vi.

## 1. Ba hướng đã cân

| Hướng | Nội dung | Vì sao chọn / bỏ |
|---|---|---|
| **① Máy giữ ở chỗ thắt có sẵn** (chọn) | Mọi chặn-trước-lượt-chấm đặt trong `s4-args.mjs` (từ chối sinh tệp args thì không dispatch được); mọi xếp hàng đặt trong chính script workflow (chuỗi promise theo tài nguyên); mọi số đếm suy từ git và run-log, không từ lời khai | Không thêm cổng, không thêm lệnh người; tái dùng lối `die()` đã có ca kiểm; workflow không có hệ tệp nên xếp hàng trong bộ nhớ của lượt là cách duy nhất không cần tệp khoá |
| ② Tệp khoá trên đĩa cho tài nguyên | lệnh bọc `giu-khoa … -- <cmd>` | Bỏ: thời gian chờ nằm TRONG lời gọi Bash nên tính vào trần công cụ (`tool-kill-rule.md`) — đúng ca crm «chân cuối hàng bị bỏ đói»; khoá theo đường dẫn repo đóng cửa song song nhiều vòng |
| ③ Làn LLM soi diff thước · LLM liệt kê tiền đề | finder thứ tư đọc `rang/` | Bỏ: phá nhát vùng-vật 14/09 (làn phản bác không soi hồ sơ); R1 cho thấy LLM bắt `uv` thiếu mà không bắt Python 3.9 vì không chạy suite thật |

## 2. Phần A — ba lỗi đúng/sai

**A1 · S4 nghe `status: not-run`.** `s4-args.mjs:113` không đọc trường `status`. Sửa: rút
`machineEvalIdsSkipped(evalsText)` từ `lib/evidence-core.cjs` (CÙNG hàm làn ghim lại và bên đọc
pin đang dùng — không chép), bỏ các id đó khỏi `evals`, ghi khoá `evalsNotRun` vào tệp args —
khoá VẮNG HẲN khi không ô nào khai (cùng luật với `evals_not_run` của dòng repin). Workflow
chuyển danh sách đó cho bước tổng hợp thành MỘT dòng «không chạy theo hồ sơ: E…» trong báo cáo —
không bảng, không khối `- eval:` (luật hai vế: khối mang mã thoát cho ô khai không-chạy là vi
phạm). `carry-plan.mjs` bỏ qua cùng tập id để danh sách chạy-lại không gọi tên ô vắng khỏi args.

**A2 · Thẻ Cổng Bằng chứng đọc mã thoát đã khai.** `gate-card.js:786` so cứng
`exit_code === '0'`. Sửa: nạp `lib/eval-yaml.cjs` theo lối phòng thủ sẵn có, lấy
`expectedExits(evalsT).byId`, một eval máy «đủ trường» khi mã của nó bằng mã đã khai HOẶC 0
(giới hạn đã khai không còn thì không bị cờ). Bản khai lỗi (`errs` khác rỗng) → coi như không
khai, như `evidence-core.cjs:840`. Ca đối chứng «CHƯA đủ trường» có sẵn (thiếu trường thật)
giữ nguyên màu.

**A3 · `bo-qua-phai-thay-dinh-nghia-phep-do` gộp vào vòng này.** Ba tiêu chí của hồ sơ draft
thành AC-3…AC-5 ở đây, chữ giữ nguyên ý; năm eval thành các ca DN1…DN5 trong
`tests/scripts/bo-qua-dinh-nghia-phep-do.test.mjs`. Vật: khối `SKIP-UNCHANGED-PREDICATE` của
`repin-lane.mjs` — tập «tệp định nghĩa phép đo» SUY từ cái làn thật sự đọc (đường `config.yaml`
mà `resolveConfigKey` dùng, `evals.yaml` của từng slug trong `perSlug`), không phải hai chuỗi gõ
tay. Hồ sơ draft: hợp đồng và evals dời vào `su-lieu/` của chính nó, thay bằng một
`opportunity.md` `stage: archived` trỏ về đây — kit chưa có trạng thái nghỉ cho vòng, để
`draft` thì thẻ mở phiên mời Cổng Phạm vi mãi cho một việc đã làm xong. Một vòng, một chữ ký.

## 3. Phần B (lõi) — đường nền hạ tầng ở S1

**Vật:** `feature-loop/scripts/duong-nen.mjs --root <repo> --slug <slug> [--base <ref>] [--ag-root <dir>] [--cache-root <dir>]`.
Không LLM. Mỗi suite là một tiến trình con; SKILL gọi script ở chế độ NỀN (máy được báo khi
xong) — ở kho kit chân suite mất gần 14 phút, không lời gọi công cụ nào được ôm trọn nó. Chạy là BƯỚC ĐẦU của S1, trước khi máy viết bất cứ tệp nào của vòng. Bốn chân:

| Chân | Làm gì | Đỏ khi | Thông điệp ghim |
|---|---|---|---|
| `cong-cu` | từ đầu (bỏ các phép gán biến môi trường đứng trước) của mọi lệnh trong `feature_loop.suite_keys` và mọi `executors` — hỏi máy bằng `command -v` | một từ đầu không có trên máy | `nen cong-cu: THIEU <từ> (khoá <executors.…>)` |
| `suite` | chụp `git status --porcelain`, chạy các lệnh suite MỘT lần, TUẦN TỰ, chụp lại | suite thoát khác 0 → `nen suite: DO SAN <khoá> ma <n>`; cây bẩn thêm → `nen suite: CAY BAN SAU SUITE <tệp>` | như cột bên |
| `luoi` | `pre-merge-check.sh <root> --base <merge-base nhánh gốc>` — KHÔNG `--slug`; ưu tiên bản vendored của repo (thứ CI chạy), không có thì bản plugin | có dòng VIOLATION → in nguyên từng dòng dưới nhãn «vi phạm CÓ SẴN» | `nen luoi: <k> vi pham co san` |
| `engine` | băm chín tệp của khối `INIT-CI-COPY-LIST` (đọc danh sách TỪ marker, không chép) ở ba nơi: bản vendored của repo · bản plugin cache mới nhất (`resolve-plugin.mjs --json`; vị trí cache nhận qua cờ `--cache-root` để phép đo tự dựng cache của nó; máy không có cache → vế so ấy `bo-qua`, không đỏ) · bản đang chạy (suy từ vị trí script) | băm lệch giữa hai bản bất kỳ | `nen engine: LECH <tệp> (vendored ≠ dang-chay)`; kho tự host → `nen engine: tu-host` |

**Đầu ra:** `_acceptance/<slug>/duong-nen.md` — frontmatter `slug · at · sha · nen: xanh|do ·
cong_cu · suite · luoi · engine` (mỗi chân `xanh|do|bo-qua`) + một mục mỗi chân. Khuôn đặt MỘT
chỗ có marker (`skills/acceptance/references/duong-nen-template.md`, khối `DUONG-NEN-TEMPLATE`);
bên viết rút khuôn qua `resolve-plugin`, bên đọc là `gate-card.js`; ca round-trip rút-từ-writer-
đọc-bằng-reader. Mã thoát của script: 0 nền xanh · 1 nền đỏ (vẫn ghi tệp) · 2 không chạy được
(thiếu config, không phải kho git) — mã 2 KHÔNG ghi tệp.

**Thẻ Cổng Phạm vi:** khối «Nền hạ tầng» in bốn chân bằng số và từng dòng đỏ; nền đỏ → cờ vàng
«đỏ ở đây không phải lỗi của vòng — quyết trong gói này»; tệp vắng → cờ vàng đường đọc-cũ
(một cờ nói cả hai khả năng: hồ sơ sinh trước 2.16, hoặc đường nền chưa chạy xong), KHÔNG
chặn. Khuôn DÒNG ĐỎ thuộc cùng marker; ca thẻ lấy tệp đỏ do chính script ghi. Thẻ Cổng Bằng chứng không đọc tệp này.

**SKILL:** S1 thêm bước 0 «đường nền» + gói Cổng Phạm vi kèm khối; đỏ thì máy tự gỡ thứ gỡ được
(cài qua trình quản lý gói repo đã khai, đổi lệnh executor) TRƯỚC khi mời cổng, thứ chỉ người gỡ
được thì gom MỘT lần vào lời mời cổng. Đây là chỉ dẫn; phép đo của vòng đo ĐẦU RA của script.

## 4. Phần C (lõi) — lệnh suite tuần tự

Hôm nay khối machine (`acceptance-verify.js:664`) trải phẳng mọi lệnh eval, mọi lệnh suite và
mọi lần lặp vào MỘT mảng song song. Sửa nhỏ nhất: tách `distinctCmds` theo TƯ CÁCH THÀNH VIÊN của `args.suiteCommands` (so
chuỗi lệnh — cùng bất biến «id suite suy từ chuỗi lệnh»), KHÔNG theo phép thử «mảng eval của
lệnh rỗng»: lệnh suite trùng lệnh của một eval bị gộp nên mảng eval của nó không rỗng, và ở
chính hồ sơ này cả năm lệnh suite đều là lệnh của E20–E24 (phản biện context sạch, F1). Lệnh
ngoài danh sách suite giữ song song; lệnh suite đi vòng
`for … await` — tuần tự, theo thứ tự `suite_keys`. Thời gian CHỜ là thời gian agent chưa được
dispatch, nên không bao giờ tính vào trần của lệnh. Không tệp khoá, không gì theo repo — hàng
đợi sống trong bộ nhớ của MỘT lượt chấm (mã lượt = slug + round), đúng ràng buộc «khoá theo mã
lượt». `dryRun` thêm trường `commandGroups: { songSong: […], tuanTu: […] }` để kế hoạch dispatch
quan sát được mà không tốn agent.

Thành phần verdict không đổi: `machine[]` dựng lại bằng duyệt `distinctCmds` và gom theo
`r.cmd`; đạt/trượt theo từng lệnh; id suite suy từ CHUỖI lệnh (bất biến AC-2 của hồ sơ
suite-run-log-provenance). Đổi thứ tự chạy chỉ đổi đồng hồ và mức tranh tài nguyên.

Giới hạn khai: lệnh suite vẫn chạy chồng lên lệnh eval, làn ui, hội đồng, làn tìm-lỗi — ca
REJECT lượt 1 của mốc 2.15.0 (eval chiều-im đụng suite hooks) cần phần đuôi «tài nguyên của
lượt» mới chữa trọn.

## 5. Phần D — cửa cho thước

**D1 · Một nguồn phân loại.** Ba tập đã có trong khối `NGOAI-VAT` của `s4-args.mjs`
(`HO_SO_VAN_BAN_GLOBS`, `t1_skip_globs`, `laFileDo`) tách ra `feature-loop/scripts/lib/phan-loai.mjs`
xuất `phanLoai(path, ctx) → 'thuoc' | 'vat' | 'ho-so' | 'ngoai'`; `s4-args.mjs` dùng lại đúng
module đó cho `laNgoaiVat` / `laFileDo` (không đổi hành vi — các ca VV và VVM giữ màu).
Thứ tự xét: `ngoai` (`t1_skip_globs` — gồm cả bản ghi mốc định tuyến máy sinh nằm dưới
`tests/`) → `thuoc` (`tests/`, tệp test/spec, `_acceptance/config.yaml`, và TRONG hồ sơ chỉ
`evals.yaml`, thư mục `rang/`, tệp script đo `.sh .mjs .cjs .js .py`) → `ho-so` (mọi thứ còn
lại dưới `_acceptance/`: văn bản, run-log, sổ, `s4-args.json`, `evidence/`, thẻ, hình) → `vat`.
Module xuất cả các tập nguyên thuỷ để `s4-args.mjs` dựng lại ĐÚNG `laNgoaiVat` / `laFileDo`
hiện có (rộng hơn lớp thước của bộ đếm ở vế «tệp không phải văn bản» — khác mục đích, giữ
nguyên hành vi). `paths` của eval không tham gia phân lớp của bộ đếm.
Không khoá config mới (hồ sơ khoi-tim-loi đã bác).

**D2 · Bộ đếm.** `feature-loop/scripts/thuoc-vat.mjs --root --slug`:
- *mốc sàn* = commit ĐẦU TIÊN đưa hợp đồng sang `implemented` (`git log --reverse -S`), hoặc
  commit của dòng sổ «trần thước — …» gần nhất nếu có (van, xem D3);
- *nhát sửa thước* = số commit sau mốc sàn chạm đường `thuoc` mà KHÔNG chạm đường `vat`; commit
  chạm cả hai (nhát sửa vật kèm ca hồi quy — lệ kit) đếm ở ô `lan`, không vào trần; commit chỉ
  chạm `ho-so`/`ngoai` không là gì. Commit S3 đứng TRƯỚC mốc sàn nên không bao giờ bị đếm — TDD
  tự do. Phép thử rẻ 17/09 trên ba vòng đã ký: trước mốc sàn 4 · 2 · 9 (không đếm), thuần thước
  sau mốc sàn 2 · 3 · 4, lẫn 0 · 3 · 7;
- *dòng* = `git diff --numstat <mốc sàn>..HEAD` gom theo lớp;
- `--giua-hai-luot` = liệt kê tệp `thuoc` đổi giữa hai dòng `round-tally` liền nhau của
  run-log (sha hai đầu; sha không thuần nhất → nói thẳng «không liệt kê được», mã 3, như
  `carry-plan.mjs`) — lớp hai chống gộp commit qua mặt bộ đếm; SCRIPT, không làn LLM nào;
- `--target <sha>…` = in lớp của một commit, để máy chép vào ô `target` của dòng sổ;
- `--write` = nối MỘT dòng `{"kind":"thuoc-vat","round":n,"san":"<sha>","vat":[a,b],
  "thuoc":[c,d],"ho_so":[e,f],"nhat":k,"lan":m,"tep_thuoc":[…]}` vào run-log (khuôn một chỗ có marker
  `THUOC-VAT-LINE`, round-trip writer → reader thẻ).

**D3 · Trần, máy giữ.** `s4-args.mjs` gọi bộ đếm ngay sau khi tính `round`: `nhat ≥ 3` → thoát
mã 4, KHÔNG sinh tệp args, thông điệp ghim `tran nhat sua thuoc: <k> nhat o implemented` rồi ba
lối: **khai giới hạn có tên** · **đổi cách đo** · **mở vòng có chủ ngữ là thước** — lối ba in
sẵn ĐÚNG MỘT dòng lệnh `/feature-loop:feature-loop "thước của <slug>: <tệp thước đã chạm>"`.
Số 3 = ngưỡng mở ô và điểm dừng R1 đã thử. Van: người chọn lối một hoặc hai → máy ghi dòng sổ
`type: revisit` bắt đầu đúng chuỗi «trần thước — » rồi commit; commit đó thành mốc sàn mới, bộ
đếm về 0. Không có dòng sổ ấy thì không lệnh nào mở được trần. Khuôn `/goal` đã coi «chạm trần
nhát sửa thước» là lần dừng hợp lệ (2.15.0).

**D4 · Sổ và thẻ.** Khuôn `DEC-ID-RECIPE` nhận ô TUỲ CHỌN `"target"` đứng SAU `impact` (bộ đọc
`loop-health` khớp chuỗi thô `type`/`stage`); giá trị chép từ `thuoc-vat.mjs --target`. Sổ GHI,
git ĐẾM: số của trần không bao giờ đọc từ sổ. Thẻ Cổng Bằng chứng thêm MỘT dòng trong khối
«Phán quyết đối kháng»: `vật +a/−b · thước +c/−d · nhát sửa thước k` đọc từ dòng `thuoc-vat`
cuối của run-log; run-log không có dòng ấy → KHÔNG in gì, không cờ (hồ sơ đã ký giữ nguyên thẻ,
bản ghi mốc định tuyến không đổi). Dòng báo, không phải ô hỏi.

## 6. Đọc-cũ, hai chiều, tin cậy

**Đường đọc-cũ:** args không `evalsNotRun` → workflow chạy như cũ · run-log không dòng
`thuoc-vat` → thẻ im · hồ sơ không `duong-nen.md` → cờ vàng trên thẻ Cổng Phạm vi, không chặn ·
dòng sổ không `target` → mọi bộ đọc như cũ · hợp đồng không ở `implemented` lần nào → bộ đếm
trả 0 với ghi chú «chưa có mốc sàn», s4-args đi tiếp. Repo tiêu thụ không phải migrate gì.

**Hai chiều cho mỗi phép đo mới** (measure-birth: cùng fixture code-sinh, thông điệp ghim, đối
chứng dương trước): chiều ĐỎ phá vật trong bản sao; chiều IM trên hồ sơ greenfield và cây lành
→ không cờ, không dòng, không mã khác 0. Fixture là kho git dựng trong lượt chạy bằng
`buildRepo()` như các ca `s4-args-*`; đường dẫn suy từ vị trí tệp ca; đột biến trên bản sao
trong bộ nhớ như `vung-vat-mutants`.

**Dự báo năm dòng**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 làm-xong → quyết-được | ↓ | ít lượt chấm bị hạ tầng chặn; tường lộ trước Cổng Phạm vi |
| 2 lượt gọi người | ↓ hạ tầng · ↑ tối đa 1 khi trần nổ | câu hạ tầng gom vào gói Cổng Phạm vi; lần dừng ở trần là lượt NGOÀI thiết kế, thay cho chuỗi câu phạm-vi-đo rải rác (crm 4, R1 1) |
| 3 lượt chấm bị hạ tầng đốt | ↓ | `not-run` thôi bị thi hành; suite thôi đè nhau; công cụ thiếu lộ ở S1 |
| 4 token máy/vòng | ↓ theo số lượt bị đốt · = mỗi lượt | không chạm khối nào của S4; đường nền 0 token |
| 5 phút máy/lượt chấm | ↑ | suite tuần tự: đường găng của làn máy là TỔNG thay vì MAX các suite; cộng một lần chạy suite ở S1 |

Điều kiện tin cậy: (i) đường verdict — finder → bác bỏ trong hợp đồng → REJECT — KHÔNG đổi
thành phần: đường nền và trần chặn TRƯỚC lượt chấm, suite tuần tự đổi THỨ TỰ chạy chứ không đổi
điều được chấm, phần D chỉ ĐẾM; riêng A1 bỏ khỏi lượt chấm đúng những ô hồ sơ đã tự khai
không-chạy — có răng cả hai chiều. (ii) ngưỡng (a) đã chạm ở mốc 2.15.0, nên dòng 4–5 của cửa
sổ này không được cắt dựa trên số của vòng này.

## 7. Phần đuôi — có tên, ngoài hợp đồng trừ khi owner kéo lại

Thứ tự ưu tiên owner giao đặt chúng sau D: `## Vật trước vòng` + `## Tiền đề` trong khuôn hợp
đồng · W9 theo sự thật git (tách `vatDaONhanhGoc` vào `lib/`, thêm đường dẫn kế hoạch) · W10 ·
tiền đề kiểm lại trước mỗi lượt S4 trong `s4-args` + khoá config `duong_do` · khuôn giao diện
đường đo cấp repo (`--chay`, mã 2 «từ chối đo», đặt/trả, DB của lượt, máy chủ tự xưng cây +
SHA, kiểm sống trước mỗi eval — phần duy nhất đổi phân loại BLOCKED trong workflow) · khai tài
nguyên theo eval và theo lệnh suite + bộ xếp hàng xuyên làn máy và làn ui. Sáu tiêu chí. Vòng
này tự áp hai mục đầu BẰNG TAY trong hợp đồng của chính nó, như R1.

## 8. Tự ăn thuốc

Đường nền chạy tay cho chính vòng này TRƯỚC khi viết tệp nào (HEAD `c5f6e1f8`), kết quả nằm
trong gói Cổng Phạm vi. Hợp đồng mang `## Vật trước vòng` và `## Tiền đề` viết tay. Mọi dòng sổ
`fix` ở S4 của vòng mở đầu bằng «thước:» hoặc «vật:»; nhát thứ ba → dừng ba lối, dù bộ đếm máy
chưa ship. `wf-usage` sau mọi Workflow. Args S4 chỉ do `s4-args.mjs` sinh.
