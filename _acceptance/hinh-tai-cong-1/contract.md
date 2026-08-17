---
schema_version: 1
feature: Hình tại Cổng 1 — máy tự kê điểm quyết định, đếm ngưỡng N5, giao vẽ, nhìn, đính cùng thẻ; người không phải gõ thêm lượt để có hình
slug: hinh-tai-cong-1
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: implemented
approved_by: ""
approved_at: ""
veto_state: mo
veto_opened_at: 2026-08-17T04:30:55Z
---

# Acceptance Contract: hinh-tai-cong-1

## Context

Phiên thật 17/08 (repo `media-library`, T3): Cổng 1 trình thẻ đúng kịch bản, không
một hình nào; owner gõ thêm hai lượt thì máy mới tự chấm ra 5 điểm vượt ngưỡng N5
trên chính thẻ đó và vẽ. Nguyên nhân là lỗ của kit: câu luật về hình
(`LOOP-PICTURE-CLAUSE`) trong vòng lặp chỉ được chép ở mục S2 — PLAN; mục GATE 1
không có câu nào về hình, không có bước đếm ngưỡng. Luật được nạp mà không có
chỗ thi hành.

Phạm vi = hàng 1: chỉ sửa mục GATE 1 của `feature-loop/skills/feature-loop/SKILL.md`
+ phép đo. Không đụng bộ dựng thẻ. Design:
`docs/superpowers/specs/2026-08-17-hinh-tai-cong-1-design.md`.

Source input: hội thoại owner 17/08 (ba lượt: soi phiên · UX tự suy · «mở vòng vá
Gate 1 phạm vi hàng 1») + transcript phiên `Acceptance gate start`.

## Criteria

- AC-1: Given mục `## GATE 1` của bản vòng lặp và khối `### Hình tại điểm quyết định` bên trong nó (heading con cố định, rút từ nó tới heading `##`/`###` kế — không tìm chuỗi toàn file), When rút thân khối giữa cặp marker `LOOP-PICTURE-CLAUSE` trong bản luật rồi gộp mọi chuỗi khoảng trắng/xuống dòng thành một dấu cách ở CẢ hai bên, Then câu-về-hình xuất hiện NGUYÊN VĂN trong khối — câu về hình vẫn có đúng một nguồn, GATE 1 là chỗ chép thêm.
- AC-2: Given khối `### Hình tại điểm quyết định`, When tìm năm nhãn có số cố định `[1] Kê` · `[2] Đếm` · `[3] Vẽ` · `[4] Nhìn` · `[5] Đính` (phân biệt hoa-thường) và chuỗi `figures/index.md`, Then đủ năm nhãn với chỉ số xuất hiện tăng dần, và đường `_acceptance/<slug>/figures/index.md` có mặt ở bước đếm.
- AC-3: Given khối về hình, When tìm bốn cụm nguồn điểm quyết định `entry ledger chờ seal` · `lệch spec/plan gốc` · `[GIẢ ĐỊNH]` · `human-gate1` và cụm `không hỏi người`, Then cả năm cụm có mặt trong bước kê — máy kê từ artifact sẵn có.
- AC-4: Given khối về hình tách thành câu, When tìm câu chứa đồng thời `T3`, `T2 không đủ` và `dừng chờ người`, và câu chứa đồng thời `xanh-sạch` và `bỏ qua`, Then cả hai câu có mặt — năm bước chỉ chạy khi cổng thật sự dừng chờ người.
- AC-5: Given khối về hình, When tìm `subagent tươi`, `diagram-design`, `figures/index.md`, và câu chứa đồng thời `skill vắng`, `mermaid`, `không chặn`, Then cả bốn có mặt — vòng chính giao agent đọc đề bài + nguồn từ đĩa mà vẽ, và có đường đi tiếp khi thiếu bộ khuôn.
- AC-6: Given khối về hình đã cắt dòng câu-về-hình, When tìm câu chứa đồng thời `vòng chính`, `Read`, `.png`, cùng các cụm `MỘT lần`, `CÙNG một lượt`, `dưới ngưỡng`, `0 điểm vượt`, Then tất cả có mặt — hình được nhìn thật trước khi đính, thẻ và hình đi cùng lượt, điểm chưa vẽ vẫn để lại số đếm.
- AC-7: Given khối về hình, When tìm câu chứa đồng thời `draft`, `figures/`, `không vẽ lại`, Then câu có mặt — resume vào hồ sơ đã có hình thì dùng lại.
- AC-8: Given suite `tests/plugins` và ma trận needle→đột biến viết trước (mỗi needle một lượt gỡ CHỈ trong khối; bản sao needle chép ra ngoài khối nhưng còn trong mục GATE 1 vẫn phải ĐỎ), When chạy case mới P197 trên bản nguyên vẹn rồi lần lượt trên từng đột biến — xoá clause khỏi khối (S2 giữ) · đổi MỘT từ trong clause ở khối · hoán vị hai nhãn bước · gỡ `figures/index.md` · gỡ từng nguồn kê · gỡ câu điều kiện · gỡ câu skill vắng · gỡ câu Read .png · gỡ cụm `dưới ngưỡng` · gỡ câu dùng lại — và chạy hàm check kiểu P90 (clause có mặt bất kỳ đâu trong file) trên đột biến xoá-clause-khỏi-khối, Then bản nguyên vẹn XANH; mỗi đột biến ĐỎ ghim đúng thông điệp theo thứ tự: "GATE 1: cau ve hinh lech khuon mot-nguon" (cả hai đột biến clause) · "GATE 1: nam buoc sai thu tu" · "GATE 1: thieu dau vet dem" · "GATE 1: thieu nguon <cụm>" · "GATE 1: thieu dieu kien dung-nguoi" · "GATE 1: thieu duong skill vang" · "GATE 1: thieu buoc nhin" · "GATE 1: thieu dong duoi-nguong" · "GATE 1: thieu duong dung lai figures"; và hàm check kiểu P90 vẫn XANH — chứng minh phép đo mới neo vào khối.
- AC-9: Given bản vòng lặp sau khi sửa (chép thân câu, giữ nguyên bộ marker), When chạy toàn suite `tests/plugins`, Then mọi case đang có (kể cả P90 và P93 đếm cặp marker) vẫn XANH và số cặp `LOOP-PICTURE-CLAUSE` toàn cây vẫn đúng một.

