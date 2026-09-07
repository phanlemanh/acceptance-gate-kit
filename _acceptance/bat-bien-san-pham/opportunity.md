---
schema_version: 1
slug: bat-bien-san-pham
feature: Bất biến sản phẩm — PRODUCT-INVARIANTS.md ở gốc repo tiêu thụ, luật sản phẩm nạp lúc viết đặc tả, thứ khó-đảo tự nổi lên thẻ như mục người
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

Kit có bản đồ của VIỆC (`PRODUCT-MAP.md`) nhưng chưa có bản đồ của SẢN PHẨM: cấu trúc sản phẩm
(bề mặt công khai, khuôn IA, hợp đồng dữ liệu, tenant/quyền) là thứ khó-đảo, theo hiến pháp kit
phải là mục cho người — nhưng máy đang quyết ngầm từng mẩu ở S1 mà không cổng nào thấy. Bảy repo
tiêu thụ đã tự làm ngoài kit (media-library `## Product Context`, artifact-platform spec kiến trúc
+ skill hub-invariants, radar `docs/00-nen-tang`, crm/oneflow ADR). Owner gật hạt giống 02/09; ghi
file 07/09 kèm xác nhận ngoài từ «The AI-Native SDLC playbook» (luật nạp lúc viết đặc tả, cờ lo
ngại có chủ luật). Đề bài đầy đủ: `docs/plans/2026-09-02-hat-giong-bat-bien-san-pham.md`.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Máy đang tự thêm bề mặt / đổi hợp đồng công khai mà thẻ Cổng Phạm vi không nêu thành mục người | không có lỗ, hạt giống là bảo hiểm | đếm trên diff PR của 7 repo tiêu thụ giữa hai mốc phát hành (ngưỡng ≥2) | Chưa thử — đang đếm |
| 2 | Một file một trang cho cả IA lẫn kỹ thuật là đủ, không cần hai file | file phình, không ai đọc | viết thử cho media-library (20 hồ sơ, 2 chạm ui) | Chưa thử |
| 3 | Đối chiếu bằng ID bề mặt (kiểu `ST-`) không cần bộ đọc mới — dùng `frontmatterField` + `ac-line` sẵn có | phải tự chế parser → lớp lỗi khớp-vòng-đặc-tả-UX tái phát | ma trận hình dạng viết trước, chạy trên hồ sơ thật của 2 repo | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] tính năng chạm thứ khó-đảo của sản phẩm có tự nổi lên thẻ Cổng Phạm vi thành mục người, đúng tên bất biến bị chạm, mà không thêm lượt gọi người không?
- Kết quả nào là SỐNG: [đề xuất] trên 3 tính năng thật ở ≥2 repo tiêu thụ, mọi bề mặt hợp đồng gọi tên tra được ID trong xương hoặc được khai là mới; diff chạm bất biến → thẻ nêu đúng tên; 0 lần máy sửa file bất biến; 0 lượt gọi người thêm
- Kết quả nào là CHẾT: [đề xuất] máy sửa file bất biến lúc ký; cờ «chưa khai bất biến» tắt được bằng xoá một dòng; thêm một lượt gọi người/vòng
- Timebox: …

## Kết quả prototype

Chưa dựng.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Ổ cắm mẫu `ds_skill` (khoá config trỏ file + luật vắng-thì-gì) | kit `_acceptance/config.yaml` | triết-lý/logic | có | — |
| Play «Requirements and design» | The AI-Native SDLC playbook (Anthropic, 21/08/2026), `docs/research/2026-09-07-ai-native-sdlc-playbook.md` | triết-lý/logic — luật nạp lúc viết, cờ có chủ luật, ghi phiên bản luật | có | — |
| Bản consumer tự làm | media-library `CLAUDE.md ## Product Context`; artifact-platform `docs/spec/…` + skill hub-invariants | vật liệu tham chiếu, không chép | không | — |

## Cổng 0

- **decision = …** Chờ ngưỡng đếm (≥2 lần máy tự thêm bề mặt giữa hai mốc) hoặc owner gọi tên.
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** chép từ bullet `[đề xuất]` ở trên sau khi người gỡ tiền tố.

## Out of scope từ khám phá

- Máy KHÔNG sửa `PRODUCT-INVARIANTS.md` lúc ký (đính chính ADR 0007: file người viết ≠ bản đồ máy sinh).
- Không gọi là spec / kiến trúc / PRD; không đặt nhịp quyết-hết-từ-đầu.
- Không dựng bộ đọc frontmatter thứ hai; không thêm cổng người.
