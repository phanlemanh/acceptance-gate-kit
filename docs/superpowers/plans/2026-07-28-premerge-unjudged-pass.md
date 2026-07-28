# premerge-unjudged-pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `scripts/pre-merge-check.sh` phải từ chối bốn hình dạng hồ sơ hiện đang về `clean` mà không người nào từng phán — chữ ký không nêu tên người duyệt đã khai, và slug tự khai đã phát hành nhưng thiếu `contract.md` / `risk_tier` / `status`.

**Architecture:** Một vị ngữ dùng chung `claims_released()` trả lời "thư mục này có tự nhận đã qua cổng không", đặt cạnh `fm_field`/`front_field`. Ba call-site gọi nó: hai chốt thay hai `continue` câm trong vòng per-slug, và nhánh chữ ký sau chốt rỗng sẵn có. Danh sách người duyệt đọc một lần lúc parse config thành biến `APPROVERS` (một tên mỗi dòng).

**Tech Stack:** bash (POSIX-ish, `set -u`, không `set -e`), `sed`/`awk`/`case`. Test: `tests/scripts/run-tests.sh` — suite bash tự chế với helper `check` / `same` / `hasout` / `nothas`. Không framework.

## Global Constraints

- Ngôn ngữ script: **bash** (`#!/usr/bin/env bash`), đang chạy dưới `set -u` và **KHÔNG** `set -e`. Mọi lệnh có thể fail phải tự xử lý mã thoát.
- `violations=0` khởi tạo ở `scripts/pre-merge-check.sh:46`; `ACC="$ROOT/_acceptance"` ở `:154`; khối parse config `if [ -f "$ACC/config.yaml" ]` ở `:206-261`.
- Mọi dòng VIOLATION ra **stdout** (không `>&2`) và **phải** `violations=$((violations+1))`.
- Không được thêm luật vào sổ luật-đã-chạy: `LEDGER_EXPECTED` giữ nguyên 3 tên, dòng tổng kết giữ `expected=3`.
- Case test dùng tiền tố `UJ`. Helper: `check <tên> <exit mong đợi> <exit thật>` · `same <tên> <mong đợi> <thật>` · `hasout <tên> <chuỗi phải có> <output>` · `nothas <tên> <chuỗi không được có> <output>`.
- **Bất biến CLAUDE.md:** mọi case dựng fixture rồi kết luận từ "exit khác 0" PHẢI có (a) đối chứng dương — bản nguyên vẹn XANH trước — và (b) ghim đúng thông điệp, không chỉ mã thoát.
- Sửa nguồn xong PHẢI chạy `scripts/sync-plugin-packages.sh` và commit mirror cùng lượt (test P30 chặn drift).
- Từ vựng: dùng term chuẩn của `CONTEXT.md`, tránh mọi từ trong `_Avoid_` (`platform`→Surface, `log`→Evidence, `test`→Criterion).

## Ranh giới đã biết — KHÔNG cài trong plan này

**Hình dạng thứ năm, phát hiện lúc dựng code sau khi contract đã seal:** contract có `risk_tier` và `status: draft`, nhưng `evidence-report.md` khai `verdict: PASS`. `claims_released()` trả 0 (nhánh evidence), nhưng cả hai field đều có mặt nên hai chốt tàng hình không nổ, rồi `case "$status" in implemented|verified|signed-off)` rơi vào `*)` → `continue` câm. Slug vô hình y như hôm nay.

Contract vừa duyệt **không** phủ ô này: AC-10 chỉ nói contract `draft`/`approved` **và không evidence nào khai PASS** thì im lặng đúng thiết kế. Tổ hợp draft-nhưng-evidence-PASS là workspace tự mâu thuẫn và nằm ngoài 4 hình dạng đã đo.

Người cài đặt **KHÔNG được tự vá** ô này — đó là sửa trong vùng-không-đặc-tả, đúng thứ scope-triage sinh ra để chặn. Ghi lại, để S4 phân loại và Cổng 2 quyết.

---

## File Structure

| File | Trách nhiệm | Thay đổi |
|---|---|---|
| `scripts/pre-merge-check.sh` | Cổng biên merge — nguồn sự thật của mọi luật | Thêm `claims_released()`, `placeholder_signoff()`, `signoff_names_approver()`; parse `APPROVERS`; 2 chốt tàng hình; 3 nhánh chữ ký |
| `tests/scripts/run-tests.sh` | Suite của cổng | Thêm khối `UJ*` ở cuối, trước dòng `echo ""` / `Results:` |
| `commands/acceptance-init.md` | Tài liệu wire cổng cho repo mới | Sửa mô tả `signoff.approvers` từ "informational" thành đã-cưỡng-chế |
| `tests/plugins/run-tests.sh` | Suite tài liệu + mirror | Thêm case `P57` |
| `_acceptance/premerge-unjudged-pass/evidence/unjudged-messages.txt` | Bằng chứng cho judge E15 | Tạo mới, sinh máy |
| `plugins/**` | Build mirror | Sinh lại bằng `sync-plugin-packages.sh` |

Không tách file mới: cổng là một script đơn cố ý (consumer vendor đúng một file), và toàn bộ thêm mới ~90 dòng vào một file 700 dòng — vẫn dưới ngưỡng 800 của CLAUDE.md.

---

### Task 1: Vị ngữ `claims_released` + hai chốt tàng hình

**Files:**
- Modify: `scripts/pre-merge-check.sh:283` (thêm hàm sau `front_field`)
- Modify: `scripts/pre-merge-check.sh:450-458` (hai chốt)
- Test: `tests/scripts/run-tests.sh` (khối UJ mới, cuối file)

**Interfaces:**
- Produces: `claims_released <dir>` → exit 0 iff thư mục tự nhận đã qua cổng. Task 3 KHÔNG dùng hàm này (nhánh chữ ký chạy sau khi contract đã hợp lệ).
- Consumes: `fm_field <file> <key>` (đã có, `:269`).

**Phục vụ evals:** E6, E7, E8, E9, E10 (AC-6, AC-7, AC-8, AC-9, AC-10)

**independent:** false (cùng file với Task 2/3, vùng khác nhau)

- [ ] **Step 1: Viết case đỏ + đối chứng dương, chạy để thấy nó FAIL**

Chèn vào `tests/scripts/run-tests.sh`, ngay TRƯỚC dòng `echo ""` cuối file (dòng ngay trên `Results:`):

