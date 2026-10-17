---
schema_version: 1
slug: ve-lo-trinh-doc-tin-hieu-cua-cay
feature: Trang lộ trình vẽ ở đâu cũng chỉ lấy ý đã theo dõi trong chính cây đang vẽ — vẽ trong worktree khớp CI, còn các bộ đọc tương tác vẫn thấy mọi ý ở thư mục chính
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build             # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-10-17T11:57:49Z   # chủ kho gõ «duyệt» trên thẻ Cổng Phạm vi mời «duyệt · đáng: build · ngưỡng: nhận» (tiền lệ VA1)
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Gốc: _acceptance/cua-tin-hieu-goc-moi-worktree/ — Known limit Ngoài-4 của RM3b («kho cho git theo dõi chính các tệp ý thì
bộ đọc ở worktree đọc bản ở thư mục chính») thành sự cố thật ở kho tiêu thụ đầu tiên nhận 2.32.0: Mac Studio báo
crm-onehub#375 (17/10, 09:30Z) khi nhận kit 2.32.0 ở PR crm #463 — bước Product map `--check` của CI ĐỎ «lệch» hai lần.

**Ai đau:** người nhận kit ở crm (và mọi máy vẽ trang lộ trình trong worktree — cả ba máy đều chạy phiên trong worktree).
2.32.0 cho bộ vẽ trang lộ trình đọc thư mục tín hiệu ở THƯ MỤC CHÍNH của kho (theo RM3b), trong khi trang được COMMIT
và CI vẽ lại từ cây đang kiểm. Ở crm thư mục chính lùi nền, thiếu 6 tín hiệu của #452 → trang vẽ trong worktree khác
trang CI vẽ. Lách tạm: vẽ trong một bản `git clone --no-hardlinks` độc lập — đắt, dễ quên, và chặn mọi lần nhận kit.

## Hôm nay ai gặp gì (tái hiện trên v2.32.0)

Kịch bản `repro/tai-hien.sh`, đầu ra nguyên văn `repro/dau-ra-v2.32.0.txt`: kho thử khai lộ trình + cửa tín hiệu, thư
mục chính lùi ở commit có một ý và giữ một ý chưa theo dõi; worktree `--detach` sạch ở commit có thêm hai ý.
- Vẽ trong worktree bằng 2.32.0 → trang chứa `kho-1` và `nguoi-x-1` (của thư mục chính), thiếu `kho-2`, `kho-3`.
- Commit trang, tải sạch như CI, `product-map --check` → thoát 1 «LO-TRINH.html lệch với tệp ý định và hồ sơ».
- Cùng kịch bản bằng 2.31.0 → thoát 0 «khớp».

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: sau khi crm cài bản chứa vòng này, trang lộ trình vẽ trong worktree có khớp CI không?
- SỐNG: PR nhận bản vá ở crm có bước Product map `--check` xanh trên CI với trang vẽ trong worktree (không qua bản tải
  độc lập), và trong 14 ngày sau đó 0 lượt CI crm đỏ «LO-TRINH.html lệch» mà nguyên nhân là tín hiệu.
- Chiều đỏ của chính ngưỡng: N = số commit chạm `LO-TRINH.html` ở crm trong cửa sổ ấy. N = 0 → «chưa đọc được», không
  được đọc thành «đạt».
- CHẾT: ≥ 1 lượt CI đỏ «lệch» mà trang vẽ trong worktree khác trang CI ở phần tín hiệu.
- Mốc nền: v2.32.0, 2/2 lượt CI đỏ ở PR crm #463 (crm-onehub#375).
- Timebox: 2026-10-31 (14 ngày sau mốc vá). Không lần nhận nào trước hạn → «chưa đọc được».
