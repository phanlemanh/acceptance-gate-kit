# Tách phạm vi răng T1-escape khỏi phạm vi diff — thiết kế

**Ngày:** 2026-07-26 · **Slug:** `t1-escape-event-scope` · **Tier:** T3

## Triệu chứng

Job `gate` của chính kit đỏ trên `push: branches: [main]` với **mọi** commit hạ
tầng — release, mirror-sync, chỉnh CI. Kiểm chứng tại `834eae8`:

```
$ bash scripts/pre-merge-check.sh . --base "$(git rev-parse HEAD~1)"
VIOLATION [PR]: non-T1 files changed (outside t1_skip_globs) but the PR
carries NO _acceptance/<slug>/ artifacts ...
    .claude-plugin/plugin.json ... tests/plugins/run-tests.sh
pre-merge-check: 2 violation(s) — merge blocked   (EXIT=1)
```

Cổng đỏ trên nhánh chính vì lý do **cấu trúc** (không phải vì code sai) đúng là
failure mode mà `docs/adr/0004` viết ra để chống: cổng mất tín nhiệm, người ta
tắt nó.

**Hai** vi phạm, không phải một — gap-probe context sạch bắt tôi bỏ sót điều này:

| Vi phạm | Là gì | Trạng thái |
|---|---|---|
| `VIOLATION [PR]: non-T1 files changed…` | răng T1-escape — **đây là feature này** | còn |
| `VIOLATION [gap-probe-presence-hook]: verdict=PENDING-JUDGMENT` | verdict tạm của feature TRƯỚC, chờ chữ ký Cổng 2 | đã hết ở `ea38973` |

Vi phạm thứ hai là **nhất thời và đúng hành vi** (cổng chặn merge khi chưa có
chữ ký người). Nêu ra vì khối repro ở trên in "2 violation(s)" mà chẩn đoán chỉ
nói về một — im lặng về cái còn lại là cách một feature "đạt acceptance" mà mục
tiêu vẫn không đạt. AC-16 đo trực tiếp mục tiêu: fixture commit hạ tầng, mọi
slug đã ký, chạy với cờ → **`pre-merge-check: clean`, exit 0**.

## Chẩn đoán — hai luật bị buộc chung một công tắc

`--base` hiện đang gánh **hai** nghĩa khác nhau:

| Luật | Cần gì từ `--base` | Đúng với sự kiện nào |
|---|---|---|
| gap-probe (§AC-1 contract cũ) | *phạm vi*: slug nào có file trong diff | PR **và** push — đều hợp lệ |
| Răng T1-escape | *tiền đề*: "thay đổi này là một PR, nên phải kèm artifact" | **chỉ** PR |

Trước `ead1c84`, job push không truyền base nên răng tự tắt — nhưng đó là tắt
**do tình cờ**, và cùng lúc nó làm gap-probe không cưỡng chế được. `ead1c84`
truyền base cho push để chữa gap-probe, và vô tình bật răng T1-escape ở nơi tiền
đề của nó sai. Một công tắc, hai luật, hai nhu cầu ngược nhau.

Tiền đề của răng T1-escape sai trên push vì: một commit release **theo thiết kế**
không mang `_acceptance/<slug>/` — không có feature nào để mà mang.

## Phương án

### Đã loại: `--pr` (opt-IN)

Thêm cờ `--pr`, răng chỉ chạy khi có cờ. **Loại** vì consumer hiện tại được
`acceptance-init` hướng dẫn truyền **đúng `--base`** (bước 5). Đổi sang opt-in
làm răng **tắt im lặng trên mọi repo tiêu thụ đang chạy** — biến một sửa lỗi
thành một lỗ fail-open hàng loạt. Đây chính là lớp lỗi `d-128` vừa bịt.

### Chọn: `--no-t1-escape` (opt-OUT, mặc định giữ nguyên)

- Không cờ → hành vi **y hệt hôm nay**. Consumer cũ không đổi gì.
- Có cờ → răng tắt, và **phải kêu to**: in marker máy-đọc
  `T1-ESCAPE: NOT ENFORCED reason=<lý do>` + dòng tổng kết khai đã tắt — cùng
  khuôn với `GAP-PROBE: NOT ENFORCED` (ADR 0004), để CI grep được và người đọc
  log thấy được lớp nào đang tắt.
- Cờ **không** đụng gì tới gap-probe, evidence, signoff, staleness. Một cờ, một
  luật.

Đổi lại: opt-out là một dạng bypass. Chống lạm dụng bằng **tiếng ồn bắt buộc**
chứ không bằng cấm — cấm thì người ta quay lại bỏ `--base`, và mất luôn gap-probe.

## Nửa thứ hai: commit release huỷ chữ ký vừa lấy

Cùng gốc, khác mặt. Ba việc:

1. **Thứ tự đúng: bump version thuộc S3, không phải S5.** Bump sau Cổng 2 thì
   staleness guard bắt đúng — evidence pin commit trước bump. Đây là sửa TÀI
   LIỆU (GUIDE), không phải sửa mã. Rẻ nhất và giải quyết ca thường gặp nhất.
2. **`plugins/**` vào `t1_skip_globs`.** Mirror sinh máy (ADR 0001), đã có P30
   canh `mirror == nguồn`. Sửa tay ở mirror bị P30 chặn độc lập, nên miễn trừ
   nó khỏi răng T1-escape/staleness **không mở lỗ nào**. KHÔNG miễn trừ
   `.github/**` (đổi CI có thể tắt cổng — đúng thứ răng phải bắt) và KHÔNG miễn
   trừ `.claude-plugin/plugin.json` (manifest khai được `hooks`).
3. **P03/P22 thôi ghim version bằng literal.** Mục đích thật của hai case là giữ
   ba manifest **khớp nhau**, không phải ghim một con số. Ghim literal khiến mỗi
   lần bump đều sửa test — mà test đổi là code đổi thật, nên stale là đúng.
   Viết lại thành "ba manifest bằng nhau" thì bump không còn chạm test. Cạm bẫy
   phải tránh: đừng biến thành `assert x == x` — vẫn phải đỏ khi ba cái lệch.

## Ranh giới

Không đụng: luật gap-probe · thứ tự các luật per-slug · hợp đồng `--base` ·
schema evidence. Không thêm cờ nào khác. Không tự suy ra sự kiện CI từ biến môi
trường (`GITHUB_EVENT_NAME`) — script phải chạy được y hệt ở máy người, và một
luật đọc env ngầm là luật không kiểm được.
