# Hạt giống — tải gửi trạm phân loại về MỘT nguồn (cửa sổ 2.14 → 2.15)

**Ngày:** 2026-09-15 · **Ổ:** `_acceptance/mot-nguon-tai-gui-triage/opportunity.md` (`park`)
**Gốc:** Ngoài-1 của hồ sơ `do-tin-tram-phan-loai`, owner quyết «mở hợp đồng mới» tại Cổng
Bằng chứng. Hồ sơ đã mở, đã soạn trọn ba artifact, đã chạy phản biện context sạch — rồi
**owner đóng lại 15/09** sau khi số đo cho thấy hại nhỏ hơn hẳn mức tác tử chấm xếp hạng.

> Chữ trong tệp này là NGUỒN. Đề bài dưới đây dùng được ngay, không phải soạn lại.

## Vật và lỗi

Khuôn tải gửi cho tác tử phân loại viết **hai lần** trong
`feature-loop/workflows/acceptance-verify.js`: một lần nội tuyến trong thân `triagePrompt`,
một lần trong hàm `taiGui`. Cơ chế hỏi-lại-chỉ-phần-thiếu ghép lời nhắc lượt hai bằng phép
thay chuỗi, tìm bản do `taiGui` sinh bên trong lời nhắc do bản nội tuyến sinh. Nó chỉ đúng
chừng nào hai bản còn giống nhau **từng byte**, và phép thay chuỗi không báo gì khi không
tìm thấy — nó trả lại nguyên chuỗi cũ.

## Số đo 15/09 — vì sao owner đóng lại

Chạy trên harness thật, hai cây, cùng một ca ba phát hiện thiếu một. Cây B là cây sau **một
lần sửa thường**: thêm đúng một trường vào bản nội tuyến, giữ `taiGui` nguyên.

| | cây hiện tại | sau một lần sửa thường |
|---|---|---|
| tác tử phân loại | 2 | **2** — không đổi |
| lượt hỏi lại mang | `t3` | `t1,t2,t3` — trọn danh sách |
| quan hệ phân loại | a=TRONG · b=NGOÀI · c=TRONG | **giống hệt — không sai một mục** |
| bước bác bỏ chạy trên | 2/3 | 2/3 — không đổi |
| ký tự lời nhắc phân loại | 4 203 | 4 464 — **+6 %** |
| dòng chẩn đoán «mã lạ» giả | 0 | **2** |

**Đính chính có tên.** Cả tác tử chấm lẫn phiên điều phối đều từng mô tả hậu quả là «trả
tiền tác tử gấp ba». Sai: số tác tử không đổi, chỉ tải của một lời nhắc lớn hơn 6 %. Và
**phân loại vẫn đúng** — lưới mã-lạ mà chính vòng `do-tin-tram-phan-loai` dựng là thứ đỡ
lấy nó: dòng thừa bị bỏ, phát hiện thiếu vẫn ghép đúng. Tác tử chấm xếp mục này `high`; trên
số đo nó không phải `high`.

**Hại thật, nhỏ hơn nhưng có thật:** hai dòng «mã lạ» giả ở mọi lượt. Dòng ấy tồn tại để gọi
tên một dòng trả về thật sự bất thường; kêu sai ở mọi lượt bình thường thì thành tiếng ồn và
một mã lạ thật sẽ nấp trong đó. Cùng lớp với mục «chuỗi lệnh của làn chấm xoá lý do đỏ của
chính nó» trong sổ tồn đọng 2.13 — hại chậm, không hại ngay.

## Vì sao KHÔNG làm ở cửa sổ 2.14

1. Đây là vòng meta **thứ hai** của cửa sổ chỉ được một (luật (b)), ngay sau một vòng đã
   vượt trần lượt gọi người. Tiêu nó cho một lỗi đang ngủ, +6 % và hai dòng log ồn, đúng là
   hình dạng luật (b) sinh ra để chặn.
2. Việc còn lại trong cửa sổ có số đo nặng hơn hẳn: chiến dịch ghim lại 42 hồ sơ · «ghim lại
   theo diff» (điều kiện tiên quyết của chiến dịch ấy) · `routing-baseline` nay **ba lần đếm
   liên tiếp**, mỗi lần đốt một làn 12 phút ngay trước chữ ký.
