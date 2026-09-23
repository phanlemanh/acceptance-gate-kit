# Hạt giống — răng bên đọc cho `verified_at` và chữ ký, đi SAU chiến dịch ghim lại theo run-log thật

**Ngày:** 2026-09-23 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Mức:** trung bình — lỗ còn lại sau vòng chốt máy
Gốc: _acceptance/chot-may-chu-ky-sau-synthesize — Cổng Phạm vi 23/09: owner KHÔNG phê vế 2 của hạt giống `2026-09-23-hat-giong-tac-tu-tong-hop-ghi-truong-cua-nguoi.md` trong vòng ấy; số đo ở mục «Vấn đề» của design doc `docs/superpowers/specs/2026-09-23-chot-may-chu-ky-sau-synthesize-design.md` và Out of scope của hợp đồng.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Lỗ còn lại sau vòng chốt máy

Vòng `chot-may-chu-ky-sau-synthesize` (mốc 2.18.2) chặn đường BÊN VIẾT: workflow S4 ép rỗng
`human_signoff` / `human_override` / `bypass_ack` và ép `verified_at` bằng giờ engine trước khi
trả báo cáo. Bên ĐỌC vẫn không có răng:

- `lib/evidence-core.cjs` chỉ kiểm `verified_at` có dạng ISO, không so với giờ nào.
- Lưới trước-merge chỉ kiểm `human_signoff` khác rỗng, khớp `status` và không phải chuỗi giữ chỗ.
- Bộ đọc L3 đếm dòng `human_override` có giá trị ở BẤT KỲ ĐÂU trong báo cáo, kể cả trong khối
  vô hướng mà chốt máy cố ý không chạm.

Hệ quả: chữ ký do PHIÊN tự viết ngoài `/signoff`, và giá trị bịa đã nằm trong hồ sơ cũ, vẫn đi
qua lưới.

Thêm một lỗi của chính bên đọc, lộ ra ở ca vi phân của vòng chốt máy (S4 lượt 3, 23/09): biểu thức
L3 `human_override\s*[:=]\s*[^#\s]` có `\s*` vượt dòng, nên một dòng `human_override:` rỗng TRẦN
bị đếm là «đã có người chấp thuận» khi dòng kế không mở bằng `#` (đo: `human_override:` rồi dòng
trống rồi `- eval: E2` → đếm 1). Chốt máy tự phòng bằng dạng rỗng có chú thích; răng bên đọc nên
neo biểu thức vào một dòng.

## Căn cứ (đo 23/09, `origin/main` kit · `origin/fix/tieu-de-cot-doc-tron` crm)

| Luật đọc đề xuất | Hồ sơ kit đỏ | Hồ sơ crm đỏ |
|---|---|---|
| `verified_at` sớm hơn `ts` run-log cùng `run_id` | 13 / 84 | 12 / 56 |
| `verified_at` muộn hơn giờ commit gần nhất chạm báo cáo | 0 / 84 | 6 / 56 |
| `human_signoff` khác rỗng mà không có commit `Gate 2 signoff: <slug>` | 37 / 81 đã ký | 6 / 51 đã ký |

Dòng thứ ba phần lớn là hồ sơ ký trước khi nghi thức commit ký ra đời — nợ lịch sử, không phải
chữ ký máy. Dòng một là giá trị tác tử đặt (ví dụ `ho-so-nghi`: `10:15:00Z` so với run-log
`14:01:23Z`).

## Thứ tự (owner quyết 23/09)

1. **Trước:** chiến dịch ghim lại theo run-log thật cho 13 hồ sơ kit + 12 hồ sơ crm đang mang
   `verified_at` bịa — giá trị lấy từ `ts` của dòng run-log cùng `run_id`, không soạn tay.
2. **Sau:** răng bên đọc trong `lib/evidence-core.cjs` / `scripts/recheck-evidence.cjs` (CỘNG
   một luật đọc — owner phê đích danh, ADR 0018; chạm `t3_paths` → vòng T3).

## Ngưỡng bật răng

**0 hồ sơ đỏ trên corpus kit + crm** dưới ba luật trên, đo SAU chiến dịch ở bước 1. Còn hồ sơ đỏ
thì răng chưa bật — không mốc ngày, không ân xá theo ngày; hồ sơ nào không sửa được (ví dụ chữ
ký trước nghi thức commit ký) phải được gọi tên trong răng như nợ hai chiều, không im.
