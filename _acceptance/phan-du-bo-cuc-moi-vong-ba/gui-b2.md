# Gửi B2 — phan-du-bo-cuc-moi-vong-ba

Bốn thứ kịch bản chuyển nhà của B2 (`migration/kich-ban/` ở kho `delivery-loop`) cần biết để chạy trên cây của vòng này.
Thước: `node _acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs`. Bảng vá chép ở `rang/va-bo-kiem-b2.json` — ảnh chụp
`migration/kich-ban/va-bo-kiem.json` của nhánh B2 tại commit `86669ccd` (267 mục, sha256 `351bedfe…`). Hai khối máy dưới đây
không sửa tay trừ khi đổi khai báo có chủ ý. Khối tự đúng đường của vòng hai (`_acceptance/phan-du-bo-cuc-moi/gui-b2.md`) vẫn
đúng; khối ở đây là PHẦN THÊM của vòng ba — bước 6 bỏ qua hợp hai khối.

## 1. Mục vá thừa trong `va-bo-kiem.json`

Máy ghi bằng `--ghi-gui-b2`; `--tinh` rút lại và so. Một mục thừa khi tệp của nó nằm trong khối ở mục 2 (bước 6 bỏ qua tệp
ấy — không luật đường, không bảng vá). Xoá các mục này khỏi bảng vá.

