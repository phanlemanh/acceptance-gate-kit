# Review findings: do-tuong-phan-lab-oklab (round 1)

## Trong hợp đồng

- **Bộ lọc chú thích xoá nhầm mã thật trong HTML/SVG: `accept="image/*"` làm mất hex thô đến hết tệp**
  file: `scripts/design-floor-s4.mjs:59`
  severity: high
  AC: AC-10
  source: conventions
  detail: Nhánh `/*` chạy với mọi loại tệp, còn theo dõi chuỗi lại tắt với .html/.htm/.svg (`coChuoi` = false). Vì vậy `/*` trong giá trị thuộc tính bị coi là mở chú thích khối. Không có `*/` thì `xoaDen(s.length)` xoá đến hết tệp. Đã chạy `boChuThich` trực tiếp: `<input type="file" accept="image/*">\n<p style="color:#123456">` ở a.html cho 0 hex (bản gốc có `#123456`); `<a href="/docs/*">` rồi `background:#abcdef` cũng cho 0 hex; a.svg có chữ `/* x` rồi `fill="#ff0000"` cũng mất. Cùng nội dung ở .vue/.tsx vẫn bắt được. Hệ quả: S4 thoát 0 trên trang có hex thô thật, trái lời khai ở dòng 32 («chỉ được bỏ sót chú thích, không được bỏ sót mã») và AC-10 («không được cắt quá tay»). Ca S4-CHU-THICH và đột biến S4-CHU-THICH-CAT không phủ hướng này: phần HTML chỉ có `<!-- -->` và `style="color:#555"`. Đề xuất: ở HTML/SVG chỉ nhận `/* */` bên trong `<style>`, hoặc bật theo dõi chuỗi trong thẻ, kèm ca đỏ `accept="image/*"`.

- **Điểm dừng gradient trong suốt bị hoà với màu trắng tự đặt khi lớp dưới là ảnh hoặc gradient, gây từ chối oan (hồi quy)**
  file: `lib/design-bundle.mjs:138`
  severity: high
  AC: AC-5
  source: bugs
  detail: hoaDiemDung dùng `resolveBackground(el.parentElement, win) || trắng`. Chú thích nói trắng là khi 'nothing is declared', nhưng resolveBackground trả null chính là lúc tổ tiên CÓ khai gradient hoặc url() (nhánh hasGradientOrUrl). Nền ảnh hoặc gradient vì thế bị thay bằng trắng rồi đo như số thật. Ảnh nằm cùng phần tử với gradient cũng không được xét, vì phép hoà đi lên từ phần tử cha. Tái lập trên Chromium thật và cổng jsdom, so với bản gốc c8fa5a65: (1) section nền url(ảnh) > div gradient rgba(0,0,0,0)→rgba(0,0,0,.8) > chữ trắng: gốc PASS, HEAD REJECT 'text #ffffff on #ffffff' (thoát 2); (2) cùng phần tử `linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.2)),url(ảnh)`, chữ trắng: gốc PASS, HEAD REJECT 'on #cccccc'. Đây là mẫu hero phủ lớp tối rất phổ biến. Lớp dưới không biết được thì phải ra KHONG-DO-DUOC, không được đo với màu tự đặt. Các ca gradient-alpha hiện có chỉ phủ trường hợp không tổ tiên nào có nền.

- **`/*` trong thuộc tính HTML/SVG xoá phần còn lại của tệp, bước S4 bỏ sót hex thô**
  file: `scripts/design-floor-s4.mjs:59`
  severity: high
  AC: AC-10
  source: bugs
  detail: boChuThich tắt theo dõi chuỗi cho .html/.svg (coChuoi=false, dòng 37), nhưng nhánh `/*` (dòng 59) vẫn chạy cho mọi đuôi tệp. Khi không có `*/`, xoaDen xoá tới hết tệp (dòng 61). Tái lập: `<input type="file" accept="image/*">\n<p style="color:#ff0000">x</p>` trong .html ra 0 hex, trong khi nguồn có #ff0000. Tương tự `<a href="/docs/*">` trong .svg làm mất #00ff00. Ở .tsx, chữ JSX `<code>src/*</code>` cũng xoá `const c="#0000ff"` phía sau. Hex thô thật không được báo và S4 thoát 0 mà không có dấu hiệu gì, trái với cam kết trong chú thích của chính hàm ('chỉ được bỏ sót chú thích, không được bỏ sót mã') và AC-10. Bộ ca S4-CHU-THICH không có `/*` nào không đóng hoặc nằm trong thuộc tính HTML.

- **`//` trong url() không có nháy ở .scss/.vue bị coi là chú thích, mất hex cùng dòng**
  file: `scripts/design-floor-s4.mjs:62`
  severity: medium
  AC: AC-10
  source: bugs
  detail: Nhánh chú thích một dòng chỉ loại trừ `//` đứng sau `:`. Tái lập: `.a { background: url(//cdn.test/a.png) #444; }` trong web/a.scss và web/a.vue ra 0 hex, trong khi nguồn có #444. Ca kiểm `web/b.css` đạt chỉ vì .css tắt hẳn chú thích một dòng (coMotDong=false), nên đường .scss/.less/.vue không được phủ. Hex thô bị bỏ sót âm thầm trên các tệp giao diện khớp design.surface_globs.

