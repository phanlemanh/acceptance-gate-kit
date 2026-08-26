---
schema_version: 2
feature_slug: design-pass-nac-khong-dong-bo
verdict: PASS
failed_evals: []
reason:
verified_by: verify doc lap tuan tu (phien tuoi, lenh chay lan luot) + cac phien hoi dong doc lap
enforcement_mode: strict
bypass_used: false
verified_commit: 8fabc8c9a80696244129be9da7085570df6661ad
human_signoff: Manh Phan 2026-08-26 — ky voi 6 gioi han da khai; gioi han 1 (khong chung nghi thuc chay tot voi nguoi that) chuyen sang Cong Gia tri doc bang van thu o kho tieu thu
---

# Evidence Report: design-pass-nac-khong-dong-bo

Vòng 5 hồ sơ này DỪNG với kết luận BỊ CHẶN — bộ phân loại an toàn chặn ba lệnh, một
trong đó phủ tiêu chí duy nhất còn thiếu bằng chứng. Phương thuốc ghi thẳng trong hồ
sơ khi ấy: **chạy lại, không phải sửa mã.** Lượt này đi **đường verify độc lập, lệnh
chạy TUẦN TỰ** — chính lời giải mà hồ sơ `lan-may-song-qua-bo-phan-loai` vừa giao — và
phép đo từng bị chặn chạy sạch.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E11 | AC-11 | test | PASS |
| E12 | AC-13 | test | PASS |
| E15 | AC-15 | test | PASS |
| E13 | AC-12 | script | PASS |
| E14 | AC-14 | judgment | PASS |

## Evidence

- eval: E1
  run_id: design-pass-nac-khong-dong-bo-E1-r10
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T07:31:11Z
  cmd: bash tests/plugins/run-tests.sh
  baseline: n-a
  output: |
    PASS: [DP1] thang bon nac, mot cho duy nhat khai danh sach

- eval: E8
  run_id: design-pass-nac-khong-dong-bo-E8-r10
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T07:31:11Z
  cmd: bash tests/plugins/run-tests.sh
  baseline: n-a
  output: |
    PASS: [DP8] khuon so phien giu ba khoa moi, khong liet lai danh sach nac

- eval: E9
  run_id: design-pass-nac-khong-dong-bo-E9-r10
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T07:31:11Z
  cmd: bash tests/plugins/run-tests.sh
  baseline: n-a
  output: |
    PASS: [DP9] khop vong 4 nac khuon->the

- eval: E10
  run_id: design-pass-nac-khong-dong-bo-E10-r10
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T07:31:11Z
  cmd: bash tests/plugins/run-tests.sh
  baseline: n-a
  output: |
    PASS: [DP10] nhanh doi-ho-so + luoi thoat-chuoi CA HAI duong ra the + quan he THOAT-O-BIEN-RENDER tren ma

- eval: E11
  run_id: design-pass-nac-khong-dong-bo-E11-r10
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T07:31:11Z
  cmd: bash tests/plugins/run-tests.sh
  baseline: n-a
  output: |
    PASS: [DP11] moi site dung nguyen van + tong ban chep tron glob khop bang khai

- eval: E12
  run_id: design-pass-nac-khong-dong-bo-E12-r10
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T07:31:11Z
  cmd: bash tests/plugins/run-tests.sh
  baseline: n-a
  output: |
    PASS: [DP12] hai o cam neu du o ca hai file

- eval: E15
  run_id: design-pass-nac-khong-dong-bo-E15-r10
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T07:31:11Z
  cmd: bash tests/plugins/run-tests.sh
  baseline: n-a
  output: |
    PASS: [DP13] khong so phien: the dung duoc, khoi vang, khong co nac, khong nhan la

- eval: E13
  run_id: design-pass-nac-khong-dong-bo-E13-r10
  exit_code: 0
  verifier: config:executors.script.dpnkdb_cau_chet
  verified_at: 2026-08-26T07:31:11Z
  cmd: bash _acceptance/design-pass-nac-khong-dong-bo/rang-cau-chet.sh
  baseline: n-a
  output: |
    cau-chet OK (moc c444c512: moi kim dung so khai · cay dang kiem: 0 · chan tiem: bat duoc)

- eval: E14
  run_id: design-pass-nac-khong-dong-bo-E14-r10
  judged_by: cac phien hoi dong DOC LAP, moi phien mot luot, chi doc file
  verdict: PASS
  verified_at: 2026-08-26T07:31:11Z
  baseline: n-a
  output: |
    Hoi dong doi chieu bang MUTANT-MATRIX voi so mutant dem duoc trong ma: khop tung o.
    Moi mutant di qua CHINH ham cua chieu xanh, fixture do code sinh rut tu khuon that,
    thong diep do ghim ten ve/khoa/site. Luot cuoi soi rieng luoi quan he moi: dem duoc
    9 cho day co va 12 lan dung dinh danh, phep ke toan la dang thuc that, moi sai lech
    deu lech ve DO chu khong ve xanh.
  note: |
    KHAI THANG: hoi dong o day KHONG phai bay 3-lens cua engine ma la cac phien doc lap,
    vi lan may di duong tuan tu. Mot phien hoi dong o vong 6 suy TU MA rang mot nhanh cua
    rang ho so da chet; nguoi van hanh CHAY THAT thi nhanh do SONG — bao cao nay khong
    lay ket luan do. Suy sai ton hon khong neu.

