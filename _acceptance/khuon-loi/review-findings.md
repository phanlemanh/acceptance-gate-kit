# Review findings: khuon-loi (round 2)

## Trong hợp đồng

- **--write đòi HEAD bằng đúng den, nên chạy theo thứ tự SKILL thì mọi lượt PASS đều bị từ chối, vì commit gói evidence (chỉ gồm _acceptance/) đã làm HEAD đi tiếp**
  file: `scripts/design-floor-khuon.mjs:205`
  severity: medium
  AC: AC-7
  source: conventions
  detail: Bản sửa lượt này thêm `if (head !== den) sai(...)`, tức so bằng tuyệt đối. Trong khi đó, SKILL.md dòng 497 (nhánh PASS / PENDING-JUDGMENT) bắt phiên «COMMIT NGAY gói evidence máy-viết» trước Gate 2. Gói đó gồm evidence-report, run-log, contract, evidence/, usage-report, decisions.jsonl, tất cả nằm dưới _acceptance/<slug>/. Bullet «Số đo khuôn sau lượt chấm» (dòng 499, khối KHUON-SAU-S4) lại đứng SAU bước commit đó và truyền `--den <sha lượt chấm>`. Phiên làm đúng thứ tự thì lúc gọi --write, HEAD đã là commit evidence chứ không còn là den. Lệnh thoát 2 «khác HEAD», bị khối này nuốt thành «WARN một dòng, không chặn vòng», khuon-cham.json không được ghi, và thẻ Cổng Bằng chứng hiện cờ vàng «chưa chấm khuôn trên bản đã chấm» trên mọi vòng PASS. Người ký phải đọc một cờ sai. Kiểm tra cũng tự mâu thuẫn: cây bẩn ở _acceptance/ được bỏ qua (regex `^(_acceptance|\.acceptance-runs|\.claude)\/`), nhưng cùng những tệp đó đã commit thì lại bị chặn. Ca KL-7 trong tests/scripts/khuon-loi.test.mjs chỉ ghim chiều đỏ bằng một commit rỗng («đi tiếp»). Nó không có hàng đối chứng cho trường hợp HEAD đi tiếp chỉ bằng commit trong _acceptance/, nên xanh mà không bắt được chuyện này. Hai hướng sửa. Một là nới điều kiện: cho qua khi den là tổ tiên của HEAD và `git diff --name-only den HEAD` chỉ chạm _acceptance/ · .acceptance-runs/ · .claude/, rồi thêm một hàng KL-7 cho ca đó. Hai là đo thẳng ở den như luat-san-pham.cjs --quet vẫn làm (đọc git object tại den). Nếu chọn giữ kiểm tra chặt thì phải dời khối KHUON-SAU-S4 lên trước bước commit evidence trong SKILL.

- **--write refuses whenever HEAD has moved past den, even if the new commit only touches the hồ sơ, so the card's yellow flag stays on**
  file: `scripts/design-floor-khuon.mjs:205`
  severity: medium
  AC: AC-7
  source: bugs
  detail: The new check `if (head !== den) sai(...)` compares commit SHAs, not the tree outside the hồ sơ. In feature-loop SKILL.md, the PASS branch says to COMMIT NGAY the machine-written evidence package (evidence-report.md, run-log.jsonl, contract, usage-report.md) before Gate 2. That commit only touches `_acceptance/<slug>/`, but it still moves HEAD off the sha lượt chấm (verified_commit = den). If the session commits first and then runs the KHUON-SAU-S4 block with `--den <sha lượt chấm>`, the command always exits 2 with «khác HEAD». The SKILL says «Lỗi → WARN một dòng, không chặn vòng», so khuon-cham.json is never written and the card (ban-do-khuon.cjs:330, `cham.den !== vc`) keeps showing «chưa chấm khuôn trên bản đã chấm» on every PASS hồ sơ that follows the commit-first order. The intent («số đo phải là của den») would be met by checking that `git diff --name-only den HEAD` has nothing outside `_acceptance|.acceptance-runs|.claude`, the same rule the dirty-tree check below uses. Test KL-7 only covers an `--allow-empty` commit and never the real case of a commit that touches only the hồ sơ, so it does not catch this. luat-san-pham.cjs takes the same `--den <sha lượt chấm>` and has no HEAD check, which shows the flow expects den != HEAD to be normal.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The porcelain -z filter cuts 3 characters off the old path of a rename entry, so a staged rename inside _acceptance/ is refused by mistake**
  Người dùng thấy gì: Khi ai đó vừa đổi tên một tệp trong thư mục hồ sơ mà chưa commit, lệnh ghi số đo khuôn từ chối chạy và in một đường dẫn bị cụt chữ. Người dùng chỉ cần commit hoặc bỏ thay đổi đó rồi chạy lại là xong.
  Căn cứ: Hậu quả nhẹ: không mất dữ liệu, chỉ bị từ chối nhầm một lần ở ca hiếm, và người dùng tự gỡ được bằng cách commit rồi chạy lại.
  file: `scripts/design-floor-khuon.mjs`
  severity: low
  Đề xuất: known-limits

- **--slug không được kiểm trước khi ghi tệp vào _acceptance/<slug>/ (lệch với luat-san-pham) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu ai đó gõ tên hồ sơ có dấu đi ngược thư mục, công cụ có thể ghi tệp kết quả ra ngoài thư mục hồ sơ thay vì báo lỗi.
  Căn cứ: Chỉ xảy ra khi người chạy lệnh tự gõ tên bất thường trên máy của mình, không chạm người dùng cuối, sửa sau rẻ và không mất dữ liệu có sẵn.
  file: `scripts/design-floor-khuon.mjs`
  severity: medium
  Đề xuất: known-limits

- **Khuôn đặc tả UX và SKILL nói «máy so» Thẻ việc với nhan_viec, nhưng không có máy nào làm việc đó (r1)**
  Người dùng thấy gì: Tài liệu hướng dẫn nói máy sẽ đối chiếu phần mô tả công việc của màn với khai báo của nhóm, nhưng thực tế chưa có bước nào làm vậy nên người đọc có thể tin nhầm là đã được kiểm.
  Căn cứ: Hậu quả nhẹ vì chỉ là câu chữ gây hiểu lầm, không làm sai kết quả chấm; chỉ cần khai rõ giới hạn là đủ và sửa lúc nào cũng rẻ.
  file: `skills/acceptance/references/ux-spec-template.md`
  severity: medium
  Đề xuất: known-limits

- **Vòng khuon-loi sửa test của hồ sơ lo-trinh-gio-may đã ký: đổi một chiều đỏ thành SKIP mà expected của eval đã ký không có (r1)**
  Người dùng thấy gì: Một phép kiểm của hồ sơ khác đã ký nay có thể báo bỏ qua thay vì đỏ khi bộ đọc hỏng, và hồ sơ đó sẽ hiện là cũ cần ghim lại.
  Căn cứ: Không ảnh hưởng người dùng sản phẩm, chỉ làm một thước của hồ sơ khác lỏng hơn và cần ghim lại ở đợt phát hành; người quyết nên biết để xếp lịch ghim.
  file: `tests/scripts/lo-trinh-gio-may.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Tệp fixture khuon-loi-kho-mau.mjs không nằm trong paths của eval nào, nên vòng sửa chỉ chạm fixture vẫn mang sang màu xanh cũ (r1)**
  Người dùng thấy gì: Nếu một lượt sau chỉ sửa dữ liệu mẫu dùng để thử, các phép kiểm có thể được giữ lại màu xanh của lượt trước mà không chạy lại.
  Căn cứ: Chỉ làm lượt sau chấm lỏng hơn mức cần, người dùng cuối không thấy; khai thành giới hạn là đủ vì sửa danh sách đường dẫn rất rẻ khi cần.
  file: `_acceptance/khuon-loi/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Chú thích khoá khuon_loi trong config ghi sai dải ca và chen vào giữa cặp quet_het_han/_rt5 (r1)**
  Người dùng thấy gì: Một dòng ghi chú trong tệp cấu hình ghi sai dải ca và nằm chưa đúng chỗ, chỉ gây khó đọc cho người bảo trì.
  Căn cứ: Không có hậu quả nào với người dùng hay kết quả chấm; chi phí mở việc riêng lớn hơn lợi ích.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: wont-fix

- **--kiem --write bỏ mất ra.sai: bản đồ hỏng lược đồ vẫn ra khuon-cham.json sạch, lệnh thoát 0, thẻ in dòng Khuôn sạch (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi tệp mô tả khuôn của kho bị hỏng cú pháp, thẻ duyệt vẫn in dòng Khuôn sạch như không có lỗi, trong khi cả bản đồ khuôn thực ra đã bị tắt mà không ai hay.
  Căn cứ: Người ký có thể tin là màn đã theo khuôn trong lúc không có gì được kiểm, nên lỗi lọt qua cổng; sửa nên làm sớm và không đắt vì người chạy lại lệnh kiểm vẫn thấy lỗi.
  file: `scripts/design-floor-khuon.mjs`
  severity: high
  Đề xuất: new-contract

- **Kiểm khe bị cắt ở dấu «>» đầu tiên trong thẻ: hàm mũi tên trong thuộc tính báo thiếu khe sai và để lọt thiếu children (r1)**
  Người dùng thấy gì: Với những thẻ có xử lý bấm nút viết kiểu hàm mũi tên, công cụ có thể báo thiếu mục dù đã có (trả lại màn oan), hoặc bỏ sót khi thật sự thiếu nội dung.
  Căn cứ: Kiểu viết này rất phổ biến nên người làm sẽ bị trả lại oan hoặc lọt lỗi khá thường xuyên; người dùng cuối không bị ảnh hưởng trực tiếp nhưng sửa cần một vòng riêng.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: new-contract

- **Bộ đọc YAML âm thầm bỏ mọi khoá sau một dòng thụt sâu hơn (scalar nhiều dòng, |, >) (r1)**
  Người dùng thấy gì: Nếu người viết tệp khuôn dùng một mô tả trải nhiều dòng, các mục khai báo phía sau bị lặng lẽ bỏ qua, có thể khiến nhóm bị chấm sai hoặc quy tắc cấm bị tắt.
  Căn cứ: Chỉ xảy ra khi tệp khuôn dùng cách viết hiếm, người dùng cuối không thấy trực tiếp; khai giới hạn kèm ngưỡng và dặn dùng dạng một dòng là hợp lý.
  file: `scripts/ban-do-khuon.cjs`
  severity: medium
  Đề xuất: known-limits

- **gate-card nuốt mọi lỗi của theCong2: thẻ trông như kho không khai bản đồ (r1)**
  Người dùng thấy gì: Nếu phần dựng dòng Khuôn trên thẻ gặp lỗi bất ngờ, thẻ im lặng bỏ dòng này và trông y như kho không dùng khuôn.
  Căn cứ: Hiếm gặp và chỉ làm thẻ thiếu thông tin chứ không đưa thông tin sai; người xem chạy lại thẻ là thấy, sửa rẻ.
  file: `scripts/gate-card.js`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
