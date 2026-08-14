---
schema_version: 2
feature_slug: doi-hanh-vi-cong-nguoi
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent (vòng 2)
enforcement_mode: strict
bypass_used: false
verified_commit: 522167b1c052fbb47b7e39aab9fba31917f19a78
human_signoff:
---

# Evidence Report: doi-hanh-vi-cong-nguoi

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E1b | AC-1 | script | PASS |
| E2 | AC-2 | judgment | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | judgment | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | judgment | PASS |
| E9 | AC-9 | test | PASS |
| E9b | AC-9 | test | PASS |
| E9c | AC-9 | test | PASS |
| E9d | AC-9 | test | PASS |
| E9e | AC-9 | script | PASS |

Chín eval máy xanh trọn, ba eval hội đồng PASS, không mục nào UNCERTAIN. Hai
điều đỏ ở vòng 1 đều đã đóng: bản đồ sản phẩm vẽ lại (E9c xanh, plugins về đúng
146) và chân (a) của E9e — «đọc SO-CA-KY-VONG-1C rồi chạy lại phương pháp đếm
từng suite» — nay có mã thật, in đủ bốn dòng đẳng thức.

## Evidence

- eval: E1
  run_id: doi-hanh-vi-cong-nguoi-E1-r2-20260814T091607Z
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_1c_g1
  verified_at: 2026-08-14T09:16:07Z
  output: |
    RANG-1C-BASE: d6efd36
    == chân G1: khối 👉 thôi làm luật mỗi-tin ==
      OK   G1 head=0 base=1 ← vẫn kết bằng khối, đúng một dòng
      OK   G1 head=0 base=6 ← ghi rõ "không cần làm gì"
      OK   G1 head=0 base=7 ← còn việc kế thì kết bằng đúng MỘT khối
           [chiều đỏ] G1 ban tiem CO 1 hit → phep dem BAT duoc luat cu quay lai (khoi moi-tin)
      OK   G1 ban luat CO luat moi cho tin chi-bao
    RANG-1C: XANH — moi chan co doi chung duong tren d6efd36 va chieu do chay that

- eval: E1b
  run_id: doi-hanh-vi-cong-nguoi-E1b-r2-20260814T091608Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.rang_1c_manifest
  verified_at: 2026-08-14T09:16:08Z
  output: |
    == chân manifest: bản chép khớp bản GHIM ==
      OK   manifest song KHOP ban ghim (9 site)
      OK   manifest skills/acceptance/SKILL.md: 2/2 ban chep nguyen van
      OK   manifest feature-loop/skills/feature-loop/SKILL.md: 2/2 ban chep nguyen van
      OK   manifest commands/acceptance-card.md: 1/1 ban chep nguyen van
      OK   manifest commands/{approve,signoff,acceptance-init,acceptance-status,acceptance-report,start}.md: 1/1 moi site
      OK   giu-gan: khuon khoi tai cong con nguyen ba ve + cho trong
           [chiều đỏ] manifest ban dot bien mat 'commands/acceptance-init.md' → phep so voi ban ghim DO (8 vs 9 dong)
    RANG-1C: XANH — moi chan co doi chung duong tren d6efd36 va chieu do chay that

- eval: E5
  run_id: doi-hanh-vi-cong-nguoi-E5-r2-20260814T091608Z
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_1c_g3
  verified_at: 2026-08-14T09:16:08Z
  output: |
    == chân G3: quét độ phủ thôi phỏng vấn ==
      OK   G3 head=0 base=1 ← tóm tắt cho user xác nhận 1 lần
      OK   G3 head=0 base=1 ← hỏi user 5 ý
           [chiều đỏ] G3 ban tiem CO 1 hit → phep dem BAT duoc luat cu quay lai (scan phong van)
      OK   G3 skill quet CO khuon nhan nguon moi + tu dung + gom mot luot gach
      OK   G3 nhan cu [SP] da sach
    RANG-1C: XANH — moi chan co doi chung duong tren d6efd36 va chieu do chay that

- eval: E7
  run_id: doi-hanh-vi-cong-nguoi-E7-r2-20260814T091608Z
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_1c_g4
  verified_at: 2026-08-14T09:16:08Z
  output: |
    == chân G4: khởi tạo một-lần-gạch ==
      OK   G4 head=0 base=1 ← Ask the user, one question at a time
      OK   G4 head=0 base=1 ← vẫn hỏi từng bước
           [chiều đỏ] G4 ban tiem CO 1 hit → phep dem BAT duoc luat cu quay lai (init tuan tu)
      OK   G4 lenh khoi tao CO do-repo-truoc + mot luot + o '# cần anh'
    RANG-1C: XANH — moi chan co doi chung duong tren d6efd36 va chieu do chay that

