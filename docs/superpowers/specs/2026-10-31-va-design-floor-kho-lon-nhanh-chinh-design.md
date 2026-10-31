# Vá design-floor: kho lớn và nhánh chính tên khác — thiết kế

Hồ sơ `_acceptance/va-design-floor-kho-lon-nhanh-chinh/` · issue phanlemanh/acceptance-gate-kit#460 · T2 · vào 2.36.1.

## Vấn đề

1. `scripts/design-floor-bac.mjs` gọi `git ls-files` không đặt `maxBuffer`. Danh sách tệp trên 1 MiB → `ENOBUFS`;
   `catch` nuốt lỗi thành `[]`, kho đã khai `design.surface_globs` bị xếp M0 với lý do «không khớp tệp nào». Bậc M0
   làm S1, S3, S4 của sàn thiết kế trả về sớm — im lặng ở mọi kho lớn.
2. `timBase` (`scripts/design-floor-s4.mjs`, `design-floor-s3.mjs` dùng lại) chỉ dò `origin/main`, `origin/master`,
   `main`, `master`. Kho có nhánh chính tên khác (crm: `onehub`) → S3 và S4 thoát 1. Khối gọi S3 nằm trong SKILL của kit,
   không truyền `--base`, nên kho không tự vá được.

Lỗi 1 che lỗi 2: kho kẹt M0 thì S3 trả về trước khi tìm base. Sửa một mà không sửa hai thì crm đổi từ «im lặng» sang
«S3 thoát 1».

## Thiết kế

### Bậc: đọc được hay không đọc được, không có «rỗng giả»

- `git ls-files` chạy với `maxBuffer: 64 MiB` (đúng mức `design-floor-s4.mjs` và `design-floor-s3.mjs` đang dùng) và
  giữ stderr của git.
- Lời gọi lỗi (git hỏng, không phải kho git, vẫn vượt 64 MiB) → `docBac` ném lỗi «không đọc được danh sách tệp git
  (<lý do>)». Không còn đường biến lỗi thành danh sách rỗng.
- Lệnh bậc thoát 1 kèm một dòng stderr nêu lỗi; ba lệnh S1/S3/S4 gọi `docBac` cũng thoát 1 với cùng dòng (S3/S4 đã có
  `try/catch` ở `main`; S1 thêm). Kho không khai `surface_globs` không gọi git — vẫn M0, không in gì, như cũ.
- Không đổi cách đọc danh sách (không thêm `-z`): đổi cách trích tên tệp có dấu là đổi kết quả khớp glob ở kho đang
  chạy, ngoài phạm vi vá.

### Base: đọc nhánh chính mà bản sao cục bộ đã biết, rồi mới tới tên quen

`timBase(root)` dò theo thứ tự:

1. `git symbolic-ref --quiet --short refs/remotes/origin/HEAD` — bản sao cục bộ đã ghi nhánh mặc định của remote (git
   ghi khi clone; `git remote set-head origin -a` làm mới). Có tên `origin/<X>` → thử `origin/<X>`, KHÔNG thử nhánh cục
   bộ `<X>`: khi `origin/<X>` không còn (remote đổi master→main rồi `fetch --prune`), nhánh cục bộ `master` là bản cũ —
   chọn nó là so diff với một mốc sai (phản biện context sạch bắt ca này ở bản thiết kế đầu).
2. Bốn tên cũ, đúng thứ tự cũ: `origin/main`, `origin/master`, `main`, `master`.
3. Không ref nào cho `merge-base` → lỗi. Không có origin/HEAD → thông điệp cũ nguyên văn. Có origin/HEAD mà không giải
   được → thông điệp nêu tên đã khai.

Vì sao không gọi `git remote show origin` như `feature-loop/scripts/s4-args.mjs`: lệnh ấy gọi mạng mỗi lần (s4-args đặt
trần 10 s), mà S3/S4 của sàn thiết kế chạy ở máy không mạng (CI đặt `DESIGN_FLOOR_KHONG_MANG=1`). origin/HEAD cục bộ là
bản chép của chính câu trả lời ấy, không cần mạng.

