# Kit maintainer invariants

- **⭐ NORTH STAR (owner tuyên 09/08, phát biểu lại 12/08):** Kit tồn tại vì một
  điều duy nhất — **sản phẩm đến tay người dùng nhanh hơn mà vẫn tin được.** Nó
  làm điều đó bằng cách chia lại đúng việc: **máy làm và tự chứng minh** (bằng
  chứng không tự dối — màu xanh phải từng chạy chiều đỏ), **người chỉ ra quyết
  định** tại ít khoảnh khắc thật, trên bằng chứng đọc được trong một phút, với
  đường đảo rẻ cho mọi thứ còn lại. Người đứng ở **biên** của vòng, không đứng
  giữa.

  **Thước đo của kit:** thời gian từ *làm-xong* đến *quyết-được*, và số lần
  phải gọi người trên mỗi kết quả ship. **Giờ-kit là chi phí.** Cổng mà câu trả
  lời hợp lý duy nhất là «ừ» là **trạm thu phí, không phải điểm quyết định**.

  Bản neo: [docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md](docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md)
  · nền: [2026-08-09](docs/findings/2026-08-09-ban-chat-that-vong-lap-kit.md)
  · [2026-08-10](docs/findings/2026-08-10-ra-soat-luat-theo-north-star.md).

- **Ba nguyên tố (hiến pháp trace).** Mọi bộ phận hiện có và mọi đề xuất mới
  phải trace về **một** trong ba, và nêu được **người hưởng cụ thể**:
  1. **Ý định chốt trước khi làm.** Chỉ owner biết "tốt" nghĩa là gì; chốt
     sau khi làm xong thì mọi kết quả tự biện minh được.
  2. **Bằng chứng không tự dối.** Món này cho **MÁY**: "máy tin nhầm chính
     nó" là lớp lỗi có tỉ lệ đo được cao nhất; nhờ nó máy mới được chạy nhanh
     mà người khỏi kiểm lại.
  3. **Khoảnh khắc quyết thật.** Người xuất hiện đúng nơi có **đánh-đổi** hoặc
     **khó-đảo**; cổng phải có ≥2 lối ra sống. **Đảo-rẻ là mặt sau của nguyên
     tố này**: máy giữ đường đảo thì máy được đi trước; hành động không có
     đường đảo tự động rơi về khoảnh khắc quyết thật.

  **Không trace được = hình thức = cắt. Chỉ TRỪ, không CỘNG.**

- **MỘT cây nguồn, KHÔNG có bản sao nào phải giữ đồng bộ (từ 2026-08-12).**
  Kit từng nuôi hai bản dựng song sinh: mọi thay đổi lõi phải sửa hai lần rồi
  dựng lại một bản sao phẳng và commit nó cùng lượt. Bản song sinh và bản sao
  đó **đã lưu kho**, nên luật «sửa hai lần» hết hiệu lực — sửa ở
  `skills/`, `feature-loop/`, `commands/`, `scripts/`, `lib/`, `hooks/`,
  `vendor/` là xong, không còn bước dựng lại nào. Đường lấy về: **ADR 0008** và **ADR 0009** trong `docs/adr/`.

- **[CONTEXT.md](CONTEXT.md) là glossary phát triển của kit** (authoring-time).
  Khi viết/sửa SKILL.md, docs, message của script: dùng đúng term chuẩn và
  tránh mọi từ nằm trong `_Avoid_`. Term mới chỉ thêm khi kit thật sự cần nó.

- **6 thao tác cổng người** (`approve`, `signoff`, `acceptance-init`,
  `acceptance-status`, `acceptance-report`, `start`) bị khoá model-invocation;
  `acceptance-card` cố tình để mở (feature-loop và approve/signoff
  model-invoke nó). Đừng "sửa" sự bất đối xứng này — test P32 giữ nó,
  lý do ở [docs/adr/0002](docs/adr/0002-human-gate-invocation-lock.md).

