# Commit `plugins/` như build mirror (phương án b)

Manifest plugin của Codex chỉ nhận `skills` là **một chuỗi path** rồi quét đệ
quy — không trỏ được vào cây nguồn đa-edition (`skills/` + `codex/` overlay),
và symlink không sống sót qua install. Chúng tôi chọn commit `plugins/` như
bản build phẳng sinh bởi `scripts/sync-plugin-packages.sh`, chấp nhận "second
source of truth" để ship được cả hai harness ngay, thay vì restructure toàn
repo (blast radius lớn). Drift được chặn bằng `sync-plugin-packages.sh --check`
trong test suite (P30): sửa nguồn xong PHẢI chạy sync và commit mirror cùng lượt.

Tham chiếu ngoài: mattpocock/skills ADR-0002 gặp đúng ràng buộc này và defer —
kit không defer được vì Codex là harness bắt buộc của đội.
