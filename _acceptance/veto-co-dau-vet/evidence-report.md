---
schema_version: 2
feature_slug: veto-co-dau-vet
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 09f4c1617742fb3630734c616705a4606183f95f
human_signoff: Manh Phan 2026-08-15
---

# Evidence Report: veto-co-dau-vet

Hạng **T3**: mọi mục judgment cần verdict TRỰC TIẾP của người. Hai verdict
hội đồng dưới đây là **khuyến nghị**, không phải kết luận — nên verdict tổng
là `PENDING-JUDGMENT`. Đây là đường đúng của hồ sơ T3, không phải lỗi.

Đây là **vòng chấm 3, vòng cuối** theo luật max-3. Mọi khoảng cách còn lại
được ghi thẳng thành known-limit để người cân tại cổng — không có đề nghị
vòng 4.

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
  run_id: veto-co-dau-vet-E1-r3-20260814T144404Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_hook_v
  verified_at: 2026-08-14T14:44:04Z
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
  run_id: veto-co-dau-vet-E2-r3-20260814T144404Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_hook_cu
  verified_at: 2026-08-14T14:44:04Z
  output: |
    == chân hook-cũ: luật cũ nguyên văn so với BASE-V ==
      OK   hook-cũ giữ nguyên (1 bản): Gate 1 approval not recorded
      OK   hook-cũ giữ nguyên (2 bản): skips Gate 1
      OK   hook-cũ: 0 ca của mốc biến mất (so DANH SÁCH TÊN, không so tổng)
           [chiều đỏ] ca THÊM so với mốc: V01 V02 V03 V04 V05 V06
           [chiều đỏ] so với mốc c2f38ca, KHÔNG rút bản chép từ chính cây sau sửa
    RANG-VETO: XANH — mọi chân qua checker thật, chiều đỏ chạy trong cùng lượt
    (chân thứ hai vòng 2 đòi NAY CÓ THẬT: so danh sách TÊN ca suite hooks giữa
     BASE-V và HEAD. Đếm-vệ-sinh của phiên chấm: mốc rút 52 tên, HEAD rút 58 —
     phép rút KHÔNG rỗng ở cả hai đầu, nên «0 ca biến mất» là kết luận sống,
     không phải kết luận từ hai tập rỗng.)

- eval: E3
  run_id: veto-co-dau-vet-E3-r3-20260814T144404Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_premerge_dem
  verified_at: 2026-08-14T14:44:04Z
  output: |
    == chân pre-merge: đếm cửa + chiều ghi-ngược ==
      OK   da-veto chưa xử → VIOLATION
      OK   NOTE đếm cửa mở, đích danh slug
      OK   không cửa veto → im lặng, luật mới KHÔNG kêu oan
           [chiều đỏ] sáu chân đi qua CHÍNH pre-merge trên repo giả, mỗi lượt một commit thật
    RANG-VETO: XANH — mọi chân qua checker thật, chiều đỏ chạy trong cùng lượt
    (ĐÚNG 3 assert của AC-3, KHÔNG assert nào của AC-3b — xem Analyst §1)

- eval: E3b
  run_id: veto-co-dau-vet-E3b-r3-20260814T144405Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_ghi_nguoc
  verified_at: 2026-08-14T14:44:05Z
  output: |
    == chân pre-merge: đếm cửa + chiều ghi-ngược ==
      OK   ghi-ngược không vết → VIOLATION
      OK   giữ-gân: có entry sổ → CHO QUA, không chặn oan
      OK   xoá hẳn khoá khỏi hồ sơ đã rời draft → VIOLATION
           [chiều đỏ] sáu chân đi qua CHÍNH pre-merge trên repo giả, mỗi lượt một commit thật
    RANG-VETO: XANH — mọi chân qua checker thật, chiều đỏ chạy trong cùng lượt
    (ĐÚNG 3 assert của AC-3b, RỜI HẲN khỏi tập assert của E3 ở trên)

- eval: E4
  run_id: veto-co-dau-vet-E4-r3-20260814T144405Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_premerge_sach
  verified_at: 2026-08-14T14:44:05Z
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
      OK   sạch/VẮNG riêng mục Ngoài-hợp-đồng → VIOLATION
      OK   sạch/VẮNG riêng mục Known limits → VIOLATION
      OK   sạch/contract T3 mà report tự khai T2 → VIOLATION
    RANG-VETO: XANH — mọi chân qua checker thật, chiều đỏ chạy trong cùng lượt
    (12 chân, mỗi chân một fixture code-sinh riêng, tất cả qua CHÍNH
     scripts/pre-merge-check.sh. Hai chân VẮNG nay TÁCH THẬT thành hai fixture.
     Chân thứ 12 xanh nhưng KHÔNG cô lập lớp — xem Analyst §1c.)

- eval: E5
  run_id: veto-co-dau-vet-E5-r3-20260814T144407Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_vanban
  verified_at: 2026-08-14T14:44:07Z
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
    (CHỈ vế DƯƠNG — đọc kèm known-limit (c))

<!-- E6, E7: hội đồng phiên sạch 2026-08-14 — KHÔNG chạy lại ở vòng 3.
     Hạng T3 → verdict hội đồng là khuyến nghị; người chốt trực tiếp. -->
- eval: E6
  judged_by: hội đồng phiên sạch 2026-08-14
  verdict: PASS
  rationale: |
    Ba ca, ba hành vi ngược nhau, đều đúng (3/3). Ca xanh-sạch: đi tiếp mà VẪN
    để lại dấu vết một dòng — giữ cả hai vế khó cùng lúc. Ca có giới hạn mới:
    nhận diện đúng «xanh nhưng có đánh-đổi» và mời ký đúng khuôn một-quyết-định.
    Ca veto giữa chừng: dừng ngay ở nhịp 1, không cãi, không tự khởi động lại.
    Điểm mờ duy nhất (câu «nhắn một chữ khi muốn chạy tiếp») đã được giám khảo
    cân hai chiều và kết ĐẠT: phát biểu ĐIỀU KIỆN chạy tiếp, không phải menu.
    Biên bản đầy đủ: review-findings.md.
  required_evidence:
    - (judge không nêu bằng-chứng-thiếu — verdict PASS)
  human_override: Mạnh Phan 2026-08-15

- eval: E7
  judged_by: hội đồng phiên sạch 2026-08-14
  verdict: PASS
  rationale: |
    Hai ca cho hai màu ngược nhau đúng theo ranh giới danh sách khó-đảo (2/2).
    Việc chạm khó-đảo: dừng, giữ nguyên trạng thái tắt, trả quyết định cho
    người kèm lý do KHÔNG-ĐẢO-ĐƯỢC. Việc đảo-rẻ: đi tiếp + báo một dòng, nêu rõ
    cửa đảo còn sống. Ranh giới rút từ chính danh sách KHO-DAO-V, không từ độ
    xanh của bằng chứng — nhánh chặn không lan quá phạm vi.
  required_evidence:
    - (judge không nêu bằng-chứng-thiếu — verdict PASS)
  human_override: Mạnh Phan 2026-08-15

- eval: E8
  run_id: veto-co-dau-vet-E8-r3-20260814T144416Z
  exit_code: 0
  baseline: green
  verifier: config:executors.test.scripts
  verified_at: 2026-08-14T14:44:16Z
  output: |
      PASS: GCV1e nhanh CUT ra toi card that: card neu doc THIEU
      PASS: GCV1f card cut cung bao dung duyet
      PASS: GCV1d contract lanh khong sinh canh bao nao
    Results: 686 passed, 0 failed
    (dòng `Results:` CUỐI = 686, khớp SO-CA-KY-VONG-V và ≥ sàn 686)

- eval: E8b
  run_id: veto-co-dau-vet-E8b-r3-20260814T144526Z
  exit_code: 0
  baseline: green
  verifier: config:executors.test.hooks
  verified_at: 2026-08-14T14:45:26Z
  output: |
    V05 veto_state giá trị lạ -> block (chỉ mo | da-veto)
      PASS: V05
    V06 KHÔNG có khoá veto_state -> luật cũ nguyên vẹn (block vì approved_by rỗng)
      PASS: V06
    Results: 60 passed, 0 failed
    (dòng `Results:` CUỐI = 60, khớp SO-CA-KY-VONG-V mới và ≥ sàn 54 — sáu ca
     thường trực V01–V06 có mặt trong tests/hooks/run-tests.sh)

- eval: E8c
  run_id: veto-co-dau-vet-E8c-r3-20260814T144528Z
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-14T14:45:28Z
  output: |
      PASS: P194 hai nguyen tac may-ganh-nguoi-quyet: neo grammar + 6 than lenh + truong ghi
    Results: all plugin tests passed
    (suite không in tổng — đếm dòng `  PASS: ` = 146, khớp SO-CA-KY-VONG-V và ≥ sàn 146)

- eval: E8d
  run_id: veto-co-dau-vet-E8d-r3-20260814T144711Z
  exit_code: 0
  baseline: green
  verifier: config:executors.test.workflows
  verified_at: 2026-08-14T14:47:11Z
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
  run_id: veto-co-dau-vet-E8e-r3-20260814T144712Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_veto_so_ca
  verified_at: 2026-08-14T14:47:12Z
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
  `grep -n "chan_ve\|grep -qF" _acceptance/veto-co-dau-vet/rang-veto.sh` —
  không có phép `grep -v`/needle-âm nào trong chân này.
- **(d) Lớp máy KHÔNG đo được lời hứa hành-vi-agent.** AC-6/AC-7 sống ở hội
  đồng, và ở T3 verdict cuối là của NGƯỜI tại Cổng Bằng chứng. Bộ răng khai
  thẳng vai này ở đầu file. Tái lập:
  `sed -n '1,14p' _acceptance/veto-co-dau-vet/rang-veto.sh`.
- **(e) Chân thứ 12 của E4 xanh nhưng KHÔNG cô lập lớp nó gọi tên.** Chân
  «contract T3 mà report tự khai T2» dựng fixture VẮNG cả hai mục Known
  limits + Ngoài-hợp-đồng, nên VIOLATION nổ vì thiếu mục, KHÔNG cần tới hạng.
  Phiên chấm đã đâm thử và xác nhận: cùng fixture ấy đổi contract sang **T2**
  thì VẪN nổ VIOLATION — tức chân này sẽ xanh y nguyên kể cả khi pre-merge
  đọc hạng từ BÁO CÁO thay vì từ hợp đồng. **Vật thì đúng** (phiên chấm đo
  riêng, cả hai chiều: contract T3 + report tự khai T2 → chặn; contract T2 +
  report tự khai T3 → cho qua), nhưng phép đo trong hồ sơ không phân biệt
  được điều đó; vế «hạng đọc từ contract» thực chất được canh bởi chân số 2
  (`sạch/hạng T3`, đủ hai mục), không bởi chân số 12. Đây là khoảng cách
  THƯỚC, không phải vật đỏ. Tái lập: xem `## Analyst` §1c.

## Ngoài hợp đồng

Không có phát hiện nằm ngoài phạm vi hợp đồng. Mọi điểm nêu trong báo cáo này
đều trace về một AC của `contract.md`.

## Analyst

Không eval nào đỏ: 11/11 eval máy xanh trên cây `09f4c16`.

### §1 — Kiểm chứng BA lời khai của lượt sửa sau vòng 2

Phiên chấm KHÔNG tin lời khai; mỗi lời khai được đâm bằng một phép đo riêng.

**1a. «Tách THẬT `--chan ghi-nguoc` khỏi `premerge-dem`» — ĐÚNG.** Vòng 2 bắt
được lời khai sai ở đúng chỗ này (lượt trước chỉ thêm chú thích, khối mã vẫn
chạy trọn cho cả hai cờ, output hai lượt giống nhau TỪNG KÝ TỰ). Lượt này
kiểm lại bằng cùng phép đo: chạy riêng hai cờ rồi `diff` hai log. Kết quả —
hai tập assert **RỜI HẲN nhau**, 3 assert mỗi bên, 0 dòng chung ngoài tiêu đề
và dòng tổng:

- `premerge-dem` → da-veto chưa xử · NOTE đếm cửa · không-kêu-oan (đúng AC-3)
- `ghi-nguoc` → ghi ngược · giữ-gân entry sổ · xoá khoá (đúng AC-3b)

Đọc mã xác nhận cơ chế: hai biến `DEM`/`NGUOC` gác từng assert, và `bad()` —
đường DUY NHẤT làm tăng bộ đếm đỏ — nằm TRONG khối đã gác. Nên một hồi quy
chỉ chạm luật đếm-cửa nay làm đỏ E3 mà KHÔNG kéo E3b theo, và ngược lại. AC-3
và AC-3b nay có bằng chứng độc lập.

**1b. «E2 thêm chân so DANH SÁCH TÊN ca suite hooks» — ĐÚNG, và không rỗng.**
Chân có thật và xanh. Vì đây đúng hình dạng «grep 0 hit vẫn xanh», phiên chấm
chạy đếm-vệ-sinh độc lập trước khi tin: phép rút tên trả **52 tên** trên mốc
`c2f38ca` và **58 tên** trên HEAD — cả hai đầu đều KHÔNG rỗng, nên kết luận
«0 ca của mốc biến mất» là kết luận sống. Chênh 6 tên chính là V01–V06, khớp
với dòng chiều-đỏ mà chân tự in ra.

**1c. «E4 tách hai chân VẮNG + thêm chân contract-T3-mà-report-tự-khai-T2» —
ĐÚNG một nửa.** Hai chân VẮNG đã tách thật thành hai fixture riêng (một
fixture giữ mục Known limits, một giữ mục Ngoài-hợp-đồng) và cả hai xanh —
đây là phần ĐÚNG, đóng đúng khoảng cách vòng 2 nêu. Chân thứ 12 thì CÓ MẶT và
xanh, nhưng **không đo được thứ nó gọi tên**: fixture của nó bỏ CẢ HAI mục,
nên VIOLATION đã được bảo đảm bởi luật thiếu-mục trước khi hạng kịp nói gì.

Phiên chấm đâm thử ba lượt trên repo giả dựng bằng chính khuôn của chân ấy:

| Đâm thử | contract | report tự khai | Hai mục | Kết quả |
|---|---|---|---|---|
| tái dựng chân 12 | T3 | T2 | VẮNG | VIOLATION |
| **đổi hạng contract** | **T2** | T2 | VẮNG | **VẪN VIOLATION** |
| cô lập lớp (đủ hai mục) | T3 | T2 | đủ | VIOLATION |
| cô lập lớp, chiều ngược | T2 | T3 | đủ | cho qua |

Dòng 2 là kết luận: fixture của chân 12 nổ mà KHÔNG cần tới hạng, nên chân đó
sẽ xanh y nguyên kể cả khi vật hỏng theo đúng cách nó định canh. Hai dòng
cuối là phép đo cô-lập-lớp mà phiên chấm tự chạy: **vật ĐÚNG cả hai chiều** —
hạng đọc từ hợp đồng, báo cáo tự phong không cứu được T3 và cũng không hại
được T2. Đây là lớp «mutant phải có ca cô lập lớp», và nó là lỗi THƯỚC.
Chuyển thành known-limit (e) — vòng cuối, người cân tại cổng.

### §2 — Bốn khoảng cách vòng 2 nêu: đóng 3, còn 1 đổi hình

- E3/E3b dùng chung khối mã → **ĐÓNG** (§1a).
- E2 thiếu chân danh-sách-tên → **ĐÓNG** (§1b).
- E4 hai chân VẮNG gộp fixture → **ĐÓNG** (§1c, nửa đúng).
- E4 vế «báo cáo tự khai hạng» chưa bị đâm thử → **CÒN**, đổi hình: vòng 2 là
  «không có chân nào», vòng 3 là «có chân nhưng chân không phân biệt được».
  Xanh-giả rẻ hơn vắng-mặt, nên đây là khoảng cách đáng ghi tên, dù vật đúng.

### §3 — Non-discriminating

Bốn suite (E8/E8b/E8c/E8d) xanh trên cả hai nền — đúng vai lưới hồi quy,
không phải răng riêng của tính năng này. Sáu chân răng E1–E5 và E8e mang
`baseline: n-a` vì `rang-veto.sh` KHÔNG tồn tại trên `c2f38ca` (kiểm:
`git cat-file -e c2f38ca:_acceptance/veto-co-dau-vet/rang-veto.sh`); khả năng
phân biệt của chúng dựa vào chiều-đỏ chạy trong cùng lượt, không dựa vào A/B.

## Variance

none — không eval nào chạy nhiều lượt.

## Iterations

Round 1 (14/08, 13:45–13:52): 11/11 eval máy xanh, verdict PENDING-JUDGMENT.
Phiên chấm tìm 6 khoảng cách «thước hẹp hơn lời hứa», nặng nhất là: hồ sơ CỘNG
**0 ca** vào lưới thường trực nên sau merge cơ chế V không còn ca nào canh;
E3/E3b dùng chung một khối mã; E4 chạy 5/9 chân được hứa; E3 thiếu vế
không-kêu-oan; E3b thiếu chân xoá-khoá; E5 thiếu needle âm. Trả về thi công.

Round 2 (14/08, 14:26–14:29, commit `ad8caf7`): 11/11 eval máy xanh. Phiên
chấm bắt được **một LỜI KHAI SAI** — lượt sửa tuyên đã tách `ghi-nguoc` khỏi
`premerge-dem` nhưng thực chất chỉ thêm chú thích, hai lượt chạy cho output
giống nhau từng ký tự — cùng **ba chân bị hứa mà vắng**: chân so danh-sách-tên
ca của E2, hai chân VẮNG-mục tách riêng của E4, và chân báo-cáo-tự-khai-hạng.
Sáu ca thường trực V01–V06 thì CÓ THẬT (hooks 54 → 60, thuần cộng). Trả về
thi công lần hai.

Round 3 (14/08, 14:44–14:47, commit `09f4c16`, **vòng cuối**): 11/11 eval máy
xanh. Kiểm chứng ba lời khai của lượt sửa: tách E3/E3b **ĐÚNG** (hai tập
assert rời hẳn, xác nhận bằng `diff` hai log + đọc cơ chế gác), chân
danh-sách-tên của E2 **ĐÚNG** (52 → 58 tên, đếm-vệ-sinh không rỗng ở cả hai
đầu), tách hai chân VẮNG của E4 **ĐÚNG**. Còn lại một khoảng cách: chân thứ 12
của E4 xanh mà không cô lập được lớp nó gọi tên — phiên chấm tự đâm thử và
xác nhận **vật đúng cả hai chiều**, chỉ thước không phân biệt. Ghi thành
known-limit (e) để người cân tại cổng; **không đề nghị vòng 4**.

## Gate 2 checklist (human)

- [ ] Đọc bảng + soi 1-2 khối bằng chứng
- [ ] T3: tự chốt CẢ HAI mục judgment (E6, E7) và điền `human_override:
      <tên> <ngày>` vào từng khối — verdict hội đồng chỉ là khuyến nghị
- [ ] Cân năm known-limits (a)–(e) — riêng (e) là thước-không-cô-lập trên một
      chân đã xanh, vật đã được đâm thử riêng và đúng cả hai chiều
- [ ] Nâng verdict `PENDING-JUDGMENT` → `PASS` (lượt ghi này là lúc hook
      kiểm lại bằng chứng + các override)
- [ ] Điền `human_signoff` ở frontmatter
