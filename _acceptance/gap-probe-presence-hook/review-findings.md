# Review Findings: gap-probe-presence-hook (round 3)

Informational — nằm NGOÀI phạm vi acceptance-evidence-gate hook (hook chỉ đọc
`evidence-report.md`/`contract.md`). File này liệt kê các finding đã qua
**adversarial-verify** (refuter đã chạy và xác nhận, không chỉ heuristic một
lượt) trên diff của feature `gap-probe-presence-hook` tính tới
`verified_commit: d7a0c8b3946660ce01867909fe6119617f34746a`, dùng để nạp cho
`evidence-page.js` (bảng "Review findings") và cho human đọc tại Gate 2. File
này GHI ĐÈ nội dung findings của round trước; lịch sử round nằm ở
`evidence-report.md` § Iterations.

Phạm vi round này: mở rộng ra khỏi lớp merge-boundary thuần tuý (đã cover ở
round 1-2) sang parity 2-harness của init (Claude/plugin/Codex), toàn vẹn
comment-vs-code trong `scripts/pre-merge-check.sh`, và vòng đời của chính
fixture/artifact test dùng để chấm feature này. 11/11 finding dưới đây đều đã
adversarial-verify thành công (không có finding nào gắn `unverified: true`).
Không có finding severity `high` round này. Sắp xếp severity giảm dần.

## Medium severity (5)

### 1. Khoá config `gap_probe` chỉ được thêm vào init phía Claude, harness Codex bị bỏ lại

- title: Khoá config `gap_probe` chỉ được thêm vào init phía Claude, harness Codex bị bỏ lại
  file: codex/acceptance-gate/skills/acceptance-init/SKILL.md
  line: 51
  severity: medium
  source: conventions
  detail: |
    Diff thêm `gap_probe` vào template config của `commands/acceptance-init.md` (Claude) nhưng KHÔNG thêm vào template tương ứng của Codex tại `codex/acceptance-gate/skills/acceptance-init/SKILL.md` §4 (block yaml dòng 48-72, chỉ có `enforcement`/`recheck`). Repo có invariant parity 2 harness rất rõ: CLAUDE.md nói 5 thao tác cổng người phải khoá ở CẢ HAI harness, tests/plugins/run-tests.sh có P24 (kiểm `recheck: strict` trong chính file Codex này) và P29 (kiểm gap-probe được wire across mirrors). Hệ quả: repo init bằng Codex không bao giờ thấy khoá này tồn tại, rơi mặc định `advisory` vĩnh viễn và không có đường khám phá để opt-in `required` — đúng kiểu cổng tự tắt im lặng mà chính luật này sinh ra để chặn. Vì `plugins/` là build mirror, sửa nguồn `codex/` xong phải chạy `scripts/sync-plugin-packages.sh`.

### 2. Comment đã bị thay thế còn nằm lại và mâu thuẫn trực tiếp với code ngay dưới nó

- title: Comment đã bị thay thế còn nằm lại và mâu thuẫn trực tiếp với code ngay dưới nó
  file: scripts/pre-merge-check.sh
  line: 236
  severity: medium
  source: conventions
  detail: |
    Dòng 236-238 khẳng định "NEO `^` là bắt buộc: ... glob chưa neo chính là lỗ README đang ghi", rồi dòng 239-244 (khối thay thế, thêm ở commit 78929ae) nói ngược lại: path của `git diff` tương đối git top-level nên phải "chấp cả hai hình dạng", và code dòng 250 dùng đúng `_acceptance/"$1"/*|*/_acceptance/"$1"/*` — tức KHÔNG neo. Dòng "# 0 iff PR đổi ít nhất một file dưới _acceptance/<slug>/." bị lặp y hệt ở 236 và 239, dấu hiệu rõ của khối cũ quên xoá. Trong file mà comment là spec chính (mọi luật đều được biện minh bằng comment dài), một comment còn sống khẳng định điều trái ngược với code sẽ dẫn người sửa sau đi neo lại `^` và tắt im lặng luật ở monorepo — chính hồi quy mà GPM14 vừa dựng để chặn. Bản mirror `plugins/acceptance-gate/scripts/pre-merge-check.sh` cùng lỗi.

### 3. Suite regression chung của kit bị buộc vào artifact `_acceptance/` của đúng một feature

