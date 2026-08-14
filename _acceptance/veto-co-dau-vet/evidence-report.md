---
schema_version: 2
feature_slug: veto-co-dau-vet
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9f4c0d03e8105ce6c9d9c7f878708570109ecba2
human_signoff:
---

# Evidence Report: veto-co-dau-vet

Hạng **T3**: mọi mục judgment cần verdict TRỰC TIẾP của người. Hai verdict
hội đồng dưới đây là **khuyến nghị**, không phải kết luận — nên verdict tổng
là `PENDING-JUDGMENT`. Đây là đường đúng của hồ sơ T3, không phải lỗi.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E3b | AC-3b | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | judgment | PASS (khuyến nghị hội đồng — chờ người chốt) |
| E7 | AC-7 | judgment | PASS (khuyến nghị hội đồng — chờ người chốt) |
| E8 | AC-8 | test | PASS |
| E8b | AC-8 | test | PASS |
| E8c | AC-8 | test | PASS |
| E8d | AC-8 | test | PASS |
| E8e | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: veto-co-dau-vet-E1-20260814T134541Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_hook_v
  verified_at: 2026-08-14T13:45:41Z
  output: |
    == chân hook: cửa V ==
      OK   hook a T2+V+vet CHO QUA
      OK   hook b T3+V CHAN :: veto_state: mo on a T3 contract — the V lane is T2-onl
      OK   hook c thieu vet CHAN :: veto_state: mo but veto_opened_at is missing — the V l
      OK   hook d vet RAC CHAN :: veto_state: mo but veto_opened_at is unreadable ("xxx"
      OK   hook e khong khoa V -> luat cu CHAN :: status: approved with empty approved_by — Gate 1 appro
      OK   hook f khong khoa V + ten -> CHO
           [chiều đỏ] gỡ điều kiện hạng khỏi bản sao → T3 thôi bị chặn, tức chân (b) đo THẬT điều kiện đó
    RANG-VETO: XANH — mọi chân qua checker thật, chiều đỏ chạy trong cùng lượt

- eval: E2
  run_id: veto-co-dau-vet-E2-20260814T134547Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_hook_cu
  verified_at: 2026-08-14T13:45:47Z
  output: |
    == chân hook-cũ: luật cũ nguyên văn so với BASE-V ==
      OK   hook-cũ giữ nguyên (1 bản): Gate 1 approval not recorded
      OK   hook-cũ giữ nguyên (2 bản): skips Gate 1
           [chiều đỏ] so với mốc c2f38ca, KHÔNG rút bản chép từ chính cây sau sửa
    RANG-VETO: XANH — mọi chân qua checker thật, chiều đỏ chạy trong cùng lượt

- eval: E3
  run_id: veto-co-dau-vet-E3-20260814T134557Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_premerge_dem
  verified_at: 2026-08-14T13:45:57Z
  output: |
    == chân pre-merge: đếm cửa + chiều ghi-ngược ==
      OK   da-veto chưa xử → VIOLATION
      OK   ghi-ngược không vết → VIOLATION
      OK   NOTE đếm cửa mở, đích danh slug
      OK   giữ-gân: có entry sổ → CHO QUA, không chặn oan
           [chiều đỏ] bốn chân đi qua CHÍNH pre-merge trên repo giả, mỗi lượt một commit thật
    RANG-VETO: XANH — mọi chân qua checker thật, chiều đỏ chạy trong cùng lượt

- eval: E3b
  run_id: veto-co-dau-vet-E3b-20260814T134606Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_ghi_nguoc
  verified_at: 2026-08-14T13:46:06Z
  output: |
    == chân pre-merge: đếm cửa + chiều ghi-ngược ==
      OK   da-veto chưa xử → VIOLATION
      OK   ghi-ngược không vết → VIOLATION
      OK   NOTE đếm cửa mở, đích danh slug
      OK   giữ-gân: có entry sổ → CHO QUA, không chặn oan
           [chiều đỏ] bốn chân đi qua CHÍNH pre-merge trên repo giả, mỗi lượt một commit thật
    RANG-VETO: XANH — mọi chân qua checker thật, chiều đỏ chạy trong cùng lượt

- eval: E4
  run_id: veto-co-dau-vet-E4-20260814T134614Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_premerge_sach
  verified_at: 2026-08-14T13:46:14Z
  output: |
    == chân pre-merge: sáu điều kiện sạch ==
      OK   sạch/T2 đủ sáu → đi tiếp, không mời ký
      OK   sạch/hạng T3 → VIOLATION
      OK   sạch/có known-limit → VIOLATION
      OK   sạch/VẮNG hai mục → VIOLATION
      OK   sạch/có UNCERTAIN → VIOLATION
           [chiều đỏ] năm chân đi qua CHÍNH scripts/pre-merge-check.sh trên repo giả code-sinh
    RANG-VETO: XANH — mọi chân qua checker thật, chiều đỏ chạy trong cùng lượt

- eval: E5
  run_id: veto-co-dau-vet-E5-20260814T134620Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_vanban
  verified_at: 2026-08-14T13:46:20Z
  output: |
    == chân luật văn bản: ba vế mới có mặt ==
      OK   văn bản: vế xanh-sạch thôi mời ký (bản gốc)
      OK   văn bản: vế V ở Cổng Phạm vi (bản gốc)
      OK   văn bản: vế lệnh-nối tự tan
      OK   văn bản: vế khó-đảo thắng xanh-sạch
      OK   văn bản: vế khó-đảo (bản vòng lặp)
      OK   văn bản: vế V (bản vòng lặp)
           [chiều đỏ] bản đột biến mất vế khó-đảo → chân tương ứng sẽ ĐỎ
    RANG-VETO: XANH — mọi chân qua checker thật, chiều đỏ chạy trong cùng lượt

<!-- <<<JUDGMENT-BLOCK-TEMPLATE -->
- eval: E6
  judged_by: hội đồng phiên sạch 2026-08-14
  verdict: PASS
  rationale: >
    Ba ca, ba hành vi ngược nhau, đều đúng (3/3). Ca xanh-sạch: đi tiếp mà VẪN
    để lại dấu vết một dòng — giữ được cả hai vế khó cùng lúc (không xin phép,
    nhưng không im lặng; im lặng là V không dấu vết, chính là bỏ-cổng). Ca có
    giới hạn mới: nhận diện đúng «xanh nhưng có đánh-đổi» và mời ký đúng khuôn
    một-quyết-định, câu mẫu để trống thật. Ca veto giữa chừng: dừng ngay ở nhịp
    1 không cãi, không tự khởi động lại ở nhịp 2. Điểm mờ duy nhất đã cân hai
    chiều: câu «nhắn một chữ khi muốn chạy tiếp» ở nhịp 2 — kết luận không phải
    bày menu (không lựa chọn, không dấu hỏi; nó phát biểu ĐIỀU KIỆN chạy tiếp,
    và tiêu chí ĐẠT đã đòi «chờ», mà chờ thì tất yếu phải có tín hiệu thôi chờ).
    T3: đây là KHUYẾN NGHỊ, người chốt tại Cổng Bằng chứng.
  human_override:
<!-- JUDGMENT-BLOCK-TEMPLATE>>> -->

- eval: E7
  judged_by: hội đồng phiên sạch 2026-08-14
  verdict: PASS
  rationale: >
    Hai ca cho hai màu ngược nhau đúng theo ranh giới danh sách (2/2). Việc
    chạm khó-đảo: dừng, giữ nguyên trạng thái tắt, trả quyết định cho người kèm
    lý do KHÔNG-ĐẢO-ĐƯỢC (không chỉ nhắc suông tên danh sách). Việc đảo-rẻ: đi
    tiếp + báo một dòng, nêu rõ cửa đảo còn sống. Ranh giới rút từ chính danh
    sách khó-đảo, không từ độ xanh của bằng chứng — nên nhánh chặn không lan quá
    phạm vi. T3: đây là KHUYẾN NGHỊ, người chốt tại Cổng Bằng chứng.
  human_override:

- eval: E8
  run_id: veto-co-dau-vet-E8-20260814T134735Z
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-14T13:47:35Z
  output: |
      PASS: GCV1c card mu phai bao dung KHONG duyet
      PASS: GCV1e nhanh CUT ra toi card that: card neu doc THIEU
      PASS: GCV1f card cut cung bao dung duyet
      PASS: GCV1d contract lanh khong sinh canh bao nao
    Results: 686 passed, 0 failed
    (dòng `Results:` CUỐI = 686, khớp SO-CA-KY-VONG-V và ≥ sàn 686)

- eval: E8b
  run_id: veto-co-dau-vet-E8b-20260814T134742Z
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-08-14T13:47:42Z
  output: |
    T41 v2 observed containing mid-line #selector -> allow (comment strip must not swallow it)
      PASS: T41
    T42 v2 short observed then same-indent sibling field -> still block (sibling text must not count)
      PASS: T42
    Results: 54 passed, 0 failed
    (dòng `Results:` CUỐI = 54, khớp SO-CA-KY-VONG-V và ≥ sàn 54)

- eval: E8c
  run_id: veto-co-dau-vet-E8c-20260814T134929Z
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-14T13:49:29Z
  output: |
      PASS: P194 hai nguyen tac may-ganh-nguoi-quyet: neo grammar + 6 than lenh + truong ghi
    Results: all plugin tests passed
    (suite không in tổng — đếm dòng `  PASS: ` = 146, khớp SO-CA-KY-VONG-V và ≥ sàn 146)

- eval: E8d
  run_id: veto-co-dau-vet-E8d-20260814T134946Z
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-14T13:49:46Z
  output: |
    Results: 324 passed, 0 failed (acceptance-verify)
    Results: 11 passed, 0 failed
    Results: 42 passed, 0 failed
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 26 passed, 0 failed
    Results: 44 passed, 0 failed
    Results: all workflow tests passed
    (cộng ĐÚNG 6 dòng tổng = 463, khớp SO-CA-KY-VONG-V và ≥ sàn 463)

- eval: E8e
  run_id: veto-co-dau-vet-E8e-20260814T135250Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_so_ca
  verified_at: 2026-08-14T13:52:50Z
  output: |
    == chân số ca: đẳng thức VÀ sàn ==
      OK   số ca scripts: 686 = 686 (≥ sàn 686)
      OK   số ca hooks: 54 = 54 (≥ sàn 54)
      OK   số ca plugins: 146 = 146 (≥ sàn 146)
      OK   số ca workflows: 463 = 463 (≥ sàn 463)
           [chiều đỏ] log tiêm thêm 1 ca: 146 -> 147
    RANG-VETO: XANH — mọi chân qua checker thật, chiều đỏ chạy trong cùng lượt

## Hai mục NGƯỜI phải tự chốt tại Cổng Bằng chứng

Hạng T3 → verdict hội đồng chỉ là khuyến nghị. Hai mục dưới đây chờ verdict
trực tiếp của người; điền `human_override: <tên> <ngày>` vào từng khối.

- **E6 (AC-6)** — máy đi tiếp đúng lúc · mời ký khi có đánh-đổi · dừng ngay
  khi người veto. Hội đồng khuyến nghị PASS 3/3.
- **E7 (AC-7)** — khó-đảo luôn thắng xanh-sạch · không chặn oan việc đảo-rẻ.
  Hội đồng khuyến nghị PASS 2/2.

Biên bản đầy đủ + điểm mờ đã cân: `_acceptance/veto-co-dau-vet/review-findings.md`.

## Known limits

- **(a) Mốc đối chứng `BASE-V` = `c2f38ca` cố định.** Sau khi hồ sơ merge,
  chân so-với-mốc mất ý nghĩa dần: needle tiến về 0 ở cả hai đầu và phép so
  «luật cũ nguyên văn» thành tự-tham-chiếu. Cùng lớp known-limit với hồ sơ
  luu-kho và 1c. Tái lập: `bash _acceptance/veto-co-dau-vet/rang-veto.sh
  --chan hook-cu` và `git show c2f38ca:lib/evidence-core.cjs | grep -c
  "Gate 1 approval not recorded"`.
- **(b) Thêm luật vào lưới trước-merge phải đi qua một dòng miễn trừ ĐÍCH
  DANH trong `ALLOWED_REMOVALS`** của `tests/scripts/additive-only.test.mjs`.
  Hai guard khoá nhau: `DV5` cấm sửa/xoá dòng luật cũ, `RL7a1` đòi tập tên
  trong sổ luật KHỚP tập `ledger_mark` trong script — mà thêm luật thì buộc
  phải chạm dòng khai. Đây là đường đã chọn có dấu vết (miễn trừ theo CHUỖI
  cũ đích danh, không theo mẫu, nên mọi sửa khác trên dòng ấy vẫn đỏ). Tái
  lập: `grep -n "veto" tests/scripts/additive-only.test.mjs`.
- **(c) Lớp máy KHÔNG đo được lời hứa hành-vi-agent.** AC-6/AC-7 sống ở hội
  đồng, và ở T3 verdict cuối là của người. Bộ răng khai thẳng vai này ở đầu
  file. Tái lập: `sed -n '1,14p' _acceptance/veto-co-dau-vet/rang-veto.sh`.
- **(d) Cơ chế V mới KHÔNG có lưới hồi quy vĩnh viễn.** `SO-CA-KY-VONG-V` =
  đúng bộ số nền 1c (686 · 54 · 146 · 463) — tức hồ sơ này CỘNG 0 ca vào bốn
  suite; toàn bộ răng của cơ chế V sống trong `rang-veto.sh` của workspace,
  và bộ răng đó chết theo hồ sơ khi merge. Sau merge, nhánh V ở
  `lib/evidence-core.cjs` và luật veto ở `scripts/pre-merge-check.sh` không
  còn ca nào canh. Tái lập: `grep -rln "veto" tests/` (chỉ trúng
  `tests/scripts/additive-only.test.mjs`, là dòng miễn trừ của mục (b), không
  phải ca đo hành vi).
- **(e) Vài chân răng hẹp hơn lời hứa ở `evals.yaml`** — chi tiết ở mục
  `## Analyst`. Đây là khoảng cách THƯỚC, không phải vật đỏ.

## Ngoài hợp đồng

Không có phát hiện nằm ngoài phạm vi hợp đồng. Mọi điểm nêu trong báo cáo này
đều trace về một AC của `contract.md`.

## Analyst

Không eval nào đỏ. Nhưng phiên chấm đọc `expected` của từng eval rồi đối chiếu
với các chân mà `rang-veto.sh` THẬT SỰ khẳng định, và thấy năm khoảng cách —
ghi thẳng để người cân ở Cổng Bằng chứng:

1. **E3 và E3b chạy CÙNG MỘT khối mã.** `rang-veto.sh` dòng 131 nhận cả
   `--chan premerge-dem` lẫn `--chan ghi-nguoc` vào một nhánh; output hai lượt
   giống nhau từng ký tự. Hai eval id, một phép đo — AC-3 và AC-3b không có
   bằng chứng độc lập.
2. **E3 thiếu vế KHÔNG-được-kêu-oan.** `expected` đòi «fixture không có cửa
   veto nào → KHÔNG in NOTE, KHÔNG VIOLATION nào từ luật mới». Bốn chân đang
   chạy đều có cửa veto; vế im-lặng-khi-không-có-veto không được đo.
3. **E3b thiếu chân XOÁ khoá.** `expected` đòi «XOÁ khoá `veto_state` khỏi hồ
   sơ đã rời draft → VIOLATION». Chỉ chiều `da-veto → mo` được đo. Nhánh cài
   đặt CÓ tồn tại (`scripts/pre-merge-check.sh` dòng 1115) nhưng không ca nào
   đi qua nó.
4. **E4 chạy 5 chân trên 9 chân được hứa.** `expected` liệt kê chín: verdict≠PASS
   · VẮNG khoá verdict · UNCERTAIN · bypass · known-limit · ngoài-hợp-đồng ·
   VẮNG mục Known limits · VẮNG mục Ngoài-hợp-đồng · hạng T3. Thực chạy: T2-đủ-sáu
   (dương) + T3 + known-limit + UNCERTAIN + «VẮNG hai mục» (một fixture bỏ CẢ HAI
   mục cùng lúc, gộp hai chân thành một). Không đo: verdict≠PASS · vắng khoá
   verdict · bypass · finding ngoài-hợp-đồng. Thêm nữa, hồ sơ report do
   `gen_report` sinh KHÔNG mang trường hạng nào, nên vế «báo cáo tự khai hạng
   KHÔNG được tính» của AC-4 chưa được đâm thử.
5. **E5 thiếu needle ÂM.** AC-5 đòi «needle ÂM (câu luật cũ phải biến) pin lúc
   thi công KÈM đối chứng dương đo thật trên `BASE-V`». Chân `vanban` chỉ có 6
   grep DƯƠNG; chiều đỏ là sed trên một BẢN CHÉP rồi grep lại — nó chứng minh
   grep chạy, không chứng minh câu luật cũ đã biến khỏi cây.

Non-discriminating: bốn suite (E8/E8b/E8c/E8d) xanh trên cả hai nền — đúng vai
lưới hồi quy, không phải răng của tính năng này. Năm chân răng E1–E5 và E8e
mang `baseline: n-a` vì `rang-veto.sh` KHÔNG tồn tại trên `c2f38ca` (kiểm:
`git cat-file -e c2f38ca:_acceptance/veto-co-dau-vet/rang-veto.sh`); khả năng
phân biệt của chúng dựa vào chiều-đỏ chạy trong cùng lượt, không dựa vào A/B.

## Variance

none — không eval nào chạy nhiều lượt.

## Iterations

Round 1: 11/11 eval máy xanh; 2 mục judgment giữ khuyến nghị hội đồng, chờ
verdict trực tiếp của người theo luật T3.

## Gate 2 checklist (human)

- [ ] Đọc bảng + soi 1-2 khối bằng chứng
- [ ] T3: tự chốt CẢ HAI mục judgment (E6, E7) và điền `human_override:
      <tên> <ngày>` vào từng khối — verdict hội đồng chỉ là khuyến nghị
- [ ] Cân 5 khoảng cách thước ở `## Analyst` và known-limit (d): nhận như
      known-limits, hay trả về thi công một vòng
- [ ] Nâng verdict `PENDING-JUDGMENT` → `PASS` (lượt ghi này là lúc hook
      kiểm lại bằng chứng + các override)
- [ ] Điền `human_signoff` ở frontmatter
