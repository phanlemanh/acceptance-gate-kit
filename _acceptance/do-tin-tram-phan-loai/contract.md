---
schema_version: 1
feature: Trạm phân loại phạm vi thôi hỏng vì định danh do LLM chép — định danh do máy đúc, và một lượt hỏi lại đúng phần còn thiếu trước khi kéo cả lượt về fail-toward-human.
slug: do-tin-tram-phan-loai
owner: phanlemanh@gmail.com
risk_tier: T2               # chạm feature-loop/workflows + tests/workflows; KHÔNG chạm t3_paths (hooks, lib, pre-merge-check.sh, recheck-evidence.cjs)
surfaces: [cli]
status: verified
design_doc: docs/superpowers/specs/2026-09-15-do-tin-tram-phan-loai-design.md
approved_by: Mạnh
approved_at: 2026-09-15
---

# Acceptance Contract: do-tin-tram-phan-loai

## Context

Vòng meta DUY NHẤT của cửa sổ 2.14 (luật (b), owner gọi tên 15/09 khi mở cửa sổ). Căn cứ
đã ký: hồ sơ `release-2-13-0` khối Notes §4 mục 2 — trạm phân loại phạm vi trả THIẾU mục
ở **3 trên 6 lượt** của vòng `khoi-tim-loi-tra-phi-theo-vat`, và mỗi lần như vậy luật
fail-toward-human bắt bước bác bỏ chạy trên TOÀN BỘ phát hiện: 5 tác tử thành 10, rồi 15.
Nhát cắt lớn nhất mà mốc 2.13.0 vừa ship đang hỏng ở một nửa số lượt, theo đường im.

Thiết kế tách «trả thiếu» thành hai nguyên nhân khác hẳn nhau — TRÔI KHOÁ (tác tử có trả
lời nhưng viết lại đường dẫn hoặc tiêu đề nên không ghép được) và BỎ SÓT (không có dòng
nào cho phát hiện ấy) — rồi chữa cả hai theo thứ tự nhân quả. Hồ sơ 2.13 §4 chỉ gọi tên
nhát cho vế thứ hai; chữa vế hai mà bỏ vế một là vá dưới tầng của lỗi, vì CLAUDE.md quy
định dạng nghiệm đúng tầng là biến bất biến từ đầu-người sang vật-máy-giữ, mà định danh
do LLM chép lại chính là một bất biến đầu-người.

Phần CỘNG của vòng (mã đúc, lượt hỏi lại) đi theo luật 15/09 của CLAUDE.md: CỘNG không tự
đi, owner phê duyệt đích danh tại Cổng Phạm vi của chính vòng này (ADR 0018). Sau lượt chấm
2, owner quyết hai điều nữa ở chốt DỪNG-VÁ (15/09): **thu phạm vi** — bỏ AC-7 cũ (dòng sổ
`kind: "triage"` và ma trận bộ đọc), vì khuôn của nó tự sinh finding; và **nâng phạm vi** —
kéo lỗi ký tự đô-la từ khối ngoài hợp đồng vào thành AC-11, vì nó hỏng theo đường lặng ở
đúng cái khớp vòng này sinh ra để chữa.

## Criteria

### AC-1 (định danh máy đúc — chiều NHẠY) — đường dẫn trôi mà mã đúng thì vẫn ghép được

**Given** một lượt chấm có hai phát hiện trùng tiêu đề nhưng khác tệp, và tác tử phân loại
trả về đúng hai dòng với mã đúng nhưng `file` viết lại ở dạng khác hẳn dạng đã gửi
**When** chạy trạm phân loại của `feature-loop/workflows/acceptance-verify.js`
**Then** cả hai phát hiện ghép được, không phát hiện nào mang `unclassified`, `triageFailed`
là false. Đây đúng ô mà lưới gỡ-mơ-hồ theo tiêu đề cũ chịu thua. Chạy đúng ca này trên bản
sao trong bộ nhớ đã GỠ nhánh ghép-theo-mã thì ca phải ĐỎ.

### AC-2 (tiêu đề là chữ ký kiểm — chiều ĐẶC HIỆU) — mã khớp mà tiêu đề lệch thì KHÔNG ghép

