# t1-escape-event-scope — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Răng T1-escape tắt được độc lập với `--base`, và commit hạ tầng (release / mirror-sync) không còn làm cổng đỏ vì lý do cấu trúc.

**Architecture:** Một cờ opt-out `--no-t1-escape` (mặc định giữ nguyên hành vi, nên consumer cũ không mất lớp bảo vệ nào). Khi tắt, phát **hai chuỗi ghim nguyên văn** qua một hàm duy nhất, cùng khuôn `gap_probe_not_enforced` đã có. Song song: `plugins/**` vào `t1_skip_globs` (an toàn vì P30 canh mirror==nguồn), và P03/P22 thôi ghim version bằng literal để bump không còn chạm suite.

**Tech Stack:** bash (`set -u`), Node ≥18, harness sẵn có (`tests/scripts/run-tests.sh`, `tests/plugins/run-tests.sh`), GitHub Actions.

## Global Constraints

- **MỌI assertion mới phải CHỨNG MINH BIẾT ĐỎ.** Tiêm vi phạm → thấy fail đúng thông điệp → gỡ → xanh lại. Feature trước có 6 lần xanh RỖNG.
- **Hai chuỗi là HẰNG, so bằng `grep -F`, không regex.** Regex do người viết test tự chọn = tự viết cả đề lẫn đáp án (gap-probe P1-3):
  - marker: `T1-ESCAPE: NOT ENFORCED reason=push-event-no-pr-premise`
  - tổng kết: `pre-merge-check: T1-escape: KHÔNG cưỡng chế trong lần chạy này (xem dòng marker NOT ENFORCED ở trên)`
- **Cờ KHÔNG nhận tham số.** `reason` là hằng — giữ ranh giới "không thêm cờ nào khác".
- **`t1_skip_globs` lọc TỪNG FILE**, không phải "diff chạm một glob T1 thì cả diff là T1". CLAUDE.md bắt sync mirror cùng lượt nên gần như mọi PR đều chạm `plugins/**`; đọc nhầm là răng chết trên gần hết PR.
- **Cấm `$(...)` để nối nội dung file có frontmatter** (nuốt newline đuôi) — dùng `printf '%s\n'` / heredoc.
- **Cấm chép luật sang test** — test gọi chính mã sản phẩm.
- `scripts/pre-merge-check.sh` là `t3_paths` → mọi thay đổi phải kèm case.
- **`plugins/` là build mirror**: sửa nguồn xong chạy `bash scripts/sync-plugin-packages.sh --write`, commit cùng lượt (CLAUDE.md, P30 chặn drift).
- Case trong suite dùng tiền tố **`TE*`** (`GP*`, `GPM*` đã dùng hết); case plugins dùng **`P40`+**.
- Verify per-task: `bash tests/scripts/run-tests.sh`. Verify cuối: 3 suite + `sync-plugin-packages.sh --check` + `eval-coverage-lint`.
- Vocab theo `CONTEXT.md` (lint W6 chặn): máy móc không gọi là "Gate"; dùng "pre-merge check".

## File Structure

| File | Trách nhiệm |
|---|---|
| `scripts/pre-merge-check.sh` | +1 cờ, +1 hàm marker, +1 điều kiện quanh khối T1-escape, +1 dòng tổng kết |
| `_acceptance/config.yaml` | +`plugins/**` vào `t1_skip_globs` |
| `.github/workflows/gate.yml` | push → base + cờ; PR → base, không cờ |
| `tests/scripts/run-tests.sh` | `TE1`…`TE16` |
| `tests/plugins/run-tests.sh` | `P40`…`P45`; viết lại P03/P22 |
| `GUIDE.md` | bump version thuộc S3 |
| `commands/acceptance-init.md` + `codex/acceptance-gate/skills/acceptance-init/SKILL.md` | nhắc cờ cho job push |
| `_acceptance/t1-escape-event-scope/evidence/t1escape-messages.txt` | bằng chứng cho judge, SINH máy |

---

### Task 1: Cờ + marker + dòng tổng kết

**Files:**
- Modify: `scripts/pre-merge-check.sh` (vòng parse arg ~50-60; khối T1-escape ~534; dòng tổng kết ~567)
- Test: `tests/scripts/run-tests.sh` (`TE1`, `TE2a/b`, `TE3`)

