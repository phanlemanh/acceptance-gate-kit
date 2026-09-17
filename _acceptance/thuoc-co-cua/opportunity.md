---
schema_version: 1
slug: thuoc-co-cua
feature: Thước có cửa — đổi thước trong vòng có tên, có đếm, có trần như «Ngoài hợp đồng» đã có; thêm trục đỉnh-có-sẵn ở S0 (vật trước vòng · tiền đề tách khỏi tiêu chí) để giá trị mới trên vật có sẵn không thành vòng sửa thước mặc áo hợp đồng vật
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Trong tam giác vật · thước · lời, kit canh hai đỉnh và hụt một. Vật có thước làm chứng
và bị trần ba vòng; lời (hợp đồng) có người làm chứng ở Cổng Phạm vi và Cổng Bằng
chứng; **thước** có nhân chứng (chiều đỏ) nhưng **không có cửa**: sửa thước không có
mục riêng trong hồ sơ, không được đếm, không có trần — vì eval là một phần của hợp
đồng nên sửa nó cảm giác như đang thực hiện hợp đồng. «Ngoài hợp đồng» thì có mục
riêng, bộ lọc vùng vật, đường mang sang; sửa thước không có gì.

Giá đo được, phiên «Sửa lỗi tiếng viêt» 16/09/2026 ở crm-onehub (truy nguyên:
`docs/findings/2026-09-16-truy-nguyen-thuoc-khong-co-cua.md`): 8 giờ 25 phút ·
vật 3 tệp +20/−11 · thước (`rang/`) 7 tệp +701/−105 · sổ quyết định 5/7 dòng về thước
ghi cùng `type: fix` với dòng vật · 9 chỗ hỏng thước, 1 chỗ hỏng vật · 9 lượt gọi
người, trong đó 4 về hạ tầng đo. Phanh hiện có hụt đúng chỗ này: dừng-vá đếm theo
từng chân từng lớp nên chín chỗ hỏng là «chín lớp»; trần ba vòng đếm lượt chấm nên
140 lượt gọi sửa giàn trước lượt chấm đầu không đếm; Known limits là lối ra nhưng chỉ
mở khi phanh nổ. Cùng lúc, `start-scan` in «viết code (S3)» cho một vòng mà vật đã ở
nhánh gốc từ 04/09 — ba hồ sơ khác ở crm đang hiện đúng dòng đó.

Người trả giá: máy ở mọi vòng có vật có sẵn (tường ở S4 thay vì S1), owner ở mỗi câu
hỏi hạ tầng máy tự chèn, và người dùng kit ở repo mới — chi phí nhận repo ẩn trong
từng vòng thay vì lộ ở lúc nhận. Đo trên sáu repo tiêu thụ theo luật chặt (eval có
`expected_exit`/`not-run` hoặc Known limits có nội dung): crm 6/37 · oneflow 8/40 ·
media-library 8/23 · artifact-platform 1/192 · mapposter 1/15 · floorplanstudio 0/5
— tường không tương quan với xuất xứ repo, tương quan với «app có máy trạng thái mà
thước không có đường vào».

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Nguồn tường chính trên app có máy trạng thái là thước không đứng được, không phải vật sai — nên đưa tiền đề lên trước Cổng Phạm vi là chặn được phần lớn | tường thật nằm ở vật, dry-run tiền đề chỉ dời chi phí sớm hơn mà không giảm | số R1: entry «tiền đề dry-run: n/m» và số chỗ hỏng thước ở S4 | chờ R1 |
| 2 | Chỉ đếm sửa thước khi hợp đồng ở `implemented` là tách được TDD (thước sinh cùng vật ở S3) khỏi sửa-thước-vì-không-đứng-được | vòng TDD bị đếm oan, trần nổ sai chỗ | chạy luật đếm trên ba vòng đã ký gần nhất của kho kit: nhát «thước» ở S3 không bị đếm | chưa thử |
| 3 | Sự thật git (vật đã ở nhánh gốc ∧ kế hoạch không chạm đường dẫn sản phẩm) đủ chặn ca `cua-vao` mà không cần tin dòng văn nào | vẫn phải tin văn «giá trị mới» → điền-cho-có, làn V không ai đọc | fixture bốn hồ sơ crm (một xếp lại, ba treo) + một hồ sơ greenfield: đỏ đúng bốn, im đúng một | chưa thử |
| 4 | Lối «mở vòng có chủ ngữ là thước» chỉ tốn một lệnh thì máy chọn nó thay vì vá tại chỗ | máy vẫn vá tại chỗ vì lối kia có ma sát ẩn (hồ sơ mới, cổng mới) | đo ở vòng sau khi lối tồn tại; chưa có phép thử rẻ | chưa có |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] trên một vòng có vật có sẵn, tường có bị bắt
  TRƯỚC Cổng Phạm vi không, và sửa thước trong S4 có hiện thành số trong gói Cổng
  Bằng chứng không?
