# Vòng mở có chủ giữ (GT1) — kế hoạch thi công

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gói `dieu-phoi` có lệnh `tin` giữ vòng giao tiếp chín nấc (mã tin, sổ vòng mở, tin tự đến, chặn kết lượt một lần, lời giao sáu trường) trên hai nơi chứa: thư mục đợt và kênh issue liên máy.

**Architecture:** Lõi thuần (bộ đọc dòng đầu, gấp sổ) tách khỏi nơi chứa (tệp `tin.jsonl` của đợt · bình luận issue qua `gh`) và khỏi CLI. Hai hook đã có (`hook-nhip`, `hook-cho-nguoi`) nạp động phần đưa tin trong khối bắt lỗi; một khối `Stop` mới gọi `hook-tin.mjs`. Lời giao sáu trường là MỘT hàm dùng chung cho `tin GIAO` và chip trong `tiep-tuc`.

**Tech Stack:** Node ≥ 20, ESM, chỉ thư viện chuẩn; test bằng `node --test`; `gh` CLI cho kênh (thay bằng `gh` giả trong test).

**Spec:** `docs/superpowers/specs/2026-10-17-vong-mo-co-chu-giu-design.md` · hợp đồng `_acceptance/vong-mo-co-chu-giu/contract.md` (10 tiêu chí, đã duyệt 18/10) · phép đo `_acceptance/vong-mo-co-chu-giu/evals.yaml`.

## Global Constraints

- Chỉ chạm: `dieu-phoi/**`, `tests/dieu-phoi/**`, hồ sơ vòng, và THÊM khoá `executors.test.dieu_phoi_tin` + `executors.script.dieu_phoi_tin_kenh_that` vào `_acceptance/config.yaml` (điều phối cho 17/10; không sửa khoá cũ, không đụng `feature_loop.suite_keys`).
- KHÔNG đổi một byte của `dieu-phoi/scripts/yeu-cau.mjs`, `kiemYeuCau`, bộ phát lịch, bảy hành động `HANH_DONG`.
- `hooks.json`: mọi khối và mục cũ giữ nguyên từng byte so với `3745b3e9`; thứ mới duy nhất là khối `Stop` gọi `hook-tin.mjs`.
- Hook KHÔNG BAO GIỜ ghi lên issue. Mọi lời gọi `gh` đi qua MỘT hàm, lệnh lấy từ `process.env.DIEU_PHOI_GH || 'gh'`, luôn `--paginate` khi đọc, luôn có trần thời gian.
- Chín khẩu lệnh, hằng `KHAU_LENH` một nguồn: `GIAO HỎI BÁO NHẬN XONG KẸT TRẢ HUỶ MỞ LẠI` (`HỦY` là bí danh của `HUỶ`; NFC trước khi so).
- Mã `<người gửi>-<ddmm>-<n>`; dòng đầu `<KHẨU LỆNH> <mã> · <từ> → <đến>`; thân từ dòng hai không bao giờ được phân loại.
- Kho không đợt, không kênh: mọi hook tin thoát 0, không in, không tạo tệp.
- `xem --json` chỉ có khoá `tin` khi có vòng mức 2, kết-lượt-chưa-nhận hay dãy đang tắt — vắng hẳn khi rỗng (ca KH-01 so mọi khoá khác với `moHinh`). `xem` chữ chỉ thêm dòng khi có các mục ấy (ca KH-03 so từng byte với bản cũ).
- Tên ca test bắt đầu `GT-`; mỗi phép đo mới có cặp ca hai chiều trên cùng fixture, ghim thông điệp (MEASURE-BIRTH-CLAUSE). Đường dẫn trong test suy từ vị trí tệp test.
- Trần đo nhanh: chênh trung vị hook-nhip mới so với `3745b3e9` ≤ 20 ms (vùng đo lại 20–30 ms, > 30 ms đỏ).

## Review Focus