```bash
# ── UJ: PASS chưa ai phán (premerge-unjudged-pass) ─────────────────────────
UJR="$T/uj"; mkdir -p "$UJR"

# uj_repo <case> [config-thêm] — repo fixture; trả BASE sha qua UJ_BASE.
# Sha riêng từng fixture (cùng lý do như mk_gp_repo): cây + author + message
# giống hệt thì sha chỉ phụ thuộc dấu-thời-gian-giây.
uj_repo() {
  R="$UJR/$1"; rm -rf "$R"; mkdir -p "$R/_acceptance"
  { printf 'schema_version: 1\n'
    printf 'signoff:\n  required_for: [T2, T3]\n'
    [ -n "${2:-}" ] && printf '%s\n' "$2"
    printf '  require_human_commit: false\n'
  } > "$R/_acceptance/config.yaml"
  git init -q "$R"
  git -C "$R" add -A >/dev/null
  git -c user.email=t@t -c user.name=t -C "$R" commit -qm "uj base $1"
  UJ_BASE="$(git -C "$R" rev-parse --quiet --verify 'HEAD^{commit}' 2>/dev/null || true)"
  [ -n "$UJ_BASE" ] || { echo "FATAL: uj_repo $1 — không tạo được base commit trong $R" >&2; exit 1; }
}

# uj_slug <root> <slug> <contract-frontmatter-lines|-> <chữ ký|-|SKIP>
# "-" ở tham số 3 = KHÔNG tạo contract.md; "SKIP" ở tham số 4 = KHÔNG tạo evidence.
uj_slug() {
  d="$1/_acceptance/$2"; mkdir -p "$d"
  if [ "$3" != "-" ]; then printf -- '---\n%s\n---\n' "$3" > "$d/contract.md"; fi
  if [ "$4" != "SKIP" ]; then
    printf '#!/bin/sh\nexit 0\n' > "$1/verify-$2.sh"
    printf -- '---\nschema_version: 1\nfeature_slug: %s\nverdict: PASS\nhuman_signoff: %s\n---\n\n## Evidence\n- eval: E1\n  run_id: %s-E1-001\n  exit_code: 0\n  verifier: verify-%s.sh\n  verified_at: 2026-06-20\n' \
      "$2" "$4" "$2" "$2" > "$d/evidence-report.md"
  fi
}
UJ_FULL='schema_version: 1
feature: f
slug: SLUG
risk_tier: T3
surfaces: [api]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-06-10'
uj_full() { printf '%s' "$UJ_FULL" | sed "s/^slug: SLUG$/slug: $1/"; }

echo "UJ1 doi chung duong: ho so du + chu ky khop approvers -> OK, clean"
uj_repo uj1 '  approvers: ["Manh Phan", "memto"]'; R="$UJR/uj1"
uj_slug "$R" feat-ok "$(uj_full feat-ok)" "Manh Phan 2026-06-20"
UJ1="$(bash "$CHECK" "$R" 2>&1)"; check UJ1a 0 $?
hasout UJ1b "OK [feat-ok]: PASS, signed off by Manh Phan 2026-06-20" "$UJ1"
hasout UJ1c "pre-merge-check: clean" "$UJ1"
nothas UJ1d "VIOLATION" "$UJ1"

echo "UJ6 evidence khai PASS nhung KHONG co contract.md -> VIOLATION, khong tang hinh"
uj_repo uj6 '  approvers: ["Manh Phan"]'; R="$UJR/uj6"
uj_slug "$R" feat-ok "$(uj_full feat-ok)" "Manh Phan 2026-06-20"
uj_slug "$R" feat-ghost - "Manh Phan 2026-06-20"
UJ6="$(bash "$CHECK" "$R" 2>&1)"; UJ6ST=$?
check  UJ6a 1 "$UJ6ST"
hasout UJ6b "VIOLATION [feat-ghost]: no contract.md" "$UJ6"
nothas UJ6c "pre-merge-check: clean" "$UJ6"
hasout UJ6d "OK [feat-ok]" "$UJ6"

echo "UJ7 tu khai da phat hanh nhung THIEU risk_tier -> VIOLATION neu dich danh field"
uj_repo uj7 '  approvers: ["Manh Phan"]'; R="$UJR/uj7"
uj_slug "$R" feat-notier 'schema_version: 1
feature: f
slug: feat-notier
surfaces: [api]
status: signed-off
approved_by: Manh Phan' "Manh Phan 2026-06-20"
UJ7="$(bash "$CHECK" "$R" 2>&1)"; check UJ7a 1 $?
hasout UJ7b "risk_tier" "$UJ7"
hasout UJ7c "VIOLATION [feat-notier]" "$UJ7"

echo "UJ8 THIEU status -> VIOLATION; UJ8neg draft/approved -> im lang (ca duoi nguong)"
uj_repo uj8 '  approvers: ["Manh Phan"]'; R="$UJR/uj8"
uj_slug "$R" feat-nostatus 'schema_version: 1
feature: f
slug: feat-nostatus
risk_tier: T3
surfaces: [api]
approved_by: Manh Phan' "Manh Phan 2026-06-20"
UJ8="$(bash "$CHECK" "$R" 2>&1)"; check UJ8a 1 $?
hasout UJ8b "status" "$UJ8"
for st in draft approved; do
  uj_repo "uj8n-$st" '  approvers: ["Manh Phan"]'; R="$UJR/uj8n-$st"
  uj_slug "$R" feat-wip "schema_version: 1
feature: f
slug: feat-wip
risk_tier: T3
surfaces: [api]
status: $st
approved_by: Manh Phan" SKIP
  UJ8N="$(bash "$CHECK" "$R" 2>&1)"; check "UJ8neg-$st" 0 $?
  nothas "UJ8neg-$st-2" "VIOLATION" "$UJ8N"
done

echo "UJ9 contract khai signed-off, thieu risk_tier, KHONG co evidence -> VIOLATION"
uj_repo uj9 '  approvers: ["Manh Phan"]'; R="$UJR/uj9"
uj_slug "$R" feat-noev 'schema_version: 1
feature: f
slug: feat-noev
surfaces: [api]
status: signed-off
approved_by: Manh Phan' SKIP
# Chot fixture: KHONG duoc co evidence-report.md, neu khong case nay do nhanh
# evidence chu khong do nhanh contract cua claims_released.
[ ! -f "$R/_acceptance/feat-noev/evidence-report.md" ]; check UJ9fix 0 $?
UJ9="$(bash "$CHECK" "$R" 2>&1)"; check UJ9a 1 $?
hasout UJ9b "VIOLATION [feat-noev]" "$UJ9"

echo "UJ10 scaffold bo hoang -> IM LANG (doi chung duong cua nhom tang hinh)"
uj_repo uj10 '  approvers: ["Manh Phan"]'; R="$UJR/uj10"
uj_slug "$R" feat-ok "$(uj_full feat-ok)" "Manh Phan 2026-06-20"
mkdir -p "$R/_acceptance/feat-empty"
UJ10="$(bash "$CHECK" "$R" 2>&1)"; check UJ10a 0 $?
nothas UJ10b "feat-empty" "$UJ10"
hasout UJ10c "pre-merge-check: clean" "$UJ10"
```

