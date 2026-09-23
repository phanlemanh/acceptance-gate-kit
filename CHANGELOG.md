# CHANGELOG — acceptance-gate kit

> Mỗi release một mục, nói tiếng người: đổi gì · ai bị ảnh hưởng · làm gì khi
> update. Sử chi tiết từng bản 1.x sống trong `description` của manifest
> (`.claude-plugin/plugin.json`) — file này bắt đầu từ 2.0.0.
>
> Tệp này dựng lại 14/09/2026 (owner gọi tên). Bản gốc ra đời ở đợt tái lập
> 2.0.0 nhưng nằm trên một nhánh không gộp vào nhánh chính, nên lịch sử
> 2.0.0 → 2.12.0 **không** có ở đây: chuyện của mười hai mốc đó sống trong
> `_acceptance/release-<x-y-0>/contract.md` và `evidence-report.md`. Mục đầu
> tiên dưới đây là phần CHƯA phát hành.

## 2.18.2 — 23/09/2026

Cửa sổ 2.18.1 → 2.18.2 kéo **một ngày**, có **một vòng** chạm engine do owner gọi tên:
`chot-may-chu-ky-sau-synthesize` (T2, ký 23/09). Kho chờ nhận là sáu kho vừa nâng 2.18.1: hai
kho đã ghim sha `8a4ea881` (oneflow #129, artifact-platform #392), ba kho đang chờ PR ghim sha
(media-library, floorplanstudio, MapPoster) và `crm` còn đi đường chép, chờ 2.18.3. Mốc đi
**làn V**, không dựng răng mới. Hai gói cùng lên `2.18.2`; `diagram-design` giữ `2.7.0`. Đây là
mốc đầu tiên có **tag** `v2.18.2`, gắn tại commit ký mốc.

**Đổi gì:**

- **Máy thôi được ký thay người trong báo cáo bằng chứng.** Tác tử tổng hợp của lượt chấm S4
  từng tự điền chữ ký người và tự đặt giờ đo. Đo 23/09: 13/84 báo cáo kit và 12/56 báo cáo crm
  mang giờ đo do tác tử đặt, 6 báo cáo crm mang giờ ở tương lai, và một chữ ký máy trên hồ sơ
  crm đã tới bước ghi tệp. Nay workflow tự ép rỗng `human_signoff`, `human_override`,
  `bypass_ack` và ép mọi `verified_at` bằng giờ engine trước khi trả báo cáo. Khối mang sang từ
  lượt trước giữ giờ gốc của nó. Chốt đổi dòng nào thì run-log có một dòng
  `kind: chot-truong-nguoi` nói số dòng đổi theo từng khoá, nên tần suất tác tử bịa vẫn đếm được.
  Người ký vẫn ký bằng `/acceptance-gate:signoff` như cũ.
- **Đường mặc định của CI là chạy cổng từ bản kit ghim sha, không chép tệp** (GUIDE §5.3, đổi từ
  23/09 trong cửa sổ này). Kho ghi `KIT_SHA` trong tệp workflow CI, job lấy kit về ngoài cây kho
  rồi chạy cổng từ đó. Từ mốc này kho cũng có thể lấy kit bằng tag:
  `git fetch --depth 1 origin refs/tags/v2.18.2`.

**Kho tiêu thụ làm gì khi nhận:**

- **Kho đã ghim sha** (oneflow, artifact-platform, và ba kho khi PR ghim sha gộp): đổi `KIT_SHA`
  từ `8a4ea881` sang commit ký mốc 2.18.2, hoặc lấy theo tag `v2.18.2`. Một PR, một dòng.
- **Kho còn đường chép** (`crm`): chép lại lớp CI theo **danh sách** ở GUIDE §5.3 cộng
  `skills/acceptance/references/opportunity-template.md`, tổng 16 tệp. Không tệp nào trong lớp
  chép đổi ở mốc này, nên kho đã đủ 16 tệp từ đính chính 2.18.1 không phải chép gì. Đường chép
  sẽ bị xoá ở 2.18.3.
- **Máy dev:** cập nhật plugin như mọi mốc. Không cần làm gì với hồ sơ đang mở. Bản engine mới
  chỉ đổi cách lượt chấm S4 ghi báo cáo.

**Giới hạn đã khai:**

- Chốt không chạm năm hình dạng override mà bộ đọc L3 vẫn đếm: giữa dòng bảng, trong chú thích,
  khoá có tiền tố trùng đuôi, bản ghi một dòng kiểu `{…}`, nội dung khối vô hướng. Danh sách một
  nguồn là khối `GIOI-HAN-CHOT` trong `acceptance-verify.js`. Nghiệm đúng tầng là neo dòng cho
  L3 của bên đọc. Owner không phê vế đó ở vòng này; nó nằm ở hạt giống
  `docs/plans/2026-09-23-hat-giong-rang-ben-doc-verified-at-chu-ky.md`.
- Chữ ký do phiên tự viết ngoài `/signoff` chưa bị chặn. Đó cũng là việc của răng bên đọc.
- Vòng đột biến `CTN-AC8-vi-phan` chạy riêng thì không tự kiểm đối chứng dương (Known limits
  Ngoài-2 của hồ sơ vòng).
- Giờ đo bịa đang nằm trong 25 hồ sơ đã ký (13 kit, 12 crm) chưa được chữa. Chúng chờ chiến dịch
  ghim lại theo run-log thật.
- `pre-merge-check.sh` dòng 376 và 397 còn đọc `lib/` theo đường của kho. Kho chạy cổng từ bản
  kit mà có hồ sơ `machine-cleared` thì chờ 2.18.3.

**Năm dòng số của luật (c) — vòng `chot-may-chu-ky-sau-synthesize`:**

| Dòng | Số | Nguồn |
|---|---|---|
| Làm-xong→quyết-được | Cổng Phạm vi ≈ 21 phút · dừng-vá ≈ 2 phút · trần 3 lượt ≈ 27 phút theo giờ tự khai trong sổ, dòng sổ ghi muộn hơn 2 giờ · ký lần 1 ≈ 16 phút · nâng phạm vi ≈ 38 phút từ lúc máy hỏi · ký lần 2 ≈ 18 phút. Code xong → chữ ký cuối: 7 giờ 8 phút | giờ commit + sổ quyết định |
| Lượt gọi người / vòng | **6** lượt, **6** chạm, mỗi lượt một lệnh. Trong thiết kế **4**: hai cổng (Cổng Phạm vi, ký lần 1) và hai điểm dừng SKILL liệt kê tường minh (dừng-vá, trần 3 lượt). Ngoài thiết kế **2**: «nâng phạm vi» sau chữ ký, ký lần 2. Mục tiêu T2 là ≤3. Đếm theo lệnh owner gõ: câu máy hỏi xác nhận và câu owner trả lời «nâng phạm vi» là MỘT lượt | sổ quyết định + git log |
| Vòng bị hạ-tầng-kit đốt lượt chấm | **0**. Năm lượt đều trả 14/14 phép đo, 0 BLOCKED. Lượt 3 REJECT vì vật | `run-log.jsonl` round-tally |
| Token máy / vòng | 5 lượt: **564 k** out-token, **6,78 M** token không-cache. Tách ba khối theo out-token: chứng-minh-vật 106 k (19 %) · tìm-lỗi 345 k (61 %) · tổng hợp 113 k (20 %). Phiên chính không đo | `usage-report.md` |
| Phút máy / lượt chấm | 30 · 28 · 40 · 30 · 24 phút, tổng 152 phút. Đường găng lượt 2 là khối máy 1 223 s trên 1 678 s, trong đó suite scripts 777 s | `wall` + bảng vai |

Dòng 4 chỉ lượt 2 còn nhãn vai. Bốn lượt còn lại tách theo model và số lượt gọi: tác tử máy chạy
haiku, rà soát chạy opus, còn triage, bác bỏ, chụp và tổng hợp chạy sonnet. Lượt 3 có hai tác tử
sonnet hai lượt gọi không phân được vai, nên khối tìm-lỗi và tổng hợp của lượt ấy lệch tối đa 5 k.

**Điều kiện tin cậy:** đường verdict không đổi thành phần. Chốt chạy SAU tổng hợp và chỉ đổi bốn
khoá, không đổi ai phán. Nó có răng hai chiều: đột biến AC-8 cho chiều đỏ, chiều im trên toàn
corpus báo cáo kit và crm (AC-6, AC-7). Số lượt chấm sai không tăng: lượt 3 REJECT đúng vật. Dòng
4–5 vì thế cắt được.

**Dự báo năm dòng cho thay đổi của mốc này:**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | ↓ ở kho tiêu thụ | người ký thôi phải gỡ tay chữ ký máy và giờ bịa trước khi commit |
| 2 | = | không cổng nào thêm bớt |
| 3 | = ở đường `s4-args.mjs` · ↑ ở kho tự dựng args thiếu `invokedAt` | args thiếu `invokedAt` mà báo cáo có `verified_at` thì lượt chấm BLOCKED có tên |
| 4 | = | chốt là một hàm JS, không thêm tác tử |
| 5 | = | chốt chạy trong vài mili-giây sau tổng hợp |

**Dòng hiệu chuẩn (ADR 0020):** `ĐẠT đã ký → prod đỏ: 0 / 1`, đọc trên kit bằng
`scripts/hieu-chuan-moc.mjs --root .`. N không tăng so với mốc trước ở phần kit.

**Nhát cắt có tên cho cửa sổ kế** (thứ tự owner xếp 23/09 trong `docs/plans/`):

1. **2.18.3 — lớp chép tự xoá**
   (`docs/plans/2026-09-23-hat-giong-lop-chep-tu-xoa-2-18-3.md`). Sửa hai dòng `$ROOT/lib` của
   `pre-merge-check.sh`, xoá danh sách chép ở `acceptance-init` và GUIDE, xoá ca `CE2`. Việc thứ ba
   của hạt giống, gắn tag, làm tay ở mốc này. Còn lại là đưa nó thành bước của `/signoff`.
2. **2.19 — máy hỏi ngoài thiết kế ở S1**
   (`docs/plans/2026-09-22-hat-giong-may-hoi-ngoai-thiet-ke-o-s1.md`).

## 2.18.1 — 22/09/2026

Cửa sổ 2.18.0 → 2.18.1 kéo **một ngày**, có **một vòng** chạm engine do owner gọi tên:
`ho-so-khep-thoi-hoi` (T3, ký 22/09). Mọi lỗ vá ở đây lộ ra trong đúng ngày `crm` cài 2.18.0 —
kho chờ nhận của mốc này vẫn là `crm`. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng lên
`2.18.1`; `diagram-design` giữ `2.7.0`.

**Đổi gì:**

- **Hồ sơ đã khép thôi bị đếm là «cửa veto đang mở».** Hồ sơ đã nghỉ, hoặc đã chấm bởi thực tế
  với dòng quan sát đủ vế, không còn hiện trong dòng NOTE của lưới trước-merge lẫn thẻ mở phiên.
  Cả hai hỏi CHUNG một vị từ `hoSoDaKhep`.
- **Thẻ của hồ sơ đã khép không còn ô hỏi nào.** Trước bản này, 15 hồ sơ nghỉ vẫn mang câu «veto
  hay để yên». Hồ sơ thực tế thiếu dòng quan sát KHÔNG được gọi là khép — thẻ vẫn hỏi «ký hay trả».
- **Làn máy-đi-trước đọc cả tệp phát hiện.** Báo cáo để trống «Ngoài hợp đồng» mà
  `review-findings.md` còn mục chưa ai quyết thì hồ sơ không còn là xanh-sạch. Mục đã có dòng sổ
  gate2 của người («Ngoài-N») thì coi là đã định tuyến, không bắt ký lại.
- **Lớp CI vendored lên 15 tệp**, tính bằng bao đóng nạp của ba lệnh CI. `crm` từng đỏ CI ngày
  cài vì thiếu `product-map.mjs` và `trang-thai-ho-so.cjs`.

**Kho tiêu thụ phải làm khi cài:** đồng bộ lớp CI theo **danh sách** ở GUIDE §5.3 (không theo
con số: kho ở 2.18.0 thêm 5 tệp, kho ở 2.17 thêm 6, kho ở 2.16 thêm 7 — đo 23/09 trên sáu kho) và
**xoá** `lib/out-of-contract.js` — tệp đổi tên thành `lib/out-of-contract.cjs`.

**Đính chính 23/09/2026:** danh sách 15 tệp còn thiếu `skills/acceptance/references/opportunity-template.md`
mà `product-map.mjs` đọc; chép 15 tệp thì lệnh bản đồ thoát 2 (ENOENT). **Kho nâng từ bản dưới
2.13:** bản này thôi miễn cho làn ghim lại chỉ-chạy-suite (ADR 0014, 0015) — hồ sơ ghim bằng làn
ấy sẽ đỏ `[cua-van-hanh]` ngay lượt CI đầu (media-library: 9 hồ sơ); chạy chiến dịch ghim lại
(GUIDE §7.1) trước khi merge PR nâng. Từ 23/09 GUIDE §5.3 đổi đường mặc định sang **chạy cổng từ bản
kit ghim sha, không chép tệp** — hồ sơ: `docs/findings/2026-09-23-nang-sau-kho-len-2-18-1.md`.

**Giới hạn đã khai:** nhãn «Ngoài-N» là vị trí mục trong tệp phát hiện, nên một lượt chấm mới có
thể làm dòng sổ cũ trỏ nhầm mục (hạt giống `docs/plans/2026-09-22-hat-giong-nhan-ngoai-n-neo-theo-noi-dung.md`);
mutant 2 trong bộ đo của hồ sơ đã ký `lan-v-khong-phai-cho-ky` hỏng vì chữ ký hàm mới.

## 2.18.0 — 21/09/2026

Cửa sổ 2.17 → 2.18 kéo **hai ngày**, có **hai vòng** chạm engine, cả hai do owner gọi tên:
`ghim-lai-noi-ra-o-khong-do` (T2, ký 20/09) và `nhan-trang-thai-va-reality` (T3, ký 21/09,
ADR 0020). Đây là mốc đầu tiên có **kho chờ nhận đo được trước khi cắt**: ba hồ sơ ở `crm`
đang chờ đúng ba thứ bản này mang tới. Mốc đi **làn V**, không dựng răng mới. Hai gói cùng
lên `2.18.0`; `diagram-design` giữ `2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Test của kho thôi bị đếm là thước.** Trước bản này, kho làm TDD bị phạt: mỗi lần sửa một
  tệp test bị đếm là một «nhát sửa thước», và ba nhát là lượt chấm bị chặn. Ở `crm`, ba nhát
  vào `apps/api/test/*.spec.ts` đã làm trần nổ đúng như thế. Nay test của kho là vật. Để
  không mất lưới, thước chuyển thành **chỉ-đọc trong lượt chấm**: máy chụp băm các tệp thước
  trước lượt và so lại sau lượt. Lệch thì thẻ khoá với nhãn «thước lệch» và nêu đúng tệp.
- **Thẻ Cổng Bằng chứng gọi đúng tên thứ đang gãy.** Trước đây mọi BLOCKED trông giống
  nhau: thẻ không có dòng lệnh, và người lái không có ô nào để chấp nhận một đồng hồ chưa
  đọc. Nay thẻ tách ba nhãn. **«Không đọc được ở đây»** là bàn đo không chạy được: thẻ mở ô
  ký có tên, kèm ba lối và ba giá. **«Hệ thống chết»** khoá lần đầu và mở sau đúng một lần
  thử lại. **«Thước lệch»** luôn khoá. Đỏ vì sản phẩm sai thì vẫn khoá như cũ. Ký trên cạnh
  gãy không hạ verdict: báo cáo giữ BLOCKED, và mỗi mục mang một dòng sổ có tên.
- **Reality có quyền đóng hồ sơ.** Một hồ sơ mà vật đã chạy trên prod từ lâu không còn phải
  dựng thêm thước chỉ để đóng. Lệnh mới `/acceptance-gate:observed` cho **người** ghi bản dựng
  đang phục vụ prod, ngày quan sát và tên. Hồ sơ chuyển sang «đã chấm bởi thực tế», rời nhóm
  đang dở, và mọi việc thước trên nó bị khoá. Lệnh này khoá với máy như sáu thao tác cổng
  người kia.
- **Thẻ in nguyên văn ý định.** Câu «vì sao làm việc này» từ ô cơ hội đi suốt tới lúc ký.
- **Một dòng hiệu chuẩn cho chữ «đủ».** `scripts/hieu-chuan-moc.mjs` in «ĐẠT đã ký → prod
  đỏ: k / N». Khi chưa hồ sơ nào có dòng quan sát prod, dòng in «vô hiệu» chứ không in «0 sự
  cố».
- **Ghim lại nói ra ô nó không đo.** Dòng ghim và thẻ cả hai cổng nêu các ô ngoài làn máy,
  ô mà diff đã chạm vật đo, và AC không có chốt máy. Không đổi hành vi chặn nào.

**Ai bị ảnh hưởng / làm gì:**

- **`crm`:** nâng engine, rồi đóng hoặc chấm ba hồ sơ đang chờ bằng các lối mới. Không phải
  dựng thêm bàn đo nào.
- **Mọi kho:** lớp tệp chép vào CI tăng từ **9 lên 10**. Chép lại
  `scripts/pre-merge-check.sh`, `scripts/recheck-evidence.cjs`, `lib/workspace-record.cjs`,
  và **thêm** `lib/nhan-canh-gay.cjs`, cùng một lượt. Thiếu tệp mới thì hai bộ đọc của lưới
  không nạp được.
- **Kho có hồ sơ đã ký dùng trần nhát sửa thước:** eval của trần ấy mất tiền đề. Ở kit, đó
  là `thuoc-co-cua` E17. Cho hồ sơ ấy nghỉ bằng một dòng sổ ở chiến dịch ghim lại.

**Giới hạn đi cùng bản này** (nguyên văn ở mục Notes của
`_acceptance/nhan-trang-thai-va-reality/contract.md`): hồ sơ còn ở nháp vẫn nhảy thẳng sang
«đã chấm bởi thực tế» được, vì hook tự nhận là chặn nhưng không có mã nào chặn. Nhánh «không
tìm thấy lần lưu dòng quan sát» chưa có ca đỏ, và thông điệp của nó gợi ý sai cách sửa. Bộ
đếm thước bỏ qua phép so khi tệp tham số hỏng.

## 2.17.0 — 19/09/2026

Cửa sổ 2.16 → 2.17 kéo **một ngày**, có đúng **một vòng** chạm engine (`ho-so-nghi`, T3, ký
với giới hạn) cộng một bản vá đã ký từ cửa sổ trước (`nen-cong-cu-lenh-shell`). Mốc đi **làn
V**: một lượt người ở Cổng Phạm vi, không dựng răng mới, năm dòng số đếm tay. Hai gói cùng lên
`2.17.0`; `diagram-design` giữ `2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Một hồ sơ đã ký mà lời hứa của nó chết thì thôi chặn mọi PR.** Trước mốc này, một hồ sơ đã
  ký xong rồi mất tiền đề — kho nguồn của một phần phụ thuộc biến mất, nhà cung cấp gỡ một mô
  hình, hay chính đội cố ý đổi vật sau chữ ký — không có lối ra nào: luật đòi ghim lại, mà
  không ai ghim được. Người vận hành phải bỏ qua bằng tay ở mỗi lần mở PR. Nay có lối ra: một
  người viết **một dòng** vào sổ quyết định của hồ sơ, mang tên mình và một câu lý do. Khối
  lệnh bấm được nằm ở mục «Cho một hồ sơ nghỉ» trong sổ tay. Hồ sơ ấy rời khỏi lưới, và
  **không tệp đã ký nào đổi một byte** — chữ ký là sử liệu. Bốn nơi đọc cùng hỏi một hàm, nên
  lưới, bộ kiểm lại bằng chứng, bản đồ và thẻ nói cùng một chuyện. Mở lại bằng một dòng nữa.
- **Chỉ hồ sơ đã có chữ ký người mới nghỉ được.** Đây là nhát thu phạm vi có căn cứ đo được:
  trước khi thu, một hồ sơ bị bác và chưa ai ký, thêm đúng một dòng, là cổng thoát xanh.
  «Nghỉ» nghĩa là một lời hứa **đã ký** nay không kiểm lại được; hồ sơ chưa qua cổng thì bác
  hoặc xếp lại ở tầng cơ hội. Hồ sơ đi làn máy-đi-tiếp không có chữ ký nên phải ký trước.
  Dòng viết thiếu, một câu văn xuôi, hay thư viện vắng: tất cả chấm như hồ sơ đang sống, và
  lưới **nói ra** vì sao thay vì im.
- **Cảnh báo sai trên thẻ duyệt phạm vi đã tắt.** Đường nền hạ tầng đọc từ đầu của mỗi lệnh
  khai trong cấu hình rồi hỏi máy xem chương trình ấy có không. Lệnh dựng bằng cú pháp shell
  bị cắt cụt thành một chuỗi vô nghĩa, nên nó báo «thiếu công cụ» cho một công cụ vẫn chạy
  tốt. Một kho tiêu thụ vì thế mang cờ vàng trên **mọi** thẻ Cổng Phạm vi vì lý do sai — mà cờ
  luôn bật là cờ người ta học cách bỏ qua. Nay nó chỉ tra khi lệnh thật sự bắt đầu bằng một
  tên chương trình, và nói ra khoá nào nó cố ý không tra.

**Ai bị ảnh hưởng / làm gì:**

- **Kho đang bị một hồ sơ chết tiền đề chặn:** nâng engine, rồi viết một dòng nghỉ cho hồ sơ
  ấy theo khối lệnh trong sổ tay. Không cần migrate gì, không đụng hồ sơ nào khác.
- **Kho khai executor dựng bằng cú pháp shell:** cờ vàng thường trực trên thẻ Cổng Phạm vi sẽ
  tắt sau khi nâng. Không phải làm gì thêm.
- **Mọi kho:** lớp tệp chép vào CI có **ba** tệp đổi (`scripts/pre-merge-check.sh`,
  `scripts/recheck-evidence.cjs`, `lib/workspace-record.cjs`) — chép lại ba tệp ấy cùng lượt
  nâng. Bộ kiểm lại bằng chứng nay nạp `lib/workspace-record.cjs`; tệp ấy vốn đã nằm trong
  danh sách chép, và cả năm kho đang chạy bộ kiểm lại đều đã có nó (đo 19/09).

**Giới hạn đi cùng bản này** (nguyên văn ở `_acceptance/ho-so-nghi/contract.md` mục Known
limits, mỗi mục kèm lệnh tái lập): bản đồ và bộ quét còn lệch nhóm ở hai hình dạng hiếm (hồ sơ
nghỉ có phiên nghiệm thu, hoặc có ô cơ hội hỏng); ba phép đo của chính vòng chưa đủ chặt, trong
đó một đối chứng chưa bao giờ chạy. Cả năm là **phép đo**, không phải hành vi; vật sản phẩm qua
mọi phép đo máy và năm lệnh suite ở cả ba lượt chấm.

## 2.16.0 — 18/09/2026

Cửa sổ 2.15 → 2.16 kéo khoảng **một ngày** — ngắn nhất từ khi kit đếm năm dòng số.
Trong ngày đó kho chạy đúng **một** vòng meta, `thuoc-co-cua` (T3, ký 17/09), đúng
vòng mà mốc trước đã gọi tên sẵn. Nó lấy ba câu hỏi từ bảng 23 lớp hạ tầng — đứng
được trước khi chấm · chạy không đè nhau · cửa cho thước — và biến cả ba thành vật
máy giữ. Ba việc còn lại của cửa sổ là vá và sổ sách, không việc nào chạm engine.
Mốc này cũng chạy **chiến dịch ghim lại**, thứ hai cửa sổ trước đã hoãn — và nó
đỏ, nên nay có số thay cho phán đoán: một lượt làn trên trọn 72 hồ sơ đã ký tốn
2 giờ 25 phút máy, gặp 14 hồ sơ mất tiền đề, và vì luật «làn đỏ thì không ghi gì»
nên ghim lại được 0 hồ sơ. Hai gói cùng lên `2.16.0`; `diagram-design` giữ
`2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Tường hạ tầng lộ ở đầu vòng, không lộ giữa lượt chấm.** Trước đây một công cụ
  thiếu hay một lưới chưa cắm chỉ lộ khi lượt chấm đã chạy được nửa đường, và lượt
  ấy trả BLOCKED — ở vòng sản phẩm gần nhất, 2 trên 3 lượt chấm mất vì lớp này và 4
  trên 8 lần gọi người là hạ tầng. Nay đầu S1 có một **đường nền hạ tầng** chạy bằng
  máy, không LLM, bốn chân: mọi lệnh executor có trên máy chưa · các lệnh suite chạy
  một lần lần lượt rồi cây còn sạch không · lưới trước-merge chạy được như trên CI
  không · ba bản bộ máy có khớp nhau không. Kết quả thành một khối «Nền hạ tầng» trên
  thẻ Cổng Phạm vi, nên thứ chỉ người gỡ được gom đúng một lần vào lời mời cổng thay
  vì rải ra từng lượt. Hồ sơ cũ không có khối này thì thẻ treo một cờ vàng, không chặn.
- **Lệnh suite trong lượt chấm chạy lần lượt.** Làn chấm vẫn chạy mọi lệnh song song,
  kể cả những lệnh chạy trọn một bộ test trên cùng một cây. Hệ quả đã đo ở bốn kho: hai
  suite giẫm lên nhau, một chốt «cây sạch» bắt nhầm thư mục tạm của suite kia, và lượt
  chấm đỏ vì hạ tầng chứ không vì vật — chính lượt chấm 1 của mốc trước mất vì thế. Nay
  lệnh suite xếp một hàng tuần tự; lệnh eval vẫn song song như cũ.
- **Thẻ Cổng Bằng chứng thôi gọi một giới hạn đã khai là trượt.** Một eval được phép
  khai trước rằng mã thoát mong đợi của nó khác 0. Làn ghim lại đã hiểu điều đó từ
  2.11.0, nhưng thẻ thì không: nó đọc mọi mã khác 0 là trượt và nói ngược danh sách
  eval đỏ. Nay thẻ đọc cùng một nguồn với làn.
- **Lượt chấm nghe lời khai «không chạy».** Một eval tự khai `status: not-run` vẫn bị
  bộ sinh args đưa vào lượt chấm rồi chết ở đó — ca thật: một hồ sơ ở repo tiêu thụ
  phải đổi sang khai mã thoát để né, và một eval của vòng sản phẩm gần nhất bị thi
  hành rồi BLOCKED. Nay bên viết args và làn ghim lại rút danh sách từ **cùng một hàm**,
  và báo cáo nói ra ô bị loại bằng một dòng thay vì im.
- **Sửa thước có cửa.** Kit vốn đếm và chặn được «ngoài hợp đồng», nhưng việc sửa chính
  phép đo thì không có tên, không được đếm, không có trần — ở hai kho tiêu thụ, một
  phiên có 9 chỗ hỏng thước so 1 chỗ hỏng vật và 701 dòng thước so 20 dòng vật. Nay một
  bộ đếm suy từ git xếp mỗi tệp đổi vào một lớp và đếm số **nhát sửa thước** kể từ lúc
  hợp đồng sang «code xong»; thẻ Cổng Bằng chứng in một dòng «vật · thước · nhát»; và
  từ nhát thứ ba, bộ sinh args **từ chối sinh** rồi trình ba lối cho người: khai giới
  hạn có tên, đổi cách đo, hay mở một vòng có chủ ngữ là thước. Người chọn thì một dòng
  sổ mở van và mốc đếm dời tới đó.

**Ai bị ảnh hưởng / làm gì:**

- **Repo tiêu thụ — không có bước migrate.** Mọi khoá mới đều có đường đọc-cũ.
- **Repo tiêu thụ — lượt chấm có thể DÀI hơn.** Lệnh suite nay tuần tự, nên đường găng
  dài ra ở repo có nhiều suite nặng chạy song song được. Đổi lại là lượt chấm thôi đỏ
  giả vì hai suite giẫm nhau.
- **Repo tiêu thụ — eval khai không-chạy thôi bị thi hành.** Repo nào đã lách bằng cách
  khai một mã thoát mong đợi có thể khai lại cho đúng.
- **Repo tiêu thụ — lớp CI vendored:** không tệp nào trong bộ chín tệp đổi ở mốc này,
  không phải chép lại.

**Giới hạn đã khai:** đường nền hạ tầng chạy nền song song với lúc S1 còn viết tệp có
thể báo cây bẩn vì tệp của chính vòng; kho tự host kit không tự nhận ra điều đó với
lệnh mà tài liệu dặn, nên chân kiểm ba bản bộ máy có thể lệch giả. Ba phép đo của chính
vòng — hai ca thẻ và một ca chiều đỏ — chưa độc lập với nhau, đã tách thành một ô riêng
cho cửa sổ sau.

**Chi phí của chính cửa sổ:** vòng meta duy nhất tốn 54,8 triệu token cho hai lượt thi
công và ba lượt chấm, trong đó 30,0 triệu ở lượt chấm. Chiến dịch ghim lại của mốc
thêm 2 giờ 25 phút máy và không ghim được hồ sơ nào. Khối tìm-lỗi chiếm 71 % token
lượt chấm — vòng này không chạm giao diện nên không có làn nào khác chia mẫu số. Lượt
gọi người 5 so trần 4, vòng thứ năm liên tiếp vượt trần; lượt vượt là một lần owner phải
tự bắt lỗi mà bộ chấm cho qua. Một lượt thi công chết trọn vì hạn mức phiên. Số đầy đủ
và nhát cắt cho cửa sổ kế ở khối Notes của hồ sơ mốc.

## 2.15.0 — 17/09/2026

Cửa sổ 2.14 → 2.15 chạy dưới quyết định R của owner (16/09): không mở vòng meta
mới, đo cái đã ship trên một vòng sản phẩm thật. Vòng đó là `skill-system-v1` ở
OneFlow, ký 17/09 — lần đầu sau hai cửa sổ có một tính năng tới tay người dùng
trên kit mới. Cửa sổ vẫn có một vòng meta đã ký, `guide-chep-ci-buoc-vao-writer`,
ký buổi sáng trước khi R được chốt — đúng trần một vòng của luật. Ba việc nhỏ của
kit vào cửa sổ qua chip sau R; owner quyết đếm chúng là vá-trong-mốc và đếm đủ. Hồ sơ mốc `_acceptance/release-2-15-0/` có tiêu chí
cho cả ba, cùng năm dòng số lần đầu có cột từ repo tiêu thụ. Hai gói cùng lên
`2.15.0`; `diagram-design` giữ `2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Thẻ `/start` thôi mời viết code cho thứ đã ở nhánh gốc.** Ca thật ở
  crm-onehub 16/09: một hồ sơ đã merge từ 04/09 bị đặt ngược về «đã duyệt» để
  xếp lại, thẻ đọc thành «viết code», và một phiên 8 giờ 25 phút chấm lại thứ
  đang chạy trên prod. Nay hồ sơ «đã duyệt» có bằng chứng mang commit đã nằm
  trong lịch sử của cây — kể cả bản bằng chứng đã đổi tên khi xếp lại — hiện
  thành dòng riêng «vật đã nằm trong nhánh gốc», không có bước máy kế. Người chọn
  một trong hai lối ngay trong câu hỏi chọn sẵn có: đóng theo quan sát, hoặc chấm
  lại. Không thêm câu hỏi, không thêm cổng. Đo trên crm-onehub: cả bốn hồ sơ cùng
  hình dạng rơi vào dòng mới.
- **Lượt ghim lại dừng khi một phép đo ghi đè bằng chứng đã ký.** Cũng ở
  crm-onehub 16/09: một phép đo trong suite chung ghi lại tệp bằng chứng của một
  hồ sơ đã ký sau mỗi lượt chạy, ở mọi worktree, mất khoảng 450 dòng so bản đã
  ký, và không răng nào thấy. Nay làn ghim lại chụp cây của mọi hồ sơ đã thông
  Cổng Bằng chứng trước suite và sau eval; có tệp bị chạm thì làn đỏ, in đường
  từng tệp, không ghi gì. Luật đi kèm: lệnh chạy lại ghi tạo phẩm ra
  `.acceptance-runs/<slug>/` hoặc thư mục tạm, không bao giờ vào `_acceptance/`.
  Hai trạng thái «đã thông cổng» của răng hỏi đúng một nguồn trong bộ máy, không
  chép — owner đã veto lối khai gạch hai tệp trong một hồ sơ đã ký.
- **Dòng `/goal` thôi chặn hai kiểu dừng hợp lệ.** Ở vòng R1, hook `/goal`
  chặn 11 lần máy dừng đúng luật: 2 lần khi máy chờ người cài một công cụ còn
  thiếu trước bước nghiệm thu, 9 lần khi máy dừng ở trần sửa thước chờ người chọn
  lối — và máy trả lời lại cùng một câu 7 lượt. Bộ chấm của hook hiểu «chờ người»
  là chỉ ở tầng cả vòng. Khuôn mới nói rõ hai kiểu dừng giữa vòng ấy cũng là «chờ
  người», với điều kiện máy nêu đích danh tiền đề hoặc các lối để chọn; dừng không
  nêu gì vẫn bị chặn. Hiệu lực thật chỉ đo được ở vòng sản phẩm kế.
- **Kho kit: thẻ `/start` đếm vòng meta đang mở.** Luật cho tối đa một vòng meta
  giữa hai mốc, nhưng cửa sổ 2.13 → 2.14 có hai vòng chạy song song ở hai phiên
  và con số chỉ lộ khi mốc đếm. Ở chính kho kit, thẻ nay in «vòng meta đang mở
  trong cửa sổ: N» kèm tên, và cờ khi N từ 2 trở lên. Không cổng, không lệnh.
  Repo tiêu thụ không thấy dòng này.

- **Danh sách chép lớp CI ở GUIDE §5.3 khai đủ chín tệp**, và một phép đo buộc
  hai bản khai danh sách ấy vào các tệp mà cổng merge thật sự nạp. Trước đó GUIDE
  thiếu hai tệp; kho chép theo GUIDE sẽ tắt lặng một lớp cưỡng chế.

**Ai bị ảnh hưởng / làm gì:**

- **Repo tiêu thụ — làn ghim lại có thể ĐỎ sau khi update.** Script đo nào còn
  ghi tạo phẩm vào thư mục bằng chứng của một hồ sơ đã ký sẽ làm làn dừng, kèm
  đường tệp bị chạm. Việc phải làm: chuyển đích ghi của script đó sang
  `.acceptance-runs/<slug>/` (thêm thư mục này vào `.gitignore`). crm-onehub là ca
  đã biết, ở phép đo lai-ra-man của vòng chan-lai-component-ra-man.
- **Repo tiêu thụ — thẻ `/start`:** không có gì phải làm. Hồ sơ «đã duyệt» mà vật
  đã merge sẽ tự hiện ở dòng mới ở lần quét kế.
- **Repo tiêu thụ — lớp CI vendored:** không tệp nào trong bộ chín tệp đổi ở mốc
  này, không phải chép lại.
- **Kho kit:** thẻ mở phiên có thêm một dòng đếm vòng meta.

**Giới hạn đã khai:** phép hỏi «vật đã ở nhánh gốc» so với HEAD của cây đang
quét, không với nhánh gốc có tên. Lối «đóng theo quan sát» chưa có trạng thái hồ
sơ để ghi, nên dòng vẫn hiện sau khi ghi quyết định — nguyên thuỷ «xếp lại cho
vòng» còn thiếu, đã có tên ở ô `thuoc-co-cua`. Vòng S4 và CI chưa chụp cây hồ sơ,
chỉ làn ghim lại chụp. Dòng đếm vòng meta nhận hồ sơ mốc theo tên
`release-<x>-<y>-<z>`.

**Chi phí của chính cửa sổ:** vòng sản phẩm R1 tốn 147,8 M token cho bốn lượt S4,
cùng cỡ vòng meta nặng nhất của 2.14. Khối tìm-lỗi rơi về 9,5 %, nhưng làn `ui`
chiếm 91 % lượt cuối. Lượt gọi người 7 cộng 1 so trần 4, vòng thứ tư liên tiếp vượt trần.
Việc meta của cửa sổ không có số token nào: vòng đã ký không có báo cáo chi phí, các phiên chip không chạy `wf-usage`.
Số đầy đủ và nhát cắt cho cửa sổ kế ở khối Notes của hồ sơ mốc.

## 2.14.0 — 15/09/2026

Cửa sổ 2.13 → 2.14 có **hai** vòng đã ký, trong khi luật (b) cho một. Hồ sơ mốc
`_acceptance/release-2-14-0/` ghi thẳng điều đó, cùng năm dòng số của cả hai vòng
đếm bằng một luật và đối chiếu chéo giữa hai phiên. Hai gói cùng lên `2.14.0`;
`diagram-design` giữ `2.7.0` vì không đổi một dòng.

**Đổi gì:**

- **Trạm phân loại phạm vi thôi hỏng vì định danh do máy-nói chép sai** (vòng
  `do-tin-tram-phan-loai`). Trước đây kết quả phân loại được ghép về từng phát
  hiện bằng tiêu đề và đường dẫn do tác tử chép lại; chép lệch một ký tự là cả
  lượt rơi về đường «bác bỏ tất cả». Hai số đo, từ HAI vòng khác nhau — nói rõ để
  không ai đọc thành một: vòng `khoi-tim-loi-tra-phi-theo-vat` hỏng **3/6** lượt
  vì lớp này; và ở vòng `chu-ky-khong-tu-lam-hoa-cu`, lượt mất phân loại tốn
  **37 tác tử · 32,7 M token** so **13,7–16,7 M** ở bốn lượt có phân loại chạy
  đúng của cùng vòng. Lượt PASS của vòng ấy (50,2 M) đứng NGOÀI phép so vì nó
  chạy đối chứng đầy đủ trên cây đã gộp — bản trước của mục này gộp nó vào «mọi
  lượt lành» và vì thế nói quá. Nay mỗi phát hiện gửi đi mang một **mã do máy đúc**, kết
  quả ghép theo mã trước, mã lạ bị bỏ, và khi kết quả thiếu mã nào thì máy **hỏi
  lại đúng một lần** chỉ phần thiếu trước khi đặt cờ hỏng. Luật fail-toward-human
  không đổi: hỏi lại vẫn thiếu thì bác bỏ chạy toàn bộ như cũ.
- **Chữ ký thôi tự làm bằng chứng của chính nó hoá cũ.** Đo 14/09: từ lúc owner
  gõ «Ký» tới lúc báo sẵn-sàng-merge mất **54 phút** và **≈ 42 M token**, và
  **7/7** chữ ký của tuần đều chạy **ba** lượt làn máy ≈ 13 phút. Nguyên nhân
  không phải xui: ca canh định tuyến chỉ soi hồ sơ ĐÃ ký, nên chính chữ ký buộc
  bản ghi mốc thêm một dòng — mà tệp ấy là code, nên lưới trước-merge gọi bằng
  chứng hoá cũ và bắt ghim lại. Hai nhát: bản ghi mốc nay là **vật máy sinh**
  (dòng của nó do một lệnh sinh ra ngay trong lượt ký, cùng lớp với bản đồ sản
  phẩm — ADR 0019), và **làn trước chữ ký tự bỏ qua khi cây không đổi so với
  mốc đã chứng** (`--skip-unchanged`). Cây đã đổi sau khi chứng thì làn vẫn
  chạy trọn và luật đỏ y nguyên.

**Ai bị ảnh hưởng / làm gì:**

- **Repo tiêu thụ — HÀNH VI của engine: không có gì phải làm.** Trạm phân loại
  đòi tác tử trả thêm một trường mã; không trả thì rơi về khoá cũ. Cờ
  `--skip-unchanged` là tường minh, mặc định làn vẫn chạy trọn.
- **Repo tiêu thụ — LỚP CI VENDORED: PHẢI chép lại.** Câu trên chỉ nói về hành
  vi engine; nó KHÔNG miễn cho bạn bước chép. Bản đầu của mục này để mỗi câu
  «không có gì phải làm» nên đọc thành cả hai, và đợt rollout 16/09 cho thấy
  điều đó sai: so với **2.11.0** có **4/9** tệp đổi (`pre-merge-check.sh`,
  `evidence-core.cjs`, `ac-line.cjs`, `md-section.cjs`); kho còn ở 2.8.0/2.9.0
  thì thiếu hẳn `eval-yaml.cjs` và `lop-nhin-thay.cjs`, mà thiếu tệp nào là
  **tắt lặng một lớp cưỡng chế** trong khi CI vẫn xanh. Chép **đủ 9 tệp** theo
  khối `INIT-CI-COPY-LIST` của `commands/acceptance-init.md`.
- **Repo tiêu thụ — hai cái bẫy đo được trong đợt rollout đó:**
  - **PR nâng lớp vendored đỏ ở luật T1-escape** nếu kho chưa khai 9 tệp
    kit-owned trong `t1_skip_globs` (chúng là THƯỚC, không phải product code).
    Kho khai chúng trong `t3_paths` thì phải **rút khỏi t3_paths** — cổng kiểm
    `t3_paths` TRƯỚC `t1_skip_globs`, nên chỉ thêm vào skip là vô ích.
  - **Chạy `pre-merge-check` trước khi commit là phép đo nói dối:** luật
    T1-escape đọc diff ĐÃ COMMIT, nên bản vừa chép còn nằm ngoài commit là vô
    hình với nó. Bảy kho báo `clean` ở local rồi ba kho đỏ trên CI vì đúng lớp
    này. Kiểm sau commit, trên worktree dựng từ chính nhánh đó.
- **Kho tự host kit:** lượt ký ra sẵn-sàng-merge trong vài phút thay vì cả giờ
  (ADR 0019).

**Giới hạn đã khai:** bảy mục của vòng `do-tin-tram-phan-loai` đều ở tệp ca
hoặc chẩn đoán nội bộ; tải gửi trạm phân loại còn viết ở hai chỗ — đã vào hạt
giống cửa sổ kế (`docs/plans/2026-09-15-hat-giong-mot-nguon-tai-gui-triage.md`).
Vị từ «cây bằng pin» phía bash và phía JS chỉ đồng nghĩa trên danh sách T1 hiện
tại, ngưỡng đang đếm ở ADR 0019.

**Chi phí của chính cửa sổ (máy đo, hai vòng):** ≈ 199,9 M token cho hai vòng
meta; lượt gọi người **5 và 5** so trần 3 — mọi lượt vượt đều là lỗi hình thức
của máy, không lượt nào là quyết định thật. Số đầy đủ và chín nhát cắt cho cửa sổ
kế ở khối Notes của hồ sơ mốc.

## 2.13.0 — 14/09/2026

Cắt số tại `ea26fdfe` (14/09). Mục này ghi những gì đã gộp vào nhánh chính từ
lúc 2.12.0 được ký (`7e260d4b`, 14/09) tới lần cắt đó.

Trọn phần dưới đây đến từ MỘT vòng: `khoi-tim-loi-tra-phi-theo-vat` — vòng
meta duy nhất của cửa sổ 2.12 → 2.13 (luật (b), owner gọi tên 14/09). Hồ sơ:
`_acceptance/khoi-tim-loi-tra-phi-theo-vat/`.

**Đổi gì:**

- **Khối tìm-lỗi của S4 nay trả phí theo vật, không theo hồ sơ.** Đo trên 20
  lượt chấm (534,6 M token) thấy review + refute chiếm **83 %** token S4, mà
  **3/4** phát hiện đã trả tiền bác bỏ lại bị xếp ra ngoài hợp đồng — tức máy
  trả tiền chứng minh thứ chính nó không được sửa. Năm nhát cắt:
  - **Phân loại phạm vi đứng TRƯỚC bác bỏ.** Chỉ phát hiện trong hợp đồng mới
    trả phí bác bỏ; mục ngoài hợp đồng đi thẳng sang người ở Cổng Bằng chứng,
    mang cờ «chưa qua bác bỏ». Đo được: một lượt chấm của 2.12.0 chạy **20** tác
    tử bác bỏ và cả 20 đều soi hồ sơ chứ không soi vật; lượt PASS của vòng này
    chạy **0**, vì cả 12 phát hiện đều được xếp ngoài hợp đồng nên không mục nào
    phải trả phí bác bỏ. Hai lượt có phân loại lành khác chạy 5 và 0.
  - **«Vùng vật» có tên máy đọc.** Làn tìm-lỗi tập trung vào tệp thật sự đổi,
    thôi soi văn bản hồ sơ của chính vòng. Trước đó 20/20 tác tử bác bỏ soi hồ
    sơ và 0 soi vật.
  - **Mỗi phát hiện có một dòng trong sổ chạy**, nên lượt sau không chấm lại
    mục ngoài hợp đồng mà tệp của nó không đổi.
  - **Làn đối chứng rời đường găng.** Nó là tín hiệu phụ nhưng từng giữ đồng hồ
    của cả lượt; nay chạy riêng, chỉ đợi ở điểm muộn nhất cần.
  - **Thước token và phút.** `wf-usage` đo thời gian theo vai trò và sinh
    `usage-report.md`, tách ba khối chứng-minh-vật / tìm-lỗi / tổng hợp.

- **North star có thêm chi phí máy.** Thước của kit nay đếm cả **token và phút
  máy trên mỗi kết quả ship**, không chỉ giờ người. Dòng người vẫn đứng trước
  dòng máy: token giảm mà lượt gọi người tăng là thất bại. Luật (c) đi từ ba
  lên **năm dòng số** mỗi mốc phát hành.

- **Nghi thức kiểm phép đo nay HAI chiều.** Trước đây kit chỉ hỏi «phá vật thật
  thì phép đo có đỏ không» (độ nhạy). Nay hỏi thêm «chạm một thứ KHÔNG phải vật
  thì phép đo có IM không» (độ đặc hiệu). Thiếu chiều thứ hai, mọi luật về phạm
  vi của kit không thể sai được trong bất kỳ phép đo nào đang chạy.

- **Thẻ Cổng Bằng chứng nói đúng hơn.** Khối ngoài hợp đồng thôi nói các mục đó
  «là thật» — chúng chưa qua bác bỏ đối kháng, và thẻ nay nói vậy.

**Ai bị ảnh hưởng / làm gì:**

- **Kho tiêu thụ đang giữa một vòng lặp:** không có gì phải làm. Engine chỉ đổi
  dưới chân bạn theo bản phát hành có chủ đích, và 2.13 chưa ra. Kéo nhánh chính
  giữa hai mốc là tự chọn.
- **Kho tự dựng args cho S4:** nếu bạn gọi thẳng workflow chấm thay vì qua skill,
  bên viết nay truyền thêm năm khoá (`vungVat`, `ngoaiVatFiles`, `diffFiles`,
  `fileDoTrongDiff`, `coverageFiles` cùng `coEvalPaths`). **Thiếu khoá nào cũng
  không vỡ** — bên đọc có đường đọc-cũ cho từng khoá. Nhưng ba trong số đó rơi
  về đường cũ *lặng lẽ*: đó là một trong 12 giới hạn đã khai bên dưới.
- **Người đọc `usage-report.md`:** bảng theo vai trò đếm đúng số tác tử, nhưng
  dòng tiêu đề và tổng theo model vẫn đếm theo dòng (tác tử × model), nên hai
  con số trong cùng một báo cáo có thể lệch nhau. Giới hạn đã khai.

**Giới hạn đã khai (12 mục, owner ký 14/09):** không mục nào chạm hành vi người
dùng cuối — tất cả là nợ của chính bộ đo: một bản chép tay của hàm khớp đường
dẫn, cờ vàng thiếu cho ba khoá args mới, hai bộ đếm tác tử còn đếm dòng, một phụ
thuộc PyYAML chưa khai trong tài liệu cài đặt, và vài ca không đo được điều
chúng tuyên. Chi tiết từng mục:
`_acceptance/khoi-tim-loi-tra-phi-theo-vat/evidence-report.md`, mục
«Known limits». Chúng đi vào hạt giống mốc 2.13.

**Đã biết trước, chờ mốc 2.13 quyết** — `docs/plans/2026-09-14-hat-giong-ba-cho-cat-sau-chu-ky-cua-so-2-13.md`:

1. Ghim lại theo diff thay vì chạy trọn corpus (làn hiện tốn ≈ 12 phút mỗi lượt).
2. Fixture ghim định tuyến thẻ không được đỏ chỉ vì có hồ sơ mới ký.
3. Dòng số thứ nhất đo tới «lên nhánh chính», và nghi thức ship chạy nền.
4. Chiến dịch ghim lại: **41 trên 68** hồ sơ có ghim đang hoá cũ, mốc ghim cũ
   nhất tụt 411 commit. Đây là nợ có sẵn giữa hai mốc, không phải hồi quy — luật
   ghim-lại-theo-release gọi trạng thái này là chấp nhận được.

**Chi phí của chính vòng này (máy đo):** sáu lượt chấm, trong đó **ba lượt bị hạ
tầng đốt** — một lỗi ống lệnh, một lượt đỏ giả, một suite chập chờn không tái
hiện được. Cả ba đều xanh khi chạy tay. Số này vào dòng thứ ba của luật (c), và
nó lớn hơn phần tiết kiệm được nếu tính theo giờ người.
