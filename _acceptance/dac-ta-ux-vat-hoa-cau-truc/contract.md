---
schema_version: 1
feature: Bản đặc tả UX — vật hoá tầng cấu trúc (khuôn có marker trong design-doc + phép đo khớp vòng advisory + bước tra mẫu)
slug: dac-ta-ux-vat-hoa-cau-truc
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: "2026-08-24T02:40:00Z"
---

# Acceptance Contract: dac-ta-ux-vat-hoa-cau-truc

## Context

Feature chạm UI không có vật nào bắt máy khai cấu trúc (luồng · màn · trạng
thái · hành vi · xuất xứ component) trước khi ai nhìn — owner thấy cấu trúc lần
đầu khi đã thành code, sửa đắt nhất. Ô này thêm: khuôn tham chiếu có marker,
lời S1 bắt điền trước khi sinh artifact, phép đo khớp vòng advisory (W8) trong
bộ lint sẵn có, và bước tra mẫu thị trường có vết. Không skill mới, không chặn
merge (owner quyết (a), 24/08).

Source input: _acceptance/dac-ta-ux-vat-hoa-cau-truc/opportunity.md

## Criteria

- AC-1: Given plugin acceptance-gate, When mở `skills/acceptance/references/ux-spec-template.md`, Then tồn tại section `## Đặc tả UX` trong marker `UX-SPEC-TEMPLATE` đủ 6 mục (luồng ba loại + điểm vào/ra · kiểm kê màn một-việc · bảng trạng thái máy-đọc trong marker `UX-STATE-TABLE` với id `ST-…` · hành vi · xuất xứ component theo thang dùng→ghép→mở-rộng→tạo · khuôn IA đã chọn + căn cứ tra mẫu), kèm cửa miễn prefix `"bỏ đặc-tả-UX — "` ở đầu khuôn.
- AC-2: Given khuôn ở AC-1, When test trích bảng trạng thái mẫu TỪ CHÍNH file khuôn qua marker (fixture rút-từ-writer, code-sinh trong lần chạy) và đưa cho reader của W8, Then reader đọc ra đúng số trạng thái mẫu — writer và reader không trôi khỏi nhau.
- AC-3: Given `feature-loop/skills/feature-loop/SKILL.md`, When đọc S1, Then có chỉ dẫn: feature chạm UI phải điền `## Đặc tả UX` vào design-doc TRƯỚC khi sinh 3 artifact (resolve khuôn qua resolve-plugin.mjs, KHÔNG hardcode version), contract ghi `design_doc:`, evals khai `states:`; và nghi thức hình Cổng Phạm vi vẽ hình luồng/màn TỪ section Đặc tả UX; câu «dòng state-matrix» cũ không còn là nguồn thứ hai (trỏ về khuôn).
- AC-4: Given feature KHÔNG chạm UI, When đi qua S1 và lưới, Then đường miễn là MỘT dòng entry `descope` bắt đầu đúng chuỗi `"bỏ đặc-tả-UX — "` (chuỗi trong SKILL khớp từng ký tự với chuỗi trong khuôn), và contract không có `surfaces: ui` thì W8 im lặng — 0 cờ. Vết miễn là quy ước cho NGƯỜI và ván thử đọc — engine cố ý KHÔNG có bộ đọc entry này; phần máy kiểm được của tiêu chí là khớp chuỗi hai bên + W8 im lặng, không hơn.
- AC-5: Given máy điền mục «Khuôn IA đã chọn + căn cứ», When máy không tự chắc khuôn IA, Then SKILL dạy thang tra mẫu hai nấc (phiên có công cụ tra mẫu thị trường → tra + ghi vết một dòng; không có → chọn từ danh sách khuôn IA có tên trong khuôn) và không phụ thuộc công cụ nào — vết tra mẫu là thứ NGƯỜI đọc tại cổng; máy KHÔNG kiểm nội dung căn cứ trong vòng này (đã thu phạm vi 24/08). (judgment)
- AC-6: Given contract `surfaces` chứa `ui`, When chạy lint, Then cờ W8a bật đúng cho MỌI hình dạng thiếu-vật — key vắng/rỗng · con trỏ chết · trỏ ra ngoài cây · thiếu marker bảng · marker có mà bảng RỖNG (ô-nuốt-luật) — mỗi hình dạng ghim NGUYÊN CÂU cảnh báo riêng; bản lành XANH trước trên cùng fixture.
- AC-7: Given contract cũ không có key `design_doc:` và surfaces không chứa `ui`, When chạy lint, Then 0 cờ W8 — hồ sơ cũ không bị bắt migrate, không cờ oan.
- AC-8: Given chế độ `--files` (không có repo root), When contract có `design_doc:` hợp lệ, Then lint KHÔNG phán «con trỏ chết» từ thư mục hiện tại — bỏ qua các cánh cần đọc design-doc kèm một dòng ghi chú; cánh W8a-vắng-key (không cần đọc file) vẫn chạy.
- AC-9: Given toàn bộ luật W8a và case suite mới của ô này, When đọc test, Then MỌI cánh (W8a/W8b/W8c/parse) có cặp hai-chiều trên CÙNG fixture code-sinh + thông điệp ghim — không assertion âm-tính-một-mình, không fixture viết tay đúng khuôn bên đọc.

