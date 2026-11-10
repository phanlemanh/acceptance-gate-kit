---
schema_version: 1
feature: Code t3_paths phải có hồ sơ thật sự bị cổng chấm
slug: t3-can-ho-so-arm
owner: phanlemanh@gmail.com
risk_tier: T3      # chạm scripts/pre-merge-check.sh — trong risk_tiers.t3_paths
surfaces: [cli, ci]
status: verified
approved_by: Manh Phan
approved_at: 2026-11-10
design_doc: _acceptance/t3-can-ho-so-arm/design.md
---

# Acceptance Contract: t3-can-ho-so-arm

## Context

Cổng trước gộp cho code trọng yếu đi qua khi PR kèm một hồ sơ mà không luật nào chấm: hợp đồng không frontmatter, hoặc khai
`risk_tier: T1` + `status: verified`. Lộ ra khi kiểm cài kit ở `onehub-inventory` (2.38.0), ma trận 15 ca, 13 ca đúng. Người
hưởng: chủ kho của mọi kho cài kit. Trace nguyên tố 2: `clean` phải đứng trên một lần chấm có thật.

Source input: lời giao của phiên kiểm cài kit `onehub-inventory`, 09/11/2026; owner gọi «Mở hồ sơ T3» sau khi xem bản vá.

## Criteria

- AC-1: Given PR đổi một tệp `t3_paths` và thêm `_acceptance/<slug>/contract.md` không frontmatter, không báo cáo, When `pre-merge-check.sh --base` chạy, Then thoát 1, in dòng `VIOLATION [PR]` với cụm `no record in it is judged by the gate`, nêu tệp T3, và nêu hồ sơ kèm lý do `contract thiếu status, risk_tier`.
- AC-2: Given PR đổi một tệp `t3_paths` và thêm hợp đồng `risk_tier: T1` + `status: verified`, When cổng chạy, Then thoát 1 với cùng thông điệp, nêu tệp T3 và lý do `risk_tier=T1 ngoài signoff.required_for`.
- AC-3: Given PR đổi tệp `t3_paths` mà hồ sơ duy nhất thuộc một trong tám dạng — không có `contract.md` · PR chỉ đổi tệp ngoài thư mục hồ sơ dưới `_acceptance/` · hồ sơ đã có từ trước chỉ đổi `decisions.jsonl` · chỉ đổi `opportunity.md` · hồ sơ T2 `machine-cleared` xanh-sạch không chữ ký · hồ sơ T2 làn V không chữ ký · hồ sơ `da-cham-boi-thuc-te` · hồ sơ đã cho nghỉ — When cổng chạy, Then mỗi dạng thoát 1 với cùng thông điệp và đúng lý do của dạng đó, và bản sao gỡ riêng nhánh lý do đó cho thấy fixture ấy không còn bị chặn vì lý do đó.
- AC-4: Given PR đổi tệp `t3_paths` kèm hồ sơ — T3 PASS có chữ ký · T2 PASS có chữ ký · hạt giống `T1/draft` đi cạnh một hồ sơ T3 PASS có chữ ký · T3 `implemented` verdict REJECT · T3 `draft` · T3 `approved` — When cổng chạy, Then ba dạng đầu thoát 0 và in `pre-merge-check: clean`; dạng thứ tư thoát 1 do `verdict=REJECT`; hai dạng cuối thoát 1 do `status chưa arm cổng`; và ba dạng sau đều không có dòng `VIOLATION [PR]`.
- AC-5: Given PR chỉ đổi code ngoài `t3_paths` kèm hợp đồng không frontmatter, hoặc kèm `T1/draft`, hoặc PR chỉ đổi tài liệu kèm `T1/draft`, When cổng chạy, Then thoát 0, in `pre-merge-check: clean`, và không có thông điệp của luật mới.
- AC-6: Given PR cài kit mà đỉnh nhánh đích chưa có `_acceptance/config.yaml`, đổi tệp `t3_paths` và thêm `_acceptance/config.yaml`, When cổng chạy, Then thoát 0 và in `pre-merge-check: clean`, bản sao gỡ miễn trừ cho thoát 1 với thông điệp của luật; và Given nhánh cắt trước lần cài, tự thêm config, trong khi đỉnh nhánh đích đã có config, Then thoát 1 với thông điệp của luật.
- AC-7: Given PR đổi tệp `t3_paths` kèm hợp đồng T1 chạy với `--no-t1-escape`, và PR đổi tệp `t3_paths` không có gì dưới `_acceptance/`, When cổng chạy, Then ca đầu thoát 0 với `T1-ESCAPE: NOT ENFORCED` và không có thông điệp luật mới; ca sau thoát 1 với thông điệp cũ `carries NO _acceptance/<slug>/ artifacts`, không có thông điệp luật mới.
- AC-8: Given danh sách PR đã chốt trước trong `rang/ds-pr.json` (kho, sha, nhóm, kết quả mong đợi) và các kho tiêu thụ trên máy, When chạy bản `v2.38.0` và bản vá trên từng PR đọc được, Then mỗi PR cho đúng kết quả đã chốt (bị chặn thêm hoặc không); số PR đọc được của mỗi nhóm đạt sàn khai trong tệp (code thường ≥ 20 · dưới T3 có chữ ký ≥ 10 · cài kit ≥ 2 · T3 không hồ sơ được chấm ≥ 5); thiếu sàn hoặc đọc được dưới 5 kho thì thoát 2, không xanh giả.
- AC-9: Given bản `v2.38.0` dựng trọn thư mục trong lượt, When chạy mọi ca `-do` của tệp test mới trên bản đó, Then mỗi ca đều đỏ vì `pre-merge-check: clean` (chiều đỏ có thật); và ca GPM13 của `tests/scripts/run-tests.sh` vẫn còn đủ hai phép kiểm `check GPM13 0` và `nothas GPM13a`.

