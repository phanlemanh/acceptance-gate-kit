# Sổ luật-đã-chạy (premerge-rules-ledger) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `pre-merge-check.sh` chỉ được in `clean` khi CHỨNG MINH được bằng sổ: mọi khối luật hoặc `ran` hoặc `declared-off`; lệch sổ = `VIOLATION [ledger]` + exit 2.

**Architecture:** Một danh sách EXPECTED đóng (`per-slug gap-probe t1-escape`) + một hàm `ledger_mark` duy nhất + một điểm nghẽn trước kết luận so set-equality hai chiều. Mỗi mark đặt sao cho có HAI đường dẫn độc lập về lexical (tiêm hỏng một đường thì đường kia tố cáo). Chokepoint thuần bash — không phụ thuộc binary ngoài, để trạng thái node-vắng (AC-12) không tự phá sổ.

**Tech Stack:** bash (script + suite `tests/scripts/run-tests.sh`), suite plugins `tests/plugins/run-tests.sh`.

## Global Constraints

- Contract: `_acceptance/premerge-rules-ledger/contract.md` (12 AC, T3). Bảng biểu diễn AC-3 và chữ ký `ledger_mark` AC-7 là kết quả gap-probe đã seal — KHÔNG thiết kế lại.
- **Bất biến CLAUDE.md #4:** mọi case dựng bản sao/tiêm PHẢI có (a) đối chứng dương — bản nguyên vẹn XANH trước, (b) ghim ĐÚNG thông điệp. Áp cho MỌI case RL, quét theo LỚP.
- `plugins/` là build mirror: mọi commit chạm `scripts/pre-merge-check.sh` PHẢI chạy `bash scripts/sync-plugin-packages.sh` và commit mirror CÙNG lượt (P30 chặn drift).
- KHÔNG thêm lối `exit 0` mới — đúng HAI lối (AC-6). KHÔNG viết chuỗi "exit 0" trong comment mới (RL6 đếm trên dòng không-phải-comment, nhưng đừng thử vận may với inline comment).
- KHÔNG thêm cờ CLI mới, KHÔNG đổi format marker hiện có, KHÔNG đổi ngữ nghĩa luật nào (ranh giới design doc).
- Dòng sổ NGUYÊN VĂN: `ran <tên>` / `declared-off <tên>` (dòng trần, stdout). Dòng tổng kết NGUYÊN VĂN: `pre-merge-check: rules ran=<n> declared-off=<m> expected=<k>`.
- Thông điệp ghim (dùng đúng, không paraphrase):
  - `VIOLATION [ledger]: luật <tên> không chạy và không khai tắt`
  - `VIOLATION [ledger]: tên lạ <tên> — cập nhật EXPECTED`
  - `VIOLATION [ledger]: luật <tên> ghi sổ <c> lần — trạng thái sổ không nhất quán` (phòng thủ, không có case riêng)
  - Dòng hướng dẫn (in MỘT lần khi sổ lệch, phục vụ AC-10): `NOTE: VIOLATION [ledger] là lỗi NỘI TẠI của cổng pre-merge (một khối luật bị trượt qua hoặc sổ lệch) — KHÔNG phải lỗi trong thay đổi của bạn. Bước kế tiếp: báo maintainer của kit kèm TOÀN BỘ output lần chạy này; đừng sửa feature của bạn để né nó.`
- Case suite scripts tiền tố `RL*`, case plugins `P48`. Viết thông điệp theo term CONTEXT.md (tránh mọi từ trong `_Avoid_`).
- Sau MỖI task: `bash tests/scripts/run-tests.sh` toàn bộ phải xanh (208+ check hiện có không được vỡ).

## Hai điểm diễn giải contract (đã trình Gate 1.5)

1. **Lối exit-0 (a) `no _acceptance/ — nothing to check` KHÔNG in dòng tổng kết sổ** — chưa có đối tượng để luật chạy, "kết luận" trong AC-5 hiểu là kết luận của các luật. E5 không có case cho lối (a).
2. **Khi sổ lệch VÀ đồng thời có violation thường:** exit 2 thắng (lỗi nội tại của cổng trội hơn kết luận chặn-merge thường).

---

### Task 1: Ledger core + marks đường-chạy-đủ (RL1)

**Files:**
- Modify: `scripts/pre-merge-check.sh`
- Test: `tests/scripts/run-tests.sh` (chèn section RL ngay TRƯỚC khối `echo ""` / `echo "Results:..."` cuối file)

**Interfaces:**
- Produces: biến `LEDGER_EXPECTED="per-slug gap-probe t1-escape"`, `LEDGER_K`, `LEDGER_ENABLED`, hàm `ledger_mark <ran|declared-off> <tên>`, hàm `ledger_count <tên>`, counters `LEDGER_RAN_N/LEDGER_OFF_N`, danh sách `LEDGER_RAN/LEDGER_OFF` (chuỗi cách nhau bằng space). Task 2-5 dựa đúng các tên này.

- [ ] **Step 1: Viết case RL1 (failing test)**

Chèn vào `tests/scripts/run-tests.sh` ngay trước khối Results cuối file:

```bash
# ── RL: sổ luật-đã-chạy — `clean` phải được chứng minh ──────────────────────
# Fixture chuẩn: repo git có MỘT slug ngoài diff (vòng per-slug có việc thật),
# diff chỉ chạm docs -> mọi luật chạy trọn, không violation. Đây là đối chứng
# dương dùng chung của cả nhóm RL.
rl_repo() { # <case> — đặt TE_R (root) + TE_B (base sha)
  mk_gp_repo "$1"; TE_R="$GPR/$1"
  gp_feature "$TE_R" feat-rl T3 implemented
  git -C "$TE_R" add -A >/dev/null
  git -c user.email=t@t -c user.name=t -C "$TE_R" commit -qm feat
  TE_B="$(git -C "$TE_R" rev-parse HEAD)"
  mkdir -p "$TE_R/docs"; printf 'v2\n' >> "$TE_R/docs/note.md"
  git -C "$TE_R" add -A >/dev/null
  git -c user.email=t@t -c user.name=t -C "$TE_R" commit -qm docs
}

echo "RL1 repo sach: ca ba luat chay, tong ket dung MOT lan, khong declared-off"
rl_repo rl1
RL1="$(bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"; check RL1 0 $?
hasout RL1a "pre-merge-check: clean" "$RL1"
same RL1b 1 "$(printf '%s\n' "$RL1" | grep -cx 'ran per-slug')"
same RL1c 1 "$(printf '%s\n' "$RL1" | grep -cx 'ran gap-probe')"
same RL1d 1 "$(printf '%s\n' "$RL1" | grep -cx 'ran t1-escape')"
same RL1e 1 "$(printf '%s\n' "$RL1" | grep -c '^pre-merge-check: rules ran=')"
hasout RL1f "pre-merge-check: rules ran=3 declared-off=0 expected=3" "$RL1"
# RL3c (âm, AC-3): luật KHÔNG tắt thì KHÔNG được có dòng declared-off nào
same RL3c 0 "$(printf '%s\n' "$RL1" | grep -c '^declared-off ')"
```

