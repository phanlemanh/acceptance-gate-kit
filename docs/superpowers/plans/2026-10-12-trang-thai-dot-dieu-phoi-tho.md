# Trạng thái đợt trong app (DP6b) — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (main loop, tuần tự) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trạng thái đợt Điều phối – Thợ hiện sẵn trong app: `xem --json`, dải trên ô nhập + pane, `/dieu-phoi:xem` không qua model.

**Architecture:** CLI là bên đọc duy nhất của thư mục đợt (`xemJson` dùng chung `moHinh`); hàm vẽ thuần `khung.mjs` + `chuXem` (mo-hinh.mjs) là một nguồn chữ cho dải, pane và lệnh; phần mod `hooks/mod/khung.ts` chỉ gọi CLI theo nhịp và vẽ. Răng T11 của DP4 tổng quát hoá cho mọi phần.

**Tech Stack:** Node ESM (gói `dieu-phoi`), `node:test`, mod Claude Code 2.1.295 (`claude plugin test`/`validate`, `claude -p`).

**Spec:** `docs/superpowers/specs/2026-10-12-trang-thai-dot-dieu-phoi-tho-design.md` · hợp đồng `_acceptance/trang-thai-dot-dieu-phoi-tho/contract.md` (9 AC) · `evals.yaml` (E1–E9, E9b).

## Global Constraints

- `xem` không cờ không đổi một byte; hàm `xem(cwd)` và dòng `else dong = veXem(moHinh(…` GIỮ NGUYÊN (ca DP2-01-do tiêm vào dòng đó).
- `khung.mjs` không có dòng `import` nào; module mod chỉ import tệp tương đối và `claude-code`.
- Phần mod chỉ nghe tập sự kiện mà `validate` thấy, ⊆ {`session.start`, `ui.render`, `ui.press`, `command.run`}; không chữ `allow`/`result` (regex `CHO_PHEP` của `mod-luat.mjs`).
- `process.run` của `khung.ts`: argv `['node', `${$.plugin.root}/scripts/dieu-phoi.mjs`, 'xem', '--json']`, `timeoutMs: 10000`.
- Nhịp: 20000 ms khi có đợt (kể cả đọc lỗi), 120000 ms khi `{"dot":null}`; `session.start` không chờ CLI.
- Pane id `dieu-phoi-dot`; nút dải khoá `xem`; cột dải = `bodyColumns − 8`.
- Tên ca test bắt đầu `KH-`. Fixture đợt: `tests/dieu-phoi/fixtures/dot-crm-0910` (8 đơn chờ, khoá s4 P5 hạn `2026-10-10T00:47:30.085Z`, P3 = t173 · dang).
- Bản cũ của AC-3: `git archive f59d9547 dieu-phoi` (commit cố định, không merge-base).
- Môi trường cô lập của AC-8: bỏ mọi biến `CLAUDE_*`/`ANTHROPIC_*`, `CLAUDE_CONFIG_DIR=<tạm>`, `ANTHROPIC_API_KEY=khoa-gia-kiem-thu`, `ANTHROPIC_BASE_URL=http://127.0.0.1:9`.
- Đường dẫn trong test suy từ vị trí tệp test; kho thử do code sinh; mỗi ca đỏ kiểm bước tiêm đã áp và chạy SAU đối chứng xanh.

## Review Focus

1. Đợt có `trang-thai.json` nhưng `hang-viec.json` vắng → `xemJson` không được ném; `day_cua_cwd: null` (ca thêm vào KH-02 như hàng phụ, đối chứng với `xem` thường cũng chạy được).
2. `bodyColumns` nhỏ hơn 9 (cửa sổ hẹp) → `cot` ≤ 0: `veDai` trả chuỗi `…` dài 1, không ném (ca phụ trong KH-04).
3. CLI in thêm dòng rác trước JSON (cảnh báo node) → mod coi là lỗi đọc, không vẽ nửa vời (ca KH-05 «stdout hỏng»).
4. Hai lần bấm `xem` liền → `ui.open` gọi hai lần cùng id, không mở hai pane (engine giữ một pane mỗi id; test đếm id).
5. Khoá `s4` có nhưng `han` vắng/không phải ngày → dải in `S4: <phiên>` không kèm giờ, không in `NaN` (ca phụ trong KH-04).

