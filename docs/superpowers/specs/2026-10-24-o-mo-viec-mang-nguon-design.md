# TT3 — ô mở việc mang nguồn (thiết kế)

Hồ sơ `_acceptance/o-mo-viec-mang-nguon/` · hàng TT3 của đợt `tri-thuc-2410` · mã C1, D1, D2 · nguồn
`docs/findings/2026-10-24-tang-tri-thuc-llm-wiki.md` (mục 3.1, 3.2, 4) · đứng trên TT1 (`scripts/tri-thuc.mjs`,
`scripts/tri-thuc-khoa.cjs`, khuôn `skills/acceptance/references/tri-thuc-template.md`). Vật liệu tham khảo: hồ sơ NG1
trên nhánh `vong/nguon-di-cung-luot-cat` (không gộp).

## Kết quả

Ở kho đã khai `tri_thuc`, phiên mở vòng từ một hàng có đợt nhận ngay trong ô cơ hội một dòng «Nguồn:» trỏ — bằng đường
trỏ băm — trang nền, trang đợt và các trang mang mã của hàng. Bản phạm vi của kho ấy phải lấy nguồn là trang tri thức
có đường trỏ băm; liên kết ngoài, chữ tự do và tệp chưa vào git bị răng phủ từ chối. Kho không khai `tri_thuc`, và hàng
không thuộc đợt nào, nhận ô và kết quả răng phủ giống từng byte bộ máy trước vòng.

Vòng này KHÔNG đọc dòng «Nguồn:» ở bước thiết kế và không đổi thẻ — đó là TT4 (dòng «đã tra tri thức», thẻ Cổng Phạm
vi). TT3 giao cho TT4 một bên ghi và một bên đọc cùng rút từ một khuôn.

## C1 — chọn trang cho một hàng (`chonTrang` trong `scripts/tri-thuc.mjs`)

Đầu vào: gốc kho, `dot` và `phu` của hàng. Đọc cấu hình bằng `docCauHinh` và giải gốc bằng `giaiGoc` của TT1 (kho riêng
giải theo checkout chính). Duyệt mọi `.md` dưới `wiki/` của gốc tri thức, đọc frontmatter bằng CHÍNH bộ đọc của lint
(xuất `docFrontmatter`, `danhSach` — không bộ đọc thứ hai), khoá lấy từ khối `TRI-THUC-TRANG` của khuôn lúc chạy.

| Nhóm | Luật | Thứ tự |
|---|---|---|
| trang nền | `loai: nen` | theo đường |
| trang đợt | tệp `wiki/dot/<dot>.md` (cùng luật nối đợt của lint `ma-khong-co-trang`) | một |
| trang mang mã | `ma` giao `phu` của hàng khác rỗng, trừ trang nền và trang đợt | theo đường |

Mỗi trang thành một đường trỏ theo khuôn `TRI-THUC-CON-TRO`: `<đường tương đối gốc tri thức>#<git hash-object>`; gốc là
kho riêng thì thêm tiền tố `<kho.ten>:`. Phần thiếu ghi tên: `trang nền` (không trang nào `loai: nen`), `trang đợt <dot>`,
`mã <x>` cho mỗi mã của `phu` không trang nào mang. Trả `{ conTro: [...], thieu: [...] }`, hoặc `{ khongDoc: <dòng> }` khi
gốc là kho riêng mà máy không có bản (dòng `dongKhongDoc` của TT1), hoặc `{ loiKhai: [...] }` khi khối `tri_thuc` lỗi.

## D2 — dòng «Nguồn:» của ô (`scripts/lo-trinh.mjs --mo-o`)

Điều kiện ghi dòng: kho khai `tri_thuc` (đọc bằng `tri-thuc-khoa.cjs`, KHÔNG nạp `tri-thuc.mjs` khi khối vắng) VÀ hàng
có `dot`. Thiếu một trong hai → không nạp gì thêm, ô giống từng byte bộ máy trước vòng. `dungCoHoi` nhận thêm
`dongNguon` (chuỗi hoặc `null`) và chèn nó ngay sau dòng «Mở từ hàng …»; bên CLI tính chuỗi ấy. Bộ vẽ ở kho tiêu thụ chép
`lo-trinh.mjs` vẫn không nạp mô-đun tri thức (lối CLI nạp lười).

Hình dạng dòng — tiền tố là khối `OPP-NGUON-PREFIX` mới ở mục «Ký hiệu máy đọc» của
`skills/acceptance/references/opportunity-template.md`:

