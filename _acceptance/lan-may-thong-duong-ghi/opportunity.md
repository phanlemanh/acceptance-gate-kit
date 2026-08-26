---
schema_version: 1
slug: lan-may-thong-duong-ghi
feature: Bật đường ghi cho ô kết «máy đã thông» của làn V
owner: phanlemanh@gmail.com
stage: discovery
decision:
decided_by:
decided_at:
prototype:
  base_commit:
  disposition:
---

## Vấn đề & ai gặp

Làn V để máy đi tiếp khi bằng chứng sạch, nhưng vòng **kết thúc không có tên**: hồ sơ nằm
mãi ở `verified` — cùng ô với «máy chấm xong, chờ người ký». Ai mở bảng điều khiển cũng
không phân biệt được «đang chờ tôi» với «xong rồi, tôi chỉ có quyền veto». Ô kết có tên
(`machine-cleared`) đã được dựng và **mọi bên đọc xử lý được nó** — lưới trước-merge, hook,
bộ quét, bản đồ, thẻ, hai lệnh báo cáo, từ vựng. Nhưng **đường GHI chưa bật**: không bước
nào của vòng được tự đặt trạng thái đó. Người trả giá: mọi vòng đi làn V — họ vẫn đọc một ô
chung cho hai nghĩa khác nhau.

## Vì sao dừng ở đây (chứ không ship trọn)

Vòng chấm cuối (S4-r7, 24/08) xác nhận một lỗi **nặng** trên mặt người của làn, do hai
người chấm độc lập tìm ra và tác giả dựng lại được:

> **Thẻ Cổng 2 vẫn mời ký hồ sơ `machine-cleared` khi hồ sơ có `opportunity.md`.**
> `MAY_DI_TIEP` trong `scripts/gate-card.js` chỉ nhận bốn khoá trạng thái, trong khi bộ quét
> xếp hồ sơ máy-thông có ô cơ hội vào `cho-cong-gia-tri` hoặc `da-giao-khong-do` — hai khoá
> KHÔNG có trong danh sách. Kết quả: một thẻ in CÙNG LÚC «máy đã thông — KHÔNG có chữ ký
> người» và nút «Ký duyệt» / mục «Ký hay trả». Nặng hơn mỹ quan: người bấm theo lời mời đó
> thì chữ ký ghi vào báo cáo trong khi hợp đồng còn `machine-cleared` — và chính hook
> `acceptance-evidence-gate.js` cùng `pre-merge-check.sh` sẽ CHẶN. Thẻ dẫn người vào đường
> cụt. Ca `RT5` xanh vì fixture của nó không có `opportunity.md`.

Đó đúng thứ mà chú thích trong chính file gọi là cấm: «thẻ nói máy đã đi tiếp ở đầu rồi vẫn
bảo Ký hay trả ở cuối — mâu thuẫn ngay trong chính thẻ».

Lỗi thứ hai, hạng vừa, cùng vòng:

> **Răng chống lách «không đo được × mặt người dùng» câm từ `approved` đến `verified`.**
> `mienDoCoNguoiDung` chỉ được hỏi ở nhánh `draft` (Cổng Phạm vi) và nhánh đã-thông-Cổng-2.
> Ô ngưỡng bị đổi thành «Không đo được — …» SAU Cổng Phạm vi trên hợp đồng có mặt người
> dùng thật sẽ không cắm cờ ở BẤT KỲ khoảnh khắc người nào trước khi giao. Điều kiện lách
> được tạo ra đúng ở khoảng thời gian không ai đo.

Lỗi thứ ba, hạng nhẹ: thông điệp VIOLATION «chưa arm cổng» của lưới trước-merge vẫn liệt kê
tập trạng thái CŨ, và chú thích `EVIDENCE_CONSUMING` trong `lib/workspace-record.cjs` cãi
nhau với dòng code ngay dưới nó.

Theo luật **dừng-vá** của kit (vòng vá thứ hai sinh lỗi cùng lớp = sai khuôn, không phải
sai dòng), vòng này **thu phạm vi**: ship phần bộ đọc đã chứng minh, hạ đường ghi thành
giới hạn đã khai, mở ô này.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] Một hồ sơ đi trọn làn V có kết thúc ở ô có tên mà KHÔNG mặt nào của kit mời người ký không — kể cả khi hồ sơ mang `opportunity.md` ở mọi trạng thái ngưỡng?
- Kết quả nào là SỐNG: [đề xuất] ma trận {mọi khoá trạng thái bộ quét gán cho hồ sơ máy-thông} × {mọi trạng thái ngưỡng} viết TRƯỚC, mỗi ô một assert: thẻ không in lời mời ký nào; răng «không đo được × mặt người dùng» đỏ ở CẢ ba chặng `approved`/`implemented`/`verified`; lối ký tay của người vẫn qua
- Kết quả nào là CHẾT: [đề xuất] còn một tổ hợp (trạng thái × ngưỡng) mà thẻ tự mâu thuẫn, HOẶC phải thêm lệnh cổng người thứ bảy, HOẶC phải sửa hồ sơ đã ký
- Timebox: [đề xuất] muộn nhất 2026-10-31 → park

## Out of scope từ khám phá

- Thêm lệnh cổng người mới — sáu thao tác là danh sách đóng (ADR 0002), «chỉ TRỪ, không CỘNG».
- Đổi sáu điều kiện xanh-sạch — danh sách đóng, ô này chỉ bật đường GHI của ô kết.
- Bỏ chữ ký người khỏi làn — người ký sau vẫn phải đi được, đó là lối ra thứ hai của cổng.
