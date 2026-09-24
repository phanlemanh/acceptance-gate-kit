# Hạt giống — «đã thử lại một lần vẫn chặn vì hạ tầng» chỉ là một dòng stderr; s4-args vẫn thoát 0 và ra args cho round kế

**Ngày:** 2026-09-24 · **Trạng thái:** hạt giống (SỔ, chưa là ô)
Gốc: acceptance-gate-kit/_acceptance/ha-tang-khong-dot-luot — lượt chấm 2, mục Ngoài-2 của `review-findings.md`; owner chọn «mở hợp đồng mới» ở Cổng Bằng chứng 24/09.

## Ca

Vòng `ha-tang-khong-dot-luot` (AC-4) cho `s4-args.mjs` thử lại CÙNG round một lần khi lượt BLOCKED
vì hạ tầng. Đã thử lại một lần mà vẫn chặn thì script in một dòng stderr «… trình thẻ Cổng Bằng
chứng (cạnh gãy), không chấm tiếp», nhưng vẫn ghi tệp args cho `base + 1` và thoát 0. Bất biến
«thử lại MỘT lần» (khối ĐỊNH VỊ, K8) vì vậy chỉ được giữ bằng lời dặn cho phiên — đúng thứ hiến
pháp cấm («cấm dặn-bằng-lời làm nghiệm»). Phiên bỏ qua stderr sẽ chạy lượt thứ ba, và lượt ấy
đếm vào trần.

## Dạng nghiệm đúng tầng

Nhánh `daThuLai` thoát ≠ 0 với mã có tên (như các nhánh `die` của chính s4-args), không ghi tệp
args; `--round N` tường minh vẫn thắng khi người chủ động muốn chấm tiếp. Chiều đỏ: bản sao gỡ
nhánh thoát → hàng «BLOCKED hạ tầng đã thử lại» của ma trận AC-4 lại ra args round kế, exit 0.

TRỪ (bớt một đường chạy lặng). Ngưỡng mở ô: owner đã gọi tên ở Cổng Bằng chứng; cần neo ngoài
(hồ sơ kho tiêu thụ hoặc lượt chấm thật chạm nhánh này) trước khi thành ô.
