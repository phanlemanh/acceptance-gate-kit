# design-floor bước 2a — vendor lõi gọn Design OS + bản vá A (FL2)

Hồ sơ: `_acceptance/design-floor-vendor-va-ban-va-a/` · hàng FL2 của `docs/plans/lo-trinh-kit.json` · kế hoạch
`docs/plans/2026-10-26-ke-hoach-design-floor-tiep.md` bước 4 (phần vendor + bản vá A) · tri thức
`acceptance-gate-kit-tri-thuc:wiki/chu-de/design-floor.md#a289cb0a4a802d52c101ecc8583c316ae476c626`.

## Vấn đề

Bước 1 (#421) giao hợp đồng nhập, tệp khoá và bộ đo — nhưng bộ đo lấy mã upstream qua mạng mỗi lượt và chấm một
bản dựng từ `src/cli.ts` của upstream. Kit chưa có mã nào để giao cho kho tiêu thụ, và lệnh chấm của bản ghim ghi
sổ sự kiện vào `design/` gần nhất (DF-07, DF-08 đỏ): móc nó vào vòng thì mỗi lượt chấm làm hồ sơ cũ (ADR 0007).

Người hưởng: phiên Claude Code ở kho tiêu thụ (FL4/FL5 sẽ gọi bản gói ở S1, cuối S3, S4) và chủ kho (một bộ chấm
không tự ghi = không thêm vòng ghim lại sau chữ ký). Trace: nguyên tố 2 — bằng chứng không tự dối.

## Sự thật đo được khác lời giao (27/10, bản thử trong thư mục nháp)

1. **124 tệp không đủ để chạy.** Năm module lệnh nhận `ParsedArgs` nhưng `parseArgs` nằm ở `src/core/cli-args.ts`
   (170 dòng), và bộ kiểm cờ lạ của `src/cli.ts` đọc `src/core/command-signatures.ts` (1 372 dòng) — cả hai ngoài
   tệp khoá. Danh sách chép mở lên **126**.
2. **Bản vá A chạm ba tệp, không phải hai.** `gate.ts` nhập `loadTokenHexes` từ `commands/taste-lint.ts`, mà
   `taste-lint.ts` cũng nhập `memory-autorecord`. Vá `gate.ts`, `autofix.ts`, `taste-lint.ts` → bản gói 0 module
   memory; DF-07, DF-08 xanh; DF-01, DF-03…06 giữ đúng chữ ký đỏ đã khai; DF-02, DF-09 vẫn PASS.
3. **Đóng kín giao đi nằm trong trần cũ.** Sau bản vá A, hợp đóng kín của vỏ + năm lệnh = 118 tệp · 18 453 dòng
   (trần 124 · 18 500) — không phải nâng trần. Tám module `memory-*` (1 561 dòng) vẫn được chép nhưng không vào bản gói.

## Thiết kế

```
design-floor/
  HOP-DONG-NHAP.md          khối máy: + khối "vendor" (đường), gioi_han dùng ban_va
  LOCAL-PATCHES.md          sổ bản vá — khối máy DESIGN-FLOOR-LOCAL-PATCHES, một dòng một bản vá
  patches/A-bo-cham-khong-but.patch
  upstream.lock.json        126 tệp, băm UPSTREAM (trước vá), lenh.vo = hai tệp vỏ kéo thêm
  vendor/design-os/src/…    126 tệp, chép từ bản ghim rồi áp các bản vá đã áp của sổ
  vo/ui.ts                  vỏ do kit viết: năm lệnh, luật điều phối chép từ src/cli.ts
  dist/ui.mjs               bản gói một tệp (~0,8 MB), máy sinh, KHÔNG sửa tay
tests/design-floor/
  dong-bo.mjs --write       bản ghim (mạng) → vendor/ → áp bản vá → ghi băm sau vào sổ → dựng bản gói
  rao-dong.mjs              VA-01 · FN-01…04 · BG-01, ngoại tuyến trên bản vendored
  hop-dong.mjs              DF-01…09 trên bản gói giao đi
  tu-thu.mjs                đối chứng + đột biến, thêm các đột biến của vòng này
```

**Cách giao bản chạy được — bản gói dựng tất định.** esbuild 0.25.10 (đã ghim) gói vỏ + đóng kín + 13 gói npm
runtime (đúng phiên bản trong `package-lock.json` của bản ghim, ghim ở `tests/design-floor/package.json`) thành
`design-floor/dist/ui.mjs`. CI dựng lại trong bộ nhớ từ nguồn vendored và so từng byte với tệp đã commit. Phương án
loại: dựng TS lúc chạy — plugin cài từ chợ chạy bằng node trần, không có esbuild hay css-tree ở máy kho tiêu thụ.
Tiền lệ: `scripts/design-scan.js` là bản gói commit sẵn từ `vendor/impeccable`.

**Vỏ.** `vo/ui.ts` đăng ký đúng năm lệnh của khối máy, giữ ba luật của `src/cli.ts @ a7ad5f1`: lệnh không có
lệnh con thì vị trí đầu về `positionals[0]`; cờ ngoài chữ ký lệnh → `UNKNOWN_FLAG` (mã như upstream); lỗi ném ra →
mã 2. Lệnh ngoài năm lệnh → mã 4. Vỏ không gắn đường ghi sự kiện nào.

**Bản vá A — bộ chấm không bút.** Gỡ lệnh import `memory-autorecord` và lời gọi `withOutcome` ở `gate.ts`,
`autofix.ts`, `taste-lint.ts`; lời gọi thay bằng `return out;`. Không ghi sự kiện ở đâu cả: §6 hợp đồng nhập cấm
lệnh chấm ghi tệp, và kit không dùng sổ sự kiện của upstream.

**Sổ LOCAL-PATCHES.** Khối máy là nguồn; mỗi dòng: `id` · `trang_thai` (`da-ap` | `cho-va`) · `ten` · `vi_sao` ·
`lam_xanh` (phép đo nó làm xanh) · `tep_va` (đường tệp diff) · `tep: [{path, truoc, sau}]`. B, C, D có dòng
`cho-va` (chưa có tệp, chưa có băm) để giới hạn còn lại trỏ vào.

**Lệch kế hoạch bước 4 (có chủ ý, sổ `d-20261027T035837Z-15` thay `d-20261027T035402Z-6`).** Kế hoạch viết «tệp khoá
ghi cả hai băm»; vòng này để tệp khoá giữ băm upstream và băm sau chỉ ở sổ — mỗi con số một chỗ.

**Luật giới hạn mới.** Mỗi giới hạn mang `can_upstream` (sửa đổi nó chờ) và `ban_va` (mã một dòng của sổ). Bên
đọc FAIL khi: thiếu một trong hai · `ban_va` không có dòng · dòng đó `da-ap` (bản vá đã áp mà giới hạn còn sống
nghĩa là bản vá không giữ lời). Bên viết: khối máy + §8 của hợp đồng nhập đổi cùng commit.

## Phép đo

| ID | Đòi gì | Chiều đỏ (đột biến trong `tu-thu.mjs`) |
|---|---|---|
| VA-01 | tập tệp vendored = tập tệp khoá; mỗi tệp băm = tệp khoá, trừ tệp có trong một dòng `da-ap` thì băm = `sau` và `truoc` = tệp khoá | sửa một byte của tệp vendored ngoài sổ → đỏ gọi đúng tên tệp; thêm một tệp lạ; băm `sau` sai |
| FN-01 | đảo mọi tệp vá (thứ tự ngược) trên bản sao → băm = tệp khoá, và đóng kín đo lại (năm lệnh + vỏ) khớp tệp khoá | tệp khoá lệch một băm |
| FN-02…04 | như bước 1, đo trên đóng kín GIAO ĐI (bản vendored đã vá) | như bước 1 |
| BG-01 | bản gói dựng lại = tệp commit, từng byte — lần tại chỗ và lần từ bản sao ở đường tuyệt đối khác | sửa một byte của bản gói → đỏ |
| DF-01…09 | như bước 1, chạy trên `design-floor/dist/ui.mjs` | bỏ bản vá A khỏi bản sao + dựng lại → DF-07, DF-08 đỏ lại |
| luật giới hạn | `ban_va` thiếu / chết / trỏ bản vá đã áp → FAIL | ba đột biến trên bản sao hợp đồng |

CI không còn lấy mã qua mạng: `dong-bo.mjs --write` là đường duy nhất chạm mạng, chỉ chạy khi đổi ghim hoặc đổi bản vá.

## Ngoài phạm vi

- Bản vá B, C, D (FL3) — DF-01, DF-03, DF-04, DF-05, DF-06 và 4 cặp figma của FN-02 vẫn XFAIL có chủ đích.
- Móc vào S0–S4 (FL4, FL5); không móc `ui gate` vào S4 (mục chờ FL-C1). Không đăng ký chợ plugin (đi cùng FL4).
- `knowledge/personas/families.json` không vendor: `--family` hoặc tệp token mang `persona` → `FAMILY_NOT_FOUND`.

## Bốn phép thử North Star

1. **Không ghi sau S4** — bản vá A là chính phép thử: DF-07/DF-08 xanh trên bản giao đi. Vòng này không móc gì vào S4.
2. **Lượt người** — Cổng Đáng đã ký gộp ở thẻ khởi tạo đợt design-floor-2710 (27/10); vòng còn một câu ở Cổng
   Phạm vi (Hỏi-1, phê CỘNG), Cổng 1.5 và Cổng Bằng chứng của T3: 3 lượt, trần T3 là 4. Không dòng thẻ chỉ-«ừ»: 13 lựa chọn máy quyết nằm ở sổ.
3. **Chi phí máy mỗi kết quả gộp** — kiểm tất định 0 token; CI design-floor ~1 phút (npm ci + ~30 s đo, không mạng
   upstream); kit thêm ~20 nghìn dòng TS + 0,8 MB bản gói vào kho.
4. **Chiều đỏ** — mỗi phép đo mới có đột biến trong `tu-thu.mjs`, chạy trong CI.
