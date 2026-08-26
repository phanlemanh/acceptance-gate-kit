---
schema_version: 1
feature: design-pass nấc không đồng bộ — thang 4 nấc phản ứng (mặc định async, sync có người gọi tên) + bước phân kỳ có điều kiện mở từ đặc tả UX + khoá reaction/options/divergence trong sổ phiên + thẻ Cổng Phạm vi hiện nấc
slug: design-pass-nac-khong-dong-bo
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-08-25-design-pass-nac-khong-dong-bo-design.md
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: "2026-08-25T00:15:28Z"
---

# Acceptance Contract: design-pass-nac-khong-dong-bo

## Context

Nghi thức thiết kế S1-D đòi owner ngồi cạnh máy 30–60 phút mỗi vòng — đắt tới
mức hồ sơ thật `trang-tu-van-v2-r4-b1` bỏ luôn nghi thức bằng entry descope có
tên (18/08, `d-20260818T144534Z-14963`). Nghi thức bị bỏ khi người ta thành
thật là mặc định sai. Đồng thời vòng lặp thiếu bước phân kỳ rẻ: hướng của bề
mặt mới do máy quyết bằng chữ trong design-doc, trong khi chỉ owner biết
«đúng». Ô này đổi LỜI một nghi thức + bộ dựng thẻ đọc thêm hai khoá; không
skill mới, không đụng lưới/phép đo/workflow.

Đề bài đầy đủ (NGUỒN): `docs/plans/2026-08-19-hat-giong-design-pass-nac-khong-dong-bo.md`
mục 3 · 3b · 4.3.

**THU PHẠM VI 25/08 (owner quyết, sau khi luật dừng-vá bật ở vòng 2).** Sáu tiêu
chí AC-2…AC-7 mất lưới máy: chúng hứa những PHÁT BIỂU PHỔ QUÁT VỀ NGHĨA của văn
xuôi, loại mệnh đề mà phép so chữ không chứng được — bốn hình dạng lỗi đã dẫm
qua hai vòng nghiệm thu chỉ là bốn cách thất bại của cùng một điều bất khả.
Chúng chuyển sang người duyệt soi tại Cổng Phạm vi. Tám tiêu chí còn lại giữ
nguyên lưới vì chúng đo QUAN HỆ ĐẾM ĐƯỢC trên tập đóng hoặc ĐẦU RA THẬT của bộ
dựng thẻ. Đề bài phần cắt còn sống ở
`docs/plans/2026-08-25-hat-giong-do-loi-hua-van-xuoi.md`.

Source input: _acceptance/design-pass-nac-khong-dong-bo/opportunity.md

**DEAD-SENTENCE-NEEDLES** — danh sách ĐÓNG, máy đọc từ đây (không hardcode
trong script). Mỗi dòng là một câu khai mặc-định-đồng-bộ; đếm ở mốc phải bằng
đúng số khai, đếm ở cây đang kiểm phải 0. Danh sách phải ĐÓNG chứ không dùng
cụm trần «owner ngồi xem»: sau khi đổi, nấc 3 vẫn được nhắc cụm đó một cách hợp
lệ, nên kim trần sẽ đỏ oan trên vật ĐÚNG.

Kim «CHỜ owner phản ứng bằng lời» ĐÃ BỊ LOẠI khỏi danh sách (S3, 25/08): nó chỉ
«chết» vì đổi chữ hoa thành chữ thường, trong khi nghĩa vẫn sống và ca P77 của
kho còn ĐÒI cụm «phản ứng bằng lời» phải có mặt. Máy vẫn chờ người phản ứng bằng
lời — chỉ là không còn chờ đồng bộ. Một kim mà mọi phép đổi chữ hoa đều thoả là
thước tự dối, và hai phép đo chỏi nhau thì một cái sai.

<!-- <<<DEAD-SENTENCE-NEEDLES
owner ngồi xem và phản ứng bằng lời từng vòng|1
owner ngồi xem trực tiếp; owner async chưa nằm trong phạm vi|1
chấm thẩm mỹ là việc của owner ngồi xem|1
in-harness trên Browser pane, owner ngồi xem|1
DEAD-SENTENCE-NEEDLES>>> -->

