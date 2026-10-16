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
hồ sơ đã ký mục dần mà không ai chạy lại eval của chúng, tới khi một vòng khác chạm vào thì đỏ. Ngày 16/10, quét pre-merge toàn phần trên đỉnh onehub cho **242 vi phạm**, gần hết là hồ sơ đã ký bị hoá cũ; đối chiếu, onehub có 248 hồ sơ `signed-off`. Riêng một ca như
thế sinh ra dừng-vá, một lựa chọn A/B/C và cả một vòng vệ sinh.

Kênh ba máy **không** phải nút cổ chai (trung vị trả lời 1 phút). Tin liên phiên cũng không (trung vị 0,1′).

**Khuyến nghị**, đã qua đối kháng:
1. Làm trước phần TRỪ, giá ≈2 h (§7.1). Lõi của nó: «vòng ký trên engine nó bắt đầu», tức áp lại một bất biến kit
   đã có.
2. Xin owner một chạm cho hai luật crm và một làn đêm ghim lại hồ sơ cũ theo paths trên đỉnh onehub (§5 PC). Đây là
   phương án bớt lượt gọi người nhiều nhất, ≈ −0,5 lượt/vòng.
3. Không thêm khoá nặng thứ hai và không gộp lô lúc này.

Về chạm: hạt giống «duyệt, giữ cỡ trong một lượt gõ» (đã có) là nghiệm duy nhất cho việc phạm trần ≤1 chạm/lượt.

**Chỗ người chỉ là hình thức (§8):** 33/35 quyết định cổng trong hai ngày trùng đúng khuyến nghị máy, và không
ca nào khó-đảo. Cách đẩy người ra biên mà vòng không đứng chờ: chọn **chế độ cổng một lần cho mỗi đợt** — Đồng
hành · Biên · Tự lái. Phần cần đổi kit chỉ ghi hạt giống.

**Lỗ hổng (§9):** ở crm, gộp vào onehub **là** lên production. Bản Preview dùng chung DB với prod, và chiều đỏ của
việc bớt người đang chết (N = 7 đứng yên từ 22/09; onehub không có check bắt buộc). Vì thế phải **tin được trước,
nhanh sau**. Ba việc chỉ chủ kho làm được đứng đầu: tách DB của Preview, bật check bắt buộc kèm `enforce_admins`,
mở rộng `t3_paths`. Sau đó người đứng ở phần khó-đảo của mỗi lần ship (hạng R0/R1/R2 tính trên diff), không đứng
ở mọi cổng. Với kit hôm nay, ước ≈1,2–1,5 lượt gọi người mỗi vòng; con số 0,6–1 ở §8 là sai.

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
| H3 | crm | «Đỏ sẵn»: hồ sơ đã ký mục dần trên onehub. | DH2: 2 lượt ghim lại đỏ, 149′ máy (7/9 rồi 4/4 eval đỏ sẵn) → dừng-vá chờ 5,3 h → sinh vòng VS (≥2,3 h, 3 lượt gọi người). Tính lượt ngoài thiết kế: DH2 3 + VS 1. `ghd_soi_xem` đỏ 8 trên onehub (0 lộ thật, thước lệch sau 4 PR). Bom ngày 15 chặn mọi suite app 17:00Z→22:48Z ngày 14/10 (5,8 h, cả ba máy). 17 tin «đỏ sẵn» trên #375. CI theo PR **không chạy lại eval hồ sơ**; 0/31 lần gộp onehub có test trên đỉnh onehub. **Cũ hoá nền:** Điều phối M5 tự đo trên worktree sạch ở đỉnh onehub (~01:20Z 16/10). `scripts/pre-merge-check.sh` **không** `--base` cho «242 violation(s)», gần hết là hồ sơ đã ký hoá cũ theo paths. Cùng đỉnh đó, `--base origin/onehub` (cách CI gọi) cho «clean». Hai kết quả cùng đúng: `--base` chỉ soi hồ sơ mà PR chạm. Vì thế lượng cũ hoá nền này vô hình với CI, chỉ lộ ra khi một vòng đụng vào, rồi vòng đó trả giá thay cho cả nhánh. Mẫu số để đối chiếu: 248 hồ sơ `signed-off` (đếm ở `f59e83cd3`). Lưu ý: 242 là số vi phạm, không hẳn là số hồ sơ. Số 240 đo trước đó (thợ gieoNguoi, `f59e83cd3`) được thay bằng số này. | `repin-20261015T113052Z-32767`, `repin-20261015T144806Z-77303`; `ci.yml` / `acceptance.yml` ở `origin/onehub`; nhật ký 15/10 14:00Z–17:30Z; số 242 do Điều phối M5 đo, kèm cả lệnh và chế độ (tôi chưa chạy lại); số 248 đếm `status: signed-off` bằng `git show f59e83cd3:_acceptance/*/contract.md` | Thước↔Vật (thước lệch trôi theo vật của người khác) + Hạng mục↔Thước | crm; kit có trên máy cục bộ (5/6 đường nền «DO SAN», 1/3 ghim lại đỏ do CHANGELOG) nhưng CI nhánh chính xanh 16/16; oneflow tiềm ẩn |
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
5. `2026-10-16-hat-giong-che-do-cong.md` — **chế độ cổng chọn một lần cho mỗi đợt** (§8): Đồng hành · Biên · Tự lái.
   Lõi của chế độ Biên: một Cổng Đáng cho cả đợt kèm chính sách, và cổng tự đi khi mọi mục khớp chính sách (cửa
   veto, khối «CHƯA duyệt», làn V). Đây là CỘNG ở kit, chạm cả bốn tên cổng. Cân trên mọi kho: kho không chọn thì
   giữ Đồng hành, tức hành vi hôm nay, nên không mất gì. Ngưỡng mở: owner gọi tên nó làm vòng meta của cửa sổ.
   Hạt giống này trùng một phần với hạt giống 1: khi chính sách «giữ cỡ khi tiêu chí là rào chắn» đã khai ở Cổng
   Đáng thì chốt cỡ không còn phải hỏi.
