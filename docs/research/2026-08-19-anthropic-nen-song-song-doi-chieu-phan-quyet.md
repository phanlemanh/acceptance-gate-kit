# Nền song song của Anthropic 08/2026 — đối chiếu lại các phán quyết 13/08

*2026-08-19 · Soạn: phiên OneFlow theo yêu cầu owner («research Anthropic và
những tính năng Claude hỗ trợ ý định chạy song song nhiều feature-loop»).
Nguồn đối chiếu: [đối chiếu GE ↔ kit dưới ý định N-vòng, 13/08](2026-08-13-doi-chieu-graph-engineering-mo-nhieu-vong-song-song.md)
· docs chính thức `code.claude.com/docs` (fetch trực tiếp 19/08, ưu tiên hơn
blog — hai claim bên thứ ba đã bị hạ cấp vì lệch docs) · số vận hành N=2 cùng
ngày: [findings 19/08](../findings/2026-08-19-so-do-van-hanh-n2-oneflow.md).
Đây là tài liệu PHÂN TÍCH, không phải đề bài — khuyến nghị §4 phải qua phép
thử North Star trước khi thành việc.*

## 1 · Đề bài

Bài 13/08 chốt: đường tăng tốc N-vòng không nằm trong tài liệu GE — nằm ở thi
công đợt 2, nhặt chính sách re-pin, rồi đo M1/M2 trên 2–3 vòng thật. Từ đó tới
nay ngoại cảnh đổi: Anthropic đóng gói dần chính các mảnh N-vòng thành tính
năng sản phẩm (2026 được chính họ gọi là năm «đội agent được điều phối»).
Câu hỏi của bài này hẹp: **tính năng mới nào làm phán quyết 13/08 phải xét
lại, tính năng nào củng cố nó, và cái gì thành LƯỚI rẻ dùng được ngay.**

## 2 · Bảng đối chiếu — tính năng × trạng thái thật × phán quyết kit

| Tính năng (nguồn chính thức) | Trạng thái | Đối chiếu phán quyết 13/08 |
|---|---|---|
| **Agent Teams** — lead + teammates, task list chung file-lock + dependencies, mailbox, plan-approval cho teammate | ⚠️ **Experimental, tắt mặc định** (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`; blog nói "GA" là SAI) | §6.4 «KHÔNG làm tầng orchestrator/swarm riêng» **đứng vững, thêm lý do mới**: Anthropic tự xây tầng đó — kit chờ chín thay vì chế. Giới hạn ghi trong docs va thẳng nếp kit: `/resume` KHÔNG khôi phục teammates (vòng của ta sống nhiều ngày, qua đêm chờ cổng), một team/session, lead cố định |
| **Hooks đội**: `TaskCompleted`/`TaskCreated`/`TeammateIdle` — exit 2 chặn + trả feedback | Đi cùng agent teams | Cùng họ «bằng chứng không tự dối»: máy chặn máy tại ranh. **Pattern đáng học, cơ chế chưa cần nhập** — kit đã có hook chặn-lúc-ghi riêng (đợt 2) |
| **`PreToolUse` hook** — duyệt/chặn/viết lại tool call trước permission | GA, sẵn trong mọi phiên | **LƯỚI rẻ mới cho nút CPU** (nút vừa có số ở consumer — findings 19/08): cưỡng chế «một token S4» bằng máy — lệnh chạy eval bị chặn khi chưa cầm lock, thay vì thoả thuận mồm giữa các phiên |
| **Cross-session messaging** (`ListAgents`/`SendMessage`) | Chính thức, có docs riêng | Chính là xương sống «đề bài tự-đủ + phân vùng khai trước» §3.5 — 19/08 đã chạy thật ở consumer, 0 va chạm file |
| **Worktrees** (`--worktree`, desktop auto) | Chính thức | Đã là tiền lệ; không mới |
| **Cloud sessions / web + `--teleport`** — mỗi task một session cloud, theo dõi `/tasks` | Chính thức | **Đường gỡ nút CPU** — nút này 13/08 chưa có tên trong bảng §4 vì chưa có số; nay có (3 vòng đỏ oan/ngày ở N=2). Consumer thử trước, kit không cần cơ chế |
| **Auto mode mặc định** (14/08) — classifier duyệt nhanh, và **chặn agent duyệt-hộ agent** | Chính thức | Củng cố nguyên tố 3: hạ tầng ngoài cũng giữ luật «chỉ người mới là người»; teammate không thể thay chữ ký |
| **Model per-teammate / `CLAUDE_CODE_SUBAGENT_MODEL`** | GA | Phục vụ đúng nguyên tắc 7: nhân **chân chấm độc lập rẻ**, không nhân tháp eval |
| **Managed Agents** (nền API, checkpoint, ~$0.08/giờ) | GA phía API, **không tích hợp CLI** | Không chạm feature-loop hiện tại; để mắt, không làm gì |

## 3 · Điều ngoại cảnh vẫn KHÔNG vá hộ

Khớp nguyên §5 của bài 13/08, ba đặc sản của kit vẫn vô chủ ngoài kia:
staleness/re-pin theo release (B2 — đoạn chính sách đã duyệt, tới 13/08 chưa
ai viết) · số-lần-ngồi của owner mỗi tuần (trần thật của N) · hội tụ vòng
verify. Không tính năng Anthropic nào đụng tới ba thứ này — chúng là việc của
kit, và đều đã có chỗ trong hàng đợi cũ, không cần món mới.

## 4 · Khuyến nghị (mỗi món kèm trace nguyên tố + người hưởng)

1. **Không xét lại phán quyết KHÔNG-làm nào của §6.4.** Agent Teams càng ra
   càng chứng minh chờ-upstream là đúng; điều kiện nhập lại: hết experimental
   VÀ có session resume. *(Nguyên tố 1 — ý định đã chốt 13/08 giữ nguyên;
   người hưởng: owner khỏi trả giờ-kit.)*
2. **Một LƯỚI rẻ đáng cân khi đợt 3 chạy: khuôn hook mutex-tài-nguyên** —
   `PreToolUse` chặn lệnh S4 khi lockfile vắng/hết hạn. Chỉ đáng nếu số
   findings 19/08 tái diễn ở lần đo M1; một script + một đoạn GUIDE, có chiều
   đỏ thử được. *(Nguyên tố 2; người hưởng: MÁY — hai phiên khỏi tin nhầm
   rằng mình độc quyền máy.)*
3. **Đợt 3 đo M1/M2 đủ điều kiện chạy** — đợt 2 signed-off 14/08; ngưỡng đã
   khai 13/08 giữ nguyên từng chữ: đo trên **2 vòng thật**, M1 ≤ 2 mới tăng N.
   Bãi đo: repo tiêu thụ (OneFlow có hàng đợi + baseline). *(Nguyên tố 3;
   người hưởng: owner — số lần ngồi được đo thay vì đoán.)*
