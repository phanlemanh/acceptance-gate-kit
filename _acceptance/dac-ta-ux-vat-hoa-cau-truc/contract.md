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
- AC-2: Given khuôn ở AC-1, When trích section qua marker rồi «điền» bằng luật bỏ-ngoặc, Then bảng trạng thái mẫu rút ra được và mọi marker còn nguyên — khuôn dùng được như vật máy-đọc cho việc khớp vòng sẽ làm sau (hạt giống 24/08).
- AC-3: Given `feature-loop/skills/feature-loop/SKILL.md`, When đọc S1, Then có chỉ dẫn: feature chạm UI phải điền `## Đặc tả UX` vào design-doc TRƯỚC khi sinh 3 artifact (resolve khuôn qua resolve-plugin.mjs, KHÔNG hardcode version), contract ghi `design_doc:`, evals khai `states:`; và nghi thức hình Cổng Phạm vi vẽ hình luồng/màn TỪ section Đặc tả UX; câu «dòng state-matrix» cũ không còn là nguồn thứ hai (trỏ về khuôn).
- AC-4: Given feature KHÔNG chạm UI, When đi qua S1 và lưới, Then đường miễn là MỘT dòng entry `descope` bắt đầu đúng chuỗi `"bỏ đặc-tả-UX — "` (chuỗi trong SKILL khớp từng ký tự với chuỗi trong khuôn), — không phép đo máy nào của vòng này chạm feature không-UI. Vết miễn là quy ước cho NGƯỜI và ván thử đọc — engine cố ý KHÔNG có bộ đọc entry này; phần máy kiểm được là khớp chuỗi hai bên, không hơn.
- AC-5: Given máy điền mục «Khuôn IA đã chọn + căn cứ», When máy không tự chắc khuôn IA, Then SKILL dạy thang tra mẫu hai nấc (phiên có công cụ tra mẫu thị trường → tra + ghi vết một dòng; không có → chọn từ danh sách khuôn IA có tên trong khuôn) và không phụ thuộc công cụ nào — vết tra mẫu là thứ NGƯỜI đọc tại cổng; máy KHÔNG kiểm nội dung căn cứ trong vòng này (đã thu phạm vi 24/08). (judgment)
- AC-6: Given toàn bộ bộ ca mới của ô này, When đọc test, Then MỌI cánh (W8a/W8b/W8c/parse) có cặp hai-chiều trên CÙNG fixture code-sinh + thông điệp ghim — không assertion âm-tính-một-mình, không fixture viết tay đúng khuôn bên đọc.

## Coverage

- Trục A — Bộ phận giao: khuôn tham chiếu | lời S1 (điền trước · tra mẫu · hình vẽ từ khuôn) | cửa miễn [thước CE: danh sách mảnh trong opportunity.md, TRỪ phần máy-tự-kiểm đã cắt]
- Trục B — Tình huống việc đi qua: chạm UI điền đủ | chạm UI né/thiếu | không chạm UI miễn | hồ sơ cũ | máy không chắc khuôn → tra mẫu [thước CE: ngưỡng SỐNG/CHẾT trong opportunity.md]
- Trục C — (ĐÃ CẮT TRỌN 24/08) mọi phép đo máy cho đặc tả UX → hạt giống `docs/plans/2026-08-24-hat-giong-khop-vong-dac-ta-ux.md`
- Ô Core → AC-1…AC-11; Later/Never → Out of scope. Chân ngành đối chiếu: quy trình UX 8 bước (owner 22/08) + ux-flow-designer · rampstack IA · danh sách khuôn Magdoub [NGÀNH]; mô hình Relume/Mobbin (IA là dữ liệu nguồn) [NGÀNH].

## Đường đo