- [ ] **Step 2: Chạy suite, xác nhận ĐÚNG các case mới FAIL**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E 'UJ[0-9]'`

Expected: `UJ1*` và `UJ10*` PASS ngay (hành vi hôm nay đã đúng cho đối chứng dương); `UJ6a/UJ6b`, `UJ7a/UJ7b/UJ7c`, `UJ8a/UJ8b`, `UJ9a/UJ9b` **FAIL** — vì cổng hiện im lặng. Nếu `UJ1*` cũng đỏ thì fixture sai, sửa fixture trước khi đi tiếp.

- [ ] **Step 3: Thêm `claims_released()` vào script**

Chèn ngay sau hàm `front_field` (sau dòng `}` ở `scripts/pre-merge-check.sh:283`):

```bash
claims_released() { # <dir> — 0 iff thư mục TỰ NHẬN đã qua cổng.
  # Đọc bằng fm_field (BẤT KỲ dòng nào) chứ không front_field (chỉ frontmatter
  # dẫn đầu) là CỐ Ý: đây là bộ DÒ, doctrine là rộng-khi-dò/chặt-khi-nhận. Một
  # fence hỏng hoặc lệch không được phép mua lấy sự vô hình — đó đúng là thứ
  # đang cần bắt. Mọi chốt CHẤP NHẬN bên dưới vẫn dùng front_field như cũ.
  if [ -f "$1/evidence-report.md" ] \
     && [ "$(fm_field "$1/evidence-report.md" verdict)" = "PASS" ]; then
    return 0
  fi
  # Nhánh contract là thứ bản vá cục bộ của repo tiêu thụ KHÔNG có, nên nó bỏ
  # sót ca "khai signed-off mà không có evidence nào" (AC-9).
  if [ -f "$1/contract.md" ]; then
    case "$(fm_field "$1/contract.md" status)" in
      implemented|verified|signed-off) return 0 ;;
    esac
  fi
  return 1
}
```

- [ ] **Step 4: Thay chốt contract-missing**

Tại `scripts/pre-merge-check.sh:450-451`, thay:

```bash
  contract="$dir/contract.md"
  [ -f "$contract" ] || continue
```

bằng:

```bash
  # Mỗi `continue` dưới đây loại thư mục khỏi cổng HOÀN TOÀN. Im lặng đó đúng
  # với scaffold bỏ hoang, nhưng một thư mục TỰ KHAI đã phát hành mà vô hình là
  # một PASS chưa ai phán cưỡi CI xanh (incident 2026-07-20 #255).
  contract="$dir/contract.md"
  if [ ! -f "$contract" ]; then
    if claims_released "$dir"; then
      echo "VIOLATION [$slug]: no contract.md — slug invisible to the gate, yet it claims release (evidence-report.md declares verdict PASS). An unjudged PASS would ride CI green. Add contract.md with frontmatter status + risk_tier so the gate can judge it."
      violations=$((violations+1))
    fi
    continue
  fi
```

- [ ] **Step 5: Thay chốt field-missing**

Tại `scripts/pre-merge-check.sh` (sau khi Step 4 đã đổi số dòng), thay:

```bash
  [ -n "$tier" ] || continue
```

bằng:

```bash
  # Thiếu field ≠ khai báo → bị flag. Field CÓ mặt nhưng ngoài phạm vi (status
  # draft/approved, tier ngoài required_for) LÀ khai báo → vẫn im lặng đúng
  # thiết kế, xử ở hai `case` ngay dưới.
  if [ -z "$tier" ] || [ -z "$status" ]; then
    if claims_released "$dir"; then
      if   [ -z "$tier" ] && [ -z "$status" ]; then uj_missing="status nor risk_tier"
      elif [ -z "$tier" ];                     then uj_missing="risk_tier"
      else                                          uj_missing="status"
      fi
      echo "VIOLATION [$slug]: contract has no $uj_missing — slug invisible to the gate, yet it claims release. Add the missing frontmatter to $slug/contract.md so the gate can judge it."
      violations=$((violations+1))
    fi
    continue
  fi
```

- [ ] **Step 6: Chạy suite, xác nhận các case UJ đã XANH và không case cũ nào đỏ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | tail -3`

Expected: `Results: N passed, 0 failed` với N tăng đúng bằng số case UJ vừa thêm. Bất kỳ case `GP*`/`TE*`/`RL*` nào chuyển đỏ = hồi quy, sửa trước khi commit.

- [ ] **Step 7: Commit**

```bash
git add scripts/pre-merge-check.sh tests/scripts/run-tests.sh
git commit -m "feat(pre-merge): claims_released + hai chot tang hinh (AC-6..AC-10)"
```

---

### Task 2: Phân giải `signoff.approvers`

**Files:**
- Modify: `scripts/pre-merge-check.sh:46` (khai biến mặc định, cạnh `violations=0`)
- Modify: `scripts/pre-merge-check.sh:206-261` (khối parse config)
- Test: `tests/scripts/run-tests.sh`

**Interfaces:**
- Produces: biến toàn cục `APPROVERS` (một tên mỗi dòng, có thể rỗng) và `APPROVERS_DECLARED` (`true` hoặc rỗng). Task 3 đọc cả hai.
- Consumes: `$ACC/config.yaml` (đã resolve ở `:154`).

**Phục vụ evals:** E4 (AC-4)

**independent:** false (cùng file Task 1; Task 3 phụ thuộc task này)

- [ ] **Step 1: Viết case đỏ, chạy để thấy FAIL**

Thêm vào cuối khối UJ:

```bash
echo "UJ4 approvers KHAI ma tach ra 0 ten -> VIOLATION [config], mot dong cho ca lan chay"
for v in 'a:  approvers: []' 'b:  approvers:' 'c:  approvers: {khong-phai-list}'; do
  lbl="${v%%:*}"; line="${v#*:}"
  uj_repo "uj4$lbl" "$line"; R="$UJR/uj4$lbl"
  # HAI slug: phan biet duoc "mot dong cho ca lan chay" voi "mot dong moi slug"
  uj_slug "$R" feat-a "$(uj_full feat-a)" "Manh Phan 2026-06-20"
  uj_slug "$R" feat-b "$(uj_full feat-b)" "Manh Phan 2026-06-20"
  UJ4="$(bash "$CHECK" "$R" 2>&1)"; check "UJ4$lbl-exit" 1 $?
  same   "UJ4$lbl-count" 1 "$(printf '%s\n' "$UJ4" | grep -c '^VIOLATION \[config\]:')"
  hasout "UJ4$lbl-msg" "signoff.approvers is declared but resolves to no approver name" "$UJ4"
  nothas "UJ4$lbl-nonote" "consider declaring signoff.approvers" "$UJ4"
done
```

