---
schema_version: 2
feature_slug: thuoc-nhan-de-khoi
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f791f57ca160ca726940d2d6fffcc9e3a3b21fc2
human_signoff: Manh Phan 2026-08-27
---

# Evidence Report: thuoc-nhan-de-khoi

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-thuoc-nhan-de-khoi-E1-r6
  exit_code: 0
  baseline: red
  verifier: config:executors.script.tnk_rang_hai_chieu
  verified_at: 2026-08-27T11:30:00Z
  output: |
    PASS: toa do px -> bo qua co tieng, khong bia toa do
    PASS: chieu do chan WARN: thieu WARN -> bat duoc
    Results: 8 passed, 0 failed

- eval: E2
  run_id: minted-thuoc-nhan-de-khoi-E2-r6
  exit_code: 0
  baseline: red
  verifier: config:executors.script.tnk_rang_ba_ca_that
  verified_at: 2026-08-27T11:31:00Z
  output: |
    PASS: base neu nhan S5 GIAO
    PASS: doi chung: ban da sua -> exit 0
    Results: 4 passed, 0 failed

- eval: E3
  run_id: minted-thuoc-nhan-de-khoi-E3-r6
  exit_code: 0
  baseline: red
  verifier: config:executors.script.tnk_rang_nhan_con_song
  verified_at: 2026-08-27T11:32:00Z
  output: |
    PASS: chieu do (b2): chi co OCCLUDED -> khong tinh la thay nhan
    PASS: chieu do (b): xoa mask -> nhan ngoai tam thuoc
    Results: 12 passed, 0 failed

- eval: E4
  run_id: minted-thuoc-nhan-de-khoi-E4-r6
  exit_code: 0
  baseline: red
  verifier: config:executors.script.tnk_rang_fill_trong_suot
  verified_at: 2026-08-27T11:33:00Z
  output: |
    PASS: duc [fill="rgb(0,0,0)"] -> do
    PASS: duc [fill="rgb(45,49,0)"] -> do
    Results: 14 passed, 0 failed

- eval: E5
  run_id: minted-thuoc-nhan-de-khoi-E5-r6
  exit_code: 0
  baseline: red
  verifier: config:executors.script.tnk_rang_html_inline
  verified_at: 2026-08-27T11:34:00Z
  output: |
    PASS: html lanh -> exit 0
    PASS: html tiem -> do dung nhan
    Results: 2 passed, 0 failed

- eval: E6
  run_id: minted-thuoc-nhan-de-khoi-E6-r6
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-27T11:35:00Z
  output: |
    PASS: ARM13-mut

    Results: 751 passed, 0 failed

- eval: E7
  run_id: minted-thuoc-nhan-de-khoi-E7-r6
  exit_code: 0
  baseline: red
  verifier: config:executors.script.tnk_rang_suite_case
  verified_at: 2026-08-27T11:36:00Z
  output: |
    PASS: suite ghim [PASS: mutant code-sinh -> do dung thong diep]
    PASS: chieu do: stdout thieu dong -> bat duoc
    Results: 6 passed, 0 failed

- eval: E8
  run_id: minted-thuoc-nhan-de-khoi-E8-r6
  exit_code: 0
  baseline: red
  verifier: config:executors.script.tnk_rang_taste_gate
  verified_at: 2026-08-27T11:37:00Z
  output: |
    PASS: chieu do: muc ngoai §9 -> bat duoc
    PASS: LOCAL-PATCHES co entry
    Results: 6 passed, 0 failed

- eval: E9
  run_id: minted-thuoc-nhan-de-khoi-E9-r6
  exit_code: 0
  baseline: red
  verifier: config:executors.script.tnk_rang_quet_vung_ngoai
  verified_at: 2026-08-27T11:38:00Z
  output: |
    PASS: report-only: khong cham vung ngoai
    PASS: chieu do: mau duong dan BAT duoc thay doi that (5938183)
    Results: 5 passed, 0 failed

**Suite hồi quy khác (không gắn AC cụ thể, chạy cùng vòng để xác nhận không có hồi quy trên toàn kit):** `tests/hooks/run-tests.sh` — 60 passed, 0 failed; `tests/plugins/run-tests.sh` — toàn bộ case plugin xanh (bao gồm ca lan-may-song-qua-bo-phan-loai); `tests/workflows/run-tests.sh` — 44 passed, 0 failed; `node scripts/product-map.mjs --root . --check` — PRODUCT-MAP.md khớp hồ sơ xưởng. Bốn lệnh này không mint run_id (không gắn eval nào trong contract) nên không xuất hiện trong bảng trên.

## Known limits

