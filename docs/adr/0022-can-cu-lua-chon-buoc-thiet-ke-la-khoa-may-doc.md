# ADR 0022 — Căn cứ của lựa chọn ở bước thiết kế là một khoá máy đọc trên dòng sổ

2026-10-11 · CỘNG, chủ kho (Manh Phan) phê đích danh ở Cổng Phạm vi của vòng
`buoc-len-thiet-ke-khong-hoi` (câu hỏi Hỏi-1, trả lời «duyệt» — ADR 0018). **Số đo:** sổ bước
thiết kế của crm 22/09–11/10 có 51 lựa chọn chủ kho trả lời giữa bước thiết kế: **28** có căn cứ
máy đã có (22 mục tiêu + quy tắc đã khai, 6 chỉ một lối ra sống), **23** chỉ người có; trên
transcript, 10/10 câu loại đầu được trả lời theo khuyến nghị, 0/8 câu loại sau. Lời dặn S1 của
kit dạy máy dừng hỏi cả hai loại. **Quyết định:** bước thiết kế không dừng hỏi; mỗi lựa chọn
thành một dòng `stage:"S1"` mang khoá tuỳ chọn `can_cu` = `{nguon, kho_dao, tep+trich |
loi_chet | khuyen+loi_khac}` theo khuôn marker `DEC-CAN-CU-SLOT`; một bộ đọc duy nhất
(`scripts/can-cu-s1.cjs`) xếp dòng thành máy-đã-quyết · câu-hỏi · đỏ · đời-trước · bị-thay; thẻ
Cổng Phạm vi tách câu hỏi khỏi lựa chọn máy đã quyết, dòng đỏ chặn điền sẵn chữ duyệt; người lật
ở Cổng Phạm vi thì máy ghi dòng `gate1` theo khuôn `DEC-LAT-GATE1` để đếm được. **Vì sao không
trái ADR 0021:** 0021 bác một *câu thứ tư cho người đọc*; `can_cu` là con trỏ cho *máy kiểm* —
cùng loại khoá `target` của dòng `fix` (DEC-TARGET-SLOT) — ba câu người đọc giữ nguyên.
**Trade-off nhận có tên:** bộ kiểm tất định kiểm vật (nguồn, câu trích có thật và có từ trước
vòng, khó-đảo), không kiểm nghĩa; máy dán nhãn «mục tiêu» bằng một câu trích có thật nhưng không
quyết được lựa chọn thì không đỏ — lưới là phản biện context sạch soi mọi dòng máy đã quyết và
thẻ in câu trích cạnh lựa chọn; ngưỡng mở ô: ≥ 1 lần chủ kho lật một dòng máy đã quyết ở Cổng
Phạm vi (`node scripts/can-cu-s1.cjs --root <kho> --dem`). **Đường đảo:** ngừng ghi khoá — bộ đọc
coi dòng không khoá là đời trước, không đỏ, thẻ in như trước. **Không làm:** tiền tố căn cứ trong
câu `why` (máy phải bóc chữ người), loại dòng mới `type: hoi` (bộ đếm theo `type` đếm sai), chặn ở
lúc gộp (lõi cưỡng chế, mọi kho trả giá ở CI — mở khi một dòng đỏ lọt tới lúc gộp). Hồ sơ:
`_acceptance/buoc-len-thiet-ke-khong-hoi/`.
