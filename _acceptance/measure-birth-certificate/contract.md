---
schema_version: 2
feature: "Khuôn khai sinh phép đo — mọi phép đo mới phải tự chứng minh biết báo đỏ (đối chứng dương xanh + phá-vật-thật đổi kết luận + thông điệp ghim) ngay lúc viết, trước khi được tính là xong"
slug: measure-birth-certificate
risk_tier: T2
surfaces: [cli]
status: verified
approved_by: Manh Phan
approved_at: 2026-08-07T09:45:00Z
owner: phanlemanh@gmail.com
source: docs/superpowers/specs/2026-08-07-measure-birth-certificate-design.md
---

# Acceptance contract — measure-birth-certificate

Bối cảnh: quá nửa sổ known-limits (~55–60/108) là nợ-của-thước; 4/6 lỗi
trong-hợp-đồng của workspace-reader-unification (07/08) là lỗi thước MỚI VIẾT
dù mọi lớp đã có tên trong sổ bài học — "biết không đủ để tránh". Luật hiện
đặt ở khâu duyệt (gap-probe soi kế hoạch đo) và khâu soi-sau (measurement
lens); chỗ thủng là khâu VIẾT. Khuôn này là thủ tục lúc viết: mệnh đề có mốc
trong SKILL (mẫu STOP-PATCHING-CLAUSE đã chứng minh đo được hành vi) + khuôn
mẫu trong references — KHÔNG phải chốt máy tự cưỡng chế (hai chốt meta kiểu
đó đã gỡ ở measure-teeth-cleanup: mỗi chốt cưỡng chế lại cần chốt cho chính nó).

## Khuôn mệnh đề — một chỗ, có mốc

Mệnh đề sống giữa cặp mốc `MEASURE-BIRTH-CLAUSE` trong CẢ HAI bản chỉ dẫn
(feature-loop S3 + twin Codex). Nội dung cốt: một phép đo MỚI (case suite,
eval, rule script) chỉ được tính XONG khi đi kèm cặp case hai-chiều trên cùng
fixture — vật lành → thước xanh, phá vật thật → thước đỏ với thông điệp ghim;
thiếu cặp = task chưa xong. S1#4 (viết evals.yaml) mang MỘT câu con trỏ về
cùng khối — khuôn một chỗ, hai điểm-viết cùng đọc. Mọi phép đo của chính
feature này tham chiếu ĐÚNG khối giữa hai mốc, không quét toàn tệp.

## Criteria

