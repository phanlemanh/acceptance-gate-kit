---
schema_version: 2
feature_slug: veto-co-dau-vet
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ad8caf7d7f602935ce24625507d054291ffad52a
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
  run_id: veto-co-dau-vet-E1-r2-20260814T142603Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_hook_v
  verified_at: 2026-08-14T14:26:03Z
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
  run_id: veto-co-dau-vet-E2-r2-20260814T142603Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_hook_cu
  verified_at: 2026-08-14T14:26:03Z
  output: |
    == chân hook-cũ: luật cũ nguyên văn so với BASE-V ==
      OK   hook-cũ giữ nguyên (1 bản): Gate 1 approval not recorded
      OK   hook-cũ giữ nguyên (2 bản): skips Gate 1
           [chiều đỏ] so với mốc c2f38ca, KHÔNG rút bản chép từ chính cây sau sửa
    RANG-VETO: XANH — mọi chân qua checker thật, chiều đỏ chạy trong cùng lượt

- eval: E3
  run_id: veto-co-dau-vet-E3-r2-20260814T142603Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_premerge_dem
  verified_at: 2026-08-14T14:26:03Z
  output: |
    == chân pre-merge: đếm cửa + chiều ghi-ngược ==
      OK   da-veto chưa xử → VIOLATION
      OK   ghi-ngược không vết → VIOLATION
      OK   NOTE đếm cửa mở, đích danh slug
      OK   giữ-gân: có entry sổ → CHO QUA, không chặn oan
      OK   không cửa veto → im lặng, luật mới KHÔNG kêu oan
      OK   xoá hẳn khoá khỏi hồ sơ đã rời draft → VIOLATION
           [chiều đỏ] sáu chân đi qua CHÍNH pre-merge trên repo giả, mỗi lượt một commit thật
    RANG-VETO: XANH — mọi chân qua checker thật, chiều đỏ chạy trong cùng lượt

- eval: E3b
  run_id: veto-co-dau-vet-E3b-r2-20260814T142604Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_ghi_nguoc
  verified_at: 2026-08-14T14:26:04Z
  output: |
    == chân pre-merge: đếm cửa + chiều ghi-ngược ==
      OK   da-veto chưa xử → VIOLATION
      OK   ghi-ngược không vết → VIOLATION
      OK   NOTE đếm cửa mở, đích danh slug
      OK   giữ-gân: có entry sổ → CHO QUA, không chặn oan
      OK   không cửa veto → im lặng, luật mới KHÔNG kêu oan
      OK   xoá hẳn khoá khỏi hồ sơ đã rời draft → VIOLATION
           [chiều đỏ] sáu chân đi qua CHÍNH pre-merge trên repo giả, mỗi lượt một commit thật
    RANG-VETO: XANH — mọi chân qua checker thật, chiều đỏ chạy trong cùng lượt
    (LƯU Ý: output trùng E3 từng ký tự — xem mục Analyst §1)

- eval: E4
  run_id: veto-co-dau-vet-E4-r2-20260814T142604Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_premerge_sach
  verified_at: 2026-08-14T14:26:04Z
  output: |
    == chân pre-merge: sáu điều kiện sạch ==
      OK   sạch/T2 đủ sáu → đi tiếp, không mời ký
      OK   sạch/hạng T3 → VIOLATION
      OK   sạch/có known-limit → VIOLATION
      OK   sạch/VẮNG hai mục → VIOLATION
      OK   sạch/có UNCERTAIN → VIOLATION
      OK   sạch/verdict REJECT → VIOLATION
      OK   sạch/VẮNG khoá verdict → VIOLATION
      OK   sạch/bypass_used true → VIOLATION
      OK   sạch/có finding ngoài HĐ → VIOLATION
           [chiều đỏ] chín chân đi qua CHÍNH scripts/pre-merge-check.sh trên repo giả code-sinh
    RANG-VETO: XANH — mọi chân qua checker thật, chiều đỏ chạy trong cùng lượt

