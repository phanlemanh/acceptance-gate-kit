---
schema_version: 1
feature: Chủ kho dời hay ghi đè ngày mục tiêu của một mốc mà trang lộ trình vẫn giữ dự báo lúc mốc bắt đầu, cờ quá tải vẫn tính theo mục tiêu mới, và phép đo lệch vẫn đọc được mốc ấy
slug: du-bao-dong-bang-theo-ma-moc
owner: phanlemanh@gmail.com
risk_tier: T2               # hàng RM6b khai T2: chỉ bộ đọc dự báo trong scripts/lo-trinh.mjs + ca đo — không chạm lib/**, hooks/**, lưới trước-merge, lệnh khoá
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-16-du-bao-dong-bang-theo-ma-moc-design.md
status: draft
---

# Acceptance Contract: du-bao-dong-bang-theo-ma-moc

## Context

Hàng RM6b, đứng trên RM6 (`lo-trinh-gio-may`, đã gộp `31c5b8df`). Dự báo đóng băng (`du-bao.json`, ghi lúc mở hàng) hôm
nay được tìm lại bằng tên ngắn của mốc KÈM ngày mục tiêu, nên đổi ngày mục tiêu là mất dự báo. Vòng này đổi BỘ ĐỌC: dự báo
về đúng một mốc theo mã hàng lúc đóng băng, chỉ khi hồ sơ là hồ sơ của một hàng trong chính lộ trình ấy — đúng phép gắn
hàng ↔ hồ sơ mà bộ đọc lộ trình đã dùng cho cột trạng thái: thư mục mang `slug` của hàng, hoặc đúng một hồ sơ nhận hàng
qua `lo_trinh_ma` trong ô cơ hội. Tên khớp nguyên văn vẫn là đường cũ. Nhiều mốc cùng nhận một dự báo: tên khớp nguyên văn
> chung nhiều mã nhất > tên bỏ ngày khớp > đứng trước trong tệp. Bên ghi và khuôn `du-bao.json` không đổi.

Kho thử trong mọi ca do code sinh trong lượt (thư mục tạm, `git init`, commit ghim ngày, «hôm nay» ghim bằng
`ACCEPTANCE_TODAY`, hồ sơ dựng theo hình ô của bản đồ, `du-bao.json` viết sẵn trong ca). Giá trị mong đợi viết sẵn trong
ca, không rút từ đầu ra của hàm đang đo. «Bộ máy gốc» = `git archive <gốc so> scripts lib skills commands road-map`, gốc
so đọc từ `_acceptance/du-bao-dong-bang-theo-ma-moc/goc-so`. Mỗi chiều đỏ chạy CHÍNH hàm đo trên bản sao của vật với nhát
tiêm khớp đúng một lần, SAU khi bản lành xanh trên cùng kho thử, và ghim thông điệp.

## Criteria

- AC-1: Given kho thử có mốc M «Phát hành M — bản thử» ngày 22/10 chở hàng P, Q, R (P có hồ sơ `p` mang `du-bao.json`
  đóng băng 15/10, tên «Phát hành M 22/10», hoàn tất 23/10, hàng [P, Q, R]), When:
  - dời ngày mục tiêu của M sang 25/10, hoặc
  - đổi tên M thành «Bản M đổi tên» và dời sang 25/10,
  rồi vẽ trang lộ trình, Then dòng của mốc trên trang vẫn có «dự báo lúc bắt đầu (15/10): hoàn tất 23/10».
  Chiều đỏ: bản sao chỉ khớp theo tên kèm ngày → ca đỏ «dời ngày mục tiêu làm mất dự báo đóng băng».
- AC-2: Given kho thử của AC-1, When dời ngày mục tiêu của M:
  - sang 21/10 → Then trang có đúng một cờ «mốc quá tải: dự kiến 23/10, mục tiêu 21/10»;
  - sang 25/10 → Then trang không có cờ «mốc quá tải».
  Chiều đỏ: bản sao so dự báo với mục tiêu lúc đóng băng (22/10) → ca đỏ «cờ quá tải theo mục tiêu lúc đóng băng».
