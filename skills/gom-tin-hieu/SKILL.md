---
name: gom-tin-hieu
description: Gom các tín hiệu mọi người gửi vào cửa của kho thành nhóm đặt tên bằng tiếng sản phẩm theo trục kết quả người dùng — mỗi tín hiệu ở đúng một nhóm, lẻ kèm lý do, hoặc đã phủ bởi việc đã giao — ghi thành một bản gom (cũng là bản phạm vi của cắt lượt), chạy răng phủ tới xanh, và in đường đi tín hiệu → nhóm → việc → hồ sơ cho người gửi. Dùng khi kho khai tin_hieu trong _acceptance/config.yaml và có tín hiệu mới: «gom tín hiệu», «phân loại góp ý», «gom phát sinh thành nhóm», «tín hiệu của tôi tới đâu rồi». KHÔNG dùng để cắt nhóm thành hàng (đó là cat-luot), KHÔNG để mở vòng một hàng (feature-loop), KHÔNG xếp điểm ưu tiên tự động.
---

# Gom tín hiệu

Biến các **tín hiệu** chưa có chỗ thành MỘT **bản gom** — tệp markdown trong git, trong thư mục
`tin_hieu.gom` của kho — rồi để **răng phủ** (một lệnh tất định, chỉ đọc) chứng rằng mọi tín hiệu nằm ở
đúng một chỗ. Bản gom cũng là **bản phạm vi** của đợt: skill `cat-luot` cắt nó thành hàng của lộ trình.
Chuỗi: tín hiệu → nhóm → bản phạm vi → hàng → hồ sơ → trạng thái.

Kit không giữ kho tín hiệu: kho khai nguồn (`tin_hieu.nguon`), kit chỉ đọc, kiểm và vẽ. Việc PHÁN —
tín hiệu nào vào nhóm nào, tên nhóm — là việc của phiên theo skill này; mã của kit không gọi mô hình.

Khuôn tín hiệu và khuôn bản gom: `skills/acceptance/references/tin-hieu-template.md` của gói
acceptance-gate (đọc qua gốc gói `AG`, không qua đường tương đối với kho). Gốc lệnh: harness đặt
`${CLAUDE_PLUGIN_ROOT}`; kho tự host kit đặt `AG=.` trước khi chạy.

## Chính sách trục (chủ kho chốt ở Cổng Đáng, máy áp — không hỏi lại)

<!-- <<<GOM-TRUC -->
```
truc: ket-qua
```
<!-- GOM-TRUC>>> -->

Trục **kết quả người dùng**: một nhóm là MỘT điều một vai muốn làm được. Tên nhóm mở bằng vai rồi tới
điều muốn làm được, bằng tiếng sản phẩm mà người gửi không dùng git nhận ra ý mình («Trưởng phòng ban
thấy số tuần trước khi cập nhật KR», «Kỹ sư ghim lại một hồ sơ mà không trả giá cho hồ sơ khác»). Hai
tín hiệu cùng một kết quả là một nhóm dù nói bằng chữ khác nhau; hai kết quả khác nhau là hai nhóm dù
cùng chạm một chỗ trong mã. Bản gom ghi `truc: ket-qua`; răng đỏ khi bản gom ghi trục khác khối trên.
Đổi trục là đổi chính sách — một Cổng Đáng mới, không phải việc của phiên gom.

## Bước 1 — đọc tín hiệu chưa có chỗ và việc đã giao

<!-- <<<GOM-CHUA-GOM -->
```bash
AG="${AG:-${CLAUDE_PLUGIN_ROOT}}" && node "$AG/scripts/tin-hieu.mjs" --root . --chua-gom
```
<!-- GOM-CHUA-GOM>>> -->

JSON có ba phần: `tin_hieu` (mọi tín hiệu chưa ở bản gom nào — id, loại, người gửi, lúc gửi, tiêu đề,
nội dung), `da_giao` (hồ sơ đã giao của kho kèm câu giao — để nhận ra ý đã có việc làm xong), và
`ngoai_khuon` (một dòng đếm các yêu cầu vận hành không phải tín hiệu). `loi` không rỗng → sửa tệp tín
hiệu sai khuôn ở nguồn trước; tín hiệu sai khuôn không gom được.

## Bước 2 — gom theo trục

Đọc từng tín hiệu và đặt nó vào ĐÚNG MỘT trong ba ngăn:

1. **nhóm** — cùng một kết quả theo trục trên. Trùng lặp (cùng một điều, người khác nhau, chữ khác nhau)
   vào chung một nhóm. Nhóm mới đánh mã ngắn `G1`, `G2`…; mã chỉ cần duy nhất trong bản gom.
