---
schema_version: 1
feature: Khung đợt mở bằng định vị và đếm đủ mọi câu đang chờ chủ kho — chủ kho ngủ dậy hay đổi máy đọc một khung là biết đợt đang ở đâu và đang chờ mình điều gì
slug: khung-dot-dinh-vi
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, ui]
status: verified
design_doc: docs/superpowers/specs/2026-10-28-khung-dot-dinh-vi-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-28T07:46:53Z
---

# Acceptance Contract: khung-dot-dinh-vi

## Context

ADR 0027 bước (a) và (b), mở sau khi vòng `vung-giao-viec-tu-cat-luot` gộp (4918210d, 28/10). Ô cơ hội đã qua Cổng
Đáng (build, 28/10), neo `Gốc:` vào hồ sơ `trang-thai-dot-dieu-phoi-tho` — hồ sơ đã dựng dải và pane đang hỏng. Hai lỗ:
(a) câu phiên giám sát hỏi chủ kho trong chat không vào sổ nào, nên dải báo «cần anh 0» khi chủ kho đang có việc;
(b) pane «Đợt» in chữ gỡ lỗi của lệnh `xem` — không mục tiêu, không tiến độ, mã trần, giờ UTC có mili-giây. Dòng `xem`
giữ nguyên cho máy đọc; kho không có giám sát đặt câu trong chat thì dải, `xem` và `xem --json` không đổi.

## Criteria

- **AC-1** — Given một đợt đang chạy, When phiên giám sát ghi một câu chờ chủ kho bằng lệnh `hoi` (câu trong đối số hay từ stdin), Then sổ sự kiện có đúng một dòng kiểu `hoi-chu-kho` mang mã câu, câu, phiên và `can_phan:false`, lệnh in mã câu; chính lệnh lọc của Monitor giám sát chạy trên sổ ấy không lọt dòng đó (đối chứng: một dòng `cho-nguoi` của bộ phát lịch lọt đúng một); câu rỗng thì thoát 2 và không ghi byte nào.
- **AC-2** — Given một câu đang mở, When giám sát chạy `hoi-xong <mã>`, Then sổ có một dòng `hoi-chu-kho-xong` cùng mã và câu ấy thôi được đếm; mã chưa từng có hay đã đóng thì thoát 2 nêu mã, không ghi byte nào.
- **AC-3** — Given sổ của đợt còn câu treo của giám sát, When khung đọc `xem --json`, Then dải báo «cần anh» và khung báo «CẦN ANH» cộng cả câu treo vào số tệp chờ người của thợ và lời báo sức khoẻ máy, hai số bằng nhau vì cùng một hàm đếm, và mỗi câu treo hiện tuổi của nó tính từ lúc ghi («3 giờ trước»); khung đếm 0 khi sổ còn câu treo, hay câu treo không có tuổi, thì bộ đo ĐỎ với thông điệp ghim.
- **AC-4** — Given một thư mục đợt không có câu nào của giám sát — kể cả đợt có lộ trình, hàng mang mã và hàng đã gộp — When `xem`, `xem --json` và dải chạy bằng bản trên nhánh chính hiện nay và bằng bản mới, Then ba đầu ra bằng nhau từng byte; dữ liệu riêng của khung (tên việc, mục tiêu, số hàng đã gộp) chỉ đi qua cờ mới `xem --json --khung` mà mod gọi.
- **AC-5** — Given một đợt đang chạy, When pane «Đợt» mở, Then nó vẽ khung định vị — không vẽ chữ `xem` — mở đầu theo đúng thứ tự: tên đợt và mục tiêu đợt, dòng tiến độ, khối «CẦN ANH: n», rồi mỗi dãy một dòng việc; Sẽ KHÔNG in khe máy (`khoá s4:…`), giá trị trạng thái không dấu hay tên khoá JSON — kể cả trong cờ vàng.
- **AC-6** — Given hàng thi công mang mã có trong tệp lộ trình, When khung vẽ dòng việc và dòng «là gì» của khối CẦN ANH, Then mỗi việc mang tên ngắn từ tệp lộ trình (tên ngắn, rồi tên, rồi sáu từ đầu của câu giao) với mã đứng sau trong ngoặc, tra được trên tệp lộ trình thật của kho; hàng không tra được tên hiện kèm cờ «chưa có tên trong lộ trình»; dòng «là gì» chỉ có mã trần thì bộ đo ĐỎ với thông điệp ghim.
- **AC-7** — Given mốc giờ trong trạng thái đợt và độ lệch múi giờ của máy, When khung vẽ, Then mọi giờ là giờ địa phương tương đối («n phút trước», «n giờ trước») hay `HH:MM` địa phương; Sẽ KHÔNG in chuỗi ISO, mili-giây hay chữ «Z».
- **AC-8** — Given một đợt có dãy đang chấm, đang chờ (lượt, người, đã ký chờ gộp, phụ thuộc), rảnh và đang làm, When khung vẽ dòng tiến độ, Then «xong» bằng số hàng đã gộp trên tổng hàng của đợt và mỗi dãy không nghỉ nằm trong đúng một nhóm «đang làm · đang chấm · chờ · rảnh», tổng các nhóm bằng số dãy không nghỉ.
- **AC-9** — Given một kho cũ thiếu trường mới — `hang-viec.json` không `muc_tieu`, trạng thái không `gop_da_bao`, `xem --json` của bản trước không có tên việc hay câu giám sát — When khung vẽ, Then khung vẫn vẽ đủ các khối, mỗi chỗ thiếu mang cờ vàng trên đúng dòng của nó, không ném; `muc_tieu` sai kiểu thì kiểm khuôn `hang-viec.json` báo lỗi nêu tên trường.
- **AC-10** — Given giám sát mới nhận vai đọc chỉ dẫn của gói (lệnh tiếp tục đợt và README), When nó hỏi chủ kho một câu trong chat rồi chủ kho trả lời, Then chỉ dẫn nói đủ: ghi câu bằng `hoi` trước khi kết lượt, đóng bằng `hoi-xong` khi chủ kho đã trả lời, không dùng kiểu sự kiện `can_phan:true` cho câu của chính mình, và khai mục tiêu đợt khi mở đợt. (judgment)