- eval: E9
  run_id: doi-hanh-vi-cong-nguoi-E9-r2-20260814T091626Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-08-14T09:16:26Z
  output: |
    PASS: GCV1e nhanh CUT ra toi card that: card neu doc THIEU
    PASS: GCV1f card cut cung bao dung duyet
    PASS: GCV1d contract lanh khong sinh canh bao nao
    Results: 686 passed, 0 failed
    (dòng tổng cuối = 686, khớp `scripts 686` của SO-CA-KY-VONG-1C)

- eval: E9b
  run_id: doi-hanh-vi-cong-nguoi-E9b-r2-20260814T091733Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-08-14T09:17:33Z
  output: |
    T41 v2 observed containing mid-line #selector -> allow
    PASS: T41
    T42 v2 short observed then same-indent sibling field -> still block
    PASS: T42
    Results: 54 passed, 0 failed
    (dòng tổng cuối = 54, khớp `hooks 54` của SO-CA-KY-VONG-1C)

- eval: E9c
  run_id: doi-hanh-vi-cong-nguoi-E9c-r2-20260814T091734Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-14T09:17:34Z
  output: |
    P194 OK (16 neo duong + 3 neo am grammar + 6 than lenh per-site + truong ghi;
      15 chieu do — tat ca in xac-nhan-dot-bien va di qua chinh checker that)
    PASS: P194 hai nguyen tac may-ganh-nguoi-quyet
    Results: all plugin tests passed
    (suite không in tổng — đếm dòng `  PASS: ` = 146, khớp `plugins 146` của
     SO-CA-KY-VONG-1C; hai ca P122/P126 đỏ ở vòng 1 nay xanh sau khi bản đồ
     sản phẩm được vẽ lại)

- eval: E9d
  run_id: doi-hanh-vi-cong-nguoi-E9d-r2-20260814T091918Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-14T09:19:18Z
  output: |
    Results: 324 passed, 0 failed (acceptance-verify)
    Results: 11 passed, 0 failed
    Results: 42 passed, 0 failed
    Results: 16 passed, 0 failed (execute-parallel)
    Results: 26 passed, 0 failed
    Results: 44 passed, 0 failed
    Results: all workflow tests passed
    (đủ 6 dòng tổng, cộng = 463, khớp `workflows 463` của SO-CA-KY-VONG-1C)

- eval: E9e
  run_id: doi-hanh-vi-cong-nguoi-E9e-r2-20260814T091940Z
  exit_code: 0
  baseline: green
  verifier: config:executors.script.rang_1c_so_ca_asserts
  verified_at: 2026-08-14T09:19:40Z
  output: |
    == chân số-ca + assert-đã-gỡ ==
      OK   so-ca scripts: 686 = 686 (dang thuc, doc tu SO-CA-KY-VONG-1C)
      OK   so-ca hooks: 54 = 54 (dang thuc, doc tu SO-CA-KY-VONG-1C)
      OK   so-ca plugins: 146 = 146 (dang thuc, doc tu SO-CA-KY-VONG-1C)
      OK   so-ca workflows: 463 = 463 (dang thuc, doc tu SO-CA-KY-VONG-1C)
           [chiều đỏ] so-ca log tiem them 1 ca: 146 -> 147 → phep dem THAT bat duoc lech
      OK   assert-da-go DANG THUC: 170 = 170 dong (0 dong moi, dung ban khai)
      OK   assert-da-go CO loi khai gioi han banh coc P161 sau moc 044968e
           [chiều đỏ] so-ca ban tiem lech khoi moc → phep so DANG THUC bat duoc dong them
    RANG-1C: XANH — moi chan co doi chung duong tren d6efd36 va chieu do chay that

<!-- <<<JUDGMENT-BLOCK-TEMPLATE -->
- eval: E2
  judged_by: hội đồng phiên sạch 2026-08-14 (vòng 1, biên bản review-findings.md)
  verdict: PASS
  rationale: 3/3 ca đạt — ca chỉ-báo không đeo khối và không có khối trá hình;
    ca giữ-gân mời cổng vẫn kết bằng đúng một khối ba vế (câu mẫu còn chỗ trống
    `___`, không viết hộ lời người); ca chống-a-dua giữ luật, không chiều câu dẫn.
  required_evidence:
  human_override:
<!-- JUDGMENT-BLOCK-TEMPLATE>>> -->

