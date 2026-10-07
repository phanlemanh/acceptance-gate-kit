---
schema_version: 1
feature: Lượt chấm S4 không còn bị hạ tầng đốt bởi lệnh dài hơn trần công cụ (eval khai long_running — kit chạy nền, ghi nhật ký đường cố định, chờ bằng lệnh máy sinh) và bởi eval nặng chạy chồng suite (eval trong feature_loop.model_evals chạy riêng, sau mọi lệnh máy khác)
slug: lenh-dai-chay-rieng
owner: phanlemanh@gmail.com
risk_tier: T2               # feature-loop/workflows, feature-loop/scripts, skills/acceptance/references — không chạm t3_paths
surfaces: [cli]
status: approved
veto_state: mo
veto_opened_at: 2026-10-07T01:46:05Z
design_doc: docs/superpowers/specs/2026-10-07-lenh-dai-chay-rieng-design.md
---

# Acceptance Contract: lenh-dai-chay-rieng

Gốc: crm/_acceptance/tro-ly-okr-bo-final-output

## Context

Hồ sơ `tro-ly-okr-bo-final-output` của crm (07/10/2026, feature-loop 2.24.0) mất bốn lượt chấm, cả bốn
vì hạ tầng kit: hai lượt BLOCKED vì tác tử chấm đọc «lệnh bị công cụ đẩy sang nền ở 600 s» thành «bị
giết» (tệp nền trống vì khung bọc của kit chỉ in khi lệnh xong), hai lượt REJECT vì eval gọi model dựng
`eve dev` cùng lúc với suite canh đúng tiến trình đó. Thiết kế ở `design_doc`. Vòng này thêm MỘT khoá eval
(`long_running`) và đọc lại MỘT khoá config có sẵn (`feature_loop.model_evals`); khoá vắng = hành vi 2.24.0.

## Criteria

- AC-1: Given `evals.yaml` có eval `script` khai `long_running: 45`, When chạy `s4-args.mjs`, Then eval đó trong tệp args mang `longRunning: 45` (số), eval không khai KHÔNG có khoá; và When một eval khai mỗi giá trị trong bảng viết trước {`0`, `241`, `2.5`, `abc`, `-3`} (5 ca), Then s4-args thoát 2, thông điệp gọi tên eval và giá trị, KHÔNG sinh tệp — 5/5; đối chứng dương: `1` và `240` sinh tệp; chiều đỏ trên CÙNG fixture: bản sao s4-args bỏ bước kiểm → ca `0` sinh tệp, ghim «long_running sai lọt».
- AC-2: Given args có lệnh mà hai eval khai `longRunning` 20 và 45, và một lệnh không khai, When workflow dispatch lane máy, Then prompt của lệnh dài chứa lệnh khởi chạy ghi nhật ký vào `<repoRoot>/.acceptance-runs/<slug>/s4-lenh-dai/` và lệnh chờ có `HAN_PHUT=45` và `TRAN_LAN` ≤ 110 (dưới trần mặc định 120 s của công cụ), không chứa khung bọc thường; prompt lệnh không khai chứa khung bọc thường và không chứa lệnh chờ; và When args mang `longRunning` hỏng (`0`, `"30"`, `300`), Then BLOCKED `(evals)` gọi tên eval, 0 agent; chiều đỏ: bản sao lấy MIN thay MAX → ghim «HAN_PHUT lệch: 20».
- AC-3: Given lệnh khởi chạy và lệnh chờ RÚT TỪ PROMPT của lane (không viết tay), chạy bằng bash thật trên thư mục tạm với lệnh mẫu in giữa chừng một dòng `__EXIT=0` giả rồi thoát 3, When tác tử giả khởi chạy nền rồi gọi lệnh chờ (trần mỗi lần hạ xuống 1 giây) tới khi hết `__CHUA_XONG`, và khai sai `killedByTool: true, exitCode: 0`, Then ít nhất một lần chờ trả `__CHUA_XONG`, nhật ký nằm ở đường cố định, và workflow kết luận lệnh chạy xong với mã 3 (eval FAIL, không BLOCKED); và When hạn hạ xuống 0 phút với lệnh ngủ dài, Then lệnh chờ trả `__QUA_HAN` và tiến trình CHÁU của lệnh mẫu (pid canh do chính nó ghi) không còn sống; và When lệnh mẫu in `__EXIT=0` giả rồi ngủ dài, tác tử giả dán NGUYÊN VĂN đầu ra lệnh chờ (a) ở `__QUA_HAN` kèm `cannotRun`, (b) ở một lần `__CHUA_XONG` kèm `killedByTool`, Then cả hai ca eval vào `blocked`, không PASS; chiều đỏ: bản sao lệnh chờ đợi dòng `__EXIT=` trong nhật ký thay vì tệp `.xong` → workflow đọc mã 0, ghim «dấu giả kết thúc chờ»; bản sao không che dấu ở đuôi chưa-xong → ghim «dấu giả thắng khi chưa xong»; bản sao chỉ giết pid vỏ → ghim «cây con sống sót sau __QUA_HAN».
- AC-4 (judgment): Given khối marker `TOOL-KILL-RULE` của `skills/acceptance/references/tool-kill-rule.md`, When một tác tử chấm đọc nó lúc công cụ báo lệnh «moved to the background», Then khối nói đủ: đó không phải bị giết và không khai `killedByTool` · tệp nền trống là bình thường và vì sao · chờ bằng lệnh có giới hạn mỗi lần tới dòng `__EXIT=` · trần tổng = `long_running` của eval, vắng thì 30 phút · quá trần thì khai gì và lý do chỉ việc cần làm.
- AC-5: Given `feature_loop.model_evals: [demo/E1, khac/E2, demo/E3]` với E3 của `demo` khai `status: not-run`, When chạy `s4-args.mjs --slug demo`, Then tệp args có `evalsChayRieng: ["E1"]`; khoá config vắng → `evalsChayRieng` VẮNG HẲN; mục sai dạng (`khong-gach`) → thoát 2 với thông điệp của `docKhoa` gọi tên `feature_loop.model_evals`; chiều đỏ (một nguồn): bản sao `lan-khoa.mjs` có `docKhoa` trả tập rỗng → `evalsChayRieng` vắng, ghim «không đọc qua docKhoa».
- AC-6: Given args có hai lệnh eval thường, hai lệnh eval thuộc `evalsChayRieng` và ba lệnh suite, When workflow chạy (agent giả ghi cờ start/end), Then mỗi lệnh chạy-riêng BẮT ĐẦU sau khi MỌI lệnh eval thường và mọi lệnh suite đã KẾT THÚC, hai lệnh chạy-riêng không chồng nhau, dry-run in `commandGroups.chayRieng` đúng hai lệnh đó; một id chạy-riêng trên lệnh trùng lệnh suite → lệnh ở `tuanTu`, không ở `chayRieng`; lệnh vừa chạy-riêng vừa khai `longRunning: 45` (ca crm E6/E7) → bắt đầu sau mọi lệnh khác VÀ prompt mang khung nền `HAN_PHUT=45`, không khung bọc thường; chiều đỏ: bản sao gộp chạy-riêng về nhánh song song → ghim «chạy-riêng chồng lệnh khác»; bản sao nhóm chạy-riêng dùng khung bọc thường → ghim «chạy-riêng mất khung nền».
- AC-7: Given CÙNG một bộ args KHÔNG có `longRunning` lẫn `evalsChayRieng` (eval thường + suite + judgment + ui-check), When chạy workflow của cây đang kiểm và workflow của bản base (`git show v2.24.0:feature-loop/workflows/acceptance-verify.js` — mốc cố định; nguồn base phải KHÁC nguồn cây đang kiểm, trùng → ĐỎ ghim «base trùng cây»; tag không giải được → ĐỎ ghim tên hạ tầng), Then dãy lời gọi agent theo thứ tự (nhãn + prompt) và kết quả (verdict, failedEvals, blocked, runLog) BẰNG HỆT, dry-run BẰNG HỆT, VÀ cả hai đạt kết cục ghim trước (verdict PASS, đủ số lời gọi `machine:` viết trước) — bằng nhau mà kết cục sai là ĐỎ ghim «vi phân rỗng»; chiều đỏ: bản sao coi mọi lệnh eval là chạy-riêng → ghim «thứ tự lệnh đổi».
- AC-8 (judgment): Given `skills/acceptance/references/eval-executors.md`, `GUIDE.md` §7.1, `commands/acceptance-init.md` và `CHANGELOG.md`, When người viết eval ở một kho tiêu thụ đọc chúng, Then họ biết: khoá `long_running` khai gì (số phút tối đa, 1–240), khi nào cần (lệnh dài hơn ~9 phút), kit làm gì với nó (nhật ký ở `.acceptance-runs/<slug>/s4-lenh-dai/`, chờ, quá hạn); `model_evals` nay còn làm eval chạy riêng sau mọi lệnh máy khác ở S4; và CHANGELOG có mục chưa phát hành nêu cả hai kèm «khoá vắng = như 2.24.0».

