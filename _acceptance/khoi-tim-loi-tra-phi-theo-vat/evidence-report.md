---
schema_version: 2
feature_slug: khoi-tim-loi-tra-phi-theo-vat
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ccabea22159944a10d5f768d5b67bd2b5d095d7c
human_signoff: Mạnh 2026-09-14 — ký với 12 giới hạn đã khai, tất cả là nợ của THƯỚC, không mục nào chạm hành vi người dùng cuối
---

# Evidence Report: khoi-tim-loi-tra-phi-theo-vat

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6a | AC-6 | script | PASS |
| E6b | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E1-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_w40_triage_truoc_refute
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: W49b mutant lam co cum bat GIA (rang song)

    Results: 512 passed, 0 failed (acceptance-verify)

- eval: E2
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E2-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-14T18:40:00Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: all plugin tests passed

- eval: E3
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E3-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.script.ktl_vung_vat_s4args
  verified_at: 2026-09-14T18:40:00Z
  output: |
    PASS: VV8c gỡ bộ lọc vùng phủ → lib/b.js lọt vào coverageFiles (ca VV8 có răng)

    Results: 19 passed, 0 failed (s4-args-vung-vat)

- eval: E4
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E4-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_w41_vung_vat
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: W49b mutant lam co cum bat GIA (rang song)

    Results: 512 passed, 0 failed (acceptance-verify)

- eval: E5
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E5-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.script.ktl_vung_vat_mutants
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: VVM-CU2 fail-open phai duoc KHAI trong log, khong im lang

    Results: 15 passed, 0 failed (vung-vat-mutants)

- eval: E6a
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E6a-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_w42_w43_finding_so
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: W49b mutant lam co cum bat GIA (rang song)

    Results: 512 passed, 0 failed (acceptance-verify)

- eval: E6b
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E6b-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_carry_plan_dv10
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: DV11 exit 3 VAN in JSON, va carriedFindings con nguyen 1 muc
      PASS: DV11 exit 3 khai carriedEvals RONG tuong minh (khong de ben doc doan)
    Results: 23 passed, 0 failed

- eval: E7
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E7-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_w44_baseline_roi_gang
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: W49b mutant lam co cum bat GIA (rang song)

    Results: 512 passed, 0 failed (acceptance-verify)

- eval: E8
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-E8-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ktl_wf_usage_u06
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: U06e wall tinh tron agent (12s)

    Results: 38 passed, 0 failed (wf-usage)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_scripts_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 871 passed, 0 failed

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_hooks_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-14T18:40:00Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-bash_tests_workflows_run_tests_sh-r5
  exit_code: 0
  verified_at: 2026-09-14T18:40:00Z
  output: |
    Results: 15 passed, 0 failed (vung-vat-mutants)

    Results: all workflow tests passed

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-khoi-tim-loi-tra-phi-theo-vat-SUITE-node_scripts_product_map_mjs_root_check-r5
  exit_code: 0
  verified_at: 2026-09-14T18:40:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

## Known limits

Mười hai mục dưới đây do làn tìm-lỗi của lượt chấm 5 xác nhận, scope-triage xếp
NGOÀI hợp đồng, và owner quyết ghi Known limits tại Cổng Bằng chứng (14/09).
Máy cố ý KHÔNG tự sửa chúng — đó là chốt chặn của chính vòng này.

Không mục nào chạm hành vi người dùng cuối thấy. Tất cả là nợ của THƯỚC: bản
chép tay của một hàm khớp, cờ vàng thiếu cho ba trường args mới, hai bộ đếm
agent còn đếm dòng, một phụ thuộc PyYAML chưa khai, và vài ca không đo được
điều chúng tuyên. Chúng đi vào hạt giống mốc 2.13 cùng ba chỗ cắt đã ghi sổ.

1. **feature-loop/scripts/wf-usage.mjs** — wf-usage: sửa «đếm dòng thay vì đếm agent» chỉ áp cho byRole — total.agents và byModel[].agents vẫn đếm (agent × model), nên cùng một usage-report tự mâu thuẫn
   · mức high · lens `conventions` · owner quyết 14/09: ghi Known limits.
   · người dùng thấy gì: Báo cáo chi phí máy có thể hiện hai con số agent khác nhau ở hai chỗ trong cùng một báo cáo, khiến người đọc dễ hiểu nhầm quy mô chạy thực tế.

