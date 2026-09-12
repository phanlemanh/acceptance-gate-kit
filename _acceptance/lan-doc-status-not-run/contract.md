---
schema_version: 1
feature: Làn ghim lại và bên đọc pin cùng loại eval khai `status: not-run` từ MỘT nguồn — pin nói ra ô nào không đo, và hồ sơ lành thôi bị đọc thành nợ
slug: lan-doc-status-not-run
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm lib/evidence-core.cjs ∈ t3_paths (định nghĩa dùng chung sống ở bên đọc)
surfaces: [cli]
status: draft
approved_by:
approved_at:
design_doc: docs/superpowers/specs/2026-09-12-lan-doc-status-not-run-design.md
---

# Acceptance Contract: lan-doc-status-not-run

## Context

Làn ghim lại chạy mọi eval có `executor` ∈ {test, script} và KHÔNG đọc `status`,
nên nó chạy cả ô mà hồ sơ đã ký khai `status: not-run` kèm lý do.

Đo 12/09/2026 ở `phanlemanh/OneFlow` nhánh `chore/kit-2-10-0`: hồ sơ
`chong-mat-khoa-byo-giao-dien` eval **E10** khai `status: not-run`,
`cmd: config:executors.design.gate`; làn chạy nó, `design-gate.mjs` trả **exit 4**
với `"reason": "no target file given"` (chính nó khai 4 = bad usage, vì đích do S4
truyền); làn kết luận ĐỎ và không ghi gì. Hồ sơ LÀNH đó là một trong ba mục nợ
đang treo `phanlemanh/OneFlow#116`, và nó suýt bị lưu kho như «tiền đề đã chết» —
tức lỗi của KIT đang được đọc thành nợ của kho tiêu thụ.

Sửa một bên là chưa hết: bên đọc `checkRepinEvals` (`lib/evidence-core.cjs:409-416`)
lấy danh sách từ `machineEvalIds` rồi đòi `evals_exit` đủ mọi id, nên bỏ qua ô ở bên
viết chỉ đổi thông điệp thành «evals_exit lacks eval(s) E10».

Bán kính đo được: **1** eval khai `not-run` trên 8 kho (oneflow 1 · kit · ap · fps ·
media-library · map · crm · policy-graph-hub đều 0).

**Người hưởng:** người chạy chiến dịch ghim lại ở kho tiêu thụ — khỏi phải chọn giữa
«chôn một hồ sơ tốt» và «cổng đỏ mãi». **Trace nguyên tố 2**: làn đang tự dối bằng
cách đo một ô nó không được đo.

Source input: prompt owner 12/09/2026 («vá làn kit trong một vòng nhỏ») + đo sống ở
OneFlow · thiết kế: `docs/superpowers/specs/2026-09-12-lan-doc-status-not-run-design.md`.

## Criteria

### AC-1 (một nguồn) — định nghĩa «eval máy đáng ghim» chỉ tồn tại MỘT chỗ

**Given** một `evals.yaml` có ô `executor: script` khai `status: not-run` và các ô khác không khai
**When** bên VIẾT (`repin-lane.mjs`) và bên ĐỌC (`machineEvalIds` trong `lib/evidence-core.cjs`) cùng rút danh sách eval máy
**Then** hai bên trả về **CÙNG một tập id** trên cùng đầu vào, và tập đó KHÔNG chứa ô `not-run`; phép đo lấy danh sách từ đầu ra THẬT của cả hai đường (gọi hàm của bên đọc; chạy `repin-lane.mjs` rồi rút id từ `evals_exit` nó ghi), không so với một danh sách gõ tay.
**Chiều đỏ:** bản sao `repin-lane.mjs` hoàn nguyên về bộ lọc riêng `MACHINE.has(...)` → phép đo ĐỎ ghim «hai bên trả tập khác nhau», nêu tên id lệch.

### AC-2 (bên viết bỏ qua thật) — ô `not-run` KHÔNG được thi hành

**Given** kho git tạm do MÃ SINH trong chính lần chạy, có một hồ sơ đã ký; ô `not-run` của nó mang `cmd` ghi một **tệp dấu** vào thư mục tạm khi chạy
**When** chạy làn (có và không `--write`)
**Then** làn thoát **0**, **tệp dấu KHÔNG tồn tại** (ô chưa từng chạy), `evals_exit` không có id đó, và các ô còn lại vẫn có đủ.
**Đối chứng dương cùng kho:** gỡ dòng `status: not-run` → tệp dấu XUẤT HIỆN và id có trong `evals_exit`.
**Chiều đỏ:** bản sao bỏ bước đọc `status` → tệp dấu xuất hiện, phép đo ĐỎ ghim «ô not-run đã bị thi hành».

