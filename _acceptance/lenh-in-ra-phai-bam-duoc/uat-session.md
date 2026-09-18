---
schema_version: 1
slug: lenh-in-ra-phai-bam-duoc
feature: Lệnh kit in ra phải bấm được — không bắt người gõ lại tay
owner: phanlemanh@gmail.com
stage: scheduled
verdict:
decided_by:
decided_at:
---

## Ngưỡng đã khai tại Cổng Đáng (CHÉP NGUYÊN VĂN — cấm sửa sau khi thấy số)

- Câu hỏi phép đo trả lời: Trong ván lái-thử kế ở `artifact-platform`, owner có phải gõ lại tay lệnh nào do dạng kit in không?
- Kết quả nào là SỐNG: 0 lần gõ lại tay vì dạng kit in (owner tự đếm — một con số owner biết); kèm S4 đã chứng 48/48 điểm khớp bảng và 0 chỗ `uat-session` thiếu gạch (baseline trước: 7).
- Kết quả nào là CHẾT: ≥ 1 lần owner gõ lại vì dạng kit in.
- Timebox: ván lái-thử kế ≤ 30/08/2026; hồ sơ T2 ≤ 1 ngày máy.

## Người dự

Vòng nội bộ của bộ công cụ: người dùng cuối của lệnh in ra là chính chủ kho,
trong ván lái-thử ở repo tiêu thụ `artifact-platform`.

| Tên | Vai | Đại diện cho ai |
|---|---|---|
| Mạnh | chủ kho, người ký | người đọc lệnh kit in ra rồi bấm/dán để chạy |

## Chấm kín (thu TRƯỚC mọi thảo luận chung)

| Người | Điểm/nhận xét kín | Sẽ gửi cho khách nào, khi nào |
|---|---|---|
| Mạnh | (điền khi ký) | — |

## Thảo luận sau khi đã chấm

**Cờ vàng — chưa lái-thử.** Không có `stranger-drive.md` trong hồ sơ, nên điều
kiện «sản phẩm thật đã chạy sau flag để người dự bấm được» ở đây là **lời khai**,
không phải bằng chứng. Nghi thức cho phép mở phiên với cờ này; ghi ra để người ký
biết mình đang ký trên nền nào.

**Máy đã đo nửa TĨNH của ngưỡng** (hợp đồng ký 22/08, S4 verdict PASS, bốn eval
E2/E9/E10/E11 phủ AC-2). Ca `[LB2]` của lượt chấm đo trên **13 file**:
`0 lệnh dạng trần · 0 chỗ uat-session thiếu tiền tố · 68 lệnh có tiền tố ⊆ bảng
COMMAND-NAMES`. Con số 48/7 trong ngưỡng là số lúc mở ô; bộ vật đã lớn lên nên
đối chiếu đúng là **quan hệ** (0 sai, 0 thiếu), không phải hằng 48.

**Nửa còn lại chỉ owner biết** và máy không có đường đo: ván lái-thử kế ở
`artifact-platform` có xảy ra không, và trong ván đó owner có phải gõ lại tay
lệnh nào vì dạng kit in không. Không có nhật ký nào của kit ghi việc đó.

## Số đo thật đặt cạnh ngưỡng

| Thước | Ngưỡng đã khai | Số đo được | SỐNG/CHẾT |
|---|---|---|---|
| Nửa tĩnh: 0 lệnh dạng trần, 0 chỗ `uat-session` thiếu tiền tố | 48/48 điểm khớp bảng · 0 chỗ thiếu gạch (baseline trước chip D: ≥ 7 sai) | `[LB2]` trên 13 file: **0 trần · 0 thiếu tiền tố · 68 lệnh ⊆ bảng**; S4 PASS, AC-2 phủ bởi E2/E9/E10/E11 | **SỐNG** |
| Nửa người: số lần owner gõ lại tay vì dạng kit in | 0 lần (owner tự đếm trong ván) | **CHƯA ĐO** — owner khai | — |
| Ván lái-thử kế ở `artifact-platform` ≤ 30/08/2026 | có ván trong hạn | **CHƯA ĐO** — owner khai | — |

## Quyết định Cổng Giá trị

**Phiên KHÔNG họp — cửa sổ đo đã khép.** Ván lái-thử kế ở `artifact-platform` không xảy ra trong hạn 30/08, nên nửa chỉ-người-biết của ngưỡng không có số.

Owner quyết 18/09: **xếp lại sau** (`decision: park` bên `opportunity.md`). `verdict` ở đây để
TRỐNG **có chủ ý** — enum của Cổng Giá trị là `release | iterate | kill`, và ghi bất kỳ
giá trị nào trong đó sẽ khai một phiên nghiệm thu chưa từng đo gì. Bảng số đo bên trên
giữ nguyên các dòng CHƯA ĐO làm vết: cái không đo được thì nói ra, không làm tròn.

Bước kế: không ai. Vật đã giao và nằm trong engine; ô đã xếp lại.

(người ký điền `verdict`, `decided_by`, `decided_at`, và `stage: held`)
