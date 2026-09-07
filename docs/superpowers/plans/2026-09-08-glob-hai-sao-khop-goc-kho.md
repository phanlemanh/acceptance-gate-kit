# glob-hai-sao-khop-goc-kho — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bộ khớp glob của `pre-merge-check.sh` hiểu đoạn `**/` là không-hoặc-nhiều thư mục, để `**/*.md` bắt cả markdown ở gốc kho; giữ nguyên nghĩa `*` (vượt `/`).

**Architecture:** Một hàm sinh biến thể `glob_variants` đặt cạnh `match_globs` trong `scripts/pre-merge-check.sh`; `match_globs` thử mọi biến thể của mỗi glob. Răng vào `tests/scripts/run-tests.sh` (khối VC, khuôn fixture code-sinh), gồm mutant gỡ marker. Một câu trong GUIDE §8.

**Tech Stack:** bash 3.2+ (`case` pattern, tham số `${var%%…}`/`${var#…}`), git fixture, suite bash sẵn có.

**Spec:** `docs/superpowers/specs/2026-09-08-glob-hai-sao-khop-goc-kho-design.md` · Contract: `_acceptance/glob-hai-sao-khop-goc-kho/contract.md` · Evals: `_acceptance/glob-hai-sao-khop-goc-kho/evals.yaml`

## Global Constraints

