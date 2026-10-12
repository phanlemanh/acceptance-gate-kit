# Bước lên thiết kế không hỏi người — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bước thiết kế của vòng không dừng hỏi người; mỗi lựa chọn mang khoá `can_cu` máy đọc, bộ xếp lớp tất định chia «máy đã quyết / câu hỏi / đỏ / đời trước / bị thay», và thẻ Cổng Phạm vi hiện câu chỉ-người-biết tách khỏi lựa chọn máy đã quyết.

**Architecture:** Một mô-đun CJS `scripts/can-cu-s1.cjs` (không phụ thuộc ngoài) là bộ đọc duy nhất của khoá `can_cu`; thẻ `scripts/gate-card.js` Cổng 1 gọi nó; lệnh `--dem` của chính mô-đun là đường đo. Lời dặn bước thiết kế (SKILL feature-loop) có hai khối khuôn marker mới — bên viết — và ca đo rút khuôn từ marker rồi ghi bằng chính khối lệnh `DEC-ID-RECIPE` (round-trip).

**Tech Stack:** Node ≥ 20 (CJS + ESM test), bash/zsh, git. Không thêm phụ thuộc.

**Spec:** `docs/superpowers/specs/2026-10-11-buoc-len-thiet-ke-khong-hoi-design.md` · hợp đồng `_acceptance/buoc-len-thiet-ke-khong-hoi/contract.md` (10 AC, đã duyệt 11/10) · phép đo `_acceptance/buoc-len-thiet-ke-khong-hoi/evals.yaml` (E1–E10).

## Global Constraints

- KHÔNG chạm: khối TRONG-DOT, `feature-loop/scripts/`, `feature-loop/workflows/`, `dieu-phoi/`, `scripts/cat-luot.mjs`, `skills/cat-luot/`, `lib/`, `hooks/`, `scripts/pre-merge-check.sh`, `commands/approve.md`, `_acceptance/config.yaml`.
- Mọi khối marker có sẵn của SKILL feature-loop giữ từng byte; khối mới đúng là `DEC-CAN-CU-SLOT`, `DEC-LAT-GATE1`.
- Câu trích so sau khi gom khoảng trắng; ngắn hơn **20** ký tự là quá ngắn.
- Mười một thông điệp đỏ là hằng `LY_DO` trong mô-đun (chữ nguyên văn bảng §3.3 design doc).
- Ca đo in đúng dòng `PASS: CC-…` mà evals.yaml ghim; tệp ca `tests/scripts/can-cu-s1.ca.mjs` (KHÔNG đuôi `.test.mjs`) gọi từ phần bash của `tests/scripts/run-tests.sh`.
- Mọi kho thử do code sinh trong lượt (thư mục tạm + `git init`); đường dẫn suy từ vị trí tệp ca.
- Phép so «phần vòng tự đổi» neo vào LỊCH SỬ: tìm commit gộp `Merge pull request #N from <chủ>/vong/a2-thiet-ke-khong-hoi-thua` trong lịch sử HEAD → [merge-base(m^1, m^2), m^2]; chưa gộp → [merge-base(HEAD, origin/main|main), HEAD]; hai đầu trùng → ca FAIL có tên. Vật của vòng đọc ở đỉnh tầm (git show), không ở cây sống.
- Hồ sơ đã ký không đổi màu; dòng sổ không có `can_cu` là đời trước.

## Review Focus

1. Con trỏ `tep` viết `./CLAUDE.md` hoặc `docs\\luat.md` → chuẩn hoá về cùng đường; `../ngoai.md` thoát gốc → `tep-vang` (ca trong ma trận Task 1).
2. Sổ có dòng JSON hỏng xen giữa dòng S1 → bộ xếp lớp bỏ qua dòng hỏng, các dòng khác vẫn đúng lớp (ca trong ma trận Task 1).
3. Câu trích chứa `'`, `%`, `$`, `«»`, backtick → ghi bằng khối lệnh thật dưới bash và zsh vẫn đọc lại đúng (Task 3, CC-03).
4. Một dòng bị chính dòng sau nó thay, khi dòng thay đứng sau một dòng đỏ → dòng cũ ra `bi-thay`, không lên thẻ (Task 1 ma trận + Task 4 thẻ).
5. Thẻ dựng với `--glossary-base` trỏ một ref không có → cờ vàng «không đọc được gốc nhánh», không đỏ (Task 4).

---

### Task 1: Bộ xếp lớp `scripts/can-cu-s1.cjs` + ma trận CC-04 + móc vào bộ chạy

**independent: false** · phục vụ **E4** (và nền cho E3, E5, E6, E7, E10)

**Files:**
- Create: `scripts/can-cu-s1.cjs`
- Create: `tests/scripts/can-cu-s1.ca.mjs`
- Modify: `tests/scripts/run-tests.sh` (ngay trước dòng `# <<<KET-SUITE`)

**Interfaces:**
- Produces (CJS `module.exports`): `NGUON: string[]` · `LY_DO: Record<ma, thong_diep>` · `GHI_CHU: {'chua-kiem-goc': string}` · `CO: { doiTruoc(n): string, chuaKiemGoc: string, gocLoi(base): string, dong(key, td): string }` · `TRICH_MIN = 20` · `docSo(text) → {entries, broken}` · `phanLoaiDong(e, nc) → null | {lop, ma?, thong_diep?, ghi_chu?}` · `phanLoaiSo(entries, ctx) → {cau_hoi: D[], da_quyet: D[], do: D[], doi_truoc: number, bi_thay: number, goc: 'da-kiem'|'chua-kiem'|'loi', dong: D[]}` với `D = {id, i, e, lop, lop_goc, ma?, thong_diep?, ghi_chu?, nhan?}` (`nhan = 'Hỏi-<k>'` chỉ ở `cau_hoi`) · `dem(root, opts?) → Row[]` · `chuanTep(tep) → string|null`.
- `ctx = { root, slug, base?: string|null, docTep?: (rel) => string|null }` — `docTep` vắng thì đọc đĩa dưới `root`.
- CLI: `node scripts/can-cu-s1.cjs --root <kho> --slug <s> [--base <ref>] [--json]` (thoát 1 khi có dòng đỏ, 2 khi đối số sai) · `node scripts/can-cu-s1.cjs --root <kho> --dem [--json]`.

- [ ] **Step 1: Viết ca hỏng trước** — `tests/scripts/can-cu-s1.ca.mjs` với khung harness + kho thử + ma trận CC-04 (mô-đun chưa có nên ca đỏ):

