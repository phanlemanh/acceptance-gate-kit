---
schema_version: 2
feature_slug: gate-card-ac-visibility
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 246e7e1f7f2dfc640677ab5d33468d93ed4467f6
human_signoff:
---

# Evidence Report: gate-card-ac-visibility

Vòng verify 2. Vòng 1 bác E4 (P61 xanh mà không đo được AC-4). Vòng này P61 được
viết lại và tôi **tự dựng đột biến độc lập, theo cả hai chiều**, kể cả chiều mà
đối chứng dương của chính P61 KHÔNG chạm tới — case bắt được cả hai.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script (test.plugins / P58) | PASS |
| E2 | AC-2 | script (test.plugins / P59) | PASS (phạm vi CI hẹp hơn criterion — xem Analyst) |
| E3 | AC-3 | script (test.plugins / P60) | PASS (một vế của `expected` KHÔNG được đo — xem Analyst) |
| E4 | AC-4 | script (test.plugins / P61) | PASS (đột biến hai chiều do tôi tự dựng đều bắt được) |
| E5 | AC-5 | script (test.plugins / P62) | PASS |
| E6 | AC-5 | script (test.scripts / GCV1a–f) | PASS |
| E13 | AC-11 | script (test.plugins / P64) | PASS |
| E7 | AC-6 | script (test.plugins / P63) | PASS (đối chứng dương đo grep, không đo nhánh in tên file — xem Analyst) |
| E8 | AC-7 | script (script.mirror_sync) | PASS |
| E9 | AC-8 | script (test.plugins / P53) | PASS |
| E10 | AC-1 | script (test.scripts / GPM21+GPM20g) | PASS |
| E11 | AC-9 | judgment | UNCERTAIN (T3 — chờ phán trực tiếp của người ở Cổng 2) |
| E12 | AC-10 | judgment | UNCERTAIN (T3 — chờ phán trực tiếp của người ở Cổng 2) |

## Evidence

- eval: E4
  run_id: gate-card-ac-visibility-E4-20260730T024109Z
  exit_code: 0
  criterion: AC-4
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T02:41:38Z
  baseline: n-a
  output: |
    P61 mot nguon su that: HAI LOI GOI THAT cua gate-card tren cung contract
      PASS: P61 hai loi goi khop tren cay that; dot bien lam lech -> bat duoc (B:yankeecrab B:xraymoose B:victorowl)
  detail: |
    P61 đã được viết lại hoàn toàn so với vòng 1. Nửa grep-đếm-regex (thứ vòng 1
    bác) KHÔNG còn. Bản mới dựng một workspace fixture `_acceptance/twopath` với 5
    criterion phủ đủ 5 khuôn, mỗi criterion mang một từ-mốc riêng (zulufox,
    yankeecrab, xraymoose, whiskeyelk, victorowl), rồi chạy CHÍNH CLI
    `node scripts/gate-card.js --gate 1` (đường card, gate-card.js:176) và
    `--gate 2` (đường `critText`, gate-card.js:265) trên cùng contract đó, soi
    stdout từng đường xem từ-mốc nào vắng. Đó là đo HÀNH VI qua hai lối gọi
    THẬT, đúng điều AC-4 và `expected` đòi.
  discriminates: |
    Tôi KHÔNG tin đối chứng dương có sẵn của case; tôi tự dựng đột biến trên cây
    thật, CẢ HAI CHIỀU, đồng bộ sang mirror để không nổ vì lý do khác:

    (A) Thu hẹp đường CARD CỔNG 1 (gate-card.js:176) — bỏ mọi dòng khuôn `- **AC-n`
        khỏi `acs`, giữ nguyên `critText`. Đây là chiều mà đối chứng dương của
        chính P61 KHÔNG chạm tới (nó chỉ đột biến đường `critText`).
        Kết quả: P61 ĐỎ, nêu đích danh mốc lệch — "hai loi goi LECH tren cay
        that — thieu: A:yankeecrab A:victorowl A:id-AC-3".

    (B) Thu hẹp đường `critText` CỔNG 2 (gate-card.js:265) — lọc bỏ cùng lớp dòng
        đó khỏi vòng lặp, giữ nguyên đường card. Đây đúng lớp đột biến mà vòng 1
        dùng để bác P61 bản cũ (bản cũ khi đó vẫn xanh).
        Kết quả: P61 ĐỎ — "hai loi goi LECH tren cay that — thieu: B:yankeecrab
        B:xraymoose B:victorowl".

    (C) Phụ chứng ngoài dự tính: hai biến thể của (B) mà tôi viết theo cú pháp
        khác làm hỏng mỏ-neo perl của chính P61. P61 KHÔNG xanh im lặng — nó đỏ
        ở nhánh tự-canh "dot bien KHONG ap duoc — doi chung duong vo hieu, khong
        the tin case nay". Tức case từ chối tuyên xanh khi đối chứng dương của nó
        không áp được. Đây là tính chất vòng 1 đòi mà bản cũ không có.

    Sau mỗi đột biến cây được khôi phục; `git diff` rỗng, HEAD vẫn
    246e7e1f7f2dfc640677ab5d33468d93ed4467f6, ba lối verify chạy lại đều xanh.
    Kết luận: E4 giờ ĐO ĐƯỢC AC-4. Finding P1 của gap-probe (P61 grep-đếm) đã
    thật sự đóng, có case đỏ kèm theo.

