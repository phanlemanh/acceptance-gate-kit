---
description: Mở phiên làm việc — quét xưởng, trình thẻ 3 nhóm, người chọn một chữ cái rồi bàn giao
disable-model-invocation: true
---

Nghi thức vào phiên. Lệnh CHỈ định hướng + bàn giao — không đọc/ghi file sản
phẩm, không sửa gì, không tự làm nội dung thay nghi thức đích.

1. **Quét máy, không hỏi người:** chạy
   `node ${CLAUDE_PLUGIN_ROOT}/scripts/start-scan.mjs --root .` → JSON một dòng.
   `config` là `false` → in đúng một dòng: "Repo này chưa dựng cổng nghiệm thu —
   chạy `/acceptance-init` trước." rồi DỪNG, không quét tiếp, không hỏi thêm.

   Các key JSON lệnh này đọc (máy đối chiếu với đầu ra script thật ở case
   round-trip — đổi tên một phía là kiểm thử đỏ):
   <!-- <<<START-SCAN-KEYS
   config
   git.branch git.dirty
   groups.gates[].slug groups.gates[].gate groups.gates[].since groups.gates[].tier
   groups.inProgress[].slug groups.inProgress[].status groups.inProgress[].nextStep groups.inProgress[].tier
   groups.done[].slug groups.done[].state
   map.present map.fresh map.enabled
   broken[].slug broken[].file broken[].reason
   START-SCAN-KEYS>>> -->

2. **Nạp luật TRƯỚC khi viết:** đọc
   `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/human-facing-language.md`
   (sáu luật N1–N6, hai phép thử, khuôn trình bày) TRƯỚC khi viết bất kỳ câu nào
   sẽ hiện cho người. Mỗi lần render là một lần đọc — luật không sống trong trí nhớ.

3. **Trình MỘT thẻ, ba nhóm, đúng thứ tự ưu tiên:**
   - **Chờ chữ ký của anh** (`groups.gates` — script đã xếp cổng chờ lâu nhất
     lên đầu, giữ nguyên thứ tự): mỗi cổng một dòng — cổng nào (`dang` = Cổng
     Đáng: quyết có làm việc này không · `pham-vi` = Cổng Phạm vi: duyệt bộ tiêu
     chí trước khi code · `bang-chung` = Cổng Bằng chứng: đọc bằng chứng rồi ký
     · `gia-tri` = Cổng Giá trị: xem số thật từ phiên nghiệm thu rồi quyết giao
     rộng / lặp thêm / dừng), của việc nào, ước ~10 phút.
   - **Đang dở** (`groups.inProgress`): mỗi vòng một dòng — *người dùng sẽ được
     gì* (một câu từ tên việc, KHÔNG mở file sản phẩm ra đọc) + bước kế viết
     BẰNG CHỮ, mã máy trong ngoặc — tra bảng: chốt thiết kế và tiêu chí (`S1`)
     · lập kế hoạch (`S2`) · viết code (`S3`) · sửa theo bằng chứng (`S3-fix`)
     · nghiệm thu máy (`S4`). Lần đầu một mã hiện trên thẻ phải kèm nghĩa.
   - **Bắt đầu việc mới** — đúng ba lối, không thêm lối nào: (a) ý còn mơ hồ →
     buổi khai thác vòng HIỂU (grill/brainstorm theo nghi thức advisor); (b)
     việc đã rõ → `/feature-loop <mô tả>`; (c) việc vặt khớp miễn trừ T1 →
     xác nhận nó là T1 rồi KẾT THÚC `/start` — người ra lệnh sửa ở lượt kế,
     ngoài nghi thức này (lệnh `/start` không sửa gì, kể cả việc vặt).
   - Dưới thẻ: một dòng bản đồ sản phẩm — `map.present` là `false` thì đọc
     `map.enabled`: `true` → "chưa có bản đồ sản phẩm (sẽ tự vẽ ở lần ký cổng
     kế)"; `false` → "repo chưa bật bản đồ sản phẩm — bật bằng hai dòng trong
     `_acceptance/config.yaml`"; `null` → "chưa đọc được cấu hình nên chưa biết
     bản đồ đã bật chưa" (ĐỪNG khuyên bật một thứ có thể đã bật rồi). ĐỪNG hứa bản đồ sẽ tự tới khi repo chưa bật:
     mọi thân cổng người được dặn BỎ QUA việc vẽ ở đúng repo đó, nên người sẽ
     đợi một thứ không bao giờ tới. `map.fresh` là `false` →
     "bản đồ đang lệch với hồ sơ — làm mới bằng một lệnh"; `null` → "chưa kiểm
     được bản đồ" (KHÔNG nói là khớp). Rồi mỗi phần tử
     `broken[]` một dòng cờ hỏng: việc nào, hồ sơ nào
     (`file`), vì sao (`reason`) — việc có hồ sơ hỏng vẫn phải hiện, không giấu.
   - `groups.done` chỉ đếm gộp một dòng cuối thẻ (đã xong/đã xếp lại: N việc).

4. **MỘT câu hỏi chọn bằng chữ cái/số dòng** — không hỏi câu thứ hai. Người
   chọn xong → bàn giao sang nghi thức đích:
   - Chọn một cổng → `/acceptance-card <slug>`; riêng cổng `gia-tri` → skill
     `uat-session <slug>` (phiên nghiệm thu có nghi thức riêng, không phải thẻ).
   - Chọn một vòng dở → `/feature-loop <slug>` — NHƯNG nếu `git.dirty` là
     `true` hoặc phiên đang đứng cây chung với vòng khác: nhắc mở worktree/
     phiên riêng TRƯỚC, chưa đưa lệnh resume (cạm bẫy một-worktree-một-phiên).
   - Chọn việc mới → đi đúng lối (a)/(b)/(c) ở bước 3.

5. Lệnh KHÔNG tự làm nội dung. Bàn giao xong là hết vai.
