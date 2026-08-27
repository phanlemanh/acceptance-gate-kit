---
slug: thuoc-nhan-de-khoi
at: 2026-08-27T10:25:37Z
sinh_boi: chinh thuoc check_label_occlusion.py — khong viet so tay
---

# Quét vùng ngoài lưới — report-only (AC-8)

Hai vùng cố ý KHÔNG vào lưới thường trực (entry descope trong decisions.jsonl):
hồ sơ `_acceptance/*/figures` đã ký + assets vendored của skill diagram-design.

tong_file_san: 160
# tong_file_san la SAN (>=): ho so KHAC them/bot hinh tang-2 la hop le.
# tong_occluded + danh sach giu DANG THUC — do moi la loi khai phai tai lap duoc.
tong_occluded: 9
tong_warn: 19
tong_error: 2

## OCCLUDED
```
OCCLUDED diagram-design/skills/diagram-design/assets/example-architecture-dark.html nhan "READ MDX" khoi [416,240,160,64] chong 12.0x8.0px
OCCLUDED diagram-design/skills/diagram-design/assets/example-architecture-dark.html nhan "QUERY" khoi [416,240,160,64] chong 8.0x8.0px
OCCLUDED diagram-design/skills/diagram-design/assets/example-architecture-full.html nhan "READ MDX" khoi [416,240,160,64] chong 12.0x8.0px
OCCLUDED diagram-design/skills/diagram-design/assets/example-architecture-full.html nhan "QUERY" khoi [416,240,160,64] chong 8.0x8.0px
OCCLUDED diagram-design/skills/diagram-design/assets/example-architecture.html nhan "READ MDX" khoi [416,240,160,64] chong 12.0x8.0px
OCCLUDED diagram-design/skills/diagram-design/assets/example-architecture.html nhan "QUERY" khoi [416,240,160,64] chong 8.0x8.0px
OCCLUDED diagram-design/skills/diagram-design/assets/example-state-dark.html nhan "CREATE" khoi [120,160,160,80] chong 48.0x16.0px
OCCLUDED diagram-design/skills/diagram-design/assets/example-state-full.html nhan "CREATE" khoi [120,160,160,80] chong 48.0x16.0px
OCCLUDED diagram-design/skills/diagram-design/assets/example-state.html nhan "CREATE" khoi [120,160,160,80] chong 48.0x16.0px
```

## WARN / ERROR
```
ERROR _acceptance/ra-co-ten-lam-va-trao/figures/the-cong-bang-chung.html khong co khoi <svg> nao de quet
ERROR _acceptance/ra-co-ten-lam-va-trao/figures/the-cong-pham-vi.html khong co khoi <svg> nao de quet
WARN diagram-design/skills/diagram-design/assets/example-data-flow-dark.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-data-flow-full.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-data-flow.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-datalake-full.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-datalake.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-dp-integration-dark.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-dp-integration-full.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-dp-integration.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-high-level-full.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-high-level-vertical-full.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-high-level-vertical.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-high-level.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-loop-dark.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-loop-full.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-loop-terminal.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-loop.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-process-dark.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-process-full.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
WARN diagram-design/skills/diagram-design/assets/example-process.html bo qua phan tu mang gia tri khong hieu (don vi/cu phap la) — bat dinh roi ve SOT co tieng, khong doan thanh khoi che
```

Đọc kèm: 9 ca OCCLUDED đều trong assets vendored (2 ca gốc × 3 biến thể:
READ MDX + QUERY ở example-architecture, CREATE ở example-state). Hồ sơ đã
ký: 0 ca. 2 ERROR là hai thẻ cổng HTML không chứa svg — sau đảo chiều
fail-closed, file được nêu tên mà không có gì quét thì khai ra thay vì im.
Theo entry descope, việc sửa assets là quyết định riêng của owner (revisit).
