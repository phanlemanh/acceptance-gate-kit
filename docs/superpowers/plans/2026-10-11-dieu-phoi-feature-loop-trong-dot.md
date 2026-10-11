# Phiên thợ biết mình đang trong đợt (DP7) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** feature-loop nhận biết đợt bằng một lệnh chỉ đọc; trong đợt, chờ lượt S4 không thành câu hỏi, xong hàng thì tự mở hàng kế, quyền merge theo thẻ khởi tạo; kho không đợt không đổi byte nào.

**Architecture:** Gói `dieu-phoi` thêm lệnh con chỉ đọc `tho` (mô-đun `tho.mjs`) dựng ngữ cảnh thợ từ thư mục đợt; `feature-loop/scripts/trong-dot.mjs` dò symlink đợt rồi gọi `tho` của bản lõi trong thư mục đợt. Một khối marker `TRONG-DOT` trong SKILL feature-loop đọc JSON đó. Ba sửa lõi đi kèm: `tu_merge` trong `dieu-khien.json`, tập «đã thông» của `tienDoCua`, danh sách chờ người gồm yêu cầu `can-nguoi`.

**Tech Stack:** Node ≥ 20 ESM (`.mjs`), `node:test`, git CLI.

**Spec:** `docs/superpowers/specs/2026-10-11-dieu-phoi-feature-loop-trong-dot-design.md` · hợp đồng `_acceptance/dieu-phoi-feature-loop-trong-dot/contract.md` · evals `_acceptance/dieu-phoi-feature-loop-trong-dot/evals.yaml`.

## Global Constraints

- Kho không đợt: `trong-dot.mjs` thoát 0, stdout + stderr rỗng, không ghi byte nào (AC-1a, AC-9).
- Không sửa thân ca nào trong `tests/dieu-phoi/dong-goi.test.mjs`, `tests/dieu-phoi/mo-dot.test.mjs`, `tests/dieu-phoi/loi/**` (AC-10).
- Không chép mã DP3 (`ghi.mjs`, `song.mjs`); chỉ dùng `ghiYeuCau` nếu tệp `ghi.mjs` có trong gói lúc chạy ca (AC-7).
- Mọi khối marker khác của SKILL feature-loop byte-bằng merge-base (AC-9); `dieu-phoi/hooks/hooks.json` không đổi.
- Tên ca bắt đầu `DP7-`; mỗi phép đo mới có cặp hai chiều trên cùng fixture, ghim thông điệp (MEASURE-BIRTH-CLAUSE).
- Đường trong test suy từ vị trí tệp test; kho thử trong `os.tmpdir()`, NGOÀI cây kit.

## Review Focus

1. Worktree của dãy là `git worktree add` thật (không phải thư mục con) — gốc kho chính phải giải bằng `--git-common-dir` (ca DP7-01 ba hình dạng).
2. Hàng kế không mang `ma` (hàng phát sinh) — phải ra `mo-hang`, không `bao-giam-sat` (ca DP7-03 khong-ma).
3. `tu_merge` sống qua `tam-dung → dang-chay` không cờ (ca DP7-05 co).
4. `tho` chạy từ bản lõi `loi/` — mọi import của `tho.mjs` phải là tệp `.mjs` cùng thư mục (`chepLoi` chỉ chép `*.mjs` + `mau/`) (ca DP7-01 tho chạy bản `loi/`).
5. Lời chặn S4 cũ giữ nguyên tiền tố — ca DP1 ghim `^chan-s4: khoá s4 đang …` (ca DP7-06 + DP1 xanh).

---

### Task 1: `tho.mjs` + lệnh con `tho` (AC-2, AC-3)

**Files:**
- Create: `dieu-phoi/scripts/tho.mjs`
- Modify: `dieu-phoi/scripts/dieu-phoi.mjs` (bảng lệnh con, dòng «dùng:»)
- Test: `tests/dieu-phoi/trong-dot.test.mjs` (tạo mới)

