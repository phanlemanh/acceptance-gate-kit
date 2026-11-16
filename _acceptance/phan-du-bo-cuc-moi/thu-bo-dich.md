# Task 1b — chạy thử bộ dịch trên ba tệp khó (đo, không giao)

Nguồn: KIT `e35dc6f9` (HEAD lúc dựng; nhánh đã đi tiếp ở phiên khác trong lúc đo — worktree tạm `git worktree add` từ HEAD ấy, đã gỡ) · đo 15/11/2026 09:45–10:20 (+07) · Node
24.16.0 · timebox bước sửa 90 phút, dùng khoảng 25 phút (sửa 09:52–10:05 và một vá 10:15, còn lại là chạy đo). Phần sửa thử KHÔNG vào
commit nào; bản vá giữ ở scratchpad phiên (`thu-bo-dich.diff`, 8 tệp, +139/−113; vá cuối — `CLAUDE_PLUGIN_ROOT` ở LT-138/LT-150 — đo lại riêng năm ca ấy ở cả hai bố cục, xanh).

Cách đo:
- bố cục cũ: chạy từng tệp ở worktree tạm, so túi khoá `chuanHoa` (luật B2) với nền ghi trước khi sửa;
- kho mới: dựng từ CÂY LÀM VIỆC của worktree tạm — `dungKhoMoi` (bước 1–3) + chép mọi thứ ở lại gốc (`tests/`,
  `_acceptance/`, `docs/`, `GUIDE.md`, …) + `luatDoiChu()` lên `tests/**` (32 tệp đổi chữ) — rồi gắn lịch sử của KIT
  (`clone --shared --no-checkout`, commit cây mới làm con của HEAD) để ca đọc commit cũ (archive, merge-base) có đối
  tượng; chạy ba tệp ở gốc kho mới; khoá đích = cột `khoa` của `khoa-dich.tsv` bỏ `scripts: `, khoá cấp tệp = mã 0.
- đối chứng: ba tệp CHƯA sửa ở kho mới về 0/41 · 0/43 · 0/21 (chết ngay ở `scripts/lo-trinh.mjs không tồn tại`,
  `scripts/gate-card.js` ENOENT, DJ-1 đỏ).

| Tệp | Khoá về / đích | Cũ giữ đủ? | Hình dạng bộ dịch không phủ |
|---|---|---|---|
| `lo-trinh.test.mjs` | 41/41 | có — 291/291 khoá nền, mã 0 | không (H1, H2, H4, H5, H6, H7 — đều là cách dùng) |
| `doc-jsx-va-ban-do-hong.test.mjs` | 43/43 | có — 42/42, mã 0 | không (H1, H4, H6) |
| `khoi-khuon-tren-the-cong.test.mjs` | 21/21 | có — 20/20, mã 0 | không (H1, H3, H4, H6) |

Ngoài đích, ở kho mới `lo-trinh.test.mjs` còn đỏ đúng ba khoá LT-142, LT-142-do, LT-142-do-nhanh: `scripts/cat-luot.mjs`
của sản phẩm vẫn đọc `skills/cat-luot/SKILL.md` sau khi skill đổi tên `scope-slice` — mã sản phẩm (B2), không khoá
nào của vòng này, bộ dịch không chạm được. (LT-138, LT-150 cũng đỏ ở lượt đầu, nhưng vì phía tệp kiểm — hình dạng H4 —
và đã về sau vá.)

Kho mới KHÔNG mang lịch sử (thư mục `dungKhoMoi` trơn như `bo-cuc.test.mjs` dựng): 0/43 · 0/21 · lo-trinh đỏ mọi ca
so commit cũ — mỗi chỗ ném câu có tên (`bo-cuc: e4a399ed không phải commit ở …`), không lùi lặng về phẳng; nhưng
doc-jsx và khoi-khuon ném ở tầng đỉnh nên cả tệp chết. Thước `--moi` của Task 2 phải dựng kho mới CÓ lịch sử.

## Hình dạng không phủ

Không hình dạng nào bắt đổi Interfaces của Task 1: mọi chỗ khó giải được bằng `duong`/`tep`/`pathspec`/`gocGoi`/`tenGoi`
hiện có. Bảy hình dạng dưới đây là CÁCH DÙNG lặp lại; hai cái (H1, H5) đáng một hàm tiện ích, ghi dưới dạng đề xuất —
chưa sửa `tests/bo-cuc.mjs`.

- **H1 — bung/chép lõi theo danh sách thư mục.** `lo-trinh.test.mjs:108` (`banSao`), `:898 :1775 :1811 :2234 :2546
  :2982` (bảy `git archive <ref> scripts lib skills`), `khuon-loi-kho-mau.mjs:151` (`banSaoTiem`),
  `doc-jsx-va-ban-do-hong.test.mjs:84`, `khoi-khuon-tren-the-cong.test.mjs:53,108`, `tat-rd1.mjs:153`. Dịch từng phần
  tử là đủ, NHƯNG bản sao phải mang theo `.claude-plugin/marketplace.json` — không có thì `duong(…, {thuMuc: bản sao})`
  ném BC-THIEU (đúng thiết kế). Đã viết tay cùng một hàm ba lần (`chepBoPhan`, `archiveRef`/`bungRef`). Đề xuất (tuỳ
  chọn, đổi Interfaces): `boPhan(ds, cay) -> string[]` — dịch từng phần tử theo cây, tách thư mục nửa đi nửa ở (H2) và
  luôn kèm tệp khai chợ; dùng được cả cho `pathspec` (`{kho, ref}`) lẫn `cpSync` (`{thuMuc}`).
