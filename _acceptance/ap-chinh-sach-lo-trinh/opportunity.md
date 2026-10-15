---
schema_version: 1
slug: ap-chinh-sach-lo-trinh
feature: Chủ kho khai chính sách một lần khi mở chiến dịch; máy tự dời hàng khớp chính sách — báo trước một nhịp, ghi sổ — và chủ kho trả lại hay ghim một hàng bằng một lệnh, còn tệp lộ trình giữ nguyên định dạng, thứ tự và mọi khoá lạ
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: RM2
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng RM2 của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Gói road-map — máy tự áp theo chính sách (RM2); ngày máy đề xuất 15/10, chủ kho dời được bằng PR — 19/11/2026.

Chủ kho khai chính sách một lần khi mở chiến dịch; máy tự dời hàng khớp chính sách — báo trước một nhịp, ghi sổ — và chủ kho trả lại hay ghim một hàng bằng một lệnh, còn tệp lộ trình giữ nguyên định dạng, thứ tự và mọi khoá lạ

Vì sao: Gốc: crm/_acceptance/tin-hieu-tu-ve-kho/ — lộ trình chỉ có cửa vào; RM1 (ra-soat-lo-trinh, ký 15/10) đo trên dữ liệu thật: không chính sách chỉ ra 3 đề xuất ở crm, giá trị nằm ở chính sách. Phần còn lại của B′ §6 mục 2–3 và §11 (docs/findings/2026-10-14-kien-truc-roadmap-plugin.md); chủ kho gọi tên «road-map hoàn tất theo B′» 15/10.

Gốc: crm/_acceptance/tin-hieu-tu-ve-kho/ — lộ trình chỉ có cửa vào; lát «chỉ cờ» đã ký ở hồ sơ kit
`_acceptance/ra-soat-lo-trinh/` (RM1, e27adbc3) và đo ra: không có chính sách thì crm chỉ có 3 đề xuất.

**Ai đau:** chủ kho. RM1 đã đưa đề xuất «dời · chờ điều kiện · bác» lên thẻ khởi động, nhưng tệp lộ trình vẫn chỉ đổi
khi một phiên máy sửa JSON bằng tay theo lời chủ kho. Mỗi lần dời là một lần chủ kho phải nói ra, và mỗi lần sửa tay
có thể làm lệch định dạng, thứ tự hay khoá lạ của tệp.

**Ý định (chủ kho 14–15/10, B′ §6 mục 2–3, §11):** chủ kho khai chính sách chiến dịch MỘT lần khi mở chiến dịch
(ngưỡng tuổi hàng, trần «Kế tiếp», đóng băng hay không). Máy tự áp những đề xuất khớp chính sách: báo trước một nhịp,
ghi sổ, và để lại lối trả lại. Bộ ghi nằm cùng tệp với bộ đọc. Người chỉ dùng ba lệnh ghim · bỏ ghim · trả lại;
`/road-map:xem` trở thành bản đồ xong · đang dở · kế. Không thêm cổng mới, không thêm lượt gọi người.
Chặn việc đang chạy là việc khó đảo nên luôn là câu hỏi cho chủ kho, không bao giờ máy tự áp.

**Số đo trước — thước «trước» của Cổng Giá trị** (máy đo 15/10 từ lịch sử git, script và bản chụp ở `nen/`):
crm `onehub` @3818ad4e, 03–14/10, ba tệp `docs/plan/lo-trinh-*.json`: **50** commit không-merge sửa lộ trình. Xếp lớp
theo trường bị đổi:
- **dời / đổi chỗ — việc RM2 sẽ tự làm** (hàng đổi mốc, mốc đổi ngày, `thu_tu`/`han`, hàng rời tệp hay vào `da_bac`):
  10 lượt tệp-commit = 9 commit; trừ `97449348f` (đổi mã DA, không phải dời) còn **8 commit** trong 12 ngày;
- đổi thứ tự phụ thuộc (`dung_tren`): 4 · đồng bộ trạng thái: 11 · thêm hàng/mốc: 15 · khác: 10.
Giới hạn của thước: xếp lớp theo trường, không theo ý người viết commit. Một lần «tăng tốc» chỉ đổi chữ `buoc_ke`
(`4697b288c`) rơi vào lớp «thêm». Thước tính commit sửa tệp, không tính lượt người nói.
Kit (`docs/plans/lo-trinh-kit.json`): 18–19 trên 35 lần sửa là xếp lại bằng tay (tài liệu kiến trúc §2).

**Ngoại lệ luật chiều rộng (b):** RM2 mở trước điều kiện của lộ trình, như một ngoại lệ luật (b) do chủ kho gọi tên.
Điều kiện trong lộ trình là «crm cài bản chứa RM1 và khai thử `chinh_sach`», và nó CHƯA đạt: crm chưa cài bản nào
chứa RM1. Lời gọi tên tới qua một phiên khác — phiên RM1 chuyển lại lời chủ kho ngày 15/10: «Tôi muốn phiên điều phối
sắp xếp và thực hiện luôn.» Máy KHÔNG coi lời chuyển ấy là đã duyệt. Chủ kho xác nhận ngoại lệ bằng chính chữ ký ở
cổng này. Đây là vòng meta thứ ba trong cửa sổ sau 2.30 (MC1, RM1, RM2); hồ sơ mốc kế sẽ đếm.

**Hệ quả cho phép đo:** vì crm chưa cài RM1, ngưỡng dưới chỉ đọc được sau khi crm cài bản chứa RM2 và khai chính sách.
Nếu tới hạn mà crm chưa cài, ô đo ghi «chưa đọc được ở đây» — đó là nhãn trạng thái, không phải CHẾT.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] ở kho đã khai chính sách (crm là kho đầu), trong khoảng giữa hai mốc khép sau khi
  cài bản chứa RM2, còn bao nhiêu commit dời hàng bằng tay, và mỗi lần máy tự dời có một dòng sổ trả lại được bằng
  một lệnh hay không? Thước: `nen/do-nen.mjs`, lớp «dời», bỏ các commit do máy áp chính sách (máy đánh dấu được).
- Kết quả nào là SỐNG: [đề xuất] **0** commit dời bằng tay giữa hai mốc khép (nền: 8 commit / 12 ngày), và 100 % lần
  máy tự dời có dòng sổ cùng lệnh trả lại chạy được.
- Kết quả nào là CHẾT: [đề xuất] số commit dời bằng tay không giảm so với nền (≥ 8 trong cửa sổ cùng độ dài), hoặc có
  một lần máy tự dời mà không có dòng sổ hay không trả lại được.
- Ở giữa (ITERATE): giảm nhưng chưa về 0 — đọc từng commit còn sót để xem chính sách thiếu khoá gì.
- Timebox: [đề xuất] 2026-11-19 (mốc Gói road-map — máy tự áp theo chính sách (RM2)). crm chưa cài tới hạn →
  «chưa đọc được ở đây», không phải CHẾT.
