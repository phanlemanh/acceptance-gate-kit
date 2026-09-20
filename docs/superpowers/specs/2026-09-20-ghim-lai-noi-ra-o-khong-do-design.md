# Thiết kế — Làn ghim lại phải NÓI RA ô nó không đo

Ngày 2026-09-20 · slug `ghim-lai-noi-ra-o-khong-do` · T2 · owner `phanlemanh@gmail.com`
· owner gọi tên vòng 20/09 (đo ở kho tiêu thụ crm, kit 2.17.0) — vòng meta duy nhất
sau mốc 2.17.0 được hai kho tiêu thụ nhận (aes #8 · MapPoster #57, 20/09), theo luật
chiều rộng (b) của CLAUDE.md.

Gốc: /Users/manh-macmini/dev/crm/_acceptance/tiep-thi-tuyen-doi-tac

## 1. Vấn đề — một trường gánh hai nghĩa, và cái giá không ai nói

`executor: ui-check` trong `evals.yaml` mang HAI nghĩa bên trong kit:

| Nghĩa | Ở đâu | Hệ quả |
|---|---|---|
| (1) neo nghĩa vụ **lớp nhìn-thấy** | `lib/lop-nhin-thay.cjs` (`coUiObserved`), lint W8 `scripts/eval-coverage-lint.js:250`, thẻ Cổng Phạm vi `scripts/gate-card.js:707`, thẻ Cổng Bằng chứng `:1058-1060`, NOTE `scripts/pre-merge-check.sh:1028-1030` | hợp đồng `surfaces: [ui]` bị ĐẨY phải khai ≥1 ui-check |
| (2) **định tuyến làn** ghim lại | `lib/evidence-core.cjs:358` `REPIN_MACHINE_EXECUTORS = ['test','script']`; `feature-loop/scripts/repin-lane.mjs:193-203` | ui-check/judgment KHÔNG bao giờ chạy trong làn máy — giới hạn ĐÃ KHAI (chú thích trên hằng, GUIDE §7.1, ADR 0014) |

Làm đúng (1) thì mất chốt máy ở (2), và **không chỗ nào nói ra cái giá đó** — không ở
lúc khai (W8/thẻ Cổng Phạm vi chỉ khuyên «thêm ui-check»), không ở lúc ghim (dòng
`kind:repin` chỉ mang `evals_exit` của eval máy; mẫu số của mọi phép kiểm vi phạm
là «eval máy» nên không dòng nào kêu).

### Số đo (crm, 20/09/2026, kit 2.17.0)

- 9 hồ sơ có ui-check · 30 hồ sơ từng ghim lại · giao = 6.
- `tiep-thi-tuyen-doi-tac`: 25 eval (14 test · 6 script · 4 ui-check · 1 judgment);
  ghim 6 lần, `evals_exit` luôn đúng 20 khoá; E6 · E9 (ui-check) vắng cả 6 lần, không
  dòng nào nói.
- `tieng-viet-cho-crm`: 7/12 eval là ui-check.
- **Câu SKILL «hồ sơ mà diff chạm đúng phần ui-check đo phải đi vòng S4 delta, không
  đi re-pin» KHÔNG có máy nào cưỡng chế** — `repin-lane.mjs` không đọc `paths` của eval
  nào ngoài máy, `--skip-unchanged` chỉ hỏi «cây có bằng pin không». Đo trên chuỗi 6
  lần ghim của `tiep-thi-tuyen-doi-tac`: khoảng 3 (`d8240a5f→c7b02d56`, 332 tệp) đổi
  **3 tệp UI thật nằm trong `paths` của E6** (`campaign-detail.tsx`,
  `saved-views-menu.tsx`, `view-removal.ts`), khoảng 1 và 6 đổi
  `_acceptance/tiep-thi-tuyen-doi-tac/rang/chien-dich.mjs` (cũng trong `paths` E6/E9).
  Cả ba lần hồ sơ ghim xanh, không S4 delta. Ngưỡng mở vòng kế của GUIDE §7.1 («≥1 hồi
  quy UI lọt qua re-pin») **không quan sát được** bằng vật nào — không ai ghi diff có
  chạm hay không.

Kit đã có đúng nguyên tắc cần dùng — `machineEvalIdsSkipped()` + khoá `evals_not_run`,
«pin phải NÓI RA chúng, không được im» (2.12.0) — nhưng chỉ áp cho ô tự khai
`status: not-run`, chưa áp cho ô bị loại VÌ KIỂU, và chưa áp cho «vật đo của ô đó đã
đổi».

Người hưởng: người ký / người đọc thẻ ở kho tiêu thụ (crm hôm nay), và người đọc
GUIDE §7.1 muốn biết ngưỡng đang đếm tới đâu. Nguyên tố **2 — bằng chứng không tự
dối** (pin nói ra thứ nó không chứng), nguyên tố **1** cho phần khai (giá của một lựa
chọn được nói TRƯỚC khi chọn).

## 2. Nguyên tắc chọn — nói ra, không chặn; một vị từ, hai bên gọi

- **Không đổi hành vi chặn nào.** Bên đọc (`checkRepinEvals`, pre-merge) giữ nguyên;
  mọi dòng pin cũ ở mọi kho tiêu thụ vẫn hợp lệ. Vòng này chỉ làm pin THÔI IM.
- **Không chạm `lib/**`, `hooks/**`, `pre-merge-check.sh`, `recheck-evidence.cjs`.**
  Vị từ «eval máy đáng ghim» đã có sẵn trong lib (`isRepinMachineEval`,
  `REPIN_MACHINE_EXECUTORS`) — writer (làn) và thẻ cùng GỌI nó, không dựng bản thứ hai.
  Hạng máy-suy: **T2** (không tệp nào khớp `t3_paths`).
- **Khuôn một chỗ có marker + round-trip.** Dòng pin đổi khuôn → `REPIN-TEMPLATE`
  trong SKILL đổi cùng; ca LN5 hiện có (khoá script == khoá khuôn) mở rộng sang hồ sơ
  có đủ loại ô. Thẻ đọc lại đúng vật làn ghi.
- **Giới hạn khai phải có ngưỡng ĐẾM ĐƯỢC.** Sau vòng này, ngưỡng của GUIDE §7.1 đếm
  bằng một lệnh grep trên run-log.

## 3. Thiết kế

### A — dòng pin nêu ô bị loại vì kiểu (writer `repin-lane.mjs`)

Dòng `kind:repin` thêm khoá **`evals_not_machine`**: mảng id của mọi eval có executor
∉ `core.REPIN_MACHINE_EXECUTORS` (hôm nay: `ui-check`, `judgment`), theo thứ tự bản
khai. Cùng luật hiện diện với `evals_not_run`: hồ sơ không có ô nào → khoá VẮNG HẲN,
không phải mảng rỗng. Bất biến phân hoạch, đúng bằng xây dựng vì ba tập lọc trên MỘT
mảng `evalRecords`:

```
keys(evals_exit) ⊔ evals_not_run ⊔ evals_not_machine = mọi id trong evals.yaml
```

**KIỂU thắng TRẠNG THÁI:** một eval ngoài làn máy khai `status: not-run` (ui-check not-run —
crm có hồ sơ 7/12 ui-check, ô này có thật) chỉ vào `evals_not_machine`, KHÔNG vào
`evals_not_run` — `machineEvalIdsSkipped` của lib đã lọc theo kiểu máy trước khi lọc
trạng thái, nên phân hoạch giữ đúng bằng xây dựng; phép đo khẳng định mỗi id xuất hiện
ĐÚNG MỘT lần trong hợp ba tập (gap-probe F2).

**Ma trận fixture viết trước (gap-probe F1)** — bốn AC phủ bốn hình dạng của vị từ B:

| AC | eval | chốt máy? |
|---|---|---|
| AC-a | E1 `test` | có |
| AC-b | E2 `script` khai `not-run` | KHÔNG (not-run không phải chốt) |
| AC-c | E6 `ui-check` có `paths` · E7 `ui-check` khai `not-run` | KHÔNG |
| AC-d | E12 `judgment` không `paths` · E13 `test` | có (ghép test là lối W8 khuyên) |

Danh sách kỳ vọng «AC không có chốt máy» = **[AC-b, AC-c]**, viết trước và so đẳng thức ở
section làn, thẻ gate 2, thẻ gate 1; hai mutant mỗi bên (∃ thay ∀ · đếm not-run là chốt) phải
đỏ có tên.

Section `### Re-pin lần <N>` thêm hậu tố ` · ngoài làn máy: E6, E9, E12` (id đúng
thứ tự khoá). Không ô → không hậu tố.

### A′ — dòng pin nêu ô ngoài làn máy mà VẬT ĐO đã đổi (răng cho câu S4-delta)

Làn đã biết pin cũ (`verified_commit` của báo cáo trước khi ghi) và đã có `git diff`
+ `globToRe` (cùng hàm S4 dùng cho vùng vật, `carry-plan.mjs`). Với mỗi id trong
`evals_not_machine` có khai `paths`: nếu `git diff --name-only <pin cũ> HEAD` — mốc là
`verified_commit` TRƯỚC khi làn ghi, KHÔNG phải `HEAD~1` (giữa hai lần ghim ở crm là hàng
trăm commit; gap-probe F3) — có tệp khớp một glob → id vào khoá **`evals_not_machine_touched`** (mảng, tập con của
`evals_not_machine`, vắng hẳn khi rỗng). Diff tính THÔ (không loại `_acceptance/`,
không loại `t1_skip_globs`): `paths` của E6 ở crm trỏ cả `_acceptance/<slug>/rang/**`
— răng của chính eval đổi là vật đổi.

Section thêm ` · diff chạm vật đo ngoài làn máy: E6 — chưa chứng lại, đi vòng S4 delta`.
Eval ngoài làn máy KHÔNG khai `paths` thì không vào khoá này và section ghi
`(E12 không khai paths)` ngay sau id trong hậu tố A, để «vắng» không đọc thành «không
chạm».

**Không chặn**: làn vẫn exit 0 và ghi pin. Chặn (từ chối ghim khi chạm) là quyết định
khác, để ngưỡng quyết: GUIDE §7.1 đổi ngưỡng thành đếm được —
`grep -l '"evals_not_machine_touched"' _acceptance/*/run-log.jsonl | wc -l` giữa hai
bản phát hành; ≥1 hồi quy UI lọt qua một lượt ghim có khoá này → mở vòng chặn.

### B — mức TIÊU CHÍ: «AC không có chốt máy»

Vị từ: **AC có chốt máy** ⟺ ∃ eval `criterion: AC-n` với `isRepinMachineEval(e)`
(executor máy VÀ không khai not-run). Nguồn: `lib/evidence-core.cjs`, cả hai bên gọi.

- Làn: section thêm ` · AC không có chốt máy: AC-2, AC-5`.
- Thẻ Cổng Bằng chứng (`gate-card.js`, gate 2): cờ **`finfo`** «AC không có chốt máy khi
  ghim lại: AC-2 (E6 ui-check), AC-5 (E12 judgment) — làn ghim lại chỉ chạy test/script;
  diff chạm vật các eval này phải đi vòng S4 delta». Nếu dòng repin CHỐNG LƯNG
  `verified_commit` (dòng `kind:repin` có `sha` == `verified_commit`, không phải dòng đầu tiên
  có khoá — gap-probe F4) mang `evals_not_machine_touched` → thêm cờ **`fwarn`** «pin hiện
  tại: diff đã chạm vật E6 đo (ui-check), chưa chứng lại»; pin sau đó sạch → cờ tắt. Hồ sơ toàn eval máy → không cờ
  nào (chiều im). `--extract` gate 2 thêm `chot_may: { ac_khong: [...], touched: [...] }`.
- Round-trip: cùng một hồ sơ code-sinh, danh sách AC trên thẻ == danh sách trong section
  do làn ghi.

### C0 — lúc KHAI: nói kèm giá

- W8 (`eval-coverage-lint.js:250`): giữ nguyên tiền tố (`W8 surfaces include a
  human-visible …` — PV4 ghim tiền tố), NỐI câu giá: «Giá đã khai: eval ui-check không
  chạy trong làn ghim lại (GUIDE §7.1) — AC chỉ có ui-check sẽ không có chốt máy khi
  ghim lại; muốn có chốt, ghép thêm ≥1 eval test/script cho cùng AC».
- Thẻ Cổng Phạm vi (gate 1): cờ `finfo` cùng vị từ B trên `evals.yaml` (chưa có báo
  cáo): «AC không có chốt máy khi ghim lại: AC-2 (E6 ui-check)…»; `--extract` gate 1
  thêm `chot_may: { ac_khong: [...] }`. Không đổi `routing` (hoi/bao) → baseline LM20
  không trôi.
- SKILL feature-loop, câu giới hạn ở nghi thức re-pin: «hồ sơ mà diff chạm đúng phần
  ui-check đo phải đi vòng S4 delta» → «làn ghi `evals_not_machine_touched` khi diff
  chạm `paths` của eval ngoài làn máy — pin KHÔNG chứng lại chúng, vòng S4 delta là lối
  đúng; ngưỡng ở GUIDE §7.1». GUIDE §7.1 sửa cùng câu + ngưỡng đếm được.

### C1 — TÁCH HAI NGHĨA: quyết định thiết kế, KHÔNG làm vòng này

Ba lối đã thấy, chưa lối nào rẻ và đúng tầng rõ ràng:

| Lối | Hình dạng | Được | Mất |
|---|---|---|---|
| (i) eval `ui-check` có `cmd` máy thật (không `steps`) được làn ghim lại chạy | mở rộng `REPIN_MACHINE_EXECUTORS` theo HÌNH DẠNG eval, không theo kiểu | crm E6-kiểu-lệnh có chốt máy | làn cần dev_server + driver; hôm nay làn là «không người, không server»; đổi bên đọc (lib, T3) và mọi kho vendored |
| (ii) trường mới `lane: machine` trên eval ngoài máy | eval tự khai «chạy được trong làn» | kiểu executor giữ nguyên nghĩa (1) | thêm một lời khai người gõ — cùng lớp «thêm một dòng khai» ADR 0016 đã phải dựng luật hai vế |
| (iii) nghĩa (1) đổi neo: lớp nhìn-thấy đo bằng `layer: ui-observed` thay vì `executor: ui-check` | tách hẳn: kiểu = định tuyến, nhãn = nghĩa vụ | một trường một nghĩa | 4 bộ đọc của (1) đổi cùng lúc, hồ sơ cũ đi đường đọc-cũ |

Đây là câu hỏi cho owner (đánh-đổi giá trị: thêm lời khai vs đổi neo vs chấp nhận giới
hạn có ngưỡng). Vòng này ghi **hạt giống**
`docs/plans/2026-09-20-hat-giong-tach-hai-nghia-ui-check.md` trỏ về hồ sơ này; ô chỉ
mở khi ngưỡng A′ đếm được ≥1 hoặc owner gọi tên.

## 4. Lựa chọn đã loại

- **Reader đòi khoá mới (VIOLATION khi vắng)** — đổi hành vi chặn, chạm `lib/**` (T3),
  và đỏ mọi pin cũ ở mọi kho: đúng thứ owner nói không làm ở A.
- **Làn TỪ CHỐI ghim khi diff chạm `paths` ui-check** — là răng thật cho câu S4-delta,
  nhưng chặn ở kho tiêu thụ ngay lượt đầu (crm: 3/6 khoảng sẽ dừng) khi chưa có số về
  hồi quy thật; để ngưỡng đếm được của A′ quyết.
- **Tính «AC không có chốt máy» từ bảng eval của báo cáo (exec + crit)** thay vì từ
  `evals.yaml` qua vị từ lib — bảng báo cáo không mang `status: not-run`; hai nguồn hai
  kết luận.
- **Đặt vị từ AC vào `lib/`** — đúng tầng nhất nhưng là T3 + đợi mọi kho vendor lại;
  vị từ mức eval đã ở lib, mức AC chỉ là gộp theo `criterion`, round-trip làn↔thẻ giữ
  hai bản gộp không trôi.

## 5. Phép đo (cặp hai chiều, fixture code-sinh)

Tệp ca vĩnh viễn `tests/scripts/repin-lane-noi-ra.test.mjs` (bộ chọn `GNRO_CASES`,
nếp `repin-lane-lop-cu.test.mjs`): kho git tạm với một hồ sơ đủ bốn loại ô (test ·
script khai not-run · ui-check có paths · judgment không paths); mỗi ca chạy vật thật
rồi bản sao đã tiêm, ghim thông điệp. Thẻ đo bằng `gate-card.js --extract` + HTML.
Bên đọc cũ: `git archive 2826f807 lib scripts` (mốc 2.17.0, bất biến) đọc dòng mới →
clean. Chiều im của section (hồ sơ toàn eval máy) so byte với **writer 2.17.0** — `git archive
2826f807 feature-loop lib scripts`, trọn thư mục — chạy trên cùng hồ sơ trong cùng kho tạm
(gap-probe F5); đối chứng dương: hồ sơ bốn ô phải khác đúng ở các hậu tố mới.

## 6. Ngoài phạm vi

Xem `## Out of scope` của contract — nguồn sự thật phạm vi.

## 7. Nâng phạm vi sau lượt chấm 2 (owner trả lại ở Cổng Bằng chứng 20/09)

Hai lớp do chính lượt chấm tìm ra, nằm trong PHÉP ĐO của hồ sơ này chứ không trong
sản phẩm. Owner chọn sửa trước khi vật rời tay, nên chúng thành tiêu chí:

**AC-8 mở rộng — bộ đếm của chiều im phải có đối chứng dương.** Phép so «`surfaces: [api]`
ra cùng số dòng cảnh báo với bản 2.17.0» đếm bằng `/^\[/`, mà dòng cảnh báo của lint THỤT
ĐẦU DÒNG (`      [slug] W6 …`) — neo ấy khớp 0 dòng, nên phép so là `0 === 0`: một câu xanh
chưa từng có khả năng đỏ, đúng trong hồ sơ dựng ra để chặn bằng-chứng-tự-dối. Sửa: neo
`/^\s*\[/`, cộng hai vế mới — hồ sơ `surfaces: [ui]` phải đếm > 0, và hai hồ sơ phải cho
số KHÁC nhau — cộng một mutant hoàn nguyên neo cũ.

**AC-10 mới — bộ ca không được ghi đè cây làm việc.** GN04/GN05/GN11 tiêm vào tệp văn bản
và bản đầu làm theo lối `bak = read(X); write(X, mutant); … finally write(X, bak)` — tức
ghi thẳng vào `SKILL.md`, `GUIDE.md`, `eval-coverage-lint.js` đang theo dõi git. Hai đường
hỏng: E12 chạy lại trọn suite scripts **song song** với E4/E5/E11 nên hai ca cùng ghi một
tệp là đua thật; và `finally` không chạy khi tiến trình bị giết, nên một lượt chấm bị cắt
để lại bản tiêm trong cây. Sửa: mọi mutant đi qua `mutant()` (bản sao trong thư mục tạm) và
ca nhận đường dẫn bản sao qua tham số `ref`, cùng lối GN09/GN10 đã dùng. Phép đo là HÀNH VI
(`git status` trước/sau khi chạy ba ca CÓ mutant), không phải grep khuôn viết — bản đầu của
GN13 grep `writeFileSync(GUIDE` và tự bắt chính chuỗi mô tả mutant của nó.

Hai thứ phụ trợ cho bản sao chạy được: tệp ca nhận gốc kho qua `GNRO_ROOT` (bản sao ở thư
mục tạm không suy ra gốc từ vị trí nó), và `GNRO_SKIP_MUTANTS` để một bản sao chạy chiều
thật không tự tiêm tiếp.
