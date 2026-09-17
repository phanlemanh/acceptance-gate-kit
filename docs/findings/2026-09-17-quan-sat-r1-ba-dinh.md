# Quan sát R1 `skill-system-v1` — ba đỉnh, bốn số, nhân chứng độc lập

> Vai: nhân chứng độc lập (chip 4 của
> [finding 16/09](2026-09-16-truy-nguyen-thuoc-khong-co-cua.md) §7). Phiên này
> không sửa vòng, không sửa kit, không mở vòng — chỉ đọc và ghi số. Đối tượng:
> vòng sản phẩm đầu tiên chạy trên kit 2.14.0 ở OneFlow, hồ sơ
> `_acceptance/skill-system-v1/` trên nhánh `feat/skill-system-v1` (worktree
> `relaxed-sammet-b381ba`), đọc tại HEAD `7a6bfa8` (17/09 01:25 +07). Điều kiện
> chạy đã tới: hợp đồng `status: verified` từ commit `1bc1843` (17/09 01:23 +07),
> verdict `PENDING-JUDGMENT`, `human_signoff` trống — **Cổng Bằng chứng CHƯA ký lúc
> đo**, nên số 4 còn một lượt trong thiết kế đang chờ. Nguồn: hồ sơ trên nhánh,
> git của oneflow, `usage-report.md` do `wf-usage` sinh, và transcript phiên chạy R1
> (`~/.claude/projects/-Users-manhphan-dev-oneflow--claude-worktrees-relaxed-sammet-b381ba/99f5dccb-b708-439b-9cfe-840162211b3e.jsonl`,
> mốc giờ UTC). Không số nào ước; chỗ không đo được ghi «không đo được».

## Bốn số

| # | Số | Giá trị | Nguồn |
|---|---|---|---|
| 1 | Tiền đề dry-run trước Cổng Phạm vi | **8/10 đứng được · 2 tường bị bắt trước Cổng 1** (TD-8 một phần · TD-10 không đứng), cả hai xử ở S1 | `decisions.jsonl` entry `d-20260916T115631Z-10` (dòng 10) và `d-20260916T120538Z-11` (dòng 11) · `contract.md:40` (TD-8) · `contract.md:42` (TD-10) |
| 2 | Nhát sửa thước ở S4 (hợp đồng `implemented`) | **3** entry `type: fix` bắt đầu «thước:» · **5** nếu đếm theo tệp chạm (thêm 2 entry «Hạ tầng đo» chạm executors và script đo) · dòng S4: **thước +121/−22 (4 tệp) · vật +24/−9 (1 tệp)** | entry `-17`, `-19`, `-21` (dòng 17, 19, 21) · entry `-22`, `-23` (dòng 22, 23) · `git diff --numstat 98a96d7..7a6bfa8`, luật phân loại ở §2 |
| 3 | Dòng 4b — token khối tìm-lỗi / tổng S4 | lượt 3 (lượt cuối, gần «lượt PASS» nhất): **2,7 %** · lượt 1: 20,2 % · lượt 2: 10,0 % · cả 4 lượt gộp: **9,5 %** | `usage-report.md` dòng 59–122 (lượt 1), 124–188 (lượt 2), 190–248 (lượt 3), 27–57 (lượt huỷ); nền và ánh xạ vai trò → khối chép từ hồ sơ mốc `_acceptance/release-2-14-0/contract.md:208` |
| 4 | Lượt gọi người trong vòng | **7 đã xảy ra + 1 đang chờ**: trong thiết kế 2 (Phạm vi · 1.5) + 1 chờ (Bằng chứng), Đáng = 0 theo thiết kế lát cắt · **ngoài thiết kế 5, trong đó 4 hạ tầng** · chạm: 2 trong / 10 ngoài | transcript phiên R1, từng mốc giờ ở §4 |

## 1. Tiền đề dry-run — 8/10, bắt 2 tường trước Cổng 1

Entry `d-20260916T115631Z-10` (`type: approach`, `stage: S1`, 11:56 UTC, 30 phút
trước Cổng 1 lúc 12:26): «tiền đề dry-run: 8/10 đứng được — subagent đặt/kiểm/trả
từng tiền đề trên thư mục tạm của lượt». Hai tiền đề không đứng, và cả hai được xử
ngay ở S1 như thử nghiệm (b) yêu cầu:

- **TD-8 (máy chủ của CÂY NÀY) — một phần.** Vế nhận diện cây bằng slug proto trả
  404 vì proto chưa có lúc chạy, và slug proto của `main` không phân biệt được cây.
  Xử tại S1: thêm vế thứ hai — thư mục làm việc của tiến trình đang nghe cổng phải
  bằng gốc worktree (`contract.md:40`). Đây là đúng lớp tường «máy chủ trỏ nhầm cây»
  của phiên 16/09, bắt ở S1 thay vì S4.
- **TD-10 (`uv` cho suite khoá `sdk_pytest`) — không đứng.** Máy không tự cài phần
  mềm hệ thống → khai giới hạn có tên, quyết ở Cổng 1 (`contract.md:42`). Entry `-11`
  (12:05 UTC) sửa hệ quả trước Cổng 1: lối «chấp nhận ô đỏ có tên» không tồn tại vì
  exit 127 bị S4 xếp vào hạ tầng hỏng → mọi lượt BLOCKED; lối thật là người cài `uv`
  trước S4 hoặc bỏ khoá khỏi suite của vòng.

Điều số này không nói: tường TD-10 bị bắt nhưng **không được gỡ trước S4**. Lời
mời Cổng 1 đặt việc cài `uv` thành bước riêng sau khi duyệt; người gõ `brew` hỏng
vì PATH (12:59 UTC), `uv` được cài qua một phiên khác lúc ~13:05 UTC (entry `-18`),
còn S4 lượt 1 đã dispatch từ 12:57 UTC → BLOCKED đúng vì `uv`. Cùng tiền đề đó lộ
lớp thứ hai ở lượt 2 mà dry-run không thấy: `uv` chọn Python 3.9 hệ thống trong khi
SDK khai `>=3.10` (entry `-22`). Hai tường khác dry-run không có dòng nào để bắt:
E14 đỏ chỉ dưới tải đầy của S4 vì tranh tài nguyên với làn ui (entry `-23`, `-24`;
xanh 22/22 khi chạy riêng cả ba lần) và `pnpm test` đỏ một test ngoài phạm vi do hai
lượt cùng ghi `sdk/build` — rủi ro TD-5 đã gọi tên (`contract.md:37`) nhưng chỉ chắn
cho E8, không chắn cho suite chung.

Thử nghiệm (a) `## Vật trước vòng`: «Ở nhánh gốc: không — 31199f4» theo sự thật git
(`contract.md:24`); vòng này là vật mới hoàn toàn nên phép kiểm kiểu W9 không có gì
để bắt (chiều im đúng). Dòng «Giá trị mới tới người dùng» vẫn mang nhãn `[máy đề
xuất — người gạch ở Cổng 1]` sau khi Cổng 1 đã duyệt (`contract.md:26`) — người
không gạch, không sửa.

## 2. Nhát sửa thước ở S4 — 3 theo tiền tố, 5 theo tệp chạm

Hợp đồng ở `implemented` từ commit `98a96d7` (16/09 19:55 +07) tới `1bc1843`
(17/09 01:23 +07). Trong cửa sổ đó sổ có 8 entry (dòng 17–24); 6 entry `type: fix`:

| Entry | Stage | Tiền tố | Chạm gì | Cách đếm |
|---|---|---|---|---|
| `-17` (dòng 17) | S4-r1 | «thước:» | gỡ E15 khỏi `evals.yaml` — ô đã khai `not-run` từ S1 nhưng S4 của kit 2.14.0 vẫn thi hành và trả BLOCKED | nhát 1 |
| `-19` (dòng 19) | S4-r1 | «thước:» | `registry.test.ts` (E1) thêm ma trận ba ca đích tham số; cùng commit `4645a51` sửa vật `integrity.ts` | nhát 2 |
| `-21` (dòng 21) | S4-r2 | «thước:» | `registry.test.ts` (E1) lấy loại trường từ binding, thêm ca đỏ trường nối bằng cạnh; vật đi riêng entry `-20` | nhát 3 — owner cho phép sau khi máy dừng (§4 mục d) |
| `-22` (dòng 22) | S4-r2 | «Hạ tầng đo (không phải nhát thước)» | khoá dùng chung `sdk_pytest` trong `_acceptance/config.yaml` thêm `uv run --python ">=3.10"` | theo tiền tố: không · theo tệp (executors) : có |
| `-23` (dòng 23) | S4-r2 | «Hạ tầng đo (không phải nhát thước)» | `check-a11y-proto.sh` chờ máy chủ 300 s thay 120 s | theo tiền tố: không · theo tệp (script đo): có |
| `-24` (dòng 24) | S4-r3 | «Hạ tầng đo» | không chạm tệp — ghi giới hạn kiến trúc của làn chấm (E14 phải chạy SAU làn ui) | không |

Thử nghiệm (c) định nghĩa nhát thước theo **tệp chạm** (evals.yaml · executors
trong config.yaml · script đo) nhưng phiên ghi sổ theo **bản chất** (đổi điều
khẳng định hay không) và owner chuẩn y cách đó (cross-session 13:54 UTC: «không
đổi điều gì khoá đó khẳng định»). Hai cách đếm cho 3 và 5; ngưỡng «≥ 3» của ô
`thuoc-co-cua` chạm ở cả hai. Trần «dừng ở nhát thứ ba» nổ đúng một lần, ở 13:50
UTC, sau lượt 2.

**Dòng theo đường dẫn** (`git diff --numstat`, tệp nhị phân đếm 0). Luật phân loại:
*thước* = `_acceptance/skill-system-v1/evals.yaml` · `_acceptance/config.yaml`
(executors) · `scripts/skills/` trừ `build-template.ts` (script đo: check-a11y-proto ·
check-second-skill-paths · e2e-tach-tieng · luot) · tệp `.test.ts`/`.test.tsx` ·
`src/lib/skills/test-support/`; *vật* = phần còn lại của `src/`, `package.json`,
`tsconfig.json`, `scripts/skills/build-template.ts` (script dựng template, tooling của
vật); *hồ sơ* = phần còn lại của `_acceptance/skill-system-v1/` và `docs/`.

| Cửa sổ | Thước | Vật | Hồ sơ |
|---|---|---|---|
| S3: Cổng 1 `dc5f6f7` → `implemented` `98a96d7` | +2 628/−4 (26 tệp: test +2 010, script đo +612, evals +6/−4) | +1 713/−8 (36 tệp) | +1 045/−2 |
| **S4: `98a96d7` → HEAD `7a6bfa8`** | **+121/−22 (4 tệp)**: `registry.test.ts` +104/−5 · `evals.yaml` +4/−13 · `check-a11y-proto.sh` +9/−3 · `config.yaml` +4/−1 | **+24/−9 (1 tệp)**: `integrity.ts` | +11 493/−55 (23 tệp, phần lớn bằng chứng và `s4-args.json`) |
| Toàn vòng Cổng 1 → HEAD | +2 741/−18 (27 tệp) | +1 728/−8 (36 tệp) | +12 537/−56 |

Thước ở S3 gấp 1,5 lần vật là TDD (test và script đo sinh cùng vật), đúng ca ô
`thuoc-co-cua` nói không được đếm; ở S4 tỉ lệ dòng thước/vật là 5:1 trên số tuyệt
đối nhỏ. Commit Cổng Bằng chứng chưa tồn tại; HEAD `7a6bfa8` (thẻ dựng lại sau lượt
chạy lại hạ tầng) là mốc thay thế, và lượt ký chỉ có thể thêm dòng hồ sơ.

