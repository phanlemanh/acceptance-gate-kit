---
schema_version: 1
slug: ra-co-ten-lam-va-trao
feature: Ra có tên ở Vòng LÀM và TRAO — làn V có ô kết, Cổng Đáng ký trong một lượt, Cổng Giá trị có lối ra cho vòng không đo được
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

Luật «vào có ô, ra có tên» đã ship cho Vòng HIỂU (chip B): mọi ý vào đều có ô, mọi lối ra đều có tên. Vòng LÀM và Vòng TRAO **chưa có luật đó** — audit 22/08 tìm được **sáu chỗ có ô mà không có tên**, ba chỗ nặng đủ để chặn việc đang chạy:

1. **Làn V là đường một chiều không có ô kết.** Hồ sơ máy-đi-trước xanh-sạch dừng ở `verified`; không nghi thức nào đổi nó sang `signed-off` (`feature-loop/skills/feature-loop/SKILL.md:24` — «đi tiếp S5, KHÔNG mời ký», không đổi status). Nhưng phiên nghiệm thu đòi `status: signed-off` (`skills/uat-session/SKILL.md:21,39` → DỪNG) và máy quét chỉ mở Cổng Giá trị ở nhánh `signed-off` (`scripts/start-scan.mjs:206-236`). Hệ quả: **một cơ hội đã ký «làm» mà vòng của nó đi làn V thì không bao giờ tới Cổng Giá trị** — ngưỡng owner khai ở Cổng Đáng không bao giờ được đo. Ca sắp đụng: `design-pass-nac-khong-dong-bo` (đã ký build 22/08, T2, đang ở S1). Kèm theo: resume `/feature-loop <slug>` vào hồ sơ này chạy lại S5 mỗi lượt vì không có trạng thái kết.
2. **Cổng Đáng không có nghi thức.** Ba cổng kia có lệnh đứng tên (`approve` · `signoff` · skill `uat-session`); Cổng Đáng chỉ có 8 dòng chú thích trong khuôn ô (`skills/acceptance/references/opportunity-template.md:82-93`). Không lệnh nào ghi `decision`/`decided_by`/`disposition`, không ai vẽ lại bản đồ, không lưới nào kiểm chữ ký, `GUIDE.md` không nhắc cổng này. `/start` bàn giao nó sang `/acceptance-card` (`commands/start.md:125`) nhưng thẻ chỉ biết Cổng Phạm vi/Bằng chứng (`scripts/gate-card.js:188-193`) nên in **thẻ Cổng Phạm vi rỗng** với nút «Duyệt, cho code» cho một hồ sơ chưa có hợp đồng. Vì không có nghi thức, «điền ngưỡng» và «ký» tách thành hai lượt gọi người và hai PR, dù khuôn nói ngưỡng chốt **cùng lúc** ký — và lượt ký thứ hai chỉ còn một câu trả lời hợp lý là «ừ», tức trạm thu phí. Bằng chứng: trong ngày 22/08 ba ô ký Cổng Đáng theo **ba đường khác nhau** (ghi tay trong chat #91 · ký lẫn trong phiên feature-loop · kẹt ở con trỏ chết).
3. **Cổng Giá trị không có lối ra cho vòng không đo được.** Máy quét xếp hồ sơ vào «chờ Cổng Giá trị» chỉ theo `decision` mà không hỏi ngưỡng đã khai chưa (`start-scan.mjs:231-234`), trong khi nghi thức từ chối mở phiên nếu ngưỡng còn `…`. Vòng kit tự-dùng (không có người dùng cuối) rơi đúng vào đó: `duong-do-trong-dinh-nghia-xong` **treo từ 21/08**, không lối ra nào máy chấp nhận. Lối rẻ nhất hiện nay là sửa tay `decision: park` sau khi ship — **không để lại dấu vết nào** (không entry sổ, không `[SUPERSEDED]`). Cùng lớp: `verdict: iterate` và `kill` không có chủ bước kế, `stage: archived` không ai viết và bị hai bộ đọc hiểu thành «chưa quyết», timebox không bộ đọc nào đọc nên «tới hạn → park» chỉ là câu tự khai trong một ô.

**Người trả giá:** **owner** (ngưỡng khai rồi không được đo; cổng treo không có lối ra hợp lệ; phải ký một quyết định đã gật ở lượt trước) và **máy** (mỗi lần đi qua ba chỗ này phải phát minh lại nghi thức, nên cùng một việc ba phiên làm ba kiểu — không tự kiểm được).

**Đối chiếu ngoài:** theo Stage-Gate (R. Cooper), một cổng cần đủ *vật nộp · tiêu chí · lối ra · người gác · chủ bước kế*. Audit cho thấy **cả bốn cổng của kit đều thiếu «chủ bước kế»**, ba cổng thiếu «người gác có hạn». Ba mục trên là ba chỗ thiếu nặng nhất.

**Bằng chứng thực địa:** `docs/findings/2026-08-22-audit-day-nghi-thuc-kit.md` — bảng §2 (17 chuyển trạng thái, ai đứng tên), §3 lớp A (12 mục không-ai-đứng-tên), §4 (bảng Stage-Gate), §5 (đếm lần gọi người). Bốn máy đọc chạy song song, chữ lấy bằng chạy thật script + fixture máy sinh.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Làn V cần **một trạng thái kết có tên** (không phải mượn `signed-off`) để mọi bộ đọc và phiên nghiệm thu nhận ra | mượn `signed-off` thì mất phân biệt «người đã ký» vs «máy đi tiếp» — đúng thứ làn V sinh ra để phân biệt | dựng bản sao một hồ sơ làn V, đặt trạng thái kết, chạy `start-scan` + `uat-session` §0 + lưới: cả ba phải nhận | Chưa thử |
| 2 | Ngưỡng + chữ ký Cổng Đáng gộp được vào **một lượt người** mà vẫn giữ «máy không phát ngôn hộ quyết định» | gộp thành máy viết sẵn verdict rồi xin gật — vi phạm luật gốc | dựng thẻ Cổng Đáng: máy trình đề xuất ngưỡng + căn cứ + hai lối ra sống, người chọn; đếm số lượt và kiểm không có chữ nào của người bị máy viết trước | Chưa thử — hai phiên 22/08 đã chạy tay đúng hình dạng này |
| 3 | Vòng không có người dùng cuối cần **lối ra có tên** ở Cổng Giá trị, không phải sửa `decision` sau ship | thêm một tên nữa mà không ai dùng; hoặc mở đường lách cho mọi vòng khai «không đo được» | đếm trên hồ sơ thật: bao nhiêu vòng đã ship là kit tự-dùng không có người dùng cuối; thử áp lối ra đó cho `duong-do-trong-dinh-nghia-xong` | Chưa thử — 1 ca đang treo |
| 4 | Ba chỗ này là **một lớp** (ra có tên), sửa chung rẻ hơn ba lần sửa riêng | ba seam khác nhau, gộp làm hợp đồng phình và S4 phải đo ba thứ rời | dựng bảng: mỗi chỗ cần thêm/đổi vật gì; đếm vật dùng chung (bảng trạng thái, bộ đọc, khuôn thẻ) | Chưa thử |
| 5 | Đổi trạng thái/bộ đọc giữ được **đường đọc-cũ** cho 56 hồ sơ đã có, không migrate hàng loạt | phải migrate — trái luật đọc-cũ + cờ vàng của kit | chạy bộ đọc mới trên 56 hồ sơ hiện tại: 0 hồ sơ thành «hỏng», mọi khác biệt là cờ vàng | Chưa thử |
| 6 | `iterate` mở được vòng mới mà không cần cơ chế mới (dùng lại đường vào S1) | cần vòng đời hồ sơ thứ hai — đắt hơn nhiều lần ước tính | lần theo một hồ sơ giả định `iterate`: đường nào đưa nó về S1, mất gì | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …

## Kết quả prototype

Chưa dựng. Không cần prototype code: ván thử là chính kit (kit tự chạy cổng của mình) — ca sống đang có sẵn: `design-pass-nac-khong-dong-bo` (sẽ đi làn V tới cuối vòng) và `duong-do-trong-dinh-nghia-xong` (đang treo Cổng Giá trị).

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Năm thành phần của một cổng (vật nộp · tiêu chí · lối ra Go/Kill/Hold/Recycle · người gác · chủ bước kế) | Stage-Gate, R. Cooper | triết-lý/logic | có — làm thước «cổng đã đủ chưa»; KHÔNG bê quy trình 5 giai đoạn | — |
| Luật «vào có ô, ra có tên» áp cho Vòng HIỂU | hồ sơ kit `vao-co-o-ra-co-ten` (ship 22/08, #75) | triết-lý/logic | có — mở rộng cùng luật sang LÀM/TRAO | — |
| Bài học làn V ba vòng (máy kéo hạng bằng lựa chọn nhị phân giả; bộ đọc mặt người phải đo QUAN HỆ với lưới) | hồ sơ kit `lan-v-khong-phai-cho-ky` (ship 21/08, #80) | triết-lý/logic | có | — |

## Cổng 0

- **decision = …** Căn cứ: …
- **disposition = …** Căn cứ: không có prototype code — đổi trạng thái + nghi thức + bộ đọc trong chính kit.
- **Phiên nghiệm thu ở đâu:** chính kit tự-dùng — vòng của `design-pass-nac-khong-dong-bo` đi tới cuối (chứng làn V có ô kết) và `duong-do-trong-dinh-nghia-xong` được gỡ treo (chứng Cổng Giá trị có lối ra). **Lưu ý ranh giới:** nếu ô này ship trước khi hai hồ sơ đó tới đích thì phiên nghiệm thu đo trên **hồ sơ thật đầu tiên đi qua**, không dựng ca giả.
- **Ngưỡng UAT chốt cùng lúc ký:** …

## Thước đo thành công → ứng viên criterion

- Số hồ sơ có cơ hội đã ký `build` mà **không tới được** Cổng Giá trị — đích 0 (nay: mọi hồ sơ đi làn V).
- Số cổng đang **treo không có lối ra hợp lệ** — đích 0 (nay: 1, `duong-do-trong-dinh-nghia-xong`).
- Số lượt gọi người cho Cổng Đáng, tính từ «ô đã có đủ nội dung» tới «đã ký» — đích 1 (nay: 2 lượt + 2 PR).
- Số đường ký Cổng Đáng khác nhau trong cùng một tháng — đích 1 (22/08: 3).
- Số chuyển trạng thái trong dây LÀM/TRAO **không có ai đứng tên** — đích 0 cho ba mục Core; các mục Later khai tường minh là còn nợ.
- Số lần một quyết định số phận hồ sơ (`park` sau ship, đóng vòng, `iterate`) xảy ra **không để lại vết** trong sổ quyết định — đích 0.
- Số hồ sơ cũ hoá «hỏng» sau khi đổi bộ đọc — đích 0 (đường đọc-cũ).

## Out of scope từ khám phá

- **Không** đụng lời thẻ `/start`, bảng chữ chung, hay bộ đọc mặt người — đó là ô `start-bang-dieu-khien`, mở trước và làm đường đo cho ô này.
- **Không** mở lối để vòng thường khai «không đo được» nhằm né Cổng Giá trị — lối ra mới phải có điều kiện máy kiểm được và để vết.
- **Không** bỏ phân biệt «người ký» vs «máy đi tiếp» — làn V sinh ra để giữ phân biệt đó; ô kết mới không được nuốt `signed-off`.
- **Không** migrate 56 hồ sơ cũ — đường đọc-cũ + cờ vàng như mọi lần đổi schema.
- **Không** làm veto có động từ / Gate 1.5 có vết / Trả lại có vết / re-pin có lối vào trong ô này — đã xếp Later ở audit §6; kéo vào là ba seam thành sáu.
- **Không** đụng lưới trước-merge ở phần Vòng TRAO — cố ý mù theo spec «thất bại chảy một chiều».
- **Không** gộp với `lenh-in-ra-phai-bam-duoc` (dạng tên lệnh, đang ở Cổng Bằng chứng) hay `ban-do-dinh-chu-ky` (bản đồ dính commit chữ ký) — khác lớp.