- KHÔNG đổi nghĩa `*` (vẫn vượt `/`); KHÔNG thêm nghĩa cho `?`, `[…]`, `**` đứng một mình.
- Chỉ tách tại chuỗi `**/` (ba ký tự), không tách tại `**` — `docs/**` phải đi qua nguyên vẹn (AC-10).
- Dòng «biến thể BỎ» mang marker `# GLOB-DOUBLESTAR-ZERO-DIRS` đúng một lần trong file (răng mutant đếm nó).
- Mọi ca mới ghim THÔNG ĐIỆP (chuỗi «evidence is stale», tên file, «T3 paths (t3_paths) changed»), không chỉ mã thoát; mọi ca đỏ có đối chứng xanh cùng fixture (measure-birth).
- Mọi đường dẫn trong test suy từ `$HERE` (vị trí script), không hardcode.
- Không chạm `_acceptance/config.yaml` của repo nào khác; không chạm CRM.
- Thứ tự thi công tuần tự (cả ba task chạm `tests/scripts/run-tests.sh`).
- Verify per-task: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "PASS: GL|FAIL: GL|^Results:"` — dòng `Results:` phải `0 failed`.

---

### Task 1: `glob_variants` + `match_globs` thử mọi biến thể — ca GL01–GL07, GL10

**Files:**
- Modify: `scripts/pre-merge-check.sh` (hàm `match_globs`, hiện ở khoảng dòng 467–476)
- Test: `tests/scripts/run-tests.sh` — chèn khối mới NGAY TRƯỚC dòng `echo "--- recheck theo diff PR …"` (khoảng dòng 2011, sau khối VC12)

**Interfaces:**
- Consumes: helper `check`, `same`, `hasout`, `nothas`, biến `$T`, `$CHECK`, `$GIT_ID`, `PASS_COUNT/FAIL_COUNT` (đã có trong suite).
- Produces: hàm `glob_variants <đã-xử-lý> <phần-còn-lại>` in mỗi biến thể một dòng; `match_globs <path> <globs>` giữ nguyên chữ ký (0 nếu khớp). Fixture `mk_glob_repo <root> <globs-newline> <files-đổi-space>` và `mk_glob_pr_repo <root>` cho Task 2 dùng lại.
- Phục vụ: E1–E7, E10 (AC-1..AC-7, AC-10). `independent: false`.

- [ ] **Step 1: Viết fixture + ca đỏ/xanh vào suite (trước code)**

Chèn trước dòng `echo "--- recheck theo diff PR …"`:

```bash
echo ""
echo "--- glob-hai-sao-khop-goc-kho: \`**/\` là không-hoặc-nhiều thư mục (GL01–GL10) ---"
# Fixture code-sinh: repo git, config t1 tuỳ ca, hồ sơ feat-gl signed-off ghim
# HEAD, rồi MỘT commit đổi các file nêu tên. Mọi đường dẫn suy từ $T/$CHECK.
mk_glob_repo() { # <root> <t1-globs newline-separated> <files-to-touch space-separated>
  local R="$1" globs="$2" files="$3" f vc
  rm -rf "$R"; mkdir -p "$R/src" "$R/docs" "$R/a/x" "$R/apps/app" "$R/docs2" "$R/_acceptance/feat-gl"
  git -C "$(dirname "$R")" init -q "$(basename "$R")"
  { printf 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n'; printf '%s\n' "$globs" | sed 's/^/    - "/; s/$/"/'; } > "$R/_acceptance/config.yaml"
  printf 'code v1\n' > "$R/src/app.js"; printf '# agents\n' > "$R/AGENTS.md"; printf '# x\n' > "$R/AGENTS.mdx"
  printf '# d\n' > "$R/docs/d.md"; printf '# r\n' > "$R/apps/app/README.md"; printf '# b\n' > "$R/a/b.md"; printf '# b\n' > "$R/a/x/b.md"
  printf '# c\n' > "$R/CHANGELOG.md"; printf '# d2\n' > "$R/docs2/a.md"; printf '#!/bin/sh\nexit 0\n' > "$R/verify.sh"
  printf -- '---\nschema_version: 1\nfeature: feat-gl\nslug: feat-gl\nrisk_tier: T2\nsurfaces: [api]\nstatus: signed-off\napproved_by: Manh Phan\napproved_at: 2026-06-10\n---\n' > "$R/_acceptance/feat-gl/contract.md"
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm c1
  vc="$(git -C "$R" rev-parse HEAD)"
  printf -- '---\nschema_version: 1\nfeature_slug: feat-gl\nverdict: PASS\nverified_commit: %s\nhuman_signoff: Manh 2026-08-01\n---\n\n## Evidence\n- eval: E1\n  run_id: feat-gl-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-08-01\n' "$vc" > "$R/_acceptance/feat-gl/evidence-report.md"
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm c2
  for f in $files; do printf 'changed\n' >> "$R/$f"; done
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm c3
}
gl_run() { env -u PRE_MERGE_BASE bash "$CHECK" "$1" 2>&1; }

echo "GL01 \`**/*.md\` + AGENTS.md ở gốc đổi sau verify -> sạch (ca CRM 07/09)"
R="$T/gl01"; mk_glob_repo "$R" '**/*.md' 'AGENTS.md'
out="$(gl_run "$R")"; check GL01 0 $?
nothas GL01-nostale "evidence is stale" "$out"

echo "GL02 \`**/*.md\` + docs/d.md + apps/app/README.md -> sạch (không hồi quy)"
R="$T/gl02"; mk_glob_repo "$R" '**/*.md' 'docs/d.md apps/app/README.md'
out="$(gl_run "$R")"; check GL02 0 $?
nothas GL02-nostale "evidence is stale" "$out"

echo "GL03 \`**/*.md\` + src/app.js -> stale đích danh (đối chứng đỏ: thước còn răng)"
R="$T/gl03"; mk_glob_repo "$R" '**/*.md' 'src/app.js'
out="$(gl_run "$R")"; check GL03 1 $?
case "$out" in *"VIOLATION [feat-gl]: evidence is stale"*"src/app.js"*) echo "  PASS: GL03-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: GL03-msg (expected stale VIOLATION kèm src/app.js)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo "GL04 \`**/*.md\` + AGENTS.mdx -> stale (không nới đuôi)"
R="$T/gl04"; mk_glob_repo "$R" '**/*.md' 'AGENTS.mdx'
out="$(gl_run "$R")"; check GL04 1 $?
case "$out" in *"VIOLATION [feat-gl]: evidence is stale"*"AGENTS.mdx"*) echo "  PASS: GL04-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: GL04-msg (expected stale VIOLATION kèm AGENTS.mdx)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo "GL05 \`a/**/b.md\` + a/b.md + a/x/b.md -> sạch (\`**/\` giữa mẫu)"
R="$T/gl05"; mk_glob_repo "$R" 'a/**/b.md' 'a/b.md a/x/b.md'
out="$(gl_run "$R")"; check GL05 0 $?
nothas GL05-nostale "evidence is stale" "$out"

echo "GL06 \`*.md\` + AGENTS.md + docs/d.md -> sạch (\`*\` vẫn vượt /)"
R="$T/gl06"; mk_glob_repo "$R" '*.md' 'AGENTS.md docs/d.md'
out="$(gl_run "$R")"; check GL06 0 $?
nothas GL06-nostale "evidence is stale" "$out"

echo "GL10 \`docs/**\` + CHANGELOG.md (không mẫu nào có \`**/\`) -> sạch; docs2/a.md -> stale"
R="$T/gl10"; mk_glob_repo "$R" 'docs/**
CHANGELOG.md' 'docs/d.md docs/x/y.md CHANGELOG.md'
out="$(gl_run "$R")"; check GL10 0 $?
nothas GL10-nostale "evidence is stale" "$out"
R="$T/gl10r"; mk_glob_repo "$R" 'docs/**
CHANGELOG.md' 'docs2/a.md'
out="$(gl_run "$R")"; check GL10-red 1 $?
case "$out" in *"VIOLATION [feat-gl]: evidence is stale"*"docs2/a.md"*) echo "  PASS: GL10-red-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: GL10-red-msg (expected stale VIOLATION kèm docs2/a.md)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac

echo "GL07 t3_paths \`**/auth/**\` + \`**/Dockerfile\`, t1 \`*\`: PR đổi auth/x.js + Dockerfile gốc -> T3 VIOLATION; chỉ other/y.js -> sạch"
mk_glob_pr_repo() { # <root> <files-to-touch space-separated> — nhánh basepoint rồi PR không kèm _acceptance/
  local R="$1" files="$2" f
  rm -rf "$R"; mkdir -p "$R/auth" "$R/other" "$R/_acceptance"
  git -C "$(dirname "$R")" init -q "$(basename "$R")"
  printf 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "*"\n  t3_paths:\n    - "**/auth/**"\n    - "**/Dockerfile"\n' > "$R/_acceptance/config.yaml"
  printf 'a\n' > "$R/auth/x.js"; printf 'o\n' > "$R/other/y.js"; printf 'FROM x\n' > "$R/Dockerfile"
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm base
  git -C "$R" branch basepoint
  for f in $files; do printf 'changed\n' >> "$R/$f"; done
  git -C "$R" add -A >/dev/null && git $GIT_ID -C "$R" commit -qm pr
}
R="$T/gl07"; mk_glob_pr_repo "$R" 'auth/x.js Dockerfile'
out="$(env -u PRE_MERGE_BASE bash "$CHECK" "$R" --base basepoint 2>&1)"; check GL07 1 $?
case "$out" in *"T3 paths (t3_paths) changed"*"auth/x.js"*"Dockerfile"*|*"T3 paths (t3_paths) changed"*"Dockerfile"*"auth/x.js"*) echo "  PASS: GL07-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: GL07-msg (expected T3 VIOLATION kèm auth/x.js và Dockerfile)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
R="$T/gl07c"; mk_glob_pr_repo "$R" 'other/y.js'
out="$(env -u PRE_MERGE_BASE bash "$CHECK" "$R" --base basepoint 2>&1)"; check GL07-control 0 $?
nothas GL07-control-not3 "T3 paths (t3_paths) changed" "$out"
```

