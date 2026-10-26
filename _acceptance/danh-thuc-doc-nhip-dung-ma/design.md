# Thiết kế — đánh thức đọc nhịp đúng mã phiên (TC1, `danh-thuc-doc-nhip-dung-ma`)

**Ngày:** 2026-10-26 · **Hạng:** T2 · **Gói:** `dieu-phoi` · **Ô:** `_acceptance/danh-thuc-doc-nhip-dung-ma/opportunity.md`
(Cổng Đáng: build, 26/10) · **Hàng:** TC1, mốc «Tinh chỉnh sau hai đợt thử» 05/11.

## 1. Lỗi

Giám sát của một đợt nhận vai bằng mã phiên của APP (`local_<uuid>`): lời dặn của `/dieu-phoi:tiep-tuc` bước 1,
`/dieu-phoi:ban-giao` bước 1 và `/dieu-phoi:mo-dot` bước 2 bảo lấy «mã phiên này» bằng công cụ phiên của app. Mã đó vào
`vai.json → giam_sat.phien`. Còn hook PostToolUse (`hook-nhip.mjs` → `ghiNhipSong`, `song.mjs`) ghi
`song/<session_id>.json` theo `session_id` của CLI — một uuid khác hẳn. Hai bên đọc tìm nhịp của giám sát bằng mã app:

- `danh-thuc.mjs` (`danhThuc`, dòng ~23): `song/<giam_sat.phien>.json` vắng → `bao-chu-kho` «giám sát không có nhịp sống»;
- `chan-doan.mjs` (dòng ~83): mục `hook-phien` = `thieu` «hook của gói chưa bắn trong phiên này».

Kết quả đo ở hai đợt thật: crm `lo-trinh-tin-hieu` 19–20/10 (hạt giống 20/10 mục 1) và onehub-invest
`dieu-phoi-dot0-cam-mau` 23–26/10 (hạt giống 26/10 mục 2) — lịch 30′ gần như lần nào cũng gọi chủ kho dù giám sát
đang chạy. Bộ ca hiện có không bắt được vì mọi ca dùng CÙNG một chuỗi `s-gs` cho cả mã vai lẫn `session_id` của hook
(`tests/dieu-phoi/tiep-tuc.test.mjs`, `MA_TRAN_THUC`) — fixture tự dựng đúng khuôn bên đọc.

