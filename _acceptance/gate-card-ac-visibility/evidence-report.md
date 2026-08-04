---
schema_version: 2
feature_slug: gate-card-ac-visibility
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 80121e4dee9bd1a18ee300036f5a63a6bb0f6733
human_signoff: Manh Phan 2026-07-30
---

# Evidence Report: gate-card-ac-visibility

Vòng verify 3, chạy trên cây SAU khi merge `origin/main` (30 commit —
`findings-section-boundary` + `claim-scan-parser-hardening`). Vòng 1 bác E4;
vòng 2 PASS-family. Vòng này KHÔNG chép lại kết quả vòng 2: mọi executor được
chạy lại trên commit mới, cộng ba phép kiểm tích hợp mà merge sinh ra —
hồi quy `section()`, nguồn-runtime của bảng marker, và thí nghiệm làm lệch hai
lối gọi do tôi tự dựng.

**Case đổi id P58–P64 → P65–P71** (bảng ở contract §"Đổi id case"). Bảng đó có
**hai ô đảo nhau** — xem Analyst mục 5. Các khối dưới đây dùng id THẬT đọc từ
suite, không dùng bảng.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script (test.plugins / P65) | PASS |
| E2 | AC-2 | script (test.plugins / P66) | PASS (phạm vi CI hẹp hơn criterion — xem Analyst) |
| E3 | AC-3 | script (test.plugins / P67) | PASS (một vế của `expected` KHÔNG được đo — xem Analyst) |
| E4 | AC-4 | script (test.plugins / P68) | PASS (tôi tự làm lệch hai lối gọi, cả hai chiều đều bị bắt) |
| E5 | AC-5 | script (test.plugins / P69) | PASS |
| E6 | AC-5 | script (test.scripts / GCV1a–f) | PASS |
| E13 | AC-11 | script (test.plugins / P71) | PASS |
| E7 | AC-6 | script (test.plugins / P70) | PASS (đối chứng dương đo grep, không đo nhánh in tên file — xem Analyst) |
| E8 | AC-7 | script (script.mirror_sync) | PASS |
| E9 | AC-8 | script (test.plugins / P53) | PASS |
| E10 | AC-1 | script (test.scripts / GPM21+GPM20g) | PASS |
| E11 | AC-9 | judgment | UNCERTAIN (T3 — người phán trực tiếp, đã có `human_override`) |
| E12 | AC-10 | judgment | UNCERTAIN (T3 — người phán trực tiếp, đã có `human_override`) |

## Evidence

- eval: E4
  run_id: gate-card-ac-visibility-E4-20260730T032939Z
  exit_code: 0
  criterion: AC-4
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T03:30:08Z
  baseline: n-a
  output: |
    P68 mot nguon su that: HAI LOI GOI THAT cua gate-card tren cung contract
      PASS: hai loi goi khop tren cay that; dot bien lam lech -> bat duoc (B:yankeecrab B:xraymoose B:victorowl)
  detail: |
    Case dựng workspace fixture `_acceptance/twopath` với 5 criterion phủ đủ 5
    khuôn, mỗi criterion mang một từ-mốc riêng (zulufox, yankeecrab, xraymoose,
    whiskeyelk, victorowl), rồi chạy CHÍNH CLI `node scripts/gate-card.js
    --gate 1` (đường card, `gate-card.js:172`) và `--gate 2` (đường `critText`,
    `gate-card.js:261`) trên cùng contract đó, soi stdout từng đường xem từ-mốc
    nào vắng. Không còn dòng grep-đếm-regex nào — đó là thứ vòng 1 bác.
  discriminates: |
    Yêu cầu riêng của vòng 3: TỰ TAY làm lệch hai lối gọi THẬT rồi xem case có
    ĐỎ không. Tôi làm trên cây đã pin, đồng bộ cả mirror, CẢ HAI CHIỀU, và cố ý
    viết đột biến bằng CÚ PHÁP KHÁC với mỏ-neo perl của chính case (nếu case chỉ
    bắt được đúng cú pháp nó tự viết thì nó không đo hành vi):

    (A) Thu hẹp đường CARD Cổng 1 (`gate-card.js:172`) — thêm `continue` bỏ mọi
        dòng `- **`, giữ nguyên `critText`. Đây là chiều mà đối chứng dương của
        chính case KHÔNG chạm tới.
        Kết quả: suite ĐỎ ở P68, thông điệp nêu đích danh mốc lệch —
        "hai loi goi LECH tren cay that — thieu: A:yankeecrab A:victorowl A:id-AC-3".

    (B) Thu hẹp đường `critText` Cổng 2 (`gate-card.js:261`) — dùng
        `.filter(function (x) { return !String(x).trimStart().startsWith('- **'); })`
        trước vòng lặp, tức KHÔNG trùng khuôn `MUTDROP(l) ? null : parseAC(l)`
        mà case tự tiêm. Giữ nguyên đường card.
        Kết quả: suite ĐỎ ở P68 — "hai loi goi LECH tren cay that — thieu:
        B:yankeecrab B:xraymoose B:victorowl".

    Cả hai lần đột biến của tôi đều KHÔNG rơi vào nhánh tự-canh "dot bien KHONG
    ap duoc", tức case báo lệch THẬT chứ không báo hỏng-đối-chứng.

    Khôi phục sau mỗi lần: `git status --porcelain` rỗng, `git diff` rỗng, HEAD
    vẫn 23b8dc67e9386bd137690cd8eabc4129fee42e72; chạy lại plugins suite + mirror
    `--check` đều xanh.

