---
name: design-pass
description: Nghi thức thiết kế IN-HARNESS cho bước S1-D của feature-loop — phiên chuyên trách CHỈ làm thẩm mỹ + UX trên bản bấm được đang chạy; mặc định không đồng bộ — máy dựng, tự chụp, gửi gói rồi đi làm việc khác, người phản ứng lúc rảnh; ngồi cùng là nấc cao nhất và phải có người gọi tên. Gate 1 duyệt trên bản bấm được, không duyệt UI bằng chữ. Dùng khi feature chạm UI cần khoảnh khắc visual trước Gate 1, hoặc khi user muốn design-pass một surface đang chạy (redesign, polish, dark-mode pass trên proto). KHÔNG dùng cho logic/backend, KHÔNG sửa component nền "cho proto đẹp", KHÔNG chấm fidelity hay sinh evidence máy (grading sống ở S4), KHÔNG thay vòng lặp code S3.
---

# design-pass — phiên thẩm mỹ + UX trên bản bấm được

**Một mặt phẳng làm việc:** mọi vòng lặp diễn ra trong Claude Code, trên
artifact thật đang chạy. Không surface thứ hai, không gương ngoài, không cầu
đồng bộ nào là mắt xích bắt buộc. Phiên này CHỈ làm thẩm mỹ + UX — mọi thứ
khác (logic, dữ liệu, component nền) là finding chờ Gate 1, không phải việc
của phiên.

Vai trong feature-loop: chạy ở **S1-D, TRƯỚC Gate 1** — để người duyệt bấm
được thứ họ duyệt. Doer≠grader giữ nguyên: skill này chỉ AUTHOR (sửa proto,
ghi vết); chấm máy là việc của S4, chấm thẩm mỹ là việc của chủ sản phẩm — ở nấc phản ứng rẻ nhất đủ cho quyết định đang mở (mục 4).

## Giai đoạn 0 — vật này sống ở đâu (bắt buộc chọn trước khi mở Browser pane)

Câu hỏi bắt buộc mở phiên (đứng cạnh câu phân loại mẫu khi mục bổ sung 02/08
của spec v2 §2.2 land): **"vật này sống ở đâu — phiên trình ở nấc nào?"**
Ba nấc, khai vào khoá `context:` của sổ phiên (mục 5), như `material:`:

| Nấc `context:` | Tiếng người | Nghĩa |
|---|---|---|
| `host-embedded` | nhúng host thật | vật render TRONG host thật của repo, sau cờ dev |
| `static-frame` | khung giả tĩnh | khung host thật dạng tĩnh bọc vật — thấy chỗ sống, host chưa chạy |
| `standalone` | đứng một mình | vật trần trên route proto — KHÔNG thấy người dùng vào–ra thế nào |

**Quy tắc chọn nấc — RẺ nhất đạt thị giác thật:** vật giao là một "đơn vị
host đã có khuôn" (plugin / route / screen) ⇒ mặc định **scaffold đơn vị THẬT
sau cờ dev, ruột tạm** — host render vật; CẤM dựng shell giống thật (gương
song song). Không có đường nhúng rẻ (khoá `design_pass.host_embed` vắng —
mục 1) ⇒ `static-frame` hoặc `standalone`+cảnh — hợp lệ vĩnh viễn: thang là
khai báo, không ép.

**Luật cảnh ngữ-cảnh:** `standalone` trước Cổng Phạm-vi (Gate 1) ⇒ kèm ≥1
**cảnh ngữ-cảnh** (khung host thật dạng tĩnh bọc vật + storyboard hành trình
vào–ra, capture về `evidence/design-pass/`, liệt vào khoá `context_scenes:`)
HOẶC entry descope có tên trong sổ quyết định theo đúng khuôn trong template
mục 5. Không có đường bỏ im lặng — thẻ Cổng 1 cờ vàng.

## 1. Preflight — thiếu gì nói đích danh, không lỗi mờ

