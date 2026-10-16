---
schema_version: 1
slug: cua-tin-hieu-goc-moi-worktree
feature: Ý gửi vào cửa tín hiệu từ bất kỳ worktree nào đều nằm ở thư mục chính của kho — mọi bộ đọc ở mọi worktree thấy cùng một tập, và dọn worktree không làm mất ý
owner: phanlemanh@gmail.com
stage: decided               # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-16T08:03:46Z   # chủ kho gõ «đáng: build · ngưỡng: nhận» ở Cổng Đáng 16/10
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: RM3b
lo_trinh_tep: docs/plans/lo-trinh-kit.json
---

## Vấn đề & ai gặp

Mở từ hàng RM3b của «Lộ trình kit nghiệm thu — từ 2.24.0» (`docs/plans/lo-trinh-kit.json`).
Mốc: Gói road-map hoàn tất theo B′ — ngày tính từ ước 32–40 giờ máy (RM2 8–10 · RM4 5–6 · RM5 6–7 · RM3 6–8 + M5 · RM6 5–6 · cắt bản 1,5–2); chủ kho gọi tên làm luôn 15/10 — 19/10/2026.

Ý gửi vào cửa tín hiệu từ bất kỳ worktree nào đều nằm ở thư mục chính của kho — mọi bộ đọc ở mọi worktree thấy cùng một tập, và dọn worktree không làm mất ý

Vì sao: Gốc: _acceptance/cua-tin-hieu-giua-chien-dich/ — lỗi tái hiện trên main 66951212 (kịch bản + đầu ra ở _acceptance/cua-tin-hieu-goc-moi-worktree/repro/): /road-map:gui từ worktree ghi vào worktree, thợ qua đợt ghi vào thư mục chính, hai bộ đọc thấy hai tập rời nhau, dọn worktree ép làm mất ý. Chủ kho gõ «mở RM3b» 16/10 ở phiên điều phối.

## Hôm nay ai gặp gì (tái hiện trên main 66951212)

Kịch bản `repro/tai-hien.sh`, đầu ra nguyên văn `repro/dau-ra-66951212.txt` (kho thử có một worktree):
- Chủ kho gửi ý bằng `/road-map:gui` từ worktree → lệnh trả «đã ghi», nhưng tệp nằm ở `tin-hieu/` CỦA WORKTREE; bộ đọc
  chạy ở thư mục chính thấy `[]`.
- Thợ nêu việc phụ qua đợt → tệp nằm ở thư mục chính (gốc kho của đợt). Bộ đọc trong worktree không thấy nó.
- Hai bộ đọc thấy hai tập RỜI nhau; gom ở đâu cũng sót.
- `git worktree remove` thường từ chối (tệp chưa theo dõi), `--force` thì xoá — ý của chủ kho MẤT HẲN, không báo.

Trái câu giao RM3 «mọi ý có chỗ». Kho tiêu thụ chạy phiên trong worktree là chuyện thường (crm, kit), nên lỗi chạm
mọi lần gửi ý từ phiên thợ.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: sau khi kho có worktree cài bản chứa vòng này, ý gửi từ worktree có nằm ở thư mục chính, được
  mọi bộ đọc thấy, và còn sau khi worktree bị dọn không?
- Kết quả nào là SỐNG: trong 14 ngày sau khi crm (hay kit) cài bản chứa vòng này: 0 tệp ý nằm trong thư mục nguồn của
  BẤT KỲ worktree nào (đọc bằng `git worktree list` rồi đếm `<worktree>/<nguồn>/*.json`), và mọi tệp `nguoi-*.json`
  có ở thư mục chính đều hiện trong `tin-hieu.mjs --chua-gom` chạy từ một worktree bất kỳ.
- Chiều đỏ của chính ngưỡng: N = số ý gửi bằng `/road-map:gui` trong cửa sổ ấy. N = 0 thì ngưỡng CHƯA ĐỌC ĐƯỢC —
  không được đọc thành «đạt».
- Kết quả nào là CHẾT: ≥ 1 tệp ý nằm trong thư mục nguồn của một worktree, hoặc ≥ 1 ý ở thư mục chính mà bộ đọc trong
  worktree không thấy.
- Mốc nền: trên main 66951212, 1/1 ý gửi từ worktree nằm sai chỗ và mất khi dọn ép (`repro/dau-ra-66951212.txt`).
- Timebox: 2026-11-02 (14 ngày sau mốc 19/10). Không kho nào cài trước hạn → «chưa đọc được».
