---
schema_version: 1
feature: cổng thiết kế chế độ dom trả KHÔNG-ĐO-ĐƯỢC kèm mã nguyên nhân, không REJECT, khi CSS không áp được, khi nền khai ở tổ tiên bị bỏ qua, hay khi chữ gradient cắt theo chữ
slug: design-gate-khong-do-duoc-ba-nguyen-nhan
owner: phanlemanh@gmail.com
risk_tier: T3               # lib/design-detect.mjs nằm dưới t3_paths (lib/**); hàng FL1 ước T2
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-27-design-gate-khong-do-duoc-ba-nguyen-nhan-design.md
status: implemented
approved_by: Manh Phan
approved_at: 2026-10-27T05:32:04Z
---

# Acceptance Contract: design-gate-khong-do-duoc-ba-nguyen-nhan

## Context

Gốc: `_acceptance/design-gate-che-do-chat/` (trạng thái KHÔNG-ĐO-ĐƯỢC + mã 5 dưới `--require-measured`) và hạt giống
`docs/plans/2026-10-25-hat-giong-design-gate-dom-mu-tailwind-v4.md`. Đo chéo 26/10: P0 tương phản của cổng thiết kế chế
độ dom sai 5 trên 8 lần và chặn oan 3 trên 5 tệp. Mã trong hợp đồng: phát hiện «tương phản» = `low-contrast`; ba mã lý
do `css-khong-ap-duoc` · `nen-to-tien-bi-bo` · `chu-gradient`; «bản gốc» = cây `lib vendor scripts` ở merge-base với
nhánh chính. Mọi trang trong các ca do mã SINH trong lượt.

## Criteria

- AC-1: Given ba trang sinh mô phỏng ba trang của đo chéo — {f01: tiêu đề `background-clip: text` trên nền kem · hyper-gloss:
  body `background-color: #050505`, tiêu đề gradient `-webkit-text-fill-color: transparent` · jang: body
  `background: var(--bg)` đen, tiêu đề/thẻ chữ trắng, kèm một tệp CSS cục bộ có `@layer`}, When chạy cổng dom trên bản
  gốc rồi trên bản mới, Then bản gốc ra đúng năm phát hiện tương phản sai (1 · 1 · 3, chuỗi chi tiết ghim nguyên văn) và
  REJECT ba trang; bản mới ra KHÔNG-ĐO-ĐƯỢC ở cả ba trang, năm phát hiện ấy mang `do_duoc: false` với đúng mã nguyên nhân
  {f01: chu-gradient · hyper-gloss: chu-gradient · jang: css-khong-ap-duoc + nen-to-tien-bi-bo}, không phát hiện chặn
  nào; tệp fixture thật `tests/design-eval/fixtures/f01-gradient-cream.html` cũng ra KHÔNG-ĐO-ĐƯỢC chu-gradient.
- AC-2: Given trang chữ nhạt trên nền tối mà nền tối nằm trong CSS không áp được, ở ba dạng {`@layer` trong tệp CSS cục
  bộ · `@layer` trong `<style>` · thẻ link trỏ tệp CSS cục bộ vắng}, và trang có `@layer` với chữ #aaaaaa khai nội dòng
  nhưng nền KHÔNG ghim nội dòng, When chạy cổng dom, Then mỗi trang KHÔNG-ĐO-ĐƯỢC với đúng mã nguyên nhân css-khong-ap-duoc (kết
  cục của trang thứ tư theo Hỏi-2 ở Cổng Phạm vi); và trang có `@layer` mà không có phát hiện tương phản nào vẫn PASS ở bản
  mới y như bản gốc.
