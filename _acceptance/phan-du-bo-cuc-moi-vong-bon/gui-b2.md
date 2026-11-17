# Gửi B2 — phan-du-bo-cuc-moi-vong-bon

Bốn thứ kịch bản chuyển nhà của B2 (`migration/kich-ban/` ở kho `delivery-loop`) cần biết để chạy trên cây của vòng này.
Thước: `node _acceptance/phan-du-bo-cuc-moi-vong-bon/rang/giu-khoa-4.mjs`. Nguồn số: lượt đo 17/11 của B2 trên `3341b8dc`
(nhánh `0ab6f720`) — 57 / 5 802 thiếu là số NHẬN LẠI; mọi số khác ở đây là số ĐO ở kho này, ghi rõ cách đo.

## 1. Mục vá thừa trong `va-bo-kiem.json`

Không thêm. Sáu tệp vòng này chạm đã nằm trong khối tự đúng đường của vòng hai (`additive-only.test.mjs`,
`can-cu-s1.ca.mjs`, `kho-moi-cai-goi-road-map.test.mjs`) và vòng ba (`khoi-khuon-tren-the-cong.test.mjs`,
`khuon-loi.test.mjs`, `cua-tin-hieu-giua-chien-dich.test.mjs`); bước 6 đã bỏ qua chúng.

## 2. Tệp tự đúng đường — bước 6 bỏ qua

Không thêm. Khối của bước 6 vẫn là hợp hai khối: `_acceptance/phan-du-bo-cuc-moi/gui-b2.md` ∪
`_acceptance/phan-du-bo-cuc-moi-vong-ba/gui-b2.md`. Luật tĩnh của thước (`--tinh`) giữ điều này: tệp vòng sửa dưới `tests/`
mà không ở hợp hai khối thì đỏ.

## 3. Cấu hình kịch bản phải đổi

### 3.1 Luật so khoá `tuiCu` — 43 khoá K4-MP là lỗi ghép cặp của thước, không phải ca thiếu

`bo-cuc.test.mjs` in **cùng 174 tên** `BC <đường> · <cây>` ở cả hai cây, mỗi tên một lần — ví dụ ở `tui-moi.tsv` của lượt
17/11 có cả `BC commands/approve.md · HEAD` lẫn `BC plugins/acceptance-gate/commands/approve.md · HEAD`. Ở cây cũ `tuiCu`
đổi tên thứ nhất thành tên thứ hai (luật đường của `doiKhoa`) vì cây mới CÓ tên ấy, rồi đòi tên ấy **hai lần**. Báo cáo
17/11 vì thế có 43 khoá thiếu và đúng 43 khoá thừa.

Đề nghị thay `tuiCu` bằng bản xét chỗ còn lại ở cây mới (`rang/tui-cu-suc-chua.mjs` của hồ sơ này, kèm bộ thử trong
`rang/giu-khoa-4.test.mjs`): khoá không đổi tên giữ chỗ trước; khoá đổi tên nhận tên mới khi cây mới còn chỗ cho tên ấy, hết
chỗ mà tên nguyên chữ còn chỗ thì giữ tên nguyên; hết cả hai thì khoá báo thiếu bằng tên nguyên chữ nếu cây mới CÓ tên mới
(chỗ đã bị khoá khác giữ — thứ mất là bản nguyên chữ), bằng tên mới nếu cây mới không có tên mới (như `tuiCu` cũ). Ba hình
`tuiCu` đang xử lý (không đổi · đổi thường · tên gốc-gói như `P08 … in commands/skills`) cho kết quả như cũ — bộ thử
`TK-MP-hinh` đo cả bốn ca kể cả mất thật.

Đo ở kho này 17/11 trên trọn hai túi của lượt đo B2 (`/private/tmp/claude-501/ld3b-0618/out/{A,B}`, đọc bằng `docKetQua`
của chính B2): luật hiện tại thiếu 57 / 5 802, thừa 43; luật đề nghị thiếu 14 / 5 802, thừa 0; 43 khoá về đều là `BC …`;
không khoá nào chỉ thiếu ở luật đề nghị; 14 khoá còn thiếu đúng là 14 khoá ngoài K4-MP mà vòng này sửa (đo lại sau chỉnh
phần hết chỗ: số không đổi).

