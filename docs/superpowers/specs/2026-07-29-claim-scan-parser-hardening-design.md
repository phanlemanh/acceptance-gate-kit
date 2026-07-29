# claim-scan-parser-hardening — thiết kế

*2026-07-29 · T2 · Nguồn scope: disposition Gate 2 của `cross-feature-claim-index`
(Notes + entry revisit `d-…`) — 3 lỗ parser do S4 bắt, CỘNG 2 thành viên cùng
lớp do quét-theo-LỚP tìm thấy (bất biến CLAUDE.md: vá lớp, không vá case).*

## Phạm vi — 5 lỗ, một lớp: "cửa parse hỏng thì phải câm-có-tiếng, không câm-lặng"

1. **Section capture nuốt tới EOF (HIGH):** `/## Findings([\s\S]*)/` bắt cả
   bảng ở section sau → claim ma có id citable (đầu độc kênh bài học + lệch
   đánh số hàng vật lý). Sửa: capture dừng ở heading kế
   (`/## Findings([\s\S]*?)(?=\n## |$)/`).
2. **Id thiếu/sai khuôn bị drop im lặng:** bộ lọc `ID_RE` nuốt claim không
   một tiếng. Sửa: đếm + warn `claim-scan: dropped N claims with invalid id
   in <slug>`.
3. **Id trùng xuyên-feature im lặng:** dedupe là chủ đích, nhưng cùng id ở
   HAI slug khác nhau là data lỗi. Sửa: warn
   `claim-scan: duplicate id <id> across features (kept first)` — chỉ khi
   slug khác nhau; trùng trong cùng file không cảnh (không xảy ra với id sinh
   chuẩn).
4. **(cùng lớp — sweep) Frontmatter không đọc được** (thiếu `---`, không có
   key `verdict`): hiện return rỗng không phân biệt với `verdict: clean` hợp
   lệ. Sửa: warn `claim-scan: skipped <file> (unreadable frontmatter)`;
   verdict hợp lệ ≠ findings vẫn im lặng như cũ (đó là bỏ-qua đúng nghĩa).
5. **(cùng lớp — sweep) Entry ledger thiếu `decision`/`impact`:** hiện emit
   claim text rỗng câm. Sửa: coi là malformed — đếm vào warn per-file sẵn có
   (`skipped N malformed lines`), không emit.

Hành vi GIỮ NGUYÊN: exit 0 khi chỉ có hỏng-từng-phần; cap/sàn/sort/schema
không đổi; separator + header của bảng Findings vẫn qua `rows.slice(2)`;
thông điệp cũ đã ghim trong test không đổi lời.

## Đo lường & vệ tinh

- Mọi assertion âm tính: đối chứng dương + ghim đúng thông điệp (luật kit).
- Regression đinh: gap-probe.md có section `## Notes` chứa bảng 6 cột SAU
  Findings → zero claim từ section đó (fixture code sinh).
- Bump 1.18.0 → **1.18.1** (patch, cả 2 manifest) + sync mirror + re-pin
  3 literal trong `tests/plugins/run-tests.sh`; bổ sung câu "v1.18 adds…"
  vào description (trả luôn known-limit của vòng trước, cùng file bump).

## Out of scope

- Hardening nguồn V2 (review-findings/run-log) — vẫn chờ GO của DP-1.
- Đổi schema claim / thứ tự sort / cap — không thuộc hardening.
- Codex parity — như V1, chờ GO.
