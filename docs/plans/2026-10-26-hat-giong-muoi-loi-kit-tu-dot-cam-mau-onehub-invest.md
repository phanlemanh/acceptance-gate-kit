# Hạt giống — mười lỗi kit từ đợt Điều phối – Thợ `dieu-phoi-dot0-cam-mau` của onehub-invest (kit 2.32–2.34, 23–26/10)

**Ngày:** 2026-10-26 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Loại:** TRỪ trước (sửa lỗ của bộ máy đang có);
riêng mục 5 có một nửa CỘNG (hai lệnh con mới của `hang`) — cần chủ kho phê ở Cổng Phạm vi của vòng nào nhận nó.
Gốc: onehub-invest `.acceptance-runs/dieu-phoi-dot0-cam-mau/` — đợt thật thứ hai của Điều phối – Thợ (năm dãy song
song, khoảng 30 PR gộp 25–26/10), tệp `loi-kit-2-34-0.md` (ghi chú của phiên nâng kit 2.34.0, onehub-invest PR #107).
Luật kho onehub-invest: lỗi kit gửi cho kit, không vá tại chỗ. Ba mục đã gửi trước qua kit #403 (23/10).
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

Đây là đầu vào thứ hai của mốc lộ trình kit **«Tinh chỉnh sau hai đợt thử» (05/11)**, cùng hạt giống
`2026-10-20-hat-giong-nam-loi-kit-tu-dot-lo-trinh-tin-hieu.md` (đợt thử thứ nhất, crm). Bốn lỗi có hạt giống từ trước
và đợt này là lần vấp thứ hai — ba trong số đó nay ĐỦ NGƯỠNG mở hàng (bảng dưới). Số «gần như mỗi lần gộp» và «khoảng
30 PR» là số của giám sát đợt, chưa đo lại ở đây; kho tiêu thụ không được chạm từ phiên kit.

Mỗi mục đã đối chiếu trên `main` = `45e9f2cf` (sau thẻ v2.34.0). «Tái hiện» = chạy hàm thật hoặc lệnh thật ở đây;
«đọc mã» = chỉ lần theo mã, chưa dựng đợt.

## Bảng xếp hạng

| # | Lỗi | Mức | Đối chiếu ở đây | Đã có ở kit | Ngưỡng |
|---|-----|-----|-----------------|-------------|--------|
| 1 | Tệp sinh `LO-TRINH.html` / `PRODUCT-MAP.md` xung đột mỗi lần nhánh chính dời | Cao | đọc mã | hạt giống 16/10 | **ĐỦ** (kho thứ hai) |
| 2 | Đánh thức báo «giám sát không có nhịp sống» khi giám sát đang chạy | Cao | đọc mã, `danh-thuc.mjs` không đổi từ 11/10 | hạt giống 20/10 mục 1 · kit #403 | **ĐỦ** (đợt thử thứ hai vấp lại) |
| 3 | `xin s4` ghi slug của hàng kế, không phải hàng đang chấm | Trung bình–cao | đọc mã | mới | mới — có neo |
| 4 | Chân `cong_cu` của đường nền đỏ oan trên khoá là đường tệp `.js` | Trung bình | **tái hiện** | kit #403 mục 2 | có neo |
| 5 | CLI `hang` thiếu bỏ nghỉ dãy và đặt `uu_tien` | Trung bình | đọc mã | mới | mới — có neo |
| 6 | `hang them <mã>` không tra lộ trình; slug dài bị cắt còn 6 từ | Trung bình | **tái hiện** | mới | mới — có neo |
| 7 | Cài từ chợ ra đỉnh `main` đã quá thẻ cùng số → `kiem-ban-cai --may` ĐỎ | Trung bình | **tái hiện** (`v2.34.0..main` lệch 3 tệp) | ký ức máy 13/10, chưa có hạt giống | mới — có neo |
| 8 | `kiem-ban-cai` khuyên «cài lại ở project <cây phụ>» mà lệnh từ cây phụ chỉ nâng bản ghi gốc | Trung bình | đọc mã | hạt giống 17/10 | **ĐỦ** (lần nhận kit kế lại vấp) |
| 9 | Hook `chan-s4` chặn lệnh có heredoc nhắc tên script đo | Thấp | **tái hiện** | giới hạn đã khai, hạt giống DP6 11/10 | chưa — đếm 3/10 |
| 10 | Ghi chú nhận 2.34.0 ghi invest «đang ở 2.9.0» | Thấp | đọc tài liệu | — | sửa ngay trong PR này |

Mức xếp theo North Star: lượt gọi người ngoài thiết kế và giờ máy trên đoạn ký → gộp trước, rồi tới việc tay.

---

## 1. Tệp sinh xung đột ở mọi lần nhánh chính dời — kho thứ hai

**Người dùng gặp gì.** Ở onehub-invest, gần như mỗi lần gộp đều xung đột ở `LO-TRINH.html` hoặc `PRODUCT-MAP.md`, nên
hồ sơ phải ghim lại liên tục (giám sát đợt ghi; chưa đo lại ở đây).

**Đối chiếu.** Gốc và đề xuất y như `docs/plans/2026-10-16-hat-giong-tep-sinh-xung-dot-moi-lan-goi.md`: tệp sinh trọn từ
nguồn được commit trong PR, `--check` ở CI đòi khớp trên đỉnh PR, nên hai PR sửa hai nguồn khác nhau vẫn đụng nhau ở tệp
sinh. 2.34.0 không đổi gì ở lớp này (chỉ sửa việc bản `product-map.mjs` của plugin khác bản kho).

**Ngưỡng.** Hạt giống 16/10 mở thành việc khi «≥ 2 kho tiêu thụ ghi được ≥ 3 lần gộp lại vì tệp sinh trong một ngày».
crm 16/10 là kho thứ nhất; onehub-invest 25–26/10 là kho thứ hai → **đủ**. Nối thêm số đếm chính xác của onehub-invest
vào đây khi giám sát đợt gửi.

**Cách né tạm cho kho.** Đề xuất (1) của hạt giống 16/10 làm được ở kho mà không chờ kit: `.gitattributes` khai
`PRODUCT-MAP.md merge=ours` và `LO-TRINH.html merge=ours`, `git config merge.ours.driver true` trên máy gộp, rồi sau mỗi
lần gộp nhánh chính chạy lại `product-map.mjs` để sinh lại hai tệp. `--check` ở CI vẫn bắt bản vẽ sai nếu quên sinh lại.
Đây là cấu hình kho, không sửa kit.

---

## 2. Đánh thức báo «giám sát không có nhịp sống» giả — đợt thứ hai vấp lại

**Người dùng gặp gì.** Gần như mỗi lần lịch 30′ chạy, `danh-thuc` trả `bao-chu-kho` «giám sát không có nhịp sống» dù
giám sát đang làm việc; hook phiên không bắn trong phiên giám sát.

**Đối chiếu.** `dieu-phoi/scripts/danh-thuc.mjs` không đổi từ 11/10 (`git log`), vẫn đọc
`song/<vai.giam_sat.phien>.json`. Hai gốc đã ghi, cả hai còn nguyên:
(a) mã phiên app (`local_<uuid>`, do lời dặn của `tiep-tuc`/`mo-dot`) khác mã phiên CLI mà `hook-nhip.mjs` dùng đặt tên
tệp nhịp — hạt giống 20/10 mục 1; (b) phiên giám sát mở TRƯỚC khi gói được cài hay nâng thì hook của gói không nạp vào
phiên đó, nên không có tệp nhịp nào — kit #403 phần «kèm theo».

**Ngưỡng.** Hạt giống 20/10 mở hàng «khi đợt thử thứ hai vấp lại một trong bốn lỗ» → **đủ**.

**Cách né tạm cho kho.** (i) Giám sát nhận lại vai bằng mã CLI: `dieu-phoi.mjs tiep-tuc --phien <mã CLI> --json` (mã
CLI là tên tệp trong `song/`, hoặc tên thư mục scratchpad của phiên); (ii) sau mỗi lần cài hay nâng gói, mở phiên giám
sát MỚI để hook nạp. Giá của (i): lối `nhan-giam-sat` nhắn bằng mã CLI có thể không tới — khi đó đọc `bao-chu-kho` của
lịch 30′ là «kiểm giám sát», không phải «giám sát chết».

---

## 3. `xin s4` ghi slug của hàng KẾ, không phải hàng đang chấm

**Người dùng gặp gì.** Khoá `khoa/s4/chu.json` mang slug của hàng kế tiếp trong dãy thay vì hàng đang chấm; mọi thứ đọc
khoá (thẻ trạng thái, sổ sự kiện, đếm giờ máy theo hàng) gán lượt chấm cho sai hàng.

**Gốc trong mã.** `ghiDon` (`dieu-phoi/scripts/ghi.mjs:41`) lấy `slug ?? slugKeCua(...)`; `slugKeCua` (`ghi.mjs:35`) đọc
`tiep/<dãy>.json` — hàng mà bộ phát lịch muốn dãy làm KẾ. `chonHangKe` (`lich.mjs:56`) chỉ giữ hàng ở `dang`; hồ sơ trong
worktree vừa sang trạng thái đã thông (`tienDoCua`, `phat-lich.mjs:351` → `ky`) là bộ phát lịch chuyển sang hàng sau. Từ
đó mọi lượt S4 tiếp theo của chính hàng đó — ghim lại sau khi gộp nhánh chính, chấm lại sau dừng-vá — xin khoá dưới tên
hàng sau. Ca này chồng lên mục 1: mỗi lần tệp sinh làm phải ghim lại là một lần khoá ghi sai hàng.

**Cách né tạm cho kho.** Luôn truyền slug: `dieu-phoi.mjs xin s4 --slug <slug đang chấm>` (lời ghi chú của phiên nâng kit
đã dùng).

**Đề xuất.** Thứ tự nguồn slug của đơn: `--slug` → hồ sơ trong worktree của dãy đang ở trạng thái chấm được (đúng một
`_acceptance/<slug>/contract.md` ở `implemented`/`verified` có thay đổi so với nhánh chính) → `tiep/`. Nhiều ứng viên thì
từ chối và in tên các ứng viên, không đoán. Chiều đỏ: ca dãy có hàng A đã `ky` trong worktree và `tiep` trỏ B, `xin s4`
không cờ → đơn mang A; đối chứng: chỉ B có hồ sơ đang làm → đơn mang B như cũ.

**Kho không có sự cố được gì, mất gì.** Kho luôn truyền `--slug`: không đổi. Mất: không có — đơn sai hàng hôm nay không
có ai dựa vào.

---

## 4. Chân `cong_cu` của đường nền đỏ oan trên khoá là đường tệp

**Người dùng gặp gì.** Chân `cong_cu` của `duong-nen` đỏ («THIẾU») ở mọi dãy dù `design-scan.js` có trên đĩa.

**Tái hiện.** `duong-nen.mjs` (khối «chân cong_cu», quanh dòng 263) chạy `command -v` lên TỪ ĐẦU của mọi khoá executor,
chỉ bỏ qua từ đầu mang cú pháp shell (`tenChuongTrinh`, `${…}` `$(…)`). Khuôn kit của `executors.design.ui_check` là một
ĐƯỜNG TỆP `.js` (`commands/acceptance-init.md:72`, `skills/acceptance/references/design-ui-check.md:115`) — một tay cầm
cho bộ kiểm giao diện, không phải chương trình. Chạy ở đây:
`bash -c 'command -v "$1"' _ "$PWD/scripts/design-scan.js"` → thoát 1 (tệp `-rw-r--r--`). Kho để khoá ở dạng khuôn
`${CLAUDE_PLUGIN_ROOT}/…` thì thoát nạn nhờ luật bỏ qua; kho để đường tệp thật (onehub-invest ghim đường tuyệt
đối `…/acceptance-gate/2.32.0/scripts/design-scan.js`, kit #403) thì đỏ — và đường ghim theo số còn mất hẳn khi bộ đệm
bản cũ bị gỡ.

**Cách né tạm cho kho.** Trả khoá về đúng khuôn `acceptance-init`: `ui_check: "${CLAUDE_PLUGIN_ROOT}/scripts/design-scan.js"`.
Đường nền in một dòng `cong-cu: bo qua executors.design.ui_check …` ở stderr thay vì đỏ, và khoá không gãy khi nâng bản.

**Đề xuất.** Từ đầu là đường tệp kịch bản (`/` hoặc đuôi `.js`/`.mjs`/`.cjs`) thì chân `cong_cu` xét TỒN TẠI của tệp
(`fs.existsSync` sau khi giải `${CLAUDE_PLUGIN_ROOT}` nếu biết), không xét quyền chạy; đỏ chỉ khi tệp vắng — đúng câu hỏi
«công cụ có trên máy không». Chiều đỏ: khoá trỏ tệp `.js` không quyền chạy có thật → xanh; đối chứng: khoá trỏ tệp vắng →
đỏ ghim đúng tên; `khong-co-lenh | head` vẫn đỏ (ca NEN-TD2 giữ nguyên).

**Kho không có sự cố được gì, mất gì.** Kho dùng dạng `${…}`: không đổi. Mất: không có.

---

## 5. CLI `hang` thiếu lệnh bỏ nghỉ dãy và lệnh đặt `uu_tien`

**Người dùng gặp gì.** Giám sát phải sửa tay `hang-viec.json` trong `voiKhoaHangViec` để cho một dãy đã nghỉ chạy lại, và
để đặt thứ tự hàng tuyệt đối — lệnh tay trên tệp mà `hang.mjs` tự nhận là «bên viết duy nhất».

**Gốc trong mã.** `dieu-phoi.mjs:310–314` chỉ có `day-len` · `them` · `nghi`. `choNghi` (`hang.mjs:87`) đặt `nghi: true` mà
không có lệnh ngược; `dayLen` chỉ đặt `uu_tien` TƯƠNG ĐỐI (một bậc trên hàng khác) và không làm gì nếu hàng đã đứng trước.

**Cách né tạm cho kho.** Sửa `hang-viec.json` trong khoá như đang làm, và ghi một dòng Nhật ký tay — đường đảo là dòng
Nhật ký đó. Thứ tự tuyệt đối làm được bằng chuỗi `hang day-len <mã> --truoc <mã>`.

**Đề xuất.** `hang chay-lai <dãy>` (ngược của `nghi`, cùng khuôn: một dòng Nhật ký + một sự kiện `doi-ke-hoach`, chạy lại
là không làm gì) và `hang uu-tien <mã> <số>`. Phần `chay-lai` là TRỪ (lấp chiều ngược của lệnh đã có); phần `uu-tien` là
CỘNG — cần chủ kho phê.

---

## 6. `hang them <mã>` không tra lộ trình; slug dài bị cắt

**Người dùng gặp gì.** `hang them F12 --day P2` thêm một hàng slug `f12` (không có hồ sơ nào mang tên đó, nên hàng không
bao giờ «xong»); `hang them <slug dài hơn sáu từ>` thêm một hàng slug bị cắt.

**Tái hiện.** `themHangTrongKhoa` (`hang.mjs:66`) chỉ tra `hang-viec.json`; không thấy thì `suySlug(khoa)`. `suySlug`
(`nguon-hang.mjs:11`, bản chép của `scripts/lo-trinh.mjs:1102`) là luật suy slug từ CÂU GIAO — viết thường, giữ 6 từ —
không phải luật nhận một mã hay một slug có sẵn. Chạy ở đây: `suySlug('F12')` → `f12`;
`suySlug('ghi-nhan-lo-trinh-tu-dong-cho-moi-day-viec')` → `ghi-nhan-lo-trinh-tu-dong`. Hàng mới cũng không mang `ma`.

**Cách né tạm cho kho.** Truyền đúng slug của hàng lộ trình thay vì mã, khi slug ≤ 6 từ. Slug dài hơn: sửa tay
`hang-viec.json` trong khoá (thêm `{slug, ma, day}` đúng lộ trình).

**Đề xuất.** `themHang` tra theo thứ tự: `hang-viec.json` → tệp lộ trình qua `docHangLoTrinh` với nguồn của đợt (lấy
`slug` + `ma` của hàng) → nếu đối số đã có dạng slug (`^[a-z0-9]+(-[a-z0-9]+)*$`) thì giữ nguyên → chỉ khi là câu mới
`suySlug`. Chiều đỏ: ca lộ trình có hàng `F12` slug bảy từ → hàng thêm mang đúng slug và `ma: F12`; đối chứng: câu tự do →
slug suy như cũ.

---

## 7. Cài từ chợ ra đỉnh `main` đã quá thẻ cùng số — `kiem-ban-cai --may` ĐỎ

**Người dùng gặp gì.** Kit dặn «cài lại gói theo đúng thẻ `v2.34.0`», nhưng cập nhật chợ kéo đỉnh `main`; sau thẻ, `main`
đã có thêm commit cùng số 2.34.0, nên bộ đệm cài khác thẻ và `kiem-ban-cai --may --ref v2.34.0` ĐỎ. Bản clone chợ dựng
lại không có thẻ, nên `--root <thư mục chợ>` báo «ref không có».

**Tái hiện.** `git diff --stat v2.34.0 origin/main` ở đây: `LO-TRINH.html`, `_acceptance/release-2-34-0/kiem-ban-cai-sau-tag.txt`,
`docs/plans/lo-trinh-kit.json` — đúng ba tệp, đều nằm trong gốc gói `acceptance-gate` (gốc kho). Cả ba đến từ PR #412,
tức chính commit ghi kết quả kiểm bản cài sau thẻ làm `main` lệch thẻ. Lớp này đã gặp 13/10 (v2.28.0, lệch 22 mục) và
máy kit có thủ tục tay (ký ức máy, `rsync` bộ đệm từ `git archive <thẻ>`), nhưng chưa có hạt giống nào.

**Cách né tạm cho kho.** Lệch chỉ ở ba tệp không phải mã chạy (tài liệu, hồ sơ mốc, lộ trình kit) — đọc ĐỎ này là «lệch
tài liệu sau thẻ», không phải «cài sai mã». Muốn ĐẠT thật: `git -C <bản clone kit> fetch --tags`, rồi chạy
`kiem-ban-cai --may --ref v2.34.0 --root <bản clone kit có thẻ>` (đừng trỏ `--root` vào thư mục chợ).

**Đề xuất (chọn ở vòng, không ở đây).** Đúng tầng là bản cài khớp thẻ ngay từ chợ — ví dụ commit sau thẻ của một mốc
không chạm gốc gói, hoặc chợ trỏ ref thẻ. Bộ đọc khoan dung nếu không làm được: `kiem-ban-cai` tách lệch «chỉ tệp không
chạy» (`docs/`, `_acceptance/`, `LO-TRINH.html`) thành VÀNG có tên, ĐỎ chỉ khi lệch mã; và khi `--root` không có thẻ thì
in lệnh `git fetch --tags` thay cho «ref không có».

---

## 8. `kiem-ban-cai` khuyên cài lại ở cây phụ — lệnh từ cây phụ không làm được

**Đối chiếu.** Cùng lỗ với `docs/plans/2026-10-17-hat-giong-cap-nhat-plugin-cay-phu-nham-ban-ghi-goc.md`: lệnh cập nhật
plugin phạm vi dự án gọi từ một worktree chỉ nâng bản ghi của checkout gốc. onehub-invest 25/10: bản ghi theo worktree
vẫn 2.33.1 sau khi nâng; lời khuyên in ra («cài lại ở project <worktree>») không chạy được — đúng đề xuất (1) của hạt
giống 17/10 («in lệnh sửa chạy được cho đúng bản ghi đó»).

**Ngưỡng.** «Lần nhận kit kế tiếp ở bất kỳ kho nào lại phải chép tay sổ cài» → **đủ**.

**Cách né tạm cho kho.** Phiên mở trong worktree nạp gói theo bản ghi của worktree, nên thợ ở cây phụ đang chạy hook
2.33.1. Hai đường: mở phiên mới ở checkout gốc cho việc cần bản mới, hoặc chép tay bốn trường (`installPath`, `version`,
`gitCommitSha`, `lastUpdated`) của bản ghi gốc sang bản ghi worktree trong `~/.claude/plugins/installed_plugins.json` (sao
lưu trước), rồi chạy lại `kiem-ban-cai --may`.

---

## 9. Hook `chan-s4` chặn lệnh có heredoc nhắc tên script đo

**Tái hiện.** `phanLoaiLenh` (`dieu-phoi/scripts/phan-loai-s4.mjs`) quét thân heredoc như dòng lệnh. Chạy ở đây: thân
`- chân cong_cu của duong-nen.mjs đỏ` → `null`; thân `feature-loop/scripts/duong-nen.mjs chạy chân cong_cu` → `duong-nen`
(chặn); thân `lệnh; duong-nen.mjs --root .` → `duong-nen` (chặn). Tức là chặn khi một dòng (hay một đoạn sau `;` `|` `&`
`(`) của thân MỞ ĐẦU bằng đường script.

**Đối chiếu.** Giới hạn đã khai (`phan-loai-s4.mjs` đầu hàm `tachDoan`; hồ sơ `dieu-phoi-lop-mod` lượt 2). Khuôn thay thế
và ngưỡng ở `docs/plans/2026-10-11-hat-giong-lop-mod-ve-sau-dp6.md` («> 10 lời gọi heredoc chặn nhầm» khi đo lại). Đếm:
2 lời gọi đo 11/10 + 1 lần này = 3/10 → **chưa** đủ.

**Cách né tạm cho kho.** Ghi chú bằng công cụ ghi tệp (Write) thay vì `cat <<EOF`; hoặc không để dòng nào của thân mở
đầu bằng đường script (thêm một chữ đứng trước, hay bọc tên tệp trong dấu `` ` ``).

---

## 10. Ghi chú nhận 2.34.0 ghi sai bản xuất phát của invest

`docs/handoff/2026-10-25-nhan-2-34-0-tu-2-9-0.md` viết invest «đang ở 2.9.0». Phiên nâng kit của onehub-invest thấy lớp
chép CI đã ở 2.33.1 và config trỏ bộ đệm 2.32.0. Danh sách việc trong ghi chú là tập trên nên vẫn dùng được, nhưng phần
«nhảy hai mươi lăm mốc» và mục 1.2 làm người nhận đi tìm việc không có. Sửa ngay trong PR mang hạt giống này (`docs/**`
là T1 ở kho kit): một dòng đính chính đầu tệp, giữ nguyên thân.

---

## Ngưỡng mở thành ô / hàng

- **Đủ ngưỡng, có neo:** mục 1, 2, 8 (ngưỡng của hạt giống cũ) · mục 3, 4, 6 (lỗi vật, đợt thật vấp, có lối né) · mục 7
  (lặp lần hai ở hai mốc). Cắt hàng ở mốc «Tinh chỉnh sau hai đợt thử» 05/11, hoặc sớm hơn khi chủ kho gọi tên.
- **Cần chủ kho phê:** nửa `uu-tien` của mục 5 (CỘNG).
- **Chưa:** mục 9 (đếm 3/10).
- **Xong trong PR này:** mục 10.

Gộp đề xuất theo gói, không theo lớp, để một vòng chạm một nơi: mục 2, 3, 5, 6, 9 ở gói `dieu-phoi`; mục 4 ở
`feature-loop`; mục 1, 7, 8 ở lõi `acceptance-gate` (`product-map.mjs`, `kiem-ban-cai.mjs`).

**Người hưởng:** giám sát và thợ của mọi đợt Điều phối – Thợ (mục 2, 3, 5, 6, 9: bớt lượt gọi chủ kho và sửa tay sinh từ
hạ tầng) · mọi kho khai lộ trình có PR song song (mục 1: bớt ghim lại và giờ ký → gộp) · mọi kho nhận kit (mục 4, 7, 8:
bớt ĐỎ oan khi nâng bản).
