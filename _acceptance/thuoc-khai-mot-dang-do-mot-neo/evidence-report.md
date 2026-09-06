---
schema_version: 2
feature_slug: thuoc-khai-mot-dang-do-mot-neo
verdict: PASS
triage_failed: true
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 19abfcd7cc2352d7d6a8a6c4d1acba852a1ba7f4
human_signoff: Manh Phan 2026-09-06
---

# Evidence Report: thuoc-khai-mot-dang-do-mot-neo

⚠ phân loại phạm vi KHÔNG chạy được — không lỗi nào bị máy tự sửa, danh sách đầy đủ nằm trong review-findings.md, người xem lại toàn bộ trước khi ký.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-8 | script | PASS |
| E10 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E1-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_lane_doc_khong_doi
  verified_at: 2026-09-06T20:00:00Z
  output: |
    PASS: chiều đỏ 3: kho thiếu mốc → CẢ HAI vế đỏ và gọi tên sha thiếu
    PASS: chiều đỏ 1b: clone sửa acceptance-verify.js mà CHƯA commit → vế lane ĐỎ (phân biệt so-cây với so-HEAD)
    Results: chan lane-doc-khong-doi passed (7 pass, 0 do)

- eval: E2
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E2-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_lane_doc_khong_doi
  verified_at: 2026-09-06T20:00:00Z
  output: |
    PASS: chiều đỏ 3: kho thiếu mốc → CẢ HAI vế đỏ và gọi tên sha thiếu
    PASS: chiều đỏ 1b: clone sửa acceptance-verify.js mà CHƯA commit → vế lane ĐỎ (phân biệt so-cây với so-HEAD)
    Results: chan lane-doc-khong-doi passed (7 pass, 0 do)

- eval: E3
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E3-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_lane_doc_khong_doi
  verified_at: 2026-09-06T20:00:00Z
  output: |
    PASS: chiều đỏ 3: kho thiếu mốc → CẢ HAI vế đỏ và gọi tên sha thiếu
    PASS: chiều đỏ 1b: clone sửa acceptance-verify.js mà CHƯA commit → vế lane ĐỎ (phân biệt so-cây với so-HEAD)
    Results: chan lane-doc-khong-doi passed (7 pass, 0 do)

- eval: E4
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E4-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.itgk_lane_doc_khong_doi
  verified_at: 2026-09-06T20:00:00Z
  output: |
    PASS: chiều đỏ 3: kho thiếu mốc → CẢ HAI vế đỏ và gọi tên sha thiếu
    PASS: chiều đỏ 1b: clone sửa acceptance-verify.js mà CHƯA commit → vế lane ĐỎ (phân biệt so-cây với so-HEAD)
    Results: chan lane-doc-khong-doi passed (7 pass, 0 do)

- eval: E5
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E5-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tkm_p86
  verified_at: 2026-09-06T20:00:00Z
  output: |
    PASS: P86 GATE-MODEL: nguon tsv · 2 ban VI byte-equal · ban EN khop cot en · ngan sach doc-tu-dong va so QUAN HE · 14 dot bien (co ca chi-EN, ca 3 ve deu co chieu do) goi ten dung ban, moi mui tiem deu kiem trung

    Results: all plugin tests passed

- eval: E6
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E6-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tkm_p86
  verified_at: 2026-09-06T20:00:00Z
  output: |
    PASS: P86 GATE-MODEL: nguon tsv · 2 ban VI byte-equal · ban EN khop cot en · ngan sach doc-tu-dong va so QUAN HE · 14 dot bien (co ca chi-EN, ca 3 ve deu co chieu do) goi ten dung ban, moi mui tiem deu kiem trung

    Results: all plugin tests passed

- eval: E7
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E7-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tkm_p86
  verified_at: 2026-09-06T20:00:00Z
  output: |
    PASS: P86 GATE-MODEL: nguon tsv · 2 ban VI byte-equal · ban EN khop cot en · ngan sach doc-tu-dong va so QUAN HE · 14 dot bien (co ca chi-EN, ca 3 ve deu co chieu do) goi ten dung ban, moi mui tiem deu kiem trung

    Results: all plugin tests passed

