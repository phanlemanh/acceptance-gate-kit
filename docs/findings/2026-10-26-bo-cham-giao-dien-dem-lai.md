# Bộ chấm giao diện — đếm lại tại nguồn trước khi nhắm (26/10)

> Đầu vào: một phiên khác đọc hồ sơ crm ở commit `6adaf11e0` (23/10) và ghi 46 lần eval giao diện đỏ trên 41
> vòng. Bảng phân loại của phiên đó gán 31 lần (67 %) cho nhóm E, «bộ chấm/hạ tầng», và chủ kho quyết theo
> bảng ấy: «sửa bộ chấm trước». Bảng ấy là triệu chứng. Tài liệu này đếm lại tại nguồn
> (`evidence-report.md` mục Iterations, `decisions.jsonl`, `run-log.jsonl`, `evals.yaml`, `rang/` của từng
> vòng) để biết sửa ở kit thì cứu được gì.
>
> Bản triage từng ca (6 trường, có trích đường dẫn:dòng trong kho crm) nằm NGOÀI kho kit, vì kit là kho
> công khai còn crm là kho riêng. Tài liệu này chỉ giữ số đếm và cơ chế.

## 1. Mẫu số: lượt chấm phụ của các vòng giao diện

Đếm bằng `run-log.jsonl` (dòng `round-tally`) trên mọi hồ sơ crm có ≥ 1 eval `ui-check`. Cửa sổ là
04/09–22/10, 179 vòng.

| Phép đo | Số |
|---|---|
| Vòng có eval giao diện | 179 (335 eval `ui-check`, trong đó 328 eval có `cmd` — một kịch bản `rang/*.mjs` do vòng tự viết) |
| Số lượt chấm trung bình mỗi vòng | 2,5; 80 % số vòng cần ≥ 2 lượt |
| Out-tok trung vị mỗi lượt chấm | 65,7 k (351 lượt có `usage-report.md`) |
| Lượt chấm không phải lượt cuối | **259** |
| — trong đó verdict PASS hoặc PENDING-JUDGMENT (tức chấm lại sau khi đã đạt) | **69** — lý do lẫn lộn (Cổng 2 thêm mục, hợp đồng đổi, cây trôi), **chưa triage** |
| — trong đó REJECT/BLOCKED có lệnh suite của kho đỏ | 87 |
| — trong đó REJECT/BLOCKED có eval giao diện thoát ≠ 0 | 54 |
| — trong đó REJECT không có thước máy nào đỏ (do tìm-lỗi/hội đồng) | 32 |

Hai nhóm nhân hệ số (lệnh suite đỏ, chấm lại sau khi đạt) lớn hơn nhóm eval giao diện. Đây là chỗ đầu tiên
bảng triệu chứng dẫn sai: 67 % là tỉ lệ TRONG các lần eval giao diện đỏ, không phải tỉ lệ của mọi lượt chấm phụ.

## 2. Triage 32 ca của nhóm E

| Nhóm theo bảng | Số ca | Cơ chế thật (tại nguồn) | Lỗi sản phẩm thật bị dán nhãn thước |
|---|---|---|---|
| «Kịch bản đo sai» | 13 | 12 ca kịch bản `rang/` viết ở bước code (S3) hỏng: đo có-mặt thay vì quan hệ / phạm vi sai 4 · chiều đỏ hoặc đối chứng không cắn 2 · dữ liệu cảnh/dữ liệu dựng sai 2 · chọn sai phần tử (`display:contents`) 1 · thời điểm chờ 1 · định dạng màu (`lab()`) 1 · kịch bản lệch các bước của eval 1. Ca thứ 13 không phải thước: câu người gõ trong phiên bị khung Workflow chuyển vào mọi tác tử chấm | 0 |
| «Chụp sai/thiếu» | 7 | Mọi ca đều do kịch bản `rang/` chụp, không ca nào do tác tử chấm chụp tay. `fullPage` không mở được vùng cuộn bên trong khung trang, đích nằm ngoài khung: chạm 5/7 · hai ảnh trùng từng byte 2 · sai đường dẫn ra 404, khẳng định âm tính đứng một mình đạt rỗng 1 · một kịch bản phục vụ ba eval, tác tử E1 tính khẳng định của E13 cho mình 1 · bộ chờ ổn định vỡ khi một trang khác chuyển hướng 1 | 0 |
| «Hạ tầng thật» | 12 | Hạ tầng đúng nghĩa (DB chung, tải, phụ thuộc ngoài) **5** · thước hoặc tác tử đo sai **5** · lỗi sản phẩm có sẵn bị gọi là «cảnh báo»/«chập chờn» **2** | **2** (+ 1 chưa loại trừ) |

