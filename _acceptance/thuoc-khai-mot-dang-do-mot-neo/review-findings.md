# Review Findings: thuoc-khai-mot-dang-do-mot-neo (round 5)

## Trong hợp đồng

### AC-5 vẫn khai `ONLY_BLOCK=P86` — đúng selector xanh-im-lặng mà commit cuối đã bỏ
- file: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/contract.md:41`
- severity: medium
- AC: AC-5
- source: bugs

Vế When của AC-5 viết `ONLY_BLOCK=P86 bash tests/plugins/run-tests.sh`. Khoá config `tkm_p86` thì đã dùng `ONLY_BLOCK="P86 GATE-MODEL"` (và chú thích trong `_acceptance/config.yaml` giải thích đúng lý do). Tiêu chí mà người ký đọc ở Cổng 2 vẫn mô tả phép đo hỏng.

Tái hiện trên bản sao, đổi tiêu đề khối `P86 GATE-MODEL` → `P87 GATE-MODEL`:
- `ONLY_BLOCK=P86` → exit 0, 0 dòng `P86 MUTANT`, `Results: all plugin tests passed`
- `ONLY_BLOCK="P86 GATE-MODEL"` → exit 1, `khong khop khoi nao — go sai ten?`

Chốt `only_matched` không cứu được vì khối `P86 S1 doc feature_loop.ui_standards_skill` (dòng 1521) cũng chứa chuỗi `P86`.

**Rationale:** AC-5 ghi thẳng lệnh When bằng selector cũ (ONLY_BLOCK=P86) trong khi cấu hình thật đã đổi sang 'P86 GATE-MODEL'; văn bản tiêu chí không khớp điều đã cài, tức AC-5 thất bại đúng như viết.

**Failure scenario:** Người đọc AC-5 chạy đúng lệnh trong hợp đồng sau khi khối GATE-MODEL bị đổi tên: nhận exit 0 và kết luận AC-5 PASS, trong khi không một dòng MUTANT nào chạy.

### Fixture VIẾT TAY đúng khuôn bên đọc — đột biến «thêm cổng» không round-trip qua nguồn tsv
- file: `tests/plugins/run-tests.sh:11091`
- severity: medium
- AC: AC-7
- source: measurement

AC-7 và E7 khai: «đột biến thêm cổng thứ năm vào CẢ ba bản (nguồn tsv + VI + EN) mà giữ ≤3 → ĐỎ với ghim `ngan sach luot 3 != so cong 5 - 1`; ba bản vẫn khớp nhau nên chỉ phép so QUAN HỆ bắt được ca này». Code không làm thế. Dòng 11091 (và dòng 11083 của ca cũ `them cong o nguon`) không đụng một ký tự nào của khối tsv trong GUIDE.md; nó chuyền thẳng hai DANH SÁCH ĐÃ PHÂN TÍCH bịa tay `vis + ["Cổng Thứ Năm"]` / `ens + ["Fifth Gate"]` vào `kiem`. Hàm đọc nguồn thật — `cols()` — không hề chạy lại trên tài liệu 5 cổng, và chốt `assert len(ids) == 4` ở dòng 11058 (đọc `ids` NGOÀI hàm, không bị đột biến chạm) bị đi vòng qua. Chỉ hai bản chép VI/EN là được tiêm chữ thật qua `tiem()` rồi đọc lại bằng `nhan()`; vế nguồn là fixture khuôn-sẵn.

Đo thật (bản sao cây tại scratch, 06/09): thêm dòng `G-THU5\tCổng Thứ Năm\tFifth Gate` vào khối tsv của GUIDE.md + dòng bảng tương ứng vào GUIDE/QUICKSTART/README, giữ nguyên `≤3 lượt/vòng` — P86 KHÔNG in `ngan sach luot 3 != so cong 5 - 1` mà chết ở `AssertionError: mo hinh phai co dung 4 cong, dang 5: ['G-DANG','G-PHAMVI','G-BANGCHUNG','G-GIATRI','G-THU5']`. Nghĩa là kịch bản AC-7 mô tả không bao giờ đi tới phép so QUAN HỆ trên vật thật; chuỗi ghim đã khai chỉ xuất hiện được trên đường fixture. Hệ quả đo lường: phép so quan hệ `luot != len(vis) - 1` chưa từng được chứng minh chạy end-to-end từ văn bản nguồn qua `cols()`; và câu «chỉ phép so QUAN HỆ bắt được ca này» sai — chốt đếm cổng bắt trước.

Cùng gốc, khai thừa ở E8: «MỌI đột biến đi qua chân `tiem()` đếm chuỗi đích đúng một lần» — ca `them cong o nguon` (11083) không tiêm chữ nào nên không thể đi qua chân ấy.

**Rationale:** AC-7 đòi đột biến 'thêm cổng thứ năm vào CẢ ba bản (nguồn tsv + VI + EN)' phải tới được phép so QUAN HỆ với chuỗi ghim cụ thể; đo thật cho thấy khi sửa đúng cả ba bản kể cả nguồn tsv, chương trình chết ở một assertion đếm cổng chứ không bao giờ tới được phép so ấy — đúng AC-7 thất bại như viết.

**Failure scenario:** Ai đó refactor mở rộng ngân sách nhưng không sửa `cols()`/assert-đếm-cổng: đội ngũ sẽ tin rằng phép so QUAN HỆ đang canh giữ tính đồng bộ ba bản khi thêm cổng thật, trong khi thực tế nó chưa từng chạy tới.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Sáu ô đo ghim dòng đầu ra mà cỗ máy verify KHÔNG THỂ ghi lại — evidence của chúng giống hệt nhau và không chứa chuỗi đã ghim**
  Người dùng thấy gì: Kết quả kiểm tra tự động có thể báo 'đạt' cho nhiều tiêu chí dù bằng chứng ghi lại không thực sự cho thấy điều đó đã được đo, khiến người duyệt dễ tin nhầm là tính năng đã được kiểm chứng đầy đủ.
  file: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/evals.yaml`
  severity: high
  Đề xuất: new-contract

