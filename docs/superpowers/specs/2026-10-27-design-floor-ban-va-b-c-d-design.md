# design-floor bước 2b — bản vá B, C, D (FL3)

Hồ sơ: `_acceptance/design-floor-ban-va-b-c-d/` · hàng FL3 của `docs/plans/lo-trinh-kit.json` · kế hoạch
`docs/plans/2026-10-26-ke-hoach-design-floor-tiep.md` bước 4 (bảng bản vá) · dựng trên FL2 (#427, bản vá A).

## Vấn đề

Sau FL2, bản gói giao đi còn năm chỗ sai hợp đồng nhập, khai là giới hạn chờ bản vá: «không đo được» thoát 0 (DF-01,
DF-06), đích `.tsx` PASS (DF-05), mã thoát không phân lớp — thiếu tệp, đối số lạ và có lỗi đều 1 (DF-04), và vắng
`--tokens`/`--file` thì tự dò design system ở thư mục cha (DF-03); cộng ba cặp `figma-ds-tokens.ts` trong đóng kín
(FN-02). Một eval gọi `ui gate … || exit 1` trên đích không đo được hôm nay xanh rỗng — chiều đỏ không bao giờ đỏ.

Người hưởng: phiên Claude Code ở kho tiêu thụ (FL4/FL5 đọc mã thoát của bản gói ở S1 và S4) và chủ kho (một bảng mã
cho cả hai cổng thiết kế, phán quyết không đổi theo chỗ checkout). Trace: nguyên tố 2.

## Thiết kế

| Bản vá | Tệp | Sửa gì | Phép đo xanh lên |
|---|---|---|---|
| B | `src/core/output.ts` | bảng `EXIT_BY_CODE`: thiếu/không đọc được tệp → 3, sai cú pháp → 4, mã khác → 1 (lỗi nội bộ); `internalErr` 2 → 1 | DF-04 |
| B | `src/commands/gate.ts` | đích không `.html/.htm` → 5; có lỗi → 2; `partial` không lỗi → 5 | DF-01, DF-05 |
| B | `src/commands/token-coverage.ts` | đích không HTML → 5; có lỗi → 2; 0 khai báo được chấm → 5 | DF-05, DF-06 |
| B | `reuse-plan-check-impl.ts`, `flow.ts` | có lỗi → 2; «không chạy được» theo bảng (thiếu tệp 3 thay vì 2) | DF-04 |
| C | `gate.ts`, `token-coverage.ts`, `reuse-plan-check-impl.ts` | vắng `--tokens` (và `--file` ở reuse-plan check) → BAD_ARG 4, trước mọi bước dò | DF-03 |
| D | `src/core/dtcg-token-tree.ts` (mới), `css-selector-mode.ts`, `ds-kit-inventory.ts` | bản chép nguyên văn thân `figma-ds-tokens.ts` dưới tên trung tính; hai chỗ nhập đổi sang nó | FN-02 |

Thứ tự ưu tiên giữ đúng hợp đồng §5: FAIL 2 > KHÔNG-ĐO-ĐƯỢC 5 > PASS 0. Ba tệp vá áp độc lập trên bản ghim + A (bản
thử 27/10: bỏ-B, bỏ-C, bỏ-D đều áp sạch), nên đột biến «bỏ một bản vá» dựng được.

**Vỏ của kit** đổi theo: cờ lạ ở chế độ chữ → 4 (chế độ JSON đi qua bảng B), lỗi ném ra → 1.

**Bộ đo đổi theo vật:**
- **VA-01 đọc sổ theo chuỗi** từng tệp (A rồi B cùng sửa `gate.ts`; D tạo tệp mới): `truoc` của bản đầu = băm tệp
  khoá (hoặc `null` khi tạo tệp), `truoc` bản sau = `sau` bản trước, `sau` cuối = băm tệp vendored. `tepCuaVa` đọc cả
  `--- a/` lẫn `+++ b/`. Gỡ Known limit Ngoài-3 của FL2.
- **DF-02 đổi đối chứng**: đường «gate không `--tokens` dò ra mồi» chết sau C; đối chứng mới «trỏ `--tokens` tường minh
  vào token của mồi thì kết quả gate đổi», đột biến mới «argv trỏ vào mồi → DF-02 đỏ».
- **Khối máy hết giới hạn**: `gioi_han: []`; sổ không còn dòng `cho-va`. Đột biến luật giới hạn (XPASS, khác chữ ký,
  không khai, con trỏ…) tự thêm một dòng `cho-va` vào bản sao sổ.
- Sổ vá: dòng A sửa ghi chú «17 cặp» (Ngoài-2/5 của FL2); B, C, D mang tệp · băm trước/sau · vì sao · phép đo.

## Lệch kế hoạch và hàng lộ trình (có chủ ý)

- **D chép thay vì dời** (sổ dòng 13 thay dòng 8): `figma-ds-tokens.ts` giữ nguyên từng byte, chỉ rời đóng kín; giá là hai
  bản chép giống nhau trong bản vendored.
- **«Bốn cặp figma» đọc là ba**: FL2 đo được bản vá A đã kéo cặp autofix ra (sổ FL2 `d-20261027T055346Z-18`); AC-6 nói rõ.
- **Bỏ B làm DF-03 đỏ theo**: C trả mã 4 nhờ bảng mã của B — AC-8 ghi đúng tập này, không giả vờ hai bản vá độc lập về nghĩa.
- **Hồ sơ FL2 đã ký không sửa**: AC của hồ sơ này thay vế XFAIL của FL2 (con trỏ ở Notes); ca đo `khoi-may-ban-va-a.mjs`
  đổi theo lời hứa thật của bản vá A.

## Ngoài phạm vi

- Chế độ chữ (không `--json`) giữ mã 1 cho lỗi đầu vào — argv khối máy luôn có `--json`.
- Lỗi nội bộ thoát 1 theo cấu tạo; chưa có phép đo kích một lần sập thật.
- Móc vào S0–S4 (FL4, FL5); `ui gate` ở S4 (FL-C1). Known limit Ngoài-4/7 của FL2 (DF-07 thiếu đối chứng lệnh-đã-chạy).

## Bốn phép thử North Star

1. **Không ghi sau S4** — vòng không móc gì vào S4; DF-07/DF-08 vẫn xanh trên bản gói mới.
2. **Lượt người** — sổ thiết kế 0 câu chỉ-người-biết: Cổng Phạm vi đi làn V nếu phản biện sạch; Cổng Bằng chứng. ≤ 2.
3. **Chi phí máy** — kiểm 0 token; CI design-floor ~1 phút; lượt chấm S4 ≈ lượt FL2 (~50 phút, ~1,4 % tuần).
4. **Chiều đỏ** — đột biến bỏ-từng-bản-vá + chuỗi sổ + đối chứng DF-02 mới, chạy trong CI.
