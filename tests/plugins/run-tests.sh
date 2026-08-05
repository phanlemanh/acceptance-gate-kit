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

# LOP: `skills/` duoc rsync vao CA HAI goi (goc repo = goi Claude, plugins/
# acceptance-gate = goi Codex) va chi mot so skill co ban de trong codex/. File
# nao KHONG co ban de ma ghim `${CLAUDE_PLUGIN_ROOT}` mot minh thi ra goi Codex
# voi con tro chet — Codex dat `${PLUGIN_ROOT}`. Dung dang hai-harness
# `${CLAUDE_PLUGIN_ROOT:-$PLUGIN_ROOT}` (S4-r15; design-pass dinh cung lop).
_skills = sorted((root / "skills").rglob("*.md"))
assert len(_skills) >= 5, f"bo dem tinh tao: quet ra {len(_skills)} file trong skills/ — nghi buoc quet hong"
_de = {d.name for d in (root / "codex/acceptance-gate/skills").iterdir() if d.is_dir()}
for f in _skills:
    if f.relative_to(root / "skills").parts[0] in _de: continue
    txt = f.read_text(encoding="utf-8")
    for mm in re.finditer(r"\$\{CLAUDE_PLUGIN_ROOT\}", txt):
        raise AssertionError(
            f"{f.relative_to(root)}: ghim ${{CLAUDE_PLUGIN_ROOT}} mot minh nhung khong co ban de codex/ — "
            "file nay ship vao ca goi Codex voi con tro chet; dung ${CLAUDE_PLUGIN_ROOT:-$PLUGIN_ROOT}")
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
run "P88 version floor 1.29/1.22 + description nhac hanh vi moi" \
  python3 - "$ROOT" <<'PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
def ver(rel):
    return tuple(int(x) for x in json.loads((root / rel).read_text())["version"].split("."))
def desc(rel):
    return json.loads((root / rel).read_text())["description"]
assert ver(".claude-plugin/plugin.json") >= (1, 29, 0), "acceptance-gate chua bump toi 1.29.0"
assert ver("feature-loop/.claude-plugin/plugin.json") >= (1, 22, 0), "feature-loop chua bump toi 1.22.0"
assert ver("codex/feature-loop-codex/.codex-plugin/plugin.json") >= (1, 22, 0), "feature-loop-codex chua bump toi 1.22.0"
# Description phai nhac hanh vi moi (keyword chuc nang, on dinh qua cac ban sau):
for kw in ("opportunity-template", "DECISION-DIAGRAM-SURFACES"):
    assert kw in desc(".claude-plugin/plugin.json"), f"desc acceptance-gate thieu {kw}"
d = desc("feature-loop/.claude-plugin/plugin.json")
for kw in ("ui_standards_skill", "design-pass", "GOAL-TEMPLATE", "LOOP-PICTURE-CLAUSE", "REPIN-TEMPLATE", "carry-plan.mjs"):
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

// F-B da dung ca hai nguon: khoa skipped[] bi go han (het nguon sinh), va o
// cho-Cong-Gia-tri + ba ket cuc nghiem thu vao bang phan o.
if ('skipped' in r) die('skipped[] van con trong dau ra du khong con nguon sinh nao');
if (typeof r.map !== 'object' || !('present' in r.map) || !('fresh' in r.map))
  die('thieu khoa map.present/map.fresh: ' + JSON.stringify(r.map));

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
  .replace('map.present', 'map_present_doi_ten');
const e1 = check([['(ban-doi-key)', mut]]);
if (!e1.some(x => /key map_present_doi_ten khong co/.test(x)))
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
run "P101 nap human-facing-language truoc render (2 harness) + GUIDE/README/QUICKSTART co muc /start (E11,E15)" \
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
DOCS = ["GUIDE.md", "README.md", "QUICKSTART.md"]

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

// Do nang luc chan quyen doc MOT lan. Duoi root/chmod-vo-hieu: bo qua RIENG
// hai chan (a)(c) can EACCES, IN CANH BAO — moi chan khac VAN chay. Ban cu
// `process.exit(0)` ngay sau (a) nuot luon 6 chan sau ma suite bao PASS —
// dung lop "assertion khong song" (S4-r4).
const permProbe = path.join(tmp, 'perm-probe');
fs.writeFileSync(permProbe, 'x'); fs.chmodSync(permProbe, 0o000);
let canBlockRead = false;
try { fs.readFileSync(permProbe) } catch { canBlockRead = true }
fs.chmodSync(permProbe, 0o644);

if (canBlockRead) {
  // ---- (a) EACCES tren contract.md ----
  const aPath = path.join(tmp, '_acceptance/a-eacces/contract.md');
  fs.chmodSync(aPath, 0o000);
  const r1 = scan();
  const a = brokenOf(r1, 'a-eacces');
  if (!a) die('EACCES contract phai vao broken[], khong duoc im lang');
  if (a.file !== 'contract.md') die(`broken phai ghim dung ten file, duoc: ${JSON.stringify(a)}`);
  if (!/EACCES/.test(a.reason)) die(`reason phai neu ma loi he thong, duoc: ${a.reason}`);
  if (/không có|khong co/.test(a.reason)) die(`reason noi doi "khong co file" trong khi file con do: ${a.reason}`);
  if (r1.groups.done.find(g => g.slug === 'a-eacces')) die('slug loi I/O bi roi sang o park cua opportunity ben canh');
  fs.chmodSync(aPath, 0o644);

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
} else {
  console.log('P102 CANH BAO: khong chan duoc quyen doc (root?) — bo qua RIENG chan (a)(c) EACCES; moi chan khac van chay');
}

// ---- (b) contract.md la THU MUC (khong can quyen — LUON chay) ----
fs.mkdirSync(path.join(tmp, '_acceptance/b-eisdir/contract.md'));
const b = brokenOf(scan(), 'b-eisdir');
if (!b || b.file !== 'contract.md' || !/EISDIR/.test(b.reason))
  die(`contract la thu muc phai vao broken kem EISDIR, duoc: ${JSON.stringify(b)}`);

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
  // CA HAI nhanh status deu doc verdict — r3 hong dung vi fixture chi co
  // `implemented`, nen nhanh `verified` troi khoi tu vung ma P104 van xanh.
  for (const st of ['implemented', 'verified']) {
    for (const v of VOCAB) {
      const slug = `${st}-${v.toLowerCase()}`;
      const d = path.join(tmp, '_acceptance', slug);
      fs.mkdirSync(d, { recursive: true });
      fs.writeFileSync(path.join(d, 'contract.md'),
        `---\nslug: ${slug}\nrisk_tier: T2\nstatus: ${st}\napproved_at: 2026-01-01T00:00:00Z\n---\n`);
      fs.writeFileSync(path.join(d, 'evidence-report.md'),
        `---\nschema_version: 2\nverdict: ${v}\nhuman_signoff:\n---\n`);
    }
  }
  return tmp;
};
const check = scanPath => {
  const tmp = mkFixture();
  const r = JSON.parse(execFileSync('node', [scanPath, '--root', tmp], { encoding: 'utf8' }));
  const errs = [];
  for (const st of ['implemented', 'verified']) {
    for (const v of VOCAB) {
      const slug = `${st}-${v.toLowerCase()}`;
      const bad = r.broken.find(b => b.slug === slug);
      if (bad && /không nhận diện được/.test(bad.reason))
        errs.push(`[${st}] verdict ${v} co trong khuon writer nhung reader goi la khong-nhan-dien-duoc`);
    }
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
// start-scan nay dung LUAT CHUNG cho field dieu huong (lib/workspace-record.js)
// — ban sao chay thu phai co no, khong thi ket luan "chay duoc/khong" chi noi
// ve viec thieu file chu khong ve hanh vi dang do.
fs.copyFileSync(path.join(root, 'lib/workspace-record.js'), path.join(mut, 'lib/workspace-record.js'));
const src = fs.readFileSync(SCAN, 'utf8');
const gone = VOCAB[VOCAB.length - 1];                     // go phan tu cuoi khuon writer
const mutSrc = src.replace(new RegExp(`^\\s*'${gone}':.*$`, 'm'), '');
if (mutSrc === src) die(`dot bien khong hieu luc — khong tim thay '${gone}' trong bang tra verdict cua reader`);
const mutPath = path.join(mut, 'scripts/start-scan.mjs');
fs.writeFileSync(mutPath, mutSrc);
const e1 = check(mutPath);
// Phai bat o CA HAI nhanh: mot bang tra dung chung thi go mot dong lam ca hai do.
// Neu chi mot nhanh do => nhanh kia dang giu danh sach song song (lop loi r2/r3).
for (const st of ['implemented', 'verified'])
  if (!e1.some(x => x.includes(`[${st}] verdict ${gone} co trong khuon writer`)))
    die(`dot bien go ${gone} KHONG lam nhanh ${st} do — nhanh nay dang giu tu vung rieng: ${JSON.stringify(e1)}`);
console.log(`P104 OK (tu vung writer: ${VOCAB.join(', ')})`);
JS

# ── P105: MA TRAN phan o toan phan — thuoc dong khong gian thoat (S4-r5) ────
# 4 round truoc deu cung mot hinh dang: chot dat sai cho, va DIEM-case chi ghim
# o bi neu ten nen lo con cho tron. Ma tran ghim TOAN BO to hop
# (trang thai contract × tinh trang evidence) + (khong contract × tinh trang
# opportunity) — chot nao dat sai cho deu lat it nhat mot o da ghim.
run "P105 ma tran phan o: trang-thai × tinh-trang-artifact, ghim toan bo (E1,E2,E10)" \
  node - "$ROOT" <<'JS'
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const root = process.argv[2];
const SCAN = path.join(root, 'scripts/start-scan.mjs');
const die = m => { console.error(m); process.exit(1); };

// Do nang luc chan quyen doc MOT lan (root/chmod-vo-hieu → bo RIENG cac o
// mat-quyen, in canh bao; moi o khac van ghim — EISDIR song duoi root nen
// lop chot-sai-cho van bi ma tran bat ke ca khi thieu cac o EACCES).
const probeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p105p-'));
const probe = path.join(probeDir, 'probe'); fs.writeFileSync(probe, 'x'); fs.chmodSync(probe, 0o000);
let canBlockRead = false; try { fs.readFileSync(probe) } catch { canBlockRead = true }
fs.chmodSync(probe, 0o644);
if (!canBlockRead) console.log('P105 CANH BAO: khong chan duoc quyen doc — bo rieng cac o mat-quyen, ma tran con lai van ghim du');

const EVC = '---\nschema_version: 1\nrisk_tier: T2\nstatus: %S\napproved_at: 2026-01-01T00:00:00Z\n---\n';
// Tinh trang evidence-report.md → ham dung fixture
const EV_STATES = {
  'vang':        d => {},
  'matquyen':    d => { const p = path.join(d, 'evidence-report.md'); fs.writeFileSync(p, '---\nverdict: PASS\n---\n'); fs.chmodSync(p, 0o000); },
  'lathumuc':    d => fs.mkdirSync(path.join(d, 'evidence-report.md')),
  'thieuverdict':d => fs.writeFileSync(path.join(d, 'evidence-report.md'), '---\nschema_version: 2\nslug: x\n---\n'),
  'verdictrong': d => fs.writeFileSync(path.join(d, 'evidence-report.md'), '---\nverdict:\n---\n'),
  'verdictrac':  d => fs.writeFileSync(path.join(d, 'evidence-report.md'), '---\nverdict: FAIL\n---\n'),
  'pass':        d => fs.writeFileSync(path.join(d, 'evidence-report.md'), '---\nverdict: PASS\nhuman_signoff:\n---\n'),
  'pending':     d => fs.writeFileSync(path.join(d, 'evidence-report.md'), '---\nverdict: PENDING-JUDGMENT\nhuman_signoff:\n---\n'),
  'reject':      d => fs.writeFileSync(path.join(d, 'evidence-report.md'), '---\nverdict: REJECT\nhuman_signoff:\n---\n'),
  'blocked':     d => fs.writeFileSync(path.join(d, 'evidence-report.md'), '---\nverdict: BLOCKED\nhuman_signoff:\n---\n'),
};
// O mong doi: "cell:detail" — gates:<gate> | prog:<nextStep> | done:<state> | broken:<regex reason>
const IGNORES_EV = { 'draft': 'gates:pham-vi', 'approved': 'prog:S2', 'signed-off': 'done:signed-off' };
const MATRIX = {};
for (const [st, cell] of Object.entries(IGNORES_EV))
  for (const ev of Object.keys(EV_STATES)) MATRIX[`${st}|${ev}`] = cell;   // evidence KHONG duoc quyet dinh o
Object.assign(MATRIX, {
  'implemented|vang': 'prog:S4',            'verified|vang': 'broken:thiếu evidence-report',
  'implemented|matquyen': 'broken:EACCES',  'verified|matquyen': 'broken:EACCES',
  'implemented|lathumuc': 'broken:EISDIR',  'verified|lathumuc': 'broken:EISDIR',
  'implemented|thieuverdict': 'broken:thiếu verdict', 'verified|thieuverdict': 'broken:thiếu verdict',
  'implemented|verdictrong': 'broken:thiếu verdict',  'verified|verdictrong': 'broken:thiếu verdict',
  'implemented|verdictrac': 'broken:không nhận diện được: FAIL', 'verified|verdictrac': 'broken:không nhận diện được: FAIL',
  'implemented|pass': 'prog:S4',    'verified|pass': 'gates:bang-chung',
  'implemented|pending': 'prog:S4', 'verified|pending': 'gates:bang-chung',
  'implemented|reject': 'prog:S3-fix', 'verified|reject': 'prog:S3-fix',
  'implemented|blocked': 'prog:S4', 'verified|blocked': 'prog:S4',
});
// Nhanh opportunity (khong co contract.md)
const OPP_STATES = {
  'o-matquyen':  d => { const p = path.join(d, 'opportunity.md'); fs.writeFileSync(p, '---\nstage: decided\ndecision: build\n---\n'); fs.chmodSync(p, 0o000); },
  'o-thieustage':d => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nslug: x\n---\n'),
  'o-discovery': d => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nstage: discovery\ndecision:\n---\n'),
  'o-build':     d => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nstage: decided\ndecision: build\n---\n'),
  'o-iterate':   d => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nstage: decided\ndecision: iterate\n---\n'),
  'o-park':      d => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nstage: decided\ndecision: park\n---\n'),
  'o-kill':      d => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nstage: decided\ndecision: kill\n---\n'),
  'o-rac':       d => fs.writeFileSync(path.join(d, 'opportunity.md'), '---\nstage: decided\ndecision: maybe\n---\n'),
  'o-trong':     d => {},
};
Object.assign(MATRIX, {
  'noc|o-matquyen': 'broken:EACCES', 'noc|o-thieustage': 'broken:thiếu stage',
  'noc|o-discovery': 'gates:dang',   'noc|o-build': 'prog:S1', 'noc|o-iterate': 'prog:S1',
  'noc|o-park': 'done:park',         'noc|o-kill': 'done:kill',
  'noc|o-rac': 'broken:decision không nhận diện được', 'noc|o-trong': 'broken:không có contract.md lẫn opportunity.md',
});

const build = () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'p105-'));
  fs.mkdirSync(path.join(tmp, '_acceptance'), { recursive: true });
  fs.writeFileSync(path.join(tmp, '_acceptance/config.yaml'), 'schema_version: 1\n');
  for (const key of Object.keys(MATRIX)) {
    const [st, ev] = key.split('|');
    if (!canBlockRead && /matquyen/.test(ev)) continue;
    const slug = key.replace(/[|]/g, '-');
    const d = path.join(tmp, '_acceptance', slug);
    fs.mkdirSync(d, { recursive: true });
    if (st !== 'noc') fs.writeFileSync(path.join(d, 'contract.md'), EVC.replace('%S', st));
    (st === 'noc' ? OPP_STATES[ev] : EV_STATES[ev])(d);
  }
  return tmp;
};
const cellOf = (r, slug) => {
  const g = r.groups.gates.find(x => x.slug === slug);      if (g) return `gates:${g.gate}`;
  const p = r.groups.inProgress.find(x => x.slug === slug); if (p) return `prog:${p.nextStep}`;
  const dn = r.groups.done.find(x => x.slug === slug);      if (dn) return `done:${dn.state}`;
  const b = r.broken.find(x => x.slug === slug);            if (b) return `broken:${b.reason}`;
  return '(mat tich)';
};
const checkMatrix = scanPath => {
  const tmp = build();
  const r = JSON.parse(execFileSync('node', [scanPath, '--root', tmp], { encoding: 'utf8' }));
  const errs = [];
  for (const [key, want] of Object.entries(MATRIX)) {
    const [, ev] = key.split('|');
    if (!canBlockRead && /matquyen/.test(ev)) continue;
    const got = cellOf(r, key.replace(/[|]/g, '-'));
    const [wc, wd] = [want.slice(0, want.indexOf(':')), want.slice(want.indexOf(':') + 1)];
    const [gc, gd] = [got.slice(0, got.indexOf(':') < 0 ? got.length : got.indexOf(':')), got.slice(got.indexOf(':') + 1)];
    const ok = wc === gc && (wc !== 'broken' ? wd === gd : gd.includes(wd));
    if (!ok) errs.push(`o [${key}] mong ${want}, duoc ${got}`);
  }
  return errs;
};

const e0 = checkMatrix(SCAN);
if (e0.length) die(`ma tran ghim ${Object.keys(MATRIX).length} o — ${e0.length} o lech:\n` + e0.join('\n'));

// Pha-thu: mutant keo chot evidence NGUOC LEN truoc cho re trang thai (chinh
// con bug S4-r4) → ma tran phai DO tai cac o draft/approved/signed-off × loi-doc.
const mut = fs.mkdtempSync(path.join(os.tmpdir(), 'p105m-'));
fs.mkdirSync(path.join(mut, 'scripts')); fs.mkdirSync(path.join(mut, 'lib'));
fs.copyFileSync(path.join(root, 'lib/evidence-core.js'), path.join(mut, 'lib/evidence-core.js'));
// start-scan nay dung LUAT CHUNG cho field dieu huong (lib/workspace-record.js)
// — ban sao chay thu phai co no, khong thi ket luan "chay duoc/khong" chi noi
// ve viec thieu file chu khong ve hanh vi dang do.
fs.copyFileSync(path.join(root, 'lib/workspace-record.js'), path.join(mut, 'lib/workspace-record.js'));
const src = fs.readFileSync(SCAN, 'utf8');
const anchor = "if (status === 'signed-off')";
if (!src.includes(anchor)) die('mutant: khong tim thay anchor cho re trang thai');
const hoist = "{ const __e = read(path.join(dir, 'evidence-report.md')); if (__e.err) { broken.push({ slug, file: 'evidence-report.md', reason: ioReason(__e.err) }); continue; } }\n    ";
fs.writeFileSync(path.join(mut, 'scripts/start-scan.mjs'), src.replace(anchor, hoist + anchor));
const e1 = checkMatrix(path.join(mut, 'scripts/start-scan.mjs'));
if (!e1.some(x => /\[(draft|approved|signed-off)\|(matquyen|lathumuc)\]/.test(x)))
  die('mutant keo chot len truoc cho re ma ma tran van XANH — thuoc chua gan vao vat: ' + JSON.stringify(e1.slice(0,3)));
console.log(`P105 OK — ghim ${Object.keys(MATRIX).length} o${canBlockRead ? '' : ' (tru cac o mat-quyen)'}; mutant chot-sai-cho bi bat`);
JS

# ── P115: khuon canonical -> fixture -> reader chuan (round-trip seam) ──────
# Fixture cua moi case sau nay rut tu marker nay; case nay chung minh khuon
# VIET va khuon MAY DOC con khop. Doi chung duong truoc, roi tiem hong.
run "P115 khuon canonical 3 artifact rut duoc + frontmatterField doc duoc (E1,E8)" \
  node --input-type=module - "$ROOT" <<'P102JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const path = await import("node:path");
const { createRequire } = await import("node:module");
const require = createRequire(import.meta.url);
const { frontmatterField } = require(path.join(root, "lib/evidence-core.js"));
const { fileFromTemplate } = await import(path.join(root, "tests/fixtures/from-template.mjs"));
const R = p => path.join(root, "skills/acceptance/references", p);
const die = m => { console.error(m); process.exit(1); };

const cases = [
  ["uat-session-template.md", "UAT-FRONTMATTER-TEMPLATE",
   { slug: "s1", feature: "f", owner: "o", stage: "held", verdict: "release",
     decided_by: "Manh", decided_at: "2026-08-03T00:00:00Z", gateUAT_minutes: "20" },
   { verdict: "release", stage: "held", decided_at: "2026-08-03T00:00:00Z" }],
  ["contract-template.md", "CONTRACT-FRONTMATTER-TEMPLATE",
   { feature: "f", slug: "s2", owner: "o", risk_tier: "T2", surfaces: "cli", status: "draft" },
   { status: "draft", risk_tier: "T2", slug: "s2" }],
  ["opportunity-template.md", "OPP-FRONTMATTER-TEMPLATE",
   { slug: "s3", feature: "f", owner: "o", stage: "decided", decision: "build",
     decided_by: "M", decided_at: "2026-08-03T00:00:00Z", gate0_minutes: "10",
     base_commit: "abc", disposition: "keep" },
   { stage: "decided", decision: "build" }],
];
for (const [file, marker, values, expect] of cases) {
  const txt = fileFromTemplate(R(file), marker, values);
  for (const [k, v] of Object.entries(expect))
    if (frontmatterField(txt, k) !== v)
      die(file + ": reader doc " + k + " = " + JSON.stringify(frontmatterField(txt, k)) + ", mong " + v);
  // doi chung am: marker sai thi helper PHAI nem, khong im lang tra rong
  let threw = false;
  try { fileFromTemplate(R(file), marker + "-KHONG-CO", values); } catch { threw = true; }
  if (!threw) die(file + ": marker sai ma helper van tra ve noi dung");
}
console.log("P115 OK");
P102JS

# ── P116-P118: bo sinh ban do — bucket, bat bien, xac dinh, canh ───────────
# Fixture code-sinh trong chinh lan chay, RUT TU KHUON canonical (P115 canh
# khuon do). Moi case am tinh co doi chung duong truoc va ghim dung thong diep.
run "P116 product-map bucket du moi hang + enum-lac tung field dieu huong (E1)" \
  node --input-type=module - "$ROOT" <<'P103JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const fs = await import("node:fs"); const os = await import("node:os");
const path = await import("node:path");
const { renderProductMap } = await import(path.join(root, "scripts/product-map.mjs"));
const { fileFromTemplate } = await import(path.join(root, "tests/fixtures/from-template.mjs"));
const R = p => path.join(root, "skills/acceptance/references", p);
const die = m => { console.error(m); process.exit(1); };

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p103-"));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const contract = (slug, status) => fileFromTemplate(R("contract-template.md"),
  "CONTRACT-FRONTMATTER-TEMPLATE",
  { feature: "viec " + slug, slug, owner: "o@o", risk_tier: "T2", surfaces: "cli", status });
const opp = (slug, stage, decision) => fileFromTemplate(R("opportunity-template.md"),
  "OPP-FRONTMATTER-TEMPLATE",
  { slug, feature: "co hoi " + slug, owner: "o@o", stage, decision, decided_by: "M",
    decided_at: "2026-08-01T00:00:00Z", gate0_minutes: "10", base_commit: "abc",
    disposition: "archive" });
const uat = (slug, verdict) => fileFromTemplate(R("uat-session-template.md"),
  "UAT-FRONTMATTER-TEMPLATE",
  { slug, feature: "phien " + slug, owner: "o@o", stage: "held", verdict,
    decided_by: "M", decided_at: "2026-08-02T00:00:00Z", gateUAT_minutes: "20" });

W("_acceptance/config.yaml", "schema_version: 1\n");
W("_acceptance/a-can-nhac/opportunity.md", opp("a-can-nhac", "discovery", ""));
W("_acceptance/b-sap-mo/opportunity.md", opp("b-sap-mo", "decided", "build"));
W("_acceptance/c-cho-duyet/contract.md", contract("c-cho-duyet", "draft"));
W("_acceptance/d-dang-dung/contract.md", contract("d-dang-dung", "approved"));
W("_acceptance/e-cho-nghiem-thu/contract.md", contract("e-cho-nghiem-thu", "signed-off"));
W("_acceptance/e-cho-nghiem-thu/opportunity.md", opp("e-cho-nghiem-thu", "decided", "build"));
W("_acceptance/f-da-ship/contract.md", contract("f-da-ship", "signed-off"));
W("_acceptance/g-release/contract.md", contract("g-release", "signed-off"));
W("_acceptance/g-release/opportunity.md", opp("g-release", "decided", "build"));
W("_acceptance/g-release/uat-session.md", uat("g-release", "release"));
W("_acceptance/h-kill/contract.md", contract("h-kill", "signed-off"));
W("_acceptance/h-kill/uat-session.md", uat("h-kill", "kill"));
W("_acceptance/i-xep-lai/opportunity.md", opp("i-xep-lai", "decided", "park"));
W("_acceptance/j-bac/opportunity.md", opp("j-bac", "decided", "kill"));
W("_acceptance/k-hong/contract.md", "khong co frontmatter\n");
W(".out-of-scope/mot-de-xuat-da-bac.md", "# Mien tru X — DA TU CHOI\n\nvan xuoi\n");

const sectionOfIn = (txt, slug) => {
  let cur = null;
  for (const line of txt.split("\n")) {
    if (line.startsWith("## ")) cur = line.slice(3).trim();
    if (line.includes("(`" + slug + "`)") || line.includes("`" + slug + "` —")) return cur;
  }
  return null;
};
const out = renderProductMap(tmp);
const EXPECT = {
  "a-can-nhac": "Đang cân nhắc cơ hội",
  "b-sap-mo": "Sắp mở vòng",
  "c-cho-duyet": "Chờ duyệt phạm vi",
  "d-dang-dung": "Đang làm",
  "e-cho-nghiem-thu": "Đã giao — chờ phiên nghiệm thu",
  "f-da-ship": "Đã giao",
  "g-release": "Đã nghiệm thu giá trị",
  "h-kill": "Đã nghiệm thu giá trị",
  "i-xep-lai": "Xếp lại sau",
  "j-bac": "Đã bác từ khám phá",
  "k-hong": "Hồ sơ hỏng",
};
for (const [slug, sec] of Object.entries(EXPECT))
  if (sectionOfIn(out, slug) !== sec)
    die(slug + ": nam o " + JSON.stringify(sectionOfIn(out, slug)) + ", mong " + JSON.stringify(sec));
if (!out.includes("Mien tru X — DA TU CHOI")) die("thieu muc ngoai pham vi (title dong # dau file)");
// Neo vao TIEU DE muc, khong cat chuoi tran: ten o gio xuat hien ca trong
// hinh mermaid o dau file lan o tieu de, cat tran se vo nham khoi hinh.
const khoiNghiemThu = (out.split("## Đã nghiệm thu giá trị")[1] || "").split("\n## ")[0];
if (!/release/i.test(khoiNghiemThu) || !/kill/i.test(khoiNghiemThu))
  die("muc da nghiem thu khong ghi ket cuc tung slug");
for (const slug of Object.keys(EXPECT)) {
  const n = out.split("`" + slug + "`").length - 1;
  if (n !== 1) die(slug + " xuat hien " + n + " lan trong map");
}

// Danh sach cap (file, field) can tiem lay TU NAV_RULES, khong go tay: ban go
// tay cu co 4 muc va thieu dung `uat-session.md/stage` — cap thu 5 cua bang
// luat khong he co phep do nao, xoa han khoi bang van xanh ca suite (S4-r13).
// Bang fixture duoi day chi tra loi "do cap nay o workspace nao"; bang luat no
// ra ma bang nay khong no theo thi case DUNG AM I, khong lang le bo qua.
const { NAV_FIELDS } = (await import("node:module")).createRequire(
  path.join(root, "lib/workspace-record.js"))(path.join(root, "lib/workspace-record.js"));
