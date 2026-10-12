---
schema_version: 2
feature_slug: dai-tom-tat-doc-dung
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 900b12c9ef7c7d2c87c8b268bf8339a9eb1df309
human_signoff:
---

# Evidence Report: dai-tom-tat-doc-dung

Round 1. Mọi eval máy (E1–E9, E11) xanh; E10 (judgment) còn UNCERTAIN chờ người. Báo cáo REJECT vì ba lệnh suite hồi quy chạy đỏ mà không gắn eval nào, nên `failed_evals` để rỗng (xem mục «Lệnh suite (hồi quy)» và `## Iterations`).

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | judgment | UNCERTAIN |
| E11 | AC-11 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-dai-tom-tat-doc-dung-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dai_tom_tat
  verified_at: 2026-10-12T02:18:42Z
  output: |
    Results: 24 passed, 0 failed (dai-tom-tat)

- eval: E2
  run_id: minted-dai-tom-tat-doc-dung-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dai_tom_tat
  verified_at: 2026-10-12T02:18:42Z
  output: |
    Results: 24 passed, 0 failed (dai-tom-tat)

- eval: E3
  run_id: minted-dai-tom-tat-doc-dung-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dai_tom_tat
  verified_at: 2026-10-12T02:18:42Z
  output: |
    Results: 24 passed, 0 failed (dai-tom-tat)

- eval: E4
  run_id: minted-dai-tom-tat-doc-dung-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dai_tom_tat
  verified_at: 2026-10-12T02:18:42Z
  output: |
    Results: 24 passed, 0 failed (dai-tom-tat)

- eval: E5
  run_id: minted-dai-tom-tat-doc-dung-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dai_tom_tat
  verified_at: 2026-10-12T02:18:42Z
  output: |
    Results: 24 passed, 0 failed (dai-tom-tat)

- eval: E6
  run_id: minted-dai-tom-tat-doc-dung-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dai_tom_tat
  verified_at: 2026-10-12T02:18:42Z
  output: |
    Results: 24 passed, 0 failed (dai-tom-tat)

- eval: E7
  run_id: minted-dai-tom-tat-doc-dung-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dai_tom_tat
  verified_at: 2026-10-12T02:18:42Z
  output: |
    Results: 24 passed, 0 failed (dai-tom-tat)

- eval: E8
  run_id: minted-dai-tom-tat-doc-dung-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dai_tom_tat
  verified_at: 2026-10-12T02:18:42Z
  output: |
    Results: 24 passed, 0 failed (dai-tom-tat)

- eval: E9
  run_id: minted-dai-tom-tat-doc-dung-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dai_tom_tat_crm
  verified_at: 2026-10-12T02:18:42Z
  output: |
    Results: 2 passed, 0 failed (dai-tom-tat-crm)

