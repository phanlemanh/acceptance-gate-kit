# Gap-Probe Presence at the Merge Boundary — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `scripts/pre-merge-check.sh` chặn (mode `required`) hoặc nhắc (`advisory`) khi một feature T2/T3 đã `implemented+` và **có file trong diff PR** chưa qua phản biện context sạch — thiếu `gap-probe.md` và thiếu entry ledger `descope`.

**Architecture:** Luật sống trong vòng lặp per-slug SẴN CÓ của `pre-merge-check.sh`, đặt SAU hai bước lọc `REQUIRED_FOR` và `status implemented+`. Nhờ vậy AC-4 (T1 không xét) và AC-10 (draft/approved không xét) đúng theo **cấu trúc**, không cần nhánh `if` riêng — cùng hình dạng với răng cặp-eval cross-layer đã có. Một refactor bắt buộc đi trước: phần resolve base PR hiện nằm ở CUỐI file (sau vòng lặp), phải hoist lên trước để luật mới nhìn thấy diff.

**Tech Stack:** bash (POSIX-ish, không dependency mới), `awk`/`sed`/`grep`. Test: `tests/scripts/run-tests.sh`.

## Global Constraints

- **MỌI assertion mới phải CHỨNG MINH BIẾT ĐỎ.** Tiêm vi phạm → thấy fail đúng thông điệp → gỡ ra → thấy xanh lại. Feature v1 có **4 lần test xanh RỖNG** (fixture sai path nên hook không hề chạy; `$(...)` nuốt newline làm frontmatter hỏng; `split()` trích ra chuỗi rác). Một case chỉ assert exit code KHÔNG phân biệt được "đúng" với "không chạy" — mọi case phải có thêm một assertion về NỘI DUNG stdout.
- **CẤM `$(...)` để nối nội dung file có frontmatter.** Command substitution nuốt newline cuối → `---## Notes` → frontmatter hỏng → luật không chạy → case xanh rỗng. Dùng `printf '%s\n'` hoặc heredoc.
- **KHÔNG hand-roll parser mới.** Đọc frontmatter dùng `front_field <file> <key>` sẵn có (dòng ~105) — nó chỉ đọc khối `---` ĐẦU file, quote-aware, strip comment đuôi dòng. Repo đã trả giá vì copy-paste parser 4 nơi (bug section-scan phải vá 4 lần ở 1.20.1).
- **Luật khớp descope phải giống hệt `scripts/gate-card.js:203`** (`/^\s*bỏ gap-probe/i`). Lệch nhau = hai tín hiệu Cổng 1 mâu thuẫn trên cùng artifact — đúng lỗi F4 của vòng verify trước.
- **Glob path phải NEO repo-root** (`^_acceptance/<slug>/`). README đã ghi lỗ "glob chưa neo" của chính file này; đừng đẻ thêm cái thứ hai.
- **`scripts/pre-merge-check.sh` là `t3_paths`** → mọi thay đổi phải kèm test.
- **Verify per-task:** `bash tests/scripts/run-tests.sh`. **Verify cuối:** 3 suite + `bash scripts/sync-plugin-packages.sh --check`.
- **TDD:** viết test RED trước, CHẠY cho thấy đỏ, rồi mới implement.

## File Structure

| File | Trách nhiệm | Thay đổi |
|---|---|---|
| `scripts/pre-merge-check.sh` | Toàn bộ luật (bash, một chỗ duy nhất) | Hoist diff-scope + 2 helper + 1 khối luật trong vòng lặp |
| `tests/scripts/run-tests.sh` | Bằng chứng cho 12 AC | Thêm case `GP1`–`GP13` |
| `_acceptance/gap-probe-presence-hook/evidence/premerge-messages.txt` | Input cho judge E9 | Sinh từ stdout thật |

Cả 6 task đụng cùng `pre-merge-check.sh` → **không task nào `independent: true`**; chạy tuần tự.

---

### Task 1: Hoist diff-scope lên trước vòng lặp per-slug

**Files:**
- Modify: `scripts/pre-merge-check.sh` (thêm khối trước `for dir in "$ACC"/*/;`, sửa khối T1-escape ở cuối)
- Test: `tests/scripts/run-tests.sh`

**Evals phục vụ:** chuẩn bị hạ tầng cho E1 + E13. **independent: false.**

**Interfaces:**
- Produces: 3 biến global — `DIFF_READY` (`0|1`), `DIFF_FILES` (danh sách path repo-relative, ngăn bằng newline), `DIFF_SKIP_NOTE` (lý do không có diff, nguyên văn như thông điệp cũ). Và hàm `slug_in_diff <slug>` → exit 0 iff có path khớp `^_acceptance/<slug>/`.

- [ ] **Step 1: Viết case RED cho helper `slug_in_diff`**

Chèn vào `tests/scripts/run-tests.sh`, NGAY TRƯỚC dòng `echo ""` cuối cùng (khối in `Results:`):

