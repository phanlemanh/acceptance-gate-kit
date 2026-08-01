# Luật ngôn ngữ mặt người — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chuyển luật ngôn ngữ mặt người từ trạng thái thành văn (spec §4.1) sang trạng thái nhúng vào chỗ nghẽn đầu ra — một bản luật thi hành, tám chỗ sinh chữ-cho-người bắt buộc nạp nó, hai khuôn trình bày đặt một chỗ có marker, và quyền trả lại tại cổng.

**Architecture:** Một file nguồn `skills/acceptance/references/human-facing-language.md` chứa bảng luật (bọc marker, khớp từng ký tự với spec §4.1), hai khuôn trình bày (bảng ba cột + sơ đồ mermaid), và danh sách từ mới. Tám file sinh-đầu-ra trỏ tới nó bằng **ba dạng đường dẫn khác nhau tuỳ gói** — sáu chỗ cùng gói dùng biến gốc-plugin, hai chỗ khác gói phải đi qua `resolve-plugin.mjs`. Tám case mới trong `tests/plugins/run-tests.sh` (P89–P96), mỗi case có đối chứng dương trước rồi mới đột biến.

**Tech Stack:** Markdown (skills/commands/SKILL.md), bash test harness (`tests/plugins/run-tests.sh` với helper `run "<tên>" <cmd>`), python3 + node cho case, `scripts/sync-plugin-packages.sh` cho mirror.

## Global Constraints

- **Mirror là sản phẩm sinh máy.** Sửa nguồn xong PHẢI chạy `bash scripts/sync-plugin-packages.sh` và commit `plugins/` cùng lượt. Không bao giờ sửa tay dưới `plugins/`.
- **Assertion âm-tính-một-mình là assertion không sống.** Mọi case dựng bản sao rồi kết luận từ đột biến PHẢI chạy bản NGUYÊN VẸN trước và bản đó phải XANH, VÀ ghim đúng thông điệp mong đợi (không chỉ mã thoát).
- **Đường dẫn suy từ `$ROOT`** (`ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"` đã có sẵn ở đầu `run-tests.sh`). Cấm hardcode checkout của tác giả.
- **Fixture do code sinh trong chính lần chạy** — rút từ marker của bên VIẾT, không viết tay khuôn ở bên ĐỌC.
- **Literal dùng trong case mà cũng nằm trong file bị quét phải ghép mảnh** (bẫy P80: nếu để nguyên chuỗi, phép tìm khớp chính source của case).
- **Grep 0 hit là triệu chứng grep hỏng**, không phải bằng chứng sạch → mọi case quét diện rộng phải có bộ đếm sanity.
- Bảng luật N1–N6 phải **khớp từng ký tự** giữa `skills/acceptance/references/human-facing-language.md` và `docs/specs/workflow-v2-spec.md` §4.1.
- Tiền tố sổ quyết định đã chốt, nguyên văn: `lỗ-kit — ngôn ngữ mặt người`.
- Tên hai marker khuôn đã chốt: `PLAN-SUMMARY-TABLE-TEMPLATE`, `DECISION-DIAGRAM-TEMPLATE`. Marker bảng luật: `HFL-LAW-TABLE`. Marker từ mới: `HFL-GLOSSARY-TERMS`.
- Ba tên cột của khuôn bảng đã chốt — lấy nguyên văn từ khối marker `PLAN-SUMMARY-TABLE-TEMPLATE`, KHÔNG chép ra đây (xem hợp đồng case P93).
- Ngưỡng kích hoạt sơ đồ đã chốt: **từ ba bước nối tiếp hoặc từ hai nhánh rẽ trở lên**.

---

## File Structure

