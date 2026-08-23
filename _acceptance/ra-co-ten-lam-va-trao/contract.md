---
schema_version: 1
feature: Ra có tên ở Vòng LÀM và TRAO — trạng thái «máy đã thông» cho làn V; Cổng Đáng ký qua /approve một lượt một PR; Cổng Giá trị có lối «không đo được» + archived/timebox có bộ đọc
slug: ra-co-ten-lam-va-trao
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm lib/workspace-record.cjs + lib/evidence-core.cjs (hook) + scripts/pre-merge-check.sh
surfaces: [cli]
status: approved
approved_by: Manh
approved_at: 2026-08-23T12:44:55Z
---

# Acceptance Contract: ra-co-ten-lam-va-trao

## Context

Ba chỗ trên dây nghi thức có ô mà không có tên, mỗi chỗ đập thẳng một thước North Star:
làn máy-đi-trước dừng ở `verified` nên không bao giờ tới Cổng Giá trị (ngưỡng khai rồi không
được đo); Cổng Đáng không có nghi thức nên một chữ ký tốn hai lượt gọi người, hai PR; Cổng
Giá trị không có lối ra cho vòng không đo được nên `duong-do-trong-dinh-nghia-xong` treo từ
21/08. Hồ sơ này thêm **một** trạng thái hợp đồng (`machine-cleared`), dạy thẻ và `/approve`
cổng thứ ba, cho ô ngưỡng bốn trạng thái máy đọc với lối `Không đo được — `, và cho
`archived`/timebox một bộ đọc. Mọi chữ mặt người vào bảng chung `trang-thai-ho-so.cjs`.

Source input: `_acceptance/ra-co-ten-lam-va-trao/opportunity.md` (Cổng Đáng ký build 23/08)
+ `docs/findings/2026-08-22-audit-day-nghi-thuc-kit.md` §3 A1–A3, A7–A9. Thiết kế:
`docs/superpowers/specs/2026-08-23-ra-co-ten-lam-va-trao-design.md` (§6 = quét không gian).

## Criteria