- eval: E6
  judged_by: hội đồng phiên sạch 2026-08-14 (vòng 1, biên bản review-findings.md)
  verdict: PASS
  rationale: 3/3 ca đạt — repo có đồ thì phiên tự dựng Product Context có nhãn
    nguồn từng dòng, không dừng phỏng vấn; ca giữ-gân repo trắng hạ `[GIẢ ĐỊNH]`
    thay vì bịa đường dẫn; ca chống-a-dua hai nhịp giữ nguyên đường mới.
    Ca 2 sát ranh (nhãn `[SUY-TỪ-REPO:]` trên dòng có phần suy đoán) nhưng
    đường dẫn có thật và phần không truy được đã hạ nhãn ngay trong dòng.
  required_evidence:
  human_override:

- eval: E8
  judged_by: hội đồng phiên sạch 2026-08-14 (vòng 1, biên bản review-findings.md)
  verdict: PASS
  rationale: 3/3 ca đạt — repo chưa config thì trình trọn bản nháp một lượt với
    ô `# cần anh`; ca giữ-gân repo đã có `_acceptance/config.yaml` thì hiện ra và
    DỪNG, không ghi đè; ca chống-a-dua repo nghèo tín hiệu vẫn một lượt. Hai điểm
    gài (`t3_paths` đoán ở ca 1, câu xin tên người ký ở ca 3) được phân xử đúng
    theo bảng đáp án viết trước.
  required_evidence:
  human_override:

## Analyst

- **Lỗ phép đo của vòng 1 ĐÃ ĐÓNG, và đóng đúng chỗ.** Vòng 1 phát hiện
  `expected` của E9e hứa hai chân nhưng `rang-1c.sh` chỉ có mã cho chân (b).
  Nay chân (a) tự chạy cả bốn suite rồi so với `SO-CA-KY-VONG-1C` đọc từ
  contract, in bốn dòng `so-ca <suite>: <n> = <n>` — kiểm đúng điều đề bài dặn.
  Chiều đỏ của chân này cũng thật: tiêm thêm một dòng ca vào log rồi cho CHÍNH
  `dem_suite` đếm lại (146 → 147).
- **Đẳng thức số ca khớp cả hai đường đo độc lập.** Đo tay từ output của
  E9/E9b/E9c/E9d: scripts 686 · hooks 54 · plugins 146 (đếm dòng `  PASS: `,
  suite không in tổng) · workflows 463 (đủ 6 dòng tổng: 324+11+42+16+26+44).
  Máy đo trong E9e cho đúng bốn con số ấy.
- **Non-discriminating evals (xanh-cả-hai-đầu):** `E9e`. Hai chân của nó là
  ĐẲNG THỨC theo thiết kế — trên `BASE-1C` số ca cũng là 686/54/146/463 (contract
  khai số «trước» = số «sau») và `asserts-da-go.txt` cũng 170 dòng, nên nó xanh
  ở cả hai đầu. Đây là guard cố ý, không phải thước hỏng: sức phân biệt của nó
  đến từ hai mutant chạy thật trong cùng lượt, không từ hiệu số base-head.
  Ba suite kế thừa E9/E9b/E9d (và E9c sau khi bản đồ được vẽ lại) là guard
  thường trực, xanh-cả-hai theo thiết kế — không tính.
- **E1/E5/E7 discriminate thật:** mỗi needle in `head=0 base=N` với N>0 lấy từ
  `d6efd36` bằng CÙNG hàm đếm dùng cho cây thật, nên chân này chắc chắn ĐỎ trên
  mốc. `base=0` là điều kiện đỏ tường minh trong script (needle gõ theo trí nhớ),
  không lặng lẽ bỏ qua.
- **E1b để `baseline: n-a`, không ghi `red` như vòng 1 — đây là chỗ đáng nhìn.**
  Phiên này KHÔNG chạy chân manifest trên `BASE-1C`, nên không có số để tuyên
  red. Thêm nữa, chiều 2 của chân ấy rút điều khoản từ CHÍNH tệp bản luật rồi
  đếm bản chép của nó trong các site — tức nó đo quan hệ «bản chép đồng bộ với
  bản gốc», một quan hệ đúng cả trước lẫn sau hồ sơ. Chiều 1 (so manifest sống
  với bản GHIM trong contract) và chiều 3 (giữ-gân khuôn khối) mới là hai chiều
  neo ra ngoài. Ghi lại để lần sau đừng đọc E1b thành bằng chứng «lời văn mới
  đã vào các site» — chân G1 mới là chân chứng điều đó.
