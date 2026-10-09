# Review findings: doc-ghi-troi-mang-sang-run-id (round 3)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **NHAN_LUOT_RE is a hand copy of the OOC_TITLE_RE label group, kept outside the one-source marker**
  Người dùng thấy gì: Hôm nay thẻ duyệt Cổng 2 in đúng mọi dạng nhãn đã khai. Nhưng nếu sau này ai đó mở rộng cách viết nhãn lượt ở một nơi mà quên nơi kia, một mục ngoài hợp đồng mang sang có thể hiện hai lần trên thẻ.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: known-limits

- **The empty-run_id note unquotes differently from the readers it is meant to cover**
  Người dùng thấy gì: Nếu một báo cáo ghi mã chạy rỗng bằng cách bọc nháy lồng nhau (hiếm), người duyệt sẽ không thấy ghi chú cảnh báo và báo cáo vẫn qua như bình thường.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

- **Carried eval bị bỏ vì run_id rỗng ở workflow nhưng carry-plan đã chốt cặp atomic: phá luật AC-9 cross-layer**
  Người dùng thấy gì: Với tiêu chí được chấm bằng hai kiểm tra đi cặp, nếu một kiểm tra bị chạy lại vì mã chạy rỗng thì kiểm tra còn lại vẫn dùng kết quả cũ. Tiêu chí đó có thể được chấm trên hai lượt không cùng thời điểm.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: medium
  Đề xuất: new-contract

- **Bộ dò run_id rỗng dùng unquoteScalar một tầng, lệch với hai bộ đọc bỏ nháy tham lam: `run_id: '""'` bị bỏ qua mà không có ghi chú**
  Người dùng thấy gì: Một dạng viết mã chạy rỗng hiếm gặp vẫn lọt mà không có ghi chú cảnh báo, nên người duyệt không biết khối đó bị bỏ qua khi đối chiếu nhật ký chạy.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

- **Eval mang sang: runId chỉ được chuẩn hoá để kiểm, giá trị thô có nháy hoặc khoảng trắng vẫn được ghi vào run-log và báo cáo**
  Người dùng thấy gì: Với kết quả cũ mang sang mà mã chạy còn dính dấu nháy, nhật ký lượt mới ghi lại đúng dạng dính nháy, nên lần đối chiếu sau có thể báo không tìm thấy mã đó dù kết quả vẫn thật.
  file: `feature-loop/workflows/acceptance-verify.js`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: helper ridHopLe được áp ở 3 chỗ ghi, nhưng ma trận chỉ đo 2 chỗ; đường SUITE (ridTho) không có ca nào**
  Người dùng thấy gì: Nếu ai đó vô tình hoàn lại cách ghi cũ cho dòng kiểm tra chung của cả bộ, bộ kiểm thử hiện tại vẫn xanh và mã chạy rỗng có thể quay lại ở dòng đó mà không ai hay.
  file: `tests/workflows/doc-ghi-troi.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2: báo cáo của DR2/DR4 viết tay theo khuôn bên đọc, trong khi bên viết có khuôn mẫu marker để rút**
  Người dùng thấy gì: Nếu khuôn báo cáo đổi hình, bài kiểm tra cho mã chạy rỗng vẫn xanh trong khi tính năng thật đã mù, nên cảnh báo có thể im lặng mất đi mà không ai thấy.
  file: `tests/workflows/doc-ghi-troi.test.mjs`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
