# `@shadcn/lint` — nó là gì, và nó đứng ở đâu với kit

> Owner hỏi 22/09, ngay sau finding `nen-shadcn` (21/09): *research chi tiết về lint và vai trò của
> nó, đặc biệt là đối với Kit*. Nguồn: `README.md`, `docs/evals.md`, `docs/how-it-works.md`,
> `docs/adoption.md` của `shadcn-ui/lint` (đọc bản thô trên `raw.githubusercontent.com`, 22/09).
> Số về kho tiêu thụ là **đo tại chỗ**, không suy: `package.json`, `components.json`, và một lượt
> chạy thật `npm run lint`.

## 0. Một đoạn

`@shadcn/lint` không phải một bộ quy tắc thẩm mỹ. Nó là **một máy đọc, còn luật thì kho tự khai** —
chủ repo viết hợp đồng cho từng component (`Button` giữ padding của nó, `CardTitle` được đổi cỡ chữ
nhưng không đổi font weight), máy đọc mã nguồn và khi máy viết sai thì câu báo lỗi **gọi tên lối
đúng bằng từ vựng của chính kho đó** («dùng size `sm`, `lg`», «lấy màu ở `src/index.css`»). Đó là
toàn bộ ý tưởng, và nó là **cùng một mệnh đề mà hiến pháp kit đã tuyên nhưng chưa từng đo**: *cấm
dặn-bằng-lời làm nghiệm*. Bên kia đã đo — cùng bộ luật, đưa dạng **văn xuôi** thì Haiku 4.5 mất 1,57
vòng và tốn $1,41; đưa dạng **chẩn đoán máy đọc** thì 1,00 vòng, $0,74. Rẻ hơn **10–48 %**. Với kit,
giá trị lớn nhất của kho này **không phải công cụ** — mà là ba nếp đo nó làm đúng hơn kit, và một
phép nghịch đảo kiến trúc: *engine chở bộ đọc, kho chở luật*. Ổ cắm để dùng nó thì kit **đã có sẵn**
(`executors.script`), không phải dựng gì.

---

## 1. Cơ chế thật — bỏ phần quảng cáo

Nó là plugin cho **ESLint ≥ 9.30** hoặc **Oxlint ≥ 1.80**, chạy trên **mã nguồn** (AST), không chạy
ứng dụng. Sáu luật:

| Luật | Bắt gì |
|---|---|
| `no-restyle` | Đè style một component bằng `className` |
| `no-raw-colors` | Màu thô (`bg-pink-500`), màu không khai trong `@theme` |
| `no-arbitrary-values` | Giá trị tự chế (`p-[13px]`) |
| `no-inline-styles` | `style={{...}}` và `<style>` |
| `no-unknown-classes` | Class Tailwind không sinh ra được (`rounded-huge`, `hovr:flex`) |
| `require-static-classes` | Class máy không đọc tĩnh được (`` `bg-${color}` ``) |

Ba điều đáng chú ý về **cách** nó đọc, vì đây mới là phần khó:

1. **Nó truy nguyên ngược về nơi định nghĩa.** Re-export, đổi tên import, `memo`/`forwardRef`,
   barrel file, tsconfig `paths`, workspace `exports` — đều lần được. Một wrapper chuyển tiếp
   `className` **thừa kế hợp đồng** của component nó bọc. Kể cả `render={<Button />}` của Base UI:
   class đi theo Button thì Button là bên chịu luật.
2. **Gợi ý lấy từ chính kho, không từ danh sách cứng.** Nó đọc `cva`/`tv`, và cả prop kiểu union
   (`size?: "sm" | "lg"`) và `keyof typeof` của một object tra cứu — tức là *design system không
   dùng `cva` vẫn được gợi ý*. Nó đọc `@theme` để biết token nào tồn tại, so màu trong **OKLab** để
   gợi token gần nhất, đọc thang radius/text kể cả `calc()` — `rounded-[10px]` gợi `rounded-lg` nếu
   token ấy đúng 10px.
3. **Nó hỏi Tailwind đã cài của kho**, trong worker thread, xem class có sinh CSS không — chứ không
   ôm một bảng class. Tailwind không nạp được thì luật **hạ xuống cảnh báo** và dùng ngữ pháp dự
   phòng; nó không im lặng cho qua.

Cấu hình sống ở `settings.shadcn` (nhận diện import, hàm gộp class, và `note` — một câu dặn nối vào
**mọi** câu báo lỗi), và ở `contracts` của từng luật (khuôn tên component → cho gì, cấm gì). Thông
điệp có placeholder: `{{sizes}}`, `{{component}}`, `{{file}}`.