**BASE-DPNKDB:** `c444c512f8f2b2c2b2fba59d4780d9fcff6c6071` — mốc git CỐ ĐỊNH
trước ô này, dùng làm đối chứng dương cho AC-12 (câu chết phải chết). Neo vào
`origin/main` là sai: sau khi ô này gộp thì cả hai đầu đều 0 và phép đo tự
chết mà vẫn xanh.

## Criteria

- AC-1: Given `skills/design-pass/SKILL.md`, When đọc mục vòng lặp phản ứng, Then có bảng thang PHẢN ỨNG bốn nấc trong marker `REACTION-LADDER` với đúng bốn id đóng `nac-0` · `nac-1` · `nac-2` · `nac-3`, mỗi nấc kèm tên tiếng người + điều kiện dùng — và marker là chỗ DUY NHẤT khai danh sách nấc.
- AC-2: Given nghi thức sau khi đổi, When đọc frontmatter `description` và thân skill, Then mặc định là KHÔNG ĐỒNG BỘ và sync là nấc phải có người gọi tên. **KHÔNG có phép đo máy** cho vế «sync phải có người gọi tên» — đó là phát biểu về NGHĨA của văn xuôi, không phải quan hệ đếm được (thu phạm vi 25/08, xem Out of scope). Vế đếm được — bốn câu khai mặc-định-đồng-bộ phải TUYỆT CHỦNG dưới `skills/**` + `feature-loop/**` — vẫn có lưới, sống ở AC-12; người duyệt soi phần còn lại tại Cổng Phạm vi.
- AC-3: Given hai vòng phản ứng không đồng bộ liên tiếp chê CÙNG một điểm, When nghi thức xử lý, Then luật leo thang bắt mời nấc 3 GIỚI HẠN đúng điểm đó (không phiên trọn gói), và luật nêu rõ leo thang theo TÍN HIỆU đếm được chứ không theo cảm giác. **KHÔNG có phép đo máy** — «nêu rõ theo tín hiệu chứ không theo cảm giác» là phát biểu về nghĩa; người duyệt soi tại Cổng Phạm vi.
- AC-4: Given bề mặt còn ≥2 hướng khả dĩ mà máy không tự chắc, When mở bước phân kỳ, Then nghi thức bắt thứ tự: (a) mở bằng vật thật đang có trước khi bày hướng mới, (b) nguồn bày hướng là section `## Đặc tả UX` của design-doc khi có, không có thì design-doc như cũ. **KHÔNG có phép đo máy** — «bắt thứ tự» là phát biểu về nghĩa của chỉ dẫn, không phải quan hệ đếm được; người duyệt soi tại Cổng Phạm vi.
- AC-5: Given bộ phương án của bước phân kỳ, When máy dựng, Then mỗi hướng có TRỤC có tên + 1 câu động cơ + 1 câu đánh đổi KỂ CẢ hướng máy không khuyên; ngả máy khuyên GHIM TRÊN VẬT chứ không nằm trong tin nhắn; tên hướng ổn định, hướng đã chốt không hỏi lại. **KHÔNG có phép đo máy** — đây là ràng buộc trên thứ máy SẼ SINH lúc chạy phiên, không phải thứ đọc được trên cây nguồn; người duyệt soi tại Cổng Phạm vi, và ván thử ở kho tiêu thụ là chỗ nó lộ ra thật.
- AC-6: Given máy KHÔNG mở bước phân kỳ, When kết phiên, Then bắt buộc để vết ở ĐÚNG MỘT khoá có tên `divergence:` trong khuôn sổ phiên (từ vựng đóng: `opened` | `skipped — <căn cứ 1 dòng>`) — không có nhánh «không ghi gì»; và độ nét yêu cầu = đủ cho quyết định đang mở. **KHÔNG có phép đo máy cho vế «không có đường bỏ im lặng»** — đó là phủ định phổ quát trên văn tự nhiên, mọi danh sách cấm đều còn không gian ngoài danh sách (hai vòng, hai hình dạng, xem Out of scope). Vế đếm được — khoá `divergence:` phải CÓ MẶT trong khuôn và khuôn là chỗ duy nhất giữ hình dạng sổ phiên — vẫn có lưới, sống ở AC-8; người duyệt soi phần còn lại tại Cổng Phạm vi.
- AC-7: Given phiên không có bộ dựng bộ phương án, When tới bước phân kỳ, Then nghi thức có thang bốn nấc vật dựng có tên (lưu được → chỉ-xem → file mở tại máy → không có: máy khuyên một hướng kèm căn cứ, ghi vết, đi tiếp) và KHÔNG dừng vòng. **KHÔNG có phép đo máy cho vế «kit không phụ thuộc bộ dựng nào»** — đó là phủ định phổ quát trên toàn văn, dò chữ chỉ bắt được đúng cụm người viết nghĩ ra; người duyệt soi tại Cổng Phạm vi.
- AC-8: Given khuôn sổ phiên trong marker `DESIGN-PASS-NOTE-TEMPLATE`, When đọc, Then có đúng hai khoá mới `reaction:` (nấc + kênh) và `options:` (tham chiếu, KHÔNG phải bằng chứng), và khuôn vẫn là chỗ DUY NHẤT giữ hình dạng sổ phiên.
- AC-9: Given sổ phiên khai `reaction:` hợp lệ, When dựng thẻ Cổng Phạm vi, Then khối «Bản mẫu & ngữ cảnh» hiện nấc phản ứng bằng NHÃN TIẾNG NGƯỜI lấy từ một bảng nhãn (không tự chế chuỗi) và hiện có/không đường bộ phương án.
- AC-10: Given sổ phiên đời trước (thiếu `reaction:`) hoặc khai giá trị lạ, When dựng thẻ, Then cờ vàng — thiếu khoá: nói rõ hồ sơ đời trước, KHÔNG chặn, KHÔNG bắt migrate; giá trị lạ: cờ vàng NÊU TÊN giá trị lạ đó. Sổ phiên đủ khoá thì SẠCH cờ nấc (đối chứng dương).
- AC-11: Given câu nấc-mặc-định nằm giữa cặp mốc neo `REACTION-DEFAULT-SENTENCE` trong `skills/design-pass/SKILL.md` (bản gốc DUY NHẤT), When đối chiếu với từng site khai trong bảng khai tay `REACTION-DEFAULT-SITES`, Then mỗi site chứa ĐÚNG NGUYÊN VĂN câu rút từ mốc neo — lệch MỘT TỪ ở một site là ĐỎ, và số site có mặt phải bằng đúng con số khai trong bảng (thêm/bớt một chỗ mà không sửa bảng cũng ĐỎ).
- AC-12: Given danh sách ĐÓNG `DEAD-SENTENCE-NEEDLES` và mốc `BASE-DPNKDB` khai ở Context, When đếm TỪNG kim ở mốc đó và ở cây đang kiểm, Then mỗi kim ở mốc đếm ĐÚNG số đã khai (đối chứng dương chứng minh hàm đếm biết đếm — kim nào ra 0 ở mốc là ĐỎ, không được lặng lẽ xanh) và MỌI kim ở cây đang kiểm đếm 0 — hai đầu chạy CÙNG một hàm đếm với CÙNG glob thư mục, khác input.
- AC-13: Given `GUIDE.md` và khuôn khởi tạo `commands/acceptance-init.md`, When người dựng kho mới đọc, Then cả hai ổ cắm thiết kế `design_pass.ds_skill` và `feature_loop.ui_standards_skill` đều được nêu — lỗ tài liệu phát hiện 19/08 đã lấp.
- AC-15: Given hồ sơ KHÔNG có sổ phiên `design-pass.md` (nhánh phổ biến nhất ở kho tiêu thụ, và là nhánh của CHÍNH hồ sơ này), When dựng thẻ Cổng Phạm vi, Then thẻ dựng THÀNH CÔNG, khối «Bản mẫu & ngữ cảnh» vắng hẳn, KHÔNG cờ nấc, KHÔNG nhãn rỗng hay chuỗi lạ — đường mới không được làm đứng thẻ của hồ sơ không chạy nghi thức thiết kế.
- AC-14: Given mọi ca đo của ô này, When đọc test, Then mỗi mệnh đề đo được có chiều đỏ đi qua CHÍNH hàm/bộ kiểm của chiều xanh (cùng bộ đọc, khác input), fixture do CODE SINH trong chính lượt chạy, và thông điệp đỏ GHIM tên mốc/khoá — không assertion âm-tính-một-mình, không fixture viết tay, không chiều đỏ tautology. (judgment)

