---
schema_version: 1
feature: Hồ sơ đã ký luôn tươi — lệnh giữ tươi theo khoảng gộp, quy đỏ về PR gây ra, nhãn «đỏ sẵn trên nền» cho vòng khác đi tiếp; mặc định tắt
slug: ho-so-da-ky-giu-tuoi
owner: phanlemanh@gmail.com
risk_tier: T3               # lib/ (bảng nhãn, hàm kiểm nhãn) + scripts/pre-merge-check.sh + scripts/recheck-evidence.cjs ∈ t3_paths
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-17-ho-so-da-ky-giu-tuoi-design.md
status: signed-off
approved_by: Manh Phan
approved_at: 2026-10-17T22:14:00Z   # duyệt lại phạm vi sau lượt chấm 1: thêm ô đo AC-4, AC-5, AC-7 (lần đầu 2026-10-17T13:29:34Z)
---

# Acceptance Contract: ho-so-da-ky-giu-tuoi

## Context

Hàng K-A, vòng meta duy nhất của cửa sổ (luật chiều rộng b), Cổng Đáng `build` 17/10. Ca đo sống ở
`tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs` (GT<n> = AC-<n>): kho thử git do code sinh trong lượt — nhánh chính có
các commit gộp mang tiêu đề `Merge pull request #<n>`, hồ sơ đã ký do lệnh ký thật dựng, eval canh tệp vật bằng lệnh
có tên ca đỏ ghim. «Bản trước vòng» = `git archive` của merge-base với `main` lúc mở vòng (`43ed9e2b`) bung trong
lượt; mỗi chiều đỏ chứng kho thử TÁI HIỆN lỗi trên bản ấy, mỗi chiều im so BẰNG NHAU với bản ấy. Riêng AC-8 chạy trên
bộ hồ sơ thật của các kho có trên máy (`tests/scripts/ho-so-da-ky-giu-tuoi-cac-kho.mjs`).

## Criteria

