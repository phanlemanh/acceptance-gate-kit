# Thời gian mỗi task KHÔNG tăng — thứ tăng là tổng số chữ ký và phần sửa-thước

Ngày đo: 2026-10-02 (W40 mới có 4 ngày). Câu hỏi của owner: «thời gian trung bình
trên mỗi task và merge lên GitHub có vẻ ngày càng tăng — chi phí này là gì?»

Nguồn: `gh pr list` + `git log --merges --first-parent` + `_acceptance/*/{contract,
decisions.jsonl,run-log.jsonl,usage-report.md}` trên ba kho (kit · crm `origin/onehub`
· radar `origin/master`, đo trên cây tạm của remote — checkout crm cục bộ trễ 3 015 commit).
Script đo nằm ở scratchpad phiên, không vào kho; cách đo ghi đủ dưới mỗi bảng để dựng lại.

## 1. Thước «mỗi task» — không tăng, đang giảm

Trung vị theo tuần ký Cổng 2. «mở→ký» = commit đầu chạm `_acceptance/<ô>/` → commit đổi
`status: signed-off`.

| tuần | kit: ô ký · mở→ký p50 · p75 · lượt S4 p50 | crm: ô ký · mở→ký p50 · p75 · lượt S4 p50 |
|---|---|---|
| W37 | 11 · 10,3 h · 18,5 h · 4 | 17 · 7,5 h · 17,4 h · 3 |
| W38 | 15 · 7,8 h · 12,6 h · 3 | 7 · 7,1 h · 10,0 h · 3 |
| W39 | 14 · 2,4 h · 6,0 h · 1,5 | 61 · 3,1 h · 5,9 h · 2 |
| W40 | 5 · 2,2 h · 5,5 h · 1 | 31 · 3,2 h · 11,9 h · 2 |

PR mở→merge ổn định dưới 1 giờ ở cả ba kho (trung vị 0,2–0,7 h). Không có chỗ nào chờ merge.

Nhánh commit-đầu→merge (mọi merge trên nhánh chính, không chỉ ô): crm W39 2,1 h → W40 5,7 h
(p75 5,5 → 11,6 h; commit/nhánh 13 → 17; nhánh dài nhất `soan-okr-cung-tro-ly` 55 h · 241
commit). **Chỉ đuôi (p75/p90) ở crm W40 dài ra, do việc OKR to hơn** — không phải xu hướng
chung.

## 2. Thứ thật sự tăng — ba dòng

### 2a. TỔNG lượt gọi người (chữ ký), không phải lượt/vòng

| tuần | crm duyệt Phạm vi | crm ký Cổng 2 | kit duyệt + ký | **tổng chữ ký** |
|---|---|---|---|---|
| W37 | 11 | 17 | 22 | 50 |
| W38 | 8 | 7 | 21 | 36 |
| W39 | 42 | 61 | 18 | **121** |
| W40 (4 ngày) | 16 | 31 | 7 | 54 |

Mục tiêu ≤3 lượt/vòng ĐANG ĐẠT (W39: 103 chữ ký / 61 vòng crm ≈ 1,7). Nhưng 61 vòng/tuần
× 1,7 = 17 chữ ký mỗi ngày làm việc. Cái owner cảm thấy là **tích phân**, không phải đạo hàm.

Trong số đó, ký «trạm thu phí» (ô chỉ 1 lượt chấm, 0 quyết định sửa ở S4 — câu trả lời hợp lý
duy nhất là «ừ»):

| tuần | crm ký | crm trạm thu phí | …T2 | kit ký | kit trạm thu phí |
|---|---|---|---|---|---|
| W39 | 61 | 21 (34 %) | 16 | 14 | 8 (57 %) |
| W40 | 31 | 12 (39 %) | 9 | 5 | 4 |

**Đính chính 02/10 (bản đầu ghi «làn V 0 lần dùng» — SAI, vì phép đếm chỉ nhìn hồ sơ có chữ
`signed-off`):** crm đã đi làn V **9 lần** (12/09 → 26/09, tất cả T2), kit 1 lần (01/10). Từ
26/09 crm không có ô nào máy thông. Chạy chính bộ phân loại sáu điều kiện của kit
(`scripts/khong-can-nguoi.mjs` → `xanhSach`) lên 32 ô trạm thu phí W39–40 của crm:

- **21 ô XANH-SẠCH đủ sáu điều kiện** (T2 · PASS · 0 UNCERTAIN · không bypass · Known limits
  rỗng · Ngoài hợp đồng rỗng) **mà vẫn có người ký**; 14 trong 21 đã mang `veto_state: mo`
  (máy đi làn V ở Cổng Phạm vi) rồi dừng mời ký ở Cổng Bằng chứng. Khoảng cách
  `verified` → `signed-off` của 21 ô: 2–16 phút ở 17 ô (trung vị 5 phút) — người ký ngay khi máy
  mời, không đọc thêm gì. Sổ không có dòng `seal` nào, không dòng nào nói khó-đảo.
