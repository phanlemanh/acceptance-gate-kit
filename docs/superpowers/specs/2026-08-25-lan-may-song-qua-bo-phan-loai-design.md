# Thiết kế — Làn máy sống qua bộ phân loại (ô A+B)

*T2 · D0 (không chạm bề mặt web) · nhánh `feat/lan-may-song-qua-bo-phan-loai`*

## Vấn đề

~15 vòng nghiệm thu trên 5 hồ sơ chết vì bộ phân loại an toàn bị giới hạn nhịp
(04/08 → 25/08, ≥28 triệu token cho 0 bằng chứng). Cơ chế: kho **không cho-phép-sẵn
lệnh nào**, nên mọi lệnh của mọi agent đều phải hỏi; tung 26–30 agent là một cơn bão
request. Sổ cái đầy đủ:
`docs/findings/2026-08-25-retro-classifier-va-nghi-thuc-khong-hoc.md`.

## Phát hiện quyết định hình dạng (S1, 25/08)

Đọc nguyên văn khung cấu hình của harness — khoá `permissions.autoMode.classifyAllShell`
tự mô tả: *«khi true, mọi luật cho-phép Bash bị TREO trong lúc auto mode chạy, để mọi
lệnh shell đi qua bộ phân loại. Mặc định: false.»* Nói ngược: **mặc định, lệnh khớp
luật cho-phép KHÔNG đi qua bộ phân loại.** Đó là cơ chế nửa A dựa vào — giả định sinh
tử số 1 của hạt giống nay có căn cứ nhất thủ.

**Ràng buộc đi kèm, đo được:** sửa `.claude/settings.json` giữa phiên KHÔNG có hiệu
lực. Phá thử: cài một luật CẤM cho một lệnh vô hại rồi chạy đúng lệnh đó — nó vẫn
chạy. Nên **hiệu lực lúc chạy không kiểm được trong chính phiên tạo ra nó**. Phép đo
của ô này vì thế bám vào **VẬT** (lời khai đúng hình dạng, đúng quan hệ), không bám
hiệu lực runtime; hiệu lực là thứ ngưỡng Cổng Đáng đo trên 5 vòng S4 kế.

## Vật giao

**A · luật cho-phép của kho.** Thêm `permissions.allow` vào `.claude/settings.json`,
mỗi entry **khớp CHÍNH XÁC** một lệnh kiểm cố định. Tập lệnh không do tay gõ mà **giải
từ `feature_loop.suite_keys`** trong `_acceptance/config.yaml` — một cây nguồn, và
quan hệ song ánh giữa hai file là thứ đếm được.

**B · đường thoái hoá trong nghi thức.** Nhánh BLOCKED của vòng lặp hiện chỉ có một
câu «khắc phục nguyên nhân, chạy lại cùng round». Thêm: lượt fan-out bị chặn **vì bộ
phân loại** → lượt kế **bắt buộc** đi verify độc lập tuần tự, KHÔNG fan-out lại; kèm
con trỏ sang đường đó và hai tiền lệ đã chứng (chip A vòng 4 · chip B vòng 1).

**A' · khuôn khởi tạo.** Khối khuyên kho tiêu thụ làm tương tự cho suite của họ, nêu
dạng khai đúng và nói rõ kit **không** tự ghi luật vào kho người khác — đó là quyết
định an ninh của đội đó.

**Tài liệu.** GUIDE nêu cả hai để người vận hành tra được.

## Quyết định hình dạng — và vì sao

**Khớp chính xác, không glob.** Mọi entry cho-phép là chuỗi lệnh đầy đủ, **không chứa
`*`**. Đây là mệnh đề ĐÓNG và đếm được, thay cho «cấm glob rộng» vốn là phủ định phổ
quát trên không gian mở — đúng lớp lỗi vòng design-pass-nac vừa trả giá bốn vòng. Chân
ngành hậu thuẫn: `sudoers` phân biệt lệnh-cụ-thể với `ALL`; khối `permissions:` của
GitHub Actions theo least-privilege.

**Chỉ 5 lệnh suite, KHÔNG gồm răng hồ sơ.** Kho đang có 38 răng `_acceptance/*/rang*.sh`;
tên chúng đổi theo từng hồ sơ nên mọi luật cho chúng hoặc lỗi thời hoặc phải glob rộng.
Suite chạy MỖI vòng (tải cao nhất), răng chạy một lượt — cắt theo Pareto.

**Bỏ `autoMode.allow`.** Khoá đó cho nhét lệnh vào phần allow của *chính bộ phân loại*.
Bỏ vì nó vẫn GỌI bộ phân loại: giảm rủi ro bị từ chối, không giảm số lần gọi, nên
không chạm nguyên nhân.

## Hai chỗ phản biện context sạch bắt được (P0, đã sửa vào vật trước cổng)

**Ô này KHÔNG giao đường trộn nào** — nửa A là một lần sửa có chủ đích, không phải
script. Bản đầu của phép đo «phép trộn không nuốt cấu hình khác» vì thế gắn vào một
vật không tồn tại; nếu để nguyên, thi công buộc phải đẻ một hàm trộn CHỈ để test gọi,
và màu xanh sẽ chứng minh một helper test-only chứ không nói gì về file đã ship. Nay
phép đo so **bản ở mốc git cố định `BASE-LMSQBPL` với bản trong cây**, khoá phải-giữ
rút từ chính bản ở mốc.

**Văn phạm luật quyền phải có phép đo riêng.** Nếu settings ghi entry trần thiếu bọc
`Bash(...)` và bộ đọc của bộ ca cũng không mong bọc, thì phép song ánh và phép đếm
`*` đều XANH trong khi luật câm hoàn toàn với harness — bên viết và bên đọc trôi cùng
nhau. AC-8 ghim khuôn ở MỘT chỗ có mốc neo, kèm con trỏ nguồn.

## Độ phủ (quét hình thái, preset test-matrix)

| Trục | Giá trị | Thước CE |
|---|---|---|
| A — vật mang lời khai | settings kho · khuôn khởi tạo · nghi thức · tài liệu | bốn vật đối chiếu mục «Điều muốn có» của hạt giống + danh sách file suy ở S0 |
| B — hình dạng lời khai | đúng & hẹp · thiếu hẳn · **rộng quá** · sai chỗ/sai cú pháp | ngành: `sudoers` NOPASSWD (lệnh-cụ-thể vs ALL) · GitHub Actions `permissions:` least-privilege · khung cấu hình harness (`allow`/`deny`/`ask` + `classifyAllShell`) |
| C — đời kho đọc vào | kho tự host · kho tiêu thụ mới init · kho tiêu thụ cũ | ba nhánh đọc-cũ đã chạy thật trong kit (contract thiếu Coverage 1.13.0 · workspace thiếu gap-probe 1.14.0 · sổ phiên thiếu `context:` 2.0.0) |

Ô nguy hiểm nhất là **B «rộng quá»**: nó biến allowlist thành cửa mở mà không kêu một
tiếng. Luật khớp-chính-xác đóng ô đó bằng một mệnh đề đếm được.

Cross-cutting mọi ô Core: phép trộn phải **giữ nguyên mọi khoá khác** của settings; và
mỗi phép đo phải có chiều đỏ phá VẬT THẬT, không phá mutant của chính nó.

## Giới hạn đã khai

Hiệu lực lúc chạy của nửa A **không có phép đo nào trong ô này** — settings đọc lúc
khởi động phiên. Ô đo lời khai đúng; hiệu lực đo ở ngưỡng Cổng Đáng (5 vòng S4 kế,
hoặc tới 30/09).
