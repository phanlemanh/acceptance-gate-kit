---
schema_version: 1
slug: nhan-trang-thai-va-reality
feature: Thẻ Cổng Bằng chứng gọi đúng tên cạnh gãy (đỏ-bàn-đo ≠ đỏ-vật, hệ thống chết) và mở ô ký kèm giá; reality có quyền đóng hồ sơ bằng thao tác cổng người thứ bảy; test của kho thôi bị đếm là thước — để ba hồ sơ ở crm đóng được hoặc chấm được mà không dựng thêm một dòng thước nào
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:
  disposition: archive
---

## Vấn đề & ai gặp

Gốc: crm/_acceptance/nhan-ung-dung-noi-tieng-viet — vật ở prod từ `ff3fb8bf`, hồ sơ `approved / BLOCKED / chữ ký rỗng`, chặn PR crm #65; owner quyết đóng 18/09 mà kit không có chỗ ghi (`crm@112c4f5a`)
Gốc: crm/_acceptance/dieu-phoi-30-ngay-dau — trần nhát thước nổ vì ba nhát vào `apps/api/test/*.spec.ts` (TDD của kho); thẻ BLOCKED in «không cần làm gì» khi E11 đỏ vì khoá `.next`; hai lượt chấm huỷ vì tác nhân đọc «Dừng nó» thành lệnh (nhãn hệ thống chết không có)

