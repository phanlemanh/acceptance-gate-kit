---
schema_version: 1
feature: Thước nhãn-đè-khối cho diagram-design
slug: thuoc-nhan-de-khoi
risk_tier: T2
surfaces: [scripts, docs]
status: implemented
veto_state: mo
veto_opened_at: 2026-08-27T03:16:00Z
owner: manh@mstar.vn
---

# Acceptance contract — thước nhãn-đè-khối

Luật «nhãn không bị che» của diagram-design hiện chỉ sống ở văn xuôi §6/§9 —
ô không đỏ được. Hồ sơ này cho nó một chiều đỏ chạy được, và sửa 3 ca hỏng
đã ship làm bằng chứng thước cắn thật.

Mốc bất biến: `BASE-TNK = 848adc9233b54a5755c4be2f49af8a01902f75f0` — bản
trước-sửa, 3 ca hỏng còn nguyên. Đối chứng đỏ neo vào mốc này, KHÔNG neo
origin/main (sau merge hai đầu cùng sạch là phép đo tự chết).

## Acceptance criteria

- **AC-1 — thước sinh ra kèm hai chiều.** Given fixture SVG do code sinh trong
  chính lần chạy (một nhãn có mask + một khối), When chạy
  `check_label_occlusion.py` trên bản lành, Then exit 0; When chạy trên bản đã
  tiêm (chèn rect đục ≥60×28 SAU mask nhãn, lệnh tiêm phải chứng minh đã đổi
  nội dung file), Then exit 1 và stdout nêu tên nhãn bị che + tên file; And
  Given fixture có `<g transform="scale(…)">` chứa nhãn bị che, When chạy
  thước, Then cây con đó bỏ qua CÓ TIẾNG — stdout/stderr chứa dòng WARN nêu
  tên file (giới hạn khai không được câm).
- **AC-2 — bắt đúng 3 ca thật.** Given bản `kien-truc-ho-so-la-truc.svg` và
  `trang-thai-ho-so.svg` rút từ mốc `BASE-TNK` bằng `git show`, When chạy
  thước, Then exit 1 và stdout nêu đủ đúng 3 nhãn: `GHI STATUS`,
  `HÌNH ĐÍNH THẺ`, `S5 GIAO`.
- **AC-3 — 3 nhãn được sửa mà không bị xoá.** Given cây làm việc sau sửa, When
  chạy thước trên toàn bộ `docs/reference/figures/*.svg` và `*.html`, Then
  exit 0; And ba chuỗi nhãn `GHI STATUS` / `HÌNH ĐÍNH THẺ` / `S5 GIAO` vẫn
  tồn tại trong nguồn `.html` lẫn `.svg` tương ứng VÀ cả ba nằm trong danh
  sách nhãn THƯỚC PHÁT HIỆN ĐƯỢC (`--list`) của bản đã sửa — chứng thước còn
  đang canh chúng (sửa bằng dời, không phải bằng xoá nhãn hay xoá mask; xoá
  mask làm nhãn vô hình với thước là đường lách bị chặn đích danh).
- **AC-4 — không báo oan khối trong suốt.** Given fixture code-sinh có rect
  `fill="none"` VÀ rect `fill-opacity="0.3"` vẽ sau mask nhãn, When chạy
  thước, Then exit 0; When cũng fixture đó thêm một rect đục, Then exit 1 —
  cặp cô lập đúng lớp fill trên CÙNG fixture.
- **AC-5 — html inline-svg được kiểm như svg.** Given fixture `.html` code-sinh
  chứa 2 khối `<svg>`, khối thứ hai có nhãn bị che, When chạy thước, Then
  exit 1 và thông điệp trỏ đúng nhãn đó; bản lành của cùng fixture → exit 0.