- [ ] **Step 2: Chạy suite, xác nhận đỏ đúng chỗ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "PASS: GL|FAIL: GL|^Results:"`
Expected: FAIL ở `GL01`, `GL01-nostale`, `GL05`, `GL05-nostale`, `GL07`, `GL07-msg`; PASS ở GL02, GL03*, GL04*, GL06*, GL10*, GL07-control* (hành vi cũ). Nếu GL03/GL04/GL10-red không PASS trước khi sửa code → fixture hỏng, sửa fixture trước.

- [ ] **Step 3: Thêm `glob_variants`, sửa `match_globs`**

Thay thân `match_globs` trong `scripts/pre-merge-check.sh`:

```bash
# ── `**/` là KHÔNG-hoặc-nhiều thư mục (glob-hai-sao-khop-goc-kho, 2.9.0) ──────
# `case` của bash đòi `**/` phải có ít nhất một `/`, nên `**/*.md` bỏ sót
# AGENTS.md ở gốc kho (CRM 07/09: 4 hồ sơ stale/ngày vì commit thuần tài liệu).
# Sinh mọi biến thể của glob với từng đoạn `**/` được GIỮ hoặc BỎ — chỉ tách tại
# chuỗi ba ký tự `**/`, KHÔNG tại `**` (docs/** phải đi qua nguyên vẹn). `*` vẫn
# vượt `/` như trước — lời khai `*.md`/`docs/**` ở mọi consumer không đổi nghĩa.
glob_variants() { # <đã-xử-lý> <phần-còn-lại> — in mỗi biến thể một dòng
  case "$2" in
    *'**/'*)
      local pre="${2%%\*\*/*}" post="${2#*\*\*/}"
      glob_variants "$1$pre" "$post"          # GLOB-DOUBLESTAR-ZERO-DIRS
      glob_variants "$1$pre**/" "$post"
      ;;
    *) printf '%s\n' "$1$2" ;;
  esac
}
match_globs() { # <path> <newline-separated globs> — 0 iff any glob (any variant) matches
  while IFS= read -r g; do
    [ -n "$g" ] || continue
    while IFS= read -r v; do
      [ -n "$v" ] || continue
      # unquoted $v on purpose: case PATTERN matching (globs never fs-expand here)
      case "$1" in $v) return 0 ;; esac
    done <<VARIANTS
