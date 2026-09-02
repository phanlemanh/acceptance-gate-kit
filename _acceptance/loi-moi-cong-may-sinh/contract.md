---
schema_version: 1
feature: Lời mời cổng thành vật máy sinh — thẻ in câu gộp khuyến nghị bấm được, khối VIỆC-CỦA-ANH chỉ chứa điều-chỉ-người-biết, vá các đường fail-quiet của thẻ
slug: loi-moi-cong-may-sinh
owner: manh.phan@onemount.com
risk_tier: T3               # chạm lib/out-of-contract.js (t3_paths) — lõi cưỡng chế đọc hồ sơ
surfaces: [cli]
status: approved
design_doc: docs/superpowers/specs/2026-09-02-loi-moi-cong-may-sinh-design.md
approved_by: Manh Phan
approved_at: 2026-09-02T00:58:38Z
---

# Acceptance Contract: loi-moi-cong-may-sinh

## Context

Vòng meta duy nhất cửa sổ 2.6→2.7, owner «gọi tên» 01/09 sau ba findings cùng
ngày. Vật: `scripts/gate-card.js` · `lib/out-of-contract.js` ·
`commands/acceptance-card.md` · khối GATE-ONESHOT-GRAMMAR trong
`skills/acceptance/references/human-facing-language.md` (+ hai bản chép
approve/signoff theo nếp một-nguồn). Ô nguồn:
`_acceptance/loi-moi-cong-may-sinh/opportunity.md` (decided/build, bảy vá).

## Criteria

- AC-1: Given hồ sơ đủ điều kiện trình cổng, When dựng thẻ với `--extract` cho TỪNG cổng (Cổng 1 lẫn Cổng 2 — hai ngữ pháp khác nhau), Then JSON có khoá `one_shot` là MỘT dòng lệnh: mở đầu bằng tên lệnh plugin ĐẦY ĐỦ rút từ hằng có marker `ONE-SHOT-CMD` (không gõ literal ở chỗ render), mọi ô có khuyến nghị máy được điền sẵn nguyên văn, và TẬP chỗ trống `___` bằng ĐÚNG tập {ô loại-5 không có khuyến nghị} ∪ {chữ quyết định} — không thừa, không thiếu (đẳng thức tập, không phải «duy nhất một»).
- AC-2: Given cùng hồ sơ, When render thẻ HTML, Then khối «VIỆC CỦA ANH» chứa đúng chuỗi `one_shot` của `--extract` (round-trip HTML↔extract, không hai nguồn).
- AC-3: Given hồ sơ có gap-probe findings đã định đoạt + review-findings, When dựng thẻ Cổng 2, Then thẻ có khối «PHÁN QUYẾT ĐỐI KHÁNG» mang verdict + p0/p1/p2 + đếm disposition, VÀ số Ô HỎI trong «VIỆC CỦA ANH» bằng đúng số mục loại-5 (mục xác-nhận-cắt/hoãn và Treo-không-khó-đảo thành dòng báo, không thành ô hỏi), VÀ mục KHÔNG khớp hàng nào của bảng ánh xạ render thành Ô HỎI — hàng mặc định của bảng là loại-5, đoán về phía rơi-về-người, không về phía nuốt-quyết-định.
- AC-4: Given `gap-probe.md` ở BẤT KỲ trạng thái nào ngoài {parse được ∧ verdict thuộc tập đã khai} — verdict `probe-failed`, vắng trong repo khai `gap_probe: required`, hoặc file CÓ MẶT nhưng không đọc được (frontmatter vỡ, verdict token lạ) — When dựng thẻ Cổng 1, Then hiện khối rơi-bậc «đối kháng không chạy được — phần vượt-nhận-thức rơi về anh», và `one_shot` KHÔNG điền sẵn ô nào. Đảo chiều mặc định: không-đọc-được = rơi bậc, không phải đi tiếp.
- AC-5: Given `review-findings.md` có mục «Ngoài hợp đồng» mang nội dung văn xuôi mà bộ đọc parse ra 0 finding, When dựng thẻ, Then cờ vàng `suspect_empty` hiện và gọi tên khuôn `OOC-ITEM-TEMPLATE`; đối chứng dương: mục đúng khuôn → KHÔNG cờ.
- AC-6: Given finding có trường Đề xuất mang token ngoài {known-limits, new-contract, wont-fix}, When dựng thẻ, Then in «đề xuất không đọc được: '<nguyên văn>'» kèm ba token hợp lệ — KHÔNG in «máy chưa đề xuất hướng nào»; token hợp lệ render như hiện hành.
- AC-7: Given fixture rút round-trip từ CHÍNH contract đã ký của release-2-5-0 và release-2-6-0, When dựng thẻ Cổng 1, Then các AC có chữ «không» ở GIỮA vế Then (sau dấu phẩy/chấm phẩy đầu tiên) nằm cột «SẼ làm», và chỉ AC có MỆNH ĐỀ ĐẦU của vế Then mang từ chối/chặn nằm cột «KHÔNG làm» — owner chọn «mệnh-đề-đầu» tại Gate 1.5 (02/09) trên số đo 566 AC thật: cột chặn 251→109, giữ trọn ca chặn thật, 8 AC hai bản phát hành đều về «SẼ làm».
- AC-8: Given hai nguồn danh tính (`git config user.name`, `signoff.approvers`) khớp tuyệt đối một-ứng-viên, When đọc khối GATE-ONESHOT-GRAMMAR ở nguồn và hai bản chép trong approve/signoff, Then cả ba khai cùng một luật «ghi thẳng + hiển thị lại, không chờ xác nhận» cho ca đó và giữ echo-trước cho mọi ca khác. *Hành vi hội thoại của phiên là lời luật, không có harness test — Known limits.*

