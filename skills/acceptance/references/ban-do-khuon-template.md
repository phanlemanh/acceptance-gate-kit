# Khuôn tệp bản đồ khuôn — `design/patterns/<nhóm>.md`

Một tệp cho một nhóm màn (hay một nhóm phần tử). Bộ đọc dùng chung là `scripts/ban-do-khuon.cjs`; lệnh
`design-floor-khuon.mjs --tao <nhóm>` sinh tệp mới từ khối dưới (thay `<nhom>`), và bộ kiểm của kit rút khối này lúc
chạy — đừng chép tay sang chỗ khác.

**Lõi v1 — tám khoá bắt buộc:** `nhom` · `doi_tuong` · `khuon{ten, nhap}` · `nhan_dien` · `mau_dang_chay{tep}` ·
`khe_bat_buoc` · `cam_ngoai_khuon` · `ngoai_le[{tep, khoi?, ly_do}]`. Thiếu một khoá, `ngoai_le` thiếu `ly_do` hay
trỏ tệp không có, `cam_ho` có tên không nằm trong `cam_ngoai_khuon`, `mau_dang_chay.tep` không có, hai tệp cùng `nhom` →
sai lược đồ (bước chấm thoát 1).

**`ngoai_le` có hai nghĩa.** Mục có `khoi` (một tên hay danh sách tên — mỗi tên là một ngoại lệ riêng cùng `ly_do`) miễn
đúng khối ấy: tệp vẫn thuộc nhóm, khối khác vẫn bị chấm. Mục không có `khoi` (vắng hẳn khoá) là tệp rời nhóm: tệp không
thuộc nhóm này nữa — không bị chấm lệch hay nợ cũ theo nhóm, không tính vào «thuộc hai nhóm màn», và vòng chỉ chạm nó
không bị đòi eval khuôn của nhóm. Dùng khi glob của nhóm rộng hơn nhóm thật (nhóm trang tạm phủ mọi trang, màn thật rời
ra khi có nhóm của nó). Mục rời nhóm cũng phải có `ly_do`. `khoi:` để trống, `khoi: ""` hay `khoi: []` không miễn gì và
không làm tệp rời nhóm. `tep` là đường tệp đúng, không phải glob.

<!-- <<<BAN-DO-KHUON-NGOAI-LE-VI-DU -->
```yaml
ngoai_le:
  - tep: src/man/<nhom>/Cu.tsx       # có khoi: tệp vẫn thuộc nhóm, chỉ khối này được miễn
    khoi: <KhoiCam>
    ly_do: màn cũ chờ dời sang khuôn
  - tep: src/man/<nhom>/CaiDat.tsx   # không có khoi: tệp rời nhóm
    ly_do: màn thật đã có nhóm riêng
```
<!-- BAN-DO-KHUON-NGOAI-LE-VI-DU>>> -->

**Mở rộng có tên** (đọc được, không bắt buộc): `don_vi` (`man` mặc định · `phan-tu`) · `cam_ho` (họ tên cấm: tên rồi một
chữ hoa) · `thay_cho` (khối cấm → thành phần thay) · `khe_tuy_chon` · `luat` · `nhan_viec` · `lop_trinh_bay` ·
`thanh_phan_tang_ngan`. Khoá khác → cờ vàng «khoá lạ», không đỏ.

**`lop_trinh_bay`** — tên thành phần mà khuôn bọc, một tên hay danh sách, đặt trong `khuon` hay ở cấp đầu (hai chỗ
hợp lại). Tệp dựng thẳng thành phần ấy được tính là theo khuôn, và thẻ của nó được kiểm khe như thẻ khuôn. Kho muốn bắt
tệp dựng thẳng lớp trình bày thì không khai khoá này, hoặc đưa tên ấy vào `cam_ngoai_khuon`. Thiếu «Dùng khi», «Không dùng» hay `nhan_viec` → cờ vàng.

**`nhan_dien`** là danh sách glob tệp thuộc nhóm. Dạng sổ đăng ký (đối tượng không có `tep:`) đọc được nhưng nhóm mang
nhãn «không đọc được ở đây» và không bị chấm — thêm `nhan_dien.tep: [glob]` (khoá `tep` NẰM TRONG `nhan_dien`) để bước
chấm biết tệp nào thuộc nhóm. Khoá `tep` đặt ở cấp đầu không được đọc — cờ vàng chỉ chỗ đúng.

**YAML** viết dạng khối thụt lề hay dạng một dòng `{…}` `[…]` đều được; hai dạng cùng nội dung ra cùng bản chuẩn hoá.

**Tên dành riêng:** `design/patterns/lech-lot.md` (sổ lệch lọt, khuôn ở khối thứ hai) và `design/patterns/README.md`
không phải nhóm — bộ đọc bỏ qua.

<!-- <<<BAN-DO-KHUON-TEMPLATE -->
```markdown
---
nhom: <nhom>
doi_tuong: <màn hay phần tử nào thuộc nhóm — một câu>
khuon:
  ten: <TenKhuon>
  nhap: "<đường nhập khuôn, vd @/khuon/TenKhuon>"
nhan_dien:
  - "<glob tệp thuộc nhóm, vd src/man/<nhom>/**/*.tsx>"
mau_dang_chay:
  tep: <tệp màn mẫu đang chạy>
khe_bat_buoc: []
cam_ngoai_khuon: []
ngoai_le: []
nhan_viec: <việc chính của người dùng ở nhóm này>
---

## Dùng khi

<Một câu: màn nào dùng khuôn này.>

## Không dùng

<Một câu: màn nào KHÔNG dùng khuôn này, và dùng gì thay.>

## Ví dụ sai

<Một đoạn mã ngắn dựng màn ngoài khuôn, và vì sao sai.>
```
<!-- BAN-DO-KHUON-TEMPLATE>>> -->

<!-- <<<LECH-LOT-TEMPLATE -->
```markdown
# Sổ lệch lọt

Mỗi lệch khuôn lọt qua bước chấm mà người thấy khi dùng là một dòng mục — thẻ Cổng Bằng chứng đếm số dòng mục.

- <ngày> · <tệp> · <khối> · <vì sao lọt>
```
<!-- LECH-LOT-TEMPLATE>>> -->
