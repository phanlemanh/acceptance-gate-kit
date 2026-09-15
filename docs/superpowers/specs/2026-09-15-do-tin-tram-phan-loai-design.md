# Độ tin của trạm phân loại phạm vi — thiết kế

**Ngày:** 2026-09-15 · **Slug:** `do-tin-tram-phan-loai` · **Hạng:** T2 · **Surface:** cli
**Vòng meta DUY NHẤT của cửa sổ 2.14** (luật (b) — owner gọi tên 15/09).
**Căn cứ đã ký:** `_acceptance/release-2-13-0/contract.md` khối Notes §4 mục 2.

## Vấn đề — đo được, không suy đoán

Trạm Scope-triage trong `feature-loop/workflows/acceptance-verify.js` gửi N phát hiện
cho MỘT tác tử phân loại, rồi ghép kết quả trả về với phát hiện gốc bằng khoá
`<tệp đã chuẩn hoá> :: <tiêu đề>` — tức bằng chính nội dung mà tác tử phải **chép lại
nguyên văn**. Phát hiện nào không ghép được thì mang cờ `unclassified`, và một dòng luật
kéo cả lượt về fail-toward-human:

- `unclassified` bất kỳ ⇒ `triageFailed = true` ⇒ bước bác bỏ chạy trên **TOÀN BỘ** phát
  hiện thay vì chỉ phát hiện trong hợp đồng.

Đây là luật ĐÚNG — máy không biết lượt này sạch thì không được ký một PASS sạch bong.
Cái sai không nằm ở luật, nằm ở chỗ **điều kiện kích hoạt nó quá dễ nổ**. Số đo của vòng
`khoi-tim-loi-tra-phi-theo-vat`: trạm trả thiếu mục ở **3 trên 6 lượt**, và mỗi lần như
vậy phần tiết kiệm của nhát cắt T1 bốc hơi — 5 tác tử bác bỏ thành 10, rồi 15 ở lượt 1b.

Nhát cắt lớn nhất mà mốc 2.13.0 vừa ship đang hỏng ở **một nửa số lượt**, và nó hỏng theo
đường im: lượt vẫn ra kết quả, chỉ là đắt gấp ba.

## Hai nguyên nhân, tách bạch

Bản thân chữ «trả thiếu» gộp hai chuyện khác hẳn nhau, và chúng cần hai nhát khác nhau:

1. **Trôi khoá.** Tác tử có trả lời cho phát hiện đó, nhưng viết lại `file` (rút gọn,
   đổi tuyệt-đối/tương-đối, đổi thư mục) hoặc `title`, nên khoá không khớp. Chính mã
   nguồn đã gọi tên lớp này: *«Đây là khớp LLM-viết→máy-đọc: bỏ LLM ra khỏi định danh
   của khoá, đừng trông vào việc nó chép nguyên văn một đường dẫn dài.»* Lưới hiện có
   (gỡ-mơ-hồ theo `title`) chỉ cứu được ca `title` duy nhất ở **cả hai** phía.
2. **Bỏ sót.** Tác tử trả về ít mục hơn số gửi đi — không có dòng nào cho phát hiện ấy,
   dù khoá có chuẩn đến đâu.

Hồ sơ 2.13 §4 gọi tên nhát cho (2). Chữa (2) mà bỏ (1) là vá ở tầng dưới tầng của lỗi:
CLAUDE.md quy định dạng nghiệm đúng tầng cho mọi lớp lỗi lặp là *biến bất biến từ
đầu-người sang vật-máy-giữ*, và định danh do LLM chép lại chính là bất biến-đầu-người.
Nên thiết kế này làm **cả hai**, theo đúng thứ tự nhân quả: chặn trôi trước, rồi mới hỏi
lại phần thật sự sót.

## Nhát 1 — định danh do máy đúc

Trước khi gửi, máy gán cho mỗi phát hiện một mã ngắn `t1`, `t2`, … theo thứ tự của danh
sách gửi đi. Mã đi trong tải gửi; lược đồ trả về **đòi** mã đó. Ghép theo ba nấc, fail-
closed từ trên xuống:

