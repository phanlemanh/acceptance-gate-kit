---
description: Scaffold _acceptance/ workspace + config.yaml for this repo (one-time setup)
disable-model-invocation: true
---

Initialize the Acceptance-Gate Kit in the current repository.

Một-lượt-gõ + `--repo` (điều khoản chung, chép nguyên văn từ bản luật):

Ba lệnh có-câu-hỏi (`/approve` · `/signoff` · `/start`) nhận MỘT CÂU GỘP theo ngữ pháp `GATE-ONESHOT-GRAMMAR` trong bản luật ngôn ngữ mặt người — câu gộp là câu NGƯỜI gõ — cờ và ngữ pháp này không mở đường cho máy gọi lệnh; vắng câu gộp thì hỏi từng bước như cũ. Mọi lệnh cổng người nhận cờ `--repo <path>`: mọi đọc/ghi/git của lệnh chạy trên gốc `<path>` (`git -C <path>`, script kèm `--root <path>`); vắng cờ thì gốc là thư mục hiện tại như cũ. Đầu ra theo bản luật ngôn ngữ mặt người.

Lệnh này KHÔNG nằm trong ba lệnh có-câu-gộp; phần áp dụng ở đây là cờ
`--repo <path>`: scaffold `_acceptance/` và chép bộ file CI vào gốc `<path>`
thay vì thư mục hiện tại.

**Khởi tạo là MỘT LẦN GẠCH, không phải một cuộc phỏng vấn.** Máy DÒ repo trước,
tự điền được gì thì điền, rồi trình **TRỌN** bản nháp `config.yaml` trong MỘT
lượt cho người sửa hoặc gật. Ô nào không suy được thì để nguyên chỗ trống và
đánh dấu `# cần anh` ngay trên dòng đó — người đọc một lần, sửa mấy dòng, gật
một lần. Hỏi tuần tự từng câu là bắt người trả lời những thứ máy đọc được từ
chính repo đang mở.

