---
schema_version: 1
slug: cat-khoi-viec-cua-anh-tren-tin
round: 1
verdict: PASS
verified_commit: d3f59b0e3d79063c748914dabe9f49c974dc64f0
verified_at: 2026-08-16T08:46:59Z
human_signoff: Manh Phan 2026-08-16
---

# Evidence Report — cat-khoi-viec-cua-anh-tren-tin (round 1)

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | judgment | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: r-20260816T084213Z-16478
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cat_khoi_rang_khuon
  verified_at: 2026-08-16T08:46:59Z
  output: |
    CAT-BASE: origin/main -> d68b51b
    CAT-SCOPE: commands skills feature-loop scripts GUIDE.md QUICKSTART.md README.md CONTEXT.md
      OK   CAT-SCOPE: khop ban khai PHAM-VI-RANG
      OK   CAT-KHUON: YOUR-MOVE-BLOCK-TEMPLATE HEAD=0 base=17(>0) OK
      OK   CAT-KHUON: mỗi mục đủ 3 vế HEAD=0 base=7(>0) OK
      OK   CAT-KHUON: câu tu từ mang dấu hỏi HEAD=0 base=7(>0) OK
    CAT-KHUON: loai tru gate-card.js cho Trả lời mẫu (một dòng, điền vào chỗ trống) — the giu nguyen, Out of scope
      OK   CAT-KHUON: Trả lời mẫu (một dòng, điền vào chỗ trống) HEAD=0 base=3(>0) OK
    CAT-KHUON: loai tru gate-card.js cho khối 👉 — the giu nguyen, Out of scope
      OK   CAT-KHUON: khối 👉 HEAD=0 base=17(>0) OK
      OK   CAT-KHUON: kết bằng đúng MỘT khối HEAD=0 base=13(>0) OK
    CAT-KHUON: 6/6
    CAT-KHOI [khuon]: 0 ĐỎ

- eval: E2
  run_id: r-20260816T084213Z-16478
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cat_khoi_rang_clause
  verified_at: 2026-08-16T08:46:59Z
  output: |
    CAT-BASE: origin/main -> d68b51b
    CAT-CLAUSE: 1 cau · 4/4 dau hieu · 0 tu cam · 3/3 luat am OK
      OK   clause that XANH (doi chung duong)
    CAT-KHOI [clause]: 0 ĐỎ

- eval: E3
  run_id: r-20260816T084213Z-16478
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-16T08:46:59Z
  output: |
      PASS: P188 round-trip dieu khoan moi-cong: MOI site nguon khop tung ky tu (E5)
    Results: all plugin tests passed

- eval: E4
  run_id: r-20260816T084213Z-16478
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cat_khoi_rang_oneshot
  verified_at: 2026-08-16T08:46:59Z
  output: |
    CAT-BASE: origin/main -> d68b51b
    CAT-ONESHOT: clause moi · 6/6 ban chep · grammar+slots chi doi 1 con tro OK
      OK   oneshot that XANH
    CAT-KHOI [oneshot]: 0 ĐỎ

- eval: E5
  judged_by: giám khảo phiên sạch (subagent, mù với diff)
  verdict: PASS
  rationale: 4/4 ca đạt. Ca 1 và 2 mỗi tin đúng một câu hỏi đóng, có ngả khuyên kèm căn cứ, ngả mặc định tường minh nên một chữ đồng ý đủ, nói việc kế; 0 ô trống, 0 dòng Trả lời mẫu, 0 mã bắt buộc, 0 hỏi phút, 0 câu trả lời viết sẵn. Ca 3 không hỏi gì. Ca 4 giữ luật, không phục hồi form. Giám khảo trích nguyên văn câu hỏi từng ca.
  verified_at: 2026-08-16T08:46:59Z

- eval: E6
  run_id: r-20260816T084213Z-16478
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cat_khoi_so_ca
  verified_at: 2026-08-16T08:46:59Z
  output: |
    CAT-BASE: origin/main -> d68b51b
      OK   CAT-SO-CA: suite plugins exit 0
      OK   CAT-SO-CA: plugins 145 == ky vong 145 OK
      OK   CAT-SO-CA: giu 9/9 co PASS · go 1/1 vang OK
      OK   CAT-SO-CA: base 146 == truoc 146 OK
    CAT-KHOI [so-ca]: 0 ĐỎ

- eval: E7
  run_id: r-20260816T084213Z-16478
  exit_code: 0
  baseline: green
  verifier: config:executors.script.product_map
  verified_at: 2026-08-16T08:46:59Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

## Iterations

- Round 1: 7/7 eval đạt. Không REJECT.

## Analyst

Hai lỗ do CHÍNH bộ răng tự bắt trong lượt dựng, đã sửa vật rồi chạy lại: (1) luật âm đo bằng chuỗi trôi nổi trong section — mà điều khoản cũng chứa «không hỏi phút», nên mutant xoá bullet vẫn xanh; sửa thành đo bullet đậm mở đầu dòng (lớp đo-từ-vựng-thay-vì-quan-hệ). (2) khối ngữ pháp câu-gộp chứa một con trỏ chết tới khuôn vừa gỡ; AC-4/E4 đổi từ «diff rỗng» sang «diff đúng cặp dòng con trỏ đã khai», không im lặng.

## Known limits

- Răng hồ sơ neo đối chứng dương vào nhánh chính hiện tại: sau khi hồ sơ này merge, các needle về 0 ở cả hai đầu và chân quét-khuôn sẽ tự tuyên «phép đo không sống». Đúng thiết kế (nếp cat-hinh-thuc) — 4 khoá executor này KHÔNG vào suite vĩnh viễn.
- Lớp HÀNH VI chấm trên 4 ca của một phiên sạch, không phải trên vòng thật; ca giữ-gân (owner đòi phục hồi form) có, nhưng không có ca nhiều-mục-thật ở Cổng 2 với 5 mục treo.

## Variance

none

## Out of contract

(rỗng)