**Interfaces:**
- Produces: `export const VIEC_KE = ['mo-hang', 'cho-nhip', 'bao-giam-sat', 'cho', 'xong']`; `export function ngucanhTho(cwd, { slug = null } = {})` → `{trong_dot:false, ly_do:'khong-dot'|'khong-phai-tho'}` hoặc `{trong_dot:true, dot, thu_muc, day, luat, pha, tu_merge, hang_ke:{slug, moi, quyet}, viec_ke, ly_do?}`. CLI: `dieu-phoi.mjs tho [--slug <s>] [--json]` in `JSON.stringify(kq)` (một dòng), thoát 0.

- [ ] **Step 1: Viết ca đỏ** `DP7-02 khoa-du`, `DP7-02 ngoai-day`, `DP7-02 khong-dot`, `DP7-02-do ghi`, `DP7-03 ma-tran` (14 hàng), `DP7-03 tap-viec-ke`, `DP7-03-do bo-quyet`, `DP7-03-do chi-chan-park` trong `tests/dieu-phoi/trong-dot.test.mjs`. Bộ dựng: `khoThu`, `goiThu` (hai dãy, worktree thư mục tạm), `khaiGoi`, `chayCli(kho, ['mo','thu'])`, `datPha(dot,'dang-chay')`, một nhịp `taoVong(dot, ioGia(gio))()` — chép khuôn từ `mo-dot.test.mjs` (không import tệp ca DP2, vì nó chạy ca của nó khi import).
- [ ] **Step 2: Chạy** `node --test tests/dieu-phoi/trong-dot.test.mjs` → FAIL «Cannot find module …/tho.mjs».
- [ ] **Step 3: Viết `tho.mjs`:**

```js
// Ngữ cảnh phiên thợ trong đợt (DP7, spec workflow §16 T7) — CHỈ ĐỌC. Bên đọc của tiep/<dãy>.json (bộ
// phát lịch viết), dieu-khien.json (pha viết) và ô/hồ sơ của hàng kế (trangThaiQuyet — một nguồn với thẻ).
import path from 'node:path';
import { docJson, gocKhoChinh, phienCuaCwd, timThuMucDot } from './dot.mjs';
import { docHangViec } from './hinh-dang.mjs';
import { docPha } from './pha.mjs';
import { trangThaiQuyet } from './the.mjs';

export const VIEC_KE = ['mo-hang', 'cho-nhip', 'bao-giam-sat', 'cho', 'xong'];

function quyetCua(gocKho, day, hang) {
  if (!hang.ma) return { tt: 'da-quyet', nguon: 'phat-sinh' };
  const trongDay = trangThaiQuyet(day.worktree, hang.slug);
  if (trongDay.tt === 'da-quyet') return trongDay;
  const chinh = trangThaiQuyet(gocKho, hang.slug);
  return chinh.tt === 'cho' && trongDay.tt !== 'cho' ? trongDay : chinh;
}

export function ngucanhTho(cwd, { slug = null } = {}) {
  const thuMuc = timThuMucDot(cwd);
  if (!thuMuc) return { trong_dot: false, ly_do: 'khong-dot' };
  const hv = docHangViec(thuMuc);
  const id = phienCuaCwd(hv, cwd);
  if (!id) return { trong_dot: false, ly_do: 'khong-phai-tho' };
  const day = hv.day.find((d) => d.id === id);
  const dk = docPha(thuMuc);
  const tiep = docJson(path.join(thuMuc, 'tiep', `${id}.json`), null);
  const kq = {
    trong_dot: true,
    dot: hv.dot,
    thu_muc: thuMuc,
    day: id,
    luat: path.join(thuMuc, 'LUAT.md'),
    pha: dk.pha,
    tu_merge: typeof dk.tu_merge === 'boolean' ? dk.tu_merge : null,
    hang_ke: { slug: tiep?.hang ?? null, moi: tiep?.moi ?? null, quyet: null },
  };
  const ra = (viec_ke, ly_do) => ({ ...kq, viec_ke, ...(ly_do ? { ly_do } : {}) });
  if (dk.pha !== 'dang-chay') return ra('cho', `pha ${dk.pha}`);
  if (!tiep) return ra('cho-nhip', 'bộ phát lịch chưa ghi hàng kế cho dãy');
  if (!tiep.hang) return tiep.xong ? ra('xong') : ra('cho', tiep.cho ?? 'chờ');
  if (slug && tiep.hang === slug) return ra('cho-nhip', `nhịp chưa thấy ${slug} xong`);
  const hang = hv.hang.find((h) => h.slug === tiep.hang) ?? { slug: tiep.hang };
  const q = quyetCua(gocKhoChinh(cwd), day, hang);
  kq.hang_ke.quyet = q.tt;
  if (q.tt === 'da-quyet') return ra('mo-hang');
  return ra('bao-giam-sat', q.tt === 'khong-build' ? `${hang.slug}: ô đã quyết «${q.decision}»` : `${hang.slug}: chưa có quyết build`);
}
```

