# Hạt giống — «Việc kế theo plan» và hạt giống, đọc chứ không giữ

**Ngày:** 2026-09-06 · **Trạng thái:** hạt giống, chờ mốc 09/10 của OneFlow rồi mới xét mở ô ·
**Hạng dự kiến:** T2 (phần B), gói riêng cùng kho (phần C)

**Sinh từ:** owner hỏi 05/09 *«roadmap dài hơi nhiều phiên, làm sao mỗi phiên giữ bối cảnh và
kiểm tiến độ theo thời gian; product-map có giải quyết không?»* — trả lời: không, bản đồ là ảnh
chiếu sự thật, không biết ý định. Review 05/09 có phản biện context sạch (6 finding, 2 HIGH),
so sánh kit trước/sau, so sánh gói riêng/trong kit. Owner gật 06/09 hai điều: B trước C, B trong
kit còn C là gói riêng; OneFlow chờ mốc 09/10 mới sửa `plan:check`, làm phần T1 ngay.

## 0. Tóm tắt một đoạn

Kit đọc được **ý định** của repo (khối plan và mục hạt giống) để đầu mỗi phiên trả lời «việc
kế là gì, việc gì đang trễ, ý nào sắp mất», mà **không bao giờ giữ hay sửa** ý định đó. Sự
thật vẫn chỉ ở hồ sơ `_acceptance/`. Hai phần: **B** là một ổ cắm chỉ-đọc trong kit (một khoá
config, ba dòng trên thẻ start); **C** là gói riêng cùng kho, cắm vào B, chỉ mở khi B đã chạy ở
hai repo mà vẫn thiếu phép so thật-với-dự-kiến hoặc luật băng dùng chung.

## 1. Lỗ — bằng chứng đo được (OneFlow, 04–05/09)

| # | Điều đo được | Việc của ai |
|---|---|---|
| 1 | Thẻ `/acceptance-gate:start` không biết plan: phiên 05/09 mất bốn lượt đọc file mới tìm ra hàng kế (B2) và hạn làn owner (A6) | kit |
| 2 | `pnpm plan:check` của repo in một con số (★ 2/16), không in hàng đang dở, hàng kế, hạn gần nhất | repo |
| 3 | Trạng thái hàng là chữ gõ tay; hàng B2 vẫn ⬜ khi hồ sơ đã `verified`; chỉ ✅ nói dối mới bị bắt | repo |
| 4 | Lịch tuần và luật tái hoạch chỉ sống trong văn xuôi thiết kế | repo |
| 5 | Hạt giống nấc 1 (ý chưa có file) lẫn trong bảng «Xếp lại sau» 17 dòng; **chính kho này có 22 file `docs/plans/*-hat-giong-*.md` không thẻ nào đếm** | repo + kit |
| 6 | Bộ sinh bản đồ trong cache kit xếp nhóm khác bộ kiểm vendored của OneFlow; sinh lại làm CI đỏ 5 chỗ | kit (phân phối), không phải plan |

Ba trong sáu là việc của repo. Cái kit thiếu thật: **một dòng trên thẻ start** và **một cách
đếm hạt giống nấc 1**.

## 2. Mô hình ba lớp và bốn luật ranh giới

| Lớp | Trả lời | Ai ghi | Bản chất |
|---|---|---|---|
| Plan trong roadmap | sẽ đi đâu, thứ tự, ★, làn, hạn | người, tại mốc | ý định, là cược |
| Hồ sơ `_acceptance/<slug>/` | việc đã qua cổng nào, ai ký | các cổng của kit | sự thật |
| Bản đồ sản phẩm | toàn cảnh nấc của các việc | máy sinh | ảnh chiếu của sự thật |
| Tiến độ | thật trừ dự kiến | máy in | hiệu số, không phải tài liệu |

1. Plan không tự khai sự thật: ô ✅ suy từ hồ sơ; ô ◐ **chỉ in, không ghi vào file** (ghi vào
   file là đỏ oan giữa hai cổng người và làm bằng chứng ôi — bản đồ cố ý nhóm thô vì lẽ này).
2. Ánh xạ hàng ↔ hồ sơ hai chiều, khai **ba loại hàng**: có slug · kiểm cơ hội · tin theo lời.
   OneFlow có 8/20 hàng không slug; máy in số hàng «tin theo lời» thay vì giả vờ suy được.
