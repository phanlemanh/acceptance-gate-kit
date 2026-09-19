---
schema_version: 1
feature: Hồ sơ nghỉ — một dòng sổ có người và lý do làm hồ sơ đã ký rời khỏi luật cũ hoá, luật làn ghim lại và luật làn eval mà không sửa một byte chữ ký; cổng, kiểm lại bằng chứng, bộ quét và thẻ cùng hỏi một hàm; văn xuôi và dòng thiếu vế không tính là nghỉ; kiểu thư mục sử liệu cũ đọc được bằng cờ vàng
slug: ho-so-nghi
owner: phanlemanh@gmail.com
risk_tier: T3      # scripts/pre-merge-check.sh + lib/workspace-record.cjs + scripts/recheck-evidence.cjs — lõi cưỡng chế
surfaces: [cli, ci, docs]
status: signed-off      # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by: Mạnh
approved_at: 2026-09-19T10:29:00Z
design_doc: docs/superpowers/specs/2026-09-19-ho-so-nghi-design.md
---

# Acceptance Contract: ho-so-nghi

## Context

Luật làn eval (owner 08/09, hai lần) nói pin chưa chứng là vi phạm ở MỌI lượt chạy, lối ra
duy nhất là ghim lại. Nó không có lối ra cho món nợ không bao giờ trả được: tiền đề ngoài
chết (OneFlow `normalize-text-vi` — kho nguồn plugin biến mất 26/08, owner quyết 17/09 cho
nghỉ, ghi thẳng «kit không có trạng thái nghỉ nên bỏ qua có ghi nhận mỗi lần merge»), hay vật
đã cố ý đổi sau chữ ký (kit: 14/72 hồ sơ đỏ ở chiến dịch ghim lại 2.16.0, hai trong ba lớp).
Kit tự nghỉ một hồ sơ (`bo-qua-phai-thay-dinh-nghia-phep-do`) bằng cách chuyển hợp đồng vào
`su-lieu/`: cổng mù vì đường dẫn, bản đồ xếp hồ sơ đã ký vào «đã bác từ khám phá».

Người hưởng: owner ở mọi kho tiêu thụ từng gỡ một tính năng (thôi trả một lượt người mỗi PR);
kit (58 hồ sơ ghim lại được). Trace nguyên tố 2: chữ ký là sử liệu, không được giả; cổng · thẻ ·
bản đồ đọc một sự thật. CỘNG, owner gọi tên 19/09 (ADR 0018).

Source input: `_acceptance/ho-so-nghi/opportunity.md` (build 19/09) · báo cáo quét 19/09 mục 1 (đã đối chiếu số) · `docs/superpowers/specs/2026-09-19-ho-so-nghi-design.md`

## Criteria

### AC-1 — Dòng nghỉ hợp lệ đưa hồ sơ đã ký ra khỏi ba luật của cổng, chữ ký giữ nguyên
**Given** BA kho fixture do code sinh, mỗi kho một hồ sơ `signed-off` CÓ CHỮ KÝ NGƯỜI trong báo cáo (thu phạm vi 19/09: dòng nghỉ chỉ có hiệu lực trên hồ sơ đã ký) kích đúng MỘT luật (cổng `continue` sau vi phạm đầu, nên mỗi luật cần fixture riêng): (a) mã đổi sau `verified_commit` → luật cũ hoá; (b) báo cáo cite làn ghim lại mà run-log không có dòng khớp `verified_commit` → luật làn ghim lại; (c) làn khớp nhưng thiếu `evals_exit` → luật làn eval
**When** chạy `scripts/pre-merge-check.sh` trên mỗi kho TRƯỚC khi thêm dòng nghỉ, rồi chạy lại SAU khi sổ quyết định có một dòng `type: nghi` đủ `by`, `decision`, `at`, viết bằng chính khối lệnh rút từ GUIDE
**Then** ba lượt trước thoát khác 0, mỗi lượt ghim đúng chuỗi VIOLATION của luật nó kích (ba chuỗi viết trước rút từ chính script cổng, so bằng nhau 3/3); ba lượt sau thoát 0, 0 VIOLATION cho slug, và mỗi lượt in đúng một dòng `NOTE [<slug>]: hồ sơ nghỉ — <by> <at>: <lý do>`.

