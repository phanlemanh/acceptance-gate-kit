# Nhận kit 2.35.0 ở invest — thí điểm nền thiết kế (DO1) ở bậc M1

Viết cho `invest` (đang ở 2.34.0), kho nhận đầu tiên của 2.35.0 và kho thí điểm DO1 cho nền thiết kế (design-floor).
Đây là danh sách việc cho người nhận; kit không làm thay ở kho nhận. Nguồn: mục `2.35.0` của `CHANGELOG.md`, GUIDE §5.2
(«Wire `executors.design`»), `scripts/design-floor-bac.mjs`, các khối `DESIGN-FLOOR-S0/S1/S3/S4` của SKILL feature-loop.

## 1. Bậc của kho — hôm nay M0, sau khi khai M1

Bộ đọc bậc (`design-floor-bac.mjs`, chỉ đọc) xét từ cao xuống, khai báo hỏng không nâng bậc:

| Bậc | Điều kiện | invest |
|---|---|---|
| M3 | `design_floor.niem_phong` khác rỗng trên nền M2 — **chỉ người ghi** | — |
| M2 | `design_floor.tokens` VÀ `design_floor.registry` cùng khai, cả hai tệp có thật | chưa có bộ token, chưa có danh mục thành phần |
| M1 | `design.surface_globs` khớp ít nhất một tệp git theo dõi | **đích của thí điểm** |
| M0 | còn lại — S0 không in gì | **hôm nay**: cấu hình có `executors.design.gate`/`ui_check` nhưng không có khối `design:` cấp gốc với `surface_globs` |

Đo 29/10 trên một bản sao cấu hình nhánh chính của invest: không đổi gì → bộ đọc im (M0); thêm khối `design.surface_globs`
dưới → `design-floor: bậc M1 — có giao diện (… tệp khớp design.surface_globs), chưa khai nguồn — design_floor.tokens
chưa khai; design_floor.registry chưa khai`. **Máy không tự nâng bậc**: không lệnh nào của kit ghi `design_floor.tokens`,
`registry` hay `niem_phong`; lên M2 là việc người khai khi kho có bộ token và danh mục thành phần, M3 chỉ người ghi.

## 2. Việc buộc làm — theo thứ tự

1. **Cài theo thẻ `v2.35.0`** mọi gói invest đang dùng (`acceptance-gate`, `feature-loop`; `dieu-phoi`, `road-map`,
   `tri-thuc` nếu dùng) ở mọi phạm vi và mọi cây phụ có phiên. Kiểm: `node <gốc gói acceptance-gate>/scripts/kiem-ban-cai.mjs
   --may --ref v2.35.0 --root <bản clone kit đã git fetch --tags>` → `TỔNG KẾT: ĐẠT …`. Mở phiên MỚI.
2. **Đổi đường bộ đệm có số.** `_acceptance/config.yaml` của invest trỏ thẳng bộ đệm plugin `…/acceptance-gate/2.34.0/…`
   ở 12 chỗ (`executors.design.gate`, `executors.design.ui_check` và các khoá `*_design_gate`). Bản 2.34.0 bị gỡ là các
   lệnh ấy chết, hoặc chạy bản cũ im lặng. Đổi số thành `2.35.0` — hay tốt hơn, đổi sang đường không số (GUIDE §5.3;
   ghi chú nhận 2.34.0 mục 1.2).
3. **Khai vùng giao diện** — đưa kho lên M1. Thêm khối cấp gốc (tên thư mục theo kho hôm nay, giao diện web ở `app/`):

   ```yaml
   design:
     surface_globs:                    # S4 bắt "diff chạm surface mà lane không có design eval"; bộ đọc bậc dùng nó cho M1
       - "app/src/app/**"
       - "app/src/components/**"
   ```

4. **Nối S4** — thêm `floor` vào khối `executors.design` có sẵn, cùng đường bản kit cài như `gate` (ghim lại theo mỗi
   bản phát hành như `product_map`):

   ```yaml
   executors:
     design:
       gate: "node <acceptance-gate>/scripts/design-gate.mjs --jsdom app"     # có sẵn
       floor: "node <acceptance-gate>/scripts/design-floor-s4.mjs --root ."   # tuân thủ design system ở S4 (design-floor)
   ```

   Từ đây hồ sơ chạm giao diện khai một eval `script` với `cmd: config:executors.design.floor`. Lệnh chỉ đọc: hex thô trên
   tệp giao diện mà vòng chạm (diff với nhánh chính ∩ `design.surface_globs`); ở M1 chỉ hex thô chặn (thoát 2), độ phủ
   token không đo (lệnh `ui` không được gọi). Không nối thì S0 in thêm một dòng «S4 chưa chấm tuân thủ design system».
