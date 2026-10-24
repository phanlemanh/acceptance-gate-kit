# Ghi tri thức — một lệnh, raw bất biến, răng riêng tư (TT2)

Hàng TT2 của đợt `tri-thuc-2410`, mã B1 · B2 · B3. Đứng trên TT1 (`kho-tri-thuc-va-lint`, #406): khuôn
`skills/acceptance/references/tri-thuc-template.md`, bộ đọc khối `scripts/tri-thuc-khoa.cjs`, lint và đường trỏ
`scripts/tri-thuc.mjs`. Thiết kế đợt: `docs/findings/2026-10-24-tang-tri-thuc-llm-wiki.md` §3.1, §3.3, §3.5.

## Vấn đề

TT1 cho kho một chỗ để tri thức và một lệnh kiểm, nhưng ghi vẫn là việc tay: chép tệp vào `raw/`, tự tính băm cho
`nguon.md`, tự viết frontmatter trang theo khuôn, tự commit đúng kho, tự ghép đường trỏ. Lượt cứu nguồn ở crm 24/10 làm
đúng chừng ấy bước bằng tay cho ba đợt — và người làm phải tự nhớ luật riêng tư (raw không vào kho công khai). Mỗi bước
tay là một chỗ khuôn bên ghi trôi khỏi bên đọc; luật riêng tư dặn bằng lời là đúng thứ hiến pháp kit cấm làm nghiệm.

## Thiết kế

### Một bên ghi riêng, bên đọc giữ nguyên chỉ-đọc

`scripts/tri-thuc-ghi.mjs` — bên ghi. `scripts/tri-thuc.mjs` giữ lời hứa «chỉ đọc» của TT1 (ca KT-8 dựa vào việc bên
đọc cũ không nạp mô-đun tri thức; bên ghi nạp bên đọc, không ngược lại). Bên ghi rút khuôn từ CÙNG tệp khuôn, cùng hàm
`napKhuon` mở rộng thêm hai khối:

- `TRI-THUC-RAW` (đã có) — khuôn `nguon.md`; bên ghi điền frontmatter `loai/goc/luc/ai` và sinh dòng tệp theo khuôn
  dòng `TRI-THUC-RAW-DONG` (bên đọc dùng chính biểu thức ấy).
- `TRI-THUC-NGUON` (mới) — năm loại nguồn và luật hình dạng của từng loại, một dòng mỗi loại.

```
node scripts/tri-thuc-ghi.mjs --root . --loai <loại nguồn> --goc '<gốc>' --ten <tên> --tep <tệp> [--tep <tệp>…] \
  --trang <loại trang>/<tên>.md [--than <tệp thân>] [--ma A1,A2] [--ai <tên>] [--luc YYYY-MM-DD] [--khong-commit]
```

### Năm loại nguồn (B2)

| Loại | Gốc | Luật hình dạng |
|---|---|---|
| `phien` | mã phiên hay đường bản ghi phiên | gốc không rỗng; tệp trích do phiên viết ra |
| `artifact` | URL | gốc mở đầu `https://` |
| `issue` | URL hay `<chủ>/<kho>#<số>` | gốc khớp một trong hai dạng |
| `tep-may` | đường tệp ở máy này | mọi `--tep` nằm NGOÀI kho tiêu thụ (nằm trong kho thì là `tep-kho`) |
| `tep-kho` | đường tệp trong kho tiêu thụ | mọi `--tep` được git theo dõi trong kho tiêu thụ |

Sai luật → thoát 2, câu lỗi gọi tên loại và luật. Loại lạ → thoát 2, liệt đúng năm loại rút từ khối.

### Raw bất biến (B1)

`raw/<luc>-<ten>/` nhận bản sao các tệp và `nguon.md`. Thư mục đã có: mọi tệp trùng băm và cùng tập tệp → dùng lại,
in «dùng lại raw»; commit vẫn chạy khi raw chưa được git theo dõi hay trang đổi (ca phiên bị ngắt trước commit, hay
lần trước chạy `--khong-commit`), chỉ bỏ commit khi không có gì đổi; khác → thoát 2 «raw bất biến: <thư mục> đã có nội dung khác — nguồn mới là thư mục
mới», không byte nào đổi. Gốc chưa có `TRI-THUC.md` → ghi từ khối `TRI-THUC-LUAT` (thay `<kho>` bằng tên kho) và đi cùng
commit.

### Trang wiki (B1)

`--trang` là đường dưới `wiki/`; đoạn đầu là loại trang, phải thuộc khối `TRI-THUC-LOAI`. Trang chưa có → frontmatter
theo đúng thứ tự khoá của `TRI-THUC-TRANG` (`ma` từ `--ma`, `nguon` = các tệp raw vừa ghi, `cap_nhat` = `--luc`) + thân từ
`--than` (bắt buộc khi tạo). Trang đã có → gộp `nguon` và `ma` (giữ thứ tự, không trùng), đổi `cap_nhat`, thay thân chỉ
khi có `--than`.

### Commit và đường trỏ (B1)

Commit ở kho git của gốc tri thức (kho riêng khi khai `kho`, kho tiêu thụ khi chỉ `noi`), `git add` ĐÚNG thư mục raw, trang
và `TRI-THUC.md` khi vừa tạo — không bao giờ `-A`. Lệnh KHÔNG đẩy: đẩy là bước của người hay phiên, và lint TT1 đã đỏ
`kho-rieng-chua-day` khi kho riêng có commit chưa đẩy. In mỗi tệp một dòng `raw: <đường trỏ>` / `trang: <đường trỏ>` theo khuôn
`TRI-THUC-CON-TRO` (tiền tố `<kho>:` khi gốc là kho riêng) và một dòng `commit: <sha>`.

### Răng riêng tư (B3)

1. Kho khai `cong_khai: true` mà không khai `kho` → raw sẽ nằm trong kho công khai: lệnh thoát 4, KHÔNG ghi tệp nào, in
   câu hỏi khó-đảo «kho công khai chưa có kho riêng — raw đẩy lên kho công khai không thu hồi được» kèm hai lối: tạo kho
   riêng rồi khai `tri_thuc.kho` (khuyến nghị) · bỏ `cong_khai` nếu kho thật sự không công khai. Áp cho CẢ năm loại nguồn
   — cùng luật với lint `raw-trong-kho-cong-khai` của TT1, nên bên ghi không bao giờ sinh thứ bên đọc đỏ. Không cờ nào
   mở lối ghi raw vào kho công khai.
2. **Nơi giữ raw** — kho git của gốc tri thức: kho riêng khi khai `kho`, kho tiêu thụ khi chỉ khai `noi` — có remote
   GitHub thì hỏi `gh repo view <chủ>/<kho> --json visibility` TRƯỚC khi ghi, BẤT KỂ có khai `cong_khai` hay không (lời
   tự khai có thể quên; phản biện 24/10 TT2 P0-2). Remote lấy từ `kho.remote` khi khai, vắng thì `origin` của kho git
   ấy; bộ tách nhận năm dạng: `https://github.com/<chủ>/<kho>` có hay không `.git`, `git@github.com:<chủ>/<kho>(.git)`,
   `ssh://git@github.com/<chủ>/<kho>(.git)`. `PUBLIC` → thoát 4 «nơi giữ raw đang công khai trên GitHub: <chủ>/<kho>»,
   không ghi. Không hỏi được (không có `gh`, chưa đăng nhập, mất mạng) → thoát 4 «không kiểm được nơi giữ raw có riêng
   tư không — <lý do>», không ghi (Hỏi-1 ở Cổng Phạm vi: máy khuyên chặn; lối khác là cảnh báo rồi ghi). Remote không
   phải GitHub → một dòng `cảnh báo: remote không phải GitHub — không kiểm được riêng tư: <remote>` rồi ghi. Không có
   remote → không có gì để lộ, ghi.

### Mã thoát

0 đã ghi (hoặc dùng lại) · 2 đầu vào sai hay không chạy được · 3 không đọc được ở đây (kho riêng khai mà máy chưa có bản —
cùng dòng `git clone` của TT1) · 4 câu hỏi khó-đảo cho người (riêng tư). Mọi mã khác 0: không tệp nào trong gốc tri thức
hay kho tiêu thụ đổi. Thứ tự giữ lời hứa ấy: kiểm MỌI đối số, khuôn, loại nguồn và riêng tư TRƯỚC khi ghi byte nào;
commit hỏng (hook của kho đỏ, thiếu danh tính git) → hoàn lại đúng các tệp lệnh vừa ghi (xoá thư mục raw mới, trả trang
và `TRI-THUC.md` về bản trước), thoát 2 kèm nguyên văn lỗi git.

### Lối vào cho người và phiên

`tri-thuc/commands/ghi.md` — `/tri-thuc:ghi`: phiên gom nguồn ra tệp tạm (trích phiên chat, tải artifact, chép issue),
viết thân trang tóm, chạy đúng dòng trong khối `TT-GHI-LENH`, đọc mã thoát theo bảng trên; mã 4 → trình nguyên văn câu
hỏi cho người, không tự chọn lối. Không khoá model-invocation (cùng nếp `kiem.md`): ghi là việc phiên làm hộ người, đảo
được bằng `git revert` trên kho của tri thức.

## Đối chiếu luật kit

| Luật | Thiết kế |
|---|---|
| Cấm dặn-bằng-lời làm nghiệm | Luật riêng tư thành mã thoát 4 có ca đo năm loại × hai chiều; khuôn bên ghi rút từ khối marker bên đọc dùng. |
| Bằng chứng không tự dối | Mọi ca: chiều xanh trên kho thử lành trước, rồi mutant gỡ đúng một vế ghim thông điệp. Ghi xong chạy lint TT1 thật trên kết quả. |
| Khó-đảo luôn là câu hỏi | Đẩy raw lên kho công khai là khó-đảo → thoát 4, không cờ vượt. Lệnh không đẩy. |
| Sửa vì một kho cân mọi kho | Kho không khai `tri_thuc` → lệnh thoát 2, không bên đọc nào đổi. |
| ≤ 3 lượt gọi người | Không thêm lượt vào vòng; lượt người mới chỉ khi kho công khai chưa có kho riêng (một lần mỗi kho). |

## Giới hạn đã khai

- Máy không chứng được thân trang tóm «đã làm sạch» (findings §5, ngưỡng: 1 lần chủ kho phải gỡ nội dung khỏi kho công
  khai vì trang tóm → mở răng quét trang tóm). Ở kho có kho riêng, trang cũng nằm trong kho riêng — rủi ro chỉ ở kho
  không khai `kho`.
- Kiểm độ riêng tư chỉ cho remote GitHub qua `gh`; remote khác in cảnh báo không kiểm được. Kho đổi sang công khai SAU
  khi ghi thì lệnh ghi không thấy — lint TT1 vẫn chỉ đỏ theo lời khai `cong_khai`.
- `tep-may` tin lời gọi rằng tệp là tệp «chỉ có ở một máy» — máy chỉ kiểm nó không nằm trong kho tiêu thụ.
