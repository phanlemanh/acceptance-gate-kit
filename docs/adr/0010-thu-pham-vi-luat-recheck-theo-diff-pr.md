# ADR 0010 — Thu phạm vi luật soi-lại-bằng-chứng theo diff PR

*2026-08-13 · Owner gạch tường minh («đường 3», rồi «đường (c)») trong vòng sửa 1
của hồ sơ `luu-kho-codex-va-nghi-le-design`.*

Luật `recheck` chạy lại bar bằng chứng trên **mọi** hồ sơ đã commit ở **mọi**
lượt CI. Khi hồ sơ lưu-kho gỡ khoá `executors.script.mirror_sync` (chính tiêu
chí AC-9 của nó, owner duyệt 12/08), **21 hồ sơ ĐÃ KÝ** có eval trỏ khoá ấy lập
tức chặn mọi PR sau đó — không hồ sơ nào trong 21 nằm trong diff, và không hồ sơ
nào sửa được mà không **viết vào vật đã ký** (mục *Out of scope* khai thẳng "hồ
sơ `_acceptance/` cũ là sử liệu bất biến"). Ba đường đã cân và trình owner: trả
lại khoá (mở lại AC-9) · migrate 21 hồ sơ (phá Out-of-scope) · thu phạm vi luật.
Owner gạch **thu phạm vi**, mượn nguyên ngữ nghĩa mà luật staleness đã dùng từ
1.39.2 (`stale-theo-diff-pr`, owner ký ở Cổng 1 hồ sơ ấy): bar này bảo vệ *bằng
chứng đi kèm cây ĐANG merge*, còn hồ sơ đã merge là sử liệu — soi lại chúng mỗi
lượt CI biến một quyết định đã duyệt trong quá khứ thành cái chặn mọi PR tương
lai vì lý do không liên quan gì tới PR đó. Phạm vi dùng **đúng hàm
`slug_in_diff`** mà gap-probe và staleness dùng, không dựng parser thứ ba; fail-safe
giữ nguyên (không dựng được phạm vi diff → kiểm TẤT như cũ); và việc cắt **phải
thấy được** — một dòng NOTE hằng cộng một dòng đếm đích danh số hồ sơ bị bỏ qua,
vì cắt im lặng đọc y hệt "đã phủ hết". Đo trên CI: cổng đi từ **22 vi phạm xuống
1**. Hai baseline gọi `recheck` THẲNG trên corpus (`JR11b`, `DV4a`) không đi qua
`pre-merge-check.sh` nên phép thu phạm vi không chạm tới; chúng chuyển từ ngưỡng
trần "0 fail" sang **allowlist CÓ TÊN** trong `tests/scripts/mirror-sync-grandfather.mjs`
— một bản khai, hai bên đọc chung — kèm ba ràng buộc chống trượt: chỉ che hồ sơ
có tên, chỉ che đúng MỘT lý do (thông điệp phải nhắc khoá đã chết), và kiểm hai
chiều (tên khai mà hồ sơ đã hết đỏ thì cũng ĐỎ, đòi rút tên).

**Đánh đổi, khai thẳng:** thước **thôi hồi tố**. Siết bar trong
`lib/evidence-core.cjs` về sau sẽ không tự đo lại hồ sơ cũ — đúng cơ chế vừa bắt
được 21 hồ sơ này nay im với lớp ấy. Đường cứu là cờ **`--recheck-all`**, ép quét
toàn bộ bất kể phạm vi diff; chạy nó sau mỗi lần nâng bar. Không có cờ đó thì cái
mất này vĩnh viễn chứ không phải tạm.

**Ngoại lệ đóng băng lab:** `CLAUDE.md` khoá lõi kit chỉ nhận bugfix, vòng đang
dở, hoặc đợt phẫu thuật GĐ1. Thay đổi này KHÔNG thuộc ba loại đó — nó vào được
chỉ vì owner gạch tường minh trong lúc hồ sơ lưu-kho đang bị chặn merge. Ghi ra
để lần sau không ai đọc nó thành tiền lệ tự-cho-phép.

**Trigger mở lại / đảo:** (a) 21 hồ sơ trong allowlist rời corpus, hoặc có quyết
định migrate chúng → xoá `mirror-sync-grandfather.mjs` và trả hai baseline về
ngưỡng "0 fail" trần; (b) phát hiện một bản ghi bằng chứng bị sửa tay lọt qua vì
hồ sơ của nó không bao giờ vào diff nữa → cân lại, có thể phải chạy `--recheck-all`
theo lịch thay vì chỉ theo tay.

**Kèm theo, không tách được:** trong lúc đo đã lôi ra một bugfix — `tests/scripts/run-tests.sh`
viết `check "$(basename "$_f")" 0 $?`, mà bash khai triển đối số **trước** khi
gọi `check`, nên `$(basename …)` chạy trước và ghi đè `$?` bằng mã thoát của
`basename` (luôn 0). Hệ quả: **mọi** `*.test.mjs` đỏ vẫn được ghi PASS và suite
thoát 0. Đo tại commit nền `d6044a4`: `core-untouched.test.mjs` đã đỏ trong khi
suite in `664 passed, 0 failed`. Đúng lớp **bộ-chạy-nuốt-mã-thoát** đã ghi sổ —
lần trước ở `tests/plugins` (ADR-less, ghim bằng AC-15 của chính hồ sơ này).
Không có bugfix ấy thì hai baseline trên vẫn đỏ mà không ai thấy, và quyết định
của owner sẽ được đưa ra trên một bức tranh sai.
