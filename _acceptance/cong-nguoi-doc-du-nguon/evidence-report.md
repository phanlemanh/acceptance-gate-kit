---
schema_version: 2
feature_slug: cong-nguoi-doc-du-nguon
verdict: PASS
failed_evals: []
reason:
verified_by: máy — rút từ nhật ký lượt chấm 8, không gọi lại tác tử rà soát
enforcement_mode: strict
bypass_used: false
verified_commit: b950f6643e253a691021612b5c5cabfe86cc4dda
human_signoff: Phan Le Manh 2026-09-13
---

# Evidence Report: cong-nguoi-doc-du-nguon

Verdict rút từ chính nhật ký máy của lượt chấm 8, theo đúng luật owner duyệt
13/09: **verdict chỉ đỏ khi phép đo hoặc lệnh suite đỏ.** Không gọi lại tác tử.

Mười lệnh máy của lượt 8 (5 phép đo + 5 lệnh suite): chín xanh ngay, một đỏ và đã
được phân lớp là HẠ TẦNG bằng máy (xem Known limits). Không lệnh nào bị chặn,
không phép đo nào cần mắt người, không lệnh nào có phương sai. Nên verdict là PASS.

Mã của cây KHÔNG đổi giữa lúc chấm (`9eaa6f5f`) và lúc viết báo cáo này
(`53611a17`): `git diff 9eaa6f5f..53611a17 -- lib scripts tests feature-loop
commands skills hooks vendor` trả rỗng; commit ở giữa chỉ chạm `_acceptance/`.

Sau đó commit chữ ký `3a77f000` có chạm một tệp ngoài `_acceptance/` —
`tests/scripts/fixtures/routing-baseline.txt`, dòng mốc định tuyến mà ca LM20 đòi
cho một hồ sơ vừa ký. Lưới trước-merge gọi đúng tên chuyện đó là «evidence is
stale», nên làn ghim lại đã chạy trên `3a77f000` và `verified_commit` ở trên là
kết quả của làn ấy: năm lệnh suite và năm phép đo đều đạt. Xem `### Re-pin lần 1`.

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
  baseline: n-a
  verifier: config:executors.script.cndn_ac_tieu_de
  verified_at: 2026-09-13T10:06:22Z
  output: |
    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E8
  run_id: minted-cong-nguoi-doc-du-nguon-E8-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_tieu_de_muc
  verified_at: 2026-09-13T10:06:22Z
  output: |
    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E9
  run_id: minted-cong-nguoi-doc-du-nguon-E9-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_bo_do_khong_im
  verified_at: 2026-09-13T10:06:22Z
  output: |
    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E13
  run_id: minted-cong-nguoi-doc-du-nguon-E13-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_ba_ben_goi
  verified_at: 2026-09-13T10:06:22Z
  output: |
    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

- eval: E18
  run_id: minted-cong-nguoi-doc-du-nguon-E18-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cndn_coverage_bang
  verified_at: 2026-09-13T10:06:22Z
  output: |
    Results: 1 passed, 0 failed (cong-nguoi-doc-du-nguon)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_scripts_run_tests_sh-r8
  exit_code: 0
  verified_at: 2026-09-13T10:06:22Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_hooks_run_tests_sh-r8
  exit_code: 0
  verified_at: 2026-09-13T10:06:22Z

- cmd: bash -c 'set -o pipefail; bash tests/plugins/run-tests.sh 2>&1 | grep -E "FAIL|^Results:" | tail -n 40'
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_plugins_run_tests_sh_2_1_grep-r8-recheck
  exit_code: 0
  verified_at: 2026-09-13T12:00:13Z
  phan_lop: ha-tang — chi tiết ở Known limits

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-bash_tests_workflows_run_tests_sh-r8
  exit_code: 0
  verified_at: 2026-09-13T10:06:22Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-cong-nguoi-doc-du-nguon-SUITE-node_scripts_product_map_mjs_root_check-r8
  exit_code: 0
  verified_at: 2026-09-13T10:06:22Z

