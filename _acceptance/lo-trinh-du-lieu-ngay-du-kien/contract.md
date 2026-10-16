---
schema_version: 1
feature: Kho tiêu thụ đọc khối dữ liệu trang lộ trình và có giờ máy của từng hàng, giờ máy cùng ngày dự kiến của từng mốc — kèm cờ khi số đo chưa đủ; trang đọc bản cũ vẫn chạy y như trước
slug: lo-trinh-du-lieu-ngay-du-kien
owner: phanlemanh@gmail.com
risk_tier: T2               # hàng RM6c khai T2: scripts/lo-trinh.mjs (vùng khối dữ liệu) + tài liệu kho tiêu thụ + ca đo mới — không chạm lib/**, hooks/**, lưới trước-merge, lệnh khoá
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-16-lo-trinh-du-lieu-ngay-du-kien-design.md
status: draft
---

# Acceptance Contract: lo-trinh-du-lieu-ngay-du-kien

## Context

Hàng RM6c của gói road-map (B′), đứng trên RM6 (`lo-trinh-gio-may`, đã ký 16/10). Chủ kho ký Cổng Đáng 16/10. RM6 đưa giờ
máy và dự báo đóng băng lên trang `LO-TRINH.html` nhưng không vào khối dữ liệu máy đọc của trang; trang Lộ trình trong CRM
chỉ đọc khối. Vòng này đưa đúng những gì trang đã in vào khối — trang người nhìn giữ nguyên từng byte.

Kho thử trong mọi ca do code sinh trong lượt: thư mục tạm, `git init`, commit ghim ngày, hồ sơ dựng theo hình ô của bản
đồ (bộ dựng `tests/scripts/lo-trinh-kho-thu.mjs`), «hôm nay» ghim bằng `ACCEPTANCE_TODAY` (mặc định D = 2026-10-20).
Giá trị mong đợi viết sẵn trong ca, không rút từ đầu ra của hàm đang đo — trừ phép so «khối == trang», nơi chữ trang rút
từ HTML của CÙNG lần vẽ là chính thứ được so. «Bộ máy gốc» = `git archive <gốc so> scripts lib skills commands road-map`,
gốc so đọc từ `_acceptance/lo-trinh-du-lieu-ngay-du-kien/goc-so` (31c5b8df — tại đó hàm `docDuLieu` giống từng byte bản
chép của crm, sha256 hàm rút `081c13c3e674ad5cf2f8e37d7f3e88cd14a8a465ff0ddcc2431ee812946a3321`).

## Criteria

- AC-1: Given kho thử có sáu hàng, không hồ sơ đo:
  - A hạng T2 `gio_may: 6`; B hạng T2 `gio_may: [3, 5]`; C hạng T2 `gio_may: "nhiều"`;
  - E hạng T3 không khoá; F không khoá, không hạng;
  When vẽ trang lộ trình, Then mỗi `hang.gio_may` của khối:
  - `chu` BẰNG đúng chữ ô giờ máy (`<span class="gm">`) trang in cho việc đó trong cùng lần vẽ;
  - `[thap, cao, nguon]` BẰNG dãy viết sẵn `A [6,6,khai] · B [3,5,khai] · C [4,7,luat] · E [7,10,luat] · F [4,7,luat]`;
  - `phan_tram_tuan` là `null` và `phan_tram_chu` là «chưa ước (0/5 vòng đo)» ở cả năm hàng.
  Given trang vẽ bằng lối không qua phân tích kho (`renderTrang` trên kết quả không có lớp giờ máy), Then mọi
  `hang.gio_may` là `null` và lối vẽ không ném. Phần trang NGOÀI khối dữ liệu (thứ người nhìn thấy) của kho thử giống
  từng byte trang bộ máy gốc vẽ.
  Chiều đỏ: bản sao bỏ nhãn nguồn khỏi `chu` → ca đỏ «chữ giờ máy của khối lệch trang: C».
- AC-2: Given kho thử có sáu hồ sơ T2 đã giao, mỗi hồ sơ mang dòng `gio-may` đo `[3, 4, 5, 6, 8, 2]` giờ, năm trong sáu có
  `phan_tram_tuan` `[2, 3, 4, 5, 6]`, và ba hàng chưa giao: G hạng T2 không khoá, H hạng T3 không khoá, K hạng T2
  `gio_may: 6`, When vẽ trang, Then:
  - G: `nguon` "do", `co` null, `chu` «3–6 giờ máy (theo 6 vòng đo) · ~4 % hạn mức tuần», `phan_tram_tuan` 4;
  - H: `nguon` "luat", `co` «máy ước», `chu` «7–10 giờ máy (máy ước) · ~4 % hạn mức tuần»;
  - K: `nguon` "khai", `co` null.
  Given chỉ bốn hồ sơ có `phan_tram_tuan`, Then G có `phan_tram_tuan` null và `phan_tram_chu` «chưa ước (4/5 vòng đo)».
  Chiều đỏ: bản sao luôn ghi `co` null → ca đỏ «cờ số đo chưa đủ vắng: H».
