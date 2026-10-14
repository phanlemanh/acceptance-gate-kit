---
schema_version: 1
feature: Thẻ Cổng Bằng chứng in các mục ngoài hợp đồng thành một bảng có cột «Căn cứ» — mỗi mục một hàng (Mục · Người dùng gặp gì · Máy đề xuất · Căn cứ), mục cần người quyết lên đầu; căn cứ do tác tử phân loại viết và đi trọn đường tới thẻ, kể cả mục mang sang lượt sau
slug: bang-ngoai-n-co-can-cu
owner: phanlemanh@gmail.com
risk_tier: T3               # lib/out-of-contract.cjs (t3_paths lib/**) + scripts/gate-card.js + feature-loop/workflows/acceptance-verify.js + feature-loop/scripts/carry-plan.mjs + test + tài liệu — không chạm hooks/**, scripts/pre-merge-check.sh, scripts/recheck-evidence.cjs
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-14-bang-ngoai-n-co-can-cu-design.md
status: signed-off
approved_by: manh
approved_at: 2026-10-14
---

# Acceptance Contract: bang-ngoai-n-co-can-cu

## Context

Gốc: crm/_acceptance/kanban-viec — ở Cổng Bằng chứng 14/10, phiên crm tự soạn tay cho chủ kho một bảng Mục · Người
dùng gặp gì · Đề xuất · Căn cứ cho 10 mục Ngoài-n; phần căn cứ không có trong hồ sơ vì khuôn mục ngoài hợp đồng không
có trường lý do. Chủ kho đánh giá đó là cách hiển thị tốt cho Cổng 2 và gọi tên vòng 14/10 trên hạt giống
`docs/plans/2026-10-14-hat-giong-bang-ngoai-n-co-can-cu.md`. Đường đi của một mục và thiết kế bảng: design §2–§3.
Bản base để đo chiều đỏ: `6ed3e410` (origin/main lúc mở vòng).

## Criteria

