---
schema_version: 1
feature: Phát hành kit 2.16.0 — cắt số cho hai gói kit sau cửa sổ một ngày có ĐÚNG MỘT vòng meta đã ký (thuoc-co-cua, T3), mang năm dòng số của vòng ấy đếm từ vật trong kho, và chạy chiến dịch ghim lại theo mốc mà hai cửa sổ trước đã hoãn
slug: release-2-16-0
owner: phanlemanh@gmail.com
risk_tier: T2               # chạm hai manifest, GUIDE, CHANGELOG, PRODUCT-MAP, _acceptance/config.yaml. KHÔNG chạm t3_paths (hooks, lib, pre-merge-check.sh, recheck-evidence.cjs)
surfaces: [cli]
status: implemented
approved_by:
approved_at:
veto_state: mo
veto_opened_at: 2026-09-18T00:14:27Z
---

# Acceptance Contract: release-2-16-0

## Context

Cửa sổ 2.15 → 2.16 mở khi 2.15.0 ký 17/09 lúc 12:03 và đóng ở lượt cắt số này, 18/09.
Đây là **cửa sổ ngắn nhất từ khi kit đếm năm dòng số: khoảng một ngày**. Trong ngày đó
kho chạy ĐÚNG MỘT vòng meta — `thuoc-co-cua` (T3, ký 17/09 23:05) — đúng vòng mà mốc
2.15.0 đã gọi tên trước ở Notes §4 mục 1, và đúng trần một vòng của luật (b).

**Vòng ấy làm gì:** hai câu và một cửa của bảng 23 lớp hạ tầng — «đứng được trước khi
chấm» (đường nền hạ tầng bốn chân ở S1, máy chạy chứ không LLM) · «chạy không đè nhau»
(lệnh suite tuần tự trong làn chấm) · «cửa cho thước» (bộ đếm vật · thước · nhát, trần
ba nhát sửa thước ở trạng thái code-xong) — cộng ba nhát đúng/sai owner phê 17/09: lượt
chấm nghe lời khai không-chạy, thẻ Cổng Bằng chứng đếm mã thoát đã khai, và ba tiêu chí
của hồ sơ draft `bo-qua-phai-thay-dinh-nghia-phep-do` gộp vào. Mười lăm tiêu chí, ba
lượt chấm, PASS.

**Cửa sổ có gì khác ngoài vòng ấy.** Ba việc, tất cả sau chữ ký của vòng và đều là vá
hoặc sổ sách, không việc nào chạm engine:

| việc | ở đâu | engine | vì sao |
|---|---|---|---|
| ghim lại hai hồ sơ bị chữ ký làm hoá cũ | main `4fff1f18` | không | nghi thức sau chữ ký, run_id `repin-20260917T162023Z-19491` |
| ghi hai finding rơi khỏi thẻ Cổng Bằng chứng vào Known limits | main `b4fbec9b` | không | hai mục Ngoài-1 và Ngoài-2 của vòng, owner định đoạt ở cổng |
| mở ô `phep-do-o-doc-lap-thuoc-co-cua` ở Cổng Đáng | main `e3563671` | không | ba finding ngoài hợp đồng của vòng gom về một ô; owner chấm build, vá-trong-mốc ở cửa sổ 2.16 → 2.17 |

Ba việc ấy nằm SAU chữ ký của vòng meta, và lời khai «không việc nào chạm engine» do
răng `rang-cua-so.mjs --chan viec-va` đo — khối dưới khai chữ ký ấy rồi liệt các tệp mà
chính mốc này đổi:

<!-- <<<VIEC-VA-SAU-CHU-KY
chu-ky: b9f8766e
.claude-plugin/plugin.json
feature-loop/.claude-plugin/plugin.json
VIEC-VA-SAU-CHU-KY>>> -->

Tập hồ sơ vòng sinh sau lần cắt số trước, do răng `rang-cua-so.mjs` đối chiếu với kho:

<!-- <<<VIEC-META-CUA-SO
thuoc-co-cua
VIEC-META-CUA-SO>>> -->

**Chiến dịch ghim lại chạy ở mốc này, và nó ĐỎ.** Hai cửa sổ trước hoãn nó (R3 ở 2.15.0:
«không chạy ở dạng hiện tại»). Owner gọi tên nó cho mốc này. Làn chạy trọn tại
`26bf12fe`: 5 lệnh suite xanh, 215 lệnh phân biệt, 2 giờ 25 phút máy, 0 tệp hồ sơ đã ký
bị chạm — rồi dừng mã 1 vì **14 trên 72 hồ sơ có eval đỏ**, tổng **60 eval**. Làn đỏ
không ghi gì, nên **0 hồ sơ được ghim lại**, kể cả 58 hồ sơ xanh. Số và danh sách ở
Notes §4; tiêu chí AC-5 đo đúng kết quả ấy, không đo một lời hứa.

Hai gói cùng lên **2.16.0**; `diagram-design` giữ **2.7.0**.

Source input: lệnh owner 18/09 (phiên cắt mốc). Nguồn chữ: hồ sơ `_acceptance/thuoc-co-cua/`
(hợp đồng · sổ chạy · sổ quyết định · báo cáo chi phí), `docs/findings/2026-09-17-boi-canh-truoc-va-sau-R.md`,
và hợp đồng mốc `_acceptance/release-2-15-0/contract.md`.

## Criteria

### AC-1 (cắt số) — MỘT số, nhất quán ở mọi bề mặt người dùng đọc, và số phải TĂNG

**Given** cây tại HEAD của hồ sơ mốc
**When** chạy `rang-p200.sh` và `rang-so-tang.sh` của hồ sơ này (chép nguyên thân từ 2.15.0)
**Then** hai plugin `acceptance-gate` và `feature-loop` cùng mang MỘT số hợp semver;
`GUIDE.md` dẫn xuất số đó từ manifest; mục mô tả của số đó nói người dùng nhận gì;
`feature-loop` tự khai cặp `acceptance-gate >= <số đó>`; và số ở cây LỚN HƠN theo semver
số tại commit đưa hồ sơ mốc này vào kho. Vế giá trị — số ấy là **2.16.0**, một nhịp
minor vì cửa sổ ship tính năng mới chứ không chỉ sửa lỗi — owner xác nhận trên thẻ.

### AC-2 (gói không đổi thì GIỮ số) — diagram-design ở 2.7.0, chứng bằng cửa sổ diff

**Given** cây tại HEAD
**When** chạy `rang-moc.sh --chan diagram`
**Then** `diagram-design/` không đổi một dòng nào kể từ lần cắt số gần nhất của nó, số đọc
được tại HEAD là 2.7.0, và đối chứng dương trong cùng lượt nói cửa sổ không rỗng, bộ lọc
còn khớp vật.

### AC-3 (lớp vendored) — bộ tệp chép vào CI của repo tiêu thụ không đổi tệp nào

**Given** cây làm việc và lần cắt số trước suy từ kho
**When** chạy `rang-cua-so.mjs --chan vendored`
**Then** DANH SÁCH tệp rút từ khối chép `INIT-CI-COPY-LIST` tại HEAD BẰNG danh sách
rút từ chính khối ấy tại neo — thêm hay bớt một mục đều đỏ, gọi tên — và mọi tệp trong
danh sách ấy, CỘNG chính `commands/acceptance-init.md` mang khối, không đổi một dòng kể
từ neo, trên một cửa sổ toàn kho KHÔNG rỗng. Repo tiêu thụ không phải chép lại gì ở mốc
này — và câu ấy là kết luận của một phép đo, không phải lời khai.

**Vì sao phép so danh sách hai đầu:** sàn «không dưới năm tệp» một mình là fail-open —
gỡ ba mục khỏi khối thì sáu tệp còn lại vẫn không đổi, `n` vẫn bằng số mục của khối, và
răng vẫn xanh trong khi lớp cưỡng chế vendored vừa tắt lặng ba tệp. Phản biện context
sạch của mốc này gọi tên lỗ ấy; chân vendored của 2.15.0 mang nó.

### AC-4 (sự thật của cửa sổ) — danh sách vòng của cửa sổ suy từ kho, không chép tay

**Given** cây làm việc và lần cắt số trước suy từ kho
**When** chạy `rang-cua-so.mjs --chan viec-meta`
**Then** tập hồ sơ vòng có `contract.md` KHÔNG có ở lần cắt số trước, trừ hồ sơ mốc,
BẰNG khối `VIEC-META-CUA-SO` của hợp đồng này — thiếu hay thừa đều đỏ, gọi tên; đối
chứng dương: chính hồ sơ mốc này phải được thấy là sinh sau neo; và bộ quét mở phiên
chạy trên cây thật nhận kho kit, đếm được số vòng meta đang mở. Việc chỉ có commit,
không mở hồ sơ, vô hình với phép đo này — khai ở Known limits.

### AC-5 (chiến dịch ghim lại) — kết quả THẬT, đếm được, gọi tên từng hồ sơ

**Given** mọi hồ sơ đã thông Cổng Bằng chứng trong kho, và khối khai
`CHIEN-DICH-GHIM-LAI` của hợp đồng này — ba dòng đầu là `sha` mà làn chạy tại đó,
`run_id` làn tự đúc, và `exit` của làn; các dòng sau là hồ sơ đã ghim lại ở lượt đó
**When** chạy `rang-ghim-lai.mjs --chan chien-dich`
**Then** (a) tập hồ sơ đã ký mà dòng `kind:repin` MỚI NHẤT của nó mang đúng `run_id` đã
khai BẰNG danh sách trong khối — thiếu hay thừa đều đỏ, gọi tên từng hồ sơ; (b) mỗi hồ
sơ trong danh sách có dòng ghim lại ở đúng `sha` ấy VÀ `verified_commit` BẰNG chính `sha`
ấy (bất biến của nghi thức ghim lại); (c) `exit` 0 thì danh sách KHÔNG rỗng, và `exit`
khác 0 thì KHÔNG hồ sơ đã ký nào mang `run_id` ấy ở BẤT KỲ dòng nào. Đối chứng dương
trong cùng lượt: tập hồ sơ đã ký KHÔNG rỗng, và phép đọc dòng ghim lại thấy ít nhất một
hồ sơ mang dòng `kind:repin` nào đó — phép so không được xanh vì không đọc được gì.

**Vế (c) là thứ giết hằng-đúng.** Bản đầu của tiêu chí này cho lượt đỏ khai chữ
«không có» ở dòng sha rồi bỏ qua chính phép so; phản biện context sạch chỉ ra ngay: một
lượt ghim được ba hồ sơ rồi chết giữa chừng cho ĐÚNG cùng một dòng PASS với một lượt chưa
ai chạy. Nay `run_id` là vật nói «đã chạy» — nó do làn tự đúc và nằm trong sổ chạy — nên
làn đỏ mà vẫn có pin mang mã ấy là lời khai LỆCH vật, và răng gọi tên.

