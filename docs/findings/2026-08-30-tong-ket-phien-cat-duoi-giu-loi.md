# Tổng kết phiên 30/08 — «cắt đuôi, giữ lõi»: từ vòng khuôn răng tới mốc 2.5.0 chạm repo tiêu thụ

Phiên một ngày, khép trọn một quyết định chiến lược của owner và bốn việc thi
hành nó. Nguồn sự kiện: hội thoại 30/08 + các PR #126–#129 (kit) và
media-library#48.

## Dòng sự kiện

1. **Vòng khuôn răng chạy hai lượt chấm rồi DỪNG ĐÚNG LUẬT.** Hồ sơ
   `khuon-rang-dung-chung` (ký Cổng Đáng 30/08) giao thư viện móng đo dùng
   chung + lưới thường trực + một bộ răng thật viết lại. Lượt 1: máy đạt,
   lượt soi ra 10 phát hiện (4 nặng) — đều IN-CONTRACT, đều đúng lớp
   «âm-tính-một-mình» mà chính hồ sơ đi giết. Vá 7 khuyết tật, lượt 2: máy
   vẫn đạt nhưng lượt soi trả về **đúng ba lớp lỗi cũ ở chỗ mới** (18 phát
   hiện) → luật dừng-vá bật, máy dừng trình ba lối.
2. **Owner rà soát North Star toàn cục** («kit có đáng giữ không — có thể cắt
   luôn kit») và hỏi câu then chốt: *«tại sao kit không đặt giới hạn cho
   mình?»*. Trả lời ba tầng: kit chỉ có phanh CHIỀU SÂU mà mọi phanh xả vào
   sổ hạng mục không trần; kit chưa từng áp học-thuyết-máy-giữ lên bộ máy
   quản trị của chính nó (hai con số North Star chưa từng có bộ đếm); kẻ viết
   giới hạn = kẻ bị giới hạn nên giới hạn phải neo ngoài (mốc phát hành +
   owner).
3. **Owner quyết ① «cắt đuôi, giữ lõi»** (một chạm, sau bảng ba phương án).
   Thi hành trọn trong ngày:
   - **#127** — park `khuon-rang-dung-chung` (tại dừng-vá, kho = nhánh
     `feat/khuon-rang-dung-chung`) + park `baseline-127-tin-hieu-phan-biet`;
     luật **Giới hạn CHIỀU RỘNG** vào CLAUDE.md; lời từ chối + ngưỡng mở lại
     vào `.out-of-scope/thuoc-cua-thuoc-mot-tang.md`.
   - **#128** — **phát hành 2.5.0**, gom năm hồ sơ ký 27–30/08 (#116 #117
     #121 #123 #125) + bộ ca đo tầng SKILL (#120). Hai lượt chấm; Cổng Bằng
     chứng **ký Manh Phan** với bốn known-limits khai thật.
   - **#129** — chiến dịch ghim lại theo mốc, THU PHẠM VI 39→2 hồ sơ (xem
     Vấp 3).
   - **media-library#48** — cài 2.4.0+2.5.0 MỘT lần lên repo tiêu thụ: plugin
     user-scope lên 2.5.0, làm mới 1/7 file chép, lưới consumer chạy tại chỗ
     sạch, kiểm-bằng-nội-dung khớp trên bản cài. **Nợ neo-ngoài từ 26/08 trả
     xong.**

## Con số của phiên

- Khuôn răng: ~700 dòng mã-đo mới nhận 10 + 18 phát hiện qua hai lượt soi —
  bằng chứng thực nghiệm «mã-đo không hội tụ về 0 phát hiện» (mã sản phẩm
  cùng bộ máy soi thì hội tụ 5→0 sau một vòng).
- Từ 2.4.0 (26/08) tới sáng 30/08: 5 vòng lặp 100% việc-trong-nhà, 0 giá trị
  chạm người dùng — con số nền của quyết định cắt.
