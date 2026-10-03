---
schema_version: 1
feature: Làn ghim lại giữ trọn lời lỗi, để lại dấu lượt đỏ kèm tải máy, và ghi thời lượng làn
slug: lan-ghim-lai-giu-tron-loi-loi
owner: phanlemanh@gmail.com
risk_tier: T2               # chỉ feature-loop/scripts/repin-lane.mjs + SKILL/tài liệu; bộ đọc lib/ và pre-merge KHÔNG sửa (đo im 03/10)
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-02T23:02:12Z
design_doc: docs/superpowers/specs/2026-10-03-lan-ghim-lai-giu-tron-loi-loi-design.md
---

# Acceptance Contract: lan-ghim-lai-giu-tron-loi-loi

## Context

Làn ghim lại (2.20) khi một lệnh đỏ chỉ in 30 dòng cuối — với suite 1 507 bài của crm đó là phần
tổng kết, lời lỗi mất; làn đỏ thoát 1 mà không ghi gì, nên lượt đỏ không tồn tại trong sổ nào và
thời lượng làn vắng khỏi năm dòng số. Ca thật 02/10 (crm `soan-okr-cung-tro-ly`): ~10 lượt ghim, 5
đỏ không để vết, chẩn đoán đầu sai vì thiếu lời lỗi. Cổng Đáng ký 02/10; phạm vi bổ sung (a)
— `wall_s` + số lệnh trên dòng repin — ký 03/10 để có số nền trước vòng `lan-ghim-lai-theo-paths`.

Đo 03/10 trước khi viết hợp đồng: dòng loại mới và khoá mới trong run-log → lưới trước-gộp, bộ
kiểm lại bằng chứng, thẻ đều im (giả định 1 của ô ĐẠT), nên vòng không sửa bộ đọc nào.

Phép thử mọi kho (luật 26/09): kho xanh không thấy gì khác ngoài hai khoá số trên dòng repin; kho
đỏ được tệp nhật ký trọn + một dòng sổ; hành vi cũ ai dựa — mã thoát làn (không đổi, AC-7) và bộ
đọc sổ (im, AC-4).

## Criteria

