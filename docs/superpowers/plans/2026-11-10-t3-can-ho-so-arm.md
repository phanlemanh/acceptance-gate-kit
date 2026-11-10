# Plan: t3-can-ho-so-arm

> **For agentic workers:** thực thi tuần tự trong phiên chính theo `superpowers:executing-plans`. Mọi task `independent: false`: cùng sửa một script và một tệp ca. Các bước dùng checkbox.

**Goal:** Bản vá đã có trên nhánh khớp đúng hợp đồng đã duyệt: lời báo mới, miễn theo đỉnh nhánh đích, đủ ca đo E1–E9.

**Architecture:** Vật đã có ở `scripts/pre-merge-check.sh` (hàm `t3_co_ho_so_arm`, nhánh `T3-CAN-HO-SO-GUARD`). Plan này chỉ sửa hai điểm trong vật, bổ sung ca vào `tests/scripts/t3-can-ho-so-arm.test.mjs`, và dựng hai phép đo còn thiếu dưới `_acceptance/t3-can-ho-so-arm/rang/`.

**Tech Stack:** bash, node (`node:test` không dùng; tệp ca tự chạy theo khuôn `ca(tên, fn)`), git.

**Spec:** `_acceptance/t3-can-ho-so-arm/design.md`, `contract.md`, `evals.yaml`.

## Global Constraints

- Thông điệp mới, đúng nguyên văn: `no record in it is judged by the gate`.
- Điều kiện miễn đọc đỉnh nhánh đích `$BASE_SHA`, không đọc merge-base.
- So với `v2.38.0`, `scripts/pre-merge-check.sh` chỉ được thêm dòng (bộ kiểm additive-only).
- Tệp ca không chứa chữ `signed-off` (RT13); dùng `implemented`.
- Ca `-do` phải đỏ trên `v2.38.0` vì `pre-merge-check: clean` (E9), riêng HA20-do. Ca ngoài khuôn đó đặt hậu tố `-bien`.
- Không đẩy nhánh, không cắt mốc, không ghi vào kho tiêu thụ. Không dữ liệu cá nhân thật trong fixture: `[Tên]`.
- Commit tiếng Việt theo Conventional, kết bằng dòng `Co-Authored-By` của phiên.

## Review Focus

Các ca do hợp đồng ngầm định, không eval nào nêu tên. Mỗi dòng có ca tương ứng ở Task 3.

1. `--base` trỏ tới ref không tồn tại: không được coi là lần cài kit để miễn, không được ra `clean` (HA27-bien).
2. PR có nhiều hồ sơ, không hồ sơ nào được tính: lời báo nêu đủ từng hồ sơ với lý do riêng (HA28-bien).
3. Thư mục hồ sơ có khoảng trắng trong tên: không làm đứt vòng duyệt, không ra `clean` (HA29-bien).
4. PR xoá `contract.md` của một hồ sơ cũ: hồ sơ bị xoá không được tính (HA30-bien).
5. Hồ sơ lồng dưới thư mục con `sub/_acceptance/feat/contract.md`: không được tính, không ra `clean` (HA31-bien).

---

### Task 1: Đổi lời báo (phục vụ E1–E7) · `independent: false`

**Files:** Modify `tests/scripts/t3-can-ho-so-arm.test.mjs` (hằng `MSG`, chuỗi trong `chan`), `scripts/pre-merge-check.sh` (dòng VIOLATION của nhánh `T3-CAN-HO-SO-GUARD`), `README.md` (đoạn known-limit nếu trích câu cũ).

**Interfaces:** Produces `MSG = 'no record in it is judged by the gate'`; dòng báo: `VIOLATION [PR]: T3 paths (t3_paths) changed and the PR touches _acceptance/, but no record in it is judged by the gate — critical code changed and no rule judged it. Changed:`.

- [ ] Đổi `MSG` và chuỗi trong `chan`.
- [ ] Chạy `bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA1-do HA2-do`. Mong đợi: exit 1, `FAIL` với `thiếu thông điệp`.
- [ ] Đổi dòng VIOLATION trong script.
- [ ] Chạy `node tests/scripts/t3-can-ho-so-arm.test.mjs`. Mong đợi: `Results: 20 passed, 0 failed`.
- [ ] Commit `fix(pre-merge): lời báo không hứa hồ sơ gắn với đúng tệp`.

