---
schema_version: 1
feature: Sổ luật-đã-chạy — `clean` phải được chứng minh, không phải mặc định
slug: premerge-rules-ledger
risk_tier: T3
surfaces: [cli]
status: implemented
approved_by: Manh Phan
approved_at: 2026-07-26T20:45:00Z
owner: manh@mstar.vn
---

## Criteria

- AC-1: Given một repo hợp lệ mà mọi luật enabled đều chạy trọn và không có vi phạm, When chạy `pre-merge-check.sh` với `--base` hợp lệ, Then vẫn in `pre-merge-check: clean` và exit 0 — true-negative: sổ luật KHÔNG được làm cổng khó thêm với người dùng đúng.
- AC-2: Given một khối luật bị TRƯỢT QUA không khai báo (tiêm mô phỏng: vô hiệu khối gap-probe-scope bằng return sớm trong bản sao script), When script chạy tới cuối không violation nào khác, Then KHÔNG in `clean`; in `VIOLATION [ledger]:` nêu ĐÍCH DANH tên khối thiếu và exit 2 — fail-CLOSED tại đầu ra, cùng doctrine ADR 0004.
- AC-3: Given luật tắt có khai báo, When chạy pre-merge, Then sổ ghi `declared-off` theo BẢNG DUY NHẤT sau — EXPECTED là danh sách ĐÓNG, CỐ ĐỊNH, không phụ thuộc config; mọi khối kết thúc bằng đúng một trong hai dòng `ran <tên>` hoặc `declared-off <tên>`:
  | Nguồn tắt | Dòng sổ |
  |---|---|
  | cờ `--no-t1-escape` | `declared-off t1-escape` |
  | `gap_probe: off` trong config | `declared-off gap-probe` |
  | thiếu `--base` (marker NOT ENFORCED) | `declared-off` cho khối tương ứng |
  | mọi đường đi qua hàm `*_not_enforced` | `declared-off` |
  Không có biểu diễn "loại khỏi expected" — một kiểu duy nhất, hai nửa script không thể hiểu hai kiểu.
- AC-12: Given consumer VẮNG `node` ở mode `gap_probe: advisory` (trạng thái môi trường mà AC-14 của gap-probe-presence-hook CHO PHÉP), When chạy pre-merge, Then đường đó đi qua `gap_probe_not_enforced` nên sổ ghi `declared-off gap-probe` — clean vẫn hợp lệ, exit 0, KHÔNG hard-fail vì một trạng thái kit cho phép. Đối chứng dương: có node → `ran gap-probe`.
- AC-4: Given chạy KHÔNG có `--base` (các luật diff-scope tự khai tắt qua marker như hành vi hiện tại), When mode gap_probe là `advisory`, Then sổ khớp và exit code không đổi so với trước feature — sổ luật không đổi ngữ nghĩa của bất kỳ luật nào.
- AC-5: Given bất kỳ lần chạy nào đi tới kết luận (kể cả kết luận `VIOLATION [ledger]`), When đọc stdout, Then có ĐÚNG MỘT dòng `pre-merge-check: rules ran=<n> declared-off=<m> expected=<k>` trong đó `k` được TÍNH TỪ EXPECTED — độc lập với n và m, TUYỆT ĐỐI không phải `n+m` (in `expected=n+m` là tautology tự khớp, dòng tổng kết không bao giờ hiển thị lệch được). Lần chạy sạch: `n+m == k`; lần `VIOLATION [ledger]`: dòng vẫn in và `n+m != k` — chính nó là bằng chứng lệch. Lần chạy KHÔNG tới kết luận (exit 2 ở parse) không in dòng này.
- AC-6: Given mã nguồn `pre-merge-check.sh`, When soi cấu trúc, Then chỉ có ĐÚNG HAI lối thoát exit 0: (a) `no _acceptance/ — nothing to check`, (b) qua điểm nghẽn sổ rồi in `clean`. Script hiện KHÔNG có `--help`; nếu sau này thêm thì đó là một lần sửa contract này, không phải một lần nới suite. Kiểm bằng máy, không bằng mắt.
- AC-7: Given mã script, When soi cấu trúc, Then (a) EXPECTED khai ở MỘT nơi; (b) mọi khối luật ghi sổ qua ĐÚNG MỘT hàm `ledger_mark <ran|declared-off> <tên>` — chữ ký lexical để máy đếm được; (c) suite đếm số TÊN duy nhất xuất hiện trong các call-site `ledger_mark` và so BẰNG với độ dài EXPECTED — thêm khối mới mà quên khai sổ, hoặc ghi tên không có trong EXPECTED, đều làm suite kit ĐỎ; (d) điểm nghẽn so set-equality HAI CHIỀU: tên thiếu → `VIOLATION [ledger]: luật <tên> không chạy và không khai tắt`; tên THỪA (ghi sổ mà không trong EXPECTED) → `VIOLATION [ledger]: tên lạ <tên> — cập nhật EXPECTED` — cả hai exit 2.
- AC-8: Given ba lỗ đã vá ở feature trước (cờ lạ positional · cờ làm giá trị `--base` · ROOT không tồn tại), When tái chạy đúng các lệnh đó, Then vẫn exit 2 với đúng thông điệp cũ — hồi quy: sổ luật không nới lỏng các chốt parse hiện có.
- AC-9: Given một biến thể lỗi CHƯA TỪNG vá (tiêm: làm vòng per-slug bỏ qua toàn bộ slug bằng cách phá điều kiện lặp trong bản sao script), When chạy trên repo có ít nhất một slug enabled, Then điểm nghẽn bắt được — chứng minh chốt đầu-ra bắt lỗ KHÔNG nằm trong danh sách đã biết, đúng lý do tồn tại của feature.
- AC-10: (judgment) Given một người chưa từng đọc kit thấy `VIOLATION [ledger]` trong output CI, When đọc thông điệp, Then họ hiểu đây là lỗi NỘI TẠI của cổng (không phải lỗi code của họ), biết khối nào thiếu, và biết bước tiếp theo là báo maintainer kèm output của lần chạy — không phải đi sửa feature của mình.
- AC-11: Given mode `strict`/`warn`/`off` của enforcement hiện có, When enforcement là `off`, Then sổ luật cũng tắt theo (off là off toàn cục, đã có tiền lệ) — nhưng `warn` KHÔNG hạ điểm nghẽn xuống NOTE: sổ lệch là lỗi nội tại của cổng, không phải vi phạm của feature, nên không có mức "nhắc".