$(glob_variants "" "$g")
VARIANTS
  done <<GLOBS
$2
GLOBS
  return 1
}
```

Kiểm nhanh tại chỗ (không thuộc suite): `bash -c 'source <(sed -n "/^glob_variants()/,/^}/p" scripts/pre-merge-check.sh); glob_variants "" "a/**/b/**/c"'` phải in 4 dòng: `a/b/c`, `a/b/**/c`, `a/**/b/c`, `a/**/b/**/c`.

- [ ] **Step 4: Chạy suite, xác nhận xanh trọn**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "PASS: GL|FAIL: GL|^Results:"`
Expected: mọi dòng GL là PASS; `Results: … 0 failed`. Chạy thêm `bash tests/plugins/run-tests.sh` và `bash tests/hooks/run-tests.sh` — không ca cũ nào đổi màu.

- [ ] **Step 5: Commit**

```bash
git add scripts/pre-merge-check.sh tests/scripts/run-tests.sh
git commit -m "feat(pre-merge): \`**/\` là không-hoặc-nhiều thư mục trong match_globs — GL01–GL07, GL10 (glob-hai-sao-khop-goc-kho)"
```

---

### Task 2: Chiều đỏ của phép nới — mutant gỡ marker (GL08, 4 dòng PASS)

**Files:**
- Test: `tests/scripts/run-tests.sh` — chèn ngay SAU khối GL07 của Task 1

**Interfaces:**
- Consumes: `mk_glob_repo` (Task 1), marker `# GLOB-DOUBLESTAR-ZERO-DIRS` (Task 1), `$HERE`.
- Produces: bốn dòng `PASS: GL08-src`, `PASS: GL08-control`, `PASS: GL08-mut-applied`, `PASS: GL08-mutant`.
- Phục vụ: E8 (AC-8). `independent: false`.

- [ ] **Step 1: Viết ca mutant**

