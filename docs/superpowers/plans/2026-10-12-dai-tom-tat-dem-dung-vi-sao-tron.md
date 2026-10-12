# Dải tóm tắt đếm đúng giới hạn, trang hồ sơ hiện trọn «Vì sao làm» — kế hoạch thi công

> **For agentic workers:** thực thi TUẦN TỰ trong phiên chính (feature-loop S3, T2). Bước dùng `- [ ]`.

**Goal:** ô «chưa làm gì» in đúng số giới hạn (hoặc «chưa đọc được») ở mọi hình dạng khối gặp thật; mục gập «Vì sao làm» của trang hồ sơ in trọn.

**Architecture:** một bộ đọc THÂN khối giới hạn trong `scripts/ho-so-tom-tat.cjs` dùng cho đầu đoạn/tiêu đề ở `## Notes` và mục `## Known limits` của báo cáo; ô bị đè vế giới hạn khi một nguồn không đọc được; `tomTatHoSo` trả thêm `chiTiet.viSao` đầy đủ và `chiTiet.gioiHanChuaDoc`; `scripts/evidence-page.js` in hai thứ đó.

**Tech Stack:** Node (CommonJS mô-đun dải, ESM tệp ca), không phụ thuộc mới.

**Spec:** `docs/superpowers/specs/2026-10-12-dai-tom-tat-dem-dung-vi-sao-tron-design.md` · hợp đồng `_acceptance/dai-tom-tat-dem-dung-vi-sao-tron/contract.md` · bộ đo `evals.yaml` (E1–E11) · bản thử `do-truoc-ban-thu.diff`.

## Global Constraints