## Known limits

1. **Kit KHÔNG có giao diện web** nên ô này không tự dùng được nghi thức nó đang sửa.
   Bằng chứng máy ở đây chứng minh LUẬT vào đúng chỗ và BỘ ĐỌC đọc đúng — **không**
   chứng minh nghi thức chạy tốt với người thật. Chứng minh đó là ván thử kế ở kho tiêu
   thụ, và đó chính là thứ Cổng Giá trị đọc.
2. **Một nhánh cờ ngoài tầm lưới thoát chuỗi:** cờ «nấc phản ứng không nhận diện được»
   theo cấu tạo không bao giờ nhận giá trị mang ngoặc nhọn, nên phép thoát chuỗi ở đó là
   phòng thủ chiều sâu KHÔNG có phép đo canh. Bốn vòng cho thấy mọi phép quét tĩnh dựng
   để phủ nốt chỗ này đều tự nó thành thước khớp-mutant-của-chính-nó; owner quyết TRỪ.
3. **Phép kế toán định danh mảng cờ** bắt được ca mảng bị mang đi nơi khác hay mất một
   người dùng, **không** bắt được ca dựng cờ ở module khác rồi hoà lại bằng chính một
   lời gọi đẩy — đẳng thức vẫn cân. Khai thẳng thay vì hứa rộng.
4. **Trục con trỏ nhúng chỉ có chiều đỏ trên MÃ**, không có chiều đỏ hành vi: hồ sơ thử
   dùng cấu hình trơn nên cờ ấy không bắn. Thoát chuỗi đặt ở CHỖ GÁN của trục đó không
   đường đo nào bắt.
5. **Giới hạn cấu trúc của tự-chấm:** thước do máy viết và phép thử ngược chứng nó cũng
   do máy viết — cùng một trí tưởng tượng, nên hình dạng nằm ngoài nó thì cả hai đều
   không thấy. Làn rà soát độc lập lần nào cũng tìm ra hình dạng đó. Số lỗi BỘ ĐO có thể
   không về 0; thứ đáng đọc ở cổng là lỗi ở SẢN PHẨM.
6. **Không có đối chứng đỏ ở mức eval** (chạy bộ ca trên cây chưa có tính năng): hồ sơ
   này sửa một nghi thức đã tồn tại, không thêm bề mặt mới, nên bản gốc không có trạng
   thái «chưa có tính năng» sạch để so.

## Ngoài hợp đồng

(rỗng — các phát hiện ngoài hợp đồng của những vòng trước đã đóng)

## Analyst

Mọi eval đều `baseline: n-a` — xem giới hạn 6. Bù lại, mỗi phép đo đều có phá thử trên
VẬT THẬT trong vòng cuối: gỡ thoát chuỗi ở một chỗ đẩy KHÔNG mutant nào nhắm thì lưới
đỏ và **gọi đúng tên định danh** bị thoát; thêm một lần dùng định danh ngoài bốn ngữ
cảnh thì phép kế toán đỏ và nêu số thực cạnh số chờ đợi.

## Variance

Không có eval ngẫu nhiên. Sáu lượt làn máy tuần tự liên tiếp cho cùng kết quả.

## Iterations

10 vòng. Vòng 5 dừng vì hạ tầng; vòng 6 nối lại sau khi làn máy có lời giải. Bốn vòng
cuối tập trung vào MỘT lưới, và nó bị từ chối ba lần vì cùng một lớp: phạm vi đo hẹp
hơn phạm vi khai. Vòng 9 đổi khuôn từ LẤY MẪU sang QUAN HỆ ĐÓNG; vòng 10 hoàn thiện và
kết bằng một lượt **TRỪ CHỮ** thay vì thêm thước.

## Gate 2 checklist (human)

- [ ] Sáu giới hạn đã khai — chấp nhận được chứ?
- [ ] Giới hạn 1 là cái đắt nhất: hồ sơ **không** chứng minh nghi thức chạy tốt với
      người thật. Bằng chứng đó là ván thử kế ở kho tiêu thụ.
- [ ] Mọi eval `baseline: n-a` — chấp nhận lý do ở giới hạn 6 chứ?
- [ ] Hội đồng là các phiên độc lập, không phải bầy 3-lens của engine — chấp nhận chứ?
