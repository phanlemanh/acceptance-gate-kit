# Hạt giống — đường nền chạy trên worktree tạm ở HEAD, bật theo lựa chọn

Gốc: acceptance-gate-kit/_acceptance/nen-khong-tinh-tep-cua-vong/ — lối A2 tách khỏi vòng ngày 14/10
(Điều phối M5: «CỘNG cần phê riêng + giữ đơn giản; phần lọc tự nó đã trả gần hết giá»)

## Ý

Khoá `feature_loop.duong_nen_cay: head` (vắng = tại chỗ như nay): chân suite + chân lưới của
`feature-loop/scripts/duong-nen.mjs` chạy trong `git worktree add --detach` ở HEAD, tái dùng cách dựng
của lane baseline S4 (`feature-loop/workflows/acceptance-verify.js`, khối BASELINE-LENH: khoá
nguyên tử, trap dọn, quét mồ côi, symlink `node_modules` maxdepth 3 + `.env`/`.env.local`). Phiên
viết gì vào cây gốc trong lúc nền chạy, nền không thấy.

## Phần A không chữa (vì sao hạt giống tồn tại)

- 3 dòng `DO SAN` ở kit `bang-ngoai-n-co-can-cu` (14/10): P122, P126, `product_map` đỏ vì hồ sơ mới
  chưa lên bản đồ — mã thoát, không phải đường tệp, nên bộ lọc theo slug không chạm được.
- Đo 14/10 trên lịch sử kit: 20 hồ sơ có `DO SAN executors.script.product_map` lúc chạy nền; chạy lại
  `product-map.mjs --check` trên `git archive <sha>` của chính lượt đó → 13/20 XANH (đỏ do hồ sơ của
  vòng viết dở), 7/20 đỏ thật ở HEAD. Các `DO SAN` corpus khác (`plugins_vung_*`, 27 hồ sơ có `DO SAN`
  nói chung) chưa tách thật/giả.
- Ca mới cùng lớp, ngay ở đường nền của chính hồ sơ này (14/10 07:30→08:17Z, sha `ee004af5`): P122,
  P126, `product_map` và VC8 đỏ vì ô cơ hội + hạt giống của vòng đã commit mà bản đồ chưa vẽ lại — đỏ
  của vòng nằm TRONG cây đã commit, nên worktree ở HEAD cũng không chữa; lối chữa đúng tầng là vẽ lại bản
  đồ trước khi chạy nền.
- 29/233 dòng `CAY BAN` lịch sử là mã / tài liệu / bản mẫu design-pass do phiên viết song song,
  đường không mang slug (đo 14/10, 8 hồ sơ).

## Đã đo, không được quên khi mở

Mặc định worktree+symlink vỡ 4/8 kho (crm Turbopack · artifact-platform `apps/web/.env.local` ·
media-library node_modules tầng 4 · oneflow pnpm ghi đè `.modules.yaml` gốc). Vì thế chỉ bật theo
lựa chọn; kho đã đo «đủ»: acceptance-gate-kit, floorplanstudio, map, mapposter (map/mapposter: dev
server :5173 đang chạy thì Playwright đo cây gốc). Giới hạn chung: gói workspace giải qua symlink về
`packages/*` của cây gốc.

## Ngưỡng mở

≥1 vòng sau khi lối A lên `main` mà nền vẫn đỏ giả vì tệp phiên viết song song (DO SAN corpus hoặc
dòng `CAY BAN` không mang slug) và phải chạy lại trọn nền. Khoá là CỘNG — owner phê đích danh.
