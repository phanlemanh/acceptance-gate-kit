# Nghiên cứu 22/08 — UX / kiến trúc thông tin cho agent: thị trường skill, giới hạn, và mấu chốt

**Bối cảnh:** owner hỏi sau khi ký-thử ô `design-pass-nac-khong-dong-bo`: «UI có hệ thiết kế
giải quyết; UX và IA giải quyết thế nào? Có plugin/skill nào được đánh giá cao làm phần này
cho agent như Claude?» Rồi gửi một đoạn hỏi-đáp với Claude về quy trình UX 8 bước và nhận xét:
«trong tất cả tính năng chúng ta thiếu bước xây dựng tài liệu rõ ràng cho UX, hoặc một chỉ dẫn
để Claude thực hiện thay vì tự phán đoán». Hồ sơ này là kết quả nghiên cứu + đối chiếu, là
căn cứ mở ô. Phiên: `4ef5201a…` (cwd kit, 22/08).

## 1. Khung câu hỏi

Hệ thiết kế giải quyết tầng da vì nó làm **sai thành rẻ** (đổi token, không đập cấu trúc).
Câu hỏi: tầng cấu trúc (UX/IA) có thứ tương đương không — thứ làm sai cấu trúc thành rẻ?

**Nguyên lý:** «đúng» của màu chữ nằm trong hệ thiết kế (máy tra được); «đúng» của cấu trúc
nằm ở mô hình trong đầu người dùng — không nằm trong máy, không nằm trọn trong owner. Nên
không skill nào cho «tin trước»; làm được ba việc: (a) cấu trúc *nhìn thấy được* trước code,
(b) *chiều đỏ* rẻ lên cấu trúc, (c) cấu trúc trong code là *dữ liệu* để đổi không đập.

## 2. Bản đồ thị trường (đọc sâu 12 nguồn)

| Loại | Đại diện (sao · hoạt động, 22/08/2026) | Cho gì | Giới hạn thật |
|---|---|---|---|
| Sách luật (chỉ hướng dẫn) | nextlevelbuilder/ui-ux-pro-max (119.6k★, 08/2026) · wondelai/skills (2.0k★: JTBD, Norman, Nielsen, lean-ux, design-sprint) · szilu/ux-designer-skill (50★, 24 file tham chiếu, có `05-information-architecture.md`: sitemap, card sort) · deanpeters/Product-Manager-Skills (6.6k★: opportunity-solution-tree, user-story-mapping, discovery-process) · tommyjepsen/awesome-ux-skills (164★: journey-mapping, storyboard, empathy map, heuristics) | Máy lý luận đúng khuôn | Không sinh vật để người nhìn. Superdesign (2026) review 7 skill: «bias taste, không render, thiếu luồng/IA/tư duy hệ thống — làm đẹp lên, không làm chạy đúng hơn». ui-ux-pro-max **không** phủ IA/luồng (tự khai: component/page level) |
| Sinh vật cấu trúc | ThomasPraun/ux-flow-designer (8★): PRD → ca sử dụng → **cổng duyệt** → bản đồ màn + mermaid luồng/trạng thái/tuần tự → wireframe HTML bấm được → bàn giao có truy vết · Magdoub/claude-wireframe-skill (68★): 5 hướng đặt tên theo **khuôn IA** (wizard, hub-and-spoke, dashboard-first, conversational, kanban), trắng-đen trước, màu sau bằng agent song song · rampstackco/claude-skills `information-architecture` (570★): 9 pha (khán giả → card sort → sitemap → URL → điều hướng → phân loại → **tree test** → tài liệu → bàn giao), luật «thiếu nghiên cứu thì nói thiếu, không bịa» · cuellarfr/design-skills (51★): journey mapping, state machine, design critique · PRD Diagram Builder (mermaid từ PRD) | Đúng hình dạng «bậc 1» | Nhỏ, ít sao, non. Nhưng **bộ vẽ của kit đã có** wireflow, journey map, state machine, service blueprint → vay *hình dạng nghi thức*, không vay skill |
| Chiều đỏ cho UX | mastepanoski/claude-skills (47★): Nielsen 0–4, WCAG POUR, Norman 7, nhận URL/ảnh/code · wondelai ux-heuristics · rune ux-heuristic-reviewer (50+ mục trên code frontend) | Bắt lớp lỗi hiển nhiên, rẻ | **UXBench (arXiv 2606.16262, 06/2026)**: 8 mô hình frontier, độ *hành động được* của phê bình UX khác nhau đáng kể theo mô hình và loại bề mặt — chưa giải xong → dùng làm **cờ**, không phán quyết |
| Người dùng mô phỏng | UXAgent (Amazon, CHI EA 2025, arXiv 2502.12561 / 2504.09407): hàng nghìn persona LLM đi thật trên web, phỏng vấn được agent | Lọc sớm thiết kế bài thử | Tác giả: để *chuẩn bị* nghiên cứu người thật, không thay; nhà nghiên cứu lo ngại |

Thị trường **không có** skill cho «tin trước» về IA. Gần nhất là mô hình Relume: sitemap trước,
wireframe sinh từ sitemap bằng thư viện component — tức IA là **dữ liệu nguồn**, thứ khác sinh ra.

## 3. Mấu chốt — tương đương của hệ thiết kế cho UX/IA là ba thứ ghép

