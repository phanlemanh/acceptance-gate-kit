# Thiết kế — ký → gộp có thước và có chủ máy (hồ sơ `ky-den-gop`)

Ngày 23/10/2026. Gói «cắt 80 %» chủ kho chốt sau phiên phân tích ở một kho tiêu thụ: A (đo ký → gộp, theo PR #400 North Star «gộp
được»), B và E ở kho tiêu thụ, C, G, H, I ở kit; bỏ D, E+, F. Vòng này làm **C, H, I** và phần máy đo của A — ba hạng cùng chạm
phần điều phối nên đi chung một PR. G (lệnh kit bị chế độ cô lập worktree từ chối) là việc của phiên khác.

## Vì sao

Đợt 19–23/10 của kho ấy: 39 PR, PR mở → gộp **trung vị 8,3 giờ**; 52 commit ghim lại; 254 lần gộp
nhánh chính vào nhánh. Ca phiếu hai cột (2 tệp mã): ký 11:48, hơn 3 giờ sau chưa gộp — chờ hàng gộp,
hai lần đẩy chờ khoá máy, rồi một PR sửa cùng phiếu gộp trước nên hồ sơ cũ đi, phải ghim lại; giám sát đã biết trùng
tệp từ lúc xếp hàng nhưng máy không xét. Đoạn ký → gộp không có thước (kit đo tới `signed-off`) và không có chủ máy.

## C — lịch biết tệp

- Một mô-đun `dieu-phoi/scripts/trung-tep.mjs` cho ba bên dùng: chọn hàng kế (`lich.mjs` `chonHangKe`, tham số thứ
  năm), bộ phát lịch (`capNhatHangKe`), lệnh `hang them`. «Đang dở» = đang làm · đã ký chưa gộp · đã được chọn làm hàng
  kế của dãy khác (ký chưa gộp chính là PR đã gộp trước trong ca phiếu hai cột).
- Trùng một hàng của đợt → ghi `sau` vào `hang-viec.json` (trong khoá `hang-viec.khoa`, một dòng Nhật ký, một sự kiện);
  `sau` nhận cả slug khi hàng kia không có mã. Trùng PR ngoài đợt → giữ hàng mỗi nhịp, KHÔNG ghi `sau` (không có hàng để
  trỏ), một sự kiện mỗi cặp hàng–nhánh. Không dựng vòng chờ nhau: hàng kia đã chờ hàng này thì không ghi ngược.
- Hai lỗ của hạt giống 10/10 mà C cần: dò PR không nuốt lỗi (`docNhanhMo` trả `loi`; xét chạm tệp khi có lỗi →
  giám sát phán), nhánh của chính dãy không là xung đột (`nhanhCua` đọc nhánh của worktree dãy).
- Không dò được PR thì lịch KHÔNG đứng: một sự kiện `trung-tep-mu`, vẫn so phần hàng của đợt. Lý do: dừng giao hàng
  cho mọi dãy vì gh hỏng là đổi một lỗi hạ tầng thành đợt đứng; xét chạm tệp thì khác (máy đang DUYỆT một việc).
- Bản chụp PR + nhánh mỗi dãy ghi vào `trang-thai.json` (`nhanh_mo`), dùng lại tới một phút: nhịp 5″ mà gọi gh mỗi
  nhịp là phí; `hang them` đọc bản chụp thay vì gọi gh.
- So hai glob: mẫu không ký tự đại diện so bằng bộ khớp; hai mẫu đều có ký tự đại diện so phần tĩnh trước ký tự đại
  diện đầu — dư về phía báo trùng. Thà xếp tuần tự thừa (giá: một hàng chờ) còn hơn lọt (giá: một lần ghim lại).
- `khoa-hang-viec.mjs` tách khoá ghi + Nhật ký khỏi `hang.mjs` để bộ phát lịch ghi `sau` mà không nạp vòng
  `hang → tiep-tuc → … → phat-lich`; `hang.mjs` xuất lại như cũ.

