# Bối cảnh trước và sau R — và bằng chứng kit chưa được thiết kế cho repo có sẵn

> Owner hỏi 17/09, sau khi bốn chip xong và nhân chứng độc lập đọc số R1: *đào lại
> bối cảnh trước khi thực hiện R để có cái nhìn trọn vẹn*, rồi: *tìm bổ sung bối cảnh
> «kit không được thiết kế cho dự án brownfield», bằng chứng là gặp rất nhiều vấn đề ở
> crm-onehub.* Mọi số đọc từ git của sáu repo tiêu thụ, hồ sơ `_acceptance/`, sổ nhớ
> phiên, và bốn tệp nguồn của R. Số nào là đếm tay thì ghi rõ. Ba câu chỉ owner trả lời
> ở §6, để trống.

## 0. Một đoạn

R (16/09) sinh ra từ ba cửa sổ đo thước bằng thước: 412 M token vào kit, 0 vòng sản
phẩm, lượt gọi người 4 · 5 · 5 trên trần 3, router trượt hai lần. R đặt một phép thử —
một vòng sản phẩm thật — và một công thức chọn vòng meta kế theo dòng 4b. R1 đã chạy:
tính năng tới tay người dùng, tìm-lỗi rơi về 9,5 % (spec hứa 46 %), **nhưng** vòng vẫn
tốn 142 M, 2/3 lượt chấm bị hạ tầng chặn, và lượt gọi người 7 + 1 với bốn câu hạ tầng
— tức R đã trả lời câu của nó và lộ ra câu mới: chi phí không còn ở tìm-lỗi mà ở làn
`ui` và ở tường hạ tầng. Song song, crm-onehub cho một bằng chứng khác hẳn năm repo
còn lại: **21/37 vòng phải tự dựng giàn đo riêng, 30 548 dòng `rang/`, 51 % commit là
hạ tầng đo, 24/50 PR về đo** — trong khi cả năm repo kia có **0 dòng `rang/`**. Kit
được viết với giả định máy dựng vật cùng đường đo của nó; trên một app người khác
viết, có máy trạng thái người dùng (đăng nhập · onboarding · SSO · DB nhiều workspace),
giả định đó không còn, và chi phí «đứng vào chỗ đo» rơi vào từng vòng.

## 1. Dòng thời gian — R sinh ra từ đâu

| Ngày | Việc | Hệ quả |
|---|---|---|
| 07/09 | Handoff đổi máy: hàng đợi meta **một vòng mỗi cửa sổ** — 2.10 Đường lùi · 2.11 `vong-la-mot-ket-qua` · 2.12 H2 · 2.13 **H1 lát A+B**. Owner nới luật «chỉ TRỪ» | hàng đợi có thứ tự, «đảo được rẻ» |
| 13/09 | Owner đồng ý **router** («repo khai, kit kiểm»), đổi hàng đợi: router vào 2.12→2.13 | router chen trước lát A |
| 14/09 | Owner gọi tên **vòng token** `khoi-tim-loi-tra-phi-theo-vat` cho 2.12→2.13 (hoá đơn 2.12: 212,3 M) | router lùi 2.13→2.14 — trượt lần 1 |
| 15/09 | Mốc 2.14.0: cửa sổ 2.13→2.14 có **hai** vòng meta (vượt luật b), ≈199,9 M token, lượt gọi người 5 · 5 (trần 3), hạ tầng đốt 2/6 lượt chấm, tìm-lỗi 75,4 % (spec hứa 46 %), **0 vòng sản phẩm trên kit ≥ 2.12 ở cả bốn repo** | router trượt lần 2; điều kiện thu hồi luật nới nổ hai mốc liền |
| 15/09 | ADR 0017 (giữ nới + giám sát) → **ADR 0018** cùng ngày: CỘNG không cấm, owner phê từng ca, không luật giám sát riêng | hiến pháp hiện hành |
| 16/09 sáng | Rà 28 ô theo hai câu «người dùng kit được gì / mất gì»: bác 6, gộp 9 → 3 | 28 → 15 ô |
| 16/09 | **R**: 0 vòng meta 2.14→2.15 · R1 vòng sản phẩm OneFlow B5 · R2 hai vá T1 trong mốc · R3 không chạy chiến dịch ghim lại · R4 ba ô ngủ. Điều kiện 2.15→2.16 đọc từ R1: **4b > 60 % → vòng token · ≤ 60 % → router** | router trượt lần 3, được hứa lần 3 |
| 16/09 chiều | Truy nguyên phiên «Sửa lỗi tiếng viêt» → ô `thuoc-co-cua` + bốn chip; R1 của R được mở qua chip | ô mới xếp hàng với điều kiện riêng |
| 17/09 | R1 ký Cổng Bằng chứng, PR OneFlow #120 mở; nhân chứng độc lập đọc bốn số; veto một-nguồn lên `main` | lần đầu có số «sau» thật |

