# Thiết kế — Kho mới cài gói road-map có sẵn tệp lộ trình (RM4)

Hồ sơ: `_acceptance/kho-moi-cai-goi-road-map/` · hàng RM4 của `docs/plans/lo-trinh-kit.json` · nấc 2 của ADR 0025 ·
dựng trên đỉnh nhánh RM2 (`ap-chinh-sach-lo-trinh`, đã ký 15/10).

## Một phút

Hôm nay một kho muốn có lộ trình phải làm tay năm việc, và bước kiểm CI vẫn đỏ cho tới khi làm đủ (số đo trước ở
ô cơ hội). Vòng này thêm MỘT bước vào lệnh khởi tạo kho: kho đã cài gói `road-map` ở phạm vi kho thì lần chạy
`/acceptance-gate:acceptance-init` (lần đầu, hoặc chạy lại trên kho đã có cấu hình) tự làm đủ năm việc. Kho không cài
gói thì bước ấy in một dòng và không đổi byte nào.

## Điểm vào

Bước mới `5d` của `commands/acceptance-init.md`, sau `5b` (khai plugin). Bước `1` (cấu hình đã có) nay chạy `5b`, `5d`
và `6`. Lệnh của bước nằm trong một khối máy đọc `INIT-LO-TRINH`:

```
node "${CLAUDE_PLUGIN_ROOT}/scripts/lo-trinh-khoi-tao.mjs" --root <path> --write
```

Không thêm lệnh người mới (acceptance-init đã là lệnh khoá — ADR 0002 không đổi, danh sách khoá P32 không đổi).

## Điều kiện bật

`enabledPlugins["road-map@<tên marketplace>"] === true` trong `.claude/settings.json` của kho — tệp đội commit. Tên gói
và tên marketplace rút từ `.claude-plugin/marketplace.json` (cùng nguồn với `plugin-declare.mjs`), không viết cứng.
`.claude/settings.local.json` (tệp riêng của một người, không commit) và phạm vi người dùng (`~/.claude/settings.json`)
KHÔNG tính: cả hai là lựa chọn của một người, không phải của kho (ADR 0025). Ca chồng: `settings.json` khai `true` mà
`settings.local.json` khai `false` → vẫn bật (kho đã chọn; tệp local chỉ đổi phiên của người đó).

| Trạng thái | Kết quả |
|---|---|
| không có tệp · có mà không bật · khai `false` | thoát 0, một dòng «kho chưa cài road-map ở phạm vi kho — không tạo lộ trình», 0 byte |
| chỉ bật ở `settings.local.json` | thoát 0, cùng dòng + «cài với --scope project để cả kho dùng», 0 byte |
| bật ở `settings.json` (local khai gì cũng vậy) | chạy năm bước |
| `settings.json` không phải JSON | thoát 3, một dòng nêu tệp, 0 byte |

## Năm bước — mỗi bước tự kiểm trạng thái của mình (hội tụ)

Mỗi bước nhìn trạng thái kho và chỉ làm phần còn thiếu, nên chạy lại sau một lần đứt ở BẤT KỲ điểm nào sẽ hoàn tất
phần còn lại (kết quả bằng lần chạy liền một mạch), và chạy lại trên kho đã đủ thì 0 byte đổi.

0. **Phép kiểm trước mọi lần ghi.** Kho chưa khai `lo_trinh.tep` mà đích mặc định `docs/plan/lo-trinh.json` (đường
   GUIDE §5 đã ghi) đã có tệp → thoát 2 nêu tệp, 0 byte (không ghi đè, không đoán đó có phải lộ trình).
1. **Khoá cấu hình.** Chưa khai → `lo_trinh.tep: docs/plan/lo-trinh.json` thêm qua `config-patch.mjs` (đường ghi cấu
   hình duy nhất của kit). Khoá đi TRƯỚC tệp: đứt sau bước này thì lần chạy lại thấy «đã khai, tệp vắng» và tạo tệp.
2. **Miễn trừ.** `risk_tiers.t1_skip_globs` chưa có glob nào phủ `LO-TRINH.html` (khớp bằng đúng `match_globs` của
   lưới trước-merge, như `product-map.mjs --check`) → thêm `- "LO-TRINH.html"` qua chế độ mới `--append` của
   `config-patch.mjs` (nối một mục vào danh sách khối; khối vắng thì tạo khối; mục đã có → từ chối). Đã phủ (vd
   `"*.html"`) → không thêm. Tập đường được miễn sau khởi tạo = tập trước cộng đúng `LO-TRINH.html`. Không để lại
   `config.yaml.bak`.
