# Thiết kế: ban-do-khuon-roi-nhom — `ngoai_le` không `khoi` là tệp rời nhóm

Gốc: `onehub-quy-hang/_acceptance/ban-do-khuon-nhom-da-co/` (đã ký) · số đo: finding 03/11
`docs/findings/2026-11-03-ban-do-khuon-quy-hang-va-ke-hoach-kit.md` §5.2 (commit `e10ac284`, chưa gộp) · vật vừa giao:
`_acceptance/khuon-loi/`, `_acceptance/khuon-doc-ban-do-that/`. Ô cơ hội: `opportunity.md` (chủ kho «Cắt trước», 03/11).

## 1. Chuyện gì xảy ra

Kho thứ hai khai một nhóm màn «trang tạm» với glob phủ mọi trang. Khi một màn thật có nhóm riêng, kho thêm vào nhóm trang
tạm một mục `ngoai_le: { tep, ly_do }` KHÔNG có `khoi` — nghĩa là «tệp này rời nhóm». Khuôn tệp của kit cho viết như vậy
(bộ đọc nhận, không sai lược đồ), nhưng không nói nghĩa, và vật đọc nó thành một ngoại lệ cho khối tên rỗng — không khớp
gì. Hệ quả trên bản sao kho thứ hai, kit `main`:

| Dạng báo | Vì sao | Số |
|---|---|---|
| «thuộc hai nhóm màn» | màn thật vẫn thuộc trang tạm bên cạnh nhóm thật của nó | 15 |
| «thiếu khuôn» | trang thử ẩn chỉ thuộc trang tạm, đã khai rời | 1 |

Cả 16 tệp đều nằm trong danh sách rời nhóm. Kho thứ nhất (crm) viết mọi mục `ngoai_le` có `khoi`.

## 2. Lựa chọn

**R1 — rời nhóm ở `nhomCuaTep`, một chỗ.** `nhomCuaTep(banDo, tep)` bỏ mọi nhóm có mục `ngoai_le` trỏ đúng `tep`, không
`khoi`, có `ly_do`. Mọi bên đọc «tệp thuộc nhóm nào» đều đi qua hàm này: bước chấm (`chamKho` — phép kiểm hai nhóm màn,
phép kiểm từng nhóm, đếm «ngoài bản đồ»), cờ «chưa chấm khuôn» của thẻ Cổng Bằng chứng (`theCong2`), và lưới `s4-args`
đòi eval khuôn. Sửa một chỗ thì ba bên đổi cùng lúc, không có bản thứ hai phải giữ khớp. Phép miễn khối ở bước chấm
(`e.khoi === x.khoi`) không đổi.

**R2 — bộ đọc giữ dấu «vắng khoá».** Hôm nay mục thiếu `khoi` thành `{khoi: ''}`, trùng với `khoi: []`, `khoi:` để trống
và `khoi: ""`. Bộ đọc đổi riêng ca VẮNG HẲN khoá `khoi` thành `{khoi: null}`; ba cách viết kia giữ đúng hành vi cũ (`''`,
không miễn gì) — Out of scope của `khuon-doc-ban-do-that` đã chốt nghĩa ấy cho `[]`, và một khoá có mặt mà rỗng là dấu
người đang viết dở, không phải ý gỡ cả tệp. CLI `--json` đổi đúng một chỗ: mục vắng `khoi` in `"khoi": null` thay vì
`""`; mục có khoá `khoi` không đổi byte nào.

**R3 — mục rời nhóm phải có `ly_do`, như mục miễn khối.** Thiếu `ly_do` đã là sai lược đồ (bước chấm thoát 1); mục ấy
không làm tệp rời nhóm, để bước chấm không im trên một khai báo hỏng. Câu báo sai ghi «rời nhóm» thay cho «?».

**R4 — tệp rời mọi nhóm màn và khớp `design.surface_globs` được đếm «ngoài bản đồ».** Đây là hệ quả của R1, không phải mã
riêng: tệp không thuộc nhóm màn nào thì đúng là ngoài bản đồ. Ở kho thứ hai, màn thật rời trang tạm vẫn thuộc nhóm thật
nên không đổi số này.

