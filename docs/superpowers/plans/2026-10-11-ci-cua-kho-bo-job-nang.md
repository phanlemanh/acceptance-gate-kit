# `pre-merge-check.sh --hang-pr` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Một chế độ của chính cổng in hạng PR + bit `cham_vat` cho GitHub Actions, đọc đúng `t1_skip_globs`/`t3_paths` của kho bằng đúng bộ khớp của cổng; nghi ngờ thì chạy đủ; kho không truyền cờ thì cổng không đổi byte.

**Architecture:** Bốn vùng chèn trong `scripts/pre-merge-check.sh`, mỗi vùng giữa `# >>> HANG-PR` … `# <<< HANG-PR`: (R1) dòng Usage + khối khoá `HANG-PR-KHOA`; (R2) nhánh `--hang-pr)` trong vòng parse; (R3) sau chốt env-rỗng: nuốt stdout/stderr của cổng vào tệp tạm, cài bẫy `EXIT` in «chạy đủ»; (R4) ngay sau khối «Phân loại diff-chịu-cổng»: thang nghi ngờ rồi phân loại từ `DIFF_*`, `exit 0`. Một tệp ca `tests/scripts/hang-pr.test.mjs` dựng kho git mẫu trong lần chạy.

**Tech Stack:** bash (cổng), Node ≥ 18 ESM (tệp ca, `node:child_process`, `node:fs`), git.

**Spec:** `docs/superpowers/specs/2026-10-11-ci-cua-kho-bo-job-nang-design.md` · hợp đồng `_acceptance/ci-cua-kho-bo-job-nang/contract.md` (11 AC) · `evals.yaml` (E1–E12).

## Global Constraints