**Khai thẳng cái tiêu chí này KHÔNG hứa:** nó không hứa chiến dịch XANH. Làn đỏ thì
danh sách rỗng và răng vẫn phải xanh trên một lời khai rỗng-và-đúng — nhưng chỉ khi vế
(c) đứng vững. Cái nó chặn là lời khai LỆCH vật theo cả hai chiều: khai đã ghim mà sổ
chạy không có dòng, và ghim mà hợp đồng không kể.

Khối khai — ba dòng đầu là `sha` · `run_id` · `exit` của lượt chiến dịch, các dòng sau
là hồ sơ đã ghim lại ở lượt đó:

<!-- <<<CHIEN-DICH-GHIM-LAI
26bf12fed2fc71e6b1e21375645f299f144ce34a
run_id: repin-20260918T025435Z-51649
exit: 1
CHIEN-DICH-GHIM-LAI>>> -->

### AC-8 (lời khai về ba việc vá) — «không việc nào chạm engine» là kết luận của phép đo

**Given** khối khai `VIEC-VA-SAU-CHU-KY` của hợp đồng này — dòng đầu là chữ ký Cổng
Bằng chứng của vòng meta trong cửa sổ, các dòng sau là các tệp mà chính mốc này đổi
**When** chạy `rang-cua-so.mjs --chan viec-va`
**Then** từ chữ ký ấy tới cây làm việc, KHÔNG tệp engine nào đổi ngoài các tệp mốc đã
khai — có thì đỏ, in từng tệp. Engine ở đây là mọi cây mã và mọi cây thước của kit;
văn và hồ sơ xưởng không tính. Cửa sổ của chính vòng meta KHÔNG bị soi: vòng ấy có hồ sơ
và chữ ký riêng.

**Đối chứng dương hai vế, cùng lượt:** cửa sổ từ neo tới chữ ký PHẢI chứa tệp engine —
không có thì bộ lọc chưa chứng minh được là nó thấy tệp engine, và kết luận «không tệp
nào» là hằng đúng, răng dừng mã 7; và cửa sổ sau chữ ký KHÔNG rỗng.

**Vì sao tiêu chí này tồn tại:** đây là LỚP THỨ BA của cùng một bệnh. Mốc 2.15.0 đóng
hai lời khai về cửa sổ không có thước (lớp vendored · danh sách việc); phản biện context
sạch của mốc này tìm ra lời khai thứ ba — bảng Context nói «ba việc vá, không việc nào
chạm engine», và cả `risk_tier` của hồ sơ lẫn ngưỡng «cửa sổ này là 0» ở Known limits
đều đứng trên nó.

### AC-6 (hồi quy) — bốn suite và bản đồ sản phẩm

**Given** cây tại HEAD
**When** chạy bốn suite của kho cùng `product-map --check`
**Then** cả năm lệnh exit 0; suite scripts, hooks và workflows in dòng tổng kết không có
ca đỏ; suite plugins in dòng «all plugin tests passed» và không dòng nào mang chữ FAIL;
bản đồ sản phẩm khớp hồ sơ xưởng.

### AC-7 (judgment) — năm khối Notes đủ mặt, năm dòng số có nguồn, điều bất lợi nói thẳng

**Given** khối `## Notes` của hợp đồng này
**When** hội đồng đọc nó cùng BA nguồn: hồ sơ `_acceptance/thuoc-co-cua/` (hợp đồng, sổ
quyết định, báo cáo chi phí) · hợp đồng mốc `_acceptance/release-2-15-0/contract.md` ·
finding bối cảnh trước và sau R
**Then** đủ NĂM khối (năm dòng số · lớp vendored · lớp lỗi tái phát · kết quả chiến dịch
ghim lại · nhát cắt cho cửa sổ kế); bảng năm dòng có HAI CỘT (vòng meta `thuoc-co-cua` · ba việc vá-trong-mốc); mỗi ô có
nguồn rút gọi tên hoặc ghi «không đo được» kèm lý do; dòng 2 tách trong/ngoài thiết kế và
gọi tên lớp của lượt ngoài; và BỐN phép đối chiếu dưới đây khớp từng chữ số.

**Bốn phép đối chiếu, liệt kê ĐÓNG.** (i) dòng 4 — năm số token từng lượt và hai số gộp —
so `_acceptance/thuoc-co-cua/usage-report.md`, cộng theo nền per-model có cache_create như
mốc 2.14.0 và 2.15.0 · (ii) dòng 4b — ba tỉ lệ khối của từng lượt chấm và tỉ lệ gộp — so
bảng vai trò của cùng tệp, nền KHÔNG cache_create như hai mốc trước · (iii) dòng 1 và dòng
2 so giờ tác giả của các commit được gọi tên trong ô · (iv) tỉ lệ tìm-lỗi gộp 71,2 % so
số 9,5 % của vòng R1 ghi ở Notes §1 hợp đồng mốc 2.15.0, cùng câu giải thích vì sao hai
số ấy KHÔNG so thẳng được.

**Và nói thẳng bảy điều bất lợi:** khối tìm-lỗi chiếm 71,2 % token S4 của vòng — cao hơn
mọi lượt đo gần đây và ngược chiều lời hứa của spec token · lượt gọi người 5 so trần T3
4, vòng thứ năm liên tiếp vượt trần · một lượt thi công S3 chết trọn vì hạn mức phiên ·
owner phải tự bắt một phát hiện TRONG hợp đồng ở Cổng Bằng chứng mà lượt chấm 2 đã cho
qua · số chạm mỗi lượt gọi người không có vật máy giữ nào ghi, nên không đo được · hiệu
lực khuôn `/goal` sửa ở 2.15.0 vẫn chưa có số. Che bất kỳ điều nào là FAIL. §4 phải gọi
tên ít nhất MỘT chỗ cắt cho cửa sổ kế và định đoạt router — mặc định owner đã chốt cho
cửa sổ 2.16 → 2.17.

## Coverage

Mốc phát hành là bài liệt-kê-đủ theo BỀ MẶT người dùng đọc số và theo VIỆC đã vào cửa sổ,
không theo tổ hợp.

- **Trục bề mặt số** `[thước CE: ca P200 trong tests/plugins/run-tests.sh]`: manifest gói
  một · manifest gói hai · số dẫn xuất trong GUIDE · mục mô tả của chính số đó · cặp phụ
  thuộc feature-loop tự khai · số tăng so với lúc hồ sơ ra đời. → AC-1.
- **Trục gói** `[thước CE: ba manifest có thật trong kho]`: hai gói lên số · gói thứ ba
  giữ số. → AC-1, AC-2.
- **Trục việc-đã-vào-cửa-sổ** `[thước CE: bảng Context — một vòng meta và ba việc vá, liệt
  kê đóng, cộng tập hồ sơ vòng đối chiếu bằng máy ở AC-4]`: vòng `thuoc-co-cua` → có hồ sơ
  và chữ ký riêng, mốc chỉ khai và đếm nó (AC-4, AC-7) · ba việc vá → không việc nào chạm
  engine, nên không tiêu chí hành vi nào; chúng vào bảng Context và dòng 2 của §1.
- **Trục việc-của-mốc** `[thước CE: luật re-pin-theo-release và luật (c) của CLAUDE.md]`:
  hồi quy → AC-6 · lớp vendored → AC-3 · chiến dịch ghim lại → AC-5 · bốn khối Notes và
  năm dòng số → AC-7.
- **Trục lời-khai-về-cửa-sổ** `[thước CE: ba lời khai mà một hồ sơ mốc nói về cửa sổ]`:
  lớp vendored không đổi → AC-3 · danh sách vòng của cửa sổ → AC-4 · ba việc vá không
  chạm engine → AC-8. Ba lời khai, ba thước; trước mốc 2.15.0 cả ba đều không có thước
  nào.
- **Trục của chiến dịch ghim lại** `[thước CE: ba trạng thái một hồ sơ đã ký có thể ở sau
  một lượt chiến dịch]`: đã ghim ở sha của lượt · chưa ghim vì làn đỏ · chưa ghim vì không
  nằm trong phạm vi lượt. → AC-5. Tổ hợp KHÔNG đo, khai thẳng: hồ sơ có dòng ghim lại ở
  một sha KHÁC sha của lượt (ghim lại riêng lẻ trước đó) — răng chỉ đọc dòng mới nhất.

## Out of scope

- **Mở vòng meta trong chính phiên cắt mốc.** Luật (b) cho tối đa một vòng meta giữa hai
  mốc; cửa sổ này đã dùng đúng một. Phát hiện mới trong phiên vào sổ hoặc vào ô, không
  thành vòng.
- **Ô `phep-do-o-doc-lap-thuoc-co-cua`** — owner chấm build và xếp là vá-trong-mốc ở cửa
  sổ 2.16 → 2.17, không phải việc của mốc này.
- **Router** — vòng meta mặc định của cửa sổ 2.16 → 2.17 (owner Q3 17/09), không mở ở đây.
- **Sửa vật nào ngoài hai manifest và bốn tệp văn.** Mốc chỉ cắt số và kể chuyện cửa sổ.
- **Dựng phép đo mới cho chính phép đo của mốc** — luật (a).
- **Ghim lại theo diff.** Chiến dịch ở mốc này chạy làn đầy đủ như nghi thức hiện có;
  đường rẻ «theo diff» vẫn chưa làm, và vẫn là điều kiện tồn tại lâu dài của chiến dịch.

## Notes

### Known limits

- **Việc meta không mở hồ sơ vô hình với phép đếm máy** — AC-4 đếm hồ sơ vòng, không đếm
  commit. Ba việc vá của cửa sổ này đều có commit và không có hồ sơ, nên chúng chỉ sống
  trong bảng Context. Ngưỡng đang đếm (giữ từ 2.15.0): ≥ 1 việc CHẠM ENGINE lên nhánh gốc
  không qua hồ sơ nào giữa hai mốc — cửa sổ này là 0.
- **Số chạm mỗi lượt gọi người không đo được.** Kit đếm lượt bằng commit cổng, nhưng số
  lần người phải gõ trong một lượt không có vật máy giữ nào ghi. Mọi con số chạm ở các mốc
  trước đều do một nhân chứng đọc transcript; phiên này không có nhân chứng của vòng
  `thuoc-co-cua`, nên ô ấy ghi «không đo được».
- **Dòng 4 và 4b chỉ thấy phần chạy trong Workflow.** Phiên chính của vòng — brainstorm,
  S1, các lượt sửa giữa hai lượt chấm, phiên dựng chính hồ sơ mốc này — không có
  `wf-usage`, nên không vào bảng. Cùng lỗ mà mốc 2.15.0 đã gọi tên ở §4 mục 8.
