---
description: Mở phiên làm việc — quét xưởng, trình thẻ 3 nhóm, người chọn một chữ cái rồi bàn giao
disable-model-invocation: true
---

Nghi thức vào phiên. Lệnh CHỈ định hướng + bàn giao — không đọc/ghi file sản
phẩm, không sửa gì, không tự làm nội dung thay nghi thức đích.

Một-lượt-gõ + `--repo` (điều khoản chung, chép nguyên văn từ bản luật):

Ba lệnh có-câu-hỏi (`/acceptance-gate:approve` · `/acceptance-gate:signoff` · `/acceptance-gate:start`) nhận MỘT CÂU GỘP theo ngữ pháp `GATE-ONESHOT-GRAMMAR` trong bản luật ngôn ngữ mặt người — câu gộp là câu NGƯỜI gõ — cờ và ngữ pháp này không mở đường cho máy gọi lệnh; vắng câu gộp thì hỏi từng bước như cũ. Mọi lệnh cổng người nhận cờ `--repo <path>`: mọi đọc/ghi/git của lệnh chạy trên gốc `<path>` (`git -C <path>`, script kèm `--root <path>`); vắng cờ thì gốc là thư mục hiện tại như cũ. Đầu ra theo bản luật ngôn ngữ mặt người.

Ví dụ một lượt gõ đầy đủ: `/acceptance-gate:start abc-xyz --repo /duong/dan/repo`

Câu gộp của lệnh này là chọn-trước bằng slug: `/acceptance-gate:start <slug>` — vẫn quét máy
ở bước 1 như thường, rồi slug nằm trong nhóm nào thì bàn giao thẳng theo lối
nhóm đó ở bước 4 (không hỏi câu chọn) và HIỂN THỊ LẠI nhóm đã khớp một dòng
(hồ sơ nào, nhóm nào, đi lối nào) trong cùng lượt trả lời — máy gánh phần
đối chiếu, người không phải tự dò thẻ; không thấy slug trong nhóm nào →
trình thẻ như cũ. Lệnh vẫn CHỈ định hướng + bàn giao, không sửa gì. Với
`--repo <path>`: chạy quét bằng `--root <path>` và mọi nhắc nhở
worktree/nhánh đọc từ git của `<path>`.

