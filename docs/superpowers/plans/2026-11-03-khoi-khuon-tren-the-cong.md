# Khối «Khuôn» trên thẻ hai cổng (KH2): kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (cách thi công đã chốt là Native: phiên
> chính tự làm tuần tự theo feature-loop S3). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bước nạp S1 ghi nhóm khuôn đã chọn kèm băm màn mẫu. Hai thẻ cổng đọc vật ấy (và tệp lượt chấm) thành khối
«Khuôn». Màn mới đi qua một câu Hỏi-n sẵn có.

**Architecture:** Lệnh `scripts/design-floor-khuon.mjs` ghi `chon` vào `khuon-nap.json`. Bộ đọc
`scripts/ban-do-khuon.cjs` có thêm `theCong1` cạnh `theCong2` (mở rộng); hàm `dongLech` dời về đây làm một nguồn.
`scripts/gate-card.js` gọi hai hàm, in khối, và đưa lỗi lên thành cờ. Khối `KHUON-S1` trong SKILL feature-loop đổi sang
lệnh có `--nhom`.

**Tech Stack:** Node ≥ 20, CommonJS (bộ đọc, thẻ) và ESM (lệnh, ca đo); git CLI; không thêm phụ thuộc.

**Spec:** `_acceptance/khoi-khuon-tren-the-cong/design.md`, cùng `contract.md` và `evals.yaml` của hồ sơ.

## Global Constraints

- Kho không có `design/patterns/`: mọi lệnh thoát 0, không in, không ghi; thẻ hai cổng (HTML và `--extract`) bằng từng
  byte bản trước vòng (AC-6).
- Không sửa `lib/` (t3_paths). Bộ đọc chỉ `require` hàm `lib` đang export.
- `khuon-nap.json` giữ `schema: 1`; `chon` là khoá tuỳ chọn. Bản nạp không cờ chọn ra tệp bằng từng byte bản KH1.
- Chuỗi người đọc chép NGUYÊN VĂN từ hợp đồng:
  - «S1 chưa ghi đã chọn nhóm khuôn nào — chạy bước nạp kèm --nhom»
  - «màn mẫu đổi sau khi S1 đọc — đọc lại trước khi duyệt»
  - «nhóm mới <tên> chưa thành câu hỏi ở cổng»
  - «màn mẫu không có trên đĩa»
  - «băm khớp»
  - «Thẻ việc: chưa điền»
  - «vòng chọn nhóm <A> mà vật chạm nhóm <B>»
  - «… và <k> lệch nữa»
  - «không dựng được khối Khuôn: <thông điệp>»
  - «để màn ngoài bản đồ — bước chấm đếm nó vào tệp giao diện ngoài bản đồ»
- Mặt người nhìn = `surfaces` chứa `ui`, `web` hoặc `web-ui`.
- Ca đo: tên mở bằng `KK-`, tệp `tests/scripts/khoi-khuon-tren-the-cong.test.mjs`, dùng lại
  `tests/scripts/khuon-loi-kho-mau.mjs`. Mỗi ca đỏ chạy trên bản sao trọn `scripts/` + `lib/` (+ `feature-loop/skills`
  cho KK-8) bị tiêm một nhát, sau khi bản lành xanh trên cùng fixture; nhát tiêm khớp đúng một lần; ghim thông điệp.

## Review Focus

1. Màn mẫu nằm ở đường có dấu cách hoặc ký tự Việt → `git hash-object` phải nhận đường như một đối số, không qua shell.
   Ca: KK-1 thêm một nhóm có màn mẫu `src/màn mẫu/A.tsx`.
2. Thẻ việc có hàng thừa hoặc thứ tự hàng khác khuôn → đọc theo tên trường, không theo vị trí. Ca: KK-3 đảo thứ tự hai
   hàng.
3. `khuon-nap.json` hỏng JSON → thẻ Cổng 1 coi như thiếu `chon` (cờ a nếu có mặt người nhìn), không ném. Ca: KK-4 thêm
   hàng (j) tệp hỏng.
4. `chon.nhom` trỏ nhóm đã bị xoá khỏi bản đồ sau khi nạp → khối nói «nhóm <tên> không còn trong bản đồ», không ném. Ca:
   KK-3 thêm vế.
5. `khuon-cham.json` của lượt cũ không có `lech_moi` (tệp đời KH1 đầu) → thẻ Cổng 2 giữ đúng dòng KH1, không in danh
   sách. Ca: KK-5 thêm vế.

---

### Task 1: Bước nạp ghi lựa chọn (`--nhom`, `--nhom-moi`, `--gan`)

