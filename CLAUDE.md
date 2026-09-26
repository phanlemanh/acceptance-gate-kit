# Kit maintainer invariants

- **⭐ NORTH STAR (owner tuyên 09/08, phát biểu lại 12/08):** Kit tồn tại vì một
  điều duy nhất — **sản phẩm đến tay người dùng nhanh hơn mà vẫn tin được.** Nó
  làm điều đó bằng cách chia lại đúng việc: **máy làm và tự chứng minh** (bằng
  chứng không tự dối — màu xanh phải từng chạy chiều đỏ), **người chỉ ra quyết
  định** tại ít khoảnh khắc thật, trên bằng chứng đọc được trong một phút, với
  đường đảo rẻ cho mọi thứ còn lại. Người đứng ở **biên** của vòng, không đứng
  giữa.

  **Thước đo của kit:** thời gian từ *làm-xong* đến *quyết-được*, số lần
  phải gọi người trên mỗi kết quả ship, **và chi phí máy (token · phút) trên
  mỗi kết quả ship** (owner thêm 14/09 — đo được 83 % token S4 đi vào khối
  tìm-lỗi mà 3/4 kết quả của nó không chạm phán quyết). **Giờ-kit là chi phí
  — giờ người VÀ giờ máy; dòng người đứng trước dòng máy: token giảm mà lượt
  gọi người tăng là thất bại.** Cổng mà câu trả lời hợp lý duy nhất là «ừ»
  là **trạm thu phí, không phải điểm quyết định**.

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
  - **Ô chỉ mở khi có NEO NGOÀI (owner quyết 18/09).** Hàng chờ Cổng Đáng — ô
    `stage: discovery`, hoặc `decided`+`build` chưa có hợp đồng — phải mang dòng
    `Gốc:`, một CON TRỎ vào tầng dưới mà người đọc lần được trong mười giây.
    «Suy từ đọc mã» KHÔNG phải neo; neo trỏ chính ô của nó cũng không (ô tự biện
    minh). Ý chưa có neo sống ở hạt giống `docs/plans/*-hat-giong-*.md` — hạt
    giống là SỔ, ô là CAM KẾT; hạt giống mồ côi là hợp lệ. Lối «mở hợp đồng mới»
    ở Cổng Bằng chứng ghi hạt giống, KHÔNG tạo ô. Vì sao: đơn vị kế toán của kit
    là ô và không ô nào có giá âm — mở miễn phí, đóng đắt — nên mọi phanh chiều
    sâu đều xả vào một sổ không trần (đo 08–18/09: 35 ô mở / 14 đóng, 22/35 sinh
    từ chính nghi thức kit).

    **Hình dạng neo là luật CỦA KHO NÀY, sống ở đây — không đi theo engine.**
    Khuôn ô giao cho kho tiêu thụ chỉ mang KHÁI NIỆM neo; hình dạng hẹp dưới đây
    là của kit, và răng của kit rút từ chính hai khối marker dưới đây (răng ấy
    đang park — giới hạn thứ ba bên dưới). Lý do là một lớp lỗi đã
    đo được hai lần trong một vòng (19/09): luật của người-sửa-kit rò vào khuôn
    giao đi thì một kho TRỐNG được dặn một việc không thể làm — ô đầu tiên của
    nó không có hồ sơ nào để trỏ.

<!-- <<<KIT-GOC-RULE -->
^Gốc:\s*\S+/_acceptance/[\w-]+
<!-- KIT-GOC-RULE>>> -->

