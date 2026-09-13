---
schema_version: 2
feature_slug: cong-nguoi-doc-du-nguon
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a14b3dbd652eafd669263da503a62c9954873944
human_signoff:
---

# Evidence Report: cong-nguoi-doc-du-nguon

Toàn bộ 5 eval máy (E7, E8, E9, E13, E18) và 5 lệnh suite hồi quy đều pass trên
cây thật (exit 0). Verdict tổng là REJECT vì lượt rà soát (review) lần này xác
nhận 2 lỗi ĐÚNG hợp đồng — một ở AC-7, một ở AC-15 — mà chính ma trận eval hiện
tại có điểm mù không bắt được (xem `review-findings.md` mục «Trong hợp đồng»).

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E13 | AC-13 | script | PASS |
| E18 | AC-15 | script | PASS |

## Evidence

- eval: E7
  run_id: minted-cong-nguoi-doc-du-nguon-E7-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_ac_tieu_de
  verified_at: 2026-09-13T08:30:00Z
  output: |
    · ba ca nguyên văn từ hợp đồng thật: đạt
    · chiều đỏ: cây lành [AC-1] · bản tiêm []
    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E8
  run_id: minted-cong-nguoi-doc-du-nguon-E8-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_tieu_de_muc
  verified_at: 2026-09-13T08:30:00Z
  output: |
    · chiều đỏ: cây lành [AC-1,AC-2] · bản tiêm []
    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E9
  run_id: minted-cong-nguoi-doc-du-nguon-E9-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_bo_do_khong_im
  verified_at: 2026-09-13T08:30:00Z
  output: |
    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E13
  run_id: minted-cong-nguoi-doc-du-nguon-E13-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_ba_ben_goi
  verified_at: 2026-09-13T08:30:00Z
  output: |
    · ba bên gọi độc lập, mỗi mũi tiêm chỉ làm lệch đúng bên của nó
    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E18
  run_id: minted-cong-nguoi-doc-du-nguon-E18-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_coverage_bang
  verified_at: 2026-09-13T08:30:00Z
  output: |
    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_scripts_run_tests_sh-r7
  exit_code: 0
  verified_at: 2026-09-13T08:30:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_hooks_run_tests_sh-r7
  exit_code: 0
  verified_at: 2026-09-13T08:30:00Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r7
  exit_code: 0
  verified_at: 2026-09-13T08:30:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_workflows_run_tests_sh-r7
  exit_code: 0
  verified_at: 2026-09-13T08:30:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-node_scripts_product_map_mjs_root_check-r7
  exit_code: 0
  verified_at: 2026-09-13T08:30:00Z

## Known limits

Hai lỗi TRONG hợp đồng còn nguyên. Cả hai đều là fail-SILENT, và cả hai đều có
bán kính ĐO ĐƯỢC trên 1 243 hợp đồng thật của 22 kho — số dưới đây do chủ vòng
chạy tay, không lấy từ lời của tác tử.

- **`parseACBlock` cắt thân tiêu chí ở mọi dòng mở đầu bằng `#`** (AC-7). Một
  chú thích shell trong khối mã của thân tiêu chí đóng khối sớm; chữ sau đó mất,
  và tag `(cross-layer)` / `(judgment)` nằm sau khối mã cũng mất theo. Bộ dò
  điểm mù IM vì số tiêu chí bóc được vẫn đúng — chỉ THÂN bị cắt.
  *Bán kính hôm nay: 0.* Trong 1 243 hợp đồng có 35 hồ sơ khai tiêu chí bằng
  tiêu đề, và KHÔNG hồ sơ nào có dòng `#` trong thân tiêu chí.
  *Ngưỡng đang đếm:* ≥1 hợp đồng rơi vào hình dạng đó.
- **Nhánh văn xuôi của `contentLines` nuốt dòng tiêu đề vào đoạn** (AC-15). Thẻ
  in nguyên chuỗi `### Trục A` như chữ của hợp đồng, và dán chữ của hai mục con
  thành MỘT câu không có trong hợp đồng.
  *Bán kính hôm nay: 0.* Trong 244 mục Coverage, 22 mục đi qua nhánh văn xuôi, và
  KHÔNG mục nào chứa dòng tiêu đề.
  *Ngưỡng đang đếm:* ≥1 mục Coverage văn xuôi có tiêu đề con.

