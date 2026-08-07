# Handoff 2026-08-07 (bản 2 — TÁI LẬP) — đổi máy/tài khoản, tiếp tục không mất context

> Người nhận: phiên Claude Code trên máy/tài khoản bất kỳ (repo clone từ
> origin/main). Memory phiên là của-từng-máy, KHÔNG đi theo git — file này
> tự đủ.
>
> ⚠️ **File này THAY THẾ handoff cùng ngày**
> `2026-08-07-handoff-khuon-viet-phep-do.md`. LƯU Ý: handoff cũ đó **đã được
> máy A thi hành TRƯỚC khi có quyết định tái lập** — `measure-birth-certificate`
> hiện GIỮA VÒNG (Cổng 1 duyệt, T1–T6 xong, S4 r1 REJECT, fix đã commit,
> chờ r2 + ký) và `premerge-ac-line` là draft chờ Cổng 1. Việc ĐẦU TIÊN của
> phiên kế tiếp là đóng hai vòng dở này theo GĐ 0.0 (mục 4) — sau đó lệnh
> đóng băng mới có hiệu lực trọn vẹn. KHÔNG mở bước (b) của handoff cũ.

## 1 · Chuyện gì đã xảy ra trong phiên 07/08 (chiều)

Owner yêu cầu phân tích ưu/nhược kit từ first principles. Chuỗi phát hiện,
theo thứ tự, mỗi phát hiện đều đã kiểm bằng vật trong kho:

1. **Ưu:** lõi cưỡng chế 3 lớp không-giả-được (hook + pre-merge +
   recheck, chữ ký người commit riêng) là tài sản thật và RẺ khi vận hành;
   Cổng 1 duyệt-tiêu-chí-trước-code là quyết định đòn bẩy cao nhất;
   dogfood ở mức strict.
2. **Nhược:** quá nửa sổ 108 known-limits là **nợ-của-thước**; 485 mục
   re-pin; suite plugins ~25 phút; bus factor = 1; **0 điểm dữ liệu từ repo
   tiêu thụ**; không có CHANGELOG.
3. **Thú nhận của owner (dữ liệu quan trọng nhất):** trường
   `time_human_minutes` tại các cổng lâu nay **điền đại cho qua** vì quá mệt
   với vòng lặp → dữ liệu "5–10 phút/cổng" trên 29 hồ sơ KHÔNG đáng tin;
   **gate-fatigue là ràng buộc số 1** của toàn hệ. Đừng bao giờ trích số đó
   làm bằng chứng hiệu quả nữa.
4. **Sự thật nền đọc từ PRODUCT-MAP:** 29/29 việc đã giao đều là
   kit-sửa-kit; **Cổng Giá trị (uat-session) chưa từng chạy một lần**. Owner
   tìm lại niềm vui khi làm repo KHÔNG-kit (nhanh, ra sản phẩm chạy thật) —
   tín hiệu này được đối xử như dữ liệu, không phải cảm xúc.
5. **Quyết định TÁI LẬP (owner duyệt trong phiên):** chi tiết ở mục 3.
6. **Ràng buộc mới lộ ra cuối phiên:** kit **đang triển khai xuống đội** —
   mọi bước phải bảo vệ đồng đội khỏi đổi-luật-giữa-vòng và lệch version.

## 2 · Trạng thái kho lúc bàn giao

- Nhánh `main`. Ba file của phiên này đã commit + push (xem
  `git log --oneline -3` sau khi pull):
  - `docs/plans/2026-08-07-tai-lap-don-gian-va-trien-khai-doi.md` — **kế
    hoạch 5 giai đoạn ĐÃ DUYỆT, kiêm charter tái lập** (nguồn sự thật số 1
    của mọi việc kế tiếp).
  - `CLAUDE.md` — mục **ĐÓNG BĂNG LAB** đứng đầu file.
  - File handoff này.
- Bản nguồn trên main: acceptance-gate **1.39.0** · feature-loop **1.27.0**
  (bump giữa vòng measure-birth-certificate — CHƯA phải bản phát hành cho
  đội; đội GIỮ NGUYÊN bản đang cài đến thông báo #2, vì marketplace trỏ
  thẳng repo nên update lúc này kéo bản giữa-vòng).
- Xưởng: 29 việc signed-off + **2 vòng ĐANG MỞ**:
  `measure-birth-certificate` (implemented, giữa S4 — xem cảnh báo đầu file)
  và `premerge-ac-line` (draft, chờ Cổng 1). Re-pin mới nhất: #13
  `repin-20260807-premerge-ac-line-lane1 @ ad46195`.
- Sổ known-limits đã có vòng đời: `docs/research/known-limits-ledger.tsv`
  (107 dòng — 14 chết `closed_by` · 5 trùng `dup_of` · 88 sống) — việc 1e
  của GĐ1 coi như XONG, đừng làm lại.
