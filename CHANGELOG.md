# CHANGELOG — acceptance-gate kit

> Mỗi release một mục, nói tiếng người: đổi gì · ai bị ảnh hưởng · làm gì khi
> update. Sử chi tiết từng bản 1.x sống trong `description` của manifest
> (`.claude-plugin/plugin.json`) — file này bắt đầu từ 2.0.0.
>
> Tệp này dựng lại 14/09/2026 (owner gọi tên). Bản gốc ra đời ở đợt tái lập
> 2.0.0 nhưng nằm trên một nhánh không gộp vào nhánh chính, nên lịch sử
> 2.0.0 → 2.12.0 **không** có ở đây: chuyện của mười hai mốc đó sống trong
> `_acceptance/release-<x-y-0>/contract.md` và `evidence-report.md`. Mục đầu
> tiên dưới đây là phần CHƯA phát hành.

## Chưa phát hành

### Làn đối chứng S4 có trần, bỏ qua eval mới, tự dọn (hồ sơ `baseline-tran-bo-qua-don`, T2)

Gốc: crm `_acceptance/khung-ban-ghi-kara`, 07/10 — lượt `wf_f425c910-a3b` giữ khoá s4 5 giờ, không ra
báo cáo, để lại worktree tạm. Truy nguyên: tác tử baseline tự chế vòng `bash -c "…$c"`; kiểm tra an toàn
của Claude Code hỏi người cho script nó không đọc được — kể cả ở bypassPermissions — và không ai trả lời
suốt đêm. Lệnh không treo. Tám lệnh đầu còn đo tệp kiểm chưa có ở merge-base.

- **Tác tử baseline chỉ chạy MỘT lệnh do kit sinh**, chép nguyên văn: worktree cô lập, trần 180 giây mỗi
  lệnh (dừng cả cây tiến trình) và trần tổng 480 giây (dưới trần 600 giây của công cụ). Lệnh không có
  `eval`, `bash -c "$biến"`, `rm`, `rmdir` — những hình dạng kích hộp xin quyền.
- **Mã thoát baseline do máy đọc** từ dòng dấu `__BL …`, không từ lời khai của tác tử. Lane không về trọn
  (tác tử chết, bị dừng, đầu ra cụt, worktree không dựng được) → BLOCKED hạ tầng có tên cho làn đối chứng:
  mọi lệnh `n-a` kèm lý do, **lượt chấm vẫn ra báo cáo**, và không ghi dòng `kind:"baseline"` nên round
  sau đo lại.
- **Eval trỏ tệp chưa có ở merge-base được bỏ qua**, lý do vào section `## Analyst` («Baseline khong do»).
- **Worktree tạm tự dọn** khi bị dừng (trap) và lượt sau quét worktree `agk-baseline*` mồ côi của lượt bị
  giết cứng — trừ lượt còn sống (pid trong lý do khoá `git worktree lock`).
- Ai bị ảnh hưởng: mọi kho chạy S4. Không cần làm gì khi cập nhật; tác tử/harness đời cũ không trả
  `dauRa` thì đọc như 2.24.0, có cờ vàng.

## 2.26.0 — 09/10/2026

Cửa sổ 2.25.0 → 2.26.0 nằm trong **hai ngày** (08–09/10), có **ba vòng** được ký: `xuat-du-lieu-lo-trinh`
(T2, ký 08/10, PR #285), `lo-trinh-cat-luot` (T2, ký 09/10, PR #289) và `doc-ghi-troi-mang-sang-run-id`
(T3, ký 09/10, PR #284). Kho chờ nhận là `crm` — CHƯA cài 2.25.0 (hạn cứng 14/10 của đợt đang chạy) nên
nhận thẳng 2.26.0 một lần; neo ở hàng `LT1` của `crm/docs/plan/dot-sau-14-10/` (trang lộ trình trong CRM đọc
khối dữ liệu mốc này mang), ở `crm/_acceptance/khung-okr-truoc-r1` (gốc của cắt lượt) và ở đêm 07–08/10 của crm
(gốc của bộ đọc mục mang sang). Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên `2.26.0`;
`diagram-design` giữ `2.7.1`. Tag `v2.26.0` gắn tại commit gộp PR mốc.

**Vì sao 2.26.0, không 2.25.1:** một khối dữ liệu mới trong trang lộ trình (khuôn `lo-trinh-du-lieu` v1 cho
bản chiếu ngoài kho) và một skill mới (`cat-luot`) — năng lực mới cho kho tiêu thụ.

**Lớp chép CI ĐỔI bốn tệp** (danh sách vẫn 17 tệp): `scripts/lo-trinh.mjs`, `lib/evidence-core.cjs`,
`lib/out-of-contract.cjs`, `scripts/recheck-evidence.cjs`. Diff engine của cửa sổ còn ở
`feature-loop/workflows/acceptance-verify.js`, `scripts/cat-luot.mjs` (mới), `skills/cat-luot/SKILL.md` (mới)
và bốn tài liệu tham chiếu của `skills/acceptance/` (`lo-trinh-du-lieu.md` mới, `lo-trinh-template.json`,
`pham-vi-template.md`, `human-facing-language.md`).

**Một cách đọc `run_id` ở lượt chấm.** #289 và #284 cùng sửa bộ ghi mã lượt chạy của lượt chấm S4, mỗi nhánh
một hàm. Khi gộp #284 sau #289, hai hàm thành MỘT (`docRid`): luật đầy đủ của bên đọc (bỏ đuôi ` # …`, khoảng
trắng, mọi nháy đầu/cuối), áp cho cả mã mang sang lẫn mã ghi run-log. Ca đột biến của #284 đổi kim sang dòng
mới; hồ sơ #284 được ghim lại sau lần gộp đó.

### Thẻ Cổng 2 không còn giấu mục mang sang; run_id rỗng không còn lọt (hồ sơ `doc-ghi-troi-mang-sang-run-id`, T3)

Gốc: crm đêm 07–08/10 (kit 2.24.0). Thẻ Cổng 2 giấu mục ngoài hợp đồng mang sang ba lần (2/7, 1/15, 10/10).
Báo cáo PASS mang `run_id: ""` mà kiểm lại vẫn qua.

- **Bộ đọc thẻ nhận mục mang sang tác tử tự viết** dạng `- **<tiêu đề>** (rN)` (nhãn ngoài dấu sao), chuẩn
  hoá về đúng dạng máy chèn. Bước chèn mục mang sang dùng cùng biểu thức, nên không còn in bản thứ hai. Đo lại
  trên chính kho kit: hai hồ sơ đã ký 03/10 có 1 và 4 mục mà thẻ lúc ký không in ra.
- **`run_id` rỗng:** tác tử trả `""` thì máy đúc mã như khi vắng. Báo cáo cũ mang `run_id` rỗng được gọi tên
  bằng một dòng `NOTE` khi kiểm lại, nhưng không bị chặn: báo cáo đã ký có hình dạng này đang tồn tại ở kho
  tiêu thụ.
- Ai bị ảnh hưởng: mọi kho chạy S4 hoặc dựng thẻ Cổng 2. Không cần làm gì khi cập nhật. Thẻ của hồ sơ cũ có
  thể hiện thêm mục ngoài hợp đồng trước đây bị giấu. Khi đó số `Ngoài-N` (đánh theo vị trí) dịch so với lúc
  ký, nên đọc sổ quyết định cũ theo tiêu đề, không theo số. Kho nào ghim `routing-baseline` thì sinh lại dòng
  của hồ sơ đó. Eval mang sang với `run_id` rỗng sẽ chạy lại thay vì được mang.

### Cắt lượt: bản phạm vi thành hàng lộ trình, răng phủ «mỗi mã ở đúng một chỗ» (hồ sơ `lo-trinh-cat-luot`, T2)

Gốc: crm `_acceptance/khung-okr-truoc-r1` — lộ trình OKR 32 → 62 hàng trong ba ngày, hai lượt cắt tay
một buổi sáng 04/10, bảng phủ chép tay đã cũ, bản phạm vi không có trong git.

- Skill mới `cat-luot`: bản phạm vi (hoặc Core của quét hình thái) → hàng + chân trời theo sáu luật, hai
  dáng `chuoi` · `lan-va`; ghi hàng → chạy răng → xanh mới mở PR.
- `scripts/cat-luot.mjs` (chỉ đọc): răng phủ theo đợt (`dot`), chân trời có lý do, khuôn và ngày/mốc của
  hàng cùng đợt; `--nhip` đo nhịp theo hạng từ hồ sơ đã ký. Khuôn mới `pham-vi-template.md`; khuôn lộ
  trình thêm `dot`, `phu`, `chan_troi`; `kiemKhuon` cờ khi `phu`/`chan_troi` sai kiểu.
- Trang lộ trình: hàng có hồ sơ mang dòng «bước kế: …» suy từ ô bản đồ (phần sửa lát 1 sau phiên nghiệm
  thu 06/10). Kho không khai lộ trình, và kho không hàng nào có hồ sơ: không đổi byte nào.
- Ai bị ảnh hưởng: kho đã khai `lo_trinh.tep` — trang đổi ở hàng có hồ sơ; vẽ lại một lần khi nâng kit.
- Sửa kèm (owner gọi tên ở Cổng Bằng chứng 09/10, ngoài phạm vi đã duyệt): lượt chấm S4 chuẩn hoá mã
  lượt chạy tác tử khai theo đúng luật bên đọc bằng chứng trước khi ghi nhật ký. Tác tử từng trả nguyên
  hai dấu nháy `""`; nhật ký chép nguyên, bên đọc bỏ nháy, hai lệnh cùng trả thế thì chữ ký bị lưới chặn
  oan. Nay mã chỉ có dấu nháy → máy tự đúc mã. Mọi kho: chỉ đổi lượt chấm mới; hồ sơ cũ không đổi.

### Trang lộ trình mang sẵn dữ liệu máy đọc cho bản chiếu ngoài kho (hồ sơ `xuat-du-lieu-lo-trinh`, T2)

Gốc: crm `_acceptance/cap-nhat-tuan-okr` — 23/48 tin chủ kho ở phiên điều phối OKR 23–26/09 là hỏi tiến
độ; owner chốt 08/10 người không dùng git được XEM lộ trình (crm: hàng `LT1`, trang «Lộ trình» trong CRM).

- `LO-TRINH.html` có thêm một khối `<script type="application/json" id="lo-trinh-du-lieu">` theo khuôn
  `lo-trinh-du-lieu` phiên bản 1: mỗi lộ trình — hàng kế + lệnh mở, chỗ cần sửa, tiến độ, từng hàng
  (trạng thái, nhóm tiến độ, hồ sơ nhận, cờ đã dịch, ý định của hàng), mốc, đã bác; cấp trang — hồ sơ
  ngoài kế hoạch. Bộ đọc mẫu khoan dung `docDuLieu` trong `scripts/lo-trinh.mjs`.
- Ai bị ảnh hưởng: kho đã khai `lo_trinh.tep` — trang đổi byte một lần (khối mới); phần người xem
  không đổi. Kho không khai: không đổi gì.
- Làm gì khi nâng: vẽ lại trang một lần (`node scripts/product-map.mjs --root .`) trong PR nâng kit,
  nếu không `--check` đỏ «LO-TRINH.html lệch». Không sửa cấu hình. Bản chiếu đọc tài liệu
  `skills/acceptance/references/lo-trinh-du-lieu.md`.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI: chép lại bốn tệp** — `scripts/lo-trinh.mjs`, `lib/evidence-core.cjs`, `lib/out-of-contract.cjs`,
  `scripts/recheck-evidence.cjs` (theo INIT-CI-COPY-LIST của `acceptance-init`).
- **Máy dev:** cài lại plugin ở MỌI phạm vi trên mỗi máy có phiên của kho, kiểm từng bản ghi cây phụ.
- **Kho đã khai `lo_trinh.tep`:** vẽ lại `LO-TRINH.html` một lần trong PR nâng kit (`node scripts/product-map.mjs
  --root .`), nếu không `--check` đỏ «LO-TRINH.html lệch» (khối dữ liệu mới, và dòng «bước kế» ở hàng có hồ sơ).
- **Thẻ Cổng 2 của hồ sơ cũ** có thể hiện thêm mục ngoài hợp đồng trước đây bị giấu; số `Ngoài-N` khi đó dịch so
  với lúc ký — đọc sổ quyết định cũ theo tiêu đề. Kho ghim `routing-baseline` thì sinh lại dòng của hồ sơ đó.
- **crm, theo thứ tự** (nhận thẳng 2.26.0, bỏ qua 2.25.0 — mọi ghi chú nhận của 2.25.0 vẫn áp):
  1. **Khi nào cài:** SAU hạn cứng 14/10 của đợt đang chạy, TRƯỚC khi mở hàng đầu tiên của đợt `sau-14-10`
     (`crm/docs/plan/dot-sau-14-10/README.md`: «gộp và cài cùng phiên bản trước khi mở đợt»). Không đổi engine
     dưới chân một vòng đang chạy tới hạn.
  2. Chép bốn tệp lớp CI ở trên; cài lại plugin gốc + mọi cây phụ.
  3. Khai `long_running: 45` cho `tro-ly-okr-bo-final-output/E6` và `E7` (từ 2.25.0; và mọi eval gọi model chạy
     dài khác). E6/E7 đã có trong `feature_loop.model_evals` nên tự chạy riêng sau suite.
  4. Vẽ lại `LO-TRINH.html` (crm khai `lo_trinh.tep`) trong cùng PR nâng kit.
  5. **Đo trước → sau trên crm** (tiền lệ `docs/findings/2026-09-23-nang-sau-kho-len-2-18-1.md`): trên cùng một
     cây, chạy lưới trước-merge và thẻ của các hồ sơ đang mở dưới 2.24.0 rồi 2.26.0 — phán quyết từng hồ sơ phải
     bằng nhau, TRỪ chỗ mốc hứa đổi: thẻ Cổng 2 hiện thêm mục mang sang từng bị giấu, và dòng `NOTE` khi kiểm lại
     báo cáo mang `run_id` rỗng. Khác ở chỗ nào khác là tín hiệu cần đọc.
  6. **Khối dữ liệu lộ trình có từ 2.26.0 — hàng `LT1` dùng được** (điều kiện mở của LT1 là kit ≥ 2.26).

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng của từng vòng — đủ ở ba hợp đồng và
`docs/research/known-limits-ledger.tsv`): `xuat-du-lieu-lo-trinh` 10 hàng sổ · `lo-trinh-cat-luot` 13 mục ngoài
hợp đồng + 3 điểm yếu đo trong hợp đồng · `doc-ghi-troi-mang-sang-run-id` 6 hàng sổ (một hạt giống
`docs/plans/2026-10-09-hat-giong-carry-run-id-rong-tach-cap.md`).

**Năm dòng số của luật (c)** — ba vòng (giờ VN; nguồn: giờ commit `contract.md`/`evidence-report.md`,
`usage-report.md`, `decisions.jsonl`, `run-log.jsonl` của hồ sơ; ba khối token theo khuôn 2.25: chứng-minh-vật =
machine+judge+baseline · tìm-lỗi = review+refute · tổng hợp = triage+capture+synthesize):