- eval: E10
  judged_by: judge panel (3 lens, fresh context) — đề xuất của máy, chưa có chữ người
  verdict: UNCERTAIN
  rationale: Hai trong ba lens không chốt được vế (3) của AC-10: mô tả nói N là «số gạch» Out of scope nhưng mã đếm bằng `contentLines`, hàm nằm ngoài danh sách input của judge; lens spec-alignment còn nêu thêm điểm «cắt giữ trọn câu hoặc mục» so với `catTran` cắt ở khoảng trắng khi đơn vị đầu đã vượt 400.
  panel:
    - domain-correctness: PASS — Bốn điểm hỏi đều khớp với mã, tôi không thấy câu nào mâu thuẫn. (1) Mã chọn câu ô production theo đúng thứ tự tài liệu nêu: dòng `thuc-te` do người ghi, rồi «chưa ghi quan sát production» khi kho không khai nhánh, rồi ba câu «đã triển khai — gộp vào…; chưa ai ghi đã thấy chạy», «chưa gộp vào … (nhánh production kho khai)», «chưa đọc được triển khai ở đây — …». Ô là null chỉ khi không có sổ quyết định và không khai nhánh. (2) Hai nguồn giới hạn, luật lấy nguồn nhiều mục hơn (hoà thì lấy hợp đồng, không cộng) và hai dạng cờ sai khuôn đều trùng chữ với mã. (3) và (4) Chuỗi «N mục để ngoài phạm vi · M giới hạn đã biết» trùng chữ với mã. Câu dẫn «…:» theo sau là danh sách hoặc bảng cho ra mục rút gọn nối « · », cắt giữ trọn đơn vị, kết «…», và `TRAN_VI_SAO = 400`. Chỗ tôi không kiểm được trong hai tệp được phép: N là «số gạch» Out of scope, vì hành vi của `contentLines` nằm ở thư viện ngoài danh sách.
    - operational-feasibility: UNCERTAIN — Các vế (1), (2) và (4) khớp mã: ba nhánh câu production và việc «đã thấy chạy» chỉ lấy từ dòng `thuc-te`; luật nguồn nhiều mục hơn (hoà thì lấy hợp đồng, không cộng) cùng hai dạng cờ Notes sai khuôn; câu dẫn cộng danh sách hoặc bảng nối « · » và trần 400 ký tự. Vế (3) không kiểm được trong phạm vi cho phép: tài liệu nói N là «số gạch Out of scope», nhưng mã chỉ lấy `contentLines(section(...)).length` và `contentLines` nằm ngoài danh sách input. Số «mục» của Known limits trong báo cáo cũng đếm bằng hàm đó.
    - spec-alignment: UNCERTAIN — Các điểm (1) câu ô production, (2) hai nguồn giới hạn cùng luật lấy nguồn nhiều mục hơn và cờ Notes sai khuôn, và câu dẫn + danh sách với trần 400 ký tự đều khớp mã. Còn hai điểm không chốt được từ hai tệp được phép đọc. Mô tả vi_sao nói «cắt giữ trọn câu hoặc mục», nhưng catTran cắt ở khoảng trắng khi đơn vị đầu đã vượt 400. Mô tả chua_lam nói N là «số gạch» Out of scope, nhưng mã đếm contentLines(...) mà định nghĩa của hàm đó nằm ngoài danh sách input.
  required_evidence:
    - Định nghĩa `contentLines` trong lib/md-section.cjs (hàm được `require` ở ho-so-tom-tat.cjs dòng 16). Nếu nó chỉ đếm gạch danh sách cấp ngoài cùng, mỗi gạch một lần, không đếm dòng bọc hay đoạn văn, thì vế (3) và số mục Known limits của báo cáo khớp «số gạch» và verdict đổi thành PASS. Nếu nó đếm mọi dòng không trống thì «số gạch» mâu thuẫn với mã và verdict thành FAIL. (lens operational-feasibility)
    - Một ca thử chạy `tomTatHoSo` trên hợp đồng có mục Out of scope gồm một gạch bọc hai dòng, lấy từ tests/ của kit, cho thấy `moi_nguoi.chua_lam` in «1 mục để ngoài phạm vi». Đó là chứng cứ trực tiếp cho việc `contentLines` đếm theo gạch. (lens operational-feasibility)
    - Thân hàm contentLines trong lib/md-section.cjs (hàm mà ho-so-tom-tat.cjs gọi ở dòng 252-253), chứng minh nó chỉ trả các dòng gạch. Nếu nó trả cả dòng văn không gạch thì vế «N là số gạch» của mô tả chua_lam sai và verdict đổi thành FAIL. (lens spec-alignment)
    - Một lần chạy tomTatHoSo trên fixture do code sinh, có đoạn Vấn đề & ai gặp gồm MỘT câu dài hơn 400 ký tự, in ô moi_nguoi.vi_sao. Nếu ô kết «…» ở giữa câu thì xác nhận mô tả «cắt giữ trọn câu hoặc mục» không đúng ở ca đó (verdict đổi thành FAIL); nếu mô tả có thêm một câu nêu ca ngoại lệ này thì nó đúng (verdict đổi thành PASS). (lens spec-alignment)
    - Một chỉ dẫn của hợp đồng hay owner về cách đọc «giữ trọn câu hoặc mục»: là quy tắc tuyệt đối hay quy tắc chung có ngoại lệ đơn vị-đầu-quá-trần. Lấy ở chữ AC-10 trong contract.md của hồ sơ dai-tom-tat-doc-dung. (lens spec-alignment)
  human_override:  # chi nguoi ghi

