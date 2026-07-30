---
schema_version: 2
feature_slug: gate-card-ac-visibility
verdict: REJECT
failed_evals: [E4]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: af4a1064fe6ee2caba46f8ff0a7c487c8c68a481
human_signoff:
---

# Evidence Report: gate-card-ac-visibility

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E4 | AC-4 | script (test.plugins / P61) | FAIL — case xanh nhưng KHÔNG đo được AC-4 (falsify bên dưới) |
| E1 | AC-1 | script (test.plugins / P58) | PASS |
| E2 | AC-2 | script (test.plugins / P59) | PASS (lệch phủ — xem Analyst) |
| E3 | AC-3 | script (test.plugins / P60) | PASS (lệch phủ — xem Analyst) |
| E5 | AC-5 | script (test.plugins / P62) | PASS |
| E6 | AC-5 | script (test.scripts / GCV1a–d) | PASS |
| E13 | AC-11 | script (test.plugins / P64) | PASS (chỉ đơn vị — xem Analyst) |
| E7 | AC-6 | script (test.plugins / P63) | PASS |
| E8 | AC-7 | script (script.mirror_sync) | PASS |
| E9 | AC-8 | script (test.plugins / P53) | PASS |
| E10 | AC-1 | script (test.scripts / GPM21+GPM20g) | PASS |
| E11 | AC-9 | judgment | UNCERTAIN (T3 — chờ phán trực tiếp của người ở Cổng 2) |
| E12 | AC-10 | judgment | UNCERTAIN (T3 — chờ phán trực tiếp của người ở Cổng 2) |

## Evidence

- eval: E4
  run_id: gate-card-ac-visibility-E4-20260730T020612Z
  criterion: AC-4
  verifier: config:executors.test.plugins  (bash tests/plugins/run-tests.sh)
  verified_at: 2026-07-30T02:05:42Z
  verdict: FAIL
  case_line: |
    P61 mot nguon su that: hai loi goi cua gate-card bocA cung corpus -> cung ket qua
      PASS: P61 2 loi goi deu qua parseAC, 0 khuon literal rieng, 0 lech tren corpus
  why_fail: |
    Case in PASS, nhưng phép đo KHÔNG chạm AC-4. Hai lý do, cả hai đối chiếu
    trực tiếp với chữ trong `expected` của chính E4:

    (1) `expected` viết "Đo bằng HÀNH VI... KHÔNG dùng grep đếm regex:
        assertion vắng-mặt-một-mình là lớp CLAUDE.md #4 cấm". Nhưng nửa đầu của
        P61 (tests/plugins/run-tests.sh:1262-1271) ĐỌC MÃ NGUỒN gate-card.js
        như văn bản và đếm: số lần xuất hiện chuỗi `parseAC(` phải >= 2, và số
        khuôn `AC-\d` literal còn sót phải == 0. Đó đúng là grep-đếm-regex +
        assertion vắng-mặt-một-mình mà criterion cấm.

    (2) `expected` đòi "Đối chứng dương: bản sao cho một lối gọi dùng khuôn hẹp
        hơn -> ĐỎ nêu đích danh dòng lệch". Đối chứng đó KHÔNG tồn tại trong
        mã. Nửa "hành vi" của P61 (dòng 1272-1281) không hề gọi vào hai lối
        của gate-card.js — nó gọi CÙNG hàm `parseAC` hai lần trên cùng danh
        sách dòng, rồi so hai map với nhau. Comment trong test tự khai
        "gia lap hai loi goi". Phép so đó là hằng đúng theo cấu trúc: A và B
        chỉ khác nhau khi corpus có id trùng.
  falsification: |
    Tôi tự dựng đối chứng dương mà eval thiếu, và nó chứng minh eval mù:
    làm hai lối gọi THẬT trong scripts/gate-card.js lệch nhau — lối card Cổng 1
    (dòng 176) giữ nguyên, lối `critText` Cổng 2 (dòng 265) thêm bộ lọc bỏ mọi
    dòng khuôn `- **AC-n**` — rồi đồng bộ y hệt sang mirror
    plugins/acceptance-gate/scripts/gate-card.js để P30/P41/P47 không nổ vì lý do khác.
    Kết quả trên cây đã đột biến:
      P61  -> vẫn PASS
      tests/plugins/run-tests.sh -> "Results: all plugin tests passed"
      tests/scripts/run-tests.sh -> "Results: 592 passed, 0 failed"
    Tức: hai lối gọi trôi khỏi nhau đúng theo lớp lỗi AC-4 sinh ra để chặn,
    mà TOÀN BỘ cổng vẫn xanh. Cây đã khôi phục nguyên trạng (`git diff` rỗng,
    HEAD vẫn af4a1064fe6ee2caba46f8ff0a7c487c8c68a481) và ba suite chạy lại đều xanh.
  note: |
    Về SỰ THẬT của mã: cả hai lối gọi hiện ĐANG dùng chung `parseAC`
    (gate-card.js:176 và :265, cùng require từ lib/ac-line.js:99) — nên AC-4
    nhiều khả năng đang ĐÚNG trên cây này. Cái hỏng là THƯỚC, không nhất thiết
    là mã. Nhưng thước không đo được thì evidence không đỡ được criterion.

