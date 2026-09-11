---
schema_version: 1
slug: premerge-nhu-ci-truoc-khi-mo-pr
feature: Chạy lưới trước-merge đúng như CI — trên cây đã gộp nhánh chính, có base — TRƯỚC khi mở PR, để CI không là nơi đầu tiên phát hiện
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

PR #168 (gộp 11/09/2026 `6aec9c12`) có **3 lượt push đỏ ở check `gate`** mà cả ba
đều đo được tại máy trước khi push nếu máy chạy đúng như CI:

| Push | CI đỏ vì | Vì sao máy không thấy trước |
|---|---|---|
| `b3dbe723` | t1-escape: PR chạm engine mà không mang `_acceptance/<slug>/` | PR mở mà chưa chạy `pre-merge-check.sh --base origin/main` |
| `1498b35f` | bằng chứng cũ trên CÂY MERGE (main vừa có mốc 2.11.0) + `tests` đỏ P122/P126/RT13 | chạy lưới trên cây nhánh, không trên cây gộp main; suite plugins không chạy lại sau khi hồ sơ đổi trạng thái |
| `944dce5f` | hồ sơ đã ký bị kéo vào phạm vi diff, pin cũ lộ | bước "không --base" của `gate.yml` thật ra lấy base qua env `PRE_MERGE_BASE`; chạy trần tại máy ra ~62 vi phạm nợ toàn kho nên tín hiệu thật bị chìm; và `cmd | tail` nuốt mã thoát nên push lọt |

Mỗi lượt đỏ tốn một vòng CI, một lần Auto-fix đánh thức phiên, và một lần hồ sơ
phải dựng/ghim lại SAU khi code xong. **Người trả giá:** owner (thời gian
làm-xong→quyết-được của luật (c) kéo dài) và mọi repo tiêu thụ có agent mở PR theo
cùng nếp.

**Trace:** nguyên tố 2 (bằng chứng không tự dối — lưới máy phải chạy trên đúng cây
sẽ được gộp) và đảo-rẻ của nguyên tố 3. **Mở dưới luật nới 07/09/2026** (vế «không
CỘNG» tạm ngưng): ô này CỘNG một bước kiểm trước khi mở PR; phải trả bằng số lượt
CI đỏ giảm, và không được thêm lượt gọi người nào.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Dựng cây gộp nhánh chính tại máy (worktree tạm hoặc `git merge-tree`) rồi chạy `PRE_MERGE_BASE=<base>` cho kết quả trùng CI | Lưới máy xanh mà CI vẫn đỏ — thêm một bước vô ích | Chạy lại đúng ba push đỏ của PR #168 qua bước mới, so với log CI đã lưu | Chưa thử |
| 2 | Chi phí bước mới (lưới ~vài giây; suite trên cây gộp ~10 phút) nhỏ hơn một vòng CI đỏ | Người/agent bỏ qua bước vì chậm | Đo thời gian thật trên kit và một repo tiêu thụ | Chưa thử |
| 3 | Chỗ gắn bước là S5 SHIP của feature-loop (và lối tắt tạo PR của máy) là đủ phủ | PR mở bằng đường khác vẫn lọt | Kê mọi đường tạo PR trong SKILL/commands | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] trong cửa sổ phát hành kế, bao nhiêu PR của kit có lượt push đỏ ở `gate` mà lỗi đo được bằng lưới tại máy trên cây gộp?
- Kết quả nào là SỐNG: [đề xuất] 0 lượt đỏ loại đó trên mọi PR mở sau bản phát hành chứa bước mới; bước chạy mã thoát thật của script (không qua pipe); 0 lượt gọi người thêm
- Kết quả nào là CHẾT: [đề xuất] ≥1 lượt đỏ loại đó mà bước mới đã chạy xanh (bước không trùng CI); hoặc bước làm tăng lượt gọi người
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

- Số lượt push đỏ ở `gate` mỗi PR do lỗi đo-được-tại-máy = 0 (đếm từ lịch sử check của PR).
- Thời gian làm-xong→quyết-được mỗi vòng giảm so với PR #168 (dòng số (c) của mốc).

## Out of scope từ khám phá

- Không đổi `gate.yml` hay luật trong `pre-merge-check.sh` (luật additive-only; lưới đã đúng — cái thiếu là chạy nó sớm, trên đúng cây).
- Không bắt chạy trọn bốn suite trước mọi PR nếu đo được là quá chậm — quyết ở Cổng Đáng theo số của giả định 2.
- Không gộp với ô «gỡ RT13 khỏi việc sửa hồ sơ đã ký» (đề xuất 3 của owner chưa mở) — hai lớp khác nhau.
