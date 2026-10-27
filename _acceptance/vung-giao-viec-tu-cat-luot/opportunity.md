---
schema_version: 1
slug: vung-giao-viec-tu-cat-luot
feature: Vùng giao việc đi từ cắt lượt — mỗi hàng mang vùng mã dự kiến từ lúc cắt, để lịch biết tệp thấy được hai hàng cùng sửa một màn và tự xếp nối tiếp
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Gốc: crm/_acceptance/bo-okr-co-so — hàng VK8 của đợt «vỏ khu Mục tiêu» (crm, 25–27/10): ký Cổng Bằng chứng 01:03Z 27/10, hơn 12 giờ chưa gộp, năm lượt ghim; lượt đầu đỏ vì hàng VK6 (`crm/_acceptance/so-do-toan-vung`) gộp trước và bỏ đúng hành vi mà thước E4 của VK8 khoá. Đề bài: phanlemanh/acceptance-gate-kit#430.

Lịch biết tệp (hồ sơ `ky-den-gop`, bản 2.34.0) có chạy trong đợt ấy nhưng không bao giờ thấy hai hàng cùng sửa một màn.
Nó so vùng tệp tự khai của hàng mới với diff thật của các nhánh đang mở, và với vùng tự khai của hàng đang dở. Hàng lộ
trình không có trường vùng mã nào; gói đợt không điền giúp; giám sát khai tay. Đo trên sổ đợt (Mac Studio, 27/10
14:34Z): **22/22 hàng chỉ khai thư mục hồ sơ của chính mình**, 2 sự kiện `trung-tep` (cả hai chỉ trùng tệp hồ sơ),
0 lần tự xếp `sau`. Hệ quả đo trên nhánh chính crm 25–27/10: 19 lần ghim thật dồn vào 6/14 PR, 21,2 giờ khoá máy cho
ghim lại, 6/17 lượt ghim không xanh trọn là thước bị hàng khác làm gãy, 0 lượt chắc chắn đỏ vì lỗi sản phẩm.

Người trả giá: chủ kho (câu hỏi «thước gãy?» ngoài ba cổng thiết kế, khoá máy ngồi chờ câu trả lời), phiên giám sát
(khai vùng và xếp thứ tự gộp bằng tay), và khoá máy chấm — chỗ hẹp của cả dòng việc.

Lịch biết tệp chỉ xét lúc giao hàng, khi hàng chưa có kế hoạch, nên vùng dự kiến phải có từ lúc cắt lượt. Cắt theo màn
(đã có cho dáng `lan-va` của `cat-luot`, chưa có cho `chuoi`) là nguồn tự nhiên của vùng ấy.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Vùng mã dự kiến suy được lúc cắt lượt đủ đúng (theo màn → thư mục mã) để lịch bắt được cặp VK6–VK8 | lịch vẫn mù, hoặc báo trùng mọi hàng (glob rộng) và đẩy giám sát về xếp tay | phát lại `xetTrungTep` trên `hang-viec.json` của đợt vỏ khu Mục tiêu với vùng theo màn; đếm cặp bắt được và cặp báo oan | Chưa thử |
| 2 | Xếp nối tiếp các hàng chồng vùng không làm tổng thời gian đợt dài ra | đổi giờ khoá lấy giờ lịch — người chờ lâu hơn | phát lại lịch sử đợt với ràng buộc `sau`; so ngày gộp hàng cuối | Chưa thử |
| 3 | Kho không khai vùng thì hành vi giữ y như 2.34.0 | đổi mặc định — mọi kho trả giá (luật 26/09) | ca vi phân: cùng `hang-viec.json` không trường vùng, bản cũ vs bản mới cho cùng quyết định | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] ở một đợt có ≥ 2 hàng cùng sửa một màn, lịch có tự xếp chúng nối tiếp mà không ai khai vùng tay không, và số lần ghim lại giảm bao nhiêu?
- Kết quả nào là SỐNG: [đề xuất] phát lại đợt vỏ khu Mục tiêu: cặp VK6–VK8 bị xếp `sau`; ở đợt thật kế tiếp có chồng vùng: lần ghim / PR gộp ≤ 0,5 (đo 25–27/10: 1,36), 0 câu hỏi ngoài cổng vì thước gãy do hàng khác; 0 lượt gọi người thêm
- Kết quả nào là CHẾT: [đề xuất] glob suy ra rộng tới mức mọi hàng trùng mọi hàng; kho không khai vùng đổi quyết định lịch; phải thêm một cổng người
- Timebox: …

## Kết quả prototype

Chưa dựng.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Lịch biết tệp (`xetTrungTep`, `docNhanhMo`) | `dieu-phoi/scripts/trung-tep.mjs` (hồ sơ `ky-den-gop`) | vật — vòng cân bằng đã có, thiếu cảm biến | có | — |
| Dáng `lan-va` «một màn, một câu» | `skills/cat-luot/SKILL.md` khối CAT-LUOT-SAU-LUAT | luật cắt — nguồn của vùng theo màn | có | — |
| Phân tích nguyên lý gốc + hệ thống của đề bài | phanlemanh/acceptance-gate-kit#430 (bình luận 27/10) | căn cứ | có | — |

## Cổng 0

- **decision = …**
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** chép từ bullet `[đề xuất]` sau khi người gỡ tiền tố.

## Notes

**Phê duyệt CỘNG (ADR 0018):** owner phê ngày 27/10/2026 trong phiên brainstorm đề bài #430, nguyên văn: «Phê vòng
«vùng giao việc đi từ cắt lượt» (CỘNG), Gốc trỏ hồ sơ crm bo-okr-co-so.» Đây là phê CỘNG, không phải chữ ký Cổng Đáng
— Cổng Đáng (chính sách, ngưỡng) vẫn ký trong vòng.

**Ranh giới:** vòng này chỉ cho lịch biết tệp một cảm biến đúng. Không đổi cách chấm, không thêm giới hạn kho «ký chưa
gộp», không đổi làn ghim. Kho không khai vùng → hành vi 2.34.0.

**Dự báo năm dòng số (luật c):** thời gian làm-xong→quyết-được = · lượt gọi người ↓ (câu hỏi «thước gãy?» ngoài thiết
kế) · vòng bị hạ tầng đốt lượt chấm = · token máy/vòng = · phút máy/lượt chấm ↓ (ít lượt ghim chung nhiều hồ sơ).
Điều kiện tin cậy: đường verdict không đổi thành phần.

**Hạt giống ghi cùng ô này (27/10)** — đọc lại sau một đợt chồng vùng chạy trên bản có vòng này:

- `docs/plans/2026-10-27-hat-giong-thay-the-khai-mot-phia.md`
- `docs/plans/2026-10-27-hat-giong-the-thuoc-se-gay.md`
- `docs/plans/2026-10-27-hat-giong-nhip-giao-theo-suc-khoa.md`
- `docs/plans/2026-10-27-hat-giong-lan-ghim-con-lai.md`
- `docs/plans/2026-10-27-hat-giong-duong-chi-doc-giua-cac-may.md`
