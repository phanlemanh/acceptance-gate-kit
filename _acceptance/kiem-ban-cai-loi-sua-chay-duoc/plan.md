# Kế hoạch — kiem-ban-cai-loi-sua-chay-duoc

Thiết kế: `design.md` · hợp đồng: `contract.md` · eval: `evals.yaml`. Mọi task tuần tự (cùng một tệp vật), TDD: commit
ca đo đứng trước commit vật.

## Task 1 — ca đo đỏ trước (independent: false)

- Files: `tests/scripts/kiem-ban-cai-loi-sua.test.mjs`, `_acceptance/config.yaml` (thêm khoá
  `executors.test.kiem_ban_cai_loi_sua`).
- Dựng trong thư mục tạm: kho kit thu nhỏ (chợ + `plugin.json` của mọi gói chép từ `git show HEAD:` của kit, tệp mẫu
  `scripts/a.mjs`, `docs/a.md`, `_acceptance/a/x.md`, `LO-TRINH.html`, thẻ `v<số>`), bộ đệm = `git archive <thẻ>`,
  kho tiêu thụ giả + `git worktree add`, sổ cài khuôn `version: 2`.
- Ca KL-1…KL-9 (AC-1…AC-9) — mỗi ca đỏ chạy sau đối chứng dương cùng fixture, ghim thông điệp; lệnh in ra được áp
  bằng vỏ thật.
- Verify: `node tests/scripts/kiem-ban-cai-loi-sua.test.mjs` → FAIL ở các ca của vật mới (đỏ có tên), KL-8-nhay PASS.
- Phục vụ: E1–E9.

## Task 2 — vật (independent: false)

- Files: `scripts/kiem-ban-cai.mjs`.
- Hằng `KHONG_CHAY` + hàm tách lệch mã / lệch không chạy cho `--may`; `giaiRef` nói lệnh lấy thẻ; nhận cây phụ bằng git;
  khối `cay-phu` với lệnh sửa `node -e` (bốn trường, sao lưu); khối `mo-coi` với lệnh dọn; dòng TỔNG KẾT đếm hai khối.
- Verify: `node tests/scripts/kiem-ban-cai-loi-sua.test.mjs` → mọi ca PASS.
- Phục vụ: E1–E9.

## Task 3 — hồi quy đời trước (independent: false)

- Verify: `node tests/scripts/kiem-ban-cai.ca.mjs` (CLI `claude`, cài cách ly) → mọi ca KB PASS; `bash tests/scripts/run-tests.sh`
  các mảnh mjs chứa tệp mới xanh.
- Phục vụ: E10.
