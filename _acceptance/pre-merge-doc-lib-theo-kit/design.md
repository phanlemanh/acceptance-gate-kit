# Thiết kế: lưới trước gộp đọc thư viện của kit theo chỗ cài kit

Hồ sơ `pre-merge-doc-lib-theo-kit` · vòng vá cho bản 2.36.1 · Cổng Đáng: chủ kho «Mở vòng vá» (31/10).

## Vấn đề

`scripts/pre-merge-check.sh` đọc hai tệp thư viện của kit theo GỐC KHO đang kiểm (`ROOT="."` hoặc đối số vị
trí): dòng gọi `lib/md-section.cjs` (mục «Known limits» / «Ngoài hợp đồng» của báo cáo) và dòng gọi
`lib/out-of-contract.cjs` (mục ngoài hợp đồng chưa định tuyến). Mọi chỗ đọc thư viện còn lại trong cùng tệp —
từ `GP_LIB` tới `CLT_LIB` và `RECHECK` — đọc theo chỗ đặt chính script (`$(dirname "$0")/..` hoặc `$HERE/..`).
Kho cài kit theo đường plugin không có `lib/` ở gốc kho, nên `node` thoát khác 0, khối rơi vào `__LOI__` và mọi
hồ sơ `machine-cleared` bị VIOLATION «không đọc được mục «Known limits» (fail-closed)». Kho có lớp chép CI không
vấp vì bản chép có sẵn hai tệp. Lỗi sinh ở 2f8de63a (16/08); tái hiện trên main `c8870a49` bằng ca LK1.

Vì sao không ca nào bắt được trong mười một tuần: bộ dựng kho thử của hai tệp ca đang đo lưới này
(`tests/scripts/dinh-tuyen-theo-ma-muc.test.mjs`, `tests/scripts/hskt.test.mjs`) CHÉP `lib/` của kit vào kho thử
— fixture dựng đúng khuôn bên đọc (hình dạng 3 của luật «Thước phải gắn vào vật được giao»). Vòng này không sửa
hai bộ dựng ấy (ngoài phạm vi); ca mới dựng kho thử KHÔNG có `lib/` làm ca chính.

## Lối chọn

Một bộ giải trong khối marker `KIT-LIB-THEO-CHO-CAI` của `pre-merge-check.sh`:

```
kit_lib <tệp>  →  "$HERE/../lib/<tệp>"   nếu tệp có cạnh script
                  "$ROOT/lib/<tệp>"       nếu không (lùi về hành vi trước vòng)
```

Hai dòng gọi đổi thành `"$(kit_lib md-section.cjs)"` và `"$(kit_lib out-of-contract.cjs)"`. Không đổi gì khác.

Cân trên mọi kho (luật 26/09):

| Kho | Trước vòng | Sau vòng |
|---|---|---|
| cài theo plugin, không `lib/` ở gốc | VIOLATION oan ở mọi hồ sơ máy-thông | đọc thư viện cạnh script — qua lưới |
| có lớp chép CI, chạy bản chép `scripts/pre-merge-check.sh` | đọc `lib/` của bản chép | `$HERE/../lib` CHÍNH LÀ `lib/` của bản chép — không đổi |
| có lớp chép CI nhưng chạy script của plugin | đọc `lib/` bản chép (lệch phiên bản với script) | đọc thư viện cùng bản với script — như mọi chỗ đọc khác của tệp |
| chép riêng script mà thiếu thư viện cạnh nó | đọc `lib/` của gốc kho | lùi về `lib/` của gốc kho — không đổi |

Thứ tự «cạnh script trước, gốc kho sau» (phản biện P0 đòi căn cứ thật, không phải một dòng mã): lối ngược lại
ghép script bản mới với thư viện bản chép cũ — lưới 2.36 gọi `cumCu` (có từ 4cc956fc, 13/10), nên kho chép `lib/`
trước mốc ấy mà chạy script của plugin sẽ bị VIOLATION «không đọc được review-findings.md», đúng lớp lỗi này đổi da.
Đo 31/10 ở ba kho tiêu thụ: onehub-invest và crm gọi bản chép của chính mình
(`bash scripts/pre-merge-check.sh . --base …`), onehub-quy-hang gọi script của plugin từ gốc kho
(`bash "$CLAUDE_PLUGIN_ROOT/scripts/pre-merge-check.sh" . …`) và không có `lib/` — 0/3 kho ở hàng 3 của bảng, nên
thứ tự đã chọn không đổi màu kho nào hôm nay.

## Quét lớp lỗi

Lớp: một tệp shell của kit chạy ở kho tiêu thụ mà truyền một tệp của kit theo đường gốc kho.

- Tệp shell dưới `scripts/` và `hooks/`: chỉ `pre-merge-check.sh`, chỉ hai dòng trên. Ca LK5 giữ quét này thành
  thước với ba mẫu (chữ trong nháy bắt đầu bằng tiền tố gốc kho · từ không nháy bắt đầu `$ROOT` · `node` + đường
  tương đối) và ma trận 6 hình dạng viết trước; `hooks/` hôm nay không có tệp shell nào.
- Giới hạn khai: tệp `.mjs`/`.cjs`/`.js` nạp thư viện bằng `import`/`require` tương đối theo tệp — không theo gốc
  kho — và nằm NGOÀI phép quét. Đọc tay 31/10: ba chỗ ghép gốc kho với `scripts/`/`lib/` là CỐ Ý —
  `scripts/lo-trinh-khoi-tao.mjs` dò kho đã chép lớp CI chưa (`scripts/product-map.mjs`),
  `feature-loop/scripts/duong-nen.mjs` ưu tiên bản chép `pre-merge-check.sh` của kho rồi mới lùi về bản plugin,
  `scripts/build-design-scan.mjs` có `ROOT` = thư mục kit (suy từ vị trí script).

## Không làm

- Sửa bộ dựng kho thử của `dinh-tuyen-theo-ma-muc.test.mjs` / `hskt.test.mjs` để thôi chép `lib/`.
- Đổi hành vi của các chỗ đọc thư viện khác (đã đúng).
- Đổi khuôn hay chữ của hai thông điệp fail-closed.

## Đo

Tệp ca `tests/scripts/pre-merge-doc-lib-theo-kit.test.mjs`, kho thử do code sinh trong lượt (khuôn khoLanV), một hồ
sơ `machine-cleared` xanh-sạch có `review-findings.md` để dòng đọc thứ hai thật sự chạy. Bốn bố cục kho (không
`lib/` · chép lành · chép hỏng · chép một phần) × hai bố cục script × bốn cách gọi (gồm đúng hình dạng CI của hai
loại kho). Bản gốc thật `c8870a49` dựng trọn bốn thư mục bằng `git archive` trong lượt (CI của kit checkout
`fetch-depth: 0`): đỏ đúng thông điệp ở kho không `lib/`, xanh ở kho có lớp chép, và BẰNG bản sửa khi cả hai thiếu
thư viện cạnh script. Ba đột biến trên bản sao trọn thư mục, bản sao chưa tiêm phải xanh trước: bộ giải chỉ trả gốc
kho · đảo thứ tự · riêng dòng ngoài hợp đồng còn đọc gốc kho. Chiều đỏ trong lịch sử: commit ca đứng trước commit
vật, ca đỏ trên cây trước vòng với đúng thông điệp ghim.
