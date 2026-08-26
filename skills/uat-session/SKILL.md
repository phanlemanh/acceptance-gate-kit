---
name: uat-session
description: Nghi thức PHIÊN NGHIỆM THU (Cổng Giá trị) trên sản phẩm THẬT sau flag — mời người dùng đại diện, chấm kín trước thảo luận, đặt số đo cạnh ngưỡng đã khai ở Cổng Đáng, rồi người ký release/iterate/kill. Dùng sau khi một vòng đã signed-off và cơ hội có ngưỡng UAT. KHÔNG dùng cho vòng không có opportunity (đường B/C/E ship thẳng), KHÔNG tự chấm hay tự điền verdict thay người, KHÔNG sửa ngưỡng sau khi thấy số.
---

# uat-session — phiên nghiệm thu giá trị

**Một mặt phẳng làm việc:** phiên chạy trong Claude Code, trên sản phẩm thật
đang chạy sau flag. Skill này DẪN phiên và GHI hồ sơ; nó không quyết — verdict
là chữ của người ký.

**KILL tại cổng này là THÀNH CÔNG của quy trình** — câu trả lời mua bằng giá
một vòng dựng, không phải thất bại của người làm. Nói câu đó ra khi trình
quyết định; đừng để người ký cảm thấy họ phải bảo vệ code đã viết.

> Đường dẫn plugin dưới đây giữ dạng `${CLAUDE_PLUGIN_ROOT:-$PLUGIN_ROOT}` —
> vế sau là đường lùi cho môi trường không đặt biến thứ nhất.

## 0. Điều kiện vào — kiểm trước, không hỏi

- `_acceptance/<slug>/contract.md` có `status: signed-off` hoặc `machine-cleared`
  (máy đã thông — làn V xanh-sạch, không chữ ký người; lưới trước-merge đã kiểm
  lời khai đó, nên nó vào phiên ngang một hồ sơ đã ký).
- `_acceptance/<slug>/opportunity.md` tồn tại và có ngưỡng UAT đã chốt tại
  Cổng Đáng (section "Ngưỡng chết / ngưỡng UAT"). «Đã chốt» = không còn `…`, và không còn
  tiền tố `[đề xuất]` — đề xuất của máy chưa phải ngưỡng của người.
  Ba ca không mở phiên, mỗi ca một câu, KHÔNG treo:
  - section có một dòng bắt đầu `Không đo được — ` → DỪNG một dòng: «ô này khai
    không đo được ở Cổng Đáng — vòng không có người dùng cuối thì không có phiên
    nghiệm thu; hồ sơ đã đóng, không ai phải làm gì tiếp».
  - ngưỡng còn `…` hoặc còn `[đề xuất]` → DỪNG và nêu ĐÚNG hai lối có tên: điền
    ngưỡng vào ô, hoặc khai một dòng «Không đo được — <lý do>» kèm entry sổ
    quyết định. Không có lối thứ ba, và không có đường sửa tay `decision`.
- Sản phẩm thật đã chạy sau flag để người dự bấm được — điều kiện này đọc từ
  **nhật-ký-vấp** của Lái-thử Người-lạ, `_acceptance/<slug>/stranger-drive.md`
  (khuôn: `${CLAUDE_PLUGIN_ROOT:-$PLUGIN_ROOT}/skills/acceptance/references/stranger-drive-template.md`;
  nghi thức: `docs/lai-thu-nguoi-la.md` của kit), không từ lời khai. Khoá máy đọc
  từ nhật-ký (khai một chỗ, răng đối chiếu với khuôn):
  <!-- STRANGER-KEYS-READ: chan slug ran_at variant -->
  - `chan: 0` **và** `slug` khớp slug phiên **và** `ran_at` không cũ hơn
    `verified_at` MUỘN NHẤT trong `evidence-report.md` (lần chấm máy cuối)
    → điều kiện THOẢ BẰNG BẰNG CHỨNG;
    nói một dòng (ván nào, biến thể nào — đọc `variant`) rồi đi tiếp.
  - `chan` > 0 → DỪNG, nêu từng vấp CHẶN, và chỉ đường quay lại: chạy lại
    lái-thử cho CHẶN về 0 — sửa là việc của vòng, không phải của phiên này.
  - File vắng · frontmatter không đọc được · `slug` lệch · `ran_at` cũ hơn lần
    chấm máy cuối → đi tiếp với **cờ vàng nêu lý do có tên** («chưa lái-thử» /
    «không đọc được nhật-ký-vấp» / «nhật-ký của vòng khác» / «nhật-ký cũ hơn
    bản chấm»); điều kiện lúc đó là lời khai, phiên vẫn mở được — không chặn,
    không hỏi.

Thiếu bất kỳ điều nào → DỪNG, nói rõ thiếu gì. Vòng KHÔNG có `opportunity.md`
đi đường B/C/E: ship thẳng, không có phiên nghiệm thu — đừng dựng phiên giả
cho nó.

## 1. Dựng hồ sơ TRƯỚC khi mời người

Chép khuôn từ `${CLAUDE_PLUGIN_ROOT:-$PLUGIN_ROOT}/skills/acceptance/references/uat-session-template.md` sang
`_acceptance/<slug>/uat-session.md`, `stage: scheduled`, `verdict` để TRỐNG.