```bash
echo "GL08 mutant gỡ biến thể BỎ: nguồn bản sao = cây đang kiểm, control XANH, đột biến xác nhận, rồi ĐỎ"
MUTD="$T/gl08-tool"; rm -rf "$MUTD"; mkdir -p "$MUTD"
cp -R "$HERE/../../scripts" "$MUTD/scripts"
cp -R "$HERE/../../lib" "$MUTD/lib"
# Nguồn bản sao suy từ vị trí run-tests ($HERE), KHÔNG hardcode ROOT: so byte với
# script đang kiểm trước khi đột biến (gap-probe P2, hình dạng hardcode-ROOT).
if cmp -s "$MUTD/scripts/pre-merge-check.sh" "$CHECK"; then echo "  PASS: GL08-src"; PASS_COUNT=$((PASS_COUNT+1)); else echo "  FAIL: GL08-src (bản sao khác scripts/pre-merge-check.sh của cây đang kiểm)"; FAIL_COUNT=$((FAIL_COUNT+1)); fi
R="$T/gl01"   # dùng lại fixture GL01 — control phải cùng kết cục với bản thật
outc="$(env -u PRE_MERGE_BASE bash "$MUTD/scripts/pre-merge-check.sh" "$R" 2>&1)"; check GL08-control 0 $?
nothas GL08-control-nostale "evidence is stale" "$outc"
same GL08-marker-before 1 "$(grep -c '# GLOB-DOUBLESTAR-ZERO-DIRS$' "$MUTD/scripts/pre-merge-check.sh")"
sed '/# GLOB-DOUBLESTAR-ZERO-DIRS$/d' "$MUTD/scripts/pre-merge-check.sh" > "$MUTD/scripts/pre-merge-check.mut" \
  && mv "$MUTD/scripts/pre-merge-check.mut" "$MUTD/scripts/pre-merge-check.sh"
same GL08-mut-applied 0 "$(grep -c '# GLOB-DOUBLESTAR-ZERO-DIRS$' "$MUTD/scripts/pre-merge-check.sh")"
outm="$(env -u PRE_MERGE_BASE bash "$MUTD/scripts/pre-merge-check.sh" "$R" 2>&1)"; check GL08-mutant 1 $?
case "$outm" in *"VIOLATION [feat-gl]: evidence is stale"*"AGENTS.md"*) echo "  PASS: GL08-mutant-msg"; PASS_COUNT=$((PASS_COUNT+1)) ;; *) echo "  FAIL: GL08-mutant-msg (mutant gỡ biến thể BỎ mà AGENTS.md không stale — ca không phân biệt được)"; FAIL_COUNT=$((FAIL_COUNT+1)) ;; esac
```

- [ ] **Step 2: Chạy suite, xác nhận bốn dòng PASS**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "GL08|^Results:"`
Expected: `PASS: GL08-src`, `GL08-control`, `GL08-control-nostale`, `GL08-marker-before`, `GL08-mut-applied`, `GL08-mutant`, `GL08-mutant-msg`; `0 failed`.

- [ ] **Step 3: Tự phá thử một lần (measure-birth mục 2, không commit)**

Tạm đổi trong `scripts/pre-merge-check.sh` dòng `glob_variants "$1$pre" "$post"          # GLOB-DOUBLESTAR-ZERO-DIRS` thành `: # GLOB-DOUBLESTAR-ZERO-DIRS` (bỏ biến thể BỎ nhưng giữ marker) → chạy suite: GL01 phải ĐỎ và GL08-control phải ĐỎ (bản sao chép cây hỏng). Hoàn nguyên bằng `git checkout scripts/pre-merge-check.sh`. Ghi kết quả một dòng vào message commit.

- [ ] **Step 4: Commit**

```bash
git add tests/scripts/run-tests.sh
git commit -m "test(pre-merge): GL08 mutant gỡ GLOB-DOUBLESTAR-ZERO-DIRS — control xanh, đột biến đỏ kèm AGENTS.md"
```

---

### Task 3: GUIDE §8 nói rõ ngữ nghĩa glob — GL09 (3 mệnh đề)

**Files:**
- Modify: `GUIDE.md` — hàng `| \`risk_tiers.t1_skip_globs\` |` trong bảng config (khoảng dòng 670)
- Test: `tests/scripts/run-tests.sh` — chèn ngay SAU khối GL08

