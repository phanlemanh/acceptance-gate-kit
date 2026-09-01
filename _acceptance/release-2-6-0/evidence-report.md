---
schema_version: 2
feature_slug: release-2-6-0
verdict: PASS
failed_evals: []
reason:
verified_by: implementing session (rà soát đối kháng do phiên tươi độc lập làm — xem Known limits #1)
enforcement_mode: strict
bypass_used: false
verified_commit: 6c44ac24208d11602fa06e43d35138d22f257c05
human_signoff: Manh Phan 2026-09-01 — ký mốc phát hành 2.6.0 với 7 known-limits đã khai và 2 mục ngoài hợp đồng cùng chọn ghi Known limits; đồng ý phạm vi đã cắt; phê cả 5 quyết định ghi sau Cổng Phạm vi
---

# Evidence Report: release-2-6-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E3c | AC-3 | test | PASS |
| E3d | AC-3 | test | PASS |
| E3e | AC-3 | script | PASS |
| E6 | AC-6 | test | PASS |

## Evidence

Sinh TỪ `run-log.jsonl` vòng 2, không gõ tay: `verified_at` là `ts` thật của
lượt chạy, `exit_code` là mã thoát thật. Bốn eval dùng chung một lượt chạy
`plugins` (dedupe đã khai ở evals.yaml) nên mang cùng run_id gốc.

- eval: E1
  run_id: release-2-6-0-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-01T12:03:32Z
  output: |
    Results: all plugin tests passed

- eval: E2
  run_id: release-2-6-0-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-01T12:03:32Z
  output: |
    Results: all plugin tests passed

- eval: E3
  run_id: release-2-6-0-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.scripts
  verified_at: 2026-09-01T12:01:56Z
  output: |
    Results: 793 passed, 0 failed

- eval: E3b
  run_id: release-2-6-0-E3b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.hooks
  verified_at: 2026-09-01T12:03:29Z
  output: |
    Results: 60 passed, 0 failed

- eval: E3c
  run_id: release-2-6-0-E3c-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-01T12:03:32Z
  output: |
    Results: all plugin tests passed

- eval: E3d
  run_id: release-2-6-0-E3d-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.workflows
  verified_at: 2026-09-01T12:03:31Z
  output: |
    Results: all workflow tests passed

- eval: E3e
  run_id: release-2-6-0-E3e-r2
  exit_code: 0
  baseline: n-a
  verifier: node scripts/product-map.mjs --root . --check
  verified_at: 2026-09-01T12:03:32Z
  output: |
    PRODUCT-MAP.md khớp hồ sơ xưởng.

- eval: E6
  run_id: release-2-6-0-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.plugins
  verified_at: 2026-09-01T12:03:32Z
  output: |
    Results: all plugin tests passed

## Vòng chấm

| Vòng | Cây | Kết quả | Vì sao có vòng sau |
|---|---|---|---|
| r1 | `c5689fb6` | 8/8 máy XANH, nhưng rà soát đối kháng trả **2 high · 8 medium · 7 low** | hai high là LỜI KHAI SAI của phiên thi công, không phải lỗi vật — phải sửa rồi chấm lại |
| r2 | `6c44ac24` | 8/8 XANH trên cây chứa bản sửa | — |

**Chấm lại TOÀN BỘ ở r2 chứ không chỉ phần đã sửa**: bản xanh của r1 nói về cây r1, không nói gì về cây r2.

## Bốn tiêu chí được chứng thế nào

Phép đo duy nhất của mốc là ca **VĨNH VIỄN P200** — mọi số đọc TỪ manifest nên nó canh được cả lần cắt số sau, không phải dàn đo dùng-một-lần.

- **AC-1 · AC-2 · AC-6** — P200 in bảy dòng vế (`hai plugin cung so: 2.6.0` · ba dòng `hop semver` · `GUIDE khop so DOC TU manifest` · `mo ta acceptance-gate co muc v2.6.0` · `muc v2.6.0 cua feature-loop TU khai cap`), kèm **5/5 đột biến chạy thật** mỗi cái ghim đúng câu, và **đối chứng dương** bản-sao-nguyên-vẹn phải 0 vế đỏ trước khi tin đột biến nào. Đây KHÔNG phải assertion âm-tính-một-mình.
- **AC-3** — bốn suite + `product-map --check`. Chiều đỏ của `product-map` được phiên soi dựng thật (sửa `PRODUCT-MAP.md` trong bản sao → exit 1). Bốn suite được **tái lập độc lập** trên một bản `git clone` sạch checkout `c5689fb6`: 793 / 60 / «all workflow tests passed» — khớp log của phiên thi công.

## Ngoài hợp đồng

- **Bất biến «đổi chữ ở `gate-card.js` mà quên thân lệnh là ĐỎ ngay» nằm NGOÀI bốn suite.** Phiên soi tiêm đột biến: `rang.sh --chan round-trip` đỏ 6 fail, trong khi cả bốn suite vẫn exit 0. Bất biến CÓ THẬT nhưng lưới thường trực không canh nó — chỉ bộ răng của một hồ sơ canh, mà bộ răng hồ sơ chết theo hồ sơ khi merge. Ba lối: ghi Known limits · mở hợp đồng mới · nâng phạm vi sửa ngay. **Người quyết, không phải máy.**

## Known limits

1. **Bằng chứng KHÔNG do phiên sạch tạo.** Tám eval do chính phiên thi công chạy. Phần *rà soát đối kháng* thì có phiên tươi độc lập — và chính nó tìm ra toàn bộ 17 finding, trong khi phép đo máy tìm ra **0**. Cùng giới hạn với mốc 2.5.0, chưa đóng.
2. **Giá trị chạm người dùng của mốc này là HAI thứ**, không hơn: hai lời thuật từ chối mới của bộ dựng thẻ. Phần lưới thường trực là việc-trong-nhà và mục `v2.6.0` của manifest nay khai thẳng như vậy.
3. **Ô đang chờ Cổng Đáng vẫn nhận câu chỉ sai bước kế** — làn thẻ đã trả về ô 01/09 (cây ghim `528caaa8`). Đã khai trong cả manifest lẫn thân lệnh, không phải chỗ quên.
4. **Con số «34 phát hiện / 27 lượt eval» chép từ findings 01/09, không tái lập được** — đếm lại từ `run-log.jsonl` vòng đó ra 24. Ba cách đếm ba số.
5. **Bộ đếm «lần gọi người» vẫn đếm tay.** Con số **6** mà ngưỡng CẮT KIT đọc là số người đếm, không phải số máy đo. Hai mốc liên tiếp cùng giới hạn.
6. **Năm dòng sổ quyết định (7001–7005) mang dấu thời gian tròn không thật** (10:30:00Z, commit chứa chúng là 09:50:15Z). Sổ append-only nên không viết lại; entry 8005 ghi nhận. **Tái phạm** đúng lớp đã là P1 của mốc 2.5.0 — và tái phạm ngay trong commit đi sửa P0.
7. **Thẻ Cổng 1 xếp AC-1/AC-2/AC-6 nhầm cột** «Sẽ KHÔNG làm» vì phép dò từ phủ định bắt chữ «không» trong vế *Then*. Lỗi ĐỌC của thẻ, không phải của hợp đồng; sửa cần chạm mã cổng nên nằm ngoài mốc phát hành.

## Đọc ngưỡng CẮT KIT — phần người ký nhận trách nhiệm

| Vế ngưỡng 30/08 | Đọc được | Kết luận |
|---|---|---|
| ≥2/5 vòng sản phẩm bị hạ tầng kit đốt | 1 vòng quan sát được, 1/1 bị đốt | **CHƯA ĐỦ MẪU** (1/5) |
| trung bình >3 lần gọi người/vòng | **6** | **VƯỢT** — gấp đôi |

Vế thứ hai vượt **không kèm miễn trừ**. Ký mốc này là chấp nhận bản đọc đó đi vào hồ sơ phát hành. Việc *có mở phiên quyết cắt kit hay không* là lịch của owner, không phải hệ quả tự động của chữ ký.
