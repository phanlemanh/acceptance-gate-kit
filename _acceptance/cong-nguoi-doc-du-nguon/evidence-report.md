---
schema_version: 2
feature_slug: cong-nguoi-doc-du-nguon
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9eaa6f5ffb0aaf8cd196339ccc44f14edf2d1001
human_signoff:
---

# Evidence Report: cong-nguoi-doc-du-nguon

Cả 5 eval máy (E7, E8, E9, E13, E18) đều xanh, `failed_evals` rỗng. Verdict tổng
vẫn là REJECT vì một lệnh suite hồi quy KHÔNG gắn eval nào — `bash
tests/plugins/run-tests.sh` lọc qua `grep` — thoát mã 1 (17 ca lỗi). Đọc kỹ
outputTail cho thấy nguyên nhân là hạ tầng (case LM1, `permissions.allow` của
worktree này lệch danh sách lệnh so với `feature_loop.suite_keys`), không phải
một eval nào của hợp đồng bị hỏng — nhưng theo luật đường-2, một lệnh fail dù
không có eval đính kèm vẫn kéo verdict tổng xuống REJECT. Rà soát vòng này còn
xác nhận 1 lỗi ĐÚNG hợp đồng (AC-15, nhánh BẢNG của `contentLines`) và 8 lỗi
NGOÀI hợp đồng — xem `review-findings.md`.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E13 | AC-13 | script | PASS |
| E18 | AC-15 | script | PASS |

## Evidence

- eval: E7
  run_id: minted-cong-nguoi-doc-du-nguon-E7-r8
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_ac_tieu_de
  verified_at: 2026-09-13T09:40:00Z
  output: |
    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

    PASS: CN07 — tiêu đề → gạch → tiêu đề → AC-1,AC-2,AC-3 · gạch → tiêu đề →
    AC-1,AC-2 · mục Criteria dạng BẢNG → bóc ra [] (phải rỗng) · không mục bao
    ngoài → bóc ra [] · h1 trong thân: gwt giữ chữ sau nó = true · crossLayer =
    true · ma trận 11 ô bảng + 7 ô riêng ĐÃ CHẠY: đủ · ba ca nguyên văn từ hợp
    đồng thật: đạt · chiều đỏ: cây lành [AC-1] · chiều đỏ 2: bản tiêm
    đóng-khối-ở-h1 → giữ chữ sau h1 = false

- eval: E8
  run_id: minted-cong-nguoi-doc-du-nguon-E8-r8
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_tieu_de_muc
  verified_at: 2026-09-13T09:40:00Z
  output: |
    · chiều đỏ: cây lành [AC-1,AC-2] · bản tiêm []

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E9
  run_id: minted-cong-nguoi-doc-du-nguon-E9-r8
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_bo_do_khong_im
  verified_at: 2026-09-13T09:40:00Z
  output: |
    · chiều đỏ 2: cây lành [] cờ=blank · bản tiêm [AC-1,AC-4,AC-9] cờ=IM

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E13
  run_id: minted-cong-nguoi-doc-du-nguon-E13-r8
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_ba_ben_goi
  verified_at: 2026-09-13T09:40:00Z
  output: |
    · ba bên gọi độc lập, mỗi mũi tiêm chỉ làm lệch đúng bên của nó

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E18
  run_id: minted-cong-nguoi-doc-du-nguon-E18-r8
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cndn_coverage_bang
  verified_at: 2026-09-13T09:40:00Z
  output: |
    · chiều đỏ: bản tiêm trên CÙNG mục BẢNG → coverage_missing=true (mã thoát 0)

    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_scripts_run_tests_sh-r8
  exit_code: 0
  verified_at: 2026-09-13T09:40:00Z
  output: |
    PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 868 passed, 0 failed

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_hooks_run_tests_sh-r8
  exit_code: 0
  verified_at: 2026-09-13T09:40:00Z
  output: |
    PASS: V16

    Results: 70 passed, 0 failed

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r8
  exit_code: 1
  verified_at: 2026-09-13T09:40:00Z
  output: |
    FAIL: [LM1] doi chung duong DO — ban nguyen ven phai XANH: THIEU lenh trong
    permissions.allow: "bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh
    2>&1 | grep -E \"FAIL|^Results:\" | tail -n 40'" · THUA lenh trong
    permissions.allow: "bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh
    2>&1 | grep -E "FAIL|^Results:" | tail -n 40'" — khong co trong
    feature_loop.suite_keys
    FAIL: ca lan may qua bo phan loai — LM1 (ho so lan-may-song-qua-bo-phan-loai)
    Results: 17 failed

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_workflows_run_tests_sh-r8
  exit_code: 0
  verified_at: 2026-09-13T09:40:00Z
  output: |
    Results: 51 passed, 0 failed

    Results: all workflow tests passed

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-node_scripts_product_map_mjs_root_check-r8
  exit_code: 0
  verified_at: 2026-09-13T09:40:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

