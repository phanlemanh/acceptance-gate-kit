---
schema_version: 1
slug: o-chi-mo-khi-co-neo-ngoai
feature: Ô chỉ được mở khi có neo ngoài — một hồ sơ cụ thể ở một kho đang chạy kit gọi tên nó; ba nghi thức đang tự đẻ ô (chỗ-cắt-của-mốc · mở-hợp-đồng-mới-tại-cổng · hạt-giống-phải-có-ô) thôi đẻ
owner: phanlemanh@gmail.com
stage: decided
decision: park
decided_by: Mạnh
decided_at: 2026-09-19T05:30:00Z   # build 18/09 (owner gõ một chạm); park 19/09 sau lượt chấm 6 — owner đồng ý tách luật đi trước, răng ở lại nhánh
prototype:
  base_commit:
  disposition: archive
---

> **Xếp lại (park) 19/09 — sau lượt chấm 6 REJECT, owner chọn «cắt đuôi giữ lõi» lần cuối.**
> Lõi (luật neo trong `CLAUDE.md`, hàng chờ đã rà, số đo, hạt giống) đi `main` bằng PR tài
> liệu — không chạm engine. Đuôi (răng VC8 mới · lối (b) ghi hạt giống · khuôn giao đi chỉ mang
> khái niệm) ở lại nhánh `cong-dang/o-chi-mo-khi-co-neo-ngoai` cùng trọn hồ sơ (hợp đồng,
> evals, sổ quyết định 28 dòng, run-log, báo cáo). Bàn giao:
> `docs/handoff/2026-09-19-park-o-chi-mo-khi-co-neo-ngoai.md`. Mở lại khi ngưỡng khai trong
> `CLAUDE.md` nổ (≥1 ô mới vào hàng chờ không có dòng `Gốc:`).

## Vấn đề & ai gặp

Gốc: acceptance-gate-kit/_acceptance/release-2-16-0 — mốc có cửa sổ một ngày và 5 lượt gọi người so trần 4, ca thật của lớp «hàng đợi tự nuôi»

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
- Kết quả nào là SỐNG: tính từ chữ ký ô này tới mốc kế được một kho tiêu thụ nhận:
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

## Hạt giống sinh từ vòng — SỔ, chưa ô

- `docs/plans/2026-09-19-hat-giong-bo-dem-vong-meta-neo-sai-mau-so.md` — bộ đếm vòng meta
  trên thẻ start vẫn lấy mẫu số là lần cắt số.
- `docs/plans/2026-09-19-hat-giong-iterate-thoat-rang-neo.md` — một chữ `iterate` đưa ô vào
  hàng chờ mà răng neo bỏ qua.
- `docs/plans/2026-09-19-hat-giong-vong-meta-vat-la-rang-ngan-sach-luot-cham.md` — vòng meta
  có vật là răng phải chốt ngân sách lượt chấm trước; ca mẫu là chính vòng này.

## Hạt giống 21/09 — từ retro kho TIÊU THỤ (crm), không sinh từ vòng này

Neo ngoài: `crm/_acceptance/thuoc-khai-dung-tieng` và `crm/_acceptance/ho-so-khai-dung-tieng` —
hạng mục «khai đúng tiếng» 19–20/09: 44 giờ, 96 commit, 12 lượt chấm S4, ≥6,6 M token, tỉ lệ bộ
đo trên sản phẩm **57:1**, và **chưa xong**. Retro:
`crm:docs/findings/2026-09-20-retro-hang-muc-khai-dung-tieng.md`, đề xuất K1–K8 cho kit.

Ghi ở đây vì ô này là ô đúng chủ đề — «ý có neo ngoài mà CHƯA mở ô sống ở hạt giống». Bảy tệp
dưới đây là SỔ; con trỏ hai chiều giữa chúng và ô này là **chân VC8 cơ học**, không phải neo.

- `docs/plans/2026-09-21-hat-giong-tach-instrument-sha-khoi-verified-commit.md` — K1: sửa thước
  làm hoá cũ bằng chứng của vật; ghim chung một sha thì «hoá cũ» là trạng thái thường trực.