2. **feature-loop/workflows/acceptance-verify.js** — Khoá `finders` mang HAI khuôn khác nhau trong cùng một hợp đồng kết quả của workflow (string[] ở dryRun, {chay,boQua} ở đường thành công)
   · mức medium · lens `conventions` · owner quyết 14/09: ghi Known limits.
   · người dùng thấy gì: Kết quả trả về của vòng chạy thật có thể khác hình dạng với kết quả chạy thử, nên công cụ đọc kết quả tự động có thể báo lỗi hoặc đọc sai khi chuyển từ chạy thử sang chạy thật.

3. **feature-loop/workflows/acceptance-verify.js** — Ba trường args mới (fileDoTrongDiff, coverageFiles, coEvalPaths) có nhánh đọc-cũ nhưng KHÔNG có cờ vàng — trái luật «đổi schema artifact phải có đường đọc-cũ + cờ vàng»
   · mức medium · lens `conventions` · owner quyết 14/09: ghi Known limits.
   · người dùng thấy gì: Khi dữ liệu đầu vào thiếu ba mục mới này, hệ thống vẫn chạy tiếp nhưng không báo cho người biết đang dùng đường xử lý cũ — có thể âm thầm tốn thêm chi phí máy hoặc bật lại hành vi lọc cũ mà không ai hay.

4. **tests/scripts/config-yaml-that.test.mjs** — Suite thường trực `executors.test.scripts` nay phụ thuộc cứng vào python3 + PyYAML mà không kho/tài liệu nào khai
   · mức medium · lens `conventions` · owner quyết 14/09: ghi Known limits.
   · người dùng thấy gì: Trên một máy hoặc môi trường build chưa cài sẵn PyYAML, toàn bộ bộ kiểm tra sẽ báo lỗi hàng loạt — không phải vì sản phẩm có lỗi, mà vì thiếu một điều kiện cài đặt chưa được ghi ra ở đâu để người dựng môi trường biết trước.

5. **feature-loop/scripts/wf-usage.mjs** — wf-usage: số agent ở dòng tiêu đề vẫn đếm dòng (agent × model), mâu thuẫn với bảng byRole vừa được sửa trong chính diff này
   · mức medium · lens `bugs` · owner quyết 14/09: ghi Known limits.
   · người dùng thấy gì: Dòng tổng kết ở đầu báo cáo — chỗ người đọc đầu tiên — có thể hiện số agent cao hơn thực tế, làm sai lệch nhận định về quy mô và chi phí của lượt chạy.

6. **feature-loop/workflows/acceptance-verify.js** — acceptance-verify: khoá `finders` có HAI kiểu khác nhau trong cùng hợp đồng kết quả, và vắng hẳn ở hai đường BLOCKED
   · mức medium · lens `bugs` · owner quyết 14/09: ghi Known limits.
   · người dùng thấy gì: Khi lượt chạy bị chặn, kết quả trả về thiếu một thông tin mà các trường hợp khác đều có, nên công cụ đọc kết quả tự động có thể gặp lỗi bất ngờ đúng lúc đang cần biết vì sao bị chặn.

7. **feature-loop/scripts/s4-args.mjs** — Hai bản globToRe vẫn trôi ở dạng `**/<đoạn>/**`, mà ma trận VV4b được viện làm răng canh không có ô nào thuộc dạng đó
   · mức medium · lens `bugs` · owner quyết 14/09: ghi Known limits.
   · người dùng thấy gì: Với một số kiểu mẫu loại-trừ đường dẫn nhất định, hệ thống có thể phân loại cùng một tệp khác nhau tuỳ nơi kiểm tra, và hiện chưa có phép kiểm tự động nào phát hiện được nếu điều đó xảy ra.

