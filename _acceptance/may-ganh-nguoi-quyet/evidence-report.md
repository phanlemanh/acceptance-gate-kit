---
schema_version: 2
feature_slug: may-ganh-nguoi-quyet
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: cf9ef6427a0d03296e2b89f57d2ee21ce38caa43
human_signoff:
---

# Evidence Report: may-ganh-nguoi-quyet

Vòng chấm 3 — 6/6 eval máy PASS, 1 hạng mục cần mắt người (E7). Hai vòng
verify trước ĐỎ và đã sửa VẬT chứ không sửa đáp án; xem `## Iterations`.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | judgment | UNCERTAIN |

## Evidence

- eval: E1
  run_id: may-ganh-nguoi-quyet-E1-1786440944
  exit_code: 0
  baseline: red
  verifier: config:executors.script.p194_rang
  verified_at: 2026-08-11
  output: |
    P194-RANG OK (PASS: P194 + 3 dong dem + 15 chieu do chay that,
    tong ket khop so dem)
    MAY-GANH-GRAMMAR: 16 neo du
  ghi_chu: |
    Executor là script RĂNG, không phải mã thoát của suite: nó chạy suite
    plugins rồi ghim đúng dòng của case P194 trong stdout. Vì sao đổi —
    gap-probe P0: `config:executors.test.plugins` cho verdict bằng exitCode
    của TRỌN suite, mà suite trên `origin/main` cũng exit 0, nên E1–E4 vốn
    không phân biệt được cây cũ với cây mới. Baseline: red — trên
    `origin/main` script này không tồn tại và case P194 cũng không, mọi neo
    mới 0-hit; chiều đỏ chạy thật: đổi tên case trong bản sao → suite XANH
    mà răng ĐỎ đích danh «khong thay dong 'PASS: P194'».
    16 neo dương gồm 3 neo mới của vòng này (đọc-không-bị-chặn · CẠN ·
    ngày-ở-Ký); 3 neo ÂM đòi chuỗi phải VẮNG.

- eval: E2
  run_id: may-ganh-nguoi-quyet-E2-1786440944
  exit_code: 0
  baseline: red
  verifier: config:executors.script.p194_rang
  verified_at: 2026-08-11
  output: |
    MAY-GANH-BODY: approve du, signoff du, start du
    MUT-2 DO dich danh: site thieu khuon voi-danh-tinh: commands/approve.md
    MUT-9 DO dich danh: bac thang khai 2 lan (phai dung 1): commands/approve.md
    MUT-11 DO dung: thu tu bac thang sai (git config phai truoc approvers)
  ghi_chu: |
    15 chiều đỏ CHẠY THẬT, mỗi mutant in xác-nhận-đột-biến và đi qua CHÍNH
    checker thật; số in ra SUY từ danh sách mutant, và răng còn đối chiếu
    số đó với số dòng `MUT-n` đếm được trong stdout (chặn lớp
    tổng-kết-không-kèm-số-ca). Ba chiều đỏ đáng kể của vòng này:
    (a) MUT-9 chép bậc thang lần hai → đỏ; đây là lớp mà hội đồng E7 vòng 6
        phát hiện: mỗi thân từng có HAI bản chép (đầu file + bước ghi) nên
        mọi lần vá chỉ trúng một bản. Lời giải không phải vá tiếp mà đổi
        khuôn: khai MỘT lần, chỗ kia trỏ về, và thước đếm số lần khai == 1.
    (b) MUT-11 hoán vị bậc thang về đúng phương án d-20008 đã LOẠI → đỏ.
    (c) MUT-10/MUT-15 chèn LẠI câu hỏi phút → đỏ (neo ÂM).
    Baseline: red — mọi needle 0-hit trên origin/main.

- eval: E3
  run_id: may-ganh-nguoi-quyet-E3-1786440944
  exit_code: 0
  baseline: red
  verifier: config:executors.script.p194_rang
  verified_at: 2026-08-11
  output: |
    MAY-GANH-COMPAT: truong ghi du, require_human_commit nguyen
    PASS: P192 round-trip the->SLOTS hai huong (4 chieu do)
  ghi_chu: |
    Tương thích cũ đo hai chiều: (i) grammar còn neo «vẫn chạy nguyên» và
    câu kiểu cũ đầy đủ vẫn nhận nguyên nghĩa; (ii) 7 tên trường ghi còn đủ
    trong các thân, MUT-5 đổi `human_signoff` → đỏ đích danh; (iii) P192
    XANH NGUYÊN TRẠNG — thẻ và tầng máy-đọc SLOTS không suy suyển.