3. Băng đóng thì hồ sơ mở ngoài plan là đỏ — luật của repo (hoặc tuỳ chọn của gói C), không
   phải mặc định của kit.
4. Bản đồ chỉ sinh lại; lệch hồ sơ là đỏ. Plan không thay bản đồ, đứng cạnh. Từ điển đã ghi
   «Product map, _Avoid_: roadmap» — giữ nguyên.

## 3. Đề xuất — hai phần, hai gói

**B — ổ cắm trong kit, chỉ đọc.**
- Khoá config `plan.block: <file>#<marker>`; vắng thì im, không cờ, không lỗi (khuôn ổ cắm
  trung tính như `discovery.brainstorm_skill`).
- `start-scan.mjs` đọc khối, đối chiếu slug với hồ sơ qua thư viện có sẵn (biết
  `machine-cleared`), thêm vào JSON và thẻ ba dòng: «việc kế theo plan: <hàng>», «tin theo lời:
  n», «hạt giống: n, cũ nhất x ngày».
- Kit KHÔNG sở hữu guard plan, KHÔNG ghi gì vào plan, KHÔNG đưa script nào vào CI của repo.

**C — gói riêng cùng kho, cắm vào B (sau, có điều kiện).**
- Khuôn khối plan, phép so thật với dự kiến, đóng băng tuỳ chọn với ba lý do ngoại lệ có tên,
  răng cho tất cả.
- Phụ thuộc một chiều vào kit như `feature-loop`: giải đường dẫn qua `resolve-plugin.mjs`, ghi
  khoá dưới tên riêng trong config qua `config-patch.mjs`, tự lo danh sách file chép sang CI kèm
  phép kiểm «bản chép khớp plugin».
- Kit không biết C tồn tại ngoài ổ cắm B.

Vì sao chia: B là một dòng của nghi thức đầu phiên nên không tránh được việc chạm kit; C có vòng
đời, từ điển và guard riêng nên đứng ngoài để repo không dùng plan không phải mang khái niệm
hàng, ★, băng. Tiền lệ: `feature-loop`, `diagram-design` là gói riêng cùng kho, cùng dogfood,
cùng lượt phát hành.

**Không làm:** không đưa ★, làn, ngưỡng 85%, ba lý do ngoại lệ, mốc 09/10 vào kit dưới dạng
hằng · không để kit ghi bất kỳ ô nào của plan · không kit-hoá nấc 2 hạt giống (thẻ start đã
có «Đang cân nhắc» kèm tuổi và cờ quá hạn) · không viết bộ đọc frontmatter thứ hai · không
sinh lại bản đồ bằng bộ sinh cache khi bộ kiểm vendored chưa nâng theo.

## 4. Hạt giống — hai nấc

- Nấc 1 (tên, một câu, ngày gieo, chưa có file): mục riêng trong roadmap của repo. Kit chỉ đếm
  và in tuổi qua ổ cắm B.
- Nấc 2 (ô cơ hội đang cân nhắc): kit đã có. Không dựng lại.
- Tại mốc tái hoạch mỗi hạt một trong ba phán quyết: giữ · gieo · bỏ có lý do. Luật của repo.
- `docs/plans/*-hat-giong-*.md` là vùng nháp không guard; muốn máy nhớ thì có một dòng nấc 1
  trỏ tới.

## 5. Chiều đỏ — khai trước

- Ổ cắm B: khoá trỏ file/marker không tồn tại → thẻ in cờ vàng có tên, KHÔNG im lặng và KHÔNG
  chặn; khoá vắng → không in gì (ca round-trip P: vắng ≠ hỏng).
- Hàng khai slug mà hồ sơ không có → «tin theo lời» tăng 1 và thẻ nêu tên hàng.
- Bộ đếm hạt giống: mục vắng → 0 và không cờ; hạt không có ngày gieo → cờ «chưa rõ tuổi»
  (cùng luật `ageTied` của «Đang cân nhắc»).

## 6. Ngưỡng và điều kiện dừng (đề xuất — owner chốt cùng lượt Cổng Đáng)