---

### Task 1: CLI `xem --json` + `chuXem`

**Files:**
- Modify: `dieu-phoi/scripts/dieu-phoi.mjs` (thêm `xemJson`, nhánh `xem --json` cạnh nhánh `--kiem-chuyen`; KHÔNG sửa `xem()`)
- Modify: `dieu-phoi/scripts/mo-hinh.mjs` (thêm `chuXem`)
- Create: `tests/dieu-phoi/khung.test.mjs` (KH-01, KH-02, KH-03 + đỏ)
- Modify: `_acceptance/config.yaml` (khoá `executors.test.dieu_phoi_khung`)

**Interfaces:**
- Produces: `export function xemJson(cwd): object` — `{dot:null}` | `{dot, pha, chua_co_nhip:true, day_cua_cwd, canh_bao, mui_gio_phut}` | `{...moHinh(tt,…), day_cua_cwd, canh_bao, mui_gio_phut}`.
- Produces: `export function chuXem(kq): string` (mo-hinh.mjs) — `không có đợt nào đang chạy` · `chưa có nhịp nào · pha <pha>` · `veXem(kq)`; thêm dòng `canh_bao` khi có.

- [ ] **Step 1: Viết test đỏ** `tests/dieu-phoi/khung.test.mjs` — trợ giúp `khoDot({ nhip = true, cwdDay = null, trangThai = (tt)=>tt })`: kho git tạm, chép fixture `dot-crm-0910` vào `.acceptance-runs/dieu-phoi-sau-14-10` (thay `@KHO@`, tạo thư mục worktree), symlink `dieu-phoi-hien-tai` (cùng cách `dungDotCu` của mo-dot.test). Ca:
  - `KH-01 xem-json`: 4 hàng cwd (gốc · `.claude/worktrees/wt-3` · `wt-3/con` · `.claude/worktrees/khac`), env `TZ=Asia/Ho_Chi_Minh`; so `JSON.parse(stdout)` bỏ 3 khoá thêm `deepStrictEqual` `moHinh(tt, { nhom: docNhomKeHoach(kho), hangViec })` (import từ GOI); `day_cua_cwd` = null, P3, P3, null; `canh_bao` null; `mui_gio_phut` 420; in «hàng · mong đợi · thực tế».
  - `KH-01-do bo-day-cua-cwd`: bản sao gói (cpSync), tiêm bỏ `day_cua_cwd` (kiểm chuỗi đổi) → hàng (b) đỏ, thông điệp chứa `day_cua_cwd`.
  - `KH-02 xem-json-bien`: (a) kho git không đợt → stdout `{"dot":null}\n`, mã 0, stderr ''; (b) thư mục tạm ngoài git → như (a); (c) `khoDot({ nhip:false })` → `dot === 'sau-14-10'`, `pha === 'dang-chay'`, `chua_co_nhip === true`; (d) `trang-thai.json` = `{hỏng` → mã 1, stderr bắt đầu `dieu-phoi: `, stdout ''; (e) Review Focus 1: `hang-viec.json` xoá → mã 0, `day_cua_cwd` null.
  - `KH-02-do khong-dot-rong`: bản sao trả `{}` khi không đợt → hàng (a) đỏ, thông điệp chứa `{}`.
  - `KH-03 xem-khong-doi`: `git -C <KIT> archive f59d9547 dieu-phoi | tar -x -C <tạm>`; 4 hàng (a) có nhịp (b) chưa nhịp (c) không đợt (d) có nhịp + `.claude/settings.json` có hook `node scripts/dieu-phoi/hook-nhip.mjs` → `{ma,out,err}` HEAD === bản cũ; đối chứng: out (d) có dòng bắt đầu `cảnh báo:`.
  - `KH-03-do doi-chu`: bản sao HEAD đổi `chờ lượt` → `cho luot` trong `veXem` → hàng (a) đỏ, thông điệp chứa `(a)`.
