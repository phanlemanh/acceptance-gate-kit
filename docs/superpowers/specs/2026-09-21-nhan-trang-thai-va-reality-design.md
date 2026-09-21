# Thiết kế — nhan-trang-thai-va-reality (21/09/2026)

**Hạng:** T3 (chạm `lib/**`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`; đổi
enum trạng thái; thêm thao tác cổng người). **Ý định (đỉnh cố định, nguyên văn ô):** ba hồ sơ ở
`crm` đóng được hoặc chấm được mà không dựng thêm một dòng thước nào; người lái không bị khoá
ngoài thẻ khi bàn đo hỏng. **Nguồn:** `_acceptance/nhan-trang-thai-va-reality/opportunity.md`
(Cổng Đáng ký `build` 21/09) · kế hoạch điều phối §3 · bản định vị Đ1 · Đ2 · Đ3 · Đ7 (mỏng) ·
Đ8 · Đ9 · ADR 0020.

## 1. Bốn mảnh, một câu mỗi mảnh

| Mảnh | Một câu | Đ | AC |
|---|---|---|---|
| **A. Thước thôi phạt vật** | Test của kho là vật; phanh chiều sâu đổi từ *đếm nhát rồi hỏi người* sang *thước của hồ sơ chỉ-đọc trong lượt chấm*. | Đ1, Đ3 | AC-1…AC-4 |
| **B. Thẻ gọi đúng tên cạnh gãy** | BLOCKED vì bàn đo hoặc hệ thống chết đã thử lại thì thẻ mở ô ký kèm tên · ba lối · giá; đỏ vì vật thì khoá như cũ. | Đ2 | AC-5…AC-8 |
| **C. Reality đóng hồ sơ** | Trạng thái thứ bảy `da-cham-boi-thuc-te`, chỉ ghi được qua thao tác cổng người thứ bảy, là trạng thái CUỐI mà mọi bên đọc nhận. | Đ8 | AC-9…AC-11 |
| **D. Ý định và hiệu chuẩn** | Thẻ Cổng 2 trích nguyên văn ý định; hồ sơ mốc có dòng `ĐẠT đã ký → prod đỏ: k / N` mà N = 0 là «vô hiệu». | Đ7 mỏng, Đ9 | AC-12, AC-13 |

## 2. Mảnh A — thước thôi phạt vật

**A1. Phân lớp.** `feature-loop/scripts/lib/phan-loai.mjs` bỏ vế `DO_GLOBS` khỏi `laThuoc`.
Lớp `thuoc` còn đúng: `_acceptance/config.yaml` · dưới `_acceptance/<slug>/`: `evals.yaml`,
mọi thứ trong `rang/`, mọi tệp đuôi script. Tệp khớp `DO_GLOBS` (`tests/**`, `*.spec.*`…) nay
là `vat`. Hằng `DO_GLOBS` VẪN XUẤT KHẨU: `s4-args.mjs` dùng nó cho `fileDoTrongDiff` (làn
review — Đ6, ngoài phạm vi, không chạm) và cho ảnh chụp chỉ-đọc ở A3.

*Vì sao:* khối ĐỊNH VỊ nói chiều đỏ nằm trong lịch sử test của kho; TDD đúng đường mà
`dieu-phoi` bị đếm ba nhát vì `apps/api/test/*.spec.ts`. Hệ quả đo được trên chính vòng này:
dòng `thuoc-vat` của mọi vòng sau đếm test kho vào `vat` — tỉ lệ thước/vật ở các hồ sơ đời
trước KHÔNG so thẳng được với đời sau (khai ở Notes của hợp đồng).

**A2. Gỡ trần.** `s4-args.mjs` bỏ `TRAN_NHAT`, `thongDiepTran`, lối thoát mã 4 và ba lối.
`demThuocVat` vẫn chạy (bộ đếm vẫn là nguồn dòng thẻ) nhưng không còn chặn. Lỗi bộ đếm VẪN
`die` như hôm nay — không để hỏng lặng. SKILL feature-loop: gỡ đoạn «Mã 4 … trần nhát sửa
thước» và câu `/goal` nhắc «chạm trần nhát sửa thước» chỉ còn là ví dụ lối cho người — sửa
ví dụ, ba bản khuôn goal đổi CÙNG lượt (P85 canh). Van `trần thước — ` trong `thuoc-vat.mjs`
(dời mốc sàn) giữ nguyên: sổ đời cũ vẫn đọc được.

**A3. Thước chỉ-đọc trong lượt chấm** — vật-máy-giữ thay cho câu hỏi.
- `feature-loop/scripts/chup-ho-so-da-thong.mjs` thêm hàm `chupThuoc(root, slug, doGlobs)`
  (tái dùng `dauVet`): chụp `_acceptance/config.yaml`, `_acceptance/<slug>/evals.yaml`,
  `_acceptance/<slug>/rang/**`, và mọi tệp `git ls-files` khớp `DO_GLOBS`. So bằng hàm
  `soThuoc(truoc, sau)` CHỈ theo nội dung (băm): «ghi lại, cùng nội dung» KHÔNG là lệch — bộ
  chạy test có quyền chạm mtime, không có quyền đổi byte của thước.
- `s4-args.mjs` chụp NGAY khi sinh args, ghi `.acceptance-runs/<slug>/thuoc-truoc.json`
  (ngoài `_acceptance/`, đúng luật «Where a run writes its artifacts») và đặt vào args
  `thuocChup: { file, digest, n }`.
- `thuoc-vat.mjs --write` — bước SKILL đã bắt chạy ngay sau MỌI lượt Workflow, kể cả BLOCKED —
  đọc `thuoc-truoc.json`, chụp lại, so. Lệch → nối dòng
  `{"kind":"thuoc-lech","ts":…,"round":…,"tep":[{"tep":…,"doi":…}]}` (khuôn marker
  `THUOC-LECH-LINE`, cùng nếp `THUOC-VAT-LINE`) và thoát **5** với thông điệp ghim
  `thuoc-vat: thuoc lech trong luot cham` + từng đường. Không có `thuoc-truoc.json` → không
  dòng, một dòng stderr «không có ảnh chụp thước» (hồ sơ đời cũ, đường đọc-cũ).
- Vì sao không đặt so sánh trong workflow: workflow không có filesystem; bước sau-lượt đã
  là bước SKILL bắt buộc, và răng thật nằm ở thẻ (A4) + lưới trước-merge không cần đổi (hồ sơ
  thước-lệch không có PASS để ký).

**A4. Thẻ đọc «thước lệch».** `gate-card.js` Cổng 2: có dòng `thuoc-lech` có `round` ≥ round
của báo cáo → thẻ KHÔNG ký được, nhãn **thước lệch**, liệt đường tệp, người gỡ = máy chấm
lại lượt mới (thước đã đổi thì lượt cũ chấm bằng thước khác). Không có dòng → thẻ y hôm nay.

## 3. Mảnh B — thẻ gọi đúng tên cạnh gãy

**B1. Phân loại lý do BLOCKED — từ dữ liệu đã ghi, không LLM.** Hàm thuần mới
`lib/nhan-canh-gay.cjs` `phanLoaiBlocked(blocked, runLog, round)` trả mỗi mục một nhãn:
- **không đọc được ở đây** — `reason` mở đầu `exit 97 —` / `exit 127 —` (khuôn
  `INFRA-EXIT-CODES` của `acceptance-verify.js`, rút từ khối marker, không chép chữ),
  hoặc trùng `TOOL_KILL_REASON` (rút từ khối marker của `tool-kill-rule.md`), hoặc là
  `cannotRun` của một lệnh ÁNH XẠ ĐƯỢC tới một eval trong hợp đồng.
- **hệ thống chết** — `reason` là câu cố định engine phát khi agent không trả kết quả
  (`agent bi skip/chet`, rút từ nguồn engine). Lý do classifier/rate-limit do agent tự thuật
  là văn tự do, không rút được từ nguồn → KHÔNG phân loại (giới hạn khai ở Notes hợp đồng).
- **không phân loại được** — mọi thứ khác (args sai, evals khai thiếu…) → giữ khoá như cũ.
«Đã thử lại» = run-log có ≥2 dòng `round-tally` cùng `round` mà verdict BLOCKED và mọi mục
chết đều **hệ thống chết**. Nguồn chữ của mọi nhãn: `CONTEXT.md` mục **Nhãn trạng thái**.

**B2. Ma trận quyết định của thẻ Cổng 2.**

| verdict | nhãn các mục chặn | thẻ |
|---|---|---|
| REJECT | — | khoá, y hôm nay (byte-identical khối non-approvable) |
| BLOCKED | có mục **không phân loại được** | khoá, y hôm nay |
| BLOCKED | hệ thống chết, CHƯA thử lại | khoá; câu việc: «hệ thống chết — máy thử lại một lần» |
| BLOCKED | toàn **không đọc được ở đây**, hoặc hệ thống chết ĐÃ thử lại | **ô ký MỞ** |
| PASS/PENDING | — | y hôm nay |

**Ô ký mở** in, mỗi cạnh gãy một khối: tên nhãn · eval + AC bị mù · ba lối kèm giá —
(a) **ghi hạn chế rồi ship** (giá: AC ấy ship không bằng chứng máy; mở lại khi bàn đo về) ·
(b) **dựng bàn đo rồi chấm lại** (giá: một lượt chấm + công dựng) · (c) **trả lại** (giá:
vòng dừng). Khuyến nghị máy: (a) — không có trọng số ý định (Đ7 đầy đủ ngoài phạm vi) nên
máy KHÔNG phân AC lõi/phụ; mọi cạnh gãy đều là câu hỏi cho người (khó-đảo không nới). Câu
gộp một chạm in `/acceptance-gate:signoff <slug> Mù-1: ghi hạn chế; …; ký hay trả: ___`.
Verdict, bảng per-eval và con số KHÔNG đổi — thẻ chỉ đổi lối ra.

**B3. Ghi và lưới.** `/acceptance-gate:signoff` nhận lối (a) cho từng `Mù-<n>`: ghi một dòng
sổ theo khuôn ở ĐÚNG MỘT khối marker `CANH-GAY-REVISIT-LINE` của `commands/signoff.md`
(bên đọc và ca đo rút cùng khuôn — round-trip), `type: "revisit"` với `decision` mở đầu đúng `không đọc được ở đây — <E> (<AC>)` (hoặc
`hệ thống chết — …`) + `impact` = giá, rồi `human_signoff` như thường. Lưới trước-merge +
`recheck-evidence.cjs --recheck-all` đổi luật `verdict != PASS → VIOLATION` thành: verdict
BLOCKED + `human_signoff` thật + MỌI mục chặn phân loại được VÀ có dòng `revisit` khớp →
NOTE «ký trên cạnh gãy có tên: …»; thiếu một dòng → VIOLATION gọi tên eval; REJECT →
VIOLATION y hôm nay. Vị từ sống ở `lib/nhan-canh-gay.cjs`, cả hai bên đọc gọi — không chép.

**B4. Dời `NEN_DO_FLAG`.** Cờ đường nền đỏ ở Cổng 1 giữ nguyên chữ; Cổng 2 đọc cùng
`duong-nen.md` và, khi một eval BLOCKED trùng chân nền đã đỏ từ S1, gắn thêm câu «đỏ từ
trước vòng — không phải lỗi của vòng». Không đổi nhãn, không đổi lối.

## 4. Mảnh C — reality đóng hồ sơ

**C1. Enum.** `lib/workspace-record.cjs` `NAV_RULES['contract.md'].status.enum` thêm
`da-cham-boi-thuc-te`. KHÔNG thêm vào `DA_THONG_CONG_2` (hồ sơ này không qua Cổng Bằng
chứng) — thêm hằng riêng `DA_DONG_THUC_TE = ['da-cham-boi-thuc-te']` để mọi bên đọc hỏi lib.

**C2. Dòng quan sát.** Một dòng sổ `type: "thuc-te"` với `by` · `at` (ISO) · `build_sha` (40 hex,
sha BẢN DỰNG đang phục vụ prod lúc quan sát — đỉnh nhánh phát hành, không phải commit đầu
tiên đưa vật vào; ca crm 21/09 lẫn hai thứ này) · `decision` (một câu người nói). Vị từ `thucTe(ledgerText)` ở lib,
cùng nếp `hoSoNghi`: dòng cuối thắng; `supersedes` trỏ id → mất hiệu lực; thiếu vế → kiểu
`dong-so-thieu` + tên vế. KHÔNG đòi chữ ký Cổng 2 (khác hồ sơ nghỉ — đúng ca `approved /
BLOCKED / chữ ký rỗng`).

**C3. Thao tác cổng người thứ bảy** `commands/observed.md` — `disable-model-invocation: true`.
Người gõ `/acceptance-gate:observed <slug> <sha> <ngày> <tên> — <một câu>`; lệnh kiểm tiền
đề (hồ sơ có `contract.md` không ở `draft`; sha 40-hex; ngày đọc được), ghi dòng `thuc-te`
theo khuôn ở khối marker `THUC-TE-LINE` của chính thân lệnh (id từ DEC-ID-RECIPE) rồi đặt `status: da-cham-boi-thuc-te` CÙNG một commit, không đụng
chữ ký/verdict đã có. Máy không tự gọi (ADR 0002). P32 thêm `observed` vào danh sách khoá;
CLAUDE.md mục «6 thao tác cổng người» thành 7 và phép đo rút danh sách từ CLAUDE.md so với
P32 (round-trip, không gõ hai lần).

**C4. Bên đọc.**
- `scripts/start-scan.mjs` + `scripts/trang-thai-ho-so.cjs`: khoá mới `da-cham-thuc-te`,
  nhãn «đã chấm bởi thực tế», việc kế «không ai — reality đã chấm», nhóm `done`.
- `scripts/product-map.mjs`: hồ sơ rời nhóm đang dở, vào nhóm đã giao với nhãn trên.
- Lưới trước-merge + recheck: status mới + `thucTe` hợp lệ → NOTE «đã chấm bởi thực tế —
  chạy trên prod từ bản dựng <sha7> (quan sát <ngày>, <tên>)», `continue` trước luật verdict;
  dòng thiếu/hỏng → VIOLATION gọi vế; `build_sha` không có trong kho → VIOLATION;
  PR đổi `evals.yaml`/`rang/**` của hồ sơ này → VIOLATION «khoá việc thước» (reality là
  cuối; mở lại = dòng `supersedes`).
- Đường đọc-cũ: hồ sơ không mang status/dòng mới → mọi bên đọc cho CÙNG đầu ra như trước
  (ca đo so bằng nhau trên bộ hồ sơ thật của kit, không trên fixture tay).

## 5. Mảnh D — ý định và hiệu chuẩn

**D1. Dòng ý định trên thẻ Cổng 2.** Có `opportunity.md` → khối «Ý định (nguyên văn Cổng
Đáng)» in `feature:` và thân mục `## Vấn đề & ai gặp` NGUYÊN VĂN (esc HTML, không tóm tắt,
cắt ở 12 dòng kèm «… xem opportunity.md»). Không có tệp → không khối, không cờ. Không trọng
số, không map AC↔cơn đau (Đ7 đầy đủ).

**D2. Dòng hiệu chuẩn.** `scripts/hieu-chuan-moc.mjs --root <kho>` đọc mọi hồ sơ: N = số hồ
sơ có dòng `thuc-te` hợp lệ; k = trong N, số hồ sơ có dòng sổ `revisit` mở đầu `prod đỏ — `
SAU dòng `thuc-te`. In đúng một dòng: `ĐẠT đã ký → prod đỏ: k / N` khi N ≥ 1, và
`ĐẠT đã ký → prod đỏ: vô hiệu (N = 0)` khi N = 0 — không bao giờ in `0 / 0` hay «0 sự cố».
GUIDE mục năm dòng số thêm dòng thứ sáu trỏ lệnh này; hồ sơ mốc 2.18.0 chép đầu ra chạy trên
`crm` (hoặc «vô hiệu» nếu `crm` chưa cài lúc cắt mốc — khai, không đoán).

## 6. Hệ quả nhận có tên

1. **Hồ sơ đã ký đo hành vi bị thu hồi.** `thuoc-co-cua` AC-12 (trần nhát, khoá
   `tcc_tran_thuoc`) và vế `DO_GLOBS` của AC-10 (`phan-loai.test.mjs` PL1/PL4) đo đúng thứ
   vòng này gỡ. Lượt ghim lại của 2.18.0 sẽ đỏ trên chúng. Hai tiền lệ: ADR 0015 (lưu kho) và
   hồ sơ nghỉ (2.17.0, một dòng sổ có người). **Câu hỏi thật cho người ở Cổng Phạm vi** vì
   khó đảo. Khuyến nghị: hồ sơ nghỉ cho `thuoc-co-cua` ở chiến dịch ghim lại 2.18.0 (người
   ghi dòng), vòng này KHÔNG sửa byte nào của hồ sơ đã ký; test kho đổi theo vật mới.
2. **So sánh thước/vật đứt đời.** Dòng `thuoc-vat` trước/sau vòng này đếm test khác lớp.
3. **Mọi cạnh gãy là câu hỏi.** Chưa có trọng số nên chạm/lượt ở thẻ Cổng 2 có thể tăng —
   đo ở hai vòng `crm` đầu (kế hoạch §5 mục 5).

## 7. Quét độ phủ (Zwicky, preset test-matrix)

- **Trục A — bên đọc chịu đổi** [thước CE: grep `phan-loai` · `NAV_RULES` · `DA_THONG_CONG_2`
  · `verdict != PASS` — SUY-TỪ-REPO]: phân lớp · sinh args · so sau lượt · thẻ Cổng 2 · bộ
  đọc trạng thái (quét/bản đồ) · lưới trước-merge + recheck · lệnh cổng người · dòng mốc.
- **Trục B — chiều**: xanh · đỏ · đọc-cũ · đặc hiệu (chạm thứ không phải vật → im).
- **Trục C — gốc đỏ ở S4** [NGÀNH: trạng thái test của Bazel — `FAILED` ≠ `NO_STATUS`/
  `TIMEOUT`/`FLAKY`]: vật · bàn đo · hệ thống chết lần đầu · hệ thống chết đã thử lại ·
  thước lệch.

Core: mỗi ô (A × B) có nghĩa của trục A được một AC phủ ở hợp đồng; trục C phủ trọn trong
AC-5…AC-7. Later: định tuyến AC lõi/phụ (Đ7 đầy đủ) · răng «mốc N+1 dẫn commit kho nhận».
Never: LLM phân loại lý do BLOCKED (giả định sinh tử 2 của ô cấm).