1. Đọc `_acceptance/config.yaml` khối `design_pass`:

   | Key | Bắt buộc? | Nghĩa |
   |---|---|---|
   | `design_pass.proto_route` | BẮT BUỘC | TEMPLATE per-repo của URL bản bấm được, PHẢI chứa `{slug}` (vd `http://localhost:3000/proto/{slug}`). Route là per-feature nên config chỉ giữ khuôn; mỗi lần gọi điền slug, và cho phép override bằng arg khi route đặc thù. |
   | `design_pass.ds_skill` | khuyến nghị | Tên skill chuẩn DS/plugin của repo tiêu thụ (vd `<plugin>:<skill>`). Vắng → thang DS ở mục 2. |
   | `design_pass.dev_cmd` | optional | Lệnh khởi động dev server của repo — để thông điệp DỪNG-vì-route-chết in đúng lệnh. |
   | `design_pass.capture_cmd` | optional | Lệnh chụp riêng của repo; vắng → chụp bằng Browser pane. |
   | `design_pass.host_embed` | optional | Ổ cắm đường-nhúng-rẻ của repo: `guide:` con trỏ hướng dẫn nhúng (thường trỏ cùng chỗ `feature_loop.ui_standards_skill`) + `route:` proto trong host + `dev_flag:` cờ dev. VẮNG → repo chưa có đường nhúng rẻ: phiên đi nấc thấp (`static-frame`/`standalone`+cảnh, Giai đoạn 0) + thẻ Cổng 1 cờ vàng, KHÔNG chặn. Khoá CÓ mà con trỏ không giải được → thẻ cờ vàng nêu tên con trỏ hỏng, cũng không chặn. |

   Repo chưa có khối → in lệnh mẫu cho user chạy (script `config-patch` của
   plugin acceptance-gate, dry-run mặc định):

   ```bash
   node "${CLAUDE_PLUGIN_ROOT:-$PLUGIN_ROOT}/scripts/config-patch.mjs" --config _acceptance/config.yaml --key design_pass.proto_route --value "http://localhost:3000/proto/{slug}"
   ```

2. **Thiếu khối `design_pass` hoặc thiếu `proto_route` → DỪNG nghi thức
   NGAY**: in đích danh key thiếu + lệnh mẫu trên + giải thích cần một bản
   bấm được đang chạy (đường proto C2 của repo). TUYỆT ĐỐI không fail-open
   sang một route mặc định tự đoán.

3. Xác định **workspace slug đang phục vụ** (phiên design-pass luôn phục vụ
   một feature đang trong vòng lặp): feature-loop gọi thì slug đi kèm; gọi
   standalone không có slug → hỏi user đúng 1 câu chọn slug trong
   `_acceptance/`; repo chưa có workspace nào → nói rõ design-pass không
   chạy mồ côi — chạy `/feature-loop` trước để có contract mà findings có
   chỗ về.

## 2. Nạp 2 nguồn luật

- **(a) `ux-ui-craft`** (skill cùng plugin) — sàn accessibility, chống
  AI-slop, kỷ luật token. Luôn nạp.
