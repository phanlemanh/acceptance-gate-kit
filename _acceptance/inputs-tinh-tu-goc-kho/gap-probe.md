---
slug: inputs-tinh-tu-goc-kho
at: 2026-09-05T01:54:26Z
verdict: findings
p0: 0
p1: 2
p2: 2
claims_input: ok
---

# Gap-probe — phản biện ngữ cảnh sạch (S1, one-pass)

Input: design doc · contract.md · evals.yaml · decisions.jsonl · bài học xuyên hồ sơ (claim-scan, 12 dòng).

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design + evals | Hai đột biến (goc-cu, fail-open) không đột biến nào nhắm NỘI DUNG gợi ý «…» của AC-3, trong khi lời hứa là quan hệ BẰNG path.relative(root, vị trí cũ); «9/13 đỏ trên mã cũ» không chứng minh assert gợi ý biết phân biệt; đối chứng dương «viết lại theo gợi ý» không khai là rút từ stderr thật hay gõ tay | Bản sửa tính gợi ý sai ở một nhánh (in đường tuyệt đối hay đường nguyên văn); assert substring vẫn xanh; đối chứng dương gõ tay vẫn xanh; người chép gợi ý vào evals rồi bị chặn lần nữa | (a) đột biến thứ ba goi-y-sai cho chân E3, dòng FAIL ghim riêng; (b) JI3 assert token «…» trọn vẹn; (c) đối chứng dương rút chuỗi giữa «…» từ stderr thật rồi viết lại evals — round-trip; cùng lớp cho AC-2: so đường dẫn nguyên văn bằng token có ranh giới | fixed: design khai đột biến thứ ba goi-y-sai (in đường tuyệt đối thay vì path.relative); E3 expected đòi round-trip từ stderr; lưới JI3 đã dùng token «…» trọn (giữ), JI3 đối chứng dương sẽ rút từ stderr; JI2 so «không tồn tại trên đĩa: <p> (» có ranh giới — làm ở S3 |
| P1 | contract + evals | AC-6 tuyên «bản sửa KHÔNG đổi bảng/nhánh/hash» nhưng E6 chỉ đo «suite xanh» — xanh là «còn nhất quán với suite», không phải «không đổi»; overclaim cùng lớp [cong-dang-co-cua#F1] | Commit kèm một chỉnh nhỏ trong acceptance-verify.js; W20/W-G3 vẫn xanh; E6 PASS; Cổng 2 ký hồ sơ mà Out of scope đã bị chạm | E6 assert quan hệ trên vật giao: diff acceptance-verify.js so mốc gộp rỗng; tập file mã đổi ngoài tests/docs/skills/_acceptance BẰNG {s4-args.mjs}; suite xanh chỉ là đối chứng dương | fixed: AC-6 viết lại thành hai vế đo được bằng git diff; E6 thành chân script lane-doc-khong-doi với chiều đỏ trên bản clone tạm có commit chạm acceptance-verify.js; suite workflows vẫn chạy mỗi vòng qua suite_keys |
| P2 | evals | AC-5 có vế phủ định trọn file nhưng E5 judgment trỏ hội đồng vào đúng các mục có tên; vế phủ định không có đối chứng dương, không thước máy | Còn một ví dụ inputs: contract.md trần ở mục khác; hội đồng PASS với trích dẫn đẹp; hồ sơ kế bị E2/E3 chặn — lỗi gốc tái diễn qua đường tài liệu | Thêm eval script grep âm tính trong khối inputs: của ba file cho contract.md · evidence/ · ../ trần và chuỗi «→ abs path» trần; đối chứng dương: chép ba file sang tạm, tiêm một dòng - contract.md dưới inputs: → phải bắt được kèm tên file + dòng | fixed: thêm E7 (script, chân tai-lieu-khong-con-duong-cu) cho AC-5; E5 giữ để phán phần «có nói hệ quả khi input vắng» |
| P2 | design | Đột biến chỉ đặt tên theo hành vi, không khai phép sửa chính xác; không assert «mũi tiêm đã trúng» | sed không khớp sau một lần đổi tên biến → bản sao BẰNG bản thật, chân đỏ với thông điệp khó hiểu; hoặc mutant lỗi cú pháp và người viết nới ghim xuống chỉ exit ≠ 0 | Design khai mỗi đột biến là MỘT phép thay thế nguyên văn (dòng trước/dòng sau); rang.sh assert ! cmp -s và node --check sau khi tiêm; chiều đỏ giữ đủ hai vế exit ≠ 0 VÀ dòng FAIL có tên | fixed: design doc có bảng ba đột biến dạng trước→sau nguyên văn; rang.sh sẽ assert mũi tiêm trúng + mutant chạy được trước khi chạy nhóm JI (làm ở S3) |