6. `2026-10-16-hat-giong-hang-tu-khai-noi-dien-t3.md` — `risk_tier` của hợp đồng là tự khai. Diff chạm `t3_paths`
   vẫn đi được làn V nếu hợp đồng ghi T2, vì không luật nào nối `DIFF_T3_HITS` với hạng của hợp đồng (§9.2 L10).
   Đây là TRỪ một đường lách, đi theo thang «cờ vàng trước, chặn sau». Cân trên mọi kho: kho khai hạng đúng không
   đổi gì.
7. `2026-10-16-hat-giong-the-hien-muc-va-rang-chet.md` — thẻ Cổng Bằng chứng hiện mức của từng mục Ngoài-n. Mục
   mức cao, và mục «răng chết» (eval của một AC không thể đỏ), không được đi Known limits: AC đó lên thẻ là ĐẠT-MÙ
   (§9.2 L3, L4). Đây là áp lại bất biến «assertion âm-tính-một-mình» của kit lên lời mời. Cờ vàng trước.
8. `2026-10-16-hat-giong-tin-hieu-prod-theo-sha.md` — máy đọc log lỗi runtime của bản đang chạy theo sha (chỉ đọc),
   rồi đề xuất dòng `observed` cho người ký một chạm. Lý do: N của dòng hiệu chuẩn đã đứng yên ở 7 từ 22/09. Chạm
   ADR 0020, nên chỉ là hạt giống.
9. *(CỘNG, owner)* nới điều kiện xanh-sạch của làn V: cho Known limits chứa mục mức thấp/vừa đã được máy định
   tuyến. Không có bước này thì chế độ Biên không xuống dưới ≈1,2 lượt/vòng (§9.4).

## 8. Chỗ người chỉ là hình thức — và ba chế độ cổng

> **Đính chính 16/10 (xem §9):** ở crm, gộp vào `onehub` là lên production. Vì thế chế độ Biên/Tự lái như viết ở
> §8.2–8.3 sẽ để máy tự chạm khó-đảo, và con số «≈0,6–1 lượt/vòng» không đứng được với kit hôm nay. §8.1 (số
> 33/35) vẫn đúng, nhưng phải đọc kèm L3 ở §9.2. Bản thay thế là §9.3.

Câu hỏi của chủ kho sau khi đọc §7: «những nơi nào tôi xuất hiện chỉ là hình thức, hầu như không có thay đổi?», và
«làm sao đẩy người ra biên mà không ảnh hưởng tốc độ vòng — hoặc là có nhiều chế độ để lựa chọn».

