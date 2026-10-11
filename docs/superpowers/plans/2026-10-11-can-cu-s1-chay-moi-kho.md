# can-cu-s1-chay-moi-kho — kế hoạch làm

> **For agentic workers:** thực thi TUẦN TỰ trong phiên chính (hạng T2, các việc cùng sửa một tệp ca —
> không có việc độc lập). Steps dùng checkbox (`- [ ]`).

**Goal:** lời dặn bước thiết kế gọi được bộ xếp căn cứ ở mọi kho tiêu thụ, lỗi không chạy được không bị
đọc thành sổ đỏ, và thẻ Cổng Phạm vi in đủ ba vế cho mọi lựa chọn bước thiết kế.

**Architecture:** hai lời gọi trong SKILL đổi sang mẫu bộ giải gói có sẵn (`S0-MO-O`); vế dừng S1 mục 5 đọc
dòng tổng kết thay mã thoát; hai khối căn cứ của thẻ dùng lại hàm ba vế `decBaVe` (khối `DEC-BA-VE`).
Răng: ca `KK-<n>` (= AC-n) trong `tests/scripts/can-cu-s1.ca.mjs`.

**Tech Stack:** Node ≥ 20 (ESM test, CJS script), bash + zsh, git.

**Spec:** `docs/superpowers/specs/2026-10-11-can-cu-s1-chay-moi-kho-design.md` · hợp đồng
`_acceptance/can-cu-s1-chay-moi-kho/contract.md` · bộ đo `evals.yaml` cùng thư mục.

## Global Constraints

- KHÔNG đụng: `lib/`, `hooks/`, `dieu-phoi/`, `tests/dieu-phoi/`, khối TRONG-DOT, `feature-loop/scripts/`,
  `feature-loop/workflows/`, `scripts/can-cu-s1.cjs`, `scripts/cat-luot.mjs`, `skills/cat-luot/`, `_acceptance/config.yaml`.
- Mã thoát của bộ xếp không đổi (A2 ghim).
- Câu «KHÔNG phải một cổng — nó đi cùng câu trả lời» ở S1 mục 5 giữ nguyên (ca P85b).
- Mọi khối marker có sẵn của SKILL giữ từng byte (ca CC-02 của A2); vòng này KHÔNG thêm khối marker.
- Đường dẫn trong ca suy từ vị trí tệp ca (`ROOT = path.join(HERE, '..', '..')`), kho thử do code sinh.
- Ca đỏ: chạy CHÍNH hàm đo trên bản sao bị tiêm SAU khi bản lành xanh, ghim thông điệp.
- S3 chỉ bắt đầu SAU KHI A2 lên main và nhánh đã cập nhật từ `origin/main` (Task 0).

## Review Focus

1. Bộ nhớ đệm plugin giả bằng symlink ở cấp thư mục bản: `readdirSync(...).isDirectory()` của bộ giải trả
   false cho symlink → thư mục bản phải là thư mục thật, chỉ `scripts/` bên trong là symlink (Task 1 KK-1).
2. zsh vắng trên máy chạy → KK-1 zsh FAIL có tên, không bỏ qua (Task 1).
3. Chữ trong thẻ đi qua `stripMd` + `esc` → ca so trên sổ thật phải so chữ đã chuẩn hoá cùng cách (Task 2 KK-6 so-that).
4. Cây làm việc bẩn ở `scripts/` làm đối chứng dương lưu trữ HEAD của KK-8 lệch — lượt chấm chạy trên cây sạch (Task 3).
5. Thời gian: thẻ ≈ 0,6 s một lượt; KK-8 chạy song song tối đa 8 tiến trình, in số hồ sơ và giây (Task 3).

---

### Task 0: cập nhật nhánh sau khi A2 lên main

- [ ] Kiểm: `gh pr list --repo phanlemanh/acceptance-gate-kit --state merged --search buoc-len-thiet-ke-khong-hoi` có PR.
- [ ] `git fetch origin && git merge origin/main` (xung đột → giải, ưu tiên main cho tệp không thuộc vòng).
- [ ] `node tests/scripts/can-cu-s1.ca.mjs` xanh (CC-02 giờ neo lịch sử A2).

### Task 1: lệnh gọi bộ xếp chạy ở kho khách (AC-1, AC-2, AC-3 phần SKILL, AC-4) — phục vụ E1, E2, E3, E4

**Files:** Modify `tests/scripts/can-cu-s1.ca.mjs` (khối KK mới trước dòng `console.log(\`\nResults`),
`feature-loop/skills/feature-loop/SKILL.md` (đoạn «Lật ở Cổng Phạm vi» + S1 mục 5). `independent: false`.

