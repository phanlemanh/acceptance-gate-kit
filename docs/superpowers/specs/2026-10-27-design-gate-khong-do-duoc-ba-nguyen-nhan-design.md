# Thiết kế — cổng thiết kế trả KHÔNG-ĐO-ĐƯỢC cho ba nguyên nhân (hàng FL1)

Hồ sơ: `_acceptance/design-gate-khong-do-duoc-ba-nguyen-nhan/` · hàng FL1 của `docs/plans/lo-trinh-kit.json` · đợt
`design-floor-2710` · Gốc: `_acceptance/design-gate-che-do-chat/` + hạt giống
`docs/plans/2026-10-25-hat-giong-design-gate-dom-mu-tailwind-v4.md`.

## Vấn đề, đo lại 27/10

Cổng thiết kế chế độ dom (`scripts/design-gate.mjs` → `lib/design-detect.mjs` → bộ dò Impeccable vendored chạy trong
jsdom) báo `low-contrast` (P0) dựa trên màu jsdom tính ra. Ở ba hình dạng trang, màu ấy sai, nên cổng chặn oan:

| # | Hình dạng | Cơ chế đo được trên jsdom 24.1.3 | Trang của đo chéo 26/10 |
|---|---|---|---|
| 1 | CSS không áp được | Một `@layer` ở bất cứ đâu làm jsdom bỏ CẢ tệp CSS («Could not parse CSS stylesheet»); bản jsdom khác bỏ luật trong layer. Tệp CSS cục bộ hỏng hay vắng cũng vậy. Màu nền/chữ do tệp ấy khai biến mất. | jang (có, đi kèm #2) |
| 2 | Nền khai ở tổ tiên bị bỏ | `background: var(--bg)` hay `background: <gradient>, <màu>` viết dạng gộp: jsdom không tách ra `background-color`; bộ dò đi lên tới gốc, không thấy màu, coi là trắng. | jang ×3 |
| 3 | Chữ gradient cắt theo chữ | `background-clip: text` (hay `-webkit-`) hoặc `-webkit-text-fill-color: transparent`: chữ thật là gradient; bộ dò so màu `color` (thường trong suốt hoặc màu thừa kế) với một điểm dừng của gradient. | f01 ×1 · hyper-gloss ×1 |

Năm phát hiện sai = 3 (jang) + 1 (f01) + 1 (hyper-gloss); ba phát hiện đúng (f03 ×2, f05 ×1) phải giữ. Lời tóm ở trang
tri thức gán hyper-gloss cho «nền body bị bỏ» — đo lại thì nền #ffffff trong lời báo là điểm dừng gradient của chính tiêu
đề; cơ chế là #3.

Đếm ở ba kho tiêu thụ (chi tiết ở `opportunity.md`): 37 eval dom, 0 đang REJECT vì ba nguyên nhân, 2 REJECT sai trong lịch
sử crm đã được kho tự né, 1 REJECT đúng ở artifact-platform phải giữ; bộ chấm E20 của crm đòi đúng chữ `PASS`.

## Lựa chọn

1. **Lớp lọc sau bộ dò, trong `lib/design-detect.mjs`** (sổ d-…-2). `impeccableDetect({serialize:false})` trả phần tử
   kèm phát hiện. Với mỗi phát hiện `low-contrast`, lớp lọc soi phần tử và tổ tiên của nó:
   - **chữ gradient** — phần tử hay tổ tiên có `background-clip: text`/`-webkit-background-clip: text` hoặc
     `-webkit-text-fill-color` trong suốt, đọc ở style tính ra HOẶC ở chữ khai của luật CSS khớp phần tử và `style`
     nội dòng (jsdom không tính `-webkit-background-clip`);
   - nếu không: **nền tổ tiên bị bỏ** — nền trong lời báo là `#ffffff`, đi từ phần tử lên gốc: gặp nền đặc đọc được
     (rgb, alpha ≥ 0,5) thì dừng, đo được; gặp phần tử có gradient tính ra ngoài body/html thì dừng, đo được (bộ dò đã so
     với các điểm dừng — giữ ý của bản vendored); gặp phần tử KHAI nền (luật khớp hay nội dòng) mà style tính ra không
     đọc được thì: khai giải được thành đúng màu trắng → đo được, ngược lại → không đo được, ghi phần tử và giá trị khai;
     tới gốc không gặp gì → nền trắng mặc định của trình duyệt, đo được;
   - **CSS không áp được** (cấp trang, cộng thêm) — có `<style>` không rỗng mà `sheet` rỗng, có `<link rel=stylesheet>`
     trỏ tệp cục bộ (`file:`) mà `sheet` rỗng, hoặc mã nguồn CSS đọc được (nội dòng hay tệp cục bộ) chứa `@layer`. Áp cho
     phát hiện của phần tử KHÔNG ghim màu: phần tử tự khai `color` ở `style` nội dòng VÀ đường từ nó lên gốc mỗi phần tử
     đều khai nền ở nội dòng cho tới nền đặc đầu tiên (style nội dòng thắng mọi tệp CSS) thì đo được (sổ d-…-13, theo
     cách crm lưu bản chụp: 790 style nội dòng trên 729 thẻ ở bản chụp E20). Phần tử không ghim → KHÔNG-ĐO-ĐƯỢC là Hỏi-2
     (sổ d-…-14).
   Phát hiện rơi vào ít nhất một lý do: `do_duoc: false`, `ly_do: [<mã>…]`, ra khỏi `blocking` và `p0_count`.
2. **Phán quyết** FAIL > KHÔNG-ĐO-ĐƯỢC > PASS: còn phát hiện chặn đo được → `REJECT` 2; không còn mà có phát hiện không đo
   được → `KHONG-DO-DUOC`; còn lại `PASS`. `design-gate.mjs` giữ hợp đồng mã thoát: `KHONG-DO-DUOC` thoát 0, dưới
   `--require-measured` thoát 5; JSON thêm `do_duoc: false`, `ly_do_khong_do_duoc` (một câu), `khong_do_duoc` (số phát
   hiện); stderr một dòng `design-gate: dom không đo được <n> phát hiện tương phản (<mã>…) — …`.
3. **Trang CSS không áp được mà không có phát hiện tương phản giữ PASS** (sổ d-…-3) — không đổi mặc định cho crm E20.
4. **Ba mã lý do** (một nguồn, hằng xuất từ lib): `css-khong-ap-duoc` · `nen-to-tien-bi-bo` · `chu-gradient`. Chữ
   gradient thắng nền tổ tiên (sổ d-…-5).
5. **Bộ đo** ở `tests/design-eval/khong-do-duoc.test.mjs` (ca `KD<n>-…`), fixture SINH trong lượt bởi
   `tests/design-eval/lib/sinh-trang.mjs` vào thư mục tạm; bản gốc để so (AC-1, AC-8) là `git archive <merge-base> lib vendor
   scripts` (trọn thư mục). Ba đột biến chép trọn `lib/` + `vendor/` + `scripts/` vào thư mục tạm rồi gỡ ĐÚNG một dòng có
   nhãn của lớp lọc; dòng phải khớp đúng một lần, không thì ca đỏ «DOT_BIEN_LECH»; tập ca đỏ của mỗi đột biến so BẰNG một
   tập viết trước, ca ngoài tập phải xanh trên chính bản đột biến. Mọi bản (gốc, mới, đột biến) chạy `design-gate.mjs` của
   bản đó với `--jsdom <thư mục tests/design-eval suy từ vị trí tệp ca>`; ca KD0 in phiên bản jsdom nạp được, khác 24.1.3
   thì đỏ «JSDOM_LECH» — tách lỗi hạ tầng khỏi lỗi vật.
6. **CI** (CỘNG, sổ d-…-7, chờ người ở Cổng Phạm vi): job `design-eval` — `npm ci --prefix tests/design-eval` với
   `package-lock.json` ghim jsdom 24.1.3, rồi `DESIGN_EVAL_CAN_DOM=1 bash tests/design-eval/run-tests.sh` (cờ làm ca dom bị
   bỏ qua thành FAIL). Hai lệnh của job rút từ một nguồn trong `kdd.sh`; ca KD8-ci so job với nguồn ấy.

## Ngoài vòng

Cờ lạ thành BLOCKED; nền bán trong suốt; `gray-on-color` (P0 cùng phép đo màu, không gặp trong đo chéo); trang CSS không
áp được mà không có phát hiện (sổ d-…-3); stylesheet từ xa không tải được (mạng); sửa bộ dò vendored để đo đúng.

## North Star

Không ghi tệp nào sau S4 · không thêm lượt gọi người ngoài cổng (T3 trần 4: Đáng đã ký, Phạm vi, 1.5, Bằng chứng) ·
chi phí lúc chạy 0 token, mỗi trang thêm vài mili giây duyệt phần tử; chi phí vòng ở `usage-report.md` · mỗi nhánh mới có
ca đỏ (đột biến) và ca đối chứng xanh trên cùng fixture.