- **Răng chiến dịch đọc dòng ghim lại MỚI NHẤT của mỗi hồ sơ.** Hồ sơ từng ghim lại ở một
  lượt riêng lẻ trước đó, rồi không vào lượt chiến dịch, sẽ hiện là «chưa ghim ở sha này»
  — đúng, nhưng không phân biệt được với hồ sơ chưa từng ghim lại bao giờ.
- **HAI chân răng của CHÍNH hồ sơ này chắc chắn đỏ ở chiến dịch ghim lại kế.** Chân
  `viec-meta` neo vào «lần cắt số trước suy từ kho»: khi mốc sau cắt số, neo dời tới commit
  nâng số của mốc này, và đối chứng dương «hồ sơ mốc phải sinh sau neo» sẽ dừng mã 2 — đúng
  ca mà `release-2-15-0` vừa đỏ ở chiến dịch này. Chân `viec-va` so từ chữ ký vòng meta tới
  CÂY LÀM VIỆC, nên mọi tệp engine đổi ở cửa sổ sau đều rơi vào tập cấm và nó dừng mã 6. Hồ
  sơ khai thẳng thay vì vá riêng cho mình: vá một bản sao là để nguyên lớp sống ở mọi bản
  còn lại, và lớp ấy là nhát cắt có tên ở §5. Ngưỡng đang đếm: đã 2 hồ sơ mốc đỏ vì lớp này
  (`release-2-14-0`, `release-2-15-0`), mốc này sẽ là thứ ba.
- **Hiệu lực khuôn `/goal` vẫn chưa có số.** Ngưỡng mở lại đặt ở AC-13 của mốc 2.15.0 (≥ 1
  lần hook chặn một lần dừng CÓ nêu tiền đề hoặc lối) chưa đọc được: vòng `thuoc-co-cua`
  chạy trong kho kit và không tệp nào trong kho ghi số lần hook chặn. Ngưỡng vẫn đang đếm.

### 1. Năm dòng số của luật (c) — cửa sổ một ngày, hai cột

Hai cột, đếm cùng luật. Cột một là vòng meta duy nhất của cửa sổ. Cột hai là ba việc vá,
đếm từ sổ và git của kho kit. Cửa sổ này KHÔNG có cột repo tiêu thụ: không vòng sản phẩm
nào ký trong một ngày ấy mà phiên này có nhân chứng.

| Dòng | vòng meta `thuoc-co-cua` (kho kit, T3) | ba việc vá-trong-mốc (kho kit) | Nguồn rút |
|---|---|---|---|
| 1 làm-xong → quyết-được | **2 h 36**: `implemented` 17/09 20:29 (`53aa1f08`) → chữ ký Cổng Bằng chứng 23:05 (`b9f8766e`), giờ máy tác giả. Trong đó **1 h 28** nằm giữa lượt trả lại 21:37 và chữ ký 23:05 | **không có khoảnh khắc quyết** cho hai việc đầu — ghim lại và ghi Known limits là nghi thức sau chữ ký. Việc thứ ba là chính một cổng: Cổng Đáng ký `e3563671` 18/09 00:33 | giờ tác giả các commit gọi tên |
| 2 lượt gọi người | **5** so trần T3 **4**. Trong thiết kế **4**: Cổng Đáng `f49709ef` 15:10 · Cổng Phạm vi `c30cf544` 15:59 · Cổng 1.5 `618b66ab` 16:13 · Cổng Bằng chứng `b9f8766e` 23:05. Ngoài thiết kế **1**: lượt trả lại ở Cổng Bằng chứng `57b6eda1` 21:37 — owner bắt một phát hiện TRONG hợp đồng (bộ đọc trạng thái không nuốt được ký tự xuống dòng kiểu Windows) mà lượt chấm 2 đã cho qua. Chạm mỗi lượt: **không đo được** | **1**: Cổng Đáng của ô `phep-do-o-doc-lap-thuoc-co-cua`. Hai việc còn lại 0 | sổ quyết định của vòng (dòng `d-20260917T143551Z-14` là lượt trả lại) và giờ tác giả các commit |
| 3 lượt chấm bị hạ-tầng-kit đốt | **0 / 3** lượt chấm — cả ba trả verdict, 0 BLOCKED. Nhưng **1 lượt THI CÔNG chết trọn**: S3 lượt 1, bốn tác tử chết vì hạn mức phiên, 0 commit; lượt 2 chạy lại sau **3 h 19** | **0** | `usage-report.md` mục S3 lượt 1 và commit `4dc169ef`; sổ chạy cho ba dòng `round-tally` |
| 4 token máy | S3 lượt 1 (chết) **1,53 M** · S3 lượt 2 **23,25 M** · S4 lượt 1 **21,96 M** · lượt 2 **5,09 M** · lượt 3 **2,97 M**. **S4 gộp 30,02 M** (10,0 M/lượt) · **vòng gộp 54,80 M** | **không đo được** — phiên vá không chạy `wf-usage` | `usage-report.md`, nền per-model CÓ cache_create như mốc 2.14.0 và 2.15.0 |
| 4b ba khối | chứng-minh-vật / tìm-lỗi / tổng hợp: lượt 1 **22,5 · 75,6 · 1,9 %** · lượt 2 **28,1 · 65,6 · 6,3 %** · lượt 3 **50,5 · 41,6 · 7,9 %**; **gộp 25,7 · 71,2 · 3,1 %** (tìm-lỗi **18,49 M** tuyệt đối) | không đo được — không có bảng vai trò | `usage-report.md`, nền bảng vai trò KHÔNG cache_create; `refute` và `review` vào khối tìm-lỗi, `machine`, `judge`, `baseline` vào chứng-minh-vật |
| 5 phút máy/lượt chấm | **34,8 · 21,0 · 27,3**; **S4 gộp 83,1**. Đường găng cả ba lượt là làn `machine` — trong đó suite scripts một mình chiếm 933 · 457 · 915 giây | ghim lại `4fff1f18`: không ghi thời lượng | `usage-report.md`, dòng `wall` và bảng vai trò |

