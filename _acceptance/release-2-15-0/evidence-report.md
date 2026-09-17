---
schema_version: 2
feature_slug: release-2-15-0
verdict: REJECT
failed_evals: [E7b]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 74c55ba9a41695b8bde24cd415a1f1ee4932b11a
human_signoff:
---

# Evidence Report: release-2-15-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E1b | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | judgment | PASS |
| E7a | AC-7 | script | PASS |
| E7b | AC-7 | script | FAIL |
| E8 | AC-8 | script | PASS |
| E9a | AC-9 | script | PASS |
| E9b | AC-9 | judgment | PASS |
| E10a | AC-10 | test | PASS |
| E10b | AC-10 | test | PASS |
| E10c | AC-10 | test | PASS |
| E10d | AC-10 | test | PASS |
| E10e | AC-10 | script | PASS |
| E11 | AC-11 | judgment | PASS |
| E12a | AC-12 | script | PASS |
| E12b | AC-12 | script | PASS |
| E13a | AC-13 | script | PASS |
| E13b | AC-13 | script | PASS |
| E13c | AC-13 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-release-2-15-0-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.p200_cat_so_2_15
  verified_at: 2026-09-17T09:00:00Z
  output: |
    P200 OK (so doc tu manifest — khong ghim mot moc; 5/5 dot bien chay that, moi cai ghim dung cau; doi chung duong ban-sao-nguyen-ven)
      PASS: P200 mot lan cat so nhat quan: hai plugin cung so · GUIDE dan xuat · muc mo ta cua chinh so do (5 dot bien, mot loi thoat)
    PASS: P200 xanh (dung 1 dong PASS cua chinh no; phan quyet KHONG lay tu ma thoat tron suite; rang ban 8ee01482)

- eval: E1b
  run_id: minted-release-2-15-0-E1b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.so_tang_2_15
  verified_at: 2026-09-17T09:00:00Z
  output: |
    [neo] so tai commit dua ho so moc vao kho (836691f2) = 2.14.0 · so trong cay lam viec = 2.15.0
    PASS: so trong cay (2.15.0) TANG theo semver so voi so tai commit dua ho so moc vao kho (836691f2) = 2.14.0 — neo suy TU KHO, khong ghim sha

- eval: E2
  run_id: minted-release-2-15-0-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moc_diagram_2_15
  verified_at: 2026-09-17T09:00:00Z
  output: |
    PASS: diagram-design KHONG doi ke tu lan cat so gan nhat (06331ab21336904104f2418ead20d9944894caad), so doc duoc tai HEAD la 2.7.0 (doi chung duong: cua so moc..HEAD KHONG rong; bo loc diagram-design/ con khop vat; rang ban c418ca35)

- eval: E3
  run_id: minted-release-2-15-0-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vdg_nhom_moi_2_15
  verified_at: 2026-09-17T09:00:00Z
  output: |
    PASS: VDG10 chiều đỏ: gỡ phép hỏi tổ tiên → hồ sơ đã merge quay về «đang viết code» (thẻ lại mời viết code)
    Results: 11 passed, 0 failed (vat-da-o-nhanh-goc)

- eval: E4
  run_id: minted-release-2-15-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vdg_im_2_15
  verified_at: 2026-09-17T09:00:00Z
  output: |
    PASS: VDG10a bản sao CHƯA phá cho đúng nhóm mới (bản sao chạy được)
    PASS: VDG10 chiều đỏ: gỡ phép hỏi tổ tiên → hồ sơ đã merge quay về «đang viết code» (thẻ lại mời viết code)
    Results: 11 passed, 0 failed (vat-da-o-nhanh-goc)

- eval: E5
  run_id: minted-release-2-15-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vdg_chieu_do_2_15
  verified_at: 2026-09-17T09:00:00Z
  output: |
    PASS: VDG10a bản sao CHƯA phá cho đúng nhóm mới (bản sao chạy được)
    PASS: VDG10 chiều đỏ: gỡ phép hỏi tổ tiên → hồ sơ đã merge quay về «đang viết code» (thẻ lại mời viết code)
    Results: 11 passed, 0 failed (vat-da-o-nhanh-goc)

- eval: E6
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  votes:
    - domain-correctness: PASS — Khối START-VAT-DA-O-NHANH-GOC + bước 4 nói rõ "KHÔNG đưa lệnh resume trơn" cho dòng vat-da-o-nhanh-goc: lối «đóng theo quan sát» không đưa lệnh resume nào (chỉ nhắc rồi KẾT THÚC), lối «chấm lại» đưa `/feature-loop:feature-loop <slug>` nhưng LUÔN kèm đúng một câu dặn bắt buộc (đặt status: implemented trước, vào thẳng S4, không viết lại code) — không phải lệnh trơn. Hai lối được gộp vào đúng MỘT câu hỏi chọn ở bước 4, đúng điều khoản một-câu-hỏi-chọn; nhãn dùng nguyên văn từ bảng trạng thái.
    - operational-feasibility: PASS — commands/start.md dòng 208-215 nói thẳng "KHÔNG đưa lệnh resume trơn": lối «đóng theo quan sát» không đưa lệnh nào, lối «chấm lại» có đưa lệnh nhưng LUÔN kèm câu dặn bắt buộc. Khối START-VAT-DA-O-NHANH-GOC và bảng chữ trạng thái khớp nhau, và tự khai "Hai lối nằm trong CÙNG câu hỏi chọn ở bước 4, không thêm câu hỏi".
    - spec-alignment: PASS — Khối START-VAT-DA-O-NHANH-GOC và bảng trạng thái đều buộc in HAI lối chọn tường minh, `nextStep: null`, cấm in "viết code"/"lập kế hoạch". Điều khoản bàn giao bước 4 nói thẳng "KHÔNG đưa lệnh resume trơn", và lối «chấm lại» chỉ bàn giao kèm đúng một câu dặn bắt buộc. Không có đường nào trong bốn lối mời resume trơn vào hồ sơ đã duyệt có vật đã merge.
  rationale: Ba lens đồng thuận PASS — cả hai lối bàn giao ở bước 4 nằm trong một câu hỏi chọn duy nhất, không thêm cổng, và lối «chấm lại» luôn kèm câu dặn bắt buộc thay vì lệnh resume trơn.

- eval: E7a
  run_id: minted-release-2-15-0-E7a-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.chup_ca_2_15
  verified_at: 2026-09-17T09:00:00Z
  output: |
    PASS: CH4 suite THÊM tệp vào hồ sơ máy thông không được ghim → ĐỎ gọi tên tệp «thêm»
    PASS: CH5 sau khi dọn: cùng lệnh xanh của CH1 với --write → exit 0, recheck xanh (răng không để lại trạng thái)
    chup-ho-so-da-thong: 6 passed, 0 failed

- eval: E7b
  run_id: minted-release-2-15-0-E7b-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.script.chup_cay_that_2_15
  verified_at: 2026-09-17T09:00:00Z
  output: |
    cmd: node _acceptance/release-2-15-0/rang-chup-cay-that.mjs --chan cay-that
    FAIL(2): cây chấm có 1 tệp chưa commit ngoài _acceptance/ — worktree tại HEAD 74c55ba9 không phải vật đang chấm:
      - tests/hooks/fixtures/repo/_acceptance/rl-repin/

- eval: E8
  run_id: minted-release-2-15-0-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.mot_nguon_2_15
  verified_at: 2026-09-17T09:00:00Z
  output: |
    PASS: mot-nguon DA_THONG_CONG_2 — hang AG-ENGINE co (15 hang) · GL03 xanh · khoi gach ho so da ky 16 dong, khong dong nao cho rang chup ho so · module khong go tay trang thai, 2 tep khong chua chuoi RT13 quet (doi chung: lib va tep ca RT13 co) · RT13 xanh

- eval: E9a
  run_id: minted-release-2-15-0-E9a-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vong_meta_2_15
  verified_at: 2026-09-17T09:00:00Z
  output: |
    vong-meta-dang-mo: 5 passed, 0 failed