- AC-1: Given khuôn `OOC-ITEM-TEMPLATE` rút từ `feature-loop/workflows/acceptance-verify.js` của cây đang kiểm, điền bằng một mẫu do mã sinh có đủ sáu trường (tiêu đề, người dùng thấy gì, căn cứ, tệp, mức, đề xuất), When bộ đọc `lib/out-of-contract.cjs` của cây đang kiểm đọc tài liệu ấy, Then mục đọc ra có `can_cu` bằng đúng chữ mẫu và năm trường còn lại bằng mẫu; và bộ đọc của base `6ed3e410` đọc CÙNG tài liệu ra năm trường cũ và kết quả `mucChuaDinhTuyen` bằng đúng kết quả của chính nó trên bản đã gỡ dòng «Căn cứ» (kho chưa chép lại lớp CI vendored không đọc lệch); chiều đỏ trên CÙNG mẫu: bản sao bộ đọc bỏ khoá «Căn cứ» → ca ghim «bộ đọc bỏ Căn cứ»; bản sao khuôn bỏ dòng «Căn cứ» → ca ghim «khuôn thiếu Căn cứ».
- AC-2: Given workflow chấm chạy thật qua harness với một finding mà tác tử phân loại trả `inContract=false`, một đề xuất và một câu `can_cu` do ca sinh, When lượt 1 xong rồi `carry-plan.mjs` đọc run-log của lượt ấy và lượt 2 chạy với mục mang sang mà tác tử tổng hợp không in lại, Then (i) lược đồ tác tử phân loại nhận đòi `can_cu`; (ii) dòng `kind: finding` của lượt 1 mang đúng câu ấy; (iii) mục mang sang của `carry-plan.mjs` mang đúng câu ấy; (iv) bản findings của lượt 2, đọc bằng bộ đọc thật, có mục mang sang với `can_cu` bằng câu ấy; (v) lời gọi tác tử tổng hợp của lượt 1 nhận dữ liệu mục mang đúng câu ấy cạnh mục của nó và khuôn có dòng «Căn cứ: {can_cu}»; (vi) dòng finding không có căn cứ đi qua chèn mục mang sang rồi bộ đọc thật ra `can_cu` rỗng và năm trường còn lại nguyên vẹn; chiều đỏ trên CÙNG kịch bản: bản sao workflow bỏ `can_cu` khỏi dòng finding → ghim «sổ finding mất căn cứ»; bản sao workflow bỏ `can_cu` khỏi mục đưa tác tử tổng hợp → ghim «tổng hợp không thấy căn cứ»; bản sao `carry-plan.mjs` bỏ `can_cu` → ghim «mang sang mất căn cứ».
- AC-3: Given kho thử do mã sinh có hồ sơ `verified` (PASS) với `review-findings.md` ba mục viết theo khuôn writer — một `new-contract`, một `known-limits`, một `wont-fix`, mỗi mục một căn cứ, When dựng thẻ Cổng 2 bằng `scripts/gate-card.js` của cây đang kiểm, Then khối «Ngoài hợp đồng — bạn quyết» chứa đúng một bảng có bốn tiêu đề cột theo thứ tự Mục · Người dùng gặp gì · Máy đề xuất · Căn cứ, mỗi mục đúng một hàng mà ô thứ i bằng trường của cột thứ i (nhãn `Ngoài-<vị trí trong tệp>` · câu người dùng thấy gì · câu đề xuất hôm nay của thẻ · căn cứ) và nhãn cột của ô (dùng ở màn hẹp) bằng chữ tiêu đề cột thứ i; ba nhãn lựa chọn (rút từ `commands/acceptance-card.md`) có mặt đúng một lần trong khối; thẻ không lộ tiêu đề kỹ thuật hay đường dẫn tệp của mục; chiều đỏ: `gate-card.js` của base `6ed3e410` trên CÙNG hồ sơ → khối không có bảng (ghim «base không bảng»); bản sao `gate-card.js` tráo hai ô cuối → ghim «ô lệch cột».
- AC-4: Given ma trận viết trước hai hồ sơ — hồ sơ A (kho tắt định tuyến máy) có năm mục xếp xen {known-limits, new-contract, wont-fix, đề xuất rỗng, đề xuất lạ} và hồ sơ B (kho bật `feature_loop.ngoai_n_tu_dinh_tuyen`, sổ do `scripts/dinh-tuyen-may.cjs --write` của cây ghi) có ba mục {known-limits, new-contract, wont-fix}, cộng hồ sơ C chỉ có mục `known-limits`, When dựng thẻ Cổng 2, Then thứ tự nhãn hàng của mỗi hồ sơ bằng thứ tự viết sẵn trong ca (nhóm «cần anh quyết» — new-contract, rỗng, lạ — theo vị trí tệp; rồi nhóm «máy khuyên»; rồi nhóm «máy đã định tuyến»), hàng tiêu đề nhóm chỉ có ở nhóm có hàng và không có ở hồ sơ C; số ô so = số phần tử ma trận (khác → ĐỎ «ma trận hụt»); câu gộp ký của mỗi hồ sơ (dòng lệnh `signoff` thẻ in) bằng từng byte câu gộp của base `6ed3e410` trên cùng hồ sơ; chiều đỏ: bản sao `gate-card.js` bỏ bước xếp nhóm → ghim «thứ tự tệp».
- AC-5: Given ba bản `review-findings.md` của cùng ba mục — bản khuôn base (rút khuôn từ `acceptance-verify.js` của base `6ed3e410`, không có dòng «Căn cứ»), bản thiếu căn cứ ở đúng một mục, bản đủ — và một run-log đời cũ có dòng `kind: finding` không mang khoá `can_cu`, When dựng thẻ Cổng 2 và chạy `carry-plan.mjs`, Then bản base: mọi ô căn cứ là «chưa có căn cứ» và thẻ có đúng một cờ vàng «3/3 mục chưa có căn cứ…»; bản thiếu một: cờ «1/3 mục chưa có căn cứ…»; bản đủ: không có cờ ấy; tập cờ còn lại của mỗi thẻ bằng tập cờ thẻ base trên cùng bản; `carry-plan.mjs` thoát 0 với `can_cu` rỗng cho dòng đời cũ.
- AC-6: Given thẻ Cổng 2 do `gate-card.js` của cây dựng cho hồ sơ thử mười mục có căn cứ dài, When mở bằng trình duyệt không đầu ở bề rộng 320 px và 1280 px, Then ở 320 px trang không cuộn ngang (độ rộng cuộn ≤ độ rộng khung) và bốn ô của một hàng xếp chồng theo chiều dọc; ở 1280 px bốn ô của mỗi hàng nằm trên cùng một dòng; chiều đỏ: bản sao `gate-card.js` bỏ luật màn hẹp → ở 320 px bốn ô bị ép thành bốn cột (0/10 hàng xếp chồng), ghim «không xếp chồng ở 320»; thiếu trình duyệt không đầu → thoát 2 «không đọc được ở đây: playwright».
- AC-7 (judgment): Given khối chỉ dẫn căn cứ (marker `CAN-CU-CHI-DAN`) trong `feature-loop/workflows/acceptance-verify.js`, When tác tử phân loại viết `can_cu` theo đúng khối ấy, Then câu nó viết cho người ký biết vì sao đề xuất ấy — hậu quả nặng hay nhẹ, mất hay lộ dữ liệu không, người dùng tự gỡ được không, sửa sau rẻ hay đắt — trong một câu tiếng sản phẩm không tên hàm, đường dẫn, mã thoát; và khối không bảo tác tử đọc mã hay đề xuất cách sửa.
- AC-8 (judgment): Given `CHANGELOG.md` mục «Chưa phát hành» và `commands/acceptance-card.md` đoạn khối «Ngoài hợp đồng», When người dùng kit ở một kho tiêu thụ đọc chúng, Then họ biết: thẻ Cổng 2 nay in mục ngoài hợp đồng thành bảng bốn cột; căn cứ do bước phân loại viết và đi theo cả mục mang sang; mục cần quyết đứng đầu; hồ sơ chấm trước bản này hiện «chưa có căn cứ» kèm một cờ vàng, không phải sửa; câu gộp ký và ba lựa chọn không đổi; kho không phải làm gì ngoài nhận mốc.

