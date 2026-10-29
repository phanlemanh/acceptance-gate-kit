# Dùng lại kết quả eval model, và thước hồi quy toàn kho trong làn ghim lại — điều tra

Ngày 26/10/2026, phiên MacBook Pro theo lời chủ kho. Đây là sổ điều tra: chỉ đọc và đo, không sửa mã kit,
không mở vòng.

**Nguồn.** Một máy điều phối của kho tiêu thụ chính hỏi kit hai câu trên kênh điều phối (26/10 08:30Z),
ngay sau khi chủ kho xếp lại Vòng B «giá làn ghim lại» (`_acceptance/gia-lan-ghim-lai-vong-b/`, park 26/10).
Kho tiêu thụ là kho riêng: tệp này chỉ giữ số đếm và đường mã kit; tên hồ sơ, sha và lệnh của kho ấy nằm ở
tin trả lời trên kênh của nó.

**Phạm vi đo.** Mã kit trên `main` `35f494cc` (2.34.0 + #413 + #416 ở các tệp được trích). Sổ ghim lại của
kho tiêu thụ trên nhánh chính của nó, đã gồm lần bật khoá dùng lại (26/10 06:18Z). Một làn đang chạy đọc ở
nhật ký của nó, không chạm cây.

## Kết luận một đoạn

**Câu 1 — số 0 đúng là chỉ vì thiếu khoá, và thêm một điều: lượt đầu sau khi bật cũng không thể dùng lại.**
Không có `feature_loop.model_carry_cmd` thì làn không bao giờ băm, không bao giờ ghi `evals_hash`, nên
không bao giờ có nguồn — trên toàn bộ lịch sử nhánh chính của kho tiêu thụ không có một dòng ghim lại nào
mang `evals_hash`. Sau khi bật, lượt đầu của mỗi hồ sơ chỉ *tạo* nguồn; dùng lại xảy ra từ lượt thứ hai,
khi dòng xanh của lượt đầu đã nằm trong nhánh mà lượt sau chạy, chưa quá 7 ngày, và đầu vào không đổi.
Dự báo trên chính lịch sử 14 ngày: **trần 4/20** lần chạy eval model có đầu vào không đổi so với lần chạy
trước — khoảng 2 lần mỗi tuần, dưới vạch 5 lần/tuần của ngưỡng mở lại Vòng B.

**Câu 2 — kit đã có lối chuẩn, và kho tiêu thụ đã dùng nó một lần:** khai eval quét-toàn-kho `not-run`
kèm con trỏ `superseded_by` tới tiêu chí kiểm chéo đêm đã ký của chính kho ấy (khuôn `EVAL-THAY-BOI-TEMPLATE`,
2.24). Không cần mã kit mới, không cần mở lại Vòng B. Dùng lại theo băm (Đ2) **không** giải được ca này:
đầu vào thật của một thước quét mọi hồ sơ đã ký là gần cả kho, nên băm đổi ở gần mọi PR — đúng những PR
làm hồ sơ hoá cũ.

## Câu 1 — đường dùng lại trong mã

| # | Khẳng định | Kết luận | Căn cứ |
|---|---|---|---|
| 1.1 | Không có `model_carry_cmd` thì không bao giờ dùng lại | **ĐÚNG** | `feature-loop/scripts/repin-lane.mjs:579` — toàn bộ khối băm + chọn nguồn nằm trong `if (khoa.model_carry_cmd)`. Khoá vắng thì bảng `dungLai` rỗng, `:703–704` không có mục, eval đi thẳng `runCmd` ở `:717`. `dungLaiCua` (`:739`) chỉ ghi `evals_hash` khi mục có băm, nên dòng sổ không bao giờ mang khoá này. |
| 1.2 | Số 0 trong 12/10–26/10 chỉ do thiếu khoá | **ĐÚNG** | Kho khai `model_evals` từ 06/10 nhưng `model_carry_cmd` chỉ vào 26/10 06:18Z. Quét mọi `_acceptance/*/run-log.jsonl` trên nhánh chính sau lần bật: **0** dòng `repin`/`repin-do` mang `evals_hash` dạng đối tượng (747 dòng có khoá cùng tên đều là dòng `baseline`, nghĩa khác). |
| 1.3 | Bật khoá xong thì lượt kế dùng lại được | **SAI** — phải hai lượt | Nguồn = dòng `repin` mới nhất của CHÍNH hồ sơ nơi eval thật sự chạy VÀ mang `evals_hash` (`feature-loop/scripts/lib/dung-lai-model.mjs:118`, `chonNguon` `:123–134`); dòng đời trước không có băm nên lượt đầu nhận lý do «chưa có nguồn cùng băm» (`:132`). GUIDE §7.1 đã khai: «Lượt ghim lại đầu tiên sau khi bật chạy trọn» (`GUIDE.md:1622`). Nguồn là sổ của hồ sơ **trong nhánh đang chạy** — dòng của lượt đầu phải gộp vào nhánh chính rồi mới thành nguồn cho nhánh khác; hạn 7 ngày (`:133`). |
| 1.4 | Số đếm 28 của máy hỏi | **khớp, cách đếm khác** | `dem-dung-lai-model.mjs --tu 2026-10-12` trên cùng sổ in `model_goi 56 · model_carry 0 · carry_lech 0`: 56 cộng cả dòng `repin-do` (lượt đỏ/bị ngắt); 28 là riêng dòng `repin` xanh. Cả hai cách, carry = 0. |

### Dự báo tỉ lệ dùng lại khi khoá đã bật

12/10–26/10: 20 lần eval model chạy thật trong dòng `repin` có lần chạy trước để so. So `git diff` giữa sha
hai lần với lớp 2 và 3 của băm (tệp khớp `paths` của eval · cây hồ sơ trừ `run-log.jsonl` và
`evidence-report.md`): **4/20 không đổi**, rải trên ba hồ sơ. 16 lần còn lại đổi thật — mã sản phẩm mà eval
đo, thước của hồ sơ, `evals.yaml`, sổ quyết định. Bỏ thêm năm tệp hồ sơ không phải đầu vào (sổ quyết định,
thẻ, trang) khỏi lớp 3 vẫn ra 4/20 — lớp cây hồ sơ không phải chỗ làm hụt, không cần sửa kit. Đây là
**trần**: chưa tính lớp 5 (vân tay model, gồm băm khoá gói) và lớp 4. Hai eval model không khai `paths` sẽ
luôn chạy với lý do «eval không khai paths».

### Lượt ghim lại đầu tiên sau khi bật

Một làn `--tung-ho-so` 14 hồ sơ trên kit 2.34.0, bắt đầu 08:08Z, cây có `model_carry_cmd`. Trong 14 hồ sơ
chỉ một hồ sơ có eval model (hai eval). Kết quả đọc ở mục **Kết quả lượt đầu** cuối tệp.

## Câu 2 — thước «quét mọi hồ sơ đã ký» trong làn ghim lại

### Vì sao nó đốt giờ

Một hồ sơ đã ký (gọi là T) có ba eval chia ba phần một thước quét: quét mọi hồ sơ đã ký, chạy lại các eval
thuộc lớp trên cây rồi trên nền, cộng một phần soát đổi thước của chính diff vòng. Đo trên sổ của T: sáu
lượt làn 23–24/10, ba lượt chạy trọn **266–271 phút** mỗi lượt, cộng ≈ **14,9 giờ** khoá máy cho riêng T
trước khi nó gộp.

Cái biến nó thành thuế cho PR khác là `paths` của ba eval: một glob mọi thư mục thước dưới `_acceptance/`
và một glob cả thư mục test của ứng dụng.

- Lưới hoá cũ bỏ qua mọi tệp dưới `_acceptance/` (`scripts/pre-merge-check.sh:680`), nên glob đầu không bao
  giờ làm hồ sơ cũ. **Glob thư mục test là cò súng duy nhất** — PR nào chạm một tệp test của ứng dụng cũng
  làm T cũ.
- Làn ghim lại chạy MỌI eval máy của hồ sơ, không chạy riêng eval bị chạm — cò nào bắn thì ba phần quét cũng
  chạy, ≈ 4,4 giờ.

### Bốn lối, giá từng lối

| Lối | Làm gì | Giá | Được | Mất |
|---|---|---|---|---|
| **A. Khai `not-run` + `superseded_by`** (khuyến nghị) | Ba eval khai `status: not-run`, `superseded_by: <hồ sơ kiểm chéo đêm>#AC-n`, **bỏ `paths`**; hợp đồng hoặc tệp `design_doc:` của hồ sơ kiểm chéo nêu ba thẻ `<T>/<E>`; vế «soát đổi thước của diff vòng» ghi `descope` (chốt một lần của chính vòng T, đã đạt lúc gộp); ghim lại T một lượt — giờ ngắn | 0 dòng mã kit. Một PR tài liệu + một lượt ghim ngắn ở kho tiêu thụ. Một quyết định của chủ kho tiêu thụ | Hết ≈ 4,4 giờ mỗi lần T cũ; hết cò thư mục test | Hồi quy trong lớp bị bắt **sau** gộp (≤ 24 giờ, chỉ báo, gọi tên lần gộp gây đỏ) thay vì chặn trước gộp |
| B. Thu hẹp `paths` | Bỏ glob thư mục test khỏi ba eval, giữ chúng trong làn | Một lượt ghim 4,4 giờ | Hết cò thư mục test | Ba eval vẫn chạy 4,4 giờ mỗi khi T cũ vì lý do khác; và `paths` khai ít hơn thứ thước thật sự đo — lời hứa mất cò mà không ai giữ thay |
| C. Đ2 — dùng lại theo băm cho eval thường (Vòng B, đang park) | Mở lại Vòng B | T3 chạm `lib/**`, 10–20 giờ máy theo `opportunity.md`; một lượt gọi chủ kho | Có ích cho eval thường có đầu vào hẹp | **≈ 0 cho ca này**: đầu vào thật của thước toàn kho là gần cả kho; băm trung thực đổi ở gần mọi PR, và cò hoá cũ (glob thư mục test) cũng là một lớp của băm — PR làm hồ sơ cũ chính là PR làm băm đổi |
| D. Làn «thước theo lịch» trong kit | Dựng kiểu eval chạy đêm ở engine | Một vòng CỘNG cần chủ kho phê; chỉ một kho cần | Chuẩn hoá thứ kho tiêu thụ đã tự dựng | Làm lại lượt đêm kho ấy đã có; luật chiều rộng (b) — không có kho thứ hai chờ nhận |

**Vì sao A là lối chuẩn.** Kit 2.24 (`GUIDE.md:1704`, khuôn `EVAL-THAY-BOI-TEMPLATE`) nhận một eval đã ký khai
không chạy khi đủ chín điều kiện, kiểm lại ở mọi lượt (`lib/evidence-core.cjs:604`, bắt tay hai đầu `:635–638`):
hồ sơ thay đã có chữ ký người, AC được trỏ còn eval đạt trong báo cáo đã ký, và hồ sơ thay tự nêu thẻ của
eval cũ. Hồ sơ kiểm chéo đêm của kho tiêu thụ đã đủ hai vế đầu (đã ký; AC kiểm chéo có eval PASS). Kho ấy đã
đi đúng đường này ngày 08/10 cho một eval kiểm chéo khác (≈ 14 giờ máy một PR, bắt 0 hồi quy). Lối «giao cho
kiểm chéo đêm» mà phía kho đề xuất chính là lối A — chỉ cần đi qua con trỏ để lưới còn giữ lời hứa, thay vì
xoá eval im lặng.

**Hai bẫy khi làm A, đo trên mã:**

1. **Phải bỏ `paths` cùng lúc.** Bộ lọc hoá cũ vẫn cộng `paths` của eval `not-run` vào hợp
   (`lib/evidence-core.cjs:527–536` — chỉ ô `not-run` *không khai* `paths` mới được bỏ qua). Giữ `paths` thì
   glob thư mục test vẫn làm hồ sơ cũ — lượt ghim chỉ ngắn đi chứ không hết.
2. **Thẻ phải đứng riêng** trong `contract.md` hoặc tệp `design_doc:` của hồ sơ thay, dạng `<slug cũ>/<id cũ>`
   (regex `:636`). Không có thì lưới chặn với lý do `thay-khong-nhan`.

**Điều kiện trước khi chủ kho tiêu thụ quyết.** Máy này không đọc được tệp kết quả đêm (nằm ở máy chạy lịch).
Thẻ quyết định cần có: 7 tệp ngày gần nhất có mặt, các lần gộp được phủ đủ, và số mục đỏ-mới. Lượt đêm không
chạy đều thì lối A là bỏ lời hứa, không phải dời lời hứa.

### Không mở vòng ở kit

Cả hai ca «thước toàn kho trong làn ghim lại» của kho tiêu thụ (08/10 và 26/10) đều giải được bằng lối A
không cần mã kit. Hạt giống cho lối D chỉ đáng ghi khi có kho tiêu thụ thứ hai cần quét đêm, hoặc lối A vấp
thật ở chín điều kiện — chưa có ca nào.

## Kết quả lượt đầu

Đọc nhật ký làn lúc 09:21Z (làn còn chạy): eval model đầu tiên in `không dùng lại — chưa có nguồn cùng băm`.
Lý do ấy chỉ in được khi lệnh vân tay đã thoát 0 với đầu ra khác rỗng và eval đã qua mọi điều kiện đủ — nên
**đường dùng lại CHẠY**, băm đã tính, và số 0 của lượt này là đúng thiết kế (khẳng định 1.3), không phải
vân tay đổi. Không cần đuổi theo «vân tay đổi thật hay đường không chạy».

Lượt này có thành nguồn hay không tuỳ kết cục: làn xanh ghi dòng `repin` mang `evals_hash` → lượt sau cùng
đầu vào, trong 7 ngày, trên nhánh đã có dòng ấy thì dùng lại. Làn đỏ ghi `repin-do` — dòng ấy mang băm nhưng
không bao giờ là nguồn (`chayThat` đòi `kind: repin`, `dung-lai-model.mjs:118`).

**Chỗ đếm tiếp:** `node feature-loop/scripts/dem-dung-lai-model.mjs --root <kho> --tu 2026-10-26` sau 14 ngày.
`model_carry` > 0 là đường đã ăn; vẫn 0 mà mọi dòng ghi «băm đổi» là đầu vào đổi thật — đọc từng lý do trong
nhật ký làn.
