# Tổng kết hiệu quả cách mới — cửa sổ 2.18.0 → 2.18.1 (crm 10 vòng · kit 4 vòng · đối chứng 2)

**Ngày:** 2026-09-22 · **Chủ:** owner gọi tên 22/09 · **Kế hoạch:** `docs/superpowers/plans/2026-09-22-tong-ket-hieu-qua-cach-moi-cua-so-2-18.md`
· **Cách đo:** chỉ đọc vật máy ghi — hồ sơ ở `origin/onehub` `960fdff0` (crm, sau khi cài 2.18.1) và `main` `393bee09` (kit), `run-log.jsonl` (bỏ mọi dòng `kind: repin`), `decisions.jsonl`, `usage-report.md`, lịch sử commit (giờ tác giả, vì nhánh đối chứng đã rebase), transcript phiên. Bốn script đo chép ở `docs/findings/assets/2026-09-22-tong-ket/` cùng bản này. Không thước mới, không ô, không vòng meta.

**Tiền đề lúc đo.** crm đã cài 2.18.1 (PR crm #78 gộp). Chiến dịch ghim lại 2.18.1 của kit
(`repin/2-18-1`) **chưa gộp**; mọi số hồ sơ hoá cũ trong bản này là số TRƯỚC chiến dịch. Vòng crm
`moi-phia-deu-thay-ke-hoach` đang ở S3, được ghi «chưa xong».

## 0. Một đoạn

Cách mới **nhanh hơn thật ở chỗ ship**: crm đóng 10 vòng trong khoảng 44 giờ, trong khi nhóm đối
chứng đóng một vòng và bỏ một vòng trong ba ngày. Phần người ở cổng giờ rất ngắn, trung vị 7,5 phút
từ lúc bằng chứng xong tới lúc quyết. Nhưng **lượt gọi người không biến mất, nó dời chỗ**. Cổng
trong thiết kế đã về đúng trần. Câu máy hỏi ngoài thiết kế dồn về bước lên thiết kế: 30 chạm ở crm,
và 28 câu trả lời trong cửa sổ không câu nào chọn khác khuyến nghị. Tin người phải gửi vì hạ tầng
sập là 20 chạm trên hai kho. Hai đồng hồ định vị có vấn đề. **M1** không đọc được cho phần lớn vòng
vì 38,8 % out-token mất nhãn vai. **M3** ra `0 / 8`, nhưng 4 trong 8 hồ sơ chưa từng có bằng chứng
ĐẠT được ký. Hai phiên nghiệm thu có số đủ cạnh ngưỡng. Mỗi phiên có đúng một hàng CHẾT theo chữ
ngưỡng, và verdict là của owner.

## 1. Cổng Giá trị — hai phiên, số cạnh ngưỡng

Hồ sơ phiên: `_acceptance/nhan-trang-thai-va-reality/uat-session.md` và
`_acceptance/ho-so-khep-thoi-hoi/uat-session.md`. Ngưỡng chép nguyên văn từ `opportunity.md`,
không sửa. Cả hai mang cờ vàng «chưa lái-thử»: vòng đổi engine, không có mặt người dùng cuối.

**`nhan-trang-thai-va-reality`** (kho nhận: crm cài 2.18.0, PR crm #70)

| Thước | Ngưỡng | Đo được | Đọc |
|---|---|---|---|
| hồ sơ crm tàng hình | 0 | 0 | SỐNG |
| PR crm #65 | merge | đóng không gộp, chủ kho chọn «cắt đuôi»; vật lên qua PR crm #72 | không phân định |
| lượt chấm `dieu-phoi` bị đốt sau cài | 0 | 0 (và 0 `BLOCKED` ở sáu vòng crm chấm sau cài) | SỐNG |
| lượt gọi người ngoài thiết kế | 0 | 0 câu máy hỏi · 2 lượt tin hạ tầng | SỐNG theo cách hồ sơ mốc đếm |
| dòng M3 ở hồ sơ mốc 2.18.0 | `k / 3` | thiếu; mốc 2.18.1 có `0 / 8` | **CHẾT** theo chữ |
| thước : vật | ≤ 3 : 1 | 1,6 : 1 | SỐNG |

**`ho-so-khep-thoi-hoi`** (kho nhận: crm cài 2.18.1, PR crm #78)

| Thước | Ngưỡng | Đo được | Đọc |
|---|---|---|---|
| hồ sơ đã khép trong NOTE cửa veto | 0 | 0 + 0 | SỐNG |
| ô hỏi trên thẻ hồ sơ đã khép | 0 | kit 0 / 16 · crm 2 / 7 | **CHẾT** |
| ca khai-lang tái lập | «không xanh-sạch» | 2.18.1 «chưa đủ, 2 mục» · 2.18.0 «sẽ machine-cleared» | SỐNG |
| tệp crm tự vá | 0 | 0 (16/16 tệp lớp CI trùng byte) · nhưng CI lượt đầu ĐỎ | tệp: SỐNG · CI lượt đầu: **CHẾT** |
| hồ sơ đã ký đổi làn oan | 0 | 0 oan · 1 đổi làn vì mục thật, tốn 1 chữ ký | SỐNG |
| lượt gọi người | ≤ 3 | 4 trong thiết kế · 0 máy hỏi · 5 lượt tin hạ tầng | **CHẾT** theo chữ (T2 3); đúng trần T3 4 |

Hai hàng CHẾT của `ho-so-khep-thoi-hoi` đã có hạt giống. Thẻ Cổng 1 của hồ sơ khép còn hỏi nằm ở
`docs/plans/2026-09-22-hat-giong-the-cong-1-ho-so-khep-van-hoi.md`. Hàng lượt gọi người phụ thuộc
việc người ký đọc theo trần nào, và phiên này không sửa ngưỡng.

## 2. Năm dòng số — dòng 1, 3, 4, 5 (máy đo)

Dòng 1 tách hai đoạn: *code xong → bằng chứng xong* là máy, *bằng chứng xong → quyết* là người.
«Code xong» là commit đầu đưa hợp đồng sang `implemented`. «Bằng chứng xong» là commit đưa sang
`verified` lần cuối trước khi quyết. «Quyết» là commit chữ ký, `machine-cleared` hoặc `observed`.

| Vòng | Hạng | Code xong→quyết (phút) | Bằng chứng xong→quyết | Lượt chấm (verdict) | Bị đốt (run-log) | Token mới · cache đọc | Ba khối out: vật / tìm-lỗi / tổng hợp | Phút/lượt · găng |
|---|---|---|---|---|---|---|---|---|
| **đối chứng** `thuoc-khai-dung-tieng` | T2 | 1 485 | 48 | 3 (BLOCKED, PENDING, PASS) | 1 | 2,91 M · 27,6 M | không tách được | 28 |
| **đối chứng** `ho-so-khai-dung-tieng` | T2 | không quyết (lưu kho) | — | 3 (REJECT ×3) | 0 | không đo được | — | — |
| crm `dieu-phoi-30-ngay-dau` | T3 | 1 150 | 9 | 4 (BLOCKED ×3, PASS) | 3 | 6,02 M · 73,0 M | 33 / 52 / 16 % (2/3 lượt) | 25 · 38 · 31 · găng ui 1 356 s |
| crm `loi-vao-dieu-phoi-30-ngay` | T2 | 48 | 0 | 1 | 0 † | 0,95 M · 3,7 M | không tách được | 5 |
| crm `quan-ly-danh-muc-30-ngay` | T2 | 93 | 42 | 2 (REJECT, PASS) | 0 | 3,41 M · 37,7 M | 62 / 20 / 18 % | 22 · 18 · găng ui |
| crm `bang-cot-loi-va-nhan` | T2 | 11 | 3 | 1 | 0 | 1,11 M · 4,1 M | không tách được | 6 |
| crm `noi-bon-nut-dieu-phoi` | T2 | 63 | 13 | 1 | 0 † | không đo được | — | — |
| crm `khai-lang-gioi-thieu` | T2 | 11 | 4 | 1 | 0 | 0,97 M · 3,8 M | không tách được | 4 |
| crm `sua-luu-tru-dieu-phoi` | T3 | 39 | 11 | 2 | 0 | không đo được | — | — |
| crm `khuon-mat-bo-phan` | T2 | 17 | 0 | 1 | 0 | 1,15 M · 5,2 M | không tách được | 5 |
| crm `chi-quan-tri-sua-duoc-truong` | T3 | 29 | 9 | 1 | 0 | 1,58 M · 26,4 M | không tách được | 18 |
| crm `ke-hoach-la-mot-ban-ghi` | T3 | 45 | 6 | 1 | 0 | không đo được | — | — |
| kit `nhan-trang-thai-va-reality` | T3 | 211 | 41 | 2 (BLOCKED, PASS) | 1 | 3,88 M · 17,4 M | 23 / 30 / 47 % (1/2 lượt) | 135 · 24 · găng machine 1 000 s |
| kit `release-2-18-0` | T2 | 31 | 15 | 0 (làn V) | 0 | không đo được | — | — |
| kit `ho-so-khep-thoi-hoi` | T3 | 232 | 19 | 3 (BLOCKED, PASS, PASS) | 1 | 3,90 M · 16,1 M | 25 / 44 / 31 % | 27 · 27 · 29 · găng machine |
| kit `release-2-18-1` | T2 | 73 | 6 | 0 (làn V) | 0 | không đo được | — | — |

† Transcript cho thấy một lượt chấm bị hạ tầng làm hỏng mà run-log không có dòng: `loi-vao` (tác
nhân chụp màn đọc câu «Kiểm tra lại docker» của người thành nhiệm vụ, hạt giống
`2026-09-21-hat-giong-tac-nhan-con-khong-doc-cau-nhan-cua-nguoi.md`) và `noi-bon-nut` («đã mở
sandbox, chạy lại vòng 1»). Dòng 3 đếm từ run-log là **cận dưới**: 5 lượt bị đốt có dòng, ít nhất 2
lượt không có.

Hai giới hạn của dòng 4. Ba vòng crm không có `usage-report.md`. Năm vòng crm có báo cáo nhưng
nhãn vai bị khung chuyển tiếp của harness nuốt (`[Workflow harness — user request]`), nên không tách
được ba khối. Tính trên out-token, khung ấy nuốt **38,8 %** của cả cửa sổ. Gốc đã có hạt giống,
chung với hạt giống tác nhân con ở trên. Điều kiện tin cậy của luật (c) áp nguyên. Mốc 2.18.1 đổi
thành phần đường verdict của làn V kèm răng hai chiều, nên dòng 4–5 của hai vòng kit so được.

Dòng hiệu chuẩn cùng lệnh (`scripts/hieu-chuan-moc.mjs`): kit `0 / 1` · crm `0 / 7`.

![Hình 2](assets/2026-09-22-tong-ket/thoi-gian-lam-xong-quyet-duoc.html)

**Cách đọc Hình 2.** Mỗi hàng là một vòng, chuẩn hoá về 100 % tổng phút của chính nó; tổng thật in
bên phải. Đoạn xám là máy, đoạn cam là người đọc bằng chứng rồi quyết. Đoạn cam nhỏ ở mọi vòng mới.
Hai hàng dài nhất về tổng là hai vòng có lượt chấm bị đốt.

## 3. Dòng 2 — lượt gọi người, tách lớp

Đếm trên transcript bằng `luot_goi.py`. Mỗi tin người trong cửa sổ của một vòng được xếp vào một
trong bốn lớp. **Cổng trong thiết kế** là lệnh `approve`, `signoff`, `observed`, câu «build» ở Cổng
Đáng, «Duyệt» Gate 1.5, và «Ký» đi liền chữ ký. **Máy hỏi ngoài thiết kế** là câu người trả lời cho
câu máy hỏi. **Hạ tầng** là tin người phải gửi vì máy hay harness sập. **Người tự khởi** là gộp PR,
hỏi tiến độ, giao việc mới; lớp này không tính vì máy không gọi. Lượt là chuỗi tin cùng lớp cách
nhau dưới 10 phút; chạm là số tin.

| Vòng | Cổng trong thiết kế (lượt / chạm) | Máy hỏi ngoài thiết kế (lượt / chạm) | Hạ tầng (lượt / chạm) |
|---|---|---|---|
| **đối chứng** (hai vòng tháp thước) | 6 / 6 | 5 / 6 | 1 / 3 |
| crm `dieu-phoi-30-ngay-dau` | 2 / 3 | 5 / 9 | 3 / 4 |
| crm `loi-vao-dieu-phoi-30-ngay` | 0 (+1 `observed`) | 2 / 2 | 1 / 1 |
| crm `quan-ly-danh-muc-30-ngay` | 2 / 3 | 1 / 1 | 0 |
| crm `bang-cot-loi-va-nhan` | 1 / 1 | 0 | 0 |
| crm `noi-bon-nut-dieu-phoi` | 1 / 1 | 0 | 1 / 2 |
| crm `khai-lang-gioi-thieu` | 4 / 4 | 1 / 1 | 0 |
| crm `sua-luu-tru-dieu-phoi` | 3 / 4 (1 là ký lại do lưới đòi E29 sau chữ ký) | 2 / 8 | 0 |
| crm `khuon-mat-bo-phan` | 2 / 3 (chữ ký gửi hai lần) | 2 / 2 | 1 / 3 |
| crm `chi-quan-tri-sua-duoc-truong` | 3 / 3 | 0 | 0 |
| crm `ke-hoach-la-mot-ban-ghi` | 3 / 3 | 1 / 7 | 0 |
| crm `moi-phia-deu-thay-ke-hoach` (chưa xong) | 1 / 1 | 1 / 6 | 0 |
| kit `nhan-trang-thai-va-reality` | 4 / 4 | 0 | 2 / 3 |
| kit `release-2-18-0` + ghim lại | 1 / 1 | 1 / 1 | 0 |
| kit `ho-so-khep-thoi-hoi` | 4 / 4 | 0 | 5 / 7 |
| kit `release-2-18-1` | 1 / 1 | 0 | 0 |
| kit cài 2.18.1 lên crm | 1 / 1 (ký `quyen-luot-mang-theo`, ngoài thiết kế của mốc) | 0 | 0 |

Giới hạn của bảng: phân lớp bằng regex trên câu chữ và cửa sổ thời gian gán tay theo giờ commit.
Cả hai nằm trong script. Cổng Đáng của `dieu-phoi` rơi trước cửa sổ transcript đọc được.

![Hình 1](assets/2026-09-22-tong-ket/luot-goi-nguoi-theo-lop.html)

**Cách đọc Hình 1.** Khối xám đậm là cổng trong thiết kế, khối cam là câu máy hỏi giữa vòng, khối
nhạt là tin vì hạ tầng. Ở ba vòng crm T3 lớn, khối cam dài hơn khối cổng. Ở hai vòng kit, khối nhạt
chiếm gần hết phần ngoài thiết kế.

## 4. M1–M6 so nền 21/09 (cùng lệnh Phụ lục A của bản định vị)

| Mã | Nền 21/09 | Hôm nay, toàn bộ | Cửa sổ 21–22/09 | Đọc |
|---|---|---|---|---|
| **M1** vai `machine` / tổng out | 7,4 % (33 bảng vai) | 7,4 % (47) | 7,5 % (15) · **12,3 %** trên phần còn nhãn | không đổi; 38,8 % out cửa sổ mất nhãn, nên số chưa đủ để định vị |
| **M2** ĐẠT không có `baseline: red` | ui-check 46 % không frame · 97,4 % PASS | 79 % (10 188 ĐẠT, 2 129 red) | **40 %** (161 ĐẠT, 96 red) · ui-check 6/6 PASS | chiều đỏ được ghi ở 60 % ĐẠT của cửa sổ, so 21 % toàn bộ. Lệnh A3 không đo «frame», nên số 46 % của nền không tái lập được |
| **M3** ĐẠT đã ký → prod đỏ | không đo | `0 / 8` | = | N tăng 0 → 8, dòng hữu hiệu. Nhưng chỉ 3 trong 8 là ĐẠT có chữ ký người, 1 là ĐẠT máy thông, 4 chưa từng ĐẠT-ký; một trong bốn khai sẵn một chỗ đỏ ở prod mà k không thấy (hạt giống mới) |
| **M4** thước : vật | 57 : 1 xấu nhất · `dieu-phoi` 1,3 : 1 | — | crm 0,5–1,6 ở vòng tính năng · `chi-quan-tri` 4,5 (766 / 169) · kit `nhan-trang-thai` 1,6 · `ho-so-khep` 4,0 (742 / 186) | không vòng nào khai ngân sách thước ở Cổng Đáng, trừ `nhan-trang-thai` (≤ 3 : 1, đạt). M4 chưa đọc được theo ngân sách |
| **M5** hồ sơ có ý định | 9 % (28 / 310) | 10,9 % (35 / 321, bốn kho tiêu thụ) | crm **6 / 10** vòng xong (+ `moi-phia` có) · kit 2 / 2 vòng tính năng | tăng ở cửa sổ, chưa 100 % |
| **M6** vòng chủ ngữ là thước | crm 2 | — | crm **0** · kit 2 vòng meta, mỗi cửa sổ đúng 1 | đạt |

## 5. Sáu câu — mỗi câu một số và một chiều đỏ

**1. Thời gian code xong → quyết có giảm không, và ở đâu?**
Có. Số: trung vị code xong→quyết ở 10 vòng crm là **42 phút**, so 1 485 phút của vòng đối chứng
ship được. Trung vị bằng chứng xong→quyết là **7,5 phút**, tức cổng không còn là chỗ tốn. Cái giảm
nằm ở S4: 7/10 vòng crm chấm một lượt. *Chiều đỏ:* hai vòng dài nhất của cửa sổ (`dieu-phoi` 1 150
phút, kit `ho-so-khep` 232) dài vì lượt chấm bị đốt, không vì người. Chỗ cắt kế tiếp là hạ tầng
chấm, đúng hạt giống suite scripts qua trần 600 s.

**2. Lượt gọi người ngoài thiết kế: bao nhiêu, gốc ở lớp nào?**
Số: ở 10 vòng crm, **30 chạm** máy hỏi ngoài thiết kế và **10 chạm** vì hạ tầng, so 25 chạm cổng
trong thiết kế. Ở kit, **0** máy hỏi và **10 chạm** hạ tầng. Gốc chia bốn lớp:
- **Câu hỏi ở bước lên thiết kế** là lớp lớn nhất (`sua-luu-tru` 8, `ke-hoach` 7, `moi-phia` 6). Chưa có hạt giống, nay có: `2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md`.
- **Harness và API sập** («Try again» ×7 trong 01:07–01:41Z, «Dừng nó», đổi máy) đã có hạt giống tác nhân con không đọc câu nhắn của người. API sập là hạ tầng ngoài kit, không có nghiệm trong kit.
- **Lưới đòi sau chữ ký** có 2 ca: `sua-luu-tru` ký lại vì E29, và `quyen-luot-mang-theo` phải ký ngày cài 2.18.1. Hạt giống nhãn Ngoài-N và thẻ Cổng 1 đã có.
- **Bàn đo** có 1 ca («Kiểm tra lại docker»), chung hạt giống tác nhân con.

*Chiều đỏ:* trong 28 câu trả lời cho câu máy hỏi của cửa sổ, **0** câu chọn khác khuyến nghị. Nếu
một câu hỏi đáng hỏi thì phải có ít nhất một lần người trả lời khác.

**3. Token: khối tìm-lỗi chiếm bao nhiêu, bao nhiêu phát hiện chạm phán quyết?**
Số: ở bốn vòng tách được ba khối, khối tìm-lỗi chiếm **20–52 %** out-token, so 83 % đo ngày 14/09.
Cả cửa sổ trả **212 phát hiện**; **7** trong hợp đồng (3,3 %), tức 7 phát hiện có thể đổi verdict.
175 đi vào Known limits, 27 thành «mở hợp đồng mới». Nhóm đối chứng: 8 trong 67 (12 %). *Chiều đỏ:*
7 trong 10 vòng crm không đo được dòng 4 (thiếu báo cáo hoặc mất nhãn). Nên «chi phí máy trên một
kết quả ship» của luật (c) chưa đo được cho phần lớn cửa sổ, và phần trăm tìm-lỗi trên chỉ đại diện
cho bốn vòng.

**4. Reality: hồ sơ đóng bằng `observed` có hồ sơ nào đỏ ở prod sau đó không?**
Số: **k = 0** trên N = 8 (kit 1, crm 7). *Chiều đỏ:* k đếm được 0 vì hai lý do cấu trúc, không vì
prod sạch. Hồ sơ đóng sớm nhất mới chạy prod từ 18/09, tức 4 ngày. Và bộ đếm không thấy chỗ đỏ khai
ngay trong dòng quan sát: `nhan-ung-dung-noi-tieng-viet` đóng với «còn một chỗ đỏ đã biết», và vòng
`khai-lang-gioi-thieu` chính là việc sửa chỗ đỏ ấy. Đọc đúng: 0 sự cố mới được ghi, 1 chỗ đỏ đã khai,
N_đạt = 4. Hạt giống: `2026-09-22-hat-giong-dong-hieu-chuan-dem-ho-so-chua-tung-dat.md`.

**5. Hai cược §6.1 của bản định vị — số nào ủng hộ, số nào bác?**
- **Cược 1, thước từ «ép» sang «nhìn thấy».** Ủng hộ: tỉ lệ ĐẠT có `baseline: red` lên **60 %** ở cửa sổ, so 21 % toàn bộ; thước là test của kho. Chưa kiểm được: M3 là trọng tài của cược, mà N_đạt = 4 sau tối đa 4 ngày prod. Chưa đủ để thắng hay thua.
- **Cược 2, lớp nhìn-thấy từ «frame giả» sang «mù có tên».** Ủng hộ: mọi bỏ ui-observed đều có tên (audit 22/09: 24 dòng `bỏ …`, 0 im lặng). Bác một phần: ui-check chỉ 6 eval, và cả 6 đều PASS. Điều kiện kiểm «M2 không giảm sau hai mốc» không đo được, vì lệnh A3 không đo frame.

*Chiều đỏ chung:* cả hai cược đều đang đứng trên một đồng hồ (M3) mà mẫu số trộn hồ sơ chưa từng ĐẠT.

**6. Điều gì đi ngược North Star?**
Số: **40 chạm người ngoài thiết kế** ở crm cho 10 kết quả ship, trung bình 4 chạm mỗi vòng ngoài
cổng. Cổng trong thiết kế đã về trần, nhưng giờ người đã dời sang câu hỏi giữa vòng và tin cứu hạ
tầng. Chi phí máy: `dieu-phoi` tiêu 6,0 M token mới và 73 M cache đọc, phần lớn cho ba lượt bị đốt.
Mỗi vòng meta của kit (3,9 M) tốn cỡ một vòng tính năng crm lớn (3,4 M), và mỗi cửa sổ có đúng một vòng
meta như luật (b) cho phép. *Chiều đỏ:* dòng người đứng trước dòng máy. Token của hai vòng kit giữ
nguyên (3,88 M → 3,90 M) trong khi chạm hạ tầng tăng 3 → 7. Theo thước đo của kit, đó là hướng xấu.

## 6. Việc kế — hạt giống, không ô, không vòng meta

- `docs/plans/2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md` (mới): áp luật lời mời cổng cho bước lên thiết kế. Ngưỡng đã đủ.
- `docs/plans/2026-09-22-hat-giong-dong-hieu-chuan-dem-ho-so-chua-tung-dat.md` (mới): dòng hiệu chuẩn tách hai mẫu số, và chỗ đỏ khai trong dòng quan sát tính là k.
- Đã có, số của bản này cộng thêm vào: suite scripts qua trần công cụ (dòng 3) · tác nhân con không đọc câu nhắn của người (38,8 % out mất nhãn; 2 lượt bị đốt không vào run-log) · thẻ Cổng 1 hồ sơ khép vẫn hỏi (2/7) · bốn điểm audit S4 (Treo «phê hết»).
- Không mở: `t1-escape` đỏ ở lượt CI đầu của PR cài kit, vì mới chạm một lần. Ngưỡng: lần cài kế ở bất kỳ kho nào đỏ cùng lý do.

## 7. Lệnh đo — tái lập

Script ở `docs/findings/assets/2026-09-22-tong-ket/`:

```bash
python3 nam_dong.py <repo> <ref> <slug,...>
python3 tin_nguoi.py 2026-09-16T00:00 > tin.jsonl
python3 luot_goi.py tin.jsonl X
python3 finding.py <repo> <ref> <slug,...>
python3 ve_hinh.py
```

- `nam_dong.py` đo dòng 1, 3, 4, 5 từ `git log` của hợp đồng, `run-log.jsonl` bỏ dòng `repin`, và `usage-report.md`. Nó in một dòng JSON mỗi hồ sơ.
- `tin_nguoi.py` rút tin người từ transcript và khử trùng theo `uuid`.
- `luot_goi.py` chứa luật bốn lớp và bảng cửa sổ vòng.
- `finding.py` đếm dòng `kind: finding` theo `inContract` và `proposal`.
- `ve_hinh.py` sinh hai hình từ hai bảng §2 và §3.

Các số còn lại đo bằng lệnh một dòng:

```bash
node scripts/hieu-chuan-moc.mjs --root <kho>
node scripts/khong-can-nguoi.mjs --check --root <bản-sao-hồ-sơ-crm-3f30ce03> --slug khai-lang-gioi-thieu
node scripts/gate-card.js --root <kho> --slug <hồ-sơ-đã-khép> --extract
```

- Thẻ hồ sơ khép đếm độ dài `routing.hoi` của lệnh cuối. Danh sách hồ sơ đã khép lấy từ `slugDaKhep` trong `lib/workspace-record.cjs`.
- Lệnh `khong-can-nguoi.mjs` chạy hai lần: bản `main` và bản `git archive 41b949de scripts lib`.
- Lớp CI so `shasum` từng tệp liệt kê ở GUIDE §5.3, giữa `origin/onehub` và kit `origin/main`.
- M1 dùng lệnh A1, M2 dùng lệnh A3, M5 dùng lệnh A4 của bản định vị. Cả ba chạy trên hai tập: `~/dev/*` và bản sao chỉ gồm hồ sơ của cửa sổ.
- M4 đo trên commit gộp của PR: `git diff --shortstat M^1 M` tách vật và thước.
