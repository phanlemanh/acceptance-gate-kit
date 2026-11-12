---
schema_version: 2
feature_slug: release-2-39-0
verdict: BLOCKED
failed_evals: ["E1","E2","E3j","E6","E3c","E3i"]
reason: |
  Sáu lệnh suite không chạy được vì môi trường: run-tests.sh dừng ở bước kiểm môi trường, Node đang chạy là v26.7.0 còn kho khai Node 24 trong .nvmrc. Các lệnh bị ảnh hưởng và việc cần làm (đặt Node 24 theo .nvmrc rồi chạy lại đúng nguyên văn):
  - bash tests/scripts/run-tests.sh --manh bash (E3): chạy nguyên văn từ worktree đã ghim, dừng ngay ở bước kiểm môi trường, suite chưa chạy nên không có kết quả đạt hay hỏng.
  - bash tests/scripts/run-tests.sh --manh mjs:1/3 (E3f): dừng ở bước kiểm môi trường, không chạy suite thật.
  - bash tests/scripts/run-tests.sh --manh mjs:2/3 (E3g): dừng ở bước kiểm môi trường, không chạy suite thật; không tự đổi Node vì ngoài phạm vi verifier.
  - bash tests/scripts/run-tests.sh --manh mjs:3/3 (E3h): dừng ở bước kiểm môi trường, suite chưa chạy; không checkout, stash hay reset.
  - bash tests/hooks/run-tests.sh (E3b): dừng ở bước kiểm môi trường, không chạy bộ test.
  - bash tests/workflows/run-tests.sh (E3d): script kiểm phiên bản Node rồi thoát; đây không phải timeout của công cụ và không phải kết quả của test.
  Đây là lỗi môi trường, không phải lỗi mã: sửa bằng chạy lại ở Node 24, không sửa code.
enforcement_mode: strict
bypass_used: false
verified_commit: 6ae15a4fe9015c0b28eb61b0b9802daf528b6300
verified_by: fresh-context verification subagent
human_signoff:
---

# Evidence Report: release-2-39-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | FAIL |
| E2 | AC-2 | test | FAIL |
| E3 | AC-3 | test | BLOCKED |
| E3f | AC-3 | test | BLOCKED |
| E3g | AC-3 | test | BLOCKED |
| E3h | AC-3 | test | BLOCKED |
| E3b | AC-3 | test | BLOCKED |
| E3c | AC-3 | test | FAIL |
| E3i | AC-3 | test | FAIL |
| E3j | AC-3 | test | FAIL |
| E3d | AC-3 | test | BLOCKED |
| E3e | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | FAIL |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | judgment | FAIL (đề xuất của hội đồng, chờ người quyết) |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | script | PASS |
| E12 | AC-12 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-39-0-E1-r1
  baseline: red
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-12T14:24:20Z
  output: |
    Lệnh vùng 3 của suite plugins thoát khác 0 (một lần chạy, 0 lần đạt). Đuôi đầu ra chỉ còn dòng kết thúc của bộ bọc.

- eval: E2
  run_id: minted-release-2-39-0-E2-r1
  baseline: red
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-12T14:24:20Z
  output: |
    Cùng lệnh vùng 3 với E1, thoát khác 0 (0 lần đạt trên 1 lần chạy).

- eval: E3
  run_id: minted-release-2-39-0-E3-r1
  baseline: red
  verifier: config:executors.test.scripts_bash
  verified_at: 2026-11-12T14:24:20Z
  output: |
    node lệch: đang chạy v26.7.0, kho khai 24 (.nvmrc) — đổi Node rồi chạy lại
    Suite chưa chạy (BLOCKED, lỗi môi trường).

- eval: E3f
  run_id: minted-release-2-39-0-E3f-r1
  baseline: red
  verifier: config:executors.test.scripts_mjs_1
  verified_at: 2026-11-12T14:24:20Z
  output: |
    node lệch: đang chạy v26.7.0, kho khai 24 (.nvmrc) — đổi Node rồi chạy lại
    Suite chưa chạy (BLOCKED, lỗi môi trường).

- eval: E3g
  run_id: minted-release-2-39-0-E3g-r1
  baseline: red
  verifier: config:executors.test.scripts_mjs_2
  verified_at: 2026-11-12T14:24:20Z
  output: |
    node lệch: đang chạy v26.7.0, kho khai 24 (.nvmrc) — đổi Node rồi chạy lại
    Suite chưa chạy (BLOCKED, lỗi môi trường).

