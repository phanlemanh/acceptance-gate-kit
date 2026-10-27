---
schema_version: 1
feature: design-floor bước 2a — lõi gọn Design OS vendored vào kit khớp từng băm của tệp khoá, sổ LOCAL-PATCHES, bản gói dựng tất định, và bản vá A làm mọi lệnh chấm không ghi tệp
slug: design-floor-vendor-va-ban-va-a
owner: phanlemanh@gmail.com
risk_tier: T3               # hàng FL2 khai T3: CỘNG một thành phần mới (mã bên thứ ba + bản gói) mà FL4/FL5 sẽ móc vào vòng
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-27-design-floor-vendor-va-ban-va-a-design.md
status: signed-off
approved_by: Manh Phan
approved_at: 2026-10-27T05:32:11Z
---

# Acceptance Contract: design-floor-vendor-va-ban-va-a

## Context

Gốc: acceptance-gate-kit/_acceptance/design-floor-hop-dong-nhap/ — bước 1 giao hợp đồng nhập, tệp khoá và bộ đo
lấy mã upstream qua mạng; DF-07/DF-08 đỏ vì `ui gate` và `ui autofix --write` ghi sổ sự kiện vào `design/` gần
nhất. Vòng này đưa mã vào kit (hàng FL2, kế hoạch bước 4 phần vendor + bản vá A). Không gửi PR upstream (chủ
kho 26/10): mọi sửa đổi là bản vá cục bộ, ghi sổ.

## Criteria

- AC-1: Given bản vendored `design-floor/vendor/design-os/`, tệp khoá và sổ LOCAL-PATCHES, When chạy
  `rao-dong.mjs`, Then VA-01 PASS: tập tệp vendored bằng tập tệp khoá; mỗi tệp có băm bằng tệp khoá, trừ tệp nằm
  trong một dòng `da-ap` của sổ thì băm bằng `sau` của dòng đó và `truoc` bằng băm tệp khoá. Chiều đỏ, trên bản
  sao: sửa một byte của một tệp vendored ngoài sổ → VA-01 FAIL nêu đúng đường tệp đó; thêm một tệp lạ → FAIL nêu
  tệp lạ; xoá một tệp vendored → FAIL nêu tệp thiếu; `sau` của một tệp vá sai → FAIL nêu tệp vá; dòng A thiếu
  một trường bắt buộc (vd. `lam_xanh`) → FAIL nêu dòng và trường.
- AC-2: Given sổ LOCAL-PATCHES, When đọc khối máy, Then mỗi bản vá là một dòng mang tệp · băm trước/sau · vì sao ·
  phép đo nó làm xanh · đường tệp diff, và dòng A `da-ap`; FN-01 PASS: đảo mọi tệp diff của dòng `da-ap` (thứ tự
  ngược) trên bản sao cho đúng băm tệp khoá ở mọi tệp, và đóng kín đo lại của năm lệnh + vỏ khớp tệp khoá. Chiều
  đỏ: tệp khoá lệch một băm → FN-01 FAIL nêu tệp; tệp diff A bị sửa một dòng → FN-01 FAIL.
- AC-3: Given `design-floor/dist/ui.mjs` đã commit, When BG-01 dựng lại bản gói từ vỏ + nguồn vendored bằng
  esbuild và gói npm đã ghim, Then lần dựng tại chỗ và lần dựng từ một bản sao nguồn ở đường dẫn tuyệt đối khác (thư mục
  tạm, cùng bố cục tương đối) cho cùng từng byte và bằng tệp đã commit — bản gói không phụ thuộc chỗ checkout.
  Chiều đỏ: sửa một byte của bản gói trên bản sao → BG-01 FAIL «bản gói lệch nguồn».
- AC-4: Given biến `DESIGN_FLOOR_KHONG_MANG=1` làm mọi đường lấy mã upstream ném lỗi, When chạy
  `bash tests/design-floor/run-tests.sh`, Then thoát 0 — rào đóng kín đo trên bản vendored, bộ đo hành vi chạy
  bản gói giao đi; `chuanBiNguon` trả thư mục vendored và không có nhánh lấy mạng. Đối chứng trên đúng đường bộ
  đo: `chuanBiNguon` với một gốc kit không có thư mục vendored ném lỗi nêu «thiếu bản vendored» (không rơi về
  lấy mạng); `layUpstream` dưới biến ném lỗi nêu «KHONG_MANG». Job CI `design-floor` đặt
  `DESIGN_FLOOR_KHONG_MANG: 1` và chạy đúng lệnh này.
- AC-5: Given bản gói có bản vá A, When chạy `hop-dong.mjs` và `rao-dong.mjs`, Then DF-07 và DF-08 PASS; khối máy:
  `gioi_han` không có DF-07, DF-08; `vi_pham` của FN-02 BẰNG đúng tập ba cặp `<lệnh> src/core/figma-ds-tokens.ts`
  (gate · token-coverage · reuse-plan check — autofix chỉ kéo module Figma qua đường ghi sự kiện nên rời cùng bản
  vá A), không cặp nào chứa `memory-` — 17 cặp đã gỡ cùng commit (sổ S3, giám sát đồng ý 27/10);
  FN-02 XFAIL. Chiều đỏ trên bản sao khối máy: thêm lại một cặp memory vào `vi_pham` → FN-02 FAIL «đã khai mà
  KHÔNG còn». Chiều đỏ: bỏ bản vá A khỏi bản sao rồi dựng lại bản gói → DF-07 và DF-08 FAIL nêu
  `memory.events`.
