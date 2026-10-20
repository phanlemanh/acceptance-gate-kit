<!-- Sinh bằng lệnh: git show b2c058d8 -- CHANGELOG.md, giữ đúng các dòng commit ấy thêm (bỏ dấu + đầu dòng). -->
### Lệnh đóng cổng vẽ bản đồ bằng bản chép của kho

Gốc: crm-onehub 20/10, nhánh `feat/ngan-ban-ghi-giu-danh-tinh` — commit chữ ký `80464092f` vẽ lại `LO-TRINH.html`
bằng `product-map.mjs` của gói 2.32.0 đang cài, trong khi kho đã chép một bản mới hơn vào `scripts/`: khối dữ liệu
mất «mốc hiện», bốn bài của kho đỏ ở pre-push và `--check` của kho báo trang lệch (sửa tay ở `50fb669a3`). Nay khối
`MAP-STAGE` của bốn thân đóng cổng (`approve`, `signoff`, `observed`, phiên nghiệm thu) chạy `scripts/product-map.mjs`
của kho khi tệp có, chỉ rơi về bản của gói khi kho không chép — đúng luật «bản chép trong kho thắng bản cài» của
`/road-map:ghim`, vì CI của kho chạy `--check` bằng bản chép. Ca LT-16-ban-kho / LT-16-ban-goi.

**Ai bị ảnh hưởng:** kho đã chép bộ vẽ vào `scripts/` mà bản chép khác bản gói đang cài — nay commit đóng cổng khớp
CI của kho. Kho không chép: như cũ. Không cần làm gì khi nhận.