## Coverage

- Trục A · bề mặt lời mời (one_shot | khối VIỆC-CỦA-ANH | khối đối kháng | rơi bậc) [thước CE: extract + round-trip HTML] → AC-1..AC-4. Trục B · đường fail-quiet của bộ đọc (OOC rỗng-ngờ | token lạ | cột SẼ/KHÔNG) [thước CE: fixture code-sinh + đối chứng dương] → AC-5..AC-7. Trục C · luật ngữ pháp một-nguồn [thước CE: răng đồng bộ nguồn-bản-chép hiện có] → AC-8. Ô «phân loại sai loại-5 thành loại-1» phủ bởi AC-3 (đếm ô hỏi) + lưới khó-đảo trong luật (không đo máy được chủ đích người — Known limits).

## Đường đo

- Lượt gọi người/vòng ≤3 (phát hành ≤1) · 0 ngoài thiết kế · 1 chạm/lượt — số từ ba-dòng-số của mốc phát hành KẾ TIẾP (đếm tay theo luật (c)); AC bảo đảm đường sinh: AC-1/AC-2 (câu gộp tồn tại và bấm được), AC-3 (ô hỏi = loại-5). Không có phiên đo riêng trong vòng này.
- Giả định sinh tử 3 của ô (cờ vàng không đỏ oan trên xưởng thật): đo bằng E11 — quét bộ dựng thẻ lên TRỌN `_acceptance/*` hiện có, đếm cờ vàng MỚI theo loại; danh sách hồ sơ phát sinh cờ phải được ĐỊNH ĐOẠT từng dòng trong evidence (thật-sai-khuôn / cờ oan), cờ oan = trượt AC-5/AC-6.

## Out of scope

- Đổi hook/pre-merge/recheck — t3 chỉ chạm `lib/out-of-contract.js`; ngữ nghĩa chữ ký (ADR 0002) nguyên vẹn.
- Bộ phân loại ngữ nghĩa — ánh xạ loại theo nguồn dữ liệu cấu trúc (bảng đóng trong design), không NLP.
- Lấy lại làn thẻ Cổng Đáng (cây ghim `528caaa8` giữ nguyên ở ô).
- Nhịp đóng-cửa-veto theo mốc (N2 rà soát) — nếp mốc phát hành, không phải mã thẻ; và bộ đếm chạm bằng máy — ô riêng.