- [ ] **Step 2: Chạy, xác nhận FAIL**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep 'UJ4'`
Expected: mọi `UJ4*` FAIL — chưa có luật nào đọc `approvers`.

- [ ] **Step 3: Khai biến mặc định**

Ngay sau `violations=0` (`scripts/pre-merge-check.sh:46`), thêm:

```bash
# Danh sách người được phép ký, một tên mỗi dòng. Rỗng = không khai, hoặc khai
# mà không tách được tên nào (hai trường hợp đó xử KHÁC nhau — xem APPROVERS_DECLARED).
APPROVERS=""
APPROVERS_DECLARED=""
```

- [ ] **Step 4: Parse trong khối config**

Ngay TRƯỚC dòng `fi` đóng khối `if [ -f "$ACC/config.yaml" ]` (`scripts/pre-merge-check.sh:261`), thêm:

```bash
  # `signoff.approvers` tới 1.23.0 là key TRANG TRÍ — không chỗ nào đọc, và
  # acceptance-init ghi thẳng "informational (not yet machine-enforced)". Từ đây
  # nó là luật, nên phải phân biệt ba trạng thái, KHÔNG phải hai:
  #   không khai  -> APPROVERS_DECLARED rỗng  -> Task 3 rơi về lưới đen + NOTE
  #   khai, có tên-> APPROVERS có dòng        -> Task 3 khớp tên
  #   khai, 0 tên -> DECLARED=true, APPROVERS rỗng -> VIOLATION ngay dưới
  # Ranh giới đó theo đúng tiền lệ RL14: không-khai là bỏ-qua-có-tín-hiệu,
  # khai-mà-vô-dụng là lỗi.
  if grep -qE '^[[:space:]]*approvers:' "$ACC/config.yaml"; then
    APPROVERS_DECLARED=true
    ap_raw="$(sed -n 's/^[[:space:]]*approvers:[[:space:]]*//p' "$ACC/config.yaml" | head -1 | sed 's/[[:space:]]*#.*$//' | sed 's/[[:space:]]*$//')"
    case "$ap_raw" in
      \[*)  # inline flow: ["Manh Phan", "memto"] — dạng acceptance-init sinh ra
        APPROVERS="$(printf '%s' "$ap_raw" \
          | sed -e 's/^\[//' -e 's/\]$//' \
          | tr ',' '\n' \
          | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' \
                -e 's/^["'"'"']//' -e 's/["'"'"']$//' -e 's/[[:space:]]*$//' \
          | grep -v '^$')" ;;
      '')   # block list: cùng khuôn agent_authors ở trên
        APPROVERS="$(sed -n '/^[[:space:]]*approvers:/,/^[[:space:]]*[a-zA-Z0-9_-]*:[[:space:]]*$/p' "$ACC/config.yaml" \
          | sed -n 's/^[[:space:]]*-[[:space:]]*//p' \
          | sed -e 's/[[:space:]]*#.*$//' -e 's/^["'"'"']//' -e 's/["'"'"']$//' -e 's/[[:space:]]*$//' \
          | grep -v '^$')" ;;
      *)    # scalar trần / cú pháp lạ: KHÔNG đoán — 0 tên, rơi vào VIOLATION dưới
        APPROVERS="" ;;
    esac
  fi
fi
if [ "$APPROVERS_DECLARED" = "true" ] && [ -z "$APPROVERS" ]; then
  echo "VIOLATION [config]: signoff.approvers is declared but resolves to no approver name — a declared-yet-unusable allowlist silently downgrades signature checking to the placeholder net. Write it as signoff.approvers: [\"<name>\"] or a YAML block list, or remove the key to opt out deliberately."
  violations=$((violations+1))
fi
```

> Lưu ý cho người cài: dòng `fi` trong khối trên là dòng `fi` **sẵn có** ở `:261` đóng `if [ -f "$ACC/config.yaml" ]`. Chốt `VIOLATION [config]` nằm NGOÀI khối đó nên repo không có `config.yaml` không nổ.

- [ ] **Step 5: Chạy, xác nhận XANH**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep 'UJ4'`
Expected: mọi `UJ4*` PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/pre-merge-check.sh tests/scripts/run-tests.sh
git commit -m "feat(pre-merge): phan giai signoff.approvers (inline + block), khai-ma-rong la VIOLATION"
```

---

### Task 3: Luật chữ ký — khớp approvers, lưới đen, giữ nguyên chốt rỗng

**Files:**
- Modify: `scripts/pre-merge-check.sh:283` (thêm 2 hàm sau `claims_released`)
- Modify: `scripts/pre-merge-check.sh:594-597` (chèn SAU chốt rỗng, không thay nó)
- Test: `tests/scripts/run-tests.sh`

**Interfaces:**
- Consumes: `APPROVERS`, `APPROVERS_DECLARED` (Task 2).
- Produces: `placeholder_signoff <chuỗi>` → 0 iff chuỗi là giữ-chỗ; `signoff_names_approver <chuỗi>` → 0 iff chuỗi bắt đầu bằng một tên trong `APPROVERS` và tên đó kết bằng hết-chuỗi hoặc ký tự không thuộc `[A-Za-z0-9_]`.

**Phục vụ evals:** E1, E2, E2b, E3, E5, E18 (AC-1, AC-2, AC-2b, AC-3, AC-5, AC-17)

**independent:** false (phụ thuộc Task 2)

- [ ] **Step 1: Viết case đỏ + đối chứng, chạy để thấy FAIL**

```bash
echo "UJ2 chu ky KHONG neu ten nao trong approvers -> VIOLATION"
uj_repo uj2 '  approvers: ["Manh Phan"]'; R="$UJR/uj2"
uj_slug "$R" feat-pending "$(uj_full feat-pending)" "PENDING — chờ Manh gật"
UJ2="$(bash "$CHECK" "$R" 2>&1)"; check UJ2a 1 $?
hasout UJ2b "VIOLATION [feat-pending]: human_signoff \"PENDING — chờ Manh gật\" does not name any approver" "$UJ2"
nothas UJ2c "signed off by PENDING" "$UJ2"
nothas UJ2d "pre-merge-check: clean" "$UJ2"

echo "UJ2b bang bien khop ten (approvers: [Manh])"
uj2b() { # <nhãn> <chữ ký> <exit mong đợi>
  uj_repo "uj2b$1" '  approvers: ["Manh"]'; R="$UJR/uj2b$1"
  uj_slug "$R" feat-b "$(uj_full feat-b)" "$2"
  bash "$CHECK" "$R" >/dev/null 2>&1; check "UJ2b-$1" "$3" $?
}
uj2b o1 "Manh Phan 2026-06-20"        0
uj2b o2 "Manh"                        0
uj2b o3 "Manhattan 2026-06-20"        1
uj2b o4 "manh phan 2026-06-20"        1
uj2b o5 "  Manh Phan 2026-06-20"      0
uj2b o6 "Manh Phan — chưa duyệt, chờ họp" 0   # chốt Cổng 1: NHẬN (xem contract Notes)

echo "UJ5 KHONG khai approvers -> luoi den bat, mot dong NOTE cho ca lan chay"
for ph in PENDING TBD TODO n/a none unsigned waiting '>' '|' '-' '<name> <date>'; do
  uj_repo uj5 ''; R="$UJR/uj5"
  uj_slug "$R" feat-p "$(uj_full feat-p)" "$ph"
  bash "$CHECK" "$R" >/dev/null 2>&1; check "UJ5-[$ph]" 1 $?
