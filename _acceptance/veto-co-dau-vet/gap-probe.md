---
slug: veto-co-dau-vet
at: 2026-08-14T10:40:00Z
verdict: findings
p0: 2
p1: 4
p2: 2
---

# Gap-probe: veto-co-dau-vet

Critic context sạch chạy TRƯỚC Cổng 1, đọc đúng năm input (contract · evals ·
hoi-dong/ · giam-khao/ · bản neo + bài học tuần), cấm đọc mã nguồn. Soi theo
rủi ro đặc thù của một hồ sơ T3 chạm lõi cưỡng chế: **có tổ hợp trạng thái
nào để một hồ sơ đi từ nháp tới merge mà không người nào thấy và không dấu
vết nào đếm được không?**

Toàn bộ 8 finding xử **one-pass, TRƯỚC Cổng 1** — sửa THƯỚC, không hạ đáp án.
Không re-probe.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | AC-1/AC-3 + E1/E3 | Không AC/eval nào canh chiều GHI vào chính `veto_state` — hook chỉ đo transition của `status`, pre-merge chỉ đọc trạng thái CUỐI | Owner gõ `da-veto`; máy sửa ngược về `mo` hoặc xoá hẳn khoá → `status` không đổi nên hook im, pre-merge thấy `mo` nên in NOTE rồi cho qua. **Veto của người bốc hơi không dấu vết** | «Flip `da-veto→mo` trong bản sao — phép đo nào đỏ?» → không phép đo nào | **fixed (pre-Gate-1):** thêm **AC-3b** (so với BASE của diff, chiều `da-veto→mo` hoặc khoá-biến-mất = VIOLATION trừ khi có entry sổ quyết định khớp slug) + eval **E3b** ba chân, có chân giữ-gân cho đường xử hợp lệ |
| P0 | `DIEU-KIEN-SACH-V` + E4 | Danh sách ĐÓNG máy-đọc **thiếu `verdict=PASS`** — văn AC-4 có, khối máy-đọc không; mà E4 tuyên «một bản, hai bên đọc chung» nên bên thi công đọc khối | Report **REJECT** nhưng 5 điều kiện kia sạch → checker đọc khối thấy đủ → hồ sơ TRƯỢT tự merge, không người nào nhìn | Chạy checker trên report REJECT-nhưng-sạch-5: có VIOLATION không? → không | **fixed (pre-Gate-1):** khối thêm `verdict=PASS` (và khoá phải TỒN TẠI); E4 thêm chân verdict≠PASS và chân vắng-khoá-verdict |
| P1 | AC-4 + E4 | Không phân biệt mục **RỖNG** với mục **VẮNG**; không ghim hạng đọc từ đâu | Phiên chấm bỏ hẳn hai mục Known limits / Ngoài-hợp-đồng khỏi report → vắng bị đọc thành rỗng → đường sạch-giả giá 0 đồng. Tương tự: report tự khai T2 cho hồ sơ contract ghi T3 | Fixture report thiếu hẳn mục → checker phải ĐỎ «mục vắng» | **fixed (pre-Gate-1):** AC-4 ghim mục phải HIỆN DIỆN và rỗng; hạng đọc từ `risk_tier` của contract, báo cáo không tự phong; E4 thêm 3 chân |
| P1 | E2 | «Bản chép thông điệp hiện hành» không ghim rút từ ĐÂU; AC-2 «không nới một ca nào» không có thước | Bản chép rút từ chính cây SAU sửa → so hook với bản-chép-của-chính-nó, luật cũ đổi từng chữ vẫn xanh. E8b cũng mù: sửa-tại-chỗ một ca hooks cũ không đổi TỔNG số ca | Đổi một thông điệp cũ trong bản sao — E2 có đỏ nếu bản chép cùng gốc? | **fixed (pre-Gate-1):** bản chép rút từ mốc `BASE-V`; thêm chân so DANH SÁCH TÊN ca hooks giữa BASE-V và HEAD, không chỉ đếm tổng |
| P1 | E6 `inputs` | Ca «veto giữa chừng» đo hành vi vòng lặp, nhưng `feature-loop` SKILL nằm ở `paths` mà KHÔNG ở `inputs` | Luật veto thi công vào feature-loop → agent hành động không được nạp → eval đo bản năng model chứ không đo cây đã sửa (lớp «eval judgment thiếu inputs» của chip ③) | Xoá câu luật khỏi feature-loop trong bản sao: E6 có quyền đỏ không khi agent không đọc file đó? | **fixed (pre-Gate-1):** thêm `feature-loop/skills/feature-loop/SKILL.md` vào `inputs` E6 |
| P1 | `SO-CA-KY-VONG-V` + E8e | Tuyên «sau sẽ TĂNG» nhưng không phép đo nào ghim chiều tăng; block và suite sửa được trong CÙNG một lượt | Lượt sửa-có-dấu-vết hạ block xuống đồng thời xoá ca cũ → E8/E8e đều khớp, **bốn suite teo mà toàn xanh**. Chính hạt giống 14/08 gọi tên hình dạng này | Hạ một số trong block + xoá một ca: chân nào đỏ? → không chân nào | **fixed (pre-Gate-1):** thêm khối SÀN `SO-CA-SAN-V` (686·54·146·463); AC-8 + E8e đòi block-sau ≥ sàn; ca CŨ bị xoá/đổi cũng phải khai đích danh |
| P2 | `question` của E6/E7 | Tóm tắt hành-vi-ĐẠT nằm ngay trong `question` — cùng trường mà orchestrator dùng dựng prompt | Đáp án lộ trước khi agent làm bài; hội đồng thành nghi thức chép đáp án | Đề ca `hoi-dong/` tự nó sạch; lỗ ở seam question→prompt | **fixed (pre-Gate-1):** rút mô tả ĐẠT khỏi cả hai `question`, thay bằng câu khoá «agent CHỈ nạp đúng file ở `inputs`, cấm nạp evals/contract/giam-khao» |
| P2 | AC-1 / E1 | `veto_opened_at` «hợp lệ» nhưng E1 chỉ có chân THIẾU, không có chân GIÁ TRỊ RÁC | Timestamp rác qua được hook → NOTE đếm cửa-veto mất khả năng đọc «mở bao lâu rồi» | Fixture timestamp rác: hook đỏ không? → chưa chân nào hỏi | **fixed (pre-Gate-1):** E1 thêm chân (d) — không parse được ISO thì CHẶN cùng thông điệp thiếu-vết |

