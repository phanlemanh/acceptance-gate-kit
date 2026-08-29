# Review Findings: nhanh-chinh-khong-ten-main (round 3)

## Trong hợp đồng

- **Fallback dò tên nhánh chính chạy cả khi remote ĐÃ khai tên — mốc so sánh sai lặng lẽ thay vì kêu to**
  file: `feature-loop/scripts/s4-args.mjs:231`
  severity: medium
  AC: AC-7
  source: bugs

  Khối dò remote (dòng 218-230) chỉ nhận `m[1]` khi `<tên>` hoặc `origin/<tên>` giải được. Khi cả hai vắng, vòng fallback ở dòng 231-235 chạy VÔ ĐIỀU KIỆN và nhận bất kỳ tên nào trong MAIN_BRANCH_CANDIDATES giải được — kể cả khi remote đã khai dứt khoát một tên KHÁC. Kết quả là `diffBase` lấy từ một nhánh không liên quan, exit 0, không cảnh báo.

  Đã tái lập: bare repo HEAD=main; clone có `feat/x` và một nhánh `master` cũ, đã xoá `refs/heads/main` lẫn `refs/remotes/origin/main`. `git remote show origin` in `HEAD branch: main`, nhưng script in `s4-args: nhánh chính «master» giải bằng fallback`, sinh args với `mainBranchInfo={"branch":"master","source":"fallback"}` và `diffBase` = `git merge-base master HEAD` — exit 0.

  Đây là HỒI QUY so với bản trước diff: mã cũ gán thẳng `mainBranch = m[1]` nên `git('merge-base', 'main', 'HEAD')` chết ở cửa fail-closed với «lệnh git thất bại» (exit 2). Nay lỗi đó bị nuốt và thay bằng một câu trả lời sai.

  Hệ quả không nhỏ: `diffBase` là mốc cho làn review (`git diff diffBase...HEAD`), scope-triage, coverage và worktree baseline — mốc sai làm cả một lượt S4 chấm trên diff sai mà vẫn báo xanh.

  AC-7 ô 1 không bắt được vì fixture của nó (clone `--single-branch`) không có tên quen nào tồn tại; chỉ cần một nhánh `main/master/develop/trunk` sót lại là câu-có-hướng-dẫn không bao giờ nổ. Lối sửa hợp với nếp «đảo chiều mặc định»: remote đã khai tên mà không ref nào giải được thì die kèm tên đó, đừng rơi xuống fallback.

  rationale: AC-7 ô 1 đòi hỏi khi không ref nào của nhánh chính giải được (cả <tên> lẫn origin/<tên>) thì phải trả câu CÓ HƯỚNG DẪN; kịch bản tái lập cho thấy trong đúng tình huống đó script lại lặng lẽ dùng một nhánh dự phòng không liên quan và exit 0, tức vi phạm trực tiếp AC-7.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **evidence-report.md vẫn chấm PASS cho E4/E5 với verifier ref đã CHẾT (config key không giải được)**
  Người dùng thấy gì: Báo cáo bằng chứng vẫn ghi 'Đạt' cho hai tiêu chí đã bị bỏ khỏi phạm vi, đo bằng công cụ không còn tồn tại — người duyệt cổng có thể ký duyệt dựa trên thông tin không còn đúng.
  file: `_acceptance/nhanh-chinh-khong-ten-main/evidence-report.md`
  severity: high
  Đề xuất: new-contract

- **Marker PROBE-REGION khai «phép đo neo vào chính hai marker này» nhưng không phép đo nào còn đọc nó**
  Người dùng thấy gì: Tài liệu hứa có một lớp kiểm tra tự động cho một quy tắc nội bộ, nhưng lớp kiểm tra đó chưa từng được dựng — người đọc tài liệu sau này có thể tưởng nhầm là đã có bảo vệ.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: medium
  Đề xuất: known-limits

- **s4-args.mjs sửa hành vi nhưng KHÔNG có lưới hồi quy thường trực nào**
  Người dùng thấy gì: Thay đổi hành vi lần này không có bộ kiểm tra tự động chạy lâu dài đi kèm — nếu sau này ai đó vô tình làm hỏng lại tính năng, sẽ không có cảnh báo tự động nào bật lên để bắt kịp.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: new-contract