1. **Quét máy, không hỏi người:** chạy
   `node ${CLAUDE_PLUGIN_ROOT}/scripts/start-scan.mjs --root .` → JSON một dòng.
   `config` là `false` → in đúng một dòng: "Repo này chưa dựng cổng nghiệm thu —
   chạy `/acceptance-gate:acceptance-init` trước." rồi DỪNG, không quét tiếp, không hỏi thêm.

   Các key JSON lệnh này đọc (máy đối chiếu với đầu ra script thật ở case
   round-trip — đổi tên một phía là kiểm thử đỏ):
   <!-- <<<START-SCAN-KEYS
   config
   git.branch git.dirty
   groups.gates[].slug groups.gates[].gate groups.gates[].since groups.gates[].tier groups.gates[].stateKey groups.gates[].label groups.gates[].viecKe
   groups.inProgress[].slug groups.inProgress[].status groups.inProgress[].nextStep groups.inProgress[].tier groups.inProgress[].stateKey groups.inProgress[].label groups.inProgress[].viecKe
   groups.considering[].slug groups.considering[].name groups.considering[].since groups.considering[].ageDays groups.considering[].stateKey groups.considering[].label groups.considering[].viecKe
   groups.done[].slug groups.done[].state groups.done[].stateKey groups.done[].label groups.done[].viecKe
   map.present map.fresh map.enabled map.state map.label
   discovery.brainstormSkill
   broken[].slug broken[].file broken[].reason broken[].stateKey broken[].label broken[].viecKe
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
     rộng / lặp thêm / dừng), của việc nào.
   - **Đang dở** (`groups.inProgress`): mỗi vòng một dòng — *người dùng sẽ được
     gì* (một câu từ tên việc, KHÔNG mở file sản phẩm ra đọc) + bước kế viết
     BẰNG CHỮ, mã máy trong ngoặc — tra bảng: chốt thiết kế và tiêu chí (`S1`)
     · lập kế hoạch (`S2`) · viết code (`S3`) · sửa theo bằng chứng (`S3-fix`)
     · nghiệm thu máy (`S4`). Lần đầu một mã hiện trên thẻ phải kèm nghĩa.
   <!-- <<<START-CAN-NHAC -->
   - **Đang cân nhắc** (`groups.considering` — ý đã có ô nhưng chưa điền ngưỡng,
     nên chưa có gì để ký; máy không xếp vào chờ chữ ký): N = 0 → KHÔNG in dòng
     nào. N ≥ 1 → đúng MỘT dòng «Đang cân nhắc: N ý · cũ nhất X ngày» (X =
     `ageDays` lớn nhất) rồi tối đa 3 `name` cũ nhất (script đã xếp cũ nhất lên
     đầu). Chọn một ý → việc kế là điền section Ngưỡng trong `opportunity.md`
     của nó; điền đủ là máy tự đưa sang chờ Cổng Đáng ở lần quét sau.
   <!-- START-CAN-NHAC>>> -->
   - **Bắt đầu việc mới** — đúng ba lối, không thêm lối nào. Kết buổi khai thác
     của lối (a) theo khối ngay dưới, rồi mới tới ba lối:
   <!-- <<<START-HIEU-KET -->
   **Kết thúc buổi khai thác — MỌI lối, mở bằng skill nào cũng vậy:** ghi
   `_acceptance/<slug>/opportunity.md` từ khối `OPP-FRONTMATTER-TEMPLATE` của
   `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/opportunity-template.md`:
   ① `stage: discovery` · ② `decision: ` để trống (người ký Cổng Đáng điền) ·
   ③ file BẮT ĐẦU ở dòng `---` — không tiêu đề, không hàng rào yaml trước nó ·
   ④ section «Vấn đề & ai gặp» ≥ 1 câu · ⑤ section «Ngưỡng chết / ngưỡng UAT»
   giữ nguyên `…` của khuôn tới khi người điền — chưa điền là «đang cân nhắc»,
   điền đủ là chờ Cổng Đáng · ⑥ KHÔNG viết spec, KHÔNG viết contract ở bước này
   (đó là S1, sau Cổng Đáng). Ý không ghi vào ô là ý sẽ mất — ba bộ đọc định kỳ
   (/acceptance-gate:start · bản đồ · lưới) chỉ thấy `_acceptance/`.
   <!-- START-HIEU-KET>>> -->
     (a) ý còn mơ hồ →
     buổi khai thác vòng HIỂU; đích lấy từ `discovery.brainstormSkill` trong
     JSON quét (ổ cắm repo tự khai ở `_acceptance/config.yaml`, khoá
     `discovery.brainstorm_skill`): CÓ giá trị → mở buổi khai thác bằng đúng
     skill đó, kết thúc theo `START-HIEU-KET`; `null` → khai thác theo khuôn
     `${CLAUDE_PLUGIN_ROOT}/skills/acceptance/references/opportunity-template.md`
     rồi kết thúc theo `START-HIEU-KET` (repo chưa khai là bình thường —
     KHÔNG chặn, không cờ). Nhánh thứ ba,
     BẮT BUỘC có: giá trị CÓ nhưng skill đó KHÔNG nằm trong danh sách skill
     khả dụng của phiên → NÓI THẲNG một dòng ("repo khai buổi khai thác bằng
     `<tên>`, phiên này không có skill đó") rồi khai thác theo khuôn, kết thúc theo `START-HIEU-KET` — đích khai
     mà không giải được thì im lặng dùng nó là đẩy phiên vào con trỏ chết. Trước Cổng Đáng
     KHÔNG dùng `superpowers:brainstorming` — skill đó thuộc S1 vòng LÀM, nó
     trả lời "làm thế nào" trong khi buổi này hỏi "có làm không / làm gì"; (b)
     việc đã rõ → `/feature-loop:feature-loop <mô tả>`; (c) việc vặt khớp miễn trừ T1 →
     xác nhận nó là T1 rồi KẾT THÚC `/acceptance-gate:start` — người ra lệnh sửa ở lượt kế,
     ngoài nghi thức này (lệnh `/acceptance-gate:start` không sửa gì, kể cả việc vặt).
   - Dưới thẻ: một dòng bản đồ sản phẩm — đọc `map.state` + `map.label` (nhãn
     rút từ bảng nhãn chung trong lib, CÙNG chữ với cổng CI — không tự chế
     chuỗi): `da-xoa` → in nguyên `map.label` kèm "khôi phục, hoặc vẽ lại bằng
     một lệnh"; `chua-bat` → in nguyên `map.label` kèm "bật bằng hai dòng trong
     `_acceptance/config.yaml`"; `map.state` là `null` (config không đọc được)
     → "chưa đọc được cấu hình nên chưa biết bản đồ đã bật chưa" (ĐỪNG khuyên
     bật một thứ có thể đã bật rồi). ĐỪNG hứa bản đồ sẽ tự tới khi repo chưa bật:
     mọi thân cổng người được dặn BỎ QUA việc vẽ ở đúng repo đó, nên người sẽ
     đợi một thứ không bao giờ tới. `map.fresh` là `false` →
     "bản đồ đang lệch với hồ sơ — làm mới bằng một lệnh"; `null` → "chưa kiểm
     được bản đồ" (KHÔNG nói là khớp). Rồi mỗi phần tử
     `broken[]` một dòng cờ hỏng: việc nào, hồ sơ nào
     (`file`), vì sao (`reason`) — việc có hồ sơ hỏng vẫn phải hiện, không giấu.
   - `groups.done` chỉ đếm gộp một dòng cuối thẻ (đã xong/đã xếp lại: N việc).
     Hai trạng thái «máy đã đi tiếp, không cần chữ ký» — máy quét chỉ gán
     chúng khi hồ sơ trả lời được ĐÚNG câu lưới trước-merge hỏi (sáu điều kiện
     xanh-sạch + Cổng 1 hợp lệ + không bị veto): `state: lan-v-mo` là hồ sơ có
     **cửa veto đang mở** — máy đã đóng một cổng (Cổng 1 hoặc Cổng 2) với vết
     `veto_state: mo`, kể cả khi người có duyệt Cổng 1 (người veto lúc nào cũng
     được, cửa không có hạn); `state: xanh-sach` là hồ sơ không có cửa veto —
     người đóng hoặc miễn Cổng 1, bằng chứng xanh-sạch. Cả hai KHÔNG phải cổng, KHÔNG được liệt vào nhóm chờ chữ ký; có
     phần tử như vậy thì dòng đếm gộp nói thêm «trong đó N máy đi tiếp không
     ký, M còn cửa veto mở», không thêm dòng riêng và không hỏi thêm câu nào.
     Hồ sơ CHƯA sạch thì máy quét vẫn xếp vào chờ chữ ký — kể cả khi cửa veto
     đang mở.

4. **MỘT câu hỏi chọn bằng chữ cái/số dòng** — không hỏi câu thứ hai. Người
   chọn xong → bàn giao sang nghi thức đích:
   - Chọn một cổng → `/acceptance-gate:acceptance-card <slug>`; riêng cổng `gia-tri` → skill
     `/acceptance-gate:uat-session <slug>` (phiên nghiệm thu có nghi thức riêng, không phải thẻ).
   - Chọn một vòng dở → `/feature-loop:feature-loop <slug>` — NHƯNG nếu `git.dirty` là
     `true` hoặc phiên đang đứng cây chung với vòng khác: nhắc mở worktree/
     phiên riêng TRƯỚC, chưa đưa lệnh resume (cạm bẫy một-worktree-một-phiên).
   - Chọn việc mới → đi đúng lối (a)/(b)/(c) ở bước 3.

5. Lệnh KHÔNG tự làm nội dung. Bàn giao xong là hết vai.
