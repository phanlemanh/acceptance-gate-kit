---
schema_version: 1
feature: Làn V giữ lại hồ sơ còn lỗi trong hợp đồng
slug: lan-v-giu-loi-trong-hop-dong
owner: phanlemanh@gmail.com
risk_tier: T3      # chạm lib/** và scripts/pre-merge-check.sh — trong risk_tiers.t3_paths
surfaces: [cli, ci]
status: draft
approved_by:
approved_at:
design_doc: _acceptance/lan-v-giu-loi-trong-hop-dong/design.md
---

# Acceptance Contract: lan-v-giu-loi-trong-hop-dong

## Context

Làn V cho hồ sơ T2 đi tiếp không chữ ký khi bằng chứng xanh-sạch, nhưng luật xanh-sạch không đọc mục «Trong hợp đồng» của `review-findings.md`. Lỗi mức vừa và nhẹ đi cùng phán quyết PASS, nên hồ sơ có lỗi được máy thông qua và không ai phải đọc lỗi. Người hưởng: chủ kho của mọi kho cài kit. Ngày 10/11 đo được 18/162 hồ sơ T2 PASS của kit có lỗi thật nằm ở mục này.

Source input: lời giao của phiên `onehub-inventory`, ngày 10/11/2026; chủ kho duyệt khuyến nghị bằng câu «Duyệt, làm đi».

## Criteria

- AC-1: Given hồ sơ T2 PASS, chưa ký, đủ sáu điều kiện xanh-sạch, mục «Trong hợp đồng» có một lỗi ở mức cao, vừa hoặc nhẹ, When lưới trước gộp và máy quét cùng đọc hồ sơ, Then cả hai nói chưa sạch: lưới thoát 1 với `VIOLATION [<slug>]`, máy quét trả `clean: false`, lý do nêu `Trong-1`; và ba tài liệu liệt điều kiện làn V có cụm «còn lỗi trong hợp đồng».
- AC-2: Given mục có nhiều lỗi, gồm lỗi mang nhãn lượt `(r1)` và tệp xuống dòng CRLF, When bộ đọc chạy, Then đếm đúng số lỗi, lý do gọi đủ `Trong-1` đến `Trong-N`, và mục «Ngoài hợp đồng» không được tính; trên mọi `review-findings.md` thật của kit, kết quả khớp bản kê chốt trước.
- AC-3: Given không có tệp, tệp rỗng, không có mục, hoặc mục chỉ có câu «Không có finding nào.» hay «(không có finding nào map được vào AC)», When lưới và máy quét đọc hồ sơ xanh-sạch, Then hồ sơ vẫn đi tiếp, không có lý do nào về lỗi trong hợp đồng.
- AC-4: Given mục có chữ mà máy không đọc ra đủ lỗi (tiêu đề h3 khuôn cũ, gạch đầu dòng không in đậm, in đậm giữa câu), When lưới và máy quét đọc hồ sơ, Then cả hai bản dựng giữ hồ sơ, lý do nêu «cần người soi».
- AC-5: Given hồ sơ đã có chữ ký người và mục còn lỗi, When lưới chạy, Then không có `VIOLATION` nào của hồ sơ vì lỗi trong hợp đồng.
- AC-6: Given hồ sơ `machine-cleared` còn lỗi, When PR không đổi hồ sơ, Then lưới không chặn và máy quét không coi là hỏng; When PR có đổi hồ sơ, Then lưới chặn và nêu «lỗi trong hợp đồng»; Given cùng hồ sơ ở `verified` và PR không đổi nó, Then lưới vẫn chặn.
- AC-7: Given bộ 39 tình huống viết sẵn gồm hồ sơ người đã duyệt Cổng 1 nhưng chưa ký, When so hai bản dựng, Then mọi tình huống cho cùng kết luận; bớt một phần tử là đỏ.
- AC-8: Given bộ đọc ném lỗi, hoặc tệp có mà không đọc được, When lưới chạy, Then hồ sơ bị chặn với thông điệp fail-closed; bộ đọc được lấy cạnh kịch bản của kit, không theo gốc kho; When máy quét chạy với bộ đọc hỏng, Then không trả `clean: true`.
- AC-9: Given bản sao trọn thư mục đã xanh trên cùng tình huống, When gỡ vế mới ở từng bản dựng, gỡ ở cả hai, bỏ miễn trừ `machine-cleared`, lọc theo mức lỗi, hoặc bỏ fail-closed, Then đúng ca tương ứng đỏ với thông điệp ghim.
- AC-10: Given ba kho bắt buộc kit, `onehub-quy-hang`, `onehub-invest` (kho vắng là đỏ), When chạy lưới của bản trước và bản vá với điểm so là đỉnh hiện tại của từng kho, Then bản vá không thêm `VIOLATION` nào so với bản trước, và ba hồ sơ `va-e7-loi-that-cap-han`, `s03-null-byte`, `test-anh-mau-co-manifest` không bị chặn; bỏ miễn trừ `machine-cleared` thì đúng ba tên đó bị chặn.

## Coverage

- Trục A — trạng thái hồ sơ: `verified` chưa ký | `machine-cleared` | đã ký | người duyệt Cổng 1, chưa ký [thước CE: nhánh đọc `status` của hai bản dựng].
- Trục B — mục «Trong hợp đồng»: không tệp | không mục | câu không có lỗi | một lỗi theo ba mức | nhiều lỗi | sai khuôn.
- Trục C — bản dựng: lưới trước gộp | máy quét.
- Trục D — bối cảnh PR: hồ sơ có đổi | hồ sơ không đổi.
- Trục E — bộ đọc: chạy được | hỏng.
- Ô Core: A1×B (AC-1, AC-2, AC-3, AC-4) · A3 (AC-5) · A4 (AC-7) · A2×D (AC-6) · C (AC-7) · E (AC-8) · trên kho thật (AC-10).
- Later: phân tầng theo mức lỗi; đưa vào luật ba hồ sơ cũ khi chúng không đổi.
- Không quét bằng skill: không gian kê tay năm trục ở trên, phản biện context sạch soi thêm; xem dòng sổ «bỏ coverage-scan».

## Out of scope

- Sửa các lỗi còn mở ở hồ sơ `machine-cleared` cũ của kho tiêu thụ.
- Trỏ bản hiển thị lỗi trên thẻ (nhánh `fix/the-hien-loi-trong-hop-dong`) về bộ đọc mới.
- Phân tầng theo mức lỗi.
- Sửa ca KK-8 và MC-11 phụ thuộc trạng thái cây, tên thư mục.
- Cắt mốc và nâng các kho tiêu thụ.

## Notes

- Vật: `lib/out-of-contract.cjs` · `scripts/khong-can-nguoi.mjs` · `scripts/pre-merge-check.sh` · thước: `tests/plugins/lan-v.test.mjs` ca LV5, LV7, LV8 · `tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs` · tài liệu: `GUIDE.md`, `QUICKSTART.md`, `feature-loop/skills/feature-loop/SKILL.md`.
- Vật có trước hồ sơ: bản sửa ở commit `1c82e2cc`. Chiều đỏ ở lịch sử: LV5, LV7, LV8 đỏ trên cây trước bản sửa trong phiên ngày 10/11; AC-9 dựng lại chiều đỏ bằng phá thử.
- Known limits đã khai trước: hồ sơ khuôn cũ bị giữ khi đi qua làn V, phải viết lại mục hoặc lấy chữ ký; hồ sơ `machine-cleared` cũ còn lỗi không bị xét lại khi không đổi; E10 cần ba kho có mặt trên máy nên không chạy được ở CI.
