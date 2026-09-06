---
schema_version: 1
slug: viec-ke-theo-plan
feature: Việc kế theo plan và hạt giống — kit đọc ý định của repo, không giữ, không sửa
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

Repo có plan dài hơi nhiều phiên (OneFlow: khối plan-freeze 16 ★, 04/09 → 08/11) thì đầu mỗi
phiên máy không biết việc kế: thẻ `/acceptance-gate:start` quét hồ sơ nhưng không đọc plan, nên
phiên 05/09 mất bốn lượt đọc file mới tìm ra hàng kế (B2) và hạn làn owner (A6). Hạt giống nấc 1
(ý chưa có file) không ai đếm — chính kho này có 22 tài liệu `docs/plans/*-hat-giong-*.md` không
thẻ nào nhìn thấy. Bằng chứng, mô hình ba lớp, đề xuất hai phần (B ổ cắm chỉ-đọc trong kit, C gói
riêng cùng kho) và review 05/09 nằm ở
`docs/plans/2026-09-06-hat-giong-viec-ke-theo-plan.md`. Owner 06/09: B trước C; ô này CHỜ mốc
09/10 của OneFlow (điểm dữ liệu đầu tiên của chính khuôn plan) rồi mới xét quyết — không mời ký
trước mốc.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Khuôn plan của OneFlow đứng vững qua mốc 09/10 (không phải đổi cột hay luật) | khái quát một thứ chưa ổn | đọc số tại mốc 09/10 | Chưa thử |
| 2 | Có repo thứ hai muốn khai `plan.block` | ổ cắm chỉ phục vụ một repo, nên để repo-local | tìm marker trên các repo đã init trong 30 ngày sau B | Chưa thử |
| 3 | Ba loại hàng (có slug · kiểm cơ hội · tin theo lời) đủ phủ plan thật (OneFlow: 8/20 hàng không slug) | thẻ in «việc kế» sai hoặc bỏ sót làn owner | đếm hàng theo loại trên khối plan hiện có | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …

## Kết quả prototype

Chưa dựng. Bản mẫu repo-local đang chạy ở OneFlow (`scripts/roadmap/check-plan-freeze.mjs`, chỉ
builtins) là vật để đọc số tại mốc 09/10, không phải prototype của ô này.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Khối plan-freeze + guard | OneFlow `docs/roadmap.md`, `scripts/roadmap/check-plan-freeze.mjs` | triết-lý/logic — khuôn hàng, ba loại hàng, luật băng | có, sau mốc 09/10 | — |
| Ổ cắm trung tính | kit `discovery.brainstorm_skill` | triết-lý/logic — khoá vắng thì im | có | — |

## Cổng 0

- **decision = …** Chờ mốc 09/10 (owner 06/09).
- **disposition = …**
- **Ngưỡng UAT chốt cùng lúc ký:** đề xuất bốn thước ở §6 của tài liệu hạt giống (repo thứ hai
  trong 30 ngày · «việc kế» đúng ≥ 8/10 phiên · 0 lần CI đỏ vì lệch tầng, hàng «tin theo lời»
  ≤ 20% · hạt quá 30 ngày đều có phán quyết); chép vào ô khi người ký.

## Out of scope từ khám phá

- Không đưa ★, làn, ngưỡng 85%, ba lý do ngoại lệ, mốc 09/10 vào kit dưới dạng hằng.
- Không để kit ghi bất kỳ ô nào của plan; ◐ chỉ in, không ghi vào file.
- Không kit-hoá nấc 2 hạt giống (thẻ start đã có «Đang cân nhắc» kèm tuổi và cờ quá hạn).
- Không viết bộ đọc frontmatter thứ hai; không sinh lại bản đồ bằng bộ sinh cache khi bộ kiểm
  vendored của repo chưa nâng theo.
- Không gộp bản đồ sản phẩm với plan (từ điển: «Product map, _Avoid_: roadmap»).
