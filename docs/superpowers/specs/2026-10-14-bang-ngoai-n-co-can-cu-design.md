# Thẻ Cổng 2: mục Ngoài-n thành bảng có cột «Căn cứ» — thiết kế

Ngày 14/10/2026 · slug `bang-ngoai-n-co-can-cu` · hạng T3 (chạm `lib/out-of-contract.cjs`) · CỘNG — chủ kho gọi tên
vòng 14/10 («Mở ô và thực hiện») trên hạt giống `docs/plans/2026-10-14-hat-giong-bang-ngoai-n-co-can-cu.md`.
Gốc: crm/_acceptance/kanban-viec — phiên crm tự soạn tay bảng Mục · Người dùng gặp gì · Đề xuất · Căn cứ cho 10 mục
Ngoài-n ở Cổng Bằng chứng; phần căn cứ không có trong hồ sơ.

## 1. Vấn đề

Người ký Cổng 2 nhận mỗi mục ngoài hợp đồng một khối xếp chồng: câu «người dùng thấy gì» + «Máy đề xuất: …» + ba
nút. Không có câu nào nói **vì sao** máy đề xuất như vậy. Người ký hoặc gật theo máy (tin suông — trái luật lời mời
cổng 01/09), hoặc mở `review-findings.md` ra đọc (trái «quyết được trong một phút»). Mười mục xếp chồng không so ngang
được, và mục khác thường (đề xuất mở việc mới) không nổi lên.

## 2. Đường đi của một mục Ngoài-n hôm nay

```
review (finder) → triage (tác tử phân loại, TRIAGE_SCHEMA) → triagedRaw → findingLine (run-log, kind:finding)
      → synthesize (tác tử tổng hợp viết review-findings.md theo OOC-ITEM-TEMPLATE)
      → carry-plan.mjs (lượt sau đọc dòng finding) → chenMucCarry/dungMucCarry (máy chèn mục mang sang)
      → lib/out-of-contract.cjs parse() → scripts/gate-card.js (thẻ HTML) · dinh-tuyen-may.cjs · khong-can-nguoi
```

Trường mới phải đi trọn đường này; thiếu một chặng là trường rơi im lặng ở lượt thứ hai (đúng lớp lỗi của hồ sơ
`luot-sua-giu-du-dem-dung`).

## 3. Thiết kế

### 3.1 Trường `can_cu` — một câu, tác tử phân loại viết

- `TRIAGE_SCHEMA` thêm `can_cu` (bắt buộc như `plain`): CHỈ khi `inContract=false`, MỘT câu ngôn ngữ sản phẩm nói vì
  sao đề xuất ấy — hậu quả nặng hay nhẹ, có mất/lộ dữ liệu không, người dùng tự gỡ được không (tải lại, thử lại),
  sửa sau có rẻ không. Cấm tên hàm, đường dẫn, mã thoát. Chuỗi rỗng khi `inContract=true`.
- Vì sao tác tử phân loại chứ không phải tác tử tổng hợp: nó là bên DUY NHẤT đã chọn đề xuất; lý do đi cùng lựa chọn
  từ một ngữ cảnh. Tác tử tổng hợp chỉ chép nguyên văn (như `plain`).
- `OOC-ITEM-TEMPLATE` thêm dòng `  Căn cứ: {can_cu}` ngay sau `Người dùng thấy gì`. Một khuôn, hai bên viết (prompt
  synthesize và `dungMucCarry`) — giữ nguyên nếp marker.
- `findingLine` ghi `can_cu`; `carry-plan.mjs` mang `can_cu`; `dungMucCarry` điền nó. Dòng sổ đời cũ không có khoá →
  chuỗi rỗng.
- `lib/out-of-contract.cjs` đọc khoá `Căn cứ` vào trường `can_cu` (mặc định `''`). Không đổi `OOC_TRIED_ITEM_RE`,
  không đổi khuôn tiêu đề, không đổi `mucChuaDinhTuyen`.

### 3.2 Bảng trên thẻ

Khối «Ngoài hợp đồng — bạn quyết» giữ nhãn khối, giữ câu cờ «CHƯA qua bác bỏ đối kháng», rồi một bảng:

| Mục | Người dùng gặp gì | Máy đề xuất | Căn cứ |
|---|---|---|---|

- **Mục** = `Ngoài-<n>` với n là VỊ TRÍ trong tệp (như hôm nay) — câu gộp ký, sổ `daDinhTuyen`, `dinh-tuyen-may`
  đều tính theo vị trí; đánh số lại theo thứ tự hiển thị là làm lệch mọi bên đọc.
