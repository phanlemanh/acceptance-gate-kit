# Cửa veto sau chữ ký — kế hoạch thực thi

> **Cho người thi hành (máy):** SUB-SKILL BẮT BUỘC — dùng
> `superpowers:subagent-driven-development` (khuyến nghị) hoặc
> `superpowers:executing-plans` để chạy từng task. Các bước dùng ô đánh dấu
> (`- [ ]`).

**Mục tiêu:** Lưới trước-merge và máy quét `/start` thôi nói «cửa veto mở» về hồ
sơ mà người đã ký ở Cổng Bằng chứng, mà không đổi một luật chặn nào.

**Kiến trúc:** Vị từ «chữ ký thật» sống ở ĐÚNG MỘT hàm mỗi bên — `signoff_that()`
trong `scripts/pre-merge-check.sh` và `signoffState()` trong
`scripts/start-scan.mjs`. Hai bên là hai bản dựng độc lập (bash · JS), canh nhau
bằng ma trận 78 ô do `fixture.mjs` sinh trong chính lượt chạy. Mọi sửa lưới là
dòng THÊM, để DV5 xanh ở từng commit.

**Bộ đồ nghề:** bash 3.2 (macOS) · node (ESM cho test, CJS cho lib) · git
(`git archive`, `git log -S`) · harness sẵn có `tests/scripts/run-tests.sh`.

**Đặc tả:** `docs/superpowers/specs/2026-09-11-cua-veto-sau-chu-ky-design.md`
(hợp đồng: `_acceptance/cua-veto-sau-chu-ky/contract.md`, phép đo:
`_acceptance/cua-veto-sau-chu-ky/evals.yaml`).

## Ràng buộc toàn cục

- **Chỉ THÊM dòng vào `scripts/pre-merge-check.sh`** (DV5,
  `tests/scripts/additive-only.test.mjs`). Không sửa, không xoá dòng cũ. Cần gỡ
  thì phải liệt đích danh trong `ALLOWED_REMOVALS` kèm lý do «chỉ đổi NOTE,
  không nới luật» — mặc định là KHÔNG cần.
- **Câu ghim:** `cửa veto đã đóng bằng chữ ký` (dùng nguyên văn ở lưới, ở phép
  đo, và là mỏ neo `git log -S` của E7/E10).
- **Vị từ cửa veto mở:** `veto_state: mo` ∧ `human_signoff` ở frontmatter DẪN
  ĐẦU của `evidence-report.md` không phải chữ ký thật (rỗng · chỉ chú thích ·
  báo cáo vắng · frontmatter hỏng · khớp `placeholder_signoff`).
- **KHÔNG chạm** `lib/`, `hooks/`, `commands/signoff.md`, `commands/approve.md`,
  hồ sơ đã ký nào (kể cả `_acceptance/start-bang-dieu-khien/rang-bdk.sh`).
- **Khối khoá eval trong `_acceptance/config.yaml` giữ LIỀN MẠCH** (12 khoá
  `cvsck_*` cạnh nhau, cuối `executors.script`) — vòng anh em
  `ghim-lai-tren-lop-cu` chèn khối ở cùng chỗ, để liền mạch thì rebase tầm
  thường.
- **Mỗi phép đo mới phải có cặp hai chiều trên CÙNG fixture** (MEASURE-BIRTH):
  vật lành xanh → phá vật trong BẢN SAO → đỏ với thông điệp ghim. Task chưa có
  cặp là task CHƯA XONG.
- Mọi đường dẫn trong script đo suy từ vị trí script, không hardcode gốc kho.

---

## Cấu trúc tệp

| Tệp | Vai |
|---|---|
| `_acceptance/cua-veto-sau-chu-ky/fixture.mjs` | TẠO — sinh kho git fixture, ma trận 78 ô, chạy hai bộ đọc, rút dòng khuôn và bảng giữ-chỗ |
| `_acceptance/cua-veto-sau-chu-ky/rang.sh` | TẠO — răng hồ sơ, 10 chân `--chan`, mỗi chân một eval |
| `_acceptance/cua-veto-sau-chu-ky/chan-*.mjs` | TẠO — thân từng chân (một tệp một chân, để chân đỏ đọc được) |
| `_acceptance/cua-veto-sau-chu-ky/base-anchor.sh` | TẠO — hàm neo base dùng chung cho hai chân so-với-bản-cũ |
| `scripts/pre-merge-check.sh` | SỬA (chỉ thêm) — `signoff_that()` + nhánh NOTE đã-ký + một dòng rẽ ở vòng veto-trace |
| `scripts/start-scan.mjs` | SỬA — `signoffState()` + `humanSignoff`/`signoffWarn` + `vetoOpenUnsigned[]` |
| `commands/start.md` | SỬA — khối `START-SCAN-KEYS` + câu dặn chép danh sách |
| `commands/acceptance-status.md` | SỬA — câu dặn chép danh sách |
| `CONTEXT.md` | SỬA — luật «chữ ký đóng cửa veto» + `_Avoid_` |
| `tests/scripts/cua-veto-sau-chu-ky.test.mjs` | TẠO — ca thường trực |
| `tests/scripts/run-tests.sh` | SỬA — nạp ca thường trực |

---

### Task 1: Bộ sinh fixture + ma trận 78 ô

**Files:**
- Tạo: `_acceptance/cua-veto-sau-chu-ky/fixture.mjs`

**Giao diện:**
- Dùng của task trước: không (task đầu).
- Cung cấp cho task sau: `mkRepo()` → đường dẫn kho git tạm đã commit, chép trọn
  `scripts` + `lib` của cây đang kiểm · `writeDossier(repo, slug, {veto, cong1,
  chuKy, status, tier})` → ghi `contract.md` + `evidence-report.md` ·
  `SIGNOFF_CELLS` (13 ô) · `VETO_CELLS` (3) · `CONG1_CELLS` (2) · `cells()` (78
  phần tử `{ten, veto, cong1, chuKy}`) · `runPremerge(repo)` → `{code, out}` ·
  `runScan(repo)` → JSON đã parse · `tenDongTong(out)` → mảng tên ở dòng «cửa
  veto đang mở» · `templateSignoffLine()` → dòng `human_signoff:` mặc định rút
  NGUYÊN VĂN từ `skills/acceptance/references/evidence-report-template.md` ·
  `placeholderPatterns()` → mảng mẫu rút từ hàm `placeholder_signoff` trong
  `scripts/pre-merge-check.sh` · hằng `CAU_GHIM`.

- [ ] **Bước 1: Viết phần khai ma trận**