| Thước | Số | Cách đo |
|---|---|---|
| Repo thứ hai | ≥ 1 repo ngoài OneFlow khai `plan.block` trong 30 ngày sau khi B phát hành | tìm khoá trên các repo đã init; không đạt thì bỏ C, giữ B |
| «Việc kế» đúng | ≥ 8/10 phiên start liên tiếp trên OneFlow sau 09/10, slug thẻ in trùng slug hồ sơ đổi trạng thái kế tiếp | so thẻ với lịch sử commit của hồ sơ |
| Không đỏ vì lệch tầng | 0 lần CI đỏ trên nhánh chính trong 20 lần chạy đầu do bản chép khác bản plugin; hàng «tin theo lời» ≤ 20% | log CI + đếm hàng |
| Hạt giống không mất | mọi hạt quá 30 ngày có một phán quyết tại mốc; số hạt «không ai đụng» về 0 sau mỗi mốc | thẻ start sau mốc |

Dừng: tại mốc 09/10 OneFlow phải đổi cột hay luật của khối plan; hoặc không có repo thứ hai;
hoặc kit chưa có phép kiểm «bản chép khớp plugin» (C không mở hợp đồng, chỉ dừng ở ô).

## 7. Trình tự và quan hệ

1. Ngay (OneFlow): mục «Resume here» trong CLAUDE.md (T1); tách bảng park/hạt và `plan:check`
   in việc kế chờ mốc 09/10 vì băng đóng.
2. Sau mốc 09/10: nếu số của OneFlow không đòi đổi khuôn, mở ô cơ hội trong kho này cho **B**
   với bốn ngưỡng ở §6.
3. Chỉ khi B chạy ở hai repo mà vẫn thiếu: mở ô cho **C** như gói riêng cùng kho.

Quan hệ: ADR 0007 (bản đồ miễn T1 vì máy sinh toàn phần — plan là ý định người nên KHÔNG
miễn) · `start-scan.mjs` nhóm `considering` (nấc 2 đã có) · ổ cắm `discovery.brainstorm_skill`
(khuôn ổ cắm trung tính) · OneFlow `docs/roadmap.md` khối plan-freeze và
`scripts/roadmap/check-plan-freeze.mjs` (bản mẫu repo-local, guard chỉ builtins).

---

**Cập nhật 13/09/2026 — hạt giống này đổi bản chất, không đổi mục tiêu.** Khoá
`plan.block` ở §3 **không còn**: câu «ý định thường-trú ở đâu» được trả lời bởi
hàng `(ý-định, thường-trú)` của router nhà tài liệu (spec
`docs/superpowers/specs/2026-09-13-nha-tai-lieu-router-design.md`, `nhà` nhận
`#fragment`). Phần B trở thành **bộ đọc khối bind vào hàng đó** — P3 của kế
hoạch `2026-09-13-ke-hoach-theo-outcome-nha-tai-lieu.md`, vẫn chờ mốc 09/10 của
OneFlow. Bộ đọc phải nhận hai marker (`<!-- x:start -->` kiểu OneFlow và
`<!-- <<<X -->` kiểu kit) với cặp ca cho cả hai. Nối dòng dõi `iterate` (phát
hiện 13/09) quyết cùng P3.

---

## Cập nhật 02/10/2026 — hạt giống đổi tên gọi, có neo thật, hai lát (owner gật 02/10)

**Tên mới của ý:** *Lộ trình: người ghi ý định, máy suy trạng thái và vẽ.* Tên
file giữ nguyên để lịch sử và răng VC8 không đứt. Nguồn chữ là mục này; hai bản
chiếu đi kèm ở `assets/2026-10-02-lo-trinh-vao-kit/` (00 = brainstorm Cổng Đáng,
01 = sơ đồ ba làn người · kit · đội dùng CRM, swimlane, hai bộ kiểm của skill xanh).

### 1. Neo ngoài — ba lộ trình đã sống bằng tay ở hai kho (đo 02/10 trên nhánh đang sống)

