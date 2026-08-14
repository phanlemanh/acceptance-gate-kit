---
schema_version: 2
feature_slug: doi-hanh-vi-cong-nguoi
verdict: REJECT
failed_evals: [E9c]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: bd843a543b89fa47b00c80ecaab480f0cb1c70b2
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
| E9c | AC-9 | test | **REJECT** |
| E9d | AC-9 | test | PASS |
| E9e | AC-9 | script | PASS |

Một lưới ĐỎ: suite `plugins` (E9c) — hai ca P122/P126 hỏng vì `PRODUCT-MAP.md`
lệch khỏi hồ sơ xưởng. Ba hạng mục của hồ sơ (lớp máy + lớp hành vi) đều xanh.

## Evidence

- eval: E1
  run_id: doi-hanh-vi-cong-nguoi-E1-20260814T090318Z
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_1c_g1
  verified_at: 2026-08-14T09:03:18Z
  output: |
    == chân G1: khối 👉 thôi làm luật mỗi-tin ==
      OK   G1 head=0 base=1 ← vẫn kết bằng khối, đúng một dòng
      OK   G1 head=0 base=6 ← ghi rõ "không cần làm gì"
      OK   G1 head=0 base=7 ← còn việc kế thì kết bằng đúng MỘT khối
           [chiều đỏ] G1 ban tiem CO 1 hit → phep dem BAT duoc luat cu quay lai (khoi moi-tin)
      OK   G1 ban luat CO luat moi cho tin chi-bao
    RANG-1C: XANH — moi chan co doi chung duong tren d6efd36 va chieu do chay that

- eval: E1b
  run_id: doi-hanh-vi-cong-nguoi-E1b-20260814T090318Z
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_1c_manifest
  verified_at: 2026-08-14T09:03:18Z
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
  run_id: doi-hanh-vi-cong-nguoi-E5-20260814T090318Z
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_1c_g3
  verified_at: 2026-08-14T09:03:18Z
  output: |
    == chân G3: quét độ phủ thôi phỏng vấn ==
      OK   G3 head=0 base=1 ← tóm tắt cho user xác nhận 1 lần
      OK   G3 head=0 base=1 ← hỏi user 5 ý
           [chiều đỏ] G3 ban tiem CO 1 hit → phep dem BAT duoc luat cu quay lai (scan phong van)
      OK   G3 skill quet CO khuon nhan nguon moi + tu dung + gom mot luot gach
      OK   G3 nhan cu [SP] da sach
    RANG-1C: XANH — moi chan co doi chung duong tren d6efd36 va chieu do chay that

- eval: E7
  run_id: doi-hanh-vi-cong-nguoi-E7-20260814T090319Z
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_1c_g4
  verified_at: 2026-08-14T09:03:19Z
  output: |
    == chân G4: khởi tạo một-lần-gạch ==
      OK   G4 head=0 base=1 ← Ask the user, one question at a time
      OK   G4 head=0 base=1 ← vẫn hỏi từng bước
           [chiều đỏ] G4 ban tiem CO 1 hit → phep dem BAT duoc luat cu quay lai (init tuan tu)
      OK   G4 lenh khoi tao CO do-repo-truoc + mot luot + o '# cần anh'
    RANG-1C: XANH — moi chan co doi chung duong tren d6efd36 va chieu do chay that

- eval: E9
  run_id: doi-hanh-vi-cong-nguoi-E9-20260814T090439Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-08-14T09:04:39Z
  output: |
    PASS: GCV1e nhanh CUT ra toi card that: card neu doc THIEU
    PASS: GCV1f card cut cung bao dung duyet
    PASS: GCV1d contract lanh khong sinh canh bao nao
    Results: 686 passed, 0 failed
    (dòng tổng cuối = 686, khớp `scripts 686` của SO-CA-KY-VONG-1C)

- eval: E9b
  run_id: doi-hanh-vi-cong-nguoi-E9b-20260814T090441Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-08-14T09:04:41Z
  output: |
    T42 v2 short observed then same-indent sibling field -> still block
    PASS: T42
    Results: 54 passed, 0 failed
    (dòng tổng cuối = 54, khớp `hooks 54` của SO-CA-KY-VONG-1C)

