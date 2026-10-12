# Cửa tín hiệu và gom nhóm — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> Kit: hạng T2 → không Gate 1.5; S3 chạy TUẦN TỰ trong phiên chính (feature-loop S3 mặc định). Mọi task phụ thuộc nhau qua `scripts/tin-hieu.mjs` → không task nào `independent: true`.

**Goal:** Cửa tín hiệu của kho: bộ đọc tín hiệu (khuôn yêu cầu của Điều phối), bản gom = bản phạm vi, răng phủ, đường đi về người gửi, khoá `tin_hieu` trong khối dữ liệu lộ trình, skill gom theo trục A.

**Architecture:** Một mô-đun chỉ đọc `scripts/tin-hieu.mjs` (bộ đọc + răng + đường đi + CLI) import `kiemYeuCau` (dieu-phoi) và `docPhamVi` (cat-luot) — không sửa hai nơi đó; một tệp khoá ổ cắm `scripts/tin-hieu-khoa.cjs` để bộ vẽ biết «cửa vắng» mà không nạp mô-đun; `scripts/product-map.mjs` nạp lười mô-đun khi kho khai và chuyển mảng đường đi cho `veTrang` → `duLieuTrang` (khoá chỉ có khi khai).

**Tech Stack:** Node ESM (`.mjs`), CommonJS cho mô-đun khoá (`.cjs`), test thuần Node (`node:assert`, kho thử `git init` trong thư mục tạm), không thêm phụ thuộc.

**Spec:** `docs/superpowers/specs/2026-10-11-cua-tin-hieu-gom-nhom-design.md` · hợp đồng `_acceptance/cua-tin-hieu-gom-nhom/contract.md` · bộ đo `_acceptance/cua-tin-hieu-gom-nhom/evals.yaml`.

## Global Constraints

- KHÔNG sửa `dieu-phoi/**` và `scripts/cat-luot.mjs` — chỉ import (lời giao 11/10). Buộc phải đổi → dừng, báo phiên điều phối.
- Không chạm `lib/**`, `hooks/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` (giữ T2).
- Mã chỉ đọc: không ghi tệp nào, không gọi mô hình, không mạng. Tất định: hai lần chạy cùng byte.
- Kho không khai `tin_hieu:` → `PRODUCT-MAP.md` / `LO-TRINH.html` không đổi byte; mô-đun `tin-hieu.mjs` không được nạp.
- Chính sách trục: khối `GOM-TRUC` của `skills/gom-tin-hieu/SKILL.md`, giá trị `ket-qua` — mã không ghi cứng.
- Chữ cho người theo CONTEXT.md (tránh `_Avoid_`); thông điệp lỗi tiếng Việt có dấu.
- Đường dẫn trong test suy từ vị trí tệp test (`import.meta.url`), không ghi cứng gốc kho.
- Mọi phép đo mới có cặp hai chiều trên cùng fixture: lành xanh → phá thật trên bản sao → đỏ với thông điệp ghim (MEASURE-BIRTH-CLAUSE).
- Vào S3 chỉ sau khi DP4 (máy M5) lên `origin/main` và nhánh đã đồng bộ.
- Việc nặng (cả bộ test, `git push` có hook, S4, làn ghim lại) bọc `bash ~/.claude/projects/-Users-manhphan-dev-crm/khoa-may/chay-nang.sh "L3 <việc>" <lệnh…>`.

## Review Focus

1. **Tệp tín hiệu trùng id ở hai nguồn** (cùng tên tệp trong hai thư mục) — người chờ: một lỗi nêu id và hai đường, không đếm đôi. → TH-1 thêm ca `trung-id-hai-nguon`.
2. **Bản gom kê cùng một tín hiệu hai lần trong CÙNG nhóm** (gõ lặp) — người chờ: lỗi «hai chỗ» nêu nhóm, không im. → TH-4 ma trận thêm `lap-trong-nhom`.
3. **Tín hiệu `luc` không múi giờ / không đọc được so với `den`** — người chờ: tệp sai khuôn có tên, không lặng lẽ coi là «sau den». → TH-1 ca `luc-sai` (đã có), TH-4 dùng `luc` có `Z`.
4. **Thư mục nguồn khai nhưng không tồn tại** — người chờ: lỗi nêu thư mục (răng thoát 1), không coi là «0 tín hiệu» xanh. → TH-2 thêm ca `nguon-khong-ton-tai`.
5. **Tiêu đề tín hiệu có `<`, `</script>` hay ký tự U+2028** đi vào khối dữ liệu — người chờ: khối vẫn là JSON hợp lệ, trang không vỡ. → TH-8 thêm tín hiệu có `</script>` trong tiêu đề.

