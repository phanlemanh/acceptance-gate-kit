---
schema_version: 1
slug: cong-chan-nham-cho
round: 1
verdict: PASS
verified_commit: 2f8de63ab4868608b7572e3d711e198af3669325
verified_at: 2026-08-16T11:08:38Z
human_signoff: Manh Phan 2026-08-16
---

# Evidence Report — cong-chan-nham-cho (round 1)

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | judgment | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |
| E11 | AC-11 | script | PASS |

## Evidence

- eval: E1
  run_id: r-20260816T110004Z-22587
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ccnc_rang_lan_v
  verified_at: 2026-08-16T11:08:38Z
  output: |
    CCNC-BASE: origin/main -> 2ebe296
    CCNC-LAN-V: T2 mo -> NOTE, 0 VIOLATION OK
      OK   làn V qua lưới mới
    CCNC-LAN-V: base VIOLATION OK
      OK   lưới cũ chặn đúng hồ sơ này (đối chứng dương)
    CCNC [lan-v]: 0 ĐỎ

- eval: E2
  run_id: r-20260816T110004Z-22587
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ccnc_rang_lan_v_do
  verified_at: 2026-08-16T11:08:38Z
  output: |
    CCNC-BASE: origin/main -> 2ebe296
           [đột biến] (a) T3 + mo
      OK   (a) đỏ đúng thông điệp
           [đột biến] (b) vết rỗng
      OK   (b) đỏ đúng thông điệp
           [đột biến] (c) vắng khoá veto_state
      OK   (c) đỏ nguyên văn luật cũ
           [đột biến] (d) mo + KHÔNG xanh-sạch + chưa ký
      OK   (d) đỏ đúng — quan hệ, không phải nhãn
           [đột biến] (e) giữ-gân: không sạch nhưng ĐÃ ký
      OK   (e) giữ-gân XANH
    CCNC-LAN-V-DO: 4/4 chieu do dung thong diep · giu-gan OK
    CCNC [lan-v-do]: 0 ĐỎ

- eval: E3
  run_id: r-20260816T110004Z-22587
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ccnc_rang_provenance
  verified_at: 2026-08-16T11:08:38Z
  output: |
    CCNC-BASE: origin/main -> 2ebe296
    CCNC-PROV: 0 VIOLATION · 1 NOTE het-hieu-luc OK
      OK   khoá cũ chỉ còn là một dòng nhắc
    CCNC-PROV: base VIOLATION OK
      OK   lưới cũ chặn đúng fixture này (đối chứng dương)
    CCNC [provenance]: 0 ĐỎ

- eval: E4
  run_id: r-20260816T110004Z-22587
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ccnc_rang_giu_cho
  verified_at: 2026-08-16T11:08:38Z
  output: |
    CCNC-BASE: origin/main -> 2ebe296
           [đột biến] chữ ký giữ-chỗ, khoá cũ=1
      OK   giữ-chỗ vẫn ĐỎ (khoá cũ=1)
           [đột biến] chữ ký giữ-chỗ, khoá cũ=0
      OK   giữ-chỗ vẫn ĐỎ (khoá cũ=0)
      OK   đối chứng dương: chữ ký thật thì sạch
    CCNC-GIU-CHO: 2/2 VIOLATION · doi chung sach OK
    CCNC [giu-cho]: 0 ĐỎ