### 8.1 Số đo: 33 trên 35 quyết định trùng khuyến nghị

**Cách đo.** Đọc mọi lượt người gõ trong transcript 10 phiên thợ (14–15/10), bỏ câu mở phiên của chip, và đặt
mỗi câu cạnh đoạn cuối tin máy ngay trước nó (`h5b.py`). Đếm theo **quyết định**, không theo lần gõ: một lần
«sửa: giữ cỡ» rồi «duyệt» là một quyết định Cổng Phạm vi. Định tuyến từng mục Ngoài-n ở Cổng Bằng chứng tính
chung là một quyết định cho mỗi lần ký.

| Chỗ | Quyết định | Trùng khuyến nghị | Vì sao là hình thức |
|---|---|---|---|
| Cổng Đáng từng vòng | 8 | **8/8** («build · ngưỡng theo đề xuất máy») | Chủ kho đã chọn các vòng này khi «Mở» đợt (15/10 02:05Z); mỗi vòng hỏi lại đúng điều đó |
| Cổng Phạm vi | 8 (15 lần gõ) | **8/8**; «giữ cỡ» 4/4, cùng một lý do (rào chắn) | Căn cứ là quy tắc đã khai |
| Gate 1.5 | 2 | **2/2** | Cùng lớp với trên |
| Lựa chọn ở dừng-vá | 6 | **6/6** (DH4 thu phạm vi · DA3 «hướng a» · DH2 lối A · sửa gốc · hydration · đường B) | Một chính sách khai một lần là đủ: chạm trần thì thu phạm vi; đỏ sẵn thì tách vòng vệ sinh |
| Gỡ nhãn cross-layer sau ký | 2 | **2/2** | Máy tự kiểm được: có eval API trên cùng bộ mẫu thì gỡ |
| Cổng Bằng chứng (gồm ≈150 mục Ngoài-n) | 8 | **7/8** | Ngoài-n gần như toàn bộ là dòng máy điền sẵn |
| Nâng phạm vi Ngoài-3/6/7 (DH3) | 1 | **chưa kiểm được** | — |
| **Cộng** | **35** | **33** | |

Hai ca người thật sự cần thiết, và cả hai **không** khó-đảo:
- **E17 của DH3:** hội đồng UNCERTAIN, chủ kho phán «Đạt». Phán đoán giá trị về màn hình, máy không có căn cứ.
- **DH3 nâng phạm vi sửa ngay Ngoài-3/6/7:** đổi thời gian lấy độ đủ.

Số này khớp số đo 11/10: người định tuyến Ngoài-n trùng đề xuất máy **94,9 %**
([`2026-10-11-khao-sat-chi-phi-actions-va-thoi-gian-phien.md`](2026-10-11-khao-sat-chi-phi-actions-va-thoi-gian-phien.md)).

**Đọc theo luật 01/09** trong `CLAUDE.md`, phép thử là: «người trả lời khác khuyến nghị thì dựa vào điều gì máy
không có?». Với 33 quyết định trên, câu trả lời là *không có gì*. Chúng là **trạm thu phí**, không phải điểm
quyết định.

Kit **đã có luật** để đẩy người ra biên, nhưng crm chưa áp:
- luật 01/09: mục nào có căn cứ là quy tắc đã khai thì máy đi tiếp, ghi sổ, mở cửa veto; làn V là ca-rỗng;
- khối ĐỊNH VỊ 21/09: *chính sách* của vòng chốt MỘT lần ở Cổng Đáng, rồi máy áp nó cho mọi cạnh gãy sau đó mà
  không hỏi lại.

Số 21/09 cho thấy ý định mới được ghi ở 9 % hồ sơ. Tôi chưa kiểm xem máy có đọc chính sách ghi ở ô cơ hội hay
chưa.

### 8.2 Ba chế độ cổng

Chủ kho chọn chế độ **một lần cho mỗi đợt**, ngay ở Cổng Đáng của đợt. Ở mọi chế độ đều giữ: ADR 0002 (máy không
ký thay; «máy đã thông» ≠ «đã ký»), khó-đảo luôn hỏi người, và mọi việc máy tự quyết đều có sổ, đường đảo, và
hiện ở khối «CHƯA duyệt».

