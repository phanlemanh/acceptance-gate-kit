# ADR 0017 (ĐÃ THAY bởi [ADR 0018](0018-cong-can-phe-duyet-khong-cam-giu-don-gian.md), cùng ngày 15/09 — giữ làm sử liệu) — Điều kiện thu hồi luật NỚI đã đủ số nhưng owner giữ nguyên; đổi lại, mọi ô mở dưới luật nới phải trả lời bằng năm dòng số và north star

2026-09-15, lúc mở cửa sổ 2.14. Luật NỚI 07/09 (vế «không CỘNG» tạm ngưng) mang
sẵn một điều kiện thu hồi tự động: *lượt gọi người/vòng vượt trần ở hai mốc phát
hành liên tiếp*. Số đã đủ theo đúng chữ ấy — 2.12.0 đếm 14 lượt cho vòng
`cong-nguoi-doc-du-nguon` so trần T3 là 4; 2.13.0 đếm 4 lượt (trong thiết kế 1,
ngoài thiết kế 3) so trần T2 là 3. Hồ sơ 2.12.0 §5 đã đặt đúng câu hỏi này cho
người và **không ai trả lời**; hồ sơ 2.13.0 không nhắc lại, nên nó treo qua trọn
một cửa sổ. Owner trả lời khi mở cửa sổ 2.14: **giữ nguyên luật nới** — vế «không
CỘNG» vẫn ngưng, 31 ổ đang mở KHÔNG phải khai lại căn cứ — **đổi lại, mọi chỗ nới
từ nay phải chịu giám sát và trả lời bằng chính bộ chỉ số đang chạy: năm dòng số
của luật (c) và north star.**

**Đánh đổi đã nhìn thẳng.** Lối thu hồi là cách đọc ĐÚNG CHỮ, và bỏ qua một điều
kiện đã nổ là đúng hình dạng mà luật (c) sinh ra để chặn; ghi ở đây để hồ sơ sau
không đọc thành «điều kiện ấy chưa bao giờ nổ». Căn cứ cho lối giữ: nguyên nhân
đo được của ba lượt ngoài thiết kế ở 2.13 là khung giải sai hai lần (luật DỪNG-VÁ
nổ hai lượt), không phải một ô nào mở dưới luật nới; thu hồi sẽ đóng cửa CỘNG cho
31 ổ mà không chạm nguyên nhân, tức trả giá ở chỗ không có bệnh. Cái giá của lối
giữ là điều kiện tự động mất răng một lần — và nghĩa vụ mới dưới đây là thứ thay
vào chỗ đó.

**Nghĩa vụ mới, phát biểu để máy đọc được ở mốc phát hành.** Mỗi ô mở dưới luật
nới đã phải *ghi rõ là ô nới* trong hồ sơ; từ nay nó phải, tại mốc phát hành gần
nhất sau khi nó ship, **đối chiếu bảng dự báo năm dòng của chính nó với số thật
đã đếm** — dòng nào đạt, dòng nào trượt, và nếu trượt thì trượt vì gì. Ô không
trả lời được bằng năm dòng số, hoặc trả lời mà số đi ngược north star (điển hình:
token giảm mà lượt gọi người tăng), là ô phải đóng hoặc thu phạm vi, không phải ô
được chạy tiếp vì đã lỡ mở. **KHÔNG dựng phép đo mới cho nghĩa vụ này** — đó là
ràng buộc, không phải chỉ số: luật (a) cấm mở tầng đo-thước-của-thước, và bảng
dự báo năm dòng + điều kiện tin cậy đã là vật có sẵn ở mọi hồ sơ đổi kit. Điều
kiện thu hồi cũ vẫn nguyên chữ và vẫn đang đếm; lần nổ kế tiếp đọc trên cùng năm
dòng ấy.

Nguồn của luật vẫn là đoạn NỚI trong `CLAUDE.md`, đã cập nhật cùng lượt với ADR
này. Bối cảnh: hồ sơ `_acceptance/release-2-12-0/contract.md` §5 (câu hỏi gốc) ·
`_acceptance/release-2-13-0/contract.md` khối Notes 1 và 4 (năm dòng số và sổ
tồn đọng) · handoff 07/09 §1.1 (căn cứ mở luật nới).
