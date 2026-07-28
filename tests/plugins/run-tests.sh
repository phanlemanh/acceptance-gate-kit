#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
failures=0

pass() { echo "  PASS: $1"; }
fail() { echo "  FAIL: $1"; failures=$((failures + 1)); }

run() {
  local name="$1"
  shift
  echo "$name"
  if "$@"; then
    pass "$name"
  else
    fail "$name"
  fi
}

run "P01 feature-loop-codex package exists" \
  test -f "$ROOT/plugins/feature-loop-codex/.codex-plugin/plugin.json"

run "P02 Codex marketplace lists only generated Codex packages" \
  python3 - "$ROOT/.agents/plugins/marketplace.json" <<'PY'
import json, sys
data = json.load(open(sys.argv[1]))
plugins = {p["name"]: p for p in data["plugins"]}
assert plugins["acceptance-gate"]["source"]["path"] == "./plugins/acceptance-gate"
assert plugins["feature-loop-codex"]["source"]["path"] == "./plugins/feature-loop-codex"
assert plugins["design-loop"]["source"]["path"] == "./plugins/design-loop-codex"
assert "feature-loop" not in plugins
PY

run "P03 packaged acceptance-gate uses independent Codex version" \
  python3 - "$ROOT" <<'PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
root_claude = json.loads((root / ".claude-plugin/plugin.json").read_text())
overlay_codex = json.loads((root / "codex/acceptance-gate/.codex-plugin/plugin.json").read_text())
pkg_codex = json.loads((root / "plugins/acceptance-gate/.codex-plugin/plugin.json").read_text())
root_codex = json.loads((root / ".codex-plugin/plugin.json").read_text())
# Ba manifest phải KHỚP NHAU. KHÔNG ghim literal: ghim literal khiến mỗi lần
# bump đều sửa suite, mà suite đổi là code đổi thật nên evidence stale — vòng
# lặp "ký -> bump -> stale -> verify lại -> ký lại" (đã dẫm 2026-07-26).
versions = {root_claude["version"], root_codex["version"], overlay_codex["version"]}
assert len(versions) == 1, f"ba manifest lệch nhau: {versions}"
assert root_claude["version"], "version rỗng"
assert pkg_codex == overlay_codex, "run scripts/sync-plugin-packages.sh"
for rel in [
    "plugins/acceptance-gate/scripts/gate-card.js",
    "plugins/acceptance-gate/scripts/evidence-page.js",
    "plugins/acceptance-gate/scripts/recheck-evidence.js",
    "plugins/acceptance-gate/scripts/eval-coverage-lint.js",
    "plugins/acceptance-gate/scripts/config-patch.mjs",
    "plugins/acceptance-gate/lib/evidence-core.js",
    "plugins/acceptance-gate/GUIDE.md",
    # design-quality gate (1.8.0) — a package missing these ships pre-design-gate rules
    "plugins/acceptance-gate/scripts/design-gate.mjs",
    "plugins/acceptance-gate/scripts/design-scan.js",
    "plugins/acceptance-gate/lib/design-detect.mjs",
    "plugins/acceptance-gate/lib/p-tiers.json",
    "plugins/acceptance-gate/skills/acceptance/references/design-ui-check.md",
    "plugins/acceptance-gate/vendor/impeccable/engine/engines/static-html/detect-html.mjs",
    # coverage scan CT-S (1.13.0) — a package missing these ships pre-coverage rules
    "plugins/acceptance-gate/skills/morphological-scan/SKILL.md",
    "plugins/acceptance-gate/skills/morphological-scan/references/product-context-template.md",
]:
    assert (root / rel).is_file(), rel
PY

run "P04 feature-loop-codex manifest is version-aligned" \
  python3 - "$ROOT/plugins/feature-loop-codex/.codex-plugin/plugin.json" <<'PY'
import json, sys
data = json.load(open(sys.argv[1]))
assert data["name"] == "feature-loop-codex"
assert data["skills"] == "./skills/"
assert data["version"] == "1.17.0"
assert data["description"]
PY

run "P05 feature-loop-codex source and generated skill match" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
src = root / "codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md"
pkg = root / "plugins/feature-loop-codex/skills/feature-loop-codex/SKILL.md"
assert src.read_bytes() == pkg.read_bytes(), "run scripts/sync-plugin-packages.sh"
PY

run "P05b feature-loop-codex skill is Codex-native" \
  python3 - "$ROOT/plugins/feature-loop-codex/skills/feature-loop-codex/SKILL.md" <<'PY'
from pathlib import Path
import re, sys
text = Path(sys.argv[1]).read_text()
assert "name: feature-loop-codex" in text
assert "version: 1.14.0" in text
assert "Codex" in text
assert "acceptance-gate" in text
assert "spawn_agent" in text
assert "feature_loop.suite_keys" in text
assert "design-loop" in text
assert "provenance.json" in text
assert "fidelity pixel-diff" in text
assert "review-findings.md" in text
assert "PENDING-JUDGMENT" in text
assert "time_human_minutes.gate1" in text
assert "doer" in text and "grader" in text
assert "runs" in text and "pass_rate" in text
assert "baseline" in text
assert "should-NOT-fire" in text
assert "enforcement_mode" in text and "bypass_used" in text
assert "acceptance-card" in text and "evidence-page.html" in text
for needle in [
    "decisions.jsonl",
    '"type":"seal"',
    "supersedes",
    "CT1",
    "CT2",
    "D0",
    "D1",
    "D2",
    "design.surface_globs",
    "/goal",
    "/model",
    "feature_loop.models",
    "feature-loop-model-init",
    ".codex/agents",
    "feature_loop_explorer",
    "feature_loop_executor",
    "acceptance_ui_verifier",
    "acceptance_judge",
    "acceptance_reviewer",
    "acceptance_refuter",
    "custom-agent",
    "session-inherited",
    "sequential-fallback",
    "## Codex routing",
    "requested_model",
    "requested_reasoning_effort",
]:
    assert needle in text, needle
assert re.search(r"Never create or suggest a goal that reaches\s+`signed-off`", text)
assert "Workflow(" not in text
assert "feature-loop/workflows" not in text
assert ".claude/plugins/cache" not in text
PY

run "P05c feature-loop-codex model policy package matches source" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
source = root / "codex/feature-loop-codex"
package = root / "plugins/feature-loop-codex"
files = [
    "scripts/install-model-policy.mjs",
    "skills/feature-loop-model-init/SKILL.md",
    "agent-templates/feature_loop_explorer.toml",
    "agent-templates/feature_loop_executor.toml",
    "agent-templates/acceptance_ui_verifier.toml",
    "agent-templates/acceptance_judge.toml",
    "agent-templates/acceptance_reviewer.toml",
    "agent-templates/acceptance_refuter.toml",
]
for rel in files:
    assert (source / rel).is_file(), rel
    assert (package / rel).is_file(), f"run scripts/sync-plugin-packages.sh: {rel}"
    assert (source / rel).read_bytes() == (package / rel).read_bytes(), rel
for rel in [
    "skills/acceptance/SKILL.md",
    "skills/acceptance-init/references/codex-plugin-runner.mjs",
]:
    src = root / "codex/acceptance-gate" / rel
    pkg = root / "plugins/acceptance-gate" / rel
    assert src.read_bytes() == pkg.read_bytes(), f"run scripts/sync-plugin-packages.sh: {rel}"
PY

run "P06 generated design-loop has independent Codex manifest" \
  python3 - "$ROOT" <<'PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
overlay = root / "codex/design-loop"
package = root / "plugins/design-loop-codex"
manifest = json.loads((package / ".codex-plugin/plugin.json").read_text())
overlay_manifest = json.loads((overlay / ".codex-plugin/plugin.json").read_text())
skill = (package / "skills/design-subtrack/SKILL.md").read_text()
readme = (package / "README.md").read_text()
assert manifest["name"] == "design-loop"
assert manifest["skills"] == "./skills/"
assert "commands" not in manifest
assert manifest["version"] == "0.3.0"
assert manifest == overlay_manifest
for needle in ["Codex", "feature-loop-codex", "portable reference", "provenance.json"]:
    assert needle in skill or needle in readme, needle
