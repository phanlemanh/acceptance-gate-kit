#!/usr/bin/env bash
# pre-merge-check.sh — CI gate for the Acceptance-Gate Kit.
#
# Usage: pre-merge-check.sh [repo_root] [--slug <slug>]...
#
# For every feature in _acceptance/ whose contract has status
# implemented|verified|signed-off and risk_tier T2|T3:
#   - evidence-report.md must exist
#   - overall verdict must be PASS
#   - the PASS was actually gated: bypass_used not true (unless a human
#     recorded bypass_ack) and enforcement_mode not off (warn only warns)
#   - human_signoff must be non-empty
#   - (recheck: strict) the committed evidence still passes the gate's own
#     L1/L2/L3 bar, re-checked via scripts/recheck-evidence.js + lib/evidence-core.js
#     (the same core the hook runs) — catches a report hand-edited after the
#     write-time hook, or written under ACCEPTANCE_GATE_BYPASS. Default `warn`
#     only advises (so legacy reports from older templates don't block adopters);
#     `off` skips it. Set `recheck: strict` in _acceptance/config.yaml to enforce.
# Exits 1 listing violations; 0 when clean. T1 and draft/approved
# (pre-implementation) features are out of scope.
set -u

# CI evidence re-checker shipped alongside this script (needs ../lib/evidence-core.js).
HERE="$(cd "$(dirname "$0")" && pwd)"
RECHECK="$HERE/recheck-evidence.js"

ROOT="."
SLUGS=()
while [ $# -gt 0 ]; do
  case "$1" in
    --slug)
      [ $# -ge 2 ] || { echo "pre-merge-check: --slug requires a value" >&2; exit 2; }
      SLUGS+=("$2"); shift 2 ;;
    *) ROOT="$1"; shift ;;
  esac
done

ACC="$ROOT/_acceptance"
[ -d "$ACC" ] || { echo "pre-merge-check: no _acceptance/ — nothing to check"; exit 0; }

# Which tiers need a signed report before merge — from consumer config when
# present (signoff.required_for), defaulting to T2+T3.
REQUIRED_FOR="T2 T3"
# Committed-evidence re-check mode: strict (block) | warn (advise, default) | off.
# Default warn so adopting the re-check never blocks merges over reports written by
# an OLDER evidence template — a repo opts into strict once its reports meet the bar.
RECHECK_MODE="warn"
if [ -f "$ACC/config.yaml" ]; then
  cfg_req="$(sed -n 's/^[[:space:]]*required_for:[[:space:]]*//p' "$ACC/config.yaml" | head -1 | sed 's/[[:space:]]*#.*$//')"
  [ -n "$cfg_req" ] && REQUIRED_FOR="$cfg_req"
  cfg_rc="$(sed -n 's/^[[:space:]]*recheck:[[:space:]]*//p' "$ACC/config.yaml" | head -1 | sed 's/[[:space:]]*#.*$//')"
  case "$cfg_rc" in strict|warn|off) RECHECK_MODE="$cfg_rc" ;; esac
fi

fm_field() { # <file> <key> — first frontmatter-style "key: value" line, normalized:
  # trailing #-comments, surrounding quotes, and trailing whitespace stripped
  # (mirrors the hook's tolerance for quotes/comments on these lines).
  sed -n "s/^${2}:[[:space:]]*//p" "$1" | head -1 \
    | sed -e 's/[[:space:]]*#.*$//' -e 's/^["'"'"']//' -e 's/["'"'"']$//' -e 's/[[:space:]]*$//'
}

front_field() { # <file> <key> — read <key> from the LEADING --- frontmatter block only
  # (tolerates leading blank lines; a body excerpt cannot poison the read, and a
  # report with NO leading frontmatter yields empty for every field — so verdict
  # reads empty and the feature is rejected rather than trusted).
  awk '!f && NF==0 {next} !f && /^---[[:space:]]*$/ {f=1; next} !f {exit} /^---[[:space:]]*$/ {exit} {print}' "$1" \
    | sed -n "s/^${2}:[[:space:]]*//p" | head -1 \
    | sed -e 's/[[:space:]]*#.*$//' -e 's/^["'"'"']//' -e 's/["'"'"']$//' -e 's/[[:space:]]*$//'
}

