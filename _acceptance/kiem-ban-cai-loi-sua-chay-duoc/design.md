# Thiết kế — kiểm bản cài nói lối sửa chạy được (hàng TC4)

**Ngày:** 2026-10-29 · **Hạng:** T2 · **Vật:** `scripts/kiem-ban-cai.mjs` (chế độ `--may` và bước giải ref) ·
**Ca đo:** `tests/scripts/kiem-ban-cai-loi-sua.test.mjs` (ca `LS-<n>` = AC-n).

## 1. Vấn đề

Lần nhận 2.34.0 của một kho tiêu thụ (25/10, hạt giống `docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md`
mục 7, 8) vấp ba chỗ của lệnh kiểm bản cài ở chế độ máy thật:

1. **Lệch tài liệu đọc thành cài sai mã.** Chợ cài từ đỉnh `main`; sau thẻ, `main` có thêm commit cùng số chỉ đổi ba
   tệp không chạy (`LO-TRINH.html`, một tệp hồ sơ mốc, lộ trình kit). Bộ đệm cài khác thẻ ở đúng ba tệp ấy và
   `--may` báo ĐỎ «khác tag» — giống hệt ca cài thiếu `feature-loop/agents/`.
2. **Bản clone thiếu thẻ chỉ nói «ref không có».** Bản clone chợ không có thẻ; người nhận không biết thẻ có ở remote
   hay không, và lệnh nào lấy được nó.
3. **Lời khuyên cho cây phụ không chạy được.** Lệnh cập nhật plugin gọi từ một worktree chỉ nâng bản ghi của checkout
   gốc (hạt giống `docs/plans/2026-10-17-hat-giong-cap-nhat-plugin-cay-phu-nham-ban-ghi-goc.md`); bản ghi của cây phụ
   giữ số cũ. `--may` in «chưa nâng» hoặc «cài lại ở: project <cây phụ>» — người làm theo thì vẫn y nguyên. Bản ghi trỏ
   thư mục đã xoá lẫn vào cùng khối vàng (17/10: 61 trên 188 dòng vàng).

## 2. Lựa chọn

**L1 — nghiệm cho mục 1 là bộ đọc khoan dung ở `--may`, không phải sửa tầng phát hành.** Hai đường «đúng tầng» của hạt
giống chết vì ràng buộc nêu được: (a) gốc gói `acceptance-gate` là gốc kho (`source: "./"` trong
`.claude-plugin/marketplace.json`), nên MỌI commit sau thẻ đều chạm gốc gói — và bản ghi kết quả kiểm bản cài sau thẻ
theo định nghĩa sinh ra sau thẻ; (b) chợ trỏ ref thẻ hay không do lệnh thêm chợ của kho tiêu thụ quyết — kit chỉ dặn
được bằng lời, mà hiến pháp kho cấm dặn-bằng-lời làm nghiệm. Thứ tự nghiệm của luật 26/09 cho bước kế: bộ đọc khoan
dung + cờ vàng.

**L2 — «tệp không chạy» là đúng ba mẫu của `bat_khi`, tính theo đường từ gốc kho:** `docs/**`, `_acceptance/**`,
`LO-TRINH.html`. Một hằng trong lệnh; ca đo rút danh sách từ hằng ấy (không chép lại). Đo tại chỗ 29/10: không mã chạy
nào của kit (`scripts/`, `lib/`, `hooks/`, `feature-loop/`, `dieu-phoi/`, `commands/`, `skills/`) đọc ba mẫu này từ gốc
gói. Lệch chỉ ở ba mẫu → dòng `VÀNG may:` gọi tên từng tệp, bản ghi vẫn tính ĐẠT. Lệch dù chỉ một tệp ngoài ba mẫu →
`ĐỎ may:` như cũ, danh sách «khác tag» chỉ kể tệp mã; tệp không chạy lệch đi một vế riêng của dòng.

**L3 — khoan dung chỉ ở `--may`.** `bat_khi` nói «sổ cài và bộ đệm». Chế độ kho giả lập cài từ `git archive` của chính
ref, nên ở đó mọi lệch là máy cài làm hỏng tệp — giữ nghiêm (ca KB-4 không đổi).

**L4 — thẻ thiếu: in lệnh lấy thẻ chạy được, vẫn thoát 2.** Ref không giải được, không có dạng sha, và kho có remote →
dòng TỔNG KẾT «KHÔNG CHẠY ĐƯỢC — ref không có: <ref> — bản clone <root> thiếu thẻ; lấy thẻ rồi chạy lại: git -C <root>
fetch --tags <remote>» (`origin` nếu có, không thì remote đầu). Không có remote → nói thẳng không có remote để lấy thẻ
và chỉ trỏ `--root` sang bản checkout có thẻ — không in lệnh không chạy được. Ref dạng sha → câu cũ.

