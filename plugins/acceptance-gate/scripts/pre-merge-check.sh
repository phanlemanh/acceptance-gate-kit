#!/usr/bin/env bash
# pre-merge-check.sh — CI gate for the Acceptance-Gate Kit.
#
# Usage: pre-merge-check.sh [repo_root] [--slug <slug>]... [--base <ref>]
#
# --base <ref> (or env PRE_MERGE_BASE): the PR base for the T1-escape
# backstop — changed files matching risk_tiers.t3_paths, or falling outside
# t1_skip_globs, require the PR to carry _acceptance/<slug>/ artifacts.
# Without a base the backstop is skipped with a NOTE (wire it in CI, e.g.
# GitHub Actions: --base "origin/$GITHUB_BASE_REF").
#
# For every feature in _acceptance/ whose contract has status
# implemented|verified|signed-off and risk_tier T2|T3:
#   - Gate 1 was recorded: approved_by non-empty, or gate1_skipped: true
#     (the audited escape hatch — NOTEd, not blocked)
#   - evidence-report.md must exist
#   - overall verdict must be PASS
#   - the PASS was actually gated: bypass_used not true (unless a human
#     recorded bypass_ack) and enforcement_mode not off (warn only warns)
#   - human_signoff must be non-empty
#   - the evidence is not STALE: when the report carries verified_commit
#     (the tree the verifier actually ran on), no non-gate file — outside
#     _acceptance/ and not matching risk_tiers.t1_skip_globs — may have
#     changed since that commit (committed or in the working tree). A report
#     without verified_commit (older template) only gets a NOTE.
#   - (recheck: strict) the committed evidence still passes the gate's own
#     L1/L2/L3 bar, re-checked via scripts/recheck-evidence.js + lib/evidence-core.js
#     (the same core the hook runs) — catches a report hand-edited after the
#     write-time hook, or written under ACCEPTANCE_GATE_BYPASS. Default `warn`
#     only advises (so legacy reports from older templates don't block adopters);
#     `off` skips it. Set `recheck: strict` in _acceptance/config.yaml to enforce.
# Exits 1 listing violations; 0 when clean. T1 and draft/approved
# (pre-implementation) features are out of scope.
set -u

# Đếm vi phạm — khởi tạo NGAY ĐẦU, trước mọi khối có thể tăng nó. Bản trước khởi
# tạo mãi ở giữa file trong khi khối kiểm config phía trên đã `violations+1`:
# dưới `set -u` đó là lỗi shell CHÍ MẠNG, script chết giữa chừng và thoát 0 —
# một typo trong config.yaml giết TOÀN BỘ cổng (signoff, verdict, staleness,
# bypass, T1-escape) mà CI vẫn xanh. Đúng thứ false-green kit sinh ra để chặn.
violations=0

# CI evidence re-checker shipped alongside this script (needs ../lib/evidence-core.js).
HERE="$(cd "$(dirname "$0")" && pwd)"
RECHECK="$HERE/recheck-evidence.js"

ROOT="."
SLUGS=()
BASE="${PRE_MERGE_BASE:-}"
# Răng T1-escape bật mặc định. Opt-OUT chứ không phải opt-in `--pr`: acceptance-init
# đang dạy consumer truyền đúng `--base`, nên opt-in sẽ làm răng tắt IM LẶNG trên
# mọi repo tiêu thụ đang chạy — biến một sửa lỗi thành lỗ fail-open hàng loạt.
T1_ESCAPE=1
while [ $# -gt 0 ]; do
  case "$1" in
    --slug)
      [ $# -ge 2 ] || { echo "pre-merge-check: --slug requires a value" >&2; exit 2; }
      SLUGS+=("$2"); shift 2 ;;
    --base)
      [ $# -ge 2 ] || { echo "pre-merge-check: --base requires a value" >&2; exit 2; }
      BASE="$2"; shift 2 ;;
    --no-t1-escape)
      # Không nhận tham số — `reason` là hằng, giữ ranh giới "không thêm cờ nào khác".
      T1_ESCAPE=0; shift ;;
    --*)
      # Nuốt cờ lạ vào ROOT là fail-open chí tử: ROOT sai → không thấy
      # _acceptance/ → cổng thoát 0 mà KHÔNG chạy luật nào. Từ khi kit dạy
      # consumer chép tay `--no-t1-escape` vào CI, một lỗi gõ là đủ.
      echo "pre-merge-check: unknown option $1" >&2; exit 2 ;;
    *) ROOT="$1"; shift ;;
  esac
done

