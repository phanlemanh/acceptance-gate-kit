# Design — Bản đặc tả UX: vật hoá tầng cấu trúc (2026-08-24)

Hồ sơ cơ hội: `_acceptance/dac-ta-ux-vat-hoa-cau-truc/opportunity.md` (ký build
23/08). Nghiên cứu nền: `discovery/nghien-cuu-skill-ux-ia-2026-08-22.md`.

## Vấn đề (một đoạn)

Feature chạm UI không có chỗ nào bắt máy khai CẤU TRÚC (luồng · màn · trạng
thái · hành vi · xuất xứ component) trước khi ai nhìn. Design-doc S1 là chữ tự
do → máy tự phán đoán, owner thấy cấu trúc lần đầu khi đã thành code — sai ở
tầng đó là làm lại gần hết. Ba lý do máy làm khung tệ: (1) đoán chay không có
đầu vào, (2) đoán xong không ai thấy sớm, (3) khai một đằng ship một nẻo không
gì đối chiếu. Thiết kế này chữa cả ba.

## Quyết định đã chốt trong brainstorm (owner 24/08)

- **Nấc phép đo: (a) CỜ tại thẻ Cổng Phạm vi (advisory)** — không chặn merge.
  Nâng lên chặn cứng là việc SAU ván thử (Later). Giữ hạng T2.
- **Bước tra mẫu vào khuôn**: mục «Khuôn IA đã chọn + căn cứ» — máy tra mẫu
  thị trường khi không tự chắc, ghi vết; căn cứ trống = nhìn thấy tại cổng.

## Kiến trúc — 5 mảnh, không skill mới, không bề mặt mới

### M1 — Khuôn tham chiếu `skills/acceptance/references/ux-spec-template.md`

File mới trong bộ khuôn của plugin (cạnh `contract-template.md`,
`opportunity-template.md`). Chứa section `## Đặc tả UX` (≤ 1 trang khi điền)
trong marker `<!-- <<<UX-SPEC-TEMPLATE -->` … `<!-- UX-SPEC-TEMPLATE>>> -->`,
gồm 6 mục:

1. **Luồng** — ba loại (suôn sẻ · biên · lỗi-và-quay-lại) + điểm vào / điểm ra.
2. **Kiểm kê màn** — bảng: màn · MỘT việc của màn · vào từ đâu / ra tới đâu.
3. **Bảng trạng thái (máy-đọc)** — trong marker con
   `<!-- <<<UX-STATE-TABLE -->`: mỗi dòng
   `| ST-<màn>-<trạng-thái> | <màn> | <hiển thị gì> | <người làm gì tiếp> |`.
   Id `ST-…` là khoá khớp vòng với evals.
4. **Hành vi** — validation, giới hạn ký tự, phím/focus, breakpoint (chỉ dòng
   nào feature này thật có).
5. **Xuất xứ component** — thang dùng → ghép → mở rộng → tạo, kèm lý do một dòng.
6. **Khuôn IA đã chọn + căn cứ** — tên khuôn (danh sách đóng trong khuôn:
   wizard · trung-tâm-toả-nhánh (hub-and-spoke) · bảng-điều-khiển
   (dashboard-first) · hội-thoại · kanban · danh-sách-chi-tiết (master-detail)
   · một-cột-cuộn) + căn cứ: đã tra mẫu gì (thang ở M5). Trống = đoán chay,
   người thấy tại cổng.

Đầu khuôn: cửa miễn — feature KHÔNG chạm UI → không điền, ghi entry `descope`
bắt đầu đúng chuỗi `"bỏ đặc-tả-UX — <lý do 1 dòng>"` (một dòng, có vết, lưới
không cờ).

### M2 — Seam máy-đọc trong `evals.yaml`

Eval máy/ui thêm field OPTIONAL `states: [ST-…]` — liệt kê trạng thái mà eval
này chứng minh. Reader duy nhất: lint W8 (M4). Thiếu field ở mọi eval + contract
không trỏ đặc tả → không áp (đường đọc-cũ).

### M3 — Con trỏ trong contract frontmatter

Key OPTIONAL `design_doc: <path tương đối repo>` — chỗ lint tìm design-doc chứa
section Đặc tả UX. S1 (M5) ghi key này khi feature chạm UI.

### M4 — Luật W8 trong `scripts/eval-coverage-lint.js` (ADVISORY — quyết (a))

Cùng đường ống với W1–W7 (chạy ở Cổng Phạm vi, cờ trên thẻ):

- **W8a (né/thiếu):** contract `surfaces` chứa `ui` mà `design_doc:` vắng /
  file không đọc được / không có bảng `UX-STATE-TABLE` → cờ
  «đặc tả UX chưa có / chưa trỏ (`design_doc:`)».
- **W8b (khai-không-đo):** `ST-x` trong bảng mà không eval nào khai
  `states:` chứa nó → cờ ghim «trạng thái <ST-x> khai trước nhưng không eval
  nào đo».