Nguồn: `2026-09-07-handoff-doi-may.md` §1.1 §3 · `2026-09-13-khung-quyet-dinh-kien-truc-hai-tang.md` §4 ·
`2026-09-15-dieu-chinh-sau-2-14-token-va-vong-meta.md` · ADR 0017 · ADR 0018 · commit `727efd6a` `af703a8d` ·
`_acceptance/release-2-14-0/contract.md` Notes §1 §4.

## 2. R hỏi gì — R1 trả lời chưa

R có ba chẩn đoán: *kit đo thước bằng thước* · *luật (b) không giữ được khi phiên song
song, không vật máy giữ nào đếm* · *giá trị chạm người dùng = 0 hai cửa sổ*. R1 là phép
thử cho cả ba (nguồn số: `2026-09-17-quan-sat-r1-ba-dinh.md`).

| Câu R hỏi | Số R1 | Đọc |
|---|---|---|
| Nhát cắt token T1–T7 có «ăn» ở kho tiêu thụ? | tìm-lỗi 20,2 → 10,0 → 2,7 %, gộp **9,5 %** | **Ăn, vượt hứa** — nhưng phần lớn vì làn `ui` phình 68 → 91 %; tuyệt đối tìm-lỗi lượt 1 là 8,3 M so 14,5 M ở lượt PASS của 2.14 |
| Vòng sản phẩm có rẻ hơn vòng meta? | S4 **142 M** / 4 lượt · **2/3** lượt BLOCKED vì hạ tầng | **Không** — cùng cỡ vòng meta nặng nhất của 2.14 (146 M); hạ tầng đốt lượt chấm tệ hơn (2/6 → 2/3) |
| Lượt gọi người có về trần? | **7 + 1**, ngoài thiết kế 5, **hạ tầng 4** | **Không** — bốn mốc liền vượt trần: 4 · 5 · 5 · 7; lớp hạ tầng là lớp lớn nhất ở cả crm (4/9) lẫn oneflow (4/8) |
| Giá trị chạm người dùng? | một tính năng ký, PR mở | **Có**, lần đầu sau hai cửa sổ |

Ba điều R không hỏi mà R1 lộ ra: tiền đề bắt tường trước Cổng Phạm vi nhưng kit không
có bước gỡ trước S4 (đốt 40,8 M ở lượt 1) · hook `/goal` chặn lần dừng hợp lệ bảy lần ·
Cổng 1.5 duyệt bằng dán hook hai giây sau khi kế hoạch trình.

## 3. Điều đã đổi so với lúc owner gật R

1. **Công thức «≤ 60 % → router» viết trước khi có hai thứ**: ô `thuoc-co-cua` (16/09
   chiều) và cấu trúc chi phí thật của một vòng sản phẩm. Router được chọn vì «tiền đề
   lát A và cấp vùng vật cho S4» — vùng vật phục vụ khối tìm-lỗi, nay là 2,7–10 %. Cái
   đau đo được của router (phiên start mò 4 lượt đọc) là thật nhưng nhỏ so với 142 M/vòng
   và 4 câu hạ tầng/vòng.
2. **Cửa sổ 2.14→2.15 không còn là «0 meta» theo nghĩa đen.** Trong một ngày có ba việc
   meta đi vào: start-scan (T2, trên nhánh chờ mốc) · răng chụp hồ sơ (T2, đã lên `main`,
   **không hồ sơ riêng**) · veto + một nguồn (lên `main`). Đều được owner gọi tên qua chip,
   đúng ADR 0018 — nhưng đúng hình dạng chẩn đoán #2 của R: mỗi phiên tự thấy mình nhỏ.
   Mốc 2.15.0 phải **đếm chúng** vào năm dòng số.
3. **Ngưỡng mở lại của luật (a) đã chạm.** Luật (a) cấm vòng đo-thước-của-thước; ngưỡng
   mở lại là ≥ 2 lượt chấm sai do phép đo tự dối trên vòng SẢN PHẨM giữa hai mốc. Từ
   2.14.0: `cua-vao` (sàn thiết kế P0 giả trên nền tối · thẻ cổng đếm `expected_exit` thành
   trượt) và R1 (E15 khai `not-run` mà S4 vẫn thi hành → BLOCKED). ≥ 2. Điều này quan
   trọng vì `thuoc-co-cua` ② là một phép đếm trên lớp thước — thứ luật (a) vốn đóng.
