# Nhãn lối ra làn V theo hướng sản phẩm — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thẻ Cổng Bằng chứng của hồ sơ máy-đi-trước in ô `đi tiếp hay kéo lại: đi tiếp` ở dòng BÁO thay ô hỏi `veto hay để yên: ___`; signoff dạy chữ mới và vẫn nhận chữ cũ.

**Architecture:** Một hằng nhãn + một nhánh định tuyến trong khối câu gộp Cổng 2 của `scripts/gate-card.js`; bộ lọc nhãn khỏi `bao` khi hồ sơ đã khép; ma trận dạng-gõ→hành-vi sống ở MỘT khối marker mới trong bản luật ngôn ngữ, thân lệnh signoff trỏ tới nó.

**Tech Stack:** Node (CommonJS script + test `.mjs` không framework), bash suite `tests/plugins/run-tests.sh`.

**Spec:** `docs/superpowers/specs/2026-10-04-nhan-lan-v-theo-huong-design.md` · hợp đồng `_acceptance/nhan-lan-v-theo-huong/contract.md` · `evals.yaml`.

## Global Constraints

- Nhãn đúng nguyên văn: `đi tiếp hay kéo lại`; giá trị điền sẵn `đi tiếp`; dạng kéo lại `kéo lại: <lý do>`.
- Chữ cũ `veto: <lý do>` và `để yên` vẫn được signoff nhận, cùng hành vi.
- Thuật ngữ nội bộ `veto_state`, `da-veto`, commit `Veto:` KHÔNG đổi.
- Mọi commit chạm `scripts/gate-card.js` của vòng mang dấu `(nhan-lan-v-theo-huong)` trong thông điệp (AC-3 rút cặp commit bằng dấu này).
- Thẻ hồ sơ KHÔNG máy-đi-trước giữ nguyên từng byte.

## Review Focus

- Hồ sơ ĐÃ KHÉP (nghỉ trên hồ sơ đã ký · chấm bởi thực tế) đi vế `MAY_DI_TIEP` qua `NGHI` → nhãn mới ở `bao` sẽ rò vì `DA_KHEP` giữ `bao` — Task 2 lọc, NL-AC4 hàng 1–2 ghim.
- Hồ sơ `da-veto` — phải về «ký hay trả», không báo «đi tiếp» — NL-AC4 hàng 3 ghim.
- Dòng «Trả lời mẫu» rỗng ô ở làn V sạch: không được in `«»` trơ trọi — in «— không có ô nào cần anh điền —»; P192 và LM19 vẫn đọc được (không dấu hai chấm).
- Người sửa ô điền sẵn thành `đi tiếp hay kéo lại: kéo lại: X` (hai dấu hai chấm) — ma trận LAN-V có dòng riêng (NL-AC5).
- Hồ sơ thật của kho đang ở làn V chưa khép — routing đổi → LM20 (routing-baseline) có thể đỏ; NL-AC3 in tập ấy, đổi baseline cùng commit nếu khác rỗng.

---

### Task 1: Ca đo đỏ trước (NL-AC1, NL-AC2, NL-AC4, NL-AC5 + đột biến)

**Files:**
- Create: `tests/scripts/nlvh-the.test.mjs`
- Modify: `_acceptance/config.yaml` (khối `executors.script`, cạnh `lmtl_*`)

**Interfaces:**
- Produces: tên ca `NL-AC1-sach`, `NL-AC2-con-muc`, `NL-AC3-im`, `NL-AC4-khep`, `NL-AC5-luat`, `NL-dot-bien-<ten>` với `<ten>` ∈ {nhan-cu, ve-o-hoi, khep-ro, lech-the-thuong, luat-de-yen, luat-go-marker}; biến môi trường chọn ca `NLVH_CASES`.

- [ ] **Step 1: Viết tệp ca.** Khung theo `tests/scripts/lmtl-the.test.mjs`: `ok/bad`, `NLVH_CASES`, «ca không chạy» → thoát 1. Fixture: `bash -c '. tests/plugins/fixtures/viec-cua-anh-scenarios.sh; vca_scenario <tên> <ws>'`; mục ngoài hợp đồng rút khuôn `OOC-ITEM-TEMPLATE` từ `feature-loop/workflows/acceptance-verify.js` (bên viết thật, cùng cách hskt); dòng thực tế rút vế từ `lib/workspace-record.cjs` `THUC_TE_VE` (cùng cách htkd). Mỗi ca là hàm `(gc) => sai[]` để chạy trên cây thật và trên bản sao. Bản sao đột biến: `cpSync` `scripts lib skills feature-loop` vào tmp, thay nguyên văn ĐÚNG MỘT chỗ (đếm khớp = 1, không thì ca đỏ «mui tiem truot»), chạy ca, đòi đỏ với cụm ghim.

