# Template: Product Context (đặt trong repo sản phẩm, không nằm trong skill)

Copy khối dưới vào `CLAUDE.md` của repo sản phẩm (giữ nguyên heading `## Product Context`), hoặc lưu thành `docs/product-context.md`. Skill đọc từ đây; thiếu mục nào hỏi user mục đó — điền 1 lần, dùng cho mọi lần quét sau.

```markdown
## Product Context
- **Sản phẩm:** <tên + 1 câu>
- **Loại hình:** <marketplace N phía | SaaS B2B | app B2C | tool nội bộ | …>
- **Actor & phía:** <role theo từng phía: ai cung, ai cầu, ai vận hành>
- **Surfaces:** <web/app/API…; nhiều phía thì kèm map đối tượng→surface>
- **Kênh content:** <kênh đang vận hành thật>
- **Thị trường & pháp lý:** <nước/khu vực; khung dữ liệu cá nhân; compliance ngành>
- **Domain map nội bộ:** <các domain/capability chính>
- **Đối chiếu ngành:** <1-2 chuẩn/sản phẩm cùng loại CÓ TÊN — chân outside view cho mọi lần quét>
- **Nguồn CE sẵn có:** <bug tracker, analytics, spec, user journey map…>
```
