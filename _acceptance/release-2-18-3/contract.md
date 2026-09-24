---
schema_version: 1
feature: Phát hành kit 2.18.3 — đóng số cho cửa sổ 2.18.2 → 2.18.3 (một vòng chạm engine đã ký «ha-tang-khong-dot-luot»), để crm nhận engine theo mốc có chủ đích và ghim được theo tag; làn V, không dựng răng
slug: release-2-18-3
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + 2 khoá executor — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-24T04:51:18Z
---

# Acceptance Contract: release-2-18-3

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm` đã nâng 2.18.2 ở mọi scope sống ngày 24/09 và là
kho mà ba hạt giống của vòng này lấy gốc (lượt BLOCKED thành câu hỏi ở `kiem-auth-khong-phu-thuoc-thu-tu`;
thẻ hồ sơ khép còn hỏi ở `cua-vao-noi-tieng-viet`, `tieng-viet-cho-crm`). Owner gọi tên mốc ở lệnh
mở vòng 24/09: «Sau ký: mốc release-2-18-3 làn V theo tiền lệ release-2-18-2».

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay:

- `ha-tang-khong-dot-luot` (T2, ký Phan Le Manh 24/09, `35b91ba2`) — suite dưới trần công cụ (scripts
  bốn mảnh, plugins ba vùng); lượt BLOCKED vì hạ tầng thử lại cùng round (`s4-args.mjs`); khuôn
  `/goal` thôi coi BLOCKED là xong, có điểm kết làn V; thẻ Cổng 1 của hồ sơ khép thôi hỏi. Vật engine
  đổi: `feature-loop/scripts/s4-args.mjs`, `feature-loop/skills/feature-loop/SKILL.md`,
  `scripts/gate-card.js`; kèm tệp chạy suite của kit và `GUIDE.md`.

Không tệp nào trong lớp chép CI (GUIDE §5.3) đổi trong cửa sổ — kho còn đường chép không phải chép
gì. Mốc này **không đổi một dòng mã cổng** — chỉ đóng số, nói người dùng nhận gì (mục `v2.18.3`
trong mô tả hai gói và `CHANGELOG.md`), và đi **làn V** như tiền lệ 2.5.0 → 2.18.2. Năm dòng số của
luật (c), bảng dự báo, điều kiện tin cậy và dòng hiệu chuẩn nằm ở mục `2.18.3` của `CHANGELOG.md`
— một nguồn, hồ sơ không chép lại.

Source input: `git log v2.18.2..HEAD` · nếp phát hành `_acceptance/release-2-18-2/` · lệnh owner 24/09.

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.18.3`), `diagram-design` hợp semver.
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, ba vùng plugins, hooks, workflows), Then cả mười XANH và `product-map --check` khớp.
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 0e414a02 …`, mốc = commit của tag `v2.18.2`), When so với danh sách kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `0e414a02` (tag `v2.18.2`), When so thư mục `diagram-design/` với HEAD bằng git, Then không một dòng nào đổi — `diagram-design` giữ `2.7.0` là đúng, không phải quên nâng.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.18.3` và mục `v2.18.3` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.18.3`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-18-2, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói không đổi) `[thước CE: mười mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc, không có phiên đo (cùng căn cứ với release-2-3-0 → 2-18-2).

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/ feature-loop/workflows/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1).
- Nâng số `diagram-design` — không đổi một dòng kể từ mốc trước (AC-5).
- Lớp chép tự xoá (hạt giống 2.18.3 của mốc trước) — cửa sổ vừa rồi dành cho vòng owner gọi tên; nhát cắt còn nguyên cho cửa sổ kế.
- Chiến dịch ghim lại các hồ sơ đã ký — §7.1: việc SAU khi mốc merge, chỉ khi lưới báo hoá cũ.
- Đổi `KIT_SHA` ở các kho tiêu thụ và nâng plugin ở crm — việc SAU khi tag có mặt.

## Notes

**Vì sao làn V:** mốc này không có mục nào chỉ-người-biết. Số lấy từ manifest, danh sách vòng suy từ
kho, hồi quy là các lệnh suite thường trực. Cửa veto mở và có dấu vết thời gian; owner veto lúc nào
cũng được.

**Luật chiều rộng (b), khai thẳng:** cửa sổ có ĐÚNG MỘT vòng meta (`ha-tang-khong-dot-luot`), owner
gọi tên 24/09 là vòng duy nhất của cửa sổ sau 2.18.2.

**Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — CHƯA CÓ RĂNG.** Mốc khai bằng lời trong
Context: crm. Ngưỡng đang đếm: một mốc cắt số mà sau 21 ngày không kho nào cài nó.

**Tag `v2.18.3`** gắn tại commit ký mốc trên `main` SAU khi gộp, rồi đẩy lên remote — làm tay; không
là tiêu chí vì nó đến sau chữ ký.

**Eval trỏ khoá mảnh, không khoá suite trọn:** tránh chính giới hạn Ngoài-1 của vòng vừa ký (eval trỏ
khoá trọn thì lượt chấm/ghim lại chạy thêm suite trọn sát trần).