```js
// can-cu-s1.ca.mjs — ca đo hồ sơ buoc-len-thiet-ke-khong-hoi (CC-02..CC-10). Gọi từ phần bash của
// tests/scripts/run-tests.sh (khoá executor scripts_bash). Kho thử do code sinh; đường dẫn suy từ vị trí tệp.
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const MOD = path.join(ROOT, 'scripts', 'can-cu-s1.cjs');
const require = createRequire(import.meta.url);
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };
const eq = (got, want, what) => { if (JSON.stringify(got) !== JSON.stringify(want)) die(`${what}\n  got : ${JSON.stringify(got)}\n  want: ${JSON.stringify(want)}`); };
const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const ghiTep = (root, rel, t) => { mkdirSync(path.dirname(path.join(root, rel)), { recursive: true }); writeFileSync(path.join(root, rel), t); };

// Câu trích viết sẵn — giá trị mong đợi KHÔNG rút từ đầu ra mô-đun.
const Q_GOC = 'Quy tắc gốc của kho: mọi bảng phải có khoá chính rõ ràng.';
const Q_LUAT = 'Luật kho: đổi khuôn dữ liệu phải có đường đọc bản cũ.';
const Q_NGAN = 'khoá chính';                       // có trong tệp, < 20 ký tự
const Q_THEM = 'Câu thêm vào tệp có sẵn ngay trong nhánh của vòng.';
const Q_MOI = 'Quy tắc mới đặt trong nhánh để tự biện minh cho lựa chọn.';
const Q_HD = 'Hợp đồng nói bảng mới dùng khoá tự tăng cho mọi dòng.';
const Q_O = 'Ô đã ký nói bước thiết kế không dừng hỏi người.';
// Kho thử: commit gốc (CLAUDE.md, docs/luat.md) → nhánh thêm vật của vòng + câu mới.
export function mkKho({ oDaKy = true } = {}) {
  const r = mkdtempSync(path.join(tmpdir(), 'cancu-'));
  git(r, 'init', '-q'); git(r, 'config', 'user.email', 't@t'); git(r, 'config', 'user.name', 't');
  ghiTep(r, 'CLAUDE.md', `# Luật\n\n${Q_GOC}\n`);
  ghiTep(r, 'docs/luat.md', `${Q_LUAT}\n`);
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'goc');
  const base = git(r, 'rev-parse', 'HEAD');
  ghiTep(r, 'CLAUDE.md', `# Luật\n\n${Q_GOC}\n${Q_THEM}\n`);
  ghiTep(r, 'docs/moi.md', `${Q_MOI}\n`);
  ghiTep(r, '_acceptance/h/contract.md', `---\nslug: h\nstatus: draft\ndesign_doc: docs/superpowers/specs/2026-10-11-h-design.md\n---\n\n${Q_HD}\n`);
  ghiTep(r, 'docs/superpowers/specs/2026-10-11-h-design.md', `# h\n\n${Q_HD}\n`);
  ghiTep(r, '_acceptance/h/opportunity.md', `---\nslug: h\ndecision: ${oDaKy ? 'build' : ''}\ndecided_by: ${oDaKy ? 'Chủ Kho' : ''}\n---\n\n${Q_O}\n`);
  git(r, 'add', '-A'); git(r, 'commit', '-qm', 'nhanh');
  return { r, base };
}
const S1 = (id, can_cu, extra = {}) => Object.assign({ id, type: 'approach', stage: 'S1', at: '2026-10-11T00:00:00Z', decision: 'Lựa chọn ' + id, why: 'vì', cost_if_wrong: 'tốn' }, can_cu === undefined ? {} : { can_cu }, extra);
const MT = (tep, trich, kho_dao = false) => ({ nguon: 'muc-tieu', kho_dao, tep, trich });
// Ma trận viết sẵn: [tên ca, dòng, dùng gốc?, lớp mong đợi, mã mong đợi, thông điệp mong đợi]
export const MA_TRAN = [
  ['mt-hop-le-co-goc', S1('a', MT('CLAUDE.md', Q_GOC)), true, 'da-quyet', null, null],
  ['mt-hop-le-khong-goc', S1('a', MT('CLAUDE.md', Q_GOC)), false, 'da-quyet', null, null],
  ['mt-tep-cham-gach', S1('a', MT('./CLAUDE.md', Q_GOC)), true, 'da-quyet', null, null],
  ['mt-thieu-con-tro', S1('a', { nguon: 'muc-tieu', kho_dao: false }), true, 'do', 'thieu-con-tro', 'thiếu con trỏ căn cứ (tệp + câu trích)'],
  ['mt-tep-vang', S1('a', MT('docs/khong-co.md', Q_GOC)), true, 'do', 'tep-vang', 'tệp căn cứ không có'],
  ['mt-tep-thoat-goc', S1('a', MT('../ngoai.md', Q_GOC)), true, 'do', 'tep-vang', 'tệp căn cứ không có'],
  ['mt-trich-ngan', S1('a', MT('CLAUDE.md', Q_NGAN)), true, 'do', 'trich-ngan', 'câu trích quá ngắn để làm căn cứ'],
  ['mt-trich-vang', S1('a', MT('CLAUDE.md', 'Câu này không hề có trong tệp căn cứ nào cả.')), true, 'do', 'trich-vang', 'câu trích không có trong tệp căn cứ'],
  ['mt-tu-bien-minh-contract', S1('a', MT('_acceptance/h/contract.md', Q_HD)), true, 'do', 'tu-bien-minh', 'căn cứ trỏ vào vật của chính vòng'],
  ['mt-tu-bien-minh-design', S1('a', MT('docs/superpowers/specs/2026-10-11-h-design.md', Q_HD)), true, 'do', 'tu-bien-minh', 'căn cứ trỏ vào vật của chính vòng'],
  ['mt-tu-bien-minh-so', S1('a', MT('_acceptance/h/decisions.jsonl', 'Lựa chọn a được ghi vào sổ của vòng.')), true, 'do', 'tu-bien-minh', 'căn cứ trỏ vào vật của chính vòng'],
  ['mt-o-da-ky-moi-trong-nhanh', S1('a', MT('_acceptance/h/opportunity.md', Q_O)), true, 'da-quyet', null, null],
  ['mt-sinh-trong-vong-tep-moi', S1('a', MT('docs/moi.md', Q_MOI)), true, 'do', 'sinh-trong-vong', 'câu trích không có ở gốc nhánh — căn cứ sinh trong vòng'],
  ['mt-sinh-trong-vong-cau-them', S1('a', MT('CLAUDE.md', Q_THEM)), true, 'do', 'sinh-trong-vong', 'câu trích không có ở gốc nhánh — căn cứ sinh trong vòng'],
  ['mt-kho-dao', S1('a', MT('CLAUDE.md', Q_GOC, true)), true, 'do', 'kho-dao', 'khó-đảo luôn là câu hỏi cho người'],
  ['ml-co-loi-chet', S1('a', { nguon: 'mot-loi', kho_dao: false, loi_chet: 'Lối kia chạm tệp ngoài ranh giới lời giao.' }), true, 'da-quyet', null, null],
  ['ml-thieu-loi-chet', S1('a', { nguon: 'mot-loi', kho_dao: false }), true, 'do', 'thieu-loi-chet', 'một lối ra nhưng không nói lối khác chết vì sao'],
  ['ml-kho-dao', S1('a', { nguon: 'mot-loi', kho_dao: true, loi_chet: 'Lối kia không còn.' }), true, 'do', 'kho-dao', 'khó-đảo luôn là câu hỏi cho người'],
  ['cn-du', S1('a', { nguon: 'chi-nguoi', kho_dao: false, khuyen: 'Giữ ba loại giai đoạn.', loi_khac: 'Thêm loại thứ tư — sửa hai tiêu chí.' }), true, 'cau-hoi', null, null],
  ['cn-kho-dao', S1('a', { nguon: 'chi-nguoi', kho_dao: true, khuyen: 'Giữ bản ghi cũ.', loi_khac: 'Xoá bản ghi cũ — không lấy lại được.' }), true, 'cau-hoi', null, null],
  ['cn-thieu-khuyen', S1('a', { nguon: 'chi-nguoi', kho_dao: false, loi_khac: 'Lối khác.' }), true, 'do', 'thieu-khuyen', 'câu chỉ-người-biết thiếu khuyến nghị hoặc lối khác'],
  ['cn-thieu-loi-khac', S1('a', { nguon: 'chi-nguoi', kho_dao: false, khuyen: 'Khuyên.' }), true, 'do', 'thieu-khuyen', 'câu chỉ-người-biết thiếu khuyến nghị hoặc lối khác'],
  ['nguon-la', S1('a', { nguon: 'muc_tieu', kho_dao: false, tep: 'CLAUDE.md', trich: Q_GOC }), true, 'do', 'nguon-la', 'nguồn căn cứ lạ'],
  ['doi-truoc', S1('a', undefined), true, 'doi-truoc', null, null],
  ['ngoai-s1', Object.assign(S1('a', MT('docs/khong-co.md', Q_GOC)), { stage: 'S2' }), true, null, null, null],
];
export function chayMaTran(mod, kho) {
  const lech = [];
  for (const [ten, e, coGoc, lop, ma, td] of MA_TRAN) {
    const kq = mod.phanLoaiSo([e], { root: kho.r, slug: 'h', base: coGoc ? kho.base : null });
    const d = kq.dong[0] || null;
    const got = d ? [d.lop, d.ma || null, d.thong_diep || null] : [null, null, null];
    if (JSON.stringify(got) !== JSON.stringify([lop, ma, td])) lech.push(`${ten}: got ${JSON.stringify(got)} want ${JSON.stringify([lop, ma, td])}`);
  }
  return lech;
}
```

```js
// (tiếp tệp) CC-04 — ma trận + ca phụ
check(`CC-04 ma-tran (${MA_TRAN.length} ca)`, () => {
  if (MA_TRAN.length < 22) die('ma tran duoi 22 ca');
  const mod = require(MOD); const kho = mkKho();
  const lech = chayMaTran(mod, kho);
  if (lech.length) die('lech:\n    ' + lech.join('\n    '));
  // ghi chú «chưa kiểm» chỉ khi không có gốc
  const k = mod.phanLoaiSo([S1('a', MT('CLAUDE.md', Q_GOC))], { root: kho.r, slug: 'h', base: null });
  eq(k.dong[0].ghi_chu, 'chưa kiểm câu trích có từ trước vòng', 'ghi chú khi không gốc'); eq(k.goc, 'chua-kiem', 'goc');
  const l = mod.phanLoaiSo([S1('a', MT('CLAUDE.md', Q_GOC))], { root: kho.r, slug: 'h', base: 'khong-co-ref' });
  eq([l.goc, l.dong[0].lop], ['loi', 'da-quyet'], 'gốc không đọc được → lỗi gốc, không đỏ');
  // ô chưa ký
  const kho2 = mkKho({ oDaKy: false });
  const m = mod.phanLoaiSo([S1('a', MT('_acceptance/h/opportunity.md', Q_O))], { root: kho2.r, slug: 'h', base: kho2.base });
  eq([m.dong[0].lop, m.dong[0].ma], ['do', 'o-chua-ky'], 'ô cơ hội chưa ký');
  // bị thay — kể cả khi dòng thay đứng sau một dòng đỏ; dòng hỏng xen giữa bị bỏ qua
  const raw = [JSON.stringify(S1('x', { nguon: 'mot-loi', kho_dao: false })), '{hỏng', JSON.stringify(S1('do1', { nguon: 'la' })), JSON.stringify(S1('y', { nguon: 'mot-loi', kho_dao: false, loi_chet: 'Lối kia chết vì ranh giới.' }, { supersedes: 'x' }))].join('\n');
  const so = mod.docSo(raw); eq(so.broken, 1, 'dòng hỏng đếm');
  const t = mod.phanLoaiSo(so.entries, { root: kho.r, slug: 'h', base: kho.base });
  eq(t.dong.map(d => [d.id, d.lop]), [['x', 'bi-thay'], ['do1', 'do'], ['y', 'da-quyet']], 'bị thay');
  eq([t.bi_thay, t.do.length, t.da_quyet.length], [1, 1, 1], 'đếm lớp');
  // nhãn Hỏi-n theo thứ tự sổ
  const h = mod.phanLoaiSo([MA_TRAN.find(x => x[0] === 'cn-du')[1], Object.assign({}, MA_TRAN.find(x => x[0] === 'cn-kho-dao')[1], { id: 'b' })], { root: kho.r, slug: 'h' });
  eq(h.cau_hoi.map(d => [d.id, d.nhan]), [['a', 'Hỏi-1'], ['b', 'Hỏi-2']], 'nhãn Hỏi-n');
});
```

- [ ] **Step 2: Chạy, thấy đỏ** — `node tests/scripts/can-cu-s1.ca.mjs` → FAIL «Cannot find module …can-cu-s1.cjs».

- [ ] **Step 3: Viết mô-đun** `scripts/can-cu-s1.cjs`:

```js
#!/usr/bin/env node
'use strict';
// can-cu-s1.cjs — bộ xếp lớp căn cứ cho dòng sổ bước thiết kế (hồ sơ buoc-len-thiet-ke-khong-hoi, ADR 0022).
// Mỗi dòng `stage: "S1"` của decisions.jsonl ra đúng một lớp: da-quyet · cau-hoi · do · doi-truoc · bi-thay.
// Kiểm VẬT (nguồn, con trỏ, khó-đảo) — không đọc nghĩa câu; nghĩa do phản biện context sạch soi (S1#7).
// Ba người dùng: thẻ Cổng Phạm vi (gate-card.js) · lệnh đếm của đường đo (--dem) · bộ kiểm (can-cu-s1.ca.mjs).
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const NGUON = ['muc-tieu', 'mot-loi', 'chi-nguoi'];
const LY_DO = {
  'nguon-la': 'nguồn căn cứ lạ',
  'kho-dao': 'khó-đảo luôn là câu hỏi cho người',
  'thieu-con-tro': 'thiếu con trỏ căn cứ (tệp + câu trích)',
  'tep-vang': 'tệp căn cứ không có',
  'trich-ngan': 'câu trích quá ngắn để làm căn cứ',
  'trich-vang': 'câu trích không có trong tệp căn cứ',
  'tu-bien-minh': 'căn cứ trỏ vào vật của chính vòng',
  'o-chua-ky': 'căn cứ là ô cơ hội chưa ký',
  'sinh-trong-vong': 'câu trích không có ở gốc nhánh — căn cứ sinh trong vòng',
  'thieu-loi-chet': 'một lối ra nhưng không nói lối khác chết vì sao',
  'thieu-khuyen': 'câu chỉ-người-biết thiếu khuyến nghị hoặc lối khác',
};
const GHI_CHU = { 'chua-kiem-goc': 'chưa kiểm câu trích có từ trước vòng' };
const CO = {
  doiTruoc: n => `${n} dòng sổ đời trước ở bước thiết kế chưa ghi nguồn căn cứ — thẻ đọc chúng như cũ.`,
  chuaKiemGoc: 'Có lựa chọn máy đã quyết theo căn cứ nhưng thẻ chưa nhận gốc nhánh — chưa kiểm câu trích có từ trước vòng; dựng lại thẻ với --glossary-base <gốc nhánh>.',
  gocLoi: b => `Không đọc được gốc nhánh «${b}» — chưa kiểm câu trích có từ trước vòng.`,
  dong: (key, td) => `Sổ bước thiết kế — ${key}: ${td}`,
};
const TRICH_MIN = 20;
const gom = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
const chuoi = v => (typeof v === 'string' ? v.trim() : '');

