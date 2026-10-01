# Thước biết trước là không phán được — giám khảo bị hỏi điều nó bị cấm đọc

> Ngày đo: 2026-10-01. Ca gốc: crm, hồ sơ `va-tro-ly-okr-sau-thu`, eval E14
> (Gốc: crm/_acceptance/va-tro-ly-okr-sau-thu). Script quét tái lập:
> [assets/2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs](assets/2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs)
> — `node <script> ~/dev`.

## 1. Một câu

Một eval judgment hỏi «diff của lượt có giữ luật kho không», trong khi từ 04/08
lời giao việc cho giám khảo cấm đọc bất cứ thứ gì ngoài danh sách `inputs` — và
danh sách đó chỉ có tài liệu. Phán quyết của eval này KHÔNG phụ thuộc vào vật:
sửa mã bao nhiêu lần nó vẫn UNCERTAIN. Đây không phải ca lẻ: crm lặp đúng dạng
này ở 9 hồ sơ trong hai tuần, và người đã ký «Đạt» bằng tay cho phần lớn.

## 2. Ca gốc

- E14 (AC-13, Dấu `(judgment)`) hỏi tám vế: bảy vế chỉ kiểm được trên mã (không
  chú thích mới, API không đọc khoá, hằng không lặp chuỗi, parse ở biên, không
  className đè kiểu, chữ «tác tử» trên màn…), một vế trên tài liệu
  (`docs/agent.md` nói hàm nguồn khoá). `inputs` = 6 tệp tài liệu.
- Lời giao việc cho giám khảo (`acceptance-verify.js`, dòng dựng prompt judge):
  «BLIND: KHÔNG đọc diff… CHỈ được đọc đúng các file liệt kê ở dòng Input…
  thiếu căn cứ → UNCERTAIN, tuyệt đối không đi tìm file khác». Có từ vòng
  `judgment-question-guard` (04/08) — đúng cho tính độc lập của hội đồng.
- Kết quả: 3/3 giám khảo UNCERTAIN, `required_evidence` toàn là lệnh git
  diff / grep — tức chính bảng việc của một eval script.
- **Một lỗi thật đã lọt qua đúng khe này.** Làn tìm-lỗi (đọc được diff) thấy «chữ
  trên màn ghi cứng tên biến khoá và khoảng kiểm lại» — khớp vế «tên biến khoá
  nằm trong tệp cấu hình, không lặp chuỗi» của AC-13 — nhưng bước phân loại phạm
  vi xếp nó NGOÀI hợp đồng, đề xuất known-limits. Nghĩa là AC-13 không có phép đo
  máy nào đang sống: chỗ chấm được thì mù, chỗ thấy được thì không gắn về AC.
  Người ký «Đạt» cho E14 như các lần trước sẽ là ký ĐẠT trên một vế máy đã thấy
  vi phạm.

## 3. Số đo trên mọi kho (10 kho · 462 hồ sơ · 434 eval judgment)

| Bộ dò | Số eval | Ghi chú |
|---|---|---|
| Rộng: hỏi diff · bảo chạy lệnh · nhắc đường dẫn mã ngoài `inputs` | 28 | nhánh đường-dẫn-mã có ca hợp lệ (nhắc tên tệp làm ngữ cảnh) — không đủ chắc làm chốt |
| Hẹp: hỏi diff của lượt · bảo chạy lệnh | 17 | soi tay: 17/17 đúng là hỏi thứ giám khảo không đọc được |

Phán quyết cuối của 17 ca hẹp: 10 UNCERTAIN · 7 PASS. Bảy PASS đều có lý do
không lành: năm ca artifact-platform chấm tháng 6–7 — TRƯỚC khi khoá «chỉ đọc
inputs» có, giám khảo tự chạy lệnh; một ca crm (`tro-ly-okr-de-xuat`) PASS nhờ
một tệp bằng chứng tĩnh `luat-kho.md` mà chính giám khảo thứ ba chỉ ra là ghi HEAD
cũ hơn nhánh; một ca radar trả lời từ tệp đầu ra kèm theo. Sau 04/08: 10/12 ca
kết thúc UNCERTAIN. Bản quét đầu (sáng 01/10) miễn hai ca có tệp tên «diff» trong
`inputs` — §10.3 giải thích vì sao miễn như vậy là sai, nên số ở đây là bản đã
bỏ miễn.

