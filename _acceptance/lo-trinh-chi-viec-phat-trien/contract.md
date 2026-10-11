---
schema_version: 1
feature: Lộ trình chỉ chứa việc phát triển — răng cắt lượt đặt việc vận hành của người vào mốc ngoài (chỗ thứ ba của bảng phủ), đỏ khi hàng đứng chờ mốc vận hành hay đo trên dữ liệu giả mà không có hàng sinh dữ liệu giả đứng trước, nhắc tự phục vụ cho vận hành lặp lại; SKILL tách vận hành trước sáu luật và sửa Ngoài-1/2 của S3
slug: lo-trinh-chi-viec-phat-trien
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/cat-luot.mjs + skills/cat-luot/SKILL.md + hai khuôn lộ trình + CONTEXT.md + ca đo — không chạm lib/**, hooks/**, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-11-lo-trinh-chi-viec-phat-trien-design.md
status: signed-off
veto_state: mo
veto_opened_at: 2026-10-11T09:20:54Z
---

# Acceptance Contract: lo-trinh-chi-viec-phat-trien

## Context

Hàng S3b của lộ trình kit (chủ kho chốt 11/10 «đưa vào», Cổng Đáng ký build T2 11/10). Kết quả của
vòng — dáng việc nền: khi một phiên cắt một đợt phạm vi, việc vận hành của người có chỗ riêng là
**mốc ngoài** và hiện trong bảng phủ; răng đỏ TRƯỚC khi PR mở nếu một hàng phát triển đứng chờ mốc vận
hành, hay đo trên dữ liệu giả mà không có hàng sinh dữ liệu giả đứng trước; vận hành lặp lại được nhắc
xét tự phục vụ. Lộ trình cũ của mọi kho đọc như cũ. Số đo nền (crm `27d47de04`): OKR 11/16 mốc là vận
hành; Kho tài liệu có 2 hàng vận hành và 3 hàng phát triển đứng trên hàng vận hành `ct` (design §2).

## Criteria

- AC-1: Given một đợt có mã ở hàng, ở chân trời và ở mốc ngoài (`moc` có `loai: "ngoai"` mang `dot` + `phu` + `ai`), When chạy răng, Then bảng phủ in mỗi mã đúng chỗ của nó — mã ở mốc ngoài in `<mã> → mốc ngoài <ma của mốc, vắng thì ten>` — và thoát 0; trên ma trận viết sẵn {mã ở cả mốc ngoài lẫn một hàng · mốc ngoài phủ mã bản phạm vi không có · mốc cùng đợt mang `phu` mà `loai` vắng · `loai: han` · `loai: phat-hanh` · mốc ngoài của đợt thiếu `ai` · `ai` toàn khoảng trắng · `phu` của mốc là chuỗi · `ma` của mốc ngoài trùng mã một hàng} mỗi ca thoát 1 với dòng `lỗi:` nêu đúng mốc và đúng vi phạm; đối chứng: mốc khác đợt mang `phu` không được xét (không lỗi, mã của nó không tính phủ) và đợt chỉ có mốc ngoài không bị báo «đợt chưa cắt»; số ca đo == số phần tử ma trận (in ra).
- AC-2: Given hàng có `dung_tren` trỏ một mốc `loai: "ngoai"`, When chạy răng, Then trên ma trận {hàng trong đợt trỏ bằng `ma` của mốc · trỏ bằng `ten` · trỏ mốc ngoài không `dot` của lộ trình cũ} mỗi ca thoát 1 với đúng một dòng `lỗi: hàng <mã> [cho-van-hanh]: …` nêu mốc và hai lối (hàng sinh dữ liệu giả · chân trời mở lại khi mốc xong), không kèm dòng «đứng trên mã không có» cho cùng mục; ba đối chứng im: `dung_tren` trỏ mốc `loai` khác `ngoai` (vẫn «đứng trên mã không có», không cờ) · mốc ngoài có `hang` gắn hàng của đợt · chân trời có `mo_lai_khi` nêu tên mốc; và trên bản chụp lộ trình Kho tài liệu thật của crm dựng thành một đợt trong ca (`ct`, `cb` thành mốc ngoài): giữ nguyên `dung_tren` của bản chụp → thoát 1, tập hàng mang `[cho-van-hanh]` BẰNG tập hàng đứng trên `ct` hoặc `cb` tính từ bản chụp (29/09: `l4` trên `cb`; `l5`, `d9`, `d6` trên `ct`); cắt theo luật (`l5` thành chân trời mở lại khi mốc `ct` xong, các hàng khác bỏ `ct`/`cb` khỏi `dung_tren`) → thoát 0, bảng phủ đặt mã của `ct` và `cb` ở mốc ngoài.
- AC-3: Given hàng khai `du_lieu`, When chạy răng, Then trên ma trận viết sẵn {`gia` đứng trên hàng `sinh-gia` cùng đợt → không cờ · `gia` đứng trên hàng `sinh-gia` khác đợt → không cờ · `gia` không `dung_tren` → `thieu-hang-sinh-gia` · `gia` đứng trên hàng không khai → `thieu-hang-sinh-gia` · `gia` đứng trên hàng `gia` mà hàng ấy đứng trên `sinh-gia` (bắc cầu) → `thieu-hang-sinh-gia` · `sinh-gia` → không cờ · `"that"` · `"Gia"` · `""` · `1` → `du-lieu-sai-gia-tri` · vắng → không cờ} mỗi ca ra đúng kỳ vọng ở mức lỗi, dòng nêu mã hàng, tên cờ trong ngoặc vuông và giá trị khai; mã thoát 1 khi và chỉ khi có lỗi; số ca đo == số phần tử ma trận (in ra).
- AC-4: Given mốc ngoài của đợt đang cắt, When chạy răng, Then trên ma trận {`lap: true` không `tu_phuc_vu` → `cảnh báo: mốc <nhãn> [van-hanh-lap-chua-tu-phuc-vu]: …`, thoát 0 · `lap: true` + `tu_phuc_vu` trỏ một hàng → không cờ · trỏ một chân trời → không cờ · `tu_phuc_vu` trỏ mã không có → lỗi nêu mã ấy · `lap: false` → không cờ · `lap` vắng → không cờ · `lap: "true"` (chuỗi) → lỗi nêu `lap`} mỗi ca đúng kỳ vọng; cùng mốc mang `dot` khác đợt đang cắt → không dòng nào nhắc mốc ấy.
- AC-5: Given hàng NGOÀI đợt (đợt khác hoặc không `dot`) mang `cho-van-hanh`, `thieu-hang-sinh-gia`, `du-lieu-sai-gia-tri`, When chạy răng, Then mã thoát vẫn 0 và mỗi cờ có đúng MỘT dòng `cảnh báo: [<cờ>] <k> hàng ngoài đợt …` liệt mã (tối đa 8 rồi «…»), không dòng theo từng hàng; đối chứng: cùng các hàng chuyển vào đợt → thoát 1; đối chứng im: hàng ngoài đợt KHÔNG mang trường mới (`du_lieu` vắng, `dung_tren` chỉ trỏ hàng) → không một dòng nào mang ba cờ ấy.
- AC-6: Given năm lộ trình đời trước không mang trường mới — khuôn `lo-trinh-template.json` ở `9b11cc66` cùng bản phạm vi đợt mẫu của nó, lộ trình kit `docs/plans/lo-trinh-kit.json`, bản chụp `crm-okr`, `crm-kho-tai-lieu`, `oneflow` (bốn cái sau cộng một đợt mới sạch), When chạy răng gốc (`git archive 9b11cc66 scripts lib skills`) và răng mới trên cùng bản phạm vi, Then mã thoát bằng nhau, tập dòng không mở bằng `cảnh báo:` bằng nhau từng chữ, và số dòng răng mới in thêm ở mỗi kho BẰNG kỳ vọng tính độc lập từ dữ liệu của kho ấy — 0 khi kho không có mốc `loai: ngoai` được một hàng trỏ tới, không có `du_lieu`, không có `lap` (in kỳ vọng và thực tế từng kho); và trang lộ trình vẽ từ kho có mốc mang `dot`/`phu`/`ma`/`lap`/`tu_phuc_vu` cùng hàng mang `du_lieu` giống từng byte trang vẽ khi bỏ các trường ấy.
- AC-7: Given `skills/cat-luot/SKILL.md` và hai khuôn (`lo-trinh-template.json`, `pham-vi-template.md`), When đọc các khối của SKILL và chạy NGUYÊN VĂN khối lệnh răng (`CAT-LUOT-RANG`, gốc gói như harness thay), Then khối `CAT-LUOT-VAN-HANH` có năm luật đánh số và đứng TRƯỚC khối sáu luật, mỗi trường răng đọc (`loai: ngoai` · `ai` · `dot` · `phu` · `dung_tren` · `du_lieu` · `sinh-gia` · `gia` · `lap` · `tu_phuc_vu` · `mo_lai_khi`) được khối ấy nêu; khối sáu luật vẫn sáu dòng, luật 2 nói `dung_tren` chỉ trỏ hàng; bảng cờ của SKILL có đúng tập tên bằng danh sách cờ xuất khẩu; khối lệnh răng ra thoát 0 trên kho có mốc ngoài sạch và thoát 1 khi một hàng đứng trên mốc ấy; khuôn lộ trình có ≥ 1 mốc ngoài của đợt mẫu mang `phu` + `ai` + `lap` + `tu_phuc_vu`, ≥ 1 hàng `du_lieu: "sinh-gia"` và ≥ 1 hàng `du_lieu: "gia"` đứng trên nó; bản phạm vi mẫu đọc ra đúng tập mã mà khuôn lộ trình gánh ở cả ba chỗ, và răng trên đợt mẫu ra 0 lỗi, 0 cảnh báo, ≥ 1 dòng bảng phủ «mốc ngoài».
- AC-8: Given khối `CAT-LUOT-CANH-BAO` của SKILL (biểu thức nhận dạng dòng cảnh báo CỦA ĐỢT), When chạy răng trên kho thử có cả cảnh báo của đợt (`duoi-muc-tieu` kèm gợi ý gộp · `tren-muc-tieu` · `chua-uoc-tieu-chi` · `chua-khai-dang-giao` · `van-hanh-lap-chua-tu-phuc-vu`) lẫn cảnh báo ngoài đợt (dòng gom `[<cờ>] <k> hàng ngoài đợt` · «đứng trên mã không có» của hàng ngoài đợt · lệch ngày của hàng ngoài đợt · hàng ngoài đợt thiếu `cau_giao`), Then biểu thức của khối xếp TỪNG dòng `cảnh báo:` của đầu ra đúng loại so với sự thật của kho thử (dòng nói về mục thuộc đợt hay không), mỗi loại ≥ 1 dòng, số dòng được xếp == số dòng `cảnh báo:` (in ra); và câu cũ của SKILL «Dòng `cảnh báo:` nói về hàng ngoài đợt này» không còn ở bản mới (đối chứng dương: câu ấy có ở SKILL tại `9b11cc66`).
- AC-9: Given chỉ SKILL `cat-luot`, khuôn lộ trình, bản phạm vi mẫu trong hồ sơ (dựng từ hai lộ trình crm thật: mã phát triển, việc vận hành một lần và lặp lại, mã cần dữ liệu thật, mã có phạm vi chỉ biết sau một việc vận hành) và bảng đáp án viết trước (`mau/lo-trinh-dap-an.json` — chỗ đúng của từng mã theo phân loại thật của crm), When một giám khảo đối chiếu SKILL với đáp án, Then với TỪNG mã giám khảo chỉ ra bước hoặc khối của SKILL buộc phiên cắt đặt mã ấy đúng chỗ của đáp án (mốc ngoài có `ai` và `dot` · hàng `du_lieu: "gia"` đứng trên hàng `sinh-gia` · chân trời có `mo_lai_khi` nêu mốc · `lap: true` với `tu_phuc_vu` trỏ hàng tự phục vụ hoặc chân trời có phanh tổ chức thứ hai · hàng không đứng trên mốc), và mã nào SKILL im lặng, nước đôi hay dẫn tới chỗ khác thì FAIL; với tình huống «đồng hồ cỡ của kho tiêu thụ nói khác khoảng», giám khảo trả lời theo SKILL: không sửa khối ở kho tiêu thụ, dán số đo của đồng hồ cỡ vào mô tả PR cắt, báo chủ kit; và với một đầu ra răng có dòng `cảnh báo: hàng <mã> [duoi-muc-tieu]: … gộp được với …` cùng một dòng gom ngoài đợt, giám khảo trả lời theo SKILL: dòng đầu là của đợt — gộp, hoặc ghi lý do giữ trong PR; dòng sau ngoài đợt — chép vào PR, không sửa. (judgment)
- AC-10: Given bản phạm vi mẫu `mau/pham-vi-crm.md` và bảng đáp án `mau/lo-trinh-dap-an.json` của AC-9, When chạy răng, Then thoát 0 với 0 dòng `lỗi:` và 0 dòng `cảnh báo:`, bảng phủ đặt đúng 11 mã và có ≥ 1 dòng «mốc ngoài»; bản sao đáp án cho một hàng `gia` đứng trên mốc vận hành thay vì hàng sinh dữ liệu giả → thoát 1 với `[cho-van-hanh]` và `[thieu-hang-sinh-gia]` cho đúng hàng ấy.

## Coverage

Quét bằng `morphological-scan` (preset test-matrix, trục tự dựng; đối tượng = một mã của bản phạm vi ×
chỗ nó rơi × quan hệ phụ thuộc × phạm vi đợt). Chân sản phẩm: luật chủ kho 11/10 `[SUY-TỪ-REPO:
docs/plans/lo-trinh-kit.json]` (hàng S3b) · răng hiện có `[SUY-TỪ-REPO: scripts/cat-luot.mjs]` · số đo
crm `[SUY-TỪ-REPO: _acceptance/lo-trinh-chi-viec-phat-trien/opportunity.md]` · bản chụp lộ trình thật
`[SUY-TỪ-REPO: tests/scripts/fixtures/lo-trinh/crm-kho-tai-lieu.json]`. Chân ngành: `[NGÀNH: Shape Up
(Basecamp) — chu kỳ chỉ nhận việc dựng; việc ngoài dựng không vào chu kỳ]` (lộ trình chỉ việc phát
triển) · `[NGÀNH: Tonic.ai — dữ liệu tổng hợp sinh từ lược đồ dữ liệu thật]` (luật dữ liệu giả 1) ·
`[NGÀNH: SCIM / nhập người dùng hàng loạt của Atlassian Access, Slack]` (vận hành lặp lại → tự phục vụ).

- Trục A — loại mã: phát triển (người dùng thấy · nền) | vận hành một lần | vận hành lặp lại | cần dữ liệu thật | phạm vi chỉ biết sau vận hành  [thước CE: luật chủ kho 11/10 + hai lộ trình crm thật] → AC-1, AC-3, AC-4, AC-9, AC-10. (Mã «không làm» giữ luật cũ của lượt cắt — chân trời có `ly_do` hoặc `da_bac`; không vào vòng này, sổ d-…-9.)
- Trục B — chỗ rơi: hàng | chân trời | mốc ngoài | hai chỗ | không chỗ nào | mốc không phải ngoài  [thước CE: răng phủ hiện có + luật ba chỗ] → AC-1, AC-7
- Trục C — phụ thuộc của hàng: không đứng trên gì | đứng trên hàng phát triển | đứng trên hàng sinh dữ liệu giả (trực tiếp · bắc cầu) | đứng trên mốc ngoài (ma · ten · không dot) | đứng trên mã không có  [thước CE: luật 2 + ca `l5`/`d9`/`d6`] → AC-2, AC-3
- Trục D — phạm vi mục: trong đợt | ngoài đợt | lộ trình đời trước không trường mới  [thước CE: luật 26/09 + luật trong/ngoài đợt của S3] → AC-5, AC-6, AC-8
- Người dùng răng (cross-cutting): phiên cắt đọc SKILL + khuôn → AC-7, AC-8, AC-9, AC-10.
- Later: trang lộ trình tách mốc ngoài · Feature Loop khai nguồn dữ liệu từng tiêu chí (`H-FL-DL`) · bản phạm vi gắn nhãn loại mã · răng kiểm mốc ngoài thiếu ngày.
- Never: răng đoán việc vận hành bằng từ vựng (blacklist trên không gian mở) · răng tự viết lại lộ trình cũ.

## Đường đo

Ngưỡng là `bat_khi` của hàng S3b, chốt ở Cổng Đáng 11/10; đọc ở lượt cắt đầu tiên của crm sau khi
crm cài mốc mang vòng này.

**Giới hạn khai:** răng chỉ chứng HÌNH DẠNG. Trong đợt, `[cho-van-hanh]` và `[thieu-hang-sinh-gia]` là
lỗi — PR cắt không mở được khi răng đỏ — nên «0 dòng cờ trong PR» bằng 0 theo cấu trúc, không bao giờ
đọc ra CHẾT; nó chỉ là điều kiện cần. Ba vế đọc bằng một lần đọc có chiều đỏ ở timebox:

- 0 hàng là việc vận hành của người · số từ: bảng phủ của răng dán trong PR cắt lượt kế của crm (mỗi mã → hàng · chân trời · mốc ngoài) — chủ kho đánh dấu tại Cổng Giá trị mã nào là việc vận hành mà nằm ở hàng; răng KHÔNG đếm được vế này (design §3.2) · AC-1, AC-9, AC-10.
- 0 hàng phát triển đứng chờ mốc vận hành · số từ: tại timebox, danh sách hàng của đợt crm mới chưa có hồ sơ (trạng thái hàng trên trang lộ trình crm, máy in) — chủ kho đánh dấu hàng nào chưa mở được vì chờ việc của người; ngưỡng 0. Đầu ra răng trong PR (0 dòng `[cho-van-hanh]`) là điều kiện cần · AC-2.
- Mọi hàng cần dữ liệu thật có hàng dữ liệu giả đứng trước · số từ: cùng danh sách ở timebox — hàng nào chưa mở được vì chờ dữ liệu thật; cộng danh sách hàng của đợt không khai `du_lieu` (đếm trên tệp lộ trình) để chủ kho soát hàng cần dữ liệu mà không khai · AC-3. Vế «hoặc tiêu chí bỏ qua có tên» đo ở hợp đồng từng vòng — phần Feature Loop, chân trời `H-FL-DL`, chưa có răng.

## Out of scope

- Feature Loop khai nguồn dữ liệu cho TỪNG tiêu chí (giả hay thật; thật → ô bỏ qua có tên trên thẻ) — chân trời `H-FL-DL`, máy M5 giữ Feature Loop.
- Trang lộ trình (`scripts/lo-trinh.mjs`) tách mốc ngoài khỏi mốc phát hành hay thôi đếm mốc vận hành vào «mốc chưa gắn việc» — bộ vẽ mọi kho dùng.
- Cắt lại lộ trình OKR + Kho tài liệu của crm — việc của crm sau khi nhận mốc; cũng là lần đọc ngưỡng.
- Bất biến sản phẩm (`PRODUCT-INVARIANTS.md`) — hàng BB1.
- Răng đoán việc vận hành bằng nghĩa câu.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ca đo: `tests/scripts/lo-trinh.test.mjs` (LT-163 trở đi), chạy bằng `config:executors.test.lo_trinh`
  sẵn có — không thêm khoá executor.
- Bản phạm vi mẫu và bảng đáp án cho AC-9, AC-10: `_acceptance/lo-trinh-chi-viec-phat-trien/mau/pham-vi-crm.md`,
  `mau/lo-trinh-dap-an.json` (đáp án viết trước lượt chấm, từ phân loại thật của crm 11/10).
- Trường mới là của LƯỢT CẮT (cùng loại `dot`, `phu`, `vai`, `tieu_chi`): `du_lieu` ở hàng; `dot`,
  `phu`, `ma`, `lap`, `tu_phuc_vu` ở mốc. Chỉ răng đọc; trang lộ trình và khối dữ liệu không đọc.
- **Con trỏ thay thế (hồ sơ đã ký — KHÔNG sửa hợp đồng của chúng):** AC-7 hồ sơ này thay vế «răng trên
  đợt mẫu 0 lỗi 0 cảnh báo» của AC-9 `vong-la-mot-ket-qua` — ca LT-150 nay gom mã đợt mẫu từ cả mốc
  ngoài (bảng phủ có chỗ thứ ba). Ca LT-130 (`lo-trinh-cat-luot`) in số mã đếm được thay chữ «năm mã»
  (khuôn bản phạm vi nay tám mã); kỳ vọng của nó vốn rút từ khối, không đổi.
- **Known limits (Cổng Bằng chứng sau lượt chấm 2, ký 11/10 — Manh Phan):** Ngoài-1: hướng dẫn cắt lượt lấy
  ví dụ từ chính bản mẫu crm dùng để chấm — giám khảo PASS chưa chứng hướng dẫn dạy được kho khác; phép thử
  thật là lượt cắt kế của crm (Cổng Giá trị) · Ngoài-2: `ai` vắng thì phiên cắt điền tạm «chủ kho», máy
  không nhắc nếu người gộp PR quên sửa · Ngoài-3, Ngoài-6, Ngoài-10, Ngoài-11: vài chiều đỏ ghim chữ luôn
  có trong thông điệp lỗi hoặc chỉ mã thoát — cho biết ca nào hỏng, chưa chắc hỏng đúng lý do · Ngoài-4:
  `mo_lai_khi` của chân trời chỉ được SKILL dặn, răng không kiểm · Ngoài-5, Ngoài-9: mục `dung_tren` để
  trống có thể bị báo là chờ một mốc ngoài không có `ma` — vẫn đỏ, chỉ trỏ sai mốc · Ngoài-7: chữ
  `expected` của E6 tả công thức kỳ vọng khác hàm `kyVongThem` (hôm nay cùng ra 0) · Ngoài-8: `hang` của mốc
  ngoài trong đợt sai kiểu hay trỏ hàng không có chỉ thành cảnh báo mờ, luật ngày bỏ qua mốc ấy.
