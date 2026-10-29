# Thiết kế: chân công cụ xét tệp tồn tại (TC5)

Hồ sơ `cong-cu-xet-tep-ton-tai` · hàng TC5 của `docs/plans/lo-trinh-kit.json` · Cổng Đáng `build` 25/10.

## Vấn đề

Chân `cong_cu` của đường nền (`feature-loop/scripts/duong-nen.mjs`) hỏi máy «chương trình này có không?»
bằng `command -v` trên TỪ ĐẦU của mọi khoá `executors.*`. Khuôn kit của `executors.design.ui_check` là một
ĐƯỜNG TỆP `.js` — tay cầm cho bộ kiểm giao diện, không phải chương trình chạy được — nên khi kho ghi đường
thật (không qua `${CLAUDE_PLUGIN_ROOT}`), `command -v` thoát 1 vì tệp không có quyền chạy, và chân đỏ «THIẾU»
ở mọi dãy dù tệp nằm trên đĩa. Tái hiện: hạt giống `docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md` mục 4.

Người hưởng: người ký Cổng Phạm vi ở mọi kho ghim đường tệp thật cho một khoá executor — một cờ «nền đỏ»
sai lý do là cờ người học cách bỏ qua (nguyên tố 2, bằng chứng không tự dối).

## Lối chọn

Thêm MỘT nhánh vào chân công cụ, giữa luật bỏ-tra-cú-pháp-shell (giữ nguyên) và `command -v` (giữ nguyên):

```
từ đầu mang cú pháp shell (${…} $(…) ` ( {)  → bỏ tra, in một dòng stderr   (như cũ)
từ đầu chứa «/»                               → xét tệp có tồn tại (stat, là tệp thường)
tên trần đuôi .js .mjs .cjs                   → xét tệp ở gốc kho, không có thì command -v
còn lại (tên trần)                            → command -v                    (như cũ)
```

«Đường tệp» = từ đầu chứa `/`, hoặc là tên trần mang đuôi `.js` `.mjs` `.cjs` (đúng đề xuất của hạt giống).
Tên trần đuôi kịch bản vẫn được tra PATH khi không có ở gốc kho: trước vòng nó xanh nếu nằm trên PATH, nên
bỏ tra PATH là một hồi quy (phản biện F1).
Đường tương đối giải theo GỐC KHO — mọi lệnh của kho chạy với `cwd` là gốc kho (`bashNguoiGoi`), không theo
thư mục người gọi đường nền. Xét `statSync(...).isFile()` (theo liên kết mềm): tệp vắng, liên kết gãy hay
thư mục đều là đỏ. Không xét quyền chạy — câu chân này trả lời là «công cụ có trên máy không».

Dòng đỏ dùng lại mã khuôn `cong-cu-thieu` có sẵn: `nen cong-cu: THIEU <đường> (khoa <khoá>)` — đúng tên,
không đổi khuôn ở `skills/acceptance/references/duong-nen-template.md`, không đổi bộ đọc thẻ.

Hai hàm của nhánh mới đặt trong MỘT khối marker `CONG-CU-DUONG-TEP` để ca đột biến tiêm được đúng chỗ:
`laDuongTep(tu)` và `coTep(tu)`.

## Không làm

- Giải `${CLAUDE_PLUGIN_ROOT}` để xét tệp: câu giao giữ dòng bỏ-tra như cũ cho khoá dạng ấy.
- Giải `~/`: hôm nay `command -v '~/x'` cũng đỏ (không mở rộng `~` trong nháy); hành vi không đổi.
- Xét quyền chạy cho đường tệp: một đường `./run.sh` không có quyền chạy nay xanh ở chân công cụ — nếu nó là
  lệnh suite thì chân suite vẫn đỏ khi chạy.

## Đo

Hai lượt fixture (khuôn NEN-LC: khoá ngoài `suite_keys`, kèm khoá đối chứng bỏ-tra): lượt «có» chỉ mang
khoá trỏ tệp có thật (kể cả `executors.design.ui_check` tuyệt đối — đúng vị trí sự cố) và phải cho mã 0, chân
XANH; lượt «vắng» mang khoá trỏ chỗ không có tệp và phải cho đúng tập bullet viết trước. Ba đột biến trên bản
sao (`laDuongTep` luôn sai · `coTep` luôn đúng · chỉ nhận `.cjs`), bản sao chưa tiêm phải cho đúng kết quả trước. Ca cũ NEN0, NEN1, NEN-TD1…TD6, NEN-LC1…LC3 giữ nguyên.
Chiều đỏ nằm trong lịch sử: commit ca trước, commit vật sau.