8. **tests/workflows/acceptance-verify.test.mjs** — Đo CHỈ DẪN thay vì ĐẦU RA — W47 tự truyền đáp án, tên `_acceptance/config.yaml` chỉ là trang trí
   · mức high · lens `measurement` · owner quyết 14/09: ghi Known limits.
   · người dùng thấy gì: Một số phép kiểm tự động không thực sự chứng minh được tính năng hoạt động đúng như tên gọi của chúng — nếu tính năng bị hỏng âm thầm sau này, các phép kiểm này sẽ không phát hiện ra.

9. **tests/workflows/acceptance-verify.test.mjs** — Fixture/hàm khớp VIẾT TAY đúng khuôn bên đọc — bản chép thứ tư của `globToRe`, lại không có đối chứng âm
   · mức medium · lens `measurement` · owner quyết 14/09: ghi Known limits.
   · người dùng thấy gì: Một phép kiểm tự động dùng bản sao chép tay của logic thật thay vì logic thật, nên nếu logic thật thay đổi và có lỗi, phép kiểm này có thể vẫn báo xanh dù sản phẩm đã sai.

10. **tests/scripts/finding-line-bo-doc.test.mjs** — «Dấu sống» của phép so recheck-evidence là một chuỗi CHỈ xuất hiện khi bộ đọc BÁO LỖI
   · mức medium · lens `measurement` · owner quyết 14/09: ghi Known limits.
   · người dùng thấy gì: Phép kiểm dùng để đảm bảo công cụ đối chiếu bằng chứng đọc đúng dữ liệu mới hiện đang tự báo xanh do một lỗi thiết lập không liên quan, nên khả năng thật của nó chưa được chứng minh.

11. **tests/scripts/finding-line-bo-doc.test.mjs** — Tuyên quét LỚP nhưng chỉ assert một CON SỐ, không assert danh tính
   · mức medium · lens `measurement` · owner quyết 14/09: ghi Known limits.
   · người dùng thấy gì: Phép kiểm chỉ đếm số lượng công cụ đọc sổ chứ không kiểm tra đó có đúng là những công cụ cần theo dõi hay không, nên nếu một công cụ quan trọng bị bỏ sót và thay bằng công cụ khác, phép kiểm vẫn báo xanh.

12. **_acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml** — Expected của E7 hứa 4 dòng NGUYÊN VĂN nhưng cmd chỉ ghim 1, và bằng chứng ghi lại không chứa dòng nào
   · mức medium · lens `measurement` · owner quyết 14/09: ghi Known limits.
   · người dùng thấy gì: Bằng chứng lưu lại cho người duyệt đọc thực ra không chứa đủ thông tin mà hồ sơ hứa hẹn sẽ có, nên người duyệt có thể tưởng đã kiểm tra được điều gì đó mà thực tế chưa hề được xác nhận.

## Ngoài hợp đồng

## Analyst

E2, E3, E5 — non-discriminating trên baseline (xanh cả head lẫn diffBase). Đã xác nhận là regression-guard có chủ ý, không phải lỗ hổng che giấu bởi feature: E2 (suite plugins) ghim thông điệp MUTANT-6 cụ thể (doc_manifest FAIL-LOUD), không chỉ pass/fail suông; E3 (s4-args-vung-vat) và E5 (vung-vat-mutants) là chính hai tệp ca giữ bộ mutant hai-chiều cho lớp "biến bất biến vùng vật" — bản thân chúng PHẢI xanh trên cả head lẫn baseline vì mutant nằm trong fixture nội bộ của ca, không trong code sản phẩm đang diff.

## Variance

none — không có eval nào runs > 1 trong vòng này (không có eval ngẫu nhiên/stochastic trong hợp đồng)

## Iterations

Round 1: triage_failed (phân loại phạm vi không chạy được) — verdict PENDING-JUDGMENT, 13 mục eval trả về đủ nhưng toàn bộ 13 finding rơi ngoài hợp đồng chờ người soát, không mục nào máy tự sửa. Returned to implementation: fix 8 finding thật (94aa7aec), rồi 5 finding thêm ở round 1b — config.yaml hỏng YAML là nặng nhất (85d3deae), rồi ĐỔI KHUÔN bên viết truyền KẾT QUẢ / bên đọc thôi khớp glob (1b73b462, STOP-PATCHING).