<!-- <<<GUI-B2-VA-THUA -->
máy ghi: 38/267 mục của va-bo-kiem-b2.json thừa — 38 trên tệp tự đúng đường (bước 6 bỏ qua), 0 không còn khớp sau bước 6 (rút từ HEAD lúc ghi)
```jsonl
{"tep":"tests/scripts/cham-lai-khong-tu-doi.test.mjs","cu":"'--', 'plugins/feature-loop/scripts/carry-plan.mjs')","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/cham-lai-khong-tu-doi.test.mjs","cu":"'--ag-root', ban.goc, ","so_lan":2,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/khuon-loi.test.mjs","cu":"const cu = chay(goc, 'plugins/acceptance-gate/scripts/gate-card.js',","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/khuon-loi.test.mjs","cu":".replaceAll('\"$AG/', `\"${KIT}/`)","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/ntr-trang-thai.test.mjs","cu":"'--', 'plugins/acceptance-gate/lib/workspace-record.cjs')","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/ntr-trang-thai.test.mjs","cu":"pathToFileURL(path.join(sau, 'plugins/acceptance-gate/scripts', 'product-map.mjs'))","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/ntr-trang-thai.test.mjs","cu":"pathToFileURL(path.join(cu, 'plugins/acceptance-gate/scripts', 'product-map.mjs'))","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/khuon-loi.test.mjs","cu":"'--no-carry', '--ag-root', kit]);","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/ra-soat-lo-trinh.test.mjs","cu":"const MA = ['plugins/acceptance-gate/scripts', 'plugins/acceptance-gate/lib', 'plugins/acceptance-gate/skills', 'plugins/acceptance-gate/commands'];","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/dai-tom-tat-dem-dung.test.mjs","cu":"for (const d of ['scripts', 'lib', 'skills', 'commands', path.join('plugins/feature-loop', 'skills')])","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lo-trinh.test.mjs","cu":"$AG/plugins/acceptance-gate/scripts/","so_lan":3,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lo-trinh.test.mjs","cu":"path.join(mut, 'scripts')","so_lan":3,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lo-trinh.test.mjs","cu":"path.join(kit, 'scripts', tep)","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lo-trinh.test.mjs","cu":"writeFileSync(path.join(goi, 'plugins/acceptance-gate/scripts', 'product-map.mjs')","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lo-trinh.test.mjs","cu":"writeFileSync(path.join(r, 'plugins/acceptance-gate/scripts', 'product-map.mjs')","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lo-trinh.test.mjs","cu":"'PMAP=plugins/acceptance-gate/scripts/product-map.mjs","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lo-trinh.test.mjs","cu":"'node plugins/acceptance-gate/scripts/product-map.mjs'","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lo-trinh.test.mjs","cu":"lenh.split('${CLAUDE_PLUGIN_ROOT}').join(KIT)","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lo-trinh.test.mjs","cu":"for (const d of ['plugins/acceptance-gate/scripts', 'plugins/acceptance-gate/lib', 'plugins/acceptance-gate/skills']) cpSync(path.join(KIT, d), path.join(v, d), { recursive: true });","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lo-trinh-gio-may.test.mjs","cu":"path.join(kit, 'plugins/roadmap', 'commands', 'xem.md')","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/ap-chinh-sach-lo-trinh.test.mjs","cu":"path.join(kit, 'plugins/roadmap', 'commands', 'xem.md')","so_lan":2,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/ve-lo-trinh-doc-tin-hieu-cua-cay.test.mjs","cu":"path.join(may, 'plugins/roadmap', 'commands', 'gui.md')","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lo-trinh-gio-may.test.mjs","cu":"--require plugins/acceptance-gate/scripts/do-vong.mjs","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lo-trinh-gio-may.test.mjs","cu":"$AG/plugins/acceptance-gate/scripts/","so_lan":2,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lo-trinh.test.mjs","cu":"CLAUDE_PLUGIN_ROOT: kit }","so_lan":2,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lo-trinh.test.mjs","cu":"for (const d of ['plugins/acceptance-gate/scripts', 'plugins/acceptance-gate/lib', 'plugins/acceptance-gate/skills']) cpSync(path.join(kit, d), path.join(v, d), { recursive: true });","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/moc-chien-dich.test.mjs","cu":"for (const d of ['plugins/acceptance-gate/scripts', 'plugins/acceptance-gate/lib', 'plugins/acceptance-gate/skills']) cpSync(path.join(kit, d), path.join(v, d), { recursive: true });","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/road-map-de-dung.test.mjs","cu":"AG: kit }","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/ap-chinh-sach-lo-trinh.test.mjs","cu":"AG: kit,","so_lan":2,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/ra-soat-lo-trinh.test.mjs","cu":"replace(/\"\\$AG/g, `\"${kit}`)","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lo-trinh.test.mjs","cu":"if (existsSync(path.join(r, 'plugins/acceptance-gate/scripts', 'lo-trinh.mjs'))) throw new Error('kho fixture không được có plugins/acceptance-gate/scripts/lo-trinh.mjs');","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/lo-trinh.test.mjs","cu":".replace(CU, 'node plugins/acceptance-gate/scripts/lo-trinh.mjs')","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/ra-soat-lo-trinh.test.mjs","cu":"\"export const LENH_RA_SOAT = 'node plugins/acceptance-gate/scripts/lo-trinh.mjs --root . --ra-soat';\"","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs","cu":"readFileSync(path.join(goc, 'plugins/roadmap', 'commands', 'gui.md'), 'utf8')","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs","cu":"khoiLenh(goc).replaceAll('$AG', goc)","so_lan":2,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/tin-hieu.test.mjs","cu":"'node \"$AG/plugins/acceptance-gate/scripts/tin-hieu.mjs\" --root . --rang', 'node \"$AG/plugins/acceptance-gate/scripts/tin-hieu.mjs\" --root . --rangg'","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs","cu":"path.join(goc, 'plugins/roadmap', 'commands', 'gui.md')","so_lan":1,"ly_do":"tệp tự đúng đường"}
{"tep":"tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs","cu":"lenh.replaceAll('$AG', goc)","so_lan":1,"ly_do":"tệp tự đúng đường"}
```
<!-- GUI-B2-VA-THUA>>> -->

## 2. Tệp tự đúng đường — bước 6 bỏ qua

Các tệp vòng ba sửa hoặc tạo dưới `tests/`, đã tự giải đường qua bộ dịch `tests/bo-cuc.mjs` (và `tests/hai-bo-cuc.mjs`).
Luật đổi tên (bước 3) vẫn áp như mọi tệp dưới `tests/`. Danh sách viết TRƯỚC khi đo; luật tĩnh của thước đòi nó bằng đúng
tập tệp vòng sửa (`git diff --name-only 795baf96 HEAD -- tests/`; `tests/scripts/fixtures/routing-baseline.txt` chỉ rời tập
khi mọi dòng đổi là dòng thêm của chính hồ sơ này — dòng lệnh ký ghi).

<!-- <<<GUI-B2-TU-DUNG -->
```text
tests/hai-bo-cuc.mjs
tests/scripts/ap-chinh-sach-lo-trinh.test.mjs
tests/scripts/ban-do-khuon-roi-nhom.test.mjs
tests/scripts/bang-ten-lo-trinh.test.mjs
tests/scripts/bo-cuc.test.mjs
tests/scripts/cham-lai-khong-tu-doi.test.mjs
tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs
tests/scripts/cua-tin-hieu-giua-chien-dich.test.mjs
tests/scripts/cua-tin-hieu-goc-moi-worktree.test.mjs
tests/scripts/dai-tom-tat-dem-dung.test.mjs
tests/scripts/doc-jsx-va-ban-do-hong.test.mjs
tests/scripts/hai-bo-cuc.test.mjs
tests/scripts/kho-moi-cai-goi-road-map.test.mjs
tests/scripts/khoi-khuon-tren-the-cong.test.mjs
tests/scripts/khuon-loi.test.mjs
tests/scripts/lo-trinh-du-lieu-ngay.test.mjs
tests/scripts/lo-trinh-gio-may.test.mjs
tests/scripts/lo-trinh.test.mjs
tests/scripts/moc-chien-dich.test.mjs
tests/scripts/ntr-trang-thai.test.mjs
tests/scripts/o-mo-viec-mang-nguon.test.mjs
tests/scripts/ra-soat-lo-trinh.test.mjs
tests/scripts/recheck-goc-goi-loi.test.mjs
tests/scripts/road-map-de-dung.test.mjs
tests/scripts/tin-hieu.test.mjs
tests/scripts/ve-lo-trinh-doc-tin-hieu-cua-cay.test.mjs
tests/scripts/xem-trang-lo-trinh.test.mjs
```
<!-- GUI-B2-TU-DUNG>>> -->

Hai tệp vòng hai còn khai «vẫn đi bước 6» hay «khai nhầm» nay tự đúng đường thật: `tests/scripts/lo-trinh.test.mjs` (13 mục
vá của nó thừa) và `tests/scripts/tin-hieu.test.mjs` (dòng nạp `lib/workspace-record.cjs` và CN-2 đã qua bộ dịch).

## 3. Cấu hình kịch bản phải đổi

- **Khối tự đúng đường của bước 6 = hợp hai khối** (vòng hai `_acceptance/phan-du-bo-cuc-moi/gui-b2.md` ∪ mục 2 ở đây).
- **Giữ** hai mục vá P32 của `tests/plugins/run-tests.sh` (`root / "commands"` → gói lõi; `LOCKED_ROAD_MAP` → pin/unpin/undo):
  AP-7, AP-7-do, AP-7-do2 của `ap-chinh-sach-lo-trinh` đọc khối P32 ấy. Thước vòng ba áp bảng vá cho tệp còn đi bước 6 và đo
  thấy chúng xanh khi hai mục ấy có mặt.
- **Giữ** `tests/scripts/tat-rd1.mjs` đi bước 6 cùng các mục vá của nó: bốn tệp lộ trình dùng bản viết lại ấy ở kho mới;
  riêng `lo-trinh-du-lieu-ngay` dựng bộ tắt tại chỗ qua bộ dịch (nền của nó là một commit phẳng cũ).
- **Lịch sử phải đi theo.** `tests/hai-bo-cuc.mjs` lấy cây phẳng của chính mã ở kho mới bằng cha của commit MỚI NHẤT đưa
  `plugins/acceptance-gate/.claude-plugin/plugin.json` vào chỗ — kịch bản phải dựng cây mới là CON của đỉnh kho cũ (như lượt
  đo B2 hôm nay), không squash lịch sử. Sai thì các tệp K4-MP và DD-6 thoát 3 với câu «hai-bo-cuc: cha của commit dọn nhà
  <sha> không phẳng».
- `luatDuongDoiTen` (bước 3, `don-nha.mjs` dòng 128–139) là thứ làm LT-142 xanh ở kho mới: nó nắn đường dự phòng
  `skills/cat-luot/SKILL.md` của `scripts/co-hop-dong.cjs`. Thước vòng ba chép luật này (`rang/buoc3-duong-chep.mjs`,
  nguồn `86669ccd`); B2 đổi luật thì báo lại.
- KM-1, CT-10-do (cụm B2) vẫn là việc của kịch bản. Chúng làm khoá cấp tệp của `kho-moi-cai-goi-road-map.test.mjs` và
  `cua-tin-hieu-giua-chien-dich.test.mjs` đỏ theo; thước vòng ba ghi «TIN … đỏ CHỈ vì khoá cụm ngoài vòng», không FAIL.

## 4. Ca đổi nghĩa và lý do

Không ca nào bỏ lời hứa gốc. Các ca dưới đây đổi CÁCH so để giữ lời hứa ở cả hai bố cục; ở bố cục phẳng mọi phép đổi là đồng
nhất (đo: túi khoá bố cục cũ của mọi tệp vòng chạm giữ trọn tên ca).

- **K4-MP (`bo-cuc`, `bang-ten-lo-trinh`)**: ở cây đã dọn nhà, «cây phẳng» là bản bung cha commit dọn nhà (chủ kho chọn ở
  Hỏi-2 — đóng băng sau cắt sang, ngưỡng mở lại: ≥ 1 commit kho mới chạm `lib/`, `scripts/` của lõi). Hàng «HEAD» của
  ma trận bộ dịch lấy cột theo bố cục thật của HEAD; mọi phép khẳng định «đọc một commit phẳng» dùng commit phẳng ấy. Tên
  chợ và tên gói lấy từ bảng đổi tên đã chép (`luat-doi-chu.mjs`), vì luật đổi tên của bước 3 đổi chữ viết cứng trong
  `tests/`. Kho tiêu thụ giả của SP-NL bật khoá theo bố cục của cây đang đứng.
- **SP (bang-ten-lo-trinh)**: bản gốc ghim `644e9b49` thay `merge-base` — sửa lỗi đỏ nhánh chính; thêm SP-GOC-GHIM.
- **DD-6, DD-6-do (`dai-tom-tat-dem-dung`)**: ở cây đã dọn nhà băm `tests/scripts/dai-tom-tat.test.mjs` TẠI commit phẳng của
  chính mã — kịch bản viết lại đường trong tệp ấy (cùng quyết định Hỏi-2).
- **CT-8-khong, GW-4**: thẻ của bộ máy gốc so với thẻ hiện tại sau khi đưa tên lệnh `/<gói>:<tên>` về tên của cây đang đo.
- **KM-8-khoi-khac**: khoá `<gói>@<chợ>` trong khối của bộ máy gốc đổi theo bảng tên và tên chợ của từng cây.
- **CN-2 (`tin-hieu`)**: trong bản 2.27, chỉ đường nạp gói điều phối dịch theo cây; phần còn lại giữ nguyên từng byte.
- **AP-7**: đòi danh sách `LOCKED_ROAD_MAP` của P32 và thư mục lệnh theo đúng bố cục của cây.
- **RG-2** giữ `merge-base` sống (so tương đối); các ca «so với bản trước vòng» khác cũng giữ cơ chế, chỉ dịch đường theo
  cây của commit được bung (`boPhan` + `pathspec`, chốt chống rỗng).
