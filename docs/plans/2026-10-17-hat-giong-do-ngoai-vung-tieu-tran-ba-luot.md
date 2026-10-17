# Hạt giống — ca đỏ ngoài vùng vật, chạy lại xanh, vẫn tiêu một lượt trong trần ba lượt chấm

**Ngày:** 2026-10-17 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** TRỪ (bớt lượt chấm và lượt gọi người vì hệ thống, không vì vật).
Gốc: crm-onehub#375, bình luận 16/10 12:53Z của Điều phối Mac Studio (https://github.com/phanlemanh/crm-onehub/issues/375) — vòng K7 của crm. Hạt giống mồ côi hợp lệ: chưa có hồ sơ `_acceptance/` cho lớp này.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Số đo

- K7 (crm, 16/10): bài api chập chờn `okr-hoi-y.spec.ts` NGOÀI vùng vật của vòng đỏ ở một lượt, chạy lại xanh,
  nhưng lượt đó vẫn đếm vào trần ba lượt. Mac Studio đề nghị tách «đỏ ngoài vùng, chạy lại xanh» khỏi phần đếm.
- Cùng ngày M5 báo 7 eval của hồ sơ ĐÃ KÝ đỏ sẵn trên `onehub` (`okr-soat-anh-luot-3`, `toan-canh-okr`,
  `soan-okr-trong-khung`, `muc-tieu-va-kr`); bước kiểm trước-gộp `stale_scope` không có lối khai giới hạn cho eval
  đỏ sẵn, nên PR không chạm các hồ sơ ấy vẫn bị chặn.
- Điều phối kit trả lời 12:57Z: mục này ghi hạt giống cho mốc tinh chỉnh 05/11.

## Gốc

Theo khối ĐỊNH VỊ của `CLAUDE.md` (CA DỪNG, K8): việc chỉ tự sinh từ *sai hợp đồng* (máy sửa vật) và *hệ thống
chết* (thử lại MỘT lần). Đỏ ngoài vùng vật mà chạy lại xanh là *hệ thống chết*, không phải sai hợp đồng. Hôm nay
bộ đếm lượt không phân biệt hai loại, nên một ca chập chờn ăn một phần ba trần và đẩy vòng tới lời mời ở trần sớm
hơn. Eval đỏ sẵn của hồ sơ đã ký là cùng lớp: một nhãn trạng thái bị đối xử như một việc.

## Đề xuất (chưa làm — meta đóng băng, mở ở mốc «Tinh chỉnh sau hai đợt thử» 05/11 khi owner gọi tên)

1. **Thử lại một lần trong cùng lượt:** ca đỏ mà mọi tệp nó chạm nằm ngoài vùng vật được chạy lại MỘT lần ngay
   trong lượt; xanh lần hai → ghi nhãn «chập chờn ngoài vùng» vào báo cáo, không tính lượt, không REJECT.
2. Đỏ cả hai lần → giữ hành vi hôm nay (REJECT có tên), vì có thể là vật làm vỡ thứ ngoài vùng.
3. **Eval đỏ sẵn của hồ sơ đã ký:** `stale_scope` nhận một dòng khai giới hạn có tên hồ sơ và sha đỏ sẵn, thay vì
   chặn PR không chạm hồ sơ đó. Đi sau (1) nếu cần tách.
4. Chiều đỏ: ca ngoài vùng đỏ-rồi-xanh → không tính lượt; ca ngoài vùng đỏ-rồi-đỏ → vẫn REJECT; ca TRONG vùng
   đỏ-rồi-xanh → vẫn tính lượt (không được nới cho vật).

**Người hưởng:** máy (bớt lượt chấm đốt vì chập chờn) và owner (bớt lời mời ở trần lượt không do vật).

**Kho không gặp sự cố này được gì, mất gì:** kho có bộ test ổn định không đổi gì (không ca nào rơi vào nhánh thử
lại). Mất: một lần chạy lại mỗi ca ngoài vùng đỏ — phút máy nhỏ hơn một lượt chấm.

## Ngưỡng mở thành ô

Owner gọi tên ở mốc 05/11, hoặc ≥ 2 vòng trong một tuần chạm trần lượt mà có lượt đỏ chỉ vì ca ngoài vùng.
