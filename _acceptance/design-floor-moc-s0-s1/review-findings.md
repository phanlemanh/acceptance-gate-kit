# Review findings: design-floor-moc-s0-s1 (round 3)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Ca THE-M0 so cả thẻ Cổng 1 với bản ở điểm rẽ khỏi nhánh chính, nên sẽ đỏ oan ở mọi PR sau có đổi cách in thẻ Cổng 1**
  Người dùng thấy gì: Sau này, khi ai đó đổi cách in thẻ Cổng Phạm vi vì lý do khác, bộ kiểm có thể báo đỏ và đổ lỗi cho tính năng Sàn thiết kế dù tính năng này không đổi. Người làm sẽ mất thời gian tìm một lỗi không có thật.
  Căn cứ: Không ảnh hưởng người dùng cuối và hôm nay thẻ in đúng; chỉ gây báo đỏ nhầm cho người bảo trì ở các lần đổi sau, người đó tự gỡ được bằng cách chạy lại và đọc kỹ thông điệp.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: high
  Đề xuất: known-limits

- **Ca TT-THAT cần mạng nhưng lại nằm trong bộ kiểm mặc định; khi mất mạng thật nó báo đỏ chứ không SKIP như ghi chú khai**
  Người dùng thấy gì: Người bảo trì chạy bộ kiểm trên máy mất mạng mà không đặt cờ báo hiệu sẽ thấy cả bộ đỏ vì không tải được, dù sản phẩm không hỏng. Ghi chú trong bộ kiểm còn nói khác với hành vi thật.
  Căn cứ: Chỉ ảnh hưởng người bảo trì khi ngoại tuyến, không mất hay lộ dữ liệu của người dùng, và đặt cờ không-mạng hoặc có mạng lại là chạy xanh ngay.
  file: `tests/design-floor/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Lệnh bậc nuốt lỗi git ls-files (kể cả tràn maxBuffer 1 MiB) thành M0 im lặng, lý do in ra sai**
  Người dùng thấy gì: Với kho có danh sách tệp rất lớn (kho crm đã gần ngưỡng), Sàn thiết kế sẽ lặng lẽ coi kho như chưa khai gì: thẻ không có khối Sàn thiết kế và lý do in ra còn nói sai là «không khớp tệp nào». Người dùng không biết tính năng đã tắt.
  Căn cứ: Hậu quả nặng vì tính năng tắt im lặng với kho lớn, nhưng không mất dữ liệu và chỉ chạm khi kho vượt ngưỡng; kho chính đã sát ngưỡng nên nên sửa sớm bằng một việc riêng, chi phí sửa thấp.
  file: `scripts/design-floor-bac.mjs`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc: THE-KHOI tự tay ghi design-floor.json thay vì lấy từ bên viết (design-floor-s1.mjs)**
  Người dùng thấy gì: Nếu sau này phần ghi kết quả và phần in thẻ lệch nhau, thẻ có thể mất khối Sàn thiết kế mà bộ kiểm vẫn xanh, người dùng mất thông tin mà không ai báo.
  Căn cứ: Hiện hai phần đang khớp nên người dùng chưa thấy gì; rủi ro chỉ nảy sinh khi có thay đổi tương lai, và khối này chỉ là dòng thông tin, không chặn việc gì.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — chỉ kiểm chữ «token» có mặt trong khi AC-8 hứa một quan hệ số: GHI-CHI không so số token của dòng usage-report với design-floor.json**
  Người dùng thấy gì: Dòng báo chi phí tri thức trong báo cáo dùng máy có thể in sai con số mà bộ kiểm vẫn xanh. Người đọc báo cáo có thể thấy số không đúng.
  Căn cứ: Chỉ là con số thống kê trong báo cáo, không gây mất dữ liệu hay chặn công việc, và nếu sai thì sửa số là xong.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — assertion âm tính một mình: FL-VANG xanh cả khi lệnh S1 hỏng và không ghi design-floor.json**
  Người dùng thấy gì: Nếu bước kiểm tra sàn thiết kế bị hỏng riêng ở hồ sơ không có luồng hay kế hoạch dùng lại, bộ kiểm vẫn xanh. Người dùng chỉ thấy thẻ thiếu khối thông tin mà không có cảnh báo.
  Căn cứ: Chỉ che một ca hỏng giả định ở nhánh ít gặp, không chặn việc và người dùng chạy lại được; phần còn lại của bộ kiểm vẫn bao phủ đường chính.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — đối chứng dương của BAC-HONG yếu hơn lời khai: chỉ đòi kho lành KHÁC bậc mong đợi, không ghim đúng M3/M2/M2/M1**
  Người dùng thấy gì: Bộ kiểm có thể chấp nhận một kho lành ra bậc khác bậc dự kiến miễn là khác bậc của kho hỏng. Người dùng không bị ảnh hưởng, chỉ là bằng chứng kiểm kém chặt hơn lời khai.
  Căn cứ: Hậu quả rất nhẹ và không chạm người dùng; các ca bậc khác đã ghim đúng bậc cho kho lành nên chi phí sửa không đáng.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 3 — GHI-CHI chỉ so cây một chiều (duyệt `sau`), nên tệp bị xoá không bị bắt dù AC-8 hứa mọi tệp khác giữ nguyên băm**
  Người dùng thấy gì: Nếu lệnh Sàn thiết kế sau này lỡ xoá một tệp trong hồ sơ, bộ kiểm hiện không phát hiện. Người dùng có thể mất một tệp mà không ai báo.
  Căn cứ: Hiện lệnh không xoá gì nên chưa có mất mát; rủi ro chỉ thành thật nếu có thay đổi tệ trong tương lai, và tệp trong kho lấy lại được từ lịch sử git.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: low
  Đề xuất: known-limits

- **Ca BAC-CHU-THICH không có chiều đỏ trong bộ kiểm lẫn trong lịch sử (r2)**
  Người dùng thấy gì: Tính năng vẫn xếp đúng bậc cho kho có dòng ghi chú sát lề. Chỉ có điều bộ kiểm chưa tự chứng minh được là nó sẽ báo đỏ nếu lỗi cũ quay lại, nên sau này một lần sửa nhầm có thể lọt qua mà không ai hay.
  Căn cứ: Người dùng không gặp hậu quả ngay vì hành vi hiện tại đúng, và nếu lỗi cũ quay lại thì họ chỉ thấy kho bị xếp bậc thấp hơn thực tế, tự sửa lại được bằng cách chạy lại; ghi lại giới hạn rồi bổ sung phép thử sau là đủ rẻ.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: medium
  Đề xuất: known-limits

- **Chú thích tự nhận «cùng bộ đọc với lưới tier-mismatch S4 và gate-card» cho design.surface_globs là sai (r2)**
  Người dùng thấy gì: Người bảo trì đọc dòng giải thích này có thể tin rằng hai nơi khác đã đọc cùng một khai báo nên không kiểm lại. Người dùng cuối không thấy gì thay đổi trong cách tính năng chạy.
  Căn cứ: Hậu quả nhẹ vì chỉ gây hiểu nhầm cho người sửa mã chứ không làm hỏng hay mất dữ liệu của người dùng, và sửa lại câu chữ sau rất rẻ.
  file: `scripts/design-floor-bac.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — lời sửa tuyên cả LỚP («hai bên không thể đọc khác nhau: chú thích sát lề, thụt lề lạ…») nhưng ca hồi quy chỉ có MỘT điểm, không có đột biến chiều đỏ (r2)**
  Người dùng thấy gì: Một số cách viết khai báo lạ, như dòng ghi chú sát lề trong khối khai báo thứ hai hay thụt lề không đều, chưa có phép thử riêng. Nếu lỗi đọc cấu hình tái diễn ở đó, kho có thể bị xếp thấp hơn bậc thật mà không có cảnh báo rõ.
  Căn cứ: Hậu quả nhẹ và tự gỡ được vì kho chỉ bị hạ về bậc thấp hơn, không mất dữ liệu và không chặn vòng, còn việc dựng đủ ma trận phép thử đáng làm riêng sau hơn là chen vào lượt này.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: low
  Đề xuất: known-limits

- **Thẻ Cổng Phạm vi bỏ khối «Sàn thiết kế» im lặng khi design-floor.json có mà hỏng; các khối khác của gate-card đều bật cờ vàng trong ca này (r1)**
  Người dùng thấy gì: Nếu tệp kết quả sàn thiết kế bị hỏng, thẻ duyệt phạm vi không hiện khối này và không báo gì, nên người duyệt tưởng kho không dùng sàn thiết kế.
  Căn cứ: Nhẹ vì khối này chỉ là dòng thông tin, không chặn và không làm mất dữ liệu; người dùng chạy lại lệnh là có lại, và tệp hỏng hiếm khi xảy ra.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

- **Ca FL-VANG chỉ kiểm vắng dòng nên vẫn xanh khi lệnh S1 chết (r1)**
  Người dùng thấy gì: Bộ kiểm có thể vẫn báo xanh khi lệnh kiểm tra thiết kế bị hỏng hẳn ở nhánh hồ sơ không có luồng, nên một lỗi như thế có thể lọt qua mà không ai biết.
  Căn cứ: Hậu quả với người dùng chỉ là lỗi lọt qua bộ kiểm, không trực tiếp làm hỏng sản phẩm; sửa rẻ nhưng không gấp và có thể làm ở vòng sau.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: low
  Đề xuất: known-limits

