# Hạt giống — tham số lượt chấm đi bằng đường tệp, không dán vào tham số Workflow

**Ngày:** 2026-10-01 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: acceptance-gate-kit/_acceptance/thuoc-biet-truoc-khong-phan-duoc/ — sổ `d-20261001T022715Z-9`
(tệp args 35 KB, 163 mã băm thước; phiên sinh một bản script workflow nhúng nguyên tệp args, khác
bản gốc đúng một dòng). Cùng ngày ở crm `soan-okr-cung-tro-ly` (~100 KB args, sổ
`d-20261001T074708Z-19` «bản nhúng tham số một dòng»); phiên crm còn bị auto mode chặn đúng bước đó.

Phát hiện trong vòng: `_acceptance/luot-cham-ghi-vao-cay/` (Out of scope của hợp đồng trích lại tệp này).

## Hình dạng

SKILL bảo truyền TRỌN tệp `s4-args.json` làm tham số Workflow. Tệp lớn dần theo số eval và theo
ảnh chụp thước (mỗi tệp test kho một băm); dán vài chục KB qua tham số là chỗ máy chép sai (lớp lỗi
đã có sổ: bịa đuôi `evalsHash`, mất `inputsHash`) hoặc bị chặn. Đường vòng hai phiên dùng — sinh
một bản script nhúng args — chạy một script khác bản trong kho.

## Ý (chưa phải cam kết)

Bộ chấm nhận `args.argsPath`; workflow không có hệ tệp, nên một bước đọc tất định phải đứng trước
(ví dụ tác tử đầu tiên đọc tệp và trả nguyên văn, so băm với `generated_sha`/digest do s4-args
ghi). Phải giữ luật «args máy sinh, không soạn tay» và hạn dùng theo cây (`S4-ARGS-FRESHNESS`).

## Ngưỡng mở

≥1 lượt chấm nữa hỏng hoặc bị chặn vì cách truyền args (sau 01/10).