- AC-6: Given cùng bản gói, When chạy `hop-dong.mjs`, Then DF-01, DF-03, DF-04, DF-05, DF-06 vẫn XFAIL đúng chữ
  ký đỏ của bước 1 (hành vi bản ghim, chờ bản vá B/C) và DF-02, DF-09 PASS.
- AC-7: Given khối máy của hợp đồng nhập, When đọc `gioi_han`, Then không giới hạn nào mang `pr_upstream`; mỗi
  giới hạn mang `can_upstream` và `ban_va` trỏ một dòng `cho-va` của sổ (B, C hoặc D); §8 văn xuôi nói đúng luật
  ấy. Chiều đỏ, bốn đột biến trên bản sao: thiếu `ban_va` → FAIL «không có đường ra»; thiếu `can_upstream` → FAIL
  «không có đường ra»; `ban_va` trỏ mã không có
  trong sổ → FAIL «con trỏ chết»; `ban_va` trỏ dòng A (`da-ap`) → FAIL «bản vá đã áp».
- AC-8: Given vỏ `design-floor/vo/ui.ts`, When gọi bản gói, Then đúng năm lệnh của khối máy chạy; một lệnh khác
  (vd. `ui init`) thoát 4 kèm danh sách năm lệnh; tệp khoá có 126 tệp với `lenh.vo` = `cli-args.ts` +
  `command-signatures.ts`; FN-04 PASS với trần 124 tệp · 18 900 dòng (nâng từ 18 500 trong cùng PR theo §7 hợp đồng nhập — sổ
  S3, giám sát đồng ý 27/10), đo trên đóng kín giao đi (117 tệp · 18 825 dòng).
  Chiều đỏ: trần hạ dưới số đo → FN-04 FAIL.
- AC-9: Given bản ghim `a7ad5f1` lấy qua mạng, When chạy `node tests/design-floor/dong-bo.mjs --kiem`, Then nó
  dựng lại trong thư mục tạm — chép tệp khoá, áp các bản vá `da-ap`, dựng bản gói — và so khớp từng byte với
  thư mục vendored, băm của sổ và bản gói đã commit; thoát 0 kèm «khớp». Chiều đỏ: một tệp vendored lệch → thoát
  1 nêu tệp.

## Coverage

Bỏ quét — xem sổ `d-20261027T035402Z-12` (phạm vi đã chốt ngoài vòng bởi điều kiện bật của hàng FL2 và bảng bản
vá ở bước 4 của kế hoạch).

## Out of scope

- Bản vá B, C, D (hàng FL3): DF-01, DF-03, DF-04, DF-05, DF-06 và bốn cặp figma của FN-02 còn đỏ có chủ đích.
- Móc design-floor vào S0–S4 (FL4, FL5); không móc `ui gate` vào S4 — mục chờ FL-C1.
- Đăng ký design-floor vào chợ plugin — đi cùng điểm móc đầu tiên (FL4), sổ `d-20261027T035402Z-10`.
- `knowledge/personas/families.json` không vendor (sổ `d-20261027T035402Z-11`).

## Notes

Known limits (khai từ thiết kế):
- `ui gate --family <slug>` và tệp token mang trường `persona` trả `FAMILY_NOT_FOUND` trên bản gói, vì
  `knowledge/personas/families.json` không vendor. argv của khối máy không truyền `--family`.
- Tám module `memory-*` (1 561 dòng) được chép nhưng không vào bản gói sau bản vá A — giữ để FN-01 dựng lại bản
  trước-vá ngoại tuyến (sổ `d-20261027T035402Z-9`).
- Ngoài-1 (chọn ở Cổng Bằng chứng 2026-10-27: mở hợp đồng mới): ghi thành hạt giống `docs/plans/2026-10-27-hat-giong-fl2-ngoai-1.md`.
- Known limits — chọn ở Cổng Bằng chứng 2026-10-27:
  - Ngoài-2: Ghi chú của sổ vá (dòng D) và mục Out of scope vẫn nói còn bốn cặp figma và dòng A nói 16 cặp, trong khi số thật là ba và mười bảy; người làm FL3 đối chiếu theo số đo, không theo ghi chú.
  - Ngoài-3: Khi hai bản vá đã áp cùng sửa một tệp, phép kiểm bản vendored báo đỏ giả và bỏ qua kiểm bản vá trước — chưa xảy ra vì mới có bản vá A; sửa cùng bản vá thứ hai ở FL3.
  - Ngoài-4: Phép kiểm «lệnh chấm không ghi tệp» có thể xanh cả khi một lệnh chết ngay từ đầu; mọi lượt đo hiện các lệnh đều chạy.
  - Ngoài-5: Trùng Ngoài-2 — ghi chú lệch số bốn/ba cặp figma và 16/17 cặp gỡ.
  - Ngoài-6: Thiếu công cụ dựng thì phép đối chiếu với bản ghim báo «lệch» thay vì «không chạy được».
  - Ngoài-7: Trùng Ngoài-4 — phép kiểm không ghi tệp thiếu đối chứng «lệnh đã chạy thật».
  - Ngoài-8: Bước kiểm cấu hình CI chỉ xem biến chặn mạng có mặt, không đo nó có hiệu lực.
