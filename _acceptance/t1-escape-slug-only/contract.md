---
schema_version: 1
feature: Răng T1-escape chỉ miễn trừ khi PR mang _acceptance/<slug>/ thật
slug: t1-escape-slug-only
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli]
status: implemented
approved_by: Manh Phan
approved_at: 2026-08-12
time_human_minutes: {gate1: 0, gate2: 0}
---

# Acceptance Contract: t1-escape-slug-only

## Context

Răng T1-escape của `pre-merge-check.sh` chặn merge khi PR đổi file mã ngoài
`t1_skip_globs` (hoặc chạm `t3_paths`) mà không mang bằng chứng nghiệm thu.
Điều kiện "có mang bằng chứng" đang tính **mọi** đường dẫn dưới `_acceptance/`,
kể cả `config.yaml` và `README.md` — tức **cấu hình cổng được tính là bằng
chứng**. Hệ quả: sửa một dòng config là đủ dập toàn bộ răng cho phần còn lại
của PR, trên mọi repo tiêu thụ.

Không phải suy luận — đo được ở floorplanstudio PR #6 (2026-08-12): PR đổi 30+
file mã non-T1 bị chặn ĐÚNG; commit kế tiếp sửa `_acceptance/config.yaml` để
trỏ executor sang CLI mới, và CÙNG bộ mã đó pass, cả `pre-merge-check` local
lẫn CI `gate`. `git diff --name-only main...HEAD | grep _acceptance` chỉ ra
đúng một file: `config.yaml`. Không slug nào.

Source input: prompt (phiên 2026-08-12) + bằng chứng tại
https://github.com/phanlemanh/floorplanstudio/pull/6#issuecomment-5264066060