**Điều số nói, kể cả khi bất lợi.**

- **Khối tìm-lỗi chiếm 71,2 % token S4 của vòng** — 18,49 M trên 25,95 M theo nền bảng
  vai trò. Đây là con số CAO, và nó ngược chiều spec token
  (`2026-09-14-khoi-tim-loi-tra-phi-theo-vat`) vốn sinh ra để kéo khối ấy xuống. **Nhưng
  nó KHÔNG so thẳng được với 9,5 % của vòng R1** ở mốc 2.15.0: R1 là vòng sản phẩm có làn
  giao diện, và chính làn `ui` ngốn 91 % lượt cuối của nó, nên mẫu số phình và tỉ lệ
  tìm-lỗi teo. `thuoc-co-cua` không chạm màn nào, không có eval giao diện, nên mẫu số chỉ
  còn suite và tác tử tìm-lỗi. So đúng là so tuyệt đối: 18,49 M của vòng này so 8,30 M của
  lượt 1 R1. Dù đọc cách nào, khối tìm-lỗi vẫn là khối đắt nhất của một vòng kit.
- **Lượt gọi người 5 so trần 4 — vòng thứ NĂM liên tiếp vượt trần.** Chuỗi qua bốn cửa sổ:
  4 · 5 · 5 · 8 · 5. Lượt vượt lần này rẻ hơn mọi lần trước (một lượt, một dòng «trả lại»),
  nhưng nó vượt vì đúng một lý do có thể sửa: một phát hiện mức TRUNG trong hợp đồng không
  làm REJECT, nên nó trôi tới thẻ và owner phải làm việc của bộ chấm.
- **Một lượt thi công chết trọn vì hạn mức phiên.** Bốn tác tử, 1,53 M token, 0 commit, và
  3 h 19 chờ trước khi chạy lại. Kit đếm «lượt chấm bị hạ tầng đốt» nhưng KHÔNG đếm lượt
  THI CÔNG bị đốt; ở cửa sổ này lớp thứ hai mới là lớp tốn tiền.
- **Số chạm không đo được.** Mục tiêu «≤1 chạm/lượt» của luật (c) ở cửa sổ này là một lời
  hứa không có thước. Ba mốc trước lấy số từ nhân chứng đọc transcript, và nhân chứng
  không phải vật máy giữ.
- **Cửa sổ một ngày không cho biết gì về nhịp.** Dòng 1 và dòng 5 của một cửa sổ ngắn đo
  một vòng, không đo một nhịp. Đừng đọc «2 h 36» thành xu hướng.
- **Hiệu lực khuôn `/goal` vẫn chưa có số** — xem Known limits. Hai cửa sổ liền không đọc
  được ngưỡng mà chính kit đặt ra.

**Dự báo năm dòng cho chính thay đổi của mốc này.**

| Dòng | Chiều | Vì sao |
|---|---|---|
| 1 | = | mốc chỉ cắt số; không chạm đường vòng lặp |
| 2 | = | không cổng nào thêm bớt |
| 3 | ↓ ở repo tiêu thụ | đường nền hạ tầng bốn chân ở S1 gỡ tường trước khi chấm; lệnh suite tuần tự bỏ lớp lỗi «suite đè nhau» |
| 4 | = | không chạm cách chấm; args bỏ ô không-chạy tiết kiệm vài lệnh, không đổi bậc |
| 5 | ↓ nhẹ ở repo có eval tự khai không-chạy · ↑ ở repo có suite nặng chạy song song được | args thôi thi hành ô khai không-chạy; đổi lại lệnh suite nay tuần tự nên đường găng dài ra |

Điều kiện tin cậy: (i) đường verdict — finder, bác bỏ trong hợp đồng, REJECT — KHÔNG đổi
thành phần ở mốc này; vòng `thuoc-co-cua` đổi thứ tự CHẠY của lệnh suite, không đổi ai
phán. (ii) Số lượt chấm sai giữa hai mốc: ngưỡng của luật (a) đã chạm từ 2.15.0 và chưa
gỡ, nên dòng 4–5 của cửa sổ kế KHÔNG được cắt dựa trên số của mốc này.

### 2. Lớp vendored — KHÔNG tệp nào đổi

Bộ tệp của khối chép `INIT-CI-COPY-LIST` trong `commands/acceptance-init.md` so với lần
cắt số trước: không đổi một dòng — răng AC-3 đo, không chép tay. Repo tiêu thụ không phải
chép lại gì ở mốc này. Đúng như dự đoán từ hình dạng cửa sổ: vòng duy nhất chạm bộ sinh
args, workflow chấm và bộ đếm, không chạm lớp cưỡng chế được vendor.