```js
// _acceptance/cua-veto-sau-chu-ky/fixture.mjs
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '..', '..');   // suy từ vị trí script
export const CAU_GHIM = 'cửa veto đã đóng bằng chữ ký';

export function templateSignoffLine() {
  const tpl = path.join(ROOT, 'skills/acceptance/references/evidence-report-template.md');
  const line = readFileSync(tpl, 'utf8').split('\n').find(l => l.startsWith('human_signoff:'));
  if (!line) throw new Error('khuôn bên viết không còn dòng human_signoff');
  return line;
}

// `dung: true` = cửa veto còn MỞ (chữ ký không thật)
export const SIGNOFF_CELLS = [
  { ten: 'that-tran',         dong: 'human_signoff: Manh Phan 2026-09-11',       dung: false },
  { ten: 'that-nhay-kep',     dong: 'human_signoff: "Manh Phan 2026-09-11"',     dung: false },
  { ten: 'that-nhay-don',     dong: "human_signoff: 'Manh Phan 2026-09-11'",     dung: false },
  { ten: 'that-chu-thich',    dong: 'human_signoff: Manh Phan 2026-09-11  # ky', dung: false },
  { ten: 'giu-cho-tran',      dong: 'human_signoff: TBD',                        dung: true },
  { ten: 'giu-cho-nhay-kep',  dong: 'human_signoff: "TBD"',                      dung: true },
  { ten: 'giu-cho-nhay-don',  dong: "human_signoff: 'TBD'",                      dung: true },
  { ten: 'giu-cho-chu-thich', dong: 'human_signoff: TBD  # cho Manh',            dung: true },
  { ten: 'rong-khuon',        dong: null,                                        dung: true },
  { ten: 'chi-chu-thich',     dong: 'human_signoff:   # chua ky',                dung: true },
  { ten: 'bao-cao-vang',      dong: undefined,                                   dung: true },
  { ten: 'chi-o-than',        dong: 'human_signoff:',                            dung: true },
  { ten: 'frontmatter-hong',  dong: 'human_signoff: Manh Phan 2026-09-11',       dung: true },
];

export const VETO_CELLS = [
  { ten: 'vang',    veto: null,      opened: null },
  { ten: 'mo',      veto: 'mo',      opened: '2026-09-01T10:00:00Z' },
  { ten: 'da-veto', veto: 'da-veto', opened: '2026-09-01T10:00:00Z' },
];
export const CONG1_CELLS = [
  { ten: 'co-ten', approvedBy: 'Manh Phan' },
  { ten: 'rong',   approvedBy: '' },
];

export function cells() {
  const out = [];
  for (const v of VETO_CELLS) for (const g of CONG1_CELLS) for (const s of SIGNOFF_CELLS)
    out.push({ ten: `${v.ten}-${g.ten}-${s.ten}`, veto: v, cong1: g, chuKy: s });
  return out;   // 3 × 2 × 13 = 78
}
```

- [ ] **Bước 2: Viết phần dựng kho, ghi hồ sơ, chạy hai bộ đọc**

```js
export const headSha = repo =>
  execFileSync('git', ['-C', repo, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();

export function mkRepo() {
  const d = mkdtempSync(path.join(tmpdir(), 'cvsck-'));
  execFileSync('bash', ['-c',
    `cd "${ROOT}" && tar -cf - --exclude=.git --exclude=.worktrees --exclude=.claude scripts lib | tar -x -C "${d}"`]);
  mkdirSync(path.join(d, '_acceptance'), { recursive: true });
  writeFileSync(path.join(d, '_acceptance/config.yaml'), 'schema_version: 1\n');
  execFileSync('bash', ['-c',
    `cd "${d}" && git init -q . && git add -A && git -c user.email=t@t -c user.name=T commit -qm base`]);
  return d;
}

export const gitAll = (repo, msg) => execFileSync('bash', ['-c',
  `cd "${repo}" && git add -A && git -c user.email=t@t -c user.name=T commit -qm ${JSON.stringify(msg)}`]);

export function writeDossier(repo, slug, spec) {
  const dir = path.join(repo, '_acceptance', slug);
  mkdirSync(dir, { recursive: true });
  const fm = ['---', 'schema_version: 1', `feature: ${slug}`, `slug: ${slug}`,
    'owner: o', `risk_tier: ${spec.tier || 'T2'}`, 'surfaces: [cli]',
    `status: ${spec.status || 'verified'}`, `approved_by: ${spec.cong1.approvedBy}`,
    'approved_at: 2026-09-01'];
  if (spec.veto.veto) fm.push(`veto_state: ${spec.veto.veto}`, `veto_opened_at: ${spec.veto.opened}`);
  fm.push('---', '', '# c', '');
  writeFileSync(path.join(dir, 'contract.md'), fm.join('\n'));
  const c = spec.chuKy;
  if (c.dong === undefined) return dir;                     // ô «báo cáo vắng»
  const sig = c.dong === null ? templateSignoffLine() : c.dong;
  const than = c.ten === 'chi-o-than'
    ? '\n## Ghi chú\n\n    human_signoff: Manh Phan 2026-09-11\n' : '';
  const head = ['---', 'schema_version: 1', `slug: ${slug}`, 'verdict: PASS',
    'enforcement_mode: strict', 'bypass_used: false',
    `verified_commit: ${headSha(repo)}`, sig, '---'];
  const body = `\n## Evidence\n\nok\n\n## Known limits\n\n\n## Ngoài hợp đồng\n${than}\n`;
  const txt = c.ten === 'frontmatter-hong'
    ? `# tieu de truoc frontmatter\n\n${head.join('\n')}${body}`   // frontmatter KHÔNG dẫn đầu
    : head.join('\n') + body;
  writeFileSync(path.join(dir, 'evidence-report.md'), txt);
  return dir;
}

export function runPremerge(repo, kitRoot = repo) {
  const r = execFileSync('bash', ['-c',
    `cd "${repo}" && bash "${kitRoot}/scripts/pre-merge-check.sh" . --base "$(git -C "${repo}" rev-parse HEAD)" 2>&1; echo "__MA__$?"`],
    { encoding: 'utf8', maxBuffer: 1e8 });
  const i = r.lastIndexOf('__MA__');
  return { out: r.slice(0, i), code: Number(r.slice(i + 6).trim()) };
}

export function runScan(repo, kitRoot = repo) {
  return JSON.parse(execFileSync('node',
    [path.join(kitRoot, 'scripts/start-scan.mjs'), '--root', repo],
    { encoding: 'utf8', maxBuffer: 1e8 }));
}

export function tenDongTong(out) {          // tập tên ở dòng «cửa veto đang mở»
  const l = out.split('\n').find(x => x.includes('cửa veto đang mở'));
  if (!l) return [];
  return l.split('chưa veto:')[1].trim().split(/\s+/).filter(Boolean).sort();
}

export function placeholderPatterns() {
  const src = readFileSync(path.join(ROOT, 'scripts/pre-merge-check.sh'), 'utf8');
  const m = src.match(/placeholder_signoff\(\)[\s\S]*?\n\}/);
  if (!m) throw new Error('không rút được hàm placeholder_signoff');
  const pats = [...m[0].matchAll(/\b(pending|tbd|todo|n\/a|none|unsigned|waiting)\b/gi)]
    .map(x => x[1].toLowerCase());
  return [...new Set(pats)];
}
```

- [ ] **Bước 3: Chạy tự kiểm của bộ sinh**

Chạy:
`node -e 'import("./_acceptance/cua-veto-sau-chu-ky/fixture.mjs").then(f=>{const c=f.cells();if(c.length!==78)throw new Error("so o "+c.length);if(f.placeholderPatterns().length<3)throw new Error("bang mau rut hut");console.log("OK fixture",c.length,f.placeholderPatterns().join(","));})'`

Kỳ vọng: in `OK fixture 78 …` kèm ≥ 3 mẫu.

- [ ] **Bước 4: Chiều đỏ của chính bộ sinh**

Chép `fixture.mjs` sang thư mục tạm, bỏ một phần tử khỏi `SIGNOFF_CELLS`, chạy
lại lệnh Bước 3 trỏ vào bản sao. Kỳ vọng ĐỎ `so o 72` — chứng phép đếm ô sống,
vì mọi chân sau này dựa vào nó.

- [ ] **Bước 5: Commit**

```bash
git add _acceptance/cua-veto-sau-chu-ky/fixture.mjs
git commit -F - <<'MSG'
test(cua-veto-sau-chu-ky): bộ sinh fixture 78 ô + hai bộ chạy

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

**Verify (task):** lệnh Bước 3 exit 0 và in `OK fixture 78`; bản sao ở Bước 4 cho ĐỎ.
**Phục vụ:** nền cho E1–E8, E10, E12 (không eval nào tính riêng task này).
**independent: true** (không đụng mã sản phẩm).

---

### Task 2: Khung `rang.sh` + hai chân của luật NOTE (viết ĐỎ trước)

**Files:**
- Tạo: `_acceptance/cua-veto-sau-chu-ky/rang.sh`
- Tạo: `_acceptance/cua-veto-sau-chu-ky/chan-note.mjs`