### AC-3 (bên đọc nhận pin thiếu id đã khai) — không còn VIOLATION oan

**Given** dòng pin do làn ở AC-2 ghi (thiếu id của ô `not-run`) + `evals.yaml` + báo cáo đã ký của cùng hồ sơ
**When** chạy `checkRepinEvals` và `scripts/recheck-evidence.cjs`
**Then** **0 lỗi**, và thông điệp «evals_exit lacks eval(s) …» KHÔNG xuất hiện.
**Đối chứng dương:** cùng pin nhưng thiếu id của một ô CHẠY ĐƯỢC → vẫn VIOLATION, thông điệp gọi đúng id thiếu.
**Chiều đỏ:** bản sao `machineEvalIds` hoàn nguyên (lọc chỉ theo executor) → phép đo ĐỎ ghim «pin hợp lệ bị báo thiếu id».

### AC-4 (hai vế — chặn đường lách) — `not-run` mà báo cáo đã đo là XUNG ĐỘT

**Given** một hồ sơ mà `evals.yaml` khai ô X `status: not-run` NHƯNG báo cáo đã ký có khối eval mang mã thoát cho X
**When** chạy làn, và chạy bên đọc trên một pin thiếu X
**Then** bên VIẾT dừng **exit 2** trước khi ghi byte nào, thông điệp gọi tên hồ sơ + id X + cả hai vế; bên ĐỌC ghi **VIOLATION** gọi tên X là «khai not-run nhưng báo cáo đã ký có mã thoát».
**Vật quan sát cho «chưa ghi byte nào»** (gap-probe P1-5): băm nội dung `run-log.jsonl` và `evidence-report.md` trước/sau lượt xung đột phải GIỐNG nhau, và thư mục hồ sơ không có tệp mới nào. **Đối chứng dương cùng kho:** lượt chạy XANH phải làm HAI băm ĐỔI — không có chân đó thì băm-giống-nhau không phân biệt «không ghi» với «không chạy»; và gỡ khối eval X khỏi báo cáo → làn xanh, bên đọc 0 lỗi.
**Chiều đỏ:** bản sao bỏ vế 2 → ca xung đột đi qua, phép đo ĐỎ ghim «đường lách trạng-thái mở».

### AC-5 (đường đọc-cũ) — pin CŨ mang đủ id vẫn phải xanh

**Given** một dòng pin CŨ do **WRITER THẬT của bản TRƯỚC vá** ghi — dựng bản base bằng `git archive <sha-trước-vá> lib scripts feature-loop` lấy TRỌN thư mục (không chép danh sách file tay, P150), chạy `repin-lane.mjs` của bản đó trên fixture mã-sinh rồi lấy đúng dòng nó ghi; KHÔNG soạn tay theo khuôn bên đọc (gap-probe P0-2)
**When** bên đọc mới chấm dòng đó
**Then** **0 lỗi** — khoá thừa không bị phạt; đối chứng dương: bên đọc CŨ chấm cùng dòng cũng 0 lỗi. Vế «không hồ sơ nào hoá đỏ» ghim **BA** thứ chứ không phải một đẳng thức (gap-probe P1-4): hai lượt recheck đều **thoát 0**; **tổng số hồ sơ đã chấm** in ra và phải **lớn hơn 0**; **tập TÊN** hồ sơ vi phạm giống nhau theo tập. Chân dương: tiêm một pin thiếu id của ô CHẠY ĐƯỢC vào bản sao corpus → số vi phạm **TĂNG đúng 1** và gọi đúng tên hồ sơ.
**Chiều đỏ:** bản sao đổi luật thành «tập id phải KHỚP CHÍNH XÁC» → phép đo ĐỎ ghim tên hồ sơ cũ bị hoá đỏ.

### AC-6 (pin nói ra) — ô không đo phải hiện ở CẢ HAI chỗ máy-đọc và người-đọc

**Given** làn xanh trên hồ sơ có ô `not-run`
**When** đọc dòng JSON trong `run-log.jsonl` và mục `### Re-pin lần <N>` trong `evidence-report.md`
**Then** dòng JSON có khoá `evals_not_run` là mảng chứa đúng id bị loại, và dòng `sha:` nối hậu tố `· không chạy theo hồ sơ: <id>` (nhiều id thì liệt đủ, thứ tự như trong `evals.yaml`); hồ sơ KHÔNG có ô `not-run` thì **cả hai** chỗ vắng hoàn toàn hậu tố và khoá đó.
**Chiều đỏ:** bản sao bỏ bước nối hậu tố → phép đo ĐỎ ghim «pin im lặng về ô không đo».

### AC-7 (ca thật) — hình dạng hồ sơ của OneFlow đi qua được

