# Luật trình bày bằng hình — Acceptance Gate Kit

> **Chốt bởi Manh, 16/08/2026**, chép luật cùng tên của OneHub
> (`artifact-platform/docs/reference/DIAGRAM-RULE.md`, 15/08) sang repo này.
> Luật bền của repo, không phải thoả thuận một phiên. Bộ khuôn vẽ: skill
> `diagram-design` (kho skill cá nhân — xem §5 nếu máy chưa có).
>
> **Hai lớp, đừng lẫn:** (a) phần *engine* của kit đã có luật hình cho mọi repo
> tiêu thụ — N5 + bảng tra `DECISION-DIAGRAM-SURFACES` + phép thử nhìn-thấy-hình
> trong [`skills/acceptance/references/human-facing-language.md`](../../skills/acceptance/references/human-facing-language.md)
> (hồ sơ `hinh-theo-mat-phang`, ký 02/08). File này KHÔNG phải nguồn thứ hai
> của luật đó. (b) File này là **nếp làm việc của chính repo kit** khi phiên máy
> trình cho owner — cùng vai với `CONTEXT.md` (authoring-time), không ship sang
> consumer.

---

## 1. Nguyên tắc gốc

**Manh tư duy bằng đồ hoạ.** Nguyên văn (OneHub, 15/08): *«tôi tư duy dựa vào
đồ hoạ như là nguyên tắc trình bày ngôn ngữ mặt người và sơ đồ chính là ngôn
ngữ này»*.

Trình một nội dung có cấu trúc bằng chữ dày = đẩy công **dựng-hình-trong-đầu**
sang người quyết. Đó đúng là thứ máy phải gánh (nguyên tắc «máy gánh nhận thức,
người giữ quyết định», 11/08).

**Nhưng hình KHÔNG thay được chữ** — Manh sửa lần ghi sai đầu tiên: *«chữ và
hình đều có vai trò của nó nên không phải chữ bỏ hình hoặc hình bỏ chữ mà là có
sự kết hợp»*. Hai vai khác nhau về bản chất:

| Hình làm được | Chữ làm được |
|---|---|
| quan hệ đồng thời · tô-pô · thứ tự · tỉ lệ · **chỗ TRỐNG** | nhân quả «vì sao» · điều kiện · ngoại lệ · ranh giới · số chính xác |
| đọc trong 5 giây | **grep được · diff được · review từng dòng trong PR** |

⇒ Hệ quả kiến trúc: **hình KHÔNG BAO GIỜ là nguồn sự thật.** Không ai review
được một mũi tên, không ai diff được một toạ độ. **Hình là CHIẾU của nguồn
chữ.**

Tiền lệ vốn có trong repo — kit đã sống theo khuôn này từ trước khi có luật:

- [`PRODUCT-MAP.md`](../../PRODUCT-MAP.md): hình máy vẽ lại từ `_acceptance/`,
  *«đừng sửa tay»*, CI canh `bản đồ == hồ sơ` (ADR 0007), vẽ lại **cùng lượt**
  với thay đổi (bài học bản-đồ-sau-chữ-ký ×2, đợt 2).
- Thẻ cổng `card.html` do `scripts/gate-card.js` render từ contract / evidence
  — thẻ là lớp trình bày, *«contract/evals vẫn là nguồn-sự-thật»*.
- Luật N5 trong bản luật ngôn ngữ mặt người: điểm quyết định ≥3 bước hoặc ≥2
  nhánh thì kèm hình; **chọn cách vẽ theo mặt phẳng đang trình**, không ghim
  định dạng; kiểm bằng phép thử nhìn-thấy-hình (một khối mermaid dán vào chỗ
  không vẽ được là ca trượt kinh điển, owner bắt tại chỗ 02/08).

---

## 2. Ba tầng theo TUỔI THỌ

| Tầng | Ở đâu | Sống bao lâu | Dùng khi | Chính thức? |
|---|---|---|---|---|
| **1 · Phác** | trong chat | một lượt | đang nghĩ, đang bàn; cần lại thì vẽ lại từ nguồn | không |
| **2 · Hồ sơ** | `_acceptance/<slug>/figures/*.html` hoặc cạnh spec (`docs/superpowers/specs/`, `docs/plans/assets/`) | cùng commit | hình đi kèm hồ sơ — **qua PR, qua cổng, diff được** | **CÓ** |
| **3 · Bản in** | Artifact (claude.ai) | tới khi in lại | người quyết cần xem ngoài máy / họp / điện thoại | không |

**Luật một chiều:** tầng 3 sinh TỪ tầng 2 và mang link + commit ngược về repo.
Muốn đổi ⇒ **sửa ở nguồn rồi in lại**. KHÔNG sửa thẳng bản in — sửa thẳng là đẻ
nguồn sự thật thứ hai, đúng lớp lỗi repo này chống suốt (bất biến «MỘT cây
nguồn, KHÔNG có bản sao nào phải giữ đồng bộ» trong `CLAUDE.md`; ADR 0001/0008
về mirror và bản song sinh).

Hình tầng 2 trong workspace hồ sơ là **vật docs của hồ sơ**: không phải eval,
không phải bằng chứng máy; thẻ cổng không đọc nó. Muốn hình *tham gia* quyết
định thì trỏ từ contract/design bằng một dòng, đúng nếp «một dòng trỏ».

---

## 3. Cách kết hợp trong một lượt trả lời

- Nội dung **có cấu trúc** ⇒ hình + chữ đi cùng, không chọn một.
- **Chữ phải đủ đứng một mình.** Hồ sơ/spec/ADR KHÔNG được rút gọn vì «đã có
  hình» — ai chỉ đọc markdown trên GitHub vẫn phải hiểu trọn.
