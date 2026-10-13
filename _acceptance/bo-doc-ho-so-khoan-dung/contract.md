---
schema_version: 1
feature: Kit đọc hồ sơ thật của kho tiêu thụ không im lặng sai — evals.yaml không phải YAML chuẩn lên cờ vàng có tên (thẻ hai cổng + một lệnh kiểm kho tự bật trong CI), và chữ ký ghi ngày kiểu ngày/tháng/năm được bốn mặt đọc ra ngày qua một bộ đọc chung
slug: bo-doc-ho-so-khoan-dung
owner: phanlemanh@gmail.com
risk_tier: T2               # scripts/yaml-chuan.cjs (mới) + gate-card.js + ho-so-tom-tat.cjs + tin-hieu.mjs + cat-luot.mjs + start-scan.mjs + test + tài liệu + lộ trình — không chạm lib/**, hooks/**, scripts/pre-merge-check.sh, scripts/recheck-evidence.cjs, dieu-phoi/**
surfaces: [cli]
design_doc: docs/superpowers/specs/2026-10-13-bo-doc-ho-so-khoan-dung-design.md
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-10-13T13:13:04Z
---

# Acceptance Contract: bo-doc-ho-so-khoan-dung

## Context

Hai gốc ngoài: crm-onehub#375 (13/10, Mac Studio — `evals.yaml` sai cú pháp chuẩn lọt mọi lưới của kit) và hạt giống
`docs/plans/2026-10-13-hat-giong-ngay-ky-dang-ngay-thang-nam.md` (chữ ký «10/09/2026» làm câu cho người gửi mất ngày).
Số đo 13/10: 9/662 `evals.yaml` của bảy kho PyYAML không đọc được, sáu lớp; 1 chữ ký ngày/tháng/năm (crm
`nen-chat-ai-elements`) mà bốn bộ đọc ngày ký bỏ im lặng. Vòng đứng ở bậc «bộ đọc khoan dung + cờ vàng» và «bật thêm
theo lựa chọn» của luật 26/09; KHÔNG đổi mặc định của lưới trước-gộp. Bảng lớp, mặt hiện, luật ngày: design §2–§5.

## Criteria

