---
schema_version: 1
slug: nha-tai-lieu-router
feature: Nhà tài liệu khai một chỗ — repo khai «lớp vật × vòng đời → một nhà» trong khối máy đọc của docs/MAP.md, máy kiểm không hai nhà / không nhà lạ; repo mới được acceptance-init dựng bản mặc định cũng qua router; feature-loop đọc nhà thay vì đường cứng
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

> Sử liệu: xếp lại 18/09 vì thiếu neo; mở lại 19/09 — neo là hồ sơ mốc 2.16.0 gọi tên ở Notes §5
> mục 1 (owner chốt Q3 17/09). Là vòng META (không có kho chờ), nên theo luật (b) chỉ chạy ở
> cửa sổ sau khi 2.17.0 được một kho nhận.

## Vấn đề & ai gặp

Gốc: acceptance-gate-kit/_acceptance/release-2-16-0 — Notes §5 mục 1: «Router là vòng meta của cửa sổ 2.16→2.17 — owner đã chốt (Q3 17/09)»

Mỗi lớp vật của một repo có hai vòng đời — theo-một-vòng (sinh cho một slug) và thường-trú
(sống suốt đời repo) — và kit chỉ lo nhà cho vòng đời thứ nhất. Khảo sát 13/09 trên 5 repo tiêu
thụ cùng một thước: **5 hình dạng tầng thường-trú khác nhau**; crm-onehub có `docs/crm-plan.md`
(1368 dòng) và `docs/plan/crm-plan.md` (555 dòng) cùng tên khác nội dung; 2/5 repo có `AGENTS.md`
≠ `CLAUDE.md` không symlink; mapposter không có `CLAUDE.md`. Tầng theo-vòng thì do chính engine
tuyên **hai nhà** (contract trong hồ sơ, design doc ở `docs/superpowers/specs/` — SKILL.md:117
kèm chữ «hoặc convention spec của repo» không ai kiểm). Giá đo được: phiên start OneFlow 05/09
mất 4 lượt đọc file mới tìm ra hàng kế. Người trả giá: máy (mọi phiên start mò tài liệu) và
engineer repo tiêu thụ (hai nguồn sự thật cho một vật). Bản đồ + số đo đầy đủ:
`docs/findings/2026-09-13-ban-do-vung-lam-viec-hai-tang.md`; thiết kế:
`docs/superpowers/specs/2026-09-13-nha-tai-lieu-router-design.md`. artifact-platform đã tự dựng
đúng cơ chế cần bằng tay (`docs/MAP.md`: «mỗi sự thật sống ở đúng một nơi») — thiếu phần máy đọc.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Một khối bảng trong `docs/MAP.md` đủ khai «lớp × vòng đời → nhà» cho cả 5 hình dạng đang sống, không cần trường thứ năm | khối phình, mỗi repo một ngoại lệ → lại hai nguồn | viết tay khối cho 5 repo trước khi code (không dựng gì) | **Đã thử 13/09 (P0)** — 7/7 repo khai được bằng ba cột; K1 đỏ đúng chỗ ở kit (2) và crm (2); tập lớp phải mở (12 tên tự mọc). `docs/findings/2026-09-13-loi-khai-viet-tay-6-repo.md` |
| 5 | Ba khoá engine bind (`đặc-tả/theo-vòng` · `kế-hoạch/theo-vòng` · `ý-định/thường-trú`) là đủ — engine không cần biết lớp nào khác | cần khoá thứ tư = engine đang bò sang tầng repo | đếm khoá bind qua từng vòng; ngưỡng dừng = 4 | Chưa thử (ngưỡng đếm) |
| 2 | Phép kiểm 2 để VÀNG (không chặn) vẫn đủ làm lộ hai `crm-plan.md` cho người quyết | vàng bị bỏ qua như residual → lỗ vẫn sống | chạy check trên crm-onehub, xem dòng thẻ start có nêu đúng file không | Chưa thử |
| 3 | feature-loop đọc nhà từ router qua một hàm mà không đổi hành vi khi router vắng | hồ sơ đang giữa vòng ở 5 repo đổi chỗ vật → đỏ oan | ca R7 + chạy S1 trên repo không khai | Chưa thử |
| 4 | Kit tự khai xong thì K1/K2 đỏ đúng 3 chỗ đã biết (`docs/specs` · `docs/plans` trộn · `lai-thu-nguoi-la.md`) — không hơn không kém | phép đo bắt sai lớp, hoặc kho kit có lỗ chưa thấy | ca R8 trên cây kit thật trước khi dọn | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] repo khai xong router thì máy có tìm được nhà của mọi lớp vật trong 0 lượt đọc thêm, và lời khai sai (hai nhà) có bị bắt ở CI không?
- Kết quả nào là SỐNG: [đề xuất] thẻ start crm-onehub trả lời «ý định thường-trú ở đâu» với 0 lượt đọc thêm (đối chứng 4 lượt, 05/09); kit CI đỏ đúng 3 chỗ đã biết rồi xanh sau khi dọn; ≥1 repo cũ tự khai router trong 30 ngày sau phát hành; 0 lượt gọi người thêm
- Kết quả nào là CHẾT: [đề xuất] kit ghi/sửa file nào trong `docs/` của repo ngoài lối vào repo mới; K2 chặn merge ở bất kỳ repo nào; cần lệnh cổng mới; vòng sửa thứ hai cùng lớp «writer/reader không cùng marker»
- Timebox: [đề xuất] 3 ngày làm việc