- eval: E5
  run_id: r-20260816T110004Z-22587
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ccnc_rang_nghi_le
  verified_at: 2026-08-16T11:08:38Z
  output: |
    CCNC-BASE: origin/main -> 2ebe296
    CCNC-SCOPE: commands skills feature-loop scripts lib hooks GUIDE.md QUICKSTART.md README.md CONTEXT.md
      OK   CCNC-SCOPE: khop ban khai PHAM-VI-RANG
    CCNC-SCOPE: khop ban khai PHAM-VI-RANG
    CCNC-NGHI-LE: allowlist 3 file
           allowlist: scripts/pre-merge-check.sh (toi da 8 hit — cho DAY nguoi go khoa cu)
           allowlist: GUIDE.md (toi da 3 hit — cho DAY nguoi go khoa cu)
           allowlist: commands/acceptance-init.md (toi da 2 hit — cho DAY nguoi go khoa cu)
      OK   CCNC-NGHI-LE: require_human_commit ngoai-allowlist=0 base=21(>0) OK
      OK   CCNC-NGHI-LE: agent_authors ngoai-allowlist=0 base=10(>0) OK
      OK   CCNC-NGHI-LE: human-fields-only ngoai-allowlist=0 base=10(>0) OK
      OK   CCNC-NGHI-LE: human-owned ngoai-allowlist=0 base=10(>0) OK
      OK   CCNC-NGHI-LE: commit RIÊNG ngoai-allowlist=0 base=2(>0) OK
    CCNC-NGHI-LE: 5/5
           [đột biến] chèn «commit RIÊNG» + «human-owned» vào bản sao SKILL feature-loop
      OK   MUTANT-NGHI-LE bi bat (chinh cau grep cua chan nay)
    CCNC-NGHI-LE: hook+recheck mu voi khoa cu OK
      OK   recheck cho cùng kết quả có/không khoá cũ
    CCNC [nghi-le]: 0 ĐỎ

- eval: E6
  run_id: r-20260816T110004Z-22587
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ccnc_rang_clause
  verified_at: 2026-08-16T11:08:38Z
  output: |
    CCNC-BASE: origin/main -> 2ebe296
      OK   hai bản chép khớp từng ký tự
    CCNC-CLAUSE: khop 2 ban · 3/3 dau hieu · 0 tu cam · 1 buoc ghi-commit OK
           [đột biến] lệch 1 ký tự ở bản chép SKILL
      OK   MUTANT-CLAUSE-lech bi bat
           [đột biến] chèn từ cấm vào clause
      OK   MUTANT-CLAUSE-tu-cam bi bat
    CCNC [clause]: 0 ĐỎ

- eval: E9
  run_id: r-20260816T110004Z-22587
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ccnc_so_ca
  verified_at: 2026-08-16T11:08:38Z
  output: |
    CCNC-BASE: origin/main -> 2ebe296
    CCNC-SO-CA: scripts 704 == ky vong 704 OK
      OK   scripts dung dang thuc
    CCNC-SO-CA: plugins 145 == ky vong 145 OK
      OK   plugins dung dang thuc
    CCNC-SO-CA: phan ra 19/19 ca co PASS OK
      OK   phân rã khớp log
    CCNC-SO-CA: base scripts 686 == truoc 686 OK
      OK   đối chứng dương khớp
    CCNC [so-ca]: 0 ĐỎ

- eval: E10
  run_id: r-20260816T110004Z-22587
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ccnc_rang_adr
  verified_at: 2026-08-16T11:08:38Z
  output: |
    CCNC-BASE: origin/main -> 2ebe296
      OK   ban do khop ho so xuong
    CCNC-ADR: 3/3 dieu kien · map khop OK
           [đột biến] xoá nhãn «Trade-off thật» khỏi bản sao
      OK   MUTANT-ADR bi bat (chinh phep dem)
    CCNC [adr]: 0 ĐỎ

- eval: E11
  run_id: r-20260816T110004Z-22587
  exit_code: 0
  baseline: red
  verifier: config:executors.script.ccnc_rang_chieu_ghi
  verified_at: 2026-08-16T11:08:38Z
  output: |
    CCNC-BASE: origin/main -> 2ebe296
    CCNC-CHIEU-GHI: 1 NOTE moi · 0 NOTE cu OK
      OK   chiều ghi nói đúng lúc, im đúng lúc
    CCNC [chieu-ghi]: 0 ĐỎ

- eval: E7
  run_id: r-20260816T110004Z-22587
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-16T11:08:38Z
  output: |
      PASS: P24 acceptance-init phat mac dinh nghiem (recheck strict; KHONG con khoa chu-ky cu)