- AC-1: Given ma trận viết trước sáu lớp YAML không chuẩn (design §4) × hai bản của CÙNG một `evals.yaml` do mã sinh — bản hỏng mang đúng một chỗ của lớp ấy ở một dòng biết trước, bản lành là chính bản ấy đã sửa chỗ đó theo cách sửa chuẩn — cộng một bộ dạng hợp lệ kit đang gặp (nháy kép/đơn nhiều dòng, `''` trong nháy đơn, `\"` trong nháy kép, khối chữ có chú thích, danh sách luồng có mục nháy chứa `[slug]`, neo `&a`), When gọi `yamlKhongChuan` của cây đang kiểm, Then mỗi bản hỏng cho ĐÚNG một mục với `loai` = mã lớp và `dong` = dòng biết trước, mỗi bản lành và mọi dạng hợp lệ cho 0 mục; số ô so = số phần tử ma trận (khác → ĐỎ ghim «ma trận hụt»).
- AC-2: Given bảy kho (kit, crm, oneflow, artifact-platform, radar, media-library, map) đọc ở sha ghim bằng `git show` (không đọc cây làm việc), When so từng `_acceptance/*/evals.yaml` giữa bộ dò và PyYAML, Then với MỌI tệp «bộ dò có mục» ⇔ «PyYAML từ chối», và với mỗi tệp bị từ chối bộ dò có một mục ở ĐÚNG dòng lỗi đầu PyYAML báo (dung sai 0), in sha + số tệp + tên từng hồ sơ bị từ chối của từng kho, tổng tệp từ chối ≥ 1 (bằng 0 → ĐỎ «vi phân rỗng»); và 19 ô ma trận của AC-1 (rút từ CHÍNH hàm sinh của ca) được PyYAML đọc đúng chiều — bản hỏng bị từ chối, bản lành và dạng hợp lệ được nhận (lệch → ĐỎ ghim tên ô); và `parseEvals` + `evalListsOf` của cây đang kiểm cho kết quả BẰNG bản base `3c88d138` trên mọi tệp (vòng không đổi cách kit đọc). Chiều đỏ trên CÙNG bộ tệp: sáu bản sao bộ dò, mỗi bản bỏ một lớp → phép so ở mức (tệp, dòng lỗi đầu) ĐỎ ghim «vi phân lệch: <kho>/<hồ sơ>»; bản sao không đổi kết quả nào → ĐỎ «đột biến tương đương: <lớp>»; bản sao dời `dong` +3 → ĐỎ ghim «vi phân dòng». Thiếu kho hoặc thiếu PyYAML → thoát 2 «không đọc được ở đây: <tên>».
- AC-3: Given kho thử do mã sinh có một hồ sơ mà `evals.yaml` mang hai chỗ không chuẩn (hai lớp khác nhau), When dựng thẻ Cổng Phạm vi và thẻ Cổng Bằng chứng của hồ sơ ấy, Then mỗi thẻ có ĐÚNG một cờ vàng bắt đầu «evals.yaml không phải YAML chuẩn» nêu cả hai chỗ bằng số dòng + chữ lớp tiếng sản phẩm (không mã lớp); cùng hồ sơ với `evals.yaml` đã sửa → không có cờ ấy, các cờ khác của thẻ không đổi; chiều đỏ: `gate-card.js` của bản base `3c88d138` trên bản hỏng → không có cờ (ca ghim «base không cờ»); bản sao thẻ không nạp được bộ dò → thẻ vẫn dựng, mang cờ «không kiểm được YAML chuẩn».
- AC-4: Given kho git thử do mã sinh có hồ sơ A (`evals.yaml` không chuẩn, có từ commit gốc) và hồ sơ B (lành), When chạy `node scripts/yaml-chuan.cjs --root <kho>`, Then in đúng một dòng `A/evals.yaml:<dòng> — <chữ lớp>` cho mỗi chỗ và thoát 1; chỉ còn hồ sơ lành → thoát 0, không in dòng chỗ nào; `--base <ref>` so từ ĐIỂM RẼ (merge-base của ref và HEAD): diff chỉ chạm hồ sơ B → thoát 0 (hồ sơ cũ không chặn); diff chạm A → thoát 1; nhánh rẽ chỉ chạm B trong khi ref đi trước có commit chạm A → thoát 0, và bản sao lệnh đổi sang so hai chấm ĐỎ trên CÙNG kho (ghim «hồ sơ ngoài nhánh chặn: A»); `--root` không phải kho git hoặc ref không có → thoát 2 với thông điệp nêu nguyên nhân.
- AC-5: Given ma trận viết trước dạng chữ ký {năm-tháng-ngày · năm-tháng-ngày kèm giờ · năm-tháng-ngày đứng sau một ngày/tháng/năm trong cùng chuỗi · `d/m/yyyy` · `dd/mm/yyyy` · ngày vô lý `32/13/2026` · ngày không có trên lịch `31/02/2026` · ngày/tháng không năm `13/10` · không ngày · rỗng}, When gọi `ngayChuKy`, Then mỗi dạng ra đúng giá trị bảng viết sẵn trong ca (năm-tháng-ngày thắng bất kể vị trí; ngày/tháng/năm hợp lệ ra năm-tháng-ngày; còn lại null); số ô so = số phần tử ma trận.
- AC-6: Given kho thử do mã sinh có một hồ sơ đã ký với `human_signoff: Tên 10/09/2026 — ghi chú` (khai lộ trình + cửa tín hiệu đủ để bốn mặt chạm hồ sơ), When chạy bốn mặt của cây đang kiểm, Then câu cho người gửi chứa «ngày 10/9/2026» và `--cau` không đỏ vì ngày; ngày xong của bảng điều khiển mở phiên = `2026-09-10`; ngày ký của dải tóm tắt = `2026-09-10`; nhịp của bản cắt lượt đếm hồ sơ ấy (không vào «bỏ qua»); chiều đỏ: bốn mặt của bản base `3c88d138` trên CÙNG kho bỏ ngày ở cả bốn — ca ghim «base mất ngày: <mặt>» cho từng mặt; chiều giữ: chữ ký không ngày nào → `--cau` vẫn đỏ «chữ ký không đọc được ngày».
- AC-7: Given bảy kho ở sha ghim của AC-2, When chạy bốn mặt qua lối vào công khai của chúng — `ngayKy(root, slug)` của tin-hieu, `tomTatHoSo` của dải tóm tắt, đầu ra JSON của bảng điều khiển mở phiên, `nhip(root)` của bản cắt lượt — bằng bản base `3c88d138` và cây đang kiểm trên bản xuất `_acceptance/` của từng kho, Then 0 khác biệt ngoài các hồ sơ có chữ ký mang ngày/tháng/năm mà không mang năm-tháng-ngày; `crm/nen-chat-ai-elements` có mặt trong danh sách đọc thêm của TỪNG mặt (ba mặt ra `2026-09-10`, nhịp T2 của crm thêm đúng một mẫu và bớt đúng một «bỏ qua»); in số hồ sơ đã so theo từng kho × mặt, mặt nào tổng bằng 0 → ĐỎ «vi phân rỗng: <mặt>»; chiều đỏ trên CÙNG bộ: bản sao bộ đọc chung bỏ nhánh ngày/tháng/năm → ĐỎ ghim «thiếu đọc thêm: crm/nen-chat-ai-elements»; bản sao đọc ngày/tháng/năm theo lối tháng-trước → ĐỎ ghim «đọc thêm sai ngày: crm/nen-chat-ai-elements».
- AC-8 (judgment): Given `CHANGELOG.md` mục «Chưa phát hành» và `skills/acceptance/references/eval-executors.md` mục «evals.yaml shape», When người viết eval ở một kho tiêu thụ đọc chúng, Then họ biết: thẻ hai cổng nay cắm cờ vàng khi `evals.yaml` không phải YAML chuẩn và kit vẫn đọc theo dòng (không chặn, không đổi phán quyết); sáu lớp và cách sửa từng lớp; muốn chặn trong CI thì thêm lệnh kiểm nào, với `--base` (so từ điểm rẽ) để hồ sơ cũ đã ký không chặn; hồ sơ đã ký không phải sửa; chữ ký ghi ngày/tháng/năm nay được đọc; kho không có sự cố không phải làm gì; và muốn biết hồ sơ nào của kho đang mang cờ thì chạy lệnh kiểm không kèm `--base`.
- AC-9: Given `docs/plans/lo-trinh-kit.json`, When đọc hàng của vòng bằng `node scripts/lo-trinh.mjs --root . --hang R2`, Then có hàng R2 nhóm `doc-khoan-dung`, hạng T2, slug `bo-doc-ho-so-khoan-dung`, `dung_tren` có R1, `vi_sao` bắt đầu «Gốc:» trỏ crm-onehub#375 và hạt giống ngày ký, và mốc «Tinh chỉnh sau hai đợt thử» liệt R2 trong `hang`; bộ ca `lo_trinh` của kit xanh trên tệp đã sửa.

