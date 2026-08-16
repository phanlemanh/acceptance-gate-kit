# Hạt giống — hình sống TRONG hồ sơ, vẽ bằng ổ cắm skill của repo

*Trạng thái: **ỨNG VIÊN CHO LẦN NÂNG CẤP KIT KẾ — owner tuyên 15/08** («tôi
muốn đưa phần này vào kit trong lần nâng cấp kit sắp tới»). Sinh 15/08 khi mở
phiên theo dõi vòng `trang-tu-van-v2-r4` (artifact-platform). Nguồn luật ở
phía repo tiêu thụ: `artifact-platform/docs/reference/DIAGRAM-RULE.md`
(commit `55649288c`, Manh chốt 15/08) — file này chỉ nói phần nào của luật ấy
thuộc KIT và cắm vào đâu; không chép lại luật.*

## Nguồn luật và ranh giới kit / repo

`DIAGRAM-RULE.md` có 6 mục. Phép thử kit-là-engine («thứ phải chép sang repo
thứ hai, hoặc vô nghĩa với công ty khác dùng kit, thì không thuộc kit») chia
chúng làm hai:

| Mục của DIAGRAM-RULE | Vào KIT? | Vì sao |
|---|---|---|
| §1 hình là CHIẾU, chữ là NGUỒN; bảng «hình làm được / chữ làm được» | **Có** — vào `human-facing-language.md`, mục «Hình tại điểm quyết định» | bất biến kiến trúc, đúng với mọi repo; nó là lý do hình không bao giờ thành nguồn sự thật |
| §2 ba tầng theo tuổi thọ + luật một chiều (tầng 3 sinh từ tầng 2, sửa ở nguồn rồi in lại) | **Có** — thay cho bảng tra hiện tại chỉ biết «mặt phẳng» mà chưa biết «tuổi thọ» | tuổi thọ mới là thứ quyết định hình có phải qua PR + cổng hay không |
| §3 kết hợp: chữ đủ đứng một mình · 3–5 dòng «cách đọc» · colophon nguồn + commit · danh sách MIỄN VẼ | **Có** (trừ ràng buộc kỹ thuật ≤9 node… — đó là luật của bộ vẽ, ở lại trong skill) | miễn-vẽ là chốt chống loãng, đúng tinh thần «chỉ TRỪ»; colophon là đường truy về nguồn |
| §4 bổ sung, không thay thế | **Có, dưới dạng ràng buộc của chính hồ sơ này** | không đổi khuôn hồ sơ xưởng, không thêm bước vào 4 cổng — chỉ thêm chỗ đứng cho hình |
| §5 kho skill cá nhân, symlink, lệnh clone | **Không** — kit chỉ có **ổ cắm** `feature_loop.diagram_skill` | đường dẫn máy của một người; công ty khác cắm bộ vẽ khác |
| §6 luật phải sống trong repo, không trong trí nhớ | **Có, làm luật cho chính kit**: bản gốc trong `references/`, trí nhớ chỉ là con trỏ | cùng lớp lỗi kit đã ghi (sổ quyết định trên nhánh chết) |
| Câu trích lời owner («tôi tư duy bằng đồ hoạ») | **Không** | thuộc handbook người/đội, không thuộc engine |

## Thiếu gì

Kit đã có luật hình: N5 «hình trước, chữ là chú thích» tại điểm quyết định,
ngưỡng đếm được (≥3 bước nối tiếp hoặc ≥2 nhánh), bảng tra
`DECISION-DIAGRAM-SURFACES` chọn cách vẽ theo mặt phẳng, và phép thử
nhìn-thấy-hình (`skills/acceptance/references/human-facing-language.md`).
Bốn cơ chế vẽ trong danh sách ĐÓNG: hình nội tuyến phiên · trang HTML gửi kèm ·
ký tự trong khối mã · mermaid.

Vòng r4 (Cổng Đáng ký 15/08) làm một việc kit chưa có tên: **hình sống trong
hồ sơ xưởng** — `_acceptance/<slug>/figures/*.html`, tự chứa, đi qua PR + cổng
như chữ, có `README` khai «chiếu từ đâu». Owner chốt luật trình bày ba tầng
theo tuổi thọ (chat thoáng · `figures/` chính thức · Artifact bản in) và luật
«sửa ở nguồn, vẽ lại — đừng sửa hình». Hai điều kit đang thiếu so với ca thật:

1. Bảng tra không có hàng cho mặt phẳng **«hồ sơ xưởng»** — nên hình cho cổng
   hoặc rơi vào «trang HTML gửi kèm» (thoáng, không đi qua PR) hoặc mermaid
   (không tự chứa, không kèm chú thích chiếu-từ-đâu, không đủ cho hình 5–9
   node có điểm nhấn).
2. Không có **ổ cắm** cho bộ vẽ của repo. Vòng r4 vẽ bằng skill cá nhân
   `diagram-design` (kho `phanlemanh/skill`, không phải plugin của kit). Kit
   là engine — không được nuốt thân skill bên thứ ba, nhưng ĐÃ có tiền lệ ổ
   cắm đúng hình dạng này: `feature_loop.ui_standards_skill` (repo khai tên
   skill, vòng lặp gọi khi có, vắng thì ghi chú một dòng, không chặn).

## Trace về ba nguyên tố (bắt buộc — không trace = cắt)

**Nguyên tố 3 — khoảnh khắc quyết thật:** người quyết trên bằng chứng đọc
được trong một phút. Hình tại cổng phục vụ đúng câu đó; hình sống trong hồ sơ
thì lần mở lại (phiên khác, người khác, review PR) vẫn đọc được trong một
phút, không phải dựng lại từ chữ. **Người hưởng cụ thể:** owner ở Cổng Đáng /
Cổng 1 / Cổng 2 và người review PR hồ sơ. Ca thật: 5 hình r4 chiếu §2/§4/§5/§8
của `opportunity.md` (luồng lật thứ tự phục vụ · ruột engine giá · kiến trúc
engine · số phận kho r3 · ba tầng của hình).

Không trace về nguyên tố 1/2 — đây không phải phép đo, không được đội lốt
«bằng chứng». Hình là **chiếu**, chữ là **nguồn**; hình không được mang sự
thật mà hồ sơ chữ không có (luật §1 của `figures/README.md`).

## Điều đã kiểm trên cây nguồn (để vòng kế khỏi dò lại)

- Ba khối marker liên quan nằm CÙNG một file: `DECISION-DRAW-MECHANISMS`
  (danh sách đóng), `DECISION-DIAGRAM-SURFACES` (bảng tra),
  `LOOP-PICTURE-CLAUSE` (câu duy nhất hai harness chép nguyên văn). Đổi bảng
  tra + danh sách đóng là đổi *thân văn*; câu `LOOP-PICTURE-CLAUSE` **không cần
  đổi** (nó đã trỏ về bảng tra) → hai harness không phải chép lại gì.
- Test P86 ghim `ui_standards_skill` phải nằm cùng đoạn với dòng ghi chú vàng ở
  GATE 1 (`tests/plugins/run-tests.sh:1401–1460`) và P?? ghim danh sách từ
  khoá của feature-loop (`:1492`). Ổ cắm mới nếu đặt cạnh sẽ đi qua CÙNG khuôn
  test — cần thêm anchor, không đổi anchor cũ.
- Bộ đọc hồ sơ (bản đồ sản phẩm, quét khởi động, thẻ cổng) **không đọc**
  thư mục con của workspace ngoài các file khai sẵn → thêm `figures/` KHÔNG
  đổi schema, không cần đường đọc-cũ. Đã kiểm 15/08: `product-map.mjs:190`
  và `start-scan.mjs:116` chỉ liệt kê **thư mục slug** trong `_acceptance/`,
  không đi vào con của từng slug — `figures/` không lộ ra như vật lạ; ca thật
  r4 đã có `figures/` mà bản đồ vẫn khớp.
- Skill `diagram-design` (v2.5, `~/dev/skill/skills/diagram-design`) có cổng
  chọn skin lần đầu (`references/style-guide.md` marker `skin:`), 43 kiểu, xuất
  HTML tự chứa. Trong repo tiêu thụ nó **hỏi người một câu** ở lần vẽ đầu tiên
  của repo (chọn skin) — một lượt gọi người ngoài thiết kế cổng; nếu ổ cắm
  được mở, phải khai TRƯỚC câu này hoặc trả lời nó bằng mặc định (repo có
  design token thì skill tự tìm).

## Thiết kế nhỏ nhất (chốt chi tiết tại Cổng 0 của hồ sơ nâng cấp)

**Một file luật + một dòng GUIDE + không bước mới:**

