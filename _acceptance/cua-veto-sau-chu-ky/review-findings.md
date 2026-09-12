# Review Findings: cua-veto-sau-chu-ky (round 6)

## Trong hợp đồng

- **Hình dạng 5 — tuyên quét LỚP «không tệp nào dưới scripts/» nhưng chỉ có ĐIỂM-CASE một tệp (và tệp không quét thật sự vi phạm)**
  file: `_acceptance/cua-veto-sau-chu-ky/chan-dang-thuc.mjs:49`
  severity: high
  AC: AC-6
  detail: AC-6/E6 khai vế (0) là một LỚP: «không tệp nào dưới scripts/ giữ bảng giữ-chỗ HAY biểu thức đọc human_signoff riêng». Vế thứ nhất (bảng giữ-chỗ) đúng là quét lớp: `quetBang()` (dòng 35-41) đọc mọi tệp .sh/.mjs/.cjs/.js trong scripts/ và đếm mẫu. Vế thứ hai thì KHÔNG: dòng 49-51 chỉ đọc đúng MỘT tệp

      const scanSrc = readFileSync(path.join(F.ROOT, 'scripts/start-scan.mjs'), 'utf8');
      if (/human_signoff[^\n]*(\/|match\(|RegExp)/.test(scanSrc))
        loi.push('máy quét mọc biểu thức đọc human_signoff riêng — vị từ phải hỏi lib');

  Số assert = 1 trong khi số phần tử của lớp = số tệp thi hành dưới scripts/. Đây không phải lỗ lý thuyết: `scripts/pre-merge-check.sh` — tệp KHÔNG được quét — hiện có ít nhất hai biểu thức đọc human_signoff của riêng nó, và cả hai đều KHỚP chính regex ở trên nếu đem áp vào:
  - dòng 839: `_vsig="$(front_field "$_vrep" human_signoff 2>/dev/null)"` (chuỗi sau khoá có `/`)
  - dòng 1175: `| sed -n 's/^human_signoff:[[:space:]]*//p' | head -1 ...` (ngữ pháp awk/sed thứ hai, dùng cho `base_sig`)

  Chính chú thích của vật ở pre-merge-check.sh dòng 1057 thừa nhận front_field là ngữ pháp HẸP HƠN engine. Nói cách khác: phép đo tuyên «một nguồn» cho cả scripts/, nhưng nó được viết đúng chỗ duy nhất đã sạch, và im lặng ở chỗ ngữ pháp thứ hai còn sống. Cách sửa cùng tầng với vế (0) thứ nhất: chạy chính regex ấy qua vòng `readdirSync(scripts/)` như `quetBang`, kèm danh sách miễn trừ có tên + lý do nếu dòng 839/1175 là cố ý giữ.
  rationale: AC-6(0) đòi bất biến "không tệp nào dưới scripts/ giữ bảng giữ-chỗ hay biểu thức đọc human_signoff của riêng nó" cho TOÀN BỘ scripts/, nhưng eval chỉ kiểm một tệp và bỏ sót một tệp khác đang thực sự vi phạm — đúng AC-6 thất bại trên vật thật, không chỉ là hạn chế đã biết.
  source: measurement

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Cờ «lưới chữ ký không chạy được» bị mất trong subshell — và signoff_that không hề đặt cờ, nên bản lùi chạy im**
  Người dùng thấy gì: Khi máy thiếu công cụ hỗ trợ để kiểm tra chữ ký, lưới kiểm tra trước khi gộp có thể âm thầm chuyển sang chế độ kiểm tra hẹp hơn mà không báo cho người biết — một hồ sơ đã được ký hợp lệ có thể bị báo nhầm là còn chờ duyệt mà không có lời giải thích nào đi kèm.
  file: `scripts/pre-merge-check.sh`
  severity: high
  Đề xuất: known-limits

- **NARROW_NET_BLIND set inside a command substitution is discarded — the "engine did not run" NOTE can be silently skipped**
  Người dùng thấy gì: Khi máy thiếu công cụ hỗ trợ để kiểm tra chữ ký, một dòng cảnh báo lẽ ra phải xuất hiện để báo 'phép kiểm đang chạy suy giảm' có thể không bao giờ hiện ra, khiến người đọc không biết kết quả kiểm tra đang kém tin cậy hơn bình thường.
  file: `scripts/pre-merge-check.sh`
  severity: medium
  Đề xuất: known-limits

- **signoff_that() degrades to "unsigned" with no diagnostic when node/lib is unavailable, producing a self-contradicting report**
  Người dùng thấy gì: Khi máy thiếu công cụ hỗ trợ để kiểm tra chữ ký, một hồ sơ ĐÃ được người ký thật vẫn có thể bị báo cáo hiện dòng 'đang chờ duyệt' — đúng thông điệp sai mà tính năng này vốn được làm ra để loại bỏ, nhưng chỉ xảy ra trong tình huống thiếu công cụ hỗ trợ đó.
  file: `scripts/pre-merge-check.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 — chiều đỏ DV5u đo BẢN CHÉP của luật, không đo chính luật vừa thêm**
  Người dùng thấy gì: Bài kiểm chứng cho luật mới chỉ tự chấm lại một bản sao chép của chính nó chứ không kiểm tra luật thật đang chạy — nếu sau này ai đó vô tình làm yếu luật thật, bài kiểm này sẽ không phát hiện ra.
  file: `tests/scripts/additive-only.test.mjs`
  severity: medium
  Đề xuất: known-limits

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ

- **Vẫn còn ngữ pháp đọc `human_signoff` thứ ba trong chính tệp vừa gom về MỘT nguồn**
  file: `scripts/pre-merge-check.sh:1175`
  severity: medium
  detail: Đổi khuôn S4-r2/r3 khai `chuKyThat` trong `lib/evidence-core.cjs` là «nơi DUY NHẤT được giữ các luật này», và nó cố ý MỞ RỘNG ngữ pháp: khoá không phân biệt hoa thường, ngăn bằng `:` hoặc `=`, cho phép khoảng trắng trước dấu ngăn. Fixture của chính hồ sơ ghim ba ca đó là CHỮ KÝ THẬT (`khoa-hoa`, `khoa-dau-bang`, `khoa-cach-truoc` trong `_acceptance/cua-veto-sau-chu-ky/fixture.mjs`).

  Nhưng nhánh «chiều GHI chữ ký» ở dòng 1172–1175 vẫn tự đọc bản BASE bằng một khuôn awk+sed gõ tay: `sed -n 's/^human_signoff:[[:space:]]*//p'` — chỉ nhận đúng `human_signoff:` viết thường, không nhận `=`, không nhận khoảng trắng trước dấu hai chấm. Hệ quả cụ thể: hồ sơ mà bản base đã ký bằng `human_signoff = Manh 2026-09-11` (hoặc `Human_signoff:`) cho `base_sig` rỗng, nên lưới in «NOTE [slug]: chữ ký mới trong diff — …» cho một chữ ký đã có từ trước — cùng một tệp, cùng một khoá, hai kết luận trái nhau, đúng hình dạng lỗi mà hai lượt chấm trước vừa bắt. Dòng 839 (`_vsig="$(front_field "$_vrep" human_signoff)"`, awk phân biệt hoa thường, chỉ `:`) là bản dựng thứ tư của cùng vị từ, đặt ngay cạnh lượt gọi `signoff_that` mới ở dòng 846.
  source: conventions

⚠ Cụm ngoài vùng phủ: 2/7 lỗi rơi vào file không bộ đo nào phủ (_acceptance/cua-veto-sau-chu-ky/chan-dang-thuc.mjs, _acceptance/cua-veto-sau-chu-ky/chan-lui-engine.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.