- eval: E1
  run_id: gate-card-ac-visibility-E1-20260730T020612Z
  criterion: AC-1
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T02:05:42Z
  baseline: n-a
  output: |
    P58 corpus khuon dong criterion: id/gwt/judgment khop bang GHIM SAN
      PASS: P58 corpus 14 ca khop bang ghim (id+gwt+judgment)
  detail: |
    Corpus tests/plugins/fixtures/ac-line-corpus.md có 14 ca: 10 ca criterion phủ
    đủ 5 khuôn hợp lệ mà AC-1 liệt, + 4 ca KHÔNG-phải-criterion (id trần không thân
    `- **AC-11**`, dòng bảng Coverage `- **Đ — đường đo** (CE: …): AC-6, AC-11`,
    văn xuôi nhắc id giữa câu, in-đậm tham-chiếu-chéo). Harness so cả BA trường
    id/gwt/judgment với bảng ghim, không chỉ "khác rỗng"; ca lệch được in đích danh
    tên ca + trường lệch. Đối chứng dương của AC-1 (văn xuôi nhắc id -> 0 criterion)
    nằm trong corpus, có chạy.
  discriminates: |
    Tự kiểm bằng đột biến: thu hẹp AC_LINE (ép phải có `:`) -> "FAIL: P58 3 lech so
    voi bang ghim". Bỏ luật code-span (uncoded -> identity) -> "FAIL: P58 1 lech so
    voi bang ghim". Case này phân biệt thật.

