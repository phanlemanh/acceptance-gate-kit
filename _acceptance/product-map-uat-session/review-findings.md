## Trong hợp đồng

- **Bản đồ sản phẩm in tên việc bị cụt vì frontmatterField cắt nhầm dấu nháy cuối — bản đã commit đang sai**
  AC: AC-13b
  file: `PRODUCT-MAP.md:36`
  severity: medium
  detail: lib/evidence-core.js:96 dùng `.replace(/^["']|["']$/g, '')` — nó gỡ nháy ĐẦU và nháy CUỐI độc lập, nên một giá trị KHÔNG được quote nhưng kết thúc bằng `"` bị mất ký tự cuối.

  Đo thật trên hồ sơ có sẵn trong repo:
  `_acceptance/s4-scope-triage/contract.md:3` →  `feature: Scope-triage cho review findings ở S4 — ngăn thứ ba "thật nhưng ngoài hợp đồng"`
  `frontmatterField(...,'feature')` → `'Scope-triage cho review findings ở S4 — ngăn thứ ba "thật nhưng ngoài hợp đồng'`   (mất dấu `"` cuối)

  Hệ quả nhìn thấy được: PRODUCT-MAP.md:36 đã commit với dòng nháy lệch `... ngăn thứ ba "thật nhưng ngoài hợp đồng (`s4-scope-triage`)`. Đây là artifact mặt người, máy sinh, có CI canh — nên cái sai này được ghim cứng và tái sinh mỗi lần regen.

  Lỗi gốc ở evidence-core có trước diff này, nhưng diff này mới là thứ dựng consumer in nguyên văn `feature:` ra văn bản cho người đọc, và commit sẵn đầu ra hỏng. Sửa đúng chỗ: chỉ bóc nháy khi cặp KHỚP (`/^"(.*)"$/` hoặc `/^'(.*)'$/`), kèm ca RED trong P111 (khối "đối chứng dương" ở mục 4 hiện chưa có hình dạng giá trị-kết-thúc-bằng-nháy).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **start-scan giữ luật "hồ sơ hỏng" thứ hai ngoài lib/workspace-record.js — hai reader vẫn cho kết luận trái nhau**
  Người dùng thấy gì: Khi một hồ sơ bằng chứng bị lỗi định dạng, /start báo "hồ sơ hỏng" nhưng bản đồ sản phẩm lại hiển thị việc đó như đang làm bình thường — hai nơi nói khác nhau về cùng một việc, dễ khiến bạn bỏ sót việc cần sửa.
  file: `scripts/start-scan.mjs`
  severity: high
  Đề xuất: known-limits

- **Cổng Giá trị là cổng người thứ tư nhưng không nằm trong danh sách khoá, và quyết định đó không được ghi ở đâu ngoài comment test**
  Người dùng thấy gì: Bước ký duyệt giá trị sản phẩm (Cổng Giá trị) không có lệnh gõ tay riêng để bàn giao như ba cổng còn lại, và lý do vì sao bước này được để mở chỉ nằm trong ghi chú kỹ thuật nội bộ — người vận hành có thể không nắm được quy tắc này.
  file: `skills/uat-session/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **`.out-of-scope/` là input của bản đồ nhưng không có điểm regen nào — mọi PR ghi một quyết-định-không-làm sẽ đỏ CI**
  Người dùng thấy gì: Khi bạn ghi lại một quyết định "không làm" vào hồ sơ, bước kiểm tra tự động trên các PR sau có thể báo lỗi "lệch bản đồ" dù không ai làm gì sai, vì chưa có bước nào tự cập nhật lại bản đồ sau khi ghi quyết định đó.
  file: `.github/workflows/gate.yml`
  severity: medium
  Đề xuất: known-limits

- **P113 phá PRODUCT-MAP.md THẬT trong cây làm việc thay vì trong bản sao**
  Người dùng thấy gì: Đây là vấn đề trong bộ kiểm thử nội bộ chứ không phải trong sản phẩm bàn giao — nếu bộ kiểm thử bị ngắt giữa chừng, file bản đồ sản phẩm đã lưu trong kho có thể bị ghi bẩn một dòng giả.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

- **Hai reader vẫn trái nhau về "hồ sơ hỏng": evidence-report.md nằm ngoài luật chung**
  Người dùng thấy gì: Cùng một hồ sơ nghiệm thu bị lỗi lại được /start và bản đồ sản phẩm báo cáo khác nhau — một bên nói "hỏng", một bên nói "đang làm bình thường" — khiến người xem không biết nên tin bên nào.
  file: `scripts/start-scan.mjs`
  severity: high
  Đề xuất: known-limits

- **--check exit 0 khi PRODUCT-MAP.md bị xoá — xoá bản đồ lọt qua cổng CI duy nhất canh nó**
  Người dùng thấy gì: Nếu file bản đồ sản phẩm bị xoá nhầm (không phải chưa từng có), công cụ kiểm tra tự động vẫn báo "ổn" thay vì báo lỗi — việc xoá nhầm bản đồ có thể lọt qua mà không ai phát hiện.
  file: `scripts/product-map.mjs`
  severity: medium
  Đề xuất: known-limits

- **Phiên nghiệm thu đã dựng nhưng chưa ký biến mất khỏi nhóm chờ ký khi slug không thuộc đường A**
  Người dùng thấy gì: Một phiên nghiệm thu đã được chuẩn bị nhưng chưa có người ký kết luận có thể biến mất khỏi danh sách "đang chờ bạn ký" trên thẻ /start nếu việc đó không đi theo đúng nhánh quy trình đã ghi.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Cơ hội stage: archived nằm mãi trong nhóm chờ chữ ký người**
  Người dùng thấy gì: Một cơ hội sản phẩm đã được xếp vào kho lưu vẫn bị liệt kê mãi trong danh sách "đang chờ bạn cân nhắc" trên thẻ /start, dù thực ra không còn cần quyết định gì nữa.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Case P113 ghi đè file PRODUCT-MAP.md đang được theo dõi của chính repo trong lúc chạy test**
  Người dùng thấy gì: Đây là vấn đề trong bộ kiểm thử nội bộ chứ không phải trong sản phẩm bàn giao — nếu bộ kiểm thử bị ngắt giữa chừng hoặc chạy chồng với thao tác ghi khác, file bản đồ sản phẩm đã lưu trong kho có thể bị ghi bẩn.
  file: `tests/plugins/run-tests.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).