1. If `_acceptance/config.yaml` already exists → show it and STOP (never overwrite).
2. **Dò repo trước, đừng hỏi.** Đọc những gì có: `package.json` (scripts
   `test`/`dev`/`start`, workspaces), khung test đang dùng, cấu hình CI trong
   `.github/workflows/`, `Makefile`/`justfile`, khai báo cổng dev. Mỗi giá trị
   suy được ghi kèm căn cứ một dòng (`# suy từ package.json scripts.test`).
   Những mục dưới đây là thứ CẦN có; suy được thì điền sẵn, không suy được thì
   để trống + `# cần anh`:
   a. Test commands per surface they have (api/backend/sdk) — e.g. `pnpm --filter backend test`
   b. CLI smoke command if a CLI surface exists
   c. Dev server start command + URL (for ui-check evals). If the app calls
      APIs on OTHER origins (auth service, data API…), also collect their URL
      prefixes → `dev_server.api_base` (a LIST — scopes the ui-check network
      rail; missing → scope defaults to the url's origin)
   c2. (optional, for UI slideshow evidence) A command that saves a screenshot of
       a URL to a FILE — `<cmd> <url> <out.png>` (e.g. `npm run ui:capture`).
       preview_screenshot is inline-only, so this is what writes the slideshow
       frames. None yet → offer to scaffold a reference (step 3b).
   c3. Mobile surface? The native E2E runner command →
       `executors.test.e2e_mobile` (XCUITest: `xcodebuild test -project
       App.xcodeproj -scheme AppUITests -destination 'platform=iOS
       Simulator,name=iPhone 16'`; Espresso: `./gradlew connectedAndroidTest`).
       Remind: each mobile feature's contract carries a `Mobile backend
       target: local|staging|mock` line in ## Notes (lint W5 checks presence;
       the Gate-1 human eyeballs the value).
   d. Paths that are critical (auth/data/payments) → `t3_paths`
   e. Globs safe to skip entirely (docs, pure-config) → `t1_skip_globs`.
      Always keep the `PRODUCT-MAP.md` line the template ships — and tell the
      repo owner to run `executors.script.product_map` in their CI, because
      that check is what makes the exemption safe (ADR 0007).
   f. Who can sign off (names) → `signoff.approvers`
3. **Trình TRỌN bản nháp một lần** — in nguyên văn `config.yaml` đề xuất kèm
   các dòng căn cứ và các dòng `# cần anh`, rồi hỏi đúng MỘT câu: sửa gì, hay
   gật. Người gật → ghi. Người sửa → nhận nguyên văn phần sửa rồi ghi, không
   hỏi lại vòng hai cho những ô đã rõ.
4. Write `_acceptance/config.yaml`:

```yaml
# 2-space indentation REQUIRED — the kit's hook parses this file line-by-line.
schema_version: 1
enforcement: strict          # strict | warn | off
gap_probe: advisory          # Luật phản biện context sạch ở pre-merge check: required | advisory | off.
                             # `advisory` (mặc định khi khoá vắng) in NOTE khi một slug T2/T3 trong
                             # diff PR thiếu gap-probe.md và thiếu entry descope; `required` chặn merge.
recheck: strict              # CI re-check of COMMITTED evidence: strict | warn | off.
                             # strict is safe for a fresh repo (no legacy reports);
                             # `warn` only exists so repos ADOPTING the kit with older
                             # reports aren't blocked — do not start there.
executors:
  test:
    api: "<from 2a>"
    # e2e_mobile: "<from 2c3>"   # native E2E runner (xcodebuild test … / ./gradlew connectedAndroidTest) — exit code = UI-layer evidence only
  script:
    cli: "<from 2b>"
    product_map: "node ${CLAUDE_PLUGIN_ROOT}/scripts/product-map.mjs --root . --check"
  design:                                              # keep if the repo has any web UI
    # design-gate runs in DOM mode and needs jsdom resolvable where the gate
    # runs — remind the user to `npm i -D jsdom`, or every design eval is BLOCKED.
    gate: "node ${CLAUDE_PLUGIN_ROOT}/scripts/design-gate.mjs"   # script tier (a11y/slop)
    ui_check: "${CLAUDE_PLUGIN_ROOT}/scripts/design-scan.js"     # browser tier (authoritative P0)
  # ui:                                                # optional (step 3c): cross-family VLM
  #   vlm_assert: "node scripts/vlm-assert.mjs"        # second opinion on saved UI frames
risk_tiers:
  t1_skip_globs:
    - "<from 2e>"
    # Bản đồ sản phẩm — máy sinh, và /approve + /signoff commit nó CÙNG commit
    # chữ ký. Thiếu dòng này thì chính commit chữ ký làm evidence stale và
    # pre-merge chặn merge, thành vòng không thoát (ADR 0007). Miễn trừ CHỈ an
    # toàn khi repo cũng chạy `executors.script.product_map` trong CI của mình —
    # cổng đó là thứ duy nhất canh bản đồ sau khi nó ra khỏi tầm stale-check.
    - "PRODUCT-MAP.md"
  t3_paths:
    - "<from 2d>"
signoff:
  required_for: [T2, T3]     # tiers that pre-merge-check requires signoff for
  approvers: ["<from 2f>"]   # approvers: informational — this key is NOT enforced
                             # by the gate (four attempts to parse it from YAML in
                             # shell all broke on a new valid-YAML shape; the class
                             # was removed rather than patched a fifth time).
                             # Signatures ARE still checked: human_signoff must not
                             # be empty and must not be an English placeholder
                             # (PENDING/TBD/TODO/n/a/none/unsigned/waiting/<name>).
                             # A holding note in another language still passes.
  require_human_commit: true # Gate-2 signature must land in its own human-fields-only
                             # commit (pre-merge checks git history; the reviewer commits
                             # the signoff line themselves). Safe default for a fresh repo.
  # agent_authors:           # OPTIONAL email-glob blocklist for the signoff commit's author
  #   - "*[bot]*"            # (useful when CI/agents commit under a dedicated identity)
dev_server:
  start: "<from 2c>"
  url: "<from 2c>"
  # api_base: ["<api prefix 1>", "<api prefix 2>"]   # optional LIST: real API URL prefixes when they differ from url's origin (multi-service apps). Scopes the network rail; omit → scope = url origin.
capture:
  ui: "<from 2c2>"           # optional: <cmd> <url> <out.png> to save ui-check frames to files (Gate-2 slideshow). Omit if no UI evidence.
# feature_loop:              # (feature-loop plugin) S4 adds suite_keys here via scripts/config-patch.mjs
#   models:                  # optional: override the verify-agent model per role
#     judge: opus            # roles: machine/ui/judge/finder/refute/baseline/provenance/scribe/synthesize (+ executor for S3 fan-out)
#     finder: session        # 'session' = inherit the main session's model
```

Omit executor keys for surfaces the repo does not have — do not write empty strings.
Omit the `capture` block if the repo has no UI evidence need.

3b. **(optional) Scaffold the UI capture reference.** If the user wants slideshow
    evidence but has no capture command, copy
    `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/ui-capture.reference.mjs`
    into the repo as `scripts/ui-capture.mjs`; tell them to `npm i -D
    puppeteer-core` (drives an EXISTING Chrome — no heavy download) and add
    `"ui:capture": "node scripts/ui-capture.mjs"` to package.json, then set
    `capture.ui: "npm run ui:capture"`. The script + dependency live in the REPO,
    NOT in the plugin — the kit stays zero-dependency.

3c. **(optional) Scaffold the external-VLM second opinion.** If the user wants a
    cross-model check on saved UI frames (a different model family re-reads the
    screenshots and answers closed YES/NO questions), copy
    `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/vlm-assert.reference.mjs`
    into the repo as `scripts/vlm-assert.mjs`; tell them to set `GEMINI_API_KEY`
    (the script calls Gemini REST via Node's built-in fetch — zero npm
    dependency; default model `gemini-3.5-flash`, override with `VLM_MODEL`),
    and add the
    `executors.ui.vlm_assert` key above. Evals use it through a thin
    per-assertion wrapper — closed questions only, opt-in per eval (see the
    acceptance skill's eval-executors reference). The script + key live in the
    REPO, NOT in the plugin.

4. Write `_acceptance/README.md` (3 lines): what this folder is, link to the
   acceptance skill, "artifacts are per-feature in subfolders".
5. Suggest copying the CI gate from the plugin into the repo — ALL SEVEN files,
   keeping the `scripts/` + `lib/` layout (pre-merge finds the re-check next to
   itself, and the `.cjs` files `require` their siblings under `../lib`). The
   kit ships these as `.cjs` ON PURPOSE: in a consumer repo declaring
   `"type": "module"`, Node reads a copied `.js` file as ESM, its `require()`
   throws ReferenceError, and the layer dies silently — `.cjs` stays CommonJS
   under every `type`. Copy the WHOLE list; each missing file switches one
   enforcement layer off:
   <!-- <<<INIT-CI-COPY-LIST -->
   - `${CLAUDE_PLUGIN_ROOT}/scripts/pre-merge-check.sh` → `scripts/` (the merge gate itself)
   - `${CLAUDE_PLUGIN_ROOT}/scripts/recheck-evidence.cjs` → `scripts/` (committed-evidence re-check; missing → gate only NOTEs)
   - `${CLAUDE_PLUGIN_ROOT}/lib/evidence-core.cjs` → `lib/` (the evidence bar shared with the hook; the re-check cannot load without it)
   - `${CLAUDE_PLUGIN_ROOT}/lib/gap-probe.cjs` → `lib/` (clean-context critique rule; missing → "GAP-PROBE: NOT ENFORCED" on every run)
   - `${CLAUDE_PLUGIN_ROOT}/lib/workspace-record.cjs` → `lib/` (shared config-list reader; missing → weaker sed fallback)
   - `${CLAUDE_PLUGIN_ROOT}/lib/ac-line.cjs` → `lib/` (criterion-line parser for the cross-layer teeth; missing → wider awk fallback, possible spurious blocks)
   - `${CLAUDE_PLUGIN_ROOT}/lib/md-section.cjs` → `lib/` (section boundary `require`d by ac-line)
   <!-- INIT-CI-COPY-LIST>>> -->
   Copying only pre-merge-check.sh silently drops the committed-evidence
   re-check layer (it degrades to a NOTE) and mutes the gap-probe rule.
   In the CI step, pass the PR base so the T1-escape backstop is armed
   (without it the backstop only NOTEs): on GitHub Actions
   `bash scripts/pre-merge-check.sh . --base "origin/$GITHUB_BASE_REF"`
   (or export `PRE_MERGE_BASE`). The backstop blocks PRs that change
   `t3_paths` — or any non-T1 file — while carrying no `_acceptance/<slug>/`
   artifacts.
   A job that runs on `push` (not a PR) must ALSO pass `--no-t1-escape`. The
   T1-escape backstop assumes "this change is a PR, so it must carry
   `_acceptance/<slug>/`" — false for release commits landing
   straight on the main branch, so leaving it armed there makes the job
   permanently red for structural reasons. Keep `--base` either way: the
   gap-probe rule needs the diff scope, and running without a base is a
   VIOLATION in `required` mode. See docs/adr/0005.

   IMPORTANT — re-copy `scripts/pre-merge-check.sh` from the plugin BEFORE you
   add this flag. Older vendored copies have no unknown-flag guard: they treat
   `--no-t1-escape` as the ROOT path, find no `_acceptance/` there, and exit 0
   with the ENTIRE pre-merge check unrun (signoff, verdict, staleness, gap-probe, re-check
   — all skipped, CI green). Support landed in acceptance-gate 1.22.0+ — the released 1.21.0 has neither the flag nor the guard.
6. Print: "Acceptance gate ready. Run the acceptance skill on your next feature."