done
uj_repo uj5n ''; R="$UJR/uj5n"
uj_slug "$R" feat-a "$(uj_full feat-a)" "PENDING"
uj_slug "$R" feat-b "$(uj_full feat-b)" "TBD"
UJ5N="$(bash "$CHECK" "$R" 2>&1)"
same   UJ5n1 1 "$(printf '%s\n' "$UJ5N" | grep -c 'consider declaring signoff.approvers')"
# DOI CHUNG DUONG: cung config khong-khai, chu ky that phai VAN qua
uj_repo uj5c ''; R="$UJR/uj5c"
uj_slug "$R" feat-ok "$(uj_full feat-ok)" "Manh Phan 2026-06-20"
UJ5C="$(bash "$CHECK" "$R" 2>&1)"; check UJ5ctrl 0 $?
hasout UJ5ctrl2 "pre-merge-check: clean" "$UJ5C"

echo "UJ18 chu ky RONG -> thong diep chot RONG song sot, dung thu tu"
for cfg in '  approvers: ["Manh Phan"]' ''; do
  uj_repo uj18 "$cfg"; R="$UJR/uj18"
  uj_slug "$R" feat-e "$(uj_full feat-e)" ""
  UJ18="$(bash "$CHECK" "$R" 2>&1)"; check "UJ18-exit" 1 $?
  hasout "UJ18-msg" "verdict PASS but human_signoff is empty (Gate 2 pending)" "$UJ18"
  nothas "UJ18-order" "does not name any approver" "$UJ18"
done
```

- [ ] **Step 2: Chạy, xác nhận FAIL đúng chỗ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E 'UJ2|UJ5|UJ18'`
Expected: `UJ2a/UJ2b`, `UJ2b-o3/o4`, mọi `UJ5-[...]`, `UJ5n1` FAIL. `UJ2b-o1/o2/o5/o6`, `UJ5ctrl*`, `UJ18-*` PASS ngay (hành vi hôm nay đã đúng cho chúng) — nếu `UJ18-*` đỏ thì fixture sai.

- [ ] **Step 3: Thêm hai hàm**

Chèn ngay sau `claims_released()`:

```bash
placeholder_signoff() { # <chuỗi> — 0 iff chữ ký không nêu tên ai cả.
  # LƯỚI DỰ PHÒNG, chỉ dùng khi repo KHÔNG khai signoff.approvers. Danh sách
  # từ khoá luôn phụ thuộc ngôn ngữ và luôn sót — thuốc thật là khai approvers,
  # và NOTE bên dưới nói đúng câu đó. Khớp theo TIỀN TỐ vì chữ ký thật dẫn đầu
  # bằng tên. LC_ALL=C để `tr` không chết trên UTF-8 tiếng Việt.
  case "$(printf '%s' "$1" | LC_ALL=C tr '[:upper:]' '[:lower:]')" in
    '>'|'|'|'-') return 0 ;;
    '<'*) return 0 ;;                       # template chưa điền: "<name> <date>"
    pending*|tbd*|todo*|n/a*|none|unsigned*|waiting*) return 0 ;;
  esac
  return 1
}

signoff_names_approver() { # <chuỗi> — 0 iff bắt đầu bằng một tên trong APPROVERS.
  # Tên phải kết bằng HẾT CHUỖI hoặc một ký tự không thuộc [A-Za-z0-9_], nên
  # approvers ["Manh"] KHÔNG nhận "Manhattan". Phân biệt hoa/thường: tên người
  # là dữ liệu, không chuẩn hoá. Phần đuôi sau tên KHÔNG bị soi — chốt Cổng 1
  # 2026-07-28 NHẬN "Manh Phan — chưa duyệt": gõ đúng tên mình là hành vi ký có
  # ý thức, và siết phần đuôi thực chất là ràng buộc định dạng ngày (Out of scope).
  local sig="$1" name rest oldifs="$IFS"
  [ -n "$APPROVERS" ] || return 1
  IFS='
'
  for name in $APPROVERS; do
    [ -n "$name" ] || continue
    case "$sig" in
      "$name") IFS="$oldifs"; return 0 ;;
      "$name"*)
        rest="${sig#"$name"}"
        case "$rest" in
          [A-Za-z0-9_]*) ;;                 # tên chỉ là tiền tố của một từ dài hơn
          *) IFS="$oldifs"; return 0 ;;
        esac ;;
    esac
  done
  IFS="$oldifs"; return 1
}
```

- [ ] **Step 4: Chèn nhánh chữ ký SAU chốt rỗng**

Tại `scripts/pre-merge-check.sh`, GIỮ NGUYÊN khối:

```bash
  if [ -z "$signoff" ]; then
    echo "VIOLATION [$slug]: verdict PASS but human_signoff is empty (Gate 2 pending)"
    violations=$((violations+1)); continue
  fi
```

và chèn NGAY SAU nó:

```bash
  # Thứ tự có răng: chốt rỗng ở trên chạy TRƯỚC. Gộp hai chốt cho gọn sẽ làm
  # chuỗi rỗng ở repo KHÔNG khai approvers không khớp mẫu lưới-đen nào rồi rơi
  # ra `clean` — hồi quy fail-open trên một luật đang bảo vệ (AC-17).
  #
  # human_signoff trước đây chỉ bị kiểm KHÁC-RỖNG, nên "PENDING — chờ Manh gật"
  # thoả và cổng in "signed off by PENDING". Đó không phải đường tấn công mà là
  # đường đi bộ bình thường, và require_human_commit KHÔNG cứu được: nó kiểm AI
  # commit và commit đó chạm dòng nào, không kiểm nội dung có phải một cái tên.
  if [ -n "$APPROVERS" ]; then
    if ! signoff_names_approver "$signoff"; then
      echo "VIOLATION [$slug]: human_signoff \"$signoff\" does not name any approver declared in signoff.approvers — Gate 2 is still pending. Replace it with an approver's name (+ date) once they actually sign."
      violations=$((violations+1)); continue
    fi
  elif placeholder_signoff "$signoff"; then
    echo "VIOLATION [$slug]: human_signoff \"$signoff\" is a placeholder, not a signature — it names no approver, so Gate 2 is still pending. Replace it with the approver's name + date once they actually sign."
    violations=$((violations+1))
    UJ_ADVISE_APPROVERS=1
    continue
  fi
```

Và khai `UJ_ADVISE_APPROVERS=""` cạnh `APPROVERS=""` (Task 2 Step 3), rồi in NOTE **một lần** ngay trước dòng tổng kết cuối script (tìm dòng in `pre-merge-check: clean` / `violation(s) — merge blocked` và chèn TRƯỚC nó):

```bash
if [ -n "$UJ_ADVISE_APPROVERS" ]; then
  echo "NOTE: signature checking fell back to the placeholder net because signoff.approvers is not declared — that net only knows English placeholders. Consider declaring signoff.approvers: [\"<name>\"] in _acceptance/config.yaml so signatures are checked against real approver names instead."
fi
```