## 3. Dòng 4b — 2,7 % ở lượt cuối, 9,5 % gộp bốn lượt

`wf-usage` có đủ ở cả bốn lượt S4, kể cả lượt máy tự huỷ sau ~1 phút vì soạn args
bằng tay. Nền: bảng vai trò của `usage-report.md` (out + in + cache_read, KHÔNG
cache_create), ánh xạ như hồ sơ mốc 2.14.0: `review` + `refute` → tìm-lỗi ·
`machine` + `baseline` + `triage` + `capture` → chứng-minh-vật · `synthesize` → tổng
hợp; hai vai `ui` và `judge` (mốc 2.14.0 không có) xếp vào chứng-minh-vật theo luật
(c) của CLAUDE.md.

| Lượt | Tổng (nền bảng vai trò) | Tìm-lỗi | Chứng-minh-vật | Tổng hợp | Ghi chú |
|---|---|---|---|---|---|
| 1 huỷ (`wf_205cc7dc`) | 0,41 M | 0 % | 100 % | — | dừng trước khi review/refute chạy |
| 1 (`wf_052e1d41`) | 41,03 M | **20,2 %** (8,30 M: review 6,86 · refute 1,44) | 79,5 % (ui 67,7) | 0,3 % | BLOCKED (uv, E15) |
| 2 (`wf_23a77d66`) | 33,08 M | **10,0 %** (3,32 M: review 1,21 · refute 2,11) | 87,6 % (ui 71,5) | 2,4 % | REJECT (E14, phát hiện AC-1) |
| 3 (`wf_1f85697e`) | 67,76 M | **2,7 %** (1,85 M: review 1,85 · refute 0) | 96,4 % (ui 91,2) | 0,9 % | BLOCKED hạ tầng, 0 phát hiện trong hợp đồng, không có refute |
| Gộp 4 lượt | 142,27 M | **9,5 %** (13,48 M) | 89,5 % | 1,1 % | |

Không có «lượt PASS» đúng nghĩa: verdict `PENDING-JUDGMENT` đến từ lượt chạy lại
hạ tầng (commit `3863962`: E14 và `pnpm test` chạy riêng, tuần tự, bằng subagent),
không phải Workflow nên `wf-usage` không phủ — token của lượt đó **không đo được**.
Lượt 3 là lượt gần nhất với «lượt PASS» (mọi eval hợp đồng xanh trừ E14). Số đọc
cùng nền với mốc 2.14.0 (75,4 % ở vòng meta A): ở vòng sản phẩm này khối tìm-lỗi
nhỏ ở cả ba lượt, và nhỏ dần vì hai chuyển động cùng lúc — tìm-lỗi giảm tuyệt đối
(8,30 → 3,32 → 1,85 M, lượt 3 không có phát hiện để refute) trong khi làn `ui` phình
(27,8 → 23,7 → 61,8 M; riêng `ui:E13` lượt 3: 216 lượt gọi, 40,3 M cache_read, 1 432 s
— chính lượt E14 tranh tài nguyên với làn ui). Theo luật R (finding 15/09 §3), số này
rơi về phía «≤ 60 %».

## 4. Lượt gọi người — 7 đã xảy ra, 1 đang chờ

Định nghĩa đếm: một lượt = một lần vòng dừng chờ người, do máy hỏi hoặc do máy treo
và người phải thúc. Transcript không có lời gọi `AskUserQuestion` nào; mọi lượt là
câu hỏi trong văn hoặc chỗ treo. Chạm = số lần người phải gõ/dán/làm để lượt đó
được trả lời.

