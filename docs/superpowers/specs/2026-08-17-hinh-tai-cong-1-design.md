# Hình tại Cổng 1 — máy tự đếm ngưỡng N5, người chỉ nhìn

> Trạng thái: **bản S1 chờ Cổng 1** (feature-loop, slug `hinh-tai-cong-1`, T2).
> Viết 17/08/2026. Phạm vi = **hàng 1** của đề xuất ba hàng: chỉ sửa mục
> GATE 1 trong `feature-loop/skills/feature-loop/SKILL.md` + phép đo; KHÔNG đụng
> `scripts/gate-card.js`, KHÔNG đổi schema thẻ.

## 0. Vì sao (bằng chứng, không suy đoán)

Phiên `Acceptance gate start` (repo `media-library`, slug `l3-search-media-card`,
T3, 17/08 03:00–03:40Z) đi hết S1 → Cổng 1 đúng kịch bản: `gate-card.js` →
`card.html` → gửi panel → một câu hỏi. **Không một hình nào.** Owner phải gõ
thêm hai lượt («Phân tích và đề xuất các Diagram cho Cổng 1» · «Vẽ 1+2+3+4»)
thì máy mới tự chấm ra **5 điểm vượt ngưỡng N5** trên chính thẻ vừa trình (8
luật lọc nối tiếp · cây ứng viên 5 quan hệ · ma trận quyền 2×3 · cắt wave 4
bước · luồng search 6 bước) và vẽ 6 hình vào `diagrams.html` — file mà
`card.html` không trỏ tới.

Nguyên nhân là **lỗ của kit, không phải lỗi phiên**: câu luật về hình
(`LOOP-PICTURE-CLAUSE`) trong vòng lặp chỉ được chép ở mục **S2 — PLAN**
(dòng trình plan / Gate 1.5). Mục **GATE 1** không có câu nào về hình, không
có bước đếm ngưỡng; `/acceptance-card` nạp bản luật nhưng đầu ra là khuôn cứng
`will_do / wont_do / coverage_plain` — luật được đọc mà không có chỗ thi hành.

Hai lượt gõ đó là đúng thứ north star gọi là *thêm lượt gọi người*: người phải
nhớ mà đòi, tức người đứng giữa vòng chứ không ở biên.

## 1. Trace về ba nguyên tố

Nguyên tố 3 — **khoảnh khắc quyết thật**. Người hưởng: người ký Cổng 1 (T3,
hoặc T2 không đủ điều kiện đi tiếp) — đọc mỗi quyết định có đánh-đổi bằng một
liếc thay vì dựng lại cây/luồng trong đầu từ ba đoạn văn. Không cộng khuôn hỏi,
không cộng lượt gọi: người vẫn nhận **một** thẻ, một câu hỏi.

## 2. Thiết kế — năm bước chèn vào GATE 1, chạy TRƯỚC `/acceptance-card`

Chỉ chạy khi cổng **thật sự dừng chờ người** (T3 · T2 không đủ điều kiện đi
tiếp). T2 xanh-sạch đi tiếp thì bỏ qua cả năm bước — hình không ai đọc là giờ-kit
vứt đi.

```
S1 xong (3 artifact + ledger + gap-probe đã định đoạt)
   │
   ▼
[1] KÊ điểm quyết định           máy, vòng chính
    = entry sổ quyết định chờ seal
    + chỗ design lệch spec/plan gốc đã có
    + dòng [GIẢ ĐỊNH] trong Coverage
    + finding gap-probe xử lý `human-gate1`
   │
   ▼
[2] ĐẾM N5 từng điểm             máy, vòng chính
    ≥3 bước nối tiếp hoặc ≥2 nhánh → "cần hình" + đề bài ≤5 dòng
    ngược lại → "dưới ngưỡng: <đếm>"
    ghi _acceptance/<slug>/figures/index.md
   │
   ▼
[3] VẼ                            subagent(s) tươi — đọc index.md + design/contract từ đĩa
    figures/<tên>.html (skill diagram-design; xuất .svg/.png cạnh nguồn)
   │
   ▼
[4] NHÌN                          vòng chính — phép thử nhìn-thấy-hình
    Read bản .png; hỏng → trả về [3] đúng MỘT lần
   │
   ▼
[5] ĐÍNH cùng thẻ                 gửi card.html + figures cùng MỘT lượt
    tin mời cổng: hình trước, chữ là chú thích, mỗi hình gắn tên quyết định;
    dòng "dưới ngưỡng: <đếm>" cho điểm không vẽ; 0 điểm vượt → nói đúng một dòng
```

Chi tiết từng bước:

- **[1] Kê.** Nguồn là bốn chỗ máy đã có sẵn cuối S1, không hỏi người. Không
  kê AC/GWT từng dòng — AC là bằng chứng của quyết định, không phải quyết định.
- **[2] Đếm.** Ngưỡng là của bản luật (N5): "từ ba bước nối tiếp hoặc từ hai
  nhánh rẽ trở lên". Phán đoán bước/nhánh là việc ngữ nghĩa nên LLM làm; nhưng
  **kết quả đếm phải xuống đĩa** ở `figures/index.md` (bảng `| Điểm | Đếm |
  Hình |` + đề bài của mỗi hình cần vẽ) — đây là chỗ máy hết đường "quên", và
  là đầu vào cho subagent ở [3]. File này là vật docs của hồ sơ (tầng 2 của
  DIAGRAM-RULE), không phải eval; thẻ không đọc nó.