| Dòng | `xuat-du-lieu-lo-trinh` (T2) | `lo-trinh-cat-luot` (T2) | `doc-ghi-troi-mang-sang-run-id` (T3) |
|---|---|---|---|
| Làm-xong→quyết-được | `implemented` 08/10 15:51 → ký 18:32 ≈ **2 giờ 41 phút**, hai lượt chấm (≈ 121 phút máy); chờ chữ ký sau lượt xanh 24 phút; **2 lượt chấm** | `implemented` 09/10 00:21 → ký 11:57 ≈ **11 giờ 36 phút**, gồm ≈ 7 giờ 25 phút qua đêm từ lượt 2 PASS tới lúc owner định tuyến; bốn lượt chấm (≈ 117 phút máy), một lần sửa bộ máy chấm trong vòng, một lượt vượt trần; chờ chữ ký sau lượt xanh cuối 70 phút; **4 lượt chấm** | `implemented` 08/10 23:25 → ký 09/10 06:36 ≈ **7 giờ 10 phút**, ba lượt chấm (≈ 93 phút máy); chờ chữ ký sau lượt xanh 5 giờ 12 phút qua đêm; **3 lượt chấm** |
| Lượt gọi người / vòng (trần T2 3 · T3 4) | Trong thiết kế **1** — ký Cổng Bằng chứng (Cổng Phạm vi làn V). Ngoài thiết kế **0**. 1 chạm | Trong thiết kế **1** — ký Cổng Bằng chứng. Ngoài thiết kế **3** — lần mời ký đầu sau lượt 2 bị lưới chặn (lượt gọi bị hạ tầng đốt) · chọn «sửa trong vòng» · cho chấm lượt 4 vượt trần. **Tổng 4 — VƯỢT trần T2 3.** Số chạm của hai lượt sau không ghi trong hồ sơ | Trong thiết kế **3** — Cổng Phạm vi (ký thật) · Gate 1.5 · Cổng Bằng chứng. Ngoài thiết kế **0**. Tổng 3 ≤ trần T3 4; 1 chạm ở hai lượt sau, lượt đầu không ghi |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0** — lượt 1 REJECT vì ba lỗi trong hợp đồng (vật và thước) | **2** — lượt 2 PASS vô hiệu: bộ ghi chép nguyên mã `""` tác tử trả vào run-log, bên đọc bỏ nháy, lưới chặn chữ ký · lượt 3 REJECT oan: bốn ca đối chiếu cả kho đọc báo cáo lượt 2 còn mang mã hỏng | **1** — lượt 2 REJECT chỉ vì ca GL03 so từng byte dòng run-log có cả `wall_s` (chạy riêng thì xanh; #284 sửa) |
| Token máy / vòng (out-token S4) · chứng-minh-vật / tìm-lỗi / tổng hợp | **73 575** · 49/19/32 % (39 507 · 34 068) | **139 940** · 45/21,5/33,5 % (43 134 · 34 063 · 27 090 · 35 653) | **93 057** · 53,5/17,5/29 % (29 137 · 29 715 · 34 205) |
| Phút máy / lượt chấm | 26 và 95 phút (1 565 s · 5 679 s — lượt 2 có một mảnh suite chạy 4 240 s, hồ sơ không ghi nguyên nhân), tổng ≈ 121 phút | 34 · 26 · 30 · 27 phút, tổng ≈ 117 phút (6 997 s) | 30 · 33 · 30 phút, tổng ≈ 93 phút (5 551 s) |

Cộng ba vòng: 306 572 out-token, ≈ 330 phút máy, 9 lượt chấm, 3 lượt bị hạ tầng đốt. Phiên chính không đo token.
Ngoài lượt chấm: X1 tốn hai lượt ghim lại (≈ 22 phút mỗi lượt, gộp main sau 2.25.0 rồi sau #288), L2 một lượt
(≈ 22 phút, gộp main sau X1), #284 một lượt (gộp main sau L2, hợp hai hàm đọc `run_id`).

**Đọc số:** dòng 2 vượt trần ở L2 do hạ tầng kit — hai trong ba lượt gọi ngoài thiết kế sinh từ lượt 2 bị vô hiệu
(bộ ghi `run_id` lệch bên đọc). Đúng lớp `doc-ghi-troi-mang-sang-run-id` cùng chữa ở phía mang sang; mốc này gộp
hai nửa thành một luật. Chỗ cắt cho cửa sổ kế: không mở ô — A1 (tác tử chấm không sửa mã) đã là hàng kế trên lộ
trình kit.

**Điều kiện tin cậy:** (i) không đổi thành phần đường verdict — diff của workflow lượt chấm nằm ở làn máy ghi
sổ (chuẩn hoá `run_id` trước khi vào run-log; eval mang sang có `run_id` rỗng thì chạy lại) và ở bước máy chèn
mục mang sang (nhận dạng nhãn `(rN)` ngoài dấu sao); không chạm finder, refute trong hợp đồng hay luật REJECT.
Mốc này CHẠM `lib/` (khác 2.25): `evidence-core.cjs` thêm một cờ `NOTE` cho khối eval có `run_id` rỗng — không
tính vào thất bại, mức chặn bằng chứng không đổi; `out-of-contract.cjs` đọc thêm dạng nhãn ngoài dấu sao — đổi
đầu vào của lưới «mục chưa định tuyến» và thẻ Cổng 2 (có thể lộ thêm mục), không đổi đường verdict S4.
(ii) Lượt chấm sai do phép-đo-tự-dối giữa hai mốc: **0** — ba lượt oan đều là hạ tầng (dòng 3); ngưỡng (a) đếm
**0/2**. Dòng 4–5 cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở crm | lượt chấm không còn vô hiệu vì mã lượt chạy lệch bên đọc; người ký không phải hỏi lại mục mang sang bị giấu |
| 2 | ↓ ở crm | trưởng phòng ban xem lộ trình trong CRM (LT1) thay vì hỏi chủ kho; lượt cắt kế hoạch chạy bằng skill thay cho buổi cắt tay |
| 3 | ↓ | đúng lớp L2 và #284 chữa — ba lượt của cửa sổ này mất vì nó |
| 4 | = / lượt, ↓ / vòng | không đổi thành phần lượt; ít lượt bị đốt hơn |
| 5 | = / lượt | không đổi đường găng của lượt |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .`.
**N không tăng so với mốc 2.25.0 (vẫn 1) — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.25.0 — 09/10/2026

Cửa sổ 2.24.0 → 2.25.0 nằm trong **ba ngày** (07–09/10), có **hai vòng** được ký cùng ngày 07/10:
`luot-sua-giu-du-dem-dung` (T2, PR #278) và `lenh-dai-chay-rieng` (T2, PR #279). Ngoài hồ sơ: lộ trình
của kit `docs/plans/lo-trinh-kit.json` (#281, #282, chỉ tài liệu) và ô Cổng Đáng `xuat-du-lieu-lo-trinh`
(#283, chỉ hồ sơ — vật của nó, PR #285, CỐ Ý để sang mốc sau). Kho chờ nhận là `crm`, neo ở hai hồ sơ crm:
`tro-ly-okr-bo-final-output` (bốn lượt chấm đốt bởi hạ tầng kit) và `don-okr-nhap-sai` (lượt sửa làm rụng
ba mục ngoài hợp đồng); `crm/docs/plan/dot-sau-14-10/README.md` ghi «gộp và cài cùng phiên bản trước khi
mở đợt». Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên `2.25.0`; `diagram-design` giữ `2.7.1`.
Tag `v2.25.0` gắn tại commit đóng hồ sơ mốc sau khi gộp.

**Vì sao 2.25.0, không 2.24.1:** một khoá eval mới (`long_running`) và thứ tự chạy mới cho eval trong
`feature_loop.model_evals` — hành vi mới ở lượt chấm.

**Lớp chép CI KHÔNG đổi** — không tệp nào trong INIT-CI-COPY-LIST đổi từ 2.24.0 (danh sách vẫn 17 tệp);
diff engine của cửa sổ chỉ ở `feature-loop/` (workflow lượt chấm, `s4-args`, `carry-plan`, `thuoc-vat`,
`lan-khoa`, SKILL), hai tài liệu tham chiếu của `skills/acceptance/` và một dòng chú thích khuôn của
`acceptance-init`.

### Lượt chấm S4 không còn bị lệnh dài và eval nặng đốt (hồ sơ `lenh-dai-chay-rieng`, T2)

Gốc: crm `_acceptance/tro-ly-okr-bo-final-output`, 07/10 — bốn lượt chấm mất vì hạ tầng kit: hai lượt
BLOCKED vì tác tử đọc «lệnh bị đẩy sang nền ở 600 s» thành «bị giết», hai lượt REJECT vì eval gọi model
dựng `eve dev` cùng lúc với một ca suite canh đúng tiến trình đó.

- **Khoá eval mới `long_running: <phút>`** (số nguyên 1–240, thời lượng tối đa dự kiến; chỉ eval
  `test`/`script`). Lượt chấm tự chạy lệnh nền, ghi nhật ký ở `.acceptance-runs/<slug>/s4-lenh-dai/`
  (kết bằng `__EXIT=<n>`), chờ bằng lệnh máy sinh; quá số phút → dừng cả cây tiến trình (TERM rồi KILL), eval BLOCKED. Máy đọc dấu «chưa xong»/«quá hạn» ở
  đuôi lệnh chờ — tác tử khai «exit 0» khi lệnh còn chạy không thành PASS. Lượt cùng round chạy lại có
  nhật ký tên mới, không đọc kết quả của lượt trước (lệnh dài của lượt cũ bị cắt ngang có thể còn chạy chồng —
  giới hạn đã khai).
  Thước không cần tự ghi nhật ký. Giá trị sai → `s4-args` dừng gọi tên eval.
- **Eval trong `feature_loop.model_evals` chạy riêng** ở S4: tuần tự, SAU mọi lệnh máy khác (eval song
  song và chuỗi suite) — như làn ghim lại đã làm. Đọc bằng bộ đọc hẹp mà làn ghim lại cũng gọi; `model_evals` sai dạng giờ
  cũng dừng `s4-args` (trước chỉ dừng làn) — khoá CHỈ của làn ghim lại sai giá trị thì không.
- **Luật TOOL-KILL thêm một dòng:** «chuyển sang nền» không phải «bị giết» — chờ tới dòng `__EXIT=`,
  tối đa `long_running` hoặc 30 phút; quá thì BLOCKED với lý do chỉ việc cần làm.
- **Khoá vắng = như 2.24.0:** kho không khai `long_running` lẫn `model_evals` nhận prompt và thứ tự
  lệnh bằng hệt 2.24.0 (đo bằng vi phân với tag `v2.24.0`).
- **crm khi nhận:** khai `long_running: 45` cho `tro-ly-okr-bo-final-output/E6`, `E7` (và mọi eval model
  dài khác); E6/E7 đã có trong `model_evals` nên tự chạy sau suite.

### Lượt sửa giữ đủ, đếm đúng (hồ sơ `luot-sua-giu-du-dem-dung`, T2)

Gốc: crm, hồ sơ `don-okr-nhap-sai`, S4 lượt 2 ngày 07/10 trên 2.24.0 — ba lỗ, cả ba tái hiện được
trên dữ liệu crm.

- **Mục ngoài hợp đồng của lượt trước không còn rụng.** Trước đây mục nằm trên tệp mà lượt sửa có chạm
  bị bỏ khỏi carry (giả định «lượt sau tự tìm lại» — sai: tìm lỗi không tất định), nên nó biến mất khỏi
  thẻ Cổng Bằng chứng; crm mất ba mục và vá tay. Nay mọi mục ngoài hợp đồng đều mang sang; mục trên tệp
  bị chạm mang nhãn «(r<N> · tệp đã đổi)». Bản findings do MÁY chèn mục carry, không trông vào tác tử tổng
  hợp; mục chỉ được coi là đã in khi cùng tệp và tiêu đề bằng đúng hoặc mang nhãn «(r…)» — một mục
  mới cùng tệp có tên dài hơn không nuốt được mục cũ.
- **Eval ui-check carry giữ ảnh và mô tả của lượt gốc.** Trước đây khối carry cố ý bỏ `screenshot:` /
  `observed:` nên thẻ báo «Bằng chứng lớp nhìn-thấy: KHÔNG có» dù khung còn nguyên. Nay `s4-args` đọc
  khối của báo cáo lượt trước — chỉ khi cùng `run_id`, ảnh còn trên đĩa (đường tương đối hồ sơ hay
  đường tuyệt đối — crm có cả hai), mô tả thực chất — và workflow
  chép ba trường vào khối carry. Thiếu một điều kiện → không chép, một dòng stderr nói vì sao; thẻ báo
  «không có» là đúng sự thật.
- **Thước-vật không đếm nội dung nhập từ nhánh nền.** Gộp nhánh nền vào nhánh của vòng từng làm
  `thuoc-vat.mjs` đếm cả commit và tệp của hồ sơ khác (crm: vật +1780/−12 → +38/−11 khi đếm đúng; nhát
  2 → 0). Cha thứ hai của merge mà không có mốc sàn làm tổ tiên = nền, không đếm; nhánh con của chính
  vòng (worktree `execute-parallel`) vẫn đếm. `--giua-hai-luot` cùng bộ lọc.
- **Kho không gặp ba ca này:** không đổi gì — kho không merge từ nền giữ từng byte đầu ra thước-vật;
  args đời cũ (không trường khung, không `tepDoi`) chạy y như trước.
- **Giới hạn đã khai:** tệp mà cả vòng lẫn nền cùng sửa được đếm bằng cộng từng commit của vòng thay vì
  số ròng (git 2.37 chưa có `merge-tree --write-tree`) — một dòng thêm rồi xoá trong vòng đếm hai lần.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI: không chép gì** — 17 tệp giữ nguyên như 2.24.0.
- **Máy dev:** cài lại plugin ở MỌI phạm vi trên mỗi máy có phiên của kho, kiểm từng bản ghi cây phụ.
- **crm, theo thứ tự:**
  1. **Khi nào cài:** SAU hạn cứng 14/10 của đợt đang chạy, TRƯỚC khi mở hàng đầu tiên của đợt
     `sau-14-10` (`crm/docs/plan/dot-sau-14-10/README.md`: «gộp và cài cùng phiên bản trước khi mở đợt»).
     Không đổi engine dưới chân một vòng đang chạy tới hạn.
  2. Khai `long_running: 45` cho `tro-ly-okr-bo-final-output/E6` và `E7` (và mọi eval gọi model chạy dài
     khác). E6/E7 đã có trong `feature_loop.model_evals` nên tự chạy riêng sau suite — không khai thêm.
  3. **Đo trước → sau trên crm** khi nhận (tiền lệ `docs/findings/2026-09-23-nang-sau-kho-len-2-18-1.md`):
     trên cùng một cây, chạy lưới trước-merge và thẻ của các hồ sơ đang mở dưới 2.24.0 rồi 2.25.0 —
     phán quyết từng hồ sơ phải bằng nhau. Mốc này không đổi lưới trước-merge nên khác nhau ở đâu là
     tín hiệu cần đọc, không phải hành vi mới được hứa.

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng 07/10 — đủ ở hai hợp đồng, hai design doc và
`docs/research/known-limits-ledger.tsv`):

- `luot-sua-giu-du-dem-dung` (1 mục + 1 hạt giống): `s4-args` tự kiểm «mô tả khung đủ dài» bằng luật
  riêng (≥ 20 ký tự) thay vì luật của bộ kiểm bằng chứng — dòng mẫu chưa điền được mang sang rồi bị chặn
  rõ ở bước kiểm, không kết quả sai nào lọt · tệp mà cả vòng lẫn nền cùng sửa đếm bằng cộng commit thay
  vì số ròng. Ba mục mở hợp đồng mới ghi hạt giống `docs/plans/2026-10-07-hat-giong-carry-finding-sau-luot-sua.md`.
- `lenh-dai-chay-rieng` (2 mục ở Cổng Bằng chứng + phần thu phạm vi sau lượt 4): lượt chấm bị cắt ngang
  khi lệnh dài còn chạy thì lệnh của lượt cũ chạy chồng lượt mới (kết quả không lẫn — nhãn lượt) · ca đo
  nhận tiến trình mẫu theo dòng lệnh, có thể giết nhầm mẫu của bản tệp ca chạy song song · ca đo đọc mọi
  lỗi `ps` thành «đã chết». Thêm từ design doc: suite chưa khai được `long_running` (vẫn chia mảnh) ·
  ui-check và baseline không chạy riêng · bộ đọc `paths` của carry-plan chỉ nhận dạng một dòng `[...]`
  (dạng khối → chạy lại toàn bộ, phía an toàn) · chưa có ca tự động dưới zsh.
- **Một ca đo của cửa sổ ghim vào mục «Chưa phát hành» của tệp này** (AC-10 của `luot-sua-giu-du-dem-dung`)
  — sẽ đỏ ngay ở lần cắt số này. Mốc sửa ca đo, không sửa hồ sơ đã ký: nay nó đọc phần CHANGELOG mới hơn
  số ở mốc gốc của chính ca (đọc từ manifest tại `7b1afe1e`). Hình dạng 7 của lớp «thước ghim vào thứ sẽ
  đổi».

**Năm dòng số của luật (c)** — hai vòng (giờ VN; nguồn: giờ commit `contract.md`/`evidence-report.md`,
`usage-report.md` của hồ sơ):

| Dòng | `luot-sua-giu-du-dem-dung` (T2) | `lenh-dai-chay-rieng` (T2) |
|---|---|---|
| Làm-xong→quyết-được | `implemented` 10:23 → ký 14:08 ≈ **3 giờ 45 phút**, gồm hai lượt chấm (≈ 128 phút máy, lượt 1 vô hiệu) và một lần nâng phạm vi; chờ chữ ký sau lượt xanh 4 phút; **2 lượt chấm** | `implemented` 09:23 → ký 16:16 ≈ **6 giờ 53 phút**, gồm bảy lượt chấm (≈ 201 phút máy), vượt trần ba lượt có owner duyệt, một lần thu phạm vi; chờ chữ ký sau lượt xanh 34 phút; **7 lượt chấm** |
| Lượt gọi người / vòng (trần T2 3) | Trong thiết kế **1** — ký Cổng Bằng chứng (Cổng Phạm vi làn V, cửa veto mở). Ngoài thiết kế **1** — owner «nâng» phạm vi sau lượt 1 (AC-11, AC-12). 1 chạm mỗi lượt | Trong thiết kế **1** — ký Cổng Bằng chứng. Ngoài thiết kế **2** — cho chấm lượt 4 vượt trần · chọn thu phạm vi ở điểm dừng-vá sau lượt 4. 1 chạm mỗi lượt |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **1** — lượt 1 vô hiệu: khung Workflow chuyển nguyên văn yêu cầu gốc của phiên («sửa + thêm test») cho mọi tác tử chấm, hai tác tử tự sửa mã và commit; thước-vật bắt «cây đổi», máy hoàn lại | **3** — lượt 1 REJECT chỉ vì mảnh suite `mjs:1/3` đỏ không tái hiện · lượt 2 BLOCKED (tác tử suite hooks chết; sổ known-limits thiếu hàng của chính hồ sơ) · lượt 6 BLOCKED (tác tử mảnh `mjs:1/3` chết không nộp kết quả). Lượt 3–5 REJECT vì vật và thước thật |
| Token máy / vòng (out-token S4) · chứng-minh-vật / tìm-lỗi / tổng hợp | **134 337** · 60/17/23 % (97 542 · 36 795 theo lượt — lượt vô hiệu chiếm 73 %) | **264 299** · 60/13/27 % (51 718 · 43 033 · 37 155 · 35 417 · 41 638 · 24 870 · 30 468) |
| Phút máy / lượt chấm | 100 và 28 phút (6 018 s · 1 679 s), tổng ≈ 128 phút | 31 · 27 · 36 · 27 · 27 · 27 · 26 phút, tổng ≈ 201 phút (12 076 s) |

Phiên chính không đo token. Ngoài lượt chấm, `lenh-dai-chay-rieng` tốn thêm một lượt ghim lại sau chữ ký
(ca LN2 đỏ dưới bash 5 trên CI, cộng gộp `main` mang #278).

**Điều kiện tin cậy:** (i) không đổi thành phần đường verdict — diff của workflow lượt chấm nằm ở làn máy
(chạy nền, nhóm chạy-riêng, máy đọc dấu chưa-xong/quá-hạn) và ở bước tổng hợp (máy chèn mục carry);
không chạm finder, refute trong hợp đồng hay luật REJECT, không chạm `lib/`. (ii) Lượt chấm sai do
phép-đo-tự-dối giữa hai mốc: **0** — lượt 1 REJECT oan của `lenh-dai-chay-rieng` là mảnh suite chập chờn
(hạ tầng, đếm ở dòng 3), không phải phép đo tự dối; ngưỡng (a) đếm **0/2**. Dòng 4–5 cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở crm | hồ sơ có eval dài không còn mất lượt vì lệnh bị đọc thành «bị giết»; lượt sửa không còn phải vá tay mục rụng |
| 2 | ↓ ở crm | mục ngoài hợp đồng không biến mất khỏi thẻ nên người không phải hỏi lại «mục kia đâu» |
| 3 | ↓ | đúng lớp `lenh-dai-chay-rieng` chữa — crm mất bốn lượt vì nó |
| 4 | ↓ / vòng | ít lượt bị đốt hơn; mỗi lượt không đổi |
| 5 | ↑ nhẹ / lượt, ↓ / vòng | eval chạy-riêng tuần tự sau suite kéo dài đường găng của lượt; ít lượt bị đốt hơn |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .`.
**N không tăng so với mốc 2.24.0 (vẫn 1) — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.24.0 — 06/10/2026

Cửa sổ 2.23.0 → 2.24.0 nằm trong **một ngày** (06/10), có **hai vòng** được ký: `loc-paths-dong-mac-dinh`
(T3, PR #271) và `eval-thay-boi-co-chung` (T3, PR #272). Ngoài hồ sơ: ô `lo-trinh-cat-luot` mở và qua
Cổng Đáng (#274, #275). Kho chờ nhận là `crm`, neo ở hai hồ sơ crm: `go-khoa-goc-nhin` (bật
`stale_scope: paths` kèm lưới tạm `kiem-paths-dong.mjs`) và `gop-y-dung-cho` (25 eval máy đã ký ở năm hồ
sơ mất vật đo, làn ghim lại chết ở luật hai vế). Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên
`2.24.0`; `diagram-design` giữ `2.7.1`. Tag `v2.24.0` gắn tại commit ký mốc sau khi gộp.

**Vì sao 2.24.0, không 2.23.1:** một trường mới trong khuôn `evals.yaml` (`superseded_by`), một hậu tố mới
trên dòng `sha:` của mục Re-pin, và bộ lọc paths đổi kết luận trên kho đã bật khoá — hành vi mới.

### Bộ lọc hoá cũ theo paths đóng mặc định (hồ sơ `loc-paths-dong-mac-dinh`, T3)

- `risk_tiers.stale_scope: paths` chỉ bớt tệp khi MỌI mục `paths` của hồ sơ chứng được trên danh sách tệp git của bản đang kiểm; thư mục viết trơn có thật hiểu là cả thư mục. Mục lạ (`./`, `/` cuối, khoảng trắng, glob khớp thư mục) hay mục không trỏ tới tệp nào → hồ sơ giữ luật cũ, NOTE gọi tên mục và mã lý do (GUIDE §7.1). Hết ca cổng xanh mà sai của 2.21–2.23 (thư mục trần làm bộ lọc bỏ qua mọi tệp bên trong).
- Làn ghim lại đọc `paths` của ô ngoài làn máy bằng cùng bộ đọc và bộ phân loại của lib; danh sách `evals_not_machine_touched` chỉ có thể THÊM id so với trước (dòng trống, chú thích, thư mục trần, mục lạ nay được thấy).
- **Kho không bật khoá:** lưới trước-merge không đổi byte nào.
- **crm khi nhận:** gỡ lưới tạm `scripts/kiem-paths-dong.mjs` và bước CI «Paths đóng mặc định» trong `.github/workflows/acceptance.yml`; trước khi gỡ, chạy cả hai trên cùng cây — mọi mục lưới báo LỖI phải là mục bộ lọc từ chối, trừ thư mục viết trơn có thật (bộ lọc nhận như cả thư mục).

### Eval thay bởi hồ sơ đã ký (hồ sơ `eval-thay-boi-co-chung`, T3)

- Ô `test`/`script` khai `status: not-run` mang thêm `superseded_by: <hồ sơ thay>#AC-<n>` (khuôn ở GUIDE
  §7.1). Luật hai vế nhận ô đó — thay vì báo «hai vế mâu thuẫn» — khi máy chứng được ở CÂY ĐANG KIỂM: hồ sơ
  thay có chữ ký người (`signed-off`) và chưa nghỉ · **hồ sơ thay tự nêu thẻ `<slug cũ>/<id cũ>`** trong
  hợp đồng hoặc design doc của nó (bắt tay hai đầu) · AC được trỏ có trong hợp đồng thay và còn eval có mã
  thoát trong báo cáo đã ký của nó. Gãy điều nào → vẫn xung đột, thông điệp gọi tên điều gãy (chín mã lý do,
  GUIDE §7.1).
- Làn ghim lại, `recheck-evidence.cjs` và `pre-merge-check.sh` gọi chung một hàm; bên đọc kiểm lại chuỗi
  ở MỌI lượt — hồ sơ thay sau này nghỉ hay lùi trạng thái thì xung đột quay lại.
- Pin nói ra: dòng `sha:` của mục Re-pin nối ` · thay bởi hồ sơ đã ký: <E>→<hồ sơ>#<AC>` (vắng khi không có
  ô thay bởi); dòng JSON không thêm khoá.
- **Kho không khai trường mới:** lưới trước-merge và recheck giống từng byte bản trước (đo trên 110 hồ sơ của
  kit). Bộ máy cũ thấy con trỏ thì vẫn chặn — hướng an toàn.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI ĐỔI ba tệp:** `lib/evidence-core.cjs`, `scripts/pre-merge-check.sh`,
  `scripts/recheck-evidence.cjs` — chép lại theo INIT-CI-COPY-LIST (danh sách vẫn 17 tệp; luật thay bởi
  đọc thêm `lib/ac-line.cjs` và `lib/workspace-record.cjs`, cả hai đã có trong danh sách).
- **Máy dev:** cài lại plugin ở MỌI phạm vi trên mỗi máy có phiên của kho, kiểm từng bản ghi cây phụ.
- **crm, theo thứ tự:**
  1. Khai `superseded_by` cho 25 eval máy ở năm hồ sơ cũ (`the-gop-y-okr`, `khung-tao-okr-nhu-deal`,
     `tro-ly-okr-de-xuat`, `va-tro-ly-okr-sau-thu`, `nen-kara`) theo bảng `BANG-THAY-THE` của design doc
     `gop-y-dung-cho` — bảng đó đã nêu đủ thẻ `<hồ sơ>/<eval>` mà điều kiện bắt tay đòi; rồi ghim lại năm
     hồ sơ bằng một lượt làn. 11 eval ngoài làn máy của bảng không cần con trỏ.
  2. Gỡ lưới tạm `scripts/kiem-paths-dong.mjs` (kể cả nhánh «ĐÃ THAY» đọc bảng thay thế) và bước CI «Paths
     đóng mặc định» trong `.github/workflows/acceptance.yml`; trước khi gỡ, chạy lưới tạm và bộ lọc mới trên
     cùng cây — mọi mục lưới báo LỖI phải là mục bộ lọc từ chối, trừ thư mục viết trơn có thật.

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng — đủ ở hai hợp đồng và
`docs/research/known-limits-ledger.tsv`):

- `loc-paths-dong-mac-dinh` (5 mục + 1 hạt giống): kho không bật khoá mà bộ máy cài cũ hơn làn thì dòng ghim
  lại vắng danh sách ô ngoài làn máy bị chạm · cùng cấu hình, bộ máy trước 2.21 ghi sai «không khai paths» ·
  hai ca của chân trước-merge không phân biệt «bộ lọc nhận» với «rơi về luật cũ» · ô D6 dùng tên tệp chưa qua
  ngoặc git. Hạt giống `2026-10-06-hat-giong-ma-ly-do-rut-tu-ben-phat.md`: bộ kiểm tài liệu đối chiếu mảng
  mã khai báo, không đối chiếu chỗ phát mã.
- `eval-thay-boi-co-chung` (8 mục, ký sau dừng-vá lượt 2): phép đếm tổng của ma trận từ chối cộng một hằng ·
  ma trận neo vào `THAY_BOI_LY_DO` viết tay mà `chungThayBoi` không đọc — **cùng hình dạng với hạt giống của
  vòng kia** · hồ sơ thay đã được thực tế đóng nhận lý do «chưa ký» thay vì «đã khép» (chặn đúng, sai tên) ·
  năm mục độ chặt bộ kiểm (đối chứng dương trên bản sao, chiều đỏ của nhánh bốn đối số, đối chứng trước-merge
  của T05, mô tả E2 lệch số hàng). Không mục nào mở đường né đo.
- Lỗi thẻ giấu mục mang hậu tố ` (r<n>)` gặp lần 3 ở `eval-thay-boi-co-chung` (chuẩn hoá tay như 2.23.0);
  ngưỡng hạt giống `2026-10-03-hat-giong-bo-doc-ngoai-hop-dong-bo-dau-mang-sang.md` đã chạm, chưa mở ô (đóng
  băng meta-work) — chỗ cắt cho cửa sổ kế.

**Năm dòng số của luật (c)** — hai vòng (giờ VN; nguồn: giờ commit `contract.md`/`evidence-report.md`,
`usage-report.md` của hồ sơ):

| Dòng | `loc-paths-dong-mac-dinh` (T3) | `eval-thay-boi-co-chung` (T3) |
|---|---|---|
| Làm-xong→quyết-được | `implemented` 18:15 → ký 19:45 ≈ **1 giờ 30 phút**, gồm hai lượt chấm (≈ 81 phút máy); **2 lượt chấm** | `implemented` 18:29 → ký 20:04 ≈ **1 giờ 35 phút**, gồm hai lượt chấm (≈ 75 phút máy) và một điểm dừng-vá; chờ chữ ký sau `verified` 5 phút; **2 lượt chấm** |
| Lượt gọi người / vòng (trần T3 4) | Trong thiết kế **4** — Cổng Đáng · Cổng Phạm vi · Cổng 1.5 · ký Cổng Bằng chứng. Ngoài thiết kế: không đọc được từ kho (phiên khác) | Trong thiết kế **3** — Cổng Phạm vi · Cổng 1.5 · ký Cổng Bằng chứng (dừng-vá trình cùng lượt ký); Cổng Đáng ghi hộ từ câu giao việc. Ngoài thiết kế **1** — máy hỏi bật tự sửa CI ở S5. 1 chạm mỗi lượt. Owner tự gọi thêm: đối chiếu kit mới nhất trước khi duyệt, lệnh gộp |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0** — lượt 1 REJECT vì lưới «chỉ thêm» bắt dòng gọi bộ lọc bị sửa (phép đo thật) | **0** lượt chấm. Đường nền đầu vòng đỏ giả hai lần do máy (ghi tệp lúc suite chạy · tạo sẵn thư mục hồ sơ); CI `tests` đỏ một lần vì runner không mở được Chrome, chạy lại xanh |
| Token máy / vòng (out-token S4) · chứng-minh-vật / tìm-lỗi / tổng hợp | **60 931** · 64/10/26 % (34 554 · 26 377 theo lượt) | **77 091** · 40/35/25 % (41 214 · 35 877 theo lượt) |
| Phút máy / lượt chấm | 54 và 27 phút (3 237 s · 1 633 s), tổng ≈ 81 phút | 50 và 26 phút (2 981 s · 1 538 s), tổng ≈ 75 phút |

Phiên chính không đo token. Ngoài lượt chấm, `eval-thay-boi-co-chung` tốn thêm một lượt ghim lại sau chữ ký
(30 phút, 21 lệnh) vì hồ sơ đã ký `ra-co-ten-lam-va-trao` bị kéo vào diff (khai tệp ca vào khối gạch) và vì
gộp `main` mang thay đổi thư viện của vòng kia.

**Điều kiện tin cậy:** (i) không đổi thành phần đường verdict — diff cửa sổ ở engine chạm luật hai vế và bộ
lọc paths (`lib/evidence-core.cjs`), hai bên đọc (`recheck-evidence.cjs`, `pre-merge-check.sh`), làn ghim
lại, thân `acceptance-init` và SKILL feature-loop; KHÔNG chạm `acceptance-verify.js`, `s4-args.mjs`,
`lib/nhan-canh-gay.cjs`. (ii) Lượt chấm sai do phép-đo-tự-dối giữa hai mốc: **0** — ngưỡng (a) đếm **0/2**.
Dòng 4–5 cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở crm | năm hồ sơ mất vật đo ghim lại được thay vì treo; bộ lọc paths giữ phần tiết kiệm mà không cần lưới tạm |
| 2 | ↓ ở crm | không còn phải quyết tay «hồ sơ này chôn hay để đỏ» cho từng hồ sơ cũ |
| 3 | = | — |
| 4 | = | không chạm lượt chấm S4 |
| 5 | = | — |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .`.
**N không tăng so với mốc 2.23.0 — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.23.0 — 06/10/2026

Cửa sổ 2.22.0 → 2.23.0 kéo **ba ngày** (04–06/10), có **hai vòng** được ký: `nhan-lan-v-theo-huong`
(T2, PR #265) và `gia-lan-ghim-lai` (T2, PR #268). Ngoài hồ sơ: chiến dịch ghim lại 2.22.0 (#263) và một
bản sửa bước dọn của bộ đo trang lộ trình (#264). Kho chờ nhận là `crm`: neo ở hồ sơ crm
`kiem-cheo-sau-gop` (sự cố R1g — ~17 giờ từ ký tới gộp, ~14 giờ trong làn ghim lại); phiên điều phối
crm gọi mốc 06/10 ngay sau khi #268 gộp. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên
`2.23.0`; `diagram-design` giữ `2.7.1`. Tag `v2.23.0` gắn tại commit ký mốc sau khi gộp.

**Vì sao 2.23.0, không 2.22.1:** làn ghim lại có năm khoá mới, một mã thoát mới (4) và ba hành vi bật
mặc định — hành vi mới, không phải bản vá.

### Làn ghim lại rẻ hơn (hồ sơ `gia-lan-ghim-lai`, T2 — Vòng A)

Mọi điểm bật bằng khoá trong `_acceptance/config.yaml` (`feature_loop.*`); bảng khoá và gợi ý cho crm ở
GUIDE §7.1.

- **Ca chập chờn không còn làm đỏ cả lượt** (`repin_retry: 1`): lệnh đỏ được chạy lại **một lần, một
  mình**, sau khi khối song song xong; đạt lần hai → làn xanh, dòng pin có `chap_chon` gọi tên ca (rút từ
  năm khuôn đầu ra test phổ biến) và trỏ nhật ký lần đỏ. Lần hai vẫn đỏ → làn đỏ như cũ.
- **Eval gọi model thật không bao giờ chạy lại** (`model_evals: [<slug>/<E>]`) — kể cả khi một suite dùng
  chung nguyên văn câu lệnh với nó, ở env nào; mọi lần lệnh ấy chạy được đếm vào tổng kết.
- **Trần phút của làn** (`repin_budget_min`): quá trần → dừng cả cây tiến trình, ghi dòng `repin-do`
  (`ly_do: vuot-tran`, `chua_chay`; khi chạy với `--write`), **thoát mã 4**, không ghi pin. Đặt trần DƯỚI trần của công cụ gọi
  làn thì lượt kẹt để lại dấu thay vì biến mất.
- **Env giống CI cho suite** (`repin_ci_blank_env: [TÊN_BIẾN…]`): suite chạy với các biến tuỳ chọn đặt
  **rỗng** (thắng `.env` của Bun và `node --env-file`; `env -u` không mô phỏng được), eval vẫn chạy env đầy
  đủ — hai môi trường là hai phép đo. Dòng pin ghi `suites_env`.
- **Chi phí đo** (`repin_cost_cmd`): một lệnh in số dư trước và sau làn; hiệu số vào dòng tổng kết.

**Bật mặc định cho mọi kho (không cần khoá — duyệt ở Cổng Phạm vi):**

- Dòng **TỔNG KẾT** cuối mọi lượt: kết cục · phút · số lệnh · số lần gọi model thật · số ca chập chờn.
- Bị ngắt mềm (TERM/INT/HUP) → dòng `repin-do` với `ly_do: bi-ngat` (khi `--write`), thoát `128+n`.
- Mỗi lệnh chạy trong nhóm tiến trình riêng; dừng là giết **cả cây hậu duệ** (thu theo cha-con trước khi gửi
  tín hiệu, SIGTERM rồi SIGKILL sau 10 giây) — kể cả làn lồng trong eval.

Mã thoát của làn sau mốc: `0` xanh · `1` đỏ · `2` nguồn hỏng · `3` usage · **`4` vượt trần** · `128+n` bị ngắt.

Số trước → sau, dựng lại hai tình huống R1g trên fixture (AC-8, `_acceptance/gia-lan-ghim-lai/rang/so-do.mjs`):
ca chập chờn trong suite đỏ → xanh có tên ca · lượt bị ngắt giữa lệnh để lại dấu 0 → 1 · tiến trình con
sót sau ngắt 1 → 0 · lỗi chỉ hiện ở CI bắt được trên máy 0 → 1.

Đ1 (test chỉ làm hoá cũ hồ sơ gọi tên nó) và Đ2 (carry theo băm đầu vào) **không ở mốc này** — hạt giống
`docs/plans/2026-10-06-hat-giong-gia-lan-ghim-lai-vong-b.md`, mở sau khi đo lại trên crm không có E11.

### Thẻ làn V đọc theo hướng (hồ sơ `nhan-lan-v-theo-huong`, T2)

- Hồ sơ máy-đi-trước (cửa veto mở) in dòng **báo** `đi tiếp hay kéo lại: đi tiếp` — máy đã điền sẵn, người
  không phải gõ gì để để yên; nút đổi thành «Kéo lại». Ô «veto hay để yên» cũ làm owner đọc ngược ở crm.
- `/acceptance-gate:signoff` vẫn nhận `veto:` / `để yên` — người quen tay không mất lượt.

**Kho tiêu thụ làm gì khi nhận:**

- **Lớp chép CI KHÔNG đổi** (17 tệp như 2.22.0) — không chép gì.
- **Máy dev:** cài lại plugin ở MỌI phạm vi trên mỗi máy có phiên của kho, kiểm từng bản ghi cây phụ.
- **Muốn bật khoá làn ghim lại:** khai trong `_acceptance/config.yaml` theo GUIDE §7.1. Trước khi liệt
  `repin_ci_blank_env`, soát test tự bỏ qua theo khoá (`skipIf`): dưới env giống CI chúng sẽ bị bỏ qua trong
  làn như ở CI. Không khai khoá: chỉ nhận ba phần bật mặc định ở trên.

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng — đủ ở Notes của hai hợp đồng):

- `gia-lan-ghim-lai` (8 mục): ô «song song × env CI» của ma trận lệnh-dùng-chung chưa có phép phá riêng ·
  GUIDE §7.1 mang cột gợi ý riêng cho crm · gõ nhầm id trong `model_evals` không bị báo (eval model thật
  sẽ bị chạy lại) · lệnh chạy tách nhóm nên công cụ gọi làn giết theo nhóm không còn tới suite (làn tự giết
  cây khi nhận tín hiệu) · mẫu `repin-do` trong SKILL ghi `chap_chon: []` trái luật hiện diện · số chi phí có
  dấu phân cách nghìn bị đọc sai · ca vượt trần chỉ ghim mã thoát · lời hứa «vượt trần không ghi pin» đo ở
  chế độ không ghi. Tiến trình tách hẳn khỏi cây (double-fork) vẫn thoát lưới giết.
- `nhan-lan-v-theo-huong` (1 mục): ca `NC-AC4-cu` neo commit lõi, không phủ hai commit vá sau của vòng cũ.
- Lỗi kit phát hiện ở Cổng 2 của `gia-lan-ghim-lai`: thẻ giấu mục ngoài hợp đồng mang hậu tố ` (r<n>)`
  (bên viết nối hậu tố sau `**`, bên đọc không nhận) — việc riêng đã tách; tới khi sửa, đếm tay số mục khối
  «Ngoài hợp đồng» với số Ngoài-n trên thẻ trước khi ký.

**Năm dòng số của luật (c)** — hai vòng (giờ VN; nguồn: giờ commit `contract.md`, `decisions.jsonl`,
`run-log.jsonl`, `usage-report.md` của hồ sơ; token đầu ra S4 đọc lại bằng `wf-usage --json`):

| Dòng | `nhan-lan-v-theo-huong` (T2) | `gia-lan-ghim-lai` (T2) |
|---|---|---|
| Làm-xong→quyết-được | `implemented` 20:11 04/10 → ký 04:01 05/10 ≈ **7 giờ 50 phút**, gồm hai lượt chấm (≈ 58 phút máy) và chờ chữ ký qua đêm 6 giờ 38 phút (`verified` 21:23 → ký 04:01); **2 lượt chấm** | `implemented` 12:03 06/10 → ký 16:04 06/10 ≈ **4 giờ 1 phút**, gồm ba lượt chấm (≈ 111 phút máy), một điểm dừng-vá và chờ chữ ký ≈ 1 giờ 40 phút (`verified` 14:24 → ký 16:04); **3 lượt chấm** |
| Lượt gọi người / vòng (trần T2 3) | Trong thiết kế **1** — ký Cổng Bằng chứng; Cổng Phạm vi làn V. Ngoài thiết kế **0**. 1 chạm | Trong thiết kế **3** — Cổng Phạm vi · dừng-vá (lượt 2 cùng lớp lỗi lượt 1) · ký Cổng Bằng chứng. Ngoài thiết kế **1** — câu hỏi thiết kế ở S1 (Đ3 THAY hay THÊM). 1 chạm mỗi lượt. Owner tự gọi thêm (không tính máy hỏi): rà theo North Star, bảng so sánh trước/sau, thu phạm vi về Vòng A qua phiên điều phối |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0** — lượt 1 REJECT vì phép đo của chính vòng | **0** — lượt 1 và 2 REJECT vì finding thật trong hợp đồng. Lượt 2 còn một suite đỏ vì sổ known-limits thiếu dòng cho đề xuất của chính hồ sơ (ca P179) — không phải lý do REJECT |
| Token máy / vòng (out-token S4) · chứng-minh-vật / tìm-lỗi / tổng hợp | **47 442** · 52/20/29 % (29 081 · 18 361 theo lượt) | **111 702** · 58/14/28 % (45 163 · 37 698 · 28 841 theo lượt) |
| Phút máy / lượt chấm | 28–30 phút (1 692–1 811 s), tổng ≈ 58 phút; găng 1 540–1 738 s | 32–46 phút (1 945–2 731 s), tổng ≈ 111 phút; găng 1 808–2 605 s |

Phiên chính không đo token.

**Điều kiện tin cậy:** (i) không đổi thành phần đường verdict — diff cửa sổ ở engine chạm làn ghim lại
(`feature-loop/scripts/repin-lane.mjs` + ba thư viện mới), thẻ (`scripts/gate-card.js`), thân lệnh
`signoff`/`acceptance-init`, SKILL feature-loop và bản luật ngôn ngữ mặt người; KHÔNG chạm
`acceptance-verify.js`, `s4-args.mjs`, `lib/nhan-canh-gay.cjs`, `recheck-evidence.cjs`, `pre-merge-check.sh`.
(ii) Lượt chấm sai do phép-đo-tự-dối giữa hai mốc: **0** — ngưỡng (a) đếm **0/2**. Dòng 4–5 cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở crm | làn ghim lại không còn chết vì một ca chập chờn rồi chạy lại cả lượt (R1g: ~14 giờ trong làn) |
| 2 | ↓ ở crm | lượt kẹt để lại dấu và tổng kết thay vì người phải hỏi «làn đang ở đâu»; thẻ làn V không còn ô mời gõ |
| 3 | = | — |
| 4 | = | không chạm lượt chấm S4 (làn ghim lại nằm ngoài S4) |
| 5 | = | — |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .`.
**N không tăng so với mốc 2.22.0 — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.22.0 — 04/10/2026

Cửa sổ 2.21.0 → 2.22.0 kéo **hai ngày** (03–04/10), có **một vòng** được ký, chạm engine đúng một tệp:
`trang-lo-trinh-doc-mot-phut` (T2, ô PR #259, vật PR #260, Cổng Giá trị «release» PR #261). Ngoài hồ sơ:
chiến dịch ghim lại 2.21.0 (#257) và ghi chú mốc (#254). Kho chờ nhận là `crm`: neo ở hồ sơ crm
`cap-nhat-tuan-okr`, owner quyết 04/10 «gửi crm, ngay sau khi cắt 2.22.0». Mốc đi **làn V**, không dựng
răng mới. Hai gói cùng lên `2.22.0`; `diagram-design` giữ `2.7.1`. Tag `v2.22.0` gắn tại commit ký mốc
sau khi gộp.

**Vì sao 2.22.0, không 2.21.1:** trang lộ trình đổi bố cục và chữ mà người dùng đọc — một hành vi mới,
không phải một bản vá.

### Trang lộ trình đọc trong một phút (hồ sơ `trang-lo-trinh-doc-mot-phut`, T2)

- `LO-TRINH.html` mở bằng **một thẻ mỗi lộ trình**: làm tiếp (mã + câu giao + lệnh mở chép được) · số chỗ
  cần sửa trong kế hoạch · mốc kế tiếp kèm số ngày còn lại (mốc đã qua mà còn việc chưa giao thì nêu tên)
  · tiến độ (đã giao · đang làm · chưa bắt đầu, nhóm khác hiện riêng khi có).
- Mỗi lộ trình một mục: **chỗ cần sửa** bằng tiếng sản phẩm (câu cờ máy dịch bằng một bảng, mỗi chỗ là
  liên kết tới đúng hàng) → việc còn mở → **việc đã giao gập lại** → dải mốc. Hồ sơ không thuộc kế hoạch
  nào **gập ở cuối trang, một lần** cho cả trang.
- Đọc được trên điện thoại (bảng thành thẻ hàng), tiêu đề cột dính khi cuộn, sáng/tối theo máy.
- Trang vẫn tĩnh và tất định: một script nội tuyến duy nhất tính số ngày lúc xem; tắt script trang vẫn đủ.
- Đo trên crm `onehub` thật: **2.879 / 11.587 px** ở 1440, màn đầu đủ ba điều ở 1440 và 375, tương phản
  thấp nhất 6,35 (trang cũ 1,91 ở tối), vùng bấm 44 px.
- **Không đổi:** lớp phân tích, thẻ `/acceptance-gate:start`, `--hang`, `--mo-o` (ca LT-100 so khớp với bộ
  máy `v2.21.0`). **Kho không khai lộ trình:** bản đồ và thẻ giữ từng byte.
- Bộ đo trang trên Chrome thật đi kèm kit: `tests/scripts/lo-trinh-do-trang.mjs` (CDP, ngày đóng băng).

**Kho tiêu thụ làm gì khi nhận:**

- **Kho còn đường chép: chép lại MỘT tệp** của lớp chép CI — `scripts/lo-trinh.mjs` (danh sách vẫn 17
  tệp). Đo trước → sau bằng phép vi phân.
- **Kho khai lộ trình:** `LO-TRINH.html` đổi một lần khi nhận — chạy `product-map.mjs --root .` trong PR
  nhận mốc rồi commit trang; `--check` đỏ cho tới khi vẽ lại. Kho không khai: không làm gì thêm.
- **Máy dev:** cài lại plugin ở MỌI phạm vi trên mỗi máy có phiên của kho, kiểm từng bản ghi cây phụ.

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng — đủ ở Notes của hợp đồng):

- Dải mốc sắp ngày theo chuỗi: ngày thiếu số 0 (`2026-10-5`) xếp sai, ô «Mốc kế tiếp» có thể chỉ mốc xa
  hơn. Dữ liệu crm thật mọi ngày đủ số 0.
- Năm điểm độ chặt của thước (đường dẫn khai ở eval, đối chứng dương LT-100, ca cột có dữ liệu phải hiện,
  câu lỗi mong đợi rút từ hàm dịch, LT-73-khong-truong-do không ghim thông điệp).
- Đề xuất bản chiếu ReUI của trang (owner xem bản mẫu 04/10): hạt giống
  `docs/plans/2026-10-04-hat-giong-ban-chieu-reui-trang-lo-trinh.md` — kit chỉ xuất JSON, trang ReUI sống
  ở kho tiêu thụ, mã block Pro không vào kit.

**Năm dòng số của luật (c)** — một vòng (giờ VN, 03–04/10; nguồn: giờ commit `contract.md`,
`decisions.jsonl`, `run-log.jsonl`, `usage-report.md` của hồ sơ):

| Dòng | `trang-lo-trinh-doc-mot-phut` (T2) |
|---|---|
| Làm-xong→quyết-được | 22:50 03/10 → ký 04:32 04/10 ≈ **5 giờ 42 phút**, gồm ba lượt chấm (≈ 65 phút máy) và khoảng chờ chữ ký qua đêm 4 giờ 15 phút (`verified` 00:17 → ký 04:32); **3 lượt chấm** |
| Lượt gọi người / vòng (trần T2 3) | Trong thiết kế **2** — Cổng Đáng · ký Cổng Bằng chứng; Cổng Phạm vi làn V. Ngoài thiết kế **0**. 1 chạm mỗi lượt. Sau ký: Cổng Giá trị «release» (owner xem lại giao diện và bản mẫu ReUI trước khi quyết — owner tự gọi, không phải máy hỏi) |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0** — lượt 1 và 2 REJECT vì finding thật trong hợp đồng. Sau chữ ký một lượt CI đỏ vì phông chữ Ubuntu làm một bản sao chiều đỏ phá thêm thước (sửa nhát tiêm, ghim lại ba hồ sơ) — không phải lượt chấm |
| Token máy / vòng (out-token S4) · chứng-minh-vật / tìm-lỗi / tổng hợp | **153 849** · 48/20/32 % (54 105 · 54 470 · 45 274 theo lượt) |
| Phút máy / lượt chấm | 20–24 phút (1 230–1 420 s), tổng ≈ 65 phút; găng 1 063–1 234 s |

Phiên chính không đo token. Cổng Đáng tính vào «trong thiết kế» theo tiền lệ 2.20.0.

**Điều kiện tin cậy:** (i) không đổi thành phần đường verdict — diff cửa sổ ở engine chỉ là
`scripts/lo-trinh.mjs` (lớp vẽ), không chạm `acceptance-verify.js`, `s4-args.mjs`, `lib/nhan-canh-gay.cjs`,
`recheck-evidence.cjs`, `pre-merge-check.sh`. (ii) Lượt chấm sai do phép-đo-tự-dối giữa hai mốc: **1** —
lượt 1 chấm E5 ĐẠT từ dòng tổng kết của một lệnh không bao giờ in dòng ghim LT-94 (eval trỏ nhầm mảnh);
lượt 2 bắt, lượt 3 tách eval theo lệnh. Ngưỡng (a) đếm **1/2** — chưa mở vòng đo-thước. Dòng 4–5 cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | = | không chạm đường từ làm-xong tới cổng |
| 2 | ↓ ở crm | màn đầu trang lộ trình trả lời làm gì tiếp · kẹt gì · lệch gì trong một phút — câu hỏi tiến độ (lượt 4 OKR: 23/48 tin owner) đọc được thay vì hỏi |
| 3 | = | — |
| 4 | = | không chạm lượt chấm |
| 5 | = | — |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .`.
**N không tăng so với mốc 2.21.0 — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.21.0 — 03/10/2026

Cửa sổ 2.20.0 → 2.21.0 kéo **hai ngày** (02–03/10), có **năm vòng** được ký, cả năm chạm engine:
`viec-ke-theo-plan` (T2, PR #246) và `lo-trinh-tren-du-lieu-that` (T2, PR #252, Cổng Giá trị «release»
PR #253) — lộ trình cạnh bản đồ; `loi-moi-tran-luot-loi-song-co-gia` (T2, PR #247) — lối ra ở trần lượt;
`lan-ghim-lai-giu-tron-loi-loi` (T2, PR #250) và `lan-ghim-lai-theo-paths` (T3, PR #255) — làn ghim lại.
Thêm `diagram-design` 2.7.1 (xuất PNG gọi `python3`, e2df88ff) và sáu PR không gắn hồ sơ (bàn giao, hạt
giống, ô, một ca kiểm DK15). Kho chờ nhận là `crm`: lộ trình neo ở hồ sơ crm `cap-nhat-tuan-okr`, làn
ghim lại neo ở số đo chi phí làn của crm 02/10. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên
`2.21.0`; `diagram-design` lên `2.7.1`. Tag `v2.21.0` gắn tại commit ký mốc sau khi gộp.

**Vì sao 2.21.0, không 2.20.1:** cửa sổ thêm hành vi mới cho người dùng — ổ cắm lộ trình, dòng thẻ start
mới, khối «Lối ra» trên thẻ, hai khoá cấu hình mới của làn ghim lại.

### Lộ trình cạnh bản đồ (hồ sơ `viec-ke-theo-plan` + `lo-trinh-tren-du-lieu-that`, T2)

- Kho khai `lo_trinh.tep` trong `_acceptance/config.yaml` (một tệp, hoặc một danh sách) trỏ tệp ý định
  JSON (khuôn `skills/acceptance/references/lo-trinh-template.json`). Kit chỉ **đọc**; trạng thái từng hàng
  suy từ hồ sơ bằng đúng hàm xếp ô của bản đồ, lời tự khai so theo **nhóm** (đã giao · đang làm · chưa
  làm), hàng nối hồ sơ hai chiều (`slug` của hàng, hoặc ô cơ hội ghi `lo_trinh_ma`).
- `LO-TRINH.html` vẽ cạnh `PRODUCT-MAP.md` ở bốn lệnh đóng cổng; `--check` canh nó. Thẻ
  `/acceptance-gate:start` in các dòng máy dựng sẵn (hàng kế · hàng trễ · tin theo lời · cờ · đường mở
  trang) và đặt hàng kế làm một lựa chọn mở. `/feature-loop:feature-loop <mã hàng>` dựng ô cơ hội từ hàng
  (ngưỡng đề xuất từ `bat_khi` và ngày mốc) rồi dừng ở Cổng Đáng.
- Đo trên crm `onehub` + lộ trình OKR: hàng kế đúng, 8 cờ, 0 nhiễu (lát 1: hàng kế sai, 18 cờ, 11 nhiễu).
- **Kho không khai:** bản đồ và thẻ giữ từng byte; mã lộ trình không được nạp.

### Lối ra ở trần lượt (hồ sơ `loi-moi-tran-luot-loi-song-co-gia`, T2)

- Thẻ Cổng Bằng chứng chưa-ký-được in khối «Lối ra» — lối sống, có giá, khuyến nghị tất định — khi vòng
  chạm trần lượt hoặc một eval hỏng lặp lại (`scripts/loi-ra-tran-luot.cjs`). Thẻ ký được không đổi.

### Làn ghim lại theo `paths` + suite song song (hồ sơ `lan-ghim-lai-theo-paths`, T3)

- Khoá `risk_tiers.stale_scope: paths` (mặc định tắt): hoá cũ chỉ khi diff chạm `paths` các eval — bộ lọc sau luật cũ, chỉ thu; NOTE gọi tên tệp bỏ qua. Hàm một nguồn `staleByPaths` (`lib/evidence-core.cjs`) cho lưới trước-merge và `--skip-unchanged`.
- Cờ `--stale-all` cho `pre-merge-check.sh` — chiến dịch ghim lại ở mốc ép luật cũ.
- Khoá `feature_loop.repin_parallel_suites: true` (mặc định tắt): suite trong làn chạy song song, eval nối đuôi.
- **Kho tiêu thụ:** không bật khoá thì không đổi gì; bộ máy làn chỉ đòi `staleByPaths` khi kho bật khoá.
- **Chưa bật `stale_scope: paths`:** mục `paths` là thư mục trần (không dấu sao) làm bộ lọc bỏ qua mọi tệp trong thư mục — cổng xanh mà sai (crm có dạng này). Làm lại theo khuôn đóng mặc định: hạt giống `docs/plans/2026-10-03-hat-giong-loc-paths-dong-mac-dinh.md`.

### Làn ghim lại giữ trọn lời lỗi (hồ sơ `lan-ghim-lai-giu-tron-loi-loi`, T2)

- Lệnh đỏ trong `repin-lane.mjs` ghi nhật ký trọn ra `.acceptance-runs/<slug>/repin-<run_id>/`; lệnh xanh không sinh tệp.
- Làn đỏ `--write` để một dòng `kind: repin-do` mỗi slug (mã lượt dưới `lan_id` · lệnh đỏ · mã · nhật ký · `wall_s` · `so_lenh` · tải máy); pin và evidence không đổi; mã thoát không đổi. Mã lượt đỏ KHÔNG mang khoá `run_id` nên không bao giờ thành bằng chứng eval.
- Thư mục `.acceptance-runs/` tự đặt `.gitignore` (`*`) khi làn tạo nó — kho chưa khai không còn bị nhật ký lọt vào git.
- Dòng `kind: repin` mang thêm `wall_s` và `so_lenh` (khuôn `REPIN-TEMPLATE` cập nhật).
- Mô-đun mới `feature-loop/scripts/tai-may.mjs` (không bao giờ ném). `.acceptance-runs/` vào `.gitignore` của kit.

**Kho tiêu thụ làm gì khi nhận:**

- **Kho còn đường chép: chép lại năm tệp** của lớp chép CI (GUIDE §5.3) — danh sách nay **17 tệp** (thêm
  `scripts/lo-trinh-khoa.cjs`, `scripts/lo-trinh.mjs`); trong đó đổi so 2.20.0: hai tệp mới ấy,
  `scripts/pre-merge-check.sh`, `scripts/product-map.mjs`, `lib/evidence-core.cjs`. Đo trước → sau bằng
  phép vi phân, không đọc số tuyệt đối.
- **Máy dev:** cài lại plugin ở MỌI phạm vi trên mỗi máy có phiên của kho, kiểm từng bản ghi cây phụ.
- **Muốn dùng lộ trình:** viết tệp ý định JSON, khai `lo_trinh.tep`, thêm `LO-TRINH.html` vào
  `risk_tiers.t1_skip_globs` cạnh `PRODUCT-MAP.md`. Viết danh sách tệp có thụt (`    - a.json`) hoặc
  dạng dòng (`[a.json, b.json]`) — dạng sát lề chưa đọc được (giới hạn dưới).
- **Đừng bật `stale_scope: paths`** cho tới khi hạt giống đóng mặc định được thi công.

**Giới hạn đã khai** (owner định tuyến ở Cổng Bằng chứng từng vòng — đủ ở Notes của năm hợp đồng):

- Khoá `lo_trinh.tep` có mặt mà không đọc ra tệp nào (danh sách YAML sát lề) thì kit im như chưa khai —
  hạt giống `docs/plans/2026-10-03-hat-giong-khoa-lo-trinh-khai-ma-khong-doc-ra.md`.
- `stale_scope: paths` có mã nhưng chưa bật: thư mục trần trong `paths` làm bộ lọc bỏ qua.
- Ca P179 (sổ known-limits ít hơn số đề xuất) đốt hai lượt chấm trong cửa sổ — cùng một lớp hai lần.

**Năm dòng số của luật (c)** — năm vòng (giờ VN, 02–03/10; nguồn: giờ commit `contract.md`,
`decisions.jsonl`, `run-log.jsonl`, `usage-report.md` của từng hồ sơ):

| Dòng | `viec-ke-theo-plan` (T2) | `lo-trinh-tren-du-lieu-that` (T2) | `loi-moi-tran-luot-loi-song-co-gia` (T2) | `lan-ghim-lai-giu-tron-loi-loi` (T2) | `lan-ghim-lai-theo-paths` (T3) |
|---|---|---|---|---|---|
| Làm-xong→quyết-được | 22:20 → ký 06:19 ≈ **7 giờ 59 phút**, gồm hai «trả» và một khoảng chờ qua đêm 4 giờ 46 phút; `verified` → ký 3 phút; **5 lượt chấm** | 09:46 → ký 14:56 ≈ **5 giờ 9 phút**, gồm khoảng chờ 4 giờ 3 phút trước «trả»; `verified` → ký 15 phút; **2 lượt** | 06:31 → ký 07:29 ≈ **58 phút**; `verified` → ký 4 phút; **2 lượt** | 06:51 → ký 10:01 ≈ **3 giờ 10 phút**; `verified` → ký 19 phút; **4 lượt** (lượt 4 vượt trần, owner cho phép đích danh) | 14:27 → ký 17:32 ≈ **3 giờ 5 phút**; `verified` → ký 4 phút; **4 lượt** (lượt 4 vượt trần, owner cho phép đích danh) |
| Lượt gọi người / vòng (trần T2 3 · T3 4) | Trong thiết kế **4** — Cổng Đáng · Cổng Bằng chứng ba lần («trả» · «trả» · ký); Cổng Phạm vi làn V. Ngoài thiết kế **0**. 1 chạm mỗi lượt | Trong thiết kế **3** — Cổng Đáng · «trả» · ký; Cổng Phạm vi làn V. Ngoài thiết kế **0**. Sau ký: Cổng Giá trị «release» | Trong thiết kế **2** — Cổng Phạm vi (vòng CỘNG, owner duyệt) · ký. Ngoài thiết kế **0**; lời mở vòng không có dòng sổ — không đọc được ở đây | Trong thiết kế **3** — Cổng Đáng · «trả» · ký; Cổng Phạm vi làn V. Ngoài thiết kế **1** — dừng-vá sau lượt 2, owner chọn «đổi khuôn», 1 chạm | Trong thiết kế **5** — Cổng Đáng · Cổng Phạm vi · Gate 1.5 · «trả» · ký. Ngoài thiết kế **1** — dừng-vá sau lượt 2, «đổi khuôn», 1 chạm. **6 so trần 4** |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **1** — lượt 2 REJECT chỉ vì ca P179 (sổ known-limits 386 < 388), vật không đổi | **0** | **0** | **0 lượt thêm** — lượt 2 REJECT có P179 nhưng còn 5 finding trong hợp đồng, đằng nào cũng chấm lượt 3 | **0** |
| Token máy / vòng (out-token S4) · chứng-minh-vật / tìm-lỗi / tổng hợp | **167 904** · 45/20/35 % | **67 899** · 52/18/30 % | **63 452** · 47/22/32 % | **178 990** · 40/29/32 % | **163 564** · 46/25/30 % |
| Phút máy / lượt chấm | 21–27 phút (1 240–1 591 s), tổng ≈ 116 phút; găng 1 149–1 459 s | 20–21 phút, tổng ≈ 41 phút; găng 1 093–1 159 s | 24–28 phút, tổng ≈ 52 phút; găng 1 304–1 558 s | 21–22 phút, riêng lượt 2 **62 phút** (bước tổng hợp kéo 2 465 s), tổng ≈ 126 phút; găng 1 085–1 190 s | 20–24 phút, tổng ≈ 87 phút; găng 1 036–1 289 s |

Cả cửa sổ: 15 lượt chấm, 641 809 out-token S4. Phiên chính của cả năm vòng không đo token. Cổng Đáng tính
vào «trong thiết kế» (trần = số cổng thiết kế: Đáng · Phạm vi · Bằng chứng, T3 thêm Gate 1.5); dừng-vá
không phải một cổng nên xếp ngoài thiết kế, theo tiền lệ 2.20.0. **Ba vòng vượt trần lượt gọi người**
(`viec-ke-…` 4/3, `lan-ghim-lai-giu-…` 4/3, `lan-ghim-lai-theo-paths` 6/4): mọi lượt vượt là «trả» ở
Cổng Bằng chứng hoặc dừng-vá — lỗi trong vật hay thước bị bắt tại cổng, không phải lượt hỏi xác nhận.

**Điều kiện tin cậy:** (i) không vòng nào đổi thành phần đường verdict — diff cửa sổ không chạm
`acceptance-verify.js`, `s4-args.mjs`, `lib/nhan-canh-gay.cjs`, `recheck-evidence.cjs`.
`lan-ghim-lai-theo-paths` đổi luật HOÁ CŨ (`pre-merge-check.sh`, `lib/evidence-core.cjs`) kèm răng hai
chiều: chiều im (khoá tắt → đầu ra bằng hệt bản base; `--stale-all` bằng hệt luật cũ), chiều đỏ (ma trận
15 ô, tiêm lỗi môi trường). `loi-moi-tran-luot-…` chỉ thêm khối trên thẻ chưa-ký-được, răng hai chiều
(đỏ AC-1/2/4 + đột biến; im AC-3/6 bằng từng byte). (ii) Lượt chấm sai do phép-đo-tự-dối giữa hai mốc:
**0** — mọi finding nhắm vào thước đều bị bắt trong chính lượt đó. Dòng 4–5 cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | = | không chạm đường từ làm-xong tới cổng |
| 2 | ↓ ở crm | lộ trình trả lời câu hỏi tiến độ trên thẻ start (lượt 4 OKR: 23/48 tin owner là hỏi tiến độ); khối «Lối ra» cho người một lựa chọn có giá thay vì hỏi mở ở trần lượt |
| 3 | = | — |
| 4 | = | không chạm lượt chấm |
| 5 | ↓ ở làn ghim lại khi kho bật suite song song | `repin_parallel_suites` (mặc định tắt) |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc bằng `scripts/hieu-chuan-moc.mjs --root .`.
**N không tăng so với mốc 2.20.0 — dòng vô hiệu ở mốc này**, cấm đọc thành «0 sự cố».

## 2.20.0 — 01/10/2026

Cửa sổ 2.19.0 → 2.20.0 kéo **hai ngày**, có **ba vòng** chạm engine: `thuoc-biet-truoc-khong-phan-duoc`
(T2, ký 01/10, PR #233), `luot-cham-ghi-vao-cay` (T3, ký 01/10, PR #234) và `nghi-van-mang-co-qua-han`
(T2, máy thông 01/10, cửa veto mở, PR #232) — vòng thứ ba là suất meta duy nhất của cửa sổ, mở theo lời
owner giữa lượt chấm của vòng thứ nhất. Thêm PR #231 sửa một dòng `CONTEXT.md`. Kho chờ nhận là `crm`:
ba neo của cửa sổ đều là hồ sơ crm. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên `2.20.0`;
`diagram-design` giữ `2.7.0`. Tag `v2.20.0` gắn tại commit ký mốc sau khi gộp.

**Vì sao 2.20.0, không 2.19.1:** cửa sổ thêm hành vi mới ở đường chấm — bước chuẩn bị tham số từ chối một
loại eval, bộ chấm có một nhãn trạng thái mới, lưới trước-merge và bộ kiểm lại bằng chứng đọc nhãn đó.

**Đổi gì** — đường chấm thôi tin hai thứ nó không kiểm được:

- **Giám khảo chỉ được hỏi điều nằm trong danh sách tệp.** Hội đồng chấm chỉ đọc đúng `inputs`, không
  diff, không lệnh — nên một eval `judgment` hỏi diff của lượt hay bảo chạy lệnh là câu không ai trả lời
  được. Nay `s4-args.mjs` thoát 2, gọi tên eval, thay vì để nó thành UNCERTAIN mà người phải quyết lại.
  Luật đi kèm: **chọn người chấm theo từng vế** của tiêu chí — vế một lệnh đọc được giao cho
  script/test của kho, vế chỉ thấy trên màn giao ui-check, vế cần cân với ý định trên một tệp giao
  judgment với đúng tệp đó, vế không ai đọc được thì khai giới hạn ngay lúc viết.
- **Lượt chấm mà cây đổi giữa chừng không dùng được.** Khi tác tử chấm ghi vào cây (commit lạ, hoặc sửa
  tệp vật đang theo dõi), lượt mang nhãn «cây đổi trong lượt chấm»: bước sau-lượt thoát 6, thẻ Cổng Bằng
  chứng khoá ký và in tệp + sha, lưới trước-merge và bộ kiểm lại bằng chứng chặn hồ sơ đã ký trên lượt
  ấy. Máy chấm lại cùng round; lượt kế chỉ được sinh tham số khi thay đổi lạ đã được hoàn lại.
- **Hồ sơ đã nghỉ thôi làm đỏ bộ kiểm theo ngày.** Ca RT13 từng đỏ trên `main` từ 01/10 chỉ vì timebox
  của một hồ sơ đã nghỉ đã qua; bộ quét thẻ khởi động nay tính cờ quá hạn cho cả lối nghỉ.

**Kho tiêu thụ làm gì khi nhận:**

- **Kho còn đường chép: chép lại ba tệp** của lớp chép CI (GUIDE §5.3) — `lib/nhan-canh-gay.cjs`,
  `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs` — trong một PR, đo trước → sau bằng phép vi
  phân (bản chép cũ so bản mới), không đọc số tuyệt đối.
- **Máy dev:** cài lại plugin ở MỌI phạm vi trên mỗi máy có phiên của kho, rồi mở lại phiên. Cây phụ
  (worktree) có bản ghi cài riêng: kiểm từng bản ghi bằng `claude plugin list --json`, đừng tin câu «đã
  mới nhất» — câu ấy từng bỏ sót hai cây phụ ở 2.19.0.
- **Nhận ở ranh giới vòng.** Hồ sơ đang mở có eval `judgment` hỏi diff hoặc bảo chạy lệnh sẽ bị chặn ở
  lượt chấm kế — quét trước bằng `docs/findings/assets/2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs`,
  chuyển vế đó sang script/test của kho.

**Giới hạn đã khai** (owner quyết ở Cổng Bằng chứng của từng vòng, 01/10 — đủ ở Notes của ba hợp đồng):

- Kiểm «đã hoàn lại» băm tệp khác cách ảnh chụp với liên kết mềm bẩn sẵn; tệp mới chưa theo dõi sinh
  trong lượt chỉ được gọi tên, không khoá lượt.
- Bộ kiểm lại bằng chứng chặn «cây đổi» trước lối miễn hồ sơ nghỉ — lệch thứ tự với lưới trước-merge.
- Ma trận RT13 chưa phủ ba lối «đã xong» còn thiếu cờ quá hạn; kiểm «bộ dò một nguồn» chỉ bắt bản sao
  nguyên chữ; phạm vi `paths` của eval E5 hẹp hơn tập thư mục nhóm JI12 quét.

**Năm dòng số của luật (c)** — ba vòng (giờ VN, 01/10):

| Dòng | `thuoc-biet-truoc-khong-phan-duoc` (T2) | `nghi-van-mang-co-qua-han` (T2) | `luot-cham-ghi-vao-cay` (T3) | Nguồn |
|---|---|---|---|---|
| Làm-xong→quyết-được | `implemented` 09:25 → ký 11:17 ≈ **1 giờ 52 phút**, hai lượt chấm; `verified` → ký 5 phút | `implemented` 09:57 → máy thông 10:33 ≈ **36 phút**, không người | `implemented` 18:08 → ký 22:55 ≈ **4 giờ 47 phút**, gồm khoảng máy đóng giữa lượt chấm; `verified` → ký 5 phút | giờ commit `contract.md` |
| Lượt gọi người / vòng | Trong thiết kế **1** (Cổng Bằng chứng; Cổng Phạm vi đi làn V). Ngoài thiết kế **1** — «ok» sửa RT13 ở PR riêng giữa lượt chấm (sổ `d-20261001T025809Z-11`), 1 chạm | **0** — làn V cả hai cổng; lời mở vòng đã đếm ở cột trái | Trong thiết kế **3** (Cổng Phạm vi · Gate 1.5 · Cổng Bằng chứng; trần T3 = 4). Gate 1.5 không có chữ duyệt — owner chỉ dán dòng `/goal`, máy hiểu là duyệt (sổ `d-20261001T103918Z-9`). Ngoài thiết kế **0** | `decisions.jsonl` |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **1** — lượt 1 REJECT chỉ vì suite vùng 3 đỏ sẵn ở RT13, ngoài vật (sổ `d-20261001T024953Z-10`) | **0** | **0** — lượt chấm 1 bị ngắt vì đóng máy rồi nối lại; máy của người, không phải hạ tầng kit | `run-log.jsonl` · sổ |
| Token máy / vòng (out-token S4) | **71 526** (lượt 1: 39 644 · lượt 2: 31 882). Chứng-minh-vật 60 % / 64 % — tìm-lỗi 21 % / 10 % — tổng hợp 18 % / 26 % | **17 767**. Chứng-minh-vật 73 % — tìm-lỗi 8 % — tổng hợp 18 % | **61 923**. Chứng-minh-vật 56 % — tìm-lỗi 33 % — tổng hợp 12 %. Cache-read làn rà soát ≈ 15,0 M | `usage-report.md` |
| Phút máy / lượt chấm | **21 phút** mỗi lượt (1 256 s · 1 269 s); đường găng chứng-minh-vật 1 160 s · 1 183 s | **20 phút** (1 176 s); găng 1 138 s | **không đọc được ở đây** — tường 16 833 s gồm khoảng máy đóng; usage-report không tách phút chạy thật | `usage-report.md` |

Phiên chính của cả ba vòng không đo token. Tỉ lệ ba khối làm tròn nên có thể cộng ra 99 %.

**Điều kiện tin cậy:** (i) `luot-cham-ghi-vao-cay` ĐỔI thành phần đường verdict — thêm nhánh «không dùng
được» sau fan-out — nên dòng 4–5 chỉ cắt được vì vòng mang răng cả hai chiều: chiều đỏ AC-2 (ma trận cây
đổi viết trước), chiều im AC-3 (chỉ đổi thứ không phải vật — `.acceptance-runs/`, `evidence/` của chính
hồ sơ, không đổi gì — thì không có dòng `cay-doi`, thoát 0), mỗi AC máy kèm đột biến ở răng hồ sơ.
`thuoc-biet-truoc-khong-phan-duoc` KHÔNG đổi thành phần — răng nằm trước lượt chấm, `acceptance-verify.js`
không đổi. (ii) Số lượt chấm sai do phép-đo-tự-dối giữa hai mốc: **0** — lượt REJECT của
`thuoc-biet-…` là đỏ đúng của một ca kiểm đỏ sẵn, đã đếm ở dòng 3. Dòng 4–5 cắt được, trừ ô phút của
`luot-cham-ghi-vao-cay`.

**Dự báo năm dòng cho thay đổi của mốc này** (chép chiều từ hợp đồng của hai vòng ký):

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở kho tiêu thụ | người thôi tự đọc diff cho mục luật kho; lượt cây đổi bị bắt trước chữ ký thay vì sau |
| 2 | = | răng chặn trước lượt chấm, không thêm lượt dừng; ↓ ở ca có sự cố cây đổi |
| 3 | ↓ | lượt cây đổi chạy lại cùng round, không đốt trần |
| 4 | ↓ ở crm | ≈16 lượt hội đồng × 3 giám khảo cho câu không trả lời được thôi chạy; +1 lượt ở ca cây đổi |
| 5 | = | không chạm làn máy |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc trên kit bằng
`scripts/hieu-chuan-moc.mjs --root .`. **N không tăng so với mốc 2.19.0 — dòng vô hiệu ở mốc này**,
cấm đọc thành «0 sự cố».

**Nhát cắt có tên cho cửa sổ kế** (đủ ở Notes của `_acceptance/release-2-20-0/contract.md`, không mở ô):

1. **Thuế tự-host** — vòng ở kho kit tới «máy thông» phải khai một dòng `KHAC-BIET-DOC-CU` rồi ghim lại
   `ra-co-ten-lam-va-trao`; PR #232 đỏ CI hai lần vì đúng việc này.
2. **Phép đo dài hơn trần 600 giây của làn máy** — ca thật thứ hai ở crm `soan-okr-cung-tro-ly` (35 phút).
3. **Tham số lượt chấm bằng đường tệp** — hai lần trong ngày (35 KB ở kit, 196 KB ở crm).
4. **Ca thật đầu tiên cho «bất biến sản phẩm»** — thước quyền xem OKR của crm tắt im hai ngày trong
   `rang/` của một hồ sơ đã ký.
5. `scripts/rel-cua-so.sh` chỉ rút hồ sơ `signed-off`, nên tiêu chí cửa sổ của mốc không phủ vòng máy
   thông (phát hiện khi mở hồ sơ mốc này).

## 2.19.0 — 29/09/2026

Cửa sổ 2.18.5 → 2.19.0 kéo **hai ngày**, có **một vòng** chạm engine: `mot-so-ba-ve` (T3, ký 29/09,
PR #226 mở ô + ADR 0021 «ba vế một câu», PR #227 vòng) — suất meta duy nhất của cửa sổ. Kho chờ nhận là
`crm`: vòng `tro-ly-okr-de-xuat` (28/09) có 11 ruling superpowers mà chỉ 4 có mã trong sổ quyết định,
và thẻ Cổng Bằng chứng phải cần một lớp dịch mới đọc được sổ. Mốc đi **làn V**, không dựng răng mới. Hai
gói cùng lên `2.19.0`; `diagram-design` giữ `2.7.0`. Tag `v2.19.0` gắn tại commit ký mốc sau khi gộp.

**Vì sao 2.19.0, không 2.18.6:** cửa sổ thêm một hook mới, một script mới và ba trường sổ mới — thay đổi
cộng thêm, có đường đọc-cũ.

**Đổi gì** — một sổ quyết định, mỗi dòng đọc được ngay trên thẻ:

- **Mỗi dòng sổ ghi ba vế viết cho người ký:** quyết gì (`decision`) · vì sao (`why`) · sai thì tốn gì
  (`cost_if_wrong`). Dòng cũ chỉ có `impact` vẫn đọc như trước — không phải sửa hồ sơ cũ.
- **Thẻ Cổng 1 và Cổng 2 in dòng ba vế thành một câu** ở cả ba khối (sẽ làm/không làm · CHƯA duyệt ·
  Đã duyệt từ Gate 1), không cần lớp dịch. Dòng thiếu vế giá mang nhãn «chưa khai giá nếu sai» ngay ở
  dòng đó, thẻ không chặn. Bước trích chỉ xin dịch dòng cũ.
- **Ruling mà superpowers ghi trong lúc thi công được gặt vào sổ** (`scripts/cau-noi-ruling.mjs`), mang
  nguồn `superpowers`, để người ký thấy ở Cổng Bằng chứng thay vì mất theo thư mục tạm.
- **Hook mới chặn lệnh xoá thư mục tạm của superpowers** cho tới khi ruling trong đó đã vào sổ
  (`hooks/ruling-truoc-khi-xoa.js`, PreToolUse · Bash). Kho chưa dùng kit thì hook im.

**Kho tiêu thụ làm gì khi nhận:**

- **Máy dev:** cập nhật plugin như mọi mốc, trong từng thư mục có scope sống, rồi **khởi động lại phiên**
  để hook mới có hiệu lực. Hồ sơ đang giữa vòng không cần làm gì — dòng sổ cũ vẫn đọc được.
- **Kho còn đường chép:** không chép gì — không tệp nào của lớp chép CI (GUIDE §5.3) đổi trong cửa sổ.

**Giới hạn đã khai** (owner quyết ở Cổng Bằng chứng của vòng, 29/09 — đủ mười mục ở Notes của
`_acceptance/mot-so-ba-ve/contract.md`):

- Bảy phép đo của chính hồ sơ tự dối: ca in thẻ ghi bằng chứng vào tệp đã theo dõi rồi tự so với thứ vừa
  ghi (sau khi ký, đổi cách in thẻ sẽ làm bộ kiểm lặng lẽ ghi lại bằng chứng của hồ sơ đã ký); một ca so
  rỗng với rỗng; bốn ca phá thử kết luận từ sự vắng mặt mà không chứng bản sao đã chạy.
- Hook cho qua không khai báo khi lệnh xoá dùng glob, ngoặc nhọn, `~`, `sudo` hay lệnh con.
- Gợi ý sửa của lưới trước-merge còn dạy ghi dòng sổ hai vế — dòng ghi theo nó rơi về đường đọc-cũ.
- Kho có kit mà kế hoạch superpowers không thuộc hồ sơ nào thì hook chặn mãi — hạt giống
  `docs/plans/2026-09-29-hat-giong-hook-chan-ke-hoach-ngoai-ho-so.md`.

**Năm dòng số của luật (c)** — một vòng (`mot-so-ba-ve`):

| Dòng | Số | Nguồn |
|---|---|---|
| Làm-xong→quyết-được | `implemented` 09:41 → ký 11:10 (29/09, giờ VN) ≈ **1 giờ 29 phút**; riêng `verified` → ký ≈ 66 phút; một lượt chấm | giờ commit + sổ quyết định |
| Lượt gọi người / vòng | **3** trong thiết kế (Cổng 1 · Gate 1.5 · Cổng Bằng chứng; trần T3 = 4). Ngoài thiết kế **1** — câu khó-đảo «đẩy hay ẩn danh» sau chữ ký (dữ liệu thử chép nội dung kho riêng tư); thêm **1 chạm** vì «ký» gõ trong chat không ghi được chữ ký, phải gõ lại bằng lệnh | `decisions.jsonl` · bàn giao 29/09 |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0** — S4 một lượt, PENDING-JUDGMENT | `run-log.jsonl` |
| Token máy / vòng | Out-token S4: **41 840** (21 tác tử). Tách theo khối: chứng-minh-vật (machine+judge+baseline) 38 % — tìm-lỗi (review+triage) 41 % — tổng hợp (capture+synthesize) 21 %. Cache-read S4 ≈ 11,9 M, trong đó review ≈ 9,2 M. S3 ba làn song song: 9 529 out-token. Phiên chính không đo | `usage-report.md` |
| Phút máy / lượt chấm | **21 phút** (1 276 s). Đường găng là khối chứng-minh-vật (1 141 s); S3 song song 379 s | `usage-report.md` |

**Điều kiện tin cậy:** đường verdict KHÔNG đổi thành phần (finder → refute trong hợp đồng → REJECT giữ
nguyên; vòng chỉ đổi sổ, thẻ và thêm hook). Số lượt chấm sai giữa hai mốc không tăng. Dòng 4–5 cắt được đủ.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở kho tiêu thụ | người ký đọc vì-sao và giá ngay trên thẻ, không mở sổ hay chờ lớp dịch |
| 2 | = | không thêm cổng; câu hỏi «ruling này ở đâu» ở Cổng Bằng chứng giảm khi ruling đã vào sổ |
| 3 | = | không chạm bộ chấm |
| 4 | ↓ nhẹ | thẻ thôi cần bước dịch sổ cho dòng mới |
| 5 | = | hook chỉ chạy trên lệnh Bash nhắc `.superpowers` |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc trên kit bằng
`scripts/hieu-chuan-moc.mjs --root .`. **N không tăng so với mốc 2.18.5 — dòng vô hiệu ở mốc này**,
cấm đọc thành «0 sự cố».

**Nhát cắt có tên cho cửa sổ kế:**

1. **Bảy phép đo tự dối của `mot-so-ba-ve`** (Known limits của hồ sơ, sổ known-limits) — ứng viên số một
   nếu owner gọi tên.
2. **Ba hạt giống cùng lớp «ba vế»:** «Trả lại: lý do» ở Cổng 2 không ghi trường · `veto` thiếu giá · cột
   Xử lý của gap-probe thiếu giá.
3. Từ 2.18.5 còn nguyên: lớp chép tự xoá · máy hỏi ngoài thiết kế ở S1 · thẻ Cổng 2 để `scope_plain`
   thay các mục.

## 2.18.5 — 27/09/2026

Cửa sổ 2.18.4 → 2.18.5 kéo **hai ngày**, có **một vòng** chạm engine: `cham-khong-tu-dot-luot` (T3, ký
27/09, PR #223) — suất meta duy nhất của cửa sổ, owner gọi tên sau ba lượt phản biện. Kho chờ nhận là
`crm`: lượt 4 lộ trình OKR (`cap-nhat-tuan-okr`) đốt hai round và một lượt gọi người mà không có lỗi
sản phẩm nào, `quen-mat-khau` round 3 và `okr-soat-anh-luot-3` round 1 khoá chỉ vì bộ kiểm chung bị
harness cất đầu ra. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên `2.18.5`; `diagram-design`
giữ `2.7.0`. Tag `v2.18.5` gắn tại commit ký mốc sau khi gộp.

**Đổi gì** — lượt chấm thôi tự đốt lượt vì hạ tầng, thẻ người ký hiện đủ:

- **Bộ kiểm chung không chạy được thì được thử lại cùng round.** Dòng SUITE mang lý do (kể cả lý do tự
  do của tác tử) nay có nhãn «không đọc được ở đây» như dòng eval; cờ «công cụ đã giết lệnh» đi tới sổ
  chạy thành `killed_by_tool`. Bộ kiểm trượt thật vẫn là trượt, và lượt vừa có hạ tầng vừa có trượt
  thật vẫn khoá.
- **Mã thoát đọc từ dấu, không từ chữ.** Lệnh máy chạy trong khung bọc: đầu ra ghi ra tệp, chỉ đuôi
  (≤ 6 000 byte) và dòng `__EXIT=<mã>` đi vào kết quả công cụ, nên harness thôi cất đầu ra dài ra tệp;
  dấu có mặt thắng lời khai (hình E21 của crm: khai 1, dấu 0 → đạt). «Thiếu môi trường, thoát 1» vẫn
  là hạ tầng, không thành REJECT.
- **Hồ sơ ghi đúng commit máy đã chấm** (`verified_commit` từ `invokedSha`, không từ tác tử).
- **Thẻ Cổng Phạm vi hiện từng mục «không làm»**, dịch theo id `OOS-n`; câu dịch lạc bật cờ vàng. Thẻ
  đọc mọi bảng phản biện đúng chữ ký sáu cột (bảng soát lại sau Cổng Phạm vi của crm từng vắng), cờ
  vàng khi số phát hiện vượt số khai; bảng đời cũ sáu cột mở bằng «sev» vẫn đọc như trước.
- **Bảng chi phí S4 tách theo khối trở lại** — `wf-usage` đọc nhãn tác tử từ `meta.json` cạnh
  transcript (harness mới chèn một câu chung vào tin đầu của mọi tác tử).
- **Ảnh ui-check lưu dưới hồ sơ**, báo cáo mang đường tương đối `evidence/…`.

**Kho tiêu thụ làm gì khi nhận:**

- **Máy dev:** cập nhật plugin như mọi mốc, theo khối khai plugin của GUIDE, trong từng thư mục có scope
  sống. Hồ sơ đang giữa vòng nhận bộ chấm mới ở lượt chấm kế — không cần làm gì.
- **Kho còn đường chép** (`crm`): chép lại **`lib/nhan-canh-gay.cjs`** (lớp chép CI, GUIDE §5.3 —
  tệp duy nhất của lớp đổi trong cửa sổ).

**Giới hạn đã khai** (owner quyết ở Cổng Bằng chứng của vòng, 27/09):

- Khung in dấu vẫn là lời trong prompt: tác tử có thể bỏ qua nó (lượt chấm 1 của vòng: 3/11 tác tử chạy
  lệnh trần). Thiếu dấu thì bộ chấm giữ lời khai như trước — tác tử bỏ khung và khai sai mã vẫn lọt.
  Làn ui-check và baseline không bọc.
- Thẻ Cổng 2 còn để `scope_plain` thay các mục «không làm» — hạt giống
  `docs/plans/2026-09-27-hat-giong-the-cong-2-scope-plain-thay-muc.md`.
- Ca «luật dấu không chạm làn ui» không có chiều đỏ — hạt giống
  `docs/plans/2026-09-27-hat-giong-ca-lan-ui-khong-phan-biet.md`.
- Bộ phân nhãn còn hai nhánh chết và một tham số không đọc (không đổi phân loại).
- Câu «đầu ra dài» của khối TOOL-KILL-RULE viết không dấu nên «CAT» đọc được là «cắt» — nghĩa đúng là
  «cất»; đổi thành «LUU» ở cửa sổ kế.

**Năm dòng số của luật (c)** — một vòng (`cham-khong-tu-dot-luot`):

| Dòng | Số | Nguồn |
|---|---|---|
| Làm-xong→quyết-được | Cổng Phạm vi ≈ 5 phút · Gate 1.5 ≈ 6 phút · Cổng Bằng chứng ≈ 25 phút (gồm một câu hỏi của owner về E10). Code xong → chữ ký: **2 giờ 5 phút**, ba lượt chấm | giờ commit + sổ quyết định |
| Lượt gọi người / vòng | **4**, cả bốn trong thiết kế T3 (Cổng Đáng · Cổng Phạm vi · Gate 1.5 · Cổng Bằng chứng). Ngoài thiết kế **0**. Trần T3 = 4. Mỗi lượt một chạm (một câu gộp hoặc một dòng dán). Gate 1.5 được máy ĐỌC là duyệt khi owner dán dòng /goal không kèm chữ «duyệt» — ghi sổ, phê ở Cổng Bằng chứng | `decisions.jsonl` |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **1 lượt, 1 round** — lượt chấm 1 BLOCKED vì chính khung in dấu của vòng (3/11 tác tử chạy lệnh trần); vòng sửa vật nên tự đếm round kế thay vì thử lại cùng round | `run-log.jsonl` round-tally |
| Token máy / vòng | Out-token S4: **49 955 · 62 479 · 28 498** (ba lượt). Tách theo khối: chứng-minh-vật (machine+judge+baseline) 34 % · 28 % · 40 % — tìm-lỗi (review+triage+refute) 28 % · 40 % · 38 % — tổng hợp (capture+synthesize) 38 % · 32 % · 22 %. Cache-read S4 ≈ 14,3 M · 15,6 M · 15,1 M, trong đó review ≈ 11–13 M mỗi lượt. S3 ba làn: 12 348 out-token. Phiên chính không đo | `usage-report.md` |
| Phút máy / lượt chấm | 24 · 30 · 28 phút. Đường găng cả ba là khối chứng-minh-vật (1 135 · 1 140 · 1 341 s) | `usage-report.md` |

Mốc đầu tiên tách được dòng 4 theo NHÃN tác tử thay vì theo model — nhờ chính AC-8 của vòng.

**Điều kiện tin cậy:** đường verdict ĐỔI thành phần — nguồn của mã thoát đổi từ lời khai của tác tử
sang dấu máy in. Răng hai chiều có ở ca AC-2 của vòng (tám hàng viết trước, hai đột biến), nhưng vế
«thiếu dấu» đã gỡ theo ngưỡng chết nên chiều đỏ của nó là dòng sổ S4-r1, không phải ca. Số lượt chấm
sai giữa hai mốc không tăng. Dòng 4–5 cắt được đủ.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở kho tiêu thụ | lượt chặn vì hạ tầng thử lại cùng round, không đợi owner cho vượt trần |
| 2 | ↓ ở kho tiêu thụ | hết lượt «cho vượt trần» và `--round` tay (lượt 4 OKR: 1 lượt ngoài thiết kế) |
| 3 | ↓ | nền: 2 round đốt chắc chắn trên 63 lượt BLOCKED quét 27/09 |
| 4 | = | không thêm tác tử |
| 5 | = | khung bọc không làm chậm lệnh |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc trên kit bằng
`scripts/hieu-chuan-moc.mjs --root .`. **N không tăng so với mốc 2.18.4 — dòng vô hiệu ở mốc này**,
cấm đọc thành «0 sự cố».

**Nhát cắt có tên cho cửa sổ kế:**

1. **Lớp chép tự xoá** (`docs/plans/2026-09-23-hat-giong-lop-chep-tu-xoa-2-18-3.md`) — xếp từ 2.18.3, còn nguyên.
2. **Máy hỏi ngoài thiết kế ở S1** (`docs/plans/2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md`) — còn nguyên.
3. **Thẻ Cổng 2 để `scope_plain` thay các mục** — cùng lớp AC-6 vừa sửa ở Cổng 1.

## 2.18.4 — 25/09/2026

Cửa sổ 2.18.3 → 2.18.4 kéo **một ngày**, có **ba vòng** chạm engine, cả ba cùng sửa báo động giả
của **đường nền** (`feature-loop/scripts/duong-nen.mjs` — tệp engine duy nhất đổi):
`nen-cong-cu-gan-bang-lenh-con`, `nen-cay-ban-dong-dau`, `nen-chay-bang-moi-truong-nguoi-goi` (đều
T2, ký 24–25/09). Kho chờ nhận là `crm`: sau khi bản vá đầu đã gộp, đường nền của hai phiên crm mở
vòng 24/09 vẫn ghi `nen cong-cu: THIEU merge-base` và mỗi phiên đẩy một chip «sửa đường nền» cho
owner — đúng lỗi đã sửa, chỉ chưa phát hành. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên
`2.18.4`; `diagram-design` giữ `2.7.0`. Tag `v2.18.4` gắn tại commit ký mốc sau khi gộp.

**Đổi gì** — thẻ Cổng Phạm vi thôi mang cờ vàng «nền hạ tầng đỏ» giả:

- **Lệnh mở bằng phép gán mang lệnh con thôi bị báo thiếu công cụ.** Executor dạng
  `B=$(git merge-base HEAD origin/onehub) && …` từng bị đọc thành chương trình `merge-base`. Bộ tách
  lệnh nay hiểu vùng thay thế `$(…)` `${…}` `` `…` `` và ranh giới `;` `&` `|`; lệnh chỉ-gán tra từ
  đầu của lệnh con. Chương trình vắng thật vẫn đỏ và gọi đúng tên.
- **Chân suite gọi đúng tên tệp bẩn.** Tên tệp đã theo dõi thôi bị cụt ký tự đầu (`README.md` →
  `EADME.md`), và tệp bẩn sẵn từ trước thôi bị đổ cho suite.
- **Đường nền chạy bằng môi trường của người gọi.** Tra `command -v` và chạy suite qua `bash -c` với
  env của người gọi, không qua shell đăng nhập nạp lại profile. Máy dùng fnm/nvm thôi bị báo
  «nen suite: DO SAN» giả khi PATH đăng nhập trỏ một bản node khác (đo ở crm: node 22 thay 24).

**Kho tiêu thụ làm gì khi nhận:**

- **Máy dev:** cập nhật plugin như mọi mốc, theo khối khai plugin của GUIDE, trong từng thư mục có
  scope sống. Không cần làm gì với hồ sơ đang mở; đường nền lần mở vòng kế tự đọc bằng bản mới.
- **Kho còn đường chép** (`crm`): `duong-nen.mjs` không thuộc lớp chép CI (GUIDE §5.3) — không phải
  chép gì.
- **Kho đã ghim sha:** đổi `KIT_SHA` sang commit ký mốc 2.18.4, hoặc lấy theo tag `v2.18.4`.

**Giới hạn đã khai** (owner quyết ở Cổng Bằng chứng của từng vòng, 24–25/09):

- Lệnh con mở bằng chuyển hướng (`X=$(<file)`) bị báo THIEU giả — hồi quy so với bản trước vá; 0 /
  5 113 khoá `executors.*` thật có dạng này. Hạt giống
  `docs/plans/2026-09-24-hat-giong-lenh-con-mo-bang-chuyen-huong.md`.
- `N=$((1+2)); lenh-ke` rơi vào nhánh bỏ-tra thay vì tra `lenh-ke`; trần độ sâu 8 chạm thì bỏ tra
  không in lý do.
- Khi `git status` lỗi, chân suite đọc được tập rỗng (có từ bản cũ).
- Một ca chập chờn chưa gọi tên trong mảnh suite `mjs:1/3` (đỏ một lần ở làn ghim lại, lần sau xanh).
- `check_overflow.py` của `diagram-design` vỡ `JSONDecodeError` khi nhãn tràn chứa `]` — gặp ở crm
  25/09, owner chọn không đưa vào mốc này. Hạt giống
  `docs/plans/2026-09-25-hat-giong-check-overflow-cat-json-o-ngoac-vuong.md`.

**Năm dòng số của luật (c)** — ba vòng, số theo thứ tự `lenh-con` · `cay-ban` · `moi-truong`:

| Dòng | Số | Nguồn |
|---|---|---|
| Làm-xong→quyết-được | Cổng Phạm vi cả ba đi làn V, không chờ người. Cổng Bằng chứng một lượt mỗi vòng: ≈ 5 phút · ≈ 4 giờ 25 phút · ≈ 6 giờ 27 phút (qua đêm). Code xong → chữ ký: 37 phút · 4 giờ 58 phút · 7 giờ 1 phút. Hai vòng sau không có dấu giờ trình thẻ nên không tách được giờ chờ người khỏi giờ máy | giờ commit + sổ quyết định |
| Lượt gọi người / vòng | **1 · 1 · 1**, cả ba trong thiết kế (Cổng Bằng chứng). Ngoài thiết kế **0**. Mục tiêu T2 ≤3. Số chạm không đo được — sổ chỉ cho một dấu giờ quyết mỗi vòng, hội thoại không nằm trong kho | `decisions.jsonl` |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0 · 0 · 1 lượt, 0 round**. Vòng thứ ba: round 1 lượt 1 BLOCKED (2 tác tử chấm chết, trả 9/11), thử lại cùng round trên cùng cây → PASS 6/6. Ca sống đầu tiên của «thử lại cùng round» (2.18.3) | `run-log.jsonl` round-tally |
| Token máy / vòng | Out-token **66 k · 48 k · 52 k**; không-cache **1,50 M · 1,39 M · 1,15 M**. Tách theo vai: chứng-minh-vật (machine+baseline) 29 % · 43 % · 35 % — tìm-lỗi (review+triage) 58 % · 35 % · 30 % — tổng hợp (capture+synthesize) 14 % · 22 % · 34 %. Vòng thứ ba chỉ có lượt BLOCKED: lượt thử lại chạy bằng tác tử chấm tuần tự ngoài workflow đo chi phí, không đo. Phiên chính không đo | `usage-report.md` |
| Phút máy / lượt chấm | 28 · 29 · 23 phút (+ lượt thử lại ≈ 3 phút lệnh, ≈ 6 phút dấu giờ). Đường găng cả ba là khối chứng-minh-vật (1 533 · 1 602 · 1 202 s) | `usage-report.md` + `evidence-report.md` |

Dòng 4 xếp `capture` vào tổng hợp — quyết định của người đếm, mẫu 2.18.3 không nói rõ; báo cáo chi phí
của ba vòng còn nhãn vai nên tách được theo vai thay vì theo model.

**Điều kiện tin cậy:** đường verdict không đổi thành phần — ba vòng chỉ đổi đường nền, không đổi ai
phán. Số lượt chấm sai không tăng. Dòng 4–5 cắt được, trừ vế lượt thử lại của vòng thứ ba: lượt ấy
đi ngoài workflow đo chi phí, nên dòng 4 của vòng đó thiếu một lượt — khai, không ước.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở kho tiêu thụ | thẻ Cổng Phạm vi thôi mang cờ vàng nền giả, người khỏi đọc rồi bỏ qua |
| 2 | ↓ ở kho tiêu thụ | phiên thôi đẩy chip «sửa đường nền» cho lỗi đã sửa (đo 24/09: hai chip từ hai phiên crm) |
| 3 | = | đường nền không nằm trên đường chấm |
| 4 | = | không thêm tác tử |
| 5 | = | không đổi lượt chấm |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc trên kit bằng
`scripts/hieu-chuan-moc.mjs --root .`. **N không tăng so với mốc 2.18.3 — dòng vô hiệu ở mốc này**,
cấm đọc thành «0 sự cố».

**Nhát cắt có tên cho cửa sổ kế** (thứ tự mốc 2.18.3 đã xếp, còn nguyên; cửa sổ vừa rồi dành cho ba
vòng đường nền):

1. **Lớp chép tự xoá** (`docs/plans/2026-09-23-hat-giong-lop-chep-tu-xoa-2-18-3.md`).
2. **Máy hỏi ngoài thiết kế ở S1** (`docs/plans/2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md`).

## 2.18.3 — 24/09/2026

Cửa sổ 2.18.2 → 2.18.3 kéo **một ngày**, có **một vòng** chạm engine do owner gọi tên:
`ha-tang-khong-dot-luot` (T2, ký 24/09). Kho chờ nhận là `crm`, đã nâng 2.18.2 ở mọi scope sống
ngày 24/09. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên `2.18.3`; `diagram-design` giữ
`2.7.0`. Tag `v2.18.3` gắn tại commit ký mốc sau khi gộp.

**Đổi gì:**

- **Lượt chấm chết vì hạ tầng được thử lại, không tính là một vòng.** Khi lượt S4 bị chặn chỉ vì
  hạ tầng (tác tử chấm chết, hoặc công cụ ngắt lệnh), và lượt ấy không có lỗi nào máy phải sửa
  trong hợp đồng, bộ sinh tham số chấm lại ở CÙNG round. Lượt thử lại không đếm vào trần 3 round và
  chỉ thử lại một lần. Lượt còn lỗi trong hợp đồng thì vẫn là một round sửa như trước. Tập «lỗi máy
  phải sửa» đọc đúng tập bộ chấm dùng để trả lại: lỗi chưa qua bác bỏ hoặc lượt phân loại không đủ
  thì không tính.
- **Dòng `/goal` thôi coi «bị chặn» là xong.** Khuôn mới coi là hoàn thành khi phiên đã trình thẻ
  Cổng Bằng chứng, hoặc (làn V) đã mở PR ở S5, hoặc đã dừng ở một cổng có tên. Lượt bị chặn vì hạ
  tầng mà chưa thử lại thì CHƯA hoàn thành: máy thử lại, không hỏi. Khuôn không còn đòi
  «status: verified», điều làn V không bao giờ tới.
- **Thẻ Cổng 1 của hồ sơ đã khép thôi hỏi.** Hồ sơ chấm-bởi-thực-tế chưa từng có báo cáo không còn ô
  «duyệt hay sửa», không dòng lệnh duyệt, không dòng goal.
- **Bộ kiểm của kit chạy dưới trần công cụ** (chỉ kho kit). Suite scripts chấm bằng bốn mảnh, suite
  plugins bằng ba vùng; lệnh suite dài nhất của lượt chấm là 234 s. Trước vòng, suite plugins trọn
  mất 518 s trên `main`, tức 86 % trần. Lệnh trọn và CI không đổi.

**Kho tiêu thụ làm gì khi nhận:**

- **Máy dev:** cập nhật plugin như mọi mốc, theo khối khai plugin của GUIDE, trong từng thư mục có
  scope sống. Không cần làm gì với hồ sơ đang mở.
- **Kho còn đường chép** (`crm`): không tệp nào trong lớp chép CI (GUIDE §5.3) đổi ở mốc này, nên
  không phải chép gì.
- **Kho đã ghim sha:** đổi `KIT_SHA` sang commit ký mốc 2.18.3, hoặc lấy theo tag `v2.18.3`.
- **Ai đang dán dòng `/goal` cũ:** dán khuôn mới từ thẻ Cổng 1 hoặc GUIDE mục /goal. Goal cũ đang
  chạy vẫn chạy.

**Giới hạn đã khai** (owner quyết ở Cổng Bằng chứng của vòng, 24/09):

- «Đã thử lại một lần vẫn chặn» chỉ là một dòng stderr; bộ sinh tham số vẫn thoát 0. Hạt giống
  `docs/plans/2026-09-24-hat-giong-thu-lai-roi-thoat-khac-0.md`.
- Thẻ Cổng 1 của hồ sơ đã khép còn hai nút «Sửa lại / Duyệt, cho code», và bỏ qua im lặng lỗi của bộ
  quét. Hạt giống `docs/plans/2026-09-24-hat-giong-the-cong-1-ho-so-khep-nut-va-loi-quet.md`.
- 68 hồ sơ đã ký của kit còn eval trỏ khoá suite trọn, nên lượt ghim lại của chúng chạy thêm suite
  trọn ngoài các mảnh. Suite trọn vẫn sát trần; nguy cơ có từ trước vòng.
- Thân lệnh `acceptance-card` còn đọc `one_shot: null` là «bị trả lại/bị chặn», trong khi thẻ hồ sơ
  đã khép nay cũng trả null.
- Vùng 2 của suite plugins là một khối đơn (P161, 320 s máy rảnh), không chia nhỏ hơn được nếu
  không sửa chính P161.

**Năm dòng số của luật (c) — vòng `ha-tang-khong-dot-luot`:**

| Dòng | Số | Nguồn |
|---|---|---|
| Làm-xong→quyết-được | Cổng Phạm vi đi làn V hai lần, không chờ người · Cổng Bằng chứng lượt 1 ≈ 7 phút (trả lại, nâng phạm vi 3 mục) · lượt 2 ≈ 6 phút (ký). Code xong → chữ ký cuối: 1 giờ 48 phút | giờ commit + sổ quyết định |
| Lượt gọi người / vòng | **2** lượt, **2** chạm, mỗi lượt một lệnh. Trong thiết kế **2** (Cổng Bằng chứng hai lượt). Ngoài thiết kế **0**. Mục tiêu T2 là ≤3 | sổ quyết định + hội thoại |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0**. Hai lượt đều trả đủ phép đo, 0 BLOCKED; round 1 không bị trần công cụ ngắt — ngưỡng sống đầu tiên của ô | `run-log.jsonl` round-tally |
| Token máy / vòng | 2 lượt: **241 k** out-token, **3,40 M** token không-cache. Tách theo model vì nhãn vai mất trong báo cáo: chứng-minh-vật (haiku) 32 k (13 %) · rà soát (opus) 124 k (51 %) · phân loại + chụp + tổng hợp (sonnet) 85 k (35 %). Phiên chính không đo | `usage-report.md` |
| Phút máy / lượt chấm | 35 · 29 phút, tổng 63 phút. Đường găng là chuỗi 10 lệnh suite chạy tuần tự (≈ 1 150 s máy rảnh) | `wall` + kiểm kết S3 |

Dòng 4 không tách được phân loại (thuộc khối tìm-lỗi) khỏi tổng hợp: cả hai chạy sonnet và báo cáo
chi phí của hai lượt không còn nhãn vai.

**Điều kiện tin cậy:** đường verdict không đổi thành phần — vòng này đổi cách ĐÁNH SỐ lượt và cách
CHẠY suite, không đổi ai phán. Hai thay đổi có răng hai chiều: phân hoạch mảnh có chiều đỏ (bỏ sót
tệp, ca tiêm đỏ ở từng mảnh) và chiều im (tổng PASS các mảnh = lượt trọn); đánh số lượt có ma trận
chín hàng + round-trip với bộ chấm thật + hai đột biến tách riêng. Số lượt chấm sai không tăng. Dòng
4–5 vì thế cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ | lượt chặn vì hạ tầng thôi thành câu hỏi cho người |
| 2 | ↓ ở kho tiêu thụ | khuôn goal thôi ép phiên dựng lối cho người khi lượt bị chặn |
| 3 | ↓ ở kho kit | suite dưới trần, round đầu thôi BLOCKED |
| 4 | = | không thêm tác tử |
| 5 | ↓ | lượt thử lại cùng round không đốt một round sửa |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc trên kit bằng
`scripts/hieu-chuan-moc.mjs --root .`. **N không tăng so với mốc 2.18.2 — dòng vô hiệu ở mốc này**,
cấm đọc thành «0 sự cố».

**Nhát cắt có tên cho cửa sổ kế** (thứ tự mốc 2.18.2 đã xếp, còn nguyên):

1. **Lớp chép tự xoá** (`docs/plans/2026-09-23-hat-giong-lop-chep-tu-xoa-2-18-3.md`) — mốc này
   không làm; cửa sổ vừa rồi dành cho vòng owner gọi tên.
2. **Máy hỏi ngoài thiết kế ở S1** (`docs/plans/2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md`).

## 2.18.2 — 23/09/2026

Cửa sổ 2.18.1 → 2.18.2 kéo **một ngày**, có **một vòng** chạm engine do owner gọi tên:
`chot-may-chu-ky-sau-synthesize` (T2, ký 23/09). Kho chờ nhận là sáu kho vừa nâng 2.18.1: hai
kho đã ghim sha `8a4ea881` (oneflow #129, artifact-platform #392), ba kho đang chờ PR ghim sha
(media-library, floorplanstudio, MapPoster) và `crm` còn đi đường chép, chờ 2.18.3. Mốc đi
**làn V**, không dựng răng mới. Hai gói cùng lên `2.18.2`; `diagram-design` giữ `2.7.0`. Đây là
mốc đầu tiên có **tag** `v2.18.2`, gắn tại commit ký mốc.

**Đổi gì:**

- **Máy thôi được ký thay người trong báo cáo bằng chứng.** Tác tử tổng hợp của lượt chấm S4
  từng tự điền chữ ký người và tự đặt giờ đo. Đo 23/09: 13/84 báo cáo kit và 12/56 báo cáo crm
  mang giờ đo do tác tử đặt, 6 báo cáo crm mang giờ ở tương lai, và một chữ ký máy trên hồ sơ
  crm đã tới bước ghi tệp. Nay workflow tự ép rỗng `human_signoff`, `human_override`,
  `bypass_ack` và ép mọi `verified_at` bằng giờ engine trước khi trả báo cáo. Khối mang sang từ
  lượt trước giữ giờ gốc của nó. Chốt đổi dòng nào thì run-log có một dòng
  `kind: chot-truong-nguoi` nói số dòng đổi theo từng khoá, nên tần suất tác tử bịa vẫn đếm được.
  Người ký vẫn ký bằng `/acceptance-gate:signoff` như cũ.
- **Đường mặc định của CI là chạy cổng từ bản kit ghim sha, không chép tệp** (GUIDE §5.3, đổi từ
  23/09 trong cửa sổ này). Kho ghi `KIT_SHA` trong tệp workflow CI, job lấy kit về ngoài cây kho
  rồi chạy cổng từ đó. Từ mốc này kho cũng có thể lấy kit bằng tag:
  `git fetch --depth 1 origin refs/tags/v2.18.2`.

**Kho tiêu thụ làm gì khi nhận:**

- **Kho đã ghim sha** (oneflow, artifact-platform, và ba kho khi PR ghim sha gộp): đổi `KIT_SHA`
  từ `8a4ea881` sang commit ký mốc 2.18.2, hoặc lấy theo tag `v2.18.2`. Một PR, một dòng.
- **Kho còn đường chép** (`crm`): chép lại lớp CI theo **danh sách** ở GUIDE §5.3 cộng
  `skills/acceptance/references/opportunity-template.md`, tổng 16 tệp. Không tệp nào trong lớp
  chép đổi ở mốc này, nên kho đã đủ 16 tệp từ đính chính 2.18.1 không phải chép gì. Đường chép
  sẽ bị xoá ở 2.18.3.
- **Máy dev:** cập nhật plugin như mọi mốc. Không cần làm gì với hồ sơ đang mở. Bản engine mới
  chỉ đổi cách lượt chấm S4 ghi báo cáo.

**Giới hạn đã khai:**

- Chốt không chạm năm hình dạng override mà bộ đọc L3 vẫn đếm: giữa dòng bảng, trong chú thích,
  khoá có tiền tố trùng đuôi, bản ghi một dòng kiểu `{…}`, nội dung khối vô hướng. Danh sách một
  nguồn là khối `GIOI-HAN-CHOT` trong `acceptance-verify.js`. Nghiệm đúng tầng là neo dòng cho
  L3 của bên đọc. Owner không phê vế đó ở vòng này; nó nằm ở hạt giống
  `docs/plans/2026-09-23-hat-giong-rang-ben-doc-verified-at-chu-ky.md`.
- Chữ ký do phiên tự viết ngoài `/signoff` chưa bị chặn. Đó cũng là việc của răng bên đọc.
- Vòng đột biến `CTN-AC8-vi-phan` chạy riêng thì không tự kiểm đối chứng dương (Known limits
  Ngoài-2 của hồ sơ vòng).
- Giờ đo bịa đang nằm trong 25 hồ sơ đã ký (13 kit, 12 crm) chưa được chữa. Chúng chờ chiến dịch
  ghim lại theo run-log thật.
- `pre-merge-check.sh` dòng 376 và 397 còn đọc `lib/` theo đường của kho. Kho chạy cổng từ bản
  kit mà có hồ sơ `machine-cleared` thì chờ 2.18.3.

**Năm dòng số của luật (c) — vòng `chot-may-chu-ky-sau-synthesize`:**

| Dòng | Số | Nguồn |
|---|---|---|
| Làm-xong→quyết-được | Cổng Phạm vi ≈ 21 phút · dừng-vá ≈ 2 phút · trần 3 lượt ≈ 27 phút theo giờ tự khai trong sổ, dòng sổ ghi muộn hơn 2 giờ · ký lần 1 ≈ 16 phút · nâng phạm vi ≈ 38 phút từ lúc máy hỏi · ký lần 2 ≈ 18 phút. Code xong → chữ ký cuối: 7 giờ 8 phút | giờ commit + sổ quyết định |
| Lượt gọi người / vòng | **6** lượt, **6** chạm, mỗi lượt một lệnh. Trong thiết kế **4**: hai cổng (Cổng Phạm vi, ký lần 1) và hai điểm dừng SKILL liệt kê tường minh (dừng-vá, trần 3 lượt). Ngoài thiết kế **2**: «nâng phạm vi» sau chữ ký, ký lần 2. Mục tiêu T2 là ≤3. Đếm theo lệnh owner gõ: câu máy hỏi xác nhận và câu owner trả lời «nâng phạm vi» là MỘT lượt | sổ quyết định + git log |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0**. Năm lượt đều trả 14/14 phép đo, 0 BLOCKED. Lượt 3 REJECT vì vật | `run-log.jsonl` round-tally |
| Token máy / vòng | 5 lượt: **564 k** out-token, **6,78 M** token không-cache. Tách ba khối theo out-token: chứng-minh-vật 106 k (19 %) · tìm-lỗi 345 k (61 %) · tổng hợp 113 k (20 %). Phiên chính không đo | `usage-report.md` |
| Phút máy / lượt chấm | 30 · 28 · 40 · 30 · 24 phút, tổng 152 phút. Đường găng lượt 2 là khối máy 1 223 s trên 1 678 s, trong đó suite scripts 777 s | `wall` + bảng vai |

Dòng 4 chỉ lượt 2 còn nhãn vai. Bốn lượt còn lại tách theo model và số lượt gọi: tác tử máy chạy
haiku, rà soát chạy opus, còn triage, bác bỏ, chụp và tổng hợp chạy sonnet. Lượt 3 có hai tác tử
sonnet hai lượt gọi không phân được vai, nên khối tìm-lỗi và tổng hợp của lượt ấy lệch tối đa 5 k.

**Điều kiện tin cậy:** đường verdict không đổi thành phần. Chốt chạy SAU tổng hợp và chỉ đổi bốn
khoá, không đổi ai phán. Nó có răng hai chiều: đột biến AC-8 cho chiều đỏ, chiều im trên toàn
corpus báo cáo kit và crm (AC-6, AC-7). Số lượt chấm sai không tăng: lượt 3 REJECT đúng vật. Dòng
4–5 vì thế cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở kho tiêu thụ | người ký thôi phải gỡ tay chữ ký máy và giờ bịa trước khi commit |
| 2 | = | không cổng nào thêm bớt |
| 3 | = ở đường `s4-args.mjs` · ↑ ở kho tự dựng args thiếu `invokedAt` | args thiếu `invokedAt` mà báo cáo có `verified_at` thì lượt chấm BLOCKED có tên |
| 4 | = | chốt là một hàm JS, không thêm tác tử |
| 5 | = | chốt chạy trong vài mili-giây sau tổng hợp |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc trên kit bằng
`scripts/hieu-chuan-moc.mjs --root .`. N không tăng so với mốc trước ở phần kit.

**Nhát cắt có tên cho cửa sổ kế** (thứ tự owner xếp 23/09 trong `docs/plans/`):

1. **2.18.3 — lớp chép tự xoá**
   (`docs/plans/2026-09-23-hat-giong-lop-chep-tu-xoa-2-18-3.md`). Sửa hai dòng `$ROOT/lib` của
   `pre-merge-check.sh`, xoá danh sách chép ở `acceptance-init` và GUIDE, xoá ca `CE2`. Việc thứ ba
   của hạt giống, gắn tag, làm tay ở mốc này. Còn lại là đưa nó thành bước của `/signoff`.
2. **2.19 — máy hỏi ngoài thiết kế ở S1**
   (`docs/plans/2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md`).

## 2.18.1 — 22/09/2026

Cửa sổ 2.18.0 → 2.18.1 kéo **một ngày**, có **một vòng** chạm engine do owner gọi tên:
`ho-so-khep-thoi-hoi` (T3, ký 22/09). Mọi lỗ vá ở đây lộ ra trong đúng ngày `crm` cài 2.18.0 —
kho chờ nhận của mốc này vẫn là `crm`. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên
`2.18.1`; `diagram-design` giữ `2.7.0`.

**Đổi gì:**

- **Hồ sơ đã khép thôi bị đếm là «cửa veto đang mở».** Hồ sơ đã nghỉ, hoặc đã chấm bởi thực tế
  với dòng quan sát đủ vế, không còn hiện trong dòng NOTE của lưới trước-merge lẫn thẻ mở phiên.
  Cả hai hỏi CHUNG một vị từ `hoSoDaKhep`.
- **Thẻ của hồ sơ đã khép không còn ô hỏi nào.** Trước bản này, 15 hồ sơ nghỉ vẫn mang câu «veto
  hay để yên». Hồ sơ thực tế thiếu dòng quan sát KHÔNG được gọi là khép — thẻ vẫn hỏi «ký hay trả».
- **Làn máy-đi-trước đọc cả tệp phát hiện.** Báo cáo để trống «Ngoài hợp đồng» mà
  `review-findings.md` còn mục chưa ai quyết thì hồ sơ không còn là xanh-sạch. Mục đã có dòng sổ
  gate2 của người («Ngoài-N») thì coi là đã định tuyến, không bắt ký lại.
- **Lớp CI vendored lên 15 tệp**, tính bằng bao đóng nạp của ba lệnh CI. `crm` từng đỏ CI ngày
  cài vì thiếu `product-map.mjs` và `trang-thai-ho-so.cjs`.

**Kho tiêu thụ phải làm khi cài:** đồng bộ lớp CI theo **danh sách** ở GUIDE §5.3 (không theo
con số: kho ở 2.18.0 thêm 5 tệp, kho ở 2.17 thêm 6, kho ở 2.16 thêm 7 — đo 23/09 trên sáu kho) và
**xoá** `lib/out-of-contract.js` — tệp đổi tên thành `lib/out-of-contract.cjs`.

**Đính chính 23/09/2026:** danh sách 15 tệp còn thiếu `skills/acceptance/references/opportunity-template.md`
mà `product-map.mjs` đọc; chép 15 tệp thì lệnh bản đồ thoát 2 (ENOENT). **Kho nâng từ bản dưới
2.13:** bản này thôi miễn cho làn ghim lại chỉ-chạy-suite (ADR 0014, 0015) — hồ sơ ghim bằng làn
ấy sẽ đỏ `[cua-van-hanh]` ngay lượt CI đầu (media-library: 9 hồ sơ); chạy chiến dịch ghim lại
(GUIDE §7.1) trước khi merge PR nâng. Từ 23/09 GUIDE §5.3 đổi đường mặc định sang **chạy cổng từ bản
kit ghim sha, không chép tệp** — hồ sơ: `docs/findings/2026-09-23-nang-sau-kho-len-2-18-1.md`.

**Giới hạn đã khai:** nhãn «Ngoài-N» là vị trí mục trong tệp phát hiện, nên một lượt chấm mới có
thể làm dòng sổ cũ trỏ nhầm mục (hạt giống `docs/plans/2026-09-22-hat-giong-nhan-ngoai-n-neo-theo-noi-dung.md`);
mutant 2 trong bộ đo của hồ sơ đã ký `lan-v-khong-phai-cho-ky` hỏng vì chữ ký hàm mới.

## 2.18.0 — 21/09/2026

Cửa sổ 2.17 → 2.18 kéo **hai ngày**, có **hai vòng** chạm engine, cả hai do owner gọi tên:
`ghim-lai-noi-ra-o-khong-do` (T2, ký 20/09) và `nhan-trang-thai-va-reality` (T3, ký 21/09,
ADR 0020). Đây là mốc đầu tiên có **kho chờ nhận đo được trước khi cắt**: ba hồ sơ ở `crm`
đang chờ đúng ba thứ bản này mang tới. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng
lên `2.18.0`; `diagram-design` giữ `2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Test của kho thôi bị đếm là thước.** Trước bản này, kho làm TDD bị phạt: mỗi lần sửa một
  tệp test bị đếm là một «nhát sửa thước», và ba nhát là lượt chấm bị chặn. Ở `crm`, ba nhát
  vào `apps/api/test/*.spec.ts` đã làm trần nổ đúng như thế. Nay test của kho là vật. Để
  không mất lưới, thước chuyển thành **chỉ-đọc trong lượt chấm**: máy chụp băm các tệp thước
  trước lượt và so lại sau lượt. Lệch thì thẻ khoá với nhãn «thước lệch» và nêu đúng tệp.
- **Thẻ Cổng Bằng chứng gọi đúng tên thứ đang gãy.** Trước đây mọi BLOCKED trông giống
  nhau: thẻ không có dòng lệnh, và người lái không có ô nào để chấp nhận một đồng hồ chưa
  đọc. Nay thẻ tách ba nhãn. **«Không đọc được ở đây»** là bàn đo không chạy được: thẻ mở ô
  ký có tên, kèm ba lối và ba giá. **«Hệ thống chết»** khoá lần đầu và mở sau đúng một lần
  thử lại. **«Thước lệch»** luôn khoá. Đỏ vì sản phẩm sai thì vẫn khoá như cũ. Ký trên cạnh
  gãy không hạ verdict: báo cáo giữ BLOCKED, và mỗi mục mang một dòng sổ có tên.
- **Reality có quyền đóng hồ sơ.** Một hồ sơ mà vật đã chạy trên prod từ lâu không còn phải
  dựng thêm thước chỉ để đóng. Lệnh mới `/acceptance-gate:observed` cho **người** ghi bản dựng
  đang phục vụ prod, ngày quan sát và tên. Hồ sơ chuyển sang «đã chấm bởi thực tế», rời nhóm
  đang dở, và mọi việc thước trên nó bị khoá. Lệnh này khoá với máy như sáu thao tác cổng
  người kia.
- **Thẻ in nguyên văn ý định.** Câu «vì sao làm việc này» từ ô cơ hội đi suốt tới lúc ký.
- **Một dòng hiệu chuẩn cho chữ «đủ».** `scripts/hieu-chuan-moc.mjs` in «ĐẠT đã ký → prod
  đỏ: k / N». Khi chưa hồ sơ nào có dòng quan sát prod, dòng in «vô hiệu» chứ không in «0 sự
  cố».
- **Ghim lại nói ra ô nó không đo.** Dòng ghim và thẻ cả hai cổng nêu các ô ngoài làn máy,
  ô mà diff đã chạm vật đo, và AC không có chốt máy. Không đổi hành vi chặn nào.

**Ai bị ảnh hưởng / làm gì:**

- **`crm`:** nâng engine, rồi đóng hoặc chấm ba hồ sơ đang chờ bằng các lối mới. Không phải
  dựng thêm bàn đo nào.
- **Mọi kho:** lớp tệp chép vào CI tăng từ **9 lên 10**. Chép lại
  `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`, `lib/workspace-record.cjs`,
  và **thêm** `lib/nhan-canh-gay.cjs`, cùng một lượt. Thiếu tệp mới thì hai bộ đọc của lưới
  không nạp được.
- **Kho có hồ sơ đã ký dùng trần nhát sửa thước:** eval của trần ấy mất tiền đề. Ở kit, đó
  là `thuoc-co-cua` E17. Cho hồ sơ ấy nghỉ bằng một dòng sổ ở chiến dịch ghim lại.

**Giới hạn đi cùng bản này** (nguyên văn ở mục Notes của
`_acceptance/nhan-trang-thai-va-reality/contract.md`): hồ sơ còn ở nháp vẫn nhảy thẳng sang
«đã chấm bởi thực tế» được, vì hook tự nhận là chặn nhưng không có mã nào chặn. Nhánh «không
tìm thấy lần lưu dòng quan sát» chưa có ca đỏ, và thông điệp của nó gợi ý sai cách sửa. Bộ
đếm thước bỏ qua phép so khi tệp tham số hỏng.

## 2.17.0 — 19/09/2026

Cửa sổ 2.16 → 2.17 kéo **một ngày**, có đúng **một vòng** chạm engine (`ho-so-nghi`, T3, ký
với giới hạn) cộng một bản vá đã ký từ cửa sổ trước (`nen-cong-cu-lenh-shell`). Mốc đi **làn
V**: một lượt người ở Cổng Phạm vi, không dựng răng mới, năm dòng số đếm tay. Hai gói cùng lên
`2.17.0`; `diagram-design` giữ `2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Một hồ sơ đã ký mà lời hứa của nó chết thì thôi chặn mọi PR.** Trước mốc này, một hồ sơ đã
  ký xong rồi mất tiền đề — kho nguồn của một phần phụ thuộc biến mất, nhà cung cấp gỡ một mô
  hình, hay chính đội cố ý đổi vật sau chữ ký — không có lối ra nào: luật đòi ghim lại, mà
  không ai ghim được. Người vận hành phải bỏ qua bằng tay ở mỗi lần mở PR. Nay có lối ra: một
  người viết **một dòng** vào sổ quyết định của hồ sơ, mang tên mình và một câu lý do. Khối
  lệnh bấm được nằm ở mục «Cho một hồ sơ nghỉ» trong sổ tay. Hồ sơ ấy rời khỏi lưới, và
  **không tệp đã ký nào đổi một byte** — chữ ký là sử liệu. Bốn nơi đọc cùng hỏi một hàm, nên
  lưới, bộ kiểm lại bằng chứng, bản đồ và thẻ nói cùng một chuyện. Mở lại bằng một dòng nữa.
- **Chỉ hồ sơ đã có chữ ký người mới nghỉ được.** Đây là nhát thu phạm vi có căn cứ đo được:
  trước khi thu, một hồ sơ bị bác và chưa ai ký, thêm đúng một dòng, là cổng thoát xanh.
  «Nghỉ» nghĩa là một lời hứa **đã ký** nay không kiểm lại được; hồ sơ chưa qua cổng thì bác
  hoặc xếp lại ở tầng cơ hội. Hồ sơ đi làn máy-đi-tiếp không có chữ ký nên phải ký trước.
  Dòng viết thiếu, một câu văn xuôi, hay thư viện vắng: tất cả chấm như hồ sơ đang sống, và
  lưới **nói ra** vì sao thay vì im.
- **Cảnh báo sai trên thẻ duyệt phạm vi đã tắt.** Đường nền hạ tầng đọc từ đầu của mỗi lệnh
  khai trong cấu hình rồi hỏi máy xem chương trình ấy có không. Lệnh dựng bằng cú pháp shell
  bị cắt cụt thành một chuỗi vô nghĩa, nên nó báo «thiếu công cụ» cho một công cụ vẫn chạy
  tốt. Một kho tiêu thụ vì thế mang cờ vàng trên **mọi** thẻ Cổng Phạm vi vì lý do sai — mà cờ
  luôn bật là cờ người ta học cách bỏ qua. Nay nó chỉ tra khi lệnh thật sự bắt đầu bằng một
  tên chương trình, và nói ra khoá nào nó cố ý không tra.

**Ai bị ảnh hưởng / làm gì:**

- **Kho đang bị một hồ sơ chết tiền đề chặn:** nâng engine, rồi viết một dòng nghỉ cho hồ sơ
  ấy theo khối lệnh trong sổ tay. Không cần migrate gì, không đụng hồ sơ nào khác.
- **Kho khai executor dựng bằng cú pháp shell:** cờ vàng thường trực trên thẻ Cổng Phạm vi sẽ
  tắt sau khi nâng. Không phải làm gì thêm.
- **Mọi kho:** lớp tệp chép vào CI có **ba** tệp đổi (`scripts/pre-merge-check.sh`,
  `scripts/recheck-evidence.cjs`, `lib/workspace-record.cjs`) — chép lại ba tệp ấy cùng lượt
  nâng. Bộ kiểm lại bằng chứng nay nạp `lib/workspace-record.cjs`; tệp ấy vốn đã nằm trong
  danh sách chép, và cả năm kho đang chạy bộ kiểm lại đều đã có nó (đo 19/09).

**Giới hạn đi cùng bản này** (nguyên văn ở `_acceptance/ho-so-nghi/contract.md` mục Known
limits, mỗi mục kèm lệnh tái lập): bản đồ và bộ quét còn lệch nhóm ở hai hình dạng hiếm (hồ sơ
nghỉ có phiên nghiệm thu, hoặc có ô cơ hội hỏng); ba phép đo của chính vòng chưa đủ chặt, trong
đó một đối chứng chưa bao giờ chạy. Cả năm là **phép đo**, không phải hành vi; vật sản phẩm qua
mọi phép đo máy và năm lệnh suite ở cả ba lượt chấm.

## 2.16.0 — 18/09/2026

Cửa sổ 2.15 → 2.16 kéo khoảng **một ngày** — ngắn nhất từ khi kit đếm năm dòng số.
Trong ngày đó kho chạy đúng **một** vòng meta, `thuoc-co-cua` (T3, ký 17/09), đúng
vòng mà mốc trước đã gọi tên sẵn. Nó lấy ba câu hỏi từ bảng 23 lớp hạ tầng — đứng
được trước khi chấm · chạy không đè nhau · cửa cho thước — và biến cả ba thành vật
máy giữ. Ba việc còn lại của cửa sổ là vá và sổ sách, không việc nào chạm engine.
Mốc này cũng chạy **chiến dịch ghim lại**, thứ hai cửa sổ trước đã hoãn — và nó
đỏ, nên nay có số thay cho phán đoán: một lượt làn trên trọn 72 hồ sơ đã ký tốn
2 giờ 25 phút máy, gặp 14 hồ sơ mất tiền đề, và vì luật «làn đỏ thì không ghi gì»
nên ghim lại được 0 hồ sơ. Hai gói cùng lên `2.16.0`; `diagram-design` giữ
`2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Tường hạ tầng lộ ở đầu vòng, không lộ giữa lượt chấm.** Trước đây một công cụ
  thiếu hay một lưới chưa cắm chỉ lộ khi lượt chấm đã chạy được nửa đường, và lượt
  ấy trả BLOCKED — ở vòng sản phẩm gần nhất, 2 trên 3 lượt chấm mất vì lớp này và 4
  trên 8 lần gọi người là hạ tầng. Nay đầu S1 có một **đường nền hạ tầng** chạy bằng
  máy, không LLM, bốn chân: mọi lệnh executor có trên máy chưa · các lệnh suite chạy
  một lần lần lượt rồi cây còn sạch không · lưới trước-merge chạy được như trên CI
  không · ba bản bộ máy có khớp nhau không. Kết quả thành một khối «Nền hạ tầng» trên
  thẻ Cổng Phạm vi, nên thứ chỉ người gỡ được gom đúng một lần vào lời mời cổng thay
  vì rải ra từng lượt. Hồ sơ cũ không có khối này thì thẻ treo một cờ vàng, không chặn.
- **Lệnh suite trong lượt chấm chạy lần lượt.** Làn chấm vẫn chạy mọi lệnh song song,
  kể cả những lệnh chạy trọn một bộ test trên cùng một cây. Hệ quả đã đo ở bốn kho: hai
  suite giẫm lên nhau, một chốt «cây sạch» bắt nhầm thư mục tạm của suite kia, và lượt
  chấm đỏ vì hạ tầng chứ không vì vật — chính lượt chấm 1 của mốc trước mất vì thế. Nay
  lệnh suite xếp một hàng tuần tự; lệnh eval vẫn song song như cũ.
- **Thẻ Cổng Bằng chứng thôi gọi một giới hạn đã khai là trượt.** Một eval được phép
  khai trước rằng mã thoát mong đợi của nó khác 0. Làn ghim lại đã hiểu điều đó từ
  2.11.0, nhưng thẻ thì không: nó đọc mọi mã khác 0 là trượt và nói ngược danh sách
  eval đỏ. Nay thẻ đọc cùng một nguồn với làn.
- **Lượt chấm nghe lời khai «không chạy».** Một eval tự khai `status: not-run` vẫn bị
  bộ sinh args đưa vào lượt chấm rồi chết ở đó — ca thật: một hồ sơ ở repo tiêu thụ
  phải đổi sang khai mã thoát để né, và một eval của vòng sản phẩm gần nhất bị thi
  hành rồi BLOCKED. Nay bên viết args và làn ghim lại rút danh sách từ **cùng một hàm**,
  và báo cáo nói ra ô bị loại bằng một dòng thay vì im.
- **Sửa thước có cửa.** Kit vốn đếm và chặn được «ngoài hợp đồng», nhưng việc sửa chính
  phép đo thì không có tên, không được đếm, không có trần — ở hai kho tiêu thụ, một
  phiên có 9 chỗ hỏng thước so 1 chỗ hỏng vật và 701 dòng thước so 20 dòng vật. Nay một
  bộ đếm suy từ git xếp mỗi tệp đổi vào một lớp và đếm số **nhát sửa thước** kể từ lúc
  hợp đồng sang «code xong»; thẻ Cổng Bằng chứng in một dòng «vật · thước · nhát»; và
  từ nhát thứ ba, bộ sinh args **từ chối sinh** rồi trình ba lối cho người: khai giới
  hạn có tên, đổi cách đo, hay mở một vòng có chủ ngữ là thước. Người chọn thì một dòng
  sổ mở van và mốc đếm dời tới đó.

**Ai bị ảnh hưởng / làm gì:**

- **Repo tiêu thụ — không có bước migrate.** Mọi khoá mới đều có đường đọc-cũ.
- **Repo tiêu thụ — lượt chấm có thể DÀI hơn.** Lệnh suite nay tuần tự, nên đường găng
  dài ra ở repo có nhiều suite nặng chạy song song được. Đổi lại là lượt chấm thôi đỏ
  giả vì hai suite giẫm nhau.
- **Repo tiêu thụ — eval khai không-chạy thôi bị thi hành.** Repo nào đã lách bằng cách
  khai một mã thoát mong đợi có thể khai lại cho đúng.
- **Repo tiêu thụ — lớp CI vendored:** không tệp nào trong bộ chín tệp đổi ở mốc này,
  không phải chép lại.

**Giới hạn đã khai:** đường nền hạ tầng chạy nền song song với lúc S1 còn viết tệp có
thể báo cây bẩn vì tệp của chính vòng; kho tự host kit không tự nhận ra điều đó với
lệnh mà tài liệu dặn, nên chân kiểm ba bản bộ máy có thể lệch giả. Ba phép đo của chính
vòng — hai ca thẻ và một ca chiều đỏ — chưa độc lập với nhau, đã tách thành một ô riêng
cho cửa sổ sau.

**Chi phí của chính cửa sổ:** vòng meta duy nhất tốn 54,8 triệu token cho hai lượt thi
công và ba lượt chấm, trong đó 30,0 triệu ở lượt chấm. Chiến dịch ghim lại của mốc
thêm 2 giờ 25 phút máy và không ghim được hồ sơ nào. Khối tìm-lỗi chiếm 71 % token
lượt chấm — vòng này không chạm giao diện nên không có làn nào khác chia mẫu số. Lượt
gọi người 5 so trần 4, vòng thứ năm liên tiếp vượt trần; lượt vượt là một lần owner phải
tự bắt lỗi mà bộ chấm cho qua. Một lượt thi công chết trọn vì hạn mức phiên. Số đầy đủ
và nhát cắt cho cửa sổ kế ở khối Notes của hồ sơ mốc.

## 2.15.0 — 17/09/2026

Cửa sổ 2.14 → 2.15 chạy dưới quyết định R của owner (16/09): không mở vòng meta
mới, đo cái đã ship trên một vòng sản phẩm thật. Vòng đó là `skill-system-v1` ở
OneFlow, ký 17/09 — lần đầu sau hai cửa sổ có một tính năng tới tay người dùng
trên kit mới. Cửa sổ vẫn có một vòng meta đã ký, `guide-chep-ci-buoc-vao-writer`,
ký buổi sáng trước khi R được chốt — đúng trần một vòng của luật. Ba việc nhỏ của
kit vào cửa sổ qua chip sau R; owner quyết đếm chúng là vá-trong-mốc và đếm đủ. Hồ sơ mốc `_acceptance/release-2-15-0/` có tiêu chí
cho cả ba, cùng năm dòng số lần đầu có cột từ repo tiêu thụ. Hai gói cùng lên
`2.15.0`; `diagram-design` giữ `2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Thẻ `/start` thôi mời viết code cho thứ đã ở nhánh gốc.** Ca thật ở
  crm-onehub 16/09: một hồ sơ đã merge từ 04/09 bị đặt ngược về «đã duyệt» để
  xếp lại, thẻ đọc thành «viết code», và một phiên 8 giờ 25 phút chấm lại thứ
  đang chạy trên prod. Nay hồ sơ «đã duyệt» có bằng chứng mang commit đã nằm
  trong lịch sử của cây — kể cả bản bằng chứng đã đổi tên khi xếp lại — hiện
  thành dòng riêng «vật đã nằm trong nhánh gốc», không có bước máy kế. Người chọn
  một trong hai lối ngay trong câu hỏi chọn sẵn có: đóng theo quan sát, hoặc chấm
  lại. Không thêm câu hỏi, không thêm cổng. Đo trên crm-onehub: cả bốn hồ sơ cùng
  hình dạng rơi vào dòng mới.
- **Lượt ghim lại dừng khi một phép đo ghi đè bằng chứng đã ký.** Cũng ở
  crm-onehub 16/09: một phép đo trong suite chung ghi lại tệp bằng chứng của một
  hồ sơ đã ký sau mỗi lượt chạy, ở mọi worktree, mất khoảng 450 dòng so bản đã
  ký, và không răng nào thấy. Nay làn ghim lại chụp cây của mọi hồ sơ đã thông
  Cổng Bằng chứng trước suite và sau eval; có tệp bị chạm thì làn đỏ, in đường
  từng tệp, không ghi gì. Luật đi kèm: lệnh chạy lại ghi tạo phẩm ra
  `.acceptance-runs/<slug>/` hoặc thư mục tạm, không bao giờ vào `_acceptance/`.
  Hai trạng thái «đã thông cổng» của răng hỏi đúng một nguồn trong bộ máy, không
  chép — owner đã veto lối khai gạch hai tệp trong một hồ sơ đã ký.
- **Dòng `/goal` thôi chặn hai kiểu dừng hợp lệ.** Ở vòng R1, hook `/goal`
  chặn 11 lần máy dừng đúng luật: 2 lần khi máy chờ người cài một công cụ còn
  thiếu trước bước nghiệm thu, 9 lần khi máy dừng ở trần sửa thước chờ người chọn
  lối — và máy trả lời lại cùng một câu 7 lượt. Bộ chấm của hook hiểu «chờ người»
  là chỉ ở tầng cả vòng. Khuôn mới nói rõ hai kiểu dừng giữa vòng ấy cũng là «chờ
  người», với điều kiện máy nêu đích danh tiền đề hoặc các lối để chọn; dừng không
  nêu gì vẫn bị chặn. Hiệu lực thật chỉ đo được ở vòng sản phẩm kế.
- **Kho kit: thẻ `/start` đếm vòng meta đang mở.** Luật cho tối đa một vòng meta
  giữa hai mốc, nhưng cửa sổ 2.13 → 2.14 có hai vòng chạy song song ở hai phiên
  và con số chỉ lộ khi mốc đếm. Ở chính kho kit, thẻ nay in «vòng meta đang mở
  trong cửa sổ: N» kèm tên, và cờ khi N từ 2 trở lên. Không cổng, không lệnh.
  Repo tiêu thụ không thấy dòng này.

- **Danh sách chép lớp CI ở GUIDE §5.3 khai đủ chín tệp**, và một phép đo buộc
  hai bản khai danh sách ấy vào các tệp mà cổng merge thật sự nạp. Trước đó GUIDE
  thiếu hai tệp; kho chép theo GUIDE sẽ tắt lặng một lớp cưỡng chế.

**Ai bị ảnh hưởng / làm gì:**

- **Repo tiêu thụ — làn ghim lại có thể ĐỎ sau khi update.** Script đo nào còn
  ghi tạo phẩm vào thư mục bằng chứng của một hồ sơ đã ký sẽ làm làn dừng, kèm
  đường tệp bị chạm. Việc phải làm: chuyển đích ghi của script đó sang
  `.acceptance-runs/<slug>/` (thêm thư mục này vào `.gitignore`). crm-onehub là ca
  đã biết, ở phép đo lai-ra-man của vòng chan-lai-component-ra-man.
- **Repo tiêu thụ — thẻ `/start`:** không có gì phải làm. Hồ sơ «đã duyệt» mà vật
  đã merge sẽ tự hiện ở dòng mới ở lần quét kế.
- **Repo tiêu thụ — lớp CI vendored:** không tệp nào trong bộ chín tệp đổi ở mốc
  này, không phải chép lại.
- **Kho kit:** thẻ mở phiên có thêm một dòng đếm vòng meta.

**Giới hạn đã khai:** phép hỏi «vật đã ở nhánh gốc» so với HEAD của cây đang
quét, không với nhánh gốc có tên. Lối «đóng theo quan sát» chưa có trạng thái hồ
sơ để ghi, nên dòng vẫn hiện sau khi ghi quyết định — nguyên thuỷ «xếp lại cho
vòng» còn thiếu, đã có tên ở ô `thuoc-co-cua`. Vòng S4 và CI chưa chụp cây hồ sơ,
chỉ làn ghim lại chụp. Dòng đếm vòng meta nhận hồ sơ mốc theo tên
`release-<x>-<y>-<z>`.

**Chi phí của chính cửa sổ:** vòng sản phẩm R1 tốn 147,8 M token cho bốn lượt S4,
cùng cỡ vòng meta nặng nhất của 2.14. Khối tìm-lỗi rơi về 9,5 %, nhưng làn `ui`
chiếm 91 % lượt cuối. Lượt gọi người 7 cộng 1 so trần 4, vòng thứ tư liên tiếp vượt trần.
Việc meta của cửa sổ không có số token nào: vòng đã ký không có báo cáo chi phí, các phiên chip không chạy `wf-usage`.
Số đầy đủ và nhát cắt cho cửa sổ kế ở khối Notes của hồ sơ mốc.

## 2.14.0 — 15/09/2026

Cửa sổ 2.13 → 2.14 có **hai** vòng đã ký, trong khi luật (b) cho một. Hồ sơ mốc
`_acceptance/release-2-14-0/` ghi thẳng điều đó, cùng năm dòng số của cả hai vòng
đếm bằng một luật và đối chiếu chéo giữa hai phiên. Hai gói cùng lên `2.14.0`;
`diagram-design` giữ `2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Trạm phân loại phạm vi thôi hỏng vì định danh do máy-nói chép sai** (vòng
  `do-tin-tram-phan-loai`). Trước đây kết quả phân loại được ghép về từng phát
  hiện bằng tiêu đề và đường dẫn do tác tử chép lại; chép lệch một ký tự là cả
  lượt rơi về đường «bác bỏ tất cả». Hai số đo, từ HAI vòng khác nhau — nói rõ để
  không ai đọc thành một: vòng `khoi-tim-loi-tra-phi-theo-vat` hỏng **3/6** lượt
  vì lớp này; và ở vòng `chu-ky-khong-tu-lam-hoa-cu`, lượt mất phân loại tốn
  **37 tác tử · 32,7 M token** so **13,7–16,7 M** ở bốn lượt có phân loại chạy
  đúng của cùng vòng. Lượt PASS của vòng ấy (50,2 M) đứng NGOÀI phép so vì nó
  chạy đối chứng đầy đủ trên cây đã gộp — bản trước của mục này gộp nó vào «mọi
  lượt lành» và vì thế nói quá. Nay mỗi phát hiện gửi đi mang một **mã do máy đúc**, kết
  quả ghép theo mã trước, mã lạ bị bỏ, và khi kết quả thiếu mã nào thì máy **hỏi
  lại đúng một lần** chỉ phần thiếu trước khi đặt cờ hỏng. Luật fail-toward-human
  không đổi: hỏi lại vẫn thiếu thì bác bỏ chạy toàn bộ như cũ.
- **Chữ ký thôi tự làm bằng chứng của chính nó hoá cũ.** Đo 14/09: từ lúc owner
  gõ «Ký» tới lúc báo sẵn-sàng-merge mất **54 phút** và **≈ 42 M token**, và
  **7/7** chữ ký của tuần đều chạy **ba** lượt làn máy ≈ 13 phút. Nguyên nhân
  không phải xui: ca canh định tuyến chỉ soi hồ sơ ĐÃ ký, nên chính chữ ký buộc
  bản ghi mốc thêm một dòng — mà tệp ấy là code, nên lưới trước-merge gọi bằng
  chứng hoá cũ và bắt ghim lại. Hai nhát: bản ghi mốc nay là **vật máy sinh**
  (dòng của nó do một lệnh sinh ra ngay trong lượt ký, cùng lớp với bản đồ sản
  phẩm — ADR 0019), và **làn trước chữ ký tự bỏ qua khi cây không đổi so với
  mốc đã chứng** (`--skip-unchanged`). Cây đã đổi sau khi chứng thì làn vẫn
  chạy trọn và luật đỏ y nguyên.

**Ai bị ảnh hưởng / làm gì:**

- **Repo tiêu thụ — HÀNH VI của engine: không có gì phải làm.** Trạm phân loại
  đòi tác tử trả thêm một trường mã; không trả thì rơi về khoá cũ. Cờ
  `--skip-unchanged` là tường minh, mặc định làn vẫn chạy trọn.
- **Repo tiêu thụ — LỚP CI VENDORED: PHẢI chép lại.** Câu trên chỉ nói về hành
  vi engine; nó KHÔNG miễn cho bạn bước chép. Bản đầu của mục này để mỗi câu
  «không có gì phải làm» nên đọc thành cả hai, và đợt rollout 16/09 cho thấy
  điều đó sai: so với **2.11.0** có **4/9** tệp đổi (`pre-merge-check.sh`,
  `evidence-core.cjs`, `ac-line.cjs`, `md-section.cjs`); kho còn ở 2.8.0/2.9.0
  thì thiếu hẳn `eval-yaml.cjs` và `lop-nhin-thay.cjs`, mà thiếu tệp nào là
  **tắt lặng một lớp cưỡng chế** trong khi CI vẫn xanh. Chép **đủ 9 tệp** theo
  khối `INIT-CI-COPY-LIST` của `commands/acceptance-init.md`.
- **Repo tiêu thụ — hai cái bẫy đo được trong đợt rollout đó:**
  - **PR nâng lớp vendored đỏ ở luật T1-escape** nếu kho chưa khai 9 tệp
    kit-owned trong `t1_skip_globs` (chúng là THƯỚC, không phải product code).
    Kho khai chúng trong `t3_paths` thì phải **rút khỏi t3_paths** — cổng kiểm
    `t3_paths` TRƯỚC `t1_skip_globs`, nên chỉ thêm vào skip là vô ích.
  - **Chạy `pre-merge-check` trước khi commit là phép đo nói dối:** luật
    T1-escape đọc diff ĐÃ COMMIT, nên bản vừa chép còn nằm ngoài commit là vô
    hình với nó. Bảy kho báo `clean` ở local rồi ba kho đỏ trên CI vì đúng lớp
    này. Kiểm sau commit, trên worktree dựng từ chính nhánh đó.
- **Kho tự host kit:** lượt ký ra sẵn-sàng-merge trong vài phút thay vì cả giờ
  (ADR 0019).

**Giới hạn đã khai:** bảy mục của vòng `do-tin-tram-phan-loai` đều ở tệp ca
hoặc chẩn đoán nội bộ; tải gửi trạm phân loại còn viết ở hai chỗ — đã vào hạt
giống cửa sổ kế (`docs/plans/2026-09-15-hat-giong-mot-nguon-tai-gui-triage.md`).
Vị từ «cây bằng pin» phía bash và phía JS chỉ đồng nghĩa trên danh sách T1 hiện
tại, ngưỡng đang đếm ở ADR 0019.

**Chi phí của chính cửa sổ (máy đo, hai vòng):** ≈ 199,9 M token cho hai vòng
meta; lượt gọi người **5 và 5** so trần 3 — mọi lượt vượt đều là lỗi hình thức
của máy, không lượt nào là quyết định thật. Số đầy đủ và chín nhát cắt cho cửa sổ
kế ở khối Notes của hồ sơ mốc.

## 2.13.0 — 14/09/2026

Cắt số tại `ea26fdfe` (14/09). Mục này ghi những gì đã gộp vào nhánh chính từ
lúc 2.12.0 được ký (`7e260d4b`, 14/09) tới lần cắt đó.

Trọn phần dưới đây đến từ MỘT vòng: `khoi-tim-loi-tra-phi-theo-vat` — vòng
meta duy nhất của cửa sổ 2.12 → 2.13 (luật (b), owner gọi tên 14/09). Hồ sơ:
`_acceptance/khoi-tim-loi-tra-phi-theo-vat/`.

**Đổi gì:**

- **Khối tìm-lỗi của S4 nay trả phí theo vật, không theo hồ sơ.** Đo trên 20
  lượt chấm (534,6 M token) thấy review + refute chiếm **83 %** token S4, mà
  **3/4** phát hiện đã trả tiền bác bỏ lại bị xếp ra ngoài hợp đồng — tức máy
  trả tiền chứng minh thứ chính nó không được sửa. Năm nhát cắt:
  - **Phân loại phạm vi đứng TRƯỚC bác bỏ.** Chỉ phát hiện trong hợp đồng mới
    trả phí bác bỏ; mục ngoài hợp đồng đi thẳng sang người ở Cổng Bằng chứng,
    mang cờ «chưa qua bác bỏ». Đo được: một lượt chấm của 2.12.0 chạy **20** tác
    tử bác bỏ và cả 20 đều soi hồ sơ chứ không soi vật; lượt PASS của vòng này
    chạy **0**, vì cả 12 phát hiện đều được xếp ngoài hợp đồng nên không mục nào
    phải trả phí bác bỏ. Hai lượt có phân loại lành khác chạy 5 và 0.
  - **«Vùng vật» có tên máy đọc.** Làn tìm-lỗi tập trung vào tệp thật sự đổi,
    thôi soi văn bản hồ sơ của chính vòng. Trước đó 20/20 tác tử bác bỏ soi hồ
    sơ và 0 soi vật.
  - **Mỗi phát hiện có một dòng trong sổ chạy**, nên lượt sau không chấm lại
    mục ngoài hợp đồng mà tệp của nó không đổi.
  - **Làn đối chứng rời đường găng.** Nó là tín hiệu phụ nhưng từng giữ đồng hồ
    của cả lượt; nay chạy riêng, chỉ đợi ở điểm muộn nhất cần.
  - **Thước token và phút.** `wf-usage` đo thời gian theo vai trò và sinh
    `usage-report.md`, tách ba khối chứng-minh-vật / tìm-lỗi / tổng hợp.

- **North star có thêm chi phí máy.** Thước của kit nay đếm cả **token và phút
  máy trên mỗi kết quả ship**, không chỉ giờ người. Dòng người vẫn đứng trước
  dòng máy: token giảm mà lượt gọi người tăng là thất bại. Luật (c) đi từ ba
  lên **năm dòng số** mỗi mốc phát hành.

- **Nghi thức kiểm phép đo nay HAI chiều.** Trước đây kit chỉ hỏi «phá vật thật
  thì phép đo có đỏ không» (độ nhạy). Nay hỏi thêm «chạm một thứ KHÔNG phải vật
  thì phép đo có IM không» (độ đặc hiệu). Thiếu chiều thứ hai, mọi luật về phạm
  vi của kit không thể sai được trong bất kỳ phép đo nào đang chạy.

- **Thẻ Cổng Bằng chứng nói đúng hơn.** Khối ngoài hợp đồng thôi nói các mục đó
  «là thật» — chúng chưa qua bác bỏ đối kháng, và thẻ nay nói vậy.

**Ai bị ảnh hưởng / làm gì:**

- **Kho tiêu thụ đang giữa một vòng lặp:** không có gì phải làm. Engine chỉ đổi
  dưới chân bạn theo bản phát hành có chủ đích, và 2.13 chưa ra. Kéo nhánh chính
  giữa hai mốc là tự chọn.
- **Kho tự dựng args cho S4:** nếu bạn gọi thẳng workflow chấm thay vì qua skill,
  bên viết nay truyền thêm năm khoá (`vungVat`, `ngoaiVatFiles`, `diffFiles`,
  `fileDoTrongDiff`, `coverageFiles` cùng `coEvalPaths`). **Thiếu khoá nào cũng
  không vỡ** — bên đọc có đường đọc-cũ cho từng khoá. Nhưng ba trong số đó rơi
  về đường cũ *lặng lẽ*: đó là một trong 12 giới hạn đã khai bên dưới.
- **Người đọc `usage-report.md`:** bảng theo vai trò đếm đúng số tác tử, nhưng
  dòng tiêu đề và tổng theo model vẫn đếm theo dòng (tác tử × model), nên hai
  con số trong cùng một báo cáo có thể lệch nhau. Giới hạn đã khai.

**Giới hạn đã khai (12 mục, owner ký 14/09):** không mục nào chạm hành vi người
dùng cuối — tất cả là nợ của chính bộ đo: một bản chép tay của hàm khớp đường
dẫn, cờ vàng thiếu cho ba khoá args mới, hai bộ đếm tác tử còn đếm dòng, một phụ
thuộc PyYAML chưa khai trong tài liệu cài đặt, và vài ca không đo được điều
chúng tuyên. Chi tiết từng mục:
`_acceptance/khoi-tim-loi-tra-phi-theo-vat/evidence-report.md`, mục
«Known limits». Chúng đi vào hạt giống mốc 2.13.

**Đã biết trước, chờ mốc 2.13 quyết** — `docs/plans/2026-09-14-hat-giong-ba-cho-cat-sau-chu-ky-cua-so-2-13.md`:

1. Ghim lại theo diff thay vì chạy trọn corpus (làn hiện tốn ≈ 12 phút mỗi lượt).
2. Fixture ghim định tuyến thẻ không được đỏ chỉ vì có hồ sơ mới ký.
3. Dòng số thứ nhất đo tới «lên nhánh chính», và nghi thức ship chạy nền.
4. Chiến dịch ghim lại: **41 trên 68** hồ sơ có ghim đang hoá cũ, mốc ghim cũ
   nhất tụt 411 commit. Đây là nợ có sẵn giữa hai mốc, không phải hồi quy — luật
   ghim-lại-theo-release gọi trạng thái này là chấp nhận được.

**Chi phí của chính vòng này (máy đo):** sáu lượt chấm, trong đó **ba lượt bị hạ
tầng đốt** — một lỗi ống lệnh, một lượt đỏ giả, một suite chập chờn không tái
hiện được. Cả ba đều xanh khi chạy tay. Số này vào dòng thứ ba của luật (c), và
nó lớn hơn phần tiết kiệm được nếu tính theo giờ người.
