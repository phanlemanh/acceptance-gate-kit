## Trong hợp đồng

### Phép quét tĩnh (g) của DP10 không đo được lớp nó tuyên — chỗ đẩy cờ dùng template literal, hoặc chỉ esc() một nửa, đều đi lọt
- file: `tests/plugins/design-pass-nac.test.mjs:386`
- severity: medium
- AC: AC-14
- source: bugs

Chú thích khai phép quét này là «MỌI chỗ đẩy cờ có nối giá trị đều phải qua esc()», và nó tồn tại đúng để phủ những nhánh mà lưới hành vi (f) không với tới. Nhưng bộ đếm là:

    lines = srcText.split('\n').filter(l => /dpFlags\.push\(/.test(l));
    thieu  = lines.filter(l => /'\s*\+/.test(l) && !/esc\(/.test(l));

Hai lỗ:
(1) Điều kiện `/'\s*\+/` chỉ nhận dạng nối bằng nháy đơn + `+`. Một dòng `dpFlags.push(`… ${dp.reaction} …`)` vẫn được đếm vào `tong` nhưng KHÔNG bao giờ vào `thieu`.
(2) `!/esc\(/.test(l)` chỉ hỏi dòng CÓ chữ `esc(` hay không — `dpFlags.push('a' + esc(x) + ' b ' + y)` (một vế thoát, một vế không) được tính là sạch.

ĐÃ TÁI LẬP: đổi dòng scripts/gate-card.js:326 sang template literal không esc — `dpFlags.push(`Nấc phản ứng không nhận diện được: "${dp.reaction}" — …`)` — rồi chạy `DP_CASES=DP10 node tests/plugins/design-pass-nac.test.mjs`: vẫn `PASS: [DP10]` (đã trả file về nguyên trạng sau đó). Chiều đỏ của (g) cũng không bắt được vì nó chỉ tiêm `cardSrc.split('+ esc(').join('+ (')`, tức đúng dạng nối mà bộ đếm đã biết — tautology cùng lớp mà vòng 3 vừa sửa cho DP1/DP11. Sửa: đếm theo BIỂU THỨC nội suy (mọi `${…}` và mọi toán hạng `+` không phải literal) chứ không theo dấu nháy, và bắt lỗi theo từng vế thay vì theo dòng.

### Assert "chuỗi có mặt" trong khi lời hứa là QUAN HỆ — vế «cờ vàng NÊU TÊN giá trị lạ» (AC-10 nhánh c) là vế chết
- file: `tests/plugins/design-pass-nac.test.mjs:287`
- severity: high
- AC: AC-14
- source: measurement

Nhánh (c) của DP10 gồm hai assert rời: dòng 286 ghim câu cờ `'Nấc phản ứng không nhận diện được'`, dòng 287 ghim chuỗi `'nac-9'` — nhưng ghim trên `c.out` (TOÀN BỘ stdout), không trên nội dung cờ. Lời hứa AC-10 là QUAN HỆ «cờ vàng NÊU TÊN giá trị lạ đó», tức giá trị phải nằm TRONG cờ; assert hiện tại chỉ nói giá trị xuất hiện đâu đó trên thẻ. Mà thẻ LUÔN in id thô làm bản in dự phòng của nhãn (`gate-card.js` dòng 392: `<b>${esc(REACTION_LABEL[dp.reaction] || dp.reaction || '(chưa khai)')}</b>`), nên vế này tự thoả bất kể cờ có nêu tên hay không. Đây đúng lớp lỗi mà chú thích ngay trên dòng 284–285 cảnh báo ("đòi mỗi 'nac-9' là đo BẢN IN DỰ PHÒNG chứ không đo cờ") — sửa mới nửa vời: thêm được câu cờ, nhưng vế NÊU TÊN vẫn đo bản in dự phòng. File này đã có sẵn `flagsOf`/`coNacFlag` để đo đúng phạm vi mà nhánh (c) không dùng.

ĐÃ CHỨNG THỰC (phá vật thật): bỏ `+ esc(dp.reaction) +` khỏi câu cờ ở `scripts/gate-card.js` dòng 326 (cờ còn nguyên nhưng KHÔNG còn nêu tên giá trị lạ) → chạy `DP_CASES=DP10 node tests/plugins/design-pass-nac.test.mjs` vẫn `PASS: [DP10]`, exit 0. Người duyệt sẽ thấy cờ «Nấc phản ứng không nhận diện được» mà không biết giá trị lạ là gì, và không phép đo nào đỏ. Không mutant nào trong ma trận 5 mutant của E10 chạm vế này (m-proto/(h) chỉ đòi cụm «không nhận diện được» có mặt, không đòi nó nêu tên).

### Tuyên quét LỚP nhưng phép đo là điểm-case theo DÒNG — sweep tĩnh (g) của DP10 không phân biệt được dòng thoát-chuỗi nửa vời
- file: `tests/plugins/design-pass-nac.test.mjs:386`
- severity: medium
- AC: AC-14
- source: measurement

`demChoDayThieuEsc` được khai (chú thích dòng 380–385 + evals E10 mục (g)) là quét LỚP: «MỌI chỗ đẩy cờ có nối giá trị đều phải qua esc()», biến 'đã quét' thành số đếm được. Nhưng phép đo là hai bộ lọc TỪ VỰNG trên từng DÒNG: (a) tập quét = dòng khớp `/dpFlags\.push\(/` — bỏ hết chỗ đẩy cờ khác trong cùng file (`P.push(`<div class="flag ...`)` ở gate-card.js dòng 381, 553, 554, 565…), và bỏ mọi lời gọi `dpFlags.push(` trải nhiều dòng; (b) tiêu chí sạch = dòng có `/'\s*\+/` mà KHÔNG chứa `esc(` — tức chỉ cần dòng có MỘT `esc(` ở bất kỳ đâu là cả dòng được tha, dù nó nối thêm giá trị thô; và mọi nối bằng template literal (`${x}`) hay chuỗi nháy kép không lọt bộ lọc `'` + `+`. Chiều đỏ duy nhất (`cardSrc.split('+ esc(').join('+ (')`, dòng 396) gỡ TOÀN BỘ esc() nên chỉ chứng minh bộ đếm bắt được ca all-or-nothing, không chứng minh nó bắt được hồi quy một-chỗ — đúng thứ mà một phép quét lớp sinh ra để bắt. Lưới hành vi (f) không bù được: nhánh «không nhận diện được» theo cấu tạo không bao giờ nhận giá trị có ngoặc nhọn (giá trị có `<>` rẽ sang nhánh placeholder), và chính chú thích dòng 380–384 nêu đó là lý do (g) tồn tại.

ĐÃ CHỨNG THỰC (phá vật thật): thêm một nối chuỗi KHÔNG qua esc() vào chính dòng cờ đã có esc() ở `scripts/gate-card.js` dòng 326 — `... + esc(dp.reaction) + '" (thô: ' + dp.reaction_raw + ') — ...'` → chạy `DP_CASES=DP10` vẫn `PASS: [DP10]`, exit 0: (g) đếm 0 thiếu vì dòng có `esc(`, (f) không với tới nhánh đó.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Khoá `divergence:` được VIẾT vào sổ phiên nhưng KHÔNG có đầu ĐỌC nào**
  Người dùng thấy gì: Thông tin về việc phiên thiết kế có mở bước bàn hướng mới hay bỏ qua bước đó được ghi lại trong sổ phiên, nhưng không hiện ra trên thẻ mà người duyệt xem — người duyệt phải tự tìm thông tin này ở nơi khác nếu muốn biết.
  file: `scripts/gate-card.js`
  severity: medium
  Đề xuất: known-limits

- **Câu S1-D trong feature-loop SKILL.md: hai ngoặc đơn liền nhau làm lạc mục, và bỏ sót khoá `divergence:`**
  Người dùng thấy gì: Một đoạn hướng dẫn nội bộ mô tả bước kết thúc phiên thiết kế có thể bị đọc nhầm ý do cách đặt câu, khiến người hoặc máy làm theo hiểu sai điều kiện được coi là đã hoàn tất bước đó.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits

- **Executor mới chèn vào GIỮA khối chú thích và các khoá của hồ sơ khác trong config.yaml**
  Người dùng thấy gì: Một ghi chú giải thích trong tệp cấu hình dự án bị đặt lạc chỗ, khiến người đọc sau này dễ hiểu nhầm ghi chú đó đang mô tả một mục cấu hình khác với mục nó thực sự mô tả.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **CONTEXT.md chưa có term cho trục `reaction:` và chưa cập nhật danh sách «Hiện thân» của Ổ cắm**
  Người dùng thấy gì: Tài liệu thuật ngữ dùng chung của dự án chưa được bổ sung theo tính năng mới, nên người đóng góp sau có thể dùng từ ngữ không nhất quán khi nói về tính năng này.
  file: `CONTEXT.md`
  severity: low
  Đề xuất: known-limits

- **Khuôn config.yaml của acceptance-init gợi ý khoá phẳng `design_pass.ds_skill:` — dạng này không đọc được, ổ cắm im lặng coi như chưa khai**
  Người dùng thấy gì: Ví dụ mẫu hướng dẫn người dựng kho mới cách khai một tuỳ chọn thiết kế được viết theo cú pháp mà công cụ đọc cấu hình của dự án không hiểu được; nếu người dùng chép đúng theo mẫu, tuỳ chọn đó sẽ lặng lẽ không có tác dụng mà không ai được báo.
  file: `commands/acceptance-init.md`
  severity: medium
  Đề xuất: new-contract

- **`options:` còn nguyên chỗ trống của khuôn bị nuốt thành «không có bộ phương án» — không cờ, ngược hẳn cách `reaction:` được xử lý**
  Người dùng thấy gì: Khi phần mô tả bộ phương án trong phiên thiết kế bị bỏ trống dạng chưa điền (thay vì được điền thật), thẻ duyệt hiển thị y như thể phiên đó chưa hề bàn hướng mới — không có cảnh báo nào cho người duyệt biết rằng dữ liệu bị thiếu chứ không phải không tồn tại.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: new-contract

⚠ Cụm ngoài vùng phủ: 2/9 lỗi rơi vào file không bộ đo nào phủ (_acceptance/config.yaml, CONTEXT.md) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.