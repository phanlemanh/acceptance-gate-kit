# Máy tự định tuyến mục Ngoài-n — Kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`).

**Goal:** Kho bật `feature_loop.ngoai_n_tu_dinh_tuyen: true` thì mục Ngoài-n mà S4 đề xuất `known-limits`/`wont-fix`
được máy ghi dòng sổ `gate2` (khoá `may`) để làn V chạy được; thẻ Cổng 2 hiện chúng là dòng báo kèm lệnh đảo.

**Architecture:** Một script mới `scripts/dinh-tuyen-may.cjs` (bên ghi + bộ đọc dòng máy `docDinhTuyen`, CJS để
`gate-card.js` require được). Bên đọc làn V trong `lib/` KHÔNG đổi. `gate-card.js` dùng `docDinhTuyen` để chuyển
nhãn sang `routing.bao`. SKILL feature-loop gọi bên ghi trước `khong-can-nguoi.mjs --write`.

**Tech Stack:** Node ≥ 20, không phụ thuộc mới; test kiểu `tests/scripts/*.test.mjs` (in `PASS:`/`FAIL:`, sàn đếm).

**Spec:** `docs/superpowers/specs/2026-10-11-ngoai-n-tu-dinh-tuyen-design.md` · hợp đồng
`_acceptance/ngoai-n-tu-dinh-tuyen/contract.md` · evals cùng thư mục.

## Global Constraints

- KHÔNG sửa `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`,
  `feature-loop/workflows/acceptance-verify.js` (t3_paths / đường verdict). Cần chạm = dừng, nâng T3.
- Khoá vắng = hành vi hôm nay, 0 byte.
- Dòng máy KHÔNG có `decided_by`; dấu máy là `"may":"dinh-tuyen-ngoai-n"`.
- Mọi đường dẫn trong test suy từ vị trí tệp test; fixture do code sinh, khuôn rút từ marker bên viết thật.
- Mỗi phép đo mới có cặp hai chiều trên CÙNG fixture + thông điệp ghim (MEASURE-BIRTH-CLAUSE).
- Ca «không đổi» neo sha cố định `d9d1f3a6`, KHÔNG merge-base sống.

## Review Focus

1. Hồ sơ ≥ 10 mục: `Ngoài-1` không được lẫn `Ngoài-10..19` (NT3 muoi-mot-muc, NT7 muoi-mot-muc).
2. Đề xuất có đuôi chú thích («known-limits — vì …») vẫn nhận (NT2 hàng 3).
3. Hợp đồng không có `## Notes` (NT2 notes-vang); hợp đồng có `## Notes` không ở cuối — gạch phải vào ĐÚNG mục Notes,
   không vào cuối tệp (NT2 notes: gạch nằm giữa `## Notes` và heading kế).
4. Sổ có dòng hỏng (JSON lỗi) — bên ghi bỏ qua dòng hỏng khi đọc, `<n>` của id vẫn đếm mọi dòng (NT2 id dùng
   `grep -c ''` semantics: đếm dòng tệp).
5. `review-findings.md` vắng — bên ghi in «0 mục», 0 byte (NT4 thêm hàng? → đặt vào NT3 như một hàng phụ
   `khong-co-tep`, đối chứng: hồ sơ không có tệp thì không có mục đối chứng — ghim stdout `dinh-tuyen-may: 0 mục`).

---

### Task 1: Bên ghi `scripts/dinh-tuyen-may.cjs` (phục vụ E1–E6) · independent: false

**Files:**
- Create: `scripts/dinh-tuyen-may.cjs`
- Create: `tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs` (ca NT1–NT6)

**Interfaces — Produces:**
- `KHOA = 'feature_loop.ngoai_n_tu_dinh_tuyen'`, `DAU_MAY = 'dinh-tuyen-ngoai-n'`
- `VE = [{ ma, ...}]` — mã vế: `status` · `verdict-pass` · `bypass` · `enforcement` · `tier` · `uncertain` ·
  `triage` · `findings-sai-khuon` · `chua-phan-loai` (⊇ khối `EVIDENCE-XANH-SACH-BLOCK` trừ `sections`)
- `docKhoa(configText) → { bat: boolean }` ném Error có tên khoá khi giá trị ∉ {true,false}
- `veTruot({ contract, evidence, findings }) → null | { ma, ly_do }`
- `soNhan(decisionText) → number[]` — tách nhãn thành số (đơn và khoảng), cùng hình dạng `NHAN_RE` của lib
- `docDinhTuyen(ledgerText) → Map<number, { may: boolean, id, decision, tieu_de, dao, de_xuat }>` — dòng gate2
  MỚI NHẤT gọi tên mỗi nhãn
- `keHoach({ slug, contract, evidence, findings, ledger, config }) → { tat?, truot?, lech?: [...], ghi: [{ n, token, f }] }`
- CLI `--write|--check --root <repo> --slug <slug>`; thoát 0 · 2 (khoá sai / dòng máy lệch) · 3 (dùng sai).