### AC-2 — Dòng nghỉ thiếu vế không tính là nghỉ (fail-closed, nói ra vế thiếu)
**Given** cùng fixture AC-1 với dòng `type: nghi` nhưng thiếu `by`, hoặc thiếu `decision`, hoặc `at` không parse được (ba ca, mỗi ca một biến)
**When** chạy cổng
**Then** VIOLATION của làn eval vẫn còn nguyên văn như đối chứng, kèm `NOTE [<slug>]: dòng nghỉ thiếu <by|decision|at> — chấm như hồ sơ đang sống`; bộ quét trả `da-giao` kèm cờ `nghi-thieu-ve:<vế>`; thẻ Cổng Bằng chứng in cờ vàng nêu đúng vế và VẪN có lời mời ký. Ma trận ba ca × ba bộ đọc (cổng · bộ quét · thẻ) so bằng nhau với danh sách viết trước.

### AC-3 — Văn xuôi không phải sự thật
**Given** cùng fixture AC-1 với một dòng `type: descope` mà `decision` nói «hồ sơ nghỉ hẳn» và không có dòng `type: nghi`
**When** chạy cổng, kiểm lại bằng chứng và bộ quét
**Then** cả ba cho kết quả y hệt đối chứng không nghỉ: cổng VIOLATION, kiểm lại đỏ, bộ quét `da-giao` KHÔNG cờ nào — văn xuôi không là nghỉ và cũng không được cờ vàng; kho có hồ sơ kiểu này (OneFlow hôm nay) phải viết thêm một dòng nghỉ.

### AC-4 — Kiểm lại bằng chứng hỏi cùng hàm
**Given** fixture AC-1 với dòng nghỉ hợp lệ, và một fixture đối chứng không nghỉ
**When** chạy `scripts/recheck-evidence.cjs` cho slug ấy (đường `--recheck-all` hoặc slug trong diff)
**Then** hồ sơ nghỉ: thoát 0 và in `NOTE … hồ sơ nghỉ … bỏ kiểm lại`; hồ sơ đối chứng: đỏ nguyên văn như hôm nay.

### AC-5 — Bộ quét và thẻ nói một sự thật, bản đồ không thêm khối
**Given** ba fixture: nghỉ hợp lệ trên hợp đồng đã thông Cổng 2 CÓ chữ ký · dòng nghỉ trên hợp đồng `approved` KHÔNG chữ ký · kiểu thư mục `su-lieu/` (không có `contract.md` ở gốc, có `su-lieu/contract.md`, ô cơ hội `stage: archived`)
**When** chạy `start-scan.mjs --json` và `product-map.mjs`, và render thẻ cho hồ sơ thứ nhất
**Then** thứ nhất: trạng thái `da-nghi`, nhãn «đã giao — đã nghỉ, giữ sử liệu», nằm khối «Đã giao»; thứ hai: KHÔNG nghỉ — giữ nguyên ô của hồ sơ đang sống, kèm cờ `nghi-chua-ky`; thứ ba: `da-dong-ho-so` kèm cờ `nghi-kieu-cu`; tập tên khối của bản đồ BẰNG tập tên khối của bản đồ ở sha nền của vòng (rút từ bản `product-map.mjs` TRƯỚC vòng qua git, KHÔNG rút từ chính bản đang đo); thẻ hồ sơ thứ nhất in dòng «đã nghỉ … chữ ký giữ làm sử liệu» và KHÔNG có lời mời ký.

