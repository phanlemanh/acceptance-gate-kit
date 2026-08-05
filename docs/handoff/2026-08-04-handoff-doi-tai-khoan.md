# Handoff 04/08/2026 — đổi tài khoản, tiếp tục chiến dịch + vòng ba đang giữa S1

*Người bàn giao: phiên maintainer (Claude, tài khoản cũ) · Người nhận: phiên
maintainer mới sau khi Manh đổi tài khoản. Máy không đổi: repo, worktree,
plugin cache (`~/.claude/plugins`) và trí nhớ dự án vẫn nguyên chỗ cũ.
KHÁC lần trước: trang "bức tranh tổng thể" là artifact thuộc tài khoản cũ —
địa chỉ không mang theo được, file trang kèm ngay cạnh đây để đăng lại.*

---

## 1. Đọc gì trước

| Thứ tự | File | Vì sao |
|---|---|---|
| 1 | `docs/specs/workflow-v2-spec.md` | Nguồn sự thật DUY NHẤT của quy trình |
| 2 | `docs/plans/2026-07-27-discovery-gate0-rollout.md` | Nhật ký chương trình — đọc kỹ hai mục **Bổ sung 2026-08-03** và **2026-08-04** (mọi chuyện hai ngày qua nằm đó) |
| 3 | `docs/plans/2026-07-30-full-run-certification.md` | Chiến dịch chứng chỉ toàn tuyến + số đo |
| 4 | `MEMORY.md` trong trí nhớ dự án | Bài học đã đóng |

Trang tổng thể: `docs/handoff/2026-08-04-buc-tranh-tong-the.html` — đăng
thành artifact MỚI từ tài khoản mới (favicon 🧭, giữ ổn định từ đó về sau),
rồi cập nhật tiếp cùng địa chỉ mới.

## 2. Vai — không đổi

Maintainer = quan sát, đối chiếu độc lập, ghi lỗ vào nhật ký chương trình,
tổng hợp checkpoint; KHÔNG đỡ nội dung phiên chạy vòng. Manh = quyết tại
cổng + phản hồi. Luật ngôn ngữ mặt người áp cho CẢ hội thoại.

## 3. Trạng thái kit (nhánh chính, đã push GitHub)

| Việc | Trạng thái |
|---|---|
| Lệnh vào phiên `/start` | **SHIPPED 1.30.0** (+ vòng lặp 1.21.0) — 2 vòng signed-off 03/08; plugin cache máy này ĐÃ cập nhật, không cần cài lại. Tên ngắn không phân giải thì gõ `/acceptance-gate:start` |
| Nghi thức advisor (tờ khai bối cảnh + hỏi-mở-trước) | Amendment vào F-A (nhật ký 03/08); vòng ba đã chạy bản tay thành công |
| Trục ngữ cảnh bản mẫu (F-I) | Spec đã duyệt hướng: `docs/specs/2026-08-04-context-ladder-design.md` — 6 chỗ đổi, 4 điều KHÔNG đổi, kit giữ thang / repo giữ host. **Chip thi công đã tạo nhưng có thể chết theo tài khoản** → mở lại: phiên mới trên repo kit, `/feature-loop context-ladder — theo docs/specs/2026-08-04-context-ladder-design.md` |
| Lỗ MỞ chưa vá | (1) khuôn mặt-người cho bảng gói duyệt Cổng Phạm-vi (`GATE1-EVAL-MAP`) — vòng vá nhỏ; (2) định tuyến lối (a) của `/start` thiếu đích máy-đọc, hook superpowers đè quy ước (chờ F-A); chi tiết ở nhật ký Bổ sung 03/08 |
| Hàng đợi | F-A (khám phá, ruột advisor) · F-B (bản đồ + thẻ 2 cổng) · F-E/F-F/F-G · F-I |

## 4. Vòng ba Trang Tư Vấn (artifact-platform) — ĐANG GIỮA S1, tiến độ tốt

- **Đã qua**: vào phiên bằng `/start` (lần dùng thật đầu) → grill 04/08 đúng
  nghi thức advisor → hồ sơ cơ hội → phản biện 10 đòn (3 thực chứng) →
  **Cổng Đáng KÝ: build, T3, 30′** → S1: contract draft + design doc +
  design-pass phiên 1 (`material: scaffold`, 6 màn × 2 cỡ, Manh đã chốt).
- **Khung chốt**: bộ công cụ MÔI GIỚI, chuỗi 4 khối, thẻ căn tự sinh ship
  trước; hai bề mặt; lỗi số trên thẻ = chết ngay; hai đồng hồ tách rõ.
- **Quyết định ngữ cảnh (Manh 04/08)**: KHÔNG dựng shell giả — **plugin thật
  ruột tạm trong Creator, sau cờ dev** (nhúng-host-thật); fixture Masteri
  không vào build công khai; AC cửa-vào "kích hoạt từ Creator, render trong
  canvas" phải nằm trong contract.