## Coverage

- Trục A — Vật bị đổi: lời nghi thức (`skills/design-pass/SKILL.md`) | lời vòng lặp (đoạn S1-D) | khuôn sổ phiên (marker) | bộ dựng thẻ (`scripts/gate-card.js`) | tài liệu + khuôn khởi tạo [thước CE: năm vật có thật đọc từ cây, đối chiếu mục 3 + mục 6 «hồ sơ vấp» của hạt giống 19/08]
- Trục B — Nấc & bước: đi thẳng | async trên ảnh | async trên vật bấm được | sync opt-in | leo thang | bỏ-phân-kỳ-để-vết [thước CE: thang 4 nấc owner gật 20/08, mục 3b.6 hạt giống]
- Trục C — Đời hồ sơ đọc vào: đủ khoá | thiếu khoá (đời trước) | giá trị lạ | không có sổ phiên (AC-15) [thước CE: ba nhánh đọc-cũ đã chạy thật trong kit — contract thiếu Coverage 1.13.0, workspace thiếu gap-probe 1.14.0, sổ phiên thiếu `context:` 2.0.0]
- Ô Core → AC-1…AC-15; Later/Never → Out of scope. Chân ngành đối chiếu: `huashu-design` (MIT, teardown 20/08 — luật «chọn khi chưa thấy vật là chọn vô hiệu», cửa miễn bị đóng 07/18) [NGÀNH] · skill `/design` bản xem trước (nạp toàn văn 20/08 — kỷ luật phương án, ba kênh phản ứng) [NGÀNH].