**Interfaces:**
- Consumes: `$HERE`.
- Produces: `PASS: GL09` (một dòng, ba assert gộp — thiếu mệnh đề nào FAIL nêu tên mệnh đề đó).
- Phục vụ: E9 (AC-9). `independent: false`.

- [ ] **Step 1: Viết ca đọc GUIDE**

```bash
echo "GL09 GUIDE §8 hàng t1_skip_globs nêu đủ 3 mệnh đề ngữ nghĩa glob"
gl09_row="$(grep -m1 '^| `risk_tiers.t1_skip_globs`' "$HERE/../../GUIDE.md")"
gl09_miss=""
case "$gl09_row" in *'`**/`'*'không-hoặc-nhiều thư mục'*|*'`**/`'*'không hoặc nhiều thư mục'*) : ;; *) gl09_miss="$gl09_miss [1:**/ = không-hoặc-nhiều thư mục]" ;; esac
case "$gl09_row" in *'`*` vượt `/`'*|*'`*` không dừng ở `/`'*) : ;; *) gl09_miss="$gl09_miss [2:* vượt /]" ;; esac
case "$gl09_row" in *'AGENTS.md'*) : ;; *) gl09_miss="$gl09_miss [3:ví dụ AGENTS.md]" ;; esac
if [ -z "$gl09_miss" ]; then echo "  PASS: GL09"; PASS_COUNT=$((PASS_COUNT+1)); else echo "  FAIL: GL09 (hàng t1_skip_globs thiếu$gl09_miss)"; FAIL_COUNT=$((FAIL_COUNT+1)); fi
```

- [ ] **Step 2: Chạy suite — GL09 phải ĐỎ nêu đủ ba mệnh đề thiếu**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep GL09`
Expected: `FAIL: GL09 (hàng t1_skip_globs thiếu [1:…] [2:…] [3:…])`.

- [ ] **Step 3: Sửa hàng GUIDE**

Thay ô «Ý nghĩa» của hàng thành:

```
Glob an toàn bỏ qua gate (docs, *.md). Cú pháp là mẫu `case` của shell: `*` vượt `/` (nên `*.md` bắt markdown ở mọi tầng); từ 2.9.0 `**/` là không-hoặc-nhiều thư mục như gitignore (nên `**/*.md` bắt cả `AGENTS.md` ở gốc kho). Từ 1.31.0 `/acceptance-gate:acceptance-init` phát sẵn `PRODUCT-MAP.md` — bản đồ là view máy sinh lại ở mỗi lần đóng cổng, không phải thứ để nghiệm thu
```

- [ ] **Step 4: Chạy suite — GL09 PASS; ba suite khác không đổi màu**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E "GL09|^Results:"`; rồi `bash tests/plugins/run-tests.sh | tail -3` (P-case canh GUIDE/README có thể đọc hàng này — nếu đỏ, đọc thông điệp ca đó trước khi sửa).
Expected: `PASS: GL09`; `0 failed`.

- [ ] **Step 5: Commit + set contract implemented**

```bash
git add GUIDE.md tests/scripts/run-tests.sh
git commit -m "docs(guide): ngữ nghĩa glob của t1_skip_globs/t3_paths — \`*\` vượt /, \`**/\` không-hoặc-nhiều thư mục — GL09"
```
Sau đó đổi `status: approved` → `status: implemented` trong `_acceptance/glob-hai-sao-khop-goc-kho/contract.md`, commit riêng `chore(acceptance): glob-hai-sao-khop-goc-kho implemented`.

---

## Self-review

- Spec coverage: Quyết định (Task 1) · Cơ chế + marker (Task 1) · Kế hoạch đo GL01–GL10 (Task 1–3) · chiều đỏ mutant (Task 2) · Tài liệu (Task 3). Ngoài phạm vi: không task nào chạm thông điệp VIOLATION hay config consumer.
- Placeholder: không TBD/TODO; mọi bước code có mã.
- Tên nhất quán: `glob_variants`, `match_globs`, `mk_glob_repo`, `mk_glob_pr_repo`, marker `GLOB-DOUBLESTAR-ZERO-DIRS`, slug fixture `feat-gl`.