- Kèm mỗi hình **3–5 dòng «cách đọc»** chỉ vào vật trong hình (ô nào, mũi tên
  nào) — không kể lại toàn bộ nội dung bằng chữ.
- Chân hình ghi **colophon**: file nguồn + commit, để truy được.
- Ngôn ngữ trên hình theo N1/N2 của bản luật: nhãn là chữ cho người, tên file /
  hàm xuống chú thích.

### Miễn vẽ

Tin báo trạng thái một dòng · trả lời sự-kiện thuần («CI xanh chưa?») · xác
nhận đã xong một việc nhỏ · **tin mời cổng** (điều khoản mời-cổng: một câu hỏi
đóng, một chữ trả lời — hình đi kèm thẻ, không đi kèm câu hỏi). Vẽ hết mọi thứ
là **loãng tín hiệu** — phản tác dụng.

### Ràng buộc kỹ thuật

Dùng **bộ khuôn** của skill `diagram-design` (nạp `references/type-*.md` trước
khi vẽ), không tự chế HTML. Ngân sách: **≤9 node · ≤2 điểm nhấn** · luật nối bắt
buộc (elbow bo góc, nhãn cách nét 6–10px, không đè nét). Nhiều mặt của một vấn
đề ⇒ **nhiều hình nhỏ đúng loại**, đừng nhồi một hình đa-ngữ-pháp. Mặt phẳng
nào vẽ bằng gì: tra `DECISION-DIAGRAM-SURFACES` trong bản luật.

---

## 4. ⛔ Bổ sung, KHÔNG thay thế

Manh chốt (OneHub): *«tôi không muốn bỏ các tài liệu như workflow hiện nay nên
tuyệt đối giữ đúng và bổ sung thay vì thay thế»*. Áp cho kit:

Luật này **không đổi một dòng** của: `CLAUDE.md` (ngoài một dòng trỏ) ·
`CONTEXT.md` · `GUIDE.md` · bản luật ngôn ngữ mặt người (N5 + bảng tra là nguồn
duy nhất của phần engine) · khuôn hồ sơ xưởng (`contract.md` · `evals.yaml` ·
`evidence-report.md` · `decisions.jsonl` · `gap-probe.md`) · `PRODUCT-MAP.md`
máy sinh · nghi thức cổng của kit · mọi phép đo và lưới.

Nó chỉ THÊM: một thư mục `figures/` trong workspace hồ sơ khi cần + một dòng trỏ
trong hồ sơ + một dòng trỏ trong `CLAUDE.md`. Đây là **CỘNG một file docs T1**,
không phải một chốt mới — không có phép đo nào canh nó, cố ý: hình là chiếu,
không đỏ được, không phải chỗ đặt răng.

---

## 5. Máy mới / đồng đội mới — bộ khuôn vẽ cài như một plugin

Từ kit 2.1.0, skill `diagram-design` được **đóng gói thành plugin thứ ba** của
marketplace `acceptance-gate-kit` — không còn clone kho riêng, không symlink:

Cài theo **GUIDE §5.1** (một chỗ duy nhất giữ lệnh cài/cập nhật của kit) —
`diagram-design` nằm trong bộ bắt buộc, không cài riêng.

Mở phiên mới để skill nạp. Ai đang giữ symlink `~/.claude/skills/diagram-design`
từ đời trước thì **gỡ symlink** khi cài plugin — hai bản cùng mô tả sẽ trigger
đôi.

**Nguồn và bản pin.** Kho skill cá nhân (`phanlemanh/skill`, riêng tư) là
NGUỒN — nó theo dõi upstream `cathrynlavery/diagram-design` (MIT) và giữ các
bản vá cục bộ. Thư mục `diagram-design/` trong kit là **bản pin** — `NOTICE`
ghi commit kho skill + tree-hash; CI tính lại hash và so, nên bản trong kit
không sửa tay được: sửa ở kho skill → `diagram-design/vendor-sync.sh
<checkout>` → bump version plugin. Đây là vendor có tên + version gốc, đúng
bất biến «kit là engine» — không phải bản sao phải giữ đồng bộ theo merge.

**Skin sống trong REPO, không trong skill.** Skill dùng chung cho mọi repo và
mọi máy, nên trạng thái brand không được nằm trong gói. Lần vẽ đầu ở một repo,
skill đọc `docs/reference/diagram-skin.md` (khuôn đóng `DIAGRAM-SKIN-TEMPLATE`:
marker + 8 role + 2 font stack); chưa có thì hỏi một lần rồi ghi file ấy vào
repo — quyết định đi theo repo tới máy đồng đội, không phải làm lại. Repo này
đã có file đó (skin mặc định, đã chốt).

**Luật của kho skill (global CLAUDE.md):** sửa hay thêm skill xong → **commit
ngay**. *Chưa commit là chưa tồn tại* — 15/08/2026 đã mất 28 file vì untracked,
git không cứu được. Cần bản sao để so sánh thì dùng `cp -RL` / `rsync -aL`.

## 6. Vì sao luật này nằm trong repo chứ không nằm trong trí nhớ

Bản đầu của luật (bên OneHub) được cất ở trí nhớ dự án
(`~/.claude/projects/…/memory/`). Manh chỉ ra chỗ hỏng: **trí nhớ không đi theo
khi đổi tài khoản**, và kể cả khi nó sống sót trên cùng máy thì nó **không bao
giờ** tới được máy khác, người khác, hay một bản clone mới.

Tức là luật *«chữ là nguồn, nguồn phải sống trong repo»* lại đang được cất ở nơi
không phải repo — nó tự vi phạm chính nó. File này sửa điều đó cho kit. Trí nhớ
dự án từ nay chỉ còn là **con trỏ** về đây, không phải nguồn.
