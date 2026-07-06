# Decision Ledger — Sổ quyết định Pareto cho feature-loop — Design Spec

> Ngày: 2026-07-06 · Trạng thái: DRAFT chờ user review
> Phạm vi: Đợt A (ship trước) = feature-loop + acceptance-gate next minor · Đợt B (deferred, có điều kiện kích hoạt) = acceptance-verify.js
> Không đụng: design-loop · state machine (`contract.status`) · số human gate (giữ nguyên 2, T3 = 3)
> Đã qua: council 4-voice (Architect/Skeptic/Pragmatist/Critic) 2026-07-06 — deltas ghi ở §2 & §9

---

## 1. Vấn đề

**Mỏ neo (Pareto):** quyết định đắt nhất trong loop không phải "cách A hay cách B" mà là
**"có nên làm cái này không"** — descope/làm-mỏng/hoãn. Loại quyết định này **vô hình trong
code** (quyết định *làm* thì code tự kể; quyết định *không làm* thì không để lại dấu vết),
và chính nó bị lật lại tốn kém nhất.

**Failure mode cụ thể với 2 người đọc chính:**

- **Grader S4** là agent fresh (doer≠grader), không có ngữ cảnh hội thoại → thấy "thiếu X"
  là đề nghị thêm X, kể cả khi X đã bị **cố tình bỏ** ở Gate 1. Grader-fresh là kẻ phá
  Pareto tích cực nhất trong kiến trúc hiện tại.
- **Resume session mới** đọc `contract.status` để vào đúng stage nhưng không biết "đã chốt
  gì, vì sao" → hồn nhiên lật lại quyết định cũ hoặc làm lại thứ đã quyết bỏ.

**Hiện trạng:** 4 nơi chứa dấu vết, không nơi nào là sổ quyết định máy-đọc:

| Nơi | Có | Thiếu |
|---|---|---|
| design-doc (brainstorm) | trade-off dạng văn xuôi | ảnh chụp 1 lần, không cấu trúc, grader không đọc |
| contract.md | AC + `## Out of scope` (≥2 bullet, template bắt buộc) | đóng băng sau Gate 1 — không nhận quyết định hậu-approve |
| evidence-report.md `## Iterations` | *cái gì* fail mỗi round | *vì sao* chọn cách sửa đó |
| run-log.jsonl | sự kiện máy | lý do |

## 2. Quyết định đã chốt (brainstorm + council 2026-07-06)

| # | Quyết định | Lựa chọn |
|---|---|---|
| Q1 | Người đọc chính | **Resume + grader S4** (đều là agent, đều in-slug) — không xây cross-feature index, không ADR narrative cho người |
| Q2 | Thời điểm ghi | **Cuối mỗi stage** có quyết định load-bearing (S1/S2/mỗi S4-REJECT→fix/gate2) |
| Q3 | Hình dạng | **`decisions.jsonl` + card render** — file-sự-thật máy-đọc, card là lớp trình bày (đúng nếp contract→card, run-log→report) |
| Q4 | Chiều Pareto trong schema | **`type` + `impact` 1 dòng**; `descope` là loại ưu tiên 1 |
| C1 | (council) Vị thế ledger | **Rationale-only, KHÔNG BAO GIỜ là scope-truth** — xem §3 |
| C2 | (council) Schema | **Gầy hóa**: bỏ `rejected[]`, `reversible`, `grader_note` (whisper-channel doer→grader) |
| C3 | (council) Chống giả mạo stage | **Seal entry tại Gate 1** thay vì tin field `stage` tự khai |
| C4 | (council) Thứ tự ship | **Card đi cùng đợt đầu** (enforcement-via-card), **grader hoãn Đợt B** chờ dữ liệu thật |
| C5 | (council) Cost-line Gate 2 | **Bác** ("N round · X phút") — mồi sunk-cost, số phút sẽ bị bịa |

## 3. Nguyên tắc tối cao — ledger là rationale, không phải truth