PY

run "P07 packaged vendor engine import graph resolves (vendor/ shipped)" \
  node --input-type=module -e "
const m = await import(process.argv[1]);
if (typeof m.detectHtml !== 'function') throw new Error('detectHtml missing');
" "file://$ROOT/plugins/acceptance-gate/vendor/impeccable/engine/engines/static-html/detect-html.mjs"

run "P08 every \${CLAUDE_PLUGIN_ROOT} path in commands/skills exists in ITS plugin root" \
  python3 - "$ROOT" <<'PY'
# ${CLAUDE_PLUGIN_ROOT} resolves to the root of the plugin whose command/skill
# is running — a path that only resolves against the KIT root double-nests at
# runtime (the exact /design-init MODULE_NOT_FOUND failure this guards against).
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
plugin_roots = [
    root,                                   # acceptance-gate (source ./)
    root / "feature-loop",
    root / "design-loop",
    root / "codex/acceptance-gate",
    root / "codex/feature-loop-codex",
    root / "codex/design-loop",
]
pat = re.compile(r"\$\{CLAUDE_PLUGIN_ROOT\}/([A-Za-z0-9._/-]+)")
bad = []
for proot in plugin_roots:
    for sub in ("commands", "skills"):
        d = proot / sub
        if not d.is_dir():
            continue
        for md in d.rglob("*.md"):
            for rel in pat.findall(md.read_text(encoding="utf-8")):
                rel = rel.rstrip(".,)`'\"")
                if "<" in rel or "*" in rel:
                    continue  # placeholder, not a literal path
                if "." not in rel.split("/")[-1]:
                    continue  # only assert file-looking paths
                if not (proot / rel).exists():
                    bad.append(f"{md.relative_to(root)} -> {rel}")
assert not bad, "unresolvable ${CLAUDE_PLUGIN_ROOT} paths:\n" + "\n".join(bad)
PY

run "P20 lane lookup table consistent across skills" \
  python3 - "$ROOT" <<'PY'
import sys, pathlib
root = pathlib.Path(sys.argv[1])
fl = (root / "feature-loop/skills/feature-loop/SKILL.md").read_text()
ds = (root / "design-loop/skills/design-subtrack/SKILL.md").read_text()
assert fl.count("| **CT1") == 1 and fl.count("| **CT2") == 1, "bảng tra CT1/CT2 phải có đúng 1 lần"
assert "design_tier" not in fl and "design_tier" not in ds, "không được lưu field tier"
assert "provenance.json" in fl and "design.fidelity" in fl, "điều kiện CT2 phải máy-đọc"
assert "CT2" in ds and "CT1" in ds, "design-subtrack phải tham chiếu công tắc"
assert "--require-html" in fl and "--require-html" in ds, "lane nhẹ phải khai flag require-html"
PY

run "P21 decisions.jsonl plumbing shipped in package" \
  python3 - "$ROOT" <<'PY'
import sys, pathlib
root = pathlib.Path(sys.argv[1])
assert "decisions.jsonl" in (root / "scripts/gate-card.js").read_text()
assert "decisions.jsonl" in (root / "plugins/acceptance-gate/scripts/gate-card.js").read_text(), "chạy scripts/sync-plugin-packages.sh"
assert "decisions_plain" in (root / "commands/acceptance-card.md").read_text()
assert "decisions.jsonl" in (root / "feature-loop/skills/feature-loop/SKILL.md").read_text()
PY

run "P22 Codex overlay manifests and generated outputs exist" \
  python3 - "$ROOT" <<'PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])

assert json.loads((root / "codex/feature-loop-codex/.codex-plugin/plugin.json").read_text())["version"] == "1.17.0"
assert json.loads((root / "codex/design-loop/.codex-plugin/plugin.json").read_text())["version"] == "0.3.0"
# version của acceptance-gate không ghim literal ở đây (xem P03); chỉ kiểm hai
# plugin có version ĐỘC LẬP là còn đúng số của chúng.
assert json.loads((root / "feature-loop/.claude-plugin/plugin.json").read_text())["version"] == "1.17.0"
assert "machine: 'haiku'" in (root / "feature-loop/workflows/acceptance-verify.js").read_text()
assert "judge: 'sonnet'" in (root / "feature-loop/workflows/acceptance-verify.js").read_text()
assert "executor: null" in (root / "feature-loop/workflows/execute-parallel.js").read_text()
assert (root / "plugins/design-loop-codex/.codex-plugin/plugin.json").is_file()
PY

run "P23 generated Codex packages contain no Claude package surfaces" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
for rel in ["plugins/acceptance-gate", "plugins/feature-loop-codex", "plugins/design-loop-codex"]:
    package = root / rel
    assert not (package / ".claude-plugin").exists(), rel
    assert not (package / "commands").exists(), rel
PY

run "P24 acceptance-init ships runner-backed strict defaults" \
  python3 - "$ROOT/plugins/acceptance-gate/skills/acceptance-init/SKILL.md" <<'PY'
import sys
from pathlib import Path
text = Path(sys.argv[1]).read_text()
for needle in ["codex-plugin-runner.mjs", "recheck: strict", "require_human_commit: true"]:
    assert needle in text, needle
assert "CLAUDE_PLUGIN_ROOT" not in text
PY

run "P25 Codex hook manifest uses native plugin root without changing Claude hook" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
codex_hooks = (root / "plugins/acceptance-gate/hooks/hooks.json").read_text()
claude_hooks = (root / "hooks/hooks.json").read_text()
assert "${PLUGIN_ROOT}" in codex_hooks
assert "acceptance-evidence-gate-codex.js" in codex_hooks
assert "${CLAUDE_PLUGIN_ROOT}" in claude_hooks
assert "acceptance-evidence-gate.js" in claude_hooks
PY

run "P26 Acceptance Gate exposes native helper skills" \
  python3 - "$ROOT/plugins/acceptance-gate/skills" <<'PY'
import sys
from pathlib import Path
skills = Path(sys.argv[1])
for name in ["acceptance-init", "acceptance-card", "acceptance-status", "acceptance", "approve", "signoff", "acceptance-report"]:
    assert (skills / name / "SKILL.md").is_file(), name
main = (skills / "acceptance/SKILL.md").read_text()
assert "acceptance-init" in main
assert "acceptance-card" in main
assert "apply_patch adapter" in main
for needle in [
    "acceptance_ui_verifier",
    "acceptance_judge",
    "acceptance_reviewer",
    "acceptance_refuter",
    "## Codex routing",
]:
    assert needle in main, needle
card = (skills / "acceptance-card/SKILL.md").read_text()
assert "card-plain.json" in card and "evidence-page.html" in card
status = (skills / "acceptance-status/SKILL.md").read_text()
assert "PENDING-JUDGMENT" in status and "Gate 2" in status
appr = (skills / "approve/SKILL.md").read_text()
assert "approved_by" in appr and "decisions.jsonl" in appr and "gate1_skipped" in appr
sign = (skills / "signoff/SKILL.md").read_text()
assert "require_human_commit" in sign and "human_override" in sign and "pre-merge-check.sh" in sign
rep = (skills / "acceptance-report/SKILL.md").read_text()
assert "baseline_minutes" in rep and "time_human_minutes" in rep and "Read-only" in rep
PY

run "P30 Claude decision commands ship and keep their invariants" \
  python3 - "$ROOT/commands" <<'PY'
import sys
from pathlib import Path
cmds = Path(sys.argv[1])
for name in ["acceptance-init", "acceptance-status", "acceptance-card", "approve", "signoff", "acceptance-report"]:
    assert (cmds / f"{name}.md").is_file(), name
appr = (cmds / "approve.md").read_text()
for needle in ["approved_by", "time_human_minutes.gate1", "decisions.jsonl", "gate1_skipped", "/acceptance-card"]:
    assert needle in appr, needle