| Chế độ | Người xuất hiện ở đâu | Dùng khi |
|---|---|---|
| **Đồng hành** (hôm nay) | Mọi cổng của mọi vòng | Vòng T3, vùng mới, có thứ khó-đảo |
| **Biên** | (1) Một Cổng Đáng cho cả đợt: danh sách vòng + ngưỡng + chính sách. (2) Cổng Bằng chứng chỉ khi có mục ngoài chính sách: hội đồng UNCERTAIN/FAIL, Ngoài-n mức cao, «mở hợp đồng mới». (3) Mọi thứ khó-đảo. | Đợt có lộ trình đã duyệt |
| **Tự lái** | Cổng Đáng của đợt · khó-đảo · dòng hiệu chuẩn hằng tuần `ĐẠT đã ký → prod đỏ: k / N` (ADR 0020) | T1/T2 ở vùng quen, đảo được bằng revert |

**Chính sách đợt** — cái làm chế độ Biên chạy được. Viết từ chính 33 quyết định ở §8.1:
- tiêu chí là rào chắn (phân quyền · giữ xanh hồ sơ đã ký · ranh giới tệp) → giữ cỡ;
- chạm trần 3 lượt chấm → thu phạm vi, mục bị cắt vào Known limits;
- eval đỏ sẵn trên nền → tách vòng vệ sinh, vòng đang chạy không sửa;
- Ngoài-n mức thấp hoặc vừa → Known limits; mức cao → hỏi người;
- nhãn cross-layer mà phía máy chủ đã có eval API trên cùng bộ mẫu → gỡ nhãn.

**Người không chặn vòng.** Ở chế độ Biên, lời mời còn lại được gom vào một tin trong khung giờ chủ kho thức. Vòng
đi tiếp trên lối khuyến nghị nếu lối đó đảo được rẻ; nếu không đảo rẻ được thì đó là khó-đảo, và luôn hỏi.

### 8.3 Ước hiệu quả và đánh đổi

Ước trên số 2 ngày, chế độ Biên:

| Thước | Hôm nay | Biên | Căn cứ |
|---|---|---|---|
| Lượt gọi người/vòng | 4,2 | **≈0,6–1** | Cổng Đáng đợt chia 5 vòng ≈0,2 · ca kiểu E17 ≈0,3–0,5 · «mở hợp đồng mới» ≈0,1 |
| Chạm/lượt | tới 4 | 1 | Không còn chốt cỡ, không còn gõ lại |
| Chờ đêm dài nhất | 6,5 h (DA2b) · 5,3 h (DH2) | ≈0 ở hai ca này | DA2b chỉ vướng một mục Ngoài-n «chấp nhận» (*sai — xem §9.4: xanh-sạch đòi mục Ngoài hợp đồng rỗng, nên DA2b vẫn phải ký*); DH2 có chính sách «đỏ sẵn → tách vòng» thì máy chọn đường B ngay lúc 16:03Z |

Đánh đổi:
- **Mất thước 94 %.** Khi người thôi đọc, tỉ lệ «trùng khuyến nghị» không đo được nữa. Chiều đỏ của chính quyết
  định đổi chế độ phải dựa vào thứ kit đã có: tỉ lệ veto trên khối «CHƯA duyệt», và dòng hiệu chuẩn prod (ADR
  0020). Ngưỡng tự quay về Đồng hành: ≥1 veto trong một đợt, hoặc k > 0 trên dòng hiệu chuẩn. Nhớ rằng dòng hiệu
  chuẩn vô hiệu khi N không tăng.
- **Luật gộp của crm phải đổi.** Hiện crm chỉ gộp hồ sơ «signed-off manh». Muốn hồ sơ làn V được gộp thì luật ấy
  phải đổi — chỉ chủ kho quyết được.
- **Phân loại sai** (máy xếp một mục là «theo chính sách» mà thật ra không phải) được đỡ bằng cửa veto và khối
  «CHƯA duyệt». Khó-đảo vẫn luôn là câu hỏi cho người, bất kể máy phân loại thế nào.

### 8.4 Làm được tới đâu khi chưa đổi kit

- **Làm được ngay, máy tự đi:**
  - gom lời mời cổng theo khung giờ thức;
  - ghi chính sách ở §8.2 vào ô cơ hội lúc Cổng Đáng;
  - lời mời Cổng Phạm vi in sẵn dòng «giữ cỡ» khi khớp chính sách (đã là nếp từ 15/10 08:00Z).