- **Dòng bổ chính vào hồ sơ ĐÃ KÝ cố ý vô hình với bộ đọc hợp đồng — thẻ vẫn in phương pháp đã chết, không cờ vàng; và nó thêm một cảnh báo lint mới**
  Người dùng thấy gì: Trang hồ sơ đã ký trước đó vẫn hiển thị nội dung tiêu chí cũ trên các màn hình tự động, có thể khiến người xem sau này tưởng nhầm phương pháp đo cũ vẫn còn hiệu lực.
  file: `_acceptance/inputs-tinh-tu-goc-kho/contract.md`
  severity: medium
  Đề xuất: known-limits

- **evidence-report.md chứng nhận một cây không còn tồn tại: `verified_commit` là commit TRƯỚC bản vá selector, tức E5–E7 PASS được sinh dưới đúng lỗi mà cùng commit ấy đi sửa**
  Người dùng thấy gì: Kết quả 'đạt' cho các mục kiểm tra ngân sách có thể đã được đo trên một phiên bản mã cũ hơn bản sắp ký, nên chưa chắc phản ánh đúng trạng thái hiện tại ngay trước khi duyệt.
  file: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **gap-probe.md ghi «fixed» cho hai thứ không có trong cây — mô tả sai chính bản cài hiện hành**
  Người dùng thấy gì: Một ghi chú nội bộ mô tả sai những gì thực sự đã được sửa, có thể gây hiểu nhầm cho người đọc lại lịch sử xử lý sau này.
  file: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/gap-probe.md`
  severity: low
  Đề xuất: known-limits

- **Quan hệ `ship != 1` không có chiều đỏ — xoá hẳn nhánh vẫn xanh 12/12 đột biến**
  Người dùng thấy gì: Nếu sau này ai đó vô tình làm sai điều kiện 'chỉ được có đúng một mốc phát hành', bộ kiểm tra hiện tại có thể không phát hiện ra lỗi đó.
  file: `tests/plugins/run-tests.sh`
  severity: high
  Đề xuất: new-contract

- **SỰ CỐ PHIÊN: tôi đã `git checkout --` xoá mất bản s4-args.json round 5 chưa commit của một phiên song song**
  Người dùng thấy gì: Một tệp dữ liệu chuẩn bị cho vòng kiểm tra thứ 5 bị mất do thao tác nhầm, cần được tạo lại trước khi vòng ký duyệt tiếp theo có thể diễn ra.
  file: `_acceptance/thuoc-khai-mot-dang-do-mot-neo/s4-args.json`
  severity: high
  Đề xuất: new-contract

## Chưa adversarial-verify (refuter chết)

Không có run này.

⚠ Cụm ngoài vùng phủ: 6/8 lỗi rơi vào file không bộ đo nào phủ (_acceptance/thuoc-khai-mot-dang-do-mot-neo/evals.yaml, _acceptance/inputs-tinh-tu-goc-kho/contract.md, _acceptance/thuoc-khai-mot-dang-do-mot-neo/evidence-report.md, _acceptance/thuoc-khai-mot-dang-do-mot-neo/gap-probe.md, _acceptance/thuoc-khai-mot-dang-do-mot-neo/contract.md, _acceptance/thuoc-khai-mot-dang-do-mot-neo/s4-args.json) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
