# Vòng mở thẳng bằng Feature Loop cũng bị đo cỡ — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mọi hợp đồng `draft` bị đo cỡ ở lối vào Cổng Phạm vi bằng bộ đọc tiêu chí chung: từ 13 tiêu chí không dòng sổ «giữ cỡ — <lý do>» thì thẻ đỏ + `co_hop_dong.chan: true` (lệnh duyệt và Feature Loop S1#5 đọc khoá ấy), 11–12 thì cờ vàng; khoảng đọc từ khối `CAT-LUOT-CO`; đồng hồ cỡ đếm `n_giu`; năm chỗ dạy «5–15» nói cùng chính sách.

**Architecture:** Mô-đun CJS mới `scripts/co-hop-dong.cjs` là bộ đọc duy nhất (khoảng · số tiêu chí · nhóm · dòng giữ · kết luận). `gate-card.js` (Cổng 1) và `cat-luot.mjs` (đồng hồ) nạp nó; `cat-luot.mjs` xuất lại `docKhoang`/`napKhoang`/`KHOA_CO`/`TEP_SKILL` để bên gọi cũ không đổi. Chữ dạy ở SKILL/khuôn/lệnh duyệt mang hai khối marker mới (`CO-HOP-DONG-CHAN`, `DEC-GIU-CO`) mà ca đo rút ra so với đầu ra thật.

**Tech Stack:** Node (CJS + ESM, không phụ thuộc ngoài), bash cho khối lệnh sổ.

**Spec:** `docs/superpowers/specs/2026-10-12-vong-mo-thang-bang-feature-loop-design.md` · hợp đồng `_acceptance/vong-mo-thang-bang-feature-loop/contract.md` · evals `_acceptance/vong-mo-thang-bang-feature-loop/evals.yaml`.

## Global Constraints

- Không chạm `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` (t3_paths) — vòng giữ hạng T2.
- Không số nào của khoảng nằm trong mã: mọi bên đọc gọi `napKhoang()`; chữ dạy mang câu «mục tiêu 8–10 · cho phép tới 12 · từ 13» và ca đo dựng câu ấy từ khối sống.
- Chuỗi giữ bên ghi: `giữ cỡ — ` (gạch dài); bên đọc nhận gạch dài/ngắn/thường, NFC, khoảng trắng đầu, phải có ≥ 1 chữ lý do.
- Chỉ hợp đồng `status: draft` bị chặn/cờ cỡ (đường đọc-cũ).
- Dòng `let khoang; try { khoang = napKhoang(); } catch (e) { thoat(2, e.message); }` của `cat-luot.mjs` giữ NGUYÊN VĂN (kim của ca LT-142-do).
- Không thêm lời gọi `stripMd` mới trong `gate-card.js` (ma trận đã ghim của P161); văn cờ đi qua `esc`.
- Tên ca = mã AC (`CHD_CASES`); khoá executor `executors.script.chd_ac1…chd_ac8` ghi bằng `config-patch.mjs`, không sửa tay.

## Review Focus

- Hợp đồng có tiêu chí viết theo dạng bộ đọc không nhận (n = 0) → cờ vàng «không đọc được tiêu chí», không im lặng (ca AC-2 «không-đọc-được»).
- Mã tiêu chí lặp → đếm mã khác nhau ở cả thẻ lẫn đồng hồ (ca AC-2 «13-dòng-12-mã»).
- Người gõ gạch thường ở `sửa: giữ cỡ - …` → vẫn được nhận (ca AC-3 «gạch thường»).
- Khối `CAT-LUOT-CO` vắng → thẻ vẫn dựng, không sập (ca AC-1-hong).
- Hồ sơ thật đã ký ≥ 13 tiêu chí của mọi kho → thẻ ép Cổng 1 không đỏ oan (ca AC-4, AC-4-kho-that).

---

### Task 1: Ca đo trước (TDD — commit đỏ)

**Files:**
- Create: `tests/scripts/co-hop-dong.test.mjs` (bản nháp đã soạn ở S1: ma trận AC-2 34 ca, AC-3 12 ca, AC-4 6 trạng thái + kho thật, AC-7 kho 10 hồ sơ với số tay viết trước; chiều đỏ AC-1-do, AC-2-do, AC-3-do, AC-4-do, AC-5-do-khoa, AC-5-do-nghia, AC-6-do-khoi, AC-6-do-lop, AC-7-do, AC-8-do trên bản sao trọn thư mục, kim khớp một lần)
- Modify: `_acceptance/config.yaml` (khoá `executors.script.chd_ac1…chd_ac8` qua `config-patch.mjs`)

