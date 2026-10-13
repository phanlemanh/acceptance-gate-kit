# Định tuyến mục Ngoài-n theo mã mục — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (tuần tự trong phiên chính — mọi task dùng chung API của Task 1). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dòng sổ gate2 «Ngoài-n» định tuyến theo mã mục (tiêu đề gỡ nhãn lượt + tệp), dòng chỉ số đã cũ sau một lượt chấm thì coi là chưa định tuyến kèm cờ vàng.

**Architecture:** MỘT bộ phân giải thuần trong `lib/out-of-contract.cjs` (`ganDinhTuyen`) — mọi bên đọc (`mucChuaDinhTuyen` → `khong-can-nguoi.mjs` · `start-scan.mjs` · `product-map.mjs` · `pre-merge-check.sh`; `dinh-tuyen-may.cjs`; `gate-card.js`) gọi nó. Hàm so tiêu đề A3 (`NHAN_LUOT_RE`, `tieuDeGoc`, `cungMuc`) dời từ `scripts/dinh-tuyen-may.cjs` xuống lib (lib là lớp CI vendored — tự đủ, không require scripts). Bên ghi người: khối marker `NGOAI-N-GATE2-LINE` trong `commands/signoff.md`.

**Tech Stack:** Node ≥ 18 (CJS + ESM), bash, git. Không phụ thuộc mới.

**Spec:** `docs/superpowers/specs/2026-10-13-dinh-tuyen-theo-ma-muc-design.md` · hợp đồng `_acceptance/dinh-tuyen-theo-ma-muc/contract.md` · evals `_acceptance/dinh-tuyen-theo-ma-muc/evals.yaml`.

## Global Constraints

- Lib thuần: không gọi git, không đọc đĩa trong `ganDinhTuyen` (bên gọi đưa văn bản).
- Mốc của dòng = giờ SỚM NHẤT đọc được giữa `at` (Date.parse) và giờ trong mã `d-YYYYMMDDTHHMMSSZ-<n>`; không đọc được giờ nào mà run-log có round-tally → dòng cũ.
- Dòng cũ = mốc < `ts` (Date.parse) của một dòng `kind: "round-tally"` trong run-log.
- `mucChuaDinhTuyen` gọi 2 đối số (bên gọi đời cũ) → hành vi y hôm nay.
- Dòng `return { chua, tong: f.findings.length, suspect: !!f.suspect_empty };` giữ NGUYÊN VĂN (neo mutant HK-AC4-dot-bien).
- `xanhSach` đòi khoá `runLog` trong ctx (nổ có tên «runLog»).
- Fixture do code sinh: mục rút `OOC-ITEM-TEMPLATE`, hợp đồng rút `CONTRACT-FRONTMATTER-TEMPLATE`, round-tally đúng `ROUND-TALLY-SCHEMA`; đường dẫn suy từ vị trí tệp test.
- Mọi phép đo mới: cặp hai chiều trên CÙNG fixture (bản lành xanh trước → bản sao tiêm đỏ, ghim thông điệp).
- Tên ca `DM<k> <tên>`; chiều đỏ `DM<k>-do <tên>`; dòng PASS kết thúc bằng khoảng trắng (khuôn `PASS: <ca> ` của hskt).

## Review Focus

1. Sổ có dòng có mã + dòng chỉ số cũ cho CÙNG mục, theo thứ tự ngược (cũ sau có mã) → «dòng sau thắng» không được làm mục rơi về chưa định tuyến chỉ vì dòng chỉ số cũ đứng sau: dòng cũ không định tuyến gì nhưng cũng không GỠ định tuyến — Task 1 hàng thêm vào ma trận DM3 (hàng 12 đảo thứ tự, kỳ vọng vẫn đã định tuyến).
2. `review-findings.md` vắng/rỗng mà sổ có dòng → 0 mục, không ném — Task 1 (DM3 hàng phụ `vang`).
3. run-log có dòng hỏng JSON/`ts` rỗng (tallyLine của đường BLOCKED-sớm có `ts: ''`) → bỏ qua dòng đó, không coi là lượt chấm — Task 1 (hàng `ts-rong`).
4. `tep` trong dòng có mã mang hậu tố dòng `src/a.js:12` trong khi mục ghi `src/a.js:14` sau lượt sửa → so tệp theo phần trước `:` — Task 1 (hàng `tep-dong-khac`).
5. Hồ sơ đã ký (có `human_signoff`) có dòng cũ → lưới KHÔNG đổi màu (luật xanh-sạch chỉ hỏi hồ sơ chưa ký) — Task 3 (DM4 hàng `da-ky`).

