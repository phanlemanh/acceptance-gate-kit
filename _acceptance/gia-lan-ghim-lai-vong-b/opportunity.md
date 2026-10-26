---
schema_version: 1
slug: gia-lan-ghim-lai-vong-b
feature: Giá làn ghim lại, Vòng B — tệp test chỉ làm cũ hồ sơ gọi tên nó (Đ1) · dùng lại kết quả eval theo băm đầu vào cho mọi eval (Đ2)
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:                     # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:
prototype:
  base_commit:
  disposition:
---

Gốc: crm-onehub/_acceptance/kiem-cheo-sau-gop — cùng đợt crm-onehub/_acceptance/eval-model-that-dung-luc.
Hạt giống: `docs/plans/2026-10-06-hat-giong-gia-lan-ghim-lai-vong-b.md` (tách từ `_acceptance/gia-lan-ghim-lai/`, 06/10).
Đề nghị mở: Mac Studio trên crm-onehub#375, 26/10, theo câu chủ kho đã duyệt «đếm ngưỡng, đủ thì đề nghị MacBook Pro mở».

## Vấn đề & ai gặp

**Người gặp:** phiên thợ crm chờ làn ghim lại sau mỗi lần gộp vào `onehub` (một khoá s4 chia cho bốn dãy),
và chủ kho crm, người trả giờ máy và tiền AI Gateway. Mốc mở→gộp ở crm từ 21/10: trung vị 7,7 giờ, p75
14 giờ (52 PR, số của giám sát). Ghim lại sau mỗi lần gộp là chỗ nghẽn lớn nhất của đoạn ký→gộp.

**Đo 26/10 trên `origin/onehub` `485bdc710`** (chỉ hồ sơ đã gộp, dòng `kind: repin` trong 344 tệp
`_acceptance/*/run-log.jsonl`, cửa sổ 12/10–26/10; máy MacBook Pro đo lại độc lập, khớp số Mac Studio
ở ba dòng đầu):

| Phép đo | Kết quả | So ngưỡng của hạt giống |
|---|---|---|
| Khối lượng | 232 làn ghim lại, 58,0 giờ làn; 72 làn trong 7 ngày gần nhất; 340 cặp ghim lại liền nhau (cùng hồ sơ, sha đổi) | — |
| Eval model thật chạy | 28 lần / 14 ngày · **5 lần / 7 ngày** | (b) đòi ≥ 5 lần/tuần **với đầu vào không đổi** — 5 là tổng số lần chạy, không phải số lần đầu vào không đổi |
| Dùng lại theo băm cho eval model | `model_carry` = 0 ở cả 232 làn; **0/232 làn có `evals_hash`** — crm chưa khai `feature_loop.model_carry_cmd` | Cơ chế đã có trong kit từ 2.27.0 (hồ sơ `eval-goi-model-that-khong-chay`, hàng G3) — đang **tắt** ở crm |
| Đ1 — cặp ghim lại mà mọi tệp chạm `paths` đều là tệp test và evals.yaml không nhắc tên tệp đó | **trần 6 cặp / 6 làn** trên 340 cặp / 232 làn = **2,6 % số làn**; 2,2 / 58,0 giờ = **3,8 % giờ làn** | Điều kiện mở chủ kho đặt 06/10: tiết kiệm **< 10 % thì bỏ Đ1**. (a) đòi ≥ 3 làn — 6 là trần thô, chưa trừ làn có hồ sơ khác cùng cũ |
| Ca VK6 (crm#567 đổi tên tệp test, `trang-bo-okr` cũ qua `apps/app/test/**`) | Thật, kéo ba lượt ghim ≈ 9 giờ khoá s4 — nhưng PR **chưa gộp**, nên không vào bộ đếm «đã gộp» | — |
| Phần eval trong `wall_s` | **Không đọc được** — dòng pin không ghi giờ từng eval | (b) nhánh «phút eval ≥ 50 % `wall_s`» không đo được |
| Chi phí đo 14 ngày (`tong_ket.chi_phi`) | 35,89 USD — trần, gồm mọi phiên chạy cùng lúc | — |
| Đ2 cho mọi eval, số 06/10 | 1 726 / 2 912 lần chạy eval giữ được theo băm — đo TRƯỚC khi E11 rời làn | Chưa đo lại sau E11 |

Cách đếm Đ1 (để người khác chạy lại): mỗi hồ sơ, xếp dòng `repin` theo `ts`; với mỗi cặp liền nhau có
dòng sau trong cửa sổ và `sha` khác, lấy `git diff --name-only <sha trước> <sha sau>` bỏ `_acceptance/`,
giữ tệp khớp một glob `paths` của `evals.yaml` (bản ở sha sau); cặp tính là Đ1 khi tập ấy khác rỗng, mọi
tệp là tệp test (`test/`, `tests/`, `__tests__/`, `e2e/`, `*.test.*`, `*.spec.*`) và tên tệp không xuất hiện
trong `evals.yaml`. Là TRẦN: một làn ghim nhiều hồ sơ chỉ tránh được khi mọi hồ sơ của nó đều thuộc ca này.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Đ1 cắt được ≥ 10 % làn ghim lại ở crm | Vòng tốn 10–20 giờ máy (T3, chạm `lib/**`) để cắt ≤ 2,6 % làn | Bộ đếm cặp ở trên | **Đã thử — sai**: trần 2,6 % làn, 3,8 % giờ |
| 2 | Eval model chạy lại với đầu vào không đổi là chi phí kit chưa chữa | Vòng B làm lại việc G3 đã giao | Đọc khoá crm + `evals_hash` trên pin | **Đã thử — sai**: kit đã có, crm chưa bật khoá |
| 3 | Đ2 cho eval thường (không gọi model) cắt được phần đáng kể của 58 giờ | Suite luôn chạy lại; nếu suite chiếm phần lớn `wall_s` thì dùng lại eval không rút ngắn làn | Giờ từng eval trong một làn | **Chưa đo được** — pin không ghi giờ từng eval |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] Sau khi crm cài mốc mang Vòng B, giờ làn ghim lại trên mỗi lần gộp vào `onehub` giảm bao nhiêu?
- Kết quả nào là SỐNG: [đề xuất] giờ làn ghim lại / lần gộp giảm ≥ 25 % trong 14 ngày sau khi crm bật khoá, không ca dùng lại nào sai (`carry_lech` = 0 mà eval đỏ ở lượt chạy thật kế tiếp)
- Kết quả nào là CHẾT: [đề xuất] giảm < 10 %, hoặc một hồ sơ ký trên kết quả dùng lại mà vật đã đổi
- Timebox: [đề xuất] 14 ngày sau khi crm nhận mốc

