---
schema_version: 1
feature: Bộ dò tương phản đo thật màu lab, oklab, lch, oklch và độ trong suốt; màu không đọc được báo không đo được, không bao giờ đạt
slug: do-tuong-phan-lab-oklab
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
status: verified
design_doc: _acceptance/do-tuong-phan-lab-oklab/design.md
approved_by: Manh Phan
approved_at: 2026-11-09T23:20:09Z
---

# Acceptance Contract: do-tuong-phan-lab-oklab

## Context

Bộ dò `low-contrast` chỉ đọc `rgb()`, nên chữ Chrome báo dạng `lab()` hay `oklab()` bị bỏ qua và trang trả đạt, kể cả với
`--require-measured`. Vòng này đóng lỗ đó và sửa lỗi nhỏ ở bước chấm S4 khi chú thích bị tính là mã màu thô.

Code đã có trước hồ sơ (PR 489, commit `b1576523` đỏ, `4444d38e` sửa); hồ sơ dựng vì phần `lib/**` thuộc `t3_paths`. Xem design
doc mục «Trạng thái của vòng».

Source input: đề bài của phiên điều phối 09/11/2026, tái lập trên Chrome thật + Tailwind 4 + axe-core 4.14.

Thuật ngữ:
- **hai tầng** = cổng `scripts/design-gate.mjs` (chế độ dom, jsdom) và bộ quét `scripts/design-scan.js` nạp vào trang.
- **bộ máy gốc** = `git archive c8fa5a65 scripts lib vendor` bung trong lượt, bản trước vá.
- **nhát phá** = bản sao cây đang kiểm bị đổi đúng một chỗ, dựng lại bộ quét, chạy lại đúng trang thử của ca xanh.
- **ca** = tên ca của `tests/design-eval/mau-lab.test.mjs`; **ca MD** = ca của `tests/design-eval/mau-lab-do.test.mjs`.

## Criteria

- AC-1: Given một dòng chữ trên nền trắng mang màu `lab`, `oklab`, `lch`, `oklch` tương đương `#f5f5f5`, gồm cả cách viết phần
  trăm, `none` và số mũ (số mũ chỉ ở bộ quét vì jsdom bỏ chuỗi này), When chạy hai tầng, Then cả hai từ chối và phát hiện ghi
  `text #f5f5f5 on #ffffff`; bộ máy gốc trên cùng trang trả đạt.
- AC-2: Given năm màu trong bảng điểm ảnh đo trên Chrome thật, đặt chữ và nền cùng màu, When chạy hai tầng, Then mã hex phát
  hiện in ra đúng bằng điểm ảnh Chrome.
- AC-3: Given chữ trong suốt một phần ở `lab`, `lch`, `oklab`, `oklch`, `rgba`, When chạy hai tầng, Then độ tương phản tính
  trên màu đã hoà với nền: `oklab(0.97 0 0 / 0.2)` trên trắng ra `#fdfdfd`, `rgba(0, 0, 0, 0.2)` trên trắng ra `#cccccc`.
- AC-4: Given chữ trắng trên nền `oklab` đen trong suốt đặt trên trang trắng, When chạy hai tầng, Then nền 50% từ chối với nền
  đã hoà `#808080`, nền 80% đạt.
- AC-5: Given nền gradient, When chạy hai tầng, Then gradient `lab`, `oklab`, `oklch` được đọc và từ chối khi chữ không đủ tương
  phản; điểm dừng trong suốt được hoà với lớp dưới trước khi đo (chữ trắng trên gradient `oklab(0 0 0 / 0.5)` đặt trên trang
  trắng đo với `#808080`, không phải đen); gradient mang `color(...)` không đọc được ra không đo được.
- AC-6: Given trang đủ tương phản ở họ lab (chữ tối nền trắng, chữ sáng nền tối, chữ `oklab` trên nền `lab`, chữ sáng trên nền
  `oklch` tối viết trực tiếp) và chữ alpha 0 ở `rgba` và `oklab`, When chạy hai tầng, Then trang đạt và alpha 0 không bị hoà; bộ
  ca `design-eval` và KD có từ trước vẫn đạt, vendor giữ nguyên. Ngoại lệ đã khai: hàng `oklch-toi` của KD9 đổi trang thử sang nền
  qua `var()` để vẫn thử đúng nhánh nền không đọc được, vì nền `oklch` trực tiếp nay đo được thật; đo được trực tiếp là ca mới
  ở trên, đối chiếu với bộ máy gốc.
