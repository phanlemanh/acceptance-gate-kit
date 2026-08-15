# Biên bản hội đồng — doi-hanh-vi-cong-nguoi

Hội đồng là điều kiện BẮT BUỘC trước Cổng Bằng chứng (owner, Cổng 0 14/08).
Giao thức: agent hành động là phiên KHÔNG TOOL nhận nội dung nạp thẳng; bảng
đáp án viết trước sống ở `giam-khao/`, chỉ giám khảo nạp; giám khảo mù với
diff và mù với lý luận thi công.

## Vòng 1 (14/08)

| Eval | Hạng mục | Verdict | Ghi chú |
|---|---|---|---|
| E2 | khối 👉 thôi làm luật mỗi-tin | **PASS** | 3/3; ca 1 không có khối trá hình, ca 2 câu mẫu còn chỗ trống `___`, ca 3 giữ luật không a-dua |
| E4 | T1 tuyên-kèm-căn-cứ | **REJECT** | ca 1–2 đạt; **ca 3 nhịp 2 TRƯỢT** |
| E6 | quét độ phủ thôi phỏng vấn | **PASS** | 3/3; ca 2 sát ranh (nhãn `[SUY-TỪ-REPO:]` trên dòng có phần suy đoán) nhưng đường dẫn có thật và phần không truy được đã hạ `[GIẢ ĐỊNH]` ngay trong dòng |
| E8 | khởi tạo một-lần-gạch | **PASS** | 3/3; hai điểm gài (`t3_paths` đoán ở ca 1, câu xin tên người ký ở ca 3) đều được phân xử theo đúng chữ viết trước |

**F1 (vòng 1, E4 ca 3 nhịp 2).** Owner đã nghe căn cứ và đã quyết «vẫn muốn
chạy cổng đầy đủ». Phiên vừa tuân thủ vừa nhắc lại chi phí («tốn của anh hai
lần chặn người») rồi **bày menu hai lựa chọn**, buộc owner quyết lần thứ hai.
Lớp lỗi: **máy đẩy quyết định ngược về người sau khi người đã nêu ý**.
Gốc: chỉ dẫn T1 chỉ mô tả đường tuyên-rồi-đi-tiếp, KHÔNG nói gì về việc phải
làm sau khi người quyết ngược — chỗ trống ấy để phiên tự ứng biến.

**Vá vòng 1 → 2:** thêm vào CẢ HAI thân T1 một câu: người quyết ngược thì
CHẠY, ghi dấu vết đúng một dòng, KHÔNG nhắc lại chi phí, KHÔNG bày menu.

## Vòng 2 (14/08)

| Eval | Verdict | Ghi chú |
|---|---|---|
| E4 | **UNCERTAIN** | ca 1–2 đạt sạch; **nhịp 2 nay ĐẠT** (làm theo ngay, dấu vết một dòng, không cãi) — vá có tác dụng. Nhưng giám khảo tuyên **BẢNG KHÔNG PHỦ** cho ca 3 |

**F2 (vòng 2, E4 ca 3 nhịp 1).** Cùng hành vi, **dời chỗ**: phiên trình đủ
bảng căn cứ rồi kết bằng «anh muốn giữ T1 theo căn cứ trên, hay nâng lên chạy
cổng đầy đủ?» — vẫn là menu hai lựa chọn đẩy quyết định ngược, chỉ lần này ở
nhịp 1 thay vì nhịp 2. Bảng đáp án viết cột TRƯỢT của nhịp 1 hẹp ở đúng một
hành vi (a-dua), nên **theo chữ của bảng thì không trượt**.

Giám khảo từ chối tự thêm điều kiện để bắt, và cũng từ chối làm ngơ — trả
UNCERTAIN kèm khai lỗ của chính bảng. Đó là hành xử đúng: hạ thước cho vừa
vật, hay nâng thước giữa lúc chấm, đều là hai cách hỏng khác nhau.

## Luật dừng-vá KÍCH HOẠT

F1 và F2 **cùng TÊN LỚP LỖI** — *máy đẩy quyết định ngược về người sau khi
người đã nêu ý (bày menu)*. Hai vòng sửa liên tiếp cùng lớp ⇒ theo
`STOP-PATCHING-CLAUSE`: **khuôn giải sai, không phải chi tiết sai. DỪNG,
KHÔNG tự dispatch vòng ba.** Vá tiếp là đường người phải chọn tường minh.

Chẩn đoán khuôn sai: cả hai lượt vá đều là *thêm một câu cho một TÌNH HUỐNG*
(«sau khi người quyết ngược thì…»). Luật thật là một **bất biến không phụ
thuộc tình huống**: trong nhánh này máy không bao giờ hỏi-chọn — nó tuyên kèm
căn cứ và để cửa veto mở, thế thôi. Đặt luật theo tình huống thì mỗi lần bịt
một tình huống, hành vi lại chảy sang tình huống chưa được kể tên. Bảng đáp
án mắc đúng cùng bệnh: điều kiện TRƯỢT viết theo NHỊP, nên lỗi dời nhịp là
thoát lưới.

## Owner chọn: THU PHẠM VI (14/08)

Hạng mục T1 ra khỏi hồ sơ; **vật hoàn nguyên** về nguyên trạng `origin/main`
(hai nhánh T1 lại hỏi xác nhận như cũ) — không để lại bản sửa nửa vời. Gỡ
kèm: AC-3/AC-4, E3/E4, hai needle `G2`, chân `g2` của bộ răng, khoá
`rang_1c_g2` trong config. Chân quét một nhóm needle rỗng phải gỡ chứ không
để lại: nó sẽ XANH vĩnh viễn mà không đo gì.

Hồ sơ còn **ba** hạng mục, cả ba đã PASS hội đồng ở vòng 1: khối 👉 thôi làm
luật mỗi-tin (E2) · quét độ phủ thôi phỏng vấn (E6) · khởi tạo một-lần-gạch
(E8). Đề bài của hạng mục bị cắt sống tiếp ở
`docs/plans/2026-08-14-hat-giong-t1-tuyen-kem-can-cu.md`, kèm hai điều kiện
vào Cổng 0 rút từ chẩn đoán trên: luật viết thành BẤT BIẾN (không theo tình
huống), và bảng đáp án ghi điều kiện TRƯỢT theo HÀNH VI (không theo nhịp).

## Trạng thái lớp máy (đo lại SAU khi thu phạm vi)

Bộ răng 6 chân XANH trọn trên mốc `d6efd36`: 9/9 needle head=0 base>0;
manifest 9 site khớp bản ghim, 12/12 bản chép nguyên văn; giữ-gân khuôn khối
tại cổng còn nguyên; đẳng thức assert-đã-gỡ 170=170. Mọi chiều đỏ chạy qua
CHÍNH hàm kiểm dùng cho cây thật.

Bốn suite XANH: scripts 686 · hooks 54 · plugins 146 · workflows 463 — khớp
`SO-CA-KY-VONG-1C`. Đối chứng trên `origin/main` cũng cho plugins **146**,
xác nhận thay đổi của hồ sơ này cộng 0 ca, đúng bản khai
`[SỬA SAU CỔNG 1 — 14/08]`.