sign = (cmds / "signoff.md").read_text()
for needle in ["require_human_commit", "human_override", "time_human_minutes.gate2", "pre-merge-check.sh", "own commit"]:
    assert needle in sign, needle
rep = (cmds / "acceptance-report.md").read_text()
for needle in ["baseline_minutes", "time_human_minutes", "gate1_skipped", "Read-only"]:
    assert needle in rep, needle
PY

run "P27 Design Loop exposes native portable-reference skills" \
  python3 - "$ROOT/plugins/design-loop-codex" <<'PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
manifest = json.loads((root / ".codex-plugin/plugin.json").read_text())
assert manifest["version"] == "0.3.0"
assert not (root / "commands").exists()
assert not (root / ".claude-plugin").exists()
for name in ["design-subtrack", "design-init", "design-mockup", "design-evidence", "design-push-status"]:
    assert (root / "skills" / name / "SKILL.md").is_file(), name
text = "\n".join(path.read_text() for path in (root / "skills").glob("*/SKILL.md"))
for needle in ["portable reference", "provenance.json", "BLOCKED", "No blind VLM judge"]:
    assert needle in text, needle
assert "invoke `/design-sync`" not in text
assert "invoke `/design-login`" not in text
PY

run "P28 README and GUIDE document the verified Codex install path" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
text = (root / "README.md").read_text() + "\n" + (root / "GUIDE.md").read_text()
for needle in [
    "codex plugin marketplace add",
    "acceptance-gate@acceptance-gate-kit",
    "feature-loop-codex@acceptance-gate-kit",
    "design-loop@acceptance-gate-kit",
    "fresh task",
    "hook trust",
    "0.139.0",
    "Claude Design is unavailable in Codex",
    "feature-loop-model-init",
]:
    assert needle in text, needle
PY

run "P29 gap-probe S1 wired across mirrors (1.18)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
gc = (root / "scripts/gate-card.js").read_text()
assert "gap-probe" in gc and "Phản biện context sạch" in gc and "gap_probe" in gc
assert (root / "plugins/acceptance-gate/scripts/gate-card.js").read_text() == gc, "chạy scripts/sync-plugin-packages.sh"
fl = (root / "feature-loop/skills/feature-loop/SKILL.md").read_text()
assert "gap-probe" in fl and "bỏ gap-probe" in fl and "models.critic" in fl.replace("`", "")
flc = (root / "codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md").read_text()
assert "gap-probe" in flc and "bỏ gap-probe" in flc
assert "gap_probe" in (root / "commands/acceptance-card.md").read_text()
assert "gap_probe" in (root / "codex/acceptance-gate/skills/acceptance-card/SKILL.md").read_text()
assert "Gap-probe S1" in (root / "GUIDE.md").read_text()
PY

run "P30 plugins/ mirror in sync with sources (sync --check)" \
  bash "$ROOT/scripts/sync-plugin-packages.sh" --check

run "P31 Codex human-gate skills locked from implicit invocation; card stays open" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
LOCKED = ["approve", "signoff", "acceptance-init", "acceptance-status", "acceptance-report"]
for base in ["codex/acceptance-gate/skills", "plugins/acceptance-gate/skills"]:
    for name in LOCKED:
        y = root / base / name / "agents/openai.yaml"
        assert y.exists(), f"{y} missing"
        t = y.read_text()
        assert "allow_implicit_invocation: false" in t, f"{y} lacks policy lock"
    card = root / base / "acceptance-card/agents/openai.yaml"
    assert not card.exists() or "allow_implicit_invocation: false" not in card.read_text(), \
        "acceptance-card must stay model-invocable (approve/signoff invoke it)"
PY

run "P32 Claude gate commands locked from model invocation; card stays open" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
LOCKED = ["approve", "signoff", "acceptance-init", "acceptance-status", "acceptance-report"]
for name in LOCKED:
    t = (root / "commands" / f"{name}.md").read_text()
    assert "disable-model-invocation: true" in t, f"commands/{name}.md lacks lock"
card = (root / "commands/acceptance-card.md").read_text()
assert "disable-model-invocation" not in card, \
    "acceptance-card must stay model-invocable (feature-loop invokes it at both Gates)"
PY

run "P33 no source file globs the plugin cache (resolve-plugin.mjs is the only path)" \
  python3 - "$ROOT" <<'PY'
import sys, re
from pathlib import Path
root = Path(sys.argv[1])
# The mirror under plugins/ is generated; check the SOURCES only.
areas = ["skills", "feature-loop", "design-loop", "codex", "commands", "hooks", "lib", "scripts"]
files = [p for a in areas for p in (root / a).rglob("*")
         if p.is_file() and p.suffix in {".md", ".js", ".mjs", ".sh", ".json"}]
files += [root / f for f in ("README.md", "GUIDE.md", "QUICKSTART.md")]
ALLOW = {"feature-loop/scripts/resolve-plugin.mjs"}  # documents the pattern it replaces
offenders = []
for p in files:
    if not p.exists():
        continue
    rel = str(p.relative_to(root))
    if rel in ALLOW:
        continue
    text = p.read_text(encoding="utf-8", errors="replace")
    if re.search(r"plugins/cache", text):
        offenders.append(rel)
assert files, "sanity: globbed zero source files — the scan itself is broken"
assert not offenders, (
    "cache-glob resurfaced in: " + ", ".join(offenders) +
    " — use ${CLAUDE_PLUGIN_ROOT}/${PLUGIN_ROOT} for your own plugin, or "
    "feature-loop/scripts/resolve-plugin.mjs for a sibling (ls order is lexical: "
    "it ranks 1.9.2 above 1.20.1). See docs/adr/0003.")
PY

run "P34 resolve-plugin.mjs ships in BOTH editions from one source" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
src = (root / "feature-loop/scripts/resolve-plugin.mjs").read_text()
pkg = root / "plugins/feature-loop-codex/scripts/resolve-plugin.mjs"
assert pkg.exists(), "Codex package missing resolve-plugin.mjs — run scripts/sync-plugin-packages.sh"
assert pkg.read_text() == src, "Codex copy drifted from feature-loop/scripts/resolve-plugin.mjs"
PY

run "P35 CI T1-escape backstop is ON, PR-guarded, and fails loud when skipped" \
  python3 - "$ROOT" <<'PY'
import sys, re
from pathlib import Path
wf = (Path(sys.argv[1]) / ".github/workflows/gate.yml").read_text()
step = re.search(r"- name: T1-escape backstop\n(.*?)(?=\n      - name:|\Z)", wf, re.S)
assert step, "T1-escape backstop step missing or renamed"
body = step.group(1)
# Enabled, not commented back out.
assert not re.search(r"^\s*#\s*- name: T1-escape", wf, re.M), "backstop step is commented out"
# Only meaningful on a PR — a push has no base branch to diff against.
assert "github.event_name == 'pull_request'" in body, "backstop must be guarded to pull_request"
assert 'github.base_ref' in body, "backstop must derive its base from base_ref"
# pre-merge-check treats an unresolvable base as skip+clean (right for consumer
# repos). On the kit that silent fail-open is the very hole the backstop exists
# to close, so CI must promote the skip to an error.
assert "backstop skipped" in body and "exit 1" in body, \
    "a skipped backstop must fail the job, not pass quietly"
# Full history: the stale-guard and signoff-provenance checks read git log.
assert "fetch-depth: 0" in wf, "gate job needs fetch-depth: 0"
# Từ khi mode `required` có sàn fail-CLOSED (d-128), chạy pre-merge KHÔNG có base
# là VIOLATION — nên một job không truyền base thì đỏ vĩnh viễn. Răng này giữ CI
# khỏi rơi lại vào đó, và giữ luôn cả hai nhánh sự kiện.
assert "PRE_MERGE_BASE" in wf, "gate job must always resolve a PR base (fail-closed floor)"
assert "github.base_ref" in wf and "HEAD~1" in wf, \
    "base must be resolved for BOTH events: PR -> base_ref, push -> HEAD~1"
