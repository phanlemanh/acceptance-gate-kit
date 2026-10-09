## Trong hợp đồng

- **Auto-revert deletes the user's pre-existing uncommitted work when a grader's commit swept it in**
  file: `feature-loop/scripts/lib/ghi-boi.mjs:188`
  severity: high
  AC: AC-6
  source: bugs
  detail: `hoanLai` runs `git reset --keep <sha>`, which drops EVERY commit in sha..HEAD. Files those commits added are removed from disk, and files they changed go back to their sha version. The only guard for work that existed before the round is `banSan` (line 181). It checks `cay.ban`, and `chupCay` fills that only with TRACKED, DIRTY files inside the in-scope area. Three cases get no check:
  (a) files that were untracked before the round (`cay.chuaTheoDoi` is never consulted);
  (b) dirty or untracked files outside the in-scope area, which are not in `tep` at all;
  (c) commits whose contents go beyond the files assigned to a grader.
  Reproduced with the real module: repo at sha, then an untracked `notes-chua-commit.md` the user had not committed, then a grader runs `git add -A && git commit -m wip` that also touches tracked `a.txt`. `quyTrachNhiem` assigns `a.txt` to the grader through its `git commit`, so `tep_khong_ro` is empty. `hoanLai` returns `{hoan_lai:true}` and `notes-chua-commit.md` is gone from the working tree; it survives only in the dropped commit in the reflog. The same happens to an uncommitted edit to a tracked record or doc file outside the in-scope area that a `git commit -am` picks up. This breaks the stated invariant (comment at L183-185): never overwrite uncommitted changes, always leave them to the session. The log line says nothing about the lost files. Fix: refuse the revert when sha..HEAD touches any path outside the assigned `tep`, or any path in `cay.chuaTheoDoi`. Equivalently, compare `git diff --name-only sha HEAD` (unfiltered) against the set of assigned files plus the pre-round snapshot.
  rationale: AC-6 nêu 'không bao giờ ghi đè tệp chưa commit' và hàng 'tệp bẩn sẵn trước lượt'; tệp chưa theo dõi hay ngoài vùng bị cuốn vào commit của tác tử vẫn bị xoá khỏi cây làm việc, phản ví dụ trực tiếp.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **AT3 pins every lane's prompts, run-log and opts to v2.26.0 in the standing suite, against the repo's own lesson**
  Người dùng thấy gì: Lần sau khi ai đó đổi lời dặn của bộ chấm cho đúng, bài kiểm tra này sẽ báo đỏ oan và phải nâng mốc so sánh bằng tay; lượt chấm thật không bị ảnh hưởng.
  file: `tests/workflows/tac-tu-cham-hep.test.mjs`
  severity: medium
  Đề xuất: known-limits
- **The automatic undo resets every commit since the graded sha, but the safety checks and the run-log only cover tracked-zone files**
  Người dùng thấy gì: Nếu trong lúc chấm, phiên chính có lưu thêm một lần vào hồ sơ của vòng, bước tự hoàn lại có thể lặng lẽ bỏ mất lần lưu đó khỏi nhánh mà không báo ở đâu; chỉ lôi lại được bằng cách đào lịch sử git.
  file: `feature-loop/scripts/lib/ghi-boi.mjs`
  severity: medium
  Đề xuất: new-contract
- **--transcript accepts an empty or wrong directory and logs 'no grader wrote this' instead of 'could not read transcript'**
  Người dùng thấy gì: Nếu phiên truyền nhầm thư mục ghi lại cuộc chấm, hệ thống ghi như thể không tác tử nào sửa gì thay vì báo chưa đọc được; con số lượt không đọc được vì thế có thể thấp hơn thực tế.
  file: `feature-loop/scripts/thuoc-vat.mjs`
  severity: medium
  Đề xuất: known-limits
- **SKILL and the ghi-boi.mjs header still describe four undo conditions; the code now also requires everything to be committed**
  Người dùng thấy gì: Hướng dẫn cho phiên Claude Code còn nói bốn điều kiện để tự hoàn lại trong khi thực tế có thêm điều kiện thứ năm, nên người đọc có thể hiểu sai vì sao máy đôi khi không tự hoàn lại.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: low
  Đề xuất: known-limits
- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc: đề bài tác tử ở hàng tự-tìm (AT5 hàng 6, 10) được gõ tay để khớp đúng bộ lọc của timTranscript**
  Người dùng thấy gì: Chức năng tự tìm bản ghi cuộc chấm khi không chỉ định chưa từng được thử với đề bài thật; nếu đề bài thật không còn mang tên vòng ở đầu thì máy có thể không tìm thấy gì mà bài kiểm tra vẫn xanh.
  file: `tests/scripts/ghi-boi-tac-tu-cham.test.mjs`
  severity: medium
  Đề xuất: known-limits
- **Hình dạng 3 — chỉ kiểm chuỗi có mặt trong khi lời hứa là QUAN HỆ: chưa ca nào ghép agentType của bảng vai với định nghĩa tác tử thật**
  Người dùng thấy gì: Nếu ai đó đổi tên gói hoặc tên loại tác tử ở một chỗ mà quên chỗ kia, các bài kiểm tra vẫn xanh nhưng lúc chạy thật các tác tử chấm lặng lẽ quay về loại mặc định có quyền sửa tệp.
  file: `tests/workflows/tac-tu-cham-hep.test.mjs`
  severity: medium
  Đề xuất: known-limits
- **Hình dạng 3 — lời hứa ghép cặp theo round + luot_ts nhưng kiemChung chỉ kiểm vị trí kề nhau và tập khoá**
  Người dùng thấy gì: Hai dòng ghi của cùng một lượt chấm chỉ được kiểm là nằm cạnh nhau, không kiểm cùng số lượt và thời điểm; nếu ghi lệch, bộ đếm ở phiên nghiệm thu có thể không ghép được cặp nào mà bài kiểm tra vẫn xanh.
  file: `tests/scripts/ghi-boi-tac-tu-cham.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
