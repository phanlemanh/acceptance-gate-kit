---
schema_version: 1
feature: Phát hành kit 2.21.0 — đóng số cho cửa sổ 2.20.0 → 2.21.0 (năm vòng đã ký «viec-ke-theo-plan» · «lo-trinh-tren-du-lieu-that» · «loi-moi-tran-luot-loi-song-co-gia» · «lan-ghim-lai-giu-tron-loi-loi» · «lan-ghim-lai-theo-paths»: lộ trình cạnh bản đồ, lối ra ở trần lượt, làn ghim lại giữ trọn lời lỗi và chạy suite song song), để crm cài vào; làn V, không dựng răng
slug: release-2-21-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + 2 khoá executor — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-03T11:51:22Z
---

# Acceptance Contract: release-2-21-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm`. Lộ trình neo ở hồ sơ crm `cap-nhat-tuan-okr` (lượt 4
OKR: 23/48 tin owner là hỏi tiến độ) và đã qua Cổng Giá trị «release» trên bản sao crm `onehub`
(`_acceptance/lo-trinh-tren-du-lieu-that/uat-session.md`, owner 03/10: «gửi: crm, ngay sau khi cắt
2.21.0»). Làn ghim lại neo ở số đo chi phí làn của crm 02/10. Owner gọi mốc 03/10 («đợi» rồi «phiên kia
đã gộp» — cắt một lần sau khi `lan-ghim-lai-theo-paths` gộp).

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ:

