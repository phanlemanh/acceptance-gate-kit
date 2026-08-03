# Phiên nghiệm thu — khuôn hồ sơ (Cổng Giá trị ký trên file này)

> Vị trí khi dùng: `_acceptance/<slug>/uat-session.md` của repo sản phẩm.
> Frontmatter là phần MÁY ĐỌC (`/start` và bản đồ sản phẩm đọc) — giữ nguyên
> tên khoá, chỉ thay giá trị. Xoá các dòng hướng dẫn `>` khi dùng thật.

<!-- <<<UAT-FRONTMATTER-TEMPLATE -->
```yaml
---
schema_version: 1
slug: {slug}
feature: {feature}
owner: {owner}
stage: {stage}              # scheduled | held
verdict: {verdict}          # release | iterate | kill — người ký Cổng Giá trị
                            # điền; để TRỐNG cho tới lúc ký
decided_by: {decided_by}
decided_at: {decided_at}    # ISO UTC
time_human_minutes:
  gateUAT: {gateUAT_minutes}
---
```
<!-- UAT-FRONTMATTER-TEMPLATE>>> -->

## Ngưỡng đã khai tại Cổng Đáng (CHÉP NGUYÊN VĂN — cấm sửa sau khi thấy số)

> Chép từ section "Ngưỡng chết / ngưỡng UAT" của `opportunity.md`. Từ giây phút
> phiên bắt đầu, ngưỡng là hằng số. Muốn đổi phép đo thật sự: ghi
> `[SUPERSEDED <ngày> — <phép đo mới>]` bên `opportunity.md`, GIỮ bản gốc, và
> phiên dừng lại chờ Cổng Đáng — không sửa ngưỡng ở đây.

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …

## Người dự

> Người dùng đại diện thật ưu tiên hơn người trong đội — đội đã biết trước câu
> trả lời mong muốn.

| Tên | Vai | Đại diện cho ai |
|---|---|---|

## Chấm kín (thu TRƯỚC mọi thảo luận chung)

> Thứ tự trong file này là vết: khối này điền xong mới được viết khối thảo
> luận. Ai cũng chấm một mình, không nghe điểm người khác trước.

| Người | Điểm/nhận xét kín | Sẽ gửi cho khách nào, khi nào |
|---|---|---|

## Thảo luận sau khi đã chấm

## Số đo thật đặt cạnh ngưỡng

> Số từ tracking thật, không từ cảm giác trong phòng. Thước chưa đo được thì
> ghi CHƯA ĐO — không đo mà im lặng là gian.

| Thước | Ngưỡng đã khai | Số đo được | SỐNG/CHẾT |
|---|---|---|---|

## Quyết định Cổng Giá trị

> `release` = giao rộng · `iterate` = giữ giả định, sửa rồi đo lại · `kill` =
> dừng. **Giết ở đây là THÀNH CÔNG của quy trình** — câu trả lời mua bằng giá
> một vòng dựng, không phải thất bại của người làm.

- **verdict = …** Căn cứ: …
- Bước kế: …
