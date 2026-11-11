# doc-jsx-va-ban-do-hong Implementation Plan

> **For agentic workers:** chạy tuần tự trong vòng chính (T2, hai việc chạm chung một tệp ca đo).

**Goal:** Bước chấm khuôn đọc đúng thuộc tính thẻ có hàm mũi tên; lượt chấm dừng khi tệp bản đồ hỏng làm mất nhóm.

**Architecture:** Bộ quét thẻ mở trong `scripts/ban-do-khuon.cjs` thay biểu thức ở `lechTrongTep`; bộ đọc thêm `mat_nhom`, `s4-args` đọc nó.

**Tech Stack:** Node, không thêm thư viện. **Spec:** `_acceptance/doc-jsx-va-ban-do-hong/design.md`

## Global Constraints

- Không thêm phụ thuộc. CLI `--json` của bộ đọc giữ nguyên hình dạng.

## Review Focus

- Mã JSX có dạng viết lạ: rơi vào «không đo», không báo oan. Đo ở DJ-2, DJ-4.
- Kho tiêu thụ cài gói acceptance-gate đời cũ hơn feature-loop: `bd.mat_nhom` vắng thì lưới đi như cũ.

---

### Task 1: Bộ quét thẻ mở

**Files:** Modify `scripts/ban-do-khuon.cjs` · Create `tests/scripts/doc-jsx-va-ban-do-hong.test.mjs` · Modify `_acceptance/config.yaml`
**Phục vụ:** E1–E5 · `independent: false` · **Verify:** `DJ_CASES=DJ-1,DJ-2,DJ-3,DJ-4,DJ-5 node tests/scripts/doc-jsx-va-ban-do-hong.test.mjs`
**Produces:** `docTheMo(noi, i) → { phang, tuDong, spread } | null`

- [ ] Viết ca DJ-1…DJ-5 cùng các nhát tiêm, chạy thấy đỏ trên mã cũ.
- [ ] Viết bộ quét, thay vòng lặp khe trong `lechTrongTep`, chạy thấy xanh.
- [ ] Commit.

### Task 2: Lưới bản đồ hỏng

**Files:** Modify `scripts/ban-do-khuon.cjs`, `feature-loop/scripts/s4-args.mjs`, `GUIDE.md` · Test: tệp ca đo trên
**Phục vụ:** E6–E8 · `independent: false` · **Verify:** `DJ_CASES=DJ-6,DJ-7,DJ-8 node tests/scripts/doc-jsx-va-ban-do-hong.test.mjs`
**Consumes:** `docThuMuc(root) → { …, mat_nhom: string[] }`

- [ ] Viết ca DJ-6…DJ-8, chạy thấy đỏ.
- [ ] Thêm `mat_nhom` ở bộ đọc, lệnh dừng và dòng báo ở `s4-args`, một câu ở GUIDE, chạy thấy xanh.
- [ ] Commit.
