---
schema_version: 1
feature: Phát hành kit 2.14.0 — cắt số cho hai gói kit và định đoạt công khai chiến dịch ghim lại đang hoãn mốc thứ hai. HẠ VỀ DRAFT 15/09 chờ PR #176 merge; bốn khối sự thật phải dựng lại từ cây sau merge.
slug: release-2-14-0
owner: phanlemanh@gmail.com
risk_tier: T2               # chạm hai manifest + GUIDE; KHÔNG chạm t3_paths (hooks, lib, pre-merge-check.sh, recheck-evidence.cjs)
surfaces: [cli]
status: draft
approved_by:
approved_at:
---

# Acceptance Contract: release-2-14-0

## Context

> **HẠ VỀ DRAFT 15/09 — chờ PR #176 merge.** Hồ sơ này từng được duyệt ở
> `87355094`, rồi hạ lại cùng ngày khi phát hiện một phiên KHÁC («Tiêu thụ token và hiệu
> suất ký») đang giữ PR #176 với hai hồ sơ nữa của cùng cửa sổ — một đã ký
> (`chu-ky-khong-tu-lam-hoa-cu`, ADR 0019) và một draft. Bốn khối dưới đây dựng trên một
> cây CHƯA có #176 nên sẽ sai khi nó vào:
>
> 1. **Context** khai cửa sổ đổi đúng MỘT tệp engine — #176 chạm `repin-lane.mjs`,
>    `commands/signoff.md`, `skills/acceptance/SKILL.md`, tức cả hai gói.
> 2. **Bảng năm dòng** đếm MỘT vòng — cửa sổ thật có ÍT NHẤT HAI vòng đã ký.
> 3. **§4** xếp `routing-baseline` đầu bảng cho cửa sổ sau — #176 thêm
>    `tests/scripts/routing-baseline.mjs` và ca T1 cho nó, tức nhát ấy đã làm.
> 4. **Ô `so_stale`** ghim 43 — mục đích của #176 đúng là làm chữ ký thôi tạo hoá cũ, nên
>    con số sẽ đổi; răng `rang-ton-dong.sh` sẽ ĐỎ, đúng như nó được dựng để làm.
>
> Việc khi #176 merge: dựng lại bốn khối từ cây sau merge bằng đúng các lệnh đã dùng, rồi
> trình lại Cổng Phạm vi. KHÔNG bump số trước bước đó.


Cửa sổ 2.13 → 2.14 dùng đúng MỘT vòng meta theo luật (b): `do-tin-tram-phan-loai` — độ tin
của trạm phân loại phạm vi, ký 15/09 sau ba lượt chấm. Một vòng thứ hai (`mot-nguon-tai-gui-triage`,
từ Ngoài-1 của vòng trên) được mở rồi **owner đóng lại cùng ngày** sau khi đo cho thấy hại
nhỏ hơn hẳn mức tác tử chấm xếp hạng; đề bài nằm trọn ở hạt giống.

Cửa sổ cũng đổi một luật: ADR 0017 → **ADR 0018** trong cùng ngày. Vế «có thể CỘNG» giữ
nguyên nhưng CỘNG phải owner phê từng ca; đoạn luật trong `CLAUDE.md` từ 29 dòng xuống 15.

**Cửa sổ này đổi đúng MỘT tệp engine**: `feature-loop/workflows/acceptance-verify.js`
(+81 / −26). Mọi thứ còn lại là tệp ca, hồ sơ, văn bản luật. Hai gói kit vẫn cùng lên một
số vì đó là bất biến ca P200 canh — **số đặt tên cho bản phát hành của KIT, không đặt tên
cho từng gói**; `diagram-design` là ngoại lệ đã khai, có răng riêng.

## Criteria

### AC-1 (cắt số) — MỘT số, nhất quán ở mọi bề mặt người dùng đọc

**Given** cây tại HEAD của hồ sơ mốc
**When** chạy `rang-p200.sh` của hồ sơ này (bọc ca thường trực `P200`)
**Then** hai plugin `acceptance-gate` và `feature-loop` cùng mang MỘT số; số hợp semver;
`GUIDE.md` dẫn xuất số ĐÓ từ manifest chứ không gõ tay; mục mô tả của số đó nói người dùng
nhận gì; `feature-loop` tự khai cặp `acceptance-gate >= <số đó>`. Vế giá trị — số ấy là
**2.14.0** — nằm trong chính gói được ký, owner xác nhận trên thẻ; răng canh tính NHẤT QUÁN,
không ghim con số.

