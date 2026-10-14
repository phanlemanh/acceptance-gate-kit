# Đường nền không tính tệp của vòng — thiết kế

Hồ sơ: `_acceptance/nen-khong-tinh-tep-cua-vong/` · Cổng Đáng: chủ kho ký «Làm A» 14/10 ·
Gốc: crm-onehub/_acceptance/dai-luu-tru-dung-chung (crm-onehub#375).

## Bài toán

S1#0 chạy `duong-nen.mjs` nền rồi brainstorm song song; tệp S1 của vòng ghi vào cây trong lúc
chân suite chạy, chân suite so `git status` trước/sau nên gọi chúng là `CAY BAN SAU SUITE` → nền
đỏ giả. Chân lưới đọc cây trên đĩa nên hồ sơ viết dở sinh `VIOLATION [<slug>]` → đỏ giả. Đo 14/10:
233 dòng `CAY BAN` lịch sử ở 43 hồ sơ, 0 đỏ thật; VIOLATION nêu chính slug 29 tổ hợp.

## Hướng đã chọn (lối A)

Nền vẫn chạy TẠI CHỖ (không worktree — vỡ 4/8 kho). Dòng thuộc vòng chuyển từ «Dòng đỏ» sang mục
mới «Dòng vàng» của `duong-nen.md`: vẫn có tên, vẫn lên thẻ, KHÔNG lật `nen`/`suite`/`luoi` sang đỏ.

### Tệp nào là «của vòng» — vị từ một chỗ (`feature-loop/scripts/lib/tep-cua-vong.mjs`)

Vị từ sống trong một mô-đun riêng để ca phát lại lịch sử gọi CHÍNH hàm script dùng (không chép lại).
Vế 4 cần biết thư mục có ở HEAD — hàm nhận một hàm hỏi `coOHead(thuMuc)`; script truyền `git cat-file -e`.

Một đường `p` (tương đối gốc kho) là của vòng `<slug>` khi MỘT trong:
1. `p` bắt đầu `_acceptance/<slug>/` — hồ sơ của vòng (guard trùng slug ở S0 bảo đảm hồ sơ ấy là
   của vòng này).
2. tên tệp khớp khuôn tên S1/S2 kit đặt: `YYYY-MM-DD-<slug>-design.md` (design doc, S1#4) hoặc
   `YYYY-MM-DD-<slug>.md` (plan, S2#1) — neo vào khuôn kit định nghĩa, không vào từ vựng của kho.
3. `p` = `_acceptance/config.yaml` — S1 thêm khoá executor của vòng. Đánh đổi DUY NHẤT của lối A:
   một suite ghi vào config.yaml sẽ hiện vàng thay vì đỏ (0/233 ca lịch sử).
4. một đoạn thư mục của `p` đúng bằng `<slug>` VÀ thư mục ấy không có ở HEAD (`git cat-file -e
   HEAD:<thư mục>` thất bại) — bản mẫu design-pass (`apps/app/app/proto/_modules/<slug>/`). Vế
   «không có ở HEAD» chặn slug ngắn trùng một thư mục sẵn có (slug `api` ≠ `apps/api/`).

Vì sao không mất chiều đỏ: suite không biết slug (slug sinh ở S0, sau mọi suite đã viết), nên suite
không thể ghi vào đường mang slug trừ trùng hợp tên; vế 4 loại trùng với thư mục có sẵn.

### Chân suite

Dòng porcelain mới sau suite → `cuaVong(tep)` ? vàng `suite-tep-cua-vong` : đỏ `suite-cay-ban` như cũ.
`chan.suite` chỉ đỏ vì dòng đỏ.

### Chân lưới

VIOLATION mở đầu ĐÚNG `VIOLATION [<slug>]:` (có `]` — `[<slug>-2]` không khớp) → vàng (dòng tóm
`luoi-cua-vong` + nguyên văn); còn lại đỏ như cũ (`luoi-co-san` đếm CHỈ vi phạm không của vòng).
Lưới thoát khác 0 mà MỌI VIOLATION là của vòng → `luoi: xanh` CHỈ KHI cả ba: mã thoát đúng 1 · đầu ra có
dòng tóm `pre-merge-check: <N> violation(s) — merge blocked` · N bằng số dòng VIOLATION đọc được. Thiếu
một vế (lưới chết sau khi in vi phạm, mã 2, dòng tóm vắng hay lệch số) → `luoi-loi-chay` như cũ — lưới
không tự giải thích được mã của nó thì không được xanh. Dòng tóm có ở bản vendored của mọi kho tiêu thụ
(đo 14/10: crm, artifact-platform, map, mapposter, floorplanstudio).

### Khuôn (single-source)

`duong-nen-template.md`: khuôn tệp thêm mục `## Dòng vàng` (bullet giữ chỗ riêng, rỗng → «không
có»); khối marker mới `DUONG-NEN-DONG-VANG` mang hai mã `suite-tep-cua-vong`, `luoi-cua-vong`. Bên
viết điền bullet giữ chỗ theo MỤC chứa nó (hôm nay mọi `- {…}` đều nhận dòng đỏ). Mã vắng → thoát 2.

### Thẻ

`docNen` đọc thêm `vang[]` (mục «Dòng vàng», cùng cách cắt theo cả dòng tiêu đề). Khối «Nền hạ
tầng» Cổng 1 in thêm «Tệp của chính vòng — nền không tính (N)» + nguyên văn từng dòng. Cờ
`NEN_DO_FLAG` vẫn chỉ theo `nen: do`. Cổng 2 `cgNenDo` không đổi (chỉ dòng đỏ).

### Đường đọc-cũ

Tệp `duong-nen.md` đời trước (không có mục «Dòng vàng») → `vang: []`, thẻ y như 2.30. Không bắt hồ sơ
nào ghi lại.

### Lời trong SKILL / GUIDE

S1#0: một câu — dòng vàng là tệp của vòng, không phải lý do chạy lại nền. GUIDE §đường nền: một câu.

### Phát lại trên dữ liệu thật

`tests/scripts/fixtures/duong-nen-cay-ban-lich-su.tsv`: 230 dòng `CAY BAN SAU SUITE` duy nhất rút
14/10 từ mọi phiên bản `duong-nen.md` trong lịch sử (kit + crm), mỗi dòng slug · lớp · đường (không
tên kho). Ca phát lại đưa từng đường qua CHÍNH vị từ (`coOHead` trả false — thư mục của vòng chưa
có ở HEAD lúc nền chạy) và ghim: GIA-S1 197/197 vàng · KHAC 3 vàng (bản mẫu `proto/_modules/<slug>/`)
26 đỏ · CAT (dòng mang lỗi cắt ký tự cũ) 4/4 đỏ · bảy dòng của ca Gốc `dai-luu-tru-dung-chung` 7/7 vàng.

## Ngoài phạm vi

Worktree ở HEAD (hạt giống `docs/plans/2026-10-14-hat-giong-nen-tren-worktree-head.md`) · 29 dòng
mã phiên viết song song không mang slug · `DO SAN` corpus của kit · lai cây workspace.
