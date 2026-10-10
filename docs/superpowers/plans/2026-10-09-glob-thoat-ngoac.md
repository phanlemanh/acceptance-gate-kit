# Kế hoạch — glob-thoat-ngoac (T3)

Hồ sơ: `_acceptance/glob-thoat-ngoac/` · Cổng 1 duyệt 09/10 (Phan Le Manh) · thiết kế:
`docs/superpowers/specs/2026-10-09-glob-thoat-ngoac-design.md`.

Thứ tự TDD: mỗi task viết ca trước, chạy thấy ĐỎ trên mã hiện tại, rồi mới sửa mã cho xanh. Một tệp ca chung
`tests/scripts/glob-thoat-ngoac.test.mjs` (suite scripts tự nhặt `*.test.mjs`); mọi đường dẫn suy từ vị trí tệp
ca, kho mẫu dựng trong thư mục tạm của lần chạy. Các task cùng chạm hai bộ dịch hoặc cùng tệp ca, nên không task
nào `independent`.

Đo trước khi lập kế hoạch (09/10): bộ đọc chung `parseFlowValue` đã đọc đúng `["…/[[]slug]/…"]` (khứ hồi trọn
chuỗi); dạng không nháy `[…/[[]slug]/…]` rơi về scalar → `carry-plan` coi là «thiếu paths — luôn chạy lại» (an
toàn). Vậy AC-4 không cần sửa bộ đọc — chỉ cần ca ghim điều đó và mutant GT5e giữ nó.

## Task 1 — Hai bộ dịch hiểu `[[]` và `[]]`

- Files: `lib/evidence-core.cjs` (`pathGlobToRe`), `feature-loop/scripts/carry-plan.mjs` (`globToRe`), tệp ca
  (bảng 5 glob × 5 tệp viết trước).
- Cách: trong vòng lặp ký tự, trước nhánh thoát ký tự đặc biệt, nhận `[[]` → `\[` và `[]]` → `\]` (tiến 3 ký tự).
  Hai bản chép đổi y hệt nhau; chú thích ở lib nhắc bản kia.
- Verify: `node tests/scripts/glob-thoat-ngoac.test.mjs` — GT1, GT1b, GT1c (đỏ trước sửa ở các ô thành ngữ).
- Phục vụ: E1 (AC-1). independent: false.

## Task 2 — Bộ phân loại coi mục mang thành ngữ là glob

- Files: `lib/evidence-core.cjs` (`phanLoaiMucPaths`), tệp ca.
- Cách: điều kiện vào nhánh glob đổi từ «có `*` hoặc `?`» thành «có `*`, `?`, `[[]` hoặc `[]]`». Nhánh glob đã
  đòi ≥1 tệp khớp, nên mục gõ sai vẫn bị từ chối (GT2d).
- Verify: cùng tệp ca — GT2, GT2b, GT2c, GT2d.
- Phục vụ: E2 (AC-2). independent: false.

## Task 3 — Làn ghim lại thôi gắn oan (chỉ ca, mã đã sửa ở Task 1–2)

- Files: tệp ca. Kho mẫu: hồ sơ đã ký, ô ui-check E1 mang NGUYÊN VĂN khối `paths` tám mục của crm
  `dien-thoai-ca-nhan` (sha `f58f27802`, chuỗi viết trước trong tệp ca), một ô ui-check đường thường, tệp cho mọi
  mục; chạy CHÍNH `feature-loop/scripts/repin-lane.mjs --write` sau hai loại diff. Khuôn kho mẫu mượn từ
  `tests/scripts/repin-lane-noi-ra.test.mjs` (đọc trước, không chép bộ dựng thứ hai nếu xuất được).
- Verify: GT3, GT3b.
- Phục vụ: E3 (AC-3). independent: false.

## Task 4 — Kế hoạch mang sang đo qua bộ đọc thật (chỉ ca)

- Files: tệp ca. `evals.yaml` dạng văn bản + run-log round trước dựng trong lần chạy; gọi `plan()` xuất từ
  `carry-plan.mjs`; assert mục đọc ra bằng chuỗi gốc rồi assert rerun / carried.
- Verify: GT4, GT4b.
- Phục vụ: E4 (AC-4). independent: false.

## Task 5 — Lưới hoá cũ hai chiều (chỉ ca)

- Files: tệp ca. Kho mẫu có hồ sơ đã ký, eval máy khai `paths` thành ngữ; chạy CHÍNH `scripts/pre-merge-check.sh`
  sau hai loại diff; ghim «evidence is stale» + tên tệp (GT6), và vắng VIOLATION stale cho hồ sơ đó (GT6b).
- Verify: GT6, GT6b.
- Phục vụ: E5 (AC-5). independent: false.

## Task 6 — Năm đột biến

- Files: tệp ca. Mỗi đột biến: bản sao trọn `lib/` + `feature-loop/scripts/` + `scripts/` vào thư mục tạm, tiêm
  ĐÚNG một kim (khẳng định kim khớp đúng một lần trong nguồn thật), chạy lại ca đích trên bản sao, ghim thông điệp
  đỏ. GT5a pathGlobToRe · GT5b globToRe · GT5c nhánh glob của bộ phân loại · GT5d kiểm tồn tại ·
  GT5e `closingBracketIndex` cắt ở `]` đầu tiên.
- Verify: GT5a…GT5e.
- Phục vụ: E6 (AC-6). independent: false.

## Task 7 — Hệ quả và bốn bộ

- Files: `CHANGELOG.md` (mục «Chưa phát hành»), `tests/scripts/fixtures/routing-baseline.txt` nếu LM20 đổi,
  `PRODUCT-MAP.md`/`LO-TRINH.html` qua bộ vẽ.
- Verify: `bash tests/workflows/run-tests.sh` · `bash tests/scripts/run-tests.sh` · `bash tests/hooks/run-tests.sh`
  · `bash tests/plugins/run-tests.sh` · `node scripts/product-map.mjs --root . --check`.
- Phục vụ: E7 (AC-7). independent: false.
