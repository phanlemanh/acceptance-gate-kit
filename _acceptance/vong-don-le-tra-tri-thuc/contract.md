---
schema_version: 1
feature: Vòng mở từ một câu mô tả tra được trang tri thức liên quan và sổ quyết định của các hồ sơ trước, rồi ghi vào cùng dòng «đã tra tri thức»
slug: vong-don-le-tra-tri-thuc
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: signed-off
design_doc: docs/superpowers/specs/2026-10-25-vong-don-le-tra-tri-thuc-design.md
approved_by: Manh Phan
approved_at: 2026-10-25T01:36:47Z
---

## Context

Hàng TT5 của `docs/plans/lo-trinh-kit.json` (đợt `tri-thuc-2410`, phủ C2 · E1 của
`docs/plans/pham-vi-tri-thuc-2410.md`). Ô đã qua Cổng Đáng (Manh Phan, 24/10). TT4 dựng dòng «đã tra tri thức» và thẻ
chặn khi thiếu; vòng này cho vòng đơn lẻ một lệnh tra theo câu mô tả, cho mọi vòng phần tra sổ quyết định của hồ sơ
trước, ghi cả hai vào cùng dòng tra, và đưa ngưỡng của ô vào lệnh đếm. Gộp hạt giống
`docs/plans/2026-10-25-hat-giong-tro-kho-rieng-khong-tien-to.md` (Ngoài-3 của TT4).

Thuật ngữ:
- **lệnh tra** = `node scripts/tri-thuc.mjs --root <kho> --tra [--slug <hồ sơ>] [--json]`, câu mô tả qua stdin.
- **dòng tra** = dòng sổ `stage: "S1"` mang khoá `tri_thuc_tra` theo khối `DEC-TRI-THUC-TRA` của SKILL feature-loop;
  vòng này thêm khoá `so` (mảng đường trỏ sổ `<hồ sơ>#<mã dòng>`).
- **thẻ** = `node scripts/gate-card.js --root <kho> --slug <hồ sơ> --gate 1` (HTML) và cùng lệnh kèm `--extract`.
- **bộ xếp** = `scripts/can-cu-s1.cjs`; **lệnh đếm** = `can-cu-s1.cjs --root <kho> --dem [--json]`.
- **kho thử** = kho git dựng trong thư mục tạm của lượt; trang SINH từ khối `TRI-THUC-TRANG` của khuôn thật; dòng sổ
  của hồ sơ khác ghi bằng khối lệnh `DEC-ID-RECIPE` thật.
- **bộ máy trước vòng** = `git archive 396c08f8 scripts lib skills feature-loop` giải vào thư mục tạm.

## Criteria

- AC-1: Given kho thử khai `tri_thuc.noi` với một trang nền và bốn trang — câu mô tả khớp ở tiêu đề · chỉ ở tiêu đề mục ·
  chỉ ở giá trị frontmatter · không chỗ nào —, When chạy lệnh tra `--json` với câu mô tả ấy, Then `trang` gồm đúng trang
  nền và ba trang khớp (thứ tự tất định qua hai lần chạy), mỗi đường trỏ cho `tri-thuc.mjs --con-tro` thoát 0, và trang
  không khớp vắng; câu không khớp trang nào cho `trang` chỉ có trang nền; kho không có trang nền và câu không khớp cho
  `trang: []`, thoát 0, văn bản in «đã tra, không có trang liên quan». Bản tiêm bỏ quét tiêu đề mục thì trang thứ hai
  vắng và ca đỏ.
- AC-2: Given kho thử có bốn hồ sơ — hồ sơ đang chạy và ba hồ sơ khác mà sổ chứa: một dòng `gate1` có `decided_by` khớp
  câu · một dòng S1 khớp cùng điểm · một dòng khớp đã bị dòng sau `supersedes` (dòng thay cũng khớp) · một dòng không
  khớp · một dòng JSON hỏng · một dòng khớp mà `decision` chứa nháy kép và gạch chéo ngược · một dòng khớp mà `decision`
  không có đoạn sạch nào từ 20 ký tự; hồ sơ đang chạy cũng có dòng khớp; mọi dòng sổ ghi bằng khối lệnh `DEC-ID-RECIPE`
  thật —, When chạy lệnh tra `--slug <hồ sơ đang chạy> --json`, Then `so` gồm đúng năm dòng khớp còn hiệu lực của ba hồ
  sơ khác (không dòng bị thay, không dòng không khớp, không dòng nào của hồ sơ đang chạy), dòng `gate1` đứng trước dòng S1
  cùng điểm, mỗi phần tử có dạng `<hồ sơ>#<mã dòng>` trỏ đúng dòng; stderr có đúng một dòng cảnh báo nêu số dòng hỏng; lệnh
  in ít nhất hai khối `can_cu`, mỗi `trich` nằm nguyên văn trong chữ thô của tệp sổ và không chứa nháy kép hay gạch chéo
  ngược; dòng không có đoạn sạch không kèm khối. Bản tiêm bỏ loại hồ sơ đang chạy thì ca đỏ.
