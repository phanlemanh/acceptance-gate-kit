# dieu-phoi-tiep-tuc-mot-lenh — kế hoạch thực thi

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nối lại một đợt Điều phối – Thợ bằng một lệnh `/dieu-phoi:tiep-tuc`, kèm nhịp sống của phiên, kế hoạch từng dãy, nhận vai và đánh thức giám sát, lệnh con ghi qua CLI, kiểm môi trường do kho khai.

**Architecture:** Mỗi tệp trạng thái mới có đúng một mô-đun viết (`song.mjs` cho `song/`, `vai.mjs` cho `vai.json`, `ghi.mjs` cho `xin/`, `yeu-cau/`, `tra-loi/`, Nhật ký). Phần tính được nằm ở ba mô-đun thuần có đồng hồ truyền vào (`viec-cho.mjs`, `tiep-tuc.mjs` với `keHoachDay`, `danh-thuc.mjs`); `chan-doan`, `tiep-tuc` và `danh-thuc` gọi CHUNG chúng. CLI `dieu-phoi.mjs` chỉ phân lệnh. Lệnh người `dieu-phoi/commands/tiep-tuc.md` làm phần chỉ app làm được.

**Tech Stack:** Node ≥ 22 ESM, `node:test`, không phụ thuộc npm.

**Spec:** `docs/superpowers/specs/2026-10-11-dieu-phoi-tiep-tuc-mot-lenh-design.md` (chín chỗ chọn §3) · thiết kế chung `docs/superpowers/specs/2026-10-10-dieu-phoi-workflow-design.md` §4.2, §5, §5.1 · hợp đồng `_acceptance/dieu-phoi-tiep-tuc-mot-lenh/contract.md` · `evals.yaml`.

## Global Constraints

- Gói `dieu-phoi` không import gì ngoài `dieu-phoi/` và `node:*` (ca DP1-06 giữ).
- Không sửa thân ca nào của `tests/dieu-phoi/dong-goi.test.mjs` và `tests/dieu-phoi/loi/`; mọi ca DP1, DP2 xanh nguyên tên. Ngoại lệ có tên duy nhất: ca DP2-01 nâng tập lệnh lên bốn (Task 10, dòng sổ `revisit` ở hồ sơ DP2).
- Ngưỡng: nhịp sống 10′ · ghi lại nhịp sau 30″ · thức 40′ · lệnh kiểm môi trường trần 30″ (ca hạ được qua tham số) · khoá không nhịp 10′.
- Hành động dãy (một nguồn, hằng `HANH_DONG` ở `tiep-tuc.mjs`): `khong` · `nhan-giang-lai` · `mo-chip` · `worktree-mat` · `cho-nguoi` · `chua-biet`.
- Hành động đánh thức (hằng `DANH_THUC` ở `danh-thuc.mjs`): `khong` · `nhan-giam-sat` · `bao-chu-kho`.
- Lệnh con của thợ (`xin`, `nha`, `yeu-cau`) đòi cwd thuộc dãy; lệnh con của giám sát chạy từ mọi cwd trong kho. Lệnh chỉ-giám-sát (`tra-loi`, `pha`, `vai`, `nhat-ky`) từ chối khi `--phien` khác giám sát; vắng `--phien` chạy như DP2.
- Mã không đặt vào `lib/**` hay `hooks/**` của acceptance-gate (giữ T2).
- Mỗi phép đo mới: cặp hai chiều trên cùng fixture, kiểm từng lần thay đã áp, ghim dấu hiệu của ĐÚNG lỗi được tiêm; ma trận viết sẵn, số assert = số hàng (in ra); đẳng thức so bằng nhau; kho thử code sinh với worktree LIÊN KẾT thật (`git worktree add`); đường suy từ vị trí tệp; dòng chẩn đoán in ra KHÔNG chứa chữ «exit <số>».
- Chữ tài liệu: không «N phút» (dùng ký hiệu ′), không dòng `claude plugin install` ở GUIDE (LB9), không sửa bên trong khối marker có sẵn.

## Review Focus