**Ai gặp:** owner ở Cổng Bằng chứng (bị khoá ngoài thẻ khi bàn đo hỏng; không đóng
được thứ đã ở prod) · phiên Claude Code ở `crm` (bị phạt khi làm TDD; phải dựng bàn
đo để thoả cổng) · người đọc sau ở `crm` (ba hồ sơ tàng hình chặn PR #65).

**Cơn đau, đo 21/09** (`docs/findings/2026-09-21-dinh-vi-lai-kit-vat-tao-ra-ban-giao.md`):
- Tháp `thuoc-/ho-so-khai-dung-tieng` mọc trên vật đã ở prod: +4 622 dòng thước / +81
  dòng sản phẩm (57 : 1), ≥ 6,6 M token, 13 lượt chấm — vì enum trạng thái có 6 giá trị
  và không giá trị nào là «reality đã chấm».
- `gate-card.js:978-985`: thẻ BLOCKED không câu gộp, routing rỗng, `oneShotG2 = null`
  — người lái không có ô để chấp nhận một đồng hồ chưa đọc. Nửa luật đúng đã có ở Cổng
  1 (`NEN_DO_FLAG`, dòng 91) và ở lối «ghi hạn chế rồi ship» (dòng 1077) — nhưng chỉ cho
  mục ngoài hợp đồng.
- `feature-loop/scripts/lib/phan-loai.mjs:17`: `DO_GLOBS` xếp `**/*.spec.*` của kho
  là thước → bộ đếm nhát phạt đúng việc hiến pháp gọi là đúng đường.
- `s4-args` lối (3) «mở vòng có chủ ngữ là thước» chỉ đường quay lại vòng đang thoát;
  `TRAN_NHAT` nổ 5 lần, miễn 5 lần.

Hồ sơ này là **vòng meta duy nhất** của cửa sổ giữa 2.17.0 và mốc `crm` sẽ cài — owner
gọi tên 21/09 (luật chiều rộng (b)); kế hoạch điều phối:
`docs/superpowers/plans/2026-09-21-dieu-phoi-cach-moi-kit-va-crm.md` §3.

## Giả định chốt sinh tử

1. **Ba hồ sơ `crm` đóng/chấm được chỉ bằng bản 2.18.0, không thêm thước.** Sai nếu
   sau khi cài, một trong ba vẫn cần dựng bàn đo hay sửa `evals.yaml` để rời nhóm đang
   dở. Kết quả làm owner đổi ý: sau rollout, hồ sơ tàng hình ở `crm` ≠ 0.
2. **Đỏ-bàn-đo phân biệt được với đỏ-vật bằng dữ liệu đã ghi** (mã 97/127, tool-kill,
   `cannotRun`, tên lệnh), không cần LLM đoán. Sai nếu ma trận ca ở AC-2 cần một lens.
3. **Thước chỉ-đọc trong S4 thay được trần nhát mà không đẻ lượt gọi người mới.** Sai
   nếu phiên `crm-A` gặp một lần dừng ngoài thiết kế do lưới mới.
4. **Đường đọc-cũ đủ**: hồ sơ không mang trạng thái/quyết định mới render y hôm nay.
   Sai nếu `pre-merge-check` hay thẻ đỏ trên hồ sơ cũ ở bất kỳ kho nào sau khi cài.

## Ngưỡng chết / ngưỡng UAT

Đo ở `crm` sau khi cài 2.18.0 (T3 của kế hoạch), lệnh ở §7 kế hoạch:

| Số | Trước 21/09 | Ngưỡng UAT | Chết |
|---|---|---|---|
| hồ sơ `crm` tàng hình (`approved` + evidence đỏ + chữ ký rỗng) | 3 | 0 | > 0 sau rollout |
| PR crm #65 | CONFLICTING, chặn bởi hồ sơ tàng hình | merge | vẫn chặn vì hồ sơ |
| lượt chấm `dieu-phoi` bị hạ tầng/hệ thống đốt | 3 | 0 | ≥ 1 với lý do đã có nhãn |
| lượt gọi người ngoài thiết kế của vòng này | — | 0 (T3: ≤ 4 trong thiết kế) | > 4 |
| dòng M3 ở hồ sơ mốc 2.18.0 | không có | `k / 3` | thiếu hoặc N = 0 |
| thước / vật của chính vòng này (dòng diff) | — | ≤ 3 : 1 | > 5 : 1 |

## Kết quả prototype

Không có bản mẫu — vòng đổi engine, không đổi mặt người ngoài thẻ Cổng 2 (AC-2, AC-4);
hình dạng thẻ mới soi ở S1-D trên fixture, không dựng proto riêng.

## Nguồn ngoài & phạm vi kế thừa

- Luật: khối ĐỊNH VỊ trong `CLAUDE.md` (owner duyệt 21/09) · ADR 0020 (Đ8, Đ9 đã phê)
  · ADR 0002 (thao tác cổng người khoá model-invocation) · ADR 0018 (CỘNG cần phê).
- Đã có sẵn để dùng lại, không dựng mới: `NEN_DO_FLAG` (Cổng 1) · lối «ghi hạn chế rồi
  ship» (`gate-card.js:1077`) · `status: not-run` + luật HAI VẾ (2.12) · `expected_exit`
  (2.11, ADR 0016) · chụp băm hồ sơ đã ký (2.15, `chup-ho-so-da-thong.mjs`) — thước
  chỉ-đọc trong S4 là **mở rộng** của cái này · INFRA-EXIT-CODES 97/127 (2.5) · tool-kill
  rule (2.3) · `revisit` trong sổ quyết định.
- Kế thừa từ vòng bị park `o-chi-mo-khi-co-neo-ngoai`: dạng `Gốc:` trỏ kho tiêu thụ.

## Cổng 0

Quyết: **build** — vòng meta duy nhất của cửa sổ, owner gọi tên 21/09. Ba lối đã cân:
(a) *build* — ba hồ sơ `crm` là kho chờ nhận theo cấu trúc, lần đầu vế 4 luật (b)
được thoả bằng hình dạng; (b) *park, để `crm` đi đường `chore` như `112c4f5a`* — rẻ hôm
nay, nhưng ba hồ sơ vẫn tàng hình và tháp mọc lại ở hồ sơ kế; (c) *chỉ làm Đ8* — đóng
được hai hồ sơ nhưng `dieu-phoi` vẫn bị trần và thẻ khoá ở lượt kế, và đó là vòng thứ
hai trong cùng cửa sổ. Khuyến nghị (a). Hạng **T3**: đổi enum + thêm thao tác cổng
người = khó-đảo.

## Thước đo thành công → ứng viên criterion

Từ §3 kế hoạch điều phối — S1 rút thành AC Given/When/Then, mỗi AC một chiều đỏ:
1. `DO_GLOBS` thôi xếp test của kho là thước; trần nhát + ba lối gỡ; **thước của hồ sơ
   đang chấm chỉ-đọc trong S4** (băm `evals.yaml` + `rang/` + tệp test trước/sau, lệch =
   lỗi làn) — chiều đỏ: tác nhân giả sửa `evals.yaml` giữa S4 → làn đỏ có tên.
2. Thẻ Cổng 2: đỏ vì bàn đo / hệ thống chết ≠ đỏ vì vật; ô ký mở kèm cạnh gãy có tên +
   ba lối + giá; ghi bằng `revisit`; BLOCKED chỉ còn cho hệ thống chết chưa thử lại —
   chiều đỏ: eval exit 1 do vật → thẻ khoá như cũ.
3. Trạng thái thứ bảy `da-cham-boi-thuc-te` + thao tác cổng người thứ bảy khoá
   model-invocation (P32 mở rộng) + thẻ mở phiên / bản đồ sản phẩm nhận + đường đọc-cũ —
   chiều đỏ: model-invoke → khoá; hồ sơ cũ → render y nguyên.
4. Thẻ Cổng 2 in dòng ý định trích nguyên văn từ `opportunity.md` khi có (lát mỏng
   của Đ7, chưa trọng số) — chiều đỏ: không `opportunity.md` → không in, không cờ.
5. Hồ sơ mốc 2.18.0 mang dòng `ĐẠT đã ký → prod đỏ: k / N` — chiều đỏ: N = 0 → in «vô
   hiệu», cấm in «0 sự cố».

## Out of scope từ khám phá

- Đ4 (ui-check thành lệnh, bỏ W8) · Đ5 (hội đồng theo yêu cầu, synthesize → render)
  · Đ6 (review chỉ diff vật) · Đ10 (dời tháp `rang/` của `crm`) · Đ7 đầy đủ (trọng số +
  chính sách) · Đ11 răng — mỗi cái chờ một ca thật gọi tên, vào hạt giống, **không mở
  ô** trong cửa sổ này.
- Rollout 2.18.0 ra kho khác ngoài `crm` — chiến dịch re-pin theo release, cửa sổ kế.
- Dựng bàn đo cho E9/E12 của `ho-so-khai-dung-tieng` — vật ở prod, đóng theo AC-3.
