---
schema_version: 1
feature: Bước chấm khuôn đọc đúng thuộc tính thẻ có hàm mũi tên, và lượt chấm dừng khi tệp bản đồ khuôn hỏng làm mất nhóm
slug: doc-jsx-va-ban-do-hong
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: implemented
design_doc: _acceptance/doc-jsx-va-ban-do-hong/design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-11-10T07:04:28Z
---

# Acceptance Contract: doc-jsx-va-ban-do-hong

## Context

Hai lỗi có sẵn của lưới khuôn, chủ kho chọn «mở hợp đồng mới» ở Cổng Bằng chứng 2026-11-10 (Ngoài-4, Ngoài-5 của hồ sơ
`t3-can-ho-so-arm`): màn viết đúng khuôn bị báo thiếu khe còn màn thiếu thật lọt qua, và tệp bản đồ hỏng làm nhóm biến mất
khỏi lưới mà không ai hay. Thiết kế: design doc ở frontmatter.

Source input: prompt (phiên điều phối, trỏ `_acceptance/t3-can-ho-so-arm/review-findings.md`)

Thuật ngữ:
- **bước chấm** = `node scripts/design-floor-khuon.mjs --kiem --root <kho> --base <ref>`.
- **sinh tham số** = `node feature-loop/scripts/s4-args.mjs` (lưới khuôn của nó).
- **bộ máy gốc** = `git archive c8fa5a65588609b622dc83a9b114d65d2bdc5b47 scripts lib feature-loop skills` bung trong lượt — bản trước vá.
- **kho mẫu** = kho git tạm do ca đo dựng trong lượt bằng `tests/scripts/khuon-loi-kho-mau.mjs`, tên tệp và khối giả.
- **lỗi mất nhóm** = tệp bản đồ không có frontmatter, YAML không đọc được, frontmatter không phải mapping, hoặc thiếu khoá
  `nhan_dien`.

## Criteria

- AC-1: Given kho mẫu có nhóm đòi khe `title` và `children`, và một nhánh thêm tệp chứa đúng một thẻ
  `<K onClose={() => dong()} title="x" />`, When bộ máy gốc và cây đang kiểm cùng chạy bước chấm, Then bộ máy gốc thoát 1 với
  dòng báo thiếu khe `title` và không có dòng thiếu khe `children`, còn cây đang kiểm thoát 1 với dòng báo thiếu khe
  `children` và không có dòng thiếu khe `title`.
- AC-2: Given bảng 32 dạng thẻ viết sẵn trong E2 (dạng × có con hay tự đóng × vị trí khe × hằng khe thiếu), When bộ đọc xét từng
  hàng, Then danh sách khe thiếu của mỗi hàng đúng bằng hằng viết sẵn, và mỗi nhánh bỏ qua của bộ quét có một nhát tiêm riêng
  làm đỏ đúng hàng của nó.
- AC-3: Given thẻ có spread cấp thẻ đứng sau hàm mũi tên, và thẻ chỉ có spread nằm trong giá trị `style={{...s}}`, When bộ đọc
  xét, Then hàng đầu vào nhóm «thẻ mang spread» và không báo lệch, hàng sau không vào nhóm đó và vẫn được chấm khe.
- AC-4: Given thẻ mở không có dấu đóng trước hết tệp, hoặc ngoặc nhọn không có ngoặc khớp tới hết tệp, When bước chấm chạy trên kho mẫu, Then bước chấm
  thoát 0, tệp không có dòng thiếu khe, có dòng không đo được ghi «thẻ không đọc được», và không được đếm theo khuôn.
- AC-5: Given các thẻ không có dấu `>` trong giá trị (khe đủ, thiếu khe, tự đóng, khe trần), When bộ máy gốc và cây đang kiểm
  chạy bước chấm trên cùng kho mẫu, Then đầu ra và mã thoát bằng hệt nhau và có ít nhất một dòng báo (phép so không rỗng).
- AC-6: Given kho mẫu có nhóm `rieng` mà tệp bản đồ mắc từng lỗi mất nhóm (bốn hàng), When sinh tham số chạy trên hồ sơ chạm
  vùng của nhóm ấy mà thiếu eval khuôn, và trên hồ sơ không chạm vùng nào, Then cả tám ô thoát 2, không sinh tệp, stderr gọi tên
  đúng tệp bản đồ và lý do của hàng ấy, không phải thông điệp «chạm vùng nhóm»; đối chứng trên bộ máy gốc: bản đồ lành và hồ sơ
  chạm vùng thiếu eval thì thoát 2 nêu nhóm `rieng`, bản đồ hỏng thì thoát 0 và có tệp.
