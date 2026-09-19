---
schema_version: 1
feature: Phát hành kit 2.17.0 — đóng số cho cửa sổ 2.16 → 2.17 (một vòng chạm engine đã ký «ho-so-nghi» + bản vá «nen-cong-cu-lenh-shell»), để ba kho tiêu thụ đang chờ nhận engine mới theo mốc có chủ đích; làn V, không dựng răng
slug: release-2-17-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 2 manifest + dòng khớp-phiên-bản GUIDE + CHANGELOG + workspace hồ sơ + bản đồ — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: verified
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-19T15:49:22Z
---

# Acceptance Contract: release-2-17-0

## Context

**Kho chờ nhận — ba, và cả ba đang trả phí hôm nay** (đo 19/09, lý do vế 4 luật (b) tồn tại):

- **OneFlow** — hồ sơ `normalize-text-vi` chặn mọi PR từ 16/09; owner quyết 17/09 cho nó nghỉ
  và ghi thẳng vào sổ «kit không có trạng thái nghỉ, nên owner bỏ qua có ghi nhận mỗi lần
  merge». 2.17.0 là bản đầu tiên có lối ra hợp pháp.
- **crm** (nhánh onehub) — cờ vàng thường trực trên MỌI thẻ Cổng Phạm vi vì đường nền đọc sai
  một executor dựng bằng cú pháp shell. Bốn hồ sơ đã duyệt từ 01–04/09 chưa thi công.
- **media-library** — lớp vendored là bản lẻ có vá riêng (gốc 2.8/2.9); PR nâng cấp #64 treo
  draft từ 11/09. 2.17.0 là mốc để nhận bản gốc.

**Cửa sổ này có gì** — suy từ kho, không chép tay (AC-4):

