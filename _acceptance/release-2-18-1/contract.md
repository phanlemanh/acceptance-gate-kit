---
schema_version: 1
feature: Phát hành kit 2.18.1 — đóng số cho cửa sổ 2.18.0 → 2.18.1 (một vòng chạm engine đã ký «ho-so-khep-thoi-hoi»), để kho crm — nơi mọi lỗ của bản này lộ ra trong ngày cài 2.18.0 — nhận engine theo mốc có chủ đích; làn V, không dựng răng
slug: release-2-18-1
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản GUIDE + CHANGELOG + workspace hồ sơ + bản đồ — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: draft
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-22T07:40:00Z
---

# Acceptance Contract: release-2-18-1

## Context

**Kho chờ nhận — một, đo được trước khi cắt:** **crm** (nhánh onehub). Ngày 22/09 crm cài 2.18.0
và lộ đúng các lỗ bản này vá: NOTE «cửa veto đang mở» đếm hồ sơ đã chấm bởi thực tế; CI đỏ
«bản đồ lệch» vì lớp CI vendored thiếu `product-map.mjs` và `trang-thai-ho-so.cjs` (crm tự vá,
PR crm #70); làn V gọi `khai-lang-gioi-thieu` là xanh-sạch trong khi tệp phát hiện có hai mục.

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay:

- `ho-so-khep-thoi-hoi` (T3, ký 22/09, #202) — vị từ MỘT nguồn «hồ sơ đã khép»; bộ đếm cửa veto
  và thẻ Cổng Bằng chứng thôi đối xử hồ sơ đã khép như đang mở; làn máy-đi-trước đọc
  `review-findings.md` × sổ gate2; lớp CI vendored 15 tệp theo bao đóng nạp; hai bộ kiểm thôi vỡ
  trên hồ sơ chấm-bởi-thực-tế thật. Gộp kèm `observed release-2-0-0` (owner ghi 22/09).

Ngoài hồ sơ ấy, cửa sổ còn bốn PR tài liệu và sổ sách của chính kit (#196 ghim lại 2.18.0, #197
và #198 hạt giống, #200 và #201 kế hoạch/audit) — **không đi theo bản phát hành**.

Mốc này **không đổi một dòng mã cổng** — chỉ đóng số, nói người dùng nhận gì (mục `v2.18.1` trong
mô tả hai gói và `CHANGELOG.md`), và đi **làn V** như tiền lệ 2.5.0/2.7.0/2.17.0/2.18.0.

Source input: `git log 41b949de..eea818b1` · nếp phát hành `_acceptance/release-2-18-0/` · lệnh
owner 22/09 «Kiểm tra CI và merge #202» nối tiếp «Tiếp tục tuần tự».

## Năm dòng số của luật (c) — cửa sổ một ngày

| Dòng | Số | Nguồn |
|---|---|---|
| Làm-xong→quyết-được | round 2 PASS 04:08Z → owner trả lại 05:26Z, ≈ 78 phút · round 3 PASS 06:18Z → ký 06:37Z, ≈ 19 phút | giờ commit + sổ quyết định |
| Lượt gọi người / vòng | **4** = trần T3, 0 ngoài thiết kế (Đáng · Phạm vi gộp Gate 1.5 · Bằng chứng trả lại · Bằng chứng ký), mỗi lượt **1 chạm**. Lượt «trả lại» dùng đúng chỗ trống của Gate 1.5 đã gộp; việc sửa Ngoài-5/7 đi trong vòng (sai hợp đồng theo AC-1), không quay Cổng 1 · tin người tự gửi giữa vòng («Try again», «Tiếp tục», «Kiểm tra tiến độ») không phải máy gọi | sổ quyết định + hội thoại |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **1** lượt — round 1 BLOCKED: suite scripts bị trần 600 s của công cụ ngắt (suite ở bản trước vòng đã 528 s một mình, vòng đẩy lên 581–626 s; tám tác tử song song đẩy qua trần) | `run-log.jsonl` round-tally |
| Token máy / vòng | ba lượt: **1,47 M · 1,25 M · 1,34 M** token tác tử. Tách ba khối theo out-token — round 1: chứng-minh-vật (machine+baseline) 21,1 k · tìm-lỗi (review+triage) 45,0 k · tổng hợp (capture+synthesize) 22,2 k · round 2: 11,8 k · 24,9 k · 25,3 k · round 3: 15,5 k · 15,3 k · 13,9 k | `usage-report.md` |
| Phút máy / lượt chấm | round 1 ≈ 27 phút · round 2 ≈ 27 phút · round 3 ≈ 30 phút; đường găng mọi lượt là khối machine (1 214 s · 1 203 s · 1 556 s), trong đó suite scripts | `duration_ms` Workflow + bảng vai |

**Điều kiện tin cậy (ràng buộc, không phải chỉ số):** đường verdict đổi thành phần — điều kiện
«Ngoài hợp đồng» của làn V đọc thêm tệp phát hiện × sổ, kèm răng hai chiều ở CẢ HAI bản dựng
(HK-AC4 ma trận sáu hàng + mutant; LV5 26 hàng đẳng thức; chiều im HK-AC5 trên 132 hồ sơ thật:
0 đổi không giải thích). Số lượt chấm SAI không tăng: round 1 bị đốt vì hạ tầng, không chấm sai
vật. Dòng 4–5 vì thế cắt được.

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 8` — kit `0 / 1` (release-2-0-0) · crm
`0 / 7` (onehub `b7fac38a`); đo bằng `scripts/hieu-chuan-moc.mjs --root <kho>`. N tăng từ 0 lên 8
kể từ mốc trước — dòng này lần đầu hữu hiệu.

**Đọc được, không phải đo hình thức:** dòng 3 là số đáng nhìn — suite scripts vốn đã 528 s một
mình, sát trần 600 s của công cụ; mọi vòng sau thêm ca vào suite này đều có thể bị BLOCKED vì
hạ tầng. Chỗ cắt cho cửa sổ kế (Notes).

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.18.1`), `diagram-design` hợp semver (giữ `2.7.0`, không đổi kể từ mốc trước).
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy đủ bốn suite, Then cả bốn XANH và `product-map --check` khớp.
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 41b949de …`), When so với danh sách kể trong Context, Then hai tập BẰNG NHAU — hồ sơ được ký mà mốc không kể là mốc nói dối về cửa sổ.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.18.1` và mục `v2.18.1` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.18.1` — đo trên đoạn cắt từ `v2.18.1`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-18-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff) `[thước CE: tám mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-6; không ô mới, không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc, không có phiên đo (cùng căn cứ với release-2-3-0 → 2-18-0).

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1).
- Nâng số `diagram-design` — không đổi một dòng kể từ mốc trước.
- Chiến dịch ghim lại các hồ sơ đã ký, kể cả dòng nghỉ cho `lan-v-khong-phai-cho-ky` (mutant 2 hỏng vì chữ ký hàm mới) — §7.1: việc SAU khi mốc merge.
- Cài bản mới lên `crm` — việc SAU khi mốc merge (phiên crm-rollout), và là thước thật của mốc này.
- Sửa mười hai giới hạn có tên của `ho-so-khep-thoi-hoi` — đã ký với giới hạn.

## Notes

**Vì sao làn V:** mốc này không có mục nào chỉ-người-biết. Số lấy từ manifest, danh sách vòng
suy từ kho, hồi quy là bốn suite thường trực. Cửa veto mở và có dấu vết thời gian; owner veto
lúc nào cũng được.

**Luật chiều rộng (b), khai thẳng:** cửa sổ có ĐÚNG MỘT vòng meta (`ho-so-khep-thoi-hoi`), owner
gọi tên 22/09 sau khi crm nhận 2.18.0 (PR crm #70).

**Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — CHƯA CÓ RĂNG.** Mốc khai bằng lời trong
Context: một kho, ba triệu chứng đo được ngày cài. Ngưỡng đang đếm: một mốc cắt số mà sau 21
ngày không kho nào cài nó.

**Kho tiêu thụ cài 2.18.1 phải:** chép thêm năm tệp lớp CI (GUIDE §5.3) và **xoá**
`lib/out-of-contract.js` (đổi tên thành `.cjs`).

**Chỗ cắt cho cửa sổ kế (được phép ghi, không thành ô):** suite scripts sát trần 600 s của công
cụ (dòng 3); nhãn «Ngoài-N» neo theo nội dung
(`docs/plans/2026-09-22-hat-giong-nhan-ngoai-n-neo-theo-noi-dung.md`).