- **(b) Nguồn luật DS của repo — theo THANG, mọi nấc có tên:**
  1. `design_pass.ds_skill` khai trong config → nạp skill đó.
  2. Key vắng / skill không resolve được → tìm **từ vựng token của repo**
     (theme.css, tailwind config, design-tokens file… — vật liệu per-repo,
     kit không đoán tên cụ thể) → dùng nó làm luật.
  3. Repo 0 token (không có từ vựng nào nhận diện được) → dùng từ vựng
     **shadcn** làm mặc định CÓ TÊN: token/component đề xuất trong phiên
     theo khuôn shadcn. shadcn là chuẩn ngành công khai — với repo ngoài
     React/Tailwind chỉ mượn TỪ VỰNG token (tên biến, thang màu/spacing),
     không mượn component.

  Rơi xuống nấc 2 hoặc 3 thì KHÔNG im lặng: tự ghi 1 finding **Nhóm 2**
  ("repo chưa khai skill chuẩn DS — phiên chạy trên `<repo-tokens|
  shadcn-default>`") để Gate 1 thấy và quyết nhận nấc đó làm chuẩn repo hay
  đầu tư DS riêng. Thiếu nhánh này là thiếu nhánh degrade ds_skill.

## 3. Mở đối tượng làm việc (Browser pane)

Đối tượng của phiên là **bản bấm được ĐANG CHẠY**, mở qua URL từ
`proto_route` (điền `{slug}`). Vật liệu của nó theo **thang vật liệu** —
hạ bậc phải ĐỂ VẾT, không hạ ngầm:

| Bậc `material:` | Khi nào | Độ tin cho người duyệt |
|---|---|---|
| `real-components` (MẶC ĐỊNH) | Repo có component/token — kể cả SURFACE MỚI: proto module mới ghép từ component sẵn có | Fidelity cấu trúc, drift 0, công port ~0 |
| `scaffold` | Repo có token/DS nhưng chưa đủ component cho surface này — khung dựng bằng primitives + token repo | Token đúng; hình khối component là bản nháp |
| `static` | Repo mới tinh / khác stack — HTML tĩnh token-only | Chỉ ý định thị giác; công port xa nhất |

Bậc đang dùng PHẢI khai `material:` trong ghi vết kết phiên (mục 5) — thẻ
Gate 1 hiện nó để người duyệt biết mình đang duyệt trên vật liệu gì.

Route không mở được (404 / connection refused) → **DỪNG nghi thức**: nói rõ
bản bấm được chưa chạy; repo đã khai `design_pass.dev_cmd` → in đúng lệnh đó
cho user khởi động; chưa khai → nói rõ chưa có lệnh khởi động được khai và
trỏ đường dựng proto của repo. **KHÔNG tự dựng route/logic thay repo** —
dựng proto là việc của feature-loop/S1, không phải của phiên thẩm mỹ.

## 3b. Bước phân kỳ — có điều kiện, TRƯỚC vòng lặp phản ứng

Điều kiện mở: bề mặt còn **≥2 hướng khả dĩ mà máy không tự chắc** (đúng luật
đáng-log của sổ quyết định). Bề mặt đi theo khuôn có sẵn ⇒ KHÔNG mở — nhưng
PHẢI để vết ở khoá `divergence:`, không có đường bỏ im lặng.

**Thứ tự bắt buộc — đảo thứ tự là hỏng cả bước:**

1. **Mở bằng vật thật đang có** trước tiên: ảnh bề mặt hiện hành, nếu có. Để
   người veto được cả TIỀN ĐỀ, không chỉ chọn trong mấy món máy bày. Ván thử
   19/08 chết đúng ở đây — bộ phương án hỏi «phiếu khuyên đứng đâu» trong khi
   câu hỏi sống của chủ sản phẩm là «thứ này còn đáng tồn tại không», và câu đó
   chỉ lộ ra khi nhìn sản phẩm đang chạy.
2. Rồi mới **bày hướng**. Nguồn: section `## Đặc tả UX` của design-doc (bản đồ
   màn & luồng + bảng trạng thái); kho chưa có bản đặc tả thì mở từ design-doc
   như cũ.

**Kỷ luật phương án — bốn vế, không bỏ vế nào:**

- mỗi hướng một **TRỤC có tên** + một câu **động cơ** + một câu **đánh đổi**;
- áp cho **KỂ CẢ hướng máy không khuyên** — bộ phương án chỉ biện hộ cho ứng
  viên máy thích là phiếu bầu gài sẵn;
- **ngả máy khuyên phải GHIM TRÊN VẬT**, không nằm trong tin nhắn: người mở
  đường dẫn lúc rảnh phải thấy lời khuyên nằm cạnh hướng, không thấy một thực
  đơn trần (ván thử 19/08 ghim câu hỏi nhưng quên ghim lời khuyên);
- **tên hướng ổn định** vĩnh viễn, không đánh số lại giữa các lượt; hướng đã
  chốt thì **không hỏi lại**.

**Độ nét = đủ cho quyết định đang mở.** Phác thô hợp lệ; token/component thật
chỉ cần khi chính token là **NỘI DUNG của quyết định**.

**Vết của bước này — khoá `divergence:` trong sổ phiên, từ vựng ĐÓNG:**
`divergence: opened` khi có mở, `divergence: skipped — <căn cứ 1 dòng>` khi
không. Vết ở một khoá có tên chứ không ở chỗ tuỳ hứng mỗi phiên, vì ngưỡng
«máy né bước phân kỳ bị veto» chỉ đếm được khi nó nằm đúng một chỗ.