| File | Trách nhiệm | Task |
|---|---|---|
| `skills/acceptance/references/human-facing-language.md` (tạo) | Bản luật thi hành: phạm vi, bảng luật, hai phép thử, ví dụ TRƯỚC/SAU, hai khuôn, từ mới, quyền trả lại | 1 |
| `docs/specs/workflow-v2-spec.md` (sửa) | Bọc bảng luật §4.1 bằng marker + trỏ tới bản thi hành | 1 |
| `CONTEXT.md` (sửa) | Ba mục từ điển mới | 1 |
| `commands/acceptance-card.md` (sửa) | Nạp luật + quyền trả lại | 2 |
| `commands/acceptance-report.md` (sửa) | Nạp luật | 2 |
| `commands/acceptance-status.md` (sửa) | Nạp luật | 2 |
| `feature-loop/skills/feature-loop/SKILL.md` (sửa) | Nạp luật qua bộ giải + khuôn cho mọi lần trình | 2 |
| `codex/acceptance-gate/skills/acceptance-card/SKILL.md` (sửa) | Bản Codex của card | 2 |
| `codex/acceptance-gate/skills/acceptance-report/SKILL.md` (sửa) | Bản Codex của report | 2 |
| `codex/acceptance-gate/skills/acceptance-status/SKILL.md` (sửa) | Bản Codex của status | 2 |
| `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` (sửa) | Bản Codex của vòng lặp | 2 |
| `tests/plugins/run-tests.sh` (sửa) | P89, P92, P96 | 3 |
| `tests/plugins/run-tests.sh` (sửa) | P90, P91, P93, P94, P95 | 4 |
| 5 file `plugin.json` + `plugins/**` (sửa) | Bump version + mirror | 5 |

**Thứ tự bắt buộc:** Task 1 → 2 → 3 → 4 → 5. Task 3 và 4 cùng ghi vào `tests/plugins/run-tests.sh` nên KHÔNG chạy song song được.

---

### Task 1: Bản luật thi hành + marker ở spec + từ điển

`independent: false` — mọi task sau đều trỏ vào file này.
**Phục vụ:** E1, E2, E3, E4, E8 (một nửa), E9, E10, E14 → AC-1, AC-2, AC-3, AC-7, AC-8, AC-9, AC-13

**Files:**
- Create: `skills/acceptance/references/human-facing-language.md`
- Modify: `docs/specs/workflow-v2-spec.md:192-199` (bọc bảng luật bằng marker) và thêm một dòng trỏ tới bản thi hành sau đoạn "Cưỡng chế"
- Modify: `CONTEXT.md` (thêm ba mục vào phần `### Evidence vocabulary` hoặc một mục mới `### Song diện`)

**Interfaces:**
- Produces: bốn cặp marker mà Task 3/4 rút bằng regex — `HFL-LAW-TABLE`, `PLAN-SUMMARY-TABLE-TEMPLATE`, `DECISION-DIAGRAM-TEMPLATE`, `HFL-GLOSSARY-TERMS`. Dạng marker theo tiền lệ `OPP-FRONTMATTER-TEMPLATE`: `<!-- <<<NAME -->` … `<!-- NAME>>> -->` cho khối markdown hiển thị được, và `<<<NAME` … `NAME>>>` trần cho khối trong fence.
- Produces: đường dẫn `skills/acceptance/references/human-facing-language.md` mà Task 2 nhúng vào tám file.

- [ ] **Step 1: Tạo bản luật thi hành**

Tạo `skills/acceptance/references/human-facing-language.md`. **KHÔNG chép nội
dung file đó vào đây** — bản kế hoạch là hồ sơ xây dựng, không phải chỗ thứ hai
để luật sống. Chép vào đây là tự tay tạo bản sao mà AC-7/AC-8/AC-10 sinh ra để
chặn, và case P93 sẽ bắt đúng file này (round 2 đã bắt thật một lần).

Cấu trúc file, theo thứ tự — nội dung lấy từ `docs/specs/workflow-v2-spec.md`
§4.1, chép NGUYÊN VĂN phần bảng luật:

| Mục | Nguồn nội dung | Ràng buộc |
|---|---|---|
| Phạm vi áp / KHÔNG áp | §4.1 đoạn "Phạm vi áp dụng" | phải gọi đích danh `evals.yaml`, `run-log.jsonl`, frontmatter là vùng miễn trừ |
| Bảng sáu luật, bọc cặp marker `HFL-LAW-TABLE` | §4.1 bảng N1–N6 | khớp TỪNG KÝ TỰ với bản trong spec — chép, đừng gõ lại |
| Ngưỡng kích hoạt sơ đồ (N5) | quyết tại Cổng 1 | "từ ba bước nối tiếp hoặc từ hai nhánh rẽ trở lên"; nằm NGOÀI bảng luật |
| Nơi từ điển sống (N6) | quyết tại Cổng 1 | trỏ đích danh `CONTEXT.md`; nằm NGOÀI bảng luật |
| Hai phép thử | §4.1 | tên nguyên văn `Xoá-tên-máy` và `Người-thứ-ba` |
| Bảng ví dụ TRƯỚC/SAU | viết mới | mỗi luật N1–N6 ít nhất một cặp |
| Khuôn bảng, bọc cặp marker `PLAN-SUMMARY-TABLE-TEMPLATE` | viết mới | đúng ba cột (người-thấy-gì-khác · đụng-đâu · phục-vụ-tiêu-chí); ≥1 dòng ví dụ; không ô nào chứa dấu chấm giữa hay chấm phẩy |
| Khuôn sơ đồ, bọc cặp marker `DECISION-DIAGRAM-TEMPLATE` | viết mới | fence khai `mermaid`, ≥2 nút, ≥1 cạnh, nhãn nút không được là tên file |
| Danh sách từ mới, bọc cặp marker `HFL-GLOSSARY-TERMS` | viết mới | ≥3 từ, mỗi từ phải có mục trong `CONTEXT.md` |
| Quyền trả lại tại cổng | §4.1 câu cuối | nêu entry `revisit` với tiền tố nguyên văn `lỗ-kit — ngôn ngữ mặt người` |

- [ ] **Step 2: Bọc bảng luật ở spec bằng cùng cặp marker**

Trong `docs/specs/workflow-v2-spec.md`, chèn `<!-- <<<HFL-LAW-TABLE -->` ngay TRƯỚC dòng `| # | Luật |` (dòng 192) và `<!-- HFL-LAW-TABLE>>> -->` ngay SAU dòng N6 (dòng 199). Không đổi một ký tự nào của sáu dòng luật.

- [ ] **Step 3: Trỏ spec tới bản thi hành**

Trong `docs/specs/workflow-v2-spec.md`, ngay sau đoạn bắt đầu `**Cưỡng chế (không dựa vào trí nhớ):**`, thêm một dòng:

```markdown
Bản thi hành: `skills/acceptance/references/human-facing-language.md` — bảng luật ở hai nơi được giữ khớp từng ký tự bằng case P93.
```

- [ ] **Step 4: Thêm ba mục từ điển vào CONTEXT.md**

Trong `CONTEXT.md`, thêm một mục `### Song diện` ngay trước `### Evidence vocabulary`:

```markdown
### Song diện

**Mặt người**:
Nửa artifact dành cho người đọc và quyết: thẻ cổng, bảng tóm tắt kế hoạch,
báo cáo checkpoint, tin nhắn tại điểm quyết định. Chịu luật ngôn ngữ mặt
người (`skills/acceptance/references/human-facing-language.md`).
_Avoid_: UI (đó là surface của sản phẩm tiêu thụ), bản đẹp.

**Mặt máy**:
Nửa artifact dành cho hook/CI/script đọc: frontmatter, `evals.yaml`,
`run-log.jsonl`, mã nguồn. Ở đây tên chính xác là bắt buộc — luật ngôn ngữ
mặt người KHÔNG áp vào đây.
_Avoid_: backend, internal.

**Lỗ-kit**:
Vi phạm luật ngôn ngữ mặt người bị người duyệt bắt tại cổng, ghi vào sổ quyết
định bằng entry `revisit` có `decision` mở đầu `lỗ-kit — ngôn ngữ mặt người`.
Là lỗ của bộ công cụ chứ không phải lỗi của người viết — đếm được để đợt nâng
bộ thẻ đọc lại bằng số.
_Avoid_: bug, lỗi trình bày.
```

- [ ] **Step 5: Kiểm tay trước khi commit — bảng luật hai nơi phải giống nhau**

Chạy:

```bash
python3 - "$PWD" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
RX = re.compile(r"<!-- <<<HFL-LAW-TABLE -->\n([\s\S]*?)<!-- HFL-LAW-TABLE>>> -->")
a = RX.search((root / "skills/acceptance/references/human-facing-language.md").read_text(encoding="utf-8"))
b = RX.search((root / "docs/specs/workflow-v2-spec.md").read_text(encoding="utf-8"))
assert a and b, f"thieu marker: ref={bool(a)} spec={bool(b)}"
assert a.group(1) == b.group(1), "bang luat LECH giua hai file"
assert len(re.findall(r"^\| N[1-6] \|", a.group(1), re.M)) == 6, "khong du 6 luat"
print("OK: bang luat khop tung ky tu, du 6 luat")
PY
```

Expected: `OK: bang luat khop tung ky tu, du 6 luat`

