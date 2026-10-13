# Thiết kế: dieu-phoi-khoa-day-giu-nhip (DP10 — khoá của DÃY cũng tính nhịp khoá)

Gốc: phanlemanh/crm-onehub#375, bình luận Mac Studio 13/10 08:16Z — đợt `r2` trên crm, dãy P1 đo, giám sát xác
minh. Lỗi của chính DP8 (`_acceptance/dieu-phoi-on-dinh-r2/`, lời hứa 3 — AC-9). Vòng chạy dưới ô dù
`_acceptance/dieu-phoi-tho-trong-kit/` như DP2–DP9, không có `opportunity.md` riêng. Đích: bản vá 2.29.x ngay sau
tag v2.29.0 (Điều phối M5 cắt bản vá).

## Ràng buộc của vòng

- Chỉ chạm `dieu-phoi/`, ca đo dưới `tests/dieu-phoi/` và hồ sơ này. Không chạm `CHANGELOG.md`, số phiên bản,
  `_acceptance/config.yaml` (khoá `executors.test.dieu_phoi_sdt` có sẵn đã nhặt tên ca «DP10-»).
- Sửa kit vì sự cố của một kho phải cân trên mọi kho (CLAUDE.md 26/09): kho không có sự cố này được gì, mất gì —
  xem «Cân trên mọi kho» dưới.

## Hôm nay

`baoKhoaKhongNhip` (`dieu-phoi/scripts/phat-lich.mjs`) báo `khoa-khong-nhip` (`can_phan: true`) khi khoá cấp quá
`NGUONG_SONG_MS` (10′) mà không có tín hiệu sống nào từ lúc cấp. DP8 thêm `viecNenGiuNhip`: nhịp khoá
(`khoa/<tn>/nhip`, do `chamNhip` hay lệnh bọc `giu-nhip.mjs` ghi) có từ lúc cấp thì khoá còn sống — NHƯNG dòng đầu
của hàm loại khoá do một dãy giữ:

```js
if ((hangViec?.day ?? []).some((d) => d.id === chu.phien)) return false;
```

Trong khi `scripts/mau/LUAT.md` («Cách xin tài nguyên») dặn chính dãy: «Việc nền dài khi đang giữ khoá: chạy qua
lệnh bọc … Lệnh bọc chạm tín hiệu sống của khoá mỗi phút tới khi lệnh con thoát». Dãy làm đúng lời dặn — phiên chờ
lệnh nền, không gọi công cụ nào trong hơn 10′, nên không có nhịp phiên — vẫn bị báo. 13/10 giám sát crm làm theo sự
kiện mà nhả khoá `duong-nen` của P1 khi lượt đang chạy. Ma trận DP8 (E9) đã ghim chính hành vi sai: hàng «dãy P1
giữ s4 chỉ nhịp khoá → 1»; không hàng nào phủ «dãy + `giu-nhip.mjs`».

## Chỗ chọn 1 — nhịp khoá tính cho MỌI người giữ khoá

Khoá còn sống khi có nhịp phiên của worktree giữ khoá TỪ lúc cấp, HOẶC nhịp khoá có mtime ≥ `cap_luc` — bất kể người
giữ là dãy hay việc nền ngoài dãy. Bỏ dòng loại dãy; `viecNenGiuNhip(thuMuc, tn, chu)` thôi nhận `hangViec`, và
`baoKhoaKhongNhip` thôi nhận nó (không còn dùng). Lời `ly_do` của sự kiện nêu cả hai tín hiệu đã thiếu.

Phương án đã loại: (a) `giu-nhip.mjs` ghi thêm nhịp phiên `song/` cho worktree — nhịp phiên khoá theo `session_id`
mà lệnh bọc không biết, và `tiep-tuc` đọc nhịp phiên để quyết «dãy không phiên sống → mở chip»: phiên chết mà lệnh
bọc còn chạy sẽ giấu một dãy cần chip mới; (b) giữ luật cũ, dặn dãy không chạy nền quá 10′ — trái chính lời dặn
của `LUAT.md` và hook chặn S4 (in sẵn lệnh bọc).

Thứ còn giữ: (i) khoá của dãy không có cả hai tín hiệu từ lúc cấp vẫn bị báo (ca DP3-10 «thợ chết theo app»); (ii)
nhịp khoá ghi TRƯỚC lúc cấp không tính; (iii) thôi chạm nhịp thì hạn thuê thu hồi như mọi khoá (`thu-hoi`).

