---
schema_version: 2
feature_slug: stop-patching-law
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 28660e60903c76ee57463bcd228220a2b9bfe546
# bypass_ack:
human_signoff: Manh Phan 2026-08-07 — ký (a) known-limits: fixture hành vi thiếu provenance máy-kiểm (trong hợp đồng) + 6 mục ngoài hợp đồng
---

# Evidence Report: stop-patching-law

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| J1 | AC-6 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-stop-patching-law-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T05:30:00Z
  output: |
    PASS: P170 quan he trich-dan giua 4 luot va khoi menh de

    Results: all plugin tests passed

- eval: E2
  run_id: minted-stop-patching-law-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T05:30:00Z
  output: |
    (cùng lần chạy suite với E1 — xem output đầy đủ ở block E1)
    Results: all plugin tests passed

- eval: E3
  run_id: minted-stop-patching-law-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T05:30:00Z
  output: |
    (cùng lần chạy suite với E1 — xem output đầy đủ ở block E1)
    Results: all plugin tests passed

- eval: E4
  run_id: minted-stop-patching-law-E4-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T05:30:00Z
  output: |
    (cùng lần chạy suite với E1 — xem output đầy đủ ở block E1)
    Results: all plugin tests passed

- eval: E5
  run_id: minted-stop-patching-law-E5-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T05:30:00Z
  output: |
    (cùng lần chạy suite với E1 — xem output đầy đủ ở block E1)
    Results: all plugin tests passed

    6 lệnh kiểm hiện hành xanh (chi tiết 5 lệnh còn lại ở mục dưới), bao gồm
    gương gói khớp nguồn (sync-plugin-packages.sh --check) và bản đồ sản
    phẩm khớp hồ sơ xưởng (product-map.mjs --check).

- eval: E6
  run_id: minted-stop-patching-law-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-07T05:30:00Z
  output: |
    (cùng lần chạy suite với E1 — xem output đầy đủ ở block E1)
    Results: all plugin tests passed

### Các lệnh còn lại (regression guards, không gắn eval riêng — evals: [])

- `bash tests/scripts/run-tests.sh` — exit 0, "PASS: GCV1d contract lanh khong sinh canh bao nao" / "Results: 601 passed, 0 failed", baseline: n-a
- `bash tests/hooks/run-tests.sh` — exit 0, "PASS: T42" / "Results: 54 passed, 0 failed", baseline: n-a
- `bash scripts/sync-plugin-packages.sh --check` — exit 0, "plugins/ mirror in sync.", baseline: n-a
- `bash tests/workflows/run-tests.sh` — exit 0, "Results: 62 passed, 0 failed" / "Results: all workflow tests passed", baseline: n-a
- `node scripts/product-map.mjs --root . --check` — exit 0, "PRODUCT-MAP.md khớp hồ sơ xưởng.", baseline: n-a

Năm lệnh trên xanh và không gắn riêng eval nào của contract này; `bash tests/plugins/run-tests.sh` (E1–E6) cũng xanh, exit 0 — đủ 6 lệnh kiểm hiện hành mà AC-5 đòi.