- eval: E1
  run_id: gate-card-ac-visibility-E1-20260730T024109Z
  exit_code: 0
  criterion: AC-1
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T02:41:38Z
  baseline: n-a
  output: |
    P58 corpus khuon dong criterion: id/gwt/judgment khop bang GHIM SAN
      PASS: P58 corpus 14 ca khop bang ghim (id+gwt+judgment)
  detail: |
    Tôi đọc thẳng corpus `tests/plugins/fixtures/ac-line-corpus.md`: 14 ca —
    10 ca criterion phủ đủ 5 khuôn AC-1 liệt (`- AC-1:` · `- **AC-2 (nhãn):**` ·
    `- **AC-3** (judgment)` · `- AC-4 (F1):` · `- **AC-5.**`) cộng biến thể nhãn
    mang chữ judgment, thân bàn-về-judgment, dấu-trong-code-span, dấu-cuối-dòng,
    tiêu-đề-in-đậm; + 4 ca KHÔNG-phải-criterion (id trần `- **AC-11**`, dòng bảng
    Coverage `- **Đ — đường đo** (CE: …): AC-6, AC-11`, văn xuôi nhắc id giữa câu,
    in-đậm tham-chiếu-chéo). Harness so cả BA trường id/gwt/judgment với bảng
    ghim, in đích danh tên ca + trường lệch, và chặn cứng nếu corpus < 10 ca.
    Đối chứng dương của AC-1 (văn xuôi nhắc id → 0 criterion) là ca chạy thật.
  discriminates: |
    Tự kiểm bằng đột biến trên cây thật: ép `AC_LINE` phải có `**` → P58 đỏ
    "6 lech so voi bang ghim". Case phân biệt thật, không phải hằng đúng.