- eval: E9c
  run_id: doi-hanh-vi-cong-nguoi-E9c-20260814T090630Z
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-14T09:06:30Z
  output: |
    P122 buoc lam moi ban do nam SAU buoc ghi field cong, 2 harness + plugin-root (E6,E7)
    AssertionError: PRODUCT-MAP.md cua kit lech voi ho so xuong: PRODUCT-MAP.md lệch
      với hồ sơ xưởng — chạy: node scripts/product-map.mjs --root .
      FAIL: P122 ...
    P126 PRODUCT-MAP.md mien tru t1 + --check canh that + co trong CI + co ADR (E18)
    AssertionError: doi chung duong hong: ban do cua kit dang lech san
      FAIL: P126 ...
    Results: 2 failed
    (đếm dòng `  PASS: ` = 144; bản khai `plugins 146` → thiếu đúng 2 ca đỏ ở trên)

- eval: E9d
  run_id: doi-hanh-vi-cong-nguoi-E9d-20260814T090632Z
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-14T09:06:32Z
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
  run_id: doi-hanh-vi-cong-nguoi-E9e-20260814T090632Z
  exit_code: 0
  baseline: red
  verifier: config:executors.script.rang_1c_so_ca_asserts
  verified_at: 2026-08-14T09:06:32Z
  output: |
    == chân số-ca + assert-đã-gỡ ==
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

## Analyst

- **E9c là lưới kế thừa đỏ, không phải lớp thước của hồ sơ.** Ba hạng mục của
  hồ sơ đều xanh cả hai lớp (máy: E1/E1b/E5/E7 · hành vi: E2/E6/E8). Cái đỏ nằm
  ở AC-9 (lưới kế thừa).
- **Nguyên nhân đã truy tới cùng, một dòng:** `PRODUCT-MAP.md` chưa vẽ lại sau
  lần sửa tên hồ sơ tại vòng thu phạm vi 14/08. Dựng bản sao cây và chạy trình
  vẽ, diff cho ĐÚNG một dòng lệch — dòng tiêu đề của chính hồ sơ này
  («Bốn lượt…» còn trong bản đồ vs «Ba lượt… (hạng mục T1 đã thu phạm vi 14/08)»
  trong contract). Đây là hệ quả trực tiếp của thay đổi trong hồ sơ này, không
  phải rác môi trường: P126 còn khai thẳng là **đối chứng dương của chính nó
  hỏng** vì bản đồ đang lệch sẵn. Phiên chấm KHÔNG sửa vật (chỉ được ghi trong
  `_acceptance/doi-hanh-vi-cong-nguoi/`); đường sửa là chạy lại trình vẽ bản đồ
  rồi commit cùng lượt, sau đó chấm lại vòng 2.
- **Đẳng thức số ca:** scripts 686 ✓ · hooks 54 ✓ · workflows 463 (đủ 6 dòng
  tổng) ✓ · plugins **144 ≠ 146** ✗ — lệch đúng bằng hai ca đỏ, không có ca nào
  biến mất.
- **Lỗ của chính phép đo, khai thẳng:** `expected` của E9e hứa HAI chân, nhưng
  chân (a) — «đọc SO-CA-KY-VONG-1C rồi chạy lại phương pháp đếm từng suite» —
  KHÔNG có trong `rang-1c.sh`; chân đó chỉ đo `asserts-da-go.txt` và chiều đỏ
  của nó là chiều đỏ trên file assert, không phải trên số ca. Đẳng thức số ca
  vì vậy được chấm bằng tay trong báo cáo này từ output của E9/E9b/E9c/E9d
  (kết quả ở gạch đầu dòng trên). Ghi lại để lần sau khỏi tin nhầm rằng E9e
  xanh là số ca đã có răng.
