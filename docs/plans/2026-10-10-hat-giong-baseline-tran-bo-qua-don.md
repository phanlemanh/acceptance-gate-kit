# Hạt giống — làn đối chứng (và làn máy) bị khung từ chối trong phiên cô lập worktree

Gốc: `_acceptance/baseline-tran-bo-qua-don/` (ô dựng khối lệnh baseline kit sinh). Quan sát: bốn lượt chấm DP2
`dieu-phoi-mo-dot-mot-lenh` ngày 10/10/2026, nhật ký ở
`~/.claude/projects/-Users-manhphan-dev-acceptance-gate-kit--claude-worktrees-dieu-phoi-tho/caae7069-…/subagents/workflows/`
(`wf_66e9ef08-3f9`, `wf_f1eff750-455`, `wf_fa607839-c2c`; cùng hình ở lượt DP1 `wf_1ff12902-6b9`). Hạt giống là SỔ,
không phải ô.

## 1. Gốc rễ: phiên vào worktree bằng `EnterWorktree` thì Bash từ chối mọi lệnh git không chứng minh được ở trong worktree

Phiên DP2 mở ở checkout chính rồi gọi `EnterWorktree` (00:35Z 10/10). Từ đó phiên ở chế độ cô lập worktree, và
tác tử con của Workflow cũng thừa hưởng chế độ này. Khối baseline kit sinh `git -C "$R" worktree add … "$WT"`
với `$WT` nằm trong `$TMPDIR`, ngoài worktree. Tác tử baseline gọi khối ấy, và công cụ trả `is_error` ngay, chưa
chạy byte nào:

> This session is isolated in the worktree …/dieu-phoi-tho, but this command is too complex to verify that it
> stays inside the worktree. Refusing to run it

Đây là một lần TỪ CHỐI CỨNG, không phải hộp xin quyền đang treo. Nó cũng không do hết giờ, cắt đầu ra hay cú
pháp `bash -c` của eval. Tác tử làm đúng đề bài: không tách lệnh, trả `dauRa: ""` kèm lý do đầy đủ trong
`results[].reason`.

Chiều đỏ / chiều xanh, đo 10/10: chép ĐÚNG khối baseline của lượt 3, chỉ đổi `R`/`D`, rồi chạy trong một phiên
mở thẳng trong worktree (app tạo, cùng chế độ `auto`). Kết quả: `__BL_BAT_DAU 1 · __BL 1 xong 0 · __BL_XONG`,
118 ca DP1 xanh ở merge-base, worktree tạm đã dọn. Như vậy eval `bash -c '…'` của `dieu_phoi_dp2` không phải
nguyên nhân. Phiên `chu-ky-khong-tu-lam-hoa-cu` (15/09, Claude Code 2.1.270) cũng vào bằng `EnterWorktree` và
gặp cùng thông điệp.

Làn máy cũng dính: khung bọc `( cd "$R" || exit 97 && <lệnh> ) > "$F"` bị từ chối («runs bash inside a construct
too complex to verify»). Số tác tử bị từ chối ít nhất một lần, trên tổng số tác tử của làn: 10/14 ở lượt 1, 10/14
ở lượt 2, 10/12 ở lượt 3, 3/3 ở lượt 4 (đang chạy). Các tác tử TỰ VIẾT LẠI lệnh cho chạy được, nên cam kết
«nguyên văn» đã gãy. Lượt 1 có một tác tử bỏ sót tham số `bash` của `--manh`, nhận exit 2, rồi mới chạy lại đúng.

Nghiệm đúng tầng là VẬN HÀNH, giá 0: phiên chạy vòng có S4 phải mở thẳng trong worktree (app «phiên mới trong
worktree», hoặc `cd <worktree> && claude`), không vào bằng `EnterWorktree`. Không lách kiểm tra bằng cách nhét
lệnh vào tệp: kiểm tra ấy chính là phần cô lập mà người mở phiên đã chọn.

## 2. Thông điệp BLOCKED vứt lý do tác tử đã khai (bộ đọc)

`acceptance-verify.js` (`baselineHaTang`, nhánh `!doc.du`) chỉ đọc `dauRa`. Khi `dauRa` rỗng, nó in bốn khả năng
đoán («bị dừng, chờ hộp xin quyền, đầu ra bị cắt, hoặc lệnh eval vỡ cú pháp shell»), trong khi
`results[0].reason` đã mang nguyên văn thông điệp từ chối. Người đọc thẻ phải lần journal mới biết gốc. Hướng
(bộ đọc khoan dung, không đổi khuôn): `dauRa` rỗng mà tác tử có khai `reason` thì nối reason ấy (cắt ngắn) vào
`baselineHaTang`. JS vẫn KHÔNG tin reason làm kết quả đo.

## 3. Chưa đo: dựng cây baseline bằng `git archive` thay `git worktree add`

`git archive <B> | tar -x -C "$WT"` chỉ ĐỌC kho của chính phiên. Nó có thể qua được kiểm tra cô lập, và bỏ được
cả bộ khoá/dọn worktree mồ côi (TRỪ). Điều này chưa đo trong một phiên `EnterWorktree`, nên chưa phải đề xuất.

Ngưỡng mở ô: ≥1 lượt S4 ở một kho tiêu thụ có làn baseline hoặc làn máy bị khung từ chối vì phiên cô lập
worktree, sau khi lời dặn vận hành ở §1 đã có trong GUIDE/SKILL.
