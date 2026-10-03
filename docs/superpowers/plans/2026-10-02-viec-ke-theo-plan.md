# Lộ trình vào kit, lát 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (vòng T2 của feature-loop: thực thi TUẦN TỰ trong phiên chính; mọi task phụ thuộc giao diện của task trước nên không fan-out). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kit đọc tệp ý định JSON của kho, suy trạng thái từng hàng từ `_acceptance/` bằng hàm xếp ô của bản đồ, vẽ `LO-TRINH.html`, in ba dòng lên thẻ start, và cho feature-loop S0 nhận một hàng — không ghi tệp ý định.

**Architecture:** Một mô-đun mới `scripts/lo-trinh.mjs` thuần (không import product-map, nhận `classify` qua tham số) chứa đọc · kiểm khuôn · suy trạng thái · render · CLI `--hang`. `product-map.mjs` xuất `classify`/`SECTIONS` và gọi mô-đun khi có khoá; `start-scan.mjs` thêm khoá `loTrinh`. Mọi bên in cờ từ CÙNG một hàm.

**Tech Stack:** Node ESM, không phụ thuộc mới; test kiểu `tests/scripts/*.test.mjs` (in `PASS: …`/`FAIL: …`, thoát khác 0 khi có FAIL).

**Spec:** `docs/superpowers/specs/2026-10-02-viec-ke-theo-plan-design.md` · hợp đồng `_acceptance/viec-ke-theo-plan/contract.md` · phép đo `_acceptance/viec-ke-theo-plan/evals.yaml`.

## Global Constraints

- Khoá config: `lo_trinh.tep`, đọc bằng `resolveConfigKey` của `lib/evidence-core.cjs`.
- Trang: `LO-TRINH.html` ở gốc kho, tất định (không ngày chạy), không `<script`, không tài nguyên ngoài.
- Chữ trạng thái = tiêu đề mục `SECTIONS` của bản đồ, cộng «Chưa mở»; hậu tố «(tin theo lời)» cho hàng không slug.
- Không chạm `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` (giữ T2).
- Kit không ghi byte nào vào tệp ý định.
- Đường dẫn trong test suy từ vị trí test (`KIT = path.resolve(__dirname, '../..')`).
- Mỗi phép đo mới có cặp hai chiều trên cùng fixture + thông điệp ghim (MEASURE-BIRTH-CLAUSE).
- Tiếng Việt cho mọi chuỗi người đọc; tránh từ trong `_Avoid_` của CONTEXT.md («roadmap» chỉ là tên khoá kỹ thuật thì không dùng — khoá là `lo_trinh`).

## Review Focus

1. Tệp ý định có BOM UTF-8 hoặc xuống dòng CRLF → phải đọc được như tệp thường (JSON.parse sau khi gọt BOM). Test: LT-08 thêm biến thể `bom` thoát xanh, 0 lỗi.
2. `cau_giao`/`vi_sao` chứa `<`, `&`, `"` → trang phải escape, không vỡ HTML. Test: LT-06 có hàng chứa `<b>&"` và assert chuỗi escape xuất hiện, chuỗi thô không.
3. `dung_tren` tạo vòng (A đứng trên B, B đứng trên A) → không treo, không hàng nào là hàng kế vì vòng, cờ «đứng trên tạo vòng». Test: LT-09 biến thể `vong`.
4. Slug có ký tự ngoài `[\w-]` hoặc chứa `/`, `..` → không được đọc thư mục ngoài `_acceptance/`; xử như slug dự kiến + cờ «slug không hợp lệ». Test: LT-08 biến thể `slug-thoat`.
5. Tệp ý định rất lớn (oneflow ~ vài chục hàng, crm 28) — không cần tối ưu, nhưng `classify` mỗi slug chỉ gọi một lần (cache theo slug). Test: LT-10 năm hàng cùng slug, đếm lần gọi classify qua callback = 1.

---

### Task 1: Ba fixture lộ trình thật + khuôn mẫu (giả định sinh tử 1, chưa có dòng mã)

**Files:**
- Create: `tests/scripts/fixtures/lo-trinh/crm-okr.json`, `crm-kho-tai-lieu.json`, `oneflow.json`
- Create: `skills/acceptance/references/lo-trinh-template.json`