- Máy cũ còn 1 file local sửa dở KHÔNG commit:
  `docs/handoff/2026-08-04-buc-tranh-tong-the.html` (không thuộc bàn giao,
  không theo sang máy mới — chấp nhận mất nếu đổi máy).

## 3 · Bộ quyết định đã chốt (đừng lật lại nếu không có lý do MỚI)

**Bỏ:** trục đo thời gian. `time_human_minutes` sẽ thành tuỳ chọn (GĐ1);
số cũ dán nhãn "tự khai — không đáng tin"; KPI phía người đổi sang **tần
suất sự-kiện-cần-người** đếm từ git.

**Ba trục mới:** chất lượng quyết định (đo bằng gold set người-lật-máy) ·
chỉ quyết định cần thiết (phép thử: đắt-nếu-sai × khó-đảo × máy-không-chắc)
· kết quả code (đo ở repo tiêu thụ + Cổng Giá trị).

**Ba viên ngọc giữ nguyên 100%:** Cổng 1 duyệt tiêu chí trước code · bằng
chứng không-giả-được (giữ nguyên mọi chuẩn xác thực) · luật dừng-vá.

**Phép thử áp cho mọi bước cải tổ:** *chỉ TRỪ cơ chế hoặc quyết định thuần —
không CỘNG cơ chế mới* (ngoại lệ duy nhất đã duyệt: helper ký-gộp, vì nó
thay một nghi thức nhiều bước). Mọi lần hy-vọng-rồi-thất-vọng trước đây đều
vi phạm phép thử này (xây thêm để bớt đi).

**Đóng băng lab:** engine chỉ nhận bugfix + đợt phẫu thuật GĐ1, cho đến khi
≥3 feature thật ở repo tiêu thụ đi trọn vòng trên bản mới. Đã ghi vào
CLAUDE.md — cấu trúc canh, không phải trí nhớ canh.

## 4 · Kế hoạch 5 giai đoạn — trạng thái từng cái

Chi tiết đầy đủ trong file plan; đây là trạng thái để tiếp tục:

| GĐ | Nội dung | Trạng thái lúc bàn giao |
|---|---|---|
| 0.0 | **Đóng 2 vòng dở**: (a) `measure-birth-certificate` chạy nốt S4 r2 + ký (còn đúng 1 vòng; KHÔNG mở rộng phạm vi) · (b) `premerge-ac-line` đứng ở Cổng 1 — owner quyết duyệt-hay-xếp-lại, khuyến nghị XẾP LẠI (việc lab, đúng đối tượng đóng băng) | **CHƯA** — việc đầu tiên của phiên kế tiếp |
| 0 | Đóng băng + thông báo đội + charter | Plan + CLAUDE.md **XONG** (đã push). Thông báo #1 cho đội: **CHƯA GỬI** (việc của owner — mẫu trong plan §GĐ0). Khảo sát 3 câu (ai giữa vòng · ai dùng Codex/design-loop · repo thí điểm): **CHƯA có trả lời** |
| 1 | Phẫu thuật engine 1 đợt: 1a bỏ-bắt-buộc phút + KPI tần suất · 1b helper ký-gộp · 1c CHANGELOG.md + bump **2.0.0** · 1d re-pin theo release (~~1e~~ đã xong upstream) | **CHƯA MỞ.** Chỉ mở SAU 0.0. Mở bằng `/feature-loop` slug gợi ý `tai-lap-ceremony-diet`. Phạm vi KHOÁ 1a–1d, ngân sách ≤2 vòng S4, quá → cắt 1d, không thêm vòng |
| 2 | 2–3 feature thật ở repo thí điểm + chạy Cổng Giá trị lần đầu; sổ vấp; ngưỡng phát hành khai trước (plan §GĐ2) | Chưa — chờ GĐ1 + trả lời khảo sát |
| 3 | Rollout đội: thông báo #2 + changelog + luật chuyển tiếp (giữa vòng ký nốt theo luật cũ) + 1 tuần hứng vấp + baseline 3 số | Chưa |
| 4 | Quyết bằng bằng chứng: cổng-theo-rủi-ro · thẻ vật-trước · mothball Codex/design-loop nếu usage=0 · mở lại lab chỉ khi consumer đòi | Chưa — TUYỆT ĐỐI không làm trước khi có sổ vấp + 3 số |

## 5 · Sáu điểm mù đã review (chốt chặn kèm theo — đừng dẫm lại)

1. **Cải tổ bị chính bộ máy cũ nghiền** (cách mọi reform trước chết): việc
   thuần-quyết-định làm ngoài vòng; chỉ GĐ1 đi qua feature-loop, một đợt.