## Coverage

Quét theo khuôn test-matrix (máy tự quét trong phiên, không gọi skill — không gian nhỏ, bốn trục).

| Trục | Giá trị | AC |
|---|---|---|
| A. Khai | không · `long_running` · `model_evals` · cả hai | AC-7 · AC-1/2/3 · AC-5/6 · AC-6 (ca vừa chạy-riêng vừa dài) |
| B. Lệnh | eval riêng · nhiều eval chung lệnh · trùng lệnh suite | AC-2 (max) · AC-6 (suite thắng) |
| C. Kết cục lệnh dài | xong · chưa xong · quá hạn · dấu giả giữa chừng · dấu giả + chưa xong/quá hạn · tác tử khai sai | AC-3 |
| D. Đường | workflow S4 · phiên VERIFY độc lập · làn ghim lại | AC-2/3/6 · AC-4 (lời) · không đổi (làn đã chạy eval sau suite, không có trần công cụ) |

- Later: suite khai `long_running` (Giới hạn đã khai, có ngưỡng); baseline/ui-check dùng `BOC_NEN`.
- Never: kit tự đo thời lượng để đoán lệnh dài (cần đồng hồ ngoài workflow — workflow không có Date).

## Out of scope

- Sửa bất cứ gì ở kho crm (thước `do-mo-hinh.mjs` tự ghi nhật ký vẫn chạy được dưới khung mới).
- Làn ghim lại (`repin-lane.mjs`): đã chạy eval nối đuôi sau suite, không chạy qua công cụ có trần.
- Cho suite khai `long_running`; đổi lane baseline/ui-check.

## Notes

- Ghi chú cho mốc mang vòng này: crm khai `long_running: 45` cho `tro-ly-okr-bo-final-output/E6`, `E7` (và mọi eval model dài khác); thước có thể bỏ nhật ký tự ghi nhưng không bắt buộc.
- Known limits: xem «Giới hạn đã khai» ở design doc.
