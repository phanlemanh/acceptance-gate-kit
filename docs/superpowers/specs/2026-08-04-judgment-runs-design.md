# judgment-runs — field khai trên eval mà máy bỏ im lặng

Ngày: 2026-08-04 · slug `judgment-runs` · risk_tier T3 · làn design D0 (kit không có web UI)

## Triệu chứng đã đo

Feature `motion-floor` khai `runs: 3` cho hai eval `executor: judgment` (E1, E6).
Đo trên artifact thật của nó:

```
round eval  proposal    votes
1     E1    UNCERTAIN     3      ← đúng MỘT dòng panel, 3 vote = 3 lens
2     E1    UNCERTAIN     3
3     E1    UNCERTAIN     3
```

`evidence-report.md` mục `## Variance` ghi *"none — no eval in this round carries
runs > 1"* trong khi `evals.yaml` khai `runs: 3` cho cả hai. Không cảnh báo, không
lỗi, không một dòng log.

## Khung bài toán bị đặt sai — và khung đúng

Báo cáo ban đầu đọc đây là *"field thiết kế cho judgment lại chỉ chạy cho command"*.
Không phải. Spec quyền uy cho người viết eval — `skills/acceptance/references/eval-executors.md:67`
— nói rõ, **có chủ ý**:

> "`runs` is ignored on `ui-check`/`judgment` (judgment already runs a 3-lens panel)."

Mã khớp spec đó chính xác. Cái sai nằm ở **hai chỗ mô tả khác** dùng chữ "LLM" mà
không nêu giới hạn executor:

| Nơi | Chữ hiện tại | Người viết eval đọc thành |
|---|---|---|
| `feature-loop/workflows/acceptance-verify.js:23` | "OPTIONAL int>1: eval ngẫu nhiên (LLM) chạy N lần" | eval LLM = judgment ⇒ dùng được |
| `feature-loop/skills/feature-loop/SKILL.md:130` | "int>1 = eval ngẫu nhiên/LLM" | như trên |
| `codex/feature-loop-codex/.../SKILL.md:383` | (bản dịch cùng nội dung) | như trên |

Nên lỗi thật là: **"ignored" ghi trong một file tham chiếu không phải một cái máy
chịu nói ra.** Field im lặng ở mọi mặt người-đọc, và số liệu cho thấy điều đó đã
dẫn tới hiểu sai hàng loạt chứ không phải một lần.

## Quét không gian (morphological scan)

### Ngữ cảnh

- **Chân sản phẩm** — `CLAUDE.md` (bất biến maintainer), `CONTEXT.md` (glossary),
  `eval-executors.md` (spec eval), và **số liệu thật: 225 eval trên 18 workspace**
  (đếm bằng máy, không liệt kê từ trí nhớ).
- **Chân ngành** (bậc a — tên chắc, lớp "unknown/inert config key"):
  **Kubernetes `--validate=strict`** — API server từng âm thầm bỏ field lạ trong
  manifest, chuyển sang từ chối tường minh vì im lặng gây sự cố thật ·
  **Ajv `strict: true`** — báo lỗi khi keyword khai mà không có hiệu lực, đúng lớp
  này · **Terraform** — `An argument named "x" is not expected here` ·
  **JSON Schema `additionalProperties: false`**.
  Bài học hội tụ: im lặng là chế độ tệ nhất; và khi **đã có consumer ngoài luồng**,
  lối ngành chọn là **cảnh báo nêu tên field**, không phải từ chối cứng.

### Trục

- **Trục A — field khai trong `evals.yaml`**: `runs` | `paths` | `question`+`inputs` |
  `steps` | `expected` | `notes` | `cmd`/`ref`
  *[thước CE: hợp của **bên VIẾT** (225 eval thật, đếm bằng máy) và **bên ĐỌC**
  (args contract `acceptance-verify.js:14-47`) — chính là seam mà CLAUDE.md cảnh báo
  "bên VIẾT và bên ĐỌC trôi khỏi nhau"; liệt kê từ một phía là sót theo thiết kế]*
- **Trục B — executor nhận**: `test` | `script` | `ui-check` | `judgment`
  *[thước CE: enum đóng do `eval-executors.md` định nghĩa — ME/CE hiển nhiên]*
- **Trục C — mặt phải nói ra sự thật**: `log()` (/workflows) | `result` trả main loop |
  `run-log.jsonl` | `evidence-report.md ## Variance` | thẻ Gate 2 | doc/spec
  *[thước CE: các mặt một round S4 THẬT sinh ra — lấy từ `result` object
  (`acceptance-verify.js:700-725`) + template evidence + `/acceptance-card`, đối chiếu
  round 1-3 có thật của motion-floor]*