1. **Hook ghi nhịp khi đầu vào thiếu `session_id`** (bản Claude Code cũ, sự kiện lạ): hook im, không tạo tệp `song/undefined.json`, thoát 0 — Task 1 thêm ca.
2. **`tiep-tuc` chạy song song hai lần** (hai phiên cùng gõ): `chay` đã chống chạy đôi bằng `giuPid`; `vai.json` ghi nguyên tử — người thắng sau cùng là giám sát, phiên kia thấy `thoi_vai` ở lần thức kế — Task 4 ghim «lần hai không thêm tiến trình».
3. **Tệp `song/` hỏng JSON** (ghi dở khi máy sập): bộ đọc bỏ qua tệp hỏng, không ném — Task 1 thêm ca.
4. **`kiem_moi_truong` khai lệnh không tồn tại** (exit 127): mục `thieu` với dòng stderr, không làm sập chẩn đoán — Task 7 thêm hàng.
5. **Đồng hồ máy lùi / tệp nhịp có `luc` tương lai**: tuổi âm coi như 0 (vẫn «sống»), không ném — Task 3 thêm hàng phụ (không vào ma trận AC-3).

---

### Task 1: Nhịp sống — `song.mjs` + hook ghi

**Phục vụ:** E2 · **independent:** false

**Files:** Create `dieu-phoi/scripts/song.mjs`, `tests/dieu-phoi/tiep-tuc.test.mjs`; Modify `dieu-phoi/scripts/hook-nhip.mjs`.

**Interfaces — Produces:**
- `song.mjs`: `TEP_SONG_DIR = 'song'`; `NGUONG_SONG_MS = 10 * PHUT_MS`; `GHI_LAI_MS = 30 * GIAY_MS`; `ghiNhipSong(thuMuc, {phien, cwd, hangViec, nowMs}) → 'ghi' | 'bo-qua'` (ghi `{phien, day, worktree, luc}`, `day` = `phienCuaCwd`, `worktree` = realpath của `git rev-parse --show-toplevel` của cwd; tệp mới hơn 30″ → `bo-qua`); `docNhipSong(thuMuc) → [{phien, day, worktree, luc}]` (bỏ tệp hỏng); `nhipMoiNhatCua(thuMuc, worktree) → {phien, luc} | null`; `coThuMucSong(thuMuc) → boolean`.
- `hook-nhip.mjs`: sau `chamNhip`, nếu có đợt và `dauVao.session_id` là chuỗi có chữ → `ghiNhipSong`. Không đợt → không ghi gì.
- Test file: helper `khoLienKet()` dựng kho thử + đợt mở từ gói (dùng CLI `mo` thật) + hai worktree liên kết thật cho P1, P2 (`git worktree add`), trả `{kho, dot, w1, w2}`; `hookNhip(stdin, {cwd, nowMs})` chạy CHÍNH lệnh hook rút từ `dieu-phoi/hooks/hooks.json` (thay `${CLAUDE_PLUGIN_ROOT}`), đồng hồ giả qua biến `DIEU_PHOI_NOW_MS` mà `song.mjs` đọc khi không truyền `nowMs`.

- [ ] Ca đỏ trước: DP3-02 ghi-nhip, 30-giay, round-trip (đọc bằng `docNhipSong` — Task 2 đổi sang `chan-doan`), DP3-02-do khong-dot; ca Review Focus 1 và 3.
- [ ] Viết `song.mjs`, nối vào hook. Ghi nguyên tử (`ghiJsonNguyenTu`).
- [ ] Verify: `node --test --test-name-pattern='DP3-02' tests/dieu-phoi/tiep-tuc.test.mjs` xanh; `node --test 'tests/dieu-phoi/**/*.test.mjs'` không ca DP1/DP2 nào đỏ (chiều im DP1-02).
- [ ] Commit `dieu-phoi: nhịp sống của phiên qua hook PostToolUse (DP3 AC-2)`.

### Task 2: Việc chờ + mục giám sát của chẩn đoán

**Phục vụ:** E14 · **independent:** false

**Files:** Create `dieu-phoi/scripts/viec-cho.mjs`; Modify `dieu-phoi/scripts/chan-doan.mjs`, `dieu-phoi/scripts/dieu-phoi.mjs` (cờ `--phien` cho `chan-doan`).

