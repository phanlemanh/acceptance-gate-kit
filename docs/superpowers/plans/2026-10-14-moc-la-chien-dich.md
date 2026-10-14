# Mốc là chiến dịch — kế hoạch thi công

> **For agentic workers:** feature-loop S3, hạng T2 — thực thi TUẦN TỰ trong phiên chính (các task chạm cùng
> `scripts/lo-trinh.mjs`, không task nào `independent`). Quy ước verify của kho thắng TDD mặc định: mỗi task chạy
> ca của chính nó + `node tests/scripts/lo-trinh.test.mjs` (không hồi quy).

**Goal:** ba cờ vàng của nấc 1 ADR 0025 + một hàm sinh tên phiên/nhóm thanh bên theo mốc, in ở lệnh mở việc.

**Architecture:** mọi thứ đọc CÙNG lớp phân tích `phanTichKho` của `scripts/lo-trinh.mjs`. Cờ A và B đẩy vào
`coHang`/`co` nên đi qua đúng đường của mọi cờ đã có (trang, khối dữ liệu, thẻ start). Cờ C là một khoá gốc mới của
bộ quét start. `tenChienDich`/`tenKho` là hai export thuần; `--mo-o` gọi chúng.

**Tech Stack:** Node ESM, không phụ thuộc mới.

**Spec:** `docs/superpowers/specs/2026-10-14-moc-la-chien-dich-design.md` · hợp đồng `_acceptance/moc-la-chien-dich/contract.md`.

## Global Constraints

- Kit KHÔNG ghi tệp ý định (lộ trình) ở bất kỳ lối nào của vòng này.
- Mã thoát của `lo-trinh.mjs` (0 · 1 · 2 · 3) và của `product-map.mjs --check` không đổi.
- Kho không dùng mốc mà mọi hồ sơ đang mở đều thuộc việc → trang, thẻ start, ô cơ hội giống từng byte bộ máy gốc.
- Câu cờ trên trang không chứa cụm nội bộ (`cau_giao`, `lo_trinh_`, `tệp ý định`, `dung_tren`, …) — danh sách `CAM_CO` của LT-97.
- Không chạm `dieu-phoi/`, `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`.
- Mỗi phép đo mới có cặp hai chiều trên cùng kho thử, thông điệp ghim; kho thử do code sinh; bộ máy gốc = `git archive f4e717bf scripts lib skills`.

## Review Focus

1. Hồ sơ nhận hàng qua `lo_trinh_ma` (slug khác mã) — phải tính là «có hồ sơ» (MC-1-do2).
2. Kho hai lộ trình — cờ B chỉ hiện một lần, ở lộ trình đầu (MC-3-hai-lo-trinh).
3. Lệnh mở việc chạy từ worktree / thư mục con — tên kho là tên checkout chính (MC-7 worktree).
4. Tên mốc dài có dấu tách «; » / «: » và ngày không đúng dạng (MC-6 ma trận).
5. Kho không phải kho git (bản sao `git archive` của crm) — `tenKho` rơi về tên thư mục gốc, không ném (MC-6, MC-10).

---

### Task 1: Cờ A + cờ B ở lớp phân tích (AC-1, AC-2, AC-3, AC-5)

**Files:** Modify `scripts/lo-trinh.mjs` (`phanTichKho`, `CO_DICH`) · Create `tests/scripts/moc-chien-dich.test.mjs`
(MC-1, MC-1-do, MC-1-do2, MC-2, MC-2-byte, MC-2-do, MC-2-byte-do, MC-3, MC-3-hai-lo-trinh, MC-3-do, MC-5) · Modify
`tests/scripts/lo-trinh.test.mjs` (hai dòng `MA_TRAN_97`) · `independent: false` · phục vụ E1, E2, E3, E5, E13.

**Interfaces — Produces:** câu thô `hàng <mã>: đang mở vòng mà chưa thuộc mốc nào` và `hồ sơ <slug> đang mở mà không
thuộc việc nào trong kế hoạch`; `CO_DICH` thêm `ngoai-moc` và `ho-so-ngoai-ke-hoach`; export `NHOM_MO` (tập khoá ô
bản đồ coi là đang mở: `DANG_LAM_O ∪ CHUA_LAM_O`).

- [ ] Viết `moc-chien-dich.test.mjs` (khung giống `lo-trinh.test.mjs`: `kho()` git init trong tmp, `banSao()` tiêm đúng
      một lần, `goc()` bung `git archive f4e717bf scripts lib skills`), ca MC-1/2/3/5; chạy → đỏ (cờ chưa có).
- [ ] Trong `phanTichKho`, sau vòng `nhan`: `khoDungMoc = docDuoc.some(t => t.kq.moc.length)`; mỗi lộ trình: tập mã
      thuộc mốc từ `moc[].hang`; với mỗi `d` của `kq.dong`: `d.coHoSo && (dangLam(d.chu) || chuaLam(d.chu))` và mã
      không thuộc mốc và `khoDungMoc` → `d.coHang.push(câu A)` + `kq.co.push(câu A)`. Nhóm trạng thái lấy từ `sections`
      (đã truyền vào `phanTichKho`): `TEN[k]` của `DANG_LAM_O ∪ CHUA_LAM_O`.