- eval: E2
  run_id: gate-card-ac-visibility-E2-20260730T024109Z
  exit_code: 0
  criterion: AC-2
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T02:41:38Z
  baseline: n-a
  output: |
    P59 bao-tap: khuon MOI phai BAO khuon CU, 0 dong mat, 0 dong rac them
         PHAM-VI: khong co AC_EXTRA_CORPUS_ROOT — chi phu corpus + _acceptance cua repo nay; AC-2 khai rong hon the
      PASS: P59 bao-tap: 0 mat, +19 dong criterion that, 0 rac
  output_envlane: |
    run_id: gate-card-ac-visibility-E2-envlane-20260730T024147Z
    P59 bao-tap: khuon MOI phai BAO khuon CU, 0 dong mat, 0 dong rac them
      PASS: P59 bao-tap: 0 mat, +427 dong criterion that, 0 rac
  detail: |
    Ba chốt: LOST == 0 (bao-tập) · GAINED >= 5 (phép nới có chạm khuôn mới) ·
    JUNK == 0 (nửa should-NOT-fire). Corpus giờ ĐƯỢC ĐỌC thật — tiền tố `INPUT `
    được gọt (`strip`), lỗi vòng 1 phát hiện đã sửa: dòng corpus xuất hiện trong
    danh sách MẤT khi tôi đột biến, tức chúng nằm trong phép đo.
    Chạy CẢ HAI chế độ: không env (chế độ CI) phủ corpus + 6 contract của kit,
    +19 dòng; có `AC_EXTRA_CORPUS_ROOT` phủ thêm 170 contract artifact-platform,
    +427 dòng, LOST vẫn 0. Bất biến bao-tập của AC-2 đúng trên CẢ HAI repo.
  discriminates: |
    Case giờ có đối chứng dương ĐƯỢC SCRIPT HOÁ (`P59CTRL`, run-tests.sh:1242-1256):
    thay parser bằng bản hẹp cố ý rồi đòi phép đo phải lộ ra dòng chỉ bản rộng
    đọc được; CTRL xanh ⇒ case đỏ. Nhưng control đó canh nhánh GAINED, không phải
    nhánh MẤT mà `expected` mô tả, nên tôi tự đo nhánh MẤT: ép `AC_LINE` phải có
    `**` → P59 nổ đúng nhánh MẤT và IN ĐÍCH DANH từng dòng (gồm cả dòng corpus:
    "MAT fixtures: - AC-1: Given kho rỗng…", "MAT gap-probe-presence-hook: …").
    Cả hai nhánh chốt đều sống.

- eval: E3
  run_id: gate-card-ac-visibility-E3-20260730T024109Z
  exit_code: 0
  criterion: AC-3
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T02:41:38Z
  baseline: n-a
  output: |
    P60 co judgment: 0 lat tren dong chung; nhan/code-span xu dung
         PHAM-VI: khong co AC_EXTRA_CORPUS_ROOT — 2 dong repo tieu thu ma AC-3 neu dich danh KHONG nam trong pham vi quet
              lat DUNG luat code-span: gate-card-ac-visibility AC-1
              lat DUNG luat code-span: gate-card-ac-visibility AC-3
      PASS: P60 co judgment: 0 lat; dau trong code-span = trich dan (false), go backtick -> true
  output_envlane: |
    run_id: gate-card-ac-visibility-E3-envlane-20260730T024147Z
    P60 co judgment: 0 lat tren dong chung; nhan/code-span xu dung
              lat DUNG luat code-span: gate-card-ac-visibility AC-1
              lat DUNG luat code-span: gate-card-ac-visibility AC-3
      PASS: P60 co judgment: 0 lat; dau trong code-span = trich dan (false), go backtick -> true
  detail: |
    0 lật ngoài luật code-span trên mọi dòng cả hai khuôn cùng đọc được; hai lật
    DUY NHẤT đúng là AC-1/AC-3 của chính contract này (dogfood). Đối chứng dương
    code-span CÓ chạy và trên CÙNG một dòng (`quoted` vs `bare`) → QUOTED=false
    BARE=true. Ca "thân bàn về judgment mà không mang dấu → false" (corpus AC-7)
    và ca "dấu cuối dòng → true" (corpus AC-9) nằm trong bảng ghim P58, có chạy.
    Chạy cả hai chế độ; bật lane opt-in không đổi kết quả.
  discriminates: |
    Vòng 1 đã chứng minh case phân biệt (gỡ luật code-span → P60 đỏ). Vòng này tôi
    xác nhận lại gián tiếp: đột biến `AC_LINE` làm P58/P59 đỏ trong khi P60 giữ
    nguyên ngữ nghĩa của nó, tức nhánh chốt của P60 độc lập.
  coverage_gap: |
    Vế "phủ hồi quy 2 dòng repo tiêu thụ" của AC-3/E3 VẪN KHÔNG được đo, kể cả
    khi bật lane opt-in — xem Analyst mục 2. Đây là lệch phủ tôi tự tìm ra ở vòng
    này, không phải thứ đã đóng.

