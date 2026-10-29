---
schema_version: 1
slug: design-floor-hop-dong-nhap
feature: design-floor bước 1 — hợp đồng nhập cho mã Design OS (ease-design) mà kit sẽ vendor, bộ đo do kit giữ (giới hạn đã khai là xfail chặt) và rào đóng kín module có tệp khoá băm từng tệp; chưa vendor, chưa móc vào vòng
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Mạnh
decided_at: 2026-10-26T11:20:00Z   # owner chốt tên, từ vựng, phạm vi v1 và cách vendor trong phiên design-floor 26/10; máy ghi hộ
prototype:
  base_commit:
  disposition: archive
---

## Vấn đề & ai gặp

Gốc: acceptance-gate-kit/_acceptance/design-gate-che-do-chat — cổng thiết kế của kit trả «không đo được» bằng mã 0 nên eval của crm xanh rỗng, và engine static của nó không tính màu kể cả trên HTML; `lib/p-tiers.json` thả `design-system-color/font/radius`, nên kit hôm nay không chấm sự tuân thủ design system ở đâu cả.

design-floor lấp chỗ đó bằng mã của Design OS (`github.com/jangtrinh/design-os`, gói npm
`ease-design`). Đo chéo 26/10 (10 fixture của kit + 4 trang thật, thư mục trung tính): Design OS bắt
11/22 lỗi cài, kit 9/22; P0 tương phản của kit sai 5/8 lần và lặng lẽ REJECT 3/5 tệp vì chúng. Nhưng
mã chấm của bên thứ ba vào kit mà không có hợp đồng thì một lần nâng upstream đổi phán quyết dưới
chân mọi kho mà không ai thấy — và upstream hôm nay vi phạm chính các điều kit cần:

**Đo trên commit ghim `a7ad5f1`, 26/10/2026** (tái lập: `bash tests/design-floor/run-tests.sh`):
- `ui gate` trên `.eyebrow{color:#888}` với nền không khai: thoát 0, `pass: true`, chỉ một ghi chú
  `partial` «NOT COMPUTABLE»; cùng trang khai nền trắng ra lỗi thật 3,54:1.
- Thiếu tệp · đối số lạ · có lỗi: `1/1/1` ở gate, token-coverage, flow lint; `reuse-plan check` thiếu
  tệp ra `2` — mã lỗi nội bộ của upstream.
- Một layout `.tsx` có `<html lang><title>` → gate PASS, token-coverage PASS.
- Trang không CSS → token-coverage coverage 1, thoát 0.
- Mỗi lượt gate và `autofix --write` nối `memory.events.jsonl` + `memory.events.count.json` vào
  `design/` gần nhất đi ngược từ đích — kể cả `design/` ở thư mục cha.
- Vắng `--tokens`, gate đi ngược tối đa 5 cấp tìm `design/ds.manifest.json` và chấm theo token của
  design system mồi.
- Đóng kín: gate 104 tệp · 16 465 dòng; hợp năm lệnh 124 tệp · 18 474 dòng; 20 cặp lệnh·module cấm
  (tám `memory-*` trong gate và autofix, `figma-ds-tokens.ts` trong bốn lệnh); 0 import mạng.

**Người trả giá:** người ký Cổng Bằng chứng ở kho tiêu thụ (một PASS rỗng trên trang chưa đo được) ·
vòng S4→gộp (lệnh chấm ghi sổ = hồ sơ cũ hoá ngay khi chấm xong, ADR 0007) · người nâng ghim upstream
(không biết đóng kín đã phình hay đã kéo thêm một đường ghi).

**Trace:** nguyên tố 2 — bằng chứng không tự dối: phép đo của bên thứ ba phải đỏ được, và giới hạn của
nó là vật máy giữ (khối máy + xfail chặt), không phải lời dặn.

## Giả định chốt sinh tử

| # | Giả định | Nếu sai thì | Phép thử rẻ nhất | Trạng thái |
|---|---|---|---|---|
| 1 | Lấy đúng commit upstream về CI đủ rẻ để chạy mỗi PR | Bộ đo chỉ chạy tay → lại văn xuôi | sparse + depth 1 + `npm ci --omit=dev --workspaces=false`, đo thời gian lạnh | Đã thử: 14 s trọn bộ trên node 22, cache lạnh |
| 2 | Upstream nhận bốn nhóm sửa đổi (A–D) dưới dạng bật-theo-cờ | Kit phải giữ bản vá cục bộ → sổ LOCAL-PATCHES phình | Mở PR nhóm A (nhỏ nhất, chặn S4) và đo phản hồi | Chưa thử — PR chưa mở |

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: mã Design OS ở bản ghim có được phép chấm trong vòng của kit chưa, và
  thiếu đúng những gì?
- SỐNG: job `design-floor` xanh trên `main`, mỗi giới hạn đã khai mang sửa đổi upstream nó chờ; một
  PR upstream gộp xong làm đúng phép đo của nó XPASS→ĐỎ cho tới khi gỡ giới hạn.
- CHẾT: job đỏ lặp vì hạ tầng (lấy nguồn, npm) ≥2 lần trong một cửa sổ phát hành — khi đó bước 2
  vendor sớm hơn thay vì lấy qua mạng.
- Timebox: không mở vòng S4; bước 2 mang hợp đồng + evals + bằng chứng của chính nó và dùng bộ đo này
  làm executor.

## Kết quả prototype

Không dựng prototype riêng; số đo ở trên lấy từ chính bộ đo.

## Nguồn ngoài & phạm vi kế thừa

| Món vật liệu | Nguồn | Phân loại | Kế thừa? | Người ký |
|---|---|---|---|---|
| Mã chấm Design OS @ `a7ad5f1` | github.com/jangtrinh/design-os | vật | bước 2 | — |
| Bộ mã thoát 0/2/3/4/5 | `scripts/design-gate.mjs` của kit | luật | có — một bảng mã cho hai cổng thiết kế | — |
| Hình dạng tệp khai + băm từng tệp + một lệnh kiểm CI | ô `lop-vendored-tu-xung` (decided, chưa dựng) | triết-lý/logic | có — `upstream.lock.json` là ca thứ hai của cùng hình dạng | — |
| Đo chéo kit ↔ Design OS 26/10 | phiên design-floor 26/10 | số đo | có, làm nền vấn đề | — |

## Cổng 0

- **decision = build** (Mạnh, 26/10 — chốt tên `design-floor`, từ vựng M0–M3 + S0–S5, phạm vi v1, vendor
  có ghim + băm + sổ LOCAL-PATCHES, sửa gửi upstream bằng PR, chỉ luật đã phân xử mới được chặn).
- **disposition = archive**
- Bước này chỉ là bước 1 của quyết định đó; bước 2 (vendor + móc vào vòng) mở hợp đồng riêng.

## Thước đo thành công → ứng viên criterion

- Hợp đồng là nguồn duy nhất: khối máy được bộ đo, rào và chiều đỏ cùng đọc (`tests/design-floor/lib/hop-dong.mjs`).
- Mỗi phép đo có đối chứng; mười hai đột biến của `tu-thu.mjs` đỏ đúng thông điệp.
- Giới hạn đã khai là xfail chặt: XPASS và đỏ-sai-chữ-ký đều ĐỎ CI.

## Out of scope từ khám phá

- Không vendor mã upstream, không thêm plugin vào `marketplace.json`, không móc hook vòng — bước 2.
- Không mở PR upstream trong bước này — bốn nhóm sửa đổi ghi ở khối máy, chờ owner gật.
- Không sửa `scripts/design-gate.mjs` hay `lib/p-tiers.json`.