**Interfaces:**
- Consumes: `DIFF_READY`, `DIFF_FILES`, `violations` (đã có)
- Produces: biến `T1_ESCAPE=1|0`; hàm `t1_escape_not_enforced()`; hai chuỗi hằng ở Global Constraints

**Evals phục vụ:** E1 (AC-1), E2 (AC-2), E3 (AC-3)
**independent:** `false`

- [ ] **Step 1: Viết case ĐỎ**

Chèn cuối `tests/scripts/run-tests.sh`, trước dòng tổng kết. Dùng `mk_gp_repo`/`gp_feature`/`gp_commit` sẵn có (đọc quanh dòng 1680 để lấy đúng tên biến).

```bash
# ── TE: cờ --no-t1-escape ────────────────────────────────────────────────────
# Fixture: repo có src/app.js (t3_paths) + docs/, KHÔNG có _acceptance/<slug>/
# trong diff → răng T1-escape có cớ để nổ.
te_repo() { # <case> <file cần đổi> -> đặt TE_R, TE_B
  mk_gp_repo "$1"; TE_R="$GPR/$1"; TE_B="$GP_BASE"
  mkdir -p "$(dirname "$TE_R/$2")"; printf 'v2\n' >> "$TE_R/$2"
  git -C "$TE_R" add -A >/dev/null
  git -c user.email=t@t -c user.name=t -C "$TE_R" commit -qm change
}

echo "TE1 KHONG co co -> hanh vi Y HET hom nay (backward compat)"
te_repo te1 src/app.js
TE1="$(bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"; TE1ST=$?
hasout TE1  "VIOLATION [PR]" "$TE1"
check  TE1b 1 "$TE1ST"
nothas TE1c "T1-ESCAPE: NOT ENFORCED" "$TE1"

echo "TE2 co co -> rang tat, khong VIOLATION [PR]"
te_repo te2a src/app.js
TE2A="$(bash "$CHECK" "$TE_R" --base "$TE_B" --no-t1-escape 2>&1)"; check TE2a 0 $?
nothas TE2a2 "VIOLATION [PR]" "$TE2A"
# file khop t3_paths cung phai im (nhanh t3_hits, khong chi nhanh nont1_hits)
te_repo te2b src/app.js
TE2B="$(bash "$CHECK" "$TE_R" --base "$TE_B" --no-t1-escape 2>&1)"
nothas TE2b2 "T3 paths (t3_paths) changed" "$TE2B"

echo "TE3 khi tat phai keu to: hai chuoi NGUYEN VAN, moi cai dung MOT dong"
same TE3a 1 "$(printf '%s\n' "$TE2A" | grep -cF 'T1-ESCAPE: NOT ENFORCED reason=push-event-no-pr-premise')"
same TE3b 1 "$(printf '%s\n' "$TE2A" | grep -cF 'pre-merge-check: T1-escape: KHÔNG cưỡng chế trong lần chạy này (xem dòng marker NOT ENFORCED ở trên)')"
```

- [ ] **Step 2: Chạy cho thấy ĐỎ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep TE`
Expected: `TE2a` FAIL (script chưa biết cờ → coi `--no-t1-escape` là ROOT, đường dẫn sai), `TE3a`/`TE3b` FAIL (đếm 0). `TE1*` PASS ngay — đó là điểm: chúng chứng minh hành vi cũ chưa đổi.

- [ ] **Step 3: Thêm cờ**

Trong vòng `while` parse arg, thêm nhánh TRƯỚC `*)`:

```bash
    --no-t1-escape)
      # Opt-OUT, không nhận tham số. Vì sao opt-out chứ không phải opt-in `--pr`:
      # acceptance-init đang dạy consumer truyền đúng `--base`, nên opt-in sẽ làm
      # răng tắt IM LẶNG trên mọi repo tiêu thụ đang chạy — biến một sửa lỗi
      # thành lỗ fail-open hàng loạt. Xem docs/superpowers/specs/2026-07-26-
      # t1-escape-event-scope-design.md.
      T1_ESCAPE=0; shift ;;