- AC-3: Given kho thử có mốc M `phat-hanh`, mục tiêu D+2, gắn một hàng T2 `gio_may: 5`, một hàng T3 không khoá và một
  hàng đã giao, và mốc N mà mọi hàng gắn đã giao, When vẽ trang, Then:
  - `moc.gio_may` của M: `[thap, cao]` = `[15.5, 20]`, `chu` «~15,5–20 giờ máy» — BẰNG phần giờ máy của dòng mốc M trang in;
  - `moc.gio_may` của N là `null`.
  Chiều đỏ: bản sao cộng cả hàng đã giao vào tổng khối → ca đỏ «giờ máy mốc lệch trang: M».
- AC-4: Given kho thử hôm nay D với ba mốc:
  - M mục tiêu 2026-10-22, hồ sơ mở sớm nhất của M có `du-bao.json` ngày tính 2026-10-18, hoàn tất 2026-10-23;
  - P mục tiêu 2026-10-30, `du-bao.json` hoàn tất 2026-10-25;
  - Q mục tiêu 2026-11-05, không hồ sơ nào có `du-bao.json`;
  When vẽ trang, Then:
  - M: `du_kien` = `{ngay_tinh: "2026-10-18", hoan_tat: "2026-10-23", chu: "dự báo lúc bắt đầu (18/10): hoàn tất 23/10"}`,
    `qua_tai` = «mốc quá tải: dự kiến 23/10, mục tiêu 22/10» — cả hai BẰNG chữ trang in trên dòng mốc M;
  - P: `du_kien.hoan_tat` "2026-10-25", `qua_tai` null;
  - Q: `du_kien` null, `qua_tai` null (không bịa ngày từ ngày mục tiêu).
  Chiều đỏ: bản sao điền `du_kien` của mốc chưa đóng băng bằng ngày mục tiêu → ca đỏ «ngày dự kiến bịa: Q».
- AC-5: Given kho thử của AC-4, When vẽ trang hai lần với `ACCEPTANCE_TODAY` 2026-10-20 và 2026-11-30, dưới hai múi giờ
  `TZ` khác nhau, Then hai khối dữ liệu giống từng byte, và `product-map.mjs --check` trên trang đã commit thoát 0 ở lần
  thứ hai. Chiều đỏ: bản sao tính `du_kien` bằng dự báo sống theo hôm nay → ca đỏ «khối đổi theo hôm nay».
- AC-6: Given trang vẽ bằng bộ máy gốc trên kho thử của AC-4 (khối không có khoá giờ máy), When bộ đọc mẫu `docDuLieu`
  mới đọc trang, Then:
  - không ném, `duLieu` khác null;
  - mọi `hang.gio_may`, `moc.gio_may`, `moc.du_kien`, `moc.qua_tai` là `null`;
  - `canhBao` có đúng MỘT câu và câu ấy chứa «chưa có giờ máy và ngày dự kiến»;
  - mọi khoá khác bằng đúng kết quả bộ đọc gốc đọc cùng trang.
  Given trang mới, Then bộ đọc mới cho 0 cảnh báo. Chiều đỏ: bản sao bỏ cảnh báo trang đời trước → ca đỏ «trang đời trước
  không cờ».
- AC-7: Given trang vẽ bằng bộ máy mới trên kho thử của AC-4, When bộ đọc GỐC (hàm `docDuLieu` rút từ bộ máy gốc, sha256
  bằng số ghim ở Context — chính bản chép của crm) đọc trang, Then:
  - không ném, `duLieu` khác null, `canhBao` rỗng;
  - bỏ ba khoá mới khỏi kết quả thì bằng ĐÚNG kết quả bộ đọc gốc đọc trang của bộ máy gốc trên cùng kho (chỉ thêm, không
    đổi nghĩa khoá nào);
  - `phien_ban` của khối là 2.
  Ca tự kiểm băm của hàm gốc trước khi tin (băm lệch → FAIL «bộ đọc gốc không phải bản chép của crm»).
  Chiều đỏ:
  - bản sao đổi nghĩa một khoá bản 2 (thêm phần tử vào `moc.hang`) → ca đỏ «khoá bản 2 đổi: moc.hang»;
  - bản sao tăng `PHIEN_BAN_DU_LIEU` → ca đỏ «bộ đọc gốc cảnh báo khuôn mới».
