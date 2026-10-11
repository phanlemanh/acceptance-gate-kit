---
schema_version: 1
slug: eval-goi-model-that-khong-chay
feature: Eval gọi model thật không chạy lại khi đầu vào không đổi
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: manh
decided_at: 2026-10-11T08:55:32Z   # owner gõ «Làm» một chạm trong phiên 11/10, máy ghi hộ
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: G3
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

> Mở 11/10 từ hàng G3 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`)
> bằng `node scripts/lo-trinh.mjs --root . --hang G3 --mo-o` (slug suy tất định từ câu giao).
> Hàng đứng trên N8 (`lenh-dai-chay-rieng`, đã gộp). Hạt giống cùng lớp:
> `docs/plans/2026-10-06-hat-giong-gia-lan-ghim-lai-vong-b.md` — vòng này là lát **Đ2 thu về eval
> model thật**; Đ1 và Đ2-cho-mọi-eval vẫn là hạt giống.

## Vấn đề & ai gặp

Gốc: crm/_acceptance/eval-model-that-dung-luc — ký Cổng Đáng `build` 07/10, Cổng Bằng chứng 10/10; mục Coverage «Later» ghi «bộ nhớ đệm theo băm cho mọi eval model thật (bộ kit)», Out of scope ghi «mười một eval model thật khác trong `feature_loop.model_evals`: đề xuất cho bộ kit».

**Người gặp:** chủ kho crm trả tiền AI Gateway; phiên thợ crm chờ làn ghim lại. Hôm nay làn ghim lại
(`feature-loop/scripts/repin-lane.mjs`) chạy MỌI eval `test`/`script` của hồ sơ ở mỗi lượt. Eval khai trong
`feature_loop.model_evals` chỉ được đối xử khác ở hai chỗ: không chạy lại khi đỏ (Đ4) và được đếm
(`tong_ket.model_goi`); ô `tong_ket.model_carry` có sẵn nhưng cố định 0 — chỗ giữ cho đúng việc này.
crm đã tự dựng cách dùng lại cho MỘT eval (E15 của `tro-ly-doc-kho`, bản ghi commit vào hồ sơ); 13 eval
model thật còn lại không có gì.

**Đo 11/10 trên lịch sử thật** (`crm` `origin/onehub` `27d47de04`, chỉ đọc; script đo ở phiên này):

| Phép đo | Kết quả |
|---|---|
| Eval khai `model_evals` ở crm | 14 (từ 12 hồ sơ); cả 14 khai `paths` |
| Lần chạy eval model trong dòng `repin` (từ 12/09) | 59 lần, 15 eval — 15 lần đầu, **44 lần chạy lại** |
| — đầu vào không đổi so lần chạy trước của chính eval đó (khối eval + lệnh đã giải + tệp khớp `paths` + cây hồ sơ trừ `run-log`/`evidence-report`) | **17/44 = 39 %** · 7 ngày 04–10/10: 10 lần |
| — đổi vì tệp khớp `paths` · vì lệnh/khối eval · vì cây hồ sơ | 19 · 1 · 7 |
| Làn ghim lại có `tong_ket` (06/10 16:43 → 11/10 00:26) | 81 làn: **15 làn có gọi model** — 21 lần gọi, chi phí đo **15,67 USD**, 204,5 phút · 66 làn không gọi model — 0,63 USD, 371,1 phút |
| Ước tính bỏ được | ~39 % của 15,67 USD ≈ **6 USD / 4,3 ngày (~10 USD/tuần)** và phần phút eval model của các làn đó. Chi phí đo gồm mọi phiên chạy cùng lúc — là trần, không phải số chính xác |
| Ngưỡng mở Đ2 của hạt giống (b) «eval model chạy lại đầu vào không đổi ≥ 5 lần/tuần» | **đạt** (10 lần trong 7 ngày) |

Số dư 43,91 → 32,51 USD trong 14 giờ (ca R1g, 05–06/10) phần lớn do một eval dài (`tra-loi-tin-nhac`
E11) chạy lại cả làn ghim lại bên trong nó — eval model nằm trong làn con đó. Lát này chữa cả hai đường
vì làn con chính là `repin-lane.mjs`.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Đầu vào của eval model liệt kê được từ vật đã có (khối eval, lệnh đã giải, tệp khớp `paths`, cây hồ sơ, tệp lệnh gọi tên) cộng một lệnh dấu vân tay do kho khai (id model, khoá gói) | dùng lại kết quả cũ khi model hay mã đã đổi — xanh sai | chạy định nghĩa băm trên 44 cặp crm | **Đã thử** (bảng trên): 27/44 cặp đổi băm đúng chỗ đổi; phần «`paths` thiếu đầu vào» là giới hạn khai kèm bộ đếm `carry_lech` |
| 2 | Nguồn dùng lại đọc được từ chính `run-log.jsonl` của hồ sơ (dòng `repin` mà eval thật sự chạy) — không cần ghi vào hồ sơ đã ký | phải commit bản ghi như crm E15 — thêm bước tay | làn đã ghi `run-log` cho từng hồ sơ ở mỗi lượt xanh | Đúng theo mã hiện có — làn ghi dòng `repin` vào `run-log` mọi hồ sơ |
| 3 | Bên đọc pin (`lib/evidence-core.cjs`) không phải đổi: dòng mới vẫn mang `evals_exit` đủ, khoá lạ bị bỏ qua | phải chạm `lib/**` → hạng T3, crm chép lại lớp CI | bộ đọc của `main` đọc một dòng có khoá mới | Chưa thử — đo trong vòng (ca đối chứng bộ đọc) |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: đã đạt «Lượt ghim lại không đổi đầu vào của eval model thì chi phí model của eval đó bằng 0» chưa — đo trên làn ghim lại thật của crm sau khi crm cài mốc mang vòng này và bật khoá?
- Kết quả nào là SỐNG: Lượt ghim lại không đổi đầu vào của eval model thì chi phí model của eval đó bằng 0 — ở crm, trong 14 ngày sau khi cài: mọi eval model đủ điều kiện mà đầu vào không đổi đều không chạy (`tong_ket.model_carry` ≥ 1 ở lượt đó, eval vắng khỏi `model_goi`), và `carry_lech` = 0.
- Kết quả nào là CHẾT: chưa đạt «Lượt ghim lại không đổi đầu vào của eval model thì chi phí model của eval đó bằng 0» khi hết timebox — hoặc có ≥ 1 lượt `carry_lech` (dùng lại kết quả mà đầu vào thật đã đổi).
- Timebox: 2026-11-01 (mốc Mốc kế sau đợt thử (số đặt lúc cắt) — lớp mod của Điều phối – Thợ (DP6), gom tín hiệu (L3), trang hồ sơ một việc (X2), một vòng một kết quả cỡ 8–12 tiêu chí (S3), ca chập chờn (G2), eval model thật (G3), bớt câu hỏi ở bước thiết kế (A2); dời ngày 10/10 để kịp timebox Điều phối – Thợ)

## Kết quả prototype

Không dựng prototype — phép thử giả định 1 chạy thẳng trên lịch sử crm (bảng đo ở trên).

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Cách dùng lại E15 (băm năm lớp, hạn 7 ngày, lời dò id model) | `crm` `_acceptance/eval-model-that-dung-luc/contract.md` AC-3, AC-4, AC-11 | triết-lý/logic | có — luật hạn 7 ngày và «đầu vào gồm id model» | — |
| Thiết kế Đ2 (băm, luật carry, `carry_lech`) | `docs/superpowers/specs/2026-10-06-gia-lan-ghim-lai-design.md` §Đ2 | triết-lý/logic | có — thu về eval model, bỏ phần bên đọc | — |
| Lịch sử `run-log` crm làm dữ liệu đo | `crm` `origin/onehub` `27d47de04` | dữ liệu đo | có — chỉ đọc, bộ kiểm dựng fixture do mã sinh | — |

## Cổng 0

- **decision = build** (hạng T2) — owner gõ «Làm» 11/10 trên khuyến nghị bên dưới. Căn cứ: bảng «Đo 11/10 trên lịch sử thật» (17/44 lần chạy lại eval model có đầu vào không đổi; ngưỡng mở Đ2 (b) của hạt giống đạt), giả định 1 đã thử.
- **disposition = …** Căn cứ: — (không prototype)
- **Ngưỡng UAT chốt cùng lúc ký:** bốn dòng của mục «Ngưỡng chết / ngưỡng UAT» — tiền tố đề xuất gỡ cùng chữ «Làm».

**Máy khuyến nghị lúc mời ký (owner chọn đúng lối này):** `build`, hạng **T2**, **một vòng**, phát hành theo mốc 01/11 (engine
không đổi dưới chân crm trước 14/10). Máy tự chốt — ghi ở đây, đảo được bằng một câu ở bất kỳ cổng nào:

| Điểm | Máy chốt | Căn cứ |
|---|---|---|
| Phạm vi | chỉ eval trong `feature_loop.model_evals`, chỉ làn ghim lại (S4 đã có carry theo `paths`) | câu giao của hàng G3; Đ2-cho-mọi-eval giữ hạt giống |
| Bật thế nào | khoá mới, **vắng = hành vi 2.26 nguyên văn** | luật «sửa kit vì một kho phải cân trên mọi kho» (26/09) |
| Hạn dùng lại | **7 ngày** kể từ lần eval thật sự chạy | tiền lệ crm E15, chủ kho ký 10/10 |
| Đầu vào băm | khối eval · lệnh đã giải · mã thoát mong đợi · tệp khớp `paths` · cây hồ sơ trừ tệp làn ghi · tệp lệnh gọi tên · đầu ra một lệnh dấu vân tay kho khai (id model, khoá gói) | giả định 1; đề bài «lệnh, tệp vào, phiên bản model/gói» |
| Eval không khai `paths`, cây bẩn, lệnh dấu vân tay lỗi | luôn chạy | thà tốn tiền còn hơn xanh sai |
| Bên đọc pin | không đổi (giữ T2); giới hạn khai: bên đọc không chứng lại chuỗi dùng lại — ngưỡng mở vòng răng bên đọc: ≥ 1 dòng `repin` mà mục dùng lại trỏ một lượt không có trong `run-log` | giả định 3; cắt đuôi giữ lõi |

## Thước đo thành công → ứng viên criterion

- `tong_ket.model_carry` của dòng `repin` ở crm > 0 khi đầu vào không đổi → AC «đầu vào không đổi thì không gọi model» (chiều im).
- Đổi một byte bất kỳ lớp đầu vào → eval chạy lại → AC chiều đỏ, một ca cho mỗi lớp của băm.
- `carry_lech` = 0 → AC tự kiểm khi hết hạn chạy lại.

## Out of scope từ khám phá

- Dùng lại kết quả cho MỌI eval máy (Đ2 đầy đủ, 59 % lần chạy eval ở crm) — điểm duy nhất đổi cái được tính là «đã chứng» cho cả bộ đo; giữ hạt giống, mở khi lát model đã chạy ở crm.
- Bên đọc chứng lại chuỗi dùng lại (`lib/evidence-core.cjs`, `pre-merge-check.sh`) — đổi hạng sang T3 và bắt crm chép lại lớp CI; giới hạn khai kèm ngưỡng ở trên.
- Carry trong lượt chấm S4 — S4 đã có carry P1 theo `paths`; hồ sơ mới thì đầu vào vốn đổi.
- Đổi cách crm E15 tự dùng lại bản ghi của nó — việc của crm.
- Trần token cho một lượt ghim lại — crm hoãn; chi phí đã hiện ở `tong_ket.chi_phi`.
