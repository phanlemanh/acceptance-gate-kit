---
slug: thuoc-nhan-de-khoi
at: 2026-08-27T03:28:20Z
sinh_boi: chinh thuoc check_label_occlusion.py — khong viet so tay
---

# Quét vùng ngoài lưới — report-only (AC-8)

Hai vùng cố ý KHÔNG vào lưới thường trực (entry descope trong decisions.jsonl):
hồ sơ `_acceptance/*/figures` đã ký + assets vendored của skill diagram-design.

tong_file_san: 160
# tong_file_san la SAN (>=): ho so KHAC them/bot hinh tang-2 la hop le.
# tong_occluded + danh sach giu DANG THUC — do moi la loi khai phai tai lap duoc.
tong_occluded: 9
tong_warn: 2

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

## WARN
```
WARN _acceptance/ra-co-ten-lam-va-trao/figures/the-cong-bang-chung.html khong co khoi <svg> nao
WARN _acceptance/ra-co-ten-lam-va-trao/figures/the-cong-pham-vi.html khong co khoi <svg> nao
```

Đọc kèm: 9 ca OCCLUDED đều trong assets vendored (2 ca gốc × 3 biến thể:
READ MDX + QUERY ở example-architecture, CREATE ở example-state) — mẫu mà
hình tương lai copy. Hồ sơ đã ký: 0 ca. Theo entry descope, việc sửa assets
là quyết định riêng của owner (revisit) — hồ sơ này không chạm.
