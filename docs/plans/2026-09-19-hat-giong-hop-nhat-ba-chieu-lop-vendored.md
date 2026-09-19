# Hạt giống — hợp nhất ba chiều cho lớp vendored (`--sync`) (cửa sổ 2.17 → 2.18)

**Ngày:** 2026-09-19 · **Ổ:** chưa có ô — đây là SỔ, đúng luật ô-chỉ-mở-khi-có-neo.
**Gốc:** `acceptance-gate-kit/_acceptance/lop-vendored-tu-xung/` — ô ấy cố ý hoãn phần này;
ca kho: OneFlow PR #119 hợp nhất tay fork cổng 535 dòng, media-library PR #64 mất bản vá
riêng hai lần khi chép đè.

> Chữ trong tệp này là NGUỒN. Đừng đo lại trừ khi nghi số đã cũ.

## Vật và lỗi

Sau ô `lop-vendored-tu-xung`, kho biết mình chạy bản nào và biết tệp nào lệch, nhưng vẫn phải
tự hợp nhất khi có hunk riêng. Kho có fork (OneFlow) hợp nhất ba chiều bằng tay mỗi mốc.

## Đề xuất (chưa phải ô)

`--sync`: lấy tổ tiên chung từ đúng phiên bản ghi trong tệp khai, hợp nhất ba chiều từng tệp,
in hunk riêng của kho ra làm đề xuất port ngược, từ chối khi xung đột thay vì chép đè im lặng.
Tiền lệ ngành: `go mod vendor`, `git merge-file`.

## Vì sao CHƯA mở ô

Chờ ô mẹ ship và đo: nếu ba kho nhận 2.17.0 bằng tay + `--check` mà không mất hunk nào thì
`--sync` chưa đáng; ngưỡng mở: một lần nhận làm mất hunk riêng dù đã có tệp khai.
