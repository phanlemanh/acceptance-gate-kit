---
schema_version: 1
feature: Lộ trình vào kit, lát 2 — skill cắt lượt biến một bản phạm vi (tệp trong git, theo khuôn kit) thành hàng + chân trời của lộ trình, kèm răng phủ tất định «mỗi mã ở đúng một chỗ», luật ngày theo thứ tự và mốc, nhịp đo từ hồ sơ; trang lộ trình in «bước kế» suy từ hồ sơ; kit không ghi trạng thái vào tệp ý định
slug: lo-trinh-cat-luot
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/cat-luot.mjs (mới) + scripts/lo-trinh.mjs + skills/cat-luot (mới) + references + CONTEXT/GUIDE/CHANGELOG + test — không chạm lib/**, hook, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-08-lo-trinh-cat-luot-design.md
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-08T17:01:51Z
---

# Acceptance Contract: lo-trinh-cat-luot

## Context

Cổng Đáng 06/10 ký build lát 2 (hàng L2); owner gọi mở vòng 08/10, trước khi cắt 2.25.0. Lộ trình crm
lớn nhanh hơn tốc độ cắt tay, bảng phủ chép tay đã cũ, bản phạm vi không nằm trong git. Vòng này giao
khuôn bản phạm vi một nguồn, một răng tất định chỉ đọc, một skill cắt theo sáu luật với hai dáng cắt,
và phần sửa lát 1 owner đưa vào ô (bước kế suy từ hồ sơ). Khuôn, luật đỏ, phương án bỏ: design doc.

## Criteria

- AC-1: Given khuôn bản phạm vi `skills/acceptance/references/pham-vi-template.md`, When bộ đọc của `scripts/cat-luot.mjs` đọc khối mẫu rút từ chính khuôn (khối marker `PHAM-VI-MA`), Then nó ra đúng `dot`, `dang`, `nguon` và đúng danh sách mã của mẫu theo thứ tự, 0 lỗi; bản phạm vi có mã trùng → lỗi nêu mã; dòng bắt đầu bằng `- \`` mà sai khuôn (thiếu `—`, mã rỗng) → lỗi nêu số dòng, không bỏ lặng; `dang` ngoài `chuoi`/`lan-va` → lỗi nêu giá trị; không đọc ra mã nào → thoát 2.
- AC-2: Given bản phạm vi N mã và tệp lộ trình có hàng/chân trời mang cùng `dot`, When chạy răng, Then mỗi mã nằm ở đúng một mục cùng đợt → thoát 0 và in bảng phủ đủ N dòng (mã → hàng hoặc chân trời); trên ma trận toàn phần viết sẵn {mã vắng · mã ở hai hàng · mã ở hàng và chân trời · mục cùng đợt phủ mã lạ} mỗi ca thoát 1 với đúng một dòng lỗi nêu mã (và cả hai chỗ khi trùng); ca đợt chưa có mục nào (bản phạm vi ≥ 2 mã) thoát 1 với đúng một dòng «đợt <dot> chưa cắt: N mã …»; mục khác đợt hoặc không `dot` không làm đỏ, kể cả khi phủ trùng tên mã.
- AC-3: Given một mục chân trời cùng đợt thiếu `ly_do` (hoặc `ly_do` rỗng), When chạy răng, Then thoát 1 với lỗi nêu mã chân trời; có `ly_do` thì không lỗi này.
- AC-4: Given tệp lộ trình có cờ khuôn của lát 1 (thiếu `cau_giao`, mã trùng, `dung_tren` không phải mảng) hoặc `dung_tren` trỏ mã không có, When chạy răng, Then thoát 1 và in nguyên văn từng cờ — với hàng cùng đợt; cùng cờ ở hàng ngoài đợt (không `dot` hoặc đợt khác) in thành dòng «cảnh báo:» và mã thoát vẫn 0; và `kiemKhuon` cờ khi `phu` không phải mảng hoặc phần tử `chan_troi` không phải object, còn khuôn `lo-trinh-template.json` (nay mang `phu`, `dot`, `chan_troi`) vẫn 0 cờ.
- AC-5: Given bản phạm vi hoặc tệp lộ trình không phải tệp git theo dõi (chưa add, ngoài kho), When chạy răng, Then thoát 2 với «bản phạm vi phải là tệp có trong git» (hoặc «tệp lộ trình phải là tệp có trong git») và không in bảng phủ; đối chứng dương: cùng tệp sau khi commit thì chạy được.
- AC-6: Given hàng có `ngay` sớm hơn `ngay` của hàng nó đứng trên, hoặc hàng gắn một mốc (`moc[].hang`) mà `ngay` muộn hơn ngày mốc, When chạy răng, Then thoát 1 nêu mã hàng và hai ngày — với hàng cùng đợt; hàng ngoài đợt lệch ngày chỉ in «cảnh báo:», mã thoát 0; hàng thiếu ngày (một trong hai bên) không bị xét; và trên tệp lộ trình OKR thật của crm (fixture) cộng một đợt mới sạch, răng thoát 0 — hàng cắt tay đời trước không làm đợt mới đỏ.
- AC-7: Given kho thử có hồ sơ đã ký ở T2 và T3 (ngày chốt phạm vi ở `approved_at` hoặc `veto_opened_at`, ngày ký trong `human_signoff`) cùng hồ sơ thiếu ngày, When chạy `cat-luot.mjs --root . --nhip`, Then JSON in trung vị số ngày từng hạng đúng bằng giá trị tính tay trong ca từ các ngày đã dựng, `n` mỗi hạng, và số hồ sơ bỏ qua vì thiếu ngày; kho không hồ sơ nào → `n: 0`, không trung vị; và trên chính các hồ sơ đã ký thật của kit (cây đang kiểm), T2 có `n` ≥ 10 và số bỏ qua ≤ một nửa số hồ sơ đã ký — bộ đọc ngày khớp khuôn bên ghi thật của lệnh ký.
- AC-8: Given răng chạy trên một kho thử (ca xanh, ca đỏ, ca `--nhip`), Then băm mọi tệp trong cây trước = sau và `git status --porcelain` rỗng — mã kit không ghi gì.
- AC-9: Given `skills/cat-luot/SKILL.md`, When chạy NGUYÊN VĂN khối lệnh răng (marker `CAT-LUOT-RANG`) và khối lệnh nhịp (`CAT-LUOT-NHIP`) của SKILL trên một kho thử (thay ô `<…>`, gốc gói như harness thay), Then hai lệnh chạy được và ra đúng mã thoát của ca xanh/đỏ; SKILL nêu đủ sáu luật (khối `CAT-LUOT-SAU-LUAT`, sáu dòng đánh số), hai dáng cắt (`chuoi`, `lan-va`), đường vào từ Core của quét hình thái, và thứ tự «ghi hàng → chạy răng → xanh mới mở PR».
- AC-10: Given chỉ SKILL `cat-luot`, khuôn bản phạm vi và một bản phạm vi mẫu làn vá dựng từ mã khảo sát crm 04/10 (chép vào hồ sơ), When một phiên đọc để cắt, Then SKILL đủ chỉ dẫn để ra hàng theo đúng sáu luật cho dáng làn vá (gói theo màn, chạy song song không `dung_tren` giả, mã không cắt được thành chân trời kèm lý do), không bắt người cắt lại bảng phủ bằng tay, và không bảo kit ghi trạng thái vào tệp ý định. (judgment)
- AC-11: Given kho khai lộ trình có hàng nối hồ sơ ở mọi ô bản đồ dựng được, When vẽ trang, Then ô Trạng thái của hàng có hồ sơ mang đúng một dòng «bước kế: <câu>» theo bảng viết sẵn trong ca (ma trận toàn phần các ô; ô không có bước kế thì không dòng), hàng không hồ sơ không mang dòng; chiều đỏ: bản sao đổi câu một ô → ca đỏ nêu ô đó.
- AC-13: Given trang vẽ từ kho có hàng ở ô «Đã giao — chờ phiên nghiệm thu» và «Chờ duyệt phạm vi», When đo trên Chrome ở 375 và 1440, sáng và tối, Then dòng bước kế hiện, cùng cỡ chữ với chữ phụ «theo ghi chép» của trang, không tràn ô, tương phản đạt, trang không tràn ngang; chiều đỏ: bản sao bỏ lớp chữ phụ khỏi dòng bước kế → ca đỏ nêu «cỡ chữ dòng bước kế».
- AC-12: Given kho KHÔNG khai lộ trình, When vẽ bản đồ và quét thẻ start, Then `PRODUCT-MAP.md` và JSON quét giống từng byte bộ vẽ ở commit gốc của vòng (`ccce2817`), không `LO-TRINH.html`; và Given kho khai lộ trình mà không hàng nào có hồ sơ, Then `LO-TRINH.html` giống từng byte bộ vẽ `ccce2817` (dòng bước kế chỉ xuất hiện ở hàng có hồ sơ).

## Coverage

Quét bằng `morphological-scan` (preset test-matrix; đối tượng = bản phạm vi × tệp lộ trình × lượt răng).
Chân sản phẩm: bốn phép thử của ô cơ hội trên crm `ccbaf7068` (phủ 28 số, 16 số hở; sáu luật trên 19
hàng; hai dáng cắt) `[SUY-TỪ-REPO: _acceptance/lo-trinh-cat-luot/opportunity.md]`; khuôn lát 1
`[SUY-TỪ-REPO: scripts/lo-trinh.mjs]`. Chân ngành: `[NGÀNH: requirements traceability matrix — mỗi
yêu cầu truy về đúng một hạng mục]`; `[NGÀNH: Shape Up — bàn cược, không backlog]` (hạt giống §8).

- Trục A — bản phạm vi: đúng khuôn | mã trùng | dòng sai khuôn | `dang` lạ | rỗng | ngoài git  [thước CE: khuôn PHAM-VI-MA + phép thử 1 của ô] → AC-1, AC-5
- Trục B — phủ: đủ | thiếu | hai hàng | hàng + chân trời | mã lạ cùng đợt | khác đợt | không `dot` | đợt chưa cắt | chân trời thiếu lý do  [thước CE: bảng phủ mục 8 lộ trình OKR crm — luật «mỗi mã về đúng một chỗ»] → AC-2, AC-3
- Trục C — khuôn lộ trình và ngày: cờ lát 1 | `dung_tren` hỏng | `phu`/`chan_troi` sai kiểu | ngày ngược thứ tự | quá mốc | thiếu ngày  [thước CE: luật 2, 5 của hạt giống §4] → AC-4, AC-6
- Trục D — người dùng răng: skill (hai dáng) | nhịp | kho không khai | trang (bước kế)  [thước CE: phép thử 2, 4 của ô; phiên nghiệm thu lát 1] → AC-7, AC-9, AC-10, AC-11, AC-12, AC-13, AC-8
- Later: suy `pr` khi kho bảo đảm lịch sử đầy đủ trong CI · chân trời lên trang lộ trình · cờ «hàng không mở quá hai mốc» (hạt giống §8 điểm 5).
- Never: kit ghi trạng thái vào tệp ý định · RICE/WSJF/điểm ưu tiên tự động.

## Đường đo

- Răng phủ xanh, 0 mã lọt · số từ: `cat-luot.mjs` trên lượt cắt kế của crm (bản phạm vi trong git) · AC-2, AC-3, AC-5.
- Bảng phủ không còn chép tay · số từ: bảng phủ là đầu ra của răng, không có tệp bảng phủ viết tay trong PR cắt của crm · AC-2 (vật), đọc ở phiên nghiệm thu.
- Thời gian từ bản phạm vi tới commit hàng ≤ nửa lượt cắt tay 04/10 · số từ: git crm (commit bản phạm vi → commit hàng cùng PR) · không AC (đo ở kho tiêu thụ; nền tay không đo được ở đây — phép thử 1a của ô).
- Owner sửa < 1/3 số hàng skill sinh TRƯỚC khi gộp PR cắt (ngưỡng CHẾT ở opportunity.md) · số từ: git crm — so commit hàng đầu tiên của phiên cắt với commit gộp PR, đếm hàng có `cau_giao`/`dung_tren`/`ngay`/`hang` đổi · không AC (đo ở kho tiêu thụ, đọc ở phiên nghiệm thu).
- 0 hàng sửa ý định sau khi vòng mở trong 30 ngày · số từ: git diff tệp ý định crm so `approved_at` các hợp đồng · không AC (đo ở phiên nghiệm thu).
- Kho không khai lộ trình không đổi · số từ: so byte với bộ vẽ `ccce2817` · AC-12.

## Out of scope

- Kit (mã) ghi hay sửa tệp ý định của kho; mọi hàng vào tệp qua PR người gộp.
- Suy `pr` từ lịch sử git — trang lộ trình tất định mà CI hay lấy lịch sử nông (`--check` đỏ oan).
- Hồ sơ con kế thừa mã hàng — kit không có đường sinh hồ sơ con (luật 18/09); ca crm dựng tay.
- Chân trời và cờ tuổi hàng trên trang lộ trình; RICE/WSJF; băng chống trôi dùng chung (gói C).
- Nấc 1–2 trong CRM (trang `/lo-trinh`, nút góp ý) — hàng của lộ trình crm.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ca đo: `tests/scripts/lo-trinh.test.mjs` (LT-130…LT-141), chạy bằng `config:executors.test.lo_trinh`
  sẵn có — không thêm khoá executor (sửa `_acceptance/config.yaml` làm cũ hồ sơ khác; cùng lựa chọn
  của vòng X1).
- Bản phạm vi mẫu làn vá cho AC-10: `_acceptance/lo-trinh-cat-luot/mau/pham-vi-lan-va.md`, dựng từ
  danh sách mã khảo sát mà hàng crm trích (phép thử 1 của ô).
- Va chạm đã biết với vòng X1 (`xuat-du-lieu-lo-trinh`, PR #285, chưa gộp): cả hai đổi bộ vẽ trang lộ
  trình. Vòng nào gộp SAU phải cập nhật ca so-byte «bộ vẽ trước vòng» của mình (X1 LT-112; vòng này
  LT-141) và vẽ lại trang mẫu — ghi trong PR của vòng gộp sau.
