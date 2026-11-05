---
schema_version: 1
feature: Phát hành kit 2.38.0 — khối «Khuôn» trên thẻ hai cổng và S1 ghi nhóm đã chọn (KH2), kèm bản vá V0 — bước chấm khuôn hiểu mục ngoai_le không có khoi là tệp rời nhóm; kho chờ nhận onehub-quy-hang và crm
slug: release-2-38-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 5 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + lộ trình kit + bản đồ + khoá executor — KHÔNG dính t3_paths
surfaces: [cli]
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: release-2-38-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `onehub-quy-hang` và `crm`. Bản vá V0 (`ban-do-khuon-roi-nhom`) có gốc ở hồ sơ
đã ký của onehub-quy-hang (`ban-do-khuon-nhom-da-co`), kho ấy đang chờ nó từ lúc chủ kho chọn «Cắt trước» ở 2.37.0; mốc
lộ trình của KH2 ghi kho nhận tính kết quả là onehub-quy-hang (bản đồ tám nhóm) và crm. Mốc lộ trình: «Khuôn trên thẻ
cổng (số đặt lúc cắt)».

**Quyết của chủ kho:** 03/11 «Cắt trước» — 2.37.0 cắt như đang có, bản vá V0 đi ở mốc kế; 03/11 «Mở KH-C2 ngay» — vòng
meta có tên `khoi-khuon-tren-the-cong` (KH2), mốc riêng ngày ước 06/11, «ghép hay tách khi cắt số là việc của lượt cắt»;
05/11 «Cắt KH2 trước» — cắt 2.38.0 TRƯỚC khi đợt `nen-thiet-ke-0411` mở, để hai kho đang chờ KH2 và V0 nhận ngay, và để
KM2 của đợt (đổi bộ đọc glob dùng chung `lib/evidence-core.cjs`) không đi cùng chữ ký này. Lượt cắt ghép V0 và KH2 vào
một mốc.

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ:
`ban-do-khuon-roi-nhom` (#481) · `khoi-khuon-tren-the-cong` (#483). Ngoài vòng: #486 (sửa ca KK-8-do của
`khoi-khuon-tren-the-cong` — tiêm từ vật thay vì neo merge-base — làm nhánh chính xanh lại sau khi #483 gộp; chỉ tệp
ca đo và một làn ghim lại) · #487 (lượt cắt `kham-kho-0411` và gói đợt `nen-thiet-ke-0411`, chỉ `docs/plans/`).

Số là **2.38.0** (minor): bề mặt mới — cờ `--nhom`, `--nhom-moi`, `--gan` của bước nạp (`design-floor-khuon.mjs --nap`),
khoá `chon` trong `khuon-nap.json`, khối «Khuôn» trên thẻ Cổng Phạm vi (khoá `khuon_g1` của `--extract`) và các dòng lệch
trên thẻ Cổng Bằng chứng. Kho không khai `design/patterns/` không đi qua đường nào mới. Chủ kho veto số ở Cổng Bằng
chứng. Năm dòng số, dự báo, điều kiện tin cậy, dòng hiệu chuẩn và ghi chú nhận nằm ở mục `2.38.0` của `CHANGELOG.md` —
một nguồn, hồ sơ không chép lại.

