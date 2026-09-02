# Review kế hoạch trước Gate 1.5 — loi-moi-cong-may-sinh

> Phiên tươi, đối kháng, 2026-09-02. Vật: `docs/superpowers/plans/2026-09-02-loi-moi-cong-may-sinh.md`
> (9 task) + design + hợp đồng (approved, T3) trên nhánh `feat/loi-moi-cong-may-sinh` (cây sạch, HEAD
> `08b6914b`). Mọi kết luận dưới đây kèm lệnh đã chạy hoặc dòng mã đã đọc; không có mục nào là suy đoán.

## Đã kiểm (lệnh đã chạy, số đếm được)

| # | Đã làm | Kết quả số |
|---|---|---|
| 1 | Đọc trọn `scripts/gate-card.js` (854 dòng), `lib/out-of-contract.js`, luật dòng 100–290, `commands/approve.md`/`signoff.md`, khối P185–P194 của `tests/plugins/run-tests.sh` | vị trí thật: extract Cổng 1 dòng 488, `flags` dòng 527; extract Cổng 2 dòng 639, thoát non-approvable 647, `MAY_DI_TIEP` dòng 716 (SAU spawn start-scan) |
| 2 | `grep GATE-INVITE-SITES` | manifest khai **3 file / 5 bản** (SKILL 2 · acceptance-card 1 · feature-loop SKILL 2) — không có «site thứ tư» |
| 3 | `grep out-of-contract` toàn repo (trừ docs/_acceptance) | `parse()` chỉ có 2 caller: `scripts/gate-card.js:34` và răng P55 (`tests/plugins/run-tests.sh:669`); `acceptance-verify.js` là bên VIẾT, không gọi parse |
| 4 | Đọc `_acceptance/config.yaml` của 3 repo tiêu thụ | crm `gap_probe: advisory` · media-library `advisory` · artifact-platform **không khai**; kit `required`. `gate-card.js` **không đọc khoá này** (grep `gap_probe` → 0 hit ngoài comment) |
| 5 | Đếm hồ sơ consumer có gap-probe | crm 1/6 · media-library 11/16 · artifact-platform 14/193; hồ sơ đang ở trạng thái Cổng 1 (draft/approved): **0/0/0** hôm nay |
| 6 | Chạy `NEG_RE` cũ vs `HEAD_NEG_RE` mới trên **626 AC** của 74 contract thật (`scratchpad/d6.js`) | cột KHÔNG: **275 → 19**; 256 AC đổi cột (tất cả theo chiều KHÔNG→SẼ, 0 chiều ngược); trong 256 có **108** AC mà Then mang phủ định MẠNH (KHÔNG hoa · chặn · từ chối · VIOLATION · exit khác 0 · không được) |
| 7 | Soi AC-1/2/6 của release-2-5-0 và 2-6-0 | cũ: wont/wont/wont (xếp nhầm thật) · mới: will/will/will — lợi ích D6 xác nhận trên đúng 6 AC ấy |
| 8 | Quét trọn xưởng kit bằng bộ đọc HIỆN TẠI + công thức suspect/token của kế hoạch (`scratchpad/sweep.js`) | 74 hồ sơ, 1 Cổng 1, 73 Cổng 2, 0 extract-fail, **2,2 s** tổng · rơi-bậc Cổng 1: 0 · token lạ: **14** hit (8 là token hợp lệ + chú thích trong ngoặc, 6 văn xuôi) · suspect_empty: **3** hit, trong đó **2 là lời khai rỗng hợp lệ** «(không có finding nào…)», «(rỗng — …)» |
| 9 | Đo thời gian | `--extract` 5 hồ sơ 0,15 s · `start-scan.mjs` 0,46 s · render Cổng 2 HTML 0,42 s |
| 10 | `git show main:_acceptance/release-2-6-0/contract.md` | có (main = `9caa95ce`, #135 đã gộp); CI `gate.yml` checkout `fetch-depth: 0` nhưng là checkout PR — ref cục bộ `main` không chắc tồn tại |
| 11 | Grep răng ghim chuỗi thẻ (`Trả lời mẫu` · `___` · `trả lời dạng:` · `điền vào chỗ trống` · «đồng ý cắt» · «phê hết») | P185 (8825–8845), P186 (8888–8915), P186b (9030–9050), P187 (9106), P190 (9364, so byte 3 thẻ check-in trong `_acceptance/khoi-viec-cua-anh/evidence/`), P192 (9491, 9531), P191 neo `không bao giờ điền sẵn` (9432) ghim dòng 193–195 của GATE-ONESHOT-GRAMMAR |
| 12 | Đọc `commands/signoff.md` từ vựng Ngoài-N | chỉ dạy «ghi Known limits / mở hợp đồng mới / nâng phạm vi sửa ngay» (dòng 28, 33, 81); **không có** `known-limits`/`new-contract`/`wont-fix` |
| 13 | Fixture `viec-cua-anh-scenarios.sh` gate1 | không có `gap-probe.md`, không ledger → dưới Task 5 sẽ rơi bậc `vang` |

## Lợi ích — thật / hứa

| Lợi ích (thước North Star) | Thật / hứa | Căn cứ |
|---|---|---|
| **Chạm/lượt → 1** nhờ câu gộp in sẵn (D1) | Thật về cơ chế, **nhưng chỉ nếu dòng in ra bấm được** — hiện kế hoạch điền token máy mà `signoff.md` không nhận (Rủi ro #1) | mục 12 |
| **Hết fail-quiet OOC** (D4) — khối biến mất trước lúc ký | Thật, đo được ngay: xưởng có 1 hồ sơ sai khuôn thật (`lenh-in-ra-phai-bam-duoc`, meat=1093) | mục 8 |
| **Token đề xuất lạ kêu to** (D5) | Thật: 14 hit thật trong xưởng; câu «máy chưa đề xuất» đang nói sai 14 lần | mục 8 |
| **Cột SẼ/KHÔNG thôi xếp nhầm** (D6) | Thật cho 6 AC của hai release; **lợi ích ròng ÂM** với regex như kế hoạch: 108 AC «sẽ chặn» rơi khỏi cột — đúng khối T3 được dặn «duyệt kỹ» | mục 6–7 |
| **Rơi bậc** — chữ ký không nói «đối kháng đã hội tụ» khi chưa chạy (D3) | Thật cho kit (`required`); với consumer `advisory` là **cờ đỏ oan có hệ thống** ở vòng kế | mục 4–5 |
| **Khối PHÁN QUYẾT ĐỐI KHÁNG + ô hỏi = loại-5** (D2) | Hứa: hàng mặc định `'*'` không bao giờ được gọi (`route()` chỉ nhận literal `ngoai/scope/treo`), LM10 đo MÃ NGUỒN chứ không đo hành vi; số ô hỏi trên HTML không được đếm | Task 6 mã + LM10 |
| **Bỏ lượt Enter danh tính** (D7) | Hứa có chủ ý (AC-8 tự khai Known limits) — chấp nhận | — |
| **≤3 lượt/vòng · 0 ngoài thiết kế** | Hứa — đo ở vòng đầu dưới thẻ mới, đúng như ô khai | opportunity §ngưỡng |

## Rủi ro xếp hạng

| # | Mức | Chỗ | Kịch bản fail | Bằng chứng | Lưới đề xuất |
|---|---|---|---|---|---|
| 1 | **CAO** | Task 6 `oneParts` điền `Ngoài-1: known-limits` | Owner dán nguyên dòng → `signoff` không nhận token (thân lệnh chỉ biết «ghi Known limits»; `wont-fix` không có chữ người nào) → máy «nêu cách hiểu + xin xác nhận» = **một lượt ngoài thiết kế**, đúng lớp ô này sinh ra để trừ. Mỉa mai: «ghi Known limits» — thứ D5 sắp cắm cờ «token lạ» — là đúng từ vựng `signoff.md` đang dạy | mục 12; xưởng có hồ sơ `may-ganh-nguoi-quyet` proposal = «nâng phạm vi sửa ngay» | MỘT nguồn từ vựng: hoặc one_shot dịch token→chữ người qua bảng cạnh `OOC-PROPOSALS`, hoặc `signoff.md` khai nhận cả ba token máy (+ `wont-fix`) và P193 thêm needle round-trip từ `OOC-PROPOSALS` sang thân signoff |
| 2 | **CAO** | Task 4 `HEAD_NEG_RE` (AC-7, D6) | Then tiếng Việt mở đầu bằng CHỦ NGỮ («bộ dựng thoát khác 0 và KHÔNG in một byte», «VIOLATION + exit khác 0», «script từ chối») → 108 AC chặn thật rơi sang «SẼ làm»; thẻ T3 tuyên máy SẼ làm điều hợp đồng cấm — tái diễn lỗi D6 đi sửa, đổi chiều, ở quy mô 18× | mục 6: 275→19, 256 đổi cột, 108 phủ định mạnh | Sửa hình dạng lỗi thật thay vì đổi neo: giữ `NEG_RE` nhưng bỏ nhóm gây nhầm («không so», «không đổi», «không hỏi lại», «không cần») hoặc dò phủ định trong **mệnh đề chính** (trước `,`/`—`/`;`) chứ không chỉ ký tự đầu; ca LM04 giữ nguyên; thêm ca đối chứng: sweep 74 hồ sơ, số AC đổi cột phải ≤ N khai trước trong evidence (cùng kỷ luật E11). **Đây là đánh-đổi hướng đoán → một chạm cho owner** (xem khuyến nghị) |
| 3 | **CAO** | Răng plugins vỡ mà kế hoạch không liệt | Task 1 tuyên «P185/P187 giữ», Task 6 tuyên «P186 nay PASS» — sai cả hai: P185 đòi `trả lời dạng:` + `___` (text Cổng 1 mới bỏ cả hai); P186 cấm «đồng ý cắt»/«phê hết» và đòi `trả lời dạng:` ở TỪNG mục (Task 6 đổi chữ scope/Treo); P186b đòi `trả lời dạng:`; P192 ghim `Trả lời mẫu (một dòng, điền vào chỗ trống): «` và bóc nhãn bằng `:\s*___$` → ô đã điền và tiền tố `/acceptance-gate:signoff s` đều «nhãn không khớp SLOTS»; P190 so BYTE 3 thẻ check-in trong hồ sơ **đã ký** `khoi-viec-cua-anh` → sinh lại là sửa hồ sơ đã ký (memory: hồ sơ đã ký không kéo vào diff); P191 neo «không bao giờ điền sẵn» dòng 193–195 GRAMMAR — luật này nói NGƯỢC clause mới nhưng Task 1 và Task 7 đều không chạm | mục 11 | Task 1 sửa thêm dòng 193–195 GRAMMAR + neo P191; Task 6 liệt đích danh P185/P186/P186b/P192 (đổi kỳ vọng kèm comment D1) ; P190: quyết một trong hai — đổi thẻ check-in + PROVENANCE, hoặc P190 chuyển sang so với bản render tại SHA ghim |
| 4 | VỪA | Task 5 rơi bậc không đọc `gap_probe` mode | Repo `advisory` (crm, media-library) hoặc không khai (artifact-platform): mọi thẻ Cổng 1 không có gap-probe → cờ ĐỎ + one_shot `___` ⇒ vòng nào cũng «người phải đọc vật» — chính là trạm thu phí luật (c) cấm; hôm nay 0 hồ sơ Cổng 1 ở consumer nên nổ chậm, không nổ ở nghiệm thu | mục 4–5, `gate-card.js` 328–346 | Đọc `gap_probe` bằng `evidenceCore.resolveConfigKey` (cùng nếp `design_pass.host_embed` dòng 392); `advisory`/vắng → cờ vàng như hiện hành, KHÔNG rơi bậc; `required` → rơi bậc; ca LM06 thêm ô `advisory-vang → không rơi bậc` |
| 5 | VỪA | Task 6 thứ tự biến | Cổng 2: nhãn cuối «veto hay để yên» vs «ký hay trả» phụ thuộc `MAY_DI_TIEP` (dòng 716) — tính SAU `--extract` (639) và SAU thoát non-approvable (647); «dời lên ngay sau `const ooc`» không đủ, phải dời cả khối spawn start-scan lên trước extract (extract chậm thêm ~0,4 s/hồ sơ; LM12 74 hồ sơ ≈ +30 s). Cổng 1: `blocked` từ `flags` (527) sau extract (488); kế hoạch nêu «ba nguồn fred: dupIds + mienDoCoNguoiDung + rangHong» — **sai**: `dupIds` là `fwarn` (562), `blindSpot` là `fred` nhưng render ngoài `flags` (503) | đọc mã | Hoist có chủ đích: tính `roiBac`, `blockedSources = [blindSpot, rangHong, mienDoCoNguoiDung]` trước 488; Cổng 2: extract xuất `one_shot` chỉ khi approvable, và hoặc dời start-scan hoặc khai `one_shot_final: false` khi chưa biết MAY_DI_TIEP; ca LM09 thêm đối chứng HTML==extract cho ca `MAY_DI_TIEP` |
| 6 | VỪA | Task 8 baseline E11 | (a) Cờ oan có sẵn: 2/3 hit suspect là lời khai rỗng hợp lệ mở đầu bằng «(»; 8/14 token lạ là token hợp lệ + ngoặc — theo Step 2 phải quay lại sửa ngưỡng, kế hoạch chưa có ngưỡng nào cho hai hình dạng này. (b) Đóng băng theo SLUG: hồ sơ đã trong baseline vì lý do thật thì cờ oan MỚI trên cùng hồ sơ tàng hình; `if (r.status !== 0) continue` nuốt hồ sơ extract chết. (c) Thời gian: 2,2 s hôm nay — OK, nhưng thành ~30 s nếu #5 dời start-scan | mục 8–9 | suspect: bỏ dòng mở đầu «(» hoặc chứa «không có finding/rỗng»; token: khớp tiền tố `^(known-limits\|new-contract\|wont-fix)\b`, phần đuôi giữ ở `proposal_raw` và in như chú thích; baseline ghi `slug\tlý do` và LM12 so CẢ lý do; extract-fail là một dòng riêng của baseline, không `continue` |
| 7 | VỪA | Đóng dấu trên one_shot | Owner gửi nguyên dòng có «cắt/hoãn: đồng ý cắt; Treo: phê hết» không đọc. Lưới ĐÃ có: chữ quyết `___`, ô loại-5 `___`, khối báo có số. KHÔNG có: bằng chứng owner đã đọc; Treo khó-đảo chưa có tín hiệu máy đọc (kế hoạch tự khai giới hạn) | design N3, plan self-review | Chấp nhận theo luật (c) (veto-default + sổ + đường đảo); ghi giới hạn «Treo khó-đảo» vào Known limits của contract, không chỉ trong plan |
| 8 | NHẸ | LM04 `git show main:` | CI checkout PR: `main` cục bộ có thể vắng → đỏ hạ tầng (lớp P150) | mục 10 | Ghim SHA của commit ký hai hợp đồng (bất biến, không «neo mốc di động» — đúng lời răn ở đầu evals.yaml) |
| 9 | NHẸ | LM11 assert | `/findings[^<]*P1[^<]*2/` không vượt được `</b>` trong `<b>findings</b> · P0 0 · P1 2`; hai nhánh HOẶC còn lại cũng false → ca đỏ trên đúng bản render (phép HOẶC trong assert là chỗ trốn) | đọc plan | assert đúng chuỗi render: `P1 2` sau `LBL_DOI_KHANG` |
| 10 | NHẸ | LM10 «ngoài bảng» | Đo `'\*': 'hoi'` trong SRC = đo chỉ dẫn, không đo đầu ra; `route()` chỉ được gọi với literal nên hàng `*` chết; E3 chiều đỏ 1 (thêm 1 loại-5 → đếm +1) không có ca | Task 6 mã | Đưa kind qua một hàm phân loại nhận `{source}` và ca tiêm `source:'la'` → phải vào `routing.hoi`; thêm ca đếm `<div class="item">`/ô hỏi HTML == `routing.hoi.length` |
| 11 | NHẸ | Task 2 an toàn chéo | `parse()` chỉ gate-card + P55; P55 giữ `proposal === 'known-limits'` → không vỡ; S4 không đọc lib này | mục 3 | không cần thêm |

## Mâu thuẫn nội tại kế hoạch

1. **Task 1 vs răng thật**: «P185 giữ, P187 giữ, P186 chỉ đổi `slots < 5`» — P185/P186/P186b/P192 đều ghim `trả lời dạng:`/`___`/khuôn «điền vào chỗ trống»/danh sách cấm; Task 6 Step 4 «P186 nay PASS với đẳng thức Task 1» sai vì vòng `banned` (8911) vẫn còn.
2. **«4 site» P188** (File map, Task 1 Step 1, Step 5, tiêu đề «+ site thứ tư manifest liệt») — manifest 3 file/5 bản; «site thứ tư» là placeholder, trái với Self-review «không còn placeholder».
3. **Luật tự cãi sau Task 1**: clause mới nói «điền sẵn mọi ô có khuyến nghị», GRAMMAR dòng 193–195 (cùng file) vẫn nói «không bao giờ điền sẵn lựa chọn» và P191 ghim câu đó; Task 7 sửa GRAMMAR nhưng chỉ đoạn danh tính.
4. **Cổng 1 «ba nguồn cờ đỏ»** nêu sai (dupIds là vàng; blindSpot đỏ nhưng ngoài `flags`).
5. **Cổng 2 thứ tự**: `MAY_DI_TIEP` tính sau extract và sau thoát non-approvable — kế hoạch bảo «dời khối tính lên ngay sau `const ooc`» là không đủ.
6. **Task 8 phụ thuộc trường chưa ai khai**: «Extract Cổng 2 phải xuất `suspect_empty` + `proposal_raw` — thêm ở Task 6 nếu chưa» — Task 6 không có bước đó.
7. **LM11** tự đỏ trên bản render đúng (rủi ro #9).
8. **Từ vựng hai nguồn**: `OOC-PROPOSALS` (máy) vs bảng nhãn `signoff.md` (người) — kế hoạch dựng cái thứ nhất mà không nối cái thứ hai (rủi ro #1).
9. **E7 chiều đỏ** («đảo classifier về substring trong bản sao → đỏ gọi tên ca») và **E1/E2 chiều đỏ** («xoá hằng → one_shot mất nguồn lệnh»; «lệch một ký tự → one_shot hai nguồn») không có ca nào trong plan; ghim thông điệp nguyên văn theo bất biến CLAUDE.md chưa được viết.

## Khuyến nghị cho owner: DUYỆT-KÈM-SỬA

**Một dòng lý do:** bảy quyết định thiết kế đúng lớp và đo được, nhưng kế hoạch như đang viết sẽ in ra một dòng lệnh `signoff` không nhận và làm 108 tiêu chí «sẽ chặn» biến mất khỏi thẻ — hai lỗi đó máy sửa được trong plan, chỉ một điểm cần chữ anh.

**Sửa bắt buộc trước khi thi công (máy làm, báo sau):**
1. Một nguồn từ vựng đề xuất: one_shot ↔ `signoff.md` ↔ `OOC-PROPOSALS` (rủi ro #1); token khớp tiền tố + đuôi giữ nguyên văn (#6).
2. Liệt đích danh và sửa kỳ vọng P185/P186/P186b/P191/P192 trong Task 1/6; sửa GRAMMAR dòng 193–195 cùng lượt Task 1; quyết P190 (#3).
3. Rơi bậc đọc `gap_probe` mode — `advisory`/vắng không rơi bậc (#4).
4. Hoist đúng thứ tự cả hai cổng, sửa danh sách nguồn cờ đỏ, one_shot chỉ khi approvable (#5); baseline ghi lý do + ngưỡng cho lời-khai-rỗng (#6); LM04 ghim SHA, LM11 sửa assert, LM10 đo hành vi (#8–10).

**Điểm duy nhất cần anh (đánh-đổi hướng đoán, chạm vào AC-7 đã ký):** cột «Sẽ KHÔNG làm / sẽ chặn» khi không chắc thì đoán về phía nào?
Khuyến nghị: **giữ rộng** (đảo chiều mặc định — bất định thì HIỆN ở cột chặn cho người đọc), chỉ cắt các mẫu gây nhầm («không so», «không đổi», «không hỏi lại») và khai số AC đổi cột trong evidence; AC-7 đổi vế «MỞ ĐẦU bằng từ chối/chặn» thành «mệnh đề chính mang từ chối/chặn». Trả lời một chữ: **rộng** / **hẹp**.
