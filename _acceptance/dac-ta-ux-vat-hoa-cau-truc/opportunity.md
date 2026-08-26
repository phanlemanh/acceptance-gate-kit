---
schema_version: 1
slug: dac-ta-ux-vat-hoa-cau-truc
feature: Bản đặc tả UX — vật hoá tầng cấu trúc (luồng · màn · trạng thái · hành vi) thành một khuôn có đánh dấu trong design-doc; hình tầng 1 và phép đo S4 sinh từ cùng khuôn đó
owner: phanlemanh@gmail.com
stage: decided                # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-08-23T03:47:20Z     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition: archive     # keep | archive
---

## Vấn đề & ai gặp

Với feature chạm UI, kit có đủ cổng nhưng **thiếu một vật**: không có chỗ nào bắt máy khai *cấu trúc* (luồng suôn sẻ / biên / lỗi-và-quay-lại, điểm vào, kiểm kê màn một-việc-một-màn, bảng trạng thái, hành vi, xuất xứ component) **trước khi ai nhìn**. Design-doc ở S1 là chữ tự do, nên máy tự phán đoán cấu trúc; owner thấy cấu trúc lần đầu khi nó đã thành code ở Cổng Phạm vi — sai ở tầng đó là làm lại gần hết («không đúng ý thì gần như làm lại hoàn toàn», owner 22/08). Người trả giá: **owner** (duyệt cấu trúc bằng mắt trên vật đã có code, giá sửa cao nhất) và **máy** (không có khuôn nên mỗi feature phát minh lại, phép đo trạng thái S4 dựng *sau* ruột tạm thay vì khai *trước*). Bằng chứng thực địa: b1 (artifact-platform 19/08) có ma trận 14 trạng thái × 2 khổ nhưng sinh ở ruột tạm, không khai trước; đối chiếu 8 bước UX chuẩn với kit ngày 22/08 cho thấy bước 2 + 3 + 7 (luồng · kiểm kê màn/trạng thái · bàn giao) không có vật; bài đánh giá skill thiết kế (Superdesign 2026) kết luận skill dạng sách luật «làm đẹp lên, không làm chạy đúng hơn» — thiếu luồng, IA. Hồ sơ nghiên cứu: `discovery/nghien-cuu-skill-ux-ia-2026-08-22.md`. Ô anh em: `design-pass-nac-khong-dong-bo` (nấc phản ứng + bước phân kỳ) — ô này đứng TRƯỚC bước phân kỳ trong dây S1.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Owner duyệt được cấu trúc trên sơ đồ luồng + bảng trạng thái (bộ vẽ kit vẽ từ khuôn), không cần thấy UI | khuôn chỉ là tài liệu, quyết định vẫn dồn về lúc thấy code | một feature chạm UI: đếm số lần Cổng Phạm vi trả lại vì cấu trúc | Chưa thử — owner tự nhận cơ chế quyết là «hiểu qua hình» (22/08) |
| 2 | Khuôn đủ nhỏ (≤ 1 trang design-doc) để máy điền không thành trạm thu phí | máy bỏ khuôn khi vội, đúng như design-pass đồng bộ bị b1 bỏ | đo giờ máy điền khuôn trên 1 feature; có cửa miễn có vết cho feature không chạm UI | Chưa thử |
| 3 | Bảng trạng thái khai trước ↔ phép đo trạng thái S4 khớp vòng được (cùng khuôn, cùng marker) | hai bản chép trôi khỏi nhau — đúng lớp lỗi «bên viết/bên đọc trôi» | phá một trạng thái trong bản sao → phép đo khớp vòng phải đỏ | Chưa thử |
| 4 | Feature không chạm UI không bị ép khuôn (cửa miễn khai một dòng, lưới không cờ) | khuôn thành thuế cho mọi feature → bị gỡ | chạy một feature backend/T1 qua lưới: 0 cờ | Chưa thử |
| 5 | Thước «làm lại cấu trúc sau Cổng Phạm vi» đếm được từ sổ quyết định (entry approach/descope chạm luồng) | thước trang trí | đếm trên 3 hồ sơ cũ có UI | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: Trên MỘT feature chạm UI ở repo tiêu thụ, máy có khai cấu trúc (luồng · màn · trạng thái · hành vi · xuất xứ component) trong khuôn có đánh dấu TRƯỚC khi ai nhìn, và owner có quyết được cấu trúc trên hình vẽ từ khuôn đó — đo bằng số lần làm lại cấu trúc sau Cổng Phạm vi, độ khớp vòng bảng trạng thái khai trước ↔ phép đo trạng thái S4, và vết khuôn/miễn trên từng feature đi qua lưới trong ván.
- Kết quả nào là SỐNG: khuôn điền đủ, có đánh dấu, trước bước phân kỳ/ruột tạm và hình tầng 1 vẽ từ khuôn (không vẽ tay); entry approach/descope chạm luồng/màn sau Cổng Phạm vi = 0 và Cổng Phạm vi không trả lại vì cấu trúc khác ý (trả vì da/chữ không tính); mọi trạng thái khai trước có phép đo S4 và mọi phép đo trạng thái trỏ về một dòng bảng (khớp vòng 100%) — phá một trạng thái trong bản sao thì phép đo phải đỏ; máy điền khuôn trong một lượt, 0 lần gọi owner để điền, khuôn ≤ 1 trang; feature không chạm UI đi qua lưới trong ván: 0 cờ.
- Kết quả nào là CHẾT: máy né khuôn — khai «miễn» hoặc viết cấu trúc ngoài khuôn cho feature chạm UI rồi bị owner veto ≥ 1 lần, hoặc bỏ khuôn bằng entry descope khi vội; HOẶC bảng trạng thái trôi khỏi phép đo — S4 đo một trạng thái không có trong bảng / bảng khai một trạng thái không ai đo mà phép đo khớp vòng vẫn xanh (mutant không đỏ); HOẶC owner đã duyệt cấu trúc trên hình rồi Cổng Phạm vi vẫn trả lại vì cấu trúc ≥ 1 lần — bất kỳ một cái nào là chết.
- Timebox: hết ván thử kế đầu tiên (feature chạm UI kế tiếp ở repo tiêu thụ, chung ván với `design-pass-nac-khong-dong-bo`), muộn nhất 2026-09-30; tới hạn chưa có ván nào chạy trọn → `decision: park`, không để Cổng Giá trị treo.