> Theo Hỏi-1 ở Cổng Phạm vi. Chủ kho chọn lối đổi nhãn ở kho này thì mục 3.1 này bỏ.

### 3.2 `origin/main` của hai bản sao đo không phải nhánh chính của cây nào đang đo

`do-lop-do.sh` kéo hai bản sao từ kho `delivery-loop`; `origin/main` của chúng là `909dffd8` — ảnh kit ở #499, trước #503.
Mọi ca «so với bản trước vòng» (`git merge-base HEAD origin/main`) ở CẢ hai cây vì thế so với `909dffd8`: ở cây cũ là so
qua tám ngày lịch sử, ở cây mới là so qua tám ngày lịch sử cộng một lần dọn nhà. Vòng này sửa bốn ca cho vững với đúng
tình huống ấy (mục 4), nên **không bắt buộc** đổi. Nếu muốn lượt đo phản ánh ngày cắt sang: sau `git clone`, đặt
`refs/remotes/origin/main` của bản A = nguồn và của bản B = đỉnh `don-nha/3.0`.

Điều này cũng là lời nhắc cho ngày cắt sang: nếu cây đã dọn nhà đi vào nhánh chính kho mới bằng một PR mà nhánh chính lúc
đó còn phẳng, CI của PR ấy chạy đúng tình huống «so qua lần dọn nhà».

### 3.3 45 dòng sổ ở 32 hồ sơ đã khép trỏ đường phẳng

Đếm 17/11 (mọi `decisions.jsonl` có `can_cu.tep`, 376 dòng): 45 dòng ở 32 hồ sơ (31 đã ký, 1 máy thông) trỏ tệp có ở cây
cũ mà không có ở cây mới (ví dụ `feature-loop/skills/feature-loop/SKILL.md`). Dựng lại thẻ Cổng Phạm vi của các hồ sơ ấy ở
kho mới sẽ thấy dòng «đỏ: tệp căn cứ không có». Hôm nay 0 hồ sơ đang mở dính. Vòng này không sửa (ngoài lời giao); hai lối
còn mở cho chủ kho: bộ xếp `can-cu-s1.cjs` đọc được đường phẳng cũ, hoặc để nguyên vì hồ sơ đã khép.

### 3.4 CT-10-do, KM-1 đã có chủ ở kho cũ

Theo §4.6 của `migration/viec-kho-cu-b2.md` (nhánh B2 `2aafb096`) và Hỏi-5: hai tệp `kho-moi-cai-goi-road-map.test.mjs`,
`cua-tin-hieu-giua-chien-dich.test.mjs` sửa ở vòng này (mục 4). Bốn khoá — KM-1, CT-10-do và hai khoá cấp tệp K4-LT — tính
là đã có chủ.

## 4. Ca đổi nghĩa và lý do

Không ca nào bỏ lời hứa gốc; ở bố cục phẳng mọi phép đổi là đồng nhất (thước `--cu`: túi khoá bố cục cũ của mỗi tệp vòng
chạm giữ trọn tên ca).

- **KK-6, KK-6-do (`khoi-khuon-tren-the-cong`) · KL-8, KL-8-do (`khuon-loi`)** — không đổi nghĩa. `banGocVong()` đặt `skills/`
  của cây đang kiểm vào bản trước vòng theo bố cục VÀ tên của chính bản ấy (`duong(<mục>, { kho, ref: merge-base })`), nên
  bản trước vòng ở bất kỳ tuổi nào cũng tìm thấy `skills/cat-luot`.
- **KM-1 (`kho-moi-cai-goi-road-map`)** — không đổi nghĩa: câu «kho chưa cài <gói> ở phạm vi kho» lấy tên gói từ
  `tenTheoVai('lo-trinh')` của cây đang kiểm thay cho chữ `road-map` viết cứng.