- [ ] **Step 2: Chạy, xác nhận đỏ** — `node --test tests/dieu-phoi/khung.test.mjs` → KH-01/02 FAIL (`--json` chưa có, `xem` in chữ), KH-03 PASS (chưa đổi gì).
- [ ] **Step 3: Cài đặt** trong `dieu-phoi.mjs` (import thêm `timThuMucDot, phienCuaCwd` từ `./dot.mjs`, `chuXem` không cần ở CLI):

```js
// `xem --json` (DP6b): MỘT dòng JSON cho khung của lớp mod — cùng mô hình `xem` vẽ, cộng dãy của cwd, dòng
// cảnh báo hai bản và độ lệch múi giờ của máy (mod không có Node để tự biết). Không đợt → {"dot":null}, thoát 0.
export function xemJson(cwd) {
  const thuMuc = timThuMucDot(cwd);
  if (!thuMuc) return { dot: null };
  const goc = gocKhoChinh(cwd);
  const hangViec = docJson(path.join(thuMuc, 'hang-viec.json'), null);
  const them = { day_cua_cwd: phienCuaCwd(hangViec, cwd), canh_bao: canhBaoHaiBan(goc), mui_gio_phut: -new Date().getTimezoneOffset() };
  const tt = docJson(path.join(thuMuc, 'trang-thai.json'), null);
  if (!tt) return { dot: hangViec?.dot || null, pha: docPha(thuMuc).pha, chua_co_nhip: true, ...them };
  return { ...moHinh(tt, { nhom: docNhomKeHoach(goc), hangViec }), ...them };
}
```
  và nhánh chính, ngay sau khối `if (lenh === 'xem' && co['kiem-chuyen'])`:

```js
  if (lenh === 'xem' && co.json) {
    try {
      process.stdout.write(`${JSON.stringify(xemJson(cwd))}\n`);
    } catch (e) {
      process.stderr.write(`dieu-phoi: ${e.message}\n`);
      process.exit(1);
    }
    process.exit(0);
  }
```
  (`dot` của ca chưa nhịp: hang-viec.dot; rỗng thì tên thư mục đợt bỏ tiền tố `dieu-phoi-`.) `chuXem` trong `mo-hinh.mjs`:

```js
// Chữ của `xem` cho một kết quả `xem --json` — pane và câu trả lời /dieu-phoi:xem của lớp mod đều là chuỗi này,
// nên không ai viết lại chữ của `xem` lần thứ hai (DP6b). Không đợt: đúng phần sau tiền tố `dieu-phoi: ` của `xem`.
export function chuXem(kq) {
  if (!kq || kq.dot === null) return 'không có đợt nào đang chạy';
  const dong = kq.chua_co_nhip ? `chưa có nhịp nào · pha ${kq.pha}` : veXem(kq);
  return kq.canh_bao ? `${dong}\n${kq.canh_bao}` : dong;
}
```
- [ ] **Step 4: Chạy, xác nhận xanh** — `node --test tests/dieu-phoi/khung.test.mjs` → KH-01…KH-03 và ba ca đỏ `ok`.
- [ ] **Step 5: Khoá executor** — thêm vào `_acceptance/config.yaml` dưới `dieu_phoi_sdt`:
  `dieu_phoi_khung: "bash -c 'set -o pipefail; node --test --test-reporter=tap \"tests/dieu-phoi/**/*.test.mjs\" 2>&1 | grep -E \"^ *(not )?ok [0-9]+ - (DP[0-9]+|SDT|KH)-|^ *not ok|^#   |^# (pass|fail|skipped|todo) \" | paste -sd\"|\" -'"` (kèm dòng chú thích hồ sơ). Chạy khoá đó: mã 0, có `ok … KH-01`.
