# Hạt giống — lệnh con mở đầu bằng chuyển hướng bị chân công cụ gọi tên như chương trình

**Ngày:** 2026-09-24 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: acceptance-gate-kit/_acceptance/nen-cong-cu-gan-bang-lenh-con — lượt chấm 1, mục Ngoài-4 của `review-findings.md`; owner chọn «mở hợp đồng mới» ở Cổng Bằng chứng 24/09.

## Ca

Vòng `nen-cong-cu-gan-bang-lenh-con` dạy `tuDau()` (`feature-loop/scripts/duong-nen.mjs`) tra từ
đầu của lệnh con khi lệnh đơn đầu là CHỈ phép gán. Bộ tách lệnh đơn không nhận từ chuyển hướng,
nên khi thân lệnh con mở bằng chuyển hướng thì chính chuỗi chuyển hướng bị đem đi `command -v`:
`X=$(<VERSION); make` → tra `<VERSION`, `B=$(2>/dev/null git x); make` → tra `2>/dev/null`. Cả hai
cho `nen cong-cu: THIEU …` giả — đúng lớp báo động giả vòng ấy sinh ra để xoá, và là HỒI QUY: bản
trước vá (`a1ef0a3d`) đọc hai chuỗi này ra `make` và `git`.

Quy mô đo được: 0/5 113 khoá `executors.*` trên máy tác giả có dạng này (phép quét trong Notes của
hợp đồng gốc). Cùng họ, ghi Known limits ở hồ sơ gốc: Ngoài-5 — `N=$((1+2)); lenh-ke` rơi vào
bỏ-tra thay vì tra `lenh-ke`.

## Dạng nghiệm đúng tầng

Khi chọn từ đầu, bỏ qua từ chuyển hướng (`[0-9]*[<>]…`, kèm đích của nó nếu tách rời) như bỏ qua
phép gán; `$((…))` không được đẩy vào danh sách lệnh con. Ma trận viết trước: {chuyển hướng
dính/tách, trước/sau phép gán} × {chương trình có, vắng}, so tập bullet bằng nhau như NEN-LC3.
Chiều đỏ trong lịch sử: commit ca trước vá, trên bản hiện tại ca đỏ với `THIEU <VERSION`.

TRỪ (bớt một báo động giả). Ngưỡng mở ô: một khoá thật ở kho tiêu thụ có dạng lệnh con mở bằng
chuyển hướng (đếm lại bằng `quet-kho.mjs` của hồ sơ gốc), hoặc owner gọi tên.
