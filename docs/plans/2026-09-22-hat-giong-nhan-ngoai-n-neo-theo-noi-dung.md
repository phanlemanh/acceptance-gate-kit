# Hạt giống — nhãn «Ngoài-N» neo theo NỘI DUNG mục, không theo vị trí

**Ngày:** 2026-09-22 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: _acceptance/ho-so-khep-thoi-hoi — dòng sổ `d-20260922T061926Z-23`: ngưỡng mở lại của giới hạn «nhãn Ngoài-N là vị trí mục» chạm lần đầu trên chính hồ sơ này, round 3.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

## Ca thật

Vòng `ho-so-khep-thoi-hoi` cho làn máy-đi-trước đọc sổ quyết định: mục ngoài hợp đồng thứ N coi
là đã được người định tuyến khi có dòng `stage: gate2` nhắc «Ngoài-N»
(`mucChuaDinhTuyen` trong `lib/out-of-contract.cjs`). N là **vị trí** của mục trong khối «Ngoài hợp
đồng» của `review-findings.md` lúc thẻ được dựng — cùng cách thẻ đánh số.

Ngày 22/09 owner trả lại ở Cổng Bằng chứng; sổ nhận mười dòng gate2 «Ngoài-1 … Ngoài-10». Lượt
chấm round 3 sinh lại tệp phát hiện: bốn mục cũ (Ngoài-6/8/9/10) trở thành Ngoài-4/5/6/7, và ba
mục mới chiếm Ngoài-1..3. Dòng sổ cũ «Ngoài-1: ghi Known limits» nay trỏ vào một mục MỚI mà
người chưa từng thấy.

Hồ sơ ấy hạng T3 nên luôn cần chữ ký — không đổi làn oan. Ở hồ sơ làn V (T2, không chữ ký), cùng
hình dạng sẽ làm một mục chưa ai quyết trông như đã quyết: **fail-open đúng lớp vòng này đi đóng**.

## Dạng nghiệm đúng tầng

Nhãn rút từ NỘI DUNG mục — băm ngắn của tiêu đề finding (và tệp) — do CẢ bên viết (prompt
synthesize, khối marker `OOC-ITEM-TEMPLATE` trong `feature-loop/workflows/acceptance-verify.js`)
lẫn bên đọc (`lib/out-of-contract.cjs`, thẻ Cổng 2, `mucChuaDinhTuyen`) cùng rút. Dòng gate2 ghi
nhãn nội dung; vị từ khớp theo nhãn ấy. Đường đọc-cũ: dòng gate2 chỉ mang «Ngoài-N» → khớp theo vị
trí như hôm nay, kèm cờ vàng trên thẻ.

Không làm trong vòng 2.18.1 (luật chiều rộng (b) — đã một vòng meta). Ngưỡng mở ô: ≥ 1 hồ sơ làn V
có lượt chấm mới SAU dòng gate2 nhắc «Ngoài-N» mà tệp phát hiện đổi.

## Ngưỡng ĐÃ CHẠM — 22/09, ngày crm cài 2.18.1

Gốc: crm/_acceptance/quyen-luot-mang-theo — hồ sơ làn V `machine-cleared`; dòng gate2 «Ngoài-1..5» ghi 09/09 05:59
cho NĂM mục KHÁC, lượt chấm 6 lúc 09:23 sinh lại SÁU mục mới; vị từ theo vị trí coi 1..5 là đã định tuyến, chỉ báo
Ngoài-6 → CI crm #78 đỏ đúng một mục trong khi cả sáu chưa người nào thấy; mục 5 chạm người dùng. Đường ra: owner
định tuyến sáu mục bằng một dòng ký. Ngưỡng «≥ 1 hồ sơ làn V» đã chạm: ô mở khi owner gọi tên, cửa sổ kế.
