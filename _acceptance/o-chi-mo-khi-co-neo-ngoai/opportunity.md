---
schema_version: 1
slug: o-chi-mo-khi-co-neo-ngoai
feature: Ô chỉ được mở khi có neo ngoài — một hồ sơ cụ thể ở một kho đang chạy kit gọi tên nó; ba nghi thức đang tự đẻ ô (chỗ-cắt-của-mốc · mở-hợp-đồng-mới-tại-cổng · hạt-giống-phải-có-ô) thôi đẻ
owner: phanlemanh@gmail.com
stage: decided
decision: build
decided_by: Mạnh
decided_at: 2026-09-18T13:57:38Z   # owner gõ «build» một chạm trong phiên 18/09, máy ghi hộ
prototype:
  base_commit:
  disposition: archive
---

## Vấn đề & ai gặp

Gốc: kho acceptance-gate-kit — Mạnh gọi tên 2026-09-18

Owner hỏi 18/09: «Sao tôi có cảm giác kit dọn mãi không hoàn tất được?» Đo ra: kit **không
dọn chậm** — 10 ngày, 14 chữ ký, 7 mốc phát hành. Nó không cạn vì **hàng đợi tự nuôi**: 35 ô
mới mở so 14 ô đóng, tồn kho 46 ô chưa có hợp đồng (24 ô không ghi nguồn), và **22/35 ô mới
sinh từ chính nghi thức của kit**, chỉ ~7 ô có một kho tiêu thụ đứng sau. Số và lệnh tái lập ở
`docs/findings/2026-09-18-o-sinh-tu-nghi-thuc-va-gia-cat-so.md`.

Ba nguồn sinh, mỗi luật đúng riêng lẻ, hợp lại thành máy đẻ việc:

1. **Luật (c) CLAUDE.md:88** — «Mỗi mốc phát hành PHẢI gọi tên ít nhất MỘT chỗ cắt cho cửa sổ
   kế». Cộng với «mỗi mốc có hồ sơ» → mỗi lần phát hành đẻ ≥2 ô. 7 mốc = **12 ô**. Không răng
   nào kiểm vế này, máy vẫn tuân 7/7.
2. **Khối «Ngoài hợp đồng» tại Cổng Bằng chứng** (`feature-loop/skills/feature-loop/SKILL.md:276`
   · `commands/acceptance-card.md:149` · `commands/signoff.md:33`) — lối (b) «mở hợp đồng mới»
   biến một phát hiện của bộ chấm thành một ô ngay tại cổng. Một vòng ký = 1 ô đóng, 2–4 ô mở;
   `cong-nguoi-doc-du-nguon` một mình đẻ 4. **8 ô**.
3. **Răng VC8** (`tests/plugins/vao-co-o.test.mjs:246`) — «mọi hạt giống phải có ô», đỏ CI nếu
   thiếu. Mọi ý nghĩ chạm tài liệu bắt buộc thành thư mục, nên tồn kho không phân biệt được «nghĩ
   thoáng qua» với «lỗi đang chạy ở crm».

Cộng luật (b) «một vòng meta giữa hai mốc»: muốn dọn tiếp phải phát hành trước, phát hành đẻ ô,
dọn → phát hành → đẻ → dọn. Đơn vị kế toán là ô, và không ô nào có giá âm.

**Người trả giá:** owner — mỗi ô là một Cổng Đáng, tức một lượt gọi người; 46 ô tồn = 46 lượt
đang chờ. Máy — chiến dịch ghim lại mốc 2.16.0 tốn 2 h 25 cho 0 hồ sơ, thuế thuần của 76 hồ sơ
đã ký. Kho tiêu thụ — 7 mốc trong 10 ngày, không kho nào nhận; media-library và artifact-platform
đứng ở 2.9.0 từ 08/09.

**Trace:** nguyên tố 1 (ý định chốt trước — ô là cam kết có neo, không phải chỗ ghi ý) và
nguyên tố 3 (khoảnh khắc quyết thật — Cổng Đáng chỉ mở cho thứ có người đang đau).