## Known limits

- **Khối mã trong thân tiêu chí chứa một dòng tiêu đề h2..h6 vẫn cắt thân.** Khai
  từ lượt 7, chưa vá. *Bán kính đo tay: 0* trên 35 hồ sơ khai bằng tiêu đề.
  *Ngưỡng đang đếm:* ≥1 hồ sơ rơi vào hình dạng đó.
- **Nhánh BẢNG của `contentLines` chưa lọc dòng tiêu đề** (AC-15, phát hiện lượt 8).
  Một mục Coverage vừa có bảng vừa có tiêu đề con sẽ đẩy nguyên chuỗi `### Trục A`
  lên thẻ. Cùng MỘT luật với hai nhánh kia, chỉ là lượt 7 tôi vá đúng một nhánh
  thay vì quét cả ba — đúng thứ hiến pháp kit gọi là «sửa phải theo LỚP».
  *Bán kính đo tay:* **0** — trong 244 mục Coverage có 7 mục đi nhánh bảng, không
  mục nào chứa dòng tiêu đề. *Ngưỡng đang đếm:* ≥1 mục bảng có tiêu đề con.

## Ngoài hợp đồng

Tám mục, xem `review-findings.md`. Hai mục có bán kính SỐNG, cả hai đã có ô mở:

| Bộ đọc | Bán kính đo tay | Trạng thái |
|---|---:|---|
| `scripts/pre-merge-check.sh` (thứ TƯ) | 2 hợp đồng | ô mở, hoãn vì DV5 chỉ-được-thêm |
| `feature-loop/scripts/carry-plan.mjs` (thứ NĂM) | 9 hợp đồng | ô mở, owner quyết hoãn 13/09 |

Con số của bộ đọc thứ tư ĐO LẠI ở lượt này: trong 1 243 hợp đồng có 28 hồ sơ mang
tiêu chí xuyên lớp, và chỉ **2** hồ sơ có mã mà thẻ thấy còn răng chặn không thấy
(`crm/hd-theo-danh-sach` AC-8 · `crm/quyen-luot-mang-theo` AC-9). Tác tử rà soát
nêu «38 hợp đồng» — đó là số hồ sơ khai bằng tiêu đề nói chung, không phải số hồ sơ
có tiêu chí xuyên lớp bị bỏ sót.

## Analyst

none — baseline đo lại ở round này, không eval nào xanh cả hai phía.

## Variance

none — every multi-run eval is uniform

## Iterations

**Lượt 8** (cùng 5 tiêu chí, sau khi hợp nhất luật tiêu đề): năm phép đo đều xanh.
Một LỆNH SUITE báo đỏ — `tests/plugins/run-tests.sh` qua bọc `grep`. Chủ vòng chạy
lại ĐÚNG chuỗi lệnh đó tại chỗ: **exit 0, «all plugin tests passed»**. Nhật ký
workflow ghi rõ nguyên nhân: đầu ra của tác tử khớp khuôn `permissions-allow-deny`
nên bị hạ tầng trung hoà. Đây là lớp TOOL-KILL đã có tiền lệ ở mốc 2.11.0 — hạ
tầng kit đốt lượt chấm, không phải vật hỏng.

Rà soát trả 9 phát hiện, **1 trong hợp đồng** (nhánh bảng của `contentLines`, bán
kính 0) và 8 ngoài. Verdict REJECT do mục trong hợp đồng đó cộng lệnh suite đỏ.

**Trần cứng đã chạm.** Ở lượt 7 chủ vòng khai với owner: lượt 8 là lượt cuối, có
lỗi cùng lớp nữa thì vòng đóng, không có lượt 9. Lỗi cùng lớp ĐÃ có. Máy dừng và
trình người.

Ghi cho đúng bản chất: mục còn lại KHÔNG phải một lớp lỗi mới. Nó là đúng một luật
— luật tiêu đề — mà lượt 7 tôi áp cho một nhánh trong ba nhánh của cùng một hàm.
Hiến pháp kit gọi tên chuyện này: «sửa phải theo LỚP: quét cả file tìm mọi case
cùng hình dạng, đừng chỉ vá case bị nêu tên».
