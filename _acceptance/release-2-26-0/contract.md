---
schema_version: 1
feature: Phát hành kit 2.26.0 — đóng số cho cửa sổ 2.25.0 → 2.26.0 (ba vòng đã ký «xuat-du-lieu-lo-trinh», «lo-trinh-cat-luot», «doc-ghi-troi-mang-sang-run-id»: trang lộ trình mang khối dữ liệu máy đọc, skill cắt lượt, thẻ Cổng 2 không giấu mục mang sang và run_id rỗng không lọt), để crm nhận thẳng 2.26 một lần trước đợt sau-14-10 và hàng LT1 dùng được khối dữ liệu; làn V, không dựng răng
slug: release-2-26-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + 2 khoá executor — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: draft
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-09T08:52:44Z
---

# Acceptance Contract: release-2-26-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm`. Owner gọi mốc 09/10 («cắt 2.26») theo làn V như tiền lệ
2.5.0 → 2.25.0. crm CHƯA cài 2.25.0 (hạn cứng 14/10 của đợt đang chạy) nên nhận thẳng 2.26.0 một lần.
Neo ở crm: hàng `LT1` của `crm/docs/plan/dot-sau-14-10/` (hồ sơ crm `trang-lo-trinh-trong-crm`) đọc khối dữ
liệu lộ trình mà mốc này mang; `crm/_acceptance/cap-nhat-tuan-okr` (gốc của X1); `crm/_acceptance/khung-okr-truoc-r1`
(gốc của L2); đêm 07–08/10 của crm và lượt chấm thứ năm của crm-onehub#330 (gốc của `doc-ghi-troi-mang-sang-run-id`).

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ:

- `xuat-du-lieu-lo-trinh` (T2, ký 08/10; PR #285) — `LO-TRINH.html` mang khối `lo-trinh-du-lieu` khuôn v1 + tài liệu cho bản chiếu ngoài kho.
- `lo-trinh-cat-luot` (T2, ký 09/10; PR #289) — skill cắt lượt + răng phủ; lượt chấm chuẩn hoá mã lượt chạy theo luật bên đọc.
- `doc-ghi-troi-mang-sang-run-id` (T3, ký 09/10; PR #284) — thẻ Cổng 2 không giấu mục mang sang; `run_id` rỗng không lọt.

Khi gộp #284 sau #289, hai nhánh cùng sửa bộ ghi `run_id` của lượt chấm; gộp giữ MỘT hàm (`docRid`, luật đầy đủ
của bên đọc) và ghim lại cả hai hồ sơ bằng một lượt làn. Ngoài hồ sơ: lộ trình kit (`docs/plans/lo-trinh-kit.json`)
không đổi trong cửa sổ — sửa sau khi mốc gộp, PR riêng.

Số là **2.26.0, không 2.25.1**: một khối dữ liệu mới trong trang lộ trình (khuôn v1 cho bản chiếu ngoài kho) và
một skill mới (`cat-luot`) — năng lực mới cho kho tiêu thụ. Mốc **không đổi một dòng mã cổng** — chỉ đóng số,
nói người dùng nhận gì (mục `v2.26.0` trong mô tả hai gói và `CHANGELOG.md`), đi **làn V**. Năm dòng số, bảng dự
báo, điều kiện tin cậy, dòng hiệu chuẩn và ghi chú nhận mốc cho crm nằm ở mục `2.26.0` của `CHANGELOG.md` —
một nguồn, hồ sơ không chép lại.

Source input: `git log v2.25.0..HEAD` · nếp phát hành `_acceptance/release-2-25-0/` · mục Notes của ba hồ sơ.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ ba manifest và đòi `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ ba số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, ba vùng plugins, hooks, workflows), Then cả mười XANH và `product-map --check` khớp.
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh c01e5bf2 …`, mốc = commit gắn tag `v2.25.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `c01e5bf2` (tag `v2.25.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-25-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi) `[thước CE: hai mươi mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc (cùng căn cứ với release-2-3-0 → 2-25-0). Ngưỡng của các vòng đọc trên crm sau khi kho nhận mốc.

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/ feature-loop/workflows/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1).
- Đưa dòng P200 vào bằng chứng của lượt chấm. Ba mốc 2.22 → 2.25 thử và đều ra một mục ngoài hợp đồng: workflow lượt chấm cắt đầu ra lệnh xanh (240 ký tự mỗi dòng, ba dòng cuối). Nghiệm đúng tầng ở workflow — mốc này chấm AC-1/AC-2/AC-6 trên MÃ THOÁT của vùng 3, và P200 tự mang chiều đỏ (năm đột biến + đối chứng dương).
- Sửa lộ trình kit `docs/plans/lo-trinh-kit.json` (mốc 2.26 = X1 + L2, G1 sang «đã bác») — PR riêng sau khi mốc gộp.
- Đưa crm nhận 2.26.0 (cài lại plugin, chép lớp CI, khai `long_running`, đo trước→sau) — việc của phiên ở kho crm sau hạn 14/10; phiên kit không cài vào crm.
- Sửa Known limits của ba vòng trong cửa sổ.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths` (vật T3 của cửa sổ — `lib/evidence-core.cjs`, `lib/out-of-contract.cjs`, `scripts/recheck-evidence.cjs` — đã qua vòng T3 của chính nó, PR #284).
- Cả ba vòng của cửa sổ neo kho tiêu thụ (crm); luật (b) — mốc này là mốc KHO NHẬN kế tiếp: crm chưa nhận 2.25.0 và nhận thẳng 2.26.0.
- Chiều đỏ của hai phép đo cửa sổ đo khi mở hồ sơ: `rel-cua-so.sh c01e5bf2 x` thoát 1 gọi tên ba hồ sơ thiếu và «x» thừa; lệnh giữ-số của `diagram-design` với mốc `1b98fdb1` thoát 1 (`2.7.0` ≠ `2.7.1`).