function docSo(text) {
  const entries = []; let broken = 0;
  for (const line of String(text || '').split('\n')) {
    if (!line.trim()) continue;
    try { const e = JSON.parse(line); if (e && typeof e === 'object' && !Array.isArray(e)) entries.push(e); else broken++; } catch (_) { broken++; }
  }
  return { entries, broken };
}
function frontmatter(t) {
  const m = String(t || '').match(/^---\r?\n([\s\S]*?)\r?\n---/); const o = {};
  if (m) for (const l of m[1].split('\n')) { const mm = l.match(/^(\w+)\s*:\s*(.*)$/); if (mm) o[mm[1]] = mm[2].replace(/\s+#.*$/, '').trim(); }
  return o;
}
function chuanTep(tep) {
  const t = chuoi(tep).replace(/\\/g, '/');
  if (!t || path.posix.isAbsolute(t)) return null;
  const n = path.posix.normalize(t);
  return n === '..' || n.startsWith('../') ? null : n;
}
const docDia = root => rel => { try { return fs.readFileSync(path.join(root, rel), 'utf8'); } catch (_) { return null; } };
function taoNguCanh(ctx) {
  const root = ctx.root || '.'; const slug = ctx.slug; const hoSo = `_acceptance/${slug}/`;
  const doc = ctx.docTep || docDia(root);
  const designDoc = chuanTep(frontmatter(doc(`${hoSo}contract.md`)).design_doc || '');
  const oFm = frontmatter(doc(`${hoSo}opportunity.md`));
  let goc = 'chua-kiem';
  if (ctx.base) goc = spawnSync('git', ['-C', root, 'rev-parse', '--verify', '--quiet', `${ctx.base}^{commit}`]).status === 0 ? 'da-kiem' : 'loi';
  return { root, slug, hoSo, doc, designDoc, oDaKy: !!(chuoi(oFm.decision) && chuoi(oFm.decided_by)), base: ctx.base || null, goc, memo: new Map() };
}
function tepOGoc(nc, rel) {
  if (!nc.memo.has(rel)) {
    const r = spawnSync('git', ['-C', nc.root, 'show', `${nc.base}:${rel}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    nc.memo.set(rel, r.status === 0 ? r.stdout : null);
  }
  return nc.memo.get(rel);
}
function laVatCuaVong(nc, rel) {
  if (rel.startsWith(nc.hoSo)) return rel !== `${nc.hoSo}opportunity.md`;
  if (nc.designDoc && rel === nc.designDoc) return true;
  return /^docs\/superpowers\/(specs|plans)\//.test(rel) && path.posix.basename(rel).includes(nc.slug);
}
const ra = (lop, ma, them) => Object.assign({ lop }, ma ? { ma, thong_diep: LY_DO[ma] } : {}, them || {});

function phanLoaiDong(e, nc) {
  if (!e || e.stage !== 'S1') return null;
  const c = e.can_cu;
  if (c === undefined) return ra('doi-truoc');
  if (!c || typeof c !== 'object' || Array.isArray(c) || !NGUON.includes(c.nguon)) return ra('do', 'nguon-la');
  if (c.nguon === 'chi-nguoi') return chuoi(c.khuyen) && chuoi(c.loi_khac) ? ra('cau-hoi') : ra('do', 'thieu-khuyen');
  if (c.kho_dao === true) return ra('do', 'kho-dao');
  if (c.nguon === 'mot-loi') return chuoi(c.loi_chet) ? ra('da-quyet') : ra('do', 'thieu-loi-chet');
  const trich = gom(c.trich);
  if (!chuoi(c.tep) || !trich) return ra('do', 'thieu-con-tro');
  const rel = chuanTep(c.tep);
  if (rel === null) return ra('do', 'tep-vang');
  if (laVatCuaVong(nc, rel)) return ra('do', 'tu-bien-minh');
  const noiDung = nc.doc(rel);
  if (noiDung === null) return ra('do', 'tep-vang');
  if (trich.length < TRICH_MIN) return ra('do', 'trich-ngan');
  if (!gom(noiDung).includes(trich)) return ra('do', 'trich-vang');
  const laO = rel === `${nc.hoSo}opportunity.md`;
  if (laO && !nc.oDaKy) return ra('do', 'o-chua-ky');
  if (nc.goc === 'da-kiem' && !laO) { const cu = tepOGoc(nc, rel); if (cu === null || !gom(cu).includes(trich)) return ra('do', 'sinh-trong-vong'); }
  return nc.goc === 'da-kiem' ? ra('da-quyet') : ra('da-quyet', null, { ghi_chu: GHI_CHU['chua-kiem-goc'] });
}
function phanLoaiSo(entries, ctx) {
  const nc = taoNguCanh(ctx); const viTri = new Map();
  entries.forEach((e, i) => { if (e && typeof e.id === 'string' && !viTri.has(e.id)) viTri.set(e.id, i); });
  const biThay = new Set();
  entries.forEach((e, j) => { if (e && typeof e.supersedes === 'string' && viTri.has(e.supersedes) && viTri.get(e.supersedes) < j) biThay.add(e.supersedes); });
  const out = { cau_hoi: [], da_quyet: [], do: [], doi_truoc: 0, bi_thay: 0, goc: nc.goc, dong: [] };
  entries.forEach((e, i) => {
    const r = phanLoaiDong(e, nc); if (!r) return;
    const id = typeof e.id === 'string' ? e.id : `dong-${i + 1}`;
    const d = Object.assign({ id, i, e, lop_goc: r.lop }, r, { lop: biThay.has(id) ? 'bi-thay' : r.lop });
    out.dong.push(d);
    if (d.lop === 'bi-thay') out.bi_thay++; else if (d.lop === 'doi-truoc') out.doi_truoc++;
    else if (d.lop === 'cau-hoi') out.cau_hoi.push(d); else if (d.lop === 'da-quyet') out.da_quyet.push(d); else out.do.push(d);
  });
  out.cau_hoi.forEach((d, k) => { d.nhan = `Hỏi-${k + 1}`; });
  return out;
}
module.exports = { NGUON, LY_DO, GHI_CHU, CO, TRICH_MIN, docSo, phanLoaiDong, phanLoaiSo, chuanTep };
```

- [ ] **Step 4: Thêm mũi tiêm CC-04-do** (mỗi luật đỏ một bản sao gỡ đúng luật đó; bản lành đã xanh ở CC-04):

```js
// (tiếp tệp) mỗi mũi tiêm: [mã, chuỗi gốc trong mô-đun, chuỗi thay, ca ma trận phải lệch]
const MUI = [
  ['nguon-la', "|| !NGUON.includes(c.nguon)) return ra('do', 'nguon-la');", ") return ra('do', 'nguon-la');", 'nguon-la'],
  ['kho-dao', "if (c.kho_dao === true) return ra('do', 'kho-dao');", '', 'mt-kho-dao'],
  ['thieu-con-tro', "if (!chuoi(c.tep) || !trich) return ra('do', 'thieu-con-tro');", '', 'mt-thieu-con-tro'],
  ['tep-vang', "if (noiDung === null) return ra('do', 'tep-vang');", '', 'mt-tep-vang'],
  ['trich-ngan', "if (trich.length < TRICH_MIN) return ra('do', 'trich-ngan');", '', 'mt-trich-ngan'],
  ['trich-vang', "if (!gom(noiDung).includes(trich)) return ra('do', 'trich-vang');", '', 'mt-trich-vang'],
  ['tu-bien-minh', "if (laVatCuaVong(nc, rel)) return ra('do', 'tu-bien-minh');", '', 'mt-tu-bien-minh-contract'],
  ['o-chua-ky', "if (laO && !nc.oDaKy) return ra('do', 'o-chua-ky');", '', null],
  ['sinh-trong-vong', "if (cu === null || !gom(cu).includes(trich)) return ra('do', 'sinh-trong-vong');", '', 'mt-sinh-trong-vong-tep-moi'],
  ['thieu-loi-chet', "return chuoi(c.loi_chet) ? ra('da-quyet') : ra('do', 'thieu-loi-chet');", "return ra('da-quyet');", 'ml-thieu-loi-chet'],
  ['thieu-khuyen', "return chuoi(c.khuyen) && chuoi(c.loi_khac) ? ra('cau-hoi') : ra('do', 'thieu-khuyen');", "return ra('cau-hoi');", 'cn-thieu-khuyen'],
];
const banSaoMod = (tu, thay) => {
  const goc = readFileSync(MOD, 'utf8'); if (!goc.includes(tu)) die('mũi tiêm không áp: không thấy «' + tu + '»');
  const d = mkdtempSync(path.join(tmpdir(), 'cancu-mut-')); const f = path.join(d, 'can-cu-s1.cjs');
  writeFileSync(f, goc.replace(tu, thay)); return require(f);
};
for (const [ma, tu, thay, ca] of MUI) {
  check(`CC-04-do ${ma}`, () => {
    const mod = banSaoMod(tu, thay);
    if (ma === 'o-chua-ky') {
      const k = mkKho({ oDaKy: false });
      const r = mod.phanLoaiSo([S1('a', MT('_acceptance/h/opportunity.md', Q_O))], { root: k.r, slug: 'h', base: k.base });
      if (r.dong[0].ma === 'o-chua-ky') die('gỡ luật o-chua-ky mà ca ô chưa ký vẫn đỏ đúng mã — phép đo không phân biệt');
      return;
    }
    const lech = chayMaTran(mod, mkKho());
    if (!lech.some(l => l.startsWith(ca + ':'))) die(`gỡ luật ${ma} mà ca «${ca}» không lệch — phép đo không phân biệt: ${lech.join(' | ')}`);
  });
}
console.log(`\nResults: ${passed} passed, ${failed} failed (can-cu-s1)`);
process.exit(failed ? 1 : 0);
```

- [ ] **Step 5: Móc vào bộ chạy** — `tests/scripts/run-tests.sh`, ngay trước `# <<<KET-SUITE`:

```bash
# ── buoc-len-thiet-ke-khong-hoi (A2): bộ xếp lớp căn cứ bước thiết kế — CC-02..CC-10 ──
# Tệp ca không mang đuôi .test.mjs để không trôi giữa các mảnh mjs; chạy ở phần bash (tất định).
echo "=== can-cu-s1.ca.mjs ==="
node "$HERE/can-cu-s1.ca.mjs"; _cc_rc=$?
check "can-cu-s1.ca.mjs (CC-02..CC-10)" 0 "$_cc_rc"
```

- [ ] **Step 6: Chạy, thấy xanh** — `node tests/scripts/can-cu-s1.ca.mjs` → `PASS: CC-04 ma-tran (25 ca)` + 11 dòng `PASS: CC-04-do <mã>`; thoát 0. Rồi `bash tests/scripts/run-tests.sh --manh bash 2>&1 | grep -E "can-cu|Results"` (bọc khoá máy: `bash ~/.claude/projects/-Users-manhphan-dev-crm/khoa-may/chay-nang.sh "A2 bash-suite" …`).

- [ ] **Step 7: Commit** — `git add scripts/can-cu-s1.cjs tests/scripts/can-cu-s1.ca.mjs tests/scripts/run-tests.sh && git commit -m "feat(can-cu-s1): bộ xếp lớp căn cứ dòng sổ bước thiết kế + ma trận CC-04"`.

### Task 2: Lệnh đếm `--dem` + CLI (CC-07 phần kho thử)

**independent: false** (cần Task 1) · phục vụ **E7**

**Files:** Modify `scripts/can-cu-s1.cjs` (thêm `dem` + khối CLI) · Modify `tests/scripts/can-cu-s1.ca.mjs` (CC-07, CC-07-do)

**Interfaces:** Produces `dem(root) → [{slug, cau_hoi, da_quyet, do, doi_truoc, bi_thay, lat_may_quyet, lat_cau_hoi}]` (mỗi hồ sơ có `decisions.jsonl`, theo tên); `lat_*` đếm dòng `stage: "gate1"` có `supersedes` trỏ dòng S1 theo `lop_goc` (`da-quyet` / `cau-hoi`).

- [ ] **Step 1: Ca hỏng** — thêm vào tệp ca (trước dòng `Results`):

```js
const ghiSoKho = (r, slug, dongs) => ghiTep(r, `_acceptance/${slug}/decisions.jsonl`, dongs.map(x => JSON.stringify(x)).join('\n') + '\n');
const G1 = (id, sup) => ({ id, type: 'approach', stage: 'gate1', at: '2026-10-11T01:00:00Z', decision: 'Người chọn lại', why: 'người chọn ở Cổng Phạm vi', cost_if_wrong: 'tốn', supersedes: sup, decided_by: 'Chủ Kho' });
const ML = id => S1(id, { nguon: 'mot-loi', kho_dao: false, loi_chet: 'Lối kia chết vì ranh giới tệp.' });
const CN = id => S1(id, { nguon: 'chi-nguoi', kho_dao: false, khuyen: 'Khuyên giữ.', loi_khac: 'Đổi — tốn một tiêu chí.' });
const DEM_MONG = [
  { slug: 'A', cau_hoi: 0, da_quyet: 1, do: 0, doi_truoc: 0, bi_thay: 1, lat_may_quyet: 1, lat_cau_hoi: 0 },
  { slug: 'B', cau_hoi: 0, da_quyet: 0, do: 0, doi_truoc: 0, bi_thay: 1, lat_may_quyet: 0, lat_cau_hoi: 1 },
  { slug: 'C', cau_hoi: 1, da_quyet: 1, do: 0, doi_truoc: 1, bi_thay: 0, lat_may_quyet: 0, lat_cau_hoi: 0 },
];
const mkKhoDem = () => {
  const r = mkdtempSync(path.join(tmpdir(), 'cancu-dem-'));
  ghiSoKho(r, 'A', [ML('a1'), ML('a2'), G1('a3', 'a1')]);
  ghiSoKho(r, 'B', [CN('b1'), G1('b2', 'b1')]);
  ghiSoKho(r, 'C', [CN('c1'), ML('c2'), S1('c3', undefined), Object.assign(ML('c4'), { stage: 'S2' }), G1('c5', 'c4')]);
  return r;
};
check('CC-07', () => {
  const r = mkKhoDem();
  const j = spawnSync('node', [MOD, '--root', r, '--dem', '--json'], { encoding: 'utf8' });
  if (j.status !== 0) die('--dem --json thoát ' + j.status + ': ' + j.stderr);
  eq(JSON.parse(j.stdout), DEM_MONG, 'đếm từng hồ sơ — dòng ngoài S1 KHÔNG được đếm');
  const t = spawnSync('node', [MOD, '--root', r, '--dem'], { encoding: 'utf8' }).stdout.trim().split('\n');
  eq(t.length, 3, 'một dòng mỗi hồ sơ');
  DEM_MONG.forEach((m, i) => { if (!t[i].startsWith(m.slug + ' · ') || !t[i].includes(`máy quyết bị lật ${m.lat_may_quyet}`) || !t[i].includes(`câu hỏi chọn khác ${m.lat_cau_hoi}`)) die('dòng chữ lệch: ' + t[i]); });
});
check('CC-07-do', () => {
  const mod = banSaoMod("if (l === 'da-quyet') latMay++; else if (l === 'cau-hoi') latHoi++;", 'latMay++;');
  const lech = mod.dem(mkKhoDem()).filter((x, i) => JSON.stringify(x) !== JSON.stringify(DEM_MONG[i])).map(x => x.slug);
  if (!lech.includes('C')) die('đếm mọi supersedes mà hồ sơ C không lệch: ' + lech.join(','));
});
```

- [ ] **Step 2: Chạy, thấy đỏ** — `node tests/scripts/can-cu-s1.ca.mjs` → FAIL CC-07 (chưa có `--dem`).
- [ ] **Step 3: Viết `dem` + CLI** — thêm vào `scripts/can-cu-s1.cjs` trước `module.exports`, và thêm `dem` vào exports:

```js
function dem(root) {
  let ds = []; try { ds = fs.readdirSync(path.join(root, '_acceptance')).filter(n => !n.startsWith('.')).sort(); } catch (_) { return []; }
  const doc = docDia(root); const rows = [];
  for (const slug of ds) {
    const t = doc(`_acceptance/${slug}/decisions.jsonl`); if (t === null) continue;
    const { entries } = docSo(t);
    const kq = phanLoaiSo(entries, { root, slug });
    const lopGoc = new Map(kq.dong.map(x => [x.id, x.lop_goc]));
    let latMay = 0, latHoi = 0;
    for (const e of entries) {
      if (!e || e.stage !== 'gate1' || typeof e.supersedes !== 'string') continue;
      const l = lopGoc.get(e.supersedes);
      if (l === 'da-quyet') latMay++; else if (l === 'cau-hoi') latHoi++;
    }
    rows.push({ slug, cau_hoi: kq.cau_hoi.length, da_quyet: kq.da_quyet.length, do: kq.do.length, doi_truoc: kq.doi_truoc, bi_thay: kq.bi_thay, lat_may_quyet: latMay, lat_cau_hoi: latHoi });
  }
  return rows;
}
if (require.main === module) {
  const a = process.argv.slice(2); const opt = n => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : null; };
  const root = opt('--root') || '.'; const json = a.includes('--json');
  if (a.includes('--dem')) {
    const rows = dem(root);
    if (json) process.stdout.write(JSON.stringify(rows, null, 2) + '\n');
    else for (const r of rows) process.stdout.write(`${r.slug} · câu hỏi ${r.cau_hoi} · máy đã quyết ${r.da_quyet} · đỏ ${r.do} · đời trước ${r.doi_truoc} · bị thay ${r.bi_thay} · máy quyết bị lật ${r.lat_may_quyet} · câu hỏi chọn khác ${r.lat_cau_hoi}\n`);
    process.exit(0);
  }
  const slug = opt('--slug');
  if (!slug || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(slug)) { process.stderr.write('can-cu-s1: cần --slug <tên hồ sơ> hoặc --dem\n'); process.exit(2); }
  const t = docDia(root)(`_acceptance/${slug}/decisions.jsonl`);
  if (t === null) { process.stderr.write(`can-cu-s1: hồ sơ «${slug}» không có decisions.jsonl\n`); process.exit(2); }
  const kq = phanLoaiSo(docSo(t).entries, { root, slug, base: opt('--base') });
  const tom = { cau_hoi: kq.cau_hoi.length, da_quyet: kq.da_quyet.length, do: kq.do.length, doi_truoc: kq.doi_truoc, bi_thay: kq.bi_thay, goc: kq.goc };
  if (json) process.stdout.write(JSON.stringify(Object.assign({}, tom, { dong: kq.dong.map(({ e, ...r }) => r) }), null, 2) + '\n');
  else { process.stdout.write(`${slug} · câu hỏi ${tom.cau_hoi} · máy đã quyết ${tom.da_quyet} · đỏ ${tom.do} · đời trước ${tom.doi_truoc} · bị thay ${tom.bi_thay} · gốc ${tom.goc}\n`); for (const d of kq.do) process.stdout.write(`  đỏ ${d.id}: ${d.thong_diep}\n`); }
  process.exit(kq.do.length ? 1 : 0);
}
```

- [ ] **Step 4: Chạy, thấy xanh** — `PASS: CC-07`, `PASS: CC-07-do`.
- [ ] **Step 5: Commit** — `git add scripts/can-cu-s1.cjs tests/scripts/can-cu-s1.ca.mjs && git commit -m "feat(can-cu-s1): lệnh đếm --dem cho đường đo + CC-07"`.

### Task 3: Lời dặn bước thiết kế + hai khuôn marker (SKILL) · GUIDE /goal · P85b · CC-02, CC-03, CC-07 khuon-lat

**independent: false** (cần Task 1–2 cho round-trip) · phục vụ **E1, E2, E3, E7**

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` — dòng 10 (danh sách dừng Gate 1), mục «Sổ quyết định» (thêm 2 khối + một đoạn), S1 mục 1, 4-cuối (dòng «Cuối S1»), 5, 7 (ý 4)
- Modify: `GUIDE.md` (mục /goal: «Khi nào — ba thời điểm» (1), câu «Brainstorm không hỏi gì» → «Vòng mở từ một câu mô tả»)
- Modify: `tests/plugins/run-tests.sh` (P85b: kim S1#1 ×3, GUIDE ×1)
- Modify: `tests/scripts/can-cu-s1.ca.mjs` (CC-02, CC-03, CC-07 khuon-lat)

**Interfaces:** Consumes `phanLoaiSo`, `dem` (Task 1–2). Produces hai khối marker: `DEC-CAN-CU-SLOT` (3 dòng, mỗi dòng bắt đầu `,"can_cu":`) và `DEC-LAT-GATE1` (1 dòng giữa cho khối lệnh `DEC-ID-RECIPE`).

- [ ] **Step 1: Ca hỏng** — thêm CC-02, CC-03, CC-07 khuon-lat vào tệp ca:

```js
const SKILL = path.join(ROOT, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md');
const SKILL_REL = 'feature-loop/skills/feature-loop/SKILL.md';
const NHANH = 'vong/a2-thiet-ke-khong-hoi-thua';
// Tầm của vòng, neo LỊCH SỬ: commit gộp nhánh vào main → [điểm rẽ, cha-2]; chưa gộp → [merge-base với nhánh chính, HEAD].
export function tamVong() {
  const dong = git(ROOT, 'log', '--merges', '--format=%H%x09%s', 'HEAD').split('\n').find(l => new RegExp(`\\tMerge pull request #\\d+ from \\S+/${NHANH.replace(/\//g, '\\/')}$`).test(l));
  if (dong) { const m = dong.split('\t')[0]; return { goc: git(ROOT, 'merge-base', `${m}^1`, `${m}^2`), dinh: git(ROOT, 'rev-parse', `${m}^2`), nguon: 'lich-su' }; }
  const chinh = ['origin/main', 'main'].find(r => spawnSync('git', ['-C', ROOT, 'rev-parse', '--verify', '--quiet', r]).status === 0);
  if (!chinh) die('không tìm được nhánh chính (origin/main | main) để tính tầm vòng');
  const goc = git(ROOT, 'merge-base', 'HEAD', chinh); const dinh = git(ROOT, 'rev-parse', 'HEAD');
  if (goc === dinh) die('tầm vòng rỗng: không tìm được commit gộp ' + NHANH + ' và HEAD trùng nhánh chính');
  return { goc, dinh, nguon: 'nhanh' };
}
const tepO = (sha, rel) => { const r = spawnSync('git', ['-C', ROOT, 'show', `${sha}:${rel}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); return r.status === 0 ? r.stdout : null; };
const cacKhoi = t => { const m = new Map(); for (const x of t.matchAll(/<!-- <<<([A-Z0-9-]+) -->([\s\S]*?)<!-- \1>>> -->/g)) m.set(x[1], x[2]); return m; };
export function soKhoi(goc, moi) {
  const b = cacKhoi(goc), n = cacKhoi(moi);
  return { lech: [...b.keys()].filter(k => n.get(k) !== b.get(k)), them: [...n.keys()].filter(k => !b.has(k)).sort() };
}
const VUNG_CAM = ['feature-loop/scripts', 'feature-loop/workflows', 'dieu-phoi', 'scripts/cat-luot.mjs', 'skills/cat-luot', 'lib', 'hooks', 'scripts/pre-merge-check.sh', 'commands/approve.md', '_acceptance/config.yaml'];
check('CC-02 khoi-giu-byte', () => {
  const t = tamVong(); const goc = tepO(t.goc, SKILL_REL), dinh = tepO(t.dinh, SKILL_REL);
  if (goc === null || dinh === null) die('không đọc được SKILL ở tầm vòng ' + JSON.stringify(t));
  const k = soKhoi(goc, dinh);
  eq(k.lech, [], `khối có ở gốc ${t.goc.slice(0, 8)} phải giữ từng byte (${t.nguon})`);
  eq(k.them, ['DEC-CAN-CU-SLOT', 'DEC-LAT-GATE1'], 'khối mới đúng hai');
  const doi = git(ROOT, 'diff', '--name-only', t.goc, t.dinh, '--', ...VUNG_CAM);
  eq(doi, '', 'vùng cấm chạm không đổi');
});
check('CC-02-do', () => {
  const goc = readFileSync(SKILL, 'utf8');
  const tiem = goc.replace(/(<!-- <<<TRONG-DOT -->[\s\S]*?)Trong đợt/, '$1Trong dot');
  if (tiem === goc) die('mũi tiêm TRONG-DOT không áp');
  const k = soKhoi(goc, tiem);
  if (!k.lech.includes('TRONG-DOT')) die('đổi một ký tự trong TRONG-DOT mà hàm so không nêu khối: ' + JSON.stringify(k));
});
// CC-03 — khuôn rút từ SKILL, ghi bằng CHÍNH khối lệnh DEC-ID-RECIPE (bash + zsh), bộ xếp lớp đọc lại.
const recipeOf = t => { const m = t.match(/<!-- <<<DEC-ID-RECIPE -->\n```\n([\s\S]+?)\n```\n<!-- DEC-ID-RECIPE>>> -->/); if (!m) die('thiếu khối DEC-ID-RECIPE'); return m[1]; };
const khuonCanCu = t => { const m = t.match(/<!-- <<<DEC-CAN-CU-SLOT -->\n([\s\S]+?)\n<!-- DEC-CAN-CU-SLOT>>> -->/); if (!m) die('thiếu khối DEC-CAN-CU-SLOT'); const l = m[1].split('\n'); if (l.length !== 3 || !l.every(x => x.startsWith(',"can_cu":'))) die('khối DEC-CAN-CU-SLOT phải đúng 3 dòng bắt đầu ,"can_cu":'); return l; };
const LO = '"cost_if_wrong":"<sai thì tốn gì, 1 câu>"';
const jsonStr = s => JSON.stringify(String(s)).slice(1, -1);
const Q_DB = "Luật kho: giá '100%' và biến $HOME «không» được nội suy trong câu.";
const DIEN = {
  '<đường dẫn tương đối gốc kho>': 'CLAUDE.md', '<câu trích nguyên văn, một dòng>': jsonStr(Q_DB),
  '<lối khác chết vì sao, 1 câu>': jsonStr("Lối kia chạm 'tệp' ngoài ranh giới — 0% đường."),
  '<lối máy khuyên, 1 câu>': jsonStr('Giữ $A như cũ.'), '<lối khác — giá nếu chọn nó, 1 câu>': jsonStr("Đổi sang 'B' — tốn 2 tiêu chí."),
};
const dienKhuon = l => Object.entries(DIEN).reduce((s, [k, v]) => s.split(k).join(v), l);
function ghiBangCongThuc(skillText, sh) {
  const r = mkdtempSync(path.join(tmpdir(), 'cancu-rt-'));
  git(r, 'init', '-q'); git(r, 'config', 'user.email', 't@t'); git(r, 'config', 'user.name', 't');
  ghiTep(r, 'CLAUDE.md', `# Luật\n\n${Q_DB}\n`); git(r, 'add', '-A'); git(r, 'commit', '-qm', 'goc');
  const base = git(r, 'rev-parse', 'HEAD'); mkdirSync(path.join(r, '_acceptance', 'x'), { recursive: true });
  const recipe = recipeOf(skillText); if (recipe.split(LO).length !== 2) die('khối DEC-ID-RECIPE không còn đúng một ô cost_if_wrong');
  for (const k of khuonCanCu(skillText)) {
    const lenh = recipe.split(LO).join(LO + dienKhuon(k)).split('<slug>').join('x').split('<type>').join('approach').split('<stage>').join('S1')
      .split('<ISO>').join('2026-10-11T00:00:00Z').split('<1 câu>').join('Chọn A').split('<vì sao, 1 câu>').join('vì').split('<sai thì tốn gì, 1 câu>').join('tốn');
    const p = spawnSync(sh, ['-c', lenh], { cwd: r, encoding: 'utf8' }); if (p.status !== 0) die(`khối lệnh không chạy dưới ${sh}: ${p.stderr}`);
  }
  const mod = require(MOD);
  return { mod, r, base, so: mod.docSo(readFileSync(path.join(r, '_acceptance', 'x', 'decisions.jsonl'), 'utf8')) };
}
for (const sh of ['bash', 'zsh']) {
  check(`CC-03 ${sh}`, () => {
    if (spawnSync(sh, ['-c', 'true']).status !== 0) die(sh + ' vắng trên máy — ca KHÔNG bỏ qua');
    const { mod, r, base, so } = ghiBangCongThuc(readFileSync(SKILL, 'utf8'), sh);
    eq(so.broken, 0, 'mọi dòng là JSON');
    const kq = mod.phanLoaiSo(so.entries, { root: r, slug: 'x', base });
    eq(kq.dong.map(d => d.lop), ['da-quyet', 'da-quyet', 'cau-hoi'], 'lớp ba khuôn');
    eq(new Set(so.entries.map(e => e.id)).size, 3, 'mã dòng duy nhất');
    const [a, b, c] = so.entries.map(e => e.can_cu);
    eq([a.tep, a.trich, b.loi_chet, c.khuyen, c.loi_khac], ['CLAUDE.md', Q_DB, "Lối kia chạm 'tệp' ngoài ranh giới — 0% đường.", 'Giữ $A như cũ.', "Đổi sang 'B' — tốn 2 tiêu chí."], 'trường đọc lại = giá trị đã điền');
  });
}
check('CC-03-do', () => {
  const t = readFileSync(SKILL, 'utf8');
  const tiem = t.replace(/(<!-- <<<DEC-CAN-CU-SLOT -->\n),"can_cu":/, '$1,"cancu":');
  if (tiem === t) die('mũi tiêm khuôn không áp');
  const { mod, r, base, so } = ghiBangCongThuc(tiem, 'bash');
  const kq = mod.phanLoaiSo(so.entries, { root: r, slug: 'x', base });
  if (kq.dong[0].lop !== 'doi-truoc') die('đổi tên khoá trong khuôn 1 mà dòng không ra doi-truoc: ' + kq.dong[0].lop);
});
// CC-07 khuôn lật — rút DEC-LAT-GATE1, ghi bằng DEC-ID-RECIPE vào hồ sơ D có một dòng S1 máy đã quyết.
const khuonLat = t => { const m = t.match(/<!-- <<<DEC-LAT-GATE1 -->\n([^\n]+)\n<!-- DEC-LAT-GATE1>>> -->/); if (!m) die('thiếu khối DEC-LAT-GATE1 (một dòng)'); return m[1]; };
function demSauLat(skillText) {
  const r = mkdtempSync(path.join(tmpdir(), 'cancu-lat-'));
  ghiSoKho(r, 'D', [ML('d1')]);
  const recipe = recipeOf(skillText).replace(/\n[^\n]*"type":"<type>"[^\n]*\n/, '\n' + khuonLat(skillText) + '\n');
  const lenh = recipe.split('<slug>').join('D').split('<mã dòng S1 bị đổi>').join('d1').split('<tên người>').join('Chủ Kho')
    .split('<ISO>').join('2026-10-11T01:00:00Z').split('<type>').join('approach').split('<lựa chọn mới theo lời người, 1 câu>').join('Người chọn lối B')
    .split('<câu người gõ ở Cổng Phạm vi>').join('sửa: Hỏi-1 = B').split('<sai thì tốn gì, 1 câu>').join('tốn');
  const p = spawnSync('bash', ['-c', lenh], { cwd: r, encoding: 'utf8' }); if (p.status !== 0) die('khối lệnh lật không chạy: ' + p.stderr);
  return require(MOD).dem(r).find(x => x.slug === 'D');
}
check('CC-07 khuon-lat', () => { const d = demSauLat(readFileSync(SKILL, 'utf8')); eq(d.lat_may_quyet, 1, 'dòng lật ghi bằng khuôn SKILL được đếm'); });
check('CC-07-do khuon', () => {
  const t = readFileSync(SKILL, 'utf8'); const tiem = t.replace(/(<!-- <<<DEC-LAT-GATE1 -->\n[^\n]*)"stage":"gate1"/, '$1"stage":"S1"');
  if (tiem === t) die('mũi tiêm khuôn lật không áp');
  const d = demSauLat(tiem); if (d.lat_may_quyet !== 0) die('đổi stage trong khuôn lật mà vẫn đếm 1 — phép đo không phân biệt');
});
```

- [ ] **Step 2: Chạy, thấy đỏ** — CC-02 FAIL (`them` rỗng), CC-03 FAIL «thiếu khối DEC-CAN-CU-SLOT», CC-07 khuon-lat FAIL «thiếu khối DEC-LAT-GATE1».

- [ ] **Step 3: Sửa SKILL — mục «Sổ quyết định»**: sau khối `DEC-TARGET-SLOT>>>` (trước đoạn «**Rule đáng-log**») chèn:

````markdown
**Căn cứ của lựa chọn ở bước thiết kế (dòng `stage:"S1"`, ADR 0022):** thêm ĐÚNG MỘT dòng dưới vào dòng giữa của khối lệnh trên, NGAY SAU `"cost_if_wrong":"<sai thì tốn gì, 1 câu>"`, chọn theo nguồn căn cứ (luật xếp ở S1 mục 1): mục tiêu + quy tắc đã khai · chỉ một lối ra sống · chỉ người có. `kho_dao` là `true` khi lựa chọn chạm ship ra người dùng thật · xoá dữ liệu · cam kết ra ngoài kho. Khoá này máy đọc (`scripts/can-cu-s1.cjs`), không phải câu thứ tư để người đọc; dòng không có khoá là dòng đời trước, đọc như cũ. Thay một dòng S1 trước Cổng Phạm vi = ghi dòng mới mang `"supersedes":"<mã dòng cũ>"` (sổ chỉ thêm).
<!-- <<<DEC-CAN-CU-SLOT -->
,"can_cu":{"nguon":"muc-tieu","kho_dao":false,"tep":"<đường dẫn tương đối gốc kho>","trich":"<câu trích nguyên văn, một dòng>"}
,"can_cu":{"nguon":"mot-loi","kho_dao":false,"loi_chet":"<lối khác chết vì sao, 1 câu>"}
,"can_cu":{"nguon":"chi-nguoi","kho_dao":false,"khuyen":"<lối máy khuyên, 1 câu>","loi_khac":"<lối khác — giá nếu chọn nó, 1 câu>"}
<!-- DEC-CAN-CU-SLOT>>> -->

**Lật ở Cổng Phạm vi:** người trả «sửa:» mà đổi một lựa chọn đã ghi ở bước thiết kế → TRƯỚC khi soạn lại, ghi MỘT dòng bằng khối lệnh trên với dòng giữa thay bằng đúng dòng dưới (`decided_by` là danh tính người — điều máy biết, như lệnh duyệt suy). Đây là bên viết của cột «máy quyết bị lật» trong `node scripts/can-cu-s1.cjs --root . --dem` — đường đo của hồ sơ buoc-len-thiet-ke-khong-hoi.
<!-- <<<DEC-LAT-GATE1 -->
"type":"<type>","stage":"gate1","at":"<ISO>","decision":"<lựa chọn mới theo lời người, 1 câu>","why":"người chọn ở Cổng Phạm vi: <câu người gõ ở Cổng Phạm vi>","cost_if_wrong":"<sai thì tốn gì, 1 câu>","supersedes":"<mã dòng S1 bị đổi>","decided_by":"<tên người>"
<!-- DEC-LAT-GATE1>>> -->
````

- [ ] **Step 4: Sửa SKILL — S1 mục 1** (thay trọn đoạn «1. Invoke `superpowers:brainstorming` — hỏi đáp làm rõ như thường lệ. …ba dòng số.»):

```markdown
1. **Nghĩ bằng brainstorming, KHÔNG hỏi-đáp với người** (ngoài đợt; trong đợt theo khối TRONG-DOT). Invoke `superpowers:brainstorming` để dựng phương án, nhưng câu brainstorm lẽ ra hỏi người thì máy tự trả lời từ ô cơ hội đã ký, câu giao của hàng lộ trình, luật kho (CLAUDE.md · AGENTS.md · CONTEXT.md · ADR) và vật đã có. Mỗi lựa chọn như vậy xếp theo **nguồn căn cứ** rồi thành MỘT dòng sổ S1 mang khoá `can_cu` (khuôn `DEC-CAN-CU-SLOT`, mục «Sổ quyết định»):
   - **mục tiêu + quy tắc đã khai** — trỏ được MỘT tệp có từ trước vòng (không phải vật của chính vòng; ô cơ hội đã ký thì được) và câu trích nguyên văn QUYẾT được lựa chọn → máy quyết;
   - **chỉ một lối ra sống** — các lối khác chết vì một ràng buộc nêu được → máy quyết, ghi lối khác chết vì sao;
   - **chỉ người có** — gu nhìn, nghĩa sản phẩm người dùng thấy, đánh đổi giá trị, khẩu vị rủi ro, sự kiện chỉ chủ kho biết, việc luật đòi người ký (CỘNG) → KHÔNG hỏi giữa chừng: soạn nháp theo khuyến nghị, ghi dòng dạng câu hỏi (khuyến nghị + lối khác + giá); dòng lên thẻ Cổng Phạm vi thành «Hỏi-n».

   Không trỏ được căn cứ thì là «chỉ người có», không phải «mục tiêu». Chạm khó-đảo (ship ra người dùng thật · xoá dữ liệu · cam kết ra ngoài kho) → luôn là câu hỏi, `kho_dao: true`, bất kể nguồn. KHÔNG dừng xin duyệt thiết kế, KHÔNG hỏi «làm ngay chứ?» hay «chọn A hay B?» giữa bước thiết kế — mỗi câu như vậy là một lượt gọi người ngoài thiết kế (đo 22/09–11/10: 28/51 lựa chọn chủ kho trả lời ở bước này có căn cứ máy đã có — hồ sơ `buoc-len-thiet-ke-khong-hoi`). Đề bài mơ hồ vẫn soạn nháp theo khuyến nghị; Cổng Phạm vi dừng chờ người theo bất biến dừng. **Điểm vũ trang `/goal` đầu tiên** là lời mời Cổng Đáng của ô — in kèm khối `GOAL-TEMPLATE` (thay `<slug>`) với một dòng «sau khi trả lời, dán luôn dòng này»; bước thiết kế không còn lượt người nào, và vòng mở từ một câu mô tả chạy S0 tới Cổng Phạm vi trong cùng lượt nên không cần vũ trang.
```

- [ ] **Step 5: Sửa SKILL — S1 mục 4 (dòng «Cuối S1»), mục 5, mục 7, dòng 10:**
  - mục 4, thay `- Cuối S1: append entry ledger cho approach/descope thỏa rule đáng-log (xem "Sổ quyết định").` bằng `- Cuối S1: append entry ledger cho approach/descope thỏa rule đáng-log (xem "Sổ quyết định") — mỗi dòng S1 mang khoá `can_cu` theo khuôn `DEC-CAN-CU-SLOT`.`
  - mục 5, thay `(HARD-GATE của brainstorming và Gate 1A/1B của kit gộp thành MỘT Gate 1; dòng `/goal` in kèm câu xin duyệt ở S1#1 KHÔNG phải một cổng — nó đi cùng câu trả lời, không thêm lượt.)` bằng `(HARD-GATE của brainstorming và Gate 1A/1B của kit gộp thành MỘT Gate 1; dòng `/goal` in kèm lời mời Cổng Đáng và câu chỉ-người-biết của bước thiết kế KHÔNG phải một cổng — nó đi cùng câu trả lời, không thêm lượt. Sổ S1 còn câu chỉ-người-biết hoặc dòng đỏ (`node scripts/can-cu-s1.cjs --root . --slug <slug>` thoát 1) → Cổng Phạm vi dừng chờ người, không đi làn V.)`
  - mục 7, ý (4), ngay trước `; (5) cap 5 finding`, chèn: `; và CĂN CỨ CỦA MÁY (hồ sơ buoc-len-thiet-ke-khong-hoi): với MỌI dòng sổ S1 máy đã quyết — lựa chọn có chạm ship ra người dùng thật, xoá dữ liệu hay cam kết ra ngoài kho mà `kho_dao` ghi false không · nguồn mục-tiêu: câu trích có QUYẾT lựa chọn hay chỉ liên quan · nguồn một-lối: lối khác có thật chết vì ràng buộc nêu được không · có lựa chọn «chỉ người có» nào trong design/contract mà sổ ghi máy quyết hoặc không ghi — mỗi chỗ là P0, xử lý bằng một dòng S1 mới mang `supersedes` (thường thành câu hỏi)`
  - dòng 10, thay `(gap-probe còn P0 · danh từ mờ/đề bài mơ hồ · coverage cluster chưa gạch · hạng T3)` bằng `(gap-probe còn P0 · danh từ mờ/đề bài mơ hồ · coverage cluster chưa gạch · sổ bước thiết kế còn câu chỉ-người-biết hoặc dòng đỏ · hạng T3)`

- [ ] **Step 6: Sửa GUIDE mục /goal** — trong dòng «**Khi nào — ba thời điểm…**»: thay `(1) mỗi câu **xin duyệt thiết kế** của brainstorm — dán cùng câu trả lời;` bằng `(1) lời mời **Cổng Đáng** của ô — dán cùng câu trả lời (bước thiết kế không còn câu xin duyệt);`; thay `lần dán ở brainstorm là lần duy nhất.` bằng `lần dán ở Cổng Đáng là lần duy nhất.`; thay `**Brainstorm không hỏi gì** (đề bài đã đủ, máy đi thẳng tới artifact) → không có lượt để vũ trang trước Cổng 1 — ca chưa phủ, đo ở ba dòng số mốc kế.` bằng `**Vòng mở từ một câu mô tả** (không qua Cổng Đáng) → S0 chạy tới Cổng Phạm vi trong cùng lượt, không cần vũ trang.`

- [ ] **Step 7: Sửa P85b** (`tests/plugins/run-tests.sh`): ba kim S1#1 → `("S1#1 khong hoi giua buoc thiet ke", "skill", "KHÔNG dừng xin duyệt thiết kế, KHÔNG hỏi «làm ngay chứ?»")`, `("S1#1 tro dich danh GOAL-TEMPLATE", "skill", "in kèm khối `GOAL-TEMPLATE`")` (giữ), `("S1#1 vong mo tu cau mo ta khong can vu trang", "skill", "vòng mở từ một câu mô tả chạy S0 tới Cổng Phạm vi trong cùng lượt nên không cần vũ trang")`; kim GUIDE `("GUIDE: brainstorm khong hoi -> chua phu", "guide", "**Brainstorm không hỏi gì**")` → `("GUIDE: vong mo tu cau mo ta", "guide", "**Vòng mở từ một câu mô tả**")`; cập nhật hai khoá trong `VI_TRI` theo tên mới và tiêu đề `run "P85b …"` («S1 khong hoi giua chung · Cong Dang vu trang /goal»).

- [ ] **Step 8: Chạy, thấy xanh** — `node tests/scripts/can-cu-s1.ca.mjs` → PASS CC-02, CC-02-do, CC-03 bash, CC-03 zsh, CC-03-do, CC-07 khuon-lat, CC-07-do khuon. `bash tests/plugins/run-tests.sh --manh vung:<vùng có P85b> 2>&1 | grep -E "P85b|Results"` (bọc khoá máy) → P85b PASS + 15/15 mũi tiêm.

- [ ] **Step 9: Commit** — `git add feature-loop/skills/feature-loop/SKILL.md GUIDE.md tests/plugins/run-tests.sh tests/scripts/can-cu-s1.ca.mjs && git commit -m "feat(feature-loop S1): bước thiết kế không dừng hỏi; khuôn DEC-CAN-CU-SLOT + DEC-LAT-GATE1; P85b theo chữ mới"`.

### Task 4: Thẻ Cổng Phạm vi · lệnh dựng thẻ truyền gốc · CC-05, CC-06, CC-10 · chế độ `--dung-the`

**independent: false** (cần Task 1; CC-10 cần Task 3 không) · phục vụ **E5, E6, E9, E10**

**Files:**
- Modify: `scripts/gate-card.js` (require mô-đun; nhánh `gate === '1'`: tính `cc`, `g1Blocked`, routing, khoá extract `can_cu`, hai khối mới, khối trade-off dùng `decsChung`, cờ, «VIỆC CỦA ANH»)
- Modify: `commands/acceptance-card.md` (bước 3: truyền `--glossary-base` khi sổ bước thiết kế có dòng mang `can_cu`)
- Modify: `tests/scripts/can-cu-s1.ca.mjs` (CC-05, CC-05 do, CC-05 khong-goc, CC-05-do, CC-06 ×4 + CC-06-do, CC-10, `--dung-the`)

**Interfaces:** Consumes `phanLoaiSo`, `CO`, `docSo` (Task 1). Produces khoá extract `can_cu = { cau_hoi: [{nhan, id, decision, khuyen, loi_khac, kho_dao}], da_quyet: [{id, decision, nguon, tep, trich, loi_chet, ghi_chu}], do: [{id, ma, thong_diep}], doi_truoc, bi_thay, goc }`; HTML: `data-cau-hoi="Hỏi-n"` trên mỗi dòng câu hỏi, `data-may-quyet="<id>"` trên mỗi dòng máy đã quyết.

- [ ] **Step 1: Ca hỏng** — thêm vào tệp ca:

```js
const GC = path.join(ROOT, 'scripts', 'gate-card.js');
const HD_DRAFT = `---\nschema_version: 1\nfeature: Kho thử h\nslug: h\nrisk_tier: T2\nsurfaces: [cli]\nstatus: draft\ndesign_doc: docs/superpowers/specs/2026-10-11-h-design.md\n---\n\n# h\n\n## Criteria\n\n- AC-1: Given x, When y, Then z.\n\n## Coverage\n\n- Trục A: a [thước CE: b] → AC-1\n\n## Out of scope\n\n- một\n- hai\n`;
const CAU_KD = S1('q2', { nguon: 'chi-nguoi', kho_dao: true, khuyen: 'Giữ bản ghi cũ.', loi_khac: 'Xoá bản ghi cũ — không lấy lại được.' });
export function mkHoSoThe({ themDo = false } = {}) {
  const kho = mkKho(); ghiTep(kho.r, '_acceptance/h/contract.md', HD_DRAFT);
  ghiTep(kho.r, '_acceptance/h/evals.yaml', 'schema_version: 1\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.x\n    expected: "exit 0"\n');
  ghiTep(kho.r, '_acceptance/config.yaml', 'risk_tiers:\n  t3_paths: []\nexecutors:\n  test:\n    x: "true"\n');
  const dongs = [CN('q1'), CAU_KD, S1('m1', MT('CLAUDE.md', Q_GOC)), ML('m2'), S1('c1', undefined), Object.assign(S1('s2', undefined), { stage: 'S2' })];
  if (themDo) dongs.push(S1('r1', MT('docs/moi.md', Q_MOI)));
  ghiSoKho(kho.r, 'h', dongs); return kho;
}
const theCua = (kho, them = []) => spawnSync('node', [GC, '--root', kho.r, '--slug', 'h', ...them], { encoding: 'utf8' });
const khoiLab = (html, lab) => { const i = html.indexOf(`<div class="lab">${lab}</div>`); if (i < 0) return null; const j = html.indexOf('<div class="lab">', i + 10); return html.slice(i, j < 0 ? undefined : j); };
const cac = (s, re) => [...String(s || '').matchAll(re)].map(m => m[1]);
check('CC-05 the', () => {
  const kho = mkHoSoThe(); const b = ['--glossary-base', kho.base];
  const h = theCua(kho, b); if (h.status !== 0) die('thẻ thoát ' + h.status + ': ' + h.stderr);
  const hoi = khoiLab(h.stdout, 'Câu chỉ anh trả lời được'); if (!hoi) die('thiếu khối câu hỏi');
  eq(cac(hoi, /data-cau-hoi="([^"]+)"/g), ['Hỏi-1', 'Hỏi-2'], 'thứ tự câu hỏi');
  for (const s of ['Khuyên giữ.', 'Đổi — tốn một tiêu chí.', 'Giữ bản ghi cũ.', 'Xoá bản ghi cũ — không lấy lại được.']) if (!hoi.includes(s)) die('khối câu hỏi thiếu «' + s + '»');
  eq((hoi.match(/khó-đảo/g) || []).length, 1, 'nhãn khó-đảo đúng một câu');
  if (!/data-cau-hoi="Hỏi-2"[^<]*<b>Hỏi-2<\/b>[\s\S]*?khó-đảo/.test(hoi)) die('nhãn khó-đảo không ở Hỏi-2');
  const mq = khoiLab(h.stdout, 'Máy đã quyết ở bước thiết kế — anh lật được'); if (!mq) die('thiếu khối máy đã quyết');
  eq(cac(mq, /data-may-quyet="([^"]+)"/g), ['m1', 'm2'], 'dòng máy đã quyết');
  if (!mq.includes(`«${Q_GOC}» (CLAUDE.md)`) || !mq.includes('lối khác chết vì: Lối kia chết vì ranh giới tệp.')) die('khối máy đã quyết thiếu căn cứ hoặc lối chết');
  const td = khoiLab(h.stdout, 'Quyết định &amp; trade-off'); eq((td.match(/<p class="li">/g) || []).length, 2, 'trade-off còn đời trước + S2');
  const vc = khoiLab(h.stdout, '👉 VIỆC CỦA ANH'); eq((vc.match(/<b>Hỏi-\d+<\/b>/g) || []).length, 2, 'VIỆC CỦA ANH một mục mỗi câu');
  if (!vc.includes('«duyệt hay sửa: ___»')) die('câu trả lời mẫu đổi');
  const j = JSON.parse(theCua(kho, [...b, '--extract']).stdout);
  eq(j.routing.hoi, ['duyệt hay sửa', 'Hỏi-1', 'Hỏi-2'], 'routing.hoi');
  eq([j.can_cu.cau_hoi.length, j.can_cu.da_quyet.length, j.can_cu.do.length, j.can_cu.doi_truoc], [2, 2, 0, 1], 'đếm can_cu');
  if (!j.one_shot.endsWith(' duyệt')) die('one_shot không điền sẵn duyệt: ' + j.one_shot);
});
check('CC-05 do', () => {
  const kho = mkHoSoThe({ themDo: true }); const b = ['--glossary-base', kho.base];
  const h = theCua(kho, b).stdout; const co = `Sổ bước thiết kế — r1: câu trích không có ở gốc nhánh — căn cứ sinh trong vòng`;
  if (!h.includes(`<div class="flag fred">${co}</div>`)) die('thiếu cờ đỏ của dòng r1');
  const j = JSON.parse(theCua(kho, [...b, '--extract']).stdout);
  if (!j.one_shot.endsWith(' ___')) die('có dòng đỏ mà one_shot vẫn điền sẵn: ' + j.one_shot);
  eq(j.can_cu.do.map(x => [x.id, x.ma]), [['r1', 'sinh-trong-vong']], 'can_cu.do');
});
check('CC-05 khong-goc', () => {
  const h = theCua(mkHoSoThe()).stdout;
  eq((h.match(/chưa kiểm câu trích có từ trước vòng/g) || []).length, 1, 'đúng một cờ vàng chưa kiểm gốc');
  if (/Sổ bước thiết kế — /.test(h)) die('không gốc mà có cờ đỏ mới');
});
check('CC-05-do', () => {
  const d = mkdtempSync(path.join(tmpdir(), 'cancu-gc-')); cpSync(path.join(ROOT, 'scripts'), path.join(d, 'scripts'), { recursive: true }); cpSync(path.join(ROOT, 'lib'), path.join(d, 'lib'), { recursive: true });
  const f = path.join(d, 'scripts', 'gate-card.js'); const t = readFileSync(f, 'utf8');
  const tu = 'const ccMayQuyet = cc.da_quyet;'; if (!t.includes(tu)) die('mũi tiêm thẻ không áp');
  writeFileSync(f, t.replace(tu, 'const ccMayQuyet = cc.da_quyet.concat(cc.cau_hoi);'));
  const kho = mkHoSoThe(); const h = spawnSync('node', [f, '--root', kho.r, '--slug', 'h', '--glossary-base', kho.base], { encoding: 'utf8' }).stdout;
  const lac = cac(khoiLab(h, 'Máy đã quyết ở bước thiết kế — anh lật được'), /data-may-quyet="([^"]+)"/g).filter(x => x.startsWith('q'));
  if (!lac.length) die('đưa câu hỏi vào khối máy-đã-quyết mà hàm so không thấy');
  console.log('    CC-05-do nêu: ' + lac.join(', '));
});
```

```js
// CC-06 — chiều im (đọc vật ở đỉnh tầm vòng, không ở cây sống)
const dsHoSo = sha => git(ROOT, 'ls-tree', '--name-only', `${sha}:_acceptance`).split('\n').filter(Boolean);
check('CC-06 kho-that', () => {
  const t = tamVong(); const mod = require(MOD); let soHoSo = 0, soDong = 0, soLat = 0; const do_ = [];
  for (const slug of dsHoSo(t.goc)) {
    if (slug === 'buoc-len-thiet-ke-khong-hoi') continue;
    const raw = tepO(t.dinh, `_acceptance/${slug}/decisions.jsonl`); if (raw === null) continue;
    const { entries } = mod.docSo(raw); soHoSo++; soDong += entries.length;
    soLat += entries.filter(e => e && e.stage === 'gate1' && typeof e.supersedes === 'string').length;
    const kq = mod.phanLoaiSo(entries, { root: ROOT, slug, docTep: rel => tepO(t.dinh, rel) });
    if (kq.do.length) do_.push(slug);
  }
  console.log(`    CC-06: ${soHoSo} hồ sơ · ${soDong} dòng · ${soLat} dòng gate1 mang supersedes`);
  if (!soHoSo) die('không đọc được hồ sơ nào'); eq(do_, [], 'hồ sơ có sẵn có dòng đỏ');
});
check('CC-06 the-cu', () => {
  const t = tamVong(); const mod = require(MOD); const chon = [];
  for (const slug of dsHoSo(t.goc)) {
    if (chon.length === 3) break;
    const hd = readFileSync(path.join(ROOT, '_acceptance', slug, 'contract.md'), 'utf8').match(/^status:\s*(\S+)/m);
    if (!hd || hd[1] !== 'signed-off') continue;
    const raw = (() => { try { return readFileSync(path.join(ROOT, '_acceptance', slug, 'decisions.jsonl'), 'utf8'); } catch (_) { return ''; } })();
    const en = mod.docSo(raw).entries; if (!en.some(e => e.stage === 'S1')) continue;
    chon.push([slug, en.filter(e => e.type !== 'seal').length]);
  }
  if (chon.length !== 3) die('không đủ ba hồ sơ signed-off có dòng S1');
  for (const [slug, n] of chon) {
    const h = spawnSync('node', [GC, '--root', ROOT, '--slug', slug, '--gate', '1'], { encoding: 'utf8' }).stdout;
    if (h.includes('dòng sổ đời trước')) die(slug + ': thẻ đã ký mang cờ đời trước');
    if (h.includes('Câu chỉ anh trả lời được')) die(slug + ': thẻ đã ký có khối câu hỏi');
    eq((khoiLab(h, 'Quyết định &amp; trade-off').match(/<p class="li">/g) || []).length, n, slug + ': trade-off đủ dòng');
  }
  console.log('    CC-06 the-cu: ' + chon.map(x => x[0]).join(', '));
});
check('CC-06 vang', () => {
  const kho = mkKho(); ghiTep(kho.r, '_acceptance/h/contract.md', HD_DRAFT);
  ghiTep(kho.r, '_acceptance/h/evals.yaml', 'schema_version: 1\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.x\n    expected: "exit 0"\n');
  ghiSoKho(kho.r, 'h', [S1('c1', undefined), S1('c2', undefined)]);
  const h = theCua(kho, ['--glossary-base', kho.base]).stdout;
  eq((h.match(/dòng sổ đời trước/g) || []).length, 1, 'đúng một cờ vàng đời trước');
});
check('CC-06 bo-doc', () => {
  const HS = require(path.join(ROOT, 'scripts', 'ho-so-tom-tat.cjs'));
  const chay = coCanCu => {
    const kho = mkHoSoThe(); const so = path.join(kho.r, '_acceptance/h/decisions.jsonl');
    if (!coCanCu) writeFileSync(so, readFileSync(so, 'utf8').split('\n').filter(Boolean).map(l => { const e = JSON.parse(l); delete e.can_cu; return JSON.stringify(e); }).join('\n') + '\n');
    const tom = HS.tomTatHoSo(path.join(kho.r, '_acceptance', 'h'));
    const cs = spawnSync('node', [path.join(ROOT, 'feature-loop', 'scripts', 'claim-scan.mjs'), '--root', kho.r, '--slug', 'khac'], { encoding: 'utf8' }).stdout;
    const lh = spawnSync('node', [path.join(ROOT, 'scripts', 'loop-health.mjs'), '--root', kho.r, '--json'], { encoding: 'utf8' }).stdout;
    return JSON.stringify([tom && tom.chu_kho, cs, lh]);
  };
  eq(chay(true), chay(false), 'bộ đọc khác ra cùng kết quả có/không can_cu');
});
check('CC-06-do', () => {
  const mod = banSaoMod("if (c === undefined) return ra('doi-truoc');", "if (c === undefined) return ra('do', 'nguon-la');");
  const t = tamVong(); const dau = dsHoSo(t.goc).find(s => { const raw = tepO(t.dinh, `_acceptance/${s}/decisions.jsonl`); return raw && mod.docSo(raw).entries.some(e => e.stage === 'S1') && s !== 'buoc-len-thiet-ke-khong-hoi'; });
  const kq = mod.phanLoaiSo(mod.docSo(tepO(t.dinh, `_acceptance/${dau}/decisions.jsonl`)).entries, { root: ROOT, slug: dau, docTep: rel => tepO(t.dinh, rel) });
  if (!kq.do.length) die('coi dòng đời trước là đỏ mà hồ sơ đầu tiên không đỏ'); console.log('    CC-06-do nêu: ' + dau);
});
// CC-10 — sổ của chính vòng, đọc ở đỉnh tầm, gốc 08ba287d
check('CC-10', () => {
  const t = tamVong(); const mod = require(MOD); const S = 'buoc-len-thiet-ke-khong-hoi';
  const kq = mod.phanLoaiSo(mod.docSo(tepO(t.dinh, `_acceptance/${S}/decisions.jsonl`)).entries, { root: ROOT, slug: S, base: '08ba287d', docTep: rel => tepO(t.dinh, rel) });
  console.log(`    CC-10: đỏ ${kq.do.length} · câu hỏi ${kq.cau_hoi.length} · máy đã quyết ${kq.da_quyet.length} · bị thay ${kq.bi_thay}`);
  eq([kq.do.length, kq.cau_hoi.length, kq.da_quyet.length, kq.bi_thay], [0, 3, 10, 3], 'sổ của vòng');
});
// Chế độ dựng thẻ cho eval nhìn E9: node can-cu-s1.ca.mjs --dung-the <thư mục>
if (process.argv[2] === '--dung-the') {
  const out = process.argv[3]; if (!out) { console.error('cần thư mục đích'); process.exit(2); }
  const kho = mkHoSoThe(); mkdirSync(out, { recursive: true });
  writeFileSync(path.join(out, 'card.html'), '<!doctype html><meta charset="utf-8"><body style="margin:0;padding:24px">' + theCua(kho, ['--glossary-base', kho.base]).stdout);
  console.log(path.join(out, 'card.html')); process.exit(0);
}
```

(Khối `--dung-the` đặt ĐẦU tệp, ngay sau các hàm dựng kho thử, để chế độ này không chạy các ca.)

- [ ] **Step 2: Chạy, thấy đỏ** — CC-05 FAIL «thiếu khối câu hỏi»; CC-10 FAIL nếu sổ chưa đọc đúng (sẽ xanh sau Task 1 vì mô-đun đã có — ca ghi lại số).

- [ ] **Step 3: Sửa thẻ** — `scripts/gate-card.js`:
  - sau dòng `const evalYamlLib = …`: `const canCu = require('./can-cu-s1.cjs');`
  - trong nhánh `if (gate === '1') {`, ngay sau `const judgmentACs = …`:

```js
  // ── Căn cứ bước thiết kế (hồ sơ buoc-len-thiet-ke-khong-hoi, ADR 0022): một bộ đọc — scripts/can-cu-s1.cjs.
  const ccDraft = /^draft$/i.test(status);
  const cc = canCu.phanLoaiSo(ledger.entries, { root, slug, base: glossaryBase || null });
  const ccCauHoi = cc.cau_hoi;
  const ccMayQuyet = cc.da_quyet;
  const ccRieng = new Set([...ccCauHoi, ...ccMayQuyet].map(d => d.e).concat(cc.dong.filter(d => d.lop === 'bi-thay').map(d => d.e)));
  const decsChung = decsAll.filter(e => !ccRieng.has(e));
  const cat200 = s => { const t = String(s || '').replace(/\s+/g, ' ').trim(); return t.length > 200 ? t.slice(0, 199) + '…' : t; };
```

  - `g1Blocked`: `const g1Blocked = !!rangHong || mienDoCoNguoiDung || !!blindSpot || cc.do.length > 0;`
  - extract: `routing: { hoi: DA_KHEP_G1 ? [] : ['duyệt hay sửa', ...(ccDraft ? ccCauHoi.map(d => d.nhan) : [])], bao: [] }` và thêm khoá `can_cu: { cau_hoi: ccCauHoi.map(d => ({ nhan: d.nhan, id: d.id, decision: d.e.decision, khuyen: d.e.can_cu.khuyen, loi_khac: d.e.can_cu.loi_khac, kho_dao: d.e.can_cu.kho_dao === true })), da_quyet: ccMayQuyet.map(d => ({ id: d.id, decision: d.e.decision, nguon: d.e.can_cu.nguon, tep: d.e.can_cu.tep || null, trich: d.e.can_cu.trich || null, loi_chet: d.e.can_cu.loi_chet || null, ghi_chu: d.ghi_chu || null })), do: cc.do.map(d => ({ id: d.id, ma: d.ma, thong_diep: d.thong_diep })), doi_truoc: cc.doi_truoc, bi_thay: cc.bi_thay, goc: cc.goc }` ngay sau khoá `decisions_broken`.
  - thay hai dòng khối «Quyết định &amp; trade-off» (P.push lab + if/else) bằng:

```js
  if (ccCauHoi.length) P.push(`<div class="lab">${ccDraft ? 'Câu chỉ anh trả lời được' : 'Câu đã hỏi ở Cổng Phạm vi (trả lời khi duyệt)'}</div><div class="grp gdo">${ccCauHoi.map(d => `<p class="li" data-cau-hoi="${esc(d.nhan)}"><b>${esc(d.nhan)}</b> · ${esc(stripMd(d.e.decision || ''))}${d.e.can_cu.kho_dao === true ? ' · <b>khó-đảo</b>' : ''} — máy khuyên: ${esc(stripMd(d.e.can_cu.khuyen))} · lối khác: ${esc(stripMd(d.e.can_cu.loi_khac))}</p>`).join('')}</div>`);
  if (ccMayQuyet.length) P.push(`<div class="lab">Máy đã quyết ở bước thiết kế — anh lật được</div><div class="grp gnot">${ccMayQuyet.map(d => { const c = d.e.can_cu; const cu = c.nguon === 'muc-tieu' ? `căn cứ: «${esc(cat200(c.trich))}» (${esc(c.tep)})` : `lối khác chết vì: ${esc(stripMd(c.loi_chet))}`; return `<p class="li" data-may-quyet="${esc(d.id)}">${d.e.type === 'descope' ? '<b>KHÔNG làm:</b> ' : ''}${esc(stripMd(d.e.decision || ''))} — ${cu}</p>`; }).join('')}</div>`);
  P.push(`<div class="lab">Quyết định &amp; trade-off</div>`);
  if (!decsChung.length) P.push(`<div class="flag finfo">${ccCauHoi.length || ccMayQuyet.length ? 'Sổ quyết định: mọi dòng đã ở hai khối trên' : 'Sổ quyết định: (chưa ghi quyết định nào)'}</div>`);
  else P.push(`<div class="grp gnot">${decSort(decsChung).map(e => `<p class="li">${e.type === 'descope' ? '<b>KHÔNG làm:</b> ' : ''}${decBaVe(e)}</p>`).join('')}</div>`);
```

  - cờ — ngay trước `if (flags.length) P.push(…Cần chú ý…)`:

```js
  for (const d of cc.do) flags.push(['fred', esc(canCu.CO.dong(d.id, d.thong_diep))]);
  if (cc.goc === 'loi') flags.push(['fwarn', esc(canCu.CO.gocLoi(glossaryBase))]);
  else if (ccDraft && !glossaryBase && ccMayQuyet.some(d => d.e.can_cu.nguon === 'muc-tieu')) flags.push(['fwarn', esc(canCu.CO.chuaKiemGoc)]);
  if (ccDraft && cc.doi_truoc) flags.push(['fwarn', esc(canCu.CO.doiTruoc(cc.doi_truoc))]);
```

  - «VIỆC CỦA ANH» (nhánh không khép): ngay sau `<p class="li"><b>Duyệt hay trả hồ sơ này</b> … «Sửa: nêu điều cần đổi».</p>` chèn `${ccDraft ? ccCauHoi.map(d => `<p class="li"><b>${esc(d.nhan)}</b> — ${esc(stripMd(d.e.decision || ''))}: máy khuyên ${esc(stripMd(d.e.can_cu.khuyen))}; «duyệt» là nhận khuyến nghị, chọn lối khác thì trả lời «sửa: ${esc(d.nhan)} = &lt;lối&gt;».</p>`).join('') : ''}`.

- [ ] **Step 4: Sửa `commands/acceptance-card.md` bước 3** — thay `Gate 1 + repo có `CONTEXT.md` → thêm `--glossary-base <merge-base với nhánh` bằng `Gate 1 + (repo có `CONTEXT.md` HOẶC sổ quyết định có dòng mang khoá `can_cu`) → thêm `--glossary-base <merge-base với nhánh`, và nối sau câu «…thì thẻ chỉ ghi chú info, không im lặng bỏ qua.»: ` Cùng cờ đó là gốc để thẻ kiểm câu trích của lựa chọn máy đã quyết ở bước thiết kế có từ trước vòng (`scripts/can-cu-s1.cjs`); thiếu nó, thẻ nháp có cờ vàng.`

- [ ] **Step 5: Chạy, thấy xanh** — `node tests/scripts/can-cu-s1.ca.mjs` → PASS CC-05 ×4, CC-06 ×5, CC-10. Rồi bộ ca thẻ có sẵn: `node tests/scripts/gate-card-dec-key.test.mjs && node tests/scripts/gate-card-lmcms.test.mjs && node tests/scripts/msbv-the.test.mjs` → 0 failed (dòng sổ không `can_cu` đi đúng đường cũ).

- [ ] **Step 6: Commit** — `git add scripts/gate-card.js commands/acceptance-card.md tests/scripts/can-cu-s1.ca.mjs && git commit -m "feat(gate-card): Cổng Phạm vi tách câu chỉ-người-biết khỏi lựa chọn máy đã quyết; cờ đỏ căn cứ hỏng"`.

### Task 5: Tài liệu cho kho tiêu thụ — GUIDE mục sổ · CONTEXT «Nguồn căn cứ» · ADR 0022

**independent: true** · phục vụ **E8**

**Files:** Modify `GUIDE.md` (mục sổ quyết định, ~dòng 316–323) · Modify `CONTEXT.md` (mục mới cạnh «Sổ quyết định» ~dòng 335) · Create `docs/adr/0022-can-cu-lua-chon-buoc-thiet-ke-la-khoa-may-doc.md`

- [ ] **Step 1: GUIDE** — cuối mục sổ quyết định thêm đoạn «**Căn cứ của lựa chọn ở bước thiết kế (2.27):**» — ba nguồn + `kho_dao` + một ví dụ dòng mỗi nguồn (chép khuôn `DEC-CAN-CU-SLOT`, không viết khuôn thứ hai) + dòng đời trước đọc như cũ + thẻ Cổng Phạm vi hiện ba khối (câu hỏi · máy đã quyết · trade-off) và cờ đỏ/vàng + lệnh `node scripts/can-cu-s1.cjs --root . --slug <s> [--base <ref>]` và `--dem`.
- [ ] **Step 2: CONTEXT** — mục:

```markdown
**Nguồn căn cứ**:
Chỗ một lựa chọn ở bước thiết kế dựa vào: mục tiêu + quy tắc đã khai (trỏ được tệp + câu trích có từ trước vòng) · chỉ một lối ra sống (các lối khác chết vì ràng buộc nêu được) · chỉ người có (gu, nghĩa sản phẩm, đánh đổi giá trị, khẩu vị rủi ro). Hai nguồn đầu máy quyết và ghi sổ; nguồn thứ ba và mọi lựa chọn khó-đảo là câu hỏi trên thẻ Cổng Phạm vi. Ghi bằng khoá `can_cu` của dòng sổ S1.
_Avoid_: lý do (quá rộng — mọi dòng sổ có `why`), căn cứ pháp lý
```

- [ ] **Step 3: ADR 0022** — một đoạn: bối cảnh (28/51, 23/51) · quyết định (khoá tuỳ chọn `can_cu` máy đọc trên dòng S1; bộ đọc `scripts/can-cu-s1.cjs`; thẻ tách khối) · vì sao không trái ADR 0021 (0021 bác câu thứ tư cho NGƯỜI đọc; `can_cu` là con trỏ cho MÁY kiểm, cùng loại khoá `target` của dòng `fix`) · CỘNG phê đích danh: chủ kho, Cổng Phạm vi 11/10 (Hỏi-1, «duyệt») · đường đảo: ngừng ghi khoá; bộ đọc coi dòng không khoá là đời trước, không đỏ · không làm: tiền tố trong `why`, loại dòng mới, chặn ở lúc gộp · hồ sơ.
- [ ] **Step 4: Kiểm** — `node scripts/eval-coverage-lint.js . 2>&1 | grep -c "W6.*buoc-len"` → 0 (không dùng từ _Avoid_); `ls docs/adr/0022-*` có đúng một tệp.
- [ ] **Step 5: Commit** — `git add GUIDE.md CONTEXT.md docs/adr/0022-can-cu-lua-chon-buoc-thiet-ke-la-khoa-may-doc.md && git commit -m "docs: khoá can_cu — GUIDE, CONTEXT «Nguồn căn cứ», ADR 0022"`.

### Task 6: Kiểm toàn bộ trước S4

**independent: false** · phục vụ mọi eval (đường suite)

- [ ] **Step 1:** Bọc khoá máy, chạy lần lượt bốn suite như lượt chấm sẽ chạy: `bash ~/.claude/projects/-Users-manhphan-dev-crm/khoa-may/chay-nang.sh "A2 suite" bash -c 'bash tests/scripts/run-tests.sh --manh bash; for i in 1 2 3; do bash tests/scripts/run-tests.sh --manh mjs:$i/3; done; bash tests/hooks/run-tests.sh; for v in 1 2 3; do bash tests/plugins/run-tests.sh --manh vung:$v; done; bash tests/workflows/run-tests.sh' 2>&1 | grep -E "FAIL|^Results"` → 0 FAIL.
- [ ] **Step 2:** `node scripts/product-map.mjs --root . && node scripts/product-map.mjs --root . --check` (bản đồ sau đổi trạng thái).
- [ ] **Step 3:** Ghi sổ dòng `fix` stage S3 cho cách neo lịch sử của CC-02/CC-06/CC-10 (đổi so với chữ «so với commit gốc 08ba287d» của E2/E6/E10: cùng lời hứa, thước không ghim vào cây sống).
- [ ] **Step 4:** Đặt hợp đồng `status: implemented`, commit, rồi sinh args S4.

## Tự soát (máy đã chạy)

- Phủ spec: §3.1 → Task 3 Step 4 · §3.2 → Task 3 Step 3 · §3.3 → Task 1 · §3.4 → Task 4 · §3.5 → Task 3 Step 5 (dòng 10, mục 5) · §3.6 → Task 3 Step 5 (mục 7) · §3.7 → Task 2 · §3.8 → Task 3 Step 3 · §4 giới hạn → ADR + design (không mã) · AC-8 → Task 5.
- Tên thống nhất: `phanLoaiSo`, `dem`, `CO.dong/chuaKiemGoc/gocLoi/doiTruoc`, `ccMayQuyet` (mũi tiêm CC-05-do khớp chữ ở Task 4 Step 3), `tamVong`, `tepO`, `mkKho`, `ghiSoKho`, `S1/MT/ML/CN/G1`.
- Không chỗ trống: mọi bước có mã hoặc chữ thay thế nguyên văn.
