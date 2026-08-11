---
schema_version: 2
feature_slug: mot-luot-go-cong-nguoi
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 23a04f5be74cbdc6235ad14ae67d4ce16b404cf1
verified_at: 2026-08-11
human_signoff: Manh Phan 2026-08-11
---

# Evidence Report: mot-luot-go-cong-nguoi

Vòng chấm 1 — 6/6 eval máy PASS, 1 hạng mục cần mắt người (E7). Mọi eval máy
ghim ĐÍCH DANH dòng trong stdout suite (không chỉ exit 0); mọi chiều đỏ CHẠY
THẬT qua chính checker thật và in xác-nhận-đột-biến. Nếp chip ②b: baseline
A/B chạy trên worktree `origin/main` (d6d648b) trước khi tin màu xanh.

## Per-eval

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | judgment | UNCERTAIN (người override → Đạt) |

## Evidence

- eval: E1
  run_id: mot-luot-go-cong-nguoi-E1-1786421926
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-11
  baseline: red
  output: |
    P191-CHECK OK: 8 dong SLOTS, 8 neo luat du
         MUTANT-P191: da go neo GIU NGUYEN VAN khoi ban sao ban luat
         mutant P191 DO dung thong diep (thieu luat giu-nguyen-van)
      PASS: P191 ngu phap cau gop GATE-ONESHOT (8 neo, 1 chieu do chay that)
  ghi_chu: |
    baseline red — trên worktree origin/main suite XANH trọn nhưng "PASS: P191"
    và mọi chuỗi của case này 0-hit (case chưa tồn tại), nên eval phân biệt
    được bản-vá với bản-hiện-tại. Số neo in ra SUY từ chính mảng anchors
    (không ghim literal): bản đầu in "7 neo" trong khi mảng đã 8 — đúng lớp
    tổng-kết-không-kèm-số-thật, đã sửa trước khi chốt.

- eval: E2
  run_id: mot-luot-go-cong-nguoi-E2-1786421926
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-11
  baseline: red
  output: |
    ONESHOT-RT: g1=1 g2=5 nhan khop du
    ONESHOT-RT-NGUOC: moi dong SLOTS co fixture render
         MUTANT-A: da go dong 'g2 Treo' khoi ban sao SLOTS
         MUTANT-A DO dung — nhan the day ma ngu phap khong khai: Treo
         MUTANT-B: da tiem nhan 'lạ-oneshot' vao dong Tra-loi-mau cua the g2
         MUTANT-B DO dung — nhan la ngoai ngu phap: lạ-oneshot
         MUTANT-C: da go dong 'g2 Ngoài-<số>' khoi ban sao SLOTS
         SANITY-KHONG-NUOT: Ngoai-1 khong chui qua lop ma-eval
         MUTANT-H: da them dong nhan chet vao ban sao SLOTS
         MUTANT-H DO dung — nhan SLOTS khong fixture nao render
      PASS: P192 round-trip the->SLOTS hai huong (4 chieu do: go-nhan, tiem-nhan-la, khong-nuot-lop, nhan-chet)
  ghi_chu: |
    baseline red — ONESHOT-RT / SANITY-KHONG-NUOT / MUTANT-A..H đều 0-hit trên
    origin/main. Fixture DO CODE SINH trong chính lần chạy (vca_scenario
    gate1-draft + gate2-4loai), thẻ render bằng scripts/gate-card.js THẬT cả
    hai gate. Đối chứng dương xanh trước cả 4 đột biến, trên CÙNG fixture.

- eval: E3
  run_id: mot-luot-go-cong-nguoi-E3-1786421926
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-11
  baseline: red
  output: |
    ONESHOT-BODY: approve g1 du, signoff g2 du, start slug OK
    ONESHOT-SITES: 12 nguon (+6 suy ra)
    MUTANT-D: da xoa so ban khoi dong manifest commands/approve.md
         MUTANT-D DO dung: site thieu so ban (fail-loud, khong default)
    MUTANT-E: da mangle 1 ky tu clause trong ban sao commands/signoff.md
         MUTANT-E DO dich danh file: commands/signoff.md @1115
    MUTANT-F: da go needle --repo khoi ban sao commands/acceptance-status.md
         MUTANT-F DO dich danh: site thieu needle --repo: commands/acceptance-status.md
    MUTANT-G: da xoa nhan Treo khoi ban sao commands/signoff.md
         MUTANT-G DO dung: than signoff thieu nhan: Treo
      PASS: P193 dieu khoan mot-luot-go: 12 site + ban suy ra khop tung ky tu + quan he per-site (E3/E4 mot-luot-go)
  ghi_chu: |
    baseline red — trên origin/main `--repo` 0-hit trong cả 12 site và mọi
    chuỗi ONESHOT-* / MUTANT-D..G chưa tồn tại. Phạm vi bản suy ra SUY TỪ MẶT
    PHẲNG (đuôi đường dẫn) chứ không khai tay, kèm chốt
    `plugins/acceptance-gate/commands` phải KHÔNG tồn tại — giả định
    "commands/ không vào mirror" vỡ thì phép đo kêu thay vì mù.