Ma trận AC-4 (viết trước, ba hàng):
```js
const MA_TRAN_AC4 = [
  // [tên, dựng(ws), mong]
  ['nghi', ws => { kyBaoCao(ws); ghiSo(ws, DONG_NGHI); }, { hoiRong: true, khep: true }],
  ['thuc-te', ws => { kyBaoCao(ws); doiStatus(ws, 'da-cham-boi-thuc-te'); ghiSo(ws, DONG_TT); }, { hoiRong: true, khep: true }],
  ['da-veto', ws => { doiVeto(ws, 'da-veto'); ghiSo(ws, DONG_VETO); }, { hoiKy: true, khep: false }],
];
```
Tiền đề mỗi hàng: `khep` → HTML chứa «Hồ sơ đã khép»; `hoiKy` → `routing.hoi` chứa `ký hay trả`.

Ma trận AC-5 (viết trước, sáu dạng):
```js
const DANG = [
  ['kéo lại: <lý do>', 'kéo-lại'], ['đi tiếp hay kéo lại: kéo lại: <lý do>', 'kéo-lại'], ['veto: <lý do>', 'kéo-lại'],
  ['đi tiếp hay kéo lại: đi tiếp', 'đi-tiếp'], ['đi tiếp', 'đi-tiếp'], ['để yên', 'đi-tiếp'],
];
```
Khối rút qua `/<!-- <<<GATE-ONESHOT-LAN-V -->\n([\s\S]*?)\n<!-- GATE-ONESHOT-LAN-V>>> -->/`, dòng `^(.+?) → (kéo-lại|đi-tiếp)$`; rút rỗng → «rut rong».

- [ ] **Step 2: Nối executor**
```yaml
    nlvh_the: "bash -c 'NLVH_CASES=NL-AC1-sach,NL-AC2-con-muc,NL-AC4-khep,NL-dot-bien-nhan-cu,NL-dot-bien-ve-o-hoi,NL-dot-bien-khep-ro node tests/scripts/nlvh-the.test.mjs'"
    nlvh_im: "bash -c 'NLVH_CASES=NL-AC3-im,NL-dot-bien-lech-the-thuong node tests/scripts/nlvh-the.test.mjs'"
    nlvh_luat: "bash -c 'set -o pipefail; NLVH_CASES=NL-AC5-luat,NL-dot-bien-luat-de-yen,NL-dot-bien-luat-go-marker node tests/scripts/nlvh-the.test.mjs && ONLY_BLOCK=\"P192 round-trip\" bash tests/plugins/run-tests.sh'"
```
- [ ] **Step 3: Chạy, xác nhận ĐỎ đúng tên** — `NLVH_CASES=NL-AC1-sach,NL-AC2-con-muc,NL-AC4-khep,NL-AC5-luat node tests/scripts/nlvh-the.test.mjs` → FAIL ở cả bốn (nhãn mới vắng / khối LAN-V rút rỗng).

### Task 2: Thẻ — nhãn, định tuyến, bộ lọc khép, chữ VIỆC CỦA ANH, nút

**Files:**
- Modify: `scripts/gate-card.js` (~1028 chú thích, ~1100 nhãn, ~1110 chú thích, ~1119 bộ lọc, ~1356–1366 VIỆC CỦA ANH, ~1371 nút)
- Modify: `tests/scripts/hskt.test.mjs:279-282` (HK-AC4-the: nhãn mới ở `bao`, không ở `hoi`)
- Modify: `tests/plugins/run-tests.sh:9827-9830` (P192 grep chữ mới ở dòng lệnh), `tests/plugins/fixtures/viec-cua-anh-scenarios.sh:92` (chú thích)

- [ ] **Step 1: Nhãn + định tuyến**
```js
const NHAN_LAN_V = 'đi tiếp hay kéo lại';
if (MAY_DI_TIEP) { oneParts.push(`${NHAN_LAN_V}: đi tiếp`); routingBao.push(NHAN_LAN_V); }   // máy đã đi; im lặng = đi tiếp
else { oneParts.push('ký hay trả: ___'); routingHoi.push('ký hay trả'); }   // chữ quyết luôn của người
```
- [ ] **Step 2: Bộ lọc khép** (dòng riêng, sau `if (DA_KHEP) routingHoi.length = 0;`)
```js
if (DA_KHEP && routingBao.includes(NHAN_LAN_V)) routingBao.splice(routingBao.indexOf(NHAN_LAN_V), 1);
```
- [ ] **Step 3: VIỆC CỦA ANH + dòng mẫu + nút** — mục làn V: «<b>Máy đã đi tiếp — không cần trả lời</b> — <viecKe>; muốn dừng: sửa ô cuối của dòng lệnh thành «đi tiếp hay kéo lại: kéo lại: nêu lý do» (hoặc gõ «kéo lại: nêu lý do»).» KHÔNG push vào `ymSlots`. Dòng mẫu: `ymSlots` rỗng → «— không có ô nào cần anh điền —». Nút chân thẻ `Veto` → `Kéo lại`.
- [ ] **Step 4: Sửa ca cũ ghim chữ cũ** (HK-AC4-the, P192, chú thích kịch bản).
- [ ] **Step 5: Chạy** `NLVH_CASES=NL-AC1-sach,NL-AC2-con-muc,NL-AC4-khep,NL-dot-bien-nhan-cu,NL-dot-bien-ve-o-hoi,NL-dot-bien-khep-ro node tests/scripts/nlvh-the.test.mjs` → PASS; `HSKT_CASES=HK-AC4-the node tests/scripts/hskt.test.mjs` (hoặc biến chọn ca của tệp) → PASS.
- [ ] **Step 6: Commit** `fix(the): nhãn lối ra làn V theo hướng sản phẩm — «đi tiếp hay kéo lại» ở dòng báo (nhan-lan-v-theo-huong)`.

