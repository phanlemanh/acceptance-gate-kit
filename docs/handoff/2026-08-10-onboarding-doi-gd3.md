# Onboarding đội — dùng kit từ GĐ3 (đọc 5 phút)

*2026-08-10 · Kèm thông báo #2. Kit acceptance-gate **1.40.0** / feature-loop
**1.27.1** — bản đã qua 3 ván thật ở repo thí điểm. Mọi vấp của bạn ghi vào
`docs/research/so-vap-trien-khai.md` (kho kit) — ĐỪNG tự vá kit.*

> Nói cho gọn: **"kit 2.1" là tên lô việc, không phải số bản.** Số thật để
> đối chiếu khi cài là **acceptance-gate 1.40.0 / feature-loop 1.27.1**.

## 1 · Cập nhật plugin cho ĐÚNG (hai bẫy đã có người dẫm)

```bash
# BẪY 1: clone marketplace cũ làm update câm. Luôn pull clone TRƯỚC:
cd ~/.claude/plugins/marketplaces/acceptance-gate-kit 2>/dev/null && git pull
claude plugin update acceptance-gate && claude plugin update feature-loop
```
- **Kiểm bằng NỘI DUNG, đừng tin số version** — số `1.39.2` từng đứng yên suốt
  4 chip (② ②b ③ ③b không bump), nên **ai đang ở `1.39.2` có thể mang ruột cũ
  mà `update` vẫn báo "đã mới nhất"**. Bản `1.40.0` gom đủ cả 4 chip đó — nhưng
  số chỉ là gợi ý, ba câu dưới mới là lời cuối:
  ```bash
  grep -c "VIỆC CỦA ANH" ~/.claude/plugins/*/acceptance-gate/scripts/gate-card.js       # ≥1 (chip ②)
  grep -c "GATE-ONESHOT-GRAMMAR" ~/.claude/plugins/*/acceptance-gate/skills/acceptance/references/human-facing-language.md   # ≥1 (chip ③/③b)
  ls ~/.claude/plugins/*/acceptance-gate/scripts/recheck-evidence.cjs                    # phải có, đuôi .cjs
  ```
  Thiếu bất kỳ câu nào → gỡ cài lại (`uninstall` + `install`), đừng `update`.
- **BẪY 2: phiên đang mở giữ skill cũ** — update xong phải MỞ PHIÊN MỚI.

## 2 · Sau khi chép bộ cổng vào repo (acceptance-init) — PHẢI RE-PIN

Chép/cập nhật `scripts/` + `lib/` từ kit vào repo của bạn làm bằng chứng đã
ký cũ đi (lưới staleness tính chúng là mã đổi). **Chép xong → chạy một làn
suite tại commit đó → cập nhật `verified_commit` (nghi thức re-pin)** — có
tiền lệ 4 lần, không cần vòng chấm mới. Không re-pin thì pre-merge đỏ oan.

## 3 · Số kỳ vọng THẬT (đo từ 3 ván — không tô đẹp)

| Đường | Bạn bị gọi | Ghi chú |
|---|---|---|
| C — kỹ thuật/backend | **2–3 lần/feature** (Cổng 1 · ký · +1 nếu T3) | ship thẳng sau ký |
| A — có giá trị người dùng mới | **4 cổng** (Đáng · 1 · ký · UAT) **+ grill** (1–2 lượt hỏi đáp — đây là NỘI DUNG việc của bạn, không phải thuế) **+ phản ứng mắt** khi xem bản chạy | UAT cần ≥1 người chấm không phải bạn |

Thẻ cổng luôn kết bằng khối **👉 VIỆC CỦA BẠN** — chỉ cần đọc khối đó và trả
lời một câu gộp theo câu mẫu. Số phút KHÔNG phải điền (để 0 nếu bị hỏi).

## 4 · Ba luật ngắn khi vấp

1. **Vấp gì ghi sổ vấp kho kit, đừng tự vá engine** — kể cả lỗi chặn-việc:
   ghi + báo, sẽ có người quyết. Kit đóng giữa các đợt có chủ đích.
2. Máy nói **DỪNG** (REJECT lặp / BLOCKED / chờ người) là cơ chế, không phải
   hỏng — đọc lý do nó in ra rồi quyết, đừng ép chạy tiếp.
3. **KILL tại Cổng Giá trị là thành công quy trình** — câu trả lời "chưa đủ"
   mua bằng giá một vòng dựng là món hời. Đội thí điểm vừa làm đúng như vậy.