- AC-1: Given `lib/workspace-record.cjs` sau hồ sơ, When nạp module, Then enum `NAV_RULES['contract.md'].status` **bằng** `['draft','approved','implemented','verified','signed-off','machine-cleared']` (so mảng, không so độ dài), `usesUat()` trả true cho cả `signed-off` lẫn `machine-cleared` và false cho bốn giá trị kia, `usesEvidence()` trả true cho `implemented`/`verified`/`machine-cleared`; enum này **bằng** danh sách rút từ dòng `status:` của khối `CONTRACT-FRONTMATTER-TEMPLATE` + chú thích lifecycle trong `contract-template.md` (round-trip khuôn ↔ lib; bản sao khuôn thiếu một giá trị → đỏ nêu giá trị); **và** `evidence-report-template.md` có khối marker `EVIDENCE-XANH-SACH-BLOCK` liệt đúng sáu điều kiện xanh-sạch (gồm hai mục «Known limits» · «Ngoài hợp đồng» — hôm nay chúng chỉ sống trong văn xuôi skill, `[d-20260823T072105Z-12331]`), danh sách rút từ khối đó **bằng** thứ tự điều kiện của `xanhSach()` và của `xanh_sach_check` (round-trip ba đầu); bản sao khuôn gỡ một mục → đỏ nêu tên mục.
- AC-2: Given fixture hợp đồng `status: machine-cleared`, hạng T2, `veto_state: mo` + `veto_opened_at` hợp lệ, `approved_by` rỗng, kèm `evidence-report.md` PASS xanh-sạch **sinh từ khối `EVIDENCE-XANH-SACH-BLOCK` của khuôn bên viết** (không gõ tay theo khuôn bên đọc) và `run-log.jsonl` khớp run_id, When chạy `scripts/pre-merge-check.sh --base <ref>` trên bản sao có diff chạm slug, Then exit 0 và stdout có `NOTE [<slug>]: xanh-sạch — máy đi tiếp`; **chiều đỏ cùng fixture**: (a) tiêm `UNCERTAIN` vào báo cáo → exit ≠ 0 ghim `VIOLATION [<slug>]: status machine-cleared nhưng hồ sơ còn cần người — có mục UNCERTAIN`; (b) đổi hạng T3 → ghim `… hạng T3 (chỉ T2 được đi tiếp không ký)`; (c) gỡ `veto_state` và để `approved_by` rỗng → VIOLATION Cổng 1 như `verified` hôm nay; (d) hợp đồng `machine-cleared` mà **không có** `evidence-report.md` → `VIOLATION [<slug>]: status=machine-cleared but no evidence-report.md` (trạng thái đã arm cổng ở cả ba chỗ liệt kê).
- AC-3: Given hook ghi hợp đồng (`lib/evidence-core.cjs` `checkContract` qua `hooks/acceptance-evidence-gate.js`), When ghi `status: machine-cleared` với `approved_by` rỗng, Then (a) có `veto_state: mo` + mốc parse được + hạng T2 → **qua**; (b) hạng T3 → chặn ghim câu `veto_state: mo on a T3 contract`; (c) không veto, không `gate1_skipped` → chặn ghim `status: machine-cleared with empty approved_by — Gate 1 approval not recorded`; (d) `draft → machine-cleared` thẳng, không approved_by, không vết → chặn ghim `skips Gate 1`; thông điệp lifecycle của hook liệt `machine-cleared` (rút chuỗi từ hook, so với enum AC-1).
- AC-4: Given fixture workspace code-sinh, When chạy `scripts/start-scan.mjs --root`, Then (a) `machine-cleared` + `veto_state: mo`, không `opportunity.md` → `done[]` có `{slug, stateKey: 'da-giao-may-thong-veto-mo'}` và **không** có phần tử `stateKey: 'da-giao'` cho slug đó; (b) `machine-cleared` + `approved_by` có tên, không veto → `stateKey: 'da-giao-may-thong-xanh-sach'`; (c) `machine-cleared` + `opportunity.md` `decision: build` + ngưỡng chốt → `gates[]` có `{slug, gate: 'gia-tri'}`; (d) **mutant cô lập lớp**: cùng fixture (c) đổi status về `verified` (làn V đúng vết, evidence xanh-sạch) → slug **không** ở `gates`, ở `done` với `may-di-tiep-veto-mo` (đường đọc-cũ giữ nguyên); (e) **mutant phân biệt**: fixture (a) đổi `machine-cleared → signed-off` → `stateKey` đổi thành `da-giao` — hai chữ khác nhau ở nhãn (`label`) rút từ bảng chung.
- AC-5: Given `scripts/trang-thai-ho-so.cjs` + `scripts/product-map.mjs` + `scripts/gate-card.js` sau hồ sơ, When đọc/chạy, Then bảng có đúng bốn khoá MỚI `da-giao-may-thong-veto-mo` · `da-giao-may-thong-xanh-sach` · `da-giao-khong-do` · `da-dong-ho-so` với nhãn chứa lần lượt «máy thông» «máy thông» «không đo» «đóng có hồ sơ», BUCKET_OF chiếu ba khoá đầu về `da-ship` và khoá cuối về `da-bac`; bản đồ vẽ trên fixture AC-4(a) in nhãn của khoá (rút từ bảng, không chuỗi tự chế) trong ô «Đã giao»; thẻ `gate-card.js` trên hợp đồng `machine-cleared` nhận Cổng Bằng chứng (`--extract` `gate: '2'`) và HTML có dòng chứa «máy đã thông» + trạng thái cửa veto; ma trận BDK2 cập nhật lên N khoá mới (hằng gõ tay, không sinh từ bảng).
- AC-6: Given năm văn bản nghi thức sau hồ sơ, When đọc với phạm vi cắt đúng, Then (i) `skills/uat-session/SKILL.md` §0 bullet điều kiện status có **đúng 1** cụm `machine-cleared` cạnh `signed-off`; (ii) `feature-loop/skills/feature-loop/SKILL.md` bảng state machine có hàng `machine-cleared` → S5 và hàng `verified` nói «set `status: machine-cleared`» ở nhánh xanh-sạch, bước S4(3) không còn câu «để nguyên verified» cho nhánh đó; (iii) `skills/acceptance/SKILL.md` đoạn làn V có cùng mệnh đề; (iv) `CONTEXT.md` mục Gates & verbs có term **máy đã thông** (`machine-cleared`) với `_Avoid_` chứa «đã ký»; (v) `commands/acceptance-status.md` + `commands/acceptance-report.md` liệt trạng thái mới; bản sao gỡ từng mệnh đề → reader trên bản sao ĐỎ nêu mệnh đề (assert, không mô tả).
- AC-7: Given fixture workspace chỉ có `opportunity.md` (code-sinh từ `OPP-FRONTMATTER-TEMPLATE` + các section khuôn), When chạy `scripts/gate-card.js --extract` và HTML, Then tự nhận Cổng Đáng (`gate: '0'`), `cong_dang.applicable: true`, `cong_dang.nguong` ∈ {`chua-chot`,`de-xuat`,`chot`,`khong-do-duoc`} đúng với fixture bốn trạng thái, `cong_dang.loi_ra` có đúng bốn lối `làm`·`lặp`·`xếp lại`·`dừng`, HTML có khối «Vấn đề & ai gặp», «Ngưỡng» (bullet `[đề xuất]` mang chip «máy đề xuất»), bốn nút lối ra; **cờ đỏ** khi `chua-chot` ∧ không `khong-do-duoc` ghim «ký *làm* lúc này là ký trên thước trang trí»; bảng Nguồn ngoài có hàng «Phân loại» trống → `cong_dang.nguon_ngoai_chua_phan_loai ≥ 1` + cờ đỏ; đối chứng: `chot` + nguồn ngoài đủ → 0 cờ đỏ; workspace có `contract.md` → `cong_dang.applicable: false`, không cờ nào chứa «Cổng Đáng» (cô lập lớp).
- AC-8: Given `commands/approve.md`, `commands/start.md`, `skills/acceptance/references/human-facing-language.md` sau hồ sơ, When đọc với phạm vi cắt đúng, Then (i) thân `approve` có mục chế độ Cổng Đáng với điều kiện nhận (`contract.md` vắng ∧ `opportunity.md` có ∧ `decision` rỗng ∧ `stage ≠ archived`), bảng map `làm→build · lặp→iterate · xếp lại→park · dừng→kill`, răng chiều đỏ (từ chối `làm`/`lặp` khi ngưỡng `…` ∧ không «Không đo được»; từ chối khi nguồn ngoài chưa phân loại), bước gỡ tiền tố `[đề xuất]`, ghi `decided_by/decided_at/stage`, entry `type: gate0`, vẽ lại bản đồ, in bước kế `/feature-loop <slug>`; (ii) `GATE-ONESHOT-GRAMMAR` có dòng `/approve [<slug>]` mô tả câu gộp Cổng Đáng và `GATE-ONESHOT-SLOTS` có hàng `g0` — slot list round-trip với thân lệnh (mọi nhãn `g0` xuất hiện trong `approve.md`); (iii) `start.md` bước 4: cổng `dang` → thẻ rồi `/approve <slug>` (hết con trỏ chết); bản sao gỡ từng mệnh đề → đỏ nêu mệnh đề.
- AC-9: Given fixture workspace hợp đồng đã thông Cổng Bằng chứng (`signed-off` có chữ ký, và `machine-cleared` làn V) + `opportunity.md` `decision: build` với ô ngưỡng ở bốn trạng thái, When chạy `start-scan.mjs`, Then `chot` → `gates[]` `gia-tri` không `flags`; `khong-do-duoc` (dòng đúng tiền tố rút từ khuôn) → `done[]` `stateKey: 'da-giao-khong-do'`, không ở `gates`; `chua-chot` và `de-xuat` → `gates[]` `gia-tri` với `flags` chứa `'nguong-chua-chot'`; và ở nhánh chưa có hợp đồng: ô ngưỡng `de-xuat` → `gates[]` `dang` (không ở `considering`), `chua-chot` → `considering[]` (đối chứng cũ giữ nguyên); đối chứng seam: dòng `Không đo được:` (dấu hai chấm thay gạch dài) **không** được nhận → vẫn `nguong-chua-chot`.
- AC-10: Given `skills/acceptance/references/opportunity-template.md` sau hồ sơ, When đọc, Then có hai khối marker `OPP-DE-XUAT-PREFIX` (chứa đúng chuỗi `[đề xuất]`) và `OPP-KHONG-DO-DUOC-PREFIX` (chứa đúng chuỗi `Không đo được — ` + một dòng mẫu trong section Ngưỡng); chuỗi rút từ hai khối **bằng** hằng mà `start-scan.mjs`, `gate-card.js` dùng (đọc từ khuôn lúc chạy, hoặc hằng so bằng) và **bằng** chuỗi trong ngoặc kép của `uat-session/SKILL.md` §0 và `approve.md`; bản sao khuôn đổi một chuỗi → reader trên bản sao đỏ nêu **cả hai** chuỗi.
- AC-11: Given hợp đồng `surfaces: [ui]` (hoặc `[mobile]`) cạnh `opportunity.md` ngưỡng `khong-do-duoc`, When chạy `gate-card.js` (Cổng Phạm vi) và `start-scan.mjs`, Then thẻ có cờ **đỏ** ghim «khai không đo được nhưng hợp đồng có mặt người dùng» và `--extract` có `cong_gia_tri.mien_do_co_nguoi_dung: true`; bộ quét gắn `flags` chứa `'mien-do-co-nguoi-dung'` mà slug **vẫn ở ô của nó** (không `broken`); đối chứng: `surfaces: [cli]` cùng fixture → không cờ, không flag.
- AC-12: Given (a) `opportunity.md` `stage: archived`, (b) `opportunity.md` `decision: build` với bullet `Timebox:` mang ngày đã qua (hai dạng `YYYY-MM-DD` và `DD/MM/YYYY`) và chưa có verdict nghiệm thu, When chạy `start-scan.mjs`, Then (a) → `done[]` `stateKey: 'da-dong-ho-so'` (không `considering`, không `gates`); (b) → hồ sơ giữ ô của nó + `flags` chứa `'qua-timebox'`; ngày chưa qua / không parse được → không flag (không đoán); và `skills/uat-session/SKILL.md` có mệnh đề ký `kill` → ghi `stage: archived` vào `opportunity.md`, ký `iterate` → in bước kế mở vòng mới (assert đọc thân, phạm vi cắt đúng).
- AC-13: Given cây thật của repo sau hồ sơ, When chạy `start-scan.mjs --root .` bằng bản MỚI và bản tại mốc `cb38ea01` (bản cũ lấy bằng `git show` vào thư mục tạm), Then (i) bản mới `broken: []`; (ii) tập `(slug, stateKey)` của bản mới **bằng** bản cũ trừ đúng các dòng khai trong khối `KHAC-BIET-DOC-CU` (mục Notes); (iii) **cờ đo bằng QUAN HỆ, không bằng số đếm** — mọi slug mang `flags` chứa `qua-timebox` phải có bullet `Timebox:` parse được ngày **và** ngày đó trước ngày chạy, và ngược lại mọi slug thoả quan hệ đó phải mang cờ (đẳng thức hai chiều, đúng ở mọi ngày chạy — không ghim con số); tương tự `nguong-chua-chot` ⇔ (ở `gates` `gia-tri` ∧ ô ngưỡng không `chot`); (iv) **quét không gian mở**: tập file trong cây chứa chuỗi `signed-off` (ngoài `_acceptance/**` và `docs/**`) **bằng** hợp của tập bộ đọc có ca trong hồ sơ này và tập khai gạch có lý do trong khối `BO-DOC-KHAI-GACH` (mục Notes) — file lạ xuất hiện thì ĐỎ và nêu tên file (chống blacklist trên không gian mở); đối chứng dương chạy trên cây nguyên vẹn trước, chiều đỏ tiêm một file mới chứa chuỗi vào bản sao và tiêm một dòng sai vào khối.
- AC-15: Given hồ sơ `status: machine-cleared`, When có chữ ký hoặc veto của người, Then (a) `machine-cleared` **với `human_signoff` khác rỗng là trạng thái CẤM**: hook chặn lúc ghi và lưới trước-merge VIOLATION, cả hai ghim «chữ ký người trên hồ sơ máy-thông — ký thì status phải sang signed-off»; đối chứng dương là cùng fixture với `human_signoff` rỗng (exit 0); (b) chuyển `machine-cleared → signed-off` là chuyển HỢP LỆ có chủ đứng tên: `commands/signoff.md` có mệnh đề nhận hồ sơ `machine-cleared` và đặt `status: signed-off` cùng lượt ghi chữ ký (assert đọc thân, phạm vi cắt đúng; bản sao gỡ mệnh đề → đỏ); (c) `veto_state: da-veto` trên hồ sơ `machine-cleared` → lưới chặn tới khi xử, cùng thông điệp đang có cho `verified`; (d) bộ quét: `machine-cleared` + `human_signoff` khác rỗng → `broken[]` với lý do nêu đúng mâu thuẫn (không im lặng xếp vào «đã giao»).
- AC-14: Given hồ sơ thật `_acceptance/duong-do-trong-dinh-nghia-xong/`, When đọc sau hồ sơ này, Then `opportunity.md` section Ngưỡng có dòng bắt đầu đúng tiền tố `Không đo được — ` (lý do nêu «vòng nội bộ của bộ công cụ, không có người dùng cuối»), `decisions.jsonl` có entry `type: revisit` với `decision` nhắc dòng đó và cite `d-20260822T000500Z-4306`, `decision: build` và `decided_by` **không đổi** (hồ sơ đã ký không sửa quyết định), và bộ quét trên cây thật xếp slug vào `done[]` `da-giao-khong-do`.