### Task 3: Luật — SLOTS, khối LAN-V, GRAMMAR, signoff, CONTEXT

**Files:**
- Modify: `skills/acceptance/references/human-facing-language.md` (GRAMMAR ~187; luật âm ~138 thêm một câu: ô «đi tiếp» của làn V là trạng thái máy đã đi, không ghi gì — không phải lời chấp thuận; SLOTS ~274; khối mới `GATE-ONESHOT-LAN-V` ngay sau SLOTS)
- Modify: `commands/signoff.md:90-99`
- Modify: `CONTEXT.md` (mục «Cửa veto»: một câu chỉ nhãn trên thẻ)

- [ ] **Step 1: Khối LAN-V**
```
<!-- <<<GATE-ONESHOT-LAN-V -->
kéo lại: <lý do> → kéo-lại
đi tiếp hay kéo lại: kéo lại: <lý do> → kéo-lại
veto: <lý do> → kéo-lại
đi tiếp hay kéo lại: đi tiếp → đi-tiếp
đi tiếp → đi-tiếp
để yên → đi-tiếp
kéo-lại = ghi `veto_state: da-veto` vào contract + một dòng sổ `type: veto` mang lý do nguyên văn + commit `Veto: <slug> — <tên>`; máy dừng ngay
đi-tiếp = không ghi gì; in «cửa veto vẫn mở»
<!-- GATE-ONESHOT-LAN-V>>> -->
```
- [ ] **Step 2: SLOTS** `g2 veto hay để yên` → `g2 đi tiếp hay kéo lại`; GRAMMAR đoạn máy-đi-trước viết lại trỏ khối LAN-V.
- [ ] **Step 3: signoff.md** đoạn máy-đi-trước: lời mời in `đi tiếp hay kéo lại: đi tiếp`; đọc câu gộp theo khối `GATE-ONESHOT-LAN-V`; kéo-lại → nguyên các bước veto cũ; đi-tiếp → không ghi gì.
- [ ] **Step 4: Chạy** `NLVH_CASES=NL-AC5-luat,NL-dot-bien-luat-de-yen,NL-dot-bien-luat-go-marker node tests/scripts/nlvh-the.test.mjs` và `ONLY_BLOCK="P19" bash tests/plugins/run-tests.sh` → PASS.
- [ ] **Step 5: Commit** `docs(luat): signoff đọc «đi tiếp / kéo lại», vẫn nhận «veto / để yên» (nhan-lan-v-theo-huong)`.

### Task 4: Chiều im trên hồ sơ thật + lưới toàn bộ

**Files:**
- Modify (nếu cần): `tests/scripts/fixtures/routing-baseline.txt`, `PRODUCT-MAP.md` (sinh lại bằng `node scripts/product-map.mjs --root . --write` hoặc lệnh kho khai)

- [ ] **Step 1:** `NLVH_CASES=NL-AC3-im,NL-dot-bien-lech-the-thuong node tests/scripts/nlvh-the.test.mjs` → PASS, đọc tập vế hai in ra.
- [ ] **Step 2:** Tập vế hai khác rỗng → `node tests/scripts/gate-card-lmcms.test.mjs` LM20 sẽ đỏ đúng các hồ sơ ấy; đổi đúng các dòng đó trong routing-baseline (dòng còn lại không đụng).
- [ ] **Step 3:** Chạy đủ `feature_loop.suite_keys` (bốn mảnh scripts + hooks + plugins ×3 + workflows + product_map). Đỏ → so với `duong-nen.md`: đỏ có ở nền thì không phải của vòng.
- [ ] **Step 4: Commit** phần còn lại (baseline/bản đồ) — không chạm `scripts/gate-card.js`.

Task 1–4 `independent: false` (tuần tự: ca đỏ → vật → luật → im). Evals: Task 2 phục vụ E1, E2, E4; Task 3 phục vụ E5; Task 4 phục vụ E3.