## Coverage

Quét bằng `morphological-scan` (preset test-matrix; đối tượng = một bộ đọc hồ sơ của kit gặp hồ sơ thật). Chân sản
phẩm: chín tệp PyYAML từ chối ở bảy kho `[SUY-TỪ-REPO: ~/dev/<kho>/_acceptance/*/evals.yaml @ sha ghim AC-2]`, bộ đọc
theo dòng `[SUY-TỪ-REPO: lib/eval-yaml.cjs, lib/evidence-core.cjs evalListsOf]`, bốn bộ đọc ngày ký
`[SUY-TỪ-REPO: scripts/tin-hieu.mjs, scripts/start-scan.mjs, scripts/ho-so-tom-tat.cjs, scripts/cat-luot.mjs]`. Chân
ngành: `[NGÀNH: YAML 1.2.2 — vô hướng trần/nháy, bộ thoát nháy kép, thụt khối chữ]` · `[NGÀNH: PyYAML 6 — bộ đọc
chuẩn dùng làm thước]` · `[NGÀNH: ISO 8601 năm-tháng-ngày; quy ước ngày/tháng/năm của Việt Nam]`.

- Trục A — bộ đọc: cú pháp evals.yaml | ngày ký  [thước CE: hai gốc ngoài] → AC-1…4 | AC-5…7
- Trục B — dạng đầu vào: YAML — sáu lớp không chuẩn | dạng hợp lệ kit gặp | tệp lành; ngày — năm-tháng-ngày (± giờ, ± đứng sau) | ngày/tháng/năm (1 hay 2 chữ số) | vô lý | không trên lịch | thiếu năm | không ngày | rỗng  [thước CE: điều tra 7 kho 13/10 — mọi lớp có ca thật] → AC-1, AC-5
- Trục C — mặt: thẻ Cổng Phạm vi | thẻ Cổng Bằng chứng | lệnh kiểm (± `--base`) | câu cho người gửi + `--cau` | bảng điều khiển mở phiên | dải tóm tắt | nhịp cắt lượt  [thước CE: bốn bộ đọc ngày + hai cờ thẻ có sẵn] → AC-3, AC-4, AC-6
- Trục D — hướng: đọc đúng/cờ có tên | chiều im (lành không cờ, kit đọc không đổi, ngày cũ không đổi) | chiều đỏ (base/đột biến)  [thước CE: luật hai chiều của kho] → mọi AC; dữ liệu thật → AC-2, AC-7
- Cross-cutting: không đọc cây làm việc của kho khác (sha ghim) · tiếng Việt trên thẻ · không thêm tệp phải chép sang kho tiêu thụ → AC-2, AC-3, AC-7; tài liệu cho người viết eval → AC-8; lộ trình → AC-9.
- Later: dòng cảnh báo ở bước sinh args lượt chấm · kiểm cú pháp `config.yaml` / frontmatter hợp đồng · đưa bộ dò vào lưới trước-gộp mặc định (T3, ngưỡng design §7) · bộ đọc YAML thật vendor (ngưỡng design §7).
- Never: kit tự sửa `evals.yaml` của kho · sửa hồ sơ đã ký · đọc ngày kiểu Mỹ.

