---
schema_version: 1
slug: eval-thay-boi-co-chung
feature: Eval máy đã ký nghỉ hưu vì một hồ sơ đã ký khác thay nó — khai con trỏ tới hồ sơ thay và AC thay cạnh lời khai không-chạy; luật hai vế nhận lời khai khi máy chứng được con trỏ ở cây đang kiểm, và pin nói ra ô nào được thay bởi đâu
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Phan Le Manh
decided_at: 2026-10-06T08:30:00Z   # owner giao việc trong phiên 06/10 («thiết kế … đi qua các cổng của kit»); máy ghi hộ, veto ở Cổng Phạm vi
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

> Mở 06/10 theo lời owner giao trong phiên. Câu giao việc là chữ quyết của Cổng Đáng; máy ghi hộ
> và giữ cửa veto ở Cổng Phạm vi — người kéo lại ở đó thì ô về `discovery`, không mất gì.

## Vấn đề & ai gặp

Gốc: crm/_acceptance/gop-y-dung-cho — lượt này (commit `081c9b792`, ký 03/10) gỡ hẳn cột góp ý OKR; khối `BANG-THAY-THE` trong `docs/superpowers/specs/2026-10-03-gop-y-dung-cho-design.md` liệt 36 eval đã ký ở năm hồ sơ, mỗi dòng nêu AC nào của lượt mới thay nó; làn ghim lại chết ở `notRunConflicts` cho mọi eval máy trong số đó

Người gặp: owner và mọi phiên ở crm muốn ghim lại các hồ sơ mất vật đo. Đo 06/10 trên crm
`origin/onehub` `e753383a`:

- 36 eval trong bảng thay thế · **25 eval máy** (19 `test` · 6 `script`) · 11 ngoài làn máy
  (9 `ui-check` · 2 `judgment`). Cả năm hồ sơ cũ (`the-gop-y-okr`, `khung-tao-okr-nhu-deal`,
  `tro-ly-okr-de-xuat`, `va-tro-ly-okr-sau-thu`, `nen-kara`) và hồ sơ thay `gop-y-dung-cho` đều
  `signed-off`. Tám AC thay (AC-5, 7, 10, 11, 12, 14, 15, 16) đều có ≥ 1 eval trong bản khai của
  hồ sơ thay.
- Đường hợp lệ duy nhất kit có hôm nay — khai `status: not-run` — bị luật hai vế chặn
  (`lib/evidence-core.cjs` `notRunConflicts`, hồ sơ `lan-doc-status-not-run`, khuôn ADR 0016):
  báo cáo đã ký của năm hồ sơ cũ có mã thoát cho chính 25 eval máy kia, nên làn
  `repin-lane.mjs` dừng exit 2 trước khi ghi byte nào, và bên đọc ghi VIOLATION. Luật đúng khi
  chặn né đo — nó không có ngoại lệ nào cho eval nghỉ hưu vì một hồ sơ ĐÃ KÝ khác đã đo lại
  điều tương đương.
- Hệ quả: các hồ sơ cũ không bao giờ ghim lại được. crm đang lách bằng lưới RIÊNG của kho
  (`scripts/kiem-paths-dong.mjs` đọc bảng thay thế, in «ĐÃ THAY» thay cho cảnh báo) — tức một
  từ vựng của MỘT kho đang gánh việc của luật kit.