- Kết quả nào là SỐNG: [đề xuất] R1 có entry «tiền đề dry-run: n/m đứng được» trước
  Cổng Phạm vi; nhát «thước:» ở S4 đếm được và gói Cổng Bằng chứng có dòng vật/thước;
  sau một cửa sổ, số hồ sơ khai giới hạn theo luật chặt ở crm và oneflow không tăng.
- Kết quả nào là CHẾT: [đề xuất] thêm lượt gọi người ngoài thiết kế ở bất kỳ vòng
  nào; phép kiểm sự-thật-git chặn một vòng greenfield (đặc hiệu hỏng); dòng thước
  tăng mà số hồ sơ khai giới hạn không giảm sau một cửa sổ; cần lệnh cổng người mới.
- Timebox: [đề xuất] một cửa sổ phát hành.

## Kết quả prototype

Chưa dựng. Vật liệu sống: `scripts/lan-do/tien-de.mjs` của crm-onehub (tiền đề
đặt-trước-dọn-sau, trả nguyên mã của lệnh răng, mã 2 khi hỏng tiền đề) — repo tự
mọc đúng khuôn đường đo cấp repo mà kit chưa đặt tên. R1 ở oneflow là lượt thử bằng
tay: hai mục hợp đồng và một luật ghi sổ, không đổi kit.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Khuôn tiền đề đặt/trả, mã 2 khi hỏng tiền đề | crm-onehub `scripts/lan-do/tien-de.mjs` (repo tiêu thụ, 09/2026) | triết-lý/logic — khuôn giao diện của một mục đường đo | có (khuôn), code ở repo | — |
| Luật → trường hợp đồng → lint (Out of scope ↔ W3 · Mobile backend target ↔ W5 · Known limits ↔ lưới xanh-sạch) | kit `scripts/eval-coverage-lint.js`, `scripts/pre-merge-check.sh` | triết-lý/logic — cùng khuôn cho ①② | có | — |
| SHA của bản triển khai qua API deployments (Preview mỗi PR) | crm-onehub trên Vercel, đọc bằng `gh api repos/…/deployments` | hạ tầng — cho nhát hoãn «đích đo là bản triển khai» | hoãn, có tên | — |
| Chốt trước · nhân chứng đối kháng · đổi-có-giá-có-vết | cơ chế xã hội (đăng ký trước thử nghiệm, change order, sổ cái không xoá) | triết-lý | có, làm nền lập luận | — |

## Cổng 0

- **decision = …**
- **Owner 16/09 chốt R** (`docs/findings/2026-09-15-dieu-chinh-sau-2-14-token-va-vong-meta.md`):
  cửa sổ 2.14 → 2.15 không vòng meta mới. Ô này **không nhảy hàng**: nó chờ số từ R1
  (OneFlow `skill-system-v1`, thử ① và ② bằng tay) và một phiên quan sát độc lập ghi
  số vào mục dưới. Owner đã phê 16/09: mở ô này, hai nhát nhỏ đi riêng (chip
  `start-scan` vá-trong-mốc `release-2-15-0`; chip `ve-that.json` ở crm).
- **Điều kiện mở** (nhân chứng độc lập điền sau R1, không phải phiên chạy R1): nhát
  sửa thước S4 ≥ 3 *hoặc* tiền đề dry-run bắt ≥ 1 tường trước Cổng Phạm vi → «có căn
  cứ xếp hàng ở 2.15 → 2.16, cạnh router/token theo luật R»; cả hai bằng 0 → «park —
  bài riêng của cua-vao». **Số R1 (nhân chứng độc lập đọc 17/09 tại HEAD `7a6bfa8`,
  hợp đồng `verified`, Cổng Bằng chứng chưa ký — nguồn từng số:
  `docs/findings/2026-09-17-quan-sat-r1-ba-dinh.md`):** tiền đề dry-run 8/10 đứng
  được, **bắt 2 tường trước Cổng 1** (TD-8 một phần · TD-10, entry
  `d-20260916T115631Z-10`); nhát sửa thước S4 **3 theo tiền tố «thước:»** (entry
  `-17`, `-19`, `-21`), 5 theo tệp chạm; dòng S4 thước +121/−22 so vật +24/−9; dòng
  4b 2,7 % ở lượt cuối · 9,5 % gộp bốn lượt; lượt gọi người 7 đã xảy ra + 1 chờ, ngoài
  thiết kế 5 (hạ tầng 4). Cả hai vế đều vượt ngưỡng → **«có căn cứ xếp hàng ở
  2.15 → 2.16, cạnh router/token theo luật R»**. Số của một vòng, chưa nói xu hướng;
  nhân chứng không khuyến nghị nhát nào.
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** chép từ bullet `[đề xuất]` sau khi người gỡ tiền tố.

