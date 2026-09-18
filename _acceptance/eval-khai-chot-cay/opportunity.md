---
schema_version: 1
slug: eval-khai-chot-cay
feature: Eval gọi máy chủ qua mạng có thể đo NHẦM CÂY mà vẫn xanh — kit chưa có lưới nào nhìn thấy; đề xuất một lời khai cấp eval (tree_pin) kèm cờ vàng và dòng đếm trên thẻ
owner: manh@mstar.vn
stage: decided              # discovery | decided | archived
decision: park              # build | iterate | park | kill — người ký Cổng Đáng điền
decided_by: Mạnh
decided_at: 2026-09-18T14:30:52Z
prototype:
  base_commit:
  disposition: archive      # keep | archive
---

## Vấn đề & ai gặp

Một eval gọi HTTP tới máy chủ dev có thể đo nhầm cây: máy chủ đang trả lời ở cổng mặc
định thuộc một checkout khác, và phép đo vẫn in số hợp lý với mã thoát 0. Đó không phải
hạ tầng hỏng — nó là câu trả lời SAI trông như câu trả lời ĐÚNG, và không lưới nào của
kit nhìn thấy. Người gặp: người ký cổng ở kho có máy chủ dev + nhiều worktree.

## Số đo lúc quyết (18/09/2026, 10 kho, giải `config:` ref trước khi soi)

- 97 / 3 737 eval máy gọi máy chủ (2,6 %) · **95 nằm trong `crm`**, 2 ở artifact-platform
- 14 hồ sơ dính, 11 đã ký · kho kit: **0** — kit không tự ăn được món này
- Bộ dò HẸP (biến URL gán vào lệnh, hoặc origin loopback nguyên văn): 0 báo nhầm;
  bộ dò rộng: 4 báo nhầm có tên, đều dính chữ `fetch`
- Verdict sai vì đo nhầm cây đã LỌT qua cổng mà kit biết: **0**

## Vì sao PARK (owner quyết 18/09 sau khi rà theo north star)

1. **Nghiệm sai tầng.** Lời khai không kiểm giá trị vẫn là LỜI — chỉ đổi từ văn xuôi
   sang YAML — và bên viết nó chính là máy viết eval: đúng nguyên tử «một trí tưởng
   tượng viết cả vật lẫn thước lẫn lời». Thứ thật sự chặn đo nhầm cây là một cái RĂNG
   trong chính eval (kiểu `canh-cay.mjs`, thoát mã 2), và răng đó sống ở kho tiêu thụ.
2. **Dòng đếm ở Cổng Bằng chứng dễ thành trạm thu phí** — người ký không thẩm định
   được một cơ chế chốt cây; câu trả lời hợp lý duy nhất là gật.
3. **Chi phí so với người hưởng.** Vòng T3, 13 tiêu chí, một trường schema vĩnh viễn —
   cho MỘT kho đã tự vá và 0 ca lọt. ADR 0018 đòi CỘNG giữ đơn giản.

Không kill: lớp lỗi là thật và tổng quát (kho nào có máy chủ dev + worktree cũng gặp).

## Ngưỡng mở lại (đang đếm — một trong hai)

- có **kho THỨ HAI** mang eval gọi máy chủ ở quy mô đáng kể (hôm nay: chỉ `crm`), hoặc
- **≥1 verdict sai** vì đo nhầm cây LỌT qua cổng ở bất kỳ kho nào.

Hôm nay: 0 / 0.

## Việc đáng làm ngay KHÔNG nằm ở kit

Ở `crm`: merge PR nháp `phanlemanh/crm-onehub#36` (`canh-cay.mjs`) và gộp hai bản
`may-chu.mjs` đã trôi khỏi nhau thành một. Đó là chỗ đặt răng thật.

## Lấy lại — vật đã có, không phải làm lại

- Thiết kế đầy đủ + số đo + chân ngành + quét hình thái:
  `docs/superpowers/specs/2026-09-18-eval-khai-chot-cay-design.md`
- Bộ tạo phẩm S1 đã qua phản biện context sạch (3 P0 + 2 P1, đã sửa hết), nền hạ tầng
  xanh, thẻ + hai hình: `discovery/` (contract · evals · sổ quyết định · gap-probe ·
  card · figures). Mở lại = chuyển chúng về gốc hồ sơ rồi vào thẳng Cổng Phạm vi.
- Nếu mở lại, cân **lát mỏng** trước lối A đầy đủ: chỉ cờ W9 ở Cổng Phạm vi + lời khai
  để tắt nó (món cho MÁY ở S1), BỎ dòng đếm ở thẻ, giữ sàn không-làm-đỏ-hồ-sơ-cũ.

## Prior requests

- 18/09/2026 — owner gọi tên từ phiên `crm` (chip «chốt cây»), sau khi soi nhánh
  `fix/canh-cay-truoc-khi-do`. Đi trọn S1 rồi park ở Cổng Phạm vi.
