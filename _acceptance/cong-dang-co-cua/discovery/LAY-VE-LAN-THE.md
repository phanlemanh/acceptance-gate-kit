# Lấy làn thẻ Cổng Đáng về — dùng CÂY, đừng dùng bản vá

Vòng 01/09 dựng trọn làn thẻ Cổng Đáng rồi **thu phạm vi** ở điều khoản dừng-vá
(hai vòng chấm liên tiếp sinh lỗi CÙNG LỚP). Mã KHÔNG bị vứt — nó nằm nguyên
trong lịch sử, lấy về bằng cây đã ghim.

**Mốc ghim (cây còn NGUYÊN làn thẻ + chế độ ký + 13 chân răng):**
`528caaa81f70971b0a827a31457c49a1b1cd53d1`

Lấy về:

```bash
git archive 528caaa81f70971b0a827a31457c49a1b1cd53d1 scripts commands skills lib _acceptance/cong-dang-co-cua | tar -x -C /nơi/muốn/bung
```

Đối chiếu phần bị thu so với nhánh hiện tại:

```bash
git diff 528caaa81f70971b0a827a31457c49a1b1cd53d1 HEAD -- scripts/gate-card.js commands/approve.md commands/start.md skills/acceptance/references/human-facing-language.md
```

## Phần nào bị thu, phần nào ở lại

**Thu về ô (không merge):** làn `gate === '0'` trong bộ dựng thẻ · chế độ ký
Cổng Đáng trong thân lệnh duyệt · bàn giao cổng `dang` trong nghi thức vào phiên
· ba ô `g0` trong ngữ pháp câu gộp · bộ răng 13 chân của hồ sơ.

**Ở lại (độc lập với làn thẻ, đã chứng minh giá trị riêng):** hai lời thuật từ
chối «ý đã đóng» và «hồ sơ hỏng» · bốn assertion của lưới thường trực được hồi
sinh · ca tự-canh SELF01/SELF02 · bản vá lớp cho chân `round-trip` của hồ sơ
`khong-ve-the-ma`.

## Điều PHẢI đọc trước khi mở lại

Hai vòng chấm 01/09 để lại **34 phát hiện, 0 do phép đo máy bắt** — toàn bộ do
rà soát đối kháng. Ba lớp tái phát qua cả hai vòng:

1. **Cờ người dùng xuyên qua chốt.** r1: `--gate 0` xuyên chốt thẻ-ma. r2:
   `--gate 1`/`--gate 2`/`--gate 9` bị làn Cổng Đáng nuốt im lặng, in thẻ của
   cổng khác rồi thoát 0. Cùng lớp, đảo chiều.
2. **Hai nguồn cho một luật.** r1: bộ dựng và máy quét lệch ở `stage`/`decision`.
   r2: bộ dựng dùng «chứa» còn lib dùng «đứng đầu» cho tiền tố `[đề xuất]`.
3. **Đối chứng dương CHÉP công thức thay vì GỌI phép đo đang canh** (SELF02).

Mở lại mà không đổi khuôn bộ răng thì lớp 1–3 sẽ tái phát lần thứ ba. Ô
`khuon-rang-dung-chung` (park 30/08) là chỗ lớp đó thuộc về — nhưng nó cũng đã
không hội tụ qua hai vòng S4, nên mở lại **cả hai** cần một quyết định riêng của
owner, không phải một bước kế.

Hồ sơ đầy đủ: `evidence-report.md` + `review-findings.md` của r1 và r2 nằm cùng
thư mục này (r2 ghi đè r1 — bản r1 lấy ở commit `d90af7d2`).