### AC-6 — Một hàm: phá hàm thì cả ba bộ đọc đổi
**Given** bản sao cây kit mà `hoSoNghi` trong `lib/workspace-record.cjs` bị đổi thành luôn trả `null` (mũi tiêm phải chứng minh đổi được tệp)
**When** chạy lại HSN1 trên bản sao
**Then** cổng VIOLATION, kiểm lại đỏ, bộ quét `da-giao`, thẻ KHÔNG chứa «đã nghỉ» và CÓ lời mời ký (chuỗi rút từ hằng của thẻ) — cả bốn lật, không bộ đọc nào còn nói «nghỉ».

### AC-7 — Vi phân byte và fail-closed khi lib vắng
**Given** fixture AC-1
**When** (a) ghi dòng nghỉ bằng đúng công thức sổ quyết định; (b) chạy cổng trên bản sao đã xoá `lib/workspace-record.cjs`
**Then** (a) băm của `contract.md`, `evidence-report.md`, `run-log.jsonl` trước và sau bằng nhau; (b) cổng in `NOTE [<slug>]: luật nghỉ NOT ENFORCED — node/lib vắng` và VIOLATION như đối chứng không nghỉ.

### AC-8 (judgment) — Người ở kho làm được trong một phút, bằng tiếng sản phẩm
**Given** mục GUIDE «Cho một hồ sơ nghỉ» và dòng thẻ Cổng Bằng chứng của hồ sơ nghỉ
**When** hội đồng đọc như người ở kho tiêu thụ vừa gặp một hồ sơ chết tiền đề
**Then** biết viết dòng nghỉ bằng công thức sổ có sẵn (một khối lệnh bấm được, chính khối E1 chạy), biết chữ ký không bị sửa, biết mở lại bằng một dòng `supersedes` (AC-10 đo); không thuật ngữ mã trong dòng thẻ; không câu nào hứa điều kit không đo (Later: lệnh riêng có khoá).

### AC-9 — Cây thật của kit đọc được ngay
**Given** cây kit tại HEAD
**When** chạy `start-scan.mjs --json` và `product-map.mjs --check`
**Then** `bo-qua-phai-thay-dinh-nghia-phep-do` mang cờ `nghi-kieu-cu`; bản đồ khớp; và tập slug ở «hồ sơ hỏng» là TẬP CON của tập ấy ở **một sha cố định trước vòng** (quan hệ, không phải hằng số 0; sha ghi thẳng trong ca, không dùng ref dịch theo lần gộp — neo vào `origin/main` chết ngay sau khi nhánh vào nhánh chính).

### AC-10 — Mở lại: dòng `supersedes` trỏ đúng dòng nghỉ làm hồ sơ sống lại ở cả bốn bộ đọc
**Given** fixture AC-1(c) có dòng nghỉ hợp lệ, rồi thêm một dòng sổ `supersedes: <id dòng nghỉ>`
**When** chạy cổng, kiểm lại, bộ quét và thẻ
**Then** cả bốn cho kết quả y hệt đối chứng không nghỉ (VIOLATION · đỏ · `da-giao` · thẻ mời ký); dòng `supersedes` trỏ id KHÁC thì hồ sơ vẫn nghỉ (đối chứng trong cùng ca).

### AC-11 — Dòng nghỉ trên hồ sơ CHƯA KÝ không có hiệu lực, và bốn bộ đọc cùng nói ra
**Given** fixture AC-1(c) với một dòng `type: nghi` đủ ba vế, nhưng báo cáo KHÔNG có `human_signoff` (hai biến: vắng hẳn · chỗ-giữ của khuôn)
**When** chạy cổng, kiểm lại bằng chứng, bộ quét và thẻ
**Then** cả bốn cho kết quả y hệt đối chứng không nghỉ (VIOLATION · đỏ · ô của hồ sơ đang sống · thẻ mời ký); cổng in đúng một dòng `NOTE [<slug>]: có dòng cho nghỉ nhưng hồ sơ CHƯA có chữ ký người`; bộ quét mang cờ `nghi-chua-ky`. Đối chứng dương trong cùng ca: thêm chữ ký thật vào báo cáo thì CẢ BỐN lật sang nghỉ.