**R6 — đánh đổi: nghĩa mới mở một đường im lặng.** Trước vá, mục thiếu `khoi` là khai báo trơ: không miễn gì, tệp vẫn bị
chấm đủ. Sau vá, chính mục ấy gỡ tệp khỏi mọi phép chấm của nhóm. Người định miễn một khối mà quên dòng `khoi` sẽ thấy
tệp im thay vì thấy lệch. Căn cứ chọn: chủ kho đã định nghĩa V0 đúng là «`ngoai_le` không `khoi` = tệp rời nhóm» (ô cơ
hội, quyết «Cắt trước» 03/11), và kho thứ hai đang dùng đúng nghĩa ấy ở 18 mục. Chặn đường im lặng bằng ba chốt: chỉ ca
vắng hẳn khoá (R2), bắt buộc `ly_do` (R3), và khuôn tệp nói thẳng hai nghĩa (R5). Lối khác, KHÔNG làm vòng này: in một
dòng «rời nhóm: <tệp>» ở `--kiem` cho mỗi tệp của vòng đã rời nhóm. Giá: mọi vòng của kho thứ hai thêm dòng ở đầu ra và
thẻ, và một khoá mới trong `khuon-cham.json` — mở khi có một lệch lọt qua mục rời nhóm (sổ lệch lọt ghi được).

**R5 — chữ.** Khuôn tệp nói `ngoai_le` có hai nghĩa, kèm một khối ví dụ có marker (`BAN-DO-KHUON-NGOAI-LE-VI-DU`) mà
bộ kiểm rút lúc chạy và đọc bằng bộ đọc thật (round-trip). GUIDE §5.2 thêm một câu vào đoạn «Bản đồ khuôn».

## 3. Không làm (và vì sao)

- **L4 của finding — «Không dùng» nằm giữa dòng.** Chỉ là cờ vàng oan, không đốt lượt chấm; task V0 chỉ gọi tên L1.
- **`ngoai_le_han`, `bo_cuc`** — khoá của kho thứ hai, giữ cờ vàng «khoá lạ» tới V3 (finding §7).
- **Glob trong `ngoai_le.tep`** — bộ đọc đã đòi `tep` là tệp có thật; kho thứ hai viết đường tệp đúng.
- **Cờ cho mục rời nhóm trỏ tệp ngoài glob của nhóm** — vô hại (không đổi gì), chưa có ca đo được.

## 4. Đo

Tệp ca mới `tests/scripts/ban-do-khuon-roi-nhom.test.mjs` (mã ca `RN-`), dùng lại bộ dựng kho mẫu
`tests/scripts/khuon-loi-kho-mau.mjs`. «Bộ máy gốc» là `git archive eab2ca41 scripts lib feature-loop skills` bung trong
lượt — bản trước vá — chạy trên CÙNG kho mẫu với cây đang kiểm, nên ca đỏ (a) là phép so hai bản trên một fixture, không
phải hằng viết tay về hành vi cũ. Kho mẫu rời nhóm dựng lại HÌNH DẠNG bản đồ kho thứ hai: nhóm trang tạm glob phủ mọi
trang, danh sách rời nhóm viết một dòng `[{ tep: "…", ly_do: "…" }, …]`, lý do có dấu phẩy; tên tệp và tên khối giả.
Mỗi ca «-do» chạy chính hàm kiểm trên bản sao trọn thư mục bị tiêm một nhát, sau khi bản lành xanh; ghim thông điệp.

Số SAU trên hai kho thật (c) là ca `RN-5` trong `tests/scripts/ban-do-khuon-roi-nhom-hai-kho.mjs`: cần hai kho trên máy
nên không mang đuôi `.test.mjs` và không vào `feature_loop.suite_keys` (vắng → thoát 2, mù — tiền lệ
`moc-chien-dich-crm.mjs`). Nó `git clone --shared` từng kho vào thư mục tạm, checkout commit ghim, chạy `chamKho` của bộ
máy gốc và của cây trên cùng bản sao, chỉ in số. Kho thứ nhất khai nhóm bằng sổ đăng ký nên bộ chấm «không đo được»; ca giả
lập hai cấu hình `nhan_dien.tep` trong một commit của bản sao để phép so «không đổi» không rỗng.

## 5. Số TRƯỚC/SAU trên bản sao hai kho

Điền từ đầu ra của `RN-5` ở lượt chấm (mục này cập nhật trước Cổng Bằng chứng).

## Đặc tả UX

Bỏ — vòng không chạm màn hình người dùng cuối (dòng sổ `descope`).
