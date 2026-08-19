#!/usr/bin/env bash
# Răng hồ sơ tool-kill-duong-doc-lap — chết theo hồ sơ khi merge, không vào
# suite vĩnh viễn (nếp các bộ răng hồ sơ trước).
#
# Bốn chân, mỗi chân kèm CHIỀU ĐỎ chạy trong cùng lượt trên bản sao code-sinh
# (mutant phải CHẠY ĐƯỢC — đỏ vì vật hỏng, không vì crash). Không có chân
# canh-tồn-kho / canh-phép-đo (owner gỡ 18/08).
#   --chan nguon     : câu đặc trưng của luật xuất hiện ĐÚNG 1 lần trên toàn cây
#                      git (trừ docs/ + _acceptance/), tại file nguồn; JS/SKILL/
#                      harness 0 hit. Đỏ: tiêm bản chép vào bản sao JS.
#   --chan w25       : ghim ĐÚNG dòng ca W25 trong stdout suite workflows (nếp
#                      p194) + mã thoát + dòng tổng kết. Đỏ: bản sao răng đổi tên pin.
#   --chan skill-fl  : feature-loop SKILL S4 có --require tool-kill-rule.md +
#                      toolKillRule trong Invoke; 2 mutant (mỗi phần tử một).
#   --chan skill-acc : cắt section Phase 3 của skill acceptance (lib/md-section.cjs),
#                      ghim QUAN HỆ theo mục 1/2/4 + template BLOCKED; 4 mutant.
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 1
CHAN="${2:-}"; [ "${1:-}" = "--chan" ] || { echo "dung: rang.sh --chan nguon|w25|skill-fl|skill-acc"; exit 2; }
FAILS=0
do_fail() { echo "DO: $1"; FAILS=$((FAILS+1)); }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

RULE_FILE="skills/acceptance/references/tool-kill-rule.md"
JS="feature-loop/workflows/acceptance-verify.js"
FL_SKILL="feature-loop/skills/feature-loop/SKILL.md"
ACC_SKILL="skills/acceptance/SKILL.md"
TMPL="skills/acceptance/references/evidence-report-template.md"

# Câu đặc trưng RÚT TỪ FILE NGUỒN (dòng đầu khối, tới dấu ':'), không literal.
SIG="$(awk '/<<<TOOL-KILL-RULE/{f=1;next} /TOOL-KILL-RULE>>>/{f=0} f' "$RULE_FILE" | head -1 | cut -d: -f1)"
[ -n "$SIG" ] && [ "${#SIG}" -gt 8 ] || { do_fail "khong rut duoc cau dac trung tu $RULE_FILE"; echo "RANG-TKDDL: $FAILS loi"; exit 1; }

