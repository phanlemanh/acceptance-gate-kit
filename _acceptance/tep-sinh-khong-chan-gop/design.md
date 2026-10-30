# Thiết kế — tep-sinh-khong-chan-gop (hàng TC3)

Ô: `_acceptance/tep-sinh-khong-chan-gop/opportunity.md` (Cổng Đáng `build` 25/10). Hàng TC3 của
`docs/plans/lo-trinh-kit.json`. Hạt giống `docs/plans/2026-10-16-hat-giong-tep-sinh-xung-dot-moi-lan-goi.md` (đề xuất 1)
và `docs/plans/2026-10-26-hat-giong-muoi-loi-kit-tu-dot-cam-mau-onehub-invest.md` mục 1. Đầu vào thêm: M5 báo ở kit #308
mục c2 (29/10) — Hỏi-1.

## 1. Một kết quả

Ở kho đã bật, gộp nhánh chính vào nhánh PR không dừng ở `PRODUCT-MAP.md` hay `LO-TRINH.html`; người gộp sinh lại hai
tệp, và nếu quên thì `product-map.mjs --check` đỏ đúng tệp lệch. Kho không bật thấy git y như hôm nay.

## 2. Vì sao xung đột, và vì sao xung đột ấy vô nghĩa

Hai tệp do `scripts/product-map.mjs` sinh trọn từ nguồn (hồ sơ `_acceptance/` + tệp lộ trình). Mỗi PR commit bản vẽ của
mình vì CI `--check` đòi bản vẽ khớp nguồn trên chính đỉnh PR. Nên hai PR sửa hai nguồn khác nhau vẫn đụng nhau ở tệp
sinh, và mỗi lần nhánh chính dời là một lần dừng gộp ở một tệp không ai sửa tay. Cách gỡ đúng duy nhất cho xung đột ấy
là vẽ lại từ nguồn đã gộp — nội dung hai phía không giúp gì.

## 3. Cơ chế: driver gộp «giữ bản mình», bật theo lựa chọn

Kho bật bằng hai thứ, cả hai rút từ MỘT khối máy đọc `GITATTR-TEP-SINH` trong `GUIDE.md`:

1. Hai dòng trong `.gitattributes` của kho:
   ```
   PRODUCT-MAP.md merge=tep-sinh
   LO-TRINH.html merge=tep-sinh
   ```
2. Một lệnh mỗi bản clone (mọi worktree của bản clone dùng chung cấu hình):
   `git config merge.tep-sinh.driver true`

Driver `true` thoát 0 và để nguyên bản của nhánh đang đứng, nên git ghi tệp là đã gộp sạch. Bản vẽ ấy cũ so với nguồn
vừa gộp → `--check` đỏ đúng tệp → người gộp chạy `node <product-map.mjs> --root .` rồi commit. Đường thoát của git:
thuộc tính trỏ driver chưa khai trong cấu hình thì git gộp văn bản như thường — máy chưa chạy lệnh cấu hình thấy xung đột
y như hôm nay (thử 30/10 trong kho tạm: không thuộc tính → thoát 1; thuộc tính, chưa cấu hình → thoát 1; đủ hai → thoát 0).

Kit tự bật cho chính nó: `.gitattributes` của kit mang hai dòng của khối, và bản clone của máy này chạy lệnh cấu hình.

### Lối đã loại

- **`merge=union` (driver dựng sẵn của git, không cần cấu hình máy).** Loại: union ghép dòng hai phía thành bản vẽ lai
  ở mọi công cụ gộp CÓ áp nó — mà công cụ nào áp thì kit không kiểm được cho mọi kho (chưa kiểm GitHub; kho tiêu thụ có
  thể dùng forge khác, hàng đợi gộp, gộp phía máy chủ của app). Ở công cụ áp union, tín hiệu xung đột của forge biến mất
  với tệp sinh — đúng tín hiệu `gop.mjs` đọc (`mergeable === 'CONFLICTING'`), và PR có CI cũ gộp được bằng nút với bản vẽ
  lai. Driver tên riêng thì ở công cụ nào không có cấu hình cũng rơi về dừng như hôm nay — hành vi cũ không đổi ở đâu
  ngoài bản clone đã chạy lệnh cấu hình (luật 26/09: «hành vi cũ có ai đang dựa không?»).
- **Driver tự vẽ lại trong lúc gộp.** Loại: git gọi driver từng tệp giữa chừng, khi tệp nguồn chưa chắc đã ghi xong — bản
  vẽ sinh ra có thể từ nguồn nửa gộp.
- **Sửa `gop.mjs` để không tính tệp sinh là trùng tệp.** Loại: PR và nhánh chính cùng sửa bản vẽ mà gộp nhanh không chạy
  lại CI thì nhánh chính nhận bản vẽ của PR — sai so với nguồn đã gộp. Hạng I của `ky-den-gop` đã chốt «trùng thì như cũ».
- **Job sau gộp tự vẽ và commit trên nhánh chính / `--check` chỉ cảnh báo ở PR** (đề xuất 2 của hạt giống 16/10). CỘNG,
  đổi lưới; luật 26/09 đòi đo trên hai kho trước. Later.

## 4. (Hỏi-1) Thư mục rỗng trong `_acceptance/` không làm bản vẽ lệch bản clone sạch

M5 (#308 c2, 29/10): một thư mục rỗng chưa theo dõi trong `_acceptance/` (vết của lệnh bị ngắt, worktree dọn dở) được
`renderProductMap` xếp «Hồ sơ hỏng» và được trang lộ trình đếm vào «ngoài lộ trình». Bản vẽ commit từ máy có thư mục sót
khác bản clone sạch — CI `--check` đỏ, trong khi không ai sửa nguồn nào. Cùng lớp với hàng này: bản vẽ lệch không vì
nguồn.

Sửa: một hàm dùng chung `coTepTrongCay(dir)` trong `lib/workspace-record.cjs` (bản đồ đã nạp mô-đun này; trang lộ trình nạp
thêm) — thư mục không có tệp nào, kể cả trong thư mục con, là thứ git không biểu diễn được nên không bao giờ có ở bản clone
nào; cả `renderProductMap` lẫn danh sách «ngoài lộ trình» của `veTrang` bỏ qua nó. Thư mục có dù một tệp (kể cả tệp không
phải hồ sơ) giữ lối cũ: vẫn «Hồ sơ hỏng» — tệp chưa theo dõi là việc dở thật, không phải vết.

Giới hạn khai: thư mục chỉ chứa tệp mà kho bỏ qua (`.DS_Store` khi `.gitignore` bỏ nó) cũng không có ở bản clone sạch nhưng
vẫn là «Hồ sơ hỏng» — phân biệt nó cần hỏi git từng tệp; M5 báo thư mục rỗng. Ngưỡng mở: một lần CI `--check` đỏ vì thư
mục như vậy.

## 4b. (Hỏi-2) Ngưỡng ô đọc thế nào

Ngưỡng ô có vế reality «hai tuần sau khi một kho bật, không lần gộp lại nào vì tệp sinh». Bản vẽ đúng phụ thuộc nguồn ĐÃ
gộp, nên chừng nào `--check` ở PR còn chặt, PR nào chạm hồ sơ vẫn phải gộp nhánh chính vào và vẽ lại mỗi lần nhánh chính
dời — nghiệm này chỉ bỏ phần DỪNG gỡ xung đột tay, không bỏ lần gộp lại. Chữ gốc chỉ đạt được bằng đề xuất 2 của hạt
giống 16/10 (job sau gộp, CỘNG, đổi lưới). Khuyến nghị: thu vế reality về «không lần gộp nào phải gỡ xung đột tay ở tệp
sinh», đúng phạm vi ghi chú của hàng.

## 5. Không làm

- `merge=union`, driver vẽ lại giữa gộp, sửa `gop.mjs` — §3.
- Job sau gộp / hạ `--check` thành cảnh báo (đề xuất 2 hạt giống 16/10) — Later, CỘNG.
- Kit tự chạy `git config` thay người (hook phiên, lệnh ghi danh) — CỘNG, đổi cấu hình máy ngầm; kho bật bằng một lệnh.
- Bật ở kho tiêu thụ — kho nhận theo bản phát hành (ghi chú nhận của giám sát).
- Tệp sinh khác (`tests/scripts/fixtures/routing-baseline.txt`…) — không phải vật của `product-map.mjs`.
- `CHANGELOG.md`, số phiên bản — chiến dịch phát hành.

## 6. Độ phủ (quét hình thái, preset test-matrix)

Ngữ cảnh: chân sản phẩm `[SUY-TỪ-REPO: scripts/product-map.mjs]` + hai hạt giống · chân ngành `[NGÀNH: gitattributes(5)
— «Defining a custom merge driver», driver `true` giữ bản mình]` · `[NGÀNH: npm — lockfile xung đột thì gỡ bằng sinh lại
(`npm install`), không gỡ bằng tay]`.

Trục:
- A trạng thái kho: không thuộc tính · thuộc tính chưa cấu hình máy · bật đủ.  [CE: ba nhánh của đường thoát git, §3]
- B nguồn hai nhánh đổi: hồ sơ khác nhau (bản đồ + trang) · hàng lộ trình khác nhau (chỉ trang) · cùng một hàng lộ trình
  (nguồn xung đột thật).  [CE: hai tệp sinh × nguồn của chúng]
- C sau gộp: chưa vẽ lại · đã vẽ lại.
- D cây làm việc (Hỏi-1): không vết · thư mục rỗng · thư mục chỉ có thư mục con rỗng · thư mục chỉ có tệp bị bỏ qua
  (giới hạn khai, §4) · thư mục có tệp lạ.

Core:
- A=bật × B∈{hồ sơ, hàng} → gộp thoát 0 (AC-1); × C=chưa → `--check` đỏ đúng tệp, C=đã → xanh (AC-2).
- A∈{không thuộc tính, chưa cấu hình} × B=hồ sơ → xung đột như cũ (AC-3).
- A=bật × B=cùng hàng → xung đột ở nguồn, không ở tệp sinh (AC-4).
- Kit tự bật (AC-5). D (AC-6). Đường đọc-cũ: kho không bật, không vết → giống từng byte bản ghim (AC-7). Bộ cũ (AC-8).

Later: job sau gộp (đề xuất 2) · GitHub merge queue. Never: union — §3.