Ba quan sát bác ba giả định ngầm của bảng:

1. **Thử lại cùng lượt vì hạ tầng cứu được 0/12 ca.** Kit gắn đúng nhãn hạ tầng cho 4 ca, nhưng lượt nào
   cũng có kèm một dòng suite `vat` hoặc một finding trong hợp đồng, nên luật «lượt có lỗi sửa-được thì
   REJECT» (`s4-args.mjs`) khoá đúng như thiết kế. Hai ca «chập chờn» lại là lỗi hydration có thật. Nới nhãn
   hạ tầng sẽ **giấu** lỗi sản phẩm. Việc này đi ngược nguyên tố 2.
2. **Không ca nào do tác tử chấm giao diện tự đo sai theo prompt của kit.** Thước hỏng là kịch bản do vòng
   viết. Tác tử chấm còn bắt được 3 kịch bản báo xanh sai và 5 bộ ảnh sai, nhờ bước «mở từng ảnh đã lưu».
3. **Lượt đối chứng (`baseline:diffBase`) không bao giờ chạy kịch bản giao diện.** Nó chỉ chạy lệnh của làn
   máy. Kịch bản `rang/` mới thì không có ở merge-base, nên cũng không có chiều đỏ trong lịch sử. Cam kết
   «màu xanh phải từng chạy chiều đỏ» vì thế chỉ còn là lời khai của tác giả (mệnh đề `MEASURE-BIRTH-CLAUSE`
   ở S3 là lời dặn, không phải vật máy giữ). Đây là lỗ thật, nhưng là lỗ về **độ tin**, không phải về tốc độ:
   1 eval xanh trên hai ảnh trùng byte và 4 kịch bản xanh mà sai đều chỉ bị làn tìm-lỗi bắt.

## 3. Lượt chấm bị đốt RIÊNG vì nhóm E

Một ca chỉ «tốn lượt» khi lượt đó REJECT/BLOCKED vì riêng nó. Phần lớn ca đi chung lượt với một lỗi khác,
nên sửa nó không bớt lượt nào.

| Lớp | Lượt đốt riêng | Kit sửa được ở đâu |
|---|---|---|
| Kịch bản đo không tự chứng hai chiều trước lượt chấm | 4 (3 vòng; +1 lượt gọi chủ kho vì dừng-vá) | Chạy thử thước hai chiều bằng máy ở ranh giới S3→S4: 9/13 ca «kịch bản» bị bắt sớm |
| Một kịch bản phục vụ nhiều eval, mã thoát chung | 1 | Một câu trong prompt tác tử ui: chỉ tính khẳng định của eval mình |
| Câu người gõ lọt vào tác tử chấm (khung Workflow) | 2 | Hạ tầng harness. Đã có ghi chép từ 07/10; kit chưa có răng |
| Kho: thước đếm cứng trên DB chung · fixture sai · bộ chờ vỡ khi điều hướng | 3 | Không — thuộc bàn đo của kho |
| Lỗi hydration có thật + ghi cây đồng thời | 1 | Không phải lỗi thước; lượt ấy đỏ đúng |
| **Cộng** | **11** | **Kit sửa được ≈ 5** |

≈ 5 lượt trong 7 tuần, tức khoảng 2 % số lượt chấm phụ của các vòng giao diện và khoảng 330 k out-tok. Cả
32 ca đều từ crm; chưa đo kho nào khác (luật 26/09: «sửa kit vì sự cố của MỘT kho phải cân trên MỌI kho»).

## 4. Các vòng kit đã giao đã phủ gì

- `ha-tang-khong-dot-luot` (2.18.3) và `cham-khong-tu-dot-luot` (2.18.5): nhãn `mu`/`chet` và thử lại cùng
  lượt. Có 5 ca xảy ra sau khi cả hai đã vào bản crm dùng; 1 ca trong số đó vẫn tốn lượt (lỗi thật + ghi
  đồng thời), và cơ chế này không thể phủ nó. Không cần làm lại.
- `cham-lai-khong-tu-doi` (VA1): mang sang và thước lệch ở lượt chấm lại. Không chạm lớp này.
- `suc-khoe-cho-trong-va-toc-do` (SK1): hạn mức tải máy cho các làn nặng giữa các phiên. Không xếp hàng các
  tác tử ui TRONG một lượt.