**Chép NGUYÊN VĂN ngưỡng** từ `opportunity.md` vào section ngưỡng. Từ giây
phút này ngưỡng là hằng số: đổi phép đo sau khi đã thấy số là gian, dù lý do
nghe hợp lý tới đâu. Cần đổi thật → ghi `[SUPERSEDED <ngày> — <phép đo mới>]`
bên `opportunity.md`, GIỮ bản gốc, và phiên dừng lại chờ Cổng Đáng.

Có nhật-ký-vấp → chép các câu «Chuyển phiên người» của nó vào khối «Chấm kín»
làm câu gợi cho từng người dự — máy dọn bàn, người chấm; không câu nào trong
đó là verdict.

## 2. Mời người dự

Ghi bảng: tên · vai · đại diện cho ai. Người dùng đại diện thật ưu tiên hơn
người trong đội — đội đã biết trước câu trả lời mong muốn, nên điểm của họ nói
về kỳ vọng chứ không về sản phẩm.

## 3. Chấm kín TRƯỚC thảo luận

Thu điểm và nhận xét của TỪNG người trước khi mở thảo luận chung. Nghe điểm
người khác trước là hỏng phép đo: cả phòng trôi về ý của người nói to nhất.
Điền xong khối "Chấm kín" mới được viết khối "Thảo luận" — thứ tự trong file
là vết.

Cùng lúc chấm kín, hỏi từng người **một câu ràng buộc**: "anh/chị sẽ gửi cho
khách nào, khi nào?" — ghi nguyên văn. Người thật sự tin sẽ nêu được tên và
mốc; câu trả lời chung chung tự nó là dữ liệu.

## 4. Đặt số đo cạnh ngưỡng

Điền bảng: thước · ngưỡng đã khai · số đo được · SỐNG/CHẾT. Số lấy từ đường đo đã khai
thật, không từ cảm giác trong phòng. Thước nào chưa đo được thì ghi CHƯA ĐO —
không đo mà im lặng là gian.

## 5. Người ký quyết định

Trình gọn bốn thứ: ngưỡng, số, chấm kín, câu ràng buộc. Rồi hỏi ĐÚNG MỘT câu:
giao rộng, lặp thêm, hay dừng?

Người ký điền `verdict`, `decided_by`, `decided_at`, và `stage: held`. **Agent KHÔNG điền verdict
thay người**, kể cả khi số đã rõ tới mức chỉ còn một lựa chọn hợp lý — chữ ký
là thứ duy nhất phiên này sinh ra mà máy không thay được.

## 6. Sau khi ký

- **Làm mới bản đồ sản phẩm — chỉ khi repo đã bật.** Đọc
  `risk_tiers.t1_skip_globs` trong `_acceptance/config.yaml`. KHÔNG thấy
  `PRODUCT-MAP.md` trong danh sách → repo dựng trước acceptance-gate 1.31.0:
  **BỎ QUA bước này**, đừng thêm bản đồ vào commit, và in ghi chú dưới đây —
  nếu không, chính commit chữ ký làm bằng chứng cũ đi và lưới trước-merge chặn
  merge mà không có lối ra (ADR 0007). Cổng Giá trị là thân cổng người thứ
  NĂM: bốn thân kia (`/acceptance-gate:approve`, `/acceptance-gate:signoff` ở cả hai harness) đã có đường
  đọc-cũ này, thiếu ở đây thì chính phiên nghiệm thu dựng ra cái bẫy đó.

  > Bản đồ sản phẩm chưa bật cho repo này. Bật bằng hai dòng trong
  > `_acceptance/config.yaml`: thêm `- "PRODUCT-MAP.md"` vào
  > `risk_tiers.t1_skip_globs`, và `product_map: "node
  > ${CLAUDE_PLUGIN_ROOT:-$PLUGIN_ROOT}/scripts/product-map.mjs --root . --check"` vào
  > `executors.script` — rồi chạy executor đó trong CI.

  Có trong danh sách → chạy
  `node ${CLAUDE_PLUGIN_ROOT:-$PLUGIN_ROOT}/scripts/product-map.mjs --root .` (repo tự host
  kit chạy `node scripts/product-map.mjs --root .`). Bản đồ vừa có một ô đổi
  chủ; để nó lệch là để người sau đọc một bản đồ nói dối.
- Bước kế theo verdict — mỗi lối có CHỦ, không lối nào bỏ lửng:
  - `release` → nghi thức phát hành của repo.
  - `iterate` → in đúng một dòng: «mở vòng kế bằng `/feature-loop:feature-loop
    <mô tả>` — hồ sơ mới, ô cơ hội giữ nguyên với `decision: iterate`».
  - `kill` → ghi `stage: archived` vào `opportunity.md` CÙNG lượt commit verdict.
    Đó là cái làm hồ sơ «đã đóng có hồ sơ» ở mọi bộ đọc; bỏ bước này thì ý đã
    dừng vẫn hiện ra như đang chờ người.
- Append kết quả đo vào `opportunity.md` — vòng đo sau ship là input của retro.
