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
| Hẹp: hỏi diff của lượt mà `inputs` không có tệp diff · bảo chạy lệnh | 15 | soi tay: 15/15 đúng là hỏi thứ giám khảo không đọc được |

Phán quyết cuối của 15 ca hẹp: 9 UNCERTAIN · 6 PASS. Sáu PASS đều có lý do
không lành: bốn ca artifact-platform chấm tháng 6 — TRƯỚC khi khoá «chỉ đọc
inputs» có, giám khảo tự chạy lệnh; một ca crm (`tro-ly-okr-de-xuat`) PASS nhờ
một tệp bằng chứng tĩnh `luat-kho.md` mà chính giám khảo thứ ba chỉ ra là ghi HEAD
cũ hơn nhánh; một ca radar trả lời từ tệp đầu ra kèm theo. Sau 04/08: 9/11 ca
kết thúc UNCERTAIN.

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

## 8. Đề xuất — một vòng T2, CỘNG cần owner duyệt đích danh

Phạm vi (không chạm `lib/**` → T2):
1. `eval-executors.md` + Phase 1/2 của `skills/acceptance/SKILL.md`: chọn
   executor theo từng vế; judgment chỉ đọc `inputs`, không diff, không lệnh; vế
   kiểm được bằng lệnh → script/test của kho.
2. `eval-coverage-lint.js` W9 (bộ dò hẹp §3, miễn khi `inputs` có tệp diff) —
   thông điệp nói việc máy làm, không hỏi người; ca kiểm hai chiều.
3. gap-probe: thêm một ý vào câu hỏi chéo bắt buộc kèm sự thật nền «hội đồng chỉ
   đọc đúng `inputs`».
4. Feature-loop S1: W9 do máy xử trước Cổng Phạm vi (tách eval, một dòng sổ),
   không trình lên thẻ trừ khi còn sót.

Bảng dự báo năm dòng: làm-xong→quyết-được ↓ (người thôi phải tự đọc diff cho mục
luật kho) · lượt gọi người/vòng = ở các ca đã thấy (Cổng Bằng chứng vẫn dừng vì
T3 hoặc lỗi ngoài hợp đồng), ↓ ở vòng T2 mà mục này là thứ duy nhất làm hết
xanh-sạch · vòng bị hạ tầng đốt lượt chấm = · token máy/vòng ↓ (3 giám khảo ×
mỗi lượt chấm, cho câu hỏi không trả lời được) · phút máy/lượt chấm =. Điều kiện
tin cậy: đường verdict không đổi thành phần — chốt nằm ở bước sinh eval, không ở
làn chấm.

Chưa làm, kèm ngưỡng đang đếm:
- Bộ đọc khoan dung ở lượt chấm (không gọi hội đồng cho câu hỏi đòi diff, như
  nhánh không-inputs) — phải chia bộ dò giữa hai nơi, kéo vào `lib/**` (T3).
  Ngưỡng mở: ≥1 lượt chấm sau mốc phát hành vòng này vẫn gọi hội đồng cho câu
  hỏi đòi diff.
- Ô «chỉ người làm được» cho judgment — 1 ca (onehub). Ngưỡng mở: ≥2 kho.

## 9. Việc ngay ở crm (không phải việc kit)

Vòng `va-tro-ly-okr-sau-thu` không phải chờ kit: tách E14 thành một eval script
(các vế grep được, chạy trên HEAD hiện tại, qua một `config:` của crm) + một
judgment chỉ cho vế tài liệu; lỗi «chữ trên màn ghi cứng tên biến khoá» là sai
hợp đồng của AC-13 → máy sửa vật. Không ký «Đạt» cho E14 ở dạng hiện tại.
