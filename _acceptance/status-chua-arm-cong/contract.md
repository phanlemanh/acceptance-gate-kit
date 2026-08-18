---
schema_version: 1
feature: Hồ sơ có bằng chứng nhưng status chưa arm cổng không được tàng hình — pre-merge thôi `continue` im lặng ở draft/approved khi đã có evidence-report.md hoặc PR đổi code chịu cổng; giữ đường đọc-cũ cho hồ sơ không có bằng chứng
slug: status-chua-arm-cong
owner: phanlemanh@gmail.com
risk_tier: T3               # chạm scripts/pre-merge-check.sh (t3_paths) — tier máy-derive; đề bài nói T2, tiền lệ stale-theo-diff-pr/veto-co-dau-vet cùng file đều T3, nghi thức giữ gọn theo đề bài (5 AC, không judgment)
surfaces: [cli]
status: verified
approved_by: Manh Phan
approved_at: 2026-08-18T08:05:11Z
---

# Acceptance Contract: status-chua-arm-cong

## Context

S4 vòng 4 của hồ sơ `release-2-2-0` (18/08): hồ sơ để `status: approved`
nhưng đã có `evidence-report.md` verdict REJECT + `human_signoff` rỗng →
`pre-merge-check.sh` in «clean», không một dòng cho slug đó. Nguyên nhân: vòng
per-slug `case "$status" in implemented|verified|signed-off) ;; *) continue`
loại slug khỏi cổng hoàn toàn ở mọi status khác; T1-escape lại được thoả bởi
chính hồ sơ đó. Đây là cửa thứ ba của lớp «PASS chưa ai phán» mà khối 1.24.0
(không contract · thiếu field) sinh ra để bịt.

Thiết kế: `docs/superpowers/specs/2026-08-18-status-chua-arm-cong-design.md`.
Source input: đề bài owner 18/08 + `_acceptance/release-2-2-0/` (nhánh
`release/2-2-0`) contract Notes + gap-probe P0.

## Criteria

- AC-1: Given hồ sơ hạng T2/T3 có `contract.md` với `status: approved` (hoặc
  `draft`) VÀ đã có `evidence-report.md` (bất kỳ verdict, kể cả REJECT) VÀ hồ
  sơ nằm trong phạm vi diff PR (`--base`), When chạy pre-merge, Then exit 1
  và stdout có `VIOLATION [<slug>]: hồ sơ có bằng chứng nhưng status chưa arm
  cổng` kèm `verdict=<v>`; đối chứng dương trên CÙNG fixture chỉ đổi
  `status: implemented` → KHÔNG có dòng đó và cổng chấm bằng chứng như thường
  (VIOLATION verdict REJECT nổ thay).
- AC-2: Given hồ sơ `status: draft` KHÔNG có evidence nằm trong diff PR, When
  PR đó đổi ít nhất một file chịu cổng (ngoài `_acceptance/`, ngoài
  `t1_skip_globs`), Then exit 1 và cùng tên VIOLATION với lý do `PR đổi code
  chịu cổng (<file>`; When PR chỉ đổi file T1 (`docs/`), Then exit 0 và KHÔNG
  có dòng đó (hạt giống hồ sơ vẫn merge được — đường đọc-cũ).
- AC-3: Given hồ sơ chưa arm có evidence nhưng KHÔNG nằm trong diff PR (sử
  liệu), When chạy có `--base`, Then KHÔNG có dòng «chưa arm cổng» cho nó
  (phạm vi theo diff — nếp stale-theo-diff-pr); When chạy KHÔNG `--base`,
  Then luật xét mọi slug (fail-safe): hồ sơ chưa arm có evidence → nổ; hồ sơ
  draft không evidence → vẫn exit 0 như S04 hiện hành.
- AC-4: Given phân loại diff-chịu-cổng được hoist lên trước vòng per-slug, When
  PR đổi code chịu cổng mà KHÔNG kèm `_acceptance/`, Then VIOLATION T1-escape
  in y nguyên văn cũ (`[PR]: non-T1 files changed …` / `T3 paths (t3_paths)
  changed …`) và dòng sổ luật vẫn `expected=4` — hoist không đổi hành vi.
- AC-5: Given cây đã sửa, When chạy đủ bốn suite (`suite_keys`), Then cả bốn
  XANH; và GUIDE có (i) một hàng bảng CI cho VIOLATION mới, (ii) đúng một
  gạch đầu dòng ở §7.1: «Mốc phát hành **không dựng răng** — ca vĩnh viễn P200
  canh nhất quán, người đọc diff 3 dòng.»

## Coverage

Không gian đo là tích ba trục máy-đọc, quét tay ngay trong thiết kế (bài
toán một chiều đã gọi tên, entry `descope` bỏ coverage-scan trong sổ):
- Trục A · status hồ sơ: draft | approved | armed (implemented+) [thước CE:
  enum `status` trong lib/workspace-record.cjs]
- Trục B · bằng chứng: có evidence-report.md (verdict bất kỳ) | không
- Trục C · phạm vi PR: slug trong diff + code chịu cổng | slug trong diff +
  chỉ T1 | slug ngoài diff | không `--base`
- Trục D · tier: trong `required_for` | ngoài (T1) [thước CE: `case
  REQUIRED_FOR` hiện hành]
- Ma trận toàn phần viết trước = 13 ca ARM01–ARM12 (+ARM08b) trong thiết kế:
  mọi ô đỏ có ca; mọi ô xanh có ca kèm dấu dương cổng-đã-chạy (dòng sổ luật
  `expected=4` hoặc dòng verdict nguyên văn); ARM01↔ARM02 khác một chữ status.

## Out of scope

- Sửa `lib/workspace-record.cjs` (`usesEvidence`/`missingArtifact`) hay bản
  đồ sản phẩm / `/start` — bên đọc tư vấn, không phải điểm cưỡng chế; xem
  bảng quét lớp trong thiết kế + entry `descope`.
- Đổi bảng resume của feature-loop (`approved` → S2).
- Thêm cờ tắt luật mới; thêm tên luật vào `LEDGER_EXPECTED`.
- Bộ răng riêng cho mốc phát hành nào (đúng nếp GUIDE §7.1 vừa thêm).

## Notes

- Không có eval `judgment`: mọi khẳng định máy-chấm-được; T3 + judgment =
  human_override mỗi item trong khi gate-fatigue là ràng buộc số 1.
- Ca mới dùng tiền tố `ARM`, không lấy số P kế tiếp — tránh đụng số ca với
  nhánh song song (vấp moi-noi-vong-trao).
