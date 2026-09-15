---
schema_version: 2
feature_slug: do-tin-tram-phan-loai
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9193b7c7843fc916e0a319a0a7dcc7a5718ce8e3
human_signoff:
---

# Evidence Report: do-tin-tram-phan-loai

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6a | AC-6 | script | PASS |
| E6b | AC-6 | script | PASS |
| E7a | AC-7 | script | PASS |
| E7b | AC-7 | script | PASS |
| E8a | AC-8 | script | PASS |
| E8b | AC-8 | script | PASS |
| E8c | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |
| E11 | AC-8 | test | PASS |
| E12 | AC-8 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-do-tin-tram-phan-loai-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_triage_ma_may_duc
  verified_at: 2026-09-15T10:05:00+07:00
  output: |
        PASS: ma-may-duc mutant go nhanh ghep-theo-ma -> DO (rang song)
        PASS: ma-may-duc mutant ghep theo thu tu (khong chu ky kiem) -> du ba nhung SAI quan he -> DO (rang song)
    PASS: ghep duoc theo ma may duc khi duong dan troi, ke ca hai phat hien TRUNG tieu de khac tep (doi chung duong: ban nguyen ven XANH; mutant go nhanh ghep-theo-ma DO ma 3)

- eval: E2
  run_id: minted-do-tin-tram-phan-loai-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_triage_chu_ky_kiem
  verified_at: 2026-09-15T10:05:00+07:00
  output: |
        PASS: chu-ky-kiem doi chung duong: tieu de dung thi ghep ngay luot 1
        PASS: chu-ky-kiem mutant bo so tieu de -> dong lech VAN ghep -> khong hoi lai (rang song)
    PASS: ma khop ma tieu de lech thi KHONG ghep — phat hien do di vao tap CON THIEU va duoc luot hoi lai mang di hoi (doi chung duong: cung ca voi tieu de dung thi ghep ngay luot 1, khong co luot hoi lai)

- eval: E3
  run_id: minted-do-tin-tram-phan-loai-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_triage_ma_la
  verified_at: 2026-09-15T10:05:00+07:00
  output: |
        PASS: ma-la hanh vi: dong la khop khoa tep::tieu de cua t3 van KHONG ghep — t3 vao tap thieu, hoi lai
        PASS: ma-la mutant bo loc dong ma-la -> dong la ghep bua cho t3, khong hoi lai (rang song)
    PASS: dong mang ma la la dong THUA — bi bo, co dong chan doan goi ten no, va khong phat hien nao mat phan loai vi no

- eval: E4
  run_id: minted-do-tin-tram-phan-loai-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_triage_hoi_lai
  verified_at: 2026-09-15T10:05:00+07:00
  output: |
        PASS: hoi-lai mutant go luot hoi lai -> co hong bat ngay luot 1 (rang song)
        PASS: hoi-lai mutant hoi lai CA phat hien da ghep -> rang song
    PASS: dung MOT luot hoi lai, loi nhac chi mang phat hien con thieu; sau gop du ca ba, triageFailed false, bac bo chi chay tren phat hien trong hop dong, va KHONG co tac tu phan loai thu ba

- eval: E5
  run_id: minted-do-tin-tram-phan-loai-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_triage_im
  verified_at: 2026-09-15T10:05:00+07:00
  output: |
        PASS: im ban that: luot 1 du -> dung MOT tac tu triage
        PASS: im mutant hoi lai vo dieu kien -> hai tac tu (rang song)
    PASS: luot 1 du thi tong so tac tu nhan phan loai dung MOT — khong co luot hoi lai nao

- eval: E6a
  run_id: minted-do-tin-tram-phan-loai-E6a-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_triage_van_thieu
  verified_at: 2026-09-15T10:05:00+07:00
  output: |
        PASS: van-thieu ban that: sau hoi lai van thieu -> triageFailed, refute TOAN BO, khong tac tu thu ba
        PASS: van-thieu mutant hoi lai vong hai -> ba tac tu (rang song)
    PASS: chan VAN THIEU — luot hoi lai tra ve ma van khong co dong khop thi triageFailed true, bac bo chay TOAN BO, khong co tac tu phan loai thu ba

