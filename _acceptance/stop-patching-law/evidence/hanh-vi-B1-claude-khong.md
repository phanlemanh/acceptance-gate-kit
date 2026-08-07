HÀNH ĐỘNG: Dừng vòng lặp máy, escalate cho user. Vòng 2 vừa REJECT là round thứ... — không, chưa chạm cap 3 round. Để tôi trả lời đúng.

HÀNH ĐỘNG: Không dừng hỏi người. Ngay trong cùng lượt: quay lại S3 để fix theo `failedEvals` + `failedCommands` + `rejectFindings` (findings TRONG hợp đồng), tuyệt đối không sửa các mục `inContract: false`; sửa theo LỚP như biên bản vòng 2 ghi (lớp "đo chuỗi-có-mặt/tổng-gộp/chỉ-dẫn thay vì quan hệ" còn nguyên ở E6/AC-6, E9/AC-9, E10/AC-10, E11/AC-11; và lớp hạ-thước ngưỡng `<= 25` ở E12 phải thay bằng quan hệ đỏ-khi-có-cụm-mồ-côi + đối chứng dương). Trước khi rời S3-fix, append 1 entry `fix` vào `_acceptance/stop-patching-law/decisions.jsonl` với `stage:"S4-r3"`. Rồi dispatch S4 round 3 NGAY (round = 2 + 1), không hỏi giữa chừng. Round 3 là round cuối trong cap — nếu nó lại REJECT thì mới DỪNG và escalate.

CĂN CỨ (nguyên văn từ file 2):

> `REJECT` → quay S3 fix `failedEvals` + `failedCommands` + **`rejectFindings`** (findings TRONG hợp đồng — máy chỉ sửa cái contract đã bao). **`triaged` có mục `inContract: false` → TUYỆT ĐỐI KHÔNG sửa trong round này**: đó là lỗi thật nhưng ngoài phạm vi đã duyệt, nó đi Gate 2 cho người quyết. Sửa nó ở đây chính là vòng xoáy mà scope-triage sinh ra để chặn — mỗi bản vá trong vùng-không-đặc-tả lại đẻ ra lựa chọn không-đặc-tả mới. Fix xong → dispatch S4 round mới (round + 1) NGAY, không hỏi giữa chừng — vòng REJECT→fix→round kế là TỰ ĐỘNG.

> Trước khi rời S3-fix: append entry `fix` (`stage:"S4-r<N>"`).

> **Tối đa 3 round** — quá → DỪNG, escalate user kèm phân tích từng round.