- **Phải đổi kit:** một Cổng Đáng cho cả đợt, và cổng tự đi khi mọi mục khớp chính sách. Đây là CỘNG ở kit, nên
  theo luật chiều rộng chỉ là hạt giống (§7.3, mục 5), trừ khi chủ kho gọi tên nó làm vòng meta duy nhất của cửa
  sổ.

## 9. Lỗ hổng của chế độ Biên và bản hoàn thiện

Câu hỏi của chủ kho sau §8: «với mục đích dẫn dắt bằng northstar, tìm lỗ hổng, tình huống chưa phủ hết, hoặc điều
gì tối ưu hơn để hoàn thiện nó». Làm ba bước, đều chỉ đọc:
- một tác tử đọc mã kit (làn V, thẻ, thẻ khởi tạo đợt, khó-đảo, mức Ngoài-n);
- một tác tử đọc `origin/onehub` của crm (đường lên production, reality, mức Ngoài-n);
- một tác tử phản biện phá bản nháp.

### 9.1 Ba sự thật đổi bài toán

1. **Ở crm, gộp vào `onehub` là lên production**, cả bốn dự án, không có bước tay. Migration chạy trong build trên
   DB thật (`docs/production.md` của crm; `production.nhanh: onehub` trong `config.yaml`). Nhịp là ≈12 lần gộp mỗi
   ngày, do phiên máy bấm bằng `gh` của chủ kho. Trong 14–16/10 có 6 migration lên prod tự động, đều chỉ thêm.
   `release` và `main` là di sản, không dùng.
2. **Bản Preview dùng chung DB với production.** Mỗi lần đẩy nhánh, code chưa qua cổng nào chạy trên dữ liệu thật.
   Vì vậy «trước khi gộp thì mọi thứ còn nằm trong nhánh» là **sai** ở crm.
3. **Chiều đỏ của việc bớt người đang chết:**
   - Dòng hiệu chuẩn reality có N = 7, cả 7 quan sát ghi 21–22/09, từ đó 0 quan sát mới, và k chưa từng được ghi.
   - `onehub` không được bảo vệ (rules `[]`, protection 404), nên `pre-merge-check` chỉ là lời khuyên. Chốt gộp thật
     là một luật lời của đợt.
   - Hai núm `require_human_commit`/`agent_authors` đã hết hiệu lực từ 2.1 (ADR 0012), và provenance giờ lấy từ
     người bấm merge trên forge. Ở crm, máy bấm merge bằng tài khoản chủ kho, nên provenance cũng sụp.

### 9.2 Lỗ hổng

| Mã | Lỗ | Nguyên tố bị chạm | Phán quyết đối kháng |
|---|---|---|---|
| L1 | Danh sách khó-đảo của kit (KHO-DAO-V) có «ship ra người dùng thật». Ở crm, mọi lần gộp là ship → Biên/Tự lái như §8 để máy tự chạm khó-đảo. Đọc đúng chữ thì lượt gọi còn **tăng**. | 3 | GIỮ-CÓ-SỬA: cần chủ kho chốt «khó-đảo = lần ship mà revert không đảo được» (đáng một ADR) |
| L2 | Chiều đỏ của quyết định bớt người đã chết (§9.1 mục 3). Bật Biên lúc này là ĐẠT-MÙ cho chính việc uỷ quyền. | 2 | GIỮ |
| L3 | Số 33/35 không chứng máy đúng. Thẻ Cổng Bằng chứng **không hiện mức** Ngoài-n, nên người định tuyến 105 mục mà không thấy mức — người không có căn cứ để bất đồng. Bỏ người thì thước này biến mất. | 2, 3 | GIỮ |
| L4 | Known limits đang nuốt **răng chết** của các phép thử phân quyền: 8/12 mục mức cao vào Known limits, phần lớn là âm-tính-một-mình (DH1 Ngoài-10: phép thử «máy chủ từ chối thành viên tạo mục tiêu» luôn xanh). Việc này xảy ra **dưới chữ ký người**. | 2 | GIỮ-CÓ-SỬA: lý lẽ chống «người là bảo hiểm», không chống Biên |
| L5 | Gộp đêm: rollback là việc của chủ kho, nên đảo cần người đang ngủ. | 3 | GIỮ cho R1, R2; R0 máy revert được thì hết |
| L6 | Điều phối vừa áp chính sách vừa bấm gộp. Check bắt buộc cũng không tách vai, vì token admin bỏ qua được nếu không bật `enforce_admins`. | 2 | GIỮ: cần danh tính gộp không phải admin |
| L7 | Chế độ chọn theo đợt hoặc theo máy, nhưng `onehub` chung ba máy → luật ship phải ở cấp KHO. | 3 | GIỮ |
| L8 | Ý định không ai đọc. DH4 khai «vòng chỉ đọc, không ghi DB» mà vẫn đẻ lệnh nạp ghi DB, và nó chỉ bị bắt như một Ngoài-n mức *vừa*. | 1 | GIỮ |
| L9 | Preview chung DB prod (§9.1 mục 2). | 2, 3 | GIỮ, nặng hơn nháp nói |
| L10 | `risk_tier` là tự khai: diff chạm `t3_paths` vẫn đi được làn V nếu hợp đồng ghi T2. | 2 | đối kháng phát hiện |

