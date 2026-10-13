---
schema_version: 1
feature: Hai thước kit thôi nói sai trên kho tiêu thụ — chân engine của đường nền bỏ qua tệp có điều kiện khi kho không khai ổ cắm, và design-gate gọi tên «không đo được» thay vì PASS trên tệp không phải HTML; không đổi mã thoát nào, không đổi mặc định
slug: nen-dieu-kien-va-static-khong-do-duoc
owner: phanlemanh@gmail.com
risk_tier: T2               # feature-loop/scripts/duong-nen.mjs + scripts/design-gate.mjs + commands/acceptance-init.md (thẻ điều kiện) + khuôn đường nền + test — không chạm lib/**, hook, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-13-nen-dieu-kien-va-static-khong-do-duoc-design.md
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-13T02:23:11Z
---

# Acceptance Contract: nen-dieu-kien-va-static-khong-do-duoc

## Context

Gốc: báo cáo Mac Studio ở phanlemanh/crm-onehub#375 (bình luận 13/10 01:10Z) + đường nền DA1 trên crm
(`_acceptance/viec-chung/duong-nen.md`, chân engine đỏ). Đợt r2 trên crm lộ hai thước kit 2.28.0 nói
sai: chân engine của đường nền đỏ ở MỌI dãy vì crm không chép ba tệp chỉ cần khi khai `tin_hieu`; và
`design-gate --mode static` trên `.tsx` xanh ở 262/265 lượt gọi (0 REJECT) dù không thấy màu, nền hay
ảnh động. Sửa theo luật «sửa kit vì sự cố của một kho phải cân trên mọi kho»: thẻ điều kiện một nguồn
trong danh sách chép, bộ đọc khoan dung + cờ vàng; KHÔNG đổi mã thoát, KHÔNG đổi mặc định.

## Criteria

- AC-1: Given kho thử lành của đường nền đã gỡ khỏi bản vendored MỌI tệp `scripts/`·`lib/` mang thẻ
  `[only-if-declared: …]` trong khối INIT-CI-COPY-LIST và config không khai `tin_hieu` lẫn `lo_trinh`,
  When chạy đường nền, Then mã 0, chân engine xanh, và stderr có đúng một dòng
  `engine: bo-qua <tệp> — tệp có điều kiện, kho không khai <khoá>` cho MỖI tệp đã gỡ (tập dòng == tập
  tệp mang thẻ rút từ khối, so bằng đẳng thức tập).
- AC-2: Given kho thử lành, When config khai `tin_hieu:` (rồi riêng `lo_trinh:`), Then (đối chứng dương,
  chạy trước) với mọi tệp có mặt và khớp: mã 0, không dòng LECH, không dòng bo-qua; và với mọi tệp mang
  thẻ đã gỡ: mã 1, tập tệp trong dòng `nen engine: LECH <tệp> (vendored ≠ dang-chay)` BẰNG tập tệp thẻ
  của ổ đã khai, tập dòng bo-qua BẰNG tập tệp của ổ kia.
- AC-3: Given kho thử lành KHÔNG khai ổ cắm nào, When (a) thêm một dòng vào một tệp mang thẻ đang CÓ mặt ở
  bản vendored, hoặc (b) gỡ một tệp KHÔNG mang thẻ, Then mã 1 và đúng một dòng `nen engine: LECH <tệp>
  (vendored ≠ dang-chay)` gọi đúng tệp đó.
- AC-4: Given bản sao ag-root mà dòng `scripts/tin-hieu-khoa.cjs` của khối bị gỡ thẻ, When chạy kho thử
  của AC-1 với ag-root ấy, Then chân engine đỏ gọi đúng `scripts/tin-hieu-khoa.cjs` — điều kiện đọc từ
  khối, không từ danh sách trong mã.
- AC-5: Given bốn biến thể config {không khai · `# tin_hieu:` chú thích · `tin_hieu:`/`lo_trinh:` thụt
  trong khối khác · khai đủ `lo_trinh` + `tin_hieu`} trên kho thử đã gỡ mọi tệp mang thẻ, When chạy đường
  nền và `scripts/product-map.mjs --root` của CHÍNH bản vendored, Then ở mọi biến thể «đường nền xanh» ⇒
  «product-map mã 0, không MODULE_NOT_FOUND» (ba biến thể đầu xanh, khai-đủ đỏ); đột biến bản sao đường
  nền coi mọi khoá là không khai → phép đo đỏ nêu biến thể khai-đủ; đối chứng đỏ của bộ nạp: gỡ thêm
  `scripts/trang-thai-ho-so.cjs` → product-map chết nêu tên tệp.
