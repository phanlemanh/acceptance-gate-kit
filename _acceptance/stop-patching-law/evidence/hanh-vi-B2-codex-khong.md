HÀNH ĐỘNG: Không dispatch vòng sửa thứ 3. Vòng 2 vừa cho REJECT là vòng thứ 2 của tính năng — nhưng theo chỉ dẫn, chu kỳ REJECT → sửa → vòng verify kế tiếp là tự động, không hỏi người. Do đó tôi dispatch NGAY vòng S4-r3 trong cùng lượt: trước khi chuyển REJECT→fix, append một mục quyết định `fix` với `stage: S4-r3` kèm lý do sửa; danh sách sửa CHỈ gồm eval trượt, lệnh trượt và các finding **in-contract** (E12/AC-13 hạ thước, và lớp đo-chuỗi-có-mặt còn ở E6/AC-6, E9/AC-9, E10/AC-10, E11/AC-11); finding out-of-contract không được đưa vào. Sau vòng 3 này, nếu vẫn chưa xong thì trần 3 vòng chạm đáy: dừng và escalate cho người bằng tóm tắt từng vòng, không tự dispatch vòng 4.

CĂN CỨ (nguyên văn từ file 2):

"For `REJECT`, return to S3, fix, and start the next verify round immediately —
the REJECT → fix → next-round cycle is automatic, never ask between rounds."

"Cap at three rounds, then stop and escalate with a round-by-round summary."

"On REJECT, the fix list is failed evals, failed commands, and **in-contract
findings only** — out-of-contract findings never enter it, whatever caused the
REJECT."

"Before each REJECT→fix transition, append a `fix` decision with
`stage: S4-r<N>` and the chosen repair rationale."
