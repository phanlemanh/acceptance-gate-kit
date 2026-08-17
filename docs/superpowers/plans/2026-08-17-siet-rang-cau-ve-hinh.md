# siet-rang-cau-ve-hinh — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Đóng bốn Known limits của hinh-tai-cong-1 chỉ bằng phép đo: hàm dùng chung `hfl_clause.py`, P90 canh mọi bản chép, P197 tách-đoạn + nhãn đủ + p90_check chung + in `P197-M:`, rang.sh đọc bảng từ stdout, P198 + răng của hồ sơ này.

**Architecture:** 3 task tuần tự (mỗi task sau đọc đầu ra của task trước): (1) module + P90 + P198 fixture; (2) P197 + rang.sh của hinh-tai-cong-1; (3) P198 kiểm cấu trúc + răng của hồ sơ này + config key.

**Tech Stack:** bash suite · python3 heredoc · module python nhỏ.

## Global Constraints
- KHÔNG đổi `feature-loop/skills/feature-loop/SKILL.md`, KHÔNG đổi bản luật.
- Đường dẫn suy từ `$ROOT`/vị trí script; P198 không đọc `_acceptance/**`, không worktree.
- MEASURE-BIRTH-CLAUSE: mỗi phép đo mới có cặp hai chiều + thông điệp ghim; verify per-task = chạy case + phá thử.

---

### Task 1: `tests/plugins/hfl_clause.py` + P90 + P198 (fixture)
**Files:** Create `tests/plugins/hfl_clause.py`; Modify P90 (dòng ~1768–1840); Add P198 sau P197.
- [ ] Module: `clause_copies(text, clause)` → `(n_anchor, n_full)`; `clause_copies_ok(text, clause)` → `[]` | `["cau ve hinh lech khuon mot-nguon (k/n ban chep)"]` | `["khong co ban chep nao"]`; anchor hai đầu = 4 chữ đầu / 4 chữ cuối của clause đã norm; so trên text đã norm.
- [ ] P90: `sys.path.insert(0, str(root/"tests/plugins")); from hfl_clause import clause_copies_ok`; check(): `errs += [f"{rel}: {e}" for e in clause_copies_ok(t, CLAUSE)]`; m3 (`count=1`), m4 (`count=1`), m3b (sửa bản CUỐI) → mỗi cái ĐỎ ghim `(1/2 ban chep)`, in `P90-COPIES: <m> do (1/2 ban chep)`; đối chứng dương giữ.
- [ ] P198 phần fixture: sinh clause giả + file hai bản chép trong tmp (`mkdtemp`), sáu ca a–f theo AC-1, in `P198-CA-<x> OK`.
- [ ] Verify: `ONLY_BLOCK="P90 tam" …` PASS; `ONLY_BLOCK=P198 …` PASS; phá thật: sửa một chữ ở bản S2 của SKILL.md (bản sao) → P90 ĐỎ ghim `(1/2 ban chep)`; trả lại. Commit.

### Task 2: P197 (tách đoạn · nhãn đủ · p90_check chung · P197-M) + rang.sh hinh-tai-cong-1
**Files:** Modify P197; Modify `_acceptance/hinh-tai-cong-1/rang.sh`.
- [ ] P197: import `clause_copies_ok`; `p90_check = lambda t: clause_copies_ok(t, CLAUSE_P90)`; in `P197-P90CHECK: xanh tren xoa-khoi, do tren sua-mot-chu` (assert cả hai chiều trên TOÀN VĂN).
- [ ] P197: `EXPECTED |= {M["nhan"].format(l) for l in LABELS}`; vòng `for l in LABELS: expect(mutate(... l → l[:4]+"Đo"), M["nhan"].format(l), f"go nhan {l}")`.
- [ ] P197: `presence_only(b)`; 5 đột biến TÁCH (chèn `\n\n` trước: `T3, hoặc T2 không đủ` · `bỏ qua cả năm bước` · `vẽ khối mermaid` · `Read bản` · `→ dùng lại, không vẽ lại`); mỗi cái `expect(...)` + `assert presence_only(mut_block) == []` in `P197-TACH-<khoá>: presence_only van xanh`. `m_split` cũ (hoa-thường) thay bằng tách thật. `m_cond` nối `\n\n`.
- [ ] P197: trước bộ đột biến in `for m in sorted(EXPECTED): print("P197-M: "+m)`.
- [ ] rang.sh: `if [ -n "${RANG_STDOUT_FILE:-}" ]; then OUT=$(cat "$RANG_STDOUT_FILE"); ST=0; else …`; K = các dòng `P197-M:` (≥21 → thiếu → keu "so P197-M < san (n)"); với mỗi msg trong K: grep -F "DO dung ($msg)" || keu "thieu chieu do ghim '$msg'"; MUTS ≥ |K|; bỏ danh sách tay + hằng 24; dòng OK in `|K|`.
- [ ] Verify: `ONLY_BLOCK=P197` PASS; `bash _acceptance/hinh-tai-cong-1/rang.sh` OK; phá thử: file stdout thật, xoá một dòng `DO dung` → rang ĐỎ ghim msg; xoá một dòng `P197-M:` → ĐỎ ghim `khong khop P197-M-COUNT`. Commit.

### Task 3: P198 kiểm cấu trúc + răng của hồ sơ này + config
**Files:** Modify P198; Create `_acceptance/siet-rang-cau-ve-hinh/rang.sh`; config key `executors.script.rang_siet_rang` (qua `config-patch.mjs`).
- [ ] P198: rút khối P90 và P197 từ run-tests.sh bằng regex `run "P90 …" \\\n  python3 - "$ROOT" <<'PY'\n([\s\S]*?)\nPY\n`; assert mỗi khối chứa `from hfl_clause import`; assert `"CLAUSE not in t" not in p90blk` và `"CLAUSE_P90 in" not in p197blk`; đột biến: chèn chuỗi vào bản sao khối → ĐỎ ghim `P90 con chep tay logic clause` / `P197 con chep tay p90_check`; assert P198 tự thân không chứa literal `_acceptance/`; tổng kết `P198 OK: {n} ca fixture · {k} kiem cau truc · {m} dot bien`.
- [ ] Răng: `OUT=$(ONLY_BLOCK="P90 tam" … )`, `OUT197=$(ONLY_BLOCK=P197 …)`, `OUT198=$(ONLY_BLOCK=P198 …)`; ghim mọi dòng AC-8; ghi `OUT197` ra `$TMP/p197.out`; chạy `RANG_STDOUT_FILE=$TMP/p197.out bash _acceptance/hinh-tai-cong-1/rang.sh` → OK; sed bản sao xoá 1 dòng `DO dung` → ĐỎ ghim msg; sed xoá 1 dòng `P197-M:` → ĐỎ ghim `khong khop P197-M-COUNT`; bản sao suite bỏ đột biến nhãn `[3] Vẽ` (sed xoá dòng `go nhan [3] Vẽ`) → P197 ĐỎ ghim `ma tran chua toan phan`; grep rang.sh không có `for M in "`; worktree `7d76384` (merge-base, mốc trong răng) + copy rang.sh của hinh-tai-cong-1 → ĐỎ.
- [ ] `config-patch.mjs --key executors.script.rang_siet_rang --value "bash _acceptance/siet-rang-cau-ve-hinh/rang.sh" --write`.
- [ ] Verify: răng OK; toàn suite plugins PASS; commit; set contract implemented → S4.