## Coverage

Quét bằng `morphological-scan` (5 trục, xem design §0 và tin quét trong phiên):

- Trục A — khi bước chạy: T3 | T2-không-đủ | T2-xanh-sạch (Never) | resume `draft` [thước CE: bảng state machine của SKILL.md] → AC-4, AC-7
- Trục B — nguồn điểm quyết định: ledger chờ seal | lệch spec/plan | `[GIẢ ĐỊNH]` Coverage | `human-gate1` gap-probe [thước CE: danh sách artifact S1#4/#7] → AC-3
- Trục C — kết quả đếm: vượt→vẽ | dưới→ghi số | không có điểm [thước CE: định nghĩa ngưỡng N5 trong bản luật] → AC-2, AC-6
- Trục D — hoàn cảnh vẽ: skill có | vắng | hình hỏng một lần [thước CE: `DECISION-DRAW-MECHANISMS`] → AC-5, AC-6
- Trục E — đính lên mặt phẳng: gửi cùng thẻ (Core) | chỉ nêu đường dẫn (Never) | nhúng vào card (Later — hàng 2) [thước CE: `DECISION-DIAGRAM-SURFACES`] → AC-6
- Cross-cutting: một nguồn câu-về-hình (AC-1, AC-9); phép đo neo vào mục kèm đột biến (AC-8)
- Chân ngành: `[NGÀNH: C4 model — hình phục vụ mức quyết định]`, `[NGÀNH: Google design-doc — sơ đồ ngữ cảnh đứng trước văn xuôi]` — làm ứng viên, không phải fact.

## Out of scope

- **Nhúng hình vào `card.html` / sửa `gate-card.js`** — hàng 2, cần đường đọc-cũ + cờ vàng; làm sau khi đo một vòng máy có tự đếm không (entry `revisit`).
- **Đo hành vi thật lúc chạy** (máy có đếm đúng số bước không) — chưa có phép đo máy cho phán đoán ngữ nghĩa; đo bằng vòng pilot kế tiếp.
- **Sửa `commands/approve.md`, `commands/acceptance-card.md`, bản luật, `DIAGRAM-RULE.md`** — không cần cho hàng 1.
- **Vẽ cho Cổng 2 / Gate 1.5** — Gate 1.5 đã có clause ở S2; Cổng 2 để vòng sau nếu vòng pilot cho thấy cần.

> Out of scope = scope-truth (Gate 1 duyệt mục này).

## Notes

(Known limits — điền tại Cổng 2.)
