# Review findings: lan-ghim-lai-theo-paths (round 4)

## Trong hợp đồng

- **Hình dạng 5: ô M9 «paths một dòng [a, b]» trong ma trận viết trước thực chất là bản sao byte-đúng của M2**
  file: `_acceptance/lan-ghim-lai-theo-paths/rang/ma-tran.mjs:22`
  severity: medium
  source: measurement
  AC: AC-4
  detail: Contract khai M9 là `paths` viết một dòng `[a, b]` (hai phần tử) và là một trong «ba cách viết» mà AC-4 hứa cho cùng kết luận. Nhưng `MA_TRAN` cho M9 đúng `Y(ev('E1','script',P('src/**')))` với diff `['lib2/b.js']` và kỳ vọng 'loc', trùng hệt M2 ở dòng 20. Không ô nào có mảng một dòng nhiều phần tử mà kết luận phụ thuộc phần tử thứ hai. M3 có hai glob, nhưng cả hai tệp của nó đều bị luật cũ loại, nên kết luận không đổi dù bộ đọc bỏ phần tử sau. Một bộ đọc chỉ lấy phần tử đầu của mảng một dòng vẫn qua đủ 15/15 ô ở E3, E4, E7 và E10. Ma trận đếm đúng 15 phần tử nhưng phần tử M9 không hiện thân hình dạng nó khai.
  rationale: AC-4 dịch danh ở M9 (paths viết một dòng hai phần tử) là một trong ba cách viết phải cho cùng kết luận, nhưng ma trận cài đặt không thể hiện đúng hình dạng đó.

- **Hình dạng 5: ô M12 «hợp paths RỖNG» không chạm nhánh hợp-rỗng; mutant «hợp rỗng thành im» mà AC-4 khai không có trong răng**
  file: `_acceptance/lan-ghim-lai-theo-paths/rang/ma-tran.mjs:25`
  severity: low
  source: measurement
  AC: AC-4
  detail: M12 = một eval `judgment` không `paths`, không `not-run`. Trong `staleByPaths` (lib/evidence-core.cjs:453), ô này trả về `eval-ngoai-may-thieu-paths:E1` trước khi tới `if (!globs.length) return cu('hop-paths-rong')` (dòng 458). chan-premerge.mjs cũng tự ghim LY_DO M12 = 'eval-ngoai-may-thieu-paths:E1', tức M12 đi cùng nhánh với M13. Vì vậy không ô nào của ma trận ở tầng lưới trước-gộp tới được nhánh hợp-rỗng. Danh sách mutant E4 cũng chỉ có 'tệp hỏng thành im' trên M8, không có cặp «hợp rỗng thành im» trên M12 như AC-4 khai. Nhánh này chỉ được chạm ở unit SBP5 của tests/scripts/stale-by-paths.test.mjs, không qua lưới thật.
  rationale: AC-4 khai rõ cặp đỏ cho ô M12 và bản sao «hợp rỗng thành im», mà răng không có mutant đó và ô M12 đi vào nhánh khác.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Re-pin lane now holds two readers of the same `paths:` field that disagree; the comment and blank-line fixes went into the new one only**
  Người dùng thấy gì: Khi kho bat che do loc theo phan do, mot so cach viet khai bao pham vi (co chu thich cuoi dong, hoac co dong trong) van duoc doc day du o buoc quyet dinh chay lai, nhung o buoc ghi chu sau khi chay lai thi doc thieu. Hau qua: ban ghi co the khong bao rang phan do ngoai may da thay doi, nen nguoi doc co the bo qua mot thay doi dang chu y.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: medium
  Đề xuất: known-limits

- **acceptance-init config template: new `repin_parallel_suites` line splits `ship_default` from its continuation comment**
  Người dùng thấy gì: Trong mau cau hinh de cac kho sao chep, loi giai thich ve cach giao hang nam duoi dong cua tuy chon chay song song, nen nguoi doc de hieu nham tuy chon nay lam gi.
  file: `commands/acceptance-init.md`
  severity: low
  Đề xuất: known-limits

