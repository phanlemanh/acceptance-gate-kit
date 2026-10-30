# Khung đợt định vị + bộ đếm «cần anh» đủ — thiết kế

Hồ sơ `_acceptance/khung-dot-dinh-vi/` · ADR 0027 bước (a)–(b) · Cổng Đáng: build, 28/10 (Manh Phan).

## 1. Vấn đề, đọc từ mã

- `dieu-phoi/scripts/khung.mjs` `veDai`: `cần anh = cho_nguoi.length + (can_nguoi ? 1 : 0)`. `cho_nguoi` do bộ phát lịch
  dựng từ tệp `cho-nguoi/<dãy>.json` (hook `hook-cho-nguoi.mjs`) và yêu cầu `can-nguoi` chưa trả lời — cả hai chỉ có
  ở phiên THỢ: hook trả `khong-phai-tho` khi cwd không thuộc dãy nào, nên phiên giám sát không bao giờ được ghi.
  Câu giám sát hỏi chủ kho trong chat không vào sổ nào → dải báo «cần anh 0» (ca 28/10).
- `dieu-phoi/hooks/mod/khung.ts` pane «Đợt» vẽ `chuXem(kq)` — chính chữ của lệnh `xem`, viết cho máy đọc: khe máy
  (`khoá s4:P5`), chữ không dấu (`dang-chay`, `tien_do`), `nhip 2026-10-10T00:47:30.085Z`, mã hàng/slug trần.

## 2. (a) Câu chờ chủ kho của giám sát

**Bên ghi — lệnh CLI, hai lệnh con mới của `dieu-phoi.mjs`:**

```
dieu-phoi.mjs hoi --cau "<câu>" [--phien <mã>]      # in: hoi: <id>
dieu-phoi.mjs hoi --cau -  <<'CAU' … CAU            # câu đọc từ stdin (câu có nháy, $, backtick)
dieu-phoi.mjs hoi-xong <id> [--phien <mã>]           # in: hoi-xong: <id>
```

Dòng sổ `su-kien.jsonl`:
`{"luc":…,"loai":"hoi-chu-kho","id":"h-<UTC gọn>-<n>","cau":"<≤200 ký tự>","phien":"<mã|null>","can_phan":false}` ·
`{"luc":…,"loai":"hoi-chu-kho-xong","id":"<id>","phien":…,"can_phan":false}`.

- Kiểu riêng, `can_phan:false` tường minh → lệnh lọc của Monitor (`grep --line-buffered '"can_phan":true'`) không lọt:
  giám sát không tự thức vì câu của chính nó (ADR 0027 «Thứ tự dựng» (a)).
- `<n>` = số dòng `hoi-chu-kho` đã có + 1 → id duy nhất trong đợt cả khi hai câu cùng giây.
- Câu rỗng → thoát 2, không ghi. `hoi-xong` với id không mở (chưa từng có hay đã đóng) → thoát 2 nêu id, không ghi.
- Không đợt → thoát 1 «không có đợt» như các lệnh con khác.

**Bên đọc — `hoi.mjs` (mới) `hoiMo(thuMuc)`:** đọc `su-kien.jsonl`, trả các câu mở theo thứ tự ghi
(`{id, cau, phien, luc}`); dòng hỏng bỏ qua. Một hàm, dùng ở `xemJson` (khung) — không chép lại ở chỗ khác.

**Đóng câu: chỉ bằng `hoi-xong`, không tự đóng.** Đã cân tự đóng khi chủ kho gõ vào phiên giám sát (hook
`UserPromptSubmit`): hook ấy cũng chạy khi lịch 30′ hay tin liên phiên đánh thức giám sát, nên câu bị đóng khi chưa
ai trả lời — đúng lỗi báo thiếu vòng này sửa. Quên `hoi-xong` thì khung báo DƯ, kèm tuổi câu («hỏi 3 giờ trước»),
chủ kho thấy ngay câu nào đã cũ. Báo dư là chiều an toàn.

