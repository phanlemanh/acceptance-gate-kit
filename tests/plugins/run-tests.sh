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

run "P02 Codex marketplace lists only the Codex-native feature-loop" \
  python3 - "$ROOT/.agents/plugins/marketplace.json" <<'PY'
import json, sys
data = json.load(open(sys.argv[1]))
plugins = {p["name"]: p for p in data["plugins"]}
assert plugins["acceptance-gate"]["source"]["path"] == "./plugins/acceptance-gate"
assert plugins["feature-loop-codex"]["source"]["path"] == "./plugins/feature-loop-codex"
assert "feature-loop" not in plugins
PY

run "P03 packaged acceptance-gate is Codex-ready and version-aligned" \
  python3 - "$ROOT" <<'PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
root_claude = json.loads((root / ".claude-plugin/plugin.json").read_text())
root_codex = json.loads((root / ".codex-plugin/plugin.json").read_text())
pkg_claude = json.loads((root / "plugins/acceptance-gate/.claude-plugin/plugin.json").read_text())
pkg_codex = json.loads((root / "plugins/acceptance-gate/.codex-plugin/plugin.json").read_text())
# Root .claude-plugin is the single source of truth — no literal pin here, or
# every release turns this suite red and teaches people to "fix the test".
expected = root_claude["version"]
assert root_codex["version"] == expected, f'root codex {root_codex["version"]} != {expected} (run scripts/sync-plugin-packages.sh)'
assert pkg_claude["version"] == expected, f'pkg claude {pkg_claude["version"]} != {expected} (run scripts/sync-plugin-packages.sh)'
assert pkg_codex["version"] == expected, f'pkg codex {pkg_codex["version"]} != {expected} (run scripts/sync-plugin-packages.sh)'
for rel in [
    "plugins/acceptance-gate/commands/acceptance-card.md",
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
assert data["version"] == "1.5.0"
assert data["description"]
PY

run "P05 feature-loop-codex skill is Codex-native and Claude-1.5.0 aligned" \
  python3 - "$ROOT/plugins/feature-loop-codex/skills/feature-loop-codex/SKILL.md" <<'PY'
from pathlib import Path
import sys
text = Path(sys.argv[1]).read_text()
assert "name: feature-loop-codex" in text
assert "version: 1.5.0" in text
assert "Codex" in text
assert "acceptance-gate" in text
assert "spawn_agent" in text
assert "feature_loop.suite_keys" in text
assert "review-findings.md" in text
assert "PENDING-JUDGMENT" in text
assert "time_human_minutes.gate1" in text
assert "doer" in text and "grader" in text
assert "runs" in text and "pass_rate" in text
assert "baseline" in text
assert "should-NOT-fire" in text
assert "enforcement_mode" in text and "bypass_used" in text
assert "acceptance-card" in text and "evidence-page.html" in text
assert "Workflow(" not in text
assert ".claude/plugins/cache" not in text
PY

run "P06 packaged vendor engine import graph resolves (vendor/ shipped)" \
  node --input-type=module -e "
const m = await import(process.argv[1]);
if (typeof m.detectHtml !== 'function') throw new Error('detectHtml missing');
" "file://$ROOT/plugins/acceptance-gate/vendor/impeccable/engine/engines/static-html/detect-html.mjs"

run "P07 every \${CLAUDE_PLUGIN_ROOT} path in commands/skills exists in ITS plugin root" \
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
    root / "plugins/acceptance-gate",       # packaged copy must be self-contained
    root / "plugins/feature-loop-codex",
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

if [ "$failures" -gt 0 ]; then
  echo
  echo "Results: $failures failed"
  exit 1
fi

echo
echo "Results: all plugin tests passed"
exit 0