PY

# ── P38: parity CẤU TRÚC — gate-card phải dùng lib, không giữ luật riêng ────
# Contract v2 chết vì luật bị tách làm hai bản, parity giữ bằng comment. Đây là
# răng máy cho lời hứa "một cài đặt" — comment không kiểm được, grep thì được.
echo "P38 gate-card.js dung lib/gap-probe.js, khong con regex descope rieng"
GC_SRC="$(cat "$ROOT/scripts/gate-card.js")"
case "$GC_SRC" in
  *"require('../lib/gap-probe.js')"*|*'require("../lib/gap-probe.js")'*)
    pass "P38a gate-card require lib/gap-probe.js" ;;
  *)
    fail "P38a gate-card require lib/gap-probe.js" ;;
esac
if printf '%s' "$GC_SRC" | grep -qF 'bỏ gap-probe/i'; then
  fail "P38b gate-card khong con literal regex descope"
else
  pass "P38b gate-card khong con literal regex descope"
fi

# ── P39: acceptance-init parity 2 harness ──────────────────────────────────
# CLAUDE.md coi parity Claude↔Codex là bất biến. Repo khởi tạo bằng Codex mà
# config không có khoá `gap_probe` thì luật im lặng ở đúng những repo đó.
echo "P39 acceptance-init parity 2 harness: khoa gap_probe + 3 mode"
for f in "$ROOT/commands/acceptance-init.md" \
         "$ROOT/codex/acceptance-gate/skills/acceptance-init/SKILL.md"; do
  n="$(basename "$(dirname "$f")")/$(basename "$f")"
  if grep -q 'gap_probe:' "$f"; then pass "P39[$n:key]"; else fail "P39[$n:key]"; fi
  if grep -q 'required | advisory | off' "$f"; then pass "P39[$n:modes]"; else fail "P39[$n:modes]"; fi
done

# ── P41: miễn trừ plugins/** trong t1_skip_globs KHÔNG được là lỗ ───────────
# Allowlist mà không có ca NGOÀI danh sách là allowlist biến fail-loud thành
# fail-silent. Răng T1-escape bỏ qua plugins/ được CHỈ VÌ P30 canh mirror==nguồn
# ở luật khác — case này chứng minh luật khác đó thật sự sống.
echo "P41 sua tay mirror -> sync --check VAN do"
P41T="$(mktemp -d)"
# KHONG nuot loi cua cp: fixture hong ma van "pass" vi sync tra exit 127 la
# xanh-rong. Phai co doi chung duong (fixture dung) truoc khi tin doi chung am.
cp -R "$ROOT/." "$P41T/"
if [ ! -f "$P41T/scripts/sync-plugin-packages.sh" ] || [ ! -f "$P41T/plugins/acceptance-gate/lib/gap-probe.js" ]; then
  fail "P41 fixture hong (thieu file sau khi cp)"
else
  # doi chung DUONG: ban sao nguyen ven phai XANH
  if bash "$P41T/scripts/sync-plugin-packages.sh" --check >/dev/null 2>&1; then
    printf '\n// tiêm\n' >> "$P41T/plugins/acceptance-gate/lib/gap-probe.js"
    P41OUT="$(bash "$P41T/scripts/sync-plugin-packages.sh" --check 2>&1)"; P41ST=$?
    if [ "$P41ST" -ne 0 ] && printf '%s' "$P41OUT" | grep -q 'gap-probe.js'; then
      pass "P41 mirror drift bi bat va NEU TEN file lech"
    else
      fail "P41 mirror drift bi bat va NEU TEN file lech (exit=$P41ST out=$P41OUT)"
    fi
  else
    fail "P41 doi chung duong that bai — ban sao nguyen ven da lech san"
  fi
fi
rm -rf "$P41T"

# ── P42/P45: ghim version bằng literal khiến mỗi lần bump đều sửa suite ─────
# Hai case dưới chạy CẢ suite này trong một bản sao — mà bản sao cũng chứa
# chúng, nên không có chốt thì đệ quy vô hạn (đã dẫm). Cờ dưới đây do lần gọi
# LỒNG đặt; ở lần lồng, hai case tự bỏ qua.
if [ "${PLUGINS_SUITE_NESTED:-0}" = "1" ]; then
  echo "P42/P45 bo qua (dang chay long ben trong ban sao)"
else
echo "P42 mot manifest lech so -> suite phai DO"
# Assert AM tinh mot minh la xanh-rong: cp hong / python loi / suite khong ton
# tai deu cho exit khac 0 y het "da bat duoc drift". Phai co DOI CHUNG DUONG,
# giong P41. (Round 1 sua P41 dung cach roi khong ap cho P42 ngay ben duoi.)
P42T="$(mktemp -d)"; cp -R "$ROOT/." "$P42T/"
if [ ! -f "$P42T/tests/plugins/run-tests.sh" ] || [ ! -f "$P42T/.codex-plugin/plugin.json" ]; then
  fail "P42 fixture hong (thieu file sau khi cp)"
elif ! PLUGINS_SUITE_NESTED=1 bash "$P42T/tests/plugins/run-tests.sh" >/dev/null 2>&1; then
  fail "P42 doi chung duong that bai — ban sao nguyen ven da do san"
else
  if python3 - "$P42T" <<'PYX'
import json,sys,pathlib
p=pathlib.Path(sys.argv[1])/".codex-plugin/plugin.json"
d=json.loads(p.read_text()); d["version"]="9.9.9"; p.write_text(json.dumps(d,indent=2)+"\n")
PYX
  then
    P42OUT="$(PLUGINS_SUITE_NESTED=1 bash "$P42T/tests/plugins/run-tests.sh" 2>&1)"; P42ST=$?
    # Ghim ĐÚNG assertion nao ban: "exit khac 0" mot minh van xanh neu P03 hong
    # va mot regression khac lam do suite — test canh khong gi ca.
    if [ "$P42ST" -ne 0 ] && printf '%s' "$P42OUT" | grep -q 'ba manifest lệch nhau'; then
      pass "P42 manifest lech bi bat DUNG boi assertion cua P03"
    else
      fail "P42 manifest lech bi bat DUNG boi assertion cua P03 (exit=$P42ST)"
    fi
  else
    fail "P42 buoc tiem drift that bai"
  fi
fi
rm -rf "$P42T"

echo "P45 bump CA BA manifest + sync -> khong file nao duoi tests/ phai sua"
P45T="$(mktemp -d)"; cp -R "$ROOT/." "$P45T/"
# Buoc tiem KHONG duoc nuot loi: hong o file dau tien thi khong bump gi ca,
# sync thanh no-op, shasum truoc == sau, suite xanh — PASS ma khong kiem gi.
P45_MUT_OK=1
python3 - "$P45T" <<'PYX' || P45_MUT_OK=0
import json,sys,pathlib
root=pathlib.Path(sys.argv[1])
for rel in [".claude-plugin/plugin.json",".codex-plugin/plugin.json","codex/acceptance-gate/.codex-plugin/plugin.json"]:
    p=root/rel; d=json.loads(p.read_text()); d["version"]="9.9.9"; p.write_text(json.dumps(d,indent=2)+"\n")
PYX
# doi chung: ca ba manifest PHAI thuc su mang so moi
P45_BUMPED="$(grep -l '9\.9\.9' "$P45T/.claude-plugin/plugin.json" "$P45T/.codex-plugin/plugin.json" "$P45T/codex/acceptance-gate/.codex-plugin/plugin.json" 2>/dev/null | wc -l | tr -d ' ')"
# Đo bằng CHỤP TRƯỚC/SAU chứ không bằng `git diff` với HEAD: bản sao mang theo
# mọi thay đổi chưa commit của cây làm việc, nên git diff sẽ báo bẩn vì lý do
# không liên quan tới bump (đã dẫm).
# KHONG so shasum tests/ truoc-sau sync: `--write` chi ghi vao $ROOT/plugins nen
# phep so do HANG DUNG — mot assertion khong bao gio do duoc, gay hieu nham ve
# muc bao ve. Rang THAT cua P45 la lan chay suite long ben duoi (da kiem bang
# dot bien: khoi phuc literal "1.21.0" o P03 -> P45 do).
if ! bash "$P45T/scripts/sync-plugin-packages.sh" --write >/dev/null 2>&1; then
  P45_MUT_OK=0