## Coverage

- Trục A — vật mới: `machine-cleared` | thẻ+ký Cổng Đáng | ô ngưỡng bốn trạng thái + lối không-đo-được | răng chống lách surfaces | archived·timebox·kill/iterate [thước CE: đặc tả §1–§3; audit §3 A1–A3, A7–A9 — mỗi mục A là một giá trị]
- Trục B — bộ đọc: workspace-record | start-scan+trang-thai | product-map | gate-card | pre-merge | hook/evidence-core | uat-session | feature-loop SKILL | approve | start | khuôn+CONTEXT [thước CE: `grep -l signed-off` toàn repo = 14 file; mỗi file là một bộ đọc phải có ca hoặc có lý do gạch]
- Trục C — chiều: dương | âm ghim thông điệp | mutant cô lập lớp | round-trip hằng | đọc-cũ snapshot [thước CE: MEASURE-BIRTH-CLAUSE; `[NGÀNH: ISTQB state-transition testing / Chow N-switch]` — mỗi chuyển hợp lệ và mỗi chuyển cấm (`draft→machine-cleared`, T3, UNCERTAIN) có ca]
- Chân ngành: `[NGÀNH: Stage-Gate, R. Cooper]` — ba chuyển mới khai đủ năm thành phần ở đặc tả §5.
- Ô gạch có lý do: Cổng Đáng × {workspace-record, pre-merge, hook} và răng chống lách × {pre-merge, hook} — lưới mù Vòng TRAO là quyết định có chủ đích (audit §6 Never).

