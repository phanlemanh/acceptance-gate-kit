---
schema_version: 1
feature: Tài liệu nghiên cứu và thảo luận đi cùng lượt cắt tới vòng của từng hàng — nguồn của bản phạm vi nằm trong git, ô mở từ hàng mang dòng «Nguồn:», bước thiết kế nạp nguồn và thẻ Cổng Phạm vi chứng điều đó
slug: nguon-di-cung-luot-cat
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: draft
design_doc: docs/superpowers/specs/2026-10-24-nguon-di-cung-luot-cat-design.md
approved_by:
approved_at:
---

## Context

Hàng NG1. Chủ kho phát hiện 24/10/2026: lộ trình không mang bối cảnh nghiên cứu và thảo luận tới vòng làm việc —
khoá `nguon` của bản phạm vi là chữ tự do (ca crm HT3 trỏ một artifact ngoài git), và ô mở từ hàng không trỏ bản
phạm vi hay tài liệu nào. Gốc: crm-onehub/_acceptance/thanh-ben-khu-dung-chung/ (hàng VK1, đợt `okr-vo-khu-1810`):
ô không trỏ bản phạm vi hay báo cáo; sổ nhắc báo cáo một lần do tác tử tự tìm.

Thuật ngữ:
- **bản phạm vi** = tệp theo khuôn `skills/acceptance/references/pham-vi-template.md` (khối `PHAM-VI-MA`).
- **răng phủ** = `node scripts/cat-luot.mjs --root <kho> --pham-vi <tệp> --lo-trinh <tệp>`.
- **mở ô** = `node scripts/lo-trinh.mjs --root <kho> --hang <mã> --mo-o`.
- **dòng «Nguồn:»** = dòng của ô cơ hội mở đầu bằng tiền tố trong khối `OPP-NGUON-PREFIX` của
  `skills/acceptance/references/opportunity-template.md`; các đường dẫn của nó là các đoạn trong dấu backtick.
- **dòng nạp** = dòng sổ `stage: "S1"` mang mảng `nguon_nap` theo khuôn `DEC-NGUON-NAP` của SKILL feature-loop.
- **kho thử** = kho git dựng trong thư mục tạm của lượt chạy.

## Criteria

- AC-1: Given kho thử có bản phạm vi và tệp lộ trình đã vào git, phủ đủ mã, When chạy răng phủ với `nguon` là ma
  trận viết sẵn năm hàng — liên kết `https://…` · đường tuyệt đối · đường thoát gốc `../x.md` · tệp có trên đĩa mà
  chưa vào git · khoá rỗng — Then mỗi hàng thoát 1 và in đúng một dòng lỗi ghim: bốn hàng đầu
  `lỗi: nguồn «<mục>» không phải tệp trong git [nguon-ngoai-git]`, hàng cuối
  `lỗi: bản phạm vi thiếu nguon — ghi đường dẫn tệp nghiên cứu trong git [nguon-trong]`; cùng kho với `nguon` là hai
  tệp và một thư mục có tệp đã vào git (cách nhau dấu phẩy) thì thoát 0, không dòng lỗi nào nhắc nguồn.
- AC-2: Given khuôn bản phạm vi thật, When rút khối `PHAM-VI-MA` bằng bộ đọc của răng phủ, Then khoá `nguon` của mẫu
  tách ra ≥ 1 đường dẫn tương đối, không mục nào là liên kết; và các ca đang có của bộ đọc khuôn (đúng ba khoá, bảy
  mã — ca LT-130 của `tests/scripts/lo-trinh.test.mjs`) vẫn xanh.
- AC-3: Given kho thử có hàng `dot: d1`, `phu: [A1, A2]` và bản phạm vi `dot: d1` trong git với `nguon` là một tệp
  và một thư mục hai tệp, When mở ô, Then `opportunity.md` có đúng MỘT dòng «Nguồn:» đứng ngay sau dòng «Mở từ hàng …»,
  mang bản phạm vi kèm «(mã A1, A2)» rồi bốn đường không — bản phạm vi, tệp, hai tệp của thư mục — theo thứ tự khai;
  và bộ đọc dòng «Nguồn:» (rút tiền tố từ khuôn) đọc lại đúng bốn đường ấy (round-trip bên ghi → bên đọc).
