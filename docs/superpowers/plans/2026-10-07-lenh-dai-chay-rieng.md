# Kế hoạch — lenh-dai-chay-rieng

Hợp đồng: `_acceptance/lenh-dai-chay-rieng/contract.md` · thiết kế: `docs/superpowers/specs/2026-10-07-lenh-dai-chay-rieng-design.md`. T2 — tuần tự trong vòng chính (các task nhỏ, cùng chạm hai tệp lõi).

| # | Việc | Tệp | Kiểm từng task | Phục vụ | independent |
|---|---|---|---|---|---|
| 1 | Workflow: kiểm `longRunning` (fail-loud `(evals)`), `phút(lệnh)=max`, khối marker `LENH-DAI` (`BOC_NEN`, `CHO_NEN`, `TRAN_LAN=100`, che dấu ở đuôi chưa-xong, giết cây khi quá hạn), nhánh prompt trong `agentCuaLenh`; nhóm `cmdChayRieng` từ `args.evalsChayRieng` chạy tuần tự sau song song + suite; dry-run `commandGroups.chayRieng` khi khác rỗng; khai args mới ở đầu tệp | `feature-loop/workflows/acceptance-verify.js` | `node tests/workflows/lenh-dai-chay-rieng.test.mjs` + `bash tests/workflows/run-tests.sh` | E2 E3 E6 E7 | false |
| 2 | Ca đo bên đọc (LD, LN, CR, VP) + sửa kim của `suite-tuan-tu.test.mjs` theo dòng `cmdSongSong` mới | `tests/workflows/lenh-dai-chay-rieng.test.mjs`, `tests/workflows/suite-tuan-tu.test.mjs` | như trên, mỗi chiều đỏ phải đỏ trên bản sao | E2 E3 E6 E7 | false |
| 3 | s4-args: đọc `long_running` (1–240, sai → exit 2), mang `longRunning`; `evalsChayRieng` qua `docKhoa` | `feature-loop/scripts/s4-args.mjs` | `node tests/scripts/s4-args-lenh-dai-chay-rieng.test.mjs` | E1 E5 | false |
| 4 | Ca đo bên viết (SL, SC) | `tests/scripts/s4-args-lenh-dai-chay-rieng.test.mjs` | như trên | E1 E5 | false |
| 5 | Luật TOOL-KILL: dòng «chuyển sang nền ≠ bị giết» | `skills/acceptance/references/tool-kill-rule.md` | `bash tests/workflows/run-tests.sh` (ca ghim từng dòng luật trong prompt ba lane) | E4 | true |
| 6 | Tài liệu: `long_running` ở eval-executors; hàng `model_evals` ở GUIDE §7.1; dòng chú thích trong mẫu acceptance-init; CHANGELOG mục chưa phát hành | `skills/acceptance/references/eval-executors.md`, `GUIDE.md`, `commands/acceptance-init.md`, `CHANGELOG.md` | `bash tests/scripts/run-tests.sh --manh bash` (ca tài liệu/khối marker) | E8 | true |

Mỗi phép đo mới mang cặp hai chiều trên cùng fixture (MEASURE-BIRTH-CLAUSE): đối chứng dương xanh, bản sao bị phá đỏ với thông điệp ghim.