**Interfaces:** Produces khuôn schema 1: `{schema:1, ten, moc:[{ten,ngay,loai,ai,hang:[ma]}], hang:[{ma,cau_giao,vi_sao?,hang,dung_tren?,slug?,bat_khi?,trang_thai?,...tu_do}], da_bac:[{ma,ly_do}], _nguon:{tep, so_hang, truong_tu_do:[...], tu_khai_ngoai, ho_so:{<slug>:<khoá ô>}}}`. `_nguon` là khối của fixture (bộ đọc coi là trường cấp file tự do, bỏ qua).

- [ ] **Step 1:** Rút từ `crm@origin/docs/okr-tien-do-3009-toi:docs/plan/lo-trinh-okr.data.js` mọi hàng `hang_muc` (28): `ma`, `cau_giao`, `hang`, `dung_tren` ← `chan_boi` dịch sang `ma`, `slug`, `bat_khi`, `trang_thai` nguyên chữ crm; trường tự do giữ: `nhom`, `ten`, `ten_ngan`, `thu_tu`, `pr`, `ghi_chu`. Rút `moc` nếu có. Viết bằng một script nháp trong scratchpad (không commit script), commit JSON.
- [ ] **Step 2:** Tương tự cho `lo-trinh-kho-tai-lieu.data.js` (11 hàng, `moc[]` có `hang_muc` → `hang:[ma]`).
- [ ] **Step 3:** oneflow `docs/roadmap.md`: viết tay hàng theo các hạng mục có mã trong bảng phase (S1–S6 và các mục đánh số của phase), `slug` khi văn bản nêu tên hồ sơ `_acceptance`, không slug khi không.
- [ ] **Step 4:** `_nguon.ho_so` gán mỗi slug của crm-okr một khoá ô (đa dạng, ≥1 hàng tự khai lệch) — dùng cho trang mẫu Task 6.
- [ ] **Step 5:** Khuôn mẫu: 3 hàng minh hoạ đủ bảy trường + 1 trường tự do, 1 mốc, 1 mục đã bác.
- [ ] **Step 6:** Kiểm tay: ba khối biểu diễn được mà không phải bỏ trường tự do nào. Không được → DỪNG, ghi sổ, khuôn sai.
- [ ] **Step 7:** Commit `test(lo-trinh): ba fixture lộ trình thật + khuôn mẫu`.

Verify: `node -e "for (const f of ['crm-okr','crm-kho-tai-lieu','oneflow']) JSON.parse(require('fs').readFileSync('tests/scripts/fixtures/lo-trinh/'+f+'.json','utf8'))"`. Phục vụ: E3, E13. independent: false.

### Task 2: Bộ đọc + suy trạng thái (`scripts/lo-trinh.mjs` lõi)

**Files:** Create `scripts/lo-trinh.mjs`, `tests/scripts/lo-trinh.test.mjs`. Modify `scripts/product-map.mjs` (thêm `export` cho `classify`, `SECTIONS`).

**Interfaces (Produces):**
- `docKhoa(root) → string|null` — giá trị `lo_trinh.tep` hoặc null (khoá vắng/rỗng).
- `docTep(root, tep) → { loi: string|null, data: object|null }` — gọt BOM; lỗi: «tệp ý định không tồn tại: <tep>» · «tệp ý định không phải JSON hợp lệ: <msg>» · «tệp ý định phải nằm trong kho: <tep>» · «gốc tệp ý định phải là một object».
- `kiemKhuon(data) → { hang: Hang[], moc, daBac, ten, co: string[] }` — cờ thiếu trường bắt buộc «hàng <ma|#k> thiếu <truong>», «mã trùng: <ma>».
- `suyTrangThai({ root, data, classify, SECTIONS }) → { hang: [{...row, chu, tinTheoLoi, coHang:[]}], co: string[], hangKe, ngoaiLoTrinh:[slug], songQuaCongDang:{k,n}, tuKhaiNgoai:number, demTheoO:{chu:n} }`.
- `hangTre(ketQua, moc, today:'YYYY-MM-DD') → [{ma, moc, ngay}]`.
- Hằng `DA_GIAO_KEYS = ['cho-nghiem-thu','da-ship','da-nghiem-thu']`, `CHUA_LAM = ['Chưa mở', <tiêu đề can-nhac>, <tiêu đề sap-mo>]`.

