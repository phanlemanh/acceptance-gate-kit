# Hạt giống — Làn ghim lại: ghi thời lượng · hoá cũ theo `paths` · suite chạy song song

**Ngày:** 2026-10-02 · **Trạng thái:** hạt giống (SỔ, chưa là ô — luật «ô chỉ mở khi có neo ngoài»
18/09). Owner gật mở sổ 02/10 sau hồ sơ điều tra
`docs/findings/2026-10-02-dieu-tra-lan-ghim-lai-va-du-bao.md`. Sống cạnh ô
`_acceptance/lan-ghim-lai-giu-tron-loi-loi/` (cùng làn; ô ấy đã hoãn «chạy theo delta» có ngưỡng
— hạt giống này là SỐ cho ngưỡng đó, không mở lại nhát đã cắt). · **Hạng dự kiến:** T2 (chạm
`feature-loop/scripts/repin-lane.mjs` và `scripts/pre-merge-check.sh`; `lib/**` không chạm nếu
`wall_s` chỉ là khoá bổ sung) · **CỘNG hai món (b, c) + TRỪ một món (a), owner phê ở Cổng Đáng.**

**Gốc:** `_acceptance/*/run-log.jsonl` crm `origin/onehub` 04/09→02/10 — 186 làn ghim, 301
hồ sơ-lượt, 3 748 eval = 28 % mọi lần chạy eval máy; proxy giờ làn từ 155 commit `repin…`:
p50 6 phút · p75 15 · Σ ≈ 15 giờ/tuần trên đường găng PR.

## Một đoạn

Hồ sơ của một nhánh hoá cũ ngay khi nhánh gộp `onehub`, vì `stale_files` so MỌI tệp đổi từ pin,
không so theo `paths` mà 95 % eval máy crm đã khai. Mỗi lần hoá cũ là một làn ghim: bốn suite nối
đuôi rồi mọi eval máy, giá ≈ 13,6 phút cố định + 0,08 phút/eval, không ghi thời lượng nên vắng
mặt ở năm dòng số. Ba món theo thứ tự: **(a)** dòng `kind: repin` thêm `wall_s` + số lệnh —
không có nó thì (b)(c) không đo được; **(b)** hoá cũ theo hợp `paths` của eval máy, hồ sơ không
khai `paths` giữ luật cũ (đường đọc-cũ), chiến dịch mốc vẫn ghim toàn bộ; **(c)** bốn suite trong
làn bắn song song, eval vẫn nối đuôi.

## Số đã đo (trên lịch sử, không phải hứa)

- Mô phỏng (b) trên 283 hồ sơ-lượt crm: **123 tránh được (43 %)**, 70/186 làn tránh trọn; **3/70**
  làn tránh được từng theo sau một bản sửa — cả ba sửa tệp test/`.githooks`, không phải mã sản
  phẩm. Kit: 95/475 tránh được, 28/124 làn.
- Làn CÓ ÍCH: 22/160 làn theo sau một bản sửa (13 mã · 9 thước) ≈ 14 %; tiền lệ nặng nhất «hợp
  nhất 88 commit vẫn xanh» (07/09) là lý do làn chạy eval. Không làm «chỉ chặn ở mốc».
- Hồi quy giá làn: cố định 13,6 phút áp đảo; eval 0–8 p50 4 phút, eval 31+ p50 9 phút → (c) cắt
  phần cố định, không phải số eval.

## Thước năm dòng (dự báo, làm cả ba)

làm-xong→quyết-được **↓** ≈ 10 giờ/tuần ở crm (làn/tuần 70 → ≈ 43; giá/làn 6 → ≈ 3 phút p50) ·
lượt gọi người **=** · vòng bị hạ tầng đốt **=** · token **=** · phút máy/lượt chấm **↓** chỉ đọc
được sau (a). **Điều kiện tin cậy:** (a) đi trước; (b) có chiều đỏ hai chiều — bản sao bỏ bộ lọc
`paths` → làn chạy như cũ; diff chạm đúng một tệp trong `paths` → vẫn hoá cũ; (c) không đổi nghĩa
xanh/đỏ — bốn mã thoát y hệt làn nối đuôi trên cùng cây.

## Phép thử mọi kho (luật 26/09)

Kho không có bão ghim (radar 1 làn/tuần): không được gì, không mất gì — (b) chỉ bớt làn khi diff
không chạm `paths`, (c) chỉ đổi cách chạy. Hành vi cũ ai dựa: lưới trước-merge và recheck đọc
dòng repin theo khoá — `wall_s` là bổ sung, chiều im phải chứng (bộ đọc 2.20.0 bỏ qua khoá lạ).
Tranh chấp tài nguyên khi (c): S4 Workflow ĐÃ chạy đúng các suite này song song qua tác nhân máy
mà không đỏ (usage-report crm, 161 lượt `bun run test`).

## Đã cắt (ghi để không mở lại như mới)

«Chỉ chặn hoá cũ ở mốc, giữa hai mốc chỉ NOTE» — cắt 85–90 % làn nhưng dời 14 % ca bắt được tới
mốc và đổi mặc định mọi kho · «cache suite theo sha» — 180/186 làn ở sha riêng, không có gì để
dùng lại · «ghim theo delta đi vòng S4» — GUIDE §7.1 đã có, nhưng tốn token hội đồng nên crm
không đi; không thay làn ghim.

## Ngưỡng mở ô

Bất kỳ một trong hai: (i) (a) xong và số đo tuần đầu cho làn/tuần ≥ 50 ở crm; (ii) owner gọi tên
sau mốc kế được một kho nhận. Mở ô thì `Gốc:` trỏ hồ sơ điều tra + dòng run-log crm ở trên.