*(main loop điền từ hợp đồng + triage r6 — bước tổng hợp để rỗng section này
trong khi dữ liệu có; lỗ đó đã có hạt giống `lan-v-thoat-kiem-stale`.)*

- Thước nhận đúng MỘT dạng khối che: rect đục ≥60×28. Bốn dạng che lọt có chủ
  đích và khai trong docstring: rect dải chết 18<h<28 · rect hẹp <60 ·
  path/circle/polygon tô đặc · nhãn mask rộng >220 (owner chốt thu phạm vi, vòng 2).
- Danh sách «trong suốt» là các dạng đã biết; mọi cú pháp lạ → phần tử vô hình
  kèm WARN — bất định rơi về SÓT, không rơi về TỐ OAN (đảo chiều, vòng 4).
- Thuộc tính NHÁY ĐƠN vô hình với parser: rect trong suốt viết nháy đơn có thể
  bị tố oan với toạ độ bịa, không WARN (finding r6, TRONG hợp đồng — chưa sửa;
  house style luôn nháy kép nên corpus 0 ca; sửa 1 dòng ở kho skill đợt vendor
  kế, không cần vòng kit).
- Ba «chiều đỏ chuỗi giả» trong rang.sh là hằng-đúng (khai r5); chiều đỏ thật
  của các chân nằm ở xoá-mask / mutant code-sinh / mốc BASE-TNK.
- Chiều đỏ chân quet-vung-ngoai neo cửa sổ 40 commit di động, vế assets không
  có đối chứng dương riêng — răng hồ sơ, chết theo merge (finding r6).
- Colophon 2 hình sửa nhãn còn ghi mốc vẽ cũ (chỉ dịch nhãn, prose nguồn không đổi).
- Entry LOCAL-PATCHES đo bằng chuỗi-có-mặt thay quan hệ đầy đủ (finding r6, TRONG hợp đồng).

## Ngoài hợp đồng

*(main loop điền từ triage r6 — 9 mục, chi tiết + kịch bản fail đầy đủ trong
`review-findings.md`; 3 lựa chọn chuẩn cho từng mục trình ở thẻ Cổng 2.)*

- [high] Bằng-chứng-cũ lọt cổng cho hồ sơ làn máy (lỗ engine — hạt giống
  `lan-v-thoat-kiem-stale` + stub ô đã mở; báo cáo vòng 6 này đã re-pin HEAD).
- [medium] Bước tổng hợp để rỗng section «Ngoài hợp đồng» (cùng hạt giống trên).
- [medium ×2, low ×5] Chất lượng răng hồ sơ + colophon + comment lệch số — liệt
  kê đủ trong review-findings.md; không mục nào chạm hành vi thước ở corpus thật.

## Analyst

E6 — `bash tests/scripts/run-tests.sh`: xanh trên CẢ HEAD lẫn baseline (baseline: green trong bảng Evidence) vì đây là suite hồi quy scripts/ gộp trọn, không riêng cho tính năng thuoc-nhan-de-khoi. Bằng chứng phân biệt thật cho AC-6 nằm ở E7 (baseline: red, độc lập, chạy trọn suite rồi ghim đúng dòng case label-occlusion.test.mjs trong stdout). Xem E6 là regression-guard có chủ ý, không cần viết lại.

## Variance

none — không eval nào có runs > 1 (tất cả deterministic, runs=1, không có eval nào lệch pass_rate).

## Iterations

Round 1–3: chuỗi vá harness (chi tiết ở lịch sử round cũ); round 3 từng đóng với 9/9 xanh tại commit a0257bfd, nhưng bị vượt qua bởi 3 commit sửa tiếp (b948fd4b, 0e1d0dbb "dao chieu mac dinh", f791f57c) làm bằng chứng đó hoá stale.
Round 4–5: đảo ngược mặc định khi gặp giá trị KHÔNG HIỂU — từ âm thầm coi là trong suốt sang SÓT-CÓ-TIẾNG kèm WARN (0e1d0dbb), và sửa bug crash giả trên file nhị phân (UnicodeDecodeError thoát khỏi except OSError → exit 1 giả thay vì exit 2 fail-closed đúng đặc tả AC-1) (f791f57c).
Round 6 (vòng này): mint lại evidence-report + run-log tại HEAD f791f57ca160ca726940d2d6fffcc9e3a3b21fc2 để đóng khoảng lệch bằng-chứng-cũ đã ghi sổ ở review-findings.md (hạt giống lan-v-thoat-kiem-stale); cả 9 eval xanh, có phân biệt trên baseline đỏ (trừ E6 — non-discriminating, được E7 bù độc lập).