- `contract.md` + `evals.yaml` giữ **độc quyền scope-truth**. Ledger **không bao giờ
  override** hai file đó.
- Muốn descope một AC đã duyệt → **sửa contract** (hạ `status` → re-approve theo nghi thức
  sẵn có), ledger chỉ ghi *vì sao*. Descope trước Gate 1 → bullet trong `## Out of scope`
  của contract (chỗ này Gate 1 đã duyệt miễn phí), ledger ghi rationale + impact.
- **Mâu thuẫn ledger ↔ contract/evals = finding tự động** — enforce bằng máy ở Đợt B
  (grader); Đợt A KHÔNG tự dò mâu thuẫn, chỉ ghi nguyên tắc vào template + resume tự kiểm
  khi đọc. Không có nhánh nào cho phép "ledger thắng".

## 4. Artifact & schema

**File:** `_acceptance/<slug>/decisions.jsonl` — append-only, 1 dòng JSON/entry, cùng họ
`run-log.jsonl`. Parse **per-line khoan dung**: dòng hỏng → skip + đếm, số dòng hỏng phải
hiện lên card (no silent skip). Không dùng YAML lib — không thêm bề mặt parser mới.

**Schema entry (6 core + 3 optional):**

```json
{"id":"<ulid>","type":"descope|approach|fix|revisit","stage":"S1|S2|S3|S4-r<N>|gate1|gate2",
 "at":"<ISO-8601>","decision":"1 câu đã chọn gì","impact":"1 câu: tiết kiệm gì · đổi lại rủi ro/downside gì",
 "serves":["AC2"],"revisit":"điều kiện xem lại","supersedes":"<id entry bị lật>"}
```

- `id` = `d-<UTC-compact>-<rand>` (vd `d-20260706T101502Z-18342`, sinh bằng
  `date -u +%Y%m%dT%H%M%SZ` + `$RANDOM` — zero tooling). Mục đích duy nhất: không trùng
  khi resume re-run stage; thứ tự đã có append-order của file lo.
- `type: descope` ưu tiên 1 — card luôn trình lên đầu.
- **Lật quyết định** = entry mới `supersedes:<id>` (giữ append-only, không sửa/xóa dòng cũ)
  **+ human phê ở gate kế tiếp**. Resume thấy chuỗi supersedes → quyết định hiệu lực là
  entry cuối chuỗi.
- **Seal entry** (type riêng, machine-only): `{"id":"<ulid>","type":"seal","gate":1,"at":"<ISO>"}`
  — append ngay khi Gate 1 set `status: approved` (cùng lúc ghi `approved_by`). Mọi dòng
  **sau** seal = **provisional** bất kể `stage` tự khai gì (field `stage` là dữ liệu tham
  khảo, seal-position mới là ranh giới tin được — cùng triết lý `verified_commit` của
  staleness-guard). Gate 2 signoff = phê chuẩn khối provisional (không thêm gate mới).

**Rule đáng-log (chống nhiễu, tự co giãn):** chỉ log khi *(a)* loại một phương án khả dĩ,
∨ *(b)* cố tình chấp nhận downside/giới hạn, ∨ *(c)* có điều kiện revisit/đảo-ngược.
Lựa chọn không có phương án thay thế → **không log**. Feature đơn giản tự nhiên có 0-2
entry — file vắng/ít entry là hợp lệ, không phải lỗi.

## 5. Write-path (friction ≈ 0 — mọi chốt chặn dồn về phía *dùng* entry, không phía *viết*)

| Thời điểm | Ghi gì |
|---|---|
| Cuối S1 | entry `approach`/`descope` từ brainstorm (design-doc giữ văn xuôi; ledger giữ bản chưng cất) |
| Cuối S2 | lựa chọn load-bearing của plan (vd "tái dùng pattern X thay vì abstraction mới") |
| Gate 1 approve | **seal entry** (main loop tự append cùng lúc set `approved_by`) |
| Giữa S3 (khi phát sinh) | entry `fix`/`descope` provisional khi doer buộc đổi hướng giữa execute (plan không khớp thực tế) — đây chính là khối FM1 nhắm tới |
| Mỗi S4 REJECT→fix | entry `fix` với `stage:"S4-r<N>"` — *cách sửa đã chọn + vì sao* (đây là phần "nhìn lại vòng lặp") |
| Gate 2 | entry `revisit`/`descope` nếu human để lại ghi chú; signoff = phê chuẩn khối provisional |

