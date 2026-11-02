---
schema_version: 1
feature: Bước chấm khuôn đọc đúng bản đồ thật của kho đã khai — ngoại lệ dạng danh sách được miễn, tệp dựng qua lớp trình bày đã khai được tính là theo khuôn, lời nhắc chỗ đặt glob nói đúng chỗ
slug: khuon-doc-ban-do-that
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: draft
design_doc: _acceptance/khuon-doc-ban-do-that/design.md
---

# Acceptance Contract: khuon-doc-ban-do-that

## Context

Bản vá trong mốc 2.37.0 cho vật vừa gộp của hồ sơ `khuon-loi` (PR #475). Gốc: `crm/_acceptance/khung-chung-ngan-ban-ghi/`
(BK1 đã ký) — phiên kit 02/11 cho bộ đọc đọc tệp bản đồ thật của crm và thấy ba chỗ bước chấm nói sai trên cách viết mà
khuôn tệp kit đã cho phép. Chủ kho quyết «Vá trước» khi cắt mốc. Thiết kế: design doc ở frontmatter.

Thuật ngữ:
- **bộ đọc** = `scripts/ban-do-khuon.cjs` (hàm `docBanDo`, `docThuMuc`, CLI `--root <kho> --json`).
- **bước chấm** = `node scripts/design-floor-khuon.mjs --kiem --root <kho> --base <ref>`.
- **kho mẫu hình dạng thật** = kho git tạm do ca đo dựng trong lượt theo hình dạng tệp bản đồ của kho thứ nhất (nhóm
  khai bằng sổ đăng ký kèm `nhan_dien.tep`, `khuon.lop_trinh_bay`, `thay_cho`, `cam_ho`, ngoại lệ dạng danh sách), tên
  tệp và tên khối giả.

## Criteria

- AC-1: Given mục `ngoai_le` viết theo mỗi cách khuôn tệp cho phép — `khoi` là một tên, danh sách một dòng `[A, B]`,
  danh sách khối (`khoi:` rồi `- A`, `- B`); mục là mapping khối hay mapping một dòng `{tep: …, khoi: […], ly_do: …}`;
  `ly_do` chứa dấu phẩy — và cùng nội dung viết thành các mục riêng mỗi mục một tên, When bộ đọc đọc và CLI `--json`
  in, Then mỗi cặp ra cùng bản chuẩn hoá: mỗi khối một mục, `khoi` là một chuỗi, cùng `tep` và `ly_do`.
- AC-2: Given kho mẫu có nhóm màn với ngoại lệ `khoi: [A, B]` cho tệp T dựng cả A lẫn B — hai hàng: T là tệp mới so
  với base (đường lệch), và T đã có ở base với A, B rồi nhánh chạm T (đường nợ cũ) — When bước chấm chạy, Then ở cả hai
  hàng nó thoát 0 và không in dòng «lệch:» hay «nợ cũ:» nào nhắc T · A hay T · B.
- AC-3: Given cùng hai hàng nhưng danh sách ngoại lệ chỉ còn `[A]`, When bước chấm chạy, Then hàng tệp mới thoát 1 và in
  đúng một dòng «lệch:» cho T · B, hàng tệp có ở base in đúng một dòng «nợ cũ:» cho T · B, và không hàng nào in dòng cho
  T · A.
- AC-4: Given nhóm màn khai lớp trình bày L ở `khuon.lop_trinh_bay` hay khoá cấp đầu `lop_trinh_bay`, chuỗi hay danh
  sách, hay cả hai chỗ mỗi chỗ một tên (hợp lại), và một tệp mới trong vùng nhóm dựng L mà không dựng `khuon.ten` — nhập
  theo tên gốc, `as`, mặc định hay `ns.L` — When bước chấm chạy, Then tệp ấy không có dòng «khuôn <ten>» và được đếm là
  theo khuôn; ở nhóm phần tử, thẻ L thiếu khe bắt buộc vẫn in «<ten> thiếu khe <k>».
- AC-5: Given cùng tệp dựng `<L>`, When nhóm KHÔNG khai lớp trình bày, hoặc khai một tên khác `M`, Then bước chấm thoát 1
  và in dòng lệch «khuôn <ten>» cho tệp ấy — lớp trình bày chỉ miễn đúng tên đã khai.
- AC-6: Given nhóm khai `nhan_dien` dạng sổ đăng ký không có `tep`, When bước chấm chạy và CLI `--json` in, Then dòng
  «không đo được» của nhóm và nhãn `khong_doc_duoc` đều nói «nhan_dien.tep»; Given thêm khoá cấp đầu `tep:` (đặt sai chỗ),
  When bộ đọc đọc, Then `canh_bao` có cờ nói glob tệp đặt ở `nhan_dien.tep` (không phải cờ «khoá lạ: tep» trơn) và nhóm
  vẫn không được chấm; Given glob đặt ở `nhan_dien.tep`, Then nhóm được chấm.
- AC-7: Given kho mẫu hình dạng thật và một nhánh chạm mọi tệp trong vùng nhóm (mỗi khối đã khai ngoại lệ đều có mặt ở
  đúng tệp của nó, một tệp dựng qua lớp trình bày), When bước chấm chạy, Then nó thoát 0, in 0 dòng lệch, 0 dòng nợ cũ, và
  CLI `--json` báo `sai` rỗng.

## Coverage

Quét hình thái preset test-matrix. Trục A cách viết · B chỗ đọc · C chiều.

- A{ngoại lệ một tên, danh sách một dòng, danh sách khối} × B{bộ đọc, CLI JSON} × C{xanh} → AC-1; × B{bước chấm} ×
  C{xanh, đỏ} → AC-2, AC-3.
- A{lớp trình bày lồng trong khuon, cấp đầu, chuỗi, danh sách} × B{bước chấm: dựng khuôn, khe} × C{xanh} → AC-4;
  C{đỏ: không khai, khai tên khác} → AC-5.
- A{sổ đăng ký không tep, tep cấp đầu, nhan_dien.tep} × B{bước chấm, CLI JSON, cờ vàng} → AC-6.
- Kết hợp mọi A trên một kho hình dạng thật × B{bước chấm, CLI JSON} → AC-7.
- Kho không khai bản đồ, và mọi cách viết bộ `KL-*` đã phủ → suite (`tests/scripts/khuon-loi.test.mjs` xanh nguyên).
- [NGÀNH: ESLint no-restricted-imports — mục cấm một tên hay một mảng tên cùng nghĩa].
- Never: đọc sổ đăng ký `kind`; đọc `tep` cấp đầu như glob (hai chỗ cùng nghĩa phải giữ khớp).

## Đường đo

- Thước trước phát hành (kho mẫu hình dạng thật: 0 lệch, 0 nợ cũ cho khối đã khai; gỡ một tên khỏi danh sách thì đỏ
  đúng tệp và khối) — số từ `tests/scripts/khuon-doc-ban-do-that.test.mjs` ở lượt chấm · AC-3, AC-5, AC-7 bảo đảm.
- Số SAU trên tệp thật của crm (cùng hai cấu hình của mốc gốc: glob hẹp chỉ tệp ngăn · glob cả thư mục ngăn) — chạy bộ
  đọc và bước chấm của cây đã chấm trên một bản sao dùng một lần của crm `onehub` `7341a193`, chỉ đọc, ghi số vào
  `design.md` §5 trước Cổng Bằng chứng; không commit tệp nào của crm. Không phải eval: kho crm riêng tư, không có ở CI —
  đây là đối chiếu với mốc gốc, thước thật vẫn là KD-7.
- Thước sau phát hành (crm cài 2.37.0, khai `nhan_dien.tep` hẹp, bước chấm trên một vòng ngăn bản ghi thật ra 0 báo
  oan) — số từ `khuon-cham.json` của hồ sơ vòng ấy ở crm, đọc ở hồ sơ mốc · AC-7 bảo đảm phần kit; không phải mã mới.

## Out of scope

- Đọc nhóm khai bằng sổ đăng ký `kind` (giữ nhãn «không đọc được ở đây» — chỉ một kho dùng cách viết này).
- `doi_tuong` viết dạng danh sách bị nối thành một chuỗi — bước chấm không dùng khoá này.
- Bản đồ sai lược đồ mà `--write` vẫn ghi số sạch, và kiểm khe dừng ở «>» đầu tiên (Ngoài-13, Ngoài-14 của `khuon-loi`)
  — hạt giống `docs/plans/2026-11-02-hat-giong-khuon-cham-sau-ky.md`.
- Mục ngoại lệ có `khoi: []` rỗng — không mục nào, như hôm nay `khoi` rỗng không khớp gì.

## Notes