fi
if [ "$P45_MUT_OK" -eq 1 ] && [ "$P45_BUMPED" = "3" ] \
   && PLUGINS_SUITE_NESTED=1 bash "$P45T/tests/plugins/run-tests.sh" >/dev/null 2>&1; then
  pass "P45 bump ba manifest khong cham suite"
else
  fail "P45 bump ba manifest khong cham suite (mut_ok=$P45_MUT_OK bumped=$P45_BUMPED)"
fi
rm -rf "$P45T"
fi

run "P40 gate.yml: push tat rang T1-escape, PR khong, khong nhanh nao thieu base" \
  python3 - "$ROOT" <<'P40PY'
import sys
from pathlib import Path
wf = (Path(sys.argv[1]) / ".github/workflows/gate.yml").read_text()
assert "--no-t1-escape" in wf, "nhanh push phai tat rang T1-escape"
# Nhanh PR KHONG duoc mang co: tien de "PR phai kem artifact" dung o do.
# Loc theo DONG GAN T1_ESCAPE_FLAG, khong theo base_ref: nhanh PR dat co tren
# mot dong KHONG chua base_ref, nen assert cu khong the do (da kiem bang dot
# bien: doi nhanh PR thanh --no-t1-escape van xanh). Cung lop loi voi P43.
flag_lines = [l.strip() for l in wf.splitlines() if "T1_ESCAPE_FLAG=" in l]
assert len(flag_lines) == 2, f"phai co dung 2 nhanh gan co, thay: {flag_lines}"
on  = [l for l in flag_lines if "--no-t1-escape" in l]
off = [l for l in flag_lines if "--no-t1-escape" not in l]
assert len(on) == 1 and len(off) == 1, f"dung MOT nhanh tat, MOT nhanh giu bat: {flag_lines}"
# nhanh tat phai nam trong ve `else` (push); nhanh giu bat trong ve pull_request
i_if = wf.index('github.event_name }}" = "pull_request"')
i_else = wf.index("else", i_if)
i_on = wf.index(on[0])
assert i_on > i_else, "nhanh TAT rang phai o ve else (push), khong phai ve pull_request"
# Khong loi goi pre-merge-check nao duoc thieu base: thieu base la VIOLATION
# gap-probe theo docs/adr/0004.
assert "PRE_MERGE_BASE" in wf, "phai resolve base cho moi su kien"
P40PY

run "P43 GUIDE noi bump version thuoc S3" \
  python3 - "$ROOT" <<'P43PY'
import sys
from pathlib import Path
g = (Path(sys.argv[1]) / "GUIDE.md").read_text()
# Ghim CAU chu the, khong dung cua so ky tu quanh tu khoa: cua so ±600 bat phai
# chu "S3"/"stale" cua doan KHAC nen no khong phan biet duoc (da do: go han
# "thuoc S3" van xanh). Assertion khong phan biet duoc la assertion khong song.
assert "Bump version + sync mirror thuộc S3" in g, \
    "GUIDE phai gan bump version vao S3 bang mot cau ro rang"
assert "huỷ chính chữ ký" in g, \
    "GUIDE phai neu HE QUA: bump sau Cong 2 huy chinh chu ky vua lay"
P43PY

run "P44 acceptance-init CA HAI harness nhac co cho job push" \
  python3 - "$ROOT" <<'P44PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
for rel in ["commands/acceptance-init.md",
            "codex/acceptance-gate/skills/acceptance-init/SKILL.md"]:
    t = (root / rel).read_text()
    assert "--no-t1-escape" in t, f"{rel} chua nhac co cho job push"
# Parity GUIDE <-> acceptance-init: consumer chep snippet tu GUIDE §Wire CI, nen
# thieu co o day la ho dinh dung trieu chung feature nay sinh ra de chua.
g = (root / "GUIDE.md").read_text()
assert "--no-t1-escape" in g, "GUIDE (muc wire CI) chua nhac co cho job push"
P44PY

# ── P46: sync mode la = loi cung, KHONG duoc am tham chuyen sang GHI ────────
# `--chek` tung in "Synced …", thoat 0, VA xoa luon drift — mot loi go bien
# lenh KIEM thanh lenh GHI. Day la chot duy nhat bien minh cho mien tru
# plugins/** khoi cong, nen no fail-open la ca mien tru do mat can cu.
echo "P46 sync-plugin-packages: mode la = exit 2, KHONG ghi de"
P46T="$(mktemp -d)"; cp -R "$ROOT/." "$P46T/"
if [ ! -f "$P46T/scripts/sync-plugin-packages.sh" ]; then
  fail "P46 fixture hong"
else
  printf '\n// tiêm P46\n' >> "$P46T/plugins/acceptance-gate/lib/gap-probe.js"
  # DOI CHUNG DUONG: --check that su con song trong ban sao (phai DO vi vua tiem)
  if bash "$P46T/scripts/sync-plugin-packages.sh" --check >/dev/null 2>&1; then
    fail "P46 doi chung duong that bai — --check khong bat duoc drift vua tiem"
  else
    P46OUT="$(bash "$P46T/scripts/sync-plugin-packages.sh" --chek 2>&1)"; P46ST=$?
    P46LEFT="$(grep -c 'tiêm P46' "$P46T/plugins/acceptance-gate/lib/gap-probe.js" 2>/dev/null || echo 0)"
    if [ "$P46ST" -eq 2 ] && [ "$P46LEFT" = "1" ] && printf '%s' "$P46OUT" | grep -q 'unknown option'; then
      pass "P46 mode la: exit 2, ghim thong diep, KHONG ghi de"
    else
      fail "P46 mode la: exit 2, ghim thong diep, KHONG ghi de (exit=$P46ST con_lai=$P46LEFT out=$P46OUT)"
    fi
  fi
fi
rm -rf "$P46T"

# ── P47: chốt --check phải thấy cả entry ẨN dưới plugins/ ───────────────────
# Glob bỏ qua dotfile, còn `match_globs` của pre-merge-check dùng `case` nên
# `plugins/**` VẪN khớp `plugins/.x/y.js` — chốt hẹp hơn miễn trừ đúng ở chỗ
# khó thấy nhất.
echo "P47 entry AN duoi plugins/ phai lam --check no"
P47T="$(mktemp -d)"; cp -R "$ROOT/." "$P47T/"
if [ ! -f "$P47T/scripts/sync-plugin-packages.sh" ]; then
  fail "P47 fixture hong"
elif ! bash "$P47T/scripts/sync-plugin-packages.sh" --check >/dev/null 2>&1; then
  fail "P47 doi chung duong that bai — ban sao nguyen ven da lech san"
else
  mkdir -p "$P47T/plugins/.rogue"; printf 'x\n' > "$P47T/plugins/.rogue/evil.js"
  P47OUT="$(bash "$P47T/scripts/sync-plugin-packages.sh" --check 2>&1)"; P47ST=$?
  if [ "$P47ST" -ne 0 ] && printf '%s' "$P47OUT" | grep -q 'rogue'; then
    pass "P47 entry an bi bat va NEU TEN"
  else
    fail "P47 entry an bi bat va NEU TEN (exit=$P47ST out=$P47OUT)"
  fi
fi
rm -rf "$P47T"