- Non-discriminating evals: E9/E9b/E9d là suite kế thừa (guard, xanh-cả-hai theo
  thiết kế — không tính). Bốn chân răng E1/E1b/E5/E7 và chân E9e đều in đối
  chứng dương thật trên mốc `BASE-1C` (`d6efd36`) và một chiều đỏ chạy qua chính
  hàm kiểm trong cùng lượt → discriminate được.

## Variance

none — không eval nào chạy nhiều lượt.

## Iterations

Hồ sơ đã đi HAI vòng hội đồng trước phiên chấm này (chi tiết `review-findings.md`):
- Vòng 1 (14/08): E2 · E6 · E8 PASS; E4 (hạng mục T1) REJECT — máy bày menu ở nhịp 2.
- Vòng 2 (14/08): E4 UNCERTAIN — vá có tác dụng ở nhịp 2 nhưng cùng lớp lỗi
  dời lên nhịp 1; giám khảo tuyên «bảng không phủ». `STOP-PATCHING-CLAUSE`
  kích hoạt → owner chọn **THU PHẠM VI**: hạng mục T1 ra khỏi hồ sơ, vật hoàn
  nguyên về nguyên trạng `origin/main`, đề bài lại ở
  `docs/plans/2026-08-14-hat-giong-t1-tuyen-kem-can-cu.md`.
- Vòng chấm máy 1 (phiên này, 14/08): E9c ĐỎ — `PRODUCT-MAP.md` chưa vẽ lại sau
  lần sửa tên hồ sơ ở vòng thu phạm vi. Trả về thi công.

## Known limits

- **Hạng mục T1 đã thu phạm vi.** Hành vi «bày menu» của nhánh T1 — máy đẩy
  quyết định ngược về người sau khi người đã nêu ý — **hiện KHÔNG có lưới nào
  bắt**: vật đã hoàn nguyên về `origin/main`, AC-3/AC-4 gỡ, E3/E4 gỡ, hai
  needle nhóm `G2` gỡ khỏi `NEEDLE-1C`, chân `g2` gỡ khỏi bộ răng, khoá
  `rang_1c_g2` gỡ khỏi `_acceptance/config.yaml`. Không có eval máy lẫn eval
  hội đồng nào trong hồ sơ này đo nhánh ấy nữa. Đề bài lại ở
  `docs/plans/2026-08-14-hat-giong-t1-tuyen-kem-can-cu.md` (kèm hai điều kiện
  vào Cổng 0: luật viết thành BẤT BIẾN không theo tình huống · bảng đáp án ghi
  điều kiện TRƯỢT theo HÀNH VI không theo nhịp).
  Lệnh tái lập tình trạng «không lưới»: cả hai lệnh dưới đây phải chạy được và
  cho thấy nhóm `G2` không còn tồn tại ở bất kỳ đầu nào —

      grep -n 'G2|' _acceptance/doi-hanh-vi-cong-nguoi/contract.md
      bash _acceptance/doi-hanh-vi-cong-nguoi/rang-1c.sh --chan g2

  (lệnh thứ nhất không ra dòng nào; lệnh thứ hai không có chân `g2` để chạy.)
- **Chân (a) của E9e không tồn tại trong executor** — xem mục Analyst. Đẳng
  thức số ca hiện chỉ được chấm bằng tay ở báo cáo này.
  Tái lập: `grep -n 'so-ca\|SO-CA' _acceptance/doi-hanh-vi-cong-nguoi/rang-1c.sh`
- **Cây lúc chấm có một sửa chưa commit**: `_acceptance/doi-hanh-vi-cong-nguoi/contract.md`
  (vật cổng, nằm trong `_acceptance/` nên không tính là trôi mã). `verified_commit`
  ghim `bd843a5` là HEAD lúc chấm.

## Gate 2 checklist (human)

- [ ] Verdict là REJECT — chưa mời ký. Đọc mục Analyst trước.
- [ ] Xác nhận đường sửa: vẽ lại `PRODUCT-MAP.md` rồi commit cùng lượt, chấm lại.
- [ ] Đọc Known limits: hạng mục T1 ra khỏi hồ sơ và hiện không có lưới nào bắt.
