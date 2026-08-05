# delta-verify-repin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-pin = 1 lượt machine-lane + N chữ ký cùng `run_id` (chống gian
lận bằng máy, 2 tầng) + carry P1 cho round fix sau REJECT — không nới một
luật bằng chứng nào.

**Architecture:** Khuôn dòng `kind:repin` + section `### Re-pin` đặt MỘT chỗ
giữa marker `REPIN-TEMPLATE` trong SKILL feature-loop (writer); hai lưới đọc
(pre-merge-check.sh + recheck-evidence.js) mỗi bên THÊM một khối luật mới
tự-chứa (không sửa dòng cũ nào — AC-5). Carry fix-round: `invokedSha` chảy
vào từng dòng run-log của acceptance-verify.js; script mới
`feature-loop/scripts/carry-plan.mjs` biến quy tắc P1 thành phép tính
máy-kiểm-được cho cả round delta lẫn round fix.

**Tech Stack:** Node ≥18 thuần (không dep mới), bash POSIX cho pre-merge,
harness test sẵn có (`tests/scripts/run-tests.sh` glob `*.test.mjs`,
`tests/workflows/`, `tests/hooks/`).

## Global Constraints

- **AC-5 / ngưỡng chết O1:** diff `scripts/pre-merge-check.sh` +
  `scripts/recheck-evidence.js` CHỈ THÊM — mọi khối mới là insertion
  tự-chứa; không sửa/xoá điều kiện, luật, thông điệp hiện có.
- **Grandfather (AC-4):** luật mới chỉ bắn khi section Re-pin cite
  `run_id:` khuôn mới; 141 section cũ (không có `run_id:`) không bị đụng.
- Mọi assertion âm tính: đối chứng dương + ghim ĐÚNG thông điệp
  (CLAUDE.md); fixture do code sinh trong chính lần chạy; đường dẫn suy từ
  vị trí script, không hardcode ROOT.
- Mọi bản vá RED-test chính nó trước khi tin (fix-tu-tao-lo-moi).
- `plugins/` là mirror: sửa nguồn xong PHẢI `scripts/sync-plugin-packages.sh`
  và commit cùng lượt (P30). Git add đích danh, không `-A`.
- Bump: feature-loop 1.21.0 → **1.22.0** (2 manifest nguồn + mirror + root
  marketplace nếu có pin) + re-pin literal trong `tests/plugins/run-tests.sh`.
- Khuôn dòng repin (chuẩn duy nhất, mọi task dùng đúng):
  `{"ts":"<ISO>","kind":"repin","run_id":"<id>","sha":"<40-hex>","suites_exit":[0,0,0,0]}`
- Khuôn section mới (trong REPIN-TEMPLATE):
  `### Re-pin lần <N> — <ngày>, do <lý do>` + dòng body
  `run_id: <id> · sha: <40-hex> · suites: <k> lệnh exit 0` (reader chỉ cần
  bắt `run_id:` trong body section Re-pin).

---

### Task 1: REPIN-TEMPLATE + nghi thức re-pin mới trong SKILL (E1, E10, E13 · phục vụ AC-1, AC-10, AC-13)

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (mục Staleness guard + thêm mục "Nghi thức re-pin")
- Test: `tests/workflows/skill-claims.test.mjs` (case DV1, DV10)

**Interfaces:**
- Produces: khối marker `<!-- <<<REPIN-TEMPLATE -->` … `<!-- REPIN-TEMPLATE>>> -->`
  trong SKILL.md chứa NGUYÊN VĂN khuôn dòng jsonl + khuôn section (Global
  Constraints) — Task 5 rút fixture từ đúng cặp marker này.
- `independent: false` (Task 5 round-trip đọc marker này)