- AC-3: Given kho thử có mốc «Mốc M» ngày 21/10 chở A, B, C đã giao (ký 18–20/10), mỗi hàng có số đo, hồ sơ `a` và `b`
  mang `du-bao.json` đóng băng 15/10 và 17/10 (tên «Mốc M 21/10»), When ghi đè ngày mốc bằng ngày khép thật 20/10 rồi
  chạy `lo-trinh.mjs --do-lech`, Then đầu ra BẰNG khối viết sẵn:
  - `Mốc M 20/10: dự báo 19/10 (đóng băng 15/10) · khép thật 20/10 · lệch 1 ngày · 1 hàng thêm sau đóng băng`;
  - `  giờ chờ: ước 0 (đo được lúc đóng băng: không) · đo 3,5`;
  - ba dòng ước-so-đo của A, B, C và `  3/3 vòng có số đo` như khối của RM6.
  Lệnh không ghi tệp nào.
  Given hàng không khai `slug`, mở bằng CHÍNH `lo-trinh.mjs --mo-o` của bộ máy mới (ô cơ hội và `du-bao.json` do lệnh
  ghi, không viết tay), rồi hồ sơ được giao và ký, When ghi đè ngày mốc và chạy `--do-lech`, Then dòng của mốc bắt đầu
  `<tên mốc mới>: dự báo` (không phải «chưa đóng băng»).
  Chiều đỏ: bản sao chỉ khớp theo tên kèm ngày → ca đỏ «đo lệch báo chưa đóng băng sau khi ghi đè ngày».
- AC-4: Given kho thử có hai mốc khép, mốc Y «Mốc Y» chở U (không hồ sơ nào mang `du-bao.json` của Y) đứng trước mốc X
  «Mốc X» chở A, B, C (dự báo đóng băng tên «Mốc X 21/10», hàng [A, B] và [A, B, C]), When đổi tên X thành «Mốc X đã
  phát hành», dời cả hai ngày, rồi chạy `--do-lech` và vẽ trang, Then:
  - `--do-lech` in đúng `Mốc Y 17/10: chưa đóng băng dự báo — không đo được lệch` cho Y, và khối lệch đầy đủ cho X;
  - trên trang, dòng của Y có mặt (đối chứng dương) và không có «dự báo lúc bắt đầu»; dòng của X có «dự báo lúc bắt đầu
    (15/10)».
  Chiều đỏ: bản sao đếm mọi mã đóng băng là mã chung, không xét mã có thuộc mốc không → ca đỏ «dự báo gắn nhầm mốc không
  chung mã: Mốc Y».
- AC-5: Given kho thử khai HAI lộ trình: lộ trình một có mốc X chở A, B, C (hồ sơ `a`, `b` mang dự báo đóng băng, hàng
  [A, B] và [A, B, C]); lộ trình hai có mốc «Mốc Z» chở hàng mã A của riêng nó (hồ sơ `a2`, đã giao, không dự báo), When
  dời ngày cả hai mốc rồi chạy `--do-lech`, Then dòng của lộ trình hai là đúng
  `docs/lo-trinh-2.json: Mốc Z <ngày>: chưa đóng băng dự báo — không đo được lệch`, và lộ trình một vẫn in khối lệch của X.
  Chiều đỏ: bản sao bỏ điều kiện «hồ sơ thuộc chính lộ trình» → ca đỏ «dự báo của lộ trình khác gắn vào: Mốc Z».
- AC-6: Given dự báo đóng băng của mốc X với hàng [A, B, C], sau đó hàng C dời sang mốc W (X còn A, B), When dời ngày cả
  hai mốc rồi vẽ trang và chạy `--do-lech`, Then dự báo hiện ở X và KHÔNG hiện ở W: dòng W trên trang không có «dự báo
  lúc bắt đầu», `--do-lech` in `Mốc W <ngày>: chưa đóng băng dự báo — không đo được lệch`.
  Given mốc X giữ tên «Mốc X» nhưng chỉ còn A, còn mốc W «Mốc W» chở B, C, When dời ngày cả hai, Then dự báo hiện ở W
  (chung nhiều mã đóng băng hơn), không ở X.
  Chiều đỏ:
  - bản sao gắn dự báo vào mọi mốc ứng viên → ca đỏ «dự báo hiện ở hai mốc: Mốc W»;
  - bản sao xếp tên bỏ ngày trước số mã chung → ca đỏ «dự báo về mốc chung ít mã hơn: Mốc X».