**Interfaces — Produces:**
- `viec-cho.mjs`: `viecCho(thuMuc, {thucLuc}) → [{loai:'yeu-cau'|'cho-nguoi'|'su-kien', id, luc, mo_ta}]` sắp theo `luc` tăng dần; yêu cầu = `yeu-cau/*.json` không có `tra-loi/<cùng tên>`; chờ người = `cho-nguoi/*.json`; sự kiện = dòng `su-kien.jsonl` có `can_phan: true` và `luc > thucLuc` (thucLuc null → mọi dòng).
- `chanDoan(cwd, {mo, goi, phien, nowMs})` thêm mục khi có đợt: `giam-sat` (`du` khi `phien` == `vai.giam_sat.phien`; `thieu` việc «chạy /dieu-phoi:tiep-tuc để nhận vai»; vắng `phien` → `khong-ap`), `hook-phien` (`du` khi có `song/<phien>.json`; `thieu`; vắng `phien` → `khong-ap`), `viec-cho` (`du` khi rỗng, `thieu` khi có — trường `ds` mang danh sách). Sáu mục DP2 giữ nguyên thứ tự đầu danh sách.

- [ ] Ca đỏ: DP3-14 viec-cho (sự kiện `khoa-khong-nhip` sinh ở Task 8 — tới Task 8 ca dùng một sự kiện `can_phan` do `ghiSuKien` ghi; Task 8 đổi sang bộ phát lịch thật và thêm vế), DP3-14 giam-sat, DP3-14-do bo-moc-thuc.
- [ ] Viết; verify như Task 1 với pattern `DP3-14`; commit `dieu-phoi: việc chờ và mục giám sát của chẩn đoán (DP3 AC-14)`.

### Task 3: Kế hoạch từng dãy

**Phục vụ:** E3 · **independent:** false

**Files:** Create `dieu-phoi/scripts/tiep-tuc.mjs` (phần `keHoachDay`); Modify `dieu-phoi/scripts/chan-doan.mjs` (mục `day:<id>`).

**Interfaces — Produces:**
- `tiep-tuc.mjs`: `HANH_DONG` (sáu hằng ở Global Constraints); `keHoachDay(thuMuc, {nowMs}) → [{day, hanh_dong, viec, song, ghi_danh?}]`. Thứ tự xét mỗi dãy: worktree không là thư mục → `worktree-mat`; giữ khoá (`khoa/*/chu.json` có `phien` == id dãy) → `khong` (nếu còn đơn/yêu cầu chờ của dãy thì `nhan-giang-lai`); có `cho-nguoi/<dãy>.json` → `cho-nguoi`; có nhịp sống < 10′ → còn đơn (`xin/<dãy>-*`) hoặc yêu cầu chưa trả lời của dãy → `nhan-giang-lai`, không → `khong`; đợt KHÔNG có thư mục `song/` → `chua-biet`; còn lại → `mo-chip` với `ghi_danh` = «thư mục đợt <đường> · đọc LUAT.md trước S1 · dãy <id> · `/feature-loop:feature-loop <slug>`» (slug = hàng kế trong `tiep/<dãy>.json`, vắng thì hàng đầu của dãy chưa gộp trong `hang-viec.json`).
- `chan-doan` thêm mục `day:<id>` mỗi dãy: `trang_thai` = `du` khi `khong`, `thieu` cho các hành động còn lại; `viec` = câu của hành động; trường `hanh_dong` mang hằng.

- [ ] Ca đỏ: DP3-03 ma-tran (7 hàng a–g; hàng g dựng bằng `mo` của merge-base: `git archive <mb> dieu-phoi` vào thư mục tạm, chạy CLI của bản đó), DP3-03-do bo-khoa, DP3-03-do bo-chua-biet; ca Review Focus 5.
- [ ] Viết; verify pattern `DP3-03`; commit `dieu-phoi: kế hoạch từng dãy khi tiếp tục (DP3 AC-3)`.

### Task 4: Nhận vai, `tiep-tuc` và `--nhe`

**Phục vụ:** E4, E5 · **independent:** false

**Files:** Modify `dieu-phoi/scripts/vai.mjs`, `dieu-phoi/scripts/tiep-tuc.mjs`, `dieu-phoi/scripts/dieu-phoi.mjs`.