## Kết quả prototype

Chưa dựng. `docs/MAP.md` của artifact-platform (100 dòng, 5 tầng + luật phân xử) là vật liệu
sống, không phải prototype của ô này.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Sidebar «Legacy systems and the source of truth» + `intent/` trong repo sản phẩm | The AI-Native SDLC playbook, `docs/research/2026-09-07-ai-native-sdlc-playbook.md` dòng 121–122, 307–320, 337–340 | triết-lý/logic — mỗi vật gọi tên MỘT nguồn sự thật; `CLAUDE.md` dưới một trang | có | — |
| `docs/MAP.md` + 5 tầng theo nhịp thay đổi | artifact-platform `docs/MAP.md` (repo tiêu thụ, 15/08) | triết-lý/logic — router một nguồn, luật phân xử | có (khuôn phần người) | — |
| Khối marker làm nguồn runtime | kit `lib/md-section.cjs` (`SECTION-BOUNDARY-TABLE`) | triết-lý/logic — bảng trong file là nguồn, không chép hằng số | có | — |
| Chiều đỏ ổ cắm trỏ-file (vắng → im · trỏ sai → vàng có tên) | kit `docs/plans/2026-09-06-hat-giong-viec-ke-theo-plan.md` §5 | triết-lý/logic | có | — |
| Diátaxis (reference · how-to · tutorial · explanation) | khung tài liệu có tên, không phải guideline Anthropic | triết-lý/logic — chỉ cho cây mặc định repo mới | có, khai rõ nguồn | — |

## Cổng 0

- **decision = …** Mở sau mốc 2.12 (luật chiều rộng (b): cửa sổ hiện tại đã tiêu hai vòng meta), hoặc sớm hơn nếu owner gọi tên và chấp nhận vượt (b) có chủ ý. Đi dưới luật nới 07/09 (đề xuất CỘNG, trace nguyên tố 2 + 1, 0 lượt gọi người thêm).
- **Owner 13/09 (chưa phải chữ ký Cổng Đáng):** chốt hướng **repo khai, kit kiểm**; đồng ý **đổi thứ tự hàng đợi** 07/09 §3 — cửa sổ 2.12→2.13 cho vòng này (P1+P2), lát A của `y-dinh-co-nha-rieng` trượt một cửa sổ.
- **Điều chỉnh 14/09:** owner gọi tên vòng meta của cửa sổ 2.12→2.13 là `khoi-tim-loi-tra-phi-theo-vat` (hoá đơn 2.12.0: 212,3 M token) → vòng này lùi sang **2.13→2.14**, chọn theo ngưỡng dòng 4 luật (c) tại mốc 2.13 (kế hoạch §Hàng đợi). Spec token §T2 khai `laNgoaiVat` sẽ đọc thêm nhà tầng theo-vòng từ router — người hưởng thứ hai: S4. Kế hoạch theo kết quả: `docs/plans/2026-09-13-ke-hoach-theo-outcome-nha-tai-lieu.md`.
- **16/09 — owner chốt R** (`docs/findings/2026-09-15-dieu-chinh-sau-2-14-token-va-vong-meta.md`): cửa sổ 2.14→2.15 không vòng meta mới; ô này chờ số 4b từ **vòng sản phẩm ở repo tiêu thụ** — tìm-lỗi ≤ 60 % → mở ở 2.15→2.16, > 60 % → vòng token kế đi trước.
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** chép từ bullet `[đề xuất]` sau khi người gỡ tiền tố.

## Thước đo thành công → ứng viên criterion

- Dòng thẻ start `nhà tài liệu: <n> lớp khai · <k1> hai-nhà · <k2> file lạc` xuất hiện khi khoá có, vắng khi khoá vắng (R6).
- K1 đỏ đúng thông điệp trên fixture tiêm hàng thứ hai; K2 vàng nêu đúng tên file lạc (R1, R2).
- `homeFor` trả nhà khai khi có router, trả mặc định hôm nay khi vắng (R7).
- Trên cây kit thật trước khi dọn: K1 đỏ đúng cặp `docs/specs · docs/superpowers/specs` (R8).

## Out of scope từ khám phá

- Kit tuyên một cây thư mục chuẩn và bắt repo theo — bác: 5 lần migrate, vi phạm «kit là engine».
- Kit chỉ đọc không kiểm — bác: hai `crm-plan.md` vẫn sống; và tầng theo-vòng kit đã tuyên rồi.
- Tạo `intent/` ở gốc như playbook — bác: vai đó ở kit là `_acceptance/<slug>/opportunity.md`; tạo thêm là kho ý định thứ hai (hạt giống 07/09).
- Dời design doc vào hồ sơ trong vòng này — hoãn: 630+ file đang sống ở 5 repo; router làm split tường minh, migrate là việc từng repo.
- Kit-hoá `STATUS.md`/tiến độ — không: ô `viec-ke-theo-plan` (tiến độ là hiệu số máy in).
- Sửa `CLAUDE.md` 193 dòng của kit — không trong vòng này; ghi là điểm-kit-biết.
- Thêm lệnh cổng người thứ bảy — không (ADR 0002).