**Giới hạn khai (không phải răng):** việc giám sát GỌI `hoi` khi hỏi trong chat là chỉ dẫn ở `commands/tiep-tuc.md`
và README, không có máy giữ. Ngưỡng mở vòng hook (ví dụ hook `Stop` ở cwd giám sát): ≥1 lần trên đợt thật chủ kho
thấy dải báo thiếu một câu giám sát đã hỏi.

**Đếm — một hàm `canAnh(kq)` ở `khung.mjs`:** trả danh sách mục chờ chủ kho, mỗi mục `{la_gi, o_phien, luc}`:
1. mỗi `cho_nguoi` của thợ (tệp chờ người: «xin quyền» / «chờ anh trả lời»; yêu cầu `can-nguoi`: câu hỏi của nó);
2. `can_nguoi` của sức khoẻ máy (ở phiên: «máy»);
3. mỗi câu mở `hoi_chu_kho` (ở phiên: «giám sát»).
Dải in `cần anh ${canAnh(kq).length}`, khung in `CẦN ANH: ${canAnh(kq).length}` — cùng hàm, nên hai số không lệch.

**Kho không có câu nào:** `xemJson` chỉ thêm khoá `hoi_chu_kho` khi có ít nhất một câu mở (cùng nếp khoá `tin`), nên
`xem`, `xem --json` và dải không đổi một byte ở kho không có giám sát đặt câu trong chat (luật 26/09). Dữ liệu riêng
của khung (tên việc, mục tiêu, số hàng, số đã gộp, dãy nghỉ) KHÔNG vào `xem --json`: nó đi qua cờ mới
`xem --json --khung`, và mod gọi cờ ấy. Ai đọc `xem --json` bằng máy nhận đúng khuôn cũ.

## 3. (b) Khung định vị

`chuKhung(kq, { bayGio })` ở `khung.mjs` (thuần, không import — mod nhập được), đầu vào là `xem --json --khung`. Pane
«Đợt» vẽ hàm này; lệnh
`/dieu-phoi:xem` và `xem` giữ chữ `xem` (máy đọc, đường lùi markdown in `xem`). CLI thêm `xem --khung` in khung ra
terminal (cùng hàm, `bayGio` = giờ máy).

Mẫu (đợt có câu treo, múi +07:00):

```
Đợt sau-14-10 — Gom bảy hàng vỏ khu Mục tiêu trước mốc 31/10
Tiến độ: xong 2/9 · đang làm 3 · đang chấm 1 · chờ 2 · rảnh 1
CẦN ANH: 2
  · Xác nhận chẩn đoán thước VK8 gãy vì VK6 — ở phiên giám sát — 40 phút trước
  · Vỏ khu Mục tiêu (K2) — xin quyền — ở dãy P1 — 3 phút trước
Việc:
  P1 · Vỏ khu Mục tiêu (K2) · đang làm
  P3 · t173 (chưa có tên trong lộ trình) · đang làm
  P5 · Sổ quyết định đợt (K5) · đang chấm, khoá tới 14:47
Cập nhật 1 phút trước · chi tiết máy: /dieu-phoi:xem
```

- **Dòng đầu — mục tiêu:** khoá tuỳ chọn mới `muc_tieu` của `hang-viec.json` (chuỗi; `kiemHangViec` nhận, sai kiểu là
  lỗi tên trường). Vắng → `Đợt <tên> — ⚠ chưa khai mục tiêu đợt` (cờ không in tên khoá; README chỉ giám sát khoá nào).
- **Tiến độ:** `xong` = số hàng của đợt đã gộp (`gop_da_bao` của `trang-thai.json`) / tổng hàng; mỗi dãy không nghỉ
  rơi vào ĐÚNG MỘT nhóm theo thứ tự ưu tiên: *đang chấm* (giữ khoá `s4`) · *chờ* (có mục trong `cho_nguoi`, hay đang
  chờ lượt trong `hang_cho`, hay `tien_do` `ky` — đã ký chờ gộp — hay `cho`) · *rảnh* (không hàng) · *đang làm* (còn
  lại). Thiếu `gop_da_bao` (trạng thái cũ) → `xong —/9 ⚠`.