# lib dùng chung — CÙNG file mà scripts/gate-card.js require. pre-merge chỉ còn
# đọc config, xác định phạm vi diff, in ấn và đếm; LUẬT nằm trong lib. Bản awk
# cũ đã lệch thật: một dòng JSON hỏng mở được van thoát ở bash trong khi thẻ
# Cổng 1 loại nó (AC-13). Parity giữ bằng comment là parity không có răng.
GP_LIB="$(cd "$(dirname "$0")/.." 2>/dev/null && pwd)/lib/gap-probe.js"

ACC="$ROOT/_acceptance"
[ -d "$ACC" ] || { echo "pre-merge-check: no _acceptance/ — nothing to check"; exit 0; }

# Which tiers need a signed report before merge — from consumer config when
# present (signoff.required_for), defaulting to T2+T3.
REQUIRED_FOR="T2 T3"
# Mode luật gap-probe. Mặc định `advisory`: bỏ qua phản biện phải THẤY ĐƯỢC,
# nhưng bật kit lên không được chặn merge của repo chưa kịp làm quen. `off` là
# im hoàn toàn; `required` là chặn.
GAP_PROBE_MODE="advisory"
# Committed-evidence re-check mode: strict (block) | warn (advise, default) | off.
# Default warn so adopting the re-check never blocks merges over reports written by
# an OLDER evidence template — a repo opts into strict once its reports meet the bar.
RECHECK_MODE="warn"
# t1_skip_globs (newline-separated): file changes matching these — or living
# under _acceptance/ — do not stale the evidence (docs and gate artifacts).
# t3_paths: critical paths — the T1-escape backstop flags them hardest.
T1_GLOBS=""
T3_PATHS=""
# Human-signoff provenance knobs (signoff.*): require_human_commit demands the
# signature land in its own human-fields-only commit; agent_authors is an
# email-glob blocklist for the signoff commit's author.
REQ_HUMAN_COMMIT=""
AGENT_AUTHORS=""
if [ -f "$ACC/config.yaml" ]; then
  cfg_req="$(sed -n 's/^[[:space:]]*required_for:[[:space:]]*//p' "$ACC/config.yaml" | head -1 | sed 's/[[:space:]]*#.*$//')"
  [ -n "$cfg_req" ] && REQUIRED_FOR="$cfg_req"
  cfg_gp="$(sed -n 's/^[[:space:]]*gap_probe:[[:space:]]*//p' "$ACC/config.yaml" | head -1 \
    | sed -e 's/[[:space:]]*#.*$//' -e 's/^["'"'"']//' -e 's/["'"'"']$//' -e 's/[[:space:]]*$//' \
    | tr '[:upper:]' '[:lower:]')"
  if [ -n "$cfg_gp" ]; then
    case "$cfg_gp" in
      required|advisory|off) GAP_PROBE_MODE="$cfg_gp" ;;
      *)
        # KHÔNG âm thầm rơi về mặc định: một cổng tự tắt vì sai chính tả đúng là
        # false-green mà luật này sinh ra để chặn.
        echo "VIOLATION [config]: gap_probe: \"$cfg_gp\" không phải mode hợp lệ — dùng required | advisory | off (khoá vắng = advisory)"
        violations=$((violations+1))
        # KHÔNG rơi về advisory: cổng đã chặn bằng VIOLATION trên, nên chạy luật
        # gap-probe theo một mode ĐOÁN chỉ tạo tín hiệu sai. "Cảnh báo rồi vẫn
        # advisory" là fail-open có tiếng động — vẫn là fail-open (AC-11 v3-r2).
        GAP_PROBE_MODE="off" ;;
    esac
  fi
  cfg_rc="$(sed -n 's/^[[:space:]]*recheck:[[:space:]]*//p' "$ACC/config.yaml" | head -1 | sed 's/[[:space:]]*#.*$//')"
  case "$cfg_rc" in strict|warn|off) RECHECK_MODE="$cfg_rc" ;; esac
  T1_GLOBS="$(sed -n '/^  t1_skip_globs:/,/^  [a-zA-Z0-9_-]*:/p' "$ACC/config.yaml" \
    | sed -n 's/^[[:space:]]*-[[:space:]]*//p' \
    | sed -e 's/[[:space:]]*#.*$//' -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'\$//" -e 's/[[:space:]]*$//')"
  T3_PATHS="$(sed -n '/^  t3_paths:/,/^  [a-zA-Z0-9_-]*:/p' "$ACC/config.yaml" \
    | sed -n 's/^[[:space:]]*-[[:space:]]*//p' \
    | sed -e 's/[[:space:]]*#.*$//' -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'\$//" -e 's/[[:space:]]*$//')"
  REQ_HUMAN_COMMIT="$(sed -n 's/^[[:space:]]*require_human_commit:[[:space:]]*//p' "$ACC/config.yaml" | head -1 | sed 's/[[:space:]]*#.*$//' | tr '[:upper:]' '[:lower:]')"
  AGENT_AUTHORS="$(sed -n '/^  agent_authors:/,/^  [a-zA-Z0-9_-]*:/p' "$ACC/config.yaml" \
    | sed -n 's/^[[:space:]]*-[[:space:]]*//p' \
    | sed -e 's/[[:space:]]*#.*$//' -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'\$//" -e 's/[[:space:]]*$//')"
