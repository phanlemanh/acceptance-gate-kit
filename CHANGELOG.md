# CHANGELOG — acceptance-gate kit

> Mỗi release một mục, nói tiếng người: đổi gì · ai bị ảnh hưởng · làm gì khi
> update. Sử chi tiết từng bản 1.x sống trong `description` của manifest
> (`.claude-plugin/plugin.json`) — file này bắt đầu từ 2.0.0.

## 2.0.0 — 2026-08-08 (acceptance-gate + feature-loop cùng lên 2.0.0)

> Món *ký gộp một lệnh* (sign-batch) RÚT khỏi bản này theo lối-thoát-khai-trước
> (4 vòng S4 liên tiếp, fail-open đổi da 4 lần trên parser tự chế) — làm lại ở 2.1
> trên `lib/workspace-record.js`. Ba món dưới đây giữ nguyên.

Bản "ceremony diet" của đợt tái lập (charter:
`docs/plans/2026-08-07-tai-lap-don-gian-va-trien-khai-doi.md`). Toàn bộ là
BỚT nghi thức — **chuẩn bằng chứng giữ nguyên 100%**: hook chữ ký,
commit-chữ-ký-riêng (`require_human_commit`), recheck, pre-merge không đổi
một răng nào.

**Đổi gì:**

- **Bỏ điền phút tại cổng.** Không ai hỏi số phút ở Cổng 1/Cổng 2 nữa;
  `time_human_minutes` thành tuỳ chọn (điền tay vẫn hợp lệ). Số phút cũ
  trong hồ sơ được giữ nguyên nhưng mọi báo cáo dán nhãn
  "tự khai — không đáng tin" (owner tự nhận điền đại, 2026-08-07).
- **KPI phía người đổi:** từ phút-tự-khai sang **tần suất
  sự-kiện-cần-người** — đếm từ git, lệnh chuẩn trong
  `commands/acceptance-report.md` (số commit chạm dòng human-owned của hồ
  sơ). Không field mới, không nghi thức mới.
- **Re-pin theo release:** merge chạm engine giữa hai release không kéo
  chiến dịch re-pin từng lần nữa — re-pin chạy MỘT chiến dịch tại mốc
  release (chính sách trong GUIDE.md + CLAUDE.md; máy móc staleness giữ
  nguyên).
- **Đổi số version thật (1.39.0/1.27.0 → 2.0.0 cả hai gói):** để
  `plugin update` không bị bug bỏ-qua-khi-số-trùng; từ nay mọi release có
  mục CHANGELOG này.

**Ai bị ảnh hưởng / làm gì:**

- Người dùng kit: `claude plugin update` (hoặc uninstall+install nếu nghi
  cache); kiểm version in ra = 2.0.0. Feature đang giữa vòng: ký nốt theo
  luật cũ rồi mới update máy đó.
- Không có thay đổi nào phá hồ sơ cũ: mọi contract/evidence hiện có đọc
  được nguyên trạng.

## 1.x (2026-06 → 2026-08-07)

Sử từng bản 1.9.0 → 1.39.0 (acceptance-gate) và → 1.27.0 (feature-loop)
nằm trong `description` của manifest tương ứng tại thời điểm bản đó — xem
`git log` của `.claude-plugin/plugin.json` và
`feature-loop/.claude-plugin/plugin.json`.
