# Kế hoạch tái lập đơn giản hoá + triển khai lại cho đội

*2026-08-07 · Owner: Manh Phan · Trạng thái: ĐÃ DUYỆT (quyết trong phiên 07/08).*

## Bối cảnh & quyết định

Kit đạt mục đích gốc (làm cho việc phê duyệt code AI *xảy ra được*) nhưng đã
trôi trục: quá nửa nợ là nợ-của-thước, 29/29 việc đã giao là kit-sửa-kit,
Cổng Giá trị chưa chạy lần nào, và trường số-phút tại cổng đã thoái hoá thành
điền-đại-cho-qua (xem memory `time-human-minutes-khong-dang-tin`). Owner
quyết: **bỏ trục đo thời gian**, chuyển sang ba trục — *chất lượng quyết
định · chỉ những quyết định cần thiết · kết quả code* — và tái lập kit quanh
ba viên ngọc giữ nguyên:

1. **Cổng 1 — duyệt tiêu chí trước khi code** (quyết định đòn bẩy cao nhất).
2. **Bằng chứng không giả được** (run_id máy ghi, verified_commit thật, chữ
   ký người trong commit riêng, CI backstop).
3. **Luật dừng-vá** (hai lần sửa cùng lớp lỗi → dừng, hỏi người).

Ràng buộc mới: **kit đang được triển khai xuống đội** — mọi bước phải bảo vệ
đồng đội khỏi (a) đổi luật dưới chân feature đang giữa vòng, (b) lệch version
giữa các máy (hai version = hai bộ luật cổng).

**Cập nhật sau fetch origin (07/08 tối):** trước khi quyết định tái lập ra
đời, máy khác đã thi hành handoff cũ — `measure-birth-certificate` đang
GIỮA VÒNG (Cổng 1 duyệt, T1–T6 xong, S4 r1 REJECT, fix đã commit, chờ r2 +
ký) và `premerge-ac-line` là draft chờ Cổng 1. Version nguồn đã lên
acceptance-gate 1.39.0 / feature-loop 1.27.0. Kế hoạch dưới đây đã điều
chỉnh theo: thêm GĐ 0.0 (đóng vòng dở), gạch 1e (đã xong trong T1 của
measure-birth-certificate: `docs/research/known-limits-ledger.tsv` — 107
dòng, 14 chết có `closed_by`, 5 trùng có `dup_of`, 88 sống).

## Nguyên tắc thi hành (áp cho MỌI bước bên dưới)

- **Chỉ TRỪ, không CỘNG:** mỗi bước phải gỡ một cơ chế, làm một thứ thành
  tuỳ-chọn, hoặc là quyết định thuần. Bước nào đòi *xây thêm* cơ chế → cắt
  khỏi đợt này (trừ helper ký-gộp, vì nó thay một nghi thức nhiều bước).
- **Không hạ chuẩn bằng chứng nào.** Cắt nghi thức, không cắt xác thực.
- **Phẫu thuật engine đúng MỘT đợt, phạm vi khoá trước, ngân sách ≤2 vòng
  S4.** Quá ngân sách → cắt phạm vi, không chạy thêm vòng.
- **Feature đang giữa vòng ở máy đồng đội chạy tiếp theo luật cũ đến khi ký
  xong.** Bản mới chỉ áp cho vòng mở sau khi update.

---

## GĐ 0 — Đóng băng & thông báo (HÔM NAY)

| # | Việc | Ghi chú |
|---|---|---|
| 0.0 | **Đóng hai vòng đang dở** | (a) `measure-birth-certificate`: chạy nốt S4 r2 + ký — còn đúng 1 vòng, việc nó làm trùng 1e và cấp khuôn cho tương lai; KHÔNG mở rộng phạm vi. (b) `premerge-ac-line` (draft ở Cổng 1): owner quyết duyệt-hay-**xếp-lại-sau** — khuyến nghị xếp lại (nó là việc lab, đúng đối tượng đóng băng) |
| 0.1 | Gửi **thông báo #1** cho đội (mẫu bên dưới) | Chốt: giữ nguyên bản đang cài trên từng máy, KHÔNG chạy plugin update đến khi có thông báo #2; trả lời 3 câu hỏi khảo sát |
| 0.2 | Dòng **đóng băng lab** vào CLAUDE.md | Engine chỉ nhận bugfix + đợt phẫu thuật GĐ1; không mở vòng meta mới (kể cả `measure-birth-certificate`) |
| 0.3 | Kế hoạch này commit vào `docs/plans/` | Là charter tái lập luôn — không viết file thứ hai |