Phục vụ E1, E2 · independent: false (Task 2–5 đọc `chon`).

**Files:**
- Modify: `scripts/design-floor-khuon.mjs` (`docCo`, `nap`, `main`)
- Create: `tests/scripts/khoi-khuon-tren-the-cong.test.mjs` (khung ca + KK-1, KK-2)
- Modify: `_acceptance/config.yaml`: thêm `executors.test.khoi_khuon: "node tests/scripts/khoi-khuon-tren-the-cong.test.mjs"`

**Interfaces:**
- Produces: `nap(root, slug, bd, chon?) → string[]`, với `chon` là `{ nhom }` | `{ moi, gan? }` | `undefined`.
- Produces: `dongCauHoiMoi(moi: string, gan: string|null) → string` (một dòng giữa của khối `DEC-ID-RECIPE`, chuỗi JSON
  không ngoặc, `can_cu.nguon = "chi-nguoi"`).
- Produces: tệp `khuon-nap.json` theo design §3.1.

- [ ] Viết KK-1 và KK-2 theo đúng `expected` của E1, E2 (kể cả Review Focus 1). Bản KH1 lấy bằng
  `git archive $(git merge-base HEAD origin/main) scripts lib` vào thư mục tạm. Khối `DEC-ID-RECIPE` rút từ
  `feature-loop/skills/feature-loop/SKILL.md` lúc chạy.
- [ ] Chạy `node tests/scripts/khoi-khuon-tren-the-cong.test.mjs`. Kỳ vọng: KK-1, KK-2 FAIL (chưa có cờ).
- [ ] Hiện thực:
  - `--nhom` và `--nhom-moi` loại trừ nhau (thoát 2), `--gan` chỉ đi với `--nhom-moi`;
  - tên nhóm mới theo cùng luật với `--tao`;
  - `--nhom` lạ → `sai('không có nhóm …')`, liệt nhóm có;
  - băm bằng `git hash-object -- <tệp>` (execFileSync, không shell); tệp vắng → `bam: null` + dòng «màn mẫu không có trên
    đĩa»;
  - `--nhom-moi` in `dongCauHoiMoi` sau chỉ mục.
- [ ] Chạy lại. Kỳ vọng: «PASS: [KK-1]», «PASS: [KK-1-do]», «PASS: [KK-2]», «PASS: [KK-2-do]».
- [ ] Commit `feat(khoi-khuon): bước nạp ghi nhóm đã chọn kèm băm màn mẫu; nhóm mới in câu hỏi chỉ-người`.

### Task 2: `theCong1` và khối «Khuôn» trên thẻ Cổng Phạm vi

Phục vụ E3, E4 · independent: false (dùng Task 1).

**Files:**
- Modify: `scripts/ban-do-khuon.cjs` (thêm `theCong1`, `docTheViec`; export)
- Modify: `scripts/gate-card.js` (nhánh Cổng 1: gọi, in nhãn «Khuôn (thông tin, không cần trả lời)» cạnh «Sàn thiết
  kế», khoá `khuon_g1` trong `--extract` chỉ khi khác null)
- Test: KK-3, KK-4 trong tệp ca đo

**Interfaces:**
- Consumes: `khuon-nap.json.chon` (Task 1); `docThuMuc`, `tachFrontmatter` sẵn có.
- Produces: `theCong1({ root, slug, contractTxt, designTxt, decisionsTxt }) → null | { dong: string[], co: string[] }`.
- Produces: `docTheViec(designTxt) → null | { ai_dung, viec_chinh, tan_suat, so_ban_ghi, thiet_bi }`. Đọc bảng mục
  «Thẻ việc» theo tên trường; thiếu trường nào → null.
- `designTxt` đọc từ `design_doc` trong frontmatter contract; vắng thì `''`.

- [ ] Viết KK-3 (gồm Review Focus 2, 4) và ma trận KK-4 mười hàng, in «10/10» như E4. Tệp nạp hỏng (Review Focus 3)
  là ca riêng «PASS: [KK-4-hong]». Hàng (c)
  và (f) dùng `dongCauHoiMoi` của Task 1 nối bằng khối `DEC-ID-RECIPE`.
- [ ] Chạy; kỳ vọng FAIL.
- [ ] Hiện thực `theCong1`:
  - kho không bản đồ → `null`;
  - không có `chon` và không có mặt người nhìn → `null`, để thẻ không đổi;
  - cờ (c) xét dòng sổ có `stage: "S1"`, `can_cu.nguon: "chi-nguoi"` mà `decision` chứa tên nhóm mới.