**Interfaces — Produces:**
- `vai.mjs`: `nhanVaiGiamSat(thuMuc, {phien, worktree}) → {doi:boolean}` (cùng phiên → chỉ cập nhật `thuc_luc`, `doi:false`; khác → mục cũ vào `lich_su` với `thoi_luc`); `ghiThucLuc(thuMuc, phien)`; `laGiamSat(thuMuc, phien) → boolean | null` (null khi vai.json không ghi giám sát).
- `tiep-tuc.mjs`: `tiepTuc(cwd, {phien, nhe, nowMs}) → {dot, thoi_vai, vai_doi, phat_lich:'song'|'chay-lai', ke_hoach, chan_doan}`. Không đợt → ném «không có đợt nào đang chạy». `nhe` và phiên ≠ giám sát hiện có → `{thoi_vai:true}`, KHÔNG ghi gì. Không `nhe` → nhận vai. Cả hai → `ghiThucLuc`, `chayPhatLich` khi pid chết. KHÔNG đổi `pha`.
- CLI: `tiep-tuc --phien <mã> [--nhe] [--json]` (vắng `--phien` → thoát 1 «cần --phien»).

- [ ] Ca đỏ: DP3-04 nhan-vai (dừng bộ phát lịch nó dựng trong `after`), DP3-04-do khong-dot, DP3-05 nhe, DP3-05-do ghi-khi-thoi; ca Review Focus 2.
- [ ] Viết; verify pattern `DP3-0[45]`; commit `dieu-phoi: tiep-tuc nhận vai, chạy lại bộ phát lịch, dạng nhẹ (DP3 AC-4, AC-5)`.

### Task 5: Đánh thức giám sát

**Phục vụ:** E9 · **independent:** false

**Files:** Create `dieu-phoi/scripts/danh-thuc.mjs`; Modify `dieu-phoi/scripts/dieu-phoi.mjs` (lệnh `danh-thuc [--json]`).

**Interfaces — Produces:** `DANH_THUC`; `danhThuc(cwd, {nowMs}) → {hanh_dong, phien, cau, ly_do}`: không đợt → `khong`; `viecCho(thuMuc, {thucLuc})` rỗng → `khong`; thức (`vai.giam_sat.thuc_luc`, vắng thì `nhan_luc`) < 40′ → `khong`; giám sát không nhịp sống quá 10′ (`song/<phien>.json` vắng hoặc cũ) → `bao-chu-kho`, câu «/dieu-phoi:tiep-tuc»; còn lại → `nhan-giam-sat`, câu «thức: chạy `/dieu-phoi:tiep-tuc --nhe`». Chỉ đọc.

- [ ] Ca đỏ: DP3-09 ma-tran (7 hàng a–g), DP3-09-do bo-viec-cho.
- [ ] Viết; verify pattern `DP3-09`; commit `dieu-phoi: đánh thức giám sát chỉ khi có việc chờ (DP3 AC-9)`.

### Task 6: Lệnh con ghi

**Phục vụ:** E6, E7 · **independent:** false

**Files:** Create `dieu-phoi/scripts/ghi.mjs`; Modify `dieu-phoi/scripts/dieu-phoi.mjs` (lệnh `xin`, `nha`, `yeu-cau`, `tra-loi`, `nhat-ky`; cờ `--phien` cho `pha`, `vai`).

**Interfaces — Produces:**
- `ghi.mjs`: `ghiDon(cwd, {loai, uocPhut, moMerge, slug}) → đường` (dãy = `phienCuaCwd`, ngoài dãy → ném «xin: cwd không thuộc dãy nào»; dựng `{phien, slug, loai, luc, worktree, uoc_phut, mo_merge?}`, qua `kiemDon` rồi mới ghi `xin/<dãy>-<loại>.json`); `nhaKhoa(cwd, taiNguyen)` (chỉ gỡ khoá mà `chu.phien` == dãy của cwd, khác → ném «nha: khoá <tn> không do <dãy> giữ»); `ghiYeuCau(cwd, {loai, hang, noiDung}) → id` (số = max hiện có + 1; qua `kiemYeuCau`); `ghiTraLoi(cwd, id, traLoi, {phien})` (qua `kiemTraLoi`); `ghiNhatKyCli(cwd, cau, {phien})` (gọi `ghiNhatKy` của `hang.mjs`); `kiemGiamSat(thuMuc, phien, lenh)` — `phien` có và `laGiamSat` false → ném «<lệnh>: phiên <C> không phải giám sát hiện tại (<B>)».
- CLI `pha` và `vai --giam-sat <mã>` gọi `kiemGiamSat` trước khi ghi.

- [ ] Ca đỏ: DP3-06 round-trip (taoVong + `ioGia` chép từ `tests/dieu-phoi/mo-dot.test.mjs`), DP3-06-do sai-khuon (6 lời gọi), DP3-06 doc-cu, DP3-07 chi-giam-sat (4 × 3 = 12).
- [ ] Viết; verify pattern `DP3-0[67]`; commit `dieu-phoi: lệnh con ghi qua CLI cho thợ và giám sát (DP3 AC-6, AC-7)`.