4. **Router đã trượt ba cửa sổ.** Nếu 2.15→2.16 lại không phải router, đó là lần thứ tư
   và hàng đợi 07/09 thành lời hứa không ai tin. Giá đó là thật, chỉ owner cân được.

## 4. Kit và repo có sẵn — bằng chứng từ crm-onehub

### 4.1 Giả định thiết kế của kit, đọc từ chính nó

- **Máy dựng vật cùng đường đo.** Vòng lặp: S1 viết hợp đồng + eval, S3 viết code, S4 đo.
  Phản biện gap-probe ở S1 bị cấm đọc code với lý do ghi rõ «code chưa tồn tại»
  (`feature-loop/skills/feature-loop/SKILL.md:123`). Khai sinh phép đo (đối chứng dương +
  phá vật) áp ở S3 (`SKILL.md:178`). Không bước nào hỏi «vật đã có sẵn thì thước đứng
  vào đâu».
- **`acceptance-init` chỉ dò lệnh, không dò trạng thái app.** Nó suy `package.json`, CI,
  dev server, capture — không hỏi cổng chắn (redirect, cờ DB, khoá bắt buộc). Ổ cắm duy
  nhất cho «repo đang có sẵn» là `recheck: warn`, và chú thích của nó nói đúng phạm vi:
  *«only exists so repos ADOPTING the kit with older reports aren't blocked — do not start
  there»* (`commands/acceptance-init.md:54-55`). Kit hiểu «adopt» là *có báo cáo cũ*,
  không phải *có app cũ*.
- **GUIDE nói về «repo cũ» chỉ theo nghĩa nâng phiên bản kit**: «repo mới scaffold sẵn
  mức chặt; repo cũ nâng cấp kit thì các luật mới…» (`GUIDE.md:1124-1125`). Không dòng nào
  về app do người khác viết.
- **Một máy chủ, một cây, một cổng.** `dev_server.url` là một địa chỉ; kit không có khái
  niệm «máy chủ tự xưng cây nó phục vụ», không có đích đo là bản triển khai.

### 4.2 Số — crm-onehub so năm repo tiêu thụ còn lại

Cửa sổ đếm: từ commit đầu tiên có `_acceptance/` tới nhánh gốc, 17/09. «Hạ tầng đo» =
commit có tiền tố `fix|chore|test|docs|feat(acceptance|acceptance-gate|lan-do|kit|ci)`,
`repin`, «ghim lại», «lưới», «vendored» (đếm bằng biểu thức, không đọc tay — sẽ lẫn vài
commit nhưng cùng luật cho sáu repo).

| Repo | Xuất xứ | Commit hạ tầng đo | Hồ sơ tự dựng `rang/` | Dòng `rang/` | Hồ sơ khai giới hạn (luật chặt) |
|---|---|---|---|---|---|
| **crm-onehub** | import `trycompai/crm`, 225 commit trước kit, SaaS nhiều workspace | **433/848 = 51 %** | **21/37** | **30 548** | 6/37 |
| oneflow | fork TongFlow, 194 commit trước kit, công cụ canvas | 581/1058 = 54 % | 0/40 | 0 | 8/40 |
| artifact-platform | code của owner, 675 commit trước kit | 617/2394 = 25 % | 0/192 | 0 | 1/192 |
| media-library | dựng cùng kit | 60/437 = 13 % | 0/23 | 0 | 8/23 |
| mapposter | dựng cùng kit | 68/341 = 19 % | 0/15 | 0 | 1/15 |
| floorplanstudio | dựng cùng kit | 70/242 = 28 % | 0/5 | 0 | 0/5 |

Ba cột đầu nói cùng một điều theo ba cách: ở crm, **hơn nửa số vòng phải tự dựng đường
vào app** — và giàn đó sống theo hồ sơ nên vứt sau vòng. Không repo nào khác có một
dòng `rang/`. Oneflow cũng là fork và cũng 54 % commit hạ tầng, nhưng **0 `rang/`**: phần
hạ tầng của nó là ghim lại, lớp vendored, CI — tức nợ *quản lý hồ sơ*, không phải tường
*đứng vào app*. Cột cuối (khai giới hạn) không tách được hai nhóm — media-library dựng
cùng kit vẫn 8/23 — nên «tường» không tương quan với xuất xứ nói chung; nó tương quan
với **app có máy trạng thái người dùng mà máy không viết**, và crm là ca đó.