- AC-7: Given kho thử KHÔNG dời ngày, KHÔNG đổi tên mốc nào — gồm dữ liệu của AC-1 và AC-3, cộng một hồ sơ `le` không
  thuộc hàng nào mang `du-bao.json` tên «Phát hành M 22/10» đóng băng 10/10 —, When vẽ trang và chạy `--do-lech` bằng bộ
  máy mới và bộ máy gốc, Then trang, đầu ra `--do-lech`, `--ra-soat --json`, `--ap --json` và `--xem` giống TỪNG BYTE,
  sau đối chứng dương (bộ máy gốc thoát 0 với đầu ra khác rỗng ở mỗi lệnh, trang có «dự báo lúc bắt đầu (10/10)»). Mọi ca
  GM của RM6 vẫn xanh.
  Chiều đỏ: bản sao bỏ đường khớp tên nguyên văn → ca đỏ «khác bộ máy gốc: trang».
- AC-8: Given lộ trình THẬT của kit (`docs/plans/lo-trinh-kit.json`) và dự báo đóng băng thật của chính hồ sơ này
  (cả thư mục `_acceptance/du-bao-dong-bang-theo-ma-moc/` — ô cơ hội mang `lo_trinh_ma`, `du-bao.json` đóng băng 16/10),
  chép vào kho thử, When lùi ngày mục tiêu của mốc chở RM6b một ngày rồi vẽ trang, Then dòng của mốc ấy có «dự báo lúc
  bắt đầu (16/10)». Ca in «SKIP: DB-8 — …» chỉ khi tệp dự báo vắng hoặc không mốc nào chở RM6b. (Phép đo lệch trên dữ
  liệu thật chưa chạy được ở vòng này: mốc ấy chưa khép — đó là việc của ngưỡng lúc cắt mốc.)
  Chiều đỏ: bản sao chỉ khớp theo tên kèm ngày → ca đỏ «dữ liệu thật: dời mốc làm mất dự báo».

## Coverage

Quét không gian AC theo ba trục (skill morphological-scan, preset test-matrix tự dựng lại trục). Chân ngành:
`[NGÀNH: Microsoft Project baseline]` — đường cơ sở lưu theo công việc, dời ngày kế hoạch không xoá đường cơ sở.

- **Trục mốc đổi gì sau đóng băng:** không đổi · dời ngày · đổi tên + ngày · hàng dời sang mốc khác — AC-7, AC-1/AC-3,
  AC-1/AC-4, AC-6. [thước CE: ba trường của mốc mà bộ đọc dùng — `ten`/`ten_ngan`, `ngay`, `hang`]
- **Trục bề mặt đọc dự báo:** dòng mốc trên trang · cờ quá tải · `--do-lech` — AC-1, AC-2, AC-3. [thước CE: hai nơi gọi
  bộ tìm dự báo trong `scripts/lo-trinh.mjs` (`gioMayMoc`, `doLech`)]
- **Trục nguồn dự báo:** hồ sơ của hàng trong lộ trình · hồ sơ của lộ trình khác cùng mã · hồ sơ không thuộc hàng nào
  (đường tên cũ) · mốc không dự báo — AC-1, AC-5, AC-7, AC-4. [thước CE: `docDuBao` đọc mọi hồ sơ của kho]
- **Dữ liệu thật:** lộ trình kit + dự báo đóng băng thật đầu tiên — AC-8.
- Bên ghi (`--mo-o`) không đổi: đã có ca GM-5 của RM6 (đối tượng viết sẵn, giống byte bộ máy gốc) — chạy trong AC-7.

## Đường đo

- Ngưỡng «ở mốc phát hành đầu tiên sau khi RM6 lên `main`, ngày mốc ghi đè mà phép đo lệch vẫn in độ lệch»: số từ
  `lo-trinh.mjs --do-lech` trên `docs/plans/lo-trinh-kit.json` lúc cắt mốc — AC-3 bảo đảm bộ đọc, AC-8 bảo đảm trên dữ
  liệu thật của kit.

## Out of scope

- Đổi khuôn `du-bao.json` hay tệp lộ trình (thêm khoá định danh mốc) — bộ đọc khoan dung đủ; đổi khuôn là mọi kho trả giá.
- Đóng băng lại dự báo khi mốc đổi hàng sau lúc đóng băng — phép đo lệch đã đếm «hàng thêm sau đóng băng».
- Hai lộ trình có mốc trùng tên ngắn kèm ngày — giữ hành vi RM6 (đường tên cũ), không gỡ.
- Dòng «Giờ máy theo mốc» của lệnh xem — tính theo hôm nay, không đọc dự báo đóng băng.

## Notes

- Ca đo `DB-<n>` = AC-n, sống trong `tests/scripts/lo-trinh-gio-may.test.mjs` cạnh ca GM của RM6.