**Mẫu thông báo #1** (owner gửi, chỉnh tuỳ ý):

> Team ơi, kit sắp có bản gọn hơn (bớt nghi thức, giữ nguyên chuẩn bằng
> chứng). Trong lúc chờ: (1) GIỮ NGUYÊN version đang cài, đừng chạy plugin
> update; (2) feature đang giữa vòng cứ chạy tiếp bình thường; (3) trả lời
> giúp 3 câu: ai đang có feature giữa vòng (slug nào)? · ai đang dùng bản
> Codex / design-loop? · repo nào anh em muốn làm thí điểm bản mới?

Lưu ý version: nguồn trên main đã là 1.39.0/1.27.0 (vòng
measure-birth-certificate bump giữa chừng) — marketplace trỏ thẳng repo, nên
"đừng update" là mệnh lệnh quan trọng nhất của thông báo #1: update lúc này
sẽ kéo bản giữa-vòng chưa qua GĐ2.

**Ba câu hỏi khảo sát đó quyết định:** lịch GĐ3 (chờ ai ký xong), và số phận
Codex edition + design-loop ở GĐ4 (usage = 0 → mothball).

## GĐ 1 — Phẫu thuật engine MỘT đợt (2–4 ngày, phạm vi KHOÁ)

Chạy qua feature-loop như một vòng bình thường (một slug, ví dụ
`tai-lap-ceremony-diet`), ngân sách ≤2 vòng S4, ký known-limits thoải mái
theo luật triage.

**Trong phạm vi (toàn subtraction):**

- **1a. `time_human_minutes` → tuỳ chọn.** Template contract bỏ trường bắt
  buộc; skill approve/signoff không hỏi; `/acceptance-report` (i) dán nhãn
  dữ liệu cũ *"tự khai — không đáng tin"*, (ii) đổi KPI phía người sang
  **tần suất sự-kiện-cần-người** đếm từ git.
- **1b. Helper ký-gộp một lệnh.** Stage sẵn đúng các trường người của nhiều
  hồ sơ chờ ký, người đọc thẻ rồi commit MỘT lần/lô. Giữ nguyên
  `require_human_commit` — commit vẫn của người, git vẫn làm chứng.
- **1c. `CHANGELOG.md` ra đời + bump version 2.0.0** (cả acceptance-gate lẫn
  feature-loop; nguồn hiện ở 1.39.0/1.27.0). Version đổi thật để né bug
  "plugin update bỏ qua khi số trùng". Từ nay mọi release có changelog
  mặt-người: đổi gì, ai bị ảnh hưởng.
- **1d. Re-pin theo release** (chính sách, ghi vào GUIDE + CLAUDE.md): merge
  chạm engine gom về mốc release; re-pin chạy một chiến dịch mỗi release,
  không mỗi merge.
- ~~**1e. Gạch nợ chết sổ known-limits**~~ — **ĐÃ XONG** trong T1 của
  `measure-birth-certificate` (`docs/research/known-limits-ledger.tsv`: 107
  dòng, 14 chết `closed_by` · 5 trùng `dup_of` · 88 sống). Không làm lại.

**NGOÀI phạm vi (cấm chen vào đợt này):** cổng-theo-rủi-ro tự-qua · thẻ
vật-trước · xoá/mothball Codex, design-loop · mở lại lab
(`measure-birth-certificate`) · mọi phép đo mới không phục vụ 1a–1e.

**Nghiệm thu GĐ1:** suite xanh + pre-merge clean + một lượt giả-lập consumer
(cài plugin 2.0.0 từ checkout vào một repo nháp, chạy acceptance-init →
contract → card) — vì bản này sẽ phát cho đội, không chỉ cho xưởng.

## GĐ 2 — Thử trên việc THẬT trước khi phát cho đội (3–5 ngày)

- Chạy **2–3 feature thật** trong repo tiêu thụ của Manh (repo thí điểm từ
  khảo sát 0.1) bằng bản 2.0.0.
