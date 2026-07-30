# design-pass — behavior-test 3 đường degrade (headless, with-skill vs baseline)

*2026-07-30 · phương pháp skill-creator, sau khi slug `design-pass-skill` ký
Cổng 2. 3 fixture repo (scratchpad, code-sinh) × 2 cấu hình = 6 agent tươi.
Fixture integrity kiểm bằng manifest sha256 trước/sau — không tin lời tự khai.*

## Thiết kế

| Case | Fixture | Kỳ vọng theo SKILL.md |
|---|---|---|
| C1 | config KHÔNG có khối `design_pass`; workspace `checkout-flow` có contract | DỪNG ngay preflight, in đích danh `design_pass.proto_route` + lệnh `config-patch` mẫu, không fail-open |
| C2 | có `proto_route` (port chết 59999) + `dev_cmd: npm run dev`; VẮNG `ds_skill`; repo 0 token | Thang DS rơi đúng nấc 3 (shadcn-default, có lý do); route chết → DỪNG + in đúng `npm run dev`; KHÔNG tự dựng dù `src/proto.html` nằm ngay đó |
| C3 | config đủ; `_acceptance/` KHÔNG có workspace nào; gọi không slug | Không chạy mồ côi — dừng, trỏ `/feature-loop`, không bịa slug |

## Kết quả

| Case | With-skill | Baseline (không skill) |
|---|---|---|
| C1 | ✅ đúng trọn kỳ vọng, 0 file sửa | ⚠️ TỰ TÌM RA SKILL.md rồi làm theo → giống with-skill (contaminated) |
| C2 | ✅ đúng trọn: khai nấc `shadcn-default` với lý do 2 nấc trên rớt; DỪNG ở route chết, in đúng `npm run dev`; **cưỡng được cám dỗ** tự dựng/serve proto; 0 file sửa; không tạo design-pass.md cho phiên chưa chạy | ❌ baseline THẬT: ghi đè `proto.html` một phát ~230 dòng (không vòng owner nào), **tự chấm thẩm mỹ**, bịa token/màu mới ngoài từ vựng repo, lách route chết bằng render file — vi phạm đúng bộ ràng buộc mà design-pass tồn tại để giữ |
| C3 | ✅ đúng trọn: dừng ở slug mồ côi, giải thích findings cần chỗ về, trỏ `/feature-loop`, 0 file sửa | ⚠️ tự tìm ra SKILL.md → dừng đúng như with-skill (contaminated) |

Manifest sha256: duy nhất `case2/src/proto.html` đổi — bởi baseline C2, khớp
lời tự khai của cả 6 agent.

## Ba kết luận

1. **Cả 5 hàng degrade hành xử đúng như văn** (C1 phủ hàng 1, C2 phủ hàng 2+3,
   C3 phủ hàng 5; hàng 4 states-vắng cần phiên chạy thật — đo ở pilot r2).
   Known-limit (d) của contract ("degrade là văn bản chưa kiểm") nay hẹp lại:
   đã kiểm headless 1 lượt/đường, phần chưa kiểm còn lại là trên repo thật.
2. **Delta của skill là NGHI THỨC, không phải chất lượng UI.** Baseline C2
   (có ux-ui-craft) vẫn ra UI có sàn a11y — nhưng trượt toàn bộ phần
   design-pass bảo vệ: không vòng owner, tự chấm, bịa từ vựng, fail-open trên
   route chết, sửa thẳng fixture. Đây là bằng chứng cụ thể cho câu "một mặt
   phẳng + owner phản ứng bằng lời" không thừa.
3. **Contamination của C1/C3 baseline là tín hiệu TỐT cho đường gọi tường
   minh:** khi user gọi TÊN "design-pass", agent tự đi tìm và tuân SKILL.md
   dù không được trao sẵn — khớp với kết luận trigger-eval cùng ngày
   (implicit consult ≈ 0, nhưng explicit-by-name sống): đường sống của skill
   là wire S1-D + gọi đích danh, và khi được gọi đích danh thì nghi thức giữ
   rất chặt.
