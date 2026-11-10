---
schema_version: 1
feature: Code t3_paths phải có hồ sơ thật sự bị cổng chấm
slug: t3-can-ho-so-arm
owner: phanlemanh@gmail.com
risk_tier: T3      # chạm scripts/pre-merge-check.sh — trong risk_tiers.t3_paths
surfaces: [cli, ci]
status: signed-off
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
- Known limits — chọn ở Cổng Bằng chứng 2026-11-10:
  - Ngoài-1: Người dùng gõ nhầm hoặc cố tình đưa tên hồ sơ có dấu đi lùi thư mục thì lệnh khuôn có thể tạo tệp ngoài thư mục hồ sơ.
  - Ngoài-2: Một ca kiểm thử có thể báo xanh dù cổng hỏng vì lý do khác với lý do dự định.
  - Ngoài-3: Nếu thư mục kho có dấu cách, thợ sẽ chờ mãi mà không có thông báo lỗi nào, người dùng phải tự đoán vì sao treo.
  - Ngoài-6: Nếu đường dẫn kho có dấu cách, thợ chờ khoá mãi dù khoá đã cấp và không có thông báo lỗi.
  - Ngoài-7: Trên máy thiếu công cụ cần thiết, hồ sơ chưa có chữ ký người vẫn được cho qua mà không có dòng nào báo là đã bỏ kiểm.
  - Ngoài-8: Nếu bộ đọc giờ máy hỏng và bỏ sót bản ghi, bài kiểm báo bỏ qua thay vì báo đỏ, nên lỗi có thể không bị phát hiện kịp.
  - Ngoài-9: Thẻ việc có thể hiện nhầm giá trị sang sai trường mà bài kiểm vẫn xanh, nên lỗi đảo hàng khó bị bắt.
  - Ngoài-10: Nếu mẫu thẻ việc đổi hình dạng, thẻ có thể hiện chưa điền mà bài kiểm vẫn xanh, nên người dùng thấy thẻ trống mà không ai báo.
  - Ngoài-11: Một số ca chứng minh cổng chặn đúng lý do có thể xanh dù bản thử đã hỏng vì nguyên nhân khác, nên bằng chứng yếu hơn vẻ ngoài.
  - Ngoài-12: Một ca kiểm thử có thể xanh với bất kỳ kiểu thất bại nào, nên không chứng minh cổng báo đúng khi nhánh gốc không tìm thấy.
  - Ngoài-13: Bài kiểm tra tự thử của cổng có thể báo xanh dù bản thử đã hỏng giữa chừng, nên có lúc ta tưởng một luật chặn đã được chứng minh sống mà thực ra chưa.
  - Ngoài-14: Mười hai ca thử kiểu gỡ từng lý do chặn có thể xanh giả khi bản thử chết sớm, nên bằng chứng rằng từng lý do chặn đang thật sự hoạt động yếu hơn vẻ ngoài.
  - Ngoài-15: Người chạy công cụ dựng khuôn có thể vô tình ghi tệp ra ngoài thư mục hồ sơ nếu gõ tên hồ sơ sai dạng.
  - Ngoài-18: Công cụ kiểm khuôn giao diện có thể báo thiếu thành phần dù đã có, hoặc bỏ sót thiếu thật, khi mã dùng hàm mũi tên trong thuộc tính.
  - Ngoài-20: Phép thử có thể vẫn xanh dù thẻ việc ghép nhầm giá trị sang sai trường, nên lỗi ghép nhầm có thể lọt mà không ai biết.
  - Ngoài-21: Phép thử gỡ nhánh có thể xanh vì bản sao bị hỏng chứ không phải vì lý do chặn đã biến mất, nên bằng chứng yếu hơn vẻ ngoài.
  - Ngoài-22: Một phép thử về hồ sơ có thể xanh vì bất kỳ lỗi nào, kể cả lỗi không liên quan đến điều nó định kiểm.
  - Ngoài-23: Phép đối chiếu trên các kho thật có thể coi là đúng cả khi luật chưa chạy tới, nên độ tin cậy của kết quả bị thổi phồng.
  - Ngoài-24: Nếu mẫu đặc tả đổi dạng, đặc tả viết theo mẫu sẽ bị đọc là chưa điền thẻ việc mà phép thử vẫn xanh.
  - Ngoài-25: Dòng cho nghỉ trong phép thử là gõ tay chứ không rút từ bộ đọc như mô tả, nên nếu định dạng thật đổi, phép thử không bắt được.
  - Ngoài-26: Nếu ai đó xoá bớt các ca thử chiều đỏ, bước kiểm vẫn xanh và chỉ báo số nhỏ hơn.
  - Ngoài-27: Sau khi gộp, phép so với bản trước vòng thành so với chính nó nên không còn phát hiện thay đổi ngoài ý muốn.