```

Khai mặc định cạnh `BASE=`:

```bash
T1_ESCAPE=1
```

- [ ] **Step 4: Thêm hàm marker + bọc khối T1-escape**

Đặt hàm cạnh `gap_probe_not_enforced` (cùng khuôn, cùng chỗ):

```bash
# Cùng khuôn gap_probe_not_enforced: một hàm, một marker, một chỗ quyết định.
# Hai chuỗi là HẰNG — CI grep được, và suite so bằng `grep -F` nên không ai tự
# viết cả đề lẫn đáp án. Tắt im lặng là thứ luật này sinh ra để chặn.
T1_ESCAPE_OFF=0
t1_escape_not_enforced() {
  [ "$T1_ESCAPE_OFF" -eq 1 ] && return 0
  T1_ESCAPE_OFF=1
  echo "T1-ESCAPE: NOT ENFORCED reason=push-event-no-pr-premise"
}
```

Bọc khối T1-escape (dòng ~534, `if [ "$DIFF_READY" -eq 0 ]`):

```bash
if [ "$T1_ESCAPE" -eq 0 ]; then
  t1_escape_not_enforced
elif [ "$DIFF_READY" -eq 0 ]; then
  echo "NOTE: T1-escape backstop skipped — $DIFF_SKIP_NOTE"
else
  ...giữ nguyên toàn bộ thân cũ...
fi
```

Thêm dòng tổng kết, ngay cạnh dòng khai của gap-probe:

```bash
[ "$T1_ESCAPE_OFF" -eq 1 ] && echo "pre-merge-check: T1-escape: KHÔNG cưỡng chế trong lần chạy này (xem dòng marker NOT ENFORCED ở trên)"
```

- [ ] **Step 5: Chạy cho thấy XANH**

Run: `bash tests/scripts/run-tests.sh`
Expected: toàn bộ PASS. **Sanity counter:** `bash tests/scripts/run-tests.sh 2>&1 | grep -c 'PASS: TE'` ≥ 8.

- [ ] **Step 6: Chứng minh BIẾT ĐỎ (hai lần)**

a) Đổi marker một ký tự (`NOT ENFORCED` → `NOT-ENFORCED`) → `TE3a` PHẢI đỏ. Gỡ.
b) Đổi `elif` thành `if` ở Step 4 (răng chạy cả khi có cờ) → `TE2a2` PHẢI đỏ. Gỡ.

- [ ] **Step 7: Commit**

```bash
bash scripts/sync-plugin-packages.sh --write && git add -A && git commit -m "feat(pre-merge): cờ --no-t1-escape + marker T1-ESCAPE: NOT ENFORCED"
```

---

### Task 2: Cờ KHÔNG được là bypass toàn cục

**Files:** Test: `tests/scripts/run-tests.sh` (`TE4`, `TE5a/b`)
**Interfaces:** Consumes: cờ từ Task 1 · Produces: (không)
**Evals phục vụ:** E4 (AC-4), E5 (AC-5)
**independent:** `false`

Task này KHÔNG sửa mã sản phẩm nếu Task 1 làm đúng. Nếu nó phải sửa mã, nghĩa là Task 1 đã bọc quá tay — đó chính là điều cần phát hiện.

- [ ] **Step 1: Viết case**

```bash
echo "TE4 co co van KHONG tat luat gap-probe"
mk_gp_repo te4; R="$GPR/te4"; gp_feature "$R" feat-z T3 implemented
printf 'gap_probe: required\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
TE4="$(bash "$CHECK" "$R" --base "$GP_BASE" --no-t1-escape 2>&1)"; TE4ST=$?
hasout TE4  "chưa qua phản biện context sạch" "$TE4"
check  TE4b 1 "$TE4ST"

echo "TE5 co co van KHONG tat luat per-slug (chu ky / evidence)"
mk_gp_repo te5; R="$GPR/te5"; gp_feature "$R" feat-y T3 implemented
# gp_feature sinh evidence PASS + chu ky; go chu ky di de luat signoff phai no
sed -i.bak 's/^human_signoff:.*/human_signoff:/' "$R/_acceptance/feat-y/evidence-report.md" && rm -f "$R/_acceptance/feat-y/evidence-report.md.bak"
gp_commit "$R"
TE5="$(bash "$CHECK" "$R" --base "$GP_BASE" --no-t1-escape 2>&1)"; TE5ST=$?
check  TE5a 1 "$TE5ST"
nothas TE5b "pre-merge-check: clean" "$TE5"
```

- [ ] **Step 2: Chạy**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep TE4\|TE5`
Expected: PASS ngay. Nếu ĐỎ → Task 1 bọc quá tay, quay lại thu hẹp điều kiện `if`.

