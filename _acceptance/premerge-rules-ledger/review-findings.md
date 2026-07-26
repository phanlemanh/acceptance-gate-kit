# Review Findings: premerge-rules-ledger (round 1)

Informational — outside the hook-enforced evidence-report schema. Findings
below have all been adversarial-verified (reproduced or traced to exact
code/doc lines) prior to listing here.

---

## 1. [HIGH] Parse `enforcement` lệch case-sensitivity với hook: `enforcement: OFF` tắt sổ trong khi hook vẫn strict

- **File**: `/Users/manh-macmini/dev/acceptance-gate-kit/scripts/pre-merge-check.sh:147`
- **Source**: conventions

Comment tại dòng 151-152 tuyên bố "off là off toàn cục (tiền lệ hook) ...
cùng ngữ nghĩa hook". Nhưng hai parser không cùng ngữ nghĩa:

- `hooks/acceptance-evidence-gate.js:56` dùng
  `configText.match(/^enforcement\s*:\s*(strict|warn|off)\s*(?:#.*)?$/m)` —
  KHÔNG có cờ `i`, nên `enforcement: OFF` không khớp và hook giữ mặc định
  `strict` (enforce đầy đủ).
- `pre-merge-check.sh:147-150` lại `| tr '[:upper:]' '[:lower:]'` trước khi
  so, nên `OFF`/`Off` đều rơi vào nhánh `LEDGER_ENABLED=0`.

Hệ quả: một repo tiêu thụ gõ `enforcement: OFF` được hook enforce như strict
(đúng, không ai nghi ngờ) NHƯNG lớp sổ ở pre-merge tắt hoàn toàn và im lặng.
Đây là fail-open kích hoạt bằng đúng loại lỗi gõ mà `VIOLATION [config]` của
`gap_probe` đã được dựng ra để chặn — khối `gap_probe` từ chối đoán khi giá
trị lạ, khối `enforcement` thì đoán rộng hơn cả hook.

Xác nhận thực nghiệm: fixture với `enforcement: OFF` cho ra output không có
dòng ledger nào, y hệt `enforcement: off`.

Hai lối sửa nhất quán: hoặc bỏ `tr` và chỉ chấp `off` chữ thường (khớp đúng
hook), hoặc đưa cả hai parser về cùng một quy tắc và có test ghim. Hiện chưa
có case nào trong suite phủ biến thể hoa/thường của khoá này.

---

## 2. [HIGH] Ledger double-marks gap-probe when the classifier fails on some (not all) slugs → false "internal gate error" exit 2 that hides real violations

- **File**: `scripts/pre-merge-check.sh:460`
- **Source**: bugs

`gap_probe_not_enforced()` (line 216-227) is a GLOBAL one-shot that writes
`ledger_mark declared-off gap-probe`, but it is invoked from inside the
PER-SLUG loop at line 457 (`node lib/gap-probe.js classify thất bại trên
$slug`). The success path at line 460 writes `ledger_mark ran gap-probe` —
also one-shot, also global. The two one-shots are independent, so a run
where the classifier succeeds for one slug and fails for another records
BOTH names. The chokepoint at line 692 then sees `ledger_count gap-probe ==
2` and hard-exits 2.

All other gap-probe states are consistent (mode=off → 1, DIFF_READY=0 → 1,
all-succeed → 1, all-fail → 1 because the second call short-circuits on
GP_NOT_ENFORCED). The mixed case is the only hole, and it is exactly the
case line 457 has a dedicated per-slug message for.

REPRO (verified): repo with two T3 slugs `feat-a`/`feat-b`, both touched by
the PR diff, `gap_probe: advisory`, and a `node` on PATH that exits non-zero
only for the `feat-b` argument. Output:

    ran gap-probe
    VIOLATION [feat-a]: verdict= (must be PASS to merge)
    declared-off gap-probe
    GAP-PROBE: NOT ENFORCED reason=node lib/gap-probe.js classify thất bại trên feat-b
    VIOLATION [feat-b]: verdict= (must be PASS to merge)
    ...
    VIOLATION [ledger]: luật gap-probe ghi sổ 2 lần — trạng thái sổ không nhất quán
    pre-merge-check: rules ran=3 declared-off=1 expected=3
    NOTE: VIOLATION [ledger] là lỗi NỘI TẠI của cổng pre-merge ... KHÔNG phải lỗi trong thay đổi của bạn ... đừng sửa feature của bạn để né nó.
    exit=2

Two consequences, both wrong:
1. In `advisory` mode a per-slug classifier failure is designed to degrade
   to a NOTE and NOT block merge (line 224-226). The ledger converts it into
   a hard block.