- eval: E1
  run_id: gate-card-ac-visibility-E1-20260730T032939Z
  exit_code: 0
  criterion: AC-1
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T03:30:08Z
  baseline: n-a
  output: |
    P65 corpus khuon dong criterion: id/gwt/judgment khop bang GHIM SAN
      PASS: P65 corpus 14 ca khop bang ghim (id+gwt+judgment)
  detail: |
    Tôi đọc thẳng `tests/plugins/fixtures/ac-line-corpus.md`: 14 ca — 10 ca
    criterion phủ đủ 5 khuôn AC-1 liệt (`- AC-1:` · `- **AC-2 (nhãn):**` ·
    `- **AC-3** (judgment)` · `- AC-4 (F1):` · `- **AC-5.**`) cộng biến thể
    nhãn-mang-chữ-judgment, thân-bàn-về-judgment, dấu-trong-code-span,
    dấu-cuối-dòng, tiêu-đề-in-đậm; + **4 ca KHÔNG-phải-criterion** (id trần
    `- **AC-11**`, dòng bảng Coverage, văn xuôi nhắc id giữa câu, in-đậm
    tham-chiếu-chéo) mà bảng ghim đòi ra `-` tức 0 criterion. Harness
    (`run-tests.sh:1204-1230`) so cả BA trường với bảng ghim, in đích danh tên
    ca + trường lệch, và chặn cứng nếu corpus < 10 ca. Đối chứng dương của AC-1
    (văn xuôi nhắc id → 0 criterion) là ca CHẠY THẬT, không phải lời khai.

- eval: E2
  run_id: gate-card-ac-visibility-E2-20260730T032939Z
  exit_code: 0
  criterion: AC-2
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T03:30:08Z
  baseline: n-a
  output: |
    P66 bao-tap: khuon MOI phai BAO khuon CU, 0 dong mat, 0 dong rac them
         PHAM-VI: khong co AC_EXTRA_CORPUS_ROOT — chi phu corpus + _acceptance cua repo nay; AC-2 khai rong hon the
      PASS: P66 bao-tap: 0 mat, +27 dong criterion that, 0 rac
  output_envlane: |
    run_id: gate-card-ac-visibility-E2-envlane-20260730T033015Z
    P66 bao-tap: khuon MOI phai BAO khuon CU, 0 dong mat, 0 dong rac them
      PASS: P66 bao-tap: 0 mat, +435 dong criterion that, 0 rac
  detail: |
    Ba chốt: LOST == 0 (bao-tập) · GAINED >= 5 (phép nới có chạm khuôn mới) ·
    JUNK == 0 (nửa should-NOT-fire). Chạy CẢ HAI chế độ theo yêu cầu vòng 3:
    không env (chế độ CI) phủ corpus + 9 contract của kit → +27 dòng; có
    `AC_EXTRA_CORPUS_ROOT` phủ thêm 170 contract artifact-platform → +435 dòng.
    LOST = 0 ở cả hai. Số GAINED cao hơn vòng 2 (+19/+427) vì merge mang thêm
    hai contract của main vào phạm vi — đúng chiều, không phải trôi thước.