```
Nguồn: `wiki/nen/a.md#<40 hex>` · `wiki/dot/d1.md#<40 hex>` · `wiki/chu-de/x.md#<40 hex>`
Nguồn: `wiki/nen/a.md#<40 hex>` · `wiki/chu-de/x.md#<40 hex>` — chưa có trang: trang đợt d1, mã A2
Nguồn: không đọc được ở đây: <kho> — git clone <remote> <đường>
Nguồn: khối tri_thuc lỗi — <lỗi>
```

Bên ghi và bên đọc sống chung trong `scripts/tri-thuc-nguon.cjs` (CJS để thẻ của TT4 nạp được): `dungDongNguon` dựng
dòng, `docDongNguon` rút mọi đoạn trong dấu backtick khớp khuôn `TRI-THUC-CON-TRO` ở dòng đầu tiên mở bằng tiền tố, trả
`{ coDong, conTro }`. Cả hai rút tiền tố từ khuôn ô cơ hội và biểu thức đường trỏ từ khuôn tri thức lúc chạy — đổi khuôn
ở một phía là ca round-trip đỏ. Tệp đặt ở `scripts/`, không ở `lib/` (`lib/**` là `t3_paths`).

Ô vẫn mở ở mọi ca thiếu: mở việc không bị chặn bởi tầng phụ (cùng nếp tự áp chính sách ở S0). JSON stdout của `--mo-o`
không đổi.

## D1 — nguồn của bản phạm vi là trang tri thức (`scripts/cat-luot.mjs`)

Kho khai `tri_thuc` → răng phủ kiểm khoá `nguon` của bản phạm vi: tách theo dấu phẩy, mỗi mục phải

| Vế | Dòng lỗi (một dòng mỗi mục) |
|---|---|
| khớp khuôn `TRI-THUC-CON-TRO` | `nguồn «<mục>» không phải đường trỏ băm tới trang tri thức [nguon-khong-phai-trang]` |
| trỏ tệp dưới `wiki/` | `nguồn «<mục>»: không phải trang wiki — phải nằm dưới wiki/ [nguon-khong-phai-trang]` |
| tệp có và băm khớp (`conTro` của TT1) | `nguồn «<mục>»: <không có tệp: … \| băm lệch: …> [nguon-lech]` |
| tệp đã vào git của kho chứa nó | `nguồn «<mục>»: tệp chưa vào git của kho tri thức [nguon-chua-vao-kho]` |

`nguon` rỗng → `bản phạm vi thiếu nguon — kho đã khai tri_thuc: ghi đường trỏ băm tới trang tri thức [nguon-khong-phai-trang]`.
Gốc là kho riêng mà máy không có bản → chỉ vế băm và vế git (cần đọc kho) hạ thành `cảnh báo: nguồn «<mục>»: không đọc
được ở đây …`, không lỗi (giới hạn là nhãn trạng thái); hai vế hình dạng (khuôn, dưới `wiki/`) không cần kho nên vẫn là
lỗi trên mọi máy. Khối `tri_thuc` lỗi → một dòng lỗi `khối tri_thuc lỗi: …`. Kho không khai → răng phủ không đổi
một byte (khoá `nguon` vẫn là chữ tự do). Khuôn `pham-vi-template.md` thêm một câu cho kho đã khai; khối mẫu không đổi
(ca LT-130 đọc nó).

Đường đọc-cũ: mở ô từ hàng của bản phạm vi cắt trước vòng (chữ tự do) không đọc bản phạm vi nên vẫn mở, và dòng
«Nguồn:» đọc trang theo `dot` của hàng. Răng phủ chạy lại trên bản ấy ở kho vừa khai tri thức thì đỏ — giới hạn đã khai
trong hợp đồng, kèm ngưỡng.

## Đổi theo vật

| Tệp | Đổi |
|---|---|
| `scripts/tri-thuc.mjs` | xuất `docFrontmatter`, `danhSach`; thêm `chonTrang`, `kiemNguonPhamVi` (một khối liền, sau `conTro`) |
| `scripts/tri-thuc-nguon.cjs` | mới — `dungDongNguon`, `docDongNguon`, tiền tố từ khuôn |
| `scripts/lo-trinh.mjs` | `dungCoHoi` nhận `dongNguon`; CLI `--mo-o` tính dòng khi đủ điều kiện |
| `scripts/cat-luot.mjs` | CLI răng phủ gọi `kiemNguonPhamVi` khi kho khai `tri_thuc` |
| `skills/acceptance/references/opportunity-template.md` | khối `OPP-NGUON-PREFIX` |
| `skills/acceptance/references/pham-vi-template.md` · `skills/cat-luot/SKILL.md` · `feature-loop/skills/feature-loop/SKILL.md` | một câu mỗi tệp |
| `tests/scripts/o-mo-viec-mang-nguon.test.mjs` · `_acceptance/config.yaml` | ca ON-*, khoá `executors.test.o_mo_viec_mang_nguon` |

Phạm vi va chạm với TT2 (song song): TT2 cũng có thể chạm `scripts/tri-thuc.mjs`; thay đổi của TT3 ở đó là hai từ
`export` và một khối hàm liền nhau, để gộp rẻ.

## Ngoài vòng

Đọc dòng «Nguồn:» ở bước thiết kế, dòng «đã tra tri thức», cờ thẻ Cổng Phạm vi — TT4. Tra theo mô tả cho vòng đơn lẻ,
đọc sổ quyết định của hồ sơ trước — TT5. Trỏ nguồn theo mục trong trang; lệnh đếm sau phát hành (ngưỡng của ô đo trên
kho thử trong lượt chấm).