2. The run had 2 genuine feature VIOLATIONs, yet `exit 2` preempts the
   `violations > 0` branch, the `pre-merge-check: N violation(s) — merge
   blocked` summary is never printed, and the emitted guidance actively
   tells the developer the failure is NOT in their change and to escalate to
   the kit maintainer instead of fixing their evidence.

Fix direction: make the two gap-probe marks mutually exclusive (decide once,
after the slug loop, from GP_NOT_ENFORCED/GP_RAN/GP_SCOPE_N) rather than
marking from inside the loop, so a partially-enforced run yields exactly one
ledger entry.

Note the same file/mirror `plugins/acceptance-gate/scripts/pre-merge-check.sh`
is byte-identical and carries the same defect.

---

## 3. [MEDIUM] Description của gói Codex bị ghi đè bằng description của gói Claude trong commit release 1.22.0

- **File**: `codex/acceptance-gate/.codex-plugin/plugin.json:4`
- **Source**: conventions

Commit c412943 thay TOÀN BỘ trường `description` của manifest Codex bằng
nguyên văn description của `.claude-plugin/plugin.json`, thay vì chỉ nối
đoạn v1.22 như đã làm với hai manifest kia.

Bản cũ (1.21.0): "Codex-native acceptance gate for AI-generated features
with contracts, evals, evidence, decision cards, gate decision skills
(approve/signoff), a gate metrics report, runtime hooks, CI re-checks, and a
coverage-scan skill (morphological-scan) ..., and a Gate-1 gap-probe block
...".
Bản mới: chuỗi lịch sử v1.16→v1.22 của gói Claude, gồm "Includes a
design-quality gate (a11y/contrast, AI-slop) for web-UI surfaces", "v1.17
adds the Layout Contract discipline + layout meter (measure_layout.js) to
ux-ui-craft".

Bằng chứng đây là copy-paste ngoài ý muốn chứ không phải quyết định:
1. Chính file đó vẫn giữ nguyên phần Codex-riêng ở dưới —
   `"shortDescription": "Evidence-backed acceptance gate for Codex"`,
   `"longDescription": "... with Codex lifecycle hooks plus CI re-checks"`,
   keyword `codex`, không có khoá `commands`. Nay `description` và
   short/longDescription mâu thuẫn nhau trong cùng một manifest.
2. `/.codex-plugin/plugin.json` (cùng lượt commit) vẫn giữ description Codex
   ngắn của nó và chỉ nối đoạn v1.22 — đúng nếp của 4 release trước
   (834eae8, c1638e2, b076732, 0bf5f10).
3. Bản cũ có nhắc gap-probe của 1.21; bản mới nhảy từ v1.20.1 sang v1.22,
   mất luôn dòng đó.

Mirror `plugins/acceptance-gate/.codex-plugin/plugin.json` đã thừa hưởng y
nguyên (overlay từ `codex/acceptance-gate/` trong `build_acceptance`), nên
chữ này đi thẳng ra marketplace.

(Related: finding #5 below, `codex/acceptance-gate/.codex-plugin/plugin.json`
line 4, restates the same root cause from an English/bugs-source pass — kept
as a separate entry rather than merged since it was surfaced by a different
adversarial-verify pass with an independent phrasing/emphasis.)

---

## 4. [MEDIUM] GUIDE.md liệt kê "Ba nguồn của declared-off" nhưng thiếu hẳn lớp suy giảm môi trường

- **File**: `GUIDE.md:585`
- **Source**: conventions

Mục mới viết: "Ba nguồn của `declared-off` là cờ `--no-t1-escape`, khoá
`gap_probe: off` trong config, và chạy không có `--base`." Danh sách đóng
này sai theo code:

`gap_probe_not_enforced()` (scripts/pre-merge-check.sh:216) gọi
`ledger_mark declared-off gap-probe` cho MỌI lý do không cưỡng chế được,
trong đó có:
- không có `node` trên máy chạy pre-merge
- thiếu `$GP_LIB` (mang cổng vào repo phải copy CẢ `lib/`)
- `node lib/gap-probe.js classify thất bại trên <slug>`
- `git diff "$BASE"...HEAD failed (no merge base? shallow/grafted clone,
  ...)` — khác hẳn "không có --base", vì ở đây base ĐÃ được truyền

Cộng thêm dòng 183: `gap_probe:` giá trị sai chính tả rơi về `off` sau khi
nổ `VIOLATION [config]` cũng ghi `declared-off gap-probe`.

Chính suite chứng minh điều này: RL12 dựng PATH cắt sạch `node` rồi ghim
(cùng RL12b) số dòng `declared-off gap-probe` — trạng thái mà GUIDE nói là
không tồn tại.