## Coverage

- Trục kết cục sổ: khớp (clean) | thiếu-không-khai (VIOLATION ledger, exit 2) | tắt-có-khai (declared-off, clean hợp lệ) [thước CE: AC-1/AC-2/AC-3]
- Trục nguồn tắt-có-khai: cờ `--no-t1-escape` | config `gap_probe: off` | thiếu `--base` (marker) [thước CE: AC-3/AC-4]
- Trục tương thích ngược: lần chạy sạch không đổi exit code | ba chốt parse cũ còn nguyên [thước CE: AC-1/AC-4/AC-8]
- Trục lỗ-chưa-biết: một biến thể tiêm KHÔNG nằm trong danh sách đã vá phải bị bắt [thước CE: AC-9 — đây là trục biện minh cho cả feature; thiếu nó thì sổ chỉ là blacklist thứ năm]
- Trục mục nát danh sách: thêm khối luật mới mà quên khai sổ → suite kit đỏ [thước CE: AC-7]
- Trục tín hiệu máy-đọc: dòng tổng kết ghim nguyên văn, đúng một lần [thước CE: AC-5]
- Trục cấu trúc lối thoát: đúng ba lối exit 0, kiểm bằng máy [thước CE: AC-6]
- Trục enforcement: off tắt toàn cục | warn KHÔNG hạ điểm nghẽn [thước CE: AC-11 — an toàn vì mọi trạng thái môi-trường-được-phép đều là declared-off theo AC-12, nên sổ lệch thật sự chỉ còn nghĩa lỗi nội tại]
- Trục phụ-thuộc-vắng-được-phép: node vắng ở advisory → declared-off, không hard-fail [thước CE: AC-12, kèm đối chứng dương có-node]
- Trục hai chiều của sổ: tên thiếu | tên thừa — cả hai VIOLATION riêng biệt [thước CE: AC-7d]

## Out of scope

- **Chuyển vòng parse sang Node.** Đúng hướng chất liệu (argv là mảng đóng) nhưng script phải chạy được khi consumer vắng node ở mode advisory (AC-14 của gap-probe-presence-hook cho phép điều đó). Cân nhắc lại sau khi sổ chạy ổn.
- **Sửa bản `pre-merge-check.sh` đã vendor ở repo consumer.** Biên phân phối — đã có cảnh báo version-floor trong tài liệu từ feature trước; code ở HEAD không với tới được.
- **Đổi hành vi/ngữ nghĩa của bất kỳ luật nào.** Sổ chỉ QUAN SÁT các khối; một luật đổi hành vi trong feature này là scope creep.
- **Sổ cho `recheck-evidence.js` hay hook.** Cùng bất biến nhưng khác tiến trình; nếu sổ chứng minh giá trị thì mở contract riêng.

## Notes

- Biểu diễn sổ theo BẢNG ở AC-3 — một kiểu duy nhất (EXPECTED cố định + declared-off), đã chốt tại Cổng 1, không còn là lựa chọn của implementer.
- Case trong suite dùng tiền tố `RL*`; case plugins dùng `P48`+.
- MỌI assertion mới theo bất biến CLAUDE.md #4: đối chứng dương + ghim đúng thông điệp. Đặc biệt AC-2/AC-9 dựng bản sao script bị tiêm — bản sao NGUYÊN VẸN phải xanh trước.