fi
if [ "$RECHECK_MODE" = "warn" ]; then
  # A disabled backstop must be impossible to miss: in warn mode a report
  # hand-edited AFTER the write-time hook only produces a NOTE — it does not
  # block the merge.
  echo "WARNING: committed-evidence re-check is ADVISORY ONLY (recheck: warn) — a hand-edited PASS report will NOT block merge. Set 'recheck: strict' in _acceptance/config.yaml to enforce the backstop."
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


# Mọi đường mà luật gap-probe KHÔNG chạy được đều đi qua ĐÂY. Một hàm, một
# marker, một chỗ quyết định mode — vì kênh "NOTE rồi exit 0" đã giết contract
# v1 (ledger d-114) và suýt giết v3 (gap-probe P0-2). Ở `required`, không cưỡng
# chế được nghĩa là KHÔNG cho merge: cổng không tự hạ chuẩn khi nó đang mù.
GP_NOT_ENFORCED=0
gap_probe_not_enforced() { # <lý do>
  [ "$GAP_PROBE_MODE" = "off" ] && return 0
  [ "$GP_NOT_ENFORCED" -eq 1 ] && return 0   # AC-16: ĐÚNG một dòng marker
  GP_NOT_ENFORCED=1
  echo "GAP-PROBE: NOT ENFORCED reason=$1"
  if [ "$GAP_PROBE_MODE" = "required" ]; then
    echo "VIOLATION [gap-probe]: mode required nhưng luật không cưỡng chế được — $1. Sửa nguyên nhân, hoặc hạ gap_probe xuống advisory nếu chấp nhận merge mà không có phản biện."
    violations=$((violations+1))
  else
    echo "NOTE: gap-probe không cưỡng chế được — $1 (advisory, không chặn merge)."
  fi
}

# Cùng khuôn gap_probe_not_enforced: một hàm, một marker, một chỗ quyết định.
# Hai chuỗi là HẰNG — CI grep được, và suite so bằng `grep -F` nên không ai tự
# viết cả đề lẫn đáp án. Tắt im lặng là thứ luật này sinh ra để chặn.
T1_ESCAPE_OFF=0
t1_escape_not_enforced() {
  [ "$T1_ESCAPE_OFF" -eq 1 ] && return 0
  T1_ESCAPE_OFF=1
  echo "T1-ESCAPE: NOT ENFORCED reason=push-event-no-pr-premise"
  # Marker trên là cho MÁY (CI grep). Dòng dưới là cho NGƯỜI: một người chưa
  # đọc kit phải biết LỚP NÀO tắt, VÌ SAO, và rủi ro cụ thể là gì.
  echo "NOTE: lớp đang tắt là răng T1-escape — luật đòi mọi thay đổi chạm code quan trọng phải kèm thư mục _acceptance/<slug>/ (hồ sơ nghiệm thu). Nó chỉ có nghĩa khi so một PR với nhánh đích; lần chạy này là commit đẩy thẳng nhánh chính, nơi commit hạ tầng (đóng gói bản phát hành, đồng bộ bản sao) theo thiết kế không kèm hồ sơ nào."
  echo "NOTE: rủi ro khi tắt — nếu một thay đổi chạm code quan trọng lọt vào lần chạy này, nó sẽ KHÔNG bị chặn vì thiếu hồ sơ nghiệm thu. Các luật khác vẫn chạy đủ (phản biện context sạch, chữ ký người, bằng chứng hết hạn). Muốn bật lại: bỏ cờ --no-t1-escape."
}

match_globs() { # <path> <newline-separated globs> — 0 iff any glob matches
  while IFS= read -r g; do
    [ -n "$g" ] || continue
    # unquoted $g on purpose: case PATTERN matching (globs never fs-expand here)
    case "$1" in $g) return 0 ;; esac
  done <<GLOBS
$2
GLOBS
  return 1
}