- eval: E4
  run_id: mot-luot-go-cong-nguoi-E4-1786421926
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-11
  baseline: green
  output: |
      PASS: P31 Codex human-gate skills locked from implicit invocation; card stays open
      PASS: P32 Claude gate commands locked from model invocation; card stays open
  ghi_chu: |
    baseline green CÓ CHỦ ĐÍCH: P31/P32 là guard vĩnh viễn, xanh cả hai phía
    chính là lời hứa "khoá nguyên trạng". ADR 0002 không suy suyển — 6 lệnh
    Claude còn disable-model-invocation, 6 skill Codex còn
    allow_implicit_invocation: false (nguồn + mirror), acceptance-card vẫn mở.
    Hai câu neo của điều khoản (không-mở-đường-máy + kết-khối 👉) do P193
    assert. KHÔNG nhận vơ mutant lock-flip: P31/P32 là assert trực tiếp, thông
    điệp đỏ đã ghim sẵn («lacks policy lock» / «lacks lock»); bản draft đầu
    của hợp đồng trích một mutant KHÔNG TỒN TẠI — gap-probe bắt, lời AC-4 đã
    sửa cho đúng bản chất.

- eval: E5
  run_id: mot-luot-go-cong-nguoi-E5-1786421926
  exit_code: 0
  verifier: config:executors.script.no_oneshot_drift
  verified_at: 2026-08-11
  baseline: n-a
  output: |
    NO-DRIFT: scripts/gate-card.js OK (khong nam trong diff so origin/main)
    NO-DRIFT: YOUR-MOVE-BLOCK-TEMPLATE OK (byte-equal origin/main vs HEAD)
    NO-DRIFT: GATE-INVITE-CLAUSE OK (byte-equal origin/main vs HEAD)
    NO-DRIFT: GATE-INVITE-SITES OK (byte-equal origin/main vs HEAD)
    NO-DRIFT OK (1 diff-check + 3 vat byte-equal so origin/main)
  ghi_chu: |
    baseline n-a — script là vật của chính hồ sơ này, phép so lấy origin/main
    làm base TƯỜNG MINH (không dùng `git diff` trần: sau commit thi công nó
    luôn rỗng → chốt xanh chân không).
    KHAI SINH PHÉP ĐO (chạy tại chỗ, worktree tạm): phá vật thật — thêm 1 byte
    vào scripts/gate-card.js VÀ đổi 1 chữ trong GATE-INVITE-CLAUSE, rồi commit
    — script ĐỎ (exit 1) đích danh 2/3 vật bị chạm, trong khi
    YOUR-MOVE-BLOCK-TEMPLATE và GATE-INVITE-SITES vẫn xanh (phân biệt được,
    không đỏ cả loạt). Trước đó một lượt mutant trả exit 127 (script chưa
    commit nên worktree mới không có) — xử theo luật mutant-phải-chạy-được:
    chép script vào rồi chạy lại, KHÔNG nhận exit 127 làm "đã bắt được".

- eval: E6
  run_id: mot-luot-go-cong-nguoi-E6-1786421926
  exit_code: 0
  verifier: config:executors.script.mirror_sync
  verified_at: 2026-08-11
  baseline: green
  output: |
    plugins/ mirror in sync.
  ghi_chu: |
    baseline green có chủ đích (guard vĩnh viễn P30 — mirror == nguồn hai
    phía). Mirror commit cùng lượt với nguồn. Bản luật trong mirror mang cùng
    khối GATE-ONESHOT-*; 6 SKILL Codex trong mirror mang cùng điều khoản —
    P193 đếm đủ 6 bản suy ra.