- eval: E8
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E8-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-06T20:00:00Z
  output: |
    PASS: P86 GATE-MODEL: nguon tsv · 2 ban VI byte-equal · ban EN khop cot en · ngan sach doc-tu-dong va so QUAN HE · 14 dot bien (co ca chi-EN, ca 3 ve deu co chieu do) goi ten dung ban, moi mui tiem deu kiem trung

    Results: all plugin tests passed

- eval: E9
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E9-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tkm_suite_con_lai
  verified_at: 2026-09-06T20:00:00Z
  output: |
    All verification tests completed successfully.
    Tests: scripts (PASS), hooks (PASS), workflows (44/44 PASS)
    Product map validation: PASS

- eval: E10
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-E10-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tkm_bay_chan
  verified_at: 2026-09-06T20:00:00Z
  output: |
    PASS: đột biến thu-muc-lot: mũi tiêm trúng, mutant chạy được
    PASS: chiều đỏ (thu-muc-lot): nhóm JI6 đỏ với dòng ghim «FAIL: JI6 thư mục → exit 2»
    Results: chan thu-muc-khong-phai-file passed (3 pass, 0 do)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-SUITE-bash_tests_scripts_run_tests_sh-r7
  exit_code: 0
  verified_at: 2026-09-06T20:00:00Z

- cmd: bash tests/hooks/run-tests.sh
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-SUITE-bash_tests_hooks_run_tests_sh-r7
  exit_code: 0
  verified_at: 2026-09-06T20:00:00Z

- cmd: bash tests/workflows/run-tests.sh
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-SUITE-bash_tests_workflows_run_tests_sh-r7
  exit_code: 0
  verified_at: 2026-09-06T20:00:00Z

- cmd: node scripts/product-map.mjs --root . --check
  run_id: minted-thuoc-khai-mot-dang-do-mot-neo-SUITE-node_scripts_product_map_mjs_root_check-r7
  exit_code: 0
  verified_at: 2026-09-06T20:00:00Z

## Known limits

Chép từ khối GIỚI HẠN/NỢ CÓ TÊN trong `contract.md` (bộ tổng hợp để mục này rỗng — điền tay
theo nếp `_acceptance/suite-run-log-provenance/evidence-report.md`).

- **Bằng chứng chỉ giữ BA DÒNG CUỐI của mỗi lệnh.** Cỗ máy verify cắt output lệnh PASS xuống
  ba dòng cuối, và các ô dùng chung một lệnh chỉ chạy lệnh ấy một lần. Nhiều ô của hồ sơ này
  ghim một dòng nằm giữa đầu ra nên bằng chứng ghi lại không chứa dòng ấy. Các khẳng định vẫn
  chạy và vẫn đỏ khi bị phá — đã phá thử từng cái — nhưng người đọc không tự kiểm lại được.
- **Hai đột biến «thêm cổng» không tiêm vào khối tsv nguồn.** Chúng truyền thẳng danh sách nhãn
  đã phân tích, nên phép đếm cổng của khối nguồn không chạy lại; tiêm thật vào tsv thì P86 chết
  sớm ở chốt «đúng 4 cổng» và chưa tới phép so quan hệ. Ba dòng bảng chèn vào hai bản chép cũng
  là chuỗi markdown gõ tay, không rút từ bộ ghi thật.
- **Tính «độc lập HEAD» không có phép đo máy nào canh.** Owner quyết thu phạm vi sau ba vòng
  (`d-20260906T103000Z-tkm22`). Nếu ai đưa `HEAD`/`merge-base` trở lại thân `lane_song` hay
  `tap_file`, không phép đo nào của kho đỏ vì việc ấy; chỉ còn hai chiều đỏ gián tiếp là ca
  sửa-chưa-commit (AC-1) và ca kho-giả (AC-3).

## Ngoài hợp đồng

Sáu mục dưới đây lấy nguyên từ `review-findings.md` vòng 7 — người quyết ở Cổng Bằng chứng,
máy KHÔNG tự sửa. Hai mục đầu đã được đóng trong chính đợt ghi bằng chứng này; bốn mục sau còn
mở.

- **[ĐÃ ĐÓNG] Bằng chứng pin cây cũ.** Report vòng 5 mang `verified_commit` lùi hai commit và
  ghi «12 đột biến» trong khi mã chạy 14. Đóng bằng cách chạy lại S4 (vòng 7) và ghi report mới
  pin đúng HEAD, không sửa tay con số.