- eval: E3
  run_id: gate-card-ac-visibility-E3-20260730T032939Z
  exit_code: 0
  criterion: AC-3
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T03:30:08Z
  baseline: n-a
  output: |
    P67 co judgment: 0 lat tren dong chung; nhan/code-span xu dung
         PHAM-VI: khong co AC_EXTRA_CORPUS_ROOT — 2 dong repo tieu thu ma AC-3 neu dich danh KHONG nam trong pham vi quet
              lat DUNG luat code-span: gate-card-ac-visibility AC-1
              lat DUNG luat code-span: gate-card-ac-visibility AC-3
      PASS: P67 co judgment: 0 lat; dau trong code-span = trich dan (false), go backtick -> true
  output_envlane: |
    run_id: gate-card-ac-visibility-E3-envlane-20260730T033015Z
    P67 co judgment: 0 lat tren dong chung; nhan/code-span xu dung
              lat DUNG luat code-span: gate-card-ac-visibility AC-1
              lat DUNG luat code-span: gate-card-ac-visibility AC-3
      PASS: P67 co judgment: 0 lat; dau trong code-span = trich dan (false), go backtick -> true
  detail: |
    0 lật ngoài luật code-span trên mọi dòng cả hai khuôn cùng đọc được; hai lật
    DUY NHẤT đúng là AC-1/AC-3 của chính contract này (dogfood). Đối chứng dương
    code-span CÓ chạy và trên CÙNG một dòng (`quoted` vs `bare`) → QUOTED=false
    BARE=true — chốt được in ra và grep cứng (`run-tests.sh:1313`), không phải
    "khác rỗng". Chạy cả hai chế độ; bật lane opt-in không đổi kết quả.
  coverage_gap: |
    Vế "phủ hồi quy 2 dòng repo tiêu thụ" VẪN KHÔNG được đo, kể cả khi bật lane
    opt-in — `run-tests.sh:1297` còn `if(!o) continue`. Đây là Known limit #2 của
    contract, người duyệt đã chốt ghi nhận ở Cổng 2. Tôi xác nhận lại nó còn
    nguyên trên cây mới, không phải thứ merge vô tình đóng.

- eval: E5
  run_id: gate-card-ac-visibility-E5-20260730T032939Z
  exit_code: 0
  criterion: AC-5
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T03:30:08Z
  baseline: n-a
  output: |
    P69 RONG phai KEU (2 ca kich hoat) + doi chung chong cry-wolf
         A=blank:3 B=blank:2:## Acceptance criteria C=null
      PASS: P69 ca (a) khuon la + ca (b) heading lech deu KEU va neu heading; contract lanh IM
  detail: |
    Ca (a) heading đúng + 3 dòng khuôn lạ → kind=blank, suspect=3. Ca (b) heading
    lệch `## Acceptance criteria` → blank, suspect=2, CÓ nêu lại heading đã tìm.
    Ca (c) contract lành → null. Chuỗi chốt ghim cứng
    (`A=blank:3 B=blank:2:## Acceptance criteria C=null`), là giá trị ĐO ĐƯỢC in
    ra chứ không phải cờ boolean, nên đối chứng chống cry-wolf có chạy thật.

- eval: E6
  run_id: gate-card-ac-visibility-E6-20260730T033049Z
  exit_code: 0
  criterion: AC-5
  verifier: config:executors.test.scripts
  verified_at: 2026-07-30T03:31:37Z
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
    Cả 6 ca (a–f) hiện diện và xanh trên cây sau merge. Cảnh báo đi ra đúng bề
    mặt người duyệt nhìn; cả hai loại card mù (RỖNG và CỤT) đều mang câu
    "đừng duyệt".