- title: Suite regression chung của kit bị buộc vào artifact `_acceptance/` của đúng một feature
  file: tests/scripts/run-tests.sh
  line: 1858
  severity: medium
  source: conventions
  detail: |
    GPM12 (dòng 1858) đọc `$ROOT_REAL/_acceptance/gap-probe-presence-hook/evidence/premerge-messages.txt` và GPM5c (dòng 1800) đọc `$ROOT_REAL/_acceptance/gap-probe-presence-hook/gap-probe.md`. Mọi case còn lại trong suite đều tự dựng fixture trong `$T` (mktemp) — đây là tiền lệ đầu tiên phá quy ước đó. Hai hệ quả cụ thể: (1) nhánh `else check GPM12-missing 0 1` biến "thư mục gate của một feature đã xong bị dọn/đổi tên" thành FAIL của suite kit, dù script under test không đổi một dòng; (2) GPM12 không kiểm hành vi của `pre-merge-check.sh` mà kiểm độ đầy đủ của gói bằng chứng — đúng việc của eval E12 trong `_acceptance/gap-probe-presence-hook/evals.yaml` (E12 đã tồn tại và cũng chỉ vào chính case này), nên logic bị nhân đôi ở hai lớp có vòng đời khác nhau.

### 4. Malformed JSONL descope line silently opens the merge-boundary escape hatch (fail-open, and contradicts the asserted gate-card.js parity)