Hệ quả vận hành: một người trực CI thấy `declared-off gap-probe` sẽ đối
chiếu ba nguồn trong GUIDE, không thấy nguồn nào khớp (không ai truyền cờ,
config không off, có --base), rồi kết luận sai — trong khi nguyên nhân thật
là runner thiếu `node` hoặc repo tiêu thụ copy `scripts/` mà quên `lib/`.
Nên đổi thành danh sách mở kèm nhóm "môi trường không cho cưỡng chế", và nói
rõ rằng thiếu `--base` sinh `declared-off` cho CẢ hai luật.

(Related: finding #6 below is the same root cause surfaced by an independent
English/bugs-source pass with a slightly different emphasis — kept separate
per source.)

---

## 5. [LOW] Codex plugin description overwritten with the Claude-plugin text (advertises Claude-only commands)

- **File**: `codex/acceptance-gate/.codex-plugin/plugin.json:4`
- **Source**: bugs

The 1.22.0 bump replaced the Codex package's own description ("Codex-native
acceptance gate ... coverage-scan skill (morphological-scan) ... Gate-1
gap-probe block") with the full Claude-plugin description verbatim. The
Codex manifest now advertises Claude-only surfaces — the `/approve`,
`/signoff`, `/acceptance-report` slash commands and the design-loop
`layout-token-only` pairing — which do not exist as commands in the Codex
harness (per CLAUDE.md the gate commands are commands on the Claude side and
skills on the Codex side).

That this is unintentional is visible from the asymmetry in the same
commit: the OTHER Codex manifest, `.codex-plugin/plugin.json`, kept its
short Codex-specific text and only had the v1.22 sentence appended. Only
`codex/acceptance-gate/.codex-plugin/plugin.json` (and its synced mirror
`plugins/acceptance-gate/.codex-plugin/plugin.json`) was clobbered. No test
covers manifest description content, so this drifts silently.

---

## 6. [LOW] GUIDE enumerates three sources of `declared-off` but the script has five

- **File**: `GUIDE.md:584`
- **Source**: bugs

GUIDE.md (and the mirrored `plugins/acceptance-gate/GUIDE.md`) states: "Ba
nguồn của `declared-off` là cờ `--no-t1-escape`, khoá `gap_probe: off` trong
config, và chạy không có `--base`". The script emits `declared-off
gap-probe` from two further states that a consumer is likely to hit: missing
`node` on the CI runner (line 453) and missing `lib/gap-probe.js` (line
455) — the latter is the exact mistake README/QUICKSTART warn about when
people copy `pre-merge-check.sh` without `lib/`.

The new ledger summary line `pre-merge-check: rules ran=n declared-off=m
expected=k` is documented as machine-readable, so an operator (or a CI
guard) diagnosing `declared-off=1` from this doc will conclude a flag or
config key was set, when the real cause is a broken install that silently
disabled the gap-probe rule.

---

## 7. [LOW] ADR 0006 tuyên bố chốt bắt được "ROOT sai", nhưng lối thoát `no _acceptance/` chạy trước sổ

- **File**: `docs/adr/0006-rules-ledger-fail-closed-at-output.md:13`
- **Source**: conventions

ADR viết: "Chốt này bắt được cả lỗ CHƯA nghĩ ra vì nó không cần biết đầu vào
hỏng kiểu gì — ROOT sai, base nuốt cờ, `continue` lạc, biến rỗng, khối bị
comment nhầm đều làm một tên thiếu trong sổ."

Với `ROOT sai` thì điều đó không đúng cho trường hợp thường gặp nhất.
`scripts/pre-merge-check.sh:121` là `[ -d "$ACC" ] || { echo
"pre-merge-check: no _acceptance/ — nothing to check"; exit 0; }` — nằm
TRƯỚC mọi `ledger_mark` và trước chokepoint ở dòng 685. Một ROOT trỏ vào thư
mục hợp lệ nhưng không có `_acceptance/` (ví dụ CI đặt sai
`working-directory`, hoặc chạy từ subdir) vẫn exit 0, không một dòng
`ran`/`declared-off`, không dòng `pre-merge-check: rules ...` — đúng hình
dạng "xanh mà không chạy luật nào".

Đây là hành vi được biết (RL6a ghim đúng hai lối thoát `exit 0`), nên vấn đề
nằm ở chữ của ADR chứ không phải ở code: hoặc sửa ADR để loại `ROOT sai`
khỏi danh sách và nói rõ lối `nothing-to-check` không có sổ, hoặc dạy
consumer trong GUIDE rằng CI nên fail-closed khi thiếu dòng
`pre-merge-check: rules ran=` (hiện GUIDE giới thiệu dòng này là máy-đọc
nhưng không bảo ai dùng nó làm chốt).

---

## Chưa adversarial-verify (refuter chết)

Không có — toàn bộ 6 finding ở trên đều đã adversarial-verify (repro thực
nghiệm hoặc trace tới đúng dòng code/doc) trước khi liệt vào file này. Không
có finder nào chết trong round này.
