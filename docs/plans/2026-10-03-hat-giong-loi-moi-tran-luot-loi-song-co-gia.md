# Hạt giống — lời mời ở trần lượt: lối nào in ra cũng phải SỐNG và có GIÁ; khuyến nghị lối tới quyết-được nhanh nhất

**Ngày:** 2026-10-03 · **Trạng thái:** hạt giống (SỔ, chưa là ô) · **Hạng dự kiến:** T2 (đổi lời
mời ở trần lượt và ở dừng-vá; KHÔNG chạm đường phán quyết finder → refute → REJECT).
Gốc: crm/_acceptance/muc-tieu-va-kr — sổ quyết định 02/10 12:21Z và 21:12Z («chủ kho cho chấm
round 4 vượt trần», «chủ kho chọn round 5 với miễn theo dòng đỏ»), `usage-report.md`, và sổ
`.acceptance-runs/muc-tieu-va-kr/ho-so-cham/ket-qua-934ee26d0c56-mac-dinh.jsonl` của lượt 4.
**Chân VC8 (cơ học, KHÔNG phải neo):** `_acceptance/o-chi-mo-khi-co-neo-ngoai/` trích lại tệp này.

> Chữ trong tệp này là NGUỒN. Số đo ngày 03/10 từ transcript phiên crm «Phân tích và hoàn thiện
> OKR» và từ giờ sửa của 259 tệp log lượt 4. Đừng đo lại trừ khi nghi số đã cũ.

## Ca thật

Vòng `muc-tieu-va-kr` (crm, T2, vật 27 tệp). AC-11 hứa «không làm gãy phép đo của việc đã ký»;
thước của nó (E14, `rang/ho-so-cham.mjs`) chạy lại eval của hồ sơ khác.

| Lượt | E14 | Kết quả của E14 |
|---|--:|---|
| 1 | 34 phút | `cannot_run` |
| 2 | 188 phút | mã 137 (công cụ giết) |
| 3 | 41 phút | `cannot_run` |
| 4 | 310 phút (95 % lượt) | REJECT — 5 dòng «hoi quy», 0 dòng là hồi quy sản phẩm |

Bên trong 310 phút của lượt 4:

- 4 lệnh «thước chạy thước của hồ sơ khác» (một `ho-so-cham`, hai `khong-hoi-quy`, một lần
  `repin-lane`): 188 phút (61 %).
- 35 lệnh đỏ ở cả HEAD lẫn merge-base: 244 phút (79 %), kết luận chỉ là «đỏ sẵn ở B».
- 45 lệnh `bun test` của sản phẩm: 1,4 phút.
- Danh sách viết trước 44 eval; cộng thêm theo glob `paths` 193 eval. 17/44 viết trước và 68/193
  cộng thêm không xanh ở merge-base.

Ba lượt máy hỏi chủ kho, cả ba ngoài thiết kế:

| Giờ (UTC) | Lối máy khuyến nghị | Lối rẻ có trên thẻ | Trả lời sau |
|---|---|---|---|
| 12:17 | «Cho round 4» — E14 chạy hết 2–4 giờ | «Thu hẹp E14» — 44 eval, ~40 phút, phải duyệt lại Cổng Phạm vi | 2 phút 33 giây, theo khuyến nghị |
| 18:09 | «Trình Cổng Bằng chứng ngay», E14 là mục ghi đè | — | theo khuyến nghị; **lối này không ký được** |
| 21:03 | «Round 5 với miễn theo dòng đỏ» — 1 giờ sửa + 5–6 giờ chấm | «Thu hẹp AC-11 ở Cổng Phạm vi» | 38 giây, theo khuyến nghị |

## Lỗ

1. **Lối in ra không sống.** Lúc 18:09 máy mời (và khuyến nghị) một lối mà cổng ký từ chối: báo
   cáo REJECT còn eval máy đỏ thì không ký được, ghi đè chỉ có cho mục judgment. Một lượt gọi
   người mất trắng, và lượt 5 bị ép ra từ đó. Nguyên tố 3 đòi cổng có ≥2 lối ra sống; ở đây máy
   không thử lối trước khi in.
2. **Khuyến nghị không tính giá theo thước đo của kit.** Hai lần có lối «thu hẹp» (một chạm
   duyệt lại + ~40 phút máy) cạnh lối «chạy tiếp» (0 chạm + 3–6 giờ máy + rủi ro thêm lượt), máy
   khuyến nghị lối đắt vì lối rẻ «phải duyệt lại Cổng Phạm vi». Thước đo đầu tiên của kit là
   thời gian từ làm-xong đến quyết-được; một chạm trong thiết kế (Cổng Phạm vi) rẻ hơn một lượt
   chấm nhiều giờ đẻ thêm lượt gọi ngoài thiết kế.
3. **Chữ ký thành trạm thu phí.** 3/3 câu trả lời là «theo khuyến nghị», hai câu dưới ba phút —
   cùng hình với hạt giống `2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md` (28/28) và điểm
   1 của `2026-09-22-hat-giong-audit-s4-bon-diem-nguoc-north-star.md` (Treo «phê hết» 4/4).

## Dạng nghiệm đúng tầng (chưa phải cam kết)

Biến hai bất biến từ đầu-máy sang vật-máy-giữ, ngay ở lời mời — không thêm cổng, không thêm lượt:

- **Lối sống:** trước khi in một lối ở trần lượt / dừng-vá, máy chạy khô điều kiện của lối đó
  bằng chính bộ kiểm của cổng đích (lối «trình Cổng Bằng chứng» → bộ kiểm ký trên báo cáo hiện
  có). Lối không qua thì không in, hoặc in kèm chữ «không ký được vì …».
- **Lối có giá:** mỗi lối mang hai số đọc từ sổ đã có — phút máy dự kiến (đường găng lượt gần
  nhất trong `usage-report.md`) và số lượt gọi người dự kiến. Khuyến nghị = lối có thời gian tới
  quyết-được nhỏ nhất trong các lối đảo được; lối khó-đảo vẫn luôn là câu hỏi cho người.

Cân trên mọi kho: kho không có eval dài không mất gì và được «không còn lối chết»; không đổi mặc
định nào của đường chấm. Hai chiều phải phá thử: lối chết → phép đo đỏ; mọi lối sống → phép đo im.

## Ứng viên thứ hai, cùng ca (CỘNG — cần owner phê đích danh, CHƯA đề xuất)

Cạnh Hạng mục↔Thước («thước lệch», người gỡ) chưa có đường ở Cổng Bằng chứng: một eval script đỏ
vì chính thước đo nhầm thứ không phải vật của vòng thì cách duy nhất hôm nay là vá thước rồi chấm
lại toàn bộ. Dòng `thuoc-lech` trong `lib/nhan-canh-gay.cjs` mang nghĩa khác (tệp thước đổi giữa
hai lượt). Ghi ở đây để không ai đọc thành «chưa từng thấy».

## Không thuộc kit (đã nhắn phiên crm 03/10)

- Thước chạy thước của hồ sơ khác, glob `paths` dùng làm danh sách hồi quy, luật phạm-vi-diff của
  một vòng bị vòng sau chạy lại, 75/234 eval đã ký đỏ sẵn trên nhánh gốc: đều là vật của kho crm.
  Kit không thêm luật mang từ vựng của một kho (bất biến «sửa kit vì sự cố của MỘT kho phải cân
  trên MỌI kho»).
- Eval dài hơn trần làn máy: đã có hạt giống `2026-10-01-hat-giong-phep-do-qua-tran-lan-may.md`;
  ca này ghi thêm vào đó.

## Ngưỡng mở (đang đếm: 1)

≥1 vòng nữa ở bất kỳ kho nào mà chủ kho chọn lối khuyến nghị ở trần lượt / dừng-vá rồi lượt kế
vẫn REJECT hoặc BLOCKED ở cùng eval; HOẶC ≥1 lần nữa máy mời một lối mà cổng đích từ chối. Đếm:
đọc các câu hỏi máy đặt sau dòng `round-tally` thứ ba trong transcript của vòng, so với verdict
lượt kế trong `run-log.jsonl`.