- AC-3: Given kho thử khai kho riêng (`tri_thuc.kho`) mà đường kho riêng không có ở máy, và hồ sơ khác có dòng sổ khớp,
  When chạy lệnh tra, Then thoát 0, đối tượng dòng tra mang `trang: []`, `khong_doc` mở bằng «không đọc được ở đây:» nêu
  tên kho, và `so` vẫn đủ dòng khớp; kho không khai `tri_thuc` thì thoát 2 với dòng nêu «chưa khai tri_thuc»; stdin rỗng
  thì thoát 2.
- AC-4: Given câu mô tả chứa backtick, `$(touch <tệp canh>)`, nháy đơn, nháy kép và xuống dòng, When chạy khối lệnh
  `TRI-THUC-TRA-MO-TA` rút từ SKILL bằng bash với câu ấy thế vào ô, Then tệp canh không được tạo, và `tra` của đối tượng
  dòng tra bằng nguyên văn câu (so từng ký tự sau khi bỏ một dòng mới cuối).
- AC-5: Given kho thử khai `tri_thuc` và hồ sơ `draft`, When dựng thẻ qua ma trận viết sẵn năm hàng — dòng tra thiếu khoá
  `so` · `so` không phải mảng · `so: []` · `so` có hai đường trỏ đều có dòng · `so` có một đường trỏ không có dòng —,
  Then `--extract` mang `tri_thuc.chan` lần lượt `true` · `true` · `false` · `false` · `false`; hai hàng chặn để ô quyết
  `___` và HTML có dòng đỏ mở bằng «CHƯA vào được Cổng Phạm vi: chưa tra sổ quyết định của hồ sơ trước»; hàng năm có đúng
  một cờ vàng «dòng sổ hồ sơ trước không có: <đường trỏ>»; hàng ba, bốn không cờ tri thức; và hồ sơ `approved` có dòng tra
  thiếu `so` thì `chan = false`, không cờ mới. Bản tiêm bỏ chặn khi thiếu `so` thì hàng một đỏ.
- AC-6: Given SKILL feature-loop, When rút khối `TRI-THUC-TRA-MO-TA`, chạy nó trên kho thử có trang và sổ khớp, chép đối
  tượng lệnh in vào khối `DEC-TRI-THUC-TRA` rồi ghép vào khối lệnh `DEC-ID-RECIPE` và chạy bằng bash, và ghi thêm một dòng
  căn cứ bằng khối `can_cu` lệnh in cho một dòng sổ, Then thẻ nhận dòng tra (`tri_thuc.chan = false`, không cờ tri thức),
  và bộ xếp với `--base` là commit của kho thử xếp dòng căn cứ `da-quyet`. Cùng đường ấy trên hồ sơ mở từ hàng — ô do lệnh
  mở ô sinh, dòng «Nguồn:» trỏ một trang mà câu giao không khớp chữ — chạy khối kèm `--slug` cho `trang` chứa mọi đường trỏ
  của dòng «Nguồn:» và thẻ `chan = false`. Bản tiêm đổi tên khoá `so` trong khối `DEC-TRI-THUC-TRA` thì thẻ ra
  `chan = true`; bản tiêm bỏ đọc dòng «Nguồn:» ở lệnh tra thì hồ sơ mở từ hàng ra `chan = true`.
- AC-7: Given kho thử khai `tri_thuc` với ma trận viết sẵn bốn hồ sơ — không dòng tra · dòng tra mà không căn cứ trỏ · dòng
  tra và căn cứ trỏ trang tri thức · dòng tra và căn cứ trỏ sổ của hồ sơ khác — cộng một hồ sơ có dòng tra mà căn cứ trỏ sổ
  của CHÍNH nó; dòng tra và hai dòng căn cứ trỏ ghi bằng đối tượng và khối `can_cu` do lệnh tra `--json` in trên chính kho
  thử, qua khối lệnh `DEC-ID-RECIPE` thật, When chạy lệnh đếm văn bản và `--json`, Then mỗi hàng mang `dong_tra` và
  `can_cu_tri_thuc` đúng ma trận (căn cứ trỏ sổ chính mình đếm 0), văn bản và JSON cùng số, và dòng cuối của văn bản là
  «đường đo tri thức: 2/4 hồ sơ có dòng tra có căn cứ trỏ trang hay sổ trước». Bản tiêm đếm cả sổ của chính hồ sơ thì ca
  đỏ.
- AC-8: Given kho thử khai kho riêng có ở máy và kho thử chỉ khai `noi`, When bộ xếp đọc dòng S1 nguồn mục tiêu mang
  `tri_thuc` là đường trỏ KHÔNG tiền tố kèm `trich` tới một trang băm khớp, Then ở kho khai kho riêng lớp `do` mã
  `tri-thuc-kem-trich`, ở kho chỉ khai `noi` lớp `da-quyet`; cùng đường trỏ có tiền tố ở kho khai kho riêng vẫn
  `tri-thuc-kem-trich`. Bản tiêm trả luật về «chỉ khi có tiền tố» thì hàng một đỏ.