5. **Khối `design_floor` — ở M1 KHÔNG khai `tokens`, `registry`, `niem_phong`.** Khuôn đầy đủ (GUIDE §5.2) để dành cho lúc
   lên M2:

   ```yaml
   design_floor:                       # bậc design-floor của kho (M2 = khai tokens + registry)
     tokens: "design/tokens.json"
     registry: "design/component-registry.json"
     sinh_lai:                         # lệnh sinh lại tệp dẫn xuất, chạy cuối S3 sau autofix — commit trước S4
       - "npm run tokens:build"
   ```

   Ở M1 chỉ khai `design_floor.sinh_lai` khi kho có lệnh sinh lại tệp dẫn xuất từ giao diện; không có thì bỏ cả khối.
   Khai `tokens` trỏ tệp chưa có vẫn đọc ra M1 (bộ đọc nêu «trỏ tệp không có»), không nâng bậc.
6. **Vẽ lại bản sinh** trong PR nhận (`PRODUCT-MAP.md`, `LO-TRINH.html` nếu khai `lo_trinh.tep`) và chạy suite của kho.
7. **Lớp chép CI:** chỉ khi invest khai `tin_hieu` — chép lại `scripts/cat-luot.mjs` và `dieu-phoi/scripts/hinh-dang.mjs`
   từ thẻ. Nền thiết kế chạy từ bản kit cài, không chép.

## 3. Điều sẽ thấy khi bật

- **S0** nói lại dòng bậc M1 — thông tin, không câu hỏi. **S1** ghi `_acceptance/<slug>/design-floor.json` và một dòng vào
  `usage-report.md`; thẻ Cổng Phạm vi có khối «Sàn thiết kế». **Cuối S3** chạy autofix trên trang `.html`/`.htm` mà vòng
  đổi (kho `.tsx` thường không có trang nào) và các lệnh `sinh_lai`, rồi một commit máy nếu có tệp đổi.
- **S4 chặn hex thô theo tệp vòng chạm.** Đo 29/10 trên nhánh chính: **52/619** tệp dưới hai glob trên mang hex thô
  (262 chỗ). Vòng chạm một trong 52 tệp ấy sẽ đỏ ở eval `floor` tới khi đổi hex sang token/biến. Bộ bắt theo mẫu ký tự:
  `href="#abc"` hay chữ `#abc` trong nội dung cũng bị bắt (giới hạn đã khai của FL5).
- **Kho M1 không có độ phủ token** — giao diện `.tsx` chỉ có kiểm hex thô ở S4 (giới hạn đã khai của FL5).

## 4. Đường nền DO1 — đo TRƯỚC khi bật