## Coverage

Ba trục độc lập, quét bằng morphological-scan (preset test-matrix), 40 ô, 11 ô lõi.

- **Trục bộ đọc** `[thước CE: bốn tệp thật — scripts/pre-merge-check.sh · scripts/recheck-evidence.cjs · scripts/start-scan.mjs (bản đồ chiếu từ đây) · scripts/gate-card.js (hỏi bộ quét, gate-card.js:845)]`: cổng → AC-1, AC-2, AC-3, AC-7 · kiểm lại → AC-4, AC-3 · bộ quét/bản đồ → AC-5, AC-9 · thẻ → AC-5, AC-8.
- **Trục hình thức nghỉ** `[thước CE: ba ca thật — dòng sổ OneFlow 17/09 · thư mục su-lieu của kit · khuôn sổ quyết định trong SKILL feature-loop]`: dòng hợp lệ → AC-1 · dòng thiếu vế (ba biến) → AC-2 · văn xuôi → AC-3 · su-lieu cũ → AC-5, AC-9 · không nghỉ (đối chứng) → AC-1, AC-3, AC-4.
- **Trục trạng thái trước nghỉ** `[thước CE: DA_THONG_CONG_2, lib/workspace-record.cjs:97 · chuKyThat, lib/evidence-core.cjs:1127]`: đã ký → AC-1, AC-5 · chưa ký (vắng chữ ký · chỗ-giữ) → AC-11 · kiểu sử liệu cũ → AC-5, AC-9.
- **Cắt ngang mọi ô**: một hàm (bốn bộ đọc) → AC-6 · vi phân byte → AC-7 · lib vắng fail-closed → AC-7 · tiếng người → AC-8 · mở lại → AC-10 · dòng nghỉ trong ca đo do KHỐI LỆNH GUIDE sinh (round-trip bên viết → bên đọc) → AC-1, AC-7.
- `[NGÀNH: GitHub archived repository — lưu trữ chỉ-đọc giữ trọn lịch sử, không chạy CI]` và `[NGÀNH: Bazel tags=["manual"] — phép đo còn đó, khai không chạy trong lượt chung]` là hai ứng viên đã gật thành hình dạng của AC-1 và AC-5; không dòng `[GIẢ ĐỊNH]` nào còn treo.

## Đường đo

Ngưỡng ở `opportunity.md` đo ở kho sau khi nhận 2.17.0, không ở vòng này; vòng này bảo đảm vật:

- «OneFlow nghỉ bằng một dòng sổ, cổng xanh, 0 lần bỏ qua có ghi nhận trong 7 ngày» ← AC-1, AC-2 (dòng viết được bằng công thức có sẵn, cổng đọc); số đếm: sổ quyết định của kho + nhật ký merge, đọc ở Cổng Giá trị.
- «Kit ghim lại ≥ 58/72» ← AC-1, AC-4 (hồ sơ nghỉ rời làn); số đếm: chiến dịch ghim lại mốc kế (`chien-dich-ghim-lai.json`).
- «Bản đồ hai kho xếp hồ sơ nghỉ đúng chỗ, không phải đã bác» ← AC-5, AC-9.
- «OneFlow đọc được kiểu cũ» — KHÔNG: kiểu descope văn xuôi phải thêm một dòng nghỉ (Out of scope có tên); chỉ kiểu thư mục `su-lieu/` của kit đọc được bằng cờ ← AC-5.
- «Chữ ký hay verdict không bị sửa; máy không tự ghi nghỉ» ← AC-7 (vi phân) · vế «máy không tự ghi» KHÔNG có thước máy trong vòng này — khai ở Notes.

## Out of scope