- [ ] **Step 6: Commit** `feat(dieu-phoi): xem --json + chuXem (DP6b AC-1..3)`.

### Task 2: Hàm vẽ thuần `khung.mjs`

**Files:**
- Create: `dieu-phoi/scripts/khung.mjs`
- Modify: `tests/dieu-phoi/khung.test.mjs` (KH-04 + ba ca đỏ)

**Interfaces:**
- Consumes: `xemJson` (Task 1) qua CLI thật cho round-trip; `chuXem` (Task 1).
- Produces: `export function veDai(kq, { cot } = {}): string|null`, `export const CHU_KY_MS = { co_dot: 20000, khong_dot: 120000 }`, `export function chuKy(kq): number`, `export function gioPhut(iso, lechPhut): string|null`.

- [ ] **Step 1: Test đỏ** KH-04:
  - `KH-04 ve-dai`: 16 hàng (a)–(p) đúng AC-4, chuỗi mong đợi viết tay; mô hình gốc của (c)–(l) dựng tay: `{dot:'sau-14-10', pha:'dang-chay', giam_tai:false, can_nguoi:null, khoa:[{tai_nguyen:'s4', phien:'P5', han:'2026-10-10T00:47:30.085Z'}], hang_cho:[{},{}], cho_nguoi:[], day:[{id:'P3', hang:'t173', tien_do:'dang'}], cho_may:null, day_cua_cwd:null, mui_gio_phut:420}`; in số assert 16. Thêm ca phụ Review Focus 2 (`cot: 3` → độ dài ≤ 3, không ném) và 5 (`han: null` → chứa `S4: P5` không chứa `NaN`).
  - `KH-04 round-trip-dai`: `khoDot` mở bằng `mo sau-14-10`… (dùng cùng trợ giúp Task 1, tên đợt sau-14-10) — (R1) cwd gốc, (R2) cwd wt-3, (R3) chưa nhịp, (R4) `trang_thai: 'giam-tai'`, (R5) bỏ khoá s4 + `cho_may: 'kho-khac'`; đầu vào `JSON.parse(stdout xem --json)` (TZ Asia/Ho_Chi_Minh), `strictEqual` với:
    - R1 `Đợt sau-14-10 · dang-chay · S4: P5 → 07:47 · chờ lượt 8 · cần anh 0`
    - R2 R1 + ` · Dãy P3: t173 · dang`
    - R3 `Đợt sau-14-10 · dang-chay · chưa có nhịp`
    - R4 `GIẢM TẢI · ` + R1
    - R5 `Đợt sau-14-10 · dang-chay · S4: chờ khoá máy · chờ lượt 8 · cần anh 0`
  - `KH-04 round-trip-xem`: (R6–R8) có nhịp · chưa nhịp · có cảnh báo → `chuXem(json) === out.replace(/\n$/, '')`; (R9) không đợt → `'dieu-phoi: ' + chuXem({dot:null}) === err.replace(/\n$/, '')`.
  - `KH-04 khung-khong-import`: `!/^\s*import\b/m.test(nguon khung.mjs)`.
  - `KH-04-do bo-giam-tai` · `KH-04-do sai-khoa-cho` (tiêm `hang_cho.length` → `cho_nguoi.length`) · `KH-04-do gio-may` (tiêm `gioPhut` dùng `getHours()`): mỗi ca nạp bản sao `khung.mjs` (import động từ tệp tạm), chạy lại đúng hàng, đỏ, thông điệp nêu tên hàng.
- [ ] **Step 2: Chạy → FAIL** (`khung.mjs` chưa có).
- [ ] **Step 3: Cài đặt** `dieu-phoi/scripts/khung.mjs`:

```js
// Hàm vẽ THUẦN của khung trạng thái đợt (DP6b, thiết kế §2.2). Module mod chỉ import được tệp tương đối và
// `claude-code`, nên tệp này KHÔNG import gì. Đầu vào là kết quả `dieu-phoi.mjs xem --json` (hoặc {loi}).
export const CHU_KY_MS = { co_dot: 20000, khong_dot: 120000 };
export const DONG_LOI = 'khung: không đọc được đợt';
export const chuKy = (kq) => (kq && kq.dot === null ? CHU_KY_MS.khong_dot : CHU_KY_MS.co_dot);

// HH:MM của một mốc ISO theo độ lệch phút mà CLI báo (giờ máy của tiến trình mod không đáng tin).
export function gioPhut(iso, lechPhut) {
  const ms = Date.parse(iso ?? '');
  if (!Number.isFinite(ms)) return null;
  const d = new Date(ms + (Number(lechPhut) || 0) * 60000);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
}

export function veDai(kq, { cot } = {}) {
  if (!kq || kq.dot === null) return null;
  let s;
  if (kq.loi) s = DONG_LOI;
  else if (kq.chua_co_nhip) s = `Đợt ${kq.dot} · ${kq.pha} · chưa có nhịp`;
  else {
    const k = (kq.khoa ?? []).find((x) => x.tai_nguyen === 's4');
    const gio = k ? gioPhut(k.han, kq.mui_gio_phut) : null;
    const s4 = k ? `S4: ${k.phien}${gio ? ` → ${gio}` : ''}` : kq.cho_may ? 'S4: chờ khoá máy' : 'S4: trống';
    const can = (kq.cho_nguoi ?? []).length + (kq.can_nguoi ? 1 : 0);
    s = `Đợt ${kq.dot} · ${kq.pha} · ${s4} · chờ lượt ${(kq.hang_cho ?? []).length} · cần anh ${can}`;
    const d = kq.day_cua_cwd ? (kq.day ?? []).find((x) => x.id === kq.day_cua_cwd) : null;
    if (d) s += ` · Dãy ${d.id}: ${d.hang ?? '—'} · ${d.tien_do ?? '—'}`;
    if (kq.giam_tai) s = `GIẢM TẢI · ${s}`;
  }
  if (Number.isFinite(cot) && s.length > cot) s = cot >= 1 ? `${s.slice(0, cot - 1)}…` : '…';
  return s;
}
```
- [ ] **Step 4: Chạy → PASS** cả tệp `khung.test.mjs`.
- [ ] **Step 5: Commit** `feat(dieu-phoi): khung.mjs veDai (DP6b AC-4)`.

### Task 3: Phần mod `khung.ts` + khế ước `$.state` + răng tổng quát

**Files:**
- Create: `dieu-phoi/hooks/mod/khung.ts`, `dieu-phoi/types/index.d.ts`, `tests/dieu-phoi/mod/khung.test.ts`, `tests/dieu-phoi/kiem-khung.mjs`
- Modify: `dieu-phoi/hooks/mod/register.ts` (thêm `dangKyKhung(on)`), `dieu-phoi/scripts/mod-luat.mjs` (dòng bảng + luật cổng mọi dòng), `dieu-phoi/.claude-plugin/plugin.json` (`"types": "./types/index.d.ts"`), `_acceptance/config.yaml` (`executors.script.dieu_phoi_khung_mod`)

**Interfaces:**
- Consumes: `veDai`, `chuKy`, `DONG_LOI` (Task 2), `chuXem` (Task 1) — import `../../scripts/khung.mjs`, `../../scripts/mo-hinh.mjs`.
- Produces: `export const dangKyKhung = (on: On) => void`; atom `{ plugin: 'dieu-phoi', key: 'khung' }` kiểu `KhungDot = { kq: object|null; loi: string|null; luc: number }|null`; pane id `dieu-phoi-dot`.

