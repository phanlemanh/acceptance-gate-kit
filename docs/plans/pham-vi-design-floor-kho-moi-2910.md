# Bản phạm vi — design-floor cho người mới và kho mới (29/10/2026)

Gốc: onehub-invest/_acceptance/nhan-kit-2-35-0/ — lần nhận 2.35.0 và thí điểm DO1 ở bậc M1, cùng năm phản hồi K1–K5 ở
kit #445.

**Tệp này là gì.** Bản phạm vi chờ chủ kho duyệt. Duyệt xong, skill `cat-luot` cắt nó thành hàng của
`docs/plans/lo-trinh-kit.json`; mỗi hàng mang `Gốc:` ở trên. Tệp không mở ô và không đổi gì ở engine.

## 1. Điều vừa học được (29/10)

Một kho thật (React `.tsx`, Tailwind v4, shadcn + ReUI) muốn bật nền thiết kế. Từ lúc nhận bản tới lúc nối được bộ chấm
mất cả buổi, qua ba máy và năm lượt chủ kho chuyển lời hoặc quyết. Mọi chỗ vấp đều là việc máy làm được:

| # | Chỗ vấp | Ai gỡ hôm nay | Nên là |
|---|---|---|---|
| 1 | Vùng giao diện ôm cả thư mục vendor, nên S4 chấm cả mã kho không được sửa (248/263 chỗ bắt) | MBP đo tay, M5 liệt kê dương 13 thư mục | lệnh khởi tạo đề xuất vùng, trừ vendor |
| 2 | Liệt kê dương thì thư mục mới tự rơi khỏi vùng mà không ai biết | M5 tự viết test | lệnh khởi tạo sinh sẵn test bắt thư mục sót |
| 3 | Không ai biết bật thì bao nhiêu vòng cũ sẽ đỏ | MBP chạy tay 10 vòng (2/10 đỏ oan) | một lệnh đo đường nền N vòng gần nhất, chạy trước khi bật |
| 4 | Tưởng lên M2 là được chấm thêm; với `.tsx` thì M2 chỉ thêm một kiểm không chặn (K4) | đọc mã mới biết | bảng bậc nói tác dụng theo loại tệp, bộ đọc bậc in đúng câu ấy |
| 5 | S4 chấm cả tệp vòng chạm, nên nợ có sẵn làm đỏ vòng không thêm gì (K2) | kho dọn tay | chấm dòng thêm/đổi |
| 6 | Hex trong chú thích, mặt nạ, màu WebGL bị bắt (K3) | kho đổi `#000` → `black` | bỏ chú thích; chú thích miễn trừ có lý do |
| 7 | Tri thức S1 ~9,5k token mỗi vòng, không ai biết có được dùng (K5) | chưa ai | đo đọc-dùng trước khi nạp thêm |

## 2. Nguyên tắc xếp

1. **Không đổi hành vi S4 của nền thiết kế trong 10 vòng DO1 của invest** (chủ kho chốt «Sau 10 vòng M1»). Hàng đổi S4
   chỉ phát hành sau khi đủ 10 vòng, hoặc invest ghim bản cũ tới hết thí điểm.
2. **Mang từ Design OS chỉ thứ có bằng chứng hoặc lấp đúng chỗ hở đã đo.** Rà 29/10: kit đã vendor `ui gate`,
   `token-coverage`, `autofix`, `reuse-plan check`, `flow lint`. Kho Design OS còn bộ đọc JSX/Tailwind, bộ biến CSS thành
   token, hook đo đọc tri thức, và chú thích miễn trừ trong tệp — chưa mang sang.
3. **Mỗi hàng một kết quả, 8–12 tiêu chí** (chính sách cỡ vòng 10/10).
4. **Lệnh mới là CỘNG** — chủ kho phê đích danh ở Cổng Đáng hoặc Cổng Phạm vi của chính hàng.

## 3. Lộ trình đề xuất

### Mốc 0 — máy làm ngay, không mở vòng (cửa veto mở)

- **Tên gọi.** Rà 29/10: mọi chỗ người dùng thấy đã ghi design-floor; «Design OS» chỉ còn ở ghi công upstream, đường
  vendor và lịch sử — giữ nguyên. Đổi tên đường `vendor/design-os` sẽ kéo 127 tệp và ghim lại FL2–FL5, nên KHÔNG đổi.
  Việc làm: thêm term **design-floor** vào `CONTEXT.md` («nền thiết kế của kit; mã lõi lấy từ upstream Design OS»), đặt
  «Design OS» vào `_Avoid_` khi nói về nền của kit (ngoại lệ: ghi công và đường vendor), đổi câu giao của hàng chờ FL-C1
  thành «…của design-floor ở S4» rồi vẽ lại `LO-TRINH.html`.
- **Ghi chú nhận bản vá TC** có một mục design-floor (đã nằm trong việc cắt bản vá).

### Mốc 1 — «Bật nền thiết kế trong một buổi, không cần chuyển lời» (sau bản vá TC)

**DFK1 `bat-nen-thiet-ke-mot-lenh`** (T2, ~10 tiêu chí, CỘNG một lệnh). Một lệnh, chỉ đọc trừ khi được bảo ghi:
- dò thư mục giao diện và thư mục vendor (đọc danh sách bỏ qua của lint nếu kho có, như `VENDOR_DIRS`), đề xuất
  `design.surface_globs` liệt kê dương;
- sinh sẵn test bắt thư mục con không thuộc vùng cũng không thuộc vendor;
- đo đường nền: chạy bộ chấm S4 trên N PR gần nhất (base…head), in số vòng đỏ và lý do theo loại (nợ có sẵn · chú thích ·
  vi phạm thật);
- in bậc kèm bảng tác dụng theo loại tệp (K4), và bản nháp ghi chú nhận cho kho.
Người hưởng: kho mới bật nền thiết kế; invest và crm khi nâng bậc. Chiều đỏ: kho có thư mục vendor mà lệnh không trừ →
đỏ đúng tên; kho không có giao diện → M0, im.

### Mốc 2 — «S4 chỉ bắt điều vòng gây ra» (sau 10 vòng DO1)

**DFK2 `s4-nen-thiet-ke-cham-phan-doi`** (T2, ~10 tiêu chí). Bốn việc cùng một kết quả:
- khoá trừ trong vùng (`!glob`; hôm nay một dòng `!` không khớp tệp nào nên vô hại với cách đọc cũ) — K1;
- chấm dòng thêm/đổi trong diff thay vì cả tệp — K2;
- bỏ qua hex trong chú thích — K3 (mang `stripNoise` của Design OS);
- chú thích miễn trừ trong tệp, bắt buộc ghi lý do (mang từ Design OS, ~157 dòng) — cho tệp được phép như màu WebGL.
Thước: 10 vòng đường nền invest 2/10 đỏ oan về 0/10 mà kho không phải dọn tay; vòng thêm hex thật vẫn đỏ.

### Mốc 3 — «Đo tri thức trước khi nạp thêm» (song song Mốc 2)

**DFK3 `do-doc-tri-thuc-s1`** (T2, ~8 tiêu chí). Mang hook trace và lệnh tổng hợp của Design OS (2 tệp, ~300 dòng,
không phụ thuộc ngoài), đổi chỗ ghi về thư mục lượt chạy (luật «không bút» của kit). `usage-report.md` có trường «tri thức
đã đọc / đã dùng trước lần sửa đầu»; kho tắt được việc nạp. Người hưởng: mọi kho bật tri thức (~9,5k token mỗi vòng).

### Chân trời — mở khi có số

| Mã | Việc | Mở lại khi |
|---|---|---|
| DFK-C1 | Bộ đọc JSX/Tailwind cho S4 trên `.tsx` + luật lệch token (Design OS có bộ đọc ~630 dòng, chưa có luật) | 10 vòng DO1 xong và số cho thấy regex hex bỏ sót hoặc bắt nhầm |
| DFK-C2 | Lệnh chung CSS → `tokens.json` (Design OS có, ~2.400 dòng, một lần dùng thật) | bộ sinh của invest chạy hết 10 vòng và một kho thứ hai cần |
| DFK-C3 | Sinh sổ thành phần từ mã (upstream không có) | hàng M2 của invest xong và đo được giá trị `reuse-plan check` |
| FL-C1 | Chấm `ui gate` ở S4 (giữ) | như cũ; bằng chứng hôm nay: 52/747 trang qua, trùng design-gate |

### Không mang sang

`design-os-designer` (trùng design-pass/ux-ui-craft, chưa có bằng chứng) · `ds a11y` (nhiễu) · `scan` (mù khi giao diện
không ở gốc kho; kit đã có `surface_globs`) · `registry register` (thủ công, có lỗi im) · `ds-usage-lint` (chỉ HTML,
trùng) · pass dựng trang của `tell-lint` (trùng impeccable) · nạp thêm tri thức (đo trước, Mốc 3).

### Hạt giống (sổ, chưa vào lộ trình)

- 10 tệp vendored mồ côi (1.459 dòng) chỉ còn để phép kiểm đảo-vá đối chiếu — xét TRỪ khi đổi hợp đồng nhập.
- Bộ nghe kênh liên máy chết khi app khởi động lại (cả MBP lẫn M5, 29/10); M5 đọc #308 sai vì tham số sắp xếp bị API bỏ
  qua — gói dieu-phoi nên có một lệnh nghe kênh đọc theo mốc thời gian, và `tiep-tuc` giăng lại nó.
- Kênh công khai chặn tin có chi tiết kho tiêu thụ — cần một chỗ riêng tư cho chi tiết (chủ kho chọn).
- Ba lỗi điều phối từ invest 27–29/10: bàn giao kẹt đơn xin chưa cấp; `ban-giao-xong --wip` cuốn tệp chưa theo dõi;
  dừng-vá đếm lượt chấm hỏng vì hạ tầng.

## 4. Thứ tự và giá

| Thứ tự | Hàng | Phụ thuộc | Ước giờ máy |
|---|---|---|---|
| 0 | Mốc 0 | — | < 1 giờ |
| 1 | DFK1 | bản vá TC đã cắt | 4–6 giờ |
| 2 | DFK3 | — (song song DFK1) | 3–5 giờ |
| 3 | DFK2 | DFK1 gộp; phát hành sau 10 vòng DO1 | 4–6 giờ |

Ba hàng ≈ một mốc phát hành sau bản vá TC, chạy được thành một đợt hai dãy (DFK1→DFK2 · DFK3).

## 5. Mã của bản phạm vi (máy đọc)

Mốc 0 (tên gọi) là việc tài liệu T1, đi cùng PR cắt bản vá TC, nên không có mã ở đây. Mục «Không mang sang» và «Hạt
giống» không phải mã.

<!-- <<<PHAM-VI-MA -->
```
dot: design-floor-kho-moi-2910
dang: lan-va
nguon: acceptance-gate-kit-tri-thuc:wiki/chu-de/design-floor.md#bd10fff5b42fcb6af06e3ce27cf6cd59afac196a

- `BH1` — lệnh khởi tạo dò thư mục giao diện và thư mục vendor, đề xuất design.surface_globs liệt kê dương
- `BH2` — lệnh khởi tạo sinh sẵn test bắt thư mục con không thuộc vùng cũng không thuộc vendor
- `BH3` — đo đường nền: chạy bộ chấm S4 trên N PR gần nhất trước khi bật, in số vòng đỏ và lý do theo loại
- `BH4` — in bản nháp ghi chú nhận cho kho mới bật nền thiết kế
- `K4` — bảng bậc M0–M3 nói tác dụng theo loại tệp; bộ đọc bậc in đúng tác dụng với kho .tsx
- `K1` — khoá trừ trong vùng giao diện (!glob)
- `K2` — S4 chấm dòng thêm/đổi trong diff thay vì cả tệp
- `K3` — S4 bỏ qua hex trong chú thích
- `MT1` — chú thích miễn trừ trong tệp, bắt buộc ghi lý do (mang từ Design OS)
- `K5` — đo tri thức S1 đã đọc và đã dùng trước lần sửa đầu, kho tắt được việc nạp
- `CH1` — bộ đọc JSX/Tailwind cho S4 trên .tsx kèm luật lệch token
- `CH2` — lệnh chung biến biến CSS thành tokens.json
- `CH3` — sinh sổ thành phần từ mã của kho
```
<!-- PHAM-VI-MA>>> -->