## Known limits

**Một lệnh suite của lượt 8 đỏ vì HẠ TẦNG, không vì vật.** Lệnh
`tests/plugins/run-tests.sh` qua bọc `grep` trả về mã khác 0 trong tác tử. Phân
lớp bằng máy, hai chân độc lập:

1. `_acceptance/cong-nguoi-doc-du-nguon/phan-lop-ha-tang.cjs` đọc ĐÚNG chuỗi lệnh
   từ nhật ký (không nhận `--cmd`, để không ai gõ lại một lệnh khác), chạy lại tại
   cùng gốc kho hai lần: **cả hai đều xanh**. Dòng kết quả nằm trong `run-log.jsonl`
   dưới `kind: "infra-recheck"`, do script ghi, không gõ tay.
2. Nhật ký workflow của lượt 8 ghi nguyên văn cho ĐÚNG tác tử chạy lệnh đó:
   *«[machine:bash -c 'set -o pipefail; bash tests/plu] [harness: subagent output
   matched instruction-shaped pattern(s): permissions-allow-deny …]»* — tức đầu ra
   bị hạ tầng trung hoà trước khi tác tử đọc được.

Đây là lượt thứ HAI trong vòng này hạ tầng tự sinh tín hiệu đỏ (lượt 5 đọc
`MODULE_NOT_FOUND` thành «đỏ có phân biệt»). Cả hai đếm vào dòng «hạ tầng đốt lượt
chấm» của mốc phát hành.

*Giới hạn của chính bộ phân lớp, đo được:* nó không phân biệt «hạ tầng» với «lệnh
chập chờn». Đo bằng lệnh 50/50, chạy 6 lượt ở `--lan 2`: 1 lượt gọi nhầm thành
hạ tầng. Vì thế phân lớp này chỉ đứng được nhờ có chân thứ hai ở trên.

**Hai giới hạn của vật, đều fail-SILENT, bán kính đo tay bằng 0:**

- **Khối mã trong thân tiêu chí chứa một dòng tiêu đề h2..h6 vẫn cắt thân.** Luật
  đóng khối nay là MỘT nguồn với `lib/md-section.cjs` nên chú thích shell `# …`
  thôi cắt thân; nhưng khối mã trích markdown có dòng `## …` thì vẫn đóng sớm, vì
  không bên duyệt nào theo dõi hàng rào ```. *Bán kính:* **0** trên 35 hồ sơ khai
  tiêu chí bằng tiêu đề. *Ngưỡng đang đếm:* ≥1 hồ sơ rơi vào hình dạng đó.
- **Nhánh BẢNG của `contentLines` chưa lọc dòng tiêu đề.** Một mục Coverage vừa có
  bảng vừa có tiêu đề con sẽ đẩy nguyên chuỗi `### Trục A` lên thẻ. Cùng MỘT luật
  với hai nhánh kia; lượt 7 tôi áp cho một nhánh thay vì quét cả ba. *Bán kính:*
  **0** — 244 mục Coverage, 7 mục đi nhánh bảng, 0 mục có dòng tiêu đề. *Ngưỡng
  đang đếm:* ≥1 mục bảng có tiêu đề con.

## Ngoài hợp đồng

Tám mục, xem `review-findings.md`. Hai mục có bán kính SỐNG, cả hai đã có ô:

| Bộ đọc | Bán kính đo tay | Trạng thái |
|---|---:|---|
| `scripts/pre-merge-check.sh` (thứ TƯ) | 2 hợp đồng | ô mở, hoãn vì DV5 chỉ-được-thêm |
| `feature-loop/scripts/carry-plan.mjs` (thứ NĂM) | 9 hợp đồng | ô mở, owner quyết hoãn 13/09 |

Sáu mục còn lại là lỗ đo-thước của các tệp ca khác, bán kính 0 với hồ sơ này.