- eval: E13
  run_id: gate-card-ac-visibility-E13-20260730T032939Z
  exit_code: 0
  criterion: AC-11
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T03:30:08Z
  baseline: n-a
  output: |
    P71 CUT phai KEU (ca ma P69 khong phu vi n>=1) + doi chung m==n
         CUT=short:2/8 SAME=null
      PASS: P71 ca cut 2/8 KEU dung nhanh short; m==n IM (khong cry-wolf)
  detail: |
    Dựng đúng hình dạng `radar-d3-crawl-cron` (2 dòng khuôn chuẩn + 6 dòng khuôn
    lạ) → kind=short, parsed=2, suspect=8. Đối chứng dương m == n → null, giá trị
    được in ra nên có chạy. Tầng card thật của nhánh này do GCV1e/GCV1f gánh (E6).

- eval: E7
  run_id: gate-card-ac-visibility-E7-20260730T032939Z
  exit_code: 0
  criterion: AC-6
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T03:30:08Z
  baseline: n-a
  output: |
    P70 dogfood: contract cua chinh kit deu dung heading '## Criteria'
      PASS: P70 moi contract cua kit dung '## Criteria'; doi chung duong bat duoc ban doi heading
  detail: |
    Quét mọi `_acceptance/*/contract.md` của kit — giờ là **9 contract** (merge
    mang thêm `claim-scan-parser-hardening` và `findings-section-boundary`). Tôi
    kiểm độc lập ngoài case: liệt heading criterion của cả 9 file, tất cả là
    `## Criteria`; và chạy `acBlindSpot` trên cả 9 → **0 contract nào bị mù**
    (parsed lần lượt 8/12/12/20/11/12/14/15/17). Đối chứng dương CÓ chạy: bản sao
    `sed 's/^## Criteria$/## Acceptance criteria/'` phải trượt phép kiểm.
  coverage_gap: |
    Đối chứng dương vẫn chỉ chứng minh biểu thức grep bắt được bản đổi heading;
    nhánh in đích danh đường dẫn (`run-tests.sh:1466`) không được ca nào cho
    chạy. Known limit #3, còn nguyên.

- eval: E8
  run_id: gate-card-ac-visibility-E8-20260730T033143Z
  exit_code: 0
  criterion: AC-7
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-07-30T03:31:43Z
  baseline: n-a
  output: |
    plugins/ mirror in sync.
  detail: |
    Mirror khớp nguồn cho cả `scripts/gate-card.js`, `lib/ac-line.js` và
    `lib/md-section.js` (merge đụng cả ba). Phụ chứng độc lập: trong hai đột
    biến E4 tôi phải vá SONG SONG source + mirror; nếu bỏ mirror thì lớp canh
    này đỏ ngay — nó sống.

- eval: E9
  run_id: gate-card-ac-visibility-E9-20260730T032939Z
  exit_code: 0
  criterion: AC-8
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T03:30:08Z
  baseline: n-a
  output: |
    P53 fixture judge E11 = ban render that (sinh lai + so byte)
      PASS: P53 fixture judge E11 == ban render that + khong jargon
  detail: |
    Case SINH LẠI fixture thật trong cùng lần chạy (`head -6` + `bash
    tests/plugins/fixtures/render-out-of-contract-block.sh`, script này gọi chính
    `gate-card.js`) rồi `cmp -s` byte-đối-byte với
    `_acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md`. Khuôn
    render KHÔNG trôi qua merge — quan trọng vì merge sửa cả `gate-card.js`.

- eval: E10
  run_id: gate-card-ac-visibility-E10-20260730T033049Z
  exit_code: 0
  criterion: AC-1
  verifier: config:executors.test.scripts
  verified_at: 2026-07-30T03:31:37Z
  baseline: n-a
  output: |
    GPM21 parity theo bang: decision card vs pre-merge, tung ca mot
      PASS: GPM21
    GPM20 bang 8 dau vao -> lib phan loai dung tung ca
      PASS: GPM20g
  detail: |
    Bảng parity decision-card vs pre-merge trên gap-probe vẫn khớp từng ca sau
    merge — bản vá không rò sang luật khác. Toàn suite scripts: 596 case xanh
    (vòng 2 là 594; +2 là case của main).

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
  human_override: Manh Phan 2026-07-30

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
  human_override: Manh Phan 2026-07-30