## Kết quả prototype

Chưa dựng. Ván thử tự nhiên = feature chạm UI kế tiếp ở repo tiêu thụ (cùng ván với `design-pass-nac-khong-dong-bo`, đo được cả hai ô trong một ván).

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Hình dạng nghi thức: PRD → ca sử dụng → cổng duyệt → bản đồ màn → sơ đồ luồng/trạng thái → wireframe → bàn giao có truy vết | ThomasPraun/ux-flow-designer (MIT, 8★, 02/2026) | triết-lý/logic | có — hình dạng, KHÔNG vay mã | — |
| Quy trình IA 9 pha (sitemap → điều hướng → phân loại → tree test) + luật «thiếu nghiên cứu thì nói thiếu, không bịa» | rampstackco/claude-skills `information-architecture` (570★) | triết-lý/logic | có — luật không bịa + tên bài thử người thật | — |
| Khuôn IA có tên (wizard · hub-and-spoke · dashboard-first · hội thoại · kanban…) để bước phân kỳ bày hướng | Magdoub/claude-wireframe-skill (68★) | triết-lý/logic (danh sách tên) | có — tên khuôn; KHÔNG vay HTML/CSS | — |
| «File không có = khâu chưa làm» — cổng vật-hoá máy kiểm được | huashu-design (teardown 20/08, đã khai ở ô design-pass) | triết-lý/logic | có | — |
| 8 bước UX chuẩn (vấn đề → người dùng → luồng → IA/trạng thái → phác xám → DS dùng→ghép→mở rộng→tạo → kiểm chứng → bàn giao → đo) | lời Claude trả lời owner 22/08 (chép trong hồ sơ nghiên cứu) | triết-lý/logic | có — bước 2/3/7 là khuôn; bước 5 là thang xuất xứ component | — |
| Máy chấm heuristics (Nielsen 0–4 / Norman / WCAG) nhận URL·ảnh·code | mastepanoski/claude-skills · wondelai ux-heuristics | cơ chế riêng | không vendor — chỉ lấy Ý «cờ máy, không phán quyết» (UXBench 06/2026: độ hành-động-được khác nhau theo mô hình) | — |
| Người dùng mô phỏng chạy web thật | UXAgent (Amazon, CHI 2025) | cơ chế riêng | không — bằng chứng giới hạn, để tham khảo | — |

## Cổng 0

