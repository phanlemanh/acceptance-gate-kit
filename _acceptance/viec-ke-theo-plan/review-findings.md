# Review findings: viec-ke-theo-plan (round 4)

## Trong hợp đồng

- **LT-16-thu-tu checks the wrong mention, so the order check passes no matter where the block sits in 3 of 4 bodies**
  file: tests/scripts/lo-trinh.test.mjs:651
  severity: medium
  AC: AC-16
  source: conventions
  detail: `thuTu` uses `txt.indexOf(moc)`, which finds the FIRST mention of the field name in the file, not the step that writes it. In three bodies that first mention is in the preamble: approve.md line 34 is the one-shot grammar (`approved_by`), while the write is in step 5 around line 97. signoff.md line 16 is the argument description (`human_signoff`). uat-session SKILL.md line 59 is `verdict` 'để TRỐNG'. The MAP-STAGE block can therefore be placed anywhere after those preamble lines, for example in approve step 2, before any gate field is written, and LT-16-thu-tu still passes. The only red case it tests is moving the block above line 1, which every placement except the very top already avoids. E16 claims «khối đứng sau mốc ghi trường của cổng», but this check does not measure that (CLAUDE.md «Thước phải gắn vào vật» rule: it measures the instruction text, not the write step). observed.md is the only body whose anchor (line 40, step 3) is the real write step. Fix: anchor each body to its write step (for example the `5. **On an explicit YES only:**` heading in approve, step 7a in signoff, the 'Người ký điền `verdict`' line in uat-session). Then add a red copy that moves the block to just after the preamble, not to the top of the file.
  rationale: AC-16 ghi rõ «mỗi khối đứng SAU chỗ thân đó ghi trường của cổng»; phép đo neo vào lần nhắc đầu của tên trường nên vế này không được chứng ở 3/4 thân.

- **LT-16-thu-tu ordering check passes even when the block is placed before the gate writes its fields (approve, signoff, uat-session)**
  file: tests/scripts/lo-trinh.test.mjs:651
  severity: medium
  AC: AC-16
  source: bugs
  detail: `thuTu` uses `txt.indexOf(moc)`, which finds the FIRST mention of the field name. That is not where the gate writes the field. In signoff.md the first `human_signoff` is on line 16, in the frontmatter/intro; the field is actually written in steps 4 and 7a. In approve.md the first `approved_by` is on line 34, in the argument grammar; it is written at step 5, line 103. In uat-session/SKILL.md the first `verdict` is on line 59 («`verdict` để TRỐNG», when the session is scheduled); it is written on line 98. Reproduced on copies: I moved the MAP-STAGE block into approve step 2 (line 81), signoff step 2 (line 121) and just before «Người ký điền `verdict`» in uat-session (line 98). `thuTu` returned null (pass) for all three, even though the map is then redrawn and staged BEFORE the gate's fields are written. The only failing case the check covers is moving the block to the very top of the file. So E16's claim that each block «đứng sau mốc ghi trường của cổng» is effectively only measured for observed.md, whose anchor `status: da-cham-boi-thuc-te` is the actual write step. Fix: anchor on the write instruction of each body (for example, the `status: approved` edit in step 5 of approve, step 7a of signoff, «Người ký điền `verdict`» in uat-session). Also add a failing case that moves the block to a point just before that write, not to the top of the file.
  rationale: Cùng vế thứ tự của AC-16: phép đo không phân biệt «sau lần nhắc» với «sau bước ghi», dời khối trước bước ghi vẫn xanh.

