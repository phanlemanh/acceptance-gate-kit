# Hạt giống — bộ đọc Thẻ việc chưa đi một vòng với khuôn bên viết

Gốc: acceptance-gate-kit/_acceptance/khoi-khuon-tren-the-cong/ — Cổng Bằng chứng 04/11 của vòng `khoi-khuon-tren-the-cong`
(hàng KH2): người ký chọn «mở hợp đồng mới» cho Ngoài-14 của `review-findings.md`; ô cơ hội của hồ sơ trích lại tên tệp
này. Ghi hạt giống, không mở ô (luật «ô chỉ mở khi có neo ngoài»).

## Người dùng gặp gì

- **Ngoài-14 — đổi tên một trường của khuôn Thẻ việc thì thẻ im lặng in «chưa điền».** Bộ đọc `docTheViec` trong
  `scripts/ban-do-khuon.cjs` chỉ được kiểm bằng fixture viết tay đúng khuôn bên đọc. Không ca nào rút khối
  `UX-SPEC-TEMPLATE` (`skills/acceptance/references/ux-spec-template.md`) rồi cho bộ đọc đọc lại. Ai đổi tên một trường ở
  khuôn mà không sửa bộ đọc thì mọi hồ sơ sinh từ khuôn thật hiện «Thẻ việc: chưa điền» trên thẻ Cổng Phạm vi, còn bộ kiểm
  vẫn xanh.

## Hướng

- Ca round-trip: rút khối `UX-SPEC-TEMPLATE` từ tệp khuôn, điền giá trị mẫu vào năm trường, đưa vào `docTheViec`, đòi đủ
  năm cặp nhãn–giá trị (mẫu: `OOC-ITEM-TEMPLATE` + ca P55). Chiều đỏ: đổi tên một trường trong bản sao khuôn thì ca đỏ đúng
  trường ấy.
- Cân nhắc rút danh sách tên trường (`TRUONG_THE_VIEC`) từ chính khối khuôn thay vì chép tay, để bên viết và bên đọc chung
  một nguồn.

## Vì sao chưa làm

Mục nằm ngoài tám tiêu chí đã duyệt ở Cổng Phạm vi 03/11, và hôm nay khuôn chưa đổi nên chưa hồ sơ nào bị ảnh hưởng. Neo
ngoài để mở ô: một lần đổi khuôn `UX-SPEC-TEMPLATE`, hoặc một kho nhận thấy «Thẻ việc: chưa điền» trên hồ sơ đã điền đủ.