**Thang vật dựng — kit KHÔNG phụ thuộc bộ dựng nào:**

<<<BUILDER-LADDER
1. dựng được + lưu được → dùng bản lưu;
2. chỉ xem được (xuất ảnh/PDF) → dùng bản chỉ-xem;
3. file đã dựng mở TẠI MÁY trong khung duyệt — quyền tổ chức chỉ gác việc lưu
   trực tuyến, không gác dựng-và-xem, nên người không có quyền vẫn có vật;
4. không có gì → máy khuyên MỘT hướng kèm căn cứ, ghi vết, **ĐI TIẾP** (không
   dừng nghi thức), người veto sau.
BUILDER-LADDER>>>

Bộ phương án là **phác tầng 1**: KHÔNG chép vào `evidence/`, KHÔNG vào thẻ như
bằng chứng — chỉ là tham chiếu ở khoá `options:`.

## 4. Vòng lặp phản ứng — thang bốn nấc

Cái quý của phiên đồng bộ cũ không phải SỰ ĐỒNG BỘ mà là **vật bấm được**. Phiên
cũ trộn hai thứ — phản ứng trên vật thật, và hẹn giờ ngồi cạnh máy — mà chỉ thứ
sau đắt. Tách ra thành thang: kênh đắt chỉ mở khi quyết định đang mở cần đúng
băng thông đó.

<<<REACTION-LADDER
| id | Tên | Dùng khi |
|---|---|---|
| nac-0 | đi thẳng | khuôn có sẵn, 0 hướng mở — để vết một dòng, người veto sau |
| nac-1 | không đồng bộ trên ảnh | quyết định là hướng · bố cục · trạng thái tĩnh |
| nac-2 | không đồng bộ trên vật bấm được | cần thấy trạng thái chuyển — luồng nhiều bước |
| nac-3 | ngồi cùng ngắn, có người gọi tên | tương tác tinh: kéo-thả, chạm, nhịp chuyển động |
REACTION-LADDER>>>

Câu dưới đây là bản gốc DUY NHẤT của điều khoản nấc-mặc-định; nơi khác chép
NGUYÊN VĂN, và bảng khai tay `REACTION-DEFAULT-SITES` giữ số bản chép phải có.

<<<REACTION-DEFAULT-SENTENCE
Mặc định là KHÔNG ĐỒNG BỘ: máy dựng bản mẫu, tự chụp ma trận trạng thái × khổ, gửi gói rồi đi làm việc khác; nac-3 (ngồi cùng) chỉ mở khi có người gọi tên nó.
REACTION-DEFAULT-SENTENCE>>>

<<<REACTION-DEFAULT-SITES
skills/design-pass/SKILL.md 1
feature-loop/skills/feature-loop/SKILL.md 1
REACTION-DEFAULT-SITES>>>

**Ba luật vận hành:**

1. **Máy KHUYÊN nấc kèm căn cứ một dòng, người veto một chạm** — không bao giờ
   hỏi «anh muốn ngồi cùng hay để đó?». Hỏi mở là đường cùng.
2. **Leo thang theo TÍN HIỆU ĐẾM ĐƯỢC, không theo cảm giác:** cùng MỘT điểm bị
   chê hai vòng không-đồng-bộ liên tiếp ⇒ kênh thiếu băng thông ⇒ mời nac-3
   **GIỚI HẠN đúng điểm đó**, có chủ đề khai trước, không phiên trọn gói. Đây là
   luật dừng-vá áp cho kênh phản ứng.
3. **Nấc nào cũng để vết:** khoá `reaction:` ghi nấc + kênh đã dùng (mục 5), thẻ
   Cổng Phạm vi hiện nó.

Số chấm người KHÔNG tăng: nac-2 và nac-3 là HÌNH THỨC của chấm phản-ứng đã có,
không phải chấm mới. Thang mà làm tăng số lần gọi người thì nó đã phản bội đúng
thước đo mà nghi thức này tồn tại để phục vụ.

**Nhịp mỗi vòng, không tắt bước:**

