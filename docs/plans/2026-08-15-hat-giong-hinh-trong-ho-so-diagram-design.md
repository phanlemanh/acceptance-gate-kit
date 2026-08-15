# Hạt giống — hình sống TRONG hồ sơ, vẽ bằng ổ cắm skill của repo

*Trạng thái: **HẠT GIỐNG, chờ Cổng 0**. Sinh 15/08 khi mở phiên theo dõi vòng
`trang-tu-van-v2-r4` (artifact-platform), owner giao hai việc: chạy thật bước 0
trên Kit 2.0 và tích hợp skill `diagram-design` vào vòng lặp. File này gom
phần THỨ HAI; phần thứ nhất ghi ở sổ vấp + memory.*

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

## Thiết kế nhỏ nhất (đề xuất, chọn tại Cổng 0)

**Chỉ hai chỗ chạm, cùng một file + một dòng GUIDE:**

1. `DECISION-DIAGRAM-SURFACES` thêm **một hàng**: mặt phẳng «Hồ sơ xưởng
   (`_acceptance/<slug>/figures/`)» → vẽ bằng «trang HTML tự chứa, qua bộ vẽ
   repo khai» → mặc định «khi hình phải sống qua PR + cổng: chiếu một mục của
   opportunity/contract, kèm `README` khai *chiếu từ đâu*». Danh sách đóng
   `DECISION-DRAW-MECHANISMS` thêm đúng cụm ấy. Kèm ba luật tầng-2 chép từ
   `figures/README.md` (sửa ở nguồn · chữ đủ đứng một mình · bản in không phải
   bản chính) — nhưng chỉ nếu ba luật ấy trace được: luật 2 là bất biến thật
   (hình rơi rụng không được làm mất nghĩa), luật 1 và 3 là hệ quả — có thể gộp
   thành một câu.
2. Ổ cắm `feature_loop.diagram_skill` (GUIDE bảng config, cạnh
   `ui_standards_skill`): key CÓ → khi vẽ cho mặt phẳng hồ sơ xưởng thì gọi
   skill ấy, KHÔNG tự chế HTML; key VẮNG → các cơ chế còn lại như cũ, không
   chặn, không ghi chú (khác `ui_standards_skill`: vắng bộ vẽ không phải lỗ
   chuẩn — hình vẫn vẽ được bằng mermaid/inline).

**Không làm:** không bắt buộc `figures/` cho mọi hồ sơ (N5 vẫn là ngưỡng
kích hoạt, và ngưỡng đó đã có); không thêm bước vào feature-loop; không vendor
skill; không đo «hình đẹp» — kit chỉ giữ chỗ đứng cho hình và cách chọn.

## Phép đo trước khi cộng — chạy trong chính vòng r4 (đang chạy)

Kit chỉ TRỪ không CỘNG, nên hạt giống này chỉ được mở nếu vòng r4 chứng được
hình-trong-hồ-sơ **rút ngắn khoảnh khắc quyết**. Phiên theo dõi ghi tại mỗi
cổng của bước 0 và bước 1:

| Cổng | Có hình trong hồ sơ? | Owner có tham chiếu hình khi trả lời? | Số lượt hỏi-đáp đến quyết | Có câu hỏi nào chỉ trả lời được nhờ hình? |
|---|---|---|---|---|
| Cổng Đáng r4 (đã qua 15/08) | 5 hình, `figures/` | *(điền từ transcript phiên A)* | | |
| Cổng 1 bước 0 | | | | |
| Cổng 2 bước 0 | | | | |
| Cổng 1 bước 1 | | | | |

Điều kiện mở hồ sơ: ≥1 cổng có cột 5 = «có» **hoặc** owner nói thẳng hình
giúp quyết; nếu qua cả bước 0 lẫn bước 1 mà không cột nào bật → hạt giống nằm
yên, `figures/` vẫn hợp lệ như nếp riêng của repo tiêu thụ (không cần kit
biết).

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