## Coverage

- Trục A — loại code PR đổi: `t3_paths` | code thường | chỉ tài liệu [thước CE: ba nhánh của khối T1-escape].
- Trục B — hồ sơ trong PR: không contract | thiếu trường | hạng ngoài `required_for` | đã khép (đã nghỉ, đã chấm bởi thực tế) | chỉ tệp chữ (`decisions.jsonl`, `opportunity.md`) | dưới T3 không chữ ký (máy-thông, làn V) | nháp hoặc đã duyệt đúng hạng | được chấm | không hồ sơ.
- Trục C — số hồ sơ trong PR: một | hạt giống kèm hồ sơ thật.
- Trục D — bối cảnh chạy: PR thường | PR cài kit | `--no-t1-escape`.
- Ô Core: A1×B-không-tính (AC-1, AC-2, AC-3) · A1×B-tính (AC-4) · A2/A3×B-hạt-giống (AC-5) · D2 (AC-6) · D3 và A1×không hồ sơ (AC-7) · trên kho thật (AC-8).
- Later: `T2 implemented` không chữ ký chạm T3 (đã bị chặn ở vòng chấm từng hồ sơ; luật mới chỉ thêm một dòng).
- Không quét bằng skill: không gian kê tay bốn trục ở trên, phản biện context sạch soi thêm; xem dòng sổ «bỏ coverage-scan».

## Out of scope

- Đổi luật cho code ngoài `t3_paths`.
- Neo glob `_acceptance/` vào gốc kho (mục chờ riêng trong README).
- Sửa ca XD-6 chập chờn, có từ 2.38.0.
- Cắt mốc và nâng các kho tiêu thụ (làm ở lượt phát hành).

## Notes

- Vật: `scripts/pre-merge-check.sh` (hàm `t3_co_ho_so_arm`, nhánh `T3-CAN-HO-SO-GUARD`) · thước: `tests/scripts/t3-can-ho-so-arm.test.mjs` ca HA1…HA20 · tài liệu: `README.md` · sửa fixture GPM13 trong `tests/scripts/run-tests.sh`.
- Known limits đã khai trước: luật không buộc hồ sơ với từng tệp T3 (kit không có ánh xạ tệp → hồ sơ), nên một hồ sơ T3 PASS của việc khác đi cùng PR vẫn thoả luật; PR cài kit được miễn trọn. Xem Hỏi-3 của Cổng Phạm vi. Trên lịch sử kho chưa có PR hồ sơ T2 máy-thông chạm T3, nên AC-8 không phủ nhóm đó; ca HA6, HA23 phủ bằng fixture.
- Vật có trước hồ sơ: chiều đỏ ở lịch sử, commit 3539300c trước 4b66432c.
