# Prototype — con mắt thứ hai cho Lái-thử Người-lạ

Mã **chưa qua cổng nào**. Đây là vật liệu cho Cổng Đáng của
`_acceptance/con-mat-thu-hai-lai-thu/`, không phải mã đang chạy của kit.

## ĐỌC TRƯỚC — kit đã có bản tham chiếu 100 dòng

`skills/acceptance/references/vlm-assert.reference.mjs` làm **cùng việc** trong 100 dòng:
VLM khác họ, câu ĐÓNG có/không, `exit 2 = cannot-run` nên không bao giờ xanh giả. Kit cố ý
**không** ship phụ thuộc API — repo sản phẩm **nhận nuôi** bản đó kèm khoá của mình.

Nên prototype 765 dòng dưới đây là **vật đối chiếu**, KHÔNG phải nền để bắt đầu. Nếu quyết
nhận nuôi, gần như chắc chắn nên bắt đầu từ bản 100 dòng của kit và chỉ mượn ở đây những gì
thật sự thiếu.

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

## Nếu Cổng Đáng quyết `build` — bốn điều phải làm khác

1. **BỎ phần nối vào `server.ts`.** Service sản phẩm không nên bật/tắt một năng lực
   chấm. `server.ts.diff` giữ lại chỉ để đọc lịch sử.
2. **Quyết ranh giới tất-định.** Kit hiện thuần tất định — không script nào gọi mạng.
   Xem mục "Lập luận CHỐNG" điểm 2 trong `opportunity.md`.
3. **Bắt đầu từ bản 100 dòng, không từ 765 dòng này.** Xem mục đầu file.
4. **Trả lời câu: kit có cần đổi gì không?** Khuôn nhận-nuôi đã có sẵn. Nếu repo sản phẩm
   tự nhận nuôi một bản đọc payload tool là đủ, thì việc của kit chỉ là một dòng tài liệu —
   và cơ hội đóng bằng `kill`, đó là kết cục TỐT.
