# 0006 — Chốt fail-closed đặt ở ĐẦU RA: `clean` phải được chứng minh bằng sổ

2026-07-27 · feature `premerge-rules-ledger`. Bốn bản vá parse liên tiếp trong
`scripts/pre-merge-check.sh` (round 4-6 của `t1-escape-event-scope`: chặn
`--*` → mở rộng `-*` → chặn cờ ở vị trí giá trị → `find` thay glob) đều đúng
từng cái một mà tổng không hội tụ, vì đó là blacklist trên một không gian đầu
vào MỞ. Thay vì vá lần thứ năm, đảo mặc định ở đầu ra: `LEDGER_EXPECTED` là
danh sách ĐÓNG (`per-slug gap-probe t1-escape`), mọi khối luật ghi sổ qua đúng
một hàm `ledger_mark <ran|declared-off> <tên>`, và một điểm nghẽn trước kết
luận so hai chiều (tên thiếu → `VIOLATION [ledger]: luật <tên> không chạy và
không khai tắt`; tên thừa → `VIOLATION [ledger]: tên lạ <tên>`), cả hai exit 2.
Chốt này bắt được cả lỗ CHƯA nghĩ ra vì nó không cần biết đầu vào hỏng kiểu gì
— base nuốt cờ, `continue` lạc, biến rỗng, khối bị comment nhầm đều làm một tên
thiếu trong sổ. Mỗi mark cố ý nằm trên hai đường dẫn độc lập về lexical (vòng
đếm slug riêng dùng biến `_sd`; counter scope gap-probe đặt NGOÀI khối có thể
bị tiêm) để một lần tiêm không vô hiệu được cả luật lẫn kế toán của nó. **Giới
hạn phải nói thẳng:** lối thoát sớm `no _acceptance/ — nothing to check` nằm
TRƯỚC mọi `ledger_mark`, nên một ROOT trỏ vào thư mục hợp lệ mà không có
`_acceptance/` (CI đặt sai `working-directory`, chạy từ subdir) vẫn exit 0 mà
không một dòng sổ nào — đúng hình dạng "xanh mà không chạy luật nào" mà sổ sinh
ra để chặn. Sổ KHÔNG phủ được trường hợp đó; chốt nằm ở phía consumer, nên GUIDE
chỉ cách fail-closed bằng việc đòi dòng `pre-merge-check: rules ran=` phải có
mặt. Đổi hành vi của lối thoát đó là việc của một contract khác — repo chưa cài
kit là trạng thái hợp lệ, và `RL6a` đang ghim đúng hai lối `exit 0`.

Mark của mỗi luật phải được quyết ở **đúng một** chỗ, sau khi đã biết trọn lịch
sử lần chạy. Bản đầu đặt hai one-shot độc lập cho `gap-probe` — `declared-off`
trong `gap_probe_not_enforced()`, `ran` trong vòng lặp per-slug — nên một lần
chạy mà classifier thành công ở slug này và thất bại ở slug kia ghi CẢ HAI tên;
chokepoint đếm 2 rồi exit 2, biến một suy giảm advisory (theo thiết kế chỉ NOTE)
thành chặn cứng VÀ nuốt luôn dòng kết luận violation thật, đồng thời phát đúng
lời khuyên sai cho người đọc ("không phải lỗi của bạn, báo maintainer"). Bài học
tổng quát: kế toán rải rác theo nhánh thì mỗi nhánh mới là một cơ hội ghi lệch —
gom về một điểm quyết định, và khi lần chạy chỉ cưỡng chế được MỘT PHẦN thì câu
trả lời trung thực là `declared-off`, không phải `ran` (case `RL13`).

**Trade-off đã nhận:** (a) exit 2 là một lớp thoát MỚI trên CI của consumer —
nó nghĩa "lỗi nội tại của cổng", không phải "PR của bạn vi phạm", nên script in
kèm một dòng hướng dẫn nói thẳng điều đó và bảo báo maintainer thay vì đi sửa
feature; (b) mọi khối luật thêm sau này PHẢI khai tên vào `LEDGER_EXPECTED` —
quên thì suite kit đỏ (`RL7a` ở tầng script, `P48` ở tầng plugins, cả hai kèm
đối chứng đột biến) chứ không thành lỗ im lặng; (c) `enforcement: off` tắt cả
sổ, theo tiền lệ off-là-off-toàn-cục của hook — `warn` thì KHÔNG hạ điểm nghẽn,
vì sổ lệch là lỗi của cổng chứ không phải vi phạm của feature nên không có mức
"nhắc". Hệ quả về chữ: AC-3 của `gap-probe-presence-hook` viết "mode `off` thì
KHÔNG in gì về gap-probe" — nay vẫn đúng về Ý (luật im lặng) nhưng dòng sổ kế
toán `declared-off gap-probe` vẫn hiện; suite lọc dòng sổ ra khỏi assertion
im-lặng thay vì sửa contract đã ký.

**Phương án đã loại:** vá vòng parse lần thứ năm (không hội tụ — chính là lý do
tồn tại của feature này); chuyển vòng parse sang Node (đúng hướng chất liệu vì
`argv` là mảng đóng, nhưng script phải chạy được khi consumer vắng `node` ở mode
advisory — AC-14 của `gap-probe-presence-hook` cho phép trạng thái đó; revisit
khi sổ chạy ổn, ledger `d-20260726T200100Z-302`).
