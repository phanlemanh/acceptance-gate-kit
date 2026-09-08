# Đúc kết sau vòng `lop-bang-chung-nhin-thay` — để kit đúng north star, đúng mục đích, rẻ giờ và token

Ngày 08/09/2026. Nguồn: hồ sơ tổng kết cùng ngày (§2–§9, mọi số đo từ bản ghi phiên),
quét xuyên repo (§8), ba thảo luận với owner về so-từ, ý-định và sai-mục-đích. Văn bản này
là **đầu vào gọi tên** cho mốc kế theo luật CLAUDE.md: meta-work mặc định đóng băng, chỉ mở
khi owner gọi tên, giữa hai mốc tối đa một vòng meta.

## 1. Bức tranh bằng số

| Thước của kit | Vòng này | Trần / kỳ vọng | Xuyên repo |
|---|---|---|---|
| Làm-xong → quyết-được | 8h43 | «một phút đọc, vài phút quyết» | — |
| Lượt gọi người / vòng | 15 | 4 (T3) | — |
| Vòng bị hạ tầng đốt | 5 | 0 | hạn mức phiên 110 lần, null-crash 24 lần trên máy |
| Token | 578M, 93% cache-read | — | 94–98% cache-read ở mọi repo; oneflow 22,5 tỉ |
| Round S4 | 3 (+1 lượt chỉ-TRỪ) | 1 | TB 2–3,3; có hồ sơ 8–11 round |
| Finding về thước vs về vật | 6 trong hợp đồng (100% về thước); 4 lỗi hành vi thật ra Known limits | ngược lại | «Hình dạng» ở mọi repo |

## 2. Ba chẩn đoán gốc, trace về north star

**G1 — Thước đo lệch mục đích.** North star: *máy làm và tự chứng minh* — thước phải so
*điều đã hứa* với *điều máy làm*. Thực tế vòng này: AC viết như ca kiểm nên «trong hợp
đồng» ≡ «về cái thước»; eval `cmd` là cả suite nên sáu eval không phân biệt được nhánh với
base; stale đo «cây đổi» không đo «rủi ro đổi»; W6/W8-token so chữ với danh sách. Hệ quả
đo được: hai trong ba lượt vá chỉ sửa test, bốn lỗi hành vi thật không được sửa, ~2 giờ
suite lặp, 51 phút ghim lại vô thông tin, ~6M token bọc backtick.

**G2 — Hình thức phiên đắt hơn việc.** North star: *giờ-kit là chi phí*. Một phiên 13
tiếng đọc lại 571K ngữ cảnh mỗi lượt, nhiều lượt chỉ để nhận thông báo; 327M cache-read ở
phiên chính. Mẫu này ở mọi repo (94–98%).

**G3 — Người bị gọi ngoài thiết kế.** North star: *người ở biên, xuất hiện ở đánh-đổi thật*.
15 lượt gõ, chỉ 3 là cổng thiết kế và 1 là dừng theo luật; 11 lượt còn lại do hạ tầng (2),
danh tính (2), máy im lặng khi chờ (5), bàn giao hỏi menu (2).

## 3. Đề xuất — xếp theo ai quyết, ghi rõ CỘNG hay TRỪ

### A. Máy tự sửa nếp, ngay vòng kế, không đụng luật

| # | Việc | Cắt gì (ước lượng từ số đo) | Nguyên tố |
|---|---|---|---|
| A1 | **Chia phiên theo giai đoạn**: điều tra · S1→Cổng Phạm vi · S3 · điều phối S4 · Cổng Bằng chứng→S5. Mỗi phiên khởi từ hồ sơ trên đĩa | cache-read phiên chính 327M → ~80–120M | 2 (máy tự chứng minh rẻ hơn) |
| A2 | Khi chờ tiến trình nền: **một** lượt chờ chặn, không canh song song, không trả lời thông báo | bớt ~1/3 lượt gọi model của phiên chính | 2 |
| A3 | **AC viết theo hành vi công cụ**, chi tiết ca kiểm nằm ở `expected` của eval | lỗi hành vi thật rơi vào «trong hợp đồng» → được vá thay vì ra Known limits | 1, 2 |
| A4 | **`cmd` của eval = ca của tính năng** (`LNT_CASES=… node …`), suite chỉ ở `suite_keys` | mỗi round bớt ~10 phút; eval phân biệt được nhánh/base | 2 |
| A5 | **Tự-soi phép đo ở S3** theo sáu hình dạng đã có tên trước khi khai `implemented` (prompt nội bộ, không cần sửa kit) | 3 round → 1: ~120M token, ~4 giờ, 2 lượt gọi người | 2 |
| A6 | Xếp S4 nặng **tránh sát mốc reset** (13:30 · 22:00 · 08:30) | tránh ~4,5 giờ đứng im | — |
| A7 | Danh tính: `--as "Manh Phan"` hoặc đồng bộ `git config user.name` với `signoff.approvers` | −2 chạm | 3 |
| A8 | Khi có phiên khác trên cùng kho: worktree riêng, kiểm nhánh trước mỗi commit; không ghép `grep -n` với `git commit` | tránh ghim lại và commit hụt | — |

