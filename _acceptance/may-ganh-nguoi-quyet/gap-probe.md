---
slug: may-ganh-nguoi-quyet
at: 2026-08-11T17:30:00Z
verdict: findings
p0: 2
p1: 5
p2: 4
---

# Gap-probe: may-ganh-nguoi-quyet

Critic context sạch (subagent tươi) chạy TRONG vòng S4 — muộn hơn nếp thường
(chip ③ chạy trước Cổng 1) vì hai nguyên tắc đã có spec phiên B duyệt sẵn.
Critic đọc contract + evals + 4 lớp vật + P194 + drift script, và **chạy
thật**: dựng bốn kịch bản phá-vật rồi cho đi qua chính logic checker. Cả
bốn ban đầu XANH — tức bốn lỗ thật, không phải suy đoán.

Toàn bộ 11 finding định đoạt one-pass TRONG vòng verify (sửa THƯỚC, không hạ
đáp án); hai P0 là lỗ của chính bộ thước, không phải của vật.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Xử lý |
|---|---|---|---|---|
| P0 | evals E1–E4 (`cmd: config:executors.test.plugins`) | Verdict = mã thoát TRỌN suite; không ai grep dòng của case. Suite trên `origin/main` cũng exit 0 ⇒ 4 eval **không phân biệt được cây cũ với cây mới** | Xoá/đổi tên khối `run "P194 …"` (hoặc `ONLY_BLOCK` lọt vào env) → suite vẫn exit 0 → E1–E4 đều PASS trong khi KHÔNG phép đo mới nào chạy | fixed: script răng `p194-rang.sh` ghim «PASS: P194» + 3 dòng đếm + số chiều đỏ ≥ 9 + tổng-kết-phải-khớp-số-mutant-đã-in; E1–E3 đổi sang executor này. Chiều đỏ chạy thật: đổi tên case trong bản sao → suite XANH mà răng ĐỎ |
| P0 | `GATE_NEEDLES` + AC-1c | **Không có needle ÂM.** Lời hứa lõi của chip là GỠ một câu hỏi, mà mọi assert đều là "chuỗi phải CÓ mặt" | Chèn lại `Ask how many minutes Gate 1 took` vào thân approve, giữ nguyên `ghi 0` → mọi neo dương vẫn đủ, P194 XANH; lệnh lại hỏi phút, cổng lại hai lượt | fixed: 3 neo ÂM (`how many minutes` · `hỏi lại đúng phần đó` · `follow-up DUY NHẤT`) cho cả grammar lẫn 6 thân + MUT-10 chèn-lại → đỏ đích danh |
| P1 | 4 thân approve/signoff, nhánh CẢNH BÁO | Bậc thang chỉ được ghim 2/4 luật; nhánh CẢNH BÁO — chính cái đã bắn đúng ở lượt dogfood Cổng 1 — không needle nào | Xoá trọn đoạn CẢNH BÁO khỏi cả bốn thân → P194 xanh; lưới chống ký-nhầm-tên trên máy dùng chung biến mất | fixed: needle per-harness + MUT-12 |
| P1 | AC-1a thứ tự bậc thang (d-20008) | Không phép đo nào ghim THỨ TỰ — chỉ ghim sự có mặt | Hoán vị về `--as → approvers → git config` (đúng phương án B mà d-20008 LOẠI) → P194 xanh; cái hại mà cả một vòng soát phiên B đi tìm quay lại | fixed: assert vị trí tương đối trong 4 thân + MUT-11 |
| P1 | AC-1b (ngày ở «Ký») | Tiêu chí **không có neo nào** — cả `NEO` lẫn `GATE_NEEDLES` đều không đụng luật ngày Cổng 2 | Xoá câu ngày khỏi grammar + hai thân signoff → 15/15 neo vẫn đủ, P194 xanh, deliverable của AC-1b bốc hơi sạch | fixed: neo `ngay-o-ky` + MUT-14 |
| P1 | E7 `inputs` | Chỉ đưa 2 thân Claude cho hội đồng ⇒ **2 SKILL Codex đã sửa chưa từng bị đọc-hiểu lần nào**, và chúng đã lệch nghĩa sẵn | Người dùng hai harness nhận hai hành vi khác nhau, mọi eval xanh | fixed: `inputs` thêm 2 SKILL Codex (luật W-G8); hội đồng vòng 8 chấm cả 4 thân → xác nhận nhất quán 8/8 ca, 3 lệch câu chữ đã vá |
| P1 | `no-vat-cam-drift.sh` chân (a) | `git diff BASE...HEAD` **mù với cây làm việc**, trong khi chân (b) lại đọc cây làm việc — hai chân đo hai vật khác nhau | Sửa `gate-card.js` mà chưa commit → chốt in OK, trong khi P192 render thẻ bằng đúng bản đã sửa đó (critic thử thật: vẫn xanh) | fixed: chân (a) hợp nhất ba hộp (commit · chưa-commit · untracked); phá-thử lại → ĐỎ đích danh |
| P2 | Out of scope khối 2 | "KHÔNG đụng 3 lệnh không-câu-hỏi" — không AC nào đo; P193 chỉ canh đoạn điều khoản, phần còn lại của file tự do | Sửa bất kỳ chỗ nào khác của `acceptance-init.md` → cả 7 eval xanh trong khi phạm vi đã bị vượt | fixed: chân (a2) — 6 lệnh không-câu-hỏi byte-equal `origin/main`; phá-thử → ĐỎ |
| P2 | role `start` trong P194 | 2 needle nhưng **0 mutant** — không bằng chứng nhánh `if role == "start"` từng thực thi | Refactor khoá `SITES` → nhánh start im lặng không chạy, 8 mutant còn lại vẫn xanh | fixed: MUT-13 gỡ hiển-thị-lại của thân start → đỏ đích danh |
| P2 | dòng tổng kết P194 | Số chiều đỏ là **literal**, trong khi số neo suy từ mảng | Xoá một khối MUT → suite xanh, dòng tổng kết vẫn khai số cũ; evidence trích câu đó làm bằng chứng | fixed: số suy từ danh sách `MUTS`; răng còn đối chiếu số khai với số dòng `MUT-n` đếm được trong stdout |
| P2 | mọi neo văn bản (P191+P194) | Đo **sự có mặt của chuỗi**, không đo mệnh đề — đảo nghĩa câu mà neo vẫn đủ | Viết «LUÔN hỏi mở; cách hiểu khả dĩ nhất chỉ dùng khi đường cùng» → cả hai neo vẫn có mặt, thước xanh, nguyên tắc 2 lật 180° | khai known-limits (không có vá rẻ bằng grep); đường giảm nhẹ ĐÃ làm: hội đồng E7 đọc NGHĨA trên cả 4 thân, 8 ca |

