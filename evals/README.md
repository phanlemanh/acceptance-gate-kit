# Ca đo skill (`claude plugin eval`) — viết trước, chờ enablement

**Trạng thái (2026-08-30):** `claude plugin eval` đang early access và org
**chưa được bật** — chạy trong thư mục rỗng in «currently in early access»
(kiểm trên 2.1.243 lẫn 2.1.251). Bộ ca ở đây được viết theo khuôn đối chiếu từ
`claude plugin eval --help` (2.1.251): mỗi ca là `<tên-ca>/prompt.md` +
`graders/*.md` (+ `case.yaml` cho scaffold); thư mục mặc định là `evals/` dưới
gốc plugin — chính là thư mục này.

**Vì sao bộ này tồn tại:** kit có 23 file SKILL.md/command là hành vi thật,
nhưng cả 6 suite test chỉ đo được script và fixture — không suite nào chạy một
skill rồi chấm đầu ra. Đây là tầng thước còn thiếu; hồ sơ đầy đủ ở
[docs/findings/2026-08-30-ra-soat-tinh-nang-moi-anthropic.md](../docs/findings/2026-08-30-ra-soat-tinh-nang-moi-anthropic.md).

## Lệnh chạy dự kiến (khi được bật)

```bash
claude plugin eval . --scaffold --allow-tools Bash --json evals/results/latest.json --threshold 1
```

- `--scaffold` bắt buộc: fixture của mỗi ca do `scaffold.sh` **sinh bằng code**
  trong chính lần chạy (luật kit — không fixture viết tay theo khuôn bên đọc).
- `--allow-tools Bash`: Bash là tool gated, phải cấp tường minh.
- Lần chạy ĐẦU TIÊN sau khi bật: chạy một ca (`--case goi-thang-ten`) và đối
  chiếu tên field frontmatter/grader với thực tế — tên field ở đây lấy từ
  `--help` + tham chiếu chưa có docs công khai, có thể phải chỉnh tên khoá
  (ý của ca là tài sản; tên field là chi tiết).

## Ba ca — và luật đối chứng dương giữa các ca

Cả ba nhắm `acceptance-card` — skill duy nhất cố ý mở cho model tự gọi
(ADR 0002), nên đo được không vướng khoá.

| Ca | Đo gì | Grader |
|---|---|---|
| `goi-thang-ten` | Gọi thẳng lệnh: skill phải chạy **renderer thật** (`gate-card.js`), không tự tay viết thẻ | `tool_used` Bash khớp `gate-card` · `regex` «Hệ thống SẼ làm» · «Sẽ KHÔNG làm» |
| `kich-hoat-tu-ngu-canh` | Người nói tiếng sản phẩm, KHÔNG nêu tên skill — model có tự tìm đúng skill không (trigger accuracy; hưởng lợi từ ablation with/without) | `tool_used` Skill khớp `acceptance-card` · `regex` «Hệ thống SẼ làm» |
| `thieu-ho-so-khong-ve-the-ma` | **Chiều đỏ.** Slug không tồn tại → KHÔNG được trình thẻ như thật, không hỏi «duyệt hay sửa» một hồ sơ ma | `regex` not_contains «Hệ thống SẼ làm» · not_contains «duyệt hay sửa» |

**Đối chứng dương cho ca chiều đỏ** (luật «assertion âm-tính-một-mình là
assertion không sống»): cả hai chuỗi mà ca 3 khẳng định VẮNG đều được ca 1
khẳng định CÓ MẶT trên cùng khuôn thẻ — ca 1 xanh chứng minh chuỗi ghim là
thật, ca 3 mới có nghĩa.

**Ca 3 dự kiến ĐỎ ngay hôm nay — cố ý.** Đã kiểm 30/08: `gate-card.js` với
slug không tồn tại exit 0 và vẽ trọn một thẻ Cổng 1 (kèm khối «👉 VIỆC CỦA
ANH» hỏi duyệt), và `commands/acceptance-card.md` không có chốt kiểm hồ sơ
tồn tại. Ca này ghim hành vi ĐÚNG; nó đỏ là phát hiện lỗ, không phải ca hỏng.
Lỗ này có hạt giống riêng — đừng vá trong thư mục evals.

## Luật viết ca mới

1. **Grader tất định là xương sống** (`tool_used`/`tool_order`/`regex`/
   `file_exists`); grader `llm` nhiễu, không seed — chỉ làm lớp phụ, không
   bao giờ là grader duy nhất của một ca.
2. Fixture do `scaffold.sh` sinh bằng code; đường dẫn suy từ cwd của lần chạy.
3. Chuỗi ghim trong ca âm phải có ca dương ghim CÙNG chuỗi đó.
4. Ca đo ĐẦU RA của skill (tool đã gọi, chữ tới người), không đo văn bản
   chỉ dẫn trong SKILL.md.
