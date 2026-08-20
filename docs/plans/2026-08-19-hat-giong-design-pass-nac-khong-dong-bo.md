# Hạt giống — design-pass nấc không đồng bộ + bước phân kỳ bằng canvas

**Ngày:** 2026-08-19 · **Trạng thái:** hạt giống, chờ ván thử b1 xong mới mở
Cổng 1 cho kit · **Hạng dự kiến:** T2 (đổi lời một skill + docs; không chạm
lưới, phép đo, workflow).
**Sinh từ:** phiên phân tích 19/08 (kiểm chứng kit 2.2 trên hồ sơ
`trang-tu-van-v2-r4-b1` của Artifact Platform) + phiên điều tra «skill
`create-onehub-plugin` của ai, vai gì trong kit».

> Chữ trong file này là NGUỒN. Bảy hình phác trong phiên (mục 8) là chiếu; H4
> đã vẽ tầng 2 ngày 20/08 (cùng commit với mục 3b), H5 nâng sau khi ván thử b1
> chốt.

## 0. Tóm tắt một đoạn

Lớp thiết kế của vòng lặp đang trượt ở **nấc mặc định**, không phải ở công cụ:
`design-pass` (S1-D) đòi owner ngồi xem đồng bộ 30–60 phút, đắt tới mức hồ sơ
b1 **bỏ luôn nghi thức** (entry descope có tên) — một nghi thức bị bỏ khi người
ta thành thật là mặc định sai. Đồng thời vòng lặp **thiếu bước phân kỳ rẻ**:
với bề mặt mới, «hướng» (phiếu khuyên đứng đâu, đèn ba màu nói gì) đang được
máy quyết bằng chữ trong design-doc, trong khi chỉ owner biết «đúng». Đề xuất:
**một nghi thức, đổi nấc mặc định sang không đồng bộ (đồng bộ là opt-in có
tên), thêm bước phân kỳ có điều kiện bằng canvas `/design`** (vật dựng có tên
trong thang, không bao giờ vào chuỗi bằng chứng), **+0 skill ở kit**; repo tiêu
thụ xếp kho `interactive-prototype`. Ván thử chạy TRƯỚC trên b1 dưới dạng lệch
có tên; kit đổi SAU, lấy b1 làm bằng chứng.

## 1. Ý định và mục tiêu đo được (đã đóng khung với owner 19/08)

**Ý định:** thu gọn lớp thiết kế — bớt skill/nghi thức phải nuôi ở tầng kit và
tầng repo — mà vẫn giữ nguyên hai thứ kit tồn tại vì nó: bằng chứng không tự
dối (thứ S4 đo được) và người chỉ xuất hiện ở khoảnh khắc quyết thật, rẻ về tần
suất. `/design` (Claude Design chạy trong Claude Code) là ứng viên vì nằm sẵn,
không cần kit nuôi.

**Mục tiêu đo được cho một bề mặt UI mới, từ ý tưởng đến Cổng 1:**
1. số lần gọi người và **hình thức** gọi (đồng bộ / không);
2. số bề mặt phải giữ đồng bộ với code (đích: 1);
3. số skill thiết kế phải nuôi ở kit và ở repo tiêu thụ;
4. thứ S4 đo được **không giảm**.

**Ranh giới:** kit là engine — không mang product-context của OneHub vào kit;
«chỉ TRỪ không CỘNG»; đổi nghi thức thì đường cũ vẫn đọc được (đọc-cũ + cờ vàng).

**Bốn câu owner đã chốt (19/08):**

| Câu | Chốt |
|---|---|
| Phạm vi | **Kit + thử trên b1** — nguyên tắc đặt ở kit, b1 là ván thử đầu, repo tiêu thụ xếp kho theo sau |
| Phiên đồng bộ còn chấp nhận? | **Mặc định không đồng bộ, đồng bộ opt-in** — chỉ khi tương tác là thứ cần duyệt và người chủ động gọi |
| Đội có designer chuyên trách? | **Không** — owner/PM là người phản ứng; gu nằm ở luật DS đã viết |
| Mức thu gọn | **Kit giữ 1 nghi thức mỏng + 1 sàn** (design-pass + ux-ui-craft); cắt vật dựng trùng ở repo |

Và Q1 (`/design` đứng đâu): **B · Ghép** — canvas quyết hướng, ruột tạm thật để đo.