1. ghép theo mã;
2. mã không có → khoá `(tệp chuẩn hoá :: tiêu đề)` như cũ;
3. vẫn không có → lưới gỡ-mơ-hồ theo tiêu đề duy-nhất-cả-hai-phía như cũ.

Hai lưới chống tin mù, vì một mã ngắn dễ chép đúng cũng dễ gán bừa:

- **Mã lạ** — dòng trả về mang mã không nằm trong tập gửi đi thì **bỏ**, ghi log; không
  được ghép sang dòng khác.
- **Tiêu đề làm chữ ký kiểm** — mã khớp nhưng tiêu đề trả về khác tiêu đề đã gửi ⇒ máy
  không biết dòng này phân loại cho phát hiện nào ⇒ **không ghép** (về `unclassified`).
  Mã giữ vai ĐỊNH DANH, tiêu đề giữ vai CHỮ KÝ KIỂM; chỉ so tiêu đề, không so đường dẫn —
  đường dẫn dài mới là thứ trôi.

Nếp này không phải sáng chế của kit: đúng giao thức tool-use mà chính phiên này đang chạy
dùng một mã do máy đúc (`tool_use_id`) để nối lời gọi với kết quả, không bao giờ nối bằng
cách bắt mô hình chép lại nội dung.

## Nhát 2 — hỏi lại đúng MỘT lần, chỉ phần còn thiếu

Sau khi ghép lượt 1: còn phát hiện nào chưa có dòng thì dispatch **thêm đúng một** tác tử
phân loại, mang **chỉ** những phát hiện ấy, cùng lược đồ và cùng luật phân loại. Gộp kết
quả. Vẫn thiếu ⇒ `triageFailed = true` như cũ — **luật fail-toward-human không đổi một
chữ**, chỉ dời chỗ nổ ra sau một lần hỏi lại.

Trần cứng: hỏi lại nhiều nhất MỘT lần cho cả trạm, không phải một lần mỗi phát hiện.
Tác tử hỏi-lại chết cũng tính là vẫn thiếu — không có nhánh thử lại vô hạn.

Phép tính chi phí là lý do nhát này đáng: một tác tử `sonnet` phân loại một tập con, so
với N tác tử bác bỏ chạy trên toàn bộ danh sách. Ở lượt đã đo, đó là 1 lượt gọi thêm thay
cho 5–10 lượt bác bỏ thừa.

## Nhát 3 đã THU PHẠM VI (owner quyết 15/09 tại chốt DỪNG-VÁ)

Bản đầu có nhát thứ ba: một dòng sổ `kind: "triage"` cộng một ma trận chứng rằng mọi bộ đọc
bằng chứng bỏ qua nó. Hai lượt chấm cho thấy khuôn ấy TỰ SINH finding — nó bắt chứng một
tính chất phủ định trên chín bộ đọc khác giao diện, nên mỗi bộ cần một khẳng định riêng tay
và mỗi khẳng định ấy lại là một phép đo mới cần hai chiều: lượt 1 vá được một mục, lượt 2 lộ
thêm bốn mục CÙNG LỚP. Ba dòng sổ có sẵn của kit (`finding`, `panel`, `baseline`) chưa bao
giờ phải chứng điều này. Owner thu phạm vi; đề bài đi vào hạt giống cửa sổ sau.

## Nhát 3 (thay vào) — tải gửi đi không méo vì ký tự đô-la

Lời nhắc cho một danh sách con dựng bằng `String.replace`. Tham số thứ hai là CHUỖI thì
JavaScript diễn giải bốn mẫu trong đó: đoạn khớp, phần trước, phần sau, và một dấu đô-la
đơn. Tải là JSON của tiêu đề và mô tả do người tìm lỗi viết, trong một kho đầy script shell
— nên các mẫu ấy là dữ liệu THẬT. Hậu quả: khối phát hiện tự chèn đầu hoặc đuôi lời nhắc vào
giữa chính nó, ngay LƯỢT 1, và hỏng theo đường lặng — tác tử đọc tải méo rồi trả thiếu hoặc
lệch, không dòng nào gọi tên nguyên nhân.

Nhát: replacer dạng HÀM, không diễn giải mẫu nào. Hai lượt chấm đều gọi tên mục này ở khối
ngoài hợp đồng với mức high; owner nâng vào phạm vi tại chốt DỪNG-VÁ.