**Given** tác tử trả về một dòng mang mã hợp lệ nhưng `title` khác tiêu đề đã gửi cho mã đó
**When** chạy trạm phân loại
**Then** dòng ấy KHÔNG được ghép vào phát hiện mang mã đó; phát hiện ấy đi vào tập CÒN
THIẾU và được lượt hỏi lại (AC-4) mang đi hỏi — một dòng bị chữ-ký-kiểm loại là một phát
hiện chưa có dòng, không phải một phát hiện đã hỏng. `triageFailed` chỉ bật true khi lượt
hỏi lại cũng không vá được. Mã giữ vai ĐỊNH DANH, tiêu đề giữ vai CHỮ KÝ KIỂM — máy không
đoán dòng này thuộc về phát hiện nào.

### AC-3 (mã lạ bị bỏ) — dòng mang mã không nằm trong tập gửi đi là dòng THỪA

**Given** tác tử trả về một dòng mang mã không thuộc tập mã đã gửi ở lượt đó
**When** chạy trạm phân loại
**Then** dòng ấy bị bỏ như một dòng THỪA — không thay thế, không ghép sang phát hiện nào —
và trạm in một dòng chẩn đoán gọi tên mã lạ; các phát hiện khác vẫn ghép theo mã của chúng
và không phát hiện nào vì dòng thừa đó mà mất phân loại.

### AC-4 (hỏi lại đúng MỘT lần, chỉ phần còn thiếu)

**Given** ba phát hiện được gửi đi và lượt 1 chỉ để lại hai phát hiện ghép được
**When** chạy trạm phân loại
**Then** có ĐÚNG MỘT tác tử phân loại thứ hai được gọi; lời nhắc của nó chứa phát hiện còn
thiếu và KHÔNG chứa hai phát hiện đã ghép được; sau khi gộp, cả ba phát hiện có phân loại,
`triageFailed` là false, và bước bác bỏ chỉ chạy trên phát hiện trong hợp đồng. Vế DƯỚI
NGƯỠNG của chính ca này: KHÔNG có tác tử phân loại thứ ba nào được gọi dù lượt 2 đã vá xong
— «đúng một» là trần cứng chứ không phải «ít nhất một».

### AC-5 (chiều IM) — lượt 1 đủ thì KHÔNG có lượt hỏi lại nào

**Given** tác tử phân loại trả về đủ dòng khớp cho mọi phát hiện ngay lượt 1
**When** chạy trạm phân loại
**Then** tổng số tác tử mang nhãn phân loại trong cả lượt chấm là ĐÚNG MỘT. Đây là chiều
đặc hiệu của nhát hỏi-lại: một nhát cắt chi phí không được tự sinh thêm chi phí ở ca thường.

### AC-6 (luật fail-toward-human KHÔNG đổi) — sau hỏi lại vẫn thiếu thì cả lượt về đường cũ

**Given** hai chân, mỗi chân một ca riêng: lượt hỏi lại trả về nhưng vẫn không có dòng khớp
cho phát hiện thiếu · tác tử hỏi-lại CHẾT
**When** chạy trạm phân loại
**Then** ở CẢ HAI chân: `triageFailed` là true; phát hiện thiếu mang `unclassified`; bước
bác bỏ chạy trên TOÀN BỘ phát hiện đúng như đường cũ; và KHÔNG có tác tử phân loại thứ ba.

### AC-8 (ba đường hỏng cũ giữ nguyên hành vi)

**Given** ba chân, mỗi chân một ca riêng và một dòng kết luận riêng: danh sách phát hiện
RỖNG · tác tử phân loại chết cả hai lần thử của lượt 1 · tác tử tự khai không đọc được hợp
đồng
**When** chạy trạm phân loại
**Then** theo thứ tự: không tác tử phân loại nào được gọi và `triageFailed` là false ·
`triageFailed` là true và không có lượt hỏi lại nào · `triageFailed` là true và không có
lượt hỏi lại nào. Ba nhánh này đã đúng trước vòng này; AC tồn tại để nhát cắt không làm
chúng trôi, nên mỗi chân phải có chiều đỏ RIÊNG — một dòng kết luận chung cho ba chân
không phân biệt được «bắt đúng» với «chân ấy chưa bao giờ chạy».

### AC-9 (mã đúc MỘT lần cho cả trạm) — lượt hỏi lại mang lại mã CŨ

**Given** lượt hỏi lại được gọi cho một tập con phát hiện
**When** đọc lời nhắc của lượt hỏi lại và ghép kết quả của nó
**Then** mỗi phát hiện trong tập con mang ĐÚNG mã nó đã mang ở lượt 1 — không tái đánh số;
và một dòng trả về ở lượt 2 mang mã KHÔNG thuộc tập con đang hỏi bị xử như mã lạ (AC-3),
không ghép sang phát hiện nào. Chiều đỏ: bản sao trong bộ nhớ đúc lại mã cho tập con phải
làm ca ĐỎ — vì đúc lại là đường để một phân loại của phát hiện này lặng lẽ gán sang phát
hiện khác, cho ra một lượt PASS sạch trên phân loại SAI.

