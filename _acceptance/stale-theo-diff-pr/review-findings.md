# Review findings — stale-theo-diff-pr (vòng chấm 1, 2026-08-10)

Chân review độc lập (subagent chỉ-đọc, context tươi, không Bash — đánh giá
tĩnh; phần thực-thi do chân verify bù: 12/12 eval chạy thật cùng lượt). Đối
tượng: commit thi công `5479ad0` đọc trong ngữ cảnh trọn file, đối chiếu 6 AC.

## Kết quả: 0 P0 · 0 P1 · 2 P2

Reviewer xác nhận: guard kiểm đúng `DIFF_READY` (không lẫn `$BASE`), bọc đúng
phạm-vi-khối-verified_commit (không lấn re-pin/recheck/run-log — đúng AC-2 vế
"luật khác chạy y như trước"), đối chứng dương đủ ba chiều im lặng
(VC07-fire / VC09 / VC12-touched) + chiều đỏ mutant có xác-nhận-đột-biến;
mirror khớp nguồn tận dòng tại vị trí guard; 0 manifest còn 1.39.1. Truy vết
riêng câu hỏi re-pin-dùng-vc trên sử liệu ngoài diff: hành vi có từ TRƯỚC
1.39.2, sha trong lane và verified_commit được ghi cùng lúc nên "chết cùng
nhau" sau squash — không sinh VIOLATION giả mới.

| # | Sev | Vị trí | Finding | Disposition |
|---|---|---|---|---|
| 1 | P2 | evals.yaml E5 | Mô tả control leg ghi "fixture hỗn hợp VC08" trong khi test dùng fixture VC07 (cũng hỗn hợp, bản sạch) — chữ không khớp vật, không ảnh hưởng cổng (executor test cơ học, không judge nào đọc mô tả để chấm) | **fixed cùng vòng**: sửa mô tả E5 → VC07, ghi rõ xuất xứ review r1; sửa SAU verify (evidence ghim 21553f6) — thay đổi nằm trong _acceptance/ (gate artifact, không stale theo thiết kế), thuần mô tả, không đổi tiêu chí |
| 2 | P2 | pre-merge-check.sh (slug_in_diff ×3/slug) | `slug_in_diff()` được gọi tối đa 3 lần mỗi slug (GP_SCOPE_N, điều kiện gap-probe, guard staleness) — hàm thuần không side-effect, đúng/sai không đổi; chi phí quét DIFF_FILES ×3 chỉ đáng kể trên monorepo diff khổng lồ | **accepted-P2**: ngoài phạm vi hẹp 1-file-engine+test (điều kiện dừng đề bài); ghi nhận cho lần tối ưu sau nếu có báo cáo pre-merge chậm |

## Giới hạn khai của lượt review

Reviewer không có Bash nên không tự chạy suite (đánh giá tĩnh). Bù bằng chân
verify cùng lượt: suite scripts 671/671 (gồm VC07–VC12 + DV5 + TE16c đảo
chiều), hooks 54, plugins (P30/P41/P181 đích danh), workflows 62, version-bump,
mirror --check, product-map --check — tất cả exit 0, run-log 12 dòng ghi
tại-lúc-chạy.