1. `human-facing-language.md`, mục «Hình tại điểm quyết định»: (a) một câu
   bất biến «hình là chiếu của nguồn chữ, không bao giờ là nguồn sự thật» kèm
   bảng hình-làm-được / chữ-làm-được (§1); (b) bảng tra
   `DECISION-DIAGRAM-SURFACES` đổi trục từ *mặt phẳng* sang **mặt phẳng ×
   tuổi thọ** — thêm hàng «Hồ sơ xưởng (`_acceptance/<slug>/figures/`) · sống
   cùng commit · qua PR + cổng · CHÍNH THỨC» và hàng «Bản in (Artifact) · sinh
   từ hồ sơ, mang link + commit ngược, không sửa thẳng»; danh sách đóng
   `DECISION-DRAW-MECHANISMS` thêm «trang HTML tự chứa trong hồ sơ, qua bộ vẽ
   repo khai»; (c) ba luật kết hợp (§3): chữ đủ đứng một mình · mỗi hình 3–5
   dòng cách đọc + colophon nguồn+commit · **danh sách miễn vẽ** (tin trạng thái
   một dòng · trả lời sự-kiện · xác nhận việc nhỏ). `LOOP-PICTURE-CLAUSE`
   giữ nguyên chữ — nó đã trỏ về bảng tra.
2. Ổ cắm `feature_loop.diagram_skill` (GUIDE bảng config, cạnh
   `ui_standards_skill`): key CÓ → khi vẽ cho hàng hồ sơ xưởng thì gọi skill
   ấy, KHÔNG tự chế HTML; key VẮNG → các cơ chế còn lại như cũ, không chặn,
   không ghi chú (khác `ui_standards_skill`: vắng bộ vẽ không phải lỗ chuẩn —
   hình vẫn vẽ được bằng mermaid/inline). GUIDE dặn repo chốt skin của bộ vẽ
   MỘT LẦN khi khai key.
3. Bản mẫu opportunity/contract: **không đổi ô nào** (§4); chỉ cho phép một
   dòng trỏ «phụ lục hình: `figures/`» ở đầu hồ sơ nếu thư mục có.

**Không làm:** không bắt buộc `figures/` cho mọi hồ sơ (N5 vẫn là ngưỡng
kích hoạt); không thêm bước vào feature-loop; không vendor skill; không chép
ngân sách ≤9 node/≤2 điểm nhấn (luật của bộ vẽ, ở lại trong skill); không đo
«hình đẹp» — kit chỉ giữ chỗ đứng cho hình, cách chọn, và đường truy về nguồn.

## Nghiệm trong chính vòng r4 (đang chạy) — để hồ sơ nâng cấp có ca thật

Owner đã quyết đưa vào kit; bảng này không còn là điều kiện mở mà là **ca
thật để viết đáp án hội đồng** và để bắt lỗ (vd hình vẽ mà không ai mở, hoặc
câu hỏi tại cổng vẫn trả lời bằng chữ dày). Phiên theo dõi ghi tại mỗi cổng
của bước 0 và bước 1:

| Cổng | Có hình trong hồ sơ? | Owner có tham chiếu hình khi trả lời? | Số lượt hỏi-đáp đến quyết | Có câu hỏi nào chỉ trả lời được nhờ hình? |
|---|---|---|---|---|
| Cổng Đáng r4 (đã qua 15/08) | 5 hình, `figures/` | *(điền từ transcript phiên A)* | | |
| Cổng 1 bước 0 | | | | |
| Cổng 2 bước 0 | | | | |
| Cổng 1 bước 1 | | | | |

Cột 5 bật ở cổng nào thì cổng đó là ca dương của đáp án hội đồng; cổng nào
hình vẽ mà không ai mở là ca cho danh sách **miễn vẽ** (chốt chống loãng —
phần TRỪ của hồ sơ này, không kém quan trọng hơn phần thêm).

## Ràng buộc

- Không sửa kit khi vòng r4 đang giữa vòng lặp (nếp «không đổi engine dưới
  chân feature đang chạy»); mở hồ sơ SAU khi bước 0 ký, hoặc gom về release kế.
- Hồ sơ tự-host T2 (docs + reference, không chạm script) — lời hứa loại B
  (phiên đọc bảng tra rồi chọn đúng cách vẽ) → nếu mở, đo bằng hội đồng phiên
  sạch như 1c: một đề bài «trình điểm quyết định ba nhánh cho cổng, hồ sơ có
  `figures/`» — đáp án: chọn hàng hồ sơ xưởng, gọi skill khai trong config,
  README có dòng chiếu-từ-đâu; ca giữ-gân: config KHÔNG khai skill → không tự
  chế HTML dài, rơi về mermaid/inline.
- Cổng skin của `diagram-design` là một lượt gọi người — nếu ổ cắm mở, GUIDE
  phải nói repo tiêu thụ chốt skin MỘT LẦN khi khai key, không để lượt đó rơi
  vào giữa vòng.