## Đường đo

- Thước: số lần gọi người từ S1-D tới tin mời Cổng Phạm vi + HÌNH THỨC từng lần (đích: ≤2, cả hai không đồng bộ) · số từ: khoá `reaction:` trong sổ phiên + transcript ván thử · bảo đảm bởi: AC-1, AC-8, AC-9 (nấc phải được khai và hiện thì mới đếm được)
- Thước: số bề mặt phải giữ đồng bộ với code (đích: 1) · số từ: ĐẾM TAY trên ván thử — bộ phương án là nhánh cụt, không phải bề mặt thứ hai · bảo đảm bởi: AC-8 (`options:` là tham chiếu, không vào chuỗi bằng chứng)
- Thước: số skill thiết kế phải nuôi (kit giữ 1 nghi thức + 1 sàn) · số từ: ĐẾM TAY trên cây kit sau khi gộp · bảo đảm bởi: đã có sẵn — ô này không CỘNG skill nào
- Thước: thứ nghiệm thu máy đo được trên vật thật KHÔNG GIẢM · số từ: bảng eval của ván thử so với vòng gần nhất cùng kho · bảo đảm bởi: đã có sẵn — ô này không đụng lưới/phép đo/workflow
- Thước: thời gian lịch từ mở bước phân kỳ tới tin mời Cổng Phạm vi · số từ: dấu thời gian trong sổ phiên + sổ quyết định của ván thử · bảo đảm bởi: đã có sẵn — phiên ván thử ở kho tiêu thụ
- Thước: làm lại cấu trúc sau Cổng Phạm vi = 0 · số từ: entry approach/descope chạm luồng/màn trong `decisions.jsonl` của ván thử · bảo đảm bởi: đã có sẵn — sổ quyết định feature-loop (đo CHUNG với ô `dac-ta-ux-vat-hoa-cau-truc`)
- Thước: số lần bỏ bước phân kỳ, và trong đó số lần bị owner veto (ngưỡng CHẾT: veto ≥ 1) · số từ: khoá `divergence: skipped — <căn cứ>` trong sổ phiên, đếm trên ván thử, đối chiếu entry veto trong sổ quyết định · bảo đảm bởi: AC-6, AC-8 (khoá phải nằm trong khuôn thì mới đếm được)
- (KHÔNG ĐO trong ván này) Độ lệch bộ phương án ↔ vật thật — chỉ có số từ ván thử ở kho tiêu thụ; Cổng Giá trị đọc ô này là CHƯA ĐO, có lý do và con trỏ.

## Out of scope