- **CẦN ANH:** `canAnh(kq)` ở §2, cũ nhất trước; mỗi mục một dòng «là gì — ở phiên nào — bao lâu», «bao lâu» tính từ
  `luc` của chính mục (câu giám sát: lúc ghi `hoi`). `0` → một dòng `CẦN ANH: 0`. Vế «+ một câu» của chân định vị
  (ADR 0027 chân 1) thuộc lời mời cổng — bước (c); khung theo câu của bước (b): «mỗi việc mang tên từ tệp lộ trình».
- **Việc:** mỗi dãy một dòng `<dãy> · <tên> (<mã>) · <trạng thái tiếng người>`. Trạng thái: `chua` → chưa bắt đầu ·
  `dang` → đang làm · `ky` → đã ký, chờ gộp · `gop` → đã gộp · `xong` → hết hàng · `cho` → chờ: `<cho>`.
- **Tên việc:** tra trong tệp lộ trình — hàng thi công mang `tep` + `ma` (gói khai `nguon_hang`) → đọc `tep`; chỉ có
  `ma` → các tệp của `nguon_hang` (mã có ở đúng một tệp). Thứ tự tên: `ten_ngan` → `ten` → sáu từ đầu của `cau_giao`
  + «…» (cùng luật `tenNganHang` của `scripts/lo-trinh.mjs` cho phần có ở cả hai). Không tra được → `<slug hay mã>
  (chưa có tên trong lộ trình)` — dòng «là gì» không bao giờ chỉ có mã trần (răng §5). CLI dựng bảng tên trong
  `xemJson` (khoá `ten` trên mỗi dãy) vì mod không đọc tệp.
- **Giờ:** địa phương theo `mui_gio_phut` mà CLI báo; tương đối («vừa xong», «n phút trước», «n giờ trước», «hôm qua
  HH:MM», ngày `DD/MM HH:MM` khi xa hơn), giờ tuyệt đối dạng `HH:MM`. Không in ISO, mili-giây hay «Z».

**Đọc cũ:** `xem --json` bản trước (thiếu `ten`, `hoi_chu_kho`, `muc_tieu`, `gop_da_bao`) vẫn vẽ được: mỗi chỗ thiếu ra
cờ vàng ⚠ trên đúng dòng của nó, không ném.

## 4. Không làm

- Lời mời cổng, thẻ Cổng Đáng, tác động mỗi lối, dự đoán kín, ký theo chính sách — bước (c)–(f) của ADR 0027.
- Không đổi `veXem`, `chuXem`, bảng đợt `bang.html`, lệnh `chan-doan`/`tiep-tuc` (đọc câu giám sát trong chẩn đoán là
  việc sau nếu cần).
- Không tự đóng câu theo hook (§2).

## 5. Răng (bộ đo)

`tests/dieu-phoi/khung-dinh-vi.test.mjs` (ca `KD-…`), kho thử do code sinh từ fixture `dot-crm-0910` như
`khung.test.mjs`; ca đỏ tiêm vào BẢN SAO trọn thư mục `dieu-phoi` sau khi bản lành xanh, ghim thông điệp:
- KD-1 ghi câu + Monitor không lọt (chạy chính lệnh lọc trên sổ; đối chứng dòng `can_phan:true`).
- KD-2 đóng câu, id lạ, đóng hai lần.
- KD-3 khung đếm 0 khi sổ còn câu treo → ĐỎ (ca `-do`: bản sao bỏ phần cộng câu; thông điệp `cần anh 0 khi sổ còn 1
  câu treo`).
- KD-4 vi phân với bản trên nhánh chính: không câu → dải, `xem`, `xem --json` bằng nhau từng byte.
- KD-5…KD-9 khung: thứ tự khối, tên việc (ca `-do`: bản sao bỏ tra tên → `là gì chỉ có mã: K2`), giờ, tiến độ, đọc cũ.
Ca mod `tests/dieu-phoi/mod/khung.test.ts`: pane vẽ đúng `chuKhung` (thay ca «pane dung chu xem»).