Độc lập: field nào cũng viết được lên executor nào (A ⊥ B); nơi sự thật lộ ra là lựa
chọn riêng, không bị A/B ép (C ⊥ A,B).

### A × B — ô nào có hiệu lực

| field \ executor | test | script | ui-check | judgment |
|---|---|---|---|---|
| `runs` | ✅ | ✅ | ❌ **inert** (hardcode `runs:1`, dòng 412) | ❌ **inert** (fan-out không đọc) — **10 lượt dùng thật** |
| `paths` | ✅ (P1) | ✅ (P1) | ✅ (P1) | ❌ **inert** (P1 lọc `executor !== 'judgment'`) — **2 lượt dùng thật** |
| `question`+`inputs` | ❌ inert | ❌ inert | ❌ inert | ✅ |
| `steps` | ❌ inert | ❌ inert | ✅ | ❌ inert |
| `expected` | ✅ | ✅ | ✅ | ⚠️ tới synthesize, KHÔNG tới judge |
| `notes` | — | — | — | — (không có trong args contract, 40 lượt dùng) |
| `cmd`/`ref` | ✅ | ✅ | ⚠️ bị thay bằng `ui-check:<id>` | — |

**Ô có người dùng thật mà inert: đúng hai** — `runs`×judgment (10) và `paths`×judgment (2).
Các ô inert còn lại có 0 lượt dùng trong 225 eval.

### Core (2/28 ô có nghĩa ≈ 7%)

1. **`runs` trên `judgment`/`ui-check`** — ô được báo cáo; 10 lượt dùng thật, 100% số
   lần `runs` xuất hiện trong repo.
2. **`paths` trên `judgment`** — cùng lớp, quét mới thấy; 2 lượt dùng thật. Vá một ô mà
   bỏ ô kia là đúng hình dạng lỗi CLAUDE.md cấm ("sửa một chỗ rồi viết lại đúng nó vài
   dòng bên dưới — phải sửa theo LỚP").

Cộng ba mặt của trục C bắt buộc phải nói ra: `log()`, `result` → thẻ Gate 2, và
`## Variance` của evidence-report (mặt duy nhất đã đo được lời sai).

### Later

- `question`/`inputs` trên test/script, `steps` ngoài ui-check — 0 lượt dùng; guard tổng
  quát sẽ phủ khi nào có người dùng thật.
- `expected` không tới tay judge (5 lượt) — có thể là thiếu sót thật, nhưng là câu hỏi
  thiết kế panel, không phải lớp im-lặng-field. Contract riêng.
- `notes` chưa có trong spec lẫn args contract (40 lượt) — vô hại vì thuần chú thích,
  nhưng đang là "field ma". Ghi vào spec là việc rẻ, để đợt sau.

### Never

- **Allowlist đóng cho mọi key lạ trong `evals.yaml`** — không gian mở, và bài học đã ghi
  ("Allowlist phải có RED ngoài danh sách"): allowlist biến fail-loud thành fail-silent
  cho đúng thứ nằm ngoài danh sách. Ta chặn ở **điểm nghẽn đầu ra** (ô inert đã biết),
  không ở đầu vào.
- **Bắt 6 workspace đã ký sửa `evals.yaml`** — CLAUDE.md cấm bắt consumer migrate hàng loạt.

### Cross-cutting áp mọi ô Core

- Đối chứng dương trước, rồi ghim **đúng thông điệp** (không chỉ mã thoát).
- Fixture do **code sinh trong chính lần chạy**; mọi path suy từ vị trí script, không hardcode.
- Mirror `plugins/` + `codex/` sync cùng lượt (test P30 chặn drift).

## Ba đường — và đường được đề xuất

### (a) Làm `runs` có hiệu lực cho judgment: N panel độc lập → pass_rate/variance

**Chống lại, ba lý do — lý do 1 mang tính quyết định:**

1. **Mâu thuẫn cấu trúc với P3 carry-forward.** P3 nói: *inputs không đổi (hash khớp)
   ⇒ ĐỪNG chấm lại, dùng panel round trước.* `runs>1` nói: *inputs không đổi ⇒ chấm lại
   N lần.* Hai cơ chế phát biểu hai luật ngược nhau trên **cùng một điều kiện**. Ship cả
   hai là để lại một mâu thuẫn phải phân xử ở mọi round về sau.
2. **Đổi thiết kế, không phải sửa lỗi.** Panel 3-lens *chính là* cơ chế hấp thụ nhiễu đã
   chọn ("judgment already runs a 3-lens panel"). Lấy 3 mẫu cùng một lens đo nhiễu lấy
   mẫu; lấy 3 lens đo bất đồng quan điểm — cái sau đáng giá hơn và đã có.
3. **Nhân 3 chi phí judge để lấy tín hiệu mà routing T3 bỏ qua.** motion-floor: 6 → 18
   agent judge mỗi round. Mà T3 đã đẩy **mọi** judgment item cho người ở Gate 2 bất kể
   proposal — thêm panel không đổi định tuyến, chỉ đổi thứ người đọc.

Nếu chủ sở hữu vẫn muốn năng lực này, nó xứng đáng có contract riêng (phải giải quyết
mâu thuẫn P3 trước).

### (b) FAIL-LOUD cứng: từ chối args có `runs > 1` trên judgment

**Chống lại, một lý do đủ nặng:** 12 eval ở 6 workspace đã ký đang mang `runs: 3` /
`paths` trên judgment. Kit tự chạy cổng của chính nó, nên **PR chạm engine gây
stale-cascade toàn bộ workspace cũ** — mỗi cái re-verify sẽ BLOCKED cho tới khi có người
sửa `evals.yaml` của nó. Đó đúng là hình dạng CLAUDE.md cấm: *"Đổi schema artifact phải
có đường đọc-cũ … KHÔNG bắt consumer migrate hàng loạt."*

### (c) ĐỀ XUẤT — nói ra ở mọi mặt người đọc, không chặn

Máy **không** chạy N panel, **không** BLOCKED, nhưng **không chỗ nào im lặng nữa**:

1. `acceptance-verify.js` phát hiện field inert (`runs>1` trên judgment/ui-check;
   `paths` trên judgment) bằng **một hàm thuần, một chỗ** — trả `inertFields:
   [{evalId, field, value, executor, reason}]` trong `result`, và `log()` một dòng.
2. Prompt synthesize **được truyền `runs` + `inertFields`** (hôm nay `runs` bị strip khỏi
   định nghĩa eval ở dòng 699 — nên synthesizer *không thể* biết, và câu
   "none — no eval carries runs > 1" là hệ quả tất yếu, không phải agent nói dối).
   `## Variance` phải nêu **đích danh eval** thay vì "none".
3. Sửa ba chỗ mô tả sai để khớp `eval-executors.md` (nguồn), + hai mirror.
4. `feature-loop/skills/feature-loop/SKILL.md` bước "Mọi verdict": `inertFields` không
   rỗng → đưa vào gói Gate 2 (cùng luật minh bạch như `carried`).

Khớp lối ngành: cảnh báo nêu tên field khi đã có consumer ngoài luồng — Kubernetes
warning, Ajv strict. Giữ nguyên đường đọc-cũ: 12 eval cũ vẫn verify được, chỉ khác là
người ký **nhìn thấy** field đó không có tác dụng.

## Đơn vị và biên

| Đơn vị | Làm gì | Phụ thuộc | Kiểm độc lập bằng |
|---|---|---|---|
| `inertFieldReport(evals)` — hàm thuần trong `acceptance-verify.js` | (eval[]) → `inertFields[]`, deterministic | không | vm-realm test, không sinh agent |
| Đường dẫn `result` | `inertFields` ra main loop + `log()` | hàm trên | `result.inertFields` sau `runWorkflow` |
| Đường dẫn synthesize | `runs` + `inertFields` vào prompt | hàm trên | ghim chuỗi trong `calls` prompt |
| Doc/spec | 3 chỗ mô tả + 2 mirror | không | grep có đối chứng dương |

Biên giữ chặt: hàm thuần **không** đọc file, **không** phụ thuộc thứ tự eval, và là
**nguồn duy nhất** của luật inert — thêm ô inert mới sau này sửa đúng một chỗ.

## Rủi ro đã nhận

- Người dùng vẫn viết `runs: 3` lên judgment và tưởng nó chạy: giảm bằng thông điệp nêu
  **đích danh eval id + field + lý do**, hiện ở `## Variance` và gói Gate 2 — hai mặt
  người ký buộc phải đọc.
- Chọn (c) nghĩa là **không** có năng lực N-panel: nhận downside có ý thức, ghi vào sổ
  quyết định; muốn thì mở contract riêng sau khi giải mâu thuẫn P3.

## Ngoài phạm vi

- Chạy N panel cho judgment (đường (a)) — cần giải mâu thuẫn P3 trước, contract riêng.
- Kiểm mọi key lạ trong `evals.yaml` (allowlist đóng) — không gian mở, đã ghi ở Never.
- Sửa `evals.yaml` của 6 workspace đã ký — cấm bởi luật đường-đọc-cũ.
- Thêm `feature-loop/workflows/**` vào `risk_tiers.t3_paths` — phát hiện thật (thấy ở S0,
  xem gói Gate 1) nhưng là quyết định chính sách của chủ repo, không phải việc của
  contract này.
- `expected` không tới tay judge; `notes` chưa vào spec — Later của scan.
