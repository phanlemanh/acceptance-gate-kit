---
schema_version: 2
feature_slug: design-pass-nac-khong-dong-bo
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d792559ca2e2f39da8800dfc26a5edc1acea3e91
human_signoff: Manh Phan 2026-08-25 — ký trên làn V với verdict máy REJECT giữ NGUYÊN (không nâng thành PASS). Ký vì: 9/9 phép đo máy xanh hai vòng liên tiếp trên bằng chứng độc lập, và lỗi ở SẢN PHẨM đã về 0 ở vòng 4 (vòng 3 là 5). Ba lỗi trong hợp đồng của vòng 4 đều ở BỘ ĐO: một vế chết đã sửa (cờ giá-trị-lạ nay nêu tên trong nội dung cờ, có mutant giữ), hai cái còn lại được giải bằng TRỪ phép quét tĩnh sai lời hứa + khai giới hạn (xem contract Notes, entry descope d-20260825T092930Z). Sáu mục ngoài hợp đồng đã xếp chỗ, xem review-findings.md. CHƯA giải: E14 (AC-14) còn UNCERTAIN — human_override để TRỐNG, chưa ai tự đọc và khai.
---

# Evidence Report: design-pass-nac-khong-dong-bo

Toàn bộ 6 lệnh máy đều xanh (đối chứng dương + baseline đỏ đúng ma trận cho E13; bảy eval E1/E8/E9/E10/E11/E12/E15 non-discriminating trên `bash tests/plugins/run-tests.sh`, tức baseline: green). Verdict tổng vẫn REJECT vì vòng scope-triage của review-findings tìm thấy 3 lỗi THẬT map vào hợp đồng — cả ba đều AC-14, nằm ngay trong chính bộ kiểm mutant của DP10/DP1 mà vòng này đáng lẽ phải bắt được — xem review-findings.md mục "Trong hợp đồng" để tái lập.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |
| E12 | AC-13 | test | PASS |
| E13 | AC-12 | script | PASS |
| E15 | AC-15 | test | PASS |
| E14 | AC-14 | judgment | UNCERTAIN |

## Evidence

- eval: E1
  run_id: minted-design-pass-nac-khong-dong-bo-E1-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-25T15:30:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E8
  run_id: minted-design-pass-nac-khong-dong-bo-E8-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-25T15:30:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E9
  run_id: minted-design-pass-nac-khong-dong-bo-E9-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-25T15:30:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E10
  run_id: minted-design-pass-nac-khong-dong-bo-E10-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-25T15:30:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E11
  run_id: minted-design-pass-nac-khong-dong-bo-E11-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-25T15:30:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E12
  run_id: minted-design-pass-nac-khong-dong-bo-E12-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-25T15:30:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E13
  run_id: minted-design-pass-nac-khong-dong-bo-E13-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.dpnkdb_cau_chet
  verified_at: 2026-08-25T15:30:00+07:00
  output: |
    cau-chet OK (moc c444c512f8f2b2c2b2fba59d4780d9fcff6c6071: moi kim dung so khai · cay dang kiem: 0 · chan tiem: bat duoc)

- eval: E15
  run_id: minted-design-pass-nac-khong-dong-bo-E15-r4
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-25T15:30:00+07:00
  output: |
      PASS: ca bang dieu khien — BDK4 (ho so start-bang-dieu-khien)

    Results: all plugin tests passed