# ── P48: chu ky ledger_mark — them khoi luat moi ma quen khai so -> suite DO ─
# AC-7c cua premerge-rules-ledger: dem ten duy nhat o call-site ledger_mark va
# so BANG voi EXPECTED, tren ca nguon (scripts/) lan mirror (plugins/). P30 canh
# mirror==nguon; day la chieu KHAC — "them khoi luat ma quen khai so" — ma P30
# khong thay vi hai ban van y het nhau.
echo "P48 ledger_mark call-site == EXPECTED, nguon lan mirror"
p48_names() {
  grep -E 'ledger_mark (ran|declared-off) ' "$1" | grep -v 'ledger_mark()' \
    | sed -E 's/.*ledger_mark (ran|declared-off) ([a-z0-9-]+).*/\2/' | sort -u | tr '\n' ' '
}
p48_exp() { sed -n 's/^LEDGER_EXPECTED="\(.*\)"$/\1/p' "$1" | tr ' ' '\n' | sort -u | tr '\n' ' '; }
P48OK=1
for f in "$ROOT/scripts/pre-merge-check.sh" "$ROOT/plugins/acceptance-gate/scripts/pre-merge-check.sh"; do
  if [ ! -f "$f" ]; then echo "     thieu $f"; P48OK=0; continue; fi
  if [ -z "$(p48_exp "$f")" ]; then echo "     EXPECTED rong/khong parse duoc: $f"; P48OK=0; continue; fi
  if [ "$(p48_names "$f")" != "$(p48_exp "$f")" ]; then
    echo "     call-site lech EXPECTED: $f"
    echo "       call-site: [$(p48_names "$f")]  EXPECTED: [$(p48_exp "$f")]"
    P48OK=0
  fi
done
# Doi chung dot bien: them mot call-site ten moi vao ban sao -> phep so phai
# LECH. Thieu no thi P48 chi chung minh "hai chuoi hom nay bang nhau", khong
# chung minh phep so con song (bat bien #4 CLAUDE.md).
P48CP="$(mktemp)"
{ cat "$ROOT/scripts/pre-merge-check.sh"; printf '\nledger_mark ran khoi-moi\n'; } > "$P48CP"
if [ "$(p48_names "$P48CP")" = "$(p48_exp "$P48CP")" ]; then
  echo "     dot bien KHONG bi phat hien — phep so da chet"
  P48OK=0
fi
rm -f "$P48CP"
if [ "$P48OK" -eq 1 ]; then
  pass "P48 chu ky ledger_mark khop EXPECTED (nguon + mirror + dot bien)"
else
  fail "P48 chu ky ledger_mark khop EXPECTED (nguon + mirror + dot bien)"
fi

# ── P49: description cua goi Codex khong duoc la ban sao cua goi Claude ─────
# Release 1.22.0 da dan: bump chep NGUYEN VAN description Claude de len manifest
# Codex, nen goi Codex quang cao /approve, /signoff, /acceptance-report (ben
# Codex la SKILL, khong phai command — CLAUDE.md bat bien 3) va ca lan design
# ux-ui-craft. Khong test nao phu noi dung description nen no troi im lang.
run "P49 description goi Codex giu ban sac Codex, khong phai ban sao Claude" \
  python3 - "$ROOT" <<'PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
claude = json.loads((root / ".claude-plugin/plugin.json").read_text())["description"]
# Overlay + mirror cua no la goi Codex-native: PHAI tu nhan la Codex. Root
# .codex-plugin doc mot ban mo ta trung tinh (giu nguyen qua 4 release truoc),
# nen chi doi hai dieu kien con lai — dung noi long ca cum vi mot file.
NATIVE = {"codex/acceptance-gate/.codex-plugin/plugin.json",
          "plugins/acceptance-gate/.codex-plugin/plugin.json"}
for rel in sorted(NATIVE | {".codex-plugin/plugin.json"}):
    d = json.loads((root / rel).read_text())["description"]
    assert d != claude, f"{rel}: description la ban sao NGUYEN VAN cua goi Claude"
    if rel in NATIVE:
        assert "Codex" in d, f"{rel}: description khong nhac Codex — mat ban sac goi"
    # Cac be mat CHI co ben Claude khong duoc quang cao trong goi Codex. Ghim
    # CUM DAC TRUNG, khong ghim manh vun: ban Codex hop le co quyen noi "gate
    # decision skills (approve/signoff)" — do la SKILL, dung theo bat bien 3
    # CLAUDE.md; chinh chuoi "/signoff" trong do tung lam bo loc nay bao dong
    # gia o vong sua dau.
    for claude_only in ["gate decision commands", "ux-ui-craft",
                        "Layout Contract", "design-quality gate", "measure_layout"]:
        assert claude_only not in d, f"{rel}: quang cao be mat chi-co-Claude {claude_only!r}"
PY

# ── P50: sync khong nhan THUA argv — thu tu tham so go nham khong doi nghia ─
# `--write --check` tung chay duong GHI (chi $1 duoc soi): xoa drift dang can
# bat roi bao thanh cong — cung lop fail-open voi P46, cua thu hai. Chot argv
# no TRUOC moi hanh dong nen chay truc tiep tren script that la an toan.
echo "P50 sync tu choi argv thua, khong am tham chay mode dau"
P50A="$(bash "$ROOT/scripts/sync-plugin-packages.sh" --write --check 2>&1)"; P50AST=$?
P50B="$(bash "$ROOT/scripts/sync-plugin-packages.sh" --check --write 2>&1)"; P50BST=$?
if [ "$P50AST" -eq 2 ] && printf '%s' "$P50A" | grep -q 'unexpected argument --check' \
   && [ "$P50BST" -eq 2 ] && printf '%s' "$P50B" | grep -q 'unexpected argument --write'; then
  # doi chung duong: mot mode don van chay binh thuong
  if bash "$ROOT/scripts/sync-plugin-packages.sh" --check >/dev/null 2>&1; then
    pass "P50 argv thua exit 2 + neu ten tham so; mode don van xanh"
  else
    fail "P50 doi chung duong that bai — --check don le do (mirror drift?)"
  fi
else
  fail "P50 argv thua khong bi chan (a=$P50AST b=$P50BST)"
fi

# ── P51: suite tests/workflows phai duoc wire vao CI + config ───────────────
# AC-13 cua s4-scope-triage: suite ton tai tu Dot 5 nhung mo coi — khong config
# nao tro toi, khong CI nao chay. Eval cua feature nay dung no lam executor, nen
# wiring LA deliverable, khong phai loi hua.
echo "P51 tests/workflows wired vao gate.yml + config.yaml"
P51OK=1
P51GATE="$ROOT/.github/workflows/gate.yml"
P51CFG="$ROOT/_acceptance/config.yaml"
if ! grep -q 'bash tests/workflows/run-tests.sh' "$P51GATE"; then
  echo "     gate.yml THIEU step chay tests/workflows/run-tests.sh"
  P51OK=0
fi
if ! grep -q '^    workflows: "bash tests/workflows/run-tests.sh"$' "$P51CFG"; then
  echo "     config.yaml THIEU executors.test.workflows"
  P51OK=0
fi
if ! grep -q '^    - executors.test.workflows$' "$P51CFG"; then
  echo "     config.yaml THIEU executors.test.workflows trong feature_loop.suite_keys"
  P51OK=0
fi
# Doi chung dot bien: ban sao gate.yml bi xoa step -> phep kiem phai DO.
P51CP="$(mktemp)"
grep -v 'bash tests/workflows/run-tests.sh' "$P51GATE" > "$P51CP"
if cmp -s "$P51GATE" "$P51CP"; then
  echo "     dot bien KHONG cham duoc file (ban sao y het ban goc) — phep kiem da chet"
  P51OK=0
elif grep -q 'bash tests/workflows/run-tests.sh' "$P51CP"; then
  echo "     dot bien KHONG hieu luc — phep kiem da chet"
  P51OK=0
fi
rm -f "$P51CP"
if [ "$P51OK" -eq 1 ]; then
  pass "P51 tests/workflows wired (gate.yml + config executors + suite_keys + dot bien)"
else
  fail "P51 tests/workflows wired (gate.yml + config executors + suite_keys + dot bien)"
fi

