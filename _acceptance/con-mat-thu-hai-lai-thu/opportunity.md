---
schema_version: 1
slug: con-mat-thu-hai-lai-thu
feature: Con mắt thứ hai cho Lái-thử Người-lạ — trả lời câu HỎI-SỰ-THẬT cần nhìn ảnh, để danh sách chuyển-phiên-người chỉ còn câu đáng-giá
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:      # KHÔNG có: nhánh nguồn đã xoá — mã sống ở ./prototype/
  disposition: keep # mã mang theo trong hồ sơ, chưa qua cổng nào
---

## Vấn đề & ai gặp

Luật lái-thử cấm người-lạ đọc mã và đọc file (`docs/lai-thu-nguoi-la.md`: *"chỉ
`tools/list` + phản hồi tool, cấm đọc mã"*). Luật đó ĐÚNG — nó là thứ giữ cho phiên
lái-thử đo được **bề mặt**, không đo được **ý định của người viết**.

Nhưng nó có một cái giá đo được. Ván lái-thử của `digitize-capability`
(floorplanstudio) ra **bảy** câu "Chuyển phiên người", và **ít nhất ba** trong số đó
KHÔNG phải câu đáng-giá — chúng là câu **hỏi-sự-thật cần nhìn ảnh gốc**:

- *"cả hai căn đều không có phòng bếp — do bản vẽ, do bộ nhãn thiếu loại phòng, hay
  máy đọc sót?"*
- *"`labelConfidence: 0` mà câu tóm tắt vẫn gọi tên phòng"*
- *"72,8 hay 106,7 là con số khách cần nghe"*

Người-lạ tự khai: *"không xác nhận được nội dung 4 file, vì kiểm nội dung thì phải mở
file, mà luật cấm."*

**Người trả giá là owner ở Cổng Giá trị**: anh nhận một danh sách trộn hai loại câu —
câu chỉ-người-trả-lời-được, và câu ai-mở-ảnh-ra-cũng-trả-lời-được. Loại thứ hai ăn
thời gian của khoảnh khắc quyết thật.

## Trace về ba nguyên tố

**Nguyên tố 2 — Bằng chứng không tự dối.** Đây là trace chính. Câu hỏi-sự-thật hiện
được trả lời bằng cách KHÔNG trả lời (người-lạ khai "không xác nhận được"), rồi đẩy
sang người. Một con mắt NGOÀI engine trả lời được nó mà không phá luật cấm-đọc-mã:
nó nhìn **ảnh**, không nhìn **mã**. Người hưởng cụ thể: máy — nó thôi phải im ở đúng
chỗ nó có thể nói.

**Thước đo của kit:** *"số lần phải gọi người trên mỗi kết quả ship"*. Ván nói trên:
7 câu chuyển phiên, ≥3 câu là hỏi-sự-thật. Nếu con mắt thứ hai trả lời được chúng thì
danh sách còn ≤4 — giảm ~43% trên một ván đo được.

## Lập luận CHỐNG — mạnh, phải trả lời trước khi build

1. **"Chỉ TRỪ, không CỘNG."** Hiến pháp kit nói thẳng. Đây là một CỘNG rõ ràng: một
   client mạng, một khoá API, một model bên thứ ba.
2. **Kit đang THUẦN TẤT ĐỊNH.** Grep toàn bộ `scripts/` của kit: chưa script nào gọi
   mạng. Mọi cổng chạy offline, lặp lại được. Một bước gọi VLM thì không — phụ thuộc
   mạng, khoá, và model đổi câu trả lời giữa hai lượt. Trộn vào cùng chỗ với cổng
   tất định là làm người đọc kết quả hết phân biệt được dòng nào lặp lại được.
3. **Ranh giới "máy không phán đáng-giá" rất dễ trôi.** Luật hiện tại: *"Máy tường
   thuật, không phán đáng-giá"*, và `docs/lai-thu-nguoi-la.md` cấm đích danh việc
   dùng lái-thử *"thay cho `uat-session` / để phán đáng-giá"*. Một con mắt biết trả
   lời sẽ bị hỏi những câu nó không nên trả lời — trượt dốc có thật, không phải lo xa.
4. **Prototype đang đặt SAI CHỖ.** 765 dòng hiện nằm ở `service/src/` của
   floorplanstudio, nối vào `server.ts` của sản phẩm. Docblock của chính nó khai
   *"dựng cho vòng Người lạ lái thử"* và *"không nằm trên đường phục vụ request nào"*
   — tức mã tự khai nó là công cụ cổng đang ngồi nhầm repo.

## Ngưỡng chết / ngưỡng UAT

- **Câu hỏi phép đo trả lời:** trên ván lái-thử tiếp theo có ảnh, con mắt thứ hai có
  làm danh sách "Chuyển phiên người" **ngắn lại mà không thêm câu sai** không?
- **SỐNG:** ≥50% câu hỏi-sự-thật được trả lời đúng (đối chiếu với người mở ảnh kiểm),
  0 câu đáng-giá bị máy tự phán, và mỗi câu máy trả lời mang **dấu không-tất-định**
  đọc được — người ký phân biệt được ngay dòng nào lặp lại được, dòng nào không.
- **CHẾT:** máy trả lời sai một câu hỏi-sự-thật mà không ai phát hiện được từ hồ sơ;
  hoặc bất kỳ câu đáng-giá nào bị máy điền verdict.
- **Timebox:** chưa đặt — owner quyết ở Cổng Đáng.

## Prototype mang theo

**Mã nằm ở [`./prototype/`](./prototype/)** — 765 dòng, chưa qua cổng nào.
Nhánh nguồn `feat/openrouter-vlm` của floorplanstudio **đã xoá** (owner quyết *kill ở
floorplanstudio*, 2026-08-23); nó chưa bao giờ được push, nên thư mục đó là **bản duy
nhất còn lại**. Chép sang TRƯỚC khi xoá, có chủ ý — hồ sơ này trỏ vào nó, và một hồ sơ
trỏ vào commit đã biến mất là hồ sơ hỏng.
`openrouter.ts` (372 dòng — client + cấu hình + 6 mã lỗi có tên), `openrouter.test.ts`
(311 dòng, 20 ca), `server.ts.diff` (32 dòng nối vào — giữ dạng diff có chủ ý, chép
nguyên file sẽ kéo mã sản phẩm của repo khác vào kit), `.env.example`.

Mã **sạch về an toàn** (đã kiểm 2026-08-22): khoá chỉ vào header `Authorization`,
thông báo lỗi in ĐỘ DÀI không in khoá, phản hồi qua zod ở biên, timeout có abort,
không thêm dependency nào (`fetch` built-in). Ba cổng xanh: 639 test · lint · typecheck.

**Chưa ai gọi nó** ngoài một dòng bật/tắt ở `server.ts` — tức hạ tầng đã dựng, chưa
nối vào đường nào. Nếu Cổng Đáng quyết `build`, phần nối vào `server.ts` phải BỎ:
service sản phẩm không nên bật/tắt một năng lực chấm.
