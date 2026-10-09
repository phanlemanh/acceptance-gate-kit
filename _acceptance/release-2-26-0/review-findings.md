# Review findings: release-2-26-0 (round 1)

## Trong hợp đồng

- **PRODUCT-MAP.md đã cũ so với hồ sơ ở HEAD nên eval E3e (product_map --check) đỏ**
  file: `_acceptance/release-2-26-0/evals.yaml:85`
  severity: high
  AC: AC-3
  source: conventions
  detail: E3e đòi exit 0 từ `node scripts/product-map.mjs --root . --check`. Ở HEAD (8291bf63) lệnh thoát khác 0 với thông báo «PRODUCT-MAP.md lệch với hồ sơ xưởng». Bản đồ được vẽ ở commit mở hồ sơ 8493dfa7 khi hợp đồng còn `status: draft`; ở commit đó kiểm tra xanh và release nằm dưới «Chờ duyệt phạm vi — 1 việc». Commit a8e0498d chuyển hợp đồng sang `implemented` mà không vẽ lại bản đồ. Bản vẽ mới (dựng từ git archive của HEAD vào scratchpad) đưa release-2-26-0 vào «Đang làm» (3 việc) và làm «Chờ duyệt phạm vi — chưa có»; bản đã commit vẫn ghi release này đang chờ duyệt phạm vi. Tiền lệ 2.25.0: ở 3ad1e4a9 (mở, draft) kiểm tra đỏ, ở 5f5ebe5f (implemented) kiểm tra xanh vì bản đồ được vẽ cho đúng trạng thái mà lượt chấm đọc. Lần này thứ tự ngược lại, nên E3e đỏ do chính hồ sơ của release chứ không do mã plugin. Câu «bản đồ vẽ lại cùng commit mở hồ sơ» trong eval mô tả đúng bước đã cũ đi. Cách sửa: vẽ lại PRODUCT-MAP.md sau bước đổi trạng thái sang implemented (cùng commit a8e0498d hoặc commit nối tiếp). Các kiểm tra khác trong vùng rà đều xanh: rel2260_cua_so XANH (ba slug khớp), rel2260_dd_giu 2.7.1 = 2.7.1, plugins_vung_3/P200 xanh, khoá executor nằm đúng mục.

- **E3e (bản đồ sản phẩm khớp hồ sơ) đỏ ở HEAD: commit chuyển hồ sơ sang implemented không vẽ lại PRODUCT-MAP.md**
  file: `_acceptance/release-2-26-0/evals.yaml:80`
  severity: high
  AC: AC-3
  source: bugs
  detail: E3e chạy `config:executors.script.product_map` (`node scripts/product-map.mjs --root . --check`) và kỳ vọng exit 0 với ghi chú «bản đồ vẽ lại cùng commit mở hồ sơ». Ở HEAD 8291bf63 lệnh thoát khác 0 và in «PRODUCT-MAP.md lệch với hồ sơ xưởng». Nguyên nhân: 8493dfa7 vẽ bản đồ khi hợp đồng còn `draft` (release ở ô «Chờ duyệt phạm vi», kiểm tra thoát 0 ở commit đó); a8e0498d đổi `draft → implemented` (chỉ sửa contract.md) mà không vẽ lại. Bucket của implemented là «Đang làm», nên bản đồ vẽ lại chuyển dòng release-2-26-0 từ «Chờ duyệt phạm vi» sang «Đang làm» và đổi hai bộ đếm trong flowchart (1 việc thành chưa có, 2 thành 3 việc); đã dựng lại trên bản sao git archive của HEAD và thấy đúng diff này. So với 2.25.0: commit mở 3ad1e4a9 kiểm tra đỏ, commit implemented 5f5ebe5f kiểm tra xanh, tức bản đồ được vẽ theo trạng thái implemented. Lần này ngược thứ tự nên E3e (và bước CI product_map) đỏ cho tới khi PRODUCT-MAP.md được vẽ lại sau lần đổi trạng thái. Hệ quả đo thêm ở lượt chấm: hai ca của vùng 1 suite plugins (P122 ở dòng kiểm bản đồ cuối, P126 ở bước đối chứng dương) đỏ vì cùng gốc này, nên E3c cũng đỏ. Các eval khác chạy lại đều xanh: rel2260_cua_so XANH, rel2260_dd_giu xanh (2.7.1 = 2.7.1), plugins_vung_3/P200 xanh; mốc c01e5bf2 = v2.25.0 và câu «Lớp chép CI ĐỔI bốn tệp» trong mô tả plugin khớp kho.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

(không có mục nào)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
