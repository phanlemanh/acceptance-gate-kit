---
schema_version: 1
slug: cham-dung-cay-dung-cho-dung
feature: Chấm đúng cây, đúng chỗ đứng — lượt chấm phải tự chứng minh chỗ đứng trước khi verdict được tính
owner: manh@mstar.vn
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Người trả giá là owner (ký lại, chấm lại) và chính máy chấm (vòng đốt không
sinh bằng chứng). Điều tra 29/08 trên ba bộ dữ liệu: repo kit ~28–30/244 vòng
chấm bị đốt vì hạ tầng chấm (50–75% ở 6 hồ sơ tệ nhất); media-library mới nhất
có hồ sơ mà **5 vòng chấm cuối không chứa một khiếm khuyết sản phẩm nào** —
agent đứng nhầm thư mục (mồi nhử cùng tên ở worktree khác), args soạn tay theo
14 gạch đầu dòng văn xuôi, agent chết không để lại dấu vết. Bất đối xứng đã
định vị trong `feature-loop/workflows/acceptance-verify.js`: nhánh baseline
ghim `git -C` (:507) thì đúng, nhánh verifier chỉ *kể* cwd bằng văn xuôi
(:452, :460) thì dính bẫy. Đề bài đầy đủ + bằng chứng:
`docs/findings/2026-08-29-dieu-tra-luat-hoi-tu.md`.

Phạm vi dự kiến (chốt thật ở S1, sau Cổng Đáng): script sinh-args chạy ngoài
workflow (đọc evals.yaml/config.yaml, giải mọi ref, ghim cwd vào từng lệnh,
xuất vật chạy được) · `cd <repoRoot>` cho prompt verifier · mỗi vòng một dòng
máy-đọc-được (vòng · verdict · lớp nguyên nhân · dấu vết chỗ đứng) + đối chiếu
số-kết-quả-mong-đợi để «vắng mặt» thành tín hiệu · phép kiểm «bước carry đã
gọi» · ngăn «không-sửa» vào schema proposal. Mỗi phép đo mới theo đúng luật
kèm-cặp-hai-chiều của kit.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Phần lớn vòng cháy hiện nay đến từ hai hình dạng cwd-mồi-nhử + args-soạn-tay | Vá xong tỷ lệ vòng cháy không giảm — lớp lỗi đổi da | Phép đo 5-vòng-kế đã khai ở Ngưỡng; CHẾT thì leo nấc, không vá thêm hình dạng | Chưa thử |
| 2 | Ghim chỗ đứng làm được ở tầng sinh-args (script node ngoài workflow) mà KHÔNG đổi schema args — repo dùng 2.4.0 không phải migrate | Phải đổi schema → bắt buộc đường đọc-cũ + cờ vàng theo luật tương thích | Đọc contract args `acceptance-verify.js:13-48`, chạy thử script trên một hồ sơ đã đóng | Chưa thử |
| 3 | «Vắng mặt» ghi được thành tín hiệu (đối chiếu số-kết-quả-mong-đợi ở bộ điều phối) | Agent chết vẫn tàng hình, phép đo 5-vòng-kế đếm thiếu mẫu số | Tiêm một lượt agent-chết vào bản sao, xem dòng nguyên nhân có xuất hiện không | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: sau khi ship, lượt chấm còn bị đốt vì máy đứng nhầm
  chỗ hoặc nhận nhầm args không — và khi hạ tầng hỏng, nó có tự xưng tên không?
- Kết quả nào là SỐNG: [đề xuất] trong 5 vòng S4 kế trên repo kit sau khi ship:
  0 lượt hỏng vì hình dạng cwd/args; mọi lượt hỏng hạ tầng (nếu có) đều mang
  nhãn CHƯA-CHẤM-ĐƯỢC kèm một dòng nguyên nhân máy-đọc-được, không đổ thành
  đỏ/xanh sản phẩm.
- Kết quả nào là CHẾT: [đề xuất] ≥2 lượt trong 5 vòng kế vẫn cháy vì lớp
  hạ-tầng-chấm — kể cả hình dạng MỚI của cùng lớp. Khi đó KHÔNG vá thêm hình
  dạng: mở nấc «chấm thế-giới-bất-biến» (hồ sơ riêng, nấc thang đã khai trước
  ở findings §5).
- Timebox: [đề xuất] ship trước 2026-09-15; quá timebox → park, ghi sổ.

## Nguồn ngoài & phạm vi kế thừa

Không có món vật liệu ngoài nào được kế thừa. Bản ad-hoc `s4-*-run.js` mà đề
bài nhắc (scratchpad phiên máy khác) KHÔNG tồn tại trên máy này — script viết
mới từ hợp đồng args, không chép. Bằng chứng media-library là dữ liệu điều
tra (chỉ đọc), không phải vật liệu kế thừa.

## Cổng 0

- **decision = …** Căn cứ: …
- **Ngưỡng chốt cùng lúc ký:** gỡ tiền tố `[đề xuất]` ở section Ngưỡng là chốt.

## Out of scope từ khám phá

- Sổ phát hiện hợp nhất persist (luật 2 đề bài) — hạt giống riêng: va quyết
  định đã ghi «claim-index là VIEW, không persist» (plan 29/07), muốn làm phải
  supersede tử tế; biến thể rẻ đáng xét trước: VIEW từ lịch sử git của
  review-findings.md cho S4 đối chiếu trước phản biện.
- Một-vòng-mở-mỗi-repo (luật 3b đề bài) — hạt giống riêng: điều khoản + nhắc
  ở /start; răng cưỡng chế bị bác vì va nhiều vòng song song hợp lệ.
- Carry-forward mặc định (luật 3a đề bài) — đã có sẵn (`carry-plan.mjs` +
  P1/P2/P3); không làm lại.
- Nới điều kiện đóng vòng «xếp ngăn xong là đóng được» (luật 1 đề bài) — bác:
  đổi luật veto-default đang được hai bộ đọc cưỡng chế giống hệt nhau.
- Nấc 2 (chấm thế-giới-bất-biến) và nấc 3 (bằng chứng gắn (eval, cây)) — chỉ
  mở khi ngưỡng CHẾT kích, không gộp vào ô này.
- Không sửa gì trong repo media-library; không sửa cache plugin.