- AC-1: Given một lệnh suite in 200 dòng đánh số (xen stdout và stderr) rồi thoát 1, When làn chạy, Then có ĐÚNG một tệp nhật ký dưới `.acceptance-runs/<slug>/repin-<run_id>/` chứa đủ 200 dòng đánh số (không thiếu dòng nào, đếm từng số), stderr của làn in đường dẫn tệp ấy và vẫn in ĐÚNG 30 dòng cuối của đầu ra gộp (stdout rồi stderr) như 2.20 — so khớp chính xác tập và thứ tự (bản sao in 30 dòng ĐẦU → ĐỎ ghim «đuôi không phải 30 dòng cuối»); biến thể đầu ra lớn hơn 1 MiB với dấu riêng ở DÒNG ĐẦU → dấu ấy có trong tệp; và trên kho KHÔNG khai `.acceptance-runs/` trong `.gitignore`, sau lượt đỏ `git status` không thấy tệp nào dưới `.acceptance-runs/` (thư mục tự ẩn khỏi git — bản sao gỡ tệp tự ẩn → ĐỎ ghim «nhật ký lọt vào git»); chiều đỏ trên cùng fixture: bản sao chỉ ghi 30 dòng cuối vào tệp → ĐỎ ghim «nhật ký bị cắt».
- AC-2: Given làn mà mọi lệnh thoát 0, When làn chạy (có `--write` và không), Then không tạo tệp hay thư mục nào dưới `.acceptance-runs/` (đếm trước/sau) và không dòng `repin-do` nào; chiều đỏ: bản sao ghi nhật ký cho mọi lệnh → ĐỎ ghim «xanh sinh tệp».
- AC-3: Given làn đỏ theo BA nguyên nhân (suite đỏ · eval lệch kỳ vọng · lệnh chạm cây hồ sơ đã thông cổng) với hai slug, When làn thoát, Then mã thoát 1 như cũ; run-log CỦA TỪNG slug có đúng MỘT dòng mới `kind: repin-do` mang `run_id`, `sha`, `suites_exit`, `evals_exit`, `lenh_do` (mỗi lệnh đỏ: lệnh, mã, đường nhật ký tương đối GỐC KHO — giải từ gốc kho phải mở được và chứa dấu riêng mà chính lệnh đỏ ấy in, ở CẢ slug thứ hai — chứng trên MỘT lượt có ≥ 2 lệnh đỏ in dấu khác nhau: nhật ký của mỗi lệnh chứa dấu của CHÍNH nó và KHÔNG chứa dấu lệnh kia; ca chạm hồ sơ mang `log: null` kèm `ly_do`), `cham` (ca chạm), `wall_s`, `so_lenh`, `tai`; KHÔNG dòng `kind: repin` mới và `evidence-report.md` không đổi byte nào; chiều đỏ: bản sao bỏ bước ghi dấu → ĐỎ ghim «đỏ không vết»; bản sao ghi dấu cho một slug → ĐỎ ghim «thiếu dấu ở slug»; bản sao ghi đường tương đối thư mục slug → ĐỎ ghim «dấu trỏ chỗ trống»; bản sao trỏ mọi lệnh đỏ về nhật ký đầu tiên → ĐỎ ghim «nhật ký gán nhầm lệnh».
- AC-4: Given hồ sơ đã ký có thêm một dòng `repin-do` và dòng `repin` mang `wall_s`/`so_lenh`, When chạy MỌI bộ đọc run-log của cây đang kiểm — danh sách RÚT bằng tìm `run-log.jsonl` trong `scripts/`, `lib/`, `feature-loop/scripts/` (trừ test), mỗi bộ đọc một hàng trong bảng cách gọi viết trước của răng; bộ đọc rút được mà không có hàng → ĐỎ ghim «bộ đọc chưa đo»; danh sách rỗng → ĐỎ — Then đầu ra + mã thoát mỗi bộ đọc BẰNG HỆT trên cùng hồ sơ không có hai thứ ấy (bản «không có» GỠ thật `wall_s`/`so_lenh` khỏi mọi dòng pin — ca tự kiểm bản sạch không chứa hai khoá, bản có chứa), VÀ mỗi hàng có đối chứng dương riêng chứng bộ đọc đã đọc đúng hồ sơ (mã thoát mong đợi ghim sẵn + một dấu nội dung, vd run_id của pin, hoặc đầu ra đổi khi làm nhiễu dòng `repin` thật); chiều đỏ: bản sao đặt `kind: repin` cho dấu đỏ → bảng sức khoẻ vòng (`loop-health.mjs`) đếm thêm một làn ghim, ghim «dấu đỏ giả làm pin» (bộ kiểm lại chỉ đọc dòng pin được báo cáo trích nên KHÔNG thấy dòng giả — đo 03/10).
- AC-5: Given làn xanh có `--write`, When đọc dòng `kind: repin` vừa ghi, Then có `wall_s` — với suite ngủ 3 giây và eval ngủ 2 giây: `wall_s` ≥ 5 và không vượt đồng hồ ngoài của lượt + 1 giây — và `so_lenh` BẰNG số lệnh khác nhau đã chạy (lệnh trùng tính một lần); khuôn `REPIN-TEMPLATE` trong SKILL feature-loop có đúng hai khoá ấy và ca so khoá script ↔ khuôn (LN5) xanh; chiều đỏ: bản sao ghi `so_lenh` đếm cả lệnh trùng → ĐỎ ghim «đếm lệnh trùng»; bản sao ghi `wall_s` = 0 → ghim «thời lượng hằng»; bản sao chỉ đo lệnh cuối → ghim «thời lượng một lệnh».
- AC-6: Given bộ đọc tải máy là một mô-đun riêng có thể gọi trực tiếp, When (a) đọc trên máy đang chạy, (b) phân tích nội dung `/proc/meminfo` do code sinh, (c) nguồn đọc swap trỏ tới đường không tồn tại (tiêm trong bản sao, chạy được trên cả macOS lẫn Linux), Then (a) `load1`, `ncpu` là số; (b) `swap_used_mb` = SwapTotal − SwapFree (đổi ra MB) đúng từng ca của một bảng ba dòng viết trước; (c) `swap_used_mb: null` và `nen` khác null nêu lý do — đối chứng dương rằng phép tiêm có hiệu lực — và làn đỏ VẪN thoát 1, VẪN ghi dấu; chiều đỏ: bản sao không bắt lỗi đọc swap → ĐỎ ghim «tải máy làm sập làn».
- AC-7: Given ma trận năm ca (xanh · suite đỏ · eval đỏ · chạm hồ sơ đã thông cổng · thiếu `evals.yaml`), When chạy làn của cây đang kiểm và của bản base (`git archive` merge-base trọn `scripts lib feature-loop`), Then mã thoát BẰNG HỆT ở cả năm ca VÀ bằng năm mã ghim sẵn 0 · 1 · 1 · 1 · 2 (ca tự kiểm đúng 5 ô); chiều đỏ: bản sao cho làn có dấu đỏ thoát 0 → ĐỎ ghim «đổi nghĩa đỏ».

