# Review findings: viec-ke-theo-plan (round 2)

## Trong hợp đồng

Không có finding nào trong hợp đồng ở round này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Gate-close commits stage only PRODUCT-MAP.md, so the LO-TRINH.html written in the same pass is left out and CI --check fails (r1)**
  Người dùng thấy gì: Kho nào khai lộ trình rồi duyệt hoặc ký một vòng thì trang lộ trình được vẽ lại nhưng không vào commit đóng cổng. Kiểm tra trên PR sẽ báo đỏ ở mỗi lần đóng cổng cho đến khi người ta tự thêm trang đó vào tay.
  file: `scripts/product-map.mjs`
  severity: high
  Đề xuất: new-contract

- **P99 mutant copy extends a hand-written file list instead of copying whole directories (r1)**
  Người dùng thấy gì: Một phép thử cũ của kit có thể báo đỏ nhầm khi sau này thêm một script mới, dù tính năng không hỏng. Người dùng cuối không bị ảnh hưởng, chỉ người bảo trì mất công tìm nguyên nhân.
  file: `tests/plugins/run-tests.sh`
  severity: medium
  Đề xuất: known-limits

- **Free-text `/feature-loop` arguments break the S0 roadmap-row command (unquoted `<mã>`), and the resulting exit 2 has no handling rule (r1)**
  Người dùng thấy gì: Khi người dùng gõ một mô tả dài thay vì mã hàng để bắt đầu vòng, bước nhận hàng có thể báo lỗi lạ thay vì coi đó là mô tả công việc. Họ phải gõ lại hoặc tự hiểu lỗi.
  file: `feature-loop/skills/feature-loop/SKILL.md`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): ô hồ sơ của «crm OKR thật» do tay khai trong `_nguon.ho_so`, cờ lệch ở hàng 7n do chính fixture dựng ra (r1)**
  Người dùng thấy gì: Dữ liệu mẫu mô phỏng lộ trình thật của kho crm được dựng tay, nên việc trang đọc đúng trên mẫu chưa chứng minh đọc đúng trên lộ trình thật. Chỉ khi kho thật chuyển sang tệp mới biết chắc.
  file: `tests/scripts/fixtures/lo-trinh/crm-okr.json`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