## Coverage

- Trục A — nguồn của một việc chờ chủ kho: tệp chờ người của thợ · yêu cầu `can-nguoi` · sức khoẻ máy · câu giám sát trong chat (AC-1, AC-3). [thước CE: §2 design doc — mỗi nguồn một mục của `canAnh`]
- Trục B — vòng đời câu giám sát: ghi · đếm · đóng · mã lạ · đóng hai lần · quên đóng (báo dư, có tuổi câu) (AC-1, AC-2, AC-3).
- Trục C — khối của khung: mục tiêu · tiến độ · CẦN ANH · việc · giờ (AC-5, AC-6, AC-7, AC-8).
- Trục D — kho: có giám sát đặt câu · không có (byte bằng nhau) · kho cũ thiếu trường mới (AC-3, AC-4, AC-9).
- Trục E — chiều: bắt (AC-3, AC-6 ca đỏ) · im (AC-1 Monitor, AC-4 vi phân) · cờ vàng không chặn (AC-6, AC-9).
- Later: khối định vị trên lời mời cổng, tác động mỗi lối, dự đoán kín, ký theo chính sách (ADR 0027 (c)–(f)); hook tự ghi câu giám sát khi kết lượt (giới hạn khai ở Notes). Never: tự đóng câu theo lúc chủ kho gõ (sổ quyết định).

## Đường đo

- Phát lại ca 28/10: khung báo «CẦN ANH: 1» kèm câu và phiên giám sát — số từ ca đo của AC-3 (CLI thật trên kho thử dựng từ fixture đợt crm).
- 0 dòng «là gì» chỉ có mã trên khung của fixture đợt crm — số từ ca đo của AC-6.
- Đợt thật đầu tiên chạy bản mang vòng: 0 lần dải báo «cần anh 0» khi sổ còn câu treo — đếm từ sổ sự kiện của đợt (dòng `hoi-chu-kho` chưa có `hoi-chu-kho-xong` theo thời gian) đối chiếu ảnh dải chủ kho chụp; không mã mới, đọc ở Cổng Giá trị.
- 0 lần chủ kho hỏi giám sát «còn chờ anh gì» — đếm tay trên phiên giám sát của đợt thật; không mã mới.
- Chết nếu Monitor thức vì câu của giám sát (AC-1) hay `xem` đổi một byte ở kho không có câu (AC-4).
- Chết nếu phải thêm một cổng người hay một lượt gọi người: vòng không thêm cổng nào (AC-10 chỉ dặn giám sát ghi câu nó vốn đã hỏi); số lượt gọi người của vòng và của đợt thật đếm tay theo luật (c), ba dòng đầu của hồ sơ mốc.

## Out of scope

- Lời mời cổng, thẻ Cổng Đáng, tác động mỗi lối, dự đoán kín, ký theo chính sách — bước (c)–(f) của ADR 0027, đi sau mốc kế tiếp được một kho tiêu thụ nhận.
- Không đổi dòng `xem`, bảng đợt `bang.html`, chẩn đoán `chan-doan` hay kế hoạch `tiep-tuc` (đọc câu giám sát ở đó là việc sau).
- Không tự đóng câu giám sát theo lúc chủ kho gõ vào phiên giám sát (lịch 30′ và tin liên phiên cũng gõ vào phiên ấy).
- Không thêm hook ghi câu giám sát tự động — giới hạn khai ở Notes.

## Notes

Ca đo: `tests/dieu-phoi/khung-dinh-vi.test.mjs` (KD-…) — kho thử do code sinh từ fixture `dot-crm-0910` như
`khung.test.mjs`; ca đỏ tiêm vào bản sao trọn thư mục `dieu-phoi` sau khi bản lành xanh trên cùng fixture, ghim thông
điệp. Ca mod: `tests/dieu-phoi/mod/khung.test.ts` (chạy qua `kiem-khung.mjs`, cần CLI `claude`).

Giới hạn khai: việc giám sát GỌI `hoi` khi hỏi trong chat là chỉ dẫn, không có máy giữ. Ngưỡng mở vòng hook: ≥1 lần
trên đợt thật chủ kho thấy dải báo thiếu một câu giám sát đã hỏi. Giới hạn kế thừa từ hồ sơ
`trang-thai-dot-dieu-phoi-tho`: chưa ai nhìn thấy pane trên app desktop; `plugin test` dựng cây phần tử, không chụp hình.
