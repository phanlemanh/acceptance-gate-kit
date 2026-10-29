# Đánh thức đọc nhịp đúng mã phiên (TC1) — kế hoạch

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Đánh thức và chẩn đoán của gói `dieu-phoi` tìm thấy nhịp sống của giám sát dù vai giữ mã app còn hook ghi theo mã CLI; phiên giám sát thiếu hook được tự báo và đánh thức leo thang theo lúc thức.

**Architecture:** Hạ tầng tự khai hai mã — hook ghi `ma_app` (biến `CLAUDE_CODE_HOST_SESSION_ID`) vào tệp nhịp, vai ghi `phien_cli` (biến `CLAUDE_CODE_SESSION_ID`). Một hàm đọc `nhipCuaPhien` trong `song.mjs` là bên đọc duy nhất cho `danh-thuc` và `chan-doan`. `tiep-tuc` tự báo `hook_thieu`.

**Tech Stack:** Node ≥ 24 ESM, `node:test`, không phụ thuộc mới.

**Spec:** `_acceptance/danh-thuc-doc-nhip-dung-ma/design.md` · `contract.md` (AC-1…AC-9) · `evals.yaml` (E1…E9).

## Global Constraints

- Hai mã trong mọi ca: mã app `local_gs`, mã CLI `c-gs` — KHÁC nhau.
- Mốc so ghim: `45e9f2cf13d104aa4b1a2321a0026c4b739f8914` (hằng trong tệp test).
- Ngưỡng: `NGUONG_SONG_MS` 10′, `NGUONG_THUC_MS` 40′ giữ nguyên; thang leo khi thiếu hook: dưới 40′ `khong`, 40′–80′ `nhan-giam-sat`, quá 80′ `bao-chu-kho` (hằng mới `NGUONG_THUC_LEO_MS = 2 * NGUONG_THUC_MS`).
- Câu cố định: «hook của gói chưa nạp trong phiên này» (tiep-tuc) · «không có hook của gói» (đánh thức, cả hai nấc) · «vai giữ mã app nhưng nhịp chưa mang mã app» (chẩn đoán).
- Khuôn mã phiên hợp lệ: `laMaPhien` hiện có của `song.mjs` (`/^[\w.-]+$/`, không toàn dấu chấm).
- Mọi tiến trình con trong test chạy với môi trường đã xoá `CLAUDE_CODE_HOST_SESSION_ID` và `CLAUDE_CODE_SESSION_ID`.
- Tên ca mới mở bằng `TC1-`; ở `tests/dieu-phoi/danh-thuc-ma-phien.test.mjs`.

## Review Focus

1. Vai đời trước nhận lại bằng CÙNG mã app (`nhanVaiGiamSat` nhánh `cu.phien === phien`) phải được bổ sung `phien_cli` — không thì vai cũ không bao giờ nâng. Ca trong Task 2.
2. Giám sát đổi phiên (mã app mới) không mang `hook_thieu_luc` của phiên cũ sang. Ca trong Task 4.
3. Tiep-tuc thấy nhịp ở lần sau thì xoá `hook_thieu_luc`. Ca trong Task 4.
4. Hai biến thừa kế trong bộ ca DP3 cũ làm `phien_cli`/`ma_app` thật lọt vào vai — Task 1 sửa `ENV` của các tệp test dùng chung.
5. Tệp nhịp hỏng hay vắng `luc` không làm `nhipCuaPhien` ném lỗi (dùng `docMot` hiện có). Ca trong Task 1.

---

### Task 1: Hook ghi `ma_app` + bên đọc `nhipCuaPhien` + môi trường test sạch

**Files:** Modify `dieu-phoi/scripts/song.mjs`, `tests/dieu-phoi/tiep-tuc.test.mjs` (hằng `ENV`, đưa `MA_TRAN_THUC` + `chayMaTranThuc` thành export nhận tham số mã), các tệp `tests/dieu-phoi/*.test.mjs` có hằng `ENV` lọc biến. Create `tests/dieu-phoi/danh-thuc-ma-phien.test.mjs`.
**Evals:** E1, E9 (một phần). **independent:** false (nền cho mọi task).

**Interfaces — Produces:**
- `ghiNhipSong(thuMuc, { phien, cwd, hangViec, nowMs, maApp = process.env.CLAUDE_CODE_HOST_SESSION_ID })` — thêm khoá `ma_app` khi `laMaPhien(maApp)`.
- `nhipCuaPhien(thuMuc, { phien, phienCli = null }) → {phien, luc, ma_app?, …} | null` — mới nhất trong `song/<phien>.json`, `song/<phienCli>.json`, mọi tệp có `ma_app === phien`.
- Test helper `moiTruongSach(them = {})` trong tệp test mới.

- [ ] Viết ca `TC1-01 hook-ghi-ma-app`, `TC1-01 khong-bien` (hook thật qua `lenhHook`, env sạch + biến của ca; so khoá với bản ở sha ghim rút bằng `git archive` vào thư mục tạm).
- [ ] Chạy: `node --test --test-name-pattern=TC1-01 tests/dieu-phoi/danh-thuc-ma-phien.test.mjs` → FAIL (thiếu `ma_app`).
- [ ] Sửa `ghiNhipSong`, thêm `nhipCuaPhien`.
- [ ] Chạy lại → PASS; chạy `tests/dieu-phoi/tiep-tuc.test.mjs` → xanh.
- [ ] Commit.

