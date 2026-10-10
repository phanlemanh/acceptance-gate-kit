## Trong hợp đồng

- **Hình dạng 4 (assertion âm-tính-một-mình, hằng-đúng): vế «không sinh tệp» của MN2 không bao giờ đỏ được**
  file: `tests/scripts/evals-sat-le.test.mjs:214`
  severity: medium
  AC: AC-9
  detail: MN2 chạy `L.chayS4(CHAY.thut4.d, { agRoot: dot })` trên kho mà BC1 đã chạy trước đó với rc 0, nên `args.json` đã nằm sẵn trong thư mục ấy. s4-args không xoá tệp đầu ra cũ (`die` chỉ in rồi `process.exit(2)`, cả tệp không có `unlinkSync`/`rmSync`). Vì vậy `coTep` luôn true. Ca né chỗ đó bằng cách ghép thêm `&& r.args`, nhưng `chayS4` chỉ parse `args` khi `r.status === 0`. Mà khi `rc === 2` thì `args` luôn là null, nên mệnh đề `r.coTep && r.args` luôn false. Kết quả: vế «không sinh tệp» mà AC-9 và E10 hứa không có cách nào phân biệt «s4-args có ghi tệp» với «không ghi». Nếu một bản s4-args ghi args.json trước rồi mới thoát 2, ca vẫn xanh. Cần một thư mục kho mới, hoặc xoá/ghi dấu thời gian tệp ra trước lượt chạy, rồi kiểm `!existsSync(out)`.
  rationale: AC-9 nêu rõ khi bản lib không có evalListsOf thì thoát 2 và «không sinh tệp»; ca kiểm vế này không thể đỏ nên vế đó của AC chưa được chứng.
  source: measurement

- **Hình dạng 5 (tuyên ma trận viết trước nhưng số đếm suy từ chính vòng lặp): «ma trận hụt» của BC1 là hằng-đúng**
  file: `tests/scripts/evals-sat-le.test.mjs:82`
  severity: medium
  AC: AC-1
  detail: BC1 tính `can` bằng ba vòng lồng `for cach of L.CACH / for tc of L.MO_HINH / for k of truongCua(tc)`, rồi tính `so` bằng đúng ba vòng lồng ấy trên cùng `L.CACH`, `L.MO_HINH`, `truongCua`. Mọi nhánh rẽ khác đều `return` sớm. Vậy khi chạy tới `if (so !== can)` thì `so === can` luôn đúng, và thông điệp «ma trận hụt» không bao giờ in ra được. AC-1 và E1 hứa «ma trận viết trước… số so = số phần tử ma trận (khác → ĐỎ)». Trong ca này không có con số nào được gõ tay trước theo mẫu P105 (như `BG8_MUTANTS`/`BG4_ASSERTS` của bo-giai-nhay: «GÕ TAY, không suy từ bảng… suy TỪ chính mảng thì phép so dưới là hằng-đúng»). Nếu bỏ một tiêu chí khỏi `MO_HINH`, một trường khỏi `ds`, hoặc một cách khỏi `CACH`, ma trận co lại mà BC1 vẫn xanh.
  rationale: AC-1 đòi ma trận viết trước và số so bằng số phần tử ma trận, khác thì đỏ «ma trận hụt»; ca hiện suy cả hai vế từ cùng vòng lặp nên không bao giờ đỏ.
  source: measurement

- **Hình dạng 3 (assert «chuỗi có mặt» thay cho quan hệ «thật sự gọi»): lưới LB1 coi tệp là «đọc qua lib» khi tên hàm chỉ xuất hiện ở đâu đó trong tệp**
  file: `tests/scripts/evals-sat-le.test.mjs:334`
  severity: low
  AC: AC-11
  detail: AC-11 và E11 hứa: tệp kết luận «đọc danh sách» phải «thật sự gọi evalListsOf hoặc evalPathsOf». Nhưng `luoiBenDoc` chỉ kiểm `/evalListsOf|evalPathsOf|danhSachKhongDoc/.test(<toàn văn tệp>)`, tức là kiểm tên có mặt ở bất kỳ đâu, kể cả chú thích, chuỗi thông báo hay bảng tên hàm bắt buộc. Nó còn nhận thêm `danhSachKhongDoc`, hàm mà hợp đồng không liệt kê. Ví dụ cụ thể: hoàn nguyên carry-plan.mjs về biểu thức `paths:` tự viết (gỡ lời gọi `R.evalListsOf(text, ['paths'])` ở dòng 113) thì tệp vẫn chứa 'evalListsOf' ở danh sách kiểm hàm dòng 44 và chú thích dòng 100, nên LB1 vẫn xanh. repin-lane.mjs cũng chỉ có 'evalPathsOf' trong bảng nhu cầu dòng 135 và 504 là đủ qua. Với s4-args và carry-plan, MN1 phần nào bù được; với repin-lane và gate-card thì «đi qua lib» chỉ được đo bằng sự có mặt của từ.
  rationale: AC-11 đòi mọi tệp kết luận «đọc danh sách qua evalListsOf» phải thật sự gọi evalListsOf hoặc evalPathsOf; lưới chỉ kiểm tên có mặt trong văn bản.
  source: measurement

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **A multi-line flow list is flagged as "khai mà rỗng" on both gate cards and at S4**
  Người dùng thấy gì: Nếu một hồ sơ viết danh sách tệp bằng ngoặc vuông trải nhiều dòng, thẻ và lượt chấm vẫn đọc như trước nhưng báo cờ vàng rằng danh sách «rỗng», dù thật ra có mục. Người viết có thể sửa nhầm chỗ, nhưng kết quả chấm không đổi.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

- **args.canhBaoDanhSach is written but nothing reads it, and it is missing from the workflow's args header**
  Người dùng thấy gì: Cảnh báo về danh sách không đọc được hiện chỉ đến người duyệt qua thẻ ở hai cổng, chưa đi vào báo cáo bằng chứng của lượt chấm. Người duyệt vẫn thấy cờ, chỉ thiếu một chỗ nhắc nữa.
  file: `feature-loop/scripts/s4-args.mjs`
  severity: low
  Đề xuất: known-limits

- **evalListsOf treats a `- id:` line inside a block scalar as a new eval, so the real eval's list fields are silently dropped (regression in s4-args)**
  Người dùng thấy gì: Nếu một tiêu chí có đoạn văn nhiều dòng mà bên trong có dòng trông như khai báo tiêu chí mới, các danh sách đầu vào và vùng tệp của tiêu chí thật sẽ bị bỏ qua mà không có cảnh báo. Hiện chưa kho nào viết như vậy nên chưa ai bị ảnh hưởng.
  file: `lib/evidence-core.cjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
