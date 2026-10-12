# Review findings: dieu-phoi-sua-truoc-dot-thu (round 1)

## Trong hợp đồng

- **Hồ sơ nói nhịp thật là taoVong(...)() nhưng ca SDT đo bằng motNhip**
  file: `_acceptance/dieu-phoi-sua-truoc-dot-thu/evals.yaml:77`
  severity: low
  AC: AC-4
  source: conventions
  detail: Hợp đồng định nghĩa «nhịp thật = một lần taoVong(...)() của phat-lich.mjs». evals.yaml dòng 9 và E4 dòng 77 viết «mỗi hàng chạy taoVong(...)() thật». Nhưng hàm nhip() của tests/dieu-phoi/sua-truoc-dot-thu.test.mjs:129 gọi thẳng motNhip, và header của tệp ca cũng nói vậy. taoVong còn chạy thêm kiểm lõi đợt (loiCon → 'loi-vang') và lượt fetch quanh motNhip. Như vậy chữ của eval/hợp đồng hứa một đường mã mà phép đo không chạy. Giám khảo so expected với output có thể chấm lệch. Sửa một trong hai: chữ eval/hợp đồng nói motNhip, hoặc ca gọi taoVong như DP2-07.
  rationale: Hợp đồng định nghĩa «nhịp thật» là một lần taoVong, còn AC-4 chạy «một nhịp thật»; ca đo lại gọi thẳng motNhip nên không chạy đúng đường mã hợp đồng nêu.

- **evals.yaml E4 tả phép đo mạnh hơn phép đo test thật chạy (taoVong, CLI lo-trinh --mo-o)**
  file: `_acceptance/dieu-phoi-sua-truoc-dot-thu/evals.yaml:75`
  severity: low
  AC: AC-4
  source: bugs
  detail: E4 (và dòng 9) nói mỗi hàng chạy `taoVong(...)()` thật, và ô do bộ ghi thật `node scripts/lo-trinh.mjs --mo-o` sinh trên tệp lộ trình của kho thử. Test thật (tests/dieu-phoi/sua-truoc-dot-thu.test.mjs, hàm `nhip` dòng ~130 và `oTuBoGhi`) gọi thẳng `motNhip` với io giả, tức không qua `taoVong`: bỏ cả bước `loiCon()` lẫn khung bắt lỗi `loi-nhip`. Nó cũng gọi hàm `dungCoHoi` với `moc` mặc định `[]` thay cho CLI, mà CLI truyền `moc: k.moc` đọc từ lộ trình. Hợp đồng còn định nghĩa «nhịp thật = một lần `taoVong(...)()`». Vậy dòng `expected` khai một đường đo mà ca không chạy, người chấm đọc bằng chứng sẽ tin nhầm phạm vi. Cách sửa: sửa chữ trong evals cho khớp vật, hoặc đổi ca sang gọi `taoVong` và CLI thật.
  rationale: AC-4 đòi nhịp thật và ô sinh bằng bộ ghi thật `lo-trinh.mjs --mo-o`; ca test gọi motNhip với io giả và hàm thay cho CLI nên phép đo yếu hơn điều AC-4 nêu.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Dãy chờ chữ build (cong-dang) hoặc chờ một hàng đã park bị xếp «du» và không hiện ở chỗ nào cho người**
  Người dùng thấy gì: Khi một việc đang chờ anh gõ chữ build, hệ thống coi như mọi thứ ổn và không báo gì. Việc đó có thể đứng yên rất lâu mà không ai biết là đang chờ anh.
  file: `dieu-phoi/scripts/lich.mjs`
  severity: medium
  Đề xuất: new-contract

- **B1: hàng phụ thuộc vào một hàng đã quyết park/kill/iterate bị treo im lặng ở «phu-thuoc» mãi mãi**
  Người dùng thấy gì: Nếu một việc phải đợi một việc khác mà việc kia đã bị anh quyết dừng hẳn, việc đợi sẽ đứng yên mãi mà không có cảnh báo nào cho anh biết.
  file: `dieu-phoi/scripts/lich.mjs`
  severity: medium
  Đề xuất: known-limits

- **B1 cho phép hàng kế đổi giữa chừng khi thợ đang ở S0 của hàng khác (chưa có contract.md)**
  Người dùng thấy gì: Nếu anh đổi quyết định cho một việc khác khi người làm đang dở một việc, hệ thống có thể chuyển sang việc mới và bỏ rơi việc đang làm dở nếu phiên bị mất.
  file: `dieu-phoi/scripts/lich.mjs`
  severity: medium
  Đề xuất: new-contract

- **Lối rơi khi tiep/ vắng bỏ qua quyết của hàng: mo-dot bước 6 có thể mời chip cho hàng chưa quyết build**
  Người dùng thấy gì: Ngay sau khi mở đợt, trong một khoảng ngắn hệ thống có thể mời mở việc cho một hàng anh chưa chốt là build, và lời mời sai đó không tự được sửa lại.
  file: `dieu-phoi/scripts/lich.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét LỚP «mọi ca đã ký bị đổi phải có dòng sổ» nhưng khoiCa chỉ gán thay đổi của hàm/mảng dùng chung cho MỘT ca liền dưới**
  Người dùng thấy gì: Công cụ kiểm tra việc ghi sổ khi sửa các bài kiểm cũ chỉ bắt được một phần: sửa phần dùng chung có thể làm đổi nhiều bài kiểm khác mà không ai phải ghi tên vào sổ.
  file: `tests/dieu-phoi/sua-truoc-dot-thu.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 — SDT-07 đo commit HEAD bằng git thay vì cây đang kiểm, và trộn với sổ đọc từ cây làm việc**
  Người dùng thấy gì: Khi có sửa đổi chưa được lưu thành commit, bước kiểm tra sổ sẽ không nhìn thấy chúng và vẫn báo ổn, nên chỉ đáng tin sau khi mọi thứ đã commit.
  file: `tests/dieu-phoi/sua-truoc-dot-thu.test.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/8 lỗi rơi vào file không bộ đo nào phủ (_acceptance/dieu-phoi-sua-truoc-dot-thu/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