- `docs/plans/2026-09-21-hat-giong-dem-vong-tu-run-log-khong-tu-bao-cao.md` — K2: bộ đếm vòng
  đọc tệp chỉ sinh khi THẮNG; 12 lượt thật, 6 dòng `round-tally`, 0 lần carry-forward.
- `docs/plans/2026-09-21-hat-giong-cong-1-chan-ac-ghim-co-che.md` — K3: AC ghim byte của một tệp
  làm tiêu chí, nên cải thiện thước = vi phạm hợp đồng.
- `docs/plans/2026-09-21-hat-giong-nguoi-cham-chi-doc-tren-cay-duoc-do.md` — K4: agent chấm ghi
  vào cây được đo, phép đo khác báo sai nguyên nhân; luật «ra `.acceptance-runs/`» chỉ là lời dặn.
- `docs/plans/2026-09-21-hat-giong-vi-tu-tran-thuoc-dem-vong-chua-duyet.md` — K5: trần nổ 5 lần,
  miễn 5 lần; vị từ «chạm thước không chạm vật» luôn báo động với vòng sửa thước ĐÃ duyệt.
- `docs/plans/2026-09-21-hat-giong-o-do-khai-tuan-tu.md` — K6: eval cần chạy một mình không khai
  được, nên vỡ trần (E12b 3 583 s so trần 600 s).
- `docs/plans/2026-09-21-hat-giong-khai-ca-dung-cua-de-quy-dung-bac.md` — K8: **nặng nhất** —
  không bậc nào của chuỗi đo được khai là tiên đề, và lối thoát số 3 trỏ ngược vào vòng vừa đóng.
- `docs/plans/2026-09-21-hat-giong-vong-nho-thuoc-la-toolchain-kho.md` — 21/09 chiều: hai mục
  điều hướng ở crm (`loi-vao-dieu-phoi-30-ngay`) trả giá một lượt chấm 15 tác nhân — kit không có
  hình dạng vòng nhỏ; bộ làn S4 cố định theo số eval, không theo cỡ vật.
- `docs/plans/2026-09-21-hat-giong-tac-nhan-con-khong-doc-cau-nhan-cua-nguoi.md` — 21/09: ba
  lượt chấm trong một ngày ở crm đốt vì tác nhân con đọc câu nhắn gần nhất của người thành lệnh
  («Dừng nó» ×2, «Kiểm tra lại docker» ×1) — hệ thống chết chưa có răng, mới có lời dặn.
- `docs/plans/2026-09-21-hat-giong-draft-khong-duoc-nhay-sang-thuc-te.md` — Ngoài-6/7 của vòng
  `nhan-trang-thai-va-reality` (ký 21/09): `draft` vẫn nhảy thẳng sang `da-cham-boi-thuc-te`; hook tự
  xưng chặn mà không có mã — cùng hình với Ngoài-1/5 và Ngoài-8 (nhánh phòng vệ không chiều đỏ).
- `docs/plans/2026-09-22-hat-giong-bon-loi-nho-2-18-0-tu-crm.md` — bốn lỗi nhỏ của 2.18.0 lộ
  trong ngày crm cài (veto không đóng sau observed · observed không vẽ bản đồ · lớp CI thiếu
  product-map.mjs · fail-open làn V tái phát) — gom MỘT vòng 2.18.1, thay ba chip.
- `docs/plans/2026-09-22-hat-giong-nhan-ngoai-n-neo-theo-noi-dung.md` — vòng `ho-so-khep-thoi-hoi`
  round 3: nhãn «Ngoài-N» là vị trí mục, lượt chấm mới đánh số lại nên dòng sổ gate2 cũ trỏ nhầm mục
  mới — ở hồ sơ làn V là fail-open; nghiệm: nhãn rút từ nội dung mục.
- `docs/plans/2026-09-22-hat-giong-co-qua-timebox-ba-muc-ngoai-hop-dong.md` — ba mục «mở hợp đồng
  mới» của `co-qua-timebox-nhom-da-xong` (executor itgk_lane_doc_khong_doi · ngân sách 3/4/1).