---

### Task 1: Khuôn tín hiệu + khoá ổ cắm + khung ca đo

**Files:**
- Create: `skills/acceptance/references/tin-hieu-template.md` (khối `TIN-HIEU-MAU`, `TIN-HIEU-LOAI`, `GOM-MAU`)
- Create: `scripts/tin-hieu-khoa.cjs`
- Create: `tests/scripts/tin-hieu.test.mjs`
- Modify: `_acceptance/config.yaml` (thêm `executors.test.tin_hieu: "node tests/scripts/tin-hieu.test.mjs"`, cạnh `lo_trinh`)

**Interfaces:**
- Produces: `khoaTinHieu(cfgText) → { nguon: string[], gom: string, co: string[] } | null` (cjs, `module.exports = { KHOA: 'tin_hieu', khoaTinHieu }`); khối marker đọc bằng `khoiMarker(txt, ten)` (regex `<!-- <<<TEN -->\n…<!-- TEN>>> -->`, bỏ hàng rào ```).

- [ ] Viết `tin-hieu-template.md`: giải thích khuôn (một tệp `<id>.json`, thân `{phien, loai, hang, noi_dung, luc}` — khuôn yêu cầu của gói Điều phối §4.9), khối `TIN-HIEU-MAU` (JSON một tín hiệu người, `phien: "crm-u7"`, `loai: "tin-hieu"`, `noi_dung.tieu_de`, `noi_dung.man`, `luc` ISO có `Z`), khối `TIN-HIEU-LOAI` (ba dòng `- tin-hieu`, `- viec-phu`, `- hang-moi`), khối `GOM-MAU` (bản gom mẫu đúng khuôn design §3.3: 2 nhóm, 1 lẻ, 1 đã phủ). Ghi rõ: tín hiệu người KHÔNG đi vào thư mục yêu cầu của đợt.
- [ ] Viết `tin-hieu-khoa.cjs` theo nếp `lo-trinh-khoa.cjs`: cắt đúng khối `tin_hieu:` cột 0; `nguon` nhận chuỗi · `[a, b]` · danh sách `- a`; `gom` chuỗi; vắng khối / `nguon` / `gom` → `null`; nguồn khai hai lần → cờ.
- [ ] Khung `tin-hieu.test.mjs`: hàm `ca(ten, fn)` in `PASS: <ten>` / `FAIL: <ten> — <lý do>`, thoát 1 khi có FAIL; `khoThu()` tạo thư mục tạm + `git init` + config; `rutKhoi(tep, ten)`.
- [ ] TH-2 phần khoá: ma trận 7 ca {chuoi · dong-mang · danh-sach · nguon-thut-o-khoi-khac · vang-khoi · vang-nguon · vang-gom} + ca Review-4 để Task 2. In «số ca == 7».
- [ ] Chạy `node tests/scripts/tin-hieu.test.mjs` → TH-2 khoá PASS; phá thử: bản sao `khoaTinHieu` nhặt `nguon:` mọi khối → ca `nguon-thut-o-khoi-khac` đỏ.
- [ ] Commit `feat(tin-hieu): khuôn tín hiệu + khoá ổ cắm (L3)`.

### Task 2: Bộ đọc tín hiệu (AC-1)

**Files:** Create `scripts/tin-hieu.mjs` · Test `tests/scripts/tin-hieu.test.mjs` (TH-1, TH-1-do)

**Interfaces:**
- Consumes: `kiemYeuCau` từ `../dieu-phoi/scripts/hinh-dang.mjs`; `khoaTinHieu`.
- Produces: `napLoai(tepKhuon?) → string[]`; `docTinHieu(root, nguon: string[]) → { tinHieu: TinHieu[], ngoaiKhuon: Record<loai, number>, loi: string[] }` với `TinHieu = { id, tep, loai, phien, hang, luc, tieu_de, noi_dung }`; `tieuDeCua(noi_dung) → string` (thứ tự `tieu_de` → `viec` → `cau_giao` → chuỗi).

- [ ] TH-1 (đỏ trước): (a) khối mẫu → tệp → 1 tín hiệu, `kiemYeuCau` gọi trong ca không ném; (b) 374 tệp fixture `tests/dieu-phoi/fixtures/dot-crm-0910/yeu-cau` → bảng đếm == đếm độc lập; số tín hiệu == số tệp loại ∈ `napLoai()`; đúng MỘT dòng `ngoài khuôn tín hiệu:`; (c) bốn tệp hỏng {json-hong · thieu-phien · luc-sai · tieu-de-rong} → 4 lỗi nêu tên tệp; (d) Review-1 `trung-id-hai-nguon` → 1 lỗi nêu id và hai đường; Review-4 thư mục nguồn không tồn tại → lỗi nêu thư mục.
- [ ] Cài `docTinHieu`: đọc `*.json` theo thứ tự tên trong từng nguồn; `JSON.parse` lỗi → `tín hiệu <tệp> sai khuôn: JSON hỏng`; `kiemYeuCau` ném → `… sai khuôn: <message>`; `Date.parse(luc)` NaN → `… luc không đọc được`; loại `tin-hieu` thiếu `tieu_de` → `… thiếu noi_dung.tieu_de`; loại ngoài danh sách → đếm vào `ngoaiKhuon`.
- [ ] TH-1-do: bản sao `tin-hieu.mjs` (chép vào thư mục tạm, sửa nhánh JSON hỏng thành `continue`) → chính hàm đo của TH-1(c) trả lỗi nêu «json-hong».
- [ ] Chạy test → PASS; commit `feat(tin-hieu): bộ đọc tín hiệu — khuôn yêu cầu của Điều phối (L3 AC-1)`.

### Task 3: Bộ đọc bản gom + round-trip bản phạm vi (AC-3)

**Files:** Modify `scripts/tin-hieu.mjs` · Test TH-3, TH-3-do

**Interfaces:**
- Consumes: `docPhamVi` từ `./cat-luot.mjs`.
- Produces: `docBanGom(txt) → { dot, dang, nguon, truc, den, nhom: [{ma, ten, tinHieu: string[], dong}], le: [{id, lyDo, dong}], daPhu: [{id, hoSo, dong}], loi: string[] }`.

- [ ] TH-3: khối `GOM-MAU` → `docBanGom` == đếm regex độc lập (thứ tự); `docPhamVi(cùng văn bản)` → `loi == []`, mã == mã nhóm; không id của lẻ/đã phủ là mã.
- [ ] Cài: khoá đầu tệp `dot|dang|nguon|truc|den`; dòng nhóm `- \`<ma>\` — <tên>`; dòng thụt `  - tín hiệu: \`a\`, \`b\`` gắn vào nhóm gần nhất; `- lẻ \`<id>\` — <lý do>`; `- đã phủ \`<id>\` — <slug>`; dòng mở bằng `- ` mà sai cả ba khuôn → lỗi nêu số dòng.
- [ ] TH-3-do: bản sao khuôn có dòng lẻ mở bằng «- \`» → hàm round-trip trả lỗi «lẻ thành mã».
- [ ] Commit `feat(tin-hieu): bản gom đọc được như bản phạm vi (L3 AC-3)`.

### Task 4: Răng phủ + đã phủ + trục + CLI `--rang` (AC-4, AC-5, AC-6)

**Files:** Modify `scripts/tin-hieu.mjs` · Create `skills/gom-tin-hieu/SKILL.md` (tạm: frontmatter + khối `GOM-TRUC`; thân đủ ở Task 7) · Test TH-4/5/6 (+ `-do`)

**Interfaces:**
- Consumes: `DA_THONG_CONG_2`, `DA_DONG_THUC_TE` từ `lib/workspace-record.cjs`; `frontmatterField` từ `lib/evidence-core.cjs`.
- Produces: `napTruc(tepSkill?) → string`; `kiemPhu({ root, khai }) → { loi: string[], canhBao: string[], bang: [{id, cho}], banGom: [{tep, ...docBanGom}], tinHieu, thoat2: string|null }`; CLI `node scripts/tin-hieu.mjs --root <r> --rang` → 0 xanh (in bảng phủ) · 1 đỏ (mỗi lỗi một dòng) · 2 không chạy được (cửa vắng, bản gom ngoài git).

- [ ] TH-4: đối chứng 6 tín hiệu → 0 + 6 dòng; ma trận 8 ca đỏ gồm Review-2 `lap-trong-nhom` (in số) mỗi ca đúng một dòng lỗi; ca im `sau-den`; băm cây + `git status --porcelain` trước == sau (xanh, đỏ, `--chua-gom`, `--duong` — hai lệnh sau thêm ở Task 5, ca TH-4 gọi lại ở đó).
- [ ] TH-5: hồ sơ ở mỗi trạng thái đã giao (rút từ lib trong ca) → không lỗi; ma trận chưa giao {khong-co · o-co-hoi · draft · approved · implemented} → lỗi nêu tín hiệu, hồ sơ, trạng thái.
- [ ] TH-6: vắng `truc` · `truc` khác (lỗi nêu cả hai) · bản sao SKILL đổi khối → bản gom xanh thành đỏ · ngoài git → 2 + «bản gom phải là tệp có trong git» · sau commit → 0.
- [ ] Cài `kiemPhu`: gom mọi `*.md` trong `khai.gom` (thứ tự tên), mỗi tệp phải `git ls-files --error-unmatch`; `docPhamVi` lỗi → in nguyên văn; mốc = max `den`; tín hiệu `luc ≤ mốc` phải có đúng một chỗ trên mọi tệp; chỗ của id lạ → lỗi; trạng thái hồ sơ đã phủ đọc `status` của `_acceptance/<slug>/contract.md`, vắng contract → «ô cơ hội đang chờ».
- [ ] Ba ca `-do` (răng chỉ xét tệp đầu · coi mọi hồ sơ có thư mục là đã giao · ghi cứng chính sách) — mỗi ca chép bản sao mô-đun, tiêm, chạy CHÍNH hàm đo.
- [ ] Commit `feat(tin-hieu): răng phủ — mỗi tín hiệu ở đúng một chỗ (L3 AC-4..6)`.

### Task 5: Đường đi + `--chua-gom` + `--duong` (AC-7)

**Files:** Modify `scripts/tin-hieu.mjs` · Test TH-7, TH-7-do

**Interfaces:**
- Consumes: `phanTichKho`, `docCacTep`, `docTep` từ `./lo-trinh.mjs`; `classify`, `SECTIONS` từ `./product-map.mjs` (CLI nạp động; hàm nhận làm tham số để tránh nạp vòng).
- Produces: `CAU` (bảng khuôn câu design §3.6, export để ca đo so); `duongDi({ root, classify, sections }) → Duong[] | null` với `Duong = { id, loai, tieu_de, luc, cho, nhom, ly_do, ho_so_phu, hang, ho_so, trang_thai, cau }`, `cho ∈ {chua-gom, le, da-phu, nhom-chua-cat, chan-troi, hang-chua-ho-so, hang-co-ho-so}`; `chuaGom({ root, classify, sections }) → { tin_hieu: TinHieu[], da_giao: [{slug, cau_giao}], ngoai_khuon }`; CLI `--duong [--id <id>]`, `--chua-gom`.

- [ ] TH-7: kho thử có lộ trình (`dot` trùng bản gom, hàng `phu` mã nhóm, `chan_troi`, hàng nối hồ sơ) + một tín hiệu ở mỗi chỗ (7, in số); `cho`/`cau` == bảng viết sẵn trong ca; trạng thái hàng == `trang_thai` trong khối của `LO-TRINH.html` cùng kho (đọc bằng `docDuLieu`); `--id` một bản ghi; id lạ → 1; ca KHÔNG nối `hang-khac-dot`.
- [ ] Cài: hàng tìm trong dữ liệu thô của từng tệp lộ trình (`docTep`) theo `dot` + `phu`; trạng thái và hồ sơ của hàng lấy từ `phanTichKho(...).cacTep[i].kq.dong` khớp `_ma`; chân trời theo `chan_troi[].phu` cùng `dot`.
- [ ] TH-7-do: bản sao đổi câu `chan-troi` → hàm đo nêu «chan-troi».
- [ ] Commit `feat(tin-hieu): đường đi tín hiệu → nhóm → hàng → hồ sơ (L3 AC-7)`.

### Task 6: Khoá `tin_hieu` trong khối dữ liệu + kho không khai không đổi byte (AC-8, AC-2 phần bộ vẽ)

**Files:** Modify `scripts/lo-trinh.mjs` (`KHUON_DU_LIEU.goc` + `tin_hieu`; `duLieuTrang(cacTep, sections, tinHieu = null)` thêm khoá chỉ khi `tinHieu != null`; `veHtml(cacTep, sections, tinHieu = null)`; `veTrang(opts)` truyền `opts.tinHieu`; `docDuLieu` thêm `tin_hieu` vào KHUON + `MANG`) · Modify `scripts/product-map.mjs` (đọc `khoaTinHieu`; khai → `await import('./tin-hieu.mjs')` → `duongDi` → `veTrang({..., tinHieu})`) · Modify `skills/acceptance/references/lo-trinh-du-lieu.md` (một dòng bảng khoá gốc) · Test TH-8, TH-2 phần bộ vẽ.

- [ ] TH-8: kho khai → khối có `tin_hieu` deepEqual `--duong`; vẽ hai lần cùng byte; bản chép rời `docDuLieu` (rút nguyên văn hàm, chạy tách) giữ mảng; trang không khoá → `[]`, cảnh báo (a) == (b) chèn `"tin_hieu": []`; bảng khoá tài liệu == `KHUON_DU_LIEU`; Review-5 tiêu đề `</script>` → khối JSON hợp lệ. `-do`: bỏ khoá · bản chép rời cảnh báo khi vắng.
- [ ] TH-2 phần bộ vẽ: kho không khai → ba lệnh thoát 2; khối thô không có `tin_hieu`; so byte với bản sao `git archive HEAD scripts lib skills dieu-phoi` có `scripts/tin-hieu.mjs` = `throw new Error('nap-cua')` (đối chứng: kho khai + bản sao → thoát ≠ 0, stderr «nap-cua»); `-do` tiêm ĐỐI XỨNG mặc định `tin_hieu: []`.
- [ ] Chạy thêm `node tests/scripts/lo-trinh.test.mjs` (LT-118, LT-119 so bảng khoá) → xanh.
- [ ] Commit `feat(lo-trinh): khoá tin_hieu trong khối dữ liệu khi kho khai cửa (L3 AC-8)`.

### Task 7: Skill gom + tài liệu (AC-9)

**Files:** Modify `skills/gom-tin-hieu/SKILL.md` (đủ thân: bước 1–6 design §3.8, khối `GOM-CHUA-GOM`, `GOM-RANG`, `GOM-DUONG` dạng `AG="${AG:-${CLAUDE_PLUGIN_ROOT}}" && node "$AG/scripts/tin-hieu.mjs" --root . …`) · Modify `CONTEXT.md` (term **Tín hiệu**, **Cửa tín hiệu**, **Bản gom** kèm `_Avoid_`) · Modify `GUIDE.md` (mục ổ cắm `tin_hieu`) · Test TH-9, TH-9-do.

- [ ] TH-9: rút ba khối NGUYÊN VĂN, chạy bằng bash với `AG` = gốc cây đang kiểm → xanh 0 / đỏ 1; `GOM-TRUC` có `truc: ket-qua`; ba ngăn + thứ tự bốn bước (bảng cụm viết sẵn); 0 câu khớp mẫu cấm. `-do`: bản sao gõ sai tên lệnh trong `GOM-RANG`.
- [ ] Chạy test kit có liệt kê skill (`bash tests/plugins/run-tests.sh` qua khoá máy) — sửa chỗ liệt kê skill nếu bộ kiểm đòi.
- [ ] Commit `feat(gom-tin-hieu): skill gom theo trục kết quả (L3 AC-9)`.

### Task 8: Bộ vàng + lệnh chấm (AC-10 phần máy)

**Files:** Create `_acceptance/cua-tin-hieu-gom-nhom/rang/sinh-bo-vang.mjs` · `rang/cham-bo-vang.mjs` · `mau/bo-vang.json` · `mau/tin-hieu/*.json` · `rang/dung-kho-tac-tu.mjs` (dựng kho thử cho tác tử: hồ sơ theo trạng thái crm `be1324ba1`, 20 tín hiệu, KHÔNG có `bo-vang.json`) · Test TH-10 (phần kín đáp án, bộ vàng thứ hai, thứ tự commit, `-do2`).

- [ ] `sinh-bo-vang.mjs --crm <đường> --sha 27d47de04 --trang-thai be1324ba1 --ra <mau>`: đọc 10 hồ sơ, mỗi hồ sơ hai tín hiệu (câu đầu «Vấn đề & ai gặp» · dòng «Câu hỏi phép đo trả lời»), `phien` `vang-a`/`vang-b`, id xáo theo hạt cố định, `nhan: "giả — sinh từ crm 27d47de04"`; ghi `bo-vang.json` {nguon, muc[20], cap_trung[10], da_giao[4], cum[4]}. crm vắng → thoát 2 có tên.
- [ ] `cham-bo-vang.mjs --root --bo-vang --gom`: chạy `kiemPhu`; cặp trùng chung chỗ; đã giao → «đã phủ» đúng hồ sơ; còn lại ở nhóm; commit đầu của `bo-vang.json` < commit đầu của bản gom.
- [ ] TH-10 (phần không cần bản gom thật): kín đáp án (quét byte, đối chứng dương), 20 mục == 20 tệp, bộ vàng thứ hai do mã sinh → 0, đảo thứ tự commit → 1 «khai trước», `-do2` nhãn giữ slug.
- [ ] Chạy bộ sinh một lần, commit `mau/` + `rang/` — `acceptance(cua-tin-hieu-gom-nhom): bộ vàng kín đáp án + lệnh chấm`.

### Task 9: Một lượt gom thật bằng skill (AC-10, AC-11)

- [ ] Dựng kho tác tử bằng `rang/dung-kho-tac-tu.mjs` ra thư mục tạm (không có `bo-vang.json`).
- [ ] Dispatch MỘT tác tử tươi (Agent tool), chỉ đưa: đường `skills/gom-tin-hieu/SKILL.md`, khuôn `tin-hieu-template.md`, đường kho tác tử; lệnh: gom theo SKILL, ghi bản gom, chạy răng tới xanh. Không đưa hội thoại, không đưa `mau/bo-vang.json`.
- [ ] Chép bản gom về `mau/gom-bo-vang.md`; chạy `cham-bo-vang.mjs` → ghi kết quả vào sổ nếu đỏ (KHÔNG sửa tay bản gom — đỏ là dữ liệu của S4); TH-10 đầy đủ + `-do`.
- [ ] Commit `acceptance(cua-tin-hieu-gom-nhom): lượt gom bộ vàng bằng skill (tác tử tươi)`.

### Task 10: Đóng S3

- [ ] `git diff --stat origin/main...HEAD -- dieu-phoi scripts/cat-luot.mjs` rỗng (ràng buộc quy trình, kiểm một lần).
- [ ] Cả bộ test qua khoá máy: `bash …/chay-nang.sh "L3 ca bo test" bash tests/scripts/run-tests.sh` (+ plugins, workflows).
- [ ] Vẽ lại `PRODUCT-MAP.md` + `LO-TRINH.html`; contract `status: implemented`; commit; dispatch S4 cùng lượt.