## Kết quả prototype

Không dựng prototype. Ba phép đo trên lịch sử thật thay cho nó (bảng trên).

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Thiết kế Đ1/Đ2 + phản biện 06/10 | `docs/superpowers/specs/2026-10-06-gia-lan-ghim-lai-design.md` · `_acceptance/gia-lan-ghim-lai/gap-probe.md` | triết-lý/logic | có | — |
| Số đếm crm | crm-onehub `origin/onehub` `485bdc710`, dòng `repin` | triết-lý/logic | có | — |

## Cổng 0

- **decision = …** Căn cứ: …
- **disposition = …** Căn cứ: không có prototype.
- **Ngưỡng UAT chốt cùng lúc ký:** …

**Khuyến nghị của máy: `park`.** Căn cứ: Đ1 dưới chính vạch chủ kho đặt (2,6 % < 10 %); phần Đ2 có
số đếm sống (eval model) đã có trong kit và chỉ chờ crm bật khoá; phần Đ2 còn lại (eval thường) chưa
có số nào đọc được. Chỗ nghẽn thật — ghim lại sau MỖI lần gộp, 232 làn / 14 ngày — không nằm ở Vòng B.

Việc kế nếu `park` (không phải câu hỏi, giám sát chuyển cho crm): crm khai `feature_loop.model_carry_cmd`
— dòng `evals_hash` bắt đầu có trên pin, và chính nó đếm số lần đầu vào không đổi cho ngưỡng (b).

Khuôn đếm để mở lại (Mac Studio đếm, 14 ngày sau khi crm bật khoá):
1. **Giờ từng eval:** mỗi làn xanh, giây của từng lệnh suite và từng eval (từ nhật ký làn
   `.acceptance-runs/<slug>/repin-<run_id>/` hoặc đồng hồ quanh từng lệnh), cộng thành «phút eval /
   `wall_s`». Mở lại Đ2-cho-mọi-eval khi tỉ lệ ≥ 50 % ở ≥ 7 ngày.
2. **Tệp làm cũ:** mỗi lần pre-merge báo hồ sơ cũ, ghi `(hồ sơ, tệp chạm paths, PR gộp)`. Mở lại Đ1
   khi số làn chỉ-vì-tệp-test-không-gọi-tên ≥ 10 % tổng làn trong 14 ngày.

## Thước đo thành công → ứng viên criterion

- Giờ làn ghim lại / lần gộp (`wall_s` cộng theo `run_id`, chia số commit gộp vào `onehub`) — trước/sau.
- `tong_ket.model_carry` / `model_goi` trên 14 ngày — tỉ lệ dùng lại thật.

## Bảng nợ kế thừa (CHỈ khi disposition: keep)

| Path | Giữ / Dựng lại | Chạm t3_paths? | Ghi chú |
|---|---|---|---|

## Out of scope từ khám phá

- Đổi nhịp ghim lại từ «mỗi lần gộp» sang «mỗi mốc phát hành» — đó là chỗ nghẽn lớn nhất theo số đo, nhưng là luật vận hành của crm (charter mục 1d đã khai cho kit), không phải Vòng B.
- Bật `feature_loop.model_carry_cmd` ở crm — việc của crm, không phải mã kit.
- Ca VK6 riêng lẻ — PR chưa gộp; một ca không đủ dựng thước.