- KHÔNG có phép đo máy cho AC-2…AC-7 (thu phạm vi 25/08). Hai vòng nghiệm thu, bốn hình dạng lỗi, cùng MỘT lớp: đo LỜI bằng phép so chữ. Chẩn đoán đúng đến ở vòng ba — các mệnh đề đó là phủ định phổ quát trên văn tự nhiên («không có đường bỏ im lặng», «không bộ dựng nào bắt buộc»), grep không chứng được; đường lật sang liệt-cái-được-phép chỉ cứu được phần từ vựng đóng, và phần đó đã nằm ở AC-8. Hạt giống `docs/plans/2026-08-25-hat-giong-do-loi-hua-van-xuoi.md` giữ đề bài + điều kiện mở lại.
- Người duyệt soi sáu tiêu chí đó bằng mắt tại Cổng Phạm vi cùng nghi thức đã sửa — đó là chốt chặn, không phải lưới máy.
- Không tạo skill mới, không «nghi thức bộ phương án» riêng — «chỉ TRỪ, không CỘNG» + luật một mặt phẳng làm việc.
- Không để kit phụ thuộc bộ dựng bộ phương án nào (bản xem trước, cần quyền tổ chức) — thang 4 nấc vật dựng thay cho phụ thuộc.
- Không đưa bộ phương án / ảnh / cảm giác bấm vào chuỗi bằng chứng — nghiệm thu máy vẫn đo trên vật thật; bản chép đọc ngược là dữ liệu không tin.
- Không gộp chấm chọn-hướng với Cổng Phạm vi thành một tin — khuôn nhiều chỗ trống vẫn là nhiều quyết định (owner 11–12/08).
- Không hard-gate «phải có ba phương án» kiểu huashu — thành trạm thu phí; vết một dòng + quyền veto thay thế.
- Không đổi lưới trước-khi-gộp, phép đo hiện có, hay bộ điều phối nghiệm thu.
- Không đo bằng máy độ lệch bộ phương án ↔ vật thật, và không đo số lần gọi người bằng máy — số đó sinh ở ván thử tại kho tiêu thụ, không sinh trong kit.
- Xếp kho `interactive-prototype` ở kho tiêu thụ là việc của kho đó sau khi kit phát hành — không thuộc ô này.

## Notes

- **Giới hạn đã khai (bổ sung 25/08, sau vòng 4):** lưới thoát-chuỗi của thẻ phủ
  mọi chỗ đẩy cờ mà một giá trị hồ sơ THẬT chạm tới được. Còn đúng MỘT nhánh ngoài
  tầm: cờ «nấc phản ứng không nhận diện được» theo cấu tạo không bao giờ nhận giá
  trị mang ngoặc nhọn, nên phép thoát chuỗi ở đó là phòng thủ chiều sâu KHÔNG có
  phép đo canh. Bốn vòng nghiệm thu cho thấy mọi phép quét tĩnh dựng để phủ nốt chỗ
  này đều tự nó thành thước khớp-mutant-của-chính-nó; owner quyết TRỪ nó và khai
  giới hạn.
- **Giới hạn cấu trúc của tự-chấm, đo được qua 4 vòng:** thước do máy viết và mutant
  chứng nó cũng do máy viết — cùng một trí tưởng tượng, nên hình dạng nằm ngoài nó
  thì cả hai đều không thấy. Làn rà soát, vốn được tự do phá vật thật theo cách nó
  chọn, lần nào cũng tìm ra hình dạng đó. Số lỗi BỘ ĐO có thể không về 0; thứ đáng
  đọc ở cổng là lỗi ở SẢN PHẨM — vòng 3 có 5, vòng 4 có 0.
- **Giới hạn đã biết, khai trước:** kit KHÔNG có giao diện web nên ô này không tự dùng được nghi thức nó đang sửa. Bằng chứng máy ở đây chứng minh LUẬT vào đúng chỗ và BỘ ĐỌC đọc đúng — không chứng minh nghi thức chạy tốt với người thật. Chứng minh đó là ván thử kế ở kho tiêu thụ, và đó chính là thứ Cổng Giá trị đọc.
- Feature KHÔNG chạm UI (kit không có bề mặt web) → không điền đặc tả UX, không chạy nghi thức S1-D; vết miễn ở `decisions.jsonl`.
