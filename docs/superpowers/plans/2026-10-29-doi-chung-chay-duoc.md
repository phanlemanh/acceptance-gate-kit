# Kế hoạch — doi-chung-chay-duoc (TC6)

Thiết kế: `docs/superpowers/specs/2026-10-29-doi-chung-chay-duoc-design.md` · hợp đồng: `_acceptance/doi-chung-chay-duoc/contract.md`.
Ba task, tuần tự (task sau dựa trên task trước), chiều đỏ nằm trong lịch sử: commit ca kiểm ĐỨNG TRƯỚC commit vật.

| # | Việc | Tệp | Kiểm từng task | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Ca kiểm trước (đỏ trên bộ chấm hiện tại): bộ rút chung `lenhGhiBaseline`/`kichBanTuLenhGhi`/`dongGhiDung`/`kemGhiDung` ở harness; tệp ca `doi-chung-chay-duoc.test.mjs` (DC1–DC9); hai bộ kiểm làn đối chứng có sẵn rút kịch bản qua bộ rút chung; BW1e ghim lời gọi Bash | `tests/workflows/harness.mjs`, `tests/workflows/doi-chung-chay-duoc.test.mjs`, `tests/workflows/baseline-tran-bo-qua-don.test.mjs`, `tests/workflows/baseline-worktree-co-lap.test.mjs` | `node tests/workflows/doi-chung-chay-duoc.test.mjs` ĐỎ (DC1, DC2, DC3, DC4/5, DC7a, DC8 đỏ; DC6, DC7b xanh — đối chứng bản cũ đúng vật) | E1–E9 | false |
| 2 | Vật: `LENH_GHI_BASELINE` (heredoc có nháy + cksum + `.sai`), `blCksum`, bộ đọc `ghiSai`, nhãn hạ tầng «tác tử chép kịch bản sai», đề bài hai lời gọi Bash | `feature-loop/workflows/acceptance-verify.js` | tệp ca trên XANH trọn tệp; `bash tests/workflows/run-tests.sh` xanh | E1–E9 | false |
| 3 | Thước + bản ghi: chín khoá `executors.script.dccd_*` (chỉ thêm dòng); bản ghi tác tử thật `evidence/tac-tu-that.json` (blob = vật đã commit ở task 2) | `_acceptance/config.yaml`, `_acceptance/doi-chung-chay-duoc/evidence/tac-tu-that.json` | mỗi khoá chạy riêng thoát 0; đột biến một nhãn → khoá ấy thoát 1 | E1–E9 | false |

Cuối S3: chạy bốn suite (scripts · hooks · plugins · workflows) + `product-map --check` trước khi xin khoá s4.
