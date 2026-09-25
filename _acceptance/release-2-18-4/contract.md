---
schema_version: 1
feature: Phát hành kit 2.18.4 — đóng số cho cửa sổ 2.18.3 → 2.18.4 (ba vòng đã ký cùng sửa đường nền «nen-cong-cu-gan-bang-lenh-con» + «nen-cay-ban-dong-dau» + «nen-chay-bang-moi-truong-nguoi-goi»), để crm thôi đọc «nen: do» giả ở mọi phiên mở vòng; làn V, không dựng răng
slug: release-2-18-4
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + 2 khoá executor + 1 hạt giống — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-25T03:01:55Z
---

# Acceptance Contract: release-2-18-4

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm` đã nâng 2.18.3 ở mọi scope sống ngày 24/09. Đường nền
của hai phiên crm mở vòng sau khi #216 đã gộp — `zalo-webhook-doc-khuon-that` (22:38Z 24/09) và
`khung-trang-cai-dat` (23:34Z 24/09) — cùng ghi `nen cong-cu: THIEU merge-base` cho hai khoá
`executors.script.zqw_giu_nqz` và `nzm_giu_da_ky`, và cả hai phiên đẩy chip đề xuất «sửa đường nền»
cho owner. Bộ tách của `main` đọc đúng hai khoá ấy ra `git` (đo 25/09 trên chính config crm). Mục
test plan còn trống của PR #216 — «sau mốc phát hành kế: chạy lại đường nền ở crm@onehub, dòng
`THIEU merge-base` phải biến mất» — chỉ đóng được sau mốc này. Owner gọi mốc 25/09: «cắt».

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay:

- `nen-cong-cu-gan-bang-lenh-con` (T2, ký 24/09, PR #216) — chân công cụ tra chương trình trong lệnh
  con của phép chỉ-gán.
- `nen-cay-ban-dong-dau` (T2, ký 24/09, PR #218) — chân suite đọc trạng thái cây thô, không trim dòng
  porcelain đầu.
- `nen-chay-bang-moi-truong-nguoi-goi` (T2, ký 24/09, PR #217) — đường nền chạy lệnh bằng môi trường
  người gọi (`bash -c` + env), không shell đăng nhập.

Vật engine đổi trong cửa sổ: đúng MỘT tệp, `feature-loop/scripts/duong-nen.mjs` (đo:
`git diff --stat 36f1efed HEAD -- scripts lib hooks skills feature-loop commands vendor`). Tệp ấy
không nằm trong lớp chép CI (GUIDE §5.3) — kho còn đường chép không phải chép gì. Mốc này **không
đổi một dòng mã cổng** — chỉ đóng số, nói người dùng nhận gì (mục `v2.18.4` trong mô tả hai gói và
`CHANGELOG.md`), và đi **làn V** như tiền lệ 2.5.0 → 2.18.3. Năm dòng số của luật (c), bảng dự báo,
điều kiện tin cậy và dòng hiệu chuẩn nằm ở mục `2.18.4` của `CHANGELOG.md` — một nguồn, hồ sơ không
chép lại.

Source input: `git log v2.18.3..HEAD` · nếp phát hành `_acceptance/release-2-18-3/` · lệnh owner 25/09.

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.18.4`), `diagram-design` hợp semver.
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, ba vùng plugins, hooks, workflows), Then cả mười XANH và `product-map --check` khớp.
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 36f1efed …`, mốc = commit của tag `v2.18.3`), When so với danh sách kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `36f1efed` (tag `v2.18.3`), When so thư mục `diagram-design/` với HEAD bằng git, Then không một dòng nào đổi — `diagram-design` giữ `2.7.0` là đúng, không phải quên nâng.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.18.4` và mục `v2.18.4` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.18.4`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-18-3, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói không đổi) `[thước CE: mười một mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc, không có phiên đo (cùng căn cứ với release-2-3-0 → 2-18-3).

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/ feature-loop/workflows/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1).
- Nâng số `diagram-design` — không đổi một dòng kể từ mốc trước (AC-5).
- Vá `check_overflow.py` của `diagram-design` (vỡ `JSONDecodeError` khi nhãn tràn có ngoặc vuông, gặp ở crm 25/09) — owner chọn ghi sổ, không đưa vào mốc này: hạt giống `docs/plans/2026-09-25-hat-giong-check-overflow-cat-json-o-ngoac-vuong.md`.
- Lớp chép tự xoá và máy hỏi ngoài thiết kế ở S1 (hai nhát cắt mốc 2.18.3 xếp cho cửa sổ kế) — cửa sổ vừa rồi dành cho ba vòng đường nền; hai nhát cắt còn nguyên.
- Chiến dịch ghim lại các hồ sơ đã ký — §7.1: việc SAU khi mốc merge, chỉ khi lưới báo hoá cũ.
- Đổi `KIT_SHA` ở các kho tiêu thụ và nâng plugin ở crm — việc SAU khi tag có mặt.

## Notes

**Vì sao làn V:** mốc này không có mục nào chỉ-người-biết. Số lấy từ manifest, danh sách vòng suy từ
kho, hồi quy là các lệnh suite thường trực. Cửa veto mở và có dấu vết thời gian; owner veto lúc nào
cũng được.

**Luật chiều rộng (b), khai thẳng:** cửa sổ có BA vòng, cả ba là vòng sản phẩm của đường nền (sửa báo
động giả mà kho tiêu thụ đo được), không vòng nào sửa thước của kit — không vòng meta nào trong cửa sổ.

**Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — CHƯA CÓ RĂNG.** Mốc khai bằng lời trong
Context: crm. Ngưỡng đang đếm: một mốc cắt số mà sau 21 ngày không kho nào cài nó.

**Tag `v2.18.4`** gắn tại commit ký mốc trên `main` SAU khi gộp, rồi đẩy lên remote — làm tay; không
là tiêu chí vì nó đến sau chữ ký.

**Eval trỏ khoá mảnh, không khoá suite trọn** — cùng lý do mốc 2.18.3 (giới hạn Ngoài-1 của
`ha-tang-khong-dot-luot`).
