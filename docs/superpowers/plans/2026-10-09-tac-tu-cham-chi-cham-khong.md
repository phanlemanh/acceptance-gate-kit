# Tác tử chấm không cầm bút — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mọi tác tử chấm của `acceptance-verify.js` chạy dưới một trong ba loại tác tử của gói feature-loop, không có công cụ sửa tệp. Nếu cây vẫn đổi trong lượt, `thuoc-vat --write` quy trách nhiệm cho đúng tác tử, tự hoàn lại khi an toàn, và ghi dòng đếm.

**Architecture:**
- Lối A: một bảng `AGENT_TYPES` cạnh `MODEL_ROUTES`. Hàm `vaiOpt(role)` thay `modelOpt(role)` ở 9 chỗ gọi. `agentT` bắt lỗi «agent type … not found», gọi lại một lần không loại, và ghi dòng `loai-tac-tu-vang`.
- Lối D: thư viện `feature-loop/scripts/lib/ghi-boi.mjs` giữ một nguồn cho bốn việc: đọc transcript, quy trách nhiệm, dựng dòng sổ, hoàn lại. `thuoc-vat --write` gọi nó ngay sau `dongCayDoi`.

**Tech Stack:** Node ESM script (`.mjs`); workflow script thuần JS (không fs); bash cho `rang.sh`; git.

**Spec:** `docs/superpowers/specs/2026-10-09-tac-tu-cham-chi-cham-khong-design.md` · hợp đồng `_acceptance/tac-tu-cham-chi-cham-khong/contract.md` · `evals.yaml`.

## Global Constraints

- Đề bài gửi tác tử giữ NGUYÊN TỪNG BYTE so với `v2.26.0` (AC-3). Chỉ `opts.agentType` được thêm.
- Tên loại: `feature-loop:cham-doc` · `feature-loop:cham-lenh` · `feature-loop:cham-ui`.
- Danh sách công cụ:
  - `cham-doc`: `tools: Read, Grep, Glob`.
  - `cham-lenh`: `tools: Bash, Read, Grep, Glob`.
  - `cham-ui`: `disallowedTools: Edit, Write, NotebookEdit`, không có dòng `tools:`.
- Mã thoát `thuoc-vat --write` khi cây đổi vẫn là **6**, kể cả khi đã hoàn lại.
- Không thêm lời dặn tác tử chấm «không sửa mã» ở bất cứ đâu (AC-7d).
- Mọi đường dẫn trong test và `rang.sh` suy từ vị trí script. Fixture do code sinh; bản trích transcript 07/10 là vật thật.
- Mỗi phép đo mới có cặp hai chiều trên cùng fixture và thông điệp ghim (MEASURE-BIRTH-CLAUSE).

## Review Focus

1. Vai không được gọi lần nào trong một lượt (triage khi không có finding, baseline khi `runBaseline:false`). Ca kiểm «mọi lời gọi của vai X mang loại Y» xanh rỗng được. AT2 phải đòi mỗi vai có ≥1 lời gọi (Task 2).
2. `agent()` ném lỗi khác «not found» (tác tử chết, hạn mức). Phải giữ hành vi cũ: không gọi lại, không ghi dòng (Task 2, AT4 chiều im).
3. Đường tuyệt đối trong transcript là realpath khác dạng (`/var` so với `/private/var` trên macOS). So sau khi `realpath` cả hai phía (Task 3, hàng 1 dùng `mkdtemp` dưới `/var`).
4. Lệnh Bash nhiều dòng (heredoc commit message) chứa chuỗi giống đường tệp trong thân message. `git commit` vẫn quy đúng, không quy nhầm tệp khác (Task 3, hàng 2 trích thật có heredoc).
5. Cây có tệp mới chưa theo dõi do tác tử tạo. Không hoàn lại, không chặn hoàn lại phần còn lại, chỉ gọi tên (Task 3, AT6 ca an toàn có thêm một tệp mới).

---

### Task 1: Ba định nghĩa tác tử chấm

**independent: true** · phục vụ E1 (AC-1)

**Files:**
- Create: `feature-loop/agents/cham-doc.md`, `feature-loop/agents/cham-lenh.md`, `feature-loop/agents/cham-ui.md`
- Create: `tests/workflows/tac-tu-cham-hep.test.mjs` (nhóm AT1; các nhóm AT2–AT4 thêm ở Task 2)

**Interfaces:**
- Produces: ba tệp có frontmatter `name`, `description`, và `tools` hoặc `disallowedTools`. Hàm test `docFrontmatter(path) → {name, tools:[...]|null, disallowedTools:[...]|null}`.