- eval: E5
  run_id: gate-card-ac-visibility-E5-20260730T024109Z
  exit_code: 0
  criterion: AC-5
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T02:41:38Z
  baseline: n-a
  output: |
    P62 RONG phai KEU (2 ca kich hoat) + doi chung chong cry-wolf
         A=blank:3 B=blank:2:## Acceptance criteria C=null
      PASS: P62 ca (a) khuon la + ca (b) heading lech deu KEU va neu heading; contract lanh IM
  detail: |
    Ca (a) heading đúng + 3 dòng khuôn lạ → kind=blank, suspect=3. Ca (b) heading
    lệch `## Acceptance criteria` → blank, suspect=2, CÓ nêu lại heading đã tìm —
    đúng ca đã sinh ra feature này. Ca (c) contract lành → null. Chuỗi chốt được
    ghim cứng (`A=blank:3 B=blank:2:## Acceptance criteria C=null`), không phải
    "khác rỗng". Đối chứng dương chống cry-wolf có chạy thật.

- eval: E6
  run_id: gate-card-ac-visibility-E6-20260730T024227Z
  exit_code: 0
  criterion: AC-5
  verifier: config:executors.test.scripts
  verified_at: 2026-07-30T02:43:12Z
  baseline: n-a
  output: |
    GCV1 canh bao mu criterion tren card THAT (2 ca keu + 1 ca im)
      PASS: GCV1a khuon la -> card neu KHONG doc duoc criterion nao
      PASS: GCV1b heading lech -> card neu ten heading sai
      PASS: GCV1c card mu phai bao dung KHONG duyet
      PASS: GCV1e nhanh CUT ra toi card that: card neu doc THIEU
      PASS: GCV1f card cut cung bao dung duyet
      PASS: GCV1d contract lanh khong sinh canh bao nao
  detail: |
    Đường end-to-end THẬT: dựng 4 workspace fixture rồi chạy
    `node scripts/gate-card.js --root … --slug … --gate 1`, soi stdout HTML card.
    So vòng 1: thêm GCV1e/GCV1f — nhánh CỤT (AC-11) giờ CÓ lối vào thứ hai ở tầng
    card thật, đúng thứ lệch phủ #3 vòng 1 nêu. Cảnh báo đi ra đúng bề mặt người
    duyệt nhìn, và cả hai loại card mù đều mang câu "đừng duyệt".

- eval: E13
  run_id: gate-card-ac-visibility-E13-20260730T024109Z
  exit_code: 0
  criterion: AC-11
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T02:41:38Z
  baseline: n-a
  output: |
    P64 CUT phai KEU (ca ma P62 khong phu vi n>=1) + doi chung m==n
         CUT=short:2/8 SAME=null
      PASS: P64 ca cut 2/8 KEU dung nhanh short; m==n IM (khong cry-wolf)
  detail: |
    Dựng đúng hình dạng radar-d3-crawl-cron (2 dòng khuôn chuẩn + 6 dòng khuôn lạ)
    → kind=short, parsed=2, suspect=8. Đối chứng dương m == n → null, có chạy.
    Tầng card thật của nhánh này giờ do GCV1e/GCV1f gánh (E6), nên lệch phủ
    "chỉ có tầng đơn vị" của vòng 1 đã đóng.

- eval: E7
  run_id: gate-card-ac-visibility-E7-20260730T024109Z
  exit_code: 0
  criterion: AC-6
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T02:41:38Z
  baseline: n-a
  output: |
    P63 dogfood: contract cua chinh kit deu dung heading '## Criteria'
      PASS: P63 moi contract cua kit dung '## Criteria'; doi chung duong bat duoc ban doi heading
  detail: |
    Quét mọi `_acceptance/*/contract.md` của kit. Đối chứng dương CÓ chạy: bản sao
    `sed 's/^## Criteria$/## Acceptance criteria/'` của chính contract này phải
    trượt phép kiểm.
  coverage_gap: |
    Đối chứng dương chỉ chứng minh biểu thức grep bắt được bản đổi heading; nhánh
    in đích danh đường dẫn file (`heading criterion khong chuan: $f`) không được
    ca nào cho chạy. Vế "thông điệp nêu đích danh file" của AC-6 chưa có case đỏ.