- AC-1: Given kho thử có năm hồ sơ đã ký theo ma trận viết trước {H1 tươi · H2 bị một gộp trong khoảng chạm `paths` · H3 cũ từ TRƯỚC khoảng · H4 bị gộp trong khoảng chạm và cũng cũ từ trước · H6 được gộp vào nhánh chính TRONG khoảng rồi một gộp sau đó chạm `paths` của nó}, When chạy lệnh giữ tươi với `<từ>` = sha trước khoảng, `<đến>` = đỉnh, không `--write`, Then tập «cũ vì khoảng» là đúng {H2, H6}, tồn đọng là đúng {H3, H4} (in tên, không ghim), H1 không xuất hiện; và tập ấy BẰNG «cũ ở đỉnh» trừ «cũ ở `<từ>`» của hai lượt `pre-merge-check.sh` không `--base` chạy tay (hồ sơ chưa có ở `<từ>` tính là tươi ở `<từ>`) — một nguồn với bên đọc. Kho và sổ không đổi byte nào khi không `--write`.
- AC-2: Given kho thử của AC-1 thêm H5 cũng cũ vì khoảng và mọi eval của H2, H5 xanh, When chạy lệnh với `--write`, Then H2 và H5 mỗi hồ sơ nhận đúng một dòng `repin` cùng `run_id` (suite chung chạy MỘT lần — đếm lệnh trong nhật ký), `verified_commit` = đỉnh, mục «Re-pin lần N» đúng khuôn, chữ ký người không đổi byte, và `recheck-evidence.cjs` xanh trên cả hai.
- AC-3: Given H2 xanh và H5 có E1 đỏ với ca đỏ tên ghim, When chạy lệnh với `--write`, Then H2 vẫn được ghim (không bị hồ sơ khác kéo đỏ), H5 không có dòng `repin` mới, `verified_commit` của H5 không đổi, và H5 nhận đúng một dòng `kind: "nen-do"` mang `run_id`, `sha` đỉnh, `tu`, `ket_cuc`, `lenh_do[]` có `eval: "E1"`, `exit` ≠ 0, `thong_diep_bam` (64 hex), `trich` chứa tên ca đỏ, và `evals_hash.E1`. Chiều đỏ: suite chung đỏ → không hồ sơ nào được ghim, stderr «suite chung đỏ — không ghim hồ sơ nào».
- AC-4: Given E1 của H5 đỏ vì đúng một gộp `#12` chạm tệp trong `paths` của E1 (xanh ở `<từ>`), When chạy lệnh, Then dòng `nen-do` có `ket_cuc: "do-khoang"`, `quy_ve` = [{pr: 12, sha_truoc, sha_sau}] với hai sha đúng cha/đích của gộp `#12`, và bảng in «đỏ do PR #12». Ma trận viết trước thêm ba ô: {hai gộp `#12`, `#13` cùng chạm `paths` → `nhieu-pr`, `quy_ve` liệt cả hai · E1 đã đỏ cùng băm ở `<từ>` → `do-san-truoc-khoang`, `quy_ve` rỗng · E1 không khai `paths` → mọi gộp có mã trong khoảng là ứng viên, kèm ghi chú «eval không khai paths»}. Ô thứ năm (chủ kho thêm 18/10, sau lượt chấm 1 — kho thật có thư viện cài sẵn không theo dõi bởi git): E1 đọc một thư mục phụ thuộc bị git bỏ qua và đỏ sẵn từ trước khoảng với cùng thông điệp → kết cục `do-san-truoc-khoang`, KHÔNG chuỗi `#12`; và khi lần chạy lại ở `<từ>` không chạy được vì thiếu phụ thuộc (lỗi thiếu mô-đun/lệnh, mã 127) → `ha-tang` với ghi chú «không chạy lại được ở đầu khoảng», KHÔNG gọi tên PR nào. Chiều đỏ: bản lượt chấm 1 ở ô này gọi tên `#12`.
- AC-5: Given E1 của H5 đỏ vì hạ tầng theo ma trận viết trước {lệnh không tồn tại (mã 127) · lệnh bị ngắt (mã ≥ 128) · xanh khi chạy lại trên đỉnh}, When chạy lệnh, Then ở cả 3 ô `ket_cuc: "ha-tang"`, `quy_ve` rỗng, dòng sổ mang cặp sha của khoảng (`tu` và `sha` đỉnh), bảng in «không quy được — hạ tầng» kèm hai sha ấy, và KHÔNG chuỗi `#12` nào xuất hiện trong dòng sổ hay bảng — dù gộp `#12` có chạm `paths` của E1. Ô thứ tư (chủ kho thêm 18/10): dòng nền `ket_cuc: "ha-tang"` KHÔNG bao giờ làm nền cho nhãn — khoá bật, một vòng khác ghim lại H5 gặp E1 đỏ cùng ca, cùng thông điệp với dòng ấy → lượt ghim lại thoát 1, không ghim, stderr «nhãn không gắn: dòng nền là đỏ hạ tầng — không làm nền», và một dòng `repin` mang `do_san` trỏ vào dòng ấy (ghi đè trên bản sao) bị lưới và kiểm lại báo VIOLATION nêu đúng vế đó. Chiều đỏ: luật nhãn lượt chấm 1 gắn nhãn ở ô này.
- AC-6: Given khoá `feature_loop.do_san_tren_nen: true`, nhánh chính có dòng `nen-do` của H5 (E1, băm b), một nhánh vòng khác tách sau đó chạm `paths` của H5, When lượt ghim lại (`repin-lane.mjs`) chạy cho H5 trên nhánh ấy, Then theo ma trận viết trước 7 ô: {E1 đỏ cùng ca và cùng thông điệp, định nghĩa giữ → dòng `repin` có `do_san.E1.run_id` = run_id nền, `evals_exit.E1` ≠ 0, mục Re-pin có « · đỏ sẵn trên nền: E1←<run_id>», thoát 0 · thêm E2 đỏ → thoát 1, không pin · E1 đỏ ở ca khác → thoát 1 · E1 đỏ cùng ca nhưng thông điệp lỗi khác (vd «expected 3 got 4» thành TypeError) → thoát 1 · khối E1 trong `evals.yaml` đổi → thoát 1 · dòng nền chỉ có trên nhánh vòng (không trên merge-base) → thoát 1 · khoá vắng → thoát 1}; mỗi ô đỏ có `repin-do` và stderr nêu vế hỏng. Chiều đỏ: bản trước vòng ở ô đầu thoát 1, không pin (tái hiện ca 15/10).
- AC-7: Given các dòng `repin` do AC-6 ghi, When `pre-merge-check.sh` và `recheck-evidence.cjs` đọc H5 và thẻ Cổng Bằng chứng cùng bản đồ sản phẩm vẽ H5, Then với pin mang nhãn hợp lệ: lưới in «NOTE [H5]: đỏ sẵn trên nền — E1 (nền <run_id>, PR #12)» và KHÔNG VIOLATION cho mã E1, kiểm lại xanh, thẻ và bản đồ hiện «đỏ sẵn trên nền» và không chữ «ĐẠT» cho H5; với `do_san` giả (ghi đè `run_id` không có dòng nền · băm khác dòng nền · khoá tắt lúc đọc · dòng nền do chính nhánh vòng tự thêm, KHÔNG có ở điểm tách của nhánh với nhánh chính — chủ kho thêm ô này 18/10) → VIOLATION nêu vế hỏng ở cả lưới lẫn kiểm lại; bên đọc đọc dòng nền tại điểm tách với nhánh chính, không đọc trong cây đang xét, và không tìm được nhánh chính thì không gắn nhãn (đóng về phía đỏ). Bên viết nhãn và bên đọc dùng CÙNG một hàm trong `lib/`: trên bản sao, ép hàm ấy luôn trả «không đạt» → cả lượt ghim lại, lưới và kiểm lại cùng đỏ ở ô hợp lệ; ép luôn trả «đạt» → cả ba cùng nhận nhãn ở một ô giả — mỗi phía ghim đúng thông điệp của nó.
- AC-8: Given khoá vắng, When chạy `pre-merge-check.sh` (không `--base`), thẻ và bản đồ của bản mới và bản trước vòng trên bộ hồ sơ thật của mọi kho có trên máy trong danh sách {acceptance-gate-kit, crm-onehub, oneflow}, Then đầu ra BẰNG nhau từng byte (sau khi bỏ giờ chạy) ở mọi kho, kèm số hồ sơ đã so mỗi kho > 0; và trên kho thử của AC-6 với khoá vắng hay `false`, lượt ghim lại của bản mới cho cùng mã thoát, cùng dòng sổ (bỏ ts, sha, id lượt) như bản trước vòng. Chiều đỏ: bản sao bản mới với khoá mặc định đảo thành bật → ca đỏ, nêu kho và dòng khác đầu tiên.
- AC-9: Given hồ sơ mang dòng `nen-do` và dòng `repin` có `do_san` do bản mới ghi, When bản trước vòng chạy lưới trước-gộp, kiểm lại bằng chứng, thẻ và bản đồ trên hồ sơ ấy, Then không công cụ nào vỡ (không stack trace, mã thoát thuộc tập đã khai), lưới và kiểm lại báo VIOLATION mã eval ≠ 0 cho pin mang nhãn (đóng kín về phía đỏ), và dòng `nen-do` bị bỏ qua (đầu ra của hồ sơ chỉ có thêm dòng `nen-do` BẰNG đầu ra khi xoá dòng ấy).
- AC-10: Given kho thử có đủ năm kết cục {tươi lại · đỏ do PR · nhiều PR · đỏ sẵn trước khoảng · hạ tầng} cộng tồn đọng, When chạy lệnh có và không `--json`, Then bảng in mỗi hồ sơ một dòng tiếng sản phẩm (hồ sơ · kết cục · phút máy), dòng cuối «tồn đọng N hồ sơ không ghim · tổng giờ máy X»; `--json` cho cùng tập kết cục theo từng hồ sơ; lệnh không tạo commit, không đổi nhánh, và từ chối chạy (thoát 2, «cây bẩn ngoài _acceptance/») khi cây làm việc bẩn.

## Coverage

Quét hình thái ở bản thiết kế (mục «Quét không gian tiêu chí»). Bốn trục:
- Trục A — trạng thái hồ sơ sau một khoảng gộp: tươi (AC-1) · cũ-ghim-xanh (AC-2) · cũ-đỏ-do-một-PR (AC-4) · cũ-đỏ-nhiều-PR
  (AC-4) · đỏ-sẵn-trước-khoảng (AC-4) · đỏ-hạ-tầng (AC-5) · tồn đọng (AC-1) · eval ngoài làn máy bị chạm → Later (làn
  ghim lại đã nói ra bằng `evals_not_machine_touched`). [thước CE: ba kết cục làn hôm nay × hai trạng thái ở `<từ>`]
- Trục B — bên: lệnh (AC-1..5, 10) · làn của vòng khác (AC-6) · lưới + kiểm lại + thẻ + bản đồ (AC-7) · bản kit cũ (AC-9) ·
  kho không bật (AC-8). [thước CE: danh sách bên đọc `kind === "repin"` từ đọc dò 17/10]
- Trục C — khoá: vắng · false (AC-8) · true (AC-6, AC-7) · giá trị sai → lỗi gọi tên khoá (ca phụ của AC-6, khuôn `docKhoa`).
- Trục D — vế khớp nhãn: sáu ô của AC-6 + ba ô giả của AC-7.

## Đường đo

Ngưỡng ở ô cơ hội đọc sau khi crm cài mốc và bật khoá, 14 ngày:
- «0 lượt gọi người ngoài thiết kế vì đỏ sẵn»: đếm trên kênh điều phối crm-onehub#375 và sổ quyết định các hồ sơ crm
  trong 14 ngày — không có vật mới (giới hạn: đếm tay ở lượt đọc ngưỡng).
- «Mỗi ca đỏ quy về đúng PR, hoặc nói rõ không quy được»: đọc các dòng `nen-do` trong run-log crm — `ket_cuc` và
  `quy_ve` do AC-3/AC-4/AC-5 bảo đảm khuôn; `--json` của AC-10 gom thành một bảng.
- «Không lần nào onehub giữ đứng yên vì hồ sơ hoá cũ do PR khác»: đếm tin «giữ onehub» trên crm-onehub#375 — không có
  vật mới.
- «Ca đỏ vì hạ tầng bị quy về PR vô tội» (vế CHẾT): với mỗi dòng `nen-do` `ket_cuc: do-khoang` trong 14 ngày, đối chiếu
  tay với PR sửa hay revert đã thật sự làm eval ấy xanh lại — PR được gọi tên mà không phải PR có bản sửa là một ca
  quy sai. Giới hạn: đếm tay ở lượt đọc ngưỡng; dòng `ha-tang` mang cặp sha của khoảng (AC-5) để người tự kiểm lại.
- «PR làm đỏ thêm mà vẫn lọt nhờ nhãn» (vế CHẾT): mỗi dòng `repin` có `do_san` trong run-log crm, so `evals_exit` khác 0
  với các eval có dòng nền — AC-6/AC-7 bảo đảm làn và lưới không cho lọt; đếm bằng `jq`.

## Out of scope

- Lịch đêm chạy lệnh trên crm, luân phiên ba máy, vòng dọn hồ sơ tồn đọng — việc của crm (ô cơ hội).
- Chia đôi để tìm PR gây ra — nhân giá ghim lại log₂N; quy theo `paths` + một lần chạy lại ở đầu khoảng (thiết kế §4).
- Nhãn cho suite chung — theo Hỏi-2 (máy khuyên chỉ eval): suite đỏ sẵn vẫn chặn vòng khác, khai ở Known limits kèm ngưỡng.
- Hạn «đỏ sẵn quá N ngày», tự mở PR vệ sinh quy về PR gây ra, ghim cả tồn đọng theo cờ — Later.
- K-B, K-C, K-D — cửa sổ kế (luật chiều rộng b).

## Known limits

- Khai trước từ ô cơ hội (giả định 3, ca ba): một PR làm hỏng ĐÚNG eval đã đỏ trên nền, ở ĐÚNG ca và với ĐÚNG thông
  điệp ấy, thì không chặn thêm vòng nào — eval vẫn đỏ trên thẻ, chỉ thôi chặn. Ngưỡng mở: ≥1 dòng `repin` mang `do_san`
  mà PR sửa sau đó cho thấy hai lỗi chồng nhau ở cùng ca, trong 14 ngày đo.
- Nhãn chỉ áp cho eval (theo câu trả lời Hỏi-2): suite chung đỏ sẵn vẫn chặn vòng khác như hôm nay. Ngưỡng mở: ≥1
  lượt gọi người vì suite đỏ sẵn trên nhánh chính trong 14 ngày đo, ở bất kỳ kho nào đã bật khoá.

## Notes

- CỘNG cần chủ kho phê đích danh ở Cổng Phạm vi (ADR 0018): lệnh mới, loại dòng sổ `nen-do`, nhãn trạng thái mới, khoá
  `feature_loop.do_san_tren_nen`, chế độ ghim từng hồ sơ của làn ghim lại — Hỏi-1 trong sổ quyết định.
- Known limits — chọn ở Cổng Bằng chứng 2026-10-18:
  - Ngoài-1: Khi máy quá tải đến mức cả hai bản cùng bị ngắt giữa chừng ở chính chỗ nhau, phép so sánh trên các kho thật có thể báo «giống nhau» dù chưa chạy xong lần nào.
  - Ngoài-3: Khi máy quá tải đến mức cả hai bản cùng bị cắt giống hệt nhau, phép so sánh trên kho thật có thể báo xanh dù lưới chưa từng chạy xong.
  - Ngoài-4: Nếu sau này một thay đổi làm hỏng đúng luật «đỏ do hạ tầng không bao giờ làm nền», hệ thống vẫn báo đỏ nhưng không chỉ đúng thay đổi gây ra, mà liệt kê mọi thay đổi đã gộp là nghi can.
  - Ngoài-5: Người đọc ghi chú đầu bộ kiểm có thể dựng lại chiều đỏ trên nhầm bản gốc nên thấy kết quả khác với báo cáo.
  - Ngoài-8: Một ca đỏ mới nằm ngoài danh sách tên được ghi nhận có thể không bị bộ kiểm bắt nếu chỉ khác ở một kiểu dòng báo hỏng của một trình chạy test.
  - Ngoài-9: Một lỗi đỏ thật có thể bị xếp nhầm là «hạ tầng» nên không gọi tên thay đổi gây ra, nếu lời lỗi giống một mẫu thiếu tệp phổ biến và đỉnh cũng in đúng dòng đó.
  - Ngoài-11: Nếu ai đó sửa tay dòng ghim lại và bỏ mã lượt nền, cổng vẫn có thể trao nhãn «đỏ sẵn trên nền» cho một cái đỏ chưa được đối chiếu đúng lượt.
  - Ngoài-12: Kiểm tra rằng thẻ và bản đồ không ghi «ĐẠT» cho hồ sơ đỏ sẵn thì không bao giờ báo đỏ được, nên nếu sau này bản đồ ghi nhầm kiểu «xanh sạch» thì không ai biết.
  - Ngoài-15: Nếu ai đổi lệnh đo ở nơi khác với eval khai kiểu tham chiếu, hệ thống vẫn coi phép đo là không đổi và có thể giữ nhãn «đỏ sẵn trên nền» cho một phép đo đã khác.
  - Ngoài-19: Hai phép kiểm đọc nhãn dùng dòng nền dựng tay chứ không phải dòng do lệnh thật ghi, nên nếu hai bên lệch khuôn thì các phép kiểm này không thấy.
- Hạt giống mở ở Cổng Bằng chứng 2026-10-18: `docs/plans/2026-10-18-hat-giong-giu-tuoi-kho-nhieu-goi-noi-bo.md` (Ngoài-6) · `docs/plans/2026-10-18-hat-giong-nen-do-xet-theo-tung-eval.md` (Ngoài-7)
