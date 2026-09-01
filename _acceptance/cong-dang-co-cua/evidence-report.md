---
schema_version: 2
feature_slug: cong-dang-co-cua
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8e34b7dafd7f70df8432f54dab80dd0775ded18f
human_signoff:
---

# Evidence Report: cong-dang-co-cua

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-9 | judgment | PASS |
| E11 | AC-10 | script | PASS |
| E14 | AC-13 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-cong-dang-co-cua-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cdcc_hai_bo_doc_dang_thuc
  verified_at: 2026-09-01T04:35:14Z
  output: |
    PASS: B \ A = dung tap o nguong-chua-chot (phan doi hop le co thuoc)
    PASS: chieu do (a): go gan gate0 -> A \ B khac rong, neu ten slug: o11-disc-park o12-disc-build o13-disc-kill o4-cho-dang
    PASS: chieu do (b): bo dung tu choi o5 -> khang dinh phan doi DO

- eval: E2
  run_id: minted-cong-dang-co-cua-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cdcc_nguong_chua_chot_van_ve
  verified_at: 2026-09-01T04:35:14Z
  output: |
    PASS: [n4] nhan 'khai khong do duoc' hien
    PASS: so assert = so phan tu (4 nac x 3 = 12)
    PASS: chieu do: co do vo dieu kien -> ca 3 nac kia DO

- eval: E3
  run_id: minted-cong-dang-co-cua-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cdcc_lan_truoc_chot
  verified_at: 2026-09-01T04:35:14Z
  output: |
    PASS: [--gate 0 tren o-ep] tu choi, stdout RONG
    PASS: so assert co-ep = so phan tu (4)
    PASS: doi chung duong: o du dieu kien van ve duoc the

- eval: E4
  run_id: minted-cong-dang-co-cua-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cdcc_o_da_dong
  verified_at: 2026-09-01T04:35:14Z
  output: |
    PASS: [o7c-kill] ghim hang y-da-dong
    PASS: so assert = so phan tu (2 o x 5 + 1)
    PASS: doi chung duong: doi decision ve rong -> ve duoc the

- eval: E5
  run_id: minted-cong-dang-co-cua-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cdcc_ho_so_hong
  verified_at: 2026-09-01T04:35:14Z
  output: |
    PASS: so assert = so phan tu (4 o x 5)
    PASS: doi chung duong: sua field ve tu vung -> ve duoc the
    EXIT_CODE=0

- eval: E6
  run_id: minted-cong-dang-co-cua-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cdcc_ba_ca_cu_khong_doi
  verified_at: 2026-09-01T04:35:14Z
  output: |
    PASS: so assert = 3 ca x (2 + 4 am) = 18
    PASS: doi chung duong: lan Cong Pham vi con song
    PASS: doi chung duong: lan Cong Bang chung con song

- eval: E7
  run_id: minted-cong-dang-co-cua-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cdcc_dang_thuc_ca_tu_choi
  verified_at: 2026-09-01T04:35:14Z
  output: |
    PASS: chieu do (a): them hang ma khong them thuat -> dang thuc DO
    PASS: chieu do (b): them thuat khong co hang -> dang thuc DO (M=6 vs N=5)
    PASS: chieu do (c): doi chu mot hang -> dung cap do DO, bon cap kia con nguyen

- eval: E8
  run_id: minted-cong-dang-co-cua-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cdcc_bon_loi_ra_song
  verified_at: 2026-09-01T04:35:14Z
  output: |
    PASS: co dong noi dao nguoc duoc
    PASS: so assert = 4 loi + thu tu + dao = 6
    PASS: chieu do: bo «xep lai» khoi nguon -> nut do bien mat, neu dung ten

- eval: E9
  run_id: minted-cong-dang-co-cua-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cdcc_may_khong_viet_ho
  verified_at: 2026-09-01T04:35:14Z
  output: |
    PASS: doi chung duong (1): ghi 1 byte -> phep so bam DO
    PASS: (2) dau ra KHONG chua decision dien san
    PASS: doi chung duong (2): phep quet bat duoc decision khi no CO that

- eval: E10
  judged_by: panel (domain-correctness, operational-feasibility, spec-alignment)
  proposal: PASS
  verified_at: 2026-09-01T04:35:14Z
  votes:
    - domain-correctness: PASS — Bốn dòng ngưỡng đều đánh dấu "[đề xuất]" kèm chip amber "máy đề xuất — anh sửa hoặc nhận" ngay trên dòng, đúng điều kiện cho phép máy đề xuất ngưỡng. Khối "VIỆC CỦA ANH" và dòng trả lời mẫu "«lối ra: ___»" để trống, không có verdict/căn cứ/chữ ký nào bị máy viết sẵn thay người; bốn nút lối ra (làm/lặp/xếp lại/dừng) chỉ là lựa chọn để bấm, không mang sẵn câu trả lời.
    - operational-feasibility: PASS — Thẻ chỉ tô đậm bốn ngưỡng bằng thẻ "[đề xuất]" kèm chip "máy đề xuất — anh sửa hoặc nhận" ngay trên dòng đó — đúng ngoại lệ được phép. Ô "VIỆC CỦA ANH" chỉ hướng dẫn cách trả lời và để mẫu câu trống ("«lối ra: ___»"), không có verdict, câu căn cứ hay chữ ký nào bị máy điền sẵn thay người; cả bốn nút lối ra (làm/lặp/xếp lại/dừng) đều là lựa chọn chưa được chọn, không nút nào ở trạng thái "đã chọn". Riêng nút "làm" được tô màu chip .yes khác ba nút .bn còn lại — một thiên lệch thị giác đáng lưu ý nhưng không phải chữ viết sẵn thay người theo đúng nghĩa câu hỏi đặt ra.
    - spec-alignment: PASS — Thẻ để trống mọi trường thuộc về người: mục "VIỆC CỦA ANH" chỉ đưa hướng dẫn và mẫu điền chỗ trống «lối ra: ___», không có verdict/câu căn cứ/chữ ký nào bị máy viết sẵn. Bốn ngưỡng đề xuất trong mục "Ngưỡng" đều mang tiền tố "[đề xuất]" cộng chip "máy đề xuất — anh sửa hoặc nhận" ngay trên dòng đó, đúng điều kiện AC-9 cho phép máy đề xuất ngưỡng có dấu rõ ràng. Bốn nút lối ra (làm/lặp/xếp lại/dừng) đều hiện diện như lựa chọn sống, không nút nào được đánh dấu là đã chọn hay đã điền sẵn câu trả lời.
  human_override:

- eval: E11
  run_id: minted-cong-dang-co-cua-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cdcc_mot_nguon_bon_loi_ra
  verified_at: 2026-09-01T04:35:14Z
  output: |
    PASS: chieu do [anh-xa]: doi mot ben -> ba ben lech, phep do DO
    PASS: chieu do [ngu-phap]: doi mot ben -> ba ben lech, phep do DO
    EXIT_CODE=0

- eval: E14
  run_id: minted-cong-dang-co-cua-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cdcc_anh_xa_du_hang
  verified_at: 2026-09-01T04:35:14Z
  output: |
    PASS: chieu do (1): go hang «xep lai» -> DO, con 3 hang
    PASS: chieu do (2): gia tri ngoai tu vung -> DO
    PASS: chieu do (3): them gia tri vao lib ma khong them hang -> DO (phep do doc LIB that)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  exit_code: 0
  verified_at: 2026-09-01T04:35:14Z

- cmd: bash tests/hooks/run-tests.sh
  exit_code: 0
  verified_at: 2026-09-01T04:35:14Z

- cmd: bash tests/plugins/run-tests.sh
  exit_code: 0
  verified_at: 2026-09-01T04:35:14Z

- cmd: bash tests/workflows/run-tests.sh
  exit_code: 0
  verified_at: 2026-09-01T04:35:14Z

- cmd: node scripts/product-map.mjs --root . --check
  exit_code: 0
  verified_at: 2026-09-01T04:35:14Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay
none — không eval nào được xác định KHÔNG-PHÂN-BIỆT trong vòng này (baseline không đo lại, xem round 1)

## Variance

none — không eval nào có runs > 1 trong vòng này (không có eval ngẫu nhiên)

## Iterations

Round 1: mọi machine eval (E1–E9, E11–E14) exit 0/1 pass và judge panel E10 (3/3 lens PASS) đều xanh, nhưng vòng review scope-triage sau đó xác nhận 5 finding BUG nằm TRONG hợp đồng — `--gate 0` xuyên NO-DOSSIER-GUARD vẽ thẻ ma (AC-6, hai biến thể cùng gốc dòng 140 gate-card.js), gate-card và start-scan lệch điều kiện xếp gate 0 (AC-1), sáu hàng `g0` trong GATE-ONESHOT-SLOTS lệch khuôn ánh xạ (AC-10), và bốn nấc ngưỡng trong `rang.sh --chan nguong-chua-chot` viết cứng thay vì rút từ lib (AC-2) — mà 13 chân `rang.sh` hiện có không chặn được. Verdict REJECT theo review-findings (`## Trong hợp đồng`), không theo `failed_evals` (rỗng vì không script nào tự báo đỏ). Chưa quay lại implementation trong vòng này — xem `review-findings.md` để sửa theo LỚP trước khi chạy lại.
Round 2: mọi eval máy đã re-run (E1–E9, E11, E14) exit 0 và judge panel E10 (3/3 lens PASS) đều xanh trên bản sửa (thêm ba ô lệch nhánh cho E1, ma trận 4 nấc cho E2, cờ ép `--gate 0` cho E3), nhưng review scope-triage vòng này xác nhận 8 finding vẫn nằm TRONG hợp đồng — bên đọc dấu «máy đề xuất» của thẻ (`includes`) lệch luật của lib (`startsWith`) khiến một bullet đã chốt vẫn bị gắn nhãn đề xuất (AC-2), phép quét `decision` điền sẵn của AC-9 là assertion âm-tính-một-mình (không khoá `decision` nào từng tồn tại trong đầu ra `--extract` để bắt), fixture phán đoán của E10 là một bản HTML đóng băng lệch hồ sơ nguồn nên không round-trip được với thẻ thật (AC-9), hai finding ở AC-11 (`vi_tri`…`cut` luôn thoát 0, và chiều đỏ đổi-tên-lệnh chỉ grep lại chính bản đã tiêm) không đo được QUAN HỆ tên lệnh ký↔thân lệnh duyệt như đã hứa, ma trận 4 nấc của AC-2 không assert bốn ô rơi vào bốn nấc phân biệt, dấu «máy đề xuất» đếm khắp thẻ thay vì đúng dòng ngưỡng, và dòng PASS «phân biệt được» của AC-6 in vô điều kiện. Verdict REJECT theo review-findings (`## Trong hợp đồng`), không theo `failed_evals` (rỗng vì không script nào tự báo đỏ). Chưa quay lại implementation trong vòng này — xem `review-findings.md` để sửa theo LỚP trước khi chạy lại.
