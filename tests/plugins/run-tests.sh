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
assert root_claude["version"] == "1.11.2"
assert overlay_codex["version"] == "1.11.3"
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
]:
    assert (root / rel).is_file(), rel
PY

run "P04 feature-loop-codex manifest is version-aligned" \
  python3 - "$ROOT/plugins/feature-loop-codex/.codex-plugin/plugin.json" <<'PY'
import json, sys
data = json.load(open(sys.argv[1]))
assert data["name"] == "feature-loop-codex"
assert data["skills"] == "./skills/"
assert data["version"] == "1.11.3"
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
assert "version: 1.11.3" in text
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
    "role-specific model routing",
]:
    assert needle in text, needle
assert re.search(r"Never create or suggest a goal that reaches\s+`signed-off`", text)
assert "Workflow(" not in text
assert "feature-loop/workflows" not in text
assert ".claude/plugins/cache" not in text
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
assert manifest["version"] == "0.2.1"
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
assert json.loads((root / "codex/acceptance-gate/.codex-plugin/plugin.json").read_text())["version"] == "1.11.3"
assert json.loads((root / "codex/feature-loop-codex/.codex-plugin/plugin.json").read_text())["version"] == "1.11.3"
assert json.loads((root / "codex/design-loop/.codex-plugin/plugin.json").read_text())["version"] == "0.2.1"
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
for name in ["acceptance-init", "acceptance-card", "acceptance-status", "acceptance"]:
    assert (skills / name / "SKILL.md").is_file(), name
main = (skills / "acceptance/SKILL.md").read_text()
assert "acceptance-init" in main
assert "acceptance-card" in main
assert "apply_patch adapter" in main
card = (skills / "acceptance-card/SKILL.md").read_text()
assert "card-plain.json" in card and "evidence-page.html" in card
status = (skills / "acceptance-status/SKILL.md").read_text()
assert "PENDING-JUDGMENT" in status and "Gate 2" in status
PY

run "P27 Design Loop exposes native portable-reference skills" \
  python3 - "$ROOT/plugins/design-loop-codex" <<'PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
manifest = json.loads((root / ".codex-plugin/plugin.json").read_text())
assert manifest["version"] == "0.2.1"
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
]:
    assert needle in text, needle
PY

if [ "$failures" -gt 0 ]; then
  echo
  echo "Results: $failures failed"
  exit 1
fi

echo
echo "Results: all plugin tests passed"
exit 0