### Task 2: Miễn theo đỉnh nhánh đích (phục vụ E6) · `independent: false`

**Files:** Modify `tests/scripts/t3-can-ho-so-arm.test.mjs` (`F.nhanhCuTuThemConfig`, ca `HA24-do`, hằng `KIM_CAI_KIT`), `scripts/pre-merge-check.sh` (dòng `T3-CAI-KIT-GUARD`).

**Interfaces:** Produces `F.nhanhCuTuThemConfig()`: commit gốc không có config; nhánh `pr` cắt từ đó, đổi `core/k.js` và tự thêm `_acceptance/config.yaml`; `basepoint` đi tiếp một commit thêm config.

- [ ] Viết `HA24-do`: `chan(luoi(F.nhanhCuTuThemConfig()), 'không có thư mục hồ sơ nào trong PR')`, ghi thêm khẳng định bản chưa sửa cho `clean` bằng chính ca đỏ ở bước sau.
- [ ] Chạy `bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA24-do`. Mong đợi: exit 1, `muốn thoát 1, được 0 … pre-merge-check: clean`.
- [ ] Đổi điều kiện: chỉ miễn khi `$BASE_SHA^{commit}` đọc được và `$BASE_SHA:./_acceptance/config.yaml` không có. Bỏ biến `_t3_mb`. Cập nhật `KIM_CAI_KIT` đúng dòng mới.
- [ ] Chạy `bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA14-im HA19-mut HA24-do`. Mong đợi: `Results: 3 passed, 0 failed`.
- [ ] Commit `fix(pre-merge): miễn lần cài kit đọc đỉnh nhánh đích`.

### Task 3: Bổ sung ca và đột biến (phục vụ E3, E4) · `independent: false`

**Files:** Modify `tests/scripts/t3-can-ho-so-arm.test.mjs`.

**Interfaces:** Consumes `chan`, `sach`, `luoi`, `banSaoMay`, `kho` hiện có. Produces hàm `kim(lyDo)`: tiêm rỗng vào đúng dòng gán `ly=` của lý do đó, neo khớp đúng một lần.

- [ ] Ca chặn, mỗi ca một fixture mới:
  `HA21-do` lý do `feat: hồ sơ đã cho nghỉ` (dòng nghỉ phải được `hoSoNghi` của `lib/workspace-record.cjs` nhận là nghỉ, kiểm ngay trong fixture) ·
  `HA22-do` hồ sơ cũ chỉ đổi `opportunity.md`, lý do `cu: chỉ đổi tệp chữ` ·
  `HA23-do` T2 làn V, không chữ ký, lý do `feat: hạng T2 chưa có chữ ký người`.
- [ ] Ca im: `HA25-im` T3 `draft`, `HA26-im` T3 `approved`: thoát 1, có `status chưa arm cổng`, không có `VIOLATION [PR]`.
- [ ] Đột biến trên CÙNG fixture: `HA3-mut`, `HA4-mut`, `HA5-mut`, `HA6-mut`, `HA20-mut`, `HA21-mut`. Mỗi ca: bản chưa tiêm phải chặn đúng lý do, bản đã tiêm không còn lý do đó trong đầu ra.
- [ ] Năm ca biên ở Review Focus: mỗi ca khẳng định không ra `pre-merge-check: clean`; HA28-bien khẳng định đủ cả hai dòng lý do, HA29-bien khẳng định có tên thư mục. Ca nào lộ lỗi thì sửa vật theo hướng chặn và ghi một dòng `fix` vào sổ.
- [ ] Chạy `bash _acceptance/t3-can-ho-so-arm/rang/chay-ca.sh HA3-do HA4-do HA5-do HA6-do HA20-do HA21-do HA22-do HA23-do HA3-mut HA4-mut HA5-mut HA6-mut HA20-mut HA21-mut`. Mong đợi: `Results: 14 passed, 0 failed`.
- [ ] Chạy `node tests/scripts/t3-can-ho-so-arm.test.mjs`. Mong đợi: `0 failed`.
- [ ] Commit `test(pre-merge): đủ các dạng hồ sơ không được chấm và đột biến từng lý do`.