---

### Task 1: Bộ phân giải trong lib + ma trận DM3

**Files:**
- Modify: `lib/out-of-contract.cjs` (khối «Mục ngoài hợp đồng CHƯA NGƯỜI ĐỊNH TUYẾN», ~dòng 146–178)
- Create: `tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs`
- Phục vụ: E3 (AC-3). independent: false (mọi task sau dùng API này).

**Interfaces — Produces:**
- `NHAN_LUOT_RE: RegExp`, `tieuDeGoc(s) → string`, `coNhanLuot(s) → bool`, `cungMuc(a, b) → bool`
- `mocDong(e) → number` (ms, NaN khi không đọc được), `luotCham(runLogText) → number[]` (ms các round-tally, đã lọc NaN)
- `ganDinhTuyen(findingsText, ledgerText, runLogText) → { findings, gan: (null|{dong, cach:'ma'|'so'})[], soCu: number[], moCoi: {id, tieu_de, n, ly_do}[], luotCuoi: string|null }`
- `mucChuaDinhTuyen(findingsText, ledgerText, runLogText) → { chua, tong, suspect }` (đối số 3 tuỳ chọn)
- `cumCu(findingsText, ledgerText, runLogText) → string` — `''` hoặc `' — dòng sổ theo số ghi trước lượt chấm <ISO>: Ngoài-a, Ngoài-b'` (chỉ khi có mục chưa định tuyến VÀ soCu khác rỗng)

- [ ] **Step 1: Viết ma trận DM3 (đỏ trước).** Tệp test mới, khung giống `tests/scripts/hskt.test.mjs` (ok/bad/want, `KIT` suy từ vị trí). Rút `OOC_TPL` từ `feature-loop/workflows/acceptance-verify.js` (regex `<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)OOC-ITEM-TEMPLATE>>>`), rút khoá round-tally từ khối `ROUND-TALLY-SCHEMA` (khoá phải chứa `kind`, `round`, `verdict`). Dựng:

```js
const mucOoc = (i, o = {}) => OOC_TPL.replace(/\{(\w+)\}/g, (_, k) => ({ title: `loi that so ${i}`, plain: `Người dùng thấy lỗi ${i}.`, file: `src/a${i}.js:1`, severity: 'low', proposal: 'known-limits', ...o }[k]));
const findings = muc => '# Review findings\n\n## Trong hợp đồng\n\n## Ngoài hợp đồng — người quyết ở Gate 2\n\n' + muc.join('\n') + '\n';
const tally = ts => JSON.stringify({ ts, round: 2, kind: 'round-tally', verdict: 'PASS', expected: 1, returned: 1, blocked: 0 });
const dong = (n, o = {}) => JSON.stringify({ id: `d-20261013T060000Z-${n}`, type: 'revisit', stage: 'gate2', at: '2026-10-13T06:00:00Z', decision: `Ngoài-${n}: ghi Known limits`, ...o });
```
Ma trận 14 hàng đúng AC-3 + 4 hàng Review Focus (`dao-thu-tu`, `vang`, `ts-rong`, `tep-dong-khac`), mỗi hàng `[tên, findingsText, ledgerText, runLogText, chuaKyVong[]]`; so ĐẲNG THỨC mảng `chua` (JSON.stringify sau sort) và đếm số hàng chạy == 18. Hàng 13: `at: '2026-10-13T11:00:00Z'`, id `d-20261013T095800Z-1`, tally `2026-10-13T10:30:00Z` → cũ. Hàng 14: `at: '2026-10-13T16:00:00+07:00'` (= 09:00Z), tally `2026-10-13T10:00:00Z`, id mang giờ muộn `d-20261013T120000Z-1` → cũ (Date.parse, không so chuỗi).

- [ ] **Step 2: Chạy, xác nhận đỏ.** `node tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs DM3` → FAIL (hàm chưa có / kết quả cũ theo số).