- eval: E9b
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  votes:
    - domain-correctness: PASS — Khối START-VONG-META tự khai rõ: dòng đếm "không phải cổng", "Máy KHÔNG chọn hộ và không chặn gì" — và bước 4 liệt kê đúng 4 nhánh chọn, dòng vòng meta không nằm trong danh sách đó. Ca `metaOpen.n` là `null` có dòng riêng "chưa đọc được mốc gần nhất nên chưa đếm được... (ĐỪNG in 0 — chưa biết khác hẳn không có)".
    - operational-feasibility: PASS — Dòng này chỉ hiện khi metaOpen.applies=true, và với mọi giá trị của metaOpen.n/flag đều có chuỗi in sẵn cụ thể — không có nhánh nào biến nó thành câu hỏi hay thành cổng ("dòng này không phải cổng" ghi thẳng). Ca null được xử lý tách bạch khỏi số 0.
    - spec-alignment: PASS — "dòng này không phải cổng" và "Máy KHÔNG chọn hộ" — cảnh báo `metaOpen.flag` chỉ là một câu thông báo dưới thẻ, không phải câu hỏi mới. Trường hợp `metaOpen.n` là `null` được xử lý tường minh bằng câu "chưa đọc được mốc gần nhất..." đúng khuôn "chưa biết ≠ 0".
  rationale: Ba lens đồng thuận PASS — dòng vòng meta không phải cổng, không tự chọn hộ, và ca null được phân biệt tường minh khỏi số 0.

- eval: E10a
  run_id: minted-release-2-15-0-E10a-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-09-17T09:00:00Z
  output: |
      PASS: SELF02 (doi chung duong: phep quet bat duoc loi khi no CO that)

    Results: 876 passed, 0 failed

- eval: E10b
  run_id: minted-release-2-15-0-E10b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-09-17T09:00:00Z
  output: |
      PASS: V16

    Results: 70 passed, 0 failed

- eval: E10c
  run_id: minted-release-2-15-0-E10c-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-09-17T09:00:00Z
  output: |
    MUTANT-6 bi bat: doc_manifest() FAIL-LOUD ghim 'site thieu so ban: feature-loop/skills/feature-loop/SKILL.md'
    Results: all plugin tests passed

- eval: E10d
  run_id: minted-release-2-15-0-E10d-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-09-17T09:00:00Z
  output: |
    Results: 15 passed, 0 failed (vung-vat-mutants)

    Results: all workflow tests passed

- eval: E10e
  run_id: minted-release-2-15-0-E10e-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-09-17T09:00:00Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E11
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  votes:
    - domain-correctness: FAIL — Bốn khối đủ mặt, bảng đủ bốn cột, năm phép đối chiếu khớp, bảy điều bất lợi đều nói thẳng, §4 đủ năm nhát cắt và hai định đoạt R2 có lý do — đạt. Nhưng criterion đòi "mỗi ô có nguồn rút hoặc «không đo được» kèm lý do", và bảng năm dòng vi phạm ở nhiều ô: dòng 4b (cột crm, vòng meta, ba việc chip) và dòng 5 (cột crm) chỉ ghi bare "không đo được" không kèm lý do, trong khi các ô "không đo được" khác trong cùng bảng đều có lý do đi kèm — thiếu sót có hệ thống.
      required_evidence:
        - "contract.md dòng 321 (bảng Notes §1, dòng '4b ba khối'): ba ô cột crm/vòng meta/ba việc chip chỉ ghi 'không đo được' trần trụi, cần sửa thành 'không đo được — <lý do>'"
        - "contract.md dòng 322 (bảng Notes §1, dòng '5 phút máy/lượt chấm'): ô cột crm ghi bare 'không đo được' trong khi ô cột vòng meta ngay bên cạnh có lý do — cần thêm lý do tương tự"
    - operational-feasibility: PASS — Bốn khối Notes đều có mặt; bảng năm dòng đúng bốn cột; cả năm phép đối chiếu bắt buộc khớp; bảy điều bất lợi xuất hiện nguyên vẹn; §4 gọi tên đủ năm nhát cắt, định đoạt hai mục T1 của R2 kèm lý do, giữ R3 không chạy chiến dịch. Ghi nhận nhỏ (ba ô "không đo được" thiếu lý do inline) không đủ đổi verdict vì lý do chung đã nói ở dòng 4 cùng bảng.
    - spec-alignment: PASS — Bốn khối Notes đủ mặt, bảng đủ 4 cột, cả NĂM phép đối chiếu khớp đúng từng chữ số với nguồn được giao; bảy điều bất lợi xuất hiện nguyên văn; §4 gọi tên đủ năm nhát cắt và định đoạt hai mục T1 của R2. Một ô nhỏ thiếu lý do tường minh không nằm trong bốn phép đối chiếu được giao và không đủ trọng lượng để lật verdict.
  rationale: Panel đề xuất PASS 2-1. Dissent (domain-correctness) nêu đúng một khoảng hở literal — ba ô "không đo được" ở dòng 4b/5 của bảng Notes §1 (cột crm/vòng meta/ba việc chip) thiếu lý do inline, khác với sibling cells cùng bảng có lý do — trong khi hai lens còn lại cho rằng lý do chung đã nói ở dòng 4 cùng bảng nên không đủ để lật verdict tổng.

