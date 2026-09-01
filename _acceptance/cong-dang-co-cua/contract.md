---
schema_version: 1
feature: Cổng Đáng có cửa — thẻ cổng thứ ba + ký một lượt bằng lệnh duyệt sẵn có
slug: cong-dang-co-cua
owner: phanlemanh@gmail.com
risk_tier: T2      # T2 (chuẩn) | T3 (auth/dữ liệu/API phá vỡ)
surfaces: [cli]    # api | cli | sdk | ui | mobile — ngăn cách bằng dấu phẩy
status: implemented # draft | approved | implemented | verified | signed-off | machine-cleared
approved_by: Manh Phan
approved_at: 2026-09-01T02:42:37Z
---

# Acceptance Contract: cong-dang-co-cua

## Context

Cổng Đáng là nơi owner quyết «có làm việc này không» — quyết định chốt ý định
TRƯỚC khi làm. Ba cổng người còn lại đều có nghi thức đứng tên; cổng này không,
nên nghi thức vào phiên bàn giao nó sang bộ dựng thẻ vốn chỉ biết hai cổng kia,
và người được mời ký gặp một lời từ chối chỉ ngược thứ tự của chính kit. Vòng
này lắp làn thẻ thứ ba, dạy chốt «không có hồ sơ thì không vẽ thẻ» phân biệt
thêm hai ca, và mở chế độ ký Cổng Đáng trên lệnh duyệt sẵn có — không thêm lệnh
thứ bảy.

Source input: `_acceptance/cong-dang-co-cua/opportunity.md` (ký «làm» 2026-09-01,
commit `eb4c8b20`) · design doc
`docs/superpowers/specs/2026-09-01-cong-dang-co-cua-design.md`

## Criteria

> **PHẠM VI ĐÃ THU 2026-09-01** tại điều khoản dừng-vá (hai vòng chấm liên tiếp
> sinh lỗi CÙNG LỚP). Owner quyết «thu phạm vi». Làn thẻ Cổng Đáng, chế độ ký,
> ngữ pháp `g0` và bộ răng 13 chân TRẢ VỀ Ô — lấy lại bằng cây ghim
> `528caaa81f70971b0a827a31457c49a1b1cd53d1`, xem
> `discovery/LAY-VE-LAN-THE.md`. Mười ba tiêu chí của bản duyệt 01/09 đi cùng
> chúng; ba tiêu chí dưới đây là phần CÒN LẠI, độc lập với làn thẻ.
>
> Đây KHÔNG phải một cổng duyệt mới: quyết định thu phạm vi là phát ngôn của
> owner trong phiên 01/09, ghi ở `decisions.jsonl`. Hỏi lại chính câu owner vừa
> trả lời là trạm thu phí.

- AC-A: Given một ô cơ hội đã đóng — `decision` là `park` hoặc `kill`, hoặc
  `stage: archived` — When gọi bộ dựng thẻ, Then nó thoát khác 0 với lời thuật
  nói **ý đã đóng**, và lời thuật đó KHÔNG chứa câu mời đi viết hợp đồng. Trước
  bản này, gõ tên một ý đã dừng thì kit trả lời «việc kế là chạy bước chuẩn hoá
  yêu cầu» — tức mời người hồi sinh một ý đã chết.
- AC-B: Given một ô cơ hội mang field điều hướng ngoài từ vựng (`stage` hoặc
  `decision`), When gọi bộ dựng thẻ, Then nó thoát khác 0 nêu **TÊN field hỏng**,
  chứ không gọi nhầm thành «chưa có hợp đồng». Máy quét vào phiên đã nêu tên
  những hồ sơ này ở mục hỏng; bộ dựng thẻ nay nói cùng một điều.
- AC-C: Given khối marker khai các hằng thông điệp từ chối trong
  `scripts/gate-card.js`, When đọc bước tiền đề của `commands/acceptance-card.md`
  VÀ chân `round-trip` của bộ răng hồ sơ `khong-ve-the-ma`, Then cả hai bên rút
  SỐ CA từ khối marker chứ không ghim hằng số — thêm một ca ở bên viết mà quên
  bên đo thì phép đo ĐỎ vì vật, không đỏ vì chính nó.

## Coverage

Phạm vi thu về ba tiêu chí, phủ bằng **lưới thường trực** — đúng luật Giới hạn
CHIỀU RỘNG (a): lưới thường trực là trần, không dựng thêm tầng đo.

- AC-A → ca `GD01`, `GD02` trong `tests/scripts/run-tests.sh` (hai lời thuật rút
  từ nguồn, kèm assert âm-tính phân biệt với hằng thiếu-hợp-đồng).
- AC-B → ca `GD03` (ghim tên field trong thông điệp).
- AC-C → chân `round-trip` của `_acceptance/khong-ve-the-ma/rang.sh` (17 assert,
  chiều đỏ: ghim lại hằng số 3 → đỏ) + ca `GD04`, `GD05`.
- Sửa **theo LỚP**: cùng lượt gỡ luôn chỗ ghim cứng «2 cặp kia» trong chính chân
  đó — hai chỗ cùng hình dạng, không vá một chỗ rồi để chỗ kia.

## Đường đo

Ngưỡng chốt ở Cổng Đáng 01/09 đo **làn thẻ và nghi thức ký** — cả hai đã trả về
ô, nên **không thước nào của ô cơ hội được vòng này trả lời**. Khai thẳng thay vì
đổi thước cho vừa phần còn lại:

- Thước «số lượt gọi người để ký một ô ở Cổng Đáng» · **chưa đo được** — nghi
  thức ký chưa dựng. Ô cơ hội giữ nguyên ngưỡng, chờ vòng sau.
- Thước «thẻ in đúng bốn lối ra sống» · **chưa đo được** — làn thẻ đã trả về ô.
- Thước «0 chữ của người bị máy viết trước» · **chưa đo được** cùng lý do.

## Out of scope

- Làn thẻ Cổng Đáng, chế độ ký trên lệnh duyệt, ngữ pháp `g0`, bộ răng 13 chân —
  trả về ô ở điều khoản dừng-vá.
- Sửa chất lượng bộ răng viết-tay-theo-hồ-sơ: owner quyết KHÔNG mở rộng hợp đồng
  để đo mã đo (luật Giới hạn CHIỀU RỘNG (a)); lớp đó thuộc ô
  `khuon-rang-dung-chung`, đang park.
- Lệnh thứ bảy cho Cổng Đáng.
- Sửa hợp đồng đã ký của hồ sơ `khong-ve-the-ma` — chỉ sửa bên ĐO của nó.

## Notes

- **LỖ CÒN MỞ, khai thẳng:** ô đang chờ Cổng Đáng VẪN nhận lời thuật «hồ sơ chưa
  có contract.md» với việc-kế sai hướng. Đó là DEFECT 1 của báo cáo 01/09 và
  vòng này KHÔNG đóng nó. Ca `GD05` ghim đúng trạng thái đó để lỗ không vô hình.
  Bốn ô ở kho kit còn kẹt: `lan-may-thong-duong-ghi`,
  `phep-kiem-sach-do-theo-vung`, `hinh-o-moi-cong-dung-cho-nguoi`,
  `the-xep-nham-o-se-lam`.
- **Phần CHƯA được chấm bằng phiên sạch:** bản thu phạm vi (gỡ làn) và bản vá
  lớp cho chân `round-trip` viết SAU vòng chấm r2. Bằng chứng cho chúng là bốn
  suite + chiều đỏ chạy tay, không phải một vòng S4 mới. Người ký cần biết điều
  này trước khi ký.
- Hai vòng chấm r1/r2 nằm ở `evidence-report.md` (bản r2) và
  `review-findings.md`; bản r1 lấy ở commit `d90af7d2`.
- Cờ vàng W6 «thẻ» giữ nguyên như bản duyệt 01/09.