**Given** fixture do MÃ SINH dựng lại đúng hình dạng đo được ở OneFlow: `evals.yaml` 14 ô máy trong đó một ô khai `status: not-run` trỏ một lệnh **thiếu đối số nên thoát 4**, và báo cáo đã ký có 13 khối eval (không có khối cho ô đó)
**When** chạy làn `--write` rồi chạy `recheck-evidence.cjs`
**Then** làn **xanh**, pin ghi 13 id, `evals_not_run` chứa ô kia, recheck **0 lỗi**.
**Chiều đỏ:** trả `lib/evidence-core.cjs` về bản trước vá → cùng fixture cho làn ĐỎ với đúng thông điệp exit-4 đã đo ở OneFlow, phép đo ĐỎ ghim tên ca.

### AC-8 (bảng bộ máy) — hàng mới của `AG-ENGINE-TABLE` đi cùng lời gọi mới

**Given** làn gọi thêm export nào từ `lib/` cho việc lọc/xung đột
**When** chạy ca thường trực `tests/scripts/repin-lane-lop-cu.test.mjs` (GL01–GL08, có chân đo QUAN HỆ)
**Then** mọi tên hàm làn/recheck gọi đều ⊆ hàng của khối `AG-ENGINE-TABLE`, và GL03 xanh.
**Chiều đỏ:** thêm một lời gọi `core.<X>` mà không thêm hàng → GL03 ĐỎ gọi đúng tên `<X>`.

### AC-9 (chuẩn hoá hình dạng khai) — ma trận toàn phần, không so chuỗi thô

**Given** bảy hình dạng của giá trị khai trong `evals.yaml`: trơn · bọc nháy kép · bọc nháy đơn · viết hoa toàn phần · viết hoa chữ đầu · thừa khoảng trắng hai đầu · gạch dưới thay gạch ngang
**When** cả hai đường thi hành đọc chúng (gọi `machineEvalIds`, và chạy làn)
**Then** **sáu dạng đầu BỊ LOẠI**, dạng thứ bảy **KHÔNG** bị loại; **số assert = số phần tử** của bảng ca, số dạng đếm LÚC CHẠY từ bảng — lệch số thì ĐỎ «số ô lệch».
**Chiều đỏ:** bản sao so chuỗi thô không chuẩn hoá → phép đo ĐỎ ghim đúng dạng lọt.
**Vì sao có AC này** (gap-probe P1-3): kho vừa mất một mốc vì bộ giải cắt nháy vô điều kiện; một giá trị bọc nháy đọc thành khác nghĩa là đúng lớp lỗi đó ở chiều ngược.

### AC-10 (chỗ chuỗi xuất hiện) — chỉ TRƯỜNG thật được tính

**Given** cùng một chuỗi chỉ trạng-thái nằm ở năm chỗ: trong comment `#` · trong thân `expected:` dạng folded · trong thân `expected:` dạng literal · dưới `paths:` · là TRƯỜNG thật của eval
**When** hai bên rút tập id
**Then** **chỉ chỗ cuối** làm ô bị loại; bốn chỗ đầu KHÔNG ảnh hưởng tập id; **số assert = số chỗ**.
**Chân tự soi:** chạy làn trên CHÍNH `_acceptance/lan-doc-status-not-run/evals.yaml` → `evals_not_run` phải là mảng **RỖNG** (tệp này nói về giá trị đó suốt nhưng không khai ô nào như vậy).
**Chiều đỏ:** bản sao quét theo dòng không phân biệt thân block scalar → phép đo ĐỎ ghim đúng id bị gán oan.
**Vì sao có AC này** (gap-probe P0-1): bản `evals.yaml` ĐẦU của chính vòng này đã có chuỗi đó trong thân `expected:` của E2 — nếu bộ quét theo dòng, làn sẽ loại E2 vĩnh viễn và mọi chiến dịch sau không bao giờ chạy lại ca «bên viết bỏ qua thật» mà vẫn xanh.

## Coverage

Trục (quét morphological 12/09, preset test-matrix):