Gốc thứ hai, cùng triệu chứng: phiên giám sát mở TRƯỚC khi gói được cài hay nâng thì hook của gói không nạp vào phiên
đó — không có tệp nhịp nào, dù mã khớp hay không (kit #403).

## 2. Sự thật nền đo được trong phiên này (26/10, app desktop 3.6556.2, Claude Code 2.1.308)

- Môi trường của mọi lệnh Bash trong phiên có `CLAUDE_CODE_SESSION_ID=<uuid CLI>` và
  `CLAUDE_CODE_HOST_SESSION_ID=local_<uuid app>`.
- Chính tiến trình CLI mang `CLAUDE_CODE_HOST_SESSION_ID` trong môi trường của nó (`ps -E -p $CLAUDE_PID`), nên hook — tiến
  trình con của CLI — đọc được mã app. `session_id` trong stdin của hook là mã CLI.
- Ngoài app desktop (CLI ở terminal) không có `CLAUDE_CODE_HOST_SESSION_ID`; mã duy nhất là mã CLI.

## 3. Lựa chọn

**Hạ tầng tự xưng cả hai mã; bên đọc nối bằng một hàm.** Đúng dạng nghiệm của CLAUDE.md («biến bất biến từ đầu-người
sang vật-máy-giữ … dòng tự xưng của hạ tầng»): không ai phải nhớ mã nào là mã nào.

1. **Hook ghi `ma_app`.** `ghiNhipSong` thêm khoá `ma_app` = `CLAUDE_CODE_HOST_SESSION_ID` khi biến có và đúng khuôn mã
   phiên. Biến vắng → không có khoá (tệp nhịp y như cũ).
2. **Vai ghi `phien_cli`.** `nhanVaiGiamSat` (và `ghiVai` lúc mở đợt) thêm `phien_cli` = `CLAUDE_CODE_SESSION_ID` khi biến
   có, đúng khuôn và KHÁC `phien`. Lệnh chạy trong Bash của chính phiên giám sát nên biến là của phiên đó.
3. **Một bên đọc.** `song.mjs` thêm `nhipCuaPhien(thuMuc, giamSat)`: nhịp mới nhất trong các tệp `song/<phien>.json`,
  `song/<phien_cli>.json` và mọi tệp nhịp có `ma_app === phien`. `danh-thuc` và mục `hook-phien` của `chan-doan` gọi
   hàm này thay cho phép ghép tên tệp. Lối nhắn giám sát (`nhan-giam-sat`) vẫn trả `phien` = mã app — công cụ nhắn liên
   phiên của app nhận mã đó.
4. **Hook chưa nạp được nói ra đúng tên.** Khi giám sát chạy `tiep-tuc` (kể cả `--nhe`) trong app: biến
   `CLAUDE_CODE_SESSION_ID` có mà không có tệp nhịp nào của phiên (theo hàm ở 3) → kết quả mang `hook_thieu: true` và
   câu «hook của gói chưa nạp trong phiên này — mở phiên giám sát mới rồi chạy /dieu-phoi:tiep-tuc»; vai ghi
   `hook_thieu_luc`. Lệnh này luôn chạy SAU ít nhất một lời gọi công cụ của phiên (bước đọc hạn mức đứng trước nó trong
   lời dặn), nên hook đã nạp thì tệp nhịp đã có. Giám sát tự biết từ lần thức đầu. Đánh thức gặp vai mang
   `hook_thieu_luc` (không có nhịp để đọc) dùng THANG LEO trên tín hiệu đã có — lúc thức: thức dưới 40′ → `khong` như
   mọi ca; 40′–80′ → `nhan-giam-sat` (nhắn giám sát, câu «phiên giám sát chạy không có hook của gói — mở phiên giám sát
   mới rồi chạy /dieu-phoi:tiep-tuc»); quá 80′ — giám sát không đáp tin đã nhắn bằng một lần thức — → `bao-chu-kho` với câu
   nêu đúng gốc «không có hook của gói», không phải «không có nhịp sống». Giám sát còn sống đáp tin bằng `tiep-tuc --nhe`
   (làm tươi lúc thức) nên chủ kho không bị gọi — đúng câu ô «thay cho báo chủ kho»; giám sát chết thật vẫn được báo, chậm
   hơn một lượt lịch 30′ (luật kit: việc tự sinh từ *hệ thống chết*).
5. **Đường đọc-cũ.** Vai một mã (đợt cũ, hay đợt đã lách bằng mã CLI) và tệp nhịp không có `ma_app` → bên đọc thử đúng
   `song/<phien>.json` như cũ, nên kết quả giống từng byte ở mọi ca mã trùng. Vai giữ mã app mà không tệp nhịp nào nối
   được (tệp đời trước, chưa có `ma_app`) → `chan-doan` thêm một dòng vàng «vai giữ mã app nhưng nhịp chưa mang mã app —
   chạy lại /dieu-phoi:tiep-tuc để vai ghi mã CLI», không chặn.

Lời dặn của ba lệnh (`tiep-tuc.md`, `ban-giao.md`, `mo-dot.md`) đổi cho khớp: `--phien` là mã app của phiên (công cụ phiên
của app), máy tự ghi mã CLI; ngoài app thì dùng mã CLI như trước.

### Lối đã loại

- **Đoán mã CLI từ đường scratchpad hay tên tệp transcript** — phụ thuộc bố cục thư mục của app, đổi là gãy im; biến môi
  trường là giao diện app đặt cho tiến trình con.
- **Đổi lời dặn thành «dùng mã CLI»** — lối nhắn liên phiên của app cần mã app; đổi thì đánh thức gửi tin không tới (cái
  giá hạt giống 20/10 đã nêu).
- **Tự suy theo worktree (nhịp mới nhất cùng worktree với giám sát)** — đề xuất ban đầu của hạt giống 20/10. Phiên giám
  sát và phiên khác (lịch 30′, phiên chính của kho) có thể cùng đứng ở checkout gốc, nên «đúng một ứng viên» không chắc;
  hạ tầng đã tự xưng mã thì không cần đoán.
- **Lệnh CLI tự ghi nhịp thay hook** — làm sai mục `hook-phien` (nó đo hook có bắn không) và che đúng gốc thứ hai.

## 4. Không gian ca (quét hình thái, preset test-matrix)

Ngữ cảnh — chân sản phẩm: `dieu-phoi/` và hai hạt giống [SUY-TỪ-REPO: docs/plans/2026-10-20-hat-giong-nam-loi-kit-tu-dot-lo-trinh-tin-hieu.md,
docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md] · chân ngành: tín hiệu sống do chính tiến
trình tự khai [NGÀNH: systemd `sd_notify` WATCHDOG=1] và thăm dò sống theo danh tính ổn định của đơn vị chạy
[NGÀNH: Kubernetes liveness probe].

Trục (độc lập: đổi một trục không ép trục khác):
- **A · mã vai giữ:** chỉ mã app · chỉ mã CLI (đợt đã lách) · cả hai (mới) [thước CE: ba lời dặn + `vai.mjs`]
- **B · nguồn nhịp của giám sát:** hook trong app (có `ma_app`) · hook ngoài app (không biến app) · không hook (mở trước
  khi nạp gói) · tệp nhịp đời trước (không `ma_app`) [thước CE: `hook-nhip.mjs` + kit #403]
- **C · bên đọc:** `danh-thuc` · `chan-doan` mục `hook-phien` · `tiep-tuc` (tự báo) [thước CE: `grep TEP_SONG_DIR` ba tệp]
- **D · độ tươi:** dưới 10′ · cũ [thước CE: `NGUONG_SONG_MS`]

Core (vào hợp đồng): (A app, B hook-app, C danh-thuc, D tươi → nhắn giám sát) · cùng ô D cũ → báo chủ kho · (A app, B
không hook, C tiep-tuc) → tự báo + câu đúng gốc ở đánh thức · (A CLI, B đời trước, C cả hai) → như cũ từng byte · (A app,
B đời trước, C chan-doan) → dòng vàng · (A cả hai, B hook-app, C chan-doan) → `du` · bên viết round-trip bên đọc.
Later: `xetDay` của dãy thợ — nối theo worktree, không theo mã, nên không có lỗi này. Never: đoán mã từ đường tệp (lý do
ở 3).

## 5. Phép đo

Ca mới ở `tests/dieu-phoi/danh-thuc-ma-phien.test.mjs`, tên ca mở bằng `TC1-`; khoá executor mới
`executors.test.dieu_phoi_tc1` ghim dòng TAP `ok … TC1-`. Kho thử và đợt dựng bằng `mo` thật như các ca DP3; hook chạy
thật bằng tiến trình con với môi trường giả (`CLAUDE_CODE_HOST_SESSION_ID`, `CLAUDE_CODE_SESSION_ID`); CLI chạy thật. Mã app
và mã CLI trong ca LUÔN khác nhau — đó là chỗ bộ ca cũ mù. Mỗi ca đỏ chạy chính hàm đo trên bản sao gói bị tiêm, sau khi
bản lành xanh trên cùng fixture, kiểm bước tiêm đã áp, và ghim thông điệp của đúng lỗi.
