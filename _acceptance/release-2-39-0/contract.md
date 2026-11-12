---
schema_version: 1
feature: Phát hành kit 2.39.0 — mốc «Nhẹ đi», chỉ bớt: mô tả plugin rút còn hai câu, gỡ hai tệp thừa, bỏ qua .env; mang sáu hồ sơ được ký sau 2.38.1; kho chờ nhận onehub-quy-hang
slug: release-2-39-0
owner: phanlemanh@gmail.com
risk_tier: T2               # vật chạm: 5 manifest + dòng khớp-phiên-bản của GUIDE + CHANGELOG + .gitignore + gỡ 2 tệp + 3 ca kiểm ghim chữ mô tả + workspace hồ sơ + bản đồ + khoá executor — KHÔNG dính t3_paths
surfaces: [cli]
status: draft
---

# Acceptance Contract: release-2-39-0

## Context

**Kho chờ nhận — đo được trước khi cắt:** `onehub-quy-hang` (Quỹ hàng). Mốc này chặn đợt chuyển nhà sang kho kế nhiệm
`delivery-loop`: vòng B1 của đợt chỉ mở khi mốc 2.39 đã được một kho tiêu thụ cài (kế hoạch chuyển nhà, mục 12, dãy A).
Mốc chỉ tính là «được kho nhận» khi có một commit ở Quỹ hàng cài đúng thẻ `v2.39.0`.

**Quyết của chủ kho:** 11/11 chốt mốc 2.39 «Nhẹ đi» làn V ở mục 12 kế hoạch chuyển nhà — «mô tả plugin còn một hai câu,
xoá 2 tệp thừa, thêm `.env` vào danh sách bỏ qua»; 12/11 «Nhận và mở 2.39 với phiên độc lập và trỏ trực tiếp vào repo
Acceptance Gate Kit», chấp nhận Quỹ hàng làm kho nhận.

**Ba việc chỉ-bớt của mốc** — lộ ra khi bộ kiểm tệp khai plugin của `repo-setup` 0.5.0 chạy thử trên kit (đo 12/11 trên
`909dffd8`): mô tả của `.claude-plugin/plugin.json` dài 84 582 ký tự, của `feature-loop/.claude-plugin/plugin.json` dài
34 579, trần là 1 024; `scripts/rel-cua-so.sh` và `lib/eval-yaml.js` không mã sản phẩm nào gọi; `.gitignore` không bỏ
qua `.env`. Hai lỗi bố cục khác khuôn ấy báo (sáu plugin lệch phiên bản, plugin lõi lấy cả kho làm nguồn) là việc của
kịch bản chuyển nhà, không thuộc mốc này.

- *Mô tả:* sử từng bản trong mô tả (1.x → 2.38.1) chép NGUYÊN VĂN vào `docs/reference/su-mo-ta-plugin-toi-2-38-1.md` (CHANGELOG.md trỏ về,
  không chép vào CHANGELOG vì ca PD7b quét mọi tệp `.md` ở gốc kho và chữ cũ mang lệnh cài plugin đời cũ) trước khi rút, vì 39 mục phiên bản của mô tả `acceptance-gate` và 34 của `feature-loop` không có mục
  CHANGELOG nào (CHANGELOG bắt đầu từ 2.13.0). Ba ca kiểm ghim chữ lịch sử của mô tả (P88 vế mô tả, P133 vế ba, PH8)
  gỡ cùng lượt, khai ở `tests/plugins/asserts-da-go.txt`; P200 giữ nguyên.
- *Hai tệp:* `lib/eval-yaml.js` là shim trỏ sang `lib/eval-yaml.cjs` cho bản feature-loop trước 07/09 — không mã nào
  trên cây gọi nó. `scripts/rel-cua-so.sh` là công cụ đối chiếu tập hồ sơ lúc cắt mốc (AC-4 của mọi hồ sơ mốc từ
  2.17.0); nó DỜI vào hồ sơ này thành `_acceptance/release-2-39-0/cua-so.sh` (nếp của `lop-chep-doi.sh`), ba mươi khoá
  `rel*_cua_so` cũ trong `_acceptance/config.yaml` trỏ sang đường mới.