3. Có đường rẻ hơn cho chính lỗi này — xem mục kế.

## Đường rẻ được khuyến nghị

Sửa như **một nhát vá trong hồ sơ mốc phát hành**, đúng tiền lệ P93 ở mốc 2.13.0 («cắt số +
vá riêng một nhát»): một AC, một chân răng, không tốn một vòng meta. Khi ấy dùng AC-1 và
AC-5 của đề bài dưới đây là đủ; AC-2, AC-3, AC-4 là thứ một vòng đầy đủ mới cần.

## Ngưỡng mở lại

- **Mở ngay, không chờ cửa sổ:** ai đó sửa khuôn tải gửi (thêm/bớt/đổi thứ tự trường) —
  lúc ấy lỗi thôi ngủ và hai dòng «mã lạ» giả bắt đầu đếm.
- **Hoặc:** dòng «mã lạ» xuất hiện ở một lượt chấm thật mà không ai giải thích được — dấu
  hiệu nó đã thôi ngủ mà không ai để ý.
- **Hoặc:** owner gọi tên.

## Nhát cắt đã chốt ở thiết kế

**Bỏ hẳn phép thay chuỗi.** Lời nhắc dựng bằng NỐI: một đoạn đầu cố định, khối tải do
`taiGui(ds)` sinh, một đoạn đuôi cố định. Lời nhắc lượt 1 là `taiGui(toTriage)` nối vào,
lượt hỏi lại là `taiGui(thieu)` nối vào — cùng một hàm, cùng một khuôn, không chỗ nào đòi
hai chuỗi bằng nhau. Lối hỏng lặng biến mất theo thiết kế chứ không nhờ ai nhớ giữ hai bản
khớp.

**Rủi ro của chính nhát cắt:** tách thân lời nhắc thành hai đoạn có đường hỏng riêng — rơi
chữ. Luật phân loại nằm ở đoạn đuôi; cắt hụt một dòng thì tác tử mất một luật mà không ai
thấy. AC-2 của đề bài canh đúng chỗ đó.

## Đề bài — năm tiêu chí đã soạn, dùng được ngay

### AC-1 (MỘT nguồn — chiều NHẠY) — đổi khuôn tải gửi KHÔNG làm lượt hỏi lại gửi trọn danh sách

**Given** một lượt chấm ba phát hiện, lượt 1 để lại một phát hiện chưa ghép; và một **bản
TRƯỚC nhát cắt** dựng bằng `git archive` lấy TRỌN thư mục (không chép danh sách tệp tay —
P150) vào thư mục tạm suy từ vị trí tệp ca
**When** chạy trạm phân loại trên cây hiện tại và trên bản trước nhát cắt, mỗi bên hai lượt:
không tiêm, và có tiêm thêm một trường vào khuôn tải gửi
**Then** ma trận bốn ô phải ra đúng bốn kết quả sau, mỗi ô một dòng chẩn đoán riêng:
cây hiện tại không tiêm → lượt hỏi lại mang **1/3** · cây hiện tại có tiêm → vẫn **1/3** ·
bản trước nhát cắt không tiêm → **1/3** (ĐỐI CHỨNG DƯƠNG CỦA BẢN BASE: base phải xanh trước
khi tin base-đã-tiêm là đỏ) · bản trước nhát cắt có tiêm → **3/3**, tức lượt hỏi lại gửi
trọn danh sách. Ô cuối là chiều đỏ ghim vật thật, không phải một bản chép tay của cơ chế cũ.
Hỏng hạ tầng khi dựng base (thiếu tệp, exit 127, ném lỗi) phải trả **mã thoát RIÊNG** —
tuyệt đối không được đọc thành «đỏ đúng ý».

### AC-2 (không rơi chữ) — phần ngoài khối tải giống bản TRƯỚC nhát cắt từng ký tự

**Given** cùng bản base của AC-1
**When** render lời nhắc phân loại lượt 1 bằng CHÍNH harness trên cả hai bản, rồi bỏ khối
tải ra khỏi mỗi bên
**Then** phần còn lại của hai bản giống hệt nhau **từng ký tự**; khác thì ca ĐỎ và in ra
diff. Số luật phân loại **đếm từ bản CŨ** rồi so với bản mới — không gõ một hằng số nào vào
ca, vì bản cũ mới là thứ định nghĩa «đủ chữ». Và vị trí khối tải trong thân lời nhắc phải
giữ nguyên: đoạn đuôi của bản cũ trỏ ngược lên danh sách ở trên, dời khối tải là làm câu ấy
trỏ vào chỗ trống.