<!-- <<<KIT-GOC-TU-TRO -->
/_acceptance/{slug}(?![\w-])
<!-- KIT-GOC-TU-TRO>>> -->

    **Giới hạn đã khai, kèm ngưỡng đang đếm** (hiến pháp cấm dặn-bằng-lời làm
    nghiệm, nên khai thay vì giả vờ có răng):
    · *Dạng neo hiện HẸP* — chỉ nhận con trỏ tới một hồ sơ `_acceptance/`, nên
      một ca thật không gắn hồ sơ (lượt CI đỏ, khảo sát nhiều kho, một khối kế
      hoạch) không mở được ô; 5 ô đã xếp lại vì đúng lý do đó 18/09. Ngưỡng mở
      lại: ≥1 lần owner phải mở tay một ô mà luật này chặn.
    · *Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — CHƯA CÓ RĂNG.*
      Răng đúng tầng là «mốc N+1 phải dẫn được một commit ở kho tiêu thụ đã cài
      mốc N»; bản chiếu yếu của nó (một dòng tự khai trong hồ sơ mốc) đã dựng và
      GỠ 19/09 vì nó rò vào khuôn giao đi và kiểm bằng danh sách đóng. Ngưỡng mở
      ô: một mốc cắt số mà sau 21 ngày không kho nào cài nó.
    · *Răng của luật này CHƯA GỘP vào `main`* (owner quyết 19/09, «cắt đuôi giữ
      lõi» lần cuối: luật và hàng chờ đã rà là lõi, răng là đuôi). Răng VC8 mới —
      ma trận 9 ca đỏ so bằng nhau + 4 mutant trên bản sao luật + lối (b) ghi hạt
      giống (LB1–LB3) — sống ở nhánh `cong-dang/o-chi-mo-khi-co-neo-ngoai`, park
      ở lượt chấm 6 vì chân ranh-giới của AC-1 hỏng; bàn giao ở
      `docs/handoff/2026-09-19-park-o-chi-mo-khi-co-neo-ngoai.md`. Hệ quả trên
      `main` hôm nay, khai thẳng: (i) luật neo là LỜI + hàng chờ đã rà tay; (ii)
      răng VC8 cũ vẫn đòi mọi hạt giống trỏ được về một ô (ba chân) — CHẶT hơn
      luật này; tới khi răng mới gộp, hạt giống mới trỏ `_acceptance/<ô>/` mà ô
      ấy trích lại tên tệp là đủ, ô đã xếp lại cũng tính; (iii) thẻ Cổng Bằng
      chứng vẫn in lối «mở hợp đồng mới» — người ký đọc luật này mà ghi hạt
      giống thay vì tạo ô. Ngưỡng mở lại nhánh răng: ≥1 ô mới vào hàng chờ sau
      ngày luật lên `main` mà không có dòng `Gốc:` (đếm bằng lệnh ở finding §7).

    Hồ sơ: `_acceptance/o-chi-mo-khi-co-neo-ngoai/` (park, hồ sơ đầy đủ ở nhánh
    trên) · số đo: `docs/findings/2026-09-18-o-sinh-tu-nghi-thuc-va-gia-cat-so.md`.

  - **Giới hạn CHIỀU RỘNG (owner quyết 30/08, «cắt đuôi giữ lõi»).** Kit từng
    chỉ có phanh chiều sâu (dừng-vá · trần 3 vòng · timebox) mà mọi phanh đều
    xả vào sổ hạng mục không trần → 5 vòng meta liên tiếp sau 2.4.0, 0 giá trị
    chạm người dùng. Luật:
    (a) **Bộ đo được máy kiểm MỘT tầng** — lưới thường trực là trần; KHÔNG mở
    vòng đo-thước-của-thước. Ngưỡng mở lại (đang đếm): ≥2 lượt chấm sai do
    phép-đo-tự-dối trên vòng SẢN PHẨM giữa hai release. Bằng chứng thực nghiệm
    của trần: ô khuon-rang-dung-chung park 30/08 — hai vòng S4 liên tiếp, bộ
    máy vi-phân mắc đúng lớp nó đi bắt (mã-đo không hội tụ về 0 phát hiện).
    (b) **Giữa hai mốc ĐƯỢC MỘT KHO TIÊU THỤ NHẬN tối đa MỘT vòng meta**, chỉ khi
    owner gọi tên. Mẫu số là mốc KHO NHẬN, không phải mốc cắt số: đo 18/09 cho thấy
    bảy lần cắt số trong mười ngày nới trần này thành bảy mà 0 kho nhận. Mốc chỉ cắt
    khi có kho chờ nhận — vế này CHƯA CÓ RĂNG (giới hạn khai ở khối «Ô chỉ mở khi có
    NEO NGOÀI»), và đi làn V như tiền lệ 2.5.0/2.7.0.
    (c) **Mỗi mốc phát hành đếm 5 dòng số** vào hồ sơ release (3 → 5, owner
    quyết 14/09): thời gian làm-xong→quyết-được mỗi vòng · số lần gọi
    người/vòng — TÁCH trong-thiết-kế / ngoài-thiết-kế, kèm số CHẠM mỗi lần ·
    số vòng bị hạ-tầng-kit đốt lượt chấm · **token máy/vòng** — S4 máy đo
    (`wf-usage` → `usage-report.md`), TÁCH ba khối chứng-minh-vật
    (machine+ui+judge+baseline) / tìm-lỗi (review+refute) / tổng hợp; phiên
    chính đếm tay như dòng 1 · **phút máy/lượt chấm** — đường găng S4 và tổng
    phút S4/vòng. Ba dòng đầu đếm tay, hai dòng sau máy đo. **Điều kiện tin
    cậy — ràng buộc, không phải chỉ số:** dòng 4–5 chỉ được cắt khi (i) đường
    verdict (finder → refute trong hợp đồng → REJECT) không đổi thành phần,
    hoặc đổi kèm răng CẢ HAI chiều (đỏ và im); (ii) số lượt chấm sai giữa hai
    mốc không tăng — đã là ngưỡng (a), không dựng phép đo mới. Mỗi hồ sơ đổi
    kit ghi bảng dự báo 5 dòng (↑ ↓ =) + điều kiện tin cậy; mốc 2.13 là mốc
    đầu có đủ 5 dòng (thước: spec 2026-09-14-khoi-tim-loi-tra-phi-theo-vat). **ÁN CẮT KIT ĐÃ BỎ** (owner quyết 01/09 sau
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
    muốn thành trường hồ sơ. Mỗi mốc phát hành ĐƯỢC PHÉP ghi chỗ cắt cho cửa
    sổ kế vào Notes của hồ sơ mốc, hoặc tuyên bố đã-tối-ưu kèm số; chỗ cắt chỉ
    thành Ô khi có `Gốc:` (18/09: vế «PHẢI gọi tên» cũ đẻ 12 trong 35 ô của mười
    ngày — hồ sơ `o-chi-mo-khi-co-neo-ngoai`). Số đếm phải ĐỌC ĐƯỢC, không phải
    đẻ việc: số không dẫn tới hành động nào vẫn là đo-hình-thức, bệnh luật này
    sinh ra để chặn.
    Hai chốt không mục tiêu số nào ghi đè: việc chạm KHÓ-ĐẢO luôn thắng
    (không được né gọi người vì KPI), và chữ quyết vẫn của người (ADR 0002).

  Bản neo: [docs/superpowers/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md](docs/superpowers/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md)
  · nền: [2026-08-09](docs/findings/2026-08-09-ban-chat-that-vong-lap-kit.md)
  · [2026-08-10](docs/findings/2026-08-10-ra-soat-luat-theo-north-star.md).

- **⭐ ĐỊNH VỊ (owner duyệt 21/09): kit là BẢNG ĐỒNG HỒ + DẪN ĐƯỜNG, không phải
  toà án.** Người dùng kit là **phiên Claude Code**, và qua nó là owner. Điều
  owner cần không phải một chứng minh sống sót mọi đối kháng, mà một bản đồ
  trạng thái THẬT: **đã xong gì · chưa xong gì · giới hạn đo lường · giới hạn hệ
  thống · sai hợp đồng** — *giới hạn là câu trả lời hợp lệ, không phải lỗi*.
  Toà án là **owner + reality**.

  **Tứ diện Ý · HẠNG MỤC · THƯỚC · VẬT.** Ba đỉnh đáy ĐỘNG và đều có giới hạn;
  kit không ưu ái đỉnh nào (hôm nay nó ưu ái hạng mục và gọi mọi thay đổi ở
  thước là «trôi»). **Ý ĐỊNH là đỉnh trên và CỐ ĐỊNH trong vòng** — đổi nó = một
  Cổng Đáng mới, bởi người (nguyên tố 1). Ý định cấp hai thứ không đỉnh đáy nào
  có: **trọng số** (AC nào chở cơn đau nào) và **chính sách** (khẩu vị rủi ro
  của chính vòng này); chốt MỘT lần ở Cổng Đáng rồi máy áp cho mọi cạnh gãy sau
  đó mà không hỏi lại — đó là đường duy nhất tới mục tiêu ≤3 lượt gọi người. Sáu
  cạnh, mỗi cạnh gãy phải có **TÊN · NGƯỜI GỠ · GIÁ** (bảng đủ ở bản neo):
  Hạng mục↔Vật = *sai hợp đồng* / *chưa làm* (máy sửa vật) · Thước↔Vật = *không
  đọc được ở đây* / *mù* (máy chạy lại khi bàn đo về · người chấp nhận chưa đọc,
  trả giá dựng bàn, hay đổi thước) · Hạng mục↔Thước = *thước lệch* (người) ·
  Ý↔Hạng mục và Ý↔Thước = người · **Ý↔Vật = reality đọc** (prod N ngày · phiên
  nghiệm thu theo ngưỡng đã khai).

  **CA DỪNG (K8 — quan trọng hơn mọi cải thiện khác cộng lại):** giới hạn là một
  **nhãn trạng thái** (term ở [CONTEXT.md](CONTEXT.md) — không lẫn với «Nhãn» của
  criterion), không phải một việc. Việc chỉ tự sinh từ *sai hợp đồng* (máy sửa
  vật) và *hệ thống chết* (thử lại MỘT lần). Mọi nhãn khác lên thẻ ở cổng ĐÃ CÓ —
  không thêm lượt gọi — và chỉ thành việc khi người mở ngân sách ở Cổng Đáng, có
  ghi giá, cân bằng hình chiếu của cạnh gãy lên ý định.

  **VẬT TẠO RA BÀN GIAO.** Bàn giao là sáu thứ vật tự phát ra, giá 0: `git diff`
  · test của kho (**tên test = tên AC**) · ô bỏ qua có tên (`test.skip('AC-9 —
  cần dữ liệu prod')`) · sha · suite của kho · sha đang chạy trên prod. Kit
  **render**, không **soạn**. Luật thiết kế đi kèm: thước ở CÙNG NHÀ với vật thì
  cạnh Thước↔Vật ngắn — thước chạy ở bất cứ đâu vật chạy; và chiều đỏ nằm trong
  **LỊCH SỬ** (TDD: commit test đứng trước commit vật, CI đỏ rồi xanh), không
  cần một tháp đo tháp.

  **Reality là đồng hồ cuối.** Trạng thái `da-cham-boi-thuc-te` do **người** ghi
  đóng hồ sơ bất kể ô đỏ ở đáy; và **một dòng hiệu chuẩn** ở hồ sơ mốc —
  `ĐẠT đã ký → prod đỏ: k / N` — là số duy nhất định nghĩa được «đủ», với N (số
  hồ sơ đã ký có dòng quan sát prod) là **chiều đỏ của chính nó**: N không tăng
  thì dòng vô hiệu, cấm đọc thành «0 sự cố». Cả hai vế: **ADR 0020**.

  **Điều kiện thi hành — KHÔNG có vòng «định vị lại».** Luật chiều rộng (b) áp
  lên chính khối này: phần TRỪ đi *bên trong* vòng sản phẩm đang vấp; chỉ phần
  cấu trúc (ý định đi suốt tới Cổng Bằng chứng + trạng thái reality) được tối đa
  **MỘT** vòng meta có tên, buộc vào mốc một kho tiêu thụ sẽ cài. Số đo 21/09
  làm nền: vật nói **7,4 %** token S4 · ui-check **97,4 % PASS** mà chỉ 1,3 % đi
  qua `executors.ui*` · hội đồng **240/293** bị người quyết lại · ý định ghi ở
  **9 %** hồ sơ và S4 không đọc nó · một vật 81 dòng kéo **4 622** dòng thước
  (57 : 1) trong khi nó đã ở prod.

  Bản neo: [docs/findings/2026-09-21-dinh-vi-lai-kit-vat-tao-ra-ban-giao.md](docs/findings/2026-09-21-dinh-vi-lai-kit-vat-tao-ra-ban-giao.md)
  · [ADR 0020](docs/adr/0020-reality-co-quyen-dong-ho-so-mot-dong-hieu-chuan.md).

- **Ba nguyên tố (hiến pháp trace).** Mọi bộ phận hiện có và mọi đề xuất mới
  phải trace về **một** trong ba, và nêu được **người hưởng cụ thể**:
  1. **Ý định chốt trước khi làm.** Chỉ owner biết "tốt" nghĩa là gì; chốt
     sau khi làm xong thì mọi kết quả tự biện minh được. Từ 21/09 nó là **đỉnh
     CỐ ĐỊNH** và phải đi suốt tới Cổng Bằng chứng — xem khối ĐỊNH VỊ ở trên.
  2. **Bằng chứng không tự dối.** Món này cho **MÁY**: "máy tin nhầm chính
     nó" là lớp lỗi có tỉ lệ đo được cao nhất; nhờ nó máy mới được chạy nhanh
     mà người khỏi kiểm lại.
  3. **Khoảnh khắc quyết thật.** Người xuất hiện đúng nơi có **đánh-đổi** hoặc
     **khó-đảo**; cổng phải có ≥2 lối ra sống. **Đảo-rẻ là mặt sau của nguyên
     tố này**: máy giữ đường đảo thì máy được đi trước; hành động không có
     đường đảo tự động rơi về khoảnh khắc quyết thật.

  **Không trace được = hình thức = cắt. TRỪ tự đi; CỘNG cần owner phê duyệt.**

  **CỘNG — không cấm, nhưng phải phê duyệt; giữ đơn giản (owner quyết 15/09,
  thay luật NỚI 07/09 — ADR 0018).** Đề xuất TRỪ đi như thường. Đề xuất CỘNG
  không bị bác chỉ vì là CỘNG, nhưng KHÔNG tự đi: owner phê duyệt đích danh
  từng ca (ở Cổng Phạm vi của chính vòng đó, hoặc bằng một ADR khi không có
  vòng). Ba vế KHÔNG đổi: trace về một trong ba nguyên tố + nêu người hưởng ·
  mục tiêu ≤3 lượt gọi người/vòng (T3 trần 4) và ≤1 chạm/lượt · khó-đảo LUÔN
  là câu hỏi cho người. Không luật giám sát riêng, không điều kiện thu hồi tự
  động — số vẫn đọc từ năm dòng của luật (c), không dựng gì thêm.
  Sử liệu, để không ai đọc thành «chưa từng xảy ra»: NỚI 07/09 mở vế «có thể
  CỘNG» không cần phê; điều kiện thu hồi tự động của nó đủ số ở 2.12.0 (14 so
  trần T3 4) và 2.13.0 (4 so trần T2 3); ADR 0017 (15/09) giữ nguyên kèm một
  luật giám sát; cùng ngày owner đọc lại và thay bằng luật này. Đo 15/09: 0 ô
  đang mở khai dưới luật nới, 3 CỘNG đã ship trong 5 tuần — ba cái đó giữ
  nguyên. Bối cảnh mở luật nới:
  [handoff 07/09 §1.1](docs/handoff/2026-09-07-handoff-doi-may.md).

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

- **7 thao tác cổng người** (`approve`, `signoff`, `observed`, `acceptance-init`,
  `acceptance-status`, `acceptance-report`, `start`) bị khoá model-invocation;
  `acceptance-card` cố tình để mở (feature-loop và approve/signoff
  model-invoke nó). Đừng "sửa" sự bất đối xứng này — test P32 giữ nó,
  lý do ở [docs/adr/0002](docs/adr/0002-human-gate-invocation-lock.md).
  Thao tác thứ bảy `observed` (ADR 0020, dựng ở hồ sơ `nhan-trang-thai-va-reality`)
  là người ghi trạng thái `da-cham-boi-thuc-te`: bản dựng đang phục vụ prod + ngày
  + tên. Ca NO-AC11 rút danh sách tên ở dòng trên và so với danh sách khoá của P32.

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
  thiếu file, đỏ vì HẠ TẦNG chứ không vì vật (P150, 23/08).

  **Nghi thức kiểm nhanh — HAI CHIỀU, phá thử cả hai cho mỗi phép đo mới:**
  1. *Độ nhạy:* "phá vật thật trong một bản sao, phép đo này có **đỏ** không?"
  2. *Độ đặc hiệu:* "chạm một thứ **KHÔNG phải vật** — hồ sơ của chính vòng, tài
     liệu, thứ repo đã khai là không-phải-hành-vi — phép đo này có **IM** không?"

  Chiều 2 thiếu cho tới 14/09, và vì thiếu nó **mọi luật về phạm vi của kit không
  thể sai được trong bất kỳ phép đo nào đang chạy**: phá `rang-moc.sh` thì làn
  review cũng đỏ, nên nó vẫn «qua» nghi thức một chiều — trong khi 20/20 refuter
  của một lượt chấm soi hồ sơ và 0 soi vật. Hiện thân: `tests/workflows/vung-vat-mutants.test.mjs`
  (chiều im + hai mutant: gỡ bộ lọc · đổi loại-trừ thành bao-gồm). Hồ sơ:
  `_acceptance/khoi-tim-loi-tra-phi-theo-vat/`.

- **Kit là engine — KHÔNG chứa**: product context của repo tiêu thụ, quy định
  đội (sống ở team handbook riêng), nội dung workspace `_acceptance/` của sản
  phẩm, thân skill bên thứ ba chưa vendor có tên + version gốc. Phép thử khi
  phân vân: thứ gì phải *chép* sang repo sản phẩm thứ hai, hoặc vô nghĩa với
  một công ty khác dùng kit, thì không thuộc kit. (Quyết 2026-07-27, plan
  discovery-gate0-rollout G1.)

  - **Sửa kit vì sự cố của MỘT kho phải cân trên MỌI kho (owner đặt 26/09).**
    Kit là nền dùng chung; mỗi kho tiêu thụ có hình dạng hồ sơ, tên mục, bộ đo
    khác nhau. Phép thử cho mọi đề xuất sửa: «kho KHÔNG có sự cố này được gì,
    mất gì?» và «hành vi cũ có ai đang dựa không?». Thứ tự chọn nghiệm: sửa
    đúng tầng (vật của kho tự lo) → bộ đọc khoan dung + cờ vàng → bật thêm theo
    lựa chọn → đổi mặc định; đổi mặc định là mọi kho trả giá. Neo vào khuôn kit
    định nghĩa (marker, chữ ký tiêu đề), không vào từ vựng của một kho. Răng
    hiện có: chiến dịch phát hành đo trước→sau trên các kho (tiền lệ 23/09,
    `docs/findings/2026-09-23-nang-sau-kho-len-2-18-1.md`). Chưa có: kiểm vi
    phân tự động trên bộ hồ sơ thật — ngưỡng dựng: ≥1 mốc đổi hành vi làm một
    kho đổi phán quyết mà vật của kho không đổi. Ca đẻ luật: B9,
    `docs/findings/2026-09-26-loi-kit-tu-luot-4-okr.md` §9.

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
