# ADR 0028 — Luật bằng chứng cũ chỉ kéo hồ sơ vào xét khi PR chạm tệp vật

*2026-10-31 · hồ sơ `chi-tep-vat-keo-xet-lai` (issue #468) · chủ kho duyệt ở Cổng Phạm vi, Hỏi-1 «áp cho mọi kho».*

AC-3 của hồ sơ `stale-theo-diff-pr` (1.39.2) cố ý để «chạm hồ sơ thì bị soi lại»: PR đang đổi một hồ sơ phải mang
bằng chứng tươi. Ở kho crm, lý do ấy đổ giá sai chỗ: hai việc dọn chữ (lùi timebox ở 52 hồ sơ, chốt ngưỡng ở 51)
kéo **111 hồ sơ** phải ghim lại — khoảng 1 098 lệnh eval, ước 13 giờ máy — dù `verified_commit` không ghim hai tệp
được sửa và `stale_files` vốn đã loại `_acceptance/**`. Từ bản này, RIÊNG luật bằng chứng cũ của
`scripts/pre-merge-check.sh` đọc vị từ mới `slug_vat_in_diff`: hồ sơ chỉ vào xét khi PR đổi một **tệp vật** của
nó. Tệp chữ được liệt đích danh trong khối `TEP-CHU-HO-SO` của `lib/evidence-core.cjs` — đúng `opportunity.md` và
`decisions.jsonl` ở gốc thư mục hồ sơ, TRỪ khi `paths` của một eval phủ chúng; mọi tệp khác (kể cả tệp lạ, tệp
thư mục con trùng tên) là vật, và không phân được thì cũng là vật. Hồ sơ bỏ qua in một dòng NOTE đích danh (luật
«cắt phải thấy được» của ADR 0010). `slug_in_diff` KHÔNG đổi: gap-probe, soi lại (ADR 0010), chữ ký mới trong
diff, cửa veto ghi-ngược và chưa-arm vẫn xét hồ sơ có tệp bất kỳ trong diff.

**Đánh đổi, khai thẳng:** một PR vừa đổi mã mà hồ sơ X đo, vừa chỉ sửa tệp chữ của X, nay không bắt X — y như PR
đổi mã đó mà không chạm X, chỗ ADR 0010 đã chấp nhận cho hồ sơ ngoài diff. Lối khoá bật theo lựa chọn (kho khác
không đổi byte nào) đã cân và bị loại ở Cổng Phạm vi: kho vấp sau phải tự tìm ra khoá.

**Trigger mở lại / đảo:** (a) một hồ sơ gộp với mã trôi mà lẽ ra luật cũ bắt, và PR ấy chỉ sửa tệp chữ của nó →
cân thêm khoá bật theo lựa chọn; (b) kho nào vấp một tệp chữ khác của khuôn kit (gap-probe.md, usage-report.md …)
→ thêm vào khối `TEP-CHU-HO-SO`, không thêm danh sách thứ hai.