- **Người dùng gặp gì** = `plain` (+ nhãn luật sản phẩm nếu kho khai, như hôm nay).
- **Máy đề xuất** = đúng câu hôm nay (`rec` hoặc «Máy đã định tuyến: … — đảo: <lệnh>»), kể cả câu cờ «đề xuất không
  đọc được». Không đổi chữ — các ca đang ghim chữ này giữ nguyên.
- **Căn cứ** = `can_cu`; vắng → «chưa có căn cứ».
- **Thứ tự hàng — mục cần quyết lên đầu.** Ba nhóm, giữ thứ tự tệp trong từng nhóm:
  1. *Cần anh quyết* — đề xuất `new-contract`, đề xuất rỗng, hoặc đề xuất lạ (không thuộc ba token);
  2. *Máy khuyên — chỉ đổi khi anh nghĩ khác* — `known-limits`, `wont-fix` chưa được máy định tuyến;
  3. *Máy đã định tuyến* — mục có dòng sổ máy khớp (khối DINH-TUYEN-MAY), là dòng báo.
  Nhóm rỗng không in hàng tiêu đề nhóm; chỉ một nhóm có hàng → không in hàng tiêu đề nào.
- Dưới bảng MỘT dòng ba lựa chọn (giữ nguyên văn ba nhãn của `commands/acceptance-card.md`: ghi Known limits · mở
  hợp đồng mới · nâng phạm vi sửa ngay) thay cho ba nút lặp ở từng mục.
- **Màn hẹp** (≤ 560 px): mỗi hàng thành một thẻ xếp chồng (CSS `display:block`), nhãn cột hiện trước từng ô
  (`data-cot`). Thước: WCAG 2.1 SC 1.4.10 Reflow — không cuộn ngang ở 320 CSS px.
- Câu gộp ký (`oneParts`), `routingHoi`/`routingBao`, `--extract` KHÔNG đổi: bảng chỉ đổi mặt đọc.

### 3.3 Đọc-cũ

`review-findings.md` sinh trước bản này không có dòng `Căn cứ:` → ô «chưa có căn cứ» + ĐÚNG MỘT cờ vàng trên khối:
«<k>/<n> mục chưa có căn cứ — hồ sơ chấm bằng bản kit trước khi có trường này; lý do của đề xuất nằm trong
review-findings.md nếu có». Theo luật kho «đổi schema artifact phải có đường đọc-cũ + cờ vàng, không bắt migrate».
Không mục nào thiếu → không cờ.

## 4. Cân trên mọi kho (luật 26/09)

- Kho không có ca này: được lý do in sẵn ở mọi Cổng 2 có mục Ngoài-n; mất: bố cục khối đổi. Không lệnh, khoá,
  câu gộp nào đổi; không tệp mới phải chép sang kho tiêu thụ (lớp CI vendored chép `lib/out-of-contract.cjs` —
  tệp ấy đổi, kho nhận theo mốc như mọi lần).
- Ai dựa vào bố cục cũ: chỉ ca đo của kit (P52, P53/P53b, P201, lmcms, NT). P53 so byte với tệp mẫu trong hồ sơ
  `s4-scope-triage` — tệp mẫu ấy sinh lại bằng chính script sinh (tiền lệ b83237e8, fc470f70).

## 5. Không làm

- Cột «Loại» (lỗi người dùng thấy · thiếu bài kiểm · nợ mã) — Hỏi-1 ở Cổng Phạm vi, máy khuyên bỏ: căn cứ đã nói
  điều đó bằng lời (ảnh chủ kho: «Chỉ thiếu bài kiểm chặt», «người dùng không thấy khác») mà không thêm một trường
  thứ hai đi trọn bảy chặng.
- Đổi mặc định đề xuất, đổi luật định tuyến máy, đổi `mucChuaDinhTuyen`.
- Thẻ Cổng 1, khối «Việc chỉ mình bạn quyết được», khối Treo, khối Mù — vẫn xếp chồng.
- Sửa `review-findings.md` của hồ sơ đã ký để thêm căn cứ.

## 6. Giới hạn đã khai

- Chất lượng câu căn cứ do tác tử LLM viết; kit đo được trường CÓ và đi trọn đường, không đo được câu có đúng không.
  Ngưỡng mở lại: ≥1 lần chủ kho trả lại Cổng 2 vì căn cứ sai sự thật.
- Màn hẹp đo bằng răng Playwright trong hồ sơ (cần Python Playwright trên máy), ngoài `feature_loop.suite_keys`.