## Coverage

Quét bằng `morphological-scan` (preset test-matrix; đối tượng = một trường mới đi trọn đường của mục ngoài hợp đồng
và mặt bảng của thẻ). Chân sản phẩm: đường đi `[SUY-TỪ-REPO: feature-loop/workflows/acceptance-verify.js — TRIAGE_SCHEMA,
findingLine, dungMucCarry, OOC-ITEM-TEMPLATE]` · `[SUY-TỪ-REPO: feature-loop/scripts/carry-plan.mjs]` ·
`[SUY-TỪ-REPO: lib/out-of-contract.cjs]` · `[SUY-TỪ-REPO: scripts/gate-card.js]` · ca thật
`[SUY-TỪ-REPO: ~/dev/crm-onehub/.claude/worktrees/sad-kalam-741092/_acceptance/kanban-viec/review-findings.md]`. Chân
ngành: `[NGÀNH: GitHub code scanning — lý do bỏ qua cảnh báo (False positive · Won't fix · Used in tests) đi kèm
quyết định]` · `[NGÀNH: WCAG 2.1 SC 1.4.10 Reflow — đọc được ở 320 CSS px không cuộn ngang]`.

- Trục A — chặng của trường: khuôn | tác tử phân loại | sổ finding | tác tử tổng hợp | mang sang | chèn mục mang sang | bộ đọc (mới và base) | thẻ  [thước CE: sơ đồ đường đi design §2, đọc từ mã] → AC-1, AC-2, AC-3
- Trục B — trạng thái mục: đề xuất new-contract | known-limits | wont-fix | rỗng | lạ; × máy định tuyến / không; × có căn cứ / thiếu (đọc-cũ)  [thước CE: ba token `OOC-PROPOSALS` + nhánh `proposal_raw` + khối DINH-TUYEN-MAY] → AC-3, AC-4, AC-5
- Trục C — mặt: bảng màn rộng | màn hẹp | câu gộp ký | cờ của thẻ  [thước CE: WCAG Reflow; dòng «Trả lời mẫu» của thẻ] → AC-4, AC-5, AC-6
- Trục D — hướng: đúng | im (câu gộp, cờ khác không đổi) | đỏ (base · bản sao bị tiêm)  [thước CE: luật hai chiều của kho] → mọi AC máy
- Cross-cutting: không lộ tiêu đề kỹ thuật/đường dẫn trên thẻ (AC-3) · chữ câu căn cứ (AC-7) · tài liệu cho kho tiêu thụ (AC-8).
- Later: cột «Loại» (Hỏi-1) · bảng cho khối «Việc chỉ mình bạn quyết được», Treo, Mù · đo chất lượng câu căn cứ bằng model thật.
- Never: đánh số lại Ngoài-n theo thứ tự hiển thị (làm lệch câu gộp ký và sổ định tuyến) · sửa hồ sơ đã ký để thêm căn cứ.