- Mọi dòng thêm vào `scripts/pre-merge-check.sh` nằm trong vùng `# >>> HANG-PR` … `# <<< HANG-PR`; KHÔNG sửa dòng có sẵn nào (AC-8 vế lịch sử).
- Mọi commit chạm `scripts/pre-merge-check.sh` mang chuỗi `ci-cua-kho-bo-job-nang` trong thông điệp, không phải commit gộp.
- Không đổi tên/dời/sửa thân `glob_variants`, `match_globs`, `config_list` (crm #369; vòng A, G3).
- Khoá đầu ra: `hang` ∈ {`T1`,`ho-so`,`T2`,`T3`,`khong-ro`} · `cham_vat` ∈ {`true`,`false`} · `ly_do` ∈ {`phan-loai`,`khong-co-pham-vi-diff`,`diff-rong`,`doi-danh-sach-hang`,`cau-hinh-loi`,`khong-phan-loai-duoc`}.
- Bất biến: `cham_vat=false` ⟺ `ly_do=phan-loai` ∧ `hang` ∈ {`T1`,`ho-so`}.
- Mã thoát của chế độ: 0 cho mọi phán quyết; lỗi cú pháp tham số giữ mã 2 hôm nay.
- Tệp ca: đường dẫn suy từ vị trí tệp; ma trận viết trước (hằng); bản sao đột biến lấy TRỌN `scripts/` + `lib/`; kim khớp đúng một lần; dòng PASS không chứa chữ «exit <số>».
- Tên ca = mã AC; `HP_CASES` chọn ca; mã lạ → thoát 2; mặc định (không biến) chạy mọi ca TRỪ `AC-8-kho-that`.
- Không có `HP_CASES` mà 0 ca chạy → đỏ.

## Review Focus

- Kho có `_acceptance/` nằm sâu (monorepo `pkg/_acceptance/`) — đường diff tính từ gốc git nên cổng coi `pkg/docs/a.md` là ngoài T1; chế độ «một nguồn» phải ra đúng như cổng (`T2`/`true` — chạy đủ), không tự «sửa» thành T1. Ca: Task 2 bước «gốc lồng».
- Tên tệp có khoảng trắng trong diff — `DIFF_FILES` tách theo dòng; chế độ không được tách theo khoảng trắng. Ca: Task 1 thêm hàng `docs/có khoảng.md` → T1.
- Lời cảnh báo có `%` hay xuống dòng — GitHub đọc `%0A` là xuống dòng; thông điệp phải thoát `%`, `\r`, `\n`. Ca: Task 2 ref tên chứa `%` → đúng một dòng `::warning`.
- Biến `GITHUB_OUTPUT` trỏ tệp chưa tồn tại — GitHub luôn tạo trước, nhưng chạy tay thì không; `>>` tự tạo, không lỗi. Ca: Task 1 AC-6 dùng tệp đã có; Task 2 thêm tệp chưa có → được tạo với đúng ba dòng.
- `TMPDIR` không ghi được — `mktemp` hỏng thì bẫy chưa cài; chế độ phải tự in «chạy đủ» và thoát 0. Ca: Task 2 `TMPDIR=/khong-co` → `khong-ro`/`true`/`khong-phan-loai-duoc`, mã 0.

---

### Task 1: Chế độ phân loại + kênh đầu ra (AC-1, AC-2, AC-6, AC-7)

**independent:** false · **phục vụ:** E1, E2, E6, E7

**Files:**
- Create: `tests/scripts/hang-pr.test.mjs`
- Modify: `scripts/pre-merge-check.sh` (R1 sau dòng 4; R2 trước nhánh `-*)` của vòng parse; R3 sau chốt `PMB_SET_EMPTY`; R4 sau dòng `DIFF_GATED_FIRST=…`)

**Interfaces:**
- Produces (tệp ca, dùng ở Task 2–4): `const KIT`, `GATE = path.join(KIT,'scripts','pre-merge-check.sh')`; `khoMau({ goc, pr, cauHinh, khongAcc })` → `{ dir }` (kho git: nhánh `main` = commit gốc, HEAD = commit PR); `chay(gate, dir, args, env)` → `{ status, stdout, stderr }`; `docKetQua(stdout)` → `{ hang, cham_vat, ly_do, canhBao: string[] , le: string[] }` (le = dòng không thuộc khuôn); `docKhoa(gateText)` → `{ hang:[], cham_vat:[], ly_do:[] }` từ khối `HANG-PR-KHOA`; `banSao(mutate)` → đường gate trong bản sao trọn `scripts/`+`lib/` sau khi `mutate(text)` (kim khớp đúng một lần, không thì ném); `ca(id, fn)` đăng ký ca.
- Produces (cổng): hàm shell `hp_in <hang> <cham_vat> <ly_do> [<cảnh báo>]`, biến `HP_TAM`, fd 7 (stdout thật).

- [ ] **Step 1: Viết tệp ca với ma trận AC-1 (đỏ trước).** Hằng ma trận:

```js
const CAU_HINH = `schema_version: 1
risk_tiers:
  t1_skip_globs:
    - "docs/**"
    - "*.md"
    - "**/*.txt"
    - ".github/workflows/ci.yml"
  t3_paths:
    - "core/**"
`;
// [tên hàng, tệp PR đổi, hang, cham_vat]
const MA_TRAN = [
  ['chi-t1', ['docs/a.md'], 'T1', 'false'],
  ['sao-vuot-gach', ['notes/x/y.md'], 'T1', 'false'],
  ['hai-sao-o-goc', ['README.txt'], 'T1', 'false'],
  ['chi-ho-so', ['_acceptance/s1/contract.md'], 'ho-so', 'false'],
  ['ho-so-va-t1', ['_acceptance/s1/run-log.jsonl', 'docs/b.md'], 'ho-so', 'false'],
  ['thuoc-ho-so', ['_acceptance/s1/rang/do.mjs'], 'ho-so', 'false'],
  ['vat', ['src/a.ts'], 'T2', 'true'],
  ['vat-va-ho-so', ['src/a.ts', '_acceptance/s1/contract.md'], 'T2', 'true'],
  ['t3', ['core/x.ts'], 'T3', 'true'],
  ['t3-vat-t1', ['core/x.ts', 'src/a.ts', 'docs/a.md'], 'T3', 'true'],
  ['ci-khai', ['.github/workflows/ci.yml'], 'T1', 'false'],
  ['ci-khong-khai', ['.github/workflows/acceptance.yml'], 'T2', 'true'],
  ['ten-co-khoang', ['docs/có khoảng.md'], 'T1', 'false'],
];
```

Ca `AC-1` (12 hàng hợp đồng + hàng `ten-co-khoang` của Review Focus): mỗi hàng dựng kho (`khoMau({ goc: {'_acceptance/config.yaml': CAU_HINH, 'docs/a.md':'a\n', 'src/a.ts':'a\n', 'core/x.ts':'a\n'}, pr: Object.fromEntries(tệp.map(t => [t, 'doi\n'])) })`), chạy `chay(GATE, dir, ['.', '--base', 'main', '--hang-pr'])`, đòi `status === 0`, `le.length === 0`, `canhBao.length === 0`, `hang`/`cham_vat` khớp hàng, `ly_do === 'phan-loai'`. Một khẳng định mỗi hàng; dòng cuối in `số khẳng định = số hàng`.

- [ ] **Step 2: Chạy, xác nhận đỏ.** `HP_CASES=AC-1 node tests/scripts/hang-pr.test.mjs` → FAIL «unknown option --hang-pr» (mã 2 từ cổng).

- [ ] **Step 3: Chèn R1–R4 vào cổng.**

R1 (ngay sau dòng 4 `#        pre-merge-check.sh ... [--recheck-all]`):

```bash
# >>> HANG-PR
#        pre-merge-check.sh [repo_root] --base <ref> --hang-pr
#
# --hang-pr: chế độ CHỈ phân loại PR cho CI của kho (hồ sơ ci-cua-kho-bo-job-nang).
# In ba dòng khoá=giá-trị ra stdout (và nối vào $GITHUB_OUTPUT khi có), một dòng
# vào $GITHUB_STEP_SUMMARY khi có, rồi thoát 0 — không chạy luật nào của cổng.
# Dùng CHÍNH bộ khớp, bộ đọc danh sách và khối «Phân loại diff-chịu-cổng» bên
# dưới. Không chứng minh được thì `cham_vat=true` (nghi ngờ thì chạy đủ).
# <<<HANG-PR-KHOA
# hang: T1 ho-so T2 T3 khong-ro
# cham_vat: true false
# ly_do: phan-loai khong-co-pham-vi-diff diff-rong doi-danh-sach-hang cau-hinh-loi khong-phan-loai-duoc
# HANG-PR-KHOA>>>
# <<< HANG-PR
```

R2 (trong `case "$1" in` của vòng parse, ngay TRƯỚC nhánh `-*)`):

```bash
    # >>> HANG-PR
    --hang-pr)
      HANG_PR=1; shift ;;
    # <<< HANG-PR
```

R3 (ngay sau khối `if [ "$PMB_SET_EMPTY" -eq 1 ] && [ -z "$BASE" ]; then … fi`):

```bash
# >>> HANG-PR
if [ "${HANG_PR:-0}" = 1 ]; then
  hp_in() { # <hang> <cham_vat> <ly_do> [<cảnh báo>] — in MỘT lần, ra fd 7 (stdout thật)
    HP_DA_IN=1
    printf 'hang=%s\ncham_vat=%s\nly_do=%s\n' "$1" "$2" "$3" >&7
    [ -n "${GITHUB_OUTPUT:-}" ] && printf 'hang=%s\ncham_vat=%s\nly_do=%s\n' "$1" "$2" "$3" >> "$GITHUB_OUTPUT"
    if [ -n "${4:-}" ]; then
      local m="${4//%/%25}"; m="${m//$'\r'/%0D}"; m="${m//$'\n'/%0A}"
      printf '::warning title=hang-pr::%s\n' "$m" >&7
    fi
    [ -n "${GITHUB_STEP_SUMMARY:-}" ] && printf 'Hạng PR: **%s** · chạm vật: %s · `%s`\n' "$1" "$2" "$3" >> "$GITHUB_STEP_SUMMARY"
    return 0
  }
  exec 7>&1
  HP_DA_IN=0
  if ! HP_TAM="$(mktemp -d "${TMPDIR:-/tmp}/hang-pr.XXXXXX" 2>/dev/null)"; then
    hp_in khong-ro true khong-phan-loai-duoc "không tạo được thư mục tạm (TMPDIR) — chạy đủ"; exit 0
  fi
  exec >"$HP_TAM/cong.log" 2>&1
  hp_bay() {
    [ "$HP_DA_IN" = 1 ] || hp_in khong-ro true khong-phan-loai-duoc "cổng dừng trước khi phân loại: $(tail -n 1 "$HP_TAM/cong.log" 2>/dev/null)"
    rm -f "$HP_TAM/cong.log" "$HP_TAM/goc/_acceptance/config.yaml"; rmdir "$HP_TAM/goc/_acceptance" "$HP_TAM/goc" "$HP_TAM" 2>/dev/null
    exit 0
  }
  trap hp_bay EXIT
fi
# <<< HANG-PR
```

R4 (ngay sau dòng `DIFF_GATED_FIRST="$(printf '%s%s' "$DIFF_T3_HITS" "$DIFF_NONT1_HITS" | head -1)"`):

```bash
# >>> HANG-PR
if [ "${HANG_PR:-0}" = 1 ]; then
  if [ ! -f "$ACC/config.yaml" ]; then
    hp_in khong-ro true cau-hinh-loi "_acceptance/config.yaml vắng — chạy đủ"
  elif grep -q '^VIOLATION \[config\]' "$HP_TAM/cong.log"; then
    hp_in khong-ro true cau-hinh-loi "$(grep -m 1 '^VIOLATION \[config\]' "$HP_TAM/cong.log")"
  elif [ "$DIFF_READY" -eq 0 ]; then
    if [ -n "$BASE" ]; then hp_in khong-ro true khong-co-pham-vi-diff "$DIFF_SKIP_NOTE"; else hp_in khong-ro true khong-co-pham-vi-diff; fi
  elif [ -z "$DIFF_FILES" ]; then
    hp_in khong-ro true diff-rong "diff \"$BASE\"...HEAD rỗng — không chứng minh được PR không chạm vật"
  else
    HP_MB="$(git -C "$ROOT" merge-base "$BASE_SHA" HEAD 2>/dev/null || true)"
    mkdir -p "$HP_TAM/goc/_acceptance"
    HP_T1_GOC="<vang>"; HP_T3_GOC="<vang>"
    if [ -n "$HP_MB" ] && git -C "$ROOT" show "$HP_MB:./_acceptance/config.yaml" > "$HP_TAM/goc/_acceptance/config.yaml" 2>/dev/null; then
      HP_T1_GOC="$(ACC="$HP_TAM/goc/_acceptance"; config_list t1_skip_globs)"
      HP_T3_GOC="$(ACC="$HP_TAM/goc/_acceptance"; config_list t3_paths)"
    fi
    if [ "$HP_T1_GOC" != "$T1_GLOBS" ] || [ "$HP_T3_GOC" != "$T3_PATHS" ]; then
      hp_in khong-ro true doi-danh-sach-hang
    elif [ -n "$DIFF_T3_HITS" ]; then hp_in T3 true phan-loai
    elif [ -n "$DIFF_NONT1_HITS" ]; then hp_in T2 true phan-loai
    elif [ "$DIFF_GATE_TOUCHED" -eq 1 ]; then hp_in ho-so false phan-loai
    else hp_in T1 false phan-loai
    fi
  fi
  exit 0
fi
# <<< HANG-PR
```

- [ ] **Step 4: Chạy AC-1, xác nhận xanh.** `HP_CASES=AC-1 node tests/scripts/hang-pr.test.mjs` → `PASS: AC-1 … 13/13`.

- [ ] **Step 5: Thêm ca AC-2, AC-2-do, AC-6, AC-6-do, AC-7.**
  - `AC-2`: tám hàng không chạm `_acceptance/` (chi-t1, sao-vuot-gach, hai-sao-o-goc, vat, t3, t3-vat-t1, ci-khai, ci-khong-khai); chạy cổng KHÔNG cờ `['.', '--base', 'main']`; `loaiPR(stdout)` = tập {`T3` nếu có dòng bắt đầu `VIOLATION [PR]: T3 paths`, `nonT1` nếu có `VIOLATION [PR]: non-T1`}; kỳ vọng viết trước theo hạng: `T1`→∅, `T2`→{nonT1}, `T3`→{T3}; so tập, 8 khẳng định.
  - `AC-2-do`: `banSao(t => t.replace('      glob_variants "$1$pre" "$post"          # GLOB-DOUBLESTAR-ZERO-DIRS\n', '      :\n'))`; trên hàng `hai-sao-o-goc`: bản nguyên vẹn ra `T1` và loaiPR ∅ (đối chứng dương); bản đột biến ra `T2` VÀ loaiPR {nonT1}; không thì FAIL «README.txt lật cùng cổng».
  - `AC-6`: hàng `chi-t1`; env `GITHUB_OUTPUT=<tệp có 'co_san=1\n'>`, `GITHUB_STEP_SUMMARY=<tệp rỗng>`; đòi tệp output = `co_san=1\nhang=T1\ncham_vat=false\nly_do=phan-loai\n`; summary đúng 1 dòng chứa `T1`; stdout đúng 3 dòng; lần chạy thứ hai không hai biến, trong thư mục `TMPDIR` riêng → sau lần chạy thư mục tạm rỗng và cây kho mẫu `git status --porcelain` rỗng. Mọi khoá/giá trị in ra ∈ `docKhoa(readFileSync(GATE))`.
  - `AC-6-do`: `banSao(t => t.replace('  exec >"$HP_TAM/cong.log" 2>&1\n', ''))` → stdout > 3 dòng (dòng WARNING recheck của cổng lọt) → ca đỏ «dòng của cổng lọt ra»; bản nguyên vẹn đúng 3 dòng.
  - `AC-7`: với MỖI giá trị `ly_do` trong `docKhoa(...)`, một kịch bản dựng bằng hàm `kichBan[ly_do]()` (phan-loai: chi-t1 · khong-co-pham-vi-diff: không `--base` · diff-rong: `--base HEAD` · doi-danh-sach-hang: thêm `src/**` vào t1 cùng `src/a.ts` · cau-hinh-loi: config có TAB · khong-phan-loai-duoc: `--base khong-co-ref`) → mã 0 và `ly_do` đúng; giá trị trong khối mà `kichBan` thiếu → FAIL «ly_do trong khối không có kịch bản». Hai ca mã 2: `['.', '--hang-pr', '--base', '']` → stderr chứa «--base requires a value»; `['.', '--hang-prr']` → stderr chứa «unknown option».

- [ ] **Step 6: Chạy, xanh.** `HP_CASES=AC-1,AC-2,AC-2-do,AC-6,AC-6-do,AC-7 node tests/scripts/hang-pr.test.mjs` → mọi dòng PASS. Kiểm phá-thử: tạm đổi một kỳ vọng trong `MA_TRAN` → AC-1 đỏ với tên hàng; hoàn lại.

- [ ] **Step 7: Commit.**

```bash
git add scripts/pre-merge-check.sh tests/scripts/hang-pr.test.mjs
git commit -m "feat(pre-merge): chế độ --hang-pr in hạng PR + cham_vat (ci-cua-kho-bo-job-nang)"
```

### Task 2: Thang nghi ngờ (AC-3, AC-4, AC-5 + Review Focus)

**independent:** false · **phục vụ:** E3, E4, E5

**Files:**
- Modify: `tests/scripts/hang-pr.test.mjs`
- Modify (chỉ khi ca đỏ chỉ ra): `scripts/pre-merge-check.sh` trong vùng R3/R4

**Interfaces:**
- Consumes: `khoMau`, `chay`, `docKetQua`, `banSao`, `ca`, `CAU_HINH` của Task 1.

- [ ] **Step 1: Viết ca AC-3, AC-3-im, AC-3-do.**
  - `AC-3`: ba kho — (a) PR đổi config thêm `    - "src/**"` vào t1 + `src/a.ts`; (b) PR đổi config bỏ dòng `    - "core/**"` + `core/x.ts`; (c) kho gốc không có `_acceptance/`, PR thêm `_acceptance/config.yaml` (= `CAU_HINH`) + `docs/a.md` → cả ba `khong-ro`/`true`/`doi-danh-sach-hang`, mã 0, 0 cảnh báo.
  - `AC-3-im`: PR thêm khối `feature_loop:\n  suite_keys: [executors.test.a]\n` vào cuối config + `docs/a.md` → `ho-so`/`false`/`phan-loai`.
  - `AC-3-do`: `banSao(t => t.replace('    if [ "$HP_T1_GOC" != "$T1_GLOBS" ] || [ "$HP_T3_GOC" != "$T3_PATHS" ]; then\n', '    if false; then\n'))` → (a) và (c) ra `ho-so`/`false`; bản nguyên vẹn `khong-ro`/`true`; không thì FAIL «PR tự nới danh sách».

- [ ] **Step 2: Viết ca AC-4, AC-4-do.**
  - `AC-4`: (1) `chi-t1` không `--base` → `khong-co-pham-vi-diff`, 0 cảnh báo; (2) `--base khong-co-ref` → `khong-ro`/`khong-phan-loai-duoc`, đúng 1 cảnh báo chứa «không resolve được»; (3) kho có nhánh `roi` dựng bằng `git checkout --orphan` + commit, `--base roi` → `khong-co-pham-vi-diff` + 1 cảnh báo; (4) `--base HEAD` → `diff-rong` + 1 cảnh báo; (5) kho không có `_acceptance/` → `khong-phan-loai-duoc` + 1 cảnh báo; đối chứng dương cùng kho (1) với `--base main` → `phan-loai`. Mỗi lần mã 0, `cham_vat=true`.
  - Review Focus trong cùng ca: (6) `--base 'khong%co'` (ref không có, tên chứa `%`) → đúng 1 dòng cảnh báo, chứa `%25`, không chứa `%co`; (7) `TMPDIR=/khong-co-thu-muc` → `khong-ro`/`true`/`khong-phan-loai-duoc`, mã 0; (8) `GITHUB_OUTPUT` trỏ tệp chưa có → được tạo với đúng ba dòng; (9) gốc lồng: kho có `pkg/_acceptance/config.yaml`, chạy `chay(GATE, path.join(dir,'pkg'), ['.', '--base','main','--hang-pr'])` với PR chỉ `pkg/docs/a.md` → `T2`/`true` (khớp cổng không cờ: dòng `VIOLATION [PR]: non-T1`).
  - `AC-4-do`: mốc chèn = dòng `DIFF_GATED_FIRST="$(printf '%s%s' "$DIFF_T3_HITS" "$DIFF_NONT1_HITS" | head -1)"`; bản (a) chèn `exit 1` TRƯỚC dòng đó, bản (b) chèn `: "$HP_BIEN_CHUA_KHAI"` → mỗi bản trên `chi-t1` ra `khong-ro`/`true`/`khong-phan-loai-duoc`, mã 0, đúng 1 cảnh báo; không thì FAIL «lối dừng thoát khác 0».

- [ ] **Step 3: Viết ca AC-5.** (a) config có một dòng thụt bằng TAB (`risk_tiers:\n\tt1_skip_globs:` …) → `cau-hinh-loi` + 1 cảnh báo chứa `VIOLATION [config]`; (b) kho có `_acceptance/s1/contract.md` nhưng không `config.yaml` → `cau-hinh-loi`; đối chứng: `chi-t1` config lành → `T1`/`false`.

- [ ] **Step 4: Chạy, sửa vùng R3/R4 nếu ca nào đỏ.** `HP_CASES=AC-3,AC-3-im,AC-3-do,AC-4,AC-4-do,AC-5 node tests/scripts/hang-pr.test.mjs` → mọi dòng PASS. Mọi sửa nằm trong vùng marker; ghi một dòng sổ `fix` (stage S3) nếu phải đổi hướng so với kế hoạch.

- [ ] **Step 5: Commit.**

```bash
git add tests/scripts/hang-pr.test.mjs scripts/pre-merge-check.sh
git commit -m "test(pre-merge): thang nghi ngờ của --hang-pr (ci-cua-kho-bo-job-nang)"
```

### Task 3: Bất biến «không đổi byte» và «crm không mất bộ khớp» (AC-8, AC-9)

**independent:** false · **phục vụ:** E8, E9, E10

**Files:**
- Modify: `tests/scripts/hang-pr.test.mjs`

**Interfaces:**
- Produces: `catMarker(text)` → text bỏ mọi dòng từ `# >>> HANG-PR` tới `# <<< HANG-PR` (kể cả hai dòng marker, cho phép thụt đầu dòng); `demMarker(text)` → `{ mo, dong, dungThuTu }`; `soHaiBan(gateDay, gateCat, dir, args)` → `null` nếu stdout+mã giống từng byte, chuỗi mô tả khác biệt nếu không; `lichSuVong(repoDir, grep)` → `[{ sha, ok }]`.

- [ ] **Step 1: Ca AC-8, AC-8-do.** Bản cắt = `banSao(catMarker)`. Trên 13 kho của `MA_TRAN` (có `--base main`, KHÔNG cờ) + kho `chi-t1` không `--base`: `soHaiBan` phải `null` mọi lần. `demMarker(GATE)`: `mo === dong >= 1` và đúng thứ tự. `AC-8-do`: `banSao(t => t.replace('# >>> HANG-PR\nif [ "${HANG_PR:-0}" = 1 ]; then\n  if [ ! -f', '# >>> HANG-PR\necho hp-lot\nif [ "${HANG_PR:-0}" = 1 ]; then\n  if [ ! -f'))` → `soHaiBan(dot bien, cat)` KHÁC null trên `chi-t1`; không thì FAIL «vùng HANG-PR chạy khi không có cờ».

- [ ] **Step 2: Ca AC-8-lich-su, AC-8-lich-su-do.** `lichSuVong(KIT, 'ci-cua-kho-bo-job-nang')`: `git log --no-merges --format=%H --grep=<grep> -- scripts/pre-merge-check.sh`; mỗi commit `C`: `catMarker(show C:file) === catMarker(show C^:file)`; ≥ 1 commit. Đỏ: kho mẫu commit cha = `git -C KIT show d9d1f3a6:scripts/pre-merge-check.sh`, commit con = tệp hiện tại, thông điệp `x ci-cua-kho-bo-job-nang` → mọi `ok`; kho mẫu thứ hai: con = tệp hiện tại với `nothing to check` → `nothing to chek` → có `ok === false`; không thì FAIL «dòng ngoài HANG-PR đổi».

- [ ] **Step 3: Ca AC-8-kho-that (chỉ chạy khi gọi tên).** `soHaiBan(GATE, cat, KIT, ['.', '--base', 'd9d1f3a6'])` và `['.']` → `null` cả hai.

- [ ] **Step 4: Ca AC-9, AC-9-do.** Hằng `RUT_HAM` chép NGUYÊN VĂN từ crm `.github/scripts/phan-loai.mjs` (PR #369, ghi sha đầu nhánh lúc chép trong chú thích); `spawnSync('bash', ['-c', RUT_HAM, 'phan-loai', GATE, 'docs/**\n*.md\n**/*.txt'], { input: 'docs/a.md\nnotes/x/y.md\nREADME.txt\nsrc/a.ts\n' })` → `status 0`, stdout tách dòng = `['docs/a.md','notes/x/y.md','README.txt']`. Đỏ: `banSao(t => t.replace('\nmatch_globs() {', '\nkhop_globs() {'))` → `status 3`; không thì FAIL «crm mất bộ khớp».

- [ ] **Step 5: Chạy, xanh.** `HP_CASES=AC-8,AC-8-do,AC-8-lich-su,AC-8-lich-su-do,AC-9,AC-9-do node tests/scripts/hang-pr.test.mjs` rồi `HP_CASES=AC-8-kho-that node tests/scripts/hang-pr.test.mjs`. AC-8-lich-su đòi Task 1–2 đã commit với slug trong thông điệp.

- [ ] **Step 6: Commit.** `git add tests/scripts/hang-pr.test.mjs && git commit -m "test(pre-merge): --hang-pr không đổi byte cổng, giữ bộ khớp crm (ci-cua-kho-bo-job-nang)"`

### Task 4: Tài liệu cho kho (AC-10) + ADR

**independent:** false · **phục vụ:** E11

**Files:**
- Modify: `GUIDE.md` (cuối §5.3, trước tiêu đề mục kế tiếp)
- Modify: `CHANGELOG.md` (mục «Chưa phát hành»)
- Create: `docs/adr/0022-che-do-phan-loai-pr-song-trong-cong.md` (số kế tiếp chưa dùng ở `main` lẫn PR đang mở — kiểm lại ngay trước khi ghi)
- Modify: `tests/scripts/hang-pr.test.mjs`

- [ ] **Step 1: Ca AC-10, AC-10-do (đỏ trước).** `kiemTaiLieu(guideText, changelogText, gateText)` → mảng lỗi. GUIDE §5.3 = từ dòng `### 5.3 ` tới dòng tiêu đề `##`/`###` kế. Đòi trong §5.3: `--hang-pr` · `fetch-depth: 0` · một dòng khớp `/if:.*!cancelled\(\).*cham_vat != 'false'/` · chữ `paths-ignore` cùng chữ `Expected` · câu chứa `đọc hồ sơ` · mỗi `outputs\.([a-z_]+)` ∈ khoá của `docKhoa(gateText)` (lỗi «khoá GUIDE không có trong HANG-PR-KHOA») · thiếu `!cancelled()` → lỗi «hang-pr hỏng thì test bị bỏ». Đầu tệp cổng (trước `set -u`) chứa `--hang-pr`. CHANGELOG «Chưa phát hành» chứa `--hang-pr` và `không truyền cờ`. `AC-10-do`: GUIDE với `cham_vat`→`cham_ma` → có lỗi khoá; GUIDE gỡ `!cancelled() && ` → có lỗi «hang-pr hỏng thì test bị bỏ»; GUIDE thật → 0 lỗi.

- [ ] **Step 2: Chạy, đỏ.** `HP_CASES=AC-10 node tests/scripts/hang-pr.test.mjs` → FAIL (GUIDE chưa có mục).

- [ ] **Step 3: Viết mục GUIDE §5.3 «Bỏ job nặng cho PR không chạm vật (tuỳ chọn)»** — đoạn workflow của design §2.5 với `if: ${{ !cancelled() && needs.hang-pr.outputs.cham_vat != 'false' }}`, bảng bốn hàng, ba điều (`!cancelled()` + `!= 'false'` · lọc cấp job không `paths-ignore` vì check bắt buộc treo «Expected» · job đọc hồ sơ đừng gắn vào bit), một câu cho kho đang chép kit (gọi `scripts/pre-merge-check.sh` bản chép — không thêm tệp nào), bảng khoá đầu ra.

- [ ] **Step 4: CHANGELOG «Chưa phát hành»** — một mục: tên hồ sơ, hàng C1, cờ `--hang-pr`, «Ai bị ảnh hưởng: kho không truyền cờ — cổng không đổi», «Nhận mốc ở crm: thay khối `sed` của `.github/scripts/phan-loai.mjs` bằng `--hang-pr`; giữ job `check` (oxlint quét `_acceptance/**/rang/`)».

- [ ] **Step 5: ADR một đoạn** — chế độ phân loại sống trong cổng (khó đảo: kho nối dây cờ; bất ngờ: tệp cổng làm thêm việc phân loại; đánh đổi: hạng T3 lấy một nguồn bộ khớp), dẫn design §3.

- [ ] **Step 6: Chạy AC-10, AC-10-do xanh; commit.** `git add GUIDE.md CHANGELOG.md docs/adr/0022-*.md tests/scripts/hang-pr.test.mjs && git commit -m "docs(guide): bỏ job nặng cho PR không chạm vật bằng --hang-pr (ci-cua-kho-bo-job-nang)"`

### Task 5: Cây xanh trọn (AC-11) + chuẩn bị S4

**independent:** false · **phục vụ:** E12 (và suite của lượt chấm)

**Files:** (chỉ sửa nếu ca đỏ chỉ ra)

- [ ] **Step 1: Ca mới chạy trong suite mặc định.** `node tests/scripts/hang-pr.test.mjs` (không biến) → mọi ca trừ `AC-8-kho-that` PASS; số ca in ra.
- [ ] **Step 2: Lưới tĩnh.** `node scripts/eval-coverage-lint.js .` → 0 dòng `ci-cua-kho-bo-job-nang`; `node scripts/product-map.mjs --root . --check` xanh (vẽ lại nếu lệch); P179 chạy riêng: `ONLY_BLOCK=P179 bash tests/plugins/run-tests.sh`.
- [ ] **Step 3: Đặt `status: implemented`** trong `contract.md`, commit, rồi XIN LƯỢT S4 ở Điều phối trước khi sinh args S4.