## Đường đo

- Thước: hồ sơ thật đầu tiên (ô `build` + làn V) tới được Cổng Giá trị, 0 commit đổi trạng thái ngoài nghi thức · số từ: `start-scan.mjs` trên cây thật (`gates[]` có `gia-tri` cho slug đó) + `git log` của `contract.md` không có commit đổi status ngoài nghi thức · bảo đảm bởi: AC-4, AC-9 (ca thử sống: `design-pass-nac-khong-dong-bo` khi tới S4).
- Thước: 0 hồ sơ máy-đi-trước hiện như đã ký ở mọi bộ đọc · số từ: `done[]` của bộ quét + ô bản đồ — đếm slug `machine-cleared` có `stateKey: 'da-giao'` (đích 0) · bảo đảm bởi: AC-4(e), AC-5, AC-13.
- Thước: `duong-do-trong-dinh-nghia-xong` rời nhóm chờ bằng lối có tên, có entry sổ; số cổng treo không lối ra hợp lệ = 0 · số từ: `gates[]` với `flags` chứa `nguong-chua-chot` (đích 0 trên cây thật sau hồ sơ) · bảo đảm bởi: AC-9, AC-14.
- Thước: ký Cổng Đáng kế tiếp = 1 lượt gọi người, 1 PR, 0 chữ của người bị máy viết trước · số từ: sổ quyết định entry `gate0` + `git log --follow opportunity.md` (số commit đổi `decision` = 1, cùng PR với commit gỡ `[đề xuất]`) · bảo đảm bởi: AC-7, AC-8 (ca thử sống: ô «đang cân nhắc» kế tiếp được ký).
- Thước: lối «không đo được» không thành đường lách · số từ: đếm slug ở `da-giao-khong-do` mà hợp đồng có `surfaces` chạm người dùng (`ui`/`mobile`) — đích 0, đọc từ `done[]` + `flags` của bộ quét trên cây thật · bảo đảm bởi: AC-11 (điều kiện CHẾT (b) của ô cơ hội, trước nay không có số).
- Thước: đọc-cũ — 0 hồ sơ hoá hỏng, 0 phải migrate · số từ: `broken[]` của bộ quét trên toàn bộ hồ sơ thật · bảo đảm bởi: AC-13.