- [ ] **Step 3: Chứng minh BIẾT ĐỎ**

Tạm cho `--no-t1-escape` set luôn `GAP_PROBE_MODE=off` → `TE4` PHẢI đỏ. Gỡ.

- [ ] **Step 4: Commit**

```bash
git add tests/scripts/run-tests.sh && git commit -m "test(pre-merge): cờ --no-t1-escape không phải bypass toàn cục (AC-4, AC-5)"
```

---

### Task 3: `plugins/**` vào t1_skip_globs + ghim lọc PER-FILE

**Files:**
- Modify: `_acceptance/config.yaml`
- Test: `tests/scripts/run-tests.sh` (`TE7`, `TE14`, `TE15`)

**Interfaces:** Consumes: `match_globs` (đã có) · Produces: (không)
**Evals phục vụ:** E7 (AC-7), E15 (AC-14), E16 (AC-15)
**independent:** `false`

- [ ] **Step 1: Viết case ĐỎ — ca HỖN HỢP là ca quan trọng nhất**

```bash
echo "TE7 diff CHI plugins/ -> rang khong no"
te_repo te7 plugins/acceptance-gate/scripts/x.js
TE7="$(bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"
nothas TE7a "VIOLATION [PR]" "$TE7"

echo "TE14 diff HON HOP (plugins/ + non-T1) -> VAN no, liet DUNG file non-T1"
mk_gp_repo te14; TE_R="$GPR/te14"; TE_B="$GP_BASE"
mkdir -p "$TE_R/plugins/acceptance-gate/scripts"
printf 'x\n' > "$TE_R/plugins/acceptance-gate/scripts/x.js"
printf 'v2\n' >> "$TE_R/src/app.js"
git -C "$TE_R" add -A >/dev/null
git -c user.email=t@t -c user.name=t -C "$TE_R" commit -qm mixed
TE14="$(bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"
hasout TE14a "VIOLATION [PR]" "$TE14"
hasout TE14b "src/app.js" "$TE14"
nothas TE14c "plugins/" "$TE14"

echo "TE15 diff CHI file T1 thuan -> khong no (true-negative)"
te_repo te15 docs/note.md
TE15="$(bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"; check TE15 0 $?
nothas TE15b "VIOLATION [PR]" "$TE15"
```

> `mk_gp_repo` sinh config có `t1_skip_globs: ["docs/**"]` và `t3_paths: ["src/**"]` — đọc lại hàm đó trước khi viết, và **thêm `plugins/**` vào config fixture** cho `TE7`/`TE14`.