### Task 2: Vai ghi `phien_cli`

**Files:** Modify `dieu-phoi/scripts/vai.mjs`, `dieu-phoi/scripts/dieu-phoi.mjs` (lời gọi `ghiVai`). Test `danh-thuc-ma-phien.test.mjs`.
**Evals:** E2. **independent:** false.

**Interfaces — Produces:** `ghiVai(thuMuc, { phien, worktree, day, phienCli = process.env.CLAUDE_CODE_SESSION_ID })`, `nhanVaiGiamSat(thuMuc, { phien, worktree, nowMs, phienCli = process.env.CLAUDE_CODE_SESSION_ID })` — ghi `phien_cli` khi hợp lệ và khác `phien`; nhánh cùng phiên bổ sung `phien_cli` nếu thiếu.

- [ ] Viết `TC1-02 vai-hai-ma` (CLI thật `tiep-tuc` và `mo`), ma trận ba hàng không ghi, `TC1-02-do bo-phien-cli` (bản sao gói, kiểm tiêm áp, ghim «vai thiếu phien_cli c-gs»), ca Review Focus 1.
- [ ] FAIL → sửa → PASS → commit.

### Task 3: Đánh thức và chẩn đoán dùng `nhipCuaPhien`

**Files:** Modify `dieu-phoi/scripts/danh-thuc.mjs`, `dieu-phoi/scripts/chan-doan.mjs`. Test mới.
**Evals:** E3, E4, E6, E7. **independent:** false.

- [ ] Viết `TC1-03 ma-tran-hai-ma` (ba biến thể dùng `chayMaTranThuc` export từ `tiep-tuc.test.mjs`, so deepEqual với ma trận mã-trùng), `TC1-03-do go-ma-app`, `TC1-03-do bo-doc-phien-cli`; `TC1-04 hook-phien-hai-ma` + `-do ghep-ten`; `TC1-06 doc-cu-tung-byte` (8 đầu ra so với bản sha ghim, đối chứng dương); `TC1-07 vang-ma-app` (vai đời trước sinh bằng `ghiVai` của bản sha ghim).
- [ ] FAIL → sửa: `danhThuc` đọc `nhipCuaPhien(thuMuc, { phien: gs.phien, phienCli: gs.phien_cli })`; mục `hook-phien` của `chanDoan` dùng cùng hàm (phienCli = `vai.giam_sat.phien_cli` khi `phien` là giám sát); mục mới `vai-ma` trạng thái `vang` chỉ khi vai không `phien_cli`, không nhịp nối được, và `song/` có tệp không `ma_app` → PASS → commit.

### Task 4: Hook chưa nạp — tiep-tuc tự báo, đánh thức leo thang

**Files:** Modify `dieu-phoi/scripts/tiep-tuc.mjs`, `dieu-phoi/scripts/vai.mjs` (`ghiHookThieu(thuMuc, luc | null)`), `dieu-phoi/scripts/danh-thuc.mjs`. Test mới.
**Evals:** E5. **independent:** false.

**Interfaces — Produces:** kết quả `tiepTuc` thêm `hook_thieu: true` + `hook_thieu_cau` khi `process.env.CLAUDE_CODE_SESSION_ID` hợp lệ mà `nhipCuaPhien` trả null; vai `giam_sat.hook_thieu_luc`. `danhThuc` nhánh thang leo khi `gs.hook_thieu_luc` và không nhịp.

- [ ] Viết `TC1-05 hook-chua-nap` (ma trận ba hàng 5′/50′/90′ + đối chứng), `TC1-05-do bo-bao`, `TC1-05-do bo-thang`, ca Review Focus 2–3.
- [ ] FAIL → sửa → PASS → commit.

### Task 5: Lời dặn ba lệnh + ca thân ca đổi + hai môi trường

**Files:** Modify `dieu-phoi/commands/tiep-tuc.md`, `ban-giao.md`, `mo-dot.md`. Test mới.
**Evals:** E8, E9. **independent:** true (chỉ tài liệu + ca), nhưng chạy sau cùng để ca thân-ca-đổi thấy trọn diff.

- [ ] Viết `TC1-08 loi-dan` + `-do ban-cu` (ba tệp ở sha ghim qua `git show`), `TC1-09 hai-moi-truong`, `TC1-09 than-ca-doi` (rút tập ca đổi thân so với sha ghim; so với dòng sổ `fix` có khoá `ca_doi_than`).
- [ ] Sửa ba tệp lệnh: mỗi chỗ `--phien <mã phiên này>` của giám sát nói «mã app `local_…` từ công cụ phiên của app; máy tự ghi mã CLI; ngoài app dùng mã CLI».
- [ ] Chạy trọn `node --test "tests/dieu-phoi/**/*.test.mjs"` hai môi trường → `# fail 0`; chạy `executors.test.dieu_phoi_tc1`.
- [ ] Commit; hợp đồng `status: implemented`.
