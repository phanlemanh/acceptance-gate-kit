---
schema_version: 1
feature: Bước chấm khuôn hiểu mục ngoai_le không có khoi là tệp rời nhóm — tệp ấy không thuộc nhóm, nên không bị chấm lệch hay nợ cũ theo nhóm ấy
slug: ban-do-khuon-roi-nhom
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: implemented
design_doc: _acceptance/ban-do-khuon-roi-nhom/design.md
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-11-03T09:46:18Z
---

# Acceptance Contract: ban-do-khuon-roi-nhom

## Context

Bản vá V0 cho mốc kế sau 2.37.0. Gốc: `onehub-quy-hang/_acceptance/ban-do-khuon-nhom-da-co/` (đã ký) — kho thứ hai khai
nhóm trang tạm phủ mọi trang và cho màn thật rời nhóm bằng mục `ngoai_le` không `khoi`; bộ chấm của kit bỏ qua mục ấy và
báo oan 10 lệch, 6 nợ cũ trên bản sao kho (finding 03/11 §5.2). Chủ kho quyết «Cắt trước»: 2.37.0 cắt như đang có, vá ở
mốc kế. Thiết kế: design doc ở frontmatter.

Thuật ngữ:
- **bộ đọc** = `scripts/ban-do-khuon.cjs` (hàm `docBanDo`, `nhomCuaTep`, CLI `--root <kho> --json`).
- **bước chấm** = `node scripts/design-floor-khuon.mjs --kiem --root <kho> --base <ref>`.
- **mục rời nhóm** = mục `ngoai_le` có `tep` và `ly_do` mà VẮNG HẲN khoá `khoi`. `khoi:` để trống, `khoi: ""` và
  `khoi: []` không phải mục rời nhóm (giữ nghĩa cũ: không miễn gì).
- **bộ máy gốc** = `git archive eab2ca41 scripts lib feature-loop skills` bung trong lượt — bản trước vá.
- **kho mẫu rời nhóm** = kho git tạm do ca đo dựng trong lượt theo hình dạng bản đồ kho thứ hai (nhóm trang tạm glob phủ
  mọi trang, danh sách rời nhóm viết một dòng), tên tệp và tên khối giả.

## Criteria

- AC-1: Given kho mẫu rời nhóm và một nhánh có ba tệp đã khai rời nhóm trang tạm — một màn mới thuộc nhóm thật (đường
  lệch), một màn có ở base thuộc nhóm thật mà nhánh chạm (đường nợ cũ), một trang thử ẩn chỉ thuộc trang tạm (đường nợ cũ,
  thiếu khuôn) — When bộ máy gốc và cây đang kiểm cùng chạy bước chấm và CLI `--json`, Then bộ máy gốc thoát 1 và in đúng
  ba dòng viết sẵn («thuộc hai nhóm màn» ×2, «khuôn TrangTam» ×1), còn cây đang kiểm thoát 0, in 0 dòng «lệch:», 0 dòng
  «nợ cũ:», 0 dòng «sai:»; `--json` của cây in mục rời nhóm với `"khoi": null` (gốc `""`), mọi trường khác bằng hệt gốc.
- AC-2: Given kho mẫu rời nhóm, When bước chấm chạy trên mỗi hàng — tệp rời trang tạm mà dựng sai nhóm thật · tệp không
  khai bên cạnh tệp đã khai · mục rời nhóm thiếu `ly_do` · mục rời nhóm viết dạng khối nhiều dòng · cùng tệp ấy khi không
  khai (đối chứng) · tệp rời một nhóm phần tử · cùng tệp ấy khi không khai (đối chứng) · tệp rời nhóm màn duy nhất với
  `design.surface_globs` phủ nó — Then: tệp rời vẫn bị chấm đủ theo nhóm thật (khối cấm, thiếu khuôn); tệp không khai vẫn
  «thuộc hai nhóm màn»; mục thiếu `ly_do` cho dòng «sai:» ghi «rời nhóm» và không làm tệp rời nhóm; dạng khối rời nhóm như
  dạng một dòng; tệp rời nhóm phần tử không bị đòi khe của nhóm ấy (đối chứng có dòng «thiếu khe»); tệp rời nhóm màn duy
  nhất được đếm «1 tệp giao diện ngoài bản đồ».
- AC-3: Given mục `ngoai_le` CÓ khoá `khoi` viết dạng chuỗi, danh sách một dòng, danh sách khối, mapping một dòng (tệp có
  ở base), và các mục `khoi: []`, `khoi:` để trống, `khoi: ""`, When bộ máy gốc và cây đang kiểm cùng chạy bước chấm và CLI `--json` trên cùng kho, Then đầu ra
  `--kiem`, mã thoát và JSON bằng hệt nhau, và số dòng báo của mỗi hàng khớp số viết sẵn (≥1 — phép so không rỗng).
- AC-4: Given hồ sơ chỉ chạm một tệp đã khai rời nhóm duy nhất của nó và `evals.yaml` không có eval
  `config:executors.design.khuon`, When `s4-args` sinh args, Then nó thoát 0 và sinh tệp (bộ máy gốc thoát 2 nêu «chạm vùng
  nhóm trang-tam»), và thẻ Cổng Bằng chứng (`theCong2`) không cắm cờ «chưa chấm khuôn» (bộ máy gốc cắm); Given cùng hồ
  sơ chạm một tệp KHÔNG khai rời nhóm, Then `s4-args` vẫn thoát 2 nêu nhóm ấy và thẻ vẫn cắm cờ.
