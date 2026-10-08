---
schema_version: 1
feature: Bên viết và bên đọc không trôi nhau ở hai chỗ crm đo đêm 07–08/10 — mục ngoài hợp đồng mang sang với nhãn (rN) ngoài dấu sao vẫn hiện trên thẻ Cổng 2 (và không bị in hai lần), run_id rỗng không còn được ghi và được gọi tên khi đọc lại
slug: doc-ghi-troi-mang-sang-run-id
owner: manh.phan@onemount.com
risk_tier: T3               # chạm lib/** và scripts/recheck-evidence.cjs — đều trong risk_tiers.t3_paths
surfaces: [cli]
status: signed-off
approved_by: Phan Le Manh
approved_at: 2026-10-08
---

# Acceptance Contract: doc-ghi-troi-mang-sang-run-id

Gốc: crm/_acceptance/ca-chap-chon-cach-ly

## Context

Đợt điều phối crm sau-14-10, đêm 07–08/10, kit 2.24.0. Hai lỗi cùng lớp «bên viết và bên đọc trôi nhau»:

1. **Thẻ Cổng 2 giấu mục ngoài hợp đồng mang sang.** Gặp ba lần: K2 r3 thẻ in 2/7; F11 r2 in 1/15; K6b
   r2 10/10 biến mất. Bằng chứng: crm `be8abc7e4` (`ca-chap-chon-cach-ly` S4 r2), 14/15 mục viết
   `- **<title>** (r1)`. Bản 2.24.0 để tác tử tự in mục mang sang, và tác tử đặt nhãn NGOÀI dấu sao. Bộ đọc
   thẻ `lib/out-of-contract.cjs` chỉ nhận `- **<title>**` trọn dòng nên không đếm được mục nào. Trên `main`
   (PR #278, chưa phát hành) máy tự chèn mục với nhãn trong dấu sao. Nhưng nếu tác tử vẫn tự in thì bước
   chống trùng cũng không nhận ra và **in bản thứ hai**; ca DG3 tái hiện được điều này trên `main`.
2. **`run_id` rỗng lọt.** crm `danh-sach-keo-chung` r2: E3/E7/E12 mang `run_id: ""`, `recheck-evidence.cjs`
   thoát 0. Bên viết: tác tử máy trả `runId` là chuỗi `""` (hai ký tự nháy), biểu thức cũ coi đó là có giá
   trị. Bên đọc: bỏ nháy ra rỗng rồi bỏ qua lặng, còn L1 SHAPE chỉ xét `run_id` ở mức cả tệp.

Thứ tự nghiệm theo luật kho («sửa vì sự cố của MỘT kho phải cân trên MỌI kho»): sửa đúng tầng ở bên viết
trước. Ở bên đọc thì dùng bộ đọc khoan dung (nhận thêm dạng nhãn ngoài sao) và cờ vàng có tên cho `run_id`
rỗng, không chặn. Đo 08/10: 3 báo cáo đã ký ở crm `main` mang `run_id: ""`. Nếu chặn, chúng đỏ ở lần ghim
lại kế tiếp.

## Criteria

- AC-1: Given bảng viết trước 13 dòng tiêu đề (hai dòng cuối giữ nguyên hình từ crm `be8abc7e4`, chữ ẩn danh) (`- **T1 (r1)**`, `- **T2** (r1)`, `- **T3** (r2 · tệp đã đổi)`,
  `- **T4**`, `- **T5** (r?)`, `- **T6** là văn xuôi…`, `- **T7** (xem ghi chú)`, `- **T8** (r1, tệp đã đổi)`,
  `- **T9** (r1 — tệp đổi)`, `- **T10** (R1)`, `- **T11** (từ r1)`) dựng từ khuôn OOC-ITEM-TEMPLATE, When bộ đọc
  thẻ `parse`, Then đếm đúng 10 mục, mỗi mục tiêu đề chuẩn hoá `<tiêu đề> <nhãn>`. T6, T7 KHÔNG thành mục (chữ
  tự do sau dấu sao không bị nuốt); T11 KHÔNG thành mục (giới hạn đã khai).
- AC-2: Given khối marker `OOC-TITLE-RE`, When rút từ `feature-loop/workflows/acceptance-verify.js` và
  `lib/out-of-contract.cjs`, Then hai khối có mặt và giống nhau từng ký tự.
- AC-3: Given một mục mang sang `Loi mang sang` (r1) và tác tử tổng hợp đã tự in nó dạng `- **Loi mang
  sang** (r1)`, When workflow chèn mục mang sang, Then mục xuất hiện đúng MỘT lần và bộ đọc thẻ đếm được nó.
  Đối chứng dương: tác tử không in thì máy chèn đúng một bản, thẻ đọc được. Chiều im: mục tươi cùng tệp, tên
  dài hơn, không nuốt mục mang sang. And mỗi dạng nhãn {`(r1)`, `(r1 · tệp đã đổi)`, `(r1, tệp đã đổi)`, `(r1 —
  tệp đổi)`, `(R1)`} tác tử in, chạy qua workflow → đúng một lần, thẻ đếm được.
- AC-4: Given tác tử máy trả `runId` ∈ {`""`, `''`, `  `, `" "`}, When workflow ghi run-log, Then dòng eval
  mang `minted-<slug>-<eval>-r<round>`. Đối chứng: `abc123` giữ nguyên. And eval MANG SANG từ lượt trước với
  `runId` `""` thì KHÔNG được mang: eval chạy lại, dòng run-log mang mã đúc mới, không có `carried_from_round`.
  Đối chứng: `runId` thật thì mang sang, không chạy lại.
- AC-5: Given báo cáo PASS ba khối eval (E3, E5, E7) với cấu hình khai verifier, E3 và E7 khai `run_id` rỗng ở
  mỗi dạng {`""`, `''`, `' '`, trống trơn}, When `evaluateEvidence`, Then `notes` gọi tên cả E3 và E7 (không
  E5) và `anyFailure` = false. Đối chứng: bản đủ thì `anyFailure` = false và `notes` rỗng. And
  `recheck-evidence.cjs` thoát 0 ở cả hai bản; bản rỗng in `NOTE … run_id rỗng … E3, E7` ra stderr.
- AC-6: Given bản sao với đúng một mảnh bị gỡ, When chạy lại ca, Then ca đỏ: bộ đọc thẻ về biểu thức cũ thì
  `- **T2** (r1)` không được đếm; bước chèn của workflow về biểu thức cũ thì mục mang sang in HAI lần; bên viết
  không bỏ nháy thì `run_id` `""` lọt.
- AC-7: Given cây sau sửa, When chạy bốn bộ test của CI, Then mọi bộ xanh.

## Coverage

| Trục | Giá trị | AC |
|---|---|---|
| A. Dạng tiêu đề | nhãn trong sao · ngoài sao · nhãn đủ «tệp đã đổi» · (r?) · tươi · văn xuôi sau sao · ngoặc không phải nhãn | AC-1 |
| B. Ai in mục mang sang | máy · tác tử (dạng cũ) · mục tươi trùng đầu tên | AC-3 |
| C. Giá trị runId | `""` · `''` · khoảng trắng · nháy bọc khoảng trắng · mã thật | AC-4 |
| D. Bên đọc run_id | `""` · trống trơn · mã thật · qua CLI recheck | AC-5 |

## Out of scope

- Chặn (thay vì ghi chú) báo cáo mang `run_id` rỗng — đổi mặc định cho mọi kho; ngưỡng mở lại ở Notes.
- Sửa báo cáo đã ký ở crm, hoặc bất cứ gì ở crm.
- Prompt tổng hợp: giữ lời dặn «máy tự chèn, KHÔNG in lại». Bộ đọc khoan dung là lưới khi lời dặn bị bỏ qua.

## Notes

- Known limits: (1) `run_id` rỗng chỉ là ghi chú. Ngưỡng chuyển sang chặn: ≥1 báo cáo MỚI (sinh sau mốc mang
  vòng này) còn mang `run_id` rỗng — nghĩa là bên viết còn đường lọt. (2) Bộ đọc chỉ nhận đúng nhãn lượt
  `(rN…)`/`(r?…)` sau dấu sao; tác tử viết nhãn khác hình thì vẫn rơi về cờ vàng «có chữ nhưng không đọc ra
  finding nào» của thẻ — tức thẻ có ≥1 mục đọc được thì mục lệch hình vẫn rơi lặng. Ngưỡng mở lại: ≥1 thẻ
  Cổng 2 ở kho tiêu thụ thiếu mục vì một hình dạng nhãn ngoài bảng AC-1. (3) Mã `Ngoài-N` đánh theo vị trí:
  hồ sơ từng bị giấu mục giữa chừng sẽ thấy số dịch khi dựng thẻ lại; sổ quyết định cũ ghi theo số cũ.
- Hạng T3: `lib/**` và `scripts/recheck-evidence.cjs` nằm trong `risk_tiers.t3_paths` (thêm Gate 1.5 duyệt kế hoạch).
- Known limits (owner định tuyến ở Cổng Bằng chứng 09/10 — Ngoài-1, 2, 4, 5, 6, 7 của lượt chấm 3): ba chỗ của
  vật — `NHAN_LUOT_RE` là bản chép tay nhóm nhãn của `OOC_TITLE_RE`, nằm ngoài khối marker nên DG2 không giữ nó
  (Ngoài-1); bộ dò `run_id` rỗng bóc nháy một tầng (`unquoteScalar`) còn hai bộ đọc bóc tham lam, nên dạng lồng
  `'""'`/`"''"` lọt mà không có ghi chú (Ngoài-2, Ngoài-4); đường mang sang ghi lại `runId` thô có nháy vào run-log
  và báo cáo (Ngoài-5) — và hai chỗ độ chặt của bộ ca: đường suite (`ridTho`) không có ca đo (Ngoài-6); báo cáo
  của DR2/DR4 viết tay theo khuôn bên đọc thay vì rút từ bên viết (Ngoài-7). Sáu hàng ở
  `docs/research/known-limits-ledger.tsv` (doc-ghi-troi-mang-sang-run-id#ngoai-1, 2, 4, 5, 6, 7).
- Mở hợp đồng mới (Ngoài-3): eval mang sang bị chạy lại vì `run_id` rỗng tách cặp nguyên tử của tiêu chí
  nhiều tầng — ghi hạt giống `docs/plans/2026-10-09-hat-giong-carry-run-id-rong-tach-cap.md`.