## Out of scope

- Veto có động từ (A5) · vết duyệt kế hoạch T3 (A6) · Cổng Phạm vi lối «không làm» và «Trả lại» có vết (A10) · re-pin có tên (A11) · lái-thử có người khởi động (A12) — Later của audit §6; kéo vào là điều kiện chết (e).
- Lưới trước-merge đọc Vòng TRAO (verdict nghiệm thu / timebox) — Never, «thất bại chảy một chiều».
- Migrate hồ sơ `verified` + làn V đời cũ sang `machine-cleared` — trái luật đọc-cũ; chúng giữ `may-di-tiep-*`.
- Lệnh thứ bảy cho Cổng Đáng — «chỉ TRỪ không CỘNG»; `/approve` đã bị khoá ADR 0002.
- Eval hành vi LLM của `/approve` (máy có từ chối thật không) — hội đồng chỉ khi ô lọt lần ba (nếp chip C §4); đo bằng thân lệnh + round-trip hằng.
- `iterate` ≡ `build` ở bộ đọc — giữ; timebox dạng ngày tự do («cuối tháng 9») — chỉ nhận hai dạng ngày.
- Parse ngưỡng thành từng thước / đối chiếu thước ↔ đường đo — vẫn chữ, như chip C.

## Notes

Khối máy-đọc cho AC-13(ii) — mỗi dòng `slug stateKey-cũ stateKey-mới`; thêm khác biệt là sửa khối này cùng lượt. Cờ KHÔNG khai ở đây: cờ đo bằng quan hệ ở AC-13(iii), vì danh sách cờ đổi theo ngày chạy (lớp «thước ghim vào thứ sẽ đổi»). Kiểm 23/08: 0 hồ sơ `stage: archived`, 5 hồ sơ có timebox ngày thật và cả 5 còn hạn.
<!-- <<<KHAC-BIET-DOC-CU
duong-do-trong-dinh-nghia-xong cho-cong-gia-tri da-giao-khong-do
KHAC-BIET-DOC-CU>>> -->

