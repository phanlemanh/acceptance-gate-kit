# ADR 0005 — Răng T1-escape có cờ tắt `--no-t1-escape`, và vì sao nó KHÔNG mâu thuẫn ADR 0004

`scripts/pre-merge-check.sh` nhận cờ `--no-t1-escape` (không tham số) để tắt riêng
răng T1-escape — luật đòi mọi thay đổi chạm code quan trọng phải kèm
`_acceptance/<slug>/`; khi tắt, script phát marker máy-đọc
`T1-ESCAPE: NOT ENFORCED reason=push-event-no-pr-premise` kèm hai dòng NOTE giải
thích cho người, và `.github/workflows/gate.yml` truyền cờ này ở nhánh `push`
(nhánh `pull_request` KHÔNG truyền). Đọc cạnh ADR 0004 thì trông như hai chuẩn
ngược nhau — 0004 từ chối miễn trừ nhánh không-base cho gap-probe với lý do
"miễn trừ đó lại đúng là lỗ vừa bịt" — nên phải nói rõ chỗ khác nhau: gap-probe
hỏi *"slug nào có file trong diff"*, một câu hỏi **đúng với mọi sự kiện**, nên
miễn trừ nó là bịt mắt cổng; còn răng T1-escape mang tiền đề *"thay đổi này là
một PR, nên phải kèm hồ sơ nghiệm thu"*, và tiền đề đó **sai** với commit đóng
gói bản phát hành hay đồng bộ bản sao landing thẳng nhánh chính — loại commit
theo thiết kế không có feature nào để mà kèm hồ sơ. Tắt một luật ở nơi tiền đề
của nó sai không phải hạ chuẩn; để nó chạy ở đó mới là làm cổng đỏ vì lý do cấu
trúc, và cổng đỏ thường xuyên vì lý do cấu trúc chính là cách người ta học cách
phớt lờ nó — đúng thứ ADR 0004 viết ra để chống. Chọn opt-OUT chứ không opt-in
`--pr`: `acceptance-init` của cả hai harness đang dạy consumer truyền `--base`,
nên opt-in sẽ làm răng tắt IM LẶNG trên mọi repo tiêu thụ đang chạy — biến một
sửa lỗi thành lỗ fail-open hàng loạt. Trade-off nhận về: cờ là một dạng bypass,
chống lạm dụng bằng **tiếng ồn bắt buộc** (marker + hai NOTE + dòng tổng kết)
chứ không bằng cấm, vì cấm thì người ta quay lại bỏ `--base` và mất luôn
gap-probe. Kèm theo, cờ lạ nay là **lỗi cứng** (`exit 2`): trước đó nhánh bắt-tất
`*) ROOT="$1"` nuốt cờ gõ sai thành đường dẫn, làm cổng thoát 0 mà không chạy
luật nào — một lỗi gõ trong CI của consumer là đủ.

Ledger: `d-20260727T040000Z-201`. Răng: `TE1`–`TE3` (mặc định + hai chuỗi hằng),
`TE4`/`TE5` (cờ không phải bypass toàn cục), `TE16` (delta trên triệu chứng gốc),
`TE18` (cờ lạ = exit 2), `P40` (gate.yml, assert trên hai nhánh gán cờ).
