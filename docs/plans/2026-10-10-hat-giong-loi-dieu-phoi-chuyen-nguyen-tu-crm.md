# Hạt giống — bốn lỗ hành vi của lõi Điều phối – Thợ chuyển nguyên từ crm

Gốc: `_acceptance/dieu-phoi-dong-goi-loi/` (lượt chấm 1 ngày 10/10/2026, Cổng Bằng chứng ký 10/10 —
Ngoài-3, Ngoài-4, Ngoài-5, owner: mở hợp đồng mới; cộng dòng sổ d-…-19 «lỗ machine-cleared», owner phê ở
«Treo: phê hết»). Hạt giống là SỔ, không phải ô: chỉ mở thành ô khi có neo ngoài — một đợt thử thật (crm
~26/10, OneFlow ~27/10) vấp đúng lỗ. Gộp theo lớp: cả bốn là hành vi của bản crm `a9e8bc75a` mà hợp đồng
DP1 cấm sửa (chỉ cho sửa bốn chỗ AC-8, AC-10, AC-11, AC-12).

## Lỗ

1. **Duyệt chạm tệp khi không dò được nhánh mở (Ngoài-3, nặng).** `nhanhMo()` trong
   `dieu-phoi/scripts/phat-lich.mjs` nuốt lỗi của `gh pr list` (chưa đăng nhập, không có trong PATH của bộ
   phát lịch, quá 30 giây) và trả tập rỗng; nhánh nào `git diff` lỗi (PR từ fork, nhánh chưa fetch) thì bỏ
   qua. `xetChamTep` thấy không nhánh nào chạm tệp nên máy duyệt, với lý do «không nhánh mở nào chạm» —
   ngược với điều đã kiểm. Mọi ca test đều giả `gh` trả `[]`.
2. **Nhánh của chính phiên bị coi là xung đột (Ngoài-4).** Ngữ cảnh thật đặt `nhanhCua: () => null`, nên bộ
   lọc loại nhánh của chính người xin không loại gì; phiên xin chạm lại tệp mà PR của nó đang sửa bị đẩy lên
   `can_phan` — một lượt gọi người/giám sát thừa.
3. **Một tệp lạ trong `khoa/` làm tắt nhịp (Ngoài-5).** `chamNhip` đọc `chu.json` dưới mọi mục của `khoa/`;
   gặp `.DS_Store` thì `ENOTDIR`, hook nuốt lỗi bằng `catch {}`; `.DS_Store` xếp trước `s4` nên khoá S4 đang
   chạy không còn nhịp, hết hạn thuê thì bị thu hồi và có thể cấp cho phiên khác — hai lượt S4 chồng nhau.
4. **Hàng gộp ở `machine-cleared` không tính là đã gộp (sổ d-…-19).** `tienDoCua` chỉ coi `signed-off` trên
   nhánh chính là `gop`; hàng đi làn V (hoặc `da-cham-boi-thuc-te`) bị đọc là «đang làm» nên dãy không bước
   sang hàng kế.

## Hướng

Một vòng «lõi điều phối biết hết trạng thái và không nuốt lỗi»: (1) dò nhánh lỗi → `can_phan` nêu lỗi, không
duyệt máy; (2) điền `nhanhCua` từ `hang-viec.json`/worktree của dãy; (3) `chamNhip` bỏ qua mục không phải
thư mục và ghi lỗi ra sự kiện thay vì nuốt; (4) `tienDoCua` đọc tập trạng thái «đã gộp» từ MỘT nguồn của kit
(bộ phân loại trạng thái dùng chung), có ca cho `machine-cleared`. Mỗi mục một cặp ca hai chiều trên cùng
fixture.

Ngưỡng mở ô: ≥1 đợt thử thật (crm hoặc OneFlow) vấp một trong bốn lỗ, có sự kiện trong `su-kien.jsonl`
của đợt làm neo.
