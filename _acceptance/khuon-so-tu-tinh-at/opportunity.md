---
schema_version: 1
slug: khuon-so-tu-tinh-at
feature: Khuôn ghi sổ quyết định tự tính cả trường `at` — người/máy chỉ điền phần chữ, mọi trường thời gian do shell sinh
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

Khuôn `DEC-ID-RECIPE` (SKILL feature-loop, PR #168 gộp 11/09/2026 `6aec9c12`) tự tính
`id` = `d-<UTC>-<n>` nhưng vẫn bắt người ghi gõ tay `"at":"<ISO>"` trong phần JSON.
Bằng chứng thực địa ngay trong vòng dựng khuôn: hai dòng sổ S4-r1 của hồ sơ
`ma-so-quyet-dinh-duy-nhat` mang `at` gõ tay `09:40:00Z` trong khi mã cùng dòng ghi
giây thật `092728Z` — máy tự sửa trước commit, không có phép đo nào bắt. Đúng lớp
«bất biến sống ở đầu người» mà CLAUDE.md bảo phải chuyển sang vật máy giữ.

**Người trả giá:** người đọc sổ và mọi bộ đọc dựa vào `at` (thứ tự quyết định, đếm
thời gian làm-xong→quyết-được của luật (c)) — số sai mà không ai thấy.

**Trace:** nguyên tố 2 (bằng chứng không tự dối). Không CỘNG bộ phận mới — sửa khuôn
đang có để trường thời gian đi cùng đường với `id`.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Mọi đường ghi sổ (SKILL, approve seal, signoff veto) đều đi qua khuôn nên sửa một chỗ là đủ | Có đường ghi tự viết `at` riêng, lỗi còn sống | grep toàn kit tìm chỗ ghi `decisions.jsonl` không trỏ `DEC-ID-RECIPE` | Chưa thử |
| 2 | `date -u +%Y-%m-%dT%H:%M:%SZ` chạy đồng nhất trên bash/zsh, macOS/Linux | Chuỗi thời gian khác dạng giữa máy owner và CI | Chạy khuôn trên runner CI (ubuntu) và máy macOS, so dạng | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] sau khi sửa khuôn, còn dòng sổ mới nào mang `at` lệch giây với `id` của chính nó không?
- Kết quả nào là SỐNG: [đề xuất] mọi dòng sổ ghi sau bản phát hành chứa bản sửa có `at` khớp giây của `id` (máy đếm trên toàn `_acceptance/*/decisions.jsonl`); lệnh chạy nguyên văn vẫn xanh dưới bash và zsh; 0 lượt gọi người thêm
- Kết quả nào là CHẾT: [đề xuất] còn ≥1 dòng mới lệch; hoặc khuôn phải nói thêm lời dặn thay vì tự tính
- Timebox: …

## Kết quả prototype

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn (đường dẫn/tên gói) | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| (không có vật liệu ngoài kho) | — | — | — | — |

## Cổng 0

- **decision = …** Căn cứ: …
- **disposition = …** Căn cứ: …
- **Ngưỡng UAT chốt cùng lúc ký:** …

## Thước đo thành công → ứng viên criterion

- Tỉ lệ dòng sổ mới có `at` khớp giây của `id` = 100% (đếm máy trên corpus).

## Out of scope từ khám phá

- Không sửa `at` của các dòng sổ đã ghi (sổ append-only; dòng cũ lệch giữ nguyên làm sử liệu).
- Không dựng script ghi sổ riêng — giữ nguyên hướng «khuôn là lệnh chép-dán» của entry d-20260911T090249Z-6 (hồ sơ `ma-so-quyet-dinh-duy-nhat`); lý do: ô này chỉ đưa trường thời gian vào cùng đường với `id`.