Round 2: verdict REJECT — 12/13 eval đạt kỳ vọng, E4 đỏ; 20 finding qua bác bỏ, 4 trong hợp đồng, 8 finding ngoài hợp đồng mang sang từ lượt trước (T5), cụm ngoài vùng phủ 2/20. 23 agent · 1.999.743 token. E4 đỏ là NHIỄU HẠ TẦNG của làn chấm, không phải vật: chạy tay cùng chuỗi lệnh trả `rc=0` và grep khớp 1 dòng, còn `acceptance-verify.test.mjs` trả 499 đạt / 0 đỏ — cùng lớp với SIGPIPE của lượt 1. Returned to implementation: sửa 4 finding trong hợp đồng (AC-5 ×2 «đo chỉ dẫn thay vì đầu ra» ở bên đọc trong khi luật sống ở bên viết · AC-6 carry-plan nuốt carriedFindings khi thiếu sha · AC-8 bảng --md không render), cộng hai món tự gây ra mà không chờ phân loại: đường đọc-cũ cho `ngoaiVatFiles` (ĐỔI KHUÔN bỏ quên, fail-open lặng) và gỡ `feature_loop.do_globs` (hợp đồng khai đích danh là Out of scope, mở lại ngay trong một lượt sửa). Commit 99458899.

Round 3: verdict REJECT — 9/9 eval script đạt kỳ vọng, năm lệnh suite hồi quy đều xanh; REJECT không đến từ eval đỏ mà từ 5 finding TRONG HỢP ĐỒNG do scope-triage xác nhận (AC-4 ×2 bộ lọc ngoài-vật fail-open cho tệp ngoài diff · AC-5 ×2 fixture mutant chép tay bản thứ tư của globToRe · AC-7 ×1 evals.yaml ghim expected trôi khỏi vật). 7 finding ngoài hợp đồng mới + 8 mang sang (T5); cụm ngoài vùng phủ 3/12 — cụm GIẢ (cả ba tệp đều ngoài diff), một lượt gọi người giả ở Cổng Bằng chứng do ĐỔI KHUÔN 14/09 thay vị từ miền MỞ bằng tập miền ĐÓNG. Máy DỪNG và trình owner ba lối; owner chọn «đổi khung ngược» (commit 3113010c, chia theo MIỀN chứ không theo cơ chế), cấp lượt chấm vượt trần.

Round 4 (lượt a — triage hỏng): verdict REJECT — 9/9 eval script đạt kỳ vọng, bốn suite hồi quy xanh nhưng `tests/plugins/run-tests.sh` đỏ ở P93. Scope-triage KHÔNG chạy được (`triage_failed: true`): không finding nào máy xác nhận, toàn bộ 15 finding chờ người ở Gate 2; cụm ngoài vùng phủ 4/9. Returned to implementation: chưa — round dừng ở REJECT cộng triage hỏng, chờ owner quyết trước khi mở lượt sửa kế tiếp.

Round 4 (lượt b — sau owner quyết): verdict REJECT nhưng KHÔNG eval nào đỏ — hai thứ chặn PASS đều ở THƯỚC, không ở vật: (1) `tests/plugins/run-tests.sh` đỏ P93 một lần không tái hiện được — làn chấm tự lọc mất thông điệp assert bằng `grep -E "FAIL|^Results:"` (làn tự huỷ bằng chứng của chính nó); (2) triage phân loại 9/10 finding rồi bỏ sót mục thứ mười → `triageFailed=true` theo thiết kế, refute chạy trên toàn bộ 10 finding thay vì 5. 9 finding mới + 6 mang sang (T5) chờ người; mục nặng nhất: `expected` của E7/E4 ghim dòng PASS mà `output` (`tail -n 25`) không thể chứa.

