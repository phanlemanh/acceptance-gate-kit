# Đường lùi phải sống — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Làn máy-đi-trước có đường lùi thật ở hai cửa — lệnh ký chạy làn máy trước chữ ký và ghim lại cùng lượt; chế độ nghiêm coi «soi lại không chạy được» là vi phạm; làn V bị kiểm hoá cũ và h1 không đọc thành rỗng; người veto bằng một chữ (kể cả trên hồ sơ máy-đã-thông); máy tự ghi ô kết `machine-cleared`.

**Architecture:** Mọi phép đo mới là chân của `_acceptance/duong-lui-phai-song/rang.sh` chạy trên fixture code-sinh (kho git tạm dựng bằng `fixture.mjs` cùng thư mục), có đối chứng dương + chiều đỏ ghim thông điệp; vá `scripts/pre-merge-check.sh` chỉ THÊM dòng (DV5), hai dòng gỡ khai đích danh; lời dặn (lệnh ký, skill) đặt trong khối marker một-nguồn để răng rút-lệnh-từ-khối.

**Tech Stack:** bash (răng + lưới), Node ≥22 ESM/CJS (lib, script), git tạm, bốn suite thường trực của kit.

**Spec:** `docs/superpowers/specs/2026-09-08-duong-lui-phai-song-design.md` · hợp đồng `_acceptance/duong-lui-phai-song/contract.md` (12 AC) · `evals.yaml` (E1–E12d).

## Global Constraints

- `scripts/pre-merge-check.sh` và `scripts/recheck-evidence.cjs` chỉ được THÊM dòng so với `origin/main` (răng DV5 `tests/scripts/additive-only.test.mjs`); mọi dòng gỡ phải nằm nguyên văn trong `ALLOWED_REMOVALS`.
- Mỗi phép đo mới: cặp hai chiều trên CÙNG fixture code-sinh, thông điệp ghim (MEASURE-BIRTH-CLAUSE).
- Không thêm lệnh cổng người (ADR 0002). Không đổi sáu điều kiện xanh-sạch.
- Mọi đường dẫn trong răng suy từ vị trí script (`HERE`, `KIT`), không hardcode.
- Từ ngữ mặt người theo `CONTEXT.md` (tránh từ trong `_Avoid_`); commit `git add` đích danh; KHÔNG dùng token bắt đầu `-n` (`grep -n`, `-ne`) trong cùng lệnh bash với `git commit` (hook chặn).
- Kho tự host: script làn gọi kèm `--ag-root <repo>`; suite cho fixture là `feature_loop.suite_keys` của fixture, không phải của kit.
- Thứ tự thi công: Task 1 (e) → 2 (c) → 3 (d)(d′) → 4 (a) → 5 (b) → 6 (khoá config + E11 + status). Đường cắt: nếu S4 chạm trần ba vòng, gỡ Task 4–5 (AC-6..9) theo Out of scope.

---

### Task 0: Fixture chung `fixture.mjs` (kho git tạm code-sinh)

**Files:**
- Create: `_acceptance/duong-lui-phai-song/fixture.mjs`
- Create: `_acceptance/duong-lui-phai-song/rang.sh` (khung + hàm dùng chung; chân thêm ở các task sau)

**Interfaces:**
- Produces: `mkRepo(opts) → { root, dir, git(args...) }` — dựng kho git tạm có: bản chép vendored `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`, `lib/*.cjs` từ `KIT` (hoặc từ một thư mục base truyền vào `opts.vendorFrom`), `_acceptance/config.yaml` (`enforcement: strict`, `recheck: <opts.recheck || 'strict'>`, `risk_tiers.t1_skip_globs: [docs/**, PRODUCT-MAP.md]`, `executors.script.rang_e1: bash ./verify.sh`, `feature_loop.suite_keys: [executors.script.rang_e1]`), một hồ sơ `_acceptance/<slug>/` gồm `contract.md` (frontmatter theo `opts.contract`: status, risk_tier, approved_by, veto_state, veto_opened_at), `evals.yaml` (một eval `E1` script `config:executors.script.rang_e1`), `evidence-report.md` (verdict PASS, `verified_commit` theo `opts.vc` hoặc `'HEAD'` sau commit đầu, `human_signoff` theo `opts.signoff`, hai mục `## Known limits` / `## Ngoài hợp đồng` rỗng hoặc theo `opts.sections`), `run-log.jsonl` một dòng eval E1 + (tuỳ chọn) dòng repin có `evals_exit`; commit đầu `A`; trả `git()` để thêm commit.
- `evidenceText({ verdict, vc, signoff, sections })` — sinh báo cáo; `sections` là chuỗi thay cho hai mục (dùng cho ca h1).

- [ ] **Step 1: Viết `fixture.mjs`** (ESM, `node:fs`/`node:child_process`; mọi đường dẫn từ `import.meta.url`):