### AC-3 (biên khối tải là vật máy giữ) — rút bằng chính hằng bên VIẾT phát ra

**Given** hàm dựng tải gửi và tệp ca đo nó
**When** ca rút khối tải ra khỏi một lời nhắc
**Then** nó rút bằng ĐÚNG hằng mà bên viết công bố qua một khối marker, không bằng khuôn
đoán; và khối rút ra phải **bằng đúng** kết quả gọi lại hàm dựng tải trên cùng danh sách
(round-trip rút-từ-writer-đọc-bằng-reader). Chiều IM bắt buộc: lời nhắc không mang hằng ấy,
hoặc rút ra rỗng, phải làm ca ĐỎ có tên — cấm xanh lặng. Thiếu chân này thì AC-2 tự thoả:
một bộ rút cắt dư sẽ làm «phần còn lại» của cả hai bên rút gọn về cùng một đoạn đầu.

### AC-4 (lời hứa tiêu đề) — khuôn tải sinh ở ĐÚNG MỘT nơi

**Given** module trạm phân loại
**When** đếm số nơi sinh khuôn tải gửi, bằng marker của bên viết chứ không bằng tìm chuỗi
**Then** đếm được ĐÚNG MỘT; nhiều hơn một thì ca ĐỎ và in vị trí từng nơi. Chiều ĐẶC HIỆU:
chạm một thứ KHÔNG phải vật — văn hồ sơ trong `_acceptance/`, tài liệu, bản thiết kế — phép
đo này phải IM. Không có AC này thì cả ba AC trên đều đo HÀNH VI của một đường duy nhất, và
một bản chép thứ hai nằm im trong mã vẫn cho hành vi đúng; vòng TRỪ khi ấy không trừ được gì.

### AC-5 (hồi quy) — mười ba chân răng của vòng trước, và chúng đo ĐÚNG cây đang chấm

**Given** cây sau nhát cắt
**When** chạy `_acceptance/do-tin-tram-phan-loai/rang-triage.sh` trên cả mười ba chân, cộng
suite workflows và suite plugins
**Then** cả mười ba chân exit 0 và in đúng một dòng kết luận của chân ấy; hai suite xanh.
**VÀ** trước khi tin con số 13/13: tiêm một kim vào hàm dựng tải trên CÂY ĐANG CHẤM rồi chạy
lại, phải có ít nhất một chân ĐỎ và ca in ĐÍCH DANH tên chân đó. Không có vế sau thì 13/13
không phân biệt được «hồi quy xanh» với «chân dựng bản sao từ một mốc git nên đang chấm mã
TRƯỚC nhát cắt» — lớp đã đo thật ở hồ sơ mốc 2.13.


## Coverage

Bài toán MỘT chiều: một khuôn viết hai lần, chữa bằng cách viết một lần. Không có không gian
tổ hợp để quét — bỏ quét hình thái bằng entry `descope` có tên trong sổ quyết định.

Trục duy nhất có nghĩa là **đường hỏng của cách ghép lời nhắc** `[thước CE: ba nhánh xử lý
trong thân trạm + lượt đo thật của tác tử chấm lượt 3 hồ sơ do-tin-tram-phan-loai]`: hai bản
khớp byte (ca thường hôm nay) · hai bản lệch (ca tác tử chấm đo được) · thân lời nhắc bị cắt
hụt (đường hỏng do chính nhát cắt sinh). Ba giá trị → AC-1 phủ hai giá trị đầu, AC-2 phủ
giá trị thứ ba.

Phản biện context sạch thêm hai ô mà trục trên KHÔNG kê ra, vì chúng không nằm ở đường hỏng
của cơ chế mà ở đường hỏng của chính PHÉP ĐO: biên khối tải do bên đọc tự đoán (→ AC-3) và
bản chép thứ hai nằm im không ai gọi (→ AC-4). Cộng một ràng buộc lên hồi quy: chân răng
phải đo đúng cây đang chấm (→ AC-5 vế sau).


## Ngoài phạm vi (giữ nguyên từ đề bài)