- AC-5: Given bản sao dùng một lần của onehub-quy-hang @`3273a44` và crm @`3ee79f16`, When `chamKho` của bộ máy gốc và của
  cây đang kiểm chạy trên cùng bản sao, Then bộ đọc của cây đếm ≥ 16 mục rời nhóm ở kho thứ hai (mười sáu tệp báo oan đều
  nằm trong danh sách rời nhóm) và 0 ở kho thứ nhất; kho thứ hai ra TRƯỚC 10 lệch · 6 nợ cũ · 65 theo khuôn → SAU 0 · 0 · 81 (base
  trước bản đồ `e7a5f2c`) và 6 · 3 · 47 → 0 · 0 · 56 (base 30 commit trước); kho thứ nhất, ở hai cấu hình `nhan_dien.tep`
  giả lập, cho lệch mới, nợ cũ, theo khuôn, không đo và ngoài bản đồ bằng hệt giữa hai bản, với tổng dòng báo > 0.
- AC-6: Given khuôn tệp `ban-do-khuon-template.md` và GUIDE §5.2, When người đọc tìm nghĩa của `ngoai_le`, Then phần lõi
  của khuôn tệp nói mục không có `khoi` là tệp rời nhóm và mục có `khoi` chỉ miễn khối ấy, kèm một khối ví dụ có marker mà
  bộ đọc của cây đọc ra đúng một mục rời nhóm (tệp ấy không thuộc nhóm) và một mục miễn khối (tệp ấy vẫn thuộc nhóm); đoạn
  «Bản đồ khuôn» của GUIDE §5.2 nói `ngoai_le` không có `khoi` là tệp rời nhóm; ở bộ máy gốc và tài liệu bản gốc, cùng phép
  kiểm đều đỏ.

## Coverage

Quét hình thái preset test-matrix. Trục A cách viết mục · B bên đọc · C đường của tệp · D chiều.

- A{không khoi} × B{bước chấm} × C{tệp mới, có ở base, chỉ thuộc trang tạm} × D{đỏ ở gốc, xanh ở cây} → AC-1.
- A{không khoi một dòng, không khoi dạng khối, không khoi thiếu ly_do} × B{bước chấm: nhóm thật, nhóm phần tử, ngoài bản
  đồ} × D{xanh, đối chứng} → AC-2.
- A{khoi chuỗi, danh sách một dòng, danh sách khối, mapping một dòng, `[]`, trống, `""`} × B{bước chấm, CLI JSON} ×
  D{bằng hệt gốc} → AC-3.
- A{không khoi} × B{lưới s4-args, cờ thẻ Cổng Bằng chứng} × D{đỏ ở gốc, xanh ở cây, đối chứng còn chặn} → AC-4.
- A{bản đồ thật hai kho} × B{chamKho} × D{số TRƯỚC/SAU viết sẵn} → AC-5.
- B{khuôn tệp, GUIDE} × D{round-trip xanh, bản gốc đỏ} → AC-6.
- Never: glob trong `ngoai_le.tep`; `khoi: []`, `khoi:` trống hay `khoi: ""` thành rời nhóm.

## Đường đo

- Thước trước phát hành (kho mẫu rời nhóm: bộ máy gốc báo đúng ba dòng, bản vá 0) — `tests/scripts/ban-do-khuon-roi-nhom.test.mjs`
  ở lượt chấm · AC-1, AC-2, AC-3 bảo đảm.
- Số SAU trên hai kho thật — `tests/scripts/ban-do-khuon-roi-nhom-hai-kho.mjs` (ca RN-5) ở lượt chấm, số chép vào
  design.md §5 · AC-5 bảo đảm.
- Thước sau phát hành (onehub-quy-hang cài mốc có bản vá, vòng giao diện đầu tiên chạm màn thật có eval khuôn xanh mà
  không đổi bản đồ) — số từ `khuon-cham.json` của hồ sơ vòng ấy ở kho thứ hai, cùng `git diff <commit cài mốc>..<commit
  của vòng> -- design/patterns/` (0 dòng đổi ở `ngoai_le` và danh sách nhóm; có dòng đổi chỉ để bước chấm im thì hồ sơ mốc
  ghi CHẾT), đọc ở hồ sơ mốc; không phải mã mới.

## Out of scope

- «Không dùng» nằm giữa dòng bị cờ vàng oan (L4 của finding 03/11) — chỉ cờ vàng, không đốt lượt chấm.
- Khoá `ngoai_le_han`, `bo_cuc` của kho thứ hai — giữ cờ vàng «khoá lạ» tới V3.
- Glob trong `ngoai_le.tep`; cờ cho mục rời nhóm trỏ tệp ngoài glob của nhóm.
- `khoi: []`, `khoi:` để trống, `khoi: ""` giữ nghĩa cũ — không miễn khối nào, không làm tệp rời nhóm.
- In một dòng «rời nhóm: <tệp>» ở `--kiem` cho tệp của vòng đã rời nhóm (lối khác của design §2 R6).

## Notes
