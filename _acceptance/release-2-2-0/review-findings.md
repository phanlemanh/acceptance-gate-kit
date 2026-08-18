## Trong hợp đồng

### 1. Khối bằng chứng của E3c không thể là output của lệnh nó khai — nó là bản chép của E3 (suite khác)

- file: `_acceptance/release-2-2-0/evidence-report.md:80`
- severity: high
- source: conventions
- AC: AC-3

E3c khai `verifier: config:executors.test.plugins` → `bash tests/plugins/run-tests.sh`, nhưng khối `output:` của nó giống HỆT từng ký tự khối của E3 (suite scripts): «PASS: GCV1d contract lanh khong sinh canh bao nao» + «Results: 704 passed, 0 failed».

Suite plugins không thể in cả hai dòng đó: `grep -c GCV1d tests/plugins/run-tests.sh` = 0 (GCV1d là ca của tests/scripts/run-tests.sh), và tests/plugins/run-tests.sh chỉ có hai dòng tổng kết — «Results: $failures failed» (10534) hoặc «Results: all plugin tests passed» (10539); nó KHÔNG có bộ đếm PASS_COUNT nên không bao giờ in «N passed, M failed». So sánh: khối E1/E2/E6 (cùng suite plugins, khoá plugins_release) in đúng «PASS: P200 …» + «Results: all plugin tests passed».

Hệ quả: chân bằng chứng của AC-3 cho suite plugins được dán từ suite khác — vi phạm thẳng bất biến «bằng chứng không tự dối» (CLAUDE.md, nguyên tố 2). Cần chạy lại đúng lệnh và dán output thật (dòng cuối phải là «Results: all plugin tests passed»).

_Vì sao trong hợp đồng:_ AC-3 yêu cầu đủ bốn suite XANH được chứng minh qua evidence-report; khối bằng chứng của một trong ba ca thuộc mốc này (trong suite plugins) là output chép từ suite khác, nên bằng chứng cho AC-3 không hợp lệ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.

- **Hồ sơ có evidence verdict REJECT nhưng cổng trước-merge bỏ qua hoàn toàn vì contract để status: approved**
  Người dùng thấy gì: Bản phát hành này có thể được gộp vào nhánh chính dù công cụ kiểm tra tự động đã báo lỗi, vì bước rà soát trước khi gộp bỏ qua hồ sơ này — người dùng có thể nhận một bản chưa thực sự qua kiểm chứng.
  file: `_acceptance/release-2-2-0/contract.md:8`
  severity: high
  Đề xuất: known-limits

- **P200 vào suite VĨNH VIỄN nhưng neo vào origin/main (mốc di động) — mọi làn song song sẽ đỏ oan ngay sau khi mốc phát hành merge**
  Người dùng thấy gì: Sau khi bản phát hành này lên nhánh chính, các nhánh làm việc khác đang mở song song có thể tự nhiên bị báo lỗi dù không đụng tới phần liên quan, và phải đồng bộ lại theo nhánh chính sớm hơn dự kiến.
  file: `tests/plugins/run-tests.sh:10442`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 2 — đầu vào dựng tay đúng khuôn bên ĐỌC: chiều đỏ của «buộc tăng» không đi qua đường kích hoạt thật (writer→reader không round-trip)**
  Người dùng thấy gì: Phép kiểm tra bắt buộc tăng số phiên bản khi phát hành có một điểm chưa được thử nghiệm kỹ: nếu tên cấu hình dùng để bật kiểm tra này lệch đi trong tương lai, hệ thống có thể âm thầm bỏ lọt bản phát hành thiếu tăng số mà không ai hay.
  file: `tests/plugins/run-tests.sh:10503`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (vế «ghim ĐÚNG thông điệp») — chuỗi ghim của đột biến khớp cả thông điệp của plugin KHÁC**
  Người dùng thấy gì: Một phần trong bộ kiểm tự động có thể nhận nhầm lỗi ở một mục không liên quan là bằng chứng nó đang hoạt động đúng, nên nếu về sau mục nó thực sự canh bị hỏng, hệ thống có thể không phát hiện ra.
  file: `tests/plugins/run-tests.sh:10471`
  severity: low
  Đề xuất: known-limits

## Chưa phân loại (triage-failed)

phân loại phạm vi không chạy được — không lỗi nào bị máy tự sửa, người xem lại toàn bộ.

### 1. Bằng chứng ghim ở f3dac37 trong khi HEAD sửa chính vật được đo — lời khai «tự phá thử 4 chiều» chỉ nằm ở commit message

- file: `_acceptance/release-2-2-0/evidence-report.md:11`
- severity: medium
- source: conventions

`verified_commit: f3dac37…` và cả 7 dòng run-log.jsonl đều ghim sha f3dac37, nhưng chúng được commit TRONG 50a5e85 — commit vừa sửa 26 dòng của `tests/plugins/run-tests.sh` (viết lại chính p200.mjs: thêm nhánh đọc `loi`, đổi cách tính MUT_KY_VONG, thêm chốt cho dotBase). File đổi nằm NGOÀI `_acceptance/` và không khớp t1_skip_globs, nên theo staleness guard (feature-loop/skills/feature-loop/SKILL.md:29) đây là evidence STALE: phải hạ status về implemented và chạy vòng S4 mới, không được trình bảng bằng chứng cũ.

Bằng chứng duy nhất cho bản P200 hiện tại là câu «Tự phá thử 4 chiều, mỗi chiều exit 1; cây thật exit 0» trong commit message — không có run_id/exit_code/verified_at nào. Tôi đã chạy lại độc lập và bản vá ĐÚNG là có răng (P200_BASE=HEAD P200_MUST_BUMP=1 → exit 1; mặc định → exit 0, 7/7 đột biến), nhưng chuỗi bằng chứng của hồ sơ không ghi điều đó. Và vì finding status=approved ở trên, luật stale trong pre-merge cũng không hề chạy để bắt lỗi này.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
