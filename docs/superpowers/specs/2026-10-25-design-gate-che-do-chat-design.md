# design-gate — chế độ chặt tuỳ chọn `--require-measured` (vòng `design-gate-che-do-chat`, T2)

Gốc: crm 25/10, vòng VK10 `che-do-soan-bo-okr` (kit cài 2.33.1) — `design-gate.mjs --target <.tsx> --mode
static` trả `KHONG-DO-DUOC`, `do_duoc:false` mà mã thoát 0; chiều đỏ «thêm mã hex vào className» không
bao giờ đỏ. Chủ kho xin sửa (phiên V1 đợt `vo-khu-muc-tieu`). Đây đúng ngưỡng mở lại đã khai ở hồ sơ
`nen-dieu-kien-va-static-khong-do-duoc` (sổ d-20261013T020915Z-4: «≥1 kho xin chế độ chặt»).

## Vấn đề

Vòng 13/10 đã cho design-gate NÓI «không đo được» (verdict + `do_duoc:false` + một dòng stderr) nhưng giữ
mã thoát 0 có chủ đích, vì làn ghim lại và mọi `|| exit 1` chỉ đọc mã thoát — đổi mã là mọi kho đỏ cùng
lúc. Hệ quả đã khai: cờ vàng không có bên đọc máy, nên một eval chỉ dựa design-gate trên `.tsx` vẫn ghim
xanh. Nay một kho xin chặn cứng.

## Số đo nền (25/10, chỉ đọc)

- crm: 61 khoá `executors.script.*_san_thiet_ke` chạy `--mode static` trên `.tsx`, 61 eval ở 61 hồ sơ
  (56 signed-off đang chạy · 4 tự khai `not-run` · 1 machine-cleared). Không eval nào đo được gì.
- artifact-platform: 23 khoá gọi design-gate ở chế độ **dom** (`--jsdom`) trên `.tsx` — ngưỡng mở lại
  của sổ d-20261013T022152Z-9 («≥1 kho chấm dom trên tệp không phải HTML») cũng đã tới.
- Các kho khác dưới `~/dev`: design-gate trên HTML hoặc không gọi.
- Giới hạn của bộ dò, đo cùng ngày: static trên **HTML** cũng không thấy màu — `<p style="color:#eee;
  background:#fff">` cho PASS ở static, REJECT `low-contrast` ở dom. Static chỉ thấy lỗi viết-thành-chữ
  (`broken-image`, `side-tab`, `gradient-text`…).

## Lựa chọn

1. **Bật theo lựa chọn, không đổi mặc định.** Cờ `--require-measured`; vắng cờ thì mọi ô y như bản gốc
   từng byte mã thoát. Đổi mặc định làm 57 eval crm và 23 khoá artifact-platform đỏ ở lượt ghim kế — luật
   «sửa kit vì sự cố của một kho phải cân trên mọi kho» xếp đổi mặc định ở bậc cuối. Kho bật bằng cách
   thêm cờ vào lệnh của mình (một chỗ nếu eval đi qua `config:executors.design.gate`).
2. **Mã thoát riêng `5`.** 0 là đúng lỗi đang sửa; 2 là REJECT (đã thấy lỗi chặn) — nói dối về điều đã
   thấy; 3 là BLOCKED thiếu jsdom (lời dặn là cài jsdom, sai cách gỡ); 4 là gọi sai. Mã riêng cho kho
   khai được `expected_exit: 5` để pin nói «đạt-có-giới-hạn» thay vì im.
3. **Cờ phủ cả static lẫn dom.** Mù với tệp không phải HTML là tính chất của ĐÍCH. Ở dom, quyết bằng đuôi
   TRƯỚC khi nạp jsdom — nên đo được trong suite chung không jsdom, và kho chưa cài jsdom nhận 5 (đích sai)
   thay vì 3 (môi trường thiếu).
4. **Lỗi chặn thấy được vẫn là REJECT mã 2** ở static (vd `<img src="" />` viết chữ trong `.tsx`) — chỉ ô
   lẽ ra KHONG-DO-DUOC mới thành 5. Ở dom với cờ, đích không phải HTML không chạy bộ dò nên luôn 5.
5. **HTML không đổi** dù có cờ: cờ chỉ chạm ô «không đo được».

## Hình dạng đầu ra (với cờ, đích không phải HTML, không lỗi chặn thấy được)

```
stdout JSON: verdict "KHONG-DO-DUOC" · exit_code 5 · do_duoc false · require_measured true · ly_do_khong_do_duoc
stderr (đúng một dòng): design-gate: <static|dom> không đo được tệp này (<đuôi>) — bộ dò chỉ đọc HTML đã dựng; --require-measured: thoát 5: <đích>
mã thoát: 5
```

## Ngoài vòng

- Đổi mặc định (KHONG-DO-DUOC thoát khác 0 khi vắng cờ) — mọi kho trả giá; ngưỡng mở: ≥1 hồ sơ ký trên
  design-gate không-HTML mà prod đỏ đúng tiêu chí đó, hoặc owner gọi tên.
- Cờ vàng (không cờ) ở `--mode dom` — cần jsdom chạy bộ dò trên `.tsx`; suite chung không có jsdom.
  Ngưỡng d-9 đã tới nhờ artifact-platform nhưng phép đo cần jsdom trong suite — CỘNG, owner phê.
- Static thấy màu trên HTML — giới hạn của bộ dò bên thứ ba vendored; tài liệu gọi tên + một ô test ghim.
- Sửa 61 khoá crm / 23 khoá artifact-platform — việc của từng kho.