- [ ] Chạy lại; kỳ vọng «PASS: [KK-3]», «[KK-3-do]», «[KK-4]», «[KK-4-do]».
- [ ] Commit `feat(khoi-khuon): khối Khuôn trên thẻ Cổng Phạm vi với ba cờ`.

### Task 3: Khối «Khuôn» đầy đủ trên thẻ Cổng Bằng chứng

Phục vụ E5 · independent: false (dùng Task 1, cùng tệp thẻ với Task 2).

**Files:**
- Modify: `scripts/ban-do-khuon.cjs` (dời `dongLech` về đây và export; `theCong2` thêm dòng lệch và cờ nhóm khác)
- Modify: `scripts/design-floor-khuon.mjs` (`import { dongLech }` từ bộ đọc thay bản cục bộ; giữ `export` tên cũ để mọi
  nơi gọi không đổi)
- Modify: `scripts/gate-card.js` (in `khuonG2.lech` dưới dòng số đo)
- Test: KK-5

**Interfaces:**
- Produces: `theCong2(...) → null | { dong, co, lech: string[] }`. `dong` và `co` giữ nguyên nghĩa KH1; `lech` tối đa
  năm dòng `dongLech(x)` cộng «… và k lệch nữa».

- [ ] Viết KK-5 theo E5, gồm Review Focus 5. Hai lệch sinh bằng `--kiem --write` trên kho mẫu; bảy lệch dựng bằng bảy
  tệp màn vi phạm.
- [ ] Chạy; kỳ vọng FAIL.
- [ ] Hiện thực.
- [ ] Chạy `node tests/scripts/khoi-khuon-tren-the-cong.test.mjs` và `node tests/scripts/khuon-loi.test.mjs` (KL-7 giữ
  dòng KH1). Kỳ vọng: cả hai xanh.
- [ ] Commit `feat(khoi-khuon): thẻ Cổng Bằng chứng gọi tên tệp và khối lệch, cờ chạm nhóm khác`.

### Task 4: Lỗi không im lặng và kho không khai bản đồ

Phục vụ E6, E7 · independent: false (cùng tệp thẻ).

**Files:**
- Modify: `scripts/gate-card.js` (hai chỗ `try { … } catch (_) { null }` → cờ «không dựng được khối Khuôn: <msg>»)
- Test: KK-6, KK-7

- [ ] Viết KK-6 (so từng byte với bản cây gốc qua `git archive`) và KK-7 (bản sao bộ đọc ném `Error("hỏng thử")`).
- [ ] Chạy; kỳ vọng KK-7 FAIL, KK-6 có thể xanh sẵn (đó là đối chứng dương; ca đỏ của nó là bản sao in khối khi vắng bản
  đồ).
- [ ] Hiện thực: lỗi bắt được → `{ dong: [], co: ['không dựng được khối Khuôn: ' + e.message] }` ở cả hai cổng.
- [ ] Chạy lại; kỳ vọng bốn dòng PASS của KK-6 và KK-7.
- [ ] Commit `fix(khoi-khuon): lỗi dựng khối Khuôn hiện thành cờ thay vì bị nuốt`.

### Task 5: Lời dặn S1 thành lệnh, cùng tài liệu đi kèm

Phục vụ E8 · independent: false (dùng Task 1–2).

**Files:**
- Modify: `feature-loop/skills/feature-loop/SKILL.md` (khối `KHUON-S1` thành hai dòng lệnh: `--nap` in chỉ mục;
  `--nap --nhom '<nhóm>'` hoặc `--nap --nhom-moi '<tên>' --gan '<nhóm>'`; câu dẫn nói chép dòng câu hỏi in ra vào sổ)
- Modify: `GUIDE.md` §5.2 (hai cờ, một câu mỗi cờ)
- Modify: `CHANGELOG.md` (mục chưa phát hành, một gạch)
- Test: KK-8

- [ ] Viết KK-8 theo E8: rút khối marker, tách nhánh, chạy hai hồ sơ; mutant SKILL bản KH1 và mutant `--gần`.
- [ ] Chạy; kỳ vọng FAIL.
- [ ] Sửa SKILL, GUIDE, CHANGELOG.
- [ ] Chạy ca đo đủ tám, rồi `node tests/scripts/khuon-loi.test.mjs`, `node tests/scripts/moc-chien-dich.test.mjs`,
  `node scripts/product-map.mjs --root . --check`. Kỳ vọng: tất cả xanh.
- [ ] Commit `feat(khoi-khuon): khối KHUON-S1 ghi lựa chọn bằng lệnh; GUIDE §5.2, CHANGELOG`.