- **Cửa stale của pre-merge-check loại trọn _acceptance/* nên không thấy bộ răng đã bị viết lại sau khi verify**
  Người dùng thấy gì: Cơ chế phát hiện 'bằng chứng đã cũ' trước khi gộp mã không nhận ra khi bộ kiểm tra của tính năng này bị sửa lại sau khi đã ký duyệt — bằng chứng có thể đứng tên một phép kiểm tra không còn đúng như lúc ký.
  file: `_acceptance/nhanh-chinh-khong-ten-main/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **snapshot_tree chép trọn cây làm việc kể cả rác không theo dõi (~45MB .claude/worktrees) mỗi lần gọi**
  Người dùng thấy gì: Quy trình kiểm tra nội bộ sao chép cả những tệp rác không cần thiết mỗi lần chạy, làm chậm và tốn dung lượng hơn mức cần — không ảnh hưởng tới người dùng cuối, chỉ ảnh hưởng tốc độ kiểm tra.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: low
  Đề xuất: wont-fix

- **E1 ghim hằng đếm `-eq 4` cho danh sách tên nhánh dự phòng**
  Người dùng thấy gì: Một phép kiểm tra nội bộ đếm cứng số lượng tên nhánh dự phòng; nếu sau này thêm một tên hợp lệ mới, phép kiểm tra này có thể báo lỗi dù tính năng vẫn hoạt động đúng.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: low
  Đề xuất: wont-fix

- **mainBranchInfo và dòng khai trên stderr nói «null / none» khi chạy với --diff-base**
  Người dùng thấy gì: Khi người dùng tự chỉ định nhánh so sánh bằng cờ có sẵn, thông tin ghi lại về 'nhánh chính được xác định thế nào' hiển thị sai là 'không xác định được' dù nhánh so sánh vẫn đúng — chỉ gây khó hiểu khi đọc nhật ký, không ảnh hưởng tới kết quả.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **Lệnh tiêm đột biến python3 không kiểm mã thoát — assert «mutant khong tac dung» bị nuốt, chiều đỏ báo sai nguyên nhân**
  Người dùng thấy gì: Một bước kiểm tra nội bộ khi báo lỗi có thể chỉ sai nguyên nhân gây lỗi trong thông điệp chẩn đoán — không làm sai kết quả cuối cùng, chỉ gây khó khăn hơn khi người kiểm tra sau này cần tìm đúng chỗ hỏng.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 — ghim thông điệp KHÔNG phải thông điệp mong đợi: needle tự-rút + cut -c1-40 cắt mất đúng vế «hướng dẫn» mà AC-2 hứa**
  Người dùng thấy gì: Cách phép kiểm tra tự động xác nhận thông điệp hướng dẫn cho người dùng có lỗ hổng: nếu sau này ai đó vô tình làm thông điệp mất phần hướng dẫn quan trọng (cách khắc phục khi gặp lỗi), phép kiểm tra vẫn báo đạt như bình thường.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: high
  Đề xuất: new-contract

- **Hình dạng 4 — AC-3 hứa «thông điệp nêu tên phần hỏng» nhưng assert chỉ ghim tiền tố «lệnh git thất bại»**
  Người dùng thấy gì: Phép kiểm tra tự động cho trường hợp lỗi nghiêm trọng chỉ xác nhận có thông báo lỗi chung chung, không xác nhận thông báo có nêu rõ phần nào bị hỏng — nếu chi tiết đó bị mất sau này, phép kiểm tra vẫn báo đạt.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 5 — AC-6 tuyên hai bề mặt đầu ra, phép đo chỉ chạm một: dòng khai nguồn trên stderr không có assert nào**
  Người dùng thấy gì: Một phần thông tin chẩn đoán mà tính năng hứa sẽ ghi ra (dòng nhật ký giải thích nguồn xác định nhánh) chưa từng được phép kiểm tra tự động xác nhận là thực sự tồn tại.
  file: `_acceptance/nhanh-chinh-khong-ten-main/rang.sh`
  severity: medium
  Đề xuất: new-contract

⚠ Cụm ngoài vùng phủ: 3/12 lỗi rơi vào file không bộ đo nào phủ (_acceptance/nhanh-chinh-khong-ten-main/evidence-report.md, _acceptance/config.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