**L5 — nhận cây phụ bằng git, không bằng đường.** Bản ghi phạm vi dự án có `projectPath` là một worktree liên kết khi
`git rev-parse --git-common-dir` khác `--git-dir`; gốc = thư mục cha của common-dir. Đường kiểu
`.claude/worktrees/` chết: `git worktree add` đặt cây phụ ở bất kỳ đâu. Bản ghi của một kho KHÁC, và cây phụ mà gốc không có bản ghi nào của gói (không có
bốn trường để chép), giữ đúng dòng «chưa nâng» cũ — kho nhận kit theo mốc có chủ đích (luật re-pin theo release).

**L6 — lối sửa = một lệnh `node -e` chép bốn trường của bản ghi gốc đã khớp thẻ** (`installPath`, `version`,
`gitCommitSha`, `lastUpdated`) sang đúng bản ghi cây phụ (khớp `id` + `scope` + `projectPath`), chép sổ nguyên byte sang tệp sao lưu TRƯỚC khi
ghi (đường đảo: chép tệp sao lưu đè lại sổ), thoát 1 khi không tìm thấy đúng một bản ghi. Lệnh kiểm vẫn chỉ đọc; lệnh sửa chỉ được in. Một lệnh cho mỗi bản
ghi; đường trong lệnh được đóng nháy cho vỏ POSIX (dấu cách, nháy đơn). Áp cho cây phụ lệch số (dòng vàng) và cây phụ
cùng số mà bộ đệm lệch (dòng đỏ — lời «cài lại ở» thay bằng lệnh sửa cho riêng bản ghi ấy). Gốc chưa khớp thẻ → không
in lệnh nào chép từ nó; dòng nói nâng gốc trước rồi chạy lại.

**L7 — không đổi nghĩa mã thoát.** Cây phụ lệch số vẫn VÀNG (thoát không đổi); bản ghi cùng số mà bộ đệm lệch vẫn ĐỎ.
Đổi vàng thành đỏ là đổi mặc định — mọi kho trả giá (luật 26/09). Sau khi áp lệnh sửa, bản ghi ấy đếm vào ĐẠT.

**L8 — bản ghi mồ côi đi khối riêng.** `projectPath` không còn trên đĩa → dòng `VÀNG mo-coi:` (một khối), không vào
đếm ĐẠT/ĐỎ/khác số, kèm MỘT lệnh dọn (xoá đúng các bản ghi ấy, sao lưu nguyên byte trước). Một thư mục trên ổ
chưa gắn cũng trông như đã xoá — đường đảo là tệp sao lưu. Dòng TỔNG KẾT đếm hai khối mới.

## 3. Ngoài vòng

- Đổi quy trình phát hành để `main` sau thẻ không chạm gốc gói, hay đổi lệnh thêm chợ sang ref thẻ (L1).
- Khoan dung ở chế độ kho giả lập (L3).
- Tự áp lệnh sửa (lệnh vẫn chỉ đọc — ghi chú hàng TC4).
- Dọn bộ đệm `plugins/cache/` của bản ghi mồ côi.
- Sửa GUIDE §7.2 (bullet `--may`): GUIDE không thuộc vùng của hàng nào trong đợt; đầu ra mới tự in lối sửa. Tệp
  ngoài vùng duy nhất vòng chạm là `_acceptance/config.yaml` — một khoá lệnh ca đo, chỉ thêm dòng.

## 4. Bảng dự báo năm dòng

| Dòng | Dự báo | Vì sao |
|---|---|---|
| làm-xong→gộp-được | = | vật chỉ đổi một lệnh đọc; không đổi cổng |
| lượt gọi người/vòng | ↓ ở kho nhận | lần nhận kế không phải chép tay sổ cài cho từng cây phụ |
| vòng bị hạ tầng đốt lượt chấm | = | |
| token máy/vòng | = | ca đo là tiến trình, không gọi model |
| phút máy/lượt chấm | +~1′ | thêm một tệp ca chạy git trong thư mục tạm |

Điều kiện tin cậy: đường verdict không đổi thành phần.

## 5. Giới hạn đã biết khi thiết kế

- Sổ cài giả trong ca đo do code của ca viết theo khuôn `version: 2` đo trên máy 29/10 — không do CLI sinh; ca KB-7 của
  hồ sơ `kiem-ban-cai-sau-phat-hanh` vẫn là chỗ duy nhất đi qua CLI thật.
- Danh sách «tệp không chạy» là danh sách đóng ba mẫu; một mã chạy tương lai đọc `docs/` từ gốc gói sẽ lọt thành vàng.
  Ngưỡng mở ô: ≥1 lần một bản cài khớp mã mà lỗi chạy vì tệp trong ba mẫu.