3. **Tệp lộ trình.** Mỗi tệp khai mà vắng thì tạo; có rồi thì để nguyên. Nội dung:
   `{"schema":1,"ten":"Lộ trình <tên kho>","ghi_chu":"<cách thêm việc>","moc":[],"hang":[],"chan_troi":[],"da_bac":[]}`
   — mọi khoá gốc là khoá của khuôn `lo-trinh-template.json` trừ `ghi_chu` (khoá cấp tệp lộ trình kit cũng dùng);
   ghi bằng `ghiLoTrinh` của `scripts/lo-trinh.mjs` (bộ ghi của RM2) nên ở dạng chuẩn `dangChuan`, và bộ tự áp chính
   sách của RM2 chạy được trên nó (đo bằng chính đường `--ap --write`). `<tên kho>` = `tenKho(root)`.
4. **Bản chép CI.** Chỉ khi kho đã chép lớp CI (`scripts/product-map.mjs` có mặt): mỗi mục của `INIT-CI-COPY-LIST`
   mang dấu `[only-if-declared: lo_trinh]` (rút từ khối, không danh sách tay) mà đích vắng → chép từ gói, giống từng
   byte. Đích có mà khác bản gói → không ghi đè, một dòng «bản chép khác bản gói — chép lại theo đợt phát hành».
   Kho chưa chép lớp CI → bỏ bước, một dòng.
5. **Trang.** `LO-TRINH.html` vắng → vẽ bằng ĐÚNG hàm của bản đồ: `product-map.mjs` export thêm `veTrangLoTrinh(root)`
   (phần thân hiện có, tách ra — `product-map` main gọi lại nó, không đổi hành vi) rồi ghi. Trang có rồi → để nguyên
   (khởi tạo không bảo trì trang). Kho đã bật bản đồ (`t1_skip_globs` có `PRODUCT-MAP.md` — vị từ `mapTracked`) mà
   `PRODUCT-MAP.md` vắng → vẽ luôn bằng `renderProductMap`: kho mới theo khuôn khởi tạo ở đúng trạng thái này tới lần đóng
   cổng đầu và `--check` đỏ vì nó (sửa ở S3 — bản duyệt nói «không ghi PRODUCT-MAP.md»). Kho chưa bật bản đồ không nhận tệp.

Kết: một dòng tóm tắt việc đã làm + «commit các tệp này». Kho chưa bật bản đồ sản phẩm (`t1_skip_globs` không có
`PRODUCT-MAP.md`) → thêm một dòng vàng: bốn lệnh đóng cổng sẽ không vẽ lại trang (cờ thẻ start đã có nói cùng điều).

## Vòng đầu tiên trên kho vừa khởi tạo

Lộ trình 0 việc: dòng «Hàng kế» của thẻ khởi động hôm nay in «chưa có hàng đủ điều kiện mở» — đúng mà không chỉ việc
kế. Đổi riêng ca 0 việc thành «Lộ trình chưa có việc nào — thêm việc bằng skill cắt lượt (/acceptance-gate:cat-luot),
rồi mở bằng /feature-loop:feature-loop <mã>». Lộ trình có việc mà chưa việc nào đủ điều kiện giữ câu cũ từng byte.
Sau khi một hàng vào tệp (cắt lượt ghi), `/feature-loop:feature-loop <mã>` mở ô cơ hội như mọi kho.

## Cân trên mọi kho (luật 26/09)

- Kho không cài `road-map` (14/14 kho trên máy hôm nay): bước in một dòng, 0 byte — đo trên bản sao cây của từng kho.
- Kho đã có lộ trình (kit, crm) mà sau này cài `road-map`: bước 1–3 thấy đã đủ; bản chép khác thì chỉ báo; trang có
  rồi thì để nguyên → 0 byte.
- `config-patch.mjs` thêm chế độ, không đổi chế độ cũ. `product-map.mjs` tách hàm, không đổi đầu ra (bộ kiểm hiện có
  của bản đồ và trang giữ xanh). Cả hai là tệp kho tiêu thụ chép → ghi ở ghi chú phát hành «chép lại».

## Không làm

- Nấc 3 (mở vòng từ mô tả tự do thì máy thêm hàng) — Hỏi-1 ở Cổng Phạm vi.
- Nấc 4 (chặn) — RM5.
- Bật bản đồ sản phẩm cho kho chưa bật · cài gói `road-map` hộ kho · khai `road-map` trong `plugin-declare.mjs`.
- Lệnh `/road-map:khoi-tao` riêng (sẽ là CỘNG một lệnh khoá mới — ADR 0002 + P32).
- Hàng mẫu trong tệp khởi tạo (sẽ hiện thành «hàng kế» giả trên kho thật).

## Tệp chạm

`scripts/lo-trinh-khoi-tao.mjs` (mới) · `scripts/config-patch.mjs` (`--append`) · `scripts/product-map.mjs` (tách
`veTrangLoTrinh`) · `scripts/lo-trinh.mjs` (một câu thẻ start ca 0 việc) · `commands/acceptance-init.md` (bước 5d +
bước 1) · `road-map/README.md` (một dòng «Cài cho một kho») · `tests/scripts/kho-moi-cai-goi-road-map.test.mjs` (mới) ·
`_acceptance/config.yaml` (khoá eval) · `GUIDE.md` (đoạn lộ trình: đường khởi tạo).
