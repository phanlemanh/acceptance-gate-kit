---
schema_version: 1
feature: Phát hành kit 2.28.0 — mốc ỔN ĐỊNH, chỉ sửa lỗi — đóng số cho cửa sổ 2.27.0 → 2.28.0 (bước thiết kế không dừng hỏi thừa và công cụ phân loại chạy ở mọi kho · dải tóm tắt hồ sơ đọc đúng · gói dieu-phoi ổn định trước đợt r2 · CI kit cài zsh có trần), để crm cài thẳng 2.28 theo đúng thẻ từ 15/10; làn V, không dựng răng
slug: release-2-28-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 3 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + bước cài zsh của CI kit (T1) + workspace hồ sơ + bản đồ + 3 khoá executor — KHÔNG dính t3_paths, KHÔNG đổi một dòng mã cổng
surfaces: [cli]
status: signed-off
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-12T18:59:49Z
---

# Acceptance Contract: release-2-28-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `crm`. Chủ kho duyệt 12/10 cắt **2.28 ngày 13/10 làm mốc ổn định, chỉ sửa
lỗi** (ưu tiên số 1 = tầng kit); kế hoạch ở lộ trình kit (#328, mốc 2026-10-13). Neo ở kho tiêu thụ: crm issue
`phanlemanh/crm-onehub#375` — máy Mac Studio, máy duy nhất cài kit vào crm, cài thẳng 2.28 từ 15/10; hàng LT1/LT1b của
crm đọc dải tóm tắt hồ sơ (gốc của X2s: crm `_acceptance/trang-lo-trinh-trong-crm`); đợt `r2` của crm (~16/10) chạy
trên gói `dieu-phoi` (gốc của DP8: crm `_acceptance/chuyen-goi-dieu-phoi/`).

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ (năm):

- Bước thiết kế: `buoc-len-thiet-ke-khong-hoi` (A2, T3, #320) · `can-cu-s1-chay-moi-kho` (A2s, T2, #331).
- Dải tóm tắt hồ sơ: `dai-tom-tat-doc-dung` (X2s, T2, #324 — vào main qua #325) · `dai-tom-tat-dem-dung-vi-sao-tron`
  (X2s2, T2, #325).
- Gói `dieu-phoi`: `dieu-phoi-on-dinh-r2` (DP8, T2, #332 — của máy M5; vào main trước giờ chốt nên vào mốc này, không
  cần bản vá 2.28.1).

Ngoài hồ sơ: CI của kit cài zsh cho job tests (`66f3501f`, đi cùng #320), và PR mốc thêm trần 5 phút + cài không hỏi
cho bước ấy (phiên điều phối 13/10: M5 đo một lượt CI của #332 treo ~1 g 47′ ở bước này). `gate.yml` thuộc T1.

Số là **2.28.0, không 2.27.1**: dù chỉ sửa lỗi, mốc thêm bề mặt mới cho kho tiêu thụ — khoá máy đọc `can_cu` trên dòng
sổ bước thiết kế và bộ xếp `scripts/can-cu-s1.cjs` (ADR 0022), khoá tuỳ chọn `production.nhanh` (CỘNG chủ kho phê ở
Cổng Phạm vi của X2s), khoá tuỳ chọn `dieu_phoi.lich_su` và lệnh `ghi-danh` của gói `dieu-phoi`. Mốc **không đổi một
dòng mã cổng** — chỉ đóng số, nói người dùng nhận gì (mục `v2.28.0` trong mô tả ba gói, mục `2.28.0` của
`CHANGELOG.md`), và đi **làn V**. Năm dòng số, bảng dự báo, điều kiện tin cậy, dòng hiệu chuẩn và ghi chú nhận mốc cho
crm nằm ở mục `2.28.0` của `CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

KHÔNG vào mốc: BB1 `bat-bien-san-pham` (#329), câu tín hiệu người gửi (#330), DP6b, S3c — mốc sau.

Source input: `git log v2.27.0..HEAD` · nếp phát hành `_acceptance/release-2-27-0/`, `_acceptance/release-2-26-0/` ·
mục Notes và Known limits của năm hồ sơ · crm#375 (hoà giải ba máy 12/10) · kit #308.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ bốn manifest và đòi `acceptance-gate`, `feature-loop`, `dieu-phoi` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ bốn số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows), Then cả chín lệnh XANH và `product-map --check` khớp (mười khoá của `feature_loop.suite_keys`).
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh a1e2e0b9 …`, mốc = commit gắn tag `v2.27.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `a1e2e0b9` (tag `v2.27.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`. *Nội dung* các vế người-dùng-nhận-gì đọc trực tiếp trong diff.
- AC-7: Given cây đã sửa, When chạy suite của gói `dieu-phoi` (`tests/dieu-phoi/**/*.test.mjs`, cùng lệnh job CI của kit), Then lệnh thoát 0 — gói đổi vật trong mốc (DP8) và lên `2.28.0`.
- AC-8: Given khối INIT-CI-COPY-LIST của `acceptance-init` và mốc `a1e2e0b9`, When rút danh sách tệp lớp chép CI rồi so tệp nào đổi byte tới HEAD, Then tập tệp đổi BẰNG đúng tập mục `2.28.0` của CHANGELOG bảo kho chép lại — `{scripts/ho-so-tom-tat.cjs}`; chiều đỏ trong chính lệnh: mốc `200ce7bb` (v2.26.0) thì lệnh in tên mười một tệp thừa, thoát 1; rút được ít hơn 20 tệp thì thoát 2.
- AC-9: Given mục `2.28.0` của `CHANGELOG.md` cùng vật nó mô tả (`scripts/ho-so-tom-tat.cjs`, `skills/acceptance/references/lo-trinh-du-lieu.md`, `dieu-phoi/README.md`), When đọc ghi chú nhận cho crm, Then (i) hành vi khoá `production.nhanh` CHANGELOG nêu (vắng → câu cũ, máy không suy «đã triển khai»; khai → ba kết cục; dòng quan sát người ghi luôn thắng) khớp mã; (ii) ghi chú bảo cài theo ĐÚNG thẻ `v2.28.0`, nêu bản cài «2.27.0» ở M5 là mã `main` không phải thẻ, và bản chép `docDuLieu` lấy từ thẻ; (iii) cách khai `dieu_phoi.lich_su` và lệnh `ghi-danh` khớp README gói; (iv) ba hồ sơ cũ hoá vì MÔI TRƯỜNG được gọi tên kèm lý do, không bị trình là lỗi của mốc.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-27-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI) `[thước CE: hai mươi hai mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; gói `dieu-phoi` đổi vật → AC-7 (suite của gói, lệnh đã có ở CI); lời «chép lại MỘT tệp» → AC-8 (lệnh git, chiều đỏ trong lệnh); ghi chú nhận cho crm khớp vật → AC-9 (judgment, đọc vật và chữ cạnh nhau); không răng mới.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội, không có ngưỡng nghiệm thu; người dùng nhận engine theo mốc (cùng căn cứ với release-2-3-0 → 2-27-0). Ngưỡng của các vòng đọc ở vòng crm đầu tiên sau khi Mac Studio cài 2.28.0 (liệt kê ở bước 7 mục crm của CHANGELOG 2.28.0).

## Out of scope

- Đổi bất kỳ dòng mã cổng nào (`skills/ lib/ hooks/ scripts/ feature-loop/skills/ feature-loop/workflows/ dieu-phoi/scripts/ dieu-phoi/hooks/`) — mốc phát hành KHÔNG dựng răng (GUIDE §7.1). Bước cài zsh của CI kit (T1) là ngoại lệ có tên, phiên điều phối giao.
- Đưa dòng P200 vào bằng chứng của lượt chấm — cùng căn cứ release-2-26-0: AC-1/AC-2/AC-6 chấm MÃ THOÁT của vùng 3, P200 tự mang chiều đỏ.
- Sửa lộ trình kit `docs/plans/lo-trinh-kit.json` (mốc 2026-10-13 thành «2.28.0 đã phát hành») — PR riêng sau khi mốc gộp và có tag.
- Cài 2.28.0 vào crm (gỡ, cài theo thẻ, chép lớp CI, khai `production.nhanh`, chép `docDuLieu`, đo trước→sau) — việc của máy Mac Studio từ 15/10; phiên kit không cài vào kho tiêu thụ.
- Sửa Known limits của năm vòng; vòng meta «kiểm bản cài sau phát hành» chủ kho gọi tên 12/10 — mở sau mốc.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths` (vật T3 của cửa sổ — A2 — đã qua vòng T3 của chính nó, #320).
- Luật (b): mốc này là mốc KHO NHẬN kế tiếp — crm cài 2.28 từ 15/10 (chưa cài 2.27.0); vòng meta của cửa sổ: 0.
- Chiều đỏ của ba phép đo cửa sổ đo khi mở hồ sơ (13/10): `rel-cua-so.sh a1e2e0b9 x` thoát 1; lệnh giữ-số của
  `diagram-design` với mốc `1b98fdb1` thoát 1; `lop-chep-doi.sh 200ce7bb scripts/ho-so-tom-tat.cjs` thoát 1 gọi tên
  mười một tệp thừa, và với một tệp không đổi (`lib/evidence-core.cjs`) kể thêm thì «mốc kể tệp KHÔNG đổi», thoát 1.
- CI main đỏ ở lần gộp A2s (`08d041a6`) chỉ vì ca trang lộ trình không mở được Chrome trên runner — xanh lại ở
  `057000da`; chập chờn của runner, không phải vật của cửa sổ.
- Known limits — chọn ở Cổng Bằng chứng 2026-10-13:
  - Ngoài-1: Ghi chú nhận mốc nói kho tiêu thụ chỉ cần chép lại một tệp, nhưng phép kiểm lời ấy so với danh sách gõ tay lúc soạn hồ sơ chứ không đọc lại ghi chú — sửa ghi chú mà quên sửa danh sách thì phép kiểm vẫn báo đạt.