## Lỗ critic tìm ra mà chính S4 phát hiện thêm (baseline hai chiều)

Chạy baseline chiều NGƯỢC cho neo ÂM (chuỗi phải CÓ trên `origin/main`, phải
HẾT trên HEAD) lộ một lỗ **cùng lớp MỌI-LỐI-QUA-CHỐT**: `how many minutes`
còn 3 bản trên HEAD. Một là `acceptance-init` (ngoài phạm vi, khác nghĩa —
`baseline_minutes` của repo, không phải phút một cổng, giữ nguyên); hai bản
kia là **skill acceptance của cả hai harness** — chúng dạy bước Cổng 1 và vẫn
hỏi phút cho ĐÚNG trường ghi mà 6 lệnh vừa thôi hỏi. Đây là lối thứ hai dẫn
tới cùng một trường: vá 6 lệnh mà bỏ lối này thì lời hứa "không bao giờ bị
hỏi phút nữa" sai ngay ở đường đi phổ biến nhất. Xử: sửa cả hai + MUT-15
(chèn-lại trên bản đọc giả lập) → đỏ đích danh. **Việc này vượt danh sách
vật-giao đã khai ở Cổng 1** — trình owner xác nhận một chạm ở Cổng 2.

## Hai chỗ critic kết luận KÍN (không bịa lỗ)

- **AC-6/E6 (mirror)**: `sync-plugin-packages.sh --check` là lệnh riêng, so
  byte-equal hai phía, không dựa mã thoát của suite khác.
- **AC-5 chân (b)**: sáu khối rút qua marker; base lấy bằng `git show`, HEAD
  lấy từ cây; rút được RỖNG thì kêu to "không thể kết luận" (chặn lớp
  marker-đổi-tên-thành-xanh-câm); đường dẫn suy từ vị trí script.