- [ ] **Step 1: Viết case DV1/DV10 fail-first** vào `tests/workflows/skill-claims.test.mjs` theo khuôn CS7/CS8 sẵn có: assert SKILL chứa đủ mệnh đề — (a) "một sự kiện re-pin = dispatch 1 agent tươi"; (b) "append dòng `kind:repin`" + "run-log.jsonl CỦA TỪNG slug"; (c) "cite `run_id` nguyên văn" + "`verified_commit` == `sha`"; (d) "lane fail (suite exit ≠ 0) → KHÔNG append dòng repin, KHÔNG sửa evidence — khắc phục rồi chạy lane MỚI"; (e) cặp marker REPIN-TEMPLATE tồn tại và giữa chúng có `"kind":"repin"` và `suites_exit`; (f) DV10: mệnh đề carry minh bạch "round fix có carry → gói Cổng 2 ghi RÕ danh sách eval carried". Mutation counter: bản sao SKILL xoá từng mệnh đề → case tương ứng ĐỎ (một mutant một mệnh đề, đủ 6).
- [ ] **Step 2: Chạy để thấy ĐỎ**: `bash tests/workflows/run-tests.sh` — DV1/DV10 fail vì SKILL chưa có nghi thức.
- [ ] **Step 3: Sửa SKILL.md** — trong mục Staleness guard, THÊM đoạn "Nghi thức re-pin (1 lượt lane, N chữ ký)": khi một sự kiện làm N slug stale → dispatch 1 agent tươi chạy machine-lane (4 suite + sync --check) tại HEAD, lấy `run_id` mới + `sha=$(git rev-parse HEAD)` + mảng exit; **lane có bất kỳ exit ≠ 0 → DỪNG: KHÔNG append, KHÔNG sửa evidence, khắc phục rồi chạy lane MỚI (run_id mới)**; lane xanh → với TỪNG slug: append dòng theo REPIN-TEMPLATE vào run-log.jsonl, rồi evidence-report: `verified_commit` → sha + section `### Re-pin lần N` cite `run_id:` nguyên văn theo khuôn; cuối cùng ghi 1 dòng vào báo cáo user: "re-pin M slug bằng 1 lượt lane (run_id …)". Thêm cặp marker REPIN-TEMPLATE chứa khuôn dòng + khuôn section (nguyên văn từ Global Constraints). Trong mục "Mọi verdict"/gói Gate 2 THÊM mệnh đề DV10 carry-minh-bạch cho round fix.
- [ ] **Step 4: Chạy xanh** `bash tests/workflows/run-tests.sh`; chạy lại 6 mutant → đỏ đủ 6.
- [ ] **Step 5: Commit** `git add feature-loop/skills/feature-loop/SKILL.md tests/workflows/skill-claims.test.mjs && git commit -m "feat(delta-verify-repin): nghi thức re-pin 1-lane + REPIN-TEMPLATE trong SKILL (AC-1/10/13)"`

### Task 2: Luật repin trong recheck-evidence.js (E2 nửa recheck · phục vụ AC-2, AC-15, AC-4)

**Files:**
- Modify: `scripts/recheck-evidence.js` (chèn khối tự-chứa SAU dòng `if (!core.determineEnforce(payload)) process.exit(0);`, TRƯỚC mọi logic cũ còn lại — thuần insertion)
- Test: `tests/scripts/recheck-repin.test.mjs` (mới — case DV2 nửa recheck)

**Interfaces:**
- Produces: các thông điệp lỗi ĐÍCH DANH (dùng nguyên văn ở test + Task 3
  đối xứng):
  - `REPIN x run_id "<id>" cited in ### Re-pin but no {"kind":"repin"} line with that run_id in run-log.jsonl — the lane never logged this re-pin; re-run the lane, do not hand-mint run_ids`
  - `REPIN x repin line for run_id "<id>" has sha <sha> but report verified_commit is <vc> — signature and lane disagree; re-pin against the verified commit`
  - `REPIN x repin line for run_id "<id>" has nonzero suites_exit [<arr>] — a red lane cannot back a signature; fix the suites and run a NEW lane`
  - `REPIN x report cites repin run_id "<id>" but _acceptance/<slug>/run-log.jsonl does not exist — no lane was ever logged for this workspace`