- eval: E6b
  run_id: minted-do-tin-tram-phan-loai-E6b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_triage_hoi_lai_chet
  verified_at: 2026-09-15T10:05:00+07:00
  output: |
        PASS: hoi-lai-chet ban that: tac tu luot hai chet -> triageFailed, refute TOAN BO, khong thu lai
        PASS: hoi-lai-chet mutant thu lai khi chet -> ba tac tu (rang song)
    PASS: chan HOI LAI CHET — tac tu luot hai chet thi triageFailed true, bac bo chay TOAN BO, khong co tac tu phan loai thu ba

- eval: E7a
  run_id: minted-do-tin-tram-phan-loai-E7a-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_triage_dong_so
  verified_at: 2026-09-15T10:05:00+07:00
  output: |
        PASS: dong-so ban that: dung MOT dong kind triage, du nam so, khong run_id
        PASS: dong-so mutant bo dong so -> khong con dong (rang song)
    PASS: dung MOT dong kind triage trong runLog, du nam truong so, va KHONG co run_id (run-log cua lan chay nay duoc ghi ra tep cho chan bo-doc dung lai)

- eval: E7b
  run_id: minted-do-tin-tram-phan-loai-E7b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_triage_bo_doc_bo_qua
  verified_at: 2026-09-15T10:05:00+07:00
  output: |
    PASS: bo-doc-bo-qua moi bo chay deu bo qua dong triage va thay dong run_id
    PASS: bo-doc-bo-qua moi bo khong chay co ly do kiem duoc tren nguon
    PASS: ma tran bo doc TOAN PHAN — so bo doc chay BANG so bo doc quet duoc (9/9, ten tung bo in ra: feature-loop/scripts/carry-plan.mjs, feature-loop/scripts/repin-lane.mjs, feature-loop/scripts/round-tally-read.mjs, feature-loop/scripts/s4-args.mjs, lib/evidence-core.cjs, scripts/acceptance-gold.mjs, scripts/loop-health.mjs, scripts/pre-merge-check.sh, scripts/recheck-evidence.cjs), moi bo bo qua dong kind triage va van doc dung dong co run_id

- eval: E8a
  run_id: minted-do-tin-tram-phan-loai-E8a-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_triage_tap_rong
  verified_at: 2026-09-15T10:05:00+07:00
  output: |
        PASS: tap-rong ban that: khong tac tu triage, triageFailed false
        PASS: tap-rong mutant bo nhanh tap-rong -> goi tac tu (rang song)
    PASS: duong cu TAP RONG — khong tac tu phan loai nao duoc goi va triageFailed false

- eval: E8b
  run_id: minted-do-tin-tram-phan-loai-E8b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_triage_tac_tu_chet
  verified_at: 2026-09-15T10:05:00+07:00
  output: |
        PASS: tac-tu-chet ban that: chet ca hai lan thu -> triageFailed, khong hoi lai
        PASS: tac-tu-chet mutant cho hoi lai o nhanh chet -> ba tac tu (rang song)
    PASS: duong cu TAC TU CHET — chet ca hai lan thu cua luot 1 thi triageFailed true va KHONG co luot hoi lai nao

- eval: E8c
  run_id: minted-do-tin-tram-phan-loai-E8c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_triage_hop_dong_khong_doc_duoc
  verified_at: 2026-09-15T10:05:00+07:00
  output: |
        PASS: hop-dong-khong-doc-duoc ban that: triageFailed true, khong hoi lai
        PASS: hop-dong-khong-doc-duoc mutant bo nhanh tu-khai -> hoi lai chay (rang song)
    PASS: duong cu TU KHAI KHONG DOC DUOC HOP DONG — triageFailed true va KHONG co luot hoi lai nao