- eval: E2
  run_id: gate-card-ac-visibility-E2-20260730T020612Z
  criterion: AC-2
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T02:05:42Z
  output: |
    P59 bao-tap: khuon MOI phai BAO khuon CU, 0 dong mat, 0 dong rac them
      PASS: P59 bao-tap: 0 mat, +13 dong criterion that, 0 rac
  detail: |
    Ba chốt: LOST == 0 (bao-tập), GAINED >= 5 (phép nới có chạm khuôn mới),
    JUNK == 0 (nửa should-NOT-fire: không kéo theo dòng rác). Tập quét = corpus
    fixture HỢP với _acceptance/*/contract.md của repo kit.
  discriminates: |
    Đối chứng dương KHÔNG được script hoá trong case (xem Analyst), nên tôi tự chạy:
    ép AC_LINE phải có `**` -> P59 nổ đúng nhánh MẤT và IN ĐÍCH DANH từng dòng
    ("MAT gap-probe-presence-hook: - AC-1: Given `_acceptance/config.yaml` ...", 7 dòng).
    Ép AC_LINE phải có `:` -> P59 nổ nhánh GAINED ("chi them 0 dong — corpus khong
    dung den cac khuon moi"). Hai nhánh chốt đều sống.

- eval: E3
  run_id: gate-card-ac-visibility-E3-20260730T020612Z
  criterion: AC-3
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T02:05:42Z
  output: |
    P60 co judgment: 0 lat tren dong chung; nhan/code-span xu dung
         lat DUNG luat code-span: gate-card-ac-visibility AC-1
         lat DUNG luat code-span: gate-card-ac-visibility AC-3
      PASS: P60 co judgment: 0 lat; dau trong code-span = trich dan (false), go backtick -> true
  detail: |
    0 lật ngoài luật code-span trên mọi dòng cả hai khuôn cùng đọc được; hai lật
    DUY NHẤT đúng là AC-1/AC-3 của chính contract này (dogfood — trùng khớp con số
    gap-probe khai). Đối chứng dương code-span CÓ chạy và trên CÙNG một dòng
    (`quoted` vs `bare`, run-tests.sh:1251-1254) -> QUOTED=false BARE=true.
    Ca "thân bàn về judgment mà không mang dấu -> false" và ca "dấu cuối dòng ->
    true" nằm trong corpus P58 (AC-7 -> n, AC-9 -> y).
  discriminates: |
    Tự kiểm: gỡ luật code-span (uncoded -> identity) -> "FAIL: P60 co judgment sai:
    FLIP=0 QUOTED=true BARE=true". Phân biệt thật.

- eval: E5
  run_id: gate-card-ac-visibility-E5-20260730T020612Z
  criterion: AC-5
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T02:05:42Z
  output: |
    P62 RONG phai KEU (2 ca kich hoat) + doi chung chong cry-wolf
         A=blank:3 B=blank:2:## Acceptance criteria C=null
      PASS: P62 ca (a) khuon la + ca (b) heading lech deu KEU va neu heading; contract lanh IM
  detail: |
    Ca (a) heading đúng + 3 dòng khuôn lạ -> kind=blank, suspect=3. Ca (b) heading
    lệch `## Acceptance criteria` -> blank, suspect=2, và CÓ nêu lại heading đã tìm.
    Ca (c) contract lành -> null (không cry-wolf). Đối chứng dương chống cry-wolf
    có chạy thật.

- eval: E6
  run_id: gate-card-ac-visibility-E6-20260730T020658Z
  criterion: AC-5
  verifier: config:executors.test.scripts  (bash tests/scripts/run-tests.sh)
  verified_at: 2026-07-30T02:06:12Z
  output: |
    GCV1 canh bao mu criterion tren card THAT (2 ca keu + 1 ca im)
      PASS: GCV1a khuon la -> card neu KHONG doc duoc criterion nao
      PASS: GCV1b heading lech -> card neu ten heading sai
      PASS: GCV1c card mu phai bao dung KHONG duyet
      PASS: GCV1d contract lanh khong sinh canh bao nao
  detail: |
    Đây là đường end-to-end THẬT: dựng 3 workspace fixture rồi chạy
    `node scripts/gate-card.js --root … --slug … --gate 1` và soi stdout của
    card. Cảnh báo đi ra đúng bề mặt người duyệt nhìn, không chỉ tồn tại trong hàm.
    GCV1c chốt được vế "biết việc phải làm tiếp" (chuỗi "đừng duyệt").

- eval: E13
  run_id: gate-card-ac-visibility-E13-20260730T020612Z
  criterion: AC-11
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T02:05:42Z
  output: |
    P64 CUT phai KEU (ca ma P62 khong phu vi n>=1) + doi chung m==n
         CUT=short:2/8 SAME=null
      PASS: P64 ca cut 2/8 KEU dung nhanh short; m==n IM (khong cry-wolf)
  detail: |
    Dựng đúng hình dạng radar-d3-crawl-cron (2 dòng khuôn chuẩn + 6 dòng khuôn lạ)
    -> kind=short, parsed=2, suspect=8. Đối chứng dương m == n -> null, có chạy.

- eval: E7
  run_id: gate-card-ac-visibility-E7-20260730T020612Z
  criterion: AC-6
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T02:05:42Z
  output: |
    P63 dogfood: contract cua chinh kit deu dung heading '## Criteria'
      PASS: P63 moi contract cua kit dung '## Criteria'; doi chung duong bat duoc ban doi heading
  detail: |
    Quét mọi _acceptance/*/contract.md của kit. Đối chứng dương CÓ chạy: bản sao
    `sed 's/^## Criteria$/## Acceptance criteria/'` của chính contract này phải
    trượt phép kiểm; thông điệp nhánh đỏ in đường dẫn file.

- eval: E8
  run_id: gate-card-ac-visibility-E8-20260730T020659Z
  criterion: AC-7
  verifier: config:executors.script.mirror_sync  (bash scripts/sync-plugin-packages.sh --check)
  verified_at: 2026-07-30T02:06:58Z
  output: |
    plugins/ mirror in sync.
  detail: |
    Mirror plugins/acceptance-gate/scripts/gate-card.js khớp nguồn. Phụ chứng
    độc lập: khi tôi sửa nguồn mà chưa đồng bộ mirror trong probe falsify E4,
    P29/P30/P41/P42/P47/P50 nổ đỏ ngay — lớp canh này sống.

