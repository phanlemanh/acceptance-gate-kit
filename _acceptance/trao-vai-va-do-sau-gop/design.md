# Thiết kế — trao vai đúng mã, đo không đỏ sau gộp (TC1b, `trao-vai-va-do-sau-gop`)

**Ngày:** 2026-10-26 · **Hạng:** T2 · **Gói:** `dieu-phoi` + ca đo của TC1 · **Ô:** `opportunity.md` (Cổng Đáng build 26/10)
· **Hàng:** TC1b · **Nguồn:** hạt giống `docs/plans/2026-10-26-hat-giong-tc1b-sau-danh-thuc.md` (Ngoài-1, 5, 6, 7, 8 của
Cổng Bằng chứng TC1). Nhánh cắt từ đỉnh TC1 `8df32d1c` (PR #419), gộp sau #419.

## 1. Ba lỗ

- **B1 — trao vai gắn sai mã CLI.** `vai --giam-sat X --phien A` (dieu-phoi.mjs, lệnh `vai`) gọi `nhanVaiGiamSat` mà
  không truyền `phienCli`, nên mặc định `CLAUDE_CODE_SESSION_ID` của phiên GỌI (A) thành `phien_cli` của X. Đánh thức đọc
  nhịp của A làm nhịp của X: X chết mà A còn sống thì không ai được báo.
- **B2 — lời dặn bước 5 sai.** `commands/tiep-tuc.md` bước 5 nói `chan-doan --phien` «mã CLI cũng nhận»; mục `giam-sat` chỉ
  `du` khi `--phien` bằng mã app của vai, nên mã CLI ra `thieu` kèm câu «chạy /dieu-phoi:tiep-tuc để nhận vai» — làm theo
  bằng mã CLI là cướp vai bằng mã CLI, tái tạo lỗi TC1.
- **B3 — hai phép đo của TC1 thành bất biến lúc gộp.** TC1-09 so cây làm việc với sha ghim `45e9f2cf…` và đòi tập ca
  đổi thân BẰNG sổ TC1; TC1-06 so trọn đầu ra chẩn đoán của gói làm việc với bản ở sha ghim. Sau khi TC1 gộp, vòng nào
  đổi thân ca `tests/dieu-phoi` (TC2 sẽ đổi) hay đổi mục chẩn đoán là CI đỏ giả. Thêm: bộ tách khối của TC1-09 là bản cũ
  cột 0 (on-dinh-r2.test.mjs ghi rõ nó hỏng ở ca một dòng và ca sinh trong vòng lặp).

## 2. Lựa chọn

1. **B1:** lệnh `vai` truyền `phienCli: null` khi `--giam-sat` khác `--phien`; trùng (tự nhận lại) thì giữ mặc định môi
   trường. Giám sát mới tự ghi `phien_cli` ở lần `tiep-tuc` đầu (TC1 đã có).
2. **B2:** bỏ vế «mã CLI cũng nhận» khỏi bước 5; mục `giam-sat` của chẩn đoán, khi `--phien` bằng `phien_cli` của vai, nói
   đúng tên «đây là mã CLI của giám sát hiện tại — gọi lại bằng mã app <phien>; đừng nhận vai bằng mã CLI», vẫn `thieu`.
   Không nới `laGiamSat` cho mã CLI: nới thì `tiep-tuc --phien <mã CLI>` nhận vai bằng mã CLI — đúng lỗi TC1.
3. **B3 — phép so lịch sử, hai đầu cố định.** TC1-09 so khối ca giữa `45e9f2cf…` (mốc trước TC1) và sha chấm TC1
   `e208665f…` (lượt chấm 3, ghi ở run-log của hồ sơ TC1), cả hai đọc bằng `git show`; sổ TC1 cũng đọc tại `e208665f`.
   TC1-06 so gói rút bằng `git archive` tại hai sha ấy. Không đọc cây làm việc nên mệnh đề đúng mãi sau khi `main` trôi,
   bất kể gộp bằng commit gộp, gộp tay hay fast-forward (luật kit: «răng đo hành vi cài đặt, không đo diện mạo một PR hay
   tuổi của một sha»; hạt giống `2026-10-18-hat-giong-bat-bien-luc-gop-trong-ho-so-da-ky.md`). Giới hạn: sha chấm vắng
   (clone nông, gộp squash) → ca bỏ qua có tên. Bộ tách khối mới (`dongKhep` của on-dinh-r2) sống ở mô-đun chung
   `tests/dieu-phoi/ca-doi-than.mjs`. Hệ quả có tên: hai ca thành bằng chứng lịch sử, không còn là lưới hồi quy trên
   cây làm việc — lưới sống của đường đọc-cũ là DP3-09 và TC1-03. Đã loại: khoá khoảng so vào commit gộp PR (`mocSo`
   của SDT-07) — phản biện chỉ ra vế «trước gộp» vẫn đọc cây làm việc và nó phụ thuộc kiểu thông điệp gộp.

## 3. Không gian ca (quét hình thái — preset test-matrix, rút gọn)

Trục: **A · ai gọi `vai`** (giám sát trao cho phiên khác · tự nhận lại) × **B · nguồn mã CLI** (biến của phiên gọi · vắng);
**C · `--phien` của chẩn đoán** (mã app · mã CLI của giám sát · mã lạ); **D · cây làm việc trôi** (đổi thân ca · đổi câu
chẩn đoán · sha chấm vắng). Core: A trao × B biến → không `phien_cli`, đánh thức báo chủ kho khi
chỉ phiên trao có nhịp · A tự nhận × B biến/vắng → giữ `phien_cli` · C ba hàng · D ba hàng cho TC1-09 và TC1-06 · bộ tách
khối hai ca hỏng của bản cũ. Never: nới `laGiamSat` (lý do ở 2.2).

## 4. Phép đo

Ca ở `tests/dieu-phoi/trao-vai.test.mjs`, tên mở bằng `TC1b-`; khoá executor `executors.test.dieu_phoi_tc1b`. Kho thử,
đợt, hook và CLI thật như ca TC1 (môi trường con xoá hai biến mã phiên rồi thêm biến của ca). Ca B3 dựng worktree tạm ở HEAD
rồi đổi thân ca và câu chẩn đoán trong đó → TC1-09/TC1-06 im; bản sao đọc cây làm việc → đỏ nêu đúng ca.