case "$CHAN" in
  nguon)
    # Đếm trên toàn cây git (trừ docs/ và _acceptance/), KỂ CẢ tests/ + vendor/.
    hits="$(git ls-files --cached --others --exclude-standard | grep -v -e '^docs/' -e '^_acceptance/' | xargs grep -l -F -- "$SIG" 2>/dev/null || true)"
    n="$(printf '%s\n' "$hits" | sed '/^$/d' | wc -l | tr -d ' ')"
    if [ "$n" -ne 1 ] || [ "$hits" != "$RULE_FILE" ]; then
      do_fail "cau dac trung phai xuat hien DUNG 1 file ($RULE_FILE), thay $n: $(printf '%s' "$hits" | tr '\n' ' ')"
    fi
    for f in "$JS" "$ACC_SKILL" tests/workflows/harness.mjs; do
      grep -qF -- "$SIG" "$f" && do_fail "ban chep thua: $f"
    done
    # Chiều đỏ: bản sao cây (chỉ các file liên quan) + tiêm bản chép vào JS.
    mkdir -p "$TMP/do/$(dirname "$JS")" "$TMP/do/$(dirname "$RULE_FILE")"
    cp "$RULE_FILE" "$TMP/do/$RULE_FILE"; { cat "$JS"; printf '\n// %s: ban chep thu\n' "$SIG"; } > "$TMP/do/$JS"
    m="$(grep -l -F -- "$SIG" "$TMP/do/$JS" "$TMP/do/$RULE_FILE" | wc -l | tr -d ' ')"
    if [ "$m" -eq 2 ]; then echo "  chieu do OK: ban sao JS tiem ban chep -> 2 file mang cau luat (ban chep thua: $JS)"
    else do_fail "chieu do KHONG chay: mutant tiem ban chep khong bi dem ($m)"; fi
    ;;

  w25)
    PINS=(
      "W25 rule rut tu file nguon"
      "W25 JS khong con ban chep"
      "W25 lane chay binh thuong khi co toolKillRule"
      "W25 machine prompt chua TOOL-KILL-RULE"
      "W25 ui prompt chua TOOL-KILL-RULE"
      "W25 baseline prompt chua TOOL-KILL-RULE"
      "W25 schema killedByTool"
      "W25 moi agent co schema ma-thoat deu mang rule (3 lane)"
      "W25 mutant machine: xoa rule -> chi machine do"
      "W25 mutant ui: xoa rule -> chi ui do"
      "W25 mutant baseline: xoa rule -> chi baseline do"
      "W25 so mutant = so lane, moi lane mot mutant"
      "W25 thieu toolKillRule -> BLOCKED (args)"
      "W25 toolKillRule khong marker -> BLOCKED (args)"
    )
    OUT="$(node tests/workflows/acceptance-verify.test.mjs 2>&1)"; RC=$?
    [ "$RC" -eq 0 ] || do_fail "suite exit $RC (khong duoc nuot ma thoat)"
    PASSED="$(printf '%s\n' "$OUT" | sed -n 's/^Results: \([0-9]*\) passed, \([0-9]*\) failed.*$/\1/p' | tail -1)"
    FAILED="$(printf '%s\n' "$OUT" | sed -n 's/^Results: \([0-9]*\) passed, \([0-9]*\) failed.*$/\2/p' | tail -1)"
    if [ -z "$PASSED" ] || [ -z "$FAILED" ]; then do_fail "khong doc duoc dong tong ket 'Results: N passed, M failed'"
    elif [ "$FAILED" -ne 0 ]; then do_fail "suite bao $FAILED ca do"; fi
    pin_check() { # $1 = stdout, in ra ten pin thieu (rong = du)
      local nm; for nm in "${PINS[@]}"; do printf '%s\n' "$1" | grep -qxF "  PASS: $nm" || printf '%s\n' "$nm"; done
    }
    missing="$(pin_check "$OUT")"
    [ -z "$missing" ] || while IFS= read -r nm; do do_fail "thieu dong PASS: $nm"; done <<< "$missing"
    # Chiều đỏ qua CHÍNH hàm kiểm: stdout giả trong đó một pin bị đổi tên (đuôi 'x') → phải báo thiếu đúng pin đó.
    MUT="$(printf '%s\n' "$OUT" | sed 's/^  PASS: W25 machine prompt chua TOOL-KILL-RULE$/  PASS: W25 machine prompt chua TOOL-KILL-RULEx/')"
    mm="$(pin_check "$MUT")"
    if [ "$mm" = "W25 machine prompt chua TOOL-KILL-RULE" ]; then echo "  chieu do OK: pin doi ten -> thieu dong PASS: W25 machine prompt chua TOOL-KILL-RULE"
    else do_fail "chieu do KHONG chay: pin_check tren stdout dot bien tra '$mm'"; fi
    ;;

  skill-fl)
    check_fl() { # $1 = file; in ten phan tu thieu
      grep -q -- '--require skills/acceptance/references/tool-kill-rule.md' "$1" || echo "resolve thieu --require tool-kill-rule.md"
      grep -E -q 'Invoke: `Workflow\(.*toolKillRule' "$1" || echo "Invoke thieu toolKillRule"
    }
    r="$(check_fl "$FL_SKILL")"; [ -z "$r" ] || while IFS= read -r x; do do_fail "$x"; done <<< "$r"
    # 2 mutant = 2 phần tử, mỗi mutant đỏ đúng mục.
    red=0
    sed 's/ --require skills\/acceptance\/references\/tool-kill-rule.md//' "$FL_SKILL" > "$TMP/m1.md"
    [ "$(check_fl "$TMP/m1.md")" = "resolve thieu --require tool-kill-rule.md" ] && red=$((red+1)) || do_fail "mutant 1 (go --require) khong do dung muc"
    sed 's/templatePath, toolKillRule, /templatePath, /' "$FL_SKILL" > "$TMP/m2.md"
    [ "$(check_fl "$TMP/m2.md")" = "Invoke thieu toolKillRule" ] && red=$((red+1)) || do_fail "mutant 2 (go toolKillRule) khong do dung muc"
    echo "  mutant do: $red/2"
    [ "$red" -eq 2 ] || do_fail "so mutant do $red != 2 phan tu"
    ;;

  skill-acc)
    check_acc() { # $1 = SKILL.md, $2 = template; in ten phan tu thieu
      local sec; sec="$(node -e '
        const {section}=require(process.argv[1]);const fs=require("fs");
        process.stdout.write(section(fs.readFileSync(process.argv[2],"utf8"),"Phase 3").join("\n"));' "$ROOT/lib/md-section.cjs" "$1")"
      # mục 1: từ dòng "1." tới trước dòng "2." — trỏ file + marker + VERBATIM
      local m1 m2 m4
      m1="$(printf '%s\n' "$sec" | awk '/^1\. /{f=1} /^2\. /{f=0} f')"
      m2="$(printf '%s\n' "$sec" | awk '/^2\. /{f=1} /^3\. /{f=0} f')"
      m4="$(printf '%s\n' "$sec" | awk '/^4\. /{f=1} /^4b\. |^5\. /{f=0} f')"
      printf '%s' "$m1" | grep -q 'references/tool-kill-rule.md' && printf '%s' "$m1" | grep -q 'TOOL-KILL-RULE' && printf '%s' "$m1" | grep -q 'VERBATIM' \
        || echo "Phase 3 muc 1 khong tro toi tool-kill-rule.md"
      printf '%s' "$m2" | grep -q 'killed_by_tool' && printf '%s' "$m2" | grep -q 'exit_code": null' \
        || echo "Phase 3 muc 2 thieu run-log killed_by_tool + exit_code null"
      # mục 4: CÙNG một gạch đầu dòng ("   - " tới gạch kế) chứa BLOCKED + killed + re-run
      printf '%s\n' "$m4" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{const ok=d.split(/\n\s+- /).some(b=>/BLOCKED/.test(b)&&/killed/.test(b)&&/re-run/.test(b));process.exit(ok?0:1)})' \
        || echo "Phase 3 muc 4 khong co gach dau dong BLOCKED+killed+re-run"
      grep -E -q '^- `BLOCKED`.*(TOOL killed|killed a)' "$2" || grep -A3 '^- `BLOCKED`' "$2" | grep -q 'killed' \
        || echo "template BLOCKED khong nhac tool killed"
    }
    r="$(check_acc "$ACC_SKILL" "$TMPL")"; [ -z "$r" ] || while IFS= read -r x; do do_fail "$x"; done <<< "$r"
    red=0
    sed 's#of `references/tool-kill-rule.md` VERBATIM#of the rule VERBATIM#' "$ACC_SKILL" > "$TMP/a1.md"
    [ "$(check_acc "$TMP/a1.md" "$TMPL")" = "Phase 3 muc 1 khong tro toi tool-kill-rule.md" ] && red=$((red+1)) || do_fail "mutant a1 (go con tro muc 1) khong do dung muc: $(check_acc "$TMP/a1.md" "$TMPL")"
    sed 's/"killed_by_tool": true/"kbt": true/' "$ACC_SKILL" > "$TMP/a2.md"
    [ "$(check_acc "$TMP/a2.md" "$TMPL")" = "Phase 3 muc 2 thieu run-log killed_by_tool + exit_code null" ] && red=$((red+1)) || do_fail "mutant a2 (go killed_by_tool muc 2) khong do dung muc: $(check_acc "$TMP/a2.md" "$TMPL")"
    sed 's/never a code fix and never REJECT/never REJECT/; s/remedied by a re-run/remedied by a rerun/' "$ACC_SKILL" > "$TMP/a4.md"
    [ "$(check_acc "$TMP/a4.md" "$TMPL")" = "Phase 3 muc 4 khong co gach dau dong BLOCKED+killed+re-run" ] && red=$((red+1)) || do_fail "mutant a4 (go re-run muc 4) khong do dung muc: $(check_acc "$TMP/a4.md" "$TMPL")"
    sed 's/or the TOOL killed a/or a/; s/tool timeout, not a code fix — see `tool-kill-rule.md`/tool timeout/' "$TMPL" > "$TMP/t.md"
    sed -i.bak '/^- `BLOCKED`/,/Give `reason`/{s/killed//g;}' "$TMP/t.md"
    [ "$(check_acc "$ACC_SKILL" "$TMP/t.md")" = "template BLOCKED khong nhac tool killed" ] && red=$((red+1)) || do_fail "mutant t (template) khong do dung muc: $(check_acc "$ACC_SKILL" "$TMP/t.md")"
    echo "  mutant do: $red/4"
    [ "$red" -eq 4 ] || do_fail "so mutant do $red != 4 phan tu"
    ;;
  *) echo "chan la: $CHAN"; exit 2 ;;
esac

if [ "$FAILS" -gt 0 ]; then echo "RANG-TKDDL[$CHAN]: $FAILS loi"; exit 1; fi
echo "RANG-TKDDL[$CHAN] OK"
