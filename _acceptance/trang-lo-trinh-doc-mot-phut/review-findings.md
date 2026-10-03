# Review findings: trang-lo-trinh-doc-mot-phut (round 3)

## Trong hợp đồng

- **Milestone strip sorts dates as strings, while the in-page script and the start card read the same dates differently**
  AC: AC-5
  file: `scripts/lo-trinh.mjs:469`
  severity: low
  source: bugs
  detail: `mucLoTrinh` sorts milestones with `chuoi(a.ngay).localeCompare(chuoi(b.ngay))`. The inline SCRIPT, however, accepts any three-part date (`split('-')` + `Date.UTC`), so a date without zero padding such as `2026-10-5` counts as valid but sorts after `2026-10-20`. Reproduced in the scratchpad: `veTrang` on a repo with milestones `{ngay:'2026-10-5'}` and `{ngay:'2026-10-20'}` emits `data-ngay` in the order `["2026-10-20","2026-10-5"]`. The script takes the first future `li` in DOM order as the next milestone, so on 03/10 the card's «Mốc kế tiếp» cell shows 20/10 («còn 17 ngày») instead of the nearer 05/10, and the strip is out of order. The card and the start card also disagree: `hangTre` only accepts `^\d{4}-\d{2}-\d{2}$`, so it returns `[]` for 2026-10-10 (verified), while the page script marks that milestone «đã qua — còn việc chưa giao». Fix at the right layer: normalise or validate dates with ONE rule shared by the sort, the `data-ngay` attribute and `hangTre`. For example, treat a date that fails the ISO regex as unreadable (the script then counts it as `hong`, the same handling a month-only date already gets), or zero-pad before sorting. No current LT-94, LTT-moc or LT-95 case uses an unpadded date, so this gap has no red direction.
  rationale: AC-5 đòi dải mốc sắp theo ngày và mốc kế tiếp là mốc sớm nhất có ngày từ hôm nay; với ngày không đệm số 0 mà chính trang coi là đọc được, thứ tự sai và ô Mốc kế tiếp hiện nhầm mốc xa hơn.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Đường dẫn khai ở các eval bỏ sót bộ sinh kho thử, các tệp fixture và bộ sinh trang mẫu mà mọi ca đo đều nạp, nên một lượt sửa chỉ chạm các tệp này sẽ mang màu xanh cũ sang mà không chạy lại**
  Người dùng thấy gì: Nếu sau này có người chỉ sửa dữ liệu mẫu dùng để kiểm trang lộ trình, các bài kiểm sẽ không tự chạy lại mà vẫn hiện màu xanh của lần trước. Trang đưa cho người dùng không sai, nhưng độ tin của màu xanh bị giảm trong trường hợp đó.
  file: `_acceptance/trang-lo-trinh-doc-mot-phut/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình, không đối chứng dương): LT-100 so JSON quét start giữa 2.21.0 và cây đang kiểm mà không có đối chứng dương, và chiều đỏ không bao giờ chạm tới phép so này**
  Người dùng thấy gì: Bài kiểm xác nhận phần phân tích kế hoạch không đổi so với bản trước có thể báo xanh dù cả hai bên đều không ra dữ liệu gì. Trang vẫn đúng, nhưng lời bảo đảm không đổi so với bản trước chưa được chứng minh chắc ở nhánh này.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): LT-92 chỉ đo «cột Vì sao/Bật khi VẮNG», không có ca đối chứng nơi cột có dữ liệu thì phải HIỆN**
  Người dùng thấy gì: Bảng việc có thể mất cột Vì sao hoặc Bật khi ngay cả khi có dữ liệu mà bài kiểm vẫn xanh. Hiện chưa thấy trang nào sai, nhưng nếu về sau lỗi này xảy ra thì sẽ không bị báo.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (kỳ vọng rút từ chính writer, tự khép vòng): LT-08 lấy kỳ vọng chữ lỗi trên trang bằng `LT.dichLoi(ly)`, tức chính hàm dịch của bộ vẽ**
  Người dùng thấy gì: Ba loại thông báo lỗi đọc kế hoạch có thể quay lại dùng chữ kỹ thuật mà bài kiểm vẫn xanh. Người dùng chỉ gặp điều này nếu có ai làm hỏng câu dịch lỗi trong tương lai.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính vô hiệu đúng ngày chạy bằng chứng): LT-94 miễn đúng hai chuỗi ngày 2026-10-03, nên vào ngày 03/10 vế «trang không chứa ngày chạy» không assert gì**
  Người dùng thấy gì: Vào đúng ngày 03/10, một kiểm tra phụ rằng trang không in ngày hôm nay không kiểm được gì. Việc này đã có bài kiểm khác phủ đầy đủ nên không ảnh hưởng người dùng.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 (không ghim thông điệp, không có bản lành trong cùng ca): LT-73-khong-truong-do xanh khi có BẤT KỲ khác biệt nào giữa hai chuỗi JSON**
  Người dùng thấy gì: Một bài kiểm cũ về việc đổi luật chọn việc kế tiếp có thể xanh vì một thay đổi không đúng chỗ. Trang cho người dùng không bị ảnh hưởng, chỉ là bài kiểm này kém chặt hơn các bài mới.
  file: `tests/scripts/lo-trinh.test.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