- AC-1: Given SKILL feature-loop (Claude), When đọc giữa cặp mốc `MEASURE-BIRTH-CLAUSE`, Then có mệnh đề đủ 3 thành phần (cặp hai-chiều cùng fixture · thông điệp ghim · "thiếu cặp = task chưa xong") áp cho cả ba loại vật (case suite, eval, rule script); mutation xoá khối hoặc tách mệnh đề khỏi cặp mốc → phép đo đỏ với thông điệp ghim tên mốc; đối chứng dương bản nguyên vẹn xanh trước.
- AC-2: Given twin Codex, When so khối giữa mốc của hai bản chỉ dẫn bằng phép so chuẩn hoá, Then hai bản mang cùng mệnh đề; mutation làm lệch MỘT bên → đỏ nêu tên bên lệch; đối chứng dương xanh.
- AC-3: Given bước viết evals.yaml (S1#4) của cả hai bản chỉ dẫn, When đọc đoạn đó, Then có câu con trỏ nhắc khuôn MEASURE-BIRTH-CLAUSE cho kế hoạch đo (expected phải khai được chiều đỏ); mutation xoá con trỏ ở một bên → đỏ nêu bên thiếu; đối chứng dương xanh.
- AC-4: Given references measure-birth.md trong gói acceptance-gate, When resolve qua resolve-plugin.mjs với --require file đó, Then resolver trả gốc gói chứa file đủ 3 mục khuôn (đối-chứng-dương / phá-vật-thật / thông-điệp-ghim) + ≥2 mẫu sống trích từ suite thật của kit + bảng lớp lỗi từ ledger; mutation xoá một mục → đỏ ghim tên mục thiếu; đối chứng dương xanh.
- AC-5: Given 4 lượt agent context-sạch đóng vai thợ được giao viết một phép đo mới (2 lượt trên bản chỉ dẫn CÓ mệnh đề, 2 lượt trên bản ĐÃ GỠ khối), When chấm record hành vi, Then MỖI lượt (cả 4) có artifact bài-làm khác rỗng + dấu hoàn-thành do make-record.mjs ghi trong chính lần chạy — lượt chết/timeout không được tính là "không sinh cặp"; 2/2 lượt bản-có sinh kèm cặp hai-chiều + thông điệp ghim, 2/2 lượt bản-gỡ hoàn thành bài mà không sinh đủ; phép đo round-trip record↔nguồn (không fixture viết tay); mutation làm rỗng artifact một lượt trong bản sao → đỏ ghim tên lượt; đối chứng dương xanh.
- AC-6: Given ledger docs/research/known-limits-ledger.tsv, When đối chiếu với corpus known-limits thật trong _acceptance/*/review-findings.md, Then số dòng ledger ≥ số mục đếm được từ corpus (đếm từ nguồn trong chính lần chạy, không hardcode 108) VÀ chính BỘ ĐẾM có đối chứng dương (chạy trên 1 hồ sơ corpus đã biết phải trả > 0 — bộ đếm trả 0 trên vật có mục là bộ đếm hỏng, không phải corpus rỗng); mỗi dòng status ∈ {song, chet, trung}; mọi dòng chet có closed_by khác rỗng; mọi dòng trung có dup_of trỏ id tồn tại trong ledger; mutation phá từng bất biến hàng VÀ mutation xoá K dòng ledger xuống dưới số đếm trong bản sao → đỏ ghim tên bất biến/quan hệ ≥; đối chứng dương xanh.
- AC-7: Given contract này và ledger quyết định, When đọc ## Notes và decisions.jsonl, Then baseline "4/6 lỗi-trong-hợp-đồng của wru là lỗi thước mới viết (2026-08-07)" nằm trong Notes kèm entry revisit điều kiện dừng (đo lại ở 2 feature kế; không giảm → dừng đắp cơ chế); phép đo grep đúng chuỗi baseline + parse entry revisit; đối chứng dương xanh, xoá baseline → đỏ.
- AC-8: Given khối marker khai ĐÍCH DANH id các case suite mới của feature này, When kiểm quan hệ tập-hợp khai↔tìm-được (bằng nhau — không phải đếm > 0) rồi soi từng case trong tập, Then mỗi case có đủ hai chiều trên cùng fixture (nhánh vật-lành xanh + nhánh phá-vật đỏ ghim thông điệp) — khuôn tự áp lên phép đo của chính nó; mutation gỡ 1 id khỏi khối khai trong bản sao → đỏ ghim id (tập lệch là lỗi, không phải tập co lại); thiếu chiều ở case nào → đỏ nêu tên case.
- AC-9: Given khối MEASURE-BIRTH-CLAUSE tồn tại trong nguồn, When đọc version hai gói từ nguồn sống (feature-loop plugin.json cả Claude lẫn twin Codex + mirror plugins/, và acceptance-gate plugin.json khi references measure-birth.md có mặt), Then version ≥ mốc mới (feature-loop ≥ 1.27.0, acceptance-gate ≥ 1.39.0) — mệnh đề chỉ tới được agent thật khi gói được giao; mutation hạ version một gói trong bản sao → đỏ ghim tên gói; đối chứng dương xanh.

## Coverage

- Trục A điểm-viết: S1-eval | S3-case | S3-rule [CE: bảng lớp bản rà 2026-08-07]
- Trục B harness: Claude | Codex [CE: cấu trúc twin của kit]
- Trục C chiều kiểm: tồn-tại | hành-vi | mutation | round-trip | tự-áp [CE: công thức P168/P169 đã ship ở stop-patching-law]
- Vật phụ trợ (ô riêng): references-mold · ledger · baseline-notes · kênh-giao [CE: design đã duyệt + GOTCHA cache 2026-08-07]

| Ô Core | AC |
|---|---|
| tồn-tại × Claude / × Codex (phủ cả 3 loại vật ở A) | AC-1, AC-2 |
| con-trỏ S1-eval × 2 harness | AC-3 |
| references-mold | AC-4 |
| hành-vi (có/gỡ) + round-trip record | AC-5 |
| ledger-toàn-vẹn | AC-6 |
| baseline-notes | AC-7 |
| tự-áp | AC-8 |
| kênh-giao (version bump cả mirror) | AC-9 |

Later: đóng vai riêng cho điểm-viết S3-rule (1 kịch bản đại diện đợt này —
xem descope) · port consumer theo release sau. Never: chốt máy pre-merge
(quyết định measure-teeth-cleanup, đã cân ở hướng C của brainstorm).

## Out of scope

- KHÔNG chốt máy cưỡng chế trong pre-merge/hook — khuôn là thủ tục lúc viết;
  lý do sống ở decisions.jsonl (measure-teeth-cleanup: chốt-cần-chốt-cho-chốt).
- KHÔNG sửa 27 hồ sơ đã ký / không gạch-sửa review-findings.md gốc — vòng đời
  nợ ghi ở ledger MỚI, hồ sơ có chữ ký là bất biến.
- KHÔNG port khuôn sang repo tiêu thụ trong vòng này — consumer nhận engine
  mới theo release có chủ đích.
- KHÔNG re-triage nợ sống thành fix trong vòng này — dọn nợ là bước (b),
  chạy SAU khi khuôn này ký (thứ tự đã chốt trong handoff 2026-08-07).

## Notes

- Known limit (S4-r2, thu phạm vi — người chọn): P182 đo "đủ hai chiều" của
  từng case qua marker `DUONG-OK`/`MUTANT-OK` — proxy chuỗi: một case in
  marker quanh mutant no-op vẫn xanh P182. Phần khai↔tìm-được của P182 là
  quan hệ tập-hợp thật; riêng CHIỀU SÂU mutant sống nhờ nghi thức viết
  (MEASURE-BIRTH-CLAUSE) + vòng review, không nhờ P182.
- Known limit (ngoài hợp đồng, Cổng 2): biến `SRC` chết trong P182 — dọn
  dẹp nội bộ, ledger measure-birth-certificate#1.
- Baseline 2026-08-07: 4/6 lỗi-trong-hợp-đồng của workspace-reader-unification
  là lỗi thước mới viết (nguồn: handoff 2026-08-07 + review-findings của wru).
  Đo lại tỷ lệ lỗi-thước-mới-viết ở 2 feature kế tiếp sau khi khuôn ship;
  KHÔNG giảm so với baseline → kết luận cơ chế mệnh-đề-có-mốc không nhân rộng
  được cho khâu viết phép đo — DỪNG đắp thêm cơ chế cùng loại, xem lại hướng.