- AC-6: Given ma trận mười ô {html sạch · html có tell P1 với `--fail-on P0,P1` · `.HTML` hoa · tsx sạch
  (chữ #eee trên nền trắng bằng style object) · tsx có `<img src="" />` · jsx sạch · vue sạch · tệp HTML
  không đuôi · tsx VẮNG · tsx ở `--mode dom`}, When chạy `design-gate.mjs` bản vòng và bản gốc
  (`git archive 0c1fd9ff scripts lib vendor`), Then mã thoát hai bản BẰNG NHAU ở mọi ô (in bảng ô · gốc · sau).
- AC-7: Given cùng ma trận, When chạy bản vòng, Then các ô HTML và ô `--mode dom` cho JSON không có khoá
  `do_duoc`, không dòng stderr `không đo được` và verdict bằng gốc; năm ô static không phải HTML (kể cả
  không đuôi) có `do_duoc: false`, đúng một dòng stderr `design-gate: static không đo được tệp này
  (<đuôi>)…`, verdict `KHONG-DO-DUOC` khi gốc PASS, `REJECT` khi gốc REJECT; ô tệp vắng vẫn không trả JSON.
- AC-8: Given ba đột biến trên bản sao `design-gate.mjs` — (a) danh sách đuôi HTML rỗng, (b) mã thoát của
  `KHONG-DO-DUOC` thành 3, (c) phân loại đuôi TRƯỚC khi đọc tệp (trả sớm `KHONG-DO-DUOC` mã 0) — When chạy
  CHÍNH phép đo của AC-6/AC-7 trên bản sao, Then (a) đỏ nêu ô html sạch, (b) đỏ nêu ô tsx sạch «mã thoát
  lệch gốc», (c) đỏ nêu ô tsx vắng; bản lành chạy trước trên cùng ma trận xanh.
- AC-9: Given khối INIT-CI-COPY-LIST đã gắn thẻ, When (a) quét mọi mục `scripts/`·`lib/` KHÔNG thẻ tìm
  dòng nạp tĩnh một tệp mang thẻ (được phép: `await import(` hoặc `require` bọc `try {` cùng dòng), và (b)
  chạy các bên đọc khối hiện có (CE1, CE2g của consumer-esm; NEN7), Then (a) 0 dòng, đột biến tiêm một
  import tĩnh `./cat-luot.mjs` vào bản sao product-map → phép quét nêu đúng tệp:dòng; (b) các bên đọc
  vẫn rút đúng tập đường dẫn (thẻ cuối dòng không lọt vào đường dẫn).

## Coverage

Trục (kê tay, không quét hình thái — entry descope «bỏ coverage-scan» trong sổ): chân engine × {tệp thẻ
vắng/có-lệch · tệp không thẻ vắng} × {khai/không khai ổ cắm, có ô dương} × {tin_hieu · lo_trinh} →
AC-1..AC-4; lời khai của thẻ ↔ bộ nạp thật (chẵn lẻ trên bốn biến thể config) → AC-5; thẻ ↔ đồ thị nạp
tĩnh và ↔ bên đọc khối hiện có → AC-9; design-gate × {đuôi HTML · đuôi khác · không đuôi · tệp vắng ·
chế độ dom} × {gốc PASS · gốc REJECT · gốc chết} → AC-6, AC-7; độ nhạy của chính phép đo → AC-8.

## Out of scope

- Cờ không-đo-được ở `--mode dom` — kho không cài jsdom nên suite chung không đo được nhánh ấy; dom giữ nguyên hành vi (ô AC-6/AC-7 ghim điều đó ở đường không-jsdom).
- Chế độ chặt tuỳ chọn (KHONG-DO-DUOC thoát khác 0 theo cờ) — bậc «bật thêm theo lựa chọn»; chưa kho nào xin.
- Băm bốn mục ngoài `scripts/`·`lib/` của danh sách chép — hạt giống 2026-10-11 kiem-lech-ban-tep-ngoai, ngưỡng chưa tới.
- Thông điệp khi đích design-gate vắng (chết mã 1 kèm vết ngăn xếp) — đỏ đúng chiều, không đổi.
- Đổi ~51 eval `*_san_thiet_ke` của crm sang thước đo được — việc của crm.

## Notes

- Hệ quả lên crm (đo 13/10, shim chỉ đọc, 42 lệnh thuần design-gate, 265 lượt gọi): ghim lại KHÔNG đổi
  màu — 265/265 cùng mã thoát; 262 PASS → `KHONG-DO-DUOC` trong stdout; 3 lượt tệp vắng không đổi. 51 eval
  tham chiếu (50 signed-off, 1 machine-cleared). Bên đọc trường `verdict`: kit 0; crm 1
  (`tiep-thi-tuyen-doi-tac/rang/chien-dich.mjs`, chế độ dom trên ảnh chụp `.html` — ngoài nhánh đổi); các
  kho khác dưới ~/dev: 0.
- Giới hạn khai: cờ vàng chưa có bên đọc máy — làn ghim lại và lưới trước-merge chỉ đọc mã thoát, nên
  một hồ sơ chỉ có design-gate static trên `.tsx` làm chốt máy của AC mặt người vẫn ghim xanh. Ngưỡng mở
  chế độ chặt: ≥1 kho xin, hoặc ≥1 hồ sơ ký trên chốt ấy mà prod đỏ đúng tiêu chí đó.