## Không làm trong vòng này

- Không đổi luật fail-toward-human, không đổi ngưỡng của nó.
- Không đổi phần luật PHÂN LOẠI trong lời nhắc (in/out hợp đồng, `plain`, `proposal`).
- Không đụng bước bác bỏ, dedupe, vùng phủ, carry T5.
- Không hỏi lại quá một lần, không hỏi lại theo từng phát hiện.
- Không đổi hành vi khi tác tử chết cả hai lần thử, khi tác tử tự khai không đọc được hợp
  đồng, hay khi danh sách phát hiện rỗng.
- Không dựng phép đo mới cho chính phép đo này (luật (a)).
- Dòng sổ của trạm và ma trận bộ đọc — đã thu phạm vi, xem khối trên.

## Độ phủ — quét hình thái (preset test-matrix, đã chất vấn trục)

Trục của preset (surface · role · trạng thái dữ liệu · môi trường) là trục cho sản phẩm
người dùng; vật ở đây là một trạm trong một workflow, nên trục phải dựng lại theo B1.

- **Trục A — dạng trả lời của tác tử phân loại** `[thước CE: sáu nhánh xử lý đang có
  trong mã nguồn trạm + lượt hỏng thật của vòng khoi-tim-loi-tra-phi-theo-vat]`
  tác tử chết/không trả · tự khai không đọc được hợp đồng · trả ĐỦ và khớp · trả THIẾU
  mục · trả mục KHÔNG khớp khoá (trôi đường dẫn hoặc trôi tiêu đề) · trả mục THỪA (mã lạ)
- **Trục B — lượt nào trong trạm** `[thước CE: sơ đồ gọi của trạm sau nhát 2]`
  lượt 1 · lượt hỏi lại · sau hỏi lại (hợp nhất)
- **Trục C — hình dạng tập phát hiện** `[thước CE: khoá phân biệt và lưới gỡ-mơ-hồ hiện
  có trong mã nguồn]`
  rỗng · một mục · nhiều mục TRÙNG tiêu đề khác tệp · nhiều mục cùng tệp khác tiêu đề

Ba trục độc lập: đổi dạng trả lời không ép đổi lượt, đổi hình dạng tập không ép đổi dạng
trả lời. Tổng ô có nghĩa ≈ 6 × 3 × 4 trừ ô vô nghĩa (tập rỗng thì trạm không chạy tác tử
nào, nên cả trục A lẫn B sập về một ô).

**Core** — ô vào AC: trôi khoá ở lượt 1 (A×B) · thiếu mục ở lượt 1 rồi hỏi lại vá được ·
thiếu mục còn sau hỏi lại · trả đủ ở lượt 1 (chiều IM: không được hỏi lại) · mã lạ ·
trùng tiêu đề khác tệp (ô mà lưới gỡ-mơ-hồ cũ chịu thua, nay mã đúc giải được).
**Later** — ma trận đầy đủ cho ô «tác tử chết ở lượt hỏi lại» (gộp vào AC giữ-hành-vi-cũ).
**Never** — hỏi lại vòng hai; hỏi lại theo từng phát hiện; đổi luật fail-toward-human.

## Rủi ro đã nhìn

- **Mã đúc thành chỗ tin mù.** Đã chặn bằng lưới mã-lạ + tiêu đề làm chữ ký kiểm; hai lưới
  ấy là chiều ĐỎ có ca riêng, không phải lời hứa trong văn.
- **Lượt hỏi lại đẻ thêm chi phí ở ca xấu.** Trần cứng một lượt; và ca xấu nhất (hỏi lại
  vẫn thiếu) tốn đúng một tác tử `sonnet` so với đường cũ — rẻ hơn một bậc so với phần
  bác bỏ thừa nó đi cứu.
- **Gói plugin trong cache đang là 2.11.0 còn kho đang là 2.13.0.** Mọi phép đo của vòng
  này đọc tệp trong KHO (`feature-loop/workflows/acceptance-verify.js`), không đọc bản
  cache — cùng nếp mà `tests/workflows/vung-vat-mutants.test.mjs` đang dùng.
