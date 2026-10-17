# Hạt giống — đổi lời tiêu chí của hồ sơ ĐÃ KÝ lọt qua, chữ ký cũ vẫn đứng

**Ngày:** 2026-10-17 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** TRỪ trước (chặn ở bộ đọc và bước kiểm trước-gộp sẵn có; không thêm cổng).
Gốc: `crm-onehub/_acceptance/tin-hieu-tu-ve-kho` — PR #453 (gộp 16/10 19:45Z) đổi lời AC-8 sau chữ ký 14/10; PR #454 (gộp 17/10 00:00Z) chủ kho ký lại.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Số đo

- Hồ sơ `tin-hieu-tu-ve-kho` của crm ký Cổng Bằng chứng 14/10. Ngày 16/10, PR #453 đổi lời AC-8 kèm một dòng sổ
  revisit không có `decided_by`.
- Kit không chặn ở bước nào: thẻ Cổng Bằng chứng không hiện «tiêu chí đổi sau chữ ký», bước kiểm trước-gộp xanh.
- Một điều phối máy gộp #453. Điều phối máy thứ hai bắt được bằng mắt, không bằng phép đo nào.
- Chủ kho ký lại ở #454. Lệnh ký gọi đích danh slug ghi đè `human_signoff` im lặng — không có lối «ký lại» riêng,
  và người ký không được chỉ phần đã đổi.

## Gốc

Chữ ký ràng vào hồ sơ bằng trường `human_signoff`, không ràng vào NỘI DUNG hợp đồng lúc ký. Mọi sửa `contract.md`
sau commit ký đều giữ nguyên chữ ký, nên «đã ký» trên thẻ nói một điều mà vật không còn đúng. Đây là lớp *ý định
trôi sau khi chốt*: nguyên tố 1 đòi ý định chốt trước khi làm, và đổi nó phải qua người.

## Đề xuất (chưa làm — meta đóng băng, mở ở mốc «Tinh chỉnh sau hai đợt thử» 05/11 khi owner gọi tên)

1. **Bộ đọc (TRỪ trước):** so `contract.md` ở commit ghi `human_signoff` với bản hiện tại; khác ở khối tiêu chí →
   cờ đỏ trên thẻ «chữ ký không phủ hợp đồng hiện tại», kèm diff lời của các AC đổi.
2. **Bước kiểm trước-gộp sẵn có:** chặn cùng điều kiện, thông điệp chỉ đúng hồ sơ và AC.
3. **Ký lại:** vẫn là lệnh ký hiện có, không thêm lệnh; khi phát hiện đổi sau chữ ký, thẻ đặt phần đổi lên đầu và
   sổ ghi «ký lại sau đổi AC-n».
4. Chiều đỏ: sửa một chữ trong AC của hồ sơ đã ký → (1) và (2) đỏ đúng thông điệp; đối chứng dương: sửa tệp khác
   của hồ sơ (ghi chú, hình) → im; ký lại → xanh.

**Người hưởng:** owner (chữ ký trên thẻ luôn phủ đúng hợp đồng đang đứng) và điều phối máy (không còn phải bắt
bằng mắt trước khi gộp).

**Kho không gặp sự cố này được gì, mất gì:** kho không sửa hợp đồng sau ký thì không thấy gì mới. Mất: hồ sơ cũ
từng sửa lời sau ký sẽ hiện cờ đỏ — cần đường đọc-cũ (cờ vàng cho hồ sơ ký trước mốc chứa thay đổi).

## Ngưỡng mở thành ô

Owner gọi tên ở mốc 05/11, hoặc lần thứ hai một PR đổi lời tiêu chí của hồ sơ đã ký lọt tới gộp.
