# Phiên Lái-thử Người-lạ (Stranger Drive) — tài liệu tham chiếu

*Chuẩn hoá 2026-08-13 theo yêu cầu owner («đã chứng minh được giá trị — tài
liệu hoá để trở thành tham chiếu»). Đây là bản định nghĩa CHUẨN của nghi thức;
đề bài thi hành chi tiết và bằng chứng sống ở mục Tham chiếu cuối file.*

---

## 1 · Tên gọi

**Tên chuẩn:** Phiên Lái-thử Người-lạ · gọi tắt **lái-thử** · alias tiếng Anh
**Stranger Drive**. Dùng đúng một tên này trong mọi doc/commit/hồ sơ — không
gọi là "Giả lập UAT" (tên đó ngụ ý máy phán hộ giá trị, đâm vào lõi
chữ-ký-người).

**Định nghĩa một câu:** một phiên Claude Code **fresh hoàn toàn** đóng vai
người dùng không-ngữ-cảnh, tự lái sản phẩm thật theo các mục tiêu viết bằng
tiếng sản phẩm, và giao lại **nhật-ký-vấp + bằng chứng** — máy tường thuật,
không phán giá trị.

**Vị trí trong hệ:** sau khi có bản chạy được (trước hoặc sau S4 đều hợp lệ),
và là **tiền trạm của Cổng Giá trị** (`uat-session`) — biến điều kiện vào
"sản phẩm bấm được" từ giả định thành bằng chứng. Nó KHÔNG phải UAT, không
thay chấm kín của người, không điền verdict.

**Hai biến thể** (cùng nghi thức, khác bề mặt):

| | Biến thể UI | Biến thể Agent |
|---|---|---|
| Sản phẩm | web UI | MCP server / tool (người dùng thật là agent) |
| Người-lạ | phiên fresh, profile trắng | subagent fresh **không được cấp đường dẫn kho** |
| Tri-giác | pixel-only, cấm DOM | chỉ `tools/list` + phản hồi tool, cấm đọc mã |

## 2 · Lợi ích (mỗi dòng kèm căn cứ)

1. **Bắt lỗi giữa-các-tiêu-chí mà eval theo kịch bản không phủ.** Ván 1
   (mcp-cost-guard): mọi eval xanh vì chỉ ghim "thông điệp khác rỗng"; người-lạ
   lộ ra chẩn đoán từ chối không nói trần → người dùng mất một phương án lẽ ra
   có + ba lượt gọi phí.
2. **Không cháy phiên người thật.** Máy đi trước chứng minh mọi flow đi được;
   phút của người dự nghiệm thu — chi phí đắt nhất hệ — chỉ tiêu vào việc của
   người: phán giá trị.
3. **Ngữ-cảnh-trắng có răng.** Người build không "giả vờ quên" được; phiên
   fresh thì quên thật. Biến thể agent còn chặn bằng cấu trúc: không cấp đường
   dẫn kho thì muốn đọc mã cũng không được.
4. **Rẻ và đảo rẻ.** Không engine mới, không cổng mới, không skill mới — một
   đề bài + một thư mục bằng chứng; bỏ là xong.
5. **Ba câu hỏi giá-trị mỗi ván** chuyển thẳng cho phiên người — máy dọn bàn,
   người quyết (ván 1 sinh đúng 3 câu «Chuyển phiên người»).

## 3 · Kiến trúc giải pháp

Sơ đồ kiến trúc: [diagrams/lai-thu-nguoi-la-kien-truc.html](diagrams/lai-thu-nguoi-la-kien-truc.html)

**Bảy thành phần:**

| Thành phần | Vai | Ghi chú |
|---|---|---|
| Phiên điều phối | viết hồ sơ mục tiêu · dựng môi trường · đo lại vấp trên vật · viết findings | phiên thường, có ngữ cảnh |
| Hồ sơ mục tiêu `stranger-drive.md` | mục tiêu bằng tiếng sản phẩm (giấu đường đi) + ngân sách | khuôn ở đề bài §4 |
| **Phiên người-lạ** (lõi) | lái sản phẩm, ghi vấp, KHÔNG phán | fresh; chỉ được cấp URL/cầu nối + hồ sơ mục tiêu |
| Bộ công cụ lái | tay chân của người-lạ | bảng dưới |
| Sản phẩm thật | dev server / staging / MCP server | không sửa gì trong ván |
| Nhật ký vấp + frames | đầu ra chuẩn: CHẶN · LẠC · KHÓ-CHỊU · VẶT + «Chuyển phiên người» | vật bàn giao |
| Cổng Giá trị (người) | nhận bàn giao, chấm kín, ký verdict | `uat-session`, ngoài phạm vi lái-thử |