- [ ] **Step 3: Cài đặt trong lib** (thay khối từ `const NHAN_RE` tới hết `mucChuaDinhTuyen`, giữ `NHAN_RE`, giữ nguyên dòng return):

```js
const NHAN_LUOT_RE = /\s+\([rR](?:\d+|\?)(?:\s*[·,—–-][^()]*)?\)\s*$/;
const tieuDeGoc = s => String(s == null ? '' : s).replace(NHAN_LUOT_RE, '').trim();
const coNhanLuot = s => NHAN_LUOT_RE.test(String(s == null ? '' : s));
const cungMuc = (a, b) => a != null && b != null && tieuDeGoc(a) === tieuDeGoc(b);
const tepGoc = s => String(s == null ? '' : s).replace(/^`|`$/g, '').replace(/:\d+(?::\d+)?$/, '').trim();
const ID_GIO_RE = /^d-(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z-/;
function mocDong(e) {
  const t = [Date.parse(String(e.at || ''))];
  const m = ID_GIO_RE.exec(String(e.id || ''));
  if (m) t.push(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
  const ok = t.filter(x => !Number.isNaN(x));
  return ok.length ? Math.min(...ok) : NaN;
}
function luotCham(runLogText) {
  const out = [];
  for (const l of String(runLogText || '').split('\n')) {
    let e; try { e = JSON.parse(l); } catch { continue; }
    if (e && e.kind === 'round-tally') { const t = Date.parse(String(e.ts || '')); if (!Number.isNaN(t)) out.push(t); }
  }
  return out;
}
const soCuaDong = d => { const out = []; for (const m of String(d || '').matchAll(NHAN_RE)) { const a = +m[1], b = m[2] ? +m[2] : a; for (let i = Math.min(a, b); i <= Math.max(a, b); i++) out.push(i); } return out; };
function ganDinhTuyen(findingsText, ledgerText, runLogText) {
  const f = typeof findingsText === 'object' && findingsText ? findingsText : parse(findingsText == null ? '' : findingsText);
  const L = f.findings, gan = L.map(() => null), soCu = new Set(), moCoi = [];
  const luot = luotCham(runLogText), cuoi = luot.length ? Math.max(...luot) : null;
  const cu = e => { if (cuoi == null) return false; const m = mocDong(e); return Number.isNaN(m) || m < cuoi; };
  for (const l of String(ledgerText || '').split('\n')) {
    if (!l.trim()) continue;
    let e; try { e = JSON.parse(l); } catch { continue; }
    if (!e || typeof e !== 'object' || String(e.stage || '').trim().toLowerCase() !== 'gate2') continue;
    const so = soCuaDong(e.decision), laCu = cu(e);
    const td = typeof e.tieu_de === 'string' && e.tieu_de.trim() ? e.tieu_de : null;
    if (td) {
      const ung = L.map((x, i) => i).filter(i => cungMuc(L[i].title, td) && (!e.tep || tepGoc(e.tep) === tepGoc(L[i].file)));
      let i = -1, ly = '';
      if (laCu) { const nhan = ung.filter(k => coNhanLuot(L[k].title)); if (nhan.length === 1) i = nhan[0]; else ly = nhan.length ? 'trung-ma' : 'khong-con-muc-mang-sang'; }
      else if (so.length) { const k = so.find(n => ung.includes(n - 1)); if (k) i = k - 1; else ly = 'so-lech-tieu-de'; }
      else if (ung.length === 1) i = ung[0]; else ly = ung.length ? 'trung-ma' : 'khong-con-muc';
      if (i >= 0) gan[i] = { dong: e, cach: 'ma' }; else moCoi.push({ id: e.id || '', tieu_de: td, n: so[0] || null, ly_do: ly, may: e.may || null });
      continue;
    }
    if (!so.length) continue;
    if (laCu) { for (const n of so) soCu.add(n); continue; }
    for (const n of so) if (n >= 1 && n <= L.length) gan[n - 1] = { dong: e, cach: 'so' };
  }
  return { findings: f, gan, soCu: [...soCu].sort((a, b) => a - b), moCoi, luotCuoi: cuoi == null ? null : new Date(cuoi).toISOString().replace(/\.\d+Z$/, 'Z') };
}
function mucChuaDinhTuyen(findingsText, ledgerText, runLogText) {
  const f = parse(findingsText == null ? '' : findingsText);
  const g = ganDinhTuyen(f, ledgerText, runLogText);
  const chua = f.findings.map((_, i) => i + 1).filter(i => !g.gan[i - 1]).map(i => `Ngoài-${i}`);
  return { chua, tong: f.findings.length, suspect: !!f.suspect_empty };
}
function cumCu(findingsText, ledgerText, runLogText) {
  const g = ganDinhTuyen(findingsText, ledgerText, runLogText);
  if (!g.soCu.length || g.gan.every(Boolean)) return '';
  return ` — dòng sổ theo số ghi trước lượt chấm ${g.luotCuoi}: ${g.soCu.map(n => 'Ngoài-' + n).join(', ')}`;
}
module.exports = { parse, PROPOSALS, OOC_GLOSS_NGUOI, mucChuaDinhTuyen, ganDinhTuyen, cumCu, NHAN_LUOT_RE, tieuDeGoc, coNhanLuot, cungMuc, mocDong, luotCham };
```
Cập nhật chú thích `GIỚI HẠN ĐÃ KHAI` trên khối: thay câu «một lượt chấm SAU dòng gate2…» bằng luật mới + trỏ design §5.

