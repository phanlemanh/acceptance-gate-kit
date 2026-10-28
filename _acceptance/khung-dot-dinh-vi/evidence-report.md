---
schema_version: 2
feature_slug: khung-dot-dinh-vi
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ed962d60ef948003cdaec50cc88b4639c1b73a5d
human_signoff:
---

# Evidence Report: khung-dot-dinh-vi

Vòng 1. Phán quyết REJECT do máy tính sẵn: mọi eval của tiêu chí (E1 đến E10) chạy xanh, nhưng bốn lệnh suite hồi quy không gắn eval nào chạy đỏ (xem «Lệnh suite» và «Lệnh fail không gắn eval» dưới đây). `failed_evals` để rỗng vì không eval nào đỏ; nguyên nhân REJECT nằm ở suite.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | test | PASS |
| E8 | AC-7 | test | PASS |
| E9 | AC-8 | test | PASS |
| E10 | AC-9 | test | PASS |
| E11 | AC-10 | judgment | PASS (đề xuất của hội đồng, chờ người ở Cổng 2) |

## Evidence

Các eval E1 đến E5 và E7 đến E10 cùng chạy một lệnh `node --test` trên `tests/dieu-phoi/khung-dinh-vi.test.mjs`; đuôi đầu ra dưới đây là chung, bị cắt ở nguồn (máy chỉ giữ phần đuôi), chép nguyên phần có.

- eval: E1
  run_id: minted-khung-dot-dinh-vi-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khung_dinh_vi
  verified_at: 2026-10-28T08:07:29Z
  output: |
    #   KD-1 Monitor lọt: hoi-chu-kho 0 · cho-nguoi 1
    #   KD-1 Monitor lọt: hoi-chu-kho 2 · cho-nguoi 1
    #   KD-1-do: Monitor lọt câu giám sát
    #   KD-2-do: đóng mã lạ không b (đuôi bị cắt ở nguồn)

- eval: E2
  run_id: minted-khung-dot-dinh-vi-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khung_dinh_vi
  verified_at: 2026-10-28T08:07:29Z
  output: |
    (cùng lệnh với E1 — đuôi đầu ra chung, xem khối E1)
    #   KD-2-do: đóng mã lạ không b (đuôi bị cắt ở nguồn)

- eval: E3
  run_id: minted-khung-dot-dinh-vi-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khung_dinh_vi
  verified_at: 2026-10-28T08:07:29Z
  output: |
    (cùng lệnh với E1 — đuôi đầu ra chung, xem khối E1; dòng KD-3 và KD-3-do nằm ngoài phần đuôi máy giữ)

- eval: E4
  run_id: minted-khung-dot-dinh-vi-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khung_dinh_vi
  verified_at: 2026-10-28T08:07:29Z
  output: |
    (cùng lệnh với E1 — đuôi đầu ra chung, xem khối E1; dòng KD-4 và KD-4-do nằm ngoài phần đuôi máy giữ)

- eval: E5
  run_id: minted-khung-dot-dinh-vi-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khung_dinh_vi
  verified_at: 2026-10-28T08:07:29Z
  output: |
    (cùng lệnh với E1 — đuôi đầu ra chung, xem khối E1; dòng KD-5 và KD-5-do nằm ngoài phần đuôi máy giữ)

- eval: E6
  run_id: minted-khung-dot-dinh-vi-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dieu_phoi_khung_mod
  verified_at: 2026-10-28T08:07:29Z
  output: |
    PASS: KH-09-do argv · khung.ts: argv process.run không kết thúc bằng dạng chỉ đọc của xem ('xem','--json' | 'xem','--json','--khung'): ['node', `${$.plugin.root}/scripts/dieu-phoi.mjs`, 'pha', 'dang-chay']

- eval: E7
  run_id: minted-khung-dot-dinh-vi-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khung_dinh_vi
  verified_at: 2026-10-28T08:07:29Z
  output: |
    (cùng lệnh với E1 — đuôi đầu ra chung, xem khối E1; dòng KD-6, KD-6b và KD-6-do nằm ngoài phần đuôi máy giữ)

- eval: E8
  run_id: minted-khung-dot-dinh-vi-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khung_dinh_vi
  verified_at: 2026-10-28T08:07:29Z
  output: |
    (cùng lệnh với E1 — đuôi đầu ra chung, xem khối E1; dòng KD-7 và KD-7-do nằm ngoài phần đuôi máy giữ)