## 2. Kiểm bằng first principles từ North Star

| Nguyên tố | Với UI nghĩa là | Hiện trạng | Kết |
|---|---|---|---|
| ① Ý định chốt trước khi làm | Hướng của bề mặt mới phải chốt **bằng mắt, trước code, rẻ** — chỉ owner biết «đúng» | Hướng nằm trong design-doc bằng chữ; design-pass là hội tụ, không có bước phân kỳ | **Thiếu** — lỗ mà canvas lấp |
| ② Bằng chứng không tự dối | Mọi «xanh» đo trên DOM thật; ảnh trình người chụp từ vật thật | ui-check · gate P0 · phòng trưng bày component thật · AC-15 ảnh thật | **Đạt** — không đụng |
| ③ Khoảnh khắc quyết thật, đảo rẻ | Người ở chỗ có đánh-đổi (chọn hướng) hoặc khó-đảo (Cổng 1); còn lại máy đi trước, người veto | design-pass đòi đồng bộ 30–60' → b1 bỏ nghi thức | **Trượt** — nghi thức đúng, nấc sai |

Ba giả định dễ tự lừa đã kiểm:
- *Ruột tạm trước Cổng 1 là trạm thu phí?* — Không thêm lần gọi người; không
  phí (chính component S3 phải dựng; ô phòng trưng bày = ảnh AC-15 + đích
  ui-check). Nó chỉ đổi thứ tự để Cổng 1 duyệt trên ảnh thật thay vì chữ. Là
  bước máy, không phải cổng.
- *Gộp chọn-hướng và Cổng 1 vào một tin?* — Không. Khuôn nhiều-chỗ-trống vẫn là
  nhiều quyết định (owner 11–12/08). Hai chấm, mỗi chấm một việc, cả hai không
  đồng bộ.
- *Canvas cho mọi bề mặt UI?* — Không. Dùng lại **rule đáng-log** của sổ quyết
  định: chỉ khi tồn tại ≥2 hướng khả dĩ mà máy không tự chắc. Bề mặt đi theo
  khuôn có sẵn (pattern của khuôn plugin) → không hình, không hỏi. Thiếu
  `/design` (đội viên không có quyền) → máy khuyên một hướng kèm căn cứ, ghi
  entry, đi tiếp, người veto — đảo rẻ nên veto-default.

## 3. Nghi thức sau khi đổi (đề xuất cho kit — TRỪ/CỘNG minh bạch)

**Giữ nguyên:** vai S1-D trước Cổng 1 · luật cứng (không hex mới, không webfont,
không sửa component nền, không logic/đường ghi) · thang vật liệu
(`real-components`/`scaffold`/`static`) · nấc ngữ cảnh · khuôn
`DESIGN-PASS-NOTE-TEMPLATE` · Nhóm 1/Nhóm 2 · `ux-ui-craft` làm sàn.

**Đổi (trong `skills/design-pass/SKILL.md`):**
1. **Nấc phản ứng mặc định = không đồng bộ.** Máy dựng ruột tạm bằng component
   thật, tự chụp ma trận state × 375/1280 (dùng `capture` của repo nếu có), gửi
   gói; người mở lúc rảnh, trả một chạm / một câu; máy làm vòng kế khi người
   rảnh. **Đồng bộ là opt-in có tên**: khi tương tác là thứ cần duyệt (kéo-thả,
   chạm) và người chủ động gọi. Câu «phiên đòi owner ngồi xem trực tiếp; owner
   async chưa nằm trong phạm vi» bị gỡ. Khoá mới trong ghi vết: `reaction:
   async|sync`.
2. **Bước phân kỳ có điều kiện, trước vòng phản ứng.** Máy kê từ design-doc: có
   ≥2 hướng khả dĩ (rule đáng-log) → dựng canvas `/design` 2–3 hướng thật sự
   khác nhau (token/component thật của repo; ≤8 artboard; tương tác bấm được
   nếu cần), người chọn một chạm; hướng chọn ghi **một dòng chữ** vào design-doc
   + entry `approach` trong sổ; canvas là phác tầng 1 — **không vào
   `evidence/`, không vào thẻ như bằng chứng**, chỉ link tham chiếu. Thiếu
   `/design` → xuống thang 4 nấc (mục 3b.4). Không có hướng mở → đi thẳng,
   nhưng ĐỂ VẾT MỘT DÒNG trong `design-pass.md` («không mở bước phân kỳ —
   <khuôn/lý do 1 dòng>») cho thẻ Cổng 1 hiện — người veto được, máy không
   hỏi (sửa 20/08, căn cứ ở mục 3b.3; bản 19/08 viết «không ghi gì» — đó là
   đúng cửa miễn huashu đã phải đóng).