### 3. Lớp lỗi TÁI PHÁT trong cửa sổ

**Lớp một — phát hiện mức TRUNG trong hợp đồng không làm REJECT.** Lượt chấm 2 của
`thuoc-co-cua` trả PENDING-JUDGMENT với một phát hiện trong hợp đồng ở mức trung (bộ tìm
mốc sàn tự viết bộ đọc frontmatter, nuốt không được hợp đồng dùng ký tự xuống dòng kiểu
Windows). Bộ chấm chỉ REJECT ở mức cao, nên phát hiện ấy đi thẳng tới thẻ; owner đọc và
trả lại. Đó là một lượt gọi người ngoài thiết kế sinh ra bởi một ngưỡng, không bởi một
đánh đổi. Cùng hình dạng với lớp «thước không có cửa» của cửa sổ trước: máy có số nhưng
không có luật để tự dừng.

**Lớp hai — bộ đọc tự viết cạnh bộ đọc một-nguồn.** Cùng vòng, hai lượt sửa liên tiếp
(`dc9eb1b7` rồi `8742c7f8`) đều là một chuyện: mã mới tự viết lấy bộ đọc trạng thái trong
khi kho đã có `frontmatterField` của thư viện dùng chung. Lượt sửa 1 thay cách quét, lượt
sửa 2 mới thay bằng đúng bộ đọc chung. Đây là lớp đã có tên từ cửa sổ 2.13 và vẫn tái
phát; nó tốn đúng một lượt chấm.

**Lớp ba — hạn mức phiên là một lớp hạ tầng chưa ai đếm.** Bốn tác tử thi công chết cùng
lúc, không commit nào, và lớp này không hiện ở dòng 3 vì dòng 3 chỉ đếm LƯỢT CHẤM. Ở
crm-onehub và OneFlow lớp hạ tầng cũng là lớp gọi người lớn nhất; khác nhau ở chỗ hai repo
ấy đếm được còn ở đây thì không.

**Lớp bốn — tổng kết cửa sổ bằng trí nhớ phiên.** Vẫn còn: bảng Context của bản đầu hồ sơ
này liệt kê việc của cửa sổ từ nhật ký git đọc tay; chỉ răng AC-4 mới đối chiếu được với
kho. Cửa sổ này may vì ngắn — một ngày, một vòng. Cửa sổ dài thì lớp này lại đắt.

### 4. Chiến dịch ghim lại — số thật, lần đầu

Làn một lượt trên trọn 72 hồ sơ đã thông Cổng Bằng chứng, tại `26bf12fe`.

| số đo | giá trị |
|---|---|
| lệnh suite | 5, tất cả exit 0 |
| lệnh eval phân biệt | 215 (từ 741 eval máy, làn dùng lại lệnh trùng) |
| thời gian máy | 2 giờ 25 phút |
| tệp hồ sơ đã ký bị executor chạm | 0 trên 861 tệp của 72 hồ sơ |
| hồ sơ có eval đỏ | 14 trên 72 |
| eval đỏ | 60 |
| hồ sơ được ghim lại | **0** — làn đỏ thì không ghi gì, kể cả cho 58 hồ sơ xanh |

**Mười bốn hồ sơ đỏ**, theo số eval đỏ trên tổng eval máy của hồ sơ:
`luu-kho-codex-va-nghi-le-design` 23/24 · `cat-hinh-thuc` 12/14 ·
`cat-khoi-viec-cua-anh-tren-tin` 4/6 · `eval-khai-ma-thoat-mong-doi` 4/13 ·
`thuoc-khai-mot-dang-do-mot-neo` 4/10 · `doi-hanh-vi-cong-nguoi` 3/9 ·
`duong-lui-phai-song` 3/15 · `cong-dang-co-cua` 1/3 · `inputs-tinh-tu-goc-kho` 1/8 ·
`release-2-14-0` 1/9 · `release-2-15-0` 1/19 · `start-bang-dieu-khien` 1/14 ·
`thuoc-nhan-de-khoi` 1/9 · `veto-co-dau-vet` 1/11.

**Ba lớp nguyên nhân, mỗi lớp một ca đã đọc tận thông điệp.**

- **Lớp một — răng đo một ĐẠI LƯỢNG DI ĐỘNG theo HEAD, nên KHÔNG BAO GIỜ ghim lại được.**
  `release-2-14-0` đỏ ở răng đếm tồn đọng ghim lại: hồ sơ chép tay số 44, lưới hôm nay nói
  49. `release-2-15-0` đỏ ở chân đếm việc của cửa sổ: neo dời sang lần cắt số mới, nên
  chính hồ sơ mốc ấy nay CÓ SẴN ở neo và đối chứng dương của nó dừng mã 2. Hai ca này
  không phải «mất tiền đề» — chúng đúng ở ngày ký và sai mãi mãi sau đó, theo thiết kế.
- **Lớp hai — răng dựng bản sao cây rồi trỏ tới tệp đã đổi chỗ hoặc biến mất.**
  `cat-hinh-thuc` là ca nặng nhất còn đọc được: bản sao tạm không có tệp SKILL mà răng
  cần, nên 25 phép đo của nó đỏ cùng lượt. Đây là lớp mà GUIDE §7.1 đã gọi tên từ 07/09.
