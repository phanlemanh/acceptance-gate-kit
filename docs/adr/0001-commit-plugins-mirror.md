# Commit `plugins/` như build mirror (phương án b)

> **SUPERSEDED 2026-08-12 bởi [ADR 0008](0008-luu-kho-harness-codex.md).** Lý do
> tồn tại của bản mirror — manifest Codex không trỏ được vào cây nguồn
> đa-edition — chết cùng lúc harness Codex được lưu kho, nên `plugins/`,
> `scripts/sync-plugin-packages.sh` và lưới P30 canh drift đều đã gỡ khỏi cây.
> Giữ trang này làm sử liệu: nó ghi vì sao kit từng chấp nhận một "second
> source of truth", và nếu Codex được mở lại từ mốc `truoc-luu-kho-2026-08` thì
> ràng buộc mô tả ở đây quay lại nguyên vẹn.

Manifest plugin của Codex chỉ nhận `skills` là **một chuỗi path** rồi quét đệ
quy — không trỏ được vào cây nguồn đa-edition (`skills/` + `codex/` overlay),
và symlink không sống sót qua install. Chúng tôi chọn commit `plugins/` như
bản build phẳng sinh bởi `scripts/sync-plugin-packages.sh`, chấp nhận "second
source of truth" để ship được cả hai harness ngay, thay vì restructure toàn
repo (blast radius lớn). Drift được chặn bằng `sync-plugin-packages.sh --check`
trong test suite (P30): sửa nguồn xong PHẢI chạy sync và commit mirror cùng lượt.

Tham chiếu ngoài: mattpocock/skills ADR-0002 gặp đúng ràng buộc này và defer —
kit không defer được vì Codex là harness bắt buộc của đội.