- Ghi **sổ vấp** (friction list): mỗi lần khựng, mỗi lần bị gọi vô lý, mỗi
  thông điệp khó hiểu — sổ này là đề bài của GĐ4, không sửa ngay giữa chừng.
- **Chạy Cổng Giá trị lần đầu tiên** (uat-session) trên một thứ đã ship.
- **Ngưỡng phát hành cho đội** (khai trước): 0 lỗi chặn-việc; số lần bị gọi
  ≤ 2/feature (Cổng 1 + ký lô); owner tự chấm "có muốn dùng tiếp tuần sau
  không" = có.

Không đạt ngưỡng → sửa bug (được phép, là bugfix), thử lại. KHÔNG mở rộng
phạm vi.

## GĐ 3 — Triển khai đội (1 buổi + 1 tuần theo dõi)

| # | Việc | Ghi chú |
|---|---|---|
| 3.1 | **Thông báo #2** kèm CHANGELOG | Nói bằng tiếng người: *bỏ điền phút · ký gộp một lệnh · ít bị gọi hơn · chuẩn bằng chứng giữ nguyên 100%* |
| 3.2 | Hướng dẫn update | `claude plugin update` (version đã đổi thật nên update ăn); nghi ngờ thì uninstall+install; kiểm bằng version in ra |
| 3.3 | Luật chuyển tiếp | Feature giữa vòng: ký nốt theo luật cũ rồi mới update máy đó. Vòng mới: mở trên 2.0.0 |
| 3.4 | Kênh hứng vấp 1 tuần | Mỗi vấp của đồng đội ghi thẳng vào sổ vấp chung — KHÔNG hotfix engine từng cái trừ khi chặn-việc |
| 3.5 | Chốt baseline 3 số | (i) người-lật-máy (gold set) · (ii) sự-kiện-cần-người/feature (git) · (iii) feature qua Cổng Giá trị — đọc 30 giây, KHÔNG gắn răng cưỡng chế trong ≥3 tháng |

## GĐ 4 — Quyết các món lớn BẰNG BẰNG CHỨNG (sau ≥3 feature đội chạy thật)

Đọc sổ vấp + 3 số baseline, rồi quyết từng món:

- **Cổng 2 theo rủi ro** (PASS sạch + T2 + không nhạy cảm → tự qua, người
  lấy mẫu qua `/start`): chỉ làm nếu số lấy-mẫu-lật ≈ 0 trên các lô đã ký.
- **Thẻ vật-trước** (card mở đầu bằng sản phẩm chạy): phạm vi lấy từ sổ vấp.
- **Mothball Codex edition / design-loop** nếu khảo sát + 1 tháng usage = 0
  — đây là nước "bớt đồ" thật sự (giảm ~1/2 bề mặt bảo trì).
- **Mở lại lab** (khuôn viết phép đo) CHỈ khi một consumer thật đòi một phép
  đo mới — không mở vì xưởng muốn.

## Rủi ro & chốt chặn

| Rủi ro | Chốt |
|---|---|
| GĐ1 phình to (bệnh cũ: sửa-để-gọn hoá thành xây-thêm) | Phạm vi khoá trong file này; ngân sách 2 vòng S4; quá → cắt 1d/1e sang sau, KHÔNG thêm vòng |
| Đồng đội lỡ update giữa chừng | Thông báo #1 gửi HÔM NAY, trước mọi thay đổi |
| Bản mới hỏng ở repo đội | GĐ2 chặn bằng ngưỡng khai trước; rollback = cài lại 1.38.0/1.26.0 (tag giữ nguyên) |
| Lấy mẫu / sổ vấp chết âm thầm | Treo vào thói quen sẵn có (`/start` trình 1 hồ sơ; sổ vấp là 1 file chung), không treo vào lịch |
| Lab mở lại vì quán tính | Dòng đóng băng trong CLAUDE.md + mục NGOÀI-phạm-vi ở GĐ1 |

## Việc chờ input (không chặn GĐ0–GĐ1)

- 3 câu trả lời khảo sát từ đội (0.1) → lịch GĐ3 + số phận Codex/design-loop.
- Chọn repo thí điểm GĐ2.