- eval: E3h
  run_id: minted-release-2-39-0-E3h-r1
  baseline: red
  verifier: config:executors.test.scripts_mjs_3
  verified_at: 2026-11-12T14:24:20Z
  output: |
    node lệch: đang chạy v26.7.0, kho khai 24 (.nvmrc) — đổi Node rồi chạy lại
    Suite chưa chạy (BLOCKED, lỗi môi trường).

- eval: E3b
  run_id: minted-release-2-39-0-E3b-r1
  baseline: red
  verifier: config:executors.test.hooks
  verified_at: 2026-11-12T14:24:20Z
  output: |
    node lệch: đang chạy v26.7.0, kho khai 24 (.nvmrc) — đổi Node rồi chạy lại
    Suite chưa chạy (BLOCKED, lỗi môi trường).

- eval: E3c
  run_id: minted-release-2-39-0-E3c-r1
  baseline: red
  verifier: config:executors.test.plugins_vung_1
  verified_at: 2026-11-12T14:24:20Z
  output: |
    Lệnh vùng 1 của suite plugins thoát khác 0 (0 lần đạt trên 1 lần chạy); đuôi đầu ra không còn dòng FAIL nào đọc được.

- eval: E3i
  run_id: minted-release-2-39-0-E3i-r1
  baseline: red
  verifier: config:executors.test.plugins_vung_2
  verified_at: 2026-11-12T14:24:20Z
  output: |
    Lệnh vùng 2 của suite plugins thoát khác 0 (0 lần đạt trên 1 lần chạy).

- eval: E3j
  run_id: minted-release-2-39-0-E3j-r1
  baseline: red
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-12T14:24:20Z
  output: |
    Cùng lệnh vùng 3 với E1, E2, E6; thoát khác 0.

- eval: E3d
  run_id: minted-release-2-39-0-E3d-r1
  baseline: red
  verifier: config:executors.test.workflows
  verified_at: 2026-11-12T14:24:20Z
  output: |
    node lệch: đang chạy v26.7.0, kho khai 24 (.nvmrc) — đổi Node rồi chạy lại
    Suite chưa chạy (BLOCKED, lỗi môi trường).

- eval: E3e
  run_id: minted-release-2-39-0-E3e-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-11-12T14:24:20Z
  output: |
    LO-TRINH.html khớp tệp ý định và hồ sơ.

- eval: E4
  run_id: minted-release-2-39-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2390_cua_so
  verified_at: 2026-11-12T14:24:20Z
  output: |
    XANH: hai tập bằng nhau

- eval: E5
  run_id: minted-release-2-39-0-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.rel2390_dd_giu
  verified_at: 2026-11-12T14:24:20Z
  output: |
    moc: 	  "version": "2.7.1", | HEAD:   "version": "2.7.1",

- eval: E6
  run_id: minted-release-2-39-0-E6-r1
  baseline: red
  verifier: config:executors.test.plugins_vung_3
  verified_at: 2026-11-12T14:24:20Z
  output: |
    Cùng lệnh vùng 3 với E1, E2, E3j; thoát khác 0.

- eval: E7
  run_id: minted-release-2-39-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2390_goi_doi
  verified_at: 2026-11-12T14:24:20Z
  output: |
    XANH: hai gói chỉ đổi dòng version

- eval: E8
  run_id: minted-release-2-39-0-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rel2390_lop_chep
  verified_at: 2026-11-12T14:24:20Z
  output: |
    XANH: đúng 1 tệp đổi như ghi chú 2.39.0 kể

- eval: E10
  run_id: minted-release-2-39-0-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.kiem_ban_cai_moc
  verified_at: 2026-11-12T14:24:20Z
  output: |
    [kiem-ban-cai] TỔNG KẾT: ĐẠT 8/8 — v2.38.1 (88d31b63) cài đúng tag

- eval: E11
  run_id: minted-release-2-39-0-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2390_ba_viec
  verified_at: 2026-11-12T14:24:20Z
  output: |
    XANH: ba việc chỉ-bớt đã xong ở HEAD