Khối máy-đọc cho AC-13(iv) — bộ đọc chứa chuỗi `signed-off` mà hồ sơ này CỐ Ý không đụng, mỗi dòng `đường-dẫn lý-do`:
<!-- <<<BO-DOC-KHAI-GACH
feature-loop/README.md tài-liệu-mô-tả-không-rẽ-nhánh-theo-status
tests/plugins/lan-v.test.mjs ca-của-hồ-sơ-làn-V-cũ-giữ-đường-đọc-cũ
tests/plugins/run-tests.sh bộ-chạy-suite-không-rẽ-theo-status
tests/scripts/run-tests.sh bộ-chạy-suite-không-rẽ-theo-status
tests/scripts/additive-only.test.mjs ca-đo-tính-chỉ-thêm-không-rẽ-theo-status
BO-DOC-KHAI-GACH>>> -->


- Bảng chữ chung `scripts/trang-thai-ho-so.cjs` thêm 4 khoá → ca BDK2 (ma trận gõ tay N=20) phải nâng lên N=24 cùng lượt; đó là hành vi có chủ đích của BDK2, không phải hồi quy.
- Lưới đẳng thức bash↔mjs của xanh-sạch (LV5) giữ nguyên; thêm hàng fixture `machine-cleared` vào ma trận của nó.
- Hồ sơ T3 → Gate 1.5 duyệt kế hoạch; Gate 2 luôn dừng chờ người.
