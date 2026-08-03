# Miễn trừ `PRODUCT-MAP.md` khỏi `t1_skip_globs` — vì nó là view máy sinh có cổng riêng canh

Bản đồ sản phẩm được vẽ lại tại mỗi lần đóng cổng người, và bước ký Cổng 2 đưa
nó vào CHÍNH commit chữ ký. Không miễn trừ thì `stale_files()` của
`pre-merge-check.sh` đọc nó là "code đổi sau khi verify" và chặn merge — mà
re-verify xong ký lại thì lại chạm bản đồ lại, tức một vòng không thoát do
chính nghi thức sinh ra (dựng lại được, S4-r4 của `product-map-uat-session`).
Miễn trừ an toàn vì bản đồ KHÔNG phải hành vi: nó là hàm thuần của hồ sơ trong
`_acceptance/`, và `node scripts/product-map.mjs --root . --check` trong CI
canh `bản đồ == hồ sơ` độc lập — canh CẢ HAI cạnh: sửa tay thì đỏ, và **xoá
cũng đỏ** (file đã được git theo dõi mà biến mất là một lần xoá, không phải
"repo chưa dựng bản đồ"), vì nếu không thì một PR chỉ xoá bản đồ vừa bỏ qua
cổng nhờ miễn trừ này vừa xanh ở CI. Cổng đó fail-CLOSED trước hai hình dạng lỗi gõ đã
chốt: mode lạ (`--chek`) và `--root` thiếu giá trị đều bị từ chối với exit 2 thay
vì rơi về nhánh GHI và xoá mất bằng chứng lệch — cùng chốt mà
`sync-plugin-packages.sh` đã dựng cho chính lớp lỗi này. **Chưa phủ:** `--root`
trỏ vào một đường dẫn SAI nhưng hợp lệ về cú pháp vẫn exit 0 (nhánh "repo chưa
dựng cổng" chạy trước khi phân biệt mode) — known-limit đã ghi, đi tiếp ở hợp
đồng `workspace-reader-unification` (AC-5). Ai wire cổng này vào CI phải tự đảm
bảo đường dẫn đúng cho tới khi lỗ đó được vá — đúng vai P30 canh `mirror == nguồn` ở ADR
0001, nên sửa tay ở đây bị bắt bởi một luật khác chứ không lọt. Miễn trừ này
KHÔNG mở rộng sang bất kỳ file gốc repo nào khác: điều kiện để được vào danh
sách là **máy sinh toàn phần + có một cổng độc lập canh drift**, và đề xuất
nới `t1_skip_globs` cho `.github/**` + `.claude-plugin/plugin.json` đã bị TỪ
CHỐI (`.out-of-scope/t1-skip-globs-github-and-manifests.md`) đúng vì hai path
đó không thoả điều kiện — chúng khai được hành vi và không có cổng nào canh.