3. **Thẻ Cổng 1** hiện nấc phản ứng + link canvas (nếu có) cạnh nấc vật liệu /
   ngữ cảnh. Đường đọc-cũ: `design-pass.md` thiếu khoá `reaction:` → cờ vàng,
   không chặn, không bắt migrate.

**Không làm:** không tạo skill mới · không để kit phụ thuộc `/design` (preview,
cần quyền tổ chức) · không đưa canvas vào chuỗi bằng chứng · không gộp hai chấm
người · không đổi lưới/phép đo/workflow.

**Repo tiêu thụ (Artifact Platform), sau khi kit đổi:** xếp kho
`interactive-prototype` + đường design repo `frames/` (bước cuối `/design-mockup`
→ `provenance.json` đã chết theo kit 2.2; canvas làm việc của nó tốt hơn); giữ
`create-onehub-plugin` (khuôn) và `onehub-design-system` (luật DS).

**Docs kèm:** vá lỗ GUIDE thiếu dòng `design_pass.ds_skill`; template
`acceptance-init` gợi ý hai khoá `feature_loop.ui_standards_skill` và
`design_pass.ds_skill` (phiên điều tra 19/08 tìm ra).

## 3b. Vay từ ngoài (bổ sung 20/08 — teardown huashu-design + đọc toàn văn `/design`)

Ba nguồn độc lập hội tụ về cùng thiết kế của mục 3 — owner 16/08 («lần tường
minh nhất duyệt với kit là khi có diagram»), huashu-design (luật «chọn khi chưa
thấy vật là chọn vô hiệu», hard-gate từ 07/2026), và kỷ luật NỘI TẠI của skill
`/design` (tự cấm bày menu chữ, tự đòi 2–4 hướng thật khác nhau). Năm điều vay,
tất cả là LỜI trong nghi thức, +0 vật nuôi:

1. **Luật artboard phương án**: mỗi hướng một TRỤC có tên + 1 câu động cơ +
   1 câu đánh đổi — kể cả hướng máy KHÔNG khuyên (bộ phương án chỉ biện hộ cho
   ứng viên máy thích là phiếu bầu gài sẵn — đúng lớp mồi-dán-đồng-ý, chip ②);
   tên A/B/C ổn định vĩnh viễn, không đánh số lại giữa các lượt; hướng đã chốt
   không hỏi lại.
2. **Độ nét = đủ cho quyết định đang mở** (decision fidelity ≠ deliverable
   fidelity): phác thấp hợp lệ; token/component thật chỉ bắt buộc khi token là
   NỘI DUNG của quyết định (như b1: màu/vị trí chính là thứ đang chọn).
3. **Bỏ-phân-kỳ phải để vết** (đã sửa vào mục 3.2): không còn nhánh «không ghi
   gì». Căn cứ: huashu từng có cửa miễn «đã có design context rõ» → máy lạm
   dụng có hệ thống («user nói rõ rồi» → tự chọn hướng) → 07/18 họ đóng cửa
   miễn, mọi ngoại lệ phải ghi nguyên văn. Kit KHÔNG cần hard-gate 100% của họ
   (có veto-default + đảo rẻ), nhưng cần vết một dòng để Cổng 1 nhìn thấy.
4. **Thang `/design` 4 nấc** (thay «có/không» nhị phân ở mục 3.2): publish +
   save được → publish chỉ-xem (export PNG/PDF) → **file đã seed mở LOCAL
   trong Browser pane** (quyền tổ chức chỉ gác LƯU online, không gác
   dựng-và-xem — đội viên không quyền artifact vẫn có canvas) → không canvas
   → máy khuyên 1 hướng kèm căn cứ, ghi entry, đi tiếp.
5. **Kênh phản ứng async có tên** (cụ thể hoá «gửi gói, người trả một chạm» ở
   mục 3.1): (a) sticky note ghim câu hỏi đóng + động cơ/đánh đổi cạnh từng
   artboard — câu hỏi đi cùng vật, không nằm trong chat; (b) comment thread
   trên artifact — máy đọc lại, trả lời, resolve từng thread; (c) owner sửa
   trực tiếp rồi Save → máy extract và DIFF với bản seed — phản ứng thẩm mỹ
   thành diff máy đọc được. Kèm một câu chép nguyên từ huashu: **«tiếp» cho
   phép SANG bước sau, không cho phép BỎ cổng bên trong bước.**

Đề bài b1 (mục 4.2) KHÔNG đổi — đã tương thích cả 5 điều; chỉ được hưởng kênh
(5) nếu tiện. Nguồn đọc sâu: sổ nhớ phiên 20/08 (teardown huashu-design + đọc
toàn văn skill `/design` preview).

## 4. Ván thử b1 — chạy TRƯỚC, dưới dạng lệch có tên

Không đổi engine dưới chân vòng đang chạy: b1 chạy trên kit 2.2.0, nghi thức
mới được thực hiện như **lệch có tên** trong sổ quyết định của b1. Kit chỉ đổi
sau khi b1 cho bốn con số.

### 4.1 Phiên r4 vào lại ở đâu

Phiên `Chạy bước 1 «vũ khí để khuyên» (r4)` đang **đứng ở Cổng 1** (contract
`draft`, commit `6f7b8c6f1` trên `claude/dreamy-burnell-b3b8fb`, chưa push).
Nó **không** quay lại đầu S1 và **không** đổi `status`; nó quay lại **cuối S1 —
nghi thức S1-D** rồi **trình lại Cổng 1**:

1. Sổ quyết định: entry mới `supersedes` entry `bỏ design-pass — máy chạy tự
   trị…` (d-20260818T144534Z-14963), `type: approach`, nội dung «chạy
   design-pass nấc không đồng bộ + bước phân kỳ bằng canvas — lệch có tên so với
   skill 2.2.0 (đòi đồng bộ); lý do: ván thử cho hạt giống kit 19/08».
2. Bước phân kỳ (canvas) → owner chọn.
3. Ruột tạm component thật + máy chụp → `design-pass.md`.
4. Vá design-doc/evals đúng phần đổi theo hướng đã chọn (nếu có).
5. Render lại thẻ Cổng 1 (figures dùng lại, không vẽ lại) → mời cổng, một câu
   hỏi đóng.

### 4.2 Đề bài gửi phiên r4 (dán nguyên khối)

