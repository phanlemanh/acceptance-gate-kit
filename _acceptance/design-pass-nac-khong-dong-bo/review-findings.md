## Trong hợp đồng

- **DP10 branch (c) cannot go red — the "unrecognized reaction value" flag has no live assertion**
  file: `tests/plugins/design-pass-nac.test.mjs:423`
  severity: high
  AC: AC-14
  source: bugs
  Branch (c) of DP10 (AC-10 / eval E10, which promises "`reaction: nac-9` → cờ vàng NÊU NGUYÊN VĂN 'nac-9'") asserts only `c.out.includes('nac-9')`. But `scripts/gate-card.js:378` already renders the raw id as a fallback: `esc(REACTION_LABEL[dp.reaction] || dp.reaction || '(chưa khai)')` → the card prints `Phản ứng ở nấc: <b>nac-9</b>` whether or not the flag at `scripts/gate-card.js:313` exists. The assertion therefore measures the fallback render, not the flag.

  Verified empirically: `git archive HEAD` into a temp tree, delete the line `else if (!REACTION_LABEL[dp.reaction]) dpFlags.push('Nấc phản ứng không nhận diện được: ...')` from `scripts/gate-card.js`, run `DP_CASES=DP10 node tests/plugins/design-pass-nac.test.mjs` → `PASS: [DP10]`, exit 0. Control: deleting *both* reaction flags (the missing-key one too) makes branch (b) fail, so the tree is otherwise wired correctly and (c) is the dead branch.

  This is the repo's own banned class ("assertion âm-tính-một-mình" / "thước không phân biệt"): the reader could silently stop flagging unknown ladder ids — a session writing `reaction: nac-7` would reach Cổng Phạm vi with no warning — and the evidence column would still read PASS.

  Fix: pin the actual flag text, e.g. assert `c.out.includes('Nấc phản ứng không nhận diện được')` AND `c.out.includes('nac-9')`, or extract the flag string to a shared constant read by both the reader and the case (same pattern as `CO_VANG_THIEU` on line 415, which does discriminate).

  Failure scenario: Remove the `else if (!REACTION_LABEL[dp.reaction]) dpFlags.push(...)` line from scripts/gate-card.js:313 (the whole unknown-value flag). `DP_CASES=DP10 node tests/plugins/design-pass-nac.test.mjs` still prints `PASS: [DP10]` and exits 0, because the card's fallback at gate-card.js:378 prints the literal string `nac-9` anyway. AC-10's "giá trị lạ: cờ vàng NÊU TÊN" is therefore unverified — a session declaring `reaction: nac-7` reaches the gate with no yellow flag and the eval column still reads green.

- **E6 vế "có nhánh bỏ im lặng" has zero mutant coverage; evals.yaml declares a mutant that does not exist**
  file: `_acceptance/design-pass-nac-khong-dong-bo/evals.yaml:107`
  severity: medium
  AC: AC-14
  source: bugs
  `evals.yaml` E6 declares: "m1 = đổi hàng degrade thành 'đi tiếp, không ghi gì' → đỏ ghim 'có nhánh bỏ im lặng'; m2 = xoá tên khoá `divergence:` khỏi hàng đó → đỏ ghim 'vết không có khoá đóng'".

  The implementation does something else. `checkTraceAndFidelity` (tests/plugins/design-pass-nac.test.mjs:158-161) is an if / else-if chain:
  158  if (!degradeRow) ...
  160  else if (!/divergence:/.test(degradeRow)) errs.push('vet khong co khoa dong, moi phien ghi mot cho')
  161  else if (/không ghi gì|đi tiếp, không/.test(degradeRow)) errs.push('co nhanh bo im lang')

  The only mutant that touches the degrade row is `m-bo-im-lang` (line 355-356), which replaces the whole row with `| Không mở bước phân kỳ | Đi tiếp, không ghi gì. |` — that row has no `divergence:`, so it trips line 160 and the case expects the needle `'vet khong co khoa dong'`, i.e. the message E6 attributes to m2. The real m2 (`m-tu-vung`) mutates `` `divergence: opened` `` inside the `## 3b` section, producing `'thieu tu vung dong cua khoa vet'` — a third message not in E6 at all.

  Net effect: line 161 (`co nhanh bo im lang`) is never reached by any mutant, so E6 declares 3 vế with 3 mutants but only 2 vế are actually proven able to go red.

  Fix: add a mutant that keeps `divergence:` in the degrade row while adding an escape (e.g. `| Không mở bước phân kỳ | Ghi `divergence: skipped` — hoặc đi tiếp, không ghi gì. |`) and expects `co nhanh bo im lang`, then correct E6's `expected` to name the messages the case actually emits.

  Failure scenario: Delete line 161 of tests/plugins/design-pass-nac.test.mjs (`else if (/không ghi gì|đi tiếp, không/.test(degradeRow)) errs.push('co nhanh bo im lang')`). DP6 still passes: no mutant in the E6 matrix reaches that branch. The vế E6 names as its m1 outcome is unproven, and the messages E6 promises for m1/m2 do not match the two the case actually produces.