- eval: E4
  run_id: may-ganh-nguoi-quyet-E4-1786440944
  exit_code: 0
  baseline: green
  verifier: config:executors.test.plugins
  verified_at: 2026-08-11
  output: |
    PASS: P31 Codex human-gate skills locked from implicit invocation; card stays open
    PASS: P32 Claude gate commands locked from model invocation; card stays open
    PASS: P193 dieu khoan mot-luot-go: 12 site + ban suy ra khop tung ky tu
  ghi_chu: |
    baseline green CÓ CHỦ ĐÍCH: P31/P32/P193 là guard vĩnh viễn của lớp đã
    có chủ (ADR 0002 · điều khoản chip ③) — eval này ghim quan hệ «chip
    không suy suyển chúng», không nhận vơ chiều đỏ của lớp khác. Khoá
    chỉ-người-gõ còn đủ 6/6 cả hai harness, `acceptance-card` vẫn mở.

- eval: E5
  run_id: may-ganh-nguoi-quyet-E5-1786440944
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.no_vat_cam_drift_3b
  verified_at: 2026-08-11
  output: |
    NO-DRIFT: scripts/gate-card.js OK (khong trong commit, khong trong cay lam viec)
    NO-DRIFT: GATE-ONESHOT-SLOTS OK (byte-equal origin/main vs HEAD)
    NO-DRIFT OK (1 diff-check + 6 vat byte-equal so origin/main)
  ghi_chu: |
    Ba lần phá-thử trên bản sao, cả ba ĐỎ đích danh: (1) sửa một dòng SLOTS
    → «GATE-ONESHOT-SLOTS DA DOI»; (2) sửa `gate-card.js` CHƯA COMMIT →
    «NAM TRONG diff» (chân (a) trước đây mù với cây làm việc — gap-probe
    P1, chữa bằng hợp nhất ba hộp commit/chưa-commit/untracked); (3) sửa
    một lệnh không-câu-hỏi → «DA DOI — hop dong khai KHONG dung 3 lenh».
    Baseline n-a: script là vật của chính hồ sơ này, base `origin/main`
    tường minh trong lệnh.

- eval: E6
  run_id: may-ganh-nguoi-quyet-E6-1786440944
  exit_code: 0
  baseline: green
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-11
  output: |
    plugins/ mirror in sync.
  ghi_chu: |
    baseline green có chủ đích (guard vĩnh viễn P30 — mirror == nguồn hai
    phía). Mirror commit cùng lượt với nguồn; bản luật + 3 SKILL Codex
    có-câu-hỏi trong mirror mang cùng văn dạy mới.

- eval: E7
  judged_by: judge panel (fresh context) — 4 vòng, mỗi vòng một agent context sạch đóng vai NGƯỜI GÕ, chỉ được đọc thân lệnh
  verdict: UNCERTAIN
  baseline: n-a
  rationale: |
    Vòng chót (8 ca × 4 thân, cả hai harness) kết luận: hành vi NHẤT QUÁN ở
    cả 8 ca giữa hai bản song sinh, bậc thang khai đúng MỘT lần mỗi file,
    không mâu thuẫn nội tại (kể cả khối «Never»), không tàn dư luật cũ.
    Ba vòng trước ĐỎ và đã sửa THÂN LỆNH chứ không sửa đáp án:
    - vòng 1-2 (2 agent độc lập cùng chỉ một chỗ): mô tả «approvers khi
      config trống» làm nhánh cảnh-báo-lệch thành BẤT KHẢ THI — hai nguồn
      không bao giờ cùng có giá trị để mà lệch. Chữa bằng tách bốn luật
      ĐỌC / CHỌN / CẢNH BÁO / CẠN.
    - vòng 3 (5 finding): tất cả cùng MỘT lớp — mỗi thân chép bậc thang hai
      lần nên mọi lần vá chỉ trúng một bản. Đổi khuôn giải: khai một lần,
      chỗ kia trỏ về + thước đếm số lần khai.
    - vòng 4: 3 lệch câu chữ giữa hai harness → vá cho đúng nghĩa song sinh.
    VÌ SAO UNCERTAIN chứ không PASS: hạng mục hỏi "chỉ dẫn có đủ rõ cho
    NGƯỜI không", mà bên chấm là chính máy đã viết chỉ dẫn — lớp
    doer-tự-chấm. Số liệu trình người quyết, không tự nâng.
  required_evidence:
    - Owner gõ THẬT một câu gộp trần ở cổng kế («duyệt» hoặc «…; Ký» không
      tên/ngày/phút) và nói máy có suy đúng danh tính, có hiển thị lại kèm
      nguồn suy, có thôi hỏi phút không — đây là răng thật của lớp này.
  human_override:

## Analyst

Không có eval ngẫu nhiên. E4 và E6 xanh-trên-cả-hai-cây (green-on-both) —
đó là guard hồi quy CÓ CHỦ ĐÍCH, không phải eval không phân biệt: E4 ghim
khoá ADR 0002 + điều khoản chip ③ không suy suyển, E6 ghim mirror == nguồn.
E1–E3 sau khi đổi sang script răng thì baseline ĐỎ (case P194 và mọi neo
mới không tồn tại trên `origin/main`).

Ba known-limits người ký cần đọc trước khi quyết:
1. **Hành vi LLM thật khi thi hành lệnh không máy-đo được.** Mọi phép đo máy
   đo tài-liệu-dạy và quan-hệ-văn-bản; E7 đo đọc-hiểu tại thời điểm verify,
   không đo mọi phiên tương lai. Răng thật là LẦN GÕ ĐẦU của owner sau ship.
2. **«Xác nhận một chạm» là hành vi phiên chat** — máy-đo chỉ ghim VĂN dạy
   nó; không phép đo nào đếm được số chạm thật.
3. **Neo văn bản đo sự CÓ MẶT của chuỗi, không đo mệnh đề** (gap-probe P2):
   viết «LUÔN hỏi mở; cách hiểu khả dĩ nhất chỉ dùng khi đường cùng» thì cả
   hai neo vẫn có mặt và thước vẫn xanh dù nguyên tắc bị lật ngược. Không có
   vá rẻ bằng grep; đường giảm nhẹ đã làm là cho hội đồng E7 đọc NGHĨA trên
   cả 4 thân, 8 ca.

## Iterations

- Vòng 1 (ced6d21): 6/6 eval máy PASS, E7 ĐỎ — hai vòng judge độc lập cùng
  chỉ ra mâu thuẫn bậc thang. Sửa vật: tách bốn luật ĐỌC/CHỌN/CẢNH BÁO/CẠN.
- Vòng 2: E7 xác nhận lỗ chính đóng, nêu tiếp 5 mục; 4 mục vá (ngày-người-
  khai-thắng · khai-một-phần · câu-gộp-thay-bước-3 · luật hỏi-mở đồng bộ).
  Vòng 3 của hội đồng lộ lớp hai-bản-chép → đổi khuôn giải, không vá tiếp.
- Vòng 3 (cf9ef64): gap-probe context sạch chạy TRONG S4 tìm 11 finding,
  trong đó **2 lỗ P0 của chính bộ thước** — (i) E1–E4 treo trên mã thoát
  trọn suite, xanh cả trên `origin/main`; (ii) không có neo ÂM nào trong khi
  lời hứa lõi là GỠ một câu hỏi. Cả hai sửa THƯỚC, không hạ đáp án. Baseline
  hai chiều sau đó lộ tiếp lối thứ hai: **skill acceptance (cả hai harness)
  vẫn hỏi phút** cho đúng trường ghi mà 6 lệnh vừa thôi hỏi — lớp
  MỌI-LỐI-QUA-CHỐT; đã sửa + MUT-15. Việc này VƯỢT danh sách vật-giao khai ở
  Cổng 1 → trình owner xác nhận (mục Ngoài hợp đồng).
- Cả bốn suite local chạy trọn sau vòng chót (nếp chip ③): scripts 671 ·
  hooks 54 · plugins toàn bộ · workflows — đều exit 0.
