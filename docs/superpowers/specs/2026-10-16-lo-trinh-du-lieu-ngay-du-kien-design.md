# Thiết kế — khối dữ liệu trang lộ trình mang giờ máy và ngày dự kiến (RM6c)

Hồ sơ: `_acceptance/lo-trinh-du-lieu-ngay-du-kien/` · hàng RM6c của `docs/plans/lo-trinh-kit.json` · chủ kho ký Cổng Đáng
16/10 («đáng: build · ngưỡng: nhận»). Hạt giống thành ô: `docs/plans/2026-10-15-hat-giong-khoi-du-lieu-gio-may.md` (ngưỡng
mở «một kho tiêu thụ có bản chiếu lộ trình xin giờ máy» — crm LT1e, PR crm-onehub #435).

## Vấn đề

RM6 đưa giờ máy lên trang `LO-TRINH.html`: dòng chữ nhỏ dưới câu giao của mỗi hàng (`<span class="gm">`), dòng giờ máy +
dự báo đóng băng + cờ quá tải trên mỗi mốc. Khối dữ liệu máy đọc của cùng trang (`<script id="lo-trinh-du-lieu">`) không
mang số nào trong đó. Trang Lộ trình trong CRM chỉ đọc khối, nên trưởng phòng ban không thấy giờ máy hay ngày dự kiến.

## Số đo nền (16/10)

- Kit `main` 31c5b8df: trang lộ trình của kit in «giờ máy» 65 lần; khối mang 0 khoá giờ máy / ngày dự kiến.
- Bộ đọc của crm (`apps/app/lib/lo-trinh/doc-du-lieu.js` @ crm-onehub `onehub` 8decc2f36) GIỐNG TỪNG BYTE hàm `docDuLieu`
  của kit tại 31c5b8df (sha256 hàm rút `081c13c3…3321`). Lớp sau nó là bảng kiểm khoá zod
  (`packages/validation/src/lo-trinh-du-lieu.ts`, `z.object` mặc định — bỏ khoá lạ, `phien_ban: z.number()`).
- Chạy bản chép thật của crm (hàm + zod + logic `docTrangLoTrinh`) trên ba biến thể trang kit:

  | Trang | Kết quả trang CRM |
  |---|---|
  | bản 2 nguyên | có dữ liệu, 0 cảnh báo |
  | bản 2 + khoá giờ máy/ngày dự kiến | có dữ liệu, 0 cảnh báo; khoá mới bị bỏ im lặng |
  | bản 3 + khoá mới | có dữ liệu, 1 cảnh báo «khuôn phiên bản 3 mới hơn bộ đọc (2)» → hộp «Trang có thể thiếu một phần» |

  Không cách nào làm vỡ trang crm cũ. Câu còn lại là có tăng phiên bản hay không (Hỏi-1).

## Phương án

**Khối mang đúng chữ trang in, kèm số có cấu trúc** (luật của tài liệu kho tiêu thụ: «Mọi trạng thái trong khối là ĐÚNG chữ
trang in»). Không chữ nào trong khối mà trang không in; số `thap`/`cao`/`phan_tram_tuan` là chính số trang đã in thành chữ.

Ba khoá mới ở hai cấp đã có, ba cấp mới:

```
hang.gio_may — null | { thap, cao, nguon, chu, co, phan_tram_tuan, phan_tram_chu }
  thap, cao      — khoảng giờ máy ước (số)
  nguon          — "khai" (kho ghi gio_may trên hàng) | "luat" (bảng luật, chưa đủ số đo) | "do" (≥ 5 vòng đã giao cùng hạng)
  chu            — đúng chữ trang in dưới câu giao, vd «4–7 giờ máy (máy ước) · ~4 % hạn mức tuần»
  co             — cờ số đo chưa đủ: nhãn trang in khi nguon = "luat" («máy ước», «máy ước, chưa khai hạng», …); null khi "khai"/"do"
  phan_tram_tuan — % hạn mức tuần ước (số) hoặc null
  phan_tram_chu  — chữ % trang in: «~4 %» hoặc «chưa ước (k/5 vòng đo)»
moc.gio_may — null | { thap, cao, chu, phan_tram_tuan, phan_tram_chu }   (cấp gio_may_moc)
  tổng các việc CHƯA giao của mốc, đúng chữ dòng mốc trang in («~15,5–20 giờ máy»); null khi mốc hết việc mở
moc.du_kien — null | { ngay_tinh, hoan_tat, chu }
  dự báo ĐÓNG BĂNG lúc mốc bắt đầu (du-bao.json sớm nhất của mốc); chu đúng chữ trang in
  «dự báo lúc bắt đầu (16/10): hoàn tất 17/10»; null khi mốc chưa có dự báo — không bịa
moc.qua_tai — null | đúng chữ cờ trang in «mốc quá tải: dự kiến dd/mm, mục tiêu dd/mm»
```

Trang vẽ không qua phân tích kho (các lối `renderTrang`/`renderNhieu` không có lớp giờ máy) → mọi khoá mới `null`.

**Ngày dự kiến là dự báo đóng băng, không phải dự báo sống.** Trang so từng byte ở CI (`product-map.mjs --check`); khối đọc
«hôm nay» thì CI kho đỏ mỗi sáng. Bản sống tính theo hôm nay đã có ở `/road-map:xem`. Hệ quả nói thẳng: mốc chưa việc nào
được mở từ bản kit có giờ máy thì chưa có ngày dự kiến (`du_kien: null`), bản chiếu hiện «chưa có».

**Ngày dự kiến theo mốc, không theo hàng.** Trang không in ngày riêng từng hàng; hàng đọc ngày của mốc chứa nó qua
`moc.hang` (đã có).

**Phiên bản (Hỏi-1, chỉ chủ kho quyết).** Hai câu đã khai mâu thuẫn:
- tài liệu kho tiêu thụ `lo-trinh-du-lieu.md`: «Kit chỉ THÊM khoá trong cùng phiên bản; đổi nghĩa hay bỏ khoá là phiên bản
  mới» — đây là thay đổi CHỈ THÊM;
- hạt giống 15/10 và tiền lệ X2 (bản 1 → 2 khi thêm `tom_tat`): đổi khuôn là tăng phiên bản.

Khuyến nghị: **giữ phiên bản 2**. Căn cứ: lời hứa đã giao cho kho tiêu thụ là câu thứ nhất; số đo cho thấy giữ bản 2 thì
trưởng phòng ở kho chưa nâng không thấy hộp cảnh báo nào, tăng bản 3 thì thấy hộp «Trang có thể thiếu một phần» tới khi kho
chép bộ đọc mới — người thấy hộp không phải người sửa được nó. Bộ đọc mới nhận ra trang đời trước bằng khoá vắng, không cần
số phiên bản. Lối khác (tăng 3) giá: mọi kho có bản chép bộ đọc hiện hộp cảnh báo cho người xem tới lượt nhận kit kế, và
bộ kiểm crm `bang khoa du muoi mot cap cua ban 2` phải đổi tên cùng lượt.

**Đường đọc-cũ hai chiều.**
- (a) Bộ đọc mới đọc trang vẽ bằng kit trước RM6c (khối thiếu `gio_may`): khoá mới điền `null`, đúng MỘT cảnh báo «trang
  vẽ bằng bộ kit chưa có giờ máy trong khối — chưa có giờ máy và ngày dự kiến; vẽ lại bằng bộ kit mới». Không ném.
- (b) Bộ đọc cũ (hàm `docDuLieu` tại 31c5b8df = bản chép của crm) đọc trang mới: không ném, có dữ liệu, mọi khoá bản 2
  bằng đúng giá trị nó đọc từ trang vẽ bằng bộ máy gốc trên cùng kho (phép «chỉ thêm» đo bằng quan hệ, không bằng từ vựng).
  Với Hỏi-1 theo khuyến nghị: 0 cảnh báo. Lớp zod của crm không chạy trong kit (kit không phụ thuộc zod, CI kit không có
  kho crm) — số đo tay ở bảng trên là bằng chứng cho lớp đó; LT1e bên crm đo lại khi nhận kit.

**Bộ đọc mẫu** `docDuLieu` thêm ba cấp vào bảng khoá bên trong, ba khoá vào danh sách `null`, và một nhánh điền cho object
`gio_may`/`du_kien` (ô vắng → `null`, như ô của dải tóm tắt). Hàm vẫn tự đủ (LT-118 chép rời).

**Tài liệu** `skills/acceptance/references/lo-trinh-du-lieu.md`: thêm dòng khoá vào khối `LO-TRINH-DU-LIEU-KHOA` (LT-119 so
với `KHUON_DU_LIEU`), một mục «Giờ máy và ngày dự kiến», một dòng bảng «Đọc khoan dung».

## Phạm vi chạm

`scripts/lo-trinh.mjs` (vùng khối dữ liệu: `KHUON_DU_LIEU`, `duLieuTrang`, `docDuLieu`; tách phần tính dòng mốc của
`gioMayMoc` thành hàm trả số + chữ dùng chung cho trang và khối — trang KHÔNG đổi byte) · tài liệu trên · ca đo mới
`tests/scripts/lo-trinh-du-lieu-ngay.test.mjs` · khoá `executors.test.lo_trinh_du_lieu_ngay` · `_acceptance/<slug>/goc-so`.
RM3 / RM5 / RM6b đang chờ gộp và chạm `scripts/lo-trinh.mjs` ở vùng khác (rà soát, áp chính sách, `duBaoDongBang`) —
vòng này gọi `duBaoDongBang` chứ không sửa nó; gộp main khi chúng vào.

## Không làm

- Ngày dự kiến sống theo hôm nay trong khối (phá so từng byte; đã có ở `/road-map:xem`).
- Ngày dự kiến riêng từng hàng (trang không in).
- Sửa trang Lộ trình trong CRM (hàng LT1e bên crm).
- Đo lớp zod của crm trong bộ kiểm kit (giới hạn khai; đo tay ở trên, LT1e đo lại).
- Đổi trang `LO-TRINH.html` người nhìn (trang giữ nguyên từng byte).

## Đặc tả UX

Bỏ — vòng không chạm mặt người nhìn (khối máy đọc); entry `descope` trong sổ.
