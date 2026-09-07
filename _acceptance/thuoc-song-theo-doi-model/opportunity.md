---
schema_version: 1
slug: thuoc-song-theo-doi-model
feature: Thước sống theo đời model — bằng chứng ghi model sinh ra nó, cờ «cũ theo model», cờ nhạt có việc kế, hình dạng lỗi đo-lường thứ 7 «thước bị nới sau khi đã đỏ»
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

Một hồ sơ đã ký là lời hứa «đã kiểm»; lời hứa cũ đi theo hai trục — mã đổi và model đổi — mà kit
chỉ theo dõi trục thứ nhất: 0/80 `evidence-report.md` ghi model nào sinh ra nó, `lib/evidence-core.cjs`
không biết khái niệm này, staleness 100 % theo diff mã. Hồ sơ ký dưới model đời cũ đọc y hệt hồ sơ
đời nay, mãi mãi. Người trả giá: MÁY — nó đọc «cổng xanh» thành «đã được chấm» — và owner tin
nhầm. Sáu hình dạng lỗi đo-lường của kit đều nói về phép đo sinh ra đã sai, không hình dạng nào nói
về phép đo hoá vô hại theo thời gian. Vật cần đã sinh sẵn chưa ai ghép (`s4-args.mjs` băm
`evals.yaml`, `acceptance-verify.js` ghi `non_discriminating` + `evals_hash`). Đề bài đầy đủ:
`docs/plans/2026-09-07-hat-giong-thuoc-song-theo-doi-model.md` (từ playbook AI-Native SDLC, play
«Recurring codebase scans» và «Continuous evals», 07/09).

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Có hồ sơ đã ký bị model đời sau phát hiện sai mà thẻ/lưới vẫn xanh | lỗ là lý thuyết | không đếm được cho tới khi ghi model — mục 1 của hạt giống là điều kiện để đếm | Chưa thử — chưa đếm được |
| 2 | Ghi `model:` là vật máy ghi, hook chặn được bản điền tay (cùng họ răng `verified_at`) | trường thành lời khai, vô nghĩa | bản sao điền tay → hook đỏ | Chưa thử |
| 3 | «Cũ theo model» chỉ cần là CỜ, không chặn merge (mặc định) | mỗi lần đổi model = chiến dịch ghim lại toàn kho, ngược §7.1 | câu hỏi thật cho owner: cờ hay chặn | Chưa hỏi |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] hồ sơ ký dưới model đời cũ có đọc KHÁC hồ sơ đời nay trên thẻ và lưới không, và thước nhạt có được gọi tên kèm việc kế không?
- Kết quả nào là SỐNG: [đề xuất] mọi bằng chứng mới có `model:` máy ghi; hồ sơ cũ hiện cờ vàng, không đỏ, không migrate; đổi model trong config → thẻ hồ sơ cũ hiện «cũ theo model»; bản sao gỡ trường → cờ; bản sao nới `expected` giữa vòng đỏ và vòng xanh → hình dạng 7 gọi đúng eval; 0 lượt gọi người thêm
- Kết quả nào là CHẾT: [đề xuất] bắt migrate hàng loạt; cờ tắt được bằng xoá một dòng; `model:` điền tay qua được hook; thêm lượt gọi người/vòng
- Timebox: …

## Kết quả prototype

Chưa dựng.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Play «Recurring codebase scans» (dòng 996, 1003) + «Continuous evals» (557–558) | The AI-Native SDLC playbook, `docs/research/2026-09-07-ai-native-sdlc-playbook.md` | triết-lý/logic — cả hai vế cũ đi; độ phủ tính từ lần chạy gần nhất; ca nhạt theo model | có | — |
| Nếp đường đọc-cũ (cờ vàng 1.13.0 / 1.14.0) | kit `CLAUDE.md` mục «Đổi schema artifact phải có đường đọc-cũ» | luật kit | có | — |

## Cổng 0

- **decision = …** Chờ owner gọi tên (xếp sau ô «Đường lùi phải sống» và `vong-la-mot-ket-qua` theo thứ tự gật 07/09), hoặc khi kit đổi model mặc định lần kế.
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** chép từ bullet `[đề xuất]` sau khi người gỡ tiền tố; câu hỏi cờ-hay-chặn hỏi đúng một lần tại đây.

## Out of scope từ khám phá

- Không tự ghim lại toàn kho khi đổi model — ghim lại vẫn theo mốc phát hành (§7.1).
- Không đo-thước-của-thước: ba việc đọc vật đã có, không dựng phép đo đo phép đo.
- Máy không tự sửa thước khi cờ nhạt bật — chỉ nêu hai lối cho người.