- eval: E8
  run_id: gate-card-ac-visibility-E8-20260730T024312Z
  exit_code: 0
  criterion: AC-7
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-07-30T02:43:12Z
  baseline: n-a
  output: |
    plugins/ mirror in sync.
  detail: |
    Mirror `plugins/acceptance-gate/scripts/gate-card.js` khớp nguồn. Phụ chứng
    độc lập của tôi: trong mọi đột biến E4 ở trên, nếu tôi sửa nguồn mà chưa đồng
    bộ mirror thì P29/P30/P41/P42/P47/P50 nổ đỏ ngay — lớp canh này sống, và
    `--check` đơn lẻ cũng đỏ đúng lúc đó.

- eval: E9
  run_id: gate-card-ac-visibility-E9-20260730T024109Z
  exit_code: 0
  criterion: AC-8
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T02:41:38Z
  baseline: n-a
  output: |
    P53 fixture judge E11 = ban render that (sinh lai + so byte)
      PASS: P53 fixture judge E11 == ban render that + khong jargon
  detail: |
    Tôi đọc mã case: nó SINH LẠI thật trong cùng lần chạy (`head -6` fixture +
    `bash tests/plugins/fixtures/render-out-of-contract-block.sh`, script này gọi
    chính gate-card.js) rồi `cmp -s` byte-đối-byte với
    `_acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md`, cộng
    lưới chặn jargon. Khuôn render KHÔNG trôi sau khi nới parser và sau khi thêm
    dòng cảnh báo mù.

- eval: E10
  run_id: gate-card-ac-visibility-E10-20260730T024227Z
  exit_code: 0
  criterion: AC-1
  verifier: config:executors.test.scripts
  verified_at: 2026-07-30T02:43:12Z
  baseline: n-a
  output: |
    GPM21 parity theo bang: decision card vs pre-merge, tung ca mot
      PASS: GPM21
    GPM20 bang 8 dau vao -> lib phan loai dung tung ca
      PASS: GPM20g
  detail: |
    Bảng parity decision-card vs pre-merge trên gap-probe vẫn khớp từng ca sau khi
    đổi khuôn bóc criterion — bản vá không rò sang luật khác. Toàn suite scripts:
    594 case xanh (vòng 1 là 592; +2 là GCV1e/GCV1f).

- eval: E11
  criterion: AC-9
  judged_by: (chưa chạy — T3)
  verdict: UNCERTAIN
  rationale: |
    Contract risk_tier = T3. Theo luật, MỌI judgment item phải có phán trực tiếp
    của người ở Cổng 2; verdict của judge máy chỉ là tham khảo nên tôi không tự
    chấm. Câu hỏi cần người trả lời: đọc card Cổng 1 render từ contract khuôn
    `- **AC-n (nhãn):** …`, phần nhãn trong ngoặc (giờ nằm trong `gwt`) đọc ra
    như thông tin bổ trợ hay thành rác chen ngang câu?
  human_override:

- eval: E12
  criterion: AC-10
  judged_by: (chưa chạy — T3)
  verdict: UNCERTAIN
  rationale: |
    Cùng lý do T3. Câu hỏi cần người trả lời: đọc cảnh báo "KHÔNG đọc được
    criterion nào" trên card, một người duyệt có hiểu rằng CARD ĐANG KHÔNG TIN
    ĐƯỢC và việc tiếp theo là sửa contract (không phải bấm duyệt) không?
    (Chuỗi thật trên card, lấy từ `lib/ac-line.js:blindSpotText`, có câu
    "Card này KHÔNG phản ánh hợp đồng — sửa contract rồi render lại, đừng duyệt.")
  human_override:

## Analyst

Non-discriminating evals: none xác nhận được bằng baseline diffBase (không chạy
baseline A/B ở vòng này — `baseline: n-a` cho mọi eval máy). Thay vào đó tôi kiểm
tính phân biệt bằng ĐỘT BIẾN có kiểm soát trên cây đã pin, rồi khôi phục:

| Đột biến (tôi tự dựng, không tin đối chứng có sẵn) | Case nổ đỏ | Kết luận |
|---|---|---|
| Thu hẹp đường CARD Cổng 1 (`gate-card.js:176`), mirror đồng bộ | **P61** (nêu `A:yankeecrab A:victorowl A:id-AC-3`) | **E4 phân biệt — và ở chiều đối chứng của chính nó KHÔNG chạm** |
| Thu hẹp đường `critText` Cổng 2 (`gate-card.js:265`), mirror đồng bộ | **P61** (nêu `B:yankeecrab B:xraymoose B:victorowl`) | **E4 bắt đúng lớp đột biến đã bác nó ở vòng 1** |
| Biến thể (B) làm hỏng mỏ-neo perl của P61 | P61 (nhánh "dot bien KHONG ap duoc") | Case từ chối tuyên xanh khi đối chứng dương của nó vô hiệu |
| `AC_LINE` ép phải có `**` | P58 (6 lệch), P59 (nhánh MẤT, in đích danh cả dòng corpus) | E1, E2 phân biệt cả nhánh bao-tập |

**Điều vòng 1 bác đã ĐÓNG.** P61 không còn dòng grep-đếm-regex nào; phép đo đi
qua CLI `gate-card.js` hai lần với hai `--gate` khác nhau trên cùng contract
fixture. Tôi đột biến hai chiều, case đỏ cả hai. Cây khôi phục sạch sau mỗi lần
(`git diff` rỗng, HEAD không đổi).

Lệch phủ CÒN LẠI — cả bốn tôi tự đo được, không lấy lại từ vòng 1:

1. **Chế độ CI (không env) đo HẸP hơn AC-2 khai.** AC-2 ràng "cả hai repo".
   P59/P60 chỉ nạp repo thứ hai khi có `AC_EXTRA_CORPUS_ROOT`; CI sẽ không có
   biến đó. Khác vòng 1 ở chỗ việc thu hẹp giờ **được KHAI RA** (dòng `PHAM-VI:`
   in ngay trong output) thay vì im lặng — đó là cải thiện thật, nhưng lời khai
   không làm CI phủ thêm được gì. Số đo: chế độ CI +19 dòng / chế độ opt-in +427
   dòng, LOST = 0 ở cả hai. Bất biến AC-2 ĐÚNG trên cả hai repo — chỉ là cổng CI
   không chứng minh nó.

2. **Vế "phủ hồi quy 2 dòng repo tiêu thụ" của AC-3/E3 KHÔNG được đo, kể cả khi
   bật lane opt-in.** Đây là phát hiện chính của vòng này ngoài E4. Lane opt-in
   được thêm ở vòng 2 để đóng đúng lệch phủ này, nhưng nó không đóng được:
   vòng lặp của P60 bỏ qua mọi dòng không khớp khuôn CŨ (`if(!o) continue`,
   run-tests.sh:1273), mà hai dòng AC-3 nêu đích danh lại là khuôn `- **AC-2
   (LÕI — …, judgment):**` — khuôn CŨ không đọc được. Tôi đo trực tiếp:

       OLD_MATCH=false  parseAC.judgment=true  id=AC-2   (creator-choicecard)
       OLD_MATCH=false  parseAC.judgment=true  id=AC-2   (ds-debt-artifact-table)

   Quét độc lập 177 contract của cả hai repo: TAGGED=162, CODESPAN_ONLY=4 — đúng
   4 dòng contract khai, 2 là AC-1/AC-3 của kit (đổi đúng chiều), 2 là hai dòng
   trên và chúng GIỮ judgment=true qua nhánh nhãn. **Tính chất đúng, thước không
   chạm.** Chốt `FLIP=0` của P60 sẽ xanh y hệt nếu hai dòng đó không tồn tại —
   tức đây là chốt vắng-mặt, không phải chốt có-mặt.