- `viec-ke-theo-plan` (T2, ký 03/10, PR #246) và `lo-trinh-tren-du-lieu-that` (T2, ký 03/10, PR #252,
  Cổng Giá trị PR #253) — ổ cắm `lo_trinh.tep`, `scripts/lo-trinh.mjs`, `scripts/lo-trinh-khoa.cjs`,
  trang `LO-TRINH.html`, dòng thẻ start, S0 nhận mã hàng.
- `loi-moi-tran-luot-loi-song-co-gia` (T2, ký 03/10, PR #247) — khối «Lối ra» trên thẻ chưa-ký-được
  (`scripts/gate-card.js`, `scripts/loi-ra-tran-luot.cjs`).
- `lan-ghim-lai-giu-tron-loi-loi` (T2, ký 03/10, PR #250) — nhật ký lệnh đỏ, dòng `repin-do`,
  `feature-loop/scripts/tai-may.mjs`.
- `lan-ghim-lai-theo-paths` (T3, ký 03/10, PR #255) — `stale_scope: paths` (chưa bật), `--stale-all`,
  `repin_parallel_suites`.

Ngoài hồ sơ: `diagram-design` 2.7.1 (e2df88ff) và sáu PR docs/hạt giống/ô/ca kiểm (#235, #238, #239,
#242, #243, #251). Vật engine đổi trong cửa sổ: mười tám tệp (`git diff --stat 1b98fdb1 HEAD -- scripts
lib hooks skills feature-loop commands vendor`). **Lớp chép CI ĐỔI** — danh sách 15 → 17 tệp, năm tệp
đổi so 2.20.0: `scripts/lo-trinh-khoa.cjs` (mới), `scripts/lo-trinh.mjs` (mới),
`scripts/pre-merge-check.sh`, `scripts/product-map.mjs`, `lib/evidence-core.cjs`.

Số là **2.21.0, không 2.20.1**, vì cửa sổ thêm hành vi mới cho người dùng. Mốc này **không đổi một dòng
mã cổng** — chỉ đóng số, nói người dùng nhận gì (mục `v2.21.0` trong mô tả hai gói và `CHANGELOG.md`),
đi **làn V** như tiền lệ 2.5.0 → 2.20.0. Năm dòng số, bảng dự báo, điều kiện tin cậy và dòng hiệu chuẩn
nằm ở mục `2.21.0` của `CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.20.0..HEAD` · nếp phát hành `_acceptance/release-2-20-0/` · bàn giao
`docs/handoff/2026-10-01-handoff-cat-moc-2-20.md` (khuôn các bước).

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.21.0`), `diagram-design` hợp semver.
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, ba vùng plugins, hooks, workflows), Then cả mười XANH và `product-map --check` khớp.
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 1b98fdb1 …`, mốc = commit gắn tag `v2.20.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `1b98fdb1` (tag `v2.20.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục CÓ dòng đổi VÀ số khác số ở mốc — `diagram-design` lên `2.7.1` là đúng, không phải đổi mà quên nâng.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.21.0` và mục `v2.21.0` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.21.0`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-20-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi) `[thước CE: mười lăm mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc (cùng căn cứ với release-2-3-0 → 2-20-0). Ngưỡng của lộ trình đã đọc ở Cổng Giá trị của `lo-trinh-tren-du-lieu-that`; số tin hỏi tiến độ ở crm đếm sau khi crm cài (đường đo của `viec-ke-theo-plan`).

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/ feature-loop/workflows/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1).
- Sửa Known limits của năm vòng trong cửa sổ — đều là mã cổng hoặc ca kiểm; hạt giống của cửa sổ đã có ô trích tên.
- Bật `stale_scope: paths` ở bất kỳ kho nào — chờ hạt giống đóng mặc định.
- Chiến dịch ghim lại các hồ sơ đã ký — §7.1: việc SAU khi mốc gộp, chỉ khi lưới báo hoá cũ.
- Đưa crm nhận 2.21.0 (chép năm tệp lớp CI, cài lại plugin, tệp ý định lộ trình) — việc SAU khi tag có mặt, một PR ở crm.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

**Vì sao làn V:** mốc này không có mục nào chỉ-người-biết. Số lấy từ manifest, danh sách vòng suy từ
kho, hồi quy là các lệnh suite thường trực. Cửa veto mở và có dấu vết thời gian; owner veto lúc nào
cũng được.

**Luật chiều rộng (b), khai thẳng:** năm vòng chạm engine. Bốn vòng có neo ngoài ở crm (lộ trình: hồ sơ
`cap-nhat-tuan-okr`; làn ghim lại: số đo chi phí làn 02/10). `loi-moi-tran-luot-loi-song-co-gia` sửa
lời mời ở trần lượt của chính kit — owner gọi tên vòng 03/10 (vòng CỘNG, owner duyệt Cổng Phạm vi); đó là
suất meta của cửa sổ.

**Lượt gọi người vượt trần ở ba vòng** (`viec-ke-…` 4/3, `lan-ghim-lai-giu-…` 4/3,
`lan-ghim-lai-theo-paths` 6/4) — số ở CHANGELOG mục 2.21.0. Mọi lượt vượt là «trả» ở Cổng Bằng chứng
hoặc dừng-vá. Không mở việc trong mốc; ghi ở đây để cửa sổ kế đọc.

**Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — CHƯA CÓ RĂNG.** Mốc khai bằng lời trong
Context: crm, kèm câu ràng buộc của Cổng Giá trị. Ngưỡng đang đếm: một mốc cắt số mà sau 21 ngày không
kho nào cài nó.

**Tag `v2.21.0`** gắn tại commit ký mốc trên `main` SAU khi gộp, rồi đẩy lên remote — làm tay; không là
tiêu chí vì nó đến sau chữ ký.

**Eval trỏ khoá mảnh, không khoá suite trọn** — cùng lý do mốc 2.18.3.

**Chỗ cắt cho cửa sổ kế** (không mở ô — có ca thật trong cửa sổ):

1. **Ca P179 đốt lượt chấm hai lần trong cửa sổ** (`viec-ke-theo-plan` lượt 2, `lan-ghim-lai-giu-…` lượt
   2): sổ known-limits phải thêm hàng ở chính lượt ký, mà lượt chấm REJECT trước khi tới đó.
2. **Lớp «khai đúng mà kit im như chưa khai»** — hai hiện thân trong cửa sổ: thư mục trần trong `paths`
   (`docs/plans/2026-10-03-hat-giong-loc-paths-dong-mac-dinh.md`) và danh sách lộ trình sát lề
   (`docs/plans/2026-10-03-hat-giong-khoa-lo-trinh-khai-ma-khong-doc-ra.md`).
