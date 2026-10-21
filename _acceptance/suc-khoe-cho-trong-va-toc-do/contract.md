---
schema_version: 1
feature: Bộ phát lịch chỉ giảm tải khi máy đang nghẹt thật hoặc thiếu chỗ cho làn sắp cấp — không vì swap cũ hay một tiến trình lớn hợp lệ; lượt chạy dưới tải được gắn nhãn và thử lại một lần thay vì tính là lỗi vật; ngưỡng hiệu chuẩn từ các lượt bị hạ tầng đốt
slug: suc-khoe-cho-trong-va-toc-do
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: approved
design_doc: docs/superpowers/specs/2026-10-21-suc-khoe-cho-trong-va-toc-do-design.md
approved_by: Manh Phan
approved_at: 2026-10-21
lo_trinh_ma: SK1
---

## Context

Hàng SK1 của lộ trình kit. Chủ kho 21/10, nguyên văn: «Mở phiên điều tra nếu đúng hiện trạng thì đưa vào lộ trình và
xử lý» — chữ build có điều kiện; điều tra `docs/findings/2026-10-21-suc-khoe-may-do-sai.md` chứng đúng. Gốc:
crm-onehub/_acceptance/dieu-phoi-hai-tang/ — AC-4 của hồ sơ ấy khoá «swap dùng > `swap_gb` → giảm tải» và «một tiến
trình RSS > `rss_gb` → cần người». Trên macOS swap đã dùng giảm vài chục MB mỗi giờ khi máy rảnh, nên một máy từng nghẹt
đứng ở giảm tải nhiều giờ khi áp lực đã về bình thường (M5 20/10: hơn 2 giờ; MacBook Pro 21/10: hàm thật trả giảm tải với
áp lực mức 1, trống 46 %). Phạm vi chủ kho giao ở `opportunity.md` mục «Phạm vi chủ kho giao (21/10)».

Số đo dùng trong tiêu chí (một nguồn — finding trên):
- **Máy kiểu M5 20/10:** RAM 128 GB, `memorystatus_level` 48, áp lực 1, swap 9,7/11 GB.
- **Máy kiểu MacBook Pro 21/10:** RAM 36 GB, `memorystatus_level` 46, áp lực 1, swap 12,0/13 GB.

## Criteria

- AC-1: Given cấu hình mẫu của gói và số đo kiểu M5 20/10, rồi kiểu MacBook Pro 21/10 (mỗi bộ một lần, swap đã dùng
  vượt 8 GB ở cả hai), When một nhịp bộ phát lịch chạy với một đơn `s4` đang chờ, Then trạng thái đợt là `dang-chay`,
  đơn được cấp, không có sự kiện `giam-tai`, và `trang-thai.json` mang swap đã dùng/tổng trong khối ghi của sức khoẻ chứ
  không trong lý do giảm tải; cùng hai bộ số ấy với áp lực mức 2 thì giảm tải (đối chứng trên cùng fixture).
- AC-2: Given áp lực bộ nhớ tiêm mức 2, rồi mức 4, When nhịp chạy với đơn `s4`, `ghim-lai`, `duong-nen` và `merge` cùng
  chờ, Then trạng thái là `giam-tai` với lý do đúng chuỗi `áp lực bộ nhớ mức <N>`, chỉ `merge` được cấp, và qua ba nhịp
  liên tiếp chỉ có đúng một sự kiện `giam-tai` mang `can_phan: true`; về mức 1 thì có đúng một sự kiện `het-giam-tai`;
  và cùng bốn đơn ấy ở áp lực mức 1 ngay từ đầu thì không giảm tải, cả bốn loại được xét cấp (dưới ngưỡng → không xảy ra).