**Hệ quả kiến trúc, và đây là điểm chính:** cùng một bộ component ship đi nhiều dự án với **luật
khác nhau**; áp luật lên component **của bên thứ ba** mà không fork, không wrapper. Component giữ
nguyên độ mềm — **chính sách nằm ở cấu hình của kho**.

---

## 2. Bằng chứng nó đưa ra — và nó đạt chuẩn nào của kit

`docs/evals.md` là tài liệu đáng đọc nhất trong kho, không phải vì kết quả mà vì **hình dạng phép
đo**. Đối chiếu thẳng với luật kit:

| Nếp của kit | `@shadcn/lint` làm gì |
|---|---|
| **Đối chứng dương** (bản nguyên vẹn phải XANH trước khi tin bản bị tiêm là ĐỎ) | Có **nhánh control** riêng: cùng mã xuất phát, cùng văn bản luật, cùng 3 vòng, **không** chẩn đoán. Nhánh này cô lập đúng biến cần đo. |
| **Thước gắn vào vật** | Mỗi vòng là một **bản sao cô lập** của một dự án shadcn thật; agent sinh mã trong đó; fixture do chạy thật sinh ra, không viết tay. |
| **Chiều đỏ nằm trong bộ kiểm** | Nhánh «before» **luôn** phải ra findings; bảng ghi số before cho từng model (Sonnet 70, Haiku 62–72, Opus 8–43). Before mà bằng 0 thì phép đo tự tố cáo — và họ khai thẳng lần Opus ra 8. |
| **Khai giới hạn có tên** | Mục `Limitations` khai: ba model **cùng một nhà**, judge **cùng nhà** → «một judge khác nhà sẽ là phép kiểm độc lập hơn». Mục `What it cannot see` liệt **sáu** điểm mù. |
| **Đường nền có bánh cóc** | 485 file registry ghim ref, **602 findings** là đường nền; build **đỏ khi số tăng**. Không phải «phải về 0», mà «không được tệ đi». |
| **Bản chụp làm chứng nằm trong hồ sơ** | Liệt **toàn bộ run-id** có ngày giờ, và lệnh tái lập kèm **giá tiền ước tính mỗi lượt** ($2 Haiku, $4–5 Sonnet, $6–9 Opus). |

Và một thứ kit chưa làm: **red-team có bảng, có ca THOÁT**.

| Đòn | Kết quả |
|---|---|
| Hex thô qua CSS custom property | bắt |
| Class CSS thô trong `globals.css` | **thoát** |
| Đúc một token theme mới | **thoát** |
| Chuỗi class động trong biến | bắt |
| Thuộc tính `fill` của SVG | bắt |
| Re-export component ui ở chỗ khác | bắt |
| Gộp tất cả các đòn trên | bắt |

Hai ca thoát được **giải thích chứ không chữa**: CSS thuần là việc của linter CSS; token mới thì
theo định nghĩa là đúng-hệ-thống. Và câu cuối: *«đây là một lượt tìm có biên, không phải chứng minh
rằng không còn lối vòng nào»*.

Đây đúng là **ĐỊNH VỊ 21/09**: kit là bảng đồng hồ, không phải toà án; *giới hạn là câu trả lời hợp
lệ, không phải lỗi*. Một kho bên ngoài ship nó như **một tính năng**, không như một lời xin lỗi.

### Số của nhánh control — mệnh đề của kit, do người khác đo

Một lượt control mỗi model. «Rounds» là trung bình trên các task cần sửa; «cost» chỉ tính phần sửa.

|  | Sonnet 5 | Haiku 4.5 | Opus 5 |
|---|---|---|---|
| Xanh, **chỉ có luật dạng văn xuôi** | 8/8 | **7/8** | 8/8 |
| Xanh, **có chẩn đoán máy đọc** | 8/8 | **8/8** | 8/8 |
| Số vòng, chỉ có luật | 1,25 | **1,57** | 1,00 |
| Số vòng, có chẩn đoán | 1,00 | **1,00** | 1,00 |
| Tiền sửa, chỉ có luật | $3,57 | $1,41 | $4,35 |
| Tiền sửa, có chẩn đoán | $2,47 | $0,74 | $3,93 |

Ca Haiku là ca dạy nhiều nhất, và họ kể thẳng: nó khai một token cỡ chữ **sai namespace**, dùng thành
`text-stats-label`, rồi **ba lượt tự soi lại không tìm ra class hỏng**. Đưa cho nó một dòng chẩn đoán
gọi đúng tên class — một vòng, xong.

**Đọc cho kit:** «dặn bằng lời» không phải là *kém hiệu quả hơn*, nó là *một hạng khác*. Model mạnh
che lấp khác biệt (Opus 1,00 ở cả hai cột) — nên nếu kit chỉ tự thử trên Opus, kit sẽ **không bao giờ
thấy** lớp lỗi này. Đó là một lời giải thích khả dĩ cho vì sao luật văn xuôi của kit vẫn «có vẻ chạy
được».

---

## 3. Bốn điều nó dạy kit

### D1 · Nghịch đảo: engine chở BỘ ĐỌC, kho chở LUẬT

Kit hôm nay đi ngược. `scripts/design-scan.js` là **5 191 dòng**, chở **hơn 40 luật thẩm mỹ cứng** do
kit tự quyết: `ai-color-palette`, `cream-palette`, `gradient-text`, `em-dash-overuse`,
`marketing-buzzword`, `aphoristic-cadence`, `hero-eyebrow-chip`, `italic-serif-display`… Đó là **một
gu**, và nó nằm trong engine.

Điều này va vào luật của chính `CLAUDE.md`: *«Kit là engine — KHÔNG chứa product context của repo
tiêu thụ»*, với phép thử *«thứ gì vô nghĩa với một công ty khác dùng kit thì không thuộc kit»*.
`cream-palette` vô nghĩa với một công ty có bảng màu kem là brand. Luật ấy hôm nay được đọc là «đừng
chép product context vào kit», nhưng **một gu thẩm mỹ cứng cũng là product context** — chỉ là nó được
viết bằng mã nên không ai gọi tên.

`@shadcn/lint` cho thấy hình dạng còn lại: engine **không có gu**, nó đọc `components.json`, `@theme`,
`cva`; **kho khai hợp đồng**. Cùng bộ đọc, hai kho ra hai luật.

> **Đề xuất (hạt giống, chưa phải ô):** phần **có gu** của `design-scan` tách được thành một bảng
> luật kho tự khai — cùng đúng cái ổ `_acceptance/config.yaml` đã có. Phần **không gu** (`low-contrast`,
> `tiny-text`, `skipped-heading`, `text-overflow`, `broken-image` — sàn tiếp cận, đúng với mọi công ty)
> ở lại engine. Neo ngoài: kho `radar` hôm nay đang chịu toàn bộ 40 luật mà nó không khai cái nào.

### D2 · Câu báo lỗi là một khoản CHI PHÍ MÁY, đo được

Luật (c) của kit đếm **token máy/vòng** và **phút máy/lượt chấm**. Kho này chỉ ra một biến mà kit
chưa từng tính vào: **chất lượng câu báo lỗi**. Cùng luật, cùng vật, đổi mỗi cách nói → 10–48 % tiền
sửa, và với model yếu là **khác biệt giữa hội tụ và không**.

Câu của kit hôm nay phần lớn là **CHẶN + mã luật**. Câu của `@shadcn/lint`:

```text
"p-4" is not allowed on <Button>: <Button> owns its spacing.
Use a size (sm, lg), or margin here or gap on the parent for space around it.
Add a size in components/ui/button.tsx only if the design explicitly calls for one.
```

Ba vế: **cái gì hỏng · dùng gì thay · sửa ở file nào**. Vế thứ hai và ba rút từ **vật của kho**, không
từ văn bản viết tay — nên chúng không thể trôi khỏi vật. Đó chính là nếp «thước phải gắn vào vật»,
áp cho *câu chữ* chứ không chỉ cho *phép đo*.

> **Đề xuất:** mỗi thông điệp CHẶN của kit tự hỏi một câu — *lối đúng có được gọi tên, và tên ấy có
> rút từ cây đang chạy không?* Nếu lối đúng phải tra tài liệu mới biết, thông điệp ấy đang tính tiền
> máy.

### D3 · Đường nền chỉ-đi-xuống là lối nhận engine mới không cần đại tu

Kit đã có `duong-nen` và đã có bài học «nâng engine consumer → đo bằng **phép vi phân** cũ-vs-mới,
không đọc số tuyệt đối». Kho này ship cùng lời giải, ở dạng vận hành được cho kho legacy:

- `--max-warnings 287` — con số đo được hôm nay, CI đỏ khi **tăng**, hạ dần khi sửa.
- `eslint --suppress-all` ghi đường nền **theo từng file, từng luật**, `--prune-suppressions` dọn mục
  đã hết.