- [ ] **Step 2: Chạy suite, xác nhận RL1 ĐỎ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | tail -15`
Expected: `FAIL: RL1b` … `FAIL: RL1f` (script chưa in dòng sổ nào); các case cũ vẫn PASS.

- [ ] **Step 3: Implement ledger core trong `scripts/pre-merge-check.sh`**

3a. Ngay SAU vòng `while [ $# -gt 0 ]` parse args (sau dòng `done` ~line 84), chèn:

```bash
# ─── Sổ luật-đã-chạy (rules ledger) ─────────────────────────────────────────
# `clean` phải được CHỨNG MINH, không phải mặc định: mọi khối luật ghi sổ qua
# ledger_mark; điểm nghẽn trước kết luận so EXPECTED với sổ HAI CHIỀU. Lệch =
# lỗi NỘI TẠI của cổng -> exit 2, không phải violation của feature. EXPECTED
# là danh sách ĐÓNG, CỐ ĐỊNH, không phụ thuộc config — thêm khối luật mới
# PHẢI thêm tên vào đây (suite P48 + RL7a canh hai chiều bằng máy).
LEDGER_EXPECTED="per-slug gap-probe t1-escape"
set -- $LEDGER_EXPECTED
LEDGER_K=$#
LEDGER_ENABLED=1
LEDGER_RAN=""; LEDGER_OFF=""; LEDGER_RAN_N=0; LEDGER_OFF_N=0
ledger_mark() { # <ran|declared-off> <tên>
  [ "$LEDGER_ENABLED" -eq 1 ] || return 0
  case "$1" in
    ran)          LEDGER_RAN="${LEDGER_RAN}${2} "; LEDGER_RAN_N=$((LEDGER_RAN_N+1)) ;;
    declared-off) LEDGER_OFF="${LEDGER_OFF}${2} "; LEDGER_OFF_N=$((LEDGER_OFF_N+1)) ;;
  esac
  echo "$1 $2"
}
ledger_count() { # <tên> — số lần tên xuất hiện trong sổ (thuần bash: chokepoint
  # không được phụ thuộc binary ngoài, vì trạng thái node-vắng của AC-12 phải
  # đi qua nó mà không tự phá sổ)
  local c=0 w
  for w in $LEDGER_RAN $LEDGER_OFF; do [ "$w" = "$1" ] && c=$((c+1)); done
  echo "$c"
}
```

Lưu ý: `set -- $LEDGER_EXPECTED` xoá positional params — hợp lệ vì đứng SAU vòng parse args.

3b. Trong khối `if [ -f "$ACC/config.yaml" ]` (sau dòng đọc `cfg_req`), thêm đọc `enforcement` (cùng ngữ nghĩa hook: chỉ `off` tắt):

```bash
  cfg_enf="$(sed -n 's/^enforcement:[[:space:]]*//p' "$ACC/config.yaml" | head -1 \
    | sed -e 's/[[:space:]]*#.*$//' -e 's/^["'"'"']//' -e 's/["'"'"']$//' -e 's/[[:space:]]*$//' \
    | tr '[:upper:]' '[:lower:]')"
  # off là off toàn cục (tiền lệ hook) — sổ tắt theo, không dòng nào (AC-11).
  case "$cfg_enf" in off) LEDGER_ENABLED=0 ;; esac
```

3c. Ngay SAU khối config (sau `fi` đóng `if [ -f "$ACC/config.yaml" ]`, trước khối `if [ "$RECHECK_MODE" = "warn" ]`):

```bash
# AC-3: gap_probe: off trong config (kể cả mode sai chính tả đã rơi về off ở
# trên, sau khi VIOLATION [config] nổ) là tắt CÓ khai báo.
[ "$GAP_PROBE_MODE" = "off" ] && ledger_mark declared-off gap-probe
```

3d. Trong `gap_probe_not_enforced()`, ngay sau dòng `GP_NOT_ENFORCED=1`:

```bash
  ledger_mark declared-off gap-probe
```

(mode `off` đã return trước đó nên không mark đôi.)

3e. Trong `t1_escape_not_enforced()`, ngay sau dòng `T1_ESCAPE_OFF=1`:

```bash
  ledger_mark declared-off t1-escape
```

3f. Ngay TRƯỚC dòng `for dir in "$ACC"/*/; do` (vòng per-slug chính):

```bash
# per-slug: hai đường dẫn độc lập về lexical — vòng đếm dưới đây dùng biến
# _sd, vòng luật thật dùng dir. Tiêm hỏng một vòng thì con số lệch và điểm
# nghẽn từ chối kết luận (AC-9: bắt cả biến thể CHƯA nghĩ ra).
SLUG_SEEN=0; SLUG_EXPECTED_N=0
for _sd in "$ACC"/*/; do [ -d "$_sd" ] && SLUG_EXPECTED_N=$((SLUG_EXPECTED_N+1)); done
GP_SCOPE_N=0; GP_RAN=0
```

3g. Dòng ĐẦU TIÊN trong thân vòng, ngay sau `[ -d "$dir" ] || continue`:

```bash
  SLUG_SEEN=$((SLUG_SEEN+1))
```

(TRƯỚC filter `--slug` — đếm mọi thư mục vòng lặp nhìn thấy.)

3h. Ngay TRƯỚC dòng comment header `# ─── Gap-probe presence (phản biện context sạch) ───...` (vẫn trong vòng lặp):

```bash
  # Counter scope NẰM NGOÀI khối luật bên dưới và cố ý khác lexical (off không
  # nháy kép): tiêm vô hiệu khối thì counter vẫn đếm, sổ lệch, chokepoint bắt.
  [ "$GAP_PROBE_MODE" != off ] && slug_in_diff "$slug" && GP_SCOPE_N=$((GP_SCOPE_N+1))
```

3i. Trong khối gap-probe presence, nhánh `else` (khi `gp_line` không rỗng), ngay TRƯỚC `gp_outcome=`:

```bash
      if [ "$GP_RAN" -eq 0 ]; then GP_RAN=1; ledger_mark ran gap-probe; fi
```

3j. Ngay SAU dòng `done` đóng vòng per-slug chính:

```bash
# per-slug chỉ được ghi `ran` khi vòng lặp nhìn thấy ĐÚNG số thư mục mà phép
# đếm độc lập nhìn thấy.
[ "$SLUG_SEEN" -eq "$SLUG_EXPECTED_N" ] && ledger_mark ran per-slug
# gap-probe vũ trang nhưng scope rỗng (không slug nào trong diff) = đã chạy
# trọn phần việc của nó. GP_SCOPE_N > 0 mà GP_RAN=0 -> KHÔNG mark -> sổ lệch.
if [ "$GAP_PROBE_MODE" != "off" ] && [ "$GP_NOT_ENFORCED" -eq 0 ] && [ "$GP_RAN" -eq 0 ] && [ "$GP_SCOPE_N" -eq 0 ]; then
  ledger_mark ran gap-probe
fi
```

3k. Khối T1-escape cuối file:
- Trong nhánh `elif [ "$DIFF_READY" -eq 0 ]; then` — sau dòng `echo "NOTE: T1-escape backstop skipped — ..."`, thêm:

```bash
  ledger_mark declared-off t1-escape
```

- Cuối nhánh `else` (sau `fi` đóng `if [ "$gate_touched" -eq 0 ]`, trước `fi` đóng cả khối), thêm:

```bash
  ledger_mark ran t1-escape
```

3l. Chokepoint — chèn SAU hai dòng tổng kết `[ "$GP_NOT_ENFORCED" -eq 1 ] && ...` / `[ "$T1_ESCAPE_OFF" -eq 1 ] && ...`, TRƯỚC khối `if [ "$violations" -gt 0 ]`:

```bash
# ─── Điểm nghẽn sổ luật: `clean` phải được chứng minh (AC-2/AC-5/AC-7) ──────
if [ "$LEDGER_ENABLED" -eq 1 ]; then
  ledger_bad=0
  for _n in $LEDGER_EXPECTED; do
    _c="$(ledger_count "$_n")"
    if [ "$_c" -eq 0 ]; then
      echo "VIOLATION [ledger]: luật $_n không chạy và không khai tắt"
      ledger_bad=1
    elif [ "$_c" -gt 1 ]; then
      echo "VIOLATION [ledger]: luật $_n ghi sổ $_c lần — trạng thái sổ không nhất quán"
      ledger_bad=1
    fi
  done
  for _w in $LEDGER_RAN $LEDGER_OFF; do
    case " $LEDGER_EXPECTED " in
      *" $_w "*) ;;
      *) echo "VIOLATION [ledger]: tên lạ $_w — cập nhật EXPECTED"; ledger_bad=1 ;;
    esac
  done
  # k lấy từ LEDGER_K (đếm EXPECTED lúc khai báo) — TUYỆT ĐỐI không n+m: in
  # tổng tự cộng là tautology không bao giờ hiển thị lệch được (AC-5).
  echo "pre-merge-check: rules ran=$LEDGER_RAN_N declared-off=$LEDGER_OFF_N expected=$LEDGER_K"
  if [ "$ledger_bad" -eq 1 ]; then
    echo "NOTE: VIOLATION [ledger] là lỗi NỘI TẠI của cổng pre-merge (một khối luật bị trượt qua hoặc sổ lệch) — KHÔNG phải lỗi trong thay đổi của bạn. Bước kế tiếp: báo maintainer của kit kèm TOÀN BỘ output lần chạy này; đừng sửa feature của bạn để né nó."
    exit 2
  fi
fi
```

- [ ] **Step 4: Chạy suite, xác nhận XANH toàn bộ**

Run: `bash tests/scripts/run-tests.sh 2>&1 | tail -5`
Expected: `Results: <N> passed, 0 failed` — RL1* xanh VÀ toàn bộ S/GPM/TE cũ xanh (ledger nhất quán không đổi exit code nào — AC-1/AC-4).

- [ ] **Step 5: Sync mirror + commit**

```bash
bash scripts/sync-plugin-packages.sh
git add scripts/pre-merge-check.sh tests/scripts/run-tests.sh plugins/
git commit -m "feat(pre-merge): sổ luật-đã-chạy — ledger_mark + điểm nghẽn trước clean (Task 1, AC-1/AC-5 nửa đầu)"
```

Phục vụ: E1, E5 (một phần). `independent: false`.

---

### Task 2: Các đường declared-off (RL3a/RL3b/RL4)

**Files:**
- Test: `tests/scripts/run-tests.sh` (nối tiếp section RL)

**Interfaces:**
- Consumes: `rl_repo`, dòng sổ và dòng tổng kết từ Task 1.

- [ ] **Step 1: Viết 3 case**

```bash
echo "RL3a co --no-t1-escape -> dong so NGUYEN VAN 'declared-off t1-escape'"
rl_repo rl3a
RL3A="$(bash "$CHECK" "$TE_R" --base "$TE_B" --no-t1-escape 2>&1)"; check RL3a1 0 $?
same RL3a2 1 "$(printf '%s\n' "$RL3A" | grep -cx 'declared-off t1-escape')"
same RL3a3 0 "$(printf '%s\n' "$RL3A" | grep -cx 'ran t1-escape')"
hasout RL3a4 "pre-merge-check: rules ran=2 declared-off=1 expected=3" "$RL3A"
hasout RL3a5 "pre-merge-check: clean" "$RL3A"

echo "RL3b gap_probe: off trong config -> 'declared-off gap-probe'"
rl_repo rl3b
printf 'gap_probe: off\n' >> "$TE_R/_acceptance/config.yaml"
git -C "$TE_R" add -A >/dev/null
git -c user.email=t@t -c user.name=t -C "$TE_R" commit -qm cfg
RL3B="$(bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"; check RL3b1 0 $?
same RL3b2 1 "$(printf '%s\n' "$RL3B" | grep -cx 'declared-off gap-probe')"
same RL3b3 0 "$(printf '%s\n' "$RL3B" | grep -cx 'ran gap-probe')"
hasout RL3b4 "pre-merge-check: rules ran=2 declared-off=1 expected=3" "$RL3B"
hasout RL3b5 "pre-merge-check: clean" "$RL3B"

echo "RL4 khong --base + advisory -> exit Y HET TE18k, so khop qua marker"
rl_repo rl4
RL4="$(bash "$CHECK" "$TE_R" 2>&1)"; check RL4a 0 $?
same RL4b 1 "$(printf '%s\n' "$RL4" | grep -cx 'declared-off gap-probe')"
same RL4c 1 "$(printf '%s\n' "$RL4" | grep -cx 'declared-off t1-escape')"
same RL4d 1 "$(printf '%s\n' "$RL4" | grep -cx 'ran per-slug')"
hasout RL4e "pre-merge-check: rules ran=1 declared-off=2 expected=3" "$RL4"
hasout RL4f "pre-merge-check: clean" "$RL4"
```

- [ ] **Step 2: Chạy suite, xác nhận xanh**

Run: `bash tests/scripts/run-tests.sh 2>&1 | tail -5`
Expected: 0 failed. (Case này pin hành vi đã có từ Task 1 — RED thật nằm ở Step 3.)

- [ ] **Step 3: Biết-đỏ probe (chứng minh case sống)**

Tạm tiêm vào BẢN SAO để chứng minh RL3a2 phân biệt được:

```bash
cp scripts/pre-merge-check.sh /tmp/rl-probe.sh
# gỡ mark declared-off trong t1_escape_not_enforced
python3 - <<'PY'
import io
p='/tmp/rl-probe.sh'; t=io.open(p,encoding='utf-8').read()
t=t.replace('  T1_ESCAPE_OFF=1\n  ledger_mark declared-off t1-escape\n','  T1_ESCAPE_OFF=1\n',1)
io.open(p,'w',encoding='utf-8').write(t)
PY
```

Chạy tay lệnh của RL3a trên `/tmp/rl-probe.sh` với fixture rl3a: expected KHÔNG còn dòng `declared-off t1-escape` VÀ exit 2 (sổ lệch — chokepoint bắt luôn). Ghi nhận vào commit message. Xoá `/tmp/rl-probe.sh`.

- [ ] **Step 4: Commit**

```bash
git add tests/scripts/run-tests.sh
git commit -m "test(pre-merge): RL3a/RL3b/RL4 ghim từng dòng declared-off theo bảng AC-3 (Task 2, AC-3/AC-4)"
```

Phục vụ: E3, E4. `independent: false`.

---

### Task 3: Răng chokepoint — tiêm 3 kiểu + ngữ nghĩa dòng tổng kết (RL2/RL9/RL7b/RL5b/RL5c)

**Files:**
- Test: `tests/scripts/run-tests.sh`

**Interfaces:**
- Consumes: anchor tiêm — header `# ─── Gap-probe presence`, dòng `for dir in "$ACC"/*/; do`, dòng `REQUIRED_FOR="T2 T3"` (cả ba tồn tại trong script từ trước/Task 1).

- [ ] **Step 1: Viết các case tiêm (mỗi case: đối chứng dương TRƯỚC, tiêm SAU)**

```bash
echo "RL2 tiem vo hieu khoi gap-probe -> VIOLATION [ledger] dich danh, exit 2"
mk_gp_repo rl2; R="$GPR/rl2"; gp_feature "$R" feat-rl2 T3 implemented; gp_commit "$R"
RL2CP="$T/rl2-check.sh"; cp "$CHECK" "$RL2CP"
RL2OK="$(bash "$RL2CP" "$R" --base "$GP_BASE" 2>&1)"; check RL2ctrl 0 $?
same RL2ctrl2 1 "$(printf '%s\n' "$RL2OK" | grep -cx 'ran gap-probe')"
awk '
  /Gap-probe presence/ { hdr=1 }
  hdr && /if \[ "\$GAP_PROBE_MODE" != "off" \] && slug_in_diff/ && !done { sub(/if .*then/, "if false; then"); done=1 }
  { print }
' "$CHECK" > "$RL2CP"
RL2OUT="$(bash "$RL2CP" "$R" --base "$GP_BASE" 2>&1)"; RL2ST=$?
check  RL2a 2 "$RL2ST"
nothas RL2b "pre-merge-check: clean" "$RL2OUT"
hasout RL2c "VIOLATION [ledger]: luật gap-probe không chạy và không khai tắt" "$RL2OUT"
hasout RL2d "lỗi NỘI TẠI của cổng pre-merge" "$RL2OUT"
# RL5c: lan VIOLATION [ledger] VAN in dong tong ket, va n+m != k la bang chung
hasout RL5c "pre-merge-check: rules ran=2 declared-off=0 expected=3" "$RL2OUT"

echo "RL9 tiem pha vong per-slug (bien the CHUA TUNG va) -> diem nghen bat"
mk_gp_repo rl9; R="$GPR/rl9"; gp_feature "$R" feat-rl9 T3 implemented; gp_commit "$R"
RL9CP="$T/rl9-check.sh"; cp "$CHECK" "$RL9CP"
RL9OK="$(bash "$RL9CP" "$R" --base "$GP_BASE" 2>&1)"; check RL9ctrl 0 $?
sed 's|^for dir in "\$ACC"/\*/; do$|for dir in "$ACC"/khong-ton-tai-*/; do|' "$CHECK" > "$RL9CP"
RL9OUT="$(bash "$RL9CP" "$R" --base "$GP_BASE" 2>&1)"; RL9ST=$?
check  RL9a 2 "$RL9ST"
nothas RL9b "pre-merge-check: clean" "$RL9OUT"
hasout RL9c "VIOLATION [ledger]: luật per-slug không chạy và không khai tắt" "$RL9OUT"

echo "RL7b ghi so mot ten KHONG co trong EXPECTED -> ten la, exit 2"
rl_repo rl7
RL7CP="$T/rl7-check.sh"; cp "$CHECK" "$RL7CP"
RL7OK="$(bash "$RL7CP" "$TE_R" --base "$TE_B" 2>&1)"; check RL7ctrl 0 $?
sed 's|^REQUIRED_FOR="T2 T3"$|REQUIRED_FOR="T2 T3"\nledger_mark ran khoi-la|' "$CHECK" > "$RL7CP"
RL7OUT="$(bash "$RL7CP" "$TE_R" --base "$TE_B" 2>&1)"; RL7ST=$?
check  RL7b1 2 "$RL7ST"
hasout RL7b2 "VIOLATION [ledger]: tên lạ khoi-la — cập nhật EXPECTED" "$RL7OUT"
hasout RL7b3 "pre-merge-check: rules ran=4 declared-off=0 expected=3" "$RL7OUT"
nothas RL7b4 "pre-merge-check: clean" "$RL7OUT"

echo "RL5b exit 2 o parse -> KHONG in dong tong ket so"
RL5B="$(bash "$CHECK" "$TE_R" --tuy-chon-la 2>&1)"; check RL5b1 2 $?
nothas RL5b2 "pre-merge-check: rules ran=" "$RL5B"
```

Ghi chú tiêm tự-tố-cáo: nếu pattern awk/sed không khớp (nguồn trôi), bản sao y hệt bản gốc → case expect exit 2 sẽ FAIL (got 0) — không có đường xanh giả.

- [ ] **Step 2: Chạy suite, xác nhận xanh (case mới + 208 case cũ)**

Run: `bash tests/scripts/run-tests.sh 2>&1 | tail -5`
Expected: 0 failed.

- [ ] **Step 3: Commit**

```bash
git add tests/scripts/run-tests.sh
git commit -m "test(pre-merge): RL2/RL9/RL7b tiêm 3 lớp lỗ, chokepoint bắt cả biến thể chưa vá; RL5b/RL5c ngữ nghĩa dòng tổng kết (Task 3, AC-2/AC-5/AC-7d/AC-9)"
```

Phục vụ: E2, E9, E7 (nửa d), E5. `independent: false`.

---

### Task 4: Chốt cấu trúc bằng máy (RL6/RL7a/RL5a)

**Files:**
- Test: `tests/scripts/run-tests.sh`

- [ ] **Step 1: Viết 3 case tĩnh (soi nguồn, có đối chứng đột biến)**

```bash
echo "RL6 dem loi thoat exit 0 bang may — DUNG HAI loi (AC-6)"
RL6N="$(grep -vE '^[[:space:]]*#' "$CHECK" | grep -c 'exit 0')"
same RL6a 2 "$RL6N"
RL6CP="$T/rl6-check.sh"; { cat "$CHECK"; printf '\nexit 0\n'; } > "$RL6CP"
RL6M="$(grep -vE '^[[:space:]]*#' "$RL6CP" | grep -c 'exit 0')"
same RL6b 3 "$RL6M"   # doi chung dot bien: phep dem THAY duoc loi tiem

echo "RL7a ten duy nhat o call-site ledger_mark == EXPECTED, hai chieu (AC-7c)"
rl_names() { # <file> — ten duy nhat o call-site (loai dong dinh nghia ham)
  grep -E 'ledger_mark (ran|declared-off) ' "$1" | grep -v 'ledger_mark()' \
    | sed -E 's/.*ledger_mark (ran|declared-off) ([a-z0-9-]+).*/\2/' | sort -u
}
rl_exp() { sed -n 's/^LEDGER_EXPECTED="\(.*\)"$/\1/p' "$1" | tr ' ' '\n' | sort -u; }
RL7NAMES="$(rl_names "$CHECK")"; RL7EXP="$(rl_exp "$CHECK")"
same RL7a1 "$RL7EXP" "$RL7NAMES"
same RL7a2 3 "$(printf '%s\n' "$RL7EXP" | grep -c .)"
RL7CP2="$T/rl7a-check.sh"; { cat "$CHECK"; printf '\nledger_mark ran khoi-moi\n'; } > "$RL7CP2"
[ "$(rl_names "$RL7CP2")" != "$(rl_exp "$RL7CP2")" ]; check RL7a3 0 $?

echo "RL5a k tinh tu EXPECTED — cam tautology n+m o cho in (AC-5)"
RL5LINE="$(grep 'pre-merge-check: rules ran=' "$CHECK" | grep -v '^[[:space:]]*#')"
same  RL5a1 1 "$(printf '%s\n' "$RL5LINE" | grep -c .)"
hasout RL5a2 'expected=$LEDGER_K' "$RL5LINE"
RL5K="$(grep -E '^[[:space:]]*LEDGER_K=' "$CHECK")"
hasout RL5a3 'LEDGER_K=$#' "$RL5K"
nothas RL5a4 'LEDGER_RAN_N' "$RL5K"
nothas RL5a5 'LEDGER_OFF_N' "$RL5K"
```

- [ ] **Step 2: Chạy suite xanh, commit**

Run: `bash tests/scripts/run-tests.sh 2>&1 | tail -5` → 0 failed.

```bash
git add tests/scripts/run-tests.sh
git commit -m "test(pre-merge): RL6 hai lối exit-0, RL7a call-site==EXPECTED, RL5a cấm tautology n+m — chốt bằng máy (Task 4, AC-5/AC-6/AC-7c)"
```

Phục vụ: E5, E6, E7 (nửa c). `independent: false`.

---

### Task 5: Enforcement + node vắng (RL11a/RL11b/RL12)

**Files:**
- Test: `tests/scripts/run-tests.sh`

- [ ] **Step 1: Viết 3 case**

```bash
echo "RL11a enforcement off -> so tat theo, KHONG dong ledger nao (AC-11)"
rl_repo rl11a
printf 'enforcement: off\n' >> "$TE_R/_acceptance/config.yaml"
git -C "$TE_R" add -A >/dev/null
git -c user.email=t@t -c user.name=t -C "$TE_R" commit -qm enf
RL11A="$(bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1)"; check RL11a1 0 $?
same RL11a2 0 "$(printf '%s\n' "$RL11A" | grep -cE '^(ran|declared-off) ')"
nothas RL11a3 "pre-merge-check: rules ran=" "$RL11A"
hasout RL11a4 "pre-merge-check: clean" "$RL11A"

echo "RL11b enforcement warn KHONG ha diem nghen — so lech van exit 2 (AC-11)"
mk_gp_repo rl11b; R="$GPR/rl11b"; gp_feature "$R" feat-w T3 implemented
printf 'enforcement: warn\n' >> "$R/_acceptance/config.yaml"; gp_commit "$R"
RL11CP="$T/rl11-check.sh"; cp "$CHECK" "$RL11CP"
RL11OK="$(bash "$RL11CP" "$R" --base "$GP_BASE" 2>&1)"; check RL11ctrl 0 $?
hasout RL11ctrl2 "pre-merge-check: rules ran=" "$RL11OK"   # warn KHONG tat so
sed 's|^for dir in "\$ACC"/\*/; do$|for dir in "$ACC"/khong-ton-tai-*/; do|' "$CHECK" > "$RL11CP"
RL11B="$(bash "$RL11CP" "$R" --base "$GP_BASE" 2>&1)"; check RL11b1 2 $?
hasout RL11b2 "VIOLATION [ledger]: luật per-slug không chạy và không khai tắt" "$RL11B"

echo "RL12 node vang o advisory -> declared-off gap-probe qua *_not_enforced (AC-12)"
mk_gp_repo rl12; R="$GPR/rl12"; gp_feature "$R" feat-n T3 implemented; gp_commit "$R"
RL12OK="$(bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; check RL12ctrl 0 $?
same RL12ctrl2 1 "$(printf '%s\n' "$RL12OK" | grep -cx 'ran gap-probe')"   # doi chung: CO node -> ran
NOB="$T/rl12-bin"; rm -rf "$NOB"; mkdir -p "$NOB"
for b in bash sh sed awk grep head tail sort tr cut basename dirname wc cat git env uname date; do
  p="$(command -v "$b" 2>/dev/null)" && [ -n "$p" ] && ln -sf "$p" "$NOB/$b"
done
RL12OUT="$(env PATH="$NOB" bash "$CHECK" "$R" --base "$GP_BASE" 2>&1)"; RL12ST=$?
check RL12a 0 "$RL12ST"
same RL12b 1 "$(printf '%s\n' "$RL12OUT" | grep -cx 'declared-off gap-probe')"
same RL12c 0 "$(printf '%s\n' "$RL12OUT" | grep -cx 'ran gap-probe')"
hasout RL12d "GAP-PROBE: NOT ENFORCED" "$RL12OUT"
hasout RL12e "pre-merge-check: clean" "$RL12OUT"
```

- [ ] **Step 2: Chạy suite xanh (nếu RL12 đỏ vì PATH thiếu binary nào, bổ sung symlink vào danh sách — không nới assertion), commit**

```bash
git add tests/scripts/run-tests.sh
git commit -m "test(pre-merge): RL11 enforcement off/warn với sổ, RL12 node vắng là declared-off không hard-fail (Task 5, AC-11/AC-12)"
```

Phục vụ: E12, E13. `independent: false`.

---

### Task 6: Bằng chứng judge — sinh lại + diff byte-đối-byte (RL10, khuôn TE17)

**Files:**
- Test: `tests/scripts/run-tests.sh`
- Create: `_acceptance/premerge-rules-ledger/evidence/ledger-messages.txt` (sinh bằng suite, KHÔNG viết tay)

- [ ] **Step 1: Viết case RL10**

```bash
# ── RL10: bang chung cho judge phai SINH LAI roi diff byte-doi-byte ─────────
# Cung khuon TE17/GPM12: thong diep doi ma evidence khong doi thi judge cham
# mot ban chup loi thoi.
echo "RL10 sinh lai evidence/ledger-messages.txt roi diff byte-doi-byte"
RLMSG="$ROOT_REAL/_acceptance/premerge-rules-ledger/evidence/ledger-messages.txt"
RL10NEW="$(mktemp)"
{
  printf '%s\n' '# Thông điệp sổ luật-đã-chạy — SINH bởi tests/scripts/run-tests.sh (RL10).'
  printf '%s\n' '# KHÔNG sửa tay: suite sinh lại file này mỗi lần chạy và diff byte-đối-byte.'
  printf '\n== lần chạy sạch (mọi luật chạy) ==\n'
  rl_repo rl10a
  bash "$CHECK" "$TE_R" --base "$TE_B" 2>&1 | grep -E '^(ran|declared-off) |^pre-merge-check: rules |^pre-merge-check: clean'
  printf '\n== tắt có khai báo (--no-t1-escape) ==\n'
  rl_repo rl10b
  bash "$CHECK" "$TE_R" --base "$TE_B" --no-t1-escape 2>&1 | grep -E '^(ran|declared-off) |^pre-merge-check: rules '
  printf '\n== sổ lệch (khối gap-probe bị vô hiệu trong bản sao) ==\n'
  mk_gp_repo rl10c; R="$GPR/rl10c"; gp_feature "$R" feat-m T3 implemented; gp_commit "$R"
  RL10CP="$T/rl10-check.sh"
  awk '
    /Gap-probe presence/ { hdr=1 }
    hdr && /if \[ "\$GAP_PROBE_MODE" != "off" \] && slug_in_diff/ && !done { sub(/if .*then/, "if false; then"); done=1 }
    { print }
  ' "$CHECK" > "$RL10CP"
  bash "$RL10CP" "$R" --base "$GP_BASE" 2>&1 | grep -E '^VIOLATION \[ledger\]|^NOTE: VIOLATION \[ledger\]|^pre-merge-check: rules '
} > "$RL10NEW" 2>&1
if [ "${RL10_WRITE:-0}" = "1" ]; then cp "$RL10NEW" "$RLMSG"; echo "  (RL10_WRITE=1 — đã ghi lại)"; fi
if diff -u "$RLMSG" "$RL10NEW" > "$T/rl10.diff" 2>&1; then
  check RL10 0 0
else
  echo "     evidence LECH voi thong diep hien tai:"; head -20 "$T/rl10.diff" | sed 's/^/     /'
  check RL10 0 1
fi
# chong troi PHAM VI: mat mot nhanh thi diff van khop neu evidence cung sinh thieu
RL10M="$(cat "$RL10NEW")"
hasout RL10a "VIOLATION [ledger]: luật gap-probe không chạy và không khai tắt" "$RL10M"
hasout RL10b "lỗi NỘI TẠI của cổng pre-merge" "$RL10M"
hasout RL10c "declared-off t1-escape" "$RL10M"
hasout RL10d "pre-merge-check: rules ran=3 declared-off=0 expected=3" "$RL10M"
```

- [ ] **Step 2: Sinh file evidence lần đầu rồi chạy lại xanh**

```bash
mkdir -p _acceptance/premerge-rules-ledger/evidence
RL10_WRITE=1 bash tests/scripts/run-tests.sh >/dev/null 2>&1
bash tests/scripts/run-tests.sh 2>&1 | tail -5
```

Expected: lần hai 0 failed (diff khớp byte-đối-byte).

- [ ] **Step 3: Commit (suite + evidence sinh máy)**

```bash
git add tests/scripts/run-tests.sh _acceptance/premerge-rules-ledger/evidence/ledger-messages.txt
git commit -m "test(pre-merge): RL10 sinh lại bằng chứng thông điệp sổ rồi diff byte-đối-byte — khuôn TE17 (Task 6, AC-10 gác cổng)"
```

Phục vụ: E11, đầu vào E10 (judgment). `independent: false`.

---

### Task 7: P48 — suite plugins canh call-site == EXPECTED ở nguồn LẪN mirror

**Files:**
- Test: `tests/plugins/run-tests.sh` (thêm sau P47, dùng helper `pass`/`fail` sẵn có của suite đó)

- [ ] **Step 1: Viết case P48**

```bash
# ── P48: chu ky ledger_mark — them khoi luat moi ma quen khai so -> suite DO ─
# AC-7c: dem ten duy nhat o call-site ledger_mark, so BANG voi EXPECTED, tren
# ca nguon (scripts/) lan mirror (plugins/) — mirror lech da co P30, day la
# chieu "quen khai" ma P30 khong thay.
echo "P48 ledger_mark call-site == EXPECTED, nguon lan mirror"
p48_names() {
  grep -E 'ledger_mark (ran|declared-off) ' "$1" | grep -v 'ledger_mark()' \
    | sed -E 's/.*ledger_mark (ran|declared-off) ([a-z0-9-]+).*/\2/' | sort -u | tr '\n' ' '
}
p48_exp() { sed -n 's/^LEDGER_EXPECTED="\(.*\)"$/\1/p' "$1" | tr ' ' '\n' | sort -u | tr '\n' ' '; }
P48OK=1
for f in "$ROOT/scripts/pre-merge-check.sh" "$ROOT/plugins/acceptance-gate/scripts/pre-merge-check.sh"; do
  if [ ! -f "$f" ]; then echo "     thieu $f"; P48OK=0; continue; fi
  [ -n "$(p48_exp "$f")" ] || { echo "     EXPECTED rong/khong parse duoc: $f"; P48OK=0; }
  [ "$(p48_names "$f")" = "$(p48_exp "$f")" ] || { echo "     call-site lech EXPECTED: $f"; P48OK=0; }
done
# doi chung dot bien: them call-site ten moi vao ban sao -> phep so phai LECH
P48CP="$(mktemp)"
{ cat "$ROOT/scripts/pre-merge-check.sh"; printf '\nledger_mark ran khoi-moi\n'; } > "$P48CP"
[ "$(p48_names "$P48CP")" != "$(p48_exp "$P48CP")" ] || { echo "     dot bien khong bi phat hien"; P48OK=0; }
rm -f "$P48CP"
if [ "$P48OK" -eq 1 ]; then pass "P48 chu ky ledger_mark khop EXPECTED (nguon + mirror + dot bien)"; else fail "P48 chu ky ledger_mark khop EXPECTED"; fi
```

(Trước khi viết: mở `tests/plugins/run-tests.sh` xem chữ ký thật của `pass`/`fail`/`run` và biến `$ROOT` — dùng đúng convention file đó, ví dụ nếu `pass` không nhận message thì theo khuôn case P41 kế bên.)

- [ ] **Step 2: Chạy suite plugins xanh, commit**

Run: `bash tests/plugins/run-tests.sh 2>&1 | tail -5` → 0 failed.

```bash
git add tests/plugins/run-tests.sh
git commit -m "test(plugins): P48 chữ ký ledger_mark == EXPECTED trên nguồn lẫn mirror, kèm đối chứng đột biến (Task 7, AC-7c)"
```

Phục vụ: E7 (tầng suite kit). `independent: true` (file riêng, không đụng Task 1-6).

---

### Task 8: Nợ #2 handoff — đối chứng dương cho TE4

**Files:**
- Test: `tests/scripts/run-tests.sh` (chèn ngay sau `check TE4b 1 "$TE4ST"`)

- [ ] **Step 1: Thêm đối chứng dương**

```bash
# Doi chung duong cho TE4 (no #2 handoff 2026-07-26): cung fixture nhung DA co
# gap-probe.md hop le -> voi co --no-t1-escape van exit 0. Thieu no, TE4 chi
# chung minh "co violation nao do" — bat bien CLAUDE.md #4.
mk_gp_repo te4ok; ROK="$GPR/te4ok"; gp_feature "$ROK" feat-z T3 implemented
printf 'gap_probe: required\n' >> "$ROK/_acceptance/config.yaml"
printf -- '---\nslug: feat-z\nat: 2026-07-26T00:00:00Z\nverdict: clean\np0: 0\np1: 0\np2: 0\n---\n\n## Findings\nKhông còn lỗ đáng kể\n' > "$ROK/_acceptance/feat-z/gap-probe.md"
gp_commit "$ROK"
TE4OK="$(bash "$CHECK" "$ROK" --base "$GP_BASE" --no-t1-escape 2>&1)"; check TE4ctrl 0 $?
nothas TE4ctrl2 "chưa qua phản biện context sạch" "$TE4OK"
```

- [ ] **Step 2: Chạy suite xanh, commit**

```bash
git add tests/scripts/run-tests.sh
git commit -m "test(pre-merge): TE4 có đối chứng dương — gap-probe.md hợp lệ thì cờ không kéo theo violation (nợ #2 handoff 2026-07-26)"
```

Phục vụ: nợ đã khai, không thuộc eval contract này. `independent: false` (cùng file suite).

---

### Task 9: Bump version + GUIDE + ADR — thuộc S3, KHÔNG để sau Cổng 2

**Files:**
- Modify: `.claude-plugin/plugin.json` (version `1.21.0` → `1.22.0`, nối câu v1.22 vào description)
- Modify: `.codex-plugin/plugin.json` (như trên)
- Modify: `GUIDE.md` (mục pre-merge: đoạn ngắn về sổ luật + dòng tổng kết + nghĩa của `VIOLATION [ledger]` + version-floor "cần acceptance-gate 1.22.0+")
- Create: `docs/adr/0005-rules-ledger-fail-closed-at-output.md`
- Mirror: chạy sync, commit `plugins/`

- [ ] **Step 1: Bump 2 manifest**

Trong cả `.claude-plugin/plugin.json` và `.codex-plugin/plugin.json`: `"version": "1.22.0"`; nối vào cuối description: ` v1.22 adds the rules ledger to pre-merge-check.sh: clean must be PROVEN — every rule block records ran/declared-off through one ledger_mark chokepoint, a fixed EXPECTED list, a machine-readable summary line (pre-merge-check: rules ran= declared-off= expected=), and any ledger mismatch is an internal-gate error (exit 2), catching silently-skipped rule blocks that no input blacklist could enumerate.`

- [ ] **Step 2: GUIDE.md**

Thêm vào mục pre-merge check (gần đoạn version-floor 1.21.0 hiện có, ~line 570) một khối ngắn:

```markdown
### Sổ luật-đã-chạy (acceptance-gate 1.22.0+)

`pre-merge-check.sh` chỉ in `clean` khi CHỨNG MINH được: mỗi khối luật kết thúc
bằng đúng một dòng `ran <tên>` hoặc `declared-off <tên>` (tắt có khai báo: cờ
`--no-t1-escape`, `gap_probe: off`, chạy không `--base`). Dòng tổng kết máy-đọc:
`pre-merge-check: rules ran=<n> declared-off=<m> expected=<k>`. Nếu sổ lệch,
script in `VIOLATION [ledger]: ...` và exit 2 — đây là lỗi NỘI TẠI của cổng
(một khối luật bị trượt qua), KHÔNG phải lỗi trong PR của bạn: báo maintainer
kèm toàn bộ output, đừng sửa feature để né. `enforcement: off` tắt cả sổ
(off là off toàn cục).
```

- [ ] **Step 3: ADR 0005 (1 đoạn văn)**

`docs/adr/0005-rules-ledger-fail-closed-at-output.md`:

```markdown
# 0005 — Chốt fail-closed đặt ở ĐẦU RA: `clean` phải được chứng minh bằng sổ

2026-07-27 · premerge-rules-ledger. Bốn bản vá parse liên tiếp (round 4-6 của
t1-escape-event-scope) là blacklist trên không gian đầu vào mở — không hội tụ.
Thay vì vá tiếp, đảo mặc định ở đầu ra: EXPECTED đóng (`per-slug gap-probe
t1-escape`), mọi khối ghi sổ qua `ledger_mark`, điểm nghẽn so hai chiều trước
khi kết luận; lệch = `VIOLATION [ledger]` + exit 2 (lớp exit MỚI trên consumer
CI — lỗi nội tại của cổng, không phải violation của feature). Trade-off chấp
nhận: mọi khối luật thêm sau này PHẢI khai vào EXPECTED — quên thì suite đỏ
(P48/RL7a) chứ không phải lỗ im lặng; và `enforcement: off` tắt cả sổ (tiền
lệ off-là-off-toàn-cục). Phương án đã loại: vá vòng parse lần 5, chuyển parse
sang Node (revisit khi sổ chạy ổn — ledger d-302).
```

- [ ] **Step 4: Sync mirror + chạy đủ 3 suite + mirror check**

```bash
bash scripts/sync-plugin-packages.sh
bash tests/scripts/run-tests.sh 2>&1 | tail -3
bash tests/hooks/run-tests.sh 2>&1 | tail -3
bash tests/plugins/run-tests.sh 2>&1 | tail -3
bash scripts/sync-plugin-packages.sh --check
```

Expected: cả ba suite 0 failed; `--check` exit 0. (P42/P45 pin version bằng literal? Nếu suite plugins đỏ vì version — sửa đúng chỗ suite pin theo khuôn P42, đó là hành vi thiết kế "mỗi bump sửa suite có chủ đích".)

- [ ] **Step 5: Commit**

```bash
git add .claude-plugin/plugin.json .codex-plugin/plugin.json GUIDE.md docs/adr/0005-rules-ledger-fail-closed-at-output.md plugins/
git commit -m "release(acceptance-gate): 1.22.0 — sổ luật-đã-chạy: clean phải được chứng minh (Task 9)"
```

Phục vụ: vòng đời S3 (bump thuộc S3 — GUIDE), ADR theo CLAUDE.md. `independent: false`.

---

## Self-review đã chạy

- **Spec coverage:** AC-1→RL1 · AC-2→RL2 · AC-3→RL3a/b/c · AC-4→RL4 · AC-5→RL1e/f+RL5a/b/c · AC-6→RL6 · AC-7→RL7a/RL7b+P48 · AC-8→TE18a-k giữ nguyên (E8 = suite hiện có phải xanh sau mọi task) · AC-9→RL9 · AC-10→RL10+E10 judgment · AC-11→RL11a/b · AC-12→RL12. Không AC nào thiếu task.
- **Type consistency:** tên biến/hàm thống nhất giữa Task 1 (produce) và 2-7 (consume): `ledger_mark`, `LEDGER_EXPECTED`, `LEDGER_K`, `LEDGER_RAN_N/OFF_N`, `rl_repo`, `rl_names`/`rl_exp` (RL7a) vs `p48_names`/`p48_exp` (P48 — bản riêng của suite plugins, cố ý lặp vì hai file suite độc lập).
- **Placeholder:** không còn TBD/`...` ngoài đoạn awk RL10 (lặp nguyên văn từ RL2 — đã ghi rõ "same injection as RL2" bằng code thật).