- **AC-6 — lưới thường trực cắn được.** Given case
  `tests/scripts/label-occlusion.test.mjs` được `tests/scripts/run-tests.sh`
  gọi, When chạy suite, Then case chấm `docs/reference/figures/` xanh trên cây
  đã sửa VÀ case mutant code-sinh trong lần chạy đó đỏ đúng thông điệp ghim;
  And tổng số nhãn thước phát hiện trên `docs/reference/figures/` ≥ SÀN đếm
  thật lúc viết case (khai trong case là sàn, không phải hằng — chặn «xanh vì
  thước mù toàn phần» khi skill đổi khuôn xuất); mọi đường dẫn trong case suy
  từ vị trí file test, không hardcode ROOT.
- **AC-7 — taste gate và sổ vendor có vết.** Given SKILL.md của skill
  diagram-design, When đọc section §9 checklist Technical, Then có đúng một
  mục trỏ tên `check_label_occlusion.py` và file đó tồn tại trong `scripts/`
  của skill; And LOCAL-PATCHES.md có entry mới đánh số cho bản vá này.
- **AC-8 — vùng ngoài lưới được quét một lần, không sửa.** Given thước đã có,
  When quét `_acceptance/*/figures/*.{svg,html}` + assets vendored
  `assets/example-*.html`, Then kết quả (số file quét, số ca, danh sách nếu
  có) nằm trong `_acceptance/thuoc-nhan-de-khoi/evidence/quet-vung-ngoai.md`;
  And diff của hồ sơ này KHÔNG chạm file nào trong hai vùng đó.

## Coverage

Trục từ morphological-scan 2026-08-27 (chân sản phẩm: kiểm kê repo
`[SUY-TỪ-REPO: docs/reference/figures/ 8 svg + 8 html · _acceptance/*/figures/
8 svg + 13 html · diagram-design/skills/diagram-design/assets/ 147 html]`;
chân ngành: `[NGÀNH: archify]` — validator có check label_route_clearance +
edge-through-node cùng vai, và `check_overflow.py` nội bộ làm khuôn giọng):

- **Đối tượng file:** svg thuần (AC-1..4, 6) | html inline-svg (AC-5, 8) |
  png → Never, đo ở nguồn vector.
- **Vùng:** docs/reference/figures — lưới thường trực (AC-3, AC-6) | hồ sơ đã
  ký + vendored — quét report-only (AC-8) | hình tương lai — qua móc §9 (AC-7).
- **Lớp lỗi thước (cross-cutting, áp mọi phép đo):** đối chứng dương cùng
  fixture (AC-1, 4, 5, 6) · fixture code-sinh trong lần chạy, không viết tay
  (AC-1, 4, 5, 6) · mốc bất biến thay origin/main (AC-2) · đường dẫn suy từ vị
  trí script (AC-6) · false-positive fill (AC-4) · giới hạn khai trong
  docstring: nhãn không-mask, scale/rotate, foreignObject (kiểm bằng mắt khi
  review, không có AC riêng — phủ định phổ quát trên văn xuôi không grep được).

## Out of scope

- Sửa hình trong hồ sơ `_acceptance/*/figures` đã ký, sửa assets vendored —
  report-only (entry descope trong sổ quyết định).
- Đo nhãn không có mask, transform scale/rotate/matrix, foreignObject, PNG —
  giới hạn khai, cùng nếp "WHAT THIS CANNOT SEE" của check_overflow.py.
- Cắm `scripts/pre-merge-check.sh` (đường T3) — suite tests/scripts đủ răng.
- Đổi câu chữ luật §6 của SKILL.md.

## Notes

- Nếp răng hồ sơ: các chân đo sống ở
  `_acceptance/thuoc-nhan-de-khoi/rang.sh`, executor key `tnk_rang_*` trong
  config — không vào suite vĩnh viễn (AC-2 neo BASE-TNK sẽ đỏ oan trên PR
  tương lai nếu nằm suite); riêng case AC-6 là lưới vĩnh viễn vì fixture
  code-sinh mỗi lần chạy, không neo mốc.
