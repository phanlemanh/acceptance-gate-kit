# Thước nhãn-đè-khối cho diagram-design — design

Ngày: 2026-08-27 · Slug: `thuoc-nhan-de-khoi` · Hạng: T2

## Vấn đề

Luật §6/§9 của skill diagram-design cấm nhãn bị che, nhưng luật nằm ở văn xuôi
— máy tự đọc checklist rồi tự gật, không có chiều đỏ. Hệ quả đo được: 3 nhãn
trong 2/8 hình đã ship ở `docs/reference/figures/` bị khối vẽ SAU đè lên
(z-order): `GHI STATUS` (chồng 4px) + `HÌNH ĐÍNH THẺ` (28px) trong
`kien-truc-ho-so-la-truc`, `S5 GIAO` (3.8px) trong `trang-thai-ho-so`.
Phát hiện 2026-08-27 khi so với validator của archify (skill ngoài, có phép
kiểm hình học chạy được) — cùng tập luật, khác người chấm.

Mốc bất biến bản trước-sửa: `BASE-TNK = 848adc9233b54a5755c4be2f49af8a01902f75f0`
(HEAD lúc mở hồ sơ; 3 ca hỏng còn nguyên ở mốc này — đối chứng đỏ vĩnh viễn,
không trôi theo origin/main).

## Lời giải

Một script tĩnh `check_label_occlusion.py` đặt cạnh `check_overflow.py` trong
skill vendored (`diagram-design/skills/diagram-design/scripts/`), cùng giọng
docstring (kể cả mục "WHAT THIS CANNOT SEE"). Không cần Chrome — bắt đúng lớp
lỗi z-order tĩnh mà quét thủ công đã chứng minh bắt được bằng regex.

### Thuật toán

1. Đọc file `.svg`, hoặc `.html` (tách từng khối `<svg>…</svg>`, kiểm từng khối).
2. Duyệt phần tử theo thứ tự tài liệu, tích luỹ `translate(dx,dy)` của các `<g>`
   lồng nhau (stack). Gặp `scale`/`rotate`/`matrix` → bỏ qua cây con đó và WARN
   (giới hạn khai, không im lặng).
3. **Đơn vị nhãn** = rect-mask nhỏ (h ≤ 18, w ≤ 220) mà phần tử `<text>` đứng
   ngay sau nó (trong cửa sổ nguồn gần); bbox nhãn = rect-mask. Nhãn không có
   mask → KHÔNG thấy (giới hạn khai — nhất quán với house style: mọi arrow-label
   bắt buộc có mask theo §6).
4. **Khối che** = rect có `w ≥ 60 ∧ h ≥ 28`, vẽ SAU rect-mask của nhãn, có fill
   đục (loại `none` / `transparent` / `fill-opacity` ≤ 0.5 / `opacity` ≤ 0.5).
5. Vi phạm khi bbox khối ∩ bbox mask > 0 ở cả hai trục. In: file · nhãn (nội
   dung text) · toạ độ khối · số px chồng mỗi trục. Exit 1 nếu có ≥ 1 vi phạm,
   exit 0 khi sạch, exit 2 khi không đọc được file nào.

### Chỗ cắm

- **Lưới thường trực:** case mới `tests/scripts/label-occlusion.test.mjs` —
  suite `executors.test.scripts` đã nằm trong `feature_loop.suite_keys` nên
  chạy mỗi vòng verify + CI. Case có HAI chiều trên fixture code-sinh trong
  chính lần chạy: bản lành xanh, bản tiêm (chèn rect đục sau mask) đỏ với
  thông điệp ghim; lệnh tiêm phải chứng minh nó đổi được nội dung. Đường dẫn
  suy từ `import.meta.url`, không hardcode ROOT.
- **Phạm vi lưới:** chỉ `docs/reference/figures/*.{svg,html}`. Hồ sơ
  `_acceptance/*/figures` đã ký + 147 assets vendored: quét MỘT lần, kết quả
  ghi vào `evidence/` của hồ sơ này (report-only — hồ sơ đã ký không kéo vào
  diff; assets là thân skill bên thứ ba, sửa hàng loạt = churn LOCAL-PATCHES).
- **Taste gate:** thêm 1 mục vào §9 Technical của SKILL.md trỏ script (chạy
  cùng nhịp với `check_overflow.py`); LOCAL-PATCHES.md thêm entry đánh số
  (nếp vendor: mọi lệch so với upstream phải có vết).
- **KHÔNG sửa `scripts/pre-merge-check.sh`** (đường T3) — suite đã đủ răng.

### Sửa 3 nhãn

Sửa ở NGUỒN `.html` (dời nhãn/mask theo đúng luật 6–10px gap, không xoá nhãn,
không dời khối), re-export `.svg` + `.png` bằng skill export-diagram. Bản
trước-sửa vẫn đọc được từ `BASE-TNK` qua `git show` — chiều đỏ của AC-2.

## Không làm (out of scope)

- Không sửa hình trong hồ sơ `_acceptance/*/figures` đã ký (report-only).
- Không sửa 147 assets vendored trừ khi báo cáo quét chỉ ra ca hỏng và owner
  quyết riêng.
- Không đo nhãn không-mask, transform scale/rotate, `foreignObject`, PNG —
  giới hạn khai trong docstring.
- Không cắm pre-merge-check.sh, không đổi luật văn xuôi §6.

## Kiểm

Ma trận đo trong `_acceptance/thuoc-nhan-de-khoi/evals.yaml` — mỗi phép đo mới
theo MEASURE-BIRTH: cặp hai-chiều cùng fixture + thông điệp ghim.