Source input: `git log v2.37.0..HEAD --first-parent` · nếp phát hành `_acceptance/release-2-37-0/` · Notes và Known
limits của hai hồ sơ · GUIDE §5.2 · `skills/acceptance/references/ban-do-khuon-template.md`.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ sáu manifest và đòi `acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map`, `tri-thuc` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ các số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows), Then mọi lệnh XANH và `product-map --check` khớp (PRODUCT-MAP.md và LO-TRINH.html vẽ lại sau khi sửa lộ trình kit).
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh 39fa45cc …`, mốc = commit gắn thẻ `v2.37.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `39fa45cc` (thẻ `v2.37.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`.
- AC-7: Given mốc `39fa45cc`, When liệt tệp đổi dưới `dieu-phoi/`, `road-map/` và `tri-thuc/` tới HEAD bằng git, Then tập tệp đổi BẰNG đúng ba manifest — ba gói chỉ đổi số, như CHANGELOG mục `2.38.0` kể.
- AC-8: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `2.38.0` trong CHANGELOG và mốc `39fa45cc`, When rút danh sách chép, rút danh sách ghi chú kể, rồi so tệp nào đổi byte tới HEAD, Then tập tệp đổi BẰNG tập ghi chú kể — ở mốc này cả hai RỖNG và gạch nói «không chép gì» (tệp lệnh `_acceptance/release-2-38-0/lop-chep-doi.sh`, bản của release-2-29-0 nhận tập rỗng khi gạch nói đúng chữ ấy).
- AC-9: Given mục `2.38.0` của `CHANGELOG.md` cùng nguồn nó chép, When đọc từng mục con, Then (o) mỗi câu mô tả vòng (dòng «Gốc:», gạch «Vật:», giới hạn trích) là chữ của hợp đồng, `opportunity.md` hay `design.md` của hồ sơ ấy, không nói rộng hơn, và số giới hạn đã khai khớp Notes của hợp đồng; (i) lời về cờ `--nhom`, `--nhom-moi`, `--gan`, khoá `chon`, khối «Khuôn» và cờ trên hai thẻ khớp hợp đồng `khoi-khuon-tren-the-cong` và GUIDE §5.2; (ii) lời về mục `ngoai_le` không `khoi` (tệp rời nhóm) và các cách viết giữ nghĩa cũ khớp hợp đồng `ban-do-khuon-roi-nhom`, khuôn tệp `ban-do-khuon-template.md` và GUIDE §5.2; (iii) đoạn «Vì sao 2.38.0» và «Ai bị ảnh hưởng» không giấu đổi hành vi chạm kho đang dùng (tệp đã khai rời nhóm thôi bị chấm theo nhóm ấy và thôi chặn lượt chấm S4; thẻ Cổng Phạm vi của hồ sơ mặt người nhìn thiếu lựa chọn nhóm có cờ mới) và nói đúng lý do cắt trước đợt `nen-thiet-ke-0411`.
- AC-10: Given số trong `.claude-plugin/plugin.json` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc`, Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT 8/8 — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-37-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước CE: ba mươi bốn mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; gói chỉ đổi số → AC-7; lớp chép CI khớp ghi chú → AC-8 (ô «lớp chép đứng yên» là ca mới của cùng ô, đo bằng bản tệp lệnh nhận tập rỗng); ghi chú nhận chép đúng chữ nguồn → AC-9 (judgment); bản cài khớp thẻ → AC-10 (khoá KC1).

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội; ngưỡng của từng vòng sống ở hồ sơ của chúng.

## Out of scope

- Đổi dòng mã cổng — mốc phát hành KHÔNG dựng răng mới (GUIDE §7.1).
- PR #389 (`ui-check-chay-sau-suite`, đã ký Cổng Bằng chứng, chưa gộp) — không vào mốc này.
- Đợt `nen-thiet-ke-0411` (KM1–KM3, DFK1–DFK3) và mọi đổi bộ đọc glob của KM2 — mốc kế, theo «Cắt KH2 trước».
- Ghi chú nhận riêng cho onehub-quy-hang và crm ngoài mục CHANGELOG, báo thẻ cho kho tiêu thụ — việc của phiên điều phối sau khi gắn thẻ.
- Sửa Known limits của hai hồ sơ — vòng sau.
- Cài 2.38.0 vào kho nhận — việc của kho nhận sau mốc.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths`.
- Cùng PR: lộ trình kit `docs/plans/lo-trinh-kit.json` — mốc «Khuôn trên thẻ cổng (số đặt lúc cắt)» ghi số 2.38.0, thêm
  câu lý do «Cắt KH2 trước»; vẽ lại `LO-TRINH.html` và `PRODUCT-MAP.md`. Bốn khoá executor `rel2380_*` trong
  `_acceptance/config.yaml`. `.claude-plugin/marketplace.json` không mang số kit nào nên không đổi.
- Điều kiện tin cậy (i) của dòng 4–5 GIỮ ở cửa sổ này: `git diff --stat v2.37.0 HEAD -- feature-loop/workflows/
  feature-loop/agents/` rỗng.