Bán kính (luật 26/09 — cân trên mọi kho): đo 06/10 trên các cây tiêu thụ có trên máy, eval khai
`status: not-run` có ở **4 hồ sơ / 2 kho** (crm 3 · oneflow 1), kit 0, artifact-platform 0,
radar 0, media-library 0, map 0. Kho KHÔNG dùng trường mới thì không đổi một byte nào: trường
mới chỉ được đọc khi có mặt, và bên gọi cũ (chưa chép `lib/` mới) vẫn thấy xung đột như hôm nay
— hướng an toàn.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Bốn điều máy kiểm được ở cây đang kiểm — hồ sơ thay tồn tại · đã thông Cổng Bằng chứng · có AC được trỏ · AC đó còn ≥ 1 eval không khai không-chạy — đủ để lời khai nghỉ hưu không thành đường né đo | có cách khai một con trỏ hợp lệ mà không hồ sơ đã ký nào đo lại vật, tức luật hai vế mở | ma trận ca từ chối dựng bằng mã: mỗi điều kiện gãy đúng một lần, mỗi ca ghim lý do riêng; cộng ca vòng tròn hai hồ sơ trỏ nhau | Chưa thử |
| 2 | Con trỏ cấp AC (không cấp eval) là đúng độ mịn: bảng của crm nêu AC, và AC là đơn vị hợp đồng người đã ký | crm phải dịch 36 dòng sang id eval — vô nghĩa vì hồ sơ thay có thể đổi id eval mà không đổi AC | đối chiếu bảng crm: 36/36 dòng nêu AC, 0 dòng nêu eval | Đã thử (06/10) |
| 3 | Đặt con trỏ CẠNH lời khai `status: not-run` (không thêm giá trị trạng thái mới) giữ mọi bộ đọc hiện có nguyên hành vi | một bộ đọc nào đó (s4-args, carry-plan, bộ lọc paths, thẻ) đối xử khác ô có con trỏ | grep mọi chỗ đọc `not-run`; vi phân lượt chạy trên bộ hồ sơ kit trước/sau | Đã thử nửa (grep 06/10: 7 chỗ đọc, cả 7 đi qua `normaliseEvalStatus`) |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: *crm ghim lại được các hồ sơ có eval bị thay, gỡ được phần «ĐÃ THAY» của lưới riêng, mà không mở đường né đo nào?*
- Kết quả nào là SỐNG: trên một bản dựng bằng mã đúng hình dạng crm (năm hồ sơ, 25 eval máy trỏ tám AC của một hồ sơ thay đã ký), làn ghim lại xanh và bên đọc 0 lỗi; mỗi điều kiện gãy cho từ chối kèm lý do gọi tên; bộ hồ sơ kit cho cùng đầu ra trước/sau từng byte.
- Kết quả nào là CHẾT: có một con trỏ hợp lệ theo luật mà hồ sơ thay không đo lại AC nào; hoặc một kho không dùng trường mới đổi đầu ra lưới trước-merge.
- Timebox: một vòng T3 (chạm `lib/**`), trần bốn lượt gọi người; ngưỡng đọc lại trên crm ở chiến dịch phát hành mang vòng này.

## Kết quả prototype

Chưa dựng.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Luật hai vế `notRunConflicts` + `checkRepinEvals` | kit `lib/evidence-core.cjs` (hồ sơ `lan-doc-status-not-run`, ADR 0016) | vật đã ký | có — mở rộng tại chỗ, một nguồn cho làn và hai bên đọc | — |
| Bộ đọc dòng AC `criteriaLines` | kit `lib/ac-line.cjs` (đã trong INIT-CI-COPY-LIST) | vật đã ký | có — gọi, không sửa | — |
| Bảng thay thế crm | crm `docs/superpowers/specs/2026-10-03-gop-y-dung-cho-design.md` | thước đối chứng | có — hình dạng fixture (năm hồ sơ, 25 eval máy, tám AC); kit KHÔNG đọc từ vựng `BANG-THAY-THE` của kho | — |
| Tiền lệ «Superseded by» | Michael Nygard, ADR format (trạng thái *superseded*) · IETF RFC header *Obsoletes / Obsoleted by* | chuẩn ngành | có — ý «trỏ tới bản thay, bản thay phải tồn tại và đang hiệu lực» | — |

## Cổng 0

- **decision = build** T3: (1) eval khai `status: not-run` được mang thêm một trường con trỏ `<hồ sơ>#<AC>`; (2) `notRunConflicts` nhận ô có con trỏ khi bốn điều kiện chứng được ở cây đang kiểm, ngược lại vẫn xung đột kèm lý do gọi tên điều kiện gãy; bên gọi không truyền được gốc cây vẫn xung đột (fail-closed); (3) làn ghim lại, `recheck-evidence.cjs`, `pre-merge-check.sh` dùng chung một hàm; (4) pin nói ra ô nào được thay bởi đâu; (5) tài liệu khuôn khai đặt một chỗ có marker và ca round-trip đọc chính khuôn đó.
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** ngưỡng SỐNG ở trên.

## Out of scope từ khám phá

- Không sửa kho crm từ vòng này; crm khai con trỏ và gỡ phần «ĐÃ THAY» của lưới riêng ở lượt nhận mốc.
- Không thêm giá trị trạng thái mới (`thay-boi`) — con trỏ đi cạnh `not-run` (giả định 3).
- Không đọc bảng thay thế trong design doc của kho (từ vựng một kho); nguồn sự thật là trường trong `evals.yaml` của hồ sơ cũ.
- Eval ngoài làn máy (`ui-check`/`judgment`) không bị luật hai vế chặn hôm nay; con trỏ trên chúng không được kiểm trong vòng này.

## Ghi chú cho mốc mang vòng này

Khi mốc chứa vòng này được cắt, ghi vào ghi chú mốc (mục «kho tiêu thụ phải làm gì khi nhận»): **crm khai
con trỏ thay thế cho 25 eval máy ở năm hồ sơ cũ theo bảng `BANG-THAY-THE`, ghim lại các hồ sơ đó, rồi gỡ
nhánh «ĐÃ THAY» khỏi `scripts/kiem-paths-dong.mjs`**; chép lại `lib/evidence-core.cjs` theo INIT-CI-COPY-LIST.