- 11 ô còn lại không đủ điều kiện có lý do tên: 9 ô T3 (làn V chỉ T2) · 2 ô «Ngoài hợp đồng» có
  nội dung · 1 ô có UNCERTAIN.
- Kit: 8 hồ sơ release không đủ vì «Known limits» luôn có nội dung — đúng thiết kế («mốc phát
  hành ≤1 lượt»); 1 ô T2 xanh-sạch (`nen-cay-ban-dong-dau`) vẫn được người ký.

Nghĩa là **22 chữ ký trong hai tuần là làn V bị bỏ qua ở bước cuối** — luật có, bộ phân loại có,
đường ghi có (`--write`), nhưng phiên không chạy nó mà trình thẻ mời ký. Chỗ rò nằm ở hàng
`verified` của bảng trạng thái feature-loop (SKILL dòng 24) và bước 4b của acceptance SKILL —
cả hai dặn bằng LỜI; không răng nào đỏ khi một ô xanh-sạch T2 nhận chữ ký người thay vì
`machine-cleared`. Chưa đo được từ tệp vì sao phiên bỏ qua (transcript không trong kho).

### 2b. Hai phần ba việc sửa đi vào THƯỚC, không vào VẬT

Phân loại dòng `type: fix` trong `decisions.jsonl` bằng từ vựng (thước · eval · fixture ·
harness · kit · hạ tầng · S4 · chiều đỏ … = THƯỚC; còn lại = VẬT). Heuristic, sai số vài điểm %.

| tuần | crm fix THƯỚC / VẬT | % thước | kit fix THƯỚC / VẬT | % thước | S4 phút/ô (ô có usage) crm |
|---|---|---|---|---|---|
| W37 | 60 / 33 | 64 % | 68 / 21 | 76 % | – |
| W38 | 22 / 20 | 52 % | 79 / 12 | 86 % | – |
| W39 | 142 / 64 | **68 %** | 25 / 7 | 78 % | 28,8 |
| W40 | 116 / 65 | **64 %** | 6 / 3 | 66 % | 27,3 |

crm W39: 5 097 lượt chạy eval (gấp 5 W38), 479 ở lượt ≥4; Σ S4 out-tok 7,75 M · 1 118 phút
máy. W40 (4 ngày): 2 374 lượt · 4,42 M tok · 782 phút. Đây là chi phí máy chưa có mặt trong
cảm giác «mỗi task», nhưng là nửa sau của giờ-kit.

### 2c. Kit: merge nghi thức lấn merge vật

Phân loại tay 33 merge kit W39: 8 chạm vật (24 %) · 5 release · 3 ghim lại · 16 docs/hạt
giống/finding · 1 UAT. W40 (16 merge): 4 chạm vật (25 %) · 10 nghi thức (mở ô · Cổng Đáng ·
release ×2 · ghim lại ×2 · handoff ×2). Commit trên `main` không chạm engine: 61–78 % mọi tuần
từ W32 (không tăng — nhưng cũng chưa bao giờ dưới 60 %).

Sáu mốc số trong 10 ngày (2.18.2 → 2.20.0); **ba mốc không kho nào cài** (2.18.2 · 2.18.4 ·
2.19.0). Mỗi mốc = release PR + ghim lại PR + handoff + chore PR ở kho tiêu thụ ≈ 4 merge. Luật
(b) CLAUDE.md đã gọi tên vế này và khai nó chưa có răng; ngưỡng «mốc cắt số mà 21 ngày không
kho nào cài» đang đếm từ 23/09 cho 2.18.2.

Số PR/ô ở kit lên 2–4 kể từ khi tách Cổng Đáng thành PR riêng (27/09): `mot-so-ba-ve` 4 PR ·
24 h; `cham-khong-tu-dot-luot` 3 PR · 60 h — trong khi ô ký trong 1–3 h.

### 2d. Đường chấm TUẦN TỰ — mắt người thấy, thước kit không thấy

Owner gửi ảnh (crm, máy khác, 02/10): «Round-4 sequential verifier — 1 h 03 m · Opus · 226 k token ·
55 lượt công cụ», bên dưới một lệnh nền «E14 … 2.4 h». Transcript không ở máy này; mẫu cùng
hình dạng ở máy này: phiên crm 30/09, ô `gioi-han-tep-dom`, agent «S4 sequential verify»
15 phút · 32 lệnh Bash, trong đó 10 phút là CHỜ (E4 bộ DOM thật 2,2 phút + «full test suite»
7,4 phút); phần còn lại là đọc hợp đồng, chạy từng eval, ghi run-log, chạy lint/build không
cache, gom trích đoạn.

