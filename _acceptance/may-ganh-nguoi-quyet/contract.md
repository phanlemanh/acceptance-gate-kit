---
schema_version: 1
feature: Máy gánh nhận thức, người giữ quyết định — lệnh cổng người tự suy danh tính/ngày/hồ-sơ (hiển thị lại + xác nhận một chạm), thôi hỏi phút, và khi câu người mơ hồ thì khuyến nghị kèm căn cứ thay vì hỏi mở
slug: may-ganh-nguoi-quyet
owner: phanlemanh@gmail.com
risk_tier: T2      # đụng commands/*.md + codex/acceptance-gate/skills/*/SKILL.md + skills/acceptance/references/ + tests/plugins/run-tests.sh — không khớp t1_skip_globs, không khớp t3_paths (không đụng hooks/lib/pre-merge)
surfaces: [cli]
status: approved
approved_by: Manh Phan
approved_at: 2026-08-11
time_human_minutes: {gate1: 0, gate2: 0}   # owner tuyên không đo phút — 0 có chủ đích; chính chip này bỏ hẳn câu hỏi phút
---

# Acceptance Contract: may-ganh-nguoi-quyet

## Context

Chip ③b của kit 2.1 — hồ sơ nối chip ③ (`mot-luot-go-cong-nguoi`, merged PR
#41), điều kiện vào đã đạt. Hai nguyên tắc owner đặt 11/08 tại chính cổng ký
của chip ③ (sổ vấp dòng cú-ký-ba-lượt + finding nguyên văn trong evidence E7
của chip ③), gộp một hồ sơ vì cùng chạm một vật:

1. **Người chỉ khai điều chỉ người biết.** Câu owner gõ tại cổng đang trộn
   QUYẾT ĐỊNH (chỉ người biết: duyệt/sửa, Đạt/Chưa đạt, Ký/Trả) với DANH
   TÍNH và THỜI ĐIỂM (máy biết: tên người ký, ngày, hồ sơ nào, số phút).
   Lời owner nguyên văn (E7 chip ③): «danh tính+ngày là dư — máy phải tự
   suy». Lõi chữ-ký nằm ở HÀNH VI — khoá chỉ-người-gõ (ADR 0002) + commit
   chữ-ký chỉ-trường-người mà git tự ghi author/date — không nằm ở việc
   người phải đánh vần lại tên mình.
2. **Khuyến nghị trước, hỏi mở là đường cùng.** Luật (d) chip ③ («phần
   không nhận ra → hỏi lại đúng phần đó») thi hành bằng câu hỏi mở làm chữ
   ký tốn ba lượt hỏi-đáp; owner phát tín hiệu gate-fatigue ngay tại cổng
   của chip giảm-phức-tạp. Nâng thành: phần mơ hồ → máy NÊU CÁCH HIỂU KHẢ
   DĨ NHẤT + CĂN CỨ trích từ hồ sơ + xác nhận một chạm; chỉ hỏi mở khi
   thật sự không có cách hiểu trội hơn hoặc hiểu-sai-thì-đắt-khó-đảo.

Chip làm cổng NHẸ HƠN cho NGƯỜI mà không mở một milimet nào cho máy: khoá
chỉ-người-gõ nguyên trạng cả hai harness; máy được gánh SUY NGHĨ (suy danh
tính, nêu cách hiểu, dẫn căn cứ) nhưng KHÔNG BAO GIỜ phát ngôn hộ QUYẾT
ĐỊNH — ranh giới này phải thành văn trong khối luật (xem AC-1f).

Vật được giao là VĂN CHỈ DẪN: khối `GATE-ONESHOT-GRAMMAR` trong bản luật
ngôn ngữ mặt người + 6 thân lệnh có-câu-hỏi (approve/signoff/start, hai
harness) + mirror. `scripts/gate-card.js` không đổi một byte (card ĐÃ render
chỗ trống chỉ-khi-có-mục-thật — máy kiểm 11/08: Ngoài-N theo findings, mã
eval theo decisions, cắt/hoãn theo Out-of-scope, Treo theo quyết định
treo). `GATE-ONESHOT-SLOTS`/`-CLAUSE`/`-SITES` cũng không đổi byte nào —
tầng máy-đọc của chip ③ đứng nguyên, chip này chỉ đổi tầng dạy-model.

Source input: đề bài ③b owner duyệt (task_228e80cd) + sổ vấp
2026-08-11 dòng 80 (cú-ký-ba-lượt) + evidence E7 chip ③ (lời owner nguyên
văn) + memory `nguoi-chi-khai-dieu-chi-nguoi-biet`.

## Criteria

- AC-1 (hai-nguyên-tắc-vào-ngữ-pháp): Given bản luật ngôn ngữ mặt người
  (`skills/acceptance/references/human-facing-language.md`), When đọc khối
  `GATE-ONESHOT-GRAMMAR`, Then nó chứa các luật mới sau, mỗi luật nhận diện
  bằng chuỗi neo máy-đo:
  - (a) **tự-suy danh tính**: tên người duyệt/ký và ngày là điều máy biết —
    vắng trong câu gộp thì máy suy theo BỐN LUẬT TÁCH BẠCH (viết rời nhau,
    vì gộp một câu là cách hai mệnh đề đối lập lọt qua — hội đồng E7 bắt ở
    S4-r1): **ĐỌC** luôn đọc CẢ `git config user.name` LẪN
    `signoff.approvers`, không điều kiện nào chặn việc đọc; **CHỌN** giá trị
    ở nấc cao nhất còn tên (câu người gõ → cờ `--as "<tên>"` → `git config
    user.name` → `signoff.approvers` khi danh sách đúng một tên) — chữ ký
    thuộc NGƯỜI ĐANG GÕ, thực-tại-máy trước kỳ-vọng-hồ-sơ; **CẢNH BÁO** khi
    tên sắp ghi không có trong `signoff.approvers` (áp cả tên người tự gõ),
    không chặn ghi và không đẻ lượt hỏi; **CẠN** khi hết nấc (mọi nấc trống,
    hoặc chỉ còn danh sách nhiều tên) → HỎI tên đúng một câu, có danh sách
    thì liệt ra để chọn một chạm — đây là nhánh DUY NHẤT trong chip này
    THÊM một lượt hỏi, và nó chỉ chạy khi máy thật sự không biết.
    Suy xong HIỂN THỊ LẠI theo khuôn «với danh tính: <tên>
    <ngày> (từ <nguồn suy>) — Enter xác nhận» TRƯỚC khi ghi — khuôn PHẢI in
    cả NGUỒN SUY (nấc nào của bậc thang đã bắn), vì hiển thị tên mà giấu
    xuất xứ là sai-tên-âm-thầm trên máy dùng chung không ai thấy (yêu cầu
    phiên B tại MỐC 1); trả lời ngắn khẳng định (Enter/ok/đúng) là xác
    nhận, trả lời khác là sửa danh tính. Người đã khai tường minh tên+ngày
    trong câu gộp → ghi thẳng, không hỏi xác nhận. Neo: «với danh tính:» ·
    «(từ <nguồn suy>)» · «Enter xác nhận» · «git config user.name».
  - (b) **ngày máy ghi**: ngày là ngày lệnh chạy ở cả hai cổng («Ký» vắng
    ngày → hôm nay); đã có cho Cổng 1 từ chip ③, nay phủ cả «Ký».
  - (c) **thôi hỏi phút**: lệnh KHÔNG hỏi số phút; người tự khai `phút
    <số>` vẫn nhận nguyên nghĩa; vắng → ghi 0 vào `time_human_minutes`
    (trường giữ nguyên cho schema cũ). Neo: «không hỏi phút» · «ghi 0».
  - (d) **hồ-sơ tự suy**: vắng slug mà đúng MỘT ứng viên đang chờ đúng cổng
    đó → dùng nó và HIỂN THỊ LẠI tên hồ sơ trong cùng lượt trả lời; nhiều
    ứng viên → bảng chọn như cũ. Neo: «đúng MỘT ứng viên».
  - (e) **khuyến-nghị-trước** (nâng luật hỏi-lại của chip ③): phần câu mơ
    hồ hoặc không nhận ra → máy nêu CÁCH HIỂU KHẢ DĨ NHẤT kèm CĂN CỨ trích
    từ hồ sơ (khối Out of scope đã duyệt, sổ quyết định, trạng thái hồ sơ)
    và xin xác nhận một chạm; CHỈ hỏi mở khi không có cách hiểu trội hơn
    hoặc hiểu-sai-thì-đắt-khó-đảo. Ca mẫu ghim nguyên văn từ sự cố thật:
    cụm «không cắt» hai nghĩa → đề xuất «đồng ý phạm vi đã khai» kèm căn
    cứ từ khối Out of scope, không hỏi mở. Neo: «cách hiểu khả dĩ nhất» ·
    «hỏi mở» · «không cắt».
  - (f) **ranh giới phát-ngôn-cuối** (nối bất biến chip ②, thành văn): máy
    ĐƯỢC đề xuất cách hiểu + căn cứ + xin một cái gật rẻ; máy KHÔNG BAO
    GIỜ điền sẵn quyết định/verdict/chữ «Ký» thay người — lời chấp thuận
    là PHÁT NGÔN CUỐI của người; Enter-xác-nhận chỉ xác nhận DANH TÍNH sau
    khi người đã tự gõ quyết định. Neo: «PHÁT NGÔN CUỐI».
  - (g) **đổi-thước-có-hợp-đồng** (khuôn TE16c): case P191 thay ĐÚNG HAI
    neo cũ của chip ③ bằng neo mới — «hỏi lại đúng phần đó» → «cách hiểu
    khả dĩ nhất» (luật d nâng cấp) và «follow-up DUY NHẤT» → «Enter xác
    nhận» (luật e thay thế); các neo còn lại + số neo (8) + chiều đỏ của
    P191 giữ nguyên và vẫn CHẠY THẬT trên checker sau đổi. Toàn bộ neo MỚI
    của chip này (khối grammar, liệt ở a–f và AC-3i) đo ở case P194 riêng
    — không nhét vào thước của chip ③. Vì đây là đổi-thước BIẾT TRƯỚC,
    bảng diff nguyên văn hai neo phải nằm trong hồ sơ Cổng 1 (bảng ở Notes
    + một entry sổ quyết định để card Cổng 1 render) cho owner duyệt thước
    mới có mắt ngay từ đầu — lỗi-biết-trước xử tại Cổng 1, không đợi
    Cổng 2 (yêu cầu phiên B tại MỐC 1, khuôn ruler-change chip ②b).
  - (h) **tầng máy-đọc đứng nguyên**: `GATE-ONESHOT-SLOTS`, `-CLAUSE`,
    `-SITES` byte-equal `origin/main` (đo ở AC-5) — nhãn tên/phút vẫn nằm
    trong SLOTS với cờ `extra`, tương thích câu kiểu cũ.
- AC-2 (6 thân lệnh dạy đúng — bên đọc): Given 6 thân lệnh có-câu-hỏi
  (`commands/{approve,signoff,start}.md` +
  `codex/acceptance-gate/skills/{approve,signoff,start}/SKILL.md`), When
  chạy phép đo mới (case P194), Then quan hệ per-site trên TỪNG bản:
  - approve + signoff (4 bản): chứa khuôn «với danh tính:» + «Enter xác
    nhận»; luật thôi-hỏi-phút («ghi 0»); cờ `--as`; luật hồ-sơ-tự-suy
    hiển-thị-lại («đúng MỘT ứng viên»);
  - signoff (2 bản): ca mẫu «không cắt» kèm đề xuất + căn cứ («cách hiểu
    khả dĩ nhất» hoặc con trỏ luật (e));
  - approve + signoff + start (6 bản): còn nguyên con trỏ
    `GATE-ONESHOT-GRAMMAR` và (đo ở P193 nguyên trạng) điều khoản
    `GATE-ONESHOT-CLAUSE` nguyên văn;
  - start (2 bản): còn nguyên dạng chọn-trước `slug`; thêm hiển-thị-lại
    nhóm đã khớp khi bàn giao thẳng.
  Chiều đỏ CHẠY THẬT — 14 chiều, số in ra SUY từ danh sách mutant (in
  literal thì thêm/bớt mutant mà dòng tổng kết vẫn khai số cũ): gỡ khuôn
  «với danh tính:» · gỡ needle `--as` · gỡ ca mẫu «không cắt» · gỡ phần
  nguồn-suy «(từ <nguồn suy>)» · gỡ neo grammar · gỡ trường ghi · gỡ luật
  ĐỌC · gỡ nhánh CẠN · CHÉP bậc thang lần hai (lớp hai-bản-chép-trôi-khỏi-
  nhau) · CHÈN LẠI câu hỏi phút cũ (neo ÂM) · HOÁN VỊ bậc thang về phương
  án đã loại · gỡ nhánh CẢNH BÁO · gỡ hiển-thị-lại của thân start · gỡ neo
  ngày-ở-Ký — mỗi chiều đỏ đích danh file/neo, mutant in xác-nhận-đột-biến
  và đi qua chính checker thật; đối chứng dương: cây thật XANH trước mọi
  đột biến.
  Ràng buộc executor (gap-probe P0): E1–E3 KHÔNG được trỏ thẳng mã thoát
  của suite — suite xanh cả trên `origin/main`, nên mã thoát không phân
  biệt được cây cũ với cây mới. Chúng chạy qua script RĂNG ghim đúng dòng
  của case (vắng «PASS: P194», thiếu dòng đếm, số chiều đỏ < 9, hay tổng
  kết khai lệch số mutant → ĐỎ).
- AC-3 (tương thích cũ + đổi-AI-ĐIỀN-không-đổi-GHI-GÌ): Given cùng bản
  luật + 6 thân lệnh, When đọc đường câu-kiểu-cũ, Then: (i) câu gộp đầy đủ
  kiểu chip ③ («duyệt: <tên>, phút <số>» · «Ký: <tên> <ngày>, phút <số>»)
  vẫn chạy nguyên nghĩa — grammar nói tường minh điều này (neo: «vẫn chạy
  nguyên»); (ii) mọi trường ghi giữ tên và VẪN ĐƯỢC GHI: `approved_by` /
  `approved_at` / `time_human_minutes.gate1` · `human_override` /
  `human_signoff` / `status` / `time_human_minutes.gate2`; nghi thức
  `require_human_commit` + commit chữ-ký-riêng nguyên văn trong thân
  signoff; (iii) P192 round-trip card→SLOTS xanh NGUYÊN TRẠNG trên SLOTS
  không đổi — chứng minh card và tầng máy-đọc không suy suyển.
- AC-4 (khoá nguyên trạng — ADR 0002): Given diff của chip này, When chạy
  suite plugins, Then P31/P32 XANH nguyên trạng (6 lệnh Claude còn
  `disable-model-invocation: true`, 6 skill Codex còn
  `allow_implicit_invocation: false`, `acceptance-card` vẫn mở) và P193
  XANH nguyên trạng (12 bản chép + 6 bản suy ra khớp từng ký tự — chip này
  không chạm điều khoản). Như chip ③: P31/P32/P193 là thước ĐÃ CÓ CHỦ với
  chiều đỏ riêng — chip này chỉ ghim quan hệ «không suy suyển», không nhận
  vơ mutant của lớp khác.
- AC-5 (không-trôi-vật-cấm + đối chứng dương toàn cục): Given cây thật,
  When chạy script `no-vat-cam-drift.sh` của hồ sơ này so BASE TƯỜNG MINH
  `origin/main` và chạy trọn suite plugins, Then: (a) diff name-only KHÔNG
  chứa `scripts/gate-card.js` — chân này hợp nhất BA hộp (commit trên
  nhánh · sửa chưa commit · file chưa theo dõi), vì `BASE...HEAD` một mình
  mù với cây làm việc; (a2) SÁU lệnh không-câu-hỏi (init/status/report hai
  harness) byte-equal base — phạm vi khai KHÔNG đụng chúng mà P193 chỉ
  canh đoạn điều khoản; (b) SÁU khối rút qua marker byte-equal base: `YOUR-MOVE-BLOCK-TEMPLATE`, `GATE-INVITE-CLAUSE`,
  `GATE-INVITE-SITES` (vật chip ②/②b) + `GATE-ONESHOT-SLOTS`,
  `GATE-ONESHOT-CLAUSE`, `GATE-ONESHOT-SITES` (tầng máy-đọc chip ③); (c)
  suite plugins exit 0, dòng tổng kết case mới KÈM SỐ chiều đỏ đã chạy;
  khai sinh phép đo theo MEASURE-BIRTH: phá-thử một lần trên bản sao cho
  từng phép đo mới, thông-điệp-ghim, đối-chứng-dương trên cùng fixture.
- AC-6 (mirror): Given nguồn đã sửa, When chạy `sync-plugin-packages.sh`
  rồi `--check`, Then P30 xanh — bản luật + 3 SKILL Codex trong mirror
  mang cùng khối grammar mới.
- AC-7 (judgment — người-gõ context tươi): Given một agent context SẠCH
  được đưa CHỈ thân lệnh (inputs: `commands/approve.md`,
  `commands/signoff.md` — đúng vật hội đồng đọc, luật W-G8), When đóng vai
  owner, Then trả lời khớp bảng đáp án viết trước cho BỐN ca:
  - (ca 1 — trần) `/approve` với câu gộp «duyệt» trần: máy suy tên theo
    bậc (`--as` vắng → `git config user.name`; config trống →
    approvers-duy-nhất), hiển thị «với danh tính: … (từ <nguồn suy>) —
    Enter xác nhận», `approved_at` = hôm nay, `time_human_minutes.gate1`
    = 0, KHÔNG hỏi thêm câu nào khác;
  - (ca 2 — trần) `/signoff` với «…; Ký» không tên/ngày/phút: suy tên+ngày
    hôm nay, hiển thị xác nhận danh tính, phút ghi 0, nghi thức commit
    chữ-ký-riêng không đổi;
  - (ca 3 — mơ hồ) câu chứa «không cắt»: máy đề xuất cách hiểu khả dĩ
    nhất KÈM căn cứ trích từ hồ sơ + xin xác nhận một chạm; KHÔNG hỏi mở,
    KHÔNG tự quyết thay người;
  - (ca 4 — kiểu cũ) «duyệt: Manh Phan, phút 3»: ghi thẳng đúng các giá
    trị người khai, không hỏi xác nhận thêm.
  Trả lời lệch bảng đáp án → REJECT của vòng verify, sửa THÂN LỆNH chứ
  không sửa đáp án (hạ-thước bị cấm).

## Coverage

Ma trận viết-trước 2 trục. Trục vật-giao: ngữ-pháp-hai-nguyên-tắc (AC-1,
6 luật a–f + đổi-thước g + tầng-máy-đọc h) · 6-thân-lệnh-dạy-đúng (AC-2,
per-site) · tương-thích-cũ + trường-ghi-nguyên (AC-3) · khoá + điều khoản
không suy suyển (AC-4) · không-trôi-vật-cấm sáu khối + gate-card.js (AC-5)
· mirror (AC-6) · hành-vi-đọc-hiểu của model thi hành (AC-7, judgment 4
ca). Trục khai sinh phép đo: đối-chứng-dương (AC-2/AC-5) · phá-vật-thật
(AC-2 ba chiều; P191 sau đổi neo giữ chiều đỏ chạy thật) · thông-điệp-ghim
(AC-2 đích danh file). Thước "đủ": mỗi phép đo mới có ít nhất một chiều đỏ
CHẠY THẬT + đối chứng dương trên cùng fixture; hai neo P191 bị thay phải
liệt kê đích danh trong hợp đồng (AC-1g) — đổi thước không hợp đồng là
hạ thước. Lỗ nhìn-thấy-mà-không-đo-được khai CÓ Ý THỨC ở known-limits.

## Out of scope

- KHÔNG đổi một byte: `scripts/gate-card.js` (bên viết câu mẫu — card đã
  render chỗ trống chỉ-khi-có-mục-thật), khuôn `YOUR-MOVE-BLOCK-TEMPLATE`,
  câu `GATE-INVITE-CLAUSE`, manifest `GATE-INVITE-SITES`, và TOÀN BỘ tầng
  máy-đọc chip ③: `GATE-ONESHOT-SLOTS` / `-CLAUSE` / `-SITES`. Buộc phải
  đụng → DỪNG, báo phiên B.
- KHÔNG đụng 3 lệnh không-câu-hỏi (`acceptance-init`/`-status`/`-report`)
  ngoài bản chép điều khoản đã có — chúng không có câu hỏi danh tính/phút
  để bỏ. Xem lại khi: có vấp thật owner vướng câu hỏi ở ba lệnh này.
- KHÔNG đổi nghi thức `require_human_commit`, tên/nghĩa mọi trường ghi
  (`approved_by`, `human_signoff`, `time_human_minutes`, `human_override`…),
  thang verdict, hành vi chốt write-time — chip đổi AI ĐIỀN, không đổi
  GHI GÌ. Trường `time_human_minutes` giữ nguyên trong schema, chỉ thôi
  HỎI (nếp lời-người-dài → `human_evidence` body + override một dòng cũng
  giữ nguyên).
- KHÔNG thêm parser bằng code cho câu gộp hay cho bậc suy danh tính —
  thân lệnh là prompt cho model đọc (nối d-10004 chip ③). Xem lại khi: có
  vấp thật model suy sai danh tính ở repo tiêu thụ.
- KHÔNG mở khoá model-invocation, không đổi `acceptance-card` — máy vẫn
  không gọi được 6 thao tác cổng; Enter-xác-nhận không phải chữ ký, chữ
  ký vẫn là hành vi người gõ trong phiên + commit chỉ-trường-người.

## Notes

- Mobile backend target: n/a (kit CLI, không surface mobile).
- **Bảng đổi-thước P191 (AC-1g — trình tại Cổng 1, nguyên văn từng ký tự):**

  | Neo P191 cũ (chip ③) | Neo P191 mới (chip ③b) | Vì sao |
  |---|---|---|
  | `hỏi lại đúng phần đó` | `cách hiểu khả dĩ nhất` | luật (d) nâng: hỏi-mở → khuyến-nghị-kèm-căn-cứ |
  | `follow-up DUY NHẤT` | `Enter xác nhận` | luật (e) thay: hỏi tên/phút → tự suy + xác nhận một chạm |

  Sáu neo còn lại + số neo (8) + mutant GIỮ-NGUYÊN-VĂN của P191 không đổi.
- **known-limits (khai CÓ Ý THỨC, người ký đọc trước khi duyệt):** hành vi
  LLM THẬT khi thi hành — model suy danh tính đúng bậc, đề xuất cách hiểu
  đúng căn cứ — KHÔNG máy-đo được trong chip này: AC-1..6 đo tài-liệu-dạy
  và quan-hệ-văn-bản; AC-7 đo đọc-hiểu một lần lúc verify. Răng thật là
  LẦN GÕ ĐẦU của owner sau khi ship — khai trên card Cổng 2; lệnh suy sai
  hoặc khuyến nghị ẩu → ghi sổ vấp, mở chip vá theo lớp (đường revisit
  parser-bằng-code đã khai ở Out of scope).
- **known-limits 2:** «xác nhận một chạm» là hành vi phiên chat — máy-đo
  chỉ ghim VĂN dạy nó; không phép đo nào đếm được số chạm thật của owner.
  Cùng lớp known-limits 1.
- **Quyết định thiết kế cần owner thấy ở Cổng 1** (mỗi mục chọn A, loại B):
  - Bậc nguồn suy tên (đã đổi theo soát phiên B, d-20008): (A — chọn) câu
    gõ → `--as` → `git config user.name` → `signoff.approvers` khi config
    trống; lệch nhau → cảnh báo nhẹ nêu cả hai. Căn cứ: chữ ký thuộc
    NGƯỜI ĐANG GÕ — git config là thực-tại-máy, approvers là
    kỳ-vọng-hồ-sơ; đội dùng chung mà approvers-trước thì máy mặc định ký
    tên lead trong khi người gõ là teammate. (B — loại) approvers trước
    git config — sai đúng ca phổ biến nhất khi kit xuống đội. (C — loại)
    chỉ git config — mất lưới khi config trống; `--as` chữa ca máy chung.
  - Xác nhận: (A — chọn) chỉ khi MÁY SUY mới hiển thị lại + Enter; người
    khai tường minh → ghi thẳng; (B — loại) luôn bắt xác nhận — phạt
    người đã gõ đủ, đi ngược một-lượt-gõ.
  - Thước: (A — chọn) case P194 mới riêng cho ③b + thay đúng 2 neo trong
    P191 (khai ở AC-1g); (B — loại) nhét hết vào P191 — trộn chủ thước
    hai hồ sơ, mutant hai lớp nuốt lẫn nhau.
