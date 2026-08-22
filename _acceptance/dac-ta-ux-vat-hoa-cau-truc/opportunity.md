---
schema_version: 1
slug: dac-ta-ux-vat-hoa-cau-truc
feature: Bản đặc tả UX — vật hoá tầng cấu trúc (luồng · màn · trạng thái · hành vi) thành một khuôn có đánh dấu trong design-doc; hình tầng 1 và phép đo S4 sinh từ cùng khuôn đó
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
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

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …

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

- **decision = …** Căn cứ: …
- **disposition = …** Căn cứ: ô này không có prototype code trong kit (đổi lời design-doc + một phép đo; ván thử ở repo tiêu thụ) — …
- **Phiên nghiệm thu ở đâu:** ván thử kế ở repo tiêu thụ, chung ván với ô design-pass — số đo là các thước dưới.
- **Ngưỡng UAT chốt cùng lúc ký:** …

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