- eval: E8
  judged_by: giám khảo phiên sạch (subagent, mù với diff)
  verdict: UNCERTAIN
  human_override: Manh Phan 2026-08-16
  required_evidence:
    - hạng T3 đòi MẮT NGƯỜI trên mọi mục judgment — hội đồng chấm PASS 4/4 nhưng verdict cuối thuộc về người ký, không thuộc về máy
  rationale: 4/4 ca đạt. Ca 1 hiển thị lại danh tính kèm nguồn suy rồi ghi + đặt status + commit MỘT lượt, không hỏi phút, không đòi người tự gõ git. Ca 2 và ca 4 để trống trọn phần người quyết và nói rõ mình chờ; ca 4 nêu đúng ranh giới «yêu cầu đến từ điều phối phiên, không phải owner». Ca 3 dẫn ADR 0012, trỏ trách nhiệm về forge, không đụng lịch sử git. Giám khảo TỰ LOẠI hai ô không có neo trong thân lệnh (câu-đóng-có-ngả-khuyên ở ca 2; lý do «ai gõ chuỗi» ở ca 3) — đúng luật neo mà AC-8 đặt ra.
  verified_at: 2026-08-16T11:08:38Z

## Iterations

- Round 1: 10/10 eval máy đạt; E8 (judgment) hội đồng PASS 4/4 nhưng để UNCERTAIN chờ mắt người — hạng T3 đòi người chấm từng mục judgment. Không REJECT.

## Analyst

Ba chỗ CHÍNH BỘ RĂNG tự bắt trong lượt dựng, đã sửa vật rồi chạy lại: (1) chân
quét nghi-lễ bắt một dòng còn sót ở vòng lặp tính năng («repo bật
require_human_commit thì pre-merge bắt buộc tách như vậy») — việc sửa văn ở
bước 3 đã bỏ sót nó; (2) chân so-ca đỏ vì bảng phân rã chứa một dòng KHÔNG
phải mã ca thật (`S-README-GUIDE`) — bảng phải là danh sách mã ca có thật,
ghi chú phải nằm ở văn xuôi; (3) thân lệnh `/signoff` sau khi sửa còn một câu
cụt và một dòng «Never» mâu thuẫn với chính ADR mới (cấm gộp chữ ký vào commit
bằng chứng) — sửa cùng lượt, thay bằng «không ghi human_signoff khi người chưa
phát ngôn».

Hai lưới của kit khoá nhau đúng như tiền lệ đợt 2: DV5 (diff hai file cưỡng
chế CHỈ được THÊM) và mục tiêu hồ sơ này (gỡ luật cũ). Đường thoát dùng lại
tiền lệ `LEDGER_EXPECTED`: miễn trừ ĐÍCH DANH 73 dòng nguyên văn trong
`tests/scripts/additive-only.test.mjs`, kèm ghi chú vì sao — không nới thành
mẫu, nên mọi sửa khác trên hai file ấy vẫn ĐỎ.

Số ca `scripts` khai ở Cổng 1 là 691, thi công ra 704; chênh lệch đã khai
tường minh trong hợp đồng (mỗi ca làn V thêm một dòng ghim ĐÚNG THÔNG ĐIỆP;
danh sách thật là V01–V07 chứ không phải V01–V05). Đây là ĐẲNG THỨC đo được,
không phải sàn.

## Known limits

- Vế «provenance ở forge» chỉ đúng nghĩa khi repo nhiều người bật
  require-approval; repo một người thì người bấm merge chính là người chịu
  trách nhiệm. Kit KHÔNG tự chỉnh branch protection của repo nào (Out of
  scope) — ADR 0012 khai điều kiện này tường minh, nhưng không phép đo nào
  canh được nó ở phía repo tiêu thụ.
- Răng hồ sơ neo `origin/main` cho đối chứng dương → sau khi hồ sơ này merge,
  các chân «lưới cũ chặn» sẽ tự tuyên phép đo không sống. Đúng thiết kế; lưới
  thường trực là H01–H07 + V01–V07 trong `tests/scripts`.
- Lớp HÀNH VI chấm trên 4 ca của một phiên sạch, không phải trên một vòng ký
  thật.

## Variance

none

## Out of contract

(rỗng)