**Interfaces:**
- Consumes: `tests/scripts/gate-fixture.mjs` (`mkWs`, `EVALS`, `PROBE`).
- Produces: biến `CHD_CASES`; dòng ra `PASS: <ca> — …` / `FAIL: <ca> — …`; dòng cuối `Results: <p> passed, <f> failed (co-hop-dong, <n> ca)`.

- [ ] **Step 1:** Chép tệp ca từ nháp vào `tests/scripts/co-hop-dong.test.mjs`.
- [ ] **Step 2:** Ghi tám khoá executor:

```bash
for i in 1 2 3 4 5 6 7 8; do
  case $i in 1) v='CHD_CASES=AC-1,AC-1-do,AC-1-hong';; 2) v='CHD_CASES=AC-2,AC-2-vong,AC-2-do';; 3) v='CHD_CASES=AC-3,AC-3-do';;
    4) v='CHD_CASES=AC-4,AC-4-kho-that,AC-4-do';; 5) v='CHD_CASES=AC-5,AC-5-do-khoa,AC-5-do-nghia';; 6) v='CHD_CASES=AC-6,AC-6-do-khoi,AC-6-do-lop';;
    7) v='CHD_CASES=AC-7,AC-7-do';; 8) v='CHD_CASES=AC-8,AC-8-do';; esac
  node scripts/config-patch.mjs --config _acceptance/config.yaml --key executors.script.chd_ac$i --value "$v node tests/scripts/co-hop-dong.test.mjs" --write
done
```

- [ ] **Step 3:** Chạy `node tests/scripts/co-hop-dong.test.mjs` — kỳ vọng ĐỎ (mô-đun `scripts/co-hop-dong.cjs` chưa có, ca ném «Cannot find module»), thoát 1. `CHD_CASES=XYZ node tests/scripts/co-hop-dong.test.mjs` → thoát 2.
- [ ] **Step 4:** Commit `test(vong-mo-thang-bang-feature-loop): ca đo trước — đỏ vì chưa có vật`.

### Task 2: Mô-đun `co-hop-dong.cjs` + đồng hồ `n_giu`

**Files:**
- Create: `scripts/co-hop-dong.cjs` (bản nháp S1: `KHOA_CO`, `TEP_SKILL`, `docKhoang`, `napKhoang` dời nguyên văn; `demTieuChi`, `nhomCo`, `GIU_CO_MO_DAU`, `dongGiu`, `coHopDong`)
- Modify: `scripts/cat-luot.mjs:144-176` (xoá thân `KHOA_CO`/`TEP_SKILL`/`KHOI_CO_RE`/`docKhoang`/`napKhoang`, thay bằng nạp + xuất lại), `scripts/cat-luot.mjs:262-288` (`dongHoCo`: đọc `decisions.jsonl`, `giu` mỗi hồ sơ chốt, `n_giu` mỗi nhóm)

**Interfaces:**
- Produces: `coHopDong({ contract, decisions, status, tepSkill? }) → { n, nhom, khoang, giu: {id, ly_do}|null, chan, vang, loi, draft }`; `dongGiu(text) → {id, ly_do}|null`; `demTieuChi(text) → number`; `nhomCo(n, khoang) → 'duoi-muc-tieu'|'muc-tieu'|'cho-phep'|'phai-tach'`; `GIU_CO_MO_DAU = 'giữ cỡ — '`.

- [ ] **Step 1:** Chép mô-đun từ nháp vào `scripts/co-hop-dong.cjs`.
- [ ] **Step 2:** Ở `cat-luot.mjs`, thay khối «Khoảng cỡ» bằng:

```js
// ── Khoảng cỡ (một nguồn: khối CAT-LUOT-CO của SKILL cắt lượt) ─────────────────
// Bộ đọc sống ở scripts/co-hop-dong.cjs (hồ sơ vong-mo-thang-bang-feature-loop) — thẻ Cổng Phạm vi đọc
// CHÍNH hàm này; xuất lại để bên gọi cũ (ca LT-142…) không đổi.
const CHD = require(path.join(__dirname, 'co-hop-dong.cjs'));
export const { KHOA_CO, TEP_SKILL, docKhoang, napKhoang } = CHD;
```

- [ ] **Step 3:** Trong `dongHoCo`, đọc sổ và gắn `giu`, thêm `n_giu` vào mỗi nhóm:

```js
    chot.push({ slug, tc, luot, giu: !!CHD.dongGiu(doc(path.join(acc, slug, 'decisions.jsonl')) || '') });
...
    return { ten, tu: a, den: b, n_chot: g.length, n_giu: g.filter(x => x.giu).length, ...thongKeLuot(giao, k), it_du_lieu: giao.length < k.it_du_lieu_duoi };
```