- [ ] **Step 5: Chạy, xác nhận XANH toàn bộ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | tail -3`
Expected: `Results: N passed, 0 failed`.

- [ ] **Step 6: Commit**

```bash
git add scripts/pre-merge-check.sh tests/scripts/run-tests.sh
git commit -m "feat(pre-merge): chu ky phai neu ten trong approvers; luoi den la duong du phong"
```

---

### Task 4: Bất biến cross-cutting — chế độ gọi, enforcement, stdout, sổ luật, idempotent

**Files:**
- Test: `tests/scripts/run-tests.sh` (chỉ test, KHÔNG đụng script)

**Interfaces:**
- Consumes: mọi thứ Task 1-3 dựng.
- Produces: không có API mới.

**Phục vụ evals:** E11, E12, E17 (AC-11, AC-12, AC-16)

**independent:** false (phụ thuộc Task 1-3)

- [ ] **Step 1: Viết case, chạy để xem cái nào đỏ**

```bash
echo "UJ17 luat moi song o MOI che do goi (AC-16)"
uj_repo uj17 '  approvers: ["Manh Phan"]'; R="$UJR/uj17"; UJ17B="$UJ_BASE"
uj_slug "$R" feat-pending "$(uj_full feat-pending)" "PENDING"
uj_slug "$R" feat-ghost - "Manh Phan 2026-06-20"
git -C "$R" add -A >/dev/null
git -c user.email=t@t -c user.name=t -C "$R" commit -qm change
for mode in "--base $UJ17B" "" "--slug feat-pending"; do
  # shellcheck disable=SC2086
  UJ17="$(bash "$CHECK" "$R" $mode 2>&1)"; UJ17ST=$?
  check  "UJ17-exit[$mode]" 1 "$UJ17ST"
  hasout "UJ17-sig[$mode]"  "does not name any approver" "$UJ17"
done
# O AM: --slug tro slug KHAC thi slug do KHONG bi xet (dung thiet ke co loc)
uj_repo uj17n '  approvers: ["Manh Phan"]'; R="$UJR/uj17n"
uj_slug "$R" feat-ok "$(uj_full feat-ok)" "Manh Phan 2026-06-20"
uj_slug "$R" feat-pending "$(uj_full feat-pending)" "PENDING"
UJ17N="$(bash "$CHECK" "$R" --slug feat-ok 2>&1)"; check UJ17neg 0 $?
nothas UJ17neg2 "feat-pending" "$UJ17N"

echo "UJ11 enforcement off/warn/strict KHONG ha luat moi (AC-11)"
for mode in off warn strict; do
  uj_repo "uj11-$mode" "  approvers: [\"Manh Phan\"]"; R="$UJR/uj11-$mode"
  printf 'enforcement: %s\n' "$mode" >> "$R/_acceptance/config.yaml"
  uj_slug "$R" feat-pending "$(uj_full feat-pending)" "PENDING"
  uj_slug "$R" feat-ghost - "Manh Phan 2026-06-20"
  UJ11="$(bash "$CHECK" "$R" 2>&1)"; check "UJ11-$mode" 1 $?
  hasout "UJ11-$mode-sig"   "does not name any approver" "$UJ11"
  hasout "UJ11-$mode-ghost" "no contract.md" "$UJ11"
done

echo "UJ12 stdout + so luat + idempotent (AC-12)"
uj_repo uj12 '  approvers: ["Manh Phan"]'; R="$UJR/uj12"; UJ12B="$UJ_BASE"
uj_slug "$R" feat-pending "$(uj_full feat-pending)" "PENDING"
git -C "$R" add -A >/dev/null
git -c user.email=t@t -c user.name=t -C "$R" commit -qm change
# (a) VIOLATION ra STDOUT — chay 2>/dev/null van thay
UJ12A="$(bash "$CHECK" "$R" --base "$UJ12B" 2>/dev/null)"
hasout UJ12a "does not name any approver" "$UJ12A"
# (b) so luat KHONG doi o ca hai che do
hasout UJ12b1 "pre-merge-check: rules ran=3 declared-off=0 expected=3" "$UJ12A"
UJ12C="$(bash "$CHECK" "$R" 2>&1)"
hasout UJ12b2 "pre-merge-check: rules ran=1 declared-off=2 expected=3" "$UJ12C"
# (c) idempotent
UJ12D="$(bash "$CHECK" "$R" --base "$UJ12B" 2>&1)"
UJ12E="$(bash "$CHECK" "$R" --base "$UJ12B" 2>&1)"
same UJ12c "$UJ12D" "$UJ12E"
```

- [ ] **Step 2: Chạy và sửa cho tới khi xanh**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep -E 'UJ11|UJ12|UJ17'`

Expected: tất cả PASS. `UJ17-*` đỏ nghĩa là luật mới đã lọt vào nhánh phụ thuộc `--base` — quay lại Task 1/3, đưa nó ra ngoài. `UJ12b1`/`UJ12b2` đỏ nghĩa là đã vô tình thêm tên vào `LEDGER_EXPECTED`, gỡ ra.

- [ ] **Step 3: Commit**

```bash
git add tests/scripts/run-tests.sh
git commit -m "test(pre-merge): ghim bat bien che-do-goi/enforcement/stdout/so-luat/idempotent"
```

---

### Task 5: Tiêm đột biến — chứng minh phép đo sống

**Files:**
- Test: `tests/scripts/run-tests.sh`

**Interfaces:**
- Consumes: `$ROOT_REAL` (đã có ở `tests/scripts/run-tests.sh:1699`), `$CHECK`.
- Produces: không có API mới.

**Phục vụ evals:** E14 (AC-14)

**independent:** false (phụ thuộc Task 1-3)

- [ ] **Step 1: Viết khối tiêm**