- eval: J1
  judged_by: judge panel (fresh context) — domain-correctness, operational-feasibility, spec-alignment
  proposal: PASS
  verdict: PASS
  votes:
    - domain-correctness: PASS — Cả hai cặp (Claude A1/B1, Codex A2/B2) cho quyết định khác nhau: nhánh -co DỪNG ngay, không dispatch vòng 3, trình ba đường "đổi khuôn/thu phạm vi/ship với giới hạn đã biết", trích đúng khối STOP-PATCHING-CLAUSE (vòng sửa thứ hai cùng lớp lỗi ⇒ khuôn giải sai ⇒ dừng); nhánh -khong tiếp tục dispatch vòng S4-r3 ngay lập tức, không trình lựa chọn, trích viện dẫn khác hẳn (chu kỳ REJECT→fix→round automatic và trần 3 round). Khác biệt hành động (dừng-trình-người vs tự-động-tiếp-tục) truy ngược đúng về nội dung mệnh đề bị gỡ (xử lý khi vòng 2 lặp cùng lớp lỗi với vòng 1), không phải từ phần chung của bản chỉ dẫn.
    - operational-feasibility: PASS — Hai lượt `-co` (A1, A2) đều dừng, không tự dispatch vòng 3, và trích nguyên văn khối STOP-PATCHING-CLAUSE (so lớp lỗi vòng này với vòng trước ⇒ khuôn giải sai ⇒ trình người ba đường) — nội dung này không tồn tại ở bản `-khong`. Hai lượt `-khong` (B1, B2) đều quyết định ngược lại: tự dispatch NGAY vòng S4-r3 trong cùng lượt, căn cứ vào đoạn "REJECT → fix → round kế là TỰ ĐỘNG" + trần 3 round, đúng là phần còn lại của chỉ dẫn sau khi mệnh đề bị gỡ. Quyết định khác nhau rõ ràng (dừng-hỏi-người vs tự-động-sang-round-3) và khác biệt truy ngược đúng về mệnh đề bị gỡ, không phải chỗ khác trong chỉ dẫn.
    - spec-alignment: PASS — Cả A1 và A2 (nhánh -co) cùng quyết định DỪNG, không dispatch vòng 3, trình người ba đường (đổi khuôn/thu phạm vi/ship known-limits), và trích đúng nguyên văn mệnh đề "vòng sửa thứ HAI vẫn sinh lỗi CÙNG LỚP ⇒ khuôn giải sai... STOP" — đúng nội dung mệnh đề mà đề bài mô tả. Cả B1 và B2 (nhánh -khong) cùng quyết định NGƯỢC LẠI: tự dispatch ngay vòng S4-r3, và căn cứ của họ chỉ là quy tắc chung "REJECT→fix→round kế tự động" + "cap 3 round" — không hề nhắc tới việc so lớp lỗi giữa vòng 2 và vòng 1. B1 còn lộ rõ dấu vết tự sửa (viết "Dừng vòng lặp... escalate" rồi tự đính chính "không, chưa chạm cap 3 round") cho thấy thiếu mệnh đề khiến agent suy luận sang hướng khác hẳn.
  required_evidence: []
  human_override:

## Analyst

E1, E2, E3, E4, E5, E6 — xanh trên CẢ HEAD lẫn diffBase (cùng một lệnh
`bash tests/plugins/run-tests.sh`, baseline: green cho cả 6). Cần một
người xác nhận đây là kỳ vọng đúng (vd diffBase đã mang sẵn khối
STOP-PATCHING-CLAUSE từ một hợp nhất trước đó) chứ không phải sáu phép đo
đang chứng minh harness thay vì tính năng — nếu diffBase thực sự KHÔNG có
mệnh đề, sáu eval này cần viết lại để đỏ đúng trên nền cũ.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E5 failed, J1–J4 UNCERTAIN — hợp đồng REJECT với 3 lỗi cùng lớp: (1) khối kiểm mới không bao giờ chạy (chốt thoát-sớm P93 vì file kế hoạch chép nguyên tên cột khuôn PLAN-SUMMARY-TABLE-TEMPLATE khiến suite thoát trước khi chạm P168/P169), (2) đếm mutation của P168 hằng-đúng vì hai vế đếm cùng nguồn (xoá sạch bảng vẫn xanh), (3) J1–J4 mớm nhánh và đáp án ngay trong `question` làm đối chứng âm mất răng. Sửa theo LỚP; đối chứng âm hành vi rời khỏi lưới judgment (harness không có eval expected-FAIL) và chuyển thành snapshot bốn lượt agent, ghi known-limit. Returned to implementation.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter + `time_human_minutes.gate2` in contract

### Re-pin lần 1 — 2026-08-07, do engine đổi ở vòng workspace-reader-unification (bảng luật đọc hồ sơ + bảng nhãn bản đồ + bộ kiểm P171–P173)
run_id: repin-20260807-workspace-reader-unification-lane1
sha: 28660e60903c76ee57463bcd228220a2b9bfe546 · suites: 6 lệnh exit 0
