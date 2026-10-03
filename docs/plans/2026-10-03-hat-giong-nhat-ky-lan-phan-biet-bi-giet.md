# Hạt giống — nhật ký làn ghim lại phân biệt «lệnh bị giết / bị cắt» với «lệnh đỏ thật»

**Ngày:** 2026-10-03 · **Trạng thái:** hạt giống (SỔ, chưa là ô — luật «ô chỉ mở khi có neo ngoài»).
Gốc: acceptance-gate-kit/_acceptance/lan-ghim-lai-giu-tron-loi-loi/ — Ngoài-4 của lượt chấm 4, owner
định tuyến «mở hợp đồng mới» ở Cổng Bằng chứng 03/10.

## Hình dạng

`runCmd` của `feature-loop/scripts/repin-lane.mjs` quy `r.status === null` về `exit = 1`. Nhật ký trọn
chỉ ghi `# mã thoát: 1` cùng stdout/stderr, không ghi `r.signal` hay `r.error` (ENOBUFS khi đầu ra
vượt `maxBuffer` 256 MiB). Lệnh bị hệ điều hành giết vì hết bộ nhớ, đúng ca máy dùng chung 02/10 mà
dòng `tai` sinh ra để đọc, thành một lần đỏ không phân biệt được với test hỏng thật.

## Hướng nghiệm (chưa chọn)

Đầu tệp nhật ký và mục `lenh_do` mang thêm `tin_hieu` + `loi_khoi_chay`; cắt đầu ra thì ghi dấu cắt.

## Ngưỡng mở ô

≥ 1 dòng `repin-do` ở crm hoặc kit mà `tai.swap_used_mb` cao và người chẩn đoán sai «test hỏng» vì
nhật ký không nói lệnh bị giết — đếm ở ngưỡng UAT của ô gốc (10 lượt đỏ kế tiếp).
