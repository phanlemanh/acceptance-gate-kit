---
schema_version: 1
feature: design-gate chế độ chặt tuỳ chọn — cờ `--require-measured` làm «không đo được» (đích không phải HTML) thoát mã 5 thay vì 0, ở cả static lẫn dom; vắng cờ mọi ô y như bản gốc
slug: design-gate-che-do-chat
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/design-gate.mjs + test + tài liệu design-ui-check — không chạm lib/**, hook, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-25-design-gate-che-do-chat-design.md
status: approved
approved_by: Manh Phan
approved_at: 2026-10-26T04:21:28Z
---

# Acceptance Contract: design-gate-che-do-chat

## Context

Gốc: crm 25/10, vòng VK10 `che-do-soan-bo-okr` (kit 2.33.1) — `design-gate.mjs --target <.tsx> --mode static`
trả `KHONG-DO-DUOC`, `do_duoc:false` mà mã thoát 0, nên eval gọi nó trong `for … || exit 1` xanh rỗng và
chiều đỏ không bao giờ đỏ; chủ kho crm xin sửa. Đây là ngưỡng mở lại đã khai ở hồ sơ
`_acceptance/nen-dieu-kien-va-static-khong-do-duoc/` (sổ d-20261013T020915Z-4 «≥1 kho xin chế độ chặt»;
d-20261013T022152Z-9 «≥1 kho chấm dom trên tệp không phải HTML» — artifact-platform 23 khoá). Sửa ở bậc
«bật thêm theo lựa chọn» của luật chọn nghiệm (CLAUDE.md): cờ mới, KHÔNG đổi mặc định.

## Criteria

- AC-1: Given đích không phải HTML không có lỗi chặn thấy được {tsx sạch · jsx sạch · vue sạch · tệp không
  đuôi}, When chạy `design-gate.mjs <đích> --mode static --require-measured`, Then mã thoát 5; JSON có
  `verdict: "KHONG-DO-DUOC"`, `exit_code: 5`, `do_duoc: false`, `require_measured: true`; stderr có đúng một
  dòng bắt đầu `design-gate: static không đo được tệp này (<đuôi>)` và chứa `--require-measured: thoát 5`.
- AC-2: Given tsx có `<img src="" />` (lỗi chặn static thấy được), When chạy static có cờ, Then mã thoát 2,
  verdict `REJECT`, `do_duoc: false` — lỗi thấy được không bị nuốt thành 5.
- AC-3: Given đích HTML {sạch · `.HTML` hoa · có `<img src="">` (P0) · có tell P1 với `--fail-on P0,P1` · chữ
  #eee trên nền trắng bằng style nội dòng}, When chạy static CÓ cờ và KHÔNG cờ, Then hai lượt cho cùng mã
  thoát và cùng verdict (0/PASS · 0/PASS · 2/REJECT · 2/REJECT · 0/PASS), JSON không có `do_duoc`,
  `require_measured`, stderr không có dòng «không đo được» — cờ không chạm HTML; ô chữ nhạt ghim giới hạn
  đã khai «static không thấy màu, kể cả trên HTML».
- AC-4: Given tsx sạch, When chạy `--mode dom --require-measured --jsdom <thư mục không tồn tại>`, Then mã
  thoát 5 (không phải 3 BLOCKED), JSON `mode: "dom"`, verdict `KHONG-DO-DUOC`, `do_duoc: false`, stderr đúng
  một dòng bắt đầu `design-gate: dom không đo được tệp này (.tsx)`; đối chứng: đích HTML cùng lệnh dom có cờ
  vẫn BLOCKED mã 3 như không cờ. Thứ tự: với `--jsdom` trỏ một jsdom GIẢ do ca sinh (nạp là để lại tệp lính
  canh), tsx có cờ thoát 5 mà lính canh KHÔNG xuất hiện; đối chứng html-sach cùng thư mục thì lính canh PHẢI
  xuất hiện.
- AC-5: Given ma trận mười ô của hồ sơ `nen-dieu-kien-va-static-khong-do-duoc` (bộ ca
  `tests/scripts/design-gate-khong-do-duoc.test.mjs`), When chạy KHÔNG cờ, Then mã thoát bằng bản gốc
  `0c1fd9ff` ở cả mười ô và cờ vàng y như trước (DG-KDD1…3 xanh) — kho chưa bật cờ không ô nào đổi màu.
- AC-6: Given tsx sạch, When cờ đứng ở ba vị trí {trước đích · sau đích · dạng crm `--target <đích> --mode
  static --require-measured`}, Then cả ba mã 5 và cùng `target` — cờ không nuốt đối số kế bên; và dạng vòng
  lặp của crm (`for t in <tsx> <jsx>; do design-gate --target "$t" --mode static --require-measured || exit 1;
  done`) thoát 1, bản `|| exit $?` thoát 5, bản không cờ thoát 0 — mã eval thật dưới lệnh kho đang dùng.
- AC-7: Given năm đột biến trên bản sao `design-gate.mjs` — (a) mã thoát của nhánh chặt về 0, (b) gỡ nhánh
  quyết-trước-jsdom ở dom, (c) nhánh chặt áp cả đích HTML, (d) phép quyết dời vào sau bước nạp jsdom (mã vẫn
  5, chỉ thứ tự sai), (e) nhánh dom dùng vị từ đuôi riêng phân biệt hoa thường — When chạy CHÍNH phép đo
  của AC-1…AC-4, AC-6, AC-8 trên bản sao, Then (a) đỏ nêu ô `tsx-sach`, (b) `tsx-dom-chat`, (c) `html-sach`,
  (d) `tsx-dom-jsdom-gia`, (e) `HOA.HTML@dom`; bản lành chạy trước trên cùng ma trận xanh.
- AC-8: Given mười hai đích {tsx sạch · tsx ảnh rỗng · jsx · vue · không đuôi · html sạch · `.HTML` hoa · `.htm` ·
  html P1 · html ảnh rỗng · html chữ nhạt · tsx VẮNG} × {static · dom không jsdom}, When chạy có cờ và không
  cờ, Then có cờ thoát 5 KHI VÀ CHỈ KHI ô «không đo được» (static: verdict không cờ là `KHONG-DO-DUOC`; dom:
  đuôi ngoài {.html .htm .xhtml}, không hoa thường — viết độc lập trong ca), mọi ô khác mã + verdict bằng lượt
  không cờ.

## Coverage

Trục (kê tay — entry descope «bỏ coverage-scan» trong sổ): cờ {có · vắng} × chế độ {static · dom} × đích
{HTML · không-HTML theo đuôi · không đuôi} × bộ dò {thấy lỗi chặn · không thấy} → AC-1 (có·static·không-HTML·
không thấy), AC-2 (có·static·không-HTML·thấy), AC-3 (có/vắng·static·HTML·cả hai), AC-4 (có·dom·cả hai đích),
AC-5 (vắng·mọi ô cũ), AC-6 (cú pháp gọi + vòng lặp của kho), AC-7 (độ nhạy của chính phép đo), AC-8 (quan
hệ có-cờ ↔ không-cờ trên trọn ma trận đích × chế độ); trục jsdom {vắng · có (giả)} ở nhánh dom có cờ → AC-4. Ô vắng có chủ đích: vắng cờ ·
dom · không-HTML khi CÓ jsdom thật (Out of scope 2).

## Out of scope

- Đổi mặc định (vắng cờ mà KHONG-DO-DUOC vẫn thoát khác 0) — 57 eval crm + 23 khoá artifact-platform đỏ cùng
  lúc; ngưỡng mở: ≥1 hồ sơ ký trên design-gate không-HTML mà prod đỏ đúng tiêu chí đó, hoặc owner gọi tên.
- Cờ vàng KHÔNG cờ ở `--mode dom` trên đích không phải HTML — cần jsdom chạy bộ dò trong suite chung (CỘNG).
- Làm static thấy màu/độ tương phản trên HTML — giới hạn của bộ dò vendored; tài liệu gọi tên, AC-3 ghim.
- Thêm cờ vào 61 khoá `*_san_thiet_ke` của crm hay 23 khoá của artifact-platform — việc của từng kho.

## Notes

- Hệ quả khi kho nhận bản mới (đo 25/10, chỉ đọc): KHÔNG eval nào đổi màu — cờ vắng ở mọi lệnh hiện có.
  Nếu crm thêm cờ vào 61 khoá: 57 eval đang chạy (56 signed-off + 1 machine-cleared) đỏ ở lượt ghim kế, 4 ô
  tự khai `not-run` không chạy. Mã eval thật là **1**, không phải 5: khoá crm gọi trong vòng `… || exit 1`
  (AC-6 ghim). Muốn pin nói «đạt-có-giới-hạn» bằng `expected_exit: 5` thì vòng lặp phải truyền nguyên mã
  (`|| exit $?`) — việc của kho. Danh sách đủ ở báo cáo bàn giao của vòng.
- Bản kit cũ bỏ lặng cờ lạ: kho thêm `--require-measured` mà chưa nhận bản mới thì vẫn xanh rỗng — chạy chiều đỏ
  một lần (một `.tsx` phải ra khác 0) trước khi tin. Cùng báo cáo crm 25/10 nêu dom mù màu Tailwind v4 (`@layer`) và
  nền rgba so như nền đặc — ngoài vòng, ghi ở hạt giống `docs/plans/2026-10-25-hat-giong-design-gate-dom-mu-tailwind-v4.md`.
- 26/10: chủ kho dừng vòng ở Cổng Phạm vi, ghi thành hạt giống và chuyển MacBook Pro — trạng thái và đường tiếp tục ở
  `docs/plans/2026-10-26-hat-giong-design-gate-che-do-chat.md`.