- **Hình 4+5 — assert «có nhánh bỏ im lặng» (vế lõi AC-6) KHÔNG BAO GIỜ đỏ được; mutant khai trong evals rơi vào vế khác**
  file: `tests/plugins/design-pass-nac.test.mjs:161`
  severity: high
  AC: AC-14
  source: measurement
  checkTraceAndFidelity dùng chuỗi else-if: (159) thiếu hàng → (160) hàng không có `divergence:` → (161) hàng có chữ «không ghi gì» → 'co nhanh bo im lang'. Mutant duy nhất chạm hàng này là m-bo-im-lang (dòng 355-356) thay cả hàng thành `| Không mở bước phân kỳ | Đi tiếp, không ghi gì. |` — hàng mutant KHÔNG còn chuỗi `divergence:`, nên nhánh (160) bắn trước và nhánh (161) không bao giờ chạy. Hệ quả: vế «không có đường bỏ im lặng» — chính lời hứa của AC-6 — là assert chết; xoá nó đi ca vẫn PASS. Nặng thêm vì evals.yaml E6 (dòng ~110-114) khai NGUYÊN VĂN «m1 = đổi hàng degrade thành "đi tiếp, không ghi gì" → đỏ ghim "có nhánh bỏ im lặng"» và «m2 = xoá tên khoá `divergence:` → đỏ ghim "vết không có khoá đóng"»: thực tế m1 ghim vế của m2, còn vế m1 tuyên thì không có mutant nào. Cả nhánh (159) 'bang tra degrade thieu hang' cũng không mutant nào chạm.

- **Hình 5 — DP2 tuyên 4 vế nhưng chỉ 2 vế có chiều đỏ (evals khai «số mutant = số vế»)**
  file: `tests/plugins/design-pass-nac.test.mjs:83`
  severity: high
  AC: AC-14
  source: measurement
  checkDefault đẩy 4 thông điệp khác nhau: (81) description thiếu «mặc định không đồng bộ», (83) description thiếu «gọi tên», (88) thân skill thiếu «KHÔNG ĐỒNG BỘ», (89) nac-3 không có điều kiện. Chạy lại bộ kiểm ngoài file với đúng 2 mutant khai ở dòng 308-318: m-desc chỉ bắn vế (81), m-body chỉ bắn vế (89) — vế (83) và vế (88) KHÔNG mutant nào chạm. Cụ thể m-body thay cả mệnh đề nac-3 nhưng giữ nguyên «KHÔNG ĐỒNG BỘ» trong câu chuẩn, nên (88) chết. Đây đúng lớp mà chính đầu file (dòng 4) và evals.yaml (dòng 9-16, «mỗi ca khai SỐ MUTANT = SỐ VẾ ĐƯỢC KHẲNG ĐỊNH») tuyên là hợp đồng: hai vế đã tuyên có thể biến mất khỏi SKILL mà DP2 vẫn in PASS.

- **Hình 5 — DP7 tuyên «thang đủ BỐN nấc» nhưng chỉ có điểm-case cho một nấc**
  file: `tests/plugins/design-pass-nac.test.mjs:175`
  severity: medium
  AC: AC-14
  source: measurement
  Vòng (174-175) khẳng định BUILDER-LADDER có đủ 4 phần tử '1.'..'4.', nhưng ma trận chỉ có m-nac-giua (368-371) xoá riêng nấc '3.'. Ba phần tử còn lại ('1.', '2.', '4.') là assert không có chiều đỏ — đúng mẫu P105 «số assert = số phần tử» mà chính DP1 làm đúng ngay trong cùng file (dòng 303 sinh 4 mutant, mỗi id một mutant). Hai ca cùng file, cùng hình dạng «danh sách đóng», nhưng chỉ một ca dựng ma trận toàn phần.

- **Hình 5 — DP8 tuyên hai vế «options tự khai THAM CHIẾU» và «khuôn không liệt lại danh sách nấc» nhưng không mutant nào chạm**
  file: `tests/plugins/design-pass-nac.test.mjs:200`
  severity: medium
  AC: AC-14
  source: measurement
  checkNoteKeys có 5 nhánh lỗi: thiếu mốc neo (191), thiếu từng khoá trong 3 khoá (194-195), (200) dòng `options:` không tự khai «THAM CHIẾU», (202-203) khuôn liệt lại ≥3 id nấc. Ma trận DP8 (378-387) chỉ có 3 mutant xoá lần lượt 3 khoá. Vế (200) và vế (202) chưa bao giờ chạy đỏ, dù evals.yaml E8 nêu đích danh assert «dòng `options:` tự khai là tham chiếu chứ không phải bằng chứng» như một khẳng định của ca. Riêng (200) còn có guard `line &&`, nên khi dòng options: vắng thì vế này im lặng bỏ qua — càng khó lộ nếu sau này nhánh khoá-thiếu bị nới.