**Công cụ kết hợp** (research 13/08, verify trên tài liệu gốc — chi tiết + lý
do loại ở đề bài §6):

| Công cụ | Vai trong nghi thức | Cài |
|---|---|---|
| Playwright MCP (Microsoft) | xương sống biến thể UI: frame ra file, profile trắng (`--isolated`), bấm-theo-ảnh (`--caps=vision`) | `claude mcp add playwright -- npx @playwright/mcp@latest --isolated --caps=vision` |
| Chrome DevTools MCP | soi đường dây (network/console có source-map), bóp mạng chậm/offline, đo trace | `claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest --isolated` |
| Cầu nối MCP stdio | biến thể agent: script JSON-RPC mỏng `list` / `call`, người-lạ chỉ thấy giao thức | script scratchpad, ~80 dòng, không vào kho sản phẩm |
| Deny-rules trong settings phiên lái | răng cho luật cấm-DOM ở bậc 2 (chặn `browser_snapshot`/`read_page`) | cấu hình, không phải lời hứa |
| `vlm-assert.mjs` (sẵn trong kit) | bậc 3: VLM khác họ trả lời câu ĐÓNG trên frame — khử thiên vị cùng-họ | đã ship, không cài thêm |
| Loại có chủ đích | Claude-in-Chrome (profile không trắng) · Stagehand/Browser-Use (self-healing che đúng tín hiệu vấp) · dịch vụ AI-QA thuê ngoài (đắt, thay cả vòng) | — |

**Bốn kỷ luật bất biến** (điều làm nó là *lái-thử* chứ không phải chạy-thử):

1. **Ngữ-cảnh trắng** — phiên mới hoàn toàn; cấp đúng hồ sơ mục tiêu + lối vào
   sản phẩm, không cấp code/contract/evals.
2. **Tri-giác tự trói** — chỉ thấy thứ người dùng thấy (pixel / phản hồi tool);
   phá rào phải tự khai trong nhật ký.
3. **Kiên-nhẫn hữu hạn** — ngân sách 12 bước hoặc 5 phút mỗi mục tiêu; cạn →
   ghi «BỎ CUỘC TẠI ĐÂY» rồi mới được đi tiếp.
4. **Không phán giá-trị** — mọi câu "đáng không?" ghi vào «Chuyển phiên
   người»; verdict là chữ của người ký ở Cổng Giá trị.

**Bậc thang 4 bậc** — chạy từ rẻ đến đắt, dừng được ở mọi bậc
(sơ đồ: [diagrams/lai-thu-nguoi-la-bac-thang.html](diagrams/lai-thu-nguoi-la-bac-thang.html)):

| Bậc | Tên | Bắt được | Công cụ |
|---|---|---|---|
| B1 | Quét chạy-được | hỏng · gãy · mất dữ liệu | DOM cho phép · network truth · throttle |
| B2 | **Lượt lái người-lạ** | lạc · ma sát · bỏ cuộc (mép Dùng thử) | pixel-only · ngân sách bỏ-cuộc |
| B3 | Khử tương quan | máy tin nhầm chính nó | VLM khác họ, câu đóng |
| B4 | Bàn giao phiên người | — (đáng-giá: chỉ người quyết) | uat-session |

**Ranh giới năng lực** (định lý giới hạn, đầy đủ ở đề bài §2): máy tiệm cận
**Kiểm thử** gần trọn · chạm **mép Dùng thử** qua đúng hai proxy có kỷ luật ·
**không tiệm cận Đáng-giá** — ranh thiết kế, không phải ranh công nghệ.

## 4 · Vị trí trong Workflow v2 — dùng khi nào, không dùng khi nào

