# Thiết kế: bộ dò tương phản đọc được màu trình duyệt thật trả về

## Vì sao làm

Chrome cùng Tailwind 4 trả màu đã tính ở dạng `lab()` và `oklab()`, có thể kèm độ trong suốt. Bộ dò `low-contrast` dùng chung
cho cổng thiết kế và bộ quét trong trình duyệt chỉ đọc được `rgb()`, nên bỏ qua phần tử rồi trả đạt. Tái lập trên Chrome thật,
Tailwind 4 và axe-core 4.14: `bg-white text-neutral-100` cho `lab(96.52 ...)` và `bg-background text-muted/20` cho
`oklab(0.97 ... / 0.2)`. Hai ca đều đạt ở cả tầng trình duyệt lẫn `--require-measured`, trong khi axe báo đúng cả hai.
Kho tiêu thụ phải chạy thêm axe để bù. Một cổng trả đạt cho thứ nó không đọc được là loại lỗi kit tồn tại để chặn.

Đi kèm: chú thích như `// issue #123` trong tệp giao diện bị bước chấm S4 tính là mã màu thô và chặn lượt chấm.

## Trạng thái của vòng

Code đã có trước hồ sơ, trên nhánh `fix/do-tuong-phan-lab-oklab`: commit `b1576523` là bài kiểm đỏ, commit `4444d38e` là bản
sửa, PR 489. Hồ sơ này dựng sau vì cổng trước-gộp đòi nó: phần `lib/**` thuộc `t3_paths`. Vòng không viết lại code. Việc còn
lại ở bước làm là bổ sung phép đo chiều đỏ trên cùng trang thử và một ca alpha 0, rồi chấm bằng tác tử mới.

Người duyệt cần biết thứ tự này khác vòng thường: hợp đồng được viết khi đã thấy code, nên tiêu chí có nguy cơ mô tả lại đúng
thứ code đang làm. Hai thứ bù: đề bài gốc (ở trên) có trước code và tự nó nêu bốn định dạng, ca alpha, luật không đo được;
chiều đỏ đo trên bộ máy gốc `c8fa5a65` và trên từng nhát phá.

## Lối làm

**Vá trên văn bản, không sửa vendor.** `vendor/impeccable` phải giữ nguyên từng byte. `lib/design-bundle.mjs` nhận văn bản gốc,
áp danh sách vá, trả văn bản đã vá cho cả hai bên dùng: `lib/design-detect.mjs` (jsdom) và `scripts/build-design-scan.mjs`
(trình duyệt). Mỗi mốc vá phải xuất hiện đúng một lần, nếu không thì lỗi to, để đồng bộ lại bản gốc không âm thầm chạy bản
chưa vá.

**Chuyển đổi theo CSS Color 4.** `lab` và `lch` qua D50 rồi Bradford về sRGB, `oklab` và `oklch` qua ma trận oklab, có phần
trăm, `none`, số mũ, và cắt kênh ngoài gam như Chrome. Giá trị được ghim vào điểm ảnh đo trên Chrome thật.

**Tính trong suốt khi đo.** Chữ trong suốt hoà lên nền. Nền trong suốt hoà lên lớp dưới. Alpha 0 giữ nguyên vì chữ ấy do thứ
khác vẽ (`background-clip: text`), đã có đường báo riêng.

**Không đọc được thì nói không đo được.** Một hàm màu không đọc được trên đường tương phản của phần tử thành phát hiện mang lý
do `mau-khong-doc-duoc`, đưa cả trang về `KHONG-DO-DUOC` với `do_duoc: false`, thoát 0, hoặc 5 khi đòi đo đủ. Từ chối thật vẫn
thắng. Nền đục che lớp không đọc được thì lớp ấy không tính vì không tới mắt.

**Bước chấm S4 bỏ chú thích trước khi quét hex**, theo đuôi tệp, giữ nguyên số dòng. Chuỗi được giữ. Trường hợp không chắc thì
vẫn quét, để sai lệch rơi về phía chặn.

## Không chọn

- **Sửa thẳng vendor:** phá cam kết giữ nguyên từng byte và mất đường đồng bộ.
- **Gọi axe-core thay bộ dò:** thêm phụ thuộc lớn vào lõi kit cho một lỗi đọc màu.
- **Đoán màu không đọc được thành một màu gần đúng:** biến «không biết» thành một con số trông như đã đo.

## Giới hạn đã biết

- `color(srgb …)`, thường là kết quả `color-mix`, báo không đo được chứ chưa đo thật.
- Ở tầng jsdom, chữ dùng `var()` giữ phán quyết cũ. Trình duyệt luôn tính `var()` trước nên tầng ấy không bị ảnh hưởng.
- Chromium thật chạy ở lượt chấm (AC-8) trên máy có Playwright, chưa vào CI của kit. CI chỉ giữ bảng điểm ảnh đã ghim.
- Gradient có điểm dừng trong suốt chưa được đo khi hồ sơ này viết. AC-5 đòi đo, nên bước làm có thể phải thêm một mốc vá.
