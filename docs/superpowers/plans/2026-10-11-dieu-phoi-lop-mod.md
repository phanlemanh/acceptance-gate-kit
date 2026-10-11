# DP6 phần lõi Node — chặn S4 đúng lệnh, giám sát thức khi thợ chờ người — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sửa bộ phân loại S4 (vỏ bọc mang cờ, thân heredoc, cờ chỉ đọc), lời chặn nêu lệnh xin lượt, hook chờ người không nuốt hộp xin quyền, và sự kiện `cho-nguoi` mang `can_phan` để Monitor của giám sát thức.

**Architecture:** Bốn tệp lõi của gói `dieu-phoi` (`phan-loai-s4.mjs`, `hook-chan-s4.mjs`, `hook-cho-nguoi.mjs`, `phat-lich.mjs`) — không mod nào. Một tệp ca mới `tests/dieu-phoi/lop-mod.test.mjs` (tên ca «DP6-»), một script rút lời gọi thật từ bản ghi hội thoại và tệp ca của nó.

**Tech Stack:** Node ≥ 20 ESM, `node:test`, git (kho thử do mã sinh trong thư mục tạm).

**Spec:** `docs/superpowers/specs/2026-10-11-dieu-phoi-lop-mod-design.md` · hợp đồng `_acceptance/dieu-phoi-lop-mod/contract.md` (AC-1…AC-8) · evals `_acceptance/dieu-phoi-lop-mod/evals.yaml` (E1…E8).

## Global Constraints

- Không thêm tệp nào dưới `dieu-phoi/hooks/mod/`, không thêm mục `modules` — phần mod ở hạt giống.
- `tests/dieu-phoi/loi/` chỉ được đổi đúng các dòng assert của `loi/hook-chan-s4.test.mjs` mà ở merge-base ghim «Ghi đơn xin/» (AC-7).
- Lời chặn giữ tiền tố `chan-s4: khoá <tài nguyên> ` (DP1 `dong-goi.test.mjs` ghim `^chan-s4: khoá`).
- Ca kiểm: kho thử do mã sinh; đường suy từ vị trí tệp test (`const DAY = path.dirname(fileURLToPath(import.meta.url))`); không hardcode ROOT.
- Ca đỏ: chạy CHÍNH hàm đo trên bản sao gói bị tiêm, sau khi bản lành xanh trên cùng fixture; kiểm bước tiêm đã áp (văn bản đổi); tập ô đỏ RÚT bằng code từ ma trận, kiểm 0 < số < tổng, so bằng nhau.
- Ma trận viết trước: số assert = số ô, `console.log` số ô.
- Lệnh chạy suite của hàng: khoá `executors.test.dieu_phoi_dp6` trong `_acceptance/config.yaml` (Task 1).

## Review Focus

- Thân heredoc không nháy chứa `$(node …/repin-lane.mjs …)` — người dùng mong lệnh đó VẪN bị chặn (thay lệnh chạy thật). Ca ở Task 3 (ô h3 + đột biến `bo-thay-lenh`).
- `$((1<<2))` (dịch bit trong số học) — không được hiểu là heredoc rồi nuốt các dòng sau. Ca ở Task 3: `echo $((1<<2))⏎node x/repin-lane.mjs --write` → `s4`.
- `node --check a.mjs && node a.mjs --write` — kiểm cú pháp rồi chạy thật vẫn phải bị chặn. Ca ở Task 3 (ô v).
- Đợt chưa chạy `chay` (không có `<thư mục đợt>/loi/`) — lời chặn vẫn nêu một lệnh `xin` chạy được (lõi của gói đang chạy hook). Ca ở Task 4.
- Đợt thiếu `hang-viec.json` hoặc hỏng — lời chặn không ném, rơi về câu «chỉ phiên thợ của một dãy». Ca ở Task 4.

---

### Task 1: Khung ca DP6, khoá executor, script rút lời gọi thật (AC-3 phần tệp ca)

**Files:**
- Create: `tests/dieu-phoi/lop-mod.test.mjs`
- Create: `tests/dieu-phoi/rut-lenh-that.mjs`
- Create: `tests/dieu-phoi/fixtures/lenh-that-2026-10-11.jsonl` (do script sinh, không gõ tay)
- Modify: `_acceptance/config.yaml` (thêm khoá `executors.test.dieu_phoi_dp6` cạnh `dieu_phoi_dp3`)

**Interfaces:**
- Produces (trong `lop-mod.test.mjs`): `tam(tienTo)`, `ghiJ(p, du)`, `docJ(p)`, `git(cwd, …a)`, `ENV`, `chayCli(cwd, doiSo, {gocGoi})`, `khoLienKet({gocGoi, chayPha, duongCha})` → `{kho, dot, w1, w2, w3}`, `lenhHook(gocGoi, suKien, matcher)`, `chayHookChanS4(dauVao, {cwd, gocGoi})` → `{ma, err}`, `bamCay(goc)`, `ioGia(nowMs)`, `motNhipThat(dot, gocGoi)`, `goiTaiMergeBase()` → đường `dieu-phoi/` của merge-base, `saoGoi()` → bản sao gói trong thư mục tạm, `docTepCa()` → mảng `{tep, tool_use_id, nhan, hinh, lenh}`.
- Produces (script): `node tests/dieu-phoi/rut-lenh-that.mjs [--projects <dir>] [--out <tệp>]` — thoát 0 khi ghi đủ chín dòng; 2 khi thư mục bản ghi vắng; 1 khi thiếu một định danh.

- [ ] **Step 1: Viết script rút**

