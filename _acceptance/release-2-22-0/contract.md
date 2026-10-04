---
schema_version: 1
feature: Phát hành kit 2.22.0 — đóng số cho cửa sổ 2.21.0 → 2.22.0 (một vòng đã ký «trang-lo-trinh-doc-mot-phut»: trang lộ trình đọc trong một phút), để crm cài vào; làn V, không dựng răng
slug: release-2-22-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + 2 khoá executor — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-03T23:51:18Z
---

# Acceptance Contract: release-2-22-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm`. Trang lộ trình neo ở hồ sơ crm `cap-nhat-tuan-okr` và
đã qua Cổng Giá trị «release» trên bản sao crm `onehub` `0b8540c16`
(`_acceptance/trang-lo-trinh-doc-mot-phut/uat-session.md`, owner 04/10: «gửi: crm, ngay sau khi cắt
2.22.0»). Owner gọi mốc 04/10 («gộp và cắt 2.22.0»).

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ:

- `trang-lo-trinh-doc-mot-phut` (T2, ký 04/10; ô PR #259, vật PR #260, Cổng Giá trị PR #261) — lớp vẽ
  `scripts/lo-trinh.mjs`: thẻ đầu trang mỗi lộ trình, chỗ cần sửa bằng tiếng sản phẩm, việc đã giao gập,
  dải mốc, hồ sơ ngoài kế hoạch một lần; bộ đo Chrome `tests/scripts/lo-trinh-do-trang.mjs`.

Ngoài hồ sơ: chiến dịch ghim lại 2.21.0 (#257), ghi chú mốc (#254). Vật engine đổi trong cửa sổ: **một
tệp** (`git diff --name-only v2.21.0 HEAD -- scripts lib hooks skills feature-loop commands vendor` →
`scripts/lo-trinh.mjs`). **Lớp chép CI đổi đúng tệp đó** (danh sách vẫn 17 tệp).

Số là **2.22.0, không 2.21.1**, vì trang người dùng đọc đổi bố cục và chữ. Mốc này **không đổi một dòng
mã cổng** — chỉ đóng số, nói người dùng nhận gì (mục `v2.22.0` trong mô tả hai gói và `CHANGELOG.md`),
đi **làn V** như tiền lệ 2.5.0 → 2.21.0. Năm dòng số, bảng dự báo, điều kiện tin cậy và dòng hiệu chuẩn
nằm ở mục `2.22.0` của `CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.21.0..HEAD` · nếp phát hành `_acceptance/release-2-21-0/` · bàn giao
`docs/handoff/2026-10-01-handoff-cat-moc-2-20.md` (khuôn các bước).

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.22.0`), `diagram-design` hợp semver.
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, ba vùng plugins, hooks, workflows), Then cả mười XANH và `product-map --check` khớp.
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 8d1f5162 …`, mốc = commit gắn tag `v2.21.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `8d1f5162` (tag `v2.21.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.22.0` và mục `v2.22.0` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.22.0`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-21-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi) `[thước CE: mười sáu mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc (cùng căn cứ với release-2-3-0 → 2-21-0). Ngưỡng của trang đã đọc ở Cổng Giá trị của `trang-lo-trinh-doc-mot-phut`.

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/ feature-loop/workflows/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1).
- Sửa Known limits của vòng trong cửa sổ — đều là lớp vẽ hoặc ca kiểm; hạt giống bản chiếu ReUI đã có ô trích tên.
- Chiến dịch ghim lại các hồ sơ đã ký — §7.1: việc SAU khi mốc gộp, chỉ khi lưới báo hoá cũ.
- Đưa crm nhận 2.22.0 (chép `scripts/lo-trinh.mjs`, cài lại plugin, vẽ lại `LO-TRINH.html`) — việc SAU khi tag có mặt, một PR ở crm.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- **Known limits (Cổng Bằng chứng, ký 04/10):** E1, E2, E6 khai ghim các dòng «P200 …» của ca kiểm số,
  nhưng lệnh mảnh vùng 3 lọc đầu ra còn «FAIL|Results», nên bằng chứng AC-1/2/6 là mã thoát chung của
  vùng 3 (Ngoài-1, Ngoài-2 — tồn từ 2.21.0) · tập hồ sơ được ký gõ tay ở hai chỗ (Context và dòng
  executor `rel2220_cua_so`), không gì tự so hai chỗ (Ngoài-3).
- Hạt giống mới của cửa sổ: `docs/plans/2026-10-04-hat-giong-ban-chieu-reui-trang-lo-trinh.md` (ô
  `trang-lo-trinh-doc-mot-phut` trích tên).