## Chỗ chọn 2 — đo: ma trận trục D toàn phần, cùng fixture

Ma trận `MA_TRAN_VIEC_NEN` của DP8 (5 hàng) thành 10 hàng = {việc nền `kiem-cheo`, dãy `P1`} × {chạm `chamNhip`
sau cấp, chạy qua `giu-nhip.mjs` sau cấp, nhịp khoá trước cấp, worktree KHÁC chạm `chamNhip` sau cấp, không chạm} với
kỳ vọng {0, 0, 1, 1, 1} cho CẢ HAI người giữ — lời hứa là «người giữ không đổi kết quả», nên hai nửa ma trận so bằng
nhau. Mỗi hàng đối chứng đầu vào «không nhịp phiên của worktree người giữ», để hàng 0 của nửa P1 chứng nhịp KHOÁ chứ
không phải nhịp phiên. Ca đỏ: bản sao `phat-lich.mjs` dựng lại ĐÚNG hành vi DP8 (luồn lại `hangViec` qua hai chữ ký
và chèn lại dòng loại dãy — chỉ chèn dòng thì `hangViec` ngoài phạm vi, bộ phát lịch ném lỗi thay vì báo) rồi chạy trọn
ma trận: danh sách lỗi BẰNG đúng hai hàng 0 của nửa P1.

Hàng «worktree khác chạm»: nhịp khoá gắn với tài nguyên, không với người giữ — nhưng `chamNhip` chỉ ghi khi cwd nằm
trong `chu.worktree` của khoá hiện tại (`trongWorktree`), nên lệnh bọc còn sót của người giữ CŨ không làm sống khoá
của người giữ MỚI. Hàng này giữ điều đó (gap-probe P2).

Hệ quả cho ca đã ký (đổi thân, khai trong sổ):
- `DP8-09 viec-nen` — ma trận (khối dựng nằm trong khối ca này) đổi hàng dãy 1 → 0 và thêm ba hàng.
- `DP8-09-do bo-mien` — chuỗi tiêm theo lời gọi mới `viecNenGiuNhip(thuMuc, tn, chu)`.
- `DP8-10 tai-lieu` KHÔNG đổi thân: nó chỉ kiểm đoạn README có «ngoài dãy» + `chamNhip`/`giu-nhip.mjs`, không ghim
  câu «vẫn đòi nhịp phiên» (đã soát thân ca 13/10).
- `DP3-10-do bo-dieu-kien` (tests/dieu-phoi/tiep-tuc.test.mjs) — đột biến «bỏ điều kiện nhịp phiên» trên kịch bản
  `co-nhip` không còn đỏ sau vá: hook thật ghi CẢ nhịp phiên lẫn nhịp khoá, và nhịp khoá giờ cứu khoá. Ca mới tắt
  `chamNhip` trong hook của bản sao (cả bản lành đối chứng lẫn bản đột biến) để kịch bản chỉ còn nhịp phiên — nhánh
  nhịp phiên vẫn có chiều đỏ riêng. `DP3-10 khoa-khong-nhip` (và `kichBanKhoa`) không đổi thân.

## Cân trên mọi kho

Kho không có sự cố: dãy không chạy nền dài thì nhịp phiên vẫn có mỗi lời gọi công cụ — kết quả không đổi. Mất: khoá
của dãy mà phiên đã chết nhưng lệnh bọc còn chạy không bị báo tới khi lệnh bọc thoát — đúng: khoá ĐANG được dùng;
hạn thuê vẫn thu hồi khi nhịp khoá cũ. Ai dựa hành vi cũ: chỉ hàng ma trận DP8 (đo sai lời của `LUAT.md`). Không
đổi khuôn tệp nào của đợt — không cần đường đọc-cũ.

## Tài liệu

`dieu-phoi/README.md` mục «Chặn S4 và việc chờ người»: câu «Khoá của dãy vẫn đòi nhịp phiên của worktree dãy» thành
câu nói khoá của dãy cũng tính nhịp khoá (dãy chạy lượt dài qua `giu-nhip.mjs` như `LUAT.md` dặn không bị báo).
`LUAT.md` đã dặn đúng — không đổi. Chú thích trên `viecNenGiuNhip` sửa theo.
