---
schema_version: 1
feature: Vá design-floor — bậc đúng ở kho có danh sách tệp git trên 1 MiB, git hỏng nói lỗi thật, S3/S4 tìm được nhánh chính tên khác main/master qua origin/HEAD; kho nhỏ dùng main y như 2.36.0
slug: va-design-floor-kho-lon-nhanh-chinh
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/design-floor-*.mjs + tests/design-floor/** + config executors — không chạm lib/**, hooks/**, lưới trước-merge
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-31-va-design-floor-kho-lon-nhanh-chinh-design.md
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-31T09:46:07Z
---

# Acceptance Contract: va-design-floor-kho-lon-nhanh-chinh

## Context

Gốc: acceptance-gate-kit/_acceptance/design-floor-moc-s3-s4/ — issue #460, số đo crm (18 463 tệp, 1 057 605 byte;
origin/HEAD → origin/onehub). Cổng Đáng: chủ kho «Mở vòng vá #460» (31/10). Bản gốc để so = cây phát hành 2.36.0, sha
`4f891b078abae111b60301e31984961362d8da08`.

## Criteria

- AC-1: Given kho fixture có `design.surface_globs` khớp và `git ls-files` in trên 1 MiB (ca tự kiểm cỡ trước khi tin),
  When chạy lệnh bậc, Then bản sửa thoát 0, `--json` ra `bac: "M1"` với số tệp khớp bằng số tệp fixture khớp glob, và
  dòng chữ là «design-floor: bậc M1 — có giao diện (N tệp khớp design.surface_globs)…»; bản 2.36.0 trên cùng kho ra M0
  với lý do «design.surface_globs không khớp tệp nào».
- AC-2: Given kho khai `design.surface_globs` mà git không đọc được danh sách tệp (thư mục không phải kho git), When chạy
  lệnh bậc và lệnh S1, S3, S4, Then cả bốn thoát 1 với một dòng stderr chứa «không đọc được danh sách tệp git», không
  dòng nào nói «không khớp tệp nào», và không tệp nào được ghi; bản 2.36.0 lệnh bậc thoát 0 không in gì (M0 im).
- AC-3: Given kho clone từ remote có nhánh mặc định `onehub` (không có main/master ở đâu), nhánh vòng chạm một tệp giao
  diện có hex thô, When chạy lệnh S3 và S4 không `--base`, Then S3 thoát 0 và S4 thoát 2 in đúng
  dòng hex thô của tệp ấy (base = điểm rẽ khỏi `origin/onehub`); bản 2.36.0 cả hai thoát 1 với «không tìm được nhánh
  chính để so diff — truyền --base <ref>».
- AC-4: Given origin/HEAD trỏ một ref không còn và kho có `main`/`origin/main`, When chạy lệnh S4, Then đầu ra bằng bản
  2.36.0; Given remote đổi master→main rồi `fetch --prune` (origin/master mất, origin/HEAD còn trỏ nó, nhánh cục bộ
  `master` cũ CÒN), Then đầu ra bằng bản 2.36.0 — không chọn `master` cục bộ cũ; Given origin/HEAD trỏ ref không còn và
  không có main/master, Then thoát 1 với thông điệp nêu tên origin/HEAD đã khai và «truyền --base <ref>»; Given không
  origin/HEAD và không main/master — kho không remote, hay checkout kiểu CI (init + remote add + fetch, có
  `origin/onehub`) — Then thoát 1 với thông điệp bằng nguyên văn bản 2.36.0.
- AC-5: Given kho nhỏ dùng `main` sinh bằng mã ở hai dạng — clone từ remote (origin/HEAD → origin/main) và kho không
  remote — mỗi dạng ở bậc M1 có hex thô và M2 có trang `.html`, When chạy lệnh bậc (chữ và `--json`), S3, S4 bằng bản
  sửa và bản 2.36.0 trên hai bản sao giống hệt, Then stdout, stderr (đã chuẩn hoá đường tạm) và mã thoát bằng nhau từng
  lệnh, và commit S3 chứa cùng danh sách tệp.
- AC-6: Given mọi lời gọi `execFileSync`/`spawnSync` đọc stdout trong `scripts/design-floor-*.mjs`, When quét, Then lời
  gọi nào cũng mang `maxBuffer`; đột biến gỡ `maxBuffer` khỏi một lời gọi trên bản sao → đỏ gọi tên tệp:dòng. Given kho
  khai `design_floor.sinh_lai` một lệnh in 2 MiB rồi thoát 0, When chạy S3, Then bản sửa thoát 0; bản 2.36.0 thoát 1
  với «lệnh sinh lại thoát null».

## Coverage

Quét tay ba trục (phản biện context sạch chỉ ra trục thứ ba mà dòng «bỏ quét» cũ không gọi tên — dòng ấy đã thay):

- Trục A — danh sách tệp git: dưới 1 MiB (AC-5) · trên 1 MiB (AC-1) · git không đọc được (AC-2) · không khai globs (M0,
  không gọi git — ca cũ BAC-M0 của moc-s0-s1).
- Trục B — tên nhánh chính: `main` (AC-5) · `master` (AC-4 đổi tên) · tên khác (AC-3, AC-4).
- Trục C — origin/HEAD: không remote (AC-4, AC-5 kho trần) · có remote mà không origin/HEAD, kiểu CI (AC-4, giới hạn) ·
  hợp lệ (AC-3, AC-5 clone) · treo, nhánh cục bộ cùng tên còn (AC-4 đổi tên) · treo, không nhánh cục bộ (AC-4).
- Ô khác 2.36.0 CÓ CHỦ Ý, không ca riêng: origin/HEAD → origin/master trong khi origin/main cũng còn — bản sửa so với
  nhánh remote đã khai (master), bản 2.36.0 so với origin/main. Cùng đường mã với AC-3.
- Trục A × B/C: lỗi 1 chặn trước bước tìm base nên hai lỗi chồng nhau ở kho lớn tên khác; AC-1 và AC-3 phủ từng lỗi,
  khoá DO1 phủ ở AC-5.

## Out of scope

- Khoá cấu hình nhánh chính trong `_acceptance/config.yaml` — kit chưa có; thêm là CỘNG.
- Kho không có origin/HEAD (không remote, hoặc checkout kiểu CI: init + remote add + fetch) mà nhánh chính tên khác
  main/master — vẫn thoát 1 như 2.36.0; đường gỡ: `git remote set-head origin -a` ở bước checkout, hoặc truyền `--base`.
- Bộ dò nhánh chính của `feature-loop/scripts/s4-args.mjs` và khối gọi trong SKILL — không đổi.
- `scripts/pre-merge-check.sh` — vòng vá song song.
- Đọc danh sách tệp bằng `-z` (tên có dấu) — đổi kết quả khớp glob ở kho đang chạy.

## Notes

- Hai bộ dò nhánh chính khác nguồn có chủ ý: s4-args đọc remote sống (`git remote show origin`, cần mạng) và dừng khi
  tên khai không giải được; design-floor đọc origin/HEAD cục bộ (không mạng), chỉ nhận ref remote `origin/<tên>` (nhánh
  cục bộ cùng tên có thể là bản cũ sau khi remote đổi tên), và lùi về bốn tên cũ khi ref ấy không còn.
- Khoá DO1: AC-5 là ca kiểm «không đổi cách S4 chấm» ở kho dạng invest.