## Analyst

Non-discriminating evals: none xác nhận được bằng baseline diffBase (không chạy
baseline A/B — `baseline: n-a` cho mọi eval máy). Thay vào đó tính phân biệt
được kiểm bằng ĐỘT BIẾN có kiểm soát trên cây đã pin, rồi khôi phục:

| Đột biến (tôi tự dựng, cú pháp KHÁC đối chứng có sẵn) | Case nổ đỏ | Kết luận |
|---|---|---|
| Thu hẹp đường CARD Cổng 1 (`gate-card.js:172`), mirror đồng bộ | **P68** (nêu `A:yankeecrab A:victorowl A:id-AC-3`) | **E4 phân biệt ở chiều đối chứng của chính nó KHÔNG chạm** |
| Thu hẹp đường `critText` Cổng 2 (`gate-card.js:261`) bằng `.filter(...)` | **P68** (nêu `B:yankeecrab B:xraymoose B:victorowl`) | **E4 bắt lệch THẬT, không chỉ bắt đúng cú pháp nó tự viết** |
| `lv >= 2` → `lv >= 3` trong bản `section()` đối chứng | harness hồi quy của tôi (1626 lệch) | phép so hồi quy có sức phân biệt |
| Lật một dòng bảng marker `Findings -> same-or-higher` | 32 file đổi output | bảng marker LÀ nguồn runtime |

### 1. Hồi quy `section()` sau refactor — 0 lệch trên 1.187.466 phép so

`lib/ac-line.js` bỏ hàm tự duyệt riêng (`criteriaSectionLines`) và giờ `require`
`sectionLines()` từ `lib/md-section.js`; `section()` cũ được viết lại thành lớp
mỏng trên `sectionLines()`. Tôi so hành vi TRƯỚC/SAU trên dữ liệu thật:

- Bản TRƯỚC: `git show origin/main:lib/md-section.js`.
- Corpus: **686 file `.md`** thật — toàn bộ `_acceptance/` của kit, `tests/` của
  kit, và `_acceptance/` của artifact-platform.
- Heading: **1.731 heading khác nhau** — mọi h2..h6 xuất hiện trong corpus, hợp
  với danh sách bắt buộc `Criteria` / `Findings` / `Coverage` / `Out of scope` /
  `Analyst` / `Variance` (+ Evidence / Iterations / Notes / Acceptance criteria).
- **1.187.466 phép so → TOTAL_DIFFS = 0.**
- Phủ thật của các section bắt buộc (số file có section KHÔNG rỗng):
  `Criteria 157 · Findings 83 · Coverage 16 · Out of scope 143 · Analyst 80 ·
  Variance 80 · Evidence 134 · Iterations 109 · Notes 74`.
- Thêm hai bất biến nội bộ được kiểm cùng lúc, cũng 0 lệch:
  `sectionLines(t,h).map(x=>x.l)` ≡ `section(t,h)`, và mọi `no` trả về TRỎ ĐÚNG
  dòng thật của file (`lines[no-1] === l`).
- 31.556 cặp trong đó CẢ HAI bản cùng ném lỗi giống hệt nhau (heading thật có ký
  tự regex như `[MEDIUM]`) — hành vi CÓ TỪ TRƯỚC, giống nhau hai bên, không phải
  hồi quy do merge. Ghi lại vì nó là một cạnh sắc có thật của `section()`.

Harness phải chứng minh nó bắt được lệch trước khi tin số 0: đổi `lv >= 2` thành
`lv >= 3` ở bản đối chứng → 1.626 lệch; lật một dòng bảng marker → 32 lệch.