- AC-3: Given nhu cầu của loại `s4` đã biết là 12 GB với hệ số 1,5 (cần 18 GB), When nhịp chạy với chỗ trống 16,6 GB
  (36 GB × 46 %), Then đơn `s4` không được cấp và ở lại hàng chờ với lý do đúng chuỗi `thiếu chỗ: cần 18.0 GB, trống
  16.6 GB`, trạng thái đợt vẫn là `dang-chay`, đơn `merge` và đơn của loại chưa biết nhu cầu cùng nhịp vẫn được cấp,
  qua nhiều nhịp chỉ có một sự kiện `thieu-cho` với `can_phan: false`, và cả `bang.html` lẫn `xem` hiện đúng chuỗi lý do
  ấy cạnh đơn; chỗ trống 18,4 GB (36 GB × 51 %) thì `s4` được cấp và chuỗi ấy vắng ở cả hai.
- AC-4: Given một tiến trình giữ 19 GB RSS và mọi số đo khác như máy khoẻ, When nhịp chạy, Then không có sự kiện
  `can-nguoi`, `bang.html` không có dòng «Cần anh», `xem` không in nó, và `trang-thai.json` ghi tên tiến trình cùng số GB
  trong khối ghi của sức khoẻ.
- AC-5: Given một khoá `s4` đang giữ, When áp lực ở mức ≥ `ap_luc_muc` liền 2 phút qua các nhịp, hoặc tốc độ swapin đọc
  từ `vm_stat` liền 2 phút ≥ `swapin_mb_phut` khi kho đặt ngưỡng ấy, Then `do-dang-chay/s4.json` mang nhãn dưới tải có
  mốc bắt đầu và lý do (`áp lực bộ nhớ mức <N>` hay `swapin <x> MB/phút`); áp lực mức 2 chỉ 30 giây rồi về mức 1, hoặc
  tốc độ cao khi kho không đặt ngưỡng, thì không có nhãn (chiều im); tốc độ tính đúng từ hai bản `vm_stat` thật cỡ trang
  16384 byte.
- AC-6: Given một lượt `s4` mang nhãn dưới tải, When thợ nhả khoá, Then nhịp kế ghi đúng một sự kiện `luot-duoi-tai` có
  phiên, slug, tài nguyên, commit của worktree lúc cấp và `duoc_thu_lai: true`; lượt thứ hai cùng phiên, slug, loại và
  CÙNG commit cũng mang nhãn thì `duoc_thu_lai: false`, còn trên commit khác thì lại `true`; lượt không nhãn khép thì không có sự kiện ấy; và luật thợ của mẫu nói cách đọc nhãn trước khi
  nhả, rằng lượt mang nhãn mà đỏ thì chấm lại đúng commit đó một lần khi được thử lại, không sửa vật trước lần chấm lại,
  và lần chấm lại vẫn đỏ thì đỏ là của vật (judgment).
- AC-7: Given một lượt nặng vừa khép — thợ nhả (có hoặc không `--ma <mã>` và `--ha-tang <lý do>`) hoặc bộ phát lịch thu
  hồi vì hết hạn thuê, When nhịp kế chạy, Then sổ đo cấp máy `do-lan.jsonl` có đúng một dòng mới mang kho, loại, phiên,
  slug, commit lúc cấp, mốc cấp và khép, chỗ trống lúc cấp, nguồn nhu cầu lúc cấp (`so`, `cau-hinh`, `chua`), nhu cầu (chỗ trống lúc cấp trừ chỗ trống thấp nhất trong lượt), áp lực và tốc
  độ swapin cao nhất, nhãn dưới tải, cờ `chong` khi có lượt nặng khác giữ khoá ở bất kỳ nhịp nào của lượt, cách khép (`nha` hay `thu-hoi`), mã thoát, và `ha_tang: true` khi thu hồi, mã 137
  hay 143, hoặc có `--ha-tang`; tệp `do-dang-chay` của lượt đã xoá; dòng do chính nhịp thật ghi và được chính bộ đọc của
  lệnh `hieu-chuan` đọc lại đủ trường.