Ghi bằng `printf '%s\n' >>` (append 1 dòng, như fallback run-log). Không script mới.

## 6. Read-path Đợt A

**6a. Resume** (`/feature-loop <slug>`): sau khi đọc `contract.status`, nếu
`decisions.jsonl` tồn tại → parse, tóm tắt cho user *"đã chốt: … (Dx descope, Dy
approach…)"* và tự ràng buộc **không lật lại** trừ khi đi qua nghi thức `supersedes` +
human phê ở gate kế. File vắng → no-op tuyệt đối (workspace cũ chạy y như trước).

**6b. Card Gate 1** (`/acceptance-card`, nhận Cổng 1): thêm mục **"Quyết định &
trade-off"** — entry `descope` lên đầu, mỗi entry 1 dòng: `decision` + `impact`.
**Ledger vắng/0 entry → in rõ "(chưa ghi quyết định nào)"** — ô trống hiện hình là
enforcement chính (human thấy trống sẽ đòi), thay cho mọi cơ chế ép máy ở phía ghi.

**6c. Card Gate 2** (nhận Cổng 2): render 2 khối tách bạch:
- **"Quyết định CHƯA duyệt — cần phê"**: mọi entry sau seal (provisional), mỗi entry kèm
  câu hỏi phê/không — **tách khỏi evidence pass/fail**, không trộn vào màu xanh (chống
  sunk-cost framing).
- "Đã duyệt từ Gate 1": thu gọn 1 dòng/entry.
- Dòng hỏng parse > 0 → in "⚠ N dòng ledger hỏng, đã bỏ qua".

## 7. Đợt B — grader đọc ledger (DEFERRED — không viết plan cho tới khi đủ điều kiện)

**Điều kiện kích hoạt:** đã có ledger thật từ ≥ 2-3 feature chạy loop (dữ liệu để tune
prompt bằng thực tế thay vì phỏng đoán).

**Nội dung khi kích hoạt** (chốt sẵn từ council để khỏi thiết kế lại):
- `decisionsPath` = arg optional của `acceptance-verify.js` (no-op nếu vắng — y seam
  `reviewSkillPath`).