Hai dữ kiện nháp ghi sai, đối kháng đã bắt và đã sửa ở trên:
- Hai núm chữ ký người/máy đã chết từ 2.1 (ADR 0012), không còn bật được.
- Trong 12 hồ sơ crm đi làn V, có 5 có `approved_by` và 7 đi qua cửa veto. Nháp ghi «10/12» là sai.

### 9.3 Bản hoàn thiện — người đứng ở phần khó-đảo của mỗi lần ship

Người không đứng ở cổng; người đứng ở **phần không đảo được của mỗi lần ship**. Hạng rủi ro tính trên **vật** (diff),
không theo lời khai. Không cần bộ phân loại mới: kit đã có `pre-merge-check.sh --hang-pr`. Nó tất định, và trả
`khong-ro` khi PR đổi chính danh sách hạng so với merge-base, nên đã chặn kiểu tác tử con tự sửa danh sách.

| Hạng | Vật | Đảo bằng gì | Người |
|---|---|---|---|
| R0 | UI/logic; không migration; không ghi dữ liệu; không gửi tin ra ngoài; không chạm đường phân quyền | revert PR — máy làm được, vì revert gộp là tự deploy | không; cửa veto + khối «CHƯA duyệt» |
| R1 | migration chỉ-thêm; khoá config | **sửa tiến**, không revert: `migrate deploy` không lùi; cột NOT NULL không mặc định hay enum mới làm bản cũ lỗi; lệnh «sửa lệch schema» mà build gợi ý sẽ DROP cột có dữ liệu | gộp trong giờ chủ kho thức; hỏi khi có hồi quy |
| R2 | migration phá; script ghi dữ liệu prod; gửi tin ra ngoài (Zalo); đường phân quyền/che chắn; env, secret; cron xoá dữ liệu (`vercel.json`) | không đảo được | **luôn hỏi**, một chạm, thẻ có mức |

**Thứ tự áp:**

| # | Việc | Tầng | TRỪ / CỘNG | Ai |
|---|---|---|---|---|
| 1 | Tách DB của Preview khỏi prod | crm hạ tầng | an toàn, độc lập với Biên | **chủ kho** |
| 2 | Bật check bắt buộc trên `onehub` (acceptance gate + CI), kèm `enforce_admins`; máy gộp bằng danh tính không phải admin | GitHub của crm | đặt răng cho luật lời | **chủ kho** (cài đặt bảo mật — máy không tự đổi) |
| 3 | Làn đêm ghim lại (PC1) — chiều đỏ duy nhất đang sống: nó đã đỏ với lỗi prod thật (hydration, 403 quản trị) | crm | CỘNG quy trình | chủ kho (đã có ở §7.2) |
| 4 | Mở rộng `t3_paths` của crm (service phân quyền, `apps/api/vercel.json`, script ghi DB, `apps/agent/**` gửi tin); dùng `--hang-pr` đếm tỉ lệ R2 thật trên 9 vòng | config crm | 0 dòng kit | chủ kho (luật kho) |
| 5 | Ghi trọng số và chính sách vào ô cơ hội ở Cổng Đáng (§8.4) | nếp thợ | TRỪ | máy |
| 6 | Thẻ hiện mức; răng chết không được Known limits | kit | CỘNG → hạt giống 7 | owner gọi tên |
| 7 | Trao máy quyền revert, **chỉ R0** | luật crm | — | chủ kho |
| 8 | Nới xanh-sạch cho Known limits | kit | CỘNG → hạt giống 9 | owner |
| 9 | Mẫu mù: chọn theo hạng R và trọng số AC, **cộng dồn qua các đợt**, là phép hiệu chuẩn chứ không phải cò hạ chế độ | điều phối | — | máy, sau cùng |