```js
#!/usr/bin/env node
// rut-lenh-that.mjs — hồ sơ dieu-phoi-lop-mod AC-3. Rút chín lời gọi Bash THẬT đo 11/10 (design §2.1) từ bản
// ghi hội thoại theo (tệp, tool_use_id), ẩn danh, ghi tệp ca. Không gõ tay lời gọi nào: tệp ca là đầu ra của
// script này. Dùng: node tests/dieu-phoi/rut-lenh-that.mjs [--projects <dir>] [--out <tệp>]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
export const TEP_CA = path.join(DAY, 'fixtures', 'lenh-that-2026-10-11.jsonl');
// <u> = thư mục bản ghi mang tên người dùng của máy (`-Users-<u>-dev-…`), thay lúc chạy.
export const DANH_SACH = [
  { tep: '-Users-<u>-dev-crm-onehub/e961dd78-18df-479c-b222-626b5031071d.jsonl', tool_use_id: 'toolu_01F5amYzsLqZiwyLE6LJcuqF', nhan: 's4', hinh: 'bo-lot:timeout' },
  { tep: '-Users-<u>-dev-crm-onehub/e961dd78-18df-479c-b222-626b5031071d.jsonl', tool_use_id: 'toolu_01MqsXnkmKmaZr4xQmriH3Dw', nhan: 's4', hinh: 'bo-lot:timeout' },
  { tep: '-Users-<u>-dev-oneflow--claude-worktrees-relaxed-sammet-b381ba/99f5dccb-b708-439b-9cfe-840162211b3e.jsonl', tool_use_id: 'toolu_01DpKjkur1hT8TmFV51Pcd2m', nhan: 's4', hinh: 'bo-lot:env-u' },
  { tep: '-Users-<u>-dev-acceptance-gate-kit/453582f0-0a41-4aae-88c9-0ee68e6fe063.jsonl', tool_use_id: 'toolu_01Bha6MeGgBoLdk8VeMC8Tcj', nhan: null, hinh: 'chan-nham:check' },
  { tep: '-Users-<u>-dev-acceptance-gate-kit/4ee4870f-67ea-490e-a54b-79b88660d13c.jsonl', tool_use_id: 'toolu_017FZkfNBLhwjrZmuQUVwDRr', nhan: null, hinh: 'chan-nham:heredoc' },
  { tep: '-Users-<u>-dev-acceptance-gate-kit/ae39de67-acaa-4cd4-8e29-36405c8c2544.jsonl', tool_use_id: 'toolu_01H5bCZJ6C6JKEV8JQbeDfCD', nhan: null, hinh: 'chan-nham:heredoc' },
  { tep: '-Users-<u>-dev-acceptance-gate-kit--claude-worktrees-zen-shaw-03c3ac/51f8aff8-8ca7-487a-bb1d-99e8194f59ad.jsonl', tool_use_id: 'toolu_015Z9CSu8WPviJnAg9yU6P47', nhan: null, hinh: 'chan-nham:heredoc+check' },
  { tep: '-Users-<u>-dev-crm-onehub/8b05aa51-86a9-4ab2-a710-b301f6bcc53b.jsonl', tool_use_id: 'toolu_017EVCCzAVeUqjHNA7kveJpS', nhan: null, hinh: 'chan-nham:help' },
  { tep: '-Users-<u>-dev-crm-onehub--claude-worktrees-agitated-kilby-4b9585/b8585b6c-402c-464d-a724-0c3b96ce514d.jsonl', tool_use_id: 'toolu_01TLNuUR2y6YqYxRGEPyG2Mo', nhan: null, hinh: 'chan-nham:help' },
];

export function anDanh(s, user = os.userInfo().username) {
  return s
    .replace(/\/private\/tmp\/claude-\d+\/[^\s'"`;|&)]*/g, '/tmp/scratch')
    .split(user).join('u')
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, 'u@x');
}

async function timLenh(p, id) {
  const rl = readline.createInterface({ input: fs.createReadStream(p), crlfDelay: Infinity });
  for await (const d of rl) {
    if (!d.includes(id)) continue;
    const o = JSON.parse(d);
    for (const c of o?.message?.content ?? []) if (c?.type === 'tool_use' && c.id === id) return String(c.input?.command ?? '');
  }
  return null;
}

export async function rut(projects, user = os.userInfo().username) {
  const ra = [];
  for (const m of DANH_SACH) {
    const p = path.join(projects, m.tep.replace('<u>', user));
    const lenh = fs.existsSync(p) ? await timLenh(p, m.tool_use_id) : null;
    if (lenh == null) throw new Error(`rut-lenh-that: không thấy ${m.tool_use_id} trong ${m.tep}`);
    ra.push({ tep: m.tep, tool_use_id: m.tool_use_id, nhan: m.nhan, hinh: m.hinh, lenh: anDanh(lenh, user) });
  }
  return `${ra.map((x) => JSON.stringify(x)).join('\n')}\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const co = (ten, md) => { const i = process.argv.indexOf(ten); return i > -1 ? process.argv[i + 1] : md; };
  const projects = co('--projects', path.join(os.homedir(), '.claude', 'projects'));
  const out = co('--out', TEP_CA);
  if (!fs.existsSync(projects)) { console.error(`rut-lenh-that: không có bản ghi hội thoại ở ${projects}`); process.exit(2); }
  try {
    const noi = await rut(projects);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, noi);
    console.log(`rut-lenh-that: ${DANH_SACH.length} dòng → ${out}`);
  } catch (e) { console.error(e.message); process.exit(1); }
}
```

- [ ] **Step 2: Chạy script, kiểm ẩn danh bằng mắt**

Run: `node tests/dieu-phoi/rut-lenh-that.mjs && wc -l tests/dieu-phoi/fixtures/lenh-that-2026-10-11.jsonl && grep -c "$(id -un)\|/private/tmp/claude-" tests/dieu-phoi/fixtures/lenh-that-2026-10-11.jsonl`
Expected: «9 dòng», `9`, và đếm `0`.

- [ ] **Step 3: Viết khung `lop-mod.test.mjs` + ca DP6-03 tep-ca, DP6-03 nguon**

Đầu tệp: helpers chép theo khuôn `tests/dieu-phoi/tiep-tuc.test.mjs` (tam, ghiJ, docJ, git, ENV, chayCli, khoLienKet, lenhHook, bamCay, ioGia, motNhipThat, goiTaiMergeBase, nap) — chép, không import tệp test DP3 (import sẽ đăng ký lại ca DP3). `khoLienKet` nhận thêm `duongCha` (thư mục cha của kho, để Task 4 dựng dưới «kho $x»). Thêm:

```js
import { DANH_SACH, TEP_CA, rut } from './rut-lenh-that.mjs';
export const docTepCa = () => fs.readFileSync(TEP_CA, 'utf8').split('\n').filter(Boolean).map((d) => JSON.parse(d));
export function saoGoi(goc = GOI) {
  const d = path.join(tam('dp6-sao-'), 'dieu-phoi');
  fs.cpSync(goc, d, { recursive: true });
  return d;
}
// Tiêm: thay đúng MỘT đoạn văn bản trong tệp của bản sao; ném khi đoạn không có (bước tiêm không áp).
export function tiem(gocGoi, tep, cu, moi) {
  const p = path.join(gocGoi, 'scripts', tep);
  const t = fs.readFileSync(p, 'utf8');
  assert.equal(t.split(cu).length - 1, 1, `bước tiêm không áp được ở ${tep}: «${cu.slice(0, 40)}»`);
  fs.writeFileSync(p, t.replace(cu, moi));
}

test('DP6-03 tep-ca', () => {
  const ds = docTepCa();
  assert.equal(ds.length, 9);
  for (const x of ds) assert.deepEqual(Object.keys(x).sort(), ['hinh', 'lenh', 'nhan', 'tep', 'tool_use_id']);
  assert.equal(new Set(ds.map((x) => x.tool_use_id)).size, 9);
  assert.equal(ds.filter((x) => x.nhan !== null).length, 3);
  assert.equal(ds.filter((x) => x.nhan === null).length, 6);
  const user = os.userInfo().username;
  for (const x of ds) {
    assert.ok(!x.lenh.includes(user), `${x.tool_use_id} còn tên người dùng`);
    assert.ok(!x.lenh.includes('/private/tmp/claude-'), `${x.tool_use_id} còn đường scratchpad`);
  }
});

test('DP6-03 nguon', async () => {
  const projects = path.join(os.homedir(), '.claude', 'projects');
  if (!fs.existsSync(projects)) {
    console.log('  bỏ qua: không có bản ghi hội thoại');
    return;
  }
  const a = await rut(projects);
  const b = await rut(projects);
  assert.equal(a, b, 'hai lần rút phải giống hệt');
  assert.equal(a, fs.readFileSync(TEP_CA, 'utf8'), 'tệp ca đã commit phải bằng đầu ra script');
  console.log(`  nguồn: ${DANH_SACH.length} lời gọi rút lại khớp tệp ca`);
});
```

- [ ] **Step 4: Thêm khoá executor**

Trong `_acceptance/config.yaml`, ngay dưới khoá `dieu_phoi_dp3`:

```yaml
    # Hồ sơ dieu-phoi-lop-mod: như `dieu_phoi_dp3` nhưng ghim cả «ok … DP4-|DP6-|DP7-».
    dieu_phoi_dp6: "bash -c 'set -o pipefail; node --test --test-reporter=tap \"tests/dieu-phoi/**/*.test.mjs\" 2>&1 | grep -E \"^ *(not )?ok [0-9]+ - DP[1-9]-|^ *not ok|^#   |^# (pass|fail|skipped|todo) \" | paste -sd\"|\" -'"
```

- [ ] **Step 5: Chạy và commit**

Run: `node --test tests/dieu-phoi/lop-mod.test.mjs`
Expected: `ok … DP6-03 tep-ca`, `ok … DP6-03 nguon`.

```bash
git add tests/dieu-phoi/rut-lenh-that.mjs tests/dieu-phoi/fixtures/lenh-that-2026-10-11.jsonl tests/dieu-phoi/lop-mod.test.mjs _acceptance/config.yaml
git commit -m "test(dieu-phoi-lop-mod): khung ca DP6, script rút chín lời gọi thật từ bản ghi (AC-3)"
```

**Phục vụ:** E3 (phần tệp ca, nguồn). **independent:** false (mọi task sau dùng khung này).

---

### Task 2: Bộ phân loại nhận vỏ bọc mang cờ (AC-1)

**Files:**
- Modify: `dieu-phoi/scripts/phan-loai-s4.mjs` (bảng `VO_BOC` thay `Set`, hàm `boVoBoc`)
- Test: `tests/dieu-phoi/lop-mod.test.mjs`

**Interfaces:**
- Produces: `export const VO_BOC` (`{ten: {giaTri: string[], viTri: number}}`), `phanLoaiLenh(lenh, bang?, sau?)` không đổi chữ ký.

- [ ] **Step 1: Viết ma trận và ca đỏ trước**

```js
const SCRIPT = [['repin-lane.mjs', 's4'], ['s4-args.mjs', 's4'], ['duong-nen.mjs', 'duong-nen']];
// 41 dạng của design §4 C1 — `<L>` là chỗ lệnh `node x/<script> --root .`
export const DANG_VO_BOC = [
  'timeout 900 <L>', 'timeout -s KILL 900 <L>', 'timeout --signal=KILL 900 <L>', 'timeout -k 10 900 <L>',
  'timeout --kill-after=10 900 <L>', 'timeout -f 900 <L>', 'timeout --foreground 900 <L>', 'timeout -p 900 <L>',
  'timeout --preserve-status 900 <L>', 'timeout -v 900 <L>',
  'env A=1 <L>', 'env -i A=1 <L>', 'env -0 A=1 <L>', 'env -u UV_PYTHON <L>', 'env --unset=UV_PYTHON <L>',
  'env -C /tmp <L>', 'env --chdir=/tmp <L>', 'env -P /opt/x <L>', 'env -v <L>', "env -S '<L>'", "env --split-string='<L>'",
  'nice <L>', 'nice -n 10 <L>', 'nice --adjustment=10 <L>',
  'time <L>', 'time -p <L>', 'nohup <L>', 'command <L>', 'command -p <L>',
  'exec <L>', 'exec -a ten <L>', 'exec -c <L>', 'exec -l <L>',
  'caffeinate <L>', 'caffeinate -d <L>', 'caffeinate -i <L>', 'caffeinate -m <L>', 'caffeinate -s <L>',
  'caffeinate -u <L>', 'caffeinate -t 3600 <L>', 'caffeinate -w 4242 <L>',
];
const LONG = ['nohup nice -n 5 timeout 900 <L>', 'env -u X caffeinate -i <L>'];
export function maTranVoBoc() {
  const o = [];
  for (const d of [...DANG_VO_BOC, ...LONG]) for (const [s, tn] of SCRIPT) o.push({ ten: `${d} × ${s}`, lenh: d.replace('<L>', `node x/${s} --root .`), ky_vong: tn });
  for (const x of docTepCa().filter((x) => x.nhan !== null)) o.push({ ten: `that:${x.tool_use_id}`, lenh: x.lenh, ky_vong: x.nhan });
  return o;
}
const chayMaTran = (phanLoaiLenh, ds) => ds.filter((o) => phanLoaiLenh(o.lenh) !== o.ky_vong).map((o) => o.ten);

test('DP6-01 vo-boc', async () => {
  assert.equal(DANG_VO_BOC.length, 41);
  const ds = maTranVoBoc();
  console.log(`  ma trận vỏ bọc: ${ds.length} ô`);
  assert.equal(ds.length, 128);
  const { phanLoaiLenh } = await nap(GOI, 'phan-loai-s4.mjs');
  assert.deepEqual(chayMaTran(phanLoaiLenh, ds), []);
});

test('DP6-01-do bo-timeout', async () => {
  const ds = maTranVoBoc();
  const { phanLoaiLenh: lanh } = await nap(GOI, 'phan-loai-s4.mjs');
  assert.deepEqual(chayMaTran(lanh, ds), [], 'bản lành phải xanh trước');
  const sao = saoGoi();
  tiem(sao, 'phan-loai-s4.mjs', "  timeout: {", '  _timeout_go: {');
  const { phanLoaiLenh } = await nap(sao, 'phan-loai-s4.mjs');
  const can = ds.filter((o) => /(^|\s)timeout\s/.test(o.lenh)).map((o) => o.ten);
  console.log(`  ô chứa timeout: ${can.length}`);
  assert.ok(can.length > 0 && can.length < ds.length);
  assert.deepEqual(chayMaTran(phanLoaiLenh, ds), can);
});

test('DP6-01-do caffeinate-t-tran', async () => {
  const ds = maTranVoBoc();
  const sao = saoGoi();
  tiem(sao, 'phan-loai-s4.mjs', "caffeinate: { giaTri: ['-t', '-w']", "caffeinate: { giaTri: ['-w']");
  const { phanLoaiLenh } = await nap(sao, 'phan-loai-s4.mjs');
  const can = ds.filter((o) => o.lenh.includes('caffeinate -t')).map((o) => o.ten);
  assert.ok(can.length > 0 && can.length < ds.length);
  assert.deepEqual(chayMaTran(phanLoaiLenh, ds), can);
});
```

Ca `DP6-01 hook-chan`: đợt dựng bằng `khoLienKet()`, ghi `khoa/s4/chu.json` `{phien:'P2', worktree:w2}`; với mỗi ô `s4` của ma trận, chạy hook thật (lệnh PreToolUse rút từ `hooks.json`) với stdin `{tool_name:'Bash', cwd:w1, tool_input:{command}}` → `ma === 2`; rồi đổi chủ khoá sang `{phien:'P1', worktree:w1}` → `ma === 0` cho cùng ô. Dùng helper:

```js
export function chayHookChanS4(dauVao, { cwd, gocGoi = GOI } = {}) {
  const r = spawnSync('sh', ['-c', lenhHook(gocGoi, 'PreToolUse')], { cwd, env: ENV, input: JSON.stringify({ cwd, ...dauVao }), encoding: 'utf8' });
  return { ma: r.status, err: r.stderr };
}
```

- [ ] **Step 2: Chạy, thấy đỏ**

Run: `node --test --test-name-pattern='DP6-01' tests/dieu-phoi/lop-mod.test.mjs`
Expected: `not ok … DP6-01 vo-boc` (các ô timeout/env -u/-C/-P/-S/nice -n/time -p/exec -a/caffeinate trả null).

- [ ] **Step 3: Sửa bộ phân loại**

Trong `dieu-phoi/scripts/phan-loai-s4.mjs` thay `const VO_BOC = new Set([...])` và vòng bỏ tiền tố trong `phanLoaiTu` bằng:

```js
// Vỏ bọc: lệnh đứng trước và chạy lệnh thật. `giaTri` = cờ ăn từ kế; `viTri` = số đối số vị trí bắt buộc
// trước lệnh thật (thời lượng của timeout). Nguồn: GNU coreutils timeout(1), nice(1); BSD caffeinate(8);
// builtin time, command, exec của bash (design DP6 §4 C1). Cờ dạng `--x=y` tự mang giá trị.
export const VO_BOC = {
  timeout: { giaTri: ['-s', '-k', '--signal', '--kill-after'], viTri: 1 },
  nice: { giaTri: ['-n', '--adjustment'], viTri: 0 },
  time: { giaTri: [], viTri: 0 },
  nohup: { giaTri: [], viTri: 0 },
  command: { giaTri: [], viTri: 0 },
  exec: { giaTri: ['-a'], viTri: 0 },
  caffeinate: { giaTri: ['-t', '-w'], viTri: 0 },
};
// env (GNU + BSD env(1)): cờ ăn từ kế; -S/--split-string tách chuỗi thành lệnh.
const ENV_GIA_TRI = new Set(['-u', '--unset', '-C', '--chdir', '-P']);
const ENV_TACH = new Set(['-S', '--split-string']);
const GAN = /^[A-Za-z_][A-Za-z0-9_]*=/;

// Bỏ tiền tố KEY=val và mọi vỏ bọc (kèm cờ, giá trị, đối số vị trí). Trả `{ i }` = vị trí lệnh thật, hoặc
// `{ tach, i }` khi gặp `env -S <chuỗi>` (phần sau i nối vào chuỗi rồi phân loại lại).
function boVoBoc(tu, i) {
  for (;;) {
    if (i >= tu.length) return { i };
    const t = tu[i];
    if (GAN.test(t)) { i++; continue; }
    if (t === 'env') {
      i++;
      while (i < tu.length) {
        const c = tu[i];
        if (ENV_TACH.has(c)) return { tach: tu[i + 1] ?? '', i: i + 2 };
        if (c.startsWith('--split-string=')) return { tach: c.slice('--split-string='.length), i: i + 1 };
        if (ENV_GIA_TRI.has(c)) { i += 2; continue; }
        if (c.startsWith('-') || GAN.test(c)) { i++; continue; }
        break;
      }
      continue;
    }
    const vb = VO_BOC[t];
    if (!vb) return { i };
    i++;
    while (i < tu.length && tu[i].startsWith('-') && tu[i] !== '-') i += !tu[i].includes('=') && vb.giaTri.includes(tu[i]) ? 2 : 1;
    i += vb.viTri;
  }
}
```

và đầu `phanLoaiTu`:

```js
function phanLoaiTu(tu, bang, sau) {
  const b = boVoBoc(tu, 0);
  if (b.tach !== undefined) return phanLoaiLenh([b.tach, ...tu.slice(b.i).map(nhayDon)].join(' '), bang, sau + 1);
  const i = b.i;
  if (i >= tu.length) return null;
  const dau = tu[i];
  // … phần còn lại giữ nguyên (SHELL, node, đường script)
```

với `const nhayDon = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;` đặt cạnh `tachDoan`.

- [ ] **Step 4: Chạy, thấy xanh; chạy lõi cũ**

Run: `node --test --test-name-pattern='DP6-01' tests/dieu-phoi/lop-mod.test.mjs && node --test tests/dieu-phoi/loi/hook-chan-s4.test.mjs tests/dieu-phoi/loi/bien.test.mjs`
Expected: mọi ca DP6-01 `ok`; lõi cũ xanh (lời chặn chưa đổi ở task này).

- [ ] **Step 5: Commit**

```bash
git add dieu-phoi/scripts/phan-loai-s4.mjs tests/dieu-phoi/lop-mod.test.mjs
git commit -m "fix(dieu-phoi-lop-mod): bộ phân loại S4 nhận vỏ bọc mang cờ — timeout, env -u/-C/-P/-S, nice -n, exec -a, caffeinate (AC-1)"
```

**Phục vụ:** E1. **independent:** false.

---

### Task 3: Thân heredoc là dữ liệu; cờ chỉ đọc của node; `--help` (AC-2, AC-3 phần lệch ở gốc)

**Files:**
- Modify: `dieu-phoi/scripts/phan-loai-s4.mjs` (`tachDoan` nhận heredoc; nhánh node bỏ `--check`/`-c`; `--help`)
- Test: `tests/dieu-phoi/lop-mod.test.mjs`

**Interfaces:**
- Produces: `tachDoan(lenh)` — cùng chữ ký; thân heredoc có nháy không sinh đoạn; thân không nháy chỉ sinh đoạn từ `$(…)` và backtick.

- [ ] **Step 1: Viết ma trận chỉ đọc + heredoc và ba ca đỏ**

```js
const HEREDOC = [
  ['nhay-don', (s) => `cat > a.txt <<'EOF'\nnode x/${s} --root .\nEOF`, false],
  ['nhay-kep', (s) => `python3 - <<"PY"\nnode x/${s} --root .\nPY`, false],
  ['tab', (s) => `cat <<-EOF\n\tnode x/${s} --root .\n\tEOF`, false],
  ['thieu-dong', (s) => `cat <<'EOF'\nnode x/${s} --root .`, false],
  ['khong-nhay-thay-lenh', (s) => `cat <<EOF\n$(node x/${s} --root .)\nEOF`, true],
];
export function maTranChiDoc() {
  const o = [];
  for (const [s, tn] of SCRIPT) {
    o.push({ ten: `--check × ${s}`, lenh: `node --check x/${s}`, ky_vong: null });
    o.push({ ten: `-c × ${s}`, lenh: `node -c x/${s}`, ky_vong: null });
    o.push({ ten: `--help × ${s}`, lenh: `node x/${s} --help`, ky_vong: null });
    for (const [h, f, chay] of HEREDOC) o.push({ ten: `heredoc:${h} × ${s}`, lenh: f(s), ky_vong: chay ? tn : null });
    o.push({ ten: `check-roi-chay × ${s}`, lenh: `node --check x/${s} && node x/${s} --write`, ky_vong: tn });
  }
  for (const x of docTepCa().filter((x) => x.nhan === null)) o.push({ ten: `that:${x.tool_use_id}`, lenh: x.lenh, ky_vong: null });
  for (const l of ['grep -n s4-args feature-loop/scripts/*.mjs', 'cat feature-loop/scripts/repin-lane.mjs', 'node --test tests/scripts/repin-lane-lop-cu.test.mjs', 'git grep repin-lane']) o.push({ ten: `am:${l}`, lenh: l, ky_vong: null });
  return o;
}
test('DP6-02 chi-doc-heredoc', async () => {
  const ds = maTranChiDoc();
  console.log(`  ma trận chỉ đọc + heredoc: ${ds.length} ô`);
  assert.equal(ds.length, 37);
  const { phanLoaiLenh } = await nap(GOI, 'phan-loai-s4.mjs');
  assert.deepEqual(chayMaTran(phanLoaiLenh, ds), []);
  // Review Focus: `<<` trong số học không phải heredoc.
  assert.equal(phanLoaiLenh('echo $((1<<2))\nnode x/repin-lane.mjs --write'), 's4');
});
```

Ba ca đỏ `DP6-02-do bo-check`, `DP6-02-do bo-heredoc`, `DP6-02-do bo-thay-lenh` theo khuôn `DP6-01-do bo-timeout`: bản lành xanh trước; `tiem(...)` gỡ đúng nhánh; tập ô kỳ vọng đỏ:
- `bo-check`: `ds.filter((o) => /node (--check|-c) /.test(o.lenh) && o.ky_vong === null)` (ô --check, -c và lời gọi thật «check»),
- `bo-heredoc`: `ds.filter((o) => (o.ten.startsWith('heredoc:') && o.ky_vong === null) || /heredoc/.test(hinhCua(o)))` với `hinhCua` đọc `hinh` của dòng tệp ca,
- `bo-thay-lenh`: `ds.filter((o) => o.ten.startsWith('heredoc:khong-nhay-thay-lenh'))`.
Kiểm `0 < can.length < ds.length` rồi `deepEqual`.

Ca `DP6-02 hook-im` (đợt có khoá của P2, cwd w1: mọi ô null → hook thoát 0, stderr rỗng; `node x/repin-lane.mjs` trần → thoát 2) và `DP6-02 tien-de-help`:

```js
test('DP6-02 tien-de-help', () => {
  for (const s of ['repin-lane.mjs', 's4-args.mjs', 'duong-nen.mjs']) {
    const kho = tam('dp6-help-');
    git(kho, 'init', '-q', '-b', 'main');
    git(kho, 'commit', '-q', '--allow-empty', '-m', 'goc');
    const truoc = bamCay(kho);
    const r = spawnSync(process.execPath, [path.join(KIT, 'feature-loop', 'scripts', s), '--root', kho, '--help'], { cwd: kho, env: ENV, encoding: 'utf8' });
    assert.notEqual(r.status, 0, s);
    assert.match(r.stderr, /cờ không nhận diện được/, s);
    assert.equal(bamCay(kho), truoc, `${s} đổi cây kho thử`);
  }
});
```

Và `DP6-03 lech-o-goc`:

```js
test('DP6-03 lech-o-goc', async () => {
  const ds = docTepCa();
  const { phanLoaiLenh: goc } = await nap(goiTaiMergeBase(), 'phan-loai-s4.mjs');
  const { phanLoaiLenh: moi } = await nap(GOI, 'phan-loai-s4.mjs');
  const saiOGoc = ds.filter((x) => goc(x.lenh) !== x.nhan).length;
  const dungBanMoi = ds.filter((x) => moi(x.lenh) === x.nhan).length;
  console.log(`  merge-base sai ${saiOGoc}/9 · bản mới đúng ${dungBanMoi}/9`);
  assert.equal(saiOGoc, 9);
  assert.equal(dungBanMoi, 9);
});
```

- [ ] **Step 2: Chạy, thấy đỏ**

Run: `node --test --test-name-pattern='DP6-0[23]' tests/dieu-phoi/lop-mod.test.mjs`
Expected: `not ok … DP6-02 chi-doc-heredoc`, `not ok … DP6-03 lech-o-goc`.

- [ ] **Step 3: Sửa `tachDoan` và nhánh node**

Trong vòng ký tự của `tachDoan`, ngoài nháy, trước nhánh tách `'&|;\n()'`:

```js
    if (c === '<' && lenh[i + 1] === '<' && lenh[i + 2] !== '<') {
      const m = /^<<(-?)[ \t]*(?:'([^']*)'|"([^"]*)"|([A-Za-z_][A-Za-z0-9_]*))/.exec(lenh.slice(i));
      if (m) {
        choHeredoc.push({ delim: m[2] ?? m[3] ?? m[4], nhay: m[4] === undefined, boTab: m[1] === '-' });
        i += m[0].length - 1;
        continue;
      }
    }
    if (c === '\n' && choHeredoc.length) {
      cat();
      i = docThanHeredoc(lenh, i + 1, choHeredoc, doan) - 1;
      choHeredoc = [];
      continue;
    }
```

và hàm:

```js
// Đọc thân của các heredoc đang chờ, bắt đầu ở `tu`; trả vị trí sau dòng đóng cuối. Thân có nháy là dữ liệu
// thuần; thân không nháy còn bị shell thay `$(…)` và backtick, nên chỉ các đoạn đó được tách thành lệnh.
function docThanHeredoc(lenh, tu, cho, doan) {
  let i = tu;
  for (const h of cho) {
    const than = [];
    while (i < lenh.length) {
      const het = lenh.indexOf('\n', i);
      const dong = lenh.slice(i, het === -1 ? lenh.length : het);
      i = het === -1 ? lenh.length : het + 1;
      if ((h.boTab ? dong.replace(/^\t+/, '') : dong) === h.delim) break;
      than.push(dong);
    }
    if (!h.nhay) for (const con of thayLenhTrong(than.join('\n'))) doan.push(...tachDoan(con));
  }
  return i;
}
function thayLenhTrong(s) {
  const ra = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '$' && s[i + 1] === '(' && s[i + 2] !== '(') {
      let sau = 1;
      let j = i + 2;
      for (; j < s.length && sau > 0; j++) if (s[j] === '(') sau++; else if (s[j] === ')') sau--;
      ra.push(s.slice(i + 2, j - 1));
      i = j - 1;
    } else if (s[i] === '`') {
      const j = s.indexOf('`', i + 1);
      if (j === -1) break;
      ra.push(s.slice(i + 1, j));
      i = j;
    }
  }
  return ra;
}
```

(`let choHeredoc = []` khai cạnh `let nhay = null`.) Trong nhánh node của `phanLoaiTu`, đầu vòng cờ: `if (t === '--check' || t === '-c') return null;`; sau khi có `script`: `if (tu.slice(j + 1).includes('--help')) return null;`; nhánh đường script trực tiếp: `return tu.slice(i + 1).includes('--help') ? null : tra(dau, bang);`.

- [ ] **Step 4: Chạy, thấy xanh**

Run: `node --test --test-name-pattern='DP6-0[123]' tests/dieu-phoi/lop-mod.test.mjs && node --test tests/dieu-phoi/loi/hook-chan-s4.test.mjs tests/dieu-phoi/dong-goi.test.mjs`
Expected: mọi DP6-01/02/03 `ok`; lõi + DP1 xanh.

- [ ] **Step 5: Commit**

```bash
git add dieu-phoi/scripts/phan-loai-s4.mjs tests/dieu-phoi/lop-mod.test.mjs
git commit -m "fix(dieu-phoi-lop-mod): thân heredoc là dữ liệu, node --check/-c và --help chỉ đọc (AC-2, AC-3)"
```

**Phục vụ:** E2, E3. **independent:** false.

---

### Task 4: Lời chặn nêu lệnh xin lượt (AC-4) + hai dòng assert của lõi

**Files:**
- Modify: `dieu-phoi/scripts/hook-chan-s4.mjs` (`quyet`)
- Modify: `tests/dieu-phoi/loi/hook-chan-s4.test.mjs:32` và `:114` (chỉ hai dòng ghim «Ghi đơn xin/»)
- Test: `tests/dieu-phoi/lop-mod.test.mjs`

**Interfaces:**
- Consumes: `phienCuaCwd(hangViec, cwd)` (`dot.mjs`), `docHangViec(thuMuc)` (`hinh-dang.mjs`), `nhayDon` (`hook-chan-s4.mjs`).
- Produces: stderr dạng `chan-s4: khoá <tn> <tình trạng>. Xin lượt: node <cli> xin <tn> — rồi chờ khoa/<tn>/chu.json ghi tên dãy <id>.` hoặc `chan-s4: khoá <tn> <tình trạng>. Phiên này không thuộc dãy nào của đợt — chỉ phiên thợ của một dãy xin được lượt (chạy từ worktree của dãy).`

- [ ] **Step 1: Viết ca**

`DP6-04 loi-chan`: `const cha = path.join(tam('dp6-'), 'kho $x'); fs.mkdirSync(cha);` rồi `khoLienKet({ duongCha: cha })`; `chayCli(kho, ['chay'])` rồi `chayCli(kho, ['dung'])` để có `<dot>/loi/`; ghi khoá s4 của P2; hook thật từ w1 với `{tool_name:'Bash', tool_input:{command:'node x/repin-lane.mjs --write'}}` → `ma 2`, stderr khớp `/^chan-s4: khoá s4 /`, có dòng chứa `xin s4` và đường `realpath(dot)/loi/dieu-phoi.mjs`, không chứa `Ghi đơn xin/`; từ `kho` → chứa `chỉ phiên thợ của một dãy`, không chứa ` xin s4`.
`DP6-04 round-trip`: rút lệnh `/Xin lượt: (.+?) — rồi/` từ stderr ca P1; `spawnSync('bash', ['-c', lenh], { cwd: w1 })` → `status 0`; `fs.readdirSync(path.join(dot,'xin'))` deepEqual `['P1-s4.json']`; `kiemDon(docJ(...))` không ném.
`DP6-04 khong-loi`: đợt chưa `chay` (không có `loi/`) → lệnh in ra trỏ `<gói>/scripts/dieu-phoi.mjs` và chạy được.
`DP6-04 hang-viec-hong`: xoá `hang-viec.json` của đợt → hook vẫn thoát 2, stderr chứa `chỉ phiên thợ của một dãy`.

- [ ] **Step 2: Chạy, thấy đỏ**

Run: `node --test --test-name-pattern='DP6-04' tests/dieu-phoi/lop-mod.test.mjs`
Expected: FAIL — stderr còn «Ghi đơn xin/».

- [ ] **Step 3: Sửa `quyet`**

```js
const DAY_GOI = path.dirname(fileURLToPath(import.meta.url));
function dayCuaCwd(thuMuc, cwd) {
  try {
    return phienCuaCwd(docHangViec(thuMuc), cwd);
  } catch {
    return null;
  }
}
function loiChan(thuMuc, taiNguyen, tinhTrang, cwd) {
  const dau = `chan-s4: khoá ${taiNguyen} ${tinhTrang}.`;
  const day = dayCuaCwd(thuMuc, cwd);
  if (!day) return `${dau} Phiên này không thuộc dãy nào của đợt — chỉ phiên thợ của một dãy xin được lượt (chạy từ worktree của dãy).`;
  const loiDot = path.join(thuMuc, 'loi', 'dieu-phoi.mjs');
  const cli = fs.existsSync(loiDot) ? loiDot : path.join(DAY_GOI, 'dieu-phoi.mjs');
  return `${dau} Xin lượt: node ${nhayDon(cli)} xin ${taiNguyen} — rồi chờ khoa/${taiNguyen}/chu.json ghi tên dãy ${day}.`;
}
```

và trong `quyet` thay khối `return { ma: 2, loi: ... Ghi đơn ... }` bằng `return { ma: 2, loi: loiChan(thuMuc, taiNguyen, tinhTrang, dauVao.cwd) };`. Import `phienCuaCwd` từ `./dot.mjs`, `docHangViec` từ `./hinh-dang.mjs`.

- [ ] **Step 4: Sửa đúng hai dòng của lõi**

`tests/dieu-phoi/loi/hook-chan-s4.test.mjs` dòng 32 và 114: `Ghi đơn xin\/<phiên>-s4\.json/` → `Phiên này không thuộc dãy nào của đợt — chỉ phiên thợ của một dãy xin được lượt/` (hai ca ấy dựng đợt không có `hang-viec.json`). Không dòng nào khác của `loi/` đổi.

- [ ] **Step 5: Chạy, commit**

Run: `node --test --test-name-pattern='DP6-04' tests/dieu-phoi/lop-mod.test.mjs && node --test tests/dieu-phoi/loi/ tests/dieu-phoi/dong-goi.test.mjs && git diff --stat origin/main -- tests/dieu-phoi/loi/`
Expected: xanh; diff chỉ `loi/hook-chan-s4.test.mjs | 4 ++--`.

```bash
git add dieu-phoi/scripts/hook-chan-s4.mjs tests/dieu-phoi/loi/hook-chan-s4.test.mjs tests/dieu-phoi/lop-mod.test.mjs
git commit -m "fix(dieu-phoi-lop-mod): lời chặn S4 nêu lệnh xin lượt chạy được, không dặn viết tay xin/ (AC-4)"
```

**Phục vụ:** E4, E7 (phần `loi/`). **independent:** false.

---

### Task 5: Hộp xin quyền luôn thành việc chờ người (AC-5)

**Files:**
- Modify: `dieu-phoi/scripts/hook-cho-nguoi.mjs` (`xuLyChoNguoi`)
- Test: `tests/dieu-phoi/lop-mod.test.mjs`

- [ ] **Step 1: Viết ma trận 6 hàng + ca đỏ**

```js
const MA_TRAN_CHO = [
  ['permission_prompt', 'khong', true], ['permission_prompt', 'don', true], ['permission_prompt', 'yeu-cau', true],
  ['idle_prompt', 'khong', true], ['idle_prompt', 'don', false], ['idle_prompt', 'yeu-cau', false],
];
async function chayMaTranCho(gocGoi = GOI) {
  const sai = [];
  for (const [loai, trangThai, canGhi] of MA_TRAN_CHO) {
    const { dot, w1 } = khoLienKet({ gocGoi });
    if (trangThai === 'don') ghiJ(path.join(dot, 'xin', 'P1-s4.json'), { phien: 'P1', slug: 'hang-a', loai: 's4', luc: new Date().toISOString(), worktree: w1 });
    if (trangThai === 'yeu-cau') ghiJ(path.join(dot, 'yeu-cau', 'P1-1.json'), { phien: 'P1', loai: 'cham-tep', hang: null, noi_dung: { tep: ['a'] }, luc: new Date().toISOString() });
    const r = spawnSync('sh', ['-c', lenhHook(gocGoi, 'Notification')], { cwd: w1, env: ENV, input: JSON.stringify({ cwd: w1, hook_event_name: 'Notification', notification_type: loai, message: 'chờ' }), encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    if (fs.existsSync(path.join(dot, 'cho-nguoi', 'P1.json')) !== canGhi) sai.push(`(${loai}, ${trangThai})`);
  }
  return sai;
}
test('DP6-05 ma-tran', async () => {
  console.log(`  ma trận chờ người: ${MA_TRAN_CHO.length} hàng`);
  assert.equal(MA_TRAN_CHO.length, 6);
  assert.deepEqual(await chayMaTranCho(), []);
});
test('DP6-05-do tra-som', async () => {
  assert.deepEqual(await chayMaTranCho(), [], 'bản lành phải xanh trước');
  const sao = saoGoi();
  tiem(sao, 'hook-cho-nguoi.mjs', "if (dauVao.notification_type !== 'permission_prompt') {", 'if (true) {');
  assert.deepEqual(await chayMaTranCho(sao), ['(permission_prompt, don)', '(permission_prompt, yeu-cau)']);
});
```

- [ ] **Step 2: Chạy, thấy đỏ** — Run: `node --test --test-name-pattern='DP6-05' tests/dieu-phoi/lop-mod.test.mjs` · Expected: `not ok … DP6-05 ma-tran` nêu hai hàng permission. (Ca đỏ `tra-som` cũng đỏ vì bước tiêm chưa áp được — đúng.)

- [ ] **Step 3: Sửa**

```js
  if (dauVao.hook_event_name !== 'Notification' || !LOAI_CHO.has(dauVao.notification_type)) return 'bo-qua';
  // Hộp xin quyền luôn cần người, kể cả khi dãy đang chờ lượt hay chờ trả lời (lệnh nền chờ khoá cũng có thể
  // bật hộp). Thông báo rảnh thì im khi dãy đang chờ — rảnh lúc đó là đúng.
  if (dauVao.notification_type !== 'permission_prompt') {
    if (coTepBatDau(thuMuc, 'xin', `${phien}-`).length > 0) return 'cho-luot';
    const chuaTraLoi = coTepBatDau(thuMuc, 'yeu-cau', `${phien}-`).some((f) => !fs.existsSync(path.join(thuMuc, 'tra-loi', f)));
    if (chuaTraLoi) return 'cho-tra-loi';
  }
```

- [ ] **Step 4: Chạy** — `node --test --test-name-pattern='DP6-05' tests/dieu-phoi/lop-mod.test.mjs && node --test tests/dieu-phoi/loi/hook-nhip-cho-nguoi.test.mjs` · Expected: xanh.

- [ ] **Step 5: Commit** — `git add dieu-phoi/scripts/hook-cho-nguoi.mjs tests/dieu-phoi/lop-mod.test.mjs && git commit -m "fix(dieu-phoi-lop-mod): hộp xin quyền luôn thành việc chờ người, kể cả khi dãy chờ lượt (AC-5)"`

**Phục vụ:** E5. **independent:** false.

---

### Task 6: Sự kiện `cho-nguoi` mang `can_phan` — Monitor thức (AC-6)

**Files:**
- Modify: `dieu-phoi/scripts/phat-lich.mjs` (`suKienDem`)
- Test: `tests/dieu-phoi/lop-mod.test.mjs`

**Interfaces:**
- Produces: dòng `su-kien.jsonl` `{loai:'cho-nguoi', phien, hang, can_phan:true, loai_cho, tin}` (tin ≤ 200 ký tự).

- [ ] **Step 1: Viết ca**

```js
// Bộ lọc Monitor rút nguyên văn từ thân lệnh người — không chép tay.
export function boLocMonitor(gocGoi = GOI) {
  const ra = [];
  for (const tep of ['mo-dot.md', 'tiep-tuc.md']) {
    const t = fs.readFileSync(path.join(gocGoi, 'commands', tep), 'utf8');
    for (const m of t.matchAll(/tail -n0 -F [^|`]*\| grep --line-buffered '([^']+)'/g)) ra.push({ tep, mau: m[1] });
  }
  return ra;
}
const khopGrep = (mau, dong) => spawnSync('grep', ['--line-buffered', mau], { input: `${dong}\n`, encoding: 'utf8' }).status === 0;
```

`DP6-06 round-trip`: `khoLienKet()`; hook thật Notification permission_prompt từ w1 với `message: 'x'.repeat(300)`; `await motNhipThat(dot)` hai lần; `const dong = fs.readFileSync(path.join(dot,'su-kien.jsonl'),'utf8').split('\n').filter((d) => d.includes('"loai":"cho-nguoi"'))`; `assert.equal(dong.length, 1)`; `const e = JSON.parse(dong[0])`; `assert.equal(e.can_phan, true)`, `e.phien === 'P1'`, `e.loai_cho === 'permission_prompt'`, `e.tin.length <= 200`; `const bl = boLocMonitor(); assert.equal(bl.length, 2)`; mỗi `bl` → `khopGrep(mau, dong[0])` true, sai thì `assert.fail(`bộ lọc Monitor không khớp: ${tep}`)`; `viecCho(dot)` (nạp `viec-cho.mjs`) lọc `loai === 'cho-nguoi'` → đúng 1 mục id `P1`.
`DP6-06 nang-cap`: `const goc = goiTaiMergeBase(); const { dot, w2 } = khoLienKet({ gocGoi: goc })`; hook Notification CỦA merge-base ghi `cho-nguoi/P2.json` từ w2; `await motNhipThat(dot, goc)` (bản cũ báo tệp ấy, không `can_phan`); đếm dòng `cho-nguoi` = n0, đọc `trang-thai.json`.`nhip_cuoi` = t0; `await motNhipThat(dot)` (bản mới) → không ném, `nhip_cuoi` > t0, số dòng `cho-nguoi` vẫn = n0 (tệp đã báo không báo lại); rồi xoá `cho-nguoi/P2.json`, hook THẬT bản mới ghi lại (lúc mới → khoá `phien|luc` mới), một nhịp bản mới → đúng n0 + 1 dòng, dòng mới mang `can_phan: true`, `phien: 'P2'` (đối chứng dương trên cùng đợt).
`DP6-06-do bo-can-phan`: bản sao `tiem(sao, 'phat-lich.mjs', 'can_phan: true, loai_cho', 'loai_cho')`; chạy round-trip với `gocGoi: sao` → hàm kiểm trả `bộ lọc Monitor không khớp: mo-dot.md`.

- [ ] **Step 2: Chạy, thấy đỏ** — `node --test --test-name-pattern='DP6-06' tests/dieu-phoi/lop-mod.test.mjs` · FAIL: `can_phan` undefined.

- [ ] **Step 3: Sửa `suKienDem`**

```js
    if (!choCu.has(khoa) && !choIm) {
      ghiSuKien(thuMuc, {
        loai: 'cho-nguoi',
        phien: c.phien,
        hang: hangCua.get(c.phien) ?? null,
        // Thợ chờ người là việc của giám sát: Monitor lọc can_phan (DP6 AC-6).
        can_phan: true,
        loai_cho: c.loai ?? null,
        tin: String(c.tin ?? '').slice(0, 200),
      });
    }
```

- [ ] **Step 4: Chạy** — `node --test --test-name-pattern='DP6-06' tests/dieu-phoi/lop-mod.test.mjs && node --test tests/dieu-phoi/loi/phat-lich.test.mjs tests/dieu-phoi/mo-dot.test.mjs tests/dieu-phoi/tiep-tuc.test.mjs` · Expected: xanh.

- [ ] **Step 5: Commit** — `git add dieu-phoi/scripts/phat-lich.mjs tests/dieu-phoi/lop-mod.test.mjs && git commit -m "fix(dieu-phoi-lop-mod): sự kiện cho-nguoi mang can_phan để Monitor giám sát thức (AC-6)"`

**Phục vụ:** E6. **independent:** false.

---

### Task 7: Không vỡ hàng trước, kho không đợt im (AC-7)

**Files:**
- Test: `tests/dieu-phoi/lop-mod.test.mjs`

- [ ] **Step 1: Viết ca**

`DP6-07 ten-ca-cu`: merge-base = `git merge-base HEAD origin/main`; tập A = tên ca `DP[1-9]-…` khai trong mọi `tests/dieu-phoi/**/*.test.mjs` ở merge-base (`git ls-tree -r --name-only <mb> tests/dieu-phoi` + `git show <mb>:<tệp>`, regex `/test\(['"`](DP[1-9]-[^'"`]+)/g`); tập B = cùng phép rút trên cây hiện tại; `assert.deepEqual([...A].filter((x) => !B.has(x)), [])`, in |A|. Không chạy `node --test` lồng (bẫy đã đo: tiến trình lồng không in TAP); việc mọi ca ấy XANH do lệnh suite `dieu_phoi_dp6` chứng ở dòng gộp (`# fail 0`, mỗi tên có `ok`) — verifier E7 đọc dòng đó.
`DP6-07 loi-nguyen`: `git diff --numstat <mb> -- tests/dieu-phoi/loi/` → đúng một dòng cho `loi/hook-chan-s4.test.mjs`; dòng xoá (từ `git diff -U0`) BẰNG tập dòng của tệp ấy ở mb chứa `Ghi đơn xin/` (rút bằng `git show <mb>:tests/dieu-phoi/loi/hook-chan-s4.test.mjs`, kiểm > 0); số dòng thêm = số dòng xoá; mỗi dòng thêm chứa ` xin s4` hoặc `chỉ phiên thợ của một dãy`.
`DP6-07 khong-dot`: kho thử không đợt → hook PreToolUse với `node x/repin-lane.mjs --write` và hook Notification permission_prompt → thoát 0, stderr rỗng, `bamCay` trước == sau; đối chứng: `khoLienKet()` có khoá P2 → hook PreToolUse từ w1 thoát 2.

- [ ] **Step 2: Chạy** — `node --test --test-name-pattern='DP6-07' tests/dieu-phoi/lop-mod.test.mjs` · Expected: xanh (code đã xong ở Task 2–6; đây là lưới).

- [ ] **Step 3: Chạy trọn bộ suite_keys của kho + khoá DP6**

Run: lần lượt các lệnh của `feature_loop.suite_keys` trong `_acceptance/config.yaml` (đọc khoá rồi chạy — không gõ tay danh sách), rồi `config:executors.test.dieu_phoi_dp6`, `node scripts/product-map.mjs --root . --check`.
Expected: mọi lệnh thoát 0; dòng gộp DP6 có `# fail 0`.

- [ ] **Step 4: Commit** — `git add tests/dieu-phoi/lop-mod.test.mjs && git commit -m "test(dieu-phoi-lop-mod): lưới không vỡ DP1–DP7, lõi chỉ đổi hai dòng, kho không đợt im (AC-7)"`

**Phục vụ:** E7. **independent:** false.

---

### Task 8: Tài liệu (AC-8)

**Files:**
- Modify: `dieu-phoi/README.md` (mục mới «Chặn S4 và việc chờ người»)
- Modify: `docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md` §12.2 (hai dòng «Chặn S4», «Tự bắt việc chờ người»)

- [ ] **Step 1: README** — mục mới, ba đoạn: (1) hook chặn S4 nhận vỏ bọc mang cờ (liệt tám vỏ bọc), bỏ qua thân heredoc, `node --check`/`-c`, `--help`; lời chặn nêu lệnh `xin` của lõi đợt (hoặc lõi gói khi đợt chưa `chay`); (2) hộp xin quyền luôn thành tệp chờ người, sự kiện `cho-nguoi` mang `can_phan` nên Monitor của giám sát thức trong một nhịp; (3) «Giới hạn đã khai»: chép ba giới hạn của design §6 kèm ngưỡng, nguyên chữ «chưa đo: hộp quyền của tác tử Workflow có tới hook chờ người không».
- [ ] **Step 2: Spec §12.2** — dòng «Chặn S4»: cột «Mod làm gì» thêm câu «DP6 (11/10): không mod nào chặn S4 — hook giữ vai, bộ phân loại sửa theo số đo; xem `2026-10-11-dieu-phoi-lop-mod-design.md` §3»; dòng «Tự bắt việc chờ người»: thêm «DP6 (11/10): sửa ở lõi Node (`hook-cho-nguoi`, sự kiện `cho-nguoi` mang `can_phan`); phần mod và đo sống ở `docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md`»; dòng «Khung trạng thái đợt»: thêm con trỏ tới hạt giống.
- [ ] **Step 3: Kiểm** — `grep -n "chưa đo: hộp quyền của tác tử Workflow" dieu-phoi/README.md && grep -n "2026-10-11-dieu-phoi-lop-mod-design" docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md && grep -n '^Gốc: `_acceptance/dieu-phoi-lop-mod/`' docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md` · Expected: ba dòng khớp.
- [ ] **Step 4: Commit** — `git add dieu-phoi/README.md docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md && git commit -m "docs(dieu-phoi-lop-mod): README chặn S4 và chờ người, spec §12.2 khớp thiết kế DP6 (AC-8)"`

**Phục vụ:** E8. **independent:** false.

---

## Sau S3

Contract `status: implemented` → xin lượt S4 ở Điều phối → `s4-args.mjs --slug dieu-phoi-lop-mod --root . --ag-root .`. Trước PR: `pre-merge-check.sh --base origin/main` liệt hồ sơ đã ký bị hoá cũ bởi các tệp lõi đã sửa (DP1, DP2, DP3, có thể DP7) — ghim lại bằng MỘT làn (xin lượt), như #295/#303.
