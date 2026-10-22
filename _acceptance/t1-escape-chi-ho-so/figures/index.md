# Hình tại điểm quyết định — t1-escape-chi-ho-so

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 tệp gốc `_acceptance/` thôi tính là hồ sơ (sổ d-…-7) | hai nhánh rẽ | `cay-phan-loai` |
| Hỏi-2 chỉ hồ sơ cổng chấm được mới tính (sổ d-…-10) | hai nhánh rẽ | `cay-phan-loai` |
| Hỏi-3 tệp gốc tự thân không chịu cổng (sổ d-…-9) | hai nhánh rẽ | `cay-phan-loai` |
| Gap-probe P0 `human-gate1` | trùng Hỏi-1, Hỏi-2 | `cay-phan-loai` |

## Đề bài `cay-phan-loai`

- Loại hình: cây quyết định (flowchart rẽ nhánh), một tệp trong diff PR đi từ trên xuống.
- Nút: «tệp dưới `_acceptance/`?» → không: phân loại thường (T3 / ngoài-T1 / T1). Có → «nằm trong `_acceptance/<slug>/` của CHÍNH cổng (`<ROOT>/_acceptance/`)?»
  → không (tệp gốc: config.yaml, README.md — 22; hồ sơ fixture ngoài `_acceptance/` của cổng, vd `tests/fx/_acceptance/f/` — 2, Hỏi-2) [Hỏi-1: không tính là hồ sơ · Hỏi-3: cũng không chịu cổng] ; có →
  «`<slug>/contract.md` có ở HEAD?» → không (thư mục rác · chỉ opportunity.md · hồ sơ bị xoá) [Hỏi-2: không tính] ;
  có → «hồ sơ thật — thoả răng T1-escape».
- Nhãn số đo trên ba nhánh «không tính»: tệp gốc 22 commit · fixture 2 · không hợp đồng 3 · chỉ opportunity.md 4 · xoá 0 (9 kho,
  từ 01/06).
- Lá cuối hai cột: «răng nổ nếu PR có tệp T3/ngoài-T1» vs «răng thoả».
- AC liên quan: AC-1, AC-2, AC-5.
