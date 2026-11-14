---
schema_version: 1
slug: goi-cheo-loi-dieu-phoi
feature: «Plugin lõi và feature-loop chạy đúng ở cả bố cục hôm nay lẫn bố cục plugins/<tên>/ với tên plugin mới — không còn trỏ ra ngoài thư mục của chính mình, không còn viết cứng tên plugin»
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build               # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: manh
decided_at: 2026-11-14T10:25:41Z   # chủ kho gõ «làm · đường C · neo như ô · ngưỡng như ô» trong phiên vòng, máy ghi hộ
prototype:
  base_commit:
  disposition:
---

> Mở 14/11/2026. Chủ kho gọi tên vòng cùng ngày: «Mở B2 và gọi chéo» — «gọi chéo» là vòng này; B2 (đưa bộ kiểm về
> xanh trên cây mới) chạy song song ở kho `delivery-loop`, phiên khác. Thay đổi đi theo mốc 3.0: **không cắt số, không
> gắn thẻ** ở vòng này.

## Vấn đề & ai gặp

Gốc: ~/dev/delivery-loop/_acceptance/kich-ban-chuyen-nha/ (vòng B1 của kho kế nhiệm, ký Cổng Bằng chứng `2ca6d76c`: sổ
kiểm kê trên cây dựng lại báo các đường treo dưới đây; hạt giống `~/dev/delivery-loop/migration/hat-giong-goi-cheo-loi-dieu-phoi.md`)

Kịch bản chuyển nhà dời từng plugin vào `plugins/<tên>/` và đổi tên cơ học (`road-map` → `roadmap`, `dieu-phoi` →
`dispatch`, `tri-thuc` → `knowledge`, chợ `acceptance-gate-kit` → `delivery-loop`). Hôm nay plugin lõi có nguồn `./` —
bản cài của nó mang **cả kho**, nên mọi đường từ lõi sang thư mục điều phối hay lên tệp khai chợ đều chạy. Ở bố cục mới,
bản cài lõi chỉ mang `plugins/acceptance-gate/`.

**Đã chứng trên máy này (14/11):** bản cài `feature-loop` 2.38.1 (nguồn `./feature-loop`) chỉ có `README.md agents scripts
skills workflows .claude-plugin/plugin.json` — không `marketplace.json`, không thư mục anh em. Bản cài lõi 2.38.1 (nguồn
`./`) có cả `.claude-plugin/marketplace.json` lẫn `dieu-phoi/`.

**Lớp lỗi — quét lại 14/11 trên `593e6837`, rộng hơn hạt giống:**

| Nhóm | Chỗ | Ở bố cục mới |
|---|---|---|
| 1. Lõi trỏ thư mục điều phối | `scripts/tin-hieu.mjs` (import `hinh-dang`, `dot`) · `scripts/gui-tin-hieu.mjs` (import `cua-tin-hieu`, `hinh-dang`) · `commands/acceptance-init.md` (ba mục danh sách chép CI `${CLAUDE_PLUGIN_ROOT}/dieu-phoi/scripts/…`) | cửa tín hiệu, bản đồ (`product-map` nạp `tin-hieu` khi kho khai `tin_hieu`), `/road-map:gui` và chép CI đều `ERR_MODULE_NOT_FOUND` |
| 1′. Lõi trỏ tệp khai chợ ở gốc kho | `scripts/plugin-declare.mjs` · `khoaBat` của `scripts/lo-trinh-khoi-tao.mjs` và `lib/chan-lo-trinh.cjs` (đều `<lõi>/.claude-plugin/marketplace.json`) | `acceptance-init` không khai được plugin cho kho; khởi tạo lộ trình từ chối «gói không đọc được marketplace.json» |
| 1″. Lõi dò «kho kit» bằng manifest ở gốc | `scripts/start-scan.mjs` (`metaOpen`: gốc có `.claude-plugin/plugin.json` tên `acceptance-gate`) | ở kho kit mới, cờ «tối đa một vòng meta» tắt lặng |
| 1‴. feature-loop coi lõi là thư mục cha của mình (tự host) | `feature-loop/scripts/{giu-tuoi,thuoc-vat,carry-plan}.mjs` (`HERE/../..`) | tự host không truyền `--ag-root` thì lặng lẽ rơi về bản cài trong bộ đệm — lệch phiên bản không ai báo |
| 2. Hằng tên plugin viết cứng | `GOI_ROAD_MAP = 'road-map'` (`lib/chan-lo-trinh.cjs`, `scripts/lo-trinh-khoi-tao.mjs`) · `p('dieu-phoi')` (`scripts/kiem-ban-cai.mjs`) | tra một plugin không còn — luật đổi chữ của kịch bản không đổi chữ trần trong ngoặc |

Không thuộc lớp (đã soát): `scripts/pre-merge-check.sh:1916` `"road-map@` — luật đổi chữ `<cũ>@` mang sang; `--plugin
acceptance-gate` ở feature-loop — tên lõi không đổi; `~/.claude/dieu-phoi/may` — thư mục trạng thái, không phải tên
plugin; `dieu-phoi/hooks/mod/khung.ts` `../../scripts` — trong chính điều phối.

**Ai trả giá:**
- **Chủ kho và phiên cắt mốc 3.0 (B3).** Hạt giống ghi: B3 chưa cắt được khi nhóm 1 còn treo — bản cài 3.0 hỏng gửi
  tín hiệu và `acceptance-init`.
- **Mọi kho tiêu thụ cài 3.0.** `acceptance-init` (khai plugin), cửa tín hiệu, khởi tạo và chặn lộ trình là đường của
  kho, không phải của kit.
- **Phiên B2.** Mỗi chỗ còn treo là ca đỏ trên cây mới mà B2 không được sửa (luật đợt: sản phẩm chỉ sửa ở kho cũ).

**Cân trên mọi kho** (luật «sửa kit vì sự cố của một kho phải cân trên mọi kho»):

| Kho | Được gì | Mất gì | Hành vi cũ có ai dựa |
|---|---|---|---|
| Kho tiêu thụ ở bố cục cũ (2.39 trở về trước) | — | Không mất gì nếu bộ kiểm của kho xanh nguyên: đầu ra từng byte của `plugin-declare`, `lo-trinh-khoi-tao`, `chan-lo-trinh` giữ nguyên | Có: crm và các kho dùng `acceptance-init`, `--list` của `plugin-declare` |
| Kho khai `tin_hieu` (cửa tín hiệu) | Cửa tín hiệu sống ở 3.0 mà không cần bật điều phối | Lượt chép CI kế (theo đợt phát hành) đổi đường ba tệp trong danh sách chép | Có: danh sách chép đang trỏ `dieu-phoi/scripts/` |
| Kho không bật điều phối | Không còn phụ thuộc ngầm vào một gói bật-theo-lựa-chọn | — | Không |
| Kho bật điều phối | — | Không mất gì | Điều phối không đổi một byte |

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Bản cài của plugin có nguồn thư mục con chỉ mang thư mục ấy | Nhóm 1′ không gãy ở bản cài, chỉ gãy khi tự host | `ls` bộ đệm plugin trên máy | **Đã chứng** 14/11 (khối trên) |
| 2 | Luật đổi chữ của kịch bản áp lên mọi tệp dưới `plugins/`, gồm mẫu `'<plugin cũ>': {` và tên chợ | Một bảng tên trong lõi không được mang sang cơ học | Đọc `luatDoiChu` + `buoc3DoiTen` của `migration/kich-ban/don-nha.mjs` | **Đã chứng** 14/11 (tập tệp = `git ls-files plugins` + bốn tài liệu) |
| 3 | Bộ kiểm của kho phủ đủ hành vi cũ của các tệp sẽ sửa | Đổi hành vi lọt qua màu xanh | Ca vi phân bố cục cũ trong hồ sơ | Chưa thử |
| 4 | Một bản sao dựng theo bố cục mới bằng mã trong lần chạy đại diện được cây của kịch bản | Thước xanh mà cây thật vẫn treo | Đo chéo cuối: lệnh đếm của hạt giống trên cây dựng lại từ nhánh vòng | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: bản 3.0 dựng từ nhánh chính có gói lõi tự đứng được — không đường nào ra ngoài thư mục của nó, không tên plugin cũ nào trong mã tra cứu?
- Kết quả nào là SỐNG: lệnh đếm ở mục «3. Ngưỡng» của hạt giống trả 0 trên cây dựng lại từ nhánh chính sau gộp; ở mốc 3.0, `kiem-ban-cai` ĐẠT mục `dieu-phoi` và lượt `acceptance-init` trên kho giả lập khai đúng `roadmap@delivery-loop`.
- Kết quả nào là CHẾT: một kho tiêu thụ ở bố cục cũ đổi phán quyết hay đầu ra (khác byte) ở `plugin-declare`, khởi tạo/chặn lộ trình hay cửa tín hiệu mà vật của kho không đổi — gặp là gỡ bản sửa.
- Timebox: gộp trước ngày cắt B3; đọc ngưỡng ở lượt dựng lại cây của B3.

## Kết quả prototype

Không dựng. Lớp lỗi đã đo bằng quét mã + bộ đệm cài thật (khối trên).

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Hạt giống gọi chéo | `~/dev/delivery-loop/migration/hat-giong-goi-cheo-loi-dieu-phoi.md` | danh sách chỗ treo + lệnh đếm | có, làm đầu vào; quét lại theo lớp | — |
| Luật đổi chữ + bảng xếp | `~/dev/delivery-loop/migration/kich-ban/{don-nha.mjs,bang-xep.json}` | ràng-buộc nền | có, chỉ đọc — không sửa kho mới | — |

## Cổng 0

- **decision = build** Chủ kho quyết 14/11 trong phiên vòng: «làm · đường C · neo như ô · ngưỡng như ô».
- **disposition = …** Không áp dụng (không dựng prototype).
- **Ngưỡng UAT chốt cùng lúc ký:** «ngưỡng như ô» — các dòng SỐNG, CHẾT, timebox ở mục Ngưỡng.
- **Chính sách đường nhóm 1 — chủ kho chọn C:** lõi mang bản chép NGUYÊN VĂN bốn tệp dùng chung của điều phối
  (`hinh-dang`, `cau-hinh`, `dot`, `cua-tin-hieu`), có răng so từng byte với bản của điều phối (tiền lệ khối chép
  nguyên văn của `cat-luot.mjs`). Lõi KHÔNG phụ thuộc gói bật-theo-lựa-chọn lúc chạy. Lối loại: A (`resolve-plugin` —
  kho khai `tin_hieu` mà không bật điều phối mất cửa tín hiệu) · D (dời về lõi — sửa ~37 tệp điều phối).
- **Neo (máy chọn, chủ kho giữ «như ô»):** hồ sơ B1 `kich-ban-chuyen-nha` ở kho kế nhiệm — chỗ lớp lỗi được đo thật, cùng tiền lệ
  `mc11-ten-kho` (#502). Lối khác: `_acceptance/mc11-ten-kho/` hay `_acceptance/release-2-39-0/` của kho này.

## Thước đo thành công → ứng viên criterion

- Bố cục cũ: bộ kiểm của kho xanh nguyên, kể cả ca của `tin-hieu`, `gui-tin-hieu`, `acceptance-init`, `plugin-declare`,
  lộ trình, `kiem-ban-cai`, `start-scan`; đầu ra từng byte giữ nguyên ở các lệnh đọc tên.
- Bố cục mới: ca dựng bằng mã một bản sao `plugins/<tên>/` + tên đã đổi (đúng luật đổi chữ của kịch bản) rồi chạy từng
  đường — có đối chứng dương, và gỡ bản sửa thì ca đỏ với thông điệp ghim.
- Răng một nguồn tên: bảng tên trong lõi khớp `marketplace.json` (tên, dấu bật-theo-lựa-chọn, tên chợ).

## Out of scope từ khám phá

- Không sửa `~/dev/delivery-loop` (kịch bản, bộ kiểm cây mới — việc của B2).
- Không đổi đường dẫn trong bộ kiểm `tests/` cho bố cục mới (B2).
- Không cắt số, không gắn thẻ, không chép lại lớp CI ở kho tiêu thụ (chiến dịch của mốc 3.0).
