# Hình của hồ sơ release-2-6-0

Tầng 2 theo [DIAGRAM-RULE](../../../docs/reference/DIAGRAM-RULE.md): hình đi kèm
hồ sơ, qua PR, diff được. **Hình là chiếu của nguồn chữ, không phải nguồn.**
Muốn đổi thì sửa ở nguồn rồi vẽ lại.

---

## H1 — `h1-noi-goi-nguoi-2-6-0.html`

**Nơi kit gọi người ở 2.6.0, và nơi máy tự đi tiếp.** Swimlane hai làn.

Cách đọc:

- Làn dưới (nền nhạt) là **người**: bốn hộp viền đậm là bốn cổng, mỗi cổng một
  chữ ký. Làn trên là **máy**: ba hộp máy chạy một mình, không hỏi.
- Đường đặc zigzag lên xuống chính là **mỗi lần công việc đổi tay**. Đếm số lần
  nó chạm làn dưới là đếm được số lần người bị gọi trong thiết kế.
- Hai đường **đứt màu cam nằm ngang trong làn máy** là chỗ 2.6.0 khác các bản
  đời đầu: ở hạng T2, máy không dừng chờ ký mà ghi cửa veto rồi chạy tiếp —
  vượt qua Cổng Phạm vi và Cổng Bằng chứng. Người vẫn lật được, nhưng không bị
  gọi.
- Hình này vẽ **bốn** cổng. Hạng T3 còn một cổng thứ năm (duyệt kế hoạch thi
  công) — cố ý để ngoài hình vì nó không áp cho T2, và thêm nó vào làm loãng
  câu chuyện chính.

Nguồn chữ: `feature-loop/skills/feature-loop/SKILL.md` (khối «Bất biến dừng») ·
`CLAUDE.md` · `PRODUCT-MAP.md`.

---

## H2 — `h2-sau-luot-goi-nguoi.html`

**Sáu lượt gọi người trong vòng `cong-dang-co-cua`, 01/09.** Timeline.

Cách đọc:

- Khoảng cách giữa các chấm là **thời gian thật** (09:09 → 14:50, giờ +07),
  không dàn đều — chỗ thưa là chỗ máy làm việc một mình.
- Vùng nền nhạt bên phải bắt đầu **sau chấm thứ ba**: ngưỡng owner khai 30/08 là
  3 lượt mỗi vòng, nên từ chấm thứ tư trở đi là phần vượt.
- Chấm **cam to** là lượt duy nhất máy **tự chèn** — chính luật của kit cấm hỏi
  ở ranh giới đó («MỌI ranh giới stage khác: đi tiếp NGAY, không hỏi *chạy S4
  nhé?*»). Hai chấm xám là dừng-lỗi có tên trong luật; ba chấm đen là cổng thiết
  kế.
- Dòng cam ở chấm cuối: **bản findings 01/09 đếm sót chính lượt này**. Nó chốt
  con số lúc 13:20, trước chữ ký lúc 14:50 mà chính nó có ghi — nên số cũ là 5,
  số đúng là 6.

Nguồn chữ: `docs/findings/2026-09-01-ba-dong-so-vong-cong-dang.md` ·
`_acceptance/cong-dang-co-cua/decisions.jsonl` · `git log` ngày 01/09.

---

Vẽ bằng skill `diagram-design` 2.7.0, skin mặc định của kho
(`docs/reference/diagram-skin.md`). Cả hai hình qua cổng thẩm mỹ của skill:
`check_label_occlusion.py` và `check_overflow.py` đều exit 0.
