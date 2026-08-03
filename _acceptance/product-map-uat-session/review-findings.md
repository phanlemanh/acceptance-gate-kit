## Trong hợp đồng

Không có finding nào map được vào AC round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **ADR số 0003 bị trùng — hai ADR khác nhau cùng số, mọi tham chiếu "ADR 0003" thành nhập nhằng**
  Người dùng thấy gì: Hai quyết định thiết kế khác nhau trong hồ sơ dự án đang dùng chung một số hiệu tài liệu, nên khi ai đó tra lại quyết định theo số hiệu này có thể mở nhầm tài liệu và hiểu sai lý do đằng sau.
  file: `docs/adr/0003-product-map-t1-exemption.md`
  severity: high
  Đề xuất: known-limits

- **skills/uat-session/SKILL.md trỏ tới `references/uat-session-template.md` không tồn tại trong thư mục skill**
  Người dùng thấy gì: Bước hướng dẫn đầu tiên của nghi thức phiên nghiệm thu trỏ tới một khuôn mẫu không có ở nơi được chỉ, nên người hoặc trợ lý làm theo bước này sẽ không tìm thấy khuôn mẫu và có thể phải tự đoán cách điền phiên nghiệm thu.
  file: `skills/uat-session/SKILL.md`
  severity: high
  Đề xuất: known-limits

- **Luật "bản đồ có mặt không" KHÔNG được gom về một chỗ — hai reader cho hai kết luận trái nhau khi PRODUCT-MAP.md bị xoá**
  Người dùng thấy gì: Khi bản đồ sản phẩm bị mất sau khi từng được lưu, một công cụ báo bình thường ("chưa có bản đồ, sẽ tự vẽ") còn công cụ kia báo cần khôi phục ngay — người mở phiên làm việc có thể yên tâm nhầm trong khi hệ thống kiểm tra tự động đang báo lỗi.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Thêm một cổng người thứ tư (Cổng Giá trị / uat-session) mà không cập nhật ADR 0002 và CLAUDE.md — chính sách khoá invocation chỉ còn sống trong comment của test**
  Người dùng thấy gì: Cổng nghiệm thu mới (Cổng Giá trị) cố tình được để mở cho máy gọi, nhưng lý do đó chưa được ghi vào tài liệu chính sách chung — người bảo trì sau này đọc tài liệu có thể tưởng đây là thiếu sót và khoá nhầm, làm gãy luồng bàn giao đang hoạt động.
  file: `docs/adr/0002-human-gate-invocation-lock.md`
  severity: low
  Đề xuất: known-limits

- **Hai reader vẫn cho hai kết luận trái nhau về 'hồ sơ hỏng' (evidence-report.md nằm ngoài luật chung)**
  Người dùng thấy gì: Một hồ sơ công việc có báo cáo bằng chứng bị hỏng hoặc thiếu sẽ được một công cụ gắn cờ có vấn đề, nhưng công cụ kia lại xếp nó vào mục bình thường trên bản đồ sản phẩm — người xem bản đồ không biết công việc đó đang gặp trục trặc.
  file: `scripts/start-scan.mjs`
  severity: high
  Đề xuất: known-limits

- **`--check` fail-open khi `git ls-files` lỗi vì lý do KHÁC 'file chưa được theo dõi'**
  Người dùng thấy gì: Trong một số tình huống môi trường bất thường, công cụ kiểm tra bản đồ sản phẩm có thể báo mọi thứ ổn ngay cả khi bản đồ thực ra đã bị mất — khiến người xem tin nhầm là an toàn.
  file: `scripts/product-map.mjs`
  severity: medium
  Đề xuất: known-limits

- **`since` của cổng `gia-tri` neo vào `decided_at` — trường chỉ tồn tại SAU khi slug đã rời khỏi nhóm cổng**
  Người dùng thấy gì: Cách tính thời gian chờ của bước nghiệm thu giá trị có thể bị đặt lại mỗi khi hồ sơ được chạm vào bởi việc định dạng hoặc đồng bộ, nên một công việc thực sự chờ đã lâu có thể trông như mới chờ gần đây và bị xếp xuống dưới trong danh sách ưu tiên.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **Giá trị có nháy kèm ` #` đọc ra thừa một dấu nháy mở, in nguyên văn ra bản đồ**
  Người dùng thấy gì: Nếu mô tả tính năng trong hồ sơ có chứa dấu # bên trong cặp nháy kép, bản đồ sản phẩm hiển thị mô tả đó bị cụt và còn sót một dấu nháy lạc — người đọc thấy dòng mô tả trông hỏng hoặc không rõ nghĩa.
  file: `lib/evidence-core.js`
  severity: low
  Đề xuất: known-limits

- **Thân `/start` bên Codex trỏ sang skill `uat-session` không tồn tại trong harness đó**
  Người dùng thấy gì: Người dùng harness Codex khi được điều hướng tới bước phiên nghiệm thu sẽ gặp ngõ cụt vì bước đó chưa có bên Codex — đây là giới hạn đã biết, chưa hỗ trợ ở harness này.
  file: `codex/acceptance-gate/skills/start/SKILL.md`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).