- [ ] Viết test đỏ trước cho LT-02, LT-03 (ba fixture), LT-04 (mười ô — kho tạm do code sinh: `git init`, `_acceptance/config.yaml`, mỗi ô một hồ sơ sinh bằng hàm `hoSo(khoa)` trong test), LT-04-do (bản sao `lo-trinh.mjs` sửa chữ một ô bằng `replace` có kiểm thay thế đúng 1 lần), LT-05 trang-phần (cờ lệch/trùng/ngoài từ vựng), LT-05-im, LT-09 ma trận bảy biến thể + `vong`, LT-10 + LT-10-im (hợp đồng `risk_tier: T3   # chú thích`, hồ sơ chỉ opportunity), LT-11 (k/n = 2/3), LT-13 + LT-13-do; Review Focus 3–5.
- [ ] Chạy: `node tests/scripts/lo-trinh.test.mjs` → FAIL (module chưa có).
- [ ] Viết mã; chạy lại tới xanh; mỗi ca đỏ chỉ được tin sau khi bản lành xanh trên cùng fixture.
- [ ] Commit `feat(lo-trinh): bộ đọc tệp ý định + suy trạng thái từ hồ sơ`.

Verify: `node tests/scripts/lo-trinh.test.mjs`. Phục vụ: E2 E3 E4 E5 E9 E10 E11 E13. independent: false.

### Task 3: Trang `LO-TRINH.html` + product-map ghi/`--check`

**Files:** Modify `scripts/lo-trinh.mjs` (`renderTrang(ketQua, {ten, tep}) → string`, `renderLoi(loi, tep) → string`), `scripts/product-map.mjs` (CLI: khoá có → ghi/so trang; khoá vắng → không đụng). Test thêm vào `tests/scripts/lo-trinh.test.mjs`.

- Thông điệp `--check`: khớp → «LO-TRINH.html khớp tệp ý định và hồ sơ.» (stdout, sau dòng bản đồ); lệch/vắng → stderr «LO-TRINH.html lệch với tệp ý định và hồ sơ — chạy: node <hint> --root .» exit 1. Lỗi tệp ý định KHÔNG làm exit khác 0.
- [ ] Test đỏ trước: LT-01 (bản sao trọn `scripts lib skills` bằng `cpSync`, `lo-trinh.mjs` thay bằng `export const docKhoa=()=>{throw new Error('LO-TRINH-GOI-KHI-VANG')}` …mọi export; đối chứng dương kho có khoá phải ném), LT-01-do, LT-06 (+escape Review Focus 2), LT-06-do ba ca, LT-07 + LT-07-do, LT-08 bốn ca + `bom` + `slug-thoat` + LT-08-lanh.
- [ ] Mã → xanh → commit `feat(lo-trinh): trang LO-TRINH.html cạnh bản đồ, cùng --check`.

Lưu ý thứ tự trong `product-map` CLI: đọc khoá TRƯỚC, chỉ `import('./lo-trinh.mjs')` khi khoá có — LT-01 cần mô-đun không được gọi khi vắng (import tĩnh mà mô-đun thay thế ném ở cấp mô-đun cũng sẽ đỏ; mô-đun thay thế chỉ ném trong hàm nên import tĩnh vẫn được, nhưng import động gọn hơn và an toàn khi kho tiêu thụ vendored thiếu tệp).

Verify: `node tests/scripts/lo-trinh.test.mjs && node scripts/product-map.mjs --root . --check`. Phục vụ: E1 E6 E7 E8 E15. independent: false.

### Task 4: Thẻ start — khoá `loTrinh` + ba dòng

**Files:** Modify `scripts/start-scan.mjs` (thêm `loTrinh`), `commands/start.md` (khối mới `START-LO-TRINH` ba dòng + khoá vào `START-SCAN-KEYS`).