- Hai phiên cùng ghi `tin.jsonl` một lúc: mỗi dòng phải là MỘT lời gọi `appendFileSync` một chuỗi kết bằng `\n` (không ghi nhiều lần cho một dòng) — Task 2 thêm ca hai tiến trình con ghi đồng thời 50 dòng, sổ đọc đủ 50, không dòng hỏng.
- `gh` không cài (ENOENT) khác với `gh` lỗi: cả hai phải là «không đọc được kênh» có tên — Task 3 thêm ca `DIEU_PHOI_GH=/khong/co` → `tin canh` thoát 3 nêu «không chạy được gh».
- Khẩu lệnh gõ ở dạng NFD trên argv (macOS) phải đọc như NFC — Task 2 thêm ca `tin NHẬN` truyền argv NFD → thoát 0.
- Không có `DIEU_PHOI_NOW_MS` thì dùng giờ thật; có thì mọi so sánh giờ (quá hạn, 24 giờ MỞ LẠI, 30′ lối thoát kênh) dùng cùng một hàm `bayGio` của `song.mjs` — Task 1 ca đồng hồ giả và Task 5 ca 30′ dùng chung hàm.
- `tin.jsonl` rất dài (≥ 5 000 dòng) vẫn phải trong trần nhanh khi phiên không có tin mới — Task 4 thêm hàng đo với 5 000 dòng không gửi tới phiên đo.

---

### Task 1: Bộ đọc dòng đầu và gấp sổ (lõi thuần)

independent: true · phục vụ E3 (phần gấp), E4