- [ ] **Step 2: Chạy cho thấy ĐỎ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | grep TE7\|TE14\|TE15`
Expected: `TE7a` FAIL (fixture chưa có `plugins/**` trong globs). `TE14*` PASS ngay — mã hiện tại đã lọc per-file, nên case này là **răng giữ**, không phải sửa lỗi. Ghi rõ điều đó vào transcript.

- [ ] **Step 3: Thêm glob vào config self-host**

```yaml
    # Build mirror sinh máy (ADR 0001). An toàn để miễn trừ: P30
    # (sync-plugin-packages.sh --check) canh `mirror == nguồn` độc lập, nên sửa
    # tay ở đây bị chặn bởi luật khác — xem case P41.
    - "plugins/**"
```

- [ ] **Step 4: Chạy → XANH**

- [ ] **Step 5: Chứng minh BIẾT ĐỎ — ca hỗn hợp**

Tạm đổi vòng lọc trong khối T1-escape thành whole-diff:
```bash
  if match_globs "$f" "$T1_GLOBS"; then continue; fi   # (sai có chủ đích)
```
…rồi thêm một `break` sau hit đầu tiên để mô phỏng "cả diff là T1" → `TE14a` PHẢI đỏ. Gỡ. Đây là RED chứng minh ngữ nghĩa per-file thật sự được đo.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(config): plugins/** vào t1_skip_globs + ghim lọc per-file (AC-7/14/15)"
```

---

### Task 4: Miễn trừ mirror KHÔNG được thành lỗ

**Files:** Test: `tests/plugins/run-tests.sh` (`P41`)
**Interfaces:** Consumes: `scripts/sync-plugin-packages.sh --check` · Produces: (không)
**Evals phục vụ:** E8 (AC-8)
**independent:** `true`

RED bắt buộc của Task 3. Allowlist mà không có ca ngoài danh sách là allowlist biến fail-loud thành fail-silent.

- [ ] **Step 1: Viết case**

```bash
echo "P41 sua tay mirror -> P30 VAN do (mien tru plugins/ khong phai lo)"
P41T="$(mktemp -d)"; cp -R "$ROOT/." "$P41T/" 2>/dev/null
printf '\n// tiêm\n' >> "$P41T/plugins/acceptance-gate/lib/gap-probe.js"
if bash "$P41T/scripts/sync-plugin-packages.sh" --check >/dev/null 2>&1; then
  fail "P41 mirror drift phai bi bat"
else
  pass "P41 mirror drift phai bi bat"
fi
rm -rf "$P41T"
```

- [ ] **Step 2: Chạy** — Expected: PASS. Nếu FAIL thì miễn trừ ở Task 3 **là lỗ thật** → DỪNG, báo user, không đi tiếp.

- [ ] **Step 3: Chứng minh BIẾT ĐỎ**

Bỏ dòng `printf … >> …gap-probe.js` (không tiêm gì) → `P41` PHẢI đỏ (vì `--check` xanh). Khôi phục.

- [ ] **Step 4: Commit**

```bash
git add tests/plugins/run-tests.sh && git commit -m "test(plugins): P41 — miễn trừ plugins/** không phải lỗ (AC-8)"
```

---

### Task 5: P03/P22 thôi ghim version bằng literal

**Files:** Modify: `tests/plugins/run-tests.sh` (P03 ~35, P22 ~?); Test: `P42`, `P45`
**Interfaces:** Produces: (không)
**Evals phục vụ:** E9 (AC-9), E10 (AC-10)
**independent:** `true`

- [ ] **Step 1: Viết case ĐỎ trước khi sửa P03/P22**

```bash
echo "P42 mot manifest lech so -> suite phai DO"
P42T="$(mktemp -d)"; cp -R "$ROOT/." "$P42T/" 2>/dev/null
python3 - "$P42T" <<'PY'
import json,sys,pathlib
p=pathlib.Path(sys.argv[1])/".codex-plugin/plugin.json"
d=json.loads(p.read_text()); d["version"]="9.9.9"; p.write_text(json.dumps(d,indent=2)+"\n")
PY
if bash "$P42T/tests/plugins/run-tests.sh" >/dev/null 2>&1; then
  fail "P42 manifest lech phai bi bat"
else
  pass "P42 manifest lech phai bi bat"
fi
rm -rf "$P42T"

echo "P45 bump CA BA manifest + sync -> khong case nao phai sua"
P45T="$(mktemp -d)"; cp -R "$ROOT/." "$P45T/" 2>/dev/null
python3 - "$P45T" <<'PY'
import json,sys,pathlib
root=pathlib.Path(sys.argv[1])
for rel in [".claude-plugin/plugin.json",".codex-plugin/plugin.json","codex/acceptance-gate/.codex-plugin/plugin.json"]:
    p=root/rel; d=json.loads(p.read_text()); d["version"]="9.9.9"; p.write_text(json.dumps(d,indent=2)+"\n")
PY
bash "$P45T/scripts/sync-plugin-packages.sh" --write >/dev/null 2>&1
# Menh de that cua AC-9: KHONG file nao duoi tests/ phai sua
if git -C "$P45T" diff --exit-code -- tests/ >/dev/null 2>&1 \
   && bash "$P45T/tests/plugins/run-tests.sh" >/dev/null 2>&1; then
  pass "P45 bump ba manifest khong cham suite"
else
  fail "P45 bump ba manifest khong cham suite"
fi
rm -rf "$P45T"
```

- [ ] **Step 2: Chạy cho thấy ĐỎ**

Run: `bash tests/plugins/run-tests.sh 2>&1 | grep P42\|P45`
Expected: `P42` PASS (literal hiện tại bắt được), `P45` **FAIL** — vì P03/P22 còn ghim `"1.21.0"`.

- [ ] **Step 3: Viết lại P03 và P22**

Trong P03, thay hai dòng ghim literal:

```python
# Ba manifest phải KHỚP NHAU. KHÔNG ghim literal: ghim literal khiến mỗi lần
# bump đều sửa suite, mà suite đổi là code đổi thật nên evidence stale — vòng
# lặp "ký -> bump -> stale -> verify lại -> ký lại". Xem AC-9/AC-10.
versions = {root_claude["version"], root_codex["version"], overlay_codex["version"]}
assert len(versions) == 1, f"ba manifest lệch nhau: {versions}"
assert root_claude["version"], "version rỗng"
```

Trong P22, bỏ hai dòng `== "1.21.0"` tương ứng, giữ nguyên các assert khác (feature-loop `1.16.1`, design-loop `0.3.0` — **không** đụng, chúng là version độc lập).

- [ ] **Step 4: Chạy → cả `P42` lẫn `P45` XANH**

- [ ] **Step 5: Chứng minh BIẾT ĐỎ**

Đổi assert thành `assert len(versions) >= 1` (luôn đúng) → `P42` PHẢI đỏ. Gỡ.

- [ ] **Step 6: Commit**

```bash
git add tests/plugins/run-tests.sh && git commit -m "test(plugins): P03/P22 kiểm ba manifest khớp nhau, thôi ghim literal (AC-9/AC-10)"
```

---

### Task 6: `gate.yml` dùng cờ

**Files:** Modify: `.github/workflows/gate.yml`; Test: `tests/plugins/run-tests.sh` (`P40`)
**Evals phục vụ:** E6 (AC-6)
**independent:** `false` (cần cờ từ Task 1)

- [ ] **Step 1: Viết case ĐỎ**

```bash
echo "P40 gate.yml: push co --no-t1-escape, PR khong, khong nhanh nao thieu base"
python3 - "$ROOT" <<'PY'
import sys, re
from pathlib import Path
wf = (Path(sys.argv[1]) / ".github/workflows/gate.yml").read_text()
assert "--no-t1-escape" in wf, "push phải tắt răng T1-escape"
# nhánh PR không được mang cờ
pr = [l for l in wf.splitlines() if "base_ref" in l]
assert pr and not any("--no-t1-escape" in l for l in pr), "nhánh PR không được tắt răng"
# không lời gọi pre-merge-check nào thiếu base
for l in wf.splitlines():
    if "pre-merge-check.sh" in l:
        assert "--base" in l or "PRE_MERGE_BASE" in wf, f"gọi thiếu base: {l.strip()}"
PY
```

- [ ] **Step 2: Chạy → ĐỎ** (`--no-t1-escape` chưa có trong file)

- [ ] **Step 3: Sửa `gate.yml`**

```yaml
      - name: Resolve PR base
        run: |
          if [ "${{ github.event_name }}" = "pull_request" ]; then
            echo "PRE_MERGE_BASE=origin/${{ github.base_ref }}" >> "$GITHUB_ENV"
            echo "T1_ESCAPE_FLAG=" >> "$GITHUB_ENV"
          else
            # push: có base (gap-probe cần phạm vi) nhưng răng T1-escape TẮT —
            # tiền đề "PR phải kèm artifact" sai với commit release/mirror-sync.
            echo "PRE_MERGE_BASE=$(git rev-parse HEAD~1)" >> "$GITHUB_ENV"
            echo "T1_ESCAPE_FLAG=--no-t1-escape" >> "$GITHUB_ENV"
          fi
      - name: pre-merge check (evidence + signoff + stale + run-log)
        run: bash scripts/pre-merge-check.sh . $T1_ESCAPE_FLAG
```

- [ ] **Step 4: Chạy → XANH**

- [ ] **Step 5: Chứng minh BIẾT ĐỎ** — bỏ dòng `T1_ESCAPE_FLAG=--no-t1-escape` → `P40` PHẢI đỏ. Gỡ.

- [ ] **Step 6: Commit**

---

### Task 7: End-to-end — đo TRIỆU CHỨNG GỐC

**Files:** Test: `tests/scripts/run-tests.sh` (`TE16`)
**Evals phục vụ:** E17 (AC-16), E18 (AC-17)
**independent:** `false`

Đây là AC duy nhất đo **mục tiêu** chứ không đo hành vi của cờ. Không có nó, feature có thể 16 eval xanh mà cổng vẫn đỏ trên main.

- [ ] **Step 1: Viết case**

```bash
echo "TE16 commit ha tang (bump + sync, khong _acceptance/) -> clean, exit 0"
mk_gp_repo te16; R="$GPR/te16"
gp_feature "$R" feat-done T3 signed-off
printf 'plugins/**\n' >/dev/null   # config fixture da co tu Task 3
gp_commit "$R"
# evidence phai pin dung commit nay, neu khong stale-guard no truoc
TE16_SHA="$(git -C "$R" rev-parse HEAD)"
sed -i.bak "s/^verified_commit:.*/verified_commit: $TE16_SHA/" "$R/_acceptance/feat-done/evidence-report.md" && rm -f "$R/_acceptance/feat-done/evidence-report.md.bak"
git -C "$R" add -A >/dev/null; git -c user.email=t@t -c user.name=t -C "$R" commit -qm pin
TE16_BASE="$(git -C "$R" rev-parse HEAD)"
# commit "ha tang": doi manifest + mirror, KHONG file nao duoi _acceptance/
mkdir -p "$R/plugins/acceptance-gate"; printf '{"version":"9.9.9"}\n' > "$R/plugins/acceptance-gate/plugin.json"
printf 'x\n' >> "$R/src/app.js"
git -C "$R" add -A >/dev/null; git -c user.email=t@t -c user.name=t -C "$R" commit -qm release
TE16="$(bash "$CHECK" "$R" --base "$TE16_BASE" --no-t1-escape 2>&1)"; TE16ST=$?
check  TE16a 0 "$TE16ST"
hasout TE16b "pre-merge-check: clean" "$TE16"
```

> `gp_feature` hiện chỉ sinh evidence cho `implemented|verified|signed-off` — kiểm nó có ghi `human_signoff` và `verified_commit` không; thiếu field nào thì bổ sung TRONG fixture, đừng nới luật.

- [ ] **Step 2–4:** chạy → sửa fixture cho tới khi xanh vì **đúng lý do** (soi stdout đầy đủ ít nhất một lần, đừng chỉ tin exit code).

- [ ] **Step 5: Chứng minh BIẾT ĐỎ** — bỏ `--no-t1-escape` khỏi lệnh → `TE16a` PHẢI đỏ với `VIOLATION [PR]`. Khôi phục.

- [ ] **Step 6: Commit**

---

### Task 8: Bằng chứng cho judge + gác cổng

**Files:** Test: `tests/scripts/run-tests.sh` (`TE14evd` — đặt tên `TE17` để khỏi đụng); Create: `_acceptance/t1-escape-event-scope/evidence/t1escape-messages.txt`
**Evals phục vụ:** E14 (gác cổng AC-13), E13 (judge)
**independent:** `false`

- [ ] **Step 1: Viết case sinh-lại-rồi-diff** (cùng khuôn `GPM12` của feature trước — đọc nó trước khi viết)

Gom stdout của 2 fixture: răng BẬT (có `VIOLATION [PR]`) và răng TẮT (có 2 chuỗi hằng). Lọc theo chủ đề `grep -E 'T1-ESCAPE|VIOLATION \[PR\]|T1-escape'`, giữ TRỌN CÂU. Ghi lại khi `TE17_WRITE=1`, còn lại `diff -u` byte-đối-byte.

- [ ] **Step 2–4:** ĐỎ → `TE17_WRITE=1 bash tests/scripts/run-tests.sh` → XANH.

- [ ] **Step 5: Chứng minh BIẾT ĐỎ** — đổi MỘT CHỮ trong marker → `TE17` PHẢI đỏ kèm diff đúng dòng đó.

- [ ] **Step 6: Commit**

---

### Task 9: Tài liệu — thứ tự S3 và cờ cho consumer

**Files:** Modify: `GUIDE.md`, `commands/acceptance-init.md`, `codex/acceptance-gate/skills/acceptance-init/SKILL.md`; Test: `tests/plugins/run-tests.sh` (`P43`, `P44`)
**Evals phục vụ:** E11 (AC-11), E12 (AC-12)
**independent:** `true`

- [ ] **Step 1: Viết case ĐỎ**

```bash
echo "P43 GUIDE noi bump version thuoc S3"
python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
g = (Path(sys.argv[1]) / "GUIDE.md").read_text()
assert "bump version" in g.lower() or "bump phiên bản" in g.lower()
assert "S3" in g and "stale" in g.lower(), "phải nêu lý do bump-sau-Cổng-2 làm evidence stale"
PY