| Kho · lộ trình | Vật | Hàng | Trạng thái cập nhật bởi | Răng |
|---|---|---|---|---|
| crm · OKR — `docs/plan/lo-trinh-okr.{md,data.js,html}` + bản sống Artifact | văn + dữ liệu 19 trường + trang | 28 (15 đã lên onehub · 9 chưa mở · 2 xong · 2 Cổng Bằng chứng) | tay — **12 commit «bản chụp» trong 4 ngày** (27–30/09) | không |
| crm · Kho tài liệu — `docs/plan/lo-trinh-kho-tai-lieu.*` | cùng ba vật; khuôn đã lệch: 10 trường chung, 9 chỉ OKR, 3 chỉ Kho | 11 | tay | không |
| oneflow · 24 tuần — `docs/roadmap.md` | văn theo phase + sổ cái hạng mục đã ký | — | tay, tại mốc | **có** — `scripts/roadmap/roadmap-drift.mjs` ba kiểm A/B/C, ô `roadmap-drift-guard` ký 27/08 |

Số đo đi kèm: 22/42 ô cơ hội của crm trỏ về lộ trình bằng chữ; 23/48 tin owner ở
phiên điều phối OKR 23–26/09 là hỏi tiến độ (`docs/findings/2026-09-26-loi-kit-tu-luot-4-okr.md`
§4, kiến nghị §5.4 đã xếp việc này là «CỘNG, chờ owner phê riêng»); OneFlow
05/09 bốn lượt đọc file mới tìm ra hàng kế (§1 ở trên). Ngưỡng «B chạy ở hai
repo rồi mới xét C» (§7) đã bị thực tế vượt theo chiều ngược: ba lộ trình sống
trước cả B.

### 2. Kết luận brainstorm 02/10 (chi tiết và phép thử theo thước kit ở bản 00)

- **Đáng, nhưng là ổ cắm đọc + bộ vẽ, không phải «kit có roadmap».** Nội dung
  lộ trình là product context; kit mang *khuôn tối thiểu + bộ đọc + bộ vẽ*,
  không mang hàng nào. Trace: nguyên tố 1 — và là thước đầu tiên cho nguyên
  tố 1. Người hưởng: owner ở phiên điều phối, mọi phiên vào kho ở S0.
- **Hai lớp, hai câu trả lời.** Lớp *ý định* (hàng, câu giao, hạng, thứ tự,
  đứng trên, điều kiện mở) độc lập, đứng trước mọi vòng, người ghi, đổi bằng
  PR. Lớp *trạng thái* (PR, cổng ký, ngày, lệch) là đầu ra của vận hành, máy
  suy từ hồ sơ bằng đúng bảng nhãn của bản đồ sản phẩm — không bảng thứ hai.
  Vì sao không gộp: hàng ↔ vòng không một-một ở biên (crm: `okr-8` tách 8a/8c;
  `canh-kr-okr` phủ năm mã; 9b đổi hạng T2→T3 giữa đường) và lộ trình sinh từ
  vòng là ý định viết sau khi làm.
- **Owner quyết 02/10, bốn điều:** (i) gật hướng A; (ii) kit **tuyệt đối không
  ghi** vào file ý định — trạng thái chỉ hiện trên trang vẽ, không nằm trong
  file văn; (iii) hai nấc trong CRM (trang đọc `/lo-trinh` · nút góp ý sinh
  hàng nháp) là hai hàng trên chính lộ trình OKR, ngoài kit; nấc 3 (đội sửa
  trong app, CRM thành nguồn, kho nhận bản xuất qua PR máy mở) chỉ mở khi hàng
  nháp có người ngoài owner tạo; (iv) skill **cắt lượt** là lát 2 của hạt
  giống này.

### 3. Khuôn sáu trường (kit bind; kho thêm trường tự do; thiếu trường → cờ vàng, không đỏ)

| Trường | Ai ghi | Dùng để |
|---|---|---|
| `ma` | người | khoá hàng, không đổi khi đổi tên |
| `cau_giao` | người | câu người dùng nói được, in lên thẻ |
| `hang` | người | T1/T2/T3 — biết vòng có Cổng 1.5 không |
| `dung_tren[]` | người | suy «hàng kế đủ điều kiện chưa» |
| `slug` | người, khi mở vòng | nối hàng với `_acceptance/<slug>/`; hồ sơ ghi `Gốc:` trỏ ngược về `ma` |
| `bat_khi` / điều kiện mở | người | ngưỡng Cổng Giá trị khai trước, hiện nguyên trên trang đọc |
| *trạng thái* | **máy** | suy từ hồ sơ: chưa mở · đang cân nhắc · đang làm · đã giao · đã nghiệm thu (`da-cham-boi-thuc-te`) |