- [ ] **Step 4: Chạy DM3 xanh** — `node tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs DM3` → `PASS: DM3 ma-tran — 18/18 hàng`.
- [ ] **Step 5: Chiều đỏ DM3-do mo-coi / so-tieu-de / thoi-diem.** Helper `banSaoLib(tu, thanh)`: thư mục tạm, `cpSync(lib)` rồi thay chuỗi trong bản sao `out-of-contract.cjs` (chuỗi không có → ném «neo mutant không khớp»), `require` bản sao. Ba mutant: (a) `if (i >= 0) gan[i] = { dong: e, cach: 'ma' }; else` → `if (i < 0 && so[0]) i = so[0] - 1; if (i >= 0) gan[i] = { dong: e, cach: 'ma' }; else` (mồ côi thành theo số) → hàng 3, 4 đỏ; (b) `const k = so.find(n => ung.includes(n - 1));` → `const k = so[0];` → hàng 5 đỏ; (c) `if (m) t.push(` → `if (false) t.push(` → hàng 13 đỏ. Mỗi ca: bản lành xanh trên cùng hàng trước, rồi bản sao đỏ đúng hàng, in tên hàng.
- [ ] **Step 6: Chạy lại HK-AC4 cũ** — `node tests/scripts/hskt.test.mjs HK-AC4-ma-tran HK-AC4-dot-bien` → PASS (đọc-cũ không đổi).
- [ ] **Step 7: Commit** `feat(dinh-tuyen-theo-ma-muc): bộ phân giải dòng sổ gate2 theo mã mục trong lib`.

### Task 2: `xanhSach` đòi `runLog` + ba bên gọi mjs + DM1, DM2, DM5

**Files:**
- Modify: `scripts/khong-can-nguoi.mjs` (guard ctx ~dòng 62; vế Ngoài hợp đồng ~dòng 88–90; CLI ctx ~dòng 137)
- Modify: `scripts/start-scan.mjs` (~dòng 75), `scripts/product-map.mjs` (~dòng 245)
- Modify: `tests/scripts/hskt.test.mjs` (neo `CA_BEN_GOI['product-map.mjs']` theo dòng mới)
- Test: `tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs`
- Phục vụ: E1 (AC-1), E2 (AC-2), E5 (AC-5). independent: false.

**Interfaces — Consumes:** `mucChuaDinhTuyen`, `cumCu` (Task 1). **Produces:** ctx `{ findings, ledger, runLog }`.