- [ ] **Step 6: Chạy suite hiện có để chắc không làm hỏng gì**

Run: `bash tests/plugins/run-tests.sh`
Expected: không có dòng `FAIL:` nào.

- [ ] **Step 7: Commit**

```bash
git add skills/acceptance/references/human-facing-language.md docs/specs/workflow-v2-spec.md CONTEXT.md
git commit -m "feat(acceptance): bản thi hành luật ngôn ngữ mặt người + 2 khuôn có marker"
```

---

### Task 2: Tám chỗ trỏ nạp luật, ba dạng đường dẫn

`independent: false` — cần file của Task 1 tồn tại.
**Phục vụ:** E5, E6, E7, E12, E13 → AC-4, AC-5, AC-6, AC-11, AC-12

**Files:**
- Modify: `commands/acceptance-card.md` (bước 3 Translate + phần kết)
- Modify: `commands/acceptance-report.md` (bước 3 Print)
- Modify: `commands/acceptance-status.md` (bước 3 Print)
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (mục S2 — PLAN)
- Modify: `codex/acceptance-gate/skills/acceptance-card/SKILL.md`
- Modify: `codex/acceptance-gate/skills/acceptance-report/SKILL.md`
- Modify: `codex/acceptance-gate/skills/acceptance-status/SKILL.md`
- Modify: `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` (mục `## S2 - Plan`)

**Interfaces:**
- Consumes: `skills/acceptance/references/human-facing-language.md` (Task 1), hai tên marker khuôn.
- Produces: ba literal mà Task 4 ghim — đường dẫn `skills/acceptance/references/human-facing-language.md`, cụm mệnh lệnh `TRƯỚC khi viết`, tiền tố sổ `lỗ-kit — ngôn ngữ mặt người`.

- [ ] **Step 1: Ba lệnh bản Claude — chèn mệnh lệnh nạp**

Vào `commands/acceptance-card.md`, ngay đầu bước `3. **Translate**`, chèn đoạn (giữ nguyên phần còn lại của bước 3):

```markdown
   **Nạp luật TRƯỚC khi viết:** đọc `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md`
   (sáu luật N1–N6, hai phép thử, khuôn trình bày) TRƯỚC khi viết bất kỳ câu
   nào sẽ hiện cho người. Mỗi lần render là một lần đọc — luật không sống
   trong trí nhớ. Biến gốc-plugin không có thì giải như bước 1.
```

Vào `commands/acceptance-report.md`, ngay đầu bước `3. **Print:**`, chèn:

```markdown
   **Nạp luật TRƯỚC khi viết:** đọc `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md`
   (sáu luật N1–N6, hai phép thử, khuôn trình bày) TRƯỚC khi viết bất kỳ câu
   nào sẽ hiện cho người — bảng tổng kết là mặt người, không phải mặt máy.
```

Vào `commands/acceptance-status.md`, ngay trước `3. Print:`, chèn một mục đánh số lại thành bước 3 (và dời các bước sau xuống một số):

```markdown
3. **Nạp luật TRƯỚC khi viết:** đọc `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md`
   (sáu luật N1–N6, hai phép thử, khuôn trình bày) TRƯỚC khi viết bất kỳ câu
   nào sẽ hiện cho người.
```

- [ ] **Step 2: Ba skill bản Codex — cùng mệnh lệnh, đổi tên biến gốc**

Chèn cùng đoạn vào ba file, dùng `${PLUGIN_ROOT}` thay cho `${CLAUDE_PLUGIN_ROOT}`, đặt ngay trước mục dựng câu chữ cho người của từng skill:

- `codex/acceptance-gate/skills/acceptance-card/SKILL.md` → trước mục dịch sang ngôn ngữ sản phẩm
- `codex/acceptance-gate/skills/acceptance-report/SKILL.md` → trước mục in báo cáo
- `codex/acceptance-gate/skills/acceptance-status/SKILL.md` → trước mục in bảng

Đoạn chèn (bản tiếng Anh cho khớp giọng file Codex):

