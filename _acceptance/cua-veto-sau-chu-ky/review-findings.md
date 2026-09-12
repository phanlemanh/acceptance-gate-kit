# Review Findings: cua-veto-sau-chu-ky (round 2)

## Trong hợp đồng

### Nhánh «soi gương» frontmatter thiếu dấu đóng vá chưa hết: dò fence bằng `.trim()` trong khi cả hai bộ giải đòi cột 0

- file: `scripts/start-scan.mjs:163`
- severity: medium
- source: bugs
- AC: AC-6

Điều kiện `!dong.slice(dau + 1).some(l => l.trim() === '---')` coi MỘT dòng `---` THỤT LỀ trong thân là dấu đóng hợp lệ. Nhưng frontmatterField (regex `\r?\n---[ \t]*`) và awk của front_field (`/^---[[:space:]]*$/`) đều đòi `---` ở CỘT 0. Vậy khi khối frontmatter không có dấu đóng ở cột 0 mà thân có một dòng `  ---` (ví dụ log dán thụt lề, khối YAML lồng), nhánh soi-gương KHÔNG chạy → raw giữ null → máy quét kết luận «chưa ký» với warn RỖNG, trong khi awk của lưới đọc tới hết tệp và THẤY chữ ký.

ĐO THẬT (1 hồ sơ veto_state=mo, bỏ dòng `---` đóng, chèn `  ---` vào thân):
```
lưới: NOTE «cửa veto đã đóng bằng chữ ký (Manh Phan 2026-09-11)», dòng tổng = []
máy quét: {"humanSignoff":false,"signoffWarn":""} , vetoOpenUnsigned = ["a-thut"]
```

Đây đúng lớp lỗi mà commit d47e4e0f sinh ra để giết (S4-r1, AC-6) — chỉ hẹp hơn một bậc, và vẫn NUỐT IM đúng như chú thích ở dòng 130-136 hứa là không được phép. Ô `thieu-fence-dong` của ma trận không có biến thể thụt lề nên phép đo không soi tới. Chữa tối thiểu: dò dấu đóng bằng `/^---[ \t]*$/.test(l)` thay cho `l.trim() === '---'` (khớp đúng cả hai bộ giải).

**Rationale (map vào AC):** Đây đúng ô matrix «frontmatter MỞ mà thiếu dấu đóng ---» của AC-6 (thêm ở S4-r1): finding cho một biến thể thật của cùng ô đó (không có dấu đóng cột 0, có dòng --- thụt lề gây nhiễu) mà hai bộ đọc KHÔNG cùng kết luận — vi phạm trực tiếp yêu cầu AC-6(b) đẳng thức giữa lưới và máy quét trên ô đã khai.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **signoffState() grammar looser than the awk mirror it must equal — two verified divergences, both with empty signoffWarn**
  Người dùng thấy gì: Nếu chữ ký được ghi bằng cách viết khác chuẩn (ví dụ hoa/thường khác, dùng dấu bằng thay dấu hai chấm, hoặc thêm khoảng trắng thừa), máy quét /start có thể coi là đã ký trong khi công cụ kiểm tra chính vẫn coi cửa veto đang mở, nên người xem thẻ /start có thể bỏ sót một hồ sơ cần chú ý.
  file: `scripts/start-scan.mjs`
  severity: medium
  Đề xuất: known-limits

- **signoffWarn cannot be reached from the copy-only list, and acceptance-status never prints it**
  Người dùng thấy gì: Lý do vì sao một hồ sơ được xem là chưa ký không hiện trên thẻ /acceptance-status — người xem thẻ đó chỉ thấy tên hồ sơ, không thấy lời giải thích kèm theo.
  file: `scripts/start-scan.mjs`
  severity: low
  Đề xuất: known-limits

- **Comment cites "ma trận 78 ô" while the enforced matrix is 84**
  Người dùng thấy gì: Một con số trong ghi chú nội bộ của mã nguồn bị lỗi thời (78 thay vì 84) — không ảnh hưởng gì tới người dùng cuối, chỉ có thể gây nhầm lẫn cho người đọc mã sau này.
  file: `scripts/start-scan.mjs`
  severity: low
  Đề xuất: known-limits

- **Hai bộ đọc lệch ở lớp ĐỌC KHOÁ — máy quét GIẤU hồ sơ mà lưới vẫn đếm là cửa veto mở**
  Người dùng thấy gì: Nếu hồ sơ ghi chữ ký với cách viết khác chuẩn (hoa/thường, dấu bằng thay vì hai chấm), máy quét /start có thể báo hồ sơ đã ký dù công cụ kiểm tra chính vẫn coi cửa veto còn mở, nên tên hồ sơ có thể biến mất khỏi danh sách người cần xem mà không ai nhận ra.
  file: `scripts/start-scan.mjs`
  severity: high
  Đề xuất: known-limits

- **Chiều đỏ (a) kết luận từ VẮNG MẶT, không có đối chứng dương — bản sao chết cũng cho cùng màu xanh**
  Người dùng thấy gì: Một trong các bài kiểm tra tự động dùng để xác nhận tính năng hoạt động đúng có thể báo đạt ngay cả khi chính bài kiểm tra đó gặp lỗi và không thực sự chạy — rủi ro này nằm ở công cụ kiểm thử nội bộ, không phải ở tính năng người dùng thấy.
  file: `_acceptance/cua-veto-sau-chu-ky/chan-giu-cho.mjs`
  severity: medium
  Đề xuất: known-limits

- **Chú thích khai nhánh cũ «không còn tới được» là sai — vế `[ -n "$_vsig" ]` vẫn nổ**
  Người dùng thấy gì: Một dòng ghi chú giải thích trong mã nguồn nói sai về một nhánh xử lý; nếu sau này có người dọn dẹp mã theo đúng ghi chú đó, một số hồ sơ có chữ ký giữ chỗ (không phải chữ ký thật) có thể bị xử lý sai, nhưng hiện tại chưa có ảnh hưởng thực tế.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — Assertion âm-tính-một-mình (LỚP, 4 chỗ): chiều đỏ kết luận «đột biến đã chạy» từ VẮNG MẶT, không có gì chứng bản sao còn chạy được**
  Người dùng thấy gì: Bốn bài kiểm tra tự động dùng để xác nhận các luật an toàn hoạt động đúng có thể báo đạt ngay cả khi bản sao dùng để thử nghiệm bị lỗi và không chạy được — đây là rủi ro ở công cụ kiểm thử nội bộ, đã được ghi nhận trước đó là nằm ngoài phạm vi vòng này.
  file: `_acceptance/cua-veto-sau-chu-ky/chan-giu-cho.mjs`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 — chiều đỏ của chan-van-ban đo một BẢN SAO của phép đo, và bản sao đã trôi: vế `_Avoid_` không có chiều đỏ nào**
  Người dùng thấy gì: Một bài kiểm tra tự động dùng để xác nhận tài liệu hướng dẫn nội bộ đầy đủ nội dung không thực sự thử nghiệm được một phần nội dung đó — rủi ro nằm ở công cụ kiểm thử nội bộ, không phải ở nội dung tài liệu thực tế mà người dùng thấy.
  file: `_acceptance/cua-veto-sau-chu-ky/chan-van-ban.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — đối chứng dương của chan-lan-can KHÔNG phân biệt được với 2/5 luật: bản lành chạy `--base HEAD` nên hai luật ghi-ngược không bao giờ chạy**
  Người dùng thấy gì: Một bài kiểm tra tự động dùng để xác nhận các luật an toàn không bị đổi có thể không thực sự phân biệt được hai trong năm luật đó — rủi ro nằm ở công cụ kiểm thử nội bộ, không phải ở các luật an toàn thật mà người dùng đang được bảo vệ.
  file: `_acceptance/cua-veto-sau-chu-ky/chan-lan-can.mjs`
  severity: medium
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 4/10 lỗi rơi vào file không bộ đo nào phủ (_acceptance/cua-veto-sau-chu-ky/chan-giu-cho.mjs, _acceptance/cua-veto-sau-chu-ky/chan-van-ban.mjs, _acceptance/cua-veto-sau-chu-ky/chan-lan-can.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