- Consumes: khuôn section từ Task 1 (reader bắt `run_id:` trong body các section `### Re-pin`).
- `independent: false` (thông điệp phải khớp Task 3, fixture dùng chung Task 5)

- [ ] **Step 1: Viết `tests/scripts/recheck-repin.test.mjs` fail-first** — helper `mkRepinFixture(opts)` code-sinh workspace tạm (mktemp trong test, đường dẫn suy từ `import.meta.url`): contract + evidence-report PASS đầy đủ evidence bar (chép khuôn từ fixture RL-case sẵn có trong tests/scripts) + run-log.jsonl + section `### Re-pin lần 1 — …` có `run_id: repin-test-1 · sha: <sha> · suites: 4 lệnh exit 0`. 5 nhánh: (1) run-log không có dòng repin khớp id → exit 1 + đúng thông điệp 1; (2) dòng có nhưng `sha` ≠ verified_commit → thông điệp 2; (3) `suites_exit:[1,0,0,0]` → thông điệp 3; (4) xoá run-log.jsonl → thông điệp 4; (5) bộ khớp đủ + suites toàn 0 → exit 0 (đối chứng dương). Nhánh 6 (grandfather, phần recheck của E4): section Re-pin kiểu CŨ không có `run_id:` → exit 0.
- [ ] **Step 2: Chạy ĐỎ**: `bash tests/scripts/run-tests.sh` — 5 nhánh âm fail (recheck chưa biết repin).
- [ ] **Step 3: Chèn khối mới vào recheck-evidence.js** — sau early-exit determineEnforce, thuần THÊM:

```js
// ── Re-pin provenance (delta-verify-repin, additive rule) ─────────────────
// New-form "### Re-pin" sections cite a run_id; the lane that produced it
// must be logged per-slug. Old-form sections (no "run_id:") are grandfathered.
{
  const secRe = /^###\s+Re-pin\b[^\n]*\n([\s\S]*?)(?=\n#{1,3}\s|\n*$)/gm;
  const cited = [];
  let m;
  while ((m = secRe.exec(payload)) !== null) {
    const idm = m[1].match(/\brun_id\s*[:=]\s*([^\s·,]+)/i);
    if (idm) cited.push(idm[1]);
  }
  if (cited.length) {
    const dir = path.dirname(path.resolve(reportPath));
    const vcm = payload.match(/^verified_commit\s*:\s*(\S+)/m);
    const vc = vcm ? vcm[1] : '';
    const slug = path.basename(dir);
    const errs = [];
    const logPath = path.join(dir, 'run-log.jsonl');
    if (!fs.existsSync(logPath)) {
      for (const id of cited) errs.push(`REPIN x report cites repin run_id "${id}" but _acceptance/${slug}/run-log.jsonl does not exist — no lane was ever logged for this workspace`);
    } else {
      const lines = fs.readFileSync(logPath, 'utf8').split('\n');
      const repins = new Map();
      for (const l of lines) {
        try { const e = JSON.parse(l); if (e && e.kind === 'repin' && typeof e.run_id === 'string') repins.set(e.run_id, e); } catch (_) {}
      }
      for (const id of cited) {
        const e = repins.get(id);
        if (!e) { errs.push(`REPIN x run_id "${id}" cited in ### Re-pin but no {"kind":"repin"} line with that run_id in run-log.jsonl — the lane never logged this re-pin; re-run the lane, do not hand-mint run_ids`); continue; }
        if (vc && e.sha !== vc) { errs.push(`REPIN x repin line for run_id "${id}" has sha ${e.sha} but report verified_commit is ${vc} — signature and lane disagree; re-pin against the verified commit`); continue; }
        if (!Array.isArray(e.suites_exit) || e.suites_exit.some(x => x !== 0)) errs.push(`REPIN x repin line for run_id "${id}" has nonzero suites_exit ${JSON.stringify(e.suites_exit)} — a red lane cannot back a signature; fix the suites and run a NEW lane`);
      }
    }
    if (errs.length) {
      process.stderr.write(`recheck-evidence: ${reportPath} — re-pin provenance fails:\n` + errs.map(s => '  ' + s).join('\n') + '\n');
      process.exit(1);
    }
  }
}
```

- [ ] **Step 4: Chạy XANH** cả 6 nhánh; RED-test bản vá: mutate tạm fixture nhánh 5 (đổi 1 ký tự run_id) → phải đỏ; hoàn tác.
- [ ] **Step 5: Commit** `git add scripts/recheck-evidence.js tests/scripts/recheck-repin.test.mjs && git commit -m "feat(delta-verify-repin): luật repin T1 trong recheck-evidence — khối additive (AC-2/15)"`

### Task 3: Luật repin trong pre-merge-check.sh (E2 nửa pre-merge, E3, E4 · phục vụ AC-2, AC-3, AC-4, AC-15)

**Files:**
- Modify: `scripts/pre-merge-check.sh` (chèn khối repin SAU khối "run-log presence" ~dòng 771, thuần insertion)
- Test: `tests/scripts/premerge-repin.test.mjs` (mới — DV2 nửa pre-merge + DV3 fraud + DV4 grandfather)

**Interfaces:**
- Consumes: 4 thông điệp của Task 2, chuyển sang khuôn shell:
  `VIOLATION [$slug]: re-pin run_id "<id>" cited but ...` (cùng 4 ruột:
  no-line / sha-mismatch / nonzero-suites / log-missing).
- `independent: false` (đối xứng thông điệp với Task 2)

- [ ] **Step 1: Viết `tests/scripts/premerge-repin.test.mjs` fail-first** — tái dùng `mkRepinFixture` (export từ Task 2 test hoặc helper chung `tests/scripts/repin-fixture.mjs`): dựng repo git tạm code-sinh (git init + commit thật), chạy `pre-merge-check.sh --base <base>`: 5 nhánh DV2 (như Task 2, ghim khuôn `VIOLATION [<slug>]: re-pin`), DV3 fraud: sau khi ký repin hợp lệ, commit thêm 1 file code mới rồi chạy → luật stale HIỆN HÀNH bắn (`evidence is stale — code changed after verify`) — fixture sạch cùng harness xanh; DV4 grandfather: chạy pre-merge trên CHÍNH repo thật (cwd) → exit như trước thay đổi (so với baseline chạy trước khi vá — capture trong test bằng cách chạy bản pre-merge gốc từ `git show HEAD:scripts/pre-merge-check.sh` nếu khác, hoặc đơn giản: repo thật hiện hành phải clean/cùng-exit); mutant DV4: bản sao pre-merge sửa điều kiện `if grep -q 'run_id:'` thành luôn-đúng (retro-enforce) → chạy trên fixture có section Re-pin CŨ phải ĐỎ, chứng minh phép đo phân biệt được.
- [ ] **Step 2: Chạy ĐỎ** `bash tests/scripts/run-tests.sh`.
- [ ] **Step 3: Chèn khối shell additive** sau khối run-log presence:

```bash
  # Re-pin provenance (delta-verify-repin, additive): new-form "### Re-pin"
  # sections cite run_id — the lane must be logged per-slug, sha must match
  # verified_commit, and every suites_exit element must be 0. Old-form
  # sections (no "run_id:") are grandfathered — no rule applies to them.
  repin_ids="$(awk '/^### Re-pin/{s=1;next} /^#/{s=0} s && match($0,/run_id[:=][[:space:]]*/){t=substr($0,RSTART+RLENGTH); sub(/[ \t·,].*$/,"",t); print t}' "$report")"
  if [ -n "$repin_ids" ]; then
    if [ ! -f "$dir/run-log.jsonl" ]; then
      echo "VIOLATION [$slug]: re-pin run_id cited but _acceptance/$slug/run-log.jsonl does not exist — no lane was ever logged for this workspace"
      violations=$((violations+1)); continue
    fi
    repin_bad=""
    while IFS= read -r rid; do
      [ -n "$rid" ] || continue
      line="$(grep -F "\"run_id\":\"$rid\"" "$dir/run-log.jsonl" | grep -F '"kind":"repin"' | tail -1)"
      if [ -z "$line" ]; then
        echo "VIOLATION [$slug]: re-pin run_id \"$rid\" cited in ### Re-pin but no {\"kind\":\"repin\"} line in run-log.jsonl — the lane never logged this re-pin; re-run the lane, do not hand-mint run_ids"
        repin_bad=1; continue
      fi
      lsha="$(printf '%s' "$line" | sed -n 's/.*"sha":"\([0-9a-f]\{7,40\}\)".*/\1/p')"
      if [ -n "$vc" ] && [ "$lsha" != "$vc" ]; then
        echo "VIOLATION [$slug]: re-pin line for run_id \"$rid\" has sha $lsha but verified_commit is $vc — signature and lane disagree; re-pin against the verified commit"
        repin_bad=1; continue
      fi
      if printf '%s' "$line" | grep -Eq '"suites_exit":\[[0-9, ]*[1-9]' ; then
        echo "VIOLATION [$slug]: re-pin line for run_id \"$rid\" has nonzero suites_exit — a red lane cannot back a signature; fix the suites and run a NEW lane"
        repin_bad=1; continue
      fi
    done <<REPINIDS