- eval: E9
  run_id: gate-card-ac-visibility-E9-20260730T020612Z
  criterion: AC-8
  verifier: config:executors.test.plugins
  verified_at: 2026-07-30T02:05:42Z
  output: |
    P53 fixture judge E11 = ban render that (sinh lai + so byte)
      PASS: P53 fixture judge E11 == ban render that + khong jargon
  detail: |
    Case SINH LẠI thật trong cùng lần chạy (head -6 fixture + bash
    tests/plugins/fixtures/render-out-of-contract-block.sh, script này gọi chính
    gate-card.js) rồi `cmp -s` byte-đối-byte với
    _acceptance/s4-scope-triage/evidence/out-of-contract-card-sample.md.
    Khuôn render KHÔNG trôi sau khi nới parser.

- eval: E10
  run_id: gate-card-ac-visibility-E10-20260730T020658Z
  criterion: AC-1
  verifier: config:executors.test.scripts
  verified_at: 2026-07-30T02:06:12Z
  output: |
    GPM21 parity theo bang: decision card vs pre-merge, tung ca mot
      PASS: GPM21
    GPM20 bang 8 dau vao -> lib phan loai dung tung ca
      PASS: GPM20g
  detail: |
    Bảng parity decision-card vs pre-merge trên gap-probe vẫn khớp từng ca sau khi
    đổi khuôn bóc criterion — bản vá không rò sang luật khác.

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
    (Chuỗi thật trên card, lấy từ lib/ac-line.js:blindSpotText, có câu
    "Card này KHÔNG phản ánh hợp đồng — sửa contract rồi render lại, đừng duyệt.")
  human_override:

## Analyst

Non-discriminating evals: none xác nhận được bằng baseline diffBase (không chạy
baseline A/B ở vòng này — `baseline: n-a` cho mọi eval máy). Thay vào đó tôi kiểm
tính phân biệt bằng ĐỘT BIẾN có kiểm soát trên cây đã pin, rồi khôi phục:

| Đột biến | Case nổ đỏ | Kết luận |
|---|---|---|
| AC_LINE ép phải có `:` | P58, P59 (nhánh GAINED) | E1, E2 phân biệt |
| AC_LINE ép phải có `**` | P58, P59 (nhánh MẤT, in đích danh 7 dòng) | E2 phân biệt cả nhánh bao-tập |
| gỡ luật code-span (`uncoded` -> identity) | P58, P60 | E1, E3 phân biệt |
| **hai lối gọi gate-card.js lệch nhau (source + mirror cùng lệch)** | **KHÔNG case nào** — cả hai suite xanh trọn | **E4 KHÔNG phân biệt** |

Ba lệch phủ (bên cạnh E4 đã tính là FAIL):

1. **AC-2 khai "cả hai repo", eval chỉ chạy MỘT.** Criterion AC-2 ràng "tập
   contract thật của cả hai repo (kit + artifact-platform)". P59
   (run-tests.sh:1212) chỉ đọc `$ROOT/_acceptance` — 6 contract của kit + corpus.
   170 contract của artifact-platform KHÔNG được eval chạm. Chính con số làm nên
   lý do tồn tại của feature (+330 dòng, 43 contract rỗng, 11 cụt) đo trên repo
   đó, nên đây là chỗ criterion nói to hơn thước.
   *Tôi tự đo bù* (không phải eval, là phụ chứng của verifier): chạy khuôn CŨ vs
   `parseAC` trên 170 contract ở
   `/Users/manh-macmini/dev/artifact-platform/.claude/worktrees/festive-taussig-a073b5/_acceptance`
   -> `FILES=170 LOST=0 GAINED=408 BADFLIP=0 CODESPANFLIP=0`. Tức bất biến
   AC-2 và AC-3 **đang đúng** trên repo tiêu thụ; chỉ là eval không chứng minh nó.
   (GAINED=408 lớn hơn "+330" contract khai vì phép của tôi quét CẢ FILE, contract
   đo trong section — khác cơ sở đo, không phải mâu thuẫn.)