**VÀ số phải TĂNG.** Chạy `rang-so-tang.sh`: số ở cây phải lớn hơn theo semver số tại lúc hồ
sơ mốc này ra đời, neo suy TỪ KHO. Không có vế này thì quên hẳn bước nâng số vẫn cho mọi eval
xanh — hai manifest nhất quán ở số CŨ, GUIDE dẫn xuất đúng số cũ, cặp phụ thuộc khớp — và một
bản «phát hành 2.14.0» ra cửa mang số 2.13.0. Phản biện context sạch gọi tên lỗ này; bản đầu
của chính răng ấy cũng xanh oan vì neo sai (so với «lần cắt gần nhất» thay vì với hồ sơ), đã
sửa và có chiều đỏ.

### AC-2 (gói không đổi thì GIỮ số) — diagram-design ở 2.7.0, chứng bằng cửa sổ diff

**Given** cây tại HEAD
**When** chạy `rang-moc.sh --chan diagram`
**Then** `diagram-design/` không đổi một dòng nào kể từ lần cắt số gần nhất, và số đọc được
tại HEAD là 2.7.0. Đối chứng dương trong cùng lượt: cửa sổ `mốc..HEAD` KHÔNG rỗng và bộ lọc
`diagram-design/` còn khớp vật — nếu không thì «không đổi» chỉ nghĩa là phép đo chưa chạy.

### AC-3 (hồi quy) — bốn suite và bản đồ sản phẩm

**Given** cây tại HEAD
**When** chạy bốn suite của kho cùng `product-map --check`
**Then** cả năm lệnh exit 0. Cửa sổ này chạm engine chấm điểm, nên hồi quy là chỗ dựa duy
nhất cho câu «không làm trôi cái gì».

### AC-4 (judgment) — bốn khối Notes đủ mặt, năm dòng số có nguồn rút

**Given** khối `## Notes` của hợp đồng này
**When** hội đồng đọc nó cùng `usage-report.md` của vòng `do-tin-tram-phan-loai`
**Then** đủ bốn khối bắt buộc (năm dòng số · lớp vendored · lớp lỗi tái phát · nhát cắt cho
cửa sổ kế); mỗi ô có nguồn rút gọi tên; hai dòng MÁY ĐO khớp từng chữ số với nguồn. Và khối
năm dòng phải nói thẳng điều số đang nói, kể cả khi nó bất lợi: token/lượt KHÔNG giảm so với
mốc trước.

### AC-5 (chiến dịch ghim lại) — con số trong hồ sơ là số lưới đang nói, không phải số chép

**Given** hồ sơ này khai một cặp số-hồ-sơ-hoá-cũ và mốc so trong khối marker
**When** chạy `rang-ton-dong.sh --chan ghim-lai`
**Then** con số ấy BẰNG con số lưới trước-merge đếm được hôm nay ở đúng mốc ấy, đo bằng
CHÍNH lưới đó chứ không bằng một phép đếm thứ hai. Chiều đỏ ghim mã: 3 hai số lệch · 4 hồ sơ
không khai đủ cặp · 2 không chạy được lưới · 5 lưới không tới kết luận. Vì sao cần răng cho
một con số: chiến dịch bị hoãn mốc thứ hai liên tiếp, và mỗi lần hoãn thì hồ sơ lại chép con
số của lần trước — số chép tay hoá cũ lặng lẽ rồi mốc sau đọc nó như sự thật.

## Coverage

Mốc phát hành là bài toán liệt-kê-đủ theo BỀ MẶT người dùng đọc số, không theo tổ hợp. Trục
lấy nguyên từ ca thường trực P200 — nó đã là bản liệt kê đã duyệt, dựng lại là tạo nguồn thứ
hai.

- **Trục bề mặt** `[thước CE: ca P200 trong tests/plugins/run-tests.sh]`: manifest gói một ·
  manifest gói hai · số dẫn xuất trong GUIDE · mục mô tả của chính số đó · cặp phụ thuộc mà
  feature-loop tự khai. → AC-1.
- **Trục gói** `[thước CE: ba manifest có thật trong kho]`: hai gói kit lên số · gói thứ ba
  giữ số. → AC-1 và AC-2.
- **Trục việc-của-mốc** `[thước CE: luật re-pin-theo-release và luật (c)]`: hồi quy · bốn
  khối Notes · chiến dịch ghim lại. → AC-3, AC-4, AC-5.

## Out of scope

- **Chạy chiến dịch ghim lại 43 hồ sơ** — hoãn mốc thứ hai liên tiếp, và hoãn CÔNG KHAI: AC-5
  bắt hồ sơ mang con số thật có răng canh, thay vì im lặng bỏ qua. Điều kiện tiên quyết
  («ghim lại theo diff», hồ sơ 2.13 §4 mục 1) vẫn chưa làm, nên chạy chiến dịch bây giờ là
  một khoản giờ máy lớn lặp lại ở mọi mốc.
