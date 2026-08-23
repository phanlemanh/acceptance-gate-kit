# Prototype — con mắt thứ hai cho Lái-thử Người-lạ

Mã **chưa qua cổng nào**. Đây là vật liệu cho Cổng Đáng của
`_acceptance/con-mat-thu-hai-lai-thu/`, không phải mã đang chạy của kit.

## Vì sao nó nằm ở đây

Nó được viết trong repo `floorplanstudio` (nhánh `feat/openrouter-vlm`, `ecb4547`)
nhưng docblock của chính nó khai *"dựng cho vòng «Người lạ lái thử»"* và *"không nằm
trên đường phục vụ request nào"* — tức công cụ cổng ngồi nhầm repo. Owner quyết
**kill ở floorplanstudio** ngày 2026-08-23; nhánh đó **đã xoá**, và vì nó chưa bao giờ
được push, thư mục này là **bản duy nhất còn lại**.

## Có gì

| file | |
|---|---|
| `openrouter.ts` | 372 dòng — cấu hình từ env, `createOpenRouterClient`, `askAboutImage`, 6 mã lỗi có tên |
| `openrouter.test.ts` | 311 dòng — 20 ca, xanh lúc chép |
| `server.ts.diff` | 32 dòng nối vào server của floorplanstudio. **Giữ dạng diff có chủ ý** — chép nguyên file sẽ kéo mã sản phẩm của repo khác vào kit |
| `.env.example` | bản mẫu env; hai biến đầu (`FLOORPLAN_HMAC_KEY`, `PORT`) là của floorplanstudio, không thuộc kit |

## Đã kiểm về an toàn (2026-08-22, trên repo cũ)

Khoá chỉ đi vào header `Authorization` · thông báo lỗi in **độ dài** chứ không in khoá
· phản hồi qua `zod` ở biên · timeout có abort · **không thêm dependency** (`fetch`
built-in). Ba cổng của repo cũ xanh: 639 test · lint · typecheck.

## Nếu Cổng Đáng quyết `build` — ba điều phải làm khác

1. **BỎ phần nối vào `server.ts`.** Service sản phẩm không nên bật/tắt một năng lực
   chấm. `server.ts.diff` giữ lại chỉ để đọc lịch sử.
2. **Quyết ranh giới tất-định.** Kit hiện thuần tất định — không script nào gọi mạng.
   Xem mục "Lập luận CHỐNG" điểm 2 trong `opportunity.md`.
3. **Quyết chỗ đứng trong kit.** `scripts/` là nơi cổng tất định sống; một bước gọi
   mạng đứng cạnh chúng sẽ làm người đọc kết quả hết phân biệt được dòng nào lặp lại
   được. Đây là câu hỏi thiết kế, chưa có câu trả lời.