```bash
echo "UJ14 tiem dot bien: vo hieu tung nhanh -> DUNG case tuong ung do"
# Ban sao PHAI giu layout scripts/ canh lib/ — script resolve lib qua ../lib,
# copy vao thu muc phang lam ban "nguyen ven" da lech san va moi ket luan tu no
# la ket luan ve mot script KHAC. Doi chung UJ14ctrl bat duoc dieu do.
UJCP="$T/ujcp"; rm -rf "$UJCP"; mkdir -p "$UJCP/scripts"
cp -R "$ROOT_REAL/lib" "$UJCP/lib"
UJMUT="$UJCP/scripts/uj-check.sh"

# Fixture do cho tung nhanh
uj_repo ujm_sig  '  approvers: ["Manh Phan"]'; UJM_SIG="$UJR/ujm_sig"
uj_slug "$UJM_SIG" feat-p "$(uj_full feat-p)" "PENDING"
uj_repo ujm_blk  ''; UJM_BLK="$UJR/ujm_blk"
uj_slug "$UJM_BLK" feat-p "$(uj_full feat-p)" "PENDING"
uj_repo ujm_noc  '  approvers: ["Manh Phan"]'; UJM_NOC="$UJR/ujm_noc"
uj_slug "$UJM_NOC" feat-ghost - "Manh Phan 2026-06-20"
uj_repo ujm_fld  '  approvers: ["Manh Phan"]'; UJM_FLD="$UJR/ujm_fld"
uj_slug "$UJM_FLD" feat-notier 'schema_version: 1
feature: f
slug: feat-notier
surfaces: [api]
status: signed-off
approved_by: Manh Phan' "Manh Phan 2026-06-20"
uj_repo ujm_ctr  '  approvers: ["Manh Phan"]'; UJM_CTR="$UJR/ujm_ctr"
uj_slug "$UJM_CTR" feat-noev 'schema_version: 1
feature: f
slug: feat-noev
surfaces: [api]
status: signed-off
approved_by: Manh Phan' SKIP

# DOI CHUNG: ban sao KHONG tiem phai do DUNG nhu ban goc (ca 5 fixture)
cp "$CHECK" "$UJMUT"
for f in "$UJM_SIG" "$UJM_BLK" "$UJM_NOC" "$UJM_FLD" "$UJM_CTR"; do
  bash "$UJMUT" "$f" >/dev/null 2>&1; check "UJ14ctrl-$(basename "$f")" 1 $?
done

# uj_mut <nhãn> <lệnh sed vô hiệu hoá> <fixture phải chuyển XANH>
uj_mut() {
  sed "$2" "$CHECK" > "$UJMUT"
  # Ban sao phai khac ban goc — sed khong khop nghia la nguon da troi.
  if diff -q "$CHECK" "$UJMUT" >/dev/null 2>&1; then
    echo "     TIEM THAT BAI [$1]: sed khong khop, nguon da troi"; check "UJ14-$1" 0 1; return
  fi
  bash "$UJMUT" "$3" >/dev/null 2>&1; check "UJ14-$1" 0 $?
}
uj_mut sig   's|if ! signoff_names_approver "$signoff"; then|if false; then|'      "$UJM_SIG"
uj_mut blk   's|elif placeholder_signoff "$signoff"; then|elif false; then|'       "$UJM_BLK"
uj_mut noc   's|    if claims_released "$dir"; then|    if false; then|'           "$UJM_NOC"
uj_mut ctr   's|      implemented\|verified\|signed-off) return 0 ;;|      __khong_bao_gio__) return 0 ;;|' "$UJM_CTR"
```

> Nhánh `fld` (field-missing) và `noc` (contract-missing) cùng gọi `claims_released`, nên lệnh `sed` cho `noc` khớp **cả hai** call-site nếu viết chung. Dùng `sed` với số dòng nếu cần tách; nếu không tách được thì gộp `fld` vào `noc` và ghi rõ trong comment rằng một lệnh tiêm phủ hai chốt.

- [ ] **Step 2: Chạy, xác nhận mỗi lệnh tiêm làm ĐÚNG fixture của nó chuyển xanh**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep 'UJ14'`
Expected: `UJ14ctrl-*` PASS (bản sao nguyên vẹn vẫn ĐỎ trên fixture đỏ) và `UJ14-sig|blk|noc|ctr` PASS (bản bị tiêm chuyển XANH → chứng minh chính nhánh đó đang gánh việc).

- [ ] **Step 3: Commit**

```bash
git add tests/scripts/run-tests.sh
git commit -m "test(pre-merge): tiem dot bien 4 nhanh — chung minh luat moi that su gach"
```

---

### Task 6: Tài liệu `acceptance-init` không còn nói sai mức cưỡng chế

**Files:**
- Modify: `commands/acceptance-init.md:64`
- Modify: `codex/acceptance-gate/skills/acceptance-init/SKILL.md` (nếu có dòng tương ứng)
- Test: `tests/plugins/run-tests.sh` (case `P57`)

**Interfaces:** không có API.

**Phục vụ evals:** E13 (AC-13)

**independent:** **true** — khác file hoàn toàn với Task 1-5.

- [ ] **Step 1: Viết case P57, chạy để thấy FAIL**

Thêm vào cuối `tests/plugins/run-tests.sh`, trước dòng tổng kết:

```bash
echo "P57 acceptance-init khong con noi approvers la informational"
for f in "$ROOT/commands/acceptance-init.md" "$ROOT/codex/acceptance-gate/skills/acceptance-init/SKILL.md"; do
  [ -f "$f" ] || continue
  grep -q 'signoff.approvers\|approvers:' "$f" || continue
  n="$(basename "$(dirname "$f")")/$(basename "$f")"
  # (a) khong con chuoi cu
  nothas "P57a[$n]" "informational" "$(cat "$f")"
  nothas "P57b[$n]" "not yet machine-enforced" "$(cat "$f")"
  # (b) CO ve khang dinh — chi do vang-mat thi xoa-ma-khong-viet-gi van xanh
  hasout "P57c[$n]" "# approvers: enforced —" "$(cat "$f")"
done
```

- [ ] **Step 2: Chạy, xác nhận FAIL**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep 'P57'`
Expected: `P57a` và `P57c` FAIL.

- [ ] **Step 3: Sửa tài liệu**

Tại `commands/acceptance-init.md:64`, thay:

```
  approvers: ["<from 2f>"]   # informational in v1 (not yet machine-enforced)
```

bằng:

```
  approvers: ["<from 2f>"]   # approvers: enforced — human_signoff must start
                             # with one of these names, else pre-merge blocks.
                             # Omit the key and signatures only get checked
                             # against an English placeholder net (PENDING/TBD/…),
                             # which misses placeholders in any other language.
```

Nếu `codex/acceptance-gate/skills/acceptance-init/SKILL.md` có dòng tương ứng, sửa y hệt (nội dung giống nhau — hai harness phải nói cùng một điều).

