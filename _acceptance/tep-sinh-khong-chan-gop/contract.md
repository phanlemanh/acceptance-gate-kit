---
schema_version: 1
feature: Gộp nhánh chính vào nhánh PR không dừng ở PRODUCT-MAP.md hay LO-TRINH.html ở kho đã bật, và bản vẽ sai sau gộp vẫn bị --check bắt
slug: tep-sinh-khong-chan-gop
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli, docs]
status: approved
design_doc: _acceptance/tep-sinh-khong-chan-gop/design.md
approved_by: Manh Phan
approved_at: 2026-10-30T02:02:42Z
---

# Acceptance Contract: tep-sinh-khong-chan-gop

## Context

Gốc: onehub-invest/_acceptance/lo-trinh-2310/ — đợt Điều phối – Thợ `dieu-phoi-dot0-cam-mau` (25–26/10) gần như mỗi lần
gộp xung đột ở hai tệp sinh; kho thứ nhất là crm 16/10 (PR #432 gộp lại ba lần trong một giờ). Ô
`_acceptance/tep-sinh-khong-chan-gop/opportunity.md` (Cổng Đáng build 25/10), hàng TC3 của `docs/plans/lo-trinh-kit.json`;
hạt giống 16/10 đề xuất 1 và hạt giống 26/10 mục 1. AC-6 là mục c2 của M5 ở kit #308 (29/10) — Hỏi-1 ở Cổng Phạm vi; cách đọc vế reality của ngưỡng ô
— Hỏi-2 (mục Đường đo).
Thiết kế: design doc ở frontmatter.

Thuật ngữ:
- **khối bật** = khối máy đọc `GITATTR-TEP-SINH` trong `GUIDE.md`: hai dòng thuộc tính và một dòng lệnh cấu hình driver.
- **kho thử** = kho git do code sinh trong lượt ở thư mục tạm, có `_acceptance/config.yaml` khai `lo_trinh.tep` và
  `t1_skip_globs` phủ hai tệp sinh, một tệp lộ trình hai hàng, mỗi tệp sinh vẽ bằng `scripts/product-map.mjs` của cây
  đang đo.
- **bật đủ** = `.gitattributes` của kho thử bằng hai dòng thuộc tính của khối bật VÀ lệnh cấu hình của khối đã chạy trong
  kho thử.
- **sha ghim** = `c0cf637f88fa33a4f30ade8cd1ec68212dd2fa26` (gốc vòng; hằng trong tệp test), bản cũ rút bằng
  `git archive` trọn `scripts` và `lib`.

## Criteria

- AC-1: Given kho thử bật đủ, nhánh `a` thêm hồ sơ A rồi vẽ lại và commit, nhánh `chinh` thêm hồ sơ B rồi vẽ lại và commit
  (hai bản vẽ khác nhau ở cả hai tệp), When trên nhánh `a` chạy `git merge chinh`, Then thoát 0, không tệp nào ở trạng thái
  xung đột, `PRODUCT-MAP.md` và `LO-TRINH.html` giống từng byte bản của nhánh `a`; cùng ca với hai nhánh sửa hai hàng KHÁC
  nhau của tệp lộ trình → cũng thoát 0. Chiều đỏ: bản sao khối bật thiếu dòng `LO-TRINH.html` → hàm kiểm nêu
  «xung đột: LO-TRINH.html».
- AC-2: Given kho thử sau lần gộp của AC-1, When chạy `product-map.mjs --check` chưa vẽ lại, Then ở ca hai hồ sơ thoát 1,
  stderr nêu cả «PRODUCT-MAP.md lệch» lẫn «LO-TRINH.html lệch»; ở ca hai hàng lộ trình thoát 1, stderr chỉ nêu
  «LO-TRINH.html lệch», stdout «PRODUCT-MAP.md khớp»; vẽ lại rồi `--check` → thoát 0, bản đồ có cả A lẫn B. Chiều đỏ: bản
  sao `product-map.mjs` bỏ phép so `LO-TRINH.html` của `--check` → hàm kiểm nêu «hang-khac: --check xanh trên bản vẽ cũ».
- AC-3: Given cùng hai nhánh của ca hai hồ sơ ở AC-1, When gộp ở kho thử (i) không có `.gitattributes` và (ii) có hai dòng
  thuộc tính mà chưa chạy lệnh cấu hình, Then cả hai thoát 1 và danh sách tệp xung đột BẰNG [`LO-TRINH.html`,
  `PRODUCT-MAP.md`] — git y như hôm nay.
- AC-4: Given kho thử bật đủ, hai nhánh sửa CÙNG một hàng của tệp lộ trình rồi vẽ lại, When gộp, Then thoát 1 và danh
  sách tệp xung đột BẰNG đúng [tệp lộ trình] — driver không nuốt xung đột của nguồn. Chiều đỏ: bản sao khối bật thêm dòng
  `*.json merge=tep-sinh` → hàm kiểm nêu «xung đột nguồn bị nuốt».
- AC-5: Given cây kit sau vòng, When so `.gitattributes` với khối bật, Then mọi dòng thuộc tính của khối có trong
  `.gitattributes` và khối có đúng hai dòng thuộc tính cùng đúng một dòng `git config merge.tep-sinh.driver true`. Chiều
  đỏ: bản sao `.gitattributes` thiếu dòng `LO-TRINH.html` → hàm kiểm nêu «.gitattributes thiếu: LO-TRINH.html
  merge=tep-sinh».
- AC-6: (Hỏi-1) Given kho thử có thêm `_acceptance/rong/` rỗng và `_acceptance/rong2/figures/` rỗng (không tệp nào),
  When vẽ bản đồ và trang lộ trình, Then cả hai giống từng byte bản vẽ của cùng kho không có hai thư mục ấy, và `--check`
  trên bản đã commit thoát 0; đối chứng cùng kho: `_acceptance/la/` chỉ chứa `ghi-chu.txt` vẫn là «Hồ sơ hỏng» như bản ở
  sha ghim. Chiều đỏ: bản sao gỡ phép lọc ở bản đồ → hàm kiểm nêu «rong được xếp Hồ sơ hỏng»; bản sao gỡ phép lọc ở trang
  → «rong được đếm ngoài lộ trình».
- AC-7: Given ma trận viết sẵn ba kho thử không bật và không thư mục rỗng (có lộ trình · không lộ trình · có thư mục chỉ
  chứa tệp lạ), When vẽ bằng bản ở sha ghim và bản mới, Then `PRODUCT-MAP.md` và `LO-TRINH.html` giống từng byte; ca in
  «số hàng: 3» và assert bản cũ chưa có hàm của vòng. Chiều đỏ: bản sao mới thêm một dòng vào đầu bản đồ → danh sách lệch
  BẰNG cả ba hàng.
- AC-8: Given cây sau vòng, When chạy bốn suite của `feature_loop.suite_keys` và `product-map.mjs --root . --check`, Then
  mọi ca xanh và bản đồ khớp.

## Đường đo

- Vế ca dựng của ngưỡng ô (gộp không dừng · quên vẽ lại thì đỏ đúng tệp · không bật thì như cũ) → AC-1, AC-2, AC-3.
- Vế reality (Hỏi-2 — bản nháp theo khuyến nghị «không lần gộp nào phải gỡ xung đột tay ở tệp sinh»; chữ gốc «không lần
  gộp lại nào vì tệp sinh» chỉ đạt bằng đề xuất 2, design §4b): trong 14 ngày sau ngày kho bật (kho kit: từ lúc PR này
  gộp; kho tiêu thụ: theo bản phát hành), phát lại mọi commit gộp nhánh chính vào nhánh PR bằng `git merge-tree
  --write-tree --name-only <cha 1> <cha 2>` trên bản clone đã cấu hình driver — đếm lần phát lại liệt `PRODUCT-MAP.md`
  hay `LO-TRINH.html` là xung đột; mẫu số là số lần phát lại cùng cửa sổ, và cùng phép phát lại trên bản clone CHƯA cấu
  hình phải ra số khác 0 (chiều đỏ của chính phép đo). Không AC nào bảo đảm vế này — reality là đồng hồ cuối; chủ kho ghi
  bằng `/acceptance-gate:observed` (ADR 0020).

## Coverage

Quét hình thái preset test-matrix — bản đủ ở design doc §6. Bốn trục: A trạng thái kho · B nguồn hai nhánh đổi · C sau
gộp · D vết trong cây.

- A=bật × B∈{hồ sơ, hàng khác} → AC-1; × C → AC-2. A∈{không thuộc tính, chưa cấu hình} → AC-3. A=bật × B=cùng hàng → AC-4.
- Kit tự bật → AC-5. D → AC-6 (Hỏi-1). Đường đọc-cũ → AC-7. Bộ cũ → AC-8.
- [NGÀNH: gitattributes(5) — custom merge driver, driver `true`] · [NGÀNH: npm — lockfile xung đột gỡ bằng sinh lại].
- Later: job sau gộp tự vẽ trên nhánh chính (đề xuất 2 hạt giống 16/10, CỘNG). Never: `merge=union`.

## Out of scope

- `merge=union`, driver vẽ lại giữa lúc gộp, sửa `gop.mjs` để không tính tệp sinh là trùng tệp — design §3.
- Job sau gộp / hạ `--check` thành cảnh báo ở PR — CỘNG, chờ đo trên hai kho.
- Kit tự chạy `git config` thay người; bật ở kho tiêu thụ — kho nhận theo bản phát hành.
- Tệp sinh khác ngoài hai tệp của `product-map.mjs`.
- `CHANGELOG.md`, số phiên bản, cắt mốc — việc của chiến dịch phát hành.

## Notes

- Giới hạn khai: PR cắt trước khi `.gitattributes` có hai dòng vẫn xung đột ở lần gộp đầu (git đọc thuộc tính ở nhánh đang
  đứng); bản clone chưa chạy lệnh cấu hình xung đột như cũ; trên web GitHub PR vẫn báo xung đột ở tệp sinh (forge không
  chạy driver máy) — cố ý, giữ lưới của forge; PR chạm hồ sơ vẫn gộp nhánh chính vào và vẽ lại mỗi lần nhánh chính dời
  (chỉ hết dừng gỡ tay); thư mục chỉ chứa tệp bị bỏ qua (`.DS_Store`) vẫn là «Hồ sơ hỏng» (design §4).
