---
schema_version: 2
feature_slug: cong-dang-co-cua
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 394af3fb296ff195e552aae2fb3b5e78994d9318
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
| E12 | AC-11 | script | PASS |
| E13 | AC-12 | script | PASS |
| E14 | AC-13 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-cong-dang-co-cua-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdcc_hai_bo_doc_dang_thuc
  verified_at: 2026-09-01T03:43:17Z
  output: |
    PASS: B \ A = dung tap o nguong-chua-chot (phan doi hop le co thuoc)
    PASS: chieu do (a): go gan gate0 -> A \ B khac rong, neu ten slug: o4-cho-dang
    PASS: chieu do (b): bo dung tu choi o5 -> khang dinh phan doi DO

- eval: E2
  run_id: minted-cong-dang-co-cua-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdcc_nguong_chua_chot_van_ve
  verified_at: 2026-09-01T03:43:17Z
  output: |
    PASS: [n3=chot] (b) KHONG co do nguong
    PASS: [n3=chot] (c) KHONG co dau may-de-xuat
    PASS: chieu do: co do vo dieu kien -> ca 3 nac kia DO

- eval: E3
  run_id: minted-cong-dang-co-cua-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdcc_lan_truoc_chot
  verified_at: 2026-09-01T03:43:17Z
  output: |
    PASS: phep gan gate0 (dong 138) nam TRONG chot (het o dong 146)
    PASS: doi chung duong: o cho Cong Dang ve duoc the
    PASS: mutant hoan vi: chot chan truoc -> DO dung thong diep chot

- eval: E4
  run_id: minted-cong-dang-co-cua-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdcc_o_da_dong
  verified_at: 2026-09-01T03:43:17Z
  output: |
    PASS: [o7c-kill] ghim hang y-da-dong
    PASS: so assert = so phan tu (2 o x 5 + 1)
    PASS: doi chung duong: doi decision ve rong -> ve duoc the

- eval: E5
  run_id: minted-cong-dang-co-cua-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdcc_ho_so_hong
  verified_at: 2026-09-01T03:43:17Z
  output: |
    PASS: [h4] KHONG nhan nham thanh the
    PASS: so assert = so phan tu (4 o x 5)
    PASS: doi chung duong: sua field ve tu vung -> ve duoc the

- eval: E6
  run_id: minted-cong-dang-co-cua-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdcc_ba_ca_cu_khong_doi
  verified_at: 2026-09-01T03:43:17Z
  output: |
    PASS: so assert = 3 ca x (2 + 4 am) = 18
    PASS: doi chung duong: lan Cong Pham vi con song
    PASS: doi chung duong: lan Cong Bang chung con song

- eval: E7
  run_id: minted-cong-dang-co-cua-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdcc_dang_thuc_ca_tu_choi
  verified_at: 2026-09-01T03:43:17Z
  output: |
    PASS: chieu do (a): them hang ma khong them thuat -> dang thuc DO
    PASS: chieu do (b): them thuat khong co hang -> dang thuc DO (M=6 vs N=5)
    PASS: chieu do (c): doi chu mot hang -> dung cap do DO, bon cap kia con nguyen

- eval: E8
  run_id: minted-cong-dang-co-cua-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdcc_bon_loi_ra_song
  verified_at: 2026-09-01T03:43:17Z
  output: |
    PASS: co dong noi dao nguoc duoc
    PASS: so assert = 4 loi + thu tu + dao = 6
    PASS: chieu do: bo «xep lai» khoi nguon -> nut do bien mat, neu dung ten

- eval: E9
  run_id: minted-cong-dang-co-cua-E9-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdcc_may_khong_viet_ho
  verified_at: 2026-09-01T03:43:17Z
  output: |
    PASS: doi chung duong (1): ghi 1 byte -> phep so bam DO
    PASS: (2) dau ra KHONG chua decision dien san
    PASS: doi chung duong (2): phep quet bat duoc decision khi no CO that

