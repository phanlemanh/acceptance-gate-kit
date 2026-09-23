---
schema_version: 1
feature: Phát hành kit 2.18.2 — đóng số cho cửa sổ 2.18.1 → 2.18.2 (một vòng chạm engine đã ký «chot-may-chu-ky-sau-synthesize») và đường CI mặc định «chạy cổng từ bản kit ghim sha», để sáu kho vừa nâng 2.18.1 nhận engine theo mốc có chủ đích và ghim được theo tag; làn V, không dựng răng
slug: release-2-18-2
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản và §5.3 của GUIDE + CHANGELOG + một hạt giống + workspace hồ sơ + bản đồ — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: draft
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-23T14:26:29Z
---

# Acceptance Contract: release-2-18-2

## Context

**Kho chờ nhận — đo được trước khi cắt:** sáu kho nâng 2.18.1 ngày 23/09
(`docs/findings/2026-09-23-nang-sau-kho-len-2-18-1.md`). Hai kho đã ghim sha `8a4ea881` theo
đường mặc định mới của GUIDE §5.3 (oneflow #129, artifact-platform #392); ba kho có chip ghim sha
đang chờ (media-library, floorplanstudio, MapPoster); `crm` còn đường chép, chờ 2.18.3. Owner gọi
tên mốc qua phiên điều phối «Cập nhật kit mới nhất từ github» (23/09).

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay:

- `chot-may-chu-ky-sau-synthesize` (T2, ký «manh» 23/09, `49876e91`) — workflow S4 tự ép rỗng
  `human_signoff` / `human_override` / `bypass_ack` và ép `verified_at` bằng giờ engine sau bước
  tổng hợp; khối carry giữ giờ carry. Vế 2 (răng bên đọc) owner không phê → hạt giống
  `docs/plans/2026-09-23-hat-giong-rang-ben-doc-verified-at-chu-ky.md`. Vật engine duy nhất đổi
  trong cửa sổ: `feature-loop/workflows/acceptance-verify.js`.

Ngoài vòng, cửa sổ còn tài liệu của chính kit — **đi theo bản phát hành vì kho đọc chúng**: GUIDE
§5.3 đổi đường mặc định sang «CI chạy cổng từ bản kit ghim sha, không chép tệp» (c6843d42,
72763e17, 65f958d5, 8f662829, 4defa4c7) + đính chính CHANGELOG 2.18.1; hạt giống lớp chép 2.18.3;
findings `2026-09-23-nang-sau-kho-len-2-18-1.md` (§1–§3g). Mốc này thêm một câu vào §5.3: kho
lấy kit bằng tag `v2.18.2` được.

Mốc này **không đổi một dòng mã cổng** — chỉ đóng số, nói người dùng nhận gì (mục `v2.18.2` trong
mô tả hai gói và `CHANGELOG.md`), và đi **làn V** như tiền lệ 2.5.0/2.7.0/2.17.0/2.18.0/2.18.1.
Năm dòng số của luật (c), bảng dự báo và điều kiện tin cậy nằm ở mục `2.18.2` của
`CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log ccabea22..49876e91` · nếp phát hành `_acceptance/release-2-18-1/` · lệnh
owner 23/09 qua phiên điều phối.

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.18.2`), `diagram-design` hợp semver.
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy đủ bốn suite, Then cả bốn XANH và `product-map --check` khớp.
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh ccabea22 …`), When so với danh sách kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc trước `ccabea22` (gộp 2.18.1), When so thư mục `diagram-design/` với HEAD bằng git, Then không một dòng nào đổi — `diagram-design` giữ `2.7.0` là đúng, không phải quên nâng.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.18.2` và mục `v2.18.2` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.18.2`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-18-1, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói không đổi) `[thước CE: chín mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; ô «gói không đổi» thành AC-5 vì lệnh mốc đòi kiểm bằng git; không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc, không có phiên đo (cùng căn cứ với release-2-3-0 → 2-18-1).

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/ feature-loop/workflows/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1).
- Nâng số `diagram-design` — không đổi một dòng kể từ mốc trước (AC-5).
- Đưa bước gắn tag vào `/signoff` và xoá lớp chép — hạt giống 2.18.3; mốc này gắn tag BẰNG TAY sau khi gộp.
- Chiến dịch ghim lại các hồ sơ đã ký, kể cả 25 hồ sơ mang `verified_at` bịa (13 kit, 12 crm) — §7.1: việc SAU khi mốc merge.
- Đổi `KIT_SHA` ở các kho tiêu thụ — việc của phiên từng kho SAU khi tag có mặt.

## Notes

**Vì sao làn V:** mốc này không có mục nào chỉ-người-biết. Số lấy từ manifest, danh sách vòng
suy từ kho, hồi quy là bốn suite thường trực. Cửa veto mở và có dấu vết thời gian; owner veto
lúc nào cũng được.

**Luật chiều rộng (b), khai thẳng:** cửa sổ có ĐÚNG MỘT vòng meta (`chot-may-chu-ky-sau-synthesize`),
owner gọi tên 23/09 là vòng đầu cửa sổ sau 2.18.1.

**Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — CHƯA CÓ RĂNG.** Mốc khai bằng lời trong
Context: sáu kho, hai đã ghim sha chờ đổi. Ngưỡng đang đếm: một mốc cắt số mà sau 21 ngày không
kho nào cài nó.

**Tag `v2.18.2`** gắn tại commit ký mốc trên `main` SAU khi gộp, rồi đẩy lên remote — việc mới,
làm tay; không là tiêu chí vì nó đến sau chữ ký.

**Chỗ cắt cho cửa sổ kế (được phép ghi, không thành ô):** 2.18.3 lớp chép tự xoá, rồi 2.19 máy hỏi
ngoài thiết kế ở S1 — nguyên văn ở mục `2.18.2` của `CHANGELOG.md`.