2. **lẻ** — không đòi sản phẩm thay đổi gì (câu hỏi cách dùng, lời cảm ơn, ý đã bác) — kèm lý do một câu.
   Một sự cố vận hành LẶP LẠI được (hết hạn mức, máy đầy, một bước tay mỗi tuần) KHÔNG phải lẻ: kết quả
   là «việc đó thôi chặn người» — vào nhóm. Chỉ sự cố một lần, đã gỡ xong và không đòi gì thêm mới là lẻ.
3. **đã phủ** — tín hiệu nói ĐÚNG điều mà một việc ĐÃ GIAO (một hồ sơ trong `da_giao`) đã làm — ghi tên hồ
   sơ. Trước khi ghi, đọc tiêu chí của hồ sơ đó (`_acceptance/<hồ sơ>/contract.md`): câu giao hay tiêu chí
   phải nêu chính ca, chỗ hay điều tín hiệu nhắc. Tín hiệu báo một ca, một chỗ, một điều MỚI cùng loại với
   việc đã giao (việc đã giao xong mà vấn đề vẫn xảy ra ở chỗ khác) là tín hiệu mới: vào nhóm. Việc đang
   làm dở cũng KHÔNG phải đã phủ: tín hiệu vào nhóm, cắt lượt sẽ nối nó vào hàng đang làm.

**Nghi thì vào nhóm, không vào đã phủ.** «Đã phủ» sai làm tín hiệu lọt khỏi lộ trình và báo người gửi
«đã có việc làm xong» khi chưa xong; một nhóm thừa thì chủ kho gộp hay chuyển sang đã phủ trong một dòng.

Không bỏ tín hiệu nào. Không chia một tín hiệu cho hai nhóm — tín hiệu nói hai điều thì đặt vào nhóm
của điều chính và nêu điều kia trong tên nhóm hoặc một tín hiệu mới.

## Bước 3 — gom thành bản gom, commit, chạy răng

Ghi MỘT tệp mới trong thư mục `tin_hieu.gom` theo khối `GOM-MAU` của khuôn: `dot` (tên đợt mới, cũng là
`dot` cắt lượt sẽ dùng) · `dang` (`chuoi` hay `lan-va`, như bản phạm vi) · `nguon` · `truc: ket-qua` ·
`den` (thời điểm ISO lúc chạy bước 1 — mọi tín hiệu gửi không sau mốc này phải có chỗ). Commit tệp, rồi:

<!-- <<<GOM-RANG -->
```bash
AG="${AG:-${CLAUDE_PLUGIN_ROOT}}" && node "$AG/scripts/tin-hieu.mjs" --root . --rang
```
<!-- GOM-RANG>>> -->

Mã thoát 0 → bảng phủ (mỗi tín hiệu → chỗ của nó). 1 → mỗi dòng một lỗi gọi tên tín hiệu và chỗ: sửa
bản gom, commit, chạy lại tới xanh. 2 → không chạy được (kho chưa khai cửa, bản gom chưa commit).

Commit ĐẦU TIÊN của bản gom mà răng xanh là MỐC so cho «chủ kho sửa bao nhiêu nhóm» — các lượt máy sửa
cho răng xanh không tính là người sửa. Đừng gộp nhiều lần sửa cho răng vào một commit với sửa của người.

## Bước 4 — chuyển cho cắt lượt

Bản gom xanh là bản phạm vi của đợt: gọi skill `cat-luot` với chính tệp này (`--pham-vi <tệp bản gom>`).
Mỗi nhóm là một mã; lẻ và đã phủ không phải mã nên cắt lượt không thấy chúng.

## Bước 5 — báo người gửi tín hiệu của họ tới đâu

<!-- <<<GOM-DUONG -->
```bash
AG="${AG:-${CLAUDE_PLUGIN_ROOT}}" && node "$AG/scripts/tin-hieu.mjs" --root . --duong
```
<!-- GOM-DUONG>>> -->

Mỗi tín hiệu một bản ghi với câu `cau` dựng từ khuôn câu cố định: chưa gom · lẻ (lý do) · đã có việc đã
giao · vào nhóm, chưa thành việc · vào nhóm, để sau · vào nhóm → việc → hồ sơ: trạng thái. Thêm
`--id <id>` để in một tín hiệu. Khi kho khai cả lộ trình, trang lộ trình mang cùng mảng này trong khối
dữ liệu (khoá `tin_hieu`) để bản chiếu của kho hiện cho người gửi.

## Không làm

- Không giữ, không chép, không sửa tín hiệu ở nguồn — kho giữ chúng.
- Không ghi trạng thái vào tệp ý định hay tệp lộ trình — trạng thái do máy suy từ hồ sơ.
- Không xếp điểm ưu tiên theo số tín hiệu.