## Coverage

- Quét bằng `morphological-scan` (preset risk-premortem). Chân sản phẩm: `feature-loop/scripts/repin-lane.mjs` [SUY-TỪ-REPO]; ca crm 02/10 [SUY-TỪ-REPO: _acceptance/lan-ghim-lai-giu-tron-loi-loi/opportunity.md].
- Chân ngành: CI giữ trọn nhật ký từng bước và gắn mã thoát — GitHub Actions lưu log đầy đủ từng step, JUnit report giữ thông điệp lỗi từng ca [NGÀNH: GitHub Actions, JUnit XML].

| Trục | Giá trị | Thước CE |
|---|---|---|
| A. Kết cục lệnh | xanh · đỏ · đỏ in dài · đỏ xen hai luồng | ca 02/10 crm (1 507 bài, tổng kết che lời lỗi) |
| B. Nguyên nhân làn đỏ | suite · eval lệch kỳ vọng · chạm hồ sơ đã thông cổng · nguồn thiếu (exit 2, không phải lượt) | các nhánh thoát của làn |
| C. Bên đọc sổ | pre-merge · recheck · thẻ · loop-health | đo im 03/10 |
| D. Nền máy | macOS · Linux · đọc swap lỗi | giả định 4 của ô |

- Core → AC-1…AC-7.
- Later: thử lại một lần khi đỏ (đã cắt ở ô, chờ số từ chính dấu lượt đỏ) · chạy theo delta (hạt giống paths).
- Never: ghi bằng chứng khi đỏ — đỏ không bao giờ là pin.

## Đường đo

- ≥ 8/10 chẩn đoán từ nhật ký: đọc trên 10 lượt đỏ kế tiếp ở crm + kit — mỗi dòng `repin-do` trỏ đúng tệp nhật ký (AC-3), người/phiên ghi «chẩn đoán được không cần chạy lại» vào sổ vấp; vật đếm: số dòng `repin-do` có `log` mở được.
- 10/10 có dòng sổ: đếm dòng `repin-do` so số lượt làn đỏ (AC-3 bảo đảm mỗi lượt đỏ một dòng mỗi slug).
- 0 hồ sơ xanh đổi byte: AC-2 + AC-4.

## Out of scope

- Thử lại tự động trong làn; không đổi nghĩa xanh/đỏ.
- Chạy theo delta; lấy suite từ CI.
- Gộp bộ nhãn cạnh gãy của S4 vào làn.
- Sửa thước của kho tiêu thụ.
- Ghi bằng chứng khi đỏ; chạm hồ sơ đã ký ngoài một dòng sổ loại mới.
- Suite song song và hoá cũ theo paths — vòng `lan-ghim-lai-theo-paths`.

## Notes

- Giới hạn khai: nhân quả tải máy → làn đỏ CHƯA chứng minh; dòng `tai` chỉ là số để đọc sau. Ngưỡng mở «chạy lại rồi đi tiếp có cờ»: theo ô (10 lượt đỏ hoặc 30 ngày).
- Kho tiêu thụ chưa bỏ qua `.acceptance-runs/` trong `.gitignore` sẽ thấy tệp lạ sau lượt đỏ; quy ước đã có ở `eval-executors.md` — vòng này thêm cho kit, không sửa kho khác.