```
Quay lại CUỐI S1 (nghi thức S1-D) của hồ sơ trang-tu-van-v2-r4-b1 rồi trình lại
Cổng 1. Không đổi status (vẫn draft), không quay lại đầu S1, không đụng bước 0.

Bối cảnh: owner chốt 19/08 chạy design-pass theo nghi thức MỚI (hạt giống kit
docs/plans/2026-08-19-hat-giong-design-pass-nac-khong-dong-bo.md của repo
acceptance-gate-kit) dưới dạng LỆCH CÓ TÊN so với skill design-pass 2.2.0. Nguồn
chữ là file đó; nếu tin này và file lệch nhau, file thắng.

Việc 1 — Sổ quyết định: append entry type:approach, stage:S1, supersedes:
"d-20260818T144534Z-14963", decision bắt đầu đúng chuỗi «chạy design-pass nấc
không đồng bộ + bước phân kỳ bằng canvas — lệch có tên so với skill 2.2.0», impact
nêu: mất cảm giác bấm thật trước Cổng 1 (đồng bộ là opt-in), đổi lại 0 phiên ngồi
xem; hướng chọn trên canvas không phải bằng chứng.

Việc 2 — Bước phân kỳ bằng /design (kỹ năng có sẵn trong Claude Code):
- Đúng HAI quyết định còn mở + một tương tác: (a) phiếu khuyên đứng đâu / hình
  thức nào trong Preview (2–3 hướng thật sự khác nhau, mỗi hướng một artboard,
  tên ổn định A/B/C, mỗi hướng ghi 1 câu động cơ + 1 câu đánh đổi); (b) đèn ba
  màu xanh/đỏ/XÁM «chưa so được» kèm lý do và việc sàn phải làm — 1–2 cách trình;
  (c) PositionTap chạm hai lần bấm được trên ảnh mặt bằng fixture.
- Vật liệu: token/component OneHub thật (đọc onehub-design-system trước), số
  CT5B thật từ fixture; ≤8 artboard, ≤2 trang; không lorem, không hex mới.
- Gửi link + đúng MỘT câu hỏi đóng cho owner: chọn A/B/C (kèm ngả máy khuyên +
  căn cứ 1 dòng). Owner trả lời lúc rảnh. KHÔNG hỏi thêm gì khác trong tin đó.
- /design không chạy được → KHÔNG dừng: máy chọn hướng khuyến nghị + căn cứ, ghi
  entry approach, đi tiếp Việc 3, nói rõ trong tin.
- Hướng đã chọn → ghi MỘT DÒNG chữ vào design-doc (§4.3) + entry approach có
  link canvas. Canvas KHÔNG chép vào evidence/, KHÔNG là bằng chứng.

Việc 3 — Ruột tạm bằng component THẬT (không server bên ngoài, không design repo):
- Tạo view/RecommendSheet.tsx và view/PositionTap.tsx đúng tên đã khai trong
  config (executors.design.*); props = đúng khuôn kết quả khuyên §4.1
  (mode/basis/per_unit/pick/figures) để S3 chỉ thay object mẫu bằng recommend.ts.
- Thêm ô vào StatesGallery (/agent/ds/consult) theo ma trận §5 design-doc:
  khuyên-vay · khuyên-tổng-thấp · vượt-ngân-sách · trung-lập · đợt thiếu phương
  án vay (R2b) · căn hạng 1 thiếu giá (R5b) · đèn xanh/đỏ/xám kèm lý do · vị trí
  có polygon / chưa có + có ảnh (PositionTap) / không ảnh. Mỗi ô data-cell + hỗ
  trợ ?state=; xuất danh sách state một chỗ để chụp và ui-check cùng đọc.
- Số dựng cho ruột tạm: ct5b-golden + computePricing thật; object khuyên dựng tay theo
  R1–R5b; ảnh mặt bằng fixtures/consult/floorplate-b1.png; chạm chỉ đổi state cục
  bộ. Nhãn dùng từ đã có trong CONTEXT.md/GLOSSARY.md (hook vocab-guard).
- KHÔNG chạm: recommend.ts, certify.ts, route POST vị trí, nối Preview/Body/PNG,
  register-*.ts, _generated, contracts, migration.
- Kiểm cổng 3000 trước khi chụp (ps aux | grep "next dev"); máy tự chụp ma trận
  state × 375/1280 bằng capture.ui của repo về evidence/design-pass/.
- Viết design-pass.md đúng khuôn DESIGN-PASS-NOTE-TEMPLATE, thêm khoá
  reaction: async; material: real-components; context: static-frame; kèm ≥1 cảnh
  ngữ-cảnh (ảnh Preview r3 + storyboard gõ tiêu chí → phiếu khuyên → gửi → chạm
  vị trí) HOẶC entry descope đúng khuôn «bỏ cảnh ngữ-cảnh — <lý do>».

Việc 4 — Vá đúng phần đổi theo hướng đã chọn: design-doc §4.3, evals E-states
(danh sách state, selector), config nếu thêm khoá. Không mở rộng phạm vi.

Việc 5 — Trình lại Cổng 1: dùng lại figures/, render thẻ, gói kèm ảnh phòng
trưng bày + link canvas + design-pass.md; một câu hỏi đóng, ngả máy khuyên. Owner
muốn cảm nhận chạm-vị-trí trên bản thật → mời phiên đồng bộ ngắn (opt-in), không
mặc định.

Bốn con số phải ghi vào cuối design-pass.md (khối «Đo cho hạt giống kit»):
(1) số lần gọi owner và phút owner từ S1-D đến Cổng 1, hình thức từng lần;
(2) độ lệch canvas ↔ ruột tạm thật: 1 dòng liệt kê điểm khác;
(3) có gọi phiên đồng bộ không, vì sao;
(4) thời gian từ bắt đầu Việc 2 đến tin mời Cổng 1.

Điều kiện dừng: chỉ dừng chờ người ở hai chấm (chọn hướng · Cổng 1). Chạm t3_paths
hay _generated đổi byte → DỪNG, báo, không nuốt lặng.
```

