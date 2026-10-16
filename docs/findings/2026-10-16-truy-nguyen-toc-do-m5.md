# Truy nguyên tốc độ vòng — máy M5, 14–16/10/2026

Ngày 16/10/2026. Đề bài dùng chung cho nhiều máy và nhiều kho:
[`docs/plans/2026-10-16-de-bai-truy-nguyen-toc-do-vong.md`](../plans/2026-10-16-de-bai-truy-nguyen-toc-do-vong.md).
Chủ kho thấy các vòng crm chậm, nên giao việc đo xem vì sao, rồi đề xuất cách tăng tốc mà vẫn giữ kim chỉ
nam. Đây là **sổ đo**, không phải ô. Toàn bộ việc là **chỉ đọc**: không sửa kho nào, không đổi luật nào.

```
MAY:             M5
CUA_SO:          2026-10-14T00:00Z .. 2026-10-16T00:00Z
KHO:             crm-onehub (nhánh chính onehub) · oneflow (main) · acceptance-gate-kit (main)
KENH:            crm-onehub#375 · acceptance-gate-kit#308
PHIEN_DIEU_PHOI: Điều phối M5
```

## Kết luận một đoạn

Các vòng crm **không chậm ở chỗ làm**. Từ lúc mở vòng tới lúc ký Cổng Bằng chứng mất 2,7–18 giờ, và máy chỉ
thật sự làm khoảng một phần mười thời gian đó. Thời gian dồn vào hai chỗ, đều nằm ngoài thước của kit:

1. **Đã ký mà chưa tới onehub.** Lúc đóng cửa sổ có 6 vòng đã ký nhưng chưa gộp, cộng lại **≈114 giờ-vòng**.
   Nguyên nhân là hàng gộp của M5 xếp sau một PR nâng kit đứng yên ≈31 giờ, và gộp nối đuôi.
2. **Chờ những thứ không cần chờ.** Ba vòng đợi «engine khớp 2.30» 19,8 giờ, trong khi bộ chấm S4 của hai bản
   giống nhau từng byte. Mỗi lần push mất thêm ≈15′ vì pre-push chạy lại đúng các lệnh CI đã chạy. Trên M5, tất cả
   những việc đó cùng giành **một** khoá máy nặng.

**Lượt gọi người** là thước số 1, và ở thước này crm đang vượt trần: trung bình **4,2 lượt/vòng** (25 lượt trong
thiết kế, 13 lượt ngoài thiết kế, trên 9 vòng). Nguồn lượt ngoài thiết kế lớn nhất là **«đỏ sẵn» trên onehub**:
hồ sơ đã ký mục dần mà không ai chạy lại eval của chúng, tới khi một vòng khác chạm vào thì đỏ. Ngày 16/10, **240 trên 248 hồ sơ đã ký** ở onehub đang hoá cũ. Riêng một ca như
thế sinh ra dừng-vá, một lựa chọn A/B/C và cả một vòng vệ sinh.

Kênh ba máy **không** phải nút cổ chai (trung vị trả lời 1 phút). Tin liên phiên cũng không (trung vị 0,1′).

**Khuyến nghị**, đã qua đối kháng:
1. Làm trước phần TRỪ, giá ≈2 h (§7.1). Lõi của nó: «vòng ký trên engine nó bắt đầu», tức áp lại một bất biến kit
   đã có.
2. Xin owner một chạm cho hai luật crm và một làn đêm ghim lại hồ sơ cũ theo paths trên đỉnh onehub (§5 PC). Đây là
   phương án bớt lượt gọi người nhiều nhất, ≈ −0,5 lượt/vòng.
3. Không thêm khoá nặng thứ hai và không gộp lô lúc này.

Về chạm: hạt giống «duyệt, giữ cỡ trong một lượt gõ» (đã có) là nghiệm duy nhất cho việc phạm trần ≤1 chạm/lượt.

## 1. Số nền — 9 vòng crm của M5

Nguồn số liệu:
- giờ: `git log` của từng worktree `crm-onehub/.claude/worktrees/*`;
- S4: `usage-report.md` (dòng `wall:`);
- ghim lại: các dòng `kind: repin*` trong `run-log.jsonl`;
- lượt gọi người: `decisions.jsonl` đối chiếu transcript phiên thợ.

Giờ là UTC. Chỗ nào nhật ký điều phối ghi giờ «~» lệch với commit (lệch tới +1,5 h), tôi lấy giờ commit.