## Đề xuất — MỘT luật, bốn hệ quả, toàn TRỪ

**Luật (owner phát biểu 18/09): ô chỉ được mở khi một kho yêu cầu.** Định nghĩa máy đọc được
của «yêu cầu» = **neo ngoài**: `opportunity.md` có dòng `Gốc:` trỏ tới một hồ sơ cụ thể
(`<kho>/_acceptance/<slug>`, ngày) nơi lỗi đã xảy ra, hoặc tên kho + người gọi tên. Kit tự host
là một kho hợp lệ — ca thật trong `_acceptance/` của kit là neo; **«suy từ đọc mã» hay «phép đo
có thể sai» thì không**. Ý chưa có neo sống ở hạt giống (`docs/plans/*-hat-giong-*.md`) — hạt
giống là sổ, ô là cam kết.

| # | nhát cắt | ở đâu | bỏ được |
|---|---|---|---|
| 1 | Vế «PHẢI gọi tên ≥1 chỗ cắt» → «có thể ghi chỗ cắt vào Notes của hồ sơ mốc; chỗ cắt chỉ thành ô khi có neo». Vế «tuyên bố đã-tối-ưu kèm số» giữ nguyên | `CLAUDE.md:88` | 12/35 |
| 2 | Lối (b) «mở hợp đồng mới» chỉ hiện khi phát hiện có neo (từ vật ở kho tiêu thụ hoặc hồ sơ thật); phát hiện từ review mã của chính vòng chỉ còn (a) Known limits hoặc (c) nâng phạm vi. Thẻ in lý do một dòng khi ẩn (b) | SKILL.md:276 · acceptance-card.md:149 · signoff.md:33 | 8/35 |
| 3 | VC8 **đảo chiều**: từ «mọi hạt giống phải có ô» sang «mọi ô phải có neo» — ô thiếu dòng `Gốc:` đọc được → đỏ; hạt giống mồ côi hợp lệ. Đây là sửa một răng, không thêm răng | `tests/plugins/vao-co-o.test.mjs:246` | tồn kho thôi phình |
| 4 | **Hồ sơ mốc cũng là ô, neo của nó là kho chờ nhận:** chỉ cắt số khi có ít nhất một kho tiêu thụ đang chờ bản mới, và mốc đi làn V như tiền lệ 2.5.0/2.7.0. Vế này gộp cả khuyến nghị trước (trần vòng meta neo vào kho nhận thay vì mốc): mẫu số của luật (b) không còn do kit tự đặt | CLAUDE.md luật (b)(c) · khuôn hồ sơ mốc | ≈25 % commit kho |

**Đi kèm, không phải ô riêng:** rà 46 ô tồn kho theo luật mới — ô có neo giữ, ô không neo về
hạt giống (`archive`, không xoá chữ). Việc rà là một lượt máy, owner đọc danh sách một phút.

Bốn vế đều TRỪ hoặc sửa răng; chạm CLAUDE.md nên **owner ký ở Cổng Đáng của chính ô này**.
Không mở vòng meta mới ngoài ô này trong cửa sổ 2.16 → 2.17.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Ô không neo hầu hết là việc không ai đợi — đóng chúng không làm mất lỗi thật | Một lỗi thật ở kho tiêu thụ mất chỗ ghi | Rà 46 ô: đếm ô không neo mà có ca thật trong thân bài | Chưa thử |
| 2 | Bỏ vế «phải gọi tên chỗ cắt» không làm số đếm hoá hình thức trở lại | Năm dòng số lại chỉ được ghi mà không ai đọc | So hai mốc kế: số dòng số có nhát cắt được **thực hiện** (không chỉ gọi tên) | Chưa thử |
| 3 | Phát hiện của bộ chấm không có neo mà cứ ghi Known limits thì không tích thành nợ ẩn | Known limits phình thay cho tồn kho ô | Đếm Known limits/vòng trước và sau, cùng ngưỡng «sống» bên dưới | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

