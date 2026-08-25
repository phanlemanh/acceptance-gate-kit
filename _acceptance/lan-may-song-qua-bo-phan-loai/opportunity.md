---
schema_version: 1
slug: lan-may-song-qua-bo-phan-loai
feature: làn máy sống qua bộ phân loại — lệnh kiểm cố định thôi phải xin phép từng lần (A) + nghi thức biết đường thoái hoá tuần tự khi fan-out nghẽn (B)
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:                     # build | iterate | park | kill — người ký Cổng Đáng điền
decided_by:
decided_at:
prototype:
  base_commit:
  disposition:
---

## Vấn đề & ai gặp

Ba tuần qua, ~15 vòng nghiệm thu máy trên 5 hồ sơ chết vì bộ phân loại an toàn
bị giới hạn nhịp — ≥28 triệu token chi cho những vòng không sinh một dòng bằng
chứng nào, và thời gian làm-xong → quyết-được của owner bị cộng thêm hàng giờ
chờ + chạy lại. Cơ chế: kho không cho-phép-sẵn lệnh nào, nên mọi lệnh của mọi
agent đều phải hỏi; tung 26–30 agent là một cơn bão request. Lời giải cho một
nửa lớp đã được chứng HAI lần từ 21/08 (đi tuần tự thay vì tung bầy) nhưng chỉ
nằm trong trí nhớ, chưa vào nghi thức — nên phiên 25/08 vẫn trả học phí lại.
Người trả giá: owner và làn nghiệm thu máy. Bằng chứng + sổ cái đầy đủ:
`docs/findings/2026-08-25-retro-classifier-va-nghi-thuc-khong-hoc.md`; đề bài:
`docs/plans/2026-08-25-hat-giong-lan-may-song-qua-bo-phan-loai.md`.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Luật cho-phép-sẵn trong settings áp cho CẢ Bash của subagent | A vô hiệu, chỉ còn B | 1 rule + 1 subagent chạy 1 lệnh suite, xem còn bị hỏi không — làm NGAY đầu thi công | Chưa thử |
| 2 | Đường tuần tự thông khi fan-out nghẽn | B vô hiệu | tiền lệ chip A r4 · chip B r1 | ĐÃ CHỨNG 2/2 |
| 3 | Bash ngoài-suite của làn đủ thưa sau khi A gỡ phần lệnh kiểm | giảm tần suất, chưa hết lớp | đếm lệnh ngoài-suite trong 1 transcript vòng | Chưa thử |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: sau khi ship, vòng S4 còn chết vì bộ phân loại
  không, và khi vẫn nghẽn thì có thoát trong MỘT lượt không?
- Kết quả nào là SỐNG: trong 5 vòng S4 kế tiếp trên kho kit (hoặc tới 30/09):
  0 vòng BLOCKED vì bộ phân loại trên lệnh đã cho-phép-sẵn; không còn chuỗi ≥2
  lượt fan-out BLOCKED liên tiếp — lượt kế sau lượt chặn là đường tuần tự và
  thông.
- Kết quả nào là CHẾT: vẫn có chuỗi 2 lượt fan-out chặn liên tiếp, HOẶC danh
  sách cho-phép gây một sự cố thật.
- Số từ: run-log + Iterations của evidence-report — nguồn có sẵn, không cần
  đường đo mới.
- Timebox: 2026-09-30 → không đủ vòng để đo thì `park` với số đã có.

## Kết quả prototype

Chưa có prototype riêng — nửa B đã có hai lần chạy thật thay vai prototype:
chip A vòng 4 (đổi sang tuần tự → thông ngay sau ba vòng chặn) và chip B vòng
1 (tuần tự từ đầu → 0 chặn). Nửa A chưa thử; giả định 1 là phép thử mở màn.

## Nguồn ngoài & phạm vi kế thừa

Không vay vật liệu ngoài — toàn bộ là config của chính kho + một đoạn nghi
thức + hai tiền lệ nội bộ đã ghi sổ.