- [ ] **Step 1: Test đỏ DM1/DM2/DM5.** Kho thử git (khuôn `khoLanV` của hskt: hợp đồng `veto_state: mo`, báo cáo PASS, `## Known limits` + `## Ngoài hợp đồng` rỗng) thêm `run-log.jsonl`. DM1 doi-chung: 8 mục + 8 dòng có mã (`tieu_de`, `tep`), tally `03:00Z`, dòng `06:00Z` → `--check` thoát 0, stdout `sẽ machine-cleared`. DM1 doi-so: thêm tally `08:00Z`, mục mới đầu, 8 mục cũ đổi tiêu đề thành `<cũ> (r1)` → thoát 2, stderr chứa `chưa người định tuyến: Ngoài-1` và không chứa `Ngoài-2`. DM1 nhan-luot: nhãn `(r1 · tệp đã đổi)`. DM1 tuoi: mục tươi cùng tiêu đề + tệp với mục đã quyết, không nhãn → nêu nhãn của nó. DM2 doc-cu / ca-crm như evals E2. DM5 thieu-khoa: `xanhSach(c, e, { findings, ledger })` ném, message chứa `runLog`. DM5 ben-goi: quét `scripts/` bằng `/\b(xanhSach|khongCanNguoi)\(/`, bảng `CA_DM5` cho `khong-can-nguoi.mjs`, `start-scan.mjs`, `product-map.mjs` chạy trên fixture ca-crm (đều ra còn cần người); bên gọi chưa có ca → FAIL.
- [ ] **Step 2: Chạy, xác nhận đỏ** (`DM1 doi-so` thoát 0 / why chỉ nêu Ngoài-9).
- [ ] **Step 3: Cài đặt.** Guard: `if (!ctx || typeof ctx !== 'object' || !('findings' in ctx) || !('ledger' in ctx) || !('runLog' in ctx)) throw new Error('xanhSach: thiếu ngữ cảnh { findings, ledger, runLog } — bên gọi phải đọc review-findings.md, decisions.jsonl và run-log.jsonl cạnh báo cáo (null khi tệp vắng)');`. Vế mục: `const m = ctx.findings == null ? … : mucChuaDinhTuyen(ctx.findings, ctx.ledger, ctx.runLog);` và why `… chưa người định tuyến: ${m.chua.join(', ')}${cumCu(ctx.findings, ctx.ledger, ctx.runLog)}`. CLI: dòng mới ngay dưới dòng `const ctx = …` (giữ NGUYÊN dòng neo HK-AC8): `ctx.runLog = docCanh('run-log.jsonl');`. start-scan: thêm `runLog: read(path.join(dir, 'run-log.jsonl')).t ?? null,` sau dòng `ledger:`. product-map: thêm `, runLog: readRecord(path.join(dir, 'run-log.jsonl')).t ?? null` trong object; sửa neo HK-AC8 tương ứng.
- [ ] **Step 4: Chiều đỏ.** DM1-do theo-so (banSaoLib: `if (td) {` → `if (false) {`), DM2-do bo-thoi-diem (`const laCu = cu(e)` → `const laCu = false`) — chạy CLI khong-can-nguoi của bản sao (bản sao scripts + lib, khuôn `banSao` của NT). DM5-do: mỗi bên gọi, bản sao thay `run-log.jsonl` bằng `khong-co.jsonl` → ca bên ấy đỏ.
- [ ] **Step 5: Chạy** `node tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs DM1 DM2 DM5` + `node tests/scripts/hskt.test.mjs HK-AC8-ben-goi HK-AC8-dot-bien HK-AC4-ma-tran` → PASS.
- [ ] **Step 6: Commit** `feat(dinh-tuyen-theo-ma-muc): luật xanh-sạch đọc run-log, ba bên gọi truyền runLog`.

### Task 3: Lưới trước-gộp truyền run-log + DM4

**Files:** Modify `scripts/pre-merge-check.sh` (khối `_ooc`, ~dòng 463–479). Test DM4. Phục vụ E4 (AC-4). independent: false.