## Thước đo thành công → ứng viên criterion

- `## Vật trước vòng` và `## Tiền đề` có trong khuôn hợp đồng; W9 đỏ khi vật đã ở nhánh
  gốc ∧ kế hoạch không chạm đường dẫn sản phẩm, im với hồ sơ greenfield; W10 đỏ khi
  tiền đề trỏ mục đường đo không tồn tại.
- `start-scan` xếp hồ sơ `approved` có `verified_commit` là tổ tiên của HEAD vào nhóm
  «vật đã ở nhánh gốc» — không in «viết code»; ba ca: tổ tiên → nhóm mới · không bằng
  chứng → như cũ · commit trên nhánh không merge → như cũ. (Đi trước bằng chip
  vá-trong-mốc; ô này chỉ giữ tiêu chí để đối chiếu.)
- Sổ quyết định gắn `target` suy từ đường dẫn diff; gói Cổng Bằng chứng có một dòng
  vật/thước/nhát; trần gộp nhát sửa thước ở `implemented` → dừng với ba lối; lối «mở
  vòng có chủ ngữ là thước» là một lệnh.
- Diff `rang/` giữa hai lượt chấm do script liệt kê — không đưa làn phản bác soi hồ sơ.
- Khuôn giao diện đường đo cấp repo: `--chay`, mã 2 khi hỏng tiền đề, đặt/trả, DB của
  lượt, máy chủ tự xưng cây và SHA — răng từ chối đo khi máy chủ trỏ cây khác.
- **Tài nguyên của lượt** (owner phê 17/09, mở rộng ④): mỗi eval khai tài nguyên nó
  cần — máy chủ · thư mục build · DB · cổng — và làn chấm tách riêng hoặc xếp hàng theo
  tài nguyên, không chạy chung. Bằng chứng lớp lặp ở ba repo: oneflow R1 (E14 đỏ hai
  lượt vì máy chủ không lên kịp dưới tải làn ui; bộ test đỏ vì hai lượt cùng dựng vào
  một thư mục build của SDK; config khai sẵn «build và typecheck đua nhau») · crm (các
  chân giẫm trạng thái của nhau khi chạy song song; hai lệnh cổng đua cây build) ·
  artifact-platform (bài học radar-m1). Hai chiều: hai eval khai cùng tài nguyên → làn
  xếp hàng, cả hai xanh; bỏ lời khai trong bản sao → ca đỏ đúng tên tài nguyên. Không
  có nó, ① và ④ gỡ được tường trước cổng mà S4 vẫn tự dựng tường mới bằng cách chạy đè.

## Out of scope từ khám phá

- Chế độ «brownfield» riêng trong kit — bác: đem bối cảnh repo vào engine; nó là một
  hàng của trục đỉnh-có-sẵn.
- Đích đo là bản triển khai (`config.targets`, ghim SHA tự xưng) — hoãn có tên cho
  cửa sổ kế: CỘNG lớn nhất, chỉ có giá trị với repo có preview deploy, chỉ cho tiêu
  chí đọc.
- Cờ «vòng meta trên repo tiêu thụ» theo `scripts/` — bác: mơ hồ theo repo, phần lớn
  vòng meta ở crm là cần thiết; hạt giống «vòng meta đang mở: N» (finding 15/09 §4)
  đã phủ.
- Làn phản bác (LLM) soi diff `rang/` — bác: phá lại nhát vùng-vật 14/09; dùng script.
- `acceptance-init` dò cổng chắn của app bằng LLM làm bất biến — bác: lời dặn có
  checklist; giữ ở mức advisory, bất biến máy giữ là W10.
- Đếm dòng thước so với dòng vật làm trần — bác: sai với vòng TDD; đếm nhát ở
  `implemented`.
- Trạng thái `park` cho *vòng* (không chỉ cho ô) — ngoài ô này nhưng là nguyên thuỷ
  thiếu ở mắt xích 06/09; ghi nhận, chưa xếp hàng.
- Thêm cổng người — không (ADR 0002).