- AC-7: Given màu không đọc được (`color(display-p3 …)`, `color(srgb …)`) ở chữ, ở nền, hay ở nền tổ tiên và không có lỗi nào
  khác, When chạy hai tầng có và không có đòi đo đủ, Then phán quyết `KHONG-DO-DUOC`, `do_duoc: false`, phát hiện mang lý do
  `mau-khong-doc-duoc`, thoát 0 (cổng) và `exit_intent: 0` (quét), thoát 5 khi đòi đo đủ, và không tính vào số lỗi chặn. Trang có
  thêm một chữ thiếu tương phản đo được thì từ chối, kể cả khi đòi đo đủ (thoát 2); nền đục che lớp không đọc được thì lớp ấy
  không làm trang thành không đo được.
- AC-8: Given Chromium thật và hai trang tái lập gốc dựng từ CSS do Tailwind 4 sinh (`bg-white text-neutral-100`,
  `bg-background text-muted/20`), mà màu chữ Chromium tính ra thật sự ở dạng họ lab, When nạp `scripts/design-scan.js`, có và
  không đòi đo đủ, Then cả hai từ chối với mã hex của màu chữ đã hoà, còn bộ máy gốc `c8fa5a65` trên cùng trang trả đạt; năm màu
  của bảng điểm ảnh đo lại trên chính Chromium ấy bằng canvas khớp bảng trong ca; `color-mix(in srgb, …)` ra không đo được.
- AC-9: Given bản gốc của bộ dò mất một mốc vá, When áp bản vá, Then lỗi có câu `anchor must occur once` chứ không chạy bản chưa
  vá; `scripts/design-scan.js` khớp đúng bản dựng từ nguồn.
- AC-10: Given tệp giao diện mà vòng chạm có `// issue #123`, When chạy bước chấm S4 của kho mức M1, Then chú thích không bị báo;
  mã hex thô thật trong cùng tệp vẫn bị chặn đúng số dòng; tệp chỉ có chú thích thoát 0 và không in gì. Bộ lọc không được cắt quá
  tay: `//` nằm trong chuỗi rồi hex cùng dòng vẫn bị chặn, hex trong chuỗi `"// #abc"` vẫn bị chặn, `/* #abc */` và chú thích JSX
  không bị báo, hex sau khối chú thích nhiều dòng báo đúng số dòng.

## Coverage

Quét bằng morphological-scan, preset test-matrix.

- Trục A, định dạng màu: lab | oklab | lch | oklch | rgb/rgba | hàm không đọc được [thước CE: NGÀNH: danh sách hàm màu của CSS Color Module Level 4; màu Chrome trả thật đo trên Tailwind 4]
- Trục B, vị trí màu: chữ | nền đặc | nền trong suốt | nền tổ tiên | gradient [thước CE: NGÀNH: thuật toán luật `color-contrast` của axe-core 4.14, đi qua nền xếp lớp]
- Trục C, alpha: đục | một phần | 0 [thước CE: WCAG 2.2 SC 1.4.3 đo trên màu hiển thị]
- Trục D, cách viết số: thập phân | phần trăm | `none` | số mũ [thước CE: cú pháp CSS Color 4]
- Cross-cutting, áp mọi ô Core: chạy trên hai tầng; thứ tự từ chối > không đo được > đạt; chiều đỏ trên cùng trang thử.
- Core: AC-1 đến AC-10.
- Ma trận ô đã kê trong đầu `evals.yaml`: mỗi ô là một ca có tên hoặc một câu nói vì sao bỏ.
- Later: đo thật `color(srgb …)` và `color(display-p3 …)` (Hỏi-2) · gamut mapping thay cho cắt kênh · đưa ca Chromium vào CI của kit (lượt chấm vẫn chạy nó).
- Never: đoán màu gần đúng cho hàm không đọc được, vì biến «không biết» thành số đo giả.
- [GIẢ ĐỊNH] Chrome là trình duyệt tham chiếu duy nhất; Firefox và Safari có thể làm tròn khác một đơn vị kênh, không đổi kết luận trừ ca sát ngưỡng.

## Out of scope

- Đo thật `color()` các không gian và kết quả `color-mix(in srgb …)`: báo không đo được.
- Đổi phán quyết của chữ dùng `var()` ở tầng jsdom.
- Sửa vendor hay thay bộ dò bằng axe-core.
- Quy tắc hex thô ngoài việc bỏ chú thích.

## Notes

- Đoạn mới trong `skills/acceptance/references/design-ui-check.md` không có thước máy riêng; người đọc tại Cổng Bằng chứng.
- Bước làm có thể phải đổi code: gradient có điểm dừng trong suốt (AC-5) chưa từng được đo.
- Hợp đồng viết sau code: bước làm cho một tác tử sạch viết tiêu chí chỉ từ đề bài rồi đối chiếu với AC-1..AC-10 (Hỏi-3), lưu
  ở `_acceptance/do-tuong-phan-lab-oklab/doi-chieu-de-bai.md`.
- CHANGELOG ghi lúc cắt mốc, không ở vòng này.