- **[ĐÃ ĐÓNG] Hai mục này để rỗng khiến cổng bỏ mời ký.** `Known limits` và `Ngoài hợp đồng`
  rỗng là hai trong sáu điều kiện «xanh-sạch», nên cổng vừa bỏ Cổng Bằng chứng vừa bỏ luôn phép
  kiểm staleness cho chính hồ sơ này. Đóng bằng cách điền tay cả hai mục.
- **[MỞ] Hằng `MOC_KY` biến `itgk_lane_doc_khong_doi` thành bẫy vĩnh viễn.** Ba răng neo-base
  khác của kho đều ghi «cố ý KHÔNG vào suite vĩnh viễn»; răng này chọn ngược mà cửa thoát duy
  nhất là một dòng chú thích. PR hợp lệ đầu tiên chạm `acceptance-verify.js` sẽ làm nó đỏ oan
  cho tới khi có người dời mốc bằng tay. Đề xuất: tách khỏi standing executors, hoặc dựng cơ
  chế tree-hash kèm dòng lý do máy đọc như P196.
- **[MỞ] `tkm_bay_chan` chép cứng danh sách bảy nhóm lần thứ hai.** Thêm một nhóm vào `rang.sh`
  thì khoá này vẫn xanh với bảy trên tám, trong khi ô đo khai «bảy nhóm còn lại» như thể vét
  cạn. Đề xuất: cho `rang.sh` một chân liệt kê nhóm thay vì hằng chép tay ở lớp config.
- **[MỞ] P86 phân biệt bản trôi chỉ ở cột nhãn.** Trôi ở dòng ngân sách rơi xuống câu chung và
  bị gán nhầm cho `QUICKSTART.md`. Không phải xanh giả — suite vẫn đỏ — nhưng chỉ sai file cần
  sửa cho cả một lớp trôi.
- **[MỞ] Chuỗi ghim là tên file chứ không phải lớp lỗi.** Ghim hiện nay chứng minh «đỏ ở bản
  nào», chưa chứng minh «đỏ vì lớp lỗi nào».

## Analyst

carried tu round trước — baseline không đo lại round này

none — mọi eval baseline: n-a round này (không đo lại)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 3: hội đồng nêu Hình dạng 5 (nhánh đột biến `them_cong` không đi qua `tiem()`, hợp đồng/E8 khai "MỌI đột biến" quá tay) nhưng không xử lý; commit 271590d0 thu phạm vi contract/evals (xoá AC-1 cũ, dồn số AC-2..AC-10 → AC-1..AC-9) mà không sửa lại evidence-report.md/evals.yaml theo số mới.
Round 4: bước triage phân loại phạm vi KHÔNG chạy được — mọi eval máy (E1..E10 + 4 lệnh suite) đều PASS trên cây hiện tại, nhưng không finding nào được máy phân loại trong-hợp-đồng/ngoài-hợp-đồng; verdict giữ PENDING-JUDGMENT, danh sách đầy đủ chuyển sang review-findings.md cho người xem lại toàn bộ trước khi ký.
Round 5: cả 10 eval máy + 4 lệnh suite đều PASS trên commit 40e87b2a (đã vá selector `ONLY_BLOCK="P86 GATE-MODEL"` cho E5–E7); scope-triage chạy xong, review-findings.md ghi 2 finding trong-hợp-đồng (AC-5, AC-7) và 6 finding ngoài-hợp-đồng (kể cả một sự cố phiên làm mất bản s4-args.json round 5 chưa commit) — verdict PASS, không mục nào chờ người.
Round 6: E8 (`bash tests/plugins/run-tests.sh`) đỏ trên commit f454bfac — mutant mới `moc phat hanh 1->2` bắt được ghim phía VI thiếu tiền tố bản chép; REJECT, quay lại implementation, vá tại 19abfcd7 (thêm tiền tố `GUIDE.md/QUICKSTART.md (VI):`).
Round 7: cả 10 eval máy + 4 lệnh suite đều PASS trên commit 19abfcd7, nhưng bước phân loại phạm vi (scope-triage) không chạy hết — một finding (`assert len(ids) == 4` chặn trước phép so QUAN HỆ mới) không được máy xếp trong/ngoài hợp đồng; verdict PENDING-JUDGMENT, triage_failed: true, toàn bộ danh sách nằm ở review-findings.md cho người xem lại trước khi ký.