| Vai | Da (UI) — hệ thiết kế | Cấu trúc (UX/IA) — tương đương | Kit có? |
|---|---|---|---|
| Nguồn sự thật | token & component | **bản đồ màn & luồng** (màn nào, bấm gì ra gì, trạng thái nào) — vẽ bằng bộ vẽ kit, duyệt trước canvas, trước code | bộ vẽ có; **khuôn chưa có** |
| Thư viện khuôn | biến thể component | **khuôn IA có tên** (wizard · hub · dashboard · hội thoại…) để bước phân kỳ bày 2–3 khuôn thay vì máy tự nghĩ — chính là hình H6 của ô design-pass nâng thành bảng | **chưa có** |
| Chiều đỏ | máy đo DOM thật (S4, sàn ux-ui-craft) | hai nấc: máy chấm heuristics làm **cờ**; **người thật tìm thử** (tree test / first-click, 5 người) làm phán quyết — chỗ của Cổng Giá trị | S4 có; tree test **chưa nối** |

Điều phải chấp nhận: tin cậy ở tầng cấu trúc không mua bằng skill; mua bằng cấu trúc *được nhìn
sớm, đổi rẻ, và được vài người lạ thử*. Chiều đỏ cuối cùng của cấu trúc là người dùng thật.

## 4. Đối chiếu 8 bước UX chuẩn với kit (căn cứ mở ô)

Nguồn: lời Claude trả lời owner 22/08 (chuyên gia UX, xây UX/UI cho feature với DS sẵn — 8 bước:
0 phát biểu vấn đề · 1 người dùng/bối cảnh/JTBD · 2 luồng ba loại + điểm vào · 3 kiểm kê màn
một-việc + bảng trạng thái 5–6 trạng thái · 4 phác xám, chọn khuôn tương tác, giảm tải nhận thức ·
5 áp DS theo thang dùng→ghép→mở rộng→tạo có lý do, viết copy thật · 6 prototype + kiểm chứng
5 người hoặc heuristics, «bạn không phải user của mình» · 7 bàn giao: sơ đồ luồng + bảng trạng
thái + hành vi + xuất xứ component — «70% design bị làm sai là spec thiếu» · 8 ship, đo, lặp).

| Bước | Kit có chỗ nào | Trạng thái |
|---|---|---|
| 0 | ô cơ hội «Vấn đề & ai gặp», Cổng Đáng | có |
| 1 | ô cơ hội + design-doc S1 | có một phần, không ô bắt buộc |
| 2 luồng ba loại + điểm vào | không vật; design-doc chữ tự do | **thiếu** |
| 3 kiểm kê màn + bảng trạng thái | ma trận trạng thái ở ruột tạm/S4 — sinh SAU, không khai TRƯỚC | có nửa sau |
| 4 phác xám, khuôn | bước phân kỳ canvas (ô design-pass) | đang làm |
| 5 thang DS | luật cứng design-pass + sàn ux-ui-craft + ds_skill | có; thiếu vết «mở rộng vì sao» |
| 6 kiểm chứng | ruột tạm + Cổng PV (owner) · S4 · uat-session sau cờ | có sau ship, thiếu trước code |
| 7 bàn giao | contract GWT + evals + design-doc — rải rác | rải rác |
| 8 đo | ngưỡng UAT + Đường đo | có |

→ Kit đủ cổng, thiếu **một vật**: bản đặc tả UX = bước 2 + 3 + 7. Không có nó, máy tự phán đoán
ở S1 và owner thấy cấu trúc lần đầu khi đã có code.

## 5. Vì sao «vật» chứ không «lời nghi thức»

Huashu: «file không có = khâu chưa làm» — máy kiểm được; lời nghi thức thì máy bỏ qua khi vội.
Vật này làm ba việc: nguồn cho hình tầng 1 (bộ vẽ kit vẽ wireflow + state từ nó — hình là chiếu
của chữ); khuôn cho phép đo (bảng trạng thái khai trước ↔ eval trạng thái S4 khớp vòng — nếp
«thước gắn vào vật», mẫu OOC-ITEM-TEMPLATE/P55); lối ra cho bước phân kỳ (canvas chỉ khi còn
≥ 2 hướng). Vị trí trong dây S1: design-doc → **bản đặc tả UX** → bước phân kỳ → ruột tạm →
Cổng Phạm vi. Quyết 22/08: **tách ô riêng** (không gộp vào design-pass) — hai câu hỏi khác nhau
(«máy khai gì trước khi ai nhìn» vs «người gặp máy lúc nào, trên vật gì»); ô design-pass ký với
một dòng con trỏ.

## Nguồn

- Superdesign — Design skills reviewed (2026): https://superdesign.dev/blog/design-skills-reviewed
- ux-flow-designer: https://github.com/ThomasPraun/ux-flow-designer
- claude-wireframe-skill: https://github.com/Magdoub/claude-wireframe-skill
- rampstack information-architecture: https://github.com/rampstackco/claude-skills/blob/main/skills/information-architecture/SKILL.md
- cuellarfr/design-skills: https://github.com/cuellarfr/design-skills
- awesome-ux-skills: https://github.com/tommyjepsen/awesome-ux-skills
- szilu/ux-designer-skill: https://github.com/szilu/ux-designer-skill
- ui-ux-pro-max SKILL.md: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/SKILL.md
- wondelai/skills: https://github.com/wondelai/skills
- Product-Manager-Skills: https://github.com/deanpeters/Product-Manager-Skills
- mastepanoski/claude-skills: https://github.com/mastepanoski/claude-skills
- UXBench: https://arxiv.org/abs/2606.16262 · UXAgent: https://arxiv.org/abs/2502.12561
- Relume: https://www.relume.ai/ · Snyk top Claude skills UI/UX: https://snyk.io/articles/top-claude-skills-ui-ux-engineers/