- eval: E11
  run_id: minted-dai-tom-tat-doc-dung-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dai_tom_tat
  verified_at: 2026-10-12T02:18:42Z
  output: |
    Results: 24 passed, 0 failed (dai-tom-tat)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-dai-tom-tat-doc-dung-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-12T02:18:42Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-dai-tom-tat-doc-dung-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 0
  verified_at: 2026-10-12T02:18:42Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-dai-tom-tat-doc-dung-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-12T02:18:42Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-dai-tom-tat-doc-dung-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-12T02:18:42Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-dai-tom-tat-doc-dung-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-12T02:18:42Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dai-tom-tat-doc-dung-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 1
  verified_at: 2026-10-12T02:18:42Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dai-tom-tat-doc-dung-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-12T02:18:42Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-dai-tom-tat-doc-dung-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-10-12T02:18:42Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-dai-tom-tat-doc-dung-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-12T02:18:42Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-dai-tom-tat-doc-dung-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 1
  verified_at: 2026-10-12T02:18:42Z

Ba lệnh suite đỏ ở trên KHÔNG gắn eval nào (nên `failed_evals` rỗng) và là lý do duy nhất của báo cáo REJECT. Đuôi đầu ra máy ghi được:

- `vung:1` — hai ca đỏ: «P122 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)» và «P126 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)»; dòng tổng «Results: 2 failed».
- `vung:3` — một ca đỏ: «[RT13] file lạ chứa "signed-off": tests/scripts/dai-tom-tat.test.mjs — thêm ca, hoặc khai gạch có lý do trong khối BO-DOC-KHAI-GACH» (kéo theo «ca ra co ten — RT13 (ho so ra-co-ten-lam-va-trao)»); dòng tổng «Results: 1 failed».
- `node scripts/product-map.mjs --root . --check` — in «PRODUCT-MAP.md lệch với hồ sơ xưởng — chạy: node scripts/product-map.mjs --root .»; `LO-TRINH.html` khớp tệp ý định và hồ sơ.

## Known limits

## Ngoài hợp đồng

## Analyst

Baseline khong do:

- node tests/scripts/dai-tom-tat.test.mjs: bo qua baseline: tep tests/scripts/dai-tom-tat.test.mjs co o cay dang kiem nhung chua co o merge-base 7f65e5a0277929b32663b44becf51c300dabfac0 — eval moi, chay tren code cu khong phan biet gi
- node tests/scripts/dai-tom-tat-crm.mjs: bo qua baseline: tep tests/scripts/dai-tom-tat-crm.mjs co o cay dang kiem nhung chua co o merge-base 7f65e5a0277929b32663b44becf51c300dabfac0 — eval moi, chay tren code cu khong phan biet gi

Eval không-phân-biệt (xanh trên cả HEAD lẫn baseline): none — không eval feature nào được đo xanh trên cả hai phía; mọi eval feature là eval mới nên baseline n-a (lý do ở mục «Baseline khong do»).

## Variance

none — mọi eval chạy một lượt, đồng nhất, không eval nào có phương sai.

## Iterations

Round 1: E1–E9 và E11 xanh; E10 UNCERTAIN chờ người ở Cổng Bằng chứng; ba lệnh suite hồi quy đỏ không gắn eval (`vung:1` ca P122 và P126, `vung:3` ca RT13, và kiểm `product-map --check` lệch PRODUCT-MAP.md). Trả về triển khai.