echo "P44 acceptance-init CA HAI harness nhac co cho job push"
python3 - "$ROOT" <<'PY'
import sys
from pathlib import Path
root = Path(sys.argv[1])
for rel in ["commands/acceptance-init.md",
            "codex/acceptance-gate/skills/acceptance-init/SKILL.md"]:
    t = (root / rel).read_text()
    assert "--no-t1-escape" in t, f"{rel} chưa nhắc cờ cho job push"
PY
```

- [ ] **Step 2: Chạy → ĐỎ**

- [ ] **Step 3: Viết tài liệu**

GUIDE, mục vòng đời — thêm một đoạn ở S3:

> **Bump version + sync mirror thuộc S3, KHÔNG phải S5.** Bump sau Cổng 2 làm evidence stale (report pin commit trước bump) và huỷ chính chữ ký vừa lấy — phải chạy thêm một vòng verify và xin chữ ký lần hai. Đã dẫm 2026-07-26: ký ở `827f549`, bump ở `834eae8`, guard nổ ngay.

`acceptance-init` (cả hai harness), bước wire CI — thêm sau dòng hướng dẫn `--base`:

> Job chạy trên `push` (không phải PR) phải thêm `--no-t1-escape`: răng T1-escape có tiền đề "PR phải kèm `_acceptance/<slug>/`", tiền đề đó sai với commit release/mirror-sync trên nhánh chính. Vẫn giữ `--base` — gap-probe cần phạm vi diff.

- [ ] **Step 4: Chạy → XANH**
- [ ] **Step 5: BIẾT ĐỎ** — xoá cờ khỏi một trong hai file → `P44` PHẢI đỏ.
- [ ] **Step 6:** `sync-plugin-packages.sh --write`, commit.

---

## Verify cuối

```bash
bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh && bash tests/plugins/run-tests.sh && bash scripts/sync-plugin-packages.sh --check && node scripts/eval-coverage-lint.js .
```

Rồi tự chạy cổng ở CẢ HAI chế độ:

```bash
bash scripts/pre-merge-check.sh . --base HEAD~1 --no-t1-escape
bash scripts/pre-merge-check.sh . --base 9b545a8
```

**KHÔNG tự chạy evals để chấm điểm** — việc của S4 với agent tươi.

## Self-Review

**Độ phủ contract — 17 AC** (AC-16 viết lại + AC-17 thêm ở S3 sau khi gap-probe/probe biết-đỏ lộ mâu thuẫn; xem ledger `d-209`):

| AC | Task | AC | Task |
|---|---|---|---|
| AC-1 | 1 | AC-9 | 5 |
| AC-2 | 1 | AC-10 | 5 |
| AC-3 | 1 | AC-11 | 9 |
| AC-4 | 2 | AC-12 | 9 |
| AC-5 | 2 | AC-13 | 8 (+judge S4) |
| AC-6 | 6 | AC-14 | 3 |
| AC-7 | 3 | AC-15 | 3 |
| AC-8 | 4 | AC-16 · AC-17 | 7 |

Không AC nào không có task.

**Placeholder scan:** không có "TBD"/"tương tự Task N". Bốn chỗ bảo "đọc hàm/case hiện có trước khi viết" (Task 1 Step 1, Task 3 Step 1, Task 7 Step 1, Task 8 Step 1) là **có chủ đích** — suite đã >300 case, đoán tên biến là lớp lỗi đã xảy ra (`GP*` đụng tên).

**Type consistency:** `T1_ESCAPE` (0|1, cờ dòng lệnh) và `T1_ESCAPE_OFF` (0|1, đã in marker chưa) là **hai** biến khác nhau — Task 1 khai cả hai, Task 6 chỉ dùng tên cờ CI `T1_ESCAPE_FLAG`. Ba tên, ba vai, không trùng.

**Thứ tự phụ thuộc:** 1 → 2 → 3 → 7 → 8; 6 sau 1. Task 4, 5, 9 `independent: true`.
