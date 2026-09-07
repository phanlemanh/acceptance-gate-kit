# Hạt giống — Bất biến sản phẩm (`PRODUCT-INVARIANTS.md` ở gốc repo tiêu thụ)

**Ngày gật:** 2026-09-02 (owner, một chạm, sau bốn tin trao đổi) · **Ngày ghi
file:** 2026-09-07 — ghi sau khi vòng `loi-moi-cong-may-sinh` gộp về `main`
(#136, 02/09), đúng điều kiện owner đặt. **Trạng thái:** sống ở `_acceptance/bat-bien-san-pham/opportunity.md`.
**Hạng dự kiến:** T2 (một khuôn + một ổ cắm + một dòng đọc ở S1 + một cờ; không
chạm hồ sơ đã ký; máy KHÔNG sửa file bất biến).

**Xác nhận ngoài (07/09):** «The AI-Native SDLC playbook» (Anthropic, 21/08),
play *Requirements and design* — luật thương hiệu / bảo mật / tuân thủ / UX được
nạp **lúc viết** đặc tả dưới dạng skill; chỗ hai luật mâu thuẫn được **cắm cờ
và đưa tới chủ luật** trước khi kỹ sư thấy; phiên bản luật đang có hiệu lực ghi
cùng đặc tả. Hạt giống này là bản của kit cho đúng play đó — xem
[docs/findings/2026-09-07-toan-trinh-playbook-vs-kit.md](../findings/2026-09-07-toan-trinh-playbook-vs-kit.md) §4 R3.

## Xuất xứ

Sau đặc tả UX (ô `dac-ta-ux-vat-hoa-cau-truc`, 24/08), hai ô của khuôn — *Kiểm
kê màn «vào từ / ra tới»* và *Khuôn IA đã chọn* — trỏ ra một **tổng thể không
tồn tại dưới dạng vật**. Cách truyền thống gộp hai việc: *nhịp quyết định* (quyết
hết từ đầu — kit từ chối đúng) và *bất biến xuyên tính năng* (kit bỏ luôn theo —
đó là lỗ). Câu chốt của owner: **kit có bản đồ của VIỆC (`PRODUCT-MAP.md`),
chưa có bản đồ của SẢN PHẨM.**

Cấu trúc sản phẩm là **khó-đảo** → theo hiến pháp kit phải là mục cho người;
nhưng hôm nay máy đang quyết ngầm từng mẩu ở S1, không cổng nào thấy.

## Điều muốn có

Một file **người viết**, `PRODUCT-INVARIANTS.md` ở gốc repo tiêu thụ — bộ ba
cùng họ: `CONTEXT.md` = từ · `PRODUCT-MAP.md` = việc · `PRODUCT-INVARIANTS.md`
= **điều phải đúng**. Không gọi là spec / kiến trúc / PRD. Một file cho cả IA
lẫn kỹ thuật, trần **một trang**, ruột bốn phần:

1. **Sản phẩm là gì** — dời khối *Product Context* từ `CLAUDE.md` sang;
   `morphological-scan` đọc đường mới + giữ nhánh đọc cũ.
2. **Xương BỀ MẶT** (không phải «màn» — đếm 02/09 trên 7 repo tiêu thụ: phần
   lớn hồ sơ là `api` / `cli` / `sdk` / `plugins`; media-library 20 hồ sơ chỉ 2
   chạm `ui`): theo `surfaces:` của hợp đồng — `ui` → màn/hub + khuôn IA (7
   khuôn có tên) · `api` → tài nguyên/endpoint công khai · `mcp` → danh sách
   tool · `cli` → cây lệnh · `sdk` → API công khai. **Mỗi mục có id chuẩn**
   (kiểu `ST-` của bảng trạng thái) — đối chiếu bằng ID, không bằng tên chữ.
3. **Xương kỹ thuật** — hợp đồng công khai, sở hữu dữ liệu, tenant/quyền,
   hướng phụ thuộc.
4. **Chiều đỏ từng dòng** — test/lint nào giữ; chưa có thì ghi «giữ bằng mắt».

IA ≠ kỹ thuật về bản chất: IA sống trong đầu người dùng (không đào được, không
chiều đỏ rẻ); kỹ thuật sống trong code (máy đào được, chiều đỏ = test/CI/eval
xuyên tầng). Với kỹ thuật kit đã có ổ cắm (`reviewSkillPath` ở S4, critic kiểm
«quy định repo chưa nạp», sổ quyết định `approach`, claim-scan). **Lỗ chung
cho cả hai:** (a) bất biến giữ bằng lời chứ không bằng vật; (b) tính năng chạm
thứ khó-đảo (schema, hợp đồng công khai, tenant, phá khuôn IA) **chưa tự nổi
lên thẻ như mục người**.

## Kit giữ gì, repo tiêu thụ giữ gì

- **Kit giữ:** ổ cắm theo mẫu `ds_skill` (khoá config trỏ file + luật vắng-thì-
  gì: vắng → S1 vẫn đi, thẻ Cổng Phạm vi cờ vàng «chưa khai bất biến») · khuôn
  file trong `skills/acceptance/references/` · **một dòng đọc ở S1** · luật «bề
  mặt gọi tên phải có trong xương hoặc khai là bề mặt mới» · cờ khó-đảo máy sinh
  từ diff (migration / contracts / policy — ổ cắm `risk_tiers.t3_paths` đã có
  một nửa; thứ thiếu là thẻ **gọi tên** bất biến bị chạm, không phải bộ phân loại
  mới).
- **Repo tiêu thụ giữ:** nội dung. Lời khai «phá bất biến X» sống trong hồ sơ
  tính năng.
- **ĐÍNH CHÍNH (review 02/09):** file bất biến là **vật người viết** → máy
  **không** sửa nó lúc ký (khác `PRODUCT-MAP.md`: bản đồ máy sinh toàn phần nên
  mới được miễn trừ T1 + `--check`, ADR 0007; áp cùng nếp cho file người viết
  là tái tạo đúng vòng-không-thoát mà ADR 0007 giải). Máy chỉ **đề nghị** trong
  hồ sơ tính năng; owner sửa file bằng commit riêng; diff PR chạm file này →
  thẻ nêu thành mục người (khó-đảo).
- **Lớp mô tả** (bề mặt đang có) **không** file mới — gom vào `PRODUCT-MAP.md`.
- **Nhược điểm vị trí gốc repo:** `CLAUDE.md` tự nạp mọi phiên/agent con, file
  gốc thì không → nghi thức kit (S1 · S2 · S3 dispatch · critic · S4 review) phải
  **truyền file làm input tường minh**; `CLAUDE.md` giữ 2 dòng con trỏ. Không
  dựa vào «đọc khi cần».

Consumer đã tự làm ngoài kit — bằng chứng nhu cầu có thật: media-library
`## Product Context` trong `CLAUDE.md`; artifact-platform
`docs/spec/OneHub-Technical-Architecture.md` + luật «đổi contract ⇒ sửa spec
trước» + skill hub-invariants; radar `docs/00-nen-tang`, `01-dinh-hinh`;
crm/oneflow có thư mục ADR. Kit chỉ có `morphological-scan` đọc Product
Context; `feature-loop` S1 không đọc gì ở tầng sản phẩm.

## Vì sao chưa làm

Luật đóng băng meta-work + bài kiểm North Star trước khi mở ô. Đây là **CỘNG**
một vật vào repo tiêu thụ — chỉ hợp lệ dưới luật nới 07/09, và chỉ khi có
**ngưỡng đếm** cho thấy máy đang quyết ngầm thứ khó-đảo.

## Điều kiện mở lại

- **Ngưỡng đang đếm (từ 02/09):** số tính năng ở repo tiêu thụ mà máy **tự
  thêm bề mặt mới** (màn/endpoint/tool/lệnh) hoặc **đổi hợp đồng công khai** mà
  thẻ Cổng Phạm vi không nêu thành mục người. Mở khi ≥2 lần trên MỌI bề mặt
  (không riêng UI) giữa hai mốc phát hành.
- Vào ô phải mang theo: (i) hai điều kiện «không tự chế bộ đọc» + «ma trận
  hình dạng viết trước» của hạt giống
  [khớp-vòng-đặc-tả-UX](2026-08-24-hat-giong-khop-vong-dac-ta-ux.md) — cùng lớp
  «đối chiếu tờ khai với vật»; (ii) hai điều playbook thêm: cờ lo ngại phải có
  **chủ luật** nêu tên; hồ sơ ghi **phiên bản** bất biến/skill đã nạp lúc viết.

## Ngưỡng (chép sang ô cơ hội khi mở)

- **SỐNG:** trên 3 tính năng thật ở ≥2 repo tiêu thụ, mọi bề mặt hợp đồng gọi
  tên đều tra được ID trong xương hoặc được khai là mới; diff chạm bất biến → thẻ
  nêu thành mục người **đúng tên bất biến**; 0 lần máy sửa file bất biến; 0 lượt
  gọi người thêm so với vòng không có file.
- **CHẾT:** máy sửa file bất biến lúc ký, hoặc cờ «chưa khai bất biến» bị tắt
  bằng cách xoá một dòng (ô nuốt luật), hoặc thêm một lượt gọi người/vòng.