```bash
# ─── Gap-probe presence at the merge boundary (GP*) ─────────────────────────
GPR="$T/gp"
mk_gp_repo() { # <case> — repo git tối thiểu, trả BASE sha qua GP_BASE
  local R="$GPR/$1"; rm -rf "$R"; mkdir -p "$R/_acceptance" "$R/src"
  git -C "$R" init -q 2>/dev/null || { git init -q "$R"; }
  printf 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n  t3_paths:\n    - "src/**"\n' \
    > "$R/_acceptance/config.yaml"
  printf 'v1\n' > "$R/src/app.js"
  git -C "$R" add -A >/dev/null
  git -c user.email=t@t -c user.name=t -C "$R" commit -qm base
  GP_BASE="$(git -C "$R" rev-parse HEAD)"
}
# gp_feature <root> <slug> <tier> <status>
gp_feature() {
  local d="$1/_acceptance/$2"; mkdir -p "$d"
  printf -- '---\nschema_version: 1\nfeature: %s\nslug: %s\nrisk_tier: %s\nsurfaces: [api]\nstatus: %s\napproved_by: Manh Phan\napproved_at: 2026-06-10\n---\n' \
    "$2" "$2" "$3" "$4" > "$d/contract.md"
}
gp_commit() { git -C "$1" add -A >/dev/null; git -c user.email=t@t -c user.name=t -C "$1" commit -qm change; }

echo "GP0 slug_in_diff neo repo-root: fixture ngoài _acceptance/<slug>/ KHÔNG được tính"
mk_gp_repo gp0; R="$GPR/gp0"
gp_feature "$R" feat-a T3 implemented
mkdir -p "$R/tests/fixtures/_acceptance/feat-a"; printf 'x\n' > "$R/tests/fixtures/_acceptance/feat-a/contract.md"
printf 'v2\n' >> "$R/src/app.js"; gp_commit "$R"
GP0OUT="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"
case "$GP0OUT" in *"DIFF_READY"*) check GP0 0 1 ;; *) check GP0 0 0 ;; esac
```

