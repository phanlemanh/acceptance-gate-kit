# Tên ca qua tiền tố turbo — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `rutTenCa` gọi được tên ca đỏ khi dòng mang tiền tố của bộ chạy monorepo (turbo `<gói>:<tác vụ>: `), để dòng pin `chap_chon` của làn ghim lại không còn rỗng ở kho dùng turbo.

**Architecture:** Một thay đổi trong hàm thuần `rutTenCa` (`feature-loop/scripts/lib/chay-lai.mjs`): thử năm khuôn trên dòng thô, không khớp thì bóc MỘT lớp `TIEN_TO_BO_CHAY = /^\S*?:\s+/` rồi thử lại. Thước là bản ghi đầu ra THẬT của turbo + bun, sinh qua chính `chayLenh` của làn.

**Tech Stack:** Node ESM, bộ ca `boKiem`/`mkKho` của `tests/scripts/gia-lan-fixture.mjs`.

**Spec:** `docs/superpowers/specs/2026-10-11-ten-ca-qua-tien-to-turbo-design.md` · hợp đồng `_acceptance/ten-ca-qua-tien-to-turbo/contract.md`.

## Global Constraints

- KHÔNG chạm `feature-loop/scripts/repin-lane.mjs` (vòng vá gate-card đang sửa; bên gọi không cần đổi).
- KHÔNG sửa `tests/scripts/repin-lane-chay-lai.test.mjs` hay `tests/scripts/gia-lan-fixture.mjs` (chỉ import).
- Dòng hôm nay rút được tên gì thì sau vòng vẫn rút đúng tên đó: thử dòng thô TRƯỚC, bóc sau.
- Commit ca kiểm (đỏ) ĐỨNG TRƯỚC commit vật — chiều đỏ nằm trong lịch sử.
- Không gõ tay dòng có tiền tố; không dấu sao trong văn `expected`/Notes của hồ sơ (răng P161).

## Review Focus

- Tác vụ turbo có dấu hai chấm (`test:unit` → tiền tố `@kho/goi:test:unit: `) phải được bóc trọn một cụm — thêm một ô phụ ở ca AC-2 (Task 1), tiền tố dựng từ tiền tố thật bằng cách nối `:unit` vào trước dấu `: ` cuối.
- Dòng chỉ có tiền tố và khoảng trắng (`@kho/goi:test: `) không được thành tên rỗng — bản ghi thật có các dòng ấy; AC-3 đã phủ (tập còn lại phải ra câu dự phòng).
- Tên ca có dấu hai chấm sau tiền tố (`(fail) nang-luc: khong`) chỉ bóc cụm đầu — đã phủ bởi ô tiền tố của mẫu bun ở AC-2.

---

### Task 1: Thước — bản ghi thật, ca kiểm đỏ, khoá eval

`independent: false` · phục vụ E1, E2, E3, E4

**Files:**
- Create: `tests/scripts/fixtures/ten-ca-turbo/turbo-bun.log` (đầu ra thật, sinh bằng công cụ dưới)
- Create: `tests/scripts/fixtures/ten-ca-turbo/ghi-ban-ghi.mjs`
- Create: `tests/scripts/fixtures/ten-ca-turbo/NGUON.md`
- Create: `tests/scripts/ten-ca-qua-tien-to.test.mjs`
- Modify: `_acceptance/config.yaml` (bốn khoá `tctt_ac1..4` dưới `executors.script`, ngay sau `lsgd_ac12`)

**Interfaces:**
- Consumes: `rutTenCa(text: string): string[]` (có sẵn); `mkKho`, `boKiem`, `ok`, `ROOT` từ `gia-lan-fixture.mjs`; `chayLenh(cmd, {cwd, env}) → {done: Promise<{exit,out,err,ms}>}` từ `feature-loop/scripts/lib/chay-lenh.mjs`.
- Produces: tên hằng `TIEN_TO_BO_CHAY` mà ca phá bằng regex `/TIEN_TO_BO_CHAY = \/[^\n]*\/;/` — Task 2 phải khai đúng một dòng `export const TIEN_TO_BO_CHAY = /…/;`.

- [ ] **Step 1: Sinh bản ghi thật** (cần turbo + bun; bản đã ghi ở scratchpad dựng bằng đúng công cụ này)

```bash
TURBO_BIN=<đường turbo> node tests/scripts/fixtures/ten-ca-turbo/ghi-ban-ghi.mjs > tests/scripts/fixtures/ten-ca-turbo/turbo-bun.log
```
Kiểm: tệp có dòng `@kho/goi:test: (fail) app-rieng > chay canh apps/agent`, dòng bẫy `(pass) app-rieng > doc: (fail) dong le`, và không chứa đường dẫn tuyệt đối (`grep -c "/Users/\|/private/\|/var/folders"` = 0).

- [ ] **Step 2: Viết tệp ca** — `tests/scripts/ten-ca-qua-tien-to.test.mjs` như bản ở scratchpad (`nhap/ten-ca-qua-tien-to.test.mjs`): bốn ca `AC-1`…`AC-4`, mỗi ca chạy cùng hàm kiểm trên vật tại chỗ, bản sao nguyên vẹn trọn `feature-loop/scripts`, và bản phá (`tat-boc`, `tham`, `rong-khuon`) với `phaiDo(f, ghim)`. Thêm ô phụ của Review Focus vào ca AC-2:

```js
  // Ô phụ (Review Focus): tác vụ turbo có dấu hai chấm — tiền tố dựng từ tiền tố thật.
  const tienToTacVu = TIEN_TO.replace(/:\s+$/, ':unit: ');
  const rPhu = rutTenCa(`rác\n${tienToTacVu}${MAU[0][0]}\nrác`);
  ok(bang(rPhu, [MAU[0][1]]), `tiền tố tác vụ có dấu hai chấm «${tienToTacVu}» → ${JSON.stringify(rPhu)}`);
```

- [ ] **Step 3: Thêm khoá eval vào `_acceptance/config.yaml`** ngay sau dòng `lsgd_ac12`:

```yaml
    # Hồ sơ ten-ca-qua-tien-to-turbo — tên ca chập chờn qua tiền tố turbo (tên ca = tên AC).
    tctt_ac1: GG_CASES=AC-1 node tests/scripts/ten-ca-qua-tien-to.test.mjs
    tctt_ac2: GG_CASES=AC-2 node tests/scripts/ten-ca-qua-tien-to.test.mjs
    tctt_ac3: GG_CASES=AC-3 node tests/scripts/ten-ca-qua-tien-to.test.mjs
    tctt_ac4: GG_CASES=AC-4 node tests/scripts/ten-ca-qua-tien-to.test.mjs
```

- [ ] **Step 4: Chạy, phải ĐỎ đúng thông điệp ghim trên vật hiện tại**

Run: `node tests/scripts/ten-ca-qua-tien-to.test.mjs`
Expected: `Results: 0 passed, 4 failed` với AC-1 «tên ca qua tiền tố turbo rỗng», AC-2 «ô có tiền tố rơi về câu dự phòng: 5/5», AC-3 «đối chứng dương hỏng», AC-4 «dòng pin không gọi được tên ca».

- [ ] **Step 5: Commit**

```bash
git add tests/scripts/ten-ca-qua-tien-to.test.mjs tests/scripts/fixtures/ten-ca-turbo _acceptance/config.yaml
git commit -m "test(ten-ca-qua-tien-to-turbo): bản ghi turbo + bun thật và bốn ca — đỏ trên vật hiện tại"
```

### Task 2: Vật — bóc một lớp tiền tố trong `rutTenCa`, tài liệu

`independent: false` (đứng trên Task 1) · phục vụ E1, E2, E3, E4

**Files:**
- Modify: `feature-loop/scripts/lib/chay-lai.mjs:35-42`
- Modify: `GUIDE.md:1386` (dòng `repin_retry` của bảng khoá)

**Interfaces:**
- Consumes: hằng `KHUON_TEN_CA` (có sẵn).
- Produces: `export const TIEN_TO_BO_CHAY = /^\S*?:\s+/;` (đúng một dòng, Task 1 phá bằng regex trên dòng này); `rutTenCa` giữ chữ ký.

- [ ] **Step 1: Thay khối `rutTenCa`**

```js
// Tiền tố dòng của bộ chạy monorepo (hồ sơ ten-ca-qua-tien-to-turbo): turbo không có TTY — đúng hoàn
// cảnh của làn, lệnh chạy qua ống — in `<gói>:<tác vụ>: ` trước mọi dòng con (đo turbo 2.10.8 chạy
// bun test, 11/10; `--log-prefix auto` mặc định). Năm khuôn trên neo đầu dòng nên gặp tiền tố là rơi về
// câu dự phòng. Bóc MỘT lớp, CHỈ khi dòng thô không khớp khuôn nào: dòng hôm nay rút được tên gì thì vẫn
// rút đúng tên đó. Một cụm không khoảng trắng chứ không riêng turbo — bộ đọc khoan dung (luật 26/09).
export const TIEN_TO_BO_CHAY = /^\S*?:\s+/;

function khopKhuon(l) {
  for (const k of KHUON_TEN_CA) { const m = l.match(k.re); if (m) return m[1].trim(); }
  return null;
}

export function rutTenCa(text) {
  const ra = [];
  for (const l of String(text || '').split('\n')) {
    const ten = khopKhuon(l) ?? khopKhuon(l.replace(TIEN_TO_BO_CHAY, ''));
    if (ten !== null) ra.push(ten);
    if (ra.length >= 10) break;
  }
  return ra.length ? ra : ['không rút được tên ca'];
}
```

- [ ] **Step 2: GUIDE** — trong ô mô tả của dòng `repin_retry`, sau «(rút từ nhật ký: bun, vitest/jest, playwright, node:test)» thêm «, kể cả khi dòng mang tiền tố một cụm của bộ chạy monorepo như turbo `<gói>:<tác vụ>: `».

- [ ] **Step 3: Chạy, phải XANH**

Run: `node tests/scripts/ten-ca-qua-tien-to.test.mjs && node tests/scripts/repin-lane-chay-lai.test.mjs`
Expected: `Results: 4 passed, 0 failed` rồi `Results: 14 passed, 0 failed`.

- [ ] **Step 4: Commit**

```bash
git add feature-loop/scripts/lib/chay-lai.mjs GUIDE.md
git commit -m "feat(ten-ca-qua-tien-to-turbo): rutTenCa bóc một lớp tiền tố của bộ chạy monorepo"
```