## Analyst

none — baseline đo lại ở lượt 8, không eval nào xanh cả hai phía.

## Variance

none — every multi-run eval is uniform

## Iterations

**Lượt 5** (7 tiêu chí): mọi phép đo xanh, rà soát trả 10 phát hiện, phân loại
phạm vi khai hỏng. Chủ vòng đo tay hai phát hiện nặng nhất trên cây gốc dựng bằng
`git archive 86cc59df lib scripts`: hợp đồng không có mục tiêu chí cho ra tiêu chí
MA trên thẻ Cổng Phạm vi với cờ điểm-mù IM và dòng một-chạm mở sẵn. HỒI QUY
mở-cổng. DỪNG-VÁ nổ lần một; owner chọn **thu phạm vi**.

**Lượt 6** (5 tiêu chí, sau nhát cắt): mọi phép đo và lệnh suite xanh, round-tally
máy ghi PASS 10/10. Rà soát trả 7 phát hiện; chủ vòng vá bốn, mỗi bản vá có đối
chứng đã chạy.

**Lượt 7**: mọi phép đo xanh; rà soát xác nhận hai lỗi trong hợp đồng, một trong
đó là hồi quy của chính bản vá lượt 6. DỪNG-VÁ nổ lần hai; owner chọn **hợp nhất
luật tiêu đề về một nguồn**, kèm trần cứng «lượt 8 là lượt cuối».

**Lượt 8**: năm phép đo xanh; bốn lệnh suite xanh; lệnh suite thứ năm đỏ vì HẠ
TẦNG (đã phân lớp ở trên). Rà soát trả 9 phát hiện, **một** trong hợp đồng và ở
mức `low` — mức đó không chạm nhánh lật verdict của workflow
(`acceptance-verify.js:1042` chỉ lật khi có mục `high` trong hợp đồng). Tức
verdict REJECT của lượt 8 dựng HOÀN TOÀN trên lệnh hạ tầng kia.

**Khép vòng, không chấm lượt 9.** Owner quyết 13/09 sau khi đọc ba dòng số của
vòng: 8 lượt chấm và 9 lần gọi người so trần 3 và 4, trong khi giá trị đo được
đứng yên từ lượt 5. Luật áp dụng: verdict chỉ đỏ khi phép đo hoặc lệnh suite đỏ;
lệnh đỏ-trong-tác-tử mà xanh-khi-chạy-lại là hạ tầng, loại khỏi verdict. Sáu ngả
sửa cho chính kit đã vào ô `_acceptance/thuoc-khong-lat-verdict/`.

**Giá trị giao, đo trên 1 243 hợp đồng thật của 22 kho:**

| Trục | lớp CŨ | lớp MỚI |
|---|---:|---:|
| Hợp đồng thẻ đọc THÊM được tiêu chí | 0 | 139 |
| Số tiêu chí đọc thêm | 0 | 1 110 |
| Hồi quy đọc thiếu | 0 | 0 |
| Hợp đồng sinh tiêu chí MA | 0 | 0 |
| Cờ điểm-mù bị làm im | 0 | 0 |
| Mục Coverage bị báo thiếu OAN | 29 | 0 |

### Re-pin lần 1 — 2026-09-13, do hoá cũ do chính commit chữ ký
run_id: repin-20260913T134934Z-50272
sha: 3a77f000333c609c14adde17a24c784d5cfc87dd · suites: 5 lệnh exit 0 · evals: 5/5 eval máy đạt kỳ vọng

### Re-pin lần 2 — 2026-09-18, do chiến dịch ghim lại theo LÔ sau mốc 2.16.0 — lô lo-aa, 15 hồ sơ
run_id: repin-20260918T121643Z-87929
sha: b950f6643e253a691021612b5c5cabfe86cc4dda · suites: 5 lệnh exit 0 · evals: 5/5 eval máy đạt kỳ vọng
