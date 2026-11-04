# Bản phạm vi — khám kho tiêu thụ (đợt `kham-kho-0411`)

Nguồn: hai trang tri thức ở khối mã dưới (nền thiết kế, bản đồ khuôn) và đề xuất của phiên crm, gửi phiên điều phối kit ngày 04/11. Chủ kho duyệt việc gửi ở phiên crm. Số đo lấy
trên crm ở `74a29a68d` với kit 2.37.0, chạy trong một worktree nháp rồi gỡ; vòng thử là SV10
(`crm-onehub/_acceptance/bang-chung-kr-mot-loi/`, PR crm #619).

**Vấn đề.** Để biết kho đã bật đủ chưa, kho tiêu thụ phải chạy rời từng lệnh `kiem-ban-cai --may`, `design-floor-bac`,
`design-floor-khuon --dem/--kiem` rồi grep config. Có ba chỗ dễ đọc nhầm là đã chạy:
- bậc M0 không in gì;
- nhóm khuôn «không đọc được ở đây» vẫn thoát 0;
- thiếu `executors.design.floor` hay `khuon` chỉ ra một dòng stderr.

<!-- <<<PHAM-VI-MA -->
```
dot: kham-kho-0411
dang: lan-va
nguon: acceptance-gate-kit-tri-thuc:wiki/chu-de/design-floor.md#3a9c06ec8464d4fe3e2ed863a4373e6da797232f, acceptance-gate-kit-tri-thuc:wiki/chu-de/ban-do-khuon.md#80a46d525b411191c17d03ff0795f34d34f2597f

- `KM` — một lệnh chỉ đọc khám kho tiêu thụ, in một bảng: bậc kèm lý do · executors.design.* đã nối chưa · nhóm khuôn đọc được chưa · lệnh trỏ bộ đệm có số · bản cài khớp thẻ; dòng nào cũng có lối sửa in sẵn; không có --fix trên vật của kho
- `G1` — glob của kho không hiểu `{a,b}` (pathGlobToRe)
- `G2` — glob không có cú pháp loại trừ: `*-sheet.tsx` khớp cả hai mặt không dùng khung
- `G3` — mô hình «mọi tệp trong nhóm phải dùng khuôn» khác mô hình «sổ đăng ký + cấm khối lạ trong cả thư mục» của crm: tệp phần con của ngăn bị đòi `RecordSheetFrame`, bốn chỗ báo oan
- `T1` — lưới S4 tier-mismatch đòi «eval design (static/fidelity)» mà không nói eval `cmd: config:executors.design.floor` có được tính không; kho bật surface_globs chạm chỗ này ngay vòng đầu
```
<!-- PHAM-VI-MA>>> -->

**Đã có hàng nhận, không thành mã mới.** Điểm (d) của crm, «floor chặn hex theo cả tệp, không theo dòng diff» (nên
`packages/ui` không vào được `surface_globs` vì 10 tệp mang hex hợp lệ), đúng là kết quả của hàng **DFK2**: chấm dòng
thêm/đổi trong diff, bỏ hex trong chú thích, có chú thích miễn trừ. Số đo của crm thêm vào căn cứ của DFK2 lúc hàng
mở, không thêm mã.

**Ra khỏi kho (việc của người, không vào lộ trình).** `kiem-ban-cai --may` trên Mac Studio ra ĐẠT 14 · VÀNG 15 khác
số · 22 bản ghi mồ côi. Dọn sổ plugin là việc vận hành trên máy ấy; lệnh `kiem-ban-cai` hiện có đã làm được.

**Không thuộc kit.** Luật giao diện riêng của crm (bảng «Dấu hiệu vẽ tay» thành luật oxlint, đo nợ theo khu) crm tự
làm.