- eval: E9
  run_id: minted-do-tin-tram-phan-loai-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_triage_ma_giu_nguyen
  verified_at: 2026-09-15T10:05:00+07:00
  output: |
        PASS: ma-giu-nguyen dong luot 2 mang ma ngoai tap -> ma la, t3 van thieu -> triageFailed
        PASS: ma-giu-nguyen mutant duc lai ma o luot 2 -> luot 2 mang t1 (rang song)
    PASS: luot hoi lai mang lai MA CU cua tung phat hien (khong tai danh so), va dong tra ve mang ma ngoai tap dang hoi bi xu nhu ma la

- eval: E10
  run_id: minted-do-tin-tram-phan-loai-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_triage_seam_ma
  verified_at: 2026-09-15T10:05:00+07:00
  output: |
        PASS: seam-ma mutant go ma khoi loi nhac -> DO
        PASS: seam-ma mutant doi ten truong o MOT phia -> DO
    PASS: khop gui-di ↔ doc-lai — so ma trong tai gui di BANG so phat hien, ten truong ma rut tu MOT cho co marker va trung o ca ba phia (loi nhac, luoc do, bo ghep)

- eval: E11
  run_id: minted-do-tin-tram-phan-loai-E11-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-15T10:05:00+07:00
  output: |
    Results: 15 passed, 0 failed (vung-vat-mutants)

    Results: all workflow tests passed

- eval: E12
  run_id: minted-do-tin-tram-phan-loai-E12-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-15T10:05:00+07:00
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: all plugin tests passed

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-do-tin-tram-phan-loai-SUITE-bash_tests_scripts_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-15T10:05:00+07:00

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-do-tin-tram-phan-loai-SUITE-bash_tests_hooks_run_tests_sh-r2
  exit_code: 0
  verified_at: 2026-09-15T10:05:00+07:00

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-do-tin-tram-phan-loai-SUITE-node_scripts_product_map_mjs_root_check-r2
  exit_code: 0
  verified_at: 2026-09-15T10:05:00+07:00

## Known limits

## Ngoài hợp đồng

## Analyst

E11 (`bash tests/workflows/run-tests.sh`) và E12 (`bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'`) — cả hai xanh trên baseline (diffBase) LẪN trên nhánh: đây là hai làn hồi quy toàn kit (workflow + plugin corpus), không phải eval riêng cho hành vi mới của feature này, nên không phân biệt được vòng này với code cũ. Đây là regression-guard có chủ ý (chống hồi quy trên toàn làn workflow/plugin), không cần viết lại để assert hành vi mới — giữ nguyên vai trò bảo vệ.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: Cả 16 eval máy + 3 lệnh suite hồi quy đều PASS (exit 0, không phương sai), nhưng review đối kháng (scope-triage) xác nhận 5 finding ánh xạ được vào hợp đồng — trong đó có 1 lỗi hành vi thật trái AC-3 (dòng mã lạ vẫn ghép qua khoá tệp::tiêu đề dù contract và log tuyên nó bị bỏ) và 4 lỗ hổng đo lường ở AC-1/AC-7/AC-10 (assertion âm-tính-một-mình, đo chỉ-dẫn thay vì đầu-ra, đo có-mặt/đếm thay vì quan-hệ) mà răng hiện tại không bắt được — verdict REJECT, trả về implementation.
Round 2: Cả 16 eval máy + 3 lệnh suite hồi quy vẫn PASS (exit 0, không phương sai) sau khi vá vòng 1, nhưng review đối kháng xác nhận thêm 7 finding trong hợp đồng — 4 lỗ hổng «assertion âm-tính-một-mình» mới lộ ở AC-7 (đối chứng dương của loop-health/acceptance-gold/carry-plan/recheck-evidence không chứng minh bộ đọc thật sự đọc dòng run_id), 1 «đo chỉ dẫn thay vì đầu ra» cũng ở AC-7 (ba bộ đọc chỉ được grep nguồn, chưa từng chạy), 1 «assert đếm thay quan hệ» ở AC-4 (refute-chỉ-trong-hợp-đồng không phân biệt được với refute-toàn-bộ) và 1 «assert chuỗi-có-mặt thay quan hệ» ở AC-9 (không có assert nào chứng minh t1 không bị ghép đè) — verdict REJECT, trả về implementation.