- **pre-merge-check.sh usage header leaves out the new `--stale-all` flag**
  Người dùng thấy gì: Co ep dung luat cu khi chay chien dich phat hanh chua duoc ghi o phan huong dan nguoi dung doc dau tien, nen nguoi van hanh co the khong biet co no.
  file: `scripts/pre-merge-check.sh`
  severity: low
  Đề xuất: known-limits

- **Path filter skips files inside a `paths` entry written as a folder with no wildcard, so evidence wrongly stays fresh**
  Người dùng thấy gì: Neu mot ho so khai pham vi do bang ten thu muc tran (khong dau sao) va kho bat che do loc, thi sua ma ngay trong thu muc do van khong lam bang chung bi coi la cu. Cong co the cho qua sach du ma dang duoc do da doi, va lan ghi lai bi bo qua.
  file: `lib/evidence-core.cjs`
  severity: high
  Đề xuất: new-contract

- **Parallel suite mode joins raw output chunks as text, which garbles multibyte UTF-8 characters in the full log**
  Người dùng thấy gì: Khi bat che do chay song song, chu tieng Viet co dau trong nhat ky loi day du co the bi vo thanh ky tu loi, nen doc lai loi cua suite do khong con nguyen ven.
  file: `feature-loop/scripts/repin-lane.mjs`
  severity: low
  Đề xuất: known-limits

- **banBase drops git archive errors (no pipefail), so the comparison base can be an empty folder without saying why**
  Người dùng thấy gì: Khi ban doi chung khong lay duoc tu lich su, bo kiem tra van chay tren thu muc rong va bao do vi mot ly do sai, nen kho phan biet loi cua san pham voi loi cua moi truong thu.
  file: `_acceptance/lan-ghim-lai-theo-paths/rang/ban-base.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình) ở chiều đỏ E3/E7 của bộ răng giu-tron-loi-loi: bản sao sập cũng được tính là «đã bắt»**
  Người dùng thấy gì: Mot so phep thu canh bao cua tinh nang lan ghi lai chi ket luan 'da bat duoc' khi khong thay dong ghi nao, nen neu ban thu tu sap thi van tinh la dat. Do tin cay cua mau xanh o do thap hon ve ngoai.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình) ở chiều đỏ E1 và E6: không có dấu sống của bản sao, không ghim thông điệp**
  Người dùng thấy gì: Mot so phep thu cua tinh nang giu loi nhat ky van dat ke ca khi ban thu bi sap truoc khi chay, nen khong chung minh duoc phep thu thuc su bat duoc loi.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-nhat-ky.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 ở các ca đột biến của lmtl-the: «đỏ đúng hàng» chỉ ghim tiền tố tên hàng, nên lỗi hạ tầng cũng tính là bắt được**
  Người dùng thấy gì: Cac phep thu doi chung cua the quyet dinh co the van xanh khi ban thu bi hong ha tang, nen mau xanh o do chua chung minh phep thu bat dung loi.
  file: `tests/scripts/lmtl-the.test.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (ma trận tự đếm): LT-AC7-mot-nguon tính số chuỗi mong đợi từ chính đối tượng đang đo**
  Người dùng thấy gì: Phep dem so loi ra tren the quyet dinh tu lay so mong doi tu chinh du lieu dang do, nen neu mat mot lua chon thi phep thu van xanh.
  file: `tests/scripts/lmtl-the.test.mjs`
  severity: low
  Đề xuất: new-contract

- **Hình dạng 5: E4 tuyên «MỌI bộ đọc run-log» nhưng cách rút bằng grep chuỗi bỏ sót carry-plan.mjs, còn hàng s4-args lại tắt đường carry**
  Người dùng thấy gì: Phep quet 'moi cho doc nhat ky' bo sot mot cong cu doc nhat ky. Hien cong cu do khong bi anh huong, nhung phep quet chua chung minh duoc dieu do.
  file: `_acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 9/13 lỗi rơi vào file không bộ đo nào phủ (commands/acceptance-init.md, _acceptance/lan-ghim-lai-theo-paths/rang/ban-base.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-dau-do.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-nhat-ky.mjs, tests/scripts/lmtl-the.test.mjs, _acceptance/lan-ghim-lai-theo-paths/rang/ma-tran.mjs, _acceptance/lan-ghim-lai-giu-tron-loi-loi/rang/chan-bo-doc.mjs) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
