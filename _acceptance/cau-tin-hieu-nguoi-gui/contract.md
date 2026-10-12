---
schema_version: 1
feature: Người gửi tín hiệu ở phòng ban đọc được tín hiệu của mình đang ở đâu bằng một câu tiếng sản phẩm — tên nhóm, việc đã thành, đã giao ngày nào; không mã việc, không tên hồ sơ, không từ nội bộ
slug: cau-tin-hieu-nguoi-gui
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/tin-hieu.mjs + khuôn tín hiệu + tài liệu khối dữ liệu (đoạn tin_hieu) + skill gom + CONTEXT + test — không chạm lib/**, hooks/**, scripts/lo-trinh.mjs, dieu-phoi/**, lưới trước-gộp
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-12-cau-tin-hieu-nguoi-gui-design.md
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: cau-tin-hieu-nguoi-gui

## Context

Cổng Đáng 12/10 ký build T2 (owner «Làm», chữ ký CỘNG). crm hiện nguyên văn câu đường đi của kit cho người
phòng ban ở trang «Tín hiệu đã gửi»; đo 12/10: 5/7 câu mang mã việc, tên hồ sơ hay chữ nội bộ (E14 của
crm). Vòng này thêm câu cho người gửi bên cạnh câu cũ, một phép kiểm câu máy giữ, và luật đọc lùi cho
bản vẽ cũ. Bảng câu, nguồn từng chỗ trống, bảng tình trạng, phép kiểm: design doc §3–§6.

## Criteria

- AC-1: Given kho thử do mã sinh, tín hiệu dựng từ khối `TIN-HIEU-MAU` của khuôn, có tín hiệu ở đủ bảy chỗ (chưa gom · lẻ · đã phủ · nhóm chưa thành việc · để sau · thành việc chưa có hồ sơ · thành việc có hồ sơ đã ký) cộng một tín hiệu «đã phủ» bởi việc chưa giao, hồ sơ đã ký mang bản chép NGUYÊN VĂN một báo cáo bằng chứng đã ký thật của kit, When chạy `--duong`, Then mỗi bản ghi có `cau_nguoi_gui` bằng đúng bảng câu viết sẵn trong ca (bảng nguyên văn design §3) — tên nhóm lấy từ bản gom, câu giao của việc lấy từ tệp lộ trình đã bỏ một cặp «», câu giao của việc phủ lấy từ `feature` của hợp đồng, ngày bằng ngày rút độc lập từ chữ ký của báo cáo thật, in `n/t/năm` — và không câu nào chứa id tín hiệu, mã nhóm, mã việc hay tên hồ sơ của kho thử.
- AC-2: Given cùng kho thử và bản base = cây đang kiểm chép trọn (`scripts lib skills dieu-phoi`) với RIÊNG `scripts/tin-hieu.mjs` lấy từ `294b29db` (2.27), When chạy `--duong` bằng hai bản, Then mỗi bản ghi của bản mới bỏ trường `cau_nguoi_gui` bằng đúng bản ghi của bản base (cả `cau`, cùng thứ tự khoá) và `TRUONG_DUONG` bằng danh sách trường base cộng `cau_nguoi_gui` ở cuối; ca im: bản base có `scripts/lo-trinh.mjs` bị đổi cách vẽ trang (giả lập một PR khác gộp vào) vẫn so xanh.
- AC-3: Given ma trận toàn phần mọi chữ trạng thái — mọi ô `SECTIONS` của bản đồ sản phẩm, «Chưa mở», «Không suy được» và một chữ lạ — When dựng cụm tình trạng, Then mỗi chữ có đúng một cụm theo bảng design §4 và nhóm của cụm bằng nhóm tiến độ khối dữ liệu tính cho chữ ấy; trong kho thử có việc ở ba nhóm (đã giao · đang làm · chưa bắt đầu), cụm trong câu của mỗi việc khớp `nhom_trang_thai` của chính việc ấy trong khối `lo-trinh-du-lieu` vẽ từ cùng kho; bản sao bản đồ thêm một ô mà bảng chưa có cụm → ca đỏ nêu tên ô.
- AC-4: Given kho thử thiếu dữ liệu ở từng chỗ trống {việc không có câu giao · việc phủ không có `feature` · việc đã giao không có chữ ký người · việc phủ đã giao không có chữ ký người · lẻ không lý do · để sau không lý do}, When chạy `--duong`, Then câu của mỗi ca bằng câu nguyên văn trong bảng design §3 và không câu nào chứa `undefined`, `null`, cặp nháy rỗng `""`, hay dấu `:` / `—` treo ở cuối câu.
- AC-5: Given kho thử dữ liệu sạch, When chạy `--cau`, Then thoát 0 và in đúng một dòng tóm tắt nêu số câu, số mã đã kiểm và số mã bỏ qua kèm lý do; trên ma trận đỏ viết sẵn {tên nhóm chứa id tín hiệu · tên nhóm chứa tên hồ sơ · lý do lẻ chứa mã nhóm · câu giao của việc chứa mã việc khác · câu giao của việc phủ chứa tên hồ sơ} mỗi ca thoát 1 với đúng một dòng lỗi nêu id tín hiệu, mã lọt và nguyên câu; ca im: câu giao «… quý 4» khi kho có việc mã «4» → thoát 0, và mã «4» được đếm vào số bỏ qua; hồ sơ đã giao có chữ ký người mà không đọc được ngày → thoát 1, dòng lỗi nêu hồ sơ và nguyên giá trị chữ ký; mọi lượt `--cau` để băm cây trước bằng sau và `git status --porcelain` rỗng.
- AC-6: Given khối `TIN-HIEU-CAU-CAM` của khuôn tín hiệu, When chạy `--cau`, Then từ thường của khối trong lý do lẻ → thoát 1, dòng lỗi nêu từ và nguyên câu; từ thường viết ở dạng tổ hợp (NFD) trong lý do → vẫn thoát 1; từ `(khung)` của khối nằm trong câu giao của việc («hồ sơ khách hàng») → thoát 0; bản sao khuôn câu của kit chèn «hồ sơ» vào phần kit viết — cả vào khung câu lẫn vào một cụm tình trạng — → câu đang xanh thành đỏ nêu câu; bản sao khối cấm thêm một từ đang có trong phần kit viết → số câu đỏ bằng đúng số câu có từ ấy trong phần kit viết (chính sách đọc từ khuôn, không ghi cứng trong mã); khối vắng hoặc không kê từ nào → thoát 2 nêu tên khối.
- AC-7: Given trang lộ trình vẽ từ kho thử khai cửa tín hiệu, When đọc bản ghi tín hiệu bằng bộ đọc mẫu `cauChoNguoiGui`, Then trên trang mới nó trả `cau_nguoi_gui` và không cờ; trên bản sao trang đã gỡ trường `cau_nguoi_gui` khỏi mọi bản ghi (bản vẽ cũ) nó trả `cau` cũ kèm đúng một cờ vàng nêu «bản vẽ cũ»; bản chép rời của `docDuLieu` đọc hai trang giữ nguyên mảng `tin_hieu` của từng trang và cảnh báo hai trang giống hệt nhau; khối `LO-TRINH-DU-LIEU-TUY-CHON` của tài liệu khối dữ liệu kê đúng các trường của `TRUONG_DUONG` (kể cả `cau_nguoi_gui`) và đoạn khoá `tin_hieu` nêu luật đọc lùi kèm cờ vàng.
- AC-8: Given `skills/gom-tin-hieu/SKILL.md`, When chạy NGUYÊN VĂN khối lệnh `GOM-CAU` trên kho thử (gốc gói như harness thay), Then thoát 0 trên kho sạch và 1 trên kho có tên nhóm lọt mã; khối đứng sau `GOM-RANG` và trước bước chuyển cắt lượt; SKILL nói tên nhóm và lý do hiện nguyên văn cho người gửi.
- AC-9: Given bản sao crm dựng bằng `git archive` ở `06e34d26c38426e2e23cbf1a51bc612cccb405c9` (lộ trình, hồ sơ, khai cửa tín hiệu thật) có tín hiệu mẫu của kit nối vào việc thật ở mọi nhóm tiến độ crm đang có và vào một hồ sơ đã giao thật, When chạy `rang/do-crm.mjs`, Then `--cau` của bản sao thoát 0, câu của mỗi việc chứa đúng câu giao thật của việc ấy (đã bỏ «»), câu của tín hiệu phủ bởi hồ sơ đã giao thật mang « ngày n/t/năm» bằng ngày rút độc lập từ chữ ký trong báo cáo crm, tệp `mau/cau-mau.json` đã commit bằng đúng bản sinh lại từ kho thử và bản sao; trên CÙNG bản sao đổi một tên nhóm thành chuỗi chứa một tên hồ sơ crm thật → `--cau` thoát 1 nêu câu; kho crm vắng → thoát 2 nêu đường.
- AC-10: (judgment) Given `mau/cau-mau.json` — câu cho người gửi của bảy chỗ trên kho thử và trên bản sao crm, When một người gửi ở phòng ban không dùng git đọc từng câu, Then mỗi câu nói được tín hiệu của họ đang ở đâu (đã vào nhóm nào, thành việc gì, đã giao chưa và ngày nào nếu có) mà không có mã việc, tên hồ sơ, hay chữ của quy trình bên trong.

## Coverage

Quét bằng `morphological-scan` (preset test-matrix; đối tượng = câu cho người gửi của một tín hiệu). Chân
sản phẩm: bảy câu E14 của crm `[SUY-TỪ-REPO: crm/_acceptance/gui-tin-hieu-trong-crm/evidence/cau-kit-mau.json]`,
bảng khuôn câu L3 `[SUY-TỪ-REPO: scripts/tin-hieu.mjs]`, lộ trình thật crm có mã chỉ chữ số và một chữ cái
`[SUY-TỪ-REPO: crm docs/plan/lo-trinh-okr.json @06e34d26c]`. Chân ngành: `[NGÀNH: Canny — trạng thái bài
gửi hiện cho người bầu bằng chữ sản phẩm (Under Review · Planned · In Progress · Complete · Closed), không
mã nội bộ]`.

- Trục A — chỗ của tín hiệu: chưa gom | lẻ | đã phủ | nhóm chưa thành việc | để sau | thành việc chưa có hồ sơ | thành việc có hồ sơ  [thước CE: bảy chỗ của bảng `CAU` + bảy câu E14] → AC-1, AC-4
- Trục B — nguồn chữ trong câu: phần kit viết | tên nhóm | lý do | câu giao của việc | câu giao của việc phủ | ngày; mỗi nguồn: sạch | thiếu | lọt mã | có từ cấm | có chữ sản phẩm trùng từ nội bộ  [thước CE: E14 crm + dữ liệu thật crm] → AC-1, AC-4, AC-5, AC-6, AC-9
- Trục C — tình trạng việc: mọi ô bản đồ sản phẩm | «Chưa mở» | «Không suy được» | chữ lạ  [thước CE: `SECTIONS` + nhóm tiến độ của khối dữ liệu] → AC-3
- Trục D — bên đọc: bộ đọc mới trên bản vẽ mới | bộ đọc mới trên bản vẽ cũ | bộ đọc cũ chỉ biết `cau` | bản chép `docDuLieu` | kho không khai cửa  [thước CE: luật «đổi schema có đường đọc-cũ» của kho + ca TH-8] → AC-2, AC-7; kho không khai cửa: ca TH-2 của hồ sơ `cua-tin-hieu-gom-nhom` giữ, vòng này không đổi đường đó
- Cross-cutting: chỉ đọc · tất định · tiếng Việt có dấu, cả dạng tổ hợp (NFC khi so) · mã giống chữ thường (chỉ chữ số, một chữ cái) → AC-5, AC-6, AC-9; skill gom chạy phép kiểm → AC-8; đọc được với người thật → AC-10.
- Later: mã viết tự do ngoài bộ mã kho (vd mã một phát hiện) · câu tiếng Anh · mục «Tín hiệu» trên trang lộ trình của kit.
- Never: kit soạn câu bằng mô hình · sửa câu cũ tại chỗ · crm tự dịch câu của kit.

## Đường đo

- E14 của crm qua PASS trên câu mới · số từ: crm chạy lại E14 sau khi nhận 2.28 và đổi chỗ đọc sang `cau_nguoi_gui` · không AC (đo ở kho tiêu thụ, đọc ở Cổng Giá trị).
- 0 câu cho người gửi lọt ở lượt xếp nhóm thật đầu tiên của crm · số từ: `tin-hieu.mjs --cau` trên kho crm sau lượt gom · AC-5, AC-6, AC-8.

## Out of scope

- Sửa mã crm đọc trường mới và chạy lại E14 — việc của crm trong PR #374 sau khi nhận mốc.
- Sửa `scripts/lo-trinh.mjs` (kể cả `docDuLieu`), `dieu-phoi/**`, khuôn tín hiệu hay khuôn yêu cầu của gói Điều phối.
- Câu tiếng Anh; mục «Tín hiệu» trên trang lộ trình của kit.
- Bắt mã viết tự do không thuộc bộ mã của kho.
- Đổi chữ trạng thái của trang lộ trình (trang của chủ kho).

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ca đo: `tests/scripts/tin-hieu.test.mjs`, mã ca `CN-…` (ca `TH-…` của hồ sơ L3 không đổi); executor
  `executors.test.tin_hieu_cau` + `executors.script.cau_crm` thêm ở S3. Kho thử do mã sinh trong lượt.
- Mốc: 2.28 (crm định nhận từ 15/10). crm phải đổi một chỗ đọc (`apps/app/lib/tin-hieu/trang-thai.ts`, một
  hàm, bảy nhánh) sang `cau_nguoi_gui` trong PR #374.
- Tệp chung: `skills/acceptance/references/lo-trinh-du-lieu.md` và `_acceptance/config.yaml` cũng nằm trong
  PR #324/#325 — vòng này chỉ sửa đoạn khoá `tin_hieu` và thêm khoá executor cạnh `tin_hieu_vang`.
