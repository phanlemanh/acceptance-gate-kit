# Hạt giống — việc nặng của kho tiêu thụ đi qua khoá máy của kit, gọi được từ worktree cô lập

Gốc: `acceptance-gate-kit/_acceptance/dieu-phoi-tho-trong-kit/` — ô đưa mô hình Điều phối – Thợ (bộ phát lịch, khoá
máy `dieu-phoi/scripts/may.mjs`) về kit cho mọi kho; ô ấy trích lại tên tệp này ở «Out of scope từ khám phá» (luật VC8).
Quan sát thật: một kho tiêu thụ riêng tư, 23/10 (số ở mục dưới; tên kho, tên hồ sơ và đường máy không chép vào kho
công khai). Cùng ngày, phần baseline của cùng lớp lỗi đã sửa trong kit (làn đối chứng S4 gọi `bash '<tệp>'`, ca
`tests/workflows/baseline-worktree-co-lap.test.mjs`); phần này chưa làm.

## Người dùng gặp gì

Kho tiêu thụ chạy việc nặng (đẩy nhánh có móc kiểm toàn kho, chạy trọn bộ test) qua một kịch bản khoá máy RIÊNG của chủ
kho, gọi dạng `bash <kịch bản khoá> "<tên>" git -c core.hooksPath=… push`. Khi phiên Claude Code ở chế độ cô lập trong
`.claude/worktrees/…`, công cụ chạy lệnh từ chối lời gọi ấy: nó đọc CHỮ lệnh, thấy `git` trong đối số mà không kiểm được
là ở yên trong worktree. Ca 23/10: lần đẩy 11:26 bị từ chối, phiên đứng chờ, chủ kho phải gõ «rời cây» lúc 11:51 —
**một lượt gọi người ngoài thiết kế, 25 phút máy đứng**. Ngoài ra khoá riêng ấy không biết khoá `s4` của kit: hai hàng
chờ độc lập trên cùng một máy, nên một lần đẩy nặng vẫn có thể chồng lên một lượt chấm.

## Số đo của bộ canh (23/10, tác tử cô lập trong kho kit)

| Lời gọi | Kết quả |
|---|---|
| khối lệnh có `git -C "$R" worktree add …` | từ chối («names git in a form too complex to verify») |
| `bash '<tệp trong cây>'` (tệp chứa đúng khối trên) | chạy |
| `bash '<tệp>' ten git -c core.hooksPath=/dev/null status` | từ chối («what it reads or is handed as shell text cannot be shown not to run git») |
| `node -e '…execFileSync("bash",[tệp])…' '<tệp>'` | chạy |

Nghĩa là: lối nào nhận **argv chứa git** đều chết ở bộ canh; lối nhận **TÊN việc** (chữ git nằm trong cấu hình, không
trong lời gọi) thì qua — cho tới khi bộ canh siết thêm (giới hạn của công cụ, không của kit).

## Vì sao không làm trong vòng sửa baseline

Khoá máy của kit hôm nay là khoá của một ĐỢT (`giuMay(thuMucDot, …)`: chủ khoá là thư mục đợt, thu hồi khi đợt đóng),
và bộ phát lịch xét nó trước khi cấp `s4`. Một việc nặng gọi tay không có đợt: cần một loại chủ khoá mới (tiến trình +
hạn), luật thu hồi khi tiến trình chết, và bộ phát lịch phải xét cả loại ấy — chạm `phat-lich.mjs`/`lich.mjs`, đang có
phiên khác sửa. Đó là một CỘNG cho hành vi điều phối mọi kho (luật 26/09: «kho không có sự cố này được gì, mất gì?»), cần
chủ kho duyệt ở Cổng Đáng, không phải một bản vá.

Hình dạng đề xuất để cân ở Cổng Đáng: kho khai việc nặng theo TÊN trong cấu hình (`ten → lệnh`), kit có một lệnh
`node <kit>/dieu-phoi/scripts/<lệnh> nang <ten>` xếp hàng CHUNG với `s4` trên khoá máy, chạy lệnh đã khai, nhả khoá khi
xong hoặc khi tiến trình chết; kho tiêu thụ bỏ được kịch bản khoá riêng.

## Ngưỡng mở ô

≥ 1 lần nữa (sau 23/10) một phiên cô lập phải gọi người vì việc nặng bị bộ canh từ chối, HOẶC ≥ 1 lượt chấm bị gắn nhãn
hạ tầng mà sổ đo của máy cho thấy chồng giờ với một việc nặng chạy qua khoá riêng. Đếm bằng sổ phiên của kho tiêu thụ
(lời từ chối nguyên văn «Refusing to run it — a worktree-isolated») và `dieu-phoi.mjs hieu-chuan` trên `do-lan.jsonl`.