1. **Sửa** code bản mẫu — chỉ thẩm mỹ + UX, trong từ vựng token (nguồn luật mục 2).
2. **Reload** bản đang chạy rồi **chụp lại** ma trận trạng thái × khổ, gửi gói
   theo nấc đang dùng.
3. **Chờ owner phản ứng bằng lời** — lúc rảnh, qua kênh của nấc đó: ghim câu hỏi
   cạnh vật · luồng thảo luận trên bản gửi · owner sửa thẳng rồi lưu để máy đọc
   lại phần khác. Ở nac-3 thì phản ứng đến ngay tại phiên.
4. Phản ứng → vòng kế; người gật phần nào thì ghi nhận phần đó.

KHÔNG tự chấm thẩm mỹ thay owner — không «tôi thấy đẹp rồi» để tự kết phiên.
Phần chấm máy (evals, hook) sống ở S4; phiên này không sinh evidence.

**Ví dụ một vòng (nhịp chuẩn):**

> Owner: «Nút hành động chính chìm quá, với giá tiền đọc không nổi.»
>
> 1. Sửa bản mẫu trong TỪ VỰNG TOKEN: nút chính đổi sang token nhấn của repo,
>    giá tiền lên bậc typography có sẵn — KHÔNG chèn hex, KHÔNG sửa component nền.
> 2. Chụp lại, gửi gói kèm một câu: «Đã nâng nút chính lên token nhấn + giá lên
>    bậc chữ lớn.»
> 3. Owner gật nút, chê tiếp khoảng cách card → vòng kế. Cuối phiên: 2 việc trên
>    vào findings Nhóm 1 (đã vá); người đòi một variant nút mà DS chưa có → đó là
>    finding Nhóm 2, ghi chờ Gate 1, KHÔNG chế tại chỗ.

## RÀNG BUỘC CỨNG (cả phiên — vi phạm là dừng tay, không phải style)

- **không hex mới** — chỉ từ vựng token của repo (hoặc nấc DS đang khai);
  cần màu chưa có = finding Nhóm 2, không phải một mã hex chèn tạm.
- **không webfont** — không thêm font ngoài; typography đi theo token repo.
- **không sửa `components/ui`** hay component nền "cho proto đẹp" —
  thiếu/xấu ở tầng component = finding Nhóm 2 chờ Gate 1, sửa ở Build.
- **không logic nghiệp vụ / write-path** — proto là Ý ĐỊNH: data mock, không
  đường ghi; phiên thẩm mỹ càng không mở đường ghi mới.

## 5. Kết phiên — capture + findings + ghi vết workspace

1. **Capture ma trận** state × breakpoint (× theme khi repo có dark mode):
   - states: lấy từ khai báo states của proto (query `?state=` hoặc file
     states của proto module). Proto KHÔNG khai states → **hỏi owner danh
     sách state cần duyệt ngay đầu phiên** (1 câu), ghi vào frontmatter —
     không bịa, không chụp mỗi default rồi im.
   - breakpoints mặc định: mobile 375 / desktop 1280 (resize Browser pane);
     theme light/dark qua colorScheme khi repo có dark mode.
   - repo khai `design_pass.capture_cmd` → dùng lệnh đó thay chụp tay.
   - Ảnh về `_acceptance/<slug>/evidence/design-pass/<state>--<breakpoint>[--<theme>].png`.
2. **Cấm đường cũ:** KHÔNG ghi vào `evidence/design/` và KHÔNG tạo
   `provenance.json` — đó là trigger của công tắc CT2 (ceremony mockup đã
   khai tử); design-pass không được bật nhầm làn chết.
3. **Ghi vết:** viết `_acceptance/<slug>/design-pass.md` theo ĐÚNG khuôn
   giữa cặp marker `DESIGN-PASS-NOTE-TEMPLATE` dưới đây (khuôn là seam
   LLM-viết→máy-đọc — một chỗ, có marker, đừng chế biến thể):

