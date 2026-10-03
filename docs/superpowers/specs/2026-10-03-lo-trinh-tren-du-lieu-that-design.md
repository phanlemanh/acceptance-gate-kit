# Lộ trình trên dữ liệu thật — thiết kế vòng sửa lát 1

Hồ sơ: `_acceptance/lo-trinh-tren-du-lieu-that/` · cơ hội đã ký build 03/10 · vật sửa tại chỗ của
lát 1 (`_acceptance/viec-ke-theo-plan/`, design `2026-10-02-viec-ke-theo-plan-design.md`).

## Vì sao có vòng này

Lát 1 chạy thử trên bản sao `_acceptance/` của crm `onehub` (`9660bf6c`, 156 hồ sơ) với lộ trình OKR
32 hàng cho: hàng kế «1» là hàng crm đã giao (slug khai sai, không có hồ sơ), và 11/18 cờ là nhiễu
vì kit so lời khai với hồ sơ đúng từng chữ tên ô. Khảo sát hành trình người dùng 03/10 thêm năm chỗ
chưa phủ (hình `figures/hanh-trinh-lo-trinh.html`). Năm hạng mục ở Cổng Đáng là đề bài; vòng này
không thêm lệnh, không ghi vào tệp ý định.

Phép thử rẻ của giả định 1 đã chạy trước khi viết tệp này (03/10, bản sao crm): áp luật nhóm bằng
tay lên 32 hàng, 11 cờ «khai Đã giao, hồ sơ Đã giao — chờ phiên nghiệm thu» biến mất; còn lại đúng
hai lệch thật (9c khai «Cổng Phạm vi», D khai «đang dựng», cả hai hồ sơ đã giao), cộng hàng «1» nay
được nêu tên. Bốn cờ thiếu câu giao và một mã trùng là khiếm khuyết thật của tệp kho, giữ nguyên.

## 1. So lời khai theo nhóm

Ba nhóm, tra bằng KHOÁ ô bản đồ (chữ rút từ `SECTIONS`, không chép tay):

| Nhóm | Ô |
|---|---|
| đã giao | `cho-nghiem-thu` · `da-ship` · `da-nghiem-thu` |
| đang làm | `cho-duyet` · `dang-dung` |
| chưa làm | «Chưa mở» · `can-nhac` · `sap-mo` |

Mọi ô khác (`xep-lai`, `da-bac`, `ngoai-pham-vi`, `hong`, «Không suy được») là nhóm riêng của chính
nó. Cờ «tệp khai khác hồ sơ» chỉ bật khi NHÓM của lời khai (sau quy đổi `tu_vung`) khác NHÓM của
ô hồ sơ. Chữ cờ giữ khuôn cũ (khai X, hồ sơ Y) để người đọc thấy cả hai chữ.

**Hàng tự khai đã giao hoặc đang làm mà không có hồ sơ.** Hàng có `slug`, thư mục hồ sơ không tồn
tại, và lời khai quy đổi được về nhóm đã giao hoặc đang làm → trạng thái «Không suy được», cờ
«hàng X: tự khai <khai> mà không có hồ sơ <slug>». «Không suy được» không thuộc nhóm chưa làm nên
hàng ấy không bao giờ là hàng kế, và hàng đứng trên nó không đủ điều kiện (thận trọng: kit không
chứng được nó đã giao). Khai nhóm chưa làm hoặc không khai → «Chưa mở», không cờ — phần này của
viec-ke-theo-plan AC-4 giữ nguyên; phần «slug dự kiến có lời khai đã giao thì im» được thay bằng
AC-2 của vòng này (con trỏ ở Notes của hợp đồng mới; hợp đồng cũ đã ký, không sửa). Lời khai ngoài
từ vựng trên hàng slug-không-hồ-sơ vẫn là «Chưa mở» và đã đếm ở dòng «tự khai ngoài từ vựng».

## 2. Nối hai chiều hàng ↔ hồ sơ

Chiều mới: ô cơ hội của hồ sơ mang `lo_trinh_ma: <mã>` (và `lo_trinh_tep: <tệp>` khi kho có nhiều lộ
trình — mở từ hàng thì CLI ghi cả hai). Bộ đọc quét `_acceptance/*/opportunity.md` một lần, dựng
bảng «mã → hồ sơ nhận». Một hồ sơ nhận một hàng của lộ trình T khi `lo_trinh_ma` bằng mã và
`lo_trinh_tep` vắng hoặc bằng T.

| Ca | Trạng thái hàng | Cờ |
|---|---|---|
| hàng không slug, đúng một hồ sơ nhận | từ hồ sơ đó (thôi «tin theo lời») | — |
| hàng không slug, ≥2 hồ sơ nhận | tin theo lời như cũ | «hàng X được nhiều hồ sơ nhận: a, b» |
| hàng trỏ slug S có hồ sơ, hồ sơ S ghi mã khác M | từ S | «hàng X trỏ hồ sơ S nhưng hồ sơ ghi hàng M» |
| hàng trỏ slug S, hồ sơ khác C nhận mã X | từ S nếu S có hồ sơ; S vắng thì từ C | «hàng X trỏ S nhưng hồ sơ C nhận hàng này» |
| hồ sơ C ghi mã M mà lộ trình không có hàng M | — | «hồ sơ C ghi lo_trinh_ma M — không có hàng M» |
| hồ sơ ghi `lo_trinh_tep` không nằm trong khoá | — | «hồ sơ C ghi lo_trinh_tep T — kho không khai tệp đó» |
| hồ sơ không ghi trường | như lát 1 | — |

**Thứ tự ưu tiên (một hàng ra đúng một trạng thái và đúng một cờ liên kết):** hồ sơ nhận qua mã
thắng lời tự khai. Hàng có slug S mà S vắng hồ sơ, đúng một hồ sơ C nhận → trạng thái từ C, cờ duy
nhất «hàng X trỏ S nhưng hồ sơ C nhận hàng này» — KHÔNG kèm cờ «tự khai mà không có hồ sơ» của §1.
Hàng (có slug hay không) mà ≥2 hồ sơ nhận → cờ «nhiều hồ sơ nhận»; trạng thái theo slug nếu S có hồ
sơ, còn lại theo luật §1 (không slug: tin theo lời; slug vắng: §1). Bộ vẽ và `--mo-o` (§4) đọc «hàng
đã có hồ sơ chưa» từ CÙNG một hàm, nên hai bên không thể nói khác nhau.

Cờ không gắn được vào một lộ trình cụ thể (tệp vắng, mã không ở đâu cả) đặt ở lộ trình ĐẦU theo
thứ tự khai. Hồ sơ cũ không phải sửa: thiếu trường là im. Hồ sơ được nhận qua `lo_trinh_ma` không
còn tính vào «vòng ngoài lộ trình».

## 3. Nhiều lộ trình mỗi kho

`lo_trinh.tep` nhận một chuỗi hoặc một danh sách YAML (khối `- a` hay dòng `[a, b]`). Bộ đọc
`lo-trinh-khoa.cjs` cắt đúng khối `lo_trinh:` ở cột 0 rồi đọc `tep` trong khối — không dùng bộ đọc
danh sách chung vì nó khớp mọi khoá thụt hai dấu cách ở bất cứ đâu (đo 03/10). Hàm mới
`cacTepTuConfig(text) → string[] | null`; `khoaTuConfig` giữ chữ ký, trả phần tử đầu. Tệp lặp trong
danh sách được gộp, kèm cờ «tệp lộ trình khai hai lần: T».

- **Một tệp**: `LO-TRINH.html` giống từng byte bản lát 1 — kho đang dùng không đổi trang.
- **Nhiều tệp**: trang mở bằng `<h1>Lộ trình</h1>`, mục lục, rồi mỗi lộ trình một `<section>` theo
  thứ tự khai với đủ khối của trang đơn (cấp tiêu đề hạ một bậc). Tệp lỗi chỉ tắt mục của nó.
- **Tra hàng**: `--hang <mã>` tìm qua mọi tệp; mã có ở ≥2 tệp → thoát 3, nêu từng tệp và cách gọi
  `<tệp>:<mã>`. Dạng `<tệp>:<mã>` luôn được nhận. Mẫu đối số S0 mở rộng cho dạng này (ký tự an
  toàn trong nháy đơn: chữ, số, `_ . - /`, một dấu `:`).

## 4. Mở việc từ hàng — qua Cổng Đáng

CLI: `lo-trinh.mjs --root . --hang <ref> --mo-o [--slug <s>] [--owner <o>]`.

- Hàng đã có hồ sơ (theo đúng hàm của bộ vẽ ở §2) → không ghi gì, in JSON
  `{"hoSo":"<slug>","moi":false}`, thoát 0. S0 đi tiếp như resume hồ sơ đó.
- Chưa có → slug = `--slug`, vắng thì `slug` của hàng, vắng nữa thì máy suy từ câu giao (bỏ dấu,
  `đ`→`d`, chữ thường, ký tự khác chữ-số thành `-`, sáu từ đầu) — tất định, in lại trong JSON.
  Thư mục đích đã có → thoát 2 nêu thư mục, không ghi. Ghi xong in `{"hoSo":"<slug>","moi":true}`.
- Bảng mã thoát là HỢP ĐỒNG giữa CLI và S0: 0 = hàng (JSON) · 1 = không phải hàng (kho chưa khai,
  không có mã) → đối số là mô tả việc · 2 = lỗi dùng/ghi → in nguyên, dừng · 3 = mã ở nhiều lộ
  trình → in nguyên, dừng. Bảng sống ở khối marker `S0-MO-O-THOAT` của SKILL và test đọc chính khối
  đó. Ghi `_acceptance/<slug>/opportunity.md`:
  frontmatter dựng từ khối `OPP-FRONTMATTER-TEMPLATE` của khuôn (đọc khuôn lúc chạy, không chép):
  `stage: discovery`, `decision`/`decided_by`/`decided_at` trống, `feature` = câu giao, cộng hai
  dòng `lo_trinh_ma`/`lo_trinh_tep` trước `---` đóng. Thân: «Vấn đề & ai gặp» = dòng nguồn (hàng,
  lộ trình, tệp) + câu giao + vì sao; «Ngưỡng chết / ngưỡng UAT» = bốn bullet của khuôn. Hàng có
  `bat_khi`: câu hỏi, SỐNG (= `bat_khi`) và CHẾT (phủ định của nó khi hết timebox) mang tiền tố của
  khối `OPP-DE-XUAT-PREFIX`; Timebox mang tiền tố + ngày của mốc có ngày đầu tiên chứa hàng, hàng
  không gắn mốc thì `…`. Không `bat_khi` → cả bốn `…`. Bộ quét chỉ xếp ô chờ Cổng Đáng khi ĐỦ bốn
  dòng (`lib/nguong-o-co-hoi.cjs`), nên hàng có `bat_khi` và mốc → chờ Cổng Đáng; thiếu một trong
  hai → đang cân nhắc, người điền nốt — máy không bịa hạn.
- Không bao giờ ghi vào tệp ý định.

feature-loop S0: đối số khớp mẫu → chạy MỘT khối lệnh (`S0-MO-O`) gọi `--mo-o`; ứng xử theo bảng
`S0-MO-O-THOAT`: `moi:false` → resume hồ sơ đó; `moi:true` → trình thẻ Cổng Đáng của ô và DỪNG —
Cổng Đáng là cổng đã có trong thiết kế, không phải lượt gọi mới; thoát 1 → mô tả việc; thoát 2, 3 →
in nguyên và dừng, KHÔNG coi đối số là mô tả việc.

`/acceptance-gate:start`: hàng kế là một dòng chọn được trong câu hỏi bước 4 (không thêm lối thứ tư
vào «bắt đầu việc mới»); chọn → `/feature-loop:feature-loop <hangKe.thamSo>`, kèm nhắc worktree như
vòng dở. `thamSo` là `<mã>` khi kho một lộ trình, `<tệp>:<mã>` khi nhiều.

## 5. Đường vào trang và thẻ máy dựng sẵn

`start-scan` trả `loTrinh = null | { trang, trangCo, ds: [...], dong: [...] }`. `ds` là mỗi lộ
trình một phần tử như khoá cũ (`tep ten loi hangKe hangTre tinTheoLoi tuKhaiNgoai co`, cộng
`hangKe.thamSo` và `mocKhongHang`). `dong` là CÁC DÒNG THẺ máy dựng sẵn — thân `/start` in nguyên,
không tự soạn (kit render, không soạn; và phép đo đo được đầu ra thay vì chỉ dẫn):

1. Mỗi lộ trình: tiêu đề `Lộ trình <tên>:` khi nhiều lộ trình; ba dòng cũ (hàng kế · hàng trễ · tin
   theo lời); dòng hàng trễ nối « (k/N mốc không gắn hàng nào)» khi k > 0; dòng cờ khi có cờ.
2. Luôn một dòng trang: `Trang lộ trình: [LO-TRINH.html](<đường tuyệt đối>)` khi tệp có; vắng →
   «Trang lộ trình chưa được vẽ — vẽ bằng: `node <đường bộ vẽ> --root .`».
3. Kho khai lộ trình mà bản đồ chưa bật (`map.enabled` false) → «⚠ Lộ trình đã khai nhưng bản đồ
   sản phẩm chưa bật — bốn lệnh đóng cổng sẽ không vẽ lại trang; bật bằng hai dòng trong
   `_acceptance/config.yaml`».

`PRODUCT-MAP.md` của kho khai lộ trình có thêm một dòng `Lộ trình: [LO-TRINH.html](LO-TRINH.html)`
dưới tiêu đề. Kho không khai: bản đồ và JSON quét giống từng byte bản trước.

Mốc không gắn hàng (khảo sát mục 6): trang ghi «k mốc không gắn hàng nào — không tính trễ được»;
kit không tự gắn. Sửa tệp ý định làm CI đỏ tới khi vẽ lại (mục 7): giữ, GUIDE ghi một đoạn.

## Không làm

Lệnh mới · ghi tệp ý định · lát 2 · tự gắn mốc · đổi hành vi CI khi tệp ý định đổi · migrate hồ sơ
cũ sang `lo_trinh_ma`.

## Hạng

T2: `scripts/lo-trinh.mjs`, `scripts/lo-trinh-khoa.cjs`, `scripts/product-map.mjs`,
`scripts/start-scan.mjs`, `commands/start.md`, SKILL feature-loop, GUIDE, test. Không chạm `lib/**`,
hook, lưới trước-merge. Tệp chép sang kho tiêu thụ không đổi danh sách.