- [ ] **Step 1: Test đỏ DM4 luoi** — mỗi hàng ma trận DM3 (14 hàng AC-3 + `da-ky`) dựng `khoLanV`; chạy `pre-merge-check.sh <R> --base basepoint`; so VIOLATION/NOTE với `chuaKyVong` (rỗng → NOTE làn V); bộ quét `start-scan.mjs --root R --json` không xếp `may-di-tiep` ở hàng chặn. DM4 machine-cleared: hồ sơ `status: machine-cleared` + ca-crm → dòng `VIOLATION [<slug>]: status machine-cleared` chứa `chưa người định tuyến`. Hàng `da-ky` (`human_signoff` khác rỗng) → không VIOLATION.
- [ ] **Step 2: Chạy đỏ** (lưới chưa truyền run-log → ca-crm qua).
- [ ] **Step 3: Cài đặt** — trong `node -e`: `const {mucChuaDinhTuyen,cumCu}=require(process.argv[1]);` … `const m=mucChuaDinhTuyen(rd(process.argv[2]),rd(process.argv[3]),rd(process.argv[4]));` … `process.stdout.write(m.chua.length?m.chua.length+"|"+m.chua.join(", ")+cumCu(rd(process.argv[2]),rd(process.argv[3]),rd(process.argv[4])):"OK:"+m.tong);` và thêm đối số `"$_cdir/run-log.jsonl"`. Nhánh `*)` giữ: `${_ooc%%|*}` / `${_ooc#*|}`.
- [ ] **Step 4: Chiều đỏ DM4-do luoi-khong-truyen-runlog** — bản sao `pre-merge-check.sh` thay `"$_cdir/run-log.jsonl"` bằng `"$_cdir/khong-co.jsonl"` → hàng ca-crm thành NOTE làn V.
- [ ] **Step 5: Chạy** `DM4` + `node tests/scripts/hskt.test.mjs HK-AC4-bash` + `node tests/plugins/lan-v.test.mjs` (LV5) → PASS.
- [ ] **Step 6: Commit** `feat(dinh-tuyen-theo-ma-muc): lưới trước-gộp đọc run-log cho luật định tuyến`.

### Task 4: Máy định tuyến dùng bộ phân giải + DM6

**Files:** Modify `scripts/dinh-tuyen-may.cjs` (`NHAN_LUOT_RE`/`tieuDeGoc`/`cungMuc` → lấy từ lib; `keHoach` nhận `runLog`; CLI đọc `run-log.jsonl`; chặn dòng cũ). Modify `tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs` (neo NT6-do, NT12 mot-ham, NT12-do bo-go-nhan theo vị trí mới). Phục vụ E6 (AC-6). independent: false.

- [ ] **Step 1: Test đỏ DM6 may-doi-so / nguoi-cu** (bật khoá kho; fixture như evals E6).
- [ ] **Step 2: Chạy đỏ** (may-doi-so báo «dòng máy trỏ mục đã đổi»).
- [ ] **Step 3: Cài đặt** — `const { tieuDeGoc, cungMuc } = ooc;` thay ba dòng định nghĩa; export giữ tên. `keHoach({ contract, evidence, findings, ledger, config, runLog })`:

```js
const g = ooc.ganDinhTuyen(p, ledger, runLog);
const chuaCo = p.findings.some((_, i) => !g.gan[i]);
if (g.soCu.length && chuaCo) return { cu: { luot: g.luotCuoi, so: g.soCu } };
const lech = g.moCoi.filter(m => m.may === DAU_MAY).map(m => ({ n: m.n, cu: m.tieu_de, moi: m.n && p.findings[m.n - 1] ? p.findings[m.n - 1].title : '(không còn mục ở vị trí này)' }));
const ghi = [];
p.findings.forEach((f, i) => { if (!g.gan[i] && TOKEN_MAY.includes(f.proposal)) ghi.push({ n: i + 1, token: f.proposal, f }); });
return { lech, ghi };
```
CLI: `if (k.cu) { console.error(\`dinh-tuyen-may: dòng sổ người theo số ghi trước lượt chấm ${k.cu.luot} (${k.cu.so.map(n => 'Ngoài-' + n).join(', ')}) — mục có thể đã đổi số; người định tuyến lại ở Cổng 2\`); return 2; }` đặt TRƯỚC nhánh `lech`. Đọc `runLog: doc(path.join(dir, 'run-log.jsonl'))`. Cập nhật đầu tệp: thay đoạn «GIỚI HẠN ĐÃ KHAI (design §5)…» bằng một dòng trỏ bộ phân giải lib.
- [ ] **Step 4: Sửa neo NT** — NT6-do: neo mới `const lech = g.moCoi.filter(m => m.may === DAU_MAY)` → `const lech = [].filter(m => m)`; NT12 mot-ham: gate-card phải gọi `ganDinhTuyen(` của lib và không tự định nghĩa `NHAN_LUOT_RE|tieuDeGoc =`; NT12-do: mutant trên bản sao LIB (`replace(NHAN_LUOT_RE, '')` → `replace(/$^/, '')`) — thêm helper `banSaoCaLib` (chép cả `scripts` lẫn `lib`).
- [ ] **Step 5: Chiều đỏ DM6-do bo-chan-cu** — bản sao bỏ dòng `if (g.soCu.length && chuaCo) return …` → nguoi-cu thoát 0 và sổ thêm dòng.
- [ ] **Step 6: Chạy** `DM6` + `node tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs` (trọn tệp) → PASS.
- [ ] **Step 7: Commit** `feat(dinh-tuyen-theo-ma-muc): máy định tuyến khớp theo mã, dừng trước dòng sổ người đã cũ`.

### Task 5: Thẻ Cổng 2 — khớp theo mã + cờ dòng cũ + DM7

**Files:** Modify `scripts/gate-card.js` (khối DTM ~dòng 1078–1089; cờ ~dòng 1318). Phục vụ E7, E8 (AC-7). independent: false.

- [ ] **Step 1: Test đỏ DM7 co-vang / khong-co** (render HTML + `--extract` kho thử ca-crm).
- [ ] **Step 2: Cài đặt** —

```js
const ganG = outOfContract.ganDinhTuyen(read(path.join(dir, 'review-findings.md')), read(path.join(dir, 'decisions.jsonl')), read(path.join(dir, 'run-log.jsonl')));
const dtmMay = fi => { const x = ganG.gan[fi]; const d = x && x.dong; return d && d.may === DTM_DAU ? { id: d.id || '', dao: d.dao || '', de_xuat: (dtmLib && dtmLib.deXuatCua) ? dtmLib.deXuatCua(d.decision) : '' } : null; };
const dtmLech = ganG.moCoi.filter(m => m.may === DTM_DAU).map(m => 'Ngoài-' + (m.n || '?'));
const dtmCu = (ganG.soCu.length && ganG.gan.some(x => !x)) ? ganG : null;
```
(`deXuatCua` = hàm nhỏ export từ dinh-tuyen-may.cjs: `d => GLOSS_TOKEN[String(d || '').replace(/^[^:]*:\s*/, '').trim()] || ''`). Cờ mới cạnh cờ dtmLech: `if (dtmCu) P.push(\`<div class="flag fwarn">⚠ dòng sổ Cổng 2 ghi theo SỐ trước lượt chấm ${esc(dtmCu.luotCuoi)}: ${esc(dtmCu.soCu.map(n => 'Ngoài-' + n).join(', '))} — mục có thể đã đổi số kể từ khi ký; các mục chưa định tuyến được hỏi lại.</div>\`);` (cụm «ghi trước lượt chấm» là chuỗi DM7 ghim).
- [ ] **Step 3: Chiều đỏ DM7-do** — bản sao gate-card bỏ dòng `if (dtmCu) P.push(` → co-vang đỏ.
- [ ] **Step 4: Chạy** `DM7` + `LMCMS_ONLY=LM20 node tests/scripts/gate-card-lmcms.test.mjs` + `node tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs NT12` → PASS.
- [ ] **Step 5: Commit** `feat(dinh-tuyen-theo-ma-muc): thẻ Cổng 2 khớp dòng máy theo mã và cờ dòng sổ cũ`.

### Task 6: Khuôn dòng sổ người trong signoff + DM8

**Files:** Modify `commands/signoff.md` (đoạn «Ngoài-<số>… ghi thành entry», ~dòng 119). Phục vụ E9 (AC-8). independent: false.

- [ ] **Step 1: Test đỏ DM8 khu-hoi** — rút khối `<!-- <<<NGOAI-N-GATE2-LINE -->…<!-- NGOAI-N-GATE2-LINE>>> -->` (vắng → FAIL «không rút được khối NGOAI-N-GATE2-LINE»), lấy dòng giữa ```…```, điền `<…>` từ `parse()` kho thử, bọc `{"id":"d-<giờ>-<n>",` … `}`, ghi 8 dòng, rồi tally mới + mục mới đầu + nhãn `(r1)`: `mucChuaDinhTuyen` == `["Ngoài-1"]`; tập khoá ⊇ `{id,type,stage,at,decision,tieu_de,tep}`.
- [ ] **Step 2: Thêm khối** ngay sau câu «— đúng như đường hỏi-từng-bước vẫn làm.»:

```markdown
Mỗi mục `Ngoài-<n>` ghi MỘT dòng sổ, mang mã mục chép NGUYÊN VĂN từ `review-findings.md` (tiêu đề in đậm
kể cả nhãn lượt, và dòng `file:` của mục) — bộ phân giải `ganDinhTuyen` của `lib/out-of-contract.cjs` khớp
dòng vào mục theo mã, nên lượt chấm sau đổi số mục cũng không làm dòng trỏ nhầm (hồ sơ dinh-tuyen-theo-ma-muc).
Chép sai thì dòng mồ côi và mục được hỏi lại — chiều an toàn. Id theo khối DEC-ID-RECIPE:
<!-- <<<NGOAI-N-GATE2-LINE -->
​```
"type":"revisit","stage":"gate2","at":"<ISO>","decision":"Ngoài-<n>: <chữ người>","why":"<vì sao, 1 câu>","cost_if_wrong":"<giá, 1 câu>","tieu_de":"<tiêu đề mục>","tep":"<file của mục>"
​```
<!-- NGOAI-N-GATE2-LINE>>> -->
```
- [ ] **Step 3: Chiều đỏ DM8-do bo-tieu-de** — bản sao signoff.md gỡ `,"tieu_de":"<tiêu đề mục>"` → `chua` đủ Ngoài-1…9.
- [ ] **Step 4: Chạy** `DM8` + `node tests/plugins/*.test.mjs` các ca canh signoff.md (P32, marker) → PASS.
- [ ] **Step 5: Commit** `feat(dinh-tuyen-theo-ma-muc): khuôn dòng sổ người mang mã mục trong signoff`.

### Task 7: Executor, vi phân trên kho kit (DM9), xử tac-tu, bản đồ

**Files:** Modify `_acceptance/config.yaml` (khoá `executors.test.dinh_tuyen_theo_ma`, khuôn khoá `ngoai_n_tu_dinh_tuyen`). Test DM9. `PRODUCT-MAP.md` (máy sinh). `_acceptance/tac-tu-cham-chi-cham-khong/*` chỉ qua lệnh ký của người. Phục vụ E10 (AC-9). independent: false.

- [ ] **Step 1: Khoá executor**: `dinh_tuyen_theo_ma: "bash -c 'set -o pipefail; node tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs 2>&1 | grep -E \"^(PASS|FAIL): DM|^DM Results|^  · \" | paste -sd\"|\" -'"`; tệp test in dòng `DM Results: <pass> pass, <fail> fail` và thoát 1 khi fail > 0.
- [ ] **Step 2: DM9 chon-moc / vi-phan / luoi-cay / DM9-do** — mốc = `git rev-parse <sha>^` với `sha = git log --reverse --format=%H -S ganDinhTuyen -- lib/out-of-contract.cjs | head -1`; `git archive <moc> _acceptance lib | tar -x -C <tmp>`; với mọi hồ sơ cây mốc không có `human_signoff` và có `review-findings.md`: so `mucChuaDinhTuyen` của lib HEAD (3 đối số) với lib mốc (đối số mốc nhận); tập đổi == `['tac-tu-cham-chi-cham-khong']`. luoi-cay: `pre-merge-check.sh . --base <moc>` không có dòng `VIOLATION [tac-tu-cham-chi-cham-khong]` chứa `chưa người định tuyến`.
- [ ] **Step 3: Xử tac-tu** — người ký `tac-tu-cham-chi-cham-khong` bằng lệnh điền sẵn trình ở Gate 1.5 (dòng sổ theo khuôn Task 6, ghi SAU round-tally r3 nên luật mới tin). Máy KHÔNG tự ghi dòng nào cho hồ sơ ấy.
- [ ] **Step 4: Bản đồ** — `AG=. ` khối MAP-STAGE; chạy `node scripts/product-map.mjs --root . --check`.
- [ ] **Step 5: Chạy trọn** `node tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs` → `DM Results: N pass, 0 fail`.
- [ ] **Step 6: Commit** `test(dinh-tuyen-theo-ma-muc): khoá executor + vi phân trên kho kit`; contract `status: implemented` → S4.