- `docs/plans/2026-09-22-hat-giong-suite-scripts-qua-tran-cong-cu.md` — suite scripts 601 s trên cây mốc
  2.18.1, qua trần 600 s của công cụ; round 1 `ho-so-khep-thoi-hoi` BLOCKED vì hạ tầng — việc đầu cửa sổ kế.
- `docs/plans/2026-09-22-hat-giong-ca-do-neo-ref-tuong-doi-chet-khi-gop.md` — `main` đỏ hậu-gộp 2/2 mốc
  (LM20 sau nghỉ · HK-AC5-note merge-base): ca đo neo ref tương đối chết khi gộp; neo = sha rút bằng lệnh.
- `docs/plans/2026-09-22-hat-giong-audit-s4-bon-diem-nguoc-north-star.md` — audit 22/09: Treo «phê hết»
  4/4 · bỏ design-pass bằng lời 6/6 · ý định 4/8 · chiều đỏ ở làn baseline, không ở lịch sử commit crm.
- `docs/plans/2026-09-22-hat-giong-the-cong-1-ho-so-khep-van-hoi.md` — ngày crm cài 2.18.1: hồ sơ khép không có
  evidence-report.md rơi nhánh Cổng 1 của thẻ, vẫn hỏi «duyệt hay sửa» (2/7); vị từ «đã khép» phải hỏi trước khi chọn nhánh.
- `docs/plans/2026-09-23-hat-giong-tac-tu-tong-hop-ghi-truong-cua-nguoi.md` — 23/09 crm: agent synthesize:report tự ghi
  `human_signoff` và bịa `verified_at` tương lai ở 4 run; không chốt máy nào sau synthesize, lưới không có răng — ADR 0002 sống bằng lời.
- `docs/plans/2026-09-23-hat-giong-rang-ben-doc-verified-at-chu-ky.md` — vế 2 owner không phê ở vòng chốt máy 2.18.2:
  răng bên đọc đi SAU chiến dịch ghim lại 13 kit + 12 crm; ngưỡng bật = 0 hồ sơ đỏ trên corpus.
- `docs/plans/2026-09-23-hat-giong-goal-template-coi-blocked-la-xong.md` — khuôn /goal của feature-loop coi BLOCKED là hoàn
  thành, cãi với luật S4 «BLOCKED chạy lại cùng round»; phiên crm kiem-auth dừng hỏi người, không dựng thẻ 2.18.1.
- `docs/plans/2026-09-22-hat-giong-dong-hieu-chuan-dem-ho-so-chua-tung-dat.md` — dòng hiệu chuẩn `0 / 8` tự xưng
  «ĐẠT đã ký» mà 4/8 hồ sơ chưa từng ĐẠT-ký; chỗ đỏ khai trong dòng quan sát không vào k.
- `docs/plans/2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md` — lượt máy hỏi ngoài thiết kế dồn về S1
  (28 chạm / 3 vòng crm, 0 câu lệch khuyến nghị): áp luật lời mời cho bước lên thiết kế.
- `docs/plans/2026-09-23-hat-giong-lop-chep-tu-xoa-2-18-3.md` — 23/09: sáu kho nâng 2.18.1, danh sách
  chép thiếu tệp lần thứ ba, oneflow fork 508 dòng bỏ răng P184; owner đổi đường mặc định sang chạy
  cổng từ bản kit ghim sha (GUIDE §5.3) — vòng TRỪ xoá đường chép, đi sau vòng S1.

K7 («pin nói ra ô nó không đo») **đã xong ở kho này** — vòng `ghim-lai-noi-ra-o-khong-do`, gộp
20/09 (PR #190). Không mở lại.

## Out of scope từ khám phá

- Không đặt trần số ô tồn kho bằng một con số cứng — trần bằng neo, không bằng đếm; con số cứng
  là ngưỡng «sống» để đọc, không phải răng.
- Không xoá 46 ô tồn kho — về hạt giống, giữ chữ; xoá là khó đảo.
- Không sửa nghi thức thu-phạm-vi (01/09) — nó đúng; chỉ đổi nơi phạm vi thu về (hạt giống thay
  vì ô).
- Không dựng phép đo mới cho hàng đợi — đọc bằng lệnh git đã có trong finding (luật (a): bộ đo
  một tầng).