const FIXTURE = {
  "contract.md/status":      "d-dang-dung",
  "opportunity.md/stage":    "a-can-nhac",
  "opportunity.md/decision": "b-sap-mo",
  "uat-session.md/verdict":  "g-release",
  "uat-session.md/stage":    "g-release",
};
const LAC = "khong-thuoc-tu-vung";
// MO NEO hai chieu. Suy danh sach tu NAV_RULES vá được lỗ "them field ma quen
// them ca", nhung tu no lai mo lo nguoc lai: XOA mot luat khoi bang thi danh
// sach suy ra cung ngan lai, ca hai reader cung ngung kiem, va khong phep do
// nao do. Thuoc suy tu vat thi no theo vat — va teo theo vat. Nen FIXTURE
// dong vai mo neo VIET TAY: hai ben phai phu nhau, lech chieu nao cung DUNG.
const capLuat = new Set(NAV_FIELDS.map(([f, k]) => f + "/" + k));
const capNeo = new Set(Object.keys(FIXTURE));
for (const c of capNeo)
  if (!capLuat.has(c)) die("P116 neo cap " + c + " ma NAV_RULES khong con — "
    + "mot field dieu huong vua bi xoa khoi bang luat: hai reader cung ngung kiem no. "
    + "Co chu y thi bo dong tuong ung khoi FIXTURE, dung sua thuoc cho vua vat.");
for (const [file, field] of NAV_FIELDS) {
  const slug = FIXTURE[file + "/" + field];
  if (!slug) die("NAV_RULES co " + file + "/" + field + " ma P116 khong co fixture — "
    + "them fixture cho cap do, dung de mot field dieu huong khong ai do");
  const p = path.join(tmp, "_acceptance", slug, file);
  const orig = fs.readFileSync(p, "utf8");
  const re = new RegExp("^" + field + ":.*$", "m");
  // Doi chung duong hai chan: fixture PHAI chua field (khong thi buoc tiem
  // chua bao gio chay), va ban NGUYEN VEN phai KHONG nam o Ho so hong.
  if (!re.test(orig)) die("fixture " + slug + "/" + file + " khong co dong \"" + field + ":\" — buoc tiem chua bao gio chay");
  if (sectionOfIn(renderProductMap(tmp), slug) === "Hồ sơ hỏng")
    die("fixture " + slug + " da hong san truoc khi tiem — case khong phan biet duoc gi");
  fs.writeFileSync(p, orig.replace(re, field + ": " + LAC));
  const mutated = renderProductMap(tmp);
  const cur = sectionOfIn(mutated, slug);
  if (cur !== "Hồ sơ hỏng")
    die("enum-lac o " + file + "/" + field + " (" + slug + "): slug nam o " + JSON.stringify(cur) + ", mong Ho so hong");
  const hongBlock = (mutated.split("## Hồ sơ hỏng")[1] || "");
  if (!hongBlock.includes(field) || !hongBlock.includes(LAC))
    die("enum-lac o " + file + "/" + field + ": muc Ho so hong khong neu ten field + gia tri la");
  fs.writeFileSync(p, orig);
}
console.log("P116 OK (" + NAV_FIELDS.length + " cap field dieu huong, suy tu NAV_RULES)");
P103JS

run "P117 map GIU NGUYEN qua approved->implemented->verified; DOI qua cong nguoi (E2)" \
  node --input-type=module - "$ROOT" <<'P104JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const fs = await import("node:fs"); const os = await import("node:os");
const path = await import("node:path");
const { renderProductMap } = await import(path.join(root, "scripts/product-map.mjs"));
const { fileFromTemplate } = await import(path.join(root, "tests/fixtures/from-template.mjs"));
const die = m => { console.error(m); process.exit(1); };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p104-"));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const contract = status => fileFromTemplate(
  path.join(root, "skills/acceptance/references/contract-template.md"),
  "CONTRACT-FRONTMATTER-TEMPLATE",
  { feature: "viec x", slug: "x", owner: "o@o", risk_tier: "T2", surfaces: "cli", status });
W("_acceptance/config.yaml", "schema_version: 1\n");
W("_acceptance/x/contract.md", contract("approved"));
const cPath = path.join(tmp, "_acceptance/x/contract.md");
const base = renderProductMap(tmp);
for (const s of ["implemented", "verified"]) {
  fs.writeFileSync(cPath, contract(s));
  if (renderProductMap(tmp) !== base)
    die("map DOI khi chuyen may sang " + s + " — --check se do oan giua vong");
}
// doi chung DUONG: qua cong NGUOI thi map PHAI doi, khong thi phep do nay chet
fs.writeFileSync(cPath, contract("signed-off"));
if (renderProductMap(tmp) === base) die("map khong doi khi da ky signed-off — bucket khong con phan biet gi");
fs.writeFileSync(cPath, contract("draft"));
if (renderProductMap(tmp) === base) die("map khong doi giua draft va approved — phep do nay khong song");
console.log("P117 OK");
P104JS

run "P118 render 2 lan giong het + sort theo slug + canh chi hien khi ho so co (E4,E5)" \
  node --input-type=module - "$ROOT" <<'P105JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const fs = await import("node:fs"); const os = await import("node:os");
const path = await import("node:path");
const { renderProductMap } = await import(path.join(root, "scripts/product-map.mjs"));
const { fileFromTemplate } = await import(path.join(root, "tests/fixtures/from-template.mjs"));
const die = m => { console.error(m); process.exit(1); };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p105-"));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const contract = (slug, extra = "") => fileFromTemplate(
  path.join(root, "skills/acceptance/references/contract-template.md"),
  "CONTRACT-FRONTMATTER-TEMPLATE",
  { feature: "viec " + slug, slug, owner: "o@o", risk_tier: "T2", surfaces: "cli",
    status: "draft" }).replace("status: draft", "status: draft" + extra);
W("_acceptance/config.yaml", "schema_version: 1\n");
// tao KHONG theo thu tu chu, de chung minh sort theo slug chu khong theo thu tu file
W("_acceptance/zebra/contract.md", contract("zebra"));
W("_acceptance/alpha/contract.md", contract("alpha", "\nepic: nen-tang\nrelates: zebra"));
W("_acceptance/mike/contract.md", contract("mike"));
const a = renderProductMap(tmp), b = renderProductMap(tmp);
if (a !== b) die("hai lan render khac nhau — --check khong the tin duoc");
const order = ["alpha", "mike", "zebra"].map(s => a.indexOf("(`" + s + "`)"));
if (!(order[0] < order[1] && order[1] < order[2])) die("khong sort theo slug: " + JSON.stringify(order));
const lineOf = s => a.split("\n").find(l => l.includes("(`" + s + "`)")) || "";
if (!lineOf("alpha").includes("epic: nen-tang") || !lineOf("alpha").includes("liên quan: zebra"))
  die("canh co trong ho so ma khong hien: " + lineOf("alpha"));
if (/epic|thay thế|liên quan/.test(lineOf("zebra")))
  die("slug khong khai canh ma dong van co nhan canh: " + lineOf("zebra"));

// feature: mo dau bang chinh slug -> dong ban do khong duoc lap lai slug hai lan
W("_acceptance/omega/contract.md", contract("omega").replace(
  "feature: viec omega", "feature: omega — lam cho nguoi dung X"));
const withEcho = renderProductMap(tmp);
const lo = withEcho.split("\n").find(l => l.includes("(`omega`)")) || "";
if ((lo.match(/omega/g) || []).length !== 1)
  die("dong ban do vong lai ten may hai lan: " + lo);
if (!lo.includes("lam cho nguoi dung X")) die("cat tien to lam mat luon mo ta: " + lo);
console.log("P118 OK");
P105JS

# ── P119: --check 4 trang thai + goi y lenh chay duoc o CHINH repo dang do ──
run "P119 --check fresh/stale/thieu-file/chua-init + path suy tu vi tri script (E3)" \
  node --input-type=module - "$ROOT" <<'P106JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const fs = await import("node:fs"); const os = await import("node:os");
const path = await import("node:path");
const { execFileSync } = await import("node:child_process");
const { fileFromTemplate } = await import(path.join(root, "tests/fixtures/from-template.mjs"));
const die = m => { console.error(m); process.exit(1); };
const SCRIPT = path.join(root, "scripts/product-map.mjs");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p106-"));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const runCheck = () => { try {
    const out = execFileSync("node", [SCRIPT, "--root", tmp, "--check"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return { code: 0, out, err: "" };
  } catch (e) { return { code: e.status, out: String(e.stdout || ""), err: String(e.stderr || "") }; } };

// 1. chua init -> exit 0 co note (KHONG do oan repo chua dung cong)
let r = runCheck();
if (r.code !== 0 || !/chưa dựng cổng/.test(r.out)) die("chua init: code=" + r.code + " out=" + r.out);

W("_acceptance/config.yaml", "schema_version: 1\n");
W("_acceptance/x/contract.md", fileFromTemplate(
  path.join(root, "skills/acceptance/references/contract-template.md"),
  "CONTRACT-FRONTMATTER-TEMPLATE",
  { feature: "viec x", slug: "x", owner: "o@o", risk_tier: "T2", surfaces: "cli", status: "draft" }));

// 2. chua co PRODUCT-MAP.md -> exit 0 co note (duong doc-cu cho consumer chua dung)
r = runCheck();
if (r.code !== 0 || !/chưa có/.test(r.out)) die("thieu file: code=" + r.code + " out=" + r.out);

// 3. DOI CHUNG DUONG: sinh roi check -> phai XANH truoc khi tin mau do o buoc 4
execFileSync("node", [SCRIPT, "--root", tmp], { stdio: "ignore" });
r = runCheck();
if (r.code !== 0) die("vua sinh xong ma --check do: " + r.err);

// 4. tiem lech -> exit 1 + DUNG thong diep + duong dan goi y chay duoc
const mapPath = path.join(tmp, "PRODUCT-MAP.md");
fs.writeFileSync(mapPath, fs.readFileSync(mapPath, "utf8") + "\n- **la-hoac**\n");
r = runCheck();
if (r.code !== 1) die("map lech ma --check khong exit 1 (code=" + r.code + ")");
if (!r.err.includes("PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node "))
  die("thong diep khong khop khuon ghim: " + r.err);
const m = r.err.match(/chạy: node (\S+) --root \./);
if (!m) die("thong diep khong neu duong dan script: " + r.err);
if (!fs.existsSync(path.resolve(tmp, m[1])))
  die("duong dan trong goi y KHONG ton tai khi chay tu repo dang do: " + m[1]);