## 5. Sau ván thử

- b1 qua Cổng 1 (và về sau Cổng 2) → mở hồ sơ kit từ file này: contract cho
  đổi lời `design-pass` (mục 3) + docs; b1 là bằng chứng M1 (bốn con số).
- Hai hình nâng lên tầng hồ sơ bằng `diagram-design`: swimlane trước–sau (H4)
  vào `figures/` của hồ sơ kit; chuỗi bằng chứng «một cây nguồn» (H5) cạnh
  file này trong `docs/plans/assets/`.
- Repo tiêu thụ: xếp kho `interactive-prototype` sau khi kit phát hành.

## 6. Hồ sơ vấp ghi lại (để hồ sơ kit khỏi tìm lại)

- Nghi thức đồng bộ bị b1 bỏ có tên → mặc định sai (nguồn:
  `_acceptance/trang-tu-van-v2-r4-b1/decisions.jsonl` entry
  d-20260818T144534Z-14963).
- `interactive-prototype` của repo trỏ vào `/design-mockup` + `provenance.json`
  — design-pass 2.2.0 §5.2 cấm đường này → skill đang trỏ vào bước chết.
- Config repo `design_pass.proto_route` = `/proto/{slug}` nhưng thư mục
  `/proto` không tồn tại; phòng trưng bày `/agent/ds/consult` là bản-vẽ-chuẩn
  thật (thay proto khai tử 05/08). Nghi thức phải nhận route override.
- Lỗ tài liệu: GUIDE thiếu `design_pass.ds_skill`; init template không gợi ý
  hai khoá.

## 7. Điều cố tình không làm

Không tạo «nghi thức canvas» riêng · không để kit phụ thuộc `/design` · không
đưa canvas vào evidence · không gộp hai chấm người thành một tin · không đổi
engine dưới chân b1 · không xếp kho gì ở repo tiêu thụ trước khi kit đổi.

## 8. Hình (tầng 1, đã phác trong phiên 19/08 — chiếu của mục 1–4)

| # | Loại | Câu hỏi | Nâng tầng 2? |
|---|---|---|---|
| H1 | Layer stack | `/design` chạm tầng nào trong Luật · Vật dựng · Nghi thức | không |
| H2 | Quadrant | bản chép ↔ sản phẩm thật × chỉ nhìn ↔ đo được | không |
| H6 | Morphological box | không gian lựa chọn; lộ ô «vật thật × không đồng bộ» chưa có tên | không |
| H3 | Solution tree | ba đường A/B/C và đánh đổi | không |
| H5 | Evidence chain | một cây nguồn; canvas là nhánh cụt | **có** (assets) |
| H4 | Swimlane | Người/Máy/Vật trước–sau | **ĐÃ VẼ tầng 2, 20/08** — `docs/plans/assets/2026-08-19-hat-giong-design-pass/truoc-sau-design-pass.html` (chiếu của mục 3+3b); nâng tiếp vào figures hồ sơ kit khi mở hồ sơ |
| H7 | RACI | vai người trong thiết kế khi không có designer | không |
| — | Ba lựa chọn phiên đồng bộ | dải giờ người theo ba nấc | không |

## Nguồn

- North Star + ba nguyên tố: `CLAUDE.md` (kit), `docs/plans/2026-08-12-nguoi-ve-bien-may-di-truoc.md`.
- Nghi thức hiện tại: `skills/design-pass/SKILL.md` (§0–§5, «Ranh giới»),
  `feature-loop/skills/feature-loop/SKILL.md` (S1#4, S1#6, Nghi thức S1-D).
- Luật hình: `docs/reference/DIAGRAM-RULE.md`.
- Phiên điều tra 19/08 (skill của repo tiêu thụ; ổ cắm kit; lỗ docs).
- Repo tiêu thụ: `_acceptance/config.yaml` (khoá `feature_loop.ui_standards_skill`,
  `design_pass.*`, `executors.design.*`), `docs/superpowers/specs/2026-08-18-trang-tu-van-v2-r4-b1-design.md`
  (§4.1, §4.3, §5), `apps/web/plugins/consult-page/view/StatesGallery.tsx`,
  `.claude/skills/interactive-prototype/SKILL.md`.
- Mô tả kỹ năng `/design` (bản preview trong Claude Code, nạp 19/08).
