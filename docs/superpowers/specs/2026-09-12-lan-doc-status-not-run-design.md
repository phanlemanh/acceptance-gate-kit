# Làn ghim lại phải tôn trọng `status: not-run` — thiết kế

2026-09-12 · slug `lan-doc-status-not-run` · hạng T3 (chạm `lib/evidence-core.cjs`)

## Vấn đề, đo được

Làn ghim lại chạy MỌI eval có `executor` ∈ {test, script}, không đọc `status`.
Hồ sơ đã ký có thể khai một ô là `status: not-run` kèm lý do (giới hạn đã biết,
trình ở Cổng 2) — làn vẫn chạy ô đó.

Ca thật, đo 12/09/2026 ở `phanlemanh/OneFlow` nhánh `chore/kit-2-10-0`:

- `_acceptance/chong-mat-khoa-byo-giao-dien/evals.yaml` eval **E10** khai
  `status: not-run`, `cmd: config:executors.design.gate`.
- Làn chạy nó; `design-gate.mjs` trả **exit 4** với `"reason": "no target file
  given"` — chính nó khai 4 = «bad usage», vì đích do S4 truyền, không có trong
  lệnh trơn.
- Làn kết luận **ĐỎ**, không ghi gì. Hồ sơ LÀNH đó là 1 trong 3 mục nợ đang
  treo PR #116 của OneFlow, và nó suýt bị lưu kho như «tiền đề đã chết».

Bán kính: đúng **1** eval khai `not-run` trên 8 kho (kit 0 · ap 0 · fps 0 ·
media-library 0 · map 0 · crm 0 · policy-graph-hub 0 · oneflow 1).

## Vì sao sửa một bên là chưa hết

Bên đọc `checkRepinEvals` (`lib/evidence-core.cjs:409-416`) lấy danh sách từ
`machineEvalIds(evalsText)` rồi đòi `evals_exit` có ĐỦ mọi id. Nếu chỉ bên viết
bỏ qua ô, pin thiếu khoá và cổng vẫn đỏ — chỉ đổi thông điệp thành
«evals_exit lacks eval(s) E10». Hai bên phải rút cùng một định nghĩa.

## Thiết kế

**1. Một nguồn.** `lib/evidence-core.cjs` giữ định nghĩa duy nhất «eval máy đáng
ghim»: `executor` ∈ `REPIN_MACHINE_EXECUTORS` **và** `status` (đã chuẩn hoá,
lower-case, trim) **khác** `not-run`. `machineEvalIds` rút qua định nghĩa đó;
`repin-lane.mjs` THÔI tự lọc bằng `MACHINE.has(...)` và gọi cùng hàm. Bên VIẾT
và bên ĐỌC không còn hai bản luật.

**2. Hai vế, chống đường lách.** Một ô chỉ được loại khi đủ HAI vế — theo đúng
tiền lệ `expected_exit` (ADR 0016):

- vế 1: `evals.yaml` khai `status: not-run`;
- vế 2: báo cáo đã ký KHÔNG mang mã thoát nào cho ô đó
  (`extractEvalBlockExits(reportText)` không có id ấy).

Vế 2 đo được trên ca thật: báo cáo của `chong-mat-khoa-byo-giao-dien` có **13**
khối eval trong khi `evals.yaml` có **14** — E10 không có khối nào. Nếu hồ sơ
TỪNG đo ô đó rồi ai đó thêm `status: not-run` vào sau, vế 2 sẽ hở: bên viết
dừng exit 2 có tên, bên đọc ghi VIOLATION có tên. Không có đường im lặng.

**3. Pin phải NÓI RA.** Ô bị loại không được biến mất câm:

- dòng JSON mang thêm khoá `"evals_not_run":["E10"]` — khoá MỚI, bản đọc cũ bỏ
  qua khoá lạ nên không vỡ (`[NGÀNH: Protobuf schema evolution]`);
- dòng `sha:` của mục Re-pin nối hậu tố `· không chạy theo hồ sơ: E10`, cùng
  khuôn với `· đạt-có-giới-hạn: E5=2` đã có.

**4. Đường đọc-cũ.** Bên đọc mới gặp pin CŨ (mang đủ id, kể cả ô nay bị loại)
phải vẫn xanh: luật hiện tại chỉ tính `missing`, khoá THỪA không bị phạt. Đây là
bất biến phải có phép đo, không phải lời hứa — pin cũ trong corpus không được
hoá đỏ vì bản nâng.

## Không làm trong vòng này

- KHÔNG sửa `evals.yaml`/báo cáo của hồ sơ đã ký ở bất kỳ kho nào.
- KHÔNG mở rộng sang `ui-check`/`judgment` (đã ngoài làn từ ADR 0014).
- KHÔNG thêm trạng thái mới nào ngoài `not-run`; corpus chỉ có giá trị đó.
- KHÔNG chạm `pre-merge-check.sh` — luật đọc sống ở `lib/evidence-core.cjs`.
