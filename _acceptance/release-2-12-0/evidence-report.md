---
schema_version: 2
feature_slug: release-2-12-0
verdict: REJECT
failed_evals: [E3c]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f5ac8ff04cd53d9177fa2e7bc5e14de2fb0ffea1
human_signoff:
---

# Evidence Report: release-2-12-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3a | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | FAIL |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-12-0-E1-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so_2_12
  verified_at: 2026-09-13T23:27:36Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)
    PASS: P200 xanh (dung 1 dong PASS cua chinh no; phan quyet KHONG lay tu ma thoat tron suite)

- eval: E2
  run_id: minted-release-2-12-0-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_2_12
  verified_at: 2026-09-13T23:27:36Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), giu 2.7.0 BANG so tai moc truoc ef36d81fca11d962fee404622dd93632ec64f72f (doi chung duong: cua so moc..HEAD KHONG rong)
    EXIT_CODE_IS: 0

- eval: E3a
  run_id: minted-release-2-12-0-E3a-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-13T23:27:36Z
  output: |

    Results: 868 passed, 0 failed
    EXIT_CODE=0

- eval: E3b
  run_id: minted-release-2-12-0-E3b-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-13T23:27:36Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-12-0-E3c-r5
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-13T23:27:36Z
  output: |
    FAIL: P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 1 failed

- eval: E3d
  run_id: minted-release-2-12-0-E3d-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-13T23:27:36Z
  output: |
    Results: 51 passed, 0 failed

    Results: all workflow tests passed

- eval: E3e
  run_id: minted-release-2-12-0-E3e-r5
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-13T23:27:36Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment; fresh context)
  proposal: PASS
  verdict: PASS
  verified_at: 2026-09-13T23:27:36Z
  votes:
    - domain-correctness: PASS — Cả bốn khối bắt buộc của `## Notes` đều có mặt và mang số thật kèm nguồn rút rõ ràng: khối 1 có bảng 5 vòng với cột lượt chấm/làm-xong→quyết-được/gọi người, kèm đoạn "Nguồn rút từng ô" giải thích từng cột đọc từ đâu (run-log.jsonl, decisions.jsonl) và khai rõ lý do 4 ô để trống thay vì bịa số; khối 2 có bảng đủ 9 mục vendored (4 mục có +/− và 5 mục "không đổi") đo bằng `git diff --numstat 45e5f1d8..HEAD`; khối 3 nêu tên bốn lớp lỗi tái phát kèm dẫn chứng cụ thể (số lượt, tên vòng, tên file); khối 4 gọi tên hai nhát cắt cụ thể kèm file/dòng/hàm. Không khối nào chỉ có tiêu đề suông, và không có số nào thiếu nguồn.
    - operational-feasibility: PASS — Cả bốn khối bắt buộc của AC-4 đều có mặt trong `## Notes` với nội dung số thật, không chỉ tiêu đề: (1) bảng ba dòng số luật (c) kèm đoạn "Nguồn rút từng ô" nói rõ mỗi số đọc từ đâu (run-log.jsonl, decisions.jsonl, commit Cổng 2); (2) bảng lớp vendored đủ 9 mục (4 mục có +/− cụ thể, 5 mục còn lại gộp "không đổi"), đo bằng `git diff --numstat 45e5f1d8..HEAD` — sha nêu tên; (3) mục 3 gọi tên ba lớp lỗi tái phát kèm dẫn chứng số lượt/mốc; (4) mục 4 gọi tên hai nhát cắt cụ thể (file + dòng/hàm). Các ô để trống trong bảng mục 1 (cột "đếm tay") có lý do khai rõ ngay dưới bảng, không phải trống vô cớ.
    - spec-alignment: PASS — Cả bốn khối bắt buộc đều có mặt trong `## Notes` với nội dung số thật, không chỉ tiêu đề: khối 1 có bảng 5 vòng × (lượt chấm, làm-xong→quyết-được, gọi người) cộng đoạn "Hạ tầng đốt lượt: 4" và nêu rõ nguồn rút từng ô (run-log.jsonl, decisions.jsonl, commit Cổng 2); khối 2 có bảng đủ 9 mục `INIT-CI-COPY-LIST` với +/− đo bằng `git diff --numstat 45e5f1d8..HEAD`; khối 3 nêu tên lớp lỗi tái phát kèm số dẫn chứng theo từng lượt/mốc; khối 4 gọi tên cụ thể hai nhát cắt (file + dòng). Các ô cố ý để trống (gọi người tách trong/ngoài của 4/5 vòng) đều có lý do khai rõ ("số THẬT chỉ đếm tay được từ phiên đã chạy vòng đó... Bốn ô còn lại để trống thay vì bịa").