**Giao diện:**
- Dùng: `fixture.mjs` (Task 1).
- Cung cấp: `rang.sh --chan <ten>` cho 10 chân; hàm `ok`/`bad`/`mut`; sàn đếm —
  `--chan` không khớp tên nào thì exit 1 kèm danh sách chân.

- [ ] **Bước 1: Viết khung**

```bash
#!/usr/bin/env bash
# Răng hồ sơ cua-veto-sau-chu-ky. Mỗi chân = một eval.
set -u
WS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$WS/../.." && pwd)"
CAU_GHIM='cửa veto đã đóng bằng chữ ký'
fails=0
ok(){ echo "  OK   $*"; }
bad(){ echo "  ĐỎ   $*"; fails=$((fails+1)); }
mut(){ echo "       [chiều đỏ] $*"; }
CHAN=""; [ "${1:-}" = "--chan" ] && CHAN="${2:-}"
TEN_CHAN="note-da-ky that-con-mo dong-tong giu-cho nhan-khong-dong dang-thuc khong-noi luat-lan-can cay-that van-ban"
case " $TEN_CHAN " in
  *" $CHAN "*) ;;
  *) echo "ĐỎ: --chan '$CHAN' không khớp chân nào. Chân có: $TEN_CHAN"; exit 1 ;;
esac

if [ "$CHAN" = "note-da-ky" ]; then
  echo "== chân note-da-ky: hồ sơ làn V ĐÃ KÝ =="
  node "$WS/chan-note.mjs" --ky && ok "lưới nói «$CAU_GHIM», không nói «cửa veto mở»" || bad "xem output trên"
fi
if [ "$CHAN" = "that-con-mo" ]; then
  echo "== chân that-con-mo: làn V CHƯA ký =="
  node "$WS/chan-note.mjs" --chua-ky && ok "lưới vẫn nói «cửa veto mở», có tên ở dòng tổng" || bad "xem output trên"
fi
exit $fails
```

- [ ] **Bước 2: Viết `chan-note.mjs` — cặp hai chiều trên CÙNG một fixture**

```js
// _acceptance/cua-veto-sau-chu-ky/chan-note.mjs
import * as F from './fixture.mjs';
const KY = process.argv.includes('--ky');
const repo = F.mkRepo();
const chuKy = F.SIGNOFF_CELLS.find(c => c.ten === (KY ? 'that-tran' : 'rong-khuon'));
F.writeDossier(repo, 's', { veto: F.VETO_CELLS[1], cong1: F.CONG1_CELLS[1], chuKy });
F.gitAll(repo, 'ho so');
const { out } = F.runPremerge(repo);
const coDong = out.includes(F.CAU_GHIM);
const coMo = /NOTE \[s\].*cửa veto mở/.test(out);
const oTong = F.tenDongTong(out).includes('s');
const loi = [];
if (KY) {
  if (!coDong) loi.push('chữ ký không đóng cửa: thiếu câu ghim');
  if (coMo) loi.push('chữ ký không đóng cửa: vẫn in «cửa veto mở»');
  if (oTong) loi.push('chữ ký không đóng cửa: vẫn có tên ở dòng tổng');
} else {
  if (!coMo) loi.push('cửa thật bị giấu: mất NOTE «cửa veto mở»');
  if (!oTong) loi.push('cửa thật bị giấu: mất tên ở dòng tổng');
  if (coDong) loi.push('cửa thật bị giấu: nói đã đóng khi chưa ký');
}
if (loi.length) { console.error(loi.join(' | ')); process.exit(1); }
console.log(KY ? 'đã ký → đóng' : 'chưa ký → mở');
```

- [ ] **Bước 3: Chạy hai chân trên cây HÔM NAY**

Chạy: `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan note-da-ky`
Kỳ vọng: ĐỎ, nêu `chữ ký không đóng cửa` — chiều đỏ sống của luật chưa cắm.

Chạy: `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan that-con-mo`
Kỳ vọng: XANH — trường hợp thật đã đúng từ trước (đối chứng dương).

- [ ] **Bước 4: Chạy sàn đếm**

Chạy: `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan khong-co-chan-nay`
Kỳ vọng: exit 1 kèm `không khớp chân nào`.

- [ ] **Bước 5: Commit**

```bash
git add _acceptance/cua-veto-sau-chu-ky/rang.sh _acceptance/cua-veto-sau-chu-ky/chan-note.mjs
git commit -F - <<'MSG'
test(cua-veto-sau-chu-ky): răng chân note-da-ky (đỏ) + that-con-mo (xanh)

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

**Verify (task):** `--chan that-con-mo` exit 0; `--chan note-da-ky` exit khác 0 kèm `chữ ký không đóng cửa`; `--chan khong-co-chan-nay` exit 1.
**Phục vụ:** E1, E2.
**independent: false** (cần Task 1).

---

### Task 3: Lưới — `signoff_that()` + nhánh NOTE «đã đóng» (chỉ THÊM dòng)

**Files:**
- Sửa: `scripts/pre-merge-check.sh` (thêm hàm sau `placeholder_signoff` ~dòng
  430; thêm một nhánh `elif` TRƯỚC dòng 777)

**Giao diện:**
- Dùng: `front_field`, `placeholder_signoff` (đã có trong lưới).
- Cung cấp: `signoff_that <thư mục hồ sơ>` → 0 khi có chữ ký THẬT, đặt
  `SIGNOFF_THAT` = chuỗi chữ ký; 1 trong mọi ca còn lại.

- [ ] **Bước 1: Thêm hàm (dòng THÊM, sau `placeholder_signoff`)**

```bash
# Chữ ký người ở Cổng Bằng chứng ĐÓNG cửa veto (hồ sơ cua-veto-sau-chu-ky).
# Vị từ là QUAN HỆ, không phải nhãn: `status: signed-off` không đóng cửa, chữ ký
# giữ-chỗ cũng không. MỘT hàm cho CẢ HAI chỗ đọc (NOTE làn V và dòng tổng) —
# hai bản trong cùng một file là hình dạng đã trôi nhiều lần.
signoff_that() { # <thư mục hồ sơ>
  SIGNOFF_THAT=""
  [ -f "$1/evidence-report.md" ] || return 1
  local s; s="$(front_field "$1/evidence-report.md" human_signoff)"
  [ -n "$s" ] || return 1
  placeholder_signoff "$s" && return 1
  SIGNOFF_THAT="$s"; return 0
}
```

- [ ] **Bước 2: Thêm nhánh NOTE TRƯỚC dòng `elif [ -n "$_vsig" ] || xanh_sach_check`**

```bash
          elif signoff_that "$dir"; then
            echo "NOTE [$slug]: làn V — Cổng 1 không có chữ duyệt; Cổng 2 đã có chữ ký người ($SIGNOFF_THAT): cửa veto đã đóng bằng chữ ký"
```

Dòng `elif [ -n "$_vsig" ] || xanh_sach_check "$_vrep"; then` bên dưới GIỮ NGUYÊN
VĂN — vế `-n "$_vsig"` từ nay không còn tới được, và DV5 cấm sửa nó.

- [ ] **Bước 3: Chạy cặp hai chiều**

Chạy: `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan note-da-ky`
Kỳ vọng: XANH (trước Task này nó ĐỎ).

Chạy: `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan that-con-mo`
Kỳ vọng: XANH — không giẫm lên trường hợp thật.

- [ ] **Bước 4: Chạy DV5 NGAY trong task này**

Chạy: `node tests/scripts/additive-only.test.mjs`
Kỳ vọng: exit 0. Đỏ nghĩa là đã sửa một dòng cũ — quay lại sửa cách chèn, KHÔNG
thêm mục vào `ALLOWED_REMOVALS`.

- [ ] **Bước 5: Commit**

```bash
git add scripts/pre-merge-check.sh
git commit -F - <<'MSG'
feat(cua-veto-sau-chu-ky): lưới nhận chữ ký Cổng 2 là cửa veto đã đóng

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

