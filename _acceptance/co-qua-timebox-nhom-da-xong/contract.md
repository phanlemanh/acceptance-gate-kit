---
schema_version: 1
feature: Cờ qua-timebox cắt ngang cả nhóm «đã xong» — bộ quét gắn cờ cho hồ sơ park/bác, archived và đã có phán quyết giá trị
slug: co-qua-timebox-nhom-da-xong
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [cli]
status: approved
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-06T04:13:42Z
design_doc: docs/superpowers/specs/2026-09-06-co-qua-timebox-nhom-da-xong-design.md
---

# Acceptance Contract: co-qua-timebox-nhom-da-xong

## Context

Ngày 06/09/2026 job `tests` trên `main` đỏ tại RT13: hồ sơ `baseline-127-tin-hieu-phan-biet`
(park từ 30/08, «Timebox: ship trước 2026-09-05») vượt hạn, phép đo quan hệ đòi cờ
`qua-timebox` mà bộ quét không gắn cho nhóm «đã xong». Cờ được tính bằng một vị từ của lib
và thân lệnh start đã dạy in nó ở «Vừa xong», nhưng ba lối đẩy vào nhóm «đã xong» của
`scripts/start-scan.mjs` bỏ quên nó. Người xem thẻ start không thấy ý đã park mà quá hạn
tự khai. Hồ sơ này vá theo quan hệ ở cả ba lối và thêm cặp đối chứng không phụ thuộc ngày.

Source input: docs/superpowers/specs/2026-09-06-co-qua-timebox-nhom-da-xong-design.md

## Criteria

- AC-1: Given một ô cơ hội `decision: park` (hoặc `kill`) có dòng Timebox đã qua, When `start-scan.mjs --root` chạy, Then mục của nó trong nhóm «đã xong» (`xep-lai` hoặc `da-bac`) mang `flags` chứa `qua-timebox`; và Given cùng ô ấy với Timebox chưa tới (hôm nay + 2 ngày), Then `flags` KHÔNG chứa `qua-timebox`.
- AC-2: Given một ô cơ hội `stage: archived` có Timebox đã qua, When bộ quét chạy, Then mục `da-dong-ho-so` của nó mang `qua-timebox`; Timebox chưa tới thì không.
- AC-3: Given một hợp đồng `signed-off` dùng cơ hội, có `uat-session.md` với `verdict: release`, và cơ hội có Timebox đã qua, When bộ quét chạy, Then mục `da-nghiem-thu-release` của nó mang `qua-timebox` (cờ được tính TRƯỚC lối đẩy phán quyết; văn bản cơ hội được đọc RIÊNG cho cờ vì sau phán quyết bộ quét không «tiêu thụ» cơ hội để xếp ô — lỗi đọc file ấy không quyết ô); Timebox chưa tới thì không.
- AC-4: Given cây thật của kho ngày chạy (có `baseline-127-tin-hieu-phan-biet` park quá hạn 05/09), When chạy RT13, Then phần (iii) — đẳng thức hai chiều giữa cờ của bộ quét và `NG.quaTimebox` trên mọi nhóm — không còn dòng lệch nào, và cả suite `tests/plugins/run-tests.sh` xanh.
- AC-5: Given BA bản sao của bộ quét, mỗi bản gỡ `flags` khỏi đúng MỘT lối đẩy (park/bác · archived · phán quyết giá trị), When chạy ma trận fixture của RT13 (iii-b) bằng từng bản sao, Then mỗi bản làm phép kiểm đỏ và nêu đúng slug quá hạn của lối ấy (`pk-qua` · `ar-qua` · `rl-qua`) — cùng fixture với chiều xanh; và phép kiểm khoá NHÓM/ô (`xep-lai` · `da-bac` · `da-dong-ho-so` · `da-nghiem-thu-release`) TRƯỚC khi soi cờ, để fixture rơi nhầm ô không thể xanh nhờ cờ của ô khác.
- AC-6: Given bản cũ của bộ quét tại mốc `cb38ea01` và bản mới, When RT13 (ii) so `stateKey` từng slug trên cây thật, Then không slug nào đổi ô ngoài khối `KHAC-BIET-DOC-CU` đã khai (cờ không đổi ô), và `product-map.mjs --root . --check` xanh với `git status --porcelain PRODUCT-MAP.md` rỗng sau đó (không sinh lại bản đồ).

## Coverage

Bỏ coverage-scan — vòng vá một quan hệ trong một hàm, không gian AC là ma trận đóng {ba lối đẩy vào «đã xong»} × {quá hạn, chưa hạn} = 6 ô, đủ 6 ở AC-1..AC-3 (cả hai chiều mỗi lối); AC-4..AC-6 là hai chiều của phép đo và bất biến ô (entry d-20260906T040500Z-cqt1).

## Đường đo

- bỏ đường-đo — hồ sơ không có ô cơ hội (vòng vá lỗi, đường B) (entry d-20260906T040600Z-cqt2)

## Out of scope

- Không đổi vị từ `quaTimebox` hay khuôn dòng Timebox trong opportunity-template.
- Không thêm cờ mới cho nhóm «đã xong»; `mien-do-co-nguoi-dung` chỉ theo khối tính đã có ở nhánh signed-off.
- Không đổi thân lệnh start hay thẻ: thân lệnh đã dạy in cờ ở «Vừa xong» (RT12 [2]).
- Không sửa hồ sơ `baseline-127` để hết đỏ.
- Không đụng bản đồ sản phẩm (không đọc cờ).

## Notes

- `tests/plugins/ra-co-ten.test.mjs` và `scripts/start-scan.mjs` nằm trong `paths` của E13 hồ sơ ra-co-ten-lam-va-trao: hồ sơ ấy chạy lại ô đo ở lần re-pin sau merge.
- Hệ quả phụ có chủ ý: mục `da-nghiem-thu-*` nay có thể mang `mien-do-co-nguoi-dung` khi điều kiện đúng — cùng khối tính với cổng Giá trị, đúng ý «cờ cắt ngang mọi ô».
- Lỗi này chỉ hiện khi có hồ sơ thật vượt hạn, tức phép đo (iii) là «xanh-không-chạy» cho tới ngày 06/09; (iii-b) sinh ra để nó đỏ được ở mọi ngày.