- [ ] Cờ B: sau khi `ngoaiLoTrinh` đã trừ chéo, với mỗi slug trong `ngoaiLoTrinh` của lộ trình đầu: `classify(dir, slug).key ∈
      NHOM_MO` → `dat(null, câu B)`. Kho một lộ trình cũng chạy (tính `ngoaiLoTrinh` của `docDuoc[0]`).
- [ ] Hai dòng `CO_DICH`: A → `{ma: m[1], chu: 'đang làm mà chưa thuộc mốc nào — gắn việc này vào một mốc của kế hoạch'}`;
      B → `{ma: null, chu: \`hồ sơ ${m[1]} đang mở mà không thuộc việc nào trong kế hoạch — thêm việc cho nó, hoặc ghi mã việc vào hồ sơ\`}`.
- [ ] `MA_TRAN_97` thêm `ngoai-moc` (kho có mốc + hồ sơ `dang-dung` slug `s` ở hàng A không mốc → «A — đang làm …»)
      và `ho-so-ngoai-ke-hoach` (kho có hồ sơ `c` đang dựng không hàng nào trỏ → «hồ sơ c đang mở …»). Lưu ý: kho thử
      của các dạng cũ có thể phát thêm cờ B (hồ sơ ngoài kế hoạch) — ca so «trang có câu đích», không so tổng.
- [ ] Verify: `node tests/scripts/moc-chien-dich.test.mjs` (MC-1…MC-3, MC-5 PASS) · `node tests/scripts/lo-trinh.test.mjs`
      (0 FAIL; LT-97 «số dạng 25»). Ca so-byte-với-gốc của `lo-trinh.test.mjs` đỏ vì cờ mới → sửa kho thử của ca đó
      cho mọi hồ sơ thuộc hàng, KHÔNG nới phép so.
- [ ] Commit.

### Task 2: `tenChienDich` + `tenKho` + lệnh mở việc + dòng mốc trong ô cơ hội (AC-6, AC-7, AC-8)

**Files:** Modify `scripts/lo-trinh.mjs` (export mới; nhánh CLI `--mo-o`; `dungCoHoi`) · Test: MC-6, MC-6-do, MC-7 (5 ca),
MC-8 · `independent: false` · phục vụ E6, E7, E8.

**Interfaces — Produces:**
`export function tenKho(root) → string` (cha của `git -C root rev-parse --path-format=absolute --git-common-dir`; lỗi → `basename(root)`).
`export function tenChienDich({ hang, moc, tenLoTrinh, tepLoTrinh, nhieuLoTrinh, kho }) → { moc: {ten, ngay, ten_ngan}|null, ten_phien, nhom }`.
`export function tenNganMoc(m) → string`. `dungCoHoi({…, khoDungMoc})` thêm tham số; vắng = false = như cũ.

- [ ] Ca MC-6 ma trận ≥17 dòng viết sẵn; MC-7 dựng kho «kho-chinh», `git worktree add ../wt-khac`, chạy khối S0-MO-O rút
      từ SKILL (cùng hàm rút của LT-76) với `cwd` = worktree và thư mục con; MC-8 hai hàng. Chạy → đỏ.
- [ ] Luật tên đúng bảng design: hàng `ten_ngan`→`ten`→câu giao (đã bỏ «») 6 từ + «…»; mốc: lọc `moc` có mã hàng, sắp
      theo `ngay` (chuỗi) rồi chỉ số tệp, lấy đầu; tên ngắn mốc `ten_ngan`→`ten` cắt ở dấu tách đầu tiên trong
      [' — ', ' (', '; ', ': '] + ` dd/mm` khi `ngay` khớp `^\d{4}-\d{2}-\d{2}$`; tên lộ trình `ten_ngan`→`ten`→tên tệp bỏ
      `lo-trinh-`/`.json`; `nhom = moc ? (nhieu ? \`${lt} · ${mocNgan}\` : mocNgan) : null`.
- [ ] CLI `--mo-o`: tính `k` (khuôn), `khoDungMoc` (đọc mọi tệp khai), gọi `tenChienDich` một lần; cả hai nhánh in
      `{hoSo, moi, moc, ten_phien, nhom}` (thứ tự khoá cố định).
- [ ] `dungCoHoi`: `khoDungMoc` → ngay sau dòng «Mở từ hàng …» chèn `Mốc: <ten> — <dd/mm/yyyy>.` hoặc
      `Mốc: chưa gắn — việc này chưa thuộc mốc nào của kế hoạch; gắn nó vào một mốc, hoặc ghi vì sao chưa.`