**Verify (task):** `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan note-da-ky && bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan that-con-mo && node tests/scripts/additive-only.test.mjs`
**Phục vụ:** E1, E2, E9.
**independent: false** (cần Task 2).

---

### Task 4: Lưới — dòng tổng bỏ qua hồ sơ đã ký + chân `dong-tong`

**Files:**
- Sửa: `scripts/pre-merge-check.sh` (thêm một dòng rẽ TRƯỚC `case "$vstate" in`, ~dòng 1352)
- Tạo: `_acceptance/cua-veto-sau-chu-ky/chan-tong.mjs`
- Sửa: `_acceptance/cua-veto-sau-chu-ky/rang.sh`

**Giao diện:**
- Dùng: `signoff_that` (Task 3), `fixture.mjs` (Task 1).

- [ ] **Bước 1: Viết chân đo TRƯỚC (đỏ trên cây hiện tại)**

```js
// _acceptance/cua-veto-sau-chu-ky/chan-tong.mjs
import * as F from './fixture.mjs';
const repo = F.mkRepo();
const mo = F.VETO_CELLS[1], coTen = F.CONG1_CELLS[0], rong = F.CONG1_CELLS[1];
const that = F.SIGNOFF_CELLS.find(c => c.ten === 'that-tran');
const khuon = F.SIGNOFF_CELLS.find(c => c.ten === 'rong-khuon');
F.writeDossier(repo, 'a-chua-ky',  { veto: mo, cong1: coTen, chuKy: khuon });
F.writeDossier(repo, 'b-da-ky',    { veto: mo, cong1: coTen, chuKy: that });
F.writeDossier(repo, 'c-lan-v-ky', { veto: mo, cong1: rong,  chuKy: that });
F.gitAll(repo, 'ba ho so');
const { out } = F.runPremerge(repo);
const ten = F.tenDongTong(out);
const loi = [];
if (JSON.stringify(ten) !== JSON.stringify(['a-chua-ky']))
  loi.push(`dòng tổng đếm hồ sơ đã ký: [${ten.join(' ')}]`);
const dong = out.split('\n').find(l => l.includes('cửa veto đang mở')) || '';
const n = Number((dong.match(/mở — (\d+) hồ sơ/) || [])[1] || -1);
if (n !== ten.length) loi.push(`N lệch số tên: N=${n}, tên=${ten.length}`);
F.writeDossier(repo, 'a-chua-ky', { veto: mo, cong1: coTen, chuKy: that });   // ca IM
F.gitAll(repo, 'ky not');
if (F.runPremerge(repo).out.includes('cửa veto đang mở'))
  loi.push('ký hết mà vẫn in dòng tổng');
if (loi.length) { console.error(loi.join(' | ')); process.exit(1); }
console.log('dòng tổng: 1 tên, N khớp, ký hết thì im');
```

Nối chân vào `rang.sh`:

```bash
if [ "$CHAN" = "dong-tong" ]; then
  echo "== chân dong-tong: dòng tổng chỉ đếm cửa mở thật =="
  node "$WS/chan-tong.mjs" && ok "dòng tổng đúng" || bad "xem output trên"
fi
```

- [ ] **Bước 2: Chạy — kỳ vọng ĐỎ**

Chạy: `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan dong-tong`
Kỳ vọng: ĐỎ `dòng tổng đếm hồ sơ đã ký: [a-chua-ky b-da-ky c-lan-v-ky]`.

- [ ] **Bước 3: Thêm dòng rẽ vào vòng veto-trace (chỉ THÊM)**

```bash
    # Hồ sơ đã có chữ ký người thì cửa veto không còn là chốt đang giữ nó — đổi
    # nhãn TRƯỚC khi `case` đếm; dòng `mo)` bên dưới giữ nguyên văn (DV5).
    if [ "$vstate" = "mo" ] && signoff_that "$dir"; then vstate="mo-da-ky"; fi
```

- [ ] **Bước 4: Chạy lại cặp hai chiều + hồi quy + DV5**

Chạy: `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan dong-tong`
Kỳ vọng: XANH.

Chạy: `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan that-con-mo && node tests/scripts/additive-only.test.mjs`
Kỳ vọng: XANH cả hai.

- [ ] **Bước 5: Commit**

```bash
git add scripts/pre-merge-check.sh _acceptance/cua-veto-sau-chu-ky/chan-tong.mjs _acceptance/cua-veto-sau-chu-ky/rang.sh
git commit -F - <<'MSG'
feat(cua-veto-sau-chu-ky): dòng tổng cửa veto bỏ qua hồ sơ đã ký

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

**Verify (task):** `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan dong-tong && bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan note-da-ky && bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan that-con-mo && node tests/scripts/additive-only.test.mjs`
**Phục vụ:** E3, E9 (giữ E1, E2 không hồi quy).
**independent: false** (cần Task 3 — dùng chung `signoff_that`).

---

### Task 5: Máy quét — `signoffState()`, `humanSignoff`, `signoffWarn`, `vetoOpenUnsigned[]`

**Files:**
- Sửa: `scripts/start-scan.mjs` (thêm hàm cạnh chỗ đọc cửa veto ~dòng 250; sửa
  `vetoOpen.push(...)`; thêm `vetoOpenUnsigned` vào đối tượng JSON ra)
- Tạo: `_acceptance/cua-veto-sau-chu-ky/chan-quet.mjs`
- Sửa: `_acceptance/cua-veto-sau-chu-ky/rang.sh`

**Giao diện:**
- Cung cấp: `signoffState(dir)` → `{ signed: boolean, warn: string }`; mỗi phần
  tử `vetoOpen[]` thêm `humanSignoff: boolean` và `signoffWarn: string` (LUÔN có
  mặt, rỗng khi đọc sạch); JSON ra thêm `vetoOpenUnsigned: string[]`.

- [ ] **Bước 1: Viết chân đo trước (đỏ)**

```js
// _acceptance/cua-veto-sau-chu-ky/chan-quet.mjs — nửa máy quét của AC-4, và AC-5
import * as F from './fixture.mjs';
const repo = F.mkRepo();
const mo = F.VETO_CELLS[1], rong = F.CONG1_CELLS[1];
const dat = (slug, chuKy, status) => F.writeDossier(repo, slug, { veto: mo, cong1: rong, chuKy, status });
dat('nhan-rong', F.SIGNOFF_CELLS.find(c => c.ten === 'rong-khuon'),   'signed-off');
dat('nhan-vang', F.SIGNOFF_CELLS.find(c => c.ten === 'bao-cao-vang'), 'signed-off');
dat('da-ky',     F.SIGNOFF_CELLS.find(c => c.ten === 'that-tran'),    'verified');
for (const p of F.placeholderPatterns())
  dat(`gc-${p}`, { ten: `gc-${p}`, dong: `human_signoff: ${p}` }, 'verified');
