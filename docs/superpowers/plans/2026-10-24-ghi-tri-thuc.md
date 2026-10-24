# Kế hoạch thi công — ghi-tri-thuc (TT2)

Hợp đồng: `_acceptance/ghi-tri-thuc/contract.md` (duyệt 24/10). Thiết kế: `docs/superpowers/specs/2026-10-24-ghi-tri-thuc-design.md`.
Bốn việc nối tiếp — mỗi việc dùng vật của việc trước, không việc nào chạy song song.

## T1 — Khuôn: khối năm loại nguồn, bộ nạp đọc thêm khối

- Files: `skills/acceptance/references/tri-thuc-template.md` (thêm khối `TRI-THUC-NGUON`), `scripts/tri-thuc.mjs`
  (`napKhuon` trả thêm `raw` — khuôn `nguon.md` — `luat` và `nguon`; không đổi hành vi lint).
- Verify: `node tests/scripts/kho-tri-thuc-va-lint.test.mjs` vẫn xanh.
- Phục vụ: E1, E2. `independent: false`.

## T2 — Bên ghi `scripts/tri-thuc-ghi.mjs`

- Files: `scripts/tri-thuc-ghi.mjs` (mới).
- Thứ tự trong lệnh: đọc khối → giải gốc (mã 3) → kiểm đối số và loại nguồn → kiểm riêng tư (mã 4) → so raw đã có →
  ghi → commit (hỏng thì hoàn lại) → in đường trỏ. Không byte nào ghi trước khi mọi kiểm xong.
- Verify: chạy tay một lần trên kho thử tạm, lint TT1 xanh trên kết quả.
- Phục vụ: E1–E9. `independent: false`.

## T3 — Bài kiểm `tests/scripts/ghi-tri-thuc.test.mjs`

- Files: tệp test mới; `_acceptance/config.yaml` thêm khoá `executors.test.ghi_tri_thuc`.
- Ca GT-1..GT-10 theo `evals.yaml`; mỗi ca đỏ có chiều xanh trước trên cùng đầu vào; mutant là bản sao bên ghi trong thư
  mục tạm với nhát tiêm khớp đúng một lần; `gh` giả là tệp thực thi đầu `PATH` ghi đối số ra tệp.
- Verify: tệp test thoát 0; mỗi mutant được kiểm đã áp.
- Phục vụ: E1–E10. `independent: false`.

## T4 — Lệnh `/tri-thuc:ghi`

- Files: `tri-thuc/commands/ghi.md` (khối `TT-GHI-LENH`, bảng mã thoát 0 · 2 · 3 · 4), `tri-thuc/README.md`,
  mô tả gói trong `.claude-plugin/marketplace.json`.
- Verify: ca GT-10; `bash tests/plugins/run-tests.sh` xanh.
- Phục vụ: E10, E10b. `independent: false`.
