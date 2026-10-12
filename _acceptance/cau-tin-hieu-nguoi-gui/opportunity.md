---
schema_version: 1
slug: cau-tin-hieu-nguoi-gui
feature: Người gửi tín hiệu ở phòng ban đọc được tín hiệu của mình đang ở đâu bằng một câu tiếng sản phẩm — tên nhóm, việc đã thành, đã giao ngày nào; không mã việc, không tên hồ sơ, không từ nội bộ
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

> Mở 12/10 theo lệnh phiên điều phối máy MacBook Pro, không từ hàng lộ trình kit (lộ trình kit không có
> hàng cho việc này; ô mang neo ngoài ở crm). Vật của vòng là phần kit viết trong khối dữ liệu lộ trình —
> khoá `tin_hieu` do hồ sơ `cua-tin-hieu-gom-nhom` (hàng L3, mốc 2.27.0) giao.

## Vấn đề & ai gặp

Gốc: crm/_acceptance/gui-tin-hieu-trong-crm — báo cáo bằng chứng trên nhánh `feat/gui-tin-hieu-trong-crm` (PR phanlemanh/crm-onehub#374, đỉnh `06e34d26c`), mục E14: cả ba giám khảo đề xuất FAIL vì câu của kit hiện nguyên văn ở dòng «Có trong bản vẽ» của trang «Tín hiệu đã gửi» mang mã việc, tên hồ sơ và chữ nội bộ; tệp đo `evidence/cau-kit-mau.json` cùng hồ sơ.

**Người gặp:** nhân viên và trưởng phòng ban dùng CRM từ 14/10 — phần lớn không dùng git, không biết
mã việc hay hồ sơ là gì. Họ bấm «Gửi tín hiệu», rồi mở «Tín hiệu đã gửi» để biết ý của mình đi tới đâu.
Sau khi đội sản phẩm xếp nhóm, dòng phụ của mỗi tín hiệu là câu kit viết — CRM hiện nguyên văn, không tự
suy (đúng luật «kit vẽ, kho không soạn lại»).

**Đo 12/10 trên dữ liệu thật** — bảy câu kit sinh cho bảy chỗ của một tín hiệu (`cau-kit-mau.json`, lấy
từ kit `origin/main` `f59d9547`):

| Chỗ của tín hiệu | Câu kit viết hôm nay | Người phòng ban vấp ở đâu |
|---|---|---|
| tới sau lần xếp nhóm gần nhất | «chưa gom — tín hiệu tới sau lượt gom gần nhất» | «gom», «lượt gom» là chữ của quy trình bên trong |
| không xếp vào nhóm | «lẻ — lời cảm ơn, không đòi thay đổi gì» | «lẻ» là tên ngăn trong bản gom |
| đã có việc làm xong phủ | «đã có việc đã giao: giao-x (Đã giao)» | `giao-x` là tên thư mục hồ sơ, không phải tên việc |
| vào nhóm, chưa thành việc | «vào nhóm Trưởng phòng ban thấy số tuần trước — nhóm chưa thành việc» | đọc được |
| vào nhóm, để sau | «vào nhóm Nhân viên căn chỉnh OKR với phòng khác — để sau: chờ chu kỳ quý I» | đọc được |
| thành việc, chưa bắt đầu | «vào nhóm Nhân viên tìm được quy trình → việc H3: Chưa mở» | `H3` là mã hàng kế hoạch |
| thành việc, đã có hồ sơ | «vào nhóm Trưởng phòng ban biết việc của phòng mình → việc H5 → hồ sơ viec-h5: Đã giao» | `H5`, `viec-h5`, chữ «hồ sơ» |

**5/7 câu** có chỗ người phòng ban không hiểu; ba giám khảo của crm nêu đúng bốn trong năm (không nêu
«lẻ»). Dữ liệu để viết câu sạch ĐÃ CÓ trong kho lúc vẽ: tên nhóm (bản gom), câu giao của việc (tệp lộ
trình — khối dữ liệu đã mang `hang.cau_giao`), câu giao của hồ sơ phủ (`feature` của hợp đồng), ngày mốc
gần nhất của hồ sơ (dải tóm tắt — `moi_nguoi.ngay`). Mã kit chỉ đang dựng câu từ mã thay vì từ chữ.

**Chỗ đọc bên crm:** một hàm, bảy nhánh, mỗi nhánh đọc nguyên văn trường `cau` (`apps/app/lib/tin-hieu/trang-thai.ts`
trên nhánh PR #374). crm ghi Known limit cho mục này phía mình; sửa thuộc kit.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Mọi chữ cần cho câu người gửi đã có trong kho lúc vẽ (tên nhóm · câu giao của việc · câu giao của hồ sơ phủ · ngày) — không thêm tệp đầu vào, không hỏi ai | câu phải soạn → kit thành nơi soạn | đọc bộ vẽ đường đi và khối dữ liệu hiện có | **Đã thử** — bốn nguồn đều đọc được bằng hàm sẵn có (bảng trên) |
| 2 | Tên nhóm và lý do do phiên gom viết có thể lọt mã — câu khuôn sạch vẫn ra câu bẩn | crm hiện mã dù kit đã sửa khuôn | răng của cửa tín hiệu kiểm câu người gửi trên dữ liệu thật, đỏ nêu đúng câu | Chưa thử — đo trong vòng |
| 3 | crm đổi đúng một chỗ đọc (một hàm, bảy nhánh) sang trường mới, giữ trường cũ làm đường lui | trang crm vẫn hiện câu cũ sau khi nhận 2.28 | đã đọc mã crm trên nhánh PR #374 | **Đã đọc** — việc của crm trong chính PR #374, trước khi gộp |
| 4 | Câu khuôn đọc được với người phòng ban (vai: người gửi không dùng git) | E14 của crm lại FAIL | hội đồng giám khảo vai người gửi đọc đúng bảy câu sinh từ kho mẫu, cùng bảy chỗ E14 đã đọc | Chưa thử — đo ở S4 |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: sau khi crm nhận mốc mang vòng này, người phòng ban có đọc câu trạng thái tín hiệu mà không vấp chữ máy không?
- Kết quả nào là SỐNG: eval E14 của crm chạy lại trên câu kit mới (crm đọc trường mới) ra PASS, và ở lượt xếp nhóm thật đầu tiên của crm (tín hiệu phòng ban từ 14/10), răng của cửa tín hiệu báo 0 câu người gửi lọt mã hay từ cấm.
- Kết quả nào là CHẾT: crm đã nhận mốc mà trang «Tín hiệu đã gửi» vẫn hiện mã việc, tên hồ sơ hay từ cấm khi hết timebox. Giữa hai ngưỡng (E14 PASS nhưng chưa có lượt xếp nhóm thật) → lặp.
- Timebox: 2026-11-01 (mốc kế sau đợt thử, cùng L3).

## Kết quả prototype

Không dựng prototype — vật là một trường dữ liệu và một phép kiểm; câu mẫu bảy chỗ trình ở Cổng Phạm vi.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Bộ vẽ đường đi tín hiệu | `scripts/tin-hieu.mjs` (hồ sơ `cua-tin-hieu-gom-nhom`, L3) | mã của kit | có — sửa tại chỗ | — |
| Khối dữ liệu lộ trình | `scripts/lo-trinh.mjs` (khoá `tin_hieu`), `skills/acceptance/references/lo-trinh-du-lieu.md` | mã của kit; PR #324 và #325 đang chờ gộp cùng chạm hai tệp này | `lo-trinh.mjs`: không đụng (khoá đã nhận nguyên mảng); tài liệu: chỉ đoạn khoá `tin_hieu`, khác đoạn hai PR sửa — báo phiên điều phối trước khi đụng | — |
| Câu đo của crm | `crm/_acceptance/gui-tin-hieu-trong-crm/evidence/cau-kit-mau.json`, E14 | dữ liệu đo | có — chỉ đọc; bản sao crm dựng bằng `git archive` ở ca đo | — |

## Cổng 0

- **decision = …** Căn cứ: …
- **disposition = …** Căn cứ: — (không prototype)
- **Ngưỡng UAT chốt cùng lúc ký:** bốn dòng của mục «Ngưỡng chết / ngưỡng UAT».

**Máy khuyến nghị lúc mời ký:** `build`, hạng **T2**, **một vòng**, mục tiêu mốc **2.28** (crm định nhận
từ 15/10). Hạng: vật ở `scripts/tin-hieu.mjs`, khuôn tín hiệu, tài liệu khối dữ liệu, test — không chạm
`lib/**`, `hooks/**`, cổng chặn gộp, `dieu-phoi/`, `scripts/lo-trinh.mjs`. Cỡ: dự kiến 9 tiêu chí (bảng
dưới) — trong khoảng 8–12 của chính sách cỡ vòng.

**Hình dạng sửa — thêm trường, không sửa trường cũ.** Khối dữ liệu mang thêm câu cho người gửi (trường
mới); câu cũ giữ nguyên từng byte và được ghi lại đúng tên: câu cho chủ kho, có mã để lần. Mã máy đọc
(mã nhóm, mã việc, tên hồ sơ) đã là trường riêng — không đổi. Hai lối máy đã loại:
- *Sửa thẳng câu cũ* — crm không phải sửa mã, nhưng đổi nghĩa một trường đã phát hành ở 2.27 dưới chân
  mọi bộ đọc; luật 26/09: đổi mặc định là mọi kho trả giá.
- *crm tự dịch câu* — crm phải tách câu của kit ra lại thành mã: hai nguồn trôi khỏi nhau, đúng lớp lỗi
  của Known limit «Ngoài-1» crm vừa ghi.

Đường lui cho bản vẽ cũ: bộ đọc mẫu của khối dữ liệu báo một cờ vàng khi tín hiệu thiếu câu cho người
gửi (bản vẽ bằng kit cũ), và tài liệu ghi cách đọc lùi về câu cũ.

**CỘNG** (thêm một trường dữ liệu và một phép kiểm câu) — chữ «Làm» ở đây là chữ ký đích danh của luật
CỘNG. Trace: nguyên tố 2 (câu cho người do máy giữ bất biến «không mã, không từ cấm» thay vì dặn bằng
lời); người hưởng: người gửi tín hiệu ở phòng ban (đọc được), chủ kho crm (E14 khỏi FAIL mà không viết lớp
dịch). Kho không khai cửa tín hiệu: không đổi byte nào (luật 26/09).

## Thước đo thành công → ứng viên criterion

1. Mỗi bản ghi đường đi có câu cho người gửi, đúng bảng câu viết sẵn cho bảy chỗ — tên nhóm, câu giao của
   việc, câu giao của hồ sơ phủ, ngày lấy từ dữ liệu.
2. Câu cũ giữ nguyên từng byte; kho không khai cửa tín hiệu vẽ giống từng byte bản trước.
3. Câu cho người gửi không chứa mã nào của chính kho (mã tín hiệu, mã nhóm, mã việc, tên hồ sơ) — kiểm
   quan hệ trên ma trận đủ bảy chỗ, không đoán bằng mẫu chữ.
4. Danh sách từ cấm sống MỘT chỗ có marker; câu chứa từ cấm → đỏ nêu đúng câu; bản sao khuôn thêm từ cấm
   làm câu đang xanh thành đỏ.
5. Răng của cửa tín hiệu đỏ khi dữ liệu (tên nhóm, lý do, câu giao) làm câu người gửi lọt mã hay từ cấm —
   nêu tín hiệu, câu, chữ lọt; dữ liệu sạch → xanh.
6. Trạng thái trong câu bằng đúng nhóm tiến độ của chính việc ấy trong khối dữ liệu vẽ từ cùng kho.
7. Thiếu dữ liệu (việc chưa có câu giao, hồ sơ phủ không có câu giao, chưa có ngày) → câu vẫn không mã,
   nói «chưa có …» có tên.
8. Tài liệu khối dữ liệu kê trường mới khớp đúng trường của mã; bộ đọc mẫu cờ vàng khi bản vẽ thiếu câu
   cho người gửi, cảnh báo của trang không khai cửa không đổi.
9. (judgment, vai người gửi ở phòng ban) Trên kho mẫu của kit và bản sao crm: bảy câu đọc được, không vấp
   chữ máy.

## Out of scope từ khám phá

- **Sửa mã crm đọc trường mới, chạy lại E14** — việc của crm trong PR #374 sau khi nhận mốc.
- **Trang lộ trình của kit hiện mục «Tín hiệu»** — Later của L3, không neo.
- **Dịch câu sang tiếng Anh** — crm chọn giao diện tiếng Anh ở Ngoài-2 (phía crm); kit chỉ viết tiếng Việt cho tới khi một kho có neo.
- **Đổi khuôn tín hiệu hay khuôn yêu cầu của gói Điều phối** — máy M5 giữ; vòng này chỉ đổi câu hiển thị.
- **Chữ trạng thái của trang lộ trình** («Chờ duyệt phạm vi», «Sắp mở vòng»…) — trang của chủ kho, giữ nguyên; câu người gửi dùng nhóm tiến độ, không dùng chữ ấy.
