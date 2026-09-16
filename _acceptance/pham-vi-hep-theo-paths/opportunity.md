---
schema_version: 1
slug: pham-vi-hep-theo-paths
feature: hoá-cũ theo phạm vi hẹp do feature tự khai `paths` — để slug ngoài diff PR thôi xanh lặng khi mã nó phủ vừa đổi
owner: phanlemanh@gmail.com
stage: discovery
---

# Cơ hội: phạm vi hẹp theo `paths` — slug ngoài diff PR thôi xanh lặng

**Mở:** 2026-09-16, từ vòng hợp nhất cổng pre-merge của `oneflow` lên 2.14.0.
Cụm đã chạy thật ở oneflow từ 2026-08-27, có 4 hồ sơ nghiệm thu
(`stale-scope-by-paths` · `staleness-ho-so-thieu-paths` · `gate-scope-anchors`
· `scan-scope-diagnostics`). Đây là **CỘNG** — theo ADR 0018 nó không tự đi,
cần owner phê duyệt đích danh ở Cổng Phạm vi của vòng nhận nó.

## Vấn đề, đo được

`STALE-DIFF-SCOPE-GUARD` của kit bỏ qua **trọn** luật hoá-cũ cho mọi slug không
có file `_acceptance/<slug>/` trong diff PR. Hợp lý khi máy không có cách nào
biết slug đó có bị chạm hay không — nhưng khi feature đã khai `paths`, máy
**biết được**, và kit vẫn im.

Đo trên `oneflow` (44 hồ sơ, 33 khai `paths`), PR sửa **đúng một** file
`sdk/tongflow/engine/fingerprint.py` + chạm một hồ sơ, chạy `--base`:

| bản cổng | bắt hoá-cũ thật |
|---|---|
| kit 2.14.0 thuần | **1** |
| có cụm phạm vi hẹp | **4** |

Ba slug kit bỏ sót — `cache-l2-store`, `cache-l3-tier-b`, `conformance-l0` —
**đều tự khai** `sdk/tongflow/engine/fingerprint.py` trong `evals.yaml`. Bằng
chứng của chúng phủ một file vừa đổi, và cổng nói xanh.

Đột biến xác nhận đúng cụm này làm việc đó, không phải trùng hợp:

```
vô hiệu feature_scope (return 1)      4 → 1   (đúng bằng kit thuần)
gỡ bộ lọc phạm vi trong stale_files   4 → 9   (báo thừa)
PR chỉ chạm tài liệu                  0       (im đúng chiều không-phải-vật)
```

## Trace + người hưởng

**Nguyên tố 2 — bằng chứng không tự dối.** Đây đúng là «máy tin nhầm chính nó»:
màu xanh phát ra từ chỗ luật *chưa từng chạy*, không phải từ chỗ luật chạy và
qua. Không cờ vàng, không NOTE — chỉ một slug vắng mặt khỏi danh sách.

**Người hưởng:** mọi repo tiêu thụ có nhiều hồ sơ trên một cây. Cụ thể hôm nay:
oneflow 33/44 hồ sơ khai `paths`; và §7.1 gọi chi phí ghim-lại là **trần của số
vòng chạy song song** — phạm vi hẹp đánh thẳng vào trần đó, vì nó tách «mã tôi
phủ có đổi không» khỏi «có ai đổi gì đó trong cây không».

## Cụm gồm gì

5 hàm + `stale_files` mở rộng + điểm gọi, **~481 dòng** (`pre-merge-check.sh`
1585 → 2066, **+30 %**). Không có đường dẫn cứng, tên kho, hay giả định bố cục
nào của oneflow — đã quét và xác nhận.

`feature_scope` (210 dòng) là bộ giải **liệt kê trắng**: nó ghi lại sáu vòng vá
liên tiếp, mỗi vòng chặn một *hình dạng sai* của cùng một cấu trúc trong khi một
hình dạng anh em sống sót; bản hiện tại lật ngược — chỉ nhận đúng văn phạm hiểu
được, từ chối phần còn lại **theo cấu trúc**. Mọi ca không đọc sạch được (khai
thiếu, sai khuôn, đường dẫn còn nháy) đều rơi về **toàn-cây**, không rơi về hẹp
hơn.

## Bảng dự báo 5 dòng

| dòng của luật (c) | dự báo | vì sao |
|---|---|---|
| 1. làm-xong→quyết-được | = | không chạm nhịp cổng |
| 2. gọi người/vòng | = | không thêm/bớt cổng người nào |
| 3. vòng bị hạ-tầng đốt lượt chấm | ↓ | hoá-cũ báo thừa là một nguồn đỏ-không-vì-vật; PR một-file ở oneflow: 4 thay vì báo cả cây |
| 4. token máy/vòng | = | không chạm khối S4 |
| 5. phút máy/lượt chấm | ↑ nhẹ | thêm một lượt đọc `evals.yaml` mỗi slug; chưa đo, **phải đo trước khi nhận** |

**Điều kiện tin cậy (ràng buộc, không phải chỉ số):** phạm vi hẹp chỉ được nhận
nếu mọi ngả không-đọc-sạch-được đều rơi về toàn-cây, và điều đó có phép đo
**chiều đỏ** — dựng một khai báo hỏng trong bản sao, cổng phải quay lại toàn-cây
chứ không im. Cụm hiện có `scope_gaps` làm việc đó (đối chiếu khai báo với diff
gated của chính PR), nhưng răng ấy **chưa được kiểm độc lập trong kho kit**.

## Ngưỡng chết / ngưỡng UAT

Máy soạn sẵn câu hỏi phép đo và đã có số nền; hai dòng SỐNG/CHẾT là đánh-đổi
giá trị nên để owner phát ngôn.

- **Câu hỏi phép đo trả lời:** trên một cửa sổ phát hành, cụm này bắt thêm bao
  nhiêu lần hoá-cũ THẬT mà kit thuần bỏ sót, và tốn thêm bao nhiêu phút máy
  mỗi lượt chấm?
- **Số nền đã đo (oneflow, 16/09):** PR một-file → kit thuần bắt 1, có cụm bắt
  4. Phút máy: CHƯA ĐO.
- **Kết quả nào là SỐNG:** …
- **Kết quả nào là CHẾT:** …
- **Timebox:** …

## Chi phí và đường đảo

Chi phí thật: +30 % độ dài tệp cổng, và một bộ giải grep 210 dòng phải nuôi.
Tiền lệ cần đọc trước khi quyết: `.out-of-scope/t1-escape-slug-only-thu-hep-mien-tru.md`
— một vá đúng kỹ thuật, đã ký Cổng 2, vẫn bị bác vì **chi phí**. Bác ca này là
kết cục hợp lệ; nếu bác, hồ sơ chuyển thẳng sang `.out-of-scope/`.

**Đường đảo:** cụm sống độc lập ở `oneflow` nhánh `chore/kit-2-14-0-hop-nhat`
(commit `a282fed`) và trên `origin/main` tới `658b076`. Không nhận thì không mất gì.
