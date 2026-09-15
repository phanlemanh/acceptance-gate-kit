---
schema_version: 1
feature: Vị từ bỏ qua phải THẤY định nghĩa phép đo — _acceptance/config.yaml và evals.yaml là ĐẦU VÀO của làn, không phải vật hồ sơ
slug: bo-qua-phai-thay-dinh-nghia-phep-do
owner: phanlemanh@gmail.com
risk_tier: T2               # chạm feature-loop/scripts/repin-lane.mjs, tests/scripts; KHÔNG chạm lib, hooks, pre-merge, recheck
surfaces: [cli]
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: bo-qua-phai-thay-dinh-nghia-phep-do

## Context

**Mở tại Cổng Bằng chứng của `chu-ky-khong-tu-lam-hoa-cu` (15/09), owner định đoạt
«Ngoài-③: mở hợp đồng mới».** Đây là lỗ THẬT trong nhát cắt `--skip-unchanged` mà
chính vòng đó vừa ship, do lượt chấm 5 tìm ra.

**Lỗ:** vị từ bỏ qua loại trừ MỌI đường dẫn có phân đoạn `_acceptance`
(`feature-loop/scripts/repin-lane.mjs`, khối `SKIP-UNCHANGED-PREDICATE`). Nhưng hai
tệp dưới `_acceptance/` **là nguồn định nghĩa thứ làn sẽ chạy**:

- `_acceptance/config.yaml` — `feature_loop.suite_keys` giải ra `suiteCmds`, và mỗi
  eval giải `cmd: config:executors.…` từ đây;
- `_acceptance/<slug>/evals.yaml` — danh sách eval máy của chính hồ sơ.

Sửa một executor sau verify → cây «bằng pin» → làn bỏ qua → **lệnh MỚI không bao giờ
chạy trước chữ ký**, mà bằng chứng đã ghim vẫn mang mã thoát của lệnh CŨ.

**Không phải giả định:** chính vòng `chu-ky-khong-tu-lam-hoa-cu` thêm 7 khoá executor
vào `_acceptance/config.yaml` giữa chừng, và fixture SK5 commit đúng một thay đổi
`config.yaml` đơn lẻ — thay đổi đó không làm vị từ khác rỗng.

**Phân biệt đúng, và đây là gốc của lỗi:** `stale_files()` của `pre-merge-check.sh`
trả lời «bằng chứng có hoá cũ không» — với câu hỏi đó, vật hồ sơ đúng là nên loại trừ.
Vòng trước tái dùng nguyên vị từ ấy để trả lời một câu KHÁC: «có cần chạy lại phép đo
không». Với câu thứ hai, `config.yaml` và `evals.yaml` là **đầu vào**, không phải đầu
ra. Một vị từ, hai câu hỏi — đúng lớp «thước gắn nhầm vật».

**Ràng buộc nhịp:** luật chiều rộng (b) cho tối đa MỘT vòng meta giữa hai bản phát
hành, và cửa sổ 2.12 → 2.13 đã dùng suất đó cho `chu-ky-khong-tu-lam-hoa-cu`. Hồ sơ này
mở ở `draft` và **chờ cửa sổ 2.14** — không chạy vòng bây giờ.

## Criteria

### AC-1 — Vị từ bỏ qua THẤY tệp định nghĩa phép đo

**Given** một hồ sơ đã ghim `verified_commit`, và cây chỉ đổi ở `_acceptance/config.yaml`
(giá trị một khoá `executors.*`) hoặc `_acceptance/<slug>/evals.yaml`
**When** `repin-lane.mjs --slug <s> --skip-unchanged` chạy
**Then** làn KHÔNG bỏ qua: nó chạy trọn và chứng lại bằng lệnh MỚI. Thông điệp gọi tên
tệp định nghĩa đã đổi, phân biệt với tệp vật thường.
**And** chiều IM giữ nguyên: đổi `evidence-report.md`, `decisions.jsonl`, `contract.md`,
`gap-probe.md`, `run-log.jsonl` của bất kỳ hồ sơ nào ở bất kỳ độ sâu nào → vẫn bỏ qua
(ma trận 4 ô của AC-4 hồ sơ `chu-ky-khong-tu-lam-hoa-cu` không được mất một ô nào).

### AC-2 — Vị từ mới đo QUAN HỆ, không phải một danh sách tên gõ tay

**Given** cách kit phân biệt «vật hồ sơ» với «định nghĩa phép đo»
**When** đọc mã của vị từ
**Then** tập tệp-định-nghĩa được suy từ chính thứ làn ĐỌC (đường dẫn `config.yaml` mà
`resolveConfigKey` dùng, và `evals.yaml` của từng slug trong `perSlug`) — KHÔNG hardcode
hai chuỗi đường dẫn. Thêm một nguồn định nghĩa thứ ba trong tương lai mà quên cập nhật
vị từ thì ca phải ĐỎ, không im.

### AC-3 — Giới hạn còn lại được khai, không im

**Given** cùng vị từ
**When** đọc khối `SKIP-UNCHANGED-PREDICATE` và ADR
**Then** hai giới hạn đã biết được khai kèm ngưỡng đang đếm: (a) **tệp untracked** vô
hình với `git diff` nên một script mới chưa `git add` không làm làn chạy — `stale_files`
được miễn vế này vì CI chạy trên cây đã commit, còn làn 7b chạy trên cây làm việc với
`--allow-dirty`; (b) lệch glob bash/JS ở dạng `dir/*` (đã khai ở ADR 0019).

## Coverage

Trục: nguồn-định-nghĩa (`config.yaml` · `evals.yaml` · nguồn thứ ba tương lai) × chiều
(đỏ: đổi định nghĩa → làn chạy · im: đổi vật hồ sơ → vẫn bỏ qua) × hình thức (đo quan hệ
× danh sách gõ tay). Mỗi ô một assert viết trước.

## Out of scope

- Tệp untracked (khai thành giới hạn ở AC-3, không sửa ở vòng này).
- Đưa vị từ bash và JS về một nguồn (ADR 0019 đã khai ngưỡng riêng).
- Mọi mục Known limits khác của `chu-ky-khong-tu-lam-hoa-cu`.

## Notes

- **Chưa chạy vòng.** Mở ở `draft` theo định đoạt Cổng Bằng chứng 15/09; suất vòng meta
  của cửa sổ 2.12 → 2.13 đã dùng (CLAUDE.md luật chiều rộng (b)). Vào cửa sổ 2.14.
- Nguồn phát hiện: lượt chấm 5 của `chu-ky-khong-tu-lam-hoa-cu`
  (`_acceptance/chu-ky-khong-tu-lam-hoa-cu/review-findings.md`, mục ngoài hợp đồng
  «--skip-unchanged loại trừ trọn _acceptance/** nên bỏ qua cả khi chính định nghĩa phép
  đo đổi»), và sổ quyết định `d-20260915T083000Z-18`.
- Khi mở vòng: đọc trước khối `SKIP-UNCHANGED-PREDICATE` trong
  `feature-loop/scripts/repin-lane.mjs` và ma trận 4 ô của SK1b — vị từ mới phải giữ trọn
  bốn ô đó.