```js
// _acceptance/duong-lui-phai-song/fixture.mjs — kho git tạm code-sinh cho răng hồ sơ duong-lui-phai-song
import { mkdtempSync, mkdirSync, writeFileSync, cpSync, chmodSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const KIT = path.resolve(HERE, '..', '..');
export function evidenceText({ verdict = 'PASS', vc = '', signoff = '', sections = '## Known limits\n\n## Ngoài hợp đồng\n', runId = 'fx-E1-001' } = {}) {
  return `---\nschema_version: 2\nfeature_slug: fx\nverdict: ${verdict}\nfailed_evals: []\nverified_by: fixture\nenforcement_mode: strict\nbypass_used: false\nverified_commit: ${vc}\nhuman_signoff: ${signoff}\n---\n\n# Evidence Report: fx\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| E1 | AC-1 | script | PASS |\n\n## Evidence\n\n- eval: E1\n  run_id: ${runId}\n  exit_code: 0\n  baseline: n-a\n  verifier: config:executors.script.rang_e1\n  verified_at: 2026-09-08T00:00:00Z\n  output: |\n    ok\n\n${sections}`;
}
export function mkRepo(opts = {}) {
  const slug = opts.slug || 'fx';
  const root = mkdtempSync(path.join(tmpdir(), 'dlps-'));
  const git = (...a) => execFileSync('git', ['-C', root, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const from = opts.vendorFrom || KIT;
  for (const rel of ['scripts/pre-merge-check.sh', 'scripts/recheck-evidence.cjs']) { mkdirSync(path.join(root, 'scripts'), { recursive: true }); cpSync(path.join(from, rel), path.join(root, rel)); }
  mkdirSync(path.join(root, 'lib'), { recursive: true });
  for (const f of ['evidence-core.cjs', 'gap-probe.cjs', 'workspace-record.cjs', 'ac-line.cjs', 'md-section.cjs', 'eval-yaml.cjs']) cpSync(path.join(from, 'lib', f), path.join(root, 'lib', f));
  mkdirSync(path.join(root, 'docs'), { recursive: true }); writeFileSync(path.join(root, 'docs', 'README.md'), 'docs\n');
  writeFileSync(path.join(root, 'verify.sh'), '#!/bin/sh\nexit 0\n'); chmodSync(path.join(root, 'verify.sh'), 0o755);
  writeFileSync(path.join(root, 'src.txt'), 'v1\n');
  mkdirSync(path.join(root, '_acceptance', slug), { recursive: true });
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'),
`schema_version: 1\nenforcement: strict\nrecheck: ${opts.recheck || 'strict'}\ngap_probe: advisory\nexecutors:\n  script:\n    rang_e1: bash ./verify.sh\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "PRODUCT-MAP.md"\n  t3_paths:\n    - "lib/**"\nsignoff:\n  required_for: [T2, T3]\n  approvers: ["t"]\nfeature_loop:\n  suite_keys:\n    - executors.script.rang_e1\n`);
  const c = Object.assign({ status: 'verified', risk_tier: 'T2', approved_by: '', veto_state: 'mo', veto_opened_at: '2026-09-01T00:00:00Z' }, opts.contract || {});
  const fm = ['---', 'schema_version: 1', `feature: fx ${slug}`, `slug: ${slug}`, `risk_tier: ${c.risk_tier}`, 'surfaces: [cli]', `status: ${c.status}`, `approved_by: ${c.approved_by}`, 'approved_at:'];
  if (c.veto_state) { fm.push(`veto_state: ${c.veto_state}`); fm.push(`veto_opened_at: ${c.veto_opened_at}`); }
  fm.push('---', '', `# Acceptance Contract: ${slug}`, '', '## Criteria', '', '- AC-1: Given x, When y, Then z.', '', '## Out of scope', '', '- none', '- none', '');
  writeFileSync(path.join(root, '_acceptance', slug, 'contract.md'), fm.join('\n'));
  writeFileSync(path.join(root, '_acceptance', slug, 'evals.yaml'), `schema_version: 1\nslug: ${slug}\n\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: config:executors.script.rang_e1\n    expected: ok\n`);
  writeFileSync(path.join(root, '_acceptance', slug, 'decisions.jsonl'), '');
  git('init', '-q'); git('add', '-A'); git('commit', '-q', '-m', 'A: fixture'); const A = git('rev-parse', 'HEAD');
  const vc = opts.vc === undefined ? A : opts.vc;
  writeFileSync(path.join(root, '_acceptance', slug, 'evidence-report.md'), evidenceText({ vc, signoff: opts.signoff || '', sections: opts.sections }));
  const lines = [JSON.stringify({ ts: '2026-09-08T00:00:00Z', round: 1, evalId: 'E1', run_id: 'fx-E1-001', exit_code: 0, cmd: 'bash ./verify.sh' })];
  if (opts.repinLine) lines.push(JSON.stringify({ ts: '2026-09-08T00:00:01Z', kind: 'repin', run_id: 'repin-fx-1', sha: vc, suites_exit: [0], evals_exit: { E1: 0 } }));
  writeFileSync(path.join(root, '_acceptance', slug, 'run-log.jsonl'), lines.join('\n') + '\n');
  if (opts.commitEvidence !== false) { git('add', '-A'); git('commit', '-q', '-m', 'B: evidence'); }
  return { root, slug, dir: path.join(root, '_acceptance', slug), git, A };
}
// CLI: node fixture.mjs '<json opts>' → in root (để bash dùng)
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = mkRepo(JSON.parse(process.argv[2] || '{}')); process.stdout.write(r.root + '\n' + r.A + '\n');
}
```

- [ ] **Step 2: Viết khung `rang.sh`** (mẫu `_acceptance/inputs-tinh-tu-goc-kho/rang.sh`): `set -uo pipefail`, `HERE`, `KIT`, `ok/bad/done_chan`, `TMP` + trap, parse `--chan`, hàm `mk_repo '<json>'` gọi `node "$HERE/fixture.mjs"` và đặt `FX_ROOT`, `FX_A`; hàm `pmc <root> [args]` chạy `bash "$root/scripts/pre-merge-check.sh" "$root" "$@"` gom stdout+stderr vào `$OUT` và mã thoát `$RC`; hàm `copy_tree` (rsync `scripts lib` của KIT sang `$TMP/copy-*`) và `inject <file> <before> <after>` (python thay nguyên văn, đếm đúng 1, `bash -n`/`node --check`). Cuối file: `case "$CHAN" in ... esac; done_chan`.

- [ ] **Step 3: Chân đối chứng khung `fixture-song`**: `mk_repo '{}'`; `pmc "$FX_ROOT" --base "$FX_A"` → phải chứa `NOTE [fx]: xanh-sạch` và không có `VIOLATION`; ghim `ok "fixture xanh-sạch chạy được"`; chiều đỏ: `mk_repo '{"sections":"## Known limits\n- có\n\n## Ngoài hợp đồng\n"}'` → `VIOLATION [fx]: verdict PASS but human_signoff is empty`. Chạy `bash _acceptance/duong-lui-phai-song/rang.sh --chan fixture-song` → 2 pass.

- [ ] **Step 4: Commit** — `git add _acceptance/duong-lui-phai-song/fixture.mjs _acceptance/duong-lui-phai-song/rang.sh && git commit -m "feat(dlps): fixture kho git tạm code-sinh + khung răng hồ sơ"`.

---

### Task 1: (e) Lệnh ký — làn máy trước chữ ký, ghim lại cùng lượt (AC-4, AC-5, AC-10 · E4, E5, E10)

**Files:**
- Modify: `commands/signoff.md` (bước 7 → 7a/7b/7c, bước 8 mở rộng, khối `SIGNOFF-LANE-CLAUSE`)
- Modify: `skills/acceptance/SKILL.md` (chép khối, ngay sau bản chép `SIGNATURE-OWNER-CLAUSE`)
- Modify: `_acceptance/duong-lui-phai-song/rang.sh` (chân `ky-lan-clause`, `ky-lan-song`, `ky-stale`)

**Interfaces:**
- Produces: khối marker `<!-- <<<SIGNOFF-LANE-CLAUSE -->` … `<!-- SIGNOFF-LANE-CLAUSE>>> -->` chứa ĐÚNG hai dòng lệnh trong fence (răng rút bằng regex `^node .*repin-lane\.mjs.*$`): dòng 7b `node "<feature-loop>/scripts/repin-lane.mjs" --root . --slug <slug> --allow-dirty` và dòng 8b `node "<feature-loop>/scripts/repin-lane.mjs" --root . --slug <slug> --reason "hoá cũ do chính commit chữ ký" --write`.

- [ ] **Step 1: Viết chân `ky-lan-clause` (E10) — đỏ trước**: rút khối từ hai file bằng `sed -n '/<<<SIGNOFF-LANE-CLAUSE/,/SIGNOFF-LANE-CLAUSE>>>/p'`, `diff` hai bản → `ok "hai bản chép bằng nhau"`; mutant: bản sao `skills/acceptance/SKILL.md` đổi một ký tự trong khối → răng chạy trên bản sao phải `bad "lech ban chep: skills/acceptance/SKILL.md"`. Chạy: `bash rang.sh --chan ky-lan-clause` → đỏ «thiếu khối».
- [ ] **Step 2: Sửa `commands/signoff.md` bước 7 và 8.** Thay đoạn từ `7. **Ghi và commit — một lượt.` tới trước `8. **Re-check merge readiness.**` bằng:

```markdown
7. **Ghi, chạy làn, rồi commit — một lượt, THỨ TỰ CÓ RĂNG.**
   - **7a — ghi trường người.** Hồ sơ đang `machine-cleared` thì ghi contract
     `status: signed-off` TRƯỚC rồi mới ghi `evidence-report.md` (hai sự thật
     không được cãi nhau — cổng ghi chặn đúng lượt đó); hồ sơ
     `verified`/`implemented` thứ tự nào cũng qua. Ghi `human_signoff`,
     `human_override`, verdict upgrade, `bypass_ack` + contract `status:
     signed-off`, và `PRODUCT-MAP.md` ONLY if step 6 regenerated it.
   - **7b — làn máy TRƯỚC chữ ký, KHÔNG ghi.** Chữ ký không được vào lịch sử
     trên một cây đỏ. Chạy làn của chính hồ sơ trên cây làm việc:

     <!-- <<<SIGNOFF-LANE-CLAUSE -->
     ```bash
     node "<feature-loop>/scripts/repin-lane.mjs" --root . --slug <slug> --allow-dirty
     ```
     Làn đỏ (exit ≠ 0) → KHÔNG commit, in nguyên văn dòng đỏ, dừng lệnh; người
     sửa vật rồi gọi lại. Làn xanh → 7c. Sau commit chữ ký, lưới trước-merge
     báo `evidence is stale` cho CHÍNH slug (commit chữ ký chạm file ngoài T1)
     → ghim lại cùng lượt rồi lưới lại, TRƯỚC khi báo READY:
     ```bash
     node "<feature-loop>/scripts/repin-lane.mjs" --root . --slug <slug> --reason "hoá cũ do chính commit chữ ký" --write
     ```
     <!-- SIGNOFF-LANE-CLAUSE>>> -->

     `<feature-loop>` = gốc gói feature-loop giải qua `resolve-plugin.mjs`
     (kho tự host kit thêm `--ag-root .`); vắng gói → chạy từng eval
     `test`/`script` của `evals.yaml` + suite trong `feature_loop.suite_keys`,
     cùng luật đỏ. `--allow-dirty` không kèm `--write`: chỉ ĐO, không ghim.
   - **7c — commit chữ ký cùng mọi file làn đòi**, MỘT lượt:

     ```bash
     git add _acceptance/<slug>/evidence-report.md _acceptance/<slug>/contract.md
     git commit -m "Gate 2 signoff: <slug> — <name>"
     ```
     Repo opted in (step 6) → append ` PRODUCT-MAP.md`; kho có bản ghi mốc mà
     làn 7b đòi (vd bản ghi định tuyến của kho kit) → thêm file đó vào cùng
     `git add`.

   Câu dưới đây là bản gốc DUY NHẤT của điều khoản ai-sở-hữu-chữ-ký.
   `skills/acceptance/SKILL.md` chép nguyên văn, không tự diễn đạt.

   <!-- <<<SIGNATURE-OWNER-CLAUSE -->
   (giữ nguyên văn khối hiện có)
   <!-- SIGNATURE-OWNER-CLAUSE>>> -->