crm riêng — dạng «Nhìn diff của lượt này: luật kho…» ở 9 hồ sơ OKR (26/09 → 01/10):
vòng chấm cộng lại ≈ 17, mỗi vòng 3 giám khảo — khoảng 50 lượt giám khảo mà
câu trả lời đã biết trước. Ở 7 hồ sơ đã ký, eval này là mục UNCERTAIN DUY NHẤT
của báo cáo; 5 trong 7 có dòng «Đạt» do người ghi tay ở ô `human_override`.

## 4. Vì sao — đọc bằng nguyên lý của kit

1. **Nguyên tử tái diễn.** Một trí tưởng tượng (phiên sinh eval) viết THƯỚC trên
   một nền nó không biết: nó không biết giám khảo chỉ đọc đúng `inputs`. Vòng
   04/08 siết BÊN ĐỌC (lời giao việc cho giám khảo) mà không báo BÊN VIẾT (luật
   chọn executor ở `eval-executors.md`, bước gắn Dấu ở Phase 1, câu hỏi chéo của
   gap-probe) — đúng hình dạng 3 của «Thước phải gắn vào vật được giao»: bên viết
   và bên đọc của một artifact trôi khỏi nhau.
2. **Thước không gắn vào vật.** Phán quyết là hàm của `inputs`, mà `inputs` không
   chứa vật. Bộ nhớ panel P3 còn khoá phán quyết theo băm `inputs` — sửa mã không
   đổi được băm. Thước không có chiều đỏ lẫn chiều xanh.
3. **Dấu của cả AC đè lên luật «executor máy nhất».** Phase 2 bước 2 đã nói «ưu
   tiên executor máy nhất kiểm được tiêu chí», nhưng luật chọn số 4 cho Dấu
   `(judgment)` thắng tuyệt đối — một AC gộp bảy vế grep được với một vế cần phán
   đi trọn gói sang hội đồng.
4. **Lời dặn không răng đã thua 9 lần.** `judge-personas.md` có «>50% UNCERTAIN
   → sửa contract ở Cổng Phạm vi lần sau» — đẩy việc học sang người, không máy nào
   giữ. Hiến pháp cấm dặn-bằng-lời làm nghiệm; số đo ở §3 là bằng chứng.

## 5. Họ lỗi — để giải đúng cho các ca tương tự

Tên chung: **thước biết trước là không phán được** — ngay lúc viết eval đã có thể
biết người chấm của nó không đọc được thứ câu hỏi hỏi. Cạnh tứ diện: Thước↔Vật,
nhưng không phải «không đọc được ở đây» do bàn đo chưa về (môi trường), mà do
CHỌN SAI bàn đo (thiết kế) — nên người gỡ là máy, không phải người.

| Thành viên | Đã có chốt? |
|---|---|
| Judgment không khai `inputs` | Có — panel UNCERTAIN cơ học, không gọi hội đồng (04/08) |
| Lời hứa cross-layer, bằng chứng chỉ lớp UI | Có — W4 |
| Mặt người nhìn, bằng chứng chỉ lớp mã | Có — W8 |
| App di động: runner chỉ là bằng chứng lớp UI | Có — luật ghép backend-effect |
| **Judgment hỏi diff / mã / lệnh không có trong `inputs`** | **Chưa** — ca này |
| Vế cơ học đi sang hội đồng chỉ vì Dấu của cả AC | Chưa — gốc của ca này |
| Bản quét luật viết thành tệp bằng chứng tĩnh cho giám khảo đọc | Chưa — cũ đi so với HEAD (`tro-ly-okr-de-xuat`) |
| Judgment dùng làm ô «chỉ người làm được» (`[HUMAN — BE thật]`, onehub) | Chưa — 1 ca, không neo trong vòng này |