- [ ] **Step 2: Chạy để thấy hành vi hiện tại**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "GP0|Results:"`
Expected: `GP0` PASS (chưa có gì in `DIFF_READY`) — đây là case-khung, giá trị thật của nó đến ở Task 3+. **Nếu FAIL thì dừng**, đọc lỗi.

- [ ] **Step 3: Hoist khối resolve diff lên trước vòng lặp**

Trong `scripts/pre-merge-check.sh`, chèn NGAY TRƯỚC dòng `for dir in "$ACC"/*/;`:

```bash
# ─── PR diff scope (hoisted) ───────────────────────────────────────────────
# Trước đây phần này chỉ được tính ở CUỐI file, trong khối T1-escape — nên luật
# nào nằm trong vòng lặp per-slug cũng không nhìn thấy diff. Luật gap-probe cần
# nó (chỉ xét slug có file trong PR), nên hoist lên đây và để T1-escape dùng
# lại. Thông điệp giữ NGUYÊN VĂN để thứ tự và nội dung output không đổi.
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
    DIFF_FILES="$(git -C "$ROOT" diff --name-only "$BASE_SHA...HEAD" -- 2>/dev/null)"
    DIFF_READY=1
  fi
fi

# 0 iff PR đổi ít nhất một file dưới _acceptance/<slug>/. NEO `^` là bắt buộc:
# một fixture ở tests/…/_acceptance/<slug>/ KHÔNG phải artifact của slug đó, và
# glob chưa neo chính là lỗ README đang ghi cho khối T1-escape bên dưới.
slug_in_diff() { # <slug>
  [ "$DIFF_READY" -eq 1 ] || return 1
  printf '%s\n' "$DIFF_FILES" | grep -q "^_acceptance/$1/"
}
```

- [ ] **Step 4: Cho T1-escape dùng lại, không tính lại**

Thay TOÀN BỘ khối bắt đầu bằng `if [ -z "$BASE" ]; then` và dòng `echo "NOTE: T1-escape backstop skipped — no PR base given...` ở cuối file bằng:

```bash
if [ "$DIFF_READY" -eq 0 ]; then
  echo "NOTE: T1-escape backstop skipped — $DIFF_SKIP_NOTE"
else
    changed="$DIFF_FILES"
    gate_touched=0; t3_hits=""; nont1_hits=""
```

Giữ NGUYÊN phần thân từ `while IFS= read -r f; do` trở xuống, và xoá hai dòng `else`/`fi` thừa của cascade cũ sao cho khối vẫn cân bằng. Kiểm cú pháp ngay: `bash -n scripts/pre-merge-check.sh`.

- [ ] **Step 5: Chứng minh refactor không đổi hành vi T1-escape**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "^B0|Results:"`
Expected: `B01`…`B06` đều PASS (6 case của răng T1-escape), `Results: 239 passed, 0 failed`.

- [ ] **Step 6: Commit**

```bash
git add scripts/pre-merge-check.sh tests/scripts/run-tests.sh
git commit -m "refactor(pre-merge): hoist diff-scope lên trước vòng lặp per-slug + helper slug_in_diff"
```

---

### Task 2: Đọc mode `gap_probe` từ config, fail-loud khi giá trị lạ

**Files:**
- Modify: `scripts/pre-merge-check.sh` (cạnh chỗ đọc `REQUIRED_FOR`, ~dòng 60 và ~77)
- Test: `tests/scripts/run-tests.sh`

**Evals phục vụ:** E11 (AC-11). **independent: false.**

**Interfaces:**
- Consumes: không.
- Produces: biến global `GAP_PROBE_MODE` ∈ `required | advisory | off`. Mặc định `advisory` khi khoá vắng.

- [ ] **Step 1: Viết case RED**

Chèn sau case `GP0`:

```bash
echo "GP11 gia tri gap_probe: nhay + viet hoa nhan dung, sai chinh ta -> canh bao cau hinh"
mk_gp_repo gp11a; R="$GPR/gp11a"
gp_feature "$R" feat-q T3 implemented
printf 'gap_probe: "required"\n' >> "$R/_acceptance/config.yaml"
printf 'v2\n' >> "$R/src/app.js"; gp_commit "$R"
bash "$CHECK" "$R" --base "$GP_BASE" >/dev/null 2>&1; check GP11a 1 $?

mk_gp_repo gp11b; R="$GPR/gp11b"
gp_feature "$R" feat-q T3 implemented
printf 'gap_probe: Required\n' >> "$R/_acceptance/config.yaml"
printf 'v2\n' >> "$R/src/app.js"; gp_commit "$R"
bash "$CHECK" "$R" --base "$GP_BASE" >/dev/null 2>&1; check GP11b 1 $?

mk_gp_repo gp11c; R="$GPR/gp11c"
gp_feature "$R" feat-q T3 implemented
printf 'gap_probe: requird\n' >> "$R/_acceptance/config.yaml"
printf 'v2\n' >> "$R/src/app.js"; gp_commit "$R"
GP11C="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"
hasout GP11c "gap_probe" "$GP11C"
hasout GP11c2 "requird" "$GP11C"
```

- [ ] **Step 2: Chạy để thấy ĐỎ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "GP11|Results:"`
Expected: `GP11a`/`GP11b` FAIL (expected exit 1, got 0 — chưa có luật nào chặn), `GP11c`/`GP11c2` FAIL (chưa in cảnh báo nào).

- [ ] **Step 3: Thêm mặc định**

Cạnh dòng `REQUIRED_FOR="T2 T3"`, thêm:

```bash
# Mặc định `advisory`: bỏ qua phản biện phải THẤY ĐƯỢC, nhưng bật kit lên không
# được chặn merge của repo chưa kịp làm quen. `off` là im hoàn toàn.
GAP_PROBE_MODE="advisory"
```

- [ ] **Step 4: Đọc từ config + fail-loud**

Trong khối đọc config (cạnh dòng `[ -n "$cfg_req" ] && REQUIRED_FOR="$cfg_req"`), thêm:

```bash
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
        violations=$((violations+1)) ;;
    esac
  fi
```

- [ ] **Step 5: Chạy để thấy XANH**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "GP11|Results:"`
Expected: `GP11a`, `GP11b`, `GP11c`, `GP11c2` đều PASS.
*(GP11a/GP11b đỏ→xanh nhờ Task 3? KHÔNG — chúng xanh ngay ở task này vì `requird` chưa nói gì; nếu chúng vẫn FAIL sau step này thì đó là do luật chặn chưa tồn tại, hãy để chúng cho Task 3 và ghi chú lại, đừng sửa test cho vừa code.)*

- [ ] **Step 6: Commit**

```bash
git add scripts/pre-merge-check.sh tests/scripts/run-tests.sh
git commit -m "feat(pre-merge): đọc mode gap_probe từ config, fail-loud khi giá trị lạ (AC-11)"
```

---

### Task 3: Luật lõi — thiếu phản biện thì chặn (required) / nhắc (advisory) / im (off)

**Files:**
- Modify: `scripts/pre-merge-check.sh` (trong vòng lặp per-slug, sau khối cross-layer)
- Test: `tests/scripts/run-tests.sh`

**Evals phục vụ:** E1 (AC-1), E2 (AC-2), E3 (AC-3), E4 (AC-4), E10 (AC-10), E13 (AC-12). **independent: false.**

**Interfaces:**
- Consumes: `GAP_PROBE_MODE` (Task 2), `slug_in_diff` + `DIFF_READY` + `DIFF_SKIP_NOTE` (Task 1).

- [ ] **Step 1: Viết case RED**

```bash
echo "GP1 required + thieu ca file lan descope + slug TRONG diff -> VIOLATION"
mk_gp_repo gp1; R="$GPR/gp1"
gp_feature "$R" feat-b T3 implemented
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"
gp_commit "$R"
GP1="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; GP1ST=$?
check GP1 1 "$GP1ST"
hasout GP1msg "gap-probe" "$GP1"
hasout GP1slug "feat-b" "$GP1"

echo "GP2 advisory -> NOTE, khong chan"
mk_gp_repo gp2; R="$GPR/gp2"
gp_feature "$R" feat-b T3 implemented
printf 'gap_probe: advisory\n' >> "$R/_acceptance/config.yaml"
gp_commit "$R"
GP2="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GP2 0 $?
hasout GP2note "NOTE" "$GP2"
nothas GP2noviol "VIOLATION [feat-b]" "$GP2"

echo "GP2b khoa gap_probe VANG -> hanh vi y het advisory"
mk_gp_repo gp2b; R="$GPR/gp2b"
gp_feature "$R" feat-b T3 implemented
gp_commit "$R"
GP2B="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GP2b 0 $?
hasout GP2bnote "gap-probe" "$GP2B"

echo "GP3 off -> khong in gi ve gap-probe"
mk_gp_repo gp3; R="$GPR/gp3"
gp_feature "$R" feat-b T3 implemented
printf 'gap_probe: off\n' >> "$R/_acceptance/config.yaml"
gp_commit "$R"
GP3="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GP3 0 $?
nothas GP3silent "gap-probe" "$GP3"

echo "GP4 contract T1 + required -> khong xet (thua huong loc REQUIRED_FOR)"
mk_gp_repo gp4; R="$GPR/gp4"
gp_feature "$R" feat-t1 T1 implemented
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"
gp_commit "$R"
GP4="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GP4 0 $?
nothas GP4silent "feat-t1" "$GP4"

echo "GP10 status draft va approved + required -> khong in gi"
mk_gp_repo gp10; R="$GPR/gp10"
gp_feature "$R" feat-d T3 draft
gp_feature "$R" feat-e T3 approved
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"
gp_commit "$R"
GP10="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GP10 0 $?
nothas GP10a "feat-d" "$GP10"
nothas GP10b "feat-e" "$GP10"

echo "GP13 slug NGOAI diff -> khong xet; khong --base -> bo qua kem NOTE"
mk_gp_repo gp13; R="$GPR/gp13"
gp_feature "$R" feat-old T3 implemented
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"
gp_commit "$R"                      # commit feat-old vao BASE
GP_BASE="$(git -C "$R" rev-parse HEAD)"
printf 'v2\n' >> "$R/src/app.js"; gp_commit "$R"   # PR chi cham src/
GP13="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GP13 0 $?
nothas GP13a "feat-old" "$GP13"
GP13B="$(bash "$CHECK" "$R" 2>&1)"; check GP13b 0 $?
hasout GP13c "gap-probe" "$GP13B"
```

- [ ] **Step 2: Chạy để thấy ĐỎ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "GP1 |GP1msg|GP2|GP3|GP4|GP10|GP13|Results:"`
Expected: `GP1` FAIL (expected 1, got 0), `GP1msg`/`GP1slug` FAIL, `GP2note`/`GP2bnote`/`GP13c` FAIL. `GP3silent`, `GP4silent`, `GP10a/b`, `GP13a` PASS **rỗng** (chưa có luật nên im lặng là hiển nhiên) — ghi nhận, chúng chỉ có giá trị thật sau Step 3.

- [ ] **Step 3: NOTE một lần khi không có diff**

Ngay SAU khối hoist của Task 1, thêm:

```bash
# AC-12 nửa sau: không có base thì luật này không xác định được phạm vi, nên bỏ
# qua — nhưng bỏ qua phải THẤY ĐƯỢC (cùng lối với răng T1-escape).
if [ "$GAP_PROBE_MODE" != "off" ] && [ "$DIFF_READY" -eq 0 ]; then
  echo "NOTE: gap-probe check skipped — $DIFF_SKIP_NOTE (luật chỉ xét slug có file trong diff PR)"
fi
```

- [ ] **Step 4: Luật lõi trong vòng lặp**

Trong vòng lặp per-slug, NGAY SAU khối cross-layer (`fi` đóng của `if [ -n "$xl_acs" ]`), thêm:

```bash
  # ─── Gap-probe presence (phản biện context sạch) ─────────────────────────
  # Vị trí có chủ đích: SAU hai bước lọc `REQUIRED_FOR` và `status implemented+`
  # phía trên, nên AC-4 (T1) và AC-10 (draft/approved) đúng theo CẤU TRÚC chứ
  # không nhờ một nhánh if riêng. Chỉ xét slug có file trong diff PR: quét cả
  # `_acceptance/` khiến repo có lịch sử nhận hàng chục VIOLATION không liên
  # quan diff ở PR đầu tiên rồi tắt luật (Cổng 1 2026-07-26, ledger d-116).
  if [ "$GAP_PROBE_MODE" != "off" ] && slug_in_diff "$slug"; then
    gp_fix='Chạy bước S1#7 (phản biện context sạch) để sinh gap-probe.md, HOẶC ghi vào decisions.jsonl một entry {"id":"d-<UTC>-<rand>","type":"descope","stage":"S1","at":"<ISO>","decision":"bỏ gap-probe — <lý do>","impact":"đổi lại không có phản biện context sạch trước duyệt"}'
    if [ "$GAP_PROBE_MODE" = "required" ]; then
      echo "VIOLATION [$slug]: chưa qua phản biện context sạch — không có gap-probe.md hợp lệ và ledger không có entry descope. $gp_fix"
      violations=$((violations+1))
    else
      echo "NOTE [$slug]: chưa qua phản biện context sạch (gap-probe) — advisory, không chặn merge. $gp_fix"
    fi
  fi
```

- [ ] **Step 5: Chạy để thấy XANH**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -cE "FAIL"`
Expected: `0`. Rồi `bash tests/scripts/run-tests.sh 2>&1 | tail -1` → `Results: 252 passed, 0 failed`.

- [ ] **Step 6: Chứng minh GP3/GP4/GP10/GP13a biết đỏ**

Tạm đổi điều kiện `slug_in_diff "$slug"` thành `true` rồi chạy:
Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "FAIL: GP13a|FAIL: GP4silent"`
Expected: cả hai FAIL. Hoàn tác điều kiện, chạy lại → xanh. **Bước này bắt buộc** — không có nó thì 4 case im-lặng là xanh rỗng.

- [ ] **Step 7: Commit**

```bash
git add scripts/pre-merge-check.sh tests/scripts/run-tests.sh
git commit -m "feat(pre-merge): luật gap-probe lõi — required chặn, advisory nhắc, off im (AC-1,2,3,4,10,12)"
```

---

### Task 4: Đọc `verdict` từ KHỐI FRONTMATTER; file không đọc được = thiếu

**Files:**
- Modify: `scripts/pre-merge-check.sh` (khối gap-probe của Task 3)
- Test: `tests/scripts/run-tests.sh`

**Evals phục vụ:** E5 (AC-5), E6 (AC-6). **independent: false.**

**Interfaces:**
- Consumes: `front_field <file> <key>` sẵn có.

- [ ] **Step 1: Viết case RED**

```bash
echo "GP5 verdict clean va findings -> im lang o ca required lan advisory"
for v in clean findings; do
  mk_gp_repo "gp5$v"; R="$GPR/gp5$v"
  gp_feature "$R" feat-c T3 implemented
  printf -- '---\nslug: feat-c\nat: 2026-07-26T00:00:00Z\nverdict: %s\n---\n' "$v" > "$R/_acceptance/feat-c/gap-probe.md"
  printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"
  gp_commit "$R"
  OUT="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check "GP5-$v" 0 $?
  nothas "GP5-$v-silent" "feat-c" "$OUT"
done

echo "GP5c fixture SAO CHEP nguyen van dau ra that cua S1#7 -> im lang"
mk_gp_repo gp5c; R="$GPR/gp5c"
gp_feature "$R" feat-c T3 implemented
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"
head -8 "$ROOT_REAL/_acceptance/gap-probe-presence-hook/gap-probe.md" > "$R/_acceptance/feat-c/gap-probe.md"
gp_commit "$R"
GP5C="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GP5c 0 $?
nothas GP5c-silent "feat-c" "$GP5C"

echo "GP6 file rong (touch) / verdict rac / verdict CHI o than bai -> coi nhu THIEU"
mk_gp_repo gp6a; R="$GPR/gp6a"
gp_feature "$R" feat-c T3 implemented
: > "$R/_acceptance/feat-c/gap-probe.md"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
bash "$CHECK" "$R" --base "$GP_BASE" >/dev/null 2>&1; check GP6a 1 $?

mk_gp_repo gp6b; R="$GPR/gp6b"
gp_feature "$R" feat-c T3 implemented
printf -- '---\nslug: feat-c\nverdict: rac\n---\n' > "$R/_acceptance/feat-c/gap-probe.md"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
bash "$CHECK" "$R" --base "$GP_BASE" >/dev/null 2>&1; check GP6b 1 $?

mk_gp_repo gp6c; R="$GPR/gp6c"
gp_feature "$R" feat-c T3 implemented
printf '# Bao cao\n\nBang finding trich: verdict: clean\n' > "$R/_acceptance/feat-c/gap-probe.md"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
bash "$CHECK" "$R" --base "$GP_BASE" >/dev/null 2>&1; check GP6c 1 $?
```

Thêm biến `ROOT_REAL` ngay sau dòng `HERE=` ở đầu file test:
```bash
ROOT_REAL="$(cd "$HERE/../.." && pwd)"
```

- [ ] **Step 2: Chạy để thấy ĐỎ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "GP5|GP6"`
Expected: `GP5-clean`/`GP5-findings`/`GP5c` FAIL (expected exit 0, got 1 — luật Task 3 chặn mọi thứ vì chưa đọc verdict). `GP6a/b/c` PASS (đang chặn hết) — chúng chỉ có giá trị sau Step 3.

- [ ] **Step 3: Đọc verdict, phân nhánh**

Thay khối gap-probe của Task 3 bằng:

```bash
  if [ "$GAP_PROBE_MODE" != "off" ] && slug_in_diff "$slug"; then
    gp_fix='Chạy bước S1#7 (phản biện context sạch) để sinh gap-probe.md, HOẶC ghi vào decisions.jsonl một entry {"id":"d-<UTC>-<rand>","type":"descope","stage":"S1","at":"<ISO>","decision":"bỏ gap-probe — <lý do>","impact":"đổi lại không có phản biện context sạch trước duyệt"}'
    # front_field CHỈ đọc khối --- đầu file: một dòng `verdict:` nằm trong thân
    # bài (vd trích trong bảng finding) không được tính, và `touch` file rỗng
    # cho chuỗi rỗng → rơi vào nhánh "thiếu". Đó là chốt chống bypass.
    gp_verdict=""
    [ -f "${dir}gap-probe.md" ] && gp_verdict="$(front_field "${dir}gap-probe.md" verdict | tr '[:upper:]' '[:lower:]')"
    case "$gp_verdict" in
      clean|findings)
        : ;;
      *)
        if [ "$GAP_PROBE_MODE" = "required" ]; then
          echo "VIOLATION [$slug]: chưa qua phản biện context sạch — không có gap-probe.md hợp lệ và ledger không có entry descope. $gp_fix"
          violations=$((violations+1))
        else
          echo "NOTE [$slug]: chưa qua phản biện context sạch (gap-probe) — advisory, không chặn merge. $gp_fix"
        fi ;;
    esac
  fi
```

- [ ] **Step 4: Chạy để thấy XANH**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -cE "FAIL"` → `0`.

- [ ] **Step 5: Chứng minh GP6 biết đỏ**

Tạm đổi `clean|findings)` thành `clean|findings|"")` rồi chạy:
Run: `bash tests/scripts/run-tests.sh 2>&1 | grep "FAIL: GP6a"`
Expected: FAIL. Hoàn tác, chạy lại → xanh.

- [ ] **Step 6: Commit**

```bash
git add scripts/pre-merge-check.sh tests/scripts/run-tests.sh
git commit -m "feat(pre-merge): verdict đọc từ frontmatter; file rỗng/verdict rác tính là thiếu (AC-5, AC-6)"
```

---

### Task 5: Van thoát `descope` + nhánh `probe-failed`

**Files:**
- Modify: `scripts/pre-merge-check.sh`
- Test: `tests/scripts/run-tests.sh`

**Evals phục vụ:** E7 (AC-7), E8 (AC-8). **independent: false.**

**Interfaces:**
- Produces: hàm `gap_probe_descope_id <decisions.jsonl>` → in `id` của entry descope đầu tiên khớp, hoặc chuỗi rỗng.

- [ ] **Step 1: Viết case RED**

```bash
echo "GP7 entry descope -> khong violation, NOTE neu id"
mk_gp_repo gp7; R="$GPR/gp7"
gp_feature "$R" feat-f T3 implemented
printf '%s\n' '{"id":"d-77","type":"descope","decision":"bỏ gap-probe — quá nhỏ"}' > "$R/_acceptance/feat-f/decisions.jsonl"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GP7="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GP7 0 $?
hasout GP7id "d-77" "$GP7"

echo "GP7b descope thut dau + viet hoa -> van khop (cung luat gate-card.js)"
mk_gp_repo gp7b; R="$GPR/gp7b"
gp_feature "$R" feat-f T3 implemented
printf '%s\n' '{"id":"d-78","type":"descope","decision":"  Bỏ gap-probe — viết hoa"}' > "$R/_acceptance/feat-f/decisions.jsonl"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GP7B="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GP7b 0 $?
hasout GP7bid "d-78" "$GP7B"

echo "GP7c dong JSON hong + entry hop le -> van khop (parse khoan dung)"
mk_gp_repo gp7c; R="$GPR/gp7c"
gp_feature "$R" feat-f T3 implemented
printf '%s\n' 'khong-phai-json' '{"id":"d-79","type":"descope","decision":"bỏ gap-probe — ok"}' \
  > "$R/_acceptance/feat-f/decisions.jsonl"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
bash "$CHECK" "$R" --base "$GP_BASE" >/dev/null 2>&1; check GP7c 0 $?

echo "GP7d entry descope KHONG phai gap-probe -> KHONG duoc coi la van thoat"
mk_gp_repo gp7d; R="$GPR/gp7d"
gp_feature "$R" feat-f T3 implemented
printf '%s\n' '{"id":"d-80","type":"descope","decision":"bỏ mockup — không có UI"}' \
  > "$R/_acceptance/feat-f/decisions.jsonl"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
bash "$CHECK" "$R" --base "$GP_BASE" >/dev/null 2>&1; check GP7d 1 $?

echo "GP8 verdict probe-failed -> NOTE, khong violation"
mk_gp_repo gp8; R="$GPR/gp8"
gp_feature "$R" feat-g T3 implemented
printf -- '---\nslug: feat-g\nverdict: probe-failed\n---\n' > "$R/_acceptance/feat-g/gap-probe.md"
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
GP8="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check GP8 0 $?
hasout GP8note "probe-failed" "$GP8"
```

- [ ] **Step 2: Chạy để thấy ĐỎ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "GP7|GP8"`
Expected: `GP7`, `GP7b`, `GP7c`, `GP8` FAIL (expected 0, got 1). `GP7d` PASS. `GP7id`/`GP7bid`/`GP8note` FAIL.

- [ ] **Step 3: Thêm helper**

Đặt cạnh `front_field`:

```bash
# In id của entry descope ĐẦU TIÊN có decision mở đầu "bỏ gap-probe" (khoan dung
# khoảng trắng đầu, chấp cả "Bỏ" viết hoa) — CÙNG luật /^\s*bỏ gap-probe/i mà
# scripts/gate-card.js:203 dùng. Lệch nhau = thẻ và pre-merge mâu thuẫn trên
# cùng một artifact. Dòng JSON hỏng bị bỏ qua, không làm hỏng cả file: ledger là
# sổ ghi lý do, một dòng lỗi không được biến thành chặn cổng.
gap_probe_descope_id() { # <decisions.jsonl>
  [ -f "$1" ] || return 0
  awk '
    /"type"[[:space:]]*:[[:space:]]*"descope"/ {
      if ($0 ~ /"decision"[[:space:]]*:[[:space:]]*"[[:space:]]*[Bb]ỏ[[:space:]]+gap-probe/) {
        id = "(entry không có id)"
        if (match($0, /"id"[[:space:]]*:[[:space:]]*"[^"]*"/)) {
          s = substr($0, RSTART, RLENGTH); sub(/^.*"id"[[:space:]]*:[[:space:]]*"/, "", s); sub(/"$/, "", s); id = s
        }
        print id; exit
      }
    }' "$1"
}
```

- [ ] **Step 4: Nối vào nhánh thiếu + thêm probe-failed**

Thay `case "$gp_verdict" in` của Task 4 bằng:

```bash
    case "$gp_verdict" in
      clean|findings)
        : ;;
      probe-failed)
        echo "NOTE [$slug]: gap-probe verdict là probe-failed — phản biện KHÔNG chạy được. Merge lúc này nghĩa là merge mà chưa có phản biện context sạch; chạy lại S1#7 nếu muốn có, hoặc chấp nhận rủi ro đó." ;;
      *)
        gp_desc="$(gap_probe_descope_id "${dir}decisions.jsonl")"
        if [ -n "$gp_desc" ]; then
          echo "NOTE [$slug]: phản biện context sạch đã được BỎ có chủ đích theo ledger $gp_desc — quyết định có dấu vết, không phải sơ suất."
        elif [ "$GAP_PROBE_MODE" = "required" ]; then
          echo "VIOLATION [$slug]: chưa qua phản biện context sạch — không có gap-probe.md hợp lệ và ledger không có entry descope. $gp_fix"
          violations=$((violations+1))
        else
          echo "NOTE [$slug]: chưa qua phản biện context sạch (gap-probe) — advisory, không chặn merge. $gp_fix"
        fi ;;
    esac
```

- [ ] **Step 5: Chạy để thấy XANH**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -cE "FAIL"` → `0`.

- [ ] **Step 6: Chứng minh GP7d biết đỏ**

Tạm nới regex trong helper từ `[Bb]ỏ[[:space:]]+gap-probe` thành `[Bb]ỏ` rồi chạy:
Run: `bash tests/scripts/run-tests.sh 2>&1 | grep "FAIL: GP7d"`
Expected: FAIL (entry "bỏ mockup" bị nhận nhầm là van thoát). Hoàn tác, chạy lại → xanh.

- [ ] **Step 7: Commit**

```bash
git add scripts/pre-merge-check.sh tests/scripts/run-tests.sh
git commit -m "feat(pre-merge): van thoát descope (parity gate-card) + nhánh probe-failed (AC-7, AC-8)"
```

---

### Task 6: Gói bằng chứng cho judge + E12 gác cổng

**Files:**
- Create: `_acceptance/gap-probe-presence-hook/evidence/premerge-messages.txt`
- Modify: `tests/scripts/run-tests.sh`

**Evals phục vụ:** E12 (gác cổng AC-9), E9 (AC-9, judgment). **independent: false.**

**Interfaces:**
- Consumes: stdout của các fixture `GP1`, `GP2`, `GP7`, `GP8` từ Task 3–5.

- [ ] **Step 1: Viết case RED cho E12**

```bash
echo "GP12 goi bang chung cho judge phai co DU 4 nhan"
GPMSG="$ROOT_REAL/_acceptance/gap-probe-presence-hook/evidence/premerge-messages.txt"
if [ -f "$GPMSG" ]; then
  MSGS="$(cat "$GPMSG")"
  hasout GP12a "VIOLATION" "$MSGS"
  hasout GP12b "advisory" "$MSGS"
  hasout GP12c "theo ledger" "$MSGS"
  hasout GP12d "probe-failed" "$MSGS"
else
  check GP12-missing 0 1
fi
```

- [ ] **Step 2: Chạy để thấy ĐỎ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "GP12"`
Expected: `GP12-missing` FAIL (file chưa tồn tại).

- [ ] **Step 3: Sinh gói bằng chứng từ stdout THẬT**

Không chép tay — judge phải chấm đúng bản đã ship:

```bash
cd "$(git rev-parse --show-toplevel)"
OUT=_acceptance/gap-probe-presence-hook/evidence/premerge-messages.txt
mkdir -p "$(dirname "$OUT")"
KEEP="$(mktemp -d)"
{
  echo "# Thông điệp luật gap-probe ở merge boundary — trích từ stdout THẬT."
  echo "# Sinh lại: xem Task 6 trong docs/superpowers/plans/2026-07-26-gap-probe-premerge.md"
  for c in gp1 gp2 gp7 gp8; do
    echo; echo "── fixture $c ──"
    ( cd "$KEEP" && bash "$(git rev-parse --show-toplevel)/tests/scripts/run-tests.sh" >/dev/null 2>&1 ) || true
  done
} > "$OUT"
```

**Lưu ý:** lệnh trên chỉ dựng khung. Cách đúng là chạy `bash "$CHECK" "$GPR/<case>" --base "$GP_BASE"` cho từng fixture và gom stdout — nhưng `$GPR` bị `trap rm -rf` xoá khi suite kết thúc. Vì vậy hãy thêm hỗ trợ giữ fixture vào `tests/scripts/run-tests.sh` giống suite hooks đã làm: đổi `T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT` thành

```bash
T="${PREMERGE_FIXTURE_DIR:-$(mktemp -d)}"
[ -n "${PREMERGE_FIXTURE_DIR:-}" ] || trap 'rm -rf "$T"' EXIT
mkdir -p "$T"
```

rồi sinh gói bằng:

```bash
KEEP=/tmp/gpkeep; rm -rf "$KEEP"; mkdir -p "$KEEP"
PREMERGE_FIXTURE_DIR="$KEEP" bash tests/scripts/run-tests.sh >/dev/null 2>&1
BASE_OF() { git -C "$1" rev-parse HEAD~1 2>/dev/null || git -C "$1" rev-parse HEAD; }
{
  echo "# Thông điệp luật gap-probe ở merge boundary — trích từ stdout THẬT."
  echo "# Sinh lại: PREMERGE_FIXTURE_DIR=/tmp/gpkeep bash tests/scripts/run-tests.sh, rồi chạy lại 4 fixture."
  for c in gp1 gp2 gp7 gp8; do
    echo; echo "── fixture $c ──"
    bash scripts/pre-merge-check.sh "$KEEP/gp/$c" --base "$(BASE_OF "$KEEP/gp/$c")" 2>&1 | grep -E "VIOLATION|NOTE" || true
  done
} > _acceptance/gap-probe-presence-hook/evidence/premerge-messages.txt
```

- [ ] **Step 4: Đọc lại bằng MẮT — đây chính là câu AC-9 hỏi**

Mở `_acceptance/gap-probe-presence-hook/evidence/premerge-messages.txt`. Với mỗi thông điệp tự trả lời: *một người chưa từng đọc kit có biết đang thiếu gì và phải làm gì tiếp không?* Chỗ nào không trả lời được thì sửa chuỗi trong `scripts/pre-merge-check.sh`, chạy lại suite, sinh lại file. **KHÔNG** tự đánh dấu AC-9 xong — verdict của nó thuộc Gate 2, do người chấm.

- [ ] **Step 5: Chạy toàn bộ verify**

```bash
bash tests/scripts/run-tests.sh
bash tests/hooks/run-tests.sh
bash tests/plugins/run-tests.sh
bash scripts/sync-plugin-packages.sh --check
```
Expected: cả 4 exit 0 · `Results: 0 failed` (scripts) · `51 passed` (hooks) · `all plugin tests passed` · `plugins/ mirror in sync.`

- [ ] **Step 6: Đồng bộ mirror rồi commit**

`scripts/` được sync sang `plugins/acceptance-gate/` — quên bước này là test P30 đỏ.

```bash
bash scripts/sync-plugin-packages.sh
git add scripts/ tests/ plugins/ _acceptance/gap-probe-presence-hook/evidence/
git commit -m "feat(pre-merge): gói bằng chứng cho judge E9 + E12 gác cổng đủ 4 nhãn"
```

- [ ] **Step 7: Đặt contract sang `implemented`**

Sửa frontmatter `_acceptance/gap-probe-presence-hook/contract.md`: `status: approved` → `status: implemented`, **qua công cụ file-edit của agent** để hook validate transition. Rồi DỪNG. S4 VERIFY là việc của ngữ cảnh khác — doer ≠ grader.

---

## Self-Review

**1. Phủ spec:** 12/12 AC có task. AC-1→T3 · AC-2→T3 · AC-3→T3 · AC-4→T3 · AC-5→T4 · AC-6→T4 · AC-7→T5 · AC-8→T5 · AC-9→T6 · AC-10→T3 · AC-11→T2 · AC-12→T1+T3. Eval: E1,E2,E3,E4,E10,E13→T3 · E5,E6→T4 · E7,E8→T5 · E11→T2 · E9,E12→T6.

**2. Quét chỗ trống:** không có "TBD"/"xử lý lỗi phù hợp"/"tương tự Task N". Mọi bước sửa code đều có code thật; mọi bước chạy đều có lệnh + kết quả mong đợi.

**3. Nhất quán kiểu:** `DIFF_READY`/`DIFF_FILES`/`DIFF_SKIP_NOTE`/`slug_in_diff` định ở Task 1 và dùng đúng tên ở Task 3. `GAP_PROBE_MODE` định ở Task 2, dùng ở Task 3–5. `gap_probe_descope_id` định ở Task 5, dùng ngay trong cùng task. `gp_fix`/`gp_verdict`/`gp_desc` là biến cục bộ trong khối, đặt tên nhất quán qua Task 3→5. `front_field` là hàm sẵn có, không định lại.

**Rủi ro đã biết:**
- Task 3→4→5 mỗi task THAY khối gap-probe của task trước, không chèn thêm. Chủ ý: mỗi task phải xanh độc lập để có cổng riêng cho reviewer. Người thực thi phải thay nguyên khối.
- Task 1 chạm luật T1-escape đang chạy. Step 5 bắt buộc chứng minh B01–B06 vẫn xanh; nếu lệch một case thì DỪNG, đừng đi tiếp.
- Bước "chứng minh biết đỏ" ở Task 3/4/5 là bắt buộc, không phải tuỳ chọn. Bốn case im-lặng (`GP3silent`, `GP4silent`, `GP10a/b`, `GP13a`) xanh rỗng nếu luật không chạy — đúng lớp lỗi đã dẫm 4 lần ở feature v1.