- AC-8: Given bộ máy mới, Then:
  - bảng khoá trong khối `LO-TRINH-DU-LIEU-KHOA` của `skills/acceptance/references/lo-trinh-du-lieu.md` BẰNG
    `KHUON_DU_LIEU` ở MỌI cấp, kể cả ba cấp mới `gio_may`, `gio_may_moc`, `du_kien`;
  - bảng khoá bên trong `docDuLieu` (đọc bằng khối rỗng mọi cấp, như LT-118) BẰNG `KHUON_DU_LIEU` ở mọi cấp, kể cả ba cấp mới;
  - bản chép rời của `docDuLieu` (ngoài mô-đun) cho đúng kết quả bản trong mô-đun trên trang của AC-4 và trang đời trước;
  - bảng «Đọc khoan dung» của tài liệu có một dòng cho trang thiếu giờ máy.
  Chiều đỏ:
  - bản sao tài liệu bỏ dòng `du_kien.hoan_tat` → ca đỏ «cấp du_kien: mã so tài liệu thiếu hoan_tat»;
  - bản sao bộ đọc bỏ cấp `du_kien` khỏi bảng bên trong → ca đỏ «bảng khoá trong docDuLieu lệch KHUON_DU_LIEU — du_kien».

## Coverage

Quét hình thái (preset test-matrix), bốn trục:

- Tầng dữ liệu: giờ máy hàng (AC-1, AC-2) | giờ máy mốc (AC-3) | ngày dự kiến mốc (AC-4) | cờ quá tải mốc (AC-4)
  [thước CE: mọi chỗ trang in giờ máy — `gioMayO` và `gioMayMoc` trong `scripts/lo-trinh.mjs`; SUY-TỪ-REPO]
- Nguồn số: khai trên hàng (AC-1, AC-2) | luật, chưa đủ số đo (AC-1, AC-2) | đo ≥ 5 vòng (AC-2) | % thiếu (AC-2) | không
  qua phân tích kho (AC-1) | mốc hết việc mở (AC-3) | mốc chưa đóng băng (AC-4)
  [thước CE: các nhánh của `uocHang`, `tongMoc`, `duBaoDongBang` trong `scripts/gio-may.mjs` + `scripts/lo-trinh.mjs`]
- Cặp trang × bộ đọc: mới×mới (AC-6) | đời trước×mới (AC-6) | mới×gốc (AC-7) | đời trước×gốc (không đổi — đối chứng trong
  AC-7) [thước CE: ma trận tương thích hai chiều của tiến hoá khuôn dữ liệu — NGÀNH: Protocol Buffers, quy tắc «Updating
  A Message Type» (thêm trường là tương thích hai chiều)]
- Tính chất khối: tất định (AC-5) | tài liệu == mã (AC-8) | bộ đọc tự đủ (AC-8)
  [thước CE: luật đã khai của tài liệu kho tiêu thụ — `skills/acceptance/references/lo-trinh-du-lieu.md`]

Later: ngày dự kiến sống trong khối · ngày riêng từng hàng. Never: sửa trang CRM trong kit (việc của LT1e).

## Đường đo

- Ngưỡng Cổng Đáng (trang CRM hiện ngày dự kiến của ≥ 1 mốc đang chạy, không hộp cảnh báo khuôn): số đọc ở kho crm sau
  khi crm nhận bản kit có RM6c cùng LT1e — đọc bằng trang Lộ trình của crm. Phía kit bảo đảm khối mang ngày (AC-4) và bộ
  đọc cũ không cảnh báo (AC-7); phía crm đo trong vòng LT1e.

## Out of scope

- Ngày dự kiến sống theo hôm nay trong khối — trang so từng byte ở CI; bản sống có ở `/road-map:xem`.
- Ngày dự kiến riêng từng hàng — trang không in; hàng đọc ngày của mốc chứa nó qua `moc.hang`.
- Sửa trang Lộ trình trong CRM — hàng LT1e bên crm.
- Đo lớp kiểm khoá zod của crm trong bộ kiểm kit — đo tay 16/10 (bảng ở design doc); LT1e đo lại khi nhận kit.
- Đổi trang `LO-TRINH.html` người nhìn.

## Notes

- Hỏi-1 (Cổng Phạm vi): giữ phiên bản khuôn 2 (khuyến nghị) hay tăng lên 3. AC-7 viết theo khuyến nghị; chủ kho chọn tăng
  thì AC-7 đổi vế «`canhBao` rỗng» thành «đúng một cảnh báo khuôn mới hơn», vế `phien_ban` thành 3, và bỏ chiều đỏ thứ hai.