- Luật PHÂN LOẠI trong lời nhắc — không đổi một chữ; AC-2 là ràng buộc giữ nó.
- Bộ ghép ba nấc, hai lưới chống tin mù, trần một-lượt-hỏi-lại, luật fail-toward-human —
  vòng `do-tin-tram-phan-loai` vừa ký, không đụng.
- Mã đúc `tid` và tên trường của nó.
- Sáu mục Known limits còn lại của vòng trước — ở tệp ca và chẩn đoán nội bộ, không thuộc
  vòng này.
- Dựng phép đo mới cho chính phép đo của vòng này — luật (a).


## Bộ eval đã soạn

Bảy eval, mỗi eval một dòng kết luận riêng và một chiều đỏ riêng; răng `rang-mot-nguon.sh`
là lớp mỏng bọc ca chạy trên harness workflow, cùng nếp `rang-triage.sh` của vòng trước.
Nguyên văn giữ ở cuối tệp này để dùng lại.

## Phản biện context sạch đã chạy — năm mục, đã sửa vào đề bài

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract + evals | AC-2 hứa «giống bản TRƯỚC nhát cắt» nhưng không phép đo nào chạm bản trước nhát cắt; nó chỉ so hai lời nhắc MỚI với nhau, mà sau nhát cắt cả hai đều nối từ cùng hai hằng nên phép so là hằng-đúng theo cấu trúc. Neo còn lại là con số năm luật gõ tay, và ca lại rút năm luật từ bên viết MỚI rồi khẳng định bên viết MỚI có — vòng tròn. | Nhát cắt làm mất luật thứ sáu (số năm gõ tay không biết bản cũ có mấy luật), hoặc giữ đủ năm marker nhưng đổi câu chữ hay dời vị trí khối tải so với bản cũ. Hai lời nhắc mới vẫn giống hệt nhau, vẫn đếm đủ năm, mọi eval xanh; tác tử phân loại chạy thiếu luật ở mọi vòng sau. | Dựng bản trước nhát cắt bằng git archive lấy trọn thư mục vào tạm suy từ vị trí ca; render lời nhắc bằng chính harness trên cả hai bản; diff ký tự phần ngoài khối tải, khác thì đỏ kèm in diff; số luật đếm TỪ bản cũ. | fixed: AC-2 viết lại quanh bản base; E2 ghim mã 6 cho ca dựng base hỏng và cấm gõ hằng số luật |
| P1 | evals | Sau nhát cắt chỉ còn một hàm dựng tải, nên ca «thêm một trường vào khuôn» đổi cả hai lượt cùng lúc và chiều nhạy tự thoả. Assertion duy nhất có sức phân biệt là chiều đỏ trên bản trước nhát cắt, mà eval không khai bản ấy từ đâu ra và không có đối chứng dương cho chính base. | Thi công dựng chiều đỏ bằng một bản chép tay của cơ chế cũ ngay trong tệp ca — fixture đúng khuôn bên đọc, đỏ đúng như mong đợi, eval xanh, mà mã trước nhát cắt chưa từng chạy. Hoặc base dựng thiếu tệp nên ném lỗi, ca đọc là «đỏ đúng ý». | Base bằng git archive trọn thư mục; chạy base hai lượt, không tiêm phải XANH trước khi tin có-tiêm là ĐỎ; mã thoát hạ tầng phải là mã riêng. | fixed: AC-1 thành ma trận bốn ô, có đối chứng dương của base; E1 ghim mã 4 và mã 6 riêng |
| P1 | contract + evals | AC-3 cũ chạy mười ba chân răng nhưng không ràng buộc chân nào phải đo đúng cây đang chấm — mà vật bị cắt chính là vật mười ba chân ấy đo. | Nhát cắt còn ở cây làm việc lúc chấm; chân nào dựng bản sao từ một mốc git sẽ chấm mã TRƯỚC nhát cắt và in 13/13 xanh kể cả khi nhát cắt làm vỡ trạm. Hồi quy — chỗ dựa duy nhất của một vòng thuần TRỪ — thành hình thức. | Tiêm một kim vào hàm dựng tải trên cây đang chấm và đòi ít nhất một chân ĐỎ có tên chân. | fixed: AC-5 thêm vế sau; E5a ghim mã 3 cho ca tiêm kim mà không chân nào đỏ |
| P1 | design + contract + evals | Biên của khối tải — thứ AC-2 phải bỏ ra khỏi mỗi bên trước khi so — không được khai ở đâu: không marker một nguồn, không hằng dùng chung bên viết và bên đọc. | Ca tự viết bộ rút biên theo khuôn đoán. Hàm dựng tải thêm một dòng ở lần sửa sau thì bộ rút cắt dư tới hết chuỗi: phần còn lại của cả hai bên rút gọn về đoạn đầu, giống hệt nhau, eval xanh trong khi đoạn đuôi không được so một ký tự nào. | Bên viết công bố cặp hằng qua khối marker; ca rút bằng chính hằng ấy; thêm round-trip khối rút ra phải bằng kết quả gọi lại hàm dựng tải; chiều im khi thiếu hằng. | fixed: AC-3 mới + eval E3 |
| P2 | contract | Không AC nào đo lời hứa ở tiêu đề — khuôn tải chỉ còn MỘT nguồn trong mã. Cả ba AC cũ đo hành vi của đúng một đường. | Thi công thêm hàm dựng tải nhưng để nguyên khuôn nội tuyến cũ. Hành vi lượt hỏi lại đúng, mọi eval xanh, owner ký tin «đã bỏ cái cần canh», trong khi bản chép thứ hai vẫn nằm đó và lần sửa sau tái lập đúng bệnh. | Đếm số nơi sinh khuôn tải bằng marker, phải đúng một; kèm chiều đặc hiệu chạm văn hồ sơ thì phép đo im. | fixed: AC-4 mới + eval E4 |


