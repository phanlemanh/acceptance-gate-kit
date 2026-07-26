---
slug: gap-probe-presence-hook
at: 2026-07-26T21:30:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

# Phản biện context sạch — contract v3 (một implementation dùng chung)

Vòng probe cho bộ artifact **v3**, sau khi v2 fail 6 round S4 (~38 finding). Chẩn
đoán v2: **hai implementation hai ngôn ngữ, parity chỉ giữ bằng comment**. Đáp án
v3 là một `lib/gap-probe.js` dùng chung. Critic context sạch chỉ đọc
contract.md + evals.yaml + decisions.jsonl; cấm đọc mã nguồn.

Vòng probe v2 nằm trong lịch sử git (contract đó đã bị thay).

Kết luận vòng này, một câu: **đáp án v3 cần nhưng CHƯA đủ** — nó chữa lớp luật mà
không chạm lớp hạ tầng vốn đẻ ra cả 3 lỗi HIGH của v2, và mode `required` vẫn
chưa có sàn fail-closed.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract + evals | v3 chuyển luật vào lib dùng chung nhưng KHÔNG chạm hạ tầng diff-scope trong bash — nơi sinh ra cả 3 lỗi HIGH của v2 (ledger d-125). Tệ hơn: bộ eval v3 ĐÃ ĐÁNH RƠI GPM14 + GPM15, đúng hai răng dựng riêng cho hạ tầng đó | Merge v3 với niềm tin "đã sửa gốc". `_acceptance/` nằm ở `pkg/` (monorepo) hoặc `git diff` thoát != 0 → luật tắt im lặng y như v2, nhưng lần này không còn eval nào bắt được vì chúng đã biến mất khỏi evals.yaml | AC-17 (`git diff`/resolve base lỗi ở mode required → VIOLATION + marker, CẤM coi danh sách rỗng là "không slug liên quan") · AC-18 (`_acceptance/` ngoài git root vẫn phải VIOLATION) · khai lại GPM14/GPM15 thành eval đích danh | **fixed**: thêm AC-17, AC-18; E18 giữ GPM15 và E19 giữ GPM14, cả hai ghi rõ "(giữ từ v2)" để không bị rơi lần nữa |
| P0 | contract + evals | mode `required` KHÔNG có sàn fail-closed. AC-14 (vắng node / thiếu lib) và vế sau AC-12 (chạy không `--base`) đều exit 0 chỉ với một NOTE — và `expected` của E15 GHIM nguyên văn "exit không đổi", tức đóng đinh chính vế fail-open vào bằng chứng. Mâu thuẫn thẳng với AC-13 ngay bên trên: "van thoát fail-CLOSED, không fail-open" | CI image rơi mất `node`, hoặc ai đó xoá `lib/gap-probe.js`. Cổng in NOTE, exit 0, PR xanh. Đây đúng là kênh-NOTE-chết đã giết v1 (ledger d-114) — lặp lại y nguyên ở v3 | AC-14 viết lại: không cưỡng chế được ở `required` = VIOLATION · AC-16: mọi lý do tắt phải in đúng một dòng marker máy-đọc `GAP-PROBE: NOT ENFORCED reason=<lý do>` + dòng tổng kết khai · E15 assert marker thay vì "exit không đổi" · E17 quét đủ 4 lý do tắt | **fixed**: AC-14 siết fail-closed, thêm AC-16 marker, sửa E15 (GPM18a/b: required→VIOLATION, advisory→NOTE), thêm E17 |
| P1 | evals | "một implementation dùng chung" chỉ được khẳng định trong `## Notes` — không eval nào ĐO. Parity giữa thẻ quyết định và pre-merge lại quay về giữ bằng chữ | Ai đó sửa `lib/gap-probe.js` nhưng gate-card.js còn regex inline cũ (hoặc ngược lại). Hai lối vào lệch nhau, mọi eval hiện có vẫn xanh vì không cái nào chạy CẢ HAI trên cùng đầu vào | AC-19 (grep cấu trúc: gate-card `require` lib, không còn literal regex riêng) · AC-20 (bảng ≥8 đầu vào chạy qua CẢ HAI lối vào, khớp từng ca) | **fixed**: thêm AC-19/AC-20, eval E20/E21 |
| P1 | contract | AC-11 nói "cảnh báo CẤU HÌNH SAI, cấm âm thầm về advisory" nhưng KHÔNG nói chạy tiếp ở mode nào và exit bao nhiêu. "Không âm thầm" ≠ "không fail-open" | Implementer in cảnh báo rồi vẫn dùng advisory và exit 0. Test cũ hasout dòng cảnh báo → xanh. Config sai chính tả vẫn cho merge, chỉ ồn ào hơn | AC-11 nêu đích danh: VIOLATION cấu hình, exit != 0, script CHẠY TIẾP hết các luật khác | **fixed**: AC-11 viết lại; E11 nay assert exit code + dòng tổng kết + vắng lỗi shell |
| P1 | evals | E12 chỉ kiểm `premerge-messages.txt` "tồn tại và chứa đủ 4 nhãn" — đo sự đầy đủ chứ không đo tính XÁC THỰC. Nó là gác cổng cho judge E9 (AC-9), nên judge đang chấm trên bằng chứng không ai buộc phải khớp mã | Thông điệp trong script đổi, file evidence không đổi (hoặc chép tay). E12 xanh vì 4 nhãn vẫn còn; E9 chấm một bản chụp lỗi thời và cho PASS | E12 TỰ SINH LẠI file từ 4 fixture trong cùng lần chạy rồi diff byte-đối-byte | **fixed**: sửa `expected` của E12 |

## Định đoạt — tóm tắt

5/5 finding sửa **trên giấy** (contract + evals), không finding nào đẩy sang
`human-gate1`, không finding nào `deferred`.

Delta v2 → v3-r2: **12 AC → 20 AC**, **13 eval → 21 eval**, **8 trục → 10 trục**.
AC mới: AC-16 (marker máy-đọc khi tắt) · AC-17 (diff-scope hỏng ở required) ·
AC-18 (path shape ngoài git root) · AC-19 (parity cấu trúc) · AC-20 (parity theo
bảng). AC siết lại: AC-11, AC-14.

Một-pass: sửa xong KHÔNG re-probe (quy ước S1#7) — phần mã còn 3 round S4 canh.