$repin_ids
REPINIDS
    if [ -n "$repin_bad" ]; then violations=$((violations+1)); continue; fi
  fi
```

- [ ] **Step 4: Chạy XANH** toàn bộ; kiểm AC-5 tại chỗ: `git diff scripts/pre-merge-check.sh | grep '^-' | grep -v '^---'` phải RỖNG.
- [ ] **Step 5: Commit** `git add scripts/pre-merge-check.sh tests/scripts/premerge-repin.test.mjs tests/scripts/repin-fixture.mjs && git commit -m "feat(delta-verify-repin): luật repin T1 trong pre-merge + fraud/grandfather case (AC-2/3/4/15)"`

### Task 4: E5 — phép đo chỉ-THÊM-không-nới (phục vụ AC-5)

**Files:**
- Test: `tests/scripts/additive-only.test.mjs` (mới — case DV5)

**Interfaces:**
- Consumes: nhánh chính từ `git remote show origin` fallback main/master;
  base = `git merge-base HEAD <main>` — suy lúc chạy, không hardcode.
- `independent: true` (chỉ đọc git, không chạm file ai)

- [ ] **Step 1: Viết DV5**: với mỗi file trong {pre-merge-check.sh, recheck-evidence.js}: `git diff <base> -- <file>`; (răng b) đếm số dòng context+giữ-nguyên thuộc khối luật cũ nhận diện được (grep `VIOLATION\|NOTE\|process.exit` trong bản tại `<base>` qua `git show <base>:<file>`) — count phải > 0, bằng 0 → FAIL "phép nhận diện hỏng"; luật: mọi dòng `^-` (trừ `^---`) phải RỖNG, ngoại lệ liệt kê đích danh trong mảng `ALLOWED_REMOVALS = []` (hiện rỗng — có nhu cầu thật mới thêm từng dòng nguyên văn); (răng c) mutant: bản sao repo tạm code-sinh (`git worktree add` hoặc cp + git init từ `git archive <base>`) sửa 1 dòng VIOLATION cũ trong pre-merge bản HEAD → chạy chính hàm đo trên bản sao → phải ĐỎ với thông điệp `additive-only: existing rule line removed/modified`.
- [ ] **Step 2: Chạy** — với code Task 2/3 đã vào, DV5 phải XANH ngay (diff hiện tại thuần THÊM) và mutant phải ĐỎ. Cả hai chiều đều assert trong cùng case.
- [ ] **Step 3: Commit** `git add tests/scripts/additive-only.test.mjs && git commit -m "test(delta-verify-repin): DV5 additive-only 3 răng chống 0-hit-giả (AC-5)"`

### Task 5: Round-trip khuôn REPIN-TEMPLATE (E15 · phục vụ AC-16)

**Files:**
- Test: `tests/scripts/repin-roundtrip.test.mjs` (mới — case DV12)

**Interfaces:**
- Consumes: cặp marker trong SKILL (Task 1) + reader recheck (Task 2) —
  SKILL path suy từ vị trí test: `../../feature-loop/skills/feature-loop/SKILL.md`.
- `independent: false` (cần Task 1 + Task 2 xong)

- [ ] **Step 1: Viết DV12**: đọc SKILL, rút khối giữa `<<<REPIN-TEMPLATE` và `REPIN-TEMPLATE>>>` (không tìm thấy cặp marker → FAIL đích danh); từ khuôn đó SINH fixture (thay placeholder `<ISO>/<id>/<40-hex>/<N>` bằng giá trị thật — parse placeholder từ khuôn, KHÔNG chép tay chuỗi jsonl vào test) → dựng workspace bằng `mkRepinFixture` với dòng + section sinh ra → chạy recheck-evidence.js thật → exit 0 (round-trip clean). Đột biến: đổi key `suites_exit` thành `suites` trong dòng sinh ra → recheck phải ĐỎ với thông điệp REPIN đích danh (nonzero/không khớp tuỳ nhánh chạm — ghim đúng chuỗi nhận được lần chạy đầu, không ghim mơ hồ). Đối chứng dương lặp lại sau đột biến bằng fixture nguyên khuôn.
- [ ] **Step 2: Chạy XANH**; RED-test: sửa tạm 1 field trong REPIN-TEMPLATE của SKILL (bản sao) → DV12 trên bản sao phải đỏ.
- [ ] **Step 3: Commit** `git add tests/scripts/repin-roundtrip.test.mjs && git commit -m "test(delta-verify-repin): DV12 round-trip khuôn REPIN-TEMPLATE writer↔reader (AC-16)"`

### Task 6: invokedSha vào run-log + SKILL args (E6 · phục vụ AC-6)

**Files:**
- Modify: `feature-loop/workflows/acceptance-verify.js` (~dòng 493: nhận `args.invokedSha`; ~501/513/689/695/702: mỗi object dòng run-log thêm `...(invokedSha ? { sha: invokedSha } : {})`)
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (mục chuẩn-bị-args: thêm dòng `invokedSha = git rev-parse HEAD` cạnh `invokedAt`)
- Test: `tests/workflows/acceptance-verify.test.mjs` (case DV6, harness vm-realm sẵn có)

**Interfaces:**
- Produces: dòng run-log eval/panel/baseline có field `sha` khi args có
  `invokedSha`; vắng args → object KHÔNG có key `sha` (không phải null).
- `independent: true` so với Task 2-5 (file khác nhau)

- [ ] **Step 1: DV6 fail-first**: harness invoke script với `invokedSha: 'a'.repeat(40)` → mọi phần tử `result.runLog` parse ra có `sha` đúng; invoke KHÔNG có field → không phần tử nào có key `sha`, script không crash (cả hai chiều assert).
- [ ] **Step 2: ĐỎ** → **Step 3: vá** `const invokedSha = typeof args.invokedSha === 'string' ? args.invokedSha : '';` + spread vào 5 chỗ push dòng. **Step 4: XANH.**
- [ ] **Step 5: Commit** `git add feature-loop/workflows/acceptance-verify.js feature-loop/skills/feature-loop/SKILL.md tests/workflows/acceptance-verify.test.mjs && git commit -m "feat(delta-verify-repin): invokedSha chảy vào từng dòng run-log (AC-6)"`

### Task 7: carry-plan.mjs — ma trận carry round fix (E7, E8, E9 · phục vụ AC-7, AC-8, AC-9)

**Files:**
- Create: `feature-loop/scripts/carry-plan.mjs`
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (P1: round fix sau REJECT dùng carry-plan.mjs với anchor = sha dòng round trước; không sha → full re-run)
- Test: `tests/workflows/carry-plan.test.mjs` (mới — DV7/DV8/DV9)

**Interfaces:**
- Produces: CLI `node carry-plan.mjs --run-log <p> --evals <p> --contract <p> --delta-files <f1,f2,…> --round <N>` → stdout JSON `{anchorSha, carriedEvals:[{id,runId,fromRound,verifiedAt,cmd}], rerun:[id…], reason:{<id>:"<vì sao>"}}`; exit 3 khi round trước không có dòng `sha` (main loop hiểu = full re-run).
- Logic (đúng P1 Đợt 5 + mở rộng fix-round): đọc dòng eval round N-1;
  thiếu field `sha` ở BẤT KỲ dòng nào → exit 3; eval có `paths` không khớp
  glob nào trong delta-files VÀ `exit_code:0` → carried (giữ run_id gốc,
  fromRound theo `carried_from_round` nếu có); chạm/đỏ/thiếu paths → rerun;
  criterion `(cross-layer)` (đọc từ contract): một thành viên rerun → cả
  cặp rerun. Suite không thuộc phạm vi file này (SKILL vẫn bắt chạy lại).
- `independent: true` (file mới + test mới)

- [ ] **Step 1: DV7 fail-first** — ma trận VIẾT-TRƯỚC đủ 5 nhánh (khuôn P105, 1 assert/nhánh): (1) paths không chạm + exit 0 → carried đúng {runId gốc, fromRound}; (2) paths chạm delta → rerun; (3) round trước exit ≠0 → rerun; (4) thiếu paths → rerun; (5) dòng carried round trước (`carried_from_round:1`) carry tiếp → fromRound=1 giữ nguyên. DV8: run-log không có `sha` → exit 3; đối chứng: CÙNG fixture chỉ thêm field sha → exit 0 + carried. DV9: contract có AC `(cross-layer)` với 2 eval — 1 chạm delta → CẢ HAI trong rerun; cả hai không chạm → cả hai carried. Fixture code-sinh, đường dẫn suy từ test.
- [ ] **Step 2: ĐỎ** → **Step 3: viết carry-plan.mjs** (thuần Node, `isMain` theo khuôn realpathSync của claim-scan.mjs; glob match tái dùng minimatch-đơn-giản của repo nếu có, không thì convert glob→RegExp như acceptance-verify làm). **Step 4: XANH đủ 8 case.**
- [ ] **Step 5: Sửa SKILL** mục P1: thêm "**Round fix sau REJECT (mở rộng delta-verify-repin):** chạy `node <WORKFLOWS_DIR>/../scripts/carry-plan.mjs …` — exit 0 → dùng carriedEvals in ra (vẫn LUÔN chạy lại suite); exit 3 → full re-run (run-log cũ chưa có sha — mặc định an toàn)". Case DV1 mutation set của Task 1 không đụng (mệnh đề mới có test riêng trong DV10 nếu chạm khuôn carry-minh-bạch).
- [ ] **Step 6: Commit** `git add feature-loop/scripts/carry-plan.mjs feature-loop/skills/feature-loop/SKILL.md tests/workflows/carry-plan.test.mjs && git commit -m "feat(delta-verify-repin): carry-plan.mjs — ma trận P1 cho round fix, mặc định an toàn không-sha (AC-7/8/9)"`

### Task 8: Hook không nhận nhầm dòng repin (E11 · phục vụ AC-11)

**Files:**
- Test: `tests/hooks/` case DV11 (thêm vào harness run-tests.sh hooks theo khuôn case sẵn có; fixture run-log có dòng `kind:repin` xen giữa dòng eval)
- Modify (CHỈ NẾU đỏ): `lib/evidence-core.js` `readRunLogIds` — kỳ vọng KHÔNG cần sửa (matcher đọc `entry.run_id` mọi dòng; dòng repin có run_id riêng không trùng eval → vô hại; test chứng minh)

**Interfaces:** `independent: true`

- [ ] **Step 1: DV11**: fixture report PASS cite run_id eval bình thường; run-log có thêm dòng repin (run_id khác) → hook/recheck XANH (không nhận nhầm, không VIOLATION oan); đối chứng âm: report cite run_id CHỈ tồn tại trên dòng repin dưới dạng eval thường (không phải section Re-pin) → recheck vẫn theo luật hiện hành (ghi nhận hành vi thật — nếu chuỗi được nhận qua `readRunLogIds`, đó là hành vi CŨ giữ nguyên, ghi chú trong test, KHÔNG sửa để không nới/không thắt luật cũ ngoài hợp đồng).
- [ ] **Step 2: Chạy** `bash tests/hooks/run-tests.sh` + toàn bộ 4 suite. **Step 3: Commit** `git add tests/hooks && git commit -m "test(delta-verify-repin): DV11 hook không nhận nhầm dòng kind:repin (AC-11)"`

### Task 9: Đóng gói — bump 1.22.0, sync mirror, suite toàn cục (E14, phần máy của AC-11)

**Files:**
- Modify: `feature-loop/.claude-plugin/plugin.json`, `codex/feature-loop-codex/.codex-plugin/plugin.json` (1.21.x → 1.22.0, description "v1.22 adds one-lane re-pin ritual + fix-round carry"), root `.claude-plugin/plugin.json` + `.codex-plugin/plugin.json` nếu pin version
- Modify: `tests/plugins/run-tests.sh` (re-pin literal version)
- Modify: `codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md` (đồng bộ nghi thức re-pin + carry — cùng LỚP với Task 1, quét cả harness codex)
- Run: `bash scripts/sync-plugin-packages.sh && bash scripts/sync-plugin-packages.sh --check`

**Interfaces:** `independent: false` (sau mọi task nguồn)

- [ ] **Step 1:** Đồng bộ nghi thức sang codex SKILL (mệnh đề tương đương DV1 a-f — kiểm bằng case skill-claims nếu suite codex có, không thì grep tay + ghi chú).
- [ ] **Step 2:** Bump 4 manifest (nhớ root — lần trước sót, P03 bắt) + literal tests/plugins.
- [ ] **Step 3:** `bash scripts/sync-plugin-packages.sh` → `--check` exit 0; chạy đủ 4 suite: `bash tests/scripts/run-tests.sh && bash tests/workflows/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh`.
- [ ] **Step 4: Commit** `git add <đích danh: 4 manifest, tests/plugins/run-tests.sh, codex SKILL, plugins/> && git commit -m "chore(delta-verify-repin): bump feature-loop 1.22.0 + sync mirror"`

### Task 10: Khép S3 — status implemented

- [ ] Chạy lại đủ 4 suite lần cuối + `git diff --stat` soát không cuốn file lạ (bài học git-add-đích-danh).
- [ ] Set contract `status: implemented`, append ledger entry `approach` nếu có lựa chọn load-bearing phát sinh; commit đích danh.
- [ ] Dispatch S4 NGAY trong cùng lượt (args theo SKILL 1.21.0 — round 1, contractPath, carry P2/P3 như mọi round; **invokedSha từ giờ truyền luôn** — chính vòng này bắt đầu ghi sha).

## Self-review

- Spec coverage: AC-1/10/13→T1; AC-2/15→T2+T3; AC-3/4→T3; AC-5→T4; AC-16→T5; AC-6→T6; AC-7/8/9→T7; AC-11→T8+T9; AC-12/14→judgment (E12 S4, E16 Gate 2 — không cần task code). Đủ 16.
- Type consistency: khuôn dòng repin + 4 thông điệp khai một chỗ (Global Constraints + Task 2 Interfaces), Task 3/5 tiêu thụ nguyên văn; `mkRepinFixture` sống ở `tests/scripts/repin-fixture.mjs` dùng chung T2/T3/T5.
- Không placeholder: mọi task có code/lệnh thật.