Vì sao origin/HEAD trỏ ref không còn (remote đổi tên nhánh, `fetch --prune` đã xoá ref cũ) thì LÙI về bốn tên cũ thay vì
dừng như luật của s4-args: s4-args đọc remote sống nên tên khai là sự thật; origin/HEAD cục bộ là bản chép có thể cũ, và
kho đổi master→main xong là đúng ca này. Dừng ở đây là bắt một kho đang chạy được (bản 2.36.0 chọn `origin/main`) thành
thoát 1 — luật «sửa vì một kho phải cân trên mọi kho».

Không dùng chung mã với s4-args: s4-args thuộc gói feature-loop, đọc remote sống, thứ tự cục-bộ-trước; đổi nó là đổi
đường chấm S4 của mọi kho (khoá DO1 và ngoài phạm vi vá). Hai bộ dò khác nguồn có chủ ý — khai ở Notes của hợp đồng.

### Cùng lớp: lệnh con đọc stdout không đặt trần bộ đệm

Quét `scripts/design-floor-*.mjs`: mọi `execFileSync`/`spawnSync` đọc stdout mang `maxBuffer: 64 MiB`. Hôm nay còn thiếu ở
`design-floor-bac.mjs` (ls-files — lỗi 1), `design-floor-s1.mjs` (git tải tri thức, `goiUi`), `design-floor-s3.mjs`
(lệnh sinh lại của kho — lệnh dựng in nhiều là thật), `design-floor-s4.mjs` (`goiUi`). Với đầu ra dưới 1 MiB, thêm trần
không đổi gì; vượt 1 MiB thì hôm nay lệnh con bị giết và đọc thành «thoát null».

### Khoá DO1

Không đổi luật chấm hex thô, bảng chặn theo bậc, lệnh `ui`. Kho dùng `main` có origin/HEAD → origin/main (invest): base
chọn được là `origin/main` như bản cũ. Danh sách tệp dưới 1 MiB: cùng danh sách. Ca kiểm so trọn đầu ra (stdout, stderr,
mã thoát) của bản sửa với cây phát hành 2.36.0 (ghim sha 4f891b07) trên kho nhỏ dùng `main`.

Một ô khác 2.36.0 có chủ ý: origin/HEAD → origin/master trong khi origin/main cũng còn — bản sửa so với nhánh remote đã
khai, bản 2.36.0 so với origin/main. Không chạm invest (origin/HEAD → origin/main).

## Đo

Ca sống ở `tests/design-floor/kho-lon-nhanh-chinh.mjs`. Bản gốc = `git archive 4f891b078abae111b60301e31984961362d8da08
scripts lib` (trọn thư mục, ghim sha: điểm rẽ khỏi nhánh chính sẽ là chính bản vá sau khi gộp). Fixture do mã sinh trong
lượt: kho git thật; kho lớn dựng chỉ mục bằng `git update-index --index-info` (một blob, hàng nghìn đường dài) nên không
ghi hàng nghìn tệp lên đĩa; kho nhánh `onehub` clone từ một remote trần để origin/HEAD do chính git ghi. Mỗi ca có chiều
xanh trên bản sửa, chiều đỏ trên bản gốc với thông điệp ghim, và đột biến trên bản sao lệnh.

## Không làm

- Khoá cấu hình nhánh chính trong `_acceptance/config.yaml` (kit chưa có; thêm là CỘNG cần chủ kho phê).
- Kho không có origin/HEAD mà nhánh chính tên khác — không remote, hoặc checkout kiểu CI (init + remote add + fetch,
  git không ghi origin/HEAD): vẫn thoát 1 như 2.36.0. Đường gỡ: `git remote set-head origin -a` ở bước checkout, hoặc
  `--base` (giới hạn khai).
- Đổi bộ dò của `s4-args.mjs` hay khối gọi trong SKILL.
- `scripts/pre-merge-check.sh` (vòng vá song song của phiên khác).