- [ ] **Step 4:** `CHD_CASES=AC-7,AC-7-do,AC-1 node tests/scripts/co-hop-dong.test.mjs` — AC-7 xanh; AC-1 còn đỏ ở vế thẻ (Task 3). `node tests/scripts/lo-trinh.test.mjs` xanh (LT-142… không đổi).
- [ ] **Step 5:** Commit `feat(vong-mo-thang-bang-feature-loop): mô-đun cỡ hợp đồng một nguồn + đồng hồ n_giu`.

### Task 3: Thẻ Cổng Phạm vi đo cỡ

**Files:**
- Modify: `scripts/gate-card.js` (khối `if (gate === '1')`: tính `coHD` sau khi có `acs`; cờ đỏ đứng ngay sau cờ blindSpot; cờ vàng vào `flags` với lớp `fwarn co-hd`; `g1Blocked` thêm `coHD.chan`; `--extract` thêm `co_hop_dong: coHD,`)

**Interfaces:**
- Consumes: `coHopDong`, `GIU_CO_MO_DAU` từ Task 2.
- Produces: `--extract` khoá `co_hop_dong` = `{ n, nhom, khoang, giu, chan, vang, loi }`; HTML `<div class="flag fred co-hd">` / `<div class="flag fwarn co-hd">`.

- [ ] **Step 1:** Sau dòng `const blindSpot = …`, thêm:

```js
  // Cỡ hợp đồng (hồ sơ vong-mo-thang-bang-feature-loop): khoảng đọc từ khối CAT-LUOT-CO qua MỘT bộ đọc
  // dùng chung với đồng hồ cỡ; chỉ hợp đồng draft bị chặn — đã qua Cổng Phạm vi thì đường đọc-cũ.
  const CHD = require('./co-hop-dong.cjs');
  const coHD = (() => { const r = CHD.coHopDong({ contract, decisions: read(path.join(dir, 'decisions.jsonl')), status }); delete r.draft; return r; })();
  const coKhoang = k => `khối CAT-LUOT-CO: mục tiêu ${k.muc_tieu[0]}–${k.muc_tieu[1]} · cho phép tới ${k.cho_phep_den} · từ ${k.tach_tu} phải tách`;
  const coDo = coHD.chan ? `CHƯA vào được Cổng Phạm vi: hợp đồng có ${coHD.n} tiêu chí — từ ${coHD.khoang.tach_tu} phải tách (${coKhoang(coHD.khoang)}). Hai lối ra: tách thành nhiều vòng, mỗi vòng một kết quả; hoặc ghi vào decisions.jsonl một dòng có decision mở đầu «${CHD.GIU_CO_MO_DAU}<lý do>» nói vì sao kết quả không tách được mà giữ nghĩa.` : null;
  const coVang = !coHD.vang ? null : coHD.loi ? `Chưa kiểm cỡ hợp đồng — ${/khối CAT-LUOT-CO|SKILL cắt lượt/.test(coHD.loi) ? 'không đọc được khoảng cỡ' : 'không đọc được tiêu chí'}: ${coHD.loi}.`
    : coHD.giu ? `Hợp đồng có ${coHD.n} tiêu chí — giữ theo dòng sổ ${coHD.giu.id || '(không mã)'}: «${coHD.giu.ly_do}» (${coKhoang(coHD.khoang)}).`
    : `Hợp đồng có ${coHD.n} tiêu chí — trên mục tiêu ${coHD.khoang.muc_tieu[0]}–${coHD.khoang.muc_tieu[1]} (cho phép tới ${coHD.khoang.cho_phep_den}, khối CAT-LUOT-CO): chỉ giữ khi kết quả không tách được mà giữ nghĩa — ghi vì sao bằng dòng «${CHD.GIU_CO_MO_DAU}<lý do>».`;
```

- [ ] **Step 2:** `g1Blocked`: `const g1Blocked = !!rangHong || mienDoCoNguoiDung || !!blindSpot || coHD.chan;`
- [ ] **Step 3:** Extract: thêm `co_hop_dong: coHD,` ngay sau `blind_spot: …,` trong `JSON.stringify({ gate: 1, …`.
- [ ] **Step 4:** HTML: ngay sau `if (blindSpot) P.push(…)` thêm `if (coDo) P.push(\`<div class="flag fred co-hd">⚠ ${esc(coDo)}</div>\`);`; trước `if (flags.length) P.push(…)` thêm `if (coVang) flags.push(['fwarn co-hd', esc(coVang)]);`.
- [ ] **Step 5:** `CHD_CASES=AC-1,AC-1-do,AC-1-hong,AC-2,AC-2-vong,AC-2-do,AC-3,AC-3-do,AC-4,AC-4-do,AC-4-kho-that node tests/scripts/co-hop-dong.test.mjs` xanh; `node tests/scripts/gate-card-goal.test.mjs` và `node tests/scripts/gate-card-lmcms.test.mjs` xanh.
- [ ] **Step 6:** Commit `feat(vong-mo-thang-bang-feature-loop): thẻ Cổng Phạm vi đo cỡ hợp đồng`.