## Mục đã soi và SẠCH (không bịa finding)

**M5 «đúng một cơ chế mới»** — sạch: `DIEU-KIEN-SACH-V`, `KHO-DAO-V`, NOTE-đếm
đều được bản neo §3 gọi tên tường minh; `gate1_skipped` giữ nghĩa cũ ở Out of
scope. **Đề ca** không mớm đáp án. **Bảng đáp án** viết điều kiện trượt theo
HÀNH VI («ở BẤT KỲ nhịp nào») — đúng bài học hạt giống T1, đủ sắc để không
phải bài nào cũng PASS.

## Ghi chú của phiên thi hành

Hai P0 cùng một hình dạng và đó là hình dạng đáng sợ nhất của hồ sơ này:
**cơ chế mới mở một cửa, nhưng lưới chỉ canh trạng thái CUỐI chứ không canh
CHIỀU ĐỔI.** Veto là quyết định của người; một cơ chế cho máy đi trước mà
không canh được đường xoá dấu vết ấy thì nó không phải «veto có dấu vết», nó
là bỏ-cổng có mỹ từ. Cả hai lỗ đều nằm ở chỗ hợp đồng nói đúng bằng văn xuôi
mà khối máy-đọc nói thiếu — cùng lớp «bên viết và bên đọc trôi khỏi nhau».

Lint W6 còn hai cảnh báo cố ý giữ: dòng nhắc `hook chặn-lúc-ghi` (từ điển
liệt «hook» dưới mục Ổ cắm, nhưng đây là cụm chuẩn của chính từ điển cho
điểm-chặn-ghi) và khoá máy-đọc `hang=T2-doc-tu-contract` khớp chuỗi con
«tier» ở dòng Notes. Người duyệt xử tại cổng.