8. **Re-check merge readiness — và ghim lại nếu chính chữ ký làm hoá cũ.**
   Run `bash scripts/pre-merge-check.sh . --slug <slug>` (add `--base
   origin/<default-branch>` when known); otherwise the installed plugin's copy.
   Where write-time hooks are not active, also run `recheck-evidence.cjs`.
   Kết quả có `VIOLATION [<slug>]: evidence is stale` → chạy dòng lệnh ghim lại
   trong khối `SIGNOFF-LANE-CLAUSE` (`--write`), commit
   `repin(<slug>): ghim lại sau chữ ký`, rồi chạy lại pre-merge. Report READY
   TO MERGE CHỈ khi 0 violation; còn violation khác → in nguyên văn.
```

  Giữ nguyên bước 9 và khối Never. Chép khối `SIGNOFF-LANE-CLAUSE` (từ marker mở tới marker đóng, nguyên văn kể cả thụt lề) vào `skills/acceptance/SKILL.md` ngay sau bản chép `SIGNATURE-OWNER-CLAUSE` ở đó, kèm một câu dẫn «Bản chép nguyên văn khối làn-trước-chữ-ký của `commands/signoff.md`».
- [ ] **Step 3: Chạy `--chan ky-lan-clause`** → xanh + mutant đỏ đúng tên.
- [ ] **Step 4: Chân `ky-lan-song` (E4)**: `mk_repo '{"contract":{"status":"verified"}}'`; rút dòng 7b từ khối trong `commands/signoff.md` (regex `--allow-dirty` không chứa `--write` — assert cả hai chuỗi, ghim `bad "lenh trong clause lech"` nếu sai); thay `<feature-loop>` → `$KIT/feature-loop`, `<slug>` → `fx`, thêm `--ag-root "$KIT"`; sửa `human_signoff: t 2026-09-08` vào báo cáo fixture (không commit); chạy lệnh trong `$FX_ROOT` → exit 0 → giả lập 7c: `git add -A; git commit -m "Gate 2 signoff: fx — t"` → `git log --oneline | grep -c "Gate 2 signoff"` = 1 → `ok`. Chiều đỏ trên cùng fixture: `mk_repo` mới, ghi `verify.sh` = `exit 1`, chạy lại lệnh rút ra → exit ≠ 0 và stderr chứa `LÀN ĐỎ` → KHÔNG chạy commit → `git log` không có «Gate 2 signoff» → `ok "làn đỏ → không commit chữ ký"`. Mutant clause: bản sao `commands/signoff.md` đổi `--allow-dirty` thành `--allow-dirty --write` → bước rút lệnh phải `bad "lenh trong clause lech"`.
- [ ] **Step 5: Chân `ky-stale` (E5)**: `mk_repo '{"contract":{"status":"verified"},"repinLine":true}'`; commit chữ ký giả lập kèm sửa `src.txt` (file ngoài T1) → `pmc --base "$FX_A"` phải chứa `VIOLATION [fx]: evidence is stale`; rút dòng 8b (`--write`) từ khối, thay placeholder, chạy → exit 0, `run-log.jsonl` có dòng `"kind":"repin"` thứ hai với `evals_exit`, `verified_commit` == `git rev-parse HEAD` lúc chạy; commit; `pmc --base "$FX_A"` → 0 VIOLATION → `ok`. Chiều đỏ: bỏ bước ghim lại → pre-merge vẫn `evidence is stale`.
- [ ] **Step 6: Commit** — `git add commands/signoff.md skills/acceptance/SKILL.md _acceptance/duong-lui-phai-song/rang.sh && git commit -m "feat(signoff): làn máy chạy TRƯỚC chữ ký, ghim lại cùng lượt khi chính chữ ký làm hoá cũ — khối SIGNOFF-LANE-CLAUSE một nguồn (AC-4, AC-5, AC-10)"`.

---

### Task 2: (c) Chế độ nghiêm — soi lại không chạy được là VIOLATION (AC-1 · E1)

**Files:**
- Modify: `scripts/pre-merge-check.sh:1207-1231` (chỉ THÊM dòng)
- Modify: `_acceptance/duong-lui-phai-song/rang.sh` (chân `recheck-vang`)

- [ ] **Step 1: Chân `recheck-vang` đỏ trước**: `mk_repo '{"signoff":"t 2026-09-08","contract":{"status":"signed-off","approved_by":"t","veto_state":""}}'` (hồ sơ có chữ ký để đi tới khối recheck; `vc` = A) rồi ba mũi tiêm trên `$FX_ROOT`: (1) `rm scripts/recheck-evidence.cjs`; (2) `PATH=/usr/bin:/bin` không có node — dùng `env PATH="$TMP/nonode" bash …` với `$TMP/nonode` chỉ chứa symlink `bash`, `git`, `sed`, `awk`, `grep`, `sort`, `head`, `tr`, `cut`, `wc`, `dirname`, `basename`, `mktemp`, `date`, `cat`, `printf`, `find`, `xargs`, `uniq`, `comm`, `diff`, `md5`, `python3` nếu lưới cần (đọc `command -v` trong lưới để liệt đủ; thiếu lệnh nào lưới chết sớm thì thêm) — KHÔNG có `node`; (3) `rm lib/evidence-core.cjs` (recheck exit 2). Mỗi mũi: `pmc --base "$FX_A"` → ghim `VIOLATION [fx]: evidence re-check KHÔNG CHẠY ĐƯỢC (` + tên đường (`recheck-evidence.cjs vắng` · `node vắng` · `exit 2`) và `violations` tăng 1 so với đối chứng dương (đếm dòng `VIOLATION`). Cùng ba mũi với `mk_repo '{"recheck":"warn",…}'` → chỉ `NOTE`, 0 VIOLATION. Đối chứng dương: fixture nguyên → 0 VIOLATION. Chiều đỏ của phép đo: `copy_tree` + inject gỡ dòng mới `if [ "$RECHECK_MODE" = strict ]; then echo "VIOLATION [$slug]: evidence re-check KHÔNG CHẠY ĐƯỢC` (đúng một chuỗi nguyên văn) → chạy lại mũi (1) bằng bản sao (`vendorFrom` = `$COPY`) → phải hết VIOLATION → răng in `bad "strict van NOTE"` khi đó là chiều đỏ đã chạy → đánh dấu `ok`.
- [ ] **Step 2: Vá `pre-merge-check.sh`** — THÊM trước dòng `echo "NOTE [$slug]: evidence re-check unavailable (exit $rc) — ${recheck_out:-skipped}"`:

```bash
      if [ "$RECHECK_MODE" = strict ]; then echo "VIOLATION [$slug]: evidence re-check KHÔNG CHẠY ĐƯỢC (exit $rc) — recheck: strict coi cổng câm là cổng hỏng; sửa: vendor lib/ cạnh scripts/, đọc được evidence-report.md"; violations=$((violations+1)); continue; fi
```

  và THÊM trước dòng `echo "NOTE [$slug]: evidence re-check not vendored (recheck-evidence.cjs/node missing) — committed-evidence bar NOT enforced"`:

```bash
      if [ "$RECHECK_MODE" = strict ]; then
        if [ ! -f "$RECHECK" ]; then rc_duong="recheck-evidence.cjs vắng"; else rc_duong="node vắng"; fi
        echo "VIOLATION [$slug]: evidence re-check KHÔNG CHẠY ĐƯỢC ($rc_duong) — recheck: strict coi cổng câm là cổng hỏng; vendor scripts/recheck-evidence.cjs + lib/ và cài node"; violations=$((violations+1)); continue
      fi
```

  Không sửa/gỡ dòng nào khác. Chạy `node tests/scripts/additive-only.test.mjs` → xanh.
- [ ] **Step 3: Chạy `--chan recheck-vang`** → xanh (3 strict VIOLATION · 3 warn NOTE · đối chứng · chiều đỏ).
- [ ] **Step 4: Commit** — `git add scripts/pre-merge-check.sh _acceptance/duong-lui-phai-song/rang.sh && git commit -m "feat(pre-merge): recheck strict — soi lại KHÔNG CHẠY ĐƯỢC là VIOLATION gọi tên đường (AC-1)"`.

---

### Task 3: (d)(d′) Làn V bị kiểm hoá cũ; h1 về ranh `#{2,6}` (AC-2, AC-3 · E2, E3)

**Files:**
- Modify: `scripts/pre-merge-check.sh:328-382` (hai dòng ranh) và `:950-956` (khối mới trước `continue`)
- Modify: `tests/scripts/additive-only.test.mjs` (`ALLOWED_REMOVALS` + 2 dòng)
- Modify: `tests/plugins/lan-v.test.mjs` (LV2 bỏ chú thích loại trừ; LV5 `MAT_CAT` thêm `['V-kl-h1-co', { ...V_SACH, sach: 'kl-h1-co' }]`, `SO_MAT_CAT` +1)
- Modify: `_acceptance/duong-lui-phai-song/rang.sh` (chân `lan-v-stale`, `h1-rong`)

- [ ] **Step 1: Chân `lan-v-stale` đỏ trước (5 ô)**: (1) `mk_repo '{}'` rồi `git()` commit C đổi `src.txt` (đưa hồ sơ vào diff: đổi `_acceptance/fx/decisions.jsonl` thêm một dòng trong cùng commit) → `pmc --base "$FX_A"` ghim `VIOLATION [fx]: làn V — evidence is stale (code changed after verify, verified_commit ` + A; (2) commit C chỉ đổi `docs/README.md` + decisions → `NOTE [fx]: xanh-sạch`, 0 VIOLATION; (3) `mk_repo '{"vc":"b3b3…(40 hex không tồn tại)"}'` + commit đổi decisions → ghim `VIOLATION [fx]: verified_commit` … `does not exist in this repo — the pin is a phantom` (dùng đúng chuỗi của luật P184 để cùng họ); (4) `mk_repo '{"vc":""}'` + commit đổi decisions → `NOTE [fx]: report has no verified_commit`, KHÔNG có `xanh-sạch`; (5) `mk_repo '{}'` + commit đổi `src.txt` KHÔNG đụng `_acceptance/fx` → không dòng nào mang `[fx]` về stale. Số assert = 5. Chiều đỏ: `copy_tree` + inject gỡ dòng `# DLPS-LAN-V-STALE` (dòng đánh dấu khối mới) … thực chất gỡ cả khối bằng cách inject dòng `if [ "$DIFF_READY" -eq 1 ] && slug_in_diff "$slug"; then # DLPS-LAN-V-STALE` → `if false; then # DLPS-LAN-V-STALE` → ô (1) thành NOTE xanh-sạch → răng đánh `ok "chiều đỏ chạy"`.
- [ ] **Step 2: Vá khối xanh-sạch** — THÊM ngay trước dòng `echo "NOTE [$slug]: xanh-sạch — máy đi tiếp, KHÔNG mời ký …"` (bên trong `if [ "$clean_ok" -eq 1 ]; then`):

```bash
      # DLPS-LAN-V-STALE (duong-lui-phai-song AC-2): làn V KHÔNG được thoát phép kiểm
      # bằng-chứng-cũ chỉ vì không có chữ ký — cùng luật với hồ sơ có chữ ký ở khối dưới.
      if [ "$DIFF_READY" -eq 1 ] && slug_in_diff "$slug"; then # DLPS-LAN-V-STALE
        vc_v="$(front_field "$report" verified_commit)"
        if [ -z "$vc_v" ]; then
          echo "NOTE [$slug]: report has no verified_commit (older template) — làn V không xanh-sạch khi chưa ghim; re-verify to pin."
          continue
        elif ! git -C "$ROOT" cat-file -e "$vc_v^{commit}" 2>/dev/null; then
          if [ "$(git -C "$ROOT" rev-parse --is-shallow-repository 2>/dev/null)" = "true" ]; then
            echo "NOTE [$slug]: verified_commit $vc_v not found in this SHALLOW clone (fetch-depth) — staleness unverifiable here; a full clone decides"
          else
            echo "VIOLATION [$slug]: verified_commit $vc_v does not exist in this repo — the pin is a phantom, so staleness is NOT machine-checked (làn V). Re-pin to a commit that lives on the target branch."
            violations=$((violations+1)); continue
          fi
        else
          stale_v="$(stale_files "$ROOT" "$vc_v" | head -20)"
          if [ -n "$stale_v" ]; then
            echo "VIOLATION [$slug]: làn V — evidence is stale (code changed after verify, verified_commit $vc_v): $(printf '%s\n' "$stale_v" | wc -l | tr -d ' ') file — re-run verify or re-pin before merge"
            printf '%s\n' "$stale_v" | sed 's/^/    /'
            violations=$((violations+1)); continue
          fi
        fi
      fi
```

  (Đọc lại tên hàm `front_field`/`stale_files` và cách khối 1042–1075 kiểm shallow để chép đúng câu; giữ thông điệp pin-ma cùng họ P184.) Chạy `node tests/scripts/additive-only.test.mjs` → xanh (thuần thêm).
- [ ] **Step 3: (d′) hai dòng ranh** trong `xanh_sach_check`: đổi `#{1,6}` → `#{2,6}` ở dòng kiểm có mặt (`.test(l)`) và dòng cắt (`.replace(...)`). Thêm HAI dòng cũ nguyên văn vào `ALLOWED_REMOVALS` của `tests/scripts/additive-only.test.mjs` kèm chú thích «duong-lui-phai-song AC-3: ranh tiêu đề về #{2,6} cùng section()». Chạy DV5 → xanh.
- [ ] **Step 4: Chân `h1-rong` (E3)**: `mk_repo '{"sections":"# Known limits\n- có nội dung\n\n## Ngoài hợp đồng\n"}'` → `pmc --base "$FX_A"` ghim `NOTE [fx]: không đủ điều kiện xanh-sạch để đi tiếp không ký — mục «Known limits» VẮNG khỏi báo cáo (vắng ≠ rỗng)` (đọc `CLEAN_WHY` cho mã `__VANG__` để chép đúng câu bash in) và `node -e "import('./scripts/khong-can-nguoi.mjs')…"` gọi `xanhSach(contract, evidence).why` → chuỗi bằng nhau từng ký tự → `ok`. Chiều đỏ: bản sao bash đưa `#{1,6}` trở lại ở hai dòng → bash cho xanh-sạch (NOTE «xanh-sạch») trong khi mjs `vang` → `bad "bash sach-gia tren h1"` → đánh `ok "chiều đỏ chạy"`. Rồi LV5: bỏ chú thích loại trừ ở LV2 (dòng `// kl-h1-co: … KHÔNG đưa vào LV5`), thêm hàng `['V-kl-h1-co', { ...V_SACH, sach: 'kl-h1-co' }]` vào `MAT_CAT`, tăng `SO_MAT_CAT`; chạy `LV_CASES=LV5 node tests/plugins/lan-v.test.mjs` → xanh.
- [ ] **Step 5: Chạy `--chan lan-v-stale`, `--chan h1-rong`, `bash tests/plugins/run-tests.sh` (RT1/RT2 phải còn xanh — nếu RT2 ghim NOTE xanh-sạch trên fixture rt2 thì fixture đó không stale, vẫn xanh)** → xanh.
- [ ] **Step 6: Commit** — `git add scripts/pre-merge-check.sh tests/scripts/additive-only.test.mjs tests/plugins/lan-v.test.mjs _acceptance/duong-lui-phai-song/rang.sh && git commit -m "feat(pre-merge): làn V bị kiểm hoá cũ + pin ma; ranh tiêu đề xanh-sạch về #{2,6} cùng section() (AC-2, AC-3)"`.

---

### Task 4: (a) Veto có tay nắm (AC-6, AC-7 · E6, E7)

**Files:**
- Modify: `lib/evidence-core.cjs` (`evaluateContractWrite`: `da-veto` đã ghi vết = Cổng-1-đã-ghi trên hồ sơ máy-đi-trước)
- Modify: `tests/hooks/run-tests.sh` (V07–V10 ma trận 4 ô)
- Modify: `skills/acceptance/references/human-facing-language.md` (SLOTS `g2 veto hay để yên`; GRAMMAR mục signoff thêm nhãn veto)
- Modify: `commands/signoff.md` (nhánh «veto: <lý do>»)
- Modify: `tests/plugins/fixtures/viec-cua-anh-scenarios.sh` (kịch bản `gate2-may-di-tiep`) và `tests/plugins/run-tests.sh` (P192 render thêm thẻ đó, truyền vào checker)
- Modify: `_acceptance/duong-lui-phai-song/rang.sh` (chân `veto-ghi`, `veto-slot`)

- [ ] **Step 1: Hook — ca đỏ trước (V07)**: thêm vào `tests/hooks/run-tests.sh` sau V06:

```bash
echo "V07 machine-cleared × làn V mo → da-veto (approved_by rỗng) -> allow (veto là Cổng-1-đã-ghi mạnh hơn mo)"
printf -- '---\nschema_version: 1\nrisk_tier: T2\nstatus: machine-cleared\napproved_by:\napproved_at:\nveto_state: mo\nveto_opened_at: 2026-08-14T10:00:00Z\n---\n' > "$V_DIR/contract.md"
payload Write "$V_DIR/contract.md" "$(v_contract T2 'veto_state: da-veto
veto_opened_at: 2026-08-14T10:00:00Z
' | sed 's/^status: approved$/status: machine-cleared/')" | node "$HOOK" >/dev/null; check V07 0 $?
echo "V08 verified × mo → da-veto -> allow"
payload Write "$V_DIR/contract.md" "$(v_contract T2 'veto_state: da-veto
veto_opened_at: 2026-08-14T10:00:00Z
' | sed 's/^status: approved$/status: verified/')" | node "$HOOK" >/dev/null; check V08 0 $?
echo "V09 machine-cleared × da-veto THIẾU veto_opened_at -> block (veto không vết vẫn là bỏ cổng lặng lẽ)"
payload Write "$V_DIR/contract.md" "$(v_contract T2 'veto_state: da-veto
' | sed 's/^status: approved$/status: machine-cleared/')" | node "$HOOK" >/dev/null 2>/dev/null; check V09 2 $?
echo "V10 T3 × da-veto trên machine-cleared -> block (T2-only giữ nguyên)"
payload Write "$V_DIR/contract.md" "$(v_contract T3 'veto_state: da-veto
veto_opened_at: 2026-08-14T10:00:00Z
' | sed 's/^status: approved$/status: machine-cleared/')" | node "$HOOK" >/dev/null 2>/dev/null; check V10 2 $?
```

  (Đọc hàm `payload` để chắc nó nhận nội dung file cũ từ đĩa; nếu hook đọc old payload từ đĩa, dòng `printf` đầu tạo trạng thái cũ `mo`.) Chạy `bash tests/hooks/run-tests.sh` → V07 ĐỎ (hiện tại block), V08 xanh, V09/V10 xanh.
- [ ] **Step 2: Vá `evaluateContractWrite`** — ngay sau khối tính `vOpen`, thêm:

```js
  // duong-lui-phai-song AC-6: «da-veto» có vết + T2 là một lối Cổng-1-ĐÃ-GHI — người đã
  // phát ngôn trên hồ sơ máy-đi-trước; chặn nó ở đây là giết đúng nút dừng của làn V.
  // Vết vẫn bắt buộc (V09), T2-only vẫn giữ (V10).
  let vetoRecorded = false;
  if (v.present && v.state === 'da-veto') {
    if (!v.stamped) failures.push(`veto_state: da-veto but veto_opened_at is ${v.openedAt ? `unreadable ("${v.openedAt}")` : 'missing'} — a veto without a timestamp is a silent gate skip. Set veto_opened_at: <ISO-8601>.`);
    else if (v.tier === 'T3') failures.push(`veto_state: da-veto on a T3 contract — the V lane (and its veto) is T2-only; T3 always needs approved_by.`);
    else vetoRecorded = true;
  }
```

  và đổi điều kiện `if (!approvedBy && !gate1Skipped && !vOpen) {` thành `if (!approvedBy && !gate1Skipped && !vOpen && !vetoRecorded) {`. Chạy suite hooks → V07–V10 xanh; chạy `bash tests/scripts/run-tests.sh` (ca `core-untouched` JR11 so `lib/**` với base RIÊNG của hồ sơ đó — đọc `RANGE_BASE` trong `tests/scripts/core-untouched.test.mjs`; nếu ca đỏ vì lib đổi, đọc Amendment 07/08 của nó: phạm vi neo vào commit của hồ sơ judge-required-evidence nên lib đổi hôm nay KHÔNG đỏ; nếu vẫn đỏ thì đó là finding thật, dừng và báo).
- [ ] **Step 3: SLOTS + GRAMMAR**: trong `GATE-ONESHOT-SLOTS` thêm dòng `g2 veto hay để yên` sau `g2 ký hay trả`; trong `GATE-ONESHOT-GRAMMAR`, mục `/acceptance-gate:signoff` thêm câu: «Hồ sơ máy-đi-trước (lời mời cổng in «veto hay để yên» thay «ký hay trả»): câu gộp là `veto: <lý do>` hoặc `để yên` — veto ghi `veto_state: da-veto` + entry sổ `type: veto` mang lý do nguyên văn + commit `Veto: <slug> — <tên>`, máy dừng ngay; «để yên» không ghi gì.» (một câu, không đổi câu nào khác — LM17/P191 canh cấu trúc khối).
- [ ] **Step 4: `commands/signoff.md` nhánh veto** — thêm sau danh sách nhãn của câu gộp (trước «Với `--repo <path>`»):

```markdown
- Hồ sơ MÁY-ĐI-TRƯỚC (`veto_state: mo`, không chữ ký; lời mời cổng in «veto hay
  để yên» thay «ký hay trả»): `veto: <lý do>` → ghi `veto_state: da-veto` vào
  contract bằng công cụ sửa file (lưới ghi-lúc-viết kiểm), append vào
  `decisions.jsonl` một dòng
  `{"id":"d-<UTC>-<rand>","type":"veto","stage":"gate2","at":"<ISO>","decision":"<lý do nguyên văn>","decided_by":"<tên>","decided_at":"<ISO>"}`,
  commit `Veto: <slug> — <tên>` (chỉ contract + decisions), in đúng một dòng
  «Đã veto. Máy dừng; hồ sơ chờ người xử: về `status: draft` để làm lại phạm
  vi, hoặc duyệt tay (`approved_by`)» và DỪNG — không menu, không tranh luận.
  `để yên` → không ghi gì, in «cửa veto vẫn mở». Danh tính suy theo cùng bậc
  thang ở trên.
```

- [ ] **Step 5: P192 fixture máy-đi-trước**: trong `viec-cua-anh-scenarios.sh` thêm kịch bản `gate2-may-di-tiep` (contract `status: verified`, `risk_tier: T2`, `approved_by:` rỗng, `veto_state: mo`, `veto_opened_at` hợp lệ; evidence PASS, hai mục rỗng, chữ ký rỗng) — chép hình dạng `gate2-4loai` rồi đổi frontmatter; trong `run-tests.sh` khối P192 thêm `P192WS3` render `card-g2v.html` và truyền vào checker (mở rộng danh sách cards). Chạy `ONLY_BLOCK=P192 bash tests/plugins/run-tests.sh` → xanh; xoá tạm dòng SLOTS → đỏ `nhan khong khop SLOTS: veto hay để yên` (mutant tay, không commit).
- [ ] **Step 6: Chân `veto-ghi` (E6, 4 ô + đối chứng base)**: với mỗi ô {verified, machine-cleared} × {approved_by 't', mo}: `mk_repo` (machine-cleared cần `veto_state: mo` hoặc approved_by để qua hook cũ khi tạo — fixture ghi thẳng file, không qua hook) rồi node: `const core=require('<root>/lib/evidence-core.cjs'); core.evaluateContractWrite(newTxt, oldTxt).failures.length` = 0 cho cả 4 (newTxt = contract với `veto_state: da-veto`); đối chứng: cùng 4 ô với lib từ `git archive origin/main lib` (`copy_tree` base) → ô machine-cleared×mo phải có failure chứa `Gate 1 approval not recorded` — đó là chiều đỏ của luật cũ. Sau ghi: append entry `{"type":"veto",…}`, `pmc --base "$FX_A"` ghim `VIOLATION [fx]: veto_state=da-veto chưa xử`; chiều đỏ thứ hai: đổi ngược `da-veto`→`mo` trong commit mới KHÔNG entry → `mà KHÔNG có entry sổ quyết định`; có entry → `NOTE [fx]: veto đã xử`.
- [ ] **Step 7: Chân `veto-slot` (E7)**: grep SLOTS có `g2 veto hay để yên`; grep GRAMMAR có `veto: <lý do>`; render thẻ từ kịch bản `gate2-may-di-tiep` bằng `node scripts/gate-card.js --root <ws> --slug fx --gate 2` → chứa `veto hay để yên: ___`; chạy `ONLY_BLOCK=P192 bash tests/plugins/run-tests.sh` exit 0; chiều đỏ: bản sao luật gỡ dòng SLOTS → chạy checker P192 trên bản sao (truyền file luật bản sao) → `nhan khong khop SLOTS: veto hay để yên`.
- [ ] **Step 8: Commit** — `git add lib/evidence-core.cjs tests/hooks/run-tests.sh skills/acceptance/references/human-facing-language.md commands/signoff.md tests/plugins/fixtures/viec-cua-anh-scenarios.sh tests/plugins/run-tests.sh _acceptance/duong-lui-phai-song/rang.sh && git commit -m "feat(veto): «veto: lý do» có tay nắm ở lệnh ký; lưới ghi nhận da-veto có vết là Cổng-1-đã-ghi trên hồ sơ máy-đi-trước (AC-6, AC-7)"`.

---

### Task 5: (b) Đường ghi ô kết `machine-cleared` (AC-8, AC-9 · E8, E9)

**Files:**
- Modify: `scripts/khong-can-nguoi.mjs` (CLI `--write|--check --root --slug`)
- Modify: `feature-loop/skills/feature-loop/SKILL.md:24-25` (hai hàng)
- Modify: `tests/workflows/skill-claims.test.mjs` (hai mệnh đề + mutant)
- Modify: `_acceptance/duong-lui-phai-song/rang.sh` (chân `ket-ghi`)

**Interfaces:**
- Produces: `node scripts/khong-can-nguoi.mjs --write --root <r> --slug <s>` → exit 0 + in `machine-cleared: <slug>` khi ghi; exit 2 + `chưa đủ: <why>` khi không; `--check` giống `--write` nhưng không ghi; exit 3 khi thiếu cờ/file.

- [ ] **Step 1: Chân `ket-ghi` đỏ trước (5 ô)**: (1) `mk_repo '{}'` → chạy `--write` → contract có `status: machine-cleared`, `diff` với bản trước = đúng một dòng `status:`; `--check` trên bản mới của `mk_repo '{}'` → không đổi byte (md5 trước/sau); (2) `sections` Known limits có nội dung → exit 2 `chưa đủ: mục «Known limits» có nội dung`, md5 không đổi; (3) evidence có `UNCERTAIN` (thay `PASS` ở bảng bằng `UNCERTAIN`) → exit 2; (4) `risk_tier: T3` (contract `approved_by: t`, không veto) → exit 2 `hạng T3`; (5) `status: draft` → exit 2 `status draft (chỉ verified)`. Chiều đỏ: bản sao script bỏ dòng gọi `evaluateContractWrite` → ô (4) ghi được → `bad "ghi machine-cleared cho T3"` → `ok "chiều đỏ chạy"`.
- [ ] **Step 2: Thêm CLI vào `khong-can-nguoi.mjs`** (cuối file, sau `khongCanNguoi`):

```js
// ── CLI: đường GHI ô kết (duong-lui-phai-song AC-8) ─────────────────────────
//   node khong-can-nguoi.mjs --write|--check --root <repo> --slug <slug>
// verified + T2 + khongCanNguoi() ≠ null → ghi đúng dòng status thành machine-cleared,
// tự kiểm bằng CHÍNH luật lưới ghi-lúc-viết (evaluateContractWrite) trước khi ghi đĩa.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const fs = await import('node:fs');
  const argv = process.argv.slice(2); const get = k => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
  const mode = argv.includes('--write') ? 'write' : argv.includes('--check') ? 'check' : null;
  const root = get('--root'), slug = get('--slug');
  if (!mode || !root || !slug) { console.error('khong-can-nguoi: dùng --write|--check --root <repo> --slug <slug>'); process.exit(3); }
  const { evaluateContractWrite } = require(path.join(__dirname, '..', 'lib', 'evidence-core.cjs'));
  const cp = path.join(root, '_acceptance', slug, 'contract.md'), ep = path.join(root, '_acceptance', slug, 'evidence-report.md');
  let contract, evidence; try { contract = fs.readFileSync(cp, 'utf8'); } catch { console.error(`khong-can-nguoi: không đọc được ${cp}`); process.exit(3); }
  try { evidence = fs.readFileSync(ep, 'utf8'); } catch { evidence = null; }
  const status = (frontmatterField(contract, 'status') || '').trim().toLowerCase();
  const tier = (frontmatterField(contract, 'risk_tier') || '').trim().toUpperCase();
  const why = status !== 'verified' ? `status ${status || '(rỗng)'} (chỉ verified)` : tier !== 'T2' ? `hạng ${tier} (chỉ T2)` : (khongCanNguoi(contract, evidence) == null ? (xanhSach(contract, evidence).why || 'còn cần người') : '');
  if (why) { console.error(`chưa đủ: ${why}`); process.exit(2); }
  const next = contract.replace(/^status:[ \t]*verified[ \t]*$/m, 'status: machine-cleared');
  if (next === contract) { console.error('chưa đủ: không tìm được dòng status: verified'); process.exit(2); }
  const r = evaluateContractWrite(next, contract);
  if (r.anyFailure) { console.error(`lưới ghi từ chối: ${r.failures.join(' | ')}`); process.exit(2); }
  if (mode === 'write') fs.writeFileSync(cp, next);
  console.log(`${mode === 'write' ? 'machine-cleared' : 'sẽ machine-cleared'}: ${slug}`);
}
```

  (`fileURLToPath` đã import; giữ `export` hiện có.) Chạy `--chan ket-ghi` → xanh.
- [ ] **Step 3: SKILL feature-loop hai hàng** — hàng `verified`: thay «→ commit phần máy viết, báo một dòng, đi tiếp S5 (KHÔNG mời ký)» bằng «→ chạy `node <acceptance-gate>/scripts/khong-can-nguoi.mjs --write --root . --slug <slug>` (exit 2 = còn cần người → Gate 2), vẽ lại bản đồ, commit phần máy viết (contract nay `machine-cleared`), báo một dòng, đi tiếp S5 (KHÔNG mời ký)». Hàng `machine-cleared`: gỡ đoạn `**ĐƯỜNG GHI CHƯA BẬT (giới hạn đã khai):** … xem _acceptance/lan-may-thong-duong-ghi/` thay bằng «Đường ghi: bước ở hàng `verified` (duong-lui-phai-song)».
- [ ] **Step 4: skill-claims** — thêm vào `CLAUSES` hai mệnh đề `[/khong-can-nguoi\.mjs --write/, 'DLPS: hàng verified gọi đường ghi ô kết']` và một assert âm `assert.doesNotMatch(SKILL, /ĐƯỜNG GHI CHƯA BẬT/)` trong một `check('DLPS: hàng machine-cleared không còn giới hạn đường ghi', …)`; mutant: thêm vào `mutated` việc xoá chuỗi `khong-can-nguoi.mjs --write` → detector đỏ. Chạy `bash tests/workflows/run-tests.sh` → xanh.
- [ ] **Step 5: Commit** — `git add scripts/khong-can-nguoi.mjs feature-loop/skills/feature-loop/SKILL.md tests/workflows/skill-claims.test.mjs _acceptance/duong-lui-phai-song/rang.sh && git commit -m "feat(lan-v): đường ghi ô kết machine-cleared — khong-can-nguoi.mjs --write tự kiểm cùng luật lưới ghi; SKILL gọi ở hàng verified (AC-8, AC-9)"`.

---

### Task 6: Khoá config, chân sử liệu, bốn suite, `implemented` (AC-11, AC-12 · E11, E12*)

**Files:**
- Modify: `_acceptance/config.yaml` (khoá `dlps_*` dưới `executors.script`)
- Modify: `_acceptance/duong-lui-phai-song/rang.sh` (chân `su-lieu`)
- Modify: `_acceptance/duong-lui-phai-song/contract.md` (`status: implemented`), `decisions.jsonl`

- [ ] **Step 1: Khoá config** — thêm khối (cùng nếp `itgk_*`):

```yaml
    # Răng hồ sơ duong-lui-phai-song — fixture kho git tạm code-sinh, cùng nếp không-vào-suite-vĩnh-viễn.
    dlps_recheck_vang: bash _acceptance/duong-lui-phai-song/rang.sh --chan recheck-vang
    dlps_lan_v_stale: bash _acceptance/duong-lui-phai-song/rang.sh --chan lan-v-stale
    dlps_h1_rong: bash _acceptance/duong-lui-phai-song/rang.sh --chan h1-rong
    dlps_ky_lan_song: bash _acceptance/duong-lui-phai-song/rang.sh --chan ky-lan-song
    dlps_ky_stale: bash _acceptance/duong-lui-phai-song/rang.sh --chan ky-stale
    dlps_veto_ghi: bash _acceptance/duong-lui-phai-song/rang.sh --chan veto-ghi
    dlps_veto_slot: bash _acceptance/duong-lui-phai-song/rang.sh --chan veto-slot
    dlps_ket_ghi: bash _acceptance/duong-lui-phai-song/rang.sh --chan ket-ghi
    dlps_ky_lan_clause: bash _acceptance/duong-lui-phai-song/rang.sh --chan ky-lan-clause
    dlps_su_lieu: bash _acceptance/duong-lui-phai-song/rang.sh --chan su-lieu
```

- [ ] **Step 2: Chân `su-lieu` (E11)**: `copy_tree` với `git -C "$KIT" archive origin/main scripts lib | tar -x -C "$TMP/base"`; chạy `bash "$KIT/scripts/pre-merge-check.sh" "$KIT" --base origin/main --recheck-all` và `bash "$TMP/base/scripts/pre-merge-check.sh" "$KIT" --base origin/main --recheck-all` (bản base đọc `lib` của chính nó qua `$(dirname $0)/..`), đếm dòng `VIOLATION` mỗi bên, in hai số; assert `n_va ≤ n_base`; assert số dòng `làn V — evidence is stale` + `re-check KHÔNG CHẠY ĐƯỢC` trên cây thật = 0 (kit recheck strict, soi lại chạy được, hồ sơ làn V ngoài diff). Đối chứng dương của phép đếm: `mk_repo` với ca stale → cùng lệnh đếm cho ≥1.
- [ ] **Step 3: Chạy bốn suite + bản đồ + mọi chân**: `bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh && bash tests/workflows/run-tests.sh && node scripts/product-map.mjs --root . --check` và `for c in fixture-song recheck-vang lan-v-stale h1-rong ky-lan-song ky-stale veto-ghi veto-slot ket-ghi ky-lan-clause su-lieu; do bash _acceptance/duong-lui-phai-song/rang.sh --chan $c || exit 1; done` → tất cả xanh. Đỏ ở đâu: sửa vật hoặc răng, KHÔNG nới thước.
- [ ] **Step 4: `status: implemented`** trong contract (công cụ sửa file — hook kiểm chuyển trạng thái `approved → implemented`), vẽ lại bản đồ, append entry sổ `type: fix, stage: S3` nếu S3 buộc đổi hướng so với kế hoạch (rule đáng-log).
- [ ] **Step 5: Commit** — `git add _acceptance/config.yaml _acceptance/duong-lui-phai-song/rang.sh _acceptance/duong-lui-phai-song/contract.md _acceptance/duong-lui-phai-song/decisions.jsonl PRODUCT-MAP.md && git commit -m "acceptance(duong-lui-phai-song): khoá dlps_* + chân sử liệu; hồ sơ sang implemented — arm S4"`.

---

## Tự soát (spec coverage)

| Mục spec | Task |
|---|---|
| (e) 7a/7b/7c + bước 8, khối SIGNOFF-LANE-CLAUSE, bản chép | 1 |
| (c) strict VIOLATION ba đường | 2 |
| (d) 5 ô làn V, (d′) hai dòng ranh + DV5 + LV5 | 3 |
| (a) SLOTS/GRAMMAR, signoff veto, lib nhận da-veto (P0), P192 fixture | 4 |
| (b) `--write`/`--check`, SKILL hai hàng, skill-claims | 5 |
| Khoá config, E11 sử liệu, bốn suite, implemented | 6 |
| Fixture code-sinh + khung răng (cross-cutting) | 0 |

Đường cắt (Out of scope): chạm trần ba vòng chấm → gỡ Task 4 và 5 khỏi cây (revert hai commit), gỡ AC-6..9 + E6..E9 + khoá `dlps_veto_*`, `dlps_ket_ghi`; ship phần còn lại với giới hạn có tên.