violations=0
for dir in "$ACC"/*/; do
  [ -d "$dir" ] || continue
  slug="$(basename "$dir")"
  if [ ${#SLUGS[@]} -gt 0 ]; then
    found=0
    for s in "${SLUGS[@]}"; do [ "$s" = "$slug" ] && found=1; done
    [ $found -eq 1 ] || continue
  fi
  contract="$dir/contract.md"
  [ -f "$contract" ] || continue

  tier="$(fm_field "$contract" risk_tier)"
  status="$(fm_field "$contract" status)"

  [ -n "$tier" ] || continue
  case "$REQUIRED_FOR" in *"$tier"*) ;; *) continue ;; esac
  case "$status" in implemented|verified|signed-off) ;; *) continue ;; esac

  report="$dir/evidence-report.md"
  if [ ! -f "$report" ]; then
    echo "VIOLATION [$slug]: status=$status but no evidence-report.md"
    violations=$((violations+1)); continue
  fi
  # Read report fields from the leading frontmatter ONLY — same scope as the
  # provenance reads below, so a no-fence/offset-fence report can't pass verdict
  # while its provenance reads empty (would otherwise let a bypassed PASS slip).
  verdict="$(front_field "$report" verdict)"
  signoff="$(front_field "$report" human_signoff)"
  if [ "$verdict" != "PASS" ]; then
    echo "VIOLATION [$slug]: verdict=$verdict (must be PASS to merge)"
    violations=$((violations+1)); continue
  fi
  bypass="$(front_field "$report" bypass_used | tr '[:upper:]' '[:lower:]')"
  ack="$(front_field "$report" bypass_ack)"
  case "$bypass" in true|1|yes)
    if [ -n "$ack" ]; then
      echo "NOTE [$slug]: bypass_used=$bypass acknowledged (bypass_ack: $ack) — released with audit trail"
    else
      echo "VIOLATION [$slug]: bypass_used=$bypass — PASS produced with the gate bypassed (ACCEPTANCE_GATE_BYPASS); re-verify without bypass, or record bypass_ack: <name> <date> to consciously release"
      violations=$((violations+1)); continue
    fi ;;
  esac
  enf="$(front_field "$report" enforcement_mode | tr '[:upper:]' '[:lower:]')"
  case "$enf" in
    off) echo "VIOLATION [$slug]: enforcement_mode=off — gate did nothing at write time; re-verify under enforcement: strict before merge"
      violations=$((violations+1)); continue ;;
    warn) echo "WARNING [$slug]: enforcement_mode=warn — gate only warned (not blocked) when this PASS was written; evidence present but not hard-enforced" ;;
  esac
  if [ -z "$signoff" ]; then
    echo "VIOLATION [$slug]: verdict PASS but human_signoff is empty (Gate 2 pending)"
    violations=$((violations+1)); continue
  fi
  # Re-verify the COMMITTED evidence with the same core the hook runs — catches a
  # report hand-edited after the write-time hook, or written under bypass.
  if [ "$RECHECK_MODE" != off ]; then
    if [ -f "$RECHECK" ] && command -v node >/dev/null 2>&1; then
      recheck_out="$(node "$RECHECK" "$report" 2>&1)"; rc=$?
      if [ "$rc" -eq 1 ]; then
        if [ "$RECHECK_MODE" = strict ]; then label="VIOLATION"; else label="NOTE"; fi
        echo "$label [$slug]: committed evidence fails re-check (recheck: $RECHECK_MODE):"
        printf '%s\n' "$recheck_out" | sed 's/^/    /'
        if [ "$RECHECK_MODE" = strict ]; then violations=$((violations+1)); continue; fi
      elif [ "$rc" -ne 0 ]; then
        echo "NOTE [$slug]: evidence re-check unavailable (exit $rc) — ${recheck_out:-skipped}"
      fi
    else
      echo "NOTE [$slug]: evidence re-check not vendored (recheck-evidence.js/node missing) — committed-evidence bar NOT enforced"
    fi
  fi
  echo "OK [$slug]: $verdict, signed off by $signoff"
done

if [ "$violations" -gt 0 ]; then
  echo "pre-merge-check: $violations violation(s) — merge blocked"
  exit 1
fi
echo "pre-merge-check: clean"
exit 0
