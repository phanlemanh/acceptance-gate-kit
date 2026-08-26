---
schema_version: 2
feature_slug: lan-may-song-qua-bo-phan-loai
verdict: PASS
failed_evals: []
reason:
verified_by: verify doc lap tuan tu (phien tuoi, lenh chay lan luot) + hai phien hoi dong doc lap
enforcement_mode: strict
bypass_used: false
verified_commit: c8d4a0f8d6bdc627643cbdaeb39948a7c0664f0c
human_signoff:
---

# Evidence Report: lan-may-song-qua-bo-phan-loai

Lượt nghiệm thu này đi **đường verify độc lập, lệnh chạy TUẦN TỰ**, không đi bầy
fan-out — vì vòng 3 bị bộ phân loại an toàn chặn 3/5 lệnh và đó chính là lớp lỗi ô
này giao lời giải. Đo được: bảy lượt tuần tự liên tiếp, **0 lệnh bị chặn**; lượt
fan-out duy nhất, **3 lệnh bị chặn và cả vòng hỏng**.

| Eval | Criterion | Executor | Verdict | Baseline |
|---|---|---|---|---|
| E1 | AC-1 | test | PASS | red |
| E2 | AC-2 | test | PASS | red |
| E3 | AC-3 | script | PASS | green |
| E4 | AC-4 | test | PASS | red |
| E5 | AC-5 | test | PASS | red |
| E6 | AC-6 | test | PASS | red |
| E8 | AC-8 | test | PASS | red |
| E7 | AC-7 | judgment | PASS | n-a |

## Evidence

- eval: E1
  run_id: lan-may-song-qua-bo-phan-loai-E1-r10
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T02:50:52Z
  cmd: bash tests/plugins/run-tests.sh
  baseline: red
  output: |
    PASS: [LM1] song anh permissions.allow <-> feature_loop.suite_keys — doi chung duong xanh + 7 mutant do dung ve
  note: |
    Quan hệ song ánh giữa luật cho-phép và danh sách lệnh kiểm khai trong cấu hình: bao hàm hai chiều CỘNG đếm bội, vì bao hàm hai chiều một mình mới chỉ là bằng-nhau-tập-hợp.

- eval: E2
  run_id: lan-may-song-qua-bo-phan-loai-E2-r10
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T02:50:52Z
  cmd: bash tests/plugins/run-tests.sh
  baseline: red
  output: |
    PASS: [LM2] khong entry cho-phep nao chua ky tu * — doi chung duong xanh + 4 mutant do dung ve
  note: |
    Mệnh đề ĐÓNG trên tập entry hữu hạn, kèm chốt chống xanh-rỗng: danh sách rỗng thoả điều kiện một cách hằng đúng nên phải kêu.

- eval: E3
  run_id: lan-may-song-qua-bo-phan-loai-E3-r10
  exit_code: 0
  verifier: config:executors.script.lm_khong_nuot
  verified_at: 2026-08-26T02:50:52Z
  cmd: bash _acceptance/lan-may-song-qua-bo-phan-loai/rang-khong-nuot.sh
  baseline: green
  output: |
    khong-nuot OK (moc 02d9bb59828f: 2 khoa cap cao giu nguyen · chan (b) chung tren cap sinh)
  note: |
    Răng hồ sơ, CỐ Ý không vào bộ kiểm thường trực và chết theo hồ sơ khi gộp. So cây hiện tại với cây ở mốc: không khoá cấu hình nào ngoài luật cho-phép bị đụng.

- eval: E4
  run_id: lan-may-song-qua-bo-phan-loai-E4-r10
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T02:50:52Z
  cmd: bash tests/plugins/run-tests.sh
  baseline: red
  output: |
    PASS: [LM4] khuon khoi tao khuyen kho tieu thu — moi ve mot dieu kien — doi chung duong xanh + 7 mutant do dung ve
  note: |
    Khối khuyên kho tiêu thụ nêu đủ năm điều, mỗi điều một vế rời — cấm gộp bằng phép VÀ/HOẶC vì nhánh không có chiều đỏ riêng là vế chết.

- eval: E5
  run_id: lan-may-song-qua-bo-phan-loai-E5-r10
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T02:50:52Z
  cmd: bash tests/plugins/run-tests.sh
  baseline: red
  output: |
    PASS: [LM5] duong thoai hoa: 7 ve roi + 1 quan he dem duoc + 10 mutant
  note: |
    Đường thoái hoá trong nghi thức. Một vế KHÔNG gõ tay mà rút từ nguồn engine lúc chạy: engine là bên PHÁT lời báo lỗi, luật là bên ĐỌC, hai bên phải round-trip.

- eval: E6
  run_id: lan-may-song-qua-bo-phan-loai-E6-r10
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T02:50:52Z
  cmd: bash tests/plugins/run-tests.sh
  baseline: red
  output: |
    PASS: [LM6] tai lieu van hanh — do TRONG khoi co moc neo, moi ve mot dieu kien — doi chung duong xanh + 7 mutant do dung ve
  note: |
    Tài liệu vận hành nêu cả hai nửa (làm gì · đánh đổi gì · đường thoái hoá), đo TRONG khối có mốc neo chứ không grep trọn tài liệu.

- eval: E8
  run_id: lan-may-song-qua-bo-phan-loai-E8-r10
  exit_code: 0
  verifier: config:executors.test.plugins
  verified_at: 2026-08-26T02:50:52Z
  cmd: bash tests/plugins/run-tests.sh
  baseline: red
  output: |
    PASS: [LM8] van pham luat quyen + entry nam dung cho — doi chung duong xanh + 7 mutant do dung ve
  note: |
    Văn phạm luật quyền + entry nằm đúng chỗ + khuôn sống đúng MỘT khối trên đúng bảy thư mục hợp đồng nêu. Danh sách khoá sai-chỗ và phạm vi đều RÚT TỪ hợp đồng.

- eval: E7
  run_id: lan-may-song-qua-bo-phan-loai-E7-r10
  judged_by: hai phien hoi dong DOC LAP (vong 9 va vong 10), moi phien mot luot, chi doc file
  verdict: PASS
  verified_at: 2026-08-26T02:50:52Z
  baseline: n-a
  output: |
    Ca hai phien de xuat PASS. Bang MUTANT-MATRIX 54/54 khop so mutant dem duoc trong ma,
    tung eval mot. Khong ve chet, khong thuoc nao viet vua khit mutant cua chinh no, khong
    nhanh co that thieu chieu do, moi mutant di qua CHINH ham cua chieu xanh, moi doi chung
    duong chay tren dung dang input (ban tho VA ban da gop khoang trang), fixture do code
    sinh trong chinh luot chay, moi thong diep do ghim ten vat/entry/lenh/file.
  note: |
    KHAI THANG: day KHONG phai bay 3-lens cua engine ma la hai phien hoi dong doc lap, vi
    lan may di duong tuan tu. Phien vong 10 cham tai 4fe4a6ce; thay doi DUY NHAT sau lan cham do
    la noi khai `paths` cua E1 them `lib/**` — dung dieu chinh phien do khuyen, va noi pham
    vi chi khien eval chay NHIEU hon, khong bao gio it hon.

## Đối chứng đỏ ở mức eval (cây CHƯA có tính năng)

Dựng bằng `git worktree` tại mốc `02d9bb59828f` — lấy TRỌN cây, không chép danh sách
tệp tay — rồi phủ **dụng cụ đo** (bộ ca + hợp đồng) lên, KHÔNG chép vật được đo.

- **E1 · E2 · E4 · E5 · E6 · E8 (nửa văn phạm): ĐỎ.** Luật cho-phép chưa tồn tại; ba
  mốc neo chưa có. Phép đo đỏ vì VẬT chưa có, không vì lỗi tiêm.
- **E3: green — KHÔNG phân biệt được, do bản chất.** Răng so cây hiện tại với cây ở
  mốc; đứng ngay tại mốc thì hai bên là một, nên không có gì để kêu.
- **E8 nửa «khuôn sống một chỗ»: green — KHÔNG phân biệt được, do bản chất.** Nó đo một
  tính chất của CHÍNH dụng cụ đo, mà dụng cụ đo là thứ được mang sang cây mốc.