- 20 dòng mã đang bị bộ ca của hồ sơ đã ký tiêm vào GIỮ NGUYÊN CHỮ và mỗi dòng xuất hiện ĐÚNG MỘT lần (quét 12/10):
  `ho-so-tom-tat.cjs` — `(?:known[ -]limits?|giới hạn đã biết|hạn chế đã biết)(?![\w-])/i;` · `` : tk.gop ? `đã triển khai `` ·
  `const d = boNhanCuoi(k[i].chu);` · `const known = knownBaoCao.length > knownHopDong.length ? knownBaoCao : knownHopDong;` ·
  `const knownHopDong = ghHD.ds;` · `else if (!RONG_GIOI_HAN.test(sauDau(dau))) ra.push(dau);` ·
  `else if (!nhanh) { nguon.production = 'decisions.jsonl'; moi.production = 'chưa ghi quan sát production'; }` ·
  `if (!chau.has(x)) break; c = x; }` · `if (!m || !DAU_GIOI_HAN.test(m[1])) continue;` · `if (/:$/.test(d)) {` ·
  `if (du.length <= TRAN_VI_SAO) return du;` · ``moi.chua_lam = T.contract == null ? null : `${oos.length} mục để ngoài phạm vi · ${!ghHD.lech ?`` ·
  `mục để ngoài phạm vi` (một lần duy nhất trong tệp) · ``return catTran([`${d} ${muc[0]}`, ...muc.slice(1)], ' · ');`` ·
  `    acs,\n` · `if (mo) return catTran(tachCau(tron(mo[1].trim())), ' ');` ·
  `if (t.length < 2 || t[0] !== '«' || t[t.length - 1] !== '»') return t;` · `usage.khoi.reduce((a, k) => a + k.token, 0)` ·
  `|| d.type === 'seal' || d.type === 'thuc-te'`; `evidence-page.js` — `P.push(muc('gia-tri', 'Giá trị', (CT.nguong.length ?`.
- Không sửa `tests/scripts/dai-tom-tat.test.mjs` (AC-6), không chạm `lib/**`, `hooks/**`, khuôn khối `lo-trinh-du-lieu`.
- Vùng cấm của phiên: SKILL feature-loop S1, `gate-card.js`, `can-cu-s1.cjs`, `khong-can-nguoi.mjs`, `start-scan.mjs`, `tin-hieu.mjs`, `dieu-phoi/`, `feature-loop/scripts/`, `feature-loop/workflows/`.
- Chuỗi ô không đọc được: `giới hạn đã biết: chưa đọc được — khối giới hạn ở <hợp đồng | báo cáo | hợp đồng và báo cáo> không theo khuôn`.
- Mọi đường dẫn trong tệp ca suy từ vị trí tệp; kho thử dựng trong lượt bằng `lo-trinh.mjs --mo-o`.

## Review Focus

- Khối giới hạn có dòng tiếp KHÔNG thụt ngay sau mục (bọc lười) — người đọc coi là cùng mục → DD-3 ca (a) có một mục bọc lười.
- Gạch giới hạn trơn ở Notes nằm NGOÀI mọi khối đầu đoạn vẫn đếm như cũ khi Notes cũng có một khối tiêu đề → DD-2 thêm một gạch trơn ngoài khối (4 + 1 = 5).
- Mục báo cáo chỉ có khối ghim lại (không giới hạn) → 0, không «chưa đọc được» → DD-3 ca (e2).
- Câu dẫn của «Vì sao» theo sau là bảng có hàng phân cách căn giữa `|:-:|` → hàng ấy không thành mục → DD-8 ca (d) dùng `|:-:|`.
- Đoạn «Vì sao: Gốc: … — lý do» của `--mo-o` dài hơn 400 → trang in trọn phần lý do → DD-8 ca (a) đi qua dạng ấy.

---

### Task 1: Tệp ca DD (đỏ trước) — `independent: false`

**Files:** Create `tests/scripts/dai-tom-tat-dem-dung.test.mjs`; Modify `_acceptance/config.yaml` (executors.test: `dai_tom_tat_dem_dung`, `dai_tom_tat_sau_kho`).
**Phục vụ:** E1–E5, E8, E11. **Verify:** `node tests/scripts/dai-tom-tat-dem-dung.test.mjs` — ĐỎ ở DD-1…DD-5, DD-8 trước Task 2–3 (in thông điệp ghim), DD-6 xanh.

- [ ] Khung chép từ `dai-tom-tat.test.mjs` (đọc, không sửa tệp ấy): `khoThu` (thêm tham số `report` = thân mục Known limits thô), `trang`, `khoi`, `daiCua`, `banSao`, `chayCa`, `chayDo`, bộ đọc HTML độc lập; thêm `gioiHanChuaDoc(html)` đọc `<li class="vang" data-loai="gioi-han-chua-doc">` và `viSaoTrang(html)` đọc nội dung mục `id="vi-sao"` (bỏ thẻ, `<li>` nối bằng dấu cách).
- [ ] DD-1 ca (a)…(f) theo AC-1, giá trị mong đợi viết sẵn; DD-2 hai khối × 4 gạch «known-limits (Ngoài-n …):» (+ một gạch trơn ngoài khối → 5); DD-3 ca (a)…(g) + (e2) theo AC-3, khối ghim lại rút từ khối `REPIN-TEMPLATE` của `feature-loop/skills/feature-loop/SKILL.md` (thiếu → FAIL «REPIN-TEMPLATE»); DD-4 ma trận 5 chữ × 5 dạng = 25 ca + ca «không có kênh báo»; DD-5 năm hình dạng + hai nguồn + hai chiều gương; DD-6 SHA-256 của `dai-tom-tat.test.mjs` == băm của blob ở bd8163dc (tính lúc viết ca: `git show bd8163dc:tests/scripts/dai-tom-tat.test.mjs | shasum -a 256`); DD-8 sáu ca theo AC-8.
- [ ] Ca đỏ (`chayDo` — bản lành phải xanh trước): DD-1-do (đầu đoạn chỉ đọc một dòng), DD-1-do-dan (không cho đoạn dẫn), DD-1-do-dau-doan (nhận đầu đoạn ở mọi dòng), DD-2-do (đọc lại dòng đã thuộc khối), DD-3-do-so, DD-3-do-repin, DD-3-do-long, DD-4-do, DD-4-do-long, DD-5-do, DD-5-do-nguon, DD-5-do-bao-cao, DD-5-do-trang, DD-6-do (bản sao tệp ca thêm một byte), DD-8-do (trang in `M.vi_sao`), DD-8-do-dai (bỏ trần ở dải). Chuỗi tiêm viết SAU Task 2–3 (tiêm vào dòng thật của vật); mỗi chuỗi khớp đúng một lần.
- [ ] Commit: `test(dai-tom-tat-dem-dung): ca DD đỏ trước`.

### Task 2: Bộ đọc khối giới hạn — `independent: false`

**Files:** Modify `scripts/ho-so-tom-tat.cjs`. **Phục vụ:** E1–E5, E6. **Verify:** `node tests/scripts/dai-tom-tat-dem-dung.test.mjs` (DD-1…DD-5 xanh) và `node tests/scripts/dai-tom-tat.test.mjs` («24 passed, 0 failed»).

**Interfaces — Produces:** `docGioiHanNotes(contract) → { ds: string[], lech: number, khongDoc: number }` · `docGioiHanBaoCao(report) → { ds: string[], khongDoc: number }` · `tomTatHoSo(...).chiTiet.gioiHanChuaDoc: string|null` (export thêm `docGioiHanBaoCao`).

- [ ] Thêm trợ thủ từ bản thử (`do-truoc-ban-thu.diff`): `LA_MUC`, `loaiMuc`, `thut`, `trang`, `tieuDe`, `boQua`, `docDanhSach`, `docDoan`, `laRong`, `thanKhoi(raw, i, da, ranh, coRanh)` (khối trống → `[]`), `LA_GHIM_LAI = /^#{2,6}\s+Re-pin\b/` (chú thích trỏ khuôn REPIN-TEMPLATE).
- [ ] `RONG_GIOI_HAN` nhận `*`/`_` bao quanh: `/^[*_\s]*(?:none|không có|không)\.?[*_\s]*$/i`.
- [ ] `docGioiHanNotes`: bỏ qua dòng đã thuộc khối (`da`); nhánh đầu khối mới (tiêu đề / đầu đoạn thật sự) trước nhánh gạch; nhánh gạch GIỮ NGUYÊN các dòng ràng buộc.
- [ ] `tomTatHoSo`: `knownBaoCao` từ `docGioiHanBaoCao`; sau dòng `moi.chua_lam = …` (giữ nguyên) đè vế giới hạn bằng `.replace(/ · [\s\S]*$/, …)` khi `hong.length` (không lặp cụm «mục để ngoài phạm vi»); `chiTiet.known` rỗng và `chiTiet.gioiHanChuaDoc` = câu ấy.
- [ ] Commit: `feat(ho-so-tom-tat): một bộ đọc khối giới hạn cho Notes và báo cáo`.

### Task 3: «Vì sao làm» trọn vẹn + trang hồ sơ — `independent: false`

**Files:** Modify `scripts/ho-so-tom-tat.cjs`, `scripts/evidence-page.js`. **Phục vụ:** E5 (trang), E8. **Verify:** DD-5, DD-8 xanh; `node tests/scripts/lo-trinh.test.mjs` xanh (LT-151, LT-162, LT-162-do).

**Interfaces — Produces:** `tomTatHoSo(...).chiTiet.viSao: { doan: string, muc: string[] } | null`.

- [ ] `mucSau(k, i)` trả các khối mục sau câu dẫn (gạch, hoặc hàng bảng bỏ tiêu đề + phân cách); `viSaoCua` dùng nó (ba dòng ràng buộc giữ nguyên).
- [ ] `viSaoTu(opp, cauGiao, du)`: cùng vòng chọn; `du` → `viSaoDuCua(k, i, ly)` TRƯỚC các dòng `return` cũ (giữ nguyên); `viSaoDuCua` trả `{ doan: tron(...), muc: [...] }` (hàng bảng: ô nối « · »). Context: `viSaoDuCua(kc, 0, null)`.
- [ ] `evidence-page.js` mục `vi-sao` in `CT.viSao` (`<p>` + `<ul>` khi có mục); mục `gioi-han` thêm `<li class="vang" data-loai="gioi-han-chua-doc">` khi `CT.gioiHanChuaDoc`.
- [ ] Viết chuỗi tiêm cho các ca đỏ của Task 1, chạy, commit: `feat(trang-ho-so): «Vì sao làm» in trọn; giới hạn chưa đọc được`.

### Task 4: Bộ đo sáu kho + đường đo — `independent: false`

**Files:** Create `tests/scripts/dai-tom-tat-sau-kho.mjs`. **Phục vụ:** E7, E9 + mục Đường đo. **Verify:** `node tests/scripts/dai-tom-tat-sau-kho.mjs` xanh; `--hien-tai crm=$HOME/dev/crm` in bốn số.

- [ ] Bản chụp: `git archive <sha> _acceptance` cho sáu kho (mã ghim trong tệp; đường kho `KHO_<TEN>` hoặc `~/dev/<ten>`); base bd8163dc và tiền-trần 7f65e5a0 bằng `git archive` trọn `scripts lib skills`.
- [ ] Bộ dò + bộ đếm ĐỘC LẬP (không require mô-đun dải): phân lớp từng dòng I/C/H/P, cắt khoảng dòng của khối (tiêu đề → tới tiêu đề ≤ cấp; đầu đoạn → tới hết danh sách đầu; báo cáo → tới `### Re-pin`), đếm mục / thấy nhiều nhóm; nguồn nhiều mục hơn thắng.
- [ ] DD-7: tập đổi == 91 viết sẵn; khác giống từng ký tự; mọi đổi == bộ đếm/bộ dò; 15/15; danh sách soi tay; DD-7-base; DD-7-do (bản sao tách dòng tiếp thành mục). DD-9: vi_sao dải == base; trang chứa câu cuối (tham chiếu 7f65e5a0) + mục cuối; khuôn khối crm bằng nhau; DD-9-do (trang base), DD-9-do-tran2.
- [ ] `--hien-tai <kho>=<gốc>`: in (i)–(iv) của mục Đường đo, thoát 0 khi cả bốn bằng 0.
- [ ] Commit: `test(dai-tom-tat-dem-dung): bộ đo sáu kho DD-7/DD-9 + đường đo`.

### Task 5: Tài liệu + bản vẽ + suite — `independent: false`

**Files:** Modify `skills/acceptance/references/lo-trinh-du-lieu.md`, `PRODUCT-MAP.md`, `LO-TRINH.html` (máy vẽ). **Phục vụ:** E10, E6. **Verify:** `node scripts/product-map.mjs --root . --check`; cả bộ kiểm qua khoá máy.

- [ ] Mô tả ô `chua_lam` (khối giới hạn, «None.», «chưa đọc được — khối giới hạn ở …»), ô `vi_sao` (trần chỉ dải + khối, trang in trọn).
- [ ] Vẽ lại bản đồ; rà trang mẫu của hồ sơ đã ký đổi byte (`git diff --stat`) → ghi danh sách hồ sơ phải ghim lại.
- [ ] Cả bộ kiểm (`bash tests/scripts/run-tests.sh` qua `chay-nang.sh`), sửa đỏ do vòng này.
- [ ] Commit, đặt `status: implemented`.
