---
schema_version: 1
feature: Dải tóm tắt hồ sơ nói đúng trên dữ liệu thật — ô production tách «đã triển khai» (máy suy, khi kho khai nhánh production) khỏi «đã thấy chạy» (người ghi), ô chưa làm đếm đủ giới hạn người đã chọn và gọi đúng tên phần để ngoài phạm vi, ô vì sao không cụt ở câu dẫn và không quá 400 ký tự
slug: dai-tom-tat-doc-dung
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/ho-so-tom-tat.cjs + commands/signoff.md (khối marker) + references lo-trinh-du-lieu.md + test + khoá config tuỳ chọn `production.nhanh` (CỘNG) — không chạm lib/**, hooks/**, lưới trước-gộp
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-12-dai-tom-tat-doc-dung-design.md
status: verified
approved_by: Manh Phan
approved_at: 2026-10-12T02:18:36Z
---

# Acceptance Contract: dai-tom-tat-doc-dung

## Context

Gốc: crm/_acceptance/trang-lo-trinh-trong-crm (LT1, đã lên production 10/10: dải ghi 0 giới hạn trong khi
hợp đồng có 13; vòng LT1b `ngan-ho-so-trong-lo-trinh` hiện nguyên chữ dải nên lỗi sửa ở kit). Phạm vi
production đổi 12/10 theo ràng buộc của phiên điều phối: tách «đã triển khai» khỏi reality, bật theo lựa
chọn của kho (luật 26/09 — kho không khai giữ hành vi cũ). Đo 12/10 trên bản sao crm 27d47de04 vẽ bằng kit 7f65e5a0:
81/81 ô production «chưa ghi quan sát production» kể cả LT1 đã lên 10/10; LT1 «9 mục ngoài hợp đồng · 0
giới hạn đã biết» trong khi hợp đồng ghi 13 giới hạn chủ kho chọn ở Cổng Bằng chứng; 11/81 ô vì sao cụt ở
«:», 31/81 dài hơn 400 ký tự. Khảo sát sáu kho cho thấy cả ba lỗi có ở mọi kho. Khuôn, phương án bỏ,
bảng khảo sát: design doc.

## Criteria

- AC-1: Given kho KHÔNG khai nhánh production và hồ sơ có `decisions.jsonl` không dòng `type: thuc-te`, When dải tóm tắt được dựng (trang hồ sơ và khối dữ liệu lộ trình), Then ô `production` đúng nguyên văn như trước vòng «chưa ghi quan sát production»; thêm một dòng `thuc-te` thì ô đúng câu reality «đã chạy ở production — bản dựng <sha7>, quan sát <ngày>, <người>»; không có `decisions.jsonl` thì ô `null` và tệp vào danh sách thiếu.
- AC-2: Given `## Notes` của hợp đồng có MỘT gạch mở đầu «Known limits — … :» với 13 gạch con và `## Known limits` của báo cáo rỗng, When dựng dải, Then ô `chua_lam` kết bằng «13 giới hạn đã biết» và mục giới hạn của trang hồ sơ liệt kê đúng 13 câu đó nguyên văn, theo thứ tự. Và khi `## Notes` NHẮC giới hạn đã biết ở chỗ bộ đọc không nhận thành gạch giới hạn (giữa câu, gạch con của gạch thường), ô không in «0 giới hạn» mà in «giới hạn đã biết: chưa đọc được — Notes nhắc giới hạn sai khuôn», hoặc thêm «(Notes còn chỗ nhắc giới hạn sai khuôn)» sau số khi đã đọc được ít nhất một giới hạn.
- AC-3: Given ma trận gạch cấp ngoài cùng của `## Notes` viết sẵn trong ca — mỗi dạng mở đầu gặp trên sáu kho (`Known limits`, `**Known limits (…):**`, `Known limits —`, `known-limits (…)`, `**known-limit (…):**`, `Known limit nhỏ`, `Giới hạn đã biết`, `Hạn chế đã biết`, không phân hoa thường; và dạng ĐẦU ĐOẠN — dòng văn, `### …` hay `**…**` mở đầu bằng chữ giới hạn, theo sau là các gạch cấp ngoài cùng) và các gạch KHÔNG phải giới hạn (gạch nhắc «known limits» giữa câu, gạch `Phụ thuộc:`, gạch con của một gạch thường, gạch con «none» hoặc «không có», gạch giới hạn TRƠN mà nội dung chỉ là «none»/«không có») — When đếm, Then số giới hạn bằng đúng số viết sẵn của từng ca, và số ca được in ra.
- AC-4: Given hồ sơ có giới hạn ở CẢ HAI nơi (báo cáo và hợp đồng), When dựng dải, Then số giới hạn bằng số mục của nguồn nhiều hơn (bằng nhau → hợp đồng), không phải tổng, và danh sách trên trang hồ sơ là đúng danh sách của nguồn đó; hồ sơ chỉ có báo cáo thì số và danh sách như trước vòng.
- AC-5: Given hợp đồng có N gạch `## Out of scope`, When dựng dải, Then ô `chua_lam` đúng dạng «N mục để ngoài phạm vi · M giới hạn đã biết» và không chứa «ngoài hợp đồng».
- AC-6: Given đoạn lý do được chọn của ô cơ hội kết bằng «:» — kể cả khi «:» nằm trong dấu nhấn (`…:**`, `**…:**`) — và ngay sau là một danh sách gạch (mục mở bằng cụm in đậm, và mục không in đậm) hoặc một bảng, When dựng dải, Then ô `vi_sao` là câu dẫn rồi các mục nối bằng « · » — mục in đậm lấy cụm in đậm, mục thường lấy câu đầu, hàng bảng lấy ô đầu (bỏ hàng tiêu đề) — và không kết bằng «:» (xét sau khi bỏ dấu nhấn); đoạn kết «:» mà KHÔNG có danh sách theo sau thì ô vẫn là đoạn đó.
- AC-7: Given đoạn lý do dài hơn 400 ký tự (nhiều câu; một câu đơn dài hơn 400; và câu dẫn + danh sách dài hơn 400; cả đoạn đầu `## Context` của hợp đồng khi ô cơ hội vắng), When dựng dải, Then ô `vi_sao` dài tối đa 400 ký tự, kết bằng «…», giữ trọn các câu (hoặc mục danh sách — không mục nào bị cụt, không kết bằng « · …») còn vừa, câu đơn quá trần cắt ở khoảng trắng; đoạn không quá 400 ký tự thì ô giữ nguyên từng ký tự như trước vòng.
- AC-8: Given khối marker `KNOWN-LIMITS-NOTE` trong `commands/signoff.md` (hình dạng gạch mà lối «ghi Known limits» thêm vào `## Notes`), When ca đo rút khối, điền hai giới hạn vào một hợp đồng thử rồi dựng dải, Then ô `chua_lam` đếm đúng 2 giới hạn — bên viết và bên đọc rút từ một chỗ.
- AC-9: Given bản sao crm tại 27d47de04 (clone `--shared` từ kho crm trên máy, đứng ở commit đó, nhánh `onehub` ghim vào chính commit đó — kho crm không bị ghi), When `product-map.mjs --root <bản sao>` của cây đang kiểm vẽ lại `LO-TRINH.html` và khối được đọc bằng `docDuLieu`, Then trong mọi hàng có `tom_tat`: 0 ô `vi_sao` kết bằng «:» (xét sau khi bỏ dấu nhấn cuối), 0 ô `vi_sao` quá 400 ký tự, 0 ô `chua_lam` chứa «ngoài hợp đồng», hàng LT1 có `chua_lam` đúng «9 mục để ngoài phạm vi · 13 giới hạn đã biết»; cấu hình bản sao như kho thật (không khai nhánh) → 81/81 ô production «chưa ghi quan sát production» như trước vòng; bản sao thêm `production: nhanh: onehub` → 0 ô «chưa ghi quan sát» và LT1 production đúng «đã triển khai — gộp vào onehub 2026-10-10; chưa ai ghi đã thấy chạy ở production»; cùng bản sao vẽ bằng kit 7f65e5a0 (bản base `git archive` trọn thư mục) cho lại đúng số đo trước vòng 81 · 11 · 31 · LT1 «9 mục ngoài hợp đồng · 0 giới hạn đã biết» (đối chứng: phép đo phân biệt được hai bản); và tập khoá, kiểu từng khoá của mọi `tom_tat` cùng `phien_ban` của khối vẽ bằng hai bản bằng nhau.
- AC-10: Given tài liệu khối dữ liệu `skills/acceptance/references/lo-trinh-du-lieu.md`, When đọc mô tả ba ô `production`, `chua_lam`, `vi_sao`, Then mô tả khớp hành vi mới (ba câu production theo khai/không khai nhánh và cách khai khoá, hai nguồn giới hạn, cờ nhắc sai khuôn và luật nguồn nhiều hơn, vế để ngoài phạm vi, câu dẫn + danh sách, trần 400) — không câu nào mâu thuẫn mã. Khuôn khối không đổi do AC-9 đo bằng máy. (judgment)
- AC-11: Given kho khai `production:` + `nhanh: main` trong `_acceptance/config.yaml` và hồ sơ không có dòng `thuc-te`, When dựng dải (trang và khối), Then ô `production`: mã đã chấm ở nhánh phụ gộp `--no-ff` vào main ngày 2026-10-10 → «đã triển khai — gộp vào main 2026-10-10; chưa ai ghi đã thấy chạy ở production» (ngày của commit gộp, không phải của mã); mã commit thẳng trên main ngày 2026-10-09 → cùng câu với ngày 2026-10-09; mã chưa gộp → «chưa gộp vào main (nhánh production kho khai)»; có dòng `thuc-te` → câu reality thắng; nhánh khai không tồn tại / mã đã chấm không có trong kho / gốc không phải kho git → «chưa đọc được triển khai ở đây — <lý do có tên>».

## Coverage

Trục (khảo sát sáu kho ở design doc làm thước CE — số hồ sơ thật từng ô trên crm · kit · radar · oneflow · artifact-platform · media-library):

- Ô dải: production (không khai · khai nhánh) · chua_lam (vế để ngoài phạm vi · vế giới hạn · cờ nhắc sai khuôn) · vi_sao → AC-1, AC-11, AC-5, AC-2..AC-4, AC-6, AC-7
- Triển khai theo git: gộp merge · commit thẳng · chưa gộp · reality thắng · không nhánh · mã lạ · không git → AC-11
- Nguồn giới hạn: chỉ báo cáo · chỉ hợp đồng (gạch có con · gạch trơn) · cả hai · không nơi nào → AC-2, AC-3, AC-4
- Dạng giới hạn: tám dạng mở đầu gặp thật + ba dạng đầu đoạn + các dạng không phải giới hạn → AC-3
- Hình đoạn vì sao: ngắn · dài nhiều câu · một câu quá dài · câu dẫn + danh sách (in đậm / thường) · câu dẫn không danh sách → AC-6, AC-7
- Bên viết ↔ bên đọc: khối marker của lối «ghi Known limits» → AC-8
- Dữ liệu thật trước/sau trên bản vẽ crm → AC-9
- Tài liệu cho kho tiêu thụ → AC-10
- Bỏ quét bằng skill: entry `descope` «bỏ coverage-scan — …» trong sổ quyết định (không gian ba ô đã liệt bằng khảo sát dữ liệu thật).

## Out of scope

- Suy «đã thấy chạy» thay người — reality chỉ người ghi (ADR 0020); ô chỉ nói «đã triển khai».
- Đọc triển khai khi mã đã chấm không còn trên nhánh (gộp kiểu squash) — ô nói «chưa đọc được… mã đã chấm không có trong kho» hoặc «chưa gộp», không đoán.
- Đổi tiêu đề mục «Giới hạn và ngoài hợp đồng» của trang hồ sơ — hồ sơ đã ký `trang-ho-so-mot-viec` AC-2 hứa nguyên văn.
- Đổi khuôn khối `lo-trinh-du-lieu` (khoá, kiểu, phiên bản) hay bộ đọc `docDuLieu`.
- So hai câu giới hạn ở hai nguồn có phải một giới hạn hay không.
- Sửa gì trong kho crm hay kho tiêu thụ khác.

## Notes

- CỘNG cần owner phê đích danh ở Cổng Phạm vi: khoá tuỳ chọn `production.nhanh` trong `_acceptance/config.yaml` (kho không khai giữ nguyên hành vi). Kèm nó, mô-đun dải đọc git khi khoá có mặt — trước đây là hàm thuần.
- Hồ sơ đã ký `trang-ho-so-mot-viec` AC-1 ghim «giá trị viết sẵn» của chín ô; ô `chua_lam` viết sẵn «2 mục ngoài hợp đồng · 1 giới hạn đã biết» (`BANG_150`, ca `LT-162`) đổi thành «2 mục để ngoài phạm vi · 1 giới hạn đã biết» kèm chú thích trỏ về đây (AC-5). Quét 12/10 (`grep -rln "mục ngoài hợp đồng" _acceptance/*/contract.md _acceptance/*/evals.yaml tests/`): mọi chỗ khác dùng cụm này theo nghĩa finding Cổng Bằng chứng, không ghim chữ của ô `chua_lam` — 1 lời hứa đã ký bị chạm. Ô production của kho không khai giữ nguyên câu cũ nên AC-5 của hồ sơ ấy không bị chạm. Hai trang mẫu của hồ sơ đã ký `viec-ke-theo-plan` và `trang-lo-trinh-doc-mot-phut` (khối mang dải) vẽ lại cùng lượt — hai hồ sơ ấy ghim lại bằng làn trước khi gộp, như tiền lệ X2.
- Vế 400 ký tự là con số của phép đo LT1b (khớp trung vị crm 364) — sai thì đổi một hằng.