Nguyên lý chung rút ra (một luật, bốn lối, chọn theo TỪNG VẾ, không theo Dấu):

- vế mà **một lệnh đọc được** → `script`/`test` của kho. Thước cùng nhà vật: chạy
  mỗi lượt trên HEAD mới, chạy ở CI và làn ghim lại, sống tiếp sau vòng;
- vế chỉ thấy trên **màn đang chạy** → `ui-check`;
- vế cần **cân với ý định** trên một tệp → `judgment` với đúng tệp đó trong
  `inputs` (tệp mã nguồn được phép; diff thì không);
- vế **không ai ở đây đọc được** (dữ liệu prod, khoá thật, người dùng thật) → khai
  giới hạn ngay lúc viết, như tiền lệ `expected_exit` → đạt-có-giới-hạn — không
  gọi ba giám khảo để phát hiện điều người viết đã biết.

Bất biến máy giữ: **câu hỏi của judgment chỉ được hỏi điều nằm trong danh sách
tệp của nó; hội đồng không đọc diff, không chạy lệnh.** Người dùng của chốt là
MÁY ở bước sinh eval, không phải người: phép thử 01/09 — người trả lời khác
khuyến nghị dựa vào điều gì máy không có? Không gì cả; máy có diff.

## 6. Đối chiếu chip đề xuất (giữ gì, đổi gì)

| Chip | Giữ / đổi | Vì sao |
|---|---|---|
| Chốt ở bước lint evals | Giữ, đổi nơi tiêu thụ | Cảnh báo lint hôm nay trình NGƯỜI quyết ở Cổng Phạm vi — thêm một dòng nữa là thêm một mục người gật vì vượt nhận thức. Chốt này máy tự xử: tách eval rồi ghi sổ, chỉ còn sót mới lên thẻ |
| «→ P0» | Đổi | Lint không có thang P; P0 thuộc gap-probe, nơi đã có đường «P0 → sửa artifact ngay» chặn làn T2 ở Cổng Phạm vi. Lint giữ chiều đỏ tất định, gap-probe giữ đường xử |
| Dò «tên tệp mã nguồn không có trong inputs» | Bỏ khỏi chốt máy, để gap-probe | Nhánh rộng có ca hợp lệ (§3); bất định thì đoán về phía sót-đã-khai, không kêu sói |
| Ghi trong `eval-executors.md` | Giữ, mở rộng | Thêm: chọn theo từng vế; Dấu không đè «executor máy nhất»; giải mâu thuẫn `judge-personas.md` («không nhận diff») với `eval-executors.md` (cho phép tệp mã trong `inputs`) |
| Test hai chiều | Giữ | Kèm đối chứng dương + ghim thông điệp (bất biến «assertion âm-tính-một-mình») |

## 7. Cân trên mọi kho (luật 26/09)

- Kho không có dạng này (6/10): bộ dò im — không được gì, không mất gì.
- Kho có (crm 9 · artifact-platform 4 · oneflow 1 · radar 1): mọi ca đều là hồ
  sơ đã ký trừ `va-tro-ly-okr-sau-thu`; chốt chạy ở bước sinh eval nên không đổi
  phán quyết nào đã ký. Hành vi cũ không ai dựa được: giám khảo không đọc được
  diff từ 04/08.
- Thứ tự nghiệm: đúng tầng ở kit là BÊN VIẾT (luật sinh eval) — chính skill của
  kit đã viết E14. Không đổi mặc định chấm của bên đọc; không cho giám khảo đọc
  diff (phá tính độc lập, và vế cơ học vẫn thuộc về script).

## 8. Đề xuất — một vòng T2, CỘNG cần owner duyệt đích danh (bản sửa sau §10)