## Known limits

## Ngoài hợp đồng

## Analyst

E3a, E3b, E3d, E3e — cả bốn eval này PASS trên CẢ HEAD lẫn diffBase (baseline: green), tức chúng chứng minh harness còn sống chứ không phân biệt được feature của mốc này. Đây là các suite hồi quy toàn kho (scripts/hooks/workflows/product-map) — vai trò của chúng ở mốc THUẦN-CẮT-SỐ này là regression-guard có chủ ý (không việc gì trong 2.12.0 chạm các lớp đó), không phải bằng chứng cho AC-1/AC-2 riêng của mốc. Không viết lại — giữ nguyên vai trò guard.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E3c thoát 1 (suite plugins) lúc S4-r1 — infra-recheck chạy lại 2 lần đều thoát 0, phân lớp hạ tầng; song song, gap-probe chạy bù (bước S1 bị bỏ sót trước khi Cổng 1 ký) bắt 3 P0 lời-khai-thay-phép-đo (AC-2/E2 rỗng nghĩa, Notes§1/E4 chấm lời khai có hai số giờ sai, E3c dặn-bằng-lời trỏ vào bộ phân lớp không ai gọi). Quay lại sửa cả ba.
Round 2: E4a (do-ba-dong-so --doi-chieu) thoát 5 — bảng ba dòng số máy tính lệch một ô so với contract; verdict REJECT. Owner sau đó chọn lối 1: trừ hết dàn đo tự dựng (E4a, E5, phan-lop-ha-tang.cjs/E3f) thay vì vá tiếp.
Round 3: cả 8 phép đo xanh (E1, E2, E3a-f, E4 panel PASS) nhưng round-tally vẫn REJECT: chủ vòng escalate lên owner (quyết định `d-20260913T173256Z-16`) vì 14/14 phát hiện của lượt này nằm trong bộ máy tự dựng ngay trong mốc (phan-lop-ha-tang.cjs, evals.yaml, do-ba-dong-so.cjs, mô tả manifest) — không phát hiện nào ở ba con số phiên bản là vật được giao, vốn đã xanh từ round 1. Dừng, không vá thêm, trình owner chọn lối trước khi tiếp tục.
Round 4: owner chọn lối 1 (trừ dàn đo tự dựng, decisions `d-20260913T213941Z-17..19`). E3c thoát 1 lại (suite plugins, FAIL: P93) trong fan-out; infra-recheck chạy lại đúng chuỗi lệnh tại chỗ trên cùng SHA `3db8403b` xanh 2 lần (trọn suite + riêng khối P93) — phân lớp hạ tầng, cơ chế định danh: `scan()` của P93 quét `rglob` bắt-tất-cả toàn cây làm việc, một tệp nháp không-theo-dõi mang cặp marker làm nó đỏ trong fan-out 37 tác tử (`d-20260913T224234Z-24`). Nhát cắt (scan() đi theo tệp git-theo-dõi) không làm trong mốc này vì chạm chính vật E3a–E3e đang đo; ghi vào ô `thuoc-khong-lat-verdict` ngả 5. Song song vá phát hiện IN-CONTRACT duy nhất của lượt (chân 4 `rang-moc.sh` fail-open im lặng khi thiếu `SO_AG_HEAD`, `d-20260913T224234Z-20/21`) và sửa loạt lời khai đã trôi khỏi vật sau nhát trừ lượt 3. Verdict REJECT (E3c đỏ trong fan-out, dù đã phân lớp hạ tầng).
Round 5: E3c thoát 1 lại (suite plugins, cùng `FAIL: P93` / `MUTANT-6` như lượt 4) trên `verified_commit f5ac8ff0` — cây đã mang các vá của lượt 4 (chân 4 + tách mã 7/8 của `rang-moc.sh`, tách lối 2/3/5 của `rang-p200.sh`). Lượt này KHÔNG chạy lại infra-recheck tại chỗ cho lần đỏ mới, nên chưa có đối chứng dương riêng phân lớp vật/hạ-tầng cho lần đỏ này — không suy diễn, ghi đúng những gì đã đo. Sáu eval máy còn lại (E1, E2, E3a, E3b, E3d, E3e) và panel E4 đều PASS. Verdict REJECT theo `failed_evals: [E3c]` đã tính sẵn.