- [ ] **Step 4: Nối lệnh con** trong `dieu-phoi.mjs`: `import { ngucanhTho } from './tho.mjs';` và mục `tho: () => JSON.stringify(ngucanhTho(cwd, { slug: typeof co.slug === 'string' ? co.slug : null })),` ; thêm `|tho [--slug <s>] [--json]` vào dòng «dùng:». `tho` KHÔNG đi qua `thuMucHienTai` (kho không đợt phải ra JSON `khong-dot`, thoát 0).
- [ ] **Step 5: Chạy** ca → PASS; chạy cả `node --test "tests/dieu-phoi/**/*.test.mjs"` → `# fail 0`.
- [ ] **Step 6: Commit** `dieu-phoi: lệnh tho — ngữ cảnh phiên thợ trong đợt (DP7 AC-2, AC-3)`.

Verify: `node --test tests/dieu-phoi/trong-dot.test.mjs` · phục vụ E2, E3 · `independent: false` (cùng tệp ca với mọi task).

### Task 2: `tu_merge` (AC-5)

**Files:** Modify `dieu-phoi/scripts/pha.mjs`, `dieu-phoi/scripts/dieu-phoi.mjs` (mục `pha`), `dieu-phoi/commands/mo-dot.md` (bước 5). Test: `tests/dieu-phoi/trong-dot.test.mjs`.

**Interfaces:** `datPha(thuMuc, sang, { boi, lyDo, tuMerge })` — `tuMerge` ∈ `true|false|undefined`; khác `undefined` mà `sang !== 'dang-chay'` → ném `pha: --tu-merge chỉ đặt khi chuyển sang dang-chay`. Mọi lần ghi giữ `tu_merge` cũ khi không truyền. CLI: `--tu-merge co|khong`; giá trị khác → ném `pha: --tu-merge «<v>» không hợp lệ (co|khong)`.

- [ ] **Step 1: Ca đỏ** `DP7-05 co`, `DP7-05 khong`, `DP7-05 vang`, `DP7-05-do gia-tri-sai`, `DP7-05-do sai-pha`, `DP7-05 mo-dot-md`.
- [ ] **Step 2: Chạy** → FAIL.
- [ ] **Step 3: Sửa `datPha`:** thêm tham số `tuMerge`; kiểm như Interfaces TRƯỚC khi đọc/ghi; bản ghi mới mang `...(tuMerge !== undefined ? { tu_merge: tuMerge } : cu.tu_merge !== undefined ? { tu_merge: cu.tu_merge } : {})`. Cùng pha (`doi:false`) mà có `tuMerge` khác giá trị đang có → vẫn ghi trường (không thêm `lich_su`). Trong `dieu-phoi.mjs` mục `pha`: dịch `co`→`true`, `khong`→`false`, vắng→`undefined`, khác→ném.
- [ ] **Step 4: `mo-dot.md` bước 5:** `pha dang-chay --boi <tên người duyệt> --tu-merge <co|khong theo chữ người gõ> --ly-do "<chữ duyệt nguyên văn>"` kèm một câu: «không có chữ người về quyền tự merge thì bỏ cờ — thợ đọc là không tự merge».
- [ ] **Step 5: Chạy** ca DP7-05 + toàn suite `tests/dieu-phoi` → `# fail 0`.
- [ ] **Step 6: Commit** `dieu-phoi: pha ghi tu_merge theo thẻ khởi tạo (DP7 AC-5)`.