## Out of scope

- Cột «Loại» (lỗi người dùng thấy · thiếu bài kiểm · nợ mã) — Hỏi-1 ở Cổng Phạm vi, máy khuyên bỏ (design §5).
- Đổi câu gộp ký, ba lựa chọn, `mucChuaDinhTuyen`, luật định tuyến máy, mặc định đề xuất.
- Đổi bố cục các khối khác của thẻ Cổng 2 (Việc chỉ mình bạn quyết được, Treo, Mù) và thẻ Cổng 1.
- Thêm căn cứ vào `review-findings.md` của hồ sơ đã ký, ở kit hay kho tiêu thụ.
- `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ca đo: `tests/scripts/bang-ngoai-n.test.mjs` (mã BN-…), răng màn hẹp `_acceptance/bang-ngoai-n-co-can-cu/rang/man-hep.py`
  (cần Python Playwright, ngoài `feature_loop.suite_keys`). Khoá executor thêm ở S3. Ca P52/P53/P53b/P55/P201 và các
  ca đang ghim chữ khối giữ xanh; tệp mẫu P53 trong hồ sơ `s4-scope-triage` sinh lại bằng chính script sinh.
- Known limits — chọn ở Cổng Bằng chứng 2026-10-14:
  - Ngoài-1: Thẻ Cổng 2 mẫu của hồ sơ đã ký `khoi-viec-cua-anh` nay có bố cục bảng khác bản người ký đã đọc, nhưng sổ của hồ sơ đó không ghi vì sao.
  - Ngoài-2: Dòng báo xanh của ca LC6 vẫn nói «bằng nhau từng byte» trong khi phép so bỏ qua các dòng giao diện của bảng đã khai.
  - Ngoài-3: Chữ «căn cứ» dùng cho hai thứ khác nhau trong kit — căn cứ của lựa chọn ở bước thiết kế và câu căn cứ của mục ngoài hợp đồng.
  - Ngoài-4: Ca phá thử BN-1-do khi chạy riêng không có đối chứng xanh ngay trong ca, nên có thể đỏ vì lý do khác lý do nó định bắt.
  - Ngoài-5: Bằng chứng lượt chấm chỉ giữ vài dòng cuối của bộ ca BN, nên người đọc không thấy từng dòng PASS chi tiết.
  - Ngoài-6: Khi bước phân loại quên viết căn cứ, cờ vàng vẫn nói hồ sơ do bản kit cũ chấm.
  - Ngoài-7: Trên màn hẹp, nhãn nhóm và ô Mục bị ép còn khoảng 100 px nên chữ bị bẻ nhiều dòng; thẻ vẫn không cuộn ngang.
  - Ngoài-9: Vế «thẻ REJECT không thêm cờ căn cứ» của BN-3 không đỏ được, nên nếu sau này thẻ REJECT in sai cờ thì có thể không ai biết.
  - Ngoài-10: Ca phá thử BN-1-do không cho bản lành xanh trên cùng mẫu trước khi tin chiều đỏ.
  - Trong hợp đồng (AC-4, lượt chấm 2): ca BN-4 chỉ so tổng số hàng của ba hồ sơ thử, nên một hồ sơ in thừa hàng cùng lúc hồ sơ khác in thiếu hàng có thể bù trừ và lọt; phép so thứ tự từng hàng vẫn còn.