Đường này là lối thoát hiểm của kit, hai cửa vào: (a) phiên không có công cụ Workflow (tác
nhân con, phiên điều phối — owner quyết 25/09 tách S4 ra phiên riêng); (b) lượt bị chặn vì bộ
phân loại → lượt kế «đổi đường, không tung bầy lại» (CLASSIFIER-FALLBACK). «Round-4» khớp (b):
ba lượt chết, lượt bốn đi tuần tự. Một agent làm thay 20–85 agent song song, nên mọi lệnh
suite (`suite_keys` crm: 4 bộ test + lint `--force` + build `--force`) xếp hàng nối đuôi.

Độ phổ biến ở crm (ô có lượt chấm mà KHÔNG có `usage-report` S4 — tức không đi Workflow):
W36 11/13 · W37 14/17 · W38 6/6 · **W39 27/61 · W40 12/31**. Ô ≥4 lượt: W39 9 · W40 7.
Lượt Workflow ở crm: p50 14 phút · p90 29 · max 62 (n = 112). **Lượt tuần tự không có số nào
trong năm dòng của luật (c)** — `wf-usage` chỉ đọc transcript Workflow — nên chi phí máy ở
đường này chỉ hiện trên màn hình owner, không vào hồ sơ mốc.

### 2e. Làn ghim lại — chạy theo PR chứ không theo mốc, và chạy nối đuôi

Đếm dòng `kind: repin` trong `run-log.jsonl` (crm `origin/onehub`, kit `main`):

| | crm (từ 04/09) | kit (từ 05/08) |
|---|---|---|
| làn ghim | 186 | 123 |
| hồ sơ-lượt ghim | 301 (112 hồ sơ; một hồ sơ ghim 12 lần) | 537 |
| eval máy chạy trong làn ghim | 3 748 | 2 930 |
| so với eval chạy ở S4 | 9 544 → làn ghim = **28 %** tổng lần chạy eval | 5 292 → 36 % |
| làn chạy LẠI cùng tập hồ sơ trong ≤60 phút | 22 / 186 | – |

crm theo ngày (24–26/09): 22 · 18 · 20 làn/ngày, 600+ hồ sơ-lượt/ngày. Script
`repin-lane.mjs` chạy mọi lệnh **nối đuôi** (`spawnSync` trong vòng lặp; chỉ gộp lệnh trùng
nguyên văn), mỗi làn = toàn bộ `suite_keys` (crm: 4 bộ test ≈ 200 s/bộ p50, từ 02/10 thêm lint
và build `--force`) + mọi eval test/script của từng hồ sơ. Sàn một làn crm ≈ 13–15 phút chưa
tính eval; 22 làn/ngày ⇒ ≥ 5 giờ máy/ngày chỉ để ghim. Làn không ghi thời lượng (một `ts`
cho cả làn) nên dòng 5 của luật (c) không thấy nó; kit đo tay hai chiến dịch: 2.18.0 ≈ 163
phút, 2.18.1 ≈ 59 phút.

Vì sao chạy nhiều: luật của kit nói «ghim lại MỘT chiến dịch mỗi phát hành» (GUIDE §7.1,
charter 07/08), nhưng RĂNG của lưới trước-merge nói khác — `evidence is stale — code changed
after verify` chặn mọi PR chạm `paths` của một hồ sơ đã ký. Ở kho 100+ PR/tuần chạm tệp dùng
chung, hồ sơ hoá cũ liên tục và mỗi PR kéo theo một làn (PR crm «ghim lại thước … sau các PR
gộp» 6,9 h). Cờ `--skip-unchanged` có trong script nhưng loại trừ với `--write`, nên không
cắt được làn thật.

## 3. Kết luận một câu

Chi phí owner cảm thấy là **số lần phải ngồi ký nhân với số vòng**, cộng **thời gian máy đổ vào
sửa thước**; thời gian mỗi task đang giảm. Phanh có sẵn mà bị bỏ qua ở bước cuối: 21/32 ô trạm thu phí
của crm hai tuần qua xanh-sạch đủ sáu điều kiện làn V nhưng vẫn mời người ký.

## 4. Giới hạn của phép đo

- W40 mới 4 ngày. Phân loại THƯỚC/VẬT bằng từ vựng. Lượt chạy eval sau ký (ghim lại) đã loại
  bằng mốc ký + 1 h.
- «Mở ô» = commit đầu chạm thư mục ô; ô mở qua hạt giống rồi ngủ lâu sẽ dài hơn thật.
- Chưa đo giờ người thật ngồi đọc thẻ — chỉ đếm chữ ký; chưa đo thời gian lượt-ký bị chờ qua đêm.