| # | Giờ UTC | Loại | Việc | Chạm | Chờ |
|---|---|---|---|---|---|
| Đáng | — | trong thiết kế | **0** — không đi Cổng Đáng riêng: hợp đồng trỏ về ô `skill-1-footage-kho-clip` đã ký 05/09 theo thiết kế lát cắt (`contract.md:88`; máy nêu 11:39) | — | — |
| Phạm vi | 12:26:56 | trong thiết kế | `/acceptance-gate:approve skill-system-v1 duyệt`; thẻ Cổng 1 gửi 12:14:42 kèm ba hình | 1 | 12 phút |
| 1.5 | 12:35:14 | trong thiết kế | dán `/goal …` — dòng máy mời sẵn trong thẻ Cổng 1 «để đoạn máy chạy tới cổng kế»; máy đọc là duyệt kế hoạch (12:35:21). Kế hoạch commit 12:34:20, máy trình 12:35:12, người dán sau **2 giây** | 1 | — |
| Bằng chứng | — | trong thiết kế | **đang chờ** — thẻ dựng `7f5dc56` (14:30) và dựng lại `7a6bfa8` (18:25), 17 phát hiện ngoài hợp đồng chờ ký | — | — |
| a | 11:39:13 | ngoài — hạ tầng | «retry»: bốn agent đọc của S1 chết vì lỗi API (11:19–11:20, «organization has disabled Claude subscription access»), máy đứng tới khi người thúc | 1 | 19 phút |
| b | 12:08:24 | ngoài — hạ tầng | «tiếp tục»: agent vẽ hình quyết định treo, máy kết thúc lượt «đang chờ agent» (12:07:21) | 1 | 1 phút |
| c | 12:56:23 → 13:24:57 | ngoài — hạ tầng | máy hỏi «Anh cài `uv` được không?» (hai lối: cài · bỏ `sdk_pytest`). Người gõ `brew install uv` trong terminal, hỏng vì PATH (12:59:46); máy chỉ đường đầy đủ; owner nhờ phiên khác cài ~13:05, máy biết lúc 13:24:57. Hook `/goal` không nhận lần dừng nên S4 lượt 1 vẫn dispatch 12:57 trước khi có `uv` | 2 | ~28 phút |
| d | 13:50:11 → 13:56:49 | ngoài — phạm vi đo | máy dừng ở nhát «thước:» thứ ba, ba lối (giới hạn có tên · đổi cách đo · mở vòng thước) — đúng thiết kế thử nghiệm (c) của R1, không phải cổng của kit. Cùng lượt máy kèm hai câu hạ tầng (`sdk_pytest` Python 3.9 «việc anh quyết» · E14 dưới tải); owner trả lời cả hai là «tự sửa, không phải câu hỏi cho người». Hook `/goal` chặn 9 lần (13:50:18–13:51:29), người phải `/goal clear` hai lần | 4 (`/goal clear` ×2 · quyết qua phiên khác · «đồng ý» tại đây) | 6,5 phút |
| e | 14:30:10 → 18:19:04 | ngoài — hạ tầng | máy hỏi cách đóng E14 và `pnpm test` đỏ vì hạ tầng: (a) chạy lại riêng, tuần tự, phiên tươi · (b) khai giới hạn. Owner chọn (a) qua phiên khác (18:18:24), «Xác nhận» tại đây (18:19:04) | 2 | 3 giờ 49 phút |

Tổng: **trong thiết kế 2 đã xảy ra + 1 đang chờ = 3** (trần T3 = 4, Đáng rỗng theo
thiết kế) · **ngoài thiết kế 5**, hạ tầng **4/5** (a, b, c, e), phạm vi đo 1/5 (d — và
d gói kèm hai câu hạ tầng bị owner bác). Chạm: trong 2 · ngoài 10. Nếu không đếm hai
lần máy treo người thúc (a, b): ngoài thiết kế 3, hạ tầng 2. Cả bảy lần owner chọn
đúng lối máy khuyên hoặc lối máy đã đặt sẵn. Ba lượt ngoài thiết kế (c, d, e) đi qua
một phiên khác rồi mới được xác nhận tại phiên R1 — mỗi lần thêm một chạm.

## 5. Số đọc kèm (cùng nguồn, ngoài bốn số được giao)

