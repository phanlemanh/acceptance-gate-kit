# Lệnh chờ khoá bọc nháy — kế hoạch thi công

> **For agentic workers:** chạy tuần tự trong vòng `/feature-loop`.

**Goal:** Dòng lệnh chờ của thợ thoát được với mọi thư mục đợt và mọi tên dãy.

**Architecture:** Hai đổi nhỏ trong `dieu-phoi/scripts`: bọc nháy trong `lenhChoKhoa`, dời bộ nháy sang `nhay.mjs` để lớp lịch
dùng mà không kéo theo đồ của hook.

**Tech Stack:** Node 24, `node:test`, shell và `jq` thật trong ca đo.

**Spec:** `docs/superpowers/specs/2026-11-10-lenh-cho-khoa-nhay-duong-dan-design.md`

## Global Constraints

- `nhay.mjs` chỉ import `./` hoặc `node:` (gói chép phẳng vào `<thư mục đợt>/loi/`).
- Đường an toàn và tên dãy thường cho đúng từng byte dạng cũ (AC-5).
- `nhayDon` của `phan-loai-s4.mjs` giữ nguyên, khác nghĩa.

## Review Focus

- Thư mục đợt có ký tự lạ ngoài bảng chín phần tử: `nhayDoiSo` bọc mọi thứ ngoài lớp an toàn, ca KN-3 phủ các lớp nguy hiểm.
- Đợt thật chạy từ bản lõi: KN-4 đi qua `chepLoi`.
- Thợ chạy lệnh trong `zsh`: ca đo chạy `zsh` khi máy có.

---

### Task 1: Ca đo đỏ trước

**Files:**
- Create: `tests/dieu-phoi/lenh-cho-khoa-nhay-duong-dan.test.mjs`
- Modify: `_acceptance/config.yaml` (khoá `executors.script.kn_dieu_phoi`)

- [ ] **Step 1:** Commit tệp ca trên mã cũ.
- [ ] **Step 2:** Chạy `node --test tests/dieu-phoi/lenh-cho-khoa-nhay-duong-dan.test.mjs`. Mong đợi: KN-1 đỏ «lệnh chờ không thoát»,
  KN-6-bang xanh. Phục vụ E1..E7. `independent: false`.

### Task 2: Bọc nháy và dời bộ nháy

**Files:**
- Create: `dieu-phoi/scripts/nhay.mjs` (`nhayDon(s: string): string`, `nhayDoiSo(s: string): string`, `KY_TU_AN_TOAN`)
- Modify: `dieu-phoi/scripts/lich.mjs:8-9`, `dieu-phoi/scripts/hook-chan-s4.mjs:20-23`

**Interfaces:** Produces `lenhChoKhoa(thuMuc, phien, loai)`, chữ ký không đổi.

- [ ] **Step 1:** Dời hai hàm và hằng sang `nhay.mjs`, hook import lại.
- [ ] **Step 2:** `lenhChoKhoa` bọc đường khoá bằng `nhayDoiSo`, vị từ bằng `` nhayDoiSo(`.phien==${JSON.stringify(phien)}`) ``.
- [ ] **Step 3:** Chạy `node --test --test-reporter=tap tests/dieu-phoi/lenh-cho-khoa-nhay-duong-dan.test.mjs`. Mong đợi: `# fail 0`.
  Phục vụ E1..E7. `independent: false`.
- [ ] **Step 4:** Chạy `bash -c 'node --test "tests/dieu-phoi/**/*.test.mjs"'`. Mong đợi: `# fail 0`.
- [ ] **Step 5:** Commit.