Verify: như trên · phục vụ E5 · `independent: false`.

### Task 3: tập «đã thông» của `tienDoCua` (AC-4)

**Files:** Modify `dieu-phoi/scripts/phat-lich.mjs` (`tienDoCua`, hằng mới). Test: `trong-dot.test.mjs`.

**Interfaces:** `export const DA_THONG = ['signed-off', 'machine-cleared', 'da-cham-boi-thuc-te'];` — nhánh chính: `DA_THONG.includes(st)` → `gop`; worktree: → `ky`.

- [ ] **Step 1: Ca đỏ** `DP7-04 ma-tran-trang-thai` (lặp mọi phần tử enum `status` rút từ `lib/workspace-record.cjs` bằng `createRequire`), `DP7-04 nhanh-chinh` (io giả trả `status: machine-cleared` cho `git show`), `DP7-04 tap-kit`, `DP7-04-do bo-machine-cleared` (bản sao gói, gỡ `'machine-cleared', ` khỏi `DA_THONG`).
- [ ] **Step 2: Chạy** → FAIL ở `machine-cleared`.
- [ ] **Step 3: Sửa** `tienDoCua`: `if (DA_THONG.includes(trenNhanhChinh))` → `gop`; worktree `DA_THONG.includes(st) ? 'ky' : 'dang'`; thêm chú thích một dòng trỏ hạt giống lõi crm mục 4.
- [ ] **Step 4: Chạy** → PASS + toàn suite.
- [ ] **Step 5: Commit** `dieu-phoi: tiến độ hàng coi machine-cleared và da-cham-boi-thuc-te là đã thông (DP7 AC-4)`.

Verify: như trên · phục vụ E4 · `independent: false`.

### Task 4: chờ người một danh sách (AC-7)

**Files:** Modify `dieu-phoi/scripts/phat-lich.mjs` (chỗ dựng `choNguoi` trong `motNhip`). Test: `trong-dot.test.mjs`.

**Interfaces:** `choNguoi` = mục từ `cho-nguoi/` ∪ `{phien, loai:'can-nguoi', tin, luc, link}` cho mỗi `yeu-cau/*.json` hợp khuôn có `loai === 'can-nguoi'` mà chưa có `tra-loi/<tên>.json`. `tin` = `noi_dung.cau_hoi` nếu là chuỗi, không thì `JSON.stringify(noi_dung ?? {})`. Đọc yêu cầu KHÔNG đi qua `docThuMucJson` (hàm đó chuyển tệp hỏng vào `hong/` — xuLyYeuCau đã làm việc đó trong cùng nhịp); đọc bằng `docJson` trong try, bỏ qua tệp không đọc được.

- [ ] **Step 1: Ca đỏ** `DP7-07 luat-co-loai`, `DP7-07 mot-danh-sach`, `DP7-07 nhip-hai`, `DP7-07 tra-loi`, `DP7-07-do chi-tep`. Yêu cầu ghi bằng `ghiYeuCau` của `ghi.mjs` khi tệp có; không có thì rút tên trường từ dòng chứa `yeu-cau/<phiên>-<số>.json` của LUAT.md (`{phien, loai, hang, noi_dung, luc}`) — rút rỗng → `assert.fail('LUAT.md không có khuôn yêu cầu')`.
- [ ] **Step 2: Chạy** → FAIL (cho_nguoi 1 mục).
- [ ] **Step 3: Sửa** chỗ dựng `choNguoi` như Interfaces.
- [ ] **Step 4: Chạy** → PASS + toàn suite (DP2-12, DP2-13 dùng `cho_nguoi`).
- [ ] **Step 5: Commit** `dieu-phoi: yêu cầu can-nguoi chưa trả lời lên danh sách chờ người (DP7 AC-7)`.

Verify: như trên · phục vụ E7 · `independent: false`.

### Task 5: lời chặn S4 trong dãy (AC-6)

**Files:** Modify `dieu-phoi/scripts/hook-chan-s4.mjs` (`quyet`). Test: `trong-dot.test.mjs`.

**Interfaces:** sau chuỗi cũ, khi `phienCuaCwd(docHangViec(thuMuc), dauVao.cwd)` ra `id`: nối ` Trong đợt đây là CHỜ LƯỢT của dãy ${id}, không phải lỗi: không hỏi người, không chấm lại — xin lượt theo mục «Cách xin tài nguyên» của ${path.join(thuMuc, 'LUAT.md')}.`

- [ ] **Step 1: Ca đỏ** `DP7-06 trong-day` (tiền tố == chuỗi bản base rút bằng `git show <merge-base>:dieu-phoi/scripts/hook-chan-s4.mjs` vào thư mục tạm rồi gọi `chayHook` của bản đó trên cùng đầu vào), `DP7-06 ngoai-day` (bằng hẳn bản base).
- [ ] **Step 2–4:** chạy đỏ → sửa → chạy xanh cùng `hook-chan-s4.test.mjs`, `bien.test.mjs`.
- [ ] **Step 5: Commit** `dieu-phoi: lời chặn S4 trong dãy nói rõ là chờ lượt (DP7 AC-6)`.

Verify: như trên · phục vụ E6 · `independent: false`.

### Task 6: `feature-loop/scripts/trong-dot.mjs` (AC-1)

**Files:** Create `feature-loop/scripts/trong-dot.mjs`. Test: `trong-dot.test.mjs`.

**Interfaces:** `node trong-dot.mjs --root <dir> [--slug <s>]`. Hằng `export const TEN_LIEN_KET = 'dieu-phoi-hien-tai'`.

