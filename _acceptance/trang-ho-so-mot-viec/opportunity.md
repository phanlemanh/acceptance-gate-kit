---
schema_version: 1
slug: trang-ho-so-mot-viec
feature: "«Mỗi việc đã giao có một trang hồ sơ đọc trong một phút: vì sao làm, hứa gì, quyết gì, tốn gì, giao gì, có ăn thua không»"
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-10T23:31:24Z   # owner gõ «Làm» một chạm trong phiên 11/10, máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: X2
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

> Mở 11/10 từ hàng X2 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`)
> bằng `node scripts/lo-trinh.mjs --root . --hang X2 --mo-o --slug trang-ho-so-mot-viec` (slug suy
> tất định từ câu giao là `moi-viec-da-giao-co-mot` — máy đặt slug ngắn hơn, đảo được). Hàng đứng
> trên X1 (khối dữ liệu lộ trình bản 1, đã gộp).

## Vấn đề & ai gặp

Gốc: crm/_acceptance/trang-lo-trinh-trong-crm — `contract.md` dòng 73, mục «Out of scope» của LT1: «Hiện dòng lệnh mở việc trong Claude Code, hiện hồ sơ nghiệm thu của việc» là KHÔNG làm.

**Người gặp:** chủ kho, ở phiên nghiệm thu và lúc xem lộ trình — 10/10 muốn mở một việc ra xem
như màn chi tiết Thoả thuận trong CRM. Qua chủ kho là **phiên Claude Code**: hôm nay mọi câu
«việc này vì sao làm, đã quyết gì, tốn bao nhiêu, có ăn thua không» đều phải hỏi máy, máy đọc hàng
chục tệp rồi soạn lại — tốn token, và câu trả lời là lời máy soạn chứ không phải vật.

**Đo 11/10 trên hồ sơ thật** (`crm` `origin/onehub` `10063a25e`, hồ sơ LT1 đã ký 10/10):

| Phép đo | Kết quả |
|---|---|
| Cỡ hồ sơ | 71 tệp (cả ảnh chụp, hình, khuôn đo) · `run-log.jsonl` 130 dòng · `evals.yaml` 337 dòng |
| Sổ quyết định | 42 dòng: **26 máy** (S1–S4) · **16 người** (`decided_by: Manh Phan`, ở Cổng Bằng chứng) |
| Lượt chấm | 3 lượt · **140.353 token đầu ra** (61.782 · 47.602 · 30.969) · 97 tác tử · 2 lượt ghim lại |
| Hợp đồng | 14 tiêu chí · 9 mục ngoài hợp đồng · có mục «Đường đo» |
| Trang bằng chứng hiện có (`scripts/evidence-page.js`) chạy trên hồ sơ này | chạy được, 29,7 KB. Có: tiêu đề, bảng eval, chi tiết từng eval, eval không phân biệt, các lượt. **Không có**: vì sao làm · quyết định · tốn gì · giới hạn và ngoài hợp đồng · giao gì (PR, mã, ngày) · có ăn thua không. Tiêu đề in câu giao **còn nguyên «»** |
| Khối dữ liệu lộ trình bản 1 (X1) | mỗi hàng chở mã, câu giao, trạng thái, hồ sơ, `bat_khi`, `vi_sao` — **không có dải tóm tắt nào của hồ sơ**. Bộ đọc bản 1 (crm đang chép) gặp bản mới hơn thì «đọc phần biết» + một cảnh báo — chiều tới đã có; chiều lùi (bộ đọc mới gặp trang cũ) chưa có |
| Câu giao bọc «» | kit 27/27 hàng · crm 111/117 hàng ở ba lộ trình. **12 hàng crm có «» bên TRONG câu** (vd `««Đã lưu trữ» ở Cài đặt › …»`, `«Tách «Đang theo dõi» khỏi tab «Của tôi» của OKR»`) — cả 12 đều có cặp ngoài cùng bao trọn câu; luật «bỏ đúng một cặp» phải xét cặp, không phải xét ký tự đầu-cuối (`«A» và «B»` bắt đầu và kết thúc bằng dấu nhưng không bọc) |
| Nguồn cho ô «đã lên production» và «có ăn thua» | đã có vật: trạng thái `da-cham-boi-thuc-te` + dòng sổ do thao tác người `observed` ghi (ADR 0020) · `uat-session.md` của phiên nghiệm thu (15 hồ sơ kit có) |

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Mọi ô của trang và của dải rút được từ vật đã có trong hồ sơ (hợp đồng, sổ quyết định, nhật ký lượt chấm, báo cáo token, phiên nghiệm thu, dòng quan sát prod) — không ô nào cần máy soạn | trang thành nơi máy viết văn → tốn token, trái «kit render, không soạn» | dựng tay bảng ô → tệp nguồn trên hồ sơ LT1 | **Đã thử** trong bảng đo trên: mọi ô có nguồn, trừ «số lần gọi người» — bỏ khỏi khuôn |
| 2 | Hồ sơ cũ thiếu tệp (không `usage-report`, không `decisions`, sổ đời trước ghi `impact` thay `cost_if_wrong`) vẫn ra trang, ô thiếu hiện «chưa có» có tên | một kho cũ mở trang thì vỡ hoặc im — mọi kho trả giá (luật 26/09) | chạy bộ vẽ trên mọi hồ sơ kit + crm đang có trên máy | Chưa thử — đo trong vòng |
| 3 | Thêm khoá vào khối dữ liệu (bản 2) không đổi gì ở chỗ bản chiếu crm đang đọc | trang Lộ trình trong CRM đổi hiển thị mà crm không đổi vật | bản chép rời bộ đọc bản 1 đọc trang bản 2, so phần biết | Chưa thử — chiều tới đã có cảnh báo «đọc phần biết» |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: chủ kho mở trang hồ sơ của một việc đã giao và trả lời được sáu câu — vì sao làm · hứa gì · quyết gì · tốn gì · giao gì · có ăn thua không — trong ≤ 1 phút, không hỏi máy?
- Kết quả nào là SỐNG: ở phiên nghiệm thu kế, trên ≥ 2 hồ sơ thật đã ký (một kit, một crm — LT1), chủ kho đọc xong mỗi trang trong ≤ 1 phút và không phải hỏi máy câu nào trong sáu câu.
- Kết quả nào là CHẾT: chủ kho phải hỏi máy ≥ 1 trong sáu câu trên cả hai hồ sơ, hoặc đọc quá 2 phút mỗi trang — trang không thay được việc hỏi máy.
- Timebox: 2026-11-01 (mốc kế sau đợt thử, cùng S3 · DP6 · L3 — hàng đã gắn mốc này); không cắt mốc trong vòng này.

## Kết quả prototype

Không dựng prototype — trang vẽ từ vật, bản mẫu bấm được sẽ dựng ở nghi thức thiết kế (S1-D) trên
chính hồ sơ LT1 làm dữ liệu.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Hồ sơ LT1 làm dữ liệu thử | `crm` `10063a25e:_acceptance/trang-lo-trinh-trong-crm/` | dữ liệu đo | có — chỉ đọc, bộ kiểm dựng bản sao do mã sinh theo hình dạng của nó, không chép tệp crm vào kit | — |
| Màn chi tiết Thoả thuận của CRM | ý chủ kho 10/10 | khuôn bố cục (dải trên + mục gập) | có — chỉ bố cục | — |
| Trang bằng chứng hiện có | `scripts/evidence-page.js` | mã của kit | có — mở rộng, không dựng trang thứ ba | — |

## Cổng 0

- **decision = build** (hạng T2) — owner gõ «Làm» 11/10 trên khuyến nghị bên dưới. Căn cứ: bảng «Đo 11/10 trên hồ sơ thật» (sáu câu chủ kho hỏi đều chưa có trên trang bằng chứng), giả định 1 đã thử; CỘNG đã được chủ kho đồng ý 10/10 — chữ ký này là chữ ký đích danh của luật CỘNG.
- **disposition = …** Căn cứ: — (không prototype)
- **Ngưỡng UAT chốt cùng lúc ký:** bốn dòng của mục «Ngưỡng chết / ngưỡng UAT» — tiền tố đề xuất gỡ cùng chữ «Làm».

**Máy khuyến nghị lúc mời ký (owner chọn đúng lối này):** `build`, hạng **T2**, **một vòng**. Hạng: vật chỉ chạm `scripts/evidence-page.js`,
`scripts/lo-trinh.mjs`, tài liệu và khuôn mẫu hàng — không chạm `lib/**`, `hooks/**` hay cổng chặn
gộp (bộ vẽ chỉ ĐỌC hai bộ đọc dùng chung ở `lib`). Cỡ: dự kiến 12 tiêu chí (bảng dưới) — sát trần
chính sách 10/10; S1 vượt 13 thì máy tự tách «khối dữ liệu bản 2 + dấu «»» thành vòng hai, không
hỏi lại. CỘNG: chủ kho đã đồng ý 10/10 — chữ ký ở đây là chữ ký đích danh của luật CỘNG.

## Thước đo thành công → ứng viên criterion

Trang hồ sơ (mở rộng trang bằng chứng):

1. Dải một phút trên đầu trang, tầng mọi người: đã giao gì · vì sao · trạng thái + ngày · đã lên production chưa · đo gì, khi nào · kết quả · chưa làm gì · ai quyết — mỗi ô rút từ một tệp có tên.
2. Mục gập «vì sao · đã hứa (tiêu chí) · thiết kế · giới hạn + ngoài hợp đồng» chép nguyên văn từ hồ sơ.
3. Quyết định: dòng thời gian, lọc máy / người; trên LT1 ra đúng 42 = 26 + 16.
4. Bằng chứng (phần trang cũ giữ nguyên thành một mục) + tài nguyên từng lượt chấm: LT1 ra 3 lượt, 140.353 token.
5. Giao (PR, mã commit, ngày) + giá trị (ngưỡng đã khai cạnh số đo; chưa có phiên nghiệm thu → «chưa đo», không im).
6. Hồ sơ thiếu tệp ra ô «chưa có <gì>» có tên, không vỡ; vẽ hai lần ra cùng byte; 0 lời gọi model.

Khối dữ liệu bản 2:

7. Mỗi hàng có hồ sơ mang dải tóm tắt hai tầng (mọi người · chủ kho: tiêu chí/phép đo · lượt chấm · token · quyết định máy/người · PR + mã); không có ô «số lần gọi người».
8. Bộ đọc mới đọc trang bản 1 (đường đọc-cũ, cờ vàng có tên); bản chép rời bộ đọc bản 1 đọc trang bản 2 ra đúng phần biết.
9. Tài liệu cho kho tiêu thụ khớp bảng khoá bản 2 (cùng ca so hai bên như bản 1).

Dấu «» quanh câu giao:

10. Bỏ đúng một cặp ngoài cùng bao trọn câu, ở bộ vẽ và trường tiêu đề của khối — ma trận: bọc trọn · «A» và «B» (không bọc) · ««A» b» · không bọc · chỉ «» · rỗng; 12 hàng crm có «» bên trong ra đúng.
11. Khuôn mẫu hàng mới thôi thêm «»; tệp kế hoạch của kho không bị đụng.
12. (judgment / nhìn) Trên hồ sơ LT1 thật, trang trả lời được sáu câu trong một màn đọc.

## Out of scope từ khám phá

- **Ô «số lần gọi người»** — chưa có máy đếm; thêm ô là máy soạn số. Mở lại khi có bộ đếm lượt gọi người trong vật.
- **Sửa tệp kế hoạch của kho để bỏ «»** (kit 27 hàng, crm 111 hàng) — dữ liệu của kho, bộ đọc nhận cả hai dạng.
- **Bản chiếu trang hồ sơ trong CRM** — hàng LT1b của crm, vòng riêng bên crm sau khi crm nhận mốc mang X2.
- **Trang thứ ba / máy chủ / gọi model để tóm tắt** — trái «kit render, không soạn».
- **Lệnh mở ô ghi «Vì sao: Gốc: …» làm dòng `Gốc:` không đứng đầu dòng** (gặp lần hai, sau R1) — hạt giống, không vào vòng này.