- **Lớp ba — vật đã đổi sau chữ ký, răng còn đo văn bản cũ.**
  `cat-khoi-viec-cua-anh-tren-tin` đỏ vì khối lệnh một-dòng nay thiếu một luật âm mà răng
  đòi và cấu trúc ô đã đổi; `duong-lui-phai-song` đỏ vì khối đổi cờ nên chiều đỏ của nó
  không còn chạy được; `eval-khai-ma-thoat-mong-doi` đỏ ở chân đọc tài liệu.

**Điều số này nói.**

- **Chiến dịch dạng hiện tại KHÔNG dùng được, và nay có số thay cho phán đoán.** R3 của
  hai cửa sổ trước hoãn nó bằng lý lẽ; lượt này trả 2 giờ 25 phút máy để đổi lấy 0 hồ sơ
  được ghim. Tỉ lệ hỏng không nhỏ và lẻ tẻ mà tập trung: 35 trên 60 eval đỏ nằm ở hai hồ
  sơ.
- **Luật «làn đỏ thì không ghi gì» đúng về nguyên tắc và đắt về thực tế.** Nó giữ cho
  không ai ký mù, nhưng ở quy mô 72 hồ sơ nó biến một hồ sơ hỏng thành 71 hồ sơ không
  được ghim. Đây là lý do «ghim lại theo diff» — hoặc chí ít là ghim lại theo LÔ — không
  còn là tối ưu hoá mà là điều kiện tồn tại.
- **Lớp một chạm chính hồ sơ mốc, kể cả hồ sơ này.** Xem Known limits: hai chân răng của
  `release-2-16-0` chắc chắn sẽ đỏ ở chiến dịch kế, cùng lớp với `release-2-15-0`. Hồ sơ
  khai thẳng thay vì vá riêng cho mình — vá một bản sao là để nguyên lớp sống ở mọi bản
  còn lại.
- **Chốt chụp cây hồ sơ đã ký chạy sạch ở quy mô thật:** 861 tệp của 72 hồ sơ, 0 tệp bị
  chạm sau 215 lệnh. Vật mà mốc 2.15.0 ship có lượt đo đầu tiên ở quy mô đầy đủ, và nó im
  đúng chiều.

### 5. Nhát cắt cho cửa sổ kế — gọi tên

0. **CHỖ CẮT CHÍNH, số của mốc này chỉ thẳng vào: răng của một hồ sơ đã ký phải đo một sự
   thật LỊCH SỬ, không đo một đại lượng di động.** Ba hồ sơ mốc liên tiếp mắc cùng lớp —
   `release-2-14-0` chép tay một con số sẽ trôi, `release-2-15-0` neo vào «lần cắt số trước
   suy từ kho» nên neo dời là đối chứng dương của nó sập, và `release-2-16-0` sẽ là thứ ba
   vì nó chép đúng khuôn ấy. Nhát sửa rẻ nhất: khi hồ sơ được KÝ, neo mà răng suy từ kho
   được GHIM vào hợp đồng, và từ đó răng đọc neo đã ghim thay vì suy lại. Nhát ấy không
   thuộc mốc này — nó chạm khuôn răng của mọi hồ sơ mốc, nên phải là một vòng có tên.
1. **Router là vòng meta của cửa sổ 2.16 → 2.17** — owner đã chốt (Q3 17/09), giữ nguyên.
   Chỗ cắt số 0 ở trên là ứng viên cạnh nó, owner chọn.
2. **Chỗ cắt gọi tên cho cửa sổ kế: ngưỡng REJECT của phát hiện trong hợp đồng.** Đây là
   nhát cắt rẻ nhất mà số của cửa sổ này chỉ thẳng vào: một phát hiện mức TRUNG trong hợp
   đồng trôi tới thẻ và tốn đúng một lượt gọi người ngoài thiết kế. Hai lối: bộ chấm
   REJECT ở mức trung khi phát hiện nằm TRONG hợp đồng, hoặc thẻ trình mục ấy ở khối
   việc-của-người thay vì trộn vào «máy đã lo». Chưa đề bài, chưa hồ sơ.
3. **Đếm lượt THI CÔNG bị hạ tầng đốt, không chỉ lượt chấm.** Dòng 3 của luật (c) hôm nay
   mù với một lớp đã tốn 3 h 19 và 1,53 M token trong cửa sổ này.
4. **Khối tìm-lỗi ở vòng không có làn giao diện.** 71,2 % là con số của một vòng kit thuần
   máy. Spec token đã đóng câu hỏi của nó cho vòng có làn `ui`; vòng không có làn ấy chưa
   ai đo lại.
5. **Vật máy giữ cho số chạm.** Mục tiêu «≤1 chạm/lượt» không có thước; nó sẽ còn là lời
   hứa cho tới khi có một vật ghi lại.
6. **Ghim lại theo diff, hoặc chí ít theo LÔ** — nay có số: một lượt trọn tốn 2 giờ 25
   phút máy và ghim được 0 hồ sơ, vì luật «làn đỏ thì không ghi gì» biến 14 hồ sơ hỏng
   thành 72 hồ sơ không được ghim. Lối rẻ nhất mà không đụng luật ấy: chia thành nhiều
   lượt làn nhỏ, lượt nào xanh thì ghim lượt đó. 58 trên 72 hồ sơ lẽ ra đã ghim được.
7. **Đo hiệu lực khuôn `/goal`** — ngưỡng đặt ở 2.15.0, hai cửa sổ chưa đọc được.

- Thước tự dối: không dán cụm hình glob vào văn hồ sơ; mọi mẫu ở đây nói bằng chữ.