- Dòng 4 tuyệt đối, nền per-model có cache_create (như ô «4 token máy/lượt» của mốc
  2.14.0): lượt huỷ 0,69 M · lượt 1 42,83 M · lượt 2 34,82 M · lượt 3 69,43 M · **S4
  gộp 147,77 M**, 36,9 M/lượt tính ba lượt trọn. S1 fan-out Explore: 8,48 M (11
  agent, `usage-report.md:1–25`). Phiên chính không có hoá đơn quy đổi — không đo được.
- Dòng 5, phút máy/lượt chấm: lượt 1 23,3 · lượt 2 21,6 · lượt 3 30,0 phút; đường găng
  cả ba lượt là làn `ui`; S4 gộp 75,0 phút.
- Thời gian làm-xong → quyết-được: `implemented` 12:55:55 UTC → `verified` 18:23 UTC
  = 5 giờ 28 phút, trong đó 3 giờ 49 phút chờ ở mục e; chưa đóng vì Cổng Bằng chứng
  chưa ký.
- Lượt chấm bị hạ tầng đốt: 2/3 lượt trọn (lượt 1: `uv` + E15 thi hành ô `not-run`;
  lượt 3: E14 dưới tải + `sdk/build` đua), cộng lượt huỷ do args soạn tay.

## 6. Kết luận

Trên vòng sản phẩm đầu tiên của kit 2.14.0, cả hai vế của điều kiện mở ô
`thuoc-co-cua` đều có số dương: dry-run tiền đề bắt 2 tường trước Cổng Phạm vi
(một trong đó đúng lớp «máy chủ trỏ nhầm cây» của phiên 16/09), và S4 tiêu 3 nhát
«thước:» theo tiền tố (5 theo tệp chạm) với trần dừng nổ đúng một lần — nhưng tường
bị bắt không đồng nghĩa tường được gỡ: `uv` bắt ở S1 vẫn làm BLOCKED lượt 1 vì việc
gỡ đi qua tay người và một phiên khác, rồi lộ lớp thứ hai (Python 3.9) mà dry-run
không có dòng để thấy; hai tường còn lại của vòng (E14 dưới tải, `sdk/build` đua) là
tranh tài nguyên của chính làn chấm, không thuộc tiền đề nào. Dòng 4b ở kho tiêu thụ
là 2,7 % ở lượt cuối và 9,5 % gộp bốn lượt, tức khối tìm-lỗi không phải nơi token
S4 của vòng này đi — làn `ui` chiếm 68 → 72 → 91 %, và không có lượt PASS nào để đọc
đúng ô «lượt PASS» của luật (c) vì verdict đến từ lượt chạy lại hạ tầng không có
`wf-usage`. Lượt gọi người 7 đã xảy ra so trần T3 4, với 5 ngoài thiết kế và 4 trong
số đó là hạ tầng (API chết, agent treo, `uv`, tranh tài nguyên làn chấm); hai cổng
trong thiết kế đều 1 chạm, và Cổng 1.5 được «duyệt» bằng dán một dòng hook 2 giây sau
khi kế hoạch được trình. Bốn số này là số của một vòng; chúng chưa nói xu hướng.

## 7. Không đo được và giới hạn của phép đếm

- Token của lượt chạy lại hạ tầng (`3863962`) và của phiên chính: không có `wf-usage`
  hay hoá đơn — không đo được, không ước.
- Cách đếm nhát thước phụ thuộc định nghĩa (tiền tố hay tệp chạm); ghi cả hai, không
  chọn thay owner.
- Cổng Bằng chứng chưa ký khi đo: số 4 sẽ tăng ít nhất 1 lượt trong thiết kế; số 2
  chỉ đổi nếu lượt ký kéo theo sửa thước.
- Lượt gọi người đếm từ transcript một phiên; phần owner trao đổi ở phiên «Sửa lỗi
  tiếng Việt token» chỉ thấy qua ba tin nhắn liên phiên, không đếm chạm ở phiên đó.