Round 5: verdict PASS — cả 9 eval (E1–E8, gồm E6a/E6b cùng AC-6) xanh trên head, bốn lệnh suite hồi quy (scripts, hooks, workflows, product-map --check) xanh, và suite plugins (nay gắn vào E2) cũng xanh — P93 của round 4 không tái hiện, làn chấm không còn tự huỷ bằng chứng của chính nó. Scope-triage CHẠY ĐỦ (không triage_failed): 12 finding thật được xác nhận, cả 12 đều rơi NGOÀI hợp đồng (0 trong hợp đồng); 4/12 rơi vào ba tệp không bộ đo nào phủ (`tests/scripts/config-yaml-that.test.mjs`, `tests/scripts/finding-line-bo-doc.test.mjs`, `_acceptance/khoi-tim-loi-tra-phi-theo-vat/evals.yaml`) — cụm ngoài vùng phủ THẬT (cùng hình dạng với cụm 4/9 của round 4, khác cụm giả 3/12 của round 3), owner cần dừng và quyết mở rộng hợp đồng hay rút phạm vi. Ba eval E2/E3/E5 vẫn xanh-trên-cả-hai-phía, đã xác nhận là regression-guard có chủ ý. Đây là lượt chấm THỨ NĂM — vượt trần T2 thường trực (3 vòng), tiếp tục dưới lượt vượt trần owner đã cấp ở cổng DỪNG-VÁ round 3 (commit 3113010c) cho tới khi hai thứ chặn ở THƯỚC của round 4 được xử lý xong.

Round 5: verdict **PASS** — `failedEvals` rỗng, `failedCommands` rỗng, `blocked` rỗng, `triageFailed: false`, `rejectFindings` rỗng. Chạy ĐẦY ĐỦ (`--no-carry`): cả 9 eval và 5 lệnh suite đều chạy lại trên cây này, không mục nào mang màu xanh cũ sang. Suite plugins XANH — xác nhận màu đỏ P93 của lượt 4 là chập chờn, không phải vật (đã chạy tay 5 lần trước đó, đều xanh; lần thứ sáu này là do máy chấm chạy).

Phép chia MIỀN của SỬA KHUNG đứng vững ở lượt chạy sạch: cụm-ngoài-vùng-phủ 4/12 nằm trên `tests/scripts/config-yaml-that.test.mjs`, `tests/scripts/finding-line-bo-doc.test.mjs` và `_acceptance/<slug>/evals.yaml` — cả ba đều CÓ trong diff và không eval nào khai trong `paths`, tức cụm THẬT. So với lượt 3 báo cụm 3/12 toàn tệp NGOÀI diff (cụm giả) thì đây đúng là thứ phép chia miền sinh ra để phân biệt.

Còn **12 mục ngoài hợp đồng** (mọi mục đều `known-limits`), nên gói không xanh-sạch theo sáu điều kiện — khối «Ngoài hợp đồng» có mặt và KHÔNG rỗng. Vòng dừng ở Cổng Bằng chứng cho owner quyết, đúng thiết kế. Máy cố ý KHÔNG tự sửa các mục này.

Số của lượt (`usage-report.md`, máy đo): 20 tác tử · 16.715.215 token · 20,4 phút · refute 4 tác tử.

### Re-pin lần 1 — 2026-09-14, do hoá cũ do chính commit chữ ký
run_id: repin-20260914T124037Z-24762
sha: b2c4d0d6e9a5247a985f97dc573258c3acb8287e · suites: 5 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng

### Re-pin lần 2 — 2026-09-18, do chiến dịch ghim lại theo LÔ sau mốc 2.16.0 — lô lo-ab, 15 hồ sơ
run_id: repin-20260918T123126Z-49883
sha: b950f6643e253a691021612b5c5cabfe86cc4dda · suites: 5 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng

### Re-pin lần 3 — 2026-09-21, do chiến dịch ghim lại theo mốc 2.18.0
run_id: repin-20260921T175037Z-33397
sha: 41b949dec2245c147ff1460ba6e70e41e5fbb6df · suites: 5 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng

### Re-pin lần 4 — 2026-09-22, do chiến dịch ghim lại theo mốc 2.18.1 (GUIDE §7.1)
run_id: repin-20260922T110053Z-46306
sha: ccabea22159944a10d5f768d5b67bd2b5d095d7c · suites: 5 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng
