# Gửi B2 — phan-du-bo-cuc-moi

Ba thứ kịch bản chuyển nhà của B2 (`migration/kich-ban/` ở kho `delivery-loop`) cần biết để chạy trên cây của vòng này.
Thước: `node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs` — bảng vá chép ở `rang/va-bo-kiem-b2.json`, luật bước 6
chép ở `rang/buoc6-chep.mjs`. Hai khối máy dưới đây không sửa tay trừ khi đổi khai báo có chủ ý.

## 1. Mục vá thừa trong `va-bo-kiem.json`

Máy ghi bằng `--ghi-gui-b2`; `--chieu-do` rút lại và so (GUI-B2). Một mục thừa khi tệp của nó nằm trong danh sách ở mục 2
(bước 6 bỏ qua tệp ấy), hoặc khi sau bước 1–3 + luật chung bước 6 chuỗi `cu` không còn khớp đúng `so_lan` lần. Xoá các
mục này khỏi bảng vá.

<!-- <<<GUI-B2-VA-THUA -->
<!-- GUI-B2-VA-THUA>>> -->

## 2. Tệp tự đúng đường — bước 6 bỏ qua

Các tệp này đã tự giải đường qua bộ dịch `tests/bo-cuc.mjs`; luật đường của bước 6 viết lại chuỗi chúng đã dịch đúng
(đo ở Task 8: K4-SC 68/77 không bước 6, 55/77 có bước 6). Bước 6 không áp luật đường và bảng vá lên chúng; luật đổi tên
(bước 3) vẫn áp như mọi tệp dưới `tests/`. Đây là biến thể (iii) mà thước chấm (sổ `d-20261115T044131Z-24`).

Danh sách viết trước khi đo: mọi tệp dưới `tests/` vòng này sửa hoặc tạo (`git diff --name-only 644e9b49 HEAD -- tests/`),
trừ ba tệp vẫn đi bước 6: `tests/scripts/run-tests.sh` và `tests/plugins/run-tests.sh` (chỉ sửa một phần khối),
`tests/scripts/lo-trinh.test.mjs` (chỉ dời ngày LT-94, không đi qua bộ dịch; 13 mục vá của nó vẫn cần).

<!-- <<<GUI-B2-TU-DUNG -->
```text
tests/bo-cuc.mjs
tests/dieu-phoi/danh-thuc-ma-phien.test.mjs
tests/dieu-phoi/lenh-dot-ghi-dung-hang.test.mjs
tests/dieu-phoi/lop-mod.test.mjs
tests/dieu-phoi/mo-dot.test.mjs
tests/dieu-phoi/trong-dot.test.mjs
tests/fixtures/bo-cuc-phang.json
tests/fixtures/cham-bo-vang.mjs
tests/fixtures/cua-veto-sau-chu-ky.mjs
tests/plugins/design-pass-nac.test.mjs
tests/plugins/lan-may-classifier.test.mjs
tests/plugins/lenh-bam-duoc.test.mjs
tests/plugins/ra-co-ten.test.mjs
tests/scripts/additive-only.test.mjs
tests/scripts/bang-ten-lo-trinh.test.mjs
tests/scripts/bo-cuc.test.mjs
tests/scripts/can-cu-s1.ca.mjs
tests/scripts/chep-tri-thuc-du.test.mjs
tests/scripts/core-untouched.test.mjs
tests/scripts/cua-veto-sau-chu-ky.test.mjs
tests/scripts/giu-tuoi-fixture.mjs
tests/scripts/ho-so-da-ky-giu-tuoi.test.mjs
tests/scripts/hskt.test.mjs
tests/scripts/kiem-ban-cai-loi-sua.test.mjs
tests/scripts/lan-status-not-run.test.mjs
tests/scripts/luot-sua-giu-du.test.mjs
tests/scripts/moi-cong-khong-qua-nut.test.mjs
tests/scripts/ngay-ky.test.mjs
tests/scripts/ngoai-n-tu-dinh-tuyen.test.mjs
tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs
tests/scripts/premerge-repin.test.mjs
tests/scripts/recheck-goc-goi-loi.test.mjs
tests/scripts/run-id-danh-sach-cho-phep.test.mjs
tests/scripts/s4-args-judgment-inputs.test.mjs
tests/scripts/tep-sinh-khong-chan-gop.test.mjs
tests/scripts/thiet-ke-nap-tri-thuc.test.mjs
tests/scripts/tin-hieu.test.mjs
tests/scripts/vong-don-le-tra-tri-thuc.test.mjs
tests/scripts/yaml-chuan.test.mjs
tests/workflows/harness.mjs
```
<!-- GUI-B2-TU-DUNG>>> -->

## 3. Cấu hình kịch bản phải đổi

- Thêm `.claude/settings.json` vào `bo_kiem.tep_goc`. Lệnh `node scripts/product-map.mjs --root . --check` ở
  `permissions.allow` phải thành đường gói lõi ở kho mới; bước 3 chỉ đổi tên trong tệp này, không đổi đường.

## 4. Ca đổi nghĩa và lý do

Các ca dưới đây không chỉ đổi đường: cách đo đổi theo, nên B2 đọc lý do trước khi so số.

- **MQ** (`moi-cong-khong-qua-nut`): giữ đúng ba vai của bản cũ (lõi, feature-loop, điều phối), giải gốc từng vai qua bộ
  dịch thay vì quét mọi gói ở kho mới.
- **TC1-09** (`tests/dieu-phoi/`): so thân ca với bản ở commit ký của hồ sơ `danh-thuc-doc-nhip-dung-ma`, không với một
  bản viết cứng; tên trạng thái ký đọc từ `lib/workspace-record.cjs`.
- **TC1-06**: đổi tên lệnh về tên tại mốc trước khi so (tên lệnh theo mốc rút từ vật).
- **P93**: rút thư mục gói khỏi vùng loại trừ theo tệp khai chợ (`SKIP_TOP` từ `boCuc`), đếm theo tiền tố.
- **P161**: so thêm dạng dịch ngược (bản base và mốc nền qua bộ dịch; heredoc Python gọi CLI).
- **L05** (`lan-status-not-run`): chạy quét bản base trong khung phẳng symlink của cây đang chạy, để verifier đã ký giải
  được ở kho mới.
- **kiem-ban-cai-loi-sua**: lối A — chợ tự khai nguồn `./`.
- **NT13** (`core-untouched`): `--root <gốc gói lõi>`.

Để ngoài vòng (kho mới đỏ đúng các khoá này cho tới khi có quyết):

- **DV5** của `pre-merge-check.sh` ở kho mới, **KK-6** (`can-cu-s1`), **HK-AC7-dot-bien** (`hskt`) — đổi nghĩa mới về
  được; sổ `d-20261115T041020Z-23`.
- **LT-142**, **LT-142-do**, **LT-142-do-nhanh** (`lo-trinh.test.mjs`): `scripts/cat-luot.mjs` vẫn đọc
  `skills/cat-luot/SKILL.md` sau khi bước 3 đổi tên skill thành `scope-slice` — mã sản phẩm, việc của B2; bộ dịch của
  vòng không chạm được (đo ở `thu-bo-dich.md`).