**Cửa sổ này có gì** — suy từ kho bằng quan hệ (AC-4), không chép tay. Hồ sơ **được ký** trong cửa sổ
`v2.38.1..909dffd8`: `do-tuong-phan-lab-oklab` (#489) · `lenh-cho-khoa-nhay-duong-dan` (#492) · `doc-jsx-va-ban-do-hong`
(#493) · `t3-arm-chu-ky-khong-im` (#495) · `tier-b-doc-khong-do-duoc` (#498) · `luot-kiem-nhe` (#499). Không PR nào khác
gộp vào nhánh chính sau thẻ `v2.38.1`.

Số là **2.39.0** — số chủ kho gọi tên cho mốc ở kế hoạch chuyển nhà. Chủ kho veto số ở bất kỳ lúc nào trước khi gắn thẻ.
Năm dòng số, dự báo, điều kiện tin cậy, dòng hiệu chuẩn và ghi chú nhận nằm ở mục `2.39.0` của `CHANGELOG.md` — một
nguồn, hồ sơ không chép lại.

Source input: `git log v2.38.1..HEAD --first-parent` · nếp phát hành `_acceptance/release-2-38-1/` · Notes của sáu hồ sơ ·
mục 12 kế hoạch chuyển nhà (`delivery-loop`, nhánh `chuyen-nha`, `migration/KE-HOACH.md`, chỉ đọc).

## Criteria

- AC-1: Given cây đã sửa, When chạy vùng 3 của suite plugins (nơi ca vĩnh viễn P200 sống), Then lệnh thoát 0 — P200 đọc số từ sáu manifest và đòi `acceptance-gate`, `feature-loop`, `dieu-phoi`, `road-map`, `tri-thuc` mang CÙNG một số hợp semver, `diagram-design` hợp semver; P200 đỏ thì vùng 3 thoát khác 0.
- AC-2: Given cây đã sửa, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 dựng câu «Khớp phiên bản» của GUIDE từ các số đọc trong manifest rồi so (một nguồn — so với manifest, không so hằng).
- AC-3: Given cây đã sửa, When chạy mọi lệnh suite của lượt chấm (bốn mảnh scripts, hooks, ba vùng plugins, workflows), Then mọi lệnh XANH — kể cả chốt bánh cóc E11 của P161 với ba assert đã gỡ được khai — và `product-map --check` khớp (PRODUCT-MAP.md và LO-TRINH.html vẽ lại sau khi đổi trạng thái hồ sơ).
- AC-4: Given tập hồ sơ ĐƯỢC KÝ trong cửa sổ suy từ kho (`_acceptance/release-2-39-0/cua-so.sh 88d31b63 …`, mốc = commit gắn thẻ `v2.38.1`), When so với danh sách «được ký» kể trong Context, Then hai tập BẰNG NHAU.
- AC-5: Given mốc `88d31b63` (thẻ `v2.38.1`), When so thư mục `diagram-design/` và số của nó với HEAD bằng git, Then thư mục KHÔNG có dòng đổi VÀ số bằng số ở mốc — `diagram-design` giữ `2.7.1` là đúng.
- AC-6: Given mô tả hai plugin, When chạy vùng 3 của suite plugins, Then lệnh thoát 0 — P200 đòi mô tả `acceptance-gate` CÓ mục của đúng số đang phát hành và mục đó của `feature-loop` TỰ khai cặp `acceptance-gate >= <số>`.
- AC-7: Given mốc `88d31b63`, When liệt tệp đổi dưới `road-map/` và `tri-thuc/` tới HEAD và đọc từng dòng đổi bằng git, Then tập tệp đổi BẰNG đúng hai manifest VÀ mọi dòng đổi là dòng `"version"` — hai gói chỉ đổi số, như CHANGELOG mục `2.39.0` kể.
- AC-8: Given khối INIT-CI-COPY-LIST của `acceptance-init`, gạch «Lớp chép CI» của mục `2.39.0` trong CHANGELOG và mốc `88d31b63`, When rút danh sách chép, rút danh sách ghi chú kể, rồi so tệp nào đổi byte tới HEAD, Then tập tệp đổi BẰNG tập ghi chú kể (tệp lệnh `_acceptance/release-2-38-0/lop-chep-doi.sh`).
- AC-9: Given mục `2.39.0` của `CHANGELOG.md` cùng nguồn nó chép, When đọc từng phần, Then (i) mỗi câu mô tả vòng (dòng «Gốc:», gạch «Vật:», giới hạn trích) là chữ của hợp đồng, `opportunity.md` hay `design.md` của hồ sơ ấy, không nói rộng hơn, và số giới hạn đã khai khớp Notes của hợp đồng; (ii) lời về ba việc chỉ-bớt khớp Context của hợp đồng này; (iii) đoạn «Vì sao 2.39.0» và «Ai bị ảnh hưởng» không giấu đổi hành vi chạm kho đang dùng — kể cả việc gỡ `lib/eval-yaml.js` và `scripts/rel-cua-so.sh`, và mô tả plugin thôi mang sử. (judgment)
- AC-10: Given số trong `.claude-plugin/plugin.json` ở HEAD khác gốc vòng, When chạy khoá `kiem_ban_cai_moc`, Then lệnh chạy TRỌN kiểm bản cài trên HEAD và thoát 0 với «TỔNG KẾT: ĐẠT 8/8 — HEAD (<sha>) cài đúng tag»; đỏ thì KHÔNG cắt mốc.
- AC-11: Given HEAD, When chạy `_acceptance/release-2-39-0/ba-viec-tru.sh`, Then lệnh thoát 0 — mô tả của sáu tệp khai plugin ≤ 1 024 ký tự, `scripts/rel-cua-so.sh` và `lib/eval-yaml.js` không còn và không chỗ nhắc sống nào (ngoài sử: CHANGELOG, `docs/`, hồ sơ; dòng chú thích của `config.yaml`) trỏ tới chúng, `.gitignore` có dòng `.env`; cùng lệnh trên `v2.38.1` thoát 1 và nêu đủ ba việc.
- AC-12: Given tệp `docs/reference/su-mo-ta-plugin-toi-2-38-1.md` mà đầu `CHANGELOG.md` trỏ về, When ghép lại các đoạn của từng plugin bằng một dấu cách và so với mô tả ở thẻ `v2.38.1` (`_acceptance/release-2-39-0/su-mo-ta.mjs`), Then hai bên BẰNG ĐÚNG cho cả hai plugin; cùng lệnh với `v2.38.0` thoát 1 và nêu cả hai plugin.

## Coverage

- Quét theo hai trục của nếp release-2-1-0→2-38-1, không quét lại: Trục A · vật của một lần cắt số (manifest | dòng khớp-phiên-bản | mô tả người-dùng-nhận-gì | phạm vi diff | gói đổi/không đổi | lớp chép CI | bản cài khớp thẻ) `[thước CE: ba mươi sáu mốc trước đã dùng thật]` · Trục B · hành trình hồ sơ (bằng chứng | biên merge) `[thước CE: xanh_sach_check + ADR 0012]`. Ô Core → AC-1 · AC-2 · AC-3 · AC-4 · AC-5 · AC-6; gói chỉ đổi số → AC-7; lớp chép CI khớp ghi chú → AC-8; ghi chú nhận chép đúng chữ nguồn → AC-9 (judgment); bản cài khớp thẻ → AC-10 (khoá KC1). Trục C · việc chỉ-bớt của chính mốc (đã làm | không mất gì) → AC-11 · AC-12 — ô mới của mốc này, đo bằng hai tệp lệnh của hồ sơ, mỗi tệp có chiều đỏ trên một thẻ cũ.

## Đường đo

- bỏ đường-đo — mốc phát hành không có hồ sơ cơ hội; ngưỡng của từng vòng sống ở hồ sơ của chúng.

## Out of scope

- Đổi dòng mã cổng — mốc phát hành KHÔNG dựng răng mới (GUIDE §7.1).
- Hai lỗi bố cục khuôn `repo-setup` báo (sáu plugin lệch phiên bản; plugin lõi lấy cả kho làm nguồn, nên bản cài mang cả `_acceptance/`, `docs/`, `tests/`) — việc của kịch bản chuyển nhà (vòng B1, kho `delivery-loop`).
- Sửa sử cũ: các mục CHANGELOG 2.17.0 → 2.38.1 nhắc `scripts/rel-cua-so.sh` và các tài liệu dưới `docs/` nhắc hai tệp đã gỡ giữ nguyên — đó là sử đúng lúc viết.
- Ghi chú nhận riêng ngoài mục CHANGELOG và báo thẻ cho kho tiêu thụ — việc của phiên điều phối sau khi gắn thẻ.
- Cài 2.39.0 vào Quỹ hàng — việc của kho nhận sau mốc, cổng người (chủ kho nói mới đẩy).

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Hạng T2: không tệp nào của PR mốc khớp `t3_paths`.
- Cùng PR: năm khoá executor `rel2390_*` trong `_acceptance/config.yaml`, ba mươi khoá `rel*_cua_so` cũ đổi đường sang
  `_acceptance/release-2-39-0/cua-so.sh`; vẽ lại `LO-TRINH.html` và `PRODUCT-MAP.md`. `.claude-plugin/marketplace.json`
  không mang số kit nào nên không đổi.
- Điều kiện tin cậy (i) của dòng 4–5 GIỮ ở cửa sổ này: `git diff --stat v2.38.1 HEAD -- feature-loop/workflows/
  feature-loop/agents/` rỗng.