- eval: E12
  run_id: minted-release-2-39-0-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rel2390_su_mo_ta
  verified_at: 2026-11-12T14:24:20Z
  output: |
    XANH: sử trong mô tả hai plugin ở v2.38.1 còn nguyên trong docs/reference/su-mo-ta-plugin-toi-2-38-1.md

### Judgment

- eval: E9
  judged_by: hội đồng ba góc nhìn (fresh context), đề xuất FAIL; không khai input nào ngoài ba góc nhìn dưới đây
  proposal: FAIL
  votes:
    - domain-correctness: FAIL — Vế (0) sai. Mục con doc-jsx-va-ban-do-hong kết bằng câu «Ngoài-5, Ngoài-7, Ngoài-8 (khoá nhan_dien có mặt nhưng rỗng …) chọn «mở hợp đồng mới», nên lỗi ấy còn trong bản giao». Contract và design.md của hồ sơ ấy không có Ngoài-5/7/8; Notes chỉ kê Ngoài-1,2,3,4,6,9 và AC-2. Mục con do-tuong-phan-lab-oklab còn hai câu không có trong contract hay design.md: trích «một số trang từng đạt sẽ chuyển thành từ chối» (Hỏi-1) và «Sửa ở lượt chấm 1: lớp phủ trong suốt trên ảnh hoặc gradient khác nay báo không đo được». Vế (2) đúng: khối INIT-CI-COPY-LIST có 36 tệp và scripts/pre-merge-check.sh thuộc khối. Vế (1) khớp Context, trừ chi tiết «khối BO-DOC-KHAI-GACH … ra-co-ten-lam-va-trao» mà Context không nêu. Vế (3) có hai chỗ nghi ngờ: câu «tuỳ chọn mới requireMeasured» mâu thuẫn với Context hồ sơ lab, vốn nói --require-measured đã có trước (hồ sơ tier-b cũng nói mã 5 khi đòi đo đủ đã có); căn cứ «nếp minor cho bề mặt mới» không nằm trong Context của release-2-39-0, vốn chỉ nói số do chủ kho gọi tên.
    - operational-feasibility: FAIL — Vế (0), (1), (2) đúng với nguồn đã đọc: số giới hạn khớp Notes (8/3/7/5/3/4), khối INIT-CI-COPY-LIST có 36 tệp và hai tệp nêu tên đều thuộc khối. Vế (3) sai ở đoạn «Vì sao 2.39.0», câu «bộ quét thiết kế trong trình duyệt có tuỳ chọn mới requireMeasured». Context của release-2-39-0 chỉ nêu căn cứ số là số chủ kho gọi tên. Hợp đồng do-tuong-phan-lab-oklab (AC-8) chạy bộ quét bản gốc c8fa5a65 «có và không đòi đo đủ» và thấy nó trả đạt, nên tuỳ chọn ấy có từ trước mốc này. Chỉ kết quả KHONG-DO-DUOC là mới.
    - spec-alignment: FAIL — Vế (0) sai ở mục con doc-jsx-va-ban-do-hong. Câu «Ngoài-5, Ngoài-7, Ngoài-8 (khoá nhan_dien có mặt nhưng rỗng vẫn làm nhóm mất khỏi lưới mà không báo gì) chọn «mở hợp đồng mới», nên lỗi ấy còn trong bản giao» không có trong contract.md hay design.md của hồ sơ. Notes của hợp đồng chỉ có Ngoài-1, 2, 3, 4, 6, 9 và điểm AC-2, tức 7 mục. Design.md chỉ nhắc Ngoài-4, Ngoài-5 của hồ sơ khác, và AC-6 chỉ nói «thiếu khoá nhan_dien», không nói «có mặt nhưng rỗng». Ba vế còn lại (1), (2), (3) đúng; khối INIT-CI-COPY-LIST có đúng 36 tệp và scripts/pre-merge-check.sh thuộc khối; số giới hạn của năm mục con còn lại khớp Notes.
  required_evidence:
    - Chỉ ra trong _acceptance/doc-jsx-va-ban-do-hong/contract.md (Notes) hoặc design.md câu nói Ngoài-5, Ngoài-7, Ngoài-8 được chọn «mở hợp đồng mới» và lỗi nhan_dien rỗng còn trong bản giao; hoặc sửa mục CHANGELOG «Bộ đọc thẻ của bước chấm khuôn…» cho khớp Notes (CHANGELOG dòng 145-146).
    - Chỉ ra trong _acceptance/do-tuong-phan-lab-oklab/contract.md hoặc design.md hai câu: trích Hỏi-1 «một số trang từng đạt sẽ chuyển thành từ chối» và «lớp phủ trong suốt trên ảnh hoặc gradient khác nay báo không đo được»; hoặc bỏ/sửa hai câu trong CHANGELOG. Mục quyết định Hỏi-1 trong _acceptance/do-tuong-phan-lab-oklab/decisions.jsonl không nằm trong danh sách Input nên chưa kiểm được.
    - Chứng minh requireMeasured là tuỳ chọn mới của bộ quét ở mốc này bằng `git show v2.38.1:scripts/design-scan.js`; hoặc sửa câu «Vì sao 2.39.0» (CHANGELOG.md dòng 27-31) cho khớp Context của release-2-39-0 (số do chủ kho gọi tên).
    - Hai điểm phụ chưa kiểm được: câu «khối BO-DOC-KHAI-GACH của hồ sơ ra-co-ten-lam-va-trao gỡ hai dòng đã chết» (CHANGELOG dòng 48-49) và câu «GUIDE thêm câu» ở mục doc-jsx-va-ban-do-hong không có trong Context hay input nào.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên cả HEAD lẫn baseline; chứng minh harness chứ không phải feature, nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- node scripts/product-map.mjs --root . --check: E3e