- **decision = build** Căn cứ: trace về hai nguyên tố — «ý định chốt trước khi làm» (cấu trúc là tầng chỉ owner biết «đúng», hôm nay owner thấy nó lần đầu khi đã thành code) và «bằng chứng không tự dối» (bảng trạng thái khai trước ↔ phép đo trạng thái S4 khớp vòng, chiều đỏ thử bằng mutant); người hưởng cụ thể là owner (duyệt cấu trúc lúc sửa còn rẻ) và máy (có khuôn thay vì phát minh lại mỗi feature). Không CỘNG bộ phận: không skill mới, không bề mặt mới — một section trong design-doc + một phép đo vào lưới sẵn có. Ô anh em `design-pass-nac-khong-dong-bo` đã ký build 22/08 với con trỏ bậc 1 trỏ thẳng vào vật này (bước phân kỳ mở từ bản đặc tả UX khi ô này ship), nên gác lại là trả giá bằng làm-lại ở ô kia. Rủi ro «chưa có ván thử» chặn bằng timebox 30/09 → park. Ký 2026-08-23, Manh Phan.
- **disposition = archive** Căn cứ: ô này không có prototype code trong kit (đổi lời design-doc + một phép đo; ván thử ở repo tiêu thụ) — không có gì để giữ; không có Bảng nợ kế thừa, không guard diffBase.
- **Phiên nghiệm thu ở đâu:** ván thử kế ở repo tiêu thụ, chung ván với ô design-pass — số đo là các thước dưới.
- **Ngưỡng UAT chốt cùng lúc ký:** chép nguyên bốn dòng của section «Ngưỡng chết / ngưỡng UAT» — câu hỏi: trên MỘT feature chạm UI ở repo tiêu thụ, máy có khai cấu trúc trong khuôn có đánh dấu TRƯỚC khi ai nhìn và owner có quyết được cấu trúc trên hình vẽ từ khuôn đó · SỐNG: khuôn điền đủ trước bước phân kỳ/ruột tạm và hình vẽ từ khuôn; làm lại cấu trúc sau Cổng Phạm vi = 0; bảng trạng thái ↔ phép đo S4 khớp vòng 100% (phá một trạng thái thì đỏ); 0 lần gọi owner để điền, khuôn ≤ 1 trang; feature không chạm UI 0 cờ · CHẾT: máy né khuôn bị veto ≥ 1 hoặc bỏ khuôn khi vội, HOẶC bảng trạng thái trôi khỏi phép đo mà lưới vẫn xanh, HOẶC owner duyệt trên hình rồi Cổng Phạm vi vẫn trả lại vì cấu trúc ≥ 1 · Timebox: hết ván thử kế, muộn nhất 2026-09-30 → park.

## Thước đo thành công → ứng viên criterion

- Số lần **làm lại cấu trúc sau Cổng Phạm vi** (entry approach/descope chạm luồng/màn) — đích 0.
- Tỷ lệ phép đo trạng thái S4 **khớp vòng** với bảng trạng thái khai trước — đích 100%, lệch là đỏ (phép đo mới, có chiều đỏ thử bằng mutant).
- Số lần Cổng Phạm vi **trả lại vì cấu trúc khác ý** — đích 0; trả lại vì da/chữ không tính.
- **Giờ máy** điền khuôn trên một feature — dưới trần khai ở S1 (khuôn ≤ 1 trang).
- Tỷ lệ feature chạm UI **có khuôn hoặc có vết miễn** — đích 100%; feature không chạm UI: 0 cờ.

## Out of scope từ khám phá

- Không skill mới — khuôn sống trong design-doc (S1), hình vẽ bằng bộ vẽ kit, phép đo thêm vào lưới sẵn có. Bác vì «chỉ TRỪ không CỘNG» + một mặt phẳng làm việc.
- Không vendor skill ngoài (ux-flow-designer, wireframe-skill, rampstack IA, heuristics) — vay hình dạng/tên, không vay mã; mọi skill đó «thiết kế mù», không đọc repo.
- Không đưa sơ đồ/wireframe vào chuỗi bằng chứng — hình là chiếu của khuôn; S4 vẫn đo DOM thật.
- Không thay bước phân kỳ / nấc phản ứng — đó là ô `design-pass-nac-khong-dong-bo`; ô này chỉ cung cấp *nguồn* cho bước đó.
- Không bắt buộc tree test / 5 người ở S1 — người thật thuộc Cổng Giá trị; feature IA-nặng khai ngưỡng «tìm thấy ≥ 4/5» ở ô cơ hội của nó.
- Không ép khuôn cho feature không chạm UI — cửa miễn một dòng có vết, lưới không cờ.
- Không đổi lưới trước-merge ngoài một phép đo khớp vòng (bảng trạng thái ↔ eval trạng thái).