## Out of scope

- Sửa bốn `evals.yaml` của crm (`dieu-phoi-hai-tang`, `no-sau-luot-5-okr`, `zalo-gui-hong-ghi-ly-do`, `danh-sach-keo-chung` — tệp thứ tư ngoài danh sách của #375, đo 13/10) và tệp của các kho khác — vật của kho, kho tự sửa khi cờ hiện.
- Sửa `_acceptance/release-2-0-0/evals.yaml` của kit (hồ sơ đã ký — không kéo vào diff).
- `scripts/pre-merge-check.sh`, `lib/**` (gồm `lib/out-of-contract.cjs`), `hooks/**`: lưới trước-gộp mặc định không đổi.
- Bộ đọc `kiem-chuyen` của gói dieu-phoi (giới hạn DP8 — ánh xạ luồng, danh sách thụt ngang khoá) — vùng M5.
- Vendor một bộ phân tích YAML đầy đủ; ngày kiểu Mỹ `m/d/yyyy`.
- Thêm ca dữ liệu thật vào `_acceptance/cau-tin-hieu-nguoi-gui/rang/do-crm.mjs` (hồ sơ đã ký) — AC-7 phủ crm thay.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ca đo: `tests/scripts/yaml-chuan.test.mjs` (YC-…) và `tests/scripts/ngay-ky.test.mjs` (NK-…) — vào mảnh
  `*.test.mjs` của suite; răng dữ liệu thật `_acceptance/bo-doc-ho-so-khoan-dung/rang/bay-kho.mjs` (cần sáu kho +
  PyYAML, ngoài `feature_loop.suite_keys`). Khoá executor thêm ở S3.
- Gộp: chờ M5 cắt 2.29.1 (kit #308), gộp theo khoá #308; điều phối gộp, vòng không tự gộp.