- [ ] **Step 1: Test đỏ** — `tests/dieu-phoi/mod/khung.test.ts` (chỗ giữ `__XEM_JSON_P3__`, `__XEM_JSON_KHONG__`, `__XEM_CHU__` do `kiem-khung.mjs` thay bằng stdout THẬT sinh trong lượt). Trợ giúp `nen(on, { stdout, nem })` đăng ký bên dưới: `process.run` (ghi lại `e`, trả `{value:{exitCode:0, stdout, stderr:''}}` hoặc ném), `session.cwd`, `session.id`, `ui.open` (ghi id). Ca, mỗi ca lặp `['terminal','desktop']`:
  - `dai co dot` · `dai khong dot` · `dai loi doc` · `dai stdout hong` (Review Focus 3) · `dai survey` · `bam xem mo pane` · `pane dung chu xem` · `pane dang doc` · `pane loi doc` · `khong mo pane khi khong hoi` (đếm ui.open = 0 sau session.start + 120000 ms) · `nhip co dot` · `nhip khong dot` · `nhip loi 20s` · `lenh xem tra chu` (`$.command.run({command:'dieu-phoi:xem'})` → `text === chuXem(json)`).
  Đồng hồ: `const clock = mock.clock(on)`; `await $.session.start({ cwd: '/tmp/kho-thu', surface: 'terminal', isInteractive: true })`; `await clock.advance(1)`.
  `kiem-khung.mjs` (cùng khung `kiem-mod.mjs`: tìm engine theo semver, bản sao gói, đếm pass/fail, in `PASS|FAIL: KH-0n …`): dựng kho thử từ fixture, sinh ba stdout thật, chép tệp ca vào bản sao, chạy `plugin test`, in KH-05 (các ca dải), KH-06 (nhịp), KH-07 (pane); ba ca đỏ: bỏ nhánh `null → next(e)` → «dai khong dot» `(fail)`; chu kỳ không đợt 20000 → «nhip khong dot» `(fail)`; `ui.open` trong `session.start` → «khong mo pane khi khong hoi» `(fail)`.
- [ ] **Step 2: Chạy** `node tests/dieu-phoi/kiem-khung.mjs` → FAIL (chưa có phần mod).
- [ ] **Step 3: Cài đặt**:
  - `dieu-phoi/types/index.d.ts`:

```ts
export type KhungDot = { kq: Record<string, unknown> | null; loi: string | null; luc: number } | null

declare module 'claude-code' {
  interface PluginState {
    'dieu-phoi': { khung: KhungDot }
  }
}
```
  - `dieu-phoi/hooks/mod/khung.ts`:

```ts
import { atom, read, update } from 'claude-code'
import type { On } from 'claude-code'
import type { KhungDot } from '../../types'
import { DONG_LOI, chuKy, veDai } from '../../scripts/khung.mjs'
import { chuXem } from '../../scripts/mo-hinh.mjs'

// Phần mod khung trạng thái đợt (DP6b; thiết kế §2.3). Chỉ đọc: gọi `dieu-phoi.mjs xem --json` theo nhịp, vẽ dải
// trên ô nhập và pane, trả lời /dieu-phoi:xem không qua model. Không ghi tệp, không nghe sự kiện cổng nào. Hook
// lệnh cố ý không có .catch: CLI lỗi thì hook ném, engine bỏ qua nó và chạy lệnh markdown như cũ.
const PANE = 'dieu-phoi-dot'
const khung = atom({ plugin: 'dieu-phoi', key: 'khung' } as const, null as KhungDot)

async function docDot($: any): Promise<NonNullable<KhungDot>> {
  const luc = await $.clock.now()
  try {
    const r = await $.process.run(['node', `${$.plugin.root}/scripts/dieu-phoi.mjs`, 'xem', '--json'], { cwd: await $.session.cwd(), timeoutMs: 10000 })
    if (r.exitCode !== 0) return { kq: null, loi: String(r.stderr).trim().split('\n')[0] || `thoát ${r.exitCode}`, luc }
    return { kq: JSON.parse(String(r.stdout)), loi: null, luc }
  } catch (err: any) {
    return { kq: null, loi: String(err?.message ?? err).split('\n')[0], luc }
  }
}

export const dangKyKhung = (on: On) => {
  const nhip = async ($: any) => {
    const moi = await docDot($)
    await update($, khung, () => moi)
    $.clock.after(moi.kq ? chuKy(moi.kq) : chuKy(null), () => nhip($))
  }

  on('session.start', async ($, e, next) => {
    $.clock.after(1, () => nhip($))
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const k = await read($, khung)
    if (!k) return next(e)
    const dai = veDai(k.loi ? { loi: k.loi } : k.kq, { cot: e.props.bodyColumns - 8 })
    if (dai === null) return next(e)
    const { Box, Button, Text } = $.ui.resolve(e)
    const ten = k.kq?.dot ? `Đợt ${k.kq.dot}` : 'Đợt'
    return (
      <Box>
        <Text>{dai} </Text>
        <Button key="xem" label="xem" onPress={() => $.ui.open({ id: PANE, title: ten })} />
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const k = await read($, khung)
    const dong = !k ? ['đang đọc đợt…'] : k.loi ? [DONG_LOI, k.loi] : chuXem(k.kq).split('\n')
    return <Box flexDirection="column">{dong.map((d: string) => <Text>{d}</Text>)}</Box>
  })

  on('command.run', { command: 'dieu-phoi:xem' }, async ($) => {
    const moi = await docDot($)
    if (!moi.kq) throw new Error(moi.loi ?? DONG_LOI)
    await update($, khung, () => moi)
    void $.ui.open({ id: PANE, title: moi.kq.dot ? `Đợt ${moi.kq.dot}` : 'Đợt' })
    return { text: chuXem(moi.kq) }
  })
}
```
  (Khung `.ts` dùng JSX → đổi tên tệp thành `khung.tsx` nếu `validate` đòi; khoá bảng và tệp theo tên thật. `$.clock.after` tên gọi: kiểm `TimerCall` trong d.ts lúc làm — `after(ms, fn)`.)
  - `register.ts`: thêm `import { dangKyKhung } from './khung'` và `dangKyKhung(on)`.
  - `mod-luat.mjs`: dòng bảng `'./mod/khung.ts': [<tập validate thấy>]`; thay dòng `const cong = (SU_KIEN_MOD['./mod/doc-muc-dung.ts'] …` bằng vòng lặp trên mọi khoá: `for (const [rel, su] of Object.entries(SU_KIEN_MOD)) { const c = su.filter((s) => SU_KIEN_CONG.includes(s)); if (c.length) loi.push(`${rel.slice(6)}: không được nghe sự kiện cổng: ${c.join(', ')}`); }` (giữ chữ «không được nghe sự kiện cổng» để thông điệp cũ vẫn khớp).
  - `plugin.json`: thêm `"types": "./types/index.d.ts"`.
  - config: `dieu_phoi_khung_mod: node tests/dieu-phoi/kiem-khung.mjs` dưới `dieu_phoi_mod`.
- [ ] **Step 4: Chạy** `node tests/dieu-phoi/kiem-khung.mjs` → `PASS: KH-05…KH-07` + ba đỏ; `node tests/dieu-phoi/kiem-mod.mjs` → mọi dòng DP4-12/13 PASS (E9b); `node --test tests/dieu-phoi/` xanh.
- [ ] **Step 5: Commit** `feat(dieu-phoi): phần mod khung — dải, pane, lệnh (DP6b AC-5..7)`.

### Task 4: Đo engine thật (KH-08) + răng (KH-09)

**Files:**
- Modify: `tests/dieu-phoi/kiem-khung.mjs`, `dieu-phoi/scripts/mod-luat.mjs` (`kiemChiVe(gocGoi, { notes, gatingHooks })`)

**Interfaces:**
- Produces: `export const GOI_CAM = ['$.fs.write','$.fs.remove','$.store.set','$.session.send','$.session.append','$.prompt.submit','$.tool.','$.command.run']`, `export const CONG_DUOC_PHEP = ['command.run{command=dieu-phoi:xem}']`, `export function kiemChiVe(gocGoi, { calls, gatingHooks }): string[]`.