- AC-4: Given cùng kho thử, When mở ô cho một hàng KHÔNG có `dot`, Then `opportunity.md` giống từng byte ô mà bộ máy
  trước vòng (`git archive <gốc vòng> scripts lib skills`) mở cho cùng hàng, cùng ngày (chiều im); và bản tiêm bỏ điều
  kiện «có `dot`» khỏi bên ghi thì ca này đỏ «hàng không dot mà ô có dòng Nguồn».
- AC-5: Given kho thử, When mở ô ở ba ca viết sẵn — bản phạm vi có `nguon` chữ tự do đời trước · `dot` không có bản
  phạm vi nào trong git · hai bản phạm vi cùng `dot` — Then dòng «Nguồn:» lần lượt: trỏ bản phạm vi kèm
  `ngoài git: «<chữ nguồn>»` · nói `không có bản phạm vi nào của đợt «<dot>» trong git` và không mang đường nào ·
  trỏ cả hai bản phạm vi; lệnh vẫn thoát 0 và in `moi: true` ở cả ba ca.
- AC-6: Given hồ sơ `draft` trong kho thử, When dựng thẻ Cổng Phạm vi (`gate-card.js --extract` và bản chữ của thẻ)
  qua ma trận viết sẵn bảy hàng — bốn hàng ô do chính lệnh mở ô sinh với dòng «Nguồn:» trỏ hai tệp: sổ không dòng nạp ·
  dòng nạp thiếu một tệp · dòng nạp đủ hai tệp đúng băm · đủ hai tệp nhưng một tệp sửa sau khi nạp; và ba hàng lấy đúng ô
  do lệnh mở ô sinh ở ba ca của AC-5 (chữ nguồn đời trước có chứa backtick · không có bản phạm vi · hai bản phạm vi), sổ
  không dòng nạp — Then mỗi hàng ghim `nguon.tep` (danh sách tệp bộ đọc trả về), `nguon.chan` và cờ: `true` «chưa nạp
  nguồn» · `true` «chưa nạp: <tệp>» · `false` không cờ nguồn · `false` «nguồn đã đổi sau khi nạp: <tệp>» · tệp chỉ gồm
  bản phạm vi, `true` «chưa nạp nguồn» · tệp rỗng, `false`, cờ «dòng Nguồn không trỏ tệp nào» · tệp gồm hai bản phạm vi,
  `true`; và ở mọi hàng `chan = true`, dòng lệnh duyệt của thẻ để ô quyết `___` (không điền sẵn «duyệt») và thẻ in dòng
  «CHƯA vào được Cổng Phạm vi: chưa nạp nguồn …», còn ở hàng `chan = false` không có dòng ấy. Bản tiêm đổi phép so băm
  thành luôn-khớp thì hàng bốn đỏ; bản tiêm bỏ `nguon.chan` khỏi điều kiện chặn của thẻ thì hàng một đỏ.
- AC-7: Given hồ sơ không có dòng «Nguồn:» (ô không có, hoặc ô cũ) và hồ sơ đã qua Cổng Phạm vi có dòng «Nguồn:» mà
  không dòng nạp, When dựng `gate-card.js --extract`, Then ca đầu cho JSON giống TỪNG BYTE bản dựng bằng bộ máy trước
  vòng trên cùng hồ sơ — không có khoá `nguon` nào; ca sau `nguon.chan = false`, không cờ nguồn (chiều im).
- AC-8: Given SKILL feature-loop, When rút khối `DEC-NGUON-NAP`, điền ô bằng một tệp thật của kho thử và băm thật của
  nó, ghép vào khối lệnh `DEC-ID-RECIPE` và chạy, Then dòng sổ sinh ra được bộ đọc của thẻ nhận là dòng nạp phủ tệp
  ấy (round-trip khuôn → sổ → thẻ), và `can-cu-s1.cjs` xếp nó «máy đã quyết», không đỏ; khối `NGUON-NAP-CHAN` tồn tại và
  mang khoá `nguon.chan`.