### Task 4: Đo trên kho thật (phục vụ E8) · `independent: false`

**Files:** Create `_acceptance/t3-can-ho-so-arm/rang/ds-pr.json`, `_acceptance/t3-can-ho-so-arm/rang/vi-phan-kho.mjs`.

**Interfaces:** `ds-pr.json`: `{"san":{"code_thuong":20,"duoi_t3_co_chu_ky":10,"cai_kit":2,"t3_khong_ho_so":5,"so_kho":5},"pr":[{"kho","tip","base","nhom","chan_them":true|false}]}`. `vi-phan-kho.mjs`: thoát 0 khi đúng hết, 1 kèm tên PR lệch, 2 khi dưới sàn. Gốc các kho: `KHO_GOC`, không có thì thư mục cha của checkout chính, suy từ `git rev-parse --path-format=absolute --git-common-dir`.

- [ ] Chép 48 PR từ số đo đã có, viết từ dữ kiện lịch sử: 27 code thường, 12 dưới T3 có chữ ký, 2 cài kit, 7 T3 không hồ sơ được chấm. Không tính kết quả bằng hàm của luật.
- [ ] Viết `vi-phan-kho.mjs`: bản gốc dựng trọn thư mục bằng `git archive v2.38.0`; đọc kho bằng clone `--local --no-checkout` vào thư mục tạm; không ghi vào kho nào; in mẫu số từng nhóm.
- [ ] Đối chứng cùng danh sách: chạy với bản sao đã gỡ luật. Mong đợi: exit 1, nêu tên PR đầu tiên lệch.
- [ ] Chạy `node _acceptance/t3-can-ho-so-arm/rang/vi-phan-kho.mjs`. Mong đợi: exit 0, mẫu số đạt sàn.
- [ ] Đối chứng mù: `KHO_GOC` trỏ thư mục rỗng. Mong đợi: exit 2.
- [ ] Commit `test(pre-merge): đo lại danh sách PR đã chốt trên các kho thật`.

### Task 5: Chứng minh chiều đỏ (phục vụ E9) · `independent: false`

**Files:** Create `_acceptance/t3-can-ho-so-arm/rang/chieu-do.sh`.

**Interfaces:** Biến `CHIEU_DO_REF`, mặc định `v2.38.0`. Thoát 0 khi đúng, 1 kèm tên ca sai, 2 khi không có ref.

- [ ] Viết `chieu-do.sh`: dựng trọn cây từ `git archive "$CHIEU_DO_REF"`, chép tệp ca mới vào cây đó, chạy từng ca `-do`; mọi ca phải `FAIL` với `pre-merge-check: clean`, riêng HA20-do ghim `thiếu thông điệp`; kiểm `run-tests.sh` còn `check GPM13 0` và `nothas GPM13a`.
- [ ] Đối chứng: `CHIEU_DO_REF=HEAD`. Mong đợi: exit 1, nêu ca đầu tiên không đỏ.
- [ ] Đối chứng mù: `CHIEU_DO_REF=khong-co`. Mong đợi: exit 2.
- [ ] Chạy `bash _acceptance/t3-can-ho-so-arm/rang/chieu-do.sh`. Mong đợi: exit 0.
- [ ] Commit `test(pre-merge): chứng minh các ca chặn từng lọt trên bản cũ`.

### Task 6: Khép S3 (phục vụ mọi eval) · `independent: false`

**Files:** Modify `_acceptance/t3-can-ho-so-arm/contract.md` (`status`, mục Notes nêu ca HA1…HA31), `_acceptance/config.yaml` nếu khoá `t3ha_e1…e9` chưa trỏ đúng lệnh, `PRODUCT-MAP.md`, `LO-TRINH.html` (máy sinh).

- [ ] Chạy từng khoá `executors.script.t3ha_e1…e9`. Mong đợi: exit 0.
- [ ] Chạy `bash tests/scripts/run-tests.sh`, `bash tests/plugins/run-tests.sh`, và bộ additive-only. Mong đợi: xanh, riêng XD-6 chập chờn đã khai ngoài phạm vi.
- [ ] Đặt `status: implemented`, vẽ lại bản đồ, commit, dispatch Workflow S4 trong cùng lượt.
