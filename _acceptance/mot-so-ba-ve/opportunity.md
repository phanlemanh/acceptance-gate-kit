---
schema_version: 1
slug: mot-so-ba-ve
feature: Một sổ quyết định, ba vế một câu — decision · why · cost_if_wrong viết cho người ký; cầu nối máy đưa ruling của superpowers vào sổ trước khi workspace bị xoá; thẻ Cổng 1/2 in một dòng ba vế
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: 
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
---

## Vấn đề & ai gặp

Gốc: crm/_acceptance/tro-ly-okr-de-xuat — khối «Rulings I made» 28/09 in 11 ruling, 4 có mã sổ, 7 chỉ sống trong chat

Vòng crm `tro-ly-okr-de-xuat` chạy S3 dưới superpowers 6.4.1. Cuối phiên, máy in mười một
quyết định nó tự đưa ra trong lúc làm, kèm giá nếu sai; bốn dòng có mã `decisions.jsonl`,
bảy dòng không — trong đó có một ruling đổi thành phần dùng chung `packages/ui` Item, hệ
quả lan mọi màn dùng Item, mà thẻ Cổng 2 không trình. Ledger của superpowers ở
`.superpowers/sdd/<plan>/progress.md` bị gitignore và tự xoá ở Finish; khối chat chỉ còn
trong transcript trên máy owner. Luật bằng lời «đổi hướng thì append `fix`/`descope`»
(feature-loop SKILL dòng 188) đạt 36 %.

Người trả giá: owner ký Cổng 2 mà không thấy bảy quyết định máy đã làm thay mình; người
đọc hồ sơ sau nhiều tháng không có gì để lật lại. Máy trả giá thứ hai: cùng một quyết định
đang được viết hai lần — dòng máy trong sổ và câu dịch trong `card-plain.json` — vì dòng
sổ viết bằng tiếng máy (`decision` nhét «vì sao» sau dấu gạch, `impact` trộn ba ý).

Owner phê CỘNG bằng **ADR 0021** (29/09). Ba việc, thứ tự bắt buộc:

1. **Khuôn dòng sổ**: `decision` · `why` · `cost_if_wrong`, mỗi trường một câu; sửa dòng
   schema và khối lệnh append ở feature-loop SKILL «Sổ quyết định»; `impact` giữ làm đường
   đọc-cũ.
2. **Thẻ**: `gate-card.js` in một dòng ba vế khi đủ trường, rơi về `plDec` rồi `decLine`
   khi thiếu — sửa luôn lỗ khối «Đã duyệt từ Gate 1» chỉ gọi `decLine`
   (chip task_f63c6488, phiên crm 28/09). Ca đo round-trip: dòng do lệnh append sinh phải
   in đúng ba vế; chiều im: dòng cũ chỉ có `impact` in như hôm nay.
3. **Cầu nối cuối S3**: đọc dòng `Ruling:` trong ledger superpowers, cắt ba vế theo khuôn
   «— Vì sao: … Sai thì tốn: …», append provisional `stage: S3`; không có ledger → im + cờ
   vàng. Ca đo: fixture là ledger do superpowers sinh trong lần chạy, không viết tay
   (`crm/.superpowers/sdd/2026-09-19-vao-bang-email-va-mat-khau/progress.md` là mẫu còn
   sót, 7 dòng Ruling thật).

Rà cùng lớp (29/09, chưa mở việc — hạt giống, xem «Ngưỡng»): «Trả lại: <lý do>» ở Cổng 2
không ghi trường nào, lý do chỉ sống trong chat; `veto` ghi lý do mà không ghi giá; cột
Xử lý của gap-probe (`deferred`/`rejected: <lý do>`) thiếu «sai thì tốn gì». Known limits
(TÊN · NGƯỜI GỠ · GIÁ) và `.out-of-scope/` (Quyết định · Vì sao · Căn cứ) đã đúng ba vế
từ trước — tiền lệ trong chính kit.

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: sau vòng crm kế tiếp chạy S3 dưới superpowers, bao nhiêu ruling
  trong khối «Rulings I made» có mã sổ, và thẻ Cổng 2 có in đủ số đó không.
- SỐNG: 100 % ruling có mã sổ (đếm bằng khối chat cuối S3 so với `decisions.jsonl`), thẻ
  Cổng 2 in một dòng ba vế cho mỗi mã, `decisions_plain` của hồ sơ đó rỗng mà thẻ vẫn đọc
  được bằng tiếng người.
- CHẾT: cầu nối im mà không cờ vàng khi ledger vắng; hoặc dòng cũ chỉ có `impact` in hỏng.
- Không mở việc cho ba chỗ cùng lớp ở trên trong vòng này; chúng chỉ thành việc khi vòng
  này ship và owner gọi tên — luật chiều rộng (b).
- Timebox: một vòng meta, buộc vào mốc 2.19 mà crm sẽ cài.