- **CT-10-do (`cua-tin-hieu-giua-chien-dich`)** — không đổi nghĩa: đường `import` tiêm vào bản sao tính từ hai đường đã qua
  bộ dịch thay cho `'../../scripts/tin-hieu-khoa.cjs'` viết cứng.
- **DV5 `pre-merge-check.sh` (`additive-only`)** — đổi nghĩa có khai: khi so QUA lần dọn nhà (bản gốc còn phẳng, cây đã ở bố
  cục mới) hai dòng trong `DON_NHA_DOI` được tha — dòng chú thích nhắc `tests/scripts/hang-pr.test.mjs` và dòng
  `elif grep -qs '"road-map@' …`. Ở cây phẳng, và ở kho mới khi bản gốc đã là bố cục mới, danh sách không áp. Kịch bản đổi
  thêm dòng nào của hai tệp cưỡng chế thì DV5 đỏ ở cây mới: thêm dòng ấy vào danh sách CÓ TÊN ở kho cũ, không sửa ở kho mới.
  Lưu ý cho bước 6: bảng tên đổi «road-map@» ở MỌI tệp kiểm, kể cả tệp tự đúng đường (đo trên cây kịch bản `b1b283db`:
  bước 6/6 sửa `additive-only.test.mjs`, `can-cu-s1.ca.mjs`, `kho-moi-cai-goi-road-map.test.mjs`, `bo-cuc.test.mjs`). Mục
  miễn vì thế viết tách tên gói (`${'road-map'}@`) để còn khớp bản gốc phẳng — không cần đổi gì ở kịch bản.
- **KK-6 so-that (`can-cu-s1.ca`)** — đổi nghĩa có khai: ở cây đã dọn nhà thẻ của mã đang kiểm đọc sổ thật
  `can-cu-s1-chay-moi-kho` trong bản bung của cây phẳng lịch sử (`chaDonNha`, cùng quyết định Hỏi-2 của vòng ba); ở cây phẳng
  đọc chính cây đang đứng. Ca thôi cho thấy điều ở mục 3.3 — nên mục 3.3 ghi riêng.

## Số đo trên cây kịch bản thật

Đo tay một lần 17/11 (Node 24), ngoài làn máy vì CI không có kho B2:

- Dựng: bản sao tạm của kho `delivery-loop` ở nhánh B2 `91763f84`; `node migration/kich-ban/don-nha.mjs --nguon 075fcbd6
  --nhanh don-nha/vong-bon-2 --repo-standards <bản kéo repo-setup-v0.5.0 4dc53e07>` → `075fcbd6 → d24c70e6`, cây
  `37b31af2`. Hai bản kéo riêng như `do-lop-do.sh`: A = `075fcbd6` (nguồn, phẳng), B = `d24c70e6` (đã dọn nhà); `origin/main`
  của cả hai = `909dffd8` (đúng chỗ bản sao đo của B2 đang trỏ). Kho B2 chỉ được đọc.
- Chạy 7 tệp (6 tệp vòng khai + `bo-cuc.test.mjs`) ở mỗi cây, HOME/TMPDIR rỗng: cả 14 lần thoát 0.
- **Khoá đích thiếu hoặc đỏ ở B: 0 / 57.**
- Luật B2 hiện tại (`tuiCu` của `giu-khoa.mjs` B2, bảng tên + bảng xếp của B2): thiếu 43, tất cả ở `bo-cuc.test.mjs` — đúng
  43 khoá K4-MP, đúng lỗi ghép cặp ở §3.1. Luật đề nghị (`rang/tui-cu-suc-chua.mjs`): thiếu 0 trên 7 tệp.
- Bước 6/6 của kịch bản sửa chữ ở 3 tệp vòng khai tự đúng đường (`additive-only`, `can-cu-s1.ca`, `kho-moi-cai-goi-road-map`)
  và `bo-cuc.test.mjs` bằng bảng tên — cả bốn vẫn xanh (mục 4, DV5).

Ngưỡng mở lại (hợp đồng, Notes): lượt đo kế của B2 còn thiếu ≥ 1 trong 14 khoá ngoài K4-MP.
