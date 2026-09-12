---
schema_version: 1
feature: Làn ghim lại và bên đọc pin cùng loại eval khai `status: not-run` từ MỘT nguồn — pin nói ra ô nào không đo, và hồ sơ lành thôi bị đọc thành nợ
slug: lan-doc-status-not-run
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm lib/evidence-core.cjs ∈ t3_paths (định nghĩa dùng chung sống ở bên đọc)
surfaces: [cli]
status: implemented
approved_by: Phan Le Manh
approved_at: 2026-09-12
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

- AC-1 (một nguồn): Given một bản khai eval có ô `executor: script` khai giá trị không-chạy và các ô khác không khai, When bên VIẾT (`repin-lane.mjs`) và bên ĐỌC (`machineEvalIds`) cùng rút danh sách eval máy, Then hai bên trả CÙNG một tập id và tập đó không chứa ô kia — tập bên đọc lấy bằng cách GỌI hàm, tập bên viết lấy từ khoá `evals_exit` làn THẬT SỰ ghi, không so với danh sách gõ tay. Chiều đỏ: bản sao hoàn nguyên bộ lọc riêng ở bên viết → ĐỎ ghim «hai bên trả tập khác nhau» kèm id lệch.

- AC-2 (bên viết bỏ qua thật): Given kho git tạm do MÃ SINH, ô khai không-chạy mang lệnh ghi một TỆP DẤU, When chạy làn có và không `--write`, Then làn thoát 0, tệp dấu KHÔNG tồn tại, `evals_exit` thiếu đúng id đó và đủ các id còn lại. Đối chứng dương cùng kho: gỡ dòng khai đi → tệp dấu XUẤT HIỆN và id có mặt. Chiều đỏ: bản sao bỏ bước đọc trường khai → tệp dấu xuất hiện, ĐỎ ghim «ô không-chạy đã bị thi hành».

- AC-3 (bên đọc nhận pin thiếu id đã khai): Given dòng pin do làn AC-2 ghi cùng bản khai và báo cáo đã ký của hồ sơ, When chạy `checkRepinEvals` và `recheck-evidence.cjs`, Then 0 lỗi và chuỗi «evals_exit lacks eval(s)» KHÔNG xuất hiện. Đối chứng dương: pin thiếu id một ô CHẠY ĐƯỢC → vẫn vi phạm, gọi đúng id thiếu. Chiều đỏ: `machineEvalIds` hoàn nguyên → ĐỎ ghim «pin hợp lệ bị báo thiếu id».

- AC-4 (hai vế chặn đường lách): Given hồ sơ khai ô X là không-chạy NHƯNG báo cáo đã ký có khối eval mang mã thoát cho X, When chạy làn và chạy bên đọc trên pin thiếu X, Then bên viết dừng exit 2 và bên đọc ghi vi phạm, cả hai gọi tên hồ sơ, id X và cả hai vế. Vật quan sát cho «chưa ghi byte nào»: băm nội dung sổ chạy và báo cáo trước/sau phải GIỐNG nhau, không tệp mới nào; đối chứng dương: lượt chạy XANH phải làm hai băm ĐỔI. Chiều đỏ: bản sao bỏ vế 2 → ca xung đột đi qua, ĐỎ ghim «đường lách mở».

- AC-5 (đường đọc-cũ): Given dòng pin CŨ do WRITER THẬT của bản trước vá ghi — bản base dựng bằng `git archive` lấy TRỌN thư mục, không chép danh sách file tay, When bên đọc mới chấm nó, Then 0 lỗi; đối chứng dương: bên đọc CŨ chấm cùng dòng cũng 0 lỗi. Vế «không hồ sơ nào hoá đỏ» ghim BA thứ: hai lượt recheck đều thoát 0, tổng số hồ sơ đã chấm in ra và lớn hơn 0, tập TÊN hồ sơ vi phạm giống nhau; chân dương: tiêm một pin thiếu id ô chạy được → số vi phạm TĂNG đúng 1, gọi đúng tên. Chiều đỏ: bản sao đổi luật thành «tập id khớp chính xác» → ĐỎ ghim tên hồ sơ cũ hoá đỏ.

- AC-6 (pin nói ra): Given làn xanh trên hồ sơ có ô khai không-chạy, When đọc dòng sổ chạy và mục ghim lại trong báo cáo, Then dòng sổ có khoá `evals_not_run` chứa đúng id bị loại theo thứ tự bản khai, và dòng `sha:` nối hậu tố «không chạy theo hồ sơ»; hồ sơ không có ô nào như vậy thì cả hai chỗ vắng hoàn toàn. Hai chỗ đọc bằng hai bộ đọc khác nhau. Chiều đỏ: bản sao bỏ bước nối hậu tố → ĐỎ ghim «pin im lặng về ô không đo».

- AC-7 (ca thật): Given fixture do MÃ SINH dựng đúng hình dạng đo ở OneFlow — 14 ô máy, một ô khai không-chạy trỏ lệnh thiếu đối số nên thoát 4, báo cáo đã ký có 13 khối eval, When chạy làn `--write` rồi recheck, Then làn xanh, pin ghi 13 id, khoá nói-ra chứa ô kia, recheck 0 lỗi. Chiều đỏ: trả bên đọc về bản trước vá → cùng fixture cho làn ĐỎ với đúng thông điệp exit-4 đã đo ở OneFlow, ĐỎ ghim tên ca.

- AC-8 (bảng bộ máy): Given làn gọi thêm export nào từ thư viện cho việc lọc hoặc kiểm xung đột, When chạy ca thường trực của làn lớp-cũ, Then mọi tên hàm làn và recheck gọi đều nằm trong bảng điểm chạm bộ máy, và chân quan hệ xanh. Chiều đỏ có sẵn: thêm một lời gọi không có hàng trong bảng → ĐỎ gọi đúng tên hàm thiếu.

- AC-9 (chuẩn hoá hình dạng khai): Given bảy hình dạng của giá trị khai — trơn, bọc nháy kép, bọc nháy đơn, viết hoa toàn phần, viết hoa chữ đầu, thừa khoảng trắng hai đầu, gạch dưới thay gạch ngang, When cả hai đường thi hành đọc chúng, Then sáu dạng đầu BỊ LOẠI và dạng thứ bảy KHÔNG bị loại, số assert bằng số phần tử đếm lúc chạy từ bảng ca — lệch số thì ĐỎ «số ô lệch». Chiều đỏ: bản sao so chuỗi thô không chuẩn hoá → ĐỎ ghim đúng dạng lọt.

- AC-10 (chỗ chuỗi xuất hiện): Given cùng một chuỗi chỉ trạng-thái nằm ở năm chỗ — trong chú thích, trong thân mô tả dạng gấp, trong thân mô tả dạng nguyên khối, dưới danh sách đường dẫn, và là TRƯỜNG thật của eval, When hai bên rút tập id, Then chỉ chỗ cuối làm ô bị loại và bốn chỗ đầu không ảnh hưởng tập id, số assert bằng số chỗ. Chân tự soi: chạy làn trên CHÍNH bản khai của vòng này → danh sách nói-ra phải RỖNG. Chiều đỏ: bản sao quét theo dòng không phân biệt thân mô tả → ĐỎ ghim đúng id bị gán oan.

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