# ── P52: card 2 harness render khoi "Ngoai hop dong" + nhanh backward ───────
# AC-8 cua s4-scope-triage. Card la lop trinh bay; review-findings.md the he CU
# (khong co section moi) phai render nhu cu, khong loi — nhanh backward la BAT
# BUOC, khong phai tuy nghi.
# Do DAU RA RENDER, khong grep chi dan. Round 1 cua chinh feature nay bi bat vi
# case cu chi grep hai file chi dan: no van xanh trong khi gate-card.js khong he
# biet khoi do, nen khoi khong bao gio hien ra cho nguoi duyet.
echo "P52 card THAT SU render khoi Ngoai-hop-dong (do dau ra) + nhanh backward"
P52OK=1
P52WS="$(mktemp -d)"
mkdir -p "$P52WS/_acceptance/demo"
cat > "$P52WS/_acceptance/demo/contract.md" <<'EOF'
---
schema_version: 1
feature: demo
slug: demo
risk_tier: T2
status: verified
---

## Criteria

- AC-1: Given x, When y, Then z.

## Out of scope

- khong lam gi ca
EOF
cat > "$P52WS/_acceptance/demo/evidence-report.md" <<'EOF'
---
slug: demo
round: 1
verdict: PASS
enforcement_mode: strict
bypass_used: false
---

## Results

- eval: E1
  run_id: r1234
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-07-27T00:00:00Z
EOF
cat > "$P52WS/_acceptance/demo/review-findings.md" <<'EOF'
# Review Findings: demo (round 1)

## Trong hợp đồng

- **loi trong hop dong**
  file: `src/a.ts:1`
  severity: high
  AC: AC-1

## Ngoài hợp đồng — người quyết ở Gate 2

- **rmSync called before git.clone resolves — uncaught SyntaxError in globToRe**
  Người dùng thấy gì: Bấm "Cập nhật" có thể làm mất tiện ích đang cài khi mạng chập chờn.
  file: `src/install.ts:10`
  severity: high
  Đề xuất: known-limits

---