- AC-7: Given kho mẫu có một tệp bản đồ mắc lỗi không làm mất nhóm (ngoại lệ trỏ tệp không có, màn mẫu không có, ngoại lệ thiếu
  lý do), When sinh tham số chạy, Then trên hồ sơ không chạm vùng nhóm: thoát 0, có tệp, mỗi lỗi đúng một dòng stderr; trên hồ sơ
  chạm vùng có eval khuôn: thoát 0, có tệp, và bước chấm thật thoát 1 có dòng «sai:» mang đúng lý do; trên hồ sơ chạm vùng thiếu
  eval khuôn: thoát 2 với thông điệp lưới có sẵn; Given bản đồ lành, Then không có dòng báo bản đồ nào.
- AC-8: Given kho mẫu có một tệp bản đồ hỏng và kho không có `design/patterns/`, When CLI `--json` của bộ đọc và sinh tham số
  chạy, Then JSON bằng hệt bộ máy gốc (không thêm khoá) và kho không khai bản đồ vẫn sinh tệp, không dòng báo.

## Coverage

Quét hình thái preset test-matrix. Chân sản phẩm [SUY-TỪ-REPO: scripts/ban-do-khuon.cjs, feature-loop/scripts/s4-args.mjs];
chân ngành [NGÀNH: đặc tả cú pháp JSX của TypeScript] — thước đủ của trục A là các dạng thuộc tính JSX hợp lệ.

Trục A dạng giá trị thuộc tính · B kết thúc thẻ · C vị trí khe · D loại lỗi bản đồ · E vòng có chạm nhóm không.

- A{mũi tên, mũi tên chứa thẻ tự đóng, so sánh, chia, chuỗi chứa ngoặc, chuỗi mẫu lồng, JSX lồng có nháy, biểu thức chính quy, chú
  thích, tham số kiểu, nhiều dòng} × B{có con, tự đóng} × C{trước, sau, trong biểu thức con, trong chuỗi, vắng} → AC-1, AC-2. Ô
  bỏ: B và C của các dạng chỉ khác nhau ở bước bỏ qua giá trị, bảng E2 giữ một đại diện cho mỗi nhánh bỏ qua.
- A{spread cấp thẻ, spread trong giá trị} → AC-3. B{không có dấu đóng, ngoặc hụt} → AC-4.
- A{không có dấu lớn hơn trong giá trị} × B × C → AC-5 (đối chứng bằng hệt bộ máy gốc).
- D{không frontmatter, YAML hỏng, không mapping, thiếu nhan_dien} × E{chạm thiếu eval, không chạm} → AC-6.
- D{ngoại lệ trỏ tệp vắng, màn mẫu vắng, thiếu lý do} × E{không chạm, chạm có eval, chạm thiếu eval} → AC-7. D{bản đồ lành, không có bản đồ} → AC-7, AC-8.
- Never: thẻ nêu trong chú thích hay chuỗi của tệp; tên kiểu trùng tên thẻ.

## Out of scope

- Phân biệt tên kiểu TypeScript trùng tên thẻ (`useRef<Khung>()`) — lỗi khác, có từ trước.
- Bỏ qua thẻ nêu trong chú thích hay chuỗi của tệp nguồn.
- Thẻ Cổng Bằng chứng (`theCong2`) khi bản đồ hỏng — `s4-args` đã dừng trước khi tới đó.
- Chặn lượt chấm vì lỗi bản đồ không làm mất nhóm.
- Mã không biên dịch được có ngoặc nhọn hụt mà phía sau trong tệp còn `}` khớp nó: bộ quét đọc theo ngoặc khớp, không phát hiện hụt.
- Dấu nháy trong văn bản JSX lồng trong biểu thức, đứng sau khoảng trắng, có cặp trên cùng dòng và bọc một ngoặc lệch: bộ quét đọc
  là chuỗi nên có thể đọc sai khe của thẻ đó. Hiếm, và sửa đúng cần bộ phân tích cú pháp thật.

## Notes
