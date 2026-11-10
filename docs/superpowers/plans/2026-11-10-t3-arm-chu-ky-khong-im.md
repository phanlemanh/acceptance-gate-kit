# Vế chữ ký của luật code t3_paths không tắt im lặng — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Máy chạy cổng thiếu node hoặc thiếu thư viện đọc chữ ký thì hồ sơ dưới T3 không được tính cho code `t3_paths`, kèm lý do nói rõ cách gỡ.

**Architecture:** Thêm một khối chỉ-thêm-dòng trong `t3_co_ho_so_arm`, ngay sau khối đòi chữ ký hiện có. Mọi đo đạc nằm trong tệp ca sẵn có; máy thiếu lib là bản sao trọn thư mục bị xoá đúng một tệp, máy thiếu node là PATH cắt.

**Tech Stack:** bash (`scripts/pre-merge-check.sh`), Node test script không framework (`tests/scripts/t3-can-ho-so-arm.test.mjs`).

**Spec:** `_acceptance/t3-arm-chu-ky-khong-im/contract.md` (AC-1…AC-7), `evals.yaml` (E1…E8), `design.md`.

## Global Constraints

- Hai tệp cưỡng chế chỉ được thêm dòng (`tests/scripts/additive-only.test.mjs`): không sửa, không xoá dòng nào của `pre-merge-check.sh`.
- Hai chuỗi lý do, từng chữ:
  - `hạng $t không kiểm được chữ ký người — thiếu lib/evidence-core.cjs (mang cổng vào repo phải copy CẢ lib/)`
  - `hạng $t không kiểm được chữ ký người — thiếu node (cài node trên máy chạy cổng)`
- Tệp ca sau vòng có đúng 63 ca: 46 ca cũ giữ nguyên tên, 17 ca mới đúng tên ở Task 1.
- Fixture do code sinh trong lượt; đường dẫn suy từ vị trí tệp.
- PR chỉ mở sau khi nhánh `fix/t1-escape-ho-so-khong-arm` đã gộp.

## Review Focus

- Hồ sơ T2 `draft` trên máy thiếu lib: phải giữ lời `status chưa arm cổng`, không có lý do mới. Ghim bằng một phép kiểm thêm trong HA44-im.
- Bản sao máy hoặc PATH cắt làm cổng chết sớm: ca không được xanh giả. Mọi ca `-do` đòi dòng `VIOLATION [PR]` in ra, mọi ca `-mut` đòi về `pre-merge-check: clean`, và HA42/HA43 tự kiểm PATH cắt.

---

### Task 1: Thước — mười bảy ca mới và bảng mười một lý do

`independent: false` · phục vụ E1, E2, E3, E4, E5, E6, E8

**Files:**
- Modify: `tests/scripts/t3-can-ho-so-arm.test.mjs`

**Interfaces:**
- Produces: `luoi(R, may = KIT, them = [], env = {})`; `banSaoMay(neo, thay, { boLib = false } = {})` (`neo === null` thì không tiêm); `PATH_KHONG_NODE()`; `kho({ ..., cfg = CFG })`; hằng `LY_LIB`, `LY_NODE`.

- [ ] **Step 1: Thêm công cụ ca**

`luoi` trải `env` lên `process.env`. `banSaoMay` bỏ kiểm neo khi `neo === null`; `boLib` xoá `lib/evidence-core.cjs` của bản sao. `PATH_KHONG_NODE()` tạo thư mục symlink cho `bash sh sed awk grep head tail sort tr cut basename dirname wc cat git env uname date diff mktemp rm`, rồi trong tiến trình mới kiểm `command -v node` phải trượt, không thì `throw`. Hằng `CFG_STRICT = CFG + 'recheck: strict\n'`, `CFG_T1 = CFG + 'signoff:\n  required_for: [T1, T2, T3]\n'`. `LY_LIB`, `LY_NODE` là `feat: ` + chuỗi lý do với `$t` = `T2`. Fixture mới: `t2ChuaKy(status)`, `t2MayThongCodeThuong`, `t2ChuaCanhT3`, `t2Draft`, `t2KyStrict`, `t1Ky`.

- [ ] **Step 2: Viết mười bảy ca**

```js
// Mỗi ca -do đo CÙNG kho thử hai lần.
const CU = 'hạng T2 chưa có chữ ký người'; const KHONG_KIEM = 'không kiểm được chữ ký người';
const haiMay = (R, truoc, sau, may) => { const t = truoc(luoi(R)); return t ? `máy đủ: ${t}` : sau(may()); };
const voiLyDoCu = o => chan(o, `feat: ${CU}`) || (o.out.includes(KHONG_KIEM) ? 'máy đủ mà in lý do mới' : null);
```

| Ca | Kho thử | Máy đủ | Máy thiếu |
|---|---|---|---|
| HA37-do…HA40-do | `t2ChuaKy` `machine-cleared` · `verified` · `implemented` · `signed-off` | `voiLyDoCu` | thiếu lib: `chan(o, LY_LIB)` |
| HA41-do | `F.t2DaKy` | `sach` | thiếu lib: `chan(o, LY_LIB)` |
| HA42-do | `F.t2DaKy` | `sach` | thiếu node: `chan(o, LY_NODE)` |
| HA43-do | `F.t2MayThong` | không đo | thiếu node: `chan(o, LY_NODE)` |
| HA49-do | `t1Ky` (`CFG_T1`) | `sach` | thiếu lib: `chan(o, 'feat: hạng T1 không kiểm được chữ ký người — thiếu lib/evidence-core.cjs')` |

Bảng ô quanh luật (AC-4), mỗi ca chạy cả hai máy:

| Ca | Thiếu lib | Thiếu node |
|---|---|---|
| HA44-im `F.t3DaKy` | `sach` | `sach` |
| HA45-im `t2MayThongCodeThuong` | `sach` | 1 + `VIOLATION [feat]: status machine-cleared nhưng hồ sơ còn cần người` |
| HA46-im `F.t2DaKy` + `--no-t1-escape` | 0 + `CLEAN` + `T1-ESCAPE: NOT ENFORCED` | như bên trái |
| HA47-im `t2ChuaCanhT3` | `sach` | 1 + cùng thông điệp `VIOLATION [feat]` |
| HA48-bien `t2KyStrict` | 1 + `KHÔNG CHẠY ĐƯỢC (exit 2)` + `LY_LIB` | 1 + `KHÔNG CHẠY ĐƯỢC (node vắng)` + `LY_NODE` |

Tám ô đầu đều đòi không có `KHONG_KIEM`. HA44-im thêm: `t2Draft` trên máy thiếu lib ra `status chưa arm cổng`, không có `KHONG_KIEM`.

Đột biến dùng hàm mới `dotBienVeSach(ten, fixture, lyDo, neo, mayThu)`: thêm `neo` vào `KIM_DA_CO`; bản chưa tiêm phải `chan(..., lyDo)` trên máy thiếu; bản sao gỡ nhánh trên CÙNG kho thử phải `sach`.

| Ca | Kho thử | Máy | Neo |
|---|---|---|---|
| HA37-mut | `t2ChuaKy('machine-cleared')` | thiếu lib | `ly="hạng $t không kiểm được chữ ký người — thiếu lib/evidence-core.cjs (mang cổng vào repo phải copy CẢ lib/)"` |
| HA41-mut | `F.t2DaKy` | thiếu lib | như trên |
| HA49-mut | `t1Ky` | thiếu lib | như trên |
| HA42-mut | `F.t2DaKy` | thiếu node | `ly="hạng $t không kiểm được chữ ký người — thiếu node (cài node trên máy chạy cổng)"` |

- [ ] **Step 3: Nâng HA36-bang lên mười một**

Bốn chỗ `9` trong ca thành `11`, lời báo thành `bảng viết trước có 11 lý do, luật có ${soDong}`. Chỉ ca này được đổi nội dung trong 46 ca cũ.

- [ ] **Step 4: Chạy để thấy đỏ**

Run: `node tests/scripts/t3-can-ho-so-arm.test.mjs`
Expected: HA37…HA43-do, HA48-bien, HA49-do FAIL; bốn ca `-mut` mới FAIL vì `neo đột biến khớp 0 lần`; HA36-bang FAIL với `bảng viết trước có 11 lý do, luật có 9`; HA44…HA47-im PASS; 45 ca cũ còn lại PASS. Riêng HA37-do phải báo `muốn thoát 1, được 0`.

- [ ] **Step 5: Commit**

```bash
git add tests/scripts/t3-can-ho-so-arm.test.mjs
git commit -m "test(pre-merge): vế chữ ký không chạy được phải có lý do riêng (đỏ)"
```

### Task 2: Vật — khối mới trong cổng và câu trong README

`independent: false` · phục vụ E1…E8

**Files:**
- Modify: `scripts/pre-merge-check.sh` (trong `t3_co_ho_so_arm`, ngay sau `fi` của khối đòi chữ ký)
- Modify: `README.md` (đoạn về `t3_paths`, câu «and a human signature below T3»)

**Interfaces:**
- Consumes: `CHU_KY_LIB`, biến cục bộ `ly`, `t`, `st` của hàm.

- [ ] **Step 1: Thêm khối, chỉ thêm dòng**

```bash
      # Vế chữ ký không chạy được thì hồ sơ dưới T3 KHÔNG được tính (t3-arm-chu-ky-khong-im): không đọc được chữ ký
      # thì không biết có người ký hay không. Hai lý do riêng để người đọc biết phải cài node hay chép lib.
      if [ -z "$ly" ] && [ "$(printf '%s' "$t" | tr '[:lower:]' '[:upper:]')" != "T3" ]; then
        case "$st" in
          implemented|verified|signed-off|machine-cleared)
            if ! command -v node >/dev/null 2>&1; then
              ly="hạng $t không kiểm được chữ ký người — thiếu node (cài node trên máy chạy cổng)"
            elif [ ! -f "$CHU_KY_LIB" ]; then
              ly="hạng $t không kiểm được chữ ký người — thiếu lib/evidence-core.cjs (mang cổng vào repo phải copy CẢ lib/)"
            fi ;;
        esac
      fi
```

- [ ] **Step 2: Thêm một câu vào README**

Ngay sau «and a human signature below T3»: `A machine that cannot read signatures (no node, or no lib/evidence-core.cjs) does not count a record below T3, and says which one is missing.`

- [ ] **Step 3: Chạy để thấy xanh**

Run: `bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA37-do HA38-do HA39-do HA40-do HA37-mut HA41-do HA41-mut HA42-do HA43-do HA42-mut HA44-im HA45-im HA46-im HA47-im HA48-bien HA49-do HA49-mut`
Expected: `Results: 17 passed, 0 failed`.

Run: `node tests/scripts/t3-can-ho-so-arm.test.mjs | tail -n 1`
Expected: `Results: 63 passed, 0 failed`.

Run: `node tests/scripts/additive-only.test.mjs | tail -n 3`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add scripts/pre-merge-check.sh README.md
git commit -m "fix(pre-merge): thiếu công cụ đọc chữ ký thì hồ sơ dưới T3 không được tính"
```

Xong Task 2: hợp đồng sang `implemented`, vào S4.
