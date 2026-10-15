---
schema_version: 1
feature: Chủ kho mở thẻ khởi động và thấy ngay hàng nào của lộ trình cần rà soát — dời mốc, chờ điều kiện hay bác — kèm căn cứ máy đọc, mà máy không sửa tệp lộ trình và không thêm lượt gọi người
slug: ra-soat-lo-trinh
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/lo-trinh.mjs · scripts/cat-luot.mjs · scripts/start-scan.mjs · commands/start.md · skill cắt lượt + khuôn · gói mới road-map/ + marketplace + P200 — không chạm lib/**, hooks/**, lưới trước-merge, dieu-phoi/
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-14-ra-soat-lo-trinh-design.md
status: verified
approved_by: Manh Phan
approved_at: 2026-10-15T02:10:00Z
---

# Acceptance Contract: ra-soat-lo-trinh

## Context

Vòng 1 của gói `road-map` theo hướng B′ (`docs/findings/2026-10-14-kien-truc-roadmap-plugin.md`, chủ kho duyệt
14/10; ADR 0025 bổ sung 14/10). Gốc: `crm/_acceptance/tin-hieu-tu-ve-kho/` — lộ trình chỉ có cửa vào, không có cửa ra.
Lát «chỉ cờ»: máy tính đề xuất rà soát kèm căn cứ và hiện trên thẻ khởi động + một lệnh chỉ đọc; KHÔNG tự áp, KHÔNG
ghi tệp lộ trình. Rà soát phụ thuộc hôm nay nên KHÔNG vào trang lộ trình (trang phải tất định — `--check` so byte).
Chủ kho gọi tên vòng 14/10 khi vòng meta MC1 của cửa sổ còn mở — ngoại lệ luật chiều rộng (b), ghi ở sổ.

Kho thử trong mọi ca do code sinh trong lượt (thư mục tạm, `git init`, commit ghim ngày bằng `GIT_COMMITTER_DATE` /
`GIT_AUTHOR_DATE`, hồ sơ dựng theo hình dạng ô của bản đồ); «hôm nay» ghim bằng `ACCEPTANCE_TODAY=2026-10-14`. Giá trị
mong đợi viết sẵn trong ca, không rút từ đầu ra của hàm rà soát. «Bộ máy gốc» = `scripts lib skills commands` lấy bằng
`git archive <gốc so>` trong lượt, với gốc so đọc từ `_acceptance/ra-soat-lo-trinh/goc-so` (hôm nay `1baceb96`; nhánh nhận
nền mới — MC1 gộp — thì tệp đổi sang commit nhận nền kèm một dòng sổ `fix`). Ca gác RS-0 chạy trước mọi ca so: mọi commit
trong `gốc so..HEAD` chạm `scripts/`, `lib/`, `skills/`, `commands/` phải mang «ra-soat-lo-trinh» trong tiêu đề — không thì
ca đỏ nêu commit, và mọi ca so byte không được tính.

## Criteria

- AC-1: Given kho thử dùng mốc, không khai chính sách, ma trận hàng viết sẵn {mốc `phat-hanh` đã qua ngày · mốc không khai `loai` đã qua ngày · mốc `phat-hanh` chưa tới ngày · mốc `ngoai` đã qua ngày · mốc `han-cung` đã qua ngày · không thuộc mốc} × {chưa có hồ sơ · hồ sơ đang mở · đã giao · xếp lại có hồ sơ · xếp lại tự khai không hồ sơ · đã bác · hỏng · không suy được}, When chạy `lo-trinh.mjs --ra-soat --json`, Then tập (mã, đề xuất, luật) BẰNG tập viết sẵn 19 phần tử: `doi-moc`/`moc-qua-ngay` ĐÚNG ở một ô (mốc `phat-hanh` đã qua ngày × chưa có hồ sơ); `cho-dieu-kien`/`xep-lai` ở mọi hàng xếp lại (sáu vị trí × hai nguồn — kể cả hai ô mốc `phat-hanh` đã qua ngày, vì luật xếp lại đứng trước); `bac`/`ho-so-bac` ở mọi hàng đã bác; mốc không khai `loai` không sinh đề xuất nào; không hàng nào khác mang đề xuất. Chiều đỏ: bản sao coi mốc `ngoai` là mốc chiến dịch → ca đỏ nêu mã hàng mốc ngoài; bản sao không loại hàng có hồ sơ đang mở → ca đỏ nêu mã hàng đó.
- AC-2: Given kho thử có lịch sử commit ghim ngày và `chinh_sach: {tuoi_ngay: 30, tran_ke_tiep: 1}`, hàng «Kế tiếp» (không thuộc mốc chiến dịch) chưa có hồ sơ tuổi {10, 29, 30, 45} ngày, ba hàng ngoài mốc đã giao tuổi 100, When rà soát, Then `cho-dieu-kien`/`tuoi` ĐÚNG ở hai hàng tuổi 30 và 45 (ngưỡng tính ≥); số hàng «Kế tiếp» K = 4 (hàng đã giao không đếm); luật `tran` thêm `cho-dieu-kien` cho ĐÚNG hàng tuổi 29 (hàng cũ nhất còn lại, đưa phần còn lại về bằng trần); hàng đã giao không mang đề xuất. Given cùng kho mà không khai chính sách, Then không đề xuất `tuoi`/`tran` nào. Given `tuoi_ngay: "30"` (chuỗi), Then trang lộ trình có đúng một cờ «chính sách tuoi_ngay phải là số nguyên dương» ở mục «Cần sửa trong kế hoạch» và không đề xuất chính sách nào. Given cùng kho thêm ba hàng chưa có hồ sơ, không thuộc mốc chiến dịch, tuổi 100, tự khai lần lượt «Đã bác từ khám phá», «Đang làm», «Ngoài phạm vi đã ký», Then K vẫn = 4 (hàng «Kế tiếp» chỉ là việc CHƯA BẮT ĐẦU: chưa mở · đang cân nhắc · sắp mở) và ba hàng ấy không mang đề xuất nào (Cổng Bằng chứng 15/10, Ngoài-4/13). Chiều đỏ: bản sao đếm cả hàng đã giao vào K → ca đỏ nêu «K = 7, cần 4»; bản sao so tuổi bằng «>» thay «≥» → ca đỏ nêu «hàng tuổi 30 thiếu đề xuất tuoi»; bản sao đếm mọi hàng chưa giao vào K → ca đỏ nêu mã hàng tự khai «Đã bác từ khám phá».
- AC-3: Given kho thử với chuỗi commit ghim ngày — c1 01/09 tạo X, Y, Z, W; c2 10/09 sửa `vi_sao` của Y; c3 20/09 đổi mã Z → Z2 giữ câu giao; c4 25/09 gắn X vào một mốc `ngoai`, c5 01/10 gỡ X khỏi mốc đó; c6 05/10 đổi CẢ mã lẫn câu giao của W thành W2 — và `chinh_sach.tuoi_ngay: 1`, When rà soát hôm nay 14/10, Then tuổi và (ngày, sha) lần chạm cuối của từng hàng BẰNG bảng viết sẵn: X 13 (c5) · Y 34 (c2) · Z2 43 (c1 — đổi mã không chạm) · W2 9 (c6 — hàng mới); sha lấy từ chính kho thử trong lượt. Chiều đỏ: bản sao theo dấu hàng bằng mã → ca đỏ nêu «Z2: tuổi 24, cần 43».
- AC-4: Given kho thử có 8 đề xuất, When chạy bộ quét thẻ start, Then `loTrinh.dong` có ĐÚNG một dòng tổng `Rà soát: 8 đề xuất — <a> dời mốc · <b> chờ điều kiện · <c> bác`, đúng 5 dòng chi tiết `  · <mã> — <đề xuất>: <căn cứ>` và một dòng `  … còn 3 — xem: <lệnh>`, đặt ngay trước dòng «Lộ trình có N cờ» (không có cờ thì trước dòng trang); `loTrinh.ds[].raSoat` BẰNG mảng của `--ra-soat --json` trên cùng kho. Given ba kho thử 0 đề xuất (không khai lộ trình · khai một lộ trình không mốc, không chính sách · khai có mốc chưa tới ngày), Then stdout bộ quét giống TỪNG BYTE bộ máy gốc — sau đối chứng dương (mỗi kho × mỗi bên: lệnh thoát 0, stdout khác rỗng; thiếu → ca đỏ «đối chứng gốc không chạy: <bên> <kho>»). Lệnh trong dòng `… còn 3 — xem: <lệnh>` chạy được ở kho không có bộ máy kit: chạy nguyên văn lệnh rút từ dòng (cwd = kho thử, kho thử không có thư mục `scripts/`) thoát 0 và stdout BẰNG `--ra-soat` của lõi trên cùng kho (Cổng Bằng chứng 15/10, Ngoài-8). Chiều đỏ: bản sao in dòng «Rà soát: 0 đề xuất» → ca so byte đỏ nêu kho; bản sao in đường tương đối `node scripts/lo-trinh.mjs` → ca đỏ «lệnh xem không chạy được ở kho tiêu thụ».
- AC-5: Given kho thử có đề xuất của cả năm luật, When chạy `--ra-soat` (chữ) và `--ra-soat --json`, Then cả hai thoát 0; mỗi mục JSON có `ma`, `cau_giao`, `de_xuat`, `luat`, `can_cu` và `can_cu` đúng hình theo luật (`moc-qua-ngay`: `moc` + `ngay` · `xep-lai`: `nguon` ∈ {`ho-so`, `tu-khai`} + `ho_so` hoặc `chu` · `ho-so-bac`: `ho_so` + `o` · `tuoi`: `tuoi` + `cham_cuoi.ngay` + `cham_cuoi.sha` · `tran`: `k` + `tran`); bản chữ in mỗi mục đúng một dòng cùng câu với dòng chi tiết của thẻ; sau lệnh `git status --porcelain` của kho thử rỗng và mtime tệp lộ trình không đổi. Given kho chưa khai lộ trình, Then thoát 1 với thông điệp nêu khoá `lo_trinh.tep`; `--ra-soat` đi cùng `--hang` → thoát 2. Chiều đỏ: bản sao ghi một tệp vào kho trong lúc rà soát → ca đỏ «lệnh rà soát ghi tệp: <tệp>».
- AC-6: Given các kho thử của AC-1 và AC-2 (trừ ca chính sách sai), When vẽ trang lộ trình hai lần với `ACCEPTANCE_TODAY` khác nhau (2026-10-14 và 2026-12-31), Then hai lần ra cùng byte, giống TỪNG BYTE bộ máy gốc, và `product-map.mjs --check` thoát 0. Chiều đỏ: bản sao đưa đề xuất rà soát vào trang → ca đỏ «trang khác bộ máy gốc: <kho>».
- AC-7: Given kho thử có bản phạm vi đợt `d2` và lộ trình có mốc A (`phat-hanh`, ngày sau hôm nay, đã có hàng của đợt `d1`) · mốc B (`phat-hanh`, ngày sau hôm nay, chỉ hàng của `d2`) · mốc C (`phat-hanh`, đã qua ngày, có hàng `d1`) · mốc N (`ngoai`, ngày sau hôm nay, có hàng `d1`), mỗi mốc gắn một hàng của `d2`, When chạy `cat-luot.mjs --co` và răng phủ `--pham-vi` với hôm nay 2026-10-14, Then có ĐÚNG MỘT cảnh báo `[gan-moc-dang-chay]` nêu hàng gắn A và tên mốc A; mã thoát của cả hai lệnh bằng bộ máy gốc trên cùng kho. Chiều đỏ: bản sao bỏ điều kiện «mốc đã có hàng ngoài đợt» → ca đỏ nêu hàng gắn B.
- AC-8: Given cây, When chạy các lệnh phát thông báo về mục `chan_troi` (răng phủ cắt lượt với mục thiếu `ly_do`; mã không nằm ở hàng, mục hay mốc ngoài nào; bộ đọc khuôn với `chan_troi` không phải mảng), Then thông báo dùng chữ «chờ điều kiện» (ghim từng câu) và không câu nào chứa «chân trời»; quét chuỗi thông báo trong `scripts/cat-luot.mjs`, `scripts/lo-trinh.mjs`, `scripts/tin-hieu.mjs`, skill `cat-luot`, skill `gom-tin-hieu`, khuôn `pham-vi-template.md`, `tin-hieu-template.md`, `lo-trinh-du-lieu.md` và mục glossary của `CONTEXT.md`: 0 chữ «chân trời» ngoài khoá `chan_troi` và chú thích mã; một tệp lộ trình dùng khoá `chan_troi` đọc ra cùng kết quả răng phủ như bộ máy gốc (trừ chữ); trang lộ trình của kho có khối `chan_troi` sai dạng in câu cờ mới, mọi khác biệt byte với bộ máy gốc nằm đúng trong câu cờ đó. Chiều đỏ: bản sao trả một thông báo về chữ cũ → ca đỏ nêu câu.
- AC-9: Given bản sao `docs/plan/` + `_acceptance/` của crm ở `d0351bcd` (bung bằng `git archive` trong lượt; crm vắng trên máy → thoát 2 nêu đường, không xanh) và tệp lộ trình kit ở `1baceb96`, hôm nay 2026-10-14, không chính sách, When rà soát, Then crm: OKR 0 đề xuất · Kho tài liệu 0 · Việc và Dự án đúng `DA6`, `DA7`, `DA8` → `cho-dieu-kien` (`xep-lai`, nguồn `tu-khai`); kit: đúng `A3`, `DP8` → `doi-moc` (`moc-qua-ngay`) — danh sách viết sẵn trong ca từ phép đếm độc lập 14/10 (bộ máy gốc + luật viết riêng).
- AC-10: Given cây, When đọc marketplace, các manifest và chạy suite plugin vùng 3, Then marketplace có gói thứ năm `road-map` (`source: ./road-map`, tag `bat-theo-lua-chon`); `road-map/.claude-plugin/plugin.json` cùng số phiên bản với `acceptance-gate`, `feature-loop`, `dieu-phoi` và P200 khoá cả bốn (đột biến lệch số của `road-map` → P200 đỏ nêu `road-map`); `road-map/commands/xem.md` KHÔNG khoá model-invocation (chỉ đọc — ADR 0002 không đổi); dòng lệnh trong `xem.md` (rút từ tệp, không chép tay) chạy trên kho thử của AC-5 ra đúng đầu ra `--ra-soat` của lõi. Chiều đỏ: bản sao marketplace thiếu `road-map` → ca đỏ «marketplace không có gói road-map».
- AC-11: Rà soát không bao giờ im khi không đọc được (Cổng Bằng chứng 15/10, Ngoài-2/3/7/10/11/12). Given bốn kho thử, hôm nay 2026-10-14, When chạy `--ra-soat` (chữ và `--json`) và bộ quét thẻ start, Then:
  - (a) kho khai hai lộ trình, một tệp JSON hỏng (`{bad`) · một tệp lành có đề xuất: lệnh chữ in đề xuất của tệp lành ra stdout, in ra stderr đúng một dòng `lo-trinh: không đọc được tệp ý định — <lỗi>` nêu tên tệp hỏng, thoát 1; bản JSON thoát 1, phần tử của tệp hỏng mang trường `loi` (chuỗi khác rỗng) và `de_xuat: []`;
  - (b) kho git có lộ trình và `_acceptance/` nằm trong thư mục con `sub/`, `chinh_sach.tuoi_ngay: 30`, một hàng chưa có hồ sơ commit ngày 2026-09-01: `--root sub` cho hàng ấy `cho-dieu-kien`/`tuoi` với tuổi 43 — BẰNG đề xuất của cùng nội dung đặt ở gốc kho;
  - (c) cùng nội dung (b) bung vào thư mục KHÔNG phải kho git: phần tử JSON mang `canh_bao` có câu «không đọc được tuổi hàng — luật tuổi không chạy»; bản chữ và thẻ start in câu ấy đúng một dòng; thoát 0;
  - (d) clone nông (`--depth 1`) của một kho có chính sách tuổi: phần tử JSON có `lich_su_cut: true` và `canh_bao` có câu «lịch sử cụt — tuổi hàng là tuổi tối thiểu»; bản chữ và thẻ start in câu ấy đúng một dòng.
  Ba kho 0 đề xuất của AC-4 vẫn giống TỪNG BYTE bộ máy gốc (không khai chính sách → không cảnh báo). Chiều đỏ: bản sao trả tệp hỏng về im lặng → ca đỏ «tệp hỏng mà lệnh im: <tệp>»; bản sao đọc phiên bản cũ bằng `<sha>:<tệp>` (không `./`) → ca đỏ «thư mục con: thiếu đề xuất tuoi <mã>»; bản sao bỏ dòng cảnh báo lịch sử cụt → ca đỏ «lịch sử cụt mà không cảnh báo».

## Coverage

Quét bằng `morphological-scan` (preset entity-feature, thực thể = một hàng lộ trình lúc máy rà soát) — bản đầy đủ ở
`_acceptance/ra-soat-lo-trinh/coverage-scan.md` (rút từ tài liệu B′ §8). Chân sản phẩm `[SUY-TỪ-REPO: scripts/lo-trinh.mjs]`
+ số đo 14/10 trên crm và kit; chân ngành `[NGÀNH: GitHub actions/stale]` (đánh dấu cũ · nhãn miễn trừ · đụng thì đặt
lại đồng hồ), `[NGÀNH: Linear — auto-close]` (không đóng khi chu kỳ gắn việc chưa xong), `[NGÀNH: Shape Up — không backlog]`.

- Trục A — vị trí hàng: mốc chiến dịch đã qua ngày · mốc chiến dịch chưa tới · mốc người/sự kiện · không thuộc mốc  [thước CE: `moc[].loai`, `moc[].ngay`, B′ §8 Core 2] → AC-1, AC-6, AC-7
- Trục B — trạng thái: chưa có hồ sơ · đang mở · đã giao · xếp lại (hồ sơ / tự khai) · đã bác · hỏng · không suy được  [thước CE: ô bản đồ `SECTIONS`, `suyTrangThai`] → AC-1, AC-9
- Trục C — chính sách: không khai · khai đúng · khai sai  [thước CE: B′ §6 + actions/stale] → AC-2, AC-3 (hàng ghim → vòng 2; hàng vừa nối tín hiệu → giới hạn khai ở Notes)
- Trục D — mặt hiện: thẻ khởi động · lệnh chữ · lệnh JSON · trang (không đổi) · cắt lượt · gói road-map  [thước CE: B′ §11] → AC-4, AC-5, AC-6, AC-7, AC-10
- Lớp chữ: «chờ điều kiện» ở mọi mặt người đọc  [thước CE: B′ §9] → AC-8
- Trục E — đầu vào không đọc được: tệp lộ trình hỏng · thư mục con của kho git · không phải kho git · clone nông  [thước CE: Cổng Bằng chứng 15/10, Ngoài-2/3/7/10/11/12 — «màu xanh chưa từng chạy» ở ranh giới] → AC-11
- Trục B′ — trạng thái tự khai không hồ sơ ngoài «xếp lại»: đã bác · đang làm · ngoài phạm vi  [thước CE: Ngoài-4/13] → AC-2

## Đường đo

- «Ở lần mở thẻ đầu sau mốc khép kế, mọi hàng của mốc đã khép mà chưa giao và chưa có hồ sơ đang mở đều hiện đề xuất»
  — số đọc ở hồ sơ mốc kế (mốc kit 05/11): tập (a) = hàng của mốc `phat-hanh` đã qua ngày, chưa giao, không có hồ sơ đang
  mở, đếm độc lập từ tệp lộ trình + bản đồ; tập (b) = mục của `--ra-soat --json` có luật `moc-qua-ngay` hoặc `xep-lai` /
  `ho-so-bac` trên các hàng ấy; và vế «a dời mốc» của dòng tổng trên thẻ. SỐNG khi (a) = (b) và vế thẻ = số mục
  `moc-qua-ngay` của (b). Hàng có hồ sơ đang mở của mốc đã qua hiện ở dòng «Hàng trễ» sẵn có — không thuộc ngưỡng này.
  Bảo đảm bởi AC-1, AC-4. Đếm mỗi mốc, như năm dòng số.
- «Chủ kho không phải hỏi hàng nào cần dời» — dòng 2 của luật (c) (lượt gọi người ngoài thiết kế) ở hồ sơ mốc kế; vòng
  này bảo đảm vật (thẻ có đề xuất), việc chủ kho thôi hỏi là cạnh *mù* — reality đọc.

## Out of scope

- Máy tự áp đề xuất (báo trước một nhịp, trần thao tác), bộ ghi tệp lộ trình, lệnh `ghim`/`bo-ghim`/`tra-lai`/`gui` — vòng 2 của gói road-map.
- Chính sách chốt ở thẻ mở đợt và phân loại đề xuất của thợ vào cửa tín hiệu — gói điều phối, vùng máy M5.
- Rà soát chính các mục «chờ điều kiện» theo `mo_lai_khi`; luật ưu tiên khi hai luật ngược nhau (vòng này một hàng nhận đề xuất của luật đầu khớp theo thứ tự bảng §3 của design).
- `loai` của mốc vào khối dữ liệu trang; bản đồ hiện trạng liên kho; đọc `bat_khi` sau khi giao.
- Đổi khoá `chan_troi` (chỉ đổi chữ hiển thị).

## Notes

- Rà soát chỉ hiện ở thẻ khởi động và lệnh vì nó phụ thuộc hôm nay; trang lộ trình tất định (AC-6).
- Mốc chiến dịch chỉ là `loai: phat-hanh` — mốc không khai `loai` (crm: 3 mốc, đều của người) không được rà soát.
- Tín hiệu nối vào hàng chưa tính là chạm khi tính tuổi.
- Đổi chữ «chân trời» đổi byte trang lộ trình CHỈ ở kho có cờ khuôn `chan_troi` sai dạng — kho ấy vẽ lại trang khi nâng engine.
- Con trỏ thay thế (ca đo, không sửa hồ sơ đã ký): LT-97 thêm ba dạng cờ chính sách và đổi hai câu đích sang «chờ điều kiện»;
  LT-131, LT-132, LT-166 đổi câu ghim sang «chờ điều kiện»; LT-147 và LT-168 so răng phủ với bộ máy đời trước qua phép đổi chữ
  «chân trời» → «chờ điều kiện»; LT-100 so với cây tắt thêm nhát tắt khối rà soát trên thẻ start (TAT_MC); MC-5 (hồ sơ
  `moc-la-chien-dich`) bỏ đúng khối rà soát trước khi so dòng thẻ với bộ máy gốc — lời hứa gốc của mỗi ca giữ nguyên nghĩa.
  P200 khoá thêm số phiên bản gói road-map (7 đột biến). Lý do từng chỗ: sổ quyết định, dòng `fix` stage S3.
- Tuổi hàng tính theo lịch sử git tới HEAD: kho clone nông cho tuổi tối thiểu — lệnh và thẻ in một dòng «lịch sử cụt» (AC-11).
- Known limits — chọn ở Cổng Bằng chứng 2026-10-15:
  - Ngoài-14: hai câu cảnh báo về chính sách tuổi và trần trên trang lộ trình vẫn in tên khoá kỹ thuật (`tuoi_ngay`, `tran_ke_tiep`) thay vì chữ thường — khó đọc hơn, không sai kết quả.
  - Ngoài-19: một mốc chứa mã gõ sai hoặc mã đã xoá có thể sinh cảnh báo thừa «đổi đích chiến dịch giữa chừng» khi cắt lượt.
  - Ngoài-20: phép kiểm đổi chữ «chờ điều kiện» chưa so mã thoát của răng phủ với bộ máy gốc — đổi hành vi răng phủ mà giữ chữ sẽ lọt ca này (ca khác phủ một phần).
  - Ngoài-23: phép quét chữ «chân trời» bỏ qua dòng tiêu đề và gạch đầu dòng trong tài liệu markdown — chữ cũ viết lại ở đó sẽ không bị bắt.
- Gói `road-map` đọc lõi qua bộ giải gói (bản mới nhất trên máy); chỉ đọc nên lệch phiên bản chỉ ảnh hưởng hiển thị.
