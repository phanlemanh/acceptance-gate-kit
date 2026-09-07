# ADR 0014 — Làn ghim lại phải chạy lại eval của chính hồ sơ; dòng đời cũ là sử liệu theo mốc

2026-09-07 · chip từ kho `crm-onehub` (`_acceptance/thuoc-cache-het-doi-tuong/review-findings.md`,
mục «Lỗ re-pin của bộ kit vẫn còn nguyên», P1; mục P2 liền kề «chỉ MỘT hồ sơ được
chạy lại»). Nghi thức re-pin (ADR gốc: hồ sơ `delta-verify-repin`, 05/08) chỉ chạy
bốn lệnh suite của kho và bên đọc chỉ đòi `suites_exit` toàn 0, nên **không gì —
writer lẫn reader — buộc chạy lại `evals.yaml` của hồ sơ được ghim**. Hệ quả đo
được: hồ sơ `lenh-chung-khong-an-cache-doi` mất tiền đề (AC-3, AC-4) sau lần hợp
nhất 88 commit vẫn được ghim lại xanh hai lần và đi thẳng nhánh chính, CI xanh —
luật lệch-cây chỉ so `verified_commit` với cây, còn `verified_commit` thì làn dời
được. **Quyết:** (1) làn là **script** `feature-loop/scripts/repin-lane.mjs` —
chạy `suite_keys` và mọi eval `test`/`script` của từng hồ sơ tại HEAD, đỏ thì
không ghi gì, xanh thì tự ghi dòng `kind:repin` có `evals_exit` + section rồi tự
kiểm bằng recheck; (2) bên đọc (recheck + pre-merge, một nguồn `checkRepinEvals`
trong `lib/evidence-core.cjs`) đòi làn chống lưng `verified_commit` ghi
`evals_exit` phủ mọi eval máy của `evals.yaml` với exit 0; (3) **đường đọc-cũ theo
MỐC**: dòng không có `evals_exit` ghi trước `REPIN_EVALS_SINCE` (07/09/2026
12:00Z) là sử liệu suite-only — pre-merge NOTE, không chặn; dòng có `evals_exit`
luôn được chấm; dòng không ts không được coi là sử liệu. **Lối bị loại:** *ghim
theo diff ngay trong bên đọc* (git diff giữa pin cũ và mới so với `paths` của
eval) — đòi git trong recheck và `paths` trên mọi eval, và ~530 lượt cite cũ vẫn
đỏ; *grandfather theo khoá* (dòng thiếu `evals_exit` = đời cũ) — làn viết tay
quên khoá lọt qua đúng lớp lười đã sinh ra lỗi; *siết thẳng không đường đọc-cũ* —
~50 hồ sơ đã ký của chính kit và 17 của crm-onehub đỏ tức thì, trong khi hồ sơ
đã ký là sử liệu bất biến; *danh sách tên miễn trừ* (tiền lệ mirror-sync, 21 tên)
— 50 tên là đúng thứ luật allowlist cấm. **Đánh đổi nhận:** mốc ngày là một hằng
số, ai giả ts lùi thì qua (cùng lớp bịa `suites_exit`, không phải lớp lười);
mỗi lượt re-pin nay tốn thêm eval máy của các hồ sơ được ghim (giới hạn bởi
dedupe lệnh; nhịp một-chiến-dịch-mỗi-phát-hành KHÔNG đổi, CLAUDE.md §re-pin);
eval `ui-check`/`judgment` vẫn không được re-pin chứng lại — giới hạn khai kèm
ngưỡng «≥1 hồi quy UI lọt qua re-pin giữa hai bản phát hành» (GUIDE §7.1); repo
tiêu thụ phải vendor thêm `lib/eval-yaml.cjs` (danh sách chép của
`acceptance-init`, răng consumer-esm). Mục P2 «chạy lại eval của mọi hồ sơ sau
mỗi lần hợp nhất» được trả lời bằng chính sách đã có: giữa hai bản phát hành,
hồ sơ cũ hoá cũ là chấp nhận được; chiến dịch phát hành kế ghim lại **bằng làn
eval** là lúc mọi hồ sơ được chạy lại thật — không mở nhịp mỗi-merge.

**Sửa 2026-09-08 (owner: «Bỏ mốc `REPIN_EVALS_SINCE` đi, cần xử ngược luôn cho
đúng»).** Mốc ngày bị bỏ cùng nhánh sử liệu: làn chống lưng `verified_commit` mà
không có `evals_exit` là VIOLATION dù ghi khi nào. Lý do owner thắng lý do ADR
gốc: làn suite-only *chưa bao giờ* chứng được pin, nên «sử liệu» chỉ là tên khác
của một pin chưa chứng; và chính ngày đầu tiên mốc đã xử ngược một làn hợp lệ
theo nghi thức cũ (sổ 8015 của `release-2-9-0`) — một hằng thời gian đặt trong
phiên làm việc không thể đúng với giờ luật lên `main`. Giá nhận: 49 hồ sơ đã ký
của kit đỏ ở recheck (3 hồ sơ khác vẫn đỏ vì `mirror_sync`), đặt tên hai chiều ở
`SUITE_ONLY_LANE_DEBT` trong `tests/scripts/mirror-sync-grandfather.mjs` — cùng
khuôn ADR 0010, nhưng lần này danh sách dài vì nợ thật dài, không phải để khỏi
nghĩ; mỗi hồ sơ ghim lại bằng làn eval là một tên phải rút. Repo tiêu thụ: hồ sơ
ghim bằng làn cũ đỏ khi PR chạm nó; cách sửa duy nhất là làn eval, không cờ nới.
