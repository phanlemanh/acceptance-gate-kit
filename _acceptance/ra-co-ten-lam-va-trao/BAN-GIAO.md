> **ĐÃ ĐƯỢC QUYẾT (25/08).** File này là bản escalate viết lúc máy tạm dừng, giữ
> làm VẾT. Owner sau đó chọn: chạy một vòng chấm cuối rồi ký. Vòng 14 đạt 15/15,
> owner ký 25/08 với phạm vi rút gọn (AC-6 ii+iii cố ý không đạt, ghi trong sổ
> quyết định). Trạng thái hiện tại đọc ở `contract.md` + `evidence-report.md`,
> không đọc ở file này.

# Bàn giao — vòng lặp chấm đã VƯỢT TRẦN, dừng theo luật của chính kit

`feature-loop` SKILL, nhánh S4: **«Tối đa 3 round — quá → DỪNG, escalate user kèm
phân tích từng round.»** Hồ sơ này đã đi **7 vòng chấm** kể từ vòng tôi tuyên là
cuối. Đây là bản escalate đó.

## Vì sao dừng, chứ không chấm tiếp

Mỗi vòng vá sinh ra lỗi cùng lớp ở chỗ mới — và **hai lỗi NẶNG của vòng 12 là do
chính bản vá vòng 10 và vòng 11 của tôi**:

| Vòng | Việc tôi làm | Vòng sau tìm ra |
|---|---|---|
| r10 | Cho `MAY_THONG` đọc thẳng status để thôi liệt khoá bằng tay | Repo chưa dựng cổng: thẻ MẤT lối ký **và** khẳng định sáu điều kiện mà không ai kiểm |
| r11 | Bắt bản đồ hỏi `khongCanNguoi` | Đặt chốt SAU `if (duongA) return …` → hồ sơ đường A thoát trước khi bị kiểm; **tái tạo đúng lớp lỗi vừa giết, chỉ đổi chỗ** |
| r10 | Cho ô «cân nhắc» mang cờ quá-hạn | RT13 vẫn assert ô đó có cờ RỖNG — xanh-không-chạy, và cãi nhau với mô tả eval |

Đó đúng chữ ký của **luật dừng-vá**: vòng vá thứ hai sinh lỗi cùng lớp = sai
khuôn, không phải sai dòng. Vá tiếp là tôi tự quyết một thứ thuộc về owner:
**còn bao nhiêu rủi ro thì chấp nhận được.**

Thêm một sự thật về hạ tầng: 4/7 vòng cuối **không cho ra kết quả thật** — ba
vòng bị classifier rate-limit, một vòng trả REJECT GIẢ vì output bị công cụ cắt
ở dòng 399/781 (suite thật exit 0, 0 ca FAIL). Vòng chấm không còn là phép đo
đáng tin ở nhịp này.

## Trạng thái thật hôm nay

- `status: implemented` — hồ sơ **chưa** có bằng chứng PASS tại commit hiện tại,
  và tôi KHÔNG viết bằng chứng đó (người làm ≠ người chấm).
- Bốn bộ kiểm XANH do **tác giả** chạy: scripts 750 · hooks 60 · plugins toàn bộ
  · workflows 44 · bản đồ khớp. Đây là lời khai của người làm, **không thay
  được** một vòng chấm phiên tươi.
- Lưới trước-merge còn **hai** VIOLATION: verdict của hồ sơ này, và hồ sơ
  `duong-do` cần ghim lại (cascade tự-host, luật re-pin theo release).
- Sổ giới hạn: **28 dòng** cho riêng hồ sơ này.

## Cái ĐÃ chứng minh được, và cái CHƯA

**Đã chứng minh** (có ca đo bám vật, mỗi ca đã phá thử một lần):
lối ra «không đo được» có tên · cờ quá hạn · ô đóng có hồ sơ · luật ngưỡng một
chỗ + chống-chép · bản đồ ⇔ bộ quét đồng kết luận (kể cả bằng chứng bẩn) · thẻ
không gọi đề-xuất-của-máy là lời khai của người · hồ sơ `duong-do` thoát treo.

**Chưa chứng minh:** làn «máy đã thông» như một tổng thể. Đường GHI đã tắt từ
vòng 7; đường ĐỌC đã qua ba vòng vá liên tiếp và vòng nào cũng còn lỗi.

## Việc của anh — MỘT quyết định

Phạm vi đã duyệt ở Cổng 1 (AC-6 ii+iii) đòi máy tự đặt `machine-cleared`. Tôi
đã gỡ nó. **Hợp đồng vì vậy KHÔNG đạt như đã ký** — tôi không sửa hợp đồng để
nó khớp với việc mình làm.

Ba lối, không lối nào tôi được tự chọn:

1. **Nhận phạm vi rút gọn** — ship nửa «ra có tên», làn máy-thông ở lại
   `_acceptance/lan-may-thong-duong-ghi/`. Cần một vòng chấm sạch trước khi ký.
2. **Thu tiếp** — bỏ luôn phần ĐỌC của làn máy-thông khỏi hồ sơ này, chỉ ship
   nửa ngưỡng/lối-ra. Nhỏ hơn, chắc hơn, và cắt hẳn nguồn sinh lỗi ba vòng qua.
3. **Trả lại** — hợp đồng giữ nguyên như đã ký, vòng làm lại từ S2 với khuôn
   khác cho làn máy-thông.