- AC-9: Given ma trận viết sẵn năm hồ sơ trên kho thử KHÔNG khai `tri_thuc` (draft sạch · draft có câu chỉ-người · draft
  cỡ 11 · approved · draft có dòng căn cứ tệp + câu trích), When dựng thẻ HTML, `--extract`, `can-cu-s1.cjs --json`,
  lệnh đếm văn bản và lệnh đếm `--json` bằng cây và bằng bộ máy trước vòng, Then năm đầu ra giống từng byte ở cả năm hồ sơ
  (in số byte hai bên);
  và các tệp ca của tầng tri thức (`tests/scripts/kho-tri-thuc-va-lint.test.mjs`,
  `tests/scripts/o-mo-viec-mang-nguon.test.mjs`, `tests/scripts/thiet-ke-nap-tri-thuc.test.mjs`), bộ xếp
  (`tests/scripts/can-cu-s1.ca.mjs`) và ghi tri thức (`tests/scripts/ghi-tri-thuc.test.mjs`) đều xanh. Bản tiêm luôn
  thêm khoá mới vào hàng của lệnh đếm thì lệnh đếm `--json` lệch byte và ca đỏ.

## Coverage

Bỏ quét hình thái — entry `descope` «bỏ coverage-scan» trong `decisions.jsonl`: không gian do câu giao của hàng, hai mã
C2 · E1, hạt giống gộp vào và bảng ca §4 của design doc định sẵn (tra trang · tra sổ · không đọc được · câu độc · thẻ ·
khuôn · đếm · hạt giống · chiều im), mỗi ca có chiều đỏ.

- Tra theo mô tả (C2): AC-1, AC-3, AC-4. Tra sổ hồ sơ trước (E1): AC-2.
- Ghi vào cùng dòng tra và thẻ kiểm: AC-5, AC-6. Đường đo của ô: AC-7.
- Hạt giống Ngoài-3 của TT4: AC-8. Chiều im và hồi quy: AC-9.

## Đường đo

- Thước: «≥ 30 % hồ sơ có dòng tra có ít nhất một căn cứ bước thiết kế trỏ trang tri thức hay sổ hồ sơ trước, sau 10 hồ
  sơ» · số từ: dòng `đường đo tri thức: <k>/<N> …` của `can-cu-s1.cjs --dem` chạy trên kho đã khai · bảo đảm bởi: AC-7.

## Out of scope

- Tra theo nghĩa thay cho tìm chữ (F3).
- Tra sổ ở kho không khai `tri_thuc`.
- Đọc thân trang khi khớp — chỉ tiêu đề, frontmatter, tiêu đề mục.
- Kiểm dòng tra ở pre-merge, recheck hay làn ghim lại.
- Chứng bước thiết kế đã hiểu hay đã chọn đúng trang, đúng dòng sổ.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- AC-5 viết theo khuyến nghị của Hỏi-1 (CỘNG: chặn khi dòng tra thiếu `so`). Chủ kho chọn cờ vàng thì hàng một, hai của
  AC-5 thành «`chan = false`, đúng một cờ vàng «chưa tra sổ quyết định của hồ sơ trước»» và bản tiêm của AC-5 đổi theo.
  Hai chỗ dựng dòng tra trong ca TT4 thêm `so` ở cả hai lối.
- Known limits:
  - Tìm chữ theo cặp âm tiết: câu mô tả dùng từ khác trang thì trang không hiện — đúng điều ngưỡng của ô đo (dưới 30 %
    sau 10 hồ sơ thì mở tra theo nghĩa).
  - Dòng tra chứng máy đã chạy lệnh tra và đã chạm trang, dòng sổ; không chứng đã đọc kỹ hay đã dùng.
- Known limits — chọn ở Cổng Bằng chứng 2026-10-25:
  - Ngoài-2: Nếu sau này danh sách tệp chép cho kho tiêu thụ thiếu một tệp mà lệnh tra cần, lệnh tra âm thầm làm việc kém đi mà không bài kiểm nào báo đỏ — phép đo hiện chỉ đếm dòng trong danh sách.
  - Ngoài-4: Căn cứ ghi tay đường tới sổ hồ sơ trước theo kiểu lạ (có «./» ở đầu) vẫn được nhận nhưng không được tính vào con số đo tri thức, nên con số có thể thấp hơn thực tế.
  - Ngoài-6: Bài kiểm chưa chứng riêng luật «căn cứ trỏ sổ của chính hồ sơ thì đếm 0»; hành vi hôm nay đúng nhờ một chốt khác, luật ấy bị phá sau này thì bài kiểm có thể vẫn xanh.
  - Ngoài-7: Bài kiểm «lời người ở cổng xếp trước» đúng sẵn nhờ thứ tự tên hồ sơ, chưa chứng riêng luật xếp lời người trước.
- Mở hợp đồng mới (Ngoài-1): hạt giống `docs/plans/2026-10-25-hat-giong-nhan-luat-san-pham-danh-sach-chep.md`.
- Mở hợp đồng mới (Ngoài-3, Ngoài-5): hạt giống `docs/plans/2026-10-25-hat-giong-tri-thuc-khai-sai-lam-sap-the.md`.