- eval: E12a
  run_id: minted-release-2-15-0-E12a-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cua_so_vendored_2_15
  verified_at: 2026-09-17T09:00:00Z
  output: |
    PASS: vendored 9 tep chep CI (rut tu INIT-CI-COPY-LIST) KHONG doi ke tu lan cat so 2.14.0 (45b72057) toi cay lam viec (doi chung: cua so tren toan kho co 94 tep doi)

- eval: E12b
  run_id: minted-release-2-15-0-E12b-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cua_so_viec_meta_2_15
  verified_at: 2026-09-17T09:00:00Z
  output: |
    PASS: viec-meta 1 ho so vong sinh sau lan cat so 2.14.0 (45b72057) BANG khoi khai [guide-chep-ci-buoc-vao-writer] · the mo phien tren cay that: vong meta dang mo n=0 [rong]

- eval: E13a
  run_id: minted-release-2-15-0-E13a-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.khuon_goal_2_15
  verified_at: 2026-09-17T09:00:00Z
  output: |
    PASS: khuon-goal khac khuon tai lan cat so 2.14.0 (45b72057) o 2 dong · mau-goal/khuon-cu.txt bang khuon rut tu neo

- eval: E13b
  run_id: minted-release-2-15-0-E13b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.goal_the_2_15
  verified_at: 2026-09-17T09:00:00Z
  output: |
    PASS: GL05 khuon gate-card == khuon SKILL feature-loop (sau strip) — ban chep thu ba khong troi

    Results: 7 passed, 0 failed (gate-card-goal)

- eval: E13c
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: PASS
  votes:
    - domain-correctness: PASS — Khuôn GOAL-TEMPLATE mới đặt đúng cả hai dạng dừng vào vế "chờ input người", nói rõ vế ấy gồm dừng GIỮA vòng khi máy nêu đích danh tiền đề chỉ người gỡ được HOẶC nêu lối để người chọn, kèm câu chốt phủ định. Bốn mẫu A/B/C/D đọc dứt khoát theo đúng bốn tiêu chí, không mẫu nào ở vùng xám.
    - operational-feasibility: PASS — Khuôn mới gộp đúng vế "chờ input người" cả hai loại dừng, giữ điều kiện hẹp, cộng câu phủ định tường minh — không thêm lối dừng nào khác, không nhắm signed-off. Mẫu A và B rõ ràng thoả; mẫu C và D rơi thẳng vào câu phủ định.
    - spec-alignment: PASS — So với khuôn cũ chỉ thêm đúng một mệnh đề vào vế "chờ input người"; không có lối dừng mới nào khác ngoài ba nhóm cũ, đích vẫn là status: verified. Áp khuôn mới vào bốn mẫu cho kết quả dứt khoát đúng như mô tả.
  rationale: Ba lens đồng thuận PASS — khuôn mới chỉ thu hẹp đúng vào vế "chờ input người" đã có, không mở lối dừng mới, và phân loại đúng cả bốn mẫu thử A/B/C/D.

## Known limits

## Ngoài hợp đồng

## Analyst

E10a, E10b, E10c, E10d, E10e — green trên cả HEAD lẫn diffBase (regression-guard suites chạy trọn kho mỗi vòng, không gắn riêng vào feature này; đây là hồi quy có chủ ý, không phải eval không phân biệt được của chính feature).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E7b failed — cây chấm tại HEAD 74c55ba9 có một tệp chưa commit ngoài `_acceptance/` (`tests/hooks/fixtures/repo/_acceptance/rl-repin/`), nên `rang-chup-cay-that.mjs` từ chối coi worktree là vật đang chấm và thoát mã 2. REJECT, quay lại triển khai để commit hoặc dọn tệp đó trước khi chạy lại S4.