Lỗi thứ hai là HỒI QUY do chính bản vá ở commit liền trước (`a14b3dbd`), viết để
đóng một phát hiện của lượt 6. Trước bản vá ấy, dòng tiêu đề hiện thành một dòng
riêng trên thẻ — cũng sai, nhưng không dán câu.

## Ngoài hợp đồng

Bảy mục, xem `review-findings.md`. Nặng nhất và là mục DUY NHẤT có bán kính sống:
`feature-loop/scripts/carry-plan.mjs` giữ khuôn đọc tiêu chí riêng, nên nó là bộ
đọc thứ NĂM chưa ai khai. Chủ vòng đo tay: **9 trên 1 243 hợp đồng** có tiêu chí
xuyên lớp mà thư viện thấy còn nó không thấy.

## Analyst

carried tu round 6 — baseline khong do lai round nay

none — baseline không đo lại ở round này (mọi eval ghi `n-a`); danh sách
eval không-phân-biệt rỗng.

## Variance

none — every multi-run eval is uniform

## Iterations

**Lượt 5** (7 tiêu chí): bảy phép đo và năm lệnh suite xanh, nhưng rà soát trả 10
phát hiện đã xác nhận và bước phân loại phạm vi khai hỏng. Chủ vòng đo tay hai
phát hiện nặng nhất, dựng cây gốc bằng `git archive 86cc59df lib scripts`:

- Hợp đồng KHÔNG có mục tiêu chí, mục «Known limits» chứa `- AC-4:` và `- AC-9:`
  → cây gốc: 0 tiêu chí, cờ `blank`, dòng một-chạm khoá. Cây khi đó: ba tiêu chí
  trong đó hai là tiêu chí MA, cờ IM, dòng một-chạm mở sẵn `duyệt`. HỒI QUY
  mở-cổng ngay tại thẻ người bấm duyệt.
- Hợp đồng lành có tham chiếu chéo dạng tiêu đề → báo «Đọc THIẾU … đừng duyệt».
  Cảnh báo SAI, chiều an toàn.

DỪNG-VÁ nổ lần một. Owner chọn **lối 1 — thu phạm vi**.

**Lượt 6** (5 tiêu chí, sau nhát cắt): năm phép đo và năm lệnh suite xanh,
round-tally máy ghi PASS 10/10, 0 blocked. Rà soát trả 7 phát hiện. Chủ vòng
phân loại lại và vá BỐN mục, mỗi mục có đối chứng:

| Lỗ | Đo được | Sau khi vá |
|---|---|---|
| CN07 tuyên «14 ô» bằng chữ, không hằng nào ghim | xoá 2 hàng khỏi bảng → ca vẫn XANH | ghim số ngoài bảng; xoá hàng → ĐỎ có tên |
| GCV1b thôi phân biệt | thêm tên mục vào danh sách trên bản sao → hai cây in cùng chuỗi | fixture bullet bóc được; cây nới TẮT cờ |
| `contentLines` văn xuôi trả dòng thô | 3 hợp đồng ap-media-roadmap cụt câu | nối theo đoạn; 244 mục Coverage vẫn 0 báo thiếu oan |
| Hai script đo khai sai về đường dẫn | gốc corpus mặc định `~/dev` | tách hai vế cho đúng |

**Lượt 7** (cùng 5 tiêu chí, trên cây đã vá): năm phép đo và năm lệnh suite lại
xanh, `failed_evals` rỗng. Nhưng rà soát xác nhận HAI lỗi ĐÚNG hợp đồng mà ma
trận eval hiện tại không phủ tới — xem Known limits ở trên. Một trong hai là hồi
quy của chính bản vá lượt 6.

**DỪNG-VÁ nổ lần hai, và đây là lần thứ BA liên tiếp một lượt sửa đẻ ra lỗi cùng
lớp:** lượt 3→4 (phạm vi bộ đọc), lượt 4→5 (phạm vi bộ đọc, cùng hai mã AC-4/AC-9),
lượt 6→7 (bộ đọc nối dòng sai). Máy dừng, không vá tiếp; người chọn lối.
