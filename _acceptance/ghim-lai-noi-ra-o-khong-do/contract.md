---
schema_version: 1
feature: Làn ghim lại phải NÓI RA ô nó không đo — eval ngoài làn máy (ui-check/judgment), vật đo của chúng đã đổi, và AC không có chốt máy — ở dòng pin, section Re-pin, thẻ hai cổng và lint W8; không đổi hành vi chặn nào
slug: ghim-lai-noi-ra-o-khong-do
owner: phanlemanh@gmail.com
risk_tier: T2               # feature-loop/scripts/repin-lane.mjs · scripts/gate-card.js · scripts/eval-coverage-lint.js · SKILL feature-loop · tests/scripts/ — không chạm lib/**, hooks/**, pre-merge-check.sh, recheck-evidence.cjs
surfaces: [cli]
status: verified
approved_by: Phan Le Manh
approved_at: 2026-09-20
design_doc: docs/superpowers/specs/2026-09-20-ghim-lai-noi-ra-o-khong-do-design.md
---

# Acceptance Contract: ghim-lai-noi-ra-o-khong-do

## Context

`executor: ui-check` gánh hai nghĩa trong kit: neo nghĩa vụ lớp nhìn-thấy (`lib/lop-nhin-thay.cjs`,
W8, thẻ hai cổng, NOTE pre-merge — hợp đồng `surfaces: [ui]` bị đẩy phải khai ui-check) và định
tuyến làn ghim lại (`REPIN_MACHINE_EXECUTORS = ['test','script']`, `lib/evidence-core.cjs:358` —
ui-check/judgment không bao giờ chạy trong làn máy, giới hạn ĐÃ KHAI ở GUIDE §7.1 / ADR 0014).
Làm đúng nghĩa một thì mất chốt máy ở nghĩa hai, và không chỗ nào nói ra cái giá đó: dòng
`kind:repin` chỉ mang `evals_exit` của eval máy, mẫu số của mọi phép kiểm vi phạm là «eval máy».

Đo ở kho crm 20/09/2026 (kit 2.17.0): 9 hồ sơ có ui-check · 30 từng ghim · giao 6.
`tiep-thi-tuyen-doi-tac` ghim 6 lần, 20 khoá mỗi lần, E6/E9 (ui-check) vắng cả 6, không dòng
nào kêu; `tieng-viet-cho-crm` 7/12 eval là ui-check. Câu SKILL «diff chạm đúng phần ui-check đo
phải đi S4 delta, không đi re-pin» KHÔNG có máy cưỡng chế: khoảng ghim 3 của
`tiep-thi-tuyen-doi-tac` (332 tệp) đổi 3 tệp UI thật trong `paths` của E6, hồ sơ vẫn ghim xanh.
Kit đã có nguyên tắc đúng — `evals_not_run`, «pin phải NÓI RA ô nó không đo» (2.12.0) — nhưng
chỉ áp cho ô tự khai `status: not-run`. Người hưởng: người ký / đọc thẻ ở kho tiêu thụ.
Nguyên tố 2 (bằng chứng không tự dối); phần khai (W8, thẻ Cổng Phạm vi) là nguyên tố 1.

Gốc: /Users/manh-macmini/dev/crm/_acceptance/tiep-thi-tuyen-doi-tac

Source input: owner gọi tên 20/09/2026 (đo sống ở crm) + thiết kế
`docs/superpowers/specs/2026-09-20-ghim-lai-noi-ra-o-khong-do-design.md`.

Vị từ dùng chung của mọi AC dưới: **eval máy đáng ghim** = `isRepinMachineEval(e)` của
`lib/evidence-core.cjs` (executor ∈ `REPIN_MACHINE_EXECUTORS` VÀ không khai `status: not-run`);
**eval ngoài làn máy** = executor ∉ `REPIN_MACHINE_EXECUTORS`; **AC có chốt máy** ⟺ ∃ eval máy
đáng ghim có `criterion` = AC đó. Làn và thẻ cùng GỌI lib, không dựng bản luật thứ hai.

## Criteria

- AC-1: Given kho git tạm code-sinh có hồ sơ đã ghim với `evals.yaml` theo MA TRẬN VIẾT TRƯỚC bốn AC × năm loại ô — AC-a{E1 `test`} · AC-b{E2 `script` khai `status: not-run`} · AC-c{E6 `ui-check` khai `paths`, E7 `ui-check` khai `status: not-run`} · AC-d{E12 `judgment` không khai `paths`, E13 `test`} — When chạy `repin-lane.mjs --write` trên cây sạch, Then dòng `kind:repin` vừa ghi mang `evals_not_machine` = `["E6","E7","E12"]` (đúng thứ tự bản khai; KIỂU thắng TRẠNG THÁI — E7 ngoài làn máy dù khai not-run chỉ vào mảng này), `evals_not_run` = `["E2"]`, `keys(evals_exit)` = `["E1","E13"]`; mỗi id của `evals.yaml` xuất hiện ĐÚNG MỘT lần trong hợp ba tập và hợp BẰNG tập id (đẳng thức tập). Đối chứng cùng kho: hồ sơ thứ hai chỉ có eval máy → dòng repin KHÔNG có khoá `evals_not_machine` (vắng hẳn, không phải `[]`). Chiều đỏ, bản sao `repin-lane.mjs` (mũi tiêm khớp đúng một lần, qua `node --check`): (a) bỏ bộ lọc kiểu → khoá vắng dù hồ sơ có ui-check, ĐỎ ghim «khoa evals_not_machine vang»; (b) ghi mảng rỗng thay vì bỏ khoá → ĐỎ ghim «mang rong thay vi vang»; (c) bộ lọc not-run bỏ điều kiện kiểu → E7 vào cả hai mảng, ĐỎ ghim «id xuat hien hai mang».
- AC-2: Given hồ sơ của AC-1, When làn ghi section `### Re-pin lần <N>`, Then dòng `sha:` mang hậu tố ` · ngoài làn máy: E6, E7 (E7 không khai paths), E12 (E12 không khai paths)` và ` · AC không có chốt máy: AC-b, AC-c` — danh sách kỳ vọng VIẾT TRƯỚC từ ma trận: AC không có chốt máy ⟺ MỌI (∀) eval phủ nó đều không phải eval máy đáng ghim (`isRepinMachineEval` của lib qua `criterion`); AC-a có chốt (test), AC-d có chốt (ghép test cạnh judgment — chính lối W8 khuyên), AC-b không (not-run không phải chốt), AC-c không; thứ tự theo xuất hiện trong `evals.yaml`. Hồ sơ toàn eval máy → KHÔNG có hai hậu tố này (chiều im): section so BYTE với section do WRITER mốc `2826f807` (`git archive 2826f807 feature-loop lib scripts`, trọn thư mục — làn 2.17.0) ghi trên CÙNG hồ sơ trong cùng kho tạm, sau chuẩn hoá `run_id`/`ts`/ngày; đối chứng dương: trên hồ sơ bốn AC hai section PHẢI khác đúng ở các hậu tố mới. Chiều đỏ: bản sao gộp bằng ∃ thay ∀ (AC có bất kỳ eval ngoài máy → vào danh sách) → AC-d lọt vào, ĐỎ ghim «got AC bang ton tai»; bản sao đếm not-run là chốt → AC-b biến mất, ĐỎ ghim «not-run tinh la chot»; bản sao bỏ hậu tố AC → ĐỎ ghim «section thieu AC khong chot may»; bản sao đổi khuôn section trên hồ sơ toàn máy → ĐỎ ghim «section troi so voi lan 2.17.0».
- AC-3: Given khuôn giữa marker `REPIN-TEMPLATE` trong `feature-loop/skills/feature-loop/SKILL.md`, When rút dòng `"kind":"repin"` của khuôn và đối chiếu với dòng làn ghi trên hồ sơ có ĐỦ bốn loại ô (AC-1, thêm diff chạm `paths` E6 để khoá A′ có mặt), Then tập khoá của khuôn BẰNG tập khoá của dòng thật (mở rộng ca LN5: khuôn phải mang cả `evals_not_machine` lẫn `evals_not_machine_touched`), và trên hồ sơ toàn eval máy tập khoá thật = khuôn TRỪ đúng ba khoá tuỳ chọn. Câu giới hạn ở nghi thức re-pin của SKILL và GUIDE §7.1 nay nói làn GHI `evals_not_machine_touched` khi diff chạm `paths` (không chỉ «phải đi S4 delta»), và GUIDE §7.1 mang một lệnh đếm ngưỡng (grep khoá đó trên `_acceptance/*/run-log.jsonl`) — lệnh ấy RÚT từ GUIDE lúc chạy, chạy thật trên kho tạm của AC-4 và in đúng số hồ sơ có khoá. Chiều đỏ: bản sao SKILL gỡ khoá mới khỏi khuôn → ĐỎ ghim «khuon SKILL thieu»; bản sao GUIDE gỡ lệnh đếm → ĐỎ ghim «GUIDE khong con lenh dem».
- AC-4: Given hồ sơ của AC-1 với `paths` của E6 = `["apps/x/**", "_acceptance/<slug>/rang/**"]` và pin cũ `verified_commit` = HEAD₀, When sau pin có HAI commit — commit 1 đổi `apps/x/a.ts` (khớp glob), commit 2 chỉ đổi tệp KHÔNG khớp glob nào — rồi chạy làn `--write` MỘT lần, Then làn exit 0 và ghi (không chặn), dòng repin mang `evals_not_machine_touched` = `["E6"]` (mốc diff là pin cũ `verified_commit`, không phải `HEAD~1`), section mang ` · diff chạm vật đo ngoài làn máy: E6 — chưa chứng lại, đi vòng S4 delta`; lượt ghim kế, sau khi chỉ commit thêm tệp không khớp glob → khoá VẮNG HẲN và không có hậu tố ấy; E12 không khai `paths` → không bao giờ vào khoá này. Diff tính thô từ pin cũ tới HEAD: tệp đổi dưới `_acceptance/<slug>/rang/` khớp glob → vẫn tính là chạm. Chiều đỏ: bản sao bỏ bước so diff → khoá vắng dù đã chạm, ĐỎ ghim «touched vang du diff cham»; bản sao đổi mốc diff thành `HEAD~1` → khoá vắng ở kịch bản hai commit, ĐỎ ghim «moc diff khong phai pin cu».
- AC-5: Given `paths` của E6 = `["apps/x/*.ts"]` và tệp đổi `apps/x/sub/a.ts`, When chạy làn, Then E6 KHÔNG vào `evals_not_machine_touched` (khớp glob bằng `globToRe` của `feature-loop/scripts/carry-plan.mjs` — `*` không xuyên `/`, cùng ngữ nghĩa vùng vật S4); đối chứng dương cùng kho: tệp đổi `apps/x/a.ts` → E6 vào khoá. Chiều đỏ: bản sao khớp bằng tiền tố chuỗi → E6 vào khoá oan ở ca thứ nhất, ĐỎ ghim «khop tien to thay glob».
- AC-6: Given dòng repin mang cả hai khoá mới (từ AC-4), When chấm bằng bên đọc HIỆN TẠI (`scripts/recheck-evidence.cjs` + `scripts/pre-merge-check.sh` của cây đang đo) VÀ bên đọc mốc `2826f807` (2.17.0, dựng bằng `git archive 2826f807 lib scripts` — lớp vendored ở kho tiêu thụ hôm nay), Then cả bốn lượt thoát 0, không VIOLATION, không NOTE mới — không đổi hành vi chặn nào. Đối chứng đỏ cùng kho: dòng repin bị gỡ `evals_exit` → cả hai lớp đỏ ghim `recorded no evals_exit` (chứng bên đọc cũ đang sống, không xanh vì không chạy). Mốc vắng (clone nông) → ca ĐỎ có tên «thieu moc», không xanh lặng.
- AC-7: Given hồ sơ của AC-4 ở trạng thái SAU LƯỢT GHIM 1 (báo cáo có bảng eval; dòng repin có `sha` == `verified_commit` mang `evals_not_machine_touched: ["E6"]`), When render thẻ Cổng Bằng chứng (`gate-card.js --gate 2`, HTML và `--extract`), Then thẻ có cờ `finfo` «AC không có chốt máy khi ghim lại: AC-b (E2 script not-run), AC-c (E6 ui-check, E7 ui-check not-run)» với danh sách AC BẰNG danh sách kỳ vọng viết trước [AC-b, AC-c] VÀ BẰNG danh sách trong section Re-pin làn vừa ghi (round-trip làn ↔ thẻ, đẳng thức tập), cờ `fwarn` «pin hiện tại: diff đã chạm vật E6 đo (ui-check), chưa chứng lại», và `--extract` mang `chot_may: { ac_khong: ["AC-b","AC-c"], touched: ["E6"] }`; `routing.hoi`/`routing.bao` KHÔNG đổi so với bản gate-card ở mốc `2826f807` trên cùng fixture. Ca đặc hiệu cùng kho: run-log có repin#1 (mang touched) rồi repin#2 (sạch) và `verified_commit` = sha của repin#2 → KHÔNG cờ `fwarn`, `chot_may.touched = []` — cờ chỉ đọc dòng CHỐNG LƯNG (`sha` == `verified_commit`), không phải dòng đầu tiên có khoá. Hồ sơ toàn eval máy → không cờ nào, `chot_may.ac_khong = []` (chiều im). Chiều đỏ: bản sao thẻ bỏ vị từ AC → cờ vắng, ĐỎ ghim «the thieu co AC khong chot may»; bản sao gộp ∃ thay ∀ → AC-d lọt, ĐỎ ghim «got AC bang ton tai»; bản sao đếm not-run là chốt → AC-b mất, ĐỎ ghim «not-run tinh la chot»; bản sao đọc dòng đầu có khoá thay vì dòng khớp sha → ca đặc hiệu ra cờ, ĐỎ ghim «fwarn tu dong repin khong chong lung».
- AC-8: Given hợp đồng `status: draft` với `evals.yaml` theo ma trận AC-a..AC-d của AC-1, When render thẻ Cổng Phạm vi (`--gate 1`), Then thẻ có cờ `finfo` cùng vị từ («AC không có chốt máy khi ghim lại: AC-b …, AC-c …») với danh sách BẰNG [AC-b, AC-c], và `--extract` gate 1 mang `chot_may.ac_khong = ["AC-b","AC-c"]`; hợp đồng toàn eval máy → không cờ, mảng rỗng; hai mutant ∃/not-run như AC-7 mỗi cái ĐỎ có tên. **Chiều im của W8 phải có ĐỐI CHỨNG DƯƠNG của chính bộ đếm** (nâng phạm vi 20/09 sau lượt chấm 2): phép so «`surfaces: [api]` ra cùng số dòng cảnh báo với bản mốc `2826f807`» chỉ sống khi bộ đếm ấy ĐẾM ĐƯỢC — nên cùng ca phải khẳng định (i) hồ sơ `surfaces: [ui]` không ui-check cho số dòng > 0, và (ii) bản mốc `2826f807` in > 0 dòng trên chính fixture `[api]` — phép so không có lực khi cả hai vế đều 0. Fixture `[api]` vì thế mang một tiêu chí NGƯỠNG id số (`parseACs` chỉ nhận `AC-<số>`; id chữ làm mọi W im) không có ca dưới-ngưỡng, để W1 nổ thật. Chiều đỏ: bản sao tệp ca hoàn nguyên bộ đếm về neo `^\[` (dòng cảnh báo của lint thụt đầu dòng nên neo ấy khớp 0 dòng, và phép so hoá 0 === 0) → ca ĐỎ ghim «bo dem chieu im hang dung». Lint W8 (`scripts/eval-coverage-lint.js`) khi cảnh báo thiếu ui-check GIỮ NGUYÊN tiền tố `W8 surfaces include a human-visible` và NỐI câu giá nêu «không có chốt máy khi ghim lại» + «GUIDE §7.1» + lối «ghép thêm ≥1 eval test/script cho cùng AC»; hợp đồng `surfaces: [api]` → không thêm dòng W nào (chiều im, so số dòng W trước/sau). Chiều đỏ: bản sao lint bỏ câu giá → ĐỎ ghim «W8 thieu cau gia»; bản sao thẻ bỏ cờ gate 1 → ĐỎ ghim «the cong 1 thieu co».
- AC-10: Given bộ ca của hồ sơ này, trong đó GN04/GN05/GN11 phải tiêm vào tệp VĂN BẢN (SKILL.md · GUIDE.md · eval-coverage-lint.js), When chạy chính tệp ca cho MỌI ca có mutant (danh sách SUY TỪ VẬT: `CASES.filter(c => c.mutants?.length && c.id !== 'GN13')`) — CÓ chạy mutant — Then bộ ba `(sha256, size, mtime_ns)` của MỌI tệp git-theo-dõi dưới `scripts/`, `lib/`, `feature-loop/`, `tests/` và `GUIDE.md` (danh sách từ `git ls-files`, không gõ tay) BẰNG bản chụp trước lượt chạy — **mtime bắt được cả lần ghi rồi khôi phục Y HỆT byte**, thứ mà một phép đo residue (`git status`) không thấy: mutant đi qua bản sao trong thư mục tạm và đường dẫn bản sao truyền vào ca, KHÔNG ghi đè cây làm việc. Vì sao là tiêu chí chứ không phải ý thích: E12 chạy lại trọn suite scripts SONG SONG với E4/E5/E11 (workflow khai «lệnh eval giữ song song»), nên hai ca cùng ghi một tệp là đua thật; và `finally` không chạy khi tiến trình bị giết, nên một lượt chấm bị cắt để lại bản tiêm trong cây. Chiều đỏ: bản sao tệp ca hoàn nguyên MỘT judge về đúng lối cũ — `finally write(GUIDE, bak)` khôi phục Y HỆT, residue bằng 0 — ca vẫn phải ĐỎ ghim «ca ghi de tep nguon that»; ca tự ghi lại đúng tệp bị chạm từ bản đã chụp (KHÔNG `git checkout` cả nhóm, vì cây thường mang sửa đổi chưa commit của người đang làm). Thêm: cờ bỏ-chiều-đỏ chỉ nhận BẮT TAY NỘI BỘ do chính tệp ca đặt; giá trị lạ → thoát 3 có tên, và lượt bỏ chiều đỏ luôn nối hậu tố «[KHONG CHIEU DO]» rồi thoát khác 0 — một biến môi trường xuất ở CI không được phép làm mọi ca im.
- AC-9: Given cây sau hồ sơ, When chạy bốn suite `feature_loop.suite_keys` + `product-map --check`, Then tất cả thoát 0 (gồm LN/RE/PV4/LM20 hiện có — tiền tố W8 và routing baseline không trôi); tệp ca mới `tests/scripts/repin-lane-noi-ra.test.mjs` được suite scripts tự chạy qua glob; bộ chọn sống: `GNRO_CASES=GNxx` in ĐÚNG MỘT dòng kết quả mang `GNxx`, `GNRO_CASES=GN99` thoát khác 0 in «GNRO_CASES khop 0 ca»; bộ ca nay 13 ca (GN13 của AC-10). Hạt giống `docs/plans/2026-09-20-hat-giong-tach-hai-nghia-ui-check.md` tồn tại, trỏ `_acceptance/ghim-lai-noi-ra-o-khong-do/` (ô này trích lại tên tệp ở Notes) và qua răng VC8 của suite plugins; chiều đỏ: bản sao hạt giống trỏ ô không tồn tại → VC8 đỏ.

## Coverage

Quét theo preset test-matrix (rút gọn: không gian đóng bởi tin gọi tên của owner 20/09 với ba đề
xuất A/B/C có thứ tự). Chân sản phẩm: `[SUY-TỪ-REPO: feature-loop/scripts/repin-lane.mjs ·
lib/evidence-core.cjs (REPIN_MACHINE_EXECUTORS, isRepinMachineEval, machineEvalIdsSkipped) ·
scripts/gate-card.js · scripts/eval-coverage-lint.js · GUIDE.md §7.1 · docs/adr/0014]` + số đo
crm 20/09. Chân ngành: `[NGÀNH: pytest markers skip/xfail — báo cáo in SKIPPED/XFAIL có lý do,
không gộp vào passed]` · `[NGÀNH: JUnit XML <skipped message=…>]` cho nếp «kết quả không chạy
phải có mặt trong báo cáo với lý do» · `[NGÀNH: Bazel --test_tag_filters / Playwright
test.skip(reason)]` cho nếp loại-theo-kiểu phải khai lý do.

- Trục A — NƠI nói ra: dòng run-log | section Re-pin | thẻ Cổng Bằng chứng | thẻ Cổng Phạm vi | lint W8 | GUIDE/SKILL [thước CE: sáu bộ đọc/ghi của dòng pin và của nghĩa (1) liệt ở design §1; 6/6 — AC-1/4 · AC-2 · AC-7 · AC-8 · AC-8 · AC-3]
- Trục B — LOẠI ô không đo: khai `not-run` (đã có, 2.12.0) | ngoài làn máy vì kiểu | ngoài làn máy mà vật đo đổi | ngoài làn máy không khai `paths` [thước CE: phân hoạch tập id evals.yaml — đẳng thức tập của AC-1 là thước; 4/4 — giữ nguyên · AC-1 · AC-4/5 · AC-4]
- Trục C — MỨC: eval | AC [thước CE: `criterion` là khoá nối duy nhất eval→AC trong evals.yaml; 2/2 — AC-1 · AC-2/7/8]
- Trục D — HÌNH DẠNG hồ sơ: đủ bốn loại ô | toàn eval máy (chiều im) | có khoá mới đọc bởi bên đọc cũ [thước CE: LN5 + RE-suite hiện có; mốc `2826f807` bất biến; 3/3 — AC-1..5 · AC-1/2/7/8 · AC-6]

Cross-cutting áp mọi ô Core — **không chặn** (làn vẫn exit 0 và ghi; bên đọc không thêm
VIOLATION; routing hoi/bao của thẻ không đổi); **một vị từ** (`isRepinMachineEval` của lib,
làn và thẻ cùng gọi; mức AC là gộp theo `criterion`, round-trip làn↔thẻ của AC-7 giữ hai bản gộp
không trôi); **khuôn một chỗ** (REPIN-TEMPLATE, AC-3).

Ô gạch có lý do: làn TỪ CHỐI ghim khi diff chạm → Later, ngưỡng đếm được ở GUIDE §7.1 quyết
(entry descope); tách hai nghĩa của `ui-check` (design §3 C1, ba lối) → Later, hạt giống + owner
quyết (entry descope); reader đòi khoá mới → Never, đổi hành vi chặn + T3 (entry descope);
`pre-merge-check.sh` NOTE nói kèm giá → Never, T3 và NOTE đã có ngưỡng riêng (entry descope);
judgment `inputs` coi như `paths` → Never, hai trường hai nghĩa theo eval-executors.md.

## Out of scope

- Làn ghim lại TỪ CHỐI ghim (exit ≠ 0) khi diff chạm `paths` của eval ngoài làn máy — vòng này chỉ NÓI RA; ngưỡng mở: ≥1 hồi quy UI lọt qua một lượt ghim có khoá `evals_not_machine_touched` giữa hai bản phát hành (entry descope).
- Tách hai nghĩa của `executor: ui-check` (định tuyến làn vs neo lớp nhìn-thấy) — hạt giống `docs/plans/2026-09-20-hat-giong-tach-hai-nghia-ui-check.md`, owner quyết (entry descope).
- Sửa bất kỳ tệp nào dưới `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` — kể cả để bên đọc đòi khoá mới (entry descope).
- NOTE «mặt người nhìn nhưng không eval ui-check» của pre-merge nói kèm giá — T3, và NOTE đó đã có ngưỡng siết riêng.
- Coi `inputs` của judgment là `paths` khi tính diff chạm.
- Nâng version plugin — gom theo mốc phát hành.
- Chạm hồ sơ hay lớp vendored của kho tiêu thụ nào — crm nhận qua bản phát hành kế.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl` (xem skill feature-loop — repo chưa dùng feature-loop thì bỏ qua).

## Notes

- **Vòng meta, owner gọi tên 20/09.** Mốc 2.17.0 đã được hai kho tiêu thụ nhận cùng ngày (aes #8, MapPoster #57) → đây là vòng meta duy nhất được phép trước mốc kế theo luật chiều rộng (b). Neo ngoài: dòng `Gốc:` ở Context (hồ sơ crm đo sống).
- **CỘNG có phê duyệt (ADR 0018):** hai khoá mới trên dòng pin + hai cờ thẻ + một câu W8 là CỘNG; owner phê đích danh tại Cổng Phạm vi của vòng này. Trace nguyên tố 2 (pin nói ra thứ nó không chứng); không thêm lượt gọi người nào; không quyết định khó-đảo.
- **Không đổi hành vi chặn** là bất biến của vòng: AC-6 đo bên đọc hiện tại và bên đọc 2.17.0 cùng xanh trên dòng mới.
- Hồ sơ này KHÔNG có `opportunity.md`, nên không có mục `## Đường đo`.
- Mốc `2826f807` là commit gộp mốc 2.17.0 — mốc git BẤT BIẾN của chính kho kit; ca cần lịch sử đầy đủ (CI đã `fetch-depth: 0`).
- Hạt giống C1: `docs/plans/2026-09-20-hat-giong-tach-hai-nghia-ui-check.md` (VC8: hạt giống trỏ về ô này; ô này trích lại tên tệp ở đây).
- Hạt giống sinh trong lúc làm (cùng luật VC8, ô này trích lại tên tệp): `docs/plans/2026-09-20-hat-giong-lan-ghim-phan-biet-bi-giet.md` — `repin-lane.mjs:242` gộp «bị tín hiệu giết» và «không khởi động được» thành «eval thoát 1»; fail-closed nên không xanh giả, nhưng thông điệp làn nói sai về một lượt chưa hề chạy. Một phiên kit khác nêu 20/09 khi rà cùng tệp, đã xác minh tại chỗ; KHÔNG sửa trong vòng này vì hồ sơ đã qua lượt chấm và bản vá sẽ làm bằng chứng hoá cũ.
- Từ vựng: «làn» là term chuẩn (CONTEXT.md); «chốt máy» = eval máy đáng ghim phủ AC — dùng nguyên chữ owner (20/09), chưa vào glossary; nếu vòng kế còn dùng thì thêm term.
- **Known limits (khai ở trần nhát sửa thước, owner chọn lối (1) ngày 20/09):** ba commit sau
  `implemented` chỉ chạm phép đo (`_acceptance/config.yaml` · `evals.yaml` ·
  `tests/scripts/repin-lane-noi-ra.test.mjs`) nên bộ đếm nhát-sửa-thước nổ đúng luật. Ba nhát
  ấy là NỘI DUNG của vòng nâng phạm vi owner yêu cầu khi trả lại ở Cổng Bằng chứng — AC-10 và
  AC-8 mở rộng tự chúng là phép đo, nên sửa chúng tất yếu là chạm thước. Lần chấm này chấp
  nhận ba nhát đó mà không đòi chứng thêm. Ngưỡng: vòng kế chạm trần lần nữa với CÙNG lý do
  thì không được khai lại lối (1) — đó là dấu hiệu thật (entry d-20260920T092117Z-26).
- Bảng dự báo 5 dòng số (luật (c) CLAUDE.md): làm-xong→quyết-được **=** · lượt gọi người/vòng **=** (mục tiêu ≤3, T2) · vòng bị hạ tầng đốt **=** · token máy/vòng **↓ nhẹ** (không có ma trận lớp cũ nhiều mốc như vòng 11/09) · phút máy/lượt chấm **=**. Điều kiện tin cậy: đường verdict không đổi thành phần (không chạm S4/finder/refute).

### Known limits — owner định đoạt tại Cổng Bằng chứng round 2 (20/09/2026)

Hai mươi chín mục ngoài hợp đồng gộp về các lỗ dưới đây; số Ngoài-N là đánh số của thẻ
lượt chấm round 2. Mục 10 và 11 owner cho NÂNG PHẠM VI SỬA NGAY (không nằm ở đây);
mục 17 và 29 đi hạt giống riêng.

- **`pathsCuaEval` đọc `evals.yaml` bằng tay, thiếu chốt block-scalar và không biết thụt
  dòng** (Ngoài-1 · 7 · 8 · 14 · 20 · 25). Bốn hình dạng YAML hợp lệ cho kết quả sai
  LẶNG. Latent chứ không live: dò 283 `evals.yaml` thật ở 6 kho → 0 lệch hôm nay. Việc
  hợp nhất ba bộ đọc: `docs/plans/2026-09-20-hat-giong-hop-nhat-bo-doc-paths.md`.
- **Cờ vàng «pin đã chạm vật ngoài làn máy» bị lượt ghim KẾ xoá, không phải bị chứng lại
  xoá** (Ngoài-6 · 19 · 26). Chạy thêm một lượt ghim sạch là đường tắt tắt cờ. Ngưỡng mở
  vòng CHẶN đã khai ở Out of scope và GUIDE §7.1.
- **`chotMay` của thẻ fail-OPEN lặng khi `evals.yaml` thiếu/hỏng** (Ngoài-3 · 18 · 27):
  thẻ render y như mọi AC đều có chốt máy, trong khi chính tệp ấy có tiền lệ ngược
  (cờ vàng «thẻ không đọc được `lib/lop-nhin-thay.cjs`»).
- **`criterion` không chuẩn hoá trong phép gộp AC của thẻ** (Ngoài-21) — lệch với hai bộ
  đọc khác trong cùng tệp khi `criterion` mang nháy hoặc chú thích.
- **`chamTuPin` fail-IM khi không giải được pin cũ** (Ngoài-2) — xem hạt giống
  `docs/plans/2026-09-20-hat-giong-pin-phan-biet-khong-cham-voi-khong-tinh-duoc.md`.
- **Chú thích trên `pathsCuaEval` khai một giới hạn kèm ngưỡng mà hạt giống chưa tồn
  tại** (Ngoài-4) — nay đã có chỗ trỏ (hạt giống hợp-nhất-bộ-đọc ở trên).