- **A — BÊN:** A1 bên viết (`repin-lane.mjs`) · A2 bên đọc (`machineEvalIds`/`checkRepinEvals`) · A3 cả hai cùng một đầu vào. [thước CE: hai đường thi hành có thật trong kho — lớp lỗi «writer/reader trôi khỏi nhau» của CLAUDE.md]
- **B — TRẠNG THÁI Ô:** B1 chạy được · B2 khai `not-run` · B3 khai `not-run` mà báo cáo đã ký có mã thoát (đường lách). [thước CE: corpus 8 kho — B2 có đúng 1 ca thật; B3 chưa có ca thật, dựng bằng fixture mã-sinh]
- **C — TUỔI PIN:** C1 pin mới bản này ghi · C2 pin cũ mang đủ id. [thước CE: `[NGÀNH: Protobuf schema evolution]` — bản đọc mới gặp bản ghi cũ phải xanh; và corpus pin cũ có thật trong kit]
- **D — NÓI-RA:** D1 dòng JSON máy-đọc · D2 dòng `sha:` người-đọc. [thước CE: khuôn `REPIN-TEMPLATE` + tiền lệ hậu tố `đạt-có-giới-hạn` của ADR 0016]
- **E — HÌNH DẠNG & CHỖ KHAI** (thêm sau gap-probe): E1 bảy hình dạng giá trị (nháy · hoa/thường · khoảng trắng · gạch dưới) · E2 năm chỗ chuỗi xuất hiện (comment · folded · literal · paths · trường thật). [thước CE: lớp lỗi bộ-giải-cắt-nháy của mốc 2.11.0 + chính bản evals.yaml đầu của vòng này đã dẫm bẫy folded]

**Core** = A3×B1 · A1×B2 · A2×B2 · A1/A2×B3 · A2×C2 · D1 · D2 · E1 · E2 · quan hệ bảng bộ máy → AC-1…AC-10.

**Lớp cross-cutting áp mọi ô Core:** mỗi phép đo mới đi kèm **cặp hai chiều trên cùng
fixture** + **thông điệp ghim** (MEASURE-BIRTH-CLAUSE); mọi fixture do **mã sinh**
trong chính lần chạy, không viết tay theo khuôn bên đọc.

**Never:** eval `ui-check`/`judgment` (đã ngoài làn từ ADR 0014, mở rộng là đổi hợp
đồng khác) · thêm giá trị `status` nào ngoài `not-run` (corpus không có) ·
sửa `evals.yaml` hay báo cáo của hồ sơ ĐÃ KÝ ở bất kỳ kho nào (sử liệu bất biến) ·
`pre-merge-check.sh` (luật đọc sống ở `lib/evidence-core.cjs`, chạm thêm là mở phạm vi vô cớ).

## Out of scope

- Ghim lại hồ sơ `chong-mat-khoa-byo-giao-dien` của OneFlow — việc của chiến dịch
  rollout sau khi bản vá này lên mốc phát hành, không thuộc vòng này.
- Lưu kho `normalize-text-vi` (tiền đề ngoài đã chết) và `ds-debt-tap-primary-soft`
  của ap (eval neo `baseSha` bất biến) — hai lớp khác, owner đã quyết lưu kho riêng.
- Đổi `expected_exit`/`đạt-có-giới-hạn` đã có (ADR 0016) — vòng này chỉ NỐI thêm một
  hậu tố cùng khuôn.
- Bất kỳ thay đổi nào ở `scripts/pre-merge-check.sh` và `start-scan.mjs` — đang là
  phạm vi của vòng `cua-veto-sau-chu-ky` chạy song song.

## Notes

- **Vòng meta, owner gọi tên 12/09/2026.** Luật chiều rộng (b) cho tối đa MỘT vòng
  meta giữa hai release và chỉ khi owner gọi tên. **Neo ngoài có thật:** một hồ sơ
  lành của OneFlow đang bị đọc thành nợ, và nó treo PR #116 — giá trị chạm người
  dùng kit ở bản phát hành tới.
- **Ô mở dưới luật NỚI 2026-09-07?** Phần CỘNG duy nhất là khoá `evals_not_run` trên
  dòng pin và hậu tố trên dòng `sha:` — cả hai tồn tại để pin THÔI im lặng về ô không
  đo (nguyên tố 2). Phần còn lại là TRỪ: gỡ bộ lọc trùng ở bên viết, hợp về một nguồn.
  Vòng này KHÔNG thêm lượt gọi người nào.
- **Đếm theo chữ luật, điều kiện thu hồi luật nới đã CHẠM** (2.10.0: vòng #158 15 lượt,
  #163 10 lượt; 2.11.0: hồ sơ mốc 8 lượt; trần 4) — nêu ở đây để lần đọc sau khỏi dựng
  lại; owner CHƯA quyết gì về việc thu hồi.
- **T3 nên Cổng 1.5 cần người** theo thiết kế; trần 4 lượt gọi người.
- **Không có `opportunity.md`** nên không có mục `## Đường đo`.
- **Giới hạn khai trước:** AC-5 đo «không hồ sơ nào hoá đỏ» bằng cách so số vi phạm
  hai lượt trên CÙNG cây — nó bắt được hồi quy toàn cục, nhưng không chứng được một
  kho tiêu thụ nào khác; các kho đó nhận bản vá theo mốc phát hành và chiến dịch ghim
  lại của mốc là chỗ đo thật.