**Hồi quy tầng trên cũng 0 lệch:** so `acBlindSpot` bản TRƯỚC (tự duyệt, commit
`6d6dbf6`) với bản SAU (`sectionLines`) trên cùng 686 file → **0 lệch**. Tức
phạm vi quét của bộ dò mù (AC-5/AC-11) không đổi nghĩa qua merge.

### 2. Bảng marker vẫn là nguồn runtime — chứng bằng HÀNH VI

`SECTION_BOUNDARY` parse từ chính văn bản file (`parseBoundaryTable(fs.readFileSync(__filename))`),
không có hằng số chép tay nào chứa `any-heading`. Nhưng "đọc được file" chưa đủ —
tôi đo hành vi: sửa MỘT dòng bảng (`Findings -> any-heading` thành
`same-or-higher`) trên bản sao → `SECTION_BOUNDARY` đổi, và **32 file thật đổi
output `section(…, 'Findings')`** (vd `core-dispatch-k9/review-findings.md`
1 → 42 dòng). Sửa bảng CÓ đổi hành vi ⇒ bảng không phải comment trang trí.

### 3. Ca thật từ main mà feature này bắt được (dogfood)

Merge đổi heading của `_acceptance/claim-scan-parser-hardening/contract.md` từ
`## Acceptance criteria` sang `## Criteria`. Tôi render lại card Cổng 1 của slug
đó trên cây hiện tại: card ra **8 criterion** ở hai khối "Hệ thống SẼ làm" /
"Sẽ KHÔNG làm", **0 cảnh báo mù**. Trước khi vá, contract này đã `signed-off` mà
card hiện 0 criterion. Đây là feature tự chứng minh trên một ca nó không được
xây để nhắm vào — và là lý do vá heading nằm trong phạm vi merge chứ không phải
nới scope.

### 4. Lệch phủ CÒN LẠI (4 mục — trùng Known limits contract, tôi xác nhận lại còn nguyên trên cây mới)

1. **Chế độ CI đo ít hơn AC-2/AC-3 khai.** `AC_EXTRA_CORPUS_ROOT` là opt-in; CI
   không có repo tiêu thụ. Đo vòng này: CI +27 dòng / opt-in +435 dòng, LOST = 0
   cả hai chiều. Dòng `PHAM-VI:` in ra khi thiếu env nên phạm vi hẹp được KHAI —
   nhưng khai không phải là phủ.
2. **Vế "2 dòng repo tiêu thụ" của AC-3 không được đo, kể cả khi bật env.**
   `run-tests.sh:1297` còn `if(!o) continue`, mà hai dòng đó thuộc khuôn CŨ không
   đọc được. Chốt `FLIP=0` sẽ xanh y hệt nếu hai dòng biến mất — chốt vắng-mặt.
3. **AC-6 vế "thông điệp nêu đích danh file" chưa có case đỏ** (`run-tests.sh:1466`).
4. **Đối chứng dương script-hoá của P66 canh nhánh GAINED, không canh nhánh LOST**
   như `expected` mô tả.

Cả bốn đã được người duyệt chốt ghi nhận ở Cổng 2 (contract §Known limits). Vòng
này KHÔNG phát sinh lệch phủ mới nào ở tầng criterion.

### 5. PHÁT HIỆN MỚI vòng 3 — bảng "Đổi id case" của contract đảo hai ô

Contract §"Đổi id case" ghi `P63 → P71` và `P64 → P70`. Suite THẬT thì ngược lại.
Chứng bằng biến nội bộ (biến giữ nguyên tên cũ nên nó là dấu vân tay của ca):

    P70 dogfood: contract cua chinh kit ...   <= dung bien P63BAD / P63TMP
    P71 CUT phai KEU ...                      <= dung bien P64OUT