stale_files() { # <root> <commit> — files changed since <commit> (incl. working
  # tree) that are neither gate artifacts (_acceptance/) nor t1_skip_globs:
  # i.e. code the pinned evidence no longer covers. Untracked files are
  # invisible to git diff — CI runs on a committed tree, so that is moot there.
  git -C "$1" diff --name-only "$2" -- 2>/dev/null | while IFS= read -r f; do
    case "$f" in _acceptance/*|*/_acceptance/*) continue ;; esac
    match_globs "$f" "$T1_GLOBS" || printf '%s\n' "$f"
  done
}


# config.yaml 2-space lint: every kit parser (hook resolveConfigKey, the sed/awk
# here) is line/indent based — a TAB or odd indent silently breaks config:
# resolution (verifier refs stop resolving, executors vanish). Fail loudly instead.
if [ -f "$ACC/config.yaml" ]; then
  cfg_lint="$(awk '
    /\t/ { printf "line %d: TAB character\n", NR; next }
    /^[ ]*[^ #]/ {
      n = match($0, /[^ ]/) - 1
      if (n % 2 == 1) printf "line %d: odd indentation (%d spaces)\n", NR, n
    }
  ' "$ACC/config.yaml")"
  if [ -n "$cfg_lint" ]; then
    echo "VIOLATION [config]: _acceptance/config.yaml breaks the 2-space line schema (kit parsers are indent-based; use scripts/config-patch.mjs for programmatic writes):"
    printf '%s\n' "$cfg_lint" | head -5 | sed 's/^/    /'
    violations=$((violations+1))
  fi
fi

# ─── PR diff scope (hoisted) ───────────────────────────────────────────────
# Phần này trước đây chỉ được tính ở CUỐI file, trong khối T1-escape — nên mọi
# luật nằm trong vòng lặp per-slug đều không nhìn thấy diff. Luật gap-probe cần
# nó (chỉ xét slug có file trong PR), nên hoist lên đây; T1-escape bên dưới DÙNG
# LẠI ba biến này thay vì tính lại. Thông điệp giữ NGUYÊN VĂN để nội dung và thứ
# tự output không đổi.
DIFF_READY=0
DIFF_FILES=""
DIFF_SKIP_NOTE=""
if [ -z "$BASE" ]; then
  DIFF_SKIP_NOTE="no PR base given (pass --base <ref> or set PRE_MERGE_BASE; GitHub Actions: --base \"origin/\$GITHUB_BASE_REF\")"
elif ! command -v git >/dev/null 2>&1 || ! git -C "$ROOT" rev-parse --git-dir >/dev/null 2>&1; then
  DIFF_SKIP_NOTE="$ROOT is not a git repo here"
else
  BASE_SHA="$(git -C "$ROOT" rev-parse --quiet --verify "$BASE^{commit}" 2>/dev/null || true)"
  [ -z "$BASE_SHA" ] && BASE_SHA="$(git -C "$ROOT" rev-parse --quiet --verify "origin/$BASE^{commit}" 2>/dev/null || true)"
  if [ -z "$BASE_SHA" ]; then
    DIFF_SKIP_NOTE="base \"$BASE\" not resolvable in this clone"
  else
    # `rev-parse --verify` mới chỉ chứng minh OBJECT tồn tại. `git diff A...HEAD`
    # vẫn rc=128 + stdout rỗng khi KHÔNG có merge-base (clone shallow/grafted,
    # lịch sử rời nhau, base bị force-push). Nuốt rc ở đây là tai hoạ: script
    # tin phạm vi "đã biết và RỖNG" → gap-probe không bao giờ nổ, T1-escape
    # không thấy gì, NOTE bỏ-qua không in, và guard fail-closed của CI (grep
    # "skipped") bị vượt luôn. Mù thì phải KHAI là mù.
    if DIFF_FILES="$(git -C "$ROOT" diff --name-only "$BASE_SHA...HEAD" -- 2>/dev/null)"; then
      DIFF_READY=1
    else
      DIFF_FILES=""
      DIFF_SKIP_NOTE="git diff \"$BASE\"...HEAD failed (no merge base? shallow/grafted clone, unrelated history, force-pushed base)"
    fi
  fi
fi

# 0 iff PR đổi ít nhất một file dưới _acceptance/<slug>/. NEO `^` là bắt buộc:
# fixture ở tests/.../_acceptance/<slug>/ KHÔNG phải artifact của slug đó — glob
# chưa neo chính là lỗ README đang ghi cho khối T1-escape bên dưới.
# 0 iff PR đổi ít nhất một file dưới _acceptance/<slug>/.
# Path của `git diff` LUÔN tương đối với git top-level, KHÔNG phải với $ROOT —
# nên chỉ neo `^` là giả định ROOT == git root, và repo có `_acceptance/` nằm
# sâu (monorepo: pkg/_acceptance/) sẽ thấy luật TẮT im lặng. Dùng đúng idiom mà
# stale_files() và khối T1-escape trong file này vẫn dùng: chấp cả hai hình
# dạng. Vẫn chặn được fixture rác vì đòi khớp trọn `_acceptance/<slug>/`.
slug_in_diff() { # <slug>
  [ "$DIFF_READY" -eq 1 ] || return 1
  while IFS= read -r f; do
    [ -n "$f" ] || continue
    case "$f" in
      _acceptance/"$1"/*|*/_acceptance/"$1"/*) return 0 ;;
    esac
  done <<SLUGDIFF
$DIFF_FILES
SLUGDIFF
  return 1
}

# AC-12 nửa sau: không có base thì luật không xác định được phạm vi, nên bỏ qua
# — nhưng bỏ qua phải THẤY ĐƯỢC (cùng lối với răng T1-escape bên dưới).
if [ "$GAP_PROBE_MODE" != "off" ] && [ "$DIFF_READY" -eq 0 ]; then
  gap_probe_not_enforced "$DIFF_SKIP_NOTE (luật chỉ xét slug có file trong diff PR)"
fi

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

  # Gate 1 must have been recorded BEFORE any post-approval status: a contract
  # that reached implemented+ with an empty approved_by jumped the gate. The
  # explicit user skip (gate1_skipped: true) is tolerated but NOTEd (audit).
  approved_by="$(front_field "$contract" approved_by)"
  g1skip="$(front_field "$contract" gate1_skipped | tr '[:upper:]' '[:lower:]')"
  if [ -z "$approved_by" ]; then
    case "$g1skip" in
      true|1|yes)
        echo "NOTE [$slug]: gate1_skipped: true — user explicitly skipped Gate 1 (approved_by empty tolerated, audit trail)" ;;
      *)
        echo "VIOLATION [$slug]: status=$status but approved_by is empty and gate1_skipped is not true — Gate 1 approval was never recorded (contract skipped the gate)"
        violations=$((violations+1)); continue ;;
    esac
  fi

  # Cross-layer pairing teeth (wave 2): a gated feature whose contract tags a
  # criterion (cross-layer) MUST pair it with >=1 eval declaring
  # layer: backend-effect in evals.yaml — otherwise this merge would ride on
  # UI-only evidence for a UI→API→backend path. Write-time stays advisory
  # (lint W4); this is the merge-boundary backstop for every runtime.
  # Fail-open: evals.yaml missing → NOTE, never a block.
  # `## Criteria` runs until the next H1/H2 — a `### nhóm phụ` inside it is
  # content, not a boundary. Exiting on any heading truncated the scan and every
  # AC after the first sub-heading went untagged (teeth silently off).
  xl_acs="$(awk '/^#/ && !/^###/ {insec=0} tolower($0) ~ /^##[[:space:]]+criteria/{insec=1; next} insec && tolower($0) ~ /^[[:space:]]*[-*].*\(cross-layer\)/ { if (match($0, /AC-[0-9]+/)) print substr($0, RSTART, RLENGTH) }' "$contract" | sort -u)"
  if [ -n "$xl_acs" ]; then
    if [ ! -f "${dir}evals.yaml" ]; then
      echo "NOTE [$slug]: cross-layer criteria declared but no evals.yaml — pairing unverifiable (fail-open)"
    else
      # Buffer per eval block then flush: `layer:` may appear BEFORE `criterion:`
      # in a hand-written evals.yaml — printing at layer-time would miss those.
      # A YAML mapping key REQUIRES whitespace (or EOL) after its colon — that
      # alone separates `- id: E1` (opens a block) from a `paths:` glob like
      # `- api:v2/**` (a list item, colon glued to the value). Do NOT whitelist
      # key names here: a block opening on an unlisted key would fail to flush,
      # leaking the previous block's `layer:` onto it — false-green, the exact
      # failure these teeth exist to stop. Open wide, discriminate on syntax.
      xl_paired="$(awk '
        function flush() { if (lay=="backend-effect" && crit!="") print crit }
        tolower($0) ~ /^[[:space:]]*-[[:space:]]*[a-z_]+:([[:space:]]|$)/ { flush(); crit=""; lay="" }
        tolower($0) ~ /^[[:space:]]*(-[[:space:]]*)?criterion:[[:space:]]*/ {v=$0; sub(/^[^:]*:[[:space:]]*/,"",v); gsub(/["'\'']/,"",v); sub(/[[:space:]]+#.*$/,"",v); sub(/[[:space:]]+$/,"",v); crit=v}
        tolower($0) ~ /^[[:space:]]*(-[[:space:]]*)?layer:[[:space:]]*/ {v=tolower($0); sub(/^[^:]*:[[:space:]]*/,"",v); gsub(/["'\'']/,"",v); sub(/[[:space:]]+#.*$/,"",v); sub(/[[:space:]]+$/,"",v); lay=v}
        END { flush() }
      ' "${dir}evals.yaml" | sort -u)"
      while IFS= read -r xac; do
        [ -n "$xac" ] || continue
        if ! printf '%s\n' "$xl_paired" | grep -qx "$xac"; then
          echo "VIOLATION [$slug]: $xac is tagged (cross-layer) but no eval of it declares layer: backend-effect — a cross-layer criterion would merge on UI-only evidence; add the paired test/script eval, or untag it with the human's signoff at Gate 1"
          violations=$((violations+1))
        fi
      done <<XLACS
$xl_acs
XLACS
    fi
  fi

  # ─── Gap-probe presence (phản biện context sạch) ─────────────────────────
  # Vị trí có chủ đích: SAU hai bước lọc `REQUIRED_FOR` và `status implemented+`
  # phía trên, nên AC-4 (T1) và AC-10 (draft/approved) đúng theo CẤU TRÚC chứ
  # không nhờ một nhánh if riêng. Chỉ xét slug có file trong diff PR: quét cả
  # `_acceptance/` khiến repo có lịch sử nhận hàng chục VIOLATION không liên
  # quan diff ở PR đầu tiên rồi tắt luật (Cổng 1 2026-07-26, ledger d-116).
  if [ "$GAP_PROBE_MODE" != "off" ] && slug_in_diff "$slug"; then
    gp_fix='Chạy bước S1#7 (phản biện context sạch) để sinh gap-probe.md, HOẶC ghi vào decisions.jsonl một entry {"id":"d-<UTC>-<rand>","type":"descope","stage":"S1","at":"<ISO>","decision":"bỏ gap-probe — <lý do>","impact":"đổi lại không có phản biện context sạch trước duyệt"}'
    # front_field CHỈ đọc khối --- ĐẦU file: một dòng `verdict:` nằm trong thân
    # bài (vd trích trong bảng finding) không được tính, và `touch` file rỗng cho
    # chuỗi rỗng nên rơi vào nhánh "thiếu". Đó là chốt chống bypass.
    gp_line=""
    if [ -f "$GP_LIB" ] && command -v node >/dev/null 2>&1; then
      gp_line="$(node "$GP_LIB" classify "$dir" 2>/dev/null || true)"
    fi
    if [ -z "$gp_line" ]; then
      if ! command -v node >/dev/null 2>&1; then
        gap_probe_not_enforced "không có \`node\` trên máy chạy pre-merge"
      elif [ ! -f "$GP_LIB" ]; then
        gap_probe_not_enforced "thiếu $GP_LIB (mang cổng vào repo phải copy CẢ lib/)"
      else
        gap_probe_not_enforced "node lib/gap-probe.js classify thất bại trên $slug"
      fi
    else
      gp_outcome="${gp_line%%	*}"
      gp_id="${gp_line#*	}"
      case "$gp_outcome" in
        ok) : ;;
        probe-failed)
          echo "NOTE [$slug]: gap-probe verdict là probe-failed — phản biện KHÔNG chạy được. Merge lúc này nghĩa là merge mà chưa có phản biện context sạch; chạy lại S1#7 nếu muốn có, hoặc chấp nhận rủi ro đó." ;;
        descoped)
          echo "NOTE [$slug]: phản biện context sạch đã được BỎ có chủ đích theo ledger $gp_id — quyết định có dấu vết, không phải sơ suất." ;;
        *)
          if [ "$GAP_PROBE_MODE" = "required" ]; then
            echo "VIOLATION [$slug]: chưa qua phản biện context sạch (gap-probe) — không có gap-probe.md hợp lệ và ledger không có entry descope. $gp_fix"
            violations=$((violations+1))
          else
            echo "NOTE [$slug]: chưa qua phản biện context sạch (gap-probe) — advisory, không chặn merge. $gp_fix"
          fi ;;
      esac
    fi
  fi

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
  # Human-signoff provenance: the signature is text in an AI-writable file —
  # the git history of the commit that INTRODUCED it is the only
  # machine-checkable attribution. Standard flow: verify commits the
  # machine-written report first; the reviewer lands the signature in its own
  # commit touching only human-owned lines (human_signoff / human_override /
  # verdict upgrade / bypass_ack). Comment-only and blank +/- lines tolerated.
  if [ "$REQ_HUMAN_COMMIT" = "true" ] || [ -n "$AGENT_AUTHORS" ]; then
    if ! command -v git >/dev/null 2>&1 || ! git -C "$ROOT" rev-parse --git-dir >/dev/null 2>&1; then
      echo "NOTE [$slug]: signoff provenance unverifiable — $ROOT is not a git repo here (signoff.require_human_commit/agent_authors set)"
    else
      rel_report="${report#"$ROOT"/}"
      sign_commit="$(git -C "$ROOT" log --format=%H -S"human_signoff: $signoff" -- "$rel_report" 2>/dev/null | head -1)"
      [ -z "$sign_commit" ] && sign_commit="$(git -C "$ROOT" log --format=%H -S"$signoff" -- "$rel_report" 2>/dev/null | head -1)"
      if [ -z "$sign_commit" ]; then
        if [ "$REQ_HUMAN_COMMIT" = "true" ]; then
          echo "VIOLATION [$slug]: human_signoff present but not found in any commit of $rel_report — the reviewer must COMMIT the signoff themselves (signoff.require_human_commit)"
          violations=$((violations+1)); continue
        fi
      else
        if [ -n "$AGENT_AUTHORS" ]; then
          author="$(git -C "$ROOT" log -1 --format=%ae "$sign_commit" 2>/dev/null)"
          hit=""
          while IFS= read -r g; do
            [ -n "$g" ] || continue
            case "$author" in $g) hit="$g" ;; esac
          done <<GLOBS2
$AGENT_AUTHORS
GLOBS2
          if [ -n "$hit" ]; then
            echo "VIOLATION [$slug]: signoff commit $sign_commit authored by \"$author\" — matches signoff.agent_authors blocklist ($hit); Gate 2 must be signed by a human identity"
            violations=$((violations+1)); continue
          fi
        fi
        if [ "$REQ_HUMAN_COMMIT" = "true" ]; then
          nonhuman="$(git -C "$ROOT" show --format= --unified=0 "$sign_commit" -- "$rel_report" 2>/dev/null \
            | grep -E '^[+-]' | grep -vE '^(\+\+\+|---)' \
            | grep -vE '^[+-][[:space:]]*((human_signoff|human_override|verdict|bypass_ack)[[:space:]]*:|#|$)')"
          if [ -n "$nonhuman" ]; then
            echo "VIOLATION [$slug]: the commit introducing human_signoff ($sign_commit) also edits the report body — the Gate-2 signature must land in its own human-fields-only commit (signoff.require_human_commit). Offending lines:"
            printf '%s\n' "$nonhuman" | head -5 | sed 's/^/    /'
            violations=$((violations+1)); continue
          fi
        fi
      fi
    fi
  fi
  # Stale-evidence check: the PASS certifies the tree at verified_commit. Any
  # non-gate file changed since then (committed or working tree) means the code
  # being merged is NOT the code that was verified — re-verify, don't ride old
  # evidence. Reports without the field (older template) and clones where the
  # commit is unreachable (rebase/squash/shallow fetch) only get a NOTE.
  vc="$(front_field "$report" verified_commit)"
  if [ -z "$vc" ]; then
    echo "NOTE [$slug]: report has no verified_commit (older template) — evidence is not pinned to a commit; code drift since verify is NOT machine-checked. Re-verify to pin."
  elif ! command -v git >/dev/null 2>&1 || ! git -C "$ROOT" rev-parse --git-dir >/dev/null 2>&1; then
    echo "NOTE [$slug]: verified_commit present but $ROOT is not a git repo here — staleness unverifiable"
  elif ! git -C "$ROOT" rev-parse --quiet --verify "$vc^{commit}" >/dev/null 2>&1; then
    echo "NOTE [$slug]: verified_commit $vc not found in this clone (rebase/squash or shallow fetch?) — staleness unverifiable; re-verify to re-pin"
  else
    stale="$(stale_files "$ROOT" "$vc")"
    if [ -n "$stale" ]; then
      echo "VIOLATION [$slug]: evidence is stale — code changed after verify (verified_commit $vc); re-run verify before merge. Changed:"
      printf '%s\n' "$stale" | head -10 | sed 's/^/    /'
      violations=$((violations+1)); continue
    fi
  fi
  # run-log presence: the re-check below reconciles report run_ids against
  # _acceptance/<slug>/run-log.jsonl (machine-written at verify). A missing log
  # (older verify flow) is tolerated but must be visible.
  if [ ! -f "$dir/run-log.jsonl" ]; then
    echo "NOTE [$slug]: no run-log.jsonl (older verify flow) — run_id provenance is not machine-logged; report run_ids are unreconciled. Re-verify to generate the log."
  fi
  # observed (schema v2): older reports with screenshot evidence never faced the
  # inspected-frames bar — tolerated, but must be visible.
  sv="$(front_field "$report" schema_version)"
  case "$sv" in (*[!0-9]*|'') sv=1 ;; esac
  if [ "$sv" -lt 2 ] \
     && grep -qiE '^[[:space:]]*screenshot[[:space:]]*[:=]' "$report" \
     && ! grep -qiE '^[[:space:]]*observed[[:space:]]*[:=]' "$report"; then
    echo "NOTE [$slug]: schema v$sv report has screenshot evidence without observed: — frame inspection was not machine-enforced for this report. Re-verify with template v2 to enforce."
  fi
  # network truth (wave 1, advisory): a claim-bearing network_observed (clean /
  # app-fail) must have its dump file on disk — vocab without evidence is NOTEd,
  # never blocked (nothing network-related is hook-enforced until schema v3).
  net_missing=0
  while IFS= read -r eid; do
    [ -n "$eid" ] || continue
    [ -f "$dir/evidence/${eid}-network.txt" ] || net_missing=$((net_missing+1))
  done <<NETIDS
$(awk 'tolower($0) ~ /^[[:space:]]*-[[:space:]]*eval:/ {id=$NF} tolower($0) ~ /^[[:space:]]*network_observed[[:space:]]*[:=][[:space:]]*["'\''"]?(clean|app-fail)($|[^a-z-])/ {print id}' "$report")
NETIDS
  if [ "$net_missing" -gt 0 ]; then
    echo "NOTE [$slug]: $net_missing network_observed claim(s) (clean/app-fail) with no evidence/E{id}-network.txt on disk — vocab without a dump file (advisory until schema v3)"
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

# ── T1-escape backstop (PR-level) ────────────────────────────────────────────
# T1 is self-declared at Phase 0 from EXPECTED paths — nothing stops a "docs
# typo" PR from also touching src/billing/. With a PR base: changed files
# matching t3_paths — or falling outside t1_skip_globs — require the PR to
# carry _acceptance/<slug>/ artifacts. (Under the stale-evidence rule every
# gated PR re-verifies, so its diff always includes gate artifacts.) There is
# no path→slug mapping, so "carries artifacts" means any _acceptance/ change;
# the per-slug checks above judge their quality.
if [ "$T1_ESCAPE" -eq 0 ]; then
  t1_escape_not_enforced
elif [ "$DIFF_READY" -eq 0 ]; then
  echo "NOTE: T1-escape backstop skipped — $DIFF_SKIP_NOTE"
else
  changed="$DIFF_FILES"
  gate_touched=0; t3_hits=""; nont1_hits=""
  while IFS= read -r f; do
    [ -n "$f" ] || continue
    case "$f" in _acceptance/*|*/_acceptance/*) gate_touched=1; continue ;; esac
    if [ -n "$T3_PATHS" ] && match_globs "$f" "$T3_PATHS"; then
      t3_hits="${t3_hits}${f}"$'\n'
    elif ! match_globs "$f" "$T1_GLOBS"; then
      nont1_hits="${nont1_hits}${f}"$'\n'
    fi
  done <<CHANGED
$changed
CHANGED
  if [ "$gate_touched" -eq 0 ]; then
    if [ -n "$t3_hits" ]; then
      echo "VIOLATION [PR]: T3 paths (t3_paths) changed but the PR carries NO _acceptance/<slug>/ artifacts — critical code changed without the gate. Changed:"
      printf '%s' "$t3_hits" | head -10 | sed 's/^/    /'
      violations=$((violations+1))
    elif [ -n "$nont1_hits" ]; then
      echo "VIOLATION [PR]: non-T1 files changed (outside t1_skip_globs) but the PR carries NO _acceptance/<slug>/ artifacts — declare T1 honestly (t1_skip_globs) or run the gate. Changed:"
      printf '%s' "$nont1_hits" | head -10 | sed 's/^/    /'
      violations=$((violations+1))
    fi
  fi
fi

# AC-16 vế sau: dòng tổng kết PHẢI khai là luật đã tắt. Một marker lẻ giữa hàng
# chục dòng output là thứ người đọc lướt qua; khai ở dòng cuối thì không.
[ "$GP_NOT_ENFORCED" -eq 1 ] && echo "pre-merge-check: gap-probe: KHÔNG cưỡng chế trong lần chạy này (xem dòng marker NOT ENFORCED ở trên)"
[ "$T1_ESCAPE_OFF" -eq 1 ] && echo "pre-merge-check: T1-escape: KHÔNG cưỡng chế trong lần chạy này (xem dòng marker NOT ENFORCED ở trên)"

if [ "$violations" -gt 0 ]; then
  echo "pre-merge-check: $violations violation(s) — merge blocked"
  exit 1
fi
echo "pre-merge-check: clean"
exit 0