### Task 7: Kiểm môi trường

**Phục vụ:** E8 · **independent:** false

**Files:** Create `dieu-phoi/scripts/moi-truong.mjs`; Modify `dieu-phoi/scripts/hinh-dang.mjs` (khoá `kiem_moi_truong`: danh sách `{ten, lenh}` chuỗi có chữ), `dieu-phoi/scripts/chan-doan.mjs`.

**Interfaces — Produces:** `kiemMoiTruong(thuMuc, {gocKho, tranMs = 30_000}) → [{muc, trang_thai, viec}]` — mỗi lệnh `spawnSync('sh', ['-c', lenh], {cwd: gocKho, timeout: tranMs})`: 0 → `du`; khác/127 → `thieu`, viec = dòng đầu stderr; quá trần → `thieu`, viec «quá <n>″»; cộng mục `ban-goi`: `loi/PHIEN-BAN.json.phien_ban` so `dieu-phoi/.claude-plugin/plugin.json.version` (vắng `loi/` → không mục). `chanDoan` nhận `tranMs` (ca truyền 1 000).

- [ ] Ca đỏ: DP3-08 kiem-moi-truong, ban-goi, DP3-08-do kieu; ca Review Focus 4.
- [ ] Viết; verify pattern `DP3-08`; commit `dieu-phoi: kiểm môi trường do kho khai và bản gói của đợt (DP3 AC-8)`.

### Task 8: Khoá không nhịp sống

**Phục vụ:** E10, E14 · **independent:** false

**Files:** Modify `dieu-phoi/scripts/phat-lich.mjs`.

**Interfaces — Produces:** trong vòng xét khoá: khoá có `chu.cap_luc` (đã có, hoặc mtime `chu.json`) cũ hơn 10′, đợt có `song/`, `nhipMoiNhatCua(thuMuc, chu.worktree)` vắng hoặc trước lúc cấp, và `trang-thai.json.khoa_khong_nhip_da_bao` chưa chứa `<tn>@<cap_luc>` → `ghiSuKien({loai:'khoa-khong-nhip', tai_nguyen, phien, can_phan:true})` và ghi vào danh sách đã báo.

- [ ] Ca đỏ: DP3-10 khoa-khong-nhip (bốn đợt: không nhịp · nhịp của P1 · không `song/` · phiên khác cùng worktree), DP3-10-do bo-dieu-kien. Nối DP3-14 sang sự kiện do bộ phát lịch thật ghi.
- [ ] Viết; verify pattern `DP3-1[04]`; toàn suite `tests/dieu-phoi/**` (84 ca lõi phải xanh); commit `dieu-phoi: báo khoá không có nhịp sống của phiên giữ (DP3 AC-10)`.

### Task 9: Khuôn LUAT.md dạy lệnh con

**Phục vụ:** E11 · **independent:** false

**Files:** Modify `dieu-phoi/scripts/mau/LUAT.md`, `dieu-phoi/scripts/goi-dot.mjs` (`ghepLuat(khuon, luatRieng, {thuMucDot})` thay `{thu_muc_dot}`), `dieu-phoi/scripts/dieu-phoi.mjs` (truyền thư mục đợt; đường không gói cũng thay).

**Interfaces — Produces:** `kiemLuat(text) → [lỗi]` export từ test: thiếu «/loi/dieu-phoi.mjs xin», «… nha», «… yeu-cau» → lỗi; có «ghi `xin/», «ghi `yeu-cau/», «rm -rf», «{thu_muc_dot}» → lỗi.

- [ ] Ca đỏ: DP3-11 luat, DP3-11-do khuon-cu (khuôn của merge-base qua `git show`).
- [ ] Viết; verify pattern `DP3-11` và `DP2-02` (ca so LUAT của DP2 phải xanh — nó so bằng `ghepLuat` thật); commit `dieu-phoi: LUAT.md dạy thợ dùng lệnh con qua lõi đợt (DP3 AC-11)`.

### Task 10: Lệnh người `/dieu-phoi:tiep-tuc`

**Phục vụ:** E1, E1b, E1c · **independent:** false

