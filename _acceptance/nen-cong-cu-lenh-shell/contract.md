---
schema_version: 1
feature: Chân công cụ của đường nền thôi báo động giả cho executor dựng đường bằng cú pháp shell — token đầu không phải tên chương trình thì không tra tên, và nói ra khoá nào không được tra; lệnh mở đầu bằng một tên thật vẫn bị tra như cũ kể cả khi phần sau có ống dẫn
slug: nen-cong-cu-lenh-shell
owner: manh@mstar.vn
risk_tier: T2      # feature-loop/scripts + tests/scripts — không chạm hooks/ lib/ pre-merge/recheck
surfaces: [cli]
status: verified         # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-19T01:18:24Z
design_doc: docs/superpowers/specs/2026-09-19-nen-cong-cu-lenh-shell-design.md
---

# Acceptance Contract: nen-cong-cu-lenh-shell

## Context

Chân `cong_cu` của đường nền (`feature-loop/scripts/duong-nen.mjs`) chấm THIẾU cho
executor dựng đường bằng `${VAR:-$(lệnh con)}/đường/dẫn`, vì hàm `tuDau()` tách token
chỉ theo khoảng trắng nên cắt cụt token đầu thành `${CLAUDE_PLUGIN_ROOT:-$(node`. Kho
`~/dev/crm` (nhánh `onehub`) vì thế mang `nen: do` thường trực và cờ vàng bật trên MỌI
thẻ Cổng Phạm vi của kho đó. Người hưởng: người ký cổng ở mọi kho tiêu thụ khai executor
kiểu này — một cờ vàng luôn bật vì lý do sai là cờ vàng người học cách bỏ qua, đúng thứ
làm hỏng một cái cổng. Trace nguyên tố 2 (bằng chứng không tự dối): đường nền sinh ra để
đỏ-của-nền không bị tính cho vật; nền đỏ vì chính nó đọc sai thì nó đang tự dối.

Source input: prompt (owner báo lỗi kèm tái hiện, 2026-09-18) · tái hiện lại trên fixture code-sinh của kho 2026-09-19

## Criteria

- AC-1: Given một executor mà TỪ ĐẦU của lệnh dựng bằng phép thay thế của shell (`${…}`, `$(…)`, `` `…` ``, `$VAR`) và lệnh chạy được trên máy, When đường nền chạy, Then chân `cong_cu` XANH và KHÔNG có dòng đỏ `nen cong-cu:` nào cho khoá đó. Tập khoá chân này duyệt là MỌI `executors.<loại>.<tên>` trong `_acceptance/config.yaml`, không lọc theo `feature_loop.suite_keys`.
- AC-2: Given một executor mà TỪ ĐẦU là tên một chương trình KHÔNG có trên máy, When đường nền chạy, Then chân `cong_cu` vẫn ĐỎ và dòng đỏ ghim đúng tên chương trình đó cùng khoá executor — không đổi so với hôm nay.
- AC-3: Given một executor mà TỪ ĐẦU là tên một chương trình KHÔNG có trên máy NHƯNG phần sau lệnh có cú pháp shell (`|`, `&&`, `;`), When đường nền chạy, Then chân `cong_cu` vẫn ĐỎ ghim đúng tên chương trình đó — luật mới xét TỪ ĐẦU, không xét cả chuỗi lệnh.
- AC-4: Given một executor mà TỪ ĐẦU mở một nhóm của shell (`(cd … && …)`), When đường nền chạy, Then chân `cong_cu` XANH và không dòng đỏ nào cho khoá đó.
- AC-5: Given một executor bị bỏ bước tra tên theo AC-1 hoặc AC-4, When đường nền chạy, Then script in ra **stderr** một dòng lý do gọi đúng khoá executor ấy — đèn tắt vẫn có tiếng, không có đường bỏ qua im lặng. Và chiều ngược lại: Given không khoá nào bị bỏ tra (kho fixture lành, hoặc kho có một lệnh thiếu thật), When đường nền chạy, Then stderr KHÔNG chứa dòng lý do nào — số dòng lý do bằng ĐÚNG số khoá bị bỏ tra, không phải một dòng in cho chắc.
- AC-6: Given bản đột biến của `duong-nen.mjs` gỡ luật nhận-diện-từ-đầu (khối marker `CONG-CU-TU-DAU`), When ca của AC-1 chạy trên bản đột biến ấy, Then ca ấy ĐỎ — phép đo mới treo vào chính luật vừa thêm, không treo vào môi trường máy.
- AC-7: Given khuôn `skills/acceptance/references/duong-nen-template.md`, When đọc ô `cong_cu` của bảng «Bốn chân», Then ô ấy phát biểu luật mới (chỉ tra khi từ đầu là tên chương trình; bỏ qua thì in lý do ra stderr) — lời và vật không trôi khỏi nhau.
- AC-8: Given kho fixture lành và toàn bộ bộ ca cũ của đường nền (NEN0…NEN9), When chạy sau bản vá, Then mọi ca cũ vẫn PASS — bản vá không đổi mã thoát, không đổi khuôn tệp, không đổi khuôn dòng đỏ.

