# Review findings: gia-lan-ghim-lai (round 1)

## Trong hợp đồng

- **A command shared with a real-model eval is still re-run, and the model run is not counted**
  file: `feature-loop/scripts/repin-lane.mjs:335`
  severity: high
  AC: AC-1
  source: bugs
  detail: `rec.model` is set only by the first `runCmd` that runs a command (`const rec = { ..., model, ... }`). On a later cache hit (`if (results.has(k)) ... return results.get(k).exit`), the flag is never upgraded. A suite, or a non-model eval, can share its exact command with an eval listed in `feature_loop.model_evals` (same `full` env tag when `repin_ci_blank_env` is not set). That suite or eval runs first with `model:false`, so `coChayLai` permits a re-run. The model eval then reuses the re-run result. AC-1 says the opposite: «lệnh dùng chung với một eval model thật cũng không» (a command shared with a real-model eval must not be re-run either). This is the 'pick the better of two draws' case the contract forbids. `demModel()` (line 558) filters on `r.model`, so the summary also reports «gọi 0» even though the model was called twice. Reproduced with the fixture: suiteCmd 'sh rang_e1.sh', eval E1 using the same script with a flaky body, config `repin_retry: 1` + `model_evals: [feat/E1]`. Result: the suite runs twice (red, then green), `feat E1: (đã chạy) → exit 0`, LÀN XANH, `[lane] TỔNG KẾT … eval model thật: gọi 0 … chập chờn: 1`. Fix: compute the model flag for every command before running anything, by OR-ing over all evals in model_evals that share the command. Alternatively, upgrade `rec.model` on a cache hit and never re-run a command whose key matches any model eval. No test covers the shared-command case (AC1-model-khong-lai uses a separate command).
  rationale: AC-1 nêu đích danh 'lệnh dùng chung với một eval model thật cũng không' chạy lại; finding tái hiện được chạy lại và đếm model thiếu, trái thẳng AC-1 (và số đếm của AC-4).

- **Hình dạng 5 — ma trận AC-1 thiếu ô «lệnh dùng chung với eval model thật», và vật vi phạm đúng ô đó**
  file: `tests/scripts/repin-lane-chay-lai.test.mjs:61`
  severity: high
  AC: AC-1
  source: measurement
  detail: Contract AC-1 hứa KHÔNG chạy lại khi eval nằm trong `model_evals`, «(lệnh dùng chung với một eval model thật cũng không)». Ma trận viết trước (rang/ma-tran.mjs AC-1, 10 ca) chỉ có AC1-model-khong-lai, ca mà chính eval model là eval duy nhất chạy lệnh. BANG_CHAN_TRI (7 hàng) chỉ quét đầu vào của `coChayLai`, trong khi `laModel` được tính ở phía trên: `rec.model` lấy từ nhãn chạy lệnh ĐẦU TIÊN (repin-lane.mjs:336, runCmd; đường suite song song đặt cứng `model: false` ở :366). Ô dùng chung vì thế không bao giờ được đo. Tôi đã thử bằng gia-lan-fixture: E1 (không model, lệnh chập chờn) và E2 (`model_evals: [feat/E2]`, `sh rang_e1.sh` cùng lệnh), `repin_retry: 1`. Kết quả: thoát 0, lệnh chạy 2 lần, stderr ghi `feat E1 (chạy lại) … exit 0` rồi `feat E2: (đã chạy) → exit 0`. Eval model thật được nhận lượt rút tốt hơn, đúng điều AC-1 cấm. Hệ quả kéo theo: `demModel` (AC-4) cũng đếm thiếu lần chạy model trong ca trộn này, vì fixture khoModel đặt cả ba eval là model nên ca trộn không có mặt.
  rationale: Ô lệnh dùng chung với eval model thật nằm trong chính văn AC-1; ma trận không đo ô đó và vật vi phạm nó, nên AC-1 không được chứng minh và thực sự thất bại (cùng gốc với finding trên).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **GUIDE §7.1 ships a «Gợi ý cho crm» column carrying one consumer repo's product config (eval IDs, env var names, AI Gateway cost command)**
  Người dùng thấy gì: Tài liệu hướng dẫn gửi cho mọi kho đang kèm một cột gợi ý riêng cho một kho cụ thể (tên eval, tên khoá bí mật). Kho khác đọc sẽ thấy cấu hình không phải của mình; không làm hỏng chức năng, chỉ làm tài liệu kém trung lập.
  file: `GUIDE.md`
  severity: medium
  Đề xuất: known-limits