Khuôn dòng (marker `DINH-TUYEN-MAY-LINE`, một chỗ):
`{"id":"d-<UTC>-<n>","type":"revisit","stage":"gate2","at":"<ISO>","decision":"Ngoài-<n>: <chữ người>","why":"…","cost_if_wrong":"…","may":"dinh-tuyen-ngoai-n","tieu_de":"<tiêu đề>","dao":"/acceptance-gate:signoff <slug> Ngoài-<n>: mở hợp đồng mới; Ký"}`

- [ ] Viết NT1–NT6 trước (fixture: kho tạm, hợp đồng từ `CONTRACT-FRONTMATTER-TEMPLATE`, mục từ `OOC-ITEM-TEMPLATE`,
  báo cáo từ `EVIDENCE-SECTIONS-TEMPLATE` + `JUDGMENT-BLOCK-TEMPLATE`), chạy → đỏ vì script chưa có.
- [ ] Viết script; chạy `node tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs` → NT1–NT6 xanh, kể cả các ca `-do`
  (bản sao script bị tiêm trong thư mục tạm, chạy SAU bản lành trên cùng fixture).
- [ ] Commit.

### Task 2: Thẻ Cổng 2 (phục vụ E6 thẻ, E7, E8a) · independent: false (dùng `docDinhTuyen`)

**Files:** Modify `scripts/gate-card.js` (khối câu gộp ~1095, khối Ngoài ~1257, khối Treo ~1298, extract ~1161);
test thêm NT6 the, NT7, NT8 vào cùng tệp test.

- [ ] `const DTM = require('./dinh-tuyen-may.cjs').docDinhTuyen(<sổ>)` — nạp an toàn (try/catch → Map rỗng).
- [ ] Với mỗi mục `fi`: `d = DTM.get(fi+1)`; máy định tuyến khi `d && d.may && d.tieu_de === f.title`; lệch khi
  `d && d.may && d.tieu_de !== f.title` → cờ `dòng máy trỏ mục đã đổi: Ngoài-n`, nhãn ở `hoi`.
- [ ] Máy định tuyến → nhãn vào `routingBao`; HTML mục in «Máy đã định tuyến: <chữ người> — đảo: <code>dao</code>».
- [ ] Treo: dòng `e.may === DAU_MAY` in tiền tố «máy định tuyến» + `đảo: <code>dao</code>`.
- [ ] Extract: `out_of_contract.dinh_tuyen_may: [{ nhan, id, de_xuat, dao }]` (rỗng khi không có).
- [ ] NT7/NT8 xanh; chạy `LMCMS_ONLY=LM20 node tests/scripts/gate-card-lmcms.test.mjs` xanh. Commit.

### Task 3: Nối vào vòng — SKILL + signoff (phục vụ E9a, E9b, E9c) · independent: false

**Files:** Modify `feature-loop/skills/feature-loop/SKILL.md` (khối mới `DINH-TUYEN-MAY`; hàng `verified` của bảng
trạng thái và bước PASS của S4 trỏ tới khối); Modify `commands/signoff.md` (một câu sau đoạn MÁY-ĐI-TRƯỚC);
Create `tests/scripts/ngoai-n-khoi-khac.mjs` (E9c, sha cố định `d9d1f3a6`); test NT9 vào tệp test chung.

- [ ] Khối SKILL: lệnh giải gói qua `resolve-plugin.mjs --require scripts/dinh-tuyen-may.cjs`, chạy `--write`;
  thoát 0 → nói lại dòng in, gộp vào dòng báo làn V, commit sổ + hợp đồng cùng gói evidence; thoát 2 → Gate 2;
  không đổi bảng cổng.
- [ ] Câu signoff: câu gộp có `Ký` hoặc `Ngoài-<n>:` trên hồ sơ máy-đi-trước → đường ký thường bước 3–7; mục mang
  dòng máy định tuyến lại trên cả `machine-cleared` lẫn máy-đi-trước, ghi dòng người MỚI, không sửa dòng máy.
- [ ] NT9 + E9c xanh (cả chiều đỏ). Commit.

### Task 4: Tài liệu + khoá executor (phục vụ E10, mọi E) · independent: false

**Files:** Modify `GUIDE.md` (mục mới có marker `NGOAI-N-TU-DINH-TUYEN` + dòng mục lục); Modify
`_acceptance/config.yaml` (`executors.test.ngoai_n_tu_dinh_tuyen`, `executors.test.ngoai_n_lm20`,
`executors.script.ngoai_n_khoi_khac`); NT10 vào tệp test.

- [ ] Chạy ba lệnh executor đúng như config resolve; mỗi lệnh thoát 0, dòng gộp chứa mọi `PASS: NT…` ghim.
- [ ] Chạy riêng P179 (luật Điều phối) và các suite chạm vùng: `tests/scripts` mảnh có test mới, LM20, P32/P33.
- [ ] Contract `status: implemented`. Commit. Xin lượt S4 từ Điều phối.
