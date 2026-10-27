# Review findings — design-floor-moc-s0-s1 (round 1)

## Trong hợp đồng

- **design-floor-bac.mjs tự viết bộ đọc config.yaml riêng thay vì dùng bộ đọc chung của kit, và hai bộ đọc cho kết quả khác nhau**
  file: scripts/design-floor-bac.mjs:25
  severity: medium
  AC: AC-1
  source: conventions
  detail: Tệp này đã nạp lib/evidence-core.cjs (để lấy pathGlobToRe), nhưng lại tự viết ba hàm khoi/voHuong/danhSach để đọc design.surface_globs và design_floor.*. Trong khi đó lib/evidence-core.cjs đã có resolveConfigKey/resolveConfigList, được ghi chú là «ONE reader for config.yaml lists» và đang được gate-card.js, start-scan.mjs, config-patch.mjs dùng. Đây đúng là lớp lỗi hai-bộ-đọc-một-tệp. Hai bộ đọc lệch nhau thật: hàm khoi() dừng ngay ở dòng đầu tiên bắt đầu từ cột 0, kể cả dòng chú thích. Tôi đã chạy thử với config `design:\n# các mặt giao diện\n  surface_globs: [web/**]` trên một kho có web/a.html được git theo dõi: design-floor-bac.mjs --json ra {"bac":"M0","ly_do":"chưa khai design.surface_globs"}, còn resolveConfigList(t,'design.surface_globs') ra ['web/**']. Kho rơi về M0 thì lệnh không in gì, nên design-floor tắt hẳn mà không ai thấy, trong khi lưới S4 tier-mismatch đọc cùng khoá ấy vẫn thấy globs. Bộ đo của vòng không bắt được vì mọi config fixture đều do test tự sinh, đúng khuôn của bộ đọc riêng.
  rationale: AC-1 hứa kho đã khai mặt giao diện khớp tệp thì ra bậc M1. Một cấu hình hợp lệ có dòng chú thích sát lề lại ra M0, nên điều AC-1 hứa không đúng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Thẻ Cổng Phạm vi bỏ khối «Sàn thiết kế» im lặng khi design-floor.json có mà hỏng; các khối khác của gate-card đều bật cờ vàng trong ca này**
  Người dùng thấy gì: Nếu tệp kết quả sàn thiết kế bị hỏng, thẻ duyệt phạm vi không hiện khối này và không báo gì, nên người duyệt tưởng kho không dùng sàn thiết kế.
  Căn cứ: Nhẹ vì khối này chỉ là dòng thông tin, không chặn và không làm mất dữ liệu; người dùng chạy lại lệnh là có lại, và tệp hỏng hiếm khi xảy ra.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Ca FL-VANG chỉ kiểm vắng dòng nên vẫn xanh khi lệnh S1 chết**
  Người dùng thấy gì: Bộ kiểm có thể vẫn báo xanh khi lệnh kiểm tra thiết kế bị hỏng hẳn ở nhánh hồ sơ không có luồng, nên một lỗi như thế có thể lọt qua mà không ai biết.
  Căn cứ: Hậu quả với người dùng chỉ là lỗi lọt qua bộ kiểm, không trực tiếp làm hỏng sản phẩm; sửa rẻ nhưng không gấp và có thể làm ở vòng sau.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: low
  Đề xuất: known-limits

- **design-floor-s1.mjs ghi cứng bảng mã thoát và đường bản gói, dù tự nhận là một nguồn với khối máy của hợp đồng nhập**
  Người dùng thấy gì: Khi bản gói công cụ thiết kế đổi cách báo kết quả, dòng kiểm tra trên thẻ có thể hiện sai «đạt» hay «trượt» mà không ai hay.
  Căn cứ: Chưa gây sai gì hôm nay vì hai bên đang khớp; nếu về sau lệch thì chỉ hiện sai một dòng thông tin, người dùng không mất dữ liệu.
  file: `scripts/design-floor-s1.mjs`
  severity: low
  Đề xuất: known-limits

- **TT-THAT-DOT stays red even when the script's hash check is removed, so it does not prove the script checks hashes**
  Người dùng thấy gì: Bộ kiểm báo đã bắt được trường hợp tri thức thiết kế bị sửa lén, nhưng thực ra nó bắt bằng phép kiểm riêng của bộ kiểm chứ không phải của lệnh thật, nên nếu lệnh thật bỏ kiểm này thì không ai biết.
  Căn cứ: Nặng ở chỗ bảo vệ mà người dùng tin là có thể không có thật, nhưng hôm nay lệnh vẫn kiểm đúng và hậu quả chỉ xảy ra nếu sau này ai đó vô tình gỡ phép kiểm.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: medium
  Đề xuất: known-limits

- **THE-M0 compares the whole Gate 1 HTML against the branch point, so any later change to the Gate 1 card will fail CI with a misleading message**
  Người dùng thấy gì: Sau khi gộp, bất kỳ thay đổi hợp lệ nào ở thẻ duyệt đáng làm kiểm tra thiết kế báo đỏ với thông báo gây hiểu nhầm, làm chậm việc gộp các thay đổi không liên quan.
  Căn cứ: Không ảnh hưởng người dùng sản phẩm nhưng sẽ làm tốn thời gian của người phát triển ở các lần gộp sau; sửa rẻ nếu làm ngay, đắt dần khi nhiều thay đổi chồng lên.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: medium
  Đề xuất: known-limits

- **niem_phong: null / ~ is read as already sealed, so the repo is raised to M3**
  Người dùng thấy gì: Nếu ai đó để giá trị trống làm chỗ giữ chỗ cho khoá niêm phong, kho bị coi là đã niêm phong ở bậc cao nhất dù chưa ai niêm phong.
  Căn cứ: Ở vòng này bậc chỉ hiện thành dòng thông tin, chưa chặn gì, và người dùng tự sửa được bằng cách xoá dòng trống; sẽ nặng hơn khi bước chặn theo bậc được dựng sau.
  file: `scripts/design-floor-bac.mjs`
  severity: medium
  Đề xuất: known-limits

- **git ls-files is not run with -z: paths with non-ASCII characters are quoted and never match surface_globs, and a git error is swallowed into M0**
  Người dùng thấy gì: Kho có thư mục giao diện đặt tên có dấu tiếng Việt sẽ bị coi như chưa khai gì, nên sàn thiết kế tắt hẳn mà không báo; lỗi hệ thống cũng bị gộp vào cùng thông báo đó.
  Căn cứ: Sàn thiết kế tắt im lặng nên người dùng không thấy gì, nhưng chỉ ảnh hưởng kho đặt tên có dấu và người dùng tự tránh được bằng tên không dấu.
  file: `scripts/design-floor-bac.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — Fixture viết tay đúng khuôn bên đọc: THE-KHOI dựng design-floor.json bằng tay, không lấy từ lệnh S1**
  Người dùng thấy gì: Nếu lệnh kiểm tra thiết kế đổi cách ghi kết quả, khối thiết kế trên thẻ có thể biến mất mà bộ kiểm vẫn xanh, nên người duyệt không hay.
  Căn cứ: Hôm nay hai bên khớp nên chưa ai bị ảnh hưởng; hậu quả chỉ xảy ra nếu về sau đổi một bên mà quên bên kia, và khi đó chỉ mất một khối thông tin.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — Assert «chuỗi có mặt» trong khi lời hứa là quan hệ: dòng usage-report chỉ được kiểm là có chữ 'token'**
  Người dùng thấy gì: Dòng báo chi phí tri thức thiết kế có thể in sai con số mà bộ kiểm vẫn xanh, nên số liệu chi phí người xem đọc có thể không đúng.
  Căn cứ: Chỉ lệch một con số thống kê chi phí, không làm hỏng sản phẩm hay mất dữ liệu; sửa rẻ khi có dịp.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — Lời hứa «chỉ ghi đúng hai thứ» là quan hệ bằng nhau giữa hai tập, nhưng GHI-CHI chỉ kiểm một chiều nên không thấy tệp bị xoá**
  Người dùng thấy gì: Nếu lệnh kiểm tra thiết kế lỡ xoá một tệp của hồ sơ, bộ kiểm có thể không phát hiện, trong khi hợp đồng hứa lệnh chỉ ghi hai thứ.
  Căn cứ: Nặng nếu xảy ra vì mất tệp của người dùng, nhưng hôm nay lệnh không xoá gì; người dùng khôi phục được từ lịch sử phiên bản nên sửa rẻ để ở vòng sau cũng được.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — FL-TRUOT so N với chính nó: con số N trên dòng không được neo vào số lỗi thật của ui flow lint**
  Người dùng thấy gì: Dòng báo số lỗi luồng màn hình có thể in sai con số mà bộ kiểm không phát hiện, nhưng vẫn báo đúng là có trượt.
  Căn cứ: Người dùng vẫn biết luồng bị trượt và tự mở bản chi tiết để xem số lỗi đúng; hậu quả rất nhẹ so với công sửa.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 — Đối chứng dương của BAC-HONG không ghim bậc mong đợi, chỉ đòi «khác bậc hỏng»**
  Người dùng thấy gì: Phép kiểm khai báo hỏng có thể xanh dù kho lành ra sai bậc, nhưng bậc của kho lành đã được các ca khác kiểm.
  Căn cứ: Rủi ro nhỏ vì bậc đúng đã có ca khác bảo vệ, và người dùng không gặp gì trực tiếp.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 — FL-VANG là assert âm tính một mình: lệnh S1 hỏng hay không ghi tệp vẫn cho ca này xanh**
  Người dùng thấy gì: Bộ kiểm có thể xanh dù lệnh kiểm tra thiết kế chưa hề chạy hay chưa ghi kết quả, nên người ta tin là đúng khi thực ra không được kiểm.
  Căn cứ: Chỉ là bộ kiểm yếu, sản phẩm chưa sai; sửa rẻ và có thể gộp với việc vá ca cùng loại ở lần sau.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — Bảng dịch mã của reuse-plan check (0/2/3/4/5) chỉ có ca cho từng điểm, không có ma trận đủ các mã**
  Người dùng thấy gì: Hai trường hợp công cụ báo không đo được chưa có ca kiểm riêng, nên nếu dịch sai thì có thể hiện nhầm trên thẻ mà không ai hay.
  Căn cứ: Hai trường hợp này hiếm và nếu sai chỉ hiện nhầm một dòng thông tin; công thêm ca kiểm vượt xa hậu quả.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: low
  Đề xuất: wont-fix

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