- bash -c 'c=$(git show 88d31b63:diagram-design/.claude-plugin/plugin.json | grep -m1 "version"); m=$(grep -m1 "version" diagram-design/.claude-plugin/plugin.json); echo "moc: $c | HEAD: $m"; git diff --quiet 88d31b63 HEAD -- diagram-design && [ "$c" = "$m" ]': E5
- node tests/scripts/kiem-ban-cai.ca.mjs --chi-luot-moc: E10

Baseline khong do:
- GIT_GLOB_PATHSPECS=1 bash _acceptance/release-2-39-0/cua-so.sh 88d31b63 do-tuong-phan-lab-oklab doc-jsx-va-ban-do-hong lenh-cho-khoa-nhay-duong-dan luot-kiem-nhe t3-arm-chu-ky-khong-im tier-b-doc-khong-do-duoc: bo qua baseline: tep _acceptance/release-2-39-0/cua-so.sh co o cay dang kiem nhung chua co o merge-base 909dffd8b7df648ffc41625e9582fe9042ae6f89 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-2-39-0/goi-chi-doi-so.sh 88d31b63: bo qua baseline: tep _acceptance/release-2-39-0/goi-chi-doi-so.sh co o cay dang kiem nhung chua co o merge-base 909dffd8b7df648ffc41625e9582fe9042ae6f89 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/release-2-39-0/ba-viec-tru.sh: bo qua baseline: tep _acceptance/release-2-39-0/ba-viec-tru.sh co o cay dang kiem nhung chua co o merge-base 909dffd8b7df648ffc41625e9582fe9042ae6f89 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/release-2-39-0/su-mo-ta.mjs: bo qua baseline: tep _acceptance/release-2-39-0/su-mo-ta.mjs co o cay dang kiem nhung chua co o merge-base 909dffd8b7df648ffc41625e9582fe9042ae6f89 — eval moi, chay tren code cu khong phan biet gi

Lệnh hỏng không gắn eval riêng (ghi rõ theo yêu cầu): ba lệnh vùng plugins bọc bằng `bash -c 'set -o pipefail; ... | grep ... | tail -n 40'` (vùng 3 phủ E1, E2, E3j, E6; vùng 1 phủ E3c; vùng 2 phủ E3i) đều thoát khác 0 một lần chạy. Đuôi đầu ra bị lọc bởi grep nên không nêu được ca nào đỏ; cần chạy lại không lọc để định vị ca.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1, E2, E3j, E6, E3c, E3i hỏng (ba vùng suite plugins thoát khác 0, chưa định vị ca đỏ); sáu lệnh suite khác (E3, E3f, E3g, E3h, E3b, E3d) BLOCKED vì Node v26.7.0 lệch .nvmrc (Node 24); E9 hội đồng đề xuất FAIL do CHANGELOG có câu không khớp hồ sơ nguồn. Chờ chạy lại ở Node 24 và sửa CHANGELOG.
