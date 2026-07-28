---
schema_version: 1
feature: Tách phạm vi răng T1-escape khỏi phạm vi diff (cờ opt-out + thứ tự bump version)
slug: t1-escape-event-scope
risk_tier: T3
surfaces: [cli]
status: verified
approved_by: Manh Phan
approved_at: 2026-07-26T11:40:00Z
time_human_minutes:
  gate1: 10
owner: manh@mstar.vn
---

## Criteria

- AC-1: Given consumer chạy `pre-merge-check.sh . --base <ref>` KHÔNG kèm cờ mới (đúng như `acceptance-init` bước 5 hướng dẫn), When diff có file non-T1 mà PR không mang `_acceptance/<slug>/`, Then VIOLATION và thoát khác 0 — hành vi Y HỆT hôm nay. Cờ mới là opt-OUT: repo tiêu thụ không sửa gì thì không mất lớp bảo vệ nào.
- AC-2: Given `--no-t1-escape` có mặt cùng `--base`, When diff có file non-T1 (kể cả file khớp `t3_paths`) mà không có `_acceptance/`, Then KHÔNG có VIOLATION nào từ răng T1-escape, và exit code không bị nó làm khác 0.
- AC-3: Given răng T1-escape bị tắt bằng `--no-t1-escape`, When chạy pre-merge, Then stdout PHẢI có ĐÚNG MỘT dòng marker NGUYÊN VĂN `T1-ESCAPE: NOT ENFORCED reason=push-event-no-pr-premise` VÀ ĐÚNG MỘT dòng tổng kết NGUYÊN VĂN `pre-merge-check: T1-escape: KHÔNG cưỡng chế trong lần chạy này (xem dòng marker NOT ENFORCED ở trên)` — cùng khuôn `GAP-PROBE: NOT ENFORCED` (ADR 0004). Cả hai chuỗi là HẰNG, không phải mẫu tự do: `reason` là hằng cố định (cờ KHÔNG nhận tham số, đúng ranh giới "không thêm cờ nào khác"), và cả hai được ghim để CI grep được và để suite không thể tự viết đề lẫn đáp án. Tắt im lặng là không được phép.
- AC-4: Given `--no-t1-escape` có mặt, mode `gap_probe: required`, và một slug T3 `implemented+` trong diff thiếu `gap-probe.md` lẫn entry descope, When chạy pre-merge, Then VẪN VIOLATION gap-probe và thoát khác 0 — cờ chỉ tắt răng T1-escape, không tắt luật khác.
- AC-5: Given `--no-t1-escape` có mặt và một slug có evidence thiếu chữ ký / verdict không PASS / evidence stale, When chạy pre-merge, Then các luật per-slug đó VẪN cho VIOLATION như thường — cờ không phải bypass toàn cục.
- AC-6: Given `.github/workflows/gate.yml`, When soi nội dung, Then nhánh `push` truyền base VÀ đúng chuỗi `--no-t1-escape` (không tham số); nhánh `pull_request` truyền base và KHÔNG có cờ đó; KHÔNG nhánh nào chạy pre-merge mà thiếu base (thiếu base là VIOLATION gap-probe theo ADR 0004).
- AC-7: Given `plugins/**` nằm trong `risk_tiers.t1_skip_globs`, When một PR chỉ đổi file dưới `plugins/` mà không mang `_acceptance/`, Then răng T1-escape KHÔNG nổ — mirror là sản phẩm sinh máy, P30 canh `mirror == nguồn` độc lập nên miễn trừ này không mở lỗ.
- AC-14: Given diff HỖN HỢP — có file dưới `plugins/` VÀ có file non-T1 (vd `scripts/pre-merge-check.sh`) — mà không mang `_acceptance/`, When chạy KHÔNG cờ, Then VẪN VIOLATION, và danh sách in ra liệt kê ĐÚNG file non-T1, KHÔNG liệt file dưới `plugins/`. `t1_skip_globs` lọc TỪNG FILE, TUYỆT ĐỐI không phải "diff có chạm một glob T1 nào đó thì cả diff là T1". Đây là ca thường gặp NHẤT của repo này: CLAUDE.md bắt sync mirror cùng lượt với mọi sửa nguồn, nên gần như MỌI PR thật đều chạm `plugins/**` — đọc nhầm thành whole-diff là răng chết im lặng trên gần hết PR.
- AC-15: Given diff CHỈ có file khớp `t1_skip_globs` thuần (vd `docs/x.md`) và không mang `_acceptance/`, When chạy KHÔNG cờ, Then KHÔNG nổ — true-negative chứng minh glob mới không over-match.
- AC-8: Given ai đó sửa TAY một file dưới `plugins/` cho lệch nguồn, When chạy `tests/plugins/run-tests.sh`, Then P30 VẪN đỏ — chứng minh miễn trừ ở AC-7 không phải là lỗ.
- AC-9: Given ba manifest version (`.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `codex/acceptance-gate/.codex-plugin/plugin.json`) được bump lên cùng một số mới, When chạy `tests/plugins/run-tests.sh`, Then KHÔNG case nào phải sửa — suite kiểm ba manifest KHỚP NHAU, không ghim literal.
- AC-10: Given một trong ba manifest bị để lệch số so với hai cái kia, When chạy `tests/plugins/run-tests.sh`, Then ĐỎ — miễn trừ literal ở AC-9 không được biến case thành `assert x == x`.
- AC-11: Given GUIDE mô tả vòng đời feature, When đọc mục S3/S5, Then nói rõ bump version + sync mirror thuộc S3 (TRƯỚC verify), kèm lý do: bump sau Cổng 2 làm evidence stale và huỷ chính chữ ký vừa lấy.
- AC-12: Given tài liệu `acceptance-init` của CẢ HAI harness (Claude + Codex), When đọc bước hướng dẫn wire CI, Then có nhắc cờ `--no-t1-escape` cho job chạy trên push, để consumer không dẫm lại đúng cái bẫy này.
- AC-16: Given một repo fixture mô phỏng ĐÚNG commit hạ tầng đã repro (chạm file non-T1 nằm trong `t3_paths`, KHÔNG có file nào dưới `_acceptance/`), và slug trong repo đó đã `signed-off` với evidence pin commit TRƯỚC đó, When chạy `pre-merge-check.sh` HAI LẦN trên CÙNG commit — một lần không cờ, một lần `--no-t1-escape` — Then lần không cờ CÓ `VIOLATION [PR]`, lần có cờ KHÔNG còn `VIOLATION [PR]` nào. Đây là thước đo DELTA của cờ trên chính triệu chứng gốc: 15 AC còn lại đo hành vi, AC này đo hiệu quả.
- AC-17: Given cùng fixture ở AC-16 chạy VỚI cờ, When còn violation nào khác `VIOLATION [PR]`, Then chúng phải được NÊU TÊN trong bằng chứng — hiện là staleness (`evidence is stale`), một luật KHÁC có tiền đề PR riêng và nằm NGOÀI phạm vi feature này. Cấm để bằng chứng ngụ ý "cổng đã sạch" khi nó chưa sạch; cấm làm fixture yếu đi (bỏ `verified_commit`) để có màu xanh.
- AC-13: (judgment) Given một người đọc bằng chứng CI thấy dòng marker `T1-ESCAPE: NOT ENFORCED`, When họ chưa từng đọc kit, Then họ hiểu được LỚP NÀO đang tắt, VÌ SAO nó tắt, và điều đó có nghĩa rủi ro gì — chứ không chỉ thấy một chuỗi viết hoa.

## Coverage

- Trục sự kiện CI: `pull_request` (răng bật) | `push` (răng tắt) | chạy tay không cờ (răng bật) [thước CE: AC-1/AC-2/AC-6]
- Trục tương thích ngược: consumer chỉ truyền `--base` như tài liệu cũ dạy → KHÔNG mất lớp bảo vệ nào [thước CE: AC-1 — đây là trục quan trọng nhất, vì phương án opt-in bị loại chính vì trục này]
- Trục cô lập của cờ: cờ chỉ tắt răng T1-escape | không đụng gap-probe | không đụng evidence/signoff/stale [thước CE: AC-2/AC-4/AC-5]
- Trục tín hiệu khi tắt: có marker máy-đọc + dòng tổng kết khai | im lặng [thước CE: AC-3, cùng khuôn ADR 0004]
- Trục phân loại file trong diff: có `_acceptance/` | chỉ `t3_paths` | chỉ non-T1 | chỉ T1 thuần | chỉ `plugins/` | **HỖN HỢP `plugins/` + non-T1** [thước CE: AC-1/AC-2/AC-7/AC-14/AC-15 — ca hỗn hợp là ca THƯỜNG GẶP NHẤT của repo này, không phải ca biên]
- Trục triệu chứng gốc: cổng đỏ vì lý do cấu trúc → cờ gỡ được PHẦN của răng T1-escape [thước CE: AC-16 đo delta hai lần chạy]
- Trục trung thực của bằng chứng: violation còn lại được nêu tên | bị che [thước CE: AC-17 — `--no-t1-escape` chỉ chữa MỘT trong hai luật chặn commit hạ tầng; staleness còn nguyên]
- Trục miễn trừ mirror KHÔNG được thành lỗ: sửa tay mirror vẫn bị P30 bắt [thước CE: AC-8 — đây là RED bắt buộc của AC-7]
- Trục ghim version trong suite: bump ba manifest cùng lúc (không sửa suite) | để lệch một cái (phải đỏ) [thước CE: AC-9/AC-10 — cặp dương/âm, tránh `assert x == x`]
- Trục tài liệu vòng đời: GUIDE nói bump ở S3 | acceptance-init nhắc cờ cho job push [thước CE: AC-11/AC-12]

## Out of scope

- **Suy ra sự kiện CI từ biến môi trường** (`GITHUB_EVENT_NAME`, `CI`, …). Script phải chạy y hệt ở máy người và ở CI; một luật đọc env ngầm là luật không kiểm được và không port được sang CI khác.
- **Đổi `--no-t1-escape` thành opt-in `--pr`.** Đã loại ở thiết kế: consumer hiện tại được dạy truyền đúng `--base`, nên opt-in làm răng tắt im lặng trên mọi repo đang chạy — biến một sửa lỗi thành lỗ fail-open hàng loạt.
- **Miễn trừ `.github/**` khỏi `t1_skip_globs`.** Đổi CI có thể tắt cổng; đó đúng là thứ răng T1-escape phải bắt.
- **Miễn trừ `.claude-plugin/plugin.json` / `.codex-plugin/plugin.json`.** Manifest khai được `hooks`, nên miễn trừ trọn file là mở lỗ. Ca bump version được giải bằng AC-9 (suite thôi ghim literal) + AC-11 (bump ở S3), không bằng miễn trừ.
- **Sửa `_acceptance/config.yaml` của repo tiêu thụ.** Kit chỉ đổi config self-host của chính nó; consumer tự quyết `t1_skip_globs` của họ.

## Notes

- Cờ `--no-t1-escape` phải in marker qua **một** hàm duy nhất, cùng khuôn `gap_probe_not_enforced` đã có — không viết lại logic in ấn lần hai (bài học parity của `gap-probe-presence-hook`: hai bản cài đặt giữ bằng comment là parity không có răng).
- Marker viết ĐÚNG chuỗi `T1-ESCAPE: NOT ENFORCED reason=` — CI có thể grep, đổi một ký tự là tắt tín hiệu.
- Mọi assertion mới phải CHỨNG MINH BIẾT ĐỎ: tiêm vi phạm, thấy fail đúng thông điệp, gỡ ra, thấy xanh lại.
- Case trong suite dùng tiền tố `TE*` (`GP*` và `GPM*` đã bị dùng hết).