```js
#!/usr/bin/env node
// Nhận biết đợt Điều phối – Thợ cho feature-loop (DP7) — CHỈ ĐỌC. Kho không đợt: thoát 0, KHÔNG in byte
// nào. Có đợt: gọi `tho --json` của BẢN LÕI trong thư mục đợt (mã bộ phát lịch đang chạy), in JSON khi
// phiên thuộc một dãy; phiên không thuộc dãy → không in gì. Gốc kho chính giải bằng --git-common-dir:
// trong một worktree, --show-toplevel trả gốc của worktree, nơi không có symlink đợt.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const TEN_LIEN_KET = 'dieu-phoi-hien-tai';

export function nhanBiet(root, slug = null) {
  let chung;
  try {
    chung = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
  const lk = path.join(path.dirname(chung), '.acceptance-runs', TEN_LIEN_KET);
  let thuMuc;
  try {
    thuMuc = fs.realpathSync(lk);
  } catch {
    return '';
  }
  const ten = path.basename(thuMuc).replace(/^dieu-phoi-/, '');
  const cli = path.join(thuMuc, 'loi', 'dieu-phoi.mjs');
  if (!fs.existsSync(cli)) return `trong-dot: đợt ${ten} chưa có bản lõi (loi/) — khối Trong đợt không bật; chạy lại \`chay\` của đợt\n`;
  const r = spawnSync(process.execPath, [cli, 'tho', '--json', ...(slug ? ['--slug', slug] : [])], { cwd: root, encoding: 'utf8' });
  let kq = null;
  try {
    kq = r.status === 0 ? JSON.parse(r.stdout) : null;
  } catch {
    kq = null;
  }
  if (!kq) return `trong-dot: lõi của đợt ${ten} chưa có lệnh tho — khối Trong đợt không bật\n`;
  return kq.trong_dot ? `${JSON.stringify(kq)}\n` : '';
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const a = process.argv.slice(2);
  const lay = (k) => (a.indexOf(k) >= 0 ? a[a.indexOf(k) + 1] : null);
  process.stdout.write(nhanBiet(path.resolve(lay('--root') ?? '.'), lay('--slug')));
}
```

- [ ] **Step 1: Ca đỏ** `DP7-01 khong-dot`, `DP7-01 khong-phai-tho`, `DP7-01 tho` (ba hình dạng `git worktree add`; `chepLoi(dot)` thật dựng `loi/`), `DP7-01 loi-cu`, `DP7-01 ten-lien-ket`, `DP7-01-do sai-ten`, `DP7-01-do show-toplevel`.
- [ ] **Step 2–4:** đỏ → viết script → xanh.
- [ ] **Step 5: Commit** `feature-loop: trong-dot.mjs nhận biết đợt, kho không đợt im (DP7 AC-1)`.

Verify: như trên · phục vụ E1 · `independent: false`.

### Task 7: khối `TRONG-DOT` trong SKILL feature-loop (AC-8)

**Files:** Modify `feature-loop/skills/feature-loop/SKILL.md` (khối mới ngay sau đoạn «Bất biến dừng», trước ghi chú WORKFLOWS_DIR). Test: `trong-dot.test.mjs`.

Khối (chữ cuối):

```markdown
<!-- <<<TRONG-DOT -->
**Trong đợt (Điều phối – Thợ, gói `dieu-phoi`).** Ở S0 — cả khi resume — chạy
`node "$WORKFLOWS_DIR/../scripts/trong-dot.mjs" --root .` (chỉ đọc). Không in gì → phiên không trong đợt:
bỏ qua TRỌN khối này. In một dòng `trong-dot: …` → nói lại dòng đó, bỏ qua khối. In JSON
`{"trong_dot":true,…}` → phiên là thợ của dãy `day`; năm luật dưới thắng luật cùng chỗ ở trên, chỉ trong
vòng này. Mọi lần ghi vào thư mục đợt (xin lượt, nhả lượt, yêu cầu) làm đúng mục «Cách xin tài nguyên» của
tệp `luat` — khối này không chép cách ghi; đọc `luat` trước S1.
- **S0, hàng chưa có ô** (khối S0-MO-O in `moi: true`): không trình thẻ Cổng Đáng ở phiên thợ — gửi yêu cầu
  `hang-moi` (slug + câu giao) cho giám sát rồi chờ trả lời bằng lệnh nền.
- **S1:** không mở hỏi đáp brainstorm — trả lời từ ô của hàng (hoặc ô dù nó trỏ), câu giao của hàng lộ trình
  và `luat`; mỗi câu xin duyệt thiết kế thành một dòng sổ `approach` (Cổng Phạm vi vẫn theo luật làn V);
  không in khối GOAL-TEMPLATE. Câu chỉ người biết → gửi yêu cầu `can-nguoi` (câu hỏi + khuyến nghị) TRƯỚC khi
  hỏi bằng chữ, để bảng đợt thấy và đếm.
- **S4, ghim lại, đường nền:** xin lượt (`s4`, `ghim-lai`, `duong-nen`) rồi chờ bằng lệnh nền tới khi khoá ghi
  tên dãy; chạy; nhả khi verdict đã ghi. Lời chặn `chan-s4` là CHỜ LƯỢT: không phải BLOCKED, không hỏi người,
  không tung lượt mới, không đếm round.
- **S5:** `tu_merge: true` → sau khi PR mở, xin lượt `merge`, gộp theo lệ của kho, nhả. `false` hoặc `null` →
  chỉ mở PR; bấm merge là của người. Rồi chạy lại lệnh nhận biết kèm `--slug <slug vừa xong>` và làm đúng
  `viec_ke`:
  - `mo-hang` → gọi `/feature-loop:feature-loop <hang_ke.slug>` ngay trong phiên này.
  - `cho-nhip` → chờ một nhịp (lệnh nền khoảng 30 giây) rồi đọc lại; ba lần vẫn vậy → báo giám sát một dòng.
  - `bao-giam-sat` → yêu cầu `khac` cho giám sát nêu `ly_do`, dừng.
  - `cho` → một dòng «dãy <day> chờ: <ly_do>», dừng.
  - `xong` → một dòng «dãy <day> hết hàng», dừng.