- AC-9: Given cây đã sửa, When chạy các ca đang có của răng phủ và mở ô (`tests/scripts/lo-trinh.test.mjs`,
  `tests/scripts/road-map-de-dung.test.mjs`) và ca dòng nạp luật sản phẩm (`tests/scripts/can-cu-s1.ca.mjs`), Then tất
  cả xanh — fixture nào ghi `nguon` chữ tự do thì sửa fixture cho đúng khuôn mới, không nới răng.
- AC-10: Given kho thử có ba hồ sơ mở từ hàng có `dot` (một ô có dòng «Nguồn:» trỏ tệp và sổ có dòng nạp đủ · một ô có
  dòng trỏ tệp mà sổ không dòng nạp · một ô mở trước vòng, không dòng) và một hồ sơ mở từ hàng không `dot`, When chạy
  lệnh đếm `node scripts/nguon-luot-cat.cjs --root <kho> --dem --tu <ngày>`, Then in một dòng JSON
  `{"o_tu_hang_co_dot":3,"o_co_dong_nguon":2,"o_tro_tep":2,"ho_so_da_nap":1}` (hồ sơ không `dot` không vào mẫu số); ô mở
  trước `--tu` không được đếm.

## Coverage

Bỏ quét hình thái — entry `descope` «bỏ coverage-scan» trong `decisions.jsonl`: không gian do chuỗi bốn mối nối của
design doc định sẵn, mỗi mối nối có ca đỏ và ca im.

- Mối nối nguồn → bản phạm vi: AC-1, AC-2.
- Mối nối hàng → ô: AC-3 (có nguồn), AC-4 (không dot — im), AC-5 (ba ca biên).
- Mối nối ô → bước thiết kế: AC-6 (thẻ đỏ/vàng/xanh, gồm ba đầu ra biên của AC-5 qua bộ đọc thẻ), AC-7 (im), AC-8 (khuôn round-trip).
- Đường đo: AC-10.
- Hồi quy: AC-9.

## Đường đo

- Thước: ở đợt đầu tiên một kho tiêu thụ cắt sau khi nhận bản phát hành có vòng này, mọi ô mở từ hàng có `dot` mang dòng
  «Nguồn:» trỏ tệp trong git, và mọi hồ sơ ấy có dòng nạp trước khi mời Cổng Phạm vi · số từ: lệnh đếm của AC-10 chạy
  ở kho ấy với `--tu <ngày nhận bản>` (`o_tro_tep / o_tu_hang_co_dot` và `ho_so_da_nap / o_tro_tep`) · ngày đọc: ngày
  nhận bản + 14 · mẫu số `o_tu_hang_co_dot` = 0 thì thước VÔ HIỆU, không đọc thành «đạt» · bảo đảm bởi: AC-3, AC-6,
  AC-10.

## Out of scope

- Đưa tệp nguồn vào phản biện context sạch (gap-probe) để soi hợp đồng trái nghiên cứu — CỘNG token mỗi vòng; hạt giống.
- Cứu bối cảnh cho hàng đã cắt ở kho tiêu thụ — PR riêng ở crm.
- Trường mới trên hàng lộ trình; trỏ nguồn theo mục (`tệp#mục`); răng cỡ tệp ảnh và tệp nặng.
- Cắt số phát hành.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Known limits:
  - Dòng nạp chứng máy đã băm từng tệp nguồn, không chứng đã hiểu; lựa chọn trái nguồn mà không trích chỉ phản biện nghĩa
    mới bắt (hạt giống). Ngưỡng mở: ≥ 1 vòng có dòng nạp mà Cổng Bằng chứng ghi «làm trái nghiên cứu».
  - Răng nguồn chạy lúc cắt đợt; bản phạm vi cắt trước vòng này không bị kiểm lại tới khi có phiên cắt chạm đợt ấy.
  - Đường nền của vòng chưa chạy: hook khoá máy của đợt crm đang chạy chặn `duong-nen.mjs` (phiên đứng ở thư mục crm).
