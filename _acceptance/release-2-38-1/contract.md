---
schema_version: 1
feature: Phát hành kit 2.38.1 — bản vá cổng trước gộp, code t3_paths phải có hồ sơ thật sự bị cổng chấm; kho chờ nhận onehub-inventory
slug: release-2-38-1
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 5 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + workspace hồ sơ + bản đồ + khoá executor — KHÔNG dính t3_paths
surfaces: [cli]
status: draft
---

# Acceptance Contract: release-2-38-1

## Context

**Kho chờ nhận — đo được trước khi cắt:** `onehub-inventory`. Lỗ hổng lộ ra khi kiểm bản cài 2.38.0 ở kho đó (ma trận 15 ca,
13 ca đúng), và phiên cài kit ở kho đó đang chờ số phiên bản mới để nâng.

**Quyết của chủ kho:** 10/11 «Gộp và phát hành», trả lời câu hỏi có gộp PR #491 và cắt mốc hay không, chỉ áp cho bản vá
này. Ba việc tách riêng từ Cổng Bằng chứng của hồ sơ `t3-can-ho-so-arm` và PR #489 không vào mốc.

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ:
`t3-can-ho-so-arm` (#491). Ngoài vòng: không có PR nào khác gộp vào nhánh chính sau thẻ `v2.38.0`.

Số là **2.38.1** (patch): bản vá không có bề mặt mới — không cờ, không khoá cấu hình, không lệnh mới. Đổi hành vi có thật:
PR đổi tệp `t3_paths` mà không hồ sơ nào được cổng chấm nay bị chặn, khai thẳng ở «Ai bị ảnh hưởng». Chủ kho veto số ở bất
kỳ lúc nào trước khi gắn thẻ. Năm dòng số, dự báo, điều kiện tin cậy, dòng hiệu chuẩn và ghi chú nhận nằm ở mục `2.38.1`
của `CHANGELOG.md` — một nguồn, hồ sơ không chép lại.

Source input: `git log v2.38.0..HEAD --first-parent` · nếp phát hành `_acceptance/release-2-38-0/` · Notes của hồ sơ
`t3-can-ho-so-arm` · GUIDE §7.

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ sáu manifest và đòi `acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map`, `tri-thuc` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ các số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows), Then mọi lệnh XANH và `product-map --check` khớp (PRODUCT-MAP.md và LO-TRINH.html vẽ lại sau khi đổi trạng thái hồ sơ).
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`scripts/rel-cua-so.sh c8fa5a65 …`, mốc = commit gắn thẻ `v2.38.0`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `c8fa5a65` (thẻ `v2.38.0`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`.
- AC-7: Given mốc `c8fa5a65`, When liệt tệp đổi dưới `dieu-phoi/`, `feature-loop/`, `road-map/` và `tri-thuc/` tới HEAD bằng git, Then tập tệp đổi BẰNG đúng bốn manifest — bốn gói chỉ đổi số, như CHANGELOG mục `2.38.1` kể.
- AC-8: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `2.38.1` trong CHANGELOG và mốc `c8fa5a65`, When rút danh sách chép, rút danh sách ghi chú kể, rồi so tệp nào đổi byte tới HEAD, Then tập tệp đổi BẰNG tập ghi chú kể — ở mốc này đúng một tệp `scripts/pre-merge-check.sh` (tệp lệnh `_acceptance/release-2-38-0/lop-chep-doi.sh`).
- AC-9: Given mục `2.38.1` của `CHANGELOG.md` cùng nguồn nó chép, When đọc từng phần, Then (i) mỗi câu mô tả vòng (dòng «Gốc:», gạch «Vật:», giới hạn trích) là chữ của hợp đồng hay `design.md` của hồ sơ `t3-can-ho-so-arm`, không nói rộng hơn, và số giới hạn đã khai khớp Notes của hợp đồng; (ii) lời về các dạng hồ sơ bị chặn, miễn trừ PR cài kit và code ngoài `t3_paths` giữ luật cũ khớp hợp đồng và README; (iii) số PR đo trên các kho khớp `rang/ds-pr.json`; (iv) đoạn «Vì sao 2.38.1» và «Ai bị ảnh hưởng» không giấu đổi hành vi chạm kho đang dùng — PR đổi `t3_paths` không có hồ sơ được chấm nay bị chặn. (judgment)
- AC-10: Given số trong `.claude-plugin/plugin.json` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc`, Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT 8/8 — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-38-0, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước CE: ba mươi lăm mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; gói chỉ đổi số → AC-7; lớp chép CI khớp ghi chú → AC-8; ghi chú nhận chép đúng chữ nguồn → AC-9 (judgment); bản cài khớp thẻ → AC-10 (khoá KC1).

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội; ngưỡng của từng vòng sống ở hồ sơ của chúng.

## Out of scope

- Đổi dòng mã cổng — mốc phát hành KHÔNG dựng răng mới (GUIDE §7.1).
- Ba việc tách riêng từ Cổng Bằng chứng của `t3-can-ho-so-arm` (báo thiếu phần đọc chữ ký, lệnh chờ lượt có dấu cách, công cụ kiểm khuôn) và PR #489 — không vào mốc này.
- Sửa 22 hạn chế đã biết của hồ sơ `t3-can-ho-so-arm` — vòng sau.
- Ghi chú nhận riêng ngoài mục CHANGELOG và báo thẻ cho kho tiêu thụ — việc của phiên điều phối sau khi gắn thẻ.
- Cài 2.38.1 vào kho nhận — việc của kho nhận sau mốc.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths`.
- Sửa kèm: gộp #491 làm nhánh chính đỏ ở ca DV5u (hai dòng `esac` mới trùng một mục miễn trừ cũ). PR mốc gỡ mục
  `        esac` khỏi `ALLOWED_REMOVALS` của `tests/scripts/additive-only.test.mjs`; phép đo chặt hơn, AC-3 chạy lại ca đó.
- Cùng PR: bốn khoá executor `rel2381_*` trong `_acceptance/config.yaml`; vẽ lại `LO-TRINH.html` và `PRODUCT-MAP.md`.
  `.claude-plugin/marketplace.json` không mang số kit nào nên không đổi.
- Điều kiện tin cậy (i) của dòng 4–5 GIỮ ở cửa sổ này: `git diff --stat v2.38.0 HEAD -- feature-loop/workflows/
  feature-loop/agents/` rỗng.