- Khối không đổi bảng cổng: khó-đảo vẫn là câu hỏi cho người; chữ quyết vẫn chỉ của người.
<!-- TRONG-DOT>>> -->
```

- [ ] **Step 1: Ca đỏ** `DP7-08 khoi-co-mat`, `DP7-08 viec-ke`, `DP7-08 lenh-chay-duoc` (rút dòng chứa `trong-dot.mjs` trong khối, lấy đoạn trong backtick, thay `$WORKFLOWS_DIR` bằng `<kit>/feature-loop/workflows`, chạy `bash -c` với cwd kho thử ngoài cây kit), `DP7-08-do thieu-gia-tri`, `DP7-08-do duong-tuong-doi`.
- [ ] **Step 2–4:** đỏ → chèn khối → xanh; chạy thêm `tests/workflows/skill-claims.test.mjs`, `tests/scripts/gate-card-goal.test.mjs`, `tests/scripts/s5-ship-default.test.mjs`, `tests/plugins/lenh-bam-duoc.test.mjs` (khối nhắc lệnh `/feature-loop:feature-loop`).
- [ ] **Step 5: Commit** `feature-loop: khối TRONG-DOT — phiên thợ biết mình trong đợt (DP7 AC-8)`.

Verify: như trên · phục vụ E8, E8b · `independent: false`.

### Task 8: README, chiều im, executor, chốt DP1/DP2 (AC-9, AC-10, AC-11)

**Files:** Modify `dieu-phoi/README.md` (mục «Phiên thợ trong đợt»), `_acceptance/config.yaml` (khoá `executors.test.dieu_phoi_dp7`, `executors.script.dieu_phoi_dp7_im`). Create `tests/dieu-phoi/dp7-chieu-im.mjs`. Test: `trong-dot.test.mjs` (`DP7-10 dp12-nguyen`, `DP7-11 readme`, `DP7-11-do`).

- `executors.test.dieu_phoi_dp7`: như `dieu_phoi_dp2` nhưng grep `DP[127]-`.
- `executors.script.dieu_phoi_dp7_im`: `node tests/dieu-phoi/dp7-chieu-im.mjs` — base = `git merge-base HEAD origin/main` (vắng origin/main → `main`); so mọi khối `<!-- <<<X -->…<!-- X>>> -->` của SKILL ngoài `TRONG-DOT` với bản base; `git diff --name-only <base> -- feature-loop/scripts feature-loop/workflows` ⊆ {`feature-loop/scripts/trong-dot.mjs`}; `dieu-phoi/hooks/hooks.json` byte-bằng base; mutant: bản sao SKILL đổi một chữ trong GOAL-TEMPLATE → hàm so nêu «GOAL-TEMPLATE». In `PASS: DP7-09 …` / `FAIL: …`, thoát 1 nếu có FAIL.
- [ ] Viết ca + script → chạy đỏ → viết README + khoá config → chạy xanh: `node tests/dieu-phoi/dp7-chieu-im.mjs` và lệnh của `dieu_phoi_dp7`.
- [ ] Chạy `node scripts/product-map.mjs --write` (hồ sơ mới vào bản đồ) rồi `--check`.
- [ ] Commit `dieu-phoi: README phiên thợ trong đợt, executor DP7, chiều im (DP7 AC-9 – AC-11)`.

Verify: `node tests/dieu-phoi/dp7-chieu-im.mjs` + lệnh `dieu_phoi_dp7` · phục vụ E9, E10, E11 · `independent: false`.

### Cuối S3

- [ ] Chạy trọn `tests/plugins` và `tests/scripts` (luật «hồ sơ mới làm ca corpus đỏ»: LM20, P179, P177, RT13) — đỏ do hồ sơ mới thì xử theo ca đó chỉ dẫn.
- [ ] Contract `status: implemented`, commit; DỪNG, báo Điều phối «DP7 S3 xong, sha …», chờ lượt S4.