## Known limits

1. **Không eval nào đo HIỆU LỰC LÚC CHẠY của luật cho-phép.** Cấu hình đọc lúc khởi
   động phiên; phá thử ở S1 xác nhận sửa giữa phiên không có hiệu lực. Bằng chứng ở
   đây chứng minh lời khai ĐÚNG HÌNH DẠNG và ĐÚNG QUAN HỆ, **không** chứng minh làn
   máy hết nghẽn. Chứng minh đó là 5 vòng S4 kế, và đó chính là thứ Cổng Giá trị đọc.
2. Chân (b) của răng chạy trên cặp sinh bởi code vì bản ở mốc chưa có khối cấu hình
   quyền; răng tự kêu nếu ngày nào đó mốc có.
3. Các vế văn xuôi là phép đo CÓ-MẶT trên từ vựng ĐÓNG — canh điều khoản khỏi bị xoá
   hay rút ruột, **không** chứng minh câu chữ nói đúng ý.
4. Răng hồ sơ chết theo hồ sơ khi gộp — cố ý, vì nó so một file cấu hình SỐNG với một
   mốc BẤT BIẾN.
5. Hằng khuôn văn phạm là bản CHÉP TAY: nguồn thật là khung cấu hình của harness, nằm
   ngoài kho, nên không round-trip được như mối nối engine ở E5.
6. **Việc GHÉP ĐỦ nhánh do người viết giữ, không lưới nào canh.** Vòng 4 có dựng một
   lưới tự-khai-lời-báo cho chỗ này; owner CẮT ở vòng 5 vì lời nó hứa là phủ định phổ
   quát trên văn xuôi mã nguồn — không thuộc loại chứng được — và bản thân nó xanh mà
   chưa từng chạy.
7. Hợp đồng thu lời hứa thì phép đo thu theo — có chủ đích: hợp đồng là nguồn của lời
   hứa, và sửa hợp đồng thì hiện trong diff và ra tới cổng người.
8. Phép đếm mốc neo bắt được KHỐI CÓ MỐC NEO thứ hai, **không** bắt được một bản sao
   khuôn KHÔNG mốc neo — phủ định phổ quát, không thuộc loại chứng được.

## Ngoài hợp đồng

(rỗng — mọi phát hiện ngoài hợp đồng của các vòng trước đã đóng)

## Analyst

- **Hai phép đo không phân biệt được** (E3, và nửa «khuôn sống một chỗ» của E8): xem
  mục đối chứng đỏ. Cả hai không-phân-biệt-được do BẢN CHẤT, không do viết ẩu — nhưng
  chúng vẫn có giá trị canh hồi quy, nên giữ và khai thẳng thay vì cắt.
- Sáu phép đo còn lại phân biệt được thật: đỏ trên cây chưa có tính năng.

## Variance

Không có eval ngẫu nhiên. Bảy lượt làn máy tuần tự liên tiếp cho cùng kết quả.

## Iterations

10 vòng. Luật dừng-vá bật **ba lần**; owner chọn: thu phạm vi → đổi khuôn → **cắt**.
Các lớp đã đóng, mỗi lớp có phá thử trên vật thật: văn mô tả khai hành vi của bộ đo ·
mồi nhử gõ tay · nhánh có thật thiếu chiều đỏ · xanh mà chưa từng chạy · vế chết hằng
đúng · mutant vô hiệu lọt lưới · phạm vi lời hứa để mở · cửa hậu mang-kết-quả-cũ-sang.

## Gate 2 checklist (human)

- [ ] Tám giới hạn đã khai ở trên — chấp nhận được chứ?
- [ ] Giới hạn số 1 là cái đắt nhất: hồ sơ này **không** chứng minh làn máy hết nghẽn,
      chỉ chứng minh vật đúng hình dạng. Bằng chứng hiệu lực là 5 vòng S4 kế.
- [ ] Hai phép đo không phân biệt được — giữ (đề xuất) hay cắt?
- [ ] Hội đồng là hai phiên độc lập, không phải bầy 3-lens của engine (vì làn máy đi
      đường tuần tự) — chấp nhận chứ?