- **Tên khoá `evals_not_machine` tính bằng «không phải test/script» trong khi SKILL và
  GUIDE mô tả là «ui-check/judgment»** (Ngoài-5) — trùng nhau với bảng executor hiện
  tại, lệch nếu kit thêm loại executor mới.
- **Lệnh đếm ngưỡng ở GUIDE §7.1 đếm hồ sơ ĐANG mang khoá, không đếm «hồi quy đã lọt»,
  và không bao giờ giảm** (Ngoài-9 · 16) — người đọc dễ tưởng ngưỡng đã đạt.
- **Vị từ «AC không có chốt máy» viết HAI BẢN** (Ngoài-15) — làn ghi và thẻ đọc dựng lại
  riêng; round-trip của GN09 giữ hai bản khớp trên ma trận hiện có, không phủ ca ngoài.
- **Lời khai trong `evals.yaml` hứa nhiều hơn ca thật đo** (Ngoài-12 · 23 · 24): E7 khai
  một phép kiểm CẤU TRÚC («làn import `globToRe`») mà ca chỉ đo ĐẦU RA; vài chiều đỏ khai
  trong `expected` không tồn tại thành mutant.
- **Chiều đặc hiệu của GN11 đo PROXY (số dòng) chứ không đo NỘI DUNG** (Ngoài-13) — câu
  giá W8 rò sang cảnh báo khác vẫn giữ nguyên số dòng nên ca im.
- **`evals_not_machine_touched` so diff tới CÂY LÀM VIỆC sau khi executor chạy, không tới
  HEAD như SKILL/GUIDE khai** (Ngoài-28) — lệch trong ca hiếm khi executor để lại tạo
  phẩm trong cây.
- **Chấp nhận, không sửa** (Ngoài-22): section Re-pin lặp id trong câu «không khai
  paths» — dư thừa nhưng không sai, và đúng khuôn đã duyệt.