- Thước: làm lại cấu trúc sau Cổng Phạm vi = 0 · số từ: entry approach/descope chạm luồng/màn trong decisions.jsonl của ván thử · bảo đảm bởi: đã có sẵn: sổ quyết định feature-loop
- Thước: 100% feature chạm UI có đặc tả UX hoặc vết miễn · số từ: ĐẾM TAY trên hồ sơ ván thử (section trong design-doc hoặc entry descope) · bảo đảm bởi: AC-3, AC-4 — vòng này KHÔNG có phép đo máy
- (KHÔNG ĐO trong ván này) Thước khớp vòng bảng trạng thái ↔ eval — thuộc hạt giống tách 24/08; Cổng Giá trị đọc ô này là CHƯA ĐO, có lý do và con trỏ
- Thước: 100% feature chạm UI có khuôn hoặc vết miễn · số từ: section Đặc tả UX trong design-doc hoặc entry `"bỏ đặc-tả-UX — "` trong decisions.jsonl · bảo đảm bởi: AC-3, AC-4
- Thước: máy điền khuôn một lượt, 0 lần gọi owner, khuôn ≤ 1 trang · số từ: transcript + design-doc của ván thử · bảo đảm bởi: đã có sẵn: phiên ván thử ở repo tiêu thụ
- Thước: máy né khuôn bị veto = 0 (ngưỡng CHẾT) · số từ: entry veto / descope không-lý-do-chính-đáng trong decisions.jsonl của ván thử · bảo đảm bởi: đã có sẵn: sổ quyết định + cửa veto làn V
- Thước: điền TRƯỚC bước phân kỳ/ruột tạm + hình tầng 1 vẽ từ khuôn · số từ: thứ tự vật trong transcript S1 + colophon hình của ván thử · bảo đảm bởi: AC-3 (lời S1 buộc thứ tự) + phiên ván thử
- Thước: feature không chạm UI 0 cờ · số từ: đầu ra lint trên hồ sơ không-UI trong ván · bảo đảm bởi: AC-10

## Out of scope

- KHÔNG có phép đo máy nào cho đặc tả UX trong vòng này. Sau 5 vòng nghiệm thu, mọi cánh dò-chữ trên markdown đều sinh lỗi cùng lớp «thước tự dối» (vòng 5: một dòng ví dụ trong khối mã ở thân hợp đồng tắt được cờ). Owner quyết cắt trọn 24/08 — hạt giống `docs/plans/2026-08-24-hat-giong-khop-vong-dac-ta-ux.md` giữ đề bài + 4 điều kiện mở lại.
- Người duyệt soi đặc tả UX bằng mắt tại Cổng 1 cùng ba artifact — đó là chốt chặn của vòng này, không phải lưới máy.
- Không skill mới, không vendor skill ngoài (ux-flow-designer, wireframe-skill, rampstack, heuristics) — vay hình dạng/tên, không vay mã.
- Không đưa sơ đồ/wireframe vào chuỗi bằng chứng — hình là chiếu của khuôn; S4 vẫn đo DOM thật.
- Không đụng `scripts/pre-merge-check.sh`, `hooks/**`, `lib/**` — giữ T2.
- Không bắt hồ sơ/workspace/consumer cũ migrate — đường đọc-cũ W8 im lặng khi không opt-in.
- Không tree test / người thật ở S1 — thuộc Cổng Giá trị của feature dùng khuôn.
- Không thay bước phân kỳ / nấc phản ứng — thuộc ô `design-pass-nac-khong-dong-bo`; ô này chỉ cấp NGUỒN cho bước đó.

## Notes

- Giới hạn đã khai (24/08, sau 5 vòng): vòng này giao VẬT và LỜI, không giao
  lưới. Máy không tự kiểm được feature chạm UI đã điền đặc tả UX chưa — người
  duyệt soi tại Cổng 1. Ngưỡng «khớp vòng 100%» của hồ sơ cơ hội KHÔNG có số ở
  ván thử này, có lý do và con trỏ tới hạt giống.
- Sổ hạn chế `docs/research/known-limits-ledger.tsv` giữ vết từng lỗi của 5
  vòng: cái nào đã đóng, cái nào theo hạt giống.