**Files:** Create `dieu-phoi/commands/tiep-tuc.md`; Modify `tests/dieu-phoi/mo-dot.test.mjs` (`BA_LENH` thêm `tiep-tuc.md`; khối CHU-QUYET chỉ đòi ở `mo-dot.md`, `dong-dot.md`), `_acceptance/dieu-phoi-mo-dot-mot-lenh/decisions.jsonl` (một dòng `revisit` stage `gate2`: «ca DP2-01 nâng tập lệnh lên bốn vì DP3 thêm tiep-tuc»).

**Interfaces — Produces:** thân lệnh: (1) `node "${CLAUDE_PLUGIN_ROOT}/scripts/dieu-phoi.mjs" tiep-tuc --phien <mã phiên này> --json` (dạng `--nhe` thêm cờ); `thoi_vai: true` → dừng Monitor, báo «phiên này đã thôi giám sát đợt X», kết thúc; (2) Monitor (cùng lệnh `tail … grep '"can_phan":true'` của mo-dot), lịch 30′ chạy `danh-thuc --json` và làm đúng `hanh_dong`, nhóm thanh bên — chỉ tạo khi thiếu; (3) mỗi dãy theo `hanh_dong` (bốn dòng xử lý cho mo-chip · nhan-giang-lai · khong · worktree-mat, cộng cho-nguoi · chua-biet); (4) `chan-doan --phien … --json`, báo một khối «đợt X chạy lại · k dãy cần bấm chip · việc chờ anh: …». Dạng `--nhe`: chỉ (1), Monitor của (2), và (4). Không `disable-model-invocation`.
- Test `DP3-01 trinh-tu` rút tập hành động từ `HANH_DONG` của `tiep-tuc.mjs` và kiểm vị trí.

- [ ] Ca đỏ: DP2-01 ba-lenh (đổi tập), DP3-01 trinh-tu, DP3-01-do dao-buoc.
- [ ] Viết; `node tests/dieu-phoi/kiem-validate.mjs`; verify pattern `DP[23]-01`; ghi dòng sổ DP2; commit `dieu-phoi: lệnh người tiep-tuc (DP3 AC-1)`.

### Task 11: Tài liệu, từ điển, bảng tên lệnh

**Phục vụ:** E12, E12b · **independent:** false

**Files:** Modify `CONTEXT.md` (mục «Nhịp sống của phiên» trong mục Điều phối – Thợ, có `_Avoid_`), `GUIDE.md` §6.6 (lệnh thứ tư, dạng nhẹ, lịch 30′ đánh thức), `QUICKSTART.md`, `skills/acceptance/references/human-facing-language.md` (dòng `| tiep-tuc | /dieu-phoi:tiep-tuc | command |`), `dieu-phoi/README.md` (mục «Tiếp tục đợt» trỏ lệnh người — không vá phần mở đợt cũ, đó là Ngoài-1 của DP2).

- [ ] Ca đỏ: DP3-12 tai-lieu, DP3-12-do-lb (cây tạm chép như `caySaoLb` của DP2-14).
- [ ] Viết; `LB_CASES=LB1,LB2,LB9 node tests/plugins/lenh-bam-duoc.test.mjs`; verify pattern `DP[23]-1[24]`; commit `docs: tiếp tục đợt Điều phối – Thợ (DP3 AC-12)`.

### Task 12: Executor, chốt DP1 nguyên vẹn, lưới cả kho

**Phục vụ:** E13 + mọi eval · **independent:** false

- [ ] `_acceptance/config.yaml`: `executors.test.dieu_phoi_dp3` = dòng gộp như `dieu_phoi_dp2` với lọc `DP[123]-` (ghi tay nháy kép, kiểm bằng `resolveConfigKey` và PyYAML).
- [ ] Ca DP3-13 dp1-nguyen (như DP2-15, in «không đổi»/«ĐÃ ĐỔI»).
- [ ] Suite `tests/dieu-phoi/**` 0 fail; `hooks`, `workflows`; `scripts` và `plugins` trọn (nền, không chồng nhau); `product-map --check`; RT13 (tệp ca mới chứa `signed-off` → khai gạch ở hồ sơ `ra-co-ten-lam-va-trao` như DP2).
- [ ] Đặt `status: implemented`, commit; ghim lại hồ sơ DP2 (`dieu-phoi-mo-dot-mot-lenh`, vì ca DP2-01 đổi) và `ra-co-ten-lam-va-trao` nếu chạm — MỘT làn cho cả hai; vào S4.