---

## Phụ lục — nguyên văn `evals.yaml` đã soạn

```yaml
schema_version: 1
feature_slug: mot-nguon-tai-gui-triage
# Mỗi eval một dòng PASS riêng và một chiều đỏ riêng. Răng `rang-mot-nguon.sh` là lớp mỏng
# bọc ca chạy trên harness workflow (nạp TỆP THẬT, tác tử giả), cùng nếp rang-triage.sh của
# vòng trước: chẩn đoán ra stderr, stdout đúng một dòng PASS.
# Bản TRƯỚC nhát cắt dựng bằng git archive lấy TRỌN thư mục (P150), không chép danh sách tệp.
evals:
  - id: E1
    criterion: AC-1
    executor: script
    cmd: config:executors.script.rang_mot_nguon_khuon
    expected: >
      Exit 0 và đúng một dòng «PASS: ma tran bon o dung ca bon — cay hien tai khong tiem 1/3
      · cay hien tai co tiem 1/3 · ban truoc nhat cat khong tiem 1/3 (doi chung duong cua
      base) · ban truoc nhat cat co tiem 3/3 (chieu do tren vat that, khong phai ban chep
      tay)». Chiều đỏ ghim mã: 2 chưa từng chạy hoặc kim mutant không cắm được · 3 ô
      base-có-tiêm KHÔNG ra 3/3 · 4 ô base-không-tiêm đỏ (đối chứng dương của base hỏng) · 5
      không rút được khối tải · 6 DỰNG BASE HỎNG (git archive lỗi, thiếu tệp, exit 127) —
      mã riêng, tuyệt đối không đọc thành «đỏ đúng ý».
    paths:
      - feature-loop/workflows/acceptance-verify.js
      - tests/workflows/mot-nguon-tai-gui.test.mjs
      - _acceptance/mot-nguon-tai-gui-triage/rang-mot-nguon.sh
    evidence_required: [run_id, exit_code, verifier, verified_at, output]
  - id: E2
    criterion: AC-2
    executor: script
    cmd: config:executors.script.rang_mot_nguon_khong_roi_chu
    expected: >
      Exit 0 và đúng một dòng «PASS: phan ngoai khoi tai cua loi nhac MOI giong ban TRUOC
      nhat cat tung ky tu (<n> luat phan loai, so DEM TU ban cu — khong ghim hang trong ca);
      vi tri khoi tai trong than loi nhac giu nguyen». Chiều đỏ ghim mã: 2 · 3 bản sao cắt
      hụt đoạn đuôi mà ca KHÔNG đỏ · 4 hai bản lệch mà ca không in diff · 5 không đếm được
      luật từ bản cũ · 6 dựng base hỏng. Số luật KHÔNG gõ vào ca: đếm ở bản cũ rồi so.
    paths:
      - feature-loop/workflows/acceptance-verify.js
      - tests/workflows/mot-nguon-tai-gui.test.mjs
      - _acceptance/mot-nguon-tai-gui-triage/rang-mot-nguon.sh
    evidence_required: [run_id, exit_code, verifier, verified_at, output]
  - id: E3
    criterion: AC-3
    executor: script
    cmd: config:executors.script.rang_mot_nguon_bien_tai
    expected: >
      Exit 0 và đúng một dòng «PASS: bien khoi tai rut bang CHINH hang ben viet cong bo qua
      khoi marker, va khoi rut ra BANG DUNG ket qua goi lai ham dung tai tren cung danh sach
      (round-trip); loi nhac khong mang hang ay thi ca DO co ten». Chiều đỏ ghim mã: 2 · 3
      chiều im không đỏ khi lời nhắc thiếu hằng · 4 round-trip không khớp mà ca vẫn xanh · 5
      không rút được khối marker của bên viết.
    paths:
      - feature-loop/workflows/acceptance-verify.js
      - tests/workflows/mot-nguon-tai-gui.test.mjs
      - _acceptance/mot-nguon-tai-gui-triage/rang-mot-nguon.sh
    evidence_required: [run_id, exit_code, verifier, verified_at, output]
  - id: E4
    criterion: AC-4
    executor: script
    cmd: config:executors.script.rang_mot_nguon_dem_noi_sinh
    expected: >
      Exit 0 và đúng một dòng «PASS: khuon tai sinh o DUNG MOT noi trong module (dem bang
      marker ben viet); chieu DAC HIEU: cham van ho so, tai lieu, ban thiet ke thi phep do
      nay IM». Chiều đỏ ghim mã: 2 · 3 bản sao thêm một nơi sinh thứ hai mà ca KHÔNG đỏ · 4
      ca đỏ khi chỉ chạm văn hồ sơ (mất chiều đặc hiệu) · 5 không đếm được bằng marker.
    paths:
      - feature-loop/workflows/acceptance-verify.js
      - tests/workflows/mot-nguon-tai-gui.test.mjs
      - _acceptance/mot-nguon-tai-gui-triage/rang-mot-nguon.sh
    evidence_required: [run_id, exit_code, verifier, verified_at, output]
  - id: E5a
    criterion: AC-5
    executor: script
    cmd: config:executors.script.rang_mot_nguon_hoi_quy_13_chan
    expected: >
      Exit 0 và đúng một dòng «PASS: muoi ba chan rang cua do-tin-tram-phan-loai deu exit 0
      va in dung MOT dong ket luan (13/13), VA kim tiem vao ham dung tai tren CAY DANG CHAM
      lam it nhat mot chan DO — chan <ten> (nen 13/13 la cua cay nay, khong phai cua mot moc
      git nao khac)». Chiều đỏ ghim mã: 2 · 3 tiêm kim mà KHÔNG chân nào đỏ · 4 một chân đỏ
      khi chưa tiêm · 5 không đủ mười ba chân.
    paths:
      - feature-loop/workflows/acceptance-verify.js
      - tests/workflows/triage-do-tin.test.mjs
      - _acceptance/do-tin-tram-phan-loai/rang-triage.sh
      - _acceptance/mot-nguon-tai-gui-triage/rang-mot-nguon.sh
    evidence_required: [run_id, exit_code, verifier, verified_at, output]
  - id: E5b
    criterion: AC-5
    executor: test
    cmd: config:executors.test.workflows
    expected: >
      Exit 0, «Results: all workflow tests passed». Hồi quy toàn làn workflow.
    paths:
      - feature-loop/workflows/acceptance-verify.js
      - tests/workflows/**
    evidence_required: [run_id, exit_code, verifier, verified_at, output]
  - id: E5c
    criterion: AC-5
    executor: test
    cmd: config:executors.test.plugins
    expected: >
      Exit 0, «Results: all plugin tests passed». Hồi quy corpus.
    paths:
      - tests/plugins/run-tests.sh
      - _acceptance/config.yaml
      - _acceptance/mot-nguon-tai-gui-triage/rang-mot-nguon.sh
      - feature-loop/**
    evidence_required: [run_id, exit_code, verifier, verified_at, output]
```