- [ ] Step 1: Viết test AT1. Ma trận viết trước là 3 loại × trường công cụ mong đợi + `name` khớp tên tệp (12 khẳng định, đếm `n === 12`). Thông điệp FAIL ghim: `AT1 cham-doc Write`, `AT1 cham-lenh Edit`, `AT1 cham-ui Edit`, gắn với phần tử tương ứng của ma trận.
- [ ] Step 2: `node tests/workflows/tac-tu-cham-hep.test.mjs --only AT1`. Mong FAIL «khong doc duoc … cham-doc.md».
- [ ] Step 3: Viết ba tệp. Thân là hai câu mô tả vai, không câu cấm nào:

```markdown
---
name: cham-doc
description: Tác tử chấm của kit nghiệm thu — vai đọc và phán xét (hội đồng, phân loại phạm vi, tổng hợp báo cáo). Chỉ đọc tệp được giao.
tools: Read, Grep, Glob
---
Bạn là tác tử chấm của bộ nghiệm thu. Làm đúng đề bài được giao và trả kết quả qua công cụ kết quả.
```

  `cham-lenh`: `tools: Bash, Read, Grep, Glob`, mô tả «vai chạy lệnh máy, baseline, tìm lỗi, phản bác, xuất xứ». `cham-ui`: `disallowedTools: Edit, Write, NotebookEdit`, mô tả «vai chấm giao diện — giữ công cụ trình duyệt của kho».
- [ ] Step 4: Chạy lại AT1 → PASS. Phá thử bằng tay một lần (thêm `Write` vào `cham-doc`) → đỏ đúng «AT1 cham-doc Write», rồi hoàn lại.
- [ ] Step 5: Commit `feat(feature-loop): ba loại tác tử chấm không có công cụ sửa tệp`.

### Task 2: Bảng vai → loại, đường rơi có tên ở `acceptance-verify.js`

**independent: false** (cần tên loại của Task 1) · phục vụ E2, E3, E4 (AC-2, AC-3, AC-4)

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` (khối MODEL ROUTING ~dòng 508–541; 9 chỗ `...modelOpt('x')`; hai `return {` cuối lượt ~1790, ~1852)
- Modify: `tests/workflows/tac-tu-cham-hep.test.mjs` (nhóm AT2, AT3, AT4)

**Interfaces:**
- Produces:
  - `AGENT_TYPES` (object vai → `'feature-loop:cham-…'`);
  - `vaiOpt(role) → {model?, agentType}`;
  - khoá kết quả `loaiTacTuVang: string[]`, chỉ có mặt khi không rỗng;
  - dòng run-log khuôn `LOAI-VANG-LINE`: `{"kind":"loai-tac-tu-vang","ts":"<invokedAt>","round":<n>,"vai":["<vai>"],"ly_do":"<thông điệp lỗi đầu tiên>"}`.

- [ ] Step 1: Viết test.
  - **AT2:** args của W10 thêm một judgment, một ui-check, một finding conventions không bị bác (`refute: refuted:false`) để triage chạy; responder có nhánh `triage`. Với mỗi vai trong 9 vai (nhận qua tiền tố nhãn): số lời gọi ≥ 1 VÀ mọi lời gọi mang đúng `opts.agentType`. Tổng lời gọi thiếu `agentType` = 0.
  - **AT3:** lấy `git show v2.26.0:feature-loop/workflows/acceptance-verify.js` trong lần chạy, tải qua `runWorkflow(…, srcOverride)` trên cùng args và responder. So `calls.map(c=>c.prompt)`, `result.verdict`, `result.runLog`: bằng nhau. So `opts` sau khi bỏ `agentType`: bằng nhau.
  - **AT4:** responder ném `new Error("agent type 'feature-loop:cham-doc' not found. Available agents: …")` khi `call.opts.agentType` có mặt, và trả bình thường khi vắng. Mong:
    - mỗi nhãn xuất hiện đúng 2 lần (một có loại, một không) với cùng `prompt`;
    - phán quyết = lượt sạch;
    - đúng 1 dòng `loai-tac-tu-vang` có `vai` = tập vai đã gọi;
    - `result.loaiTacTuVang` có mặt.

    Chiều im: responder ném `new Error('boom')` cho `machine:` → không gọi lại (nhãn ấy xuất hiện 1 lần), không dòng `loai-tac-tu-vang`.
- [ ] Step 2: Chạy `--only AT2,AT3,AT4` → FAIL (agentType undefined).
- [ ] Step 3: Cài đặt.

```js
// Bảng vai → loại tác tử (hồ sơ tac-tu-cham-chi-cham-khong). Vai không cần ghi thì không cầm bút:
// danh sách công cụ sống ở feature-loop/agents/<loại>.md. Đổi bảng = đổi test AT2.
const AGENT_TYPES = {
  machine: 'feature-loop:cham-lenh', baseline: 'feature-loop:cham-lenh', finder: 'feature-loop:cham-lenh',
  refute: 'feature-loop:cham-lenh', provenance: 'feature-loop:cham-lenh',
  ui: 'feature-loop:cham-ui',
  judge: 'feature-loop:cham-doc', triage: 'feature-loop:cham-doc', synthesize: 'feature-loop:cham-doc',
}
const vaiOpt = role => ({ ...modelOpt(role), agentType: AGENT_TYPES[role] })
// Loại chỉ nạp lúc MỞ phiên — phiên mở trước khi cài gói gặp «not found» ở mọi lời gọi.
// Rơi có tên: gọi lại MỘT lần không loại, ghi vai vào loaiVang; lỗi khác giữ hành vi cũ.
const LOAI_VANG_RE = /agent type .* not found/i
const loaiVang = new Map()   // vai → thông điệp lỗi đầu tiên
const vaiCuaLoai = Object.fromEntries(Object.entries(AGENT_TYPES).map(([k, v]) => [k, v]))
const agentT = (prompt, opts) => {
  const p = `[wf-label: ${opts.label}]\n${prompt}`
  return agent(p, opts).catch(e => {
    if (!opts.agentType || !LOAI_VANG_RE.test(String(e && e.message || e))) throw e
    const vai = opts.vai || opts.label.split(':')[0]
    if (!loaiVang.has(vai)) loaiVang.set(vai, String(e && e.message || e).split('\n')[0])
    const { agentType, ...con } = opts
    return agent(p, con)
  })
}
```

  `opts.vai` không có trong harness thật. Vì vậy `vaiOpt` cũng KHÔNG thêm trường lạ: vai được suy từ bảng ngược `agentType` + nhãn. Cách đơn giản: `vaiOpt` trả thêm khoá riêng tư được lọc trước khi gọi `agent`. Chốt khi code: so `opts` sau khi bỏ `agentType` phải bằng `v2.26.0` (AT3), nên KHÔNG thêm khoá nào khác vào `opts`. Vai suy từ tiền tố nhãn (`machine:`/`ui:`/`judge:`/`review:`→finder/`refute:`/`triage`/`baseline:`/`capture:provenance`→provenance/`synthesize:`).

  Trước MỖI `return {` cuối lượt (hai chỗ), nối dòng:

```js
const ghiLoaiVang = () => { if (loaiVang.size) runLogLines.push(JSON.stringify({ kind: 'loai-tac-tu-vang', ts: invokedAt, round: args.round, vai: [...loaiVang.keys()], ly_do: [...loaiVang.values()][0] })) }
```

  Thêm `...(loaiVang.size ? { loaiTacTuVang: [...loaiVang.keys()] } : {})` vào hai object trả về. Đặt khối marker `LOAI-VANG-LINE` cạnh `ghiLoaiVang`. Đổi 9 chỗ `...modelOpt('x')` → `...vaiOpt('x')`.
- [ ] Step 4: Chạy AT2–AT4 → PASS. Chạy `bash tests/workflows/run-tests.sh` (toàn suite workflow) → xanh, đặc biệt W10 và các ca so đề bài v2.24.0.
- [ ] Step 5: Commit `feat(acceptance-verify): mỗi vai chấm chạy dưới loại tác tử hẹp; rơi có tên khi loại vắng`.

### Task 3: Quy trách nhiệm + tự hoàn lại ở bước sau-lượt

**independent: false** (độc lập mã với Task 2, nhưng chung tệp `rang.sh` ở Task 5) · phục vụ E5, E6 (AC-5, AC-6)

**Files:**
- Create: `feature-loop/scripts/lib/ghi-boi.mjs`
- Modify: `feature-loop/scripts/thuoc-vat.mjs` (USAGE + `VAL` nhận `transcript` lặp được + nhánh `if (so.tep.length)` sau `dongCayDoi`)
- Create: `tests/fixtures/ghi-boi/0710-agent-ae624896.jsonl` (các dòng assistant `tool_use` Write/Edit/Bash git add/commit, NGUYÊN VĂN, rút bằng script một lần, kèm `README.md` nói nguồn + gốc cần thay `/Users/manhphan/dev/acceptance-gate-kit/.claude/worktrees/gifted-euler-725261`)
- Create: `tests/scripts/ghi-boi-tac-tu-cham.test.mjs` (nhóm AT5, AT6; dùng `dungKho` của `thuoc-vat-fixture.mjs`, `s4-args` thật, `thuoc-vat --write` thật)

**Interfaces:**
- Produces (từ `ghi-boi.mjs`):
  - `timTranscript({root, slug, invokedAt, home}) → string[]` (thư mục `wf_*`);
  - `docTranscript(dirs) → [{id, vai, dung:[{ten, input}]}]`;
  - `quyTrachNhiem({root, tep:[{tep,doi}], tacTu}) → {tac_tu:[{id,vai,cong_cu,tep}], tep_khong_ro:[]}`;
  - `hoanLai({root, chup, so, quy}) → {hoan_lai:boolean, ly_do?:string}`;
  - `dongGhiBoi({ts, round, luotTs, sha, quy, hoan, khongDocDuoc}) → string` theo khuôn marker `GHI-BOI-LINE`;
  - hằng `GHI_RE`.
- Consumes: `soCay`, `dongCayDoi` (`lib/cay-doi.mjs`); `cayChup`, `invokedAt`, `round` từ tệp args.

- [ ] Step 1: Viết test AT5 (10 hàng) và AT6 (1 ca an toàn + 4 ca không an toàn). Mỗi hàng: kho mới, `s4-args` thật, tiêm thay đổi + transcript, `thuoc-vat --write [--transcript dir]`, đọc dòng sổ. Ghim:
  - mã 6;
  - số dòng `ghi-boi` = số dòng `cay-doi` = 1;
  - khoá dòng = khoá khuôn rút từ marker;
  - `tac_tu[].id`, `cong_cu`, `tep_khong_ro`, `khong_doc_duoc`, `hoan_lai`, `ly_do`.

  Riêng AT6 ca an toàn: `git rev-parse HEAD` == sha đã chấm; tệp sạch; stderr `da hoan lai`; `s4-args` lượt kế thoát 0 và `round` == round cũ. Hàng 6, 10: `HOME` giả, đặt transcript dưới `HOME/.claude/projects/<mã-hoá>/<sess>/subagents/workflows/wf_x/` với `journal.jsonl` mtime sau `invokedAt`. Hàng 10 dùng mã hoá của một đường KHÁC `--root`.
- [ ] Step 2: Chạy → FAIL (không có dòng `ghi-boi`).
- [ ] Step 3: Cài đặt `ghi-boi.mjs`.
  - `GHI_RE = /(^|[\s;&|(])(sed\s+(-[a-zA-Z]*i|--in-place)|perl\s+-[a-zA-Z]*i|tee\b|mv\b|cp\b|rm\b|git\b[^;&|\n]*\b(checkout|restore|apply|am|stash|reset|rebase|merge|cherry-pick)\b)|>>?/`.
  - Nhận commit: `/\bgit\b[^;&|\n]*\bcommit\b/`.
  - «Nhắc tới F»: chứa `F` tương đối, hoặc chứa `realpath(root)/F`, hoặc (`cd <dir>` trong lệnh với `realpath(resolve(root, dir))` là tổ tiên của `root/F`) và lệnh chứa `basename(F)`.
  - Edit/Write/NotebookEdit: so `realpath(dirname(file_path))/basename` với `realpath(root)/F`.
  - Hoàn lại theo đúng bốn điều kiện của design §3.3. Thứ tự: `git reset --keep <sha>` (nếu có commit) → `git checkout <sha> -- <tệp>` → `soCay` lại phải rỗng.

  Nối vào `thuoc-vat.mjs` ngay sau `appendFileSync(dc)`. Không transcript nào → `khong_doc_duoc: 'khong tim thay transcript cua luot'`. Đã hoàn lại → stderr `thuoc-vat: da hoan lai — sinh args lai cung round`.
- [ ] Step 4: Chạy AT5, AT6 → PASS; chạy `node tests/scripts/cay-doi-trong-luot.test.mjs` → vẫn xanh (LC2 thêm dòng mới không làm hỏng ca đếm dòng `cay-doi`).
- [ ] Step 5: Commit `feat(thuoc-vat): quy trách nhiệm cây đổi cho tác tử chấm, tự hoàn lại khi an toàn`.

### Task 4: SKILL feature-loop — ba chỗ chữ

**independent: true** · phục vụ E7 (AC-7)

**Files:** Modify `feature-loop/skills/feature-loop/SKILL.md`, bước «Mọi verdict» của S4 và đoạn mã 6.

- [ ] Step 1: Lệnh `thuoc-vat.mjs --root . --slug <slug> --write` → thêm `--transcript "<transcriptDir>"` (transcriptDir của kết quả Workflow, cùng giá trị đưa cho `wf-usage`).
- [ ] Step 2: Đoạn mã 6 thêm một câu: stderr `da hoan lai` nghĩa là máy đã hoàn lại (dòng `ghi-boi-tac-tu-cham` mang `hoan_lai: true`), sinh args lại cùng round, không hỏi; `hoan_lai: false` thì đi nhánh hai ca sẵn có.
- [ ] Step 3: Một câu về `loaiTacTuVang`: lượt chạy không có loại tác tử hẹp vì phiên mở trước khi cài gói, báo một dòng, không chặn.
- [ ] Step 4: Chạy `bash tests/plugins/run-tests.sh` (các ca rút khối marker của SKILL) → xanh.
- [ ] Step 5: Commit `docs(feature-loop): SKILL nói đường transcript, tự hoàn lại, loại tác tử vắng`.

### Task 5: Răng hồ sơ `rang.sh`

**independent: false** (cần test của Task 1–3) · phục vụ E1–E6

**Files:** Create `_acceptance/tac-tu-cham-chi-cham-khong/rang.sh` (theo khuôn `_acceptance/luot-cham-ghi-vao-cay/rang.sh`: `copy_tree` + `inject` chứng mũi tiêm trúng + chân chạy cây thật rồi bản sao).

Chân → nhóm → đột biến (mỗi đột biến: chuỗi trước/sau nguyên văn, khớp đúng 1 chỗ):

| Chân | Nhóm | Đột biến → thông điệp ghim |
|---|---|---|
| `dinh-nghia` | AT1 | `tools: Read, Grep, Glob` → `tools: Read, Grep, Glob, Write` ở cham-doc → «FAIL: AT1 cham-doc Write»; `tools: Bash, Read, Grep, Glob` → `…, Edit` ở cham-lenh → «FAIL: AT1 cham-lenh Edit»; `disallowedTools: Edit, Write, NotebookEdit` → `disallowedTools: Write, NotebookEdit` → «FAIL: AT1 cham-ui Edit» |
| `bang-vai` | AT2 | `agentType: AGENT_TYPES[role]` → `agentType: undefined` → «FAIL: AT2 thieu agentType»; `judge: 'feature-loop:cham-doc'` → `judge: 'feature-loop:cham-lenh'` → «FAIL: AT2 judge» |
| `luot-sach` | AT3 | chèn `x` vào đuôi `DUOI_LENH_MAY` → «FAIL: AT3 de bai» |
| `duong-roi` | AT4 | `LOAI_VANG_RE.test(` → `true || LOAI_VANG_RE.test(` → «FAIL: AT4 im»; bỏ thân `ghiLoaiVang` → «FAIL: AT4 dong» |
| `quy-trach` | AT5 | `GHI_RE` → mẫu khớp mọi lệnh → «FAIL: AT5 hang 7»; tắt nhánh `cd` → «FAIL: AT5 hang 8» |
| `hoan-lai` | AT6 | bỏ kiểm nhánh xa → «FAIL: AT6 da day»; bỏ kiểm `chup.ban` → «FAIL: AT6 ban san»; `s4-args` thấy hoàn lại nhưng round + 1 (tiêm ở chỗ quyết round cùng/khác của s4-args) → «FAIL: AT6 cung round» |

- [ ] Step 1: Viết `rang.sh`. Chạy từng chân trên cây thật → xanh, mỗi đột biến → đỏ đúng thông điệp.
- [ ] Step 2: Chạy `bash _acceptance/tac-tu-cham-chi-cham-khong/rang.sh --chan <c>` cho cả 6 chân.
- [ ] Step 3: Commit `test(tac-tu-cham-chi-cham-khong): răng hồ sơ sáu chân`.

### Task 6: Đóng S3

- [ ] Chạy suite theo `feature_loop.suite_keys` của kit (như đường nền) → xanh.
- [ ] `node scripts/product-map.mjs --root .` nếu hồ sơ đổi trạng thái.
- [ ] Đặt `status: implemented` trong contract, commit, rồi S4.