## H — PR sẵn sàng lúc trình thẻ Cổng Bằng chứng

- Bước máy `feature-loop/scripts/pr-san-sang.mjs`, gọi từ khối marker `PR-SAN-SANG` đầu mục GATE 2 của SKILL — ngay sau
  commit gói bằng chứng, trước thẻ. Đẩy nhánh, mở nháp nếu chưa có, `gh pr ready`.
- Chỉ chạy khi hợp đồng `verified`, verdict PASS-family và giữa `verified_commit` với HEAD không tệp nào đổi ngoài
  `_acceptance/` — PR sẵn sàng phải mang đúng vật đã chấm. Lưới trước-gộp vẫn đòi chữ ký, nên PR sẵn sàng không gộp được
  trước khi ký.
- `ship_default` khác `pr` → chỉ đẩy. Hạ tầng hỏng → thoát 3, một dòng, vòng đi tiếp tới thẻ: bước này không phải cổng.

## I — gộp không chạy lại CI khi không trùng tệp

Quyết định chủ kho 23/10/2026, nguyên văn: «Chấp nhận rủi ro mục I: PR không trùng tệp với PR vừa gộp thì gộp ngay,
không chạy lại CI; lỗi lọt qua thì CI trên nhánh chính bắt.»

- Lệnh `dieu-phoi.mjs gop <số PR>` (mô-đun `gop.mjs`) chuyển bốn điều kiện của spec hai tầng §4.4 từ lời sang mã: hồ sơ
  trên đầu nhánh đã thông; CI xanh trên đúng `headRefOid`; điều kiện «CI sau lần gộp gần nhất» đọc bằng merge-base;
  `gh pr merge --merge --match-head-commit <sha>`, không `--auto`.
- Lối nhanh: nhánh chính đã tiến, khoá `gop_khong_chay_lai_ci` bật, tệp PR tự thêm (`git diff --no-renames mb sha`)
  không giao tệp vào nhánh chính từ merge-base (`git diff --no-renames mb đỉnh`). merge-base chứa trong mọi base mà CI
  của PR có thể đã thấy, nên tập so chỉ rộng hơn — dư về phía an toàn. `--no-renames` để đổi tên tính cả tên cũ.
- Khoá vắng = tắt (luật 26/09: bật theo lựa chọn trước đổi mặc định). Kho tiêu thụ đầu tiên bật trong gói đợt khi nhận bản.
- Lưới: CI chạy trên nhánh chính sau gộp. Khai trong mẫu `LUAT.md`: CI ấy đỏ thì báo giám sát ngay.
- Không làm hàng gộp tự động (D): lệnh chạy khi thợ đã giữ khoá merge; giám sát và người dùng `--xet`.

## Thước ký → gộp

Kit chưa đo bằng máy (PR #400 khai giới hạn). `do-gop.mjs` đọc từ nhánh chính lúc bộ phát lịch ghi `hang-gop`: giờ
commit đầu tiên đưa `status:` sang trạng thái đã thông (`-G`, bỏ commit gộp) và giờ commit đầu trên lối cha-đầu chạm hợp
đồng (commit gộp). Không dùng giờ bộ phát lịch thấy: nó có thể nghỉ giữa lúc ký và lúc gộp. Gộp squash → không có commit
ký riêng → `chua_do`, không vào mẫu số. `dem` thêm `ky_den_gop`, `gop_vao_nhanh` (commit gộp bên trong PR có cha trên
nhánh chính), `ghim_lai_sau_ky` (lượt cấp `ghim-lai` sau giờ ký — sự kiện `cap` nay mang `don`), `gop` (lối của lệnh gộp).

## Ngoài vòng

D (hàng gộp tự động đầy đủ), E+ (bằng chứng theo diff), F (giá theo rủi ro) — hạt giống. Không cắt bản phát hành.
Lỗ 3 và 4 của hạt giống 10/10 không thuộc vòng này.