Hàng không `slug` là hàng **tin theo lời** — máy in số, không giả vờ suy (crm 5/28,
oneflow 8/20). Hàng lộ trình **không** là ô (luật 18/09); ô chỉ sinh khi người mở vòng.

### 4. Hai lát

**Lát 1 — ổ cắm đọc + vẽ (T2).** Khoá trong `_acceptance/config.yaml` trỏ tới
file lộ trình (tới khi router nhà tài liệu có răng thì khoá này thành một hàng
của router); vắng thì im. `start-scan` đọc hàng, đối chiếu slug với hồ sơ, in
ba dòng lên thẻ start (hàng kế · hàng trễ · tin theo lời); bộ vẽ sinh trang HTML
cạnh `PRODUCT-MAP.md`, cùng lượt và cùng `--check`. Trang ấy là thứ owner đẩy
lên Artifact. feature-loop S0 sửa một dòng: nhận một hàng thay đoạn văn dán tay.
Kit không ghi gì vào file ý định.

**Lát 2 — skill cắt lượt (T2, sau lát 1 vì cần khuôn đã có răng).** Đầu vào:
bản phạm vi của đội sản phẩm (mã, mốc ngoài, đợt) hoặc Core của quét hình
thái. Đầu ra: bảng hàng theo khuôn + bảng phủ. Sáu luật, rút từ ba lộ trình
owner đã viết (`lo-trinh-dieu-phoi-30-ngay.md` §2 · `lo-trinh-kho-tai-lieu.md`
· `lo-trinh-okr.md` §8): (1) mỗi hàng một câu người dùng nói được; (2) hàng sau
đứng trên dữ liệu thật của hàng trước; (3) không chạm hai lớp khó đảo trong một
hàng; (4) cỡ hàng theo nhịp thật của kho, máy đo từ hồ sơ cũ; (5) ngày rơi ra
từ thứ tự + nhịp, mốc ngoài là ràng buộc để kiểm; (6) mã không cắt được thành
câu giao → chân trời kèm lý do. **Răng duy nhất:** mỗi mã của bản phạm vi nằm ở
đúng một hàng hoặc chân trời. Lộ trình thời gian cho đội sản phẩm là view vẽ
từ hàng + mốc.

### 5. Chiều đỏ khai trước (thêm vào §5)

- Hàng tự khai «đã giao» trong file ý định → bộ vẽ **bỏ qua**, in trạng thái
  suy từ hồ sơ kèm cờ «file khai khác hồ sơ» (đặc hiệu: chạm hồ sơ không thuộc
  lộ trình → thẻ im).
- Bảng phủ thiếu một mã / một mã ở hai hàng → răng lát 2 đỏ, nêu tên mã.
- Bản sao crm với `lo-trinh-okr.data.js` nguyên vẹn phải XANH trước khi tin
  bản bị tiêm là ĐỎ.

### 6. Thước năm dòng (dự báo) + một số riêng

làm-xong→quyết-được ↓ · lượt gọi người/vòng = · vòng bị hạ tầng đốt = · token máy/vòng
= (tất định, 0 lượt LLM) · phút máy/lượt chấm =. Số riêng: **tin hỏi tiến độ trên
một lộ trình**, nền 23/48; không giảm sau hai lộ trình dùng ổ cắm → ô đóng với
giới hạn, không nới.

### 7. Đường đi và điều kiện mở ô

Ô `_acceptance/viec-ke-theo-plan/` vẫn **park**; neo thật nay có:
`crm/_acceptance/cap-nhat-tuan-okr` (hồ sơ lượt 4 OKR, nơi đo 23/48) và vật
`crm/docs/plan/lo-trinh-okr.data.js`. **Mở ô khi crm nhận mốc 2.20.0** (owner
02/10) — không đổi engine dưới chân vòng đang chạy; là vòng meta có kho chờ nhận
nên không vướng luật chiều rộng (b). Gói C (§3 cũ: băng, răng chống trôi dùng
chung) chỉ mở khi ≥ 2 kho cùng đòi. Thước kiểm nhanh hai chiều cho lát 1: dựng
bản sao crm, phá một hàng (slug sai · trường thiếu · tự khai đã giao) → thẻ đỏ
đúng chỗ; chạm hồ sơ ngoài lộ trình → thẻ im.