- **Worktree của phiên vòng ba**: `.claude/worktrees/silly-gould-92578d`
  (nhánh `claude/vibrant-ishizaka-189847`) — MỘT worktree MỘT phiên, chỉ đọc.
- **Kế tiếp**: S1-D tiếp trong host thật + chụp lại ma trận → **Cổng Phạm vi**
  (soi 3 điểm: lát đầu đúng là thẻ-căn · nấc `material`+`context` khai đủ ·
  bảng gói duyệt phải nói tiếng người — Manh có quyền trả) → Cổng Kế hoạch
  (T3) → dựng.
- **Bóng ở sân Manh**: bảng hàng Masteri **hạn 08/08** (chặn bản thăm dò) ·
  môi giới thứ 3 cho phiên nghiệm thu · lịch đã chốt: **anh Tuấn (KN Land) +
  chị My (OneHousing), tuần 11–15/08**.

## 5. Chip vá rò tên khách — ĐÃ CHẠY XONG, CHƯA AI KIỂM

Trang khách công khai `/d/<mã>` phơi tên khách + mối bận tâm ra thẻ chia sẻ
(lỗ sống trên main, phát hiện từ kiểm kê r3 mục T6). Phiên vá đã chạy xong
trong worktree `gifted-grothendieck-b947fa` (artifact-platform) — **việc đầu
tiên của phiên mới: kiểm kết quả** (vá thật chưa, test có đối chứng dương +
ghim chuỗi-cấm chưa, đã merge chưa) rồi thúc qua cổng nếu đạt.

## 6. Việc kế tiếp — theo thứ tự

1. Kiểm kết quả chip vá rò tên khách (§5).
2. Đăng lại trang tổng thể từ tài khoản mới (§1) — cập nhật luôn hiện trạng
   nếu vòng ba đã nhích.
3. Mở lại vòng F-I nếu chip cũ chết (§3).
4. Theo dõi vòng ba tới Cổng Phạm vi; nhắc phiên mở `pilot-journal` đếm
   can-thiệp khi vào vòng LÀM (số đo chiến dịch cần nó, hiện mới có ledger).
5. Nhắc Manh: bảng hàng 08/08 + môi giới thứ 3.

## 7. Cạm bẫy — hai cái cũ, hai cái mới

- **Một worktree một phiên**: cây chung của kit BỊ CÁC PHIÊN KHÁC chuyển
  nhánh bất ngờ (04/08: commit của maintainer rơi vào nhánh `motion-floor`
  của phiên khác). Trước MỌI commit: kiểm `git branch --show-current`; lỡ
  rơi nhầm → cherry-pick qua worktree tạm + `update-ref` trả nhánh nguyên
  trạng, KHÔNG checkout cây chung.
- **Phiên mở trước khi plugin cập nhật chạy bản cũ** — nhớ luật khi có release
  mới: bản cài chỉ áp cho phiên mở SAU đó.

- **"Đã mới nhất" là lời nói dối im lặng khi số không đổi mà nội dung đổi**
  (bắt 05/08). Trình cập nhật khoá theo SỐ phiên bản: số bump từ 13/07, thân
  skill `design-pass` sửa 04/08 dưới cùng số → `plugin update` báo *"already
  at the latest version (1.31.0)"* trong khi bản cài **tụt sau nguồn 34 dòng**
  (200 vs 234) và **thiếu hẳn trục ngữ cảnh 3 nấc**. Kho marketplace clone thì
  tươi — chỉ thư mục cache kẹt. Cả `acceptance-gate` lẫn `feature-loop` cùng
  dính.
  **Phép thử tin được là SO NỘI DUNG, không tin con số:**
  ```
  diff -q skills/design-pass/SKILL.md \
    ~/.claude/plugins/cache/acceptance-gate-kit/acceptance-gate/<V>/skills/design-pass/SKILL.md
  ```
  **Cách chữa:** `plugin update` KHÔNG cứu được — phải
  `claude plugin uninstall <plugin>@acceptance-gate-kit` rồi
  `claude plugin install <plugin>@acceptance-gate-kit`.
  **Khi nào phải nghi:** mọi lần vòng sửa skill mà không bump version (rất hay
  xảy ra vì bump nằm ở task cuối, sửa skill nằm ở task giữa). Sau MỌI đợt ship
  kit: so nội dung ít nhất 1 skill vừa sửa trước khi mở phiên chạy vòng.
- **Artifact theo tài khoản**: đừng hứa "cùng địa chỉ" xuyên tài khoản; file
  nguồn trang phải sống trong repo (đã làm lần này).
- **Nghi thức đã khai tử đừng gợi lại**: mockup ngoài, panel so ảnh, đẩy
  thiết kế ngược, shell-giả-giống-thật (mới thêm 04/08 — gương song song).