F.gitAll(repo, 'ho so');
const j = F.runScan(repo);
const map = new Map((j.vetoOpen || []).map(v => [v.slug, v]));
const ds = j.vetoOpenUnsigned || [];
const loi = []; let assert = 0;
for (const [slug, mongKy] of [['nhan-rong', false], ['nhan-vang', false], ['da-ky', true]]) {
  const v = map.get(slug); assert++;
  if (!v) { loi.push(`vetoOpen thiếu ${slug} — tập phần tử KHÔNG được đổi`); continue; }
  if (typeof v.humanSignoff !== 'boolean') loi.push(`${slug}: humanSignoff không phải boolean`);
  if (typeof v.signoffWarn !== 'string') loi.push(`${slug}: signoffWarn phải LUÔN có mặt`);
  if (v.humanSignoff !== mongKy) loi.push(`nhãn status đóng cửa: ${slug} humanSignoff=${v.humanSignoff}`);
}
for (const p of F.placeholderPatterns()) {
  assert++;
  if (!ds.includes(`gc-${p}`)) loi.push(`máy quét coi giữ-chỗ ${p} là chữ ký`);
}
if (ds.includes('da-ky')) loi.push('vetoOpenUnsigned chứa hồ sơ đã ký');
if (assert < 3 + F.placeholderPatterns().length) loi.push('sàn đếm: số assert hụt');
if (loi.length) { console.error(loi.join(' | ')); process.exit(1); }
console.log(`máy quét: ${assert} assert, vetoOpenUnsigned=[${ds.join(' ')}]`);
```

- [ ] **Bước 2: Chạy — kỳ vọng ĐỎ** (chưa có `vetoOpenUnsigned`)

Chạy: `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan nhan-khong-dong`
Kỳ vọng: ĐỎ, nêu `máy quét coi giữ-chỗ …` hoặc `humanSignoff không phải boolean`.

- [ ] **Bước 3: Cắm vào máy quét**

```js
// đặt cạnh chỗ đọc cửa veto, TRƯỚC chốt status hỏng
const GIU_CHO = /^(pending|tbd|todo|n\/a|none|unsigned|waiting|[>|-]|<[^>]*>)$/i;
function signoffState(dir) {                 // { signed, warn }
  const p = path.join(dir, 'evidence-report.md');
  let t;
  try { t = fs.readFileSync(p, 'utf8'); }
  catch (e) { return { signed: false, warn: e.code === 'ENOENT' ? '' : `không đọc được báo cáo: ${e.code}` }; }
  if (!/^---\s*$/.test((t.split('\n')[0] || '').trim()))
    return { signed: false, warn: 'frontmatter không dẫn đầu báo cáo' };
  const raw = frontmatterField(t, 'human_signoff');   // CHỈ frontmatter dẫn đầu
  const s = (raw || '').replace(/\s*#.*$/, '').replace(/^["']|["']$/g, '').trim();
  if (!s) return { signed: false, warn: '' };
  if (GIU_CHO.test(s)) return { signed: false, warn: '' };
  return { signed: true, warn: '' };
}
```

Chỗ đẩy phần tử:

```js
    if ((frontmatterField(cTxt, 'veto_state') || '').trim().toLowerCase() === 'mo') {
      const ss = signoffState(dir);
      vetoOpen.push({ slug, status: (frontmatterField(cTxt, 'status') || '').toLowerCase(),
                      humanSignoff: ss.signed, signoffWarn: ss.warn });
    }
```

Chỗ dựng JSON ra, ngay cạnh `vetoOpen`:

```js
  vetoOpenUnsigned: vetoOpen.filter(v => !v.humanSignoff).map(v => v.slug),
```

- [ ] **Bước 4: Chạy cặp hai chiều**

Chạy: `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan nhan-khong-dong`
Kỳ vọng: XANH.

Chiều đỏ: chép `start-scan.mjs` sang thư mục tạm, đổi `GIU_CHO` thành `/^$/`, chạy
chân trỏ bản sao. Kỳ vọng ĐỎ `máy quét coi giữ-chỗ <mẫu> là chữ ký`; in dòng `[chiều đỏ]`.

- [ ] **Bước 5: Commit**

```bash
git add scripts/start-scan.mjs _acceptance/cua-veto-sau-chu-ky/chan-quet.mjs _acceptance/cua-veto-sau-chu-ky/rang.sh
git commit -F - <<'MSG'
feat(cua-veto-sau-chu-ky): máy quét khai humanSignoff, signoffWarn, vetoOpenUnsigned

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

**Verify (task):** `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan nhan-khong-dong` exit 0, và bản sao đổi `GIU_CHO` cho ĐỎ đúng thông điệp.
**Phục vụ:** E5 và nửa máy quét của E4.
**independent: true so với Task 3–4** (khác tệp sản phẩm; cần Task 1).

---

### Task 6: Chân `giu-cho` — ma trận giữ-chỗ trên HAI bộ đọc

**Files:**
- Tạo: `_acceptance/cua-veto-sau-chu-ky/chan-giu-cho.mjs`
- Sửa: `_acceptance/cua-veto-sau-chu-ky/rang.sh`

- [ ] **Bước 1: Viết chân**

```js
// mọi mẫu RÚT lúc chạy × hai bộ đọc; số assert = 2 × số mẫu
import * as F from './fixture.mjs';
const mau = F.placeholderPatterns();
if (mau.length < 3) { console.error(`bảng mẫu rút hụt: ${mau.length}`); process.exit(1); }
const repo = F.mkRepo();
for (const p of mau)
  F.writeDossier(repo, `gc-${p}`, { veto: F.VETO_CELLS[1], cong1: F.CONG1_CELLS[1],
                                    chuKy: { ten: p, dong: `human_signoff: ${p}` } });
F.writeDossier(repo, 'that', { veto: F.VETO_CELLS[1], cong1: F.CONG1_CELLS[1],
                               chuKy: F.SIGNOFF_CELLS.find(c => c.ten === 'that-tran') });
F.gitAll(repo, 'ma tran giu cho');
const { out } = F.runPremerge(repo);
const j = F.runScan(repo);
const ten = F.tenDongTong(out), ds = j.vetoOpenUnsigned || [];
let assert = 0; const loi = [];
for (const p of mau) {
  assert += 2;
  if (!ten.includes(`gc-${p}`)) loi.push(`giữ-chỗ đóng cửa: lưới bỏ gc-${p}`);
  if (!ds.includes(`gc-${p}`)) loi.push(`máy quét coi giữ-chỗ ${p} là chữ ký`);
  if (!out.includes('is a placeholder, not a signature')) loi.push(`mất VIOLATION giữ-chỗ cho ${p}`);
}
if (ten.includes('that') || ds.includes('that'))
  loi.push('đối chứng dương hỏng: chữ ký thật vẫn bị coi là cửa mở');
if (assert !== 2 * mau.length) loi.push(`số ô lệch: ${assert} vs ${2 * mau.length}`);
if (loi.length) { console.error(loi.join(' | ')); process.exit(1); }
console.log(`giữ-chỗ: ${mau.length} mẫu × 2 bộ đọc = ${assert} assert`);
```

- [ ] **Bước 2: Chạy**

Chạy: `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan giu-cho`
Kỳ vọng: XANH (lưới và máy quét đã cắm).

- [ ] **Bước 3: Hai chiều đỏ, hai thông điệp khác nhau**

Bản sao lưới đổi `placeholder_signoff "$s" && return 1` thành `return 0` → ĐỎ
`giữ-chỗ đóng cửa`.
Bản sao máy quét bỏ một mẫu khỏi `GIU_CHO` → ĐỎ `máy quét coi giữ-chỗ <mẫu> là chữ ký`.
In cả hai vết `[chiều đỏ]`.

- [ ] **Bước 4: Kiểm sàn mẫu**

Bản sao lưới xoá thân `placeholder_signoff` → chân ĐỎ `bảng mẫu rút hụt` (chứ
không xanh câm).

- [ ] **Bước 5: Commit**

```bash
git add _acceptance/cua-veto-sau-chu-ky/chan-giu-cho.mjs _acceptance/cua-veto-sau-chu-ky/rang.sh
git commit -F - <<'MSG'
test(cua-veto-sau-chu-ky): ma trận giữ-chỗ trên hai bộ đọc

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

**Verify (task):** `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan giu-cho` exit 0 + hai vết chiều đỏ + ca sàn mẫu.
**Phục vụ:** E4.
**independent: false** (cần Task 4 và Task 5).

---

### Task 7: Chân `dang-thuc` — đẳng thức hai bộ đọc trên 78 ô

**Files:**
- Tạo: `_acceptance/cua-veto-sau-chu-ky/chan-dang-thuc.mjs`
- Sửa: `_acceptance/cua-veto-sau-chu-ky/rang.sh`

- [ ] **Bước 1: Viết phần so từng ô**

```js
import * as F from './fixture.mjs';
const o = F.cells();
if (o.length !== 78) { console.error(`số ô lệch: ${o.length}`); process.exit(1); }
const repo = F.mkRepo();
for (const c of o) F.writeDossier(repo, c.ten, { veto: c.veto, cong1: c.cong1, chuKy: c.chuKy });
F.gitAll(repo, '78 o');
const { out } = F.runPremerge(repo);
const j = F.runScan(repo);
const luoi = new Set(F.tenDongTong(out));
const quet = new Set(j.vetoOpenUnsigned || []);
const tapVeto = new Set((j.vetoOpen || []).map(v => v.slug));
const loi = [];
for (const c of o) {
  const moThat = c.veto.veto === 'mo' && c.chuKy.dung;
  if ((c.veto.veto === 'mo') !== tapVeto.has(c.ten)) loi.push(`tập vetoOpen đổi ở ô ${c.ten}`);
  if (luoi.has(c.ten) !== moThat) loi.push(`lệch ở lưới: ô ${c.ten}`);
  if (quet.has(c.ten) !== moThat) loi.push(`lệch ở máy quét: ô ${c.ten}`);
  const v = (j.vetoOpen || []).find(x => x.slug === c.ten);
  if (c.chuKy.ten === 'frontmatter-hong' && v && !v.signoffWarn)
    loi.push(`lệch ở máy quét: ô ${c.ten} nuốt im lỗi frontmatter`);
}
```

- [ ] **Bước 2: Viết hai lượt phá thử vào CÙNG chân**

```js
const dem = () => {
  const r = F.runPremerge(repo), s = F.runScan(repo);
  return [F.tenDongTong(r.out).length, (s.vetoOpenUnsigned || []).length];
};
const [l0, q0] = dem();
F.writeDossier(repo, 'them-chua-ky', { veto: F.VETO_CELLS[1], cong1: F.CONG1_CELLS[1],
  chuKy: F.SIGNOFF_CELLS.find(c => c.ten === 'rong-khuon') });
F.gitAll(repo, 'them chua ky');
const [l1, q1] = dem();
if (l1 !== l0 + 1 || q1 !== q0 + 1) loi.push(`không tăng đúng 1: lưới ${l0}->${l1}, máy quét ${q0}->${q1}`);
F.writeDossier(repo, 'them-da-ky', { veto: F.VETO_CELLS[1], cong1: F.CONG1_CELLS[1],
  chuKy: F.SIGNOFF_CELLS.find(c => c.ten === 'that-tran') });
F.gitAll(repo, 'them da ky');
const [l2, q2] = dem();
if (l2 !== l1 || q2 !== q1) loi.push(`hồ sơ đã ký vẫn làm tập tăng: lưới ${l1}->${l2}, máy quét ${q1}->${q2}`);
if (loi.length) { console.error(loi.join(' | ')); process.exit(1); }
console.log(`đẳng thức: ${o.length} ô khớp, lưới=${luoi.size}, máy quét=${quet.size}`);
```

- [ ] **Bước 3: Chạy**

Chạy: `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan dang-thuc`
Kỳ vọng: XANH, in `78 ô khớp`.

- [ ] **Bước 4: Ba chiều đỏ, ba thông điệp**

Bản sao lưới bỏ dòng rẽ `signoff_that` ở vòng veto-trace → `lệch ở lưới`.
Bản sao máy quét bỏ `signoffState` → `lệch ở máy quét`.
Bản sao máy quét đọc `human_signoff` bằng regex CẢ FILE → ô `...-chi-o-than` vỡ →
`lệch ở máy quét: ô …-chi-o-than`.

- [ ] **Bước 5: Commit**

```bash
git add _acceptance/cua-veto-sau-chu-ky/chan-dang-thuc.mjs _acceptance/cua-veto-sau-chu-ky/rang.sh
git commit -F - <<'MSG'
test(cua-veto-sau-chu-ky): đẳng thức hai bộ đọc trên ma trận 78 ô

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

**Verify (task):** `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan dang-thuc` exit 0 + ba vết chiều đỏ.
**Phục vụ:** E6.
**independent: false** (cần Task 5, Task 6).

---

### Task 8: Chân `luat-lan-can` — năm luật chặn vẫn nổ trên hồ sơ ĐÃ KÝ

**Files:**
- Tạo: `_acceptance/cua-veto-sau-chu-ky/chan-lan-can.mjs`
- Sửa: `_acceptance/cua-veto-sau-chu-ky/rang.sh`

- [ ] **Bước 1: Viết năm fixture, mỗi assert ghim đúng chuỗi**

```js
import * as F from './fixture.mjs';
const that = F.SIGNOFF_CELLS.find(c => c.ten === 'that-tran');   // MỌI ca đều ĐÃ KÝ
const CA = [
  { ten: 'da-veto-chua-xu', ghim: 'veto_state=da-veto chưa xử' },
  { ten: 'ghi-nguoc',       ghim: 'da-veto -> mo mà KHÔNG có entry sổ' },
  { ten: 'go-khoa',         ghim: 'khoá veto_state biến mất' },
  { ten: 'lan-v-t3',        ghim: 'làn V chỉ T2' },
  { ten: 'vet-hong',        ghim: 'veto_opened_at' },
];
// mỗi ca: dựng hồ sơ đúng hình dạng lỗi (da-veto · lật da-veto→mo không entry ·
// gỡ khoá sau khi rời draft · T2→T3 với approved_by rỗng · veto_opened_at 'hom-qua'),
// chạy lưới, đòi CÓ dòng VIOLATION chứa `ghim`. Số assert = 5, ca tự đếm.
// Đối chứng dương: bản đã gỡ lỗi của cùng năm hồ sơ → không VIOLATION nào của năm luật đó.
```

- [ ] **Bước 2: Chạy**

Chạy: `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan luat-lan-can`
Kỳ vọng: XANH, in `5 assert`.

- [ ] **Bước 3: Chiều đỏ**

Bản sao lưới cho nhánh `signoff_that` gọi `continue` ngay sau NOTE → ≥1 luật thôi
nổ → ĐỎ `chữ ký mở đường vòng` kèm tên luật.

- [ ] **Bước 4: Kiểm đối chứng dương không hằng-đúng**

Bản đã gỡ lỗi phải cho 0 VIOLATION của năm luật; nếu vẫn nổ thì fixture sai chứ
không phải vật — chân ĐỎ `fixture dựng sai, không đo được luật`.

- [ ] **Bước 5: Commit**

```bash
git add _acceptance/cua-veto-sau-chu-ky/chan-lan-can.mjs _acceptance/cua-veto-sau-chu-ky/rang.sh
git commit -F - <<'MSG'
test(cua-veto-sau-chu-ky): năm luật chặn lân cận vẫn nổ trên hồ sơ đã ký

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

**Verify (task):** `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan luat-lan-can` exit 0 + vết chiều đỏ.
**Phục vụ:** E8.
**independent: false** (cần Task 4).

---

### Task 9: Neo base + chân `khong-noi`

**Files:**
- Tạo: `_acceptance/cua-veto-sau-chu-ky/base-anchor.sh`
- Tạo: `_acceptance/cua-veto-sau-chu-ky/chan-khong-noi.mjs`
- Sửa: `_acceptance/cua-veto-sau-chu-ky/rang.sh`

**Giao diện:**
- Cung cấp: `base_anchor` in ra sha base; thoát **97** khi tự kiểm sai.

- [ ] **Bước 1: Viết bộ neo**

```bash
# _acceptance/cua-veto-sau-chu-ky/base-anchor.sh
# base = CHA của commit ĐẦU TIÊN đưa câu ghim vào lưới. KHÔNG neo origin/main:
# main trôi giữa lượt chấm, và sau khi hồ sơ gộp thì main đã mang bản sửa — hai
# chân sẽ tự chết ở chiến dịch ghim lại ([release-2-10-0#F1]).
base_anchor() {
  local c b
  c="$(git -C "$ROOT" log --reverse --format=%H -S "$CAU_GHIM" -- scripts/pre-merge-check.sh | head -1)"
  [ -n "$c" ] || { echo "LỖI HẠ TẦNG: base không hợp lệ — chưa có commit nào mang câu ghim"; exit 97; }
  b="$(git -C "$ROOT" rev-parse "$c^" 2>/dev/null)"
  [ -n "$b" ] || { echo "LỖI HẠ TẦNG: base không hợp lệ — commit $c không có cha"; exit 97; }
  if git -C "$ROOT" show "$b:scripts/pre-merge-check.sh" | grep -qF "$CAU_GHIM"; then
    echo "LỖI HẠ TẦNG: base không hợp lệ — bản base ĐÃ mang câu ghim"; exit 97
  fi
  if [ "$(git -C "$ROOT" rev-parse "$b:scripts/pre-merge-check.sh")" \
     = "$(git -C "$ROOT" rev-parse "HEAD:scripts/pre-merge-check.sh")" ]; then
    echo "LỖI HẠ TẦNG: base không hợp lệ — base trùng HEAD trên lưới"; exit 97
  fi
  echo "$b"
}
# Bản base lấy TRỌN thư mục (P150), không chép danh sách file tay:
#   git -C "$ROOT" archive "$b" scripts lib | tar -x -C "$d"
```

- [ ] **Bước 2: Viết chân so mã thoát và tập VIOLATION trên 78 ô**

Trên từng ô: chạy lưới BASE và lưới HEAD trên CÙNG kho fixture; đòi `code` bằng
nhau và tập dòng `VIOLATION` bằng nhau; đếm số ô có dòng `NOTE` khác nhau và đòi
≥ 1 (chứng hai bản thật sự khác nhau, không so một bản với chính nó). Lệch → ĐỎ
`bản sửa đổi luật chặn` kèm tên ô.

- [ ] **Bước 3: Chạy**

Chạy: `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan khong-noi`
Kỳ vọng: XANH, in sha base và số ô khác NOTE.

- [ ] **Bước 4: Hai chiều đỏ**

Bản sao lưới cho nhánh đã-ký `continue` trước các chốt bằng chứng → ĐỎ
`bản sửa đổi luật chặn`.
Lượt neo hỏng: chạy chân trên một bản sao kho đã revert câu ghim → thoát **97**
kèm `LỖI HẠ TẦNG`, KHÔNG xanh cũng KHÔNG đỏ trên vật.

- [ ] **Bước 5: Commit**

```bash
git add _acceptance/cua-veto-sau-chu-ky/base-anchor.sh _acceptance/cua-veto-sau-chu-ky/chan-khong-noi.mjs _acceptance/cua-veto-sau-chu-ky/rang.sh
git commit -F - <<'MSG'
test(cua-veto-sau-chu-ky): so với base neo theo commit sửa — chỉ đổi lời

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

**Verify (task):** `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan khong-noi` exit 0 và in sha base; lượt neo hỏng thoát 97.
**Phục vụ:** E7.
**independent: false** (cần Task 3 để câu ghim tồn tại, Task 7 để có ma trận).

---

### Task 10: Chân `cay-that`

**Files:**
- Tạo: `_acceptance/cua-veto-sau-chu-ky/chan-cay-that.mjs`
- Sửa: `_acceptance/cua-veto-sau-chu-ky/rang.sh`

- [ ] **Bước 1: Viết bộ đọc ĐỘC LẬP**

Node đọc thẳng `veto_state` của từng `contract.md` và `human_signoff` ở
frontmatter DẪN ĐẦU của `evidence-report.md`, cộng bảng giữ-chỗ rút từ lưới
(`F.placeholderPatterns()`), để tính tập kỳ vọng. KHÔNG gọi lưới, KHÔNG gọi máy
quét — nếu gọi thì phép so hằng-đúng.

- [ ] **Bước 2: So trên cây thật**

```js
const out = execFileSync('bash', [`${F.ROOT}/scripts/pre-merge-check.sh`, F.ROOT, '--recheck-all'],
  { encoding: 'utf8', maxBuffer: 1e8 });      // mã thoát khác 0 là bình thường ở cây thật
const j = JSON.parse(execFileSync('node', [`${F.ROOT}/scripts/start-scan.mjs`, '--root', F.ROOT],
  { encoding: 'utf8', maxBuffer: 1e8 }));
// đòi: tenDongTong(out) === j.vetoOpenUnsigned === tập kỳ vọng;
//      giao(tập kỳ vọng, tập đã-ký) rỗng; 0 dòng NOTE «cửa veto mở» cho hồ sơ đã ký;
// sàn: tập kỳ vọng >= 1 VÀ tập đã-ký >= 1 (không ghim tên, không ghim số)
```

- [ ] **Bước 3: Chạy**

Chạy: `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan cay-that`
Kỳ vọng: XANH, in `<n> cửa mở / <m> đã ký` (hôm nay đọc ra 3 và 27 — số đọc ra,
KHÔNG ghim).

- [ ] **Bước 4: Chiều đỏ bằng lưới base**

Dùng `base_anchor` của Task 9 dựng bản base, chạy trên CÂY THẬT → giao với tập
đã-ký KHÁC rỗng → in vết `bản cũ liệt <n> hồ sơ đã ký`. Neo sai → thoát 97.

- [ ] **Bước 5: Commit**

```bash
git add _acceptance/cua-veto-sau-chu-ky/chan-cay-that.mjs _acceptance/cua-veto-sau-chu-ky/rang.sh
git commit -F - <<'MSG'
test(cua-veto-sau-chu-ky): cây thật — dòng tổng bằng tập chưa ký

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

**Verify (task):** `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan cay-that` exit 0 + vết `bản cũ liệt <n> hồ sơ đã ký`.
**Phục vụ:** E10.
**independent: false** (cần Task 5, Task 9).

---

### Task 11: Văn bản — thân lệnh, `START-SCAN-KEYS`, `CONTEXT.md` + chân `van-ban`

**Files:**
- Sửa: `commands/start.md` (khối `START-SCAN-KEYS` + mục «Còn veto được»)
- Sửa: `commands/acceptance-status.md` (mục 4)
- Sửa: `CONTEXT.md` (mục **Máy đã thông**)
- Tạo: `_acceptance/cua-veto-sau-chu-ky/chan-van-ban.mjs`
- Sửa: `_acceptance/cua-veto-sau-chu-ky/rang.sh`

- [ ] **Bước 1: Thêm ba khoá vào `START-SCAN-KEYS`**

`vetoOpen[].humanSignoff` · `vetoOpen[].signoffWarn` · `vetoOpenUnsigned[]`
(đặt cạnh `vetoOpen[].slug vetoOpen[].status` đang có).

- [ ] **Bước 2: Đổi hai câu dặn thành câu CHÉP**

Trong `commands/start.md` và `commands/acceptance-status.md`:

> `vetoOpenUnsigned` có phần tử → in **TÊN từng hồ sơ** trong danh sách đó,
> nguyên văn, không tự lọc `vetoOpen`. Hồ sơ đã có chữ ký người không hiện ở mục
> này: chữ ký Cổng Bằng chứng đã đóng cửa veto.

- [ ] **Bước 3: Thêm luật vào `CONTEXT.md`** (mục **Máy đã thông**): chữ ký Cổng
  Bằng chứng ĐÓNG cửa veto; `_Avoid_`: gọi hồ sơ đã ký là «còn veto được».

- [ ] **Bước 4: Viết chân `van-ban` và chạy**

Chân đọc cây thật: (a) hai thân lệnh có câu chép và KHÔNG còn câu dặn tự lọc
`vetoOpen`; (b) khối `START-SCAN-KEYS` khai đủ ba khoá VÀ
`ONLY_BLOCK=P99 bash tests/plugins/run-tests.sh` in `PASS: P99`; (c) `CONTEXT.md`
có luật kèm `_Avoid_`. Ba chiều đỏ gỡ từng vật trên bản sao, ba thông điệp khác
nhau.

- [ ] **Bước 5: Commit**

```bash
git add commands/start.md commands/acceptance-status.md CONTEXT.md _acceptance/cua-veto-sau-chu-ky/chan-van-ban.mjs _acceptance/cua-veto-sau-chu-ky/rang.sh
git commit -F - <<'MSG'
docs(cua-veto-sau-chu-ky): thẻ chép danh sách vetoOpenUnsigned; luật vào CONTEXT

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

**Verify (task):** `bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan van-ban` exit 0 (đã gồm P99).
**Phục vụ:** E11.
**independent: false** (cần Task 5 — khoá phải tồn tại thật trước khi khai).

---

### Task 12: Ca thường trực `tests/scripts/cua-veto-sau-chu-ky.test.mjs`

**Files:**
- Tạo: `tests/scripts/cua-veto-sau-chu-ky.test.mjs`
- Sửa: `tests/scripts/run-tests.sh`

- [ ] **Bước 1: Viết ca**

Ba ca trên fixture code-sinh, import `fixture.mjs` theo đường dẫn suy từ vị trí
ca (`path.resolve(__dirname, '../../_acceptance/cua-veto-sau-chu-ky/fixture.mjs')`):

- `CVS1` hồ sơ làn V đã ký → lưới in câu ghim, không có tên ở dòng tổng;
- `CVS2` hồ sơ làn V chưa ký → vẫn «cửa veto mở» và có tên;
- `CVS3` `vetoOpenUnsigned` = tập tên dòng tổng trên cùng kho fixture.

Sàn đếm: biến `assert` = 0 → exit 1 kèm `0 assertion`.

- [ ] **Bước 2: Chiều đỏ tự chạy trong ca**

Chép `scripts/pre-merge-check.sh` sang thư mục tạm, gỡ nhánh `signoff_that` bằng
`perl -0pi -e` trên BẢN SAO, chạy lại `CVS1` → đòi ĐỎ kèm `chữ ký không đóng cửa`.
Không đỏ → ca exit 1 với `chiều đỏ không chạy`.

- [ ] **Bước 3: Nạp vào suite**

```bash
echo "CVS cua-veto-sau-chu-ky"
node "$HERE/cua-veto-sau-chu-ky.test.mjs" || FAIL_COUNT=$((FAIL_COUNT+1))
```

- [ ] **Bước 4: Chạy**

Chạy: `node tests/scripts/cua-veto-sau-chu-ky.test.mjs` → exit 0.
Chạy: `bash tests/scripts/run-tests.sh` → có dòng `CVS cua-veto-sau-chu-ky`, kết
thúc `0 failed`.

- [ ] **Bước 5: Commit**

```bash
git add tests/scripts/cua-veto-sau-chu-ky.test.mjs tests/scripts/run-tests.sh
git commit -F - <<'MSG'
test(cua-veto-sau-chu-ky): ca thường trực cho luật chữ ký đóng cửa veto

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
```

**Verify (task):** `node tests/scripts/cua-veto-sau-chu-ky.test.mjs && bash tests/scripts/run-tests.sh`
**Phục vụ:** E12.
**independent: false** (cần Task 5; nên đứng sau Task 7 để dùng lại bộ so).

---

### Task 13: Chốt trước S4

**Files:** không tạo mới; chỉ chạy, và sửa nếu đỏ.

- [ ] **Bước 1: Chạy trọn mười chân**

```bash
for c in note-da-ky that-con-mo dong-tong giu-cho nhan-khong-dong dang-thuc khong-noi luat-lan-can cay-that van-ban; do
  bash _acceptance/cua-veto-sau-chu-ky/rang.sh --chan "$c" || exit 1
done
```

- [ ] **Bước 2: Chạy bốn suite + lint + bản đồ**

```bash
bash tests/scripts/run-tests.sh && bash tests/hooks/run-tests.sh \
  && bash tests/workflows/run-tests.sh && node scripts/product-map.mjs --root . --check \
  && node scripts/eval-coverage-lint.js .
```

- [ ] **Bước 3: Chạy lưới trên chính kho kit**

Chạy: `bash scripts/pre-merge-check.sh . --base origin/main`
Đọc dòng «cửa veto đang mở»: chỉ còn hồ sơ chưa ký.

- [ ] **Bước 4: Đặt `status: implemented`**

Sửa `_acceptance/cua-veto-sau-chu-ky/contract.md`, commit, rồi dispatch S4 NGAY
trong cùng lượt (không dừng chờ người ở ranh giới này).

**Verify (task):** ba lệnh trên đều exit 0.
**Phục vụ:** E1–E12 (lượt chạy toàn cục trước S4).
**independent: false** (cuối chuỗi).

---

## Thứ tự và vì sao

1. **DV5 xanh ở TỪNG commit.** Chỉ Task 3 và Task 4 chạm `pre-merge-check.sh`, và
   cả hai chỉ CHÈN (hàm mới · nhánh `elif` mới · một dòng rẽ trước `case`).
   Verify của cả hai task gọi `node tests/scripts/additive-only.test.mjs`, nên một
   lần lỡ sửa-đè dòng cũ bị bắt ngay tại commit đó, không dồn về cuối. Task 5 đổi
   `start-scan.mjs` — tệp KHÔNG thuộc DV5 — nên được sửa tự do.
2. **Fixture trước mọi chân đọc nó.** Task 1 sinh 78 ô và hai bộ chạy; từ Task 2
   chỉ tiêu thụ. Không chân nào tự dựng fixture riêng — đó là hình dạng «bên viết
   và bên đọc trôi khỏi nhau».
3. **Đo trước, cắm sau.** Task 2 viết chân rồi chạy ĐỎ trên cây hôm nay; Task 3
   cắm luật và chân chuyển XANH. Cặp hai chiều nằm trong chính task, không để dành
   cho S4.
4. **Neo base sau khi câu ghim đã tồn tại.** `base_anchor` tìm commit đầu tiên
   mang câu ghim, nên Task 9 phải đứng sau Task 3; chạy sớm hơn thì chân thoát 97
   (đúng thiết kế nhưng vô ích).
5. **Văn bản sau vật.** Task 11 chỉ khai khoá sau khi Task 5 sinh ra khoá thật, để
   `START-SCAN-KEYS` không khai một thứ chưa tồn tại (ca P99 sẽ đỏ).
6. **Ca thường trực gần cuối.** Nó dùng lại bộ so của Task 7 và là vật sống sót
   sau khi răng hồ sơ chết theo hồ sơ.

## Tự soi (sau khi viết)

- **Phủ đặc tả:** AC-1/AC-2 → Task 2, 3 · AC-3 → Task 4 · AC-4 → Task 5, 6 ·
  AC-5 → Task 5 · AC-6 → Task 1, 7 · AC-7 → Task 9 · AC-8 → Task 8 · AC-9 →
  verify của Task 3, 4 · AC-10 → Task 10 · AC-11 → Task 11 · AC-12 → Task 12.
  Không AC nào thiếu task.
- **Giữ chỗ:** không «TBD», không «xử lý lỗi phù hợp»; mọi bước có lệnh hoặc mã.
- **Tên khớp giữa các task:** `signoff_that` / `SIGNOFF_THAT` (bash) ·
  `signoffState` → `{signed, warn}` (JS) · `humanSignoff` · `signoffWarn` ·
  `vetoOpenUnsigned` · `cells()` = 78 · `CAU_GHIM` — dùng đúng một cách ở mọi task.
- **Chưa đo được, khai trước:** thẻ `/start` render thế nào vẫn là câu chép
  (AC-11a); ngưỡng đang đếm ghi ở `## Notes` của hợp đồng.