2. **AC-3 vế "phủ hồi quy 2 dòng repo tiêu thụ" không có trong eval.** AC-3 và
   E3 đều đòi "2 dòng của repo tiêu thụ có dấu trong backtick NHƯNG có chữ
   judgment trong nhãn phải VẪN true". P60 chỉ quét `_acceptance` của kit
   (run-tests.sh:1238) nên hai dòng đó không nằm trong tập quét — đầu ra chỉ hiện
   2 lật code-span, đều là AC-1/AC-3 của kit. Phép đo bù của tôi ở trên cho
   `CODESPANFLIP=0` trên artifact-platform, khớp với điều contract khai (2 dòng
   kia giữ judgment qua nhánh nhãn), nhưng lần nữa: eval không chứng minh.

3. **AC-2 và AC-11 thiếu đối chứng dương / đường end-to-end như đã khai.**
   - E2 khai "Đối chứng dương: tiêm một khuôn mới cố ý hẹp hơn -> case ĐỎ nêu
     đúng dòng bị mất". Không có phép tiêm nào trong P59. Tôi tự tiêm và nó ĐỎ
     đúng như khai (xem bảng đột biến), nên đây là nợ script-hoá, không phải sai
     bản chất — khác hẳn E4, nơi tôi tiêm và nó VẪN XANH.
   - AC-11 nói "When render card Cổng 1"; E13/P64 chỉ gọi `acBlindSpot` ở mức
     đơn vị. Nhánh `short` KHÔNG có ca end-to-end (GCV1 chỉ phủ `blank` a/b và
     ca im d). Rủi ro thấp vì card dùng chung một điểm nối
     (`gate-card.js:222 if (blindSpot) …`) mà GCV1a đã chứng minh có chạy, nhưng
     "một luật, hai lối vào" mà E6 tự nêu thì `short` chưa có lối thứ hai.

4. **Gap-probe khai "fixed" một thứ chưa được sửa.** Finding P1 thứ hai của
   `gap-probe.md` mô tả CHÍNH xác lỗi E4 ("P61 đo bằng grep đếm số regex —
   assertion vắng-mặt-một-mình, đúng lớp CLAUDE.md #4 cấm") và ghi cột Xử lý là
   "fixed: viết lại AC-4 + P61 theo hành vi". Trên cây af4a106, AC-4 ĐÃ được viết
   lại nhưng P61 thì chưa: nửa grep-đếm vẫn nguyên (dòng 1262-1271, và nó vẫn là
   nhánh fail duy nhất có khả năng nổ), nửa "hành vi" là hằng đúng. Một finding
   tự khai đã đóng mà chưa đóng là đúng lớp lỗi mà chính feature này tồn tại để
   chống — hồ sơ trông bình thường nên không xin được chú ý.

## Variance

none — không eval nào có `runs > 1`; mọi eval máy deterministic và cho kết quả
đồng nhất qua hai lần chạy trên cùng cây (lần xác nhận cuối sau khi khôi phục
mọi đột biến: plugins "all plugin tests passed", scripts "592 passed, 0 failed",
mirror "plugins/ mirror in sync.").

## Iterations

Round 1: E4 FAIL — case P61 xanh nhưng không đo được AC-4 (nửa đầu là grep đếm
regex mà criterion cấm; nửa sau gọi cùng `parseAC` hai lần thay vì hai lối gọi
của gate-card.js; đối chứng dương đã khai thì không tồn tại). Falsify: làm hai
lối gọi thật lệch nhau ở source + mirror -> toàn bộ cổng vẫn xanh. Trả về
implementation.

## Gate 2 checklist (human)

- [ ] Đọc bảng + soi khối E4 (đây là chỗ REJECT)
- [ ] Quyết: P61 cần viết lại để bóc bằng CHÍNH hai lối của `gate-card.js`
      (dòng 176 card / dòng 265 `critText`) trên corpus, + đối chứng dương làm
      một lối lệch -> case phải ĐỎ. Đề nghị bỏ hẳn nửa grep-đếm.
- [ ] Quyết có mở rộng P59/P60 sang `_acceptance` của artifact-platform (AC-2/AC-3
      khai "cả hai repo") hay hạ lời criterion xuống đúng tập eval chạm được
- [ ] E11 và E12 vẫn UNCERTAIN — T3 đòi người phán trực tiếp; điền
      `human_override: <tên> <ngày>` cho từng cái khi tới lượt PASS