- eval: E7
  judged_by: judge panel (fresh context) — 3 vòng, mỗi vòng một agent context sạch đóng vai NGƯỜI GÕ, chỉ được đọc thân lệnh
  verdict: UNCERTAIN
  baseline: n-a
  rationale: |
    Cả 3 vòng agent trả lời KHỚP bảng đáp án viết trước (lệnh gõ một dòng ·
    từng cặp trường ← giá trị · không-được-hỏi-thêm · chỉ tên/phút là
    follow-up · commit chữ-ký-riêng và vì sao · hỏi-lại-đúng-nhãn-thiếu). Ba
    finding về ĐỘ RÕ của chỉ dẫn, cả ba sửa THÂN LỆNH chứ không sửa đáp án
    (luật AC-7 cấm hạ thước):
    - vòng 1: thân lệnh không nói THỨ TỰ gõ (slug / --repo / câu gộp) → thêm
      mục "Cú pháp gõ" vào GRAMMAR + neo đo thứ 8 ở P191 + ví dụ một-lượt-gõ
      đầy đủ trong 6 thân lệnh có câu gộp.
    - vòng 2: các bước in sẵn `--root .` và `pre-merge-check.sh .` ĐÁ NHAU với
      --repo khi người đứng ở thư mục khác → thêm luật đổi-gốc cho MỌI đoạn
      lệnh in ra; nói rõ «Ngoài-<số>»/«cắt/hoãn»/«Treo» không có trường
      frontmatter mà ghi vào sổ quyết định (+ Notes cho known-limits).
    - vòng 3: chính ĐƯỜNG DẪN tới script và mẫu `git add` không có `.` để
      thay → viết rõ `git -C <path>` và cách giải đường dẫn tương đối. Sửa
      này làm P162 ĐỎ (chốt đóng gói Codex bắt chuỗi
      `<path>/scripts/pre-merge-check.sh` như tham chiếu script chưa khai) —
      đã diễn đạt lại thay vì khai một tiền tố giả để làm chốt im.
    VÌ SAO UNCERTAIN chứ không PASS: hạng mục này hỏi "chỉ dẫn có đủ rõ cho
    NGƯỜI không", mà bên chấm là chính máy đã viết chỉ dẫn — đúng lớp
    doer-tự-chấm mà sổ vấp 10/08 đã ghi (agent dựng không được tự khai đạt về
    thứ chỉ mắt người thẩm được). Số liệu trình người quyết, không tự nâng.
  required_evidence:
    - Owner gõ THẬT một câu gộp ở cổng kế (vd «Duyệt Cổng 1, phút 0» dạng mới)
      và nói lệnh có hiểu đúng không — đây là răng thật của lớp này.
  human_evidence: |
    LẦN GÕ THẬT ĐẦU TIÊN của owner bằng ngữ pháp mới — chính là
    required_evidence mà E7 chờ. Lời owner nguyên văn, lượt 1: «E7: Đạt, kèm
    finding: danh tính+ngày là dư — máy phải tự suy; không cắt; Ký: Manh Phan
    2026-08-11». Lượt 2 (sau khi máy hỏi lại đúng một mục): «Cắt/hoãn: đồng ý
    phạm vi đã khai; ③b: xác nhận; Ký: Manh Phan 2026-08-11».
    Ba vết đáng ghi:
    (a) một dòng của owner làm ba việc — thử sản phẩm · phán E7 · ký — và
        lệnh nhận đúng các nhãn «E7» / «cắt/hoãn» / «Ký»;
    (b) cụm «không cắt» đọc được CẢ HAI chiều (đồng ý phần đã cắt / kéo vào),
        nên máy HỎI LẠI ĐÚNG PHẦN ĐÓ thay vì đoán — luật (d) của chính chip
        này chạy đúng ngay tại cổng của nó, không phải trên fixture;
    (c) owner nêu một finding thật về ngữ pháp (tên+ngày dư) → tách hồ sơ ③b,
        KHÔNG sửa trong chip này (sửa-sau-ký bị cấm).
  human_override: Manh Phan 2026-08-11 — Đạt (lời nguyên văn ở human_evidence trên)

## Iterations

- Vòng 1 (23a04f5): 6/6 eval máy PASS, E7 UNCERTAIN. Trong lúc thi công có 4
  lượt sửa nội bộ do chính phép đo/eval bắt: (1) P191 đỏ vì chuỗi neo bị ngắt
  dòng trong bản luật — sửa BẢN LUẬT, không nới needle; (2) dòng tổng kết
  P191 in số neo literal trong khi mảng đã đổi — cho số suy từ mảng; (3) hai
  vòng E7 tìm ra lỗ chỉ-dẫn thật (thứ tự gõ · `.` đá `--repo`); (4) P162 bắt
  tham chiếu script giả trong SKILL Codex.

## Analyst

Không có eval ngẫu nhiên. Hai known-limits đã khai CÓ Ý THỨC trong hợp đồng,
người ký cần đọc trước khi duyệt: (1) hành vi LLM thật khi thi hành lệnh
không máy-đo được trong chip này — AC-7 đo đọc-hiểu một lần lúc verify,
không đo mọi phiên tương lai; răng thật là LẦN GÕ ĐẦU của owner sau khi
ship; (2) đường gộp của `/start` không có dòng «Trả lời mẫu» máy-render nên
chỉ được phủ bằng needle-pin trong ngữ pháp + bản chép, không bằng
round-trip.

## Variance

none

## Re-pin

Chưa có. PR chạm `commands/`, `codex/`, `skills/acceptance/references/`,
`tests/plugins/run-tests.sh` → stale-theo-diff (1.39.2) có thể kéo hồ sơ cũ
khai các path đó vào diện stale; giá một làn re-pin 1-làn-N-chữ-ký đã tính
sẵn (tiền lệ a4f4f89/99d1ea5), chạy sau chữ ký nếu pre-merge đòi.