- **Hình dạng 3 (assert «chuỗi có mặt» thay cho QUAN HỆ): LT-16-thu-tu đo «khối đứng sau chỗ ghi trường» bằng lần NHẮC ĐẦU TIÊN của tên trường**
  file: tests/scripts/lo-trinh.test.mjs:672
  severity: medium
  AC: AC-16
  source: measurement
  detail: `thuTu` lấy `txt.indexOf(moc)` (lần xuất hiện đầu tiên của `approved_by` / `human_signoff` / `verdict`) rồi chỉ đòi `j >= i`. Lời hứa trong E16 là một quan hệ: khối MAP-STAGE đứng SAU bước cổng GHI trường đó. Nhưng lần nhắc đầu của tên trường thường không phải bước ghi: commands/approve.md:34 nhắc `approved_by` trong phần mô tả đối số, còn bước ghi nằm ở dòng 97–110. commands/signoff.md:16 nhắc `human_signoff` trong phần mô tả, còn bước ghi ở dòng 128–137. skills/uat-session/SKILL.md:59 là bước lên lịch, nơi `verdict` còn để TRỐNG; người ký chỉ điền `verdict` ở dòng 98. Vì vậy dời khối tới bất kỳ chỗ nào sau dòng 34 của approve.md, tức vẫn TRƯỚC bước ghi, thì phép đo vẫn xanh. Chiều đỏ duy nhất là bản sao signoff dời khối lên đầu tệp (`m + '\n' + sg.replace(m,'')`). Ca này đứng trước mọi lần nhắc tên trường, nên nó không phân biệt «sau lần nhắc» với «sau bước ghi». Bảng THAN ghim chuỗi tên trường thay vì một mốc gắn với bước ghi.
  rationale: Trùng gốc với hai finding trên: vế «đứng SAU chỗ ghi trường của cổng» của AC-16 chỉ được đo bằng chuỗi có mặt, chiều đỏ duy nhất là dời lên đầu tệp.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **MAP-STAGE block uses $AG but never sets it; the test supplies AG and hides this**
  Người dùng thấy gì: Khi phiên đóng cổng chạy đúng nguyên văn bước vẽ lại bản đồ, nếu chưa biết sẵn chỗ cài bộ công cụ thì bước này báo lỗi và bản đồ không được đưa vào commit; phiên phải tự sửa tay lệnh, đúng chỗ dễ trôi mà khối dùng chung muốn tránh.
  file: `commands/approve.md`
  severity: medium
  Đề xuất: new-contract

- **MAP-STAGE block uses $AG, which none of the four gate bodies sets; run as written it fails, and LT-16 only passes because it sets AG itself**
  Người dùng thấy gì: Bước vẽ lại bản đồ ở bốn lệnh đóng cổng chỉ chạy được nếu phiên đã biết sẵn chỗ cài bộ công cụ; nếu không, nó dừng với lỗi to rõ và bản đồ không được đưa vào commit cho tới khi phiên sửa tay.
  file: `commands/approve.md`
  severity: medium
  Đề xuất: new-contract

- **kiemKhuon flags dung_tren and moc[].hang of the wrong type, but silently drops a wrong-typed moc, da_bac, non-object milestones and badly formatted dates**
  Người dùng thấy gì: Nếu kho khai mốc hoặc mục đã bác theo hình dạng khác dự kiến, hoặc gõ ngày sai khuôn, thẻ vẫn in «Hàng trễ: không có» và trang bỏ mốc đó mà không báo gì, nên người đọc tưởng không có gì trễ.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: new-contract

- **Hình dạng 1 (đo CHỈ DẪN thay vì ĐẦU RA): LT-18-luat grep ba cụm chữ của SKILL, còn bộ chạy «theo luật SKILL» là luật viết tay trong test**
  Người dùng thấy gì: Hướng dẫn cho phiên khi nhận một đối số có thể bị viết lại sang nghĩa ngược mà vẫn giữ nguyên vài cụm chữ cũ, và kiểm tra vẫn báo xanh; người đọc chỉ thấy khi phiên làm sai thật.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay khớp đúng thứ ca khẳng định): cờ lệch «crm OKR thật» ở hàng 7n là do người viết fixture tự gán (r3)**
  Người dùng thấy gì: Chỗ lệch giữa lời khai và hồ sơ ở hàng 7n trên trang mẫu do người viết mẫu tự đặt, chưa phải một chỗ lệch có thật đo được ở kho crm. Nhãn «thật» của ví dụ này chỉ đúng một phần.
  file: `tests/scripts/fixtures/lo-trinh/crm-okr.json`
  severity: low
  Đề xuất: known-limits

- **P99 mutant copy extends a hand-written file list instead of copying whole directories (r1)**
  Người dùng thấy gì: Một phép thử cũ của kit có thể báo đỏ nhầm khi sau này thêm một script mới, dù tính năng không hỏng. Người dùng cuối không bị ảnh hưởng, chỉ người bảo trì mất công tìm nguyên nhân.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): ô hồ sơ của «crm OKR thật» do tay khai trong `_nguon.ho_so`, cờ lệch ở hàng 7n do chính fixture dựng ra (r1)**
  Người dùng thấy gì: Dữ liệu mẫu mô phỏng lộ trình thật của kho crm được dựng tay, nên việc trang đọc đúng trên mẫu chưa chứng minh đọc đúng trên lộ trình thật. Chỉ khi kho thật chuyển sang tệp mới biết chắc.
  file: `tests/scripts/fixtures/lo-trinh/crm-okr.json`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
