# Review findings: phan-du-bo-cuc-moi-vong-ba (round 2)

## Trong hợp đồng

- **CHONG-RONG (AC-6) không thấy dạng `bash -c 'git … archive …'`, nên 3/8 tệp K4-TB nằm ngoài phép đếm và lệnh bỏ pathspec ở đó không làm thước đỏ**
  AC: AC-6
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs:221`
  severity: medium
  source: conventions
  detail: AC-6 đòi «thước đếm mọi lệnh ấy trong các tệp K4-TB và đỏ khi có lệnh không qua». `lenhLichSu` chỉ bắt hai dạng: chữ `'archive'` có nháy đơn (một phần tử argv của execFileSync) và `'show', ${ref}:…`. Ba tệp K4-TB gọi archive trong chuỗi bash: tests/scripts/khuon-loi.test.mjs:538, tests/scripts/khoi-khuon-tren-the-cong.test.mjs:117 và tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs:134. Đo bằng cách chạy `lenhLichSu` trên 8 tệp K4-TB ở HEAD: ba tệp này trả `[]`, năm tệp còn lại trả 1–2 lệnh. Mutant gỡ pathspec khỏi ba dòng đó vẫn cho `[]`, nên CHONG-RONG vẫn in PASS. Bộ tự kiểm TK-LS chỉ thử dạng argv nên không lộ lỗ này. Gợi ý: nhận cả dòng có chữ `archive` trong chuỗi `bash -c`, hoặc đếm theo `git … archive` ở mọi dạng; thêm ca TK-LS dạng bash-string kèm chiều đỏ.

- **CHONG-RONG (AC-6) không thấy lệnh `git archive` viết trong chuỗi bash, nên 3/8 tệp K4-TB không được quét mà dòng PASS vẫn in**
  AC: AC-6
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs:221`
  severity: medium
  source: bugs
  detail: Cùng lỗ với mục trên, quan sát độc lập. `lenhLichSu` chỉ đếm khi dòng chứa đúng `'archive'` có nháy đơn hai bên. Ba tệp (khoi-khuon-tren-the-cong.test.mjs:117, khuon-loi.test.mjs:538, chi-tep-vat-keo-xet-lai.test.mjs:134) để `archive` giữa chuỗi bash. Chỉ 7 lệnh ở 5/8 tệp được đếm. Chốt «phép quét mù» (dòng 396) chỉ đỏ khi tổng bằng 0, không đỏ khi một tệp có lệnh mà bị bỏ sót. khoi-khuon-tren-the-cong là tệp của ca canh K4-TB (KK-1).

- **Hình dạng 5 — CHONG-RONG tuyên đếm «mọi lệnh đọc commit lịch sử» của K4-TB nhưng bộ quét chỉ nhận hai khuôn điểm, mù với `git archive` trong chuỗi `bash -c`**
  AC: AC-6
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs:221`
  severity: high
  source: measurement
  detail: `lenhLichSu` nhận `l.includes("'archive'")` và `'show',\s*` + template `${ref}:…`. Ba tệp K4-TB (khoi-khuon-tren-the-cong.test.mjs:117, khuon-loi.test.mjs:538, chi-tep-vat-keo-xet-lai.test.mjs:134, dòng cuối dùng template `archive ${GOC_SHA}`) ra 0 lệnh, nên CHONG-RONG chỉ thấy 5/8 tệp mà vẫn in PASS (dòng 396–398 chỉ đỏ khi tổng bằng 0 hoặc có lệnh hỏng). Một `bash -c 'git archive <ref> scripts lib'` không qua pathspec vẫn xanh. TK-LS (giu-khoa-3.test.mjs:89–100) không có ca dạng `bash -c`, không có ma trận dạng lệnh viết trước.

- **Hình dạng 3 — RA-LOP chỉ so tên tệp có mặt trong bảng viết tay, trong khi lời hứa là quan hệ nhóm↔mã («mọi tệp nhóm A ghim mốc cố định»)**
  AC: AC-2
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs:414`
  severity: medium
  source: measurement
  detail: `docRaLop` và `lechRaLop` (dòng 107–111, 201–204, 413–416) chỉ so hai chiều tập tên tệp giữa `git grep -l merge-base` và cột một của rang/ra-lop-merge-base.md. Không phép đo nào đọc mã để kiểm chữ A/B/C đúng không. Vế «mọi tệp nhóm A ghim mốc cố định» của AC-2 không có assert; dòng PASS chỉ đếm số A. Bảng xếp hai tệp nhóm A vẫn dùng merge-base làm đường lui và ghi «không sửa»: tests/dieu-phoi/sua-truoc-dot-thu.test.mjs và tests/scripts/can-cu-s1.ca.mjs.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **--sau-gop: chốt «sập rỗng → đỏ» của phanSauGop không bao giờ có hiệu lực với tệp tests/scripts, nên tệp sập ở cả hai bản sao bị xếp TIN «môi trường»**
  Người dùng thấy gì: Một bài kiểm sập hẳn ngay từ đầu ở cả hai phía có thể bị gắn nhãn lỗi môi trường và chỉ cảnh báo, không báo đỏ. Người dùng có thể tưởng bước kiểm sau gộp đã xanh trong khi bài ấy chưa chạy được ca nào.
  Căn cứ: Chỉ làm bước kiểm sau gộp bỏ sót một bài sập, không làm hỏng sản phẩm hay mất dữ liệu; lỗi hiện ra khi chạy lại và sửa sau không đắt.
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — chiều đỏ SAU-GOP-DO của AC-2 là phép đo âm tính đứng một mình: không ghim thông điệp và không đi qua hàm phán `phanSauGop`**
  Người dùng thấy gì: Phép thử xác nhận bước kiểm bắt được lỗi cũ có thể xanh vì một ca đỏ do lý do khác. Người dùng khó chắc rằng bước kiểm vẫn báo đỏ đúng lỗi đã biết.
  Căn cứ: Chỉ làm yếu bằng chứng rằng thước biết báo đỏ; không ảnh hưởng người dùng cuối, và khi lỗi thật xảy ra các chốt khác vẫn đỏ.
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 — một phần câu ghim của ca canh K4-MP và K4-TB là chữ do chính thước sinh, phần còn lại được tìm trên trọn stdout của tệp**
  Người dùng thấy gì: Một ca canh có thể đỏ vì cả bài kiểm sập ở bước dựng, chứ không đúng vì ca cần canh. Người dùng có thể tin hơn mức đáng tin rằng chốt này bắt đúng lỗi.
  Căn cứ: Chỉ làm yếu một chốt phụ, mức nhẹ; không mất dữ liệu và không ảnh hưởng sản phẩm đang chạy.
  file: `_acceptance/phan-du-bo-cuc-moi-vong-ba/rang/giu-khoa-3.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