Tức **P63 (dogfood/AC-6) → P70** và **P64 (CỤT/AC-11) → P71**. Bảng trong contract
đảo đúng hai ô này. Hệ quả: ai đọc evidence-report vòng 1/2 (giữ id cũ, đúng chủ
ý) rồi tra bảng sẽ tra nhầm ca cho AC-6 và AC-11. Đây là lỗi TÀI LIỆU trên một
contract đã `signed-off`, không phải eval hỏng — không eval nào khẳng định bảng
này, nên nó không làm đỏ cổng. Tôi KHÔNG tự sửa contract đã ký; nêu để người
quyết. Bảng đúng phải là:

    truoc | P58 | P59 | P60 | P61 | P62 | P63 | P64
    sau   | P65 | P66 | P67 | P68 | P69 | P70 | P71

### 6. Nợ nhỏ kèm theo: nhãn id cũ còn sót trong suite và fixture

- Dòng PASS của P68 vẫn in "P61 hai loi goi khop tren cay that" (header đã là
  P68). Một ca mà tiêu đề và thông điệp mang hai id khác nhau là mồi cho đúng lớp
  lẫn lộn ở mục 5.
- Tiêu đề `tests/plugins/fixtures/ac-line-corpus.md` còn ghi "nguồn sự thật cho
  P58/P59/P60/P61".
- Biến nội bộ `P58*`–`P64*` giữ tên cũ (chấp nhận được, nhưng cộng với hai mục
  trên thì dấu vết id cũ đang nằm ở ba lớp).

Đây là nợ nhãn, không chạm tính chất nào — mọi ca đo đúng thứ nó khai.

### 7. Ghi chú ngoài phạm vi eval

`node scripts/eval-coverage-lint.js .` (executor `script.coverage_lint`) in 8
cảnh báo ADVISORY và trả mã khác 0. **Không eval nào của slug này trỏ tới
executor đó**, và cả 8 cảnh báo đều thuộc slug KHÁC
(`claim-scan-parser-hardening`, `findings-section-boundary`, `s4-scope-triage`) —
0 cảnh báo cho `gate-card-ac-visibility`. Nêu ra để người duyệt không bất ngờ,
không tính vào verdict. Hai suite lân cận cũng chạy sạch: hooks 51 xanh,
workflows toàn bộ xanh.

## Variance

none — không eval nào có `runs > 1`; mọi eval máy deterministic và cho kết quả
đồng nhất qua các lần chạy trên cùng cây (lần đo chính, hai lần trong thí nghiệm
đột biến, và lần xác nhận cuối sau khi khôi phục: plugins "all plugin tests
passed" ở CẢ HAI chế độ env, scripts "596 passed, 0 failed", mirror
"plugins/ mirror in sync.").

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

Round 3 (sau merge `origin/main`): mọi eval máy PASS lại trên commit
`23b8dc67`, case đổi id P58-P64 -> P65-P71. Ba phép kiểm tích hợp: (a) hồi quy
`section()` trước/sau refactor — 1.187.466 phép so trên 686 file thật, 1.731
heading, **0 lệch**, harness tự falsify được (1.626 lệch khi đột biến); hồi quy
`acBlindSpot` cũng 0 lệch; (b) bảng marker CÒN là nguồn runtime — lật một dòng
bảng đổi output của 32 file; (c) tôi tự làm lệch hai lối gọi thật theo CẢ HAI
chiều bằng cú pháp khác đối chứng có sẵn — P68 đỏ cả hai lần, cây khôi phục sạch
(`git diff` rỗng, HEAD không đổi). Bốn lệch phủ cũ còn nguyên (đã là Known
limits). MỚI: bảng "Đổi id case" của contract đảo hai ô P63/P64 (Analyst mục 5) —
lỗi tài liệu, không eval nào đỏ vì nó.

## Gate 2 checklist (human)

- [ ] Đọc bảng + soi khối E4 (chỗ vòng 1 bác; vòng 3 đột biến lại hai chiều trên
      cây đã merge, cú pháp độc lập với đối chứng của case)
- [ ] **Sửa bảng "Đổi id case" trong contract**: hai ô đảo — đúng là `P63 → P70`
      (dogfood/AC-6) và `P64 → P71` (CỤT/AC-11). Contract đã `signed-off` nên tôi
      không tự sửa; đây là lỗi tra cứu, không phải thay đổi phạm vi