**Interfaces:** Produces `lenhBoXep(text) → string[]`, `khoKhach({themDo}) → dir`, `nhaGia({coBoXep}) → HOME`,
`kiemLenhKhoKhach(skillText, vo) → string[]`, `quetTuongDoi(text, ten) → string[]`.

- [ ] **Step 1: viết ca (đỏ trước)**

```js
// ── KK: vòng can-cu-s1-chay-moi-kho (KK-n = AC-n) ─────────────────────────────────────────────────────
const FL_WF = path.join(ROOT, 'feature-loop', 'workflows');
const lenhBoXep = t => [...t.matchAll(/`([^`]*\bnode\b[^`]*can-cu-s1\.cjs[^`]*)`/g)].map(m => m[1]);
function nhaGia({ coBoXep = true } = {}) {   // HOME tạm: .claude/plugins/cache/acceptance-gate-kit/acceptance-gate/9.9.9
  const h = mkdtempSync(path.join(tmpdir(), 'kk-nha-'));
  const ban = path.join(h, '.claude', 'plugins', 'cache', 'acceptance-gate-kit', 'acceptance-gate', '9.9.9');
  mkdirSync(ban, { recursive: true });               // thư mục bản THẬT (bộ giải bỏ qua symlink ở cấp này)
  if (coBoXep) symlinkSync(path.join(ROOT, 'scripts'), path.join(ban, 'scripts'));
  else mkdirSync(path.join(ban, 'scripts'));         // gói cũ: không mang bộ xếp
  return h;
}
function khoKhach({ themDo = false } = {}) {
  const r = mkdtempSync(path.join(tmpdir(), 'kk-kho-')); git(r, 'init', '-q');
  ghiTep(r, 'CLAUDE.md', `# Luật\n\n${Q_GOC}\n`);
  ghiTep(r, '_acceptance/h/contract.md', '---\nslug: h\nstatus: draft\n---\n');
  const dongs = [CN('q1'), S1('m1', MT('CLAUDE.md', Q_GOC)), ML('m2')];
  if (themDo) dongs.push(S1('r1', { nguon: 'la', kho_dao: false }));
  ghiSoKho(r, 'h', dongs); return r;
}
const TONG_SACH = 'h · câu hỏi 1 · máy đã quyết 2 · đỏ 0 · đời trước 0 · bị thay 0';
const chayLenh = (l, kho, nha, vo = 'bash') => spawnSync(vo, ['-c', l.split('$WORKFLOWS_DIR').join(FL_WF).split('<slug>').join('h')], { cwd: kho, env: { ...process.env, HOME: nha }, encoding: 'utf8' });
function kiemLenhKhoKhach(skillText, vo) {
  const ds = lenhBoXep(skillText); if (ds.length !== 2) return [`lệnh gọi bộ xếp rút được ${ds.length}, cần 2`];
  const kho = khoKhach(), nha = nhaGia(); if (existsSync(path.join(kho, 'scripts'))) return ['kho thử có scripts/'];
  const loi = [];
  for (const l of ds) { const p = chayLenh(l, kho, nha, vo); if (p.status !== 0 || !p.stdout.split('\n').some(x => x.startsWith(TONG_SACH))) loi.push(`không chạy được ngoài kho kit (${vo}, thoát ${p.status}): «${l.slice(0, 80)}» → ${(p.stdout + p.stderr).trim().slice(0, 240)}`); }
  return loi;
}
for (const vo of ['bash', 'zsh']) check(`KK-1 ${vo}`, () => {
  if (spawnSync(vo, ['-c', 'true']).status !== 0) die(vo + ' vắng trên máy chạy');
  eq(kiemLenhKhoKhach(readFileSync(SKILL, 'utf8'), vo), [], 'lệnh rút từ SKILL chạy ở kho khách');
});
check('KK-1-do', () => {
  const t = readFileSync(SKILL, 'utf8'); eq(kiemLenhKhoKhach(t, 'bash'), [], 'đối chứng dương');
  const tiem = t.replace('AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/can-cu-s1.cjs) && node "$AG/scripts/can-cu-s1.cjs"', 'node scripts/can-cu-s1.cjs');
  if (tiem === t) die('mũi tiêm không áp');
  const loi = kiemLenhKhoKhach(tiem, 'bash');
  if (!loi.some(x => x.startsWith('không chạy được ngoài kho kit'))) die('lệnh tương đối mà hàm kiểm không nêu: ' + JSON.stringify(loi));
});
check('KK-2 so-do', () => {
  const l = lenhBoXep(readFileSync(SKILL, 'utf8')).find(x => x.includes('--slug')); if (!l) die('không rút được lệnh kiểm sổ');
  const sach = chayLenh(l, khoKhach(), nhaGia()); if (sach.status !== 0 || !sach.stdout.includes(TONG_SACH)) die('đối chứng dương: ' + sach.stdout + sach.stderr);
  const p = chayLenh(l, khoKhach({ themDo: true }), nhaGia());
  if (p.status !== 1 || !/^h · câu hỏi 1 · máy đã quyết 2 · đỏ 1 · /m.test(p.stdout)) die(`sổ đỏ phải thoát 1 KÈM dòng tổng kết: ${p.status} ${p.stdout}`);
});
check('KK-2 chua-cai', () => {
  const l = lenhBoXep(readFileSync(SKILL, 'utf8')).find(x => x.includes('--slug'));
  const p = chayLenh(l, khoKhach(), nhaGia({ coBoXep: false }));
  if (p.status === 0 || /^h · câu hỏi/m.test(p.stdout)) die('gói cũ mà vẫn có dòng tổng kết hoặc thoát 0: ' + p.stdout);
  if (!p.stderr.includes('acceptance-gate') || !p.stderr.includes('claude plugin install')) die('thông điệp không nêu gói + lệnh cài: ' + p.stderr);
});
const quetTuongDoi = (text, ten) => text.split('\n').flatMap((l, i) => [...l.matchAll(/\b(?:node|bash|sh)\s+["']?(?:\.\/)?((?:[\w-]+\/)?scripts\/[\w.-]+)/g)]
  .filter(m => existsSync(path.join(ROOT, m[1])) || existsSync(path.join(ROOT, 'feature-loop', m[1]))).map(() => `${ten}:${i + 1}`));
check('KK-4 quet-lop', () => { eq(quetTuongDoi(readFileSync(SKILL, 'utf8'), 'SKILL.md'), [], 'SKILL feature-loop'); });
const HINH_KK4 = ['node scripts/can-cu-s1.cjs --root .', 'node ./scripts/can-cu-s1.cjs --root .', 'node feature-loop/scripts/resolve-plugin.mjs --plugin x', 'bash scripts/pre-merge-check.sh .'];
check('KK-4-do', () => {
  const dong = readFileSync(SKILL, 'utf8').split('\n'); const K = 40;
  eq(quetTuongDoi(dong.join('\n'), 'SKILL.md'), [], 'đối chứng dương: bản sao chưa tiêm');
  let n = 0; for (const h of HINH_KK4) { const s = [...dong]; s.splice(K, 0, `Chạy \`${h}\`.`); eq(quetTuongDoi(s.join('\n'), 'SKILL.md'), [`SKILL.md:${K + 1}`], `hình «${h}»`); n++; }
  console.log(`    KK-4-do: ${n}/${HINH_KK4.length} hình đỏ đúng dòng`); if (n !== 4) die('số hình đỏ ' + n);
});
```
(thêm `existsSync, symlinkSync` vào import `node:fs`.)

- [ ] **Step 2:** `node tests/scripts/can-cu-s1.ca.mjs` → KK-1 bash/zsh, KK-2 so-do, KK-2 chua-cai, KK-4 quet-lop **FAIL**
  (SKILL còn lệnh tương đối; `lenhBoXep` rút 2 lệnh nhưng không chạy). KK-4-do có thể xanh ngay (đối chứng
  dương của nó đỏ trên SKILL cũ — ghi nhận).
- [ ] **Step 3: sửa SKILL** — đoạn «Lật ở Cổng Phạm vi»: `node scripts/can-cu-s1.cjs --root . --dem` →
  `AG=$(node "$WORKFLOWS_DIR/../scripts/resolve-plugin.mjs" --plugin acceptance-gate --require scripts/can-cu-s1.cjs) && node "$AG/scripts/can-cu-s1.cjs" --root . --dem`.
  S1 mục 5, thay ngoặc «Sổ S1 còn câu chỉ-người-biết hoặc dòng đỏ (… hoặc thoát 1) → Cổng Phạm vi dừng chờ
  người, không đi làn V.» bằng: «Sổ S1 còn câu chỉ-người-biết hoặc dòng đỏ — lệnh `AG=$(…) && node
  "$AG/scripts/can-cu-s1.cjs" --root . --slug <slug>` (kho tự host kit thêm `--root .` ngay sau `--plugin
  acceptance-gate`) in dòng tổng kết `<slug> · câu hỏi N · máy đã quyết M · đỏ K · …` với N > 0 hoặc K > 0 →
  Cổng Phạm vi dừng chờ người, không đi làn V. Đọc dòng tổng kết, KHÔNG đọc mã thoát: lệnh không in dòng tổng
  kết là bộ xếp không chạy được (thiếu gói, gói cũ, lỗi nạp) — trình nguyên văn thông điệp như một DỪNG-lỗi có
  tên, không gọi là sổ đỏ.» Giữ nguyên mọi chữ khác của mục 5.
- [ ] **Step 4:** chạy lại tệp ca → mọi ca KK của Task 1 + CC-02..CC-10 xanh.
- [ ] **Step 5:** commit `fix(feature-loop): bộ xếp căn cứ gọi qua bộ giải gói, đọc dòng tổng kết (KK-1/2/4)`.

### Task 2: thẻ Cổng Phạm vi in ba vế cho hai khối căn cứ (AC-5, AC-6, AC-7, AC-9) — phục vụ E5, E6, E7, E9

**Files:** Modify `scripts/gate-card.js` (dòng dựng khối «Câu chỉ anh trả lời được», khối «Máy đã quyết…»,
khoá `can_cu` của bản rút), `tests/scripts/can-cu-s1.ca.mjs` (KK-5..7 + chế độ `--dung-the-ba-ve`). `independent: false`.

**Interfaces:** Produces `mkHoSoBaVe() → {r, base}`, `W(id) → {why, cost_if_wrong}`, `kiemHoi(html) → string[]`,
`kiemMayQuyet(html) → string[]`, `kiemBanRut(json) → string[]`, `banSaoThe(tu, sang) → path` (bản sao scripts+lib, tiêm một chuỗi).

- [ ] **Step 1: ca (đỏ trước)** — hồ sơ nháp `h` trên `mkKho()` + `HD_DRAFT`/`EVALS`/config như `mkHoSoThe`, sổ:
  `q1` CN · `q2` chi-người khó-đảo · `m1` mục-tiêu approach (`CLAUDE.md`, `Q_GOC`) · `m2` một-lối approach ·
  `m3` mục-tiêu descope (`docs/luat.md`, `Q_LUAT`) · `m4` một-lối descope · `m5` một-lối KHÔNG `cost_if_wrong`;
  mọi dòng (trừ giá của m5) mang `W(id) = { why: 'Vì sao riêng của <id>.', cost_if_wrong: 'Giá riêng của <id>.' }`.
  `kiemHoi`: với `Hỏi-1`↔q1, `Hỏi-2`↔q2, `<p>` của câu chứa `W(id).why` và `sai thì tốn: W(id).cost_if_wrong`,
  KHÔNG chứa `why` của câu kia, còn «máy khuyên» + «lối khác»; «khó-đảo» chỉ ở Hỏi-2 → lỗi dạng
  `"<Hỏi-n>: thiếu vì sao"`. `kiemMayQuyet`: với m1..m4, `<p>` chứa why + «sai thì tốn: <giá>», vị trí
  «sai thì tốn:» < vị trí «căn cứ: «» / «lối khác chết vì:»; m3, m4 có «KHÔNG làm:» → lỗi `"<mã>: thiếu …"`.
  KK-7 thieu-gia: `<p>` m5 có «⚠ chưa khai giá nếu sai», m1..m4 không. KK-7 ban-rut: `--extract` →
  mỗi mục `can_cu.cau_hoi[]`/`da_quyet[]` có `why`, `cost_if_wrong` == giá trị viết sẵn (m5 → null).
  KK-6 so-that: `node GC --root ROOT --slug can-cu-s1-chay-moi-kho --gate 1`; danh sách mong đợi =
  `cau_hoi ∪ da_quyet` của `require(MOD).phanLoaiSo(sổ thật, {root: ROOT, slug})`; số `<p>` mang
  `data-cau-hoi`/`data-may-quyet` == độ dài danh sách; `<p>` của mỗi mã chứa `chuan(why)` và `chuan(cost)` với
  `chuan = s => s.replace(/[`*]/g, '')` so trên chữ `<p>` đã bỏ thẻ + giải `&amp;&lt;&gt;&quot;&#39;`.
  Ca đỏ (`banSaoThe`): KK-5-do trả dòng câu hỏi về `${esc(stripMd(d.e.decision || ''))}` → `kiemHoi` nêu «Hỏi-1» và
  «vì sao»; KK-6-do trả dòng máy quyết về cách in A2 → `kiemMayQuyet` nêu mã dòng; KK-7-do bỏ `why:` khỏi bản rút → `kiemBanRut` nêu «why».
- [ ] **Step 2:** chạy → KK-5/6/7 FAIL (thẻ chưa in vế).
- [ ] **Step 3: sửa thẻ** — khối câu hỏi: `<b>${esc(d.nhan)}</b> · ${decBaVe(d.e)}${khó-đảo} — máy khuyên: … · lối khác: …`;
  khối máy quyết: `${KHÔNG làm}${decBaVe(d.e)} — ${cu}`; bản rút thêm
  `why: typeof d.e.why === 'string' ? d.e.why : null, cost_if_wrong: typeof d.e.cost_if_wrong === 'string' ? d.e.cost_if_wrong : null`
  cho cả hai mảng. Thêm chế độ `--dung-the-ba-ve <thư mục>` (như `--dung-the`, dựng từ `mkHoSoBaVe`).
- [ ] **Step 4:** tệp ca xanh (KK-5..7 + mọi CC); `bash tests/scripts/run-tests.sh --manh bash` xanh.
- [ ] **Step 5:** commit `fix(gate-card): hai khối căn cứ in ba vế (KK-5/6/7)`.

### Task 3: hồ sơ cũ không đổi màu (AC-8) — phục vụ E8

**Files:** Modify `tests/scripts/can-cu-s1.ca.mjs` (KK-8). `independent: false`.

**Interfaces:** Produces `tamVongKK() → {goc, dinh|null, nguon}`, `banLuu(sha) → dir`, `soThe(gcA, gcB, slugs) → Promise<string[]>` (hồ sơ lệch).

- [ ] **Step 1:** ca — `tamVongKK`: commit gộp `…/vong/can-cu-s1-chay-moi-kho` → `{goc: merge-base(m^1,m^2), dinh: m^2}`;
  chưa gộp → `{goc: merge-base(HEAD, origin/main|main), dinh: null}` (đỉnh = cây làm việc). `banLuu(sha)` =
  `git archive <sha> scripts lib skills | tar -x -C <tạm>`. Tập hồ sơ: thư mục `_acceptance/*` có `contract.md`
  + `decisions.jsonl` không chứa `"can_cu"`. `soThe` chạy `node <gc> --root ROOT --slug s --gate 1` và thêm
  `--extract`, song song tối đa 8 (`spawn` + hàng đợi), trả slug lệch. Top-level `await` tính trước, `check`
  đọc kết quả. KK-8 ho-so-cu: đối chứng dương `soThe(banLuu(HEAD), GC, 5 hồ sơ đầu)` == [] · số hồ sơ ≥ 20 ·
  `soThe(gốc, đỉnh, tất cả)` == []; in «KK-8: N hồ sơ · T s». KK-8-do: `banSaoThe('sai thì tốn: ', 'sai thi ton: ')`
  ở `decBaVe` → `soThe(gốc, bản sao, 10 hồ sơ đầu)` không rỗng.
- [ ] **Step 2:** chạy → KK-8 xanh (chiều im), KK-8-do xanh (đỏ đúng); ghi thời gian, > 30 s → lấy mẫu tất định mỗi hồ sơ thứ k sao cho ≥ 30.
- [ ] **Step 3:** commit `test(can-cu-s1): KK-8 hồ sơ cũ không đổi màu`.

### Task 4: tài liệu + nhãn suite (AC-3 phần GUIDE)

**Files:** Modify `GUIDE.md` (đoạn thẻ Cổng Phạm vi: hai khối in «quyết gì — vì sao — sai thì tốn gì» rồi
căn cứ; «Kiểm tay» đổi sang `node <gốc gói acceptance-gate>/scripts/can-cu-s1.cjs …`, kho kit dùng
`scripts/` của cây), `tests/scripts/run-tests.sh` (nhãn `can-cu-s1.ca.mjs (CC-02..CC-10, KK-1..KK-8)`). `independent: false`.

- [ ] Sửa, rồi chạy `bash ~/.claude/projects/-Users-manhphan-dev-crm/khoa-may/chay-nang.sh "A2sua bo-kiem" bash tests/scripts/run-tests.sh --manh bash` → xanh.
- [ ] Commit `docs(guide): thẻ Cổng Phạm vi in ba vế cho lựa chọn bước thiết kế`.
- [ ] `status: implemented` → S4.