- **Hình dạng 4 - Assertion âm tính một mình: đối chiếu bộ máy gốc trên nền oklch chỉ cấm REJECT**
  file: `tests/design-eval/mau-lab-do.test.mjs:87`
  severity: medium
  AC: AC-6
  source: measurement
  detail: MD-0 chỉ có `if (nenOklch === 'REJECT') loi.push(...)`, rồi in giá trị ra console. Chú thích ở mau-lab.test.mjs:145 viết «bộ máy gốc không đọc được nó, xem MD-0», và E6c cùng AC-6 coi đây là chiều đối chiếu của ca nen-oklch-truc-tiep. Assert không ghim giá trị mong đợi: bộ máy gốc trả PASS (tức là đo được, đối chiếu vô nghĩa), KHONG-DO-DUOC, hay undefined thì MD-0 đều xanh. Tôi chạy thật thì hiện nó trả KHONG-DO-DUOC, nên kết luận hôm nay đúng, nhưng phép đo không giữ kết luận đó. Vế bên kia cũng không bù được: ca nen-oklch-truc-tiep chỉ đòi verdict PASS, mà một bộ dò bỏ qua nền cũng có thể trả PASS. Cần ghim `nenOklch === 'KHONG-DO-DUOC'`.

- **Hình dạng 5 - Tuyên quét lớp nhưng chỉ có điểm-case: ca moc-va-mat chỉ chạm mốc đầu trong 12 mốc vá, trên chuỗi viết tay**
  file: `tests/design-eval/mau-lab.test.mjs:168`
  severity: medium
  AC: AC-9
  source: measurement
  detail: AC-9 và lời hứa trong lib/design-bundle.mjs:13 là «mỗi mốc phải xuất hiện đúng một lần». PATCHES có 12 mốc. Ca moc-va-mat gọi `patchDetector('function parseRgb(color) {}')`, một chuỗi viết tay không chứa mốc nào, nên vòng lặp ném lỗi ngay ở mốc 1 với found 0. Mốc 2 đến 12 chưa bao giờ được kiểm, và vế xuất hiện hai lần (count > 1) cũng không có ca. Nếu kiểm tra số lần chỉ còn áp cho mốc đầu thì ca vẫn xanh; MD-1..MD-12 không có nhát phá nào nhắm vào phép kiểm mốc. Không có ma trận theo từng phần tử: mẫu đúng là đọc văn bản vendor thật, lần lượt xoá từng mốc, và số assert bằng PATCHES.length.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Quy trình Tier B chưa có lối đọc verdict mới KHONG-DO-DUOC và exit_intent 5**
  Người dùng thấy gì: Khi bộ kiểm báo một màu không đo được, người hoặc tác tử đọc theo tài liệu hướng dẫn có thể hiểu nhầm là đạt và ghi kết quả sai.
  Căn cứ: Hậu quả là kết luận sai ở khâu đọc, không mất dữ liệu; sửa tài liệu rẻ nhưng cần một việc riêng vì ngoài hợp đồng này.
  file: `skills/acceptance/references/design-ui-check.md`
  severity: high
  Đề xuất: new-contract

- **Câu khẳng định «PASS ở cả hai tầng nghĩa là mọi màu đã được đo» là sai với hành vi đã khai**
  Người dùng thấy gì: Một câu trong tài liệu hứa rằng kết quả đạt nghĩa là mọi màu đã được đo, trong khi vài kiểu màu vẫn bị bỏ qua, nên người đọc có thể tin quá mức.
  Căn cứ: Chỉ là lời văn hơi quá tay, không làm sai kết quả của bộ kiểm; ghi rõ giới hạn là đủ, sửa câu về sau cũng rẻ.
  file: `skills/acceptance/references/design-ui-check.md`
  severity: medium
  Đề xuất: known-limits

- **Nền trong suốt nằm trên gradient được đo như nền đục, cho đạt sai**
  Người dùng thấy gì: Chữ trên một nền nửa trong suốt đặt lên nền chuyển màu có thể bị báo đạt dù thực tế khó đọc.
  Căn cứ: Chỉ bỏ sót một kiểu trang hiếm và người dùng vẫn thấy được khi xem lại trang; sửa kéo theo thiết kế lại cách đo nền xếp lớp nên khá đắt.
  file: `lib/design-bundle.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 - Tuyên quét lớp nhưng thiếu ma trận toàn phần: trục alpha và trục cách viết số chỉ kê điểm-case, không có lý do bỏ**
  Người dùng thấy gì: Một số tổ hợp cách viết màu và độ trong suốt chưa có phép thử riêng nên chưa được kiểm chứng riêng lẻ.
  Căn cứ: Các tổ hợp này đi chung đường xử lý với những ca đã có nên rủi ro thấp; bổ sung ca hoặc ghi lý do bỏ là việc nhẹ làm sau.
  file: `_acceptance/do-tuong-phan-lab-oklab/evals.yaml`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

⚠ Cụm ngoài vùng phủ: 3/10 lỗi rơi vào file không bộ đo nào phủ (skills/acceptance/references/design-ui-check.md, _acceptance/do-tuong-phan-lab-oklab/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