- [ ] Quyết nợ nhãn (Analyst mục 6): dòng PASS của P68 còn in "P61"; header
      corpus fixture còn ghi P58-P61 — vá hay ghi known-limit
- [ ] Bốn Known limits (Analyst mục 4) đã được chốt ghi nhận ở Cổng 2 vòng 2 —
      xác nhận chúng CÒN NGUYÊN trên cây mới, không mục nào âm thầm mở rộng
- [ ] `human_signoff` + `human_override` E11/E12 đã có từ Cổng 2 vòng 2; nếu chữ
      ký cần đặt lại trên mã mới (merge 30 commit) thì đó là quyết định của người
- [ ] Nhắc: phân hạng T3 và đề xuất thêm `scripts/gate-card.js` vào `t3_paths`
      (Notes của contract) vẫn đang chờ quyết

### Re-pin — 2026-07-30 (sau merge hai nhánh), tại 8ee3f4c

`verified_commit` lên `8ee3f4c` — merge commit tích hợp design-pass-skill
(1.26.0, case đánh lại số P72–P81) với gate-card-ac-visibility (PR 18) trên
origin/main. Machine lane ở `8ee3f4c` do 3 agent tươi chạy độc lập, sha nhất
quán cả 3, tất cả exit 0 (596 scripts · 51 hooks · plugins pass gồm case của
CẢ HAI feature · workflows pass · mirror in sync). Judgment + chữ ký giữ
nguyên như các lần re-pin trước.


### Re-pin — 2026-07-30 (sau pha3-goi-luoi), tại f929ceb

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 3 của feature
  `pha3-goi-luoi`, Workflow `wf_cfa3bb5d-5df`, doer≠grader): 5 suite tại
  `f929ceb553b3ea4d0d4204907ed8c1c291241a9e` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P88, gồm case của slug này) · workflows pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `f929ceb553b3ea4d0d4204907ed8c1c291241a9e` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.


### Re-pin — 2026-08-01 (sau ngon-ngu-mat-nguoi), tại b7f658d

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 4 của feature
  `ngon-ngu-mat-nguoi`, Workflow `wf_65b38963-25c`, doer≠grader): 5 suite tại
  `b7f658d42b6a8a72d6ef0a1310bac28127364423` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P96, gồm case của slug này) · workflows 10 pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `b7f658d42b6a8a72d6ef0a1310bac28127364423` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.


### Re-pin — 2026-08-02 (sau hinh-theo-mat-phang), tại 2b6823d

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 6 của feature
  `hinh-theo-mat-phang`, Workflow `wf_69f3bf7a-1a6`, doer≠grader): 5 suite tại
  `2b6823d400df3360975c9029b120ac5871e36bbf` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P97, gồm case của slug này) · workflows pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `2b6823d400df3360975c9029b120ac5871e36bbf` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.

### Re-pin — 2026-08-03 (sau start-command), tại b2d2eac

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 2 của feature
  `start-command`, Workflow `wf_73dc61df-6d8`, doer≠grader): 5 suite tại
  `b2d2eac2cabe2fe3bccff9d2e0a65ac3edca32e3` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P101, gồm case của slug này) · workflows pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `b2d2eac2cabe2fe3bccff9d2e0a65ac3edca32e3` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.

### Re-pin — 2026-08-03 (sau start-scan-hardening), tại 6f3449c

- **Machine lane chạy lại bởi agent TƯƠI** (S4 round 5 của feature
  `start-scan-hardening`, Workflow `wf_4cdd5992-610`, doer≠grader): 5 suite tại
  `6f3449c5b92c5ba1a7f5a7716fd83ade7fdeb8e7` — scripts 596 pass · hooks 51 pass ·
  plugins pass (P01–P105, gồm case của slug này) · workflows pass ·
  `sync-plugin-packages.sh --check` mirror in sync — tất cả exit 0.
- `verified_commit` re-pin → `6f3449c5b92c5ba1a7f5a7716fd83ade7fdeb8e7` (chỉ dòng máy).
- **KHÔNG chạy lại:** eval `judgment`, vòng review/refute. Chữ ký +
  `human_override` giữ nguyên.