- **H2 — `.claude-plugin` nửa đi nửa ở trong danh sách thư mục.** `tat-rd1.mjs:153` chép cả thư mục `.claude-plugin`;
  `duong('.claude-plugin', kho mới)` chỉ ra nửa ở gốc (chợ), `plugin.json` của lõi rơi mất mà không lỗi. Đã vá bằng khai
  thêm `.claude-plugin/plugin.json`. Đây là chỗ duy nhất bộ dịch trả đúng chữ mà sai nghĩa; đề xuất: `duong` ném
  `bo-cuc: <rel> tách ở <cây>: dùng boPhan` khi đường là một thư mục mà `tep_loi` có tệp con, hoặc gộp vào `boPhan` (H1).
- **H3 — trộn thư mục của cây đứng vào bản bung commit cũ.** `khoi-khuon-tren-the-cong.test.mjs:109` chép `skills/` của
  cây đang kiểm vào bản bung phẳng của merge-base; ở kho mới nó mang `scope-slice` vào chỗ mã cũ tìm `cat-luot` → KK-6 đỏ
  («không đọc được SKILL cắt lượt»). Vá: chép TỪNG MỤC con, đích `duong(path.relative(KIT, mục), {thuMuc: bản bung})`
  (bộ dịch đảo `doi_ten_tep` đúng). Cách dùng; luật Task 8 nên thêm một dòng «thư mục có tệp đổi tên bên trong → dịch
  từng mục con, không chép nguyên thư mục».
- **H4 — gốc gói nằm trong chuỗi lệnh hay cờ.** `lo-trinh.test.mjs:692` (`${CLAUDE_PLUGIN_ROOT}` → `KIT`),
  `lo-trinh.test.mjs:2463,3276` (`env.CLAUDE_PLUGIN_ROOT = kit` — bỏ sót ở lượt sửa đầu, chỉ lộ khi chạy kho mới),
  `khoi-khuon-tren-the-cong.test.mjs:371` (`AG='${kit}'`), `doc-jsx-va-ban-do-hong.test.mjs:318` (`--ag-root kit`).
  Năm chỗ đều nghĩa «gốc gói lõi», không phải gốc kho → `gocGoi({thuMuc: kit}, 'loi')`. Không có răng tĩnh nào bắt chỗ
  sót: ở bố cục phẳng gốc kho = gốc gói nên mọi chỗ sót đều xanh. Phủ; luật Task 8 chỉ nói đường
  chuỗi, nên nêu thêm «biến/cờ gốc gói → gocGoi».
- **H5 — gốc trong chuỗi đầu ra được thay bằng giữ chỗ.** `lo-trinh.test.mjs:1793` (LT-100): so JSON quét với
  v2.21.0 sau khi thay gốc kho bằng `<kit>`; ở kho mới dòng «vẽ bằng: node <kit>/plugins/acceptance-gate/scripts/…»
  lệch. Vá: thay `gocGoi(…, 'loi')` thay vì gốc kho. Phủ, cách dùng.
- **H6 — tệp phụ trợ không có trong danh sách tệp của cụm.** Ba tệp kiểm kéo theo năm mô-đun phải sửa cùng:
  `gate-fixture.mjs:13` (11 tệp kiểm dùng), `khuon-loi-kho-mau.mjs:151,161` (5 tệp), `tat-rd1.mjs:153,156`,
  `lo-trinh-mau.mjs:45-46`, `lo-trinh-mau-trang.mjs:38-39`. Không phải hình dạng của bộ dịch, nhưng `khoa-dich.tsv` và
  danh sách Task 8 xếp theo tệp kiểm nên bỏ sót; sửa một mô-đun chung làm đổi hành vi của tệp kiểm ngoài cụm (ở đây
  `khuon-loi`, `ban-do-khuon-roi-nhom`, `khuon-doc-ban-do-that` không đo). Đề xuất: Task 8/K4 liệt mô-đun phụ trợ thành
  dòng riêng và chạy mọi tệp nhập nó ở bố cục cũ.
- **H7 — tên chợ trong đường bộ đệm plugin.** `lo-trinh.test.mjs:613,1421`
  (`cache/acceptance-gate-kit/acceptance-gate/9.9.9`): tên gói → `tenGoi(cay, 'loi')` phủ; tên chợ không có hàm, chỉ
  sống nhờ `luatDoiChu` đổi chữ trong `tests/**` ở kho mới. Đề xuất nhỏ (tuỳ chọn): `tenCho(cay) -> string` đọc `name`
  của `marketplace.json`, để tệp kiểm không dựa vào bước đổi chữ của B2.

Đọc kết quả cho giả định chốt sinh tử 1: ở đúng ba tệp khó nhất, bộ dịch đủ — 105/105 khoá đích về
và bố cục cũ không mất khoá nào; chi phí nằm ở cách dùng (H1–H6), không ở Interfaces. Không cần sửa Task 1 trước Task 2.