Lõi (giữ) — không chạm `lib/**`, `hooks/**`, lưới trước-merge → T2:
1. **Răng ở `feature-loop/scripts/s4-args.mjs`** — cùng chỗ và cùng hình với răng
   «input không có trên đĩa → exit 2 gọi tên, không sinh tệp» (hồ sơ
   `inputs-tinh-tu-goc-kho`, ca JI2–JI6): câu hỏi của một eval judgment hỏi diff
   của lượt hoặc bảo chạy lệnh → exit 2, nêu eval, nói đúng hai lối ra: vế đo
   được bằng lệnh → eval `script`/`test` của kho đo TRẠNG THÁI cây; vế cần phán
   → hỏi về tệp có trong `inputs` (tệp mã nguồn được, diff không). Chạy TRƯỚC
   lượt chấm đầu tiên, nên không tốn một giám khảo nào và không đốt lượt chấm.
2. **Luật chọn theo từng vế** ở `eval-executors.md` (mục judgment + luật chọn
   số 4), Phase 2 của `skills/acceptance/SKILL.md`, dòng evals ở S1 của
   feature-loop; **giải mâu thuẫn** `judge-personas.md` («không nhận diff») với
   `eval-executors.md` (tệp mã trong `inputs` là hợp lệ): hội đồng đọc TRẠNG
   THÁI, không đọc LỊCH SỬ; thay câu dặn chết «>50 % UNCERTAIN → sửa hợp đồng lần
   sau» bằng con trỏ tới răng. Kèm hai bẫy đã khai ở §10.2 cho script luật kho.
3. **Một ý thêm vào câu hỏi chéo của gap-probe** kèm sự thật nền «hội đồng chỉ đọc
   đúng `inputs`, không diff, không lệnh» — bắt ở Cổng Phạm vi, trước khi hợp
   đồng được duyệt; răng (1) là lưới nếu lọt.
4. **Ca kiểm hai chiều** trên cùng fixture, ghim thông điệp: hỏi tài liệu với
   inputs tài liệu → exit 0 (đối chứng dương) · hỏi «diff của lượt» → exit 2 +
   thông điệp · hỏi về tệp mã có trong inputs → exit 0 · inputs có tệp tên
   `diff-luot.txt` mà câu hỏi vẫn hỏi diff → exit 2 (không miễn theo tên tệp).

Đuôi (không làm ở vòng này, ghi ngưỡng): W9 ở `eval-coverage-lint.js` và một
làn trên thẻ Cổng Phạm vi — cùng bộ dò, hai bộ đọc nữa là hai bản sao nữa; lint
không nằm trên đường feature-loop (§10.1) nên chỉ phục vụ người chạy acceptance
trần. Ngưỡng mở: ≥1 hồ sơ mắc dạng này tới được lượt chấm qua đường acceptance
trần sau mốc phát hành vòng này.

Bảng dự báo năm dòng, nói thẳng hơn bản sáng: **thời gian làm-xong→quyết-được ↓**
(người thôi phải tự đọc diff cho mục luật kho) · **lượt gọi người/vòng =** — 7/9
hồ sơ crm là T3, mọi mục judgment đều phải người phán theo thiết kế, nên eval này
không THÊM lượt dừng, nó thêm một mục không-căn-cứ vào lượt dừng có sẵn; 2 hồ sơ
T2 đều có mục ngoài hợp đồng nên cũng không xanh-sạch · **vòng bị hạ tầng đốt
lượt chấm =** (răng chặn trước lượt, không trong lượt) · **token máy/vòng ↓** —
16 lượt hội đồng × 3 giám khảo ở crm cho câu hỏi không trả lời được · **phút
máy/lượt chấm =**. Điều kiện tin cậy: đường verdict không đổi thành phần — răng
nằm trước lượt chấm, không trong làn finder → refute → REJECT. Giá trị không
nằm ở số lượt: nó nằm ở chỗ AC luật kho lần đầu có một thước gắn vào vật (§2,
lỗi đã lọt).

