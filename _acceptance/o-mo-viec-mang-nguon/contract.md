---
schema_version: 1
feature: Ô mở từ một hàng của lượt cắt mang dòng «Nguồn:» trỏ đúng trang tri thức của hàng, và nguồn của bản phạm vi là trang tri thức có đường trỏ băm
slug: o-mo-viec-mang-nguon
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: implemented
design_doc: docs/superpowers/specs/2026-10-24-o-mo-viec-mang-nguon-design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-24T09:25:57Z
---

## Context

Hàng TT3 của đợt `tri-thuc-2410` (lượt cắt #404), mã C1, D1, D2. Ô cơ hội đã qua Cổng Đáng 24/10 (`decision: build`,
hạn 25/10). Đứng trên TT1 (#406). Gốc: crm-onehub/_acceptance/thanh-ben-khu-dung-chung/ — ô VK1 không trỏ bản phạm vi
hay báo cáo nghiên cứu.

Thuật ngữ:
- **kho thử** = kho git do ca dựng trong thư mục tạm của lượt chạy, có `_acceptance/config.yaml`, tệp lộ trình, và (khi
  khai `tri_thuc`) gốc tri thức với trang sinh từ khối `TRI-THUC-TRANG` của khuôn `tri-thuc-template.md` thật, đã commit.
- **mở ô** = `node scripts/lo-trinh.mjs --root <kho> --hang <mã> --mo-o --owner x@y.z`, `ACCEPTANCE_TODAY` cố định.
- **răng phủ** = `node scripts/cat-luot.mjs --root <kho> --pham-vi <tệp> --lo-trinh <tệp>`.
- **dòng «Nguồn:»** = dòng của `opportunity.md` mở bằng tiền tố trong khối `OPP-NGUON-PREFIX` của
  `skills/acceptance/references/opportunity-template.md`; **bộ đọc dòng** = `docDongNguon` của `scripts/tri-thuc-nguon.cjs`.
- **đường trỏ** = chuỗi khớp khối `TRI-THUC-CON-TRO`; băm là `git hash-object` của tệp.
- **bộ máy trước vòng** = `git archive <gốc vòng> scripts lib skills` giải vào thư mục tạm.

## Criteria

- AC-1: Given kho thử khai `tri_thuc.noi` với bảy trang — hai trang `loai: nen`, trang `wiki/dot/d1.md`, trang chủ đề
  `ma: [A1]`, trang chủ đề `ma: [A2, B1]`, trang chủ đề `ma: [B1]`, trang chủ đề `ma: []` — và hàng `X` có `dot: d1`,
  `phu: [A1, A2]`, When mở ô cho `X`, Then `opportunity.md` có đúng MỘT dòng «Nguồn:», đứng ngay sau dòng «Mở từ hàng
  X …», mang đúng năm đường trỏ theo thứ tự: hai trang nền (theo đường) · trang đợt · trang `[A1]` · trang `[A2, B1]`,
  mỗi đường trỏ có băm bằng `git hash-object` của trang; không mang trang `[B1]` hay trang `ma: []`; không có đoạn
  «chưa có trang»; và bộ đọc dòng trả lại đúng năm đường ấy, mỗi đường cho `node scripts/tri-thuc.mjs --con-tro` thoát 0
  (round-trip bên ghi → bên đọc → phân giải).
- AC-2: Given cùng kho thử, When mở ô cho hàng `Y` không có `dot` (cùng ngày, cùng owner), Then `opportunity.md` và
  stdout giống TỪNG BYTE bản do bộ máy trước vòng mở cho cùng hàng trên bản sao kho trước khi mở; và bản tiêm bỏ điều
  kiện «hàng có `dot`» khỏi bên ghi (bản sao `scripts/`, nhát tiêm khớp đúng một lần) thì ca đỏ «hàng không đợt mà ô có
  dòng Nguồn».
- AC-3: Given kho thử có thư mục `docs/tri-thuc/wiki/` đủ trang như AC-1, và `_acceptance/config.yaml` vắng khối
  `tri_thuc`, When mở ô cho hàng có `dot: d1`, Then `opportunity.md` và stdout giống TỪNG BYTE bản do bộ máy trước vòng mở; bản tiêm bỏ điều kiện «kho
  khai `tri_thuc`» (đọc gốc mặc định `docs/tri-thuc` khi khối vắng) thì ca đỏ «kho không khai tri_thuc mà ô có dòng
  Nguồn»; và trên bản sao bộ máy ĐÃ XOÁ `scripts/tri-thuc.mjs`, `scripts/tri-thuc-khoa.cjs`, `scripts/tri-thuc-nguon.cjs`,
  mở ô cho hàng không `dot` và đọc hàng (`--hang <mã>`) cho đầu ra giống từng byte bộ máy trước vòng (bên đọc cũ không
  nạp mô-đun tri thức); bản tiêm thêm `import` tĩnh `tri-thuc-nguon.cjs` vào đầu `lo-trinh.mjs` thì ca đỏ «bên đọc cũ nạp
  mô-đun tri thức».
- AC-4: Given kho thử của AC-1, When mở ô theo ma trận viết sẵn năm hàng — xoá trang đợt · xoá trang `[A2, B1]` · xoá cả
  hai trang nền · khai `tri_thuc.kho` trỏ thư mục không có (kèm `remote`) · khối `tri_thuc` có `cong_khai: co` — Then
  mỗi hàng thoát 0, stdout có `"moi":true`, và dòng «Nguồn:» lần lượt kết bằng `— chưa có trang: trang đợt d1` · `— chưa
  có trang: mã A2` · `— chưa có trang: trang nền` (ba hàng đầu vẫn mang các đường trỏ còn lại) · là
  `Nguồn: không đọc được ở đây: <tên kho> — git clone <remote> <đường>` không đường trỏ nào · là `Nguồn: khối tri_thuc
  lỗi — cong_khai phải là true hoặc false`; và hàng thứ sáu dựng kho riêng thật ở đường ấy (trang như AC-1) thì mọi
  đường trỏ mang tiền tố `<tên kho>:` và mỗi đường cho `--con-tro` thoát 0.
- AC-5: Given kho thử khai `tri_thuc`, bản phạm vi `dot: d1` hai mã và tệp lộ trình phủ đủ hai mã, cả hai đã vào git,
  When chạy răng phủ với khoá `nguon` theo ma trận viết sẵn tám hàng — liên kết `https://example.com/x` · đường tệp có
  trong git không phải đường trỏ (`docs/x.md`) · chữ tự do · rỗng · đường trỏ đúng khuôn mà băm lệch · đường trỏ tới
  tệp không có · đường trỏ đúng băm tới trang có trên đĩa mà chưa `git add` · đường trỏ đúng băm tới tệp dưới `raw/` —
  Then mỗi hàng thoát 1 với ĐÚNG MỘT dòng lỗi nhắc nguồn, mang mã theo bảng: `[nguon-khong-phai-trang]` ×4 (hàng 1–4,
  hàng 4 là câu «bản phạm vi thiếu nguon — kho đã khai tri_thuc») · `[nguon-lech]` «băm lệch» · `[nguon-lech]` «không có
  tệp» · `[nguon-chua-vao-kho]` · `[nguon-khong-phai-trang]` «không phải trang wiki»; đối chứng trên cùng kho — `nguon`
  là hai đường trỏ đúng băm tới hai trang đã vào git, cách nhau dấu phẩy — thoát 0, không dòng nào nhắc nguồn, chạy
  TRƯỚC mỗi hàng; số hàng in ra bằng 8; và hàng thứ chín — khối `tri_thuc` có `cong_khai: co`, `nguon` là hai đường trỏ
  đúng — thoát 1 với đúng một dòng `lỗi: khối tri_thuc lỗi: cong_khai phải là true hoặc false`, không dòng `[nguon-*]`.
  Hàng lộ trình của kho thử mang khoá đợt và khoá mã rút từ hàng TT3 thật của `docs/plans/lo-trinh-kit.json`, và đối
  chứng của ca in bảng phủ đặt cả hai mã ở chính hàng mà AC-1 mở ô (bên đọc của răng phủ và bên đọc của mở ô cùng một
  khoá).
- AC-6: Given kho thử khai `tri_thuc.kho` mà thư mục không có, When chạy răng phủ với `nguon` là một đường trỏ có tiền
  tố kho ấy, Then thoát 0 và in đúng một dòng `cảnh báo: nguồn «<mục>»: không đọc được ở đây: <tên kho> …`, không dòng
  lỗi nào nhắc nguồn; đối chứng dựng kho riêng lành với đường trỏ đúng băm thì không cảnh báo nguồn; trên cùng kho riêng
  vắng, `nguon` là liên kết hay chữ tự do vẫn thoát 1 với đúng một dòng `[nguon-khong-phai-trang]` (vế hình dạng không
  hạ thành cảnh báo vì máy thiếu kho); và trên kho thử không khai `tri_thuc` với `nguon` là chữ tự do và là liên kết,
  răng phủ cho stdout và mã thoát giống TỪNG BYTE bộ máy trước vòng.
- AC-7: Given khuôn ô cơ hội thật, When rút khối `OPP-NGUON-PREFIX` và chạy CHÍNH lệnh mở ô của AC-1 trên bản sao bộ
  máy có khuôn đã tiêm tiền tố khác (`Nguồn-thử:`), Then dòng của ô mở bằng tiền tố tiêm, bộ đọc rút từ cùng khuôn tiêm đọc ra đúng năm đường
  trỏ, và bộ đọc rút từ khuôn thật đọc ô ấy ra `coDong: false` (một nguồn: bên ghi và bên đọc cùng đổi theo khuôn); khuôn
  mất khối thì bên ghi ném lỗi nêu tên `OPP-NGUON-PREFIX`.
- AC-8: Given cây đã sửa, When chạy các ca đang có `tests/scripts/lo-trinh.test.mjs`,
  `tests/scripts/kho-tri-thuc-va-lint.test.mjs`, `tests/scripts/road-map-de-dung.test.mjs` và `tests/scripts/can-cu-s1.ca.mjs`,
  Then tất cả thoát 0 — không ca cũ nào đổi phán quyết.

## Coverage

Bỏ quét hình thái — entry `descope` «bỏ coverage-scan» trong `decisions.jsonl`: không gian do bản phạm vi định sẵn (C1
chọn trang, D2 dòng của ô, D1 nguồn của bản phạm vi); mỗi phần có ma trận viết sẵn, chiều đỏ và chiều im.

- C1 chọn trang: AC-1, AC-4 (thiếu trang, kho riêng, khối lỗi).
- D2 dòng «Nguồn:»: AC-1 (có), AC-2 (hàng không đợt — im), AC-3 (kho không khai — im), AC-7 (khuôn round-trip).
- D1 nguồn của bản phạm vi: AC-5 (đỏ), AC-6 (không đọc được — nhãn; kho không khai — im).
- Hồi quy: AC-8.

## Đường đo

- Thước của ô (sống: trên kho thử, ô mở từ hàng có đợt mang đúng trang nền, trang đợt và trang có mã của hàng; ô của
  hàng không thuộc đợt nào giống từng byte bản mở bằng bộ máy trước vòng) · số từ: ca
  `tests/scripts/o-mo-viec-mang-nguon.test.mjs` chạy trong lượt chấm · bảo đảm bởi AC-1, AC-2.

## Out of scope

- Bước thiết kế đọc dòng «Nguồn:», dòng «đã tra tri thức», cờ của thẻ Cổng Phạm vi — TT4.
- Tra trang theo mô tả cho vòng đơn lẻ, đọc sổ quyết định của hồ sơ trước — TT5.
- Trỏ nguồn theo mục trong một trang; lệnh đếm sau phát hành (ngưỡng của ô đo trên kho thử).

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Known limits:
  - Dòng «Nguồn:» chứng máy đã CHỌN trang theo mã và nền, không chứng trang đúng nội dung; trang sai nội dung là việc
    của lint nghĩa (mục chờ F2).
  - Răng phủ không có đường đọc-cũ cho bản phạm vi cắt TRƯỚC khi kho khai `tri_thuc`: chạy lại răng phủ trên bản ấy thì
    `nguon` chữ tự do đỏ, phiên cắt phải đổi sang đường trỏ băm. Mở ô từ hàng của bản ấy vẫn chạy (không đọc bản phạm
    vi). Ngưỡng mở: ≥ 1 lần phiên cắt phải sửa `nguon` của bản phạm vi cũ chỉ để răng phủ xanh.
  - Hàng lộ trình do phiên cắt (người hoặc tác tử) viết, không có bên ghi bằng mã; ca đo neo khoá đợt và khoá mã vào
    hàng thật của lộ trình kit và vào bên đọc của răng phủ, không vào một bên ghi máy.
