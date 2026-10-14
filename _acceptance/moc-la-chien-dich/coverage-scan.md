# Quét độ phủ — moc-la-chien-dich (preset entity-feature)

## Ngữ cảnh
- Sản phẩm: kit nghiệm thu — thực thể là **một hàng lộ trình** (`docs/plans/lo-trinh-kit.json`, crm `docs/plan/lo-trinh-*.json`)
  ở lúc nó có hồ sơ đang mở. Chân sản phẩm: đào repo `[SUY-TỪ-REPO: scripts/lo-trinh.mjs]`,
  `[SUY-TỪ-REPO: docs/plans/2026-10-14-hat-giong-hien-trang-sau-doi-tai-khoan.md]` (nhánh PR #350) và số đo 14/10 trên crm
  `onehub` @1997da85 (ô cơ hội của vòng).
- Chân ngành: `[NGÀNH: GitHub Issues — bộ lọc no:milestone]` (việc đang mở không thuộc milestone nào là một danh sách
  riêng, không phải lỗi) · `[NGÀNH: Linear — Projects + Project milestones]` (việc gắn dự án và mốc; view nhóm theo
  dự án) · `[NGÀNH: Jira — Fix Version]` (việc chưa có Fix Version hiện riêng trong báo cáo phát hành). Cả ba: thiếu
  mốc là **cờ/bộ lọc**, không chặn tạo việc → khớp ý «chỉ cảnh báo».

## Bổ sung sau ADR 0025 (14/10)
Thực thể mở rộng thêm **một hồ sơ đang mở** (không chỉ một hàng) và **một kho** (khai hay chưa khai lộ trình). Cờ B:
hồ sơ đang mở không thuộc việc nào (crm 10, kit 15); cờ C: kho chưa khai lộ trình (4/6 kho tiêu thụ). Nấc 3 → Later
(Hỏi-3), nấc 2 và 4 → Later (plugin `lo-trinh`).

## Trục
- Trục A — trạng thái hàng: chưa có hồ sơ · có hồ sơ chưa bắt đầu (cân nhắc / sắp mở) · đang làm (chờ duyệt / đang
  dựng) · đã giao · đóng khác (xếp lại / đã bác / hỏng / không suy được)  [thước CE: `DANG_LAM_O`, `CHUA_LAM_O`,
  `DA_GIAO_O` trong scripts/lo-trinh.mjs — danh sách đóng]
- Trục B — quan hệ với mốc: không thuộc mốc nào · đúng một mốc · nhiều mốc  [thước CE: khoá `moc[].hang`]
- Trục C — kho: không khai lộ trình · khai nhưng không lộ trình nào có mốc · một lộ trình có mốc · nhiều lộ trình (một
  số có mốc)  [thước CE: sáu kho tiêu thụ đo 14/10 — 4 không khai, crm 3 lộ trình (19 · 6 · 0 mốc), kit 1 lộ trình]
- Trục D — mặt hiện: trang (chỗ cần sửa + ô hàng) · khối dữ liệu · thẻ start · `--check` · lệnh mở việc (`--mo-o`)
  · ô cơ hội · SKILL S0  [thước CE: các bên đọc của `kq.co` và `--mo-o` liệt bằng grep 14/10]

Nguồn tên (lớp cross-cutting của trục D): tên ngắn hàng `ten_ngan` · `ten` · câu giao; tên ngắn mốc `ten_ngan` · cắt
tên dài · có/không ngày; tên lộ trình `ten_ngan` · `ten` · tên tệp; tên kho từ thư mục kho.

## Không gian (A × B, theo từng kho C)
Ô có nghĩa cho cờ: A ∈ {chưa bắt đầu có hồ sơ, đang làm} × B = không mốc → **cờ**. Mọi ô khác → **không cờ** (đối
chứng). Kho C = «không mốc» → toàn bộ không cờ (như cũ).

## Core
1. Hàng có hồ sơ đang mở × không mốc × kho có mốc → cờ vàng ở trang + khối (AC-1).
2. Kho không mốc / không khai → trang từng byte như trước vòng (AC-2).
3. Cờ không chặn: `--check` xanh trên trang vẽ mới (AC-3); bảng dịch giữ đếm (AC-4).
4. Một hàm tên phiên + nhóm với ma trận nguồn tên (AC-5); lệnh mở việc in nó (AC-6); ô cơ hội mang dòng mốc (AC-7);
   SKILL khai khoá một nguồn (AC-8).
5. Dữ liệu thật crm + kit, trước/sau (AC-9, AC-10).

## Later
- Bản đồ hiện trạng ba cột (Đã xong · Đang dở · Kế tiếp) và trường «bước kế» máy đọc — phần còn lại của hạt giống #350.
- Chip gói `dieu-phoi` gọi cùng hàm (vùng M5) — vòng này chỉ ghi chỗ nối.
- Cờ riêng cho hàng thuộc ≥2 mốc (đo 14/10: 0 hàng ở cả bốn lộ trình) — vòng này chọn mốc ngày sớm nhất.
- Đóng nhóm thanh bên khi mốc qua.

## Never
- Kit ghi vào tệp lộ trình hay tự gắn mốc thay kho — kit chỉ đọc (luật của bộ đọc lộ trình).
- Chặn mở vòng khi hàng chưa có mốc — trái ý «chỉ cảnh báo» và luật 26/09 (không đổi mặc định).
- Nhét trạng thái (chờ ký, đang chấm) vào tên phiên — tên đặt một lần, trạng thái đổi liên tục (hạt giống #350).

## Cross-cutting áp mọi ô Core
- Mỗi phép đo mới có cặp hai chiều trên cùng kho thử, thông điệp ghim; kho thử do code sinh trong lượt.
- So «như cũ» bằng bộ máy ở commit gốc của vòng (`git archive` trọn `scripts lib skills`).