Về cỡ mẫu (đối kháng): 1–2 mẫu mỗi đợt quá nhỏ. Theo quy tắc ba, 0 lệch trên n mẫu chỉ chặn tỉ lệ sai dưới 3/n;
muốn chặn dưới 5 % cần ≈60 mẫu, tức ≈30 đợt. Với n = 2, một lần người tự nhiễu cũng đủ hạ chế độ oan khoảng 10 %
số đợt. Vì thế mẫu mù là thước dài hạn, không phải cò.

### 9.4 Ước lại, theo đúng luật kit hôm nay

- **Lượt gọi người ≈1,2–1,5 mỗi vòng**, không phải 0,6–1. Lý do: vị từ xanh-sạch của làn V
  (`scripts/khong-can-nguoi.mjs`) đòi mục Known limits và mục Ngoài hợp đồng có mặt **và rỗng**. Mà 78/105 mục
  Ngoài-n đã vào Known limits, nên gần như hồ sơ nào cũng phải có người ký Cổng Bằng chứng. Đây cũng là lý do ô
  DA2b ở §8.3 sai.
- Xuống ≈0,75 lượt/vòng chỉ khi có cả bước 8 (CỘNG kit) lẫn bước 4 (để biết tỉ lệ R2 thật; ước «một nửa vòng chạm
  R2» chưa đo).
- **Phần chắc chắn hơn mọi con số trên:** các bước 1–3 sửa an toàn thật cho người dùng crm ngay hôm nay, độc lập
  với chế độ nào được chọn. Theo kim chỉ nam — sản phẩm tới tay người dùng nhanh hơn **mà vẫn tin được** — chúng
  phải đi trước việc bớt người.

### 9.5 Lời mời chủ kho (một dòng)

> **Ba việc chỉ anh làm được, cùng hướng «tin được trước, nhanh sau»: (1) tách DB của Preview khỏi prod; (2) bật
> check bắt buộc trên `onehub` kèm `enforce_admins`, để máy gộp bằng danh tính không phải admin; (3) cho phép mở
> rộng `t3_paths` của crm — gõ «duyệt», hoặc «bỏ <số>».**

(1) và (2) là cài đặt hạ tầng và bảo mật, máy không tự đổi. (3) là luật kho. Cả ba đảo được.

## 10. Giới hạn đo

- Giờ «~» trong nhật ký điều phối lệch tới +1,5 h so với commit; tôi lấy giờ commit.
- `duong-nen.md` không ghi thời lượng. `run-log.jsonl` ghi chung một `ts` cho cả lượt, nên phút S4 lấy từ
  `usage-report.md`.
- Thời lượng pre-push chỉ có log đủ của một vòng (DA2b, 4 lần push) và ba lần push tài liệu. Con số
  «118 push × 15′» cho cả ba máy là ước, chưa đo.
- DH2 và VS chưa ký, nên số của hai vòng này là cận dưới. Cột ký→gộp cũng là cận dưới với 5 vòng còn chờ.
- Token đọc kênh là ước theo ≈3 ký tự/token, không phải số đếm thật.
- Số 33/35 (§8.1) so lời người với đoạn cuối tin máy ngay trước. Khuyến nghị nằm trong thẻ mà không in ở đoạn
  cuối thì tôi xếp «chưa kiểm được» (ca DH3 Ngoài-3/6/7). Mẫu là 10 phiên trong 2 ngày.
- Trong lúc đo, một tác tử chạy `git fetch origin main` ở kho oneflow và kho kit. Lệnh này chỉ cập nhật ref theo
  dõi, không chạm cây làm việc.

## Nguồn và cách chạy lại

Mọi script đo nằm ở thư mục scratchpad của phiên này, không commit vì có dữ liệu crm thô: `dec.py`, `rl.py`,
`repin.py`, `usage.py`, `h5.py`, `h5b.py`, `h7.py`, `allheavy.py`, `an.py`, `an2.py`. Chạy lại theo «Nguồn số đo» của đề
bài chung, với tham số ở đầu tệp này.