**Ghi chú trung thực về thứ tự làm** (người duyệt cần biết để chấm đúng): bản
vá và ca phản chứng (counter-case) đã viết TRƯỚC hồ sơ này, theo lệnh trực tiếp của owner ("vá
lỗ T1-escape trước, rồi chạy acceptance gate"). Rủi ro thường trực của thứ tự
đó là tiêu chí uốn theo thứ đã xây. Ở đây rủi ro thấp hơn thường lệ vì tiêu
chí neo vào một **khiếm khuyết quan sát được độc lập, trước khi có bản vá**
(PR #6), và TE21/TE22 đã được chạy và thấy ĐỎ trước khi sửa một dòng nào của
`pre-merge-check.sh`. Người duyệt vẫn nên đọc AC dưới đây như tiêu chí độc
lập, không như mô tả bản vá.

## Criteria

- AC-1: Given một PR đổi file mã ngoài `t1_skip_globs` và không có thư mục
  `_acceptance/<slug>/` nào trong diff, When PR đó cũng sửa `_acceptance/config.yaml`,
  Then `pre-merge-check --base <ref>` VẪN in `VIOLATION [PR]` và exit khác 0.
- AC-2: Given cùng tình huống AC-1, When luật nổ, Then thông điệp liệt kê đúng
  file mã vi phạm (ví dụ `src/app.js`), không liệt `_acceptance/config.yaml`.
- AC-3: Given một PR đổi file mã non-T1, When PR đó sửa `_acceptance/README.md`,
  Then luật VẪN nổ — README của thư mục cổng cũng không phải bằng chứng.
- AC-4: Given một PR đổi file mã non-T1, When PR đó mang một thư mục
  `_acceptance/<slug>/` thật (có ít nhất một file bên trong), Then luật KHÔNG
  nổ — miễn trừ hợp lệ còn nguyên vẹn.
- AC-5: Given một PR chỉ đổi file T1 thuần (`docs/**`), When chạy `pre-merge-check`,
  Then không có `VIOLATION [PR]` và exit 0 (true-negative, không báo động giả).
- AC-6: Given bản vá đụng một file trong `t3_paths` của chính kit, When chạy
  toàn bộ suite `tests/scripts` và `tests/plugins`, Then 0 ca đỏ.
- AC-7: Given kit có luật additive-only (DV5) canh hai file cưỡng chế, When bản
  vá sửa dòng luật cũ, Then dòng bị thay phải nằm trong `ALLOWED_REMOVALS` kèm
  lý do, và DV5 xanh trở lại — dùng cửa thoát có khai báo, không nới luật.
- AC-8: Given kit phát hành plugin từ `plugins/acceptance-gate/scripts/`, When
  sửa `scripts/pre-merge-check.sh`, Then bản mirror phải đồng bộ byte-đối-byte
  (`sync-plugin-packages.sh --check` xanh) — nếu không, consumer cài plugin vẫn
  dính lỗ.
- AC-9: Given bản vá đổi hành vi cưỡng chế, When đọc diff, Then version plugin
  đã bump (1.40.0 → 1.40.1) ở cả 4 manifest — consumer không có cách nào biết
  mình đang chạy bản thủng hay bản vá nếu version đứng yên. (judgment)
- AC-10: Given người vá có thể siết quá tay, When đọc phạm vi thay đổi, Then
  bản vá KHÔNG đổi bất kỳ luật nào khác của `pre-merge-check.sh` (gap-probe,
  per-slug, staleness, T3, cờ `--no-t1-escape`). (judgment)

## Coverage

Quét theo trục "cái gì được tính là bằng chứng" × "luật phải nổ hay không nổ":

- Trục **vật trong diff**: `_acceptance/config.yaml` (AC-1,2) | `_acceptance/README.md`
  (AC-3) | `_acceptance/<slug>/file` (AC-4) | không có gì dưới `_acceptance/`
  (đã có TE1 sẵn) | chỉ file T1 (AC-5) [thước CE: 4 nhánh của `case` sau khi vá]
- Trục **chiều của phép thử**: phải-nổ (AC-1,2,3) | phải-KHÔNG-nổ (AC-4,5) —
  bắt buộc có cả hai, vì một bản vá siết quá tay sẽ xanh hết nhánh phải-nổ và
  biến mọi PR có gate thành đỏ vĩnh viễn [thước CE: TE23 là răng chiều ngược]
- Trục **lan toả sang consumer**: mirror plugin (AC-8) | version (AC-9)
  [thước CE: P30 `sync-plugin-packages.sh --check`]
- Trục **không làm hỏng thứ khác**: suite toàn phần (AC-6) | luật additive-only
  (AC-7) | các luật khác không đổi (AC-10)

Trục đã cân nhắc và bỏ: *hiệu năng* (vá là một `case` shell, không đo được
khác biệt), *tương thích ngược cho repo đang lợi dụng lỗ* — cố ý bỏ, vì đó
chính là hành vi cần chấm dứt.

## Out of scope

- **Không** truy ngược các PR đã merge nhờ lỗ này ở các repo tiêu thụ. Việc đó
  là kiểm toán riêng, cần người quyết từng ca; bản vá chỉ chặn từ nay.
- **Không** thêm ánh xạ path→slug ("file mã này phải thuộc slug nào"). Comment
  trong mã đã ghi là kit cố ý không có ánh xạ đó; bản vá giữ nguyên giới hạn,
  chỉ siết đúng nghĩa "có slug".
- **Không** đụng luật gap-probe, per-slug, staleness, T3 hay cờ `--no-t1-escape`.
- **Không** tự động cập nhật bản vendored trong các repo tiêu thụ
  (floorplanstudio, artifact-platform…) — đó là việc rollout riêng, có PR riêng.
- **Không** đổi thông điệp violation đang có (nó vốn đã hứa đúng điều kiện
  `_acceptance/<slug>/`; bản vá làm mã khớp lời hứa, không sửa lời hứa).

## Notes

- Đây là T3 vì `scripts/pre-merge-check.sh` nằm trong `t3_paths` của chính kit,
  với lý do đã ghi sẵn trong config: "lỗi ở đây biến thành false-green im lặng
  trên MỌI repo tiêu thụ". Theo luật T3, mọi mục judgment cần người phán trực
  tiếp ở Cổng 2 — verdict máy cao nhất có thể đạt là PENDING-JUDGMENT.
- Nhánh: `fix/t1-escape-slug-only`, commit `f34c01d`.
- Lỗ THỨ HAI phát hiện khi chạy cổng (hợp đồng `status: draft` cũng đủ
  miễn trừ T1-escape, vì luật per-slug bỏ qua slug draft — dòng 549). Owner
  quyết 2026-08-12: **hồ sơ RIÊNG**, không gộp vào đây.
- Ca phản chứng: TE21 (config.yaml không miễn trừ), TE22 (README.md không miễn
  trừ), TE23 (slug thật VẪN miễn trừ) trong `tests/scripts/run-tests.sh`.
