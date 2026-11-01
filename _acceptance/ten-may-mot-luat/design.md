# Thiết kế: một luật tên máy cho kênh liên máy

Hồ sơ `ten-may-mot-luat` · vòng vá cho bản 2.36.2 · issue phanlemanh/acceptance-gate-kit#464 · Cổng Đáng: chủ kho
«Mở cả bốn» (31/10).

## Vấn đề

| Chỗ | Luật hôm nay | Tệp |
|---|---|---|
| Nhận vai | `/^[A-Za-z0-9]+$/u` viết tại chỗ — «tên máy chỉ gồm chữ và số (thành tiền tố mã tin)» | `dieu-phoi/scripts/tin-kenh.mjs` (`vai`) |
| Bên viết | `den` = đối số đích nguyên văn; chế độ kênh không kiểm gì (chế độ đợt kiểm đích là dãy hoặc `G`) | `dieu-phoi/scripts/tin.mjs` (`gui`) |
| Bên đọc | `/^(\S+) · (\S+) → (\S+)$/u` — người gửi và người nhận không có khoảng trắng | `dieu-phoi/scripts/tin-doc.mjs` (`docDongDau`) |
| Mã tin | `MA_RE = /^[A-Za-z0-9]+-\d{4}-\d+$/u` — tiền tố là tên người gửi | `dieu-phoi/scripts/tin-doc.mjs` |

Tên «Mac Studio» qua được bên viết, không qua bên đọc, không qua nhận vai: tin đăng được mà không ai thấy.

## Lối chọn

Luật tên máy sống MỘT chỗ, ở lõi thuần `tin-doc.mjs` (đã là module mọi bên cùng nạp):

```
TEN_MAY_NGUON = '[A-Za-z0-9]+'                       // một nguồn
TEN_MAY_RE    = ^TEN_MAY_NGUON$                       // luật tên máy
MA_RE         = ^TEN_MAY_NGUON-\d{4}-\d+$             // tiền tố mã tin rút từ cùng nguồn
loiTenMay(ten, vai) → null | «<vai> «<ten>» không hợp lệ — tên máy chỉ gồm chữ và số (thành tiền tố mã tin); thử «<gợi ý>»»
```

- `tin vai --may <tên>` gọi `loiTenMay(tên, 'tên máy')` thay cho biểu thức viết tại chỗ.
- `tin GIAO|HỎI|BÁO <đích> --kenh …` gọi `loiTenMay(đích, 'đích')` TRƯỚC khi mở nơi chứa — tức trước mọi lời gọi
  mạng (cùng chỗ với kiểm `--han`): sai thì thoát 1, không gọi `gh` lần nào, không đổi tệp trạng thái kênh.
- Gợi ý = tên bỏ khoảng trắng («Mac Studio» → «MacStudio»), chỉ in khi gợi ý ấy qua luật; không qua («Mac-Studio»,
  «Máy») thì bỏ vế «thử …» — máy không bịa một tên khác nghĩa.
- Chế độ đợt (không `--kenh`) không đổi: đích vẫn kiểm là dãy hoặc `G` như cũ.
- Bên đọc giữ `\S+` cho người gửi/nhận — bộ đọc khoan dung. Lý do: bên đọc còn đọc tin chế độ đợt (đích là mã dãy) và
  tin cũ trên hai kênh đang chạy; siết nó không thêm tin nào tới đúng chỗ mà có thể làm một dòng đầu cũ thôi đọc được.
  Quan hệ được giữ bằng răng round-trip: MỌI tên luật nhận, viết bằng `vietDongDau` rồi đọc bằng `docDongDau`, phải ra
  đúng `den`, `tu` và mã — và mọi tên luật từ chối thì bên viết không bao giờ viết.

Cân trên mọi kho (luật 26/09):

| Ai | Trước vòng | Sau vòng |
|---|---|---|
| Máy đang dùng tên MBP, MacStudio, M5 | chạy | chạy y như cũ (tên hợp lệ) |
| Ai gõ đích có dấu cách / gạch nối / dấu | tin đăng, nằm chết | bị từ chối kèm luật và gợi ý, kênh không đổi |
| Chế độ đợt | đích dãy hoặc `G` | không đổi |
| Tin cũ trên kênh | đọc như cũ | đọc như cũ (bộ đọc không đổi) |

## Đặc tả UX

Bỏ — lệnh dòng lệnh, không có mặt người nhìn ngoài thông điệp lỗi (dòng sổ descope).

## Ngoài phạm vi

- Đối số vị trí thừa: `tin GIAO Mac Studio "ý định"` (không nháy) đọc đích là «Mac» và ý định là «Studio» — lỗi khác
  lớp (bộ tách đối số không từ chối đối số thừa), ghi hạt giống, không sửa ở vòng này.
- Siết bên đọc theo luật tên máy.
- Đổi tên máy đang dùng, hay dọn tin chết đã đăng trên crm-onehub#375.
