## Trong hợp đồng

- **GM3/GM6 và E4 nói lượt chưa tiêm chạy trên «CÙNG một bản chép», nhưng mã chạy hai bản chép khác nhau**
  AC: AC-4
  file: `tests/scripts/duong-nen.test.mjs:454`
  severity: low
  detail: Ở GM3, lượt chưa tiêm chạy trên bản chép tamDir('duong-nen-gm-base-'). Sau đó banDotBien('CONG-CU-GAN-MO', …) dùng cpSync chép `feature-loop` sang một tamDir('duong-nen-td-mut-') MỚI rồi mới tiêm, nên lượt tiêm không chạy trên bản chép vừa được chứng là xanh. Hai chỗ dưới đây vì thế mô tả sai điều mã làm: (1) chú thích GM6 ở dòng 516–517 nói đối chứng dương là «lượt chưa tiêm trên cùng bản chép ở GM3»; (2) expected của E4 trong `_acceptance/nen-cong-cu-gan-mo-thay-the/evals.yaml` và AC-4 trong contract.md nói «chạy HAI lượt trên CÙNG một bản chép `feature-loop`». GM6 thật ra không có lượt chưa tiêm nào trên bản chép của chính nó. Kết luận ĐỎ không bị hỏng, vì mọi ca đột biến đều ghim đúng thông điệp: bullet `THIEU merge-base`, đúng 1 dòng bỏ-tra, `cong_cu: do`. Một bản chép hỏng không sinh ra được các thông điệp này, và quy tắc «ghim đúng thông điệp» của CLAUDE.md vẫn được giữ. Dù vậy, chính hồ sơ đang khai một đối chứng dương không tồn tại, và người chấm đọc E4 sẽ tin một điều mã không làm. Lối viết này thừa hưởng từ NEN-TD5, nơi chú thích «Hai lượt trên CÙNG bản chép» cũng sai y như vậy, nên phải sửa theo lớp: cho banDotBien nhận thư mục đã chép sẵn để tiêm tại chỗ, hoặc sửa lời khai ở cả TD5, GM3, GM6 và E4.
  source: conventions
  rationale (vì sao là AC-4, không phải suy diễn gần giống): AC-4 đòi đúng mệnh đề «lượt CHƯA TIÊM trên cùng bản chép phải XANH trước khi tin chiều đỏ», và finding chỉ ra GM6 tiêm trên một bản chép mới (tamDir td-mut) chưa từng có lượt chưa-tiêm nào chạy trên chính nó — đúng token của AC-4 bị vi phạm, không phải suy diễn gần giống.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

Không có finding nào rơi vào nhóm này trong round này.

## Chưa adversarial-verify (refuter chết)

Không có.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).