- AC-8: Given sổ đo cấp máy, When bộ phát lịch xác định nhu cầu của một loại làn, Then có ≥ `mau_hieu_chuan` (mặc định 5)
  dòng SẠCH cùng kho và loại (không mang nhãn dưới tải,
  không `ha_tang`, không `chong`) → nhu cầu là p95 của các nhu cầu ấy và thắng số trong cấu hình; ít hơn → số
  `suc_khoe.dinh_lan_gb.<loại>` của cấu hình; không có cả hai → không xét chỗ, `trang-thai.json` liệt loại đó trong
  `chua_hieu_chuan`; và lệnh `dieu-phoi.mjs hieu-chuan` in mỗi loại số lượt, p95, nguồn đang dùng (`sổ`, `cấu hình`,
  `chưa hiệu chuẩn`), cùng mỗi lượt bị hạ tầng đốt kèm chỗ trống và áp lực lúc cấp.
- AC-9: Given văn bản thật của `sysctl vm.swapusage`, `sysctl -n kern.memorystatus_level`, `sysctl -n hw.memsize` và
  `vm_stat` chụp trên MacBook Pro 21/10, When các hàm đọc chạy trên đúng văn bản ấy, Then chúng trả đúng swap, phần trăm
  khả dụng, RAM, cỡ trang và bộ đếm Swapins; văn bản hỏng hay rỗng trả `null` và nhịp không giảm tải, không xét chỗ vì số
  `null`; và trên macOS một ca đọc số đo sống bằng đúng các lệnh bộ phát lịch chạy rồi gọi hàm đánh giá với cấu hình mẫu —
  ở máy có áp lực mức 1 thì không giảm tải (trên hệ khác ca này là ô bỏ qua có tên).
- AC-10: Given cấu hình đợt, When `kiemCauHinh` đọc, Then cấu hình đời trước còn `swap_gb`, `rss_gb` (8, 11, 16) vẫn qua
  và không làm giảm tải; thiếu `ap_luc_muc` vẫn bị từ chối; mỗi khoá mới sai giá trị bị từ chối với thông điệp nêu đúng
  trường (`suc_khoe.he_so_cho phải là số lớn hơn 1`, `suc_khoe.dinh_lan_gb.<loại> phải là số GB dương`, `suc_khoe.dinh_lan_gb
  khoá lạ <k>`, `suc_khoe.swapin_mb_phut phải là số dương`, `suc_khoe.duoi_tai_phut phải là số phút dương`,
  `suc_khoe.mau_hieu_chuan phải là số nguyên dương`); mẫu `mau/dieu-phoi.config.json` qua và không còn `swap_gb`, `rss_gb`;
  và ca DP1-07 vẫn xanh.

## Coverage

Bỏ quét morphological-scan — sổ quyết định dòng «bỏ coverage-scan — …»: phạm vi đã chốt bên ngoài (ba vế + hai chiều đo
của chủ kho ở `opportunity.md`). Trục dưới tự liệt từ phạm vi ấy và mã đọc được, không qua quét:
- Trục A · vế: cấp làn (AC-1, AC-2, AC-3) | trong lúc chạy (AC-5, AC-6) | hiệu chuẩn (AC-7, AC-8) | chỉ ghi (AC-1, AC-4).
- Trục B · chiều đo: chặn có thông điệp ghim (AC-2, AC-3, AC-10) | im trên hai máy đã đo (AC-1, AC-3 vế cấp, AC-5 vế im,
  AC-9 ca sống) | đối chứng dương cùng fixture (AC-1 vế áp lực 2, AC-3 vế 18,4 GB).
- Trục C · nguồn số đo: văn bản thật của macOS (AC-9) | số tiêm (AC-1–AC-8) | đọc hỏng (AC-9).
- Trục D · đọc-cũ: cấu hình đời trước (AC-10) | bảng và `xem` đọc trạng thái (AC-4) | đợt đang giữ khoá lúc nhận gói
  (AC-7: lượt không có tệp `do-dang-chay` khép mà không ghi sổ, không lỗi).
- Trục E · loại làn: `s4` | `ghim-lai` | `duong-nen` | `merge` luôn được xét như cũ (AC-2, AC-3).

## Đường đo

