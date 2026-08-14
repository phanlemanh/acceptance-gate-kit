---
schema_version: 2
feature_slug: bai-hoc-do-luong-vao-engine
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9745743f61e503abcd7e5c56c3604df0288f1e68
human_signoff:
---

# Trang bằng chứng — bài học đo lường của tuần vào engine

## Verdict: **PASS** — tám eval máy, không eval judgment nào

Hồ sơ này **không có eval judgment**: cả bốn tiêu chí đều đo được bằng máy, và
tất cả đi vào **lưới thường trực** — không một khoá `executors.script.<slug>_rang`
nào. Đó vừa là ràng buộc thi công (quyết định (b) tại Cổng 1, ADR 0011) vừa là
chính bài học đang được ghi.

## Ba P0 đã sửa TRƯỚC khi thi công, không sửa lặng

Gap-probe context-sạch chấm hợp đồng SAU khi owner gạch Cổng 1 và tìm ba lời
khai sai về vật. Người thi công kiểm lại từng cái trên cây, **không loại được
cái nào**, và khai lại hợp đồng trước khi viết dòng code đầu tiên (bảng đầy đủ
ở `contract.md`, mục *Sửa sau Cổng 1*; quyết ghi ở `decisions.jsonl` d-3):

- **AC-1** ghim bốn *mã finding*, **ba mã không tồn tại** (`Hb`·`He`·`RB3-03`).
  Xây đúng như khai thì eval đỏ lượt đầu **vì hợp đồng sai**, không vì vật sai.
  Đổi sang **neo truy được**: bốn chuỗi đã tra thật, mỗi chuỗi đúng **1 hit**.
- **AC-2** ngụ ý bảng và sổ đã khớp. Đo lại: sổ **10** lớp sống, bảng **8** hàng
  — thiếu `do-thuoc` và `khac`. Đây là **phạm vi ẩn**: chiều (a) của bánh cóc đỏ
  ngay khi cắm vào, độc lập với bốn lớp mới. Khai thêm hàng `do-thuoc`, và vì
  `khac` là ô rác bắt-hết không có khuôn chặn trung thực, nó vào **bản khai
  miễn trừ** — kèm **chiều đỏ (c)** để bản khai ấy không thành cửa sau.
- **E3** ghim `P177 DUONG-OK` — chuỗi **đã in ra** trên cây hiện tại, tức eval
  XANH trước khi viết một dòng nào. Đổi sang marker mới `P177 4MUC-OK`.

## Chân chính: bánh cóc HAI CHIỀU bảng lớp lỗi ↔ sổ nguồn

Bảng trong `measure-birth.md` tự tuyên *«Nguồn: known-limits-ledger.tsv (cột
class)»* mà trước hôm nay **không phép đo nào giữ lời tuyên ấy** — đúng lớp
`doc-drift` mà chính bảng ấy dạy. Hai lớp trung tâm của ba vòng chấm `cat-hinh-thuc`
(`doc-drift`, `chuoi-thay-quan-he`) **đã nằm sẵn trên bảng** và bộ răng vẫn dẫm
lên cả hai, ba vòng liền: bảng không răng thì nó là trang trí.

Nay `P177` in `LOP-BANG: 13/13 khop hai chieu (1 mien tru)` và đỏ ở ba chiều
riêng biệt cộng một chiều fail-loud.

## Phá vật thật — đối chứng dương trước, rồi bảy lượt phá, bảy thông điệp riêng

Bản sao cây thật, `P177`/`P179` **XANH trước** (đối chứng dương), rồi phá từng
thứ một trên **vật được giao**, chạy lại **chính** hàm mà đường xanh gọi:

| Lượt phá vật thật | Kết quả |
|---|---|
| Xoá hàng `do-thuoc` khỏi bảng | ĐỎ `LOP-BANG: so co do-thuoc ma bang thieu` |
| Thêm hàng lớp bịa vào bảng | ĐỎ `LOP-BANG: bang co lop-bia-dat ma so khong` |
| Đổi lớp được miễn trừ sang tên không còn dòng sống | ĐỎ `LOP-BANG: mien tru … khong con dong song` |
| Xoá cặp mốc `MEASURE-BIRTH-CLASS-TABLE` | ĐỎ `LOP-BANG: phep rut hong` |
| Đổi status `tap-so-rong` sang `chet` trong sổ | ĐỎ `LOP-BANG: bang co tap-so-rong ma so khong` |
| Xoá mục thứ tư khỏi khối mốc | ĐỎ `references thieu muc: Phủ-định-phổ-quát` |
| Gỡ một neo nội dung, GIỮ tên mục | ĐỎ `references thieu neo noi dung muc 4: …` |
| Đổi «đủ BỐN mục» → «đủ BA mục» ở văn dẫn | ĐỎ `so muc trong khoi la 4 ma van dan khong ghi …` |
| Đổi neo của một lớp sang mã không có thật | ĐỎ `LOP-MOI: neo cua pinned-khong-dem-duoc KHONG tim thay …` |
| Hai lớp dùng CHUNG một neo | ĐỎ `LOP-MOI: neo trung` |

Ba thông điệp của AC-3 được assert là **khác nhau** ngay trong thân ca: gỡ neo
và xoá mục ra cùng một màu thì chân không phân biệt được hai nguyên nhân.

## Hai lời khai bị hạ xuống cho khớp vật

- **AC-4 từng tuyên «bốn đẳng thức số ca».** Chỉ `hooks` và `scripts` in số ca
  của mình; `plugins` và `workflows` không. Bản khai bốn con số từng sống trong
  khối `SO-CA-KY-VONG` của `luu-kho-codex-va-nghi-le-design` — **răng-hồ-sơ, và
  đã chết khi merge**. Đó chính là hình dạng mà quyết định (b) vừa gọi tên, và
  nó vẫn đang hở. Đẳng thức 146 của `plugins` nay khai thẳng là **số
  người-đối-chiếu kèm lệnh tái lập**, không phải răng máy; lỗ ghi vào sổ
  known-limits (`bai-hoc-do-luong-vao-engine#1`) chứ không vá vội.
- **E5 từng ghim `"0 failed"`.** Chuỗi ấy khớp cả dòng tổng kết CON giữa suite
  (`Results: 3 passed, 0 failed`) nên không phân biệt được «cả suite xanh» với
  «một khối con xanh» — lớp `chuoi-thay-quan-he`. Nay ghim đẳng thức thật
  `Results: 686 passed, 0 failed` (686 là số đã chốt từ hồ sơ lưu-kho, không
  phải số bịa sau khi nhìn kết quả).

## Chỗ hở CÒN LẠI, khai thẳng — bánh cóc này không chạm

`_acceptance/cat-hinh-thuc/review-findings.md` có **0** dòng `Đề xuất:
known-limits` — kênh capture mà `P179` đếm **chưa hề chạy** cho hồ sơ 1a. Nên
có hai chỗ hở, không một: kênh `findings → sổ` (chưa chạy) và mối `sổ → bảng`
(không răng). Hồ sơ này đóng mối thứ hai. Lần sau ba vòng đối kháng lại sinh
lớp mới, findings vẫn không ghi `Đề xuất:`, sổ vẫn thiếu, bảng vẫn khớp sổ →
**lưới xanh trên một cái hố**. Vá được, nhưng phải sửa `review-findings.md` của
một hồ sơ **đã ký và đã merge** — viết lại sử liệu sau chữ ký — nên nó thuộc một
hồ sơ riêng, đã khai ở *Out of scope* và trong hạt giống.

## Đẳng thức số ca — khai TRƯỚC khi thi công, giữ nguyên

`plugins` **146** · `scripts` **686** · `hooks` **54** · `workflows` all-passed.
Răng mới đi vào **THÂN** ca `P177`/`P179` sẵn có (TRIM/EXTEND), không mọc ca
mới. Chạy dưới người dùng **không-root** — dưới root, `P123`/`P129` (dùng
`chmod 000`) đỏ giả vì root đọc xuyên quyền.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-4 | test | PASS |
| E6 | AC-4 | test | PASS |
| E7 | AC-4 | test | PASS |
| E8 | AC-4 | test | PASS |

## Evidence

- eval: E1
  run_id: bai-hoc-do-luong-vao-engine-r1-6f818fea
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-14T05:07:45.538674Z
  output: |
    LOP-MOI: 4/4 lop co dong SONG trong so + neo truy duoc

- eval: E2
  run_id: bai-hoc-do-luong-vao-engine-r1-12d86c61
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-14T05:07:45.539976Z
  output: |
    LOP-BANG: 13/13 khop hai chieu (1 mien tru)

- eval: E3
  run_id: bai-hoc-do-luong-vao-engine-r1-0b1cc9a0
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-14T05:07:45.540866Z
  output: |
    P177 4MUC-OK (4 muc + 3 neo noi dung muc 4 + buoc so van-dan<->khoi-moc)

- eval: E4
  run_id: bai-hoc-do-luong-vao-engine-r1-f61b9156
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.product_map
  verified_at: 2026-08-14T05:07:45.541259Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E5
  run_id: bai-hoc-do-luong-vao-engine-r1-7142ffcc
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-08-14T05:09:58.068585Z
  output: |
    Results: 686 passed, 0 failed

- eval: E6
  run_id: bai-hoc-do-luong-vao-engine-r1-a3dd6f83
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-08-14T05:07:45.543362Z
  output: |
    Results: 54 passed, 0 failed

- eval: E7
  run_id: bai-hoc-do-luong-vao-engine-r1-99162f0c
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-08-14T05:07:45.544040Z
  output: |
    Results: all workflow tests passed

- eval: E8
  run_id: bai-hoc-do-luong-vao-engine-r1-7930ad36
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-08-14T05:07:45.544896Z
  output: |
    Results: all plugin tests passed

## Analyst

`baseline: n-a` cho cả tám eval: bốn tiêu chí đều đo **vật do chính hồ sơ này
sinh ra** (bốn dòng sổ mới, mục thứ tư, cặp mốc bảng, năm hàng bảng). Chạy trên
cây diffBase thì `P177`/`P179` xanh vì chúng chưa mang chân mới — con số ấy nói
về ca cũ, không nói eval mới có phân biệt được hay không. Sức phân biệt của
chúng được chứng bằng **mười lượt phá vật thật** ở bảng trên, mỗi lượt qua chính
hàm mà đường xanh gọi, mỗi lượt ghim một thông điệp riêng — đó là đối chứng
mạnh hơn baseline A/B cho lớp phép đo này.