- **Assertion âm-tính-một-mình là assertion không sống.** Mọi case dựng bản
  sao/fixture rồi kết luận từ "exit khác 0" PHẢI có (a) **đối chứng dương** —
  bản nguyên vẹn phải XANH trước khi tin bản bị tiêm là ĐỎ — và (b) ghim **đúng
  thông điệp** mong đợi, không chỉ mã thoát. Không có hai thứ đó thì case không
  phân biệt được "bắt đúng lỗi" với "chưa bao giờ chạy": fixture hỏng, `cp`
  lỗi, script không tồn tại (exit 127), bước tiêm thất bại — tất cả đều cho
  cùng một màu xanh. Trong hai feature 2026-07-26 nó xuất hiện **ít nhất 9 lượt**
  (`TE2a`, `P43`, `P40`, `P42`, `P45`, `TE18d/f/g`, `P46`, `TE5`), lần nào cũng
  là sửa một chỗ rồi viết lại đúng nó vài dòng bên dưới — nên sửa phải theo
  LỚP: quét cả file tìm mọi case cùng hình dạng, đừng chỉ vá case bị nêu tên.
  (Đừng ghim con số này thành danh sách đóng — nó sẽ lại lỗi thời; ý là *lớp*,
  không phải *danh sách*.)

- **Thước phải gắn vào vật được giao** — dạng tổng quát của bất biến trên,
  học bằng 4 round S4 liên tiếp của s4-scope-triage (2026-07-27→28): cùng một
  lớp lỗi đổi da 4 lần mà mọi eval vẫn xanh. Bốn hình dạng đã dẫm: (1) đo *chỉ
  dẫn* thay vì *đầu ra* (grep file hướng dẫn trong khi renderer không đọc key);
  (2) fixture cho judge là văn *viết tay* không code path nào sinh ra; (3) bên
  VIẾT và bên ĐỌC của một artifact trôi khỏi nhau vì mọi test tự dựng fixture
  đúng khuôn bên đọc; (4) phép-đo-thêm-để-chữa-lớp-này hardcode ROOT nên so với
  checkout của tác giả thay vì cây đang kiểm. Luật rút ra: fixture phải do
  **code sinh** trong chính lần chạy; khuôn của seam LLM-viết→máy-đọc phải đặt
  **một chỗ có marker** rồi test **round-trip** rút-từ-writer-đọc-bằng-reader
  (mẫu: `OOC-ITEM-TEMPLATE` + case P55); mọi đường dẫn trong test/script sinh
  fixture phải **suy từ vị trí script**, không hardcode. Nghi thức kiểm nhanh:
  hỏi "nếu tôi phá vật thật trong một bản sao, phép đo này có đỏ không?" — rồi
  phá thử một lần cho mỗi phép đo mới.

- **Kit là engine — KHÔNG chứa**: product context của repo tiêu thụ, quy định
  đội (sống ở team handbook riêng), nội dung workspace `_acceptance/` của sản
  phẩm, thân skill bên thứ ba chưa vendor có tên + version gốc. Phép thử khi
  phân vân: thứ gì phải *chép* sang repo sản phẩm thứ hai, hoặc vô nghĩa với
  một công ty khác dùng kit, thì không thuộc kit. (Quyết 2026-07-27, plan
  discovery-gate0-rollout G1.)

- **Đổi schema artifact phải có đường đọc-cũ**: nhánh đọc bản cũ + cờ vàng
  trên card, KHÔNG bắt consumer migrate hàng loạt (pattern đã dùng: contract
  thiếu Coverage → cờ vàng 1.13.0; workspace thiếu gap-probe → cờ vàng
  1.14.0). Consumer nhận engine mới theo release có chủ đích — không đổi
  engine dưới chân một feature đang giữa vòng lặp.

- **Quyết định khó đảo / gây bất ngờ / có trade-off thật** → ghi ADR 1-đoạn-văn
  vào `docs/adr/` (đủ cả 3 điều kiện mới ghi, thiếu 1 thì bỏ). Đề xuất đã
  TỪ CHỐI mà có nguy cơ quay lại → 1 file trong `.out-of-scope/` kèm mục
  "Prior requests".