- [ ] **Step 1: Test đỏ** KH-08 trong `kiem-khung.mjs`: hàm `chayLenh(sao, kho)` — `spawnSync(banTest, ['-p', '/dieu-phoi:xem', '--plugin-dir', sao, '--output-format', 'json'], { cwd: kho, env: moiTruongCoLap(), timeout: 120000 })` → `JSON.parse(stdout)`; 4 hàng (a)–(d) so `is_error false`, `num_turns 0`, `total_cost_usd 0`, `result === 'dieu-phoi: ' + chuXem…` (lấy từ stdout/stderr của `xem` thật trên cùng kho); hàng đường lùi `KH-08 duong-lui` (trang-thai hỏng) → `num_turns ≥ 1`, `terminal_reason === 'api_error'`, `!result.startsWith('dieu-phoi: khung')`; `KH-08-do matcher` (tiêm `'dieu-phoi:xem'` → `'dieu-phoi:xem-khac'` trong khung.ts của bản sao) và `KH-08-do khong-mod` (`hooks.json` bỏ `modules`) → như đường lùi. Mọi chiều đỏ chạy sau khi (a) xanh.
  KH-09: `validate --strict --json` gói thật → `success`, 0 lỗi; `kiemKhungMod` rỗng; `gatingHooks.map(g=>g.hook)` === `CONG_DUOC_PHEP` và `hasCatch === false`; `kiemChiVe` rỗng; năm bản sao đỏ (cong · gating · allow · ghi-tep · argv) với thông điệp ghim như E9.
- [ ] **Step 2: Chạy → FAIL** (`kiemChiVe` chưa có).
- [ ] **Step 3: Cài đặt** `kiemChiVe` trong `mod-luat.mjs`: đọc dòng note `./mod/register.ts calls:` → danh sách; mục nào bắt đầu bằng một tiền tố trong `GOI_CAM` → lỗi `gọi ${c} — mod chỉ vẽ`; `gatingHooks` khác `CONG_DUOC_PHEP` → lỗi `gatingHooks lệch: [...]`; quét chữ `khung.ts`: mọi `$.process.run([` literal argv phải kết thúc `'xem', '--json']` → lỗi `khung.ts: argv process.run không kết thúc 'xem','--json': <argv>`.
- [ ] **Step 4: Chạy** `node tests/dieu-phoi/kiem-khung.mjs` → mọi dòng PASS (KH-05…KH-09 + đỏ), mã 0.
- [ ] **Step 5: Commit** `test(dieu-phoi): KH-08 engine thật cô lập + KH-09 răng chỉ vẽ (DP6b AC-8, AC-9)`.

### Task 5: Tài liệu gói, cây xanh, đặt `implemented`

**Files:**
- Modify: `dieu-phoi/README.md` (mục lớp mod: phần khung — dải, pane, lệnh; hai giới hạn đã khai), `PRODUCT-MAP.md`/`LO-TRINH.html` (sinh lại), `_acceptance/trang-thai-dot-dieu-phoi-tho/contract.md` (`status: implemented`)

- [ ] **Step 1:** README: thêm đoạn «Khung trạng thái đợt (DP6b)» — dải một dòng, nút xem → pane, `/dieu-phoi:xem` không qua model khi có mod; giới hạn: chưa nhìn thấy trên desktop · `$.process.run` desktop chưa đo; răng chỉ vẽ.
- [ ] **Step 2:** Chạy `node --test tests/dieu-phoi/` (mã 0), `bash tests/plugins/run-tests.sh` vùng dieu-phoi (P32/P33/P200 qua `executors.test.dieu_phoi_plugins`), `node tests/dieu-phoi/kiem-validate.mjs`, `node tests/dieu-phoi/kiem-mod.mjs`, `node tests/dieu-phoi/kiem-khung.mjs`, `node scripts/product-map.mjs --root . --check`.
- [ ] **Step 3:** Đặt `status: implemented`, sinh lại bản đồ, commit `S3(trang-thai-dot-dieu-phoi-tho): implemented`.