- **Hồ sơ CHƯA có chữ ký người không được nghỉ** (thu phạm vi, owner quyết 19/09 sau lượt chấm 2). Gồm cả hồ sơ `machine-cleared` — làn V không có chữ ký nên không nghỉ được; muốn nghỉ thì ký trước, hoặc bác/xếp lại ở tầng cơ hội. Căn cứ: đo tay cho thấy một dòng sổ biến hồ sơ `verdict: REJECT` chưa ai ký thành cổng xanh.
- Không đổi `status`/`verdict`/`verified_commit` của hồ sơ nghỉ — owner từ chối 17/09; đường A trong spec bị bác.
- Không công nhận thư mục `su-lieu/` làm nghi thức chính (đường C) — chỉ đường đọc-cũ có cờ.
- Không gắn luật làn eval hay luật cũ hoá vào diff PR — ô `cong-chan-theo-ho-so-khong-theo-diff`.
- Không dựng lệnh `/acceptance-gate:nghi` có khoá model-invocation ở vòng này — Later, cùng lúc với chiến dịch nghỉ 14 hồ sơ của kit.
- Kiểu «status giữ nguyên + dòng descope văn xuôi» (OneFlow hôm nay) KHÔNG tính là nghỉ và KHÔNG có cờ vàng — kho ấy viết thêm một dòng nghỉ; giả định 3 của ô cơ hội đã sửa theo.
- Không thêm khối mới cho bản đồ sản phẩm — bộ kiểm bản đồ ở kho tiêu thụ đếm khối cố định.
- Không chạy `repin-lane --plan` (bộ phân loại trước làn) — việc kế, phụ thuộc ô này.

## Notes

**Ngân sách và bảng ba kết cục (viết trước lượt chấm 1, theo hạt giống 19/09):** tối đa 3 lượt
chấm S4. Đạt → ký · không đạt chỉ vì thước → khai giới hạn có tên rồi ký · không đạt có lỗi vật →
park, mốc 2.17.0 cắt với phần đã ký và hồ sơ mốc ghi thẳng kết quả nào ở kho chưa đạt.

**Dự báo 5 dòng số (luật (c)):** làm-xong→quyết-được: = (một ngày như 2.16.0) · lượt gọi người:
4 trong thiết kế (Đáng đã ký · Phạm vi · 1.5 · Bằng chứng), mục tiêu 0 ngoài thiết kế · lượt
chấm bị hạ tầng đốt: 0 (đường nền chạy trước) · token máy: ↓ so `thuoc-co-cua` nhờ một tệp ca
và fixture chung · phút máy/lượt chấm: =. Điều kiện tin cậy: đường verdict không đổi thành phần.

**Vế không có thước máy:** «máy không tự ghi dòng nghỉ» — cùng tầng tin cậy với `decided_by`
và `human_signoff` hôm nay (khoá model-invocation chỉ có trên lệnh, không có trên tệp sổ). Ghi
Known limits khi ký nếu vòng không dựng thêm.

### Known limits (người ký nhận, Cổng Bằng chứng 2026-09-19)

Owner chọn «ký với giới hạn» ở lượt chấm 3 (hết ngân sách ba lượt, verdict REJECT). Bảng ba
kết cục viết trước lượt 1 đã lường ca này: «không đạt chỉ vì thước → khai giới hạn có tên rồi
ký». Vật sản phẩm qua 12 phép đo máy và 5 lệnh suite ở CẢ BA lượt; hai mục dưới đây là phép
đo, không phải hành vi.

**TRONG hợp đồng — hai mục, người ký nhận:**

- **GH-1 (AC-5, mức cao) — bản đồ và bộ quét còn lệch nhóm ở hai hình dạng.** Vị từ nghỉ đặt
  ở hai vị trí khác nhau trong hai đường: bộ quét hỏi ngay sau khi đọc trạng thái; bản đồ hỏi
  SAU chốt hồ-sơ-hỏng và SAU nhánh phán quyết nghiệm thu. Hệ quả: hồ sơ nghỉ có phiên nghiệm
  thu thì bản đồ in «đã nghiệm thu giá trị» trong khi thẻ nói «đã nghỉ»; hồ sơ nghỉ có ô cơ
  hội hỏng thì bản đồ gọi «không đọc được hồ sơ» còn bộ quét vẫn nói nghỉ. Ca HSN5-map chỉ phủ
  hai hình dạng mà hai bên tình cờ đồng ý. Tái lập: dựng fixture hồ sơ đã ký + `uat-session.md`
  `verdict: release` + một dòng nghỉ hợp lệ, rồi so `start-scan.mjs --root` với `product-map.mjs
  --root`. Đường rẻ khi mở lại: gọi vị từ ở CÙNG một điểm trong cả hai đường.