- eval: E10
  judged_by: panel (domain-correctness, operational-feasibility, spec-alignment)
  proposal: PASS
  verified_at: 2026-09-01T03:43:17Z
  votes:
    - domain-correctness: PASS — Thẻ để trống mọi chỗ thuộc về người: câu trả lời mẫu "lối ra: ___" chưa điền, không có verdict/chữ ký/căn cứ nào bị máy viết sẵn thay người. Bốn dòng ngưỡng là do máy đề xuất nhưng đều mang chip "máy đề xuất — anh sửa hoặc nhận" ngay trên dòng đó, đúng ngoại lệ được phép trong câu hỏi phán xét.
    - operational-feasibility: PASS — Bốn dòng Ngưỡng đều gắn chip "máy đề xuất — anh sửa hoặc nhận" ngay trên chính dòng đó (đáp ứng điều kiện máy được phép đề xuất ngưỡng). Ô "VIỆC CỦA ANH" và mẫu trả lời để trống ("lối ra: ___"), bốn nút làm/lặp/xếp lại/dừng chỉ là các lựa chọn ngang hàng chưa nút nào ghi sẵn verdict hay câu căn cứ thay người. Không tìm thấy chữ nào tự xưng là quyết định, căn cứ, hay chữ ký đã chốt sẵn.
    - spec-alignment: PASS — Thẻ để trống toàn bộ phần lời của người: 4 nút lối ra (làm/lặp/xếp lại/dừng) chỉ là nhãn liệt kê, không có nút nào mang sẵn văn bản verdict; dòng mẫu trả lời in nguyên "«lối ra: ___»" — chỗ trống chưa điền. Bốn dòng ở mục "Ngưỡng" đều có tiền tố "[đề xuất]" và chip "máy đề xuất — anh sửa hoặc nhận" ngay trên chính dòng đó, đúng ngoại lệ máy-được-phép-đề-xuất-ngưỡng-có-dấu. Không có câu verdict, căn cứ, hay chữ ký nào bị máy viết hộ trong thẻ HTML.
  human_override:

- eval: E11
  run_id: minted-cong-dang-co-cua-E11-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdcc_mot_nguon_bon_loi_ra
  verified_at: 2026-09-01T03:43:17Z
  output: |
    PASS: chieu do [ve]: doi mot ben -> ba ben lech, phep do DO
    PASS: chieu do [anh-xa]: doi mot ben -> ba ben lech, phep do DO
    PASS: chieu do [ngu-phap]: doi mot ben -> ba ben lech, phep do DO

- eval: E12
  run_id: minted-cong-dang-co-cua-E12-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdcc_ban_giao_start
  verified_at: 2026-09-01T03:43:17Z
  output: |
    PASS: doi chung duong: loi gia-tri van rut duoc
    PASS: chieu do (a): doi ten lenh ky -> phep do DO
    PASS: chieu do (b): dao thu tu -> phep do DO

- eval: E13
  run_id: minted-cong-dang-co-cua-E13-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdcc_rang_chieu_do_cua_ky
  verified_at: 2026-09-01T03:43:17Z
  output: |
    PASS: chieu do [nguong-chua-chot-chan-lam-va-lap]: go dung mot dong -> dung menh de do DO, hai menh de kia con nguyen
    PASS: chieu do [nguon-ngoai-chua-phan-loai-chan-lam-va-lap]: go dung mot dong -> dung menh de do DO, hai menh de kia con nguyen
    PASS: chieu do [xep-lai-va-dung-khong-can-nguong]: go dung mot dong -> dung menh de do DO, hai menh de kia con nguyen

- eval: E14
  run_id: minted-cong-dang-co-cua-E14-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cdcc_anh_xa_du_hang
  verified_at: 2026-09-01T03:43:17Z
  output: |
    PASS: chieu do (1): go hang «xep lai» -> DO, con 3 hang
    PASS: chieu do (2): gia tri ngoai tu vung -> DO
    PASS: chieu do (3): them gia tri vao lib ma khong them hang -> DO (phep do doc LIB that)

### Lệnh suite (hồi quy)

- cmd: bash tests/scripts/run-tests.sh
  exit_code: 0
  verified_at: 2026-09-01T03:43:17Z

- cmd: bash tests/hooks/run-tests.sh
  exit_code: 0
  verified_at: 2026-09-01T03:43:17Z

- cmd: bash tests/plugins/run-tests.sh
  exit_code: 0
  verified_at: 2026-09-01T03:43:17Z

- cmd: bash tests/workflows/run-tests.sh
  exit_code: 0
  verified_at: 2026-09-01T03:43:17Z

- cmd: node scripts/product-map.mjs --root . --check
  exit_code: 0
  verified_at: 2026-09-01T03:43:17Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

## Variance

none — không eval nào có runs > 1 trong vòng này (không có eval ngẫu nhiên)

## Iterations

Round 1: mọi machine eval (E1–E9, E11–E14) exit 0/1 pass và judge panel E10 (3/3 lens PASS) đều xanh, nhưng vòng review scope-triage sau đó xác nhận 5 finding BUG nằm TRONG hợp đồng — `--gate 0` xuyên NO-DOSSIER-GUARD vẽ thẻ ma (AC-6, hai biến thể cùng gốc dòng 140 gate-card.js), gate-card và start-scan lệch điều kiện xếp gate 0 (AC-1), sáu hàng `g0` trong GATE-ONESHOT-SLOTS lệch khuôn ánh xạ (AC-10), và bốn nấc ngưỡng trong `rang.sh --chan nguong-chua-chot` viết cứng thay vì rút từ lib (AC-2) — mà 13 chân `rang.sh` hiện có không chặn được. Verdict REJECT theo review-findings (`## Trong hợp đồng`), không theo `failed_evals` (rỗng vì không script nào tự báo đỏ). Chưa quay lại implementation trong vòng này — xem `review-findings.md` để sửa theo LỚP trước khi chạy lại.