- **Hình 5 — DP1 tuyên «mỗi nấc có tên tiếng người + điều kiện dùng» nhưng vế đó không có mutant**
  file: `tests/plugins/design-pass-nac.test.mjs:61`
  severity: medium
  AC: AC-14
  source: measurement
  Dòng 61 push 'nac thieu ten hoac dieu kien: <id>' — vế này được evals.yaml E1 khai rõ («mỗi id có tên tiếng người + điều kiện dùng»). Nhưng 5 mutant của DP1 (302-306) chỉ đổi tên id (4 mutant → vế 'thang thieu nac') và thêm danh sách thứ hai (1 mutant → vế 'danh sach nac xuat hien 2 cho'). Không mutant nào làm rỗng một ô Tên/Dùng-khi, nên vế (61) chưa chứng minh biết đỏ; thêm nữa `filter(Boolean)` ở dòng 60 nuốt ô rỗng làm hình dạng lỗi này càng khó tự lộ.

- **Hình 5 — DP4 tuyên «nguồn bày hướng trỏ section ## Đặc tả UX» nhưng vế đó không có mutant**
  file: `tests/plugins/design-pass-nac.test.mjs:132`
  severity: medium
  AC: AC-14
  source: measurement
  checkDivergenceOrder có 5 nhánh: (129) thiếu vế vật thật, (130) thiếu vế bày hướng, (131) sai thứ tự, (132) thiếu '## Đặc tả UX', (133) thiếu nhánh lùi. Hai mutant của DP4 (329-341) chỉ bắn (131) và (133). Vế (132) — nửa đầu của v2 mà evals.yaml E4 khai «nguồn bày hướng trỏ section `## Đặc tả UX` VÀ có nhánh lùi» — không có chiều đỏ; hai vế (129)/(130) cũng vậy (mutant m-hoan-vi cố ý không xoá chữ nào).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **CONTEXT.md glossary không được cập nhật cho từ vựng mới (reaction/divergence/options + ổ cắm ds_skill)**
  Người dùng thấy gì: Các khái niệm mới của tính năng này (nấc phản ứng, bước phân kỳ, bộ phương án) chưa được thêm vào bảng thuật ngữ chung của bộ công cụ. Người viết tài liệu ở các tính năng sau có thể tự đặt tên khác cho cùng một khái niệm, gây lẫn lộn về sau.
  file: `CONTEXT.md`
  severity: medium
  Đề xuất: known-limits

- **Đoạn S1-D của feature-loop: hai ngoặc đơn dính nhau làm chú giải `context:` treo vào mục `reaction:`**
  Người dùng thấy gì: Một đoạn hướng dẫn nội bộ mô tả cách kết thúc phiên thiết kế bị viết lồng câu khiến phần chú thích của một mục bị đọc nhầm sang mục khác, có thể khiến người đọc sau này hiểu sai quy tắc áp dụng cho mục nào.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **Khối răng của hai hồ sơ bị cài xen nhau trong _acceptance/config.yaml**
  Người dùng thấy gì: Trong một tệp cấu hình nội bộ, ghi chú và dữ liệu của hai tính năng khác nhau bị xen lẫn vào nhau. Khi dọn dẹp phần của tính năng đã xong sau này, có nguy cơ xoá nhầm hoặc để sót phần thuộc tính năng khác.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **gate-card.js chép lần thứ hai danh sách id nấc vào chuỗi thông điệp, không phép đo nào ghim**
  Người dùng thấy gì: Thông báo hiển thị khi gặp một giá trị nấc không hợp lệ có liệt kê sẵn bằng tay bốn nấc đang tồn tại. Nếu sau này bộ công cụ thêm một nấc mới, thông báo này có thể tiếp tục nói sai là chỉ có bốn nấc, khiến người đọc hiểu nhầm phạm vi hợp lệ.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **`divergence:` được ghi vào khuôn nhưng không có bộ đọc nào — luật «không có đường bỏ im lặng» tự khai, không có lưới**
  Người dùng thấy gì: Tài liệu hướng dẫn nói rằng việc bỏ qua bước cân nhắc phương án luôn phải để lại một dòng ghi chú, nhưng thẻ hiển thị cho người duyệt hiện không kiểm tra hay cảnh báo khi dòng ghi chú đó bị thiếu. Một phiên có thể âm thầm bỏ qua bước này mà thẻ duyệt không cho thấy dấu hiệu gì.
  file: `skills/design-pass/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Mutant-matrix contract says "E10=4 nhánh" but DP10 implements 3**
  Người dùng thấy gì: Tài liệu mô tả bộ kiểm cho một trong các tiêu chí ghi sai số lượng nhánh cần kiểm (ghi bốn trong khi thực tế chỉ triển khai ba). Người xem lại bộ kiểm sau này có thể hiểu nhầm về mức độ đầy đủ của việc kiểm tra.
  file: `_acceptance/design-pass-nac-khong-dong-bo/evals.yaml`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 4/14 lỗi rơi vào file không bộ đo nào phủ (CONTEXT.md, _acceptance/config.yaml, _acceptance/design-pass-nac-khong-dong-bo/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