- eval: E5
  run_id: veto-co-dau-vet-E5-r2-20260814T142606Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_vanban
  verified_at: 2026-08-14T14:26:06Z
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
    (CHỈ có vế dương — xem Known limits (c))

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
    T3: đây là KHUYẾN NGHỊ, người chốt tại Cổng Bằng chứng. Hội đồng chấm ở
    phiên sạch 14/08, KHÔNG chạy lại ở vòng 2 (nội dung luật không đổi giữa
    hai vòng chấm).
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
    phạm vi. T3: đây là KHUYẾN NGHỊ, người chốt tại Cổng Bằng chứng. Hội đồng
    chấm ở phiên sạch 14/08, KHÔNG chạy lại ở vòng 2.
  human_override:

- eval: E8
  run_id: veto-co-dau-vet-E8-r2-20260814T142616Z
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-14T14:26:16Z
  output: |
      PASS: GCV1c card mu phai bao dung KHONG duyet
      PASS: GCV1e nhanh CUT ra toi card that: card neu doc THIEU
      PASS: GCV1f card cut cung bao dung duyet
      PASS: GCV1d contract lanh khong sinh canh bao nao
    Results: 686 passed, 0 failed
    (dòng `Results:` CUỐI = 686, khớp SO-CA-KY-VONG-V và ≥ sàn 686)

- eval: E8b
  run_id: veto-co-dau-vet-E8b-r2-20260814T142726Z
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-08-14T14:27:26Z
  output: |
    V05 veto_state giá trị lạ -> block (chỉ mo | da-veto)
      PASS: V05
    V06 KHÔNG có khoá veto_state -> luật cũ nguyên vẹn (block vì approved_by rỗng)
      PASS: V06
    Results: 60 passed, 0 failed
    (dòng `Results:` CUỐI = 60, khớp SO-CA-KY-VONG-V mới và ≥ sàn 54 — sáu ca
     thường trực V01–V06 đã có mặt trong tests/hooks/run-tests.sh)

- eval: E8c
  run_id: veto-co-dau-vet-E8c-r2-20260814T142728Z
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-14T14:27:28Z
  output: |
      PASS: P194 hai nguyen tac may-ganh-nguoi-quyet: neo grammar + 6 than lenh + truong ghi
    Results: all plugin tests passed
    (suite không in tổng — đếm dòng `  PASS: ` = 146, khớp SO-CA-KY-VONG-V và ≥ sàn 146)

- eval: E8d
  run_id: veto-co-dau-vet-E8d-r2-20260814T142910Z
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-14T14:29:10Z
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
  run_id: veto-co-dau-vet-E8e-r2-20260814T142920Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_so_ca
  verified_at: 2026-08-14T14:29:20Z
  output: |
    == chân số ca: đẳng thức VÀ sàn ==
      OK   số ca scripts: 686 = 686 (≥ sàn 686)
      OK   số ca hooks: 60 = 60 (≥ sàn 54)
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
  lập: `git diff c2f38ca..HEAD -- tests/scripts/additive-only.test.mjs`.
- **(c) Chân `vanban` (E5) CHỈ có vế dương.** Sáu phép grep đều hỏi «cụm mới
  CÓ mặt không»; needle ÂM mà AC-5 đòi — «câu luật cũ phải BIẾN khỏi cây» —
  CHƯA được đo. Chiều đỏ của chân này là sed trên một BẢN CHÉP rồi grep lại:
  nó chứng minh grep chạy, không chứng minh câu luật cũ đã biến. **Đừng đọc
  E5 thành bằng chứng rằng luật cũ đã biến.** Tái lập:
  `sed -n '186,200p' _acceptance/veto-co-dau-vet/rang-veto.sh` — không có
  phép `grep -v`/needle-âm nào.
- **(d) Lớp máy KHÔNG đo được lời hứa hành-vi-agent.** AC-6/AC-7 sống ở hội
  đồng, và ở T3 verdict cuối là của NGƯỜI tại Cổng Bằng chứng. Bộ răng khai
  thẳng vai này ở đầu file. Tái lập:
  `sed -n '1,14p' _acceptance/veto-co-dau-vet/rang-veto.sh`.
- **(e) Bốn khoảng cách thước còn lại** giữa `evals.yaml` và chân thật sự
  chạy — chi tiết ở `## Analyst`. Đây là khoảng cách THƯỚC, không phải vật đỏ.

## Ngoài hợp đồng

Không có phát hiện nằm ngoài phạm vi hợp đồng. Mọi điểm nêu trong báo cáo này
đều trace về một AC của `contract.md`.

## Analyst

Không eval nào đỏ. Vòng 2 kiểm chứng lại bốn việc sửa mà vòng 1 khai — ba
việc ĐÚNG như khai, một việc KHÔNG:

- **ĐÚNG**: sáu ca thường trực V01–V06 có thật trong
  `tests/hooks/run-tests.sh` và chạy qua CHÍNH hook (`node "$HOOK"`); suite
  hooks 54 → **60**, khớp `SO-CA-KY-VONG-V` mới, ≥ sàn 54. Diff so với
  `c2f38ca` là **36 dòng thêm, 0 dòng xoá** — thuần CỘNG.
- **ĐÚNG**: vế KHÔNG-kêu-oan và chân xoá-hẳn-khoá đã có mặt và xanh.
- **ĐÚNG**: bốn chân điều-kiện-sạch còn thiếu (verdict REJECT · vắng khoá
  verdict · bypass · finding ngoài hợp đồng) đã có mặt — E4 nay chạy 9 chân.
- **KHÔNG**: xem §1 dưới đây.

Bốn khoảng cách còn lại giữa lời hứa `evals.yaml` và chân thật sự chạy:

1. **E3 và E3b VẪN chạy cùng một khối mã.** Vòng 1 khai «đã tách
   `--chan ghi-nguoc` khỏi `premerge-dem`», nhưng chốt canh ở
   `rang-veto.sh` dòng 144 là `[ "$CHAN" = "premerge-dem" ] || [ "$CHAN" =
   "ghi-nguoc" ]` — MỘT khối chạy trọn cho CẢ HAI cờ. Output hai lượt vòng 2
   giống nhau từng ký tự (so bằng `diff` trên hai log). Cái đã đổi là cờ
   `ghi-nguoc` nay được NHẬN, không phải phép đo được tách. Hệ quả: AC-3 và
   AC-3b vẫn không có bằng chứng độc lập, và một hồi quy chỉ chạm luật đếm-cửa
   sẽ làm ĐỎ cả hai eval id cùng lúc, che mất việc chỉ một AC hỏng. Tái lập:
   `sed -n '144p' _acceptance/veto-co-dau-vet/rang-veto.sh`.
2. **E2 thiếu hẳn chân thứ hai được hứa.** `evals.yaml` hứa «so DANH SÁCH TÊN
   ca của suite hooks giữa BASE-V và HEAD — sửa-tại-chỗ một ca cũ cho khớp
   hành vi mới không đổi tổng số nên E8b mù với nó». Chân `hook-cu` thực chạy
   chỉ so ĐÚNG HAI chuỗi thông điệp trong `lib/evidence-core.cjs`; không phép
   đo nào đụng tới danh sách tên ca của suite hooks. Phiên chấm đã tự làm phép
   so ấy BẰNG TAY ở vòng 2 và kết quả sạch (chỉ V01–V06 thêm vào, không ca cũ
   nào bị xoá/đổi tên) — nhưng đó là bàn tay phiên chấm, KHÔNG phải phép đo
   sống trong hồ sơ. Tái lập:
   `git show c2f38ca:tests/hooks/run-tests.sh | grep -oE 'check [A-Za-z0-9]+' | sort > /tmp/a.txt`
   rồi `grep -oE 'check [A-Za-z0-9]+' tests/hooks/run-tests.sh | sort | diff /tmp/a.txt -`.