- `ho-so-nghi` (T3, ký với giới hạn 19/09, #188) — hồ sơ nghỉ: một dòng sổ có người và lý do
  làm hồ sơ ĐÃ KÝ rời khỏi lưới mà không sửa một byte chữ ký; bốn bộ đọc một hàm; thu phạm vi
  «chỉ hồ sơ đã có chữ ký người» sau khi đo tay thấy một dòng sổ biến hồ sơ bị bác chưa ai ký
  thành cổng xanh.
- `nen-cong-cu-lenh-shell` (T2, ký 19/09, #185) — chân công cụ của đường nền chỉ tra tên
  chương trình khi lệnh thật sự bắt đầu bằng tên chương trình.

Hồ sơ thứ ba được KÝ trong cửa sổ là \`ma-so-quyet-dinh-duy-nhat\` (18/09, sau lần cắt số) —
nhưng **mã của nó đã nằm trong 2.16.0**; chỉ chữ ký và lượt ghim lại rơi vào cửa sổ này. Người
dùng 2.17.0 không nhận thêm hành vi nào từ nó. Phép đo AC-4 đếm cả ba và phân biệt bằng quan hệ
này, chứ không tin danh sách tôi gõ tay: bản nháp đầu của Context chỉ kể hai hồ sơ và chính
AC-4 bắt ra thiếu.

Ngoài ba hồ sơ ấy, cửa sổ còn hai PR tài liệu và sổ sách của chính kit (luật «ô chỉ mở khi có
neo ngoài» #186, hai ô có neo #187) — **không đi theo bản phát hành**, không đổi gì ở kho tiêu
thụ. Tám trên sáu mươi mốt lần ghi chạm engine.

Mốc này **không đổi một dòng mã cổng** — chỉ đóng số, nói người dùng nhận gì (mục `v2.17.0`
trong mô tả hai gói), và đi **làn V** như tiền lệ 2.5.0/2.7.0: một lượt người ở Cổng Phạm vi,
cửa veto mở, không dựng răng.

Source input: `git log 26bf12fe..d4ebcd00` · nếp phát hành `_acceptance/release-2-5-0/` ·
mục tiêu 2.17.0 owner duyệt 19/09 (kết quả ở kho, không phải số phiên bản).

## Năm dòng số của luật (c) — cửa sổ một ngày, đếm tay

| Dòng | Số | Nguồn |
|---|---|---|
| Làm-xong→quyết-được | `ho-so-nghi`: mở 19/09 sáng, ký 19/09 chiều — trong ngày · `nen-cong-cu-lenh-shell`: trong ngày | giờ commit của hai hồ sơ |
| Lượt gọi người / vòng | `ho-so-nghi`: **7** — 4 trong thiết kế (Đáng · Phạm vi · 1.5 · Bằng chứng) + 3 ngoài (dừng-vá trình ba lối · thu phạm vi · ký với giới hạn), mỗi lượt **1 chạm** (một chữ) | sổ quyết định + hội thoại |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0** lượt chấm mất vì hạ tầng — đường nền chạy trước và bắt 1 lỗi thật (phép đo hội đồng thiếu trường câu hỏi) | `duong-nen.md` + sổ chạy |
| Token máy / vòng | `ho-so-nghi` ba lượt chấm: **≈6,8 M** token tác tử (2,54 + 1,99 + 2,26); tách ba khối: **không đo được** cho mốc này — `wf-usage` chưa chạy, khai thẳng thay vì đoán | tool-result của ba lượt Workflow |
| Phút máy / lượt chấm | ≈30 · ≈24 · ≈32 phút (tổng ≈86 phút cho ba lượt) | `duration_ms` của ba lượt Workflow |

**Điều kiện tin cậy (ràng buộc, không phải chỉ số):** đường verdict không đổi thành phần trong
cửa sổ này — finder → refute trong hợp đồng → REJECT giữ nguyên ở cả ba lượt. Số lượt chấm sai
không tăng: 0 lượt sai, cả ba lượt đều chấm đúng vật và đúng lớp.

**Đọc được, không phải đo hình thức:** dòng 2 là con số đáng nhìn nhất — 3 lượt ngoài thiết kế,
cả ba đều do luật dừng-vá và luật thu-phạm-vi gọi người đúng lúc, không phải do máy tự chèn.
Dòng 4 khai «không đo được» cho phần tách khối thay vì bịa một tỉ lệ.

## Criteria

- AC-1: Given cây đã sửa, When đọc ba manifest plugin, Then `acceptance-gate` và `feature-loop` mang CÙNG một số hợp semver (`2.17.0`), `diagram-design` hợp semver (giữ `2.7.0`, không đổi kể từ mốc trước).
- AC-2: Given cây đã sửa, When đọc dòng «Khớp phiên bản» của GUIDE, Then nó khớp ĐÚNG ba số đọc từ ba manifest (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy đủ bốn suite, Then cả bốn XANH và `product-map --check` khớp.
- AC-4: Given tập hồ sơ của cửa sổ suy từ kho (`git log <mốc trước>..HEAD -- skills feature-loop commands scripts lib hooks vendor`), When so với danh sách kể trong Context, Then hai tập BẰNG NHAU — hồ sơ nào chạm engine mà mốc không kể là mốc nói dối về cửa sổ.
- AC-6: Given mô tả hai plugin, When đọc mục của ĐÚNG số đang phát hành, Then mô tả `acceptance-gate` CÓ mục `v2.17.0` và mục `v2.17.0` của `feature-loop` TỰ khai cặp `acceptance-gate >= 2.17.0` — đo trên đoạn cắt từ `v2.17.0`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff — Known limits.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-5-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff) `[thước CE: năm mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-6; không ô mới, không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc, không có phiên đo (cùng căn cứ với release-2-3-0 → 2-5-0).

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1; bài học ba mốc 2.0.0/2.1.0/2.2.0).
- Nâng số `diagram-design` — không đổi một dòng kể từ mốc trước.
- Ghim lại các hồ sơ đã ký đang hoá cũ — §7.1: chiến dịch ghim lại là việc SAU khi mốc merge. Cửa sổ này KHÔNG chạy chiến dịch, khác 2.16.0.
- Cài bản mới lên ba kho tiêu thụ — việc SAU khi mốc merge, và là thước thật của mốc này.
- Sửa năm giới hạn có tên của `ho-so-nghi` — đã ký với giới hạn, ngưỡng mở lại ghi trong chính hợp đồng ấy.
- Lớp vendored tự xưng (ô `lop-vendored-tu-xung`) — nhát cắt thứ hai của mục tiêu 2.17.0, chờ cửa sổ sau.

## Notes

**Vì sao làn V:** mốc này không có mục nào chỉ-người-biết. Số lấy từ manifest, danh sách vòng
suy từ kho, hồi quy là bốn suite thường trực. Cổng còn lại một lối ra sống duy nhất là «ừ» —
đúng định nghĩa trạm thu phí trong kim chỉ nam. Cửa veto mở và có dấu vết thời gian; owner veto
lúc nào cũng được.

**Vế 4 của luật (b) — «mốc chỉ cắt khi có kho chờ nhận» — CHƯA CÓ RĂNG** (khai ở CLAUDE.md, khối
«Ô chỉ mở khi có NEO NGOÀI»). Mốc này khai bằng lời trong Context: ba kho, mỗi kho một câu lý do
đo được. Ngưỡng đang đếm: một mốc cắt số mà sau 21 ngày không kho nào cài nó.

**Chỗ cắt cho cửa sổ kế (được phép ghi, không thành ô):** lớp vendored tự xưng — ô đã mở với
neo, chờ cửa sổ sau. Và hai hạt giống của cửa sổ này: khuôn eval hội đồng do bộ máy sinh bị
chính bộ kiểm lại từ chối; bộ đếm vòng meta trên thẻ vẫn lấy mẫu số là lần cắt số.