- Thước: 14 ngày sau khi crm nhận mốc có SK1, không lần giảm tải nào mà lý do không phải áp lực bộ nhớ · số từ:
  `su-kien.jsonl` của mọi đợt trên hai máy — đếm sự kiện `giam-tai` có lý do không bắt đầu bằng `áp lực bộ nhớ mức` —
  phải bằng 0 · chiều đỏ: máy nào còn chạy gói trước SK1 thì lý do `swap …` hiện ở đây · mẫu số N = số nhịp có số đo
  trong cửa sổ (số lần `trang-thai.json` đổi `nhip_cuoi`); N = 0 thì thước vô hiệu · bảo đảm bởi: AC-1, AC-2.
- Thước: không làn nặng nào chờ «thiếu chỗ» oan · số từ: `su-kien.jsonl` — mỗi sự kiện `thieu-cho` ghép với sự kiện `cap`
  kế của cùng phiên và loại, rồi với dòng `do-lan.jsonl` của lượt ấy: chờ oan = lượt ấy, khi được cấp, có `nhu_cau_gb`
  nhỏ hơn chỗ trống lúc nó bắt đầu chờ — tổng phút chờ oan phải ≤ 5 % tổng phút có đơn nặng chờ [đề xuất của máy] ·
  mẫu số N = số sự kiện `thieu-cho`; N = 0 thì vế này không đọc · bảo đảm bởi: AC-3, AC-7, AC-8.
- Thước: không ngưỡng sức khoẻ nào phải chỉnh tay trong thư mục đợt · số từ: so `ap_luc_muc`, `he_so_cho`,
  `duoi_tai_phut`, `mau_hieu_chuan`, `swap_gb`, `rss_gb` trong khối `suc_khoe` của `dieu-phoi.config.json` mỗi đợt với mẫu
  của gói đã cài — số đợt có khoá khác mẫu phải bằng 0 (`dinh_lan_gb`, `swapin_mb_phut` là số hiệu chuẩn của kho, không
  đếm) · mẫu số N = số đợt mở trong cửa sổ · bảo đảm bởi: AC-8, AC-10.
- Thước phụ (đọc, không ngưỡng): số lượt mang nhãn dưới tải và số lượt bị hạ tầng đốt trong cửa sổ — lệnh `hieu-chuan`
  · bảo đảm bởi: AC-5, AC-7, AC-8.

## Out of scope

- Hai khoá S4 mỗi máy (CỘNG) — hạt giống `docs/plans/2026-10-21-hat-giong-hai-khoa-s4.md`.
- Engine đếm trần lượt chấm (`s4-args`) không đọc nhãn dưới tải: lượt chấm lại vì nhãn vẫn đếm vào trần 3 lượt của vòng.
  Ngưỡng mở: ≥ 1 vòng chạm trần mà ≥ 1 lượt của nó mang nhãn dưới tải.
- Chiều đỏ bằng áp lực THẬT (`memory_pressure -l warn`) trên máy dùng chung — bộ kiểm chỉ tiêm số.
- Giảm tải theo áp lực lật nhanh khi áp lực lật (40 lần/34 giờ trên MacBook Pro, finding §3) — giữ nguyên.
- Đo RSS cây tiến trình của từng làn — nhu cầu đo bằng hụt chỗ trống của máy trong lượt.
- Mặc định số cho nhu cầu làn và cho ngưỡng tốc độ swapin — chưa có số đo; cấu hình hay sổ đo đặt.
  Chủ kho chọn ở Cổng Phạm vi (Hỏi-1, 21/10): không số. Ngưỡng mở lại: ≥ 1 lượt bị hạ tầng đốt được cấp lúc chưa
  biết nhu cầu trong 14 ngày đo (đếm trên `do-lan.jsonl`: dòng `ha_tang: true` có `nguon_nhu_cau: "chua"`).
- Sửa AC-4 của hồ sơ crm `dieu-phoi-hai-tang` — kho tiêu thụ tự ghi khi nhận mốc.

## Notes

- Hạt giống ngoài vòng: `docs/plans/2026-10-21-hat-giong-hai-khoa-s4.md`.
- Chạm `dieu-phoi/` là vùng M5: đã báo M5 trên phanlemanh/acceptance-gate-kit#308 (20/10 23:53Z, tức 21/10 giờ Việt Nam) trước khi sửa.