Sơ đồ định vị: [diagrams/lai-thu-nguoi-la-vi-tri.html](diagrams/lai-thu-nguoi-la-vi-tri.html)

**Định vị một câu:** lái-thử **không phải một stage và không phải một cổng** —
nó là nghi thức trinh sát **ngoài vòng lặp** `S0→S1→Gate1→S2→S3→S4→Gate2→S5`,
cắm vào pipeline ở đúng **hai ổ**:

| Ổ cắm | Khi | Vai của kết quả |
|---|---|---|
| **Mặc định — tiền trạm Cổng Giá trị** | vòng có `opportunity.md` + ngưỡng UAT, sau S5 (bản thật sau flag), TRƯỚC khi mời người dự | biến điều kiện vào "sản phẩm bấm được" của `uat-session` thành bằng chứng; nhật-ký-vấp bàn giao để phút của người chỉ tiêu vào phán giá trị |
| **Tuỳ chọn — sau S4 xanh** | vòng mở bề mặt người-dùng mới hoặc đổi UX lớn | tài liệu ĐỌC KÈM cho người ký Gate 2 — KHÔNG chèn vào `evidence-report.md` (schema có hook giữ), không thay eval nào |

Trong **kit** nó nằm ở tầng **docs/nghi thức tay** (tài liệu này + đề bài),
không nằm trong `skills/`/engine — cố tình, theo thước codify của đề bài §5.
Phát hiện của một ván là **input mở việc mới** (chip/vòng mới ở repo sản
phẩm), không bao giờ là bản vá lén vào vòng đã ký.

**DÙNG khi** (một điều kiện là đủ):

1. Vòng có opportunity sắp vào `uat-session` → chạy mặc định, như tiền trạm.
2. Feature mở **bề mặt mới** cho người hoặc agent (UI mới, MCP tool mới,
   onboarding) — first-run trên ngữ-cảnh-trắng là điểm mạnh độc nhất của nó.
3. Đổi UX/flow lớn trên bề mặt sẵn có (redesign, đổi điều hướng).
4. Chuỗi suite xanh nhưng owner muốn một cặp mắt không-ngữ-cảnh rẻ hơn việc
   tự ngồi bấm.

**KHÔNG DÙNG khi:**

1. **T1 / vòng không có bề mặt người-dùng** (docs, config, refactor nội bộ,
   thư viện thuần) — không tồn tại "người lạ" tương ứng để đóng vai.
2. **Thay cho S4/evals** — lái-thử không chứng minh AC, không có răng hợp
   đồng; nó bắt lớp lỗi *giữa* các AC, là phần bù của S4 chứ không phải bản
   thay.
3. **Thay cho `uat-session` / để phán đáng-giá** — cấm by design; máy chỉ
   được ghi «Chuyển phiên người».
4. **Lặp mỗi round S3↔S4** — một ván mỗi vòng tại điểm chốt; chen vào giữa
   3-round vừa đắt vừa nhiễu hội tụ.
5. **Khi suite máy còn đỏ** — lái bản hỏng chỉ chép lại điều suite đã biết;
   luật dừng 3-CHẶN của đề bài tồn tại vì thế.
6. Flow đòi **danh tính/dữ liệu thật của một người cụ thể** — profile trắng
   chỉ đo được đoạn trước đó; ghi giới hạn vào nhật ký thay vì giả vờ đo được.

## 5 · Tham chiếu

- **Đề bài thi hành** (nghi thức từng bước, khuôn nhật-ký-vấp, bản đồ 21 hạng
  mục, thước codify): [plans/2026-08-13-de-bai-lai-thu-nguoi-la.md](plans/2026-08-13-de-bai-lai-thu-nguoi-la.md)
- **Ván 1 — bằng chứng sống** (biến thể agent, mcp-cost-guard):
  [findings/2026-08-13-lai-thu-nguoi-la-van-1-mcp-cost-guard.md](findings/2026-08-13-lai-thu-nguoi-la-van-1-mcp-cost-guard.md)
- **Cổng Giá trị** (nơi nhận bàn giao): `skills/uat-session/SKILL.md`
- Nâng cấp thành skill/engine: chỉ khi thước §5 của đề bài nói — tài liệu này
  là THAM CHIẾU, không phải giấy phép mở vòng meta.
