## Trong hợp đồng

- **Hình dạng 4 (thông điệp ghim là hằng tự gán, chiều đỏ không chạy phép đo nó canh): LT-01-do**
  file: `tests/scripts/lo-trinh.test.mjs:145`
  severity: medium
  AC: AC-1
  source: measurement
  detail: E1 nói chiều đỏ LT-01-do ghim thông điệp «trang sinh khi ổ cắm vắng». Nhưng code là `const doDuoc = existsSync(path.join(A, 'LO-TRINH.html')) ? 'trang sinh khi ổ cắm vắng' : null; if (doDuoc === 'trang sinh khi ổ cắm vắng') ok(...)`, tức chuỗi do chính ca gán rồi đem so với chính nó, nên ghim này rỗng. Ca cũng không gọi phép đo của LT-01 (khác lt04/lt07, nơi ca đỏ gọi lại đúng hàm đo). Nó chỉ dựng lại một vế là existsSync. Hệ quả: gỡ hoặc làm hỏng điều kiện `if (existsSync(...LO-TRINH.html)) sai.push('trang sinh khi ổ cắm vắng')` trong LT-01 (dòng 125) thì LT-01-do vẫn PASS, nên chiều đỏ không bảo vệ phép đo nó tuyên canh. Nhát tiêm thứ hai vào lo-trinh.mjs (phanTich trả kết quả giả) cũng không có điều kiện kiểm nào phụ thuộc vào nó.
  rationale: AC-1 quy định rõ chiều đỏ: bản sao luôn vẽ trang phải đỏ với thông điệp ghim «trang sinh khi ổ cắm vắng»; ca đỏ tự gán chuỗi rồi so với chính nó nên vế này của AC-1 chưa được chứng minh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Gate bodies regenerate LO-TRINH.html but only commit PRODUCT-MAP.md, so CI --check goes red in any repo that declares lo_trinh.tep**
  Người dùng thấy gì: Ở kho đã khai lộ trình, mỗi lần người ký xong một cổng thì trang lộ trình được vẽ lại nhưng không được đưa vào lần lưu đó. Lần kiểm tra tự động kế tiếp báo đỏ dù không ai làm sai, và người phải tự lưu thêm trang lộ trình bằng tay.
  file: `scripts/product-map.mjs`
  severity: high
  Đề xuất: new-contract

- **feature-loop S0 row lookup leaves the CLI's exit 2 unhandled; an unquoted multi-word description hits it**
  Người dùng thấy gì: Khi bắt đầu một tính năng mới bằng một câu mô tả dài ở kho đã khai lộ trình, bước tra hàng có thể báo lỗi mà hướng dẫn không nói phải làm gì. Phiên làm việc phải tự đoán rằng đó chỉ là mô tả chứ không phải mã hàng.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: known-limits

- **A `dung_tren` or `moc[].hang` that is not an array is dropped without a flag, so a row can be shown as next while its dependency is unfinished**
  Người dùng thấy gì: Nếu chủ kho khai nhầm phần phụ thuộc hoặc phần hàng của mốc không đúng dạng danh sách, hệ thống coi như không khai gì và không cảnh báo. Một hàng vẫn đang phải chờ hàng khác có thể bị hiện là hàng làm kế tiếp, đủ điều kiện.
  file: `scripts/lo-trinh.mjs`
  severity: medium
  Đề xuất: known-limits

- **An invalid row slug is still read for the Cổng Đáng count, outside `_acceptance/`**
  Người dùng thấy gì: Một hàng khai mã hồ sơ sai dạng, trỏ ra ngoài thư mục hồ sơ, vẫn có thể bị tính vào số hàng đã qua Cổng Đáng trên trang. Con số tỉ lệ có thể cao hơn thực tế trong trường hợp khai sai này.
  file: `scripts/lo-trinh.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert chuỗi có mặt thay cho QUAN HỆ): không phép đo nào kiểm cờ và nhãn «tự khai» nằm đúng hàng trên trang**
  Người dùng thấy gì: Không có kiểm tra tự động nào xác nhận cờ lệch và nhãn tự khai nằm đúng dòng trên trang lộ trình. Nếu sau này có sửa làm lệch cờ sang dòng khác, kiểm tra tự động vẫn xanh và chỉ người đọc trang mới thấy.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay khớp đúng thứ ca khẳng định): cờ lệch «crm OKR thật» ở hàng 7n là do người viết fixture tự gán**
  Người dùng thấy gì: Chỗ lệch giữa lời khai và hồ sơ ở hàng 7n trên trang mẫu do người viết mẫu tự đặt, chưa phải một chỗ lệch có thật đo được ở kho crm. Nhãn «thật» của ví dụ này chỉ đúng một phần.
  file: `tests/scripts/fixtures/lo-trinh/crm-okr.json`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): LT-06 kết luận «không có ngày chạy, không script» mà không có ca đỏ nào tiêm vào để chứng minh phép đo bắt được**
  Người dùng thấy gì: Kiểm tra rằng trang lộ trình không chứa ngày giờ chạy chưa từng được thử với một bản cố ý chèn ngày. Một bản vẽ chèn ngày theo dạng khác có thể lọt, và chỉ bị lộ từ hôm sau khi trang đã lưu lệch với bản vẽ lại.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

- **Gate-close commits stage only PRODUCT-MAP.md, so the LO-TRINH.html written in the same pass is left out and CI --check fails (r1)**
  Người dùng thấy gì: Kho nào khai lộ trình rồi duyệt hoặc ký một vòng thì trang lộ trình được vẽ lại nhưng không vào commit đóng cổng. Kiểm tra trên PR sẽ báo đỏ ở mỗi lần đóng cổng cho đến khi người ta tự thêm trang đó vào tay.
  file: `scripts/product-map.mjs`
  severity: high
  Đề xuất: new-contract

- **P99 mutant copy extends a hand-written file list instead of copying whole directories (r1)**
  Người dùng thấy gì: Một phép thử cũ của kit có thể báo đỏ nhầm khi sau này thêm một script mới, dù tính năng không hỏng. Người dùng cuối không bị ảnh hưởng, chỉ người bảo trì mất công tìm nguyên nhân.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Free-text `/feature-loop` arguments break the S0 roadmap-row command (unquoted `<mã>`), and the resulting exit 2 has no handling rule (r1)**
  Người dùng thấy gì: Khi người dùng gõ một mô tả dài thay vì mã hàng để bắt đầu vòng, bước nhận hàng có thể báo lỗi lạ thay vì coi đó là mô tả công việc. Họ phải gõ lại hoặc tự hiểu lỗi.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): ô hồ sơ của «crm OKR thật» do tay khai trong `_nguon.ho_so`, cờ lệch ở hàng 7n do chính fixture dựng ra (r1)**
  Người dùng thấy gì: Dữ liệu mẫu mô phỏng lộ trình thật của kho crm được dựng tay, nên việc trang đọc đúng trên mẫu chưa chứng minh đọc đúng trên lộ trình thật. Chỉ khi kho thật chuyển sang tệp mới biết chắc.
  file: `tests/scripts/fixtures/lo-trinh/crm-okr.json`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