- title: Malformed JSONL descope line silently opens the merge-boundary escape hatch (fail-open, and contradicts the asserted gate-card.js parity)
  file: scripts/pre-merge-check.sh
  line: 152
  severity: medium
  source: bugs
  detail: |
    `gap_probe_descope_id()` matches the descope escape hatch with a raw-text awk regex over each line of `decisions.jsonl`. `scripts/gate-card.js` instead `JSON.parse`s each line (line 120-125) and counts unparseable lines as `broken`, so a malformed entry is DROPPED and never satisfies `gpDescope`. The awk matcher does not parse JSON at all, so a syntactically broken line still opens the hatch.

    Verified repro: repo with `gap_probe: required`, T3 slug `feat-b` at `status: implemented`, no `gap-probe.md`, and `decisions.jsonl` containing exactly one line with the closing brace missing:

        {"type":"descope","decision":"bỏ gap-probe — thiếu ngoặc"

    Result: `NOTE [feat-b]: phản biện context sạch đã được BỎ có chủ đích theo ledger (entry không có id)` and `pre-merge-check: clean`, exit 0 — merge allowed. The Gate 1 card on the same artifact drops the line as broken and still flags "Chưa có phản biện context sạch". This is exactly the card↔pre-merge contradiction the comment at lines 138-142 ("CÙNG luật /^\s*bỏ gap-probe/i mà scripts/gate-card.js dùng. Lệch nhau = thẻ Cổng 1 và pre-merge mâu thuẫn") claims cannot happen, and the divergence direction here is fail-OPEN in the enforcement layer, not fail-closed.

    Also note the NOTE prints `(entry không có id)` in this case, so the audit message that is supposed to point a human at a traceable ledger id points at nothing. Test GPM7c only covers a broken line ALONGSIDE a valid descope entry, so the suite is green over this.

    Same code, same line, in the byte-identical mirror `plugins/acceptance-gate/scripts/pre-merge-check.sh:152`.

### 5. `gap_probe` knob absent from the /acceptance-init config template in the plugin and Codex skill packages — only the commands/ copy was updated

- title: `gap_probe` knob absent from the /acceptance-init config template in the plugin and Codex skill packages — only the commands/ copy was updated
  file: plugins/acceptance-gate/skills/acceptance-init/SKILL.md
  line: 50
  severity: medium
  source: bugs
  detail: |
    The diff adds `gap_probe: advisory` (with explanatory comment) to the `_acceptance/config.yaml` template in `commands/acceptance-init.md:38-40`, but the same template exists in two other init paths that were NOT updated:

    - `plugins/acceptance-gate/skills/acceptance-init/SKILL.md:48-51` (`schema_version` / `enforcement: strict` / `recheck: strict` / `baseline_minutes` block)
    - `codex/acceptance-gate/skills/acceptance-init/SKILL.md:48-51` (identical block)

    Grep confirms `gap_probe` appears in neither file. `scripts/sync-plugin-packages.sh --check` (test P30) does not catch it — the init SKILL.md files are separately authored, not synced from `commands/acceptance-init.md` — and P24 (`acceptance-init ships runner-backed strict defaults`) does not assert the key either.

    Consequence: every repo initialized through the plugin or Codex skill gets a config with no `gap_probe` key, which resolves to `advisory` — the new merge-boundary rule ships permanently toothless and the knob is undiscoverable for those consumers. Meanwhile `README.md:276-283` was rewritten to delete the "gap-probe rule has no merge-boundary backstop" limitation on the strength of a backstop that two of the three install paths never surface.

## Low severity (6)

### 6. `PREMERGE_FIXTURE_DIR` phát biểu một BẮT BUỘC nhưng không có răng

- title: `PREMERGE_FIXTURE_DIR` phát biểu một BẮT BUỘC nhưng không có răng
  file: tests/scripts/run-tests.sh
  line: 33
  severity: low
  source: conventions
  detail: |
    Comment dòng 28-32 viết "BẮT BUỘC trỏ RA NGOÀI repo ... để trong repo là tự mở đường vòng qua chính cái răng T1-escape", nhưng dòng 33-35 nhận giá trị nguyên xi, tắt luôn `trap rm -rf` và `mkdir -p` bất kỳ đâu. Không có kiểm `case "$T" in "$ROOT_REAL"/*) exit 1;;`. Đặt biến trỏ vào repo sẽ sinh hàng loạt `_acceptance/<slug>/` fixture, và răng T1-escape (đếm mọi path khớp `*/_acceptance/*` là "PR có kèm gate artifact") coi PR đó đã có artifact — tức vô hiệu hoá backstop bằng chính rác test, đúng lỗ mà README đang liệt kê. Ở repo lấy "luật không có răng là nghi thức" làm luận điểm trung tâm, một MUST chỉ nằm trong comment là lệch chuẩn.

### 7. Parity descope thẻ↔pre-merge không trọn như comment và test khẳng định

- title: Parity descope thẻ↔pre-merge không trọn như comment và test khẳng định
  file: scripts/pre-merge-check.sh
  line: 147
  severity: low
  source: conventions
  detail: |
    Comment dòng 147 nói awk "Khớp CHÍNH XÁC luật /^\s*bỏ gap-probe/i của gate-card.js" và GPM16 (tests/scripts/run-tests.sh:1909) tự mô tả là kiểm "TRỌN không gian hoa/thường", nhưng alternation `(bỏ|Bỏ|BỎ)` bỏ sót biến thể `bỎ`, còn `/i` của JS thì nhận. Đã kiểm chứng: `/^\s*bỏ gap-probe/i.test("bỎ gap-probe — x")` → true, trong khi `gap_probe_descope_id` trên cùng entry trả rỗng. Hệ quả ở mode `required`: thẻ Cổng 1 hiện "đã bỏ có chủ đích, có dấu vết" còn pre-merge in VIOLATION chặn merge trên cùng một artifact — đúng kiểu mâu thuẫn hai lớp mà comment viện dẫn để biện minh cho cách viết regex. Xác suất gặp thấp (lỗi gõ), nhưng lời khẳng định "chính xác/trọn" là sai.

### 8. HEAD để contract `status: implemented` mà không còn evidence-report/run-log — cổng của chính repo đang đỏ

- title: HEAD để contract `status: implemented` mà không còn evidence-report/run-log — cổng của chính repo đang đỏ
  file: _acceptance/gap-probe-presence-hook/contract.md
  line: 7
  severity: low
  source: conventions
  detail: |
    f25ec65 đẩy `status: approved` → `implemented`, còn 6852813 xoá `evidence-report.md` (217 dòng) và `run-log.jsonl` (29 dòng) khỏi commit. Ở HEAD, chạy `bash scripts/pre-merge-check.sh . --base 9674c0f` sẽ nổ "status=implemented but no evidence-report.md", nên job `gate` trong .github/workflows/gate.yml fail nếu nhánh này lên PR nguyên trạng. Hai file đó hiện chỉ tồn tại untracked trong working tree (`git status`: `?? .../evidence-report.md`, `?? .../run-log.jsonl`). Đây là trạng thái WIP có chủ đích (commit message ghi "dừng trước S4") nên chỉ cần đảm bảo S4 commit lại đủ bộ trước khi merge — nêu ra vì diff kết thúc ở một HEAD không tự qua cổng của chính nó.

### 9. `gap_probe:` with an empty value silently falls back to advisory, while a typo loudly errors

- title: `gap_probe:` with an empty value silently falls back to advisory, while a typo loudly errors
  file: scripts/pre-merge-check.sh
  line: 92
  severity: low
  source: bugs
  detail: |
    The config parser guards the mode validation with `if [ -n "$cfg_gp" ]`, so only a NON-EMPTY unrecognized value reaches the `*)` branch that emits `VIOLATION [config]`. An empty value skips validation entirely and leaves `GAP_PROBE_MODE="advisory"` with no signal.

    Verified: both `gap_probe:` (key present, no value) and `gap_probe: ""` in `_acceptance/config.yaml` produce only `NOTE [feat-b]: ... advisory, không chặn merge` and `pre-merge-check: clean` on a fixture that outputs `VIOLATION` under `gap_probe: required`.

    This is the same failure mode AC-11 and the inline comment at lines 96-97 explicitly exist to prevent ("KHÔNG âm thầm rơi về mặc định: một cổng tự tắt vì sai chính tả đúng là false-green"). A config edit that blanks the value (bad templating, a `config-patch` write of an empty string, a YAML `null`) demotes a `required` gate to advisory with zero output. Test GPM11 covers `"required"`, `Required`, and `requird`, but not the empty value. Mirror: `plugins/acceptance-gate/scripts/pre-merge-check.sh:92`.

### 10. An indented `gap_probe:` anywhere earlier in config.yaml silently overrides the top-level key (can turn the rule fully off)

- title: An indented `gap_probe:` anywhere earlier in config.yaml silently overrides the top-level key (can turn the rule fully off)
  file: scripts/pre-merge-check.sh
  line: 89
  severity: low
  source: bugs
  detail: |
    `cfg_gp` is read with `sed -n 's/^[[:space:]]*gap_probe:[[:space:]]*//p' ... | head -1`, which matches the key at ANY indentation and takes the first hit in file order. `gap_probe` is a top-level scalar, so a misindented or misplaced occurrence should not be authoritative.

    Verified: a config containing

        signoff:
          gap_probe: off
        gap_probe: required

    on a fixture that otherwise emits `VIOLATION [feat-b]: chưa qua phản biện context sạch` produced NO gap-probe output at all and `pre-merge-check: clean` — the nested `off` won and the enforcement rule was silently disabled despite the intended `required` at top level.

    The 2-space config lint does not flag this (the indentation is valid), and nothing warns about duplicate/misplaced keys. The indent-agnostic idiom is inherited from the pre-existing `recheck`/`required_for` parsers, but for `gap_probe` the failure mode is a silently disabled gate rather than a mis-read advisory setting. Mirror: `plugins/acceptance-gate/scripts/pre-merge-check.sh:89`.

### 11. GPM16 claims to test the "whole" case space of the descope matcher but the awk alternation misses mixed-case `bỎ`

- title: GPM16 claims to test the "whole" case space of the descope matcher but the awk alternation misses mixed-case `bỎ`
  file: scripts/pre-merge-check.sh
  line: 152
  severity: low
  source: bugs
  detail: |
    The awk pattern hardcodes three whole-word variants — `(bỏ|Bỏ|BỎ)` — while `gate-card.js:203` uses JS `/^\s*bỏ gap-probe/i`, which case-folds each character independently.

    Verified side-by-side (JS regex vs. the actual `gap_probe_descope_id` function extracted from the script):

        "bỏ gap-probe"  JS=true  awk=d-1
        "Bỏ gap-probe"  JS=true  awk=d-1
        "BỎ gap-probe"  JS=true  awk=d-1
        "bỎ gap-probe"  JS=true  awk=NOMATCH   <-- divergence
        "bỏ Gap-Probe"  JS=true  awk=d-1

    Effect for `bỎ gap-probe`: the Gate 1 card renders the feature as deliberately descoped (no warning) while pre-merge in `required` mode emits `VIOLATION ... ledger không có entry descope` and blocks. Direction is fail-closed, so impact is limited to a confusing contradiction between the two gates — but the test comment at GPM16 asserts it checks the "TRỌN không gian hoa/thường" (whole upper/lower space) and the five cases it enumerates all happen to be the ones both engines agree on. The same class covers JSON-escaped input: `"decision":"bỏ gap-probe"` parses to a matching string for gate-card.js but does not match the raw-text awk regex (also verified). Mirror: `plugins/acceptance-gate/scripts/pre-merge-check.sh:152`.

## Chưa adversarial-verify (refuter chet)

Không có — toàn bộ 11 finding round này đều đã adversarial-verify thành công.
