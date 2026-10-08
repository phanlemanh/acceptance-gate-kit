---
schema_version: 1
feature: Phát hành kit 2.25.0 — đóng số cho cửa sổ 2.24.0 → 2.25.0 (hai vòng đã ký «luot-sua-giu-du-dem-dung» và «lenh-dai-chay-rieng»: lượt sửa giữ đủ mục ngoài hợp đồng, lệnh dài và eval nặng chạy riêng ở lượt chấm), để crm cài trước đợt sau-14-10; làn V, không dựng răng
slug: release-2-25-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + 3 khoá executor + một ca đo ghim mục CHANGELOG — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-08T17:26:14Z
---

# Acceptance Contract: release-2-25-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm`. Owner gọi mốc 09/10 («cắt») theo làn V như tiền lệ
2.5.0 → 2.24.0. Hai vòng của cửa sổ đều neo hồ sơ crm: `lenh-dai-chay-rieng` ở `tro-ly-okr-bo-final-output`
(bốn lượt chấm đốt bởi lệnh dài và eval model chạy chồng suite), `luot-sua-giu-du-dem-dung` ở
`don-okr-nhap-sai` (lượt sửa làm rụng ba mục ngoài hợp đồng). `crm/docs/plan/dot-sau-14-10/README.md` ghi
«gộp và cài cùng phiên bản trước khi mở đợt».

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ:

- `luot-sua-giu-du-dem-dung` (T2, ký 07/10; PR #278) — mục ngoài hợp đồng không rụng, khung ui-check carry giữ khung gốc, thước-vật bỏ phần gộp từ nền.
- `lenh-dai-chay-rieng` (T2, ký 07/10; PR #279) — eval khai `long_running` chạy nền, eval trong `feature_loop.model_evals` chạy riêng sau mọi lệnh máy.

Ngoài hồ sơ: lộ trình kit (#281, #282, chỉ tài liệu) và ô Cổng Đáng `xuat-du-lieu-lo-trinh` (#283, chỉ hồ
sơ). Vật của ô đó (PR #285, đã ký Cổng 2) CỐ Ý KHÔNG vào mốc này — owner gộp sau khi 2.25.0 cắt, gom cùng
hai bước lộ trình kế vào một mốc sau. Vật engine đổi trong cửa sổ (`git diff --name-only 9d1ae527 HEAD --
scripts lib hooks skills feature-loop commands vendor`): `commands/acceptance-init.md` (một dòng chú thích
khuôn), `feature-loop/scripts/carry-plan.mjs`, `feature-loop/scripts/lib/lan-khoa.mjs`,
`feature-loop/scripts/s4-args.mjs`, `feature-loop/scripts/thuoc-vat.mjs`,
`feature-loop/skills/feature-loop/SKILL.md`, `feature-loop/workflows/acceptance-verify.js`,
`skills/acceptance/references/eval-executors.md`, `skills/acceptance/references/tool-kill-rule.md`. **Lớp
chép CI KHÔNG đổi** — không tệp nào của INIT-CI-COPY-LIST nằm trong danh sách trên.

Số là **2.25.0, không 2.24.1**: một khoá eval mới (`long_running`) và thứ tự chạy mới cho eval nặng ở
lượt chấm. Mốc **không đổi một dòng mã cổng** — chỉ đóng số, nói người dùng nhận gì (mục `v2.25.0` trong
mô tả hai gói và `CHANGELOG.md`), đi **làn V**. Năm dòng số, bảng dự báo, điều kiện tin cậy, dòng hiệu
chuẩn và ghi chú nhận mốc cho crm nằm ở mục `2.25.0` của `CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.24.0..HEAD` · nếp phát hành `_acceptance/release-2-24-0/` · mục Notes của hai hồ
sơ cơ hội.

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.25.0`), `diagram-design` hợp semver.
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, ba vùng plugins, hooks, workflows), Then cả mười XANH và `product-map --check` khớp.
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 9d1ae527 …`, mốc = commit gắn tag `v2.24.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `9d1ae527` (tag `v2.24.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.25.0` và mục `v2.25.0` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.25.0`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-24-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi) `[thước CE: mười chín mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc (cùng căn cứ với release-2-3-0 → 2-24-0). Ngưỡng của hai vòng đọc trên crm sau khi kho nhận mốc.

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/ feature-loop/workflows/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1).
- Vật của ô `xuat-du-lieu-lo-trinh` (PR #285) — owner gộp SAU khi mốc này cắt, vào một mốc sau.
- Sửa Known limits của hai vòng trong cửa sổ.
- Bật ổ cắm lộ trình của chính kit (`lo_trinh.tep` trong `_acceptance/config.yaml`) — đi cùng chiến dịch ghim lại của mốc, SAU khi mốc gộp (§7.1), vì sửa cấu hình làm cũ các hồ sơ có paths chạm nó.
- Đưa crm nhận 2.25.0 (cài lại plugin, khai `long_running`, đo trước→sau) — việc của phiên ở kho crm sau khi tag có mặt; phiên kit không chạm kho crm.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào khớp `t3_paths`.
- Cả hai vòng của cửa sổ neo kho tiêu thụ (crm); luật (b) — mốc này là mốc KHO NHẬN kế tiếp sau 2.24.0 (crm nhận 2.24.0 ở crm-onehub#282).
- E1/E2/E6 nay chạy lệnh vùng 3 GIỮ dòng P200 (`rel2250_vung_3_p200`) — ba mốc 2.22 → 2.24 cùng mang Known limit «chấm trên dòng mà bộ lọc của chính lệnh cắt khỏi output». Các dòng vế + chiều đỏ của P200 gộp thành MỘT dòng, vì workflow lượt chấm chỉ giữ ba dòng cuối (gồm dòng `__EXIT`) của lệnh xanh khi viết báo cáo — lượt chấm 2 bắt bản nhiều dòng bị cắt mất; giả lập trên đầu ra thật: bảy chuỗi `expected` của E1/E2/E6 sống qua bước cắt. Suite vẫn chạy `plugins_vung_3` như mọi hồ sơ; vùng 3 chạy hai lần trong lượt chấm.
- Ca đo AC-10 của hồ sơ đã ký `luot-sua-giu-du-dem-dung` ghim mục «Chưa phát hành» của CHANGELOG — cắt số làm nó đỏ. Sửa CA ĐO (đọc phần CHANGELOG mới hơn số ở mốc gốc của ca, rút từ manifest tại `7b1afe1e`), không sửa hợp đồng đã ký.
- Chiều đỏ của hai phép đo cửa sổ đo khi mở hồ sơ: `rel-cua-so.sh 9d1ae527 x` thoát 1 gọi tên hai hồ sơ thiếu và «x» thừa; lệnh giữ-số của `diagram-design` với mốc `1b98fdb1` thoát 1 (`2.7.0` ≠ `2.7.1`).