⚠ Cụm ngoài vùng phủ: 2/3 lỗi rơi vào file không bộ đo nào phủ (src/install.ts, docs/plugins.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
EOF
P52OUT="$(node "$ROOT/scripts/gate-card.js" --root "$P52WS" --slug demo 2>&1)"
printf '%s' "$P52OUT" | grep -q 'Ngoài hợp đồng — bạn quyết' || { echo "     dau ra render THIEU tieu de khoi"; P52OK=0; }
# Cau NGON NGU SAN PHAM (truong plain) phai la chu nguoi quyet doc...
printf '%s' "$P52OUT" | grep -q 'Bấm &quot;Cập nhật&quot; có thể làm mất tiện ích đang cài' \
  || printf '%s' "$P52OUT" | grep -q 'có thể làm mất tiện ích đang cài' \
  || { echo "     dau ra render THIEU cau ngon ngu san pham (truong plain)"; P52OK=0; }
# ...va title KY THUAT cua reviewer TUYET DOI khong duoc len the.
for j in 'rmSync' 'globToRe' 'SyntaxError'; do
  if printf '%s' "$P52OUT" | grep -q "$j"; then
    echo "     the in title ky thuat cua reviewer: $j"
    P52OK=0
  fi
done
# Ba nhan lua chon RUT TU chi dan card (khong hardcode o day: hardcode thi test
# chi tu khop voi chinh no, renderer troi khoi chi dan van xanh).
P52LABELS="$(sed -n 's/.*(a) \*\*\([^*]*\)\*\*.*(b) \*\*\([^*]*\)\*\*.*(c) \*\*\([^*]*\)\*\*.*/\1|\2|\3/p' "$ROOT/commands/acceptance-card.md" | head -1)"
if [ -z "$P52LABELS" ]; then
  echo "     KHONG rut duoc 3 nhan tu commands/acceptance-card.md"
  P52OK=0
else
  P52OIFS="$IFS"; IFS='|'
  for lab in $P52LABELS; do
    printf '%s' "$P52OUT" | grep -q "$lab" || { echo "     renderer KHONG in dung nhan chi dan: $lab"; P52OK=0; }
  done
  IFS="$P52OIFS"
fi
# Co cum -> phai co dong co; va thẻ KHONG duoc nem duong dan file tho vao mat
# nguoi quyet (panel judge round 1 bat dung diem nay).
printf '%s' "$P52OUT" | grep -q 'dừng và quyết' || { echo "     dau ra render THIEU dong co cum"; P52OK=0; }
if printf '%s' "$P52OUT" | grep -q 'src/install.ts'; then
  echo "     thẻ lo duong dan file tho vao khoi nguoi-quyet"
  P52OK=0
fi
# Nhanh backward: file the he CU (khong co heading scope-triage) -> KHONG duoc
# render khoi, KHONG duoc bao loi. Doi chung THAT: doi dau vao, do lai dau ra.
printf '# Review Findings\n\n- **loi cu**\n  file: `a.ts`\n' > "$P52WS/_acceptance/demo/review-findings.md"
P52OLD="$(node "$ROOT/scripts/gate-card.js" --root "$P52WS" --slug demo 2>&1)"
P52OLDST=$?
if [ "$P52OLDST" -ne 0 ]; then echo "     file the he cu lam gate-card loi (exit $P52OLDST)"; P52OK=0; fi
if printf '%s' "$P52OLD" | grep -q 'Ngoài hợp đồng — bạn quyết'; then
  echo "     file the he cu VAN render khoi — nhanh backward hong"
  P52OK=0
fi
printf '%s' "$P52OLD" | grep -q 'Cổng 2' || { echo "     file the he cu lam hong ca the"; P52OK=0; }
# Doi chung dot bien THAT: bo section khoi input -> khoi phai BIEN MAT o dau ra.
rm -rf "$P52WS"
if [ "$P52OK" -eq 1 ]; then
  pass "P52 khoi Ngoai-hop-dong render that + co cum + khong lo path + backward"
else
  fail "P52 khoi Ngoai-hop-dong render that + co cum + khong lo path + backward"
fi

# ── P53: gac cong cho judge E11 — fixture PHAI la ban render THAT ────────────
# Cung khuon TE17/RL10: sinh LAI fixture trong chinh lan chay nay roi so
# byte-doi-byte. Round 2 bi bat vi fixture cu la van viet tay: judge cham mot
# tai lieu khong code path nao sinh ra, con the that thi in title ky thuat.
echo "P53 fixture judge E11 = ban render that (sinh lai + so byte)"
P53F="$ROOT/_acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md"
P53GEN="$ROOT/tests/plugins/fixtures/render-out-of-contract-block.sh"
P53OK=1
if [ ! -f "$P53F" ] || [ ! -f "$P53GEN" ]; then
  echo "     thieu fixture hoac script sinh"
  P53OK=0
else
  P53TMP="$(mktemp)"
  {
    head -6 "$P53F"
    bash "$P53GEN"
  } > "$P53TMP" 2>/dev/null
  if ! cmp -s "$P53F" "$P53TMP"; then
    echo "     fixture da TROI so voi ban render hien tai — chay lai:"
    echo "       { head -6 <fixture>; bash tests/plugins/fixtures/render-out-of-contract-block.sh; } > <fixture>"
    P53OK=0
  fi
  # Ban render phai la ngon ngu san pham: jargon ky thuat lot vao nghia la
  # duong dich (truong plain) da hong o dau do.
  for j in 'rmSync' 'globToRe' 'exit code' 'inContract' 'severity' 'src/'; do
    if grep -q "$j" "$P53TMP"; then echo "     ban render co jargon ky thuat: $j"; P53OK=0; fi
  done
  rm -f "$P53TMP"
fi
if [ "$P53OK" -eq 1 ]; then
  pass "P53 fixture judge E11 == ban render that + khong jargon"
else
  fail "P53 fixture judge E11 == ban render that + khong jargon"
fi

# ── P54: codex parity cho scope-triage ──────────────────────────────────────
# AC-9. Hai harness phai cung ngu nghia: 3 ngan, quyen REJECT chi cho
# in-contract high, va fail-toward-human khi buoc phan loai hong. Lech ngu
# nghia giua hai harness la loi thau — nguoi dung Codex nhan mot cong khac.
echo "P54 codex feature-loop S4 co buoc scope-triage tuong duong"
P54F="$ROOT/codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md"
P54OK=1
if [ ! -f "$P54F" ]; then
  echo "     thieu $P54F"; P54OK=0
else
  # Ba ngan + quyen REJECT + fail-toward-human, moi thu mot chuoi ghim.
  for s in 'scope-triage' 'in-contract' 'out-of-contract' 'unclassified' 'Never fix out-of-contract' 'fail toward the human'; do
    grep -qi "$s" "$P54F" || { echo "     THIEU chuoi khoa: $s"; P54OK=0; }
  done
  # Vai tro model phai duoc khai, khong thi bang routing noi doi ve fan-out that.
  grep -q 'acceptance_triage' "$P54F" || { echo "     THIEU vai tro acceptance_triage trong bang routing"; P54OK=0; }
fi
# Doi chung dot bien: ban sao xoa luat -> phep kiem phai DO.
P54CP="$(mktemp)"
grep -vi 'Never fix out-of-contract' "$P54F" > "$P54CP" 2>/dev/null
if cmp -s "$P54F" "$P54CP"; then
  echo "     dot bien KHONG cham duoc file (ban sao y het ban goc) — phep kiem da chet"
  P54OK=0
elif grep -qi 'Never fix out-of-contract' "$P54CP"; then
  echo "     dot bien KHONG hieu luc — phep kiem da chet"
  P54OK=0
fi
rm -f "$P54CP"
if [ "$P54OK" -eq 1 ]; then
  pass "P54 codex parity scope-triage (6 chuoi khoa + vai tro + dot bien)"
else
  fail "P54 codex parity scope-triage (6 chuoi khoa + vai tro + dot bien)"
fi

# ── P55: ROUND-TRIP writer <-> reader cho review-findings.md ────────────────
# Lop loi da tai dien BA round lien tiep ma khong eval nao do: ben VIET (prompt
# synthesize trong acceptance-verify.js) va ben DOC (lib/out-of-contract.js) troi
# khoi nhau, vi MOI test deu tu tay dung fixture DUNG KHUON READER. Case nay RUT
# khuon tu chinh file writer roi cho reader that doc — hai dau khong the troi nua.
echo "P55 round-trip: khuon prompt synthesize phai parse duoc bang lib/out-of-contract.js"
run "P55 round-trip writer<->reader (khuon rut tu writer, doc bang reader that)" \
  node - "$ROOT" <<'JS'
const fs = require('fs');
const path = require('path');
const root = process.argv[2];
const wf = fs.readFileSync(path.join(root, 'feature-loop/workflows/acceptance-verify.js'), 'utf8');
const parser = require(path.join(root, 'lib/out-of-contract.js'));

// 1. Rut khuon tu WRITER (khong hardcode o day).
const m = wf.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)OOC-ITEM-TEMPLATE>>>/);
if (!m) { console.error('KHONG rut duoc khuon OOC-ITEM-TEMPLATE tu writer'); process.exit(1); }
// Hoa giai escape cua NGUON JS de duoc DUNG chuoi agent thuc su doc:
// \\n -> xuong dong, \\` -> backtick that.
const tpl = m[1].replace(/\\n/g, '\n').replace(/\\`/g, '`');

const SAMPLE = {
  title: 'rmSync before clone resolves',
  plain: 'Bấm Cập nhật có thể làm mất tiện ích đang cài.',
  file: 'src/install.ts:10',
  severity: 'high',
  proposal: 'known-limits',
};
const fill = t => t.replace(/\{(\w+)\}/g, (_, k) => SAMPLE[k]);
const doc = '## Ngoài hợp đồng — người quyết ở Gate 2\n\n' + fill(tpl) + '\n';

// 2. Cho READER that doc tai lieu do.
const r = parser.parse(doc);
const f = r.findings[0];
if (!f) { console.error('reader parse ra 0 finding tu khuon cua writer — hai dau da lech'); process.exit(1); }
for (const k of ['title', 'file', 'severity', 'proposal', 'plain']) {
  if (f[k] !== SAMPLE[k]) {
    console.error('reader parse truong ' + k + ' = [' + f[k] + '] nhung phai la [' + SAMPLE[k] + '] — hai dau da lech');
    process.exit(1);
  }
}


// 3. Doi chung dot bien: dao dong plain len TRUOC dong title -> phai parse HONG.
const lines = fill(tpl).split('\n').filter(Boolean);
const swapped = '## Ngoài hợp đồng — người quyết ở Gate 2\n\n'
  + [lines[1].trim(), lines[0], ...lines.slice(2)].join('\n') + '\n';
const bad = parser.parse(swapped);
if (bad.findings.length > 0 && bad.findings[0].plain) {
  console.error('dot bien KHONG hieu luc — dao thu tu dong van parse duoc, phep so da chet');
  process.exit(1);
}
console.log('round-trip OK; dot bien dao dong bi bat');
JS

# ── P56: codex writer phai duoc bao ghi DUNG khuon (AC-15) ─────────────────
# Hai harness render qua CUNG scripts/gate-card.js, von chi in truong plain.
# Codex khong duoc bao viet dong do -> moi muc ra placeholder, va "parity" cua
# AC-9 chi la chu. P54 ghim tu khoa nghiep vu; P56 ghim KHUON tai lieu.
echo "P56 codex SKILL chi dan dung khuon review-findings (plain + cau truc)"
P56F="$ROOT/codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md"
P56OK=1
if [ ! -f "$P56F" ]; then
  echo "     thieu $P56F"; P56OK=0
else
  grep -q 'Người dùng thấy gì' "$P56F" || { echo "     THIEU chi dan dong 'Người dùng thấy gì' (truong plain)"; P56OK=0; }
  grep -q -- '- \*\*<title>\*\*' "$P56F" || { echo "     THIEU cau truc '- **<title>**'"; P56OK=0; }
  grep -q 'Đề xuất:' "$P56F" || { echo "     THIEU dong 'Đề xuất:'"; P56OK=0; }
  # Dong co cum + dong n-a phai la CHUOI NGUYEN VAN (CLUSTER_RE cua reader ghim
  # dung khuon) — prose tu do lam co lang im khong bao gio toi Gate 2.
  grep -q '⚠ Cụm ngoài vùng phủ:' "$P56F" || { echo "     THIEU chuoi nguyen van co cum '⚠ Cụm ngoài vùng phủ:'"; P56OK=0; }
  grep -q 'cluster: n-a' "$P56F" || { echo "     THIEU dong nguyen van 'cluster: n-a'"; P56OK=0; }
  grep -q '## Chưa adversarial-verify (refuter chết)' "$P56F" || { echo "     THIEU heading nguyen van '## Chưa adversarial-verify (refuter chết)'"; P56OK=0; }
fi
# Doi chung dot bien: ban sao bo dong plain phai KHAC ban goc VA lam phep kiem do.
P56CP="$(mktemp)"
grep -v 'Người dùng thấy gì' "$P56F" > "$P56CP" 2>/dev/null
if cmp -s "$P56F" "$P56CP"; then
  echo "     dot bien KHONG cham duoc file (ban sao y het ban goc) — phep kiem da chet"
  P56OK=0
elif grep -q 'Người dùng thấy gì' "$P56CP"; then
  echo "     dot bien KHONG hieu luc — phep kiem da chet"
  P56OK=0
fi
rm -f "$P56CP"
if [ "$P56OK" -eq 1 ]; then
  pass "P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)"
else
  fail "P56 codex chi dan khuon review-findings (plain + cau truc + dot bien)"
fi

if [ "$failures" -gt 0 ]; then
  echo
  echo "Results: $failures failed"
  exit 1
fi

echo
echo "Results: all plugin tests passed"
exit 0