2. **"Máy PASS sạch thì tự qua" đứng trên bộ phận yếu nhất (thước)** → bản
   RẺ trước: vẫn ký nhưng ký GỘP theo lô một lệnh; tự-qua thật chỉ quyết ở
   GĐ4 bằng số lấy mẫu.
3. **Đóng băng thua thói quen, không thua lý trí** → đã ghim vào CLAUDE.md;
   bằng chứng sống: handoff cũ đã được thi hành thành vòng
   `measure-birth-certificate` NGAY TRONG NGÀY ra quyết định — đóng nốt nó
   (GĐ 0.0) rồi tuyệt đối không mở vòng lab mới.
4. **Ván chạy thật đầu tiên sẽ xấu** → khai trước là thám hiểm; sổ vấp là đề
   bài GĐ4; đừng chấm cuộc tái lập bằng ván đầu.
5. **Bảng đo mới có thể mọc lại thành bộ máy** → 3 số đọc 30 giây, từ git,
   KHÔNG răng cưỡng chế ≥3 tháng.
6. **Lấy-mẫu-hàng-tuần là nghi thức chết âm thầm** → treo vào `/start` (mỗi
   phiên trình 1 hồ sơ ngẫu nhiên), không treo vào lịch.

Hai amendment cho chẩn đoán: (i) gốc sâu hơn là kit **không có người dùng
thứ hai** — cần lực kiểm bên ngoài VĨNH VIỄN, không phải một lần; (ii)
**kẻ địch đã yếu đi** (model khá lên từ tháng 6) — ngưỡng tier phải co giãn
theo tỉ lệ hỏng THẬT đo bằng lấy mẫu, không theo ký ức tháng 6.

## 6 · Cạm bẫy vận hành (trả giá rồi — carry từ handoff trước, vẫn đúng)

- Sửa 2 file SKILL có mốc `STOP-PATCHING-CLAUSE` (feature-loop + codex) →
  PHẢI chạy lại `node _acceptance/stop-patching-law/make-record.mjs` rồi
  commit 5 file evidence, kẻo suite đỏ với thông điệp chẩn đoán sai.
- Dòng re-pin phải JSON NÉN `separators=(",",":")` + section `### Re-pin
  lần N` + `verified_commit` trỏ sha làn.
- P42/P45 là khối inline — `ONLY_BLOCK` không lọc được, mỗi lần chạy suite
  plugins ăn thêm ~2 lượt suite lồng (~25ph); chạy suite trọn ở nền. (Fix
  nằm trong tinh thần GĐ1/GĐ4 nhưng KHÔNG thuộc phạm vi khoá 1a–1e — đừng
  tự chen vào.)
- Commit chữ ký cổng TÁCH riêng (`signoff.require_human_commit`); `git add`
  đích danh, không bao giờ `-A` (repo self-host từng cuốn nhầm wip).
- Sửa nguồn acceptance-gate xong PHẢI `scripts/sync-plugin-packages.sh` và
  commit mirror cùng lượt (P30 chặn drift).
- Plugin update bỏ qua khi số version trùng mà nội dung đổi — vì vậy GĐ1
  bump 2.0.0 là bắt buộc, và hướng dẫn đội kiểm version sau update.

## 7 · Mở phiên trên máy/tài khoản mới

```bash
git pull && bash scripts/pre-merge-check.sh --base origin/main~1 | tail -1
```

Rồi nói với phiên mới (theo thứ tự trạng thái):

- Vòng dở chưa đóng (mặc định khi nhận bàn giao) →
  *"Đọc docs/handoff/2026-08-07-handoff-tai-lap-va-trien-khai-doi.md rồi làm
  GĐ 0.0: chạy nốt S4 r2 + ký measure-birth-certificate; premerge-ac-line
  trình thẻ Cổng 1 để tôi quyết xếp-lại"*.
- Vòng dở đã đóng, chưa gửi thông báo đội →
  *"Đọc handoff tái lập 07/08 rồi giúp tôi hoàn tất GĐ0"*.
- Đã gửi + sẵn sàng phẫu thuật →
  *"Đọc handoff tái lập 07/08 rồi mở GĐ1: /feature-loop tai-lap-ceremony-diet
  — phạm vi khoá 1a–1d trong docs/plans/2026-08-07-tai-lap-don-gian-va-trien-khai-doi.md"*.

Nếu phiên mới có memory riêng: nên ghi lại 2 fact then chốt trước khi làm —
(1) `time_human_minutes` không đáng tin (điền đại, 07/08) — đừng trích làm
bằng chứng; (2) tái lập đã duyệt + lab đóng băng + phép thử chỉ-TRỪ-không-CỘNG.
