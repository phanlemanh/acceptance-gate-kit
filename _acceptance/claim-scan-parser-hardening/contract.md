---
schema_version: 2
feature: "claim-scan-parser-hardening — đóng lớp câm-lặng của 6 cửa parse trong claim-scan.mjs (5 lỗ: section-EOF, id sai khuôn, id trùng xuyên-feature, frontmatter không đọc được, nội dung rỗng)"
slug: claim-scan-parser-hardening
risk_tier: T2
surfaces: [cli]
status: verified
approved_by: Manh Phan
approved_at: 2026-07-29T09:20:00Z
owner: phanlemanh@gmail.com
source: docs/superpowers/specs/2026-07-29-claim-scan-parser-hardening-design.md
time_human_minutes:
  gate1: 5
  gate2:
---

# Acceptance contract — claim-scan-parser-hardening

Bối cảnh: S4 của `cross-feature-claim-index` bắt 3 lỗ parser (1 HIGH — claim
ma có id citable đầu độc kênh bài học); Gate 2 chốt mở contract này. Quét
theo-LỚP thêm 2 thành viên cùng hình dạng. Một lớp duy nhất: cửa parse hỏng
phải câm-có-tiếng (warn đếm to, không emit rác, exit 0), không câm-lặng.

## Acceptance criteria

- **AC-1** Given `gap-probe.md` hợp lệ có section `## Notes` (hoặc bất kỳ
  heading nào) chứa bảng 6 cột NẰM SAU section Findings, When chạy scan,
  Then zero claim sinh từ section sau — số claim và dãy id `#F<n>` GIỐNG HỆT
  file không có section sau (đối chứng dương cùng fixture bỏ section).
- **AC-2** Given ledger có entry `fix`/`descope` với `id` vắng hoặc sai
  khuôn xen giữa entry chuẩn, When chạy scan, Then entry chuẩn vẫn ra claim,
  entry id hỏng KHÔNG xuất hiện, stderr in đúng
  `dropped N claims with invalid id in <slug>` và exit 0.
- **AC-3** Given hai workspace KHÁC NHAU có claim trùng `id`, When chạy
  scan, Then chỉ claim gặp trước được giữ, stderr in đúng
  `duplicate id <id> across features (kept first)`; đối chứng âm: corpus
  không trùng id thì KHÔNG có dòng cảnh này.
- **AC-4** Given `gap-probe.md` frontmatter không đọc được (thiếu `---` mở,
  hoặc không có key `verdict`), When chạy scan, Then file bị bỏ qua với
  stderr `skipped <file> (unreadable frontmatter)`; đối chứng dương: file
  `verdict: clean` hợp lệ bị bỏ qua IM LẶNG (không dòng cảnh nào) — phân
  biệt được hai trường hợp.
- **AC-5** Given entry ledger `fix` thiếu trường `decision` hoặc `impact`,
  When chạy scan, Then entry đó KHÔNG emit claim (không claim text rỗng) và
  được đếm vào thông điệp `skipped N malformed lines in <file>` sẵn có.
- **AC-6** Given toàn bộ fixture hợp lệ của suite hiện hành (35 case V1),
  When chạy lại suite sau hardening, Then mọi case cũ vẫn xanh — hành vi
  cap/sàn/sort/schema/thông điệp cũ không đổi.
- **AC-7** (judgment) Lớp câm-lặng đã đóng TRỌN trên scanner: soi code
  claim-scan.mjs sau sửa, mọi đường drop dữ liệu đều hoặc có warn đếm được
  hoặc là bỏ-qua-chủ-đích có tên trong design — không còn nhánh drop nào
  ngoài hai loại đó.
- **AC-8** Given bump 1.18.1 + description bổ sung dòng "v1.18 adds…", When
  chạy `sync-plugin-packages.sh --check` + suite plugins, Then exit 0 —
  mirror đồng bộ, literal version đã re-pin.

## Coverage

Từ morphological-scan (3 trục — thước CE trong ngoặc):

- **C — cửa parse** (CE: grep code — 6 cửa: frontmatter, section, hàng,
  dòng ledger, bộ lọc id, dedupe): AC-1, AC-2, AC-3, AC-4, AC-5, AC-7
- **H — chế độ hỏng** (CE: findings 3 round S4 thật của
  cross-feature-claim-index): AC-1 (bảng-ngoài-section), AC-2 (id sai),
  AC-3 (trùng), AC-4 (không-parse-được), AC-5 (rỗng)
- **Đ — hành vi đòi** (CE: doctrine skip-loud + contract V1): warn đếm to
  (AC-2..5) · không-emit-rác (AC-1, AC-5) · tương thích ngược (AC-6) ·
  đóng-trọn-lớp (AC-7) · đóng gói (AC-8)

## Out of scope

- Hardening nguồn V2 (`review-findings.md`, `run-log.jsonl`) — chờ GO DP-1.
- Đổi schema claim / sort / cap / sàn đa dạng — không thuộc hardening.
- Codex parity — như V1, chờ GO.

## Notes (Gate 2, 2026-07-29 — disposition 2 finding ngoài phạm vi)

- **Chuyển contract mới `findings-section-boundary`** (quyết tại Cổng 2):
  ranh giới section Findings phải single-source cho MỌI bộ đọc — claim-scan
  dừng ở heading mọi cấp nhưng `section()` của gate-card/evidence-page vẫn
  nuốt bảng dưới heading lồng → thẻ có thể hiện finding ma. Gộp luôn vá
  đối-chứng-đột-biến PH8 (hiện là phép kiểm không-thể-đỏ) vào contract đó.
- **Known limits:** đối chứng đột biến PH8 vacuous cho tới khi contract trên
  ship — phép kiểm chính của PH8 vẫn có hiệu lực.