- **model_evals entries are checked for shape only; a typo silently re-runs a real-model eval, the exact case the round forbids**
  Người dùng thấy gì: Nếu kho gõ sai tên một eval gọi model thật khi khai báo, hệ thống không báo lỗi mà vẫn chạy lại eval đó và lấy lượt tốt hơn, tức tự làm đẹp kết quả mà không ai hay. Chỉ xảy ra khi người cấu hình gõ nhầm.
  file: `feature-loop/scripts/lib/lan-khoa.mjs`
  severity: medium
  Đề xuất: known-limits

- **Every lane command now runs under setsid (detached:true), so a group SIGKILL from the calling tool no longer reaches suites; this limit is undeclared**
  Người dùng thấy gì: Nếu công cụ bên ngoài ngắt cứng lượt ghim lại, các tiến trình con có thể chạy sót sau khi lượt đã chết và lượt sau có thể đỏ giả. Giới hạn này cần được ghi rõ cho mọi kho vì nó áp dụng mặc định.
  file: `feature-loop/scripts/lib/chay-lenh.mjs`
  severity: medium
  Đề xuất: known-limits

- **A third inline copy of the «đạt kỳ vọng» rule now decides retries; it can drift from the copies that decide red/green**
  Người dùng thấy gì: Quy tắc 'đạt kỳ vọng' được viết ở ba chỗ, sau này sửa một chỗ quên chỗ khác có thể làm quyết định chạy lại lệch với phán quyết đỏ/xanh. Hiện chưa gây sai kết quả nào.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: wont-fix

- **The repin-do sample in the SKILL template shows `"chap_chon":[]`, contradicting the presence rule stated just below it**
  Người dùng thấy gì: Dòng mẫu trong hướng dẫn cho thấy một mục luôn có mặt dù quy tắc ngay bên dưới nói nó vắng hẳn khi không dùng. Người đọc có thể hiểu sai hình dạng bản ghi, nhưng hệ thống chạy đúng.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **doChiPhi misreads a cost that has a thousands separator, giving a wrong cost delta**
  Người dùng thấy gì: Nếu công cụ đo chi phí in số có dấu phẩy ngăn cách hàng nghìn, con số chênh chi phí trong tổng kết sẽ sai lệch rất lớn mà không báo lỗi. Chỉ ảnh hưởng dòng chi phí đo, không ảnh hưởng đỏ hay xanh của lượt.
  file: `feature-loop/scripts/lib/lan-khoa.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — AC2-B7 chỉ ghim mã thoát 3, không ghim thông điệp; ca vẫn xanh trên BASE-GIA (nơi chưa có cờ)**
  Người dùng thấy gì: Phép thử kiểm tra cờ giới hạn thời gian sai chỉ nhìn kết quả thất bại chung chung, nên không phân biệt được 'giá trị sai bị bắt đúng' với 'cờ chưa tồn tại'. Tính năng chạy đúng, chỉ là bằng chứng kiểm thử yếu hơn mức mong muốn.
  file: `tests/scripts/repin-lane-tran.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — lời hứa «không ghi pin, verified_commit/báo cáo giữ nguyên» được đo trên làn KHÔNG --write, nơi làn vốn không bao giờ ghi**
  Người dùng thấy gì: Phép thử lời hứa 'vượt trần thì không ghi kết quả ghim' chạy ở chế độ vốn không ghi gì, nên một lỗi thật khi chế độ ghi bật có thể lọt mà không phép thử nào bắt. Chưa có bằng chứng lỗi đang xảy ra.
  file: `tests/scripts/repin-lane-tran.test.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
