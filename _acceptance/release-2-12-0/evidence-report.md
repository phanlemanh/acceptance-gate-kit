---
schema_version: 2
feature_slug: release-2-12-0
verdict: REJECT
failed_evals: [E3c]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 3db8403be44066e1de80519a75de70454b3c059c
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
  run_id: minted-release-2-12-0-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so_2_12
  verified_at: 2026-09-14T00:20:00Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)
    PASS: P200 xanh (dung 1 dong PASS cua chinh no; phan quyet KHONG lay tu ma thoat tron suite)

- eval: E2
  run_id: minted-release-2-12-0-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_2_12
  verified_at: 2026-09-14T00:20:00Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), giu 2.7.0 BANG so tai moc truoc ef36d81fca11d962fee404622dd93632ec64f72f (doi chung duong: cua so moc..HEAD KHONG rong)

- eval: E3a
  run_id: minted-release-2-12-0-E3a-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-14T00:20:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 868 passed, 0 failed

- eval: E3b
  run_id: minted-release-2-12-0-E3b-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-14T00:20:00Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E3c
  run_id: minted-release-2-12-0-E3c-r4
  exit_code: 1
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-14T00:20:00Z
  output: |
    FAIL: P93 mot-nguon: bang luat khop tung ky tu + than khuon va CAP MARKER duy nhat toan kho (E8, E11)
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: 1 failed

- eval: E3d
  run_id: minted-release-2-12-0-E3d-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-14T00:20:00Z
  output: |
    skill-claims: 51 passed, 0 failed

    Total: 616 passed, 0 failed

- eval: E3e
  run_id: minted-release-2-12-0-E3e-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-14T00:20:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E4
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment; fresh context)
  proposal: PASS
  verdict: PASS
  verified_at: 2026-09-14T00:20:00Z
  votes:
    - domain-correctness: PASS — Bốn khối của `## Notes` đều có mặt và có nội dung thật (không chỉ tiêu đề): (1) bảng ba dòng số của luật (c) kèm đoạn "Nguồn rút từng ô" nói rõ mỗi cột lấy từ đâu (commit Cổng 2, `run-log.jsonl`, `decisions.jsonl`); (2) bảng vendored liệt kê đủ 9 mục của `INIT-CI-COPY-LIST` (4 mục +/− cụ thể, 5 mục gộp "không đổi"), đo bằng `git diff --numstat 45e5f1d8..HEAD` — sha nêu tên rõ; (3) lớp lỗi tái phát nêu tên kèm số liệu/dẫn chứng theo từng lượt/vòng; (4) nhát cắt kế gọi tên cụ thể (gỡ nhánh lật verdict, `acceptance-verify.js` dòng 1042). Các ô cố ý để trống (4/5 dòng "đếm tay" trong khối 1) đều có câu giải thích lý do ngay bên dưới bảng.
    - operational-feasibility: PASS — `## Notes` trong contract.md có đủ 4 khối bắt buộc, mỗi khối mang số thật kèm nguồn rút cụ thể: khối 1 (bảng 5 vòng × lượt chấm/làm-xong→quyết-được, cộng dòng tổng 19/36h22 khớp phép cộng, kèm dòng "Nguồn rút từng ô" chỉ rõ commit/run-log.jsonl/decisions.jsonl); khối 2 (bảng đủ 9 mục vendored — 4 mục có +/− đo bằng `git diff --numstat 45e5f1d8..HEAD`, 5 mục còn lại liệt kê rõ "không đổi"); khối 3 (3 lớp lỗi tái phát gọi tên kèm số lượt và tên vòng cụ thể); khối 4 (nhát cắt gọi tên đích danh `acceptance-verify.js` dòng 1042). Các ô cố ý để trống (4/5 dòng cột "đếm tay" ở khối 1) có khai lý do rõ ràng ("để trống thay vì bịa").
    - spec-alignment: PASS — Cả bốn khối bắt buộc của `## Notes` đều có mặt và có số thật kèm nguồn rút cụ thể: khối 1 có bảng lượt chấm/làm-xong→quyết-được/gọi người theo từng vòng cộng đoạn "Nguồn rút từng ô" chỉ rõ commit/run-log/decisions.jsonl, và các ô để trống (4/5 vòng ở cột đếm tay) được khai lý do rõ ràng thay vì bịa số. Khối 2 liệt kê đủ 9 mục `INIT-CI-COPY-LIST` (4 mục +/− cụ thể, 5 mục "không đổi") đo bằng `git diff --numstat 45e5f1d8..HEAD`. Khối 3 gọi tên ba lớp lỗi tái phát kèm dẫn chứng (số lượt, mốc so sánh, tên file). Khối 4 gọi tên nhát cắt cụ thể (`acceptance-verify.js` dòng 1042). Không khối nào chỉ có tiêu đề suông.

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