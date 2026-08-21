# Kiểm tay harness — lời khai của người

**Trạng thái: CHƯA KIỂM ĐƯỢC.** Owner khai 2026-08-22 (phiên dựng hồ sơ, máy
`manhphan@darwin`): chưa mở được repo có `.claude/settings.json` trên một máy
thứ hai, nên **không** trả lời được hai câu dưới. Không suy đoán, không điền hộ.

| # | Câu hỏi | Trả lời |
|---|---|---|
| 1 | `enabledPlugins.<plugin>: true` ở **cấp repo** có thắng `false` ở **cấp user** không? | **chưa kiểm được** |
| 2 | Khoá đó kích hoạt lời nhắc **CÀI** plugin chưa có, hay chỉ **BẬT** plugin đã cài? | **chưa kiểm được** |

## Vì sao file này tồn tại

AC-10 của hợp đồng: bằng chứng máy chỉ chứng minh **file `.claude/settings.json`
được ghi đúng**. Điều tính năng thật sự hứa — máy sau mở repo là có đúng bộ
plugin — là **hành vi của harness**, nằm ngoài tầm đo của suite. Kit không giả
vờ đo được nó; nó đòi một lời khai của người, có ngày và có máy.

## Hệ quả đã chấp nhận

- Eval **E10 = UNCERTAIN** (không PASS), verdict hồ sơ **PENDING-JUDGMENT**.
- Lời hứa «máy sau chỉ cần `marketplace add` rồi mở repo» trong GUIDE §5.1 hiện
  là **suy luận từ tài liệu Claude Code, chưa có quan sát thực địa**. Nếu câu 2
  hoá ra là «chỉ BẬT plugin đã cài», thì máy sau vẫn phải `claude plugin install`
  ba plugin còn lại và GUIDE §5.1 phải sửa — phần script/init/khai file **không**
  đổi, vì chúng đúng trong cả hai kịch bản.
- Phần đã chứng minh vẫn đứng: file được ghi đúng, hợp nhất không phá khoá đội,
  sáu lối lỗi đều fail-loud, bốn nơi khai tên plugin khớp nhau.

## Cách đóng lời khai này về sau

Mở một repo đã có `.claude/settings.json` (do `acceptance-init` bước 5b ghi)
trên **máy khác** hoặc phiên khác, quan sát Claude Code lúc mở, rồi thay hai ô
«chưa kiểm được» bằng có/không dứt khoát kèm ngày + máy. Rồi chạy lại eval E10.