- **design-floor-s1.mjs ghi cứng bảng mã thoát và đường bản gói, dù tự nhận là một nguồn với khối máy của hợp đồng nhập (r1)**
  Người dùng thấy gì: Khi bản gói công cụ thiết kế đổi cách báo kết quả, dòng kiểm tra trên thẻ có thể hiện sai «đạt» hay «trượt» mà không ai hay.
  Căn cứ: Chưa gây sai gì hôm nay vì hai bên đang khớp; nếu về sau lệch thì chỉ hiện sai một dòng thông tin, người dùng không mất dữ liệu.
  file: `scripts/design-floor-s1.mjs`
  severity: low
  Đề xuất: known-limits

- **TT-THAT-DOT stays red even when the script's hash check is removed, so it does not prove the script checks hashes (r1)**
  Người dùng thấy gì: Bộ kiểm báo đã bắt được trường hợp tri thức thiết kế bị sửa lén, nhưng thực ra nó bắt bằng phép kiểm riêng của bộ kiểm chứ không phải của lệnh thật, nên nếu lệnh thật bỏ kiểm này thì không ai biết.
  Căn cứ: Nặng ở chỗ bảo vệ mà người dùng tin là có thể không có thật, nhưng hôm nay lệnh vẫn kiểm đúng và hậu quả chỉ xảy ra nếu sau này ai đó vô tình gỡ phép kiểm.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: medium
  Đề xuất: known-limits

- **THE-M0 compares the whole Gate 1 HTML against the branch point, so any later change to the Gate 1 card will fail CI with a misleading message (r1)**
  Người dùng thấy gì: Sau khi gộp, bất kỳ thay đổi hợp lệ nào ở thẻ duyệt đáng làm kiểm tra thiết kế báo đỏ với thông báo gây hiểu nhầm, làm chậm việc gộp các thay đổi không liên quan.
  Căn cứ: Không ảnh hưởng người dùng sản phẩm nhưng sẽ làm tốn thời gian của người phát triển ở các lần gộp sau; sửa rẻ nếu làm ngay, đắt dần khi nhiều thay đổi chồng lên.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: medium
  Đề xuất: known-limits

- **niem_phong: null / ~ is read as already sealed, so the repo is raised to M3 (r1)**
  Người dùng thấy gì: Nếu ai đó để giá trị trống làm chỗ giữ chỗ cho khoá niêm phong, kho bị coi là đã niêm phong ở bậc cao nhất dù chưa ai niêm phong.
  Căn cứ: Ở vòng này bậc chỉ hiện thành dòng thông tin, chưa chặn gì, và người dùng tự sửa được bằng cách xoá dòng trống; sẽ nặng hơn khi bước chặn theo bậc được dựng sau.
  file: `scripts/design-floor-bac.mjs`
  severity: medium
  Đề xuất: known-limits

- **git ls-files is not run with -z: paths with non-ASCII characters are quoted and never match surface_globs, and a git error is swallowed into M0 (r1)**
  Người dùng thấy gì: Kho có thư mục giao diện đặt tên có dấu tiếng Việt sẽ bị coi như chưa khai gì, nên sàn thiết kế tắt hẳn mà không báo; lỗi hệ thống cũng bị gộp vào cùng thông báo đó.
  Căn cứ: Sàn thiết kế tắt im lặng nên người dùng không thấy gì, nhưng chỉ ảnh hưởng kho đặt tên có dấu và người dùng tự tránh được bằng tên không dấu.
  file: `scripts/design-floor-bac.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — Fixture viết tay đúng khuôn bên đọc: THE-KHOI dựng design-floor.json bằng tay, không lấy từ lệnh S1 (r1)**
  Người dùng thấy gì: Nếu lệnh kiểm tra thiết kế đổi cách ghi kết quả, khối thiết kế trên thẻ có thể biến mất mà bộ kiểm vẫn xanh, nên người duyệt không hay.
  Căn cứ: Hôm nay hai bên khớp nên chưa ai bị ảnh hưởng; hậu quả chỉ xảy ra nếu về sau đổi một bên mà quên bên kia, và khi đó chỉ mất một khối thông tin.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — Assert «chuỗi có mặt» trong khi lời hứa là quan hệ: dòng usage-report chỉ được kiểm là có chữ 'token' (r1)**
  Người dùng thấy gì: Dòng báo chi phí tri thức thiết kế có thể in sai con số mà bộ kiểm vẫn xanh, nên số liệu chi phí người xem đọc có thể không đúng.
  Căn cứ: Chỉ lệch một con số thống kê chi phí, không làm hỏng sản phẩm hay mất dữ liệu; sửa rẻ khi có dịp.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — Lời hứa «chỉ ghi đúng hai thứ» là quan hệ bằng nhau giữa hai tập, nhưng GHI-CHI chỉ kiểm một chiều nên không thấy tệp bị xoá (r1)**
  Người dùng thấy gì: Nếu lệnh kiểm tra thiết kế lỡ xoá một tệp của hồ sơ, bộ kiểm có thể không phát hiện, trong khi hợp đồng hứa lệnh chỉ ghi hai thứ.
  Căn cứ: Nặng nếu xảy ra vì mất tệp của người dùng, nhưng hôm nay lệnh không xoá gì; người dùng khôi phục được từ lịch sử phiên bản nên sửa rẻ để ở vòng sau cũng được.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — FL-TRUOT so N với chính nó: con số N trên dòng không được neo vào số lỗi thật của ui flow lint (r1)**
  Người dùng thấy gì: Dòng báo số lỗi luồng màn hình có thể in sai con số mà bộ kiểm không phát hiện, nhưng vẫn báo đúng là có trượt.
  Căn cứ: Người dùng vẫn biết luồng bị trượt và tự mở bản chi tiết để xem số lỗi đúng; hậu quả rất nhẹ so với công sửa.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 — Đối chứng dương của BAC-HONG không ghim bậc mong đợi, chỉ đòi «khác bậc hỏng» (r1)**
  Người dùng thấy gì: Phép kiểm khai báo hỏng có thể xanh dù kho lành ra sai bậc, nhưng bậc của kho lành đã được các ca khác kiểm.
  Căn cứ: Rủi ro nhỏ vì bậc đúng đã có ca khác bảo vệ, và người dùng không gặp gì trực tiếp.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 — FL-VANG là assert âm tính một mình: lệnh S1 hỏng hay không ghi tệp vẫn cho ca này xanh (r1)**
  Người dùng thấy gì: Bộ kiểm có thể xanh dù lệnh kiểm tra thiết kế chưa hề chạy hay chưa ghi kết quả, nên người ta tin là đúng khi thực ra không được kiểm.
  Căn cứ: Chỉ là bộ kiểm yếu, sản phẩm chưa sai; sửa rẻ và có thể gộp với việc vá ca cùng loại ở lần sau.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — Bảng dịch mã của reuse-plan check (0/2/3/4/5) chỉ có ca cho từng điểm, không có ma trận đủ các mã (r1)**
  Người dùng thấy gì: Hai trường hợp công cụ báo không đo được chưa có ca kiểm riêng, nên nếu dịch sai thì có thể hiện nhầm trên thẻ mà không ai hay.
  Căn cứ: Hai trường hợp này hiếm và nếu sai chỉ hiện nhầm một dòng thông tin; công thêm ca kiểm vượt xa hậu quả.
  file: `tests/design-floor/moc-s0-s1.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