- eval: E14
  judged_by: panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: UNCERTAIN
  rationale: Cả ba lens đều UNCERTAIN vì câu hỏi trọng tâm của E14 — đối chiếu số mutant thực thi trong hai file (test.mjs + rang-cau-chet.sh) với bảng khai giữa mốc neo MUTANT-MATRIX ở đầu evals.yaml — không thực hiện được: evals.yaml không có tên trong danh sách Input được cấp cho hội đồng, nên không lens nào có căn cứ để khẳng định "đủ như đã khai" hay chỉ ra vế thiếu.
  votes:
    - domain-correctness: UNCERTAIN — Trong phạm vi hai file được giao (test + rang-cau-chet.sh), các cơ chế nội tại đều khớp chuẩn mà câu hỏi đòi: mutant đi qua CHÍNH bộ đọc thật (render() dùng bản sao trọn scripts/+lib/, mutateCard ném lỗi nếu no-op; runCase ném lỗi nếu mutated===src); fixture sinh từ vật thật (noteFromTemplate rút từ block NOTE_TPL, KHOA_KE_THUA rút từ Object.getOwnPropertyNames(Object.prototype), noteKeys rút bằng regex từ chính khuôn) chứ không phải danh sách viết tay ở hai lưới quan hệ trọng tâm (f)/(h); thông điệp đỏ ghim tên vế/khoá cụ thể (vd "khuon so phien thieu khoa: reaction:", "site X: thieu ban chep..."); DP10(a) và DP13 đều đếm coNacFlag().length chứ không soi một câu; DP11/E13 dùng cùng SCAN_DIRS=['skills','feature-loop'] ở cả hai đầu và có mutant m4/m5 tiêm vào file thứ ba (skills/acceptance/SKILL.md) để chứng minh glob quét trọn; rang-cau-chet.sh có hàm dem() dùng chung 3 chân, phân biệt rc=1 (0, không khớp) với rc>=2 (HA TANG, trả 2) một cách tường minh. Nhưng câu hỏi trọng tâm — "số mutant thực thi có ĐỦ như đã khai" — đòi đối chiếu với BẢNG MA TRẬN MUTANT khai ở đầu evals.yaml của hồ sơ, và file đó KHÔNG có trong danh sách Input được giao cho eval này nên tôi không thể xác nhận số vế khai so với số mutant đếm được (DP1=7, DP8=5, DP9=2, DP10=5 mutant tên riêng, DP11=5, DP12=4, DP13=3) có khớp 1-1 hay có ca "tuyên N vế mà chỉ chạy 1 mutant" hay không.
    - operational-feasibility: UNCERTAIN — Câu hỏi trọng tâm đòi đối chiếu số mutant thực thi trong hai file được giao với bảng MUTANT-MATRIX khai ở đầu evals.yaml của hồ sơ, nhưng evals.yaml không nằm trong danh sách Input được phép đọc của eval này. Không có bảng đó, tôi không có căn cứ để phán "đủ như đã khai" hay "thiếu vế" — chỉ có thể xác nhận (không đủ để kết luận PASS/FAIL) rằng cấu trúc bên trong hai file (mutant đi qua đúng hàm/bộ đọc của chiều xanh, fixture sinh từ khuôn qua marker, thông điệp ghim tên vế, chân quét glob TRỌN + mutant tiêm file thứ ba, đối chứng dương DP10(a)/DP13 đếm cờ chứ không soi một câu, DP13 có assert vế "KHÔNG cờ nấc") đều hiện diện và tự nhất quán trong hai file đã đọc.
    - spec-alignment: UNCERTAIN — Câu hỏi cốt lõi của E14 đòi đối chiếu số mutant thực thi (đếm được trong hai file đã đọc: DP1=8, DP8=5, DP9=4 khớp-vòng+2 mutant, DP10=5 mutant chính (m1,m2,m3,mProto,mEsc)+sweep tĩnh, DP11=5, DP13=3, DP12=4; kim của rang-cau-chet.sh đọc động từ contract.md nên số không cố định trong script) với bảng khai giữa mốc neo `MUTANT-MATRIX` ở đầu evals.yaml — file evals.yaml không có trong danh sách Input được cấp, nên không có căn cứ để phán "đủ như đã khai" hay "N vế chỉ chạy một mutant" theo đúng hợp đồng đó. Trong phạm vi hai file được đọc, không thấy vi phạm ở các trục còn lại: mọi mutant đi qua đúng hàm/bộ đọc của chiều xanh (runCase gọi lại check(); render() gọi thật gate-card.js; checkDefaultSites/checkDocKeys dùng chung cho sạch và mutant), thông điệp đỏ đều ghim tên vế/khoá/site (không chỉ mã thoát), và câu hỏi TRỌNG TÂM về fixture-sinh-từ-vật được thoả: noteFromTemplate/noteKeys rút từ marker DESIGN-PASS-NOTE-TEMPLATE thật, KHOA_KE_THUA rút từ Object.getOwnPropertyNames(Object.prototype), SCAN_DIRS quét toàn thư mục qua walkFiles() (không lọc đuôi, không danh sách tay), và KIMS của rang-cau-chet.sh đọc động từ contract.md — không có allowlist tự nghĩ ra kiểu lớp-lỗi-vòng-3 trong hai file này.
  required_evidence:
    - [domain-correctness] Nội dung khối MUTANT-MATRIX (giữa cặp mốc neo MUTANT-MATRIX...MUTANT-MATRIX>>>) ở đầu file _acceptance/design-pass-nac-khong-dong-bo/evals.yaml — đọc file này rồi đối chiếu số vế khai cho từng AC (AC-1, AC-8, AC-9, AC-10, AC-11, AC-13, AC-15) với số mutant đếm được thực tế trong tests/plugins/design-pass-nac.test.mjs (DP1=7, DP8=5, DP9=2, DP10=5 mutant đặt tên [m1,m2,m3,m-proto,m-esc] cộng hai lưới quét (f)/(h)/(g), DP11=5, DP12=4, DP13=3) để xác nhận không có ca nào tuyên N vế nhưng chỉ chạy 1 mutant.
    - [operational-feasibility] Nội dung khối giữa cặp mốc neo MUTANT-MATRIX ở đầu file evals.yaml của hồ sơ _acceptance/design-pass-nac-khong-dong-bo/evals.yaml — cần để đối chiếu số mutant khai (theo từng AC/DP-id) với số mutant thực thi đếm được trong tests/plugins/design-pass-nac.test.mjs và rang-cau-chet.sh; nếu số khớp verdict có thể lên PASS, nếu lệch (ví dụ một vế tuyên N mutant mà file chỉ chạy 1) verdict đổi sang FAIL.
    - [spec-alignment] Nội dung khối MUTANT-MATRIX (giữa mốc neo `MUTANT-MATRIX` ở đầu) trong /Users/manhphan/dev/acceptance-gate-kit/_acceptance/design-pass-nac-khong-dong-bo/evals.yaml — cần bổ sung file này vào Input để đối chiếu trực tiếp số mutant khai theo từng AC (AC-1, AC-8, AC-9, AC-10, AC-11, AC-12, AC-13, AC-15) với số mutant thực thi đếm được trong design-pass-nac.test.mjs và rang-cau-chet.sh; nếu số khớp ở mọi hàng thì verdict đổi thành PASS trên trục 'số mutant có đủ như đã khai', nếu lệch ở hàng nào thì đó là ca cụ thể cần nêu tên.
  human_override:

## Analyst

E1, E8, E9, E10, E11, E12, E15 — non-discriminating trên `bash tests/plugins/run-tests.sh` (baseline: green, tức xanh trên cả code cũ và code mới). Bảy eval này chưa phân biệt được feature với hạ tầng; cân nhắc viết lại để assert hành vi MỚI (nấc phản ứng, khuôn options/divergence, ổ cắm design_pass.ds_skill…) hoặc xác nhận có chủ ý là regression-guard.

## Variance

none — không eval nào có `runs` > 1 trong vòng này (không có eval ngẫu nhiên).

## Iterations

Round 1: nhiều assert chết + 11 mutant còn thiếu trong ma trận bị review bắt — sửa theo lớp (5876722c).
Round 2: số hiệu mutant tự mâu thuẫn giữa hai mô tả sau lượt đính chính — sửa (8706e8f9); S4-r2 BLOCKED vì 6/6 lệnh máy không chạy được (hạ tầng), hội đồng ma trận mutant PASS trên input carried.
Round 3: 6 lệnh máy chạy sạch, 8 eval feature xanh (bao gồm đối chứng dương/baseline đỏ đúng ma trận), nhưng scope-triage tìm ra 8 lỗi thật map vào hợp đồng (AC-10 ×5, AC-12 ×1, AC-14 ×2) — REJECT, quay lại triển khai.
Round 4 (hiện tại): 6 lệnh máy vẫn xanh (đối chứng dương + baseline đỏ đúng ma trận cho E13); nhưng scope-triage tìm thêm 3 lỗi thật map AC-14, cả ba nằm ngay trong chính DP10/DP1 của bộ kiểm mutant — vế «cờ vàng NÊU TÊN giá trị lạ» đo trên toàn bộ stdout thay vì trên đúng nội dung cờ (assert chết); sweep tĩnh (g) chỉ lọc từ vựng theo dòng (nháy đơn + `esc(` có mặt ở bất kỳ đâu) nên bỏ lọt nối chuỗi qua template literal và nối nửa-esc (tuyên quét LỚP nhưng đo điểm-case theo DÒNG) — cả ba đã tái lập bằng phá vật thật. REJECT, quay lại triển khai; hội đồng E14 vẫn UNCERTAIN vì evals.yaml (mốc neo MUTANT-MATRIX) không có trong Input được cấp.

## Gate 2 checklist (human)

- [ ] Read the table + spot-check 1-2 evidence blocks
- [ ] Personally verify every judgment item marked UNCERTAIN, then fill its
      `human_override: <name> <date>` line
- [ ] T3 only: personally verify ALL judgment items and fill `human_override`
      on each (judge verdicts are advisory; the hook blocks PASS without them)
- [ ] If verdict was PENDING-JUDGMENT: upgrade it to PASS (this write is when
      the hook re-validates evidence + overrides)
- [ ] Fill `human_signoff` in frontmatter