- Mã mới **chặt**, mã cũ **cảnh báo**, tách bằng `files:` — cùng một luật, hai mức, theo thư mục.

Đây là câu trả lời cho lớp phiền của kit: *«chiến dịch ghim lại mỗi mốc phát hành»* và *«0→9 vi phạm,
chặn vì môi trường»* ở media-library (2.17.0). Đường nền theo file cho phép một kho **nhận engine mới
mà không đỏ**, rồi trả nợ theo nhịp của nó.

### D4 · Lớp lỗi thật mà nó đo được, kit chưa đo

Bảng **neutral tasks** là phát hiện đáng giá nhất, và nó không nằm trong phần quảng cáo:

> Tám việc lắp ghép, **không một chữ nào nói về style**, trên 11 component mặc định của `shadcn init`.
> Sonnet ra **14** findings, chỉ **3/8** việc sạch. Haiku ra **21**, **2/8** sạch. *Cả 35 findings đều
> là class ngoại hình truyền từ bên ngoài vào component.*

Nghĩa là: **không cần ai dụ, máy vẫn đè style lên component nó được giao, ở đa số việc.** Và ở mục
«drift over time» — tám việc chạy nối tiếp trong một dự án, như một tuần làm việc — dự án không có
luật kết thúc với 18–23 findings và **vốn từ không hề lớn lên**; dự án có luật về 0 mỗi lần, **với
nhiều variant hơn lúc bắt đầu**.

Đó là lớp lỗi mà bốn vòng chấm của `nen-shadcn` đã **trả tiền** — 9,2 M token, 2 h 45 chờ — bằng hội
đồng và mắt người. Một linter bắt cùng lớp ấy **tất định, trước khi hội đồng chạy, gần như 0 token**.

---

## 4. Nó đứng ở đâu trong kit — ổ cắm ĐÃ CÓ

Câu trả lời ngắn: **không có việc gì phải dựng trong kit.**

`_acceptance/config.yaml` đã có khối `executors.script`. Một dòng là đủ:

```yaml
executors:
  script:
    lint_he_thiet_ke: "npm run lint"
```

Từ đó nó là một eval như mọi eval khác: có mã thoát, có chiều đỏ (gỡ luật → xanh; tiêm một
`className="bg-pink-500"` → đỏ, và **đỏ kèm câu chỉ lối**), chạy ở **cùng nhà với vật** — đúng luật
thiết kế của ĐỊNH VỊ 21/09 («thước ở cùng nhà với vật thì cạnh Thước↔Vật ngắn»).

Và theo **luật neo ngoài** + **luật chiều rộng (b)**: đây là **việc của kho tiêu thụ**, không phải ô
của kit. Nó có neo ngoài thật (một kho cụ thể, một PR), nên nó đi được ngay; còn D1–D3 là **hạt
giống**, sống ở `docs/plans/*-hat-giong-*.md`, chờ một mốc phát hành được kho nhận.

---

## 5. Nó KHÔNG làm gì — đối chiếu thẳng với bốn vòng `nen-shadcn`

Phải nói rõ, vì dễ đọc nhầm thành thuốc chữa bách bệnh.

| Phát hiện của bốn vòng | `@shadcn/lint` có bắt? |
|---|---|
| Khung cảnh giới tương phản **1,91:1** | **Không.** Tương phản không phải luật của nó. Việc này là của `tests/tokens.test.ts` (tính thẳng từ lớp token) và `low-contrast` trong design-scan. |
| Chữ phụ màn Đăng nhập **4,48:1** | **Không.** Cùng lý do. |
| `Alert destructive` mất màu khẩn vì kho **bỏ biểu tượng** | **Không.** Nó đọc `className`, không đọc việc thiếu một phần tử con. |
| Máy tự **nới một AC đã ký** | **Không.** Đó là quản trị cổng — việc của hội đồng, và hội đồng đã bắt đúng. |
| Câu kiểm S1 khẳng định thứ sản phẩm không làm (B3) | **Không** — nhưng **đúng hình dạng**: một phép kiểm tất định, rẻ, chạy trước hội đồng, trên một artifact khác (`contract.md`). |
| Máy dựng lại cơ chế đo đã bị kho cấm bằng chữ (B5) | **Không** — nhưng B5 đề xuất *«kho khai danh sách cơ chế đo bị cấm trong `config.yaml` để lint thành luật»*, tức **chính mô hình `contracts`** của kho này. |