Vòng nội bộ của bộ công cụ, nhưng đo được — đọc từ kho bằng chính lệnh trong finding.

- Câu hỏi phép đo trả lời: sau luật, hàng đợi có thôi tự nuôi không?
- Kết quả nào là SỐNG: tính từ chữ ký ô này tới mốc kế **được một kho tiêu thụ nhận**:
  ô mới ≤ ô đóng · ≥ 80 % ô mới có dòng `Gốc:` trỏ tới hồ sơ thật · tồn kho chưa hợp đồng ≤ 15 ·
  mốc cắt số đi làn V với ≤ 1 lượt người và 0 lượt chấm S4.
- Kết quả nào là CHẾT: một lỗi thật ở kho tiêu thụ không có chỗ ghi vì thiếu ô, hoặc
  Known limits/vòng tăng gấp đôi — neo quá chặt, nới định nghĩa «neo» chứ không bỏ luật.
- Timebox: một cửa sổ có kho nhận; không có kho nhận sau 21 ngày tự nó là tín hiệu.

## Kết quả prototype

Không dựng. Số đo hiện trạng nằm trọn trong finding; phép thử là chính cửa sổ kế.

## Nguồn ngoài & phạm vi kế thừa

Không có vật liệu ngoài repo.

| Món vật liệu | Nguồn | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| — | — | — | — | — |

## Cổng 0

- **decision = build** (Mạnh, 18/09, một chạm «build», không veto vế nào). Căn cứ: bảng bốn nhát + số ở finding; veto sau này
  từng dòng bằng một dòng sổ.
- **disposition = archive** Căn cứ: không có code prototype.
- **Ngưỡng UAT chốt cùng lúc ký:** như mục Ngưỡng, tiền tố `[đề xuất]` đã gỡ lúc ký.

## Thước đo thành công → ứng viên criterion

- Tỉ lệ ô mới có `Gốc:` đọc được (VC8 đảo chiều đếm) → AC răng.
- Số ô mở / ô đóng mỗi cửa sổ (lệnh ở finding §2) → AC dòng số hồ sơ mốc.
- Lối (b) không hiện cho phát hiện không neo; thẻ có dòng lý do → AC thẻ + chiều đỏ trên fixture.
- Mốc kế: 0 lượt chấm S4, ≤ 1 lượt người → AC hồ sơ mốc.

## Lớp lân cận — chưa phải ô này, ghi để không đo lại

**Giá cắt số** (owner hỏi cùng ngày): 7 mốc / 10 ngày · ≈11 giờ lịch mở→ký mỗi mốc · 25 % commit
kho + 8 % commit ghim lại · ≈24 lượt chấm S4 cho 7 mốc thuần cắt số (2.11: 6 lượt, 2.12: 7) ·
riêng 2.16.0 «không chạm đường vòng lặp»: 54,2 M token, 88 phút máy, 5 lượt người so trần 4,
hợp đồng ≈490 dòng. Mốc đã phình từ «làn V một lượt» (2.5.0, 2.7.0) thành vòng T3 trọn. Vế 4 ở
bảng trên là lối cắt; nếu owner muốn tách thành ô riêng thì một dòng sổ, không mở vòng.

## Out of scope từ khám phá

- Không đặt trần số ô tồn kho bằng một con số cứng — trần bằng neo, không bằng đếm; con số cứng
  là ngưỡng «sống» để đọc, không phải răng.
- Không xoá 46 ô tồn kho — về hạt giống, giữ chữ; xoá là khó đảo.
- Không sửa nghi thức thu-phạm-vi (01/09) — nó đúng; chỉ đổi nơi phạm vi thu về (hạt giống thay
  vì ô).
- Không dựng phép đo mới cho hàng đợi — đọc bằng lệnh git đã có trong finding (luật (a): bộ đo
  một tầng).
