# Chân công cụ đọc đúng lệnh chỉ-gán mang lệnh con — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (feature-loop T2: tuần tự trong phiên chính). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `tuDau()` của chân `cong_cu` trả `git` cho `B=$(git merge-base …) && …`, và mọi dạng chỉ-gán mang lệnh con tra chương trình trong lệnh con.

**Architecture:** Thay bộ tách phẳng (khoảng trắng + nháy) trong `feature-loop/scripts/duong-nen.mjs` bằng bộ tách lệnh đơn hiểu vùng thay thế `$(…)` `${…}` `` `…` `` và ranh giới `;` `&` `|`. Luật `tenChuongTrinh` (khối marker `CONG-CU-TU-DAU`) giữ nguyên.

**Tech Stack:** Node ESM thuần, không phụ thuộc mới; ca kiểm trong `tests/scripts/duong-nen.test.mjs` (harness pass/bad tự viết của kho).

**Spec:** `docs/superpowers/specs/2026-09-24-nen-cong-cu-gan-bang-lenh-con-design.md` · hợp đồng `_acceptance/nen-cong-cu-gan-bang-lenh-con/contract.md`

## Global Constraints

- Không LLM trong đường nền; không đổi khối marker `CONG-CU-TU-DAU` (ca đột biến NEN-TD5/TD6 thay nó).
- Mỗi khoá executor vẫn tra MỘT chương trình (descope `d-20260924T084748Z-2`).
- Fixture do code sinh (`dungKho()`), mọi lượt truyền `--cache-root` do ca dựng.

## Review Focus

- `2>&1` / `>&2` trong lệnh đơn đầu: `&` của chuyển hướng không được cắt lệnh — ca thử tay `echo x 2>&1` → `echo` (Task 2 bước 3).
- Vùng thay thế không đóng (`B=$(git` cụt): không treo, không ném — `hetVung` chạy tới hết chuỗi; ca thử tay (Task 2 bước 3).
- Khoá là tiền tố chữ của khoá khác (`lc` vs `lc_doi_chung`): bộ dò dòng bỏ-tra phải so tiền tố có khoảng trắng — `boQuaKhoa` (Task 1).
- Từ đầu `${…:-$(…)}` nay là trọn từ: dòng bỏ-tra dài hơn nhưng vẫn một dòng — NEN-TD4 giữ (Task 2 bước 4).
- `$((1+2))` số học: rơi vào bỏ-tra-và-nói-ra, không đỏ — ngoài phạm vi, không ca.

---

### Task 1: Ca NEN-LC1..3 (đỏ trên bản chưa vá)

**Files:** Modify `tests/scripts/duong-nen.test.mjs` (header + import + khối mới trước `donDep();`) · phục vụ E1–E5 · `independent: false` (Task 2 cần nó đỏ trước)

- [ ] **Step 1:** thêm import `createHash` (`node:crypto`), `createRequire` (`node:module`); dòng header nhắc hồ sơ mới.
- [ ] **Step 2:** chèn khối ca dưới đây ngay trước `donDep();`:

```js

// ── NEN-LC* — lệnh CHỈ-GÁN mang lệnh con: tra chương trình TRONG lệnh con ─────────
// Hồ sơ nen-cong-cu-gan-bang-lenh-con. `B=$(git merge-base …) && …` phải tra `git`, không
// phải `merge-base` (lệnh con của git) hay `&&`. Khoá đo nằm ở nhóm `script`, NGOÀI
// suite_keys, nên chân suite không chạy chuỗi đang đo. Mỗi lượt có thêm khoá đối chứng chắc
// chắn bỏ-tra: bộ dò phải thấy ĐÚNG MỘT dòng bỏ-tra nguyên văn của nó trước khi «0 dòng» cho
// khoá đang đo được tin — assertion âm tính không đứng một mình (gap-probe F1).

// Giá trị YAML THÔ của executors.script.zqw_giu_nqz ở crm@onehub 64d7c593 (nháy đơn giữ
// nguyên). sha256 ghim ở contract: lệch băm = hằng chép sai, ca tự đỏ trước khi đo (F2).
const CRM_ZQW_YAML = `'B=$(git merge-base HEAD origin/onehub) && { git diff --quiet "$B" -- apps/agent/test/nhac-qua-zalo.integration.spec.ts || { echo "spec da ky cua nhac-qua-zalo bi sua" >&2; exit 1; }; } && bun run test -- "cd apps/agent && bun test test/nhac-qua-zalo.integration.spec.ts"'`;
const CRM_ZQW_SHA256 = '652e6eccb66fa661478ede817b496b72cae36638e024bff9da48fb6165d64379';
const DOI_CHUNG = '${X_KHONG_CO:-git} --version';
const DONG_DOI_CHUNG = 'cong-cu: bo qua executors.script.lc_doi_chung — tu dau «${X_KHONG_CO:-git}» dung cu phap shell, khong phai ten chuong trinh';
const { resolveConfigKey } = createRequire(import.meta.url)(path.join(KIT, 'lib', 'evidence-core.cjs'));

// Dòng bỏ-tra của ĐÚNG khoá đã cho (so tiền tố có khoảng trắng — `executors.script.lc` là
// tiền tố chữ của `executors.script.lc_doi_chung`, `includes` sẽ đếm lẫn).
const boQuaKhoa = (stderr, khoa) => String(stderr || '').split('\n').filter(l => l.startsWith(`cong-cu: bo qua ${khoa} `));
const bulletCongCuMoi = tep => (bullets(tep) || []).filter(x => x.startsWith('nen cong-cu:'));
const yamlCmd = cmd => ({ yaml: JSON.stringify(cmd), cmd });

/**
 * chayLC(khoa) — fixture lành của NEN0 thêm nhóm `executors.script` gồm các khoá đã cho
 * ({ ten: { yaml, cmd } }) cùng khoá đối chứng. Round-trip TRƯỚC khi chạy: mọi khoá phải
 * được `resolveConfigKey` đọc lại đúng `cmd`; lệch → { lech } và ca tự đỏ, không chạy.
 */
function chayLC(khoa) {
  const tat = { ...khoa, lc_doi_chung: yamlCmd(DOI_CHUNG) };
  const dong = Object.entries(tat).map(([k, v]) => `    ${k}: ${v.yaml}\n`).join('');
  const config = CONFIG_LANH.replace('feature_loop:\n', `  script:\n${dong}feature_loop:\n`);
  const lech = Object.entries(tat).filter(([k, v]) => resolveConfigKey(config, `executors.script.${k}`) !== v.cmd).map(([k]) => k);
  if (lech.length) return { lech };
  const r = chayNen(dungKho({ config }), { cache: CACHE });
  const dc = boQuaKhoa(r.stderr, 'executors.script.lc_doi_chung');
  return { lech, r, doiChung: dc.length === 1 && dc[0] === DONG_DOI_CHUNG ? null : JSON.stringify(dc) };
}

// ── NEN-LC1 — chuỗi NGUYÊN VĂN của crm@onehub → chân công cụ XANH, tra `git` ─────
{
  const sha = createHash('sha256').update(CRM_ZQW_YAML).digest('hex');
  const x = sha === CRM_ZQW_SHA256 ? chayLC({ lc: { yaml: CRM_ZQW_YAML, cmd: CRM_ZQW_YAML.slice(1, -1) } }) : null;
  if (!x) bad('NEN-LC1 hang CRM_ZQW_YAML lech dong that cua crm@onehub 64d7c593', sha);
  else if (x.lech.length) bad('NEN-LC1 fixture khong round-trip', x.lech.join(','));
  else if (x.doiChung) bad('NEN-LC1 doi chung: khong thay dung 1 dong bo-tra nguyen van cho lc_doi_chung', x.doiChung);
  else if (bulletCongCuMoi(x.r.tep).length) bad('NEN-LC1 chuoi crm van sinh bullet cong-cu', JSON.stringify(bulletCongCuMoi(x.r.tep)));
  else if (boQuaKhoa(x.r.stderr, 'executors.script.lc').length) bad('NEN-LC1 chuoi crm roi vao nhanh bo-tra — im nham thay vi tra git', JSON.stringify(boQuaKhoa(x.r.stderr, 'executors.script.lc')));
  else if (x.r.code !== 0 || fm(x.r.tep, 'cong_cu') !== 'xanh') bad('NEN-LC1 chuoi crm phai cho ma 0 va chan cong_cu xanh', tomTat(x.r));
  else ok('NEN-LC1 chuoi nguyen van crm@onehub zqw_giu_nqz — ma 0, cong_cu xanh, 0 bullet, 0 dong bo-tra (doi chung: dung 1 dong)');
}

// ── NEN-LC2 — cùng fixture, chương trình THẬT SỰ vắng → ĐỎ, gọi đúng tên ─────────
{
  const x = chayLC({ lc: yamlCmd('khong-co-that --x') });
  const can = ['nen cong-cu: THIEU khong-co-that (khoa executors.script.lc)'];
  const b = x.r ? bulletCongCuMoi(x.r.tep) : [];
  if (x.lech.length) bad('NEN-LC2 fixture khong round-trip', x.lech.join(','));
  else if (x.doiChung) bad('NEN-LC2 doi chung: khong thay dung 1 dong bo-tra nguyen van cho lc_doi_chung', x.doiChung);
  else if (JSON.stringify(b) !== JSON.stringify(can)) bad('NEN-LC2 bullet cong-cu khac dung mot dong ghim', JSON.stringify(b));
  else if (x.r.code !== 1 || fm(x.r.tep, 'cong_cu') !== 'do') bad('NEN-LC2 phai ma 1 va chan cong_cu do', tomTat(x.r));
  else ok(`NEN-LC2 chuong trinh vang that — do, ghim «${can[0]}»`);
}

// ── NEN-LC3 — ma trận viết trước: {$(…), "$(…)", `…`, chỉ-gán trần} × {có, vắng} ──
// Tám chuỗi và bốn bullet ghim NGUYÊN VĂN ở evals.yaml E3–E5; so BẰNG NHAU, không includes.
{
  const MA_TRAN = {
    lc_tran_co: 'B=$(git rev-parse HEAD) && echo "$B"',
    lc_nhay_co: 'B="$(git rev-parse "HEAD")" && echo "$B"',
    lc_huyen_co: 'B=`git rev-parse HEAD`; echo $B',
    lc_gan_co: 'A=1; git --version',
    lc_tran_thieu: 'B=$(khong-co-that-lc1 --x) && echo "$B"',
    lc_nhay_thieu: 'B="$(khong-co-that-lc2 "--x")" && echo "$B"',
    lc_huyen_thieu: 'B=`khong-co-that-lc3 --x`; echo $B',
    lc_gan_thieu: 'A=1 && khong-co-that-lc4 --x',
  };
  const MONG = [
    'nen cong-cu: THIEU khong-co-that-lc1 (khoa executors.script.lc_tran_thieu)',
    'nen cong-cu: THIEU khong-co-that-lc2 (khoa executors.script.lc_nhay_thieu)',
    'nen cong-cu: THIEU khong-co-that-lc3 (khoa executors.script.lc_huyen_thieu)',
    'nen cong-cu: THIEU khong-co-that-lc4 (khoa executors.script.lc_gan_thieu)',
  ].sort();
  const x = chayLC(Object.fromEntries(Object.entries(MA_TRAN).map(([k, v]) => [k, yamlCmd(v)])));
  const b = x.r ? bulletCongCuMoi(x.r.tep).sort() : [];
  const roiBoQua = x.r ? Object.keys(MA_TRAN).filter(k => boQuaKhoa(x.r.stderr, `executors.script.${k}`).length) : [];
  if (Object.keys(MA_TRAN).length !== 8 || MONG.length !== 4) bad('NEN-LC3 ma tran khai sai kich thuoc (can 8 khoa, 4 bullet)', `${Object.keys(MA_TRAN).length}/${MONG.length}`);
  else if (x.lech.length) bad('NEN-LC3 fixture khong round-trip', x.lech.join(','));
  else if (x.doiChung) bad('NEN-LC3 doi chung: khong thay dung 1 dong bo-tra nguyen van cho lc_doi_chung', x.doiChung);
  else if (JSON.stringify(b) !== JSON.stringify(MONG)) bad('NEN-LC3 tap bullet cong-cu khac tap mong doi', JSON.stringify(b));
  else if (roiBoQua.length) bad('NEN-LC3 khoa roi vao nhanh bo-tra', roiBoQua.join(','));
  else if (fm(x.r.tep, 'cong_cu') !== 'do') bad('NEN-LC3 chan cong_cu phai do', tomTat(x.r));
  else ok('NEN-LC3 ma tran 8 khoa — tap bullet == 4 dong mong doi, 0 khoa roi bo-tra (doi chung: dung 1 dong)');
}
```