- AC-3: Given nền tối khai ở body mà jsdom không đọc được ở dạng `background: var(--bg)`, When chạy cổng dom, Then
  KHÔNG-ĐO-ĐƯỢC với đúng mã nguyên nhân nen-to-tien-bi-bo; đối chứng cùng khuôn trang: nền tối đọc được (`background: #111`
  dạng gộp, chữ #333) và nền trắng khai bằng biến (`background-color: var(--paper)` = #fff, chữ #bbb) đều REJECT với phát
  hiện đo được; dạng gộp `background: radial-gradient(…), #111` (jsdom bỏ hẳn) vẫn REJECT như trước vòng — giới hạn đã
  khai (đổi khuôn ở Cổng Bằng chứng lượt 2).
- AC-4: Given chữ gradient ở ba dạng {`background-clip: text` + `color: transparent` · chỉ `-webkit-background-clip:
  text` · `-webkit-text-fill-color: transparent` trên nền gradient}, When chạy cổng dom, Then KHÔNG-ĐO-ĐƯỢC với đúng mã nguyên nhân
  chu-gradient, kể cả khi chữ nằm trong một phần tử con của phần tử cắt theo chữ.
- AC-5: Given ba trang đối chứng tương phản thật trên CSS đọc được {chữ #aaaaaa trên nền trắng khai ở tệp CSS cục bộ
  không `@layer` · chữ #333333 trên body nền #111111 · trang có tiêu đề gradient VÀ đoạn chữ #999999 trên nền trắng}, When
  chạy cổng dom, Then cả ba REJECT mã 2 với phát hiện tương phản đo được trong `blocking`; ở trang thứ ba phát hiện của tiêu
  đề nằm trong danh sách với `do_duoc: false` (FAIL > KHÔNG-ĐO-ĐƯỢC); trang CSS không áp được có chữ xám trên nền màu vẫn
  REJECT vì `gray-on-color` (P0 khác tương phản — chế độ dom không có luật ảnh hỏng); trang có `@layer` mà chữ #aaaaaa và nền #ffffff của đoạn đều ghim nội dòng vẫn REJECT với phát hiện đo
  được; fixture f03 vẫn REJECT hai phát hiện đo được.
- AC-6: Given ba kết cục {KHÔNG-ĐO-ĐƯỢC · REJECT · PASS}, When chạy `design-gate.mjs` có và không có `--require-measured`,
  Then mã thoát lần lượt {0 · 2 · 0} không cờ và {5 · 2 · 0} có cờ; JSON KHÔNG-ĐO-ĐƯỢC có `verdict: "KHONG-DO-DUOC"`,
  `do_duoc: false`, `ly_do_khong_do_duoc` nêu đủ mã nguyên nhân, `khong_do_duoc` = số phát hiện không đo được, `p0_count` và
  `blocking` không đếm chúng; stderr đúng một dòng bắt đầu `design-gate: dom không đo được`; JSON REJECT và PASS không có
  `do_duoc`.
- AC-7: Given ba đột biến trên bản sao trọn `lib/` + `vendor/` + `scripts/`, mỗi đột biến gỡ đúng một dòng có nhãn của
  một nhánh, When chạy CHÍNH phép đo của AC-1…AC-5 trên bản sao, Then bản lành chạy trước xanh trọn; với mỗi đột biến, tập
  ca đỏ BẰNG tập viết trước — gỡ nhánh CSS: {layer-tep · layer-style · link-vang · layer-khong-ghim · jang · css-p0-khac}; gỡ nhánh nền:
  {nen-bien · jang · hsl-toi · van-toi · oklch-toi · nen-chi-gradient · html-chi-gradient}; gỡ nhánh gradient: {clip · webkit-clip · fill · con · f01 · f01-that · hyper-gloss ·
  gradient-va-that} — và
  mọi ca ngoài tập xanh trên chính bản đột biến (bản đột biến còn nạp và chạy được); dòng đột biến không khớp đúng một lần
  → đỏ «DOT_BIEN_LECH».
- AC-8: Given bộ ca design-eval đầy đủ (T01–T06 + ca KD), bản Impeccable vendored và các đích chế độ dom của ba kho tiêu
  thụ trên máy, When chạy, Then design-eval xanh với jsdom ghim 24.1.3 có mặt (mọi bản — gốc, mới, đột biến — nạp jsdom
  từ `tests/design-eval/`, lệch phiên bản thì đỏ «JSDOM_LECH») và ĐỎ khi được đòi chạy dom mà thiếu jsdom;
  `vendor/impeccable/` không đổi byte nào so với merge-base; vi phân bản gốc ↔ bản mới tìm đủ ba kho (thiếu kho → thoát 2
  nêu tên), số đích đổi phán quyết bằng 0 (đếm 27/10), in số theo kho và theo mã nguyên nhân kèm sha đầu của kho, không in đường
  dẫn hay nội dung của kho; nếu Hỏi-1 được duyệt, lệnh của job CI design-eval bằng đúng lệnh ca hồi quy chạy.

- AC-9: Given nền thân trang viết bằng cú pháp khác hex/rgb hoặc kèm lớp ảnh — {trắng: `hsl(var(--background))` dạng
  riêng và dạng gộp · `var(--bg) url(grain.png)` · chỉ `background-image: url(…)` · `oklch(1 0 0)`} và {tối: cùng ba cách
  viết hsl · vân · oklch}, chữ nhạt (#bbbbbb trên trắng, #eeeeee trên tối) — When chạy cổng dom, Then năm trang nền trắng
  REJECT mã 2 với phát hiện đo được «text #bbbbbb on #ffffff», ba trang nền tối KHÔNG-ĐO-ĐƯỢC đúng mã nguyên nhân
  nen-to-tien-bi-bo; và vi phân ba kho trên ba kho giả do ca sinh: jsdom thật → thoát 0 «đổi 0», cổng không chạy được ở
  các đích (jsdom vắng) → thoát 2 «không đo được ở đây: <n> đích», không thoát 0. (Nâng phạm vi ở Cổng Bằng chứng
  27/10 — Ngoài-1, 4, 5, 6, 7 của lượt chấm 1.)

## Coverage

Trục (kê tay — sổ «bỏ coverage-scan»): nguyên nhân {css · nền · gradient · không nguyên nhân} × dạng khai {theo AC-2,
AC-3, AC-4} × kết cục {KHÔNG-ĐO-ĐƯỢC · REJECT đo được · PASS} × cờ {có · vắng} × lớp đo {bản gốc · bản mới · đột biến}.
Thêm trục ghim nội dòng {màu và nền ghim · chỉ màu ghim} trên trang css.
AC-1 (tái lập ba trang × gốc/mới) · AC-2 (css × ba dạng + chỉ màu ghim + trang không phát hiện) · AC-3 (nền × hai dạng + hai đối chứng) ·
AC-4 (gradient × ba dạng + con) · AC-5 (không nguyên nhân × REJECT, cùng trang với gradient, P0 khác trên trang css, css × màu và nền ghim) ·
AC-6 (kết cục × cờ) · AC-7 (đột biến × ba nhánh) · AC-8 (hồi quy + vi phân ba kho + vendored) ·
AC-10 (nhánh nền × {dải màu ở thân/gốc · @media không áp · lớp phủ trong suốt · nội dòng thắng luật · màu lạ}; vi phân × 0 đích) ·
AC-9 (cú pháp màu nền {hsl · oklch · gộp kèm ảnh · chỉ ảnh} × {trắng · tối}; vi phân × {đo được · không đo được}).
Ô vắng có chủ đích: `gray-on-color` dưới ba nguyên nhân; trang không phát hiện × css → PASS là ô đã chọn (sổ d-…-3).

- AC-10: Given nhánh nền tổ tiên chỉ đọc style jsdom đã tính (không đọc lại chữ của luật CSS) — {thân trang chỉ có dải màu
  tối · gốc trang chỉ có dải màu tối} và {trang sáng có khối `@media (prefers-color-scheme: dark)` nền tối · khối `@media
  print` nền đen · lớp phủ `hsla(0, 0%, 0%, 0.04)` · nền `var(--sang)` khai trên thẻ thắng luật `var(--toi)` · tiêu đề
  chỉ tô dải màu trong `@media print`} · {nền `color-mix(…)`} — When chạy cổng dom, Then hai trang dải màu tối
  KHÔNG-ĐO-ĐƯỢC mã nguyên nhân nen-to-tien-bi-bo; năm trang sau REJECT với phát hiện đo được «text #cccccc on #ffffff»;
  trang color-mix ra đúng phán quyết và mã thoát của bản gốc, không phát hiện nào bị gắn không đo được; và vi phân trên ba
  kho không có đích dom nào thoát 2 «không có đích dom nào», không thoát 0. (Trả lại ở Cổng Bằng chứng lượt 2: đổi khuôn
  nhánh nền — chỉ đọc style tính ra.)

## Đường đo

- «Năm P0 sai … đều ra KHÔNG-ĐO-ĐƯỢC đúng lý do» — số từ ca KD1 (bản gốc ra đúng năm chi tiết, bản mới gắn đúng mã
  nguyên nhân cho từng chi tiết) · AC-1 bảo đảm.
- «Ba ca tương phản thật trên CSS đọc được vẫn REJECT» — số từ ca KD5 (ba trang đối chứng, mã 2, chi tiết ghim) · AC-5.
- «Ba đột biến gỡ từng nhánh đỏ đúng ca» — số từ ca KD7 (tập ca đỏ bằng tập viết trước) · AC-7.
- Đường nền cho tiêu chí «tỉ lệ chặn sai» của FL5 — số từ vi phân ba kho (E8b: đích đổi phán quyết theo mã nguyên nhân) ·
  AC-8.

## Out of scope

- Trang CSS không áp được mà không có phát hiện tương phản nào thành KHÔNG-ĐO-ĐƯỢC — đổi mặc định (crm E20 đòi `PASS`);
  ngưỡng mở: ≥1 kho xin chế độ chặt cho ca này, hoặc owner gọi tên.
- Cờ lạ thành BLOCKED và nền bán trong suốt — hai đề xuất còn lại của hạt giống 25/10, hạt giống vẫn mở.
- `gray-on-color` (P0 dùng chung phép đo màu) — không gặp trong đo chéo hay ở ba kho.
- Stylesheet từ xa (http/https) không tải được — phụ thuộc mạng lúc chấm; không tính là CSS không áp được.
- Sửa bộ dò vendored để đo đúng màu thay vì nói không đo được.

## Notes

- Known limits — chọn ở Cổng Bằng chứng 2026-10-27:
  - Trang có nền thân viết gộp «dải màu, màu dự phòng» (`background: radial-gradient(…), #111`) vẫn bị chặn như trước
    vòng: jsdom bỏ hẳn khai báo này nên nhánh nền không thấy nó.

- Đếm trước khi sửa (27/10): 37 eval dom ở ba kho, 0 đang REJECT vì ba nguyên nhân; 2 REJECT sai lịch sử ở crm (đã né), 1
  REJECT đúng ở artifact-platform (phải giữ). Không kho nào dựa vào các REJECT sai để chặn thật.
- Hàng FL1 ước T2; vật chạm `lib/` nên vòng chạy T3 (Gate 1.5 duyệt kế hoạch).
- Hỏi-1 (sổ d-20261027T035956Z-7): thêm job CI design-eval. Hỏi-2 (sổ d-20261027T040658Z-14): phần tử không ghim màu nội
  dòng trên trang CSS không áp được thành KHÔNG-ĐO-ĐƯỢC. Cả hai đổi kết cục một ca — AC-2 trang thứ tư theo Hỏi-2; E8c tồn
  tại khi Hỏi-1 «có».