- Chiều ngược, phần lõi: lưới consumer bắt 4/4 vi phạm luật thật; 0 lượt cháy
  chấm-sai-cây trong 9 vòng sau khi cơ chế ghim (#123) ship.
- Mốc 2.5.0 là hồ sơ phát hành ĐẦU TIÊN mang bảng «Ba dòng số North Star»
  đếm tay (luật (c)).

## Luật mới sống từ phiên này

- **Giới hạn CHIỀU RỘNG** (CLAUDE.md): (a) bộ đo được máy kiểm MỘT tầng —
  không mở vòng đo-thước-của-thước; ngưỡng mở lại: ≥2 lượt chấm sai do
  phép-đo-tự-dối trên vòng SẢN PHẨM giữa hai release; (b) tối đa MỘT vòng
  meta giữa hai release, owner gọi tên; (c) mỗi mốc phát hành đếm tay 3 dòng
  số vào hồ sơ release.
- **Ngưỡng CẮT KIT khai trước** (đếm tới 2.6.0): ≥2/5 vòng sản phẩm kế bị
  hạ-tầng-kit đốt lượt chấm, hoặc trung bình >3 lần gọi người/vòng → mở
  phiên quyết cắt kit — cắt bằng số, không bằng cảm giác.

## Vấp của máy trong phiên (ghi để lớp không tái diễn)

1. **Bộ tổng-hợp của workflow chấm BỊA giờ-kiểm hai lần** (09:00Z rồi
   10:15Z — số tròn ở tương lai, lệch sổ máy ~6 giờ), ngay trong mốc đóng số
   cho `suite-run-log-provenance`. Cả hai lần được đối chiếu về ts của
   run-log trước khi commit; vào sổ vòng-đời (`release-2-5-0#1`) — chưa có
   lưới máy ở tầng workflow, đếm theo ngưỡng mở lại.
2. **Report tự khai Known-limits/Ngoài-hợp-đồng RỖNG trong khi giới hạn có
   thật** → suýt lọt làn veto-mở không chữ ký. Điền thật → cổng đòi chữ ký
   đúng thiết kế. Bài học: mục rỗng là một TUYÊN BỐ, phải kiểm như mọi tuyên
   bố khác.
3. **Chiến dịch ghim lại quá tay 39 hồ sơ — CI của chính kit chặn đúng
   luật** (kéo evidence đời cũ vào diff → re-check strict đỏ vì chúng tham
   chiếu khoá config đã bỏ). Thu về 2 hồ sơ pin-tươi trong cửa sổ mốc; đời cũ
   hoá-cũ là trạng thái chấp nhận được (§7.1) — bốn mốc trước cũng không đuổi.
4. **Câu kiểm-bằng-nội-dung in cho người trỏ chuỗi không tồn tại** (lượt soi
   r1 bắt) — lớp lệnh-in-ra-phải-bấm-được tái xuất ở mặt mô tả plugin; neo
   lại vào hằng ASCII có thật (`MSG_NO_DOSSIER`).
5. Nhỏ mà đáng nhớ: `claude plugin update --scope project` neo theo
   `CLAUDE_PROJECT_DIR` của phiên, không theo cwd — cập nhật cho repo khác
   phải `env -u CLAUDE_PROJECT_DIR`; và sổ vòng-đời known-limits đòi mọi mục
   mới dùng tên lớp CÓ SẴN (P177/P179 bắt tại chỗ).

## Đang đếm (không việc nào treo cần người)

- Ngưỡng CẮT KIT → mốc 2.6.0 (đếm trên vòng sản phẩm ở repo tiêu thụ).
- Ngưỡng mở lại thước-của-thước (≥2 lượt chấm sai do phép-đo-tự-dối trên
  vòng SẢN PHẨM).
- Ngưỡng 5-vòng-kế của `cham-dung-cay-dung-cho-dung` (đọc bằng
  `round-tally-read.mjs`) — đang giữ 0 lượt cháy.

Con trỏ: quyết định + căn cứ đầy đủ ở `_acceptance/release-2-5-0/` ·
`.out-of-scope/thuoc-cua-thuoc-mot-tang.md` · CLAUDE.md mục Giới hạn CHIỀU
RỘNG · nhánh kho `feat/khuon-rang-dung-chung`.