| Vòng | Mở → ký Cổng Bằng chứng | Ký → gộp onehub | S4: lượt · phút | Ghim lại (phút) | Chờ người (phút) | Lượt gọi người (trong / ngoài) |
|---|---|---|---|---|---|---|
| DH1 | 2,7 h | chưa gộp, ≥18,9 h | 2 · 39 | 42 | 36 | 3 / 0 |
| DH2 | chưa ký (đường B lúc 21:21Z, sau 18,0 h) | — | 1 · 20 | **149 (cả hai lượt đỏ sẵn)** | **384** | 2 / 3 |
| DH3 | 5,3 h | chưa gộp, ≥15,3 h | 2 · 40 | 0 | 79 | 3 / 2 |
| DH4 (T3) | 6,1 h | chưa gộp, ≥15,5 h | 3 · 83 | 10 | 110 | 4 / 3 |
| DH5 | 10,2 h | chưa gộp, ≥9,8 h | 3 · 53 | 0 | 169 | 3 / 1 |
| DA3 (T3) | 18,3 h | chưa gộp, ≥23 h | 3 · 53 | 0 | ≥67 | 3 / 2 |
| DA2b | 17,3 h | **14,0 h** (#421) | 1 · 18 | 5 | **445** | 3 / 0 |
| gieoNguoi | 9,1 h | chưa gộp, ≥31,5 h | 1 · 18 | 0 | ≈88 | 2 / 1 |
| ve-sinh (VS) | đang mở | — | 0 | 0 | 89 | 2 / 1 |
| **Cộng** | | **≈114 giờ-vòng đã ký mà chưa gộp** | **16 · 322** | **206** | **≈1 467** | **25 / 13** |

Thêm vài số:
- **Token S4:** 763 nghìn token ra. Chia theo khối: chứng-minh-vật 40 %, tìm-lỗi 30 %, tổng hợp 30 %. Tính theo
  token đọc cache thì khối tìm-lỗi chiếm 77 %.
- **Toàn crm (cả ba máy):** 23 PR đã ký rồi gộp, thời gian ký→gộp trung vị **6,8 h**. Trong lúc chờ, onehub tiến
  trung vị 5 lần, và mỗi PR phải gộp lại trung vị 3 lần.

## 2. Một vòng điển hình — dòng thời gian

Hình: [`assets/2026-10-16-truy-nguyen-toc-do-m5/dong-thoi-gian-da2b.html`](assets/2026-10-16-truy-nguyen-toc-do-m5/dong-thoi-gian-da2b.html).

Vòng được vẽ là DA2b, vòng duy nhất của M5 đi hết đường tới onehub trong cửa sổ. Năm vòng ký còn lại có cùng
hình dạng, chỉ khác là thanh màu cam chưa kết thúc.

Cách đọc:
- **Thanh cam** (đã ký, chờ hàng gộp, 11,4 h) là gốc lớn nhất. Không thước nào của kit đo đoạn này, vì thước
  dừng ở lúc ký.
- **Thanh chấm** (chờ «engine khớp», 9,0 h) đứng ngay sau S3. S4 lẽ ra chạy được ngay lúc đó.
- **Hai thanh nét đứt** là chờ người. Thanh dài 6,5 h nằm trọn trong dải **đêm giờ VN**: người ngủ, máy không có
  cách nào làm nó ngắn lại.
- **Ba thanh xám đặc** là máy làm, cộng ≈3 h trên tổng 31,4 h. Thanh cuối (2,6 h) gồm 4 lần gộp lại, 4 lần push
  (55′ pre-push) và một lần CI đỏ vì luật kho mới vào qua lần gộp lại.

## 3. Bảng gốc nguyên nhân

Cột «Cạnh» chỉ cạnh nào của tứ diện Ý · Hạng mục · Thước · Vật bị gãy (khối ĐỊNH VỊ trong `CLAUDE.md`). Cột
«Phạm vi» ghi gốc này chung cho mọi kho, hay chỉ riêng một kho.

| Mã | Kho | Gốc | Số đo | Nguồn | Cạnh | Phạm vi |
|---|---|---|---|---|---|---|
| **H10 (mới)** | crm | Đã ký mà chưa gộp: hàng gộp xếp sau PR nâng kit #413 và gộp nối đuôi. | 6 vòng ký chưa gộp ≈114 giờ-vòng. M5 đứng sau #413 từ ~14/10 16:00Z tới 15/10 23:43Z (≈31 h). #413 mở 14/10 13:45Z, vẫn CONFLICTING. 23 PR toàn crm: ký→gộp trung vị 6,8 h. Lượt gọi người: 0. | nhật ký điều phối 14/10 16:00Z, 15/10 23:43Z; `gh pr view 413`; mục 3 của tác tử đo PR | Ý↔Vật: reality không đọc được thứ chưa ship | crm (hai kho kia gộp ngay, ký→gộp <3 h) |
| **H11 (mới)** | crm, M5 | Chờ «engine khớp» chặn cả S4, dù bộ chấm không đổi. | DA2b 9,0 h + gieo 4,5 + DA3 6,3 = **19,8 giờ-vòng**. Bản cài `feature-loop` 2.28 và 2.30 chỉ khác `plugin.json`, `duong-nen.mjs`, `SKILL.md`; `acceptance-verify.js` và `s4-args.mjs` cùng sha. Thứ thật sự khác là thẻ cổng, `pre-merge-check.sh` và `co-hop-dong.cjs`. | `diff -rq` hai bộ đệm; nhật ký 14/10 07:14Z, 16:25Z | Thước↔Vật: chặn vì «không đọc được ở đây» mà thật ra đọc được | chung mọi kho có ghim engine theo bản |
| H1 | crm, M5 | Một khoá máy nặng cho S4, ghim lại, đường nền, phiên đo **và push**. | Chờ khoá ngày 15/10: DH5 462′, DH3 139′, DH4 86′, DH1 22′, DH2 18′ (≈12,1 h). Ngày 14/10: gieo ≈228′, DA3 42′. Khoá **trống** trong khi có người chờ: 44′ + 36′. Chồng khoá ≥7 lần (12–28′), 0 hỏng nào quy được cho việc chồng. | transcript thợ (`allheavy.py`); nhật ký 15/10 07:08Z | — (hàng đợi, không cạnh nào gãy) | kit: bận 19,5/48 h (17 S4 + 11 ghim lại = 1 270′); oneflow không gặp |
| H2 | crm | Pre-push chạy lại trọn suite đã chạy ở CI. | Hook có `TURBO_FORCE=true` rồi chạy check-types→lint→lint:slop→**test**→**build**, trùng 5/5 lệnh nặng của CI và không phân loại T1. DA2b: 4 push = 55′ (`test` 14′50″–15′57″). Push nhánh chỉ có tài liệu của điều phối: 3 × 15′ = 45′. Push chiếm khoá nặng. CI chạy các job song song trong 14,4′. | `origin/onehub:.githooks/pre-push`; log push DA2b; `gh run list` | Thước↔Vật (thước đôi, không thêm chiều đỏ nào) | riêng crm; kit và oneflow chỉ quét bí mật |
| H3 | crm | «Đỏ sẵn»: hồ sơ đã ký mục dần trên onehub. | DH2: 2 lượt ghim lại đỏ, 149′ máy (7/9 rồi 4/4 eval đỏ sẵn) → dừng-vá chờ 5,3 h → sinh vòng VS (≥2,3 h, 3 lượt gọi người). Tính lượt ngoài thiết kế: DH2 3 + VS 1. `ghd_soi_xem` đỏ 8 trên onehub (0 lộ thật, thước lệch sau 4 PR). Bom ngày 15 chặn mọi suite app 17:00Z→22:48Z ngày 14/10 (5,8 h, cả ba máy). 17 tin «đỏ sẵn» trên #375. CI theo PR **không chạy lại eval hồ sơ**; 0/31 lần gộp onehub có test trên đỉnh onehub. **Cũ hoá nền:** quét pre-merge toàn phần (không `--base`) trên onehub thuần `f59e83cd3` ngày 16/10 ~01:00Z cho **240 hồ sơ đã ký đang hoá cũ**, trên **248** hồ sơ `signed-off` ở commit đó (≈97 %). `pre-merge --base` chỉ bắt hồ sơ mà PR chạm, nên lượng cũ hoá này vô hình tới khi một vòng đụng vào, rồi trả giá thay cho cả nhánh. | `repin-20261015T113052Z-32767`, `repin-20261015T144806Z-77303`; `ci.yml` / `acceptance.yml` ở `origin/onehub`; nhật ký 15/10 14:00Z–17:30Z; số 240 do thợ gieoNguoi quét và Điều phối M5 chuyển lại (tôi chưa chạy lại; số 248 đếm `status: signed-off` bằng `git show f59e83cd3:_acceptance/*/contract.md`) | Thước↔Vật (thước lệch trôi theo vật của người khác) + Hạng mục↔Thước | crm; kit có trên máy cục bộ (5/6 đường nền «DO SAN», 1/3 ghim lại đỏ do CHANGELOG) nhưng CI nhánh chính xanh 16/16; oneflow tiềm ẩn |
| H3b | kit | Kit không có lối khai «đỏ sẵn trên nền»: luật hai vế cấm `not-run` trên eval đã ký còn mã thoát. | Lối A của DH2 (máy khuyên, chủ kho chọn) bị `repin-lane` chặn, thoát mã 2 → 1 chạm + 1 vòng tách ra. | nhật ký 15/10 14:25Z | Thước↔Vật | chung — mọi kho có hồ sơ đã ký |
| H4 | crm, kit | Gộp nối đuôi: mỗi lần nhánh chính tiến, PR đang chờ phải gộp lại và ghim lại. | crm: 113 commit gộp lại, 87 commit ghim, mỗi PR đã ký gộp lại trung vị 3 lần. Các lần va chạm thật: DH1 thiếu mock sau #419, DH4 vướng luật `lkx-quet` mới, DA2b vướng luật `khong-chu-thich` mới. Kit: 2 lượt CI đỏ vì bằng chứng cũ của hồ sơ khác (#349, #359), +95′ ghim lại. | tác tử đo PR §3; kit run-log | Thước↔Vật | chung cho kho có nhiều hồ sơ cùng chạm paths |
| H5 | crm | Giờ chờ người và chạm thừa. | Chờ người 24,5 h, nhưng 24/31 lần chờ dưới 1 h; hai ca lớn là đêm VN (DA2b 6,5 h, DH2 5,3 h). Chạm thừa (không tính vào 13 lượt ngoài thiết kế): chốt cỡ ở 4 vòng, mỗi vòng 4 lần gõ cho một quyết định, phạm trần ≤1 chạm/lượt. Ngoài thiết kế: cross-layer bị pre-merge chặn **sau** ký 2 lần (DH4 AC-12, DH5 AC-11), quyết định nói ở phiên điều phối phải gõ lại ≈6 lần (VS Cổng Đáng 5 lần gõ). | transcript (`h5.py`); `decisions.jsonl` | Ý↔Hạng mục (chốt cỡ), Hạng mục↔Thước (nhãn cross-layer) | chốt cỡ và cross-layer là chung (luật kit); gõ lại là nếp riêng của M5 |
| H6 | crm | Eval «giữ hồ sơ» chạy lại hàng chục eval đã ký. | DH4 E14: 92 lệnh, BLOCKED ở 30′13″ → thu phạm vi, thêm 1 lượt ký lại. DH5 E13: 53 lệnh ≈60′, khai `not-run`. Lỗi lộ mục tiêu ẩn của DH5 vẫn bị bắt ở suite r1 và đọc tay, nên chiều đỏ không mất nhưng chỉ còn một đường. | `evals.yaml`, `usage-report.md` | Thước↔Vật | riêng kho nhiều hồ sơ chồng vùng |
| H7 | M5 | Tin liên phiên xếp hàng tới khi lượt của thợ kết thúc. | 183 tin, trung vị 0,1′, max 22,7′. 4 ca thợ chạy khoá nặng trước khi tin cấp tới (chồng 12′, không hỏng). | transcript (`h7.py`) | — | nhỏ — **bác** như gốc chậm |
| H8 | ba máy | Kênh #375 / #308. | Trả lời trung vị 1,0′ (n=44). Đọc trọn #375 ≈88 nghìn token, tăng 22–27 nghìn/ngày. Thứ tự lô đổi ~25 lần trong 2 ngày. Một lượt gọi bị bỏ sót 240′ (#420, lỗi bộ canh). #308 có cặp hỏi–đáp 212′ và 369′. | `gh api --paginate` 372 + 145 bình luận | — | bác về độ trễ; ủng hộ về token và xáo trộn |
| H12 (mới) | crm | CI app-ui chập chờn. | 13/16 lượt CI đỏ nằm ở `test (app-ui)`, 7/13 xanh khi chạy lại cùng sha (timeout 5 s dưới tải). Mỗi lần chạy lại ≈13′. | `gh run list` 204 run | Thước↔Vật (thước tự đỏ) | riêng crm |

### H9 — vì sao ba kho khác nhau

- **oneflow gần như không gặp lớp nào.** CI 1,8′ (6 job song song), không có pre-push nặng, 41 hồ sơ, ghim lại
  rỗng nhờ `t1_skip_globs`, trong cửa sổ không có lượt S4 nào. Chờ người duy nhất: 79′ ở một Cổng Đáng.
- **kit gặp H1, H4, H6 rất nặng nhưng không gặp H2.** Có 161 hồ sơ ký, và eval của chúng nằm ngay trong mã nguồn
  bị sửa, nên một lần gộp làm cũ bằng chứng của hồ sơ khác. Mỗi lượt ghim lại 33–84′ (trung vị 56′). CI 37′ không
  lọc path, nên 11 lượt CI cho PR chỉ có tài liệu đốt ≈6,8 h.
- **crm gặp đủ cả.** Hồ sơ nhiều, nhiều vòng song song chạm cùng vùng, ba máy cùng gộp vào một nhánh, và pre-push
  chạy trọn suite.

Hệ quả cho cách chọn nghiệm: H10, H11, H2, H12 chữa **tại crm và luật giữa các máy**. H3b và H11 chạm **kit**,
nên phải cân trên mọi kho. oneflow không mất gì nếu lối mới là tuỳ chọn có đường đọc-cũ.

## 4. Kiểm từng giả thuyết — phán quyết

| Mã | Phán quyết | Một dòng |
|---|---|---|
| H1 | **Đúng một phần** | Chờ khoá ≈12 h/ngày là thật. Nhưng khoá bị lấp bởi những việc thừa: push 15′, ghim lại đỏ sẵn 149′, E14 BLOCKED 30′, lượt chờ engine. 7 lần chồng khoá không gây hỏng nào, nhưng mẫu còn nhỏ. |
| H2 | **Đúng** | Pre-push trùng 5/5 lệnh nặng của CI, không dùng cache, không phân loại T1. |
| H3 | **Đúng, và đắt nhất về lượt gọi người** | Về giờ thì nó không lớn nhất (H10, H11 lớn hơn), nhưng mỗi ca đẻ dừng-vá, lựa chọn, và có khi cả một vòng. |
| H4 | **Đúng một phần** | Mỗi PR đã ký gộp lại trung vị 3 lần. Không phải «mọi vòng chờ» đều gộp lại sau mỗi lần nhánh chính tiến (33 % trong 3 h). |
| H5 | **Đúng ở chạm thừa, sai ở «1–6 h/cổng»** | 24/31 lần chờ dưới 1 h. Ca dài là ca qua đêm. |
| H6 | **Đúng** | Hai vòng vượt hoặc gần trần 30′. Cắt E13 không làm lọt lỗi, nhưng làm chiều đỏ chỉ còn một đường. |
| H7 | **Bác** | Trung vị 0,1′. |
| H8 | **Bác về độ trễ**, ủng hộ về token | Trung vị 1′. Giá đọc 88 nghìn token cho một lần đọc trọn. |
| H10 | **Mới — lớn nhất về giờ** | ≈114 giờ-vòng đã ký mà chưa tới onehub. |
| H11 | **Mới — lớn thứ hai** | 19,8 giờ-vòng chờ một engine mà bộ chấm S4 không đổi. |
| H12 | **Mới — phụ** | app-ui chập chờn làm mỗi lần chạy lại tốn ≈13′. |

## 5. Bốn phương án

Thước ghi trên mỗi vòng, so với nền ở §1: 4,2 lượt gọi người/vòng; ký→gộp toàn crm trung vị 6,8 h; ≈1 giờ máy
S4 + ghim lại/vòng.

### PA — «Gỡ chờ không cần» (TRỪ)

1. **Không đổi engine dưới chân một vòng.** Bất biến này đã có sẵn trong `CLAUDE.md`. Vòng bắt đầu trên 2.28 thì
   chấm và ký trên 2.28, không đứng chờ «engine khớp 2.30». Bản 2.30 phải đọc được hồ sơ ký bằng 2.28, qua
   đường đọc-cũ và cờ vàng. Kèm một việc kiểm: DP11 (`lib/out-of-contract.cjs` đổi 105 dòng từ 2.28 tới 2.30) có
   giữ đường đọc-cũ không. Ca crm zalo-qua-webhook phải định tuyến lại cho thấy có thể là không; nếu đúng là
   không thì đó là lỗi kit. *Tầng:* nếp điều phối, cộng một việc kiểm kit. *Ai duyệt:* máy tự đi.
   *(Bản nháp ban đầu đề xuất «so sha bộ chấm»; phản biện chỉ ra rằng thẻ và sổ định tuyến vẫn đổi, nên cách đó
   chỉ cứu được 20–40′ mỗi vòng.)*
2. **Cấp khoá kế ngay khi khoá trước nhả**, không để khoá trống. Bộ phát lịch của gói dieu-phoi đã có khoá s4 cấp
   máy; M5 đang cấp tay. Khoá trống đo được 80′/ngày, tức ≈9′/vòng. *Ai duyệt:* máy.
3. **Điều phối không chuyển lời quyết định cổng.** Gửi cho chủ kho đường dẫn phiên thợ kèm dòng lệnh in sẵn.
   *Ai duyệt:* máy (bài học 15/10 14:10Z, viết thành nếp).
4. **Chạy luật cross-layer của pre-merge (một nguồn) ngay sau S2**, khi evals đã sinh và trước lời mời Cổng Phạm
   vi. Mục vướng hiện thành cờ vàng trên thẻ, để nhãn được gỡ trong chính lượt gọi sẵn có. Kit không đổi mặc định:
   W4 của `eval-coverage-lint.js` vẫn là cảnh báo, vì biến nó thành chặn thì oneflow và kit cũng phải trả giá.
   *Ai duyệt:* máy (nếp thợ).
5. **Pre-push crm nhanh cho push chỉ chạm tệp T1.** Dùng lại `tepT1` của `phan-loai.mjs`: push chỉ chạm tệp T1 thì
   bỏ `test` và `build`; push có mã vẫn giữ nguyên. Không bỏ hẳn `test`, vì `verify-gate-shape.mjs` đòi checker
   `test`, và hồ sơ đã ký `nen-chat-ai-elements` (AC-9/AC-10) neo vào việc pre-push đi qua cổng — bỏ là hồ sơ hoá
   cũ, tức thêm một lượt gọi người. PR nháp cũng không có test ở CI. *Tầng:* luật kho crm. *Ai duyệt:* **owner**.
6. **PR nâng kit có hạn giữ đầu hàng gộp** (đề xuất 2 h). Quá hạn thì nó xuống sau các PR đã ký và đã xanh trên
   đỉnh — nối dài luật «ai xanh trên đỉnh trước thì đi trước» mà Mac Studio đặt ngày 15/10. *Tầng:* luật ba máy.
   *Ai duyệt:* **owner**.

| Thước | Ước trên mỗi vòng | Giả định |
|---|---|---|
| Lượt gọi người | **−0,2** (cross-layer); −0,7 chạm (gõ lại) | 2 ca cross-layer và ≈6 lần gõ trên 9 vòng |
| Làm-xong → quyết-được | ≈0 | người vẫn ký theo giờ thức |
| Ký → gộp | **≈ −31 h một lần** khi có PR nâng kit đứng | lần này ≈31 h; kit phát hành 4 bản trong 12–15/10 |
| S3 → S4 | tới **−6,6 h/vòng** khi có nâng engine | 19,8 giờ-vòng / 3 vòng; cận dưới 20–40′ nếu đường đọc-cũ của DP11 hỏng |
| Giờ máy | −45′ push tài liệu, −9′ khoá trống | push mã giữ nguyên |

- **Giá dựng:** ≈1 h máy (một nhánh T1 trong hook, hai dòng luật) và ≈1 h kiểm đường đọc-cũ của DP11.
- **Rủi ro tự dối:** thấp. Push có mã vẫn chạy test ở pre-push. Push chỉ có tệp T1 thì CI cũng bỏ test, nên
  không mất chiều đỏ nào. Mục 1 dựa vào đường đọc-cũ: nếu 2.30 đọc sai hồ sơ ký bằng 2.28 thì thẻ có thể xanh giả
  — vì thế đi kèm việc kiểm DP11.
- **Phản biện về giờ đêm:** giờ máy tiết kiệm chỉ thành giờ quyết khi nó kéo lời mời cổng về **trước** giờ ngủ
  VN (≈16:00Z). Ngược lại, 30′ cắt đúng chỗ có thể cứu trọn một đêm.
- **Đường đảo:** khôi phục một dòng hook; xoá dòng luật.
- **Kho không gặp sự cố:** oneflow và kit không có pre-push nặng, nên không đổi gì. Các mục 1–4 là nếp của điều
  phối, không chạm kit.

### PB — «Hai khoá nặng mỗi máy» (CỘNG)

Cho M5 chạy hai S4 hoặc ghim lại song song, với DB, cổng và kho đo cô lập theo worktree, và đột biến luôn ở
worktree tạm.

- **Ước:** chờ khoá −2 tới −2,4 h/vòng trên lý thuyết. Lượt gọi người: 0, hoặc **tăng** nếu tải gây đỏ giả.
- **Giá dựng:** 3–5 h máy (cô lập DB và cổng; sửa các ca dùng kho cố định như E22 `crm_tdx_e22_do`).
- **Rủi ro tự dối: cao.** app-ui đã chập chờn vì timeout 5 s **dưới tải** (H12). gieoNguoi trùng khoá khi gọi
  song song. DH1 r1 REJECT oan vì đột biến tại chỗ lọt sang lượt chạy song song. Đỏ giả thì đẻ dừng-vá, tức thêm
  lượt gọi người.
- **Đường đảo:** đặt lại khoá về 1.
- **Ai duyệt:** owner (CỘNG luật máy).
- **Sau đối kháng: BÁC lúc này** (§6.1).

### PC — «Nền onehub có chủ» (CỘNG crm, kèm hạt giống kit)

1. **Làn đêm ghim lại**: mỗi đêm, trên đỉnh onehub, ghim lại các hồ sơ đã ký bị cũ theo paths bởi các lần gộp
   trong ngày. Dùng công cụ kit đã có: `repin-lane.mjs --stale-all --base <đỉnh hôm qua>`. Đỏ thì mở hàng vệ sinh
   đứng tên PR gây ra (lần theo các merge của ngày). Chạy trên một máy theo phiên, ngoài giờ đông khoá.
2. **Eval «giữ hồ sơ» chạy theo paths và song song, không cắt.** Dùng các thứ kit đã có: `--skip-unchanged` với
   `stale_scope: paths`, và chạy song song (`repin_parallel_suites`). DH3 chạy E13 68 lệnh trên 4 luồng vẫn PASS;
   DH4 E14 chết ở trần 30′ vì chạy tuần tự. Thợ ghi lệnh ấy ngay trong `evals.yaml` của vòng mình.
   *(Bản nháp ban đầu đề xuất bỏ hẳn eval giữ hồ sơ; phản biện chỉ ra rằng như thế đẩy việc phát hiện hồi quy ra
   SAU chữ ký, phải ký lại tức thêm một lượt gọi người, và mất chiều đỏ trước khi ký.)*
3. **Hạt giống kit:** lối khai «đỏ sẵn trên nền» khi ghim lại. Đây là **nhãn trạng thái** lên thẻ, KHÔNG phải
   PASS. Điều kiện: cùng ca, cùng thông điệp đỏ, đã ghim trên merge-base kèm `run_id` của nền. HEAD có thêm bất kỳ
   ca đỏ nào thì vẫn đỏ — thiếu điều kiện này, một PR làm hỏng đúng eval ấy sẽ lọt. Lối có đường đọc-cũ và mặc
   định tắt.
4. *(Tuỳ, chưa khuyên):* CI chạy test trên đỉnh onehub sau mỗi lần gộp. Giá ≈650 phút-job/ngày ≈ $3,9/ngày ở kho
   riêng tư. Trong cửa sổ này nó không bắt được ca đỏ sẵn nào: các ca đỏ đều là eval hồ sơ, còn bom ngày 15 thì
   phụ thuộc giờ.

| Thước | Ước | Giả định |
|---|---|---|
| Lượt gọi người | **≈ −0,5/vòng** (−4…−5 trên 9 vòng) | hai ca trong 2 ngày: DH2 + VS ≈4 lượt; DH4 E14 dừng-vá ≈1 |
| Làm-xong → quyết-được | −5 tới −10 h ở vòng bị đỏ sẵn | DH2: 4,6 h máy đuổi đỏ + 5,3 h chờ |
| Giờ máy | −2,5 h ghim lại đỏ/ca, **+1–3 h/đêm** cho làn đêm | 8–9 hồ sơ ≈75′ |

- **Giá dựng:** 3–5 h máy (script chọn hồ sơ cũ, phần quy về PR gây ra, lịch chạy). Hạt giống kit: 0 lúc này.
- **Rủi ro tự dối:** chiều đỏ **tăng**, vì có thêm một đường đỏ hằng ngày. Rủi ro là quy nhầm PR gây ra, làm người
  phải chọn. Đỡ bằng cách ghi kèm cặp sha trước/sau.
- **Đường đảo:** tắt lịch.
- **Ai duyệt:** owner (CỘNG quy trình crm). Phần kit chỉ là hạt giống (luật chiều rộng).
- **Kho không gặp sự cố:** oneflow không cần làn đêm, vì ghim lại đã rỗng. Kit tự hưởng nếu dùng, vì có ghim lại
  đỏ do CHANGELOG. Hạt giống mặc định tắt nên không kho nào trả giá.

### PD — «Gộp lô sau ký» (luật ba máy)

Gom các PR đã ký, đã xanh, không chồng paths vào một lô: một lần gộp onehub, một lượt ghim lại, một CI trên đỉnh
lô, và gộp ngay sau ký thay vì chờ cửa sổ giờ chẵn.

- **Ước:** lượt gọi người 0. Gộp lại sau ký 3 → 1 mỗi PR (−2 × 20–60′ máy). Ký→gộp −1 tới −3 h.
- **Giá dựng:** 2–4 h. Merge queue của GitHub chưa xác minh là dùng được cho kho riêng tư của tài khoản cá nhân,
  nên làm tay theo lô.
- **Rủi ro tự dối:** đỉnh lô chưa ai chạy test nếu bỏ CI giữa các PR trong lô. Cần mục 4 của PC hoặc một CI trên
  đỉnh lô. Lô đỏ thì phải chia đôi để tìm PR gây ra.
- **Đường đảo:** về nối đuôi.
- **Ai duyệt:** owner. Luật này cũng đè lên nếp xếp lô của Mac Studio, vì thứ tự lô đã đổi ~25 lần trong 2 ngày.
- **Sau đối kháng: BÁC lúc này**, chỉ ghi lại (§6.1).

## 6. Chấm điểm và đối kháng

Thứ tự thước: lượt gọi người → làm-xong→quyết-được (kèm ký→gộp) → giờ máy.

| PA | Lượt gọi người | Thời gian | Giờ máy | Giá dựng | Chiều đỏ | Hạng |
|---|---|---|---|---|---|---|
| PC | **≈ −0,5** | −5…−10 h ở vòng dính đỏ sẵn | +1…3 h/đêm, −2,5 h/ca | 3–5 h | **tăng** | **1** |
| PA | −0,2 (+ −0,7 chạm) | tới −6,6 h/vòng khi nâng engine; −31 h một lần khi PR nâng kit đứng | −0,1…−0,8 h | ≈2 h | giữ | **2**, nhưng áp TRƯỚC vì rẻ |
| PD | 0 | −1…−3 h | ≈ −34 h máy trên 23 PR (gộp lại 3 → 1) | 2–4 h | cần PC | 3 |
| PB | 0 hoặc tăng | −2,4 h lý thuyết, chưa trừ giờ đêm | 0 | 3–5 h | **giảm** | 4 |

### 6.1 Đối kháng — phán quyết

Một tác tử phản biện đã đọc lại `origin/onehub` của crm (`.githooks/`, `gate-shape.json`, `phan-loai.mjs`,
`ci.yml`) cùng `scripts/`, `lib/`, `feature-loop/` của kit, rồi thử phá từng mục.

| Mục | Kịch bản phá mạnh nhất | Phán quyết | Đã sửa ở |
|---|---|---|---|
| PA1 | Thẻ và sổ định tuyến vẫn dựng bằng 2.30 (DP11 đổi bên đọc), nên «so sha bộ chấm» chỉ cứu được 20–40′. | GIỮ-CÓ-SỬA → «không đổi engine giữa vòng» + kiểm DP11 đọc-cũ | §5 PA1 |
| PA2 | Khoá trống chỉ ≈9′/vòng; nhả khoá sớm không làm người ký sớm hơn. | GIỮ (rẻ, do máy) | — |
| PA3 | 0 lượt gọi; chỉ bớt chạm. | GIỮ | — |
| PA4 | «Ở S1» sai chỗ, vì evals sinh ở S2. Biến W4 thành chặn ở tầng kit là đổi mặc định, mọi kho trả giá. | GIỮ-CÓ-SỬA → sau S2, cờ vàng trên thẻ | §5 PA4 |
| PA5 | `verify-gate-shape` đòi checker `test`; hồ sơ đã ký `nen-chat-ai-elements` neo vào pre-push; PR nháp không có test ở CI → bỏ test là xanh giả. | GIỮ-CÓ-SỬA → chỉ nhánh T1 | §5 PA5 |
| PA6 | PR nâng kit bị tụt hàng thì xung đột ngày càng sâu. | GIỮ (owner quyết); với PA1-sửa thì vòng không còn cần đợi nó | — |
| PB | Có tiền lệ đỏ oan khi chạy song song (DH1); timeout dưới tải; chưa trừ phần PA2 và PA5 gỡ được. | **BÁC** tới khi đo lại sau PA | §7 |
| PC1, PC3 | «Đỏ sẵn» mà thành PASS thì PR làm hỏng đúng eval ấy sẽ lọt. | GIỮ-CÓ-SỬA → nhãn trạng thái, cùng ca, cùng thông điệp | §5 PC3 |
| PC (giữ hồ sơ) | Cắt eval đẩy hồi quy ra sau ký → ký lại. | GIỮ-CÓ-SỬA → lọc paths + song song, không cắt | §5 PC2 |
| PD | Một PR đỏ chặn cả lô; «gộp ngay sau ký» mâu thuẫn với «gom lô»; phụ thuộc PC. | **BÁC lúc này**, mở lại sau PA6 + PC | §7 |

Hai điểm phản biện nêu thêm, đã kiểm lại:

- **Chốt cỡ là lớp ngoài thiết kế không phương án nào chạm.** Kiểm lại thì chốt cỡ là **chạm**, không phải
  lượt: nó làm một lượt Cổng Phạm vi tốn 4 lần gõ, và không nằm trong 13 lượt ngoài thiết kế (tác tử đo hồ sơ đếm
  riêng). Như vậy nó phạm trần **≤1 chạm/lượt** ở 4/5 vòng DH. Nghiệm hiện tại («lời mời đầu in sẵn hai dòng»,
  15/10 08:00Z) là dặn-bằng-lời, chưa có răng. Cả bốn Cổng Phạm vi bị vấp đều diễn ra **trước** 08:00Z, nên nghiệm
  này chưa được thử. Nghiệm máy đã có hạt giống:
  [`docs/plans/2026-10-15-hat-giong-duyet-giu-co-mot-luot.md`](../plans/2026-10-15-hat-giong-duyet-giu-co-mot-luot.md)
  (TRỪ một chạm). Hạt giống này đứng đầu §7.3.
- **Giờ máy không cộng thẳng thành giờ chờ** (đã ghi ở PA).

## 7. Khuyến nghị

**Một đường:**
1. Làm phần TRỪ của PA ngay. Máy tự đi phần lớn, giá ≈2 h.
2. Owner duyệt hai luật crm (PA5, PA6) và làn đêm (PC1).
3. Dựng PC.
4. Sau 7 ngày, đo lại năm số ở §1: lượt gọi người/vòng, chạm/lượt, ký→gộp, chờ khoá, giờ ghim lại đỏ.

PB và PD bị **bác lúc này**:
- **PB** mở lại khi, sau PA và PC, chờ khoá nặng vẫn trên 2 h mỗi vòng mỗi ngày (đã trừ giờ đêm).
- **PD** mở lại khi PA6 và PC đã chạy mà ký→gộp vẫn có trung vị trên 6 h.

### 7.1 Máy tự đi ngay (TRỪ, không chạm luật người)

- **PA1:** vòng ký trên engine nó bắt đầu, không chờ «engine khớp». Máy kiểm đường đọc-cũ của DP11, hỏng thì ghi
  lỗi kit.
- **PA2:** cấp khoá kế liền khi khoá trước nhả.
- **PA3:** điều phối chỉ trỏ phiên thợ, không chuyển lời quyết định.
- **PA4:** chạy luật cross-layer sau S2, trước lời mời Cổng Phạm vi. Chép vào đề bài chip thợ, cạnh luật chốt cỡ ở
  lời mời đầu.
- **PC2:** thợ viết eval giữ hồ sơ theo paths và chạy song song (`--skip-unchanged`, `repin_parallel_suites`).
  Đây là việc trong `evals.yaml` của chính vòng; khoá chung của `config.yaml` thì vẫn theo luật ghi `cham-tep`
  trước.

### 7.2 Cần owner duyệt — lời mời một dòng

> **Duyệt ba thay đổi crm: (1) pre-push bỏ test + build khi push chỉ chạm tệp T1; (2) PR nâng kit giữ đầu hàng gộp
> tối đa 2 giờ; (3) mở làn đêm ghim lại hồ sơ đã ký bị cũ theo paths trên đỉnh onehub — gõ «duyệt», hoặc
> «bỏ <số>».**

Vì sao đây là câu hỏi thật cho người, không phải trạm thu phí:
- (1) Đổi luật kho và nếp an toàn cục bộ.
- (2) Đổi thứ tự ưu tiên giữa ba máy, trong đó có hàng của Mac Studio.
- (3) Thêm 1–3 giờ máy mỗi đêm trên một máy ba bên dùng chung.

Cả ba là đánh-đổi chỉ người có, và cả ba đảo được bằng một dòng.

### 7.3 Chỉ ghi hạt giống kit (luật chiều rộng: không dựng)

1. **Đã có — đứng đầu:**
   [`docs/plans/2026-10-15-hat-giong-duyet-giu-co-mot-luot.md`](../plans/2026-10-15-hat-giong-duyet-giu-co-mot-luot.md).
   Nó là TRỪ một chạm. Không nghiệm nào khác gỡ được việc phạm trần ≤1 chạm/lượt ở 4/5 vòng DH. Mở khi owner gọi
   tên vòng meta của cửa sổ.

Ba hạt giống mới dưới đây **chưa tạo tệp**, vì răng VC8 cũ trên `main` đòi mỗi hạt giống phải trỏ về một ô
(`CLAUDE.md`, giới hạn (ii)). Chúng được tạo khi owner gọi tên:

2. `2026-10-16-hat-giong-do-san-tren-nen.md` — lối khai «đỏ sẵn trên nền» khi ghim lại (PC3): là nhãn trạng thái,
   không phải PASS; cùng ca, cùng thông điệp trên merge-base. Cân trên mọi kho: kho không có đỏ sẵn không mất gì,
   vì lối mặc định tắt và có đường đọc-cũ.
3. `2026-10-16-hat-giong-ky-den-gop.md` — năm dòng số của luật (c) dừng ở lúc ký, trong khi gốc lớn nhất ở crm
  (H10) nằm **sau** chữ ký. Đề xuất một dòng «ký→gộp» ở hồ sơ mốc. Đây là CỘNG meta, ngưỡng mở: ≥2 kho đo
  ký→gộp trung vị >6 h.
4. `2026-10-16-hat-giong-ci-kit-loc-path.md` — riêng kit: `gate.yml` chạy 37′ cho PR chỉ có tài liệu (11 lượt
  ≈6,8 h trong cửa sổ).

## 8. Giới hạn đo

- Giờ «~» trong nhật ký điều phối lệch tới +1,5 h so với commit; tôi lấy giờ commit.
- `duong-nen.md` không ghi thời lượng. `run-log.jsonl` ghi chung một `ts` cho cả lượt, nên phút S4 lấy từ
  `usage-report.md`.
- Thời lượng pre-push chỉ có log đủ của một vòng (DA2b, 4 lần push) và ba lần push tài liệu. Con số
  «118 push × 15′» cho cả ba máy là ước, chưa đo.
- DH2 và VS chưa ký, nên số của hai vòng này là cận dưới. Cột ký→gộp cũng là cận dưới với 5 vòng còn chờ.
- Token đọc kênh là ước theo ≈3 ký tự/token, không phải số đếm thật.
- Trong lúc đo, một tác tử chạy `git fetch origin main` ở kho oneflow và kho kit. Lệnh này chỉ cập nhật ref theo
  dõi, không chạm cây làm việc.

## Nguồn và cách chạy lại

Mọi script đo nằm ở thư mục scratchpad của phiên này, không commit vì có dữ liệu crm thô: `dec.py`, `rl.py`,
`repin.py`, `usage.py`, `h5.py`, `h7.py`, `allheavy.py`, `an.py`, `an2.py`. Chạy lại theo «Nguồn số đo» của đề
bài chung, với tham số ở đầu tệp này.