<<<DESIGN-PASS-NOTE-TEMPLATE
---
slug: <slug>
at: <ISO UTC>
route: <url đã mở>
material: <real-components|scaffold|static>
context: <standalone|static-frame|host-embedded>
context_scenes: [<file cảnh trong evidence/design-pass/, trống nếu không standalone hoặc đã descope>]
reaction: <id nấc lấy từ REACTION-LADDER> (<kênh đã dùng, vd ghim, thao-luan, sua-roi-luu>)
options: <đường dẫn hoặc URL bộ phương án — THAM CHIẾU, không phải bằng chứng; trống nếu không mở bước phân kỳ>
divergence: <opened, hoặc: skipped — căn cứ 1 dòng>
ds_skill: <tên-skill-đã-nạp|repo-tokens|shadcn-default>
states: [<danh sách state đã duyệt>]
breakpoints: [mobile-375, desktop-1280]
themes: [light]
patched: <n>
deferred: <n>
---
# design-pass — <slug>

## Ma trận capture

| state | breakpoint | theme | file |
|---|---|---|---|
| <state> | <breakpoint> | <theme> | evidence/design-pass/<file>.png |

## Cảnh ngữ-cảnh

- <file cảnh — khung host thật dạng tĩnh bọc vật + storyboard vào–ra; standalone mà bỏ cảnh ⇒ entry sổ quyết định bắt đầu đúng chuỗi "bỏ cảnh ngữ-cảnh — <lý do 1 dòng>">

## Findings

### Nhóm 1 — vá-được-trong-từ-vựng-token (đã vá tại chỗ)

- <finding — đã đổi gì, 1 dòng/finding>

### Nhóm 2 — đòi-đổi-DS/component (chờ Gate 1)

- <finding — thiếu/xấu gì ở tầng DS/component, đề xuất 1 dòng>
DESIGN-PASS-NOTE-TEMPLATE>>>

   `patched` = số finding Nhóm 1, `deferred` = số finding Nhóm 2; `themes`
   ghi `[light, dark]` khi có chụp dark. Nhóm 2 là input trực tiếp của
   Gate 1 — người duyệt quyết ghi Known limits / mở contract / nâng phạm vi.

## Degrade — bảng tra (mỗi thiếu hụt 1 hàng, không lỗi mờ)

| Thiếu | Hành xử |
|---|---|
| Khối `design_pass` / key `proto_route` | DỪNG + in key thiếu đích danh + lệnh `config-patch` mẫu (mục 1). Không fail-open. |
| `ds_skill` vắng / không resolve | Chạy tiếp theo thang DS (mục 2) + finding Nhóm 2 nêu nấc đã dùng. |
| Route không mở được | DỪNG + in `dev_cmd` nếu khai + trỏ đường dựng. Không tự dựng. |
| Proto không khai states | Hỏi owner danh sách state đầu phiên, ghi frontmatter. Không bịa. |
| Slug không xác định (standalone) | Hỏi 1 câu chọn slug trong `_acceptance/`; không có workspace → không chạy mồ côi. |
| `design_pass.host_embed` vắng | Nấc thấp (Giai đoạn 0) + cờ vàng trên thẻ Cổng 1. Không chặn. |
| Không mở bước phân kỳ | Ghi `divergence: skipped — <căn cứ 1 dòng>` trong sổ phiên (mục 3b). Không có đường bỏ im lặng. |
| Không có bộ dựng phương án | Xuống nấc 4 thang vật dựng: khuyên một hướng kèm căn cứ, ghi vết, đi tiếp. KHÔNG dừng. |
| `context: standalone` thiếu cảnh ngữ-cảnh | Entry descope đúng khuôn (mục 5) hoặc thẻ cờ vàng — không có đường bỏ im lặng. |

## Ranh giới

- **Bề mặt hoàn toàn chưa dựng được bản chạy** (chưa có proto nào mở nổi):
  việc của bước dựng proto trong S1, không phải của phiên này — DỪNG theo
  hàng route-chết, đừng lách bằng cách tự dựng.
- **Phiên SAU Gate 1** (owner phản hồi thẩm mỹ giữa S3/S4): findings đổ về
  `review-findings.md` của slug (kênh phản-hồi-giữa-vòng), KHÔNG ghi đè
  `design-pass.md` của bản đã duyệt — bản đã duyệt là mốc neo của Gate 1.