- `loTrinh` = null khi khoá vắng; ngược lại `{ tep, ten, loi, hangKe:{ma,cauGiao}|null, hangTre, tinTheoLoi:{n,tong}, tuKhaiNgoai, co }`; `today` = `process.env.ACCEPTANCE_TODAY` hoặc `new Date().toISOString().slice(0,10)`.
- Khoá mới trong START-SCAN-KEYS: `loTrinh.tep loTrinh.ten loTrinh.loi loTrinh.hangKe.ma loTrinh.hangKe.cauGiao loTrinh.hangTre[].ma loTrinh.hangTre[].moc loTrinh.hangTre[].ngay loTrinh.tinTheoLoi.n loTrinh.tinTheoLoi.tong loTrinh.tuKhaiNgoai loTrinh.co`.
- [ ] Test đỏ trước: LT-05-the, LT-09-tre, LT-09-truoc-moc, LT-09-tin, LT-09-crm, LT-09-khoa (rút khối marker, so tập đường khoá `loTrinh.*` với JSON thật trên kho có khoá — cả hai chiều). Chạy cả case P99 hiện có (`tests/plugins`) để chắc round-trip cũ không vỡ.
- [ ] Mã → xanh → commit `feat(lo-trinh): ba dòng lộ trình trên thẻ start`.

Verify: `node tests/scripts/lo-trinh.test.mjs && VC_CASES= bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | tail -3` (vùng chứa P99 — kiểm bằng grep `P99` trên các vùng nếu không chắc). Phục vụ: E5 E9. independent: false.

### Task 5: CLI `--hang` + khối `S0-NHAN-HANG` của SKILL feature-loop

**Files:** Modify `scripts/lo-trinh.mjs` (khối `isMain`: `--root <dir> --hang <ma>`), `feature-loop/skills/feature-loop/SKILL.md` (S0 bước 3, khối marker `<!-- <<<S0-NHAN-HANG -->` … `<!-- S0-NHAN-HANG>>> -->` chứa đúng một dòng lệnh trong rào ```).

- [ ] Test đỏ trước: LT-12 (rút khối, thay `<mã>`; cwd = kho fixture; env `HOME` = thư mục tạm có `.claude/plugins/cache/acceptance-gate-kit/acceptance-gate/9.9.9` → symlink tới KIT; `WORKFLOWS_DIR` = `KIT/feature-loop/workflows`), LT-12-do, LT-12-kho.
- [ ] Mã + SKILL → xanh → commit `feat(lo-trinh): feature-loop S0 nhận một hàng`.

Verify: `node tests/scripts/lo-trinh.test.mjs`. Phục vụ: E12. independent: false.

### Task 6: Trang mẫu cho hội đồng + tài liệu

**Files:** Create `tests/scripts/lo-trinh-mau.mjs` (dựng kho tạm từ `crm-okr.json` + `_nguon.ho_so`, vẽ, ghi `_acceptance/viec-ke-theo-plan/mau/lo-trinh-crm-okr.html`; cờ `--check` so thay vì ghi). Modify `CONTEXT.md` (term **Lộ trình**), `GUIDE.md` (mục bật ổ cắm: khoá + thêm `LO-TRINH.html` vào `t1_skip_globs` + khuôn mẫu).

- [ ] Test LT-06-mau (gọi `lo-trinh-mau.mjs --check`, exit 0); chạy ghi một lần; mở trang trong trình duyệt nội bộ để tự soát đọc được trong một phút (không phải bằng chứng, chỉ soát).
- [ ] Commit `docs(lo-trinh): term Lộ trình, cách bật ổ cắm; trang mẫu cho hội đồng`.

Verify: `node tests/scripts/lo-trinh-mau.mjs --check`. Phục vụ: E6 E14. independent: false.

### Task 7: Hồi quy + đo bốn kho thật

- [ ] Bốn suite: `bash tests/scripts/run-tests.sh`, `bash tests/hooks/run-tests.sh`, `bash tests/plugins/run-tests.sh`, `bash tests/workflows/run-tests.sh` — nền: xanh tại `418436ce`.
- [ ] `node scripts/product-map.mjs --root . --check`.
- [ ] Bốn kho (oneflow, radar, aes, media-library): `git archive 418436ce scripts lib skills` vào thư mục tạm A; cây nhánh vào B; chạy `product-map.mjs --root <kho>` (ra stdout bằng cách chạy trên bản sao `_acceptance` + config của kho, KHÔNG ghi vào kho thật) và `start-scan.mjs --root <kho>`; so: bản đồ bằng byte, JSON bằng sau khi bỏ `loTrinh`. Ghi bảng vào Notes của contract.
- [ ] Commit `acceptance(viec-ke-theo-plan): đo bốn kho không khai`; contract `status: implemented`.

Phục vụ: E1 (phần Notes), E15. independent: false.
