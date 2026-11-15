# Gửi B2 — phan-du-bo-cuc-moi

Danh sách cho kịch bản chuyển nhà của B2 (`migration/kich-ban/` của kho `delivery-loop`), design §8: mục vá nào của
`va-bo-kiem.json` mà vòng này làm thừa thì kịch bản dừng ở bước 6 («vá không khớp»). Mục 1 do MÁY ghi —
`node _acceptance/phan-du-bo-cuc-moi/rang/giu-khoa.mjs --ghi-gui-b2` (bảng vá chép ở `rang/va-bo-kiem-b2.json`, luật bước 6
chép ở `rang/buoc6-chep.mjs`); `--chieu-do` rút lại và so (GUI-B2). Đừng sửa tay khối máy.

## 1. Mục vá thừa trong `va-bo-kiem.json`

Mục `{tep, cu}` mà sau bước 1–3 + luật chung bước 6 trên HEAD, chuỗi `cu` không còn khớp đúng `so_lan` lần.

<!-- <<<GUI-B2-VA-THUA -->
máy ghi: 0/348 mục của va-bo-kiem-b2.json không còn khớp (rút từ HEAD lúc ghi)
```jsonl
```
<!-- GUI-B2-VA-THUA>>> -->

## 2. Cấu hình kịch bản phải đổi

- `.claude/settings.json` — (Task 6 điền: lệnh trong `permissions.allow` ở kho mới).
- `bo_kiem.tep_goc` — (Task 10 điền).

## 3. Ca đổi nghĩa và lý do

(Task 6–9 ghi khi sửa.)
