# Hạt giống — «duyệt, giữ cỡ» trong một lượt gõ ở Cổng Phạm vi

**Ngày:** 2026-10-15 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** TRỪ (bớt một lượt gõ của người).
Gốc: crm-onehub/_acceptance/so-do-quanh-muc-tieu — Cổng Phạm vi DH5 ngày 15/10 tốn **4 lượt gõ** cho **một**
quyết định (đọc lại transcript phiên thợ).
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Số đo

Đợt `okr-dieu-huong-1410` ở crm (máy M5, 15/10), năm vòng DH1–DH5 qua Cổng Phạm vi:

| Vòng | Cỡ hợp đồng | Chạm chốt cỡ | Lượt gõ ở Cổng Phạm vi |
|---|---|---|---|
| DH1 | < 13 | không | 1 |
| DH2 | 14 | có | ≥ 2 |
| DH3 | 13 | có | ≥ 2 |
| DH4 | 15 | có | 2 (thợ tự đếm: «sửa: giữ cỡ» rồi «duyệt») |
| DH5 | 13 | có | 4 |

**4/5 vòng** chạm chốt `co_hop_dong.chan` (khối `CO-HOP-DONG-CHAN` ở `commands/approve.md`). Cả bốn đều chọn giữ
cỡ, và cả bốn nêu cùng lý do: 2–3 tiêu chí là **rào chắn**, không phải tính năng (phân quyền · giữ xanh hồ sơ đã ký ·
ranh giới tệp). Thước cỡ đếm cả chúng.

## Bốn lượt gõ của DH5

1. `/acceptance-gate:approve <slug> duyệt` → **chặn**, không ghi gì. Thẻ mời ký không báo chốt cỡ trước (lỗi
   phiên thợ, nhưng khuôn thẻ cũng không ép nó báo).
2. `/acceptance-gate:approve <slug> sửa: giữ cỡ — <lý do>` → ghi dòng `approach` vào sổ, dựng lại thẻ, **hỏi lại**.
3. «Duyệt phạm vi» gõ trong khung chat → không tính (ADR 0002, đúng thiết kế, nhưng là một chạm nữa).
4. `/acceptance-gate:approve <slug> duyệt` → ký.

## Hai gốc

1. **Ngữ pháp một lượt gõ không gộp được giữ cỡ với duyệt.** Bước 1 của `approve` kiểm `co_hop_dong.chan` TRƯỚC
   khi đọc đuôi câu. Một câu `duyệt — giữ cỡ: …` vẫn bị chặn, dù đuôi tự do theo `GATE-ONESHOT-GRAMMAR` được ghi
   nguyên văn vào sổ. Ý muốn của người là MỘT («nhận phạm vi này, kể cả cỡ của nó»), nhưng kit đòi hai lượt.
2. **Thẻ Cổng 1 không in sẵn câu gộp khi chốt cỡ đang bật.** Người chỉ biết sau khi bị chặn.

## Đề xuất (chưa làm — meta đóng băng, chờ owner gọi tên)

- `approve` nhận `duyệt, giữ cỡ — <lý do>` (và `giữ cỡ — <lý do>; duyệt`). Máy ghi dòng `approach` giữ cỡ, ghi
  dấu niêm, ghi `approved_by` trong CÙNG một lượt. Đường cũ hai lượt vẫn chạy (đọc-cũ).
- Thẻ Cổng 1: khi `co_hop_dong.chan = true`, dòng lệnh in sẵn là câu gộp, kèm lý do giữ cỡ máy đề xuất và lối
  «tách» để người chọn.
- Răng hai chiều: câu gộp ghi đúng ba thứ (dòng sổ, dấu niêm, `approved_by`); câu `duyệt` trần ở hợp đồng ≥ 13
  tiêu chí vẫn chặn (chiều đỏ không đổi).

**Người hưởng:** owner — 4/5 vòng × ≥ 1 lượt gõ thừa mỗi vòng. Nguyên tố 3: cổng còn đúng một lượt quyết thật.

## Biện pháp tạm (đã áp 15/10, không đổi kit)

Điều phối M5 dặn mọi thợ crm: thẻ Cổng Phạm vi nào có `co_hop_dong.chan` thì lời mời ĐẦU TIÊN phải nêu chốt cỡ và
in sẵn hai dòng (`sửa: giữ cỡ — …` rồi `duyệt`). Như vậy còn 2 lượt thay vì 3–4.

## Ngưỡng mở thành ô

Owner gọi tên ở cửa sổ kit kế (sau 2.31.0), hoặc ≥ 3 vòng nữa ở bất kỳ kho nào chạm chốt cỡ mà tốn ≥ 2 lượt gõ.