Giới hạn khai trước, kèm ngưỡng:
- Bộ dò là ngôn ngữ tự nhiên, răng là CHẶN: bắt nhầm = chặn oan. Độ đặc hiệu đo
  được 17/17 trên 434; bản đầu từng bắt nhầm «Trên app QC đang chạy:» (onehub)
  nên đã siết. Ngưỡng nới thành cờ vàng: ≥1 lần chặn oan có tên.
- Sót tiếng Anh («the changes», «what was modified») — 1/17 ca là tiếng Anh.
  Ngưỡng mở rộng: ≥2 ca sót đi tới lượt chấm.
- Ô «chỉ người làm được» cho judgment (`[HUMAN — BE thật]`, onehub) — 1 ca, 1
  kho. Ngưỡng: ≥2 kho.

## 9. Việc ngay ở crm (không phải việc kit)

Vòng `va-tro-ly-okr-sau-thu` không phải chờ kit: tách E14 thành một eval script
(các vế grep được, chạy trên HEAD hiện tại, qua một `config:` của crm) + một
judgment chỉ cho vế tài liệu; lỗi «chữ trên màn ghi cứng tên biến khoá» là sai
hợp đồng của AC-13 → máy sửa vật. Không ký «Đạt» cho E14 ở dạng hiện tại.

## 10. Tự phản biện 01/10 (owner yêu cầu trước khi duyệt) — đọc mã, không đọc lại đề xuất

### 10.1 Răng đặt sai chỗ — lỗ nặng nhất của bản sáng
`eval-coverage-lint.js` KHÔNG nằm trên đường feature-loop: S1 của feature-loop
sinh evals.yaml tại chỗ và không gọi lint (0 hit trong SKILL feature-loop); lint
chỉ chạy ở Phase 2 của skill acceptance (đường acceptance trần) và ở lệnh
`approve` do người gõ. crm — nơi sinh 9/17 ca — chạy feature-loop ở làn V, máy
đi tiếp, không ai gõ `approve`. W9 ở lint sẽ không bao giờ nổ ở đúng kho mắc lỗi.
Thẻ Cổng Phạm vi (`gate-card.js`) tự tính cờ phủ riêng, không đọc lint. Chỗ MỌI
lượt chấm phải đi qua, ở MỌI kho, là `s4-args.mjs` — và nó đã có răng cùng hình:
input không có trên đĩa → exit 2 gọi tên, không sinh tệp, kèm bộ ca JI1–JI6
(đối chứng dương + ghim thông điệp + round-trip). Răng mới là một nhánh nữa của
đúng hàm đó. Vì sao CHẶN thay vì «hội đồng UNCERTAIN cơ học, 0 giám khảo» như
nhánh thiếu-inputs: nhánh kia là đường đọc-cũ cho hồ sơ đã ký; ở đây không có
hồ sơ cũ nào cần đọc, và UNCERTAIN cơ học vẫn đẩy một mục không-căn-cứ lên Cổng
Bằng chứng cho người — là trạm thu phí; chặn trước lượt thì máy sửa, 0 người.

### 10.2 «Vế cơ học → script» có hai bẫy đã có tên trong kit
- **Đo diff thì xanh rỗng sau gộp** — tiền lệ JR11a (`judge-required-evidence`):
  sau merge base = HEAD, `git diff HEAD HEAD` rỗng, phép đo chết lặng; làn ghim lại
  cũng vậy. Script luật kho phải đo TRẠNG THÁI cây («0 chú thích trong các tệp vòng
  này chạm», «0 chỗ đọc khoá ngoài `apps/agent`»), không đo «dòng thêm mới».