- eval: E9
  run_id: minted-khung-dot-dinh-vi-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khung_dinh_vi
  verified_at: 2026-10-28T08:07:29Z
  output: |
    (cùng lệnh với E1 — đuôi đầu ra chung, xem khối E1; dòng KD-8 và KD-8-do nằm ngoài phần đuôi máy giữ)

- eval: E10
  run_id: minted-khung-dot-dinh-vi-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.khung_dinh_vi
  verified_at: 2026-10-28T08:07:29Z
  output: |
    (cùng lệnh với E1 — đuôi đầu ra chung, xem khối E1; dòng KD-9 và KD-9-do nằm ngoài phần đuôi máy giữ)

### Phán đoán (judgment)

- eval: E11
  judged_by: hội đồng 3 góc nhìn (fresh context)
  verdict: PASS
  rationale: Cả ba góc nhìn thấy đủ năm điều của AC-10 có chữ rõ trong tiep-tuc.md, mo-dot.md và README: ghi mỗi câu chủ kho bằng `hoi` (heredoc có nháy), đóng bằng `hoi-xong`, cấm ghi câu của chính mình bằng sự kiện `can_phan:true`, khai `muc_tieu` khi mở đợt, và giới hạn «không có máy giữ» kèm ngưỡng mở vòng hook tự ghi.
  human_override:  # chi nguoi ghi

Phiếu của hội đồng (đề xuất PASS, người quyết ở Cổng 2):

- domain-correctness: PASS — Bước 6 của tiep-tuc.md dặn ghi mỗi câu hỏi chủ kho bằng `hoi` trước khi kết lượt. Câu đi qua heredoc có nháy `<<'CAU_HET'` nên nháy, `$` và backtick được ghi nguyên văn. Cùng bước đó dặn `hoi-xong <mã>` khi chủ kho đã trả lời, và cấm ghi câu của chính mình bằng `yeu-cau` hay sự kiện `can_phan:true`. mo-dot.md bước 2 dặn khai `muc_tieu` và nói khung hiện cờ vàng nếu vắng. README nêu «giám sát GỌI `hoi` là chỉ dẫn ở `/dieu-phoi:tiep-tuc`, không có máy giữ», kèm ngưỡng «≥1 lần trên đợt thật dải báo thiếu một câu giám sát đã hỏi».
- operational-feasibility: PASS — Cả năm điều đều có chữ rõ trong ba tệp. Bước 6 của tiep-tuc.md bắt ghi mỗi câu bằng `hoi --cau -` với heredoc `<<'CAU_HET'` trước khi kết lượt; `hoi-xong <mã>` khi chủ kho đã trả lời; cả tiep-tuc.md và README cấm ghi câu của chính mình bằng sự kiện mang `can_phan:true`; mo-dot.md bước 2 bắt thêm khoá `muc_tieu` vào hang-viec.json; README ghi «giám sát GỌI `hoi` là chỉ dẫn… không có máy giữ» kèm ngưỡng mở vòng.
- spec-alignment: PASS — Cả năm điều đều có chữ rõ trong ba tệp: tiep-tuc.md bước 6 dặn ghi mỗi câu bằng `hoi` trước khi kết lượt (heredoc `<<'CAU_HET'` giữ nguyên nháy, `$`, backtick); cùng bước đó dặn `hoi-xong <mã>` và cấm `yeu-cau` hay `can_phan:true` cho câu của chính mình; mo-dot.md bước 2 dặn thêm khoá `muc_tieu` vào hang-viec.json, vắng thì khung hiện cờ vàng; README nêu giới hạn «không có máy giữ» cùng ngưỡng mở vòng hook tự ghi.

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh --manh bash
  run_id: minted-khung-dot-dinh-vi-SUITE-bash_tests_scripts_run_tests_sh_manh_bas-r1
  exit_code: 0
  verified_at: 2026-10-28T08:07:29Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:1/3
  run_id: minted-khung-dot-dinh-vi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__c1a79c-r1
  exit_code: 1
  verified_at: 2026-10-28T08:07:29Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:2/3
  run_id: minted-khung-dot-dinh-vi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__376d1c-r1
  exit_code: 0
  verified_at: 2026-10-28T08:07:29Z

- cmd: bash tests/scripts/run-tests.sh --manh mjs:3/3
  run_id: minted-khung-dot-dinh-vi-SUITE-bash_tests_scripts_run_tests_sh_manh_mjs__b44527-r1
  exit_code: 0
  verified_at: 2026-10-28T08:07:29Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-khung-dot-dinh-vi-SUITE-bash_tests_hooks_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-28T08:07:29Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:1 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khung-dot-dinh-vi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__d30305-r1
  exit_code: 1
  verified_at: 2026-10-28T08:07:29Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:2 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khung-dot-dinh-vi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__838f95-r1
  exit_code: 0
  verified_at: 2026-10-28T08:07:29Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh --manh vung:3 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-khung-dot-dinh-vi-SUITE-bash_tests_plugins_run_tests_sh_manh_vun__513534-r1
  exit_code: 1
  verified_at: 2026-10-28T08:07:29Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-khung-dot-dinh-vi-SUITE-bash_tests_workflows_run_tests_sh-r1
  exit_code: 0
  verified_at: 2026-10-28T08:07:29Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-khung-dot-dinh-vi-SUITE-node_scripts_product_map_mjs_root_check-r1
  exit_code: 1
  verified_at: 2026-10-28T08:07:29Z

- cmd: node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc
  run_id: minted-khung-dot-dinh-vi-SUITE-node_tests_scripts_kiem_ban_cai_ca_mjs_c-r1
  exit_code: 0
  verified_at: 2026-10-28T08:07:29Z

### Lệnh fail không gắn eval

Bốn lệnh suite chạy đỏ, không lệnh nào gắn eval; đây là lý do của phán quyết REJECT:

- `bash tests/scripts/run-tests.sh --manh mjs:1/3` — kết quả cuối «Results: 38 passed, 1 failed»; đuôi máy giữ chỉ chứa các ca xanh (vat-da-o-nhanh-goc, vong-meta-dang-mo, xuat-du-qua-pipe), tên ca đỏ nằm ngoài phần đuôi, chưa xác định được từ dữ liệu của lượt này.
- `bash tests/plugins/run-tests.sh --manh vung:1` — hai ca đỏ: «P122 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)» và «P126 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)». Ca P126 cùng nguồn với lệnh `product-map.mjs --check` dưới đây.
- `bash tests/plugins/run-tests.sh --manh vung:3` — ca RT13 đỏ: «file lạ chứa "signed-off": tests/dieu-phoi/khung-dinh-vi.test.mjs — thêm ca, hoặc khai gạch có lý do trong khối BO-DOC-KHAI-GACH» (hồ sơ ra-co-ten-lam-va-trao).
- `node scripts/product-map.mjs --root . --check` — «PRODUCT-MAP.md lệch với hồ sơ xưởng» và «LO-TRINH.html lệch với tệp ý định và hồ sơ»; cách chạy lại sinh bản mới do máy in ra: `node scripts/product-map.mjs --root .`.

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»

Mọi field baseline của eval máy ghi n-a vì lý do trên; danh sách eval không-phân-biệt bên dưới KHÔNG đo được ở vòng này.

Eval không-phân-biệt (xanh cả trên HEAD lẫn baseline): không có eval nào được liệt kê, nhưng vì baseline không đo được nên đây KHÔNG có nghĩa mọi eval feature đều đỏ trên baseline. Chiều đỏ của từng eval nằm ở các ca `-do` bên trong bộ test (KD-1-do, KD-2-do, KD-3-do, KD-4-do, KD-5-do, KD-6-do, KD-7-do, KD-8-do, KD-9-do, KH-07-do), không phải ở phép đo baseline.

### Baseline khong do

- bash -c 'set -o pipefail; node --test --test-reporter=tap "tests/dieu-phoi/khung-dinh-vi.test.mjs" 2>&1 | grep -E "^ *(not )?ok [0-9]+ - KD-|^ *not ok|^#   |^# (pass|fail|skipped|todo) " | paste -sd"|" -': BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»
- node tests/dieu-phoi/kiem-khung.mjs: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «Error: No such tool available: Write. Write is not among the tools available here. Continue with the tools you have.»

Ghi chú: `verified_at` ghi theo ngày chạy (2026-10-28), giờ trong ngày không có trong dữ liệu đầu vào của bước soạn.

## Variance

none — mọi eval chạy một lần (runs 1), không eval ngẫu nhiên, không eval flaky.

## Iterations

Round 1: không eval nào của tiêu chí đỏ (E1 đến E10 xanh, E11 hội đồng đề xuất PASS chờ người); bốn lệnh suite hồi quy đỏ (mjs:1/3, vung:1 với P122 và P126, vung:3 với RT13, product-map --check). Trả về thi công để sửa.