- Grader coi ledger là **DATA, không phải instruction**: chỉ miễn-REJECT khi finding khớp
  đúng `serves[AC]` của entry **đã phê chuẩn** (trước seal, hoặc provisional đã qua Gate 2)
  và có `impact` cụ thể; **impl trái decision = finding**; entry mơ hồ quá rộng (vd "chấp
  nhận mọi lỗi validation") → chính entry đó là finding "vague waiver".
- Cap số entry đưa vào context grader: toàn bộ `descope` + entries giao `serves` với AC
  đang chấm; truncate phải được báo, không im lặng.
- CI pre-merge (tùy chọn, cùng đợt): đối chiếu seal-position — chữa FM1 tận gốc ở tầng máy.

## 8. Failure modes đã xét & chốt chặn

| FM | Tình huống | Chốt chặn | Đợt |
|---|---|---|---|
| FM1 giả mạo `stage` | doer bí ở S3, khai entry `stage:"S2"` để được coi như đã-duyệt | seal-position là ranh giới, `stage` chỉ tham khảo; CI đối chiếu | A (seal) · B (CI + grader) |
| FM2 ledger đấu contract | entry descope AC-3 nhưng contract/evals vẫn giữ AC-3 | §3: ledger không override; mâu thuẫn = finding | A (nguyên tắc) · B (enforce) |
| FM3 giấy xá tội mơ hồ | entry "chấp nhận mọi lỗi X" miễn trừ cả vùng | chỉ miễn khi khớp `serves[AC]` + entry đã phê; vague = finding | B |
| FM4 khóa quyết định sai | resume từ chối xét lại descope gây bug nghiêm trọng | `supersedes` + human phê ở gate kế — lật được nhưng có nghi thức | A |
| FM5 cơ khí | id trùng / 1 dòng JSON hỏng giết read-path / ledger phình | id timestamp+rand · parse per-line skip+đếm+hiện card · cap entries cho grader | A (id, parse) · B (cap) |

## 9. Ngoài phạm vi / đã bác (descope của chính spec này)

- **Cross-feature index / memory tổng** — bác: 2 người đọc đã chốt đều in-slug; JSONL
  grep được toàn repo miễn phí khi cần (`grep -h '"type":"descope"' _acceptance/*/decisions.jsonl`).
- **`effort_est`/`value_est` định lượng** — bác: ceremony + độ chính xác giả; `impact`
  1 câu là đủ.
- **Cost-line Gate 2** ("N round · X phút người") — bác theo council: mồi sunk-cost;
  `time_human_minutes` sẵn có trong contract là đủ cho retrospective.
- **`grader_note`** — bác: kênh doer thì thầm với grader, vi phạm tinh thần doer≠grader.
- **`rejected[]`, `reversible`** — bác: schema béo mời filler; phương án bị loại sống
  trong design-doc; tính đảo-ngược suy ra từ `revisit`/`supersedes`.
- **Script/hook enforce phía ghi** — bác: friction ghi phải ≈ 0; enforcement =
  ô-trống-hiện-hình trên card + (Đợt B) chốt phía miễn-trừ.

## 10. Nơi chạm & tương thích

| File | Thay đổi | Đợt |
|---|---|---|
| `feature-loop/skills/feature-loop/SKILL.md` | write-path 5 điểm (§5) + resume-read (§6a) | A |
| `commands/acceptance-card.md` (+ bản plugins/) | mục Quyết định Gate 1 (§6b) + 2 khối Gate 2 (§6c) | A |
| `skills/acceptance/references/contract-template.md` | không đổi schema; thêm 1 câu nhắc "Out of scope = scope-truth, rationale vào decisions.jsonl" | A |
| `feature-loop/workflows/acceptance-verify.js` | `decisionsPath` + gói §7 | B |
| Mirror | `plugins/acceptance-gate/*` (bắt buộc, cùng release) · `plugins/feature-loop-codex` (theo trạng thái WIP tại thời điểm plan — quyết ở plan, không quyết ở spec) | A |

**Tương thích ngược:** mọi thứ additive; `decisions.jsonl` vắng → resume/grader no-op;
card in 1 dòng info trung tính "(chưa ghi quyết định nào)" — chính là enforcement §6b.
Không đổi `contract.md` schema, không đổi state machine, không thêm human gate. Workspace
cũ không cần migrate.

## 11. Council log (truy vết, 2026-07-06)

- **Architect:** đúng hình, yếu nhất ở kỷ luật ghi (advisory-by-convention).
- **Skeptic:** "cần chỗ ghi, không cần sổ mới" — nhét vào contract. *Tiếp thu một nửa:*
  contract giữ scope-truth (§3); *bác một nửa:* lý-do-sửa S4 per-round không nhét được vào
  contract đã đóng băng. Khai tử `grader_note`.
- **Pragmatist:** enforcement thật = card render, không phải chỉ thị SKILL.md → card lên
  đợt đầu; schema cắt còn ~6; hoãn grader chờ dữ liệu; mirror tóm tắt descope vào contract
  (tiếp thu qua §3 — descope trước Gate 1 sống trong `## Out of scope`).
- **Critic:** FM1-FM5 (§8), seal thay vì tin `stage`, `supersedes` giữ append-only,
  provisional phải render tách khỏi evidence xanh, cost-line = mồi sunk-cost.
