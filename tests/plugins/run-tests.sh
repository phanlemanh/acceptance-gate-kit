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
  python3 - "$ROOT" <<'PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
load = lambda rel: json.loads((root / rel).read_text(encoding="utf-8"))
data = load("plugins/feature-loop-codex/.codex-plugin/plugin.json")
assert data["name"] == "feature-loop-codex"
assert data["skills"] == "./skills/"
assert data["description"]
# KHONG ghim literal version: ghim literal bat moi lan bump phai sua suite, ma
# suite doi la code doi that nen evidence stale — vong "ky -> bump -> stale ->
# verify lai -> ky lai" da dam o P03/P22. Doc tu manifest va bat BA ban khop
# nhau; lech mot ban la DO, dung lop loi ma phep do nay sinh ra de bat.
overlay = load("codex/feature-loop-codex/.codex-plugin/plugin.json")
claude = load("feature-loop/.claude-plugin/plugin.json")
versions = {data["version"], overlay["version"], claude["version"]}
assert len(versions) == 1, f"ba manifest feature-loop lech nhau: {versions}"
assert data["version"], "version rong"
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

assert json.loads((root / "codex/design-loop/.codex-plugin/plugin.json").read_text())["version"] == "0.3.0"
# version của acceptance-gate và feature-loop KHÔNG ghim literal (xem P03/P04):
# ghim literal bắt mỗi lần bump phải sửa suite, mà suite đổi là code đổi thật
# nên evidence stale. Ở đây chỉ bắt hai bản feature-loop khớp nhau — lệch là ĐỎ.
_fl_c = json.loads((root / "feature-loop/.claude-plugin/plugin.json").read_text())["version"]
_fl_x = json.loads((root / "codex/feature-loop-codex/.codex-plugin/plugin.json").read_text())["version"]
assert _fl_c and _fl_c == _fl_x, f"feature-loop lệch giữa bản Claude ({_fl_c}) và Codex ({_fl_x})"
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


echo "P58 smoke ban MIRROR: gate-card cua plugin chay that (khong chi khong-drift)"
P58T="$(mktemp -d)"; mkdir -p "$P58T/_acceptance/fx"
python3 - "$P58T" <<'P58PY'
import sys, pathlib
d = pathlib.Path(sys.argv[1]) / "_acceptance" / "fx"
acs = []
for i in range(1, 6):
    if i == 3: acs.append("### nhom phu\n")
    acs.append(f"- AC-{i}: Given dk {i}, When act {i}, Then kq {i}.")
(d / "contract.md").write_text('---\nschema_version: 2\nfeature: "fx"\nslug: fx\nrisk_tier: T2\nsurfaces: [cli]\nstatus: draft\n---\n\n# c\n\n## Criteria\n\n' + "\n".join(acs) + '\n\n## Coverage\n\n- x\n\n## Out of scope\n\n- y\n- z\n')
P58PY
P58_OUT="$(node "$ROOT/plugins/acceptance-gate/scripts/gate-card.js" --root "$P58T" --slug fx --extract 2>&1)"; P58_RC=$?
P58_N="$(printf '%s' "$P58_OUT" | python3 -c "import json,sys
try:
    d=json.load(sys.stdin); print(len(d.get('will_do',[]))+len(d.get('wont_do',[])))
except Exception: print(-1)")"
if [ "$P58_RC" -eq 0 ] && [ "$P58_N" = "5" ]; then
  pass "P58 ban mirror chay that: exit 0 + doc du 5 AC"
else
  fail "P58 ban mirror: rc=$P58_RC ac=$P58_N (mong rc=0 ac=5)"
fi
rm -rf "$P58T"

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
LOCKED = ["approve", "signoff", "acceptance-init", "acceptance-status", "acceptance-report", "start"]
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
LOCKED = ["approve", "signoff", "acceptance-init", "acceptance-status", "acceptance-report", "start"]
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

run "P57 acceptance-init noi DUNG muc cuong che cua approvers (CA HAI harness)" \
  python3 - "$ROOT" <<'PY'
import sys, pathlib
root = pathlib.Path(sys.argv[1])
targets = [
    root / "commands" / "acceptance-init.md",
    root / "codex" / "acceptance-gate" / "skills" / "acceptance-init" / "SKILL.md",
]
present = [p for p in targets if p.exists()]
assert len(present) == 2, f"thieu ban acceptance-init: {[str(p) for p in targets if not p.exists()]}"
for p in present:
    t = p.read_text(encoding="utf-8")
    # Ghim MARKER chu khong chi do vang-mat: xoa dong cu ma khong viet gi thay
    # the van xanh, va tai lieu cam ve approvers de nguoi van hanh tu suy ra
    # muc cuong che.
    assert "# approvers: informational —" in t, f"{p.name}: thieu marker muc cuong che"
    assert "NOT enforced" in t, f"{p.name}: khong noi ro khoa KHONG duoc cuong che"
    assert "placeholder" in t, f"{p.name}: khong noi chu ky VAN bi kiem bang luoi giu-cho"
PY


# ─── P65..P71 — gate-card doc dong criterion (slug gate-card-ac-visibility) ───
# Corpus la BAT BUOC: contract cua chinh kit chi dung 2/5 khuon, nen chay eval
# bao-tap tren _acceptance/ khong dung den 3 khuon da gay ra loi.
AC_LIB="$ROOT/lib/ac-line.js"
AC_CORPUS="$ROOT/tests/plugins/fixtures/ac-line-corpus.md"

echo "P65 corpus khuon dong criterion: id/gwt/judgment khop bang GHIM SAN"
if [ ! -f "$AC_LIB" ] || [ ! -f "$AC_CORPUS" ]; then
  fail "P65 thieu lib/ac-line.js hoac corpus fixture"
else
  P58OUT="$(node -e '
    const fs=require("fs"); const {parseAC}=require(process.argv[1]);
    const lines=fs.readFileSync(process.argv[2],"utf8").split("\n");
    let bad=0,n=0;
    for(let i=0;i<lines.length;i++){
      const c=lines[i].match(/^CASE\s+(\S+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*)$/);
      if(!c) continue;
      const inp=(lines[i+1]||"").replace(/^INPUT /,"");
      const [,name,wantId,wantJ,wantG]=c; n++;
      const got=parseAC(inp);
      if(wantId==="-"){ if(got){bad++;console.log("LECH "+name+": mong 0 criterion, nhan "+got.id);} continue; }
      if(!got){bad++;console.log("LECH "+name+": mong "+wantId+", nhan 0 criterion");continue;}
      if(got.id!==wantId){bad++;console.log("LECH "+name+" id: mong "+wantId+" nhan "+got.id);}
      const gj=got.judgment?"y":"n";
      if(gj!==wantJ){bad++;console.log("LECH "+name+" judgment: mong "+wantJ+" nhan "+gj);}
      if(got.gwt!==wantG){bad++;console.log("LECH "+name+" gwt:\n   mong: "+wantG+"\n   nhan: "+got.gwt);}
    }
    console.log("CASES="+n+" BAD="+bad);
  ' "$AC_LIB" "$AC_CORPUS" 2>&1)"
  echo "$P58OUT" | grep -v '^CASES=' | sed 's/^/     /'
  P58N="$(echo "$P58OUT" | sed -n 's/^CASES=\([0-9]*\) BAD=.*/\1/p')"
  P58B="$(echo "$P58OUT" | sed -n 's/^CASES=[0-9]* BAD=\([0-9]*\)/\1/p')"
  if [ "${P58N:-0}" -lt 10 ]; then fail "P65 corpus qua mong ($P58N ca) — khong du de goi la phu khuon"
  elif [ "${P58B:-1}" -ne 0 ]; then fail "P65 $P58B lech so voi bang ghim"
  else pass "P65 corpus $P58N ca khop bang ghim (id+gwt+judgment)"; fi
fi

echo "P66 bao-tap: khuon MOI phai BAO khuon CU, 0 dong mat, 0 dong rac them"
P59OUT="$(node -e '
  const fs=require("fs"),path=require("path"); const {parseAC}=require(process.argv[1]);
  const OLD=/^\s*-\s*(AC-\d+)\s*:\s*(.+)$/;
  const files=[process.argv[2]];
  const roots=[path.join(process.argv[3],"_acceptance")];
  // AC-2 khai "ca hai repo". Suite khong duoc PHU THUOC repo anh em ton tai, nen
  // duong do la opt-in qua env — nhung khi VANG phai NOI RA, khong duoc im lang
  // thu hep pham vi roi van bao xanh.
  const extra=process.env.AC_EXTRA_CORPUS_ROOT;
  if(extra&&fs.existsSync(path.join(extra,"_acceptance"))) roots.push(path.join(extra,"_acceptance"));
  else console.log("PHAM-VI: khong co AC_EXTRA_CORPUS_ROOT — chi phu corpus + _acceptance cua repo nay; AC-2 khai rong hon the");
  for(const accDir of roots) for(const d of fs.readdirSync(accDir)){const p=path.join(accDir,d,"contract.md");if(fs.existsSync(p))files.push(p);}
  let lost=0,gained=0,junk=0;
  // Dong corpus mang tien to "INPUT " — khong got thi parseAC khong doc duoc dong
  // nao va corpus dong gop 0 vao phep do (doi chung duong bat duoc dieu nay).
  const strip=l=>l.startsWith("INPUT ")?l.slice(6):l;
  for(const f of files) for(const raw of fs.readFileSync(f,"utf8").split("\n")){
    const l=strip(raw);
    const o=OLD.test(l), n=!!parseAC(l);
    if(o&&!n){lost++;console.log("MAT "+path.basename(path.dirname(f))+": "+l.trim().slice(0,70));}
    if(!o&&n){ gained++;
      // nua should-NOT-fire: dong khuon CU khong doc VI NO KHONG PHAI criterion
      if(/^\s*[-*]\s+\*{0,2}\s*[^A]/.test(l)&&!/^\s*[-*]\s*\*{0,2}\s*AC-\d/.test(l)){junk++;console.log("RAC "+l.trim().slice(0,70));}
    }
  }
  console.log("LOST="+lost+" GAINED="+gained+" JUNK="+junk);
' "$AC_LIB" "$AC_CORPUS" "$ROOT" 2>&1)"
echo "$P59OUT" | grep -v '^LOST=' | sed 's/^/     /'
P59L="$(echo "$P59OUT" | sed -n 's/^LOST=\([0-9]*\).*/\1/p')"
P59G="$(echo "$P59OUT" | sed -n 's/^LOST=[0-9]* GAINED=\([0-9]*\).*/\1/p')"
P59J="$(echo "$P59OUT" | sed -n 's/^.*JUNK=\([0-9]*\)$/\1/p')"
# Doi chung duong (script hoa, khong con la chu trong `expected`): thu hep khuon
# tren mot BAN SAO cua lib roi doi phep do phai BAO MAT dong. Khong do duoc cai
# nay thi con so "0 mat" o tren khong phan biet duoc voi "phep do khong chay".
P59CTRL="$(node -e '
  const fs=require("fs");
  // Ban HEP co y: dung dung khuon template goc (colon dan ngay sau id). Neu phep
  // do o tren THUC SU phan biet duoc, thi thay parser bang ban hep nay phai lam
  // lo ra dong bi mat tren corpus. Khong lo ra = phep do khong do gi.
  const NARROW=/^\s*-\s*(AC-\d+)\s*:\s*(.+)$/;
  const WIDE=require(process.argv[1]).parseAC;
  let lost=0;
  for(const raw of fs.readFileSync(process.argv[2],"utf8").split("\n")){
    const l=raw.startsWith("INPUT ")?raw.slice(6):raw;
    const w=WIDE(l); if(w&&!NARROW.test(l)) lost++;
  }
  console.log("CTRL="+(lost>0?"do":"xanh")+" ("+lost+" dong chi ban rong doc duoc)");
' "$AC_LIB" "$AC_CORPUS" 2>&1)"
case "$P59CTRL" in CTRL=do*) ;; *) fail "P66 doi chung duong HONG ($P59CTRL): thay bang khuon hep ma phep do khong bao mat dong — thuoc khong phan biet duoc";; esac
if [ "${P59L:-1}" -ne 0 ]; then fail "P66 khuon moi lam MAT ${P59L} dong khuon cu doc duoc — khong con la phep noi"
elif [ "${P59G:-0}" -lt 5 ]; then fail "P66 chi them ${P59G} dong — corpus khong dung den cac khuon moi, phep do rong nghia"
elif [ "${P59J:-1}" -ne 0 ]; then fail "P66 khuon moi keo them ${P59J} dong RAC (khong phai criterion)"
else pass "P66 bao-tap: 0 mat, +${P59G} dong criterion that, 0 rac"; fi

echo "P67 co judgment: 0 lat tren dong chung; nhan/code-span xu dung"
P60OUT="$(node -e '
  const fs=require("fs"),path=require("path"); const {parseAC}=require(process.argv[1]);
  const OLD=/^\s*-\s*(AC-\d+)\s*:\s*(.+)$/;
  const roots=[path.join(process.argv[2],"_acceptance")];
  const extra=process.env.AC_EXTRA_CORPUS_ROOT;
  if(extra&&fs.existsSync(path.join(extra,"_acceptance"))) roots.push(path.join(extra,"_acceptance"));
  else console.log("PHAM-VI: khong co AC_EXTRA_CORPUS_ROOT — 2 dong repo tieu thu ma AC-3 neu dich danh KHONG nam trong pham vi quet");
  let flip=0;
  for(const accDir of roots) for(const d of fs.readdirSync(accDir)){const p=path.join(accDir,d,"contract.md");if(!fs.existsSync(p))continue;
    for(const l of fs.readFileSync(p,"utf8").split("\n")){
      const o=l.match(OLD); if(!o) continue; const n=parseAC(l); if(!n) continue;
      const jo=/\(judgment\)/i.test(o[2]);
      if(jo===n.judgment) continue;
      // Lat DUOC PHEP dung mot truong hop: dau chi ton tai ben trong code span,
      // tuc criterion dang TRICH DAN dau chu khong mang no. Moi lat khac la loi.
      const onlyInCode = jo && !n.judgment && !/\(judgment\)/i.test(l.replace(/`[^`]*`/g,""));
      if(!onlyInCode){flip++;console.log("LAT SAI "+d+" "+n.id+": cu="+jo+" moi="+n.judgment);}
      else console.log("     lat DUNG luat code-span: "+d+" "+n.id);
    }}
  // doi chung duong: go backtick tren dong trich dan dau -> phai thanh judgment
  const quoted="- AC-8: Given contract mang dau `(judgment)` trong ngoac kep, Then khong tinh.";
  const bare  ="- AC-8: Given contract mang dau (judgment) trong ngoac kep, Then khong tinh.";
  const a=parseAC(quoted), b=parseAC(bare);
  console.log("FLIP="+flip+" QUOTED="+(a&&a.judgment)+" BARE="+(b&&b.judgment));
' "$AC_LIB" "$ROOT" 2>&1)"
echo "$P60OUT" | grep -v '^FLIP=' | sed 's/^/     /'
if ! echo "$P60OUT" | grep -q '^FLIP=0 QUOTED=false BARE=true'; then
  fail "P67 co judgment sai: $(echo "$P60OUT" | grep '^FLIP=')"
else pass "P67 co judgment: 0 lat; dau trong code-span = trich dan (false), go backtick -> true"; fi

echo "P68 mot nguon su that: HAI LOI GOI THAT cua gate-card tren cung contract"
# Ban truoc cua case nay do bang grep dem regex + goi CUNG mot ham hai lan roi so
# voi chinh no — mot hang dung, khong phan biet duoc gi. Verify vong 1 chung minh:
# tach doi hai loi goi that thi P68 VAN PASS. Ban nay lai bang HANH VI qua CLI:
#   loi goi A = duong card Cong 1 (acs)      -> chu criterion hien o khoi will/wont
#   loi goi B = duong critText Cong 2 (:265) -> chu criterion hien o muc "viec cua nguoi"
# Hai duong doc CUNG contract; lech nhau la hong. Doi chung duong = dot bien
# LAM LECH THAT roi doi case phai DO.
P61WS="$(mktemp -d)"; P61A="$P61WS/_acceptance/twopath"; mkdir -p "$P61A"
cat > "$P61A/contract.md" <<'P61EOF'
---
schema_version: 1
feature: two-path probe
slug: twopath
risk_tier: T3
status: verified
approved_by: Probe
---

## Criteria

- AC-1: Given zulufox, When chay, Then xanh.
- **AC-2 (nhan):** Given yankeecrab, When chay, Then xanh.
- **AC-3** (judgment) Given xraymoose, When chay, Then xanh.
- AC-4 (F1): Given whiskeyelk, When chay, Then xanh.
- **AC-5.** Given victorowl, When chay, Then xanh.
P61EOF
cat > "$P61A/evals.yaml" <<'P61EOF'
schema_version: 1
feature_slug: twopath
evals:
  - id: E1
    criterion: AC-1
    executor: judgment
    question: "q1"
  - id: E2
    criterion: AC-2
    executor: judgment
    question: "q2"
  - id: E3
    criterion: AC-3
    executor: judgment
    question: "q3"
  - id: E4
    criterion: AC-4
    executor: judgment
    question: "q4"
  - id: E5
    criterion: AC-5
    executor: judgment
    question: "q5"
P61EOF
cat > "$P61A/evidence-report.md" <<'P61EOF'
---
schema_version: 2
feature_slug: twopath
verdict: PENDING-JUDGMENT
failed_evals: []
verified_by: probe
enforcement_mode: strict
bypass_used: false
verified_commit: 0000000000000000000000000000000000000000
---

## Evidence

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | judgment | UNCERTAIN |
| E2 | AC-2 | judgment | UNCERTAIN |
| E3 | AC-3 | judgment | UNCERTAIN |
| E4 | AC-4 | judgment | UNCERTAIN |
| E5 | AC-5 | judgment | UNCERTAIN |
P61EOF
# AC-3 mang dau (judgment): duong Cong 1 CHI in ID cho nhom do (gate-card.js:250),
# khong in chu. Nen sentinel cua no chi doi o duong B; o duong A doi chinh ID.
P61SENT_A="zulufox yankeecrab whiskeyelk victorowl"
P61SENT_B="zulufox yankeecrab xraymoose whiskeyelk victorowl"
p61_probe() { # <thu-muc-goc> -> in cac sentinel VANG MAT o moi duong
  local GCJ="$1/scripts/gate-card.js" miss=""
  local g1 g2
  g1="$(node "$GCJ" --root "$P61WS" --slug twopath --gate 1 2>/dev/null)"
  g2="$(node "$GCJ" --root "$P61WS" --slug twopath --gate 2 2>/dev/null)"
  for w in $P61SENT_A; do case "$g1" in *"$w"*) ;; *) miss="$miss A:$w";; esac; done
  case "$g1" in *"AC-3"*) ;; *) miss="$miss A:id-AC-3";; esac
  for w in $P61SENT_B; do case "$g2" in *"$w"*) ;; *) miss="$miss B:$w";; esac; done
  echo "$miss"
}
P61MISS="$(p61_probe "$ROOT")"
# Dot bien: LAM LECH THAT duong critText (Cong 2) — bo moi criterion khuon `- **AC-n`
P61MUT="$(mktemp -d)"; mkdir -p "$P61MUT/scripts" "$P61MUT/lib"
cp "$ROOT"/lib/*.js "$P61MUT/lib/" 2>/dev/null
cp "$ROOT"/lib/*.json "$P61MUT/lib/" 2>/dev/null
cp "$ROOT/scripts/gate-card.js" "$P61MUT/scripts/gate-card.js"
perl -0pi -e 's/\Qconst ac = parseAC(l); if (ac && !critText\E/const ac = MUTDROP(l) ? null : parseAC(l); if (ac \&\& !critText/' "$P61MUT/scripts/gate-card.js"
perl -0pi -e 's/\Qconst { parseAC, acBlindSpot, blindSpotText }\E/const MUTDROP = l => \/^\\s*-\\s*\\*\/.test(l);\nconst { parseAC, acBlindSpot, blindSpotText }/' "$P61MUT/scripts/gate-card.js"
if ! grep -q 'MUTDROP(l) ? null : parseAC(l)' "$P61MUT/scripts/gate-card.js" || ! node --check "$P61MUT/scripts/gate-card.js" 2>/dev/null; then
  fail "P68 dot bien KHONG ap duoc — doi chung duong vo hieu, khong the tin case nay"
else
  P61MUTMISS="$(p61_probe "$P61MUT")"
  if [ -n "$P61MISS" ]; then
    fail "P68 hai loi goi LECH tren cay that — thieu:$P61MISS"
  elif [ -z "$P61MUTMISS" ]; then
    fail "P68 doi chung duong HONG: da lam lech that duong critText ma case van xanh — thuoc nay khong do gi"
  else
    pass "P61 hai loi goi khop tren cay that; dot bien lam lech -> bat duoc (${P61MUTMISS# })"
  fi
fi
rm -rf "$P61WS" "$P61MUT"

echo "P69 RONG phai KEU (2 ca kich hoat) + doi chung chong cry-wolf"
P62OUT="$(node -e '
  const {acBlindSpot}=require(process.argv[1]);
  const lines=(arr)=>arr.join("\n");
  // (a) heading dung, khuon LA -> section co nhung parse ra 0
  const a=lines(["## Criteria","","- **AC-1**","- **AC-2**","- **AC-3**"]);
  // (b) heading LECH -> section() rong, khong co section de quet
  const b=lines(["## Acceptance criteria","","- AC-1: Given x, Then y.","- AC-2: Given x, Then y."]);
  // (c) lanh
  const c=lines(["## Criteria","","- AC-1: Given x, Then y.","- AC-2: Given x, Then y."]);
  const ra=acBlindSpot(a,[]), rb=acBlindSpot(b,[]), rc=acBlindSpot(c,["AC-1","AC-2"]);
  console.log("A="+(ra?ra.kind+":"+ra.suspect:"null")+" B="+(rb?rb.kind+":"+rb.suspect+":"+(rb.heading||"-"):"null")+" C="+(rc?rc.kind:"null"));
' "$AC_LIB" 2>&1)"
echo "     $P62OUT"
if ! echo "$P62OUT" | grep -q 'A=blank:3 B=blank:2:## Acceptance criteria C=null'; then
  fail "P69 canh bao RONG sai: $P62OUT"
else pass "P69 ca (a) khuon la + ca (b) heading lech deu KEU va neu heading; contract lanh IM"; fi

echo "P71 CUT phai KEU (ca ma P69 khong phu vi n>=1) + doi chung m==n"
P64OUT="$(node -e '
  const {acBlindSpot}=require(process.argv[1]);
  const rows=["## Criteria",""];
  for(let i=1;i<=2;i++) rows.push("- AC-"+i+": Given x, Then y.");
  for(let i=3;i<=8;i++) rows.push("- AC-"+i+" ~ Given x, Then y.");   // khuon la, khong parse
  const cut=acBlindSpot(rows.join("\n"),["AC-1","AC-2"]);
  const okRows=["## Criteria","","- AC-1: Given x, Then y.","- AC-2: Given x, Then y."];
  const same=acBlindSpot(okRows.join("\n"),["AC-1","AC-2"]);
  console.log("CUT="+(cut?cut.kind+":"+cut.parsed+"/"+cut.suspect:"null")+" SAME="+(same?same.kind:"null"));
' "$AC_LIB" 2>&1)"
echo "     $P64OUT"
if ! echo "$P64OUT" | grep -q 'CUT=short:2/8 SAME=null'; then
  fail "P71 canh bao CUT sai: $P64OUT"
else pass "P71 ca cut 2/8 KEU dung nhanh short; m==n IM (khong cry-wolf)"; fi

echo "P70 dogfood: contract cua chinh kit deu dung heading '## Criteria'"
P63BAD=0
for f in "$ROOT"/_acceptance/*/contract.md; do
  [ -f "$f" ] || continue
  if ! grep -qE '^#{2,6}[[:space:]]+Criteria([[:space:]]|$)' "$f"; then
    echo "     heading criterion khong chuan: $f"
    P63BAD=$((P63BAD+1))
  fi
done
# doi chung duong: ban sao doi heading -> phai bi bat
P63TMP="$(mktemp -d)"; sed 's/^## Criteria$/## Acceptance criteria/' "$ROOT/_acceptance/gate-card-ac-visibility/contract.md" > "$P63TMP/c.md"
if grep -qE '^#{2,6}[[:space:]]+Criteria([[:space:]]|$)' "$P63TMP/c.md"; then
  fail "P70 doi chung duong HONG: ban sao doi heading van lot qua phep kiem"
elif [ "$P63BAD" -ne 0 ]; then
  fail "P70 $P63BAD contract cua kit mang chinh con bo kit bat"
else pass "P70 moi contract cua kit dung '## Criteria'; doi chung duong bat duoc ban doi heading"; fi
rm -rf "$P63TMP"

# --- design-pass cases (P72-P81) begin ---
# Luật chung: đọc vật THẬT từ $ROOT; check() trả vi phạm với thông điệp GHIM
# (khớp evals.yaml của design-pass-skill); ĐỐI CHỨNG DƯƠNG bản nguyên vẹn
# xanh TRƯỚC khi tin bản đột biến đỏ; đột biến trên chuỗi/bản sao, không đụng
# nguồn. N() gộp whitespace để anchor sống sót qua line-wrap.

run "P72 design-pass frontmatter + NOT-for + open invocation (E1)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
N = lambda s: re.sub(r"\s+", " ", s)
def check(text):
    tx = N(text); errs = []
    if "name: design-pass" not in text: errs.append("SKILL.md thieu frontmatter name: design-pass")
    if "Dùng khi" not in tx: errs.append("description thieu trigger Dung khi")
    if "KHÔNG dùng cho" not in tx: errs.append("description thieu NOT-for")
    if "disable-model-invocation" in text: errs.append("design-pass bi khoa model-invocation")
    return errs
assert check(t) == [], f"ban nguyen ven phai XANH: {check(t)}"
mut = t.replace("---\nname: design-pass", "---\ndisable-model-invocation: true\nname: design-pass", 1)
assert any("design-pass bi khoa model-invocation" in e for e in check(mut)), "dot bien tiem lock khong do"
PY

run "P73 design-pass preflight: keys + {slug} template + DUNG + standalone slug (E2)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
N = lambda s: re.sub(r"\s+", " ", s)
def check(text):
    tx = N(text); errs = []
    for key in ["proto_route", "ds_skill", "dev_cmd", "capture_cmd"]:
        if f"design_pass.{key}" not in tx: errs.append(f"SKILL.md thieu key design_pass.{key}")
    if "{slug}" not in tx: errs.append("proto_route thieu template {slug}")
    if "config-patch" not in tx: errs.append("SKILL.md thieu lenh config-patch mau")
    if "thiếu `proto_route` → DỪNG" not in tx: errs.append("thieu nhanh DUNG khi vang proto_route")
    if "standalone" not in tx or "hỏi user đúng 1 câu" not in tx: errs.append("thieu buoc xac dinh slug standalone")
    return errs
assert check(t) == [], f"ban nguyen ven phai XANH: {check(t)}"
m1 = t.replace("design_pass.dev_cmd", "design_pass.devcmd")
assert any("SKILL.md thieu key design_pass.dev_cmd" in e for e in check(m1)), "dot bien xoa key khong do"
m2 = t.replace("{slug}", "SLUG")
assert any("proto_route thieu template {slug}" in e for e in check(m2)), "dot bien xoa {slug} khong do"
m3 = N(t).replace("thiếu `proto_route` → DỪNG", "thiếu `proto_route` → tiếp tục")
assert any("thieu nhanh DUNG khi vang proto_route" in e for e in check(m3)), "dot bien doi DUNG khong do"
PY

run "P74 design-pass 2 nguon luat + thang DS + shadcn default (E3)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
N = lambda s: re.sub(r"\s+", " ", s)
def check(text):
    tx = N(text); errs = []
    if "ux-ui-craft" not in tx: errs.append("thieu nguon luat ux-ui-craft")
    if "không resolve" not in tx: errs.append("thieu nhanh degrade ds_skill")
    if "shadcn" not in tx: errs.append("thieu mac dinh shadcn cho repo 0 token")
    if "Nhóm 2" not in tx: errs.append("thieu finding Nhom 2 khi ha nac DS")
    return errs
assert check(t) == [], f"ban nguyen ven phai XANH: {check(t)}"
m1 = t.replace("không resolve", "khong-doi")
assert any("thieu nhanh degrade ds_skill" in e for e in check(m1)), "dot bien xoa nhanh thang khong do"
m2 = t.replace("shadcn", "libX")
assert any("thieu mac dinh shadcn cho repo 0 token" in e for e in check(m2)), "dot bien xoa shadcn khong do"
PY

run "P75 design-pass thang vat lieu + khai material + cam tu dung (E4)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
N = lambda s: re.sub(r"\s+", " ", s)
def check(text):
    tx = N(text); errs = []
    for rung in ["real-components", "scaffold", "static"]:
        if rung not in tx: errs.append(f"thieu bac vat lieu {rung}")
    if "PHẢI khai `material:`" not in tx: errs.append("thieu khai material khi ha bac vat lieu")
    if "KHÔNG tự dựng route/logic" not in tx: errs.append("thieu cau cam tu dung route/logic")
    return errs
assert check(t) == [], f"ban nguyen ven phai XANH: {check(t)}"
m1 = N(t).replace("KHÔNG tự dựng route/logic", "cân nhắc dựng")
assert any("thieu cau cam tu dung route/logic" in e for e in check(m1)), "dot bien xoa cau cam khong do"
m2 = N(t).replace("PHẢI khai `material:`", "nên ghi bậc")
assert any("thieu khai material khi ha bac vat lieu" in e for e in check(m2)), "dot bien xoa khai material khong do"
PY

run "P76 design-pass 4 luat cung thanh van (E5)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
N = lambda s: re.sub(r"\s+", " ", s)
RULES = {
    "khong-hex-moi": "không hex mới",
    "khong-webfont": "không webfont",
    "khong-sua-components-ui": "không sửa `components/ui`",
    "khong-logic-write-path": "write-path",
}
def check(text):
    tx = N(text)
    return [f"thieu luat cung: {name}" for name, anchor in RULES.items() if anchor not in tx]
assert check(t) == [], f"ban nguyen ven phai XANH: {check(t)}"
for name, anchor in RULES.items():
    mut = N(t).replace(anchor, "…")
    assert any(f"thieu luat cung: {name}" in e for e in check(mut)), f"dot bien xoa luat {name} khong do"
PY

run "P77 design-pass vong lap owner-phan-ung + cam tu cham (E6)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
N = lambda s: re.sub(r"\s+", " ", s)
def check(text):
    tx = N(text); errs = []
    if "Reload" not in tx: errs.append("thieu buoc reload trong nhip vong lap")
    if "phản ứng bằng lời" not in tx: errs.append("thieu buoc cho owner phan ung bang loi")
    if "tự chấm thẩm mỹ thay owner" not in tx: errs.append("thieu cau cam tu cham tham my")
    return errs
assert check(t) == [], f"ban nguyen ven phai XANH: {check(t)}"
mut = N(t).replace("tự chấm thẩm mỹ thay owner", "đánh giá")
assert any("thieu cau cam tu cham tham my" in e for e in check(mut)), "dot bien xoa cau cam khong do"
PY

run "P78 design-pass ket phien: duong capture rieng + cam CT2 + provenance + states (E7)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
N = lambda s: re.sub(r"\s+", " ", s)
def check(text):
    tx = N(text); errs = []
    if "evidence/design-pass/" not in tx: errs.append("design-pass dang tro vao lan CT2")
    if "KHÔNG ghi vào `evidence/design/`" not in tx: errs.append("design-pass dang tro vao lan CT2")
    if "provenance.json" not in tx: errs.append("thieu cau cam provenance.json")
    if "hỏi owner danh sách state" not in tx: errs.append("thieu nhanh hoi owner danh sach state")
    return errs
assert check(t) == [], f"ban nguyen ven phai XANH: {check(t)}"
m1 = N(t).replace("evidence/design-pass/", "evidence/design/")
assert any("design-pass dang tro vao lan CT2" in e for e in check(m1)), "dot bien doi duong capture khong do"
m2 = t.replace("provenance.json", "prov-file")
assert any("thieu cau cam provenance.json" in e for e in check(m2)), "dot bien xoa cam provenance khong do"
m3 = N(t).replace("hỏi owner danh sách state", "chụp mặc định")
assert any("thieu nhanh hoi owner danh sach state" in e for e in check(m3)), "dot bien xoa nhanh states khong do"
PY

run "P79 design-pass khuon marker: round-trip + than tro toi marker (E8)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
def extract(text):
    m = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>", text, re.S)
    if not m:
        return None, ["KHONG rut duoc DESIGN-PASS-NOTE-TEMPLATE"]
    return m.group(1), []
block, errs = extract(t)
assert errs == [], errs
# Fixture SINH TU khuon rut duoc — khong viet tay khuon ben doc.
fx = (block
      .replace("<slug>", "fx-slug")
      .replace("<ISO UTC>", "2026-07-30T00:00:00Z")
      .replace("<url đã mở>", "http://localhost:3000/proto/fx-slug")
      .replace("<real-components|scaffold|static>", "real-components")
      .replace("<tên-skill-đã-nạp|repo-tokens|shadcn-default>", "shadcn-default")
      .replace("[<danh sách state đã duyệt>]", "[default, error]")
      .replace("<n>", "2")
      .replace("<state>", "default").replace("<breakpoint>", "mobile-375")
      .replace("<theme>", "light").replace("<file>", "default--mobile-375")
      .replace("<finding — đã đổi gì, 1 dòng/finding>", "chinh spacing card")
      .replace("<finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>", "thieu variant nut nguy hiem"))
lines = fx.splitlines()
assert lines and lines[0] == "---", "khuon khong bat dau bang frontmatter"
end = lines[1:].index("---") + 1
fm = {}
for ln in lines[1:end]:
    if ":" in ln:
        fm[ln.split(":", 1)[0].strip()] = ln.split(":", 1)[1].strip()
want = ["slug", "at", "route", "material", "ds_skill", "states", "breakpoints", "themes", "patched", "deferred"]
missing = [k for k in want if k not in fm]
assert not missing, f"frontmatter khuon thieu truong: {missing}"
body = "\n".join(lines[end + 1:])
assert "### Nhóm 1" in body and "### Nhóm 2" in body, "khuon thieu 2 nhom Findings"
# Than nghi thuc phai TRO TOI khuon — chong marker-trang-tri/mo-coi.
full = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n.*?\nDESIGN-PASS-NOTE-TEMPLATE>>>", t, re.S).group(0)
outside = t.replace(full, "")
def check_ref(text_outside):
    if "DESIGN-PASS-NOTE-TEMPLATE" not in text_outside or "design-pass.md" not in text_outside:
        return ["khuon template mo coi — than nghi thuc khong tro toi marker"]
    return []
assert check_ref(outside) == [], "doi chung duong: than nguyen ven phai tro toi marker"
mut_out = re.sub(r"cặp marker\s+`DESIGN-PASS-NOTE-TEMPLATE`", "cặp marker", outside)
assert check_ref(mut_out) == ["khuon template mo coi — than nghi thuc khong tro toi marker"], \
    "dot bien xoa tham chieu marker khong do dung thong diep"
mut = t.replace("<<<DESIGN-PASS-NOTE-TEMPLATE", "", 1)
b2, errs2 = extract(mut)
assert b2 is None and errs2 == ["KHONG rut duoc DESIGN-PASS-NOTE-TEMPLATE"], \
    "dot bien xoa marker khong do dung thong diep"
PY

run "P80 design-pass engine-clean + mot mat phang (E9)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
files = [root / "skills/design-pass/SKILL.md",
         root / "plugins/acceptance-gate/skills/design-pass/SKILL.md"]
texts = {str(p.relative_to(root)): p.read_text(encoding="utf-8") for p in files}
rt = (root / "tests/plugins/run-tests.sh").read_text(encoding="utf-8")
# Marker GHÉP MẢNH — nếu để nguyên chuỗi, find() khớp chính literal trong
# source của case này trước khi tới comment thật, vùng quét cụt mất đuôi P80
# + toàn bộ P81 mà mọi sanity vẫn xanh (finding S4 round 1).
BEGIN = "# --- design-pass cases " + "(P72-P81) begin ---"
END = "# --- design-pass cases " + "end ---"
b = rt.find(BEGIN)
e = rt.find(END, b + 1)
assert b != -1 and e != -1 and e > b, "khong tim thay vung case design-pass trong run-tests.sh"
region = rt[b:e]
# Anchor cũng GHÉP MẢNH — round 2 để nguyên chuỗi nên anchor tự khớp source
# của chính assert này, xoá cả P81 guard vẫn xanh (finding S4 round 2).
TAIL = "P81 design-pass" + " smoke"
assert TAIL in region, "vung quet cut duoi — thieu anchor P81 (thuoc phai gan vao vat)"
texts["tests:design-pass-region"] = region
# Pattern ghep manh de vung nay tu-quet khong tu-trung.
CONSUMER = ["one" + "hub", "deal" + "-page", "@one" + "hub", "ms" + "tar"]
SURFACE = ["claude.ai/" + "design", "/design" + "-sync", "/design" + "-login", "/design" + "-mockup"]
def check(text):
    low = text.lower()
    hits = [pat for pat in CONSUMER + SURFACE if pat.lower() in low]
    return [f"vat lieu consumer/surface ngoai trong design-pass: {h}" for h in hits]
assert len(texts) == 3 and all(len(x) > 200 for x in texts.values()), "sanity: vung quet rong/thieu"
for name, text in texts.items():
    assert check(text) == [], f"{name}: {check(text)}"
skill = texts["skills/design-pass/SKILL.md"]
m1 = skill + "\nOne" + "Hub"
assert any("vat lieu consumer/surface ngoai trong design-pass" in x for x in check(m1)), "tiem chuoi consumer khong do"
m2 = skill + "\n/design" + "-sync"
assert any("vat lieu consumer/surface ngoai trong design-pass" in x for x in check(m2)), "tiem chuoi surface ngoai khong do"
PY

run "P81 design-pass smoke DUONG ban mirror (E11)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
p = root / "plugins/acceptance-gate/skills/design-pass/SKILL.md"
assert p.exists(), "mirror thieu skills/design-pass — chay scripts/sync-plugin-packages.sh"
t = p.read_text(encoding="utf-8")
assert "name: design-pass" in t, "mirror SKILL.md khong doc duoc frontmatter name"
assert "DESIGN-PASS-NOTE-TEMPLATE" in t, "mirror SKILL.md thieu khuon marker"
PY
# --- design-pass cases end ---

# ── P82: ROUND-TRIP frontmatter opportunity-template <-> reader that ─────────
# Khuon rut tu CHINH template (marker OPP-FRONTMATTER-TEMPLATE), doc bang
# frontmatterField cua lib/evidence-core.js — reader ma hook/CI dung.
# Doi chung duong chay truoc, dot bien mat frontmatter chay sau.
run "P82 opportunity-template round-trip frontmatter (marker -> frontmatterField)" \
  node - "$ROOT" <<'JS'
const fs = require('fs');
const path = require('path');
const root = process.argv[2];
const tplPath = path.join(root, 'skills/acceptance/references/opportunity-template.md');
const tpl = fs.readFileSync(tplPath, 'utf8');
const core = require(path.join(root, 'lib/evidence-core.js'));
const m = tpl.match(/<!-- <<<OPP-FRONTMATTER-TEMPLATE -->\n```yaml\n([\s\S]*?)```\n<!-- OPP-FRONTMATTER-TEMPLATE>>> -->/);
if (!m) { console.error('KHONG rut duoc khuon OPP-FRONTMATTER-TEMPLATE tu template'); process.exit(1); }
const SAMPLE = { slug: 'demo-coho', feature: 'Demo', owner: 'a@b.c', stage: 'decided',
  decision: 'build', decided_by: 'a@b.c', decided_at: '2026-07-30T00:00:00Z',
  gate0_minutes: '6', base_commit: 'abc123', disposition: 'archive' };
let unknown = null;
const filled = m[1].replace(/\{(\w+)\}/g, (_, k) => {
  if (SAMPLE[k] === undefined) { unknown = k; return ''; }
  return SAMPLE[k];
});
if (unknown) { console.error('placeholder la [' + unknown + '] khong co trong SAMPLE — khuon va test da lech'); process.exit(1); }
// Doi chung DUONG: reader that doc dung tung key top-level.
for (const k of ['slug', 'stage', 'decision', 'decided_by', 'decided_at', 'owner']) {
  const v = core.frontmatterField(filled, k);
  if (v !== SAMPLE[k]) { console.error('reader doc key ' + k + ' = [' + v + '] nhung phai la [' + SAMPLE[k] + ']'); process.exit(1); }
}
// Dot bien: xoa dong --- DONG -> reader phai tra null (ghim hanh vi fail).
const broken = filled.replace(/\n---[ \t]*(\r?\n|$)(?![\s\S]*\n---)/, '\n');
if (broken === filled) { console.error('dot bien khong tac dung len khuon — regex xoa --- dong da chet'); process.exit(1); }
if (core.frontmatterField(broken, 'slug') !== null) {
  console.error('dot bien xoa --- dong ma reader van doc duoc — phep do da chet'); process.exit(1);
}
console.log('round-trip OK; dot bien mat frontmatter bi bat');
JS

# ── P83: opportunity-template du 8 section V1 + truong Nguon ngoai ───────────
# Anchor la cac muc DA DUNG THAT o V1 (trang-tu-van-v2) + luoi ke thua B1.
# Checker chay tren ban that (duong) roi tren tung ban dot bien (am).
run "P83 opportunity-template du muc V1 + luoi ke thua (kem doi chung am)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
text = (root / "skills/acceptance/references/opportunity-template.md").read_text(encoding="utf-8")

REQUIRED = [
    "OPP-FRONTMATTER-TEMPLATE",
    "## Vấn đề & ai gặp",
    "## Giả định chốt sinh tử",
    "## Ngưỡng chết / ngưỡng UAT",
    "## Kết quả prototype",
    "## Nguồn ngoài & phạm vi kế thừa",
    "## Cổng 0",
    "## Thước đo thành công",
    "## Bảng nợ kế thừa",
    "## Out of scope từ khám phá",
    "triết-lý/logic",
    "ngôn-ngữ-thiết-kế/hình-thái",
    "không phân loại = chưa đủ điều kiện ký Cổng 0",
]
def missing(t):
    return [n for n in REQUIRED if n not in t]

# Doi chung DUONG: ban that phai du het.
assert missing(text) == [], f"template thieu: {missing(text)}"
# Doi chung AM: pha tung anchor trong ban sao (MOI lan xuat hien — vai anchor
# co mat >1 cho) -> checker PHAI bao thieu dung anchor do.
for needle in REQUIRED:
    mutated = text.replace(needle, needle[:-1] + "_")
    got = missing(mutated)
    assert needle in got, f"dot bien go [{needle}] ma checker khong do — phep do chet"
PY

# ── P84: gap-probe platform-fit cross-check o CA HAI harness ────────────────
# Luoi B1 (retro V1): khong tang nao hoi platform-fit. Ve nay phai nam TRONG
# danh sach cross-check bat buoc cua gap-probe, khong phai cho khac trong file.
run "P84 gap-probe co ve platform-fit (Claude + Codex, kem doi chung am)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
PINS = {
    "feature-loop/skills/feature-loop/SKILL.md":
        "artifact có tuân chuẩn UI/plugin sẵn có của repo tiêu thụ không; skill/quy định nào của repo LẼ RA phải nạp mà chưa nạp",
    "codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md":
        "platform-fit: does the artifact set follow the consuming repo's existing",
}
for rel, needle in PINS.items():
    text = (root / rel).read_text(encoding="utf-8")
    assert needle in text, f"{rel} thieu ve platform-fit"
    # ve phai nam TRONG doan cross-check bat buoc (y (4)), khong troi cho khac
    idx = text.find(needle)
    ctx = text[max(0, idx - 700):idx]
    assert "cross-check" in ctx, f"{rel}: ve platform-fit khong nam trong muc cross-check"
    # doi chung am: go ve trong ban sao -> pin phai truot
    assert needle not in text.replace(needle, "", 1), f"{rel}: dot bien khong hieu luc"
PY

# ── P85: GOAL-TEMPLATE — SKILL la nguon runtime, GUIDE la ban nguoi doc ──────
# B4 (retro V1): package feature-loop KHONG ship GUIDE nen "in theo GUIDE" chet
# o runtime — template nay nhung thang vao SKILL. P85 giu 2 ban khop tung ky tu
# (duong truoc, dot bien sau) va noi LENH IN voi khoi (gap-probe F1).
run "P85 GOAL-TEMPLATE nhung trong SKILL, khop GUIDE, lenh in noi voi khoi" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
RX = re.compile(r"<!-- <<<GOAL-TEMPLATE -->\n```\n([\s\S]*?)```\n<!-- GOAL-TEMPLATE>>> -->")
skill_p = "feature-loop/skills/feature-loop/SKILL.md"
guide_p = "GUIDE.md"
def block(rel, text):
    m = RX.search(text)
    assert m, f"{rel}: KHONG rut duoc khoi GOAL-TEMPLATE qua marker"
    return m.group(1).strip()
skill_t = (root / skill_p).read_text(encoding="utf-8")
guide_t = (root / guide_p).read_text(encoding="utf-8")
sb, gb = block(skill_p, skill_t), block(guide_p, guide_t)
# Doi chung DUONG: hai ban nguyen ven phai khop truoc khi tin phep so.
assert sb == gb, f"GOAL-TEMPLATE lech giua {skill_p} va {guide_p} — dong bo lai 2 khoi marker"
# Tinh chat noi dung template.
assert sb.startswith("/goal "), "template phai bat dau bang /goal "
assert "verified" in sb, "template phai neo dieu kien verified"
assert "REJECT quá 3 round" in sb, "template phai co loi thoat escalate (REJECT qua 3 round)"
assert "signed-off" not in sb, "template KHONG duoc nham dich signed-off"
# Lenh in phai NOI voi khoi — khong chi khoi ton tai (gap-probe F1).
assert "IN NGUYÊN VĂN khối GOAL-TEMPLATE" in skill_t, "GATE 1 thieu lenh in-mac-dinh tham chieu dich danh khoi marker"
assert "template mục /goal trong GUIDE, điền sẵn slug" not in skill_t, "SKILL van tro template sang GUIDE — goc benh B4 chua cat"
# Doi chung AM: dot bien khoi trong ban sao (bo nho) -> phep so phai DO.
mutated = skill_t.replace("sau 15 turns", "sau 16 turns", 1)
assert mutated != skill_t, "dot bien khong tac dung — chuoi neo da doi"
assert block(skill_p, mutated) != gb, f"dot bien khoi trong {skill_p} ma van khop {guide_p} — phep so GOAL-TEMPLATE da chet"
# Doi chung khong-pha: dong /goal native cua codex SKILL con nguyen (AC-9) —
# chinh feature nay sua cung file codex, khong duoc cat mat no.
codex_t = (root / "codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md").read_text(encoding="utf-8")
assert "suggest the native Codex `/goal` command" in codex_t, "codex SKILL mat dong goi y /goal native"
assert "Never create or suggest a goal that reaches" in codex_t, "codex SKILL mat rao chan signed-off"
PY

# ── P86: S1 bat nap skill chuan-plugin/DS cua repo tieu thu (2 harness) ──────
# Luoi B1: doi trong chuan noi phai len ban can TRUOC khi sinh artifact.
# Key vang -> ghi chu 1 dong, KHONG chan (khong phai hard-gate).
run "P86 S1 doc feature_loop.ui_standards_skill (Claude + Codex, kem doi chung am)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
CASES = {
    "feature-loop/skills/feature-loop/SKILL.md": [
        "feature_loop.ui_standards_skill",
        "BẮT BUỘC invoke skill đó ngay",
        "KHÔNG chặn",
    ],
    "codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md": [
        "feature_loop.ui_standards_skill",
        "you MUST invoke that skill",
        "do not block",
    ],
}
for rel, pins in CASES.items():
    text = (root / rel).read_text(encoding="utf-8")
    key = pins[0]
    idx = text.find(key)
    assert idx >= 0, f"{rel} thieu key {key}"
    # cac ve hanh vi phai nam trong CUNG doan quanh key (mot buoc, khong rai rac)
    ctx = text[max(0, idx - 200):idx + 900]
    for pin in pins[1:]:
        assert pin in ctx, f"{rel}: [{pin}] khong nam cung doan voi key ui_standards_skill"
    # doi chung am: go key trong ban sao -> pin phai truot
    assert key not in text.replace(key, "ui_standards_key_bi_go"), f"{rel}: dot bien khong hieu luc"
# Vi du trong van engine phai la placeholder TRUNG TINH — khong mang ten san
# pham cua repo tieu thu (bat bien "kit khong chua", finding S4-r2 #3).
for rel in ["feature-loop/skills/feature-loop/SKILL.md", "GUIDE.md"]:
    t = (root / rel).read_text(encoding="utf-8")
    assert "create-onehub-plugin" not in t, f"{rel}: vi du mang ten repo tieu thu — dung placeholder create-<org>-plugin"
assert "create-<org>-plugin" in (root / "GUIDE.md").read_text(encoding="utf-8"), "GUIDE mat vi du placeholder cho ui_standards_skill"
PY

# ── P87: S1-D — lane cua feature cham UI la design-pass TRUOC Gate 1 ─────────
# S1-D visual-first (quyet 30/07): Gate 1 duyet UI tren ban bam duoc. Descope
# phai co ten trong so quyet dinh. Bang CT1/CT2 cu GIU NGUYEN (duong doc-cu,
# P20 canh) — case nay chi ghim lane moi + cau Gate 1.
run "P87 lane S1-D tro design-pass + Gate 1 ban bam duoc (kem doi chung am)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
rel = "feature-loop/skills/feature-loop/SKILL.md"
text = (root / rel).read_text(encoding="utf-8")
# Lane moi: mot doan, du 3 ve. Neo vao HEADING dam cua doan — cac cho khac
# trong file (bang tra CT1, S1#6) cung nhac cum "Nghi thức S1-D" khi tro ve day.
idx = text.find("**Nghi thức S1-D (")
assert idx >= 0, f"{rel} thieu doan Nghi thức S1-D"
ctx = text[idx:idx + 1200]
assert "design-pass" in ctx and "TRƯỚC Gate 1" in ctx, "lane S1-D phai tro design-pass TRUOC Gate 1"
assert '"bỏ design-pass — ' in ctx, "descope lane phai co chuoi may-doc 'bỏ design-pass — '"
assert "BẢN BẤM ĐƯỢC" in ctx, "lane S1-D thieu menh de ban bam duoc"
# Gate 1: trinh ban bam duoc trong muc GATE 1 (sau heading). Chot BIEN cua lat
# cat phai ton tai — find() tra -1 se lang le bien pin theo-section thanh pin
# ca-file (lop bug section-scan da sua o 1.20.1).
g1 = text.find("## GATE 1")
assert g1 >= 0, "thieu muc GATE 1"
s2 = text.find("## S2", g1)
assert s2 > g1, "khong tim thay heading '## S2' sau GATE 1 — lat cat section chet, pin se phinh ca file"
g1ctx = text[g1:s2]
assert "BẢN BẤM ĐƯỢC" in g1ctx, "muc GATE 1 thieu cau trinh ban bam duoc cho UI feature"
assert "ui_standards_skill" in g1ctx, "muc GATE 1 thieu dong ghi chu vang ui_standards_skill"
# Cau hoi lane CU (mockup vs static-only) phai da duoc thay the — va KHONG con
# tham chieu mo coi nao toi no trong toan file (round 2, AC-10 mo rong: sua mot
# cho ma sot tham chieu cung-hinh-dang la lop loi CLAUDE.md goi ten).
assert "Surface mới/redesign → vẽ mockup" not in text, "cau hoi lane cu van con — chua wire S1-D"
assert "câu hỏi lane" not in text, "van con tham chieu mo coi 'câu hỏi lane' — chi dan S1 tu mau thuan"
# Duong doc-cu con nguyen: bang tra CT1/CT2 dung 1 lan moi cong tac (nhu P20).
assert text.count("| **CT1") == 1 and text.count("| **CT2") == 1, "bang tra CT1/CT2 bi pha"
# Doi chung am: go MOI lan xuat hien trong ban sao (cum nay co mat >1 cho:
# bang tra CT1, doan chinh, S1#6) -> pin phai truot.
mutated = text.replace("Nghi thức S1-D", "Nghi thuc da go")
assert "Nghi thức S1-D" not in mutated, "dot bien khong hieu luc"
# Quet LOP ra ngoai mot file: design-subtrack (nguon design-loop, cung tieng
# Viet) khong duoc con tro ve cau hoi lane da xoa (finding S4-r2 #1).
ds = (root / "design-loop/skills/design-subtrack/SKILL.md").read_text(encoding="utf-8")
assert "câu hỏi lane" not in ds, "design-subtrack van tro ve 'câu hỏi lane' da xoa — chi dan lech giua 2 plugin"
PY

# ── P88: release co chu dich — version floor + description khop hanh vi ─────
# Consumer chi nhan luoi qua release: quen bump = feature ship ma hieu luc 0.
# Floor semver (>=), KHONG ghim literal == — tranh vong "bump -> stale" (P03).
run "P88 version floor 1.29/1.21 + description nhac hanh vi moi" \
  python3 - "$ROOT" <<'PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
def ver(rel):
    return tuple(int(x) for x in json.loads((root / rel).read_text())["version"].split("."))
def desc(rel):
    return json.loads((root / rel).read_text())["description"]
assert ver(".claude-plugin/plugin.json") >= (1, 29, 0), "acceptance-gate chua bump toi 1.29.0"
assert ver("feature-loop/.claude-plugin/plugin.json") >= (1, 21, 0), "feature-loop chua bump toi 1.21.0"
assert ver("codex/feature-loop-codex/.codex-plugin/plugin.json") >= (1, 21, 0), "feature-loop-codex chua bump toi 1.21.0"
# Description phai nhac hanh vi moi (keyword chuc nang, on dinh qua cac ban sau):
for kw in ("opportunity-template", "DECISION-DIAGRAM-SURFACES"):
    assert kw in desc(".claude-plugin/plugin.json"), f"desc acceptance-gate thieu {kw}"
d = desc("feature-loop/.claude-plugin/plugin.json")
for kw in ("ui_standards_skill", "design-pass", "GOAL-TEMPLATE", "LOOP-PICTURE-CLAUSE"):
    assert kw in d, f"desc feature-loop thieu {kw}"
assert "platform-fit" in desc("codex/feature-loop-codex/.codex-plugin/plugin.json"), "desc codex thieu platform-fit"
# Doi chung am cua phep so semver: version thap hon floor phai truot.
assert not ((1, 20, 1) >= (1, 21, 0)), "phep so semver chet — tuple compare khong con dung"
PY

# ── P89-P96: luat ngon ngu mat nguoi (ngon-ngu-mat-nguoi) ───────────────────
# Bat bien kho: moi case chay ban NGUYEN VEN truoc (doi chung DUONG) roi moi
# dot bien, va ghim DUNG THONG DIEP chu khong chi ma thoat.

run "P89 ban luat: neo vao dung vat — 6 luat, 2 phep thu (dinh nghia), vi du, mien tru, nguong N5, dong tu dien N6 (E1-E4)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/acceptance/references/human-facing-language.md").read_text(encoding="utf-8")

# NEO vao DUNG VAT, khong tim chuoi tren toan file. Round 3 bat hai lan cung mot
# lop: "CONTEXT.md" va "Xoá-tên-máy" moi chuoi xuat hien HAI lan trong file, nen
# pha hong dung cho can do van XANH vi lan xuat hien thu hai giu den.
def section(text, heading):
    m = re.search(rf"^## {re.escape(heading)}\s*$\n([\s\S]*?)(?=^## |\Z)", text, re.M)
    return m.group(1) if m else None

def check(text):
    errs = []
    m = re.search(r"<!-- <<<HFL-LAW-TABLE -->\n([\s\S]*?)<!-- HFL-LAW-TABLE>>> -->", text)
    if not m:
        return ["KHONG rut duoc HFL-LAW-TABLE"]
    for n in range(1, 7):
        if not re.search(rf"^\| N{n} \| \S", m.group(1), re.M):
            errs.append(f"thieu luat N{n}")

    # AC-1 ve "hai phep thu": neo vao muc dinh nghia, khong phai toan van ban.
    tests = section(text, "Hai phép thử (rẻ, làm được trong vài giây)")
    if tests is None:
        errs.append("thieu muc dinh nghia hai phep thu")
    else:
        for name in ("Xoá-tên-máy", "Người-thứ-ba"):
            if not re.search(rf"^- \*\*{re.escape(name)}\*\*:", tests, re.M):
                errs.append(f"thieu phep thu {name}")

    outside = text.replace(m.group(0), "")
    for n in range(1, 7):
        if not re.search(rf"^\| N{n} \| .+ \| .+ \|", outside, re.M):
            errs.append(f"luat N{n} chua co vi du TRUOC/SAU")
    for machine in ("evals.yaml", "run-log.jsonl", "frontmatter"):
        if machine not in text:
            errs.append(f"ve mien tru khong goi dich danh {machine}")
    if "KHÔNG ÁP" not in text:
        errs.append("thieu ve pham vi KHONG ap")
    if not re.search(r"ba bước nối tiếp hoặc[\s\S]{0,40}hai nhánh rẽ", text):
        errs.append("N5 khong co nguong kich hoat")

    # AC-3: neo vao DUNG dong van hanh cua N6. Chuoi CONTEXT.md con xuat hien o
    # muc "Tu moi ... dua vao tu dien" — tim tren toan file la do nham cho do.
    if not re.search(r"^\*\*Từ điển sản phẩm sống ở đâu \(N6\):\*\*[^\n]*CONTEXT\.md", text, re.M):
        errs.append("N6 khong chi dich tu dien")
    return errs

assert check(t) == [], check(t)                                  # doi chung DUONG

m1 = re.sub(r"^\| N4 \|.*$", "", t, count=1, flags=re.M)
assert "thieu luat N4" in check(m1), "dot bien xoa luat N4 khong do dung thong diep"

m2 = t.replace("ba bước nối tiếp hoặc", "nhiều bước hoặc")
assert "N5 khong co nguong kich hoat" in check(m2), "dot bien xoa nguong khong do dung thong diep"

m3 = t.replace("KHÔNG ÁP", "xxx", 1)
assert "thieu ve pham vi KHONG ap" in check(m3), "dot bien xoa ve mien tru khong do dung thong diep"

m4 = t.replace("| N6 | Bật CT-S cho slug này |", "|", 1)
assert "luat N6 chua co vi du TRUOC/SAU" in check(m4), "dot bien xoa vi du N6 khong do dung thong diep"

# Dot bien E4 KHAI trong evals.yaml — round 3 phat hien no chua bao gio ton tai.
m5 = re.sub(r"^\*\*Từ điển sản phẩm sống ở đâu \(N6\):\*\*[^\n]*$",
            "**Từ điển sản phẩm sống ở đâu (N6):** từ điển sản phẩm của kho đang làm.",
            t, count=1, flags=re.M)
assert "N6 khong chi dich tu dien" in check(m5), \
    "dot bien thay dong N6 bang cum chung chung khong do dung thong diep"

# Dot bien cho ve "hai phep thu" — xoa DINH NGHIA, giu nguyen cac cho NHAC TEN.
m6 = re.sub(r"^- \*\*Xoá-tên-máy\*\*:[\s\S]*?(?=^- \*\*Người-thứ-ba\*\*:)", "", t, count=1, flags=re.M)
assert "thieu phep thu Xoá-tên-máy" in check(m6), \
    "dot bien xoa dinh nghia phep thu khong do dung thong diep"
PY

run "P92 hai khuon trinh bay: marker duy nhat + round-trip bang 3 cot + so do mermaid (E9, E10)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/acceptance/references/human-facing-language.md").read_text(encoding="utf-8")
COLS = ["Người dùng thấy gì khác", "Đụng đâu", "Phục vụ tiêu chí"]

def block(text, name):
    m = re.search(rf"<!-- <<<{name} -->\n([\s\S]*?)<!-- {name}>>> -->", text)
    return m.group(1) if m else None

# luat tach o bang markdown cua kit — cung luat scripts/gate-card.js dung
def rows(md):
    out = []
    for l in md.splitlines():
        if not l.strip().startswith("|"):
            continue
        cells = [c.strip() for c in l.split("|")[1:-1]]
        if not cells or all(re.fullmatch(r":?-+:?", c) for c in cells):
            continue
        out.append(cells)
    return out

def check(text):
    errs = []
    tb = block(text, "PLAN-SUMMARY-TABLE-TEMPLATE")
    dg = block(text, "DECISION-DIAGRAM-TEMPLATE")
    lead = text.split("<!-- <<<DECISION-DIAGRAM-TEMPLATE -->")[0]
    tail = lead.rstrip().rsplit("\n\n", 1)[-1]
    if "mặt phẳng cụ thể" not in tail:
        errs.append("khoi vi du khong noi ro mat phang")
    if tb is None:
        errs.append("khong rut duoc khuon bang")
    if dg is None:
        errs.append("khong rut duoc khuon so do")
    if tb is not None:
        r = rows(tb)
        if not r or r[0] != COLS:
            errs.append(f"khuon bang sai tieu de cot: {r[0] if r else None}")
        for i, row in enumerate(r):
            if len(row) != 3:
                errs.append(f"dong {i} khong du 3 o (co {len(row)})")
            for c in row:
                if "·" in c or ";" in c:
                    errs.append("o bang nhoi nhieu viec — N4")
        if len(r) < 2:
            errs.append("khuon bang thieu dong vi du")
    if dg is not None:
        f = re.search(r"```(\w*)\n([\s\S]*?)```", dg)
        if not f or f.group(1) != "mermaid":
            errs.append("khoi so do khong khai mermaid")
        else:
            body = f.group(2)
            labels = re.findall(r"[\[\{]([^\]\}]+)[\]\}]", body)
            if len(labels) < 2:
                errs.append("so do it hon 2 nut")
            if "-->" not in body:
                errs.append("so do khong co canh")
            for lb in labels:
                # <br/> la thang xuong dong cua mermaid, khong phai duong dan —
                # go truoc khi soi, neu khong moi nhan co xuong dong deu bi ket
                # oan la ten may (round 1 cua case nay dam dung bay do).
                bare = re.sub(r"<br\s*/?>", " ", lb)
                if re.search(r"[\w-]+\.(md|js|mjs|json|yaml|yml|sh)\b|\w/\w", bare):
                    errs.append(f"nhan nut la ten may: {lb}")
    return errs

assert check(t) == [], check(t)                                  # doi chung DUONG
assert t.count("<<<PLAN-SUMMARY-TABLE-TEMPLATE") == 1, "khuon bang khong duy nhat"
assert t.count("<<<DECISION-DIAGRAM-TEMPLATE") == 1, "khuon so do khong duy nhat"

def has(errs, frag):
    return any(frag in e for e in errs)

m1 = t.replace("| Đụng đâu ", "", 1)
assert has(check(m1), "sai tieu de cot"), "dot bien bo 1 cot khong do dung thong diep"

m2 = t.replace("| Phục vụ tiêu chí |", "| Phục vụ tiêu chí | Cột thừa |", 1)
assert has(check(m2), "sai tieu de cot"), "dot bien them cot 4 khong do dung thong diep"

m3 = t.replace("Người duyệt đọc được bảng kế hoạch bằng tiếng sản phẩm",
               "Sửa bên viết · sửa bên đọc", 1)
assert has(check(m3), "nhoi nhieu viec"), "dot bien nhoi 2 viec vao 1 o khong do dung thong diep"

m4 = t.replace("```mermaid", "```", 1)
assert has(check(m4), "khong khai mermaid"), "dot bien bo khai bao ngon ngu khong do dung thong diep"

m5 = t.replace("A[Người duyệt mở thẻ]", "A[gate-card.js]", 1)
assert has(check(m5), "nhan nut la ten may"), "dot bien nhan nut ten file khong do dung thong diep"

# Hai dot bien duoi day E9 DA KHAI tu dau nhung round 3 phat hien chung chua bao
# gio ton tai — hai nhanh "khong rut duoc khuon ..." chua tung bi da RED.
m6 = t.replace("<!-- <<<PLAN-SUMMARY-TABLE-TEMPLATE -->", "", 1)
assert has(check(m6), "khong rut duoc khuon bang"), \
    "dot bien xoa marker mo cua khuon bang khong do dung thong diep"

m8 = t.replace("một mặt phẳng cụ thể", "một cách", 1)
assert has(check(m8), "khong noi ro mat phang"), \
    "dot bien xoa nhan mat phang cua khoi vi du khong do dung thong diep"

m7 = t.replace("<!-- <<<DECISION-DIAGRAM-TEMPLATE -->", "", 1)
assert has(check(m7), "khong rut duoc khuon so do"), \
    "dot bien xoa marker mo cua khuon so do khong do dung thong diep"
PY

run "P96 tu dien: rut tu qua marker HFL-GLOSSARY-TERMS roi tra CONTEXT.md (E14)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
ref = (root / "skills/acceptance/references/human-facing-language.md").read_text(encoding="utf-8")
ctx = (root / "CONTEXT.md").read_text(encoding="utf-8")
m = re.search(r"<!-- <<<HFL-GLOSSARY-TERMS -->\n([\s\S]*?)<!-- HFL-GLOSSARY-TERMS>>> -->", ref)
assert m, "KHONG rut duoc HFL-GLOSSARY-TERMS"
terms = [l.strip()[2:].strip() for l in m.group(1).splitlines() if l.strip().startswith("- ")]
assert len(terms) >= 3, f"chi rut duoc {len(terms)} tu — parser hong hoac danh sach rong"

def check(glossary):
    return [f"tu '{x}' chua co muc trong tu dien" for x in terms
            if not re.search(rf"^\*\*{re.escape(x)}\*\*:", glossary, re.M | re.I)]

assert check(ctx) == [], check(ctx)                              # doi chung DUONG
# Tu moi cham mot khai niem DA CO trong tu dien thi muc cua no phai noi ro khac
# o cho nao — khong thi tu dien co hai tu cho hai thu ma nguoi doc khong phan
# biet duoc (finding S4-r1).
# Danh sach MONG DOI ghim cung — KHONG suy tu chinh khoi dang do. Ban truoc
# bao boc ca rang nay trong `if "mặt phẳng" in terms:`, nen go hai tu khoi khoi
# la go luon yeu cau: da tai hien duoc, go 2 tu o CA HAI noi -> suite van XANH.
MUST = ["mặt người", "mặt máy", "lỗ-kit", "mặt phẳng", "nhìn-thấy-hình"]
missing_must = [x for x in MUST if x not in terms]
assert not missing_must, f"khoi tu dien thieu tu bat buoc: {missing_must}"

# Doi chung am THAT: pha KHOI tu dien trong mot ban sao roi chay lai CHINH phep
# rut + phep kiem. Ban truoc chi lam so hoc tren hai list dung tai cho nen no
# hang dung — ca ban ghim-cung lan ban tu-gac deu qua, tuc no khong phan biet
# duoc dung lop loi no tu nhan la canh (bat o S4-r3).
def terms_of(law_text):
    mm = re.search(r"<!-- <<<HFL-GLOSSARY-TERMS -->\n([\s\S]*?)<!-- HFL-GLOSSARY-TERMS>>> -->", law_text)
    if not mm:
        return None
    return [l.strip()[2:].strip() for l in mm.group(1).splitlines() if l.strip().startswith("- ")]

_law_mut = ref.replace("- mặt phẳng\n", "", 1)
_t_mut = terms_of(_law_mut)
assert _t_mut is not None and [x for x in MUST if x not in _t_mut] == ["mặt phẳng"], \
    "go 'mat phang' khoi KHOI TU DIEN that ma phep kiem khong bao thieu — rang tu-gac"
    # Neo vao dung VE PHAN BIET, khong phai chi vao chu "Surface" — chu do con
    # xuat hien o cau giai thich nen kiem long se khong bao gio do.
def has_contrast(g):
    m = re.search(r"^\*\*Mặt phẳng\*\*:[\s\S]*?(?=^\*\*|\Z)", g, re.M)
    return bool(m) and "Khác **Surface**" in m.group(0)
assert has_contrast(ctx), "muc 'mat phang' khong neu ro khac Surface o cho nao"
assert not has_contrast(ctx.replace("Khác **Surface**", "Ghi chu them", 1)), \
    "dot bien go ve phan biet Surface khong lam phep do doi"
mut = re.sub(rf"^\*\*{re.escape(terms[0])}\*\*:.*?(?=^\*\*|\Z)", "", ctx,
             count=1, flags=re.M | re.S | re.I)
assert check(mut) == [f"tu '{terms[0]}' chua co muc trong tu dien"], \
    "dot bien xoa muc tu dien khong do dung thong diep"
PY

run "P90 tam cho tro nap ban luat + khuon MOI lan trinh + round-trip cau-ve-hinh (E5, E12, E6h)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
REF = "skills/acceptance/references/human-facing-language.md"
SITES = ["commands/acceptance-card.md", "commands/acceptance-report.md",
         "commands/acceptance-status.md",
         "feature-loop/skills/feature-loop/SKILL.md",
         "codex/acceptance-gate/skills/acceptance-card/SKILL.md",
         "codex/acceptance-gate/skills/acceptance-report/SKILL.md",
         "codex/acceptance-gate/skills/acceptance-status/SKILL.md",
         "codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md"]
LOOPS = (SITES[3], SITES[7])
assert len(SITES) == 8, "danh sach cho tro khong du 8"

# Khuon cau-ve-hinh: rut tu BAN LUAT (ben viet), tim trong hai ban vong lap
# (ben doc). Phep do DUONG thay cho ve phu dinh "khong ghim mot dinh dang nao" —
# danh sach cam tren khong gian mo khong bao gio du (gap-probe P1).
LAW = (root / REF).read_text(encoding="utf-8")
_m = re.search(r"<!-- <<<LOOP-PICTURE-CLAUSE -->\n([\s\S]*?)<!-- LOOP-PICTURE-CLAUSE>>> -->", LAW)
CLAUSE = _m.group(1).strip() if _m else None

def check(read):
    errs = []
    for rel in SITES:
        t = read(rel)
        if REF not in t:
            errs.append(f"{rel}: thieu duong dan ban luat")
        if "TRƯỚC khi viết" not in t:
            errs.append(f"{rel}: thieu menh lenh nap")
    for rel in LOOPS:
        t = read(rel)
        if "PLAN-SUMMARY-TABLE-TEMPLATE" not in t:
            errs.append(f"{rel}: thieu ten khuon bang")
        if CLAUSE is None:
            errs.append("khong rut duoc khuon LOOP-PICTURE-CLAUSE tu ban luat")
        elif CLAUSE not in t:
            errs.append(f"{rel}: cau ve hinh lech khuon mot-nguon")
        if "MỌI lần trình" not in t:
            errs.append(f"{rel}: pham vi khuon bi thu hep")
    return errs

live = lambda rel: (root / rel).read_text(encoding="utf-8")
assert check(live) == [], check(live)                            # doi chung DUONG

gone = SITES[5]
m1 = lambda rel: live(rel).replace(REF, "xxx") if rel == gone else live(rel)
assert f"{gone}: thieu duong dan ban luat" in check(m1), \
    "dot bien go pointer khoi 1 file khong do dung thong diep"

lp = LOOPS[0]
m2 = lambda rel: live(rel).replace("MỌI lần trình", "riêng T3") if rel == lp else live(rel)
assert f"{lp}: pham vi khuon bi thu hep" in check(m2), \
    "dot bien thu hep pham vi khuon khong do dung thong diep"

assert CLAUSE, "khong rut duoc khuon cau-ve-hinh tu ban luat"

# Ten bang tra ma KHUON tu nhac phai giai ra mot cap marker THAT trong ban luat.
# Danh sai ten roi lan deu ca ba noi thi ba ban van KHOP NHAU — da tai hien
# duoc: suite XANH trong khi ca hai harness tro toi mot bang khong ton tai.
def cited_marker_ok(law_text, clause):
    names = re.findall(r"`([A-Z][A-Z0-9-]+)`", clause)
    if not names:
        return ["khuon cau-ve-hinh khong nhac ten bang tra nao"]
    bad = []
    for n in names:
        if not re.search(rf"<!-- <<<{re.escape(n)} -->\n[\s\S]*?<!-- {re.escape(n)}>>> -->", law_text):
            bad.append(f"khuon nhac ten '{n}' nhung ban luat khong co cap marker do")
    return bad

assert cited_marker_ok(LAW, CLAUSE) == [], cited_marker_ok(LAW, CLAUSE)

# Tu dien cung tro toi bang tra BANG TEN. Cung chang con tro, cung lop loi:
# danh sai ten thi nguoi doc di tim mot bang khong ton tai (bat o S4-r3).
CTX = (root / "CONTEXT.md").read_text(encoding="utf-8")
_mp = re.search(r"^\*\*Mặt phẳng\*\*:[\s\S]*?(?=^\*\*|\Z)", CTX, re.M)
assert _mp, "CONTEXT.md khong co muc 'Mat phang'"
assert cited_marker_ok(LAW, _mp.group(0)) == [], cited_marker_ok(LAW, _mp.group(0))
_ctx_typo = _mp.group(0).replace("DECISION-DIAGRAM-SURFACES", "DECISION-DIAGRAM-SURFACE")
assert cited_marker_ok(LAW, _ctx_typo), \
    "danh sai ten bang tra trong tu dien ma khong bi bat — con tro chet van xanh"
_typo = CLAUSE.replace("DECISION-DIAGRAM-SURFACES", "DECISION-DIAGRAM-SURFACE")
assert cited_marker_ok(LAW.replace(CLAUSE, _typo, 1), _typo), \
    "danh sai ten bang tra trong khuon ma khong bi bat — con tro chet van xanh"
lp2 = LOOPS[1]
m3 = lambda rel: live(rel).replace(CLAUSE, CLAUSE.replace("kèm hình", "kèm sơ đồ"), 1) if rel == lp2 else live(rel)
assert f"{lp2}: cau ve hinh lech khuon mot-nguon" in check(m3), \
    "dot bien sua mot chu trong khuon khong do dung thong diep"
m4 = lambda rel: live(rel).replace(CLAUSE, "Điểm quyết định rắc rối thì vẽ bằng khối ký tự.", 1) if rel == lp2 else live(rel)
assert f"{lp2}: cau ve hinh lech khuon mot-nguon" in check(m4), \
    "dot bien tu dien dat kem ghim mot dinh dang khac khong bi bat"
PY

run "P91 con tro RUT TU file tro vao vat that tren cay nguon, kem dem sanity 8 (E6)" \
  python3 - "$ROOT" <<'PY'
import re, shutil, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
SITES = ["commands/acceptance-card.md", "commands/acceptance-report.md",
         "commands/acceptance-status.md",
         "feature-loop/skills/feature-loop/SKILL.md",
         "codex/acceptance-gate/skills/acceptance-card/SKILL.md",
         "codex/acceptance-gate/skills/acceptance-report/SKILL.md",
         "codex/acceptance-gate/skills/acceptance-status/SKILL.md",
         "codex/feature-loop-codex/skills/feature-loop-codex/SKILL.md"]
RX = re.compile(r"skills/acceptance/references/[\w.-]+\.md")

def check(base):
    errs, found = [], 0
    for rel in SITES:
        hits = sorted(set(RX.findall((base / rel).read_text(encoding="utf-8"))))
        if not hits:
            errs.append(f"{rel}: khong rut duoc con tro nao")
            continue
        found += 1
        for h in hits:
            if not (base / h).is_file():
                errs.append(f"{rel}: con tro tro file khong ton tai — {h}")
    if found != 8:
        errs.append(f"chi rut duoc con tro tu {found}/8 file — grep hong, khong phai sach")
    return errs

assert check(root) == [], check(root)                            # doi chung DUONG (cay that)

# Ban sao dung DU moi vat duoc tro toi — khong chi ban luat — de doi chung
# duong that su xanh; thieu mot vat la ban sao do san va phep do chet.
targets = set()
for rel in SITES:
    targets |= set(RX.findall((root / rel).read_text(encoding="utf-8")))
tmp = Path(tempfile.mkdtemp())
try:
    for rel in list(SITES) + sorted(targets):
        (tmp / rel).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(root / rel, tmp / rel)
    assert check(tmp) == [], f"ban sao NGUYEN VEN phai XANH truoc: {check(tmp)}"
    victim = tmp / "skills/acceptance/references/human-facing-language.md"
    victim.rename(victim.with_name("doi-ten.md"))
    errs = check(tmp)
    assert any("con tro tro file khong ton tai" in e for e in errs), \
        f"dot bien doi ten vat dich khong do dung thong diep: {errs}"
finally:
    shutil.rmtree(tmp)
PY

run "P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)" \
  python3 - "$ROOT" <<'PY'
import re, shutil, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
REF_REL = "skills/acceptance/references/human-facing-language.md"
SPEC_REL = "docs/specs/workflow-v2-spec.md"
RX = re.compile(r"<!-- <<<HFL-LAW-TABLE -->\n([\s\S]*?)<!-- HFL-LAW-TABLE>>> -->")

def law(text):
    m = RX.search(text)
    return m.group(1) if m else None

def compare(a_text, b_text):
    a, b = law(a_text), law(b_text)
    if a is None or b is None:
        return [f"thieu marker bang luat: {REF_REL}={a is not None} {SPEC_REL}={b is not None}"]
    if a != b:
        return [f"bang luat lech giua {REF_REL} va {SPEC_REL}"]
    return []

ref = (root / REF_REL).read_text(encoding="utf-8")
spec = (root / SPEC_REL).read_text(encoding="utf-8")
assert compare(ref, spec) == [], compare(ref, spec)              # doi chung DUONG
mut = spec.replace("Một dòng một ý", "Mot dong mot y", 1)
errs = compare(ref, mut)
assert errs and "bang luat lech" in errs[0] and REF_REL in errs[0] and SPEC_REL in errs[0], \
    f"dot bien sua 1 chu khong do dung thong diep (phai neu ten CA HAI file): {errs}"

# ── Vung quet ───────────────────────────────────────────────────────────────
# Loai DUNG ba muc AC-10 khai, cong ba muc ha tang KHONG phai cay nguon, moi muc
# ghi ly do. Ba vong truoc deu chet vi vung quet hep hon loi hua:
#   r1 danh-sach-cho-phep 8 thu muc  -> bo lot design-loop/ va vendor/
#   r2 khoet them docs/superpowers/  -> vung do dang chua ban sao that
#   r3 bo moi path co dau cham + loc duoi file -> bo lot .out-of-scope/ (nguon
#      that, CLAUDE.md goi dich danh) va moi ban sao nam trong .yaml/.txt/.py
# Nen bay gio: khong loc duoi file (doc NHI PHAN, so byte — cung het luon lop
# loi decode im lang), va chi loai nhung muc co TEN kem ly do.
SKIP_TOP = {"plugins", "_acceptance", "tests"}      # ba muc AC-10 khai
SKIP_INFRA = {".git", ".claude", "node_modules"}    # ruot VCS / cache phien / phu thuoc — khong phai nguon

def scan(base):
    out = []
    for p in base.rglob("*"):
        if not p.is_file():
            continue
        rel = p.relative_to(base).parts
        if rel[0] in SKIP_TOP:
            continue
        if any(x in SKIP_INFRA for x in rel):
            continue
        out.append(p)
    return out

EXPECT_DIRS = ["skills", "commands", "feature-loop", "codex", "lib", "scripts",
               "hooks", "docs", "design-loop", "vendor"]

files = scan(root)
dc = {d: 0 for d in EXPECT_DIRS}
for p in files:
    top = p.relative_to(root).parts[0]
    if top in dc:
        dc[top] += 1
empty = [d for d, n in dc.items() if n == 0]
assert not empty, f"thu muc nguon khong gop file nao (doi ten? xoa?): {empty}"
assert len(files) >= 40, f"chi quet duoc {len(files)} file — vung quet hong"

COL = ("Người dùng thấy" + " gì khác").encode()      # ghep manh — bay P80
DIAG = ("Đủ ba bước<br/>" + "hoặc hai nhánh?").encode()
LAW = ("Mã số là tra cứu, " + "không phải nội dung.").encode()
# AC-8 doi cap marker duy nhat TRONG TOAN KHO. Dem CAP THAT (mo + dong), khong
# dem lan nhac ten: mot so do ASCII trong tai lieu nhac ten marker la hop le,
# mot KHOI thu hai rut duoc thi khong.
PAIRS = {"PLAN-SUMMARY-TABLE-TEMPLATE": 1, "DECISION-DIAGRAM-TEMPLATE": 1,
         "HFL-GLOSSARY-TERMS": 1, "HFL-LAW-TABLE": 2,
         "DECISION-DIAGRAM-SURFACES": 1, "DECISION-PICTURE-TEST": 1,
         "LOOP-PICTURE-CLAUSE": 1, "DECISION-DRAW-MECHANISMS": 1}

def survey(base):
    body = {COL: 0, DIAG: 0, LAW: 0}
    where = {COL: [], DIAG: [], LAW: []}
    pair = {k: 0 for k in PAIRS}
    pair_where = {k: [] for k in PAIRS}
    for p in scan(base):
        b = p.read_bytes()
        for k in body:
            if k in b:
                body[k] += 1
                where[k].append(str(p.relative_to(base)))
        try:
            t = b.decode("utf-8")
        except UnicodeDecodeError:
            continue
        for name in pair:
            c = len(re.findall(rf"<!-- <<<{name} -->\n[\s\S]*?<!-- {name}>>> -->", t))
            if c:
                pair[name] += c
                pair_where[name].append(str(p.relative_to(base)))
    return body, where, pair, pair_where

def verdict(base):
    body, where, pair, pair_where = survey(base)
    errs = []
    if body[COL] != 1:
        errs.append(f"ten cot xuat hien o {body[COL]} file — khuon bang phai mot cho: {where[COL]}")
    if body[DIAG] != 1:
        errs.append(f"than so do xuat hien o {body[DIAG]} file — khuon so do phai mot cho: {where[DIAG]}")
    if body[LAW] != 2:
        errs.append(f"than luat xuat hien o {body[LAW]} file — chi duoc 2 cho da biet: {where[LAW]}")
    for name, want in PAIRS.items():
        if pair[name] != want:
            per_dir = {}
            for w in pair_where[name]:
                d0 = w.split("/")[0]
                per_dir[d0] = per_dir.get(d0, 0) + 1
            errs.append(f"cap marker {name} co {pair[name]} khoi (mong doi {want}) — theo thu muc goc {per_dir}, chi tiet {pair_where[name]}")
    return errs

assert verdict(root) == [], verdict(root)                         # doi chung DUONG

# Doi chung AM: GHI FILE THAT vao CA BA vung tung bi bo lot qua ba vong.
tmp = Path(tempfile.mkdtemp())
try:
    dst = tmp / "repo"
    subprocess.run(["rsync", "-a", "--exclude", ".git", "--exclude", ".claude",
                    "--exclude", "plugins", "--exclude", "node_modules",
                    f"{root}/", f"{dst}/"], check=True)
    assert verdict(dst) == [], f"ban sao NGUYEN VEN phai XANH truoc: {verdict(dst)}"
    src = (dst / REF_REL).read_text(encoding="utf-8")
    for rel in ("design-loop/skills/design-subtrack/BAN-SAO-THU.md",   # r1 bo lot
                "docs/superpowers/plans/BAN-SAO-THU.md",               # r2 khoet ra
                ".out-of-scope/BAN-SAO-THU.md"):                       # r3 bo lot
        plant = dst / rel
        plant.parent.mkdir(parents=True, exist_ok=True)
        plant.write_text(src, encoding="utf-8")
    e = verdict(dst)
    for frag in ("khuon bang phai mot cho", "khuon so do phai mot cho",
                 "chi duoc 2 cho da biet", "cap marker PLAN-SUMMARY-TABLE-TEMPLATE",
                 "cap marker DECISION-DIAGRAM-SURFACES", "cap marker DECISION-PICTURE-TEST",
                 "cap marker LOOP-PICTURE-CLAUSE", "cap marker DECISION-DRAW-MECHANISMS"):
        assert any(frag in x for x in e), f"trong ban sao that ma khong bat duoc '{frag}': {e}"
    # Chung minh RIENG rang vung dau-cham va duoi-file-la khong con la diem mu.
    shutil.rmtree(dst); subprocess.run(["rsync", "-a", "--exclude", ".git",
        "--exclude", ".claude", "--exclude", "plugins", "--exclude", "node_modules",
        f"{root}/", f"{dst}/"], check=True)
    only = dst / ".out-of-scope/ban-sao-thu.yaml"
    only.parent.mkdir(parents=True, exist_ok=True)
    only.write_text(src, encoding="utf-8")
    e2 = verdict(dst)
    assert any("khuon bang phai mot cho" in x for x in e2), \
        f"ban sao trong thu muc dau-cham voi duoi .yaml van lot luoi: {e2}"
finally:
    shutil.rmtree(tmp)
PY

run "P94 quyen tra lai tai cong + tien to so, ca hai ban lenh dung the (E13)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
CARDS = ["commands/acceptance-card.md",
         "codex/acceptance-gate/skills/acceptance-card/SKILL.md"]
PREFIX = "lỗ-kit — ngôn ngữ mặt người"

def check(read):
    errs = []
    for rel in CARDS:
        t = read(rel)
        if PREFIX not in t:
            errs.append(f"{rel}: thieu tien to so quyet dinh")
        if "revisit" not in t:
            errs.append(f"{rel}: khong noi ghi vao so bang entry nao")
        if "TRẢ LẠI" not in t and "reject the card" not in t:
            errs.append(f"{rel}: thieu quyen tra lai tai cong")
    return errs

live = lambda rel: (root / rel).read_text(encoding="utf-8")
assert check(live) == [], check(live)                            # doi chung DUONG
gone = CARDS[1]
mut = lambda rel: live(rel).replace(PREFIX, "xxx") if rel == gone else live(rel)
assert f"{gone}: thieu tien to so quyet dinh" in check(mut), \
    "dot bien go quyen tra lai khoi 1 harness khong do dung thong diep"
PY

run "P95 con tro giai duoc TRONG GOI da dong — goi khac goi phai qua bo giai (E7)" \
  python3 - "$ROOT" <<'PY'
import re, shutil, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
REF = "skills/acceptance/references/human-facing-language.md"
IN_PKG = ["skills/acceptance-card/SKILL.md", "skills/acceptance-report/SKILL.md",
          "skills/acceptance-status/SKILL.md"]
RX = re.compile(r"skills/acceptance/references/[\w.-]+\.md")

def check(pkg_ag, pkg_fl):
    errs = []
    for rel in IN_PKG:                    # cung goi: ghep goc goi phai ra vat that
        t = (pkg_ag / rel).read_text(encoding="utf-8")
        hits = sorted(set(RX.findall(t)))
        if not hits:
            errs.append(f"{rel}: khong rut duoc con tro nao trong goi")
        for h in hits:
            if not (pkg_ag / h).is_file():
                errs.append(f"pointer trong goi acceptance-gate tro file khong ton tai — {h}")
    fl = pkg_fl / "skills/feature-loop-codex/SKILL.md"
    t = fl.read_text(encoding="utf-8")
    # HAI dieu kien khac nhau, HAI thong diep khac nhau. Round 3 bat: dung chung
    # mot thong diep thi dot bien chi chung minh duoc dieu kien thu nhat, nhanh
    # con lai khong bao gio bi da RED rieng.
    if f"--plugin acceptance-gate --require {REF}" not in t:
        errs.append("goi feature-loop-codex thieu loi goi bo giai plugin")
    if "PLUGIN_ROOT}/" + REF in t:
        errs.append("goi feature-loop-codex ghep thang goc goi — goi nay khong chua ban luat")
    if not (pkg_fl / "scripts/resolve-plugin.mjs").is_file():
        errs.append("bo giai plugin vang trong goi feature-loop-codex")
    # Con tro phai giai toi tan VAT, khong chi toi FILE: tu trong goi phai rut
    # duoc khoi bang tra ma ban vong lap goi ten.
    # KHONG boc trong `if law.is_file()`: nhanh tu-gac khong co duong do rieng,
    # file bien mat thi phep do im lang. Cung lop vua go khoi P96 (S4-r2).
    law = pkg_ag / REF
    if not law.is_file():
        errs.append("ban luat vang trong goi acceptance-gate — khong co gi de rut bang tra")
    elif not re.search(r"<!-- <<<DECISION-DIAGRAM-SURFACES -->\n[\s\S]*?<!-- DECISION-DIAGRAM-SURFACES>>> -->",
                       law.read_text(encoding="utf-8")):
        errs.append("con tro giai duoc file nhung khong co bang tra trong goi")
    return errs

AG, FL = root / "plugins/acceptance-gate", root / "plugins/feature-loop-codex"
assert check(AG, FL) == [], check(AG, FL)                        # doi chung DUONG (goi that)
tmp = Path(tempfile.mkdtemp())
try:
    a2, f2 = tmp / "ag", tmp / "fl"
    shutil.copytree(AG, a2); shutil.copytree(FL, f2)
    assert check(a2, f2) == [], f"ban sao goi NGUYEN VEN phai XANH truoc: {check(a2, f2)}"
    (a2 / REF).rename((a2 / REF).with_name("doi-cho.md"))
    e1 = check(a2, f2)
    assert any("tro file khong ton tai" in x for x in e1), \
        f"dot bien di chuyen ban luat trong goi khong do dung thong diep: {e1}"
    shutil.rmtree(a2); shutil.copytree(AG, a2)
    fl2 = f2 / "skills/feature-loop-codex/SKILL.md"
    orig = fl2.read_text(encoding="utf-8")
    fl2.write_text(orig.replace(
        f"--plugin acceptance-gate --require {REF}", "${PLUGIN_ROOT}/" + REF),
        encoding="utf-8")
    lawp = a2 / REF
    lawt = lawp.read_text(encoding="utf-8")
    lawp.write_text(lawt.replace("<!-- <<<DECISION-DIAGRAM-SURFACES -->", "", 1), encoding="utf-8")
    e_sf = check(a2, f2)
    assert any("khong co bang tra trong goi" in x for x in e_sf), \
        f"go bang tra khoi ban luat trong goi ma khong bi bat: {e_sf}"
    lawp.write_text(lawt, encoding="utf-8")

    e2 = check(a2, f2)
    assert any("thieu loi goi bo giai plugin" in x for x in e2), \
        f"dot bien go loi goi bo giai khong do dung thong diep: {e2}"
    assert any("ghep thang goc goi" in x for x in e2), \
        f"dot bien ghep thang goc goi khong do dung thong diep: {e2}"
    # Nhanh THU HAI mot minh: GIU nguyen loi goi bo giai, chi THEM dang ghep
    # thang goc goi. Hai dieu kien dung chung thong diep thi case nay im lang.
    fl2.write_text(orig + "\n${PLUGIN_ROOT}/" + REF + "\n", encoding="utf-8")
    e3 = check(a2, f2)
    assert any("ghep thang goc goi" in x for x in e3), \
        f"nhanh ghep-thang-goc-goi mot minh khong bi bat: {e3}"
    assert not any("thieu loi goi bo giai" in x for x in e3), \
        f"nhanh thu nhat bao oan khi loi goi bo giai VAN CON: {e3}"
finally:
    shutil.rmtree(tmp)
PY

run "P97 hinh theo mat phang: bang tra co co che cu the + hang hoi thoai mac dinh + phep thu nhin-thay-hinh (E1-E3)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/acceptance/references/human-facing-language.md").read_text(encoding="utf-8")

def block(text, name):
    m = re.search(rf"<!-- <<<{name} -->\n([\s\S]*?)<!-- {name}>>> -->", text)
    return m.group(1) if m else None

def rows(md):
    out = []
    for l in md.splitlines():
        if not l.strip().startswith("|"):
            continue
        cells = [c.strip() for c in l.split("|")[1:-1]]
        if not cells or all(re.fullmatch(r":?-+:?", c) for c in cells):
            continue
        out.append(cells)
    return out

# Danh sach DONG cac co che ve — rut tu chinh ban luat, khong viet tay o ben doc.
def mechanisms(text):
    # NEO VAO MARKER. Ban truoc quet toan file bang regex tham: moi doan van xuoi
    # phia sau danh sach bi nuot vao, nen mot dong ghi chu CO nhay nguoc — ke ca
    # cau giai thich "dung viet nhu vay" — bien dung cum bi cam thanh co che hop
    # le. Da tai hien duoc truoc khi sua (finding S4-r1).
    b = block(text, "DECISION-DRAW-MECHANISMS")
    if b is None:
        return None
    return [" ".join(x.split()) for x in re.findall(r"`([^`]+)`", b)]

def check(text):
    errs = []
    tb = block(text, "DECISION-DIAGRAM-SURFACES")
    pt = block(text, "DECISION-PICTURE-TEST")
    mech = mechanisms(text)
    if tb is None:
        return ["khong rut duoc bang tra mat phang"]
    if mech is None or len(mech) < 3:
        errs.append("khong rut duoc danh sach dong cac co che ve")
        mech = mech or []
    r = rows(tb)
    body = r[1:] if r else []
    if len(body) < 3:
        errs.append(f"bang tra duoi ba mat phang (co {len(body)})")
    for row in body:
        if len(row) != 3:
            errs.append(f"hang bang tra khong du 3 o: {row}")
            continue
        if mech and " ".join(row[1].split()) not in mech:
            errs.append(f"cach-ve khong neu co che trong danh sach dong: {row[1]}")
    ok_rows = [x for x in body if len(x) == 3]
    # RANG BUOC QUAN HE, khong phai tu vung. Ban truoc chi hoi "o nay co nam
    # trong danh sach dong khong" — nen gop MOI mat phang ve CUNG mot co che van
    # XANH, tuc bang tra co the bao ve mermaid vao terminal thuan, dung ca truot
    # ma phep thu nhin-thay-hinh goi ten. Da tai hien (S4-r5).
    mechs = [" ".join(x[1].split()) for x in ok_rows]
    if len(set(mechs)) != len(mechs):
        dup = sorted({m for m in mechs if mechs.count(m) > 1})
        errs.append(f"hai mat phang tro cung mot co che ve: {dup}")
    defaults = [x for x in ok_rows if "mặc định" in x[2]]
    if len(defaults) != 1:
        errs.append(f"phai co DUNG MOT hang mac dinh, dang co {len(defaults)}")
    hoi_thoai = [x for x in ok_rows if "hội thoại" in x[0]]
    if not hoi_thoai:
        errs.append("thieu mat phang khung hoi thoai")
    elif not any("mặc định" in x[2] for x in hoi_thoai):
        errs.append("khong hang nao la mac dinh")
    if pt is None:
        errs.append("khong rut duoc phep thu nhin-thay-hinh")
    else:
        if "nhìn-thấy-hình" not in pt:
            errs.append("thieu ten phep thu nhin-thay-hinh")
        if "thiếu bộ vẽ" not in pt:
            errs.append("thieu ca truot cua phep thu nhin-thay-hinh")
    return errs

assert check(t) == [], check(t)                                  # doi chung DUONG

def has(errs, frag):
    return any(frag in e for e in errs)

# Bang co 4 hang: xoa MOT hang van con 3, chua vuot nguong. Dot bien phai that
# su di qua nguong moi chung minh duoc phep do song.
m1 = re.sub(r"^\| Terminal thuần \|.*$", "", t, count=1, flags=re.M)
m1 = re.sub(r"^\| Tài liệu trong kho \|.*$", "", m1, count=1, flags=re.M)
assert has(check(m1), "duoi ba mat phang"), \
    "dot bien xoa hai hang mat phang khong do dung thong diep"
m1b = re.sub(r"^\| Terminal thuần \|.*$", "", t, count=1, flags=re.M)
assert check(m1b) == [], \
    "xoa MOT hang (con du 3) ma van DO — nguong ba mat phang bi do sai"

m2 = t.replace("| Khung hội thoại | hình vẽ nội tuyến của phiên | ✔ mặc định |",
               "| Khung hội thoại | vẽ hình phù hợp với khung hội thoại | ✔ mặc định |", 1)
assert has(check(m2), "khong neu co che trong danh sach dong"), \
    "dot bien thay co che bang cum chung chung khong do dung thong diep (rang P0 gap-probe)"

GEN = "vẽ hình phù hợp với khung hội thoại"
m2b = t.replace("<!-- DECISION-DRAW-MECHANISMS>>> -->",
                "<!-- DECISION-DRAW-MECHANISMS>>> -->\n\nGhi chú: `" + GEN + "` la mo ta muc dich, dung viet nhu vay.\n", 1)
m2b = m2b.replace("| Khung hội thoại | hình vẽ nội tuyến của phiên | ✔ mặc định |",
                  "| Khung hội thoại | " + GEN + " | ✔ mặc định |", 1)
assert has(check(m2b), "khong neu co che trong danh sach dong"), \
    "ghi chu CO nhay nguoc NGOAI marker van noi duoc danh sach dong — phep rut chua neo vao marker"

m2c = t.replace("| Terminal thuần | hình bằng ký tự trong khối mã |",
                "| Terminal thuần | khối mermaid |", 1)
assert has(check(m2c), "cung mot co che ve"), \
    "gop hai mat phang ve cung mot co che ma khong bi bat — phep do chi kiem tu vung"

m2d = t.replace("| khi cần soi lâu, cần cuộn |", "| ✔ mặc định |", 1)
assert has(check(m2d), "DUNG MOT hang mac dinh"), \
    "hai hang cung mang dau mac dinh ma khong bi bat"

m3 = re.sub(r"^\| Khung hội thoại \|.*$", "", t, count=1, flags=re.M)
assert has(check(m3), "thieu mat phang khung hoi thoai"), \
    "dot bien xoa hang hoi thoai khong do dung thong diep"

m4 = t.replace("| ✔ mặc định |", "| dùng khi tiện |", 1)
assert has(check(m4), "khong hang nao la mac dinh"), \
    "dot bien go dau mac dinh khong do dung thong diep"

# Dot bien theo DUNG kich ban gap-probe: chen mot ban sao cau phep thu NGOAI
# marker roi pha ban TRONG marker. Tim-chuoi-toan-file se XANH oan; neo vao
# marker thi phai DO.
pt_body = block(t, "DECISION-PICTURE-TEST")
m5 = t.replace(pt_body, pt_body.replace("thiếu bộ vẽ", "chua san sang"), 1)
m5 = m5 + "\n\nGhi chu: dan mot khoi ma vao mat phang thiếu bộ vẽ la ca truot.\n"
assert has(check(m5), "thieu ca truot cua phep thu"), \
    "pha ban TRONG marker ma ban sao NGOAI marker van giu xanh — phep do chua neo vao vat"
PY

# ── P98: start-scan.mjs — phan o tren fixture CODE-SINH (E1-E6, E9) ─────────
# Fixture sinh trong chinh lan chay; doi chung duong (ban nguyen ven XANH)
# truoc ban tiem hong (ghim dung thong diep). Bang phan o = spec start-command
# (docs/specs/2026-08-03-start-command-design.md).
run "P98 start-scan phan o du moi hang bang + broken/skipped/readonly/gate-order (E1-E6,E9)" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const root = process.argv[2];
const SCAN = path.join(root, 'scripts/start-scan.mjs');
const die = m => { console.error(m); process.exit(1); };

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p98-'));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const contract = (slug, status, extra = '') =>
  `---\nschema_version: 1\nfeature: f-${slug}\nslug: ${slug}\nowner: t@t\nrisk_tier: T2\nsurfaces: [cli]\nstatus: ${status}\n${extra}---\n# C\n`;
const opp = (slug, stage, decision) =>
  `---\nschema_version: 1\nslug: ${slug}\nfeature: f\nowner: t@t\nstage: ${stage}\ndecision: ${decision}\n---\n# O\n`;
const evidence = (verdict) =>
  `---\nschema_version: 2\nslug: x\nverdict: ${verdict}\nhuman_signoff:\n---\n# E\n`;

// ---- 1. Fixture NGUYEN VEN: du MOI HANG bang phan o cua spec ----
W('_acceptance/config.yaml', 'schema_version: 1\n');
W('_acceptance/a-opp-moi/opportunity.md', opp('a-opp-moi', 'discovery', ''));
W('_acceptance/b-opp-thieu-decision/opportunity.md', opp('b-opp-thieu-decision', 'decided', ''));
W('_acceptance/c-opp-build/opportunity.md', opp('c-opp-build', 'decided', 'build'));
W('_acceptance/d-opp-iterate/opportunity.md', opp('d-opp-iterate', 'decided', 'iterate'));
W('_acceptance/e-opp-park/opportunity.md', opp('e-opp-park', 'decided', 'park'));
W('_acceptance/f-draft/contract.md', contract('f-draft', 'draft'));
W('_acceptance/g-approved/contract.md', contract('g-approved', 'approved'));
W('_acceptance/h-approved-plan/contract.md', contract('h-approved-plan', 'approved'));
W('docs/superpowers/plans/2026-01-01-h-approved-plan.md', '# plan\n');
W('_acceptance/i-implemented/contract.md', contract('i-implemented', 'implemented'));
W('_acceptance/j-reject/contract.md', contract('j-reject', 'implemented'));
W('_acceptance/j-reject/evidence-report.md', evidence('REJECT'));
W('_acceptance/k-pass/contract.md', contract('k-pass', 'verified', 'approved_at: 2026-01-02T00:00:00Z\n'));
W('_acceptance/k-pass/evidence-report.md', evidence('PASS'));
W('_acceptance/l-pending/contract.md', contract('l-pending', 'verified', 'approved_at: 2026-01-01T00:00:00Z\n'));
W('_acceptance/l-pending/evidence-report.md', evidence('PENDING-JUDGMENT'));
W('_acceptance/m-signed/contract.md', contract('m-signed', 'signed-off'));
// cac nhanh verified co dieu kien (S4-r1) + CRLF + slug-tien-to
W('_acceptance/n-verified-reject/contract.md', contract('n-verified-reject', 'verified'));
W('_acceptance/n-verified-reject/evidence-report.md', evidence('REJECT'));
W('_acceptance/o-verified-signed/contract.md', contract('o-verified-signed', 'verified'));
W('_acceptance/o-verified-signed/evidence-report.md',
  '---\nschema_version: 2\nslug: o\nverdict: PASS\nhuman_signoff: "Manh Phan 2026-08-03"\n---\n# E\n');
W('_acceptance/p-crlf/contract.md',
  '---\r\nschema_version: 1\r\nslug: p-crlf\r\nrisk_tier: T2\r\nstatus: draft\r\n---\r\n# C\r\n');
W('_acceptance/h-approved/contract.md', contract('h-approved', 'approved')); // tien to cua h-approved-plan

const scan = dir => JSON.parse(execFileSync('node', [SCAN, '--root', dir], { encoding: 'utf8' }));
// hash toan bo cay file (portable, khong dung md5 cua he dieu hanh)
const treeHash = d => {
  const h = crypto.createHash('sha256');
  const walk = p => {
    for (const e of fs.readdirSync(p, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const fp = path.join(p, e.name);
      if (e.isDirectory()) walk(fp);
      else { h.update(fp.slice(d.length)); h.update(fs.readFileSync(fp)); }
    }
  };
  walk(d); return h.digest('hex');
};
const before = treeHash(tmp);

const r = scan(tmp);
if (r.config !== true) die('doi chung duong: config:true phai co');

const want = {
  gates: { 'a-opp-moi': 'dang', 'b-opp-thieu-decision': 'dang', 'f-draft': 'pham-vi', 'k-pass': 'bang-chung', 'l-pending': 'bang-chung',
           'p-crlf': 'pham-vi' },                                  // CRLF doc bang reader chuan, KHONG broken
  inProgress: { 'c-opp-build': 'S1', 'd-opp-iterate': 'S1', 'g-approved': 'S2', 'h-approved-plan': 'S3', 'i-implemented': 'S4', 'j-reject': 'S3-fix',
                'n-verified-reject': 'S3-fix',                     // verified + REJECT khong phai "cho ky"
                'h-approved': 'S2' },                              // tien to: KHONG duoc dinh plan cua h-approved-plan
  done: { 'e-opp-park': 'park', 'm-signed': 'signed-off',
          'o-verified-signed': 'signed-off' },                     // da ky (status chua flip) khong hien "cho ky"
};
for (const [slug, gate] of Object.entries(want.gates)) {
  const hit = r.groups.gates.find(g => g.slug === slug);
  if (!hit || hit.gate !== gate) die(`slug ${slug} phai vao o gate=${gate}, duoc: ${JSON.stringify(hit)}`);
}
for (const [slug, step] of Object.entries(want.inProgress)) {
  const hit = r.groups.inProgress.find(g => g.slug === slug);
  if (!hit || hit.nextStep !== step) die(`slug ${slug} phai nextStep=${step}, duoc: ${JSON.stringify(hit)}`);
}
for (const [slug, state] of Object.entries(want.done)) {
  const hit = r.groups.done.find(g => g.slug === slug);
  if (!hit || hit.state !== state) die(`slug ${slug} phai done state=${state}, duoc: ${JSON.stringify(hit)}`);
}
const total = r.groups.gates.length + r.groups.inProgress.length + r.groups.done.length + r.broken.length;
if (total !== 17) die(`tong slug vao o phai 17 (khong sot khong trung), duoc ${total}`);

// skipped neu TEN nguon vang (AC-5)
for (const src of ['PRODUCT-MAP.md', 'phiên-nghiệm-thu'])
  if (!r.skipped.some(s => s.source === src)) die(`skipped[] thieu nguon co ten ${src}`);

// gate-order (AC-6): frontmatter approved_at THANG mtime — cham mtime l-pending
// cho MOI nhat, thu tu van phai theo approved_at (l-pending cu hon → len dau)
const now = new Date();
fs.utimesSync(path.join(tmp, '_acceptance/l-pending/contract.md'), now, now);
const bc = scan(tmp).groups.gates.filter(g => g.gate === 'bang-chung').map(g => g.slug);
if (bc[0] !== 'l-pending') die(`cong cho lau nhat (approved_at cu nhat) phai len dau: ${bc}`);
// doi chung roi-ve-mtime: xoa approved_at ca hai → mtime quyet dinh
for (const s of ['k-pass', 'l-pending']) W(`_acceptance/${s}/contract.md`, contract(s, 'verified'));
W('_acceptance/k-pass/evidence-report.md', evidence('PASS'));
W('_acceptance/l-pending/evidence-report.md', evidence('PENDING-JUDGMENT'));
const old = new Date(Date.now() - 864e5);
fs.utimesSync(path.join(tmp, '_acceptance/k-pass/contract.md'), old, old);
const bc2 = scan(tmp).groups.gates.filter(g => g.gate === 'bang-chung').map(g => g.slug);
if (bc2[0] !== 'k-pass') die(`thieu frontmatter phai roi ve mtime: ${bc2}`);

// readonly (AC-9): khoi phuc fixture goc roi so hash truoc/sau scan
for (const s of ['k-pass', 'l-pending'])
  W(`_acceptance/${s}/contract.md`, contract(s, 'verified', `approved_at: 2026-01-0${s === 'k-pass' ? 2 : 1}T00:00:00Z\n`));
const snap = treeHash(tmp);
scan(tmp);
if (treeHash(tmp) !== snap) die('scan da cham vao cay file — vi pham chi-doc');

// ---- 2. Tiem hong (AC-4): doi chung duong DA xanh o tren ----
W('_acceptance/f-draft/contract.md', 'status: draft\nkhong co frontmatter fence\n');
const r3 = scan(tmp);
const bad = r3.broken.find(b => b.slug === 'f-draft');
if (!bad) die('slug hong phai vao broken[], khong duoc im lang bo qua');
if (bad.file !== 'contract.md' || !/frontmatter/.test(bad.reason))
  die(`broken phai ghim file+reason frontmatter, duoc: ${JSON.stringify(bad)}`);
if (!r3.groups.inProgress.find(g => g.slug === 'g-approved')) die('slug lanh phai phan o binh thuong khi co slug hong');
if (r3.groups.gates.find(g => g.slug === 'f-draft')) die('slug hong khong duoc dong thoi nam trong gates');

// ---- 3. Config vang (AC-1) ----
const tmp2 = fs.mkdtempSync(path.join(os.tmpdir(), 'p98b-'));
const r4 = scan(tmp2);
if (r4.config !== false) die('repo chua co config.yaml phai tra config:false, exit 0');
console.log('P98 OK');
JS

# ── P99: ROUND-TRIP key JSON — rut tu khoi START-SCAN-KEYS cua HAI than lenh,
# doi chieu voi dau ra start-scan.mjs THAT tren fixture code-sinh (E13).
# Cung ho voi P55: seam viet<->doc phai co phep noi hai dau, khong grep mot phia.
run "P99 round-trip START-SCAN-KEYS <-> start-scan output (2 harness, E13)" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const root = process.argv[2];
const die = m => { console.error(m); process.exit(1); };
const SOURCES = ['commands/start.md', 'codex/acceptance-gate/skills/start/SKILL.md',
                 'plugins/acceptance-gate/skills/start/SKILL.md'];

const extractKeys = txt => {
  const m = txt.match(/<<<START-SCAN-KEYS\n([\s\S]*?)START-SCAN-KEYS>>>/);
  if (!m) return null;
  return m[1].split(/\s+/).filter(Boolean);
};
// fixture toi thieu 1 slug moi nhom de moi key mang co phan tu that ma soi
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p99-'));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
W('_acceptance/config.yaml', 'schema_version: 1\n');
W('_acceptance/w-draft/contract.md', '---\nslug: w-draft\nrisk_tier: T2\nstatus: draft\n---\n');
W('_acceptance/w-go/contract.md', '---\nslug: w-go\nrisk_tier: T2\nstatus: approved\n---\n');
W('_acceptance/w-done/contract.md', '---\nslug: w-done\nrisk_tier: T2\nstatus: signed-off\n---\n');
W('_acceptance/w-bad/contract.md', 'khong fence\n');
const outJson = JSON.parse(execFileSync('node',
  [path.join(root, 'scripts/start-scan.mjs'), '--root', tmp], { encoding: 'utf8' }));

const resolveKey = (obj, dotted) => dotted.split('.').reduce((acc, part) => {
  if (acc === undefined || acc === null) return undefined;
  if (part.endsWith('[]')) {
    const arr = acc[part.slice(0, -2)];
    if (!Array.isArray(arr) || arr.length === 0) return undefined;
    return arr[0];
  }
  return acc[part];
}, obj);

const check = entries => {
  const errs = [];
  for (const [rel, txt] of entries) {
    const keys = extractKeys(txt);
    if (!keys) { errs.push(`${rel}: khong rut duoc khoi START-SCAN-KEYS`); continue; }
    for (const k of keys)
      if (resolveKey(outJson, k) === undefined)
        errs.push(`${rel}: key ${k} khong co trong dau ra start-scan that`);
  }
  return errs;
};
const load = rel => [rel, fs.readFileSync(path.join(root, rel), 'utf8')];
const e0 = check(SOURCES.map(load));
if (e0.length) die('doi chung duong FAIL: ' + JSON.stringify(e0));   // ban that XANH
// dot bien: doi ten mot key phia LENH → phai DO dung thong diep
const mut = fs.readFileSync(path.join(root, SOURCES[0]), 'utf8')
  .replace('skipped[].source', 'sources_skipped[].source');
const e1 = check([['(ban-doi-key)', mut]]);
if (!e1.some(x => /key sources_skipped\[\]\.source khong co/.test(x)))
  die('dot bien doi ten key khong bi bat dung thong diep: ' + JSON.stringify(e1));
// dot bien: xoa ca khoi marker → phai DO "khong rut duoc"
const e2 = check([['(ban-xoa-marker)', mut.replace(/<!-- <<<START-SCAN-KEYS[\s\S]*?START-SCAN-KEYS>>> -->/, '')]]);
if (!e2.some(x => /khong rut duoc khoi START-SCAN-KEYS/.test(x)))
  die('dot bien xoa marker khong bi bat: ' + JSON.stringify(e2));
console.log('P99 OK');
JS

# ── P100: con tro cua /start giai duoc TRONG GOI moi harness (E14, ho P95) ──
run "P100 con tro /start giai duoc trong goi Claude (repo root) + goi Codex (E14)" \
  python3 - "$ROOT" <<'PY'
import re, shutil, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
SCAN = "scripts/start-scan.mjs"
LAW = "skills/acceptance/references/human-facing-language.md"

def check_claude(pkg):
    # Goi Claude = repo root (marketplace tro thang repo): con tro trong
    # commands/start.md ghep goc goi phai ra vat that.
    errs = []
    t = (pkg / "commands/start.md").read_text(encoding="utf-8")
    for ref in [SCAN, LAW]:
        if ref not in t:
            errs.append(f"commands/start.md: khong rut duoc con tro {ref}")
        elif not (pkg / ref).is_file():
            errs.append(f"con tro {ref} tro file khong ton tai trong goi Claude")
    return errs

def check_codex(pkg):
    errs = []
    sk = pkg / "skills/start/SKILL.md"
    if not sk.is_file():
        return [f"goi codex thieu {sk}"]
    t = sk.read_text(encoding="utf-8")
    if "${PLUGIN_ROOT}/" + SCAN not in t:
        errs.append("SKILL start: khong rut duoc con tro bo quet qua goc goi")
    elif not (pkg / SCAN).is_file():
        errs.append(f"con tro {SCAN} tro file khong ton tai trong goi codex")
    if "${PLUGIN_ROOT}/" + LAW not in t:
        errs.append("SKILL start: khong rut duoc con tro ban luat qua goc goi")
    elif not (pkg / LAW).is_file():
        errs.append(f"con tro {LAW} tro file khong ton tai trong goi codex")
    return errs

PKG = root / "plugins/acceptance-gate"
assert check_claude(root) == [], check_claude(root)      # doi chung DUONG goi Claude
assert check_codex(PKG) == [], check_codex(PKG)          # doi chung DUONG goi Codex
tmp = Path(tempfile.mkdtemp())
try:
    c2 = tmp / "ag"
    shutil.copytree(PKG, c2)
    assert check_codex(c2) == [], f"ban sao goi NGUYEN VEN phai XANH truoc: {check_codex(c2)}"
    (c2 / SCAN).rename(c2 / "scripts/doi-cho.mjs")       # dot bien 1: bo quet bien mat
    e1 = check_codex(c2)
    assert any("tro file khong ton tai" in x for x in e1), \
        f"dot bien doi cho bo quet khong do dung thong diep: {e1}"
    (c2 / "scripts/doi-cho.mjs").rename(c2 / SCAN)
    sk = c2 / "skills/start/SKILL.md"
    sk.write_text(sk.read_text(encoding="utf-8").replace("${PLUGIN_ROOT}/" + LAW, "(da xoa)"),
                  encoding="utf-8")                       # dot bien 2: mat con tro ban luat
    e2 = check_codex(c2)
    assert any("khong rut duoc con tro ban luat" in x for x in e2), \
        f"dot bien xoa con tro ban luat khong do dung thong diep: {e2}"
finally:
    shutil.rmtree(tmp)
PY

# ── P101: nap luat ngon ngu TRUOC render (E15) + muc /start trong docs (E11) ─
run "P101 nap human-facing-language truoc render (2 harness) + GUIDE/README co muc /start (E11,E15)" \
  python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
LAW = "human-facing-language.md"
# Moi harness: (file, anchor cua khoi render) — buoc nap phai dung TRUOC anchor.
RENDER = {"commands/start.md": "Trình MỘT thẻ",
          "codex/acceptance-gate/skills/start/SKILL.md": "Present ONE card"}

def check_load(files):
    errs = []
    for rel, anchor in files.items():
        t = (root / rel).read_text(encoding="utf-8") if isinstance(rel, str) else rel
        i_law, i_render = t.find(LAW), t.find(anchor)
        if i_law < 0:
            errs.append(f"{rel}: thieu buoc nap luat ngon ngu mat nguoi")
        elif i_render < 0:
            errs.append(f"{rel}: khong tim thay khoi render (anchor {anchor})")
        elif i_law > i_render:
            errs.append(f"{rel}: buoc nap luat nam SAU khoi render")
    return errs

def check_text(pairs):
    errs = []
    for name, (t, anchor) in pairs.items():
        i_law, i_render = t.find(LAW), t.find(anchor)
        if i_law < 0: errs.append(f"{name}: thieu buoc nap luat ngon ngu mat nguoi")
        elif i_law > i_render: errs.append(f"{name}: buoc nap luat nam SAU khoi render")
    return errs

assert check_load(RENDER) == [], check_load(RENDER)      # doi chung DUONG
# dot bien: xoa dong nap → DO dung thong diep
t = (root / "commands/start.md").read_text(encoding="utf-8")
mut = t.replace(LAW, "khong-nap-gi.md")
e1 = check_text({"(ban-xoa-nap)": (mut, RENDER["commands/start.md"])})
assert any("thieu buoc nap luat" in x for x in e1), f"dot bien xoa buoc nap khong bi bat: {e1}"

# (E11) GUIDE + README co muc /start. Chan AM phai chay CHINH phep do tren ban
# mutant — ban cu dung `not (A and B)` tren chuoi vua bi xoa A, dung mot cach
# giai tich nen khong bao gio do duoc (Cong 2 start-command, known-limit 2).
DOCS = ["GUIDE.md", "README.md"]

def check_docs(docs):                      # {ten: noi dung} -> list loi
    errs = []
    for name, text in docs.items():
        if "/start" not in text or "vào phiên" not in text:
            errs.append(f"{name}: thieu muc vao phien bang /start")
    return errs

live = {d: (root / d).read_text(encoding="utf-8") for d in DOCS}
assert check_docs(live) == [], check_docs(live)          # doi chung DUONG

# Chan AM RIENG cho TUNG file: mot ham quen mot nhanh thi chan con lai van do
# dung, che mat lo (bai hoc [findings-section-boundary#F2]).
strip = lambda t: "\n".join(l for l in t.splitlines()
                            if "/start" not in l and "vào phiên" not in l)
for gone in DOCS:
    mut = dict(live); mut[gone] = strip(live[gone])
    errs = check_docs(mut)
    assert any(x.startswith(f"{gone}: thieu muc vao phien") for x in errs), \
        f"dot bien xoa muc /start khoi {gone} khong bi bat dung thong diep: {errs}"
    assert all(not x.startswith(f"{o}:") for x in errs for o in DOCS if o != gone), \
        f"dot bien tren {gone} lam bao oan file khac: {errs}"
PY

# ── P102: loi I/O co TEN, verdict ngoai tu vung bi goi ten (AC-1, AC-2) ─────
# Doi chung DUONG (fixture nguyen ven XANH) truoc moi buoc tiem; moi buoc tiem
# ghim DUNG thong diep. Fixture do CODE sinh trong chinh lan chay.
run "P102 start-scan: loi I/O neu ten file+ma loi; verdict la/vang bi goi ten (E1,E2)" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const root = process.argv[2];
const SCAN = path.join(root, 'scripts/start-scan.mjs');
const die = m => { console.error(m); process.exit(1); };

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p102-'));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const contract = (slug, status) =>
  `---\nschema_version: 1\nslug: ${slug}\nrisk_tier: T2\nstatus: ${status}\n---\n# C\n`;
const opp = (slug, decision) =>
  `---\nschema_version: 1\nslug: ${slug}\nstage: decided\ndecision: ${decision}\n---\n# O\n`;

W('_acceptance/config.yaml', 'schema_version: 1\n');
// a: contract mat quyen doc, CO opportunity park nam canh -> khong duoc roi sang park
W('_acceptance/a-eacces/contract.md', contract('a-eacces', 'verified'));
W('_acceptance/a-eacces/opportunity.md', opp('a-eacces', 'park'));
W('_acceptance/a-eacces/evidence-report.md', '---\nschema_version: 2\nverdict: PASS\nhuman_signoff:\n---\n# E\n');
// b: contract la THU MUC
W('_acceptance/b-eisdir/x', 'noise\n');
// c: evidence-report mat quyen doc tren slug implemented
W('_acceptance/c-ev-eacces/contract.md', contract('c-ev-eacces', 'implemented'));
W('_acceptance/c-ev-eacces/evidence-report.md', '---\nschema_version: 2\nverdict: PASS\n---\n# E\n');
// d/e: nhanh verdict; f/g: doi chung duong
W('_acceptance/d-offvocab/contract.md', contract('d-offvocab', 'implemented'));
W('_acceptance/d-offvocab/evidence-report.md', '---\nschema_version: 2\nverdict: FAIL\n---\n# E\n');
W('_acceptance/e-noverdict/contract.md', contract('e-noverdict', 'implemented'));
W('_acceptance/e-noverdict/evidence-report.md', '---\nschema_version: 2\nslug: e\n---\n# E\n');
// e2: key verdict CO MAT nhung gia tri RONG — frontmatterField tra '' chu khong
// phai null, nen guard `== null` de lot va bao "khong nhan dien duoc: " (S4-r1)
W('_acceptance/e2-verdict-rong/contract.md', contract('e2-verdict-rong', 'implemented'));
W('_acceptance/e2-verdict-rong/evidence-report.md', '---\nschema_version: 2\nslug: e2\nverdict:\n---\n# E\n');
// e3: cung hinh dang o nhanh VERIFIED — rong phai ket luan o guard dung chung
W('_acceptance/e3-verified-rong/contract.md', contract('e3-verified-rong', 'verified'));
W('_acceptance/e3-verified-rong/evidence-report.md', '---\nschema_version: 2\nslug: e3\nverdict:\n---\n# E\n');
W('_acceptance/f-ok/contract.md', contract('f-ok', 'approved'));
W('_acceptance/g-reject/contract.md', contract('g-reject', 'implemented'));
W('_acceptance/g-reject/evidence-report.md', '---\nschema_version: 2\nverdict: REJECT\n---\n# E\n');

const scan = () => JSON.parse(execFileSync('node', [SCAN, '--root', tmp], { encoding: 'utf8' }));
const brokenOf = (r, slug) => r.broken.find(b => b.slug === slug);

// ---- DOI CHUNG DUONG: chua tiem gi, moi slug phan o binh thuong ----
const r0 = scan();
if (brokenOf(r0, 'a-eacces')) die('doi chung duong: a-eacces chua tiem ma da broken');
if (!r0.groups.gates.find(g => g.slug === 'a-eacces')) die('doi chung duong: a-eacces phai o gates');
if (!r0.groups.inProgress.find(g => g.slug === 'f-ok')) die('doi chung duong: f-ok phai o inProgress');

// ---- (a) EACCES tren contract.md ----
const aPath = path.join(tmp, '_acceptance/a-eacces/contract.md');
fs.chmodSync(aPath, 0o000);
let readable = true;
try { fs.readFileSync(aPath, 'utf8') } catch { readable = false }
if (readable) { fs.chmodSync(aPath, 0o644); console.log('P102 SKIP: chay bang root, chmod khong chan duoc doc'); process.exit(0); }
const r1 = scan();
const a = brokenOf(r1, 'a-eacces');
if (!a) die('EACCES contract phai vao broken[], khong duoc im lang');
if (a.file !== 'contract.md') die(`broken phai ghim dung ten file, duoc: ${JSON.stringify(a)}`);
if (!/EACCES/.test(a.reason)) die(`reason phai neu ma loi he thong, duoc: ${a.reason}`);
if (/không có|khong co/.test(a.reason)) die(`reason noi doi "khong co file" trong khi file con do: ${a.reason}`);
if (r1.groups.done.find(g => g.slug === 'a-eacces')) die('slug loi I/O bi roi sang o park cua opportunity ben canh');
fs.chmodSync(aPath, 0o644);

// ---- (b) contract.md la THU MUC ----
fs.mkdirSync(path.join(tmp, '_acceptance/b-eisdir/contract.md'));
const b = brokenOf(scan(), 'b-eisdir');
if (!b || b.file !== 'contract.md' || !/EISDIR/.test(b.reason))
  die(`contract la thu muc phai vao broken kem EISDIR, duoc: ${JSON.stringify(b)}`);

// ---- (c) EACCES tren evidence-report.md (slug implemented) ----
const cPath = path.join(tmp, '_acceptance/c-ev-eacces/evidence-report.md');
fs.chmodSync(cPath, 0o000);
const r3 = scan();
const c = brokenOf(r3, 'c-ev-eacces');
if (!c) die('EACCES evidence-report phai vao broken[]');
if (c.file !== 'evidence-report.md') die(`phai ghim ten evidence-report.md, duoc: ${JSON.stringify(c)}`);
if (!/EACCES/.test(c.reason)) die(`reason phai neu ma loi, duoc: ${c.reason}`);
if (r3.groups.inProgress.find(g => g.slug === 'c-ev-eacces'))
  die('slug co evidence loi I/O van bi day sang nextStep — khong duoc doan buoc ke');
fs.chmodSync(cPath, 0o644);

// ---- (d) verdict NGOAI tu vung tren implemented ----
const d = brokenOf(scan(), 'd-offvocab');
if (!d || !/verdict không nhận diện được: FAIL/.test(d.reason))
  die(`verdict la phai bi goi ten cung khuon nhanh verified, duoc: ${JSON.stringify(d)}`);

// ---- (e) evidence CO frontmatter nhung VANG dong verdict ----
const e = brokenOf(scan(), 'e-noverdict');
if (!e || !/thiếu verdict/.test(e.reason))
  die(`verdict vang phai bi goi ten, duoc: ${JSON.stringify(e)}`);

// ---- (e2)(e3) key verdict CO MAT nhung RONG: phai xu nhu VANG o CA HAI nhanh ----
// Rong ma roi xuong offVocab thi thong diep la "khong nhan dien duoc: " —
// khong neu ten gi ca, trai AC-2. Guard dung chung phai ket luan truoc do.
for (const slug of ['e2-verdict-rong', 'e3-verified-rong']) {
  const hit = brokenOf(scan(), slug);
  if (!hit) die(`[${slug}] verdict rong phai vao broken[]`);
  if (!/thiếu verdict/.test(hit.reason))
    die(`[${slug}] verdict rong phai bao "thieu verdict", duoc: ${hit.reason}`);
  if (/nhận diện được: *$/.test(hit.reason))
    die(`[${slug}] thong diep khong neu ten gi — dung nhanh offVocab thay vi guard chung: ${hit.reason}`);
}

// ---- doi chung DUONG cuoi: REJECT van ra S3-fix nhu cu ----
const g = scan().groups.inProgress.find(x => x.slug === 'g-reject');
if (!g || g.nextStep !== 'S3-fix') die(`REJECT phai giu nextStep S3-fix, duoc: ${JSON.stringify(g)}`);
console.log('P102 OK');
JS

# ── P103: argv hong CHET TO exit 2, khong doi nghia thanh chan doan repo (AC-3)
# Lop "declared-but-unusable" da chot o pre-merge-check v1.22.1 va
# sync-plugin-packages (mode la khong duoc am tham roi ve ghi de).
run "P103 start-scan argv: 5 loi chet exit 2 ghim thong diep + doi chung duong (E3)" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');
const root = process.argv[2];
const SCAN = path.join(root, 'scripts/start-scan.mjs');
const die = m => { console.error(m); process.exit(1); };
const runScan = a => spawnSync('node', [SCAN, ...a], { encoding: 'utf8' });

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p103-'));
fs.mkdirSync(path.join(tmp, 'ok/_acceptance'), { recursive: true });
fs.writeFileSync(path.join(tmp, 'ok/_acceptance/config.yaml'), 'schema_version: 1\n');
const okDir = path.join(tmp, 'ok');
const plainFile = path.join(tmp, 'la-file-thuong.txt');
fs.writeFileSync(plainFile, 'toi khong phai thu muc\n');

// ---- DOI CHUNG DUONG truoc moi loi chet: loi goi DUNG van chay ----
const ok = runScan(['--root', okDir]);
if (ok.status !== 0) die(`doi chung duong that bai: --root hop le phai exit 0, duoc ${ok.status} / ${ok.stderr}`);
let parsed; try { parsed = JSON.parse(ok.stdout) } catch { die('doi chung duong: stdout khong parse duoc JSON') }
if (parsed.config !== true) die('doi chung duong: root hop le co config phai tra config:true');

// ---- 5 loi chet: exit 2, stdout RONG, stderr ghim thong diep RIENG ----
const CASES = [
  { name: '--root thieu gia tri', argv: ['--root'],                needle: /--root/ },
  { name: "--root chuoi rong",    argv: ['--root', ''],            needle: /--root/ },
  { name: 'token la',             argv: ['--foo'],                 needle: /--foo/ },
  { name: 'duong dan ma',         argv: ['--root', path.join(tmp, 'khong-ton-tai')], needle: /khong-ton-tai/ },
  { name: 'duong dan la FILE',    argv: ['--root', plainFile],     needle: /la-file-thuong\.txt/ },
];
const seen = new Set();
for (const c of CASES) {
  const r = runScan(c.argv);
  if (r.status !== 2) die(`[${c.name}] phai exit 2, duoc ${r.status} (stdout=${r.stdout.slice(0,80)})`);
  if (r.stdout.trim() !== '') die(`[${c.name}] KHONG duoc in JSON ra stdout, duoc: ${r.stdout.slice(0,80)}`);
  if (!c.needle.test(r.stderr)) die(`[${c.name}] stderr phai ghim ${c.needle}, duoc: ${r.stderr.slice(0,120)}`);
  seen.add(r.stderr.trim());
}
// Moi loi mot thong diep RIENG: dung chung mot cau thi dot bien chi chung minh
// duoc mot nhanh, cac nhanh con lai khong bao gio bi da RED rieng (bai hoc P95).
if (seen.size < CASES.length)
  die(`5 loi chet chi cho ${seen.size} thong diep khac nhau — nhanh dung chung cau khong do rieng duoc`);

// ---- doi chung DUONG cuoi: root hop le NHUNG chua acceptance-init ----
// Phan biet RANH ROI voi loi go lenh: day moi la "repo chua dung cong".
const bare = fs.mkdtempSync(path.join(os.tmpdir(), 'p103b-'));
const r2 = runScan(['--root', bare]);
if (r2.status !== 0) die(`root that nhung chua init phai exit 0, duoc ${r2.status}`);
if (JSON.parse(r2.stdout).config !== false) die('root that chua init phai tra config:false');
console.log('P103 OK');
JS

# ── P104: ROUND-TRIP tu vung verdict writer <-> reader (AC-2) ──────────────
# S4-r2 bat mot THOAI LUI: VERDICT_OK cua reader hardcode 3 gia tri, bo sot
# BLOCKED — mot vong dang do bi chan moi truong bi goi la "ho so hong" roi bien
# khoi danh sach chon cua /start. Thuoc cu chi hoi "gia tri la co bi goi ten
# khong", KHONG ai ghim TU VUNG AY LAY TU DAU. Case nay rut tu vung tu chinh
# khuon WRITER roi cho READER that doc (mau P55).
run "P104 round-trip tu vung verdict: khuon writer <-> start-scan reader (E10)" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const root = process.argv[2];
const SCAN = path.join(root, 'scripts/start-scan.mjs');
const TPL = path.join(root, 'skills/acceptance/references/evidence-report-template.md');
const die = m => { console.error(m); process.exit(1); };

// 1. Rut tu vung tu WRITER (khong hardcode o day)
const tplTxt = fs.readFileSync(TPL, 'utf8');
const m = tplTxt.match(/^verdict:\s*\{\{([A-Z|-]+)\}\}/m);
if (!m) die('KHONG rut duoc tu vung verdict tu khuon evidence-report-template.md');
const VOCAB = m[1].split('|').map(s => s.trim()).filter(Boolean);
if (VOCAB.length < 3) die(`tu vung rut ra qua ngan (${VOCAB.join(',')}) — regex hong`);

// 2. Dung fixture cho TUNG verdict, cho READER that doc
const mkFixture = () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p104-'));
  fs.mkdirSync(path.join(tmp, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(tmp, '_acceptance/config.yaml'), 'schema_version: 1\n');
  for (const v of VOCAB) {
    const d = path.join(tmp, '_acceptance', 'v-' + v.toLowerCase());
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, 'contract.md'),
      `---\nslug: v-${v.toLowerCase()}\nrisk_tier: T2\nstatus: implemented\n---\n`);
    fs.writeFileSync(path.join(d, 'evidence-report.md'),
      `---\nschema_version: 2\nverdict: ${v}\n---\n`);
  }
  return tmp;
};
const check = scanPath => {
  const tmp = mkFixture();
  const r = JSON.parse(execFileSync('node', [scanPath, '--root', tmp], { encoding: 'utf8' }));
  const errs = [];
  for (const v of VOCAB) {
    const slug = 'v-' + v.toLowerCase();
    const bad = r.broken.find(b => b.slug === slug);
    if (bad && /không nhận diện được/.test(bad.reason))
      errs.push(`verdict ${v} co trong khuon writer nhung reader goi la khong-nhan-dien-duoc`);
  }
  return errs;
};

const e0 = check(SCAN);
if (e0.length) die('doi chung DUONG that bai: ' + JSON.stringify(e0));   // ban that XANH

// 3. Dot bien: go MOT verdict khoi tu vung cua reader -> phai DO dung thong diep.
// Ban sao can lib/evidence-core.js giai duoc, nen dung cay tam co ca hai thu muc.
const mut = fs.mkdtempSync(path.join(os.tmpdir(), 'p104m-'));
fs.mkdirSync(path.join(mut, 'scripts'), { recursive: true });
fs.mkdirSync(path.join(mut, 'lib'), { recursive: true });
fs.copyFileSync(path.join(root, 'lib/evidence-core.js'), path.join(mut, 'lib/evidence-core.js'));
const src = fs.readFileSync(SCAN, 'utf8');
const gone = VOCAB[VOCAB.length - 1];                     // go phan tu cuoi khuon writer
const mutSrc = src.replace(new RegExp(`,\\s*'${gone}'`), '');
if (mutSrc === src) die(`dot bien khong hieu luc — khong tim thay '${gone}' trong VERDICT_OK cua reader`);
const mutPath = path.join(mut, 'scripts/start-scan.mjs');
fs.writeFileSync(mutPath, mutSrc);
const e1 = check(mutPath);
if (!e1.some(x => x.includes(`verdict ${gone} co trong khuon writer`)))
  die(`dot bien go ${gone} khoi tu vung reader KHONG bi bat dung thong diep: ${JSON.stringify(e1)}`);
console.log(`P104 OK (tu vung writer: ${VOCAB.join(', ')})`);
JS

if [ "$failures" -gt 0 ]; then
  echo
  echo "Results: $failures failed"
  exit 1
fi

echo
echo "Results: all plugin tests passed"
exit 0