## Coverage

- Trục A — Bộ phận giao: khuôn tham chiếu | lời S1 | luật W8 trong lint | đường đọc-cũ [thước CE: danh sách mảnh trong opportunity.md đã ký Cổng Đáng]
- Trục B — Tình huống việc đi qua: chạm UI điền đủ | chạm UI né/thiếu | không chạm UI miễn | hồ sơ cũ | máy không chắc khuôn → tra mẫu [thước CE: ngưỡng SỐNG/CHẾT trong opportunity.md]
- Trục C — Hình dạng THIẾU VẬT: đủ | key vắng/rỗng | con trỏ chết | ngoài cây | thiếu marker | bảng rỗng | hồ sơ cũ/đã ký [thước CE: ma trận [W8A]-o1..o10 + MEASURE-BIRTH-CLAUSE]
- (ĐÃ CẮT 24/08 sau 4 vòng) Trục khớp-vòng khai↔đo và cánh đoán-chay → hạt giống riêng `docs/plans/2026-08-24-hat-giong-khop-vong-dac-ta-ux.md`
- Ô Core → AC-1…AC-11; Later/Never → Out of scope. Chân ngành đối chiếu: quy trình UX 8 bước (owner 22/08) + ux-flow-designer · rampstack IA · danh sách khuôn Magdoub [NGÀNH]; mô hình Relume/Mobbin (IA là dữ liệu nguồn) [NGÀNH].

## Đường đo

- Thước: làm lại cấu trúc sau Cổng Phạm vi = 0 · số từ: entry approach/descope chạm luồng/màn trong decisions.jsonl của ván thử · bảo đảm bởi: đã có sẵn: sổ quyết định feature-loop
- Thước: 100% feature chạm UI có đặc tả UX (hoặc vết miễn) · số từ: đầu ra W8a của eval-coverage-lint trên hồ sơ ván thử · bảo đảm bởi: AC-6
- (KHÔNG ĐO trong ván này) Thước khớp vòng bảng trạng thái ↔ eval = 100% — thuộc hạt giống tách ra 24/08; Cổng Giá trị đọc ô này là CHƯA ĐO, có lý do và con trỏ
- Thước: 100% feature chạm UI có khuôn hoặc vết miễn · số từ: section Đặc tả UX trong design-doc hoặc entry `"bỏ đặc-tả-UX — "` trong decisions.jsonl · bảo đảm bởi: AC-3, AC-4
- Thước: máy điền khuôn một lượt, 0 lần gọi owner, khuôn ≤ 1 trang · số từ: transcript + design-doc của ván thử · bảo đảm bởi: đã có sẵn: phiên ván thử ở repo tiêu thụ
- Thước: máy né khuôn bị veto = 0 (ngưỡng CHẾT) · số từ: entry veto / descope không-lý-do-chính-đáng trong decisions.jsonl của ván thử · bảo đảm bởi: đã có sẵn: sổ quyết định + cửa veto làn V
- Thước: điền TRƯỚC bước phân kỳ/ruột tạm + hình tầng 1 vẽ từ khuôn · số từ: thứ tự vật trong transcript S1 + colophon hình của ván thử · bảo đảm bởi: AC-3 (lời S1 buộc thứ tự) + phiên ván thử
- Thước: feature không chạm UI 0 cờ · số từ: đầu ra lint trên hồ sơ không-UI trong ván · bảo đảm bởi: AC-10

## Out of scope

- Không chặn merge — W8a là ADVISORY (quyết (a) 24/08); nâng chặn cứng là ô sau ván thử.
- KHÔNG đối chiếu khai↔đo và KHÔNG soi nội dung căn cứ trong vòng này (thu phạm vi 24/08 sau 4 vòng nghiệm thu cùng lớp lỗi) — tách sang hạt giống riêng, làm bằng bộ đọc có ranh giới đóng.
- Không skill mới, không vendor skill ngoài (ux-flow-designer, wireframe-skill, rampstack, heuristics) — vay hình dạng/tên, không vay mã.
- Không đưa sơ đồ/wireframe vào chuỗi bằng chứng — hình là chiếu của khuôn; S4 vẫn đo DOM thật.
- Không đụng `scripts/pre-merge-check.sh`, `hooks/**`, `lib/**` — giữ T2.
- Không bắt hồ sơ/workspace/consumer cũ migrate — đường đọc-cũ W8 im lặng khi không opt-in.
- Không tree test / người thật ở S1 — thuộc Cổng Giá trị của feature dùng khuôn.
- Không thay bước phân kỳ / nấc phản ứng — thuộc ô `design-pass-nac-khong-dong-bo`; ô này chỉ cấp NGUỒN cho bước đó.

## Notes

- Giới hạn đã khai: W8a khoá vào `surfaces` tự khai — máy né được bằng cách bỏ
  `ui`. Tín hiệu thứ hai là lưới tier-mismatch S4 theo `design.surface_globs`
  (đã có sẵn, hai vật hai chủ); repo chưa wire glob thì lỗ còn hở — đó là ô
  của ngưỡng CHẾT «máy né bị veto ≥ 1» đo ở ván thử, không phải của lint.