- [ ] Verify: MC-6…MC-8 PASS; `lo-trinh.test.mjs` 0 FAIL (LT-76 vẫn xanh: mã thoát và hai khoá cũ giữ). Commit.

### Task 3: Cờ C — kho chưa khai lộ trình trên thẻ start (AC-4)

**Files:** Modify `scripts/start-scan.mjs` (khoá gốc `loTrinhChuaKhai`), `commands/start.md` (khối START-LO-TRINH) · Test
MC-4, MC-4-do · `independent: false` · phục vụ E4.

- [ ] Ca MC-4: kho có config không khoá → JSON `loTrinh: null`, `loTrinhChuaKhai` == câu viết sẵn; mọi khoá khác bằng
      bộ máy gốc (so sâu bỏ đúng khoá mới); kho có khoá → `loTrinhChuaKhai: null`. Thân start.md trong khối
      START-LO-TRINH nhắc `loTrinhChuaKhai` và «nguyên văn».
- [ ] `start-scan.mjs`: `const loTrinhChuaKhai = (cfgRead.err || cfgRead.t == null) ? null : (tepLoTrinh == null ? CAU : null)`;
      thêm vào `out({…})`. Câu: «Kho chưa khai lộ trình — việc mở ở đây không thuộc kế hoạch hay mốc nào; khai bằng
      khoá lo_trinh.tep trong _acceptance/config.yaml».
- [ ] `start.md`: thay câu «`loTrinh` là `null` → KHÔNG in gì, không khuyên bật» bằng: `loTrinhChuaKhai` khác null → in
      nguyên văn đúng một dòng; `loTrinh` null → không in gì thêm. Cập nhật danh sách khoá ở dòng 44 nếu có ca đếm.
- [ ] Verify: MC-4 PASS; `bash tests/scripts/run-tests.sh --manh mjs:1/3` … chỉ các ca start (grep `start-scan` trong
      tests để biết tệp) 0 FAIL. Commit.

### Task 4: SKILL feature-loop S0 — khối `S0-TEN-CHIEN-DICH` (AC-9)

**Files:** Modify `feature-loop/skills/feature-loop/SKILL.md` (S0 bước 3, sau bảng `S0-MO-O-THOAT`) · Test MC-9,
MC-9-do, MC-9-do2, MC-9-do3 · `independent: false` · phục vụ E9.

- [ ] Khối máy đọc:
      ```
      <!-- <<<S0-TEN-CHIEN-DICH -->
      khoa: moc ten_phien nhom
      nhom-rong: khong-xep
      <!-- S0-TEN-CHIEN-DICH>>> -->
      ```
      + một đoạn: sau khối S0-MO-O (cả `moi` true/false), in `ten_phien` và `nhom` (hoặc «chưa gắn mốc»); phiên có công
      cụ đặt tên phiên và xếp nhóm thanh bên của app → đặt tên = `ten_phien`, xếp vào nhóm tên = `nhom` (tạo khi chưa
      có); `nhom` null → không xếp nhóm; mặt không có thanh bên chỉ in.
- [ ] Ca MC-9 rút khối, so tập khoá với khoá mới của JSON `--mo-o` (cây trừ gốc). Verify + chạy các ca SKILL của suite
      plugins có đọc SKILL (P85, P32…) bằng `ONLY_BLOCK`. Commit.

### Task 5: Dữ liệu thật + khoá cấu hình + trang kit (AC-10, AC-11)

**Files:** Create `tests/scripts/moc-chien-dich-crm.mjs` (MC-10) · Modify `_acceptance/config.yaml` (ba khoá
`executors.test.moc_chien_dich`, `moc_chien_dich_lt97`, `moc_chien_dich_crm`) · MC-11 trong tệp ca chính · vẽ lại
`LO-TRINH.html` + `PRODUCT-MAP.md` · `independent: false` · phục vụ E10, E11, E12.

- [ ] MC-10: `CRM_ROOT` hoặc `~/dev/crm`; vắng → thoát 2 «crm vắng: <đường>»; `git -C crm archive 1997da85 _acceptance docs/plan`
      bung vào tmp tên `crm`; phân tích bằng gốc và cây; so tập cờ mới với tập viết sẵn; `tenChienDich` cho hàng OKR đầu
      tiên thuộc mốc «R2 lên production».
- [ ] MC-11: MC1 trong đúng một mốc 2026-11-05; 0 cờ A ở kit; cờ B == tập tự đếm (≥1); tên viết sẵn.
- [ ] Ba khoá config; `node scripts/product-map.mjs --root .`; `--check` thoát 0. Verify cả ba lệnh executor. Commit.

## Self-review

Phủ: AC-1/2/3/5 → T1 · AC-6/7/8 → T2 · AC-4 → T3 · AC-9 → T4 · AC-10/11 → T5. Không chỗ trống. Tên khớp giữa task:
`tenChienDich`, `tenKho`, `NHOM_MO`, `loTrinhChuaKhai`, khối `S0-TEN-CHIEN-DICH`.
