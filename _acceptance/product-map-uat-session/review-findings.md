## Trong hợp đồng

Không có finding nào map được vào AC ở round này — finding high/AC-1 (workspace-mồ-côi, chỉ có uat-session.md biến mất khỏi bộ quét) tìm thấy ở round 3 đã được sửa (decisions.jsonl d-20260803T094746Z-19579) và đo lại bằng case P110 với 2 hình dạng fixture mới; không phát hiện regression tương đương nào khác round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **PRODUCT-MAP.md thiếu miễn trừ t1_skip_globs — chính commit ký Cổng 2 tự làm evidence stale và chặn merge**
  Người dùng thấy gì: Khi ký duyệt bằng chứng (Cổng 2) cho một tính năng, bước tự động cập nhật bản đồ sản phẩm có thể khiến hệ thống báo bằng chứng đã cũ và chặn việc gộp mã — người ký có thể bị kẹt trong vòng lặp không thoát được, phải ký lại nhiều lần.
  file: `_acceptance/config.yaml`
  severity: high
  Đề xuất: new-contract

- **Hai reader vẫn cho hai kết luận trái nhau về evidence-report.md hỏng — đúng lớp lỗi lib/workspace-record.js sinh ra để diệt**
  Người dùng thấy gì: Thẻ /start và bản đồ sản phẩm có thể cho hai câu trả lời khác nhau về việc hồ sơ bằng chứng của một tính năng có bị hỏng hay không — một bên báo lỗi, bên kia vẫn coi là bình thường, khiến người xem thẻ dễ hiểu sai tình trạng thật.
  file: `scripts/start-scan.mjs`
  severity: high
  Đề xuất: known-limits

- **skills/uat-session/SKILL.md trỏ vào references/ không tồn tại trong gói**
  Người dùng thấy gì: Khi làm theo hướng dẫn của kỹ năng phiên nghiệm thu, bước đầu tiên trỏ tới một khuôn mẫu không có ở đúng chỗ đó — người thực hiện có thể tự bịa nội dung thay vì dùng đúng mẫu chuẩn, làm hồ sơ phiên nghiệm thu sai định dạng.
  file: `skills/uat-session/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **GUIDE.md còn mô tả hành vi skipped[] đã bị gỡ**
  Người dùng thấy gì: Tài liệu hướng dẫn chung vẫn mô tả một hành vi cũ đã bị gỡ bỏ, và chưa có phần nào giải thích về bản đồ sản phẩm hay bước duyệt giá trị mới — người đọc tài liệu để hiểu tính năng sẽ nhận thông tin lỗi thời hoặc thiếu.
  file: `GUIDE.md`
  severity: medium
  Đề xuất: known-limits

- **Hai reader vẫn trái nhau về "hồ sơ hỏng": check evidence-report.md nằm ngoài luật chung**
  Người dùng thấy gì: Thẻ /start và bản đồ sản phẩm có thể cho hai câu trả lời khác nhau về việc hồ sơ bằng chứng của một tính năng có bị hỏng hay không, khiến người xem thẻ dễ hiểu sai tình trạng thật của tính năng đó.
  file: `scripts/start-scan.mjs`
  severity: high
  Đề xuất: known-limits

- **Cơ hội `stage: archived` nằm mãi trong nhóm chờ chữ ký người**
  Người dùng thấy gì: Một cơ hội sản phẩm đã được xếp kho (không theo đuổi nữa) vẫn hiện trên thẻ /start ở nhóm "chờ chữ ký của anh" như thể còn chưa quyết định — không có cách nào gỡ nó khỏi danh sách chờ ký ngoài việc sửa ngược hồ sơ để nói sai tình trạng thật.
  file: `lib/workspace-record.js`
  severity: medium
  Đề xuất: known-limits

- **Phiên nghiệm thu đã dựng nhưng chưa ký biến mất khỏi nhóm chờ ký khi slug không thuộc đường A**
  Người dùng thấy gì: Nếu ai đó đã lên lịch một phiên nghiệm thu cho một tính năng ngoài luồng chính thông thường, phiên đó có thể biến mất khỏi danh sách chờ chữ ký trên thẻ /start mà không cảnh báo — trông như tính năng đã xong trong khi thực ra vẫn cần người quyết định.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).

## Phản hồi người tại Cổng 2 (2026-08-03)

- **Bước:** Cổng 2, sau khi owner đọc `PRODUCT-MAP.md` nguyên văn.
- **Nguyên văn:** "Product-map vẫn là ngôn ngữ của máy, không phải ngôn ngữ của
  người và thiếu visual trong khi đây là không gian của ngừoi và visual tốt nhất?"
- **Xử lý:** ghi nhận là **lỗ-kit — ngôn ngữ mặt người**, không phải lỗi người
  viết. Đối chiếu luật: N5 (hình trước, chữ là chú thích) bị vi phạm ở DẠNG
  THỨC — bản đồ là điểm quyết định vượt ngưỡng "3 bước nối tiếp hoặc 2 nhánh
  rẽ" mà không có hình; bảng tra DECISION-DIAGRAM-SURFACES chỉ đích danh
  "tài liệu trong kho → khối mermaid" và bộ sinh không dùng. Thêm N1/N2 ở dòng
  ghi chú đầu file (chủ ngữ là "máy", hai đường dẫn nằm trong câu chính) và N3
  ở mỗi dòng (slug — một mã tra cứu — làm chủ ngữ).
- **Hệ quả cho phán quyết:** AC-13 KHÔNG đạt ở phần bộ sinh TỰ VIẾT, không chỉ
  ở phần thừa hưởng `feature:` của hồ sơ cũ. Khuyến nghị "chấp nhận + override"
  ở lượt trình trước đã RÚT.
- **Lỗ của bộ đo:** panel judge E13 ba vòng đều chỉ soi trục từ vựng N1–N6 và
  không chạy phép thử nhìn-thấy-hình, dù phép thử đó nằm cùng file luật được
  truyền làm input. Câu hỏi của eval AC-13 cũng không nhắc trục hình.
