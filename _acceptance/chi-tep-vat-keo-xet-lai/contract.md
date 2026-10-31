---
schema_version: 1
feature: Luật bằng chứng cũ chỉ kéo hồ sơ vào xét khi PR chạm tệp vật của hồ sơ, không phải khi chỉ sửa tệp chữ
slug: chi-tep-vat-keo-xet-lai
owner: phanlemanh@gmail.com
risk_tier: T3      # chạm scripts/pre-merge-check.sh + lib/evidence-core.cjs — trong risk_tiers.t3_paths
surfaces: [cli]
status: implemented   # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by: Manh Phan
approved_at: 2026-10-31T15:47:03Z
design_doc: _acceptance/chi-tep-vat-keo-xet-lai/design.md
---

# Acceptance Contract: chi-tep-vat-keo-xet-lai

## Context

Lưới trước gộp (`scripts/pre-merge-check.sh`) tính một hồ sơ là «trong diff» cho luật bằng chứng cũ khi PR chạm
BẤT KỲ tệp nào dưới `_acceptance/<slug>/`, nên PR chỉ sửa tệp chữ (`opportunity.md`, `decisions.jsonl`) mở cửa
xét lại toàn bộ mã đã trôi kể từ `verified_commit` — ở crm, 111 hồ sơ phải ghim lại (~13 giờ máy) cho hai việc dọn
chữ. Vòng này thu cửa vào của RIÊNG luật bằng chứng cũ về «PR chạm tệp vật»; luật gap-probe và luật soi lại
(ADR 0010) giữ phạm vi cũ. Người hưởng: chủ kho của mọi kho tiêu thụ — PR dọn chữ gộp được không trả giờ máy ghim
lại. Trace nguyên tố 2 (VIOLATION đòi bằng chứng tươi cho thứ bằng chứng không ghim là cờ sai lý do).

Source input: issue phanlemanh/acceptance-gate-kit#468 · ô `_acceptance/chi-tep-vat-keo-xet-lai/opportunity.md`
(Cổng Đáng: chủ kho «Mở cả bốn», 31/10).

Tệp chữ của hồ sơ = đúng hai tệp ở gốc thư mục hồ sơ: `opportunity.md` và `decisions.jsonl` — TRỪ khi `paths` của
một eval trong `evals.yaml` của hồ sơ phủ tệp ấy. Mọi tệp khác dưới `_acceptance/<slug>/` là tệp vật (mặc định
fail-safe: tệp lạ vẫn kéo xét lại).

## Criteria

- AC-1: Given kho thử có hồ sơ đã ký với `verified_commit` cũ hơn một thay đổi mã ở nhánh chính (bốn ô đầu: hồ sơ không có `evals.yaml`; ô `stale_scope: paths`: `evals.yaml` với `paths: ["src/**"]`), When PR chỉ sửa tệp chữ của hồ sơ — ma trận viết trước: chỉ `opportunity.md` · chỉ `decisions.jsonl` · cả hai · chỉ `opportunity.md` ở kho có `_acceptance/` nằm sâu (`pkg/`) · chỉ `opportunity.md` ở kho khai `risk_tiers.stale_scope: paths` — và lưới chạy với `--base`, Then mỗi ô cho mã 0, không dòng `VIOLATION [<slug>]: evidence is stale`, và đúng một dòng bắt đầu `NOTE [<slug>]: sửa tệp chữ, không xét bằng chứng cũ — PR chỉ đổi ` kèm tên các tệp chữ đã đổi; và trên CÙNG kho, bản gốc thật `115100b6` cùng bản sao mà vế tệp chữ của luật bị gỡ ĐỎ với `VIOLATION [<slug>]: evidence is stale` nêu `src/app.js`.
- AC-2: Given cùng hình dạng kho của AC-1, When PR sửa một tệp vật của hồ sơ — ma trận viết trước: `evals.yaml` · `contract.md` · `evidence-report.md` · `run-log.jsonl` · `rang/do.mjs` (tệp ở thư mục con) · `rang/opportunity.md` (tệp thư mục con trùng tên tệp chữ) · `note.md` (tệp lạ) · `opportunity.md` cùng `evals.yaml` trong một PR · `evals.yaml` ở kho có `_acceptance/` nằm sâu — Then mỗi ô cho mã ≠ 0 với `VIOLATION [<slug>]: evidence is stale` nêu `src/app.js`, và không dòng NOTE tệp chữ nào của hồ sơ.
- AC-3: Given hồ sơ tươi (`verified_commit` không cũ hơn mã nào), When PR chỉ sửa `opportunity.md` của nó, và When PR sửa `evals.yaml` của nó, Then cả hai lần chạy cho mã 0 với dòng `OK [<slug>]` và không dòng VIOLATION nào của hồ sơ.
- AC-4: Given hồ sơ cũ có `evals.yaml` mà `paths` của một eval phủ tệp chữ (`_acceptance/<slug>/**`, hoặc đúng `_acceptance/<slug>/opportunity.md`), hoặc trường `paths` của một eval không đọc được (bí danh YAML), When PR chỉ sửa `opportunity.md`, Then lưới ĐỎ với `VIOLATION [<slug>]: evidence is stale` và không dòng NOTE tệp chữ; và đối chứng trên cùng hình dạng — `paths` chỉ phủ `_acceptance/<slug>/rang/**` và `src/**` — cho mã 0 cùng dòng NOTE tệp chữ.
- AC-5: Given kho thử bật `gap_probe: required` và `recheck: strict`, hồ sơ cũ thiếu `gap-probe.md` và có `run-log.jsonl` không khớp `run_id` của báo cáo, When PR chỉ sửa `opportunity.md`, Then lưới vẫn in `VIOLATION [<slug>]: chưa qua phản biện context sạch (gap-probe)` và `VIOLATION [<slug>]: committed evidence fails re-check (recheck: strict)` cho hồ sơ ấy (hai luật kia vẫn xét hồ sơ chỉ sửa tệp chữ), cùng dòng NOTE tệp chữ và không dòng `evidence is stale`.

- AC-6: Given hồ sơ cũ của AC-1 (ô `opportunity`), When PR chỉ sửa `opportunity.md` và lưới chạy trên bản sao mà bộ phân tệp không phân được — ma trận viết trước: hàm phân tệp vắng khỏi lib (bản sao đổi tên) · lib in đầu ra không đọc được (bản sao tiêm) — Then mỗi ô cho mã ≠ 0 với `VIOLATION [<slug>]: evidence is stale` nêu `src/app.js` và không dòng NOTE tệp chữ; đối chứng: bản sao chưa tiêm trên cùng kho cho mã 0 và dòng NOTE.

## Coverage

- Trục A — tệp hồ sơ PR đổi: chỉ tệp chữ (một · hai) | tệp vật khuôn kit (`evals.yaml`, `contract.md`, `evidence-report.md`, `run-log.jsonl`) | tệp trong thư mục con (kể cả trùng tên tệp chữ) | tệp lạ | tệp chữ lẫn tệp vật.
- Trục G — bộ phân tệp: chạy được | hàm vắng | đầu ra hỏng (lùi về tệp vật) [giới hạn: thiếu hẳn `node` không có ô — lưới cần node ở nhiều luật khác].
- Trục B — thước của hồ sơ: không có `evals.yaml` | `paths` không phủ tệp chữ | `paths` phủ tệp chữ (glob `**` · đúng tên) | `paths` không đọc được.
- Trục C — độ tươi: cũ (mã trôi sau `verified_commit`) | tươi.
- Trục D — bố cục kho: `_acceptance/` ở gốc kho | `_acceptance/` nằm sâu (`pkg/`) [thước CE: hình dạng `slug_in_diff` chấp hai dạng đường].
- Trục E — khoá kho: `stale_scope` vắng | `stale_scope: paths` (hình dạng crm) [thước CE: `_acceptance/config.yaml` của crm, đọc 31/10].
- Trục F — luật dùng chung phạm vi: bằng chứng cũ (đổi) | gap-probe (giữ) | soi lại ADR 0010 (giữ).
- Ô Core: A1×B1×C1×D1/D2×E1/E2 (AC-1) · A2–A5×C1×D1/D2 (AC-2) · A1/A2×C2 (AC-3) · A1×B2–B4×C1 (AC-4) · A1×F2/F3 (AC-5) · A1×G2/G3 (AC-6).
- Later: chữ ký mới trong diff, cửa veto ghi-ngược, chưa-arm — ba chỗ khác dùng `slug_in_diff` — giữ nguyên, không đo lại ở vòng này (không đổi).
- Không quét bằng skill: không gian kê tay bảy trục ở trên (dòng sổ `bỏ coverage-scan`); phản biện context sạch bổ sung ô trùng tên ở thư mục con và trục G.

## Out of scope

- Đổi phạm vi của luật gap-probe, luật soi lại (ADR 0010) hay ba chỗ khác dùng `slug_in_diff`.
- Thêm tệp chữ ngoài `opportunity.md` và `decisions.jsonl` (gap-probe.md, usage-report.md, figures/ …) — hạt giống nếu kho nào vấp.
- Đổi bộ lọc hoá cũ theo `paths` (`staleByPaths`) hay luật hoá cũ khi không có `--base`.
- Ghim lại các hồ sơ của crm hay cắt bản 2.36.2 (phiên điều phối làm sau khi gộp).

## Notes

- Vật: `scripts/pre-merge-check.sh` (vị từ `slug_vat_in_diff` + nhánh `STALE-TEP-CHU-GUARD`) · `lib/evidence-core.cjs`
  (khối marker `TEP-CHU-HO-SO` + `phanTepHoSo`) · thước: `tests/scripts/chi-tep-vat-keo-xet-lai.test.mjs` ca TV1…TV6 ·
  khoá eval `executors.script.tvx_e1…e6` · ADR 0028 (thu AC-3 của `stale-theo-diff-pr`).