Nói gọn: nó **không cứu được vòng đã vấp**. Nó cắt lớp lỗi mà vòng ấy chưa kịp gặp vì mắt người và
hội đồng đang bận chỗ khác — lớp **trôi khỏi hệ thiết kế** ở mục 3/D4. Đó là lợi ích thật, nhưng nó
là lợi ích **phòng**, không phải **chữa**, và North Star đòi khai đúng như vậy.

Thêm một giới hạn của chính nó, họ khai và tôi xác nhận từ `how-it-works.md`: `eslint-disable` vẫn
vòng qua được; token `@theme` mới **được cho phép theo thiết kế**; selector cha
(`[&_button]:bg-primary`) không truy được xuống con; class truyền qua **import** không lần được (chỉ
trong cùng file, một bước). Và câu họ tự viết: *«một kết quả lint sạch không có nghĩa mọi đường style
đã được kiểm»*, *«lint xanh không phải là duyệt thiết kế»*.

---

## 6. Kho tiêu thụ — đo tại chỗ 22/09

Yêu cầu: Tailwind **v4** + ESLint ≥ 9.30 **hoặc** Oxlint ≥ 1.80.

| Kho | Tailwind | `components.json` | Linter hiện có | Phán quyết |
|---|---|---|---|---|
| **crm** | v4 ở `packages/ui` **và** `apps/app` | **hai bản** (`apps/app`, `packages/ui`) | **oxlint 1.78.0** ở gốc, `turbo run lint` | **Hợp nhất.** Đúng hình monorepo mà README có mục riêng. Giá: **một lần nâng 1.78 → ≥1.80** + ~10 dòng cấu hình. |
| **radar** / `radar-nen-shadcn` | v4.3.3, `shadcn` 4.19 | có | **KHÔNG CÓ** — xem dưới | Hợp; trả hai lần giá trị (nó đang không có lint mã nguồn nào). |
| **oneflow** | v4 | có | **biome** (chỉ format), không eslint/oxlint | Hợp nhưng **đắt hơn**: phải thêm eslint hoặc oxlint cạnh biome. |
| **media-library** | không (api · console · mcp, không Tailwind) | không | — | **Không hợp.** |

**Một phát hiện phụ, kiểm được ngay:** `radar/package.json` khai `"lint": "eslint ."`, nhưng `eslint`
**không phải dependency** và **không có file cấu hình nào**. Chạy thật:

```
> radar-prototype@0.0.0 lint
> eslint .
sh: eslint: command not found
```

Tức là **lệnh lint của radar là lệnh chết**. Sàn UI của radar hôm nay chỉ có `design:gate` (heuristic
trên DOM, và chính file ấy ghi rằng chế độ `dom` của bộ dò kit *«âm thầm bỏ stylesheet rồi chấm tương
phản trên trang không có CSS và trả PASS»*), `tests/tokens.test.ts`, và hội đồng S4. Đây là một lớp
lỗi kit đã có tên: **lệnh tự xưng mà chưa từng chạy**.

---

## 7. Ô mở / chỗ cắt

Không mục nào dưới đây là ô. Neo ngoài của chúng đều nằm ở kho tiêu thụ hoặc chưa có.

- **Có neo, rẻ nhất:** `crm` — nâng oxlint lên ≥ 1.80, bật `no-restyle` ở mức `warn` với
  `--max-warnings <số đo được>`, cắm vào `executors.script`. Một PR ở kho tiêu thụ, đúng lối «vòng
  sản phẩm» mà `o-chi-mo-neo-ngoai` đã hẹn.
- **Có neo, một dòng:** `radar` — lệnh `lint` chết cần được gỡ hoặc dựng thật. Không cần
  `@shadcn/lint` để sửa; nhưng nếu dựng thì dựng luôn cả hai.
- **Hạt giống D1** — tách phần **có gu** của `design-scan` sang luật kho tự khai, giữ phần **sàn tiếp
  cận** ở engine. Chưa có neo ngoài; ngưỡng mở: ≥1 kho khai rằng một luật thẩm mỹ của kit chặn nhầm
  brand của nó.
- **Hạt giống D2** — nếp «thông điệp CHẶN phải gọi tên lối đúng rút từ cây đang chạy». Chưa có neo.
- **Hạt giống D3** — đường nền theo file/theo luật cho chiến dịch ghim lại. Neo gần nhất:
  media-library 2.17.0 (0→9 vi phạm, chặn vì môi trường).
- **Chưa đo:** lớp neutral-task (D4) chưa từng được đo **trên kho của mình**. Con số 14–21 findings
  là của họ, trên dự án của họ. Muốn biết radar/crm trôi bao nhiêu thì phải chạy, không được suy.