Ba nguồn khác cùng chiều:

| Nguồn | crm-onehub | Đối chứng |
|---|---|---|
| PR trên GitHub (50 PR) | **24/50** về hạ tầng đo/kit (`fix(acceptance)`, `repin`, `chore(acceptance-gate)`, `lan-do`, `be-rong-do`, `ve-that`, DB riêng mỗi lượt…) | — |
| Sổ quyết định (702 dòng, 37 hồ sơ) — lớp vướng | DB/seed/`dev:session` **15 hồ sơ** · onboarding/cổng chắn **12** · máy chủ/cây/cổng **11** · SSO/Google/khoá **6** · bản rẽ/hãng **5** | — |
| Sổ nhớ phiên (`memory/MEMORY.md`) | 16 mục, ≥ 9 về đo: *đo trong cây chung là đo bẩn* · *cổng 3000/3001 bị worktree khác chiếm* · *phép đo tự ghi đè hồ sơ vòng khác, cuốn 477 dòng đã ký* · *răng chạy song song chết vì chỉ mục git chung* · *cây sao phải mang đột biến ở packages* · *hai lệnh cổng đua nhau* · *phép đo xanh chưa chắc đo đúng* · *ba cửa đăng nhập prod* · *chan-lai chưa ghim lại* | media-library 12 mục, ~4 về kit (bộ soạn báo cáo rơi tiền tố · thước viết sau code · hồ sơ đã ký thối im · id sổ trùng) — lỗi *của kit*, không phải tường *vào app*; oneflow và artifact-platform: 0 mục |
| Phiên hai tuần qua (đếm tay từ danh sách phiên) | ≈ 13/22 phiên là hạ tầng/đo (sửa job Acceptance đỏ mọi PR · DB riêng mỗi lượt · đồng bộ/pull ×3 · ve-that ×2 · be-rong-do · vendored 2.14 · login Google · «Sửa lỗi tiếng viêt») | media-library ≈ 4/24 |

### 4.3 Hình dạng cụ thể của tường ở crm

1. **Máy trạng thái người dùng chặn mọi màn.** Middleware có hai cổng onboarding
   (`onboardedAt`, `settings.researchKey`); thiếu một là mọi `/settings/**` trả 307. SSO
   phải có nhà cung cấp mới hiện nút; Google/Microsoft cần khoá thật và kho cấm đúc
   khoá giả. Hệ quả: 12 hồ sơ vướng onboarding, 6 vướng SSO/khoá; vòng `cua-vao` bị xếp
   lại 06/09 vì «thước không đứng được» bị đọc thành «sản phẩm sai».
2. **Repo phải tự mọc tầng đường đo.** `scripts/lan-do/` (tiền đề đặt-trước-dọn-sau, kho
   nháp dựng lại trước mỗi hồ sơ, trạng thái rỗng) mọc 13/09 — sau 40 hồ sơ, không do kit
   dạy. Commit `c1f2dea`: phải *dời nó ra khỏi `_acceptance/`* vì kit đếm thư mục làn đo
   như một hồ sơ. Tức kit không có chỗ cho thứ này.
