---
schema_version: 1
feature: Phát hành kit 2.24.0 — đóng số cho cửa sổ 2.23.0 → 2.24.0 (hai vòng đã ký «loc-paths-dong-mac-dinh» và «eval-thay-boi-co-chung»: bộ lọc paths đóng mặc định, eval thay bởi hồ sơ đã ký), để crm cài vào; làn V, không dựng răng
slug: release-2-24-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + 2 khoá executor — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-06T14:54:34Z
---

# Acceptance Contract: release-2-24-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm`. Owner gọi mốc 06/10 («cắt mốc 2.24 cho crm») ngay sau khi
PR #272 gộp. Hai vòng của cửa sổ đều neo hồ sơ crm: `loc-paths-dong-mac-dinh` ở `go-khoa-goc-nhin` (crm
bật `stale_scope: paths` kèm lưới tạm `kiem-paths-dong.mjs`), `eval-thay-boi-co-chung` ở `gop-y-dung-cho`
(25 eval máy đã ký ở năm hồ sơ mất vật đo, làn ghim lại chết ở luật hai vế).

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ:

- `loc-paths-dong-mac-dinh` (T3, ký 06/10; PR #271) — bộ lọc hoá cũ theo paths đóng mặc định.
- `eval-thay-boi-co-chung` (T3, ký 06/10; PR #272) — eval thay bởi hồ sơ đã ký, con trỏ `superseded_by`.

Ngoài hồ sơ: ô `lo-trinh-cat-luot` mở và qua Cổng Đáng (#274, #275). Vật engine đổi trong cửa sổ
(`git diff --name-only 8344fa92 HEAD -- scripts lib hooks skills feature-loop commands vendor`):
`commands/acceptance-init.md`, `feature-loop/scripts/repin-lane.mjs`, `feature-loop/skills/feature-loop/SKILL.md`,
`lib/evidence-core.cjs`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`. **Lớp chép CI ĐỔI
ba tệp** (`lib/evidence-core.cjs`, `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`); danh sách
vẫn 17 tệp.

Số là **2.24.0, không 2.23.1**: một trường mới trong khuôn `evals.yaml`, một hậu tố mới trên dòng `sha:`,
bộ lọc paths đổi kết luận trên kho đã bật khoá. Mốc **không đổi một dòng mã cổng** — chỉ đóng số, nói người
dùng nhận gì (mục `v2.24.0` trong mô tả hai gói và `CHANGELOG.md`), đi **làn V** như tiền lệ 2.5.0 →
2.23.0. Năm dòng số, bảng dự báo, điều kiện tin cậy và dòng hiệu chuẩn nằm ở mục `2.24.0` của
`CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.23.0..HEAD` · nếp phát hành `_acceptance/release-2-23-0/` · mục «Ghi chú cho mốc» của
hai hồ sơ cơ hội.

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.24.0`), `diagram-design` hợp semver.
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, ba vùng plugins, hooks, workflows), Then cả mười XANH và `product-map --check` khớp.
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 8344fa92 …`, mốc = commit gắn tag `v2.23.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `8344fa92` (tag `v2.23.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.24.0` và mục `v2.24.0` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.24.0`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-23-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi) `[thước CE: mười tám mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc (cùng căn cứ với release-2-3-0 → 2-23-0). Ngưỡng của hai vòng đọc trên crm ở phiên nghiệm thu của từng vòng sau khi kho nhận mốc.

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/ feature-loop/workflows/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1).
- Sửa Known limits của hai vòng trong cửa sổ — kể cả lỗi thẻ giấu mục mang hậu tố «(r1)» (hạt giống đã chạm ngưỡng, đóng băng meta-work).
- Chiến dịch ghim lại các hồ sơ đã ký — §7.1: việc SAU khi mốc gộp, chỉ khi lưới báo hoá cũ.
- Đưa crm nhận 2.24.0 (chép lớp CI, cài lại plugin, khai con trỏ, gỡ lưới tạm) — việc của chủ kho crm sau khi tag có mặt; phiên kit không chạm kho crm.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào khớp `t3_paths`.
- Cả hai vòng của cửa sổ neo kho tiêu thụ (crm); luật (b) — mốc này là mốc KHO NHẬN kế tiếp sau 2.23.0.
- Hai chỉ dẫn cho crm của hai vòng chạm cùng lưới tạm `kiem-paths-dong.mjs` — CHANGELOG ghép thành một thứ tự: khai con trỏ và ghim lại năm hồ sơ TRƯỚC, rồi gỡ trọn lưới tạm (gồm nhánh «ĐÃ THAY»).
- Chiều đỏ của hai phép đo cửa sổ đo khi mở hồ sơ: `rel-cua-so.sh 8344fa92 x` thoát 1 gọi tên hai hồ sơ thiếu và «x» thừa; lệnh giữ-số của `diagram-design` với mốc `1b98fdb1` thoát 1 (`2.7.0` ≠ `2.7.1`).
