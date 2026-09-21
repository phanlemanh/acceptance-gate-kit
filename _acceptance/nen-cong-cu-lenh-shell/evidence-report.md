---
schema_version: 2
feature_slug: nen-cong-cu-lenh-shell
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 41b949dec2245c147ff1460ba6e70e41e5fbb6df
human_signoff: Phan Le Manh 2026-09-19 — ký với 6 known-limits đã khai (Ngoài-1/2/3/5/8/9) và 3 mục mở hợp đồng mới (Ngoài-4/6/7: răng rang-khuon.sh kết luận chiều đỏ chỉ từ exit khác 0); đồng ý phạm vi đã cắt; phê hết quyết định ghi sau Cổng Phạm vi
---

# Evidence Report: nen-cong-cu-lenh-shell

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nen-cong-cu-lenh-shell-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ncc_cong_cu_tu_dau
  verified_at: 2026-09-19T03:00:00Z
  output: |
      PASS: NEN-TD6 chuoi nguyen van crm@onehub — sau va 0 bullet, ban dot bien ghim «THIEU ${CLAUDE_PLUGIN_ROOT:-$(node»

    Results: 19 passed, 0 failed (duong-nen)

- eval: E2
  run_id: minted-nen-cong-cu-lenh-shell-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ncc_cong_cu_tu_dau
  verified_at: 2026-09-19T03:00:00Z
  output: |
      PASS: NEN-TD6 chuoi nguyen van crm@onehub — sau va 0 bullet, ban dot bien ghim «THIEU ${CLAUDE_PLUGIN_ROOT:-$(node»

    Results: 19 passed, 0 failed (duong-nen)

- eval: E3
  run_id: minted-nen-cong-cu-lenh-shell-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ncc_cong_cu_tu_dau
  verified_at: 2026-09-19T03:00:00Z
  output: |
      PASS: NEN-TD6 chuoi nguyen van crm@onehub — sau va 0 bullet, ban dot bien ghim «THIEU ${CLAUDE_PLUGIN_ROOT:-$(node»

    Results: 19 passed, 0 failed (duong-nen)

- eval: E4
  run_id: minted-nen-cong-cu-lenh-shell-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ncc_cong_cu_tu_dau
  verified_at: 2026-09-19T03:00:00Z
  output: |
      PASS: NEN-TD6 chuoi nguyen van crm@onehub — sau va 0 bullet, ban dot bien ghim «THIEU ${CLAUDE_PLUGIN_ROOT:-$(node»

    Results: 19 passed, 0 failed (duong-nen)

- eval: E5
  run_id: minted-nen-cong-cu-lenh-shell-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ncc_cong_cu_tu_dau
  verified_at: 2026-09-19T03:00:00Z
  output: |
      PASS: NEN-TD6 chuoi nguyen van crm@onehub — sau va 0 bullet, ban dot bien ghim «THIEU ${CLAUDE_PLUGIN_ROOT:-$(node»

    Results: 19 passed, 0 failed (duong-nen)

- eval: E6
  run_id: minted-nen-cong-cu-lenh-shell-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ncc_cong_cu_tu_dau
  verified_at: 2026-09-19T03:00:00Z
  output: |
      PASS: NEN-TD6 chuoi nguyen van crm@onehub — sau va 0 bullet, ban dot bien ghim «THIEU ${CLAUDE_PLUGIN_ROOT:-$(node»

    Results: 19 passed, 0 failed (duong-nen)

- eval: E7
  run_id: minted-nen-cong-cu-lenh-shell-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ncc_khuon_bon_chan
  verified_at: 2026-09-19T03:00:00Z
  output: |
    PASS: KH1 o cong_cu mang du hai ve cua luat tu-dau
    PASS: KH2 ban go ve lam chinh ham kiem do (va ban dot bien khac ban goc)

- eval: E8
  run_id: minted-nen-cong-cu-lenh-shell-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ncc_hoi_quy_nen
  verified_at: 2026-09-19T03:00:00Z
  output: |
    Results: 19 passed, 0 failed (duong-nen)
    PASS: HQ1 du 13 ca cu va 6 ca moi co mat bang TEN
    PASS: HQ2 so dong PASS NEN dung bang 19

- eval: E9
  run_id: minted-nen-cong-cu-lenh-shell-E9-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ncc_cong_cu_tu_dau
  verified_at: 2026-09-19T03:00:00Z
  output: |
      PASS: NEN-TD6 chuoi nguyen van crm@onehub — sau va 0 bullet, ban dot bien ghim «THIEU ${CLAUDE_PLUGIN_ROOT:-$(node»

    Results: 19 passed, 0 failed (duong-nen)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-nen-cong-cu-lenh-shell-SUITE-bash_tests_scripts_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-19T03:00:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-nen-cong-cu-lenh-shell-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-19T03:00:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-nen-cong-cu-lenh-shell-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r1
  exit_code: 0
  verified_at: 2026-09-19T03:00:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-nen-cong-cu-lenh-shell-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-09-19T03:00:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-nen-cong-cu-lenh-shell-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 0
  verified_at: 2026-09-19T03:00:00Z

## Known limits

- Ngoài-1 · Ngoài-2 · Ngoài-3 · Ngoài-5 · Ngoài-8 · Ngoài-9 — người ký nhận là giới hạn đã biết, ship như hiện tại; chi tiết từng mục ở `## Notes` của contract.md.
- Ngoài-4 · Ngoài-6 · Ngoài-7 — KHÔNG ghi Known limits: người ký chọn mở hợp đồng mới cho lớp «răng kết luận đỏ chỉ từ mã thoát».

## Ngoài hợp đồng

- **[t1] HIGH** · `feature-loop/scripts/duong-nen.mjs`:178 — Chân cong_cu bỏ tra nhưng vẫn khai «xanh» trong duong-nen.md — lệch nếp bo-qua của chân luoi/engine
  - Người dùng thấy gì: Khi mọi lệnh cấu hình trong một dự án dùng biến môi trường để dựng đường dẫn, công cụ có thể báo trạng thái 'ổn' dù chưa thực sự kiểm tra được công cụ nào — người duyệt cần biết đây là giới hạn đã biết, không phải bằng chứng đầy đủ.
  - Vì sao ngoài hợp đồng: AC-1 tự nó yêu cầu chân cong_cu là XANH (không phải 'bo-qua') khi từ đầu là phép thay thế shell, và giới hạn 'chân suite không bù cho khoá ngoài suite_keys' đã được Out of scope mục 3 và Notes khai rõ là đã biết — nên finding này là phê bình thiết kế hợp đồng, không phải một AC thất bại.
  - Máy đề nghị: known-limits
- **[t2] MEDIUM** · `feature-loop/scripts/duong-nen.mjs`:163 — Vị từ tenChuongTrinh bỏ sót tilde — cùng lớp báo động giả vẫn còn theo chính thước POSIX §2.6 hợp đồng viện dẫn
  - Người dùng thấy gì: Một lệnh dùng dấu ngã (~) để trỏ tới thư mục cá nhân vẫn có thể bị báo thiếu công cụ dù công cụ đó thực sự có trên máy.
  - Vì sao ngoài hợp đồng: AC-1 liệt kê cụ thể các hình dạng được công nhận (${…}, $(…), biến trích dẫn ngược, $VAR) và không nhắc tới dấu ngã ~; Coverage Trục A cũng không có ô tilde, nên đây là một hình dạng ngoài phạm vi AC đã liệt kê, không phải một AC thất bại.
  - Máy đề nghị: known-limits
- **[t3] LOW** · `_acceptance/nen-cong-cu-lenh-shell/evals.yaml`:116 — E8 khai sai về chi phí chạy: răng hồi quy CÓ thêm một lượt chạy trọn tệp ca
  - Người dùng thấy gì: Một ghi chú nội bộ về chi phí kiểm thử không khớp với thực tế; điều này không ảnh hưởng tới tính năng người dùng thấy, chỉ có thể làm số liệu chi phí máy trong hồ sơ nội bộ bị lệch.
  - Vì sao ngoài hợp đồng: Không AC nào trong hợp đồng ràng buộc số lượt chạy hay chi phí máy của eval; đây là sai lệch giữa lời khai nội bộ trong evals.yaml và chi phí thật, không phải hành vi sản phẩm mà AC-1..AC-9 mô tả.
  - Máy đề nghị: known-limits
- **[t4] HIGH** · `_acceptance/nen-cong-cu-lenh-shell/rang-khuon.sh`:40 — Răng KH2 kết luận «đỏ» chỉ từ exit≠0 — bước tiêm hỏng vẫn cho màu xanh
  - Người dùng thấy gì: Một phép kiểm tra tự động cho quy tắc mới có thể báo 'đạt' ngay cả khi bước giả lập lỗi bị hỏng và chưa từng thực sự chạy — nghĩa là kết quả 'đạt' đó có thể không đáng tin như báo cáo thể hiện.
  - Vì sao ngoài hợp đồng: Đây là lỗ hổng trong cách eval của AC-7 tự chấm mình (assertion chỉ dựa mã thoát), không phải bằng chứng rằng nội dung khuôn ở AC-7 sai lệch — chưa đủ chắc chắn AC nào thất bại nên mặc định ngoài hợp đồng.
  - Máy đề nghị: new-contract
- **[t5] LOW** · `_acceptance/nen-cong-cu-lenh-shell/evals.yaml`:116 — E8 khai «không thêm lượt chạy nào cho cùng tệp ca» — răng hồi quy tự chạy lại trọn tệp ca
  - Người dùng thấy gì: Một ghi chú nội bộ về chi phí kiểm thử không khớp với thực tế; không ảnh hưởng tính năng người dùng, chỉ có thể làm số liệu chi phí máy trong hồ sơ nội bộ bị lệch.
  - Vì sao ngoài hợp đồng: Cùng lý do với t3: không AC nào ràng buộc số lượt chạy hay chi phí máy của eval, đây là sai lệch tài liệu nội bộ chứ không phải hành vi sản phẩm được đặc tả trong Criteria.
  - Máy đề nghị: known-limits
- **[t6] HIGH** · `_acceptance/nen-cong-cu-lenh-shell/rang-khuon.sh`:40 — Assertion âm-tính-một-mình: KH2 kết luận từ «exit khác 0», vứt thông điệp — bước gỡ-vế hỏng vẫn cho XANH (đã tái lập)
  - Người dùng thấy gì: Một phép kiểm tra tự động cho quy tắc mới có thể báo 'đạt' ngay cả khi bước giả lập lỗi bị hỏng và chưa từng thực sự chạy — nghĩa là kết quả 'đạt' đó có thể không đáng tin như báo cáo thể hiện.
  - Vì sao ngoài hợp đồng: Đây là finding trùng lớp với t4 (cùng dòng, cùng cơ chế) về độ tin cậy của chính eval AC-7, không phải bằng chứng một AC trong Criteria thất bại; mặc định ngoài hợp đồng theo luật không suy diễn AC gần giống.
  - Máy đề nghị: new-contract
- **[t7] MEDIUM** · `_acceptance/nen-cong-cu-lenh-shell/rang-khuon.sh`:36 — Ma trận thiếu toàn phần: lớp «ĐỦ hai vế» chỉ có MỘT bản đột biến gỡ cả hai — nhánh return 5 («stderr») không lần nào được chạy đỏ
  - Người dùng thấy gì: Một nhánh của quy tắc mới (thông báo qua kênh lỗi khi bỏ qua) hiện không có phép kiểm tra nào bảo đảm nó không âm thầm hỏng trong tương lai.
  - Vì sao ngoài hợp đồng: Không AC nào yêu cầu ma trận đột biến đầy đủ cho từng vế của thông điệp khuôn; đây là khoảng trống về độ bao phủ của eval AC-7, không phải một AC trong Criteria bị vi phạm.
  - Máy đề nghị: new-contract
- **[t8] LOW** · `tests/scripts/duong-nen.test.mjs`:364 — Đối chứng dương của NEN-TD5 chạy trên BẢN CHÉP KHÁC với bản bị tiêm — trái đúng lời chính ca và E6 khai «HAI lượt trên CÙNG một bản chép»
  - Người dùng thấy gì: Một phép kiểm chứng nội bộ dùng để loại trừ báo lỗi giả không so sánh đúng hai lượt trên cùng một bản sao, nên hiện tại thiên về báo lỗi oan hơn là bỏ sót lỗi thật — rủi ro thực tế thấp.
  - Vì sao ngoài hợp đồng: Đây là lỗi trong cách ca kiểm thử tự chứng minh chính nó (đối chứng dương chạy trên bản sao khác bản bị tiêm), không phải bằng chứng một AC trong Criteria (AC-1..AC-9) thất bại trên sản phẩm thật.
  - Máy đề nghị: known-limits
- **[t9] LOW** · `tests/scripts/duong-nen.test.mjs`:390 — Chiều xanh của NEN-TD6 kết luận từ «0 bullet» mà không kiểm lượt chạy có ra tệp/chân xanh — vắng đối chứng cùng lượt
  - Người dùng thấy gì: Một phép kiểm nội bộ cho bản vá có thể báo 'đã sửa xong' ngay cả khi lượt chạy thử không sinh ra kết quả nào để so sánh, thay vì thực sự xác nhận bản vá hoạt động.
  - Vì sao ngoài hợp đồng: Đây là khoảng hở trong logic tự kiểm của một ca test nội bộ, không phải bằng chứng rằng sản phẩm thật vi phạm AC-1..AC-9; ca vẫn có thể đỏ ở nhánh đột biến khác nên chưa chắc chắn AC nào thất bại.
  - Máy đề nghị: known-limits

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1-E9 và toàn bộ lệnh suite hồi quy PASS ngay từ lượt chấm đầu tiên — không có vòng vá lại nào trong round này.

### Re-pin lần 1 — 2026-09-21, do chiến dịch ghim lại theo mốc 2.18.0
run_id: repin-20260921T175037Z-33397
sha: 41b949dec2245c147ff1460ba6e70e41e5fbb6df · suites: 5 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng
