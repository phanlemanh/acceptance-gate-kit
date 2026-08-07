# Design — tai-lap-ceremony-diet (GĐ1 tái lập: phẫu thuật ceremony một đợt)

**Ngày:** 2026-08-08 · **Tier:** T2 · **Nguồn:** charter
[tái lập 5 GĐ](../../plans/2026-08-07-tai-lap-don-gian-va-trien-khai-doi.md)
§GĐ1 — phạm vi KHOÁ 1a–1d, ngân sách ≤2 vòng S4 (quá → cắt 1d).

## Nguyên tắc (từ charter, không lật)

Chỉ TRỪ cơ chế, không CỘNG (ngoại lệ duy nhất: helper ký-gộp — thay nghi
thức nhiều bước bằng một lệnh). Không hạ chuẩn bằng chứng nào: hook chữ ký,
`require_human_commit`, recheck, pre-merge nguyên trạng. Mọi phép đo mới
tuân MEASURE-BIRTH-CLAUSE.

## 1a — Phút thành tuỳ chọn + KPI mới

- Đã kiểm bên đọc (grep 2026-08-08): KHÔNG hook/lib/script nào đọc
  `time_human_minutes` — chỉ file chỉ dẫn. Bỏ bắt buộc = sửa chữ, an toàn.
- Gỡ chỉ dẫn hỏi/điền phút ở: contract-template, commands/approve.md,
  commands/signoff.md, SKILL feature-loop (2 harness), twins Codex
  approve/signoff. Điền tay vẫn hợp lệ (optional — không cấm, không hỏi).
- `commands/acceptance-report.md`: dữ liệu phút cũ dán nhãn nguyên văn
  **"tự khai — không đáng tin"**; KPI phía người mới = **tần suất
  sự-kiện-cần-người**: số commit chạm dòng human-owned
  (human_signoff/human_override/approved_by) của hồ sơ, đếm bằng
  `git log --follow -L`/grep trên `_acceptance/<slug>/` — thuần đọc git,
  không field mới, không nghi thức mới.

## 1b — Helper ký-gộp `scripts/sign-batch.mjs`

Một lệnh: `node scripts/sign-batch.mjs --name "Manh Phan" [--slugs a,b]`
(mặc định: mọi hồ sơ `status: verified`). Việc nó làm: điền
`human_signoff` vào evidence-report + nâng contract `signed-off` cho cả lô,
rồi IN MỘT lệnh `git commit` đích danh các file vừa sửa để NGƯỜI tự chạy.
Ranh giới cứng: helper **không bao giờ chạy git commit** — commit chữ ký
vẫn là hành vi người, `require_human_commit` giữ nguyên răng. Hồ sơ ngoài
trạng thái `verified` trong lô → từ chối ghim tên slug (không ký mù).
UNCERTAIN/`human_override` KHÔNG thuộc helper — vẫn là việc đọc-và-điền
từng item của người (helper chỉ gộp phần chữ ký).

## 1c — CHANGELOG.md + 2.0.0

- `CHANGELOG.md` mới ở gốc: mục 2.0.0 tiếng người (đổi gì · ai bị ảnh
  hưởng · chuẩn bằng chứng giữ nguyên), có mục lùi cho các bản 1.x chính
  (một dòng/bản, trỏ description manifest làm sử cũ).
- Bump **2.0.0** cả 7 manifest (acceptance-gate ×4 kể cả mirror,
  feature-loop ×3) — đổi số thật để né bug update-bỏ-qua-khi-số-trùng.
  Description manifest thêm mục v2.0 ngắn trỏ CHANGELOG (hết phình
  description — changelog dời về file).

## 1d — Re-pin theo RELEASE (chính sách thuần)

Ghi vào GUIDE.md + CLAUDE.md + SKILL feature-loop (2 harness): merge chạm
engine giữa hai release KHÔNG kéo re-pin từng lần; re-pin chạy MỘT chiến
dịch tại mốc release (bump version), evidence giữa hai mốc được phép trỏ
mốc release trước. Đây là quyết định thuần + sửa chữ — máy móc re-pin hiện
có giữ nguyên (không đổi pre-merge/recheck — không hạ chuẩn: staleness
backstop vẫn nguyên, chỉ nhịp CHẠY chiến dịch đổi).

## Nghiệm thu (AC-7) — giả-lập consumer

Repo nháp code-sinh + config.yaml rút từ khối mẫu trong
`commands/acceptance-init.md` (round-trip từ chỉ dẫn thật) → contract mẫu →
`gate-card.js` render → `pre-merge-check.sh` chạy — cả chuỗi exit 0.

## Rủi ro & bẫy đã biết

- Sửa SKILL feature-loop ×2 → PHẢI tái sinh make-record của
  stop-patching-law VÀ measure-birth-certificate (2 suite round-trip từ
  SKILL) — ghi trong Notes contract.
- Sửa nguồn → sync mirror cùng lượt (P30).
- Đổi chữ trong SKILL/commands có thể chạm case suite đang ghim chuỗi cũ
  (vd case đòi "hỏi user số phút") — quét trước bằng grep, sửa case cùng
  commit.
- Đây là feature đầu tiên viết phép đo mới dưới MEASURE-BIRTH-CLAUSE —
  ghi tỷ lệ lỗi-thước ở Gate 2 (baseline revisit của mbc).