- **W8c (đo-không-khai):** eval khai `states:` chứa id không có trong bảng →
  cờ ghim «eval <id> đo trạng thái <ST-x> không có trong bảng khai trước».

**Nguồn sự thật «chạm UI» — hai tín hiệu độc lập (chống né):** W8a khoá vào
`surfaces` TỰ KHAI của contract; máy né được bằng cách bỏ `ui` khỏi surfaces.
Lỗ này KHÔNG bịt trong lint (lint không thấy diff) mà bịt bằng tín hiệu thứ
hai ĐÃ CÓ SẴN: lưới tier-mismatch của S4 (`design.surface_globs` trong config
repo tiêu thụ — diff chạm surface glob mà evals không có eval design → DỪNG).
Né trọn phải qua mặt CẢ contract tự khai LẪN config repo — hai vật hai chủ.
Giới hạn còn lại (repo chưa wire `surface_globs`) ghi vào Notes contract, là
ô của ngưỡng CHẾT «máy né bị veto» ở ván thử.

- **W8d (đoán chay):** design-doc có mục «Khuôn IA đã chọn + căn cứ» mà phần
  căn cứ trống → cờ «khuôn IA chưa có căn cứ — máy đoán chay». Cặp hai chiều
  cùng fixture: có căn cứ → 0 cờ; xoá căn cứ → cờ ghim tên mục.
- **Cánh parse (nếp W7):** dòng trong marker UX-STATE-TABLE trông như dòng
  trạng thái mà không parse được → cờ riêng, không rơi câm.

Đường dẫn suy từ repo-root đối số sẵn có của lint, không hardcode. Mọi thông
điệp ghim tên ST/eval. Contract cũ không có `design_doc` và surfaces không
`ui` → W8 im lặng (đọc-cũ, cùng nếp W6 opt-in).

### M5 — Lời S1 của `feature-loop/skills/feature-loop/SKILL.md`

- S1#4: feature chạm UI → TRƯỚC khi sinh 3 artifact, điền section `## Đặc tả
  UX` vào design-doc theo khuôn M1 (resolve reference qua resolve-plugin.mjs);
  contract ghi `design_doc:`; evals máy/ui của trạng thái khai `states:`.
  Máy điền MỘT lượt, không gọi owner.
- **Tra mẫu (trong mục 6 của khuôn):** khi máy KHÔNG tự chắc khuôn IA (cùng
  luật «≥2 hướng» của bước phân kỳ) → tra theo thang: (i) phiên có công cụ tra
  mẫu thị trường (vd MCP Mobbin) → tra luồng cùng loại, ghi vết một dòng đã
  xem gì / rút gì; (ii) không có → chọn từ danh sách khuôn IA có tên, ghi lý
  do. Không phụ thuộc công cụ nào; không tra khi luồng hiển nhiên.
- S1#6: câu «design-doc phải có dòng state-matrix» hiện tại đổi thành trỏ
  khuôn M1 (một nguồn).
- Nghi thức hình Cổng Phạm vi bước [3]: feature chạm UI → hình luồng/màn vẽ
  TỪ section Đặc tả UX (hình là chiếu của khuôn, không vẽ tay).
- Cửa miễn: entry `descope` auto-draft prefix `"bỏ đặc-tả-UX — "`.

## Chiều đỏ (measure-birth — cặp hai chiều cùng fixture, code-sinh)

Fixture RÚT TỪ WRITER: test trích section mẫu từ chính
`ux-spec-template.md` qua marker (round-trip P55) + sinh contract/evals fixture
bằng code trong lần chạy. Bản lành XANH trước; mỗi cánh một mutant: xoá 1 dòng
ST → W8b đỏ ghim; thêm `states:` lạ → W8c đỏ ghim; gỡ `design_doc:` (surfaces
ui) → W8a; phá 1 dòng bảng → cánh parse. Case vào suite `tests/scripts/` (luật
sống lâu, vào suite vĩnh viễn vì lint là vật vĩnh viễn); lời SKILL + khuôn giữ
khớp chuỗi miễn/marker bằng case `tests/plugins/`.

## Out of scope

- Không chặn merge (quyết (a)); nâng cứng = Later sau ván thử.
- Không skill mới, không vendor skill ngoài, không đưa hình vào chuỗi bằng
  chứng, không tree-test người thật ở S1 (thuộc Cổng Giá trị) — đã ký ở Cổng Đáng.
- Không đổi `pre-merge-check.sh`, `hooks/`, `lib/` (giữ T2).
- Không bắt hồ sơ/workspace cũ migrate.

## Ván thử & đường đo

Ván thử = feature chạm UI kế tiếp ở repo tiêu thụ (chung ván với ô
design-pass). Thước: làm-lại-cấu-trúc-sau-Cổng-PV = 0 · khớp vòng 100% (W8
sạch) · 100% feature UI có khuôn hoặc vết miễn · máy điền một lượt 0 gọi owner
· feature không UI 0 cờ. Timebox 2026-09-30 → park.
