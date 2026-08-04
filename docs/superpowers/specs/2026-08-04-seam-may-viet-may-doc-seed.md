# Hạt giống: một khuôn cho seam máy-viết → máy-đọc

Ngày 2026-08-04 · nguồn: 8 vòng S4 của [`judgment-runs`](../../../_acceptance/judgment-runs/contract.md)
· trạng thái: **chưa chạy loop**, đây là input cho `/feature-loop`

> Đọc file này là đủ để bắt đầu. Không cần đọc lại phiên đã sinh ra nó.

## Vấn đề, phát biểu một câu

Kit có nhiều chỗ **máy biết một sự thật, ghi nó ra, rồi một bên khác đọc lại để trình cho
người** — và mỗi chỗ như vậy hiện tự chế khuôn riêng, tự chọn cách khớp riêng, tự quyết
lấy-dòng-nào. Không có khuôn chung, không kiểm kiểu ở biên, không bộ đọc dùng chung. Kết
quả: cùng một lớp lỗi tái sinh dưới hình dạng mới ở mỗi lần chạm vào.

## Bằng chứng: tám hình dạng của CÙNG một lỗi, đo được trong một feature

`judgment-runs` chỉ thêm **một** tín hiệu mới (cảnh báo "field khai mà máy không dùng") đi
từ `acceptance-verify.js` tới thẻ Cổng 2. Trong 8 vòng verify, seam đó gãy **tám lần, tám
kiểu khác nhau** — mỗi lần đều được vá và mỗi lần bản vá lại lộ kiểu tiếp theo:

| # | Gãy vì | Vòng phát hiện |
|---|---|---|
| 1 | thứ tự câu trong mục | 1 |
| 2 | trang trí markdown (`- `, `**`) | 2 |
| 3 | placeholder `{{…}}` còn sót ở dòng đầu | 2 |
| 4 | cùng một câu ra **hai** cờ, một cái sai nhãn | 3 |
| 5 | câu bị **ngắt dòng** (markdown wrap) | 4 |
| 6 | dòng sổ chạy **thiếu trường** `note` | 4 |
| 7 | không lọc theo vòng → cảnh báo **không tắt được** | 4, 6 |
| 8 | `round` **sai kiểu** ở bên viết, bên đọc lọc chặt | 5 |

Cộng: **bên đọc thứ hai** (`scripts/evidence-page.js`) chưa hề được quét trong suốt 8 vòng,
và **ba nhánh thoát sớm** của bên viết mỗi cái phải vá riêng.

Mẫu hình: vá kiểu thứ N luôn đẻ ra kiểu N+1, vì mọi bản vá đều là **nới phép khớp** chứ
không phải **đổi bất biến**.

## Đã học được — đưa thẳng vào thiết kế, đừng học lại

1. **Đo quan hệ, không đo từ vựng.** Thước hỏi "máy có báo không" sẽ ghim luôn niềm tin sai
   vào đặc tả. Thước đúng hỏi "máy có **thật sự** bỏ qua không": chạy hai lần (có/không có
   thứ đó) rồi **so sâu toàn bộ đầu ra**. Chính thước này bắt được `paths`×judgment không hề
   inert — điều mà quét hình thái, phản biện context sạch, và đặc tả viết-trước đều bỏ lọt,
   vì cả ba cùng đo một thứ.
2. **Fixture phải do chính bên viết sinh ra trong lần chạy đó.** Ba vòng đầu trượt cùng một
   cách vì fixture dùng chuỗi viết tay `"none — every multi-run eval is uniform"` — câu mà
   chính lời nhắc gửi bên viết **cấm sinh ra**. 221 case xanh trong khi hình dạng thật đỏ.
3. **`mutation-check` phải có một đột biến ở phía VIẾT với case đỏ ở phía ĐỌC.** Đó là bằng
   chứng sống rằng hai đầu thật sự nối nhau, không phải hai bài kiểm rời.
4. **Đột biến phải đổi HÀNH VI, không phá cú pháp.** Hai lần tôi viết đột biến làm hỏng
   parse — chúng kiểm "file còn đọc được không", không kiểm mối nối.
5. **"Sạch" phải là tín hiệu tường minh, không suy từ sự vắng mặt.** Sổ chạy append-only +
   chạy lại cùng vòng ⇒ vắng mặt không phân biệt được "sạch" với "chưa ghi".
6. **Sửa theo LỚP.** Vá phía đọc rồi tuyên bố bên viết đã đúng — mà không quét hết các
   nhánh thoát sớm — là cách lỗi số 2 và số 8 ra đời.

## Đề xuất hướng (Cổng 1 quyết, không phải chốt sẵn)

- **Một khuôn, một chỗ, có marker.** Định nghĩa hình dạng bản ghi máy-viết (khoá bắt buộc,
  kiểu, ngữ nghĩa "sạch") ở đúng một nơi có cặp marker, như `OOC-ITEM-TEMPLATE` và
  `INERT-FIELD-TABLE` đã làm.
- **Kiểm kiểu ở biên bên viết.** Mọi trường mà bên đọc lọc chặt (`round`, `kind`, …) phải
  được ép/kiểm ở chỗ ghi. Tiền lệ có sẵn trong cùng file:
  `typeof c.fromRound === 'number' ? c.fromRound : null`.
- **Một bộ đọc dùng chung** cho `gate-card.js` và `evidence-page.js` — hiện hai bên đọc
  cùng một artifact bằng hai bộ luật khác nhau, và bên thứ hai luôn bị bỏ quên.
- **Round-trip phủ toàn bộ hình dạng đã biết** — tám dòng bảng trên là bộ ca tối thiểu,
  viết trước, độc lập với mã.

## Phạm vi cần bàn ở Cổng 1

Quét trước xem kit còn bao nhiêu seam cùng hình dạng (`run-log.jsonl` ↔ thẻ/trang bằng
chứng; `gap-probe.md` ↔ thẻ; `decisions.jsonl` ↔ thẻ; `evidence-report.md` ↔
`recheck-evidence.js`). Nếu nhiều, đây là feature **T3 chạm lõi cưỡng chế** và nên làm theo
đợt, không làm một lượt.

## Việc chưa làm, thuộc feature này hay feature khác — Cổng 1 phân

Tám known-limits còn mở của `judgment-runs` (xem `## Notes` của hợp đồng đó). Bảy trong tám
là **cùng lớp** nên nhiều khả năng tan theo khi seam có khuôn chung; riêng mục 3 (lớp `runs`
sai kiểu/ngoài dải trên `test`/`script`) là một lớp khác, có thể tách riêng.
