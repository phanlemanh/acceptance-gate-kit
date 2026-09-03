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

  **Khung bổ sung (owner duyệt 30/08, rút từ first-principles phiên 29–30/08):**
  nguyên tử của mọi tái diễn là *một trí tưởng tượng viết cả VẬT lẫn THƯỚC lẫn
  LỜI* trên một *nền không tin được*. Vì thế:
  - **Dạng nghiệm đúng tầng** cho mọi lớp lỗi lặp: *biến bất biến từ đầu-người
    sang vật-máy-giữ* (marker một-nguồn writer/reader cùng rút · phép vi phân
    bản-tiêm-phải-khác-bản-gốc · dòng tự xưng của hạ tầng). Chỗ không biến được
    → khai giới hạn kèm MỘT ngưỡng đang đếm — cấm dặn-bằng-lời làm nghiệm.
  - **Neo ngoài của việc-kit:** giá trị chỉ chạm người dùng ở BẢN PHÁT HÀNH tới
    repo tiêu thụ. Meta-work (kit sửa thước của kit) không có neo ngoài nên đệ
    quy được — mặc định ĐÓNG BĂNG: phát hiện mới vào sổ/ô, vòng mới chỉ mở sau
    mốc phát hành gần nhất hoặc khi owner gọi tên.
  - **Ranh giới không phải cổng thì máy TỰ ĐI TIẾP** — bảng cổng trong SKILL là
    vét cạn; chờ lệnh ngoài bảng đó là máy tự chèn lượt gọi người (finding
    26/07, tái phạm 30/08).
  - **Lời mời cổng chỉ chứa ĐIỀU-CHỈ-NGƯỜI-BIẾT (owner quyết 01/09).** Owner
    tự quan sát: ở phạm vi/tiêu chí «tôi thường chỉ gật vì nó vượt nhận
    thức» — chữ ký kiểu đó là tin-suông khoác áo thẩm định. Máy phân loại
    từng mục theo NGUỒN CĂN CỨ trước khi mời: căn cứ là mục-tiêu+quy-tắc đã
    khai → máy đi tiếp, ghi sổ, cửa veto · chỉ một lối ra sống → trạm thu
    phí, máy đi tiếp báo một dòng · căn cứ vượt nhận thức người nhưng quyết
    hiệu quả kit (phạm vi đủ? thước đo thật?) → ĐỐI KHÁNG MÁY thay mắt người,
    người đọc PHÁN QUYẾT đối kháng kèm số + chiều đỏ, không đọc vật · chưa đủ
    định hướng để quyết được → CHƯA ĐƯỢC HỎI, máy phải dựng căn cứ + hệ quả
    từng lối trước · căn cứ chỉ người có (đánh-đổi giá trị, khẩu vị rủi ro,
    khó-đảo) → câu hỏi thật, khuôn 1-phút + 1-khuyến-nghị + 1-chạm. Phép thử
    từng mục: «người trả lời khác khuyến nghị thì dựa vào điều gì máy không
    có?» — không có → không phải câu hỏi cho người. Chữ ký từ đây xác nhận
    HAI thứ tách bạch: quy-trình-đối-kháng-đã-hội-tụ trên phần vượt-nhận-thức,
    và các đánh-đổi chỉ-người-biết. Hệ quả: cổng không còn mục
    chỉ-người-biết nào và không khó-đảo = làn V — làn V không phải ngoại lệ,
    nó là ca-rỗng của luật này. Lưới cho phân loại sai: mọi thứ máy tự quyết
    đều có sổ + đường đảo + hiện ở khối «CHƯA duyệt» của Cổng Bằng chứng, và
    khó-đảo LUÔN là câu hỏi cho người bất kể phân loại.
  - **Giới hạn CHIỀU RỘNG (owner quyết 30/08, «cắt đuôi giữ lõi»).** Kit từng
    chỉ có phanh chiều sâu (dừng-vá · trần 3 vòng · timebox) mà mọi phanh đều
    xả vào sổ hạng mục không trần → 5 vòng meta liên tiếp sau 2.4.0, 0 giá trị
    chạm người dùng. Luật:
    (a) **Bộ đo được máy kiểm MỘT tầng** — lưới thường trực là trần; KHÔNG mở
    vòng đo-thước-của-thước. Ngưỡng mở lại (đang đếm): ≥2 lượt chấm sai do
    phép-đo-tự-dối trên vòng SẢN PHẨM giữa hai release. Bằng chứng thực nghiệm
    của trần: ô khuon-rang-dung-chung park 30/08 — hai vòng S4 liên tiếp, bộ
    máy vi-phân mắc đúng lớp nó đi bắt (mã-đo không hội tụ về 0 phát hiện).
    (b) **Giữa hai release tối đa MỘT vòng meta**, chỉ khi owner gọi tên.
    (c) **Mỗi mốc phát hành đếm tay 3 dòng số** vào hồ sơ release: thời gian
    làm-xong→quyết-được mỗi vòng · số lần gọi người/vòng — TÁCH
    trong-thiết-kế / ngoài-thiết-kế, kèm số CHẠM mỗi lần · số vòng bị
    hạ-tầng-kit đốt lượt chấm. **ÁN CẮT KIT ĐÃ BỎ** (owner quyết 01/09 sau
    khi hai vòng dữ liệu định vị chỗ rò ở LỚP LỜI MỜI chứ không ở răng —
    docs/findings/2026-09-01-audit-loi-moi-cong-nang-hinh-thuc.md). Răng
    thay thế, để số đếm không hoá hình thức: **MỤC TIÊU ≤3 lượt gọi
    người/vòng** — 3 không phải KPI tuỳ hứng, nó = đúng số cổng người trong
    thiết kế (Đáng · Phạm vi · Bằng chứng); **vòng T3 có thêm Gate 1.5 theo
    thiết kế nên trần T3 = 4** (owner đọc luật ở dòng ký mốc 2.7.0, 03/09 —
    đọc theo nguyên tắc «= số cổng thiết kế», không phải nới); mốc phát hành
    ≤1 (làn V ở Cổng Phạm vi, tiền lệ 2.5.0); tức mục tiêu thật là **0 lượt
    ngoài thiết kế**.
    Và **≤1 chạm/lượt**: máy soạn sẵn trọn gói khuyến nghị + căn cứ đọc
    trong một phút, người chỉ phát ngôn quyết định — cái người gõ là Ý MUỐN
    (một chạm, một chữ), không phải cú pháp; máy chịu trách nhiệm dịch ý
    muốn thành trường hồ sơ. Mỗi mốc phát hành PHẢI gọi tên ít nhất MỘT chỗ
    cắt cho cửa sổ kế, hoặc tuyên bố đã-tối-ưu kèm số — số đếm không dẫn tới
    một nhát cắt có tên là đo-hình-thức, đúng bệnh luật này sinh ra để chặn.
    Hai chốt không mục tiêu số nào ghi đè: việc chạm KHÓ-ĐẢO luôn thắng
    (không được né gọi người vì KPI), và chữ quyết vẫn của người (ADR 0002).

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