- **Đo trạng thái thì đỏ oan nếu cây đã bẩn** — routing của S4: eval máy đỏ →
  REJECT, cột baseline chỉ là ghi chú ở mục Analyst, không cứu. Script luật kho
  phải XANH trên cây hiện tại trước khi được nhận (đối chứng dương theo
  `MEASURE-BIRTH-CLAUSE`); cây đã bẩn thì thu phạm vi quét về đường dẫn của vòng
  (`paths:`), và chính kho dựng script đó — vật của kho, kit không viết hộ.
Cả hai vào `eval-executors.md` cùng luật chọn theo vế. `paths:` không có bẫy
thêm: không khai → luôn chạy lại (rẻ), khai hẹp → carry-forward đúng.

### 10.3 Lối thay thế «đưa diff cho giám khảo» đã có bằng chứng hỏng, và sẽ đẻ lỗi mới
crm `gioi-han-duyet-cay-okr` E25 đưa `evidence/diff-luot.txt` vào `inputs`:
tệp 500 dòng chỉ chứa `--stat`, 0 thân diff → hai vòng UNCERTAIN, cả ba giám khảo
đòi «nội dung diff, không chỉ --stat». Nặng hơn: tệp diff làm tay ở vòng N là
lịch sử đóng băng; vòng N+1 mã đổi mà tệp không đổi thì bộ nhớ hội đồng (P3, băm
`inputs`) MANG phán quyết cũ sang mã mới — một lỗi chưa từng có sẽ xuất hiện nếu
ai «sửa» bằng cách thêm tệp diff. Hệ quả cho bộ dò: KHÔNG miễn khi `inputs` có
tệp tên «diff» (bản quét sáng đã miễn — sai; §3 đã sửa số). Luật: hội đồng đọc
trạng thái (tệp mã nguồn hợp lệ, P3 băm lại đúng khi mã đổi), không đọc lịch sử.

### 10.4 Số lượt gọi người — bản sáng nói quá
7/9 hồ sơ crm là T3: mọi mục judgment đều phải người phán theo thiết kế. Eval này
không thêm lượt dừng nào; nó thêm một mục mà người ký không có căn cứ để ký. Dòng
«lượt gọi người ↓» của bản sáng đã đổi thành «=» (§8). Giá trị thật của vòng là
chất lượng thước (một lỗi đã lọt, §2) và token.

### 10.5 Bộ phân loại phạm vi không sửa được ở đây — và không cần
Lỗi «chữ trên màn ghi cứng tên biến khoá» bị xếp ngoài hợp đồng dù AC-13 nêu đích
danh — lớp lỗi classifier đã biết (luật «không chắc → ngoài»). Vòng này không
chữa classifier; tách vế thành script khiến vế đó được đo bằng lệnh, không còn
phụ thuộc ai phân loại. Đúng tầng: thước gắn vào vật thay vì sửa người gác.

### 10.6 Nguồn lặp ở crm là chép khuôn, kit tự nó 0 ca
Quét 96 hồ sơ của chính kit: 0/42 eval judgment mắc dạng này. crm lặp vì mỗi
vòng chép câu «Nhìn diff của lượt này: luật kho…» từ hồ sơ trước (không có khuôn
nào trong docs của crm). Kit sửa để kho khác không dẫm; crm nên có MỘT script
luật kho dùng chung qua `suite_keys` thay vì 9 judgment — việc của crm (§9).

### 10.7 Phạm vi chạm, đo trên mọi kho
Tệp chạm: `s4-args.mjs` + test · `eval-executors.md` · `judge-personas.md` ·
Phase 2 của skill acceptance · hai dòng ở S1 feature-loop (evals + gap-probe).
Không chạm `lib/**`, hooks, lưới trước-merge, danh sách chép sang kho. s4-args là
đường găng của mọi vòng mọi kho: kho không có dạng này (6/10) → im; vòng đang
chạy có dạng này → chặn ở lượt kế với lời sửa (đúng điều muốn cho crm
`va-tro-ly-okr-sau-thu`); hồ sơ đã ký → không chạy s4-args lại, không chạm.