- **GH-2 (AC-10, mức thấp) — chân «thẻ» của chiều mở-lại là một assert vắng-mặt.** HSN10 kiểm
  thẻ KHÔNG chứa «đã nghỉ»; thẻ vỡ hay rỗng vì bất kỳ lý do nào cũng đọc thành «đã lật». Chiều
  ngược (thẻ phải CÓ chuỗi mời ký) không được đo ở chân ấy.

**Phép đo của chính vòng này — ba mục, khai thẳng:**

- **GH-3 (mức cao) — đối chứng nền của HSN9 CHƯA BAO GIỜ CHẠY.** Ca dựng bản nền bằng
  `git archive` rồi chạy bộ quét trên đó, nhưng bộ quét bản nền thoát mã 2 («khuôn
  opportunity-template không đọc được» — bản archive thiếu `skills/`), stdout 0 byte, nên tập
  so là rỗng và phép so tập-con luôn đúng. Đo tay 19/09, thoát mã 2 xác nhận. Đường rẻ: thêm
  `skills` vào `git archive`, và assert bản nền thoát 0 TRƯỚC khi tin kết quả.
- **GH-4 (mức cao) — phép đo bản đồ không có chiều đỏ.** Gỡ trọn nhánh nghỉ khỏi
  `product-map.mjs` thì ca HSN5-map vẫn xanh. Đường rẻ: thêm một mũi tiêm gỡ nhánh ấy trên bản
  sao và đòi ca đỏ.
- **GH-5 (mức trung) — mười eval dùng CHUNG một lệnh trần.** Khoá `hsn_rang` chỉ chạy tệp ca
  và đọc mã thoát; tên ca mà từng eval gọi trong `expected` là văn xuôi, không phần máy nào
  ghim. Bỏ hẳn một khối ca thì eval tương ứng vẫn xanh. Khác nếp ~18 khoá láng giềng trong
  cùng khối `executors.script`, vốn ghim dòng PASS đích danh.

**Hai vế đã khai từ trước, giữ nguyên:**

- «Máy không tự ghi dòng nghỉ» không có thước máy — cùng tầng tin cậy với chữ ký duyệt. Lưới
  hiện tại: sổ để lại vết · cửa veto · điều kiện hồ sơ phải đã có chữ ký người (thu phạm vi).
- Hồ sơ `machine-cleared` (làn V, không chữ ký) không nghỉ được — đánh đổi có chủ ý của nhát
  cắt; muốn nghỉ thì ký trước.

**Lộ thêm lúc ký — ghi hạt giống, không mở ô:** bộ tổng hợp của làn chấm viết khối eval hội
đồng theo khuôn mà chính bộ kiểm lại bằng chứng từ chối (mã lượt tự đúc + trường người-kiểm là
văn xuôi), nên báo cáo bộ máy sinh đỏ ở lượt ký và phải sửa khuôn khối bằng tay. Hồ sơ đã ký
trước đó dùng khuôn khác và qua sạch. Sổ: `ho-so-nghi#22` · hạt giống:
`docs/plans/2026-09-19-hat-giong-khuon-judgment-bo-may-sinh-bi-recheck-tu-choi.md`.

**Hội đồng chia phiếu:** E8 ở lượt 3 là 2 đạt / 1 trượt ở góc bám-đặc-tả — bất đồng thật, người
ký đọc phán quyết kèm cả ba lá phiếu trong báo cáo rồi quyết.