Mười vòng giao diện gần nhất của invest, đo 29/10 03:33 (giờ VN) sau `git fetch`, trên nhánh chính đỉnh `76d7448e`
(invest#162). **Ẩn danh** (kho kit công khai): nhãn V1…V10 theo giờ ký; không slug, không tên tính năng.

- **Vòng giao diện** = hồ sơ trên nhánh chính có `surfaces` chứa `ui` và `status: signed-off` (40 hồ sơ); lấy 10 hồ sơ
  ký gần nhất, cả mười rơi vào 26–27/10. V5, V9, V10 nhiều bề mặt (ui kèm api, cli, db…), không thuần giao diện.
- **làm-xong** = commit đầu đưa `status:` sang `implemented` · **ký** = commit đầu sang `signed-off` (giờ tác giả) ·
  **gộp** = commit đầu trên lối cha-đầu của nhánh chính có commit ký là tổ tiên (giờ commit). Cả mười gộp bằng merge
  commit, không squash.
- **Lượt chấm** đếm `round-tally` trong `run-log.jsonl` (lượt BLOCKED hạ tầng vẫn tính). **Out-token S4** và **phút máy**
  (lượt dài nhất / tổng đường găng các lượt) đọc từ `usage-report.md`; vòng không có tệp ấy ghi «—».
- **Cổng người** PV · 1.5 · BC = Cổng Phạm vi · Gate 1.5 (chỉ T3) · Cổng Bằng chứng, đếm từ sổ quyết định và commit cổng;
  ngoặc là Cổng Đáng (1 khi hồ sơ có ô cơ hội đã quyết build, «—» khi không có ô). **Ngoài-TK** = lượt gọi người ngoài
  thiết kế.

| | Hạng | Ký | PR | Làm-xong→ký | Ký→gộp | Lượt chấm (verdict) | Out-token S4 | Phút máy S4: dài nhất / tổng | Cổng người PV·1.5·BC (+Đáng) | Ngoài-TK |
|---|---|---|---|---|---|---|---|---|---|---|
| V1 | T2 | 26/10 | invest#119 | 1 g 43 | 0 g 08 | 1 (PASS) | 91,7k | 6,3 / 6,3 | 1·0·1 (+1) | 0 |
| V2 | T2 | 26/10 | invest#128 | 3 g 30 | 1 g 09 | 3 (REJECT→BLOCKED→PASS) | 218,9k | 8,7 / 20,5 | 1·0·1 (+1) | 1 |
| V3 | T3 | 26/10 | invest#131 | 0 g 53 | 0 g 05 | 2 (REJECT→PASS) | — | — | 1·1·1 (+1) | 0 |
| V4 | T3 | 26/10 | invest#140 | 1 g 47 | 1 g 21 | 2 (PASS→PASS) | — | — | 1·1·1 (—) | 0 |
| V5 | T3 | 26/10 | invest#139 | 1 g 18 | 0 g 15 | 3 (REJECT→REJECT→PASS) | — | — | 1·1·1 (+1) | 0 |
| V6 | T2 | 26/10 | invest#143 | 2 g 03 | 2 g 06 | 2 (REJECT→PASS) | 203,5k | 15,2 / 22,0 | 1·0·1 (+1) | 0 |
| V7 | T2 | 27/10 | invest#148 | 0 g 13 | 0 g 30 | 1 (PASS) | 30,9k | 2,6 / 2,6 | 1·0·1 (—) | 0 |
| V8 | T2 | 27/10 | invest#150 | 0 g 46 | 0 g 26 | 3 (REJECT→REJECT→PASS) | 110,3k | 4,6 / 11,7 | 1·0·1 (—) | 0 |
| V9 | T3 | 27/10 | invest#156 | 0 g 25 | 0 g 04 | 2 (PASS→PASS) | 110,5k | 4,1 / 7,9 | 1·1·1 (—) | 0 |
| V10 | T3 | 27/10 | invest#160 | 1 g 10 | 0 g 11 | 3 (PASS→PASS→PASS) | — | — | 1·1·1 (+1) | 0 |
| **Trung vị** | | | | **1 g 14** (0 g 13 – 3 g 30) | **0 g 20** (0 g 04 – 2 g 06) | **2** (1–3) | **110,4k** (n = 6) | **5,5 / 9,8** (n = 6) | **2,5** (2–3); kể cả Đáng **3** (2–4) | **0** (một vòng có 1) |

**Ký chưa gộp:** 0. **Commit sau ký trong PR** (không-gộp / gộp nhánh chính) theo V1…V10: 2/2, 2/3, 0/1, 7/2, 3/2, 5/7,
2/2, 2/2, 0/1, 0/1 — đại diện cho chi phí ghim lại sau ký, đếm từ lịch sử git.

**Giới hạn của đường nền** (đọc kèm, không làm tròn):

- Bốn vòng (V3, V4, V5, V10) không có `usage-report.md` → token và phút máy chỉ có n = 6.
- Lượt gọi người SAU chữ ký (ghim lại, gộp, chờ CI) không đếm được: commit máy và commit người cùng một tên tác giả, sổ
  quyết định không ghi các lượt ấy.
- Cổng Đáng: V1–V3 chung một lần quyết cho bảy ô giao diện, nên «+1» mỗi vòng cộng ba lần một quyết định; V4, V7–V9
  không có ô trong hồ sơ.
- V4 và V6 vào nhánh chính qua PR của nhánh khác; ký → gộp tính tới PR đầu chứa commit ký.
- Mẫu nhỏ: mười vòng trong hai ngày, ba vòng ký trong ba giờ.

**Đọc lại sau thí điểm:** cùng định nghĩa, trên mười vòng giao diện kế tiếp sau khi kho lên M1. Điều DO1 cần biết: nền
thiết kế có làm tăng lượt chấm và làm-xong → ký (eval `floor` đỏ vì hex thô ở tệp vòng chạm), và có kéo ký → gộp hay
lượt gọi người lên không — North Star của kit đo đến GỘP, lượt gọi người đứng trước giờ máy.

## 5. Chưa chắc — người nhận kiểm ở kho của mình

- Hai glob trên chọn theo cây hôm nay (`app/src/app`, `app/src/components`); giao diện nằm ở thư mục khác thì thêm.
- Eval `floor` không truyền `--base` thì so với merge-base của HEAD và `origin/main` (rồi `origin/master`, `main`,
  `master`); lượt chấm chạy trên cây không có `origin/main` mới thì gốc so cũ hơn thật — `git fetch` trước lượt chấm.
- Đường nền đo trên một cửa sổ có nhiều vòng song song; so sau thí điểm nên giữ cùng tiêu chí chọn vòng.