- **[3] Vẽ.** Giao **subagent tươi** (Agent tool), mỗi hình một agent hoặc một
  agent vẽ cả bộ — tuỳ số hình; agent đọc `figures/index.md` + design doc +
  contract **từ đĩa** (hình là chiếu của nguồn chữ, không phải của trí nhớ vòng
  chính). Cơ chế: skill `diagram-design` (plugin thứ ba của marketplace, kit ≥
  2.1.0), đầu ra HTML + SVG/PNG đặt `figures/`. Vòng chính KHÔNG tự vẽ — giữ
  context vòng chính cho S2→S4. Skill vắng → KHÔNG chặn: vẽ khối mermaid vào
  design doc (mặt phẳng "tài liệu trong kho") + một dòng trong tin mời cổng
  "bộ khuôn vẽ chưa cài — hình ở dạng mermaid trong design doc".
- **[4] Nhìn.** Vòng chính đọc bản PNG của từng hình (Read) — đây là phép thử
  nhìn-thấy-hình đúng nghĩa; hình lỗi (chữ đè, nút thiếu, sai nguồn) → trả về
  [3] với ghi chú, tối đa MỘT vòng; vẫn hỏng → đính kèm kèm cờ "hình <tên> chưa
  đạt", không chặn cổng.
- **[5] Đính.** Gửi `card.html` **và** các hình trong CÙNG một lượt (mặt phẳng
  panel → "trang HTML gửi kèm" theo `DECISION-DIAGRAM-SURFACES`). Tin mời cổng
  vẫn là một câu hỏi đóng (điều khoản mời-cổng không đổi); phần chú thích mỗi
  hình 1–3 dòng gắn tên quyết định. Bỏ hình khi có điểm vượt ngưỡng phải là
  dấu vết hiện: dòng "dưới ngưỡng"/"0 điểm vượt" — không có đường im lặng.
- **Resume vào `draft`** mà workspace đã có `figures/` → dùng lại, không vẽ lại.

## 3. Đổi ở đâu

| Người duyệt thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| Mở thẻ Cổng 1 là thấy hình cạnh mỗi quyết định có đánh-đổi, không cần gõ thêm lượt nào | `feature-loop/skills/feature-loop/SKILL.md` mục GATE 1 — thêm khối "Hình tại điểm quyết định" gồm năm bước + chép nguyên văn `LOOP-PICTURE-CLAUSE` | AC-1..AC-7 |
| Điểm không vẽ vẫn có số đếm hiện trên tin, không biến mất câm | cùng khối trên | AC-4 |
| Kit tự bắt được nếu ai gỡ khối này khỏi mục GATE 1 (kể cả khi S2 vẫn còn câu về hình) | `tests/plugins/run-tests.sh` case P197 — neo vào MỤC GATE 1, đối chứng dương + đột biến ghim thông điệp | AC-8 |
| Ghi nhớ đường 2 (thẻ tự nhúng hình) là việc sau, có điều kiện quay lại | `decisions.jsonl` entry `descope` + `revisit` | — |

Không đụng: `scripts/gate-card.js`, `card-plain.json`, `commands/acceptance-card.md`,
`commands/approve.md`, bản luật `human-facing-language.md`, `DIAGRAM-RULE.md`.

## 4. Không làm (và vì sao)

- **Không nhúng hình vào `card.html`** — đó là hàng 2: đổi bên đọc + đường
  đọc-cũ + cờ vàng. Làm sau khi đo một vòng xem máy có tự đếm không.
- **Không vẽ ở cổng T2 xanh-sạch đi tiếp** — không ai đọc.
- **Không thêm marker/khuôn mới trong bản luật** — `LOOP-PICTURE-CLAUSE` đã đủ,
  chỉ chép thêm một chỗ.
- **Không sửa `commands/approve.md`** — người vẫn duyệt bằng đúng câu cũ.

## 5. Phép đo

Một case suite `tests/plugins` (P197): rút MỤC `## GATE 1` của SKILL.md bằng
regex heading (không tìm chuỗi toàn file), kiểm: (a) chứa `LOOP-PICTURE-CLAUSE`
khớp từng ký tự rút từ bản luật; (b) có đủ năm động từ bước (kê · đếm · vẽ ·
nhìn · đính) và đường `figures/index.md`; (c) có điều kiện chỉ-khi-dừng-người
(nhắc T2 đi tiếp thì bỏ); (d) có nhánh skill vắng không chặn. Đối chứng dương
trên bản nguyên vẹn; đột biến: xoá clause CHỈ khỏi mục GATE 1 (S2 vẫn còn) →
phải ĐỎ ghim "GATE 1: cau ve hinh lech khuon mot-nguon" — chứng minh phép đo neo
vào mục chứ không vào file (P90 hiện có sẽ vẫn XANH ở đột biến này, cố ý).

## 6. Hình

Sơ đồ năm bước ở §2 là hình tầng 1 (phác, ký tự trong khối mã — mặt phẳng tài
liệu trong kho). Không có `figures/` cho hồ sơ này: quyết định phạm vi ("hàng 1
trước, hàng 2 sau") đã do owner chốt trong hội thoại TRƯỚC khi mở vòng — ledger
ghi `descope`, thẻ không còn điểm quyết định mở nào để đếm.
