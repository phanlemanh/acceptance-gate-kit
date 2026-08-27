---
schema_version: 1
slug: lan-v-thoat-kiem-stale
feature: Làn máy thoát phép kiểm bằng-chứng-cũ ở cổng trước-merge
owner: manh@mstar.vn
stage: discovery            # discovery | decided | archived
decision:              # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:
prototype:
  base_commit:
  disposition:
---

## Vấn đề & ai gặp

Nhánh xanh-sạch trong cổng trước-merge `continue` TRƯỚC khối kiểm bằng-chứng-cũ,
nên mọi hồ sơ đi làn máy thoát hoàn toàn phép kiểm đó — đo thật 27/08: 63 hồ sơ
bị bắt stale, riêng hồ sơ làn-máy có mã đổi sau verify thì lọt và cổng in màu
xanh. Cùng họ: ngăn «ngoài hợp đồng» của báo cáo bốc hơi ở bước tổng hợp (8
finding → section rỗng), nên điều kiện xanh-sạch được thoả bằng sự VẮNG MẶT của
dữ liệu chứ không bằng sự sạch thật. Người trả giá: owner — lời hứa «máy đi
trước nhưng lưới vẫn canh» của cả làn máy (21 hồ sơ đang mở cửa veto) mất một
nửa mà không ai thấy. Đề bài đầy đủ:
`docs/plans/2026-08-27-hat-giong-lan-v-thoat-kiem-stale.md`.

## Ngưỡng chết / ngưỡng UAT

Không đo được theo phiên nghiệm thu — vòng nội bộ engine, không có người dùng
cuối; thước thành công là chiều đỏ tự chứng: hồ sơ làn-máy xanh-sạch có
verified_commit cũ phải bị cổng VIOLATION, và báo cáo có N finding ngoài hợp
đồng mà section rỗng phải đỏ.

## Cổng 0

Chưa ký — chờ owner quyết build/park.
