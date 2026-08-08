#!/usr/bin/env bash
# AC-9 — số version phải ĐỔI THẬT so với bản đội đang cài, và trong mỗi gói
# không manifest nào lệch.
#
# Vì sao đo bằng SO SÁNH với số cũ chứ không phải "có một con số": bài học
# "Đã mới nhất là nói dối" — `plugin update` bỏ qua khi số trùng mà nội dung
# đổi, nên một đợt sửa quên bump là một đợt đội KHÔNG BAO GIỜ nhận được.
set -u
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
v() { python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['version'])" "$ROOT/$1"; }

AG_OLD=1.39.0
FL_OLD=1.27.0
AG_FILES=".claude-plugin/plugin.json .codex-plugin/plugin.json codex/acceptance-gate/.codex-plugin/plugin.json plugins/acceptance-gate/.codex-plugin/plugin.json"
FL_FILES="feature-loop/.claude-plugin/plugin.json codex/feature-loop-codex/.codex-plugin/plugin.json plugins/feature-loop-codex/.codex-plugin/plugin.json"

rc=0
check_pkg() { # <tên gói> <số cũ> <danh sách file>
  local name="$1" old="$2" files="$3" seen="" n=0
  for f in $files; do
    [ -f "$ROOT/$f" ] || { echo "FAIL [$name]: thiếu manifest $f" >&2; rc=1; continue; }
    local cur; cur="$(v "$f")"
    echo "  $name · $f = $cur"
    n=$((n+1))
    case " $seen " in *" $cur "*) ;; *) seen="$seen $cur" ;; esac
    if [ "$cur" = "$old" ]; then
      echo "FAIL [$name]: $f vẫn là $old — số không đổi thì bản cài của đội bỏ qua bản mới dù nội dung đã đổi" >&2
      rc=1
    fi
  done
  if [ "$n" -lt 3 ]; then
    echo "FAIL [$name]: sanity — chỉ đọc được $n manifest (mong ≥3), phép đo không phủ hết gói" >&2
    rc=1
  fi
  local uniq; uniq="$(printf '%s\n' $seen | grep -c .)"
  if [ "$uniq" -ne 1 ]; then
    echo "FAIL [$name]: các manifest lệch nhau:$seen — twin/mirror phải cùng một số" >&2
    rc=1
  fi
}

echo "acceptance-gate (cũ $AG_OLD):"
check_pkg acceptance-gate "$AG_OLD" "$AG_FILES"
echo "feature-loop (cũ $FL_OLD):"
check_pkg feature-loop "$FL_OLD" "$FL_FILES"

[ "$rc" -eq 0 ] && echo "MANIFEST-BUMP OK"
exit "$rc"