Ước lượng nếu chỉ làm A ở vòng T2 kế (nợ 7 mục): token ~578M → ~150–200M, giờ ~11h47 → ~4h,
lượt gọi người 15 → ~5–6. **Đây là ước lượng, chưa đo**; vòng T2 kế chính là chỗ đo nó — đó
là neo ngoài của cả đúc kết này.

### B. Kit — một vòng meta duy nhất giữa hai mốc, chờ owner gọi tên

Mọi mục là TRỪ hoặc sửa răng đang đo sai chỗ; không mục nào thêm cổng người.

| # | Việc | Bằng chứng | Nguyên tố |
|---|---|---|---|
| B1 | **Null-guard `acceptance-verify.js`**: agent chết → BLOCKED có tên, không ném TypeError | 24 lần sập trên máy | 2 |
| B2 | **W6 thu về Criteria** + tokenizer coi định danh gạch nối là một từ + `_Allow_` cho từ đa nghĩa (`thẻ`, `hook`); **bỏ nhánh token-lạ của W8** | kit 127 dòng W6 không ai xử; W8-token 140 dòng giả ở artifact-platform | TRỪ |
| B3 | **Stale theo `paths:`** của eval thay vì cả `tests/` | 3 ghim lại/ngày, 0 thông tin | 2 |
| B4 | **Triage xếp theo tác hại**: lỗi hành vi thật trong file của hồ sơ (`paths`) vào «vá», lỗi thước có thể vào Known limits; thẻ Cổng 2 đặt lỗi hành vi lên trên lỗi thước | 4 lỗi hành vi thật ra Known limits, 6 lỗi thước ăn 2 round | 3 (người ở đánh-đổi thật) |
| B5 | Làn «conventions» chỉ chấm file chữ có đổi so round trước | 13/34 finding về chữ, lặp mỗi round | 2 |
| B6 | S5 mặc định PR, không menu | −1 lượt | 3 |
| B7 | **`loop-health`** từ `sweep.mjs` + `tokproj.mjs`: ba dòng số bằng máy mỗi mốc, xuyên repo | ba dòng số đang đếm tay | 2 |

### C. Nợ đã khai, không phải đề xuất mới

Hợp đồng T2 docs+tests cho 7 mục Known limits trước mốc 2.10.0; cài bản kit mới ở oneflow
(ca gốc của W8) để ngưỡng đếm bắt đầu có số.

## 4. Thứ tự làm

1. Vòng T2 nợ (C) chạy **với nếp A** — vừa trả nợ vừa đo A. Không mở B trước khi có số này.
2. Đọc ba dòng số của vòng đó. Nếu A cắt được như ước lượng, mở **một** vòng meta gộp B1–B7
   (B2, B3, B4 là lõi; B5–B7 đi kèm rẻ). Nếu A không cắt được, đúc kết này sai và phải xem lại
   trước khi chạm luật.
3. Mốc 2.10.0 ghi ba dòng số của cả hai vòng vào hồ sơ mốc, gọi tên nhát cắt kế.

## 5. Một câu

Kit đang trả giá không phải vì kiểm nhiều, mà vì kiểm **chữ với danh sách** và **cây với
sha** thay vì **lời hứa với hành vi**; và vì máy chạy trong một phiên dài rồi hỏi người
những câu máy tự trả lời được. Cả hai đều sửa được bằng nếp trước, bằng luật sau, và có
số để biết đã sửa xong chưa.