- AC-9: Given kho fixture mang NGUYÊN VĂN dòng executor đang làm `~/dev/crm` nhánh `onehub` đỏ hôm nay (`executors.design.ui_check`, dòng 425 — `${CLAUDE_PLUGIN_ROOT:-$(node scripts/resolve-plugin.mjs …)}/scripts/design-scan.js`), When đường nền chạy trên kho ấy, Then KHÔNG bullet `nen cong-cu:` nào mang khoá ấy; và trên bản `duong-nen.mjs` CHƯA vá thì đúng kho ấy sinh ≥1 bullet như vậy — triệu chứng người hưởng nêu trong Context được tắt, không phải chỉ hàm vá được xanh.

## Coverage

- Trục A — hình dạng TỪ ĐẦU (sau khi bỏ các phép gán `TEN=gia-tri`): tên chương trình trần | đường dẫn trần | chứa thay-thế biến/lệnh | mở nhóm hoặc subshell | từ khoá điều khiển [thước CE: `_acceptance/config.yaml` của kit (ca `bash -c '…'`, `node scripts/…`) + `_acceptance/config.yaml` của `~/dev/crm` (ca `${VAR:-$(…)}/…` và `node ${VAR:-$(…)}/…`) + POSIX.1 Shell Command Language §2.6 Word Expansions].
- Trục B — phần CÒN LẠI của lệnh có cú pháp shell hay không: có (`|`, `&&`, `;`, `>`) | không [thước CE: executor `plugins` của chính kit là ca «tên thật + ống dẫn» có sẵn trong kho].
- Trục C — chương trình ở từ đầu có trên máy hay không: có | không | không áp dụng (từ đầu không phải tên) [thước CE: `command -v`].
- Ô vô nghĩa đã gạch: A=chứa-thay-thế × C=có/không (không tra được thì không có câu trả lời về «có trên máy») — gạch vì mâu thuẫn định nghĩa.
- Ô Core = AC-1 (A3×C n/a) · AC-2 (A1×B-không×C-không) · AC-3 (A1×B-có×C-không) · AC-4 (A4) · đối chứng dương NEN0 (A1×B-không×C-có) · executor `plugins` của kit (A1×B-có×C-có, đã có sẵn trong suite).
- Ô Core bổ sung sau gap-probe: chuỗi lệnh THẬT của kho tiêu thụ (AC-9) — trục A3 nhưng lấy nguyên văn từ vật đang hỏng, không phải một ca tự nghĩ cùng hình dạng.
- Ô Later: đường dẫn trần không tồn tại (A2×C-không) — hành vi hôm nay đã đúng (ĐỎ ghim đường dẫn), bản vá không chạm, không thêm ca.
- Ô Never: từ khoá điều khiển ở từ đầu (`if`, `for`) — `command -v if` trả 0 trong bash nên đã im sẵn, thêm luật là thêm mã không có người hưởng.

## Out of scope

- **Khai triển lệnh qua shell rồi mới tra tên** (lối (b) owner nêu) — khai triển `$( )` là CHẠY lệnh con ngay trong bước dò, biến đường nền từ phép ĐO thành lượt THI HÀNH và mở đúng cửa tác-dụng-phụ mà nền sinh ra để đóng.
- **Bỏ qua cả lệnh khi thấy cú pháp shell ở bất kỳ đâu** (lối (a) thô) — làm ca AC-3 im, tức tắt một cái đèn đang sáng đúng.
- **Mở rộng chân `cong_cu` để phủ khoá ngoài `feature_loop.suite_keys`** — hôm nay không chân nào của nền chạy lệnh thật cho khoá ngoài suite_keys; đó là giới hạn sẵn có của đường nền, bản vá không làm hẹp thêm và cũng không mở rộng.
- **Đụng bên đọc (thẻ Cổng Phạm vi) hay thêm mã dòng đỏ thứ chín** — bản vá dùng nếp `bo-qua`-in-stderr đã có sẵn của chân `luoi` và chân `engine`.

## Notes

- Giới hạn đã biết (khai, không giấu): executor mà từ đầu dựng bằng thay thế shell thì chân công cụ không còn chứng gì về nó; chân `suite` bù lại bằng cách chạy lệnh thật cho mọi khoá trong `feature_loop.suite_keys`.
- Lớp lỗi chỉ xuất hiện ở đúng một chỗ trong kho (`duong-nen.mjs:139`); mọi lời gọi `command -v` khác tra tên cố định (`node`, `git`), không tách từ chuỗi cấu hình.
- Bản repo `feature-loop/scripts/duong-nen.mjs` và bản plugin cache 2.16.0 giống hệt nhau tại thời điểm mở vòng — lỗi nằm ở nguồn, bản vá đi theo mốc phát hành tới các kho tiêu thụ.
