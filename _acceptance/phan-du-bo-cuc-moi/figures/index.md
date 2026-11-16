# Hình tại Cổng Phạm vi — phan-du-bo-cuc-moi

| Điểm | Đếm | Hình |
|---|---|---|
| Bộ dịch đường (d-…-2): đường phẳng + cây → vai → tên theo bảng tên của cây → thư mục nguồn theo tệp khai chợ của cây | 4 bước nối tiếp | `bo-cuc-dich.html` |
| Hỏi-1 cắt cụm (d-…-10): vòng này 141 khoá · vòng kế 272 khoá, hay một vòng 413 khoá | 2 nhánh | `cat-cum.html` |
| Hỏi-2 gom giới hạn (d-…-11) | 3 lối, mỗi lối một câu | dưới ngưỡng: 1 bước, không nối tiếp |
| K3 lối (a) (d-…-4) | đã chốt ở Cổng Đáng | dưới ngưỡng: không còn rẽ |
| Đo kho mới không luật đường bước 6 (d-…-6) | 1 bước + đo chéo tay | dưới ngưỡng |

## Đề bài

**bo-cuc-dich** — sơ đồ luồng, trái sang phải. Nút: «đường phẳng (vd `dieu-phoi/scripts/x.mjs`, `scripts/y.mjs`)» → «tiền tố
là gói phẳng? → vai (bảng bố cục phẳng, đóng băng)» / «tiền tố là thư mục lõi → vai `loi`» / «còn lại (`tests/`,
`_acceptance/`, `docs/`) → giữ nguyên» → «tên hiện hành theo `lib/ho-goi.cjs` CỦA CÂY ẤY» → «thư mục nguồn theo
`.claude-plugin/marketplace.json` CỦA CÂY ẤY» → «đường ở cây». Nhánh phụ: «đã là `plugins/…` → đi qua không đổi (lũy đẳng)».
Ba loại cây ở trên cùng: cây đang đứng · commit lịch sử (`git show`) · bản sao gốc gói. AC liên quan: AC-2.

**cat-cum** — hai cột so sánh. Cột trái «Cắt (máy khuyên)»: vòng này = bộ dịch + K2 27 + K3 20 + SP 4 + K4-SC 77 + K4-PL 13
= 141 khoá, ≈ 25 tệp kiểm; vòng kế = K4-LT 174 + K4-TB 98 = 272 khoá, 25 tệp, dùng bộ dịch đã gộp. Cột phải «Một vòng»: 413
khoá, ≈ 50 tệp kiểm, một PR, một lượt ghim lại. Trục dưới: mốc 04/12/2026. AC liên quan: AC-9, AC-10 (dời nếu cắt).