- [ ] **Step 4: Chạy, xác nhận XANH**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep 'P57'`
Expected: mọi `P57*` PASS.

- [ ] **Step 5: Commit**

```bash
git add commands/acceptance-init.md codex/ tests/plugins/run-tests.sh
git commit -m "docs(acceptance-init): approvers da duoc cuong che, khong con la informational"
```

---

### Task 7: Bằng chứng cho judge + sync mirror

**Files:**
- Create: `_acceptance/premerge-unjudged-pass/evidence/unjudged-messages.txt`
- Modify: `tests/scripts/run-tests.sh` (case `UJ16`)
- Modify: `plugins/**` (sinh máy)

**Interfaces:**
- Consumes: mọi fixture Task 1-3.
- Produces: file bằng chứng mà eval judgment `E15` đọc.

**Phục vụ evals:** E15, E16 (AC-15)

**independent:** false (phải chạy sau cùng — mirror phải phản ánh mọi thay đổi nguồn)

- [ ] **Step 1: Viết khối sinh-lại-rồi-diff**

Cùng khuôn `RL10` đã có trong file (đọc nó trước để theo đúng kiểu):

```bash
echo "UJ16 sinh lai evidence/unjudged-messages.txt roi diff byte-doi-byte"
UJMSG="$ROOT_REAL/_acceptance/premerge-unjudged-pass/evidence/unjudged-messages.txt"
UJ16NEW="$(mktemp)"
{
  printf '%s\n' '# Thông điệp luật PASS-chưa-ai-phán — SINH bởi tests/scripts/run-tests.sh (UJ16).'
  printf '%s\n' '# KHÔNG sửa tay: suite sinh lại file này mỗi lần chạy và diff byte-đối-byte.'
  printf '\n== chữ ký không nêu tên người duyệt (approvers đã khai) ==\n'
  uj_repo m1 '  approvers: ["Manh Phan"]'; uj_slug "$UJR/m1" feat-p "$(uj_full feat-p)" "PENDING — chờ Manh gật"
  bash "$CHECK" "$UJR/m1" 2>&1 | grep -E '^VIOLATION'
  printf '\n== chữ ký giữ-chỗ (approvers KHÔNG khai) ==\n'
  uj_repo m2 ''; uj_slug "$UJR/m2" feat-p "$(uj_full feat-p)" "TBD"
  bash "$CHECK" "$UJR/m2" 2>&1 | grep -E '^VIOLATION|^NOTE: signature checking'
  printf '\n== approvers khai mà không dùng được ==\n'
  uj_repo m3 '  approvers: []'; uj_slug "$UJR/m3" feat-a "$(uj_full feat-a)" "Manh Phan 2026-06-20"
  bash "$CHECK" "$UJR/m3" 2>&1 | grep -E '^VIOLATION \[config\]'
  printf '\n== slug tàng hình: không contract.md ==\n'
  uj_repo m4 '  approvers: ["Manh Phan"]'; uj_slug "$UJR/m4" feat-ghost - "Manh Phan 2026-06-20"
  bash "$CHECK" "$UJR/m4" 2>&1 | grep -E '^VIOLATION'
  printf '\n== slug tàng hình: thiếu risk_tier ==\n'
  uj_repo m5 '  approvers: ["Manh Phan"]'
  uj_slug "$UJR/m5" feat-notier 'schema_version: 1
feature: f
slug: feat-notier
surfaces: [api]
status: signed-off
approved_by: Manh Phan' "Manh Phan 2026-06-20"
  bash "$CHECK" "$UJR/m5" 2>&1 | grep -E '^VIOLATION'
} > "$UJ16NEW" 2>&1
if [ "${UJ16_WRITE:-0}" = "1" ]; then cp "$UJ16NEW" "$UJMSG"; echo "  (UJ16_WRITE=1 — đã ghi lại)"; fi
if diff -u "$UJMSG" "$UJ16NEW" > "$T/uj16.diff" 2>&1; then
  check UJ16 0 0
else
  echo "     evidence LECH voi thong diep hien tai:"; head -20 "$T/uj16.diff" | sed 's/^/     /'
  check UJ16 0 1
fi
# Chong troi PHAM VI: mat han mot nhanh thi diff van khop neu evidence cung
# sinh thieu — ghim tung nhanh co mat trong ban VUA SINH.
UJ16M="$(cat "$UJ16NEW")"
hasout UJ16a "does not name any approver" "$UJ16M"
hasout UJ16b "is a placeholder, not a signature" "$UJ16M"
hasout UJ16c "consider declaring signoff.approvers" "$UJ16M"
hasout UJ16d "no contract.md" "$UJ16M"
hasout UJ16e "contract has no risk_tier" "$UJ16M"
```

- [ ] **Step 2: Sinh file bằng chứng lần đầu**

```bash
mkdir -p _acceptance/premerge-unjudged-pass/evidence
touch _acceptance/premerge-unjudged-pass/evidence/unjudged-messages.txt
UJ16_WRITE=1 bash tests/scripts/run-tests.sh >/dev/null 2>&1
```

- [ ] **Step 3: Chạy lại KHÔNG có cờ ghi, xác nhận diff sạch**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep 'UJ16'`
Expected: `UJ16` và `UJ16a..e` đều PASS.

- [ ] **Step 4: Sync mirror**

Run: `bash scripts/sync-plugin-packages.sh` rồi `bash scripts/sync-plugin-packages.sh --check`
Expected: dòng cuối `plugins/ mirror in sync.`

- [ ] **Step 5: Chạy TOÀN BỘ 8 suite**

```bash
for t in tests/*/run-tests.sh; do printf '%-12s ' "$(basename $(dirname $t))"; bash "$t" >/dev/null 2>&1 && echo OK || echo FAIL; done
```
Expected: cả 8 dòng `OK`.

- [ ] **Step 6: Commit**

```bash
git add _acceptance/premerge-unjudged-pass/evidence tests/scripts/run-tests.sh plugins/
git commit -m "test(pre-merge): bang chung sinh-lai-roi-diff cho judge + sync mirror"
```

---

## Self-Review

**1. Spec coverage** — mọi AC có task:

| AC | Task | AC | Task |
|---|---|---|---|
| AC-1 | 3 | AC-10 | 1 |
| AC-2 | 3 | AC-11 | 4 |
| AC-2b | 3 | AC-12 | 4 |
| AC-3 | 3 | AC-13 | 6 |
| AC-4 | 2 | AC-14 | 5 |
| AC-5 | 3 | AC-15 | 7 |
| AC-6 | 1 | AC-16 | 4 |
| AC-7 | 1 | AC-17 | 3 |
| AC-8 | 1 | | |
| AC-9 | 1 | | |

Không AC nào hở.

**2. Placeholder scan** — không có "TBD"/"TODO"/"xử lý lỗi phù hợp" nào ở vị trí chỉ dẫn. Chuỗi `TBD`/`TODO` chỉ xuất hiện làm **dữ liệu** trong bảng biến thể lưới đen của Task 3.

**3. Type consistency** — tên hàm dùng nhất quán: `claims_released` (Task 1, tiêm ở Task 5), `placeholder_signoff` / `signoff_names_approver` (Task 3, tiêm ở Task 5), biến `APPROVERS` / `APPROVERS_DECLARED` / `UJ_ADVISE_APPROVERS` (khai Task 2, dùng Task 3). Helper fixture `uj_repo` / `uj_slug` / `uj_full` khai ở Task 1, dùng lại ở Task 2-7 — người cài Task 2+ phải đọc Task 1 Step 1 để có chúng.

**Một điểm cần người cài chú ý:** Task 5 lệnh `sed` cho nhánh `noc` khớp cả hai call-site của `claims_released`; nếu không tách được bằng ngữ cảnh thì gộp `fld` vào `noc` và ghi rõ trong comment. Đây là chỗ duy nhất trong plan chưa chốt cứng được lệnh chính xác, vì nó phụ thuộc hình dạng file sau Task 1.