- [ ] **Step 3:** `node tests/scripts/duong-nen.test.mjs 2>&1 | grep -E 'NEN-LC|^Results'` — Expected: FAIL NEN-LC1 (bullet `THIEU merge-base`) và FAIL NEN-LC3; NEN-LC2 PASS; mọi ca cũ PASS.
- [ ] **Step 4:** commit `test(duong-nen): ca NEN-LC1..3 — lệnh chỉ-gán mang lệnh con (đỏ trên bản chưa vá)`; ghi kết quả đỏ vào sổ (`fix`, stage S3).

### Task 2: Bộ tách lệnh đơn

**Files:** Modify `feature-loop/scripts/duong-nen.mjs` (thay `function tuDau` và chú thích ngay trên nó; sửa câu «mảnh cụt» trong chú thích khối marker) · phục vụ E1–E6 · `independent: false`

- [ ] **Step 1:** thay thân `tuDau` bằng:

```js
// Tách chuỗi lệnh executor thành các LỆNH ĐƠN của shell, đủ để gọi tên chương trình chạy đầu.
// Bộ tách hiểu ba thứ (POSIX.1-2017 XCU §2.9.1 Simple Commands): nháy đơn/kép · vùng thay thế
// `$(…)` `${…}` `` `…` `` là MỘT phần của từ dù bên trong có khoảng trắng, nháy hay ngoặc
// (cân ngoặc, lồng được) · `;` `&` `|` ngoài nháy/vùng kết thúc lệnh đơn, trừ `>&`/`<&` là
// chuyển hướng. Không phải một bộ phân tích shell đầy đủ: heredoc, từ khoá điều khiển và
// `$((…))` số học không được hiểu riêng — chúng rơi về luật `tenChuongTrinh` bên dưới.
const laVung = (s, i) => s[i] === '`' || (s[i] === '$' && (s[i + 1] === '(' || s[i + 1] === '{'));
// Chỉ số ngay sau vùng thay thế mở tại `i`; vùng không đóng thì chạy tới hết chuỗi.
function hetVung(s, i) {
  if (s[i] === '`') {
    let j = i + 1;
    while (j < s.length && s[j] !== '`') j += s[j] === '\\' ? 2 : 1;
    return Math.min(j + 1, s.length);
  }
  const mo = s[i + 1]; const dong = mo === '(' ? ')' : '}';
  let sau = 0; let q = null;
  for (let j = i + 1; j < s.length; j += 1) {
    const ch = s[j];
    if (q) { if (ch === '\\' && q === '"') j += 1; else if (ch === q) q = null; continue; }
    if (ch === '\\') { j += 1; continue; }
    if (ch === "'" || ch === '"') { q = ch; continue; }
    if (j > i + 1 && laVung(s, j)) { j = hetVung(s, j) - 1; continue; }
    if (ch === mo) sau += 1;
    else if (ch === dong && (sau -= 1) === 0) return j + 1;
  }
  return s.length;
}
// Một từ = { text: chữ sau khi bỏ nháy (vùng thay thế giữ nguyên văn), con: [thân các lệnh con] }.
function cacLenhDon(cmd) {
  const s = String(cmd); const lenh = []; let tu = []; let w = null;
  const dongTu = () => { if (w) tu.push(w); w = null; };
  const dongLenh = () => { dongTu(); if (tu.length) lenh.push(tu); tu = []; };
  const vung = (i) => {
    const e = hetVung(s, i); w.text += s.slice(i, e);
    if (s[i] === '`') w.con.push(s.slice(i + 1, e - 1));
    else if (s[i + 1] === '(') w.con.push(s.slice(i + 2, e - 1));
    return e;
  };
  for (let i = 0; i < s.length;) {
    const ch = s[i];
    if (/\s/.test(ch)) { dongTu(); i += 1; continue; }
    if (';&|'.includes(ch) && !(ch === '&' && w && /[<>]$/.test(w.text))) { dongLenh(); i += 1; continue; }
    w = w || { text: '', con: [] };
    if (ch === "'") { const j = s.indexOf("'", i + 1); const e = j < 0 ? s.length : j; w.text += s.slice(i + 1, e); i = e + 1; continue; }
    if (ch === '"') {
      let j = i + 1;
      while (j < s.length && s[j] !== '"') {
        if (s[j] === '\\') { w.text += s[j + 1] || ''; j += 2; } else if (laVung(s, j)) j = vung(j); else { w.text += s[j]; j += 1; }
      }
      i = j + 1; continue;
    }
    if (ch === '\\') { w.text += s[i + 1] || ''; i += 2; continue; }
    if (laVung(s, i)) { i = vung(i); continue; }
    w.text += ch; i += 1;
  }
  dongLenh();
  return lenh;
}
const LA_GAN = /^[A-Za-z_][A-Za-z0-9_]*=/;
// Từ đầu = từ đầu tiên không phải phép gán của lệnh đơn đầu tiên có tên lệnh. Lệnh đơn
// CHỈ-GÁN thì chương trình chạy thật là lệnh con trong phép gán (`B=$(git merge-base …)` →
// `git`, không phải `merge-base`); chỉ-gán không lệnh con (`A=1 && x`) → xét lệnh đơn kế.
function tuDau(cmd, sau = 0) {
  for (const tu of cacLenhDon(cmd)) {
    const ten = tu.find(w => !LA_GAN.test(w.text));
    if (ten) return ten.text;
    const con = tu.flatMap(w => w.con)[0];
    const t = con !== undefined && sau < 8 ? tuDau(con, sau + 1) : null;
    if (t) return t;
  }
  return null;
}
```

- [ ] **Step 2:** `node tests/scripts/duong-nen.test.mjs` — Expected: `Results: N passed, 0 failed`, có PASS NEN-LC1..3 và NEN0, NEN1, NEN-TD1..6.
- [ ] **Step 3:** thử tay Review Focus: `echo x 2>&1` → `echo`; `B=$(git` → không ném.
- [ ] **Step 4:** chạy lệnh eval `bash -c "$(node -e '…resolveConfigKey…ncl_lenh_con')"` — exit 0.
- [ ] **Step 5:** commit `fix(duong-nen): chân công cụ tra chương trình trong lệnh con của phép chỉ-gán`.

### Task 3: Đo lại trên dữ liệu thật

**Files:** Modify `_acceptance/nen-cong-cu-gan-bang-lenh-con/contract.md` (Notes) · phục vụ gap-probe F2 · `independent: true`

- [ ] **Step 1:** chạy lại phép quét 5 113 khoá (scratchpad `quet-kho.mjs`) trên bản đã vá; `diff` với bản trước.
- [ ] **Step 2:** Expected: cột TRA/BOQUA 0 dòng đổi; tên tra đổi đúng 1 dòng (`zqw_giu_nqz`: `merge-base` → `git`). Ghi số + lệnh tái lập vào Notes; commit.