- Sáu mục Known limits của `do-tin-tram-phan-loai` — ở tệp ca và chẩn đoán nội bộ, không phải
  việc của mốc.
- Nhát vá cho hạt giống `mot-nguon-tai-gui-triage` — owner đã park; mốc này KHÔNG kéo vào.
- Sáu mục còn lại của hồ sơ 2.13 §4 — chưa làm, giữ nguyên trong sổ tồn đọng.
- Dựng phép đo mới cho chính phép đo của mốc — luật (a).

## Notes

<!-- <<<TON-DONG-GHIM-LAI -->
so_stale: 43
moc_so: 7d12ffad
<!-- TON-DONG-GHIM-LAI>>> -->

### 1. Năm dòng số của luật (c)

Cửa sổ 2.13 → 2.14 có đúng MỘT vòng đã ship: `do-tin-tram-phan-loai`. Ba dòng đầu đếm tay,
hai dòng sau máy đo.

| Dòng | Số | Nguồn rút |
|---|---|---|
| 1 làm-xong → quyết-được | **3h59** | ts dòng `round` đầu của `run-log.jsonl` (`2026-09-15T02:32:50Z`) → commit Cổng 2 `c47ae5f8` (`2026-09-15T06:31:28Z`) |
| 2 lượt gọi người/vòng | **4** — trong thiết kế **3**, ngoài thiết kế **1** | đếm tay từ phiên đã chạy vòng |
| 3 vòng bị hạ-tầng-kit đốt lượt chấm | **0** trên 3 lượt | không lượt chấm nào BLOCKED hay đỏ giả; hạ tầng đốt MỘT LÀN ghim lại (LM20), không đốt lượt chấm |
| 4 token máy/**lượt** | **19.223.828** ở lượt PASS · cả vòng ba lượt **53.974.767** | `usage-report.md`; NỀN: ba dòng tổng per-model của mục `S4 round 3` (out + in + cache_read + cache_create) — cùng nền mốc 2.13.0 dùng |
| 4b ba khối của lượt PASS | tìm-lỗi **75,4 %** · chứng-minh-vật **18,9 %** · tổng hợp **5,7 %** | NỀN KHÁC, khai rõ: **bảng vai trò** của cùng mục, tổng **17.519.441** (out + in + cache_read; bảng không có cột cache_create, nên lệch 1.704.387 ≈ 8,9 % so với ô trên). ÁNH XẠ vai-trò → khối: `review`+`refute` → tìm-lỗi · `machine`+`baseline`+`triage`+`capture` → chứng-minh-vật · `synthesize` → tổng hợp. Luật (c) kê chứng-minh-vật là machine+ui+judge+baseline; `triage` (0,5 %) và `capture` (0,8 %) không nằm trong bảng kê nên xếp vào đây có chủ ý — cả hai thuộc đường phán quyết, không sinh phát hiện và không tổng hợp |
| 5 phút máy/lượt chấm | **15,3 phút** ở lượt PASS; ba lượt 15,3 · 37,0 · 15,3 | cùng tệp, dòng `wall` của từng mục |

**Ba lượt gọi người trong thiết kế:** Cổng Phạm vi · chốt DỪNG-VÁ · Cổng Bằng chứng. Chốt
DỪNG-VÁ là điểm dừng có trong luật, không phải máy tự chèn.

**Một lượt NGOÀI thiết kế, gọi đúng tên:** sau khi sửa xong theo quyết định ở chốt DỪNG-VÁ,
máy báo trạng thái rồi **ngừng nói**, và người phải gõ «chạy lượt chấm 3 đi». SKILL feature-loop
gọi đúng hình dạng ấy: tiến trình nền báo xong giữa một đoạn máy thì phải đi tiếp trong CÙNG
lượt; «báo cáo rồi ngừng nói» là một lần dừng ngoài thiết kế. Bốn so trần ba tức **vượt một**,
và lượt vượt là lỗi của máy, không phải của luật.

**Lượt gọi người ở HAI mốc liên tiếp, và điều kiện thu hồi.** Mốc 2.13.0 ghi **4** lượt
(trong thiết kế 1, ngoài thiết kế 3) so trần T2 là 3 — vượt. Mốc này ghi **4** (trong thiết
kế 3, ngoài 1) — cũng vượt. Hai mốc liên tiếp vượt trần. Luật NỚI 07/09 gắn đúng con số ấy
vào một điều kiện thu hồi tự động; **điều kiện ấy nay KHÔNG CÒN**: ADR 0018 (15/09) thay luật
NỚI bằng «CỘNG không cấm nhưng phải owner phê từng ca», và bỏ hẳn cả luật giám sát riêng lẫn
điều kiện thu hồi tự động. Nói ra ở đây để hồ sơ sau không đọc thành «điều kiện chưa bao giờ
chạm»: nó ĐÃ chạm theo số, và nó hết hiệu lực vì luật đã đổi, không phải vì số đẹp lên.

**Đọc dòng 4 cho đúng — số đang nói điều bất lợi.** Mốc 2.13.0 ghi lượt PASS của vòng nó là
16,7 M, tìm-lỗi 79,9 %. Lượt PASS ở đây là **19,2 M, tìm-lỗi 75,4 %** (hai con số tuyệt đối
cùng nền) — token/lượt KHÔNG
giảm, và khối tìm-lỗi vẫn ăn ba phần tư. Đây là so CHÉO hai vòng khác đề bài nên không kết
luận được về hiệu quả nhát cắt 2.13.0; nhưng nó đủ để nói một điều chắc chắn: **cửa sổ này
không có bằng chứng nào cho thấy chi phí một lượt chấm đã giảm.** Số «sau» chính thức vẫn
chưa tới hạn — nó đọc ở kho TIÊU THỤ, không phải trong kho kit.

### 2. Lớp vendored — KHÔNG mục nào đổi trong cửa sổ

`git diff --stat <mốc 2.13.0>..HEAD -- vendor/` trả về RỖNG. Cửa sổ có một vòng và vòng ấy
chạm đúng một tệp trong `feature-loop/workflows/`, không chạm cây vendor. Tree-hash trong
`NOTICE` của cây vendor vì thế còn nguyên (P196 giữ).

### 3. Lớp lỗi TÁI PHÁT trong cửa sổ

**Lớp một — «assertion âm-tính-một-mình», nổ DỪNG-VÁ.** Lượt chấm 1 của `do-tin-tram-phan-loai`
trả một mục thuộc lớp này; lượt 2 trả **bốn** mục cùng lớp trên chính tiêu chí vừa vá. Luật
DỪNG-VÁ nổ đúng chỗ, và chẩn đoán cho thấy khuôn sai nằm ở phần MÁY tự thêm vào hợp đồng
(một tiêu chí bắt chứng tính chất phủ định trên chín bộ đọc khác giao diện), không ở phần
owner đặt hàng. Owner thu phạm vi; khuôn tự-sinh-finding biến mất.

**Lớp hai — «routing-baseline đỏ vì hồ sơ mới ký», lần thứ BA liên tiếp.** Chữ ký
`khoi-tim-loi-tra-phi-theo-vat` 14/09 · chữ ký `release-2-13-0` 15/09 · chữ ký
`do-tin-tram-phan-loai` 15/09. Cả ba lần: eval của hồ sơ xanh trọn, đỏ đến từ hạ tầng kho,
và mỗi lần đốt một làn 12 phút ngay trước chữ ký của người. Ba lần đếm — mục này thôi là dự
đoán.

**Lớp ba — «đo chỉ dẫn thay vì đầu ra» và «đo đếm thay vì quan hệ».** Xuất hiện ở cả lượt 1
và lượt 2; đóng bằng cách đọc lược đồ từ vật tác tử NHẬN thay vì grep nguồn, và đo quan hệ
tệp↔phân loại thay vì đếm đủ ba.

### 4. Nhát cắt cho cửa sổ kế — gọi tên, theo thứ tự PHỤ THUỘC

1. **Ghim lại theo diff.** Chưa làm ở cửa sổ này; vẫn là điều kiện tiên quyết của mục 2. Đề
   bài đầy đủ ở `docs/plans/2026-09-14-hat-giong-ba-cho-cat-sau-chu-ky-cua-so-2-13.md` mục 1.
2. **Chiến dịch ghim lại 43 hồ sơ.** Hoãn mốc thứ hai; số có răng canh ở AC-5 nên nó không
   hoá cũ lặng lẽ.
3. **`routing-baseline` không được đỏ vì hồ sơ mới ký.** Ba lần đếm, mỗi lần một làn 12 phút.
   Rẻ và có số — đây là nhát đáng làm nhất của cửa sổ 2.15.
4. **Tải gửi trạm phân loại về MỘT nguồn** — hạt giống
   `docs/plans/2026-09-15-hat-giong-mot-nguon-tai-gui-triage.md`, đề bài dùng được ngay;
   khuyến nghị vá trong hồ sơ mốc chứ không mở vòng.
5. **Ba mục còn lại của `release-2-12-0` §4** và các mục chưa làm của 2.13 §4.

- Thước tự dối: không dán glob-literal vào văn hồ sơ (P161 quét corpus); mọi mẫu ở đây nói
  bằng chữ.