**Files:**
- Create: `dieu-phoi/scripts/tin-doc.mjs`
- Create: `tests/dieu-phoi/tin.test.mjs` (tệp ca chung của vòng)
- Create: `tests/dieu-phoi/tin-kho-thu.mjs` (hàm dựng kho thử của vòng — KHÔNG import từ `*.test.mjs`)
- Create: `tests/dieu-phoi/fixtures/tin/ca-16-10.json` (hai ca thật 16/10 + một tin khuôn cũ thật từ #308, chép nguyên văn)

**Interfaces:**
- Produces: `KHAU_LENH: readonly string[]` (9 phần tử) · `docDongDau(text: string) → null | {khau_lenh, ma, tu, den} | {cu: true}` · `gapSo(dong: Dong[], {nowMs, hanNhanPhut = 30}) → MucSo[]` với `MucSo = {ma, khau_lenh_mo, tu, den, nac: 0..8, trang_thai, qua_han_nhan: 0|1|2, qua_han_xong: 0|1|2, ket_luot_chua_nhan: bool, se_giao?, han_xong?}` · `Dong = {ma_dong?, dong_dau, than, luc, nguon: 'tin'|'yeu-cau'}`.

- [ ] **Step 1: Viết ca GT-04 dong-dau** — 7 hàng (a)–(g) như AC-4 + (h) bốn hàng `MỞ LẠI` (NFC, NFD, hai dấu cách, «MỞ» một mình); số assert = số hàng, in ra. Ca GT-04-do doc-than và GT-04-do mot-tu chạy CHÍNH `docDongDau` của bản sao gói bị tiêm (kiểm bước tiêm áp), sau khi bản lành xanh.
- [ ] **Step 2: Viết ca gấp sổ GT-03 phần thuần** — bảng trạng thái/nấc viết tay trong ca (chua-den 1 → da-den 2 → da-nhan 5 | ket 6 → cho-chap-nhan 7 → da-chap-nhan 8; mo-lai 5); ma trận quá hạn 7 hàng + quá hạn xong 5 hàng của AC-3. Dòng đầu vào sinh bằng hàm định dạng của chính `tin-doc.mjs` (`vietDongDau`), không viết tay chuỗi.
- [ ] **Step 3: Chạy `node --test --test-name-pattern='GT-0[34]' tests/dieu-phoi/tin.test.mjs`** — Expected: FAIL «Cannot find module …/tin-doc.mjs».
- [ ] **Step 4: Viết `tin-doc.mjs`** — `vietDongDau({khau_lenh, ma, tu, den}) → string`, `docDongDau`, `gapSo`. Bộ đọc: lấy dòng đầu, `normalize('NFC')`, gộp khoảng trắng liên tiếp thành một, khớp khẩu lệnh dài nhất trước (`MỞ LẠI` trước `MỞ`).
- [ ] **Step 5: Chạy lại** — Expected: PASS, mọi dòng `ok … GT-03`, `ok … GT-04`.
- [ ] **Step 6: Commit** `feat(dieu-phoi): bộ đọc dòng đầu và sổ vòng mở chín nấc (GT1)`.

### Task 2: Nơi chứa đợt, lời giao sáu trường, lệnh gửi và đáp

independent: false (cần Task 1) · phục vụ E1, E2 (hàng đợt), E3 (phần lệnh), E9 (hàm `loiGiaoViec`)

**Files:**
- Create: `dieu-phoi/scripts/tin-giao.mjs` (`loiGiaoViec`, nguồn suy hàng, hạn xong)
- Create: `dieu-phoi/scripts/tin-noi-chua.mjs` (nơi chứa đợt; mặt kênh thêm ở Task 3)
- Create: `dieu-phoi/scripts/tin.mjs` (CLI + kiểm trường + `KHAU_LENH` re-export)
- Modify: `tests/dieu-phoi/tin.test.mjs`, `tests/dieu-phoi/tin-kho-thu.mjs`

**Interfaces:**
- Consumes: `vietDongDau`, `docDongDau`, `gapSo` (Task 1); `timThuMucDot`, `phienCuaCwd`, `gocKhoChinh`, `docJson` (`dot.mjs`); `docVai` (`vai.mjs`); `docHangViec` (`hinh-dang.mjs`); `trangThaiHoSo` (`muc-day.mjs`); `bayGio` (`song.mjs`).
- Produces: `loiGiaoViec({y_dinh, ket_qua, ranh_gioi, quyen, diem_hoi, bao_ve, han_xong_phut}) → string` (sáu dòng có nhãn theo thứ tự + dòng `Hạn xong:`) · `suyLoiGiao({thuMuc, dich, hang?, ketQua?, ranhGioi?, hanXong?}) → {truong} | {loi: string}` · `noiChuaDot(thuMuc) → {doc(): Dong[], them(dong: object): void}` · CLI `node tin.mjs <KHẨU LỆNH> <đích|mã> ["câu"] [cờ]`, mã thoát 0/1, stdout in mã hoặc lời giao.

- [ ] **Step 1: Viết ca GT-01 gui-mot-cau** — 11 hàng (a)–(k) của AC-1 trên kho thử dựng bằng CLI thật (`mo` + `pha dang-chay`, remote `origin` giả `https://github.com/thu/kho-a.git`, worktree P1/P2/giám sát, hồ sơ `hang-a` `implemented` và `hang-b` có ô cơ hội với dòng `Vì sao:` và `du-bao.json` có `gio_may`). Mọi hàng thoát 1 so băm cây đợt trước/sau. Đếm chạm trên argv thật. Ca đỏ GT-01-do bo-ranh-gioi, GT-01-do luon-hang-ke.
- [ ] **Step 2: Viết ca GT-02 dap (hàng đợt)** — (a), (a′) bốn hàng câu «sẽ giao», (c)–(m) của AC-2 trừ hai hàng kênh; ca đồng thời hai tiến trình (Review Focus 1); ca argv NFD (Review Focus 3). Ca đỏ GT-02-do bo-commit-moi, bo-nguoi-nhan, giu-moc-cu, chi-co-mat.
- [ ] **Step 3: Chạy `node --test --test-name-pattern='GT-0[12]' tests/dieu-phoi/tin.test.mjs`** — Expected: FAIL «Cannot find module …/tin.mjs».
- [ ] **Step 4: Viết `tin-giao.mjs`** — nguồn suy: hàng ĐANG CHẠY (hồ sơ có `contract.md` mà `status` ≠ `signed-off`/`machine-cleared` trong worktree của dãy) → hàng kế (`hangKeTuTiep`) → từ chối «không suy được Kết quả». Hạn: chỉ khi trọn hàng (chip hoặc `--hang`), `gio_may` = cặp thì lấy phần tử sau, số thì lấy số đó, × 60. `Điểm phải hỏi:` chép nguyên §4.5 của hạt giống thành hằng `DIEM_HOI`.
- [ ] **Step 5: Viết `tin-noi-chua.mjs` (mặt đợt) và `tin.mjs`** — `them` = MỘT `fs.appendFileSync(p, JSON.stringify(dong) + '\n')`; `doc` đọc `tin.jsonl` + `yeu-cau/*.json` (+ `tra-loi/<id>.json` đóng) chỉ đọc. Kiểm trường theo bảng §3.5 thiết kế trước khi ghi; sai → stderr nêu cờ thiếu, thoát 1, không gọi `them`. Câu «sẽ giao»: một câu, khớp `/^sẽ giao\s+\S+(\s+\S+){2,}[^.!?]*[.!?]?$/iu` sau NFC, không chứa `\n`. XONG tự đính: kho khớp (remote `origin` chuẩn hoá) ∧ `git status --porcelain` rỗng ∧ HEAD ≠ mốc (sha lúc NHẬN, hoặc sha lần XONG bị mở lại); PR qua `gh pr view --json url` trần 3 s, lỗi thì bỏ dòng PR.
- [ ] **Step 6: Chạy lại** — Expected: PASS mọi `ok … GT-01`, `ok … GT-02`.
- [ ] **Step 7: Commit** `feat(dieu-phoi): lệnh tin — giao một câu, nhận kèm câu sẽ giao, xong tự đính vật, MỞ LẠI (GT1)`.

### Task 3: Kênh liên máy và bộ canh

independent: false (cần Task 1, 2) · phục vụ E2 (hàng kênh), E4 (qua kênh), E4b, E5, E6

**Files:**
- Create: `dieu-phoi/scripts/tin-kenh.mjs` (gọi `gh`, trạng thái cục bộ, con trỏ, cửa sổ, canh)
- Modify: `dieu-phoi/scripts/tin-noi-chua.mjs` (thêm `noiChuaKenh`), `dieu-phoi/scripts/tin.mjs` (cờ `--kenh`, lệnh `vai`, `canh`, `so --kenh --tu`, `nhac`)
- Create: `tests/dieu-phoi/gh-gia.mjs` (gh giả: trang 30 + header `Link`, `pr view`, nhật ký đọc/ghi, cờ `--loi`, `--treo`)
- Create: `tests/dieu-phoi/tin-kenh-that.mjs` (E4b: chỉ đọc #308 bằng gh thật vào trạng thái tạm; đếm độc lập bằng `gh api --paginate … --jq length`)

**Interfaces:**
- Consumes: Task 1, Task 2 (`noiChuaDot` cùng khuôn `{doc, them}`).
- Produces: `goiGh(doiSo: string[], {tranMs}) → {ma, out, err}` (MỘT chỗ gọi `gh`) · `noiChuaKenh({chu, kho, so, gocKho}) → {doc(), them(), dongBo({tranMs}) → {doc_moi: number} | {loi}}` · `demCuaSo(dong, {tu, nowMs}) → {vong_da_dong, vong_mo_qua_han_2, vong_mo_chua_qua_han, khuon_cu_co_dich, bo_qua, bo_qua_ma, phan_quyet}` · `canh({cho: bool, nhipMs}) → mã thoát 0|3`.

- [ ] **Step 1: Viết ca GT-05 kenh-con-tro** — round-trip AC-5 (35 bình luận sẵn → đọc 36 → thêm 2 → đọc 2; con trỏ; MBP↔M5 hai trạng thái cục bộ; cho-chap-nhan → da-chap-nhan sau hook ở MBP; MỞ LẠI kéo về M5; ma trận cửa sổ 9 bình luận và bốn phán quyết). Ca đỏ bo-con-tro, bo-phan-trang, dem-moi-ma.
- [ ] **Step 2: Viết ca GT-06 canh-chieu-do** — 7 hàng AC-6 + hàng `DIEU_PHOI_GH=/khong/co` (Review Focus 2). Ca đỏ nuot-loi-gh.
- [ ] **Step 3: Thêm hai hàng kênh của GT-02** — (b) `--kho thu/kho-b` NHẬN đúng/sai kho + đối chứng bỏ kiểm danh tính; (e) XONG kênh kho lệch.
- [ ] **Step 4: Chạy `node --test --test-name-pattern='GT-0[256]' tests/dieu-phoi/tin.test.mjs`** — Expected: FAIL ở mọi hàng kênh.
- [ ] **Step 5: Viết `tin-kenh.mjs` và nối vào `tin.mjs`** — đọc: `gh api --paginate repos/<chủ>/<kho>/issues/<số>/comments`, lọc `id > con_tro`; canh: trước khi đọc mới, `gh api repos/<chủ>/<kho>/issues/comments/<id cuối>` và so dòng đầu; mọi lỗi → stderr bắt đầu `canh: `, thoát 3. Trần: giết tiến trình con khi hết trần (`spawn` + `setTimeout` + `kill('SIGKILL')`), nêu «quá trần».
- [ ] **Step 6: Viết `tin-kenh-that.mjs`** — `gh` vắng hay `gh auth status` thoát ≠ 0 → stderr «không đọc được ở đây», thoát 2.
- [ ] **Step 7: Chạy lại** — Expected: PASS mọi `ok … GT-05`, `GT-06`, hàng kênh của `GT-02`.
- [ ] **Step 8: Commit** `feat(dieu-phoi): tin trên kênh liên máy — phân trang, con trỏ, cửa sổ đo ngưỡng, bộ canh có chiều đỏ (GT1)`.

### Task 4: Tin tự đến trong hai hook đã có

independent: false (cần Task 2, 3) · phục vụ E3 (da-den), E7

**Files:**
- Create: `dieu-phoi/scripts/tin-dua.mjs`
- Modify: `dieu-phoi/scripts/hook-nhip.mjs` (khối `try` mới cuối hàm chính: `await import('./tin-dua.mjs')`, ghép `additionalContext` với lời nhắc bàn giao), `dieu-phoi/scripts/hook-cho-nguoi.mjs` (in `hookSpecificOutput` của `UserPromptSubmit` khi có tin)
- Modify: `tests/dieu-phoi/tin.test.mjs`

**Interfaces:**
- Consumes: Task 1–3; `phienCuaCwd`, `docVai`.
- Produces: `duaTin(dauVao: {cwd, session_id, hook_event_name, agent_id?, ...}, {nowMs}) → {ngu_canh: string|null, canh_bao: string|null}` · công tắc `tin tat` / `tin bat` (dấu `<gốc kho chính>/.acceptance-runs/tin/tat/<băm worktree>`), dấu lỗi một lần `…/tin/loi-da-bao/<băm worktree>`.

- [ ] **Step 1: Viết ca GT-07 tin-tu-den** — 11 hàng AC-7 (a)–(k): lệnh rút từ khối `PostToolUse`/`UserPromptSubmit` của `hooks.json`; stdin tác tử con theo khuôn ghi trong ca (`agent_id` có giá trị); (h) đo trên hai kho tạm do code sinh, 30 lần xen kẽ bản này / `git archive 3745b3e9 dieu-phoi`, mỗi lần một tiến trình mới, kèm hàng 5 000 dòng (Review Focus 5); (i) bốn kiểu hỏng gồm `tin-dua.mjs` ném lúc nạp và thiếu tệp nhập. Ca đỏ dua-lan-hai, tac-tu-con, cham (chờ 50 ms), bao-moi-lan, nhap-tinh, chap-nhan-truoc.
- [ ] **Step 2: Chạy `node --test --test-name-pattern='GT-07' tests/dieu-phoi/tin.test.mjs`** — Expected: FAIL «additionalContext» vắng ở (a).
- [ ] **Step 3: Viết `tin-dua.mjs` và sửa hai hook** — đường nhanh: không đợt và không trạng thái kênh → trả ngay `{null, null}` trước mọi lần đọc tệp lớn; đọc `tin.jsonl` theo kích thước đã đọc lần trước (lưu độ lệch byte trong dấu «đã đưa») để không quét lại 5 000 dòng. Đưa XONG vào phiên người giao → ghi dòng máy `chap-nhan`. Tự nhắc mức 1: đợt → ghi BÁO «nhắc <mã>» một lần; kênh → thêm «tin nhac <mã>» vào ngữ cảnh. Việc cũ của hai hook chạy TRƯỚC khối tin, không đổi thứ tự.
- [ ] **Step 4: Chạy lại** — Expected: PASS mọi `ok … GT-07`; `node --test --test-name-pattern='DP3-|DP4-' tests/dieu-phoi/**/*.test.mjs` vẫn xanh.
- [ ] **Step 5: Commit** `feat(dieu-phoi): tin tự đến trong hook-nhip và hook-cho-nguoi — nhanh, hỏng không lan, tắt được (GT1)`.

### Task 5: Hook dừng — chặn kết lượt một lần

independent: false (cần Task 2–4) · phục vụ E8

**Files:**
- Create: `dieu-phoi/scripts/hook-tin.mjs`
- Modify: `dieu-phoi/hooks/hooks.json` (thêm khối `"Stop"` cùng khuôn lệnh `f="${CLAUDE_PLUGIN_ROOT}/scripts/hook-tin.mjs"; [ -f "$f" ] || exit 0; exec node "$f"`, `timeout: 15`)
- Modify: `tests/dieu-phoi/tin.test.mjs`

**Interfaces:**
- Consumes: Task 1–4.
- Produces: `xuLyDung(dauVao: {cwd, session_id, stop_hook_active, agent_id?}, {nowMs}) → {decision?: 'block', reason?: string, systemMessage?: string} | null`.

- [ ] **Step 1: Viết ca GT-08 hook-dung** — 12 hàng AC-8 (a)–(l), lệnh rút từ khối `Stop`; (e) theo câu trả lời Hỏi-1 trong sổ: chặn một lần khi kênh `--loi`/`--treo`, lần hai trong 30′ cho qua, `--treo` xong ≤ 6 s; (k) so sâu mọi khối/mục với `git show 3745b3e9:dieu-phoi/hooks/hooks.json`. Ca đỏ chan-mai, chan-mai-kenh, bo-tran, bo-tat.
- [ ] **Step 2: Chạy `node --test --test-name-pattern='GT-08' tests/dieu-phoi/tin.test.mjs`** — Expected: FAIL «khối Stop vắng».
- [ ] **Step 3: Viết `hook-tin.mjs`, thêm khối `Stop`** — chỉ GIAO chưa NHẬN gây chặn; dấu đã chặn `{ma: [...], luc}` ở `<thư mục đợt>/tin-chan/<mình>.json` hoặc trường `chan` của trạng thái kênh; tập mã chưa nhận ⊆ dấu, hay `stop_hook_active` → cho qua + ghi `ket-luot-chua-nhan`. Kênh lỗi: chặn một lần, dấu `kenh_loi_chan_luc`, trong 30′ cho qua.
- [ ] **Step 4: Chạy lại** — Expected: PASS mọi `ok … GT-08`.
- [ ] **Step 5: Commit** `feat(dieu-phoi): hook dừng chặn kết lượt một lần khi còn việc giao chưa nhận (GT1)`.

### Task 6: Hiện trên `xem`

independent: false (cần Task 1, 2) · phục vụ E3 (vế xem), E8 (đếm ket_luot), E9b (ca KH không đổi)

**Files:**
- Modify: `dieu-phoi/scripts/dieu-phoi.mjs` (`xem`, `xemJson`), `dieu-phoi/scripts/mo-hinh.mjs` (thêm `veTin(muc) → string[]`, KHÔNG đổi `moHinh`/`veXem`)
- Modify: `tests/dieu-phoi/tin.test.mjs`

**Interfaces:**
- Consumes: `gapSo`, `noiChuaDot`.
- Produces: khoá `tin: {qua_han_2: MucSo[], ket_luot_chua_nhan: number, day_tat: string[]}` trong `xem --json`, VẮNG khi ba phần đều rỗng; dòng `  tin quá hạn <mã> · <nấc>` cuối `xem` chữ chỉ khi có mục.

- [ ] **Step 1: Viết vế xem của GT-03 và GT-08 (a)** — ở phút 61 mục mức 2 của `xem --json` bằng mục của `tin so --json`; chữ `xem` chứa mã; ca đỏ xem-bo-tin, chap-nhan-mot-phia.
- [ ] **Step 2: Chạy** — Expected: FAIL «khoá tin vắng».
- [ ] **Step 3: Sửa `xem`/`xemJson`** — tính `tin` sau `moHinh`, chỉ gắn khoá khi khác rỗng.
- [ ] **Step 4: Chạy lại GT-03, GT-08 và `bash -c "$(yq '.executors.test.dieu_phoi_khung' …)"` (khoá cũ)** — Expected: PASS; dòng gộp khoá `dieu_phoi_khung` không có «not ok», `# fail 0`.
- [ ] **Step 5: Commit** `feat(dieu-phoi): xem hiện vòng tin quá hạn, kết lượt chưa nhận, dãy tắt (GT1)`.

### Task 7: Chip sáu trường

independent: false (cần Task 2) · phục vụ E9, E9b

**Files:**
- Modify: `dieu-phoi/scripts/tiep-tuc.mjs` (`xetDay`: dựng phần sáu dòng bằng `loiGiaoViec`, giữ mọi chuỗi con cũ; thiếu Kết quả → `khongHang` với `ly_do` «lời giao thiếu Kết quả»)
- Modify: `tests/dieu-phoi/tin.test.mjs`

**Interfaces:**
- Consumes: `loiGiaoViec`, `suyLoiGiao` (Task 2).
- Produces: `ghi_danh` = chuỗi cũ + `\n` + sáu dòng.

- [ ] **Step 1: Viết ca GT-09 chip-sau-truong** — phần sáu dòng của `ghi_danh` bằng từng byte phần sáu dòng của `tin GIAO` cùng đầu vào; Ý định = dòng `Vì sao:`; hàng không hồ sơ → `khong-hang`. Ca đỏ mo-khi-thieu.
- [ ] **Step 2: Chạy** — Expected: FAIL «Ý định:» vắng.
- [ ] **Step 3: Sửa `xetDay`** — chỉ nối thêm, không xoá chuỗi nào của `ghi_danh` cũ.
- [ ] **Step 4: Chạy GT-09 và khoá `dieu_phoi_khung`** — Expected: PASS; DP3, DP4, ON-DINH-R2, SDT xanh.
- [ ] **Step 5: Commit** `feat(dieu-phoi): lời ghi danh chip đủ sáu trường bằng cùng hàm với tin GIAO (GT1)`.

### Task 8: Luật đợt, README, khoá đo

independent: true (chỉ cần `KHAU_LENH` của Task 1) · phục vụ E10, E10b, và khoá cmd của mọi eval

**Files:**
- Modify: `dieu-phoi/scripts/mau/LUAT.md` (khối `<!-- <<<LUAT-TIN -->` … `<!-- LUAT-TIN>>> -->`: bảng thang chín nấc 9 hàng · bảng «làm gì — máy làm gì thay» · luật vòng mở · «Phải HỎI» / «Không hỏi» chép §4.5 hạt giống · ba lệnh thường dùng)
- Modify: `dieu-phoi/README.md` (mục «Giao tiếp giữa các phiên» + bốn giới hạn đã khai của hợp đồng)
- Modify: `_acceptance/config.yaml` (THÊM hai khoá, mỗi khoá một dòng chú thích «Hồ sơ vong-mo-co-chu-giu (GT1)»)
- Modify: `tests/dieu-phoi/tin.test.mjs`

**Interfaces:**
- Consumes: `KHAU_LENH`.
- Produces: `executors.test.dieu_phoi_tin` = `bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/tin.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - GT-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -'` · `executors.script.dieu_phoi_tin_kenh_that` = `node tests/dieu-phoi/tin-kenh-that.mjs`.

- [ ] **Step 1: Viết ca GT-10 luat-tin** — tập khẩu lệnh rút từ khối bằng `KHAU_LENH` (9); bảng thang rút đúng 9 hàng nấc 0–8; câu then chốt luật vòng mở; mọi dòng `tin …` trong khối và README chạy `--help` thoát 0. Ca đỏ them-duyet.
- [ ] **Step 2: Chạy** — Expected: FAIL «khối LUAT-TIN vắng».
- [ ] **Step 3: Viết khối, README, thêm khoá** — khoá config thêm cuối nhóm `executors.test` / `executors.script`, không đổi dòng nào khác (`git diff -U0 _acceptance/config.yaml` chỉ có dòng `+`).
- [ ] **Step 4: Chạy khoá `dieu_phoi_tin` trọn** — Expected: dòng gộp có `ok … GT-01` … `ok … GT-10`, không «not ok», `# fail 0`.
- [ ] **Step 5: Commit** `docs(dieu-phoi): luật giao tiếp chín nấc trong LUAT.md + README; khoá đo GT1`.

---

**Sau Task 8:** đặt `status: implemented` trong hợp đồng, commit, rồi xin vé khoá máy riêng cho lượt chấm S4 (S4 và PR đi SAU RD1, không chen lô M5 — điều phối 17/10).