- **Trình cho owner bằng hình + chữ theo
  [docs/reference/DIAGRAM-RULE.md](docs/reference/DIAGRAM-RULE.md)** (chốt
  16/08): hình là chiếu của nguồn chữ, không bao giờ là nguồn; ba tầng theo
  tuổi thọ (phác · hồ sơ `figures/` · bản in); bổ sung không thay thế. Phần
  engine cho consumer vẫn là N5 + `DECISION-DIAGRAM-SURFACES` trong bản luật
  ngôn ngữ mặt người — file kia không phải nguồn thứ hai.

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
  fixture phải **suy từ vị trí script**, không hardcode; **bản base** dựng cho
  ca so-sánh phải lấy **trọn thư mục** (`git archive <sha> scripts lib`), không
  chép **danh sách file tay** — vật được đo gọi thêm một script mới là bản base
  thiếu file, đỏ vì HẠ TẦNG chứ không vì vật (P150, 23/08). Nghi thức kiểm nhanh:
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

- **Re-pin theo RELEASE, không theo từng merge (charter 07/08 mục 1d).** Merge
  chạm engine gom về mốc release; re-pin chạy **một chiến dịch mỗi release**.
  Giữa hai release, hồ sơ cũ hoá stale là trạng thái CHẤP NHẬN ĐƯỢC — đừng đuổi
  theo. Lý do: chi phí re-pin nhân theo số vòng chạy song song (N vòng × mỗi
  merge = N−1 hồ sơ phải ghim lại), nên nhịp merge chính là trần của N. Vòng
  đang chạy bị chặn thật giữa hai release = vấp thật: ghi sổ, ghim lại RIÊNG
  làn đó. Chi tiết + hai đường rẻ (re-pin theo diff · một-làn-máy-nhiều-chữ-ký)
  ở [GUIDE §7.1](GUIDE.md).

- **Quyết định khó đảo / gây bất ngờ / có trade-off thật** → ghi ADR 1-đoạn-văn
  vào `docs/adr/` (đủ cả 3 điều kiện mới ghi, thiếu 1 thì bỏ). Đề xuất đã
  TỪ CHỐI mà có nguy cơ quay lại → 1 file trong `.out-of-scope/` kèm mục
  "Prior requests".
