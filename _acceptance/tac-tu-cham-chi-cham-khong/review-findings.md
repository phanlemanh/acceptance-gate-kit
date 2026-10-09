# Review findings: tac-tu-cham-chi-cham-khong

## Trong hợp đồng

- **LOAI-VANG-LINE template block is never read by a test, unlike GHI-BOI-LINE**
  AC: AC-4
  file: `feature-loop/workflows/acceptance-verify.js:571`
  severity: low
  source: conventions
  detail: The kit convention is that a log-line template lives in one marker block and a test reads the template from that block and compares it with what the writer produces. GHI-BOI-LINE follows this (`khoaKhuon()` in ghi-boi-tac-tu-cham.test.mjs). LOAI-VANG-LINE does not: no test or script reads that block. AT4 only spot-checks `vai`, `ts`, `round` and `ly_do` on the emitted object, yet eval E4's expected text claims the line follows the LOAI-VANG-LINE template. The block and `ghiLoaiVang` can drift apart, for example a key added to or renamed in only one of them, with every test still green. Suggested fix: in AT4, pull the keys out of the marker block the same way khoaKhuon does and compare them with the keys of the emitted line.
  rationale: AC-4 đòi dòng log đi theo khuôn marker LOAI-VANG-LINE nhưng không test nào đối chiếu khuôn với dòng thật, nên vế này chưa được chứng minh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Write-command detection over-matches read-only commands, so the auto-revert can discard edits it doesn't own**
  Người dùng thấy gì: Khi tác tử chấm chỉ sao chép hoặc xem một tệp, máy có thể nhầm là tác tử đã sửa nó. Nếu lúc đó chính bạn đang sửa tệp ấy trong phiên, máy tự hoàn lại và mất phần bạn vừa sửa, không lấy lại được.
  file: `feature-loop/scripts/lib/ghi-boi.mjs`
  severity: medium
  Đề xuất: new-contract

- **`--transcript` input is not checked, so an unreadable transcript is logged as if it was read**
  Người dùng thấy gì: Nếu đường dẫn nhật ký tác tử bị bỏ trống hoặc trỏ nhầm sang lượt khác, hệ thống ghi như thể đã đọc được nhật ký và không báo là không đọc được. Số đếm lượt không đọc được vì thế có thể thấp hơn thực tế.
  file: `feature-loop/scripts/thuoc-vat.mjs`
  severity: medium
  Đề xuất: known-limits

- **AT3 requires the current workflow to match v2.26.0, which will fail on any later prompt change**
  Người dùng thấy gì: Lần sau ai đổi lời dặn của bộ chấm, kiểm tra này sẽ báo đỏ dù không có lỗi thật, và phải có người cập nhật mốc so sánh. Chỉ tốn công bảo trì, không ảnh hưởng người dùng cuối.
  file: `tests/workflows/tac-tu-cham-hep.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **hoanLai is not all-or-nothing: reset --keep runs before checkout, and a failed checkout is logged as 'not restored' even though the commits were already removed**
  Người dùng thấy gì: Nếu việc hoàn lại hỏng giữa chừng, máy có thể đã xoá các thay đổi của tác tử nhưng vẫn báo là chưa hoàn lại. Phiên làm việc sẽ làm theo hướng dẫn sai trên một cây đã bị đổi, và bản ghi không khớp với thực tế.
  file: `feature-loop/scripts/lib/ghi-boi.mjs`
  severity: medium
  Đề xuất: new-contract

- **lenhGhi counts read-only operands as writes (cp source, file paths in git log/diff/show)**
  Người dùng thấy gì: Tác tử chấm chỉ đọc hoặc sao chép một tệp vẫn có thể bị ghi là đã sửa nó. Số lượt vô hiệu vì tác tử ghi bị tính cao hơn thực tế, và máy tưởng đã biết ai sửa nên bỏ qua lớp bảo vệ.
  file: `feature-loop/scripts/lib/ghi-boi.mjs`
  severity: low
  Đề xuất: new-contract

- **Hình dạng 3 — kiểm cặp cay-doi/ghi-boi chỉ bằng VỊ TRÍ và TÊN KHOÁ, không so giá trị round · luot_ts · sha giữa hai dòng**
  Người dùng thấy gì: Hai dòng ghi của cùng một lượt có thể mang số vòng hoặc mốc giờ khác nhau mà kiểm tra vẫn xanh. Khi đó phiên nghiệm thu đếm cặp sẽ không ghép được và có thể kết luận sai về ngưỡng sống.
  file: `tests/scripts/ghi-boi-tac-tu-cham.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — chiều đỏ AT5/AT6 chỉ ghim TÊN HÀNG, mà tên hàng cũng được in khi hàng ném lỗi; đối chứng dương chạy trên cây thật chứ không trên bản sao**
  Người dùng thấy gì: Bộ kiểm chứng rằng việc quy trách nhiệm cho tác tử chấm và việc tự hoàn lại cây có thật sự bắt được lỗi có một kẽ hở. Khi bài thử hỏng vì chính môi trường chạy thử chứ không phải vì lỗi được cố ý cài vào, nó vẫn báo là đã bắt được lỗi. Màu đỏ ở hai chân này vì vậy chưa chắc chứng minh luật thật sự nhạy. Tính năng vẫn chạy đúng và các chân còn lại không bị ảnh hưởng.
  file: `_acceptance/tac-tu-cham-chi-cham-khong/rang.sh`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