- PR #389 (nháp, chờ Cổng Bằng chứng): eval ui-check khai trong `model_evals` chạy sau chuỗi suite, lần lượt
  từng cái. Phủ một phần lớp «chạy song song trên máy chủ dev chung», theo lựa chọn. `eval-executors.md`
  §Exclusive resources khai rõ: tài nguyên độc quyền do thước của kho tự xếp hàng.

## 5. Chỗ chưa đo (khai, không tự mở việc)

- 69 lượt chấm lại sau khi đã PASS và 87 lượt có suite đỏ chưa có triage nào. Hai nhóm này lớn hơn cả nhóm
  bộ chấm giao diện. Đọc nhanh các dòng «Round N» cho thấy lý do lẫn lộn: không phải ca nào cũng là cây trôi
  sau gộp nhánh chính.
- Số 54 đếm dòng eval có mã thoát ≠ 0. Ảnh trái kỳ vọng thì tác tử ui phải trả mã ≠ 0, nên số này đã tính các
  ca ấy. Bốn kịch bản xanh sai mà tìm-lỗi bắt được KHÔNG nằm trong 54; chúng nằm trong 32 lượt «không thước
  máy nào đỏ».
- Bộ đếm và lệnh tái lập: `round-tally` trong `_acceptance/*/run-log.jsonl` của crm, lọc theo hồ sơ có
  `executor: ui-check` trong `evals.yaml`, tách lượt cuối khỏi lượt phụ, rồi so `evalId` có `exit_code` ≠ 0
  với executor khai trong `evals.yaml`.

## 6. Hai nhóm lớn hơn — triage sau khi chủ kho xếp lại (26/10)

Cùng cửa sổ, cùng cách đếm «lượt đốt RIÊNG». Bản từng ca nằm ngoài kho kit, như §2.

**87 lượt có lệnh suite của kho đỏ — 35 lượt đốt riêng, ≥ 8 lượt gọi chủ kho đi kèm.**

| Lớp | Lượt | Đốt riêng |
|---|---|---|
| Vật của vòng làm suite đỏ (hành vi sai 15 · vỡ bài gác quy ước 13) | 28 | 12 |
| Lint / kiểu / định dạng / rác | 25 | 9 |
| Test của chính vòng viết sai | 3 | 1 |
| Chập chờn / tải (kho 17 · kit 2) | 19 | 9 |
| Đỏ sẵn / do nhánh chính | 7 | 4 |
| Không đủ chứng | 5 | 0 |

22 lượt đốt riêng là đỏ tất định do chính vòng gây, bắt được bằng cách chạy `suite_keys` tại chỗ trước khi gửi S4.
Kit không có bước ấy. Hạt giống: `docs/plans/2026-10-26-hat-giong-chay-suite-truoc-luot-cham.md`.

**69 lượt PASS/PENDING-JUDGMENT không phải lượt cuối:**

| Lớp | Lượt | Gọi người |
|---|---|---|
| Thực chất REJECT: eval xanh nhưng có phát hiện trong hợp đồng / lượt chưa đạt thật | 33 | 4 |
| Nâng mục ngoài hợp đồng để sửa ngay | 14 | 12 |
| Cây trôi sau gộp nhánh chính (5 sau chữ ký · 2 trước) | 7 | 6 |
| Người ở Cổng Bằng chứng yêu cầu sửa/thêm | 5 | 5 |
| Phát hiện muộn / hồ sơ trượt khuôn | 5 | 4 |
| Hợp đồng đổi sau khi đạt | 3 | 3 |
| Chờ người phán rồi chấm lại | 2 | 2 |

Nhãn PASS ở dòng `round-tally` là kết quả của eval, không phải của cả lượt: một nửa nhóm này là vòng sửa bình
thường. Đoạn ký→gộp tốn 7 lượt và 6 lượt gọi người. Khoảng 8 lượt gọi khác chỉ có một câu trả lời hợp lý («ừ»),
tức là trạm thu phí. Kit tránh chắc được 3 lượt bằng cơ chế đã có (làn ghim lại thay S4 khi chỉ chạy lại suite ·
phát hiện trong hợp đồng tự REJECT · lưới nhãn cross-layer trước khi ký).

**Kết luận của §6:** chỗ tốn lớn nhất mà kit gỡ được rẻ không nằm ở bộ chấm giao diện (≈ 5 lượt) mà ở việc gửi
lượt chấm khi suite của kho còn đỏ vì chính vòng (22 lượt), cộng chập chờn không được chạy lại trong S4 (8) và đỏ
sẵn không được so với merge-base (4).
