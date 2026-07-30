## Trong hợp đồng

(none — không finding nào trong scope-triage được map vào một AC cụ thể của contract này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Orphan 'câu hỏi lane' reference survives in design-subtrack SKILL — same class AC-10 round 2 was mandated to sweep**
  Người dùng thấy gì: Người phụ trách bước thiết kế mở tài liệu hướng dẫn của bước đó vẫn thấy nhắc tới một câu hỏi/bước đã bị xoá ở nơi khác trong hệ thống, có thể khiến họ đi tìm một bước không còn tồn tại.
  file: `design-loop/skills/design-subtrack/SKILL.md`
  severity: medium
  Đề xuất: Known limits — commit 7af73e3 quét sạch tham chiếu "câu hỏi lane" trong `feature-loop/skills/feature-loop/SKILL.md` (đúng phạm vi AC-10 mở rộng, đúng như P87 khẳng định) nhưng chưa quét sang `design-loop/skills/design-subtrack/SKILL.md:27`, nơi vẫn viết "CT2 KHÔNG bật ở đây — nó bật ở câu hỏi lane cuối S1 của feature-loop hoặc khi user chạy /design-mockup". Câu hỏi lane đó không còn tồn tại trong SKILL Claude feature-loop nữa (grep xác nhận đây là tham chiếu tiếng Việt còn sót lại duy nhất; bản Codex vẫn giữ câu hỏi lane riêng vì design-pass chưa wire sang Codex theo `d-20260730T050548Z-4723`, hợp lệ). Sửa tại file nguồn (design-loop/ không thuộc plugins/ mirror nên không cần sync lại), trỏ CT2 activation sang nghi thức S1-D / `/design-mockup` thay vì câu hỏi lane đã xoá — dọn ở lượt sửa tài liệu kế tiếp, không chặn release này.

- **P87 section slice unguarded: `find("## S2")` = -1 silently widens scope to whole file**
  Người dùng thấy gì: Nếu sau này ai đó đổi tên một mục trong tài liệu hướng dẫn, phép kiểm tự động cho Gate 1 có thể vẫn báo 'đạt' dù không còn kiểm đúng chỗ cần kiểm, khiến người duyệt tin nhầm nội dung đã đúng vị trí trong khi thực ra không được kiểm đúng phạm vi.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: Known limits — dòng `g1ctx = text[g1:text.find("## S2", g1)]` (khoảng dòng 1937) không assert đã tìm thấy mốc kết thúc; nếu heading "## S2" bị đổi tên/xoá trong `feature-loop/skills/feature-loop/SKILL.md`, `find` trả -1 và lát cắt mở rộng gần hết phần còn lại của file, khiến assertion phạm vi GATE 1 ("BẢN BẤM ĐƯỢC", "ui_standards_skill") có thể khớp nhầm nội dung ở section S1/S1-D — biến một phép ghim theo section thành ghim toàn file (cùng lớp lỗi kit từng sửa ở v1.20.1). Chưa fail hôm nay vì heading còn nguyên. Sửa: `s2 = text.find("## S2", g1); assert s2 > g1`, rồi mới cắt bằng `s2` — dọn ở lượt sửa harness kế tiếp, không chặn release này.

- **Consumer-specific example 'create-onehub-plugin' embedded in engine sources**
  Người dùng thấy gì: Tài liệu hướng dẫn dùng tên một sản phẩm nội bộ cụ thể làm ví dụ minh hoạ, có thể khiến một công ty khác dùng chung công cụ này hiểu nhầm rằng cấu hình đó chỉ áp dụng riêng cho sản phẩm được nêu tên.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: Known limits — bước `ui_standards_skill` mới dùng giá trị ví dụ `create-onehub-plugin` (cũng ở GUIDE.md:547 và mirror plugins/acceptance-gate/GUIDE.md); OneHub là sản phẩm của tổ chức tiêu thụ, trái bất biến "kit là engine" trong CLAUDE.md (thứ vô nghĩa với công ty khác dùng kit thì không thuộc kit). Một placeholder trung lập kiểu `create-<org>-plugin` truyền tải cùng hình dạng ví dụ. Không phải lỗi runtime — là một rò rỉ bất biến do diff này đưa vào; bản Codex đã đúng khi không có ví dụ này. Dọn ở lượt sửa tài liệu kế tiếp, không chặn release này.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).