```markdown
## Load the language rules first

Read `${PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md`
(six rules N1–N6, two quick tests, the presentation templates) TRƯỚC khi viết
bất kỳ câu nào sẽ hiện cho người. Every render re-reads the file — the rules
do not live in memory.
```

- [ ] **Step 3: Hai SKILL vòng lặp — nạp qua bộ giải, KHÔNG ghép thẳng gốc gói**

Gói `feature-loop` và `feature-loop-codex` KHÔNG chứa bản luật, nên ghép thẳng gốc gói là con trỏ chết. Vào `feature-loop/skills/feature-loop/SKILL.md`, thay mục `## S2 — PLAN` mục 3 hiện tại bằng:

```markdown
3. **Trình cho người bằng tiếng sản phẩm — áp cho MỌI lần trình, không riêng T3.** Nạp bản luật TRƯỚC khi viết: `node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require skills/acceptance/references/human-facing-language.md` rồi đọc file `<kết quả>/skills/acceptance/references/human-facing-language.md`. Mọi lần trình kế hoạch hoặc tiến độ cho người dùng khuôn `PLAN-SUMMARY-TABLE-TEMPLATE` trong file đó; điểm quyết định từ ba bước nối tiếp hoặc hai nhánh rẽ trở lên thì kèm sơ đồ theo khuôn `DECISION-DIAGRAM-TEMPLATE`. **T3: GATE 1.5** — trình tóm tắt plan theo đúng khuôn đó rồi chờ duyệt. T2: đi tiếp luôn, không dừng.
```

Vào `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md`, mục `## S2 - Plan`, thêm ngay sau câu về `independent: true|false`:

```markdown
Load the language rules TRƯỚC khi viết anything a human will read: run
`node "${PLUGIN_ROOT}/scripts/resolve-plugin.mjs" --plugin acceptance-gate --require skills/acceptance/references/human-facing-language.md`
then read that file. Present every plan or progress summary — MỌI lần trình,
không riêng the T3 review stop — with the `PLAN-SUMMARY-TABLE-TEMPLATE` table;
a decision point with three or more sequential steps or two or more branches
also needs a diagram from `DECISION-DIAGRAM-TEMPLATE`.
```

- [ ] **Step 4: Quyền trả lại — chỉ hai bản lệnh dựng thẻ**

Vào `commands/acceptance-card.md`, thêm mục 7 sau mục 6 hiện có:

```markdown
7. **Người duyệt có quyền TRẢ LẠI thẻ.** Thẻ vi phạm luật ngôn ngữ mặt người
   thì người duyệt trả lại tại cổng, không duyệt cho xong rồi góp ý sau. Trả
   lại là lỗ của bộ công cụ chứ không phải lỗi của người viết: ghi vào
   `_acceptance/<slug>/decisions.jsonl` một entry `revisit` có `decision` mở
   đầu đúng chuỗi `lỗ-kit — ngôn ngữ mặt người` kèm câu vi phạm.
```

Vào `codex/acceptance-gate/skills/acceptance-card/SKILL.md`, thêm mục cuối:

```markdown
## The reviewer may reject the card

A card that breaks the human-facing language rules is rejected at the gate —
not approved with a comment for later. A rejection is a kit defect, not an
author mistake: append to `_acceptance/<slug>/decisions.jsonl` a `revisit`
entry whose `decision` starts with the exact string
`lỗ-kit — ngôn ngữ mặt người`, quoting the offending sentence.
```

- [ ] **Step 5: Kiểm tay — tám chỗ trỏ và dạng đường dẫn**

```bash
python3 - "$PWD" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
REF = "skills/acceptance/references/human-facing-language.md"
same_pkg = ["commands/acceptance-card.md", "commands/acceptance-report.md",
            "commands/acceptance-status.md",
            "codex/acceptance-gate/skills/acceptance-card/SKILL.md",
            "codex/acceptance-gate/skills/acceptance-report/SKILL.md",
            "codex/acceptance-gate/skills/acceptance-status/SKILL.md"]
resolver = ["feature-loop/skills/feature-loop/SKILL.md",
            "codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md"]
bad = []
for rel in same_pkg + resolver:
    t = (root / rel).read_text(encoding="utf-8")
    if REF not in t: bad.append(f"{rel}: thieu duong dan ban luat")
    if "TRƯỚC khi viết" not in t: bad.append(f"{rel}: thieu menh lenh nap")
for rel in resolver:
    t = (root / rel).read_text(encoding="utf-8")
    if f"--plugin acceptance-gate --require {REF}" not in t:
        bad.append(f"{rel}: phai nap qua bo giai plugin")
    if "PLUGIN_ROOT}/" + REF in t:
        bad.append(f"{rel}: ghep thang goc goi — goi nay khong chua ban luat")
    if "PLAN-SUMMARY-TABLE-TEMPLATE" not in t: bad.append(f"{rel}: thieu ten khuon bang")
assert not bad, bad
print(f"OK: {len(same_pkg)+len(resolver)} cho tro dung dang")
PY
```

Expected: `OK: 8 cho tro dung dang`

- [ ] **Step 6: Chạy suite hiện có**

Run: `bash tests/plugins/run-tests.sh`
Expected: không có dòng `FAIL:` nào.

- [ ] **Step 7: Commit**

```bash
git add commands/ feature-loop/skills/feature-loop/SKILL.md codex/
git commit -m "feat(acceptance): 8 chỗ sinh chữ-cho-người nạp bản luật, 2 harness"
```

---

### Task 3: Case P89, P92, P96 — nội dung bản luật, hai khuôn, từ điển

`independent: false` — cùng file với Task 4.
**Phục vụ:** E1, E2, E3, E4, E9, E10, E14 → AC-1, AC-2, AC-3, AC-8, AC-9, AC-13

**Files:**
- Modify: `tests/plugins/run-tests.sh` (chèn sau case P88, trước dòng tổng kết cuối file)

**Interfaces:**
- Consumes: bốn cặp marker của Task 1.
- Produces: helper không có — mỗi case là một khối `run "..." python3 - "$ROOT" <<'PY' … PY` độc lập, theo đúng khuôn P79/P83/P85 đã có trong file.

- [ ] **Step 1: Viết ba case P89, P92, P96 vào `tests/plugins/run-tests.sh`**

**KHÔNG chép mã case vào bản kế hoạch này.** Mã sống ở `tests/plugins/run-tests.sh`
— chép sang đây là tạo bản sao thứ hai của đúng những chuỗi mà P93 canh (tên ba
cột, thân khuôn sơ đồ, thân bảng luật), và round 2 đã bắt thật lỗi đó một lần.
Bản kế hoạch nêu HỢP ĐỒNG của mỗi case; mã là vật, không phải bản chép.

Mỗi case theo cùng một khuôn đã có sẵn trong file (xem P79, P83, P85 làm mẫu):
`run "<tên>" python3 - "$ROOT" <<'PY' … PY`, đường dẫn suy từ `$ROOT`.

| Case | Đo gì | Đối chứng dương | Đột biến bắt buộc → thông điệp ghim |
|---|---|---|---|
| P89 | Bản luật đủ sáu mã luật, hai phép thử đúng tên, ví dụ TRƯỚC/SAU phủ cả sáu, vế miễn trừ gọi đích danh ba vật máy, ngưỡng kích hoạt sơ đồ, nơi từ điển sống | bản nguyên vẹn XANH trước | xoá một luật → nêu đích danh mã luật thiếu · xoá ngưỡng → `N5 khong co nguong kich hoat` · xoá vế miễn trừ → `thieu ve pham vi KHONG ap` · xoá một cặp ví dụ → nêu luật chưa có ví dụ |
| P92 | Mỗi cặp marker khuôn xuất hiện đúng một lần; khuôn bảng rút qua marker cho đúng ba tiêu đề cột và mỗi dòng ví dụ ba ô; khuôn sơ đồ cho fence khai `mermaid`, ≥2 nút, ≥1 cạnh, nhãn nút không phải tên file | bản nguyên vẹn XANH trước | bỏ một cột · thêm cột thứ tư · nhồi hai việc vào một ô · fence mất khai báo ngôn ngữ · nhãn nút thành tên file — **năm thông điệp RIÊNG** |
| P96 | Danh sách từ rút qua marker, mỗi từ có mục trong `CONTEXT.md`; bộ đếm sanity ≥3 từ | bản nguyên vẹn XANH trước | xoá một mục khỏi bản sao từ điển → nêu đích danh từ thiếu |

Luật chung cho cả ba: fixture **rút từ marker của bên viết**, không viết tay ở
bên đọc; literal nào cũng nằm trong file bị quét thì phải ghép mảnh (bẫy P80).

- [ ] **Step 2: Chạy suite và xác nhận ba case XANH**

Run: `bash tests/plugins/run-tests.sh`
Expected: không có dòng `FAIL:` nào; thấy `PASS: P89`, `PASS: P92`, `PASS: P96`.


- [ ] **Step 7: Commit**

```bash
git add tests/plugins/run-tests.sh
git commit -m "test(plugins): P89 P92 P96 — nội dung bản luật, hai khuôn, từ điển"
```

---

### Task 4: Case P90, P91, P93, P94, P95 — chỗ trỏ, một-nguồn, quyền trả lại, gói đã đóng

`independent: false` — cùng file với Task 3, phải chạy sau.
**Phục vụ:** E5, E6, E7, E8, E11, E12, E13 → AC-4, AC-5, AC-6, AC-7, AC-10, AC-11, AC-12

**Files:**
- Modify: `tests/plugins/run-tests.sh` (chèn sau P96)

**Interfaces:**
- Consumes: tám chỗ trỏ của Task 2, marker `HFL-LAW-TABLE` của Task 1, mirror của Task 5 (P95 chạy trên `plugins/**` — nên Task 5 phải chạy sync TRƯỚC khi P95 xanh; xem ghi chú thứ tự ở Step 6).

- [ ] **Step 1: Viết năm case P90, P91, P93, P94, P95 vào `tests/plugins/run-tests.sh`**

Cùng luật với Task 3: **không chép mã vào bản kế hoạch**, chỉ nêu hợp đồng.

| Case | Đo gì | Đối chứng dương | Đột biến bắt buộc → thông điệp ghim |
|---|---|---|---|
| P90 | Đủ tám chỗ trỏ có đường dẫn bản luật + mệnh lệnh nạp; hai bản vòng lặp có mệnh đề áp cho MỌI lần trình và gọi cả hai tên khuôn | bản nguyên vẹn XANH trước | gỡ con trỏ khỏi MỘT file → nêu tên file thiếu · thu mệnh đề về riêng T3 → `pham vi khuon bi thu hep` |
| P91 | Đường dẫn **rút từ chính tám file** trỏ vào vật thật trên cây nguồn; bộ đếm sanity đúng 8/8 | bản sao dựng đủ MỌI vật được trỏ, XANH trước | đổi tên vật đích trong bản sao → `con tro tro file khong ton tai` |
| P93 | Bảng luật khớp **từng ký tự** giữa bản thi hành và spec; thân luật đúng hai chỗ, tên ba cột và thân khuôn sơ đồ mỗi thứ đúng một chỗ. Vùng quét là **danh-sách-loại-trừ đi từ gốc cây**, loại đúng ba mục hợp đồng khai (`plugins/`, `_acceptance/`, `tests/`) — không được khoét thêm. Bộ đếm sanity **theo từng thư mục nguồn** | bản nguyên vẹn XANH trước | sửa một chữ ở MỘT bản luật → nêu tên CẢ HAI file lệch · **ghi file thật** chứa bản sao vào một cây nguồn bất kỳ (bản sao rsync) → ba thông điệp riêng |
| P94 | Cả hai bản lệnh dựng thẻ nêu quyền trả lại và tiền tố sổ nguyên văn | bản nguyên vẹn XANH trước | gỡ khỏi MỘT bản → nêu tên bản thiếu |
| P95 | Con trỏ giải được **trong gói đã đóng**: ba skill cùng gói ghép gốc-gói ra vật thật; bản vòng lặp thuộc gói KHÁC phải đi qua bộ giải, và bộ giải có mặt trong gói | gói nguyên vẹn XANH trước | di chuyển bản luật trong bản sao gói → `pointer trong goi … khong ton tai` · đổi con trỏ vòng lặp thành ghép-thẳng-gốc-gói → `phai qua bo giai plugin` |

**Bẫy đã trả giá hai vòng, đừng dẫm lại:** vùng quét của P93 phải là
danh-sách-loại-trừ, và đối chứng âm phải **ghi file thật ra ngoài** vùng từng bị
bỏ lọt. Round 1 dùng danh-sách-cho-phép nên bỏ lọt hai cây nguồn; round 2 khoét
thêm một mục loại trừ và mục đó đang chứa hàng thật.


- [ ] **Step 6: Đồng bộ mirror TRƯỚC khi chạy suite (P95 đọc `plugins/**`)**

Run: `bash scripts/sync-plugin-packages.sh`
Expected: `Synced Codex packages: …`

- [ ] **Step 7: Chạy toàn suite**

Run: `bash tests/plugins/run-tests.sh`
Expected: không có dòng `FAIL:` nào; thấy `PASS: P90` … `PASS: P96`.

- [ ] **Step 8: Commit**

```bash
git add tests/plugins/run-tests.sh plugins/
git commit -m "test(plugins): P90 P91 P93 P94 P95 — chỗ trỏ, một-nguồn, quyền trả lại, gói đã đóng"
```

---

### Task 5: Bump version + đóng gói lại + kiểm toàn bộ

`independent: false` — chạy cuối.
**Phục vụ:** E15 → AC-14

**Files:**
- Modify: `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `codex/acceptance-gate/.codex-plugin/plugin.json` (acceptance-gate: 1.27.0 → 1.28.0)
- Modify: `feature-loop/.claude-plugin/plugin.json`, `codex/feature-loop-codex/.codex-plugin/plugin.json` (feature-loop: 1.19.0 → 1.20.0)
- Modify: `plugins/**` (sinh máy)

**Interfaces:**
- Consumes: mọi thay đổi của Task 1–4.

- [ ] **Step 1: Bump ba manifest của acceptance-gate cùng lúc**

Case P03 đòi ba manifest KHỚP NHAU. Sửa cả ba `version` thành `1.28.0`, và cập nhật `description` để nhắc hành vi mới (bản luật ngôn ngữ mặt người + hai khuôn trình bày).

- [ ] **Step 2: Bump hai manifest của feature-loop**

Sửa `version` thành `1.20.0` ở cả hai; `description` nhắc "trình kế hoạch bằng khuôn ngôn ngữ mặt người".

- [ ] **Step 3: Đóng gói lại**

Run: `bash scripts/sync-plugin-packages.sh`
Expected: `Synced Codex packages: acceptance-gate@1.28.0 feature-loop-codex@1.20.0 design-loop@…`

- [ ] **Step 4: Kiểm mirror không lệch**

Run: `bash scripts/sync-plugin-packages.sh --check`
Expected: `plugins/ mirror in sync.` (exit 0)

- [ ] **Step 5: Chạy cả ba suite của cổng**

```bash
bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh && bash tests/workflows/run-tests.sh
```
Expected: không có dòng `FAIL:` nào ở suite nào.

- [ ] **Step 6: Commit**

```bash
git add .claude-plugin .codex-plugin codex feature-loop/.claude-plugin plugins/
git commit -m "chore(release): acceptance-gate 1.28.0 + feature-loop 1.20.0 — luật ngôn ngữ mặt người"
```

---

## Self-Review

**1. Spec coverage** — 15 tiêu chí, mỗi cái có task:

| Tiêu chí | Task | Case |
|---|---|---|
| AC-1 nội dung bản luật + ngưỡng N5 | 1 | P89 |
| AC-2 vế miễn trừ mặt máy | 1 | P89 |
| AC-3 từ điển chỉ đích danh | 1 | P89 |
| AC-4 tám chỗ trỏ | 2 | P90 |
| AC-5 con trỏ sống trên cây nguồn | 2 | P91 |
| AC-6 con trỏ sống trong gói đã đóng | 2 + 5 | P95 |
| AC-7 luật hai nơi khớp từng ký tự | 1 | P93 |
| AC-8 hai khuôn, marker duy nhất | 1 | P92 |
| AC-9 round-trip hai khuôn | 1 | P92 |
| AC-10 khuôn một chỗ | 1 | P93 |
| AC-11 khuôn áp mọi lần trình | 2 | P90 |
| AC-12 quyền trả lại + tiền tố sổ | 2 | P94 |
| AC-13 từ mới vào từ điển | 1 | P96 |
| AC-14 đóng gói lại | 5 | `sync --check` |
| AC-15 văn tự tuân luật *(judgment)* | 1 + 2 | panel S4 |

**2. Placeholder scan** — không có "TBD"/"tương tự Task N"/"xử lý lỗi phù hợp"; mọi case có mã đầy đủ.

**3. Type consistency** — tên marker, tên cột, tiền tố sổ, danh sách tám chỗ trỏ dùng chung một literal ở mọi task; danh sách `SITES` xuất hiện ở P90 và P91 với thứ tự giống nhau (index 3 và 7 là hai SKILL vòng lặp ở cả hai case).

**4. Thứ tự bắt buộc** — P95 đọc `plugins/**` nên Task 4 Step 6 chạy `sync-plugin-packages.sh` trước khi chạy suite; Task 5 chạy lại sau khi bump version.
