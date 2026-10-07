# Hạt giống — mục ngoài hợp đồng mang sang sau lượt sửa: ba ca biên của luật «luôn mang sang»

**Ngày:** 2026-10-07 · **Trạng thái:** hạt giống (SỔ, chưa là ô).
Gốc: acceptance-gate-kit/_acceptance/luot-sua-giu-du-dem-dung/ — Ngoài-1, Ngoài-6, Ngoài-7 của lượt chấm 2 (mức trung bình), owner định tuyến «mở hợp đồng mới» ở Cổng Bằng chứng 07/10.

## Hình dạng

Vòng `luot-sua-giu-du-dem-dung` đổi luật T5: mọi mục ngoài hợp đồng lượt trước đều mang sang, mục trên
tệp bị lượt sửa chạm mang nhãn «(r<N> · tệp đã đổi)» (gốc crm `don-okr-nhap-sai`, 07/10). Lượt chấm 2
tìm ra ba ca biên của luật ấy:

- **Ngoài-1 — mục tươi trùng khoá bị lọc trước phân loại.** `acceptance-verify.js` vẫn bỏ mọi finding
  tươi có khoá `tệp :: tiêu đề` trùng một mục carry trước khi triage. Khi tệp đã đổi (`tepDoi`), mục
  tìm lại đúng tên có thể nay là lỗi TRONG hợp đồng do chính bản sửa gây ra, nhưng nó không bao giờ kéo
  được REJECT. Chú thích của khối còn nói «tệp không đổi nên phân loại cũ còn giá trị» — nay sai.
- **Ngoài-6 — lượt chấm vô hiệu để lại mục ma.** `carry-plan.mjs` lấy MỌI dòng `kind: finding` có
  `round === prevRound`; lượt bị vô hiệu (cây đổi / thước lệch) rồi chạy lại cùng số lượt thì cả hai lần
  chạy đều được mang sang, kể cả mục về tệp đã hoàn lại (đo trên chính hồ sơ này: 6 mục, 5 trỏ tệp không
  còn ở HEAD). Không lọc trùng trong danh sách carry.
- **Ngoài-7 — mục đã gạch hiện lại.** SKILL nói người gạch mục «tệp đã đổi» nếu nó đã hết, nhưng lượt
  sau carry đọc lại từ sổ chạy chứ không đọc chỗ người gạch, nên mục sống mãi và có thể giữ vòng ở cổng.

## Hướng nghiệm (chưa chọn)

- Ngoài-1: mục `tepDoi` không vào tập khoá lọc trước triage (vẫn in như mục carry), hoặc khai giới hạn.
- Ngoài-6: carry-plan chỉ đọc dòng finding của lần chạy cuối cùng của lượt trước (khớp `ts` với dòng
  `round-tally` cuối), bỏ lần chạy có dòng `cay-doi`/`thuoc-lech` cùng `luot_ts`; lọc trùng `(tệp, tiêu đề)`.
- Ngoài-7: định tuyến của người ở Cổng 2 (dòng sổ `gate2` nhắc «Ngoài-N») thành đầu vào của carry, hoặc
  sửa lời SKILL cho khớp hành vi.

## Ngưỡng mở ô

≥1 kho tiêu thụ gặp một trong ba ca trên một lượt chấm thật (mục ma trên thẻ, mục đã gạch hiện lại, hay
một lỗi trong hợp đồng lọt vì trùng khoá).