3. **E4: hai chân «VẮNG mục» vẫn gộp làm một fixture.** `evals.yaml` liệt
   `VẮNG hẳn mục Known limits` và `VẮNG hẳn mục Ngoài-hợp-đồng` thành HAI chân
   và ghi rõ «mỗi chân một fixture riêng». Thực chạy: một fixture `novang` bỏ
   CẢ HAI mục cùng lúc. Nếu lõi chỉ kiểm một trong hai mục thì ca này vẫn
   xanh. Tái lập: `sed -n '104,126p' _acceptance/veto-co-dau-vet/rang-veto.sh`.
4. **E4: vế «báo cáo tự khai hạng KHÔNG được tính» chưa bị đâm thử.** AC-4 đòi
   hạng đọc từ `risk_tier` của CONTRACT, và `evals.yaml` gọi tên ca «contract
   hạng T3 trong khi report tự khai T2». Hồ sơ report do `gen_report` sinh
   KHÔNG mang trường hạng nào — nên ca đang chạy chỉ chứng minh «contract T3 →
   VIOLATION», không chứng minh «report tự phong T2 KHÔNG cứu được contract
   T3». Tái lập: `grep -n "gen_report()" -A 4
   _acceptance/veto-co-dau-vet/rang-veto.sh` — không có khoá hạng nào.

Non-discriminating: bốn suite (E8/E8b/E8c/E8d) xanh trên cả hai nền — đúng vai
lưới hồi quy, không phải răng riêng của tính năng này. Sáu chân răng E1–E5 và
E8e mang `baseline: n-a` vì `rang-veto.sh` KHÔNG tồn tại trên `c2f38ca` (kiểm:
`git cat-file -e c2f38ca:_acceptance/veto-co-dau-vet/rang-veto.sh`); khả năng
phân biệt của chúng dựa vào chiều-đỏ chạy trong cùng lượt, không dựa vào A/B.

## Variance

none — không eval nào chạy nhiều lượt.

## Iterations

Round 1 (14/08, 13:45–13:52): 11/11 eval máy xanh, verdict PENDING-JUDGMENT.
Phiên chấm tìm 6 khoảng cách «thước hẹp hơn lời hứa», nặng nhất là: hồ sơ CỘNG
0 ca vào lưới thường trực nên sau merge cơ chế V không còn ca nào canh; E3/E3b
dùng chung một khối mã; E4 chạy 5/9 chân được hứa; E3 thiếu vế không-kêu-oan;
E3b thiếu chân xoá-khoá; E5 thiếu needle âm. Trả về thi công.

Round 2 (14/08, 14:26–14:29, commit `ad8caf7`): 11/11 eval máy xanh trên cây
đã sửa. Kiểm chứng: 6 ca thường trực V01–V06 CÓ THẬT (hooks 54 → 60, thuần
cộng), vế không-kêu-oan + chân xoá-khoá + 4 chân điều-kiện-sạch CÓ THẬT (E4
nay 9 chân). Việc «tách E3/E3b» KHÔNG thành — xem Analyst §1. Bốn khoảng cách
thước còn lại chuyển thành mục người cân ở cổng.

## Gate 2 checklist (human)

- [ ] Đọc bảng + soi 1-2 khối bằng chứng
- [ ] T3: tự chốt CẢ HAI mục judgment (E6, E7) và điền `human_override:
      <tên> <ngày>` vào từng khối — verdict hội đồng chỉ là khuyến nghị
- [ ] Cân 4 khoảng cách thước ở `## Analyst` + known-limits (a)–(d): nhận như
      known-limits, hay trả về thi công một vòng nữa
- [ ] Nâng verdict `PENDING-JUDGMENT` → `PASS` (lượt ghi này là lúc hook
      kiểm lại bằng chứng + các override)
- [ ] Điền `human_signoff` ở frontmatter