// 5. goi script QUA MOT SYMLINK: loader ESM giai symlink cho import.meta.url
// nhung argv[1] thi khong, nen so bang path.resolve se cho isMain=false va
// script IM LANG exit 0 — --check xanh ma chua kiem gi. Repo duoi /tmp,
// /var/folders, hay home mount deu dinh. Chan do nay phai o day, khong the
// dua vao viec suite tinh co chay trong ban sao co symlink.
const linkDir = fs.mkdtempSync(path.join(os.tmpdir(), "p106-link-"));
const link = path.join(linkDir, "kit");
fs.symlinkSync(root, link);
let viaLink;
try {
  execFileSync("node", [path.join(link, "scripts/product-map.mjs"), "--root", tmp, "--check"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  viaLink = { code: 0, err: "" };
} catch (e) { viaLink = { code: e.status, err: String(e.stderr || "") }; }
if (viaLink.code !== 1 || !viaLink.err.includes("lệch với hồ sơ xưởng"))
  die("goi qua symlink: map dang lech ma script khong bao (code=" + viaLink.code +
      ") — khoi CLI khong chay, --check se xanh gia o moi repo co symlink");
// 6. CHOT MODE: mot loi go khong duoc bien lenh KIEM thanh lenh GHI. Khuon nay
// chep tu scripts/sync-plugin-packages.sh — no da dung chot cho dung lop loi
// nay ("--chek tung in 'Synced', thoat 0, VA xoa luon drift vua tiem").
fs.writeFileSync(mapPath, fs.readFileSync(mapPath, "utf8"));  // map dang LECH tu buoc 4
const truocKhiGoNham = fs.readFileSync(mapPath, "utf8");
let goNham;
try {
  execFileSync("node", [SCRIPT, "--root", tmp, "--chek"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  goNham = { code: 0, err: "" };
} catch (e) { goNham = { code: e.status, err: String(e.stderr || "") }; }
if (goNham.code !== 2) die(`mode la '--chek' phai exit 2, duoc ${goNham.code}`);
if (!/tham số lạ/.test(goNham.err)) die("mode la khong ghim dung thong diep: " + goNham.err);
if (fs.readFileSync(mapPath, "utf8") !== truocKhiGoNham)
  die("mot loi go da GHI DE ban do — lenh KIEM bien thanh lenh GHI, xoa luon bang chung lech");

// 7. CHOT THU TU: `--root` khong co gia tri thi `--check` bi nuot lam duong dan
let saiThuTu;
try {
  execFileSync("node", [SCRIPT, "--root", "--check"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  saiThuTu = { code: 0, err: "" };
} catch (e) { saiThuTu = { code: e.status, err: String(e.stderr || "") }; }
if (saiThuTu.code !== 2) die(`--root khong gia tri phai exit 2, duoc ${saiThuTu.code}`);

// 8. XOA ban do: file DA duoc git theo doi ma bien mat la mot lan XOA, khong
// phai "chua tung dung". Ban do nam trong t1_skip_globs nen mot PR chi xoa no
// vua bo qua cong nghiem thu vua xanh o CI neu day cung exit 0. Mirror bi xoa
// thi P30 do — ban do phai xu nhu vay.
const gitTmp = fs.mkdtempSync(path.join(os.tmpdir(), "p106-git-"));
fs.mkdirSync(path.join(gitTmp, "_acceptance/x"), { recursive: true });
// Repo NAY dung ban do, nen no KHAI mien tru — dung thu `acceptance-init`
// phat ra. Mot repo co PRODUCT-MAP.md commit ma KHONG khai la cau hinh khong
// ton tai that: khong khai thi chinh cong nghiem thu chan file do, va nam
// than cong nguoi deu BO QUA viec ve lai no.
fs.writeFileSync(path.join(gitTmp, "_acceptance/config.yaml"),
  "schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - \"PRODUCT-MAP.md\"\n");
fs.writeFileSync(path.join(gitTmp, "_acceptance/x/contract.md"), "---\nstatus: draft\n---\n");
const g = (...a) => execFileSync("git", ["-C", gitTmp, ...a], { stdio: "ignore" });
g("init", "-q"); g("config", "user.email", "t@t"); g("config", "user.name", "t");
execFileSync("node", [SCRIPT, "--root", gitTmp], { stdio: "ignore" });
g("add", "-A"); g("commit", "-qm", "init");
// doi chung DUONG: con file thi --check xanh
try { execFileSync("node", [SCRIPT, "--root", gitTmp, "--check"], { stdio: "ignore" }); }
catch { die("doi chung duong hong: ban do vua sinh + commit ma --check da do"); }
fs.unlinkSync(path.join(gitTmp, "PRODUCT-MAP.md"));
let daXoa;
try {
  execFileSync("node", [SCRIPT, "--root", gitTmp, "--check"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  daXoa = { code: 0, err: "" };
} catch (e) { daXoa = { code: e.status, err: String(e.stderr || "") }; }
if (daXoa.code === 0) die("XOA ban do da theo doi ma --check VAN xanh — cong duy nhat canh no im lang");
if (!/đã bị xoá/.test(daXoa.err)) die("xoa ban do khong ghim dung thong diep: " + daXoa.err);

// 9. XOA DA COMMIT — hinh dang THAT ma CI gap. Chan 8 chi xoa o cay lam viec,
// nhung mot PR mang toi CI la mot cay da checkout SAU khi xoa duoc commit: file
// khong con trong index, nen hoi ls-files mot minh la fail-OPEN (in "repo chua
// dung ban do" roi exit 0). Do la lo nang nhat: PRODUCT-MAP.md nam trong
// t1_skip_globs nen rang T1-escape cua pre-merge KHONG doi PR mang _acceptance/
// cho no, va --check trong CI la cong DOC LAP DUY NHAT ma ADR 0007 lay lam can
// cu cho mien tru do (S4-r14).
g("checkout", "--", "PRODUCT-MAP.md");
g("rm", "-q", "PRODUCT-MAP.md"); g("commit", "-qm", "xoa ban do");
let daXoaCommit;
try {
  execFileSync("node", [SCRIPT, "--root", gitTmp, "--check"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  daXoaCommit = { code: 0, err: "" };
} catch (e) { daXoaCommit = { code: e.status, err: String(e.stderr || "") }; }
if (daXoaCommit.code === 0)
  die("XOA DA COMMIT ma --check xanh — mot PR chi xoa ban do vua bo qua cong nghiem thu vua xanh CI");
if (!/đã bị xoá/.test(daXoaCommit.err))
  die("xoa da commit khong ghim dung thong diep: " + daXoaCommit.err);

// 9b. CLONE NONG — hinh dang THAT ma CI dung. Chan 9 tu dung mot repo local du
// lich su, nen no khong noi duoc gi ve `actions/checkout` mac dinh (depth 1):
// commit bi graft nen `git log --diff-filter=D` khong thay lan xoa nao, va chot
// lai fail-open y nhu truoc khi vá (S4-r15 — "thuoc phai gan vao vat duoc
// giao", hinh dang 4). Case nay do dung tren mot clone --depth 1.
const nong = fs.mkdtempSync(path.join(os.tmpdir(), "p106-nong-"));
execFileSync("git", ["clone", "--quiet", "--depth", "1", "file://" + gitTmp, path.join(nong, "cay")],
  { stdio: "ignore" });
const cayNong = path.join(nong, "cay");
// Doi chung: no THAT SU la clone nong (khong thi ca nay do vao khoang khong)
const laNong = execFileSync("git", ["-C", cayNong, "rev-parse", "--is-shallow-repository"],
  { encoding: "utf8" }).trim();
if (laNong !== "true") die("clone khong nong that (" + laNong + ") — chan CLONE NONG khong do duoc gi");
let nongRes;
try {
  execFileSync("node", [SCRIPT, "--root", cayNong, "--check"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  nongRes = { code: 0, err: "" };
} catch (e) { nongRes = { code: e.status, err: String(e.stderr || "") }; }
if (nongRes.code === 0)
  die("tren CLONE NONG (dung thu CI checkout ra) mot lan xoa DA COMMIT lai xanh — "
    + "chot duy nhat canh mien tru t1 fail-open; job chay --check phai co fetch-depth: 0");
fs.rmSync(nong, { recursive: true, force: true });

// 9c. Va job CI chay --check phai THAT SU khai fetch-depth: 0 — sua script ma
// quen sua workflow thi chan 9b do tren may nhung CI van nong.
const wf = fs.readFileSync(path.join(root, ".github/workflows/gate.yml"), "utf8");
const jobs = wf.split(/\n  (?=[a-z][a-z0-9_-]*:\n)/);
const jobCheck = jobs.find(j => j.includes("product-map.mjs --root . --check"));
if (!jobCheck) die("khong job CI nao chay `product-map.mjs --root . --check` — chot khong duoc mac vao CI");
if (!/fetch-depth:\s*0/.test(jobCheck))
  die("job CI chay --check KHONG khai fetch-depth: 0 — checkout mac dinh la depth 1, chot phat hien xoa fail-open");

fs.rmSync(gitTmp, { recursive: true, force: true });

// 10. Doi chung DUONG cho chan 9: repo CHUA TUNG dung ban do van phai di duong
// doc-cu (exit 0). Thieu chan nay thi "luon exit 1" cung qua chan 9 — va no se
// chan moi repo tieu thu chua bat ban do, dung cai ADR 0007 viet ra de tranh.
const chuaTung = fs.mkdtempSync(path.join(os.tmpdir(), "p106-moi-"));
fs.mkdirSync(path.join(chuaTung, "_acceptance"), { recursive: true });
fs.writeFileSync(path.join(chuaTung, "_acceptance/config.yaml"), "schema_version: 1\n");
execFileSync("git", ["-C", chuaTung, "init", "-q"], { stdio: "ignore" });
try { execFileSync("node", [SCRIPT, "--root", chuaTung, "--check"], { stdio: "ignore" }); }
catch { die("repo CHUA TUNG dung ban do ma --check do — duong doc-cu bi chan (ADR 0007)"); }
fs.rmSync(chuaTung, { recursive: true, force: true });
console.log("P119 OK");
P106JS

# ── P120: nghi thuc uat-session du chot + DUNG THU TU + khong khoa invocation ─
run "P120 uat-session giu chot spec §2.3 dung thu tu; skill MO nhu design-pass (E12)" \
  python3 - "$ROOT" <<'PY107'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
p = root / "skills/uat-session/SKILL.md"
assert p.is_file(), "thieu skills/uat-session/SKILL.md"
raw = p.read_text(encoding="utf-8")
# Chuan hoa khoang trang TRUOC khi soi: lo hua la "than skill co chot X",
# khong phai "chuoi X nam gon tren mot dong". Do nguyen van thi mot lan
# xuong dong lam phep do do — do la do TU VUNG chu khong do QUAN HE.
t = re.sub(r"\s+", " ", raw)

# 5 chot QUY TRINH phai xuat hien dung thu tu nay trong than skill
FLOW = [
    ("dieu kien vao", "status: signed-off"),
    ("nguong da chot tai Cong Dang", "ngưỡng UAT đã chốt tại"),
    ("chep nguyen van + cam sua sau khi thay so", "NGUYÊN VĂN"),
    ("cham kin TRUOC thao luan", "Chấm kín TRƯỚC thảo luận"),
    ("cau rang buoc", "gửi cho khách nào"),
    # Neo luc KY phai nam trong chuoi thu tu: thieu no thi ca khoi cham-kin co
    # the bi chuyen xuong SAU khi ky ma phep do van xanh (thu tu tuong doi
    # giua hai chot trong cung khoi khong doi) — do da dam mot lan.
    ("luc ky", "Agent KHÔNG điền verdict"),
    ("lam moi ban do sau khi ky", "product-map.mjs"),
]
pos = []
for label, needle in FLOW:
    i = t.find(needle)
    assert i >= 0, f"thieu chot: {label} ({needle!r})"
    pos.append((label, i))
for a, b in zip(pos, pos[1:]):
    assert a[1] < b[1], f"chot lech thu tu: {a[0]} phai dung truoc {b[0]}"

# 2 chot TUYEN BO chi can co mat (co the nam o loi mo dau)
assert "THÀNH CÔNG của quy trình" in t, "thieu cau 'kill la thanh cong cua quy trinh'"

# lam moi ban do, va phai nam SAU luc ky
assert "product-map.mjs" in t, "thieu buoc lam moi ban do"
assert t.find("product-map.mjs") > t.find("decided_by"), \
    "buoc lam moi ban do nam TRUOC luc ky — sai diem regen"

# Con tro khuon phai GIAI DUOC tren dia — do DAU RA chu khong do CHI DAN.
# Truoc S4-r7 than skill viet "references/uat-session-template.md" (tuong doi
# voi thu muc skill) trong khi khuon nam o skills/acceptance/references/, nen
# agent chay that se doc truot va tu go frontmatter — mat luon seam ma P115
# dung ra de giu ben viet va ben doc khop nhau.
m = re.search(r"Chép khuôn từ `([^`]+)`", raw)
assert m, "than skill khong con cau 'Chép khuôn từ `<duong-dan>`'"
# Bóc MỌI dạng gốc-plugin, gồm dạng hai-harness ${CLAUDE_PLUGIN_ROOT:-$PLUGIN_ROOT}
ct = re.sub(r"^\$\{?CLAUDE_PLUGIN_ROOT(:-\$\{?PLUGIN_ROOT\}?)?\}?/", "", m.group(1))
assert (root / ct).is_file(), f"con tro khuon KHONG giai duoc: {m.group(1)} -> {ct}"

# skill MO: khong co co khoa invocation (doi chung duong tren mot lenh LOCKED)
assert "disable-model-invocation" not in t, "uat-session bi khoa — tien le design-pass la MO"
locked = (root / "commands/start.md").read_text(encoding="utf-8")
assert "disable-model-invocation: true" in locked, \
    "doi chung duong hong: commands/start.md le ra phai co co khoa"

# dot bien: bo mot chot thi phep do PHAI mat dau moc
# Dua ban da tiem QUA CHINH vong kiem thu tu o tren — assert tren chuoi vua
# bi replace la hang-dung, khong do lai gi (lop loi CLAUDE.md goi ten).
def flow_errs(txt):
    errs, last = [], -1
    for label, needle in FLOW:
        i = txt.find(needle)
        if i < 0: errs.append(f"thieu chot: {label}")
        elif i < last: errs.append(f"chot lech thu tu: {label}")
        else: last = i
    return errs
assert flow_errs(t) == [], f"doi chung duong: ban that phai xanh, duoc {flow_errs(t)}"
mut = t.replace("Chấm kín TRƯỚC thảo luận", "Thu y kien")
assert any("cham kin" in e for e in flow_errs(mut)), \
    f"dot bien go chot cham kin ma phep do van xanh: {flow_errs(mut)}"
PY107

# ── P121: start-scan doc phien nghiem thu + trang thai ban do (E10) ────────
run "P121 o cho-Cong-Gia-tri + state theo verdict + since 2 nhanh + map 4 to hop (E10)" \
  node --input-type=module - "$ROOT" <<'P108JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const fs = await import("node:fs"); const os = await import("node:os");
const path = await import("node:path");
const { execFileSync } = await import("node:child_process");
const { fileFromTemplate } = await import(path.join(root, "tests/fixtures/from-template.mjs"));
const die = m => { console.error(m); process.exit(1); };
const SCAN = path.join(root, "scripts/start-scan.mjs");
const MAP = path.join(root, "scripts/product-map.mjs");
const R = p => path.join(root, "skills/acceptance/references", p);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p108-"));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const scan = () => JSON.parse(execFileSync("node", [SCAN, "--root", tmp], { encoding: "utf8" }));
const contract = (slug, status) => fileFromTemplate(R("contract-template.md"),
  "CONTRACT-FRONTMATTER-TEMPLATE",
  { feature: "viec " + slug, slug, owner: "o@o", risk_tier: "T2", surfaces: "cli", status });
const opp = (slug, decision) => fileFromTemplate(R("opportunity-template.md"),
  "OPP-FRONTMATTER-TEMPLATE",
  { slug, feature: "co hoi", owner: "o@o", stage: "decided", decision, decided_by: "M",
    decided_at: "2026-08-01T00:00:00Z", gate0_minutes: "10", base_commit: "a", disposition: "archive" });
const uat = (slug, verdict, decidedAt = "2026-08-02T00:00:00Z") =>
  fileFromTemplate(R("uat-session-template.md"), "UAT-FRONTMATTER-TEMPLATE",
    { slug, feature: "phien", owner: "o@o", stage: "held", verdict, decided_by: "M",
      decided_at: decidedAt, gateUAT_minutes: "20" });

W("_acceptance/config.yaml", "schema_version: 1\n");
W("_acceptance/a-cho-gia-tri/contract.md", contract("a-cho-gia-tri", "signed-off"));
W("_acceptance/a-cho-gia-tri/opportunity.md", opp("a-cho-gia-tri", "build"));
W("_acceptance/b-cho-co-uat/contract.md", contract("b-cho-co-uat", "signed-off"));
W("_acceptance/b-cho-co-uat/opportunity.md", opp("b-cho-co-uat", "iterate"));
W("_acceptance/b-cho-co-uat/uat-session.md", uat("b-cho-co-uat", "", "2026-07-01T00:00:00Z"));
W("_acceptance/c-release/contract.md", contract("c-release", "signed-off"));
W("_acceptance/c-release/uat-session.md", uat("c-release", "release"));
W("_acceptance/d-iterate/contract.md", contract("d-iterate", "signed-off"));
W("_acceptance/d-iterate/uat-session.md", uat("d-iterate", "iterate"));
W("_acceptance/e-kill/contract.md", contract("e-kill", "signed-off"));
W("_acceptance/e-kill/uat-session.md", uat("e-kill", "kill"));
W("_acceptance/f-uat-hong/contract.md", contract("f-uat-hong", "signed-off"));
W("_acceptance/f-uat-hong/uat-session.md", "khong co frontmatter\n");
W("_acceptance/g-uat-la/contract.md", contract("g-uat-la", "signed-off"));
W("_acceptance/g-uat-la/uat-session.md", uat("g-uat-la", "xong-roi"));
W("_acceptance/h-ship-thang/contract.md", contract("h-ship-thang", "signed-off"));

let j = scan();
const gate = s => (j.groups.gates.find(g => g.slug === s) || {}).gate;
const state = s => (j.groups.done.find(d => d.slug === s) || {}).state;
const broken = s => j.broken.find(b => b.slug === s);
if (gate("a-cho-gia-tri") !== "gia-tri") die("signed-off duong A khong vao o cho-Cong-Gia-tri");
if (gate("b-cho-co-uat") !== "gia-tri") die("uat co file nhung verdict rong phai VAN cho ky");
if (state("c-release") !== "released") die("verdict release -> released, got " + state("c-release"));
if (state("d-iterate") !== "uat-iterate") die("verdict iterate -> uat-iterate, got " + state("d-iterate"));
if (state("e-kill") !== "uat-kill") die("verdict kill -> uat-kill, got " + state("e-kill"));
if (!broken("f-uat-hong") || !/uat-session/.test(broken("f-uat-hong").file))
  die("uat hong khong vao broken[] kem ten file");
if (!broken("g-uat-la") || !/xong-roi/.test(broken("g-uat-la").reason))
  die("verdict ngoai enum khong vao broken[] kem gia tri la");
if (state("h-ship-thang") !== "signed-off") die("signed-off khong duong A phai la da-ky thuong");
// since 2 nhanh: co decided_at cua uat -> dung no; thieu -> mtime contract
const gA = j.groups.gates.find(g => g.slug === "a-cho-gia-tri");
const gB = j.groups.gates.find(g => g.slug === "b-cho-co-uat");
if (gB.since !== "2026-07-01T00:00:00Z") die("since khong lay decided_at cua uat: " + gB.since);
if (!gA.since || gA.since === gB.since) die("since thieu decided_at phai roi ve mtime contract");
if (j.groups.gates[0].slug !== "b-cho-co-uat") die("cong cho lau nhat phai dung dau");
// Khoa skipped[] da bi go han (het nguon sinh) — kiem SU VANG MAT cua khoa,
// khong grep noi dung mot mang luon rong (chan chet).
if ("skipped" in j) die("skipped[] van con trong dau ra du khong con nguon sinh nao");

// map 4 to hop
if (j.map.present !== false || j.map.fresh !== null) die("map vang: " + JSON.stringify(j.map));
execFileSync("node", [MAP, "--root", tmp], { stdio: "ignore" });
j = scan();
if (j.map.present !== true || j.map.fresh !== true) die("map fresh: " + JSON.stringify(j.map));
fs.appendFileSync(path.join(tmp, "PRODUCT-MAP.md"), "\n- **la**\n");
j = scan();
if (j.map.present !== true || j.map.fresh !== false) die("map stale: " + JSON.stringify(j.map));
// khong doc duoc ban do -> fresh null (KHONG crash, KHONG bao xanh gia).
// Ep loi bang cach bien PRODUCT-MAP.md thanh THU MUC: EISDIR xay ra cho moi
// nguoi dung ke ca root, nen phep do khong phu thuoc quyen cua may chay CI.
const mapP = path.join(tmp, "PRODUCT-MAP.md");
fs.unlinkSync(mapP); fs.mkdirSync(mapP);
const jErr = scan();
fs.rmdirSync(mapP);
if (jErr.map.present !== true || jErr.map.fresh !== null)
  die("khong doc duoc ban do phai cho present=true/fresh=null, got " + JSON.stringify(jErr.map));
console.log("P121 OK");
P108JS

# ── P122: diem lam moi ban do o MOI than cong nguoi + config self-host ─────
run "P122 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)" \
  python3 - "$ROOT" <<'PY109'
import sys
from pathlib import Path
root = Path(sys.argv[1])
# (than lenh, moc "ghi field cong" phai dung TRUOC buoc regen)
BODIES = [
    ("commands/approve.md", "approved_by"),
    ("commands/signoff.md", "human_signoff"),
    ("codex/acceptance-gate/skills/approve/SKILL.md", "approved_by"),
    ("codex/acceptance-gate/skills/signoff/SKILL.md", "human_signoff"),
    ("skills/uat-session/SKILL.md", "decided_by"),
]
for rel, anchor_field in BODIES:
    t = (root / rel).read_text(encoding="utf-8")
    assert "product-map.mjs" in t, f"{rel}: thieu buoc lam moi ban do"
    assert t.find("product-map.mjs") > t.find(anchor_field), \
        f"{rel}: buoc lam moi ban do nam TRUOC {anchor_field} — sai diem regen"
    if rel.startswith(("commands/", "codex/")):
        # Dan script qua PLUGIN_ROOT, khong hardcode 'scripts/' kieu self-host:
        # ghim duong self-host la consumer khong bao gio regen (gap-probe F3).
        seg = t[max(0, t.find("product-map.mjs") - 240): t.find("product-map.mjs")]
        assert "PLUGIN_ROOT" in seg, \
            f"{rel}: dan script bang duong dan self-host — consumer se khong bao gio regen"

cfg = (root / "_acceptance/config.yaml").read_text(encoding="utf-8")
assert "product_map:" in cfg, "config thieu executors.script.product_map"

# Loi hua la QUAN HE: khoa nam TRONG danh sach feature_loop.suite_keys. Grep
# substring ca file van xanh khi dong do bi doi sang list khac — do la dung
# cai hong can bat ("do tu vung thay vi quan he").
def suite_keys(txt):
    lines, out, inside = txt.splitlines(), [], False
    for ln in lines:
        if ln.strip() == "suite_keys:": inside = True; continue
        if inside:
            s = ln.strip()
            if s.startswith("- "): out.append(s[2:].strip())
            elif s and not s.startswith("#") and not ln.startswith("    "): break
    return out
keys = suite_keys(cfg)
assert "executors.script.product_map" in keys, \
    f"product_map khong nam trong feature_loop.suite_keys (thay: {keys})"
mut = cfg.replace("    - executors.script.product_map", "  # doi sang cho khac: executors.script.product_map")
assert "executors.script.product_map" in mut, "buoc tiem chua bao gio chay"
assert "executors.script.product_map" not in suite_keys(mut), \
    "doi khoa ra khoi suite_keys ma phep do van xanh — dang do tu vung, khong do quan he"

# Ban do cua CHINH kit: doi chung song cua P30 la CHAY --check, khong phai
# kiem file ton tai.
assert (root / "PRODUCT-MAP.md").is_file(), "kit chua commit PRODUCT-MAP.md cua chinh no"
import subprocess
rc = subprocess.run(["node", "scripts/product-map.mjs", "--root", ".", "--check"],
                    cwd=root, capture_output=True, text=True)
assert rc.returncode == 0, f"PRODUCT-MAP.md cua kit lech voi ho so xuong: {rc.stderr.strip()}"
PY109

# ── P123: HAI READER cua cung bo ho so phai dong y cai gi HONG ─────────────
run "P123 hai reader dong ket luan tren TICH DESCARTES contract x opportunity x uat (E1,E10)" \
  node --input-type=module - "$ROOT" <<'P123JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const fs = await import("node:fs"); const os = await import("node:os");
const path = await import("node:path");
const { execFileSync } = await import("node:child_process");
const { renderProductMap } = await import(path.join(root, "scripts/product-map.mjs"));
const die = m => { console.error(m); process.exit(1); };
const SCAN = path.join(root, "scripts/start-scan.mjs");
const { createRequire } = await import("node:module");
const LIB = path.join(root, "lib/workspace-record.js");
const { NAV_RULES, consumedTexts } = createRequire(LIB)(LIB);

// Ban do va bo quet vao phien la HAI READER cua cung mot bo ho so; loi hua la
// chung KHONG BAO GIO cho hai ket luan trai nhau ve "slug nay co hong khong".
//
// Phep do co HAI CHANG vi lech sinh ra tu HAI nguon khac nhau:
//   Chang 1 — TIEU THU: file nao duoc doc o trang thai nao. Tich Descartes
//     cheo file (contract x opportunity x uat) voi cac hinh dang tho.
//   Chang 2 — TU VUNG: gia tri tung field co hop luat khong. Chang 1 khong the
//     bat lop nay: moi phan tu cua no la mot GOI co dinh nhieu field cung luc
//     ("stage-la" luon di kem decision lanh), nen to hop (stage lanh x decision
//     lac) va (verdict lanh x uat-stage lac) nam NGOAI khong gian ca — dung hai
//     to hop S4-r13 dung lai duoc trong khi chang 1 van xanh. Chang 2 nhan
//     TUNG FIELD, va lay danh sach field + enum TU CHINH NAV_RULES: bang luat
//     no ra thi phep do tu no theo, khong cho ai them field ma quen them ca.
const CONTRACT = {
  "vang":        null,
  "draft":       "---\nstatus: draft\n---\n",
  "approved":    "---\nstatus: approved\n---\n",
  "implemented": "---\nstatus: implemented\n---\n",
  "verified":    "---\nstatus: verified\n---\n",
  "signed-off":  "---\nstatus: signed-off\n---\n",
  "status-la":   "---\nstatus: xong-roi\n---\n",
  "status-rong": "---\nstatus:\nrisk_tier: T2\n---\n",
  "mat-fm":      "khong co frontmatter\n",
};
const OPP = {
  "vang":       null,
  "lanh-build": "---\nstage: decided\ndecision: build\n---\n",
  "lanh-park":  "---\nstage: decided\ndecision: park\n---\n",
  "chua-quyet": "---\nstage: discovery\ndecision:\n---\n",
  "stage-la":   "---\nstage: dang-nghi\ndecision: build\n---\n",
  "stage-rong": "---\nstage:\ndecision: build\n---\n",
  "decision-la":"---\nstage: decided\ndecision: Build-hoa\n---\n",
  "mat-fm":     "khong co frontmatter\n",
};
const UAT = {
  "vang":         null,
  "chua-ky":      "---\nstage: held\nverdict:\ndecided_by:\n---\n",
  "release":      "---\nstage: held\nverdict: release\n---\n",
  "kill":         "---\nstage: held\nverdict: kill\n---\n",
  "verdict-la":   "---\nstage: held\nverdict: xong-roi\n---\n",
  "mat-fm":       "khong co frontmatter\n",
};

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p123-"));
fs.writeFileSync(path.join(tmp, "_acceptance/config.yaml".replace("_acceptance/", (fs.mkdirSync(path.join(tmp, "_acceptance"), {recursive:true}), "_acceptance/"))), "schema_version: 1\n");
const dir = path.join(tmp, "_acceptance", "x");
const dat = (name, txt) => { const p = path.join(dir, name);
  if (txt == null) { if (fs.existsSync(p)) fs.unlinkSync(p); } else fs.writeFileSync(p, txt); };

let n = 0, lanhManh = 0, hong = 0;
const lech = [];

// Dung workspace roi hoi CA HAI reader ve dung mot cau: slug nay co hong khong.
function doiChieu(nhan, { c, o, u, evidence = null, giuNguyenCay = false }) {
  if (!giuNguyenCay) {
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    dat("contract.md", c); dat("opportunity.md", o); dat("uat-session.md", u);
    if (evidence) dat("evidence-report.md", evidence);
  }
  const scan = JSON.parse(execFileSync("node", [SCAN, "--root", tmp], { encoding: "utf8" }));
  const scanHong = scan.broken.some(b => b.slug === "x");
  const mapTxt = renderProductMap(tmp);
  const mapHong = (mapTxt.split("## Hồ sơ hỏng")[1] || "").includes("`x`");
  n++; scanHong ? hong++ : lanhManh++;
  if (scanHong !== mapHong) lech.push(`[${nhan}] quet=${scanHong} ban do=${mapHong}`);
  // Slug KHONG duoc bien mat: phai o dung MOT o nao do o CA HAI ben
  const oNao = scanHong || scan.groups.gates.some(g => g.slug === "x")
    || scan.groups.inProgress.some(g => g.slug === "x") || scan.groups.done.some(g => g.slug === "x");
  if (!oNao) lech.push(`[${nhan}] slug BIEN MAT khoi bo quet`);
  if (!mapTxt.includes("`x`")) lech.push(`[${nhan}] slug BIEN MAT khoi ban do`);
  return scanHong;
}

// ── Chang 1: TIEU THU — tich Descartes cheo file ──────────────────────────
for (const [cn, ct] of Object.entries(CONTRACT))
for (const [on, ot] of Object.entries(OPP))
for (const [un, ut] of Object.entries(UAT)) {
  // Trục evidence-report.md CỐ Ý nằm ngoài phép đo này: luật chung hiện phủ ba
  // hồ sơ (contract/opportunity/uat) và bộ quét còn giữ luật RIÊNG cho
  // evidence-report — chính lỗ mà hợp đồng workspace-reader-unification (AC-1)
  // ghi nợ. Để trục đó lọt vào đây thì phép đo đỏ vì một việc ĐÃ khai là ngoài
  // phạm vi, che mất các lệch THẬT của ba trục đang đo. Nên: mọi fixture
  // `verified` được cấp một evidence-report LÀNH MẠNH.
  doiChieu(`contract=${cn} opp=${on} uat=${un}`, { c: ct, o: ot, u: ut,
    evidence: cn === "verified" ? "---\nverdict: PASS\nhuman_signoff:\n---\n" : null });
}
const nChang1 = n;

// ── Chang 2: TU VUNG — tich Descartes tung FIELD, suy tu NAV_RULES ─────────
// Mien gia tri moi field: MOI gia tri hop enum + mot gia tri ngoai tu vung +
// rong + thieu han key. Suy tu bang luat nen them enum/them field la phep do
// tu no rong ra.
const mienGiaTri = rule => [
  ...rule.enum.map(v => [v, v]),
  ["gia-tri-lac", "khong-thuoc-tu-vung"],
  ["rong", ""],
  ["thieu-key", null],
];
const dungFm = vals => "---\n"
  + Object.entries(vals).filter(([, v]) => v !== null).map(([k, v]) => `${k}: ${v}`).join("\n")
  + "\n---\n";
const tichField = file => {
  const fields = Object.entries(NAV_RULES[file]);
  let acc = [{ nhan: [], vals: {} }];
  for (const [field, rule] of fields)
    acc = acc.flatMap(p => mienGiaTri(rule).map(([tenGt, gt]) =>
      ({ nhan: [...p.nhan, `${field}=${tenGt}`], vals: { ...p.vals, [field]: gt } })));
  return acc;
};

// Ngu canh phai BAO DAM file dang do that su duoc TIEU THU — neu khong, ca
// chang 2 lang le do mot workspace ma khong reader nao doc file do, va van
// xanh vinh vien. Nen moi ngu canh bi chinh consumedTexts kiem lai duoi day.
const NGU_CANH = {
  "contract.md": [
    { ten: "mot-minh", khac: { o: null, u: null } },
  ],
  "opportunity.md": [
    { ten: "chua-co-hop-dong", khac: { c: null, u: null } },
    { ten: "da-ky-chua-nghiem-thu", khac: { c: "---\nstatus: signed-off\n---\n", u: "---\nstage: held\nverdict:\n---\n" } },
  ],
  "uat-session.md": [
    { ten: "da-ky", khac: { c: "---\nstatus: signed-off\n---\n", o: "---\nstage: decided\ndecision: build\n---\n" } },
  ],
};
const KHOA = { "contract.md": "c", "opportunity.md": "o", "uat-session.md": "u" };
let nChang2 = 0;
for (const file of Object.keys(NAV_RULES))
for (const nc of NGU_CANH[file])
for (const { nhan, vals } of tichField(file)) {
  const txt = dungFm(vals);
  const arg = { ...nc.khac, [KHOA[file]]: txt };
  // Doi chung: ngu canh nay CO tieu thu file dang do khong? Luat chung tra loi.
  const daDoc = consumedTexts({ contract: arg.c ?? null, opportunity: arg.o ?? null, uat: arg.u ?? null });
  if (daDoc[file] == null)
    die(`ngu canh "${nc.ten}" KHONG tieu thu ${file} — chang 2 do vao khoang khong`);
  doiChieu(`${file} @${nc.ten} ${nhan.join(" ")}`, {
    c: arg.c ?? null, o: arg.o ?? null, u: arg.u ?? null,
    evidence: /status: verified/.test(arg.c || "") ? "---\nverdict: PASS\nhuman_signoff:\n---\n" : null });
  nChang2++;
}

// ── Chang 3: DOC DUOC — ho so co mat nhung khong mo duoc ──────────────────
// Hai chang tren chi bien thien NOI DUNG file; chung KHONG BAO GIO dung mot file
// khong doc duoc. Do la truc thu ba: ban do tung nuot MOI loi I/O thanh "file
// vang", nen ho so mat quyen doc bi xep theo artifact BEN CANH (S4-r14).
//
// Ngu canh phai co CHO CHO LOI ROI VAO. Lan dau viet chang nay toi dat file
// hong mot minh — luc do "vang" van ra ho so hong qua luat neo (chi khac ly
// do), hai reader van dong y, va mutation go chot loi VAN XANH. Nen moi ca
// duoi day deu kem mot artifact LANH de duong truot lo ra, dung hinh dang ma
// vong 14 dung lai duoc. Va assert GHIM THONG DIEP: phai la "khong doc duoc",
// khong phai chi "hong o dau do".
const CA_IO = [
  { file: "contract.md",    truot: "Sap mo vong",
    cay: { c: "---\nstatus: approved\n---\n", o: "---\nstage: decided\ndecision: build\n---\n", u: null } },
  { file: "uat-session.md", truot: "Cho phien nghiem thu",
    cay: { c: "---\nstatus: signed-off\n---\n", o: "---\nstage: decided\ndecision: build\n---\n",
           u: "---\nstage: held\nverdict: release\n---\n" } },
  { file: "opportunity.md", truot: "Da giao",
    cay: { c: "---\nstatus: signed-off\n---\n", o: "---\nstage: decided\ndecision: build\n---\n",
           u: "---\nstage: held\nverdict:\n---\n" } },
];
let nChang3 = 0;
for (const { file, truot, cay } of CA_IO) {
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  dat("contract.md", cay.c); dat("opportunity.md", cay.o); dat("uat-session.md", cay.u);
  const p = path.join(dir, file);
  // Doi chung DUONG: cay nay khi doc duoc phai LANH — khong thi ca nay khong
  // phan biet duoc "bat dung loi I/O" voi "von da hong san".
  const truocScan = JSON.parse(execFileSync("node", [SCAN, "--root", tmp], { encoding: "utf8" }));
  if (truocScan.broken.some(b => b.slug === "x"))
    die(`ca I/O ${file}: cay da hong san khi CHUA khoa quyen doc — khong phan biet duoc gi`);
  fs.chmodSync(p, 0o000);
  // Doi chung: chay bang root thi chmod khong chan doc, ca chang do vao khoang
  // khong ma van xanh. Kiem THAT su khong doc duoc, khong thi DUNG.
  let khoaDuoc = false;
  try { fs.readFileSync(p, "utf8"); } catch { khoaDuoc = true; }
  if (!khoaDuoc) { fs.chmodSync(p, 0o644);
    die(`chmod 000 tren ${file} van doc duoc (chay bang root?) — chang DOC DUOC do vao khoang khong`); }

  const scan = JSON.parse(execFileSync("node", [SCAN, "--root", tmp], { encoding: "utf8" }));
  const mapTxt = renderProductMap(tmp);
  fs.chmodSync(p, 0o644);
  n++; hong++;

  const bScan = scan.broken.find(b => b.slug === "x");
  const khoiHong = (mapTxt.split("## Hồ sơ hỏng")[1] || "").split("\n## ")[0];
  const mapHong = khoiHong.includes("`x`");
  if (!bScan) lech.push(`[IO ${file}] bo quet KHONG goi la hong`);
  if (!mapHong) lech.push(`[IO ${file}] ban do KHONG goi la hong — no truot xuong "${truot}" theo artifact ben canh`);
  // Ghim THONG DIEP: "hong vi ly do khac" khong dong nghia bat duoc loi I/O.
  if (bScan && !/không đọc được/.test(bScan.reason))
    lech.push(`[IO ${file}] bo quet goi la hong nhung ly do khong phai loi doc: ${bScan.reason}`);
  if (mapHong && !/không đọc được/.test(khoiHong))
    lech.push(`[IO ${file}] ban do goi la hong nhung ly do khong phai loi doc: ${khoiHong.trim().slice(0, 90)}`);
  nChang3++;
}

if (lech.length) die(`${lech.length}/${n} to hop LECH:\n  ` + lech.slice(0, 8).join("\n  "));
// Doi chung DUONG: phep do phai co ca hai mau, khong duoc toan hong hay toan lanh
if (!hong || !lanhManh) die(`phep do mot mau: hong=${hong} lanh=${lanhManh} — khong phan biet duoc gi`);
console.log(`P123 OK (${n} to hop = ${nChang1} tieu-thu + ${nChang2} tu-vung + ${nChang3} doc-duoc, ${hong} hong / ${lanhManh} lanh, hai reader dong y tat ca)`);
P123JS

# ── P124: khoa RONG khong duoc nuot dong ke (lop loi cua reader chung) ─────
# `\s` khop ca xuong dong, nen `^key\s*[:=]\s*(.*)$` doc mot khoa de TRONG ra
# thanh gia tri cua khoa DUOI no. An duoc lau vi moi khuon mau tinh co co
# comment `#` ngay sau khoa rong — fixture o day co Y KHONG co comment do.
run "P124 frontmatterField: khoa rong tra '' chu khong nuot dong ke (S4-r2)" \
  node --input-type=module - "$ROOT" <<'P111JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const path = await import("node:path");
const { createRequire } = await import("node:module");
const require = createRequire(import.meta.url);
const core = require(path.join(root, "lib/evidence-core.js"));
const die = m => { console.error(m); process.exit(1); };
const F = core.frontmatterField;

// 1. khoa rong o GIUA frontmatter, KHONG co comment che
const uat = "---\nschema_version: 1\nslug: x\nverdict:\ndecided_by: Manh\ndecided_at: 2026-08-03T00:00:00Z\n---\n# U\n";
if (F(uat, "verdict") !== "") die(`verdict rong doc ra ${JSON.stringify(F(uat, "verdict"))} — dang nuot dong ke`);
if (F(uat, "decided_by") !== "Manh") die("khoa duoi bi anh huong: " + JSON.stringify(F(uat, "decided_by")));

// 2. cung hinh dang tren contract: approved_at rong khong duoc nuot dong duoi
const ct = "---\nstatus: verified\napproved_at:\ntime_human_minutes: {gate1: 0, gate2: 0}\n---\n";
if (F(ct, "approved_at") !== "") die(`approved_at rong doc ra ${JSON.stringify(F(ct, "approved_at"))}`);

// 3. va tren evidence-report: human_signoff rong la truong hop CHUA KY
const ev = "---\nverdict: PASS\nhuman_signoff:\nbypass_used: false\n---\n";
if (F(ev, "human_signoff") !== "") die(`human_signoff rong doc ra ${JSON.stringify(F(ev, "human_signoff"))}`);
if (F(ev, "bypass_used") !== "false") die("khoa duoi human_signoff bi nuot");

// 4. DOI CHUNG DUONG — cac hinh dang khac phai giu nguyen hanh vi
const d = "---\nkey:   co khoang trang\nquoted: \"abc\"\ncmt: val # ghi chu\nonlycmt: # chi comment\ncrlf: x\r\nnhayle: ngan thu ba \"that nhung ngoai hop dong\"\nnhaymo: \"chua dong\nlast:\n---\n";
// nhayle: gia tri KHONG duoc quote nhung ket thuc bang nhay — boc dau/cuoi doc
// lap se an mat ky tu cuoi, va ban do in nguyen van ra cho nguoi doc nen cai
// cut do thanh van ban hong (S4-r5). Chi boc khi CA CAP khop.
const MONG = { key: "co khoang trang", quoted: "abc", cmt: "val", onlycmt: "", crlf: "x",
               nhayle: 'ngan thu ba "that nhung ngoai hop dong"', nhaymo: '"chua dong', last: "" };
for (const [k, v] of Object.entries(MONG))
  if (F(d, k) !== v) die(`hinh dang ${k}: doc ra ${JSON.stringify(F(d, k))}, mong ${JSON.stringify(v)}`);
if (F(d, "khong-co") !== null) die("khoa vang phai tra null");
if (F("khong co frontmatter\n", "key") !== null) die("khong co frontmatter phai tra null");

// 5. Ca DAU-DEN-CUOI: uat-session chua ky (verdict rong, khong comment) phai
// la ho so LANH MANH voi ca hai reader — day la ca that ma nghi thuc sinh ra.
const { recordProblem } = require(path.join(root, "lib/workspace-record.js"));
const p = recordProblem({ "contract.md": "---\nstatus: signed-off\n---\n",
                          "opportunity.md": "---\nstage: decided\ndecision: build\n---\n",
                          "uat-session.md": uat });
if (p) die("phien CHUA KY bi goi la ho so hong: " + JSON.stringify(p));
console.log("P124 OK");
P111JS

# ── P125: CHAN HINH cua AC-13 — do bang may, khong giao cho panel judge ────
run "P125 ban do co HINH dan dau, hinh mang so THAT, chu tu viet qua N1/N2/N3 (E17)" \
  node --input-type=module - "$ROOT" <<'P112JS'
const root = process.argv[2];  // dang stdin: argv[1] la "-"
const fs = await import("node:fs"); const os = await import("node:os");
const path = await import("node:path");
const { renderProductMap } = await import(path.join(root, "scripts/product-map.mjs"));
const { fileFromTemplate } = await import(path.join(root, "tests/fixtures/from-template.mjs"));
const R = p => path.join(root, "skills/acceptance/references", p);
const die = m => { console.error(m); process.exit(1); };

// CHAN HINH cua AC-13 — do bang MAY, khong giao cho panel judge. 12 luot cham
// qua 4 vong deu chi soi truc TU VUNG (N1-N6) va bo tron truc HINH, du phep
// thu nhin-thay-hinh nam cung file luat duoc truyen lam input. Phep do nao
// giao cho nguoi cham thi phai cho no mot chan may khong bo qua duoc.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p112-"));
const W = (rel, s) => { const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const contract = (slug, status) => fileFromTemplate(R("contract-template.md"),
  "CONTRACT-FRONTMATTER-TEMPLATE",
  { feature: "lam cho nguoi dung " + slug, slug, owner: "o@o", risk_tier: "T2",
    surfaces: "cli", status });
W("_acceptance/config.yaml", "schema_version: 1\n");
W("_acceptance/mot-viec/contract.md", contract("mot-viec", "approved"));
W("_acceptance/viec-da-giao/contract.md", contract("viec-da-giao", "signed-off"));

const out = renderProductMap(tmp);
const dongs = out.split("\n");

// 1. Co HINH, va hinh dung co che cua mat phang "tai lieu trong kho" (mermaid)
const iFence = dongs.findIndex(l => l.trim() === "```mermaid");
if (iFence < 0) die("ban do KHONG co hinh — vi pham N5 o dang thuc (diem quyet dinh vuot nguong 3 buoc / 2 nhanh)");
const iClose = dongs.findIndex((l, i) => i > iFence && l.trim() === "```");
if (iClose < 0) die("khoi hinh khong dong fence");

// 2. HINH DAN DAU: khong duoc co muc danh sach nao truoc no (chu la chu thich)
const iMuc = dongs.findIndex(l => l.startsWith("## "));
if (iMuc >= 0 && iMuc < iFence) die(`muc "${dongs[iMuc]}" dung TRUOC hinh — chu dan dau, sai N5`);

// 3. Hinh phai la HINH cua chinh xuong nay: du chang + du 3 cong nguoi + so THAT
const hinh = dongs.slice(iFence, iClose + 1).join("\n");
for (const cong of ["Cổng Đáng", "Cổng Phạm vi", "Cổng Bằng chứng", "Cổng Giá trị"])
  if (!hinh.includes(cong)) die(`hinh thieu ${cong} — nguoi doc khong thay day du diem dung`);

// 3b. QUAN HE cac canh, khong chi su CO MAT cua cac nut. Dem dung + du nut van
// de lot mot hinh NOI DOI: ban dau hinh ve "Da giao --> Cho phien nghiem thu"
// thanh mot mach, trong khi classify() coi hai o do la HAI KET CUC loai tru
// nhau cua cung Cong Bang chung (duong B/C/E ship thang, khong bao gio chuyen
// sang cho nghiem thu). Nguoi doc thay mot viec da giao dang di tiep toi Cong
// Gia tri — sai (S4-r14). Hinh la mat doc chinh (N5) nen no phai chiu do.
// Bo NHAN nut truoc khi soi canh: `CN["Cho phien...<br/>2 viec"] --> GG`
// van la canh CN->GG, regex bat tren van ban tho se truot vi cai nhan.
const xuong = hinh.replace(/\[[^\]]*\]/g, "").replace(/\{[^}]*\}/g, "");
const canh = (a, b) => new RegExp(`\\b${a}\\s*-->\\s*${b}\\b`).test(xuong);
if (!canh("GB", "DG")) die("hinh: Cong Bang chung khong dan toi 'Da giao'");
if (!canh("GB", "CN")) die("hinh: 'Cho phien nghiem thu' phai la KET CUC cua Cong Bang chung, khong phai chang sau 'Da giao'");
if (canh("DG", "CN")) die("hinh ve 'Da giao --> Cho phien nghiem thu' thanh mach noi tiep — code coi hai o do la hai ket cuc loai tru nhau");
if (!canh("CN", "GG")) die("hinh: 'Cho phien nghiem thu' khong dan toi Cong Gia tri");

// 3c. MOI nhan cong trong hinh phai duoc GIAI NGHIA ngay tren ban do, va phai
// co trong glossary CONTEXT.md. Nhan cong dung mot minh la chu nguoi doc lan
// dau khong suy ra duoc — "Dang" nghia la gi? (N6; hoi dong AC-13b danh FAIL
// dung diem nay o S4-r15). Danh sach cong SUY TU HINH, khong go tay: them cong
// thu nam thi case tu doi giai nghia cho no.
const nhanCong = [...new Set([...hinh.matchAll(/\{"(Cổng [^"]+)"\}/g)].map(m => m[1]))];
if (nhanCong.length < 4) die(`bo dem tinh tao: quet ra ${nhanCong.length} nhan cong trong hinh — mong >=4`);
const ctx = fs.readFileSync(path.join(root, "CONTEXT.md"), "utf8");
const sauHinh = out.slice(out.indexOf("```", out.indexOf("```mermaid") + 3));
for (const cong of nhanCong) {
  // Giai nghia = ten cong xuat hien LAI ngoai hinh, kem mot cau hoi.
  const i = sauHinh.indexOf(cong);
  if (i < 0) die(`ban do co nhan "${cong}" trong hinh ma khong giai nghia o dau ca — nguoi doc lan dau khong suy ra duoc`);
  if (!/(không|chưa|gì)\b/.test(sauHinh.slice(i, i + 120)))
    die(`"${cong}" duoc nhac lai nhung khong kem CAU HOI no hoi — nhac ten khong phai giai nghia`);
  if (!ctx.includes(cong))
    die(`CONTEXT.md khong co muc cho "${cong}" — dat ten mat nguoi moi ma khong vao glossary (N6)`);
}
if (!/Đang làm<br\/>1 việc/.test(hinh)) die("hinh khong mang SO THAT cua xuong (1 viec dang lam): " + hinh);
if (!/Đã giao<br\/>1 việc/.test(hinh)) die("hinh khong mang SO THAT cua xuong (1 viec da giao)");
if (!/chưa có/.test(hinh)) die("chang rong phai noi 'chua co', khong duoc de trong");

// 4. Doi chung DUONG: so trong hinh doi theo ho so, khong phai chuoi ghim cung
W("_acceptance/viec-thu-hai/contract.md", contract("viec-thu-hai", "approved"));
if (!/Đang làm<br\/>2 việc/.test(renderProductMap(tmp)))
  die("them mot viec ma so trong hinh khong doi — hinh la chuoi chet, khong phai hinh cua xuong");

// 5. Chu do bo sinh TU VIET: chu ngu khong phai may, duong dan khong lam chu ngu
const ghiChu = dongs.filter(l => l.startsWith("> ")).join(" ");
if (!ghiChu) die("thieu dong ghi chu dau ban do");
if (/^> Máy sinh/.test(dongs.find(l => l.startsWith("> ")) || "")) die("cau ghi chu lay MAY lam chu ngu — N1");
const cauChinh = (dongs.find(l => l.startsWith("> ")) || "");
if (/`_acceptance\/`/.test(cauChinh)) die("duong dan nam trong cau chinh — N2 doi no xuong chu thich");

// 6. Ten o KHONG goi ten co che may
for (const l of dongs.filter(l => l.startsWith("## ")))
  if (/nghiệm thu máy|start-scan|frontmatter|_acceptance/.test(l))
    die(`ten muc goi ten co che may: ${l}`);

// 7. Moi dong viec: TEN VIEC truoc, slug la ma TRA CUU trong ngoac (N3)
const dongViec = dongs.filter(l => l.startsWith("- ") && l.includes("(`"));
if (!dongViec.length) die("khong co dong viec nao de soi");
for (const l of dongViec) {
  const m = l.match(/^- (.+) \(`([a-z0-9-]+)`\)/);
  if (!m) die(`dong khong theo khuon "ten viec (slug)": ${l}`);
  if (m[1].startsWith("**")) die(`dong con in dam ca cau: ${l}`);
  if (m[1] === m[2]) die(`ten viec chi la slug lap lai: ${l}`);
}
console.log("P125 OK");
P112JS

# ── P126: mien tru PRODUCT-MAP.md chi hop le khi con cong doc lap canh ────
run "P126 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)" \
  python3 - "$ROOT" <<'P113PY'
import re, subprocess, sys
from pathlib import Path
root = Path(sys.argv[1])

# 1. PRODUCT-MAP.md nam TRONG t1_skip_globs (do QUAN HE: rut dung danh sach)
cfg = (root / "_acceptance/config.yaml").read_text(encoding="utf-8")
def globs(txt, key):
    out, inside = [], False
    for ln in txt.splitlines():
        if ln.strip() == key + ":": inside = True; continue
        if inside:
            s = ln.strip()
            if s.startswith('- '): out.append(s[2:].strip().strip('"'))
            elif s and not s.startswith('#'): break
    return out
t1 = globs(cfg, "t1_skip_globs")
assert "PRODUCT-MAP.md" in t1, f"PRODUCT-MAP.md chua duoc mien tru (thay: {t1})"

# 2. Mien tru chi hop le VI co cong doc lap canh — doi chung DUONG rooi tiem:
#    ban do khop -> --check XANH; tiem lech -> --check DO. Khong co ve nay thi
#    mien tru bien mot view may sinh thanh vung khong ai kiem.
def check():
    return subprocess.run(["node", "scripts/product-map.mjs", "--root", ".", "--check"],
                          cwd=root, capture_output=True, text=True)
r = check()
assert r.returncode == 0, f"doi chung duong hong: ban do cua kit dang lech san ({r.stderr.strip()})"

# Pha vat that trong mot BAN SAO, khong pha tai cho: suite bi Ctrl-C giua hai
# lenh ghi se de lai cay lam viec ban voi mot dong bia trong artifact may sinh
# DA COMMIT — va vi ban do vua vao t1_skip_globs, dong bia do khong kich hoat
# cong nao ngoai chinh --check (doctrine CLAUDE.md; chinh case nay vi pham no
# o S4-r5).
import shutil, tempfile
tmp = Path(tempfile.mkdtemp(prefix="p113-"))
try:
    shutil.copytree(root / "_acceptance", tmp / "_acceptance")
    if (root / ".out-of-scope").is_dir():
        shutil.copytree(root / ".out-of-scope", tmp / ".out-of-scope")
    shutil.copy2(root / "PRODUCT-MAP.md", tmp / "PRODUCT-MAP.md")
    def check_tmp():
        return subprocess.run(["node", str(root / "scripts/product-map.mjs"), "--root", str(tmp), "--check"],
                              cwd=root, capture_output=True, text=True)
    assert check_tmp().returncode == 0, "ban sao nguyen ven da lech san — doi chung duong hong"
    (tmp / "PRODUCT-MAP.md").write_text(
        (tmp / "PRODUCT-MAP.md").read_text(encoding="utf-8") + "\n- viec bia dat\n", encoding="utf-8")
    r2 = check_tmp()
    assert r2.returncode != 0, "sua tay ban do ma --check VAN xanh — mien tru dang che mot vung khong ai canh"
    assert "lệch với hồ sơ xưởng" in r2.stderr, f"thong diep khong khop khuon ghim: {r2.stderr}"
finally:
    shutil.rmtree(tmp, ignore_errors=True)
assert check().returncode == 0, "cay lam viec that phai KHONG bi cham"

# 3. Cong do PHAI chay trong CI, khong chi trong suite verify cua feature-loop
ci = (root / ".github/workflows/gate.yml").read_text(encoding="utf-8")
assert "product-map.mjs --root . --check" in ci, \
    "gate.yml khong chay --check — mien tru mat can cu (khong con cong nao canh o moi PR)"

# 4. Mien tru KHONG duoc lan sang path khac o goc repo
for xau in [".github/**", ".claude-plugin/plugin.json"]:
    assert xau not in t1, f"{xau} da bi nuot vao t1_skip_globs — de xuat nay DA BI TU CHOI (.out-of-scope/)"

# 5a. KHONG hai ADR nao duoc trung so — dinh danh trung lam hong chinh chuc
#     nang tra nguoc ma ADR ton tai de phuc vu (vong nay tung dam: file moi lay
#     lai so 0003 trong khi 0003 da thuoc mot quyet dinh khac).
import collections
sos = collections.defaultdict(list)
for f in sorted((root / "docs/adr").glob("*.md")):
    m = re.match(r"^(\d{4})-", f.name)
    assert m, f"ten ADR khong theo khuon NNNN-...: {f.name}"
    sos[m.group(1)].append(f.name)
trung = {k: v for k, v in sos.items() if len(v) > 1}
assert not trung, f"ADR trung so: {trung}"

# 5b. Quyet dinh chinh sach nay phai co ADR
adr = root / "docs/adr/0007-product-map-t1-exemption.md"
assert adr.is_file(), "thieu ADR cho mot lan noi danh sach mien tru"
at = adr.read_text(encoding="utf-8")
for needle in ["PRODUCT-MAP.md", "--check", "t1-skip-globs-github-and-manifests"]:
    assert needle in at, f"ADR khong neu {needle}"
P113PY

# ── P127: cai gi BAT consumer commit thi phai PHAT kem mien tru + cong canh ─
run "P127 khuon acceptance-init phat du mien tru PRODUCT-MAP + executor canh (E18)" \
  python3 - "$ROOT" <<'P114PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])

# Than lenh cong NAO bat repo tieu thu commit ban do?
BODIES = ["commands/approve.md", "commands/signoff.md",
          "codex/acceptance-gate/skills/approve/SKILL.md",
          "codex/acceptance-gate/skills/signoff/SKILL.md"]
bat_commit = [b for b in BODIES if "PRODUCT-MAP.md" in (root / b).read_text(encoding="utf-8")]
assert bat_commit, "doi chung duong hong: khong than lenh nao nhac PRODUCT-MAP.md"

# ... thi KHUON config ma acceptance-init phat cho ho phai co CA HAI:
#   (a) mien tru t1 — thieu no thi chinh commit chu ky lam evidence stale va
#       pre-merge chan merge, thanh vong khong thoat (ADR 0007);
#   (b) executor canh — ADR 0007 noi mien tru CHI an toan khi con cong doc lap.
# Thieu mot trong hai la kit phat cho consumer mot cai bay ma chinh kit da
# dam phai o S4-r4 va da ghi ADR de khoi ai dam lai.
INITS = ["commands/acceptance-init.md",
         "codex/acceptance-gate/skills/acceptance-init/SKILL.md"]
for rel in INITS:
    txt = (root / rel).read_text(encoding="utf-8")
    assert re.search(r'^\s*-\s*"PRODUCT-MAP\.md"\s*$', txt, re.M), \
        f"{rel}: khuon config KHONG phat mien tru PRODUCT-MAP.md — consumer se ket merge ngay lan ky dau ({bat_commit} bat ho commit no)"
    assert re.search(r'^\s*product_map:\s*"', txt, re.M), \
        f"{rel}: khuon config KHONG phat executors.script.product_map — mien tru mat cong canh (ADR 0007)"

# Doi chung AM: go dong mien tru khoi mot ban sao thi phep do phai DO
mut = re.sub(r'^\s*-\s*"PRODUCT-MAP\.md"\s*$', "", (root / INITS[0]).read_text(encoding="utf-8"), flags=re.M)
assert not re.search(r'^\s*-\s*"PRODUCT-MAP\.md"\s*$', mut, re.M), "buoc tiem chua bao gio chay"

# ADR 0007 phai noi ro dieu kien an toan de nguoi sau khong noi mien tru mu quang
adr = (root / "docs/adr/0007-product-map-t1-exemption.md").read_text(encoding="utf-8")
assert "--check" in adr, "ADR 0007 khong neu cong canh"

# (c) Lenh ma khuon Codex PHAT ra phai CHAY DUOC — do QUAN HE, khong do chuoi.
#     S4-r10: khuon phat `codex-plugin-runner.mjs ... product-map` trong khi
#     action do khong co trong allowlist cua runner -> BLOCKED ngay lan chay
#     dau, tuc consumer Codex nhan mien tru t1 MA KHONG co cong canh nao. Phep
#     do cu chi assert chuoi `product_map:` co mat — dung bay "do tu vung thay
#     vi quan he" ma chinh vong nay vua ghi memory.
import subprocess as sp
codex_init = (root / "codex/acceptance-gate/skills/acceptance-init/SKILL.md").read_text(encoding="utf-8")
m = re.search(r'^\s*product_map:\s*"([^"]+)"', codex_init, re.M)
assert m, "khuon Codex khong khai product_map"
lenh = m.group(1).split()
assert lenh[0] == "node", f"lenh la: {lenh}"
runner = root / "codex/acceptance-gate/skills/acceptance-init/references/codex-plugin-runner.mjs"
assert runner.is_file(), "khong tim thay codex-plugin-runner.mjs"
#     DOI CHUNG DUONG truoc: mot action BIA phai bi tu choi DUNG thong diep va
#     DUNG ma thoat. Khong co ve nay thi assert am-tinh ben duoi la xanh-rong —
#     doi wording cua blocked(), hay lam runner chet truoc khi toi allowlist,
#     deu cho "khong thay chuoi do" va phep do van xanh (mutation M2/M3 cua
#     review S4-r10 da chung minh dung hai duong do).
bia = sp.run(["node", str(runner), "acceptance-gate", "khong-he-ton-tai", "--root", "."],
             cwd=root, capture_output=True, text=True)
ba = (bia.stdout + bia.stderr)
assert "unsupported plugin/action" in ba, \
    f"doi chung duong hong: action BIA phai bi tu choi dung thong diep, duoc: {ba.strip()[:160]}"
assert bia.returncode == 2, f"action bia phai exit 2, duoc {bia.returncode}"

rc = sp.run(["node", str(runner)] + lenh[2:], cwd=root, capture_output=True, text=True)
ra = (rc.stdout + rc.stderr)
assert "unsupported plugin/action" not in ra, \
    f"lenh khuon Codex PHAT ra bi runner tu choi: {ra.strip()[:120]} — consumer Codex se co mien tru ma khong co cong canh"

# (d) Duong DOC-CU: MOI than cong co buoc regen deu phai co nhanh bo qua cho
#     repo init truoc 1.31.0. CLAUDE.md: doi schema artifact phai co duong
#     doc-cu, KHONG bat consumer migrate hang loat. Thieu nhanh nay thi moi
#     repo cu ket merge ngay lan ky dau tien.
#
#     Danh sach than lay bang QUET, khong go tay: ban go tay cu liet 4 than va
#     bo sot `skills/uat-session/SKILL.md` — chinh nghi thuc Cong Gia tri dung
#     ra cai bay ma ADR 0007 viet ra de chan (S4-r13). Dinh nghia lop la "than
#     nao RA LENH regen thi than do phai co duong doc-cu", nen than thu sau
#     them sau nay tu dong bi do.
#     Dau hieu cua THAN CONG (khac khuon init): no RA LENH ve lai ban do —
#     `--root .` KHONG kem `--check`. Khuon acceptance-init cung nhac script
#     nhung chi de phat mot dong config dang `--check`, no khong ky gi ca nen
#     khong can duong doc-cu.
RE_REGEN = re.compile(r"product-map\.mjs --root \.(?!\s*--check)")
THAN = sorted(
    p.relative_to(root).as_posix()
    for d in ("commands", "codex", "skills")
    for p in (root / d).rglob("*.md")
    if RE_REGEN.search(p.read_text(encoding="utf-8"))
)
# Bo dem tinh tao: 0 hit gan nhu luon la grep hong, khong phai "khong co than".
assert len(THAN) >= 5, f"quet ra {len(THAN)} than cong co buoc regen — mong >=5, nghi buoc quet hong: {THAN}"
for rel in THAN:
    body = (root / rel).read_text(encoding="utf-8")
    assert "t1_skip_globs" in body, f"{rel}: khong doc t1_skip_globs — khong co duong doc-cu"
    # Chuan hoa khoang trang TRUOC khi soi: loi hua la "than co neu dieu kien
    # phu dinh", khong phai "chuoi nam gon mot dong" — van xuoi xuong dong theo
    # do rong cot, do nguyen van la do TU VUNG chu khong do QUAN HE.
    flat = re.sub(r"\s+", " ", body)
    assert re.search(r"(SKIP|BỎ QUA|Bật bằng hai dòng|opt-in note)", flat), \
        f"{rel}: khong co nhanh bo qua + ghi chu bat cho repo chua bat ban do"
    # Chieu phai dung: CHUA co trong t1_skip_globs -> SKIP. Dao nghia ("moi repo
    # phai migrate") giu nguyen tu vung nen kiem su-co-mat khong bat duoc (M5).
    assert re.search(r"(NOT listed|không có|NOT in|chưa bật)", flat), \
        f"{rel}: nhanh doc-cu khong neu dieu kien PHU DINH (chua co trong t1_skip_globs)"
    # ... va khong duoc de mot dong nao BAT commit ban do vo dieu kien: tren
    # repo chua opt-in file do khong ton tai, `git add` chet giua nghi thuc ky.
    for dong in body.splitlines():
        if "PRODUCT-MAP.md" not in dong: continue
        s = dong.strip()
        # Nguy hiem la LENH COPY-PASTE DUOC neu ten mot file co the khong ton
        # tai (repo chua opt-in) — `git add` chet pathspec giua nghi thuc ky.
        # Cau van xuoi CO DIEU KIEN ("Repo opted in -> append ...") thi khong
        # phai lenh, va no chinh la thu ta muon co.
        if s.startswith("git add "):
            raise AssertionError(
                f"{rel}: LENH git-add ghim san ban do (repo chua opt-in se chet pathspec): {s[:90]}")
        if "Offer ONE commit" in s and "ONLY" not in s:
            raise AssertionError(
                f"{rel}: dong 'Offer ONE commit' keo ban do vao vo dieu kien: {s[:90]}")

# (e) MOI khuon co marker trich xuat phai DAN dung chep marker + hang rao.
#     Marker + ```yaml ton tai vi TEST can rut khuon may-doc; nguoi chep nguyen
#     van thi dong dau file la ```yaml, `^---` khong khop, va MOI reader goi ho
#     so do la hong. contract-template co loi dan tu dau, uat/opportunity thi
#     khong (S4-r13) — cung mot lop, sua theo lop: danh sach lay bang QUET
#     chinh cac file CO marker, nen khuon thu tu them sau nay tu dong bi do.
REF = root / "skills/acceptance/references"
KHUON = sorted(p.relative_to(root).as_posix() for p in REF.rglob("*.md")
               if re.search(r"<<<[A-Z0-9-]+-FRONTMATTER-TEMPLATE", p.read_text(encoding="utf-8")))
assert len(KHUON) >= 3, f"quet ra {len(KHUON)} khuon co marker — mong >=3, nghi buoc quet hong: {KHUON}"
for rel in KHUON:
    flat = re.sub(r"\s+", " ", (root / rel).read_text(encoding="utf-8"))
    assert re.search(r"(Do NOT copy|ĐỪNG chép)", flat), \
        f"{rel}: co marker trich xuat ma khong dan 'dung chep marker' — nguoi chep nguyen van se tao ho so hong"
    assert re.search(r"(fence|hàng rào)", flat), \
        f"{rel}: loi dan khong neu ca HANG RAO ```yaml — chep thieu moi dong ```yaml van du lam hong ho so"
P114PY

# ── P128: tai lieu nguoi-doc phai theo kip be mat 1.31.0, va khong duoc hua
#         mot khoa dau ra ma bo quet khong con phat ──────────────────────────
run "P128 3 tai lieu co be mat 1.31.0 + khong hua khoa dau ra da go (E11,E18)" \
  python3 - "$ROOT" <<'P128PY'
import json, re, subprocess, sys
from pathlib import Path
root = Path(sys.argv[1])
DOCS = ["README.md", "GUIDE.md", "QUICKSTART.md"]

# (a) Be mat 1.31.0 phat cho repo tieu thu la NGUOI dung thay: mot file moi o
#     goc repo ma cong tu commit vao, va mot nghi thuc nguoi moi. Tien le ngay
#     tren cung file: 1.30.0 (/start) co muc rieng va P101 ghim no. Thieu muc
#     thi nguoi gap ghi chu "Ban do san pham chua bat cho repo nay" do /approve
#     in ra ma khong co cho nao tra tiep (S4-r14).
for rel in DOCS:
    t = (root / rel).read_text(encoding="utf-8")
    assert "PRODUCT-MAP.md" in t, f"{rel}: khong nhac PRODUCT-MAP.md — mot file moi o goc repo ma tai lieu khong ta"
    assert re.search(r"(uat-session|Cổng Giá trị|UAT session)", t), \
        f"{rel}: khong nhac phien nghiem thu / Cong Gia tri — mot nghi thuc NGUOI moi ma tai lieu khong ta"
    # Mien tru t1 la thu de nguoi giat minh nhat ("sao ban do khong qua cong?"),
    # nen phai co duong tra: it nhat mot doc noi ro no + cai canh no.
docs_all = "\n".join((root / r).read_text(encoding="utf-8") for r in DOCS)
assert "t1_skip_globs" in docs_all and "0007" in docs_all, \
    "khong doc nao noi vi sao ban do duoc mien cong + tro toi ADR 0007"

# (b) QUAN HE, khong phai danh sach cam: tai lieu chi duoc hua nhung khoa dau ra
#     ma bo quet THAT SU phat. `skipped[]` bi go o F-B; neu ai do them lai thi
#     assert nay TU NOI LONG, khong phai sua test. (Blacklist tren khong gian mo
#     thi va-roi-lai-thung; ghim quan he thi khong.)
out = json.loads(subprocess.run(["node", str(root / "scripts/start-scan.mjs"), "--root", str(root)],
                                capture_output=True, text=True, check=True).stdout)
khoa_that = set(out.keys()) | set(out.get("groups", {}).keys())
assert "broken" in khoa_that and "map" in khoa_that, f"bo dem tinh tao: dau ra scan la {sorted(khoa_that)} — nghi buoc chay hong"
BODIES = DOCS + ["scripts/start-scan.mjs", "commands/start.md",
                 "codex/acceptance-gate/skills/start/SKILL.md"]
for rel in BODIES:
    t = (root / rel).read_text(encoding="utf-8")
    for m in re.finditer(r"(?<![A-Za-z_])(\w+)\[\]", t):
        khoa = m.group(1)
        if khoa in khoa_that: continue
        # Cho phep noi ve no trong cau GIAI THICH rang no da bi go.
        dong = t[t.rfind("\n", 0, m.start()) + 1 : t.find("\n", m.end())]
        # Cua so +-200 ky tu, khong phai MOT dong: van xuoi xuong dong theo do
        # rong cot nen cau "khoa do da GO HAN" thuong nam o dong ke.
        cua_so = t[max(0, m.start() - 200) : m.end() + 200]
        if re.search(r"(đã (được )?(GỠ|gỡ)|không còn|bị gỡ|removed)", cua_so): continue
        raise AssertionError(
            f"{rel}: hua khoa dau ra `{khoa}[]` ma bo quet khong phat ({sorted(khoa_that)}) — dong: {dong.strip()[:100]}")
print("P128 OK (3 tai lieu co be mat 1.31.0; khoa dau ra khop dau ra THAT)")
P128PY

# ── P129: canh + ten viec phai song ca khi ho so KHONG duoc tieu thu ────────
# Hai cau hoi khac nhau: PHAN O (ho so nao quyet dinh o cua slug) va HIEN THI
# (ten viec + cac canh lay o dau). S4-r14 gop lam mot, nen suot ca pha dung
# (draft->verified) ban do mat ten viec lan moi canh cua ho so kham pha: `epic:`
# duoc khai luc kham pha, tuc nam trong opportunity.md, ma opportunity CHI duoc
# tieu thu khi chua co hop dong hoac da ky. Moi case canh cu deu dat canh trong
# file DUOC tieu thu nen khong thay gi (S4-r15).
run "P129 canh + ten viec doc tu ho so KHONG tieu thu; loi doc o do khong lam hong slug (E5)" \
  node --input-type=module - "$ROOT" <<'P129JS'
const root = process.argv[2];
const fs = await import("node:fs"); const os = await import("node:os");
const path = await import("node:path");
const { renderProductMap } = await import(path.join(root, "scripts/product-map.mjs"));
const die = m => { console.error(m); process.exit(1); };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "p129-"));
const dir = path.join(tmp, "_acceptance", "x");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(tmp, "_acceptance/config.yaml"), "schema_version: 1\n");
fs.writeFileSync(path.join(dir, "opportunity.md"),
  "---\nstage: discovery\nfeature: Ban do gia tri\nepic: EP-1\nrelates: y\n---\n");

// MOI trang thai hop dong — ke ca nhung trang thai KHONG tieu thu opportunity.
// Doi chung duong nam ngay trong bang: `draft` KHONG tieu thu opportunity va
// phai cho ket qua giong "(khong co hop dong)" la trang thai CO tieu thu.
for (const st of [null, "draft", "approved", "implemented", "verified", "signed-off"]) {
  const cp = path.join(dir, "contract.md");
  if (st == null) { if (fs.existsSync(cp)) fs.unlinkSync(cp); }
  else fs.writeFileSync(cp, "---\nstatus: " + st + "\n---\n");
  const dong = renderProductMap(tmp).split("\n").find(l => l.includes("`x`")) || "";
  if (!dong.includes("epic: EP-1") || !dong.includes("liên quan: y"))
    die("status=" + st + ": canh bien mat khoi ban do — \"" + dong.trim()
      + "\" (canh khai o opportunity.md, ho so KHONG duoc tieu thu o trang thai nay)");
  if (!dong.includes("Ban do gia tri"))
    die("status=" + st + ": ten viec bien mat, chi con slug tran — \"" + dong.trim() + "\"");
}

// Loi DOC o ho so khong tieu thu chi lam mat phan hien thi cua no, KHONG duoc
// lam hong slug — phep doc luoi phai con nguyen.
fs.writeFileSync(path.join(dir, "contract.md"), "---\nstatus: draft\nfeature: viec x\n---\n");
const op = path.join(dir, "opportunity.md");
fs.chmodSync(op, 0o000);
let khoaDuoc = false;
try { fs.readFileSync(op, "utf8"); } catch { khoaDuoc = true; }
if (!khoaDuoc) { fs.chmodSync(op, 0o644); die("chmod 000 van doc duoc (chay bang root?) — chan nay do vao khoang khong"); }
const out = renderProductMap(tmp);
fs.chmodSync(op, 0o644);
if ((out.split("## Hồ sơ hỏng")[1] || "").includes("`x`"))
  die("loi doc o ho so KHONG tieu thu lai lam hong slug — mat phep doc luoi");
if (!out.includes("viec x")) die("ten viec tu contract.md bien mat khi opportunity khong doc duoc");
console.log("P129 OK (6 trang thai giu canh + ten; loi doc o ho so khong tieu thu khong lam hong slug)");
P129JS

# ── P130: hai ben doc t1_skip_globs (JS configList vs ban bash cua pre-merge) ─
# Cung mot khoa co BA ban doc trong repo: configList (JS), sed trong
# pre-merge-check.sh, va loi dan van xuoi o nam than cong nguoi. Ban dau
# map.enabled dung regex quet ca file nen sai hai chieu — comment duoi dong
# thanh "chua bat", va cung chuoi nam duoi t3_paths thanh "da bat" (S4-r15).
run "P130 configList JS va ban bash cua pre-merge dong ket luan moi hinh dang (E11)" \
  python3 - "$ROOT" <<'P130PY'
import json, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
BASH = (
  "sed -n '/^  t1_skip_globs:/,/^  [a-zA-Z0-9_-]*:/p' \"$1\" \\\n"
  "  | sed -n 's/^[[:space:]]*-[[:space:]]*//p' \\\n"
  "  | sed -e 's/[[:space:]]*#.*$//' -e 's/^\"//' -e 's/\"$//' -e \"s/^'//\" -e \"s/'\\$//\" -e 's/[[:space:]]*$//'\n")
JS = (
  "const { configList } = require(process.argv[2]);\n"
  "const fs = require('node:fs');\n"
  "console.log(JSON.stringify(configList(fs.readFileSync(process.argv[3], 'utf8'), 't1_skip_globs')));\n")
HINH = [
  'risk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"\n',
  'risk_tiers:\n  t1_skip_globs:\n    - "PRODUCT-MAP.md"   # ban do may sinh\n',
  "risk_tiers:\n  t1_skip_globs:\n    - 'PRODUCT-MAP.md'\n",
  'risk_tiers:\n  t1_skip_globs:\n    - PRODUCT-MAP.md\n',
  'risk_tiers:\n  t3_paths:\n    - "PRODUCT-MAP.md"\n',
  'risk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n  t3_paths:\n    - "PRODUCT-MAP.md"\n',
  'risk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n    - "PRODUCT-MAP.md"\n  t3_paths:\n    - "src/**"\n',
  'risk_tiers:\n  t1_skip_globs: []\n',
  '',
]
lech, co = [], 0
with tempfile.TemporaryDirectory() as td:
    jsf = Path(td, "r.js"); jsf.write_text(JS)
    shf = Path(td, "r.sh"); shf.write_text(BASH)
    for i, h in enumerate(HINH):
        cfg = Path(td, "c%d.yaml" % i); cfg.write_text("schema_version: 1\n" + h)
        js = json.loads(subprocess.run(["node", str(jsf), str(root / "lib/workspace-record.js"), str(cfg)],
                                       capture_output=True, text=True, check=True).stdout)
        sh = [l for l in subprocess.run(["bash", str(shf), str(cfg)],
                                        capture_output=True, text=True).stdout.split("\n") if l]
        if js != sh:
            lech.append("  hinh %d: js=%s bash=%s\n    %r" % (i, js, sh, h))
        if "PRODUCT-MAP.md" in js:
            co += 1
assert not lech, "hai ben doc t1_skip_globs KHONG dong y:\n" + "\n".join(lech)
assert 0 < co < len(HINH), "phep do mot mau: %d/%d hinh co PRODUCT-MAP — khong phan biet duoc gi" % (co, len(HINH))

# Do HAM dung chung thoi thi chua du: bo quet co the ngung goi no ma van xanh
# (M15). Ghim QUAN HE tren VAT DUOC GIAO — `map.enabled` trong dau ra THAT cua
# start-scan phai bang ket luan cua luat chung tren cung file config.
lech2 = []
with tempfile.TemporaryDirectory() as td:
    ws = Path(td, "ws"); (ws / "_acceptance" / "x").mkdir(parents=True)
    (ws / "_acceptance" / "x" / "contract.md").write_text("---\nstatus: draft\n---\n")
    jsf = Path(td, "r.js"); jsf.write_text(JS)
    for i, h in enumerate(HINH):
        cfg = ws / "_acceptance" / "config.yaml"; cfg.write_text("schema_version: 1\n" + h)
        mong = "PRODUCT-MAP.md" in json.loads(subprocess.run(
            ["node", str(jsf), str(root / "lib/workspace-record.js"), str(cfg)],
            capture_output=True, text=True, check=True).stdout)
        that = json.loads(subprocess.run(["node", str(root / "scripts/start-scan.mjs"), "--root", str(ws)],
                                         capture_output=True, text=True, check=True).stdout)["map"]["enabled"]
        if that is not mong:
            lech2.append("  hinh %d: map.enabled=%r nhung luat chung noi %r\n    %r" % (i, that, mong, h))
assert not lech2, "map.enabled KHONG khop luat chung (bo quet dang tu doc config?):\n" + "\n".join(lech2)
print("P130 OK (%d hinh dang config, %d co / %d khong; hai ben doc dong y VA map.enabled bam luat chung)" % (len(HINH), co, len(HINH) - co))
P130PY

# ── P131: khuôn CI trong doc — MỌI lời gọi pre-merge-check.sh phải mang --base,
# và file nào dạy snippet GitHub Actions phải dạy kèm fetch-depth: 0 ───────────
# Lớp lỗi: doc trôi khỏi vật theo TỪNG FILE — GUIDE dạy đúng khuôn 2 bước còn
# README/QUICKSTART dạy dạng không-base (răng T1-escape + gap-probe cùng
# declared-off). Đo QUAN HỆ trên toàn bộ lời gọi, không grep một chuỗi một chỗ.
run "P131 khuon CI: moi loi goi pre-merge-check.sh trong doc mang --base + fetch-depth di kem" \
  python3 - "$ROOT" <<'P131PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
DOCS = ["README.md", "QUICKSTART.md", "GUIDE.md"]

def check(docs):                          # {ten: noi dung} -> list loi
    errs, n_invocations = [], 0
    for name, text in docs.items():
        # Moi dong GOI script tren repo root (`pre-merge-check.sh .`) — ke ca
        # dang inline-code trong cau van. Dong chi NHAC TEN file (copy list,
        # bang mo ta) khong phai loi goi, khong tinh.
        calls = [l for l in text.splitlines() if re.search(r"pre-merge-check\.sh\s+\.", l)]
        n_invocations += len(calls)
        for l in calls:
            if "--base" not in l:
                errs.append(f"{name}: loi goi thieu --base: {l.strip()[:80]}")
        # Quan he trong cung mot file: day snippet Actions thi phai day ca
        # fetch-depth: 0 — thieu no, --base khong resolve tren shallow clone
        # mac dinh cua actions/checkout (GUIDE §5.3 ta dung bay nay).
        if any("- run:" in l for l in calls) and "fetch-depth: 0" not in text:
            errs.append(f"{name}: co snippet Actions goi pre-merge-check.sh nhung thieu fetch-depth: 0")
    # Sanity counter (0 hit thuong la grep hong): 3 doc phai co it nhat 3 loi goi.
    if n_invocations < 3:
        errs.append(f"sanity: chi thay {n_invocations} loi goi trong {DOCS} — bo quet hong?")
    return errs

live = {d: (root / d).read_text(encoding="utf-8") for d in DOCS}
assert check(live) == [], check(live)                    # doi chung DUONG
# Dot bien theo TUNG file: xoa --base khoi mot loi goi → DO dung file, khong bao oan.
for gone in DOCS:
    if not re.search(r"pre-merge-check\.sh\s+\.", live[gone]):
        continue
    mut = dict(live)
    mut[gone] = re.sub(r"(pre-merge-check\.sh\s+\.)[^\n]*--base\S*\s*(\"[^\"]*\")?",
                       r"\1", live[gone])
    errs = check(mut)
    assert any(x.startswith(f"{gone}: loi goi thieu --base") for x in errs), \
        f"dot bien xoa --base khoi {gone} khong bi bat: {errs}"
    assert all(not x.startswith(f"{o}:") for x in errs for o in DOCS if o != gone), \
        f"dot bien tren {gone} lam bao oan file khac: {errs}"
# Dot bien fetch-depth: file co snippet Actions mat dong checkout → DO dung thong diep.
for name in DOCS:
    if "- run:" not in live[name] or "fetch-depth: 0" not in live[name]:
        continue
    mut = dict(live)
    mut[name] = live[name].replace("fetch-depth: 0", "fetch-depth-DA-XOA")
    errs = check(mut)
    assert any("thieu fetch-depth" in x and x.startswith(name) for x in errs), \
        f"dot bien xoa fetch-depth khoi {name} khong bi bat: {errs}"
print("P131 OK")
P131PY

# ── P132: khối pilot-mode README phải symlink ĐỦ MỌI lệnh trong commands/ ─────
# Ma trận toàn phần suy từ vật thật (ls commands/*.md), không phải danh sách
# đóng chép tay — thêm lệnh mới mà quên pilot block là case này đỏ.
run "P132 pilot block README symlink du moi lenh commands/*.md" \
  python3 - "$ROOT" <<'P132PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
cmds = sorted(p.name for p in (root / "commands").glob("*.md"))
assert len(cmds) >= 7, f"sanity: chi thay {len(cmds)} lenh trong commands/ — bo quet hong?"
readme = (root / "README.md").read_text(encoding="utf-8")

def check(text):
    return [c for c in cmds if f"ln -s <kit>/commands/{c}" not in text]

missing = check(readme)
assert missing == [], \
    "pilot block README thieu symlink cho: " + ", ".join(missing) + \
    " — nguoi pilot theo README se thieu lenh nay trong phien"
# Dot bien: xoa mot dong symlink bat ky → DO dung ten lenh do.
victim = cmds[0]
mut = "\n".join(l for l in readme.splitlines() if f"commands/{victim}" not in l)
assert check(mut) == [victim], f"dot bien xoa symlink {victim} khong bi bat dung cho: {check(mut)}"
print(f"P132 OK ({len(cmds)} lenh deu co mat)")
P132PY

# ── P133: ghim phần CHỮ của gói first-run — lời khuyên recheck, jsdom, attribution ─
# Ba pin văn xuôi (khuôn P44): chữ là hành vi thật ở repo này, không phải trang trí.
run "P133 chu first-run: recheck-advice khop init + jsdom o 3 diem init + attribution /start=v1.30" \
  python3 - "$ROOT" <<'P133PY'
import json, sys
from pathlib import Path
root = Path(sys.argv[1])
errs = []
# 1. README: lời khuyên recheck phải khớp thứ init thật sự phát (strict), và
#    câu cũ "advisory by default" (mô tả một trạng thái init không bao giờ tạo) phải biến mất.
readme = (root / "README.md").read_text(encoding="utf-8")
if "scaffolds `recheck: strict`" not in readme:
    errs.append("README: mat cau init-phat-strict")
if "advisory by default" in readme:
    errs.append("README: cau cu 'advisory by default' quay lai — nguoc voi scaffold cua init")
# 2. jsdom phải có mặt ở CẢ 3 điểm init (Claude acceptance-init, design-init 2 harness) —
#    thiếu nó mọi design eval BLOCKED (design-gate.mjs DOM mode).
for rel in ["commands/acceptance-init.md",
            "design-loop/commands/design-init.md",
            "codex/design-loop/skills/design-init/SKILL.md"]:
    if "jsdom" not in (root / rel).read_text(encoding="utf-8"):
        errs.append(f"{rel}: mat loi nhac jsdom")
# 3. Manifest Claude: /start thuộc v1.30 (ship 3187b6e), không được trôi về entry khác.
desc = json.loads((root / ".claude-plugin/plugin.json").read_text(encoding="utf-8"))["description"]
i29, i30, istart = desc.find("v1.29:"), desc.find("v1.30:"), desc.find("/start session-entry")
if i30 < 0:
    errs.append("manifest: mat entry v1.30")
elif not (0 <= i29 < i30 <= istart):
    errs.append("manifest: '/start session-entry' khong nam trong entry v1.30 (attribution troi)")
assert errs == [], errs                                   # doi chung DUONG
# Dot bien tung pin → DO dung thong diep (kiem bang cach chay lai logic tren van ban da pha)
def run_pin1(text):
    out = []
    if "scaffolds `recheck: strict`" not in text: out.append("mat cau init-phat-strict")
    if "advisory by default" in text: out.append("cau cu quay lai")
    return out
assert run_pin1(readme.replace("scaffolds `recheck: strict`", "scaffolds nothing")), "dot bien pin1a khong do"
assert run_pin1(readme + "\nThat re-check is advisory by default."), "dot bien pin1b khong do"
mut_desc = desc.replace("v1.30: /start session-entry", "v1.29-again: /start session-entry")
assert mut_desc.find("v1.30:") < 0 or not (0 <= mut_desc.find("v1.29:") < mut_desc.find("v1.30:") <= mut_desc.find("/start session-entry")), \
    "dot bien attribution khong do"
print("P133 OK (3 pin chu + dot bien deu do dung cho)")
P133PY

# --- context-ladder cases (P134-P141) begin ---
# Truc ngu canh cho ban mau (contract _acceptance/context-ladder): writer khai
# context: 3 nac trong khuon marker, reader gate-card render nac + co vang,
# generic moi repo. Moi case am co DOI CHUNG DUONG + ghim dung thong diep;
# fixture rut tu khuon writer bang code (bat bien CLAUDE.md).

run "P134 context-ladder writer: khoa context + giai doan 0 + luat canh + mac-dinh-nac-cao (E1/E2/E3/E4a)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
flat = lambda s: re.sub(r"\s+", " ", s)  # repo hard-wrap prose — pin phai chiu duoc xuong dong
def check(text):
    m = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>", text, re.S)
    if not m:
        return ["KHONG rut duoc DESIGN-PASS-NOTE-TEMPLATE"]
    block = m.group(1); ftext = flat(text)
    errs = []
    if "context: <standalone|static-frame|host-embedded>" not in block:
        errs.append("khuon thieu khoa context: 3 nac")
    if "context_scenes:" not in block:
        errs.append("khuon thieu khoa context_scenes")
    if "bỏ cảnh ngữ-cảnh — " not in flat(block):
        errs.append("chuoi descope canh ngu-canh khong nam trong khuon marker")
    if "## Cảnh ngữ-cảnh" not in block:
        errs.append("khuon thieu section Canh ngu-canh")
    if "vật này sống ở đâu" not in ftext:
        errs.append("thieu cau hoi giai doan 0: vat nay song o dau")
    if "Giai đoạn 0" not in ftext:
        errs.append("thieu section Giai doan 0")
    if "scaffold đơn vị THẬT sau cờ dev" not in ftext:
        errs.append("thieu quy tac mac-dinh-nac-cao (scaffold don vi that sau co dev)")
    if "gương song song" not in ftext:
        errs.append("thieu lenh cam guong song song")
    if "hợp lệ vĩnh viễn" not in ftext:
        errs.append("thieu cau hop le vinh vien cho nhanh khong-co-duong-nhung-re")
    if "host_embed" not in text:
        errs.append("bang preflight thieu khoa design_pass.host_embed")
    if "trước Cổng Phạm-vi" not in ftext and "trước Gate 1" not in ftext:
        errs.append("thieu luat standalone truoc Cong Pham-vi phai kem canh/descope")
    return errs
# DOI CHUNG DUONG: ban nguyen ven phai XANH truoc khi tin cac mutation DO.
assert check(t) == [], f"ban nguyen ven phai xanh: {check(t)}"
m1 = t.replace("context: <standalone|static-frame|host-embedded>", "", 1)
assert any("khuon thieu khoa context" in e for e in check(m1)), "dot bien xoa khoa context khong do"
m2 = re.sub(r"vật\s+này\s+sống\s+ở\s+đâu", "", t)
assert any("vat nay song o dau" in e for e in check(m2)), "dot bien xoa cau hoi giai doan 0 khong do"
m3 = re.sub(r"bỏ\s+cảnh\s+ngữ-cảnh\s+— ", "bo canh ngu canh: ", t)
assert any("chuoi descope" in e for e in check(m3)), "dot bien lech chuoi descope khong do"
m4 = re.sub(r"gương\s+song\s+song", "", t, count=1)
assert any("cam guong song song" in e for e in check(m4)), "dot bien xoa cam guong khong do"
print("P134 OK (doi chung duong + 4 dot bien deu do dung cho)")
PY

run "P135 context-ladder round-trip: khuon writer -> the render nhan tieng nguoi (E5)" \
  python3 - "$ROOT" <<'PY'
import re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
skill = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
block = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>", skill, re.S).group(1)
LABELS = {"standalone": "đứng một mình", "static-frame": "khung giả tĩnh", "host-embedded": "nhúng host thật"}
SCENES_PH = "[<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]"
BODY_PH = re.compile(r"- <file cảnh — [^\n]*>")
def mkfix(ctx, scenes, drop_context=False, ledger=None, cfg="schema_version: 1\n"):
    d = Path(tempfile.mkdtemp())
    ws = d / "_acceptance" / "fx"; ws.mkdir(parents=True)
    (d / "_acceptance" / "config.yaml").write_text(cfg, encoding="utf-8")
    (ws / "contract.md").write_text(
        "---\nschema_version: 1\nfeature: fx\nslug: fx\nrisk_tier: T2\nstatus: draft\n---\n\n"
        "## Criteria\n\n- AC-1: Given a, When b, Then c.\n", encoding="utf-8")
    fx = (block.replace("<slug>", "fx").replace("<ISO UTC>", "2026-08-04T00:00:00Z")
          .replace("<url đã mở>", "http://localhost:3000/proto/fx")
          .replace("<real-components|scaffold|static>", "scaffold")
          .replace("<standalone|static-frame|host-embedded>", ctx)
          .replace(SCENES_PH, scenes)
          .replace("<tên-skill-đã-nạp|repo-tokens|shadcn-default>", "shadcn-default")
          .replace("[<danh sách state đã duyệt>]", "[default]").replace("<n>", "1")
          .replace("<state>", "default").replace("<breakpoint>", "mobile-375")
          .replace("<theme>", "light").replace("<file>", "default--mobile-375")
          .replace("<finding — đã đổi gì, 1 dòng/finding>", "x")
          .replace("<finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>", "y"))
    fx = BODY_PH.sub("- evidence/design-pass/canh-1.png", fx)
    if drop_context:
        fx = "\n".join(l for l in fx.splitlines() if not l.startswith("context"))
    assert "<" not in fx.split("---", 2)[1], f"frontmatter fixture con placeholder song: {fx.split('---',2)[1]}"
    (ws / "design-pass.md").write_text(fx, encoding="utf-8")
    if ledger is not None:
        (ws / "decisions.jsonl").write_text(ledger, encoding="utf-8")
    return d
def render(d):
    r = subprocess.run(["node", str(root / "scripts/gate-card.js"), "--root", str(d), "--slug", "fx"],
                       capture_output=True, text=True)
    assert r.returncode == 0, f"gate-card exit {r.returncode}: {r.stderr}"
    return r.stdout
# round-trip: moi nac -> dung nhan tieng nguoi tren DAU RA the
for ctx, label in LABELS.items():
    out = render(mkfix(ctx, "[evidence/design-pass/ctx.png]"))
    assert label in out, f"the khong render nhan '{label}' cho {ctx}"
    assert "Bản mẫu" in out, "the thieu khoi Ban mau & ngu canh"
print("P135 OK (3 nac round-trip tu khuon writer)")
PY

run "P136 context-ladder co vang standalone thieu canh: 3 nhanh fixture tu writer (E6)" \
  python3 - "$ROOT" <<'PY'
import re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
skill = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
block = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>", skill, re.S).group(1)
SCENES_PH = "[<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]"
BODY_PH = re.compile(r"- <file cảnh — [^\n]*>")
def mkfix(scenes, ledger=None):
    d = Path(tempfile.mkdtemp())
    ws = d / "_acceptance" / "fx"; ws.mkdir(parents=True)
    (d / "_acceptance" / "config.yaml").write_text("schema_version: 1\n", encoding="utf-8")
    (ws / "contract.md").write_text(
        "---\nschema_version: 1\nfeature: fx\nslug: fx\nrisk_tier: T2\nstatus: draft\n---\n\n"
        "## Criteria\n\n- AC-1: Given a, When b, Then c.\n", encoding="utf-8")
    fx = (block.replace("<slug>", "fx").replace("<ISO UTC>", "2026-08-04T00:00:00Z")
          .replace("<url đã mở>", "u").replace("<real-components|scaffold|static>", "scaffold")
          .replace("<standalone|static-frame|host-embedded>", "standalone")
          .replace(SCENES_PH, scenes)
          .replace("<tên-skill-đã-nạp|repo-tokens|shadcn-default>", "repo-tokens")
          .replace("[<danh sách state đã duyệt>]", "[default]").replace("<n>", "0")
          .replace("<state>", "default").replace("<breakpoint>", "mobile-375")
          .replace("<theme>", "light").replace("<file>", "f")
          .replace("<finding — đã đổi gì, 1 dòng/finding>", "x")
          .replace("<finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>", "y"))
    fx = BODY_PH.sub("- (chua co)", fx)
    (ws / "design-pass.md").write_text(fx, encoding="utf-8")
    if ledger is not None:
        (ws / "decisions.jsonl").write_text(ledger, encoding="utf-8")
    return d
def render(d):
    r = subprocess.run(["node", str(root / "scripts/gate-card.js"), "--root", str(d), "--slug", "fx"],
                       capture_output=True, text=True)
    assert r.returncode == 0, f"gate-card exit {r.returncode}: {r.stderr}"
    return r.stdout
FLAG = "chưa có cảnh ngữ-cảnh"
# nhanh thieu: standalone + scenes rong + khong ledger -> CO co vang
out = render(mkfix("[]"))
assert FLAG in out, "standalone thieu canh ma the KHONG co vang"
# doi chung duong (a): co canh -> KHONG co
out = render(mkfix("[evidence/design-pass/ctx.png]"))
assert FLAG not in out, "co canh ngu-canh ma the van co vang oan"
# doi chung duong (b): co entry descope dung khuon -> KHONG co
# (nhanh nay dong thoi la mutation-detector: reader mu ledger se co oan -> case do)
led = '{"id":"d-1","type":"descope","decision":"bỏ cảnh ngữ-cảnh — proto đã chạy trong host thật"}\n'
out = render(mkfix("[]", ledger=led))
assert FLAG not in out, "da co entry descope dung khuon ma the van co vang oan (reader mu ledger)"
# entry LECH khuon (khong bat dau dung chuoi) -> van phai co
led2 = '{"id":"d-2","type":"descope","decision":"bo canh ngu canh: ly do"}\n'
out = render(mkfix("[]", ledger=led2))
assert FLAG in out, "entry lech khuon ma van duoc tinh la descope hop le"
# PLACEHOLDER NGUYEN TRANG (S4-r1 false-green): khuon chua dien co dau phay ben
# trong -> split(',') tach doi, nua sau song qua filter cu -> im lang + khoe
# "1 cảnh ngữ-cảnh". Phai: van co vang + KHONG dem placeholder thanh canh.
out = render(mkfix(SCENES_PH))
assert FLAG in out, "placeholder nguyen trang ma co vang standalone-thieu-canh im lang"
assert "cảnh ngữ-cảnh</b>" not in out and "1 cảnh ngữ-cảnh" not in out, \
    "placeholder nguyen trang bi dem thanh canh that tren card"
print("P136 OK (thieu->co, canh->khong, descope->khong, lech-khuon->co, placeholder->co)")
PY

run "P137 context-ladder duong doc-cu + gia tri la: co vang co ten, khong chan (E7)" \
  python3 - "$ROOT" <<'PY'
import re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
skill = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
block = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>", skill, re.S).group(1)
SCENES_PH = "[<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]"
BODY_PH = re.compile(r"- <file cảnh — [^\n]*>")
def mkfix(ctx, drop_context=False):
    d = Path(tempfile.mkdtemp())
    ws = d / "_acceptance" / "fx"; ws.mkdir(parents=True)
    (d / "_acceptance" / "config.yaml").write_text("schema_version: 1\n", encoding="utf-8")
    (ws / "contract.md").write_text(
        "---\nschema_version: 1\nfeature: fx\nslug: fx\nrisk_tier: T2\nstatus: draft\n---\n\n"
        "## Criteria\n\n- AC-1: Given a, When b, Then c.\n", encoding="utf-8")
    fx = (block.replace("<slug>", "fx").replace("<ISO UTC>", "2026-08-04T00:00:00Z")
          .replace("<url đã mở>", "u").replace("<real-components|scaffold|static>", "static")
          .replace("<standalone|static-frame|host-embedded>", ctx)
          .replace(SCENES_PH, "[]")
          .replace("<tên-skill-đã-nạp|repo-tokens|shadcn-default>", "repo-tokens")
          .replace("[<danh sách state đã duyệt>]", "[default]").replace("<n>", "0")
          .replace("<state>", "default").replace("<breakpoint>", "mobile-375")
          .replace("<theme>", "light").replace("<file>", "f")
          .replace("<finding — đã đổi gì, 1 dòng/finding>", "x")
          .replace("<finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>", "y"))
    fx = BODY_PH.sub("- (khong)", fx)
    if drop_context:
        # so phien DOI TRUOC truc ngu canh: khong co context/context_scenes
        fx = "\n".join(l for l in fx.splitlines() if not l.startswith("context"))
    (ws / "design-pass.md").write_text(fx, encoding="utf-8")
    return d
def render(d):
    r = subprocess.run(["node", str(root / "scripts/gate-card.js"), "--root", str(d), "--slug", "fx"],
                       capture_output=True, text=True)
    assert r.returncode == 0, f"gate-card exit {r.returncode} (duong doc-cu PHAI khong chan): {r.stderr}"
    return r.stdout
OLD = "chưa khai nấc ngữ cảnh"
ALIEN = "không nhận diện được"
# khuon cu (khong co context:) -> exit 0 + co vang doc-cu
out = render(mkfix("host-embedded", drop_context=True))
assert OLD in out, "so phien doi cu ma the khong co vang 'chua khai nac ngu canh'"
# gia tri ngoai enum -> co vang neu DUNG ten gia tri la
out = render(mkfix("embedded-lite"))
assert ALIEN in out and "embedded-lite" in out, "gia tri la khong duoc neu ten tren the"
# doi chung duong: gia tri hop le -> khong co ca hai loai co
out = render(mkfix("host-embedded"))
assert OLD not in out and ALIEN not in out, "gia tri hop le ma van co vang oan"
print("P137 OK (doc-cu co ten, gia tri la co ten, hop le khong co)")
PY

run "P138 context-ladder socket host_embed: vang->co vang, con tro hong->neu ten, giai duoc->khong (E4)" \
  python3 - "$ROOT" <<'PY'
import re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
skill = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
block = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>", skill, re.S).group(1)
SCENES_PH = "[<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]"
BODY_PH = re.compile(r"- <file cảnh — [^\n]*>")
def mkfix(cfg, mkguide=None):
    d = Path(tempfile.mkdtemp())
    ws = d / "_acceptance" / "fx"; ws.mkdir(parents=True)
    (d / "_acceptance" / "config.yaml").write_text(cfg, encoding="utf-8")
    (ws / "contract.md").write_text(
        "---\nschema_version: 1\nfeature: fx\nslug: fx\nrisk_tier: T2\nstatus: draft\n---\n\n"
        "## Criteria\n\n- AC-1: Given a, When b, Then c.\n", encoding="utf-8")
    fx = (block.replace("<slug>", "fx").replace("<ISO UTC>", "2026-08-04T00:00:00Z")
          .replace("<url đã mở>", "u").replace("<real-components|scaffold|static>", "scaffold")
          .replace("<standalone|static-frame|host-embedded>", "host-embedded")
          .replace(SCENES_PH, "[]")
          .replace("<tên-skill-đã-nạp|repo-tokens|shadcn-default>", "repo-tokens")
          .replace("[<danh sách state đã duyệt>]", "[default]").replace("<n>", "0")
          .replace("<state>", "default").replace("<breakpoint>", "mobile-375")
          .replace("<theme>", "light").replace("<file>", "f")
          .replace("<finding — đã đổi gì, 1 dòng/finding>", "x")
          .replace("<finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>", "y"))
    fx = BODY_PH.sub("- (khong)", fx)
    (ws / "design-pass.md").write_text(fx, encoding="utf-8")
    if mkguide:
        p = d / mkguide; p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text("huong dan nhung\n", encoding="utf-8")
    return d
def render(d):
    r = subprocess.run(["node", str(root / "scripts/gate-card.js"), "--root", str(d), "--slug", "fx"],
                       capture_output=True, text=True)
    assert r.returncode == 0, f"gate-card exit {r.returncode} (socket PHAI khong chan): {r.stderr}"
    return r.stdout
MISS = "chưa khai đường nhúng"
DEAD = "con trỏ không giải được"
CFG_HE = "schema_version: 1\ndesign_pass:\n  host_embed:\n    guide: docs/nhung.md\n    route: /proto\n    dev_flag: DEV=1\n"
# (a) config khong co design_pass.host_embed -> co vang vang-duong-nhung, van exit 0
out = render(mkfix("schema_version: 1\n"))
assert MISS in out, "vang khoa host_embed ma the khong co vang"
# (b) khoa CO ma con tro chet -> co vang neu NGUYEN VAN con tro
out = render(mkfix(CFG_HE))
assert DEAD in out and "docs/nhung.md" in out, "con tro chet khong duoc neu ten tren the"
# (c) doi chung duong: con tro giai duoc -> khong co loai nao
out = render(mkfix(CFG_HE, mkguide="docs/nhung.md"))
assert MISS not in out and DEAD not in out, "con tro giai duoc ma van co vang oan"
# (d) comment duoi tren guide (khoan dung nhu hook) -> van giai duoc, khong co (S4-r1)
CFG_CMT = "schema_version: 1\ndesign_pass:\n  host_embed:\n    guide: docs/nhung.md  # duong nhung cua repo\n    route: /proto\n"
out = render(mkfix(CFG_CMT, mkguide="docs/nhung.md"))
assert MISS not in out and DEAD not in out, "comment duoi lam hong resolvability -> co vang oan"
# (e) config CRLF -> khoa van duoc nhan dien, khong co vang-khoa oan (S4-r1)
out = render(mkfix(CFG_HE.replace("\n", "\r\n"), mkguide="docs/nhung.md"))
assert MISS not in out, "config CRLF lam khoa host_embed tang hinh -> co vang oan"
# (f) blank line trong block design_pass truoc host_embed -> van nhan dien (S4-r1)
CFG_BLANK = "schema_version: 1\ndesign_pass:\n\n  host_embed:\n    guide: docs/nhung.md\n"
out = render(mkfix(CFG_BLANK, mkguide="docs/nhung.md"))
assert MISS not in out, "blank line trong block lam khoa tang hinh -> co vang oan"
# quan he writer-docs: bang preflight SKILL phai khai khoa nay (Task 1 da pin, assert lai quan he)
assert "design_pass.host_embed" in skill, "SKILL khong khai khoa host_embed trong preflight"
print("P138 OK (vang->co, chet->ten, song->khong, comment/CRLF/blank->khong, SKILL khai khoa)")
PY

run "P139 context-ladder generic: fixture repo-la code-sinh (web app tron) + grep-guard tu vung host (E8)" \
  python3 - "$ROOT" <<'PY'
import re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
skill = (root / "skills/design-pass/SKILL.md").read_text(encoding="utf-8")
block = re.search(r"<<<DESIGN-PASS-NOTE-TEMPLATE\n(.*?)\nDESIGN-PASS-NOTE-TEMPLATE>>>", skill, re.S).group(1)
SCENES_PH = "[<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]"
BODY_PH = re.compile(r"- <file cảnh — [^\n]*>")
# Fixture = repo web-app TRON do code sinh trong lan chay nay: khong artifact-
# platform, khong tu vung host nao. Phep do phai phan biet dung tren no —
# ghim QUAN HE khai-nac <-> config-cap-dich, khong ghim ten host.
def mkrepo(ctx, drop_context=False):
    d = Path(tempfile.mkdtemp())
    (d / "package.json").write_text('{"name":"plain-webapp","private":true}\n', encoding="utf-8")
    (d / "src").mkdir(); (d / "src" / "app.js").write_text("export const app = () => 'hello';\n", encoding="utf-8")
    ws = d / "_acceptance" / "fx-web"; ws.mkdir(parents=True)
    (d / "_acceptance" / "config.yaml").write_text("schema_version: 1\n", encoding="utf-8")
    (ws / "contract.md").write_text(
        "---\nschema_version: 1\nfeature: fx-web\nslug: fx-web\nrisk_tier: T2\nstatus: draft\n---\n\n"
        "## Criteria\n\n- AC-1: Given a, When b, Then c.\n", encoding="utf-8")
    fx = (block.replace("<slug>", "fx-web").replace("<ISO UTC>", "2026-08-04T00:00:00Z")
          .replace("<url đã mở>", "http://localhost:5173/preview")
          .replace("<real-components|scaffold|static>", "static")
          .replace("<standalone|static-frame|host-embedded>", ctx)
          .replace(SCENES_PH, "[]")
          .replace("<tên-skill-đã-nạp|repo-tokens|shadcn-default>", "shadcn-default")
          .replace("[<danh sách state đã duyệt>]", "[default]").replace("<n>", "0")
          .replace("<state>", "default").replace("<breakpoint>", "mobile-375")
          .replace("<theme>", "light").replace("<file>", "f")
          .replace("<finding — đã đổi gì, 1 dòng/finding>", "x")
          .replace("<finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>", "y"))
    fx = BODY_PH.sub("- (khong)", fx)
    if drop_context:
        fx = "\n".join(l for l in fx.splitlines() if not l.startswith("context"))
    (ws / "design-pass.md").write_text(fx, encoding="utf-8")
    return d
def render(d):
    r = subprocess.run(["node", str(root / "scripts/gate-card.js"), "--root", str(d), "--slug", "fx-web"],
                       capture_output=True, text=True)
    assert r.returncode == 0, f"gate-card exit {r.returncode} tren repo-la: {r.stderr}"
    return r.stdout
# ba phep do phan biet dung tren repo-la
out = render(mkrepo("host-embedded"))
assert "nhúng host thật" in out, "repo-la: nac hop le khong render nhan"
out = render(mkrepo("standalone"))
assert "chưa có cảnh ngữ-cảnh" in out, "repo-la: standalone thieu canh khong co vang"
out = render(mkrepo("host-embedded", drop_context=True))
assert "chưa khai nấc ngữ cảnh" in out, "repo-la: so phien doi cu khong co vang doc-cu"
# grep-guard tu vung host — chuoi GHEP MANH de guard khong tu khop source cua no,
# co sanity counter (so file quet phai dung) + doi chung duong (tiem -> do).
BAD = ["Crea" + "tor", "can" + "vas", "One" + "Hub"]
rt = (root / "tests/plugins/run-tests.sh").read_text(encoding="utf-8")
B = "# --- context-ladder cases " + "(P134-P141) begin ---"
E = "# --- context-ladder cases " + "end ---"
b = rt.find(B); e = rt.find(E, b + 1)
assert b != -1 and e != -1 and e > b, "khong tim thay vung case context-ladder"
srcs = {
    "skills/design-pass/SKILL.md": skill,
    "scripts/gate-card.js": (root / "scripts/gate-card.js").read_text(encoding="utf-8"),
    "tests:context-ladder-region": rt[b:e],
}
assert len(srcs) == 3, "sanity: so nguon quet phai la 3"
def guard(texts):
    errs = []
    for name, txt in sorted(texts.items()):
        for w in BAD:
            if w in txt:
                errs.append(f"tu vung host '{w}' lot vao {name}")
    return errs
assert guard(srcs) == [], f"tu vung host lot vao nguon kit: {guard(srcs)}"
mut = dict(srcs); mut["skills/design-pass/SKILL.md"] = skill + "\n" + BAD[0]
assert any("tu vung host" in x and BAD[0] in x for x in guard(mut)), "guard khong do khi tiem tu vung host"
print("P139 OK (3 phep do dung tren repo-la + guard co doi chung duong)")
PY

run "P140 context-ladder wiring: checklist ket phien S1-D + resume-guard doc context (E9)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
t = (root / "feature-loop/skills/feature-loop/SKILL.md").read_text(encoding="utf-8")
flat = lambda s: re.sub(r"\s+", " ", s)
def check(text):
    ftext = flat(text)
    errs = []
    if "ma trận capture + findings + nấc ngữ cảnh đã khai" not in ftext:
        errs.append("checklist ket phien S1-D thieu muc nac ngu canh da khai")
    # resume-guard: doan S1-D phai noi resume DOC khoa context (duong doc-cu co vang)
    m = re.search(r"\*\*Nghi thức S1-D.*?(?=\n\n)", text, re.S)
    seg = flat(m.group(0)) if m else ""
    if not ("resume" in seg and "`context:`" in seg):
        errs.append("doan S1-D thieu resume-guard doc khoa context")
    return errs
assert check(t) == [], f"ban nguyen ven phai xanh: {check(t)}"
m1 = re.sub(r"nấc\s+ngữ\s+cảnh\s+đã\s+khai", "", t)
assert any("thieu muc nac ngu canh" in e for e in check(m1)), "dot bien xoa muc checklist khong do"
m2 = re.sub(r"resume", "quaylai", t)
assert any("thieu resume-guard" in e for e in check(m2)), "dot bien xoa resume-guard khong do"
print("P140 OK (doi chung duong + 2 dot bien)")
PY

run "P141 context-ladder docs-pin: amendment spec v2 + term CONTEXT.md (E13)" \
  python3 - "$ROOT" <<'PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
spec = (root / "docs/specs/workflow-v2-spec.md").read_text(encoding="utf-8")
ctx = (root / "CONTEXT.md").read_text(encoding="utf-8")
flat = lambda s: re.sub(r"\s+", " ", s)
def check(spec_t, ctx_t):
    errs = []
    fs_, fc = flat(spec_t), flat(ctx_t)
    if "Bổ sung 04/08 — trục ngữ cảnh" not in fs_:
        errs.append("spec v2 thieu amendment truc ngu canh")
    if "2026-08-04-context-ladder-design.md" not in fs_:
        errs.append("amendment khong tro toi file design")
    if "Nấc ngữ cảnh" not in fc:
        errs.append("CONTEXT.md thieu term Nac ngu canh")
    if "Cảnh ngữ-cảnh" not in fc:
        errs.append("CONTEXT.md thieu term Canh ngu-canh")
    return errs
assert check(spec, ctx) == [], f"ban nguyen ven phai xanh: {check(spec, ctx)}"
m1 = re.sub(r"Bổ sung 04/08 — trục ngữ cảnh", "", spec)
assert any("thieu amendment" in e for e in check(m1, ctx)), "dot bien xoa amendment khong do"
m2 = re.sub(r"\*\*Nấc ngữ cảnh[^*]*\*\*", "", ctx)
assert any("thieu term Nac ngu canh" in e for e in check(spec, m2)), "dot bien xoa term khong do"
print("P141 OK (doi chung duong + 2 dot bien)")
PY

run "P142 context-ladder coverage-lint scoped: khong canh bao nao ngoai W3 da-biet (E12)" \
  python3 - "$ROOT" <<'PY'
import re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
# Thuoc scoped: lint rieng slug nay. W3 la bao gia DA BIET (lint doc expected
# mot-dong, khong thay ca am trong block scalar — cung lop bug parser gate-card,
# chip sua rieng). Luat: canh bao cua context-ladder ⊆ {W3}; lint sua xong
# (exit 0, khong W3) case nay VAN xanh — khong ghim bao gia thanh yeu cau.
r = subprocess.run(["node", str(root / "scripts/eval-coverage-lint.js"), str(root), "--slug", "context-ladder"],
                   capture_output=True, text=True)
warns = [l for l in r.stdout.splitlines() if l.strip().startswith("[context-ladder]")]
bad = [l for l in warns if " W3 " not in l]
assert bad == [], f"canh bao NGOAI W3 cho context-ladder: {bad}"
# DOI CHUNG DUONG (che do --files; W6 tat trong mode nay theo thiet ke — dong 214
# cua lint): tiem AC nguong KHONG co eval am -> W1 phai no dung ten AC.
ct = (root / "_acceptance/context-ladder/contract.md").read_text(encoding="utf-8")
ev = (root / "_acceptance/context-ladder/evals.yaml").read_text(encoding="utf-8")
d = Path(tempfile.mkdtemp())
(d / "contract.md").write_text(ct.replace("## Coverage", "- AC-99: Given x, When đạt ngưỡng 5, Then y.\n\n## Coverage", 1), encoding="utf-8")
(d / "evals.yaml").write_text(ev + "  - id: E99\n    criterion: AC-99\n    executor: script\n    cmd: config:executors.script.product_map\n    expected: chay xong la dat\n", encoding="utf-8")
r2 = subprocess.run(["node", str(root / "scripts/eval-coverage-lint.js"), str(root), "--files", str(d / "contract.md"), str(d / "evals.yaml")],
                    capture_output=True, text=True)
assert "W1" in r2.stdout and "AC-99" in r2.stdout, f"doi chung duong hong: tiem AC nguong ma W1 khong no: {r2.stdout[:300]}"
print("P142 OK (chi W3 da-biet; doi chung duong W1 no dung)")
PY

# --- context-ladder cases end ---

# ── P143: parser evals block-scalar — covGaps thẻ Cổng 1 không bắn giả trên `expected: >` ─
# Bug lớp: khuôn eval-gen viết `expected: >` (folded scalar); regex một-dòng cũ
# bắt được đúng ">" nên NEG_RE test trên ">" luôn false → thẻ bắn cờ "có
# ngưỡng/biên nhưng chưa có ca dưới ngưỡng" cho MỌI AC khớp THRESHOLD_RE
# (context-ladder: 8/8 AC dính dù 16/16 eval có ca âm). Bất biến CLAUDE.md:
# đối chứng dương TRƯỚC (phép đo phải đỏ được trên vật thật thiếu ca âm, ghim
# đúng thông điệp) rồi mới tin case âm; fixture do code sinh trong chính lần chạy.
echo "P143 gate-card covGaps: block scalar co ca am -> KHONG co; thieu that -> dung 1 AC"
P143OK=1
P143WS="$(mktemp -d)"
mkdir -p "$P143WS/_acceptance/demo"
cat > "$P143WS/_acceptance/demo/contract.md" <<'EOF'
---
schema_version: 1
feature: demo
slug: demo
risk_tier: T2
status: draft
---

## Criteria

- AC-1: Given ngưỡng 5 phút, When quá ngưỡng, Then hệ thống cảnh báo.
- AC-2: Given hạn mức 3 lần, When vượt hạn mức, Then hệ thống khoá phiên.
EOF
P143MSG='có ngưỡng/biên nhưng chưa có ca'
p134_flags() { node "$ROOT/scripts/gate-card.js" --root "$P143WS" --slug demo --gate 1 2>&1 | grep -o "AC-[0-9]* $P143MSG" ; }
# (a) đối chứng dương: expected MỘT DÒNG thiếu ca âm → cờ PHẢI bắn cho cả 2 AC,
# đúng thông điệp — chứng minh máy-cảnh-báo còn sống trước khi tin các case sạch.
cat > "$P143WS/_acceptance/demo/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: cảnh báo bắn ra đúng kênh
  - id: E2
    criterion: AC-2
    expected: phiên bị khoá ngay
EOF
P143A="$(p134_flags)"
printf '%s\n' "$P143A" | grep -q "AC-1 $P143MSG" || { echo "     doi chung duong: co AC-1 KHONG ban (may canh bao chet?)"; P143OK=0; }
printf '%s\n' "$P143A" | grep -q "AC-2 $P143MSG" || { echo "     doi chung duong: co AC-2 KHONG ban"; P143OK=0; }
# (b) folded scalar `>` chứa ca âm cho cả 2 AC → KHÔNG cờ nào (đây là bug gốc)
cat > "$P143WS/_acceptance/demo/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: >
      quá ngưỡng → cảnh báo bắn;
      dưới ngưỡng → KHÔNG bắn cảnh báo.
  - id: E2
    criterion: AC-2
    expected: >
      vượt hạn mức → khoá;
      còn trong hạn mức → KHÔNG khoá phiên.
EOF
[ -z "$(p134_flags)" ] || { echo "     folded scalar co ca am van bi ban co gia:"; p134_flags | sed 's/^/       /'; P143OK=0; }
# (c) literal scalar `|` — cùng lớp, phải cùng thuốc
cat > "$P143WS/_acceptance/demo/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: |
      dưới ngưỡng → KHÔNG bắn cảnh báo.
  - id: E2
    criterion: AC-2
    expected: |
      còn trong hạn mức → KHÔNG khoá phiên.
EOF
[ -z "$(p134_flags)" ] || { echo "     literal scalar | van bi ban co gia"; P143OK=0; }
# (d) chính xác từng AC: AC-1 block CÓ ca âm, AC-2 block THIẾU → đúng 1 cờ, đúng AC-2
# (block-parse không được blanket-suppress cảnh báo)
cat > "$P143WS/_acceptance/demo/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: >
      dưới ngưỡng → KHÔNG bắn cảnh báo.
  - id: E2
    criterion: AC-2
    expected: >
      vượt hạn mức thì phiên bị khoá ngay lập tức.
EOF
P143D="$(p134_flags)"
[ "$(printf '%s\n' "$P143D" | grep -c "$P143MSG")" = "1" ] || { echo "     ky vong DUNG 1 co, thay: [$P143D]"; P143OK=0; }
printf '%s\n' "$P143D" | grep -q "AC-2 $P143MSG" || { echo "     co phai tro dung AC-2 (AC thieu that)"; P143OK=0; }
# (e) thân block là DATA: dòng "criterion: AC-9" trong thân expected không được
# cướp mapping của eval (cướp thì evalsFor(AC-1) rỗng → cờ AC-1 bắn lại)
cat > "$P143WS/_acceptance/demo/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: >
      dưới ngưỡng → KHÔNG bắn; dòng sau là DATA chứ không phải key:
      criterion: AC-9
      exit 0.
  - id: E2
    criterion: AC-2
    expected: >
      còn trong hạn mức → KHÔNG khoá phiên.
EOF
[ -z "$(p134_flags)" ] || { echo "     dong criterion: trong THAN block cuop mat mapping cua eval"; P143OK=0; }
rm -rf "$P143WS"
if [ "$P143OK" -eq 1 ]; then
  pass "P143 covGaps doc duoc block scalar > va |, canh bao dung AC, than block khong cuop key"
else
  fail "P143 covGaps doc duoc block scalar > va |, canh bao dung AC, than block khong cuop key"
fi

# ── P144: eval-coverage-lint W1/W3 — cùng lớp bug, cùng thuốc (lib/eval-yaml.js) ─
# Lint có BẢN SAO của parser gate-card (đã trôi cùng nhau); case này ghim phía
# lint để hai bên không tách thuốc lần nữa: W1 không bắn giả khi ca âm nằm trong
# block, W3 đếm được ca âm trong block, và cảnh báo thật vẫn đỏ đúng chỗ.
echo "P144 eval-coverage-lint: W1/W3 doc block scalar, khong ban gia, thieu that van do"
P144OK=1
P144WS="$(mktemp -d)"
cat > "$P144WS/contract.md" <<'EOF'
---
schema_version: 1
feature: demo
slug: demo
risk_tier: T2
status: draft
---

## Criteria

- AC-1: Given ngưỡng 5 phút, When quá ngưỡng, Then hệ thống cảnh báo.
- AC-2: Given hạn mức 3 lần, When vượt hạn mức, Then hệ thống khoá phiên.

## Out of scope

- không gửi lại cảnh báo trùng trong 24 giờ
EOF
p135_lint() { node "$ROOT/scripts/eval-coverage-lint.js" --files "$P144WS/contract.md" "$P144WS/evals.yaml" 2>&1; }
# (a) đối chứng dương: một dòng, không ca âm → W1 cho cả 2 AC + W3, ghim thông điệp
cat > "$P144WS/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: cảnh báo bắn ra đúng kênh
  - id: E2
    criterion: AC-2
    expected: phiên bị khoá ngay
EOF
P144A="$(p135_lint)"
printf '%s' "$P144A" | grep -q 'W1 AC-1 is a threshold/boundary criterion' || { echo "     doi chung duong: W1 AC-1 khong ban"; P144OK=0; }
printf '%s' "$P144A" | grep -q 'W1 AC-2 is a threshold/boundary criterion' || { echo "     doi chung duong: W1 AC-2 khong ban"; P144OK=0; }
printf '%s' "$P144A" | grep -q 'W3 Out-of-scope lists' || { echo "     doi chung duong: W3 khong ban"; P144OK=0; }
# (b) ca âm nằm TRONG block `>` → không W1, không W3, exit 0 kèm dòng sạch
cat > "$P144WS/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: >
      dưới ngưỡng → KHÔNG bắn cảnh báo.
  - id: E2
    criterion: AC-2
    expected: >
      còn trong hạn mức → KHÔNG khoá phiên.
EOF
P144B="$(p135_lint)"; P144BST=$?
[ "$P144BST" -eq 0 ] || { echo "     block co ca am van exit $P144BST"; P144OK=0; }
printf '%s' "$P144B" | grep -q 'no coverage gaps detected' || { echo "     block co ca am van in canh bao: $P144B"; P144OK=0; }
# (c) AC-2 block thật sự thiếu ca âm → ĐÚNG 1 dòng W1, trỏ AC-2
cat > "$P144WS/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    expected: >
      dưới ngưỡng → KHÔNG bắn cảnh báo.
  - id: E2
    criterion: AC-2
    expected: >
      vượt hạn mức thì phiên bị khoá ngay lập tức.
EOF
P144C="$(p135_lint)"
[ "$(printf '%s' "$P144C" | grep -c '] W1 ')" = "1" ] || { echo "     ky vong dung 1 dong W1: $P144C"; P144OK=0; }
printf '%s' "$P144C" | grep -q 'W1 AC-2 is a threshold/boundary criterion' || { echo "     W1 phai tro AC-2"; P144OK=0; }
rm -rf "$P144WS"
if [ "$P144OK" -eq 1 ]; then
  pass "P144 lint W1/W3 doc block scalar, khong ban gia, thieu that van do dung AC"
else
  fail "P144 lint W1/W3 doc block scalar, khong ban gia, thieu that van do dung AC"
fi

# ── P145: awk cross-layer pairing (pre-merge) — thân block scalar là DATA ─────
# Cùng lớp bug, biến thể "thân làm bẩn state": (i) một bullet "- baseline: green"
# trong thân expected khớp luật flush → reset crit giữa block → layer thật đặt
# SAU expected mất pairing → false VIOLATION; (ii) một dòng prose
# "layer: backend-effect" trong thân pair HỘ eval UI-only → false-green — đúng
# thứ răng này sinh ra để chặn. Đối chứng dương giữ nguyên khung fixture, chỉ
# đổi evals.yaml — chứng minh đường chạy tới răng còn sống.
echo "P145 pre-merge cross-layer: than block khong reset/khong pair ho, thieu that van VIOLATION"
P145OK=1
P145WS="$(mktemp -d)"
mkdir -p "$P145WS/_acceptance/xl"
cat > "$P145WS/_acceptance/xl/contract.md" <<'EOF'
---
schema_version: 1
feature: xl
slug: xl
risk_tier: T2
status: implemented
approved_by: tester
---

## Criteria

- AC-1: Given form, When submit, Then DB có row mới (cross-layer).
EOF
P145MSG='AC-1 is tagged (cross-layer) but no eval of it declares layer: backend-effect'
p136_hits() { bash "$ROOT/scripts/pre-merge-check.sh" "$P145WS" 2>&1 | grep -cF "$P145MSG"; }
# (a) đối chứng dương: chỉ có layer ui → răng phải cắn, đúng thông điệp
cat > "$P145WS/_acceptance/xl/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: ui-check
    layer: ui
    expected: >
      form submit xong thấy toast.
EOF
[ "$(p136_hits)" = "1" ] || { echo "     doi chung duong: rang cross-layer KHONG can (duong chay toi rang chet?)"; P145OK=0; }
# (b) bullet "- baseline: green" trong thân expected + layer thật SAU expected → phải SẠCH
cat > "$P145WS/_acceptance/xl/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: script
    expected: >
      DB có đúng 1 row mới; log của run in các dòng:
      - baseline: green
      - exit 0
    layer: backend-effect
EOF
[ "$(p136_hits)" = "0" ] || { echo "     bullet trong than expected reset crit -> false VIOLATION"; P145OK=0; }
# (c) layer thật là ui, thân expected nhắc "layer: backend-effect" → PHẢI VIOLATION (chặn false-green)
cat > "$P145WS/_acceptance/xl/evals.yaml" <<'EOF'
evals:
  - id: E1
    criterion: AC-1
    executor: ui-check
    layer: ui
    expected: >
      chưa có eval nào khai
      layer: backend-effect
      cho tuyến này.
EOF
[ "$(p136_hits)" = "1" ] || { echo "     dong prose trong than expected pair HO eval ui-only -> false-green"; P145OK=0; }
rm -rf "$P145WS"
if [ "$P145OK" -eq 1 ]; then
  pass "P145 awk pairing bo qua than block scalar, hai chieu false-VIOLATION/false-green deu chan"
else
  fail "P145 awk pairing bo qua than block scalar, hai chieu false-VIOLATION/false-green deu chan"
fi

# ── P146: thẻ Cổng 1 — bullet hard-wrap nối trọn câu, không dấu máy (artifact THẬT) ──
# Findings 2026-08-05 (gate-card-ngon-ngu-may): covLines lọc /^-\s+\S/ theo TỪNG
# DÒNG nên phần nối của bullet wrap 80 cột bị vứt ("AC-6 (sha vào" cụt giữa câu),
# và khối Coverage + gap-probe render esc() thô nên `**`/backtick lên thẳng mặt
# người. Fixture do CODE SINH từ artifact thật của delta-verify-repin — không
# viết tay khuôn bên đọc (luật thước-gắn-vật).
echo "P146 gate-card Coverage/probe: noi tron bullet wrap + khong dau markdown may (artifact THAT)"
P146OK=1
P146WS="$(mktemp -d)"
mkdir -p "$P146WS/_acceptance/demo"
for f in contract.md gap-probe.md decisions.jsonl evals.yaml; do
  cp "$ROOT/_acceptance/delta-verify-repin/$f" "$P146WS/_acceptance/demo/$f" \
    || { echo "     fixture hong: khong cp duoc $f tu workspace that"; P146OK=0; }
done
# đối chứng dương cho chính fixture: bản gốc PHẢI chứa bullet wrap đang kiểm
grep -q 'AC-6 (sha vào$' "$P146WS/_acceptance/demo/contract.md" \
  || { echo "     artifact that khong con bullet wrap 'AC-6 (sha vào' cuoi dong — chon bullet khac cho case nay"; P146OK=0; }
P146OUT="$(node "$ROOT/scripts/gate-card.js" --root "$P146WS" --slug demo --gate 1 2>&1)"; P146ST=$?
[ "$P146ST" -eq 0 ] || { echo "     gate-card exit $P146ST: $P146OUT"; P146OK=0; }
# đối chứng dương: khối Coverage + gap-probe THẬT SỰ render (răng của các phép đo âm bên dưới)
printf '%s' "$P146OUT" | grep -qF 'S — sự kiện re-pin' || { echo "     khoi Coverage khong render (doi chung duong chet)"; P146OK=0; }
printf '%s' "$P146OUT" | grep -qF 'CE: 141 mục thật' || { echo "     bullet Coverage dau tien khong render du (doi chung duong chet)"; P146OK=0; }
printf '%s' "$P146OUT" | grep -qF 'Hoán vị' || { echo "     row gap-probe P0 khong render (doi chung duong chet)"; P146OK=0; }
# RED lỗi (1): phần NỐI DÒNG của bullet wrap phải sống trọn trên thẻ
printf '%s' "$P146OUT" | grep -qF 'sha vào run-log' || { echo "     bullet wrap bi cat cut: 'sha vào run-log' khong xuat hien (covLines vut dong noi)"; P146OK=0; }
# RED lỗi (2): dấu máy markdown không được lên mặt người
if printf '%s' "$P146OUT" | grep -qF '**'; then echo "     the con dau '**' tho (khoi contract/probe chua qua lot markdown)"; P146OK=0; fi
if printf '%s' "$P146OUT" | grep -q '[`]'; then echo "     the con backtick tho (khoi contract/probe chua qua lot markdown)"; P146OK=0; fi
rm -rf "$P146WS"
if [ "$P146OK" -eq 1 ]; then
  pass "P146 bullet wrap noi tron + Coverage/probe khong dau may (doi chung duong tren artifact that)"
else
  fail "P146 bullet wrap noi tron + Coverage/probe khong dau may (doi chung duong tren artifact that)"
fi

# ── P147: tầng card-plain phủ Coverage + gap-probe (overlay thay chữ, không giấu được hàng) ──
# Lớp lỗi: block sinh SAU tầng card-plain không được nối vào tầng đó — AC/decisions
# có đường plain, Coverage/probe thì không. Phép đo là ROUND-TRIP: overlay sinh
# BẰNG CODE từ chính --extract (khuôn key rút từ writer doc), rồi reader render.
# Trust invariant giữ nguyên: sev do script render (overlay không đè được), hàng
# không có overlay vẫn hiện bản fallback — overlay chỉ đổi CHỮ, không đổi SỰ CÓ MẶT.
echo "P147 card-plain phu Coverage + gap-probe: overlay thay chu, sev + hang khong overlay van hien"
P147OK=1
P147WS="$(mktemp -d)"
mkdir -p "$P147WS/_acceptance/demo"
for f in contract.md gap-probe.md decisions.jsonl evals.yaml; do
  cp "$ROOT/_acceptance/delta-verify-repin/$f" "$P147WS/_acceptance/demo/$f" \
    || { echo "     fixture hong: khong cp duoc $f"; P147OK=0; }
done
# khuôn key: writer doc là NGUỒN, reader phải đọc đúng tập đó (hai chiều — trôi là đỏ)
node - "$ROOT" <<'JS' || P147OK=0
const fs = require('fs'), path = require('path');
const root = process.argv[2];
const doc = fs.readFileSync(path.join(root, 'commands/acceptance-card.md'), 'utf8');
const m = doc.match(/<<<CARD-PLAIN-KEYS\n([\s\S]*?)CARD-PLAIN-KEYS>>>/);
if (!m) { console.error('     KHONG rut duoc khuon CARD-PLAIN-KEYS tu commands/acceptance-card.md'); process.exit(1); }
const keys = m[1].split(/\s+/).filter(k => /^[a-z_]+$/.test(k));
if (!keys.includes('coverage_plain') || !keys.includes('gap_probe_plain')) {
  console.error('     khuon CARD-PLAIN-KEYS thieu coverage_plain/gap_probe_plain'); process.exit(1);
}
const gc = fs.readFileSync(path.join(root, 'scripts/gate-card.js'), 'utf8');
const used = [...new Set([...gc.matchAll(/\bpl\.([a-z_]+)/g)].map(x => x[1]))];
for (const k of keys) if (!used.includes(k)) { console.error('     key trong khuon ma reader KHONG doc: ' + k); process.exit(1); }
for (const k of used) if (!keys.includes(k)) { console.error('     reader doc key NGOAI khuon (writer khong duoc bao viet): ' + k); process.exit(1); }
const cx = fs.readFileSync(path.join(root, 'codex/acceptance-gate/skills/acceptance-card/SKILL.md'), 'utf8');
for (const k of ['coverage_plain', 'gap_probe_plain'])
  if (!cx.includes(k)) { console.error('     codex SKILL thieu key ' + k + ' (parity 2 harness)'); process.exit(1); }
JS
# overlay sinh bằng code từ extract: phủ TOÀN BỘ coverage, CHỈ row 0 của probe
P147EX="$(node "$ROOT/scripts/gate-card.js" --root "$P147WS" --slug demo --gate 1 --extract 2>/dev/null)"
printf '%s' "$P147EX" | node -e '
const d = JSON.parse(require("fs").readFileSync(0, "utf8"));
if (!(d.coverage || []).length || !((d.gap_probe || {}).rows || []).length) {
  console.error("     extract khong co coverage/gap_probe.rows — fixture chet"); process.exit(1);
}
const plain = {
  coverage_plain: d.coverage.map((t, i) => ({ i, p: "PHU-" + i + " câu tiếng sản phẩm cho trục này" })),
  gap_probe_plain: [{ i: 0, p: "DO-0 lỗ nặng nhất đã vá bằng luật máy mới" }],
};
require("fs").writeFileSync(process.argv[1], JSON.stringify(plain));
' "$P147WS/plain.json" || P147OK=0
P147OUT="$(node "$ROOT/scripts/gate-card.js" --root "$P147WS" --slug demo --gate 1 --plain "$P147WS/plain.json" 2>&1)"; P147ST=$?
[ "$P147ST" -eq 0 ] || { echo "     gate-card --plain exit $P147ST: $P147OUT"; P147OK=0; }
printf '%s' "$P147OUT" | grep -qF 'PHU-0 câu tiếng sản phẩm' || { echo "     overlay coverage_plain KHONG duoc render (key bi bo qua)"; P147OK=0; }
printf '%s' "$P147OUT" | grep -qF 'DO-0 lỗ nặng nhất' || { echo "     overlay gap_probe_plain KHONG duoc render (key bi bo qua)"; P147OK=0; }
# có overlay → bản thô của hàng ĐÃ overlay phải biến mất (đối chứng dương: P146 ghim
# chính hai chuỗi này PHẢI hiện khi KHÔNG overlay — phép đo phân biệt được hai trạng thái)
if printf '%s' "$P147OUT" | grep -qF 'CE: 141 mục thật'; then echo "     coverage van in ban tho du overlay da phu"; P147OK=0; fi
if printf '%s' "$P147OUT" | grep -qF 'Hoán vị'; then echo "     row probe 0 van in ban tho du overlay da phu"; P147OK=0; fi
# hàng KHÔNG có overlay vẫn phải hiện (overlay không giấu được finding)
printf '%s' "$P147OUT" | grep -qF 'E1 ghim chữ SKILL' || { echo "     row probe khong overlay BIEN MAT — overlay dang giau duoc finding"; P147OK=0; }
# sev do script render, overlay không đè được
printf '%s' "$P147OUT" | grep -qF '<b>P0</b>' || { echo "     sev P0 khong con do script render"; P147OK=0; }
rm -rf "$P147WS"
if [ "$P147OK" -eq 1 ]; then
  pass "P147 round-trip card-plain: khuon key 2 chieu + overlay thay chu, khong giau hang, sev giu nguyen"
else
  fail "P147 round-trip card-plain: khuon key 2 chieu + overlay thay chu, khong giau hang, sev giu nguyen"
fi

# ── P148: MỌI fallback render text thô đều lột dấu máy (gwt, oos, decLine cả 3 chỗ) ──
# Quét theo LỚP: không chỉ Coverage/probe — willText/wontText (gwt), scopePlain
# (oos), decLine (Gate 1 + Gate 2 approved + Gate 2 provisional), d.q (critText)
# đều là đường fallback in text contract/ledger thô khi overlay vắng.
echo "P148 moi fallback tho lot dau may: gwt + oos + decLine (G1) + critText/decLine (G2)"
P148OK=1
P148WS="$(mktemp -d)"
mkdir -p "$P148WS/_acceptance/g1" "$P148WS/_acceptance/g2"
cat > "$P148WS/_acceptance/g1/contract.md" <<'EOF'
---
schema_version: 1
feature: fx
slug: g1
risk_tier: T2
status: draft
---

## Criteria

- AC-1: Given `input.csv` sẵn, When chạy **bộ nạp**, Then thấy **kết quả** đúng.

## Out of scope

- Hoãn phần **báo cáo** dài (đợt
  sau mới làm).
EOF
printf '%s\n' '{"id":"d-1","type":"descope","stage":"S1","decision":"KHÔNG làm **realtime**","impact":"chậm `5s`"}' > "$P148WS/_acceptance/g1/decisions.jsonl"
P148G1="$(node "$ROOT/scripts/gate-card.js" --root "$P148WS" --slug g1 --gate 1 2>&1)"; P148ST=$?
[ "$P148ST" -eq 0 ] || { echo "     gate-card G1 exit $P148ST: $P148G1"; P148OK=0; }
printf '%s' "$P148G1" | grep -qF 'thấy kết quả đúng' || { echo "     gwt fallback khong lot dau: thieu 'thấy kết quả đúng'"; P148OK=0; }
printf '%s' "$P148G1" | grep -qF 'đợt sau mới làm' || { echo "     oos bullet wrap cat cut hoac khong lot dau: thieu 'đợt sau mới làm'"; P148OK=0; }
printf '%s' "$P148G1" | grep -qF 'KHÔNG làm realtime' || { echo "     decLine G1 khong lot dau: thieu 'KHÔNG làm realtime'"; P148OK=0; }
printf '%s' "$P148G1" | grep -qF 'chậm 5s' || { echo "     decLine impact khong lot dau: thieu 'chậm 5s'"; P148OK=0; }
if printf '%s' "$P148G1" | grep -qF '**'; then echo "     G1 con '**' tho"; P148OK=0; fi
if printf '%s' "$P148G1" | grep -q '[`]'; then echo "     G1 con backtick tho"; P148OK=0; fi
cat > "$P148WS/_acceptance/g2/contract.md" <<'EOF'
---
schema_version: 1
feature: fx
slug: g2
risk_tier: T2
status: implemented
---

## Criteria

- AC-1: Given `input.csv` sẵn, When chạy **bộ nạp**, Then thấy **kết quả** đúng.
EOF
cat > "$P148WS/_acceptance/g2/evidence-report.md" <<'EOF'
---
verdict: PASS
---

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-1 | judgment | UNCERTAIN |
EOF
printf '%s\n%s\n%s\n' \
  '{"id":"d-1","type":"choice","stage":"S1","decision":"chọn đường **A** nhanh","impact":"bỏ `cache`"}' \
  '{"type":"seal","gate":"1"}' \
  '{"id":"d-2","type":"descope","stage":"S3","decision":"KHÔNG làm **offline**","impact":"cần `mạng`"}' \
  > "$P148WS/_acceptance/g2/decisions.jsonl"
P148G2="$(node "$ROOT/scripts/gate-card.js" --root "$P148WS" --slug g2 --gate 2 2>&1)"; P148ST=$?
[ "$P148ST" -eq 0 ] || { echo "     gate-card G2 exit $P148ST: $P148G2"; P148OK=0; }
printf '%s' "$P148G2" | grep -qF 'thấy kết quả đúng' || { echo "     critText fallback G2 khong lot dau"; P148OK=0; }
printf '%s' "$P148G2" | grep -qF 'chọn đường A nhanh' || { echo "     decLine G2 (approved) khong lot dau"; P148OK=0; }
printf '%s' "$P148G2" | grep -qF 'KHÔNG làm offline' || { echo "     decLine G2 (provisional) khong lot dau"; P148OK=0; }
if printf '%s' "$P148G2" | grep -qF '**'; then echo "     G2 con '**' tho"; P148OK=0; fi
if printf '%s' "$P148G2" | grep -q '[`]'; then echo "     G2 con backtick tho"; P148OK=0; fi
rm -rf "$P148WS"
if [ "$P148OK" -eq 1 ]; then
  pass "P148 lot dau may o moi fallback tho (gwt, oos wrap, decLine x3, critText)"
else
  fail "P148 lot dau may o moi fallback tho (gwt, oos wrap, decLine x3, critText)"
fi

if [ "$failures" -gt 0 ]; then
  echo
  echo "Results: $failures failed"
  exit 1
fi


# ── P149-P154: judge-required-evidence ───────────────────────────────────────
echo "P149 (JR4) khuon JUDGMENT-BLOCK-TEMPLATE round-trip qua evidence-core that"
run "P149 fixture sinh-tu-khuon -> recheck clean; mutant token cam -> do" \
  node - "$ROOT" <<'NODE'
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const ROOT = process.argv[2];
const tpl = fs.readFileSync(path.join(ROOT, 'skills/acceptance/references/evidence-report-template.md'), 'utf8');
const m = tpl.match(/<!-- <<<JUDGMENT-BLOCK-TEMPLATE -->([\s\S]*?)<!-- JUDGMENT-BLOCK-TEMPLATE>>> -->/);
if (!m) { console.error('thieu marker JUDGMENT-BLOCK-TEMPLATE'); process.exit(1); }
// SINH block tu khuon: thay placeholder {{...}} + dien override (round-trip writer that)
let block = m[1].trim().split('\n').filter(l => !l.trim().startsWith('<!--')).join('\n');
block = block.replace(/\{\{[^}]*\}\}/g, 'noi dung cu the du dai cho hook doc duoc o day')
  .replace(/- eval: E4/, '- eval: EJ')
  .replace(/required_evidence:\n\s+- .*$/m, 'required_evidence:\n    - anh chup state sau buoc 2 — lay bang capture.ui')
  .replace(/human_override:.*$/m, 'human_override: Manh 2026-08-05');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jr4-'));
const dir = path.join(root, '_acceptance', 'feat-jr4'); fs.mkdirSync(dir, { recursive: true });
const verifier = path.join(root, 'verify.sh'); fs.writeFileSync(verifier, '#!/bin/sh\nexit 0\n'); fs.chmodSync(verifier, 0o755);
fs.writeFileSync(path.join(dir, 'run-log.jsonl'), JSON.stringify({ ts: 't', round: 1, evalId: 'E1', run_id: 'jr4-E1-001', exit_code: 0, cmd: 'x' }) + '\n');
const report = `---\nschema_version: 1\nfeature_slug: feat-jr4\nverdict: PASS\nhuman_signoff: Manh 2026-08-05\n---\n\n## Evidence\n- eval: E1\n  run_id: jr4-E1-001\n  exit_code: 0\n  verifier: ${verifier}\n  verified_at: 2026-08-05\n${block}\n`;
fs.writeFileSync(path.join(dir, 'evidence-report.md'), report);
const run = (rp) => { try { cp.execFileSync('node', [path.join(ROOT, 'scripts/recheck-evidence.js'), rp], { stdio: 'ignore' }); return 0; } catch (e) { return e.status; } };
if (run(path.join(dir, 'evidence-report.md')) !== 0) { console.error('fixture sinh-tu-khuon bi evidence-core chan'); process.exit(1); }
fs.writeFileSync(path.join(dir, 'evidence-report.md'), report + '\nghi chu: verdict: FAIL\n');
if (run(path.join(dir, 'evidence-report.md')) !== 1) { console.error('mutant token cam khong bi chan'); process.exit(1); }
NODE

echo "P150 (JR5) gate-card hien 'Muon may doi y, can:' + duong doc-cu so voi BASE commit"
run "P150 required_evidence tren the + report cu render y het ban base" \
  bash -c '
    set -e
    T=$(mktemp -d)
    mkdir -p "$T/ws/_acceptance/feat-jr5"
    printf -- "---\nschema_version: 2\nfeature: feat-jr5 demo\nslug: feat-jr5\nrisk_tier: T3\nsurfaces: [cli]\nstatus: implemented\napproved_by: Manh Phan\n---\n\n## Criteria\n\n- AC-1: (judgment) Given a, When b, Then c.\n" > "$T/ws/_acceptance/feat-jr5/contract.md"
    printf -- "evals:\n  - id: EJ1\n    criterion: AC-1\n    executor: judgment\n    inputs: [contract.md]\n    question: \"on chua?\"\n" > "$T/ws/_acceptance/feat-jr5/evals.yaml"
    REP="$T/ws/_acceptance/feat-jr5/evidence-report.md"
    printf -- "---\nschema_version: 2\nfeature_slug: feat-jr5\nverdict: PENDING-JUDGMENT\n---\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| EJ1 | AC-1 | judgment | UNCERTAIN |\n\n## Evidence\n- eval: EJ1\n  judged_by: judge panel\n  verdict: UNCERTAIN\n  rationale: chua du can cu\n  required_evidence:\n    - anh chup man hinh saved-state — lay bang capture.ui\n  human_override:\n" > "$REP"
    OUT_NEW=$(cd "$T/ws" && node "'"$ROOT"'/scripts/gate-card.js" --slug feat-jr5 2>/dev/null)
    echo "$OUT_NEW" | grep -q "Muốn máy đổi ý, cần:" || { echo "thieu khoi bang-chung-con-thieu"; exit 1; }
    echo "$OUT_NEW" | grep -q "saved-state" || { echo "thieu noi dung muc"; exit 1; }
    # report CU (khong field) → stdout == stdout cua gate-card TAI BASE COMMIT
    printf -- "---\nschema_version: 2\nfeature_slug: feat-jr5\nverdict: PENDING-JUDGMENT\n---\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| EJ1 | AC-1 | judgment | UNCERTAIN |\n\n## Evidence\n- eval: EJ1\n  judged_by: judge panel\n  verdict: UNCERTAIN\n  rationale: chua du can cu\n  human_override:\n" > "$REP"
    BASE=$(git -C "'"$ROOT"'" merge-base HEAD origin/main)
    mkdir -p "$T/base/scripts"
    git -C "'"$ROOT"'" show "$BASE:scripts/gate-card.js" > "$T/base/scripts/gate-card.js"
    cp -R "'"$ROOT"'/lib" "$T/base/lib"
    A=$(cd "$T/ws" && node "'"$ROOT"'/scripts/gate-card.js" --slug feat-jr5 2>/dev/null)
    B=$(cd "$T/ws" && node "$T/base/scripts/gate-card.js" --slug feat-jr5 2>/dev/null)
    [ -n "$A" ] || { echo "stdout moi rong"; exit 1; }
    [ "$A" = "$B" ] || { echo "report cu render KHAC ban base — duong doc-cu vo"; exit 1; }
  '

echo "P151 (JR7) persona co required_evidence + luat actionable + chong evidence-shopping"
run "P151 clauses + mutant per-clause" \
  python3 - "$ROOT/skills/acceptance/references/judge-personas.md" <<'PY'
import re, sys
s = open(sys.argv[1], encoding='utf-8').read()
clauses = [
    r'required_evidence:\s+# MANDATORY when verdict is FAIL or UNCERTAIN; omit on PASS',
    r'if this existed the verdict would change',
    r'every item must be ACTIONABLE',
    r'no evidence-shopping',
]
for c in clauses:
    m = re.search(c, s)
    assert m, f'thieu clause: {c}'
    mutated = s.replace(m.group(0), '')
    assert not re.search(c, mutated), f'detector khong phan biet ban xoa: {c}'
PY

echo "P152 (JR8) so vang: corpus that >=7 diem du 4 truong + fixture 2 chieu"
run "P152 gold points tren corpus that + fixture doi chung" \
  node - "$ROOT" <<'NODE'
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const ROOT = process.argv[2];
const real = JSON.parse(cp.execFileSync('node', [path.join(ROOT, 'scripts/acceptance-gold.mjs'), '--root', ROOT, '--json'], { encoding: 'utf8' }));
if (real.judgedBlocks <= 0) { console.error('sanity: 0 block judgment doc duoc'); process.exit(1); }
if (real.points.length < 7) { console.error('corpus that <7 diem: ' + real.points.length); process.exit(1); }
for (const p of real.points) if (!p.slug || !p.evalId || !p.machine || !p.human) { console.error('diem thieu truong: ' + JSON.stringify(p)); process.exit(1); }
const mk = (override) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jr8-'));
  const dir = path.join(root, '_acceptance', 's1'); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'evidence-report.md'),
    `---\nverdict: PASS\n---\n\n## Evidence\n- eval: EJ\n  judged_by: panel\n  verdict: FAIL\n  rationale: x\n${override ? '  human_override: Manh 2026-08-05 — dong y known-limits\n' : '  human_override:\n'}`);
  return JSON.parse(cp.execFileSync('node', [path.join(ROOT, 'scripts/acceptance-gold.mjs'), '--root', root, '--json'], { encoding: 'utf8' }));
};
const with_ = mk(true), without = mk(false);
if (with_.points.length !== 1 || with_.points[0].machine !== 'FAIL' || !/known-limits/.test(with_.points[0].human)) { console.error('fixture co override phai ra dung 1 diem: ' + JSON.stringify(with_.points)); process.exit(1); }
if (without.points.length !== 0) { console.error('fixture khong override phai 0 diem'); process.exit(1); }
// AC-8 fix S4-r2: excerpt trong block scalar KHONG duoc duc diem vang bia
const mkScalar = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jr8s-'));
  const dir = path.join(root, '_acceptance', 's1'); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'evidence-report.md'),
    `---\nverdict: PASS\n---\n\n## Evidence\n- eval: E1\n  run_id: x-001\n  exit_code: 0\n  output: |\n    trich log co chua:\n    judged_by: panel\n    verdict: FAIL\n    human_override: Ghost 2026-01-01 — diem bia tu log\n  verifier: v.sh\n`);
  return JSON.parse(cp.execFileSync('node', [path.join(ROOT, 'scripts/acceptance-gold.mjs'), '--root', root, '--json'], { encoding: 'utf8' }));
};
const scalar = mkScalar();
if (scalar.points.length !== 0) { console.error('excerpt block-scalar duc ra diem vang bia: ' + JSON.stringify(scalar.points)); process.exit(1); }
NODE

echo "P153 (JR9) G3: ma tran 3 hinh dang dong thuan + grandfather log cu + corpus that"
run "P153 agreement buckets + noPanel + corpus >=5 panel" \
  node - "$ROOT" <<'NODE'
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const ROOT = process.argv[2];
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jr9-'));
const mkws = (slug, lines) => {
  const dir = path.join(root, '_acceptance', slug); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'evidence-report.md'), '---\nverdict: PASS\n---\n');
  if (lines !== null) fs.writeFileSync(path.join(dir, 'run-log.jsonl'), lines.map(l => JSON.stringify(l)).join('\n') + '\n');
};
const panel = (id, verdicts) => ({ ts: 't', round: 1, evalId: id, kind: 'panel', proposal: 'UNCERTAIN', votes: verdicts.map((v, i) => ({ lens: 'l' + i, verdict: v })), inputs_hash: 'h' });
mkws('sA', [panel('E1', ['PASS', 'PASS', 'PASS'])]);          // 3/3
mkws('sB', [panel('E1', ['PASS', 'PASS', 'FAIL'])]);          // 2/1
mkws('sC', [panel('E1', ['PASS', 'FAIL', 'UNCERTAIN'])]);     // phan ky
mkws('sOld', null);                                            // log cu: khong run-log
const d = JSON.parse(cp.execFileSync('node', [path.join(ROOT, 'scripts/acceptance-gold.mjs'), '--root', root, '--json'], { encoding: 'utf8' }));
const b = d.agreement.buckets;
if (d.agreement.sample !== 3 || b.unanimous !== 1 || b.majority !== 1 || b.split !== 1) { console.error('buckets sai: ' + JSON.stringify(d.agreement)); process.exit(1); }
if (!d.noPanel.includes('sOld')) { console.error('grandfather: sOld phai nam trong noPanel'); process.exit(1); }
const real = JSON.parse(cp.execFileSync('node', [path.join(ROOT, 'scripts/acceptance-gold.mjs'), '--root', ROOT, '--json'], { encoding: 'utf8' }));
if (real.agreement.sample < 5) { console.error('corpus that <5 panel tuoi: ' + real.agreement.sample); process.exit(1); }
NODE

echo "P154 (JR10) lenh tong ket goi acceptance-gold + in 2 khoi tieng nguoi"
run "P154 command clauses + mutant" \
  python3 - "$ROOT/commands/acceptance-report.md" <<'PY'
import re, sys
s = open(sys.argv[1], encoding='utf-8').read()
clauses = [r'acceptance-gold\.mjs --root', r'Sổ vàng', r'đồng thuận tới đâu', r'sổ vàng chưa đọc được']
for c in clauses:
    m = re.search(c, s)
    assert m, f'thieu clause: {c}'
    assert not re.search(c, s.replace(m.group(0), '', 1)) or len(re.findall(c, s)) > 1, f'detector khong phan biet: {c}'
PY

echo "P155 (E9) tu dien biet ngu: SIGNOFF-JARGON-GLOSS subset HFL-GLOSSARY-TERMS + co muc CONTEXT.md"
run "P155 gloss marker subset + CONTEXT + mutant" \
  python3 - "$ROOT" <<'P155PY'
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
law = (root / "skills/acceptance/references/human-facing-language.md").read_text(encoding="utf-8")
ctx = (root / "CONTEXT.md").read_text(encoding="utf-8")

GLOSS_RE = r"<!-- <<<SIGNOFF-JARGON-GLOSS -->\n([\s\S]*?)<!-- SIGNOFF-JARGON-GLOSS>>> -->"
TERMS_RE = r"<!-- <<<HFL-GLOSSARY-TERMS -->\n([\s\S]*?)<!-- HFL-GLOSSARY-TERMS>>> -->"

def gloss_of(text):
    m = re.search(GLOSS_RE, text)
    if not m:
        return None
    out = {}
    for l in m.group(1).splitlines():
        l = l.strip()
        if l.startswith("- ") and " — " in l:
            term, gl = l[2:].split(" — ", 1)
            out[term.strip()] = gl.strip()
    return out

def terms_of(text):
    m = re.search(TERMS_RE, text)
    return None if not m else [l.strip()[2:].strip() for l in m.group(1).splitlines() if l.strip().startswith("- ")]

g = gloss_of(law)
assert g is not None, "KHONG rut duoc SIGNOFF-JARGON-GLOSS"
assert len(g) >= 3, "chi rut duoc %d tu — parser hong hoac khoi rong" % len(g)
MUST = ["known-limits", "dogfood", "single-source"]
missing = [x for x in MUST if x not in g]
assert not missing, "khoi gloss thieu tu bat buoc: %s" % missing
for term, gl in g.items():
    assert 3 <= len(gl.split()) <= 14, "chu giai cua '%s' dai/ngan bat thuong: %r" % (term, gl)

terms = terms_of(law)
assert terms, "KHONG rut duoc HFL-GLOSSARY-TERMS"
def check_subset(gl, tl):
    return ["gloss term ngoai HFL-GLOSSARY-TERMS: %s" % x for x in gl if x not in tl]
assert check_subset(g, terms) == [], check_subset(g, terms)

def check_ctx(glossary_text, gl):
    return ["tu '%s' chua co muc trong tu dien" % x for x in gl
            if not re.search(r"^\*\*%s\*\*:" % re.escape(x), glossary_text, re.M | re.I)]
assert check_ctx(ctx, g) == [], check_ctx(ctx, g)

mut_law = law.replace("<!-- SIGNOFF-JARGON-GLOSS>>> -->",
                      "- zzz-khong-co-that — tu bia de thu rang cua phep do\n<!-- SIGNOFF-JARGON-GLOSS>>> -->", 1)
mg = gloss_of(mut_law)
assert mg is not None and "zzz-khong-co-that" in mg, "tiem that bai — mutant khong vao duoc khoi"
assert check_subset(mg, terms_of(mut_law)) == ["gloss term ngoai HFL-GLOSSARY-TERMS: zzz-khong-co-that"], \
    "tiem term la vao gloss ma phep kiem subset khong bao — rang tu-gac"

first = MUST[0]
mut_ctx = re.sub(r"^\*\*%s\*\*:.*?(?=^\*\*|\Z)" % re.escape(first), "", ctx, count=1, flags=re.M | re.S | re.I)
assert check_ctx(mut_ctx, g) == ["tu '%s' chua co muc trong tu dien" % first], \
    "go muc CONTEXT.md that ma phep kiem khong bao thieu"
P155PY

echo "P156 (E7,E8) so vang doc tu dien: ma tran 2 surface x 2 chieu + HFL vang no to"
run "P156 khoi Tu dien round-trip + fallback" \
  python3 - "$ROOT" <<'P156PY'
import json, os, re, shutil, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
GOLD = root / "scripts/acceptance-gold.mjs"
law = (root / "skills/acceptance/references/human-facing-language.md").read_text(encoding="utf-8")

# term + chu giai rut TU MARKER THAT (khong chep tay khuon ben doc)
m = re.search(r"<!-- <<<SIGNOFF-JARGON-GLOSS -->\n([\s\S]*?)<!-- SIGNOFF-JARGON-GLOSS>>> -->", law)
assert m, "khong rut duoc SIGNOFF-JARGON-GLOSS — fixture khong dung nguon that"
gloss = {}
for l in m.group(1).splitlines():
    l = l.strip()
    if l.startswith("- ") and " — " in l:
        k, v = l[2:].split(" — ", 1)
        gloss[k.strip()] = v.strip()
assert len(gloss) >= 2, "can >=2 term de chay ma tran 2 surface"
T_HUMAN, T_ITEM = sorted(gloss)[0], sorted(gloss)[1]

def mkws(base, human_extra="", question_extra=""):
    """Sinh workspace bang CODE (khong viet tay khuon ben doc)."""
    ws = Path(base) / "_acceptance" / "vi-du-mot"
    (ws / "evidence").mkdir(parents=True, exist_ok=True)
    (ws / "contract.md").write_text(
        "---\nschema_version: 2\nfeature: \"Việc ví dụ một — mô tả cho người\"\n"
        "slug: vi-du-mot\nrisk_tier: T2\n---\n", encoding="utf-8")
    (ws / "evals.yaml").write_text(
        "evals:\n  - id: J9\n    executor: judgment\n    question: >\n      Câu hỏi chấm %s\n" % question_extra,
        encoding="utf-8")
    (ws / "evidence-report.md").write_text(
        "## Per-eval\n\n- eval: J9\n  judged_by: panel\n  proposal: UNCERTAIN\n"
        "  rationale: lý do máy nêu ngắn\n  human_override: Manh Phan 2026-08-05 — quyết giữ %s\n" % human_extra,
        encoding="utf-8")
    (ws / "run-log.jsonl").write_text("", encoding="utf-8")
    return ws

def run_gold(rootdir, script=None):
    out = subprocess.run(["node", str(script or GOLD), "--root", str(rootdir)],
                         capture_output=True, text=True)
    assert out.returncode == 0, "gold exit %d: %s" % (out.returncode, out.stderr[-400:])
    return out.stdout

def dict_block(stdout):
    """Rut cac term duoc chu giai o khoi Tu dien cua STDOUT."""
    mm = re.search(r"## Từ điển[^\n]*\n([\s\S]*)$", stdout)
    if not mm:
        return {}
    got = {}
    for l in mm.group(1).splitlines():
        l = l.strip()
        if l.startswith("- ") and " — " in l:
            k, v = l[2:].split(" — ", 1)
            got[k.strip()] = v.strip()
    return got

# --- O1: term o LOI NGUOI -> Tu dien hien, chu giai DUNG tu marker ---
with tempfile.TemporaryDirectory() as d:
    mkws(d, human_extra="theo %s" % T_HUMAN)
    got = dict_block(run_gold(d))
    assert T_HUMAN in got, "term o loi nguoi khong vao Tu dien: %s (got=%s)" % (T_HUMAN, list(got))
    assert got[T_HUMAN] == gloss[T_HUMAN], "chu giai lech marker: %r != %r" % (got[T_HUMAN], gloss[T_HUMAN])

# --- O2: term CHI o HANG MUC (cau hoi eval) -> van hien ---
with tempfile.TemporaryDirectory() as d:
    mkws(d, human_extra="quyet giu nguyen", question_extra="ve %s cua khoi nay" % T_ITEM)
    got = dict_block(run_gold(d))
    assert T_ITEM in got, "term chi o hang muc khong vao Tu dien: %s (got=%s)" % (T_ITEM, list(got))

# --- O3+O4: term KHONG xuat hien o surface nao -> KHONG in (2 chieu) ---
with tempfile.TemporaryDirectory() as d:
    mkws(d, human_extra="quyet giu nguyen", question_extra="ve mot thu khac han")
    got = dict_block(run_gold(d))
    for term in (T_HUMAN, T_ITEM):
        assert term not in got, "term khong xuat hien ma van in trong Tu dien: %s" % term

# --- AC-8: script o vi tri khong tra duoc HFL -> van in so + DUNG 1 dong ghi chu ---
NOTE = "từ điển biệt ngữ không nạp được"
with tempfile.TemporaryDirectory() as d:
    ws_base = Path(d) / "corpus"
    mkws(ws_base, human_extra="theo %s" % T_HUMAN)
    lonely = Path(d) / "roi-ra" / "acceptance-gold.mjs"
    lonely.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy(GOLD, lonely)
    out_lonely = run_gold(ws_base, script=lonely)
    assert "## Sổ vàng" in out_lonely and "Các giám khảo đồng thuận" in out_lonely, \
        "HFL vang lam mat khoi chinh cua so — phai van in du"
    assert out_lonely.count(NOTE) == 1, "HFL vang phai co DUNG 1 dong ghi chu (dem=%d)" % out_lonely.count(NOTE)
    # doi chung DUONG: o vi tri that thi KHONG co dong ghi chu
    out_real = run_gold(ws_base)
    assert NOTE not in out_real, "vi tri that ma van bao khong nap duoc tu dien"
    # ban MIRROR (plugins/) cung phai tra duoc tu dien — day la ban repo tieu
    # thu that su chay; duong dan suy tu vi tri script nen no phai dung ca hai noi
    mirror = root / "plugins/acceptance-gate/scripts/acceptance-gold.mjs"
    assert mirror.exists(), "khong thay ban mirror de kiem"
    out_mirror = run_gold(ws_base, script=mirror)
    assert NOTE not in out_mirror, "ban mirror khong tra duoc tu dien — duong dan hong o repo tieu thu"
    assert T_HUMAN in dict_block(out_mirror), "ban mirror khong in khoi Tu dien"
P156PY

echo "P157 (E2,E4,E5) ba luat ngon ngu co hoc: enum ma tran, moi goc nhin mot dong, cau trung tinh"
run "P157 verdict-vi + lens-per-line + noPanel" \
  python3 - "$ROOT" <<'P157PY'
import json, re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
GOLD = root / "scripts/acceptance-gold.mjs"
src = GOLD.read_text(encoding="utf-8")

def run_gold(rootdir):
    out = subprocess.run(["node", str(GOLD), "--root", str(rootdir)], capture_output=True, text=True)
    assert out.returncode == 0, "gold exit %d: %s" % (out.returncode, out.stderr[-400:])
    return out.stdout

def mkslug(base, slug, proposal="UNCERTAIN", contract=True, panel_votes=None):
    ws = Path(base) / "_acceptance" / slug
    ws.mkdir(parents=True, exist_ok=True)
    if contract:
        (ws / "contract.md").write_text(
            "---\nschema_version: 2\nfeature: \"Tên sản phẩm của %s — mô tả\"\nslug: %s\n---\n" % (slug, slug),
            encoding="utf-8")
    (ws / "evals.yaml").write_text("evals:\n  - id: J1\n    executor: judgment\n    question: >\n      Câu hỏi chấm cho %s\n" % slug, encoding="utf-8")
    (ws / "evidence-report.md").write_text(
        "## Per-eval\n\n- eval: J1\n  judged_by: panel\n  proposal: %s\n  rationale: lý do máy\n"
        "  human_override: Manh Phan 2026-08-05 — quyết giữ nguyên\n" % proposal, encoding="utf-8")
    if panel_votes is None:
        (ws / "run-log.jsonl").write_text("", encoding="utf-8")
    else:
        (ws / "run-log.jsonl").write_text(json.dumps(
            {"kind": "panel", "evalId": "J1", "proposal": proposal, "votes": panel_votes}) + "\n", encoding="utf-8")
    return ws

# ── (a) MA TRAN ENUM: so case = so phan tu VERDICT_VI (dem TU SOURCE) + 1 la ──
mm = re.search(r"const VERDICT_VI = \{([\s\S]*?)\}", src)
assert mm, "khong thay map VERDICT_VI trong source — luat phai dat MOT cho"
enum_pairs = re.findall(r"(\w+):\s*'([^']+)'", mm.group(1))
enum_vi = dict(enum_pairs)
enum_keys = [k for k, _ in enum_pairs]
assert len(enum_keys) >= 3, "map VERDICT_VI chi co %d phan tu" % len(enum_keys)
cases = list(enum_keys) + ["WEIRD"]
assert len(cases) == len(enum_keys) + 1, "so case phai bang so phan tu map + 1"
for code in cases:
    with tempfile.TemporaryDirectory() as d:
        mkslug(d, "vi-du", proposal=code)
        out = run_gold(d)
        row = [l for l in out.splitlines() if l.startswith("| ") and "vi-du" in l]
        assert row, "khong thay hang bang cho case %s" % code
        cell = row[0].split("|")[3].strip()
        if code == "WEIRD":
            assert cell == "WEIRD", "gia tri la phai passthrough nguyen van, got %r" % cell
        else:
            # QUAN HE map=>render: o phai bang DUNG gia tri trong VERDICT_VI cua
            # source. Ban truoc chi khop hinh dang "<chu> (MA)" nen doi mot nghia
            # trong map (vd FAIL -> "dat") van xanh — do chuoi, khong do quan he.
            want = "%s (%s)" % (enum_vi[code], code)
            assert cell == want, "enum %s phai render %r theo map trong source, got %r" % (code, want, cell)

# ── (b) MOI GOC NHIN MOT DONG: quan he so-lens-vao => so-dong-ra ──
LENSES = ["domain-correctness", "operational-feasibility", "spec-alignment"]
# hoi dong <2 phieu khong vao mau (agreement loc votes>=2), nen quet 2 va 3 lens
for n in (2, 3):
    with tempfile.TemporaryDirectory() as d:
        votes = [{"lens": LENSES[i], "verdict": "PASS" if i else "FAIL"} for i in range(n)]
        mkslug(d, "vi-du", panel_votes=votes)
        out = run_gold(d)
        lines = [l for l in out.splitlines() if re.match(r"^- .*: \d+/\d+ lần", l)]
        assert len(lines) == n, "%d goc nhin vao phai ra %d dong, got %d: %r" % (n, n, len(lines), lines)

# ── (c) noPanel: moi viec mot dong, ten san pham + fallback, khong khang dinh nguyen nhan ──
NEUTRAL_CHECK = "Sổ không suy đoán vì sao thiếu"
with tempfile.TemporaryDirectory() as d:
    mkslug(d, "co-hop-dong", contract=True)
    mkslug(d, "khong-hop-dong", contract=False)
    out = run_gold(d)
    # Do PROPERTY chu khong ghim mot chuoi: moi menh de NHAN-QUA ve du lieu
    # thieu deu vi pham AC-5. Ban truoc ghim dung 1 chuoi nen nhanh con lai
    # (khong co hoi dong nao) van khang dinh nguyen nhan ma test xanh (S4-r1).
    CAUSAL = ["chấm trước khi", "do máy chưa", "vì hồ sơ", "bởi vì"]
    for c in CAUSAL:
        assert c not in out, "sổ khang dinh nguyen nhan thieu du lieu: %r" % c
    # ...VA nhanh KHONG-CO-HOI-DONG-NAO cung phai sach (day la ca pho bien nhat
    # o repo tieu thu moi tinh) — sinh corpus rieng, khong panel o bat ky slug nao
    with tempfile.TemporaryDirectory() as d2:
        mkslug(d2, "chua-cham")
        out2 = run_gold(d2)
        for c in CAUSAL:
            assert c not in out2, "nhanh khong-co-hoi-dong-nao khang dinh nguyen nhan: %r" % c
        # doi chung DUONG: cau trung tinh MOT CHO phai co mat o CA HAI nhanh
        NEUTRAL = "Sổ không suy đoán vì sao thiếu"
        assert NEUTRAL in out2, "nhanh khong-co-hoi-dong thieu cau trung tinh"
    assert NEUTRAL_CHECK in out, "nhanh co-viec-khong-panel thieu cau trung tinh"
    # cat DUNG khoi chua-co-bien-ban (dem tren ca so se lan sang bang vang)
    mblock = re.search(r"^\d+ việc chưa có biên bản hội đồng trong hồ sơ\.[^\n]*\n([\s\S]*?)(?=\n##|\n\n|\Z)", out, re.M)
    assert mblock, "khong thay khoi chua-co-bien-ban trong STDOUT"
    items = [l for l in mblock.group(1).splitlines() if l.strip().startswith("- ")]
    assert len(items) == 2, "2 viec khong panel phai ra DUNG 2 dong, got %d: %r" % (len(items), items)
    named = [l for l in items if "Tên sản phẩm của co-hop-dong" in l]
    raw = [l for l in items if l.strip() == "- khong-hop-dong"]
    assert len(named) == 1, "slug co contract phai hien ten san pham: %r" % items
    assert len(raw) == 1, "slug thieu contract phai fallback slug tho: %r" % items
P157PY

echo "P158 (E1,E6) bang vang round-trip 4 cot + doi chung doi-gia-tri + root sai no to"
run "P158 bang vang quan he vao=>ra + fail-loud root" \
  python3 - "$ROOT" <<'P158PY'
import re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
GOLD = root / "scripts/acceptance-gold.mjs"

FIX = {"feature": "Việc mẫu số một", "question": "Câu hỏi chấm mẫu số một",
       "verdict": "FAIL", "human": "Manh Phan 2026-08-05 — quyết cho qua vì lý do mẫu"}

def mkws(base, over=None):
    """Sinh workspace bang CODE tu dict FIX (doi 1 truong = doi 1 o mong doi)."""
    f = dict(FIX); f.update(over or {})
    ws = Path(base) / "_acceptance" / "viec-mau"
    ws.mkdir(parents=True, exist_ok=True)
    (ws / "contract.md").write_text(
        "---\nschema_version: 2\nfeature: \"%s\"\nslug: viec-mau\n---\n" % f["feature"], encoding="utf-8")
    (ws / "evals.yaml").write_text(
        "evals:\n  - id: J1\n    executor: judgment\n    question: >\n      %s\n" % f["question"], encoding="utf-8")
    body = "## Per-eval\n\n- eval: J1\n  judged_by: panel\n  proposal: %s\n  rationale: lý do máy\n" % f["verdict"]
    if f["human"] is not None:
        body += "  human_override: %s\n" % f["human"]
    (ws / "evidence-report.md").write_text(body, encoding="utf-8")
    (ws / "run-log.jsonl").write_text("", encoding="utf-8")
    return f

def run_gold(rootdir, expect_ok=True):
    out = subprocess.run(["node", str(GOLD), "--root", str(rootdir)], capture_output=True, text=True)
    if expect_ok:
        assert out.returncode == 0, "gold exit %d: %s" % (out.returncode, out.stderr[-300:])
    return out

def row_of(stdout):
    rows = [l for l in stdout.splitlines() if l.startswith("| ") and "---" not in l and "Việc |" not in l]
    return None if not rows else [c.strip() for c in rows[0].strip("|").split("|")]

# ── doi chung DUONG: 1 diem vang, 4 cot khop du lieu fixture ──
with tempfile.TemporaryDirectory() as d:
    f = mkws(d)
    cells = row_of(run_gold(d).stdout)
    assert cells and len(cells) == 4, "bang phai co dung 1 hang 4 cot, got %r" % (cells,)
    assert f["feature"] in cells[0] and "viec-mau" in cells[0], "cot Viec khong khop fixture: %r" % cells[0]
    assert "J1" in cells[1] and f["question"][:20] in cells[1], "cot Hang muc khong khop fixture: %r" % cells[1]
    assert f["verdict"] in cells[2], "cot May de xuat khong khop fixture: %r" % cells[2]
    assert "Manh Phan" in cells[3] and "lý do mẫu" in cells[3], "cot Nguoi quyet khong khop fixture: %r" % cells[3]

# ── doi chung AM 1 (XOA): bo human_override -> hang bien mat ──
with tempfile.TemporaryDirectory() as d:
    mkws(d, {"human": None})
    assert row_of(run_gold(d).stdout) is None, "xoa human_override ma hang van con — duong loc hong"

# ── doi chung AM 2 (DOI GIA TRI): tung truong mot, DUNG o do phai doi theo ──
MUT = [("feature", "Việc mẫu ĐÃ ĐỔI", 0), ("question", "Câu hỏi ĐÃ ĐỔI hoàn toàn", 1),
       ("verdict", "PASS", 2), ("human", "Manh Phan 2026-08-05 — lý do ĐÃ ĐỔI hẳn", 3)]
with tempfile.TemporaryDirectory() as d:
    mkws(d)
    base_cells = row_of(run_gold(d).stdout)
for field, newval, col in MUT:
    with tempfile.TemporaryDirectory() as d:
        mkws(d, {field: newval})
        cells = row_of(run_gold(d).stdout)
        assert cells, "mutant %s lam mat hang" % field
        assert cells[col] != base_cells[col], \
            "doi truong '%s' ma cot %d KHONG doi (%r) — assert dang do chuoi-co-mat chu khong do quan he" % (field, col, cells[col])
        for other in range(4):
            if other != col:
                assert cells[other] == base_cells[other], \
                    "doi truong '%s' lam doi ca cot %d — cot khong doc lap" % (field, other)

# ── AC-6: root khong co _acceptance/ -> no to; root co _acceptance/ rong -> exit 0 ──
with tempfile.TemporaryDirectory() as d:
    out = run_gold(d, expect_ok=False)
    assert out.returncode != 0, "root khong co _acceptance/ ma van exit 0 — so rong tu tin"
    msg = (out.stderr + out.stdout)
    assert "_acceptance" in msg and str(d) in msg, "thong diep loi phai neu path va thu muc thieu: %r" % msg[-200:]
with tempfile.TemporaryDirectory() as d:
    (Path(d) / "_acceptance").mkdir()
    out = run_gold(d)
    assert out.returncode == 0, "corpus RONG hop le phai exit 0"
    assert "Sổ vàng" in out.stdout, "corpus rong phai in so trong hop le"
P158PY

echo "P159 (E3) ma tran dong thuan TOAN PHAN: 4 hinh dang x 3 chieu = 12 o"
run "P159 agreement 4x3 ke ca nhanh chan" \
  node - "$ROOT" <<'P159JS'
const path = require('path');
const ROOT = process.argv[2];
(async () => {
  const mod = await import(path.join(ROOT, 'scripts/acceptance-gold.mjs'));
  const { agreement } = mod;
  const L = ['domain-correctness', 'operational-feasibility', 'spec-alignment'];
  const v = (lens, verdict) => ({ lens, verdict });

  // MA TRAN VIET-TRUOC: 4 hinh dang x 3 chieu (bucket, lensTotal, lensUncertain).
  // Nhanh chan 2/2 la nhanh CHUA TUNG co test — dung o day no co 3 o rieng.
  const MATRIX = [
    { name: '3/3 dong y', votes: [v(L[0],'PASS'), v(L[1],'PASS'), v(L[2],'PASS')],
      bucket: 'unanimous', total: { [L[0]]:1, [L[1]]:1, [L[2]]:1 }, uncertain: {} },
    { name: '2-tren-1',   votes: [v(L[0],'PASS'), v(L[1],'PASS'), v(L[2],'FAIL')],
      bucket: 'majority',  total: { [L[0]]:1, [L[1]]:1, [L[2]]:1 }, uncertain: { [L[2]]:1 } },
    { name: 'phan ky han',votes: [v(L[0],'PASS'), v(L[1],'FAIL'), v(L[2],'UNCERTAIN')],
      bucket: 'split',     total: { [L[0]]:1, [L[1]]:1, [L[2]]:1 }, uncertain: { [L[1]]:1, [L[2]]:1 } },
    { name: 'hoa 2-2',    votes: [v(L[0],'PASS'), v(L[1],'PASS'), v(L[0],'FAIL'), v(L[1],'FAIL')],
      bucket: 'split',     total: { [L[0]]:2, [L[1]]:2 }, uncertain: { [L[0]]:1, [L[1]]:1 } },
  ];
  const DIMS = ['bucket', 'lensTotal', 'lensUncertain'];
  const expectedAsserts = MATRIX.length * DIMS.length;   // = 12, dem TU ma tran
  let ran = 0;
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  for (const row of MATRIX) {
    const g = agreement([{ slug: 's', evalId: 'J1', proposal: 'X', votes: row.votes }]);
    // chieu 1: bucket
    const hot = Object.entries(g.buckets).filter(([, n]) => n > 0).map(([k]) => k);
    if (!eq(hot, [row.bucket])) {
      console.error(`[${row.name}] bucket sai: cho ${row.bucket}, got ${JSON.stringify(g.buckets)}`);
      process.exit(1);
    }
    ran++;
    // chieu 2: lensTotal
    if (!eq(g.lensTotal, row.total)) {
      console.error(`[${row.name}] lensTotal sai: cho ${JSON.stringify(row.total)}, got ${JSON.stringify(g.lensTotal)}`);
      process.exit(1);
    }
    ran++;
    // chieu 3: lensUncertain
    if (!eq(g.lensUncertain, row.uncertain)) {
      console.error(`[${row.name}] lensUncertain sai: cho ${JSON.stringify(row.uncertain)}, got ${JSON.stringify(g.lensUncertain)}`);
      process.exit(1);
    }
    ran++;
  }
  if (ran !== expectedAsserts) {
    console.error(`ma tran chua quet du: chay ${ran}/${expectedAsserts} o`);
    process.exit(1);
  }
  // sanity: so o dem tu MA TRAN, khong phai hang so go tay
  if (expectedAsserts !== 12) {
    console.error(`ma tran doi hinh dang (${expectedAsserts} o) — cap nhat contract AC-3 truoc khi doi test`);
    process.exit(1);
  }
  console.log(`P159 OK (${ran} o ma tran, ke ca nhanh hoa 2-2)`);
})().catch(e => { console.error(e); process.exit(1); });
P159JS

echo "P160 (E10) duong doc-cu tren ho so CU + xuat xu van ban giam khao doc"
run "P160 --json hinh dang cu + provenance gold-stdout" \
  python3 - "$ROOT" <<'P160PY'
import json, re, subprocess, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
GOLD = root / "scripts/acceptance-gold.mjs"

def gold(rootdir, js=False):
    cmd = ["node", str(GOLD), "--root", str(rootdir)] + (["--json"] if js else [])
    out = subprocess.run(cmd, capture_output=True, text=True)
    assert out.returncode == 0, "gold exit %d: %s" % (out.returncode, out.stderr[-300:])
    return json.loads(out.stdout) if js else out.stdout

# ── (1) HO SO DOI CU: report khong co required_evidence, run-log khong panel,
#     block-scalar trong report — bản mới phải doc y nhu truoc (ma tran 3 hinh dang) ──
with tempfile.TemporaryDirectory() as d:
    acc = Path(d) / "_acceptance"
    # a) ho so cu co override + KHONG co dong panel
    a = acc / "ho-so-cu"; a.mkdir(parents=True)
    (a / "contract.md").write_text("---\nfeature: \"Việc đời cũ\"\nslug: ho-so-cu\n---\n", encoding="utf-8")
    (a / "evidence-report.md").write_text(
        "- eval: J1\n  judged_by: panel\n  verdict: UNCERTAIN\n  human_override: Manh Phan 2026-01-01 — cho qua\n",
        encoding="utf-8")
    (a / "run-log.jsonl").write_text('{"kind":"eval","evalId":"E1","exit_code":0}\n', encoding="utf-8")
    # b) ho so co BLOCK SCALAR chua chu human_override trong trich log -> KHONG duoc thanh diem
    b = acc / "co-block-scalar"; b.mkdir(parents=True)
    (b / "evidence-report.md").write_text(
        "- eval: J2\n  judged_by: panel\n  verdict: PASS\n  output: |\n"
        "    human_override: Ai Do 2026-01-01 — dong nay chi la trich log\n",
        encoding="utf-8")
    (b / "run-log.jsonl").write_text(
        json.dumps({"kind": "panel", "evalId": "J2", "proposal": "PASS",
                    "votes": [{"lens": "spec-alignment", "verdict": "PASS"},
                              {"lens": "domain-correctness", "verdict": "PASS"}]}) + "\n", encoding="utf-8")
    # c) panel CARRIED khong duoc dem lai
    c = acc / "co-carried"; c.mkdir(parents=True)
    (c / "evidence-report.md").write_text("- eval: J3\n  judged_by: panel\n  verdict: PASS\n", encoding="utf-8")
    (c / "run-log.jsonl").write_text(
        json.dumps({"kind": "panel", "evalId": "J3", "proposal": "PASS", "carried_from_round": 1,
                    "votes": [{"lens": "spec-alignment", "verdict": "PASS"},
                              {"lens": "domain-correctness", "verdict": "FAIL"}]}) + "\n", encoding="utf-8")
    j = gold(d, js=True)
    assert len(j["points"]) == 1, "ho so cu: cho 1 diem vang, got %d" % len(j["points"])
    assert j["points"][0]["slug"] == "ho-so-cu", "diem vang sai slug: %r" % j["points"][0]
    assert j["noPanel"] == ["ho-so-cu"], "slug khong panel phai vao noPanel, got %r" % j["noPanel"]
    assert j["agreement"]["sample"] == 1, "carried khong duoc vao mau: sample=%d" % j["agreement"]["sample"]
    assert j["agreement"]["buckets"]["unanimous"] == 1, "hoi dong 2/2 dong y phai la unanimous"

# ── (1b) DUONG DOC-CU THAT SU: so --json cua ban HIEN TAI voi ban TRUOC-DIFF
#     sinh trong CHINH lan chay (git show <base>:...). Ban truoc chi so script
#     voi CHINH NO nen khong the do duoc "parser co doi hanh vi khong" (S4-r1).
base_sha = subprocess.run(["git", "-C", str(root), "merge-base", "HEAD", "04d3413"],
                          capture_output=True, text=True)
if base_sha.returncode != 0:
    base_sha = subprocess.run(["git", "-C", str(root), "rev-parse", "04d3413"], capture_output=True, text=True)
assert base_sha.returncode == 0, "khong resolve duoc base commit: %s" % base_sha.stderr[-200:]
BASE = base_sha.stdout.strip()
show = subprocess.run(["git", "-C", str(root), "show", "%s:scripts/acceptance-gold.mjs" % BASE],
                      capture_output=True, text=True)
assert show.returncode == 0 and len(show.stdout) > 500, \
    "khong lay duoc ban TRUOC-DIFF cua script tai %s: %s" % (BASE, show.stderr[-200:])
with tempfile.TemporaryDirectory() as d:
    # dat ban base DUNG do sau trong cay lam viec de duong `..` cua no van tra
    # duoc human-facing-language.md — neu khong, khac biet se den tu duong dan
    # chu khong tu parser (do nham vat)
    base_script = root / "scripts" / ".base-acceptance-gold.tmp.mjs"
    base_script.write_text(show.stdout, encoding="utf-8")
    try:
        old_json = subprocess.run(["node", str(base_script), "--root", str(root), "--json"],
                                  capture_output=True, text=True)
        assert old_json.returncode == 0, "ban base chay loi: %s" % old_json.stderr[-300:]
        new_json = subprocess.run(["node", str(GOLD), "--root", str(root), "--json"],
                                  capture_output=True, text=True)
        assert new_json.returncode == 0, "ban moi chay loi: %s" % new_json.stderr[-300:]
        assert old_json.stdout == new_json.stdout, \
            "kenh may-doc (--json) DOI so voi ban truoc-diff — parser da doi hanh vi, khong con la duong doc-cu"
        # doi chung DUONG: hai ban PHAI phan biet duoc — tiem 1 thay doi that
        # vao ban base roi so lai; giong nhau nghia la phep do nay mu
        probe = show.stdout.replace("points.push({ slug, evalId: cur",
                                    "points.push({ slug, evalId: 'PROBE'", 1)
        assert probe != show.stdout, "tiem probe that bai — anchor doi, cap nhat phep do"
        base_script.write_text(probe, encoding="utf-8")
        probe_json = subprocess.run(["node", str(base_script), "--root", str(root), "--json"],
                                    capture_output=True, text=True)
        assert probe_json.returncode == 0 and probe_json.stdout != new_json.stdout, \
            "phep do mu: ban base BI SUA ma --json van y het ban moi"
    finally:
        base_script.unlink(missing_ok=True)

# ── (2) CORPUS THAT: quan he noi tai giua --json va van ban in ra ──
real = gold(root, js=True)
text = gold(root)
assert len(real["points"]) > 0, "corpus that 0 diem vang — sanity counter chong 0-hit-gia"
rows = [l for l in text.splitlines() if l.startswith("| ") and "---" not in l and "Việc |" not in l]
assert len(rows) == len(real["points"]), \
    "so hang bang (%d) khac so diem trong --json (%d)" % (len(rows), len(real["points"]))
lens_lines = [l for l in text.splitlines() if re.match(r"^- .*: \d+/\d+ lần", l)]
assert len(lens_lines) == len(real["agreement"]["lensTotal"]), \
    "so dong goc-nhin (%d) khac so lens trong --json (%d)" % (len(lens_lines), len(real["agreement"]["lensTotal"]))

# ── (3) XUAT XU: van ban giam khao doc phai la ban MAY VUA IN, khong phai viet tay ──
ev = root / "_acceptance/gold-output-measure/evidence/gold-stdout.txt"
assert ev.exists(), "thieu evidence/gold-stdout.txt — sinh lai bang: node scripts/acceptance-gold.mjs --root . > <file>"
saved = ev.read_text(encoding="utf-8")
# So XUAT XU truoc (judge J1-r1 doi dich danh): file ke ben ghi lenh + checksum
# + do dai; khong khop = van ban da bi sua tay sau khi may in ra.
import hashlib
pv = ev.with_name("gold-stdout.provenance.json")
assert pv.exists(), "thieu gold-stdout.provenance.json — van ban giam khao doc khong co xuat xu"
prov = json.loads(pv.read_text(encoding="utf-8"))
raw = ev.read_bytes()
assert prov.get("bytes") == len(raw), \
    "gold-stdout.txt bi sua sau khi sinh: do dai %d != %s trong ho so xuat xu" % (len(raw), prov.get("bytes"))
assert prov.get("sha256") == hashlib.sha256(raw).hexdigest(), \
    "gold-stdout.txt bi sua sau khi sinh: checksum lech ho so xuat xu"
assert "acceptance-gold.mjs" in (prov.get("command") or ""), \
    "ho so xuat xu khong ghi lenh sinh that: %r" % prov.get("command")
fresh = text
def table(s):   return [l for l in s.splitlines() if l.startswith("| ")]
def heads(s):   return [l for l in s.splitlines() if l.startswith("## ")]
def gloss(s):
    m = re.search(r"## Từ điển[^\n]*\n([\s\S]*)$", s)
    return sorted(l.strip() for l in (m.group(1).splitlines() if m else []) if l.strip().startswith("- "))
# so KHOI ON DINH (bang vang + section + tu dien). Khoi dong thuan doi moi round
# nen khong so — nhung ba khoi nay du de bat "van viet tay" va "render da doi
# ma quen sinh lai".
assert table(saved) == table(fresh), \
    "gold-stdout.txt khong phai ban may vua in: bang vang lech (saved=%d hang, fresh=%d hang)" % (len(table(saved)), len(table(fresh)))
assert heads(saved) == heads(fresh), \
    "gold-stdout.txt khong phai ban may vua in: cac muc lech %r vs %r" % (heads(saved), heads(fresh))
assert gloss(saved) == gloss(fresh), \
    "gold-stdout.txt khong phai ban may vua in: khoi Tu dien lech"
P160PY

if [ "$failures" -gt 0 ]; then
  echo
  echo "Results: $failures failed"
  exit 1
fi

echo
echo "Results: all plugin tests passed"
exit 0