3. **Một máy, nhiều cây, một khoá dev.** Next 16 chỉ cho một bản dev; ba worktree tranh
   3000/3001; hai lần trong một phiên máy chủ phục vụ *cây khác* mà hàng rào
   `chotMayChu()` so một chuỗi giống hệt ở mọi cây (PR #36 «be-rong-do buộc tội oan»).
   Cây chính phải mở cổng riêng 3500/3501.
4. **Phép đo của hồ sơ này ghi đè hồ sơ khác.** `ve-that.json` của vòng đã ký bị ghi lại
   ở mọi lượt chấm, ở cả ba worktree; khôi phục tay ba lần một phiên (PR #50, răng kit
   `fc1f0f22`).
5. **Bản rẽ của hãng.** Nhánh mặc định là `onehub`, `release` là gương hãng, `main` không
   tồn tại; CI hãng tách CI công ty; «phí bản rẽ là chi phí dài hạn lớn nhất» (CLAUDE.md
   của crm). Kit đọc «nhánh gốc» theo lệ `main` ở nhiều chỗ — thẻ hỏi «sao repo này đặt
   onehub» đã tốn một lượt.
6. **Lớp vendored trôi 2.9 → 2.14** (PR #47, chín mục INIT-CI-COPY-LIST), kéo theo hai
   chiến dịch ghim lại và CI `Acceptance` đỏ trên nhánh gốc từ `d2e6f0f` tới nay.
7. **Lệ đẩy thẳng lên nhánh gốc** đưa hồ sơ dở lên `onehub`, lưới chặn việc đã ký của người
   khác → «xếp lại» bằng cách nói dối `status: approved` — kit không có `park` cho vòng.

### 4.4 Kết luận chính xác

Câu «kit không được thiết kế cho brownfield» đúng ở dạng hẹp hơn và mạnh hơn: **kit
được thiết kế cho vật do máy dựng cùng đường đo**; khi vật là một app có sẵn với máy
trạng thái người dùng mà máy không viết — brownfield SaaS là ca điển hình — chi phí
«đứng vào chỗ đo» rơi vào từng vòng, không có tầng nào của kit nhận nó, và repo phải
tự mọc tầng đó (crm đã mọc, sau 40 hồ sơ). Oneflow cho thấy fork *không* tự động sinh
tường này; media-library cho thấy repo dựng cùng kit vẫn khai giới hạn nhiều nhưng
**không phải dựng giàn**. Số là của MỘT repo cho ca cực đoan (n = 1), nên đây là bằng
chứng cho *hình dạng*, chưa phải cho *tỉ lệ*.

## 5. Điều này nói gì cho 2.15 → 2.16

- Củng cố nhát ① của `thuoc-co-cua` (tiền đề tách khỏi tiêu chí, dry-run trước Cổng
  Phạm vi) **kèm bước gỡ tường trước khi mời chấm** — R1 chứng minh bắt được tường mà
  không gỡ thì vẫn đốt một lượt.
- Đưa nhát ④ (khuôn đường đo cấp repo — `--chay`, mã 2 khi hỏng tiền đề, đặt/trả, DB
  của lượt, máy chủ tự xưng cây + SHA) từ «có thể sau» lên «có bằng chứng cần»: crm đã
  mọc đúng khuôn này bằng tay; kit chỉ cần đặt tên và chỗ cắm, code thuộc repo.
- Đích đo là bản triển khai vẫn hoãn có tên: crm có Preview mỗi PR trên Vercel cho ba
  app, SHA đọc được qua API — chỗ cắt cho cửa sổ sau nữa.
- Router vẫn đáng làm, nhưng cái đau nó chữa (phiên start mò tài liệu) không phải cái
  đau đo được lớn nhất ở cả hai vòng sản phẩm gần nhất.

## 6. Ba câu chỉ owner trả lời — ở mốc 2.15.0

1. Cửa sổ 2.15→2.16: `thuoc-co-cua` thu hẹp (① + gỡ tường + ② + khuôn ④) · router theo
   công thức R · hay không cái nào và nhắm thẳng làn `ui`?
2. Ba việc meta đã vào cửa sổ 2.14→2.15 (start-scan · răng chụp hồ sơ · veto một nguồn)
   — đếm là «vá-trong-mốc» hay «vòng meta thứ nhất» của cửa sổ?
3. Router trượt lần thứ tư có chấp nhận được không; nếu có, ghi gì vào hàng đợi để nó
   không phải lời hứa suông?

**Owner trả lời 17/09: đồng ý cả bốn** (ba câu trên + «cắt 2.15.0 ngay»). Hệ quả máy dịch:

- **Q1 — vòng meta 2.15 → 2.16 là `thuoc-co-cua` thu hẹp**: ① tiền đề tách khỏi tiêu chí,
  dry-run trước Cổng Phạm vi, **kèm bước gỡ tường trước khi mời chấm** · ② cửa cho thước
  (sổ gắn đích `thuoc|vat|ho-so` suy từ đường dẫn · một dòng đếm vật/thước/nhát trong gói
  Cổng Bằng chứng · trần gộp nhát sửa thước ở `implemented` → ba lối, lối «mở vòng có chủ
  ngữ là thước» là một lệnh) · ④ khuôn đường đo cấp repo (`--chay` · mã 2 khi hỏng tiền đề
  · đặt/trả · DB của lượt · máy chủ tự xưng cây + SHA; code thuộc repo). Không router,
  không vòng token. Chỗ cắt gọi tên cho cửa sổ sau: **làn `ui`**.
- **Q2 — ba việc meta đã vào cửa sổ 2.14 → 2.15 đếm là vá-trong-mốc, đếm đủ**: hồ sơ mốc
  2.15.0 mang tiêu chí cho cả ba (start-scan · răng chụp hồ sơ · veto một nguồn), dòng 4
  cộng token các phiên chip hoặc ghi «không đo được», và **hạt giống «vòng meta đang mở:
  N» trên thẻ start thành việc của mốc** — vật máy giữ cho luật (b).
- **Q3 — router trượt lần thứ tư: chấp nhận**; bỏ công thức 4b (đã trả lời xong); hồ sơ
  mốc ghi *router là vòng meta mặc định của 2.16 → 2.17, chỉ lùi nếu vòng sản phẩm kế cho
  số khác*.
- **Cắt 2.15.0 ngay.** Việc sản phẩm chạy song song, không chờ mốc: merge OneFlow #120
  với hai vi phạm nợ cũ bỏ qua có ghi nhận · `normalize-text-vi` nghỉ hẳn · hai chiến
  dịch ghim lại (oneflow: 2 hồ sơ + `UV_PYTHON`; crm #47: 2 hồ sơ + `.acceptance-runs/`).

**Bổ sung 17/09 (owner phê, sau khi hỏi «bài học hạ tầng của oneflow đã vào kế hoạch
chưa»):** bốn lớp hạ tầng — A công cụ/môi trường trước S4 (đã ở ①) · B máy chủ/cây/DB
(đã ở ④) · **C tranh tài nguyên khi S4 chạy song song** (mới chỉ ghi nhận) · **D hook
`/goal` chặn lần dừng hợp lệ** (chưa có chỗ). Quyết: C vào ④ thành «tài nguyên của
lượt» (ô `thuoc-co-cua`, mục thước đo thành công); D thành vá-trong-mốc 2.15.0 (sửa
`GOAL-TEMPLATE`, đã nhắn phiên cắt mốc).

**Bổ sung thứ hai 17/09 (owner gật lượt rà 23 lớp hạ tầng —
`2026-09-17-ra-ha-tang-23-lop.md`):** kit hôm nay chỉ kiểm phụ thuộc cài đặt trước khi
chạy, không kiểm hạ tầng đo; 23 lớp đã gặp thì 4 đã có nhát chữa, 6 một nửa, 12 chưa có
chỗ nào. Vòng `thuoc-co-cua` gom về hai câu + một cửa (*đứng được trước khi chấm* — lõi là
«đường nền hạ tầng ở S1», máy chạy, không LLM · *chạy không đè nhau* · cửa cho thước); ba lỗi
đúng/sai nhỏ (S4 nghe `not-run` · thẻ cổng đếm `expected_exit` · `bo-qua-phai-thay`) là nhát
mở đầu cửa sổ kế vì mốc 2.15.0 đã qua Cổng Phạm vi khi lời phê tới; phần còn lại gọi tên ở
§4 hồ sơ mốc.

Trước khi mở chip, owner hỏi thêm: *người dùng kit được gì sau vòng meta này?* — trả lời
ở `_acceptance/thuoc-co-cua/opportunity.md` mục «Vấn đề & ai gặp» và trong hồ sơ Cổng Đáng
của vòng, bằng số của R1 và crm-onehub (§4 trên).

## 7. Nguồn

`docs/findings/2026-09-15-dieu-chinh-sau-2-14-token-va-vong-meta.md` · `2026-09-13-khung-quyet-dinh-kien-truc-hai-tang.md` ·
`2026-09-07-tong-hop-hat-giong-va-o.md` §3 · `docs/handoff/2026-09-07-handoff-doi-may.md` §1.1 · `docs/adr/0017` `0018` ·
`_acceptance/release-2-14-0/contract.md` Notes §1 §4 · `docs/superpowers/specs/2026-09-14-khoi-tim-loi-tra-phi-theo-vat-design.md` ·
`2026-09-16-truy-nguyen-thuoc-khong-co-cua.md` · `2026-09-17-quan-sat-r1-ba-dinh.md` · `_acceptance/thuoc-co-cua/opportunity.md` ·
crm-onehub: `CLAUDE.md`, `_acceptance/*/decisions.jsonl`, `scripts/lan-do/`, PR #7 #20 #23 #28 #32 #34 #35 #36 #39 #45 #47 #50,
sổ nhớ phiên `~/.claude/projects/-Users-manhphan-dev-crm-onehub/memory/MEMORY.md` · lệnh đếm: xem lịch sử phiên truy nguyên 17/09.
