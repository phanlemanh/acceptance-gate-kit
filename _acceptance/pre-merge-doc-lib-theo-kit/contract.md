---
schema_version: 1
feature: Bộ kiểm trước gộp đọc thư viện của kit theo chỗ cài kit, không theo gốc kho tiêu thụ
slug: pre-merge-doc-lib-theo-kit
owner: phanlemanh@gmail.com
risk_tier: T3      # chạm scripts/pre-merge-check.sh — trong risk_tiers.t3_paths (lời giao ghi T2; máy suy T3, không tự hạ)
surfaces: [cli]
status: verified   # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by: Manh Phan
approved_at: 2026-10-31T11:18:59Z
design_doc: _acceptance/pre-merge-doc-lib-theo-kit/design.md
---

# Acceptance Contract: pre-merge-doc-lib-theo-kit

## Context

Lưới trước gộp (`scripts/pre-merge-check.sh`) đọc `lib/md-section.cjs` và `lib/out-of-contract.cjs` theo gốc kho
đang kiểm thay vì theo chỗ đặt chính script, nên kho cài kit theo đường plugin (không chép lớp CI) bị VIOLATION
oan ở mọi hồ sơ `machine-cleared`. Lộ ra ở kho onehub-quy-hang (hàng 57, PR #30); có từ 2f8de63a (16/08). Người
hưởng: chủ kho của mọi kho cài kit theo đường plugin — vòng máy-thông gộp được. Trace nguyên tố 2 (một VIOLATION
sai lý do là cờ người học cách bỏ qua).

Source input: ô `_acceptance/pre-merge-doc-lib-theo-kit/opportunity.md` (Cổng Đáng: chủ kho «Mở vòng vá», 31/10).

## Criteria

- AC-1: Given kho thử KHÔNG có `lib/` ở gốc (cài theo đường plugin) với một hồ sơ `machine-cleared` xanh-sạch có `review-findings.md`, When lưới trước gộp của kit chạy với `--base` theo ba cách gọi — script tuyệt đối từ thư mục khác kho; đúng hình dạng CI của kho onehub-quy-hang (đứng ở gốc kho, `bash <kit tuyệt đối>/scripts/pre-merge-check.sh . --base …`); script gọi bằng đường tương đối từ thư mục kit — Then cả ba cho mã 0, dòng `OK [<slug>]: PASS — làn V` và không dòng VIOLATION nào của hồ sơ; và bản gốc thật `c8870a49` (dựng trọn thư mục trong lượt) cho cả ba cách gọi ĐỎ với dòng VIOLATION mang nguyên văn `không đọc được mục «Known limits» (fail-closed)`; bản sao mà bộ giải chỉ trả gốc kho ĐỎ cùng thông điệp ấy; bản sao mà riêng dòng mục ngoài hợp đồng đọc gốc kho ĐỎ với nguyên văn `không đọc được review-findings.md × sổ quyết định (fail-closed)` — mỗi bản sao chưa tiêm xanh trước trên cùng kho.
- AC-2: Given kho thử có `lib/` và `scripts/` chép trọn từ kit (lớp CI), When lưới chạy bằng script của kit (bản sửa và bản gốc `c8870a49`) và bằng bản chép trong kho đúng hình dạng CI của kho có lớp chép (đứng ở gốc kho, `bash scripts/pre-merge-check.sh . --base …`), Then cả ba cho hồ sơ qua lưới (mã 0, dòng OK làn V, không VIOLATION).
- AC-3: Given kho thử có `lib/` chép mà (a) hai tệp `md-section.cjs` và `out-of-contract.cjs` ném lỗi khi nạp, hoặc (b) có `md-section.cjs` nhưng thiếu `out-of-contract.cjs` (chép một phần), When lưới của kit chạy, Then hồ sơ qua lưới ở cả hai kho (lưới đọc thư viện cạnh script); và trên bản sao đảo thứ tự (gốc kho trước, cạnh script sau) thì kho (a) ĐỎ với nguyên văn `không đọc được mục «Known limits» (fail-closed)`.
- AC-4: Given bản sửa và bản gốc `c8870a49`, cả hai bỏ đúng hai tệp thư viện cạnh script, When chạy trên kho có `lib/` chép (kho của AC-2) và kho không có `lib/` (kho của AC-1), Then trên mỗi kho hai bản cho CÙNG mã thoát và CÙNG tập dòng của hồ sơ; và hai kết cục khác nhau — kho có `lib/` qua lưới, kho không `lib/` ĐỎ với nguyên văn `không đọc được mục «Known limits» (fail-closed)`.
- AC-5: Given mọi tệp shell (`*.sh`) dưới `scripts/` và `hooks/` của kit, When quét các dòng (không phải chú thích, không phải echo/printf, ngoài khối bộ giải `KIT-LIB-THEO-CHO-CAI`) theo ba mẫu của lớp — chữ trong nháy kép bắt đầu bằng tiền tố gốc kho (`$ROOT`, `${ROOT…}`, `./` hoặc không gì) rồi `lib/`|`scripts/`; từ không nháy bắt đầu bằng `$ROOT`/`${ROOT…}` rồi `lib/`|`scripts/`; `node` ở vị trí lệnh theo sau là đường tương đối `lib/…`|`scripts/…` — Then số dòng bằng 0 và tập chỗ gọi bộ giải BẰNG ĐÚNG `{md-section.cjs, out-of-contract.cjs}`; và với từng hình dạng của ma trận viết trước (`"$ROOT/…"`, `$ROOT/…` không nháy, `"${ROOT}/…"`, `"${ROOT:-.}/…"`, `"lib/…"`, `"./lib/…"` tiêm vào chỗ gọi `out-of-contract.cjs`; `node lib/…` ở vị trí lệnh chèn sau khối bộ giải) tiêm riêng vào một bản sao, phép quét ra ĐÚNG MỘT dòng, của `scripts/pre-merge-check.sh`, chứa đúng hình dạng ấy.

## Coverage

- Trục A — bố cục gốc kho: không `lib/` | `lib/` chép lành | `lib/` chép hỏng | `lib/` chép một phần [thước CE: hình dạng kho tiêu thụ đo 31/10 — onehub-quy-hang không `lib/`; onehub-invest và crm có lớp chép; một bản chép cục bộ cũ có `md-section.cjs` mà thiếu `out-of-contract.cjs`].
- Trục B — bố cục script: thư viện cạnh script (plugin hoặc bản chép trọn) | script thiếu thư viện cạnh nó.
- Trục C — dòng đọc thư viện: `md-section.cjs` | `out-of-contract.cjs`.
- Trục D — cách gọi: script tuyệt đối, ROOT tuyệt đối, đứng ngoài kho | hình dạng CI kho cài plugin (đứng ở kho, ROOT `.`) | script tương đối | bản chép trong kho (hình dạng CI kho có lớp chép) [thước CE: `.github/workflows` của ba kho, đọc 31/10].
- Ô Core: A1×B1×C1/C2×D1–D3 (AC-1) · A2×B1×D1/D4 (AC-2) · A3/A4×B1 (AC-3) · A1/A2×B2 (AC-4) · lớp trên mọi tệp shell (AC-5).
- Later: A3×B2 và A4×B2 (script thiếu thư viện cạnh nó trên bản chép hỏng/một phần) — cùng nhánh lùi về gốc kho như A2×B2, kết cục bằng bản gốc; không kho nào ở bố cục ấy.
- Không quét bằng skill: không gian kê tay bốn trục ở trên, phản biện context sạch bổ sung trục D và ô A4 (dòng sổ thay `d-20261031T093845Z-7`).

## Out of scope

- Sửa bộ dựng kho thử của `tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs` và `tests/scripts/hskt.test.mjs` để thôi chép `lib/` vào kho thử.
- Đổi các chỗ đọc thư viện khác của `pre-merge-check.sh` (đã đọc theo chỗ đặt script).
- Đổi chữ hay khuôn của hai thông điệp fail-closed.
- Cắt bản 2.36.1 và nâng kho onehub-quy-hang (phiên điều phối làm sau khi gộp).

## Notes

- Vật: `scripts/pre-merge-check.sh` (khối marker mới `KIT-LIB-THEO-CHO-CAI` + hai chỗ gọi) · thước:
  `tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs` ca LK1…LK5 · khoá eval `executors.script.pmlk_e1…e5` thêm vào
  `_acceptance/config.yaml`.