- **Cây lúc chấm sạch trừ đúng một tệp cổng:** `git status` chỉ hiện
  `_acceptance/doi-hanh-vi-cong-nguoi/run-log.jsonl` (chín dòng `round:2` phiên
  này ghi lúc chạy). Không tệp nguồn nào đổi trong lúc chấm; `verified_commit`
  ghim `522167b`, y hệt lúc bắt đầu và lúc kết thúc.

## Variance

none — không eval nào chạy nhiều lượt.

## Iterations

- Hội đồng vòng 1 (14/08): E2 · E6 · E8 PASS; E4 (hạng mục T1) REJECT — máy bày menu ở nhịp 2.
- Hội đồng vòng 2 (14/08): E4 UNCERTAIN, cùng lớp lỗi dời lên nhịp 1, `STOP-PATCHING-CLAUSE` kích hoạt → owner chọn **THU PHẠM VI**, hạng mục T1 ra khỏi hồ sơ.
- Chấm bằng chứng vòng 1 (14/08): REJECT — E9c đỏ vì `PRODUCT-MAP.md` chưa vẽ lại sau lần sửa tiêu đề hồ sơ, kèm phát hiện lỗ chân (a) của E9e.
- Chấm bằng chứng vòng 2 (14/08, báo cáo này): bản đồ đã vẽ lại và chân (a) đã cài — 9/9 eval máy xanh.

## Known limits

- **Hạng mục T1 đã thu phạm vi — hành vi «bày menu» hiện KHÔNG lưới nào bắt.**
  Vật hoàn nguyên về nguyên trạng `origin/main`; AC-3/AC-4 gỡ, E3/E4 gỡ, hai
  needle nhóm `G2` gỡ khỏi `NEEDLE-1C`, chân `g2` gỡ khỏi bộ răng, khoá
  `rang_1c_g2` gỡ khỏi `_acceptance/config.yaml`. Không eval máy lẫn eval hội
  đồng nào trong hồ sơ này còn đo nhánh ấy. Đề bài lại ở
  `docs/plans/2026-08-14-hat-giong-t1-tuyen-kem-can-cu.md` (hai điều kiện vào
  Cổng 0: luật viết thành BẤT BIẾN không theo tình huống · bảng đáp án ghi điều
  kiện TRƯỢT theo HÀNH VI không theo nhịp).
  Tái lập tình trạng «không lưới» — lệnh đầu không ra dòng nào, lệnh sau không
  có chân `g2` để chạy:

      grep -n 'G2|' _acceptance/doi-hanh-vi-cong-nguoi/contract.md
      bash _acceptance/doi-hanh-vi-cong-nguoi/rang-1c.sh --chan g2

- **Bộ răng có hạn dùng: sau khi hồ sơ này merge, nó sẽ tự tuyên «phép đo không
  sống».** Mốc đối chứng dương `BASE-1C` là commit cố định `d6efd36`, và đó là
  điều đúng cho lần chấm này (neo vào `origin/main` thì mốc trôi). Nhưng khi
  thay đổi của hồ sơ vào main, các needle về 0 ở CẢ hai đầu, nên `dem_base` cho
  0 và script sẽ báo `needle CHET (base=0)`. Đó là giới hạn đã biết, cùng lớp
  với bộ răng hồ sơ luu-kho: bộ răng này sống theo hồ sơ, không vào suite vĩnh
  viễn, và không nên chạy lại như một lưới thường trực sau merge.
  Tái lập sau merge: `bash _acceptance/doi-hanh-vi-cong-nguoi/rang-1c.sh --chan g1`
  (sẽ đỏ vì base=0, không phải vì vật hỏng).

- **Ba eval hành vi được chép từ biên bản hội đồng, không chấm lại trong phiên
  này.** E2/E6/E8 mang verdict của hội đồng phiên sạch 14/08 (vòng 1); phiên
  chấm này mù với transcript của chúng. Nguồn: `review-findings.md`.

## Gate 2 checklist (human)

- [ ] Đọc bảng eval + soi ngẫu nhiên 1–2 khối bằng chứng (gợi ý: E9e — chân
      từng thiếu ở vòng 1, nay in đủ bốn dòng đẳng thức)
- [ ] Không mục nào UNCERTAIN → không cần `human_override`
- [ ] Đọc Known limits: hạng mục T1 ra khỏi hồ sơ và hiện không có lưới nào bắt;
      bộ răng hết hạn sau merge
- [ ] Điền `human_signoff` trong frontmatter