3. **AC-6 vế "thông điệp nêu đích danh file" chưa có case đỏ.** Đối chứng dương
   của P63 chỉ chứng minh biểu thức grep bắt được bản sao đổi heading; nhánh
   `echo "heading criterion khong chuan: $f"` không được ca nào cho chạy.

4. **Đối chứng dương script-hoá của P59 canh nhánh GAINED, không canh nhánh MẤT
   mà `expected` của E2 mô tả** ("→ case ĐỎ nêu đúng dòng bị mất"). Tôi tự đo
   nhánh MẤT và nó ĐỎ đúng như khai, in đích danh từng dòng — nên đây là nợ
   script-hoá, không phải phép đo rỗng. Khác hẳn E4 vòng 1, nơi đột biến vẫn xanh.

Ghi thêm cho người duyệt: một thứ vòng 1 nêu đã được sửa THẬT và tôi kiểm lại
được — dòng corpus mang tiền tố `INPUT ` giờ được gọt trong P59 (`strip`), nên
corpus thật sự đóng góp vào phép đo (chúng xuất hiện trong danh sách MẤT khi tôi
đột biến). Trước đó corpus đóng góp 0.

## Variance

none — không eval nào có `runs > 1`; mọi eval máy deterministic và cho kết quả
đồng nhất qua hai lần chạy trên cùng cây (lần trước đột biến và lần xác nhận cuối
sau khi khôi phục: plugins "all plugin tests passed" ở CẢ HAI chế độ env,
scripts "594 passed, 0 failed", mirror "plugins/ mirror in sync.").

## Iterations

Round 1: E4 FAIL — case P61 xanh nhưng không đo được AC-4 (nửa đầu là grep đếm
regex mà criterion cấm; nửa sau gọi cùng `parseAC` hai lần thay vì hai lối gọi
của gate-card.js; đối chứng dương đã khai thì không tồn tại). Falsify: làm hai
lối gọi thật lệch nhau ở source + mirror -> toàn bộ cổng vẫn xanh. Trả về
implementation.

Round 2: mọi eval máy PASS. P61 viết lại đo qua CLI hai `--gate`; tôi tự đột biến
CẢ HAI chiều (đường card :176 và đường critText :265) — case đỏ cả hai, nên E4
đóng. Chạy suite plugins ở cả hai chế độ env. Còn 4 lệch phủ (mục 1-4 Analyst),
trong đó mục 2 là mới: lane opt-in KHÔNG đóng được vế phủ-hồi-quy của AC-3.
E11/E12 vẫn chờ người (T3) -> PENDING-JUDGMENT.

## Gate 2 checklist (human)

- [ ] Đọc bảng + soi khối E4 (chỗ vòng 1 bác, giờ đã có case đỏ hai chiều)
- [ ] E11 và E12 vẫn UNCERTAIN — T3 đòi người phán trực tiếp; điền
      `human_override: <tên> <ngày>` cho từng cái, rồi mới nâng verdict lên PASS
- [ ] Quyết lệch phủ Analyst mục 2 (AC-3 vế phủ-hồi-quy 2 dòng repo tiêu thụ
      KHÔNG đo được kể cả khi bật lane): sửa P60 để nó quét dòng theo khuôn MỚI
      (không lọc qua khuôn CŨ) và ghim đích danh 2 dòng đó, HAY hạ lời AC-3/E3
      xuống đúng thứ thước chạm được. Tính chất đã được đo là ĐÚNG (4/177 dòng
      code-span-only, 2 dòng kia giữ judgment) — đây là nợ thước, không phải bug.
- [ ] Quyết lệch phủ mục 1: CI (không env) không phủ "cả hai repo" như AC-2 khai
      — chấp nhận lane opt-in + dòng `PHAM-VI:` khai báo, hay bắt CI phải phủ
- [ ] Quyết hai nợ nhỏ: mục 3 (AC-6 chưa có case đỏ cho vế "nêu đích danh file")
      và mục 4 (đối chứng dương P59 canh sai nhánh) — vá hay ghi known-limit
- [ ] Nhắc: phân hạng T3 và đề xuất thêm `scripts/gate-card.js` vào `t3_paths`
      (Notes của contract) vẫn đang chờ quyết