### Task 4: Năm chỗ dạy + ba bên đọc khoá

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (S1#3, S1#4 câu khoảng; S1#5 khối `CO-HOP-DONG-CHAN` + `DEC-GIU-CO` — đặt ở S1#5, KHÔNG cạnh `DEC-ID-RECIPE` vì PR #320 chèn khối ở đó)
- Modify: `skills/acceptance/SKILL.md:94`, `skills/acceptance/references/contract-template.md:61`, `GUIDE.md:493`, `commands/approve.md` (bước 1 khối `CO-HOP-DONG-CHAN`; bước 4 nhận `sửa: giữ cỡ — …`)

- [ ] **Step 1:** S1#3: thay «(Core >15 → hợp nhất nhiều ô thành 1 AC, giữ cap 5-15)» bằng «(cỡ theo khoảng của kit — khối `CAT-LUOT-CO` của skill cắt lượt: mục tiêu 8–10 · cho phép tới 12 · từ 13; Core vượt mục tiêu → hợp nhất ô thành một AC hoặc tách thành nhiều vòng, mỗi vòng một kết quả)».
- [ ] **Step 2:** S1#4: thay «5-15 AC Given/When/Then» bằng «AC Given/When/Then theo khoảng cỡ — khối `CAT-LUOT-CO`: mục tiêu 8–10 · cho phép tới 12 · từ 13 phải tách hoặc ghi dòng giữ (khối `DEC-GIU-CO`, S1#5)».
- [ ] **Step 3:** S1#5: thêm sau câu đầu:

```
<!-- <<<CO-HOP-DONG-CHAN -->
`khi: co_hop_dong.chan = true → lan_v: khong · moi_nguoi: khong · loi_ra: tach, giu`
…(văn xuôi: chưa đủ điều kiện vào Gate 1; máy tự gỡ — mặc định tách, giữ chỉ khi không tách được mà giữ nghĩa)
<!-- CO-HOP-DONG-CHAN>>> -->
<!-- <<<DEC-GIU-CO -->
```
"type":"approach","stage":"S1","at":"<ISO>","decision":"giữ cỡ — <vì sao kết quả không tách được mà giữ nghĩa, 1 câu>","why":"<căn cứ trỏ tệp hay mã AC, 1 câu>","cost_if_wrong":"<sai thì tốn gì, 1 câu>"
```
<!-- DEC-GIU-CO>>> -->
```

- [ ] **Step 4:** Ba chỗ còn lại thay «5-15»/«Core >15 … giữ cap 5-15» bằng câu khoảng (có tên khối và «mục tiêu 8–10 · cho phép tới 12 · từ 13»).
- [ ] **Step 5:** `commands/approve.md` bước 1 thêm khối `CO-HOP-DONG-CHAN` với dòng `khi: co_hop_dong.chan = true → ghi_duyet: khong · loi_ra: tach, giu` và lối `sửa: giữ cỡ — <lý do>`; bước 4 nói `sửa: giữ cỡ …` ghi một dòng sổ `approach` (decision = nguyên câu sau `sửa: `).
- [ ] **Step 6:** `node tests/scripts/co-hop-dong.test.mjs` (mặc định) xanh trọn; `CHD_CASES=AC-4-kho-that` xanh.
- [ ] **Step 7:** Commit `docs(vong-mo-thang-bang-feature-loop): năm chỗ dạy nói khoảng của khối; khoá chan ở lệnh duyệt và S1#5`.

### Task 5: Lưới chung không gãy

**Files:** không tệp mới — chỉ chạy.

- [ ] **Step 1:** `bash tests/scripts/run-tests.sh` (nền, `nice -n 10`), `bash tests/plugins/run-tests.sh` (nền), `bash tests/hooks/run-tests.sh` — đọc mọi FAIL; ca đỏ vì vật vòng này (P161 card-text-fidelity, P85 goal, P32 lock, LM20 routing-baseline, P179 sổ giới hạn) sửa theo LỚP.
- [ ] **Step 2:** `node scripts/product-map.mjs --root . --check` xanh; `bash scripts/pre-merge-check.sh . --base $(git merge-base HEAD origin/main)` không VIOLATION mới.
- [ ] **Step 3:** Set contract `status: implemented`, commit, xin lượt S4.

Phụ thuộc: tuần tự 1 → 2 → 3 → 4 → 5 (`independent: false` cả năm task — cùng chạm bộ ca đo và mô-đun).