### AC-10 (khớp LLM-viết → máy-đọc của chính cái mã)

**Given** một lượt chấm với N phát hiện
**When** soi TẢI GỬI ĐI thật của tác tử phân loại và tên trường mã ở cả hai phía
**Then** số mã xuất hiện trong tải gửi đi bằng N; tên trường mã mà lời nhắc và lược đồ dùng
là CÙNG một chuỗi mà bộ ghép đọc, rút từ MỘT chỗ có marker chứ không gõ hai lần; và phản
hồi giả của mọi ca đo được SINH TỪ tải gửi đi thật trong chính lần chạy, không gõ tay theo
khuôn bên đọc. Chiều đỏ: gỡ mã khỏi lời nhắc, hoặc đổi tên trường ở đúng MỘT phía, phải làm
ca ĐỎ — nếu không thì mọi ca khác vẫn xanh trong khi tác tử thật không bao giờ trả mã và cả
nhát cắt bằng không.

### AC-11 (nâng phạm vi, owner quyết 15/09) — tải gửi đi KHÔNG méo vì ký tự đô-la

**Given** một phát hiện mà `title` hoặc `detail` chứa các mẫu `$&`, `$'`, `` $` `` hoặc `$$`
— chuyện thường ở kho đầy script shell, và đã có thật trong corpus hồ sơ của kit
**When** trạm phân loại dựng lời nhắc cho lượt 1 và cho lượt hỏi lại
**Then** khối `Findings` trong lời nhắc tác tử NHẬN parse được thành JSON và bằng ĐÚNG danh
sách đã gửi — không mẫu nào bị JavaScript diễn giải thành đoạn khớp, phần đầu hay phần đuôi
của chính lời nhắc. Chiều đỏ: bản sao trong bộ nhớ dùng chuỗi thay thế (thay vì replacer
hàm) phải làm ca ĐỎ trên đúng phát hiện ấy, và ĐỐI CHỨNG DƯƠNG là cùng ca với phát hiện
không chứa ký tự đô-la vẫn xanh ở cả hai bản. Đây là mục hai lượt chấm đều gọi tên ở khối
ngoài hợp đồng (high), nay owner nâng vào phạm vi vì nó hỏng theo đường LẶNG ở đúng cái
khớp máy-viết → LLM-đọc mà vòng này tồn tại để chữa.

## Coverage

Quét hình thái preset `test-matrix`, trục dựng lại theo B1 vì trục preset là trục sản phẩm
người dùng còn vật ở đây là một trạm trong workflow. Chi tiết ô Core/Later/Never ở mục
«Độ phủ» của design doc.

- **Trục A — dạng trả lời của tác tử phân loại** `[thước CE: sáu nhánh xử lý đang có trong
  mã nguồn trạm + lượt hỏng thật của vòng khoi-tim-loi-tra-phi-theo-vat]`: chết/không trả ·
  tự khai không đọc được hợp đồng · đủ và khớp · thiếu mục · không khớp khoá · thừa mục.
- **Trục B — lượt nào trong trạm** `[thước CE: sơ đồ gọi của trạm sau nhát 2]`: lượt 1 ·
  lượt hỏi lại · sau hỏi lại.
- **Trục C — hình dạng tập phát hiện** `[thước CE: khoá phân biệt và lưới gỡ-mơ-hồ hiện có
  trong mã nguồn]`: rỗng · một mục · nhiều mục trùng tiêu đề khác tệp · nhiều mục cùng tệp
  khác tiêu đề.

Ánh xạ ô Core → AC: trôi khoá → AC-1 (ca mang luôn ô «trùng tiêu đề khác tệp» mà lưới
gỡ-mơ-hồ cũ chịu thua) · trôi nội dung → AC-2 · thừa mục → AC-3 · thiếu rồi vá được → AC-4 ·
đủ ngay lượt 1 → AC-5 · thiếu cả sau hỏi lại → AC-6 · ba nhánh cũ → AC-8. Trục B nhân với
trục A ở lượt HỎI LẠI → AC-9 (phản biện context sạch P0-1). Khớp gửi-đi ↔ đọc-lại của chính
mã → AC-10 (phản biện context sạch P0-2). Nội dung phát hiện mang ký tự đô-la — ô của trục C
mà quét hình thái ban đầu KHÔNG kê ra (hình dạng tập chỉ tính số mục và trùng tiêu đề, không
tính KÝ TỰ trong nội dung) → AC-11, thêm sau lượt chấm 2.

**Số hiệu AC-7 bỏ trống có chủ ý.** Nó từng là dòng sổ `kind: "triage"`; owner thu phạm vi
15/09 sau khi DỪNG-VÁ nổ. Giữ trống thay vì đánh số lại để mọi tham chiếu trong sổ quyết
định, hai báo cáo bằng chứng và hai bản findings còn đọc được.

## Out of scope

- Luật fail-toward-human và ngưỡng của nó — giữ nguyên từng chữ; AC-6 là ràng buộc giữ nó.
- Phần luật PHÂN LOẠI trong lời nhắc (trong/ngoài hợp đồng, `plain`, `proposal`, cấm đoán
  AC gần giống) — không đổi một chữ.
- Bước bác bỏ, dedupe liên-lane, vùng phủ, carry T5 — không đụng.
- Hỏi lại vòng hai, hoặc hỏi lại theo từng phát hiện — Never trong quét hình thái.
- Chiến dịch ghim lại 41 hồ sơ và nhát «ghim lại theo diff» — việc của mốc phát hành 2.14,
  không phải của vòng này.
- Dựng phép đo mới cho chính phép đo của vòng này — luật (a) cấm tầng đo-thước-của-thước.
- **Dòng sổ `kind: "triage"` và ma trận bộ đọc (AC-7 cũ) — THU PHẠM VI 15/09.** Khuôn của nó
  bắt chứng một tính chất phủ định trên chín bộ đọc khác giao diện, nên mỗi bộ cần một khẳng
  định riêng tay và mỗi khẳng định ấy lại là một phép đo mới cần hai chiều: lượt 1 vá một
  mục, lượt 2 lộ thêm bốn mục CÙNG LỚP. Ba dòng sổ có sẵn của kit (`finding`, `panel`,
  `baseline`) chưa bao giờ phải chứng điều này. Đi vào hạt giống cửa sổ sau.

## Notes

Phần CỘNG của vòng được owner phê duyệt đích danh tại Cổng Phạm vi (luật 15/09, ADR
0018). Bảng dưới là điều luật (c) vốn đòi ở mọi hồ sơ đổi kit; hồ sơ mốc 2.14 đối chiếu
nó với số thật.

### Bảng dự báo năm dòng số (luật (c)) + điều kiện tin cậy

| Dòng | Dự báo | Vì sao |
|---|:--:|---|
| 1 làm-xong → quyết-được | = | Vòng này không chạm nghi thức cổng; đoạn chữ-ký→lên-main là việc của nhát khác. |
| 2 lượt gọi người/vòng | = | Mục tiêu 0 lượt ngoài thiết kế; làn V nên Cổng Phạm vi tốn 0. |
| 3 vòng bị hạ tầng đốt lượt chấm | ↓ | Chính lớp đang đốt là trạm này: 3/6 lượt của vòng trước. |
| 4 token máy/vòng | ↓ | Khối tìm-lỗi: bác bỏ thôi chạy trên toàn bộ danh sách ở lượt trạm trả thiếu. |
| 5 phút máy/lượt chấm | ↓ | Cùng nguyên nhân dòng 4; bác bỏ là làn song song nên đường găng ngắn lại. |

**Điều kiện tin cậy — ràng buộc, không phải chỉ số (luật (c)):** dòng 4–5 chỉ được đọc là
cắt thật khi (i) đường verdict — người tìm → bác bỏ trong hợp đồng → REJECT — KHÔNG đổi
thành phần, và vòng này cố ý không đổi nó (AC-6 giữ luật fail-toward-human, Out of scope
giữ bước bác bỏ); (ii) số lượt chấm sai giữa hai mốc không tăng — đã là ngưỡng của luật
(a), không dựng phép đo mới. Nguồn đọc dòng 3–5 ở mốc sau: dòng sổ `kind: "triage"` mà
AC-7 dựng, cộng `usage-report.md` như mọi vòng.

### Nhát cắt cho cửa sổ kế — gọi tên

Luật (c) đòi mỗi mốc gọi tên ít nhất một chỗ cắt. Vòng này để lại: **«ghim lại theo diff»**
(hồ sơ 2.13 §4 mục 1) vẫn chưa làm, và nó là điều kiện tiên quyết của chiến dịch ghim lại
42 hồ sơ — số đo lại 15/09 bằng đúng lệnh và đúng mốc của lần đo 14/09: 41 → 42.
