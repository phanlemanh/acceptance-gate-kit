# Teardown: mattpocock/skills — và bài học cho Acceptance-Gate-Kit

Nguồn: https://github.com/mattpocock/skills (clone `main`, 2026-07-25, v1.1.0).
Phương pháp: đọc toàn bộ 30 SKILL.md + `.agents/` + ADR + CHANGELOG (~4.400 dòng).

---

## Phần 1 — Bộ skills này thực sự là gì

**Số liệu định hình mọi thứ:** toàn bộ `skills/` chỉ **4.389 dòng** cho ~30 skill.
SKILL.md dài nhất là 140 dòng (`teach`). `domain-modeling` = 74 dòng.
`grill-with-docs` = **1 dòng thân bài**.

Tuyên ngôn trong README:

> "Approaches like GSD, BMAD, and Spec-Kit try to help by owning the process.
> But while doing so, they take away your control and make bugs in the process
> hard to resolve. These skills are designed to be small, easy to adapt, and composable."

Đây là lựa chọn kiến trúc, không phải lười: **skill nhỏ + tổ hợp** thay vì
**framework lớn sở hữu quy trình**. Toàn bộ giá trị nằm ở 4 flow (README §"Why
These Skills Exist"), mỗi flow chữa một failure mode cụ thể:

| Failure mode | Skill chữa |
|---|---|
| #1 Agent làm sai ý | `grill-me` / `grill-with-docs` (phỏng vấn tới khi cạn nhánh) |
| #2 Agent quá dài dòng | `domain-modeling` → `CONTEXT.md` (ngôn ngữ chung) |
| #3 Code không chạy | `tdd` (red-green), `diagnosing-bugs` (tight loop) |
| #4 Ball of mud | `codebase-design`, `improve-codebase-architecture` (deep module) |

---

## Phần 2 — Đọc sâu `domain-modeling` (phần DDD)

### 2.1 Điều thú vị nhất: skill này là **bản thay thế** của một skill đã chết

`skills/deprecated/ubiquitous-language/SKILL.md` (93 dòng) vẫn nằm trong repo,
kèm README ghi "Skills I no longer use". So sánh hai bản là bài học lớn nhất
của cả repo:

| | `ubiquitous-language` (chết) | `domain-modeling` (sống) |
|---|---|---|
| Kích hoạt | user-invoked, gõ tay | **model-invoked**, agent tự với tới |
| Thời điểm | **Sau khi xong** — quét lại hội thoại | **Trong lúc làm** — chốt term nào ghi term đó |
| Output | `UBIQUITOUS_LANGUAGE.md` — bảng + "Flagged ambiguities" + "Example dialogue" | `CONTEXT.md` — chỉ glossary |
| Bản chất | Một **hành động sinh tài liệu** | Một **kỷ luật chạy nền** |

Bản chết là "chạy lệnh → ra file". Bản sống là "trong lúc thiết kế, hễ gặp từ mờ
thì chặn lại ngay". Cùng ý tưởng DDD, khác hoàn toàn ở chỗ **nó bám vào công
việc thay vì đứng riêng thành một bước**.

`.agents/invocation.md` chốt ranh giới này bằng một câu:

> "Merely *reading* `CONTEXT.md` for vocabulary is a one-line prose pointer, not
> the `domain-modeling` skill. Only the active build/sharpen discipline ... is `domain-modeling`."

Skill chỉ tồn tại cho phần **chủ động**. Phần bị động (đọc glossary) rẻ tới mức
nhét một dòng vào skill khác là xong — `tdd` và `diagnosing-bugs` đều làm thế.

### 2.2 Bốn hành vi runtime (đây mới là nội dung skill)

Không có bước 1-2-3. Chỉ 4 hành vi phản xạ + 1 quy tắc ghi:

1. **Challenge against the glossary** — user dùng từ mâu thuẫn glossary → chặn ngay:
   *"Glossary của bạn định nghĩa 'cancellation' là X, nhưng bạn đang nói Y — cái nào?"*
2. **Sharpen fuzzy language** — *"Bạn nói 'account' — ý là Customer hay User? Hai thứ khác nhau."*
3. **Discuss concrete scenarios** — bịa kịch bản biên để ép user chính xác về ranh giới.
4. **Cross-reference with code** — user nói A, code làm B → nêu mâu thuẫn:
   *"Code của bạn huỷ nguyên Order, nhưng bạn vừa nói huỷ từng phần được — cái nào đúng?"*

Rồi: **ghi vào `CONTEXT.md` ngay tại chỗ, không gom lô.**

Và một ràng buộc rất mạnh:

> "`CONTEXT.md` should be totally devoid of implementation details. Do not treat
> `CONTEXT.md` as a spec, a scratch pad, or a repository for implementation
> decisions. **It is a glossary and nothing else.**"

### 2.3 Format `CONTEXT.md` — ba chữ làm nên khác biệt

```md
**Order**:
A customer's request to purchase one or more items.
_Avoid_: Purchase, transaction
```

`_Avoid_` là phần đắt nhất. Glossary bình thường nói *"dùng từ này"*; `_Avoid_`
nói **những từ nào bị cấm** — nên nó biến glossary từ tài liệu tham khảo thành
một **luật có thể kiểm được**: quét diff, thấy từ trong `_Avoid_` là fail.

Quy tắc lọc term cũng sắc:

> "Only include terms specific to this project's context. General programming
> concepts (timeouts, error types, utility patterns) don't belong even if the
> project uses them extensively."

### 2.4 Bounded context — có, nhưng **lười**

Repo một context → `CONTEXT.md` ở root. Repo nhiều context → `CONTEXT-MAP.md`
ở root, mỗi context có `CONTEXT.md` riêng trong thư mục của nó, và Context Map
ghi **quan hệ** giữa chúng:

```md
- **Ordering → Fulfillment**: Ordering emits `OrderPlaced`; Fulfillment consumes them
- **Ordering ↔ Billing**: Shared types for `CustomerId` and `Money`
```

Đây là Context Map của Evans, nhưng bỏ hết ceremony (không Anticorruption Layer,
không Conformist/Partnership...). Và quan trọng:

> "Create files lazily — only when you have something to write."

Không scaffold trước. Không có template rỗng chờ điền.

### 2.5 Cổng ADR — 3 điều kiện AND

Đây là phần tôi cho là đáng copy nguyên văn nhất. Chỉ đề xuất ADR khi **cả ba**
cùng đúng:

1. **Hard to reverse** — đổi ý sau này tốn thật.
2. **Surprising without context** — người đọc tương lai sẽ hỏi "sao lại làm thế?"
3. **The result of a real trade-off** — có phương án khác thật, và đã chọn có lý do.

> "If a decision is easy to reverse, skip it — you'll just reverse it. If it's
> not surprising, nobody will wonder why. If there was no real alternative,
> there's nothing to record beyond 'we did the obvious thing.'"

Và template ADR là… **một đoạn văn**:

```md
# {Short title of the decision}

{1-3 sentences: what's the context, what did we decide, and why.}
```

> "That's it. An ADR can be a single paragraph. The value is in recording *that*
> a decision was made and *why* — not in filling out sections."

`Status` / `Considered Options` / `Consequences` đều là **optional**, "most ADRs
won't need them". Đây là chống-ceremony có chủ đích: ADR nào cũng phải điền 6
section thì sẽ không ai viết ADR.

`ADR-FORMAT.md` còn liệt kê 7 loại quyết định **đủ tư cách** — trong đó hai loại
hay bị bỏ sót:

- **Deliberate deviations from the obvious path** — "dùng SQL tay thay vì ORM vì X".
  *"These stop the next engineer from 'fixing' something that was deliberate."*
- **Rejected alternatives when the rejection is non-obvious** — "cân nhắc GraphQL,
  chọn REST vì lý do tinh tế" → không ghi thì 6 tháng nữa có người đề xuất lại.

---

## Phần 3 — Phát hiện lớn nhất: repo áp DDD lên **chính nó**, ba lần

Đây là thứ tôi không ngờ tới, và là bài học có đòn bẩy cao nhất.

Bộ skills không chỉ *dạy* ubiquitous language — nó **dùng** ubiquitous language
ở ba tầng khác nhau, mỗi tầng một glossary riêng, cùng một format
(`**Term**` + định nghĩa + `_Avoid_`):

| Tầng | Glossary | Ngôn ngữ của cái gì |
|---|---|---|
| Domain nghiệp vụ | `CONTEXT.md` (do `domain-modeling` nuôi) | Order, Invoice, Customer |
| Kiến trúc code | `codebase-design/SKILL.md` §Glossary | Module, Interface, Depth, Seam, Adapter, Leverage, Locality |
| **Chính bộ skills** | `writing-great-skills/GLOSSARY.md` | Predictability, Context Load, Leading Word, Premature Completion… |

### 3.1 `codebase-design` — glossary có cả mục "Rejected framings"

Ngoài `_Avoid_` cho từng term, skill này có hẳn một section **"Rejected
framings"** — ghi lại các định nghĩa đã bị loại và **vì sao**:

> - **Depth as ratio of implementation-lines to interface-lines** (Ousterhout):
>   rewards padding the implementation. We use depth-as-leverage instead.
> - **"Boundary"**: overloaded with DDD's bounded context. Say **seam** or **interface**.

Đây là ADR *bên trong* glossary. Nó chặn việc tái tranh luận định nghĩa.

### 3.2 `writing-great-skills` — ubiquitous language cho nghề viết skill

201 dòng GLOSSARY định nghĩa 20+ term, tổ chức theo 4 trục
(Invocation / Information Hierarchy / Steering / Pruning), mỗi **failure mode**
nằm cạnh chính cái lever chữa nó.

Câu mở đầu là "domain statement" của cả bộ:

> "A skill exists to wrangle determinism out of a stochastic system.
> **Predictability** — the agent taking the same *process* every run, not
> producing the same output — is the root virtue; every lever below serves it."

Vài term đáng nhập khẩu nguyên si:

- **Context Load** — giá một model-invoked skill trả: `description` nằm trong
  context window **mọi lượt**.
- **Cognitive Load** — giá một user-invoked skill bắt **con người** trả: phải tự
  nhớ skill tồn tại. *"Not a cost to minimise: it is the price of human agency."*
- **Leading Word** (Leitwort) — một từ đã có sẵn trong pretraining, lặp lại như
  **token** chứ không phải câu, để neo cả một vùng hành vi bằng ít token nhất
  (*tight* loop, *deep* module, *red*, *fog of war*, *tracer bullet*).
- **No-Op** — dòng mà model vốn đã tuân theo mặc định → trả context load để nói
  không gì cả. Test: *"does it change behaviour versus the default?"*
- **Negation** — con voi. Cấm đoán kéo hành vi bị cấm vào context và làm nó
  **dễ xảy ra hơn**. Chữa bằng cách phát biểu **positive**.
- **Premature Completion** — kết thúc bước khi chưa thật xong, vì sự chú ý trượt
  sang *việc đã xong*. Chữa theo thứ tự: **siết completion criterion trước**
  (rẻ, cục bộ); chỉ khi tiêu chí mờ không sửa được **và** đã quan sát thấy
  agent vội thì mới giấu các bước sau bằng cách tách skill.
- **Sediment** — lớp nội dung cũ đọng lại vì "thêm thì thấy an toàn, bớt thì
  thấy rủi ro". *"The default fate of any skill without a pruning discipline."*

### 3.3 Trục Invocation — quyết định kiến trúc bị bỏ quên nhiều nhất

Mỗi skill chọn **một** trong hai:

- **Model-invoked** — giữ `description` → agent tự với tới **và** skill khác với
  tới được. Trả **context load** vĩnh viễn.
- **User-invoked** — `disable-model-invocation: true` → **chỉ** con người gõ tên
  mới chạy. Context load bằng 0. `description` chuyển thành **human-facing**,
  cắt hết trigger list.

Luật chọn, một câu:

> "Pick model-invocation only when the agent must reach the skill on its own,
> or another skill must. If it only ever fires by hand, make it user-invoked
> and pay no context load."

Kết quả áp dụng trong repo: **9 user-invoked / 12 model-invoked**. Toàn bộ skill
điều phối (`grill-with-docs`, `to-spec`, `to-tickets`, `implement`, `wayfinder`,
`triage`, `ask-matt`) là user-invoked; toàn bộ skill kỷ luật tái dùng
(`tdd`, `domain-modeling`, `codebase-design`, `grilling`, `code-review`,
`prototype`, `research`) là model-invoked.

Và khi user-invoked nhiều tới mức không nhớ nổi → chữa bằng **router skill**:
`ask-matt` (128 dòng), user-invoked, vẽ bản đồ main flow + on-ramps + standalone.
`CLAUDE.md` có luật bảo trì: thêm/xoá/đổi skill là phải cập nhật `ask-matt` —
*"a new skill it never mentions, or a stale one it still routes to, is a router that lies."*

### 3.4 Tổ hợp thay vì nhân bản

`grill-with-docs/SKILL.md`, **toàn bộ thân bài**:

```
Run a `/grilling` session, using the `/domain-modeling` skill.
```

Và luật phụ thuộc trong `.agents/invocation.md`:

> "Dependencies are expressed as **`/skill`-style prose invocation** ("Run the
> `/grilling` skill"), **not** deep `../other-skill/FILE.md` cross-references.
> Shared reference docs live inside the skill that owns them; other skills reach
> that material by **invoking the skill**, not by linking across folders."

### 3.5 `.out-of-scope/` — thư mục ghi lại những gì đã **từ chối**

3 file, mỗi file: quyết định + *"## Why this is out of scope"* + *"## Prior
requests"* trỏ tới issue number đã hỏi.

Ví dụ `question-limits.md` (issue #44 — "Codex just asked me 200 questions"):
từ chối thêm giới hạn số câu hỏi, vì cap sẽ **gộp nhầm hai failure mode khác
nhau** — hỏi nhiều vì plan thiếu chi tiết (đúng ý đồ) vs hỏi câu vô giá trị
(lỗi chất lượng prompt, không phải lỗi số lượng).

Đây là artifact rẻ nhất/đắt giá nhất trong repo: nó chặn cùng một đề xuất quay
lại lần thứ ba.

---

## Phần 4 — Bài học cho Acceptance-Gate-Kit

### 4.0 Trước hết: chỗ kit **đã hơn**

Cần nói rõ để không copy nhầm chiều:

- **mattpocock/skills có 0 enforcement.** Mọi kỷ luật đều là prose khuyên nhủ.
  Kit có `acceptance-evidence-gate.js` (chặn lúc ghi) + `pre-merge-check.sh`
  (chặn lúc merge) + `run-log.jsonl` đối chiếu `run_id`. Đây là ý tưởng mạnh hơn
  hẳn: kit **không tin agent**, mattpocock thì có.
- **Doer ≠ grader** với fresh-context subagent — mattpocock chỉ có ở `code-review`
  (2 subagent song song), kit áp cho cả phase VERIFY.
- **Quy attribution qua git history** (`require_human_commit`) — không có đối ứng.
- **Kit tự đo mình** (`acceptance-report`, KPI ≥50% giảm phút người).

Điểm chung sâu nhất giữa hai bộ: `diagnosing-bugs` Phase 1 đòi
*"name **one command** ... that you have **already run at least once** (paste the
invocation and its output)"* — đúng bằng triết lý `run_id + exit_code: 0 +
verified_at` của kit. Hai người độc lập tìm ra cùng một luật: **bằng chứng máy
chạy được, không phải lời khẳng định.**

---

### Bài học #1 — Kit là sản phẩm nặng thuật ngữ nhưng **không có glossary** 🔴

Đo thực tế trên repo (đếm số lần xuất hiện trong skills + README + GUIDE):

| Term | Số lần | Định nghĩa chuẩn ở đâu? |
|---|---|---|
| gate | 575 | — |
| evidence | 391 | — |
| eval | 358 | — |
| contract | 277 | — |
| verdict | 224 | — |
| surface | 163 | — |
| executor | 91 | — |
| criterion/criteria | 79 / 37 | — |
| residual | 3 | — |

**Không có `CONTEXT.md`. Không có glossary.** Hệ quả là mỗi SKILL.md phải tự
giải thích lại — chính là lý do `acceptance/SKILL.md` phình lên 326 dòng.

Kit còn có những cặp từ nguy hiểm hơn cả `Order` vs `Purchase`:

- `criterion` (mục trong contract) vs `eval case` (mục trong evals.yaml) vs
  `acceptance criteria` — ba thứ khác nhau, tên gần nhau.
- `gate` đang gánh **ba nghĩa**: Gate 1/Gate 2 (điểm dừng người),
  evidence gate (hook), pre-merge gate (CI).
- `verdict` (PASS/REJECT/BLOCKED của eval) vs `verdict` (kết luận report).
- `signoff` (32) vs `sign-off` (3) — drift chính tả đã bắt đầu.
- `surface` — dùng cho cả UI surface lẫn interface surface.

**Việc cần làm:** tạo `CONTEXT.md` ở root kit, đúng format
`**Term**: định nghĩa 1-2 câu` + `_Avoid_: từ cấm`. Chỉ term riêng của kit —
"timeout", "subagent" không vào. Sau đó **xoá** các đoạn tái định nghĩa trong
từng SKILL.md và trỏ về glossary.

Đòn bẩy kép: vừa giảm sprawl, vừa cho phép hook/CI **kiểm được** vi phạm từ
vựng (`_Avoid_` biến glossary thành luật lint — kit vốn đã có `eval-coverage-lint.js`
và regex vocab ở pre-merge, hạ tầng có sẵn).

---

### Bài học #2 — Trục Invocation: bản Claude làm đúng, **bản Codex đánh mất** 🔴

Đo lại theo từng harness (quan trọng — số tổng gộp cả hai là số ảo):

**Claude edition** (root repo là plugin source):

```
skills/           1008 ux-ui-craft   588 acceptance   443 morphological-scan
feature-loop/      601 feature-loop
design-loop/       614 design-subtrack
                  ------
                  3.254 ký tự ≈ 815 token, luôn nằm trong context

commands/          approve 187 · signoff 234 · acceptance-report 170 ·
                   acceptance-card 137 · acceptance-init 76 · acceptance-status 57
```

Kit **đã tách đúng** ở bản Claude: 6 thao tác do người khởi xướng nằm ở
`commands/` — đúng bằng vai trò user-invoked của mattpocock, đúng idiom của
Claude Code. Không cần sửa gì ở đây.

**Codex edition** — `codex/acceptance-gate/.codex-plugin/plugin.json`:

```json
"skills": "./skills/"
```

Một **path string duy nhất**, Codex quét đệ quy mọi `SKILL.md` bên dưới. Hệ quả:
6 thao tác kia — vốn là command ở bản Claude — **quay lại thành skill
model-invoked**, kèm description giàu trigger:

> `approve`: "…**Use when the user wants to approve a contract, duyệt Cổng 1,
> or asks what is waiting for approval.**"

Và toàn repo có **0 chỗ** dùng `policy.allow_implicit_invocation: false` — cơ chế
Codex tương đương `disable-model-invocation`, chính là thứ mattpocock đặt trong
`agents/openai.yaml` của mỗi skill user-invoked.

Nên trên Codex, `approve` và `signoff` là **agent-reachable**. Cả hai đều chặn
bằng prose ("It never decides: an explicit human YES ... is the only trigger") —
nhưng đó là ràng buộc mềm. Đây đúng chỗ triết lý kit tự mâu thuẫn: kit **không
tin agent** ở tầng evidence (hook + CI chặn cứng), lại **tin prose** ở tầng
cổng người.

**Việc cần làm:** thêm `agents/openai.yaml` với
`policy.allow_implicit_invocation: false` cho 6 skill Codex
(`approve`, `signoff`, `acceptance-init`, `acceptance-status`,
`acceptance-report`, `acceptance-card`). Chi phí: 6 file × 3 dòng. Đổi lại:
ràng buộc mềm thành **ràng buộc cứng của harness**, và bản Codex đạt parity
thật với bản Claude — không chỉ parity về tính năng mà cả về **ai được phép
bấm cổng**.

Ghi chú theo mattpocock: *cognitive load* của user-invoked **không phải chi phí
cần tối thiểu hoá** — nó là *"the price of human agency"*. Với `approve`/`signoff`,
đó chính xác là thứ ta muốn trả.

---

### Bài học #3 — Kit có specs/plans nhưng **không có ADR** 🟠

`docs/` hiện có 7 `plans/` + 6 `specs/` + 13 file trong `superpowers/` — đều là
tài liệu **dài, theo ngày, kể chuyện một đợt làm việc**. Không có gì ghi
**một quyết định + vì sao** ở dạng đọc trong 30 giây.

Nhìn git log gần đây, các quyết định sau đều **thoả cả 3 điều kiện ADR**:

- "schema **GIỮ** v2" — khó đảo (đã có consumer), gây bất ngờ (tại sao không v3?), có trade-off thật.
- "residual in-scope noise = **FAIL máy**, không phải van `human_override`" — commit `612b8d8` cho thấy §9 phải sửa lại cho khớp §3.4.2-r5/§7.4 → **đã phải tái đồng bộ vì quyết định không có nhà**.
- `signoff.require_human_commit: true` — chữ ký Gate 2 phải nằm ở commit riêng chỉ chứa human field.
- "network deferred **có điều kiện**" — một rejection có điều kiện, dễ bị hiểu nhầm nhất.

Những quyết định này hiện sống trong **commit message** và rải rác trong spec
dài. Commit message không tra cứu được; nửa năm nữa người mới sẽ hỏi lại đúng
những câu đó.

**Việc cần làm:** `docs/adr/NNNN-slug.md`, **1-3 câu**, tạo lười. Đừng bê template
6 section — chính đó là lý do các repo khác không ai viết ADR.

---

### Bài học #4 — `.out-of-scope/` cho các quyết định đã từ chối 🟠

Git log kit đang mang các cụm: *"defer set final-review wave 1"*,
*"network deferred có điều kiện"*, *"siết network deferred"*. Đây là **rejection
kèm điều kiện** — loại dễ bị đề xuất lại nhất, và cũng dễ bị *triển khai nhầm*
nhất vì điều kiện đã bị quên.

Mẫu 3 phần của mattpocock rẻ và đủ:
```
# <Điều đã từ chối>
## Why this is out of scope
## Prior requests   ← link tới issue/PR/chat đã hỏi
```

Với kit, mục **"Prior requests"** đặc biệt hợp: báo cáo `ducnh13 2026-07-24` về
cross-layer false-green (đã lưu trong memory) chính là một "prior request" cần
có nhà. Cả nhóm quyết định *deferred* của wave 1/wave 2 nên có một file mỗi cái.

---

### Bài học #5 — `feature-loop` đục vào ruột `acceptance-gate`; đây là seam gãy nhất 🔴

Trong `feature-loop/skills/feature-loop/SKILL.md`:

```
ls -d $HOME/.claude/plugins/cache/*/acceptance-gate/*/skills/acceptance/references/
```

Và trong header:

```
WORKFLOWS_DIR = <base-dir>/../../workflows/
(layout cache: .../<plugin>/<version>/skills/feature-loop/ → ../../ = thư mục version)
```

feature-loop đang phụ thuộc vào: **layout thư mục cache của harness**, **cấu trúc
thư mục nội bộ của plugin khác**, và **tên file reference của plugin khác** —
với fallback glob khi đoán sai. SKILL.md thậm chí phải dạy agent cách dò lại khi
hỏng. Đó là triệu chứng, không phải giải pháp.

Luật của mattpocock (`.agents/invocation.md`) cấm đúng thứ này:

> "Shared reference docs live inside the skill that owns them; other skills reach
> that material by **invoking the skill**, not by linking across folders."

Và ADR-0002 của họ ghi lại chính xác một vụ đã cháy vì kiểu coupling này: thư mục
symlink trỏ vào bucket **không sống sót qua install** — Codex copy cây plugin vào
cache và **bỏ symlink**, skill về tới nơi thì rỗng.

**Việc cần làm:** thay glob-vào-cache bằng **prose invocation** — feature-loop gọi
`/acceptance` và để acceptance tự đọc reference của chính nó. Chỗ nào thật sự cần
đường dẫn (workflow script) thì để plugin **tự công bố** qua config/manifest,
không để consumer suy ra từ layout.

Đây là bài học có rủi ro cao nhất trong danh sách: nó âm thầm hỏng khi harness
đổi layout cache, và hỏng theo kiểu *nửa chạy nửa không*.

---

### Bài học #6 — Chưa có router skill; README 304 + GUIDE 801 dòng không thay được 🟠

Kit có `README.md` (304), `GUIDE.md` (801), `QUICKSTART.md` (236) — đều
**human-facing, nằm ngoài context**. Khi user hỏi *"giờ tôi nên chạy cái nào?"*,
không có gì agent nạp được để trả lời.

`ask-matt` giải bài này bằng một user-invoked skill 128 dòng vẽ:
main flow → on-ramps → codebase health → vocabulary underneath → standalone,
mỗi nhánh kèm điều kiện rẽ và **cả lời khuyên khi nào *không* dùng**
(*"save it for exactly that, never a well-scoped feature"*).

Kit có đúng hình dạng cần router: 2 edition (Claude/Codex) × 3 plugin
(acceptance-gate / feature-loop / design-loop) × T1/T2/T3 × 2 gate. Người mới
gần như chắc chắn sẽ chọn sai điểm vào.

Kèm theo là **luật bảo trì** trong CLAUDE.md của kit: đổi skill ⇒ cập nhật router.

---

### Bài học #7 — Sprawl: SKILL.md của kit dài gấp 2-4 lần trần của mattpocock 🟡

| Kit | Dòng | | mattpocock | Dòng |
|---|---|---|---|---|
| `feature-loop-codex` | **509** | | `teach` (dài nhất) | 140 |
| `ux-ui-craft` | **423** | | `diagnosing-bugs` | 134 |
| `acceptance` | **326** | | `wayfinder` | 128 |
| `feature-loop` | 166 | | `codebase-design` | 114 |

Kit **đã dùng progressive disclosure đúng** (`acceptance/references/` có 6 file —
contract-template, eval-executors, judge-personas, evidence-report-template…).
Vấn đề là bậc trên cùng vẫn còn quá nhiều.

Hai công cụ cắt, theo thứ tự:

1. **Branch test** — cái gì chỉ *một số* đường chạy cần thì đẩy xuống reference.
   `acceptance/SKILL.md` mang cả Phase 0/1/2/3 + Degradation table + Anti-patterns
   trong một file, nhưng một lần chạy thường chỉ đi **một phase**. Phase 3 VERIFY
   (dòng 167-278, ~110 dòng) là ứng viên rõ nhất.
2. **No-op test** — soát **từng câu**: câu này có đổi hành vi so với mặc định
   không? *"Be aggressive... most prose that fails should go, not be rewritten."*

Và soát **Negation**: kit dùng nhiều "KHÔNG …", "never …", "đừng …". Mỗi cái là
một con voi. Chỗ nào phát biểu positive được thì đổi; chỗ nào là guardrail cứng
thì giữ **nhưng phải kèm hành vi đích**.

---

### Bài học #8 — Kit đã đâm vào đúng bức tường ADR-0002 mô tả, và chọn nhánh mattpocock từ chối 🟠

Đây là phát hiện làm tôi bất ngờ nhất ở chiều ngược lại: **ADR-0002 của
mattpocock đọc như một bản khám bệnh viết sẵn cho kit.**

ADR đó ghi: Codex nhận `skills` **chỉ dưới dạng một chuỗi path** (mảng bị từ
chối với `missing or invalid plugin.json`), rồi quét đệ quy. Kit đúng như vậy:

```json
// codex/acceptance-gate/.codex-plugin/plugin.json
"skills": "./skills/"
```

ADR liệt kê 2 lối thoát đã thử **và loại**:
- trỏ thẳng `./skills/` → ship luôn cả `deprecated/`, `in-progress/`…
- thư mục symlink cong vẹo → **không sống sót qua install**: Codex copy cây
  plugin vào cache và **bỏ symlink**, skill về tới nơi thì rỗng.

Rồi kết luận chỉ còn 2 đường thật: **(a) restructure** để `skills/` chỉ chứa bản
promoted, hoặc **(b) commit bản sao phẳng** — mà (b) bị gọi thẳng tên là
*"a sync burden and a second source of truth"*. mattpocock **defer cả hai** thay
vì chọn (b).

**Kit đã chọn (b).** Bằng chứng trong repo:

- `scripts/sync-plugin-packages.sh` — bộ đồng bộ.
- `plugins/` là **build artifact được commit**: 100 file tracked, không nằm trong
  `.gitignore`.
- Kết quả đo: `find` ra **9.222 dòng SKILL.md cho ~12 skill duy nhất** — mỗi
  skill tồn tại 3-4 bản (`skills/` hoặc `codex/` là nguồn, `plugins/` là mirror,
  `.claude/worktrees/` là bản thứ tư khi có worktree).

Đây không phải sai lầm — kit **cần** ship Codex ngay, và (b) là cách duy nhất
làm được điều đó hôm nay. Nhưng nó là món nợ đã được người khác đo đạc trước,
nên đáng trả bằng hai cái chốt rẻ:

1. **Invariant kiểm được trong CLAUDE.md** — kiểu mattpocock: *"mọi skill
   promoted phải có entry trong manifest; skill không promoted không được
   xuất hiện"*. Kit hiện chưa có luật nào nói `plugins/` phải khớp nguồn, nên
   drift là im lặng. Một check trong `pre-merge-check.sh` (`sync-plugin-packages.sh
   --check` chạy được → diff rỗng) biến nó thành răng.
2. **Một ADR ghi lại chính lựa chọn này** — thoả cả 3 điều kiện: khó đảo (đã có
   consumer cài từ `plugins/`), gây bất ngờ (tại sao commit build artifact?), có
   trade-off thật (đường (a) blast radius lớn). Chưa ghi thì 6 tháng nữa sẽ có
   người đề xuất "dọn `plugins/` đi cho sạch".

Phần còn lại của bài học — bucket promoted/non-promoted — kit chưa cần, vì chưa
có skill nào bị khai tử. Nhưng quy ước `deprecated/` **giữ lại kèm README ghi lý
do** đáng nhớ sẵn: nhờ nó mà bài học "batch thua inline" ở §2.1 vẫn đọc được,
thay vì biến mất trong một commit `git rm`.

---

## Tóm tắt ưu tiên

| # | Bài học | Đòn bẩy | Công |
|---|---|---|---|
| 1 | `CONTEXT.md` — ubiquitous language cho kit | 🔴 Cao | Trung bình |
| 2 | `allow_implicit_invocation: false` cho 6 skill Codex | 🔴 Cao | **Rất thấp** |
| 5 | Bỏ glob-vào-cache, dùng prose invocation | 🔴 Cao (rủi ro) | Trung bình |
| 3 | `docs/adr/` — 1-3 câu, tạo lười | 🟠 Vừa | Thấp |
| 4 | `.out-of-scope/` + "Prior requests" | 🟠 Vừa | Thấp |
| 8 | Invariant sync `plugins/` + ADR cho lựa chọn (b) | 🟠 Vừa | Thấp |
| 6 | Router skill | 🟠 Vừa | Trung bình |
| 7 | Cắt sprawl bằng branch test + no-op test | 🟡 Vừa | Cao |

**Bốn việc rẻ nhất, làm được ngay:** #2 (6 file × 3 dòng YAML), #3, #4, và nửa
sau của #8 (một ADR + một dòng check trong `pre-merge-check.sh`).

**Một việc phải làm trước khi harness đổi layout cache:** #5.

**Việc đắt nhất nhưng đòn bẩy cao nhất:** #1 — vì nó là điều kiện để cắt #7.
Không có glossary thì mọi SKILL.md buộc phải tự định nghĩa lại, và sprawl không
cắt được.

---

## Phụ lục — trích dẫn đáng dán lên tường

> "A skill exists to wrangle determinism out of a stochastic system."

> "Create files lazily — only when you have something to write."

> "An ADR can be a single paragraph. The value is in recording *that* a decision
> was made and *why* — not in filling out sections."

> "`CONTEXT.md` ... is a glossary and nothing else."

> "Sediment — stale layers that settle because adding feels safe and removing
> feels risky. The default fate of any skill without a pruning discipline."

> "A new skill it never mentions, or a stale one it still routes to, is a router
> that lies."

> "Cognitive load ... is not a cost to minimise: it